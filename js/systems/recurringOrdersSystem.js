// js/systems/recurringOrdersSystem.js - Sistema de Ordens Recorrentes do Marketplace

import { db } from '../services/firebase.js';
import { getMarketTypeConfig, getGameResourceKey } from '../data/resourceMapping.js';
import BudgetTracker from './budgetTracker.js';

/**
 * Sistema de Ordens Recorrentes
 *
 * Funcionalidades:
 * - Criar ordens de compra/venda recorrentes
 * - Matching automático entre ordens compatíveis
 * - Execução automática a cada turno
 * - Validação de orçamento e estoque
 * - Pausar/cancelar ordens
 */
export class RecurringOrdersSystem {
  constructor() {
    this.ordersCollection = 'marketplace_recurring_orders';
    this.transactionsCollection = 'marketplace_recurring_transactions';
    this.matchesCollection = 'marketplace_order_matches';
  }

  /**
   * Criar ordem recorrente (compra ou venda)
   */
  async createRecurringOrder(orderData) {
    try {
      console.log('📝 Criando ordem recorrente:', orderData);

      // Validar dados obrigatórios
      this.validateOrderData(orderData);

      // Obter configuração do recurso
      const marketConfig = getMarketTypeConfig(orderData.item_id);
      if (!marketConfig) {
        throw new Error(`Tipo de recurso não reconhecido: ${orderData.item_id}`);
      }

      // Buscar dados do país
      const countryDoc = await db.collection('paises').doc(orderData.country_id).get();
      if (!countryDoc.exists) {
        throw new Error('País não encontrado');
      }
      const countryData = countryDoc.data();

      // Validar ordem baseado no tipo (buy/sell)
      if (orderData.order_type === 'sell') {
        await this.validateSellOrder(orderData, countryData, marketConfig);
      } else if (orderData.order_type === 'buy') {
        await this.validateBuyOrder(orderData, countryData, marketConfig);
      }

      // Obter player_id do país ou do auth atual
      const currentUser = await import('../services/firebase.js').then(m => m.auth.currentUser);
      const player_id = orderData.player_id || currentUser?.uid || null;

      // Criar documento da ordem
      const order = {
        // Dados básicos
        country_id: orderData.country_id,
        country_name: countryData.Pais || countryData.Nome || 'Unknown',
        country_flag: countryData.Flag || '🏳️',
        player_id: player_id,
        order_type: orderData.order_type, // 'buy' ou 'sell'
        item_id: orderData.item_id,
        item_name: marketConfig.name,

        // Quantidade e preço
        quantity: parseFloat(orderData.quantity),
        unit: marketConfig.defaultUnit,
        price_per_unit: parseFloat(orderData.price_per_unit),

        // Configurações da ordem recorrente
        min_stock_reserve: parseFloat(orderData.min_stock_reserve || 0), // Reserva mínima para vendedor
        min_budget_reserve: parseFloat(orderData.min_budget_reserve || 0), // Reserva mínima para comprador
        max_price_buy: orderData.order_type === 'buy' ? parseFloat(orderData.max_price_buy || orderData.price_per_unit * 1.2) : null,
        min_price_sell: orderData.order_type === 'sell' ? parseFloat(orderData.min_price_sell || orderData.price_per_unit * 0.8) : null,

        // Status e controle
        status: 'active', // active, paused, cancelled, out_of_stock, out_of_budget
        created_at: new Date(),
        updated_at: new Date(),
        last_execution: null,

        // Estatísticas
        total_executed: 0,
        total_volume: 0,
        total_value: 0,

        // Metadados
        auto_renew: true,
        expires_at: null
      };

      // Salvar no Firestore
      const orderRef = await db.collection(this.ordersCollection).add(order);
      console.log('✅ Ordem recorrente criada:', orderRef.id);

      // Tentar matching imediato
      await this.matchOrders(orderRef.id);

      return { success: true, orderId: orderRef.id, order };

    } catch (error) {
      console.error('❌ Erro ao criar ordem recorrente:', error);
      throw error;
    }
  }

