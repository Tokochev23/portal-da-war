# 💰 Plano: Sistema de Budget Breakdown (Detalhamento de Orçamento)

## 📋 Objetivo

Criar um sistema de **tooltip interativo** que mostre o detalhamento completo do orçamento quando o usuário passar o mouse sobre o valor, exibindo:
- Orçamento base (PIB × 0.25 × Burocracia × Estabilidade)
- Todas as adições (receitas de vendas, etc)
- Todas as subtrações (compras, manutenção, agências, etc)
- Orçamento disponível final

---

## 🎯 Problema Atual

**Situação:** Quando o jogador vende tanques ou faz transações, não fica claro se o valor foi creditado no orçamento ou não.

**Exemplo:**
```
Orçamento: $15.2M
? Vendeu 10 tanques por $5M - Onde está esse dinheiro?
? Comprou recursos por $3M - Foi debitado?
? Agências gastando $2M/turno - Está incluído?
```

---

## 🏗️ Arquitetura da Solução

### **Fase 1: Estrutura de Dados (budgetBreakdown)**

Criar campo estruturado no documento do país:

```javascript
budgetBreakdown: {
  // Base
  base: {
    pib: 60000000,           // PIB bruto
    burocracia: 0.85,        // 85% eficiência
    estabilidade: 0.75,      // 75% estabilidade
    calculated: 19125000     // PIB * 0.25 * buro * (stab * 1.5)
  },

  // Adições (Receitas)
  additions: {
    marketplaceSales: 5000000,        // Vendas marketplace
    resourceSales: 1200000,           // Vendas de recursos
    loanReceived: 0,                  // Empréstimos recebidos
    subsidies: 0,                     // Subsídios
    total: 6200000
  },

  // Subtrações (Despesas)
  subtractions: {
    marketplacePurchases: 3000000,    // Compras marketplace
    resourcePurchases: 800000,        // Compras de recursos
    agencyBudget: 2000000,            // Orçamento de agências
    vehicleMaintenance: 1500000,      // Manutenção veículos
    divisionMaintenance: 800000,      // Manutenção divisões
    fleetMaintenance: 1200000,        // Manutenção frotas
    shipyardMaintenance: 500000,      // Manutenção estaleiros
    infrastructureCosts: 600000,      // Infraestrutura
    militaryProduction: 2000000,      // Produção militar
    loanPayments: 0,                  // Pagamento empréstimos
    total: 12400000
  },

  // Resultado Final
  available: 12925000,  // base.calculated + additions.total - subtractions.total
  lastUpdated: Timestamp
}
```

---

### **Fase 2: Sistema de Tracking Automático**

#### **2.1 Criar BudgetTracker.js**

Classe centralizada para registrar todas as operações:

```javascript
class BudgetTracker {
  /**
   * Inicia novo breakdown para o turno
   */
  static async initializeTurn(countryId, country) {
    const breakdown = {
      base: this.calculateBase(country),
      additions: {},
      subtractions: {},
      available: 0,
      lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('paises').doc(countryId).update({
      budgetBreakdown: breakdown
    });
  }

  /**
   * Registra adição ao orçamento
   */
  static async addIncome(countryId, category, amount, description) {
    // Exemplo: addIncome('brasil', 'marketplaceSales', 5000000, 'Venda de 10 T-55')
    await db.collection('paises').doc(countryId).update({
      [`budgetBreakdown.additions.${category}`]: firebase.firestore.FieldValue.increment(amount)
    });
  }

  /**
   * Registra subtração do orçamento
   */
  static async addExpense(countryId, category, amount, description) {
    // Exemplo: addExpense('brasil', 'marketplacePurchases', 3000000, 'Compra de 50 AK-47')
    await db.collection('paises').doc(countryId).update({
      [`budgetBreakdown.subtractions.${category}`]: firebase.firestore.FieldValue.increment(amount)
    });
  }

  /**
   * Recalcula orçamento disponível
   */
  static async recalculate(countryId) {
    const doc = await db.collection('paises').doc(countryId).get();
    const breakdown = doc.data().budgetBreakdown;

    const additionsTotal = Object.values(breakdown.additions || {}).reduce((sum, val) => sum + val, 0);
    const subtractionsTotal = Object.values(breakdown.subtractions || {}).reduce((sum, val) => sum + val, 0);
    const available = breakdown.base.calculated + additionsTotal - subtractionsTotal;

    await db.collection('paises').doc(countryId).update({
      'budgetBreakdown.additions.total': additionsTotal,
      'budgetBreakdown.subtractions.total': subtractionsTotal,
      'budgetBreakdown.available': available
    });
  }
}
```

