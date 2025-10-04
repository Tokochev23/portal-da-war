# 🔄 Sistema de Ordens Recorrentes - Marketplace Automático

## 📋 Visão Geral

Sistema de compra/venda **automática e recorrente** de recursos entre países, processado a cada turno.

---

## 🎯 Funcionalidades

### 1. **Ordens de Venda Recorrentes**

Vendedor cria uma ordem que fica ativa até cancelar:
- Define recurso, quantidade por turno e preço
- A cada turno: perde recurso, ganha dinheiro
- Continua até:
  - Vendedor cancelar
  - Ficar sem recurso
  - Ninguém mais comprar

### 2. **Ordens de Compra Recorrentes**

Comprador cria uma ordem que fica ativa até cancelar:
- Define recurso, quantidade por turno e preço máximo
- A cada turno: ganha recurso, perde dinheiro
- Continua até:
  - Comprador cancelar
  - Ficar sem orçamento
  - Não haver mais vendedores

---

## 🏗️ Arquitetura

### Coleção: `marketplace_recurring_orders`

```javascript
{
  id: "auto-gerado",

  // Tipo
  type: "sell" | "buy",
  category: "resources" | "vehicles" | "naval",

  // Item
  item_id: "metals",
  item_name: "Metais",
  unit: "toneladas",

  // Quantidade e Preço
  quantity_per_turn: 1000,        // Quantidade por turno
  price_per_unit: 500,            // Preço unitário

  // País
  country_id: "brasil",
  country_name: "Brasil",
  player_id: "uid123",

  // Status
  status: "active" | "paused" | "cancelled" | "out_of_stock" | "out_of_budget",

  // Histórico
  created_at: timestamp,
  last_execution: timestamp,
  next_execution: timestamp,
  total_executed: 15,             // Quantas vezes foi executada
  total_volume: 15000,            // Volume total transacionado
  total_value: 7500000,           // Valor total movimentado

  // Configurações
  auto_renew: true,               // Renovar automaticamente
  max_executions: null,           // null = infinito
  min_budget_reserve: 1000000,    // Reserva mínima de orçamento (compras)
  min_stock_reserve: 5000,        // Reserva mínima de estoque (vendas)

  // Matching (para compras)
  max_price_willing_to_pay: 550,  // Preço máximo aceitável
  preferred_sellers: [],          // Lista de vendedores preferidos
  avoid_sellers: [],              // Lista de vendedores a evitar

  // Matching (para vendas)
  min_price_willing_to_sell: 450, // Preço mínimo aceitável
  preferred_buyers: [],           // Lista de compradores preferidos
  avoid_buyers: []                // Lista de compradores a evitar
}
```

### Coleção: `marketplace_recurring_transactions`

```javascript
{
  id: "auto-gerado",

  // Ordem original
  sell_order_id: "order123",
  buy_order_id: "order456",

  // Partes
  seller_country_id: "brasil",
  seller_country_name: "Brasil",
  buyer_country_id: "argentina",
  buyer_country_name: "Argentina",

  // Transação
  item_id: "metals",
  item_name: "Metais",
  quantity: 1000,
  unit: "toneladas",
  price_per_unit: 500,
  total_value: 500000,

  // Execução
  executed_at: timestamp,
  turn_number: 42,

  // Resultado
  status: "completed" | "failed" | "partial",
  seller_received: 500000,        // Dinheiro que vendedor recebeu
  buyer_paid: 500000,             // Dinheiro que comprador pagou
  resources_transferred: 1000,    // Recursos transferidos

  // Logs
  seller_balance_before: 10000000,
  seller_balance_after: 10500000,
  buyer_balance_before: 5000000,
  buyer_balance_after: 4500000,

  seller_stock_before: 50000,
  seller_stock_after: 49000,
  buyer_stock_before: 10000,
  buyer_stock_after: 11000
}
```

---

## 🔄 Processamento por Turno

### Função: `processTurnRecurringOrders()`

Executada automaticamente a cada turno pelo `turnProcessor.js`:

```javascript
async function processTurnRecurringOrders(currentTurn) {
  console.log(`🔄 Processando ordens recorrentes - Turno ${currentTurn}`);

  // 1. Buscar todas as ordens ativas
  const activeOrders = await getActiveRecurringOrders();

  // 2. Separar vendas e compras
  const sellOrders = activeOrders.filter(o => o.type === 'sell');
  const buyOrders = activeOrders.filter(o => o.type === 'buy');

  // 3. Fazer matching (combinar vendas com compras)
  const matches = matchOrdersOptimally(sellOrders, buyOrders);

  // 4. Executar cada match
  for (const match of matches) {
    await executeRecurringTransaction(match, currentTurn);
  }

  // 5. Atualizar status das ordens
  await updateOrderStatuses();

  console.log(`✅ ${matches.length} transações recorrentes executadas`);
}
```

