# PRD: Sistema de Marketplace Internacional - Refatoração Completa

## 📋 Sumário Executivo

Este documento detalha a refatoração completa do **Sistema de Marketplace Internacional** do War1954, um sistema de comércio entre países que permite compra e venda de recursos e equipamentos militares.

### Problemas Críticos Atuais

1. **🐛 Erro de Validação Fatal**: Sistema não reconhece recursos vendidos
   - Erro: "Tipo de recurso não reconhecido"
   - Causa: Mapeamento incorreto entre IDs genéricos (`carvao`, `metais`) e IDs específicos esperados (`steel_high_grade`, `oil_crude`)
   - Localização: `marketplaceSystem.js:1016`

2. **🎨 UX Inconsistente**: Modal de criação de oferta genérico
   - Mesmos campos para recursos e equipamentos
   - Não adapta unidades automaticamente (toneladas, barris, unidades)
   - Campo "descrição" obrigatório mesmo para recursos (não faz sentido)
   - Não mostra estoque disponível claramente

3. **📊 Falta de Validação em Tempo Real**: Usuário só descobre erros ao submeter
   - Não valida quantidade disponível durante digitação
   - Não sugere preços de mercado
   - Não calcula automaticamente valor total da transação

4. **🔄 Dados Duplicados**: Sistema calcula recursos duas vezes
   - Uma vez no dashboard (produção vs consumo)
   - Outra vez no marketplace (validação)
   - Lógicas diferentes causam inconsistências

---

## 🎯 Objetivos da Refatoração

### Objetivos Primários

1. **Corrigir erro de validação** - Sistema deve aceitar vendas de recursos
2. **Adaptar modal dinamicamente** - UX específica para cada tipo de item
3. **Validação em tempo real** - Feedback instantâneo durante preenchimento
4. **Unificação de lógica** - Um único lugar para cálculo de recursos disponíveis

### Objetivos Secundários

5. **Melhorar acessibilidade** - Mensagens claras, prevenção de erros
6. **Design responsivo** - Modal otimizado para diferentes telas
7. **Histórico e analytics** - Rastrear transações e preços médios
8. **Sugestões inteligentes** - Preços baseados em mercado e escassez

---

## 🔍 Análise Técnica Detalhada

### 1. Problema do Mapeamento de Recursos

#### Estado Atual

**No Dashboard (linha 3664):**
```javascript
availableItems.resources.push({
    id: resourceName.toLowerCase(),  // ❌ "carvao", "metais", "combustivel"
    name: `${resourceName} (Excedente: ${balance.toLocaleString()})`,
    unit: (resourceName === 'Combustivel') ? 'barris' : 'toneladas',
    available: balance
});
```

**No MarketplaceSystem (linha 1001-1011):**
```javascript
const resourceMap = {
    'steel_high_grade': 'Metais',      // ✅ Esperado
    'steel_standard': 'Metais',
    'oil_crude': 'Combustivel',
    'oil_aviation': 'Combustivel',
    'aluminum': 'Metais',
    'copper': 'Metais',
    'rare_metals': 'Metais',
    'coal': 'Carvao',                  // ✅ Esperado
    'food': 'Graos'
};

const resourceType = resourceMap[offerData.item_id];  // ❌ UNDEFINED!
if (!resourceType) {
    throw new Error('Tipo de recurso não reconhecido');  // 💥 ERRO
}
```

#### Análise da Causa-Raiz

O dashboard envia:
- `item_id: "carvao"` (simples, lowercase do nome do recurso)

O marketplace espera:
- `item_id: "coal"` (específico, nome do tipo de recurso no mercado internacional)

**Conflito:** Dois sistemas de nomenclatura incompatíveis!

#### Soluções Possíveis

**Opção A: Mapear no Frontend (ESCOLHIDA)**
- ✅ Não quebra sistema existente
- ✅ Permite múltiplos tipos por recurso (aço padrão vs alta qualidade)
- ✅ Preparado para expansão futura
- ❌ Precisa manter dois mapeamentos sincronizados

**Opção B: Simplificar Backend**
- ✅ Código mais simples
- ❌ Remove granularidade (todos metais = mesmo tipo)
- ❌ Dificulta expansão futura

**Opção C: Unificar Nomenclatura**
- ✅ Sistema consistente
- ❌ Requer migração de dados
- ❌ Quebra compatibilidade com ofertas existentes

---

### 2. Problema da UX Genérica

#### Estado Atual: Modal Único Para Tudo

```html
<!-- Mesmo formulário para TODOS os tipos de item -->
<div>
  <label>Título da Oferta</label>
  <input name="title" placeholder="Ex: Aço de Alta Qualidade">
</div>

<div>
  <label>Descrição</label>
  <textarea name="description" rows="3"
    placeholder="Descreva o item, qualidade, condições especiais...">
  </textarea>
</div>

<div>
  <label>Quantidade</label>
  <input type="number" name="quantity">
</div>

<div>
  <label>Unidade</label>
  <select name="unit">
    <option value="toneladas">Toneladas</option>
    <option value="unidades">Unidades</option>
    <option value="barris">Barris</option>
    <!-- ... -->
  </select>
</div>
```

#### Problemas Identificados

1. **Título**: Para recursos, deveria ser auto-gerado
   - ❌ Atual: Usuário digita manualmente "Venda de Metais"
   - ✅ Ideal: Auto-gerado "Metais - 50.000 toneladas"

2. **Descrição**: Irrelevante para recursos commodity
   - ❌ Atual: Campo obrigatório, usuário não sabe o que escrever
   - ✅ Ideal: Opcional ou removido para recursos

3. **Unidade**: Deve ser automática baseada no recurso
   - ❌ Atual: Dropdown manual, usuário pode selecionar "barris" para "carvão"
   - ✅ Ideal: Detectado automaticamente (Carvão → toneladas, Petróleo → barris)

4. **Validação de Quantidade**: Sem feedback visual
   - ❌ Atual: Só valida no submit
   - ✅ Ideal: Mostra "Disponível: 50.000 | Você quer vender: 20.000 ✅"

---

### 3. Fluxo de Dados Atual

```
┌─────────────┐
│  Dashboard  │ Calcula excedente (produção - consumo)
└──────┬──────┘
       │
       │ Usuário clica "Criar Oferta"
       ↓
┌──────────────────┐
│  Modal Genérico  │ Formulário único para tudo
└────────┬─────────┘
         │
         │ Submete com item_id: "carvao"
         ↓
┌────────────────────────┐
│  MarketplaceSystem     │ Busca "carvao" no resourceMap
│                        │ ❌ NÃO ENCONTRA!
│  validateResourceAvail │ Lança erro
└────────────────────────┘
```

