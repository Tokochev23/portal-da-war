# 💰 Sistema Financeiro do Marketplace - Como Funciona

## 📊 Estrutura de Orçamento

### Campos no Firestore (`paises` collection):

```javascript
{
  PIB: 100000000,              // PIB bruto (não mexe diretamente!)
  Burocracia: 80,              // % eficiência (0-100)
  Estabilidade: 90,            // % estabilidade (0-100)
  OrcamentoGasto: 5000000,     // Gastos nacionais acumulados
  AgencyBudgetSpent: 1000000,  // Gastos da agência de inteligência

  // Recursos
  Metais: 50000,
  Combustivel: 30000,
  Carvao: 20000,
  Graos: 15000
}
```

### Cálculo de Orçamento Disponível:

```javascript
function calculateBudget(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
  const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;

  // Orçamento total = 25% do PIB × eficiência × estabilidade
  const orcamentoTotal = pibBruto * 0.25 * burocracia * (estabilidade * 1.5);

  // Descontar gastos
  const orcamentoGasto = parseFloat(country.OrcamentoGasto || 0);
  const agencyBudget = parseFloat(country.AgencyBudgetSpent || 0);

  // Orçamento disponível
  return Math.max(0, orcamentoTotal - orcamentoGasto - agencyBudget);
}
```

### Exemplo:
```
PIB: $100.000.000
Burocracia: 80%
Estabilidade: 90%

Orçamento Total = 100.000.000 × 0.25 × 0.8 × (0.9 × 1.5)
                = 100.000.000 × 0.25 × 0.8 × 1.35
                = $27.000.000

Gastos:
- OrcamentoGasto: $5.000.000
- AgencyBudgetSpent: $1.000.000

Orçamento Disponível = 27.000.000 - 5.000.000 - 1.000.000
                     = $21.000.000
```

---

## 🔄 Transações do Marketplace

### Quando COMPRADOR compra recursos:

```javascript
// ERRADO ❌ - Não mexer no PIB
await db.collection('paises').doc(buyerId).update({
  PIB: country.PIB - totalCost  // ❌ NUNCA FAZER ISSO!
});

// CERTO ✅ - Adicionar aos gastos
await db.collection('paises').doc(buyerId).update({
  OrcamentoGasto: (country.OrcamentoGasto || 0) + totalCost,  // ✅
  Metais: (country.Metais || 0) + quantity                    // ✅
});
```

### Quando VENDEDOR vende recursos:

```javascript
// Vendedor recebe o dinheiro como CRÉDITO no orçamento
await db.collection('paises').doc(sellerId).update({
  OrcamentoGasto: Math.max(0, (country.OrcamentoGasto || 0) - totalValue),  // ✅ Reduz gastos = ganha dinheiro
  Metais: (country.Metais || 0) - quantity                                  // ✅ Perde recurso
});
```

### Por quê não mexer no PIB?

O **PIB** é um valor base que representa a economia do país. Ele é usado para:
- Calcular orçamento total por turno
- Comparações entre países
- Rankings econômicos

Se mexermos no PIB diretamente:
- ❌ Orçamento total muda incorretamente
- ❌ Rankings ficam errados
- ❌ Sistema fica instável

**O correto:** Trabalhar com `OrcamentoGasto`, que é o acumulador de gastos do turno.

---

## 📝 Exemplo de Transação Completa

### Cenário:
- **Brasil (Vendedor)** vende 1.000 toneladas de Metais por $500/ton
- **Argentina (Comprador)** compra

### Antes da Transação:

**Brasil:**
```javascript
{
  PIB: 100000000,
  OrcamentoGasto: 5000000,
  Metais: 50000
}
// Orçamento disponível: $21.000.000
```

**Argentina:**
```javascript
{
  PIB: 80000000,
  OrcamentoGasto: 3000000,
  Metais: 10000
}
// Orçamento disponível: $15.000.000
```

### Executar Transação:

```javascript
const totalValue = 1000 * 500; // $500.000

const batch = db.batch();

// COMPRADOR (Argentina)
batch.update(db.collection('paises').doc('argentina'), {
  OrcamentoGasto: 3000000 + 500000,  // 3.500.000 (gastou mais $500k)
  Metais: 10000 + 1000                // 11.000 ton
});

// VENDEDOR (Brasil)
batch.update(db.collection('paises').doc('brasil'), {
  OrcamentoGasto: Math.max(0, 5000000 - 500000),  // 4.500.000 (recebeu $500k)
  Metais: 50000 - 1000                             // 49.000 ton
});

await batch.commit();
```

### Depois da Transação:

**Brasil:**
```javascript
{
  PIB: 100000000,           // ✅ Não mudou
  OrcamentoGasto: 4500000,  // ✅ Reduziu (ganhou dinheiro)
  Metais: 49000             // ✅ Perdeu recurso
}
// Orçamento disponível: $21.500.000 (+$500k)
```

**Argentina:**
```javascript
{
  PIB: 80000000,            // ✅ Não mudou
  OrcamentoGasto: 3500000,  // ✅ Aumentou (gastou dinheiro)
  Metais: 11000             // ✅ Ganhou recurso
}
// Orçamento disponível: $14.500.000 (-$500k)
```

---

## 🔄 Sistema de Ordens Recorrentes

### Executar Transação Recorrente:

```javascript
async function executeRecurringTransaction(match, currentTurn) {
  const { sell_order, buy_order, quantity, price } = match;
  const totalValue = quantity * price;

  try {
    // 1. Validar vendedor tem recurso
    const sellerCountry = await db.collection('paises').doc(sell_order.country_id).get();
    const sellerData = sellerCountry.data();
    const sellerStock = parseFloat(sellerData[getResourceFieldName(sell_order.item_id)] || 0);

    if (sellerStock < quantity + sell_order.min_stock_reserve) {
      await updateOrderStatus(sell_order.id, 'out_of_stock');
      return { success: false, reason: 'Vendedor sem estoque' };
    }

    // 2. Validar comprador tem orçamento
    const buyerCountry = await db.collection('paises').doc(buy_order.country_id).get();
    const buyerData = buyerCountry.data();
    const buyerBudget = calculateBudget(buyerData);  // ✅ Usa a função correta

    if (buyerBudget < totalValue + buy_order.min_budget_reserve) {
      await updateOrderStatus(buy_order.id, 'out_of_budget');
      return { success: false, reason: 'Comprador sem orçamento' };
    }

    // 3. EXECUTAR TRANSFERÊNCIAS
    const batch = db.batch();

    // 3a. Vendedor: -recurso, +dinheiro (via redução de OrcamentoGasto)
    const sellerRef = db.collection('paises').doc(sell_order.country_id);
    const sellerResourceField = getResourceFieldName(sell_order.item_id);
    batch.update(sellerRef, {
      [sellerResourceField]: sellerStock - quantity,
      OrcamentoGasto: Math.max(0, (parseFloat(sellerData.OrcamentoGasto || 0) - totalValue)),  // ✅ RECEBE dinheiro
      updated_at: new Date()
    });

    // 3b. Comprador: +recurso, -dinheiro (via aumento de OrcamentoGasto)
    const buyerRef = db.collection('paises').doc(buy_order.country_id);
    const buyerResourceField = getResourceFieldName(buy_order.item_id);
    const buyerStock = parseFloat(buyerData[buyerResourceField] || 0);
    batch.update(buyerRef, {
      [buyerResourceField]: buyerStock + quantity,
      OrcamentoGasto: (parseFloat(buyerData.OrcamentoGasto || 0) + totalValue),  // ✅ GASTA dinheiro
      updated_at: new Date()
    });

    // 3c. Registrar transação no histórico
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

      // Logs detalhados
      seller_budget_before: calculateBudget(sellerData),
      seller_budget_after: calculateBudget({
        ...sellerData,
        OrcamentoGasto: Math.max(0, (parseFloat(sellerData.OrcamentoGasto || 0) - totalValue))
      }),
      buyer_budget_before: buyerBudget,
      buyer_budget_after: calculateBudget({
        ...buyerData,
        OrcamentoGasto: (parseFloat(buyerData.OrcamentoGasto || 0) + totalValue)
      }),

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

    return { success: true, transactionId: transactionRef.id };

  } catch (error) {
    console.error('Erro ao executar transação recorrente:', error);
    return { success: false, error: error.message };
  }
}
```