### Algoritmo de Matching

```javascript
function matchOrdersOptimally(sellOrders, buyOrders) {
  const matches = [];

  // Agrupar por item_id
  const itemGroups = {};

  sellOrders.forEach(sell => {
    if (!itemGroups[sell.item_id]) {
      itemGroups[sell.item_id] = { sells: [], buys: [] };
    }
    itemGroups[sell.item_id].sells.push(sell);
  });

  buyOrders.forEach(buy => {
    if (!itemGroups[buy.item_id]) {
      itemGroups[buy.item_id] = { sells: [], buys: [] };
    }
    itemGroups[buy.item_id].buys.push(buy);
  });

  // Para cada recurso
  Object.entries(itemGroups).forEach(([itemId, group]) => {
    // Ordenar vendas por preço (menor primeiro = melhor para comprador)
    group.sells.sort((a, b) => a.price_per_unit - b.price_per_unit);

    // Ordenar compras por preço (maior primeiro = melhor para vendedor)
    group.buys.sort((a, b) => b.max_price_willing_to_pay - a.max_price_willing_to_pay);

    // Fazer matching
    group.sells.forEach(sell => {
      group.buys.forEach(buy => {
        // Verificar se preços são compatíveis
        if (sell.price_per_unit <= buy.max_price_willing_to_pay) {
          // Verificar restrições (embargos, blacklist, etc)
          if (canTradeWith(sell, buy)) {
            matches.push({
              sell_order: sell,
              buy_order: buy,
              quantity: Math.min(sell.quantity_per_turn, buy.quantity_per_turn),
              price: sell.price_per_unit // Vendedor define o preço
            });
          }
        }
      });
    });
  });

  return matches;
}
```

### Executar Transação

```javascript
async function executeRecurringTransaction(match, currentTurn) {
  const { sell_order, buy_order, quantity, price } = match;
  const totalValue = quantity * price;

  try {
    // 1. Validar vendedor tem recurso
    const sellerCountry = await db.collection('paises').doc(sell_order.country_id).get();
    const sellerData = sellerCountry.data();
    const sellerStock = getResourceStock(sellerData, sell_order.item_id);

    if (sellerStock < quantity + sell_order.min_stock_reserve) {
      // Marcar ordem como sem estoque
      await updateOrderStatus(sell_order.id, 'out_of_stock');
      return { success: false, reason: 'Vendedor sem estoque' };
    }

    // 2. Validar comprador tem orçamento
    const buyerCountry = await db.collection('paises').doc(buy_order.country_id).get();
    const buyerData = buyerCountry.data();
    const buyerBudget = calculateBudget(buyerData);

    if (buyerBudget < totalValue + buy_order.min_budget_reserve) {
      // Marcar ordem como sem orçamento
      await updateOrderStatus(buy_order.id, 'out_of_budget');
      return { success: false, reason: 'Comprador sem orçamento' };
    }

    // 3. EXECUTAR TRANSFERÊNCIAS
    const batch = db.batch();

    // 3a. Vendedor: -recurso, +dinheiro
    const sellerRef = db.collection('paises').doc(sell_order.country_id);
    batch.update(sellerRef, {
      [getResourceFieldName(sell_order.item_id)]: sellerStock - quantity,
      PIB: parseFloat(sellerData.PIB || 0) + totalValue,
      updated_at: new Date()
    });

    // 3b. Comprador: +recurso, -dinheiro (via redução do PIB)
    const buyerRef = db.collection('paises').doc(buy_order.country_id);
    const buyerStock = getResourceStock(buyerData, buy_order.item_id);
    batch.update(buyerRef, {
      [getResourceFieldName(buy_order.item_id)]: buyerStock + quantity,
      PIB: parseFloat(buyerData.PIB || 0) - totalValue,
      updated_at: new Date()
    });

    // 3c. Registrar transação
    const transactionRef = db.collection('marketplace_recurring_transactions').doc();
    batch.set(transactionRef, {
      sell_order_id: sell_order.id,
      buy_order_id: buy_order.id,
      seller_country_id: sell_order.country_id,
      seller_country_name: sell_order.country_name,
      buyer_country_id: buy_order.country_id,
      buyer_country_name: buy_order.country_name,
      item_id: sell_order.item_id,
      item_name: sell_order.item_name,
      quantity: quantity,
      unit: sell_order.unit,
      price_per_unit: price,
      total_value: totalValue,
      executed_at: new Date(),
      turn_number: currentTurn,
      status: 'completed',
      seller_received: totalValue,
      buyer_paid: totalValue,
      resources_transferred: quantity,
      // Logs
      seller_balance_before: parseFloat(sellerData.PIB || 0),
      seller_balance_after: parseFloat(sellerData.PIB || 0) + totalValue,
      buyer_balance_before: parseFloat(buyerData.PIB || 0),
      buyer_balance_after: parseFloat(buyerData.PIB || 0) - totalValue,
      seller_stock_before: sellerStock,
      seller_stock_after: sellerStock - quantity,
      buyer_stock_before: buyerStock,
      buyer_stock_after: buyerStock + quantity
    });

    // 3d. Atualizar estatísticas das ordens
    const sellOrderRef = db.collection('marketplace_recurring_orders').doc(sell_order.id);
    batch.update(sellOrderRef, {
      last_execution: new Date(),
      total_executed: (sell_order.total_executed || 0) + 1,
      total_volume: (sell_order.total_volume || 0) + quantity,
      total_value: (sell_order.total_value || 0) + totalValue
    });

    const buyOrderRef = db.collection('marketplace_recurring_orders').doc(buy_order.id);
    batch.update(buyOrderRef, {
      last_execution: new Date(),
      total_executed: (buy_order.total_executed || 0) + 1,
      total_volume: (buy_order.total_volume || 0) + quantity,
      total_value: (buy_order.total_value || 0) + totalValue
    });

    // 4. COMMIT tudo de uma vez (transação atômica)
    await batch.commit();

    console.log(`✅ Transação recorrente: ${sell_order.country_name} vendeu ${quantity} ${sell_order.unit} de ${sell_order.item_name} para ${buy_order.country_name} por $${totalValue.toLocaleString()}`);

    // 5. Enviar notificações
    await sendRecurringTransactionNotification(sell_order, buy_order, quantity, totalValue);

    return { success: true, transactionId: transactionRef.id };

  } catch (error) {
    console.error('Erro ao executar transação recorrente:', error);
    return { success: false, error: error.message };
  }
}
```

