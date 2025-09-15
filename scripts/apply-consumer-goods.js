/**
 * Script para Aplicar Bens de Consumo e Efeitos de Estabilidade
 * Calcula bens de consumo e aplica buffs/debuffs de estabilidade
 */

import { db } from '../js/services/firebase.js';
import { showNotification, showConfirmBox } from '../js/utils.js';
import ConsumerGoodsCalculator from '../js/systems/consumerGoodsCalculator.js';

export async function applyConsumerGoodsEffects() {
  try {
    const confirmed = await showConfirmBox(
      'Aplicar Efeitos de Bens de Consumo',
      'Esta ação irá calcular os bens de consumo para todos os países e aplicar os efeitos de estabilidade (+3% até -5%). Esta operação pode ser executada a cada turno. Continuar?',
      'Sim, aplicar efeitos',
      'Cancelar'
    );

    if (!confirmed) {
      showNotification('info', 'Operação cancelada pelo usuário.');
      return;
    }

    showNotification('info', 'Iniciando cálculo de bens de consumo...');
    console.log('=== CALCULANDO BENS DE CONSUMO E EFEITOS DE ESTABILIDADE ===');

    const querySnapshot = await db.collection('paises').get();
    const batch = db.batch();
    const results = [];
    let updatedCount = 0;

    querySnapshot.forEach(doc => {
      const country = doc.data();
      const countryName = country.Pais || country.Nome || doc.id;

      try {
        // Calcular bens de consumo
        const consumerGoods = ConsumerGoodsCalculator.calculateConsumerGoods(country);

        // Calcular efeito na estabilidade
        const stabilityEffect = ConsumerGoodsCalculator.applyStabilityEffect(country);

        // Gerar relatório
        const report = ConsumerGoodsCalculator.generateConsumerGoodsReport(country);

        // Preparar updates para o Firebase
        const updates = {
          // Bens de consumo (0-100%)
          BensDeConsumo: consumerGoods.level,

          // Nova estabilidade (aplicando o efeito)
          Estabilidade: stabilityEffect.newStability,

          // Metadados do cálculo
          'BensDeConsumoCalculado': {
            timestamp: consumerGoods.metadata.calculatedAt,
            production: consumerGoods.production,
            demand: consumerGoods.demand,
            satisfactionLevel: report.analysis.satisfactionLevel,
            stabilityEffect: stabilityEffect.stabilityEffect,
            effectDescription: stabilityEffect.effectDescription
          }
        };

        batch.update(doc.ref, updates);
        updatedCount++;

        results.push({
          country: countryName,
          consumerGoods,
          stabilityEffect,
          report
        });

        // Log detalhado
        console.log(`${countryName}:`, {
          bens_de_consumo: `${consumerGoods.level}%`,
          nivel_satisfacao: report.analysis.satisfactionLevel,
          estabilidade_anterior: stabilityEffect.currentStability,
          efeito_estabilidade: `${stabilityEffect.stabilityEffect > 0 ? '+' : ''}${stabilityEffect.stabilityEffect}%`,
          nova_estabilidade: stabilityEffect.newStability,
          descricao: stabilityEffect.effectDescription,
          producao_vs_demanda: `${consumerGoods.production}/${consumerGoods.demand}`
        });

      } catch (error) {
        console.error(`Erro ao calcular bens de consumo para ${countryName}:`, error);
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      showNotification('success', `Bens de consumo calculados para ${updatedCount} países!`);

      // Gerar estatísticas
      generateConsumerGoodsStatistics(results);

      console.log(`✅ Bens de consumo aplicados com sucesso para ${updatedCount} países`);
    } else {
      showNotification('warning', 'Nenhum país foi processado.');
    }

  } catch (error) {
    console.error('Erro ao aplicar bens de consumo:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
}

/**
 * Gera estatísticas detalhadas de bens de consumo
 */
function generateConsumerGoodsStatistics(results) {
  console.log('\n=== ESTATÍSTICAS DE BENS DE CONSUMO ===');

  // Ordenar por nível de bens de consumo
  const sortedByLevel = results
    .map(r => ({
      country: r.country,
      level: r.consumerGoods.level,
      stabilityEffect: r.stabilityEffect.stabilityEffect,
      satisfaction: r.report.analysis.satisfactionLevel
    }))
    .sort((a, b) => b.level - a.level);

  console.log('\n🏆 TOP 10 MELHORES BENS DE CONSUMO:');
  sortedByLevel.slice(0, 10).forEach((country, index) => {
    console.log(`${index + 1}. ${country.country} - ${country.level}% (${country.satisfaction})`);
  });

  console.log('\n📉 TOP 10 PIORES BENS DE CONSUMO:');
  sortedByLevel.slice(-10).reverse().forEach((country, index) => {
    console.log(`${index + 1}. ${country.country} - ${country.level}% (${country.satisfaction})`);
  });

  // Análise por nível de satisfação
  const bySatisfaction = {};
  results.forEach(r => {
    const level = r.report.analysis.satisfactionLevel;
    if (!bySatisfaction[level]) {
      bySatisfaction[level] = [];
    }
    bySatisfaction[level].push(r);
  });

  console.log('\n📊 PAÍSES POR NÍVEL DE SATISFAÇÃO:');
  Object.entries(bySatisfaction).forEach(([level, countries]) => {
    const avgLevel = Math.round(countries.reduce((sum, c) => sum + c.consumerGoods.level, 0) / countries.length);
    console.log(`${level}: ${countries.length} países (média: ${avgLevel}%)`);
  });

  // Países com maior ganho/perda de estabilidade
  const positiveEffects = results.filter(r => r.stabilityEffect.stabilityEffect > 0)
    .sort((a, b) => b.stabilityEffect.stabilityEffect - a.stabilityEffect.stabilityEffect);

  const negativeEffects = results.filter(r => r.stabilityEffect.stabilityEffect < 0)
    .sort((a, b) => a.stabilityEffect.stabilityEffect - b.stabilityEffect.stabilityEffect);

  if (positiveEffects.length > 0) {
    console.log('\n✅ PAÍSES COM GANHO DE ESTABILIDADE:');
    positiveEffects.slice(0, 10).forEach(country => {
      console.log(`${country.country}: +${country.stabilityEffect.stabilityEffect}% (${country.consumerGoods.level}% bens)`);
    });
  }

  if (negativeEffects.length > 0) {
    console.log('\n⚠️ PAÍSES COM PERDA DE ESTABILIDADE:');
    negativeEffects.slice(0, 10).forEach(country => {
      console.log(`${country.country}: ${country.stabilityEffect.stabilityEffect}% (${country.consumerGoods.level}% bens)`);
    });
  }

  // Estatísticas gerais
  const avgConsumerGoods = Math.round(results.reduce((sum, r) => sum + r.consumerGoods.level, 0) / results.length);
  const countriesInCrisis = results.filter(r => r.consumerGoods.level < 15).length;
  const countriesExcellent = results.filter(r => r.consumerGoods.level >= 85).length;

  console.log('\n📈 ESTATÍSTICAS GERAIS:');
  console.log(`Nível médio de bens de consumo: ${avgConsumerGoods}%`);
  console.log(`Países em crise (< 15%): ${countriesInCrisis}`);
  console.log(`Países com excelência (≥ 85%): ${countriesExcellent}`);
  console.log(`Efeito estabilidade médio: ${Math.round((results.reduce((sum, r) => sum + r.stabilityEffect.stabilityEffect, 0) / results.length) * 100) / 100}%`);
}

/**
 * Simula efeitos de bens de consumo por vários turnos
 */
export async function simulateConsumerGoodsOverTime(turns = 5) {
  try {
    console.log(`\n=== SIMULAÇÃO DE BENS DE CONSUMO - ${turns} TURNOS ===`);

    const querySnapshot = await db.collection('paises').get();
    const results = [];

    querySnapshot.forEach(doc => {
      const country = doc.data();
      const countryName = country.Pais || country.Nome || doc.id;

      // Simular evolução da estabilidade
      let currentStability = parseFloat(country.Estabilidade) || 50;
      const simulation = {
        country: countryName,
        initialStability: currentStability,
        turns: []
      };

      for (let turn = 1; turn <= turns; turn++) {
        // Criar country temporário com estabilidade atual
        const tempCountry = { ...country, Estabilidade: currentStability };

        const consumerGoods = ConsumerGoodsCalculator.calculateConsumerGoods(tempCountry);
        const stabilityEffect = ConsumerGoodsCalculator.applyStabilityEffect(tempCountry);

        currentStability = stabilityEffect.newStability;

        simulation.turns.push({
          turn,
          consumerGoods: consumerGoods.level,
          stabilityEffect: stabilityEffect.stabilityEffect,
          newStability: currentStability
        });
      }

      simulation.finalStability = currentStability;
      simulation.totalChange = currentStability - simulation.initialStability;

      results.push(simulation);
    });

    // Países com maior mudança
    const biggestChanges = results
      .sort((a, b) => Math.abs(b.totalChange) - Math.abs(a.totalChange))
      .slice(0, 10);

    console.log(`\n📊 MAIORES MUDANÇAS DE ESTABILIDADE EM ${turns} TURNOS:`);
    biggestChanges.forEach(country => {
      const change = country.totalChange > 0 ? `+${country.totalChange.toFixed(1)}` : country.totalChange.toFixed(1);
      console.log(`${country.country}: ${country.initialStability.toFixed(1)}% → ${country.finalStability.toFixed(1)}% (${change}%)`);
    });

    showNotification('success', `Simulação concluída: maiores mudanças de ${Math.abs(biggestChanges[0]?.totalChange || 0).toFixed(1)}%`);

  } catch (error) {
    console.error('Erro na simulação:', error);
    showNotification('error', 'Erro na simulação: ' + error.message);
  }
}