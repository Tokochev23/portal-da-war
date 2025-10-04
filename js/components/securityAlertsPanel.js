/**
 * Painel de Alertas de Segurança
 * Interface para visualizar e investigar ameaças de espionagem
 */

import securityAlertsSystem, { ALERT_SEVERITY } from '../systems/securityAlertsSystem.js';
import { formatCurrency } from '../utils.js';

export function renderSecurityAlertsPanel(country, agency, containerElement) {
  if (!containerElement || !country) return;

  // Calcular informações de contra-espionagem
  const counterIntel = parseFloat(country.CounterIntelligence || 0);
  const maxInvestment = 10; // Máximo 10%
  const budget = calculateBudget(country);
  const currentInvestment = (counterIntel / 100) * budget;

  const html = `
    <div class="space-y-6">
      <!-- Painel de Contra-Espionagem -->
      <div class="p-6 rounded-2xl border border-slate-700 bg-slate-800/40">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-3xl">🛡️</span>
          <div>
            <h4 class="text-lg font-bold text-slate-100">Contra-Espionagem</h4>
            <p class="text-xs text-slate-400">Proteja suas informações confidenciais</p>
          </div>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 rounded-lg bg-slate-900/50">
              <p class="text-xs text-slate-400 mb-1">Nível de Proteção</p>
              <p class="text-2xl font-bold ${counterIntel < 3 ? 'text-red-400' : counterIntel < 6 ? 'text-amber-400' : 'text-green-400'}">
                ${counterIntel < 3 ? '⚠️' : counterIntel < 6 ? '🟡' : '🟢'} ${counterIntel > 0 ? 'Baixa' : 'Nenhuma'}
              </p>
            </div>
            <div class="p-3 rounded-lg bg-slate-900/50">
              <p class="text-xs text-slate-400 mb-1">Investimento</p>
              <p class="text-2xl font-bold text-brand-400">${counterIntel}%</p>
              <p class="text-xs text-slate-500">${formatCurrency(currentInvestment)}/turno</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-200 mb-2 block">
              Investimento em Contra-Espionagem (0-${maxInvestment}%)
            </label>
            <input
              type="range"
              id="counter-intel-slider"
              min="0"
              max="${maxInvestment}"
              step="0.5"
              value="${counterIntel}"
              class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            >
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>0%</span>
              <span>5%</span>
              <span>${maxInvestment}%</span>
            </div>
          </div>

          <div id="counter-intel-preview" class="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
            <!-- Preview atualizado dinamicamente -->
          </div>

          <div class="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <h5 class="text-sm font-semibold text-blue-300 mb-2">Efeitos do Investimento:</h5>
            <ul class="space-y-1 text-xs text-blue-200">
              <li>• Reduz chance de espionagem bem-sucedida</li>
              <li>• Aumenta chance de detectar tentativas de espionagem</li>
              <li>• Informações vazadas podem ser falsas/desatualizadas</li>
            </ul>
          </div>

          <button id="save-counter-intel-btn" class="w-full px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition disabled:opacity-50" disabled>
            💾 Salvar Configuração
          </button>
        </div>
      </div>

      <!-- Alertas de Segurança -->
      <div class="p-6 rounded-2xl border border-slate-700 bg-slate-800/40">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🚨</span>
            <div>
              <h4 class="text-lg font-bold text-slate-100">Alertas de Segurança</h4>
              <p class="text-xs text-slate-400">Ameaças detectadas pela contra-espionagem</p>
            </div>
          </div>
          <button id="refresh-alerts-btn" class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition">
            🔄 Atualizar
          </button>
        </div>

      <!-- Alertas Pendentes -->
      <div id="pending-alerts-container">
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-semibold text-slate-200">⚠️ Alertas Ativos</h5>
          <span id="pending-count-badge" class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">0</span>
        </div>
        <div id="pending-alerts-list" class="space-y-3">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>

        <!-- Alertas Resolvidos -->
        <div id="resolved-alerts-container" class="mt-6">
          <div class="flex items-center justify-between mb-3">
            <h5 class="text-sm font-semibold text-slate-200">📊 Investigações Concluídas</h5>
            <span id="resolved-count-badge" class="px-2 py-0.5 rounded-full bg-slate-600 text-slate-300 text-xs font-bold">0</span>
          </div>
          <div id="resolved-alerts-list" class="space-y-3">
            <!-- Preenchido dinamicamente -->
          </div>
        </div>
      </div>
    </div>
  `;

  containerElement.innerHTML = html;

  // Attach listeners de contra-espionagem
  attachCounterIntelligenceListeners(country, budget, counterIntel);

  // Carregar alertas
  loadAlerts(country, agency);
}

// Calcular orçamento do país
function calculateBudget(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
  const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;
  return pibBruto * 0.25 * burocracia * estabilidade * 1.5;
}