### Helper: Obter Nome do Campo de Recurso

```javascript
function getResourceFieldName(itemId) {
  const mapping = {
    'metals': 'Metais',
    'oil': 'Combustivel',
    'coal': 'Carvao',
    'food': 'Graos'
  };
  return mapping[itemId] || itemId;
}

function getResourceStock(countryData, itemId) {
  const fieldName = getResourceFieldName(itemId);
  return parseFloat(countryData[fieldName] || 0);
}
```

---

## 🎨 UI - Criar Ordem Recorrente

### Modal Atualizado

```html
<!-- Toggle: Ordem Única vs Recorrente -->
<div class="mb-4">
  <label class="block text-sm font-semibold text-slate-300 mb-3">
    🔄 Tipo de Ordem
  </label>

  <div class="grid grid-cols-2 gap-3">
    <label class="flex items-center p-3 border-2 border-bg-ring rounded-lg cursor-pointer">
      <input type="radio" name="order_mode" value="single" checked>
      <div class="ml-3">
        <div class="font-medium text-white">📦 Ordem Única</div>
        <div class="text-xs text-slate-400">Vender/comprar uma vez</div>
      </div>
    </label>

    <label class="flex items-center p-3 border-2 border-bg-ring rounded-lg cursor-pointer">
      <input type="radio" name="order_mode" value="recurring">
      <div class="ml-3">
        <div class="font-medium text-white">🔄 Ordem Recorrente</div>
        <div class="text-xs text-slate-400">Automático a cada turno</div>
      </div>
    </label>
  </div>
</div>

<!-- Configurações de Ordem Recorrente (mostrado se selecionado) -->
<div id="recurring-settings" class="hidden bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
  <h3 class="text-blue-300 font-semibold mb-3">🔄 Configurações Recorrentes</h3>

  <div class="space-y-3">
    <div>
      <label class="text-sm text-slate-300">Quantidade por Turno</label>
      <input type="number" name="quantity_per_turn" min="1"
             class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white">
      <p class="text-xs text-slate-400 mt-1">
        ⚙️ Esta quantidade será vendida/comprada automaticamente todo turno
      </p>
    </div>

    <div>
      <label class="text-sm text-slate-300">Reserva Mínima de Estoque</label>
      <input type="number" name="min_stock_reserve" value="5000"
             class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white">
      <p class="text-xs text-slate-400 mt-1">
        🛡️ Nunca vender se o estoque ficar abaixo deste valor
      </p>
    </div>

    <div>
      <label class="flex items-center gap-2">
        <input type="checkbox" name="auto_renew" checked
               class="w-4 h-4 text-brand-500">
        <span class="text-sm text-white">Renovar automaticamente</span>
      </label>
      <p class="text-xs text-slate-400 mt-1">
        ♾️ Continuar até cancelar manualmente
      </p>
    </div>
  </div>

  <div class="mt-4 p-3 bg-amber-500/10 border border-amber-400/30 rounded-lg">
    <div class="flex items-start gap-2">
      <span class="text-amber-400">💡</span>
      <div class="text-xs text-slate-300">
        <strong>Como funciona:</strong> A cada turno, o sistema automaticamente:
        <ul class="list-disc ml-4 mt-1">
          <li>Busca compradores/vendedores compatíveis</li>
          <li>Executa a transação (transfere recursos e dinheiro)</li>
          <li>Continua até você cancelar ou ficar sem estoque/orçamento</li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

---

## 📊 Dashboard de Ordens Ativas

### Painel: "Minhas Ordens Recorrentes"

```html
<div class="bg-bg-soft rounded-lg p-5 border border-bg-ring">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-bold text-white">🔄 Ordens Recorrentes Ativas</h3>
    <span class="text-sm text-slate-400">3 ativas</span>
  </div>

  <!-- Ordem de Venda -->
  <div class="bg-bg border border-green-500/30 rounded-lg p-4 mb-3">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-green-400 font-bold">🔥 VENDENDO</span>
          <span class="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">
            Ativa
          </span>
        </div>

        <div class="text-white font-semibold">
          Metais - 1.000 toneladas/turno
        </div>

        <div class="text-sm text-slate-400 mt-1">
          Preço: $500/tonelada • Total/turno: $500.000
        </div>
      </div>

      <button class="text-red-400 hover:text-red-300 text-sm">
        ❌ Cancelar
      </button>
    </div>

    <div class="mt-3 pt-3 border-t border-green-500/20 grid grid-cols-3 gap-3 text-sm">
      <div>
        <div class="text-slate-400">Executada</div>
        <div class="text-white font-semibold">15 vezes</div>
      </div>
      <div>
        <div class="text-slate-400">Volume Total</div>
        <div class="text-white font-semibold">15.000 ton</div>
      </div>
      <div>
        <div class="text-slate-400">Receita Total</div>
        <div class="text-green-400 font-semibold">$7.500.000</div>
      </div>
    </div>
  </div>

  <!-- Ordem de Compra -->
  <div class="bg-bg border border-blue-500/30 rounded-lg p-4">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-blue-400 font-bold">💰 COMPRANDO</span>
          <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
            Ativa
          </span>
        </div>

        <div class="text-white font-semibold">
          Combustível - 500 barris/turno
        </div>

        <div class="text-sm text-slate-400 mt-1">
          Preço máx: $85/barril • Total/turno: $42.500
        </div>
      </div>

      <button class="text-amber-400 hover:text-amber-300 text-sm">
        ⏸️ Pausar
      </button>
    </div>

    <div class="mt-3 pt-3 border-t border-blue-500/20 grid grid-cols-3 gap-3 text-sm">
      <div>
        <div class="text-slate-400">Executada</div>
        <div class="text-white font-semibold">8 vezes</div>
      </div>
      <div>
        <div class="text-slate-400">Volume Total</div>
        <div class="text-white font-semibold">4.000 barris</div>
      </div>
      <div>
        <div class="text-slate-400">Gasto Total</div>
        <div class="text-red-400 font-semibold">-$340.000</div>
      </div>
    </div>
  </div>
