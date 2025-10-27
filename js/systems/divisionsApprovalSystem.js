/**
 * Sistema de Aprovação de Divisões
 * Permite que narradores aprovem ou rejeitem divisões criadas pelos jogadores
 */

import { db } from '../services/firebase.js';
import { showNotification, showConfirmBox } from '../utils.js';

let currentFilter = 'pending';
let allDivisions = [];

/**
 * Inicializa o sistema de aprovação de divisões
 */
export async function initDivisionsApprovalSystem(user) {
  console.log('🎖️ Inicializando sistema de aprovação de divisões');

  setupEventListeners();
  await loadAllDivisions();
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
  document.getElementById('filter-all-divisions')?.addEventListener('click', () => filterDivisions('all'));
  document.getElementById('filter-pending-divisions')?.addEventListener('click', () => filterDivisions('pending'));
  document.getElementById('filter-approved-divisions')?.addEventListener('click', () => filterDivisions('approved'));
  document.getElementById('filter-rejected-divisions')?.addEventListener('click', () => filterDivisions('rejected'));
}

/**
 * Carrega todas as divisões de todos os países
 */
async function loadAllDivisions() {
  try {
    const divisionsMap = [];

    // Buscar todos os inventários
    const inventoriesSnapshot = await db.collection('inventory').get();

    for (const doc of inventoriesSnapshot.docs) {
      const data = doc.data();
      const countryId = doc.id;
      const divisions = data.divisions || [];

      // Buscar informações do país
      const countryDoc = await db.collection('paises').doc(countryId).get();
      const countryData = countryDoc.exists ? countryDoc.data() : null;

      divisions.forEach(division => {
        divisionsMap.push({
          ...division,
          countryId,
          countryName: countryData?.Pais || countryId,
          countryFlag: countryData?.Flag || '🏳️'
        });
      });
    }

    allDivisions = divisionsMap;
    console.log(`✅ ${allDivisions.length} divisões carregadas`);

    // Atualizar badge
    updateBadge();

    // Renderizar com filtro atual
    filterDivisions(currentFilter);

  } catch (error) {
    console.error('Erro ao carregar divisões:', error);
    showNotification('error', 'Erro ao carregar divisões: ' + error.message);
  }
}

/**
 * Filtra divisões por status
 */
function filterDivisions(filter) {
  currentFilter = filter;

  // Atualizar botões de filtro
  document.querySelectorAll('[id^="filter-"]').forEach(btn => {
    btn.classList.remove('bg-brand-500', 'text-slate-900', 'border-brand-500');
    btn.classList.add('bg-slate-700/50');
  });

  const activeButton = document.getElementById(`filter-${filter}-divisions`);
  if (activeButton) {
    activeButton.classList.remove('bg-slate-700/50');
    activeButton.classList.add('bg-brand-500', 'text-slate-900');
  }

  // Filtrar divisões
  let filtered = allDivisions;
  if (filter !== 'all') {
    filtered = allDivisions.filter(d => (d.approvalStatus || 'approved') === filter);
  }

  renderDivisions(filtered);
}

/**
 * Renderiza a lista de divisões
 */