---

### **Fase 3: Integração com Sistemas Existentes**

#### **3.1 recurringOrdersSystem.js**

```javascript
// Após executar transação de VENDA
await BudgetTracker.addIncome(
  sellerId,
  'marketplaceSales',
  transaction.totalValue,
  `Venda: ${transaction.quantity}x ${transaction.resourceType}`
);

// Após executar transação de COMPRA
await BudgetTracker.addExpense(
  buyerId,
  'marketplacePurchases',
  transaction.totalValue,
  `Compra: ${transaction.quantity}x ${transaction.resourceType}`
);
```

#### **3.2 intelligenceAgencySystem.js**

```javascript
// Fundação de agência
await BudgetTracker.addExpense(
  countryId,
  'agencyBudget',
  foundationCost,
  `Fundação: ${agencyName}`
);

// Operações mensais
await BudgetTracker.addExpense(
  countryId,
  'agencyBudget',
  monthlyCost,
  `Manutenção: ${agencyName}`
);
```

#### **3.3 turnProcessor.js**

```javascript
// No início do turno
await BudgetTracker.initializeTurn(countryId, country);

// Calcular manutenções
const vehicleMaintenance = calculateVehicleMaintenance(country);
await BudgetTracker.addExpense(countryId, 'vehicleMaintenance', vehicleMaintenance, 'Manutenção mensal');

const divisionMaintenance = calculateDivisionMaintenance(country);
await BudgetTracker.addExpense(countryId, 'divisionMaintenance', divisionMaintenance, 'Manutenção mensal');

// Recalcular no final
await BudgetTracker.recalculate(countryId);
```

---

### **Fase 4: Componente Visual (Tooltip)**

#### **4.1 HTML/CSS do Tooltip**

```html
<!-- Orçamento com tooltip -->
<div class="budget-display" onmouseenter="showBudgetBreakdown()" onmouseleave="hideBudgetBreakdown()">
  <span class="budget-label">💰 Orçamento Disponível:</span>
  <span class="budget-value">$15.2M</span>
  <span class="budget-info-icon">ℹ️</span>
</div>

<!-- Tooltip (hidden por padrão) -->
<div id="budget-breakdown-tooltip" class="budget-tooltip hidden">
  <div class="tooltip-header">
    <h3>📊 Detalhamento do Orçamento</h3>
  </div>

  <!-- Base -->
  <div class="tooltip-section">
    <div class="section-title">🏛️ Orçamento Base</div>
    <div class="breakdown-row">
      <span>PIB Bruto:</span>
      <span class="value">$60.0M</span>
    </div>
    <div class="breakdown-row sub">
      <span>× 25% (Taxa Padrão)</span>
      <span class="value">$15.0M</span>
    </div>
    <div class="breakdown-row sub">
      <span>× 85% (Burocracia)</span>
      <span class="value">$12.75M</span>
    </div>
    <div class="breakdown-row sub">
      <span>× 1.125 (Estabilidade 75%)</span>
      <span class="value positive">$14.34M</span>
    </div>
    <div class="breakdown-total">
      <span>Base Calculada:</span>
      <span class="value bold">$19.13M</span>
    </div>
  </div>

  <!-- Adições -->
  <div class="tooltip-section additions">
    <div class="section-title positive">➕ Receitas</div>
    <div class="breakdown-row">
      <span>💵 Vendas Marketplace:</span>
      <span class="value positive">+$5.00M</span>
    </div>
    <div class="breakdown-row">
      <span>🛢️ Vendas de Recursos:</span>
      <span class="value positive">+$1.20M</span>
    </div>
    <div class="breakdown-total positive">
      <span>Total Receitas:</span>
      <span class="value bold">+$6.20M</span>
    </div>
  </div>

  <!-- Subtrações -->
  <div class="tooltip-section subtractions">
    <div class="section-title negative">➖ Despesas</div>
    <div class="breakdown-row">
      <span>🛒 Compras Marketplace:</span>
      <span class="value negative">-$3.00M</span>
    </div>
    <div class="breakdown-row">
      <span>🕵️ Orçamento Agências:</span>
      <span class="value negative">-$2.00M</span>
    </div>
    <div class="breakdown-row">
      <span>🚗 Manutenção Veículos:</span>
      <span class="value negative">-$1.50M</span>
    </div>
    <div class="breakdown-row">
      <span>🎖️ Manutenção Divisões:</span>
      <span class="value negative">-$0.80M</span>
    </div>
    <div class="breakdown-row">
      <span>⚓ Manutenção Frotas:</span>
      <span class="value negative">-$1.20M</span>
    </div>
    <div class="breakdown-row">
      <span>🏭 Outros Custos:</span>
      <span class="value negative">-$3.90M</span>
    </div>
    <div class="breakdown-total negative">
      <span>Total Despesas:</span>
      <span class="value bold">-$12.40M</span>
    </div>
  </div>

  <!-- Resultado Final -->
  <div class="tooltip-footer">
    <div class="final-calculation">
      <div class="calc-row">
        <span>Base:</span>
        <span>$19.13M</span>
      </div>
      <div class="calc-row positive">
        <span>+ Receitas:</span>
        <span>+$6.20M</span>
      </div>
      <div class="calc-row negative">
        <span>- Despesas:</span>
        <span>-$12.40M</span>
      </div>
      <div class="calc-total">
        <span>💰 Disponível:</span>
        <span class="value final">$12.93M</span>
      </div>
    </div>
  </div>
</div>
```