---

## 🔑 Pontos-Chave

### ✅ FAZER:
1. **Comprar:** `OrcamentoGasto += valor` (aumenta gastos)
2. **Vender:** `OrcamentoGasto = Math.max(0, OrcamentoGasto - valor)` (reduz gastos = ganha dinheiro)
3. **Validar orçamento:** Usar `calculateBudget(country)` para checar se tem dinheiro
4. **Recursos:** Atualizar campos `Metais`, `Combustivel`, `Carvao`, `Graos`

### ❌ NÃO FAZER:
1. ❌ Mexer no `PIB` diretamente
2. ❌ Deixar `OrcamentoGasto` negativo (sempre `Math.max(0, ...)`)
3. ❌ Esquecer de validar orçamento antes da compra
4. ❌ Esquecer de validar estoque antes da venda

---

## 📊 Helper Functions

```javascript
// Mapear item_id para nome do campo no Firestore
function getResourceFieldName(itemId) {
  const mapping = {
    'metals': 'Metais',
    'oil': 'Combustivel',
    'coal': 'Carvao',
    'food': 'Graos'
  };
  return mapping[itemId] || itemId;
}

// Obter estoque de um recurso
function getResourceStock(countryData, itemId) {
  const fieldName = getResourceFieldName(itemId);
  return parseFloat(countryData[fieldName] || 0);
}

// Calcular orçamento disponível
function calculateBudget(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
  const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;
  const orcamentoTotal = pibBruto * 0.25 * burocracia * (estabilidade * 1.5);
  const orcamentoGasto = parseFloat(country.OrcamentoGasto || 0);
  const agencyBudget = parseFloat(country.AgencyBudgetSpent || 0);
  return Math.max(0, orcamentoTotal - orcamentoGasto - agencyBudget);
}

// Adicionar receita (vendeu algo)
function addRevenue(country, amount) {
  return {
    ...country,
    OrcamentoGasto: Math.max(0, (parseFloat(country.OrcamentoGasto || 0) - amount))
  };
}

// Adicionar gasto (comprou algo)
function addExpense(country, amount) {
  return {
    ...country,
    OrcamentoGasto: (parseFloat(country.OrcamentoGasto || 0) + amount)
  };
}
```

---

## 🎯 Validações Importantes

### Antes de Comprar:
```javascript
const buyerBudget = calculateBudget(buyerData);
if (buyerBudget < totalCost) {
  throw new Error(`Orçamento insuficiente. Necessário: $${totalCost.toLocaleString()}, Disponível: $${buyerBudget.toLocaleString()}`);
}
```

### Antes de Vender:
```javascript
const sellerStock = getResourceStock(sellerData, itemId);
if (sellerStock < quantity) {
  throw new Error(`Estoque insuficiente. Necessário: ${quantity.toLocaleString()}, Disponível: ${sellerStock.toLocaleString()}`);
}
```

### Ordem Recorrente - Reservas:
```javascript
// Comprador: sempre manter uma reserva de orçamento
if (buyerBudget < totalCost + minBudgetReserve) {
  await pauseOrder(buyOrderId, 'out_of_budget');
}

// Vendedor: sempre manter uma reserva de estoque
if (sellerStock < quantity + minStockReserve) {
  await pauseOrder(sellOrderId, 'out_of_stock');
}
```

---

## 🔄 Reset de Turno

A cada novo turno, o `OrcamentoGasto` é resetado:

```javascript
// turnProcessor.js - processar novo turno
async function processNewTurn() {
  // Resetar orçamento gasto de todos os países
  const countries = await db.collection('paises').get();

  const batch = db.batch();
  countries.docs.forEach(doc => {
    batch.update(doc.ref, {
      OrcamentoGasto: 0,         // ✅ Reset para novo turno
      AgencyBudgetSpent: 0       // ✅ Reset gastos da agência
    });
  });

  await batch.commit();

  // Processar ordens recorrentes DEPOIS do reset
  await processTurnRecurringOrders(currentTurn);
}
```

---

Está correto agora? 🎯
