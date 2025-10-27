/**
 * Sistema de Agências de Inteligência
 * Gerencia espionagem, contra-espionagem e operações encobertas
 */

import { db } from '../services/firebase.js';
import BudgetTracker from './budgetTracker.js';

// Tiers de agências baseado em % do orçamento
const AGENCY_TIERS = {
  limited: {
    name: 'Limitada',
    icon: '🥉',
    minBudgetPercent: 0.5,
    maxBudgetPercent: 2,
    power: 'fraca',
    description: 'Operações básicas limitadas',
    modifier: -1
  },
  competent: {
    name: 'Competente',
    icon: '🥈',
    minBudgetPercent: 2,
    maxBudgetPercent: 5,
    power: 'média',
    description: 'Boas capacidades operacionais',
    modifier: 0
  },
  powerful: {
    name: 'Poderosa',
    icon: '🥇',
    minBudgetPercent: 5,
    maxBudgetPercent: 10,
    power: 'forte',
    description: 'Operações complexas e eficazes',
    modifier: 1
  },
  elite: {
    name: 'Elite',
    icon: '💎',
    minBudgetPercent: 10,
    maxBudgetPercent: 15,
    power: 'muito forte',
    description: 'Domínio total em inteligência',
    modifier: 2
  }
};

// Focos principais de agências
const AGENCY_FOCUS = {
  external_espionage: {
    name: 'Espionagem Externa',
    icon: '🕵️',
    description: 'HUMINT/SIGINT contra outros países',
    bonuses: {
      espionageSuccess: 10,
      infiltrationSpeed: 15
    }
  },
  counterintelligence: {
    name: 'Contra-Espionagem',
    icon: '🛡️',
    description: 'Segurança nacional e anti-espionagem',
    bonuses: {
      detection: 20,
      investigation: 15
    }
  },
  covert_operations: {
    name: 'Operações Encobertas',
    icon: '🎭',
    description: 'Sabotagem, influência e subversão',
    bonuses: {
      sabotageSuccess: 15,
      psychologicalWarfare: 20
    }
  }
};

class IntelligenceAgencySystem {
  constructor() {
    this.agencies = new Map();
    this.lastUpdate = null;
  }

  /**
   * Calcula custos baseados no PIB total e per capita do país
   */
  calculateCostByPIB(baseCost, country) {
    const pib = parseFloat(country.PIB) || 0;
    const populacao = parseFloat(country.Populacao) || 1;
    const pibPerCapita = pib / populacao;

    // Multiplicador baseado em PIB total (escala logarítmica)
    // PIB < 1B: 0.5x
    // PIB 10B: 1.0x
    // PIB 100B: 2.0x
    // PIB 1T: 3.0x
    const pibInBillions = pib / 1000000000;
    const pibMultiplier = Math.max(0.5, Math.min(3.0, Math.log10(pibInBillions + 1) * 0.8 + 0.5));

    // Multiplicador adicional baseado em PIB per capita
    // Países pobres (< $2k): -20%
    // Países médios ($5k-15k): sem ajuste
    // Países ricos (> $20k): +30%
    let perCapitaAdjustment = 1.0;
    if (pibPerCapita < 2000) {
      perCapitaAdjustment = 0.8;
    } else if (pibPerCapita > 20000) {
      perCapitaAdjustment = 1.3;
    }

    const finalMultiplier = pibMultiplier * perCapitaAdjustment;
    return Math.round(baseCost * finalMultiplier);
  }

  /**
   * Calcula orçamento nacional disponível do país
   */
  calculateBudget(country) {
    const pibBruto = parseFloat(country.PIB) || 0;
    const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
    const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;
    return pibBruto * 0.25 * burocracia * estabilidade * 1.5;
  }

