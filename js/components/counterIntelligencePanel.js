/**
 * Painel de Contra-Espionagem
 * Gerencia a segurança e contra-inteligência do país do jogador
 */

import espionageSystem from '../systems/espionageSystem.js';
import { formatCurrency } from '../utils.js';

export function renderCounterIntelligencePanel(country, containerElement) {
  if (!country || !containerElement) return;

  const counterIntel = parseFloat(country.CounterIntelligence) || 0;
  const budget = espionageSystem.calculateBudget(country);
  const counterIntelCost = budget * (counterIntel / 100);

  // Determinar nível de proteção
  let protectionLevel, protectionColor, protectionIcon;
  if (counterIntel >= 6) {
    protectionLevel = 'Alta';
    protectionColor = 'green';
    protectionIcon = '🛡️';
  } else if (counterIntel >= 3) {
    protectionLevel = 'Média';
    protectionColor = 'amber';
    protectionIcon = '🔒';
  } else {
    protectionLevel = 'Baixa';
    protectionColor = 'red';
    protectionIcon = '⚠️';
  }

  const html = `
    <div class="mt-6 p-5 rounded-2xl border border-slate-700 bg-slate-800/40">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🛡️</span>
          <div>
            <h4 class="text-lg font-bold text-slate-100">Contra-Espionagem</h4>
            <p class="text-xs text-slate-400">Proteja suas informações confidenciais</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs text-slate-400">Nível de Proteção</p>
          <div class="flex items-center gap-1 text-${protectionColor}-400">
            <span class="text-xl">${protectionIcon}</span>
            <span class="font-bold text-lg">${protectionLevel}</span>
          </div>
        </div>
      </div>

      <!-- Barra de investimento -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <label for="counter-intel-slider" class="text-sm font-medium text-slate-300">
            Investimento: <span id="counter-intel-value" class="text-brand-400 font-bold">${counterIntel}%</span> do orçamento
          </label>
          <span id="counter-intel-cost" class="text-sm text-slate-400">${formatCurrency(counterIntelCost)}/turno</span>
        </div>

        <input
          type="range"
          id="counter-intel-slider"
          min="0"
          max="10"
          step="0.5"
          value="${counterIntel}"
          class="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />

        <div class="flex justify-between text-xs text-slate-500 mt-1">
          <span>0%</span>
          <span>5%</span>
          <span>10%</span>
        </div>
      </div>

      <!-- Info sobre efeitos -->
      <div class="mb-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700">
        <p class="text-xs font-semibold text-slate-300 mb-2">Efeitos do Investimento:</p>
        <ul class="space-y-1.5 text-xs text-slate-400">
          <li class="flex items-start gap-2">
            <span class="text-${protectionColor}-400 mt-0.5">●</span>
            <span>Reduz <strong class="text-${protectionColor}-400">${Math.round(counterIntel * 30)}%</strong> a chance de espionagem bem-sucedida</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-${protectionColor}-400 mt-0.5">●</span>
            <span>Chance de <strong class="text-${protectionColor}-400">${Math.round(counterIntel * 5)}%</strong> de detectar tentativas de espionagem</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-${protectionColor}-400 mt-0.5">●</span>
            <span>Informações vazadas podem ser falsas/desatualizadas</span>
          </li>
        </ul>
      </div>

      <!-- Tentativas detectadas -->
      <div id="detected-attempts-container" class="mb-4">
        <p class="text-xs font-semibold text-slate-300 mb-2">🔍 Tentativas Recentes Detectadas</p>
        <div id="detected-attempts-list" class="space-y-2">
          <!-- Será preenchido dinamicamente -->
        </div>
      </div>

      <!-- Botões -->
      <div class="flex gap-2">
        <button
          id="save-counter-intel"
          class="flex-1 rounded-xl border border-brand-500/30 bg-brand-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-brand-400 transition"
        >
          💾 Salvar Configuração
        </button>
        <button
          id="refresh-attempts"
          class="rounded-xl border border-slate-600 bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-600 transition"
        >
          🔄
        </button>
      </div>

      <!-- Feedback -->
      <div id="counter-intel-feedback" class="hidden mt-3 p-3 rounded-lg">
        <p id="counter-intel-feedback-text" class="text-sm"></p>
      </div>
    </div>
  `;

  containerElement.innerHTML = html;

  // Adicionar event listeners
  attachCounterIntelListeners(country);

  // Carregar tentativas detectadas
  loadDetectedAttempts(country.id);
}

