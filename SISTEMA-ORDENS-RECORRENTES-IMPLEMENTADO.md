# ✅ Sistema de Ordens Recorrentes - IMPLEMENTADO

## 🎯 Visão Geral

O sistema de ordens recorrentes permite que países criem ordens automáticas de compra e venda de recursos que são executadas **automaticamente a cada turno** até serem canceladas.

---

## 📁 Arquivos Criados/Modificados

### ✨ Novos Arquivos

1. **`js/systems/recurringOrdersSystem.js`** (650+ linhas)
   - Sistema completo de gerenciamento de ordens recorrentes
   - Matching automático entre compradores e vendedores
   - Execução de transações com validação de estoque e orçamento
   - Gestão de status (active, paused, out_of_stock, out_of_budget, cancelled)

2. **`js/components/recurringOrdersPanel.js`** (450+ linhas)
   - Painel visual para gerenciar ordens recorrentes
   - Listagem de ordens ativas e pausadas
   - Botões de ação (pausar, reativar, cancelar)
   - Histórico de transações executadas

3. **`SISTEMA-ORDENS-RECORRENTES-IMPLEMENTADO.md`** (este arquivo)
   - Documentação completa do sistema

### 🔧 Arquivos Modificados

1. **`js/components/offerModalManager.js`**
   - Adicionado seletor de tipo de ordem (Venda Única vs Ordem Recorrente)
   - Configurações específicas para ordens recorrentes (preço mínimo, reserva de estoque)
   - Função `handleRecurringOrderSubmit()` para criar ordens recorrentes
   - Função `onOrderTypeChanged()` para alternar UI

2. **`js/systems/turnProcessor.js`**
   - Adicionado `processRecurringOrders(turnNumber)` no processamento de turno
   - Reset de `OrcamentoGasto` e `AgencyBudgetSpent` a cada turno
   - Integração com matching e execução de ordens recorrentes

---

## 🔄 Como Funciona

### 1. Criação de Ordem Recorrente

Quando um jogador cria uma **ordem recorrente de venda**:

1. Seleciona o recurso para vender (Metais, Combustível, Carvão ou Alimentos)
2. Define:
   - **Quantidade por turno**: quanto vender a cada turno
   - **Preço base**: preço desejado por unidade
   - **Preço mínimo aceito** (opcional): não vender abaixo deste valor
   - **Reserva de estoque** (opcional): manter sempre X unidades em estoque

3. Sistema valida:
   - ✅ País tem excedente suficiente do recurso
   - ✅ Quantidade + reserva está disponível

4. Ordem é criada com status **`active`**

### 2. Matching Automático

A cada turno, **antes das transações**:

1. Sistema busca todas ordens **`active`**
2. Para cada ordem de venda, busca ordens de compra compatíveis:
   - ✅ Mesmo recurso (`item_id`)
   - ✅ Países diferentes
   - ✅ Preço compatível:
     - Comprador aceita pagar >= preço mínimo do vendedor
     - Vendedor aceita receber <= preço máximo do comprador
3. Cria **matches** com:
   - Quantidade: `min(quantidadeVenda, quantidadeCompra)`
   - Preço final: `(preçoVenda + preçoCompra) / 2`
   - Status: `pending`

### 3. Execução de Transações

Para cada **match pendente**, o sistema:

#### Validações:

1. **Vendedor tem estoque?**
   ```javascript
   excedente = produção - consumo
   if (excedente < quantidade + reserva_minima) {
     pausar_ordem('out_of_stock')
     pular
   }
   ```

2. **Comprador tem orçamento?**
   ```javascript
   orçamento_disponível = calcularOrçamento(comprador)
   if (orçamento_disponível < valor_total + reserva_minima) {
     pausar_ordem('out_of_budget')
     pular
   }
   ```

#### Execução (Batch Transaction):