---

## 🎨 Nova Arquitetura Proposta

### 1. Sistema de Mapeamento Unificado

**Arquivo:** `js/data/resourceMapping.js` (NOVO)

```javascript
/**
 * Mapeamento centralizado entre recursos do jogo e tipos de mercado
 *
 * Estrutura:
 * - gameResourceId: Nome interno do recurso (dashboard)
 * - marketTypes: Tipos que podem ser vendidos no marketplace
 * - displayName: Nome amigável para o usuário
 * - unit: Unidade de medida
 * - description: Descrição para ajuda contextual
 */

export const RESOURCE_MAPPING = {
  // Metais
  Metais: {
    gameResourceId: 'metais',
    displayName: 'Metais',
    description: 'Matéria-prima para construção e indústria',
    defaultUnit: 'toneladas',
    marketTypes: [
      {
        id: 'steel_high_grade',
        name: 'Aço de Alta Qualidade',
        description: 'Aço especializado para construção naval e blindagem',
        basePrice: 850,  // USD por tonelada
        qualityMultiplier: 1.5
      },
      {
        id: 'steel_standard',
        name: 'Aço Padrão',
        description: 'Aço comum para construção civil e industrial',
        basePrice: 500,
        qualityMultiplier: 1.0
      },
      {
        id: 'aluminum',
        name: 'Alumínio',
        description: 'Metal leve para aviação e eletrônicos',
        basePrice: 2500,
        qualityMultiplier: 2.0
      },
      {
        id: 'copper',
        name: 'Cobre',
        description: 'Metal para condutores elétricos e eletrônicos',
        basePrice: 8000,
        qualityMultiplier: 1.8
      },
      {
        id: 'rare_metals',
        name: 'Metais Raros',
        description: 'Metais estratégicos para alta tecnologia',
        basePrice: 50000,
        qualityMultiplier: 5.0
      }
    ]
  },

  // Combustível
  Combustivel: {
    gameResourceId: 'combustivel',
    displayName: 'Combustível',
    description: 'Petróleo e derivados para energia e transporte',
    defaultUnit: 'barris',
    marketTypes: [
      {
        id: 'oil_crude',
        name: 'Petróleo Bruto',
        description: 'Petróleo não refinado',
        basePrice: 80,  // USD por barril
        qualityMultiplier: 1.0
      },
      {
        id: 'oil_aviation',
        name: 'Combustível de Aviação',
        description: 'Combustível refinado de alta octanagem',
        basePrice: 120,
        qualityMultiplier: 1.5
      }
    ]
  },

  // Carvão
  Carvao: {
    gameResourceId: 'carvao',
    displayName: 'Carvão',
    description: 'Combustível fóssil para geração de energia',
    defaultUnit: 'toneladas',
    marketTypes: [
      {
        id: 'coal',
        name: 'Carvão',
        description: 'Carvão mineral para usinas termelétricas',
        basePrice: 100,
        qualityMultiplier: 1.0
      }
    ]
  },

  // Grãos
  Graos: {
    gameResourceId: 'graos',
    displayName: 'Alimentos',
    description: 'Produtos agrícolas e alimentos processados',
    defaultUnit: 'toneladas',
    marketTypes: [
      {
        id: 'food',
        name: 'Alimentos',
        description: 'Grãos, carnes e produtos alimentícios',
        basePrice: 300,
        qualityMultiplier: 1.0
      }
    ]
  }
};

/**
 * Função helper: Converter gameResourceId para marketType padrão
 */
export function getDefaultMarketType(gameResourceId) {
  const resource = Object.values(RESOURCE_MAPPING).find(
    r => r.gameResourceId === gameResourceId
  );

  return resource?.marketTypes[0]?.id || null;
}

/**
 * Função helper: Obter configuração completa de um marketType
 */
export function getMarketTypeConfig(marketTypeId) {
  for (const resource of Object.values(RESOURCE_MAPPING)) {
    const marketType = resource.marketTypes.find(mt => mt.id === marketTypeId);
    if (marketType) {
      return {
        ...marketType,
        gameResourceId: resource.gameResourceId,
        defaultUnit: resource.defaultUnit
      };
    }
  }
  return null;
}

/**
 * Função helper: Validar se marketType é compatível com gameResource
 */
export function isCompatibleMarketType(gameResourceId, marketTypeId) {
  const resource = Object.values(RESOURCE_MAPPING).find(
    r => r.gameResourceId === gameResourceId
  );

  return resource?.marketTypes.some(mt => mt.id === marketTypeId) || false;
}

/**
 * Função helper: Obter preço sugerido baseado em oferta/demanda
 */
export function getSuggestedPrice(marketTypeId, availableQuantity) {
  const config = getMarketTypeConfig(marketTypeId);
  if (!config) return null;

  // Ajustar preço baseado em escassez
  // Menos disponível = mais caro
  const scarcityFactor = availableQuantity < 10000 ? 1.3 :
                         availableQuantity < 50000 ? 1.1 :
                         availableQuantity > 200000 ? 0.9 : 1.0;

  return {
    min: Math.round(config.basePrice * 0.7 * scarcityFactor),
    suggested: Math.round(config.basePrice * scarcityFactor),
    max: Math.round(config.basePrice * 1.5 * scarcityFactor),
    unit: config.defaultUnit
  };
}
```

---

### 2. Modal Adaptativo por Tipo de Item

#### 2.1. Componente Base: `OfferModalManager`

**Arquivo:** `js/components/offerModalManager.js` (NOVO)