#### **4.2 CSS do Tooltip**

```css
.budget-tooltip {
  position: absolute;
  z-index: 1000;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 20px;
  min-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  font-size: 14px;
  animation: fadeInTooltip 0.3s ease;
}

.tooltip-section {
  margin: 16px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.section-title {
  font-weight: bold;
  margin-bottom: 8px;
  color: #94a3b8;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.breakdown-row.sub {
  padding-left: 20px;
  font-size: 12px;
  color: #94a3b8;
}

.value.positive {
  color: #22c55e;
}

.value.negative {
  color: #ef4444;
}

.breakdown-total {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  font-weight: bold;
}

.calc-total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 3px solid #3b82f6;
  font-size: 18px;
  font-weight: bold;
  color: #60a5fa;
}
```

---

### **Fase 5: JavaScript para Tooltip**

```javascript
/**
 * Mostra tooltip de breakdown do orçamento
 */
async function showBudgetBreakdown() {
  const tooltip = document.getElementById('budget-breakdown-tooltip');
  const country = await getCurrentCountryData();
  const breakdown = country.budgetBreakdown || {};

  // Preencher dados do tooltip
  populateBudgetTooltip(breakdown);

  // Posicionar e mostrar
  tooltip.classList.remove('hidden');
  positionTooltip(tooltip);
}

/**
 * Preenche tooltip com dados do breakdown
 */
function populateBudgetTooltip(breakdown) {
  // Base
  document.getElementById('base-pib').textContent = formatCurrency(breakdown.base.pib);
  document.getElementById('base-calculated').textContent = formatCurrency(breakdown.base.calculated);

  // Receitas
  const additionsContainer = document.getElementById('additions-list');
  additionsContainer.innerHTML = Object.entries(breakdown.additions || {})
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => `
      <div class="breakdown-row">
        <span>${getCategoryLabel(key)}:</span>
        <span class="value positive">+${formatCurrency(value)}</span>
      </div>
    `).join('');

  // Despesas
  const subtractionsContainer = document.getElementById('subtractions-list');
  subtractionsContainer.innerHTML = Object.entries(breakdown.subtractions || {})
    .filter(([key]) => key !== 'total')
    .map(([key, value]) => `
      <div class="breakdown-row">
        <span>${getCategoryLabel(key)}:</span>
        <span class="value negative">-${formatCurrency(value)}</span>
      </div>
    `).join('');

  // Total
  document.getElementById('final-available').textContent = formatCurrency(breakdown.available);
}

/**
 * Labels amigáveis para categorias
 */
function getCategoryLabel(category) {
  const labels = {
    marketplaceSales: '💵 Vendas Marketplace',
    resourceSales: '🛢️ Vendas de Recursos',
    marketplacePurchases: '🛒 Compras Marketplace',
    resourcePurchases: '🛢️ Compras de Recursos',
    agencyBudget: '🕵️ Orçamento Agências',
    vehicleMaintenance: '🚗 Manutenção Veículos',
    divisionMaintenance: '🎖️ Manutenção Divisões',
    fleetMaintenance: '⚓ Manutenção Frotas',
    shipyardMaintenance: '🏭 Manutenção Estaleiros',
    militaryProduction: '⚔️ Produção Militar'
  };
  return labels[category] || category;
}
```