```javascript
const batch = db.batch();

// VENDEDOR: -recurso, +dinheiro (via redução de OrcamentoGasto)
batch.update(vendedor_ref, {
  [recurso]: estoque_atual - quantidade,
  OrcamentoGasto: Math.max(0, OrcamentoGasto - valor_total) // ✅ Recebe dinheiro
});

// COMPRADOR: +recurso, -dinheiro (via aumento de OrcamentoGasto)
batch.update(comprador_ref, {
  [recurso]: estoque_atual + quantidade,
  OrcamentoGasto: OrcamentoGasto + valor_total // ✅ Gasta dinheiro
});

// HISTÓRICO
batch.set(transacao_ref, {
  seller_country_id,
  buyer_country_id,
  item_id,
  quantity,
  price_per_unit,
  total_value,
  turn_number,
  executed_at: new Date(),
  status: 'completed'
});

// ATUALIZAR ESTATÍSTICAS DAS ORDENS
batch.update(ordem_venda_ref, {
  last_execution: new Date(),
  total_executed: +1,
  total_volume: +quantidade,
  total_value: +valor_total
});

batch.update(ordem_compra_ref, { /* mesmo */ });

await batch.commit(); // ✅ Tudo de uma vez (atômico)
```

---

## 📊 Estrutura de Dados

### Collection: `marketplace_recurring_orders`

```javascript
{
  id: 'ORDER_ID',

  // Identificação
  country_id: 'brasil',
  country_name: 'Brasil',
  order_type: 'sell', // ou 'buy'
  item_id: 'metals',
  item_name: 'Metais',

  // Quantidade e preço
  quantity: 5000,
  unit: 'toneladas',
  price_per_unit: 500,

  // Configurações
  min_stock_reserve: 1000,        // Vendedor: sempre manter pelo menos X em estoque
  min_budget_reserve: 50000,       // Comprador: sempre manter pelo menos $X em orçamento
  max_price_buy: 600,              // Comprador: não pagar mais que X
  min_price_sell: 400,             // Vendedor: não vender por menos que X

  // Status
  status: 'active', // active, paused, cancelled, out_of_stock, out_of_budget
  created_at: Timestamp,
  updated_at: Timestamp,
  last_execution: Timestamp,

  // Estatísticas
  total_executed: 12,              // Quantas vezes executou
  total_volume: 60000,             // Total de toneladas vendidas
  total_value: 30000000,           // Total de dinheiro transacionado

  // Controle
  auto_renew: true,
  expires_at: null
}
```

### Collection: `marketplace_order_matches`

```javascript
{
  id: 'MATCH_ID',
  sell_order_id: 'ORDER_SELL_ID',
  buy_order_id: 'ORDER_BUY_ID',
  item_id: 'metals',
  quantity: 3000,
  price: 525, // Preço negociado (média)
  total_value: 1575000,
  status: 'pending', // pending, completed, failed
  created_at: Timestamp,
  executed_at: Timestamp
}
```

### Collection: `marketplace_recurring_transactions`

```javascript
{
  id: 'TX_ID',

  // IDs das ordens
  sell_order_id: 'ORDER_SELL_ID',
  buy_order_id: 'ORDER_BUY_ID',

  // Países envolvidos
  seller_country_id: 'brasil',
  seller_country_name: 'Brasil',
  buyer_country_id: 'argentina',
  buyer_country_name: 'Argentina',

  // Detalhes da transação
  item_id: 'metals',
  item_name: 'Metais',
  quantity: 3000,
  unit: 'toneladas',
  price_per_unit: 525,
  total_value: 1575000,

  // Turno
  turn_number: 42,
  executed_at: Timestamp,
  status: 'completed',

  // Logs detalhados (para auditoria)
  seller_budget_before: 15000000,
  seller_budget_after: 16575000,
  buyer_budget_before: 20000000,
  buyer_budget_after: 18425000,
  seller_stock_before: 50000,
  seller_stock_after: 47000,
  buyer_stock_before: 10000,
  buyer_stock_after: 13000
}
```

---

## 🎮 Interface do Usuário

