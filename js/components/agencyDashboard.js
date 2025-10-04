/**
 * Dashboard da Agência de Inteligência
 * Interface principal para gerenciar agência, tecnologias e operações
 */

import intelligenceAgencySystem from '../systems/intelligenceAgencySystem.js';
import researchSystem from '../systems/researchSystem.js';
import espionageOperationsSystem from '../systems/espionageOperationsSystem.js';
import { renderSecurityAlertsPanel } from './securityAlertsPanel.js';
import { formatCurrency } from '../utils.js';

// Helper para buscar todos os países
async function getAllCountries() {
  try {
    const snapshot = await window.db.collection('paises').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar países:', error);
    return [];
  }
}

export async function renderAgencyDashboard(country, containerElement) {
  if (!containerElement || !country) return;

  // Verificar se tem agência
  const agency = await intelligenceAgencySystem.getAgency(country.id);

  if (!agency) {
    // Não tem agência - mostrar botão para fundar
    containerElement.innerHTML = `
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">🕵️</span>
        <h3 class="text-2xl font-bold text-slate-100 mb-2">Agência de Inteligência</h3>
        <p class="text-slate-400 mb-6">Você ainda não possui uma agência de inteligência.</p>
        <button id="open-agency-foundation" class="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold transition">
          🕵️ Fundar Agência
        </button>
      </div>
    `;

    // Listener para abrir modal de fundação
    const btn = document.getElementById('open-agency-foundation');
    if (btn) {
      btn.addEventListener('click', () => {
        // Import dinâmico do modal
        import('./agencyFoundationModal.js').then(module => {
          const currentTurn = window.appState?.currentTurn || 0;
          module.default.show(country, currentTurn);
        });
      });
    }

    return;
  }

  // Tem agência - mostrar dashboard completo
  const html = `
    <div class="space-y-6">
      <!-- Header da Agência -->
      <div class="p-6 rounded-2xl border border-slate-700 bg-slate-800/40">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <span class="text-5xl">🕵️</span>
            <div>
              <h3 class="text-2xl font-bold text-slate-100">${agency.name}</h3>
              <p class="text-sm text-slate-400">${agency.focusName}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-3xl">${intelligenceAgencySystem.getTiers()[agency.tier].icon}</span>
              <span class="text-xl font-bold text-brand-400">${agency.tierName}</span>
            </div>
            <p class="text-xs text-slate-500">Fundada: Turno #${agency.foundedTurn}</p>
          </div>
        </div>

        <!-- Status -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition cursor-pointer" id="budget-card">
            <p class="text-xs text-slate-400 mb-1">Orçamento Anual</p>
            <p class="text-lg font-bold text-emerald-400">${formatCurrency(agency.budget)}</p>
            <p class="text-xs text-slate-500">${agency.budgetPercent}% do nacional</p>
            <button class="mt-2 text-xs text-brand-400 hover:text-brand-300 font-semibold">✏️ Alterar</button>
          </div>
          <div class="p-3 rounded-lg bg-slate-900/50">
            <p class="text-xs text-slate-400 mb-1">Tecnologias</p>
            <p class="text-lg font-bold text-cyan-400">${(agency.technologies || []).length}</p>
            <p class="text-xs text-slate-500">Desbloqueadas</p>
          </div>
          <div class="p-3 rounded-lg bg-slate-900/50">
            <p class="text-xs text-slate-400 mb-1">Operações Ativas</p>
            <p class="text-lg font-bold text-purple-400" id="active-ops-count">0</p>
            <p class="text-xs text-slate-500">Em andamento</p>
          </div>
          <div class="p-3 rounded-lg bg-slate-900/50">
            <p class="text-xs text-slate-400 mb-1">Operativos</p>
            <p class="text-lg font-bold text-blue-400">${agency.operatives || 0}</p>
            <p class="text-xs text-slate-500">Disponíveis</p>
          </div>
        </div>
      </div>

      <!-- Tabs de Navegação -->
      <div class="flex gap-2 border-b border-slate-700">
        <button class="agency-tab px-4 py-2 text-sm font-semibold transition border-b-2 border-brand-500 text-brand-400" data-tab="research">
          🔬 Pesquisa
        </button>
        <button class="agency-tab px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition border-b-2 border-transparent" data-tab="operations">
          🌍 Operações
        </button>
        <button class="agency-tab px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition border-b-2 border-transparent" data-tab="security">
          🛡️ Segurança
        </button>
      </div>

      <!-- Conteúdo das Tabs -->
      <div id="agency-tab-content">
        <!-- Preenchido dinamicamente -->
      </div>
    </div>
  `;

  containerElement.innerHTML = html;

  // Carregar contagem de operações
  loadOperationsCount(agency);

  // Renderizar tab inicial (Research)
  renderResearchTab(agency, country);

  // Attach listeners das tabs
  attachTabListeners(agency, country);

  // Attach listener do botão de alterar orçamento
  attachBudgetChangeListener(agency, country);
}

