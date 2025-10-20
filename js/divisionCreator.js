/**
 * @file divisionCreator.js
 * @description Sistema principal do Division Designer - War1954
 */

import { combat_units } from './data/division-components/combat_units.js';
import { support_units } from './data/division-components/support_units.js';
import { training_levels } from './data/division-components/training_levels.js';
import { DivisionStatsCalculator } from './systems/divisionStatsCalculator.js';
import { DivisionValidator } from './utils/divisionValidator.js';
import { showNotification, showConfirmBox } from './utils.js';

// Estado global da divisão
let currentDivision = {
  id: null,
  name: 'Nova Divisão',
  countryId: null,
  trainingLevel: 'regular',
  combatUnits: [],
  supportUnits: [],
  calculatedStats: null,
  createdAt: null,
  updatedAt: null
};

let currentUser = null;
let currentUserCountry = null;

/**
 * Inicializa o Division Creator
 */
export async function initDivisionCreator(user) {
  try {
    console.log('🎖️ Inicializando Division Designer...');

    currentUser = user;

    // Carregar dados do país do jogador
    await loadUserCountry();

    // Verificar se está editando uma divisão existente
    const urlParams = new URLSearchParams(window.location.search);
    const divisionId = urlParams.get('id');

    if (divisionId) {
      await loadExistingDivision(divisionId);
    }

    // Inicializar interface
    await initializeUI();

    // Calcular stats iniciais
    updateStats();

    // Esconder loading
    hideLoadingScreen();

    console.log('✅ Division Designer inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Division Designer:', error);
    showNotification('error', 'Erro ao carregar Division Designer: ' + error.message);
  }
}

/**
 * Carrega dados do país do usuário
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
    currentDivision.countryId = paisId;

    console.log(`✅ País carregado: ${currentUserCountry.Pais}`);
  } catch (error) {
    console.error('Erro ao carregar país:', error);
    throw error;
  }
}

/**
 * Carrega uma divisão existente para edição
 */
async function loadExistingDivision(divisionId) {
  try {
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const divisionRef = doc(window.db, 'divisions', divisionId);
    const divisionDoc = await getDoc(divisionRef);

    if (!divisionDoc.exists()) {
      throw new Error('Divisão não encontrada');
    }

    const division = divisionDoc.data();

    // Aplicar dados à divisão atual
    currentDivision = {
      ...currentDivision,
      ...division,
      id: divisionId
    };

    console.log(`✅ Divisão carregada: ${currentDivision.name}`);
  } catch (error) {
    console.error('Erro ao carregar divisão:', error);
    showNotification('error', 'Erro ao carregar divisão: ' + error.message);
  }
}

/**
 * Inicializa a interface
 */
async function initializeUI() {
  // Training selector
  renderTrainingSelector();

  // Grids
  renderSupportGrid();
  renderCombatGrid();

  // Event listeners
  setupEventListeners();

  // Carregar templates
  await loadTemplates();
}

/**
 * Renderiza o seletor de nível de treinamento
 */
function renderTrainingSelector() {
  const container = document.getElementById('training-selector');

  const levels = [
    { id: 'conscript', ...training_levels.conscript },
    { id: 'regular', ...training_levels.regular },
    { id: 'elite', ...training_levels.elite }
  ];

  container.innerHTML = levels.map(level => {
    const costMod = (level.modifiers.costs.production - 1) * 100;
    const isSelected = currentDivision.trainingLevel === level.id;

    return `
      <button
        class="training-badge flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
          isSelected
            ? 'border-brand-500 bg-brand-500/20 text-brand-400'
            : 'border-bg-ring bg-bg hover:border-slate-600'
        }"
        data-training="${level.id}"
        onclick="window.selectTrainingLevel('${level.id}')"
        title="${getTrainingTooltip(level)}"
      >
        <div class="text-2xl mb-1">${level.icon}</div>
        <div class="text-xs font-bold mb-1">${level.name}</div>
        <div class="text-xs text-slate-400">${level.modifiers.recruitmentTurns} turno${level.modifiers.recruitmentTurns > 1 ? 's' : ''}</div>
        <div class="text-xs font-semibold ${costMod < 0 ? 'text-green-400' : costMod > 0 ? 'text-red-400' : 'text-slate-400'}">
          ${costMod >= 0 ? '+' : ''}${costMod.toFixed(0)}% $
        </div>
      </button>
    `;
  }).join('');
}

