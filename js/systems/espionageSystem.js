/**
 * Sistema de Espionagem e Contra-Espionagem
 * Controla operações de inteligência entre países
 */

import { db } from '../services/firebase.js';
import BudgetTracker from './budgetTracker.js';

// Níveis de espionagem e seus custos base
const ESPIONAGE_LEVELS = {
  basic: {
    name: 'Básica',
    description: 'Orçamento e recursos gerais',
    costMultiplier: 1,
    successBaseChance: 0.7,
    icon: '🔍'
  },
  intermediate: {
    name: 'Intermediária',
    description: 'Recursos + tecnologias e capacidades',
    costMultiplier: 2.5,
    successBaseChance: 0.5,
    icon: '🔬'
  },
  total: {
    name: 'Total',
    description: 'Acesso completo ao inventário militar',
    costMultiplier: 5,
    successBaseChance: 0.3,
    icon: '🎯'
  }
};

// Custo base de espionagem (por turno)
const BASE_COST_PER_TURN = 50000; // US$ 50k por turno

class EspionageSystem {
  constructor() {
    this.activeOperations = new Map(); // Cache local
    this.lastUpdate = null;
  }

  /**
   * Verifica se um país tem espionagem ativa sobre outro
   */
  async hasActiveSpying(spyCountryId, targetCountryId, currentTurn) {
    try {
      const snapshot = await db.collection('espionageOperations')
        .where('spyCountryId', '==', spyCountryId)
        .where('targetCountryId', '==', targetCountryId)
        .where('active', '==', true)
        .get();

      if (snapshot.empty) return null;

      // Verificar se ainda está válida
      const operation = snapshot.docs[0].data();
      operation.id = snapshot.docs[0].id;

      if (operation.validUntilTurn < currentTurn) {
        // Operação expirou
        await this.deactivateOperation(operation.id);
        return null;
      }

      return operation;
    } catch (error) {
      console.error('Erro ao verificar espionagem ativa:', error);
      return null;
    }
  }

  /**
   * Calcula o custo de uma operação de espionagem
   */
  calculateOperationCost(level, duration, targetCountry) {
    const levelData = ESPIONAGE_LEVELS[level];
    if (!levelData) return 0;

    // Custo base * multiplicador do nível * duração
    let baseCost = BASE_COST_PER_TURN * levelData.costMultiplier * duration;

    // Ajustar pelo tamanho/poder do país alvo (WPI)
    const targetWPI = parseFloat(targetCountry.WarPower) || 50;
    const wpiMultiplier = 0.5 + (targetWPI / 100); // 0.5x a 1.5x

    return Math.round(baseCost * wpiMultiplier);
  }

  /**
   * Calcula a chance de sucesso de uma operação
   */
  calculateSuccessChance(level, spyCountry, targetCountry) {
    const levelData = ESPIONAGE_LEVELS[level];
    if (!levelData) return 0;

    let chance = levelData.successBaseChance;

    // Tecnologia do espião aumenta chance
    const spyTech = (parseFloat(spyCountry.Tecnologia) || 0) / 100;
    chance += spyTech * 0.2; // +20% no máximo

    // Contra-espionagem do alvo reduz chance
    const counterIntel = (parseFloat(targetCountry.CounterIntelligence) || 0) / 100;
    chance -= counterIntel * 3; // -30% no máximo (se alvo tiver 10%)

    // Urbanização do alvo (mais difícil espionar países urbanos)
    const targetUrban = (parseFloat(targetCountry.Urbanizacao) || 0) / 100;
    chance -= targetUrban * 0.1; // -10% no máximo

    // Garantir que fique entre 0.05 e 0.95
    return Math.max(0.05, Math.min(0.95, chance));
  }

  /**
   * Inicia uma operação de espionagem
   */
  async initiateOperation(spyCountry, targetCountry, level, duration, currentTurn) {
    try {
      // Verificar se já existe operação ativa
      const existing = await this.hasActiveSpying(spyCountry.id, targetCountry.id, currentTurn);
      if (existing) {
        return {
          success: false,
          error: 'Você já tem uma operação ativa neste país!'
        };
      }

      // Calcular custo
      const cost = this.calculateOperationCost(level, duration, targetCountry);

      // Verificar se tem orçamento
      const spyBudget = this.calculateBudget(spyCountry);
      if (spyBudget < cost) {
        return {
          success: false,
          error: 'Orçamento insuficiente para esta operação!'
        };
      }

      // Calcular chance de sucesso
      const successChance = this.calculateSuccessChance(level, spyCountry, targetCountry);
      const roll = Math.random();
      const succeeded = roll <= successChance;

      // Calcular se foi detectado (chance aumenta com contra-espionagem do alvo)
      const counterIntel = (parseFloat(targetCountry.CounterIntelligence) || 0) / 100;
      const detectionChance = counterIntel * 0.5; // 50% de chance se alvo tiver 10% contra-espionagem
      const detected = Math.random() <= detectionChance;

      // Criar operação no Firebase
      const operation = {
        spyCountryId: spyCountry.id,
        spyCountryName: spyCountry.Pais,
        targetCountryId: targetCountry.id,
        targetCountryName: targetCountry.Pais,
        level: level,
        startTurn: currentTurn,
        validUntilTurn: currentTurn + duration,
        duration: duration,
        investment: cost,
        detected: detected,
        succeeded: succeeded,
        active: succeeded, // Só fica ativa se teve sucesso
        createdAt: new Date().toISOString()
      };

      const docRef = await db.collection('espionageOperations').add(operation);

      // Se foi detectada, criar notificação para o alvo
      if (detected) {
        await this.createDetectionNotification(targetCountry.id, spyCountry.Pais, succeeded);
      }

      // Registrar despesa no Budget Tracker
      try {
        await BudgetTracker.addExpense(
          spyCountry.id,
          BudgetTracker.EXPENSE_CATEGORIES.AGENCY_BUDGET, // Usar uma categoria genérica de orçamento da agência
          cost,
          `Operação de espionagem contra ${targetCountry.Pais}`
        );
      } catch (budgetError) {
        console.error('⚠️ Erro ao registrar despesa de espionagem no budget tracker:', budgetError);
      }

      return {
        success: true,
        operation: { ...operation, id: docRef.id },
        cost: cost,
        succeeded: succeeded,
        detected: detected,
        successChance: Math.round(successChance * 100)
      };

    } catch (error) {
      console.error('Erro ao iniciar operação de espionagem:', error);
      return {
        success: false,
        error: 'Erro ao processar operação: ' + error.message
      };
    }
  }

