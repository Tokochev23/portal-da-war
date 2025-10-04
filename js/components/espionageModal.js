/**
 * Modal de Operação de Espionagem
 * Interface para iniciar operações de espionagem
 */

import espionageSystem from '../systems/espionageSystem.js';
import { formatCurrency } from '../utils.js';

class EspionageModal {
  constructor() {
    this.modal = null;
    this.targetCountry = null;
    this.spyCountry = null;
    this.currentTurn = 0;
    this.selectedLevel = 'basic';
    this.selectedDuration = 3;
    this.createModal();
  }

  createModal() {
    // Criar estrutura do modal
    this.modal = document.createElement('div');
    this.modal.id = 'espionage-modal';
    this.modal.className = 'hidden fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm';

    this.modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🕵️</span>
            <div>
              <h3 class="text-xl font-bold text-slate-100">Operação de Espionagem</h3>
              <p class="text-sm text-slate-400" id="espionage-target-name">Selecione um país</p>
            </div>
          </div>
          <button id="close-espionage-modal" class="text-slate-400 hover:text-slate-200 text-2xl transition">×</button>
        </div>

        <!-- Aviso -->
        <div class="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div class="flex items-start gap-3">
            <span class="text-xl">⚠️</span>
            <div class="text-sm text-amber-200">
              <p class="font-semibold mb-1">Operações de espionagem são arriscadas</p>
              <p class="text-amber-300/90">Países com alta contra-espionagem podem detectar e bloquear suas tentativas. Investimentos maiores não garantem sucesso.</p>
            </div>
          </div>
        </div>

        <!-- Seleção de Nível -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-slate-200 mb-3">Nível de Espionagem</h4>
          <div class="grid grid-cols-1 gap-3" id="espionage-levels">
            <!-- Será preenchido dinamicamente -->
          </div>
        </div>

        <!-- Duração -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-slate-200 mb-3">Duração da Operação</h4>
          <div class="flex items-center gap-4">
            <input
              type="range"
              id="espionage-duration"
              min="1"
              max="10"
              value="3"
              class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <span id="duration-display" class="text-lg font-bold text-brand-400 min-w-[80px]">3 turnos</span>
          </div>
          <p class="text-xs text-slate-400 mt-2">Quanto maior a duração, maior o custo total da operação.</p>
        </div>

        <!-- Resumo de Custos e Chances -->
        <div class="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-400 mb-1">Custo Total</p>
              <p id="operation-cost" class="text-xl font-bold text-slate-100">US$ 0</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 mb-1">Chance de Sucesso</p>
              <div class="flex items-center gap-2">
                <p id="success-chance" class="text-xl font-bold text-green-400">0%</p>
                <span id="chance-indicator" class="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">-</span>
              </div>
            </div>
          </div>

          <!-- Barra de chance -->
          <div class="mt-3">
            <div class="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
              <div id="chance-bar" class="h-2 rounded-full bg-green-500 transition-all duration-300" style="width: 0%"></div>
            </div>
          </div>

          <!-- Fatores que afetam -->
          <div class="mt-3 text-xs text-slate-400">
            <p class="font-semibold mb-1">Fatores que afetam a chance:</p>
            <ul class="space-y-0.5">
              <li id="factor-spy-tech" class="flex items-center gap-1">
                <span class="text-green-400">+</span> Sua tecnologia
              </li>
              <li id="factor-target-counter" class="flex items-center gap-1">
                <span class="text-red-400">-</span> Contra-espionagem do alvo
              </li>
              <li id="factor-target-urban" class="flex items-center gap-1">
                <span class="text-red-400">-</span> Urbanização do alvo
              </li>
            </ul>
          </div>
        </div>

        <!-- Orçamento Disponível -->
        <div class="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div class="flex items-center justify-between">
            <span class="text-sm text-emerald-300">💰 Orçamento Disponível</span>
            <span id="available-budget" class="text-lg font-bold text-emerald-400">US$ 0</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3">
          <button
            id="cancel-espionage"
            class="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            Cancelar
          </button>
          <button
            id="confirm-espionage"
            class="flex-1 rounded-xl border border-brand-500/30 bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🕵️ Iniciar Operação
          </button>
        </div>

        <!-- Resultado (inicialmente oculto) -->
        <div id="operation-result" class="hidden mt-4 p-4 rounded-xl">
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
    const closeBtn = this.modal.querySelector('#close-espionage-modal');
    const cancelBtn = this.modal.querySelector('#cancel-espionage');

    closeBtn.addEventListener('click', () => this.hide());
    cancelBtn.addEventListener('click', () => this.hide());

    // Clicar fora fecha
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.hide();
    });

    // Duração
    const durationSlider = this.modal.querySelector('#espionage-duration');
    const durationDisplay = this.modal.querySelector('#duration-display');

    durationSlider.addEventListener('input', (e) => {
      this.selectedDuration = parseInt(e.target.value);
      durationDisplay.textContent = `${this.selectedDuration} turno${this.selectedDuration > 1 ? 's' : ''}`;
      this.updateCostAndChance();
    });

    // Confirmar operação
    const confirmBtn = this.modal.querySelector('#confirm-espionage');
    confirmBtn.addEventListener('click', () => this.confirmOperation());
  }

  async show(targetCountry, spyCountry, currentTurn) {
    this.targetCountry = targetCountry;
    this.spyCountry = spyCountry;
    this.currentTurn = currentTurn;

    // Atualizar nome do alvo
    this.modal.querySelector('#espionage-target-name').textContent = `Alvo: ${targetCountry.Pais}`;

    // Renderizar níveis de espionagem
    this.renderLevels();

    // Atualizar orçamento disponível
    const budget = espionageSystem.calculateBudget(spyCountry);
    this.modal.querySelector('#available-budget').textContent = formatCurrency(budget);

    // Calcular custos e chances iniciais
    this.updateCostAndChance();

    // Mostrar modal
    this.modal.classList.remove('hidden');

    // Resetar resultado
    this.modal.querySelector('#operation-result').classList.add('hidden');
  }

  hide() {
    this.modal.classList.add('hidden');
  }

  renderLevels() {
    const levelsContainer = this.modal.querySelector('#espionage-levels');
    const levels = espionageSystem.getLevels();

    levelsContainer.innerHTML = Object.entries(levels).map(([key, level]) => `
      <button
        class="espionage-level-btn text-left p-4 rounded-xl border transition ${
          key === this.selectedLevel
            ? 'border-brand-500 bg-brand-500/10'
            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
        }"
        data-level="${key}"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl">${level.icon}</span>
          <div class="flex-1">
            <h5 class="font-semibold text-slate-100 mb-1">${level.name}</h5>
            <p class="text-xs text-slate-400">${level.description}</p>
            <div class="mt-2 flex items-center gap-2 text-xs">
              <span class="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                Custo: ${level.costMultiplier}x
              </span>
              <span class="px-2 py-0.5 rounded-full ${
                level.successBaseChance >= 0.6 ? 'bg-green-500/20 text-green-400' :
                level.successBaseChance >= 0.4 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }">
                Base: ${Math.round(level.successBaseChance * 100)}%
              </span>
            </div>
          </div>
        </div>
      </button>
    `).join('');

    // Adicionar event listeners aos botões de nível
    levelsContainer.querySelectorAll('.espionage-level-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedLevel = e.currentTarget.dataset.level;
        this.renderLevels(); // Re-render para atualizar seleção
        this.updateCostAndChance();
      });
    });
  }

  updateCostAndChance() {
    if (!this.targetCountry || !this.spyCountry) return;

    // Calcular custo
    const cost = espionageSystem.calculateOperationCost(
      this.selectedLevel,
      this.selectedDuration,
      this.targetCountry
    );

    this.modal.querySelector('#operation-cost').textContent = formatCurrency(cost);

    // Calcular chance de sucesso
    const chance = espionageSystem.calculateSuccessChance(
      this.selectedLevel,
      this.spyCountry,
      this.targetCountry
    );

    const chancePercent = Math.round(chance * 100);
    const chanceEl = this.modal.querySelector('#success-chance');
    const chanceBar = this.modal.querySelector('#chance-bar');
    const chanceIndicator = this.modal.querySelector('#chance-indicator');

    chanceEl.textContent = `${chancePercent}%`;
    chanceBar.style.width = `${chancePercent}%`;

    // Atualizar cor e indicador
    if (chancePercent >= 70) {
      chanceEl.className = 'text-xl font-bold text-green-400';
      chanceBar.className = 'h-2 rounded-full bg-green-500 transition-all duration-300';
      chanceIndicator.textContent = 'Alta';
      chanceIndicator.className = 'text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400';
    } else if (chancePercent >= 40) {
      chanceEl.className = 'text-xl font-bold text-amber-400';
      chanceBar.className = 'h-2 rounded-full bg-amber-500 transition-all duration-300';
      chanceIndicator.textContent = 'Média';
      chanceIndicator.className = 'text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400';
    } else {
      chanceEl.className = 'text-xl font-bold text-red-400';
      chanceBar.className = 'h-2 rounded-full bg-red-500 transition-all duration-300';
      chanceIndicator.textContent = 'Baixa';
      chanceIndicator.className = 'text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400';
    }

    // Verificar se tem orçamento
    const budget = espionageSystem.calculateBudget(this.spyCountry);
    const confirmBtn = this.modal.querySelector('#confirm-espionage');
    confirmBtn.disabled = cost > budget;
  }

  async confirmOperation() {
    const confirmBtn = this.modal.querySelector('#confirm-espionage');
    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Processando...';

    // Iniciar operação
    const result = await espionageSystem.initiateOperation(
      this.spyCountry,
      this.targetCountry,
      this.selectedLevel,
      this.selectedDuration,
      this.currentTurn
    );

    // Mostrar resultado
    this.showResult(result);

    // Re-habilitar botão
    confirmBtn.disabled = false;
    confirmBtn.textContent = '🕵️ Iniciar Operação';
  }

  showResult(result) {
    const resultDiv = this.modal.querySelector('#operation-result');
    const icon = this.modal.querySelector('#result-icon');
    const title = this.modal.querySelector('#result-title');
    const message = this.modal.querySelector('#result-message');

    if (result.success && result.succeeded) {
      // Sucesso total
      resultDiv.className = 'mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30';
      icon.textContent = '✅';
      title.textContent = 'Operação Bem-Sucedida!';
      title.className = 'font-bold text-lg mb-1 text-green-400';

      let msg = `Sua operação de espionagem contra ${this.targetCountry.Pais} foi bem-sucedida! Você terá acesso às informações confidenciais pelos próximos ${this.selectedDuration} turnos.`;

      if (result.detected) {
        msg += ` ⚠️ No entanto, sua operação foi detectada pelo sistema de contra-espionagem deles.`;
      }

      message.textContent = msg;
      message.className = 'text-sm text-green-300';

    } else if (result.success && !result.succeeded) {
      // Falhou mas não teve erro
      resultDiv.className = 'mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30';
      icon.textContent = '❌';
      title.textContent = 'Operação Falhou';
      title.className = 'font-bold text-lg mb-1 text-red-400';

      let msg = `Sua tentativa de espionagem contra ${this.targetCountry.Pais} foi bloqueada. `;

      if (result.detected) {
        msg += `Pior ainda: sua operação foi detectada! Eles sabem que você tentou espiá-los.`;
      } else {
        msg += `Felizmente, não foram detectados agentes seus na operação.`;
      }

      message.textContent = msg;
      message.className = 'text-sm text-red-300';

    } else {
      // Erro
      resultDiv.className = 'mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30';
      icon.textContent = '⚠️';
      title.textContent = 'Erro';
      title.className = 'font-bold text-lg mb-1 text-amber-400';
      message.textContent = result.error || 'Ocorreu um erro ao processar a operação.';
      message.className = 'text-sm text-amber-300';
    }

    resultDiv.classList.remove('hidden');

    // Auto-fechar após 5 segundos se foi sucesso
    if (result.success) {
      setTimeout(() => {
        this.hide();
        // Recarregar página ou atualizar dados
        window.location.reload();
      }, 5000);
    }
  }
}

// Singleton
const espionageModal = new EspionageModal();
export default espionageModal;