/**
 * Gera tooltip para nível de treinamento
 */
function getTrainingTooltip(level) {
  const costMod = (level.modifiers.costs.production - 1) * 100;
  const statsMod = (level.modifiers.stats.softAttack - 1) * 100;
  const turns = level.modifiers.recruitmentTurns;

  let tooltip = `${level.name}\n${level.description}\n\n`;

  tooltip += `💰 Custo: ${costMod >= 0 ? '+' : ''}${costMod.toFixed(0)}%\n`;
  tooltip += `⚔️ Stats: ${statsMod >= 0 ? '+' : ''}${statsMod.toFixed(0)}%\n`;
  tooltip += `⏱️ Recrutamento: ${turns} turno${turns > 1 ? 's' : ''}`;

  if (turns > 1) {
    const progressPerTurn = (level.modifiers.recruitmentProgress * 100).toFixed(1);
    tooltip += ` (${progressPerTurn}% por turno)`;
  }

  return tooltip;
}

/**
 * Seleciona nível de treinamento
 */
window.selectTrainingLevel = function(levelId) {
  currentDivision.trainingLevel = levelId;
  renderTrainingSelector();
  updateStats();
};

/**
 * Renderiza grid de suporte
 */
function renderSupportGrid() {
  const grid = document.getElementById('support-grid');
  const maxSlots = 5;

  grid.innerHTML = '';

  for (let i = 0; i < maxSlots; i++) {
    const unit = currentDivision.supportUnits[i];
    const slot = createUnitSlot(i, 'support', unit);
    grid.appendChild(slot);
  }

  updateUnitCount();
}

/**
 * Renderiza grid de combate
 */
function renderCombatGrid() {
  const grid = document.getElementById('combat-grid');
  const maxSlots = 25;

  grid.innerHTML = '';

  for (let i = 0; i < maxSlots; i++) {
    const unit = currentDivision.combatUnits[i];
    const slot = createUnitSlot(i, 'combat', unit);
    grid.appendChild(slot);
  }

  updateUnitCount();
}

/**
 * Cria um slot de unidade
 */
function createUnitSlot(index, slotType, unit) {
  const div = document.createElement('div');

  if (unit) {
    // Slot preenchido
    const unitData = slotType === 'combat' ? combat_units[unit.unitType] : support_units[unit.unitType];

    div.className = 'unit-slot filled rounded-lg p-2 cursor-pointer flex flex-col items-center justify-center relative group';
    div.innerHTML = `
      <div class="text-3xl mb-1">${unitData.icon}</div>
      <div class="text-[10px] font-medium text-center line-clamp-2 text-slate-300">${unitData.name.split(' ')[0]}</div>
      <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onclick="window.removeUnit(${index}, '${slotType}')"
          class="w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white text-xs"
        >×</button>
      </div>
    `;

    // Enhanced tooltip on hover
    div.addEventListener('mouseenter', (e) => showUnitTooltip(e, unitData, slotType));
    div.addEventListener('mouseleave', hideUnitTooltip);
    div.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        hideUnitTooltip();
      }
    });
  } else {
    // Slot vazio
    div.className = 'unit-slot empty rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-500';
    div.innerHTML = `
      <div class="text-2xl text-slate-600 group-hover:text-brand-500 transition-colors">+</div>
    `;
    div.onclick = () => openUnitSelectionModal(index, slotType);
  }

  return div;
}

/**
 * Remove uma unidade
 */
window.removeUnit = function(index, slotType) {
  if (slotType === 'combat') {
    currentDivision.combatUnits.splice(index, 1);
    renderCombatGrid();
  } else {
    currentDivision.supportUnits.splice(index, 1);
    renderSupportGrid();
  }
  updateStats();
};

/**
 * Abre modal de seleção de unidades
 */