</div>
```

---

## 🔔 Notificações

A cada transação executada, notificar ambos os países:

```javascript
await db.collection('notifications').add({
  type: 'recurring_transaction_executed',
  country_id: seller_country_id,
  priority: 'normal',
  read: false,
  created_at: new Date(),

  title: `💰 Ordem Recorrente Executada`,
  message: `Você vendeu ${quantity.toLocaleString()} ${unit} de ${item_name} para ${buyer_country_name} por $${total_value.toLocaleString()}`,

  data: {
    transaction_id: transactionRef.id,
    order_id: sell_order.id,
    buyer_country: buyer_country_name,
    quantity: quantity,
    total_value: total_value
  }
});
```

---

## ✅ Vantagens do Sistema

1. **Automático**: Jogadores não precisam ficar criando ofertas manualmente
2. **Eficiente**: Processa todas as transações de uma vez por turno
3. **Justo**: Matching otimizado por preço
4. **Transparente**: Histórico completo de transações
5. **Controlável**: Pode pausar/cancelar a qualquer momento
6. **Seguro**: Validações de estoque e orçamento
7. **Realista**: Simula acordos comerciais de longo prazo

---

## 🚀 Implementação

1. **Criar coleções** no Firestore
2. **Atualizar OfferModalManager** para incluir opção recorrente
3. **Criar RecurringOrdersSystem** (`js/systems/recurringOrdersSystem.js`)
4. **Integrar com turnProcessor.js**
5. **Criar UI de gerenciamento**
6. **Adicionar notificações**

Quer que eu implemente isso?