async function loadOperationsCount(agency) {
  const operations = await espionageOperationsSystem.getAgencyOperations(agency.id);
  const countEl = document.getElementById('active-ops-count');
  if (countEl) {
    countEl.textContent = operations.length;
  }
}

function attachTabListeners(agency, country) {
  const tabs = document.querySelectorAll('.agency-tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const targetTab = e.currentTarget.dataset.tab;

      // Atualizar visual das tabs
      tabs.forEach(t => {
        t.classList.remove('border-brand-500', 'text-brand-400');
        t.classList.add('border-transparent', 'text-slate-400');
      });
      e.currentTarget.classList.add('border-brand-500', 'text-brand-400');
      e.currentTarget.classList.remove('border-transparent', 'text-slate-400');

      // Renderizar conteúdo
      if (targetTab === 'research') {
        renderResearchTab(agency, country);
      } else if (targetTab === 'operations') {
        renderOperationsTab(agency, country);
      } else if (targetTab === 'security') {
        renderSecurityTab(agency, country);
      }
    });
  });
}

function renderResearchTab(agency, country) {
  const container = document.getElementById('agency-tab-content');
  if (!container) return;

  const currentResearch = agency.currentResearch;
  const availableTechs = researchSystem.getAvailableTechnologies(agency.technologies || [], country);

  let researchHtml = '';

  if (currentResearch && currentResearch.techId) {
    // Tem pesquisa em andamento
    const tech = researchSystem.getAllTechnologies()[currentResearch.techId];

    researchHtml = `
      <div class="p-4 rounded-xl border border-brand-500/30 bg-brand-500/10 mb-6">
        <h5 class="font-semibold text-brand-300 mb-2">🔬 Pesquisa em Andamento</h5>
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-lg font-bold text-slate-100">${tech.name}</p>
            <p class="text-sm text-slate-400 mb-2">${tech.description}</p>
            <div class="flex items-center gap-4 text-sm">
              <span class="text-slate-400">Progresso: <span class="text-brand-400 font-semibold">${currentResearch.progress || 0}%</span></span>
              <span class="text-slate-400">Tentativas: <span class="text-slate-300">${currentResearch.rollsAttempted || 0}</span></span>
            </div>
          </div>
          <button id="attempt-research-btn" class="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition">
            🎲 Tentar Pesquisa
          </button>
        </div>
      </div>
    `;
  }

  container.innerHTML = researchHtml + `
    <h5 class="text-sm font-semibold text-slate-200 mb-3">📚 Tecnologias Disponíveis</h5>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      ${availableTechs.map(tech => `
        <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
          <div class="flex items-start gap-3 mb-3">
            <span class="text-2xl">${tech.icon}</span>
            <div class="flex-1">
              <h6 class="font-semibold text-slate-100">${tech.name}</h6>
              <p class="text-xs text-slate-400">${tech.year} • ${tech.category.toUpperCase()}</p>
            </div>
          </div>
          <p class="text-xs text-slate-400 mb-3">${tech.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-500">Custo: ${formatCurrency(intelligenceAgencySystem.calculateCostByPIB(tech.baseCost, country))}</span>
            <button class="start-research-btn px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 text-xs font-semibold transition" data-tech-id="${tech.id}">
              Pesquisar
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    ${availableTechs.length === 0 ? '<p class="text-sm text-slate-400 text-center py-8">Nenhuma tecnologia disponível no momento. Desbloqueie pré-requisitos!</p>' : ''}
  `;

  // Attach listeners
  if (currentResearch) {
    attachAttemptResearchListener(agency, country);
  }
  attachStartResearchListeners(agency, country);
}

async function renderOperationsTab(agency, country) {
  const container = document.getElementById('agency-tab-content');
  if (!container) return;

  // Mostrar loading
  container.innerHTML = `
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-3"></div>
      <p class="text-sm text-slate-400">Carregando operações...</p>
    </div>
  `;

  try {
    // Buscar operações ativas
    const operations = await espionageOperationsSystem.getAgencyOperations(agency.id);

    // Buscar todos os países para o seletor
    const allCountries = await getAllCountries();
    const targetCountries = allCountries.filter(c => c.id !== country.id); // Excluir próprio país

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Botão Iniciar Nova Operação -->
        <div class="flex justify-between items-center">
          <div>
            <h5 class="text-lg font-semibold text-slate-200">🌍 Operações Ativas</h5>
            <p class="text-xs text-slate-400">${operations.length} operação(ões) em andamento</p>
          </div>
          <button id="start-new-operation-btn" class="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition">
            + Nova Operação
          </button>
        </div>

        <!-- Lista de Operações Ativas -->
        <div id="operations-list" class="space-y-3">
          ${operations.length === 0 ? `
            <div class="text-center py-12 border border-dashed border-slate-700 rounded-xl">
              <span class="text-4xl mb-3 block">🕵️</span>
              <p class="text-slate-400">Nenhuma operação ativa</p>
              <p class="text-xs text-slate-500 mt-2">Inicie uma nova operação de infiltração</p>
            </div>
          ` : operations.map(op => renderOperationCard(op, allCountries)).join('')}
        </div>

        <!-- Modal de Nova Operação (oculto) -->
        <div id="new-operation-modal" class="hidden fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4 p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xl font-bold text-slate-100">🌍 Iniciar Nova Operação</h4>
              <button id="close-operation-modal" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-semibold text-slate-200 mb-2 block">País Alvo</label>
                <select id="target-country-select" class="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100">
                  <option value="">Selecione um país...</option>
                  ${targetCountries.map(c => `
                    <option value="${c.id}">${c.Pais}</option>
                  `).join('')}
                </select>
              </div>

              <div id="target-country-info" class="hidden p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <!-- Info do país alvo será preenchida -->
              </div>

              <div class="flex gap-3">
                <button id="cancel-operation-btn" class="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
                  Cancelar
                </button>
                <button id="confirm-operation-btn" disabled class="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Iniciar Infiltração
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach listeners
    attachOperationsListeners(agency, country, targetCountries);

  } catch (error) {
    console.error('Erro ao carregar operações:', error);
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-4xl text-red-400 mb-4 block">❌</span>
        <p class="text-red-300">Erro ao carregar operações</p>
        <p class="text-sm text-slate-400 mt-2">${error.message}</p>
      </div>
    `;
  }
}