  /**
   * Validar dados da ordem
   */
  validateOrderData(orderData) {
    const required = ['country_id', 'order_type', 'item_id', 'quantity', 'price_per_unit'];

    for (const field of required) {
      if (!orderData[field]) {
        throw new Error(`Campo obrigatório faltando: ${field}`);
      }
    }

    if (!['buy', 'sell'].includes(orderData.order_type)) {
      throw new Error('order_type deve ser "buy" ou "sell"');
    }

    if (orderData.quantity <= 0) {
      throw new Error('Quantidade deve ser maior que zero');
    }

    if (orderData.price_per_unit <= 0) {
      throw new Error('Preço deve ser maior que zero');
    }
  }

  /**
   * Validar ordem de venda
   */
  async validateSellOrder(orderData, countryData, marketConfig) {
    const gameResourceKey = getGameResourceKey(orderData.item_id);

    // Calcular excedente disponível
    const production = window.ResourceProductionCalculator?.calculateCountryProduction(countryData)[gameResourceKey] || 0;
    const consumption = window.ResourceConsumptionCalculator?.calculateCountryConsumption(countryData)[gameResourceKey] || 0;
    const available = Math.max(0, production - consumption);

    const quantityNeeded = orderData.quantity + (orderData.min_stock_reserve || 0);

    if (available < quantityNeeded) {
      throw new Error(
        `Estoque insuficiente. Necessário: ${quantityNeeded.toLocaleString()} ${marketConfig.defaultUnit} ` +
        `(${orderData.quantity.toLocaleString()} venda + ${orderData.min_stock_reserve?.toLocaleString() || 0} reserva). ` +
        `Disponível: ${available.toLocaleString()}`
      );
    }
  }

  /**
   * Validar ordem de compra
   */
  async validateBuyOrder(orderData, countryData, marketConfig) {
    // Calcular orçamento disponível
    const budget = this.calculateBudget(countryData);
    const totalCost = orderData.quantity * orderData.price_per_unit;
    const budgetNeeded = totalCost + (orderData.min_budget_reserve || 0);

    if (budget < budgetNeeded) {
      throw new Error(
        `Orçamento insuficiente. Necessário: $${budgetNeeded.toLocaleString()} ` +
        `($${totalCost.toLocaleString()} compra + $${orderData.min_budget_reserve?.toLocaleString() || 0} reserva). ` +
        `Disponível: $${budget.toLocaleString()}`
      );
    }
  }

  /**
   * Calcular orçamento disponível (copiado do dashboard.js)
   */
  calculateBudget(country) {
    const pibBruto = parseFloat(country.PIB) || 0;
    const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
    const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;

    const orcamentoTotal = pibBruto * 0.25 * burocracia * (estabilidade * 1.5);
    const orcamentoGasto = parseFloat(country.OrcamentoGasto || 0);
    const agencyBudget = parseFloat(country.AgencyBudgetSpent || 0);

    return Math.max(0, orcamentoTotal - orcamentoGasto - agencyBudget);
  }