```javascript
/**
 * Gerenciador de Modais de Oferta
 *
 * Responsável por:
 * - Renderizar modal correto baseado no tipo de oferta
 * - Coordenar validação em tempo real
 * - Submeter dados formatados corretamente
 */

import { RESOURCE_MAPPING, getDefaultMarketType, getSuggestedPrice } from '../data/resourceMapping.js';

export class OfferModalManager {
  constructor(marketplaceSystem) {
    this.marketplaceSystem = marketplaceSystem;
    this.currentModal = null;
    this.currentOfferType = null; // 'sell' ou 'buy'
    this.currentCategory = null;  // 'resources', 'vehicles', 'naval'
  }

  /**
   * Abrir modal de criação de oferta
   */
  async openCreateOfferModal(offerType, category = null, itemData = null) {
    this.currentOfferType = offerType;
    this.currentCategory = category;

    // Renderizar modal baseado no tipo
    if (offerType === 'sell' && category === 'resources') {
      this.currentModal = await this.renderResourceSellModal(itemData);
    } else if (offerType === 'sell' && (category === 'vehicles' || category === 'naval')) {
      this.currentModal = await this.renderEquipmentSellModal(category, itemData);
    } else if (offerType === 'buy') {
      this.currentModal = await this.renderBuyModal(category);
    } else {
      // Fallback: modal genérico de seleção
      this.currentModal = await this.renderSelectionModal();
    }

    document.body.appendChild(this.currentModal);
    this.setupEventListeners();
  }

  /**
   * Modal específico para VENDA DE RECURSOS
   */
  async renderResourceSellModal(resourceData) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.id = 'resource-sell-modal';

    // Obter recursos disponíveis
    const availableResources = await this.getAvailableResources();

    modal.innerHTML = `
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        <!-- Header -->
        <div class="p-6 border-b border-bg-ring/50 bg-gradient-to-r from-brand-500/10 to-brand-600/10">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="text-3xl">🔥</span>
                Vender Recursos
              </h2>
              <p class="text-slate-400 mt-1 text-sm">
                Venda seus recursos excedentes no mercado internacional
              </p>
            </div>
            <button data-action="close" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form id="resource-sell-form" class="p-6 space-y-6">

          <!-- Seleção de Recurso -->
          <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
            <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
              📦 Recurso para Vender
            </label>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${availableResources.map(resource => `
                <label class="relative flex items-center p-4 border-2 border-bg-ring rounded-lg cursor-pointer
                              hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
                  <input type="radio" name="resource" value="${resource.gameResourceId}"
                         data-market-type="${resource.defaultMarketType}"
                         data-unit="${resource.unit}"
                         data-available="${resource.available}"
                         class="peer sr-only" required>

                  <!-- Checkbox visual -->
                  <div class="w-5 h-5 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center
                              peer-checked:border-brand-400 peer-checked:bg-brand-400">
                    <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L4.5 8.5L2 6"/>
                    </svg>
                  </div>

                  <!-- Info do recurso -->
                  <div class="flex-1">
                    <div class="font-medium text-white">${resource.displayName}</div>
                    <div class="text-xs text-slate-400 mt-0.5">
                      Disponível: <span class="text-brand-300 font-semibold">
                        ${resource.available.toLocaleString()} ${resource.unit}
                      </span>
                    </div>
                  </div>

                  <!-- Badge de disponibilidade -->
                  <div class="absolute top-2 right-2">
                    ${resource.available > 100000
                      ? '<span class="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">Alto estoque</span>'
                      : resource.available > 10000
                      ? '<span class="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Estoque médio</span>'
                      : '<span class="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full">Estoque baixo</span>'
                    }
                  </div>
                </label>
              `).join('')}
            </div>

            ${availableResources.length === 0 ? `
              <div class="text-center py-8 text-slate-400">
                <div class="text-5xl mb-3">📭</div>
                <p class="font-medium">Nenhum recurso disponível para venda</p>
                <p class="text-sm mt-1">Você não possui recursos excedentes no momento</p>
              </div>
            ` : ''}
          </div>

          <!-- Tipo de Produto (apenas se recurso tiver múltiplos tipos) -->
          <div id="product-type-section" class="hidden bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
            <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
              🏭 Tipo de Produto
            </label>
            <div id="product-type-options" class="space-y-2">
              <!-- Populado dinamicamente quando recurso for selecionado -->
            </div>
            <p class="text-xs text-slate-400 mt-2">
              💡 Produtos de maior qualidade têm preços mais altos no mercado
            </p>
          </div>

          <!-- Quantidade e Preço -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <!-- Quantidade -->
            <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
              <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                📊 Quantidade
              </label>

              <div class="relative">
                <input type="number" name="quantity" id="quantity-input"
                       min="1" step="1" placeholder="0" required
                       class="w-full px-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
                              focus:border-brand-400 focus:outline-none transition-colors">
                <div id="quantity-unit" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  <!-- Unidade -->
                </div>
              </div>

              <!-- Barra de progresso visual -->
              <div class="mt-3">
                <div class="flex justify-between text-xs text-slate-400 mb-1">
                  <span>0</span>
                  <span id="max-quantity-label">Máximo disponível</span>
                </div>
                <div class="h-2 bg-bg-ring rounded-full overflow-hidden">
                  <div id="quantity-progress" class="h-full bg-gradient-to-r from-brand-400 to-brand-500
                                                      transition-all duration-300" style="width: 0%"></div>
                </div>
              </div>

              <!-- Feedback de validação -->
              <div id="quantity-feedback" class="mt-2 text-sm hidden">
                <!-- Mensagens dinâmicas -->
              </div>

              <!-- Sugestões rápidas -->
              <div class="mt-3 flex flex-wrap gap-2">
                <button type="button" data-quantity-preset="25"
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
                  25%
                </button>
                <button type="button" data-quantity-preset="50"
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
                  50%
                </button>
                <button type="button" data-quantity-preset="75"
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
                  75%
                </button>
                <button type="button" data-quantity-preset="100"
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
                  Tudo
                </button>
              </div>
            </div>

            <!-- Preço -->
            <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
              <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                💰 Preço por Unidade (USD)
              </label>

              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                <input type="number" name="price_per_unit" id="price-input"
                       min="0.01" step="0.01" placeholder="0.00" required
                       class="w-full pl-8 pr-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
                              focus:border-brand-400 focus:outline-none transition-colors">
              </div>

              <!-- Sugestão de preço -->
              <div id="price-suggestion" class="mt-3 bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 hidden">
                <div class="flex items-start gap-2">
                  <span class="text-blue-400">💡</span>
                  <div class="flex-1">
                    <div class="text-xs font-semibold text-blue-300 mb-1">Preço Sugerido</div>
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-slate-400">Faixa:</span>
                      <span class="text-white font-mono" id="price-range">$0 - $0</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sugestões rápidas de preço -->
              <div class="mt-3 flex flex-wrap gap-2">
                <button type="button" data-price-preset="low"
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
                  Baixo
                </button>
                <button type="button" data-price-preset="market"
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
                  Mercado
                </button>
                <button type="button" data-price-preset="high"
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
                  Alto
                </button>
              </div>
            </div>
          </div>

          <!-- Resumo da Transação -->
          <div id="transaction-summary" class="bg-gradient-to-br from-brand-500/10 to-brand-600/10
                                                border-2 border-brand-400/30 rounded-lg p-5">
            <h3 class="text-brand-300 font-bold mb-3 flex items-center gap-2">
              <span>📊</span>
              Resumo da Oferta
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-bg/50 rounded-lg p-3">
                <div class="text-xs text-slate-400 mb-1">Valor Total</div>
                <div id="total-value" class="text-2xl font-bold text-white">$0</div>
              </div>

              <div class="bg-bg/50 rounded-lg p-3">
                <div class="text-xs text-slate-400 mb-1">Valor por Unidade</div>
                <div id="unit-value" class="text-xl font-semibold text-white">$0</div>
              </div>

              <div class="bg-bg/50 rounded-lg p-3">
                <div class="text-xs text-slate-400 mb-1">Quantidade</div>
                <div id="summary-quantity" class="text-xl font-semibold text-white">0</div>
              </div>
            </div>

            <!-- Estimativa de lucro -->
            <div class="mt-4 pt-4 border-t border-brand-400/20">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-300">Comparado ao preço de mercado:</span>
                <span id="profit-estimate" class="font-semibold">-</span>
              </div>
            </div>
          </div>

          <!-- Configurações Avançadas (Colapsável) -->
          <details class="bg-bg/30 rounded-lg border border-bg-ring/50">
            <summary class="p-4 cursor-pointer hover:bg-bg/50 transition-colors">
              <span class="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                ⚙️ Configurações Avançadas (Opcional)
              </span>
            </summary>

            <div class="p-5 pt-0 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Quantidade Mínima por Pedido
                  </label>
                  <input type="number" name="min_quantity" min="1" placeholder="1"
                         class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                focus:border-brand-400 focus:outline-none">
                  <p class="text-xs text-slate-400 mt-1">
                    Compradores devem comprar pelo menos esta quantidade
                  </p>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Tempo de Entrega (dias)
                  </label>
                  <select name="delivery_time_days"
                          class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                 focus:border-brand-400 focus:outline-none">
                    <option value="15">15 dias (Express)</option>
                    <option value="30" selected>30 dias (Padrão)</option>
                    <option value="45">45 dias</option>
                    <option value="60">60 dias</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Duração da Oferta
                  </label>
                  <select name="duration_days"
                          class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                 focus:border-brand-400 focus:outline-none">
                    <option value="7">7 dias</option>
                    <option value="14" selected>14 dias</option>
                    <option value="21">21 dias</option>
                    <option value="30">30 dias</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Título Personalizado (Opcional)
                  </label>
                  <input type="text" name="custom_title" maxlength="100" placeholder="Auto-gerado"
                         class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                focus:border-brand-400 focus:outline-none">
                  <p class="text-xs text-slate-400 mt-1">
                    Deixe em branco para título automático
                  </p>
                </div>
              </div>
            </div>
          </details>

          <!-- Botões de Ação -->
          <div class="flex items-center gap-3 pt-4">
            <button type="submit" id="submit-offer-btn"
                    class="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              🚀 Criar Oferta
            </button>

            <button type="button" data-action="close"
                    class="px-6 py-3 bg-bg-ring hover:bg-bg text-slate-300 font-semibold rounded-lg
                           transition-colors">
              Cancelar
            </button>
          </div>

        </form>
      </div>
    `;

    return modal;
  }

  /**
   * Obter recursos disponíveis para venda
   */
  async getAvailableResources() {
    const countryData = window.currentCountry;
    if (!countryData) return [];

    const resourceProduction = window.ResourceProductionCalculator.calculateCountryProduction(countryData);
    const resourceConsumption = window.ResourceConsumptionCalculator.calculateCountryConsumption(countryData);

    const resources = [];

    Object.entries(RESOURCE_MAPPING).forEach(([key, config]) => {
      const production = resourceProduction[key] || 0;
      const consumption = resourceConsumption[key] || 0;
      const balance = production - consumption;

      if (balance > 0) {
        resources.push({
          gameResourceId: config.gameResourceId,
          displayName: config.displayName,
          unit: config.defaultUnit,
          available: Math.round(balance),
          defaultMarketType: config.marketTypes[0].id,
          hasMultipleTypes: config.marketTypes.length > 1,
          types: config.marketTypes
        });
      }
    });

    return resources;
  }

  /**
   * Configurar event listeners do modal
   */
  setupEventListeners() {
    if (!this.currentModal) return;

    // Fechar modal
    this.currentModal.querySelectorAll('[data-action="close"]').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal());
    });

    // Seleção de recurso
    this.currentModal.querySelectorAll('input[name="resource"]').forEach(radio => {
      radio.addEventListener('change', (e) => this.onResourceSelected(e.target));
    });

    // Presets de quantidade
    this.currentModal.querySelectorAll('[data-quantity-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = parseInt(e.target.dataset.quantityPreset);
        this.applyQuantityPreset(preset);
      });
    });

    // Presets de preço
    this.currentModal.querySelectorAll('[data-price-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const preset = e.target.dataset.pricePreset;
        this.applyPricePreset(preset);
      });
    });

    // Validação em tempo real
    const quantityInput = this.currentModal.querySelector('#quantity-input');
    const priceInput = this.currentModal.querySelector('#price-input');

    quantityInput?.addEventListener('input', () => this.validateAndUpdateSummary());
    priceInput?.addEventListener('input', () => this.validateAndUpdateSummary());

    // Submit do formulário
    const form = this.currentModal.querySelector('form');
    form?.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Quando recurso é selecionado
   */
  onResourceSelected(radioElement) {
    const marketType = radioElement.dataset.marketType;
    const unit = radioElement.dataset.unit;
    const available = parseInt(radioElement.dataset.available);

    // Atualizar unidade exibida
    const unitDisplay = this.currentModal.querySelector('#quantity-unit');
    if (unitDisplay) unitDisplay.textContent = unit;

    // Atualizar máximo
    const quantityInput = this.currentModal.querySelector('#quantity-input');
    if (quantityInput) {
      quantityInput.max = available;
      quantityInput.setAttribute('data-available', available);
    }

    // Obter e exibir sugestão de preço
    const priceSuggestion = getSuggestedPrice(marketType, available);
    if (priceSuggestion) {
      const suggestionDiv = this.currentModal.querySelector('#price-suggestion');
      const rangeSpan = this.currentModal.querySelector('#price-range');

      if (suggestionDiv && rangeSpan) {
        suggestionDiv.classList.remove('hidden');
        rangeSpan.textContent = `$${priceSuggestion.min} - $${priceSuggestion.max}`;

        // Armazenar para usar nos presets
        this.currentModal.setAttribute('data-price-low', priceSuggestion.min);
        this.currentModal.setAttribute('data-price-market', priceSuggestion.suggested);
        this.currentModal.setAttribute('data-price-high', priceSuggestion.max);
      }

      // Preencher automaticamente com preço sugerido
      const priceInput = this.currentModal.querySelector('#price-input');
      if (priceInput && !priceInput.value) {
        priceInput.value = priceSuggestion.suggested;
      }
    }

    this.validateAndUpdateSummary();
  }

  /**
   * Aplicar preset de quantidade
   */
  applyQuantityPreset(percentage) {
    const quantityInput = this.currentModal.querySelector('#quantity-input');
    const available = parseInt(quantityInput.getAttribute('data-available') || 0);

    const quantity = Math.floor(available * (percentage / 100));
    quantityInput.value = quantity;

    this.validateAndUpdateSummary();
  }

  /**
   * Aplicar preset de preço
   */
  applyPricePreset(preset) {
    const priceInput = this.currentModal.querySelector('#price-input');
    let price = 0;

    if (preset === 'low') {
      price = this.currentModal.getAttribute('data-price-low');
    } else if (preset === 'market') {
      price = this.currentModal.getAttribute('data-price-market');
    } else if (preset === 'high') {
      price = this.currentModal.getAttribute('data-price-high');
    }

    if (price) {
      priceInput.value = price;
      this.validateAndUpdateSummary();
    }
  }

  /**
   * Validar e atualizar resumo em tempo real
   */
  validateAndUpdateSummary() {
    const quantityInput = this.currentModal.querySelector('#quantity-input');
    const priceInput = this.currentModal.querySelector('#price-input');

    const quantity = parseInt(quantityInput?.value || 0);
    const pricePerUnit = parseFloat(priceInput?.value || 0);
    const available = parseInt(quantityInput?.getAttribute('data-available') || 0);

    // Validar quantidade
    const feedbackDiv = this.currentModal.querySelector('#quantity-feedback');
    const progressBar = this.currentModal.querySelector('#quantity-progress');

    if (quantity > 0) {
      const percentage = Math.min((quantity / available) * 100, 100);
      progressBar.style.width = `${percentage}%`;

      if (quantity > available) {
        feedbackDiv.className = 'mt-2 text-sm text-red-400';
        feedbackDiv.textContent = `❌ Quantidade excede o disponível (${available.toLocaleString()})`;
        feedbackDiv.classList.remove('hidden');
      } else {
        feedbackDiv.className = 'mt-2 text-sm text-green-400';
        feedbackDiv.textContent = `✅ Válido (${((quantity/available)*100).toFixed(1)}% do estoque)`;
        feedbackDiv.classList.remove('hidden');
      }
    } else {
      progressBar.style.width = '0%';
      feedbackDiv.classList.add('hidden');
    }

    // Atualizar resumo
    const totalValue = quantity * pricePerUnit;

    this.currentModal.querySelector('#total-value').textContent = `$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    this.currentModal.querySelector('#unit-value').textContent = `$${pricePerUnit.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
    this.currentModal.querySelector('#summary-quantity').textContent = quantity.toLocaleString();

    // Comparar com preço de mercado
    const marketPrice = parseFloat(this.currentModal.getAttribute('data-price-market') || 0);
    const profitEstimate = this.currentModal.querySelector('#profit-estimate');

    if (marketPrice > 0 && pricePerUnit > 0) {
      const diff = ((pricePerUnit - marketPrice) / marketPrice) * 100;

      if (diff > 5) {
        profitEstimate.className = 'font-semibold text-green-400';
        profitEstimate.textContent = `+${diff.toFixed(1)}% acima do mercado`;
      } else if (diff < -5) {
        profitEstimate.className = 'font-semibold text-red-400';
        profitEstimate.textContent = `${diff.toFixed(1)}% abaixo do mercado`;
      } else {
        profitEstimate.className = 'font-semibold text-yellow-400';
        profitEstimate.textContent = `≈ Preço de mercado`;
      }
    }
  }

  /**
   * Submeter formulário
   */
  async handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = this.currentModal.querySelector('#submit-offer-btn');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Criando oferta...';

      const formData = new FormData(form);

      // Obter dados do recurso selecionado
      const selectedResource = form.querySelector('input[name="resource"]:checked');
      const marketType = selectedResource.dataset.marketType;
      const unit = selectedResource.dataset.unit;

      // Montar objeto de oferta
      const offerData = {
        type: 'sell',
        category: 'resources',
        item_id: marketType,  // ✅ AGORA USA O ID CORRETO!
        item_name: selectedResource.parentElement.querySelector('.font-medium').textContent,
        quantity: parseInt(formData.get('quantity')),
        unit: unit,
        price_per_unit: parseFloat(formData.get('price_per_unit')),
        min_quantity: parseInt(formData.get('min_quantity')) || 1,
        delivery_time_days: parseInt(formData.get('delivery_time_days')) || 30,
        duration_days: parseInt(formData.get('duration_days')) || 14,
        title: formData.get('custom_title') || null  // Auto-gera se vazio
      };

      // Auto-gerar título se não fornecido
      if (!offerData.title) {
        offerData.title = `${offerData.item_name} - ${offerData.quantity.toLocaleString()} ${unit}`;
      }

      console.log('📤 Enviando oferta:', offerData);

      // Criar oferta
      const result = await this.marketplaceSystem.createOffer(offerData);

      if (result.success) {
        submitBtn.textContent = '✅ Oferta criada!';
        submitBtn.classList.add('bg-green-600');

        setTimeout(() => {
          this.closeModal();
          window.location.reload(); // Ou atualizar lista de ofertas
        }, 1500);
      } else {
        throw new Error(result.error || 'Erro desconhecido');
      }

    } catch (error) {
      console.error('❌ Erro ao criar oferta:', error);

      submitBtn.textContent = '❌ Erro';
      submitBtn.classList.add('bg-red-600');

      alert(`Erro ao criar oferta: ${error.message}`);

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('bg-red-600');
        submitBtn.disabled = false;
      }, 3000);
    }
  }

  /**
   * Fechar modal
   */
  closeModal() {
    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
    }
  }
}
```

