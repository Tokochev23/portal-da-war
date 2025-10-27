/**
 * Budget Tracker System - War 1954
 * Sistema de rastreamento detalhado de orçamento
 * Registra todas as receitas e despesas para transparência total
 */

import { db } from '../services/firebase.js';
import { Logger } from '../utils.js';

export default class BudgetTracker {

  /**
   * Categorias de receitas
   */
  static INCOME_CATEGORIES = {
    MARKETPLACE_SALES: 'marketplaceSales',
    RESOURCE_SALES: 'resourceSales',
    LOAN_RECEIVED: 'loanReceived',
    SUBSIDIES: 'subsidies',
    FOREIGN_AID: 'foreignAid',
    TAX_INCOME: 'taxIncome',
    OTHER_INCOME: 'otherIncome'
  };

  /**
   * Categorias de despesas
   */
  static EXPENSE_CATEGORIES = {
    EXISTING_EXPENSES: 'existingExpenses',
    MARKETPLACE_PURCHASES: 'marketplacePurchases',
    RESOURCE_PURCHASES: 'resourcePurchases',
    AGENCY_BUDGET: 'agencyBudget',
    AGENCY_RESEARCH: 'agencyResearch',
    VEHICLE_MAINTENANCE: 'vehicleMaintenance',
    DIVISION_MAINTENANCE: 'divisionMaintenance',
    FLEET_MAINTENANCE: 'fleetMaintenance',
    SHIPYARD_MAINTENANCE: 'shipyardMaintenance',
    INFRASTRUCTURE: 'infrastructureCosts',
    MILITARY_PRODUCTION: 'militaryProduction',
    LOAN_PAYMENTS: 'loanPayments',
    CONSUMER_GOODS: 'consumerGoods',
    OTHER_EXPENSES: 'otherExpenses'
  };

  /**
   * Calcula orçamento base
   */
  static calculateBase(country) {
    const pib = parseFloat(country.PIB) || 0;
    const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
    const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;

    // Fórmula: PIB * 0.25 * Burocracia * (Estabilidade * 1.5)
    const calculated = pib * 0.25 * burocracia * (estabilidade * 1.5);

    return {
      pib,
      burocracia,
      estabilidade,
      calculated
    };
  }

  /**
   * Inicializa breakdown para um novo turno
   */
  static async initializeTurn(countryId, country) {
    try {
      Logger.info(`Inicializando budget breakdown para ${countryId}`);

      const base = this.calculateBase(country);

      // Incluir gastos já existentes como subtrações iniciais
      const orcamentoGasto = parseFloat(country.OrcamentoGasto || 0);

      const subtractions = {};

      // Se houver OrcamentoGasto, adicionar como despesa existente
      if (orcamentoGasto > 0) {
        subtractions[this.EXPENSE_CATEGORIES.EXISTING_EXPENSES] = orcamentoGasto;
      }

      // NOTA: AgencyBudgetSpent NÃO é incluído aqui porque é rastreado dinamicamente
      // via addExpense quando a agência é criada/atualizada

      const totalSubtractions = orcamentoGasto;

      const breakdown = {
        base,
        additions: {},
        subtractions: {
          ...subtractions,
          total: totalSubtractions
        },
        available: base.calculated - totalSubtractions,
        lastUpdated: new Date().toISOString(),
        turnInitialized: true
      };

      await db.collection('paises').doc(countryId).update({
        budgetBreakdown: breakdown
      });

      Logger.info(`Budget breakdown inicializado: ${countryId} - Base: $${(base.calculated / 1000000).toFixed(2)}M - Despesas Existentes: $${(totalSubtractions / 1000000).toFixed(2)}M`);

      return breakdown;

    } catch (error) {
      Logger.error(`Erro ao inicializar budget breakdown para ${countryId}:`, error);
      throw error;
    }
  }

  /**
   * Registra receita (adição ao orçamento)
   */
  static async addIncome(countryId, category, amount, description = '') {
    try {
      if (amount <= 0) {
        Logger.warn(`Tentativa de adicionar receita negativa/zero: ${countryId} - ${category} - ${amount}`);
        return;
      }

      const increment = window.firebase.firestore.FieldValue.increment(amount);

      await db.collection('paises').doc(countryId).update({
        [`budgetBreakdown.additions.${category}`]: increment,
        'budgetBreakdown.lastUpdated': new Date().toISOString()
      });

      Logger.info(`💰 Receita adicionada: ${countryId} - ${category} - +$${(amount / 1000000).toFixed(2)}M - ${description}`);

      // Recalcular orçamento disponível
      await this.recalculate(countryId);

    } catch (error) {
      Logger.error(`Erro ao adicionar receita para ${countryId}:`, error);
      throw error;
    }
  }

  /**
   * Registra despesa (subtração do orçamento)
   */
  static async addExpense(countryId, category, amount, description = '') {
    try {
      if (amount <= 0) {
        Logger.warn(`Tentativa de adicionar despesa negativa/zero: ${countryId} - ${category} - ${amount}`);
        return;
      }

      const increment = window.firebase.firestore.FieldValue.increment(amount);

      await db.collection('paises').doc(countryId).update({
        [`budgetBreakdown.subtractions.${category}`]: increment,
        'budgetBreakdown.lastUpdated': new Date().toISOString()
      });

      Logger.info(`💸 Despesa adicionada: ${countryId} - ${category} - -$${(amount / 1000000).toFixed(2)}M - ${description}`);

      // Recalcular orçamento disponível
      await this.recalculate(countryId);

    } catch (error) {
      Logger.error(`Erro ao adicionar despesa para ${countryId}:`, error);
      throw error;
    }
  }