// Listeners para contra-espionagem
function attachCounterIntelligenceListeners(country, budget, initialValue) {
  const slider = document.getElementById('counter-intel-slider');
  const preview = document.getElementById('counter-intel-preview');
  const saveBtn = document.getElementById('save-counter-intel-btn');

  if (!slider || !preview || !saveBtn) return;

  let currentValue = initialValue;

  // Atualizar preview
  function updatePreview(percent) {
    const investment = (percent / 100) * budget;
    const detectionBonus = percent * 5; // 0-50% de bônus de detecção
    const reductionBonus = percent * 3; // 0-30% de redução de sucesso

    let protectionLevel = 'Nenhuma';
    let protectionColor = 'text-red-400';
    if (percent >= 7) {
      protectionLevel = 'Alta';
      protectionColor = 'text-green-400';
    } else if (percent >= 4) {
      protectionLevel = 'Média';
      protectionColor = 'text-amber-400';
    } else if (percent > 0) {
      protectionLevel = 'Baixa';
      protectionColor = 'text-orange-400';
    }

    preview.innerHTML = `
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Investimento:</span>
          <span class="font-bold text-brand-400">${percent}% (${formatCurrency(investment)}/turno)</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Proteção:</span>
          <span class="font-bold ${protectionColor}">${protectionLevel}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Bônus de Detecção:</span>
          <span class="font-bold text-green-400">+${detectionBonus.toFixed(0)}%</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Redução de Sucesso Inimigo:</span>
          <span class="font-bold text-blue-400">-${reductionBonus.toFixed(0)}%</span>
        </div>
      </div>
    `;

    // Habilitar botão se mudou
    saveBtn.disabled = (percent === initialValue);
    currentValue = percent;
  }

  // Preview inicial
  updatePreview(initialValue);

  // Listener do slider
  slider.addEventListener('input', (e) => {
    updatePreview(parseFloat(e.target.value));
  });

  // Salvar configuração
  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = '💾 Salvando...';

    try {
      await window.db.collection('paises').doc(country.id).update({
        CounterIntelligence: currentValue,
        updatedAt: new Date().toISOString()
      });

      alert(`✅ Contra-espionagem atualizada para ${currentValue}%`);

      // Recarregar país
      if (window.reloadCurrentCountry) {
        await window.reloadCurrentCountry();
      }

    } catch (error) {
      console.error('Erro ao salvar contra-espionagem:', error);
      alert('❌ Erro ao salvar: ' + error.message);
    }

    saveBtn.disabled = false;
    saveBtn.textContent = '💾 Salvar Configuração';
  });
}

async function loadAlerts(country, agency) {
  const pendingList = document.getElementById('pending-alerts-list');
  const resolvedList = document.getElementById('resolved-alerts-list');
  const pendingBadge = document.getElementById('pending-count-badge');
  const resolvedBadge = document.getElementById('resolved-count-badge');

  if (!pendingList || !resolvedList) return;

  // Mostrar loading
  pendingList.innerHTML = '<p class="text-sm text-slate-400">⏳ Carregando alertas...</p>';
  resolvedList.innerHTML = '<p class="text-sm text-slate-400">⏳ Carregando...</p>';

  try {
    const allAlerts = await securityAlertsSystem.getAllCountryAlerts(country.id);

    const pending = allAlerts.filter(a => a.status === 'pending');
    const resolved = allAlerts.filter(a => a.status === 'resolved' || a.status === 'investigated');

    // Atualizar badges
    pendingBadge.textContent = pending.length;
    resolvedBadge.textContent = resolved.length;

    // Renderizar alertas pendentes
    if (pending.length === 0) {
      pendingList.innerHTML = `
        <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p class="text-sm text-emerald-300">✅ Nenhuma ameaça ativa detectada</p>
        </div>
      `;
    } else {
      pendingList.innerHTML = pending.map(alert => renderPendingAlert(alert, agency, country)).join('');
      attachInvestigateListeners(country, agency);
    }

    // Renderizar alertas resolvidos (mostrar últimos 5)
    const recentResolved = resolved.slice(0, 5);
    if (recentResolved.length === 0) {
      resolvedList.innerHTML = `
        <div class="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <p class="text-sm text-slate-400">Nenhuma investigação concluída ainda</p>
        </div>
      `;
    } else {
      resolvedList.innerHTML = recentResolved.map(alert => renderResolvedAlert(alert)).join('');
    }

  } catch (error) {
    console.error('Erro ao carregar alertas:', error);
    pendingList.innerHTML = '<p class="text-sm text-red-400">❌ Erro ao carregar alertas</p>';
  }

  // Refresh button
  const refreshBtn = document.getElementById('refresh-alerts-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadAlerts(country, agency));
  }
}

