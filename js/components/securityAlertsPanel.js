/**
 * Painel de Alertas de Segurança
 * Interface para visualizar e investigar ameaças de espionagem
 */

import securityAlertsSystem, { ALERT_SEVERITY } from '../systems/securityAlertsSystem.js';
import { formatCurrency } from '../utils.js';

export function renderSecurityAlertsPanel(country, agency, containerElement) {
  if (!containerElement || !country) return;

  const html = `
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
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
  `;

  containerElement.innerHTML = html;
  loadAlerts(country, agency);
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