---

### 3. Atualização do MarketplaceSystem

**Mudanças em** `marketplaceSystem.js`:

```javascript
// ANTES (linha 998-1029)
validateResourceAvailability(offerData, countryData) {
  const availableResources = this.calculateAvailableResources(countryData);

  const resourceMap = {
    'steel_high_grade': 'Metais',
    'steel_standard': 'Metais',
    // ...
  };

  const resourceType = resourceMap[offerData.item_id];
  if (!resourceType) {
    throw new Error('Tipo de recurso não reconhecido');  // ❌ ERRO
  }

  // ...
}

// DEPOIS (NOVO)
import { getMarketTypeConfig, isCompatibleMarketType } from './data/resourceMapping.js';

validateResourceAvailability(offerData, countryData) {
  // Obter configuração do tipo de mercado
  const marketConfig = getMarketTypeConfig(offerData.item_id);

  if (!marketConfig) {
    throw new Error(`Tipo de recurso não reconhecido: ${offerData.item_id}`);
  }

  // Calcular recursos disponíveis
  const resourceProduction = window.ResourceProductionCalculator.calculateCountryProduction(countryData);
  const resourceConsumption = window.ResourceConsumptionCalculator.calculateCountryConsumption(countryData);

  // Usar o gameResourceId do mapping para buscar o recurso certo
  const resourceKey = Object.keys(RESOURCE_MAPPING).find(key =>
    RESOURCE_MAPPING[key].gameResourceId === marketConfig.gameResourceId
  );

  if (!resourceKey) {
    throw new Error(`Recurso ${marketConfig.gameResourceId} não encontrado`);
  }

  const production = resourceProduction[resourceKey] || 0;
  const consumption = resourceConsumption[resourceKey] || 0;
  const available = Math.max(0, production - consumption);

  if (offerData.quantity > available) {
    throw new Error(
      `Quantidade insuficiente. Disponível: ${available.toLocaleString()} ${marketConfig.defaultUnit}`
    );
  }

  return {
    valid: true,
    available: available,
    resourceType: marketConfig.gameResourceId,
    marketType: offerData.item_id
  };
}
```

