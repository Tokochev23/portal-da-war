/**
 * Modal de Fundação de Agência de Inteligência
 * Interface para criar nova agência
 */

import intelligenceAgencySystem, { AGENCY_TIERS, AGENCY_FOCUS } from '../systems/intelligenceAgencySystem.js';
import { formatCurrency } from '../utils.js';

class AgencyFoundationModal {
  constructor() {
    this.modal = null;
    this.country = null;
    this.currentTurn = 0;
    this.selectedBudgetPercent = 5;
    this.selectedFocus = 'external_espionage';
    this.createModal();
  }

  createModal() {
    this.modal = document.createElement('div');
    this.modal.id = 'agency-foundation-modal';
    this.modal.className = 'hidden fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm';

    this.modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <span class="text-4xl">🕵️</span>
            <div>
              <h3 class="text-2xl font-bold text-slate-100">Fundar Agência de Inteligência</h3>
              <p class="text-sm text-slate-400">Crie uma agência de espionagem e contra-espionagem</p>
            </div>
          </div>
          <button id="close-agency-foundation-modal" class="text-slate-400 hover:text-slate-200 text-2xl transition">×</button>
        </div>

        <!-- Nome da Agência -->
        <div class="mb-6">
          <label class="text-sm font-semibold text-slate-200 mb-2 block">Nome da Agência</label>
          <input
            type="text"
            id="agency-name-input"
            placeholder="Ex: CIA, KGB, MI6, ABIN..."
            maxlength="50"
            class="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
          <p class="text-xs text-slate-500 mt-1">Deixe em branco para usar nome padrão</p>
        </div>

        <!-- Orçamento Dedicado -->
        <div class="mb-6">
          <label class="text-sm font-semibold text-slate-200 mb-3 block">Orçamento Anual Dedicado</label>
          <div class="flex items-center gap-4 mb-3">
            <input
              type="range"
              id="agency-budget-slider"
              min="0.5"
              max="15"
              step="0.5"
              value="5"
              class="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div class="min-w-[100px] text-right">
              <span id="budget-percent-display" class="text-2xl font-bold text-brand-400">5%</span>
            </div>
          </div>

          <!-- Tier Preview -->
          <div id="tier-preview" class="p-4 rounded-xl border bg-slate-800/50 border-slate-600">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span id="tier-icon" class="text-2xl">🥇</span>
                <span id="tier-name" class="text-lg font-bold text-slate-100">Poderosa</span>
              </div>
              <span id="tier-power" class="text-sm px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Forte</span>
            </div>
            <p id="tier-description" class="text-sm text-slate-400">Operações complexas e eficazes</p>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div class="text-xs">
                <span class="text-slate-500">Orçamento Anual:</span>
                <span id="agency-budget-display" class="text-slate-200 font-semibold ml-1">US$ 0</span>
              </div>
              <div class="text-xs">
                <span class="text-slate-500">Modificador:</span>
                <span id="tier-modifier" class="text-emerald-400 font-semibold ml-1">+1</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Foco Principal -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-slate-200 mb-3">Foco Principal</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="agency-focus-options">
            <!-- Será preenchido dinamicamente -->
          </div>
        </div>

        <!-- Custo de Fundação -->
        <div class="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">💰</span>
              <span class="text-sm font-semibold text-amber-200">Custo de Fundação</span>
            </div>
            <span id="foundation-cost" class="text-xl font-bold text-amber-300">US$ 0</span>
          </div>
          <p class="text-xs text-amber-400 mt-2">Custo único baseado no PIB per capita do país</p>
        </div>

        <!-- Orçamento Nacional Disponível -->
        <div class="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div class="flex items-center justify-between">
            <span class="text-sm text-emerald-300">💵 Orçamento Nacional Disponível</span>
            <span id="national-budget-display" class="text-lg font-bold text-emerald-400">US$ 0</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3">
          <button
            id="cancel-agency-foundation"
            class="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            Cancelar
          </button>
          <button
            id="confirm-agency-foundation"
            class="flex-1 rounded-xl border border-brand-500/30 bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🕵️ Fundar Agência
          </button>
        </div>

        <!-- Resultado (inicialmente oculto) -->
        <div id="foundation-result" class="hidden mt-4 p-4 rounded-xl">
          <div class="flex items-start gap-3">
            <span id="result-icon" class="text-2xl"></span>
            <div class="flex-1">
              <h4 id="result-title" class="font-bold text-lg mb-1"></h4>
              <p id="result-message" class="text-sm"></p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Fechar modal
    const closeBtn = this.modal.querySelector('#close-agency-foundation-modal');
    const cancelBtn = this.modal.querySelector('#cancel-agency-foundation');

    closeBtn.addEventListener('click', () => this.hide());
    cancelBtn.addEventListener('click', () => this.hide());

    // Clicar fora fecha
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    // Orçamento slider
    const budgetSlider = this.modal.querySelector('#agency-budget-slider');
    budgetSlider.addEventListener('input', (e) => {
      this.selectedBudgetPercent = parseFloat(e.target.value);
      this.updateBudgetDisplay();
    });

    // Confirmar fundação
    const confirmBtn = this.modal.querySelector('#confirm-agency-foundation');
    confirmBtn.addEventListener('click', () => this.confirmFoundation());
  }