  /**
   * Determina tier da agência baseado em % do orçamento
   */
  determineTier(budgetPercent) {
    if (budgetPercent >= AGENCY_TIERS.elite.minBudgetPercent) {
      return 'elite';
    } else if (budgetPercent >= AGENCY_TIERS.powerful.minBudgetPercent) {
      return 'powerful';
    } else if (budgetPercent >= AGENCY_TIERS.competent.minBudgetPercent) {
      return 'competent';
    } else {
      return 'limited';
    }
  }

  /**
   * Calcula custo de fundação da agência
   */
  calculateFoundationCost(country) {
    const baseCost = 1500000000; // US$ 1.5 bilhão base
    return this.calculateCostByPIB(baseCost, country);
  }

  /**
   * Verifica se país já tem agência
   */
  async hasAgency(countryId) {
    try {
      const snapshot = await db.collection('agencies')
        .where('countryId', '==', countryId)
        .get();

      if (!snapshot.empty) {
        const agencyData = snapshot.docs[0].data();
        agencyData.id = snapshot.docs[0].id;
        return agencyData;
      }

      return null;
    } catch (error) {
      console.error('Erro ao verificar agência:', error);
      return null;
    }
  }

  /**
   * Funda uma nova agência de inteligência
   */
  async foundAgency(country, agencyName, budgetPercent, focus, currentTurn) {
    try {
      // Verificar se já tem agência
      const existing = await this.hasAgency(country.id);
      if (existing) {
        return {
          success: false,
          error: 'Este país já possui uma agência de inteligência!'
        };
      }

      // Validar % do orçamento (0.5% - 15%)
      const validBudgetPercent = Math.max(0.5, Math.min(15, parseFloat(budgetPercent)));

      // Calcular custo de fundação
      const foundationCost = this.calculateFoundationCost(country);
      const nationalBudget = this.calculateBudget(country);

      // Verificar se tem orçamento
      if (nationalBudget < foundationCost) {
        return {
          success: false,
          error: 'Orçamento nacional insuficiente para fundar agência!'
        };
      }

      // Determinar tier
      const tier = this.determineTier(validBudgetPercent);
      const tierData = AGENCY_TIERS[tier];

      // Calcular orçamento da agência
      const agencyBudget = Math.round(nationalBudget * (validBudgetPercent / 100));

      // Criar agência no Firebase
      const agency = {
        countryId: country.id,
        countryName: country.Pais,
        name: agencyName || `Agência de ${country.Pais}`,
        foundedTurn: currentTurn,
        budgetPercent: validBudgetPercent,
        budget: agencyBudget,
        tier: tier,
        tierName: tierData.name,
        focus: focus,
        focusName: AGENCY_FOCUS[focus].name,
        technologies: [], // Tecnologias desbloqueadas
        currentResearch: null, // Pesquisa em andamento
        operations: [], // IDs de operações ativas
        operatives: 0, // Operativos disponíveis
        foundationCost: foundationCost,
        createdAt: new Date().toISOString()
      };

      const docRef = await db.collection('agencies').add(agency);

      // Descontar custo de fundação do orçamento do país
      const currentNationalBudget = parseFloat(country.OrcamentoGasto || 0);
      const totalCostThisTurn = foundationCost + agencyBudget; // Custo de fundação + primeiro orçamento anual

      // Atualizar país para indicar que tem agência e descontar orçamento
      await db.collection('paises').doc(country.id).update({
        hasAgency: true,
        agencyId: docRef.id
      });

      // Registrar despesas no Budget Tracker
      try {
        // Custo de fundação (one-time)
        await BudgetTracker.addExpense(
          country.id,
          BudgetTracker.EXPENSE_CATEGORIES.AGENCY_BUDGET,
          foundationCost,
          `Fundação da agência: ${agencyName}`
        );

        // Orçamento anual da agência
        await BudgetTracker.addExpense(
          country.id,
          BudgetTracker.EXPENSE_CATEGORIES.AGENCY_BUDGET,
          agencyBudget,
          `Orçamento anual da agência: ${agencyName} (${validBudgetPercent}% do orçamento nacional)`
        );

        console.log(`💰 Budget atualizado: -$${(totalCostThisTurn / 1000000).toFixed(2)}M (Fundação + Orçamento Anual)`);
      } catch (budgetError) {
        console.error('⚠️ Erro ao atualizar budget tracker (agência já foi criada):', budgetError);
      }

      return {
        success: true,
        agency: { ...agency, id: docRef.id },
        cost: foundationCost,
        annualBudget: agencyBudget,
        totalSpent: totalCostThisTurn,
        tier: tierData
      };

    } catch (error) {
      console.error('Erro ao fundar agência:', error);
      return {
        success: false,
        error: 'Erro ao processar fundação: ' + error.message
      };
    }
  }

