// js/components/offerModalManager.js - Gerenciador de Modais de Oferta

import { RESOURCE_MAPPING, getDefaultMarketType, getSuggestedPrice, getMarketTypeConfig } from '../data/resourceMapping.js';

/**
 * Gerenciador de Modais de Oferta
 *
 * Responsável por:
 * - Renderizar modal correto baseado no tipo de oferta
 * - Coordenar validação em tempo real
 * - Submeter dados formatados corretamente
 */
export class OfferModalManager {
  constructor(marketplaceSystem) {
    this.marketplaceSystem = marketplaceSystem;
    this.currentModal = null;
    this.currentOfferType = null;
    this.currentCategory = null;
    this.selectedResource = null;
    this.selectedMarketType = null;
  }

  /**
   * Abrir modal de criação de oferta de VENDA DE RECURSOS
   */
  async openResourceSellModal() {
    this.currentOfferType = 'sell';
    this.currentCategory = 'resources';

    this.currentModal = await this.renderResourceSellModal();
    document.body.appendChild(this.currentModal);
    this.setupEventListeners();
  }

  /**
   * Modal específico para VENDA DE RECURSOS
   */
  async renderResourceSellModal() {
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

            ${availableResources.length > 0 ? `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${availableResources.map(resource => `
                  <label class="relative flex items-center p-4 border-2 border-bg-ring rounded-lg cursor-pointer
                                hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
                    <input type="radio" name="resource" value="${resource.gameResourceId}"
                           data-market-type="${resource.defaultMarketType}"
                           data-unit="${resource.unit}"
                           data-available="${resource.available}"
                           data-has-multiple="${resource.hasMultipleTypes}"
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
                        Excedente: <span class="text-brand-300 font-semibold">
                          ${resource.available.toLocaleString()} ${resource.unit}
                        </span>
                      </div>
                    </div>

                    <!-- Badge de disponibilidade -->
                    <div class="absolute top-2 right-2">
                      ${resource.available > 100000
                        ? '<span class="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full font-semibold">Alto</span>'
                        : resource.available > 10000
                        ? '<span class="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full font-semibold">Médio</span>'
                        : '<span class="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full font-semibold">Baixo</span>'
                      }
                    </div>
                  </label>
                `).join('')}
              </div>
            ` : `
              <div class="text-center py-8 text-slate-400">
                <div class="text-5xl mb-3">📭</div>
                <p class="font-medium">Nenhum recurso disponível para venda</p>
                <p class="text-sm mt-1">Você não possui recursos excedentes no momento</p>
              </div>
            `}
          </div>

          <!-- Tipo de Produto (apenas se recurso tiver múltiplos tipos) -->
          <div id="product-type-section" class="hidden bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
            <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
              🏭 Tipo de Produto
            </label>
            <div id="product-type-options" class="space-y-2">
              <!-- Populado dinamicamente quando recurso for selecionado -->
            </div>
            <p class="text-xs text-slate-400 mt-3">
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
                       min="1" step="1" placeholder="0" required disabled
                       class="w-full px-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
                              focus:border-brand-400 focus:outline-none transition-colors disabled:opacity-50">
                <div id="quantity-unit" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  <!-- Unidade -->
                </div>
              </div>

              <!-- Barra de progresso visual -->
              <div class="mt-3">
                <div class="flex justify-between text-xs text-slate-400 mb-1">
                  <span>0</span>
                  <span id="max-quantity-label">Selecione um recurso</span>
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
                <button type="button" data-quantity-preset="25" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  25%
                </button>
                <button type="button" data-quantity-preset="50" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  50%
                </button>
                <button type="button" data-quantity-preset="75" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  75%
                </button>
                <button type="button" data-quantity-preset="100" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                       min="0.01" step="0.01" placeholder="0.00" required disabled
                       class="w-full pl-8 pr-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
                              focus:border-brand-400 focus:outline-none transition-colors disabled:opacity-50">
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
                <button type="button" data-price-preset="low" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Baixo
                </button>
                <button type="button" data-price-preset="market" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Mercado
                </button>
                <button type="button" data-price-preset="high" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Alto
                </button>
              </div>
            </div>
          </div>

          <!-- Resumo da Transação -->
          <div id="transaction-summary" class="bg-gradient-to-br from-brand-500/10 to-brand-600/10
                                                border-2 border-brand-400/30 rounded-lg p-5 hidden">
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
                <span id="profit-estimate" class="font-semibold text-slate-400">-</span>
              </div>
            </div>
          </div>

          <!-- Tipo de Ordem -->
          <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
            <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
              🔄 Tipo de Ordem
            </label>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="relative flex items-start p-4 border-2 border-bg-ring rounded-lg cursor-pointer
                            hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
                <input type="radio" name="order_type" value="one_time" class="peer sr-only" checked>

                <div class="w-5 h-5 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center mt-0.5
                            peer-checked:border-brand-400 peer-checked:bg-brand-400">
                  <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6"/>
                  </svg>
                </div>

                <div>
                  <div class="font-medium text-white">Venda Única</div>
                  <div class="text-xs text-slate-400 mt-1">
                    Oferta fica disponível até alguém comprar completamente
                  </div>
                </div>
              </label>

              <label class="relative flex items-start p-4 border-2 border-bg-ring rounded-lg cursor-pointer
                            hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
                <input type="radio" name="order_type" value="recurring" class="peer sr-only">

                <div class="w-5 h-5 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center mt-0.5
                            peer-checked:border-brand-400 peer-checked:bg-brand-400">
                  <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6"/>
                  </svg>
                </div>

                <div>
                  <div class="font-medium text-white flex items-center gap-2">
                    Ordem Recorrente
                    <span class="text-xs px-2 py-0.5 bg-brand-500/20 text-brand-300 rounded-full">Automático</span>
                  </div>
                  <div class="text-xs text-slate-400 mt-1">
                    Vende automaticamente a cada turno até você cancelar
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Configurações de Ordem Recorrente (aparece apenas se selecionado) -->
          <div id="recurring-config" class="bg-blue-500/5 border border-blue-400/20 rounded-lg p-5 hidden">
            <div class="flex items-start gap-3 mb-4">
              <span class="text-2xl">🔄</span>
              <div>
                <h4 class="text-white font-semibold mb-1">Configurações de Ordem Recorrente</h4>
                <p class="text-sm text-slate-400">
                  A cada turno, o sistema tentará vender automaticamente esta quantidade para compradores que correspondam ao seu preço.
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    💰 Preço Mínimo Aceito
                  </label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</div>
                    <input type="number" name="min_price_sell" id="min-price-sell" min="0.01" step="0.01" placeholder="0.00"
                           class="w-full pl-8 pr-4 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                  focus:border-brand-400 focus:outline-none">
                  </div>
                  <p class="text-xs text-slate-400 mt-1">
                    Não vender abaixo deste preço (deixe vazio = 80% do preço base)
                  </p>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    📦 Reserva de Estoque
                  </label>
                  <input type="number" name="min_stock_reserve" id="min-stock-reserve" min="0" placeholder="0"
                         class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                focus:border-brand-400 focus:outline-none">
                  <p class="text-xs text-slate-400 mt-1">
                    Sempre manter pelo menos esta quantidade em estoque
                  </p>
                </div>
              </div>

              <div class="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                <div class="flex items-start gap-2">
                  <span class="text-yellow-400 text-lg">⚠️</span>
                  <div class="text-xs text-yellow-200">
                    <strong>Ordem recorrente:</strong> A cada turno, se você tiver excedente suficiente e houver compradores com preço compatível,
                    a venda será executada automaticamente. O dinheiro será creditado no seu orçamento e os recursos deduzidos.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações Avançadas (Colapsável) -->
          <details class="bg-bg/30 rounded-lg border border-bg-ring/50" id="one-time-settings">
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
                  <input type="number" name="min_quantity" min="1" placeholder="1" value="1"
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
            <button type="submit" id="submit-offer-btn" disabled
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
    if (!countryData) {
      console.error('❌ window.currentCountry não encontrado');
      return [];
    }

    if (!window.ResourceProductionCalculator || !window.ResourceConsumptionCalculator) {
      console.error('❌ Calculadores de recursos não encontrados');
      return [];
    }

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

    // Tipo de ordem (one_time vs recurring)
    this.currentModal.querySelectorAll('input[name="order_type"]').forEach(radio => {
      radio.addEventListener('change', (e) => this.onOrderTypeChanged(e.target.value));
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
    const hasMultiple = radioElement.dataset.hasMultiple === 'true';

    this.selectedResource = radioElement.value;
    this.selectedMarketType = marketType;

    // Atualizar unidade exibida
    const unitDisplay = this.currentModal.querySelector('#quantity-unit');
    if (unitDisplay) unitDisplay.textContent = unit;

    // Atualizar máximo
    const quantityInput = this.currentModal.querySelector('#quantity-input');
    if (quantityInput) {
      quantityInput.max = available;
      quantityInput.setAttribute('data-available', available);
      quantityInput.disabled = false;
    }

    // Habilitar presets de quantidade
    this.currentModal.querySelectorAll('[data-quantity-preset]').forEach(btn => {
      btn.disabled = false;
    });

    // Atualizar label de máximo
    const maxLabel = this.currentModal.querySelector('#max-quantity-label');
    if (maxLabel) maxLabel.textContent = `Máximo: ${available.toLocaleString()}`;

    // Se tem múltiplos tipos, mostrar seleção
    if (hasMultiple) {
      this.showProductTypeSelection(radioElement.value);
    } else {
      // Esconder seleção de tipo
      const section = this.currentModal.querySelector('#product-type-section');
      if (section) section.classList.add('hidden');

      // Aplicar preço sugerido do tipo padrão
      this.applyPriceSuggestion(marketType, available);
    }

    // Habilitar campos de preço
    const priceInput = this.currentModal.querySelector('#price-input');
    if (priceInput) priceInput.disabled = false;

    this.currentModal.querySelectorAll('[data-price-preset]').forEach(btn => {
      btn.disabled = false;
    });

    // Habilitar botão de submit
    const submitBtn = this.currentModal.querySelector('#submit-offer-btn');
    if (submitBtn) submitBtn.disabled = false;

    this.validateAndUpdateSummary();
  }

  /**
   * Mostrar seleção de tipo de produto
   */
  showProductTypeSelection(gameResourceId) {
    const section = this.currentModal.querySelector('#product-type-section');
    const optionsDiv = this.currentModal.querySelector('#product-type-options');

    if (!section || !optionsDiv) return;

    // Buscar tipos do recurso
    const resourceConfig = Object.values(RESOURCE_MAPPING).find(r => r.gameResourceId === gameResourceId);
    if (!resourceConfig) return;

    // Renderizar opções
    optionsDiv.innerHTML = resourceConfig.marketTypes.map((type, index) => `
      <label class="flex items-start p-3 border-2 border-bg-ring rounded-lg cursor-pointer
                    hover:border-brand-400 hover:bg-brand-500/5 transition-all">
        <input type="radio" name="product_type" value="${type.id}"
               data-base-price="${type.basePrice}"
               class="mt-1 text-brand-500 focus:ring-brand-400"
               ${index === 0 ? 'checked' : ''} required>
        <div class="ml-3 flex-1">
          <div class="font-medium text-white">${type.name}</div>
          <div class="text-xs text-slate-400 mt-0.5">${type.description}</div>
          <div class="text-xs text-brand-300 mt-1 font-semibold">
            Preço base: $${type.basePrice.toLocaleString()} / ${resourceConfig.defaultUnit}
          </div>
        </div>
      </label>
    `).join('');

    // Event listener para mudança de tipo
    optionsDiv.querySelectorAll('input[name="product_type"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        this.selectedMarketType = e.target.value;
        const available = parseInt(this.currentModal.querySelector('#quantity-input').getAttribute('data-available'));
        this.applyPriceSuggestion(e.target.value, available);
        this.validateAndUpdateSummary();
      });
    });

    section.classList.remove('hidden');

    // Aplicar preço do primeiro tipo
    const available = parseInt(this.currentModal.querySelector('#quantity-input').getAttribute('data-available'));
    this.applyPriceSuggestion(resourceConfig.marketTypes[0].id, available);
  }

  /**
   * Aplicar sugestão de preço
   */
  applyPriceSuggestion(marketTypeId, availableQuantity) {
    const priceSuggestion = getSuggestedPrice(marketTypeId, availableQuantity);
    if (!priceSuggestion) return;

    const suggestionDiv = this.currentModal.querySelector('#price-suggestion');
    const rangeSpan = this.currentModal.querySelector('#price-range');

    if (suggestionDiv && rangeSpan) {
      suggestionDiv.classList.remove('hidden');
      rangeSpan.textContent = `$${priceSuggestion.min.toLocaleString()} - $${priceSuggestion.max.toLocaleString()}`;

      // Armazenar para usar nos presets
      this.currentModal.setAttribute('data-price-low', priceSuggestion.min);
      this.currentModal.setAttribute('data-price-market', priceSuggestion.suggested);
      this.currentModal.setAttribute('data-price-high', priceSuggestion.max);
    }

    // Preencher automaticamente com preço sugerido se campo vazio
    const priceInput = this.currentModal.querySelector('#price-input');
    if (priceInput && !priceInput.value) {
      priceInput.value = priceSuggestion.suggested;
      this.validateAndUpdateSummary();
    }
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
    const summaryDiv = this.currentModal.querySelector('#transaction-summary');

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

    // Mostrar resumo se tiver quantidade e preço
    if (quantity > 0 && pricePerUnit > 0) {
      summaryDiv?.classList.remove('hidden');

      // Atualizar resumo
      const totalValue = quantity * pricePerUnit;

      const totalValueEl = this.currentModal.querySelector('#total-value');
      const unitValueEl = this.currentModal.querySelector('#unit-value');
      const summaryQuantityEl = this.currentModal.querySelector('#summary-quantity');

      if (totalValueEl) totalValueEl.textContent = `$${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      if (unitValueEl) unitValueEl.textContent = `$${pricePerUnit.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
      if (summaryQuantityEl) summaryQuantityEl.textContent = quantity.toLocaleString();

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
    } else {
      summaryDiv?.classList.add('hidden');
    }
  }

  /**
   * Alternar entre ordem única e recorrente
   */
  onOrderTypeChanged(orderType) {
    const recurringConfig = this.currentModal.querySelector('#recurring-config');
    const oneTimeSettings = this.currentModal.querySelector('#one-time-settings');

    if (orderType === 'recurring') {
      recurringConfig?.classList.remove('hidden');
      oneTimeSettings?.classList.add('hidden');
    } else {
      recurringConfig?.classList.add('hidden');
      oneTimeSettings?.classList.remove('hidden');
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
      const selectedResourceRadio = form.querySelector('input[name="resource"]:checked');
      if (!selectedResourceRadio) {
        throw new Error('Selecione um recurso');
      }

      const unit = selectedResourceRadio.dataset.unit;

      // Usar o marketType selecionado (pode ser do tipo múltiplo)
      const marketTypeId = this.selectedMarketType;
      const marketConfig = getMarketTypeConfig(marketTypeId);

      if (!marketConfig) {
        throw new Error('Configuração de mercado não encontrada');
      }

      // Verificar tipo de ordem
      const orderType = formData.get('order_type');

      if (orderType === 'recurring') {
        // CRIAR ORDEM RECORRENTE
        await this.handleRecurringOrderSubmit(formData, marketTypeId, marketConfig, unit);
      } else {
        // CRIAR OFERTA ÚNICA (comportamento original)
        await this.handleOneTimeOfferSubmit(formData, marketTypeId, marketConfig, unit);
      }

      this.closeModal();

    } catch (error) {
      console.error('❌ Erro ao criar oferta:', error);
      alert(error.message || 'Erro ao criar oferta');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  /**
   * Criar oferta única (original)
   */
  async handleOneTimeOfferSubmit(formData, marketTypeId, marketConfig, unit) {
    // Montar objeto de oferta
    const offerData = {
      type: 'sell',
      category: 'resources',
      item_id: marketTypeId,
      item_name: marketConfig.name,
      quantity: parseInt(formData.get('quantity')),
      unit: unit,
      price_per_unit: parseFloat(formData.get('price_per_unit')),
      min_quantity: parseInt(formData.get('min_quantity')) || 1,
      delivery_time_days: parseInt(formData.get('delivery_time_days')) || 30,
      duration_days: parseInt(formData.get('duration_days')) || 14,
      title: formData.get('custom_title') || null
    };

    // Auto-gerar título se não fornecido
    if (!offerData.title) {
      offerData.title = `${offerData.item_name} - ${offerData.quantity.toLocaleString()} ${unit}`;
    }

    console.log('📤 Enviando oferta:', offerData);

    // Criar oferta
    const result = await this.marketplaceSystem.createOffer(offerData);

    if (result.success) {
      alert('✅ Oferta criada com sucesso!');

      // Recarregar marketplace ou atualizar lista
      if (typeof window.loadMarketplaceOffers === 'function') {
        window.loadMarketplaceOffers('all', window.paisId);
      } else {
        window.location.reload();
      }
    } else {
      throw new Error(result.error || 'Erro desconhecido');
    }
  }

  /**
   * Criar ordem recorrente
   */
  async handleRecurringOrderSubmit(formData, marketTypeId, marketConfig, unit) {
    // Inicializar sistema de ordens recorrentes se necessário
    if (!window.recurringOrdersSystem) {
      const { RecurringOrdersSystem } = await import('../systems/recurringOrdersSystem.js');
      window.recurringOrdersSystem = new RecurringOrdersSystem();
    }

    const orderData = {
      country_id: window.paisId,
      order_type: 'sell',
      item_id: marketTypeId,
      quantity: parseInt(formData.get('quantity')),
      price_per_unit: parseFloat(formData.get('price_per_unit')),
      min_stock_reserve: parseFloat(formData.get('min_stock_reserve') || 0),
      min_price_sell: parseFloat(formData.get('min_price_sell')) || null
    };

    console.log('📤 Criando ordem recorrente:', orderData);

    const result = await window.recurringOrdersSystem.createRecurringOrder(orderData);

    if (result.success) {
      alert('✅ Ordem recorrente criada! A cada turno, o sistema tentará vender automaticamente este recurso.');

      // Recarregar para mostrar ordens recorrentes
      window.location.reload();
    } else {
      throw new Error(result.error || 'Erro ao criar ordem recorrente');
    }
  }

  /**
   * Fechar modal
   */
  closeModal() {
    if (this.currentModal) {
      this.currentModal.remove();
      this.currentModal = null;
      this.selectedResource = null;
      this.selectedMarketType = null;
    }
  }
}

export default OfferModalManager;