function renderOperationCard(operation, allCountries) {
  const targetCountry = allCountries.find(c => c.id === operation.targetCountryId);
  const phases = espionageOperationsSystem.getPhases();
  const currentPhase = operation.phase || 1;
  const phaseName = phases[currentPhase]?.name || 'Fase Desconhecida';
  const phaseIcon = phases[currentPhase]?.icon || '❓';

  return `
    <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h6 class="font-semibold text-slate-100">${targetCountry?.Pais || 'País Desconhecido'}</h6>
          <p class="text-xs text-slate-400">Iniciado: Turno #${operation.startedTurn}</p>
        </div>
        <span class="px-2 py-1 rounded text-xs font-semibold ${operation.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
          ${operation.active ? 'Ativa' : 'Inativa'}
        </span>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">${phaseIcon}</span>
        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-200">Fase ${currentPhase}/4: ${phaseName}</p>
          <div class="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div class="bg-brand-500 h-2 rounded-full transition-all" style="width: ${(currentPhase / 4) * 100}%"></div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs">
        <span class="text-slate-400">Intel: <span class="text-brand-400 font-semibold">${operation.intelLevel || 0}%</span></span>
        <span class="text-slate-400">Detecção: <span class="${operation.detectionRisk > 50 ? 'text-red-400' : 'text-green-400'} font-semibold">${operation.detectionRisk || 0}%</span></span>
      </div>
    </div>
  `;
}