---

## 📅 Cronograma de Implementação

### **Sprint 1: Estrutura (2-3 horas)**
- [ ] Criar `js/systems/budgetTracker.js`
- [ ] Definir schema de `budgetBreakdown` no Firestore
- [ ] Implementar funções básicas (initializeTurn, addIncome, addExpense)

### **Sprint 2: Integrações (4-5 horas)**
- [ ] Integrar com `recurringOrdersSystem.js`
- [ ] Integrar com `intelligenceAgencySystem.js`
- [ ] Integrar com `turnProcessor.js`
- [ ] Adicionar tracking de manutenções

### **Sprint 3: UI/UX (3-4 horas)**
- [ ] Criar componente visual do tooltip
- [ ] Implementar CSS com animações
- [ ] Adicionar lógica de show/hide
- [ ] Posicionamento inteligente do tooltip

### **Sprint 4: Testes & Polish (2-3 horas)**
- [ ] Testar cálculos em cenários reais
- [ ] Validar todas as categorias
- [ ] Adicionar logs para debug
- [ ] Documentar sistema

---

## 🎯 Benefícios da Solução

1. ✅ **Transparência Total** - Jogador vê exatamente de onde vem e para onde vai o dinheiro
2. ✅ **Debugging Fácil** - Narrador pode identificar problemas rapidamente
3. ✅ **Auditoria** - Histórico completo de transações
4. ✅ **UX Melhorada** - Interface intuitiva com hover tooltip
5. ✅ **Escalável** - Fácil adicionar novas categorias de receita/despesa

---

## 🔄 Fluxo Completo do Sistema

```
INÍCIO DO TURNO
    ↓
BudgetTracker.initializeTurn()
  └─ Calcula base (PIB × 0.25 × Burocracia × Estabilidade)
  └─ Reseta additions e subtractions
    ↓
DURANTE O TURNO
  ├─ Venda no marketplace → BudgetTracker.addIncome()
  ├─ Compra no marketplace → BudgetTracker.addExpense()
  ├─ Operação de agência → BudgetTracker.addExpense()
  └─ Produção militar → BudgetTracker.addExpense()
    ↓
A CADA MUDANÇA
  └─ BudgetTracker.recalculate()
      └─ Atualiza totals
      └─ Atualiza available
    ↓
JOGADOR PASSA O MOUSE
  └─ showBudgetBreakdown()
      └─ Mostra tooltip detalhado
      └─ Exibe base + receitas - despesas = disponível
```

---

## 📊 Exemplo Real de Uso

**Cenário:** Brasil vendeu 10 tanques T-55 por $5M

**Antes (confuso):**
```
Orçamento: $15.2M
??? O dinheiro entrou ou não? ???
```

**Depois (claro):**
```
Orçamento: $20.2M ℹ️
  [HOVER]

  📊 Detalhamento do Orçamento

  🏛️ Base: $15.0M

  ➕ Receitas:
    💵 Vendas Marketplace: +$5.0M ← AQUI ESTÁ!
    Total: +$5.0M

  ➖ Despesas:
    🕵️ Agências: -$2.0M
    🚗 Veículos: -$1.5M
    Total: -$3.5M

  💰 Disponível: $16.5M
```

---

**Status:** 📝 Plano completo - Pronto para implementação
**Prioridade:** 🔴 Alta
**Complexidade:** 🟡 Média