function openUnitSelectionModal(slotIndex, slotType) {
  const units = slotType === 'combat' ? combat_units : support_units;
  const title = slotType === 'combat' ? 'Unidade de Combate' : 'Unidade de Suporte';
  const maxUnits = slotType === 'combat' ? 25 : 5;

  // Verificar se já atingiu o limite
  const currentCount = slotType === 'combat' ? currentDivision.combatUnits.length : currentDivision.supportUnits.length;
  if (currentCount >= maxUnits) {
    showNotification('warning', `Máximo de ${maxUnits} unidades ${slotType === 'combat' ? 'de combate' : 'de suporte'} atingido`);
    return;
  }

  // Criar modal
  const modalHTML = `
    <div class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" onclick="window.closeModal(event)">
      <div class="bg-bg-soft border border-bg-ring rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="border-b border-bg-ring p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold text-brand-500">Selecionar ${title}</h2>
            <button onclick="window.closeModal()" class="text-slate-400 hover:text-slate-200 text-2xl leading-none">×</button>
          </div>
        </div>

        <!-- Filters -->
        <div class="border-b border-bg-ring p-4">
          <div id="category-filters" class="flex gap-2 flex-wrap">
            ${generateCategoryFilters(units, slotType)}
          </div>
        </div>

        <!-- Units List -->
        <div class="flex-1 overflow-y-auto p-6">
          <div id="units-list" class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${generateUnitsList(units, slotIndex, slotType)}
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.getElementById('modal-container');
  container.innerHTML = modalHTML;

  // Setup filter handlers
  setupCategoryFilters(units, slotIndex, slotType);
}

/**
 * Gera filtros de categoria
 */
function generateCategoryFilters(units, slotType) {
  const categories = new Set();
  Object.values(units).forEach(unit => categories.add(unit.category));

  const filters = ['Todas', ...Array.from(categories)];

  return filters.map(filter => `
    <button
      class="category-filter px-4 py-2 rounded-lg border transition-colors ${
        filter === 'Todas'
          ? 'border-brand-500 bg-brand-500/20 text-brand-400'
          : 'border-bg-ring bg-bg hover:border-slate-600'
      }"
      data-category="${filter}"
    >
      ${filter.charAt(0).toUpperCase() + filter.slice(1)}
    </button>
  `).join('');
}

/**
 * Setup dos filtros de categoria
 */
function setupCategoryFilters(units, slotIndex, slotType) {
  const filterButtons = document.querySelectorAll('.category-filter');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      // Update active state
      filterButtons.forEach(btn => {
        btn.classList.remove('border-brand-500', 'bg-brand-500/20', 'text-brand-400');
        btn.classList.add('border-bg-ring', 'bg-bg');
      });
      button.classList.add('border-brand-500', 'bg-brand-500/20', 'text-brand-400');
      button.classList.remove('border-bg-ring', 'bg-bg');

      // Filter units
      const filteredUnits = category === 'Todas'
        ? units
        : Object.fromEntries(
            Object.entries(units).filter(([_, unit]) => unit.category === category)
          );

      // Re-render list
      document.getElementById('units-list').innerHTML = generateUnitsList(filteredUnits, slotIndex, slotType);
    });
  });
}

/**
 * Gera lista de unidades
 */
function generateUnitsList(units, slotIndex, slotType) {
  return Object.entries(units).map(([unitId, unit]) => `
    <div
      class="unit-card bg-bg border border-bg-ring rounded-lg p-4 hover:shadow-lg transition-all"
      onclick="window.selectUnit('${unitId}', ${slotIndex}, '${slotType}')"
    >
      <div class="flex items-start gap-3">
        <div class="text-4xl">${unit.icon}</div>
        <div class="flex-1 min-w-0">
          <h3 class="font-bold text-slate-100 mb-1">${unit.name}</h3>
          <div class="text-xs text-slate-400 space-y-1">
            <div>${unit.composition.manpower} MP</div>
            <div class="text-green-400">$${(unit.costs.production / 1000000).toFixed(1)}M</div>
          </div>
        </div>
        <div class="text-right text-xs text-slate-500">
          <div>${unit.category}</div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Seleciona uma unidade
 */
window.selectUnit = function(unitId, slotIndex, slotType) {
  const unit = {
    id: generateId(),
    unitType: unitId,
    position: slotIndex
  };

  if (slotType === 'combat') {
    currentDivision.combatUnits.push(unit);
    renderCombatGrid();
  } else {
    currentDivision.supportUnits.push(unit);
    renderSupportGrid();
  }

  closeModal();
  updateStats();
};

/**
 * Fecha modal
 */
window.closeModal = function(event) {
  if (!event || event.target.classList.contains('modal-backdrop')) {
    document.getElementById('modal-container').innerHTML = '';
  }
};