  /**
   * Fazer matching entre ordens compatíveis
   */
  async matchOrders(orderId = null) {
    try {
      console.log('🔍 Procurando matches para ordens...');

      // Se orderId específico, buscar apenas aquela ordem
      let ordersToMatch = [];
      if (orderId) {
        const orderDoc = await db.collection(this.ordersCollection).doc(orderId).get();
        if (orderDoc.exists && orderDoc.data().status === 'active') {
          ordersToMatch = [{ id: orderDoc.id, ...orderDoc.data() }];
        }
      } else {
        // Buscar todas ordens ativas
        const activeOrders = await db.collection(this.ordersCollection)
          .where('status', '==', 'active')
          .get();
        ordersToMatch = activeOrders.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      const matches = [];

      // Para cada ordem de venda, buscar ordens de compra compatíveis
      for (const sellOrder of ordersToMatch.filter(o => o.order_type === 'sell')) {
        const buyOrders = await db.collection(this.ordersCollection)
          .where('order_type', '==', 'buy')
          .where('item_id', '==', sellOrder.item_id)
          .where('status', '==', 'active')
          .get();

        for (const buyDoc of buyOrders.docs) {
          const buyOrder = { id: buyDoc.id, ...buyDoc.data() };

          // Não fazer match consigo mesmo
          if (buyOrder.country_id === sellOrder.country_id) continue;

          // Verificar compatibilidade de preço
          const sellPrice = sellOrder.price_per_unit;
          const buyPrice = buyOrder.price_per_unit;
          const minSellPrice = sellOrder.min_price_sell || sellPrice * 0.8;
          const maxBuyPrice = buyOrder.max_price_buy || buyPrice * 1.2;

          // Match ocorre se o vendedor aceita o preço do comprador
          if (buyPrice >= minSellPrice && buyPrice <= maxBuyPrice) {
            // Preço final: média entre os dois
            const finalPrice = (sellPrice + buyPrice) / 2;

            // Quantidade: menor das duas
            const quantity = Math.min(sellOrder.quantity, buyOrder.quantity);

            // Criar match
            const match = {
              sell_order_id: sellOrder.id,
              buy_order_id: buyOrder.id,
              item_id: sellOrder.item_id,
              quantity: quantity,
              price: finalPrice,
              total_value: quantity * finalPrice,
              status: 'pending',
              created_at: new Date()
            };

            // Salvar match
            await db.collection(this.matchesCollection).add(match);
            matches.push(match);

            console.log(`✅ Match criado: ${sellOrder.country_name} vende ${quantity} ${sellOrder.unit} de ${sellOrder.item_name} para ${buyOrder.country_name} por $${finalPrice.toFixed(2)}/${sellOrder.unit}`);
          }
        }
      }

      console.log(`🎯 Total de matches criados: ${matches.length}`);
      return matches;

    } catch (error) {
      console.error('❌ Erro ao fazer matching de ordens:', error);
      throw error;
    }
  }

  /**
   * Processar transações recorrentes do turno
   */
  async processTurnRecurringOrders(currentTurn) {
    try {
      console.log(`🔄 Processando ordens recorrentes do turno ${currentTurn}...`);

      // Buscar todos os matches pendentes
      const matchesSnapshot = await db.collection(this.matchesCollection)
        .where('status', '==', 'pending')
        .get();

      const results = {
        total: matchesSnapshot.size,
        executed: 0,
        failed: 0,
        errors: []
      };

      for (const matchDoc of matchesSnapshot.docs) {
        const match = matchDoc.data();

        try {
          // Executar transação
          const result = await this.executeRecurringTransaction(match, currentTurn);

          if (result.success) {
            results.executed++;
            // Atualizar status do match
            await matchDoc.ref.update({ status: 'completed', executed_at: new Date() });
          } else {
            results.failed++;
            results.errors.push({ matchId: matchDoc.id, reason: result.reason });
            await matchDoc.ref.update({ status: 'failed', error: result.reason });
          }

        } catch (error) {
          results.failed++;
          results.errors.push({ matchId: matchDoc.id, error: error.message });
          console.error(`❌ Erro ao executar match ${matchDoc.id}:`, error);
        }
      }

      console.log(`✅ Processamento concluído: ${results.executed} executadas, ${results.failed} falhas`);
      return results;

    } catch (error) {
      console.error('❌ Erro ao processar ordens recorrentes:', error);
      throw error;
    }
  }

  /**
   * Executar transação recorrente (CORE DO SISTEMA)
   */
  async executeRecurringTransaction(match, currentTurn) {
    try {
      console.log('⚙️ Executando transação recorrente:', match);

      // Buscar ordens completas
      const sellOrderDoc = await db.collection(this.ordersCollection).doc(match.sell_order_id).get();
      const buyOrderDoc = await db.collection(this.ordersCollection).doc(match.buy_order_id).get();

      if (!sellOrderDoc.exists || !buyOrderDoc.exists) {
        return { success: false, reason: 'Ordens não encontradas' };
      }

      const sellOrder = { id: sellOrderDoc.id, ...sellOrderDoc.data() };
      const buyOrder = { id: buyOrderDoc.id, ...buyOrderDoc.data() };

      // Buscar dados dos países
      const sellerDoc = await db.collection('paises').doc(sellOrder.country_id).get();
      const buyerDoc = await db.collection('paises').doc(buyOrder.country_id).get();

      if (!sellerDoc.exists || !buyerDoc.exists) {
        return { success: false, reason: 'Países não encontrados' };
      }

      const sellerData = sellerDoc.data();
      const buyerData = buyerDoc.data();

      // 1. VALIDAR VENDEDOR TEM ESTOQUE
      const gameResourceKey = getGameResourceKey(sellOrder.item_id);
      const sellerProduction = window.ResourceProductionCalculator?.calculateCountryProduction(sellerData)[gameResourceKey] || 0;
      const sellerConsumption = window.ResourceConsumptionCalculator?.calculateCountryConsumption(sellerData)[gameResourceKey] || 0;
      const sellerAvailable = Math.max(0, sellerProduction - sellerConsumption);

      if (sellerAvailable < match.quantity + sellOrder.min_stock_reserve) {
        // Pausar ordem de venda por falta de estoque
        await db.collection(this.ordersCollection).doc(sellOrder.id).update({
          status: 'out_of_stock',
          updated_at: new Date()
        });
        return { success: false, reason: 'Vendedor sem estoque suficiente' };
      }

      // 2. VALIDAR COMPRADOR TEM ORÇAMENTO
      const buyerBudget = this.calculateBudget(buyerData);
      const totalValue = match.quantity * match.price;

      if (buyerBudget < totalValue + buyOrder.min_budget_reserve) {
        // Pausar ordem de compra por falta de orçamento
        await db.collection(this.ordersCollection).doc(buyOrder.id).update({
          status: 'out_of_budget',
          updated_at: new Date()
        });
        return { success: false, reason: 'Comprador sem orçamento suficiente' };
      }

      // 3. EXECUTAR TRANSFERÊNCIAS (BATCH TRANSACTION)
      const batch = db.batch();

      // 3a. VENDEDOR: -recurso
      const sellerCurrentStock = parseFloat(sellerData[gameResourceKey] || 0);
      batch.update(db.collection('paises').doc(sellOrder.country_id), {
        [gameResourceKey]: sellerCurrentStock - match.quantity,
        updated_at: new Date()
      });

      // 3b. COMPRADOR: +recurso
      const buyerCurrentStock = parseFloat(buyerData[gameResourceKey] || 0);
      batch.update(db.collection('paises').doc(buyOrder.country_id), {
        [gameResourceKey]: buyerCurrentStock + match.quantity,
        updated_at: new Date()
      });

      // 3c. REGISTRAR TRANSAÇÃO NO HISTÓRICO
      const transactionRef = db.collection(this.transactionsCollection).doc();
      batch.set(transactionRef, {
        sell_order_id: sellOrder.id,
        buy_order_id: buyOrder.id,
        seller_country_id: sellOrder.country_id,
        seller_country_name: sellOrder.country_name,
        buyer_country_id: buyOrder.country_id,
        buyer_country_name: buyOrder.country_name,
        item_id: sellOrder.item_id,
        item_name: sellOrder.item_name,
        quantity: match.quantity,
        unit: sellOrder.unit,
        price_per_unit: match.price,
        total_value: totalValue,
        executed_at: new Date(),
        turn_number: currentTurn,
        status: 'completed',

        // Logs detalhados
        seller_budget_before: this.calculateBudget(sellerData),
        seller_budget_after: this.calculateBudget({
          ...sellerData,
          OrcamentoGasto: Math.max(0, parseFloat(sellerData.OrcamentoGasto || 0) - totalValue)
        }),
        buyer_budget_before: buyerBudget,
        buyer_budget_after: this.calculateBudget({
          ...buyerData,
          OrcamentoGasto: parseFloat(buyerData.OrcamentoGasto || 0) + totalValue
        }),
        seller_stock_before: sellerCurrentStock,
        seller_stock_after: sellerCurrentStock - match.quantity,
        buyer_stock_before: buyerCurrentStock,
        buyer_stock_after: buyerCurrentStock + match.quantity
      });

      // 3d. ATUALIZAR ESTATÍSTICAS DAS ORDENS
      batch.update(db.collection(this.ordersCollection).doc(sellOrder.id), {
        last_execution: new Date(),
        total_executed: (sellOrder.total_executed || 0) + 1,
        total_volume: (sellOrder.total_volume || 0) + match.quantity,
        total_value: (sellOrder.total_value || 0) + totalValue,
        updated_at: new Date()
      });

      batch.update(db.collection(this.ordersCollection).doc(buyOrder.id), {
        last_execution: new Date(),
        total_executed: (buyOrder.total_executed || 0) + 1,
        total_volume: (buyOrder.total_volume || 0) + match.quantity,
        total_value: (buyOrder.total_value || 0) + totalValue,
        updated_at: new Date()
      });

      // 4. COMMIT TUDO DE UMA VEZ (TRANSAÇÃO ATÔMICA)
      await batch.commit();

      // 5. REGISTRAR NO BUDGET TRACKER (após commit bem-sucedido)
      try {
        // Registrar receita do vendedor
        await BudgetTracker.addIncome(
          sellOrder.country_id,
          BudgetTracker.INCOME_CATEGORIES.MARKETPLACE_SALES,
          totalValue,
          `Venda de ${match.quantity} ${sellOrder.unit} de ${sellOrder.item_name} para ${buyOrder.country_name}`
        );

        // Registrar despesa do comprador
        await BudgetTracker.addExpense(
          buyOrder.country_id,
          BudgetTracker.EXPENSE_CATEGORIES.MARKETPLACE_PURCHASES,
          totalValue,
          `Compra de ${match.quantity} ${sellOrder.unit} de ${sellOrder.item_name} de ${sellOrder.country_name}`
        );

        console.log(`💰 Budget atualizado: Vendedor +$${(totalValue / 1000000).toFixed(2)}M, Comprador -$${(totalValue / 1000000).toFixed(2)}M`);
      } catch (budgetError) {
        console.error('⚠️ Erro ao atualizar budget tracker (transação já foi executada):', budgetError);
        // Não falhar a transação por causa do budget tracker
      }

      console.log(`✅ Transação executada: ${sellOrder.country_name} vendeu ${match.quantity} ${sellOrder.unit} de ${sellOrder.item_name} para ${buyOrder.country_name} por $${totalValue.toLocaleString()}`);

      return { success: true, transactionId: transactionRef.id };

    } catch (error) {
      console.error('❌ Erro ao executar transação recorrente:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancelar ordem recorrente
   */
  async cancelOrder(orderId) {
    try {
      await db.collection(this.ordersCollection).doc(orderId).update({
        status: 'cancelled',
        updated_at: new Date()
      });
      console.log('✅ Ordem cancelada:', orderId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao cancelar ordem:', error);
      throw error;
    }
  }

  /**
   * Pausar ordem recorrente
   */
  async pauseOrder(orderId) {
    try {
      await db.collection(this.ordersCollection).doc(orderId).update({
        status: 'paused',
        updated_at: new Date()
      });
      console.log('⏸️ Ordem pausada:', orderId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao pausar ordem:', error);
      throw error;
    }
  }

  /**
   * Reativar ordem recorrente
   */
  async reactivateOrder(orderId) {
    try {
      await db.collection(this.ordersCollection).doc(orderId).update({
        status: 'active',
        updated_at: new Date()
      });
      console.log('▶️ Ordem reativada:', orderId);

      // Tentar matching imediato
      await this.matchOrders(orderId);

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao reativar ordem:', error);
      throw error;
    }
  }

  /**
   * Listar ordens de um país
   */
  async getCountryOrders(countryId, status = null) {
    try {
      let query = db.collection(this.ordersCollection)
        .where('country_id', '==', countryId);

      if (status) {
        query = query.where('status', '==', status);
      }

      const snapshot = await query.orderBy('created_at', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
      console.error('❌ Erro ao listar ordens:', error);
      throw error;
    }
  }

  /**
   * Obter histórico de transações de um país
   */
  async getCountryTransactions(countryId, limit = 50) {
    try {
      const sellerTransactions = await db.collection(this.transactionsCollection)
        .where('seller_country_id', '==', countryId)
        .orderBy('executed_at', 'desc')
        .limit(limit)
        .get();

      const buyerTransactions = await db.collection(this.transactionsCollection)
        .where('buyer_country_id', '==', countryId)
        .orderBy('executed_at', 'desc')
        .limit(limit)
        .get();

      const allTransactions = [
        ...sellerTransactions.docs.map(doc => ({ id: doc.id, type: 'sell', ...doc.data() })),
        ...buyerTransactions.docs.map(doc => ({ id: doc.id, type: 'buy', ...doc.data() }))
      ];

      // Ordenar por data
      allTransactions.sort((a, b) => b.executed_at.toMillis() - a.executed_at.toMillis());

      return allTransactions.slice(0, limit);

    } catch (error) {
      console.error('❌ Erro ao buscar histórico de transações:', error);
      throw error;
    }
  }
}

// Expor globalmente
window.RecurringOrdersSystem = RecurringOrdersSystem;