function renderPendingAlert(alert, agency, country) {
  const severity = ALERT_SEVERITY[alert.severity];
  const cost = securityAlertsSystem.calculateInvestigationCost(alert, country);

  return `
    <div class="p-4 rounded-xl border border-${severity.color}-500/30 bg-${severity.color}-500/10">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">${severity.icon}</span>
          <div>
            <h6 class="font-semibold text-slate-100">Espionagem Detectada</h6>
            <p class="text-xs text-slate-400">Turno #${alert.detectedTurn}</p>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded-full bg-${severity.color}-500/20 text-${severity.color}-400 text-xs font-bold">
          ${severity.name}
        </span>
      </div>

      <div class="space-y-2 mb-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Setor afetado:</span>
          <span class="text-slate-200 font-medium">${alert.sector}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Nível de exposição:</span>
          <span class="text-${severity.color}-400 font-medium">${alert.exposureLevel}%</span>
        </div>
      </div>

      <p class="text-xs text-slate-400 mb-3 p-2 bg-slate-900/50 rounded">
        Nossa contra-espionagem detectou atividade suspeita que pode indicar operação estrangeira em território nacional.
      </p>

      <div class="flex gap-2">
        <button
          class="investigate-btn flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition"
          data-alert-id="${alert.id}"
          data-cost="${cost}"
        >
          🔍 Investigar - ${formatCurrency(cost)}
        </button>
        <button class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition">
          Ignorar
        </button>
      </div>
    </div>
  `;
}

function renderResolvedAlert(alert) {
  const investigation = alert.investigation || {};
  const result = investigation.result;

  let icon = '✅';
  let title = 'Investigação Concluída';
  let colorClass = 'green';

  if (result === 'CRITICAL_FAILURE') {
    icon = '💥';
    title = 'Falha Crítica';
    colorClass = 'red';
  } else if (result === 'FAILURE') {
    icon = '❌';
    title = 'Falha';
    colorClass = 'red';
  } else if (result === 'PARTIAL') {
    icon = '⚠️';
    title = 'Sucesso Parcial';
    colorClass = 'amber';
  } else if (result === 'COMPLETE') {
    icon = '🎯';
    title = 'Sucesso Total';
    colorClass = 'green';
  }

  const revealed = alert.revealed || {};

  return `
    <div class="p-4 rounded-xl border border-${colorClass}-500/30 bg-${colorClass}-500/10">
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xl">${icon}</span>
          <div>
            <h6 class="font-semibold text-${colorClass}-300">${title}</h6>
            <p class="text-xs text-slate-400">Turno #${investigation.startedTurn || alert.detectedTurn}</p>
          </div>
        </div>
      </div>

      ${revealed.level === 'COMPLETE' ? `
        <div class="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700">
          <p class="text-sm font-semibold text-red-300 mb-2">🚨 ${revealed.spyCountry} identificado!</p>
          <div class="space-y-1 text-xs text-slate-400">
            <p>• Operativos: ${revealed.operativesCount}</p>
            <p>• Fase: ${revealed.phase}</p>
            <p>• Iniciado: Turno #${revealed.startedTurn}</p>
          </div>
          <div class="mt-3 flex gap-2">
            <button class="flex-1 px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition">
              📢 Denunciar
            </button>
            <button class="flex-1 px-3 py-1.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold transition">
              🔄 Virar Agentes
            </button>
          </div>
        </div>
      ` : revealed.level === 'PARTIAL' ? `
        <p class="text-xs text-amber-300 mt-2">${revealed.info}</p>
      ` : `
        <p class="text-xs text-slate-400 mt-2">Investigação inconclusiva</p>
      `}
    </div>
  `;
}

function attachInvestigateListeners(country, agency) {
  const investigateBtns = document.querySelectorAll('.investigate-btn');

  investigateBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const alertId = e.currentTarget.dataset.alertId;
      const cost = parseInt(e.currentTarget.dataset.cost);

      // Confirmar
      if (!confirm(`Investigar esta ameaça custará ${formatCurrency(cost)}. Confirmar?`)) {
        return;
      }

      btn.disabled = true;
      btn.textContent = '⏳ Investigando...';

      try {
        const currentTurn = window.appState?.currentTurn || 0;
        const result = await securityAlertsSystem.investigateAlert(alertId, agency, country, currentTurn);

        if (result.success) {
          // Mostrar resultado
          showInvestigationResult(result);

          // Recarregar alertas
          setTimeout(() => {
            loadAlerts(country, agency);
          }, 3000);
        } else {
          alert('Erro: ' + result.error);
          btn.disabled = false;
          btn.textContent = `🔍 Investigar - ${formatCurrency(cost)}`;
        }

      } catch (error) {
        console.error('Erro ao investigar:', error);
        alert('Erro ao processar investigação');
        btn.disabled = false;
        btn.textContent = `🔍 Investigar - ${formatCurrency(cost)}`;
      }
    });
  });
}

function showInvestigationResult(result) {
  const { roll, result: investigationResult, cost } = result;

  let message = `
🎲 Rolagem: ${roll.baseRoll} + ${roll.modifiers} = ${roll.finalRoll}

${investigationResult.message}

Custo: ${formatCurrency(cost)}
  `;

  if (investigationResult.revealed && investigationResult.revealed.spyCountry) {
    message += `\n\n🚨 PAÍS IDENTIFICADO: ${investigationResult.revealed.spyCountry}`;
  }

  alert(message);
}

export default { renderSecurityAlertsPanel };