---

## 📐 Arquitetura de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                      DASHBOARD                              │
│  - Exibe recursos (produção vs consumo)                    │
│  - Botão "Vender Recursos" → abre modal                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Clique em "Vender"
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              OfferModalManager                              │
│  - Detecta tipo de oferta (sell/buy)                       │
│  - Detecta categoria (resources/vehicles/naval)            │
│  - Renderiza modal específico                              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ↓            ↓            ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Resource     │ │ Equipment    │ │ Buy          │
│ Sell Modal   │ │ Sell Modal   │ │ Modal        │
│              │ │              │ │              │
│ - Lista      │ │ - Lista      │ │ - Busca      │
│   excedentes │ │   inventory  │ │   todos      │
│ - Valida     │ │ - Mostra     │ │   tipos      │
│   quantidade │ │   stats      │ │ - Orçamento  │
│ - Sugere     │ │ - Custos     │ │   check      │
│   preço      │ │   manutenção │ │              │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       │                │                │
       └────────────────┼────────────────┘
                        │ Submit
                        ↓
        ┌───────────────────────────────┐
        │     MarketplaceSystem         │
        │                               │
        │  validateOfferData()          │
        │    ↓                          │
        │  validateResourceAvailability │
        │    ↓                          │
        │  Usa RESOURCE_MAPPING         │
        │    ↓                          │
        │  createOffer()                │
        │    ↓                          │
        │  Salva no Firestore           │
        └───────────────┬───────────────┘
                        │
                        ↓
              ┌──────────────────┐
              │   Firebase       │
              │ marketplace_     │
              │ offers           │
              └──────────────────┘