/**
 * Atualiza contadores de unidades
 */
function updateUnitCount() {
  document.getElementById('combat-count').textContent = `${currentDivision.combatUnits.length}/25`;
  document.getElementById('support-count').textContent = `${currentDivision.supportUnits.length}/5`;
}

/**
 * Atualiza estatísticas
 */
function updateStats() {
  const stats = DivisionStatsCalculator.calculateDivisionStats(
    currentDivision,
    combat_units,
    support_units,
    training_levels
  );

  currentDivision.calculatedStats = stats;

  // Animar stats ao atualizar
  const statElements = document.querySelectorAll('.stat-value');
  statElements.forEach(el => {
    el.classList.add('stat-updating');
    setTimeout(() => el.classList.remove('stat-updating'), 400);
  });

  // Combat stats (Simplificado - Opção 1)
  // Poder de Fogo = Soft Attack + Hard Attack
  const firepower = stats.combatStats.softAttack + stats.combatStats.hardAttack;
  document.getElementById('stat-firepower').textContent = firepower.toFixed(0);
  document.getElementById('stat-defense').textContent = stats.combatStats.defense.toFixed(0);
  document.getElementById('stat-organization').textContent = stats.combatStats.organization.toFixed(0);
  document.getElementById('stat-hp').textContent = stats.combatStats.hp.toFixed(0);
  document.getElementById('stat-width').textContent = stats.combatStats.combatWidth.toFixed(0);
  document.getElementById('stat-manpower').textContent = stats.manpower.total.toLocaleString();

  // Costs
  document.getElementById('cost-production').textContent = '$' + (stats.costs.production / 1000000).toFixed(2) + 'M';
  document.getElementById('cost-maintenance').textContent = '$' + (stats.costs.maintenance / 1000).toFixed(0) + 'k';

  // Equipment
  renderEquipmentList(stats.equipment);
}

/**
 * Renderiza lista de equipamentos
 */
function renderEquipmentList(equipment) {
  const container = document.getElementById('equipment-list');

  if (Object.keys(equipment).length === 0) {
    container.innerHTML = '<p class="text-slate-500 text-center py-4">Nenhuma unidade adicionada</p>';
    return;
  }

  const equipmentHTML = Object.entries(equipment)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `
      <div class="flex justify-between items-center py-1">
        <span class="text-slate-400">${formatEquipmentName(type)}:</span>
        <span class="font-bold text-slate-200">${count}</span>
      </div>
    `).join('');

  container.innerHTML = equipmentHTML;
}

/**
 * Formata nome de equipamento
 */
function formatEquipmentName(type) {
  const names = {
    trucks: 'Caminhões',
    utility_vehicles: 'Utilitários',
    apc: 'APC',
    ifv: 'IFV',
    light_tanks: 'Tanques Leves',
    medium_tanks: 'Tanques Médios',
    mbt: 'MBT',
    artillery: 'Artilharia',
    aa_guns: 'AA',
    spg: 'SPG',
    spaa: 'SPAA',
    mlrs: 'MLRS',
    atcms: 'ATCMS',
    manpads: 'MANPADS',
    attack_helicopters: 'Helicópteros Ataque',
    utility_helicopters: 'Helicópteros Utilitários',
    small_arms: 'Armas Pequenas',
    amtrac: 'AMTRAC'
  };
  return names[type] || type;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Nome da divisão
  const nameInput = document.getElementById('division-name');
  nameInput.value = currentDivision.name;
  nameInput.addEventListener('input', (e) => {
    currentDivision.name = e.target.value;
  });

  // Resetar
  document.getElementById('btn-reset').addEventListener('click', resetDivision);

  // Validar
  document.getElementById('btn-validate').addEventListener('click', validateDivision);

  // Salvar
  document.getElementById('btn-save').addEventListener('click', saveDivision);

  // Salvar como template
  const btnSaveTemplate = document.getElementById('btn-save-template');
  if (btnSaveTemplate) {
    btnSaveTemplate.addEventListener('click', saveAsTemplate);
  }

  // Duplicar
  const btnDuplicate = document.getElementById('btn-duplicate');
  if (btnDuplicate) {
    btnDuplicate.addEventListener('click', duplicateDivision);
  }

  // Templates dropdown
  const templatesDropdown = document.getElementById('templates-dropdown');
  if (templatesDropdown) {
    templatesDropdown.addEventListener('change', (e) => {
      window.loadTemplate(e.target.value);
    });
  }

  // Keyboard shortcuts
  setupKeyboardShortcuts();
}

