/**
 * Sistema de Eventos de Turno
 * Executa ações automáticas quando o turno avança
 */

import { db } from '../services/firebase.js';
import espionageOperationsSystem from './espionageOperationsSystem.js';
import intelligenceAgencySystem from './intelligenceAgencySystem.js';

class TurnEventsSystem {
  constructor() {
    this.lastProcessedTurn = 0;
  }

  /**
   * Processa todos os eventos do turno
   */
  async processTurnEvents(currentTurn) {
    // Evitar processar o mesmo turno duas vezes
    if (currentTurn === this.lastProcessedTurn) {
      return;
    }

    console.log(`[TurnEvents] Processando eventos do turno #${currentTurn}`);

    try {
      // 1. Progredir todas as operações de espionagem ativas
      await this.progressAllEspionageOperations(currentTurn);

      // 2. Atualizar orçamentos das agências (cobrar custos anuais)
      // await this.updateAgencyBudgets(currentTurn);

      this.lastProcessedTurn = currentTurn;
      console.log(`[TurnEvents] Eventos do turno #${currentTurn} processados com sucesso`);

    } catch (error) {
      console.error('[TurnEvents] Erro ao processar eventos do turno:', error);
    }
  }

  /**
   * Progride todas as operações de espionagem ativas
   */
  async progressAllEspionageOperations(currentTurn) {
    try {
      console.log('[TurnEvents] Progredindo operações de espionagem...');

      // Buscar todas as operações ativas
      const snapshot = await db.collection('espionage_operations')
        .where('active', '==', true)
        .get();

      if (snapshot.empty) {
        console.log('[TurnEvents] Nenhuma operação ativa encontrada');
        return;
      }

      const operations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`[TurnEvents] ${operations.length} operação(ões) ativa(s) encontrada(s)`);

      // Processar cada operação
      for (const operation of operations) {
        try {
          // Buscar dados da agência
          const agencySnap = await db.collection('agencies').doc(operation.agencyId).get();
          if (!agencySnap.exists) {
            console.warn(`[TurnEvents] Agência ${operation.agencyId} não encontrada`);
            continue;
          }

          const agency = { id: agencySnap.id, ...agencySnap.data() };

          // Buscar dados dos países
          const spyCountrySnap = await db.collection('paises').doc(operation.spyCountryId).get();
          const targetCountrySnap = await db.collection('paises').doc(operation.targetCountryId).get();

          if (!spyCountrySnap.exists || !targetCountrySnap.exists) {
            console.warn(`[TurnEvents] Países não encontrados para operação ${operation.id}`);
            continue;
          }

          const spyCountry = { id: spyCountrySnap.id, ...spyCountrySnap.data() };
          const targetCountry = { id: targetCountrySnap.id, ...targetCountrySnap.data() };

          // Progredir operação
          const result = await espionageOperationsSystem.progressOperation(
            operation.id,
            agency,
            targetCountry,
            spyCountry,
            currentTurn
          );

          if (result.success) {
            console.log(
              `[TurnEvents] Operação ${operation.id} progredida: ` +
              `${result.succeeded ? 'SUCESSO' : 'FALHA'} | ` +
              `Fase ${result.newPhase} | ` +
              `Progresso: ${Math.round(result.newProgress)}% | ` +
              `${result.detected ? '⚠️ DETECTADO' : '✓ Não detectado'}`
            );

            // Criar notificação para o jogador espião
            if (result.succeeded || result.detected) {
              await this.createOperationNotification(operation, result, spyCountry);
            }
          }

        } catch (error) {
          console.error(`[TurnEvents] Erro ao processar operação ${operation.id}:`, error);
        }
      }

      console.log('[TurnEvents] Todas as operações foram processadas');

    } catch (error) {
      console.error('[TurnEvents] Erro ao buscar operações:', error);
    }
  }

  /**
   * Cria notificação sobre progresso da operação
   */
  async createOperationNotification(operation, result, spyCountry) {
    try {
      const notification = {
        countryId: operation.spyCountryId,
        type: 'espionage_progress',
        title: result.detected ? '⚠️ Operação Detectada!' : '🕵️ Progresso de Espionagem',
        message: result.detected
          ? `Sua operação em ${operation.targetCountryName} foi detectada! Risco de exposição aumentado.`
          : result.succeeded
            ? `Operação em ${operation.targetCountryName} progrediu para Fase ${result.newPhase}. Intel: ${result.intelLevel}%`
            : `Operação em ${operation.targetCountryName} não progrediu neste turno.`,
        data: {
          operationId: operation.id,
          targetCountry: operation.targetCountryName,
          phase: result.newPhase,
          intelLevel: result.intelLevel,
          detected: result.detected,
          succeeded: result.succeeded
        },
        read: false,
        createdAt: new Date().toISOString()
      };

      // Salvar no Firestore (coleção de notificações)
      // await db.collection('notifications').add(notification);

      // Por enquanto, apenas log
      console.log('[TurnEvents] Notificação criada:', notification.title);

    } catch (error) {
      console.error('[TurnEvents] Erro ao criar notificação:', error);
    }
  }

  /**
   * Atualiza orçamentos das agências (cobra custos anuais)
   */
  async updateAgencyBudgets(currentTurn) {
    try {
      console.log('[TurnEvents] Atualizando orçamentos das agências...');

      // Buscar todas as agências ativas
      const snapshot = await db.collection('agencies').get();

      for (const doc of snapshot.docs) {
        const agency = { id: doc.id, ...doc.data() };

        // Buscar país da agência
        const countrySnap = await db.collection('paises').doc(agency.countryId).get();
        if (!countrySnap.exists) continue;

        const country = { id: countrySnap.id, ...countrySnap.data() };

        // Recalcular orçamento nacional disponível
        const availableBudget = intelligenceAgencySystem.calculateBudget(country);

        // Verificar se país ainda pode pagar o orçamento da agência
        if (availableBudget < agency.budget) {
          console.warn(
            `[TurnEvents] ${country.Pais} não tem orçamento suficiente ` +
            `para manter agência (necessário: $${agency.budget}, disponível: $${availableBudget})`
          );
          // Opcionalmente: reduzir tier da agência ou desativar
        }
      }

    } catch (error) {
      console.error('[TurnEvents] Erro ao atualizar orçamentos:', error);
    }
  }

  /**
   * Inicializa o sistema e monitora mudanças de turno
   */
  init(currentTurn) {
    this.lastProcessedTurn = currentTurn - 1; // Permitir processar turno atual
    console.log(`[TurnEvents] Sistema inicializado no turno #${currentTurn}`);
  }
}

// Singleton
const turnEventsSystem = new TurnEventsSystem();
export default turnEventsSystem;
