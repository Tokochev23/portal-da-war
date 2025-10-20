/**
 * @file divisionsManager.js
 * @description Gerenciador de listagem e operações CRUD para divisões - War1954
 */

import { training_levels } from './data/division-components/training_levels.js';
import { showNotification, showConfirmBox } from './utils.js';

let currentUser = null;
let currentUserCountry = null;
let allDivisions = [];

/**
 * Inicializa o Divisions Manager
 */
export async function initDivisionsManager(user) {
  try {
    console.log('🎖️ Inicializando Divisions Manager...');

    currentUser = user;

    // Carregar dados do país
    await loadUserCountry();

    // Carregar divisões
    await loadDivisions();

    // Setup event listeners
    setupEventListeners();

    // Esconder loading
    hideLoadingScreen();

    console.log('✅ Divisions Manager inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar Divisions Manager:', error);
    showNotification('error', 'Erro ao carregar divisões: ' + error.message);
  }
}

/**
 * Carrega dados do país
 */
async function loadUserCountry() {
  try {
    const { checkPlayerCountry, getCountryData } = await import('./services/firebase.js');
    const paisId = await checkPlayerCountry(currentUser.uid);

    if (!paisId) {
      throw new Error('Usuário não está vinculado a um país');
    }

    currentUserCountry = await getCountryData(paisId);
    currentUserCountry.id = paisId;

    console.log(`✅ País carregado: ${currentUserCountry.Pais}`);
  } catch (error) {
    console.error('Erro ao carregar país:', error);
    throw error;
  }
}

/**
 * Carrega todas as divisões do país
 */
