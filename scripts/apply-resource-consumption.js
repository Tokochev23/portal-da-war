/**
 * Script para Aplicar Consumo de Recursos a Todos os Países
 * Calcula e define o consumo mensal baseado nas características de cada país
 */

import { db } from '../js/services/firebase.js';
import { showNotification, showConfirmBox } from '../js/utils.js';
import ResourceConsumptionCalculator from '../js/systems/resourceConsumptionCalculator.js';

export async function applyResourceConsumption() {
  try {
    const confirmed = await showConfirmBox(
      'Aplicar Consumo de Recursos',
      'Esta ação irá calcular e definir o consumo mensal de recursos para todos os países baseado em sua população, PIB per capita, urbanização e industrialização. Esta operação pode ser executada múltiplas vezes. Continuar?',
      'Sim, aplicar consumos',
      'Cancelar'
    );

    if (!confirmed) {
      showNotification('info', 'Operação cancelada pelo usuário.');
      return;
    }

    showNotification('info', 'Iniciando cálculo de consumo de recursos...');
    console.log('=== CALCULANDO CONSUMO DE RECURSOS ===');

    const querySnapshot = await db.collection('paises').get();
    const batch = db.batch();
    const results = [];
    let updatedCount = 0;

    querySnapshot.forEach(doc => {
      const country = doc.data();
      const countryName = country.Pais || country.Nome || doc.id;

      try {
        // Calcular consumo
        const consumption = ResourceConsumptionCalculator.calculateCountryConsumption(country);
        const balance = ResourceConsumptionCalculator.calculateResourceBalance(country);
        const report = ResourceConsumptionCalculator.generateConsumptionReport(country);

        // Preparar updates para o Firebase
        const updates = {
          // Consumo mensal
          ConsumoGraos: consumption.Graos,
          ConsumoCombustivel: consumption.Combustivel,
          ConsumoMetais: consumption.Metais,
          ConsumoCarvao: consumption.Carvao,
          ConsumoEnergia: consumption.Energia,

          // Metadados do cálculo
          'ConsumoCalculado': {
            timestamp: consumption._metadata.calculatedAt,
            developmentLevel: consumption._metadata.developmentLevel,
            climateZone: consumption._metadata.climateZone,
            multiplier: consumption._metadata.devMultiplier
          }
        };

        batch.update(doc.ref, updates);
        updatedCount++;

        results.push({
          country: countryName,
          consumption,
          balance,
          report
        });

        // Log detalhado
        console.log(`${countryName}:`, {
          PIB_per_capita: consumption._metadata.pibPerCapita,
          desenvolvimento: consumption._metadata.developmentLevel,
          clima: consumption._metadata.climateZone,
          consumo: {
            Graos: consumption.Graos,
            Combustivel: consumption.Combustivel,
            Metais: consumption.Metais,
            Carvao: consumption.Carvao,
            Energia: consumption.Energia
          },
          recursos_criticos: report.summary.criticalResources,
          recursos_surplus: report.summary.surplusResources
        });

      } catch (error) {
        console.error(`Erro ao calcular consumo para ${countryName}:`, error);
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      showNotification('success', `Consumo calculado para ${updatedCount} países!`);

      // Gerar estatísticas
      generateConsumptionStatistics(results);

      console.log(`✅ Consumo aplicado com sucesso para ${updatedCount} países`);
    } else {
      showNotification('warning', 'Nenhum país foi processado.');
    }

  } catch (error) {
    console.error('Erro ao aplicar consumo:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
}

/**
 * Gera estatísticas detalhadas de consumo
 */
function generateConsumptionStatistics(results) {
  console.log('\n=== ESTATÍSTICAS DE CONSUMO ===');

  // Ordenar por consumo total
  const sortedByConsumption = results
    .map(r => ({
      country: r.country,
      totalConsumption: r.consumption.Graos + r.consumption.Combustivel + r.consumption.Metais + r.consumption.Carvao + r.consumption.Energia,
      consumption: r.consumption,
      developmentLevel: r.consumption._metadata.developmentLevel
    }))
    .sort((a, b) => b.totalConsumption - a.totalConsumption);

  console.log('\n🏆 TOP 10 MAIORES CONSUMIDORES:');
  sortedByConsumption.slice(0, 10).forEach((country, index) => {
    console.log(`${index + 1}. ${country.country} - Total: ${country.totalConsumption} (${country.developmentLevel})`);
  });

  // Análise por nível de desenvolvimento
  const byDevelopment = {};
  results.forEach(r => {
    const level = r.consumption._metadata.developmentLevel;
    if (!byDevelopment[level]) {
      byDevelopment[level] = [];
    }
    byDevelopment[level].push(r);
  });

  console.log('\n📊 CONSUMO MÉDIO POR NÍVEL DE DESENVOLVIMENTO:');
  Object.entries(byDevelopment).forEach(([level, countries]) => {
    const avgConsumption = {
      Graos: Math.round(countries.reduce((sum, c) => sum + c.consumption.Graos, 0) / countries.length),
      Combustivel: Math.round(countries.reduce((sum, c) => sum + c.consumption.Combustivel, 0) / countries.length),
      Metais: Math.round(countries.reduce((sum, c) => sum + c.consumption.Metais, 0) / countries.length)
    };

    console.log(`${level} (${countries.length} países):`, avgConsumption);
  });

  // Países com recursos críticos
  const criticalCountries = results.filter(r => r.report.summary.criticalResources.length > 0);

  if (criticalCountries.length > 0) {
    console.log('\n⚠️ PAÍSES COM RECURSOS CRÍTICOS (< 3 meses):');
    criticalCountries.forEach(country => {
      console.log(`${country.country}: ${country.report.summary.criticalResources.join(', ')}`);
    });
  }

  // Países com superávit
  const surplusCountries = results.filter(r => r.report.summary.surplusResources.length > 0);

  if (surplusCountries.length > 0) {
    console.log('\n✅ PAÍSES COM SUPERÁVIT (> 100 unidades):');
    surplusCountries.slice(0, 10).forEach(country => {
      console.log(`${country.country}: ${country.report.summary.surplusResources.join(', ')}`);
    });
  }

  // Análise por zona climática
  const byClimate = {};
  results.forEach(r => {
    const climate = r.consumption._metadata.climateZone;
    if (!byClimate[climate]) {
      byClimate[climate] = [];
    }
    byClimate[climate].push(r);
  });

  console.log('\n🌡️ CONSUMO MÉDIO POR ZONA CLIMÁTICA:');
  Object.entries(byClimate).forEach(([climate, countries]) => {
    const avgCombustivel = Math.round(countries.reduce((sum, c) => sum + c.consumption.Combustivel, 0) / countries.length);
    const avgCarvao = Math.round(countries.reduce((sum, c) => sum + c.consumption.Carvao, 0) / countries.length);

    console.log(`${climate} (${countries.length} países): Combustível ${avgCombustivel}, Carvão ${avgCarvao}`);
  });
}

/**
 * Simula consumo por alguns turnos para teste
 */
export async function simulateConsumptionTurns(turns = 3) {
  try {
    console.log(`\n=== SIMULAÇÃO DE ${turns} TURNOS ===`);

    const querySnapshot = await db.collection('paises').get();
    const results = [];

    querySnapshot.forEach(doc => {
      const country = doc.data();
      const countryName = country.Pais || country.Nome || doc.id;

      const consumption = ResourceConsumptionCalculator.calculateCountryConsumption(country);

      // Simular consumo por N turnos
      const simulation = {
        country: countryName,
        initialStocks: {
          Graos: parseFloat(country.Graos) || 0,
          Combustivel: parseFloat(country.Combustivel) || 0,
          Metais: parseFloat(country.Metais) || 0,
          Carvao: parseFloat(country.CarvaoSaldo) || 0
        },
        monthlyConsumption: {
          Graos: consumption.Graos,
          Combustivel: consumption.Combustivel,
          Metais: consumption.Metais,
          Carvao: consumption.Carvao
        },
        afterTurns: {}
      };

      // Calcular estoques após N turnos
      Object.keys(simulation.initialStocks).forEach(resource => {
        const remaining = simulation.initialStocks[resource] - (simulation.monthlyConsumption[resource] * turns);
        simulation.afterTurns[resource] = Math.max(0, remaining);
      });

      results.push(simulation);
    });

    // Encontrar países em crise
    const countriesInCrisis = results.filter(sim =>
      Object.values(sim.afterTurns).some(stock => stock === 0)
    );

    console.log(`\n🚨 PAÍSES EM CRISE APÓS ${turns} TURNOS:`);
    countriesInCrisis.slice(0, 10).forEach(country => {
      const depletedResources = Object.entries(country.afterTurns)
        .filter(([_, stock]) => stock === 0)
        .map(([resource, _]) => resource);

      console.log(`${country.country}: ${depletedResources.join(', ')} esgotados`);
    });

    showNotification('success', `Simulação concluída: ${countriesInCrisis.length} países teriam recursos esgotados`);

  } catch (error) {
    console.error('Erro na simulação:', error);
    showNotification('error', 'Erro na simulação: ' + error.message);
  }
}