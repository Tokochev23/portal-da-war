/**
 * Processador de Turnos - War 1954
 * Executa automaticamente os cálculos quando um turno é fechado
 */

import { db } from '../services/firebase.js';
import { Logger } from '../utils.js';
import ConsumerGoodsCalculator from './consumerGoodsCalculator.js';
import turnEventsSystem from './turnEventsSystem.js';
import { calculateEffectiveModifiers } from './lawAndExhaustionCalculator.js';

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

      // 1. PROCESSAR EVENTOS DE TURNO (Espionagem, etc)
      await turnEventsSystem.processTurnEvents(turnNumber);

      // 2. PROCESSAR ORDENS RECORRENTES DO MARKETPLACE
      await this.processRecurringOrders(turnNumber);

      // 3. PROCESSAR TRANSIÇÕES DE LEIS NACIONAIS
      await this.processLawTransitions(turnNumber);

      // 4. APLICAR EFEITOS DAS LEIS NACIONAIS (modificadores)
      await this.applyNationalLawEffects(turnNumber);

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

            // RESETAR ORÇAMENTO GASTO (novo turno = novo orçamento)
            OrcamentoGasto: 0,
            AgencyBudgetSpent: 0,

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
   * Processar ordens recorrentes do marketplace
   */
  static async processRecurringOrders(turnNumber) {
    try {
      console.log(`🔄 Processando ordens recorrentes do marketplace (Turno ${turnNumber})...`);

      // Importar dinamicamente o sistema se necessário
      if (!window.recurringOrdersSystem) {
        const { RecurringOrdersSystem } = await import('./recurringOrdersSystem.js');
        window.recurringOrdersSystem = new RecurringOrdersSystem();
      }

      // Primeiro fazer matching de novas ordens
      await window.recurringOrdersSystem.matchOrders();

      // Depois processar transações
      const results = await window.recurringOrdersSystem.processTurnRecurringOrders(turnNumber);

      console.log(`✅ Ordens recorrentes processadas: ${results.executed} executadas, ${results.failed} falhas`);

      return results;

    } catch (error) {
      Logger.error(`Erro ao processar ordens recorrentes no turno ${turnNumber}:`, error);
      console.error(`❌ Erro ao processar ordens recorrentes:`, error);
      // Não falhar o turno todo por causa das ordens
      return { executed: 0, failed: 0, error: error.message };
    }
  }

  /**
   * Processar transições de leis nacionais
   */
  static async processLawTransitions(turnNumber) {
    try {
      console.log(`🏛️ Processando transições de leis (Turno ${turnNumber})...`);

      const paisesSnapshot = await db.collection('paises')
        .where('lawChange', '!=', null)
        .get();

      if (paisesSnapshot.empty) {
        console.log('✅ Nenhuma transição de lei em andamento.');
        return { processed: 0 };
      }

      const batch = db.batch();
      let processedCount = 0;

      paisesSnapshot.forEach(doc => {
        const country = doc.data();
        const lawChange = country.lawChange;

        if (!lawChange) return;

        // Incrementa o progresso da transição
        lawChange.progress += 1;

        if (lawChange.progress >= lawChange.totalTurns) {
          // Transição completa! Aplica a nova lei
          const updateData = {
            [lawChange.type + 'Law']: lawChange.targetLaw,
            lawChange: null // Remove a transição
          };
          batch.update(doc.ref, updateData);
          console.log(`✅ ${country.Pais || doc.id}: Transição para ${lawChange.targetLaw} completa!`);
        } else {
          // Ainda em transição
          batch.update(doc.ref, { lawChange });
          console.log(`🔄 ${country.Pais || doc.id}: Transição ${lawChange.progress}/${lawChange.totalTurns}`);
        }

        processedCount++;
      });

      if (processedCount > 0) {
        await batch.commit();
        console.log(`✅ ${processedCount} transições de leis processadas.`);
      }

      return { processed: processedCount };

    } catch (error) {
      Logger.error(`Erro ao processar transições de leis no turno ${turnNumber}:`, error);
      console.error(`❌ Erro ao processar transições de leis:`, error);
      return { processed: 0, error: error.message };
    }
  }

  /**
   * Aplicar efeitos das leis nacionais (modificadores)
   */
  static async applyNationalLawEffects(turnNumber) {
    try {
      console.log(`⚙️ Aplicando efeitos de leis nacionais (Turno ${turnNumber})...`);

      // Buscar configuração de leis
      const lawsDoc = await db.collection('gameConfig').doc('nationalLaws').get();
      if (!lawsDoc.exists) {
        console.warn('⚠️ Configuração de leis nacionais não encontrada.');
        return { processed: 0 };
      }
      const lawsConfig = lawsDoc.data();

      // Buscar todos os países
      const paisesSnapshot = await db.collection('paises').get();
      if (paisesSnapshot.empty) {
        return { processed: 0 };
      }

      const batch = db.batch();
      let processedCount = 0;

      paisesSnapshot.forEach(doc => {
        const countryData = doc.data();

        // Calcular modificadores efetivos
        const modifiers = calculateEffectiveModifiers(countryData, lawsConfig);

        // Atualizar país com os modificadores
        batch.update(doc.ref, { currentModifiers: modifiers });
        processedCount++;
      });

      if (processedCount > 0) {
        await batch.commit();
        console.log(`✅ Efeitos de leis aplicados a ${processedCount} países.`);
      }

      return { processed: processedCount };

    } catch (error) {
      Logger.error(`Erro ao aplicar efeitos de leis no turno ${turnNumber}:`, error);
      console.error(`❌ Erro ao aplicar efeitos de leis:`, error);
      return { processed: 0, error: error.message };
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
        systems: ['consumer_goods', 'stability_effects', 'recurring_orders', 'national_laws', 'law_transitions'],
        version: '1.2'
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