function attachOperationsListeners(agency, country, targetCountries) {
  const startBtn = document.getElementById('start-new-operation-btn');
  const modal = document.getElementById('new-operation-modal');
  const closeBtn = document.getElementById('close-operation-modal');
  const cancelBtn = document.getElementById('cancel-operation-btn');
  const confirmBtn = document.getElementById('confirm-operation-btn');
  const targetSelect = document.getElementById('target-country-select');
  const targetInfo = document.getElementById('target-country-info');

  // Abrir modal
  startBtn?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
  });

  // Fechar modal
  closeBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  cancelBtn?.addEventListener('click', () => {
    modal?.classList.add('hidden');
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  // Seleção de país alvo
  targetSelect?.addEventListener('change', (e) => {
    const selectedCountryId = e.target.value;

    if (selectedCountryId) {
      const selectedCountry = targetCountries.find(c => c.id === selectedCountryId);

      if (selectedCountry) {
        targetInfo.classList.remove('hidden');
        targetInfo.innerHTML = `
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">${selectedCountry.Bandeira || '🏴'}</span>
            <div>
              <h6 class="font-semibold text-slate-100">${selectedCountry.Pais}</h6>
              <p class="text-xs text-slate-400">Counter-Intel: ${selectedCountry.CounterIntelligence || 0}</p>
            </div>
          </div>
          <p class="text-xs text-slate-400">
            A infiltração terá 4 fases progressivas. Cada fase aumenta o nível de intel desbloqueado.
          </p>
        `;

        confirmBtn.disabled = false;
      }
    } else {
      targetInfo.classList.add('hidden');
      confirmBtn.disabled = true;
    }
  });

  // Confirmar operação
  confirmBtn?.addEventListener('click', async () => {
    const selectedCountryId = targetSelect.value;
    if (!selectedCountryId) return;

    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Iniciando...';

    try {
      const currentTurn = window.appState?.currentTurn || 0;
      const selectedCountry = targetCountries.find(c => c.id === selectedCountryId);

      const result = await espionageOperationsSystem.initiateOperation(
        agency,
        selectedCountry,
        country,
        4, // duração inicial
        currentTurn
      );

      if (result.success) {
        alert('Operação iniciada com sucesso!');
        modal.classList.add('hidden');

        // Recarregar tab de operações
        renderOperationsTab(agency, country);
      } else {
        alert('Erro: ' + result.error);
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Iniciar Infiltração';
      }

    } catch (error) {
      console.error('Erro ao iniciar operação:', error);
      alert('Erro ao processar operação');
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Iniciar Infiltração';
    }
  });
}

function renderSecurityTab(agency, country) {
  const container = document.getElementById('agency-tab-content');
  if (!container) return;

  container.innerHTML = '<div id="security-alerts-container"></div>';

  const securityContainer = document.getElementById('security-alerts-container');
  if (securityContainer) {
    renderSecurityAlertsPanel(country, agency, securityContainer);
  }
}

function attachAttemptResearchListener(agency, country) {
  const btn = document.getElementById('attempt-research-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = '🎲 Rolando...';

    try {
      const currentTurn = window.appState?.currentTurn || 0;
      const result = await researchSystem.attemptResearch(agency.id, country, currentTurn);

      if (result.success) {
        showResearchResult(result);

        // Recarregar dashboard
        setTimeout(() => {
          const dashboardContainer = document.getElementById('agency-dashboard-container');
          if (dashboardContainer) {
            renderAgencyDashboard(country, dashboardContainer);
          }
        }, 2000);
      } else {
        alert('Erro: ' + result.error);
      }

    } catch (error) {
      console.error('Erro ao tentar pesquisa:', error);
      alert('Erro ao processar pesquisa');
    }

    btn.disabled = false;
    btn.textContent = '🎲 Tentar Pesquisa';
  });
}