function attachCounterIntelListeners(country) {
  const slider = document.getElementById('counter-intel-slider');
  const valueDisplay = document.getElementById('counter-intel-value');
  const costDisplay = document.getElementById('counter-intel-cost');
  const saveBtn = document.getElementById('save-counter-intel');
  const refreshBtn = document.getElementById('refresh-attempts');

  if (!slider || !valueDisplay || !costDisplay || !saveBtn) return;

  // Atualizar displays quando slider muda
  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    valueDisplay.textContent = `${value}%`;

    const budget = espionageSystem.calculateBudget(country);
    const cost = budget * (value / 100);
    costDisplay.textContent = `${formatCurrency(cost)}/turno`;
  });

  // Salvar configuração
  saveBtn.addEventListener('click', async () => {
    const newValue = parseFloat(slider.value);

    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Salvando...';

    const result = await espionageSystem.updateCounterIntelligence(country.id, newValue);

    const feedback = document.getElementById('counter-intel-feedback');
    const feedbackText = document.getElementById('counter-intel-feedback-text');

    if (result.success) {
      feedback.className = 'mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30';
      feedbackText.className = 'text-sm text-green-300';
      feedbackText.textContent = `✅ Configuração salva! Nível de contra-espionagem: ${result.newValue}%`;

      // Atualizar país local
      country.CounterIntelligence = result.newValue;

      // Re-renderizar painel para atualizar cores/textos
      setTimeout(() => {
        const container = document.getElementById('counter-intel-container');
        if (container) {
          renderCounterIntelligencePanel(country, container);
        }
      }, 2000);

    } else {
      feedback.className = 'mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30';
      feedbackText.className = 'text-sm text-red-300';
      feedbackText.textContent = `❌ Erro ao salvar: ${result.error}`;
    }

    feedback.classList.remove('hidden');
    saveBtn.disabled = false;
    saveBtn.textContent = '💾 Salvar Configuração';

    // Esconder feedback após 5 segundos
    setTimeout(() => {
      feedback.classList.add('hidden');
    }, 5000);
  });

  // Refresh de tentativas
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      loadDetectedAttempts(country.id);
    });
  }
}

async function loadDetectedAttempts(countryId) {
  const listContainer = document.getElementById('detected-attempts-list');
  if (!listContainer) return;

  listContainer.innerHTML = '<p class="text-xs text-slate-400">⏳ Carregando...</p>';

  try {
    const attempts = await espionageSystem.getSpyingAttempts(countryId);

    if (attempts.length === 0) {
      listContainer.innerHTML = `
        <div class="p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-center">
          <p class="text-xs text-slate-400">✅ Nenhuma tentativa detectada recentemente</p>
        </div>
      `;
      return;
    }

    // Ordenar por mais recente
    attempts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Mostrar apenas as 5 mais recentes
    const recentAttempts = attempts.slice(0, 5);

    listContainer.innerHTML = recentAttempts.map(attempt => {
      const isBlocked = !attempt.succeeded;
      const icon = isBlocked ? '🛡️' : '⚠️';
      const statusText = isBlocked ? 'BLOQUEADO' : 'SUCESSO';
      const statusColor = isBlocked ? 'green' : 'red';
      const turnsAgo = Math.max(0, attempt.startTurn);

      return `
        <div class="p-3 rounded-lg bg-slate-900/50 border border-${statusColor}-500/30">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span>${icon}</span>
              <span class="text-sm font-semibold text-slate-200">${attempt.spyCountryName}</span>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full bg-${statusColor}-500/20 text-${statusColor}-400 font-medium">
              ${statusText}
            </span>
          </div>
          <p class="text-xs text-slate-400">
            Nível: ${ESPIONAGE_LEVELS[attempt.level]?.name || attempt.level} •
            Turno ${attempt.startTurn}
            ${attempt.active ? ` • Válido até turno ${attempt.validUntilTurn}` : ''}
          </p>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error('Erro ao carregar tentativas:', error);
    listContainer.innerHTML = `
      <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
        <p class="text-xs text-red-300">❌ Erro ao carregar tentativas</p>
      </div>
    `;
  }
}

// Helper para níveis (duplicado do espionageSystem para evitar importação circular)
const ESPIONAGE_LEVELS = {
  basic: { name: 'Básica' },
  intermediate: { name: 'Intermediária' },
  total: { name: 'Total' }
};

export default { renderCounterIntelligencePanel };