async function loadDivisions() {
  try {
    const { collection, query, where, getDocs, orderBy } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const divisionsRef = collection(window.db, 'divisions');
    const q = query(
      divisionsRef,
      where('countryId', '==', currentUserCountry.id),
      orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    allDivisions = [];

    snapshot.forEach(doc => {
      allDivisions.push({ id: doc.id, ...doc.data() });
    });

    renderDivisions(allDivisions);

  } catch (error) {
    console.error('Erro ao carregar divisões:', error);
    showNotification('error', 'Erro ao carregar divisões: ' + error.message);
  }
}

/**
 * Renderiza a lista de divisões
 */
function renderDivisions(divisions) {
  const container = document.getElementById('divisions-container');
  const emptyState = document.getElementById('empty-state');

  if (divisions.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  container.innerHTML = divisions.map(division => `
    <div class="division-card bg-bg-soft border border-bg-ring rounded-xl p-6 hover:border-brand-500 cursor-pointer" data-division-id="${division.id}">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-slate-100 mb-1">${division.name}</h3>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded ${getTrainingBadgeColor(division.trainingLevel)}">
              ${training_levels[division.trainingLevel]?.icon || '🎖️'} ${training_levels[division.trainingLevel]?.name || division.trainingLevel}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="window.editDivision('${division.id}')" class="p-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors" title="Editar">
            ✏️
          </button>
          <button onclick="window.duplicateDivision('${division.id}')" class="p-2 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors" title="Duplicar">
            📋
          </button>
          <button onclick="window.deleteDivision('${division.id}')" class="p-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors" title="Deletar">
            🗑️
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm mb-4">
        <div class="bg-bg rounded p-3">
          <p class="text-slate-500 text-xs">Manpower Total</p>
          <p class="font-bold text-slate-100">${division.calculatedStats?.manpower.total.toLocaleString() || '0'}</p>
        </div>
        <div class="bg-bg rounded p-3">
          <p class="text-slate-500 text-xs">Combat Width</p>
          <p class="font-bold text-slate-100">${division.calculatedStats?.combatStats.combatWidth || '0'}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs mb-4">
        <div><span class="text-slate-500">Soft Attack:</span> <span class="text-red-400 font-bold">${division.calculatedStats?.combatStats.softAttack.toFixed(1) || '0'}</span></div>
        <div><span class="text-slate-500">Hard Attack:</span> <span class="text-orange-400 font-bold">${division.calculatedStats?.combatStats.hardAttack.toFixed(1) || '0'}</span></div>
        <div><span class="text-slate-500">Defense:</span> <span class="text-blue-400 font-bold">${division.calculatedStats?.combatStats.defense.toFixed(1) || '0'}</span></div>
        <div><span class="text-slate-500">Organization:</span> <span class="text-cyan-400 font-bold">${division.calculatedStats?.combatStats.organization.toFixed(1) || '0'}</span></div>
      </div>

      <div class="border-t border-bg-ring pt-3 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span class="font-medium">Combate:</span> ${division.combatUnits?.length || 0}/25
          <span class="ml-2 font-medium">Suporte:</span> ${division.supportUnits?.length || 0}/5
        </div>
        <div>
          ${division.updatedAt ? formatDate(division.updatedAt) : 'Nova'}
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Retorna a classe CSS para o badge de treinamento
 */
function getTrainingBadgeColor(level) {
  const colors = {
    conscript: 'bg-slate-600 text-slate-200',
    regular: 'bg-blue-600 text-blue-100',
    elite: 'bg-yellow-600 text-yellow-100'
  };
  return colors[level] || 'bg-slate-600 text-slate-200';
}

/**
 * Formata data do Firestore
 */
function formatDate(timestamp) {
  if (!timestamp) return '';

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 1000 / 60 / 60);

    if (hours < 1) return 'Agora mesmo';
    if (hours < 24) return `${hours}h atrás`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d atrás`;

    return date.toLocaleDateString('pt-BR');
  } catch (e) {
    return '';
  }
}

/**
 * Edita uma divisão
 */
window.editDivision = function(divisionId) {
  window.location.href = `criador-divisoes.html?id=${divisionId}`;
};

/**
 * Duplica uma divisão
 */
window.duplicateDivision = async function(divisionId) {
  try {
    const { doc, getDoc, collection, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const divisionRef = doc(window.db, 'divisions', divisionId);
    const divisionDoc = await getDoc(divisionRef);

    if (!divisionDoc.exists()) {
      showNotification('error', 'Divisão não encontrada');
      return;
    }

    const division = divisionDoc.data();

    // Criar nova divisão
    const newDivisionRef = doc(collection(window.db, 'divisions'));

    await setDoc(newDivisionRef, {
      ...division,
      id: newDivisionRef.id,
      name: division.name + ' (Cópia)',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    showNotification('success', '✅ Divisão duplicada!');
    await loadDivisions();

  } catch (error) {
    console.error('Erro ao duplicar divisão:', error);
    showNotification('error', 'Erro ao duplicar: ' + error.message);
  }
};

/**
 * Deleta uma divisão
 */
window.deleteDivision = async function(divisionId) {
  try {
    const confirmed = await showConfirmBox(
      'Deletar Divisão',
      'Tem certeza que deseja deletar esta divisão? Esta ação não pode ser desfeita.',
      'Sim, deletar',
      'Cancelar'
    );

    if (!confirmed) return;

    const { doc, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const divisionRef = doc(window.db, 'divisions', divisionId);
    await deleteDoc(divisionRef);

    showNotification('success', '✅ Divisão deletada!');
    await loadDivisions();

  } catch (error) {
    console.error('Erro ao deletar divisão:', error);
    showNotification('error', 'Erro ao deletar: ' + error.message);
  }
};

/**
 * Filtra divisões
 */
function filterDivisions() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const trainingFilter = document.getElementById('filter-training').value;

  let filtered = allDivisions;

  // Filtrar por nome
  if (searchTerm) {
    filtered = filtered.filter(d => d.name.toLowerCase().includes(searchTerm));
  }

  // Filtrar por nível de treinamento
  if (trainingFilter) {
    filtered = filtered.filter(d => d.trainingLevel === trainingFilter);
  }

  renderDivisions(filtered);
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Search
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', filterDivisions);

  // Training filter
  const trainingFilter = document.getElementById('filter-training');
  trainingFilter.addEventListener('change', filterDivisions);

  // Refresh button
  const btnRefresh = document.getElementById('btn-refresh');
  btnRefresh.addEventListener('click', loadDivisions);
}

/**
 * Esconde loading screen
 */
function hideLoadingScreen() {
  const loading = document.getElementById('initial-loading');
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => loading.style.display = 'none', 500);
  }
}