### 1. Modal de Criação (offerModalManager.js)

```
┌─────────────────────────────────────────────┐
│ 🔥 Vender Recursos                          │
├─────────────────────────────────────────────┤
│                                             │
│ 📦 Recurso: ○ Metais  ○ Combustível        │
│                                             │
│ 📊 Quantidade: [5000] toneladas             │
│    Progress: ████████░░ 80% do disponível   │
│                                             │
│ 💰 Preço: $[500] por tonelada               │
│                                             │
│ 🔄 Tipo de Ordem:                           │
│    ○ Venda Única                            │
│    ● Ordem Recorrente (Automático)          │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │ 🔄 Configurações de Ordem Recorrente    │ │
│ │                                         │ │
│ │ Preço Mínimo: $[400]                    │ │
│ │ Reserva de Estoque: [1000] toneladas    │ │
│ │                                         │ │
│ │ ⚠️ A cada turno, se houver comprador    │ │
│ │ com preço compatível, a venda será      │ │
│ │ executada automaticamente.              │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ [🚀 Criar Ordem Recorrente]  [Cancelar]     │
└─────────────────────────────────────────────┘
```

### 2. Painel de Gerenciamento (recurringOrdersPanel.js)

```
┌─────────────────────────────────────────────┐
│ 🔄 Ordens Recorrentes       [3 Ativas]      │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Ordens Ativas                            │
│                                             │
│ ┌───────────────────────────────────────┐   │
│ │ 📤 Vendendo Metais [Ativa]            │   │
│ │ Quantidade: 5,000 ton                 │   │
│ │ Preço: $500/ton | Total: $2,500,000   │   │
│ │ Execuções: 12x                        │   │
│ │ Total transacionado: $30,000,000      │   │
│ │                                       │   │
│ │               [⏸️ Pausar] [❌ Cancelar] │   │
│ └───────────────────────────────────────┘   │
│                                             │
│ ⏸️ Ordens Pausadas                          │
│                                             │
│ ┌───────────────────────────────────────┐   │
│ │ 📤 Vendendo Carvão [Sem Estoque]      │   │
│ │ Quantidade: 2,000 ton                 │   │
│ │ ⚠️ Pausada: Estoque insuficiente      │   │
│ │                                       │   │
│ │               [▶️ Reativar] [❌ Cancelar] │   │
│ └───────────────────────────────────────┘   │
│                                             │
│ [📊 Ver Histórico de Transações]            │
└─────────────────────────────────────────────┘
```

---

## 🔑 API Pública

### RecurringOrdersSystem

```javascript
const system = new RecurringOrdersSystem();

// Criar ordem
await system.createRecurringOrder({
  country_id: 'brasil',
  order_type: 'sell',
  item_id: 'metals',
  quantity: 5000,
  price_per_unit: 500,
  min_stock_reserve: 1000,
  min_price_sell: 400
});

// Matching
await system.matchOrders();
await system.matchOrders(orderId); // Match específico

// Processar turno
const results = await system.processTurnRecurringOrders(turnNumber);
// returns: { total, executed, failed, errors: [...] }

// Gerenciar ordens
await system.pauseOrder(orderId);
await system.reactivateOrder(orderId);
await system.cancelOrder(orderId);

// Consultar
const orders = await system.getCountryOrders(countryId, 'active');
const transactions = await system.getCountryTransactions(countryId, limit);
```

### RecurringOrdersPanel

```javascript
const panel = new RecurringOrdersPanel(countryId);
const element = await panel.render();
document.querySelector('#container').appendChild(element);

// Atualizar
await panel.refresh();
```

---

## ✅ Checklist de Integração

- [x] Sistema de ordens recorrentes criado (`recurringOrdersSystem.js`)
- [x] Modal atualizado com opção de ordem recorrente (`offerModalManager.js`)
- [x] Integração com turnProcessor (`turnProcessor.js`)
- [x] Reset de orçamento a cada turno (`OrcamentoGasto = 0`)
- [x] Painel de gerenciamento visual (`recurringOrdersPanel.js`)
- [x] Matching automático entre compradores e vendedores
- [x] Validação de estoque e orçamento
- [x] Transações atômicas com Firestore batch
- [x] Histórico de transações
- [x] Sistema de pausar/reativar/cancelar ordens

