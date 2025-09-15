/**
 * Script para Aplicar Produção de Recursos a Todos os Países
 * Calcula e define a produção mensal baseada nas características de cada país
 */

import { db } from '../js/services/firebase.js';
import { showNotification, showConfirmBox } from '../js/utils.js';
import ResourceProductionCalculator from '../js/systems/resourceProductionCalculator.js';

export async function applyResourceProduction() {
  try {
    const confirmed = await showConfirmBox(
      'Aplicar Produção de Recursos',
      'Esta ação irá calcular e definir a produção mensal de recursos para todos os países baseado em sua população, PIB per capita, tecnologia, geografia e clima. Esta operação pode ser executada múltiplas vezes. Continuar?',
      'Sim, aplicar produção',
      'Cancelar'
    );

    if (!confirmed) {
      showNotification('info', 'Operação cancelada pelo usuário.');
      return;
    }

    showNotification('info', 'Iniciando cálculo de produção de recursos...');
    console.log('=== CALCULANDO PRODUÇÃO DE RECURSOS ===');

    const querySnapshot = await db.collection('paises').get();
    const batch = db.batch();
    const results = [];
    let updatedCount = 0;

    querySnapshot.forEach(doc => {
      const country = doc.data();
      const countryName = country.Pais || country.Nome || doc.id;

      try {
        // Calcular produção
        const production = ResourceProductionCalculator.calculateCountryProduction(country);
        const balance = ResourceProductionCalculator.calculateResourceBalance(country);
        const report = ResourceProductionCalculator.generateProductionReport(country);

        // Preparar updates para o Firebase
        const updates = {
          // Produção mensal
          ProducaoGraos: production.Graos,
          ProducaoCombustivel: production.Combustivel,
          ProducaoMetais: production.Metais,
          ProducaoCarvao: production.Carvao,
          ProducaoEnergia: production.Energia,

          // Metadados do cálculo
          'ProducaoCalculada': {
            timestamp: production._metadata.calculatedAt,
            developmentLevel: production._metadata.developmentLevel,
            climateZone: production._metadata.climateZone,
            multiplier: production._metadata.devMultiplier,
            geographicBonuses: production._metadata.geographicBonuses
          }
        };

        batch.update(doc.ref, updates);
        updatedCount++;

        results.push({
          country: countryName,
          production,
          balance,
          report
        });

        // Log detalhado
        console.log(`${countryName}:`, {
          PIB_per_capita: production._metadata.pibPerCapita,
          desenvolvimento: production._metadata.developmentLevel,
          clima: production._metadata.climateZone,
          bonus_geograficos: production._metadata.geographicBonuses,
          producao: {
            Graos: production.Graos,
            Combustivel: production.Combustivel,
            Metais: production.Metais,
            Carvao: production.Carvao,
            Energia: production.Energia
          },
          recursos_superavit: report.summary.surplusResources,
          recursos_deficit: report.summary.deficitResources
        });

      } catch (error) {
        console.error(`Erro ao calcular produção para ${countryName}:`, error);
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      showNotification('success', `Produção calculada para ${updatedCount} países!`);

      // Gerar estatísticas
      generateProductionStatistics(results);

      console.log(`✅ Produção aplicada com sucesso para ${updatedCount} países`);
    } else {
      showNotification('warning', 'Nenhum país foi processado.');
    }

  } catch (error) {
    console.error('Erro ao aplicar produção:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
}

/**
 * Gera estatísticas detalhadas de produção
 */
function generateProductionStatistics(results) {
  console.log('\n=== ESTATÍSTICAS DE PRODUÇÃO ===');

  // Ordenar por produção total
  const sortedByProduction = results
    .map(r => ({
      country: r.country,
      totalProduction: r.production.Graos + r.production.Combustivel + r.production.Metais + r.production.Carvao + r.production.Energia,
      production: r.production,
      developmentLevel: r.production._metadata.developmentLevel
    }))
    .sort((a, b) => b.totalProduction - a.totalProduction);

  console.log('\n🏆 TOP 10 MAIORES PRODUTORES:');
  sortedByProduction.slice(0, 10).forEach((country, index) => {
    console.log(`${index + 1}. ${country.country} - Total: ${country.totalProduction} (${country.developmentLevel})`);
  });

  // Análise por nível de desenvolvimento
  const byDevelopment = {};
  results.forEach(r => {
    const level = r.production._metadata.developmentLevel;
    if (!byDevelopment[level]) {
      byDevelopment[level] = [];
    }
    byDevelopment[level].push(r);
  });

  console.log('\n📊 PRODUÇÃO MÉDIA POR NÍVEL DE DESENVOLVIMENTO:');
  Object.entries(byDevelopment).forEach(([level, countries]) => {
    const avgProduction = {
      Graos: Math.round(countries.reduce((sum, c) => sum + c.production.Graos, 0) / countries.length),
      Combustivel: Math.round(countries.reduce((sum, c) => sum + c.production.Combustivel, 0) / countries.length),
      Metais: Math.round(countries.reduce((sum, c) => sum + c.production.Metais, 0) / countries.length),
      Energia: Math.round(countries.reduce((sum, c) => sum + c.production.Energia, 0) / countries.length)
    };

    console.log(`${level} (${countries.length} países):`, avgProduction);
  });

  // Países com superávit significativo
  const surplusCountries = results.filter(r => r.report.summary.surplusResources.length > 0);

  if (surplusCountries.length > 0) {
    console.log('\n✅ PAÍSES COM SUPERÁVIT SIGNIFICATIVO (> 100 unidades):');
    surplusCountries.slice(0, 15).forEach(country => {
      console.log(`${country.country}: ${country.report.summary.surplusResources.join(', ')}`);
    });
  }

  // Países com déficit
  const deficitCountries = results.filter(r => r.report.summary.deficitResources.length > 0);

  if (deficitCountries.length > 0) {
    console.log('\n⚠️ PAÍSES COM DÉFICIT (< -50 unidades):');
    deficitCountries.forEach(country => {
      console.log(`${country.country}: ${country.report.summary.deficitResources.join(', ')}`);
    });
  }

  // Análise por bônus geográficos
  const geographicBonuses = {};
  results.forEach(r => {
    r.production._metadata.geographicBonuses.forEach(bonus => {
      if (!geographicBonuses[bonus]) {
        geographicBonuses[bonus] = [];
      }
      geographicBonuses[bonus].push(r.country);
    });
  });

  console.log('\n🌍 PAÍSES POR VANTAGEM GEOGRÁFICA:');
  Object.entries(geographicBonuses).forEach(([bonus, countries]) => {
    console.log(`${bonus}: ${countries.length} países - ${countries.slice(0, 5).join(', ')}${countries.length > 5 ? '...' : ''}`);
  });

  // Balanço energético global
  const energyBalance = results.reduce((sum, r) => sum + r.balance.Energia, 0);
  console.log(`\n⚡ BALANÇO ENERGÉTICO GLOBAL: ${energyBalance > 0 ? '+' : ''}${Math.round(energyBalance)} MW`);
}

/**
 * Simula produção por alguns turnos para teste
 */
export async function simulateProductionTurns(turns = 6) {
  try {
    console.log(`\n=== SIMULAÇÃO DE PRODUÇÃO - ${turns} TURNOS ===`);

    const querySnapshot = await db.collection('paises').get();
    const results = [];

    querySnapshot.forEach(doc => {
      const country = doc.data();
      const countryName = country.Pais || country.Nome || doc.id;

      const production = ResourceProductionCalculator.calculateCountryProduction(country);
      const consumption = {
        Graos: parseFloat(country.ConsumoGraos) || 0,
        Combustivel: parseFloat(country.ConsumoCombustivel) || 0,
        Metais: parseFloat(country.ConsumoMetais) || 0,
        Carvao: parseFloat(country.ConsumoCarvao) || 0,
        Energia: parseFloat(country.ConsumoEnergia) || 0
      };

      // Simular acúmulo por N turnos
      const simulation = {
        country: countryName,
        initialStocks: {
          Graos: parseFloat(country.Graos) || 0,
          Combustivel: parseFloat(country.Combustivel) || 0,
          Metais: parseFloat(country.Metais) || 0,
          Carvao: parseFloat(country.CarvaoSaldo) || 0
        },
        monthlyBalance: {},
        afterTurns: {}
      };

      // Calcular balanço mensal e estoques após N turnos
      Object.keys(simulation.initialStocks).forEach(resource => {
        const monthlyBalance = production[resource] - consumption[resource];
        simulation.monthlyBalance[resource] = monthlyBalance;
        simulation.afterTurns[resource] = Math.max(0,
          simulation.initialStocks[resource] + (monthlyBalance * turns)
        );
      });

      results.push(simulation);
    });

    // Encontrar países que terão crescimento ou declínio
    const growingCountries = results.filter(sim =>
      Object.values(sim.monthlyBalance).some(balance => balance > 50)
    );

    const decliningCountries = results.filter(sim =>
      Object.values(sim.monthlyBalance).some(balance => balance < -20)
    );

    console.log(`\n📈 PAÍSES EM CRESCIMENTO APÓS ${turns} TURNOS (balanço > +50):`);
    growingCountries.slice(0, 10).forEach(country => {
      const growingResources = Object.entries(country.monthlyBalance)
        .filter(([_, balance]) => balance > 50)
        .map(([resource, _]) => resource);

      console.log(`${country.country}: ${growingResources.join(', ')}`);
    });

    console.log(`\n📉 PAÍSES EM DECLÍNIO APÓS ${turns} TURNOS (balanço < -20):`);
    decliningCountries.slice(0, 10).forEach(country => {
      const decliningResources = Object.entries(country.monthlyBalance)
        .filter(([_, balance]) => balance < -20)
        .map(([resource, _]) => resource);

      console.log(`${country.country}: ${decliningResources.join(', ')}`);
    });

    showNotification('success', `Simulação concluída: ${growingCountries.length} países crescendo, ${decliningCountries.length} em declínio`);

  } catch (error) {
    console.error('Erro na simulação:', error);
    showNotification('error', 'Erro na simulação: ' + error.message);
  }
}