function renderDivisions(divisions) {
  const container = document.getElementById('divisions-approval-container');
  if (!container) return;

  if (divisions.length === 0) {
    container.innerHTML = `
      <div class="text-center py-16 rounded-xl bg-bg-soft border border-bg-ring/70">
        <div class="text-6xl mb-4">📭</div>
        <h3 class="text-xl font-semibold text-slate-200 mb-2">Nenhuma divisão encontrada</h3>
        <p class="text-slate-400">Não há divisões ${currentFilter === 'all' ? '' : currentFilter === 'pending' ? 'pendentes' : currentFilter === 'approved' ? 'aprovadas' : 'rejeitadas'} no momento</p>
      </div>
    `;
    return;
  }

  const html = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${divisions.map(division => renderDivisionCard(division)).join('')}
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Renderiza card de divisão
 */
function renderDivisionCard(division) {
  const status = division.approvalStatus || 'approved';
  const stats = division.calculatedStats || {};
  const combatStats = stats.combatStats || {};
  const manpower = stats.manpower || { total: 0 };

  let statusBadge = '';
  let actions = '';

  if (status === 'pending') {
    statusBadge = `<div class="absolute top-3 right-3 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">⏳ Pendente</div>`;
    actions = `
      <div class="flex gap-2 mt-4">
        <button onclick="window.approveDivision('${division.countryId}', '${division.id}')"
                class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold transition-all">
          ✅ Aprovar
        </button>
        <button onclick="window.rejectDivision('${division.countryId}', '${division.id}')"
                class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold transition-all">
          ❌ Rejeitar
        </button>
      </div>
    `;
  } else if (status === 'approved') {
    statusBadge = `<div class="absolute top-3 right-3 bg-green-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">✅ Aprovada</div>`;
  } else if (status === 'rejected') {
    statusBadge = `<div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">❌ Rejeitada</div>`;
    if (division.rejectionReason) {
      actions = `<div class="mt-3 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400"><strong>Motivo:</strong> ${division.rejectionReason}</div>`;
    }
  }

  return `
    <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 relative hover:border-brand-500/50 transition-colors">
      ${statusBadge}

      <div class="mb-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">${division.countryFlag}</span>
          <span class="text-xs text-slate-500">${division.countryName}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-100">${division.name}</h3>
        <span class="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
          ${division.trainingLevel || 'regular'}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm mb-3">
        <div class="bg-slate-800/50 rounded p-2">
          <p class="text-slate-500 text-xs">Manpower</p>
          <p class="font-bold text-slate-100">${manpower.total?.toLocaleString() || '0'}</p>
        </div>
        <div class="bg-slate-800/50 rounded p-2">
          <p class="text-slate-500 text-xs">Combat Width</p>
          <p class="font-bold text-slate-100">${combatStats.combatWidth || '0'}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div><span class="text-slate-500">Soft Attack:</span> <span class="text-red-400 font-semibold">${(combatStats.softAttack || 0).toFixed(1)}</span></div>
        <div><span class="text-slate-500">Hard Attack:</span> <span class="text-orange-400 font-semibold">${(combatStats.hardAttack || 0).toFixed(1)}</span></div>
        <div><span class="text-slate-500">Defense:</span> <span class="text-blue-400 font-semibold">${(combatStats.defense || 0).toFixed(1)}</span></div>
        <div><span class="text-slate-500">Organization:</span> <span class="text-cyan-400 font-semibold">${(combatStats.organization || 0).toFixed(1)}</span></div>
      </div>

      ${actions}
    </div>
  `;
}

/**
 * Aprova uma divisão
 */
export async function approveDivision(countryId, divisionId) {
  try {
    const confirm = await showConfirmBox(
      'Aprovar Divisão',
      'Deseja aprovar esta divisão?',
      'Aprovar',
      'Cancelar'
    );

    if (!confirm) return;

    const inventoryRef = db.collection('inventory').doc(countryId);
    const inventoryDoc = await inventoryRef.get();

    if (!inventoryDoc.exists) {
      throw new Error('Inventário não encontrado');
    }

    const data = inventoryDoc.data();
    const divisions = data.divisions || [];

    const divisionIndex = divisions.findIndex(d => d.id === divisionId);
    if (divisionIndex === -1) {
      throw new Error('Divisão não encontrada');
    }

    // Atualizar status
    divisions[divisionIndex].approvalStatus = 'approved';
    divisions[divisionIndex].approvedBy = auth.currentUser.uid;
    divisions[divisionIndex].approvedAt = new Date().toISOString();

    // Remover dados de rejeição se existirem
    delete divisions[divisionIndex].rejectedBy;
    delete divisions[divisionIndex].rejectedAt;
    delete divisions[divisionIndex].rejectionReason;

    await inventoryRef.update({ divisions });

    showNotification('success', '✅ Divisão aprovada com sucesso!');

    // Recarregar divisões
    await loadAllDivisions();

  } catch (error) {
    console.error('Erro ao aprovar divisão:', error);
    showNotification('error', 'Erro ao aprovar: ' + error.message);
  }
}

/**
 * Rejeita uma divisão
 */
export async function rejectDivision(countryId, divisionId) {
  try {
    // Pedir motivo da rejeição
    const reason = prompt('Por que você está rejeitando esta divisão?');
    if (!reason) return;

    const inventoryRef = db.collection('inventory').doc(countryId);
    const inventoryDoc = await inventoryRef.get();

    if (!inventoryDoc.exists) {
      throw new Error('Inventário não encontrado');
    }

    const data = inventoryDoc.data();
    const divisions = data.divisions || [];

    const divisionIndex = divisions.findIndex(d => d.id === divisionId);
    if (divisionIndex === -1) {
      throw new Error('Divisão não encontrada');
    }

    // Atualizar status
    divisions[divisionIndex].approvalStatus = 'rejected';
    divisions[divisionIndex].rejectedBy = auth.currentUser.uid;
    divisions[divisionIndex].rejectedAt = new Date().toISOString();
    divisions[divisionIndex].rejectionReason = reason;

    // Remover dados de aprovação se existirem
    delete divisions[divisionIndex].approvedBy;
    delete divisions[divisionIndex].approvedAt;

    await inventoryRef.update({ divisions });

    showNotification('success', '❌ Divisão rejeitada');

    // Recarregar divisões
    await loadAllDivisions();

  } catch (error) {
    console.error('Erro ao rejeitar divisão:', error);
    showNotification('error', 'Erro ao rejeitar: ' + error.message);
  }
}

/**
 * Atualiza o badge de divisões pendentes
 */
function updateBadge() {
  const pendingCount = allDivisions.filter(d => (d.approvalStatus || 'approved') === 'pending').length;
  const badge = document.getElementById('divisions-approval-badge');

  if (badge) {
    if (pendingCount > 0) {
      badge.textContent = pendingCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

// Exportar funções globalmente para uso nos botões HTML
if (typeof window !== 'undefined') {
  window.approveDivision = approveDivision;
  window.rejectDivision = rejectDivision;
}