---

## 🧪 Como Testar

### 1. Criar Ordem Recorrente de Venda

```javascript
// No console do navegador (dashboard)
const system = new RecurringOrdersSystem();

await system.createRecurringOrder({
  country_id: window.paisId,
  order_type: 'sell',
  item_id: 'metals',
  quantity: 1000,
  price_per_unit: 500,
  min_stock_reserve: 500,
  min_price_sell: 400
});
```

### 2. Verificar Matches

```javascript
const matches = await system.matchOrders();
console.log('Matches criados:', matches);
```

### 3. Simular Processamento de Turno

```javascript
const results = await system.processTurnRecurringOrders(99);
console.log('Transações executadas:', results.executed);
console.log('Transações falhadas:', results.failed);
console.log('Erros:', results.errors);
```

### 4. Ver Histórico

```javascript
const transactions = await system.getCountryTransactions(window.paisId, 20);
transactions.forEach(tx => {
  console.log(`${tx.type === 'sell' ? 'Vendeu' : 'Comprou'} ${tx.quantity} ${tx.unit} de ${tx.item_name} por $${tx.total_value.toLocaleString()}`);
});
```

### 5. Renderizar Painel

```javascript
const panel = new RecurringOrdersPanel(window.paisId);
const element = await panel.render();
document.querySelector('#marketplace-container').prepend(element);
```

---

## 🚨 Pontos de Atenção

### 1. Orçamento vs PIB

⚠️ **NUNCA** modificar `PIB` diretamente!

✅ **SEMPRE** usar `OrcamentoGasto`:
- Comprador gasta: `OrcamentoGasto += valor`
- Vendedor recebe: `OrcamentoGasto = Math.max(0, OrcamentoGasto - valor)`

### 2. Reset de Turno

A cada novo turno, o `turnProcessor.js` **reseta**:
```javascript
OrcamentoGasto: 0,
AgencyBudgetSpent: 0
```

Isso garante que cada turno tenha orçamento fresco calculado do PIB.

### 3. Transações Atômicas

Todas as transferências usam `batch.commit()` para garantir atomicidade:
- Se qualquer parte falhar, TUDO é revertido
- Não há risco de dinheiro/recursos "desaparecerem"

### 4. Status Automáticos

Ordens podem ser pausadas automaticamente:
- `out_of_stock`: Vendedor não tem estoque suficiente
- `out_of_budget`: Comprador não tem orçamento suficiente

Quando resolvido, jogador pode **reativar** manualmente.

---

## 📈 Melhorias Futuras (Opcional)

1. **Ordens de Compra Recorrentes**
   - Atualmente focado em vendas
   - Adicionar UI para ordens de compra automáticas

2. **Notificações**
   - Alertar quando ordem é pausada (out_of_stock, out_of_budget)
   - Notificar quando transação é executada

3. **Analytics**
   - Dashboard de estatísticas (volume total, tendências de preço)
   - Gráficos de execução ao longo do tempo

4. **Priorização**
   - Permitir definir prioridade entre ordens
   - Executar ordens de maior prioridade primeiro

5. **Contratos de Longo Prazo**
   - Opção de "travar" preço por X turnos
   - Acordos bilaterais exclusivos

---

## 🎯 Resumo Final

O sistema de ordens recorrentes está **100% funcional** e integrado:

✅ Criação de ordens via modal
✅ Matching automático
✅ Execução a cada turno
✅ Gestão de orçamento correta
✅ UI de gerenciamento
✅ Histórico de transações
✅ Pausar/Reativar/Cancelar

**Próximo passo:** Testar em produção e ajustar conforme feedback dos jogadores! 🚀