function attachStartResearchListeners(agency, country) {
  const btns = document.querySelectorAll('.start-research-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const techId = e.currentTarget.dataset.techId;

      if (!confirm('Iniciar pesquisa desta tecnologia?')) return;

      btn.disabled = true;
      btn.textContent = 'Iniciando...';

      try {
        const currentTurn = window.appState?.currentTurn || 0;
        const result = await researchSystem.startResearch(agency.id, techId, country, currentTurn);

        if (result.success) {
          alert(`Pesquisa iniciada: ${result.tech.name}\nCusto: ${formatCurrency(result.cost)}`);

          // Recarregar dados do país para atualizar orçamento
          if (window.reloadCurrentCountry) {
            const updatedCountry = await window.reloadCurrentCountry();
            if (updatedCountry) {
              country = updatedCountry;
            }
          }

          // Recarregar dashboard com dados atualizados
          const dashboardContainer = document.getElementById('intelligence-dashboard-container');
          if (dashboardContainer) {
            renderAgencyDashboard(country, dashboardContainer);
          }
        } else {
          alert('Erro: ' + result.error);
        }

      } catch (error) {
        console.error('Erro ao iniciar pesquisa:', error);
        alert('Erro ao processar');
      }

      btn.disabled = false;
      btn.textContent = 'Pesquisar';
    });
  });
}

function showResearchResult(result) {
  const { roll, result: researchResult, tech } = result;

  let message = `
🎲 Rolagem: ${roll.baseRoll} + ${roll.modifiers} = ${roll.finalRoll}

${researchResult.icon} ${researchResult.message}
  `;

  if (researchResult.unlocked) {
    message += `\n\n✅ ${tech.name} desbloqueada!`;
  }

  alert(message);
}

function attachBudgetChangeListener(agency, country) {
  const budgetCard = document.getElementById('budget-card');
  if (!budgetCard) return;

  budgetCard.addEventListener('click', () => {
    showBudgetChangeModal(agency, country);
  });
}