/**
 * Configura atalhos de teclado
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S: Salvar
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveDivision();
      showNotification('info', '💾 Salvando divisão...');
    }

    // Ctrl/Cmd + R: Resetar
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      resetDivision();
    }

    // Ctrl/Cmd + V: Validar
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      validateDivision();
    }

    // Ctrl/Cmd + D: Duplicar
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      duplicateDivision();
    }

    // Esc: Fechar modal
    if (e.key === 'Escape') {
      window.closeModal();
    }

    // ?: Mostrar ajuda de atalhos
    if (e.key === '?' && !e.target.matches('input, textarea')) {
      e.preventDefault();
      showKeyboardShortcutsHelp();
    }
  });
}

/**
 * Mostra ajuda de atalhos de teclado
 */
window.showKeyboardShortcutsHelp = function() {
  const helpHTML = `
    <div class="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" onclick="window.closeModal(event)">
      <div class="bg-bg-soft border border-bg-ring rounded-2xl max-w-md w-full p-6" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-brand-500">⌨️ Atalhos de Teclado</h2>
          <button onclick="window.closeModal()" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between items-center py-2 border-b border-bg-ring">
            <span class="text-slate-300">Salvar Divisão</span>
            <kbd class="px-2 py-1 bg-bg rounded font-mono text-brand-400">Ctrl + S</kbd>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-bg-ring">
            <span class="text-slate-300">Validar Divisão</span>
            <kbd class="px-2 py-1 bg-bg rounded font-mono text-brand-400">Ctrl + V</kbd>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-bg-ring">
            <span class="text-slate-300">Resetar Divisão</span>
            <kbd class="px-2 py-1 bg-bg rounded font-mono text-brand-400">Ctrl + R</kbd>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-bg-ring">
            <span class="text-slate-300">Duplicar Divisão</span>
            <kbd class="px-2 py-1 bg-bg rounded font-mono text-brand-400">Ctrl + D</kbd>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-bg-ring">
            <span class="text-slate-300">Fechar Modal</span>
            <kbd class="px-2 py-1 bg-bg rounded font-mono text-brand-400">Esc</kbd>
          </div>
          <div class="flex justify-between items-center py-2">
            <span class="text-slate-300">Mostrar Atalhos</span>
            <kbd class="px-2 py-1 bg-bg rounded font-mono text-brand-400">?</kbd>
          </div>
        </div>

        <div class="mt-6 text-center">
          <button onclick="window.closeModal()" class="px-6 py-2 bg-brand-500 hover:bg-brand-600 rounded-lg font-medium transition-colors">
            Entendido
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-container').innerHTML = helpHTML;
}

/**
 * Reseta a divisão
 */
async function resetDivision() {
  const confirmed = await showConfirmBox(
    'Resetar Divisão',
    'Tem certeza que deseja limpar toda a divisão?',
    'Sim, resetar',
    'Cancelar'
  );

  if (confirmed) {
    currentDivision.combatUnits = [];
    currentDivision.supportUnits = [];
    currentDivision.name = 'Nova Divisão';
    currentDivision.trainingLevel = 'regular';

    document.getElementById('division-name').value = 'Nova Divisão';

    renderTrainingSelector();
    renderCombatGrid();
    renderSupportGrid();
    updateStats();

    showNotification('success', 'Divisão resetada');
  }
}

/**
 * Valida a divisão
 */
function validateDivision() {
  const validation = DivisionValidator.validate(
    currentDivision,
    combat_units,
    support_units,
    training_levels
  );

  const report = DivisionValidator.generateReport(validation);

  // Visual feedback
  const nameInput = document.getElementById('division-name');
  nameInput.classList.remove('border-red-500', 'border-yellow-500', 'border-green-500');

  if (!validation.valid) {
    nameInput.classList.add('border-red-500');
    showNotification('error', 'Divisão inválida:\n\n' + report);
    highlightValidationIssues(validation);
  } else if (validation.warnings.length > 0) {
    nameInput.classList.add('border-yellow-500');
    showNotification('warning', 'Divisão válida com avisos:\n\n' + report);
  } else {
    nameInput.classList.add('border-green-500');
    showNotification('success', 'Divisão válida!\n\n' + report);
  }

  // Remove visual feedback após 3 segundos
  setTimeout(() => {
    nameInput.classList.remove('border-red-500', 'border-yellow-500', 'border-green-500');
  }, 3000);
}

/**
 * Destaca visualmente problemas de validação
 */
function highlightValidationIssues(validation) {
  // Destacar stats problemáticas
  if (currentDivision.calculatedStats) {
    const stats = currentDivision.calculatedStats.combatStats;

    // Combat width muito alto
    if (stats.combatWidth > 40) {
      const widthEl = document.getElementById('stat-width');
      widthEl.classList.add('text-red-400', 'font-bold');
      setTimeout(() => widthEl.classList.remove('text-red-400', 'font-bold'), 3000);
    }

    // Organization muito baixa
    if (stats.organization < 20) {
      const orgEl = document.getElementById('stat-organization');
      orgEl.classList.add('text-red-400', 'font-bold');
      setTimeout(() => orgEl.classList.remove('text-red-400', 'font-bold'), 3000);
    }
  }
}

/**
 * Salva a divisão
 */
async function saveDivision() {
  const saveButton = document.getElementById('btn-save');
  const originalText = saveButton.textContent;

  try {
    // Validar primeiro
    const validation = DivisionValidator.validate(
      currentDivision,
      combat_units,
      support_units,
      training_levels
    );

    if (!validation.valid) {
      const report = DivisionValidator.generateReport(validation);
      showNotification('error', 'Não é possível salvar divisão inválida:\n\n' + report);
      return;
    }

    if (validation.warnings.length > 0) {
      const report = DivisionValidator.generateReport(validation);
      const proceed = await showConfirmBox(
        'Avisos de Validação',
        report + '\n\nDeseja continuar mesmo assim?',
        'Sim, salvar',
        'Cancelar'
      );

      if (!proceed) return;
    }

    // Loading state
    saveButton.disabled = true;
    saveButton.innerHTML = `
      <svg class="animate-spin h-4 w-4 inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Salvando...
    `;

    // Salvar no Firestore
    const { collection, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const divisionRef = currentDivision.id
      ? doc(window.db, 'divisions', currentDivision.id)
      : doc(collection(window.db, 'divisions'));

    // Obter dados de recrutamento do training level
    const trainingLevel = training_levels[currentDivision.trainingLevel];
    const recruitmentTurns = trainingLevel.modifiers.recruitmentTurns;
    const progressPerTurn = trainingLevel.modifiers.recruitmentProgress;

    const divisionData = {
      ...currentDivision,
      id: divisionRef.id,
      updatedAt: serverTimestamp(),

      // Dados de recrutamento
      recruitmentStatus: 'recruiting', // Status: recruiting, ready, deployed
      recruitment: {
        totalTurns: recruitmentTurns,
        currentTurn: 0,
        progressPerTurn: progressPerTurn,
        progress: 0,
        startedAt: serverTimestamp(),
        trainingLevel: currentDivision.trainingLevel
      }
    };

    if (!currentDivision.id) {
      divisionData.createdAt = serverTimestamp();
    }

    await setDoc(divisionRef, divisionData);

    currentDivision.id = divisionRef.id;

    // Success animation
    saveButton.innerHTML = `
      <svg class="h-4 w-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      Salvo!
    `;

    showNotification('success', '✅ Divisão salva com sucesso!');

    // Reset button após 2 segundos
    setTimeout(() => {
      saveButton.disabled = false;
      saveButton.textContent = originalText;
    }, 2000);

  } catch (error) {
    console.error('Erro ao salvar divisão:', error);
    showNotification('error', 'Erro ao salvar: ' + error.message);

    // Reset button em caso de erro
    saveButton.disabled = false;
    saveButton.textContent = originalText;
  }
}

/**
 * Salva divisão como template
 */
async function saveAsTemplate() {
  try {
    const validation = DivisionValidator.validate(
      currentDivision,
      combat_units,
      support_units,
      training_levels
    );

    if (!validation.valid) {
      showNotification('error', 'Não é possível salvar template de divisão inválida');
      return;
    }

    // Pedir nome do template
    const templateName = prompt('Nome do template:', currentDivision.name + ' (Template)');
    if (!templateName) return;

    // Salvar no Firestore
    const { collection, doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const templateRef = doc(collection(window.db, 'division_templates'));

    await setDoc(templateRef, {
      id: templateRef.id,
      name: templateName,
      countryId: currentUserCountry.id,
      isPublic: false,
      trainingLevel: currentDivision.trainingLevel,
      combatUnits: currentDivision.combatUnits.map(u => ({ unitType: u.unitType })),
      supportUnits: currentDivision.supportUnits.map(u => ({ unitType: u.unitType })),
      createdAt: serverTimestamp()
    });

    showNotification('success', '✅ Template salvo com sucesso!');
    await loadTemplates();

  } catch (error) {
    console.error('Erro ao salvar template:', error);
    showNotification('error', 'Erro ao salvar template: ' + error.message);
  }
}

/**
 * Carrega templates disponíveis
 */
async function loadTemplates() {
  try {
    const { collection, query, where, getDocs, orderBy } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const templatesRef = collection(window.db, 'division_templates');

    // Buscar templates do país ou públicos
    const q = query(
      templatesRef,
      where('countryId', '==', currentUserCountry.id),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    const templates = [];

    snapshot.forEach(doc => {
      templates.push({ id: doc.id, ...doc.data() });
    });

    renderTemplatesDropdown(templates);
    return templates;

  } catch (error) {
    console.error('Erro ao carregar templates:', error);
    return [];
  }
}

/**
 * Renderiza dropdown de templates
 */
function renderTemplatesDropdown(templates) {
  const container = document.getElementById('templates-dropdown');
  if (!container) return;

  if (templates.length === 0) {
    container.innerHTML = '<option value="">Nenhum template salvo</option>';
    return;
  }

  container.innerHTML = `
    <option value="">Selecione um template...</option>
    ${templates.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
  `;
}

/**
 * Carrega template selecionado
 */
window.loadTemplate = async function(templateId) {
  if (!templateId) return;

  try {
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

    const templateRef = doc(window.db, 'division_templates', templateId);
    const templateDoc = await getDoc(templateRef);

    if (!templateDoc.exists()) {
      showNotification('error', 'Template não encontrado');
      return;
    }

    const template = templateDoc.data();

    // Aplicar template à divisão atual
    currentDivision.name = template.name.replace(' (Template)', '');
    currentDivision.trainingLevel = template.trainingLevel;
    currentDivision.combatUnits = template.combatUnits.map((u, i) => ({
      id: generateId(),
      unitType: u.unitType,
      position: i
    }));
    currentDivision.supportUnits = template.supportUnits.map((u, i) => ({
      id: generateId(),
      unitType: u.unitType,
      position: i
    }));

    // Atualizar UI
    document.getElementById('division-name').value = currentDivision.name;
    renderTrainingSelector();
    renderCombatGrid();
    renderSupportGrid();
    updateStats();

    showNotification('success', '✅ Template carregado!');

  } catch (error) {
    console.error('Erro ao carregar template:', error);
    showNotification('error', 'Erro ao carregar template: ' + error.message);
  }
};

/**
 * Duplica a divisão atual
 */
async function duplicateDivision() {
  if (currentDivision.combatUnits.length === 0) {
    showNotification('warning', 'Adicione unidades antes de duplicar');
    return;
  }

  // Criar nova divisão com mesmos dados
  currentDivision.id = null;
  currentDivision.name = currentDivision.name + ' (Cópia)';
  currentDivision.createdAt = null;
  currentDivision.updatedAt = null;

  document.getElementById('division-name').value = currentDivision.name;

  showNotification('success', 'Divisão duplicada! Clique em Salvar para criar uma nova cópia.');
}

/**
 * Gera ID único
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Esconde tela de loading
 */
function hideLoadingScreen() {
  const loading = document.getElementById('initial-loading');
  if (loading) {
    loading.style.opacity = '0';
    setTimeout(() => loading.style.display = 'none', 500);
  }
}

/**
 * Mostra tooltip detalhado da unidade
 */
function showUnitTooltip(event, unitData, slotType) {
  // Remove tooltip existente primeiro (remoção imediata)
  hideUnitTooltip(true);

  const tooltip = document.createElement('div');
  tooltip.id = 'unit-tooltip';
  tooltip.className = 'fixed z-[100] bg-bg-soft border-2 border-brand-500 rounded-lg p-4 shadow-2xl max-w-sm';

  // Conteúdo do tooltip
  let content = `
    <div class="space-y-3">
      <div class="flex items-center gap-3 border-b border-bg-ring pb-2">
        <div class="text-4xl">${unitData.icon}</div>
        <div>
          <h3 class="font-bold text-brand-400 text-lg">${unitData.name}</h3>
          <p class="text-xs text-slate-400">${unitData.category}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="bg-bg rounded p-2">
          <p class="text-slate-500">Manpower</p>
          <p class="font-bold text-slate-100">${unitData.composition.manpower.toLocaleString()}</p>
        </div>
        <div class="bg-bg rounded p-2">
          <p class="text-slate-500">Produção</p>
          <p class="font-bold text-green-400">$${(unitData.costs.production / 1000000).toFixed(1)}M</p>
        </div>
      </div>
  `;

  // Stats de combate ou bônus
  if (slotType === 'combat' && unitData.stats) {
    content += `
      <div class="border-t border-bg-ring pt-2">
        <p class="text-xs font-bold text-slate-300 mb-2">Combat Stats:</p>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          ${unitData.stats.softAttack ? `<div><span class="text-slate-500">Soft Attack:</span> <span class="text-slate-200">${unitData.stats.softAttack}</span></div>` : ''}
          ${unitData.stats.hardAttack ? `<div><span class="text-slate-500">Hard Attack:</span> <span class="text-slate-200">${unitData.stats.hardAttack}</span></div>` : ''}
          ${unitData.stats.defense ? `<div><span class="text-slate-500">Defense:</span> <span class="text-slate-200">${unitData.stats.defense}</span></div>` : ''}
          ${unitData.stats.breakthrough ? `<div><span class="text-slate-500">Breakthrough:</span> <span class="text-slate-200">${unitData.stats.breakthrough}</span></div>` : ''}
          ${unitData.stats.organization ? `<div><span class="text-slate-500">Organization:</span> <span class="text-slate-200">${unitData.stats.organization}</span></div>` : ''}
          ${unitData.stats.combatWidth ? `<div><span class="text-slate-500">Width:</span> <span class="text-slate-200">${unitData.stats.combatWidth}</span></div>` : ''}
        </div>
      </div>
    `;
  } else if (slotType === 'support' && unitData.divisionBonuses) {
    content += `
      <div class="border-t border-bg-ring pt-2">
        <p class="text-xs font-bold text-brand-400 mb-2">Division Bonuses:</p>
        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          ${Object.entries(unitData.divisionBonuses).map(([key, value]) => `
            <div><span class="text-slate-500">${key}:</span> <span class="text-green-400">+${value}</span></div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Equipamentos
  if (unitData.composition.equipment && Object.keys(unitData.composition.equipment).length > 0) {
    content += `
      <div class="border-t border-bg-ring pt-2">
        <p class="text-xs font-bold text-slate-300 mb-2">Equipment:</p>
        <div class="space-y-1 text-xs">
          ${Object.entries(unitData.composition.equipment).map(([eq, count]) => `
            <div class="flex justify-between">
              <span class="text-slate-400">${formatEquipmentName(eq)}</span>
              <span class="text-slate-200">${count}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  content += `</div>`;
  tooltip.innerHTML = content;

  // Posicionar tooltip
  document.body.appendChild(tooltip);

  const rect = event.target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  let left = rect.right + 10;
  let top = rect.top;

  // Ajustar se sair da tela
  if (left + tooltipRect.width > window.innerWidth) {
    left = rect.left - tooltipRect.width - 10;
  }

  if (top + tooltipRect.height > window.innerHeight) {
    top = window.innerHeight - tooltipRect.height - 10;
  }

  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
  tooltip.style.opacity = '0';

  setTimeout(() => {
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.opacity = '1';
  }, 10);
}

/**
 * Esconde tooltip da unidade
 */
function hideUnitTooltip(immediate = false) {
  const tooltip = document.getElementById('unit-tooltip');
  if (tooltip) {
    if (immediate) {
      // Remoção imediata (usado quando criando novo tooltip)
      tooltip.remove();
    } else {
      // Remoção animada (usado no mouseleave normal)
      tooltip.style.opacity = '0';
      setTimeout(() => {
        if (tooltip.parentElement) tooltip.remove();
      }, 200);
    }
  }
}