  show(country, currentTurn) {
    this.country = country;
    this.currentTurn = currentTurn;

    // Renderizar opções de foco
    this.renderFocusOptions();

    // Atualizar orçamento nacional
    const nationalBudget = intelligenceAgencySystem.calculateBudget(country);
    this.modal.querySelector('#national-budget-display').textContent = formatCurrency(nationalBudget);

    // Atualizar displays iniciais
    this.updateBudgetDisplay();

    // Mostrar modal
    this.modal.classList.remove('hidden');

    // Resetar resultado
    this.modal.querySelector('#foundation-result').classList.add('hidden');
  }

  hide() {
    this.modal.classList.add('hidden');
  }

  renderFocusOptions() {
    const container = this.modal.querySelector('#agency-focus-options');
    const focuses = intelligenceAgencySystem.getFocuses();

    container.innerHTML = Object.entries(focuses).map(([key, focus]) => `
      <button
        class="focus-option-btn text-left p-4 rounded-xl border transition ${
          key === this.selectedFocus
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
        }"
        data-focus="${key}"
      >
        <div class="flex items-start gap-3">
          <span class="text-3xl">${focus.icon}</span>
          <div class="flex-1">
            <h5 class="font-semibold text-slate-100 mb-1">${focus.name}</h5>
            <p class="text-xs text-slate-400 mb-2">${focus.description}</p>
            <div class="flex flex-wrap gap-1">
              ${Object.entries(focus.bonuses).map(([bonus, value]) => `
                <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  +${value}% ${bonus}
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </button>
    `).join('');

    // Adicionar event listeners
    container.querySelectorAll('.focus-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedFocus = e.currentTarget.dataset.focus;
        this.renderFocusOptions();
      });
    });
  }

  updateBudgetDisplay() {
    if (!this.country) return;

    const nationalBudget = intelligenceAgencySystem.calculateBudget(this.country);
    const agencyBudget = Math.round(nationalBudget * (this.selectedBudgetPercent / 100));
    const tier = intelligenceAgencySystem.determineTier(this.selectedBudgetPercent);
    const tierData = AGENCY_TIERS[tier];
    const foundationCost = intelligenceAgencySystem.calculateFoundationCost(this.country);

    // Atualizar % display
    this.modal.querySelector('#budget-percent-display').textContent = `${this.selectedBudgetPercent}%`;

    // Atualizar tier preview
    this.modal.querySelector('#tier-icon').textContent = tierData.icon;
    this.modal.querySelector('#tier-name').textContent = tierData.name;
    this.modal.querySelector('#tier-power').textContent = tierData.power;
    this.modal.querySelector('#tier-description').textContent = tierData.description;
    this.modal.querySelector('#agency-budget-display').textContent = formatCurrency(agencyBudget);
    this.modal.querySelector('#tier-modifier').textContent = tierData.modifier >= 0 ? `+${tierData.modifier}` : tierData.modifier;

    // Atualizar custo de fundação
    this.modal.querySelector('#foundation-cost').textContent = formatCurrency(foundationCost);

    // Verificar se tem orçamento
    const confirmBtn = this.modal.querySelector('#confirm-agency-foundation');
    confirmBtn.disabled = foundationCost > nationalBudget;
  }

  async confirmFoundation() {
    const confirmBtn = this.modal.querySelector('#confirm-agency-foundation');
    const agencyNameInput = this.modal.querySelector('#agency-name-input');

    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Fundando...';

    // Fundar agência
    const result = await intelligenceAgencySystem.foundAgency(
      this.country,
      agencyNameInput.value.trim(),
      this.selectedBudgetPercent,
      this.selectedFocus,
      this.currentTurn
    );

    // Mostrar resultado
    this.showResult(result);

    // Re-habilitar botão
    confirmBtn.disabled = false;
    confirmBtn.textContent = '🕵️ Fundar Agência';
  }

  showResult(result) {
    const resultDiv = this.modal.querySelector('#foundation-result');
    const icon = this.modal.querySelector('#result-icon');
    const title = this.modal.querySelector('#result-title');
    const message = this.modal.querySelector('#result-message');

    if (result.success) {
      resultDiv.className = 'mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30';
      icon.textContent = '✅';
      title.textContent = 'Agência Fundada com Sucesso!';
      title.className = 'font-bold text-lg mb-1 text-green-400';

      const tier = result.tier;
      message.textContent = `${result.agency.name} foi fundada! Tier: ${tier.icon} ${tier.name}. Orçamento anual: ${formatCurrency(result.agency.budget)}. Você pode começar a pesquisar tecnologias de inteligência.`;
      message.className = 'text-sm text-green-300';

      // Auto-fechar e recarregar dados do país após 2 segundos
      setTimeout(async () => {
        this.hide();

        // Recarregar dados do país sem recarregar a página inteira
        if (window.reloadCurrentCountry) {
          await window.reloadCurrentCountry();

          // Recarregar o dashboard da agência se estiver aberto
          const agencyContent = document.getElementById('intelligence-dashboard-container');
          if (agencyContent) {
            const { renderAgencyDashboard } = await import('./agencyDashboard.js');
            renderAgencyDashboard(window.currentCountry, agencyContent);
          }
        }
      }, 2000);

    } else {
      resultDiv.className = 'mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30';
      icon.textContent = '❌';
      title.textContent = 'Erro';
      title.className = 'font-bold text-lg mb-1 text-red-400';
      message.textContent = result.error || 'Ocorreu um erro ao fundar a agência.';
      message.className = 'text-sm text-red-300';
    }

    resultDiv.classList.remove('hidden');
  }
}

// Singleton
const agencyFoundationModal = new AgencyFoundationModal();
export default agencyFoundationModal;