  /**
   * Atualiza orçamento da agência (% do orçamento nacional)
   */
  async updateAgencyBudget(agencyId, newBudgetPercent, country) {
    try {
      const validBudgetPercent = Math.max(0.5, Math.min(15, parseFloat(newBudgetPercent)));
      const nationalBudget = this.calculateBudget(country);
      const agencyBudget = Math.round(nationalBudget * (validBudgetPercent / 100));
      const tier = this.determineTier(validBudgetPercent);

      const agencyDoc = await db.collection('agencies').doc(agencyId).get();
      const agencyData = agencyDoc.data();
      const oldBudget = agencyData.budget || 0;

      await db.collection('agencies').doc(agencyId).update({
        budgetPercent: validBudgetPercent,
        budget: agencyBudget,
        tier: tier,
        tierName: AGENCY_TIERS[tier].name
      });

      // Registrar mudança de orçamento no Budget Tracker
      try {
        const budgetDiff = agencyBudget - oldBudget;
        if (budgetDiff > 0) {
          // Aumento de orçamento
          await BudgetTracker.addExpense(
            country.id,
            BudgetTracker.EXPENSE_CATEGORIES.AGENCY_BUDGET,
            budgetDiff,
            `Aumento do orçamento da agência ${agencyData.name} (${validBudgetPercent}%)`
          );
        } else if (budgetDiff < 0) {
          // Redução de orçamento (registrar como "income" negativo/ajuste)
          await BudgetTracker.addIncome(
            country.id,
            BudgetTracker.INCOME_CATEGORIES.OTHER_INCOME,
            Math.abs(budgetDiff),
            `Redução do orçamento da agência ${agencyData.name} (${validBudgetPercent}%)`
          );
        }
      } catch (budgetError) {
        console.error('⚠️ Erro ao atualizar budget tracker:', budgetError);
      }

      return {
        success: true,
        newBudget: agencyBudget,
        newTier: tier,
        budgetUpdated: true
      };
    } catch (error) {
      console.error('Erro ao atualizar orçamento da agência:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém informações da agência de um país
   */
  async getAgency(countryId) {
    try {
      const snapshot = await db.collection('agencies')
        .where('countryId', '==', countryId)
        .get();

      if (!snapshot.empty) {
        const agencyData = snapshot.docs[0].data();
        agencyData.id = snapshot.docs[0].id;
        return agencyData;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar agência:', error);
      return null;
    }
  }

  /**
   * Dissolve/remove uma agência
   */
  async dissolveAgency(agencyId, countryId) {
    try {
      // Remover agência do Firebase
      await db.collection('agencies').doc(agencyId).delete();

      // Atualizar país
      await db.collection('paises').doc(countryId).update({
        hasAgency: false,
        agencyId: null
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Erro ao dissolver agência:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retorna informações sobre tiers disponíveis
   */
  getTiers() {
    return AGENCY_TIERS;
  }

  /**
   * Retorna informações sobre focos disponíveis
   */
  getFocuses() {
    return AGENCY_FOCUS;
  }
}

// Singleton
const intelligenceAgencySystem = new IntelligenceAgencySystem();
export default intelligenceAgencySystem;
export { AGENCY_TIERS, AGENCY_FOCUS };