  /**
   * Recalcula totais e orçamento disponível
   */
  static async recalculate(countryId) {
    try {
      const doc = await db.collection('paises').doc(countryId).get();

      if (!doc.exists) {
        Logger.error(`País não encontrado: ${countryId}`);
        return;
      }

      const data = doc.data();
      const breakdown = data.budgetBreakdown || {};

      // Se não foi inicializado, inicializar
      if (!breakdown.turnInitialized) {
        await this.initializeTurn(countryId, data);
        return;
      }

      // Calcular totais
      const additionsTotal = Object.entries(breakdown.additions || {})
        .filter(([key]) => key !== 'total')
        .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);

      const subtractionsTotal = Object.entries(breakdown.subtractions || {})
        .filter(([key]) => key !== 'total')
        .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);

      const available = (breakdown.base?.calculated || 0) + additionsTotal - subtractionsTotal;

      // Atualizar totais
      await db.collection('paises').doc(countryId).update({
        'budgetBreakdown.additions.total': additionsTotal,
        'budgetBreakdown.subtractions.total': subtractionsTotal,
        'budgetBreakdown.available': available,
        'budgetBreakdown.lastUpdated': new Date().toISOString()
      });

      Logger.info(`✅ Budget recalculado: ${countryId} - Disponível: $${(available / 1000000).toFixed(2)}M`);

    } catch (error) {
      Logger.error(`Erro ao recalcular budget para ${countryId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém breakdown atual de um país
   */
  static async getBreakdown(countryId) {
    try {
      const doc = await db.collection('paises').doc(countryId).get();

      if (!doc.exists) {
        throw new Error(`País não encontrado: ${countryId}`);
      }

      return doc.data().budgetBreakdown || null;

    } catch (error) {
      Logger.error(`Erro ao obter breakdown de ${countryId}:`, error);
      throw error;
    }
  }

  /**
   * Obtém label amigável para categoria
   */
  static getCategoryLabel(category) {
    const labels = {
      // Receitas
      marketplaceSales: '💵 Vendas Marketplace',
      resourceSales: '🛢️ Vendas de Recursos',
      loanReceived: '🏦 Empréstimos Recebidos',
      subsidies: '💰 Subsídios',
      foreignAid: '🌍 Ajuda Externa',
      taxIncome: '📊 Receita Tributária',
      otherIncome: '💼 Outras Receitas',

      // Despesas
      existingExpenses: '🏭 Produção e Operações',
      marketplacePurchases: '🛒 Compras Marketplace',
      resourcePurchases: '🛢️ Compras de Recursos',
      agencyBudget: '🕵️ Orçamento Agências',
      agencyResearch: '🔬 Pesquisa de Agência',
      vehicleMaintenance: '🚗 Manutenção Veículos',
      divisionMaintenance: '🎖️ Manutenção Divisões',
      fleetMaintenance: '⚓ Manutenção Frotas',
      shipyardMaintenance: '🏭 Manutenção Estaleiros',
      infrastructureCosts: '🏗️ Infraestrutura',
      militaryProduction: '⚔️ Produção Militar',
      loanPayments: '🏦 Pagamento Empréstimos',
      consumerGoods: '🛍️ Bens de Consumo',
      otherExpenses: '💸 Outras Despesas'
    };

    return labels[category] || category;
  }

  /**
   * Formata valor monetário
   */
  static formatCurrency(value) {
    if (value === 0) return '$0';
    if (!value) return '$0';

    const millions = value / 1000000;

    if (millions >= 1000) {
      return `$${(millions / 1000).toFixed(2)}B`;
    } else if (millions >= 1) {
      return `$${millions.toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  }

  /**
   * Obtém o breakdown de um país
   */
  static async getBreakdown(countryId) {
    try {
      const doc = await db.collection('paises').doc(countryId).get();
      if (!doc.exists) {
        console.error('País não encontrado:', countryId);
        return null;
      }

      const country = doc.data();
      return country.budgetBreakdown || null;
    } catch (error) {
      console.error('Erro ao buscar breakdown:', error);
      return null;
    }
  }

  /**
   * Gera relatório de breakdown para exibição
   */
  static generateReport(breakdown) {
    if (!breakdown) {
      return {
        base: 0,
        additions: [],
        subtractions: [],
        available: 0
      };
    }

    const additions = Object.entries(breakdown.additions || {})
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => ({
        category: key,
        label: this.getCategoryLabel(key),
        value: parseFloat(value) || 0,
        formatted: this.formatCurrency(parseFloat(value) || 0)
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const subtractions = Object.entries(breakdown.subtractions || {})
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => ({
        category: key,
        label: this.getCategoryLabel(key),
        value: parseFloat(value) || 0,
        formatted: this.formatCurrency(parseFloat(value) || 0)
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    return {
      base: breakdown.base?.calculated || 0,
      baseFormatted: this.formatCurrency(breakdown.base?.calculated || 0),
      additions,
      additionsTotal: breakdown.additions?.total || 0,
      additionsTotalFormatted: this.formatCurrency(breakdown.additions?.total || 0),
      subtractions,
      subtractionsTotal: breakdown.subtractions?.total || 0,
      subtractionsTotalFormatted: this.formatCurrency(breakdown.subtractions?.total || 0),
      available: breakdown.available || 0,
      availableFormatted: this.formatCurrency(breakdown.available || 0)
    };
  }
}

// O export default está na declaração da classe
