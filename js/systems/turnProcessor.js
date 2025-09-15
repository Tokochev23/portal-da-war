/**
 * Processador de Turnos - War 1954
 * Executa automaticamente os cálculos quando um turno é fechado
 */

import { db } from '../services/firebase.js';
import { Logger } from '../utils.js';
import ConsumerGoodsCalculator from './consumerGoodsCalculator.js';

class TurnProcessor {

  /**
   * Processa o fim de um turno - executa todos os cálculos automáticos
   */
  static async processTurnEnd(turnNumber) {
    try {
      Logger.info(`Iniciando processamento automático do turno ${turnNumber}`);
      console.log(`🔄 PROCESSAMENTO AUTOMÁTICO DO TURNO ${turnNumber}`);

      const startTime = Date.now();
      let processedCount = 0;

      // Buscar todos os países
      const querySnapshot = await db.collection('paises').get();
      const batch = db.batch();

      querySnapshot.forEach(doc => {
        const country = doc.data();
        const countryName = country.Pais || country.Nome || doc.id;

        try {
          // 1. Aplicar efeitos de bens de consumo na estabilidade
          const stabilityEffect = ConsumerGoodsCalculator.applyStabilityEffect(country);

          // 2. Recalcular bens de consumo com nova estabilidade
          const newCountryData = { ...country, Estabilidade: stabilityEffect.newStability };
          const consumerGoods = ConsumerGoodsCalculator.calculateConsumerGoods(newCountryData);

          // 3. Preparar updates
          const updates = {
            // Aplicar nova estabilidade
            Estabilidade: stabilityEffect.newStability,

            // Atualizar bens de consumo com nova estabilidade
            BensDeConsumo: consumerGoods.level,

            // Metadados do processamento
            'ProcessamentoTurno': {
              turno: turnNumber,
              timestamp: new Date().toISOString(),
              stabilityChange: stabilityEffect.stabilityEffect,
              previousStability: stabilityEffect.currentStability,
              newStability: stabilityEffect.newStability,
              consumerGoodsLevel: consumerGoods.level
            }
          };

          batch.update(doc.ref, updates);
          processedCount++;

          // Log para países com mudanças significativas
          if (Math.abs(stabilityEffect.stabilityEffect) >= 2) {
            console.log(`${countryName}: Estabilidade ${stabilityEffect.currentStability}% → ${stabilityEffect.newStability}% (${stabilityEffect.stabilityEffect > 0 ? '+' : ''}${stabilityEffect.stabilityEffect}%)`);
          }

        } catch (error) {
          Logger.error(`Erro ao processar ${countryName} no turno ${turnNumber}:`, error);
        }
      });

      // Aplicar todas as mudanças
      if (processedCount > 0) {
        await batch.commit();

        // Salvar log do processamento
        await this.saveTurnProcessingLog(turnNumber, processedCount, startTime);

        Logger.info(`Turno ${turnNumber} processado: ${processedCount} países atualizados`);
        console.log(`✅ Turno ${turnNumber} processado: ${processedCount} países atualizados em ${Date.now() - startTime}ms`);
      }

      return {
        success: true,
        processedCount,
        duration: Date.now() - startTime
      };

    } catch (error) {
      Logger.error(`Erro no processamento do turno ${turnNumber}:`, error);
      console.error(`❌ Erro no processamento do turno ${turnNumber}:`, error);
      throw error;
    }
  }

  /**
   * Salva log do processamento de turno
   */
  static async saveTurnProcessingLog(turnNumber, processedCount, startTime) {
    try {
      const logData = {
        turno: turnNumber,
        timestamp: new Date().toISOString(),
        processedCount,
        duration: Date.now() - startTime,
        systems: ['consumer_goods', 'stability_effects'],
        version: '1.0'
      };

      await db.collection('logs').doc(`turno_${turnNumber}_${Date.now()}`).set(logData);
    } catch (error) {
      Logger.error('Erro ao salvar log do processamento:', error);
    }
  }

  /**
   * Executa processamento em modo de teste (sem salvar)
   */
  static async testTurnProcessing(turnNumber = 'TEST') {
    try {
      console.log(`🧪 TESTE DE PROCESSAMENTO DE TURNO ${turnNumber}`);

      const querySnapshot = await db.collection('paises').get();
      const results = [];

      querySnapshot.forEach(doc => {
        const country = doc.data();
        const countryName = country.Pais || country.Nome || doc.id;

        try {
          const stabilityEffect = ConsumerGoodsCalculator.applyStabilityEffect(country);
          const consumerGoods = ConsumerGoodsCalculator.calculateConsumerGoods(country);

          results.push({
            country: countryName,
            currentStability: stabilityEffect.currentStability,
            stabilityEffect: stabilityEffect.stabilityEffect,
            newStability: stabilityEffect.newStability,
            consumerGoodsLevel: consumerGoods.level,
            effectDescription: stabilityEffect.effectDescription
          });

        } catch (error) {
          console.error(`Erro no teste para ${countryName}:`, error);
        }
      });

      // Mostrar estatísticas
      const significantChanges = results.filter(r => Math.abs(r.stabilityEffect) >= 2);
      const positiveEffects = results.filter(r => r.stabilityEffect > 0);
      const negativeEffects = results.filter(r => r.stabilityEffect < 0);

      console.log(`\n📊 RESUMO DO TESTE:`);
      console.log(`Total de países: ${results.length}`);
      console.log(`Mudanças significativas (≥2%): ${significantChanges.length}`);
      console.log(`Efeitos positivos: ${positiveEffects.length}`);
      console.log(`Efeitos negativos: ${negativeEffects.length}`);

      if (significantChanges.length > 0) {
        console.log(`\n⚡ MUDANÇAS SIGNIFICATIVAS:`);
        significantChanges
          .sort((a, b) => Math.abs(b.stabilityEffect) - Math.abs(a.stabilityEffect))
          .slice(0, 10)
          .forEach(country => {
            console.log(`${country.country}: ${country.currentStability}% → ${country.newStability}% (${country.stabilityEffect > 0 ? '+' : ''}${country.stabilityEffect}%)`);
          });
      }

      return results;

    } catch (error) {
      console.error('Erro no teste de processamento:', error);
      throw error;
    }
  }

  /**
   * Verifica se um turno já foi processado
   */
  static async isTurnProcessed(turnNumber) {
    try {
      const snapshot = await db.collection('logs')
        .where('turno', '==', turnNumber)
        .where('systems', 'array-contains', 'consumer_goods')
        .limit(1)
        .get();

      return !snapshot.empty;
    } catch (error) {
      Logger.error('Erro ao verificar processamento do turno:', error);
      return false;
    }
  }

  /**
   * Força reprocessamento de um turno específico
   */
  static async reprocessTurn(turnNumber) {
    try {
      console.log(`🔄 Reprocessando turno ${turnNumber}...`);

      // Verificar se já foi processado
      const alreadyProcessed = await this.isTurnProcessed(turnNumber);
      if (alreadyProcessed) {
        console.log(`⚠️ Turno ${turnNumber} já foi processado. Forçando reprocessamento...`);
      }

      return await this.processTurnEnd(turnNumber);

    } catch (error) {
      console.error(`Erro ao reprocessar turno ${turnNumber}:`, error);
      throw error;
    }
  }
}

export default TurnProcessor;