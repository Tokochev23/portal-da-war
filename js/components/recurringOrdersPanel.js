// js/components/recurringOrdersPanel.js - Painel de Gerenciamento de Ordens Recorrentes

import { db } from '../services/firebase.js';
import { getMarketTypeConfig } from '../data/resourceMapping.js';

/**
 * Painel de Gerenciamento de Ordens Recorrentes
 *
 * Mostra ordens ativas, pausadas e canceladas
 * Permite pausar, reativar e cancelar ordens
 * Mostra estatísticas de execução
 */
export class RecurringOrdersPanel {
  constructor(countryId) {
    this.countryId = countryId;
    this.container = null;
    this.recurringOrdersSystem = null;
  }

  /**
   * Inicializar sistema se necessário
   */
  async initSystem() {
    if (!window.recurringOrdersSystem) {
      const { RecurringOrdersSystem } = await import('../systems/recurringOrdersSystem.js');
      window.recurringOrdersSystem = new RecurringOrdersSystem();
    }
    this.recurringOrdersSystem = window.recurringOrdersSystem;
  }

  /**
   * Renderizar painel
   */
  async render() {
    await this.initSystem();

    const panel = document.createElement('div');
    panel.className = 'bg-bg-soft border border-bg-ring rounded-xl p-6 mb-6';
    panel.id = 'recurring-orders-panel';

    // Buscar ordens
    const orders = await this.recurringOrdersSystem.getCountryOrders(this.countryId);
    const activeOrders = orders.filter(o => o.status === 'active');
    const pausedOrders = orders.filter(o => ['paused', 'out_of_stock', 'out_of_budget'].includes(o.status));

    panel.innerHTML = `
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="text-2xl">🔄</span>
            Ordens Recorrentes
          </h3>
          <p class="text-sm text-slate-400 mt-1">
            Vendas e compras automáticas a cada turno
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full font-semibold">
            ${activeOrders.length} Ativas
          </span>
          ${pausedOrders.length > 0 ? `
            <span class="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full font-semibold">
              ${pausedOrders.length} Pausadas
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Ordens Ativas -->
      ${activeOrders.length > 0 ? `
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
            ✅ Ordens Ativas
          </h4>
          <div class="space-y-3">
            ${activeOrders.map(order => this.renderOrderCard(order)).join('')}
          </div>
        </div>
      ` : `
        <div class="bg-bg/30 border border-bg-ring/50 rounded-lg p-6 text-center mb-6">
          <div class="text-4xl mb-2">📦</div>
          <div class="text-slate-400">
            Você não tem ordens recorrentes ativas no momento.
          </div>
          <div class="text-sm text-slate-500 mt-1">
            Crie uma ordem recorrente ao vender recursos no marketplace.
          </div>
        </div>
      `}

      <!-- Ordens Pausadas -->
      ${pausedOrders.length > 0 ? `
        <div>
          <h4 class="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">
            ⏸️ Ordens Pausadas
          </h4>
          <div class="space-y-3">
            ${pausedOrders.map(order => this.renderOrderCard(order)).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Histórico de Transações -->
      <div class="mt-6 pt-6 border-t border-bg-ring/50">
        <button class="text-sm text-brand-400 hover:text-brand-300 transition-colors" data-action="show-history">
          📊 Ver Histórico de Transações Recorrentes
        </button>
      </div>
    `;

    this.container = panel;
    this.setupEventListeners();

    return panel;
  }

  /**
   * Renderizar card de ordem individual
   */
  renderOrderCard(order) {
    const statusInfo = this.getStatusInfo(order.status);
    const isActive = order.status === 'active';

    return `
      <div class="bg-bg border-2 ${statusInfo.borderClass} rounded-lg p-4 hover:shadow-lg transition-shadow">
        <div class="flex items-start justify-between">
          <!-- Info da Ordem -->
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg">${order.order_type === 'sell' ? '📤' : '📥'}</span>
              <span class="font-semibold text-white">
                ${order.order_type === 'sell' ? 'Vendendo' : 'Comprando'} ${order.item_name}
              </span>
              <span class="px-2 py-0.5 ${statusInfo.badgeClass} text-xs rounded-full font-semibold">
                ${statusInfo.label}
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <div class="text-slate-400 text-xs">Quantidade</div>
                <div class="text-white font-semibold">${order.quantity.toLocaleString()} ${order.unit}</div>
              </div>

              <div>
                <div class="text-slate-400 text-xs">Preço por ${order.unit}</div>
                <div class="text-white font-semibold">$${order.price_per_unit.toLocaleString()}</div>
              </div>

              <div>
                <div class="text-slate-400 text-xs">Valor Total</div>
                <div class="text-white font-semibold">$${(order.quantity * order.price_per_unit).toLocaleString()}</div>
              </div>

              <div>
                <div class="text-slate-400 text-xs">Execuções</div>
                <div class="text-white font-semibold">${order.total_executed || 0}x</div>
              </div>
            </div>

            ${order.total_executed > 0 ? `
              <div class="mt-3 pt-3 border-t border-bg-ring/50">
                <div class="text-xs text-slate-400">
                  📊 Total transacionado: <span class="text-white font-semibold">$${(order.total_value || 0).toLocaleString()}</span>
                  • Última execução: ${order.last_execution ? new Date(order.last_execution.toMillis()).toLocaleDateString('pt-BR') : 'Nunca'}
                </div>
              </div>
            ` : ''}

            ${order.status === 'out_of_stock' ? `
              <div class="mt-2 text-xs text-yellow-300">
                ⚠️ Pausada: Estoque insuficiente
              </div>
            ` : ''}
            ${order.status === 'out_of_budget' ? `
              <div class="mt-2 text-xs text-yellow-300">
                ⚠️ Pausada: Orçamento insuficiente
              </div>
            ` : ''}
          </div>

          <!-- Ações -->
          <div class="flex flex-col gap-2 ml-4">
            ${isActive ? `
              <button class="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-xs rounded transition-colors"
                      data-action="pause-order" data-order-id="${order.id}">
                ⏸️ Pausar
              </button>
            ` : order.status === 'paused' || order.status === 'out_of_stock' || order.status === 'out_of_budget' ? `
              <button class="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs rounded transition-colors"
                      data-action="resume-order" data-order-id="${order.id}">
                ▶️ Reativar
              </button>
            ` : ''}

            <button class="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs rounded transition-colors"
                    data-action="cancel-order" data-order-id="${order.id}">
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Obter informações de status
   */
  getStatusInfo(status) {
    const statusMap = {
      active: {
        label: 'Ativa',
        badgeClass: 'bg-green-500/20 text-green-300',
        borderClass: 'border-green-500/30'
      },
      paused: {
        label: 'Pausada',
        badgeClass: 'bg-yellow-500/20 text-yellow-300',
        borderClass: 'border-yellow-500/30'
      },
      out_of_stock: {
        label: 'Sem Estoque',
        badgeClass: 'bg-orange-500/20 text-orange-300',
        borderClass: 'border-orange-500/30'
      },
      out_of_budget: {
        label: 'Sem Orçamento',
        badgeClass: 'bg-orange-500/20 text-orange-300',
        borderClass: 'border-orange-500/30'
      },
      cancelled: {
        label: 'Cancelada',
        badgeClass: 'bg-red-500/20 text-red-300',
        borderClass: 'border-red-500/30'
      }
    };

    return statusMap[status] || statusMap.paused;
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    if (!this.container) return;

    // Pausar ordem
    this.container.querySelectorAll('[data-action="pause-order"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const orderId = e.target.dataset.orderId;
        await this.pauseOrder(orderId);
      });
    });

    // Reativar ordem
    this.container.querySelectorAll('[data-action="resume-order"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const orderId = e.target.dataset.orderId;
        await this.resumeOrder(orderId);
      });
    });

    // Cancelar ordem
    this.container.querySelectorAll('[data-action="cancel-order"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const orderId = e.target.dataset.orderId;
        await this.cancelOrder(orderId);
      });
    });

    // Mostrar histórico
    this.container.querySelector('[data-action="show-history"]')?.addEventListener('click', async () => {
      await this.showTransactionHistory();
    });
  }

  /**
   * Pausar ordem
   */
  async pauseOrder(orderId) {
    if (!confirm('Tem certeza que deseja pausar esta ordem recorrente?')) return;

    try {
      await this.recurringOrdersSystem.pauseOrder(orderId);
      alert('✅ Ordem pausada com sucesso!');
      await this.refresh();
    } catch (error) {
      console.error('Erro ao pausar ordem:', error);
      alert('❌ Erro ao pausar ordem: ' + error.message);
    }
  }

  /**
   * Reativar ordem
   */
  async resumeOrder(orderId) {
    try {
      await this.recurringOrdersSystem.reactivateOrder(orderId);
      alert('✅ Ordem reativada! Ela será executada no próximo turno se houver correspondência.');
      await this.refresh();
    } catch (error) {
      console.error('Erro ao reativar ordem:', error);
      alert('❌ Erro ao reativar ordem: ' + error.message);
    }
  }

  /**
   * Cancelar ordem
   */
  async cancelOrder(orderId) {
    if (!confirm('Tem certeza que deseja CANCELAR esta ordem? Esta ação é permanente.')) return;

    try {
      await this.recurringOrdersSystem.cancelOrder(orderId);
      alert('✅ Ordem cancelada permanentemente.');
      await this.refresh();
    } catch (error) {
      console.error('Erro ao cancelar ordem:', error);
      alert('❌ Erro ao cancelar ordem: ' + error.message);
    }
  }

  /**
   * Mostrar histórico de transações
   */
  async showTransactionHistory() {
    try {
      const transactions = await this.recurringOrdersSystem.getCountryTransactions(this.countryId, 50);

      if (transactions.length === 0) {
        alert('Ainda não há transações recorrentes registradas.');
        return;
      }

      // Criar modal de histórico
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';

      modal.innerHTML = `
        <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="p-6 border-b border-bg-ring/50 bg-gradient-to-r from-brand-500/10 to-brand-600/10">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold text-white">📊 Histórico de Transações Recorrentes</h3>
              <button class="text-slate-400 hover:text-white" data-action="close-history">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-3">
              ${transactions.map(tx => `
                <div class="bg-bg border border-bg-ring rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-lg">${tx.type === 'sell' ? '📤' : '📥'}</span>
                        <span class="font-semibold text-white">
                          ${tx.type === 'sell' ? 'Vendeu' : 'Comprou'} ${tx.quantity.toLocaleString()} ${tx.unit} de ${tx.item_name}
                        </span>
                      </div>

                      <div class="text-sm text-slate-400">
                        ${tx.type === 'sell' ? 'Para' : 'De'}: <span class="text-white">${tx.type === 'sell' ? tx.buyer_country_name : tx.seller_country_name}</span>
                        • Preço: <span class="text-white">$${tx.price_per_unit.toLocaleString()}/${tx.unit}</span>
                        • Total: <span class="text-brand-300 font-semibold">$${tx.total_value.toLocaleString()}</span>
                      </div>

                      <div class="text-xs text-slate-500 mt-1">
                        Turno ${tx.turn_number} • ${new Date(tx.executed_at.toMillis()).toLocaleString('pt-BR')}
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="text-xs text-slate-400">Orçamento</div>
                      <div class="text-sm ${tx.type === 'sell' ? 'text-green-400' : 'text-red-400'}">
                        ${tx.type === 'sell' ? '+' : '-'}$${tx.total_value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      modal.querySelector('[data-action="close-history"]').addEventListener('click', () => {
        document.body.removeChild(modal);
      });

    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      alert('❌ Erro ao buscar histórico: ' + error.message);
    }
  }

  /**
   * Atualizar painel
   */
  async refresh() {
    if (!this.container || !this.container.parentNode) return;

    const newPanel = await this.render();
    this.container.parentNode.replaceChild(newPanel, this.container);
  }
}

// Expor globalmente
window.RecurringOrdersPanel = RecurringOrdersPanel;