async function showBudgetChangeModal(agency, country) {
  // Calcular orçamento nacional disponível
  const nationalBudget = intelligenceAgencySystem.calculateBudget(country);
  const currentPercent = agency.budgetPercent;
  const tiers = intelligenceAgencySystem.getTiers();

  // Criar modal
  const modalHTML = `
    <div id="budget-change-modal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xl font-bold text-slate-100">💰 Alterar Orçamento da Agência</h4>
          <button id="close-budget-modal" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p class="text-sm text-slate-300 mb-2">Orçamento Nacional Disponível</p>
            <p class="text-2xl font-bold text-emerald-400">${formatCurrency(nationalBudget)}</p>
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-200 mb-2 block">Percentual do Orçamento Nacional</label>
            <input
              type="range"
              id="budget-slider"
              min="0.5"
              max="15"
              step="0.5"
              value="${currentPercent}"
              class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            >
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>0.5%</span>
              <span>15%</span>
            </div>
          </div>

          <div id="budget-preview" class="p-4 rounded-lg border border-slate-600 bg-slate-800/30">
            <!-- Preenchido dinamicamente -->
          </div>

          <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p class="text-xs text-amber-300">⚠️ Alterar o orçamento pode mudar o tier da agência, afetando suas capacidades.</p>
          </div>

          <div class="flex gap-3">
            <button id="cancel-budget-btn" class="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
              Cancelar
            </button>
            <button id="confirm-budget-btn" class="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition">
              Confirmar Alteração
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Adicionar modal ao body
  const modalDiv = document.createElement('div');
  modalDiv.innerHTML = modalHTML;
  document.body.appendChild(modalDiv);

  // Elementos
  const modal = document.getElementById('budget-change-modal');
  const slider = document.getElementById('budget-slider');
  const preview = document.getElementById('budget-preview');
  const closeBtn = document.getElementById('close-budget-modal');
  const cancelBtn = document.getElementById('cancel-budget-btn');
  const confirmBtn = document.getElementById('confirm-budget-btn');

  // Função para atualizar preview
  function updatePreview(percent) {
    const newBudget = Math.round(nationalBudget * (percent / 100));
    const newTier = intelligenceAgencySystem.calculateTier(percent);
    const tierInfo = tiers[newTier];

    preview.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Percentual</span>
          <span class="text-lg font-bold text-brand-400">${percent}%</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Novo Orçamento</span>
          <span class="text-lg font-bold text-emerald-400">${formatCurrency(newBudget)}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Tier</span>
          <span class="text-lg font-bold">${tierInfo.icon} ${tierInfo.name}</span>
        </div>
        ${newTier !== agency.tier ? `
          <div class="pt-2 border-t border-slate-700">
            <p class="text-xs ${newTier > agency.tier ? 'text-green-400' : 'text-red-400'}">
              ${newTier > agency.tier ? '⬆️ Upgrade' : '⬇️ Downgrade'} de tier:
              ${tiers[agency.tier].name} → ${tierInfo.name}
            </p>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Atualizar preview inicial
  updatePreview(currentPercent);

  // Listener do slider
  slider.addEventListener('input', (e) => {
    updatePreview(parseFloat(e.target.value));
  });

  // Fechar modal
  const closeModal = () => {
    modal.remove();
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Confirmar alteração
  confirmBtn.addEventListener('click', async () => {
    const newPercent = parseFloat(slider.value);
    const newBudget = Math.round(nationalBudget * (newPercent / 100));
    const newTier = intelligenceAgencySystem.calculateTier(newPercent);

    confirmBtn.disabled = true;
    confirmBtn.textContent = '⏳ Atualizando...';

    try {
      // Atualizar no Firebase
      await db.collection('agencies').doc(agency.id).update({
        budgetPercent: newPercent,
        budget: newBudget,
        tier: newTier,
        tierName: tiers[newTier].name,
        updatedAt: new Date().toISOString()
      });

      // Atualizar AgencyBudgetSpent no país
      const budgetDiff = newBudget - agency.budget;
      const currentAgencySpent = parseFloat(country.AgencyBudgetSpent || 0);

      await db.collection('paises').doc(country.id).update({
        AgencyBudgetSpent: currentAgencySpent + budgetDiff
      });

      alert(`Orçamento atualizado com sucesso!\n\nNovo orçamento: ${formatCurrency(newBudget)} (${newPercent}%)`);

      closeModal();

      // Recarregar dashboard
      if (window.reloadCurrentCountry) {
        const updatedCountry = await window.reloadCurrentCountry();
        if (updatedCountry) {
          const dashboardContainer = document.getElementById('intelligence-dashboard-container');
          if (dashboardContainer) {
            renderAgencyDashboard(updatedCountry, dashboardContainer);
          }
        }
      }

    } catch (error) {
      console.error('Erro ao atualizar orçamento:', error);
      alert('Erro ao atualizar orçamento: ' + error.message);
      confirmBtn.disabled = false;
      confirmBtn.textContent = 'Confirmar Alteração';
    }
  });
}

export default { renderAgencyDashboard };