```

---

## 🎯 Fluxo de Usuário Passo-a-Passo

### Cenário 1: Vender Recursos Excedentes

```
1. Usuário acessa Dashboard
   └─ Vê que tem 50.000 toneladas de Metais excedentes

2. Clica em "💰 Mercado Internacional"
   └─ Abre tela do marketplace

3. Clica em "🔥 Vender Recursos"
   └─ Modal específico de recursos aparece

4. Seleciona "Metais" (mostra 50.000 ton disponíveis)
   └─ Sistema mostra subtipos:
      • Aço de Alta Qualidade ($850/ton)
      • Aço Padrão ($500/ton)
      • Alumínio ($2.500/ton)
      • Cobre ($8.000/ton)

5. Seleciona "Aço Padrão"
   └─ Sistema sugere preço: $500/ton (faixa: $350-$750)
   └─ Campo de quantidade ativado (máx: 50.000)

6. Digita quantidade: 20.000
   └─ Barra de progresso mostra 40% do estoque
   └─ Resumo atualiza: "Valor Total: $10.000.000"
   └─ Feedback: "✅ Válido (40% do estoque)"

7. Ajusta preço para $550
   └─ Resumo atualiza: "Valor Total: $11.000.000"
   └─ Comparação: "+10% acima do preço de mercado"

8. Clica em "🚀 Criar Oferta"
   └─ Sistema valida:
      ✅ Quantidade <= disponível
      ✅ Preço > 0
      ✅ Recurso mapeado corretamente

9. Oferta criada com sucesso!
   └─ Título auto-gerado: "Aço Padrão - 20.000 toneladas"
   └─ Aparece no marketplace internacional
   └─ Outros países podem comprar