  /**
   * Desativa uma operação de espionagem
   */
  async deactivateOperation(operationId) {
    try {
      await db.collection('espionageOperations').doc(operationId).update({
        active: false,
        deactivatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Erro ao desativar operação:', error);
      return false;
    }
  }

  /**
   * Busca todas as operações ativas de um país (como espião)
   */
  async getActiveOperations(spyCountryId, currentTurn) {
    try {
      const snapshot = await db.collection('espionageOperations')
        .where('spyCountryId', '==', spyCountryId)
        .where('active', '==', true)
        .get();

      const operations = [];

      for (const doc of snapshot.docs) {
        const operation = doc.data();
        operation.id = doc.id;

        // Verificar se ainda é válida
        if (operation.validUntilTurn >= currentTurn) {
          operations.push(operation);
        } else {
          // Desativar automaticamente
          await this.deactivateOperation(doc.id);
        }
      }

      return operations;
    } catch (error) {
      console.error('Erro ao buscar operações ativas:', error);
      return [];
    }
  }

  /**
   * Busca tentativas de espionagem contra um país
   */
  async getSpyingAttempts(targetCountryId) {
    try {
      const snapshot = await db.collection('espionageOperations')
        .where('targetCountryId', '==', targetCountryId)
        .where('detected', '==', true)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao buscar tentativas de espionagem:', error);
      return [];
    }
  }

  /**
   * Cria notificação de detecção de espionagem
   */
  async createDetectionNotification(targetCountryId, spyCountryName, succeeded) {
    try {
      const notification = {
        countryId: targetCountryId,
        type: 'espionage_detected',
        message: succeeded
          ? `⚠️ Espionagem detectada! ${spyCountryName} conseguiu acessar informações classificadas.`
          : `🛡️ Tentativa de espionagem bloqueada! ${spyCountryName} tentou acessar informações mas foi impedido.`,
        spyCountry: spyCountryName,
        succeeded: succeeded,
        read: false,
        createdAt: new Date().toISOString()
      };

      await db.collection('notifications').add(notification);
    } catch (error) {
      console.error('Erro ao criar notificação:', error);
    }
  }

  /**
   * Atualiza o nível de contra-espionagem de um país
   */
  async updateCounterIntelligence(countryId, percentage) {
    try {
      // Validar percentual (0-10%)
      const validPercent = Math.max(0, Math.min(10, parseFloat(percentage) || 0));

      await db.collection('paises').doc(countryId).update({
        CounterIntelligence: validPercent
      });

      return {
        success: true,
        newValue: validPercent
      };
    } catch (error) {
      console.error('Erro ao atualizar contra-espionagem:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calcula orçamento de um país (helper)
   */
  calculateBudget(country) {
    const pibBruto = parseFloat(country.PIB) || 0;
    const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
    const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;
    return pibBruto * 0.25 * burocracia * estabilidade * 1.5;
  }

  /**
   * Limpa operações expiradas (executar a cada processamento de turno)
   */
  async cleanExpiredOperations(currentTurn) {
    try {
      const snapshot = await db.collection('espionageOperations')
        .where('active', '==', true)
        .get();

      let cleaned = 0;

      for (const doc of snapshot.docs) {
        const operation = doc.data();
        if (operation.validUntilTurn < currentTurn) {
          await this.deactivateOperation(doc.id);
          cleaned++;
        }
      }

      console.log(`🧹 ${cleaned} operações de espionagem expiradas foram limpas.`);
      return cleaned;
    } catch (error) {
      console.error('Erro ao limpar operações expiradas:', error);
      return 0;
    }
  }

  /**
   * Retorna informações sobre níveis de espionagem
   */
  getLevels() {
    return ESPIONAGE_LEVELS;
  }
}

// Singleton
const espionageSystem = new EspionageSystem();
export default espionageSystem;