```

---

## 🔧 Plano de Implementação

### Fase 1: Fundação (Correção de Bugs)
**Prioridade:** 🔴 CRÍTICA
**Tempo estimado:** 4-6 horas

1. **Criar `resourceMapping.js`**
   - [ ] Definir `RESOURCE_MAPPING` completo
   - [ ] Implementar funções helper (getDefaultMarketType, etc)
   - [ ] Adicionar preços base e multiplicadores
   - [ ] Documentar estrutura de dados

2. **Atualizar `marketplaceSystem.js`**
   - [ ] Importar funções de mapping
   - [ ] Refatorar `validateResourceAvailability()`
   - [ ] Usar cálculo unificado de excedentes
   - [ ] Adicionar logs detalhados para debug

3. **Testar correção**
   - [ ] Criar oferta de Metais
   - [ ] Criar oferta de Combustível
   - [ ] Criar oferta de Carvão
   - [ ] Verificar que não há erro "Tipo de recurso não reconhecido"

---

### Fase 2: Modal de Recursos (UX)
**Prioridade:** 🟠 ALTA
**Tempo estimado:** 8-10 horas

4. **Criar `offerModalManager.js`**
   - [ ] Estrutura base da classe
   - [ ] Método `renderResourceSellModal()`
   - [ ] Método `getAvailableResources()`
   - [ ] Event listeners base

5. **Implementar funcionalidades interativas**
   - [ ] Seleção de recurso (radio buttons estilizados)
   - [ ] Validação de quantidade em tempo real
   - [ ] Barra de progresso visual
   - [ ] Presets de quantidade (25%, 50%, 75%, 100%)

6. **Implementar sugestão de preços**
   - [ ] Calcular baseado em escassez
   - [ ] Mostrar faixa de preço
   - [ ] Presets de preço (baixo, mercado, alto)
   - [ ] Comparação com preço de mercado

7. **Implementar resumo dinâmico**
   - [ ] Valor total calculado
   - [ ] Valor por unidade
   - [ ] Quantidade formatada
   - [ ] Estimativa de lucro

8. **Integrar com dashboard**
   - [ ] Substituir modal antigo
   - [ ] Adicionar botão "Vender Recursos" no dashboard
   - [ ] Passar dados de recursos disponíveis

---

### Fase 3: Modais de Equipamento e Compra
**Prioridade:** 🟡 MÉDIA
**Tempo estimado:** 10-12 horas

9. **Modal de venda de equipamento**
   - [ ] `renderEquipmentSellModal()`
   - [ ] Listar equipamentos do inventário
   - [ ] Mostrar stats (quantidade, custo, manutenção)
   - [ ] Campo de descrição relevante
   - [ ] Fotos/ícones de equipamento

10. **Modal de compra (recursos)**
    - [ ] `renderBuyModal()` para recursos
    - [ ] Verificação de orçamento
    - [ ] Sugestão de quantidade baseada em déficit
    - [ ] Warning se orçamento insuficiente

11. **Modal de compra (equipamento)**
    - [ ] Listar todos tipos disponíveis
    - [ ] Filtros por categoria
    - [ ] Comparação de specs
    - [ ] Cálculo de impacto no orçamento

---

### Fase 4: Validações e Qualidade
**Prioridade:** 🟢 NORMAL
**Tempo estimado:** 4-6 horas

12. **Validações robustas**
    - [ ] Quantidade: min, max, step
    - [ ] Preço: min (evitar valores negativos)
    - [ ] Orçamento (para compras)
    - [ ] Estoque disponível (para vendas)

13. **Mensagens de erro claras**
    - [ ] "Quantidade insuficiente: você tem X, tentou vender Y"
    - [ ] "Orçamento insuficiente: necessário $X, disponível $Y"
    - [ ] Sugestões de correção

14. **Testes E2E**
    - [ ] Vender recurso com excedente
    - [ ] Tentar vender mais que disponível (deve falhar)
    - [ ] Comprar com orçamento suficiente
    - [ ] Comprar com orçamento insuficiente (deve falhar)
    - [ ] Testar todos os tipos de recurso

---

### Fase 5: Melhorias e Analytics
**Prioridade:** 🔵 BAIXA
**Tempo estimado:** 6-8 horas

15. **Sistema de preços dinâmicos**
    - [ ] Analisar ofertas existentes
    - [ ] Calcular preço médio por tipo
    - [ ] Ajustar sugestões baseado em oferta/demanda
    - [ ] Dashboard de analytics do mercado

16. **Histórico de transações**
    - [ ] Registrar todas vendas/compras
    - [ ] Gráfico de evolução de preços
    - [ ] Estatísticas por recurso
    - [ ] Ranking de traders

17. **Notificações**
    - [ ] Alerta quando oferta expirar
    - [ ] Alerta quando alguém comprar
    - [ ] Sugestão: "Você tem X excedente, quer vender?"

---

## 📊 Métricas de Sucesso

### Objetivos Mensuráveis

1. **Taxa de Erro**:
   - Atual: ~100% (todas tentativas falham)
   - Meta: <1% (apenas erros legítimos)

2. **Tempo para Criar Oferta**:
   - Atual: ~3-5 minutos (usuário confuso)
   - Meta: <1 minuto (fluxo claro)

3. **Validações com Sucesso**:
   - Atual: 0% (erro antes da validação)
   - Meta: >95% (validação real funcional)

4. **Satisfação do Usuário**:
   - Atual: Frustração (sistema quebrado)
   - Meta: Intuitivo e agradável

---

## 🎨 Design System

### Cores

```css
/* Recursos */
--resource-metais: #718096;     /* Cinza metálico */
--resource-combustivel: #2D3748; /* Preto petróleo */
--resource-carvao: #1A202C;     /* Preto carvão */
--resource-graos: #D69E2E;      /* Dourado */

/* Estados */
--success: #48BB78;
--warning: #ED8936;
--error: #F56565;
--info: #4299E1;

/* Feedback */
--high-stock: rgba(72, 187, 120, 0.2);   /* Verde */
--medium-stock: rgba(237, 137, 54, 0.2); /* Laranja */
--low-stock: rgba(245, 101, 101, 0.2);   /* Vermelho */
```

### Tipografia

```css
/* Títulos */
.modal-title: text-2xl font-bold

/* Seções */
.section-label: text-sm font-semibold uppercase tracking-wide

/* Valores */
.value-display: text-lg font-mono

/* Feedback */
.feedback-text: text-sm font-medium
```

---

## 🧪 Casos de Teste

### Teste 1: Venda de Recurso Válido
```
Input:
- Recurso: Metais
- Tipo: Aço Padrão
- Quantidade: 10.000 ton
- Preço: $500/ton
- Disponível: 50.000 ton

Expected:
✅ Oferta criada
✅ Título: "Aço Padrão - 10.000 toneladas"
✅ Total: $5.000.000
```

### Teste 2: Venda Acima do Disponível
```
Input:
- Recurso: Carvão
- Quantidade: 100.000 ton
- Disponível: 50.000 ton

Expected:
❌ Erro antes do submit
❌ Mensagem: "Quantidade excede o disponível (50.000)"
❌ Botão submit desabilitado
```

### Teste 3: Múltiplos Tipos de Metais
```
Input:
- Recurso: Metais
- Disponível: 80.000 ton

Opções mostradas:
✅ Aço de Alta Qualidade ($850)
✅ Aço Padrão ($500)
✅ Alumínio ($2.500)
✅ Cobre ($8.000)
✅ Metais Raros ($50.000)

Usuário seleciona: Alumínio
Expected:
✅ Preço sugerido: $2.500/ton
✅ Unidade: toneladas
✅ item_id no backend: "aluminum"
```

### Teste 4: Validação de Mapeamento
```
Sistema interno:
- resourceProduction.Metais = 100.000
- resourceConsumption.Metais = 30.000
- Excedente = 70.000

Modal envia:
- item_id: "steel_standard"

Backend recebe e valida:
- getMarketTypeConfig("steel_standard")
  → {gameResourceId: "metais", defaultUnit: "toneladas"}
- Busca excedente de "Metais"
- Encontra 70.000 disponível
- ✅ Validação passa
```

---

## 🔒 Segurança e Validações

### Validações Frontend (Antes do Submit)

1. **Quantidade**
   - `quantity > 0`
   - `quantity <= available`
   - `quantity >= min_quantity`
   - `Number.isInteger(quantity)`

2. **Preço**
   - `price_per_unit > 0`
   - `price_per_unit < 1000000` (sanity check)
   - `!isNaN(price_per_unit)`

3. **Seleções**
   - `resourceSelected !== null`
   - `marketTypeSelected !== null`

### Validações Backend (No Submit)

1. **Autenticação**
   - Usuário autenticado
   - País associado ao usuário existe

2. **Autorização**
   - País possui o recurso
   - Quantidade disponível >= quantidade ofertada

3. **Dados**
   - item_id existe no RESOURCE_MAPPING
   - Categoria válida (resources/vehicles/naval)
   - Preços razoáveis (evitar $0.01 ou $999999999)

4. **Rate Limiting**
   - Máximo 10 ofertas por hora por país
   - Evitar spam

---

## 📝 Documentação para Desenvolvedores

### Como Adicionar Novo Tipo de Recurso

```javascript
// 1. Adicionar em resourceMapping.js
export const RESOURCE_MAPPING = {
  // ...
  NovoRecurso: {
    gameResourceId: 'novorecurso',  // Nome no dashboard
    displayName: 'Novo Recurso',
    description: 'Descrição do recurso',
    defaultUnit: 'unidades',
    marketTypes: [
      {
        id: 'novo_recurso_tipo1',  // ID único no marketplace
        name: 'Tipo 1 do Novo Recurso',
        description: 'Descrição detalhada',
        basePrice: 1000,
        qualityMultiplier: 1.0
      }
    ]
  }
};

// 2. Atualizar cálculo de produção (se necessário)
// Em resourceProductionCalculator.js
calculateCountryProduction(countryData) {
  return {
    // ...
    NovoRecurso: this.calculateNovoRecurso(countryData)
  };
}

// 3. Atualizar cálculo de consumo (se necessário)
// Em resourceConsumptionCalculator.js
calculateCountryConsumption(countryData) {
  return {
    // ...
    NovoRecurso: this.calculateNovoRecursoConsumption(countryData)
  };
}

// 4. Adicionar ícone/cor no design system
// Em offerModalManager.js - getResourceIcon()
getResourceIcon(resourceId) {
  const icons = {
    // ...
    'novorecurso': '🆕'  // Emoji ou SVG
  };
  return icons[resourceId] || '📦';
}

// ✅ Pronto! Sistema automaticamente:
// - Mostra no modal de venda (se houver excedente)
// - Valida corretamente
// - Sugere preços
// - Cria oferta no marketplace
```

---

## 🚀 Roadmap Futuro

### Curto Prazo (1-2 semanas)
- ✅ Corrigir erro de validação
- ✅ Implementar modal de recursos
- ✅ Validação em tempo real
- ⏳ Testes E2E

### Médio Prazo (1-2 meses)
- 📋 Modais de equipamento
- 📋 Sistema de compra
- 📋 Analytics de mercado
- 📋 Notificações

### Longo Prazo (3-6 meses)
- 🔮 Contratos de longo prazo
- 🔮 Leilões reversos
- 🔮 Mercado de futuros
- 🔮 Acordos comerciais bilaterais
- 🔮 Tarifas e impostos de importação
- 🔮 Sistema de reputação de traders

---

## 📞 Suporte e Manutenção

### Logs de Debug

```javascript
// Ativar logs detalhados
localStorage.setItem('marketplace_debug', 'true');

// Desativar
localStorage.removeItem('marketplace_debug');

// Logs incluem:
// - Recursos disponíveis calculados
// - Mapeamento de IDs (game → market)
// - Validações executadas
// - Requests ao Firestore
// - Erros com stack trace completo
```

### Troubleshooting Comum

**Problema:** "Tipo de recurso não reconhecido"
**Causa:** Mapeamento incorreto entre gameResourceId e marketTypeId
**Solução:** Verificar `RESOURCE_MAPPING` e garantir que item_id enviado existe

**Problema:** "Quantidade insuficiente" mesmo tendo recursos
**Causa:** Cálculo de excedente errado
**Solução:** Verificar `ResourceProductionCalculator` e `ResourceConsumptionCalculator`

**Problema:** Modal não abre
**Causa:** `window.currentCountry` não definido
**Solução:** Garantir que dashboard carrega dados do país antes

---

## ✅ Checklist de Implementação

### Fase 1: Correção de Bugs ✅
- [ ] Criar `resourceMapping.js` com RESOURCE_MAPPING completo
- [ ] Atualizar `marketplaceSystem.js` - validateResourceAvailability()
- [ ] Testar venda de Metais
- [ ] Testar venda de Combustível
- [ ] Testar venda de Carvão
- [ ] Testar venda de Grãos
- [ ] Verificar que não há erro de validação

### Fase 2: Modal de Recursos 🔄
- [ ] Criar `offerModalManager.js`
- [ ] Implementar renderResourceSellModal()
- [ ] Implementar getAvailableResources()
- [ ] Adicionar seleção de recurso (radio buttons)
- [ ] Adicionar validação de quantidade em tempo real
- [ ] Adicionar barra de progresso
- [ ] Adicionar presets de quantidade
- [ ] Implementar sugestão de preços
- [ ] Implementar presets de preço
- [ ] Implementar resumo dinâmico
- [ ] Integrar com dashboard
- [ ] Testar fluxo completo

### Fase 3: Outros Modais ⏸️
- [ ] Modal de venda de equipamento
- [ ] Modal de compra de recursos
- [ ] Modal de compra de equipamento

### Fase 4: Validações ⏸️
- [ ] Validações frontend robustas
- [ ] Mensagens de erro claras
- [ ] Testes E2E

### Fase 5: Melhorias ⏸️
- [ ] Preços dinâmicos
- [ ] Histórico de transações
- [ ] Notificações
- [ ] Analytics

---

## 📄 Conclusão

Este PRD detalha uma refatoração completa do sistema de marketplace, focando em:

1. **Correção do bug crítico** de mapeamento de recursos
2. **Melhoria massiva da UX** com modais adaptativos
3. **Validação em tempo real** para prevenir erros
4. **Arquitetura escalável** para futuras expansões

O sistema proposto é:
- ✅ **Funcional** - Corrige todos os bugs atuais
- ✅ **Intuitivo** - UX clara e responsiva
- ✅ **Robusto** - Validações em múltiplas camadas
- ✅ **Escalável** - Fácil adicionar novos recursos/equipamentos
- ✅ **Manutenível** - Código bem documentado e organizado

**Tempo total estimado:** 32-42 horas de desenvolvimento

**Prioridade de implementação:** Fase 1 → Fase 2 → Fase 4 → Fase 3 → Fase 5
