import { auth, db, getAllCountries, getGameConfig, updateTurn, checkUserPermissions } from "../services/firebase.js";
import { realTimeUpdates } from "../services/realTimeUpdates.js";
import { changeHistory } from "../services/changeHistory.js";
import { advancedTools } from "../components/advancedTools.js";
import { playerManager } from "../services/playerManager.js";
import { eventSimulator } from "../services/eventSimulator.js";
import { showNotification, Logger, showConfirmBox } from "../utils.js";

// Catálogo local (fallback). Pode ser salvo no Firestore em configuracoes/campos
const localCatalog = {
  geral: {
    label: "Geral",
    campos: [
      { key: "PIB", label: "PIB", tipo: "moeda", min: 0 },
      { key: "Estabilidade", label: "Estabilidade", tipo: "percent", min: 0, max: 100 },
      { key: "Urbanizacao", label: "Urbanização", tipo: "percent", min: 0, max: 100 },
      { key: "Tecnologia", label: "Tecnologia", tipo: "percent", min: 0, max: 100 },
      { key: "Populacao", label: "População", tipo: "inteiro", min: 0 },
      { key: "ModeloPolitico", label: "Modelo Político", tipo: "texto" },
      { key: "Visibilidade", label: "Visibilidade", tipo: "opcoes", opcoes: ["Público","Privado"] }
    ]
  },
  exercito: { label: "Exército", campos: [ { key: "Infantaria", label: "Infantaria", tipo: "inteiro", min: 0 }, { key: "Artilharia", label: "Artilharia", tipo: "inteiro", min: 0 } ] },
  aeronautica: { label: "Aeronáutica", campos: [ { key: "Caca", label: "Caça", tipo: "inteiro", min: 0 }, { key: "CAS", label: "CAS", tipo: "inteiro", min: 0 }, { key: "Bomber", label: "Bombardeiro", tipo: "inteiro", min: 0 } ] },
  marinha: { label: "Marinha", campos: [ { key: "Fragata", label: "Fragata", tipo: "inteiro", min: 0 }, { key: "Destroyer", label: "Destroyer", tipo: "inteiro", min: 0 }, { key: "Submarino", label: "Submarino", tipo: "inteiro", min: 0 }, { key: "Transporte", label: "Transporte", tipo: "inteiro", min: 0 } ] },
  inventario: { 
    label: "Inventário de Veículos", 
    campos: [ 
      { key: "cavalos", label: "Cavalos", tipo: "inteiro", min: 0 },
      { key: "tanquesLeves", label: "Tanques Leves", tipo: "inteiro", min: 0 },
      { key: "mbt", label: "MBT", tipo: "inteiro", min: 0 },
      { key: "tanquesPesados", label: "Tanques Pesados", tipo: "inteiro", min: 0 },
      { key: "caminhoes", label: "Caminhões de Transporte", tipo: "inteiro", min: 0 },
      { key: "spg", label: "SPG", tipo: "inteiro", min: 0 },
      { key: "sph", label: "SPH", tipo: "inteiro", min: 0 },
      { key: "spaa", label: "SPAA", tipo: "inteiro", min: 0 },
      { key: "apc", label: "APC", tipo: "inteiro", min: 0 },
      { key: "cacaTanques", label: "Caça-Tanques", tipo: "inteiro", min: 0 },
      { key: "veiculosEng", label: "Veículos de Engenharia", tipo: "inteiro", min: 0 },
      { key: "ifv", label: "IFV", tipo: "inteiro", min: 0 }
    ] 
  },
  recursos: { label: "Recursos", campos: [ { key: "CombustivelSaldo", label: "Saldo de Combustível", tipo: "inteiro" }, { key: "Metais", label: "Metais", tipo: "inteiro" } ] },
  ocupacao: { label: "Ocupação", campos: [ { key: "PopOcupada", label: "População Ocupada", tipo: "inteiro", min: 0 }, { key: "PIBOcupado", label: "PIB Ocupado", tipo: "moeda", min: 0 } ] },
  arsenal: { label: "Arsenal Especial", campos: [ { key: "Nuclear", label: "Bomba Nuclear", tipo: "inteiro", min: 0 } ] }
};

let catalog = null;
let state = {
  paises: [],
  paisSelecionado: null,
  secaoSelecionada: "geral",
  realTimeEnabled: true,
  autoSave: true,
  listeners: new Map(),
  pendingChanges: new Set()
};

const el = {
  gate: document.getElementById('gate'),
  adminRoot: document.getElementById('admin-root'),
  turnoAtual: document.getElementById('turno-atual-admin'),
  menuSecoes: document.getElementById('menu-secoes'),
  selectPais: document.getElementById('select-pais'),
  selectSecao: document.getElementById('select-secao'),
  formSecao: document.getElementById('form-secao'),
  listaCampos: document.getElementById('lista-campos-secao'),
  btnSalvarSecao: document.getElementById('btn-salvar-secao'),
  btnRecarregar: document.getElementById('btn-recarregar'),
  btnSalvarTurno: document.getElementById('btn-salvar-turno'),
  turnoInput: document.getElementById('turno-input'),
  btnSalvarCatalogo: document.getElementById('btn-salvar-catalogo'),
  btnCarregarCatalogo: document.getElementById('btn-carregar-catalogo'),
  btnAdicionarCampo: document.getElementById('btn-adicionar-campo'),
  logout: document.getElementById('logout-link'),
  // Novos elementos para tempo real e histórico
  realTimeToggle: document.getElementById('realtime-toggle'),
  autoSaveToggle: document.getElementById('autosave-toggle'),
  historyList: document.getElementById('history-list'),
  historyRefresh: document.getElementById('history-refresh'),
  exportHistory: document.getElementById('export-history'),
  // Deltas
  deltaPib: document.getElementById('delta-pib'),
  deltaTec: document.getElementById('delta-tec'),
  deltaEst: document.getElementById('delta-est'),
  deltaPaises: document.getElementById('delta-paises'),
  deltaReason: document.getElementById('delta-reason'),
  deltaPreview: document.getElementById('delta-preview'),
  deltaAplicar: document.getElementById('delta-aplicar'),
  deltaSelecionarTodos: document.getElementById('delta-selecionar-todos'),
  deltaLimpar: document.getElementById('delta-limpar'),
  selectedCount: document.getElementById('selected-count'),
  // Player management elements
  playersList: document.getElementById('players-list'),
  availableCountries: document.getElementById('available-countries'),
  playerCount: document.getElementById('player-count'),
  availableCount: document.getElementById('available-count'),
  refreshPlayers: document.getElementById('refresh-players'),
  assignRandom: document.getElementById('assign-random'),
  clearAllAssignments: document.getElementById('clear-all-assignments'),
  playerAnalytics: document.getElementById('player-analytics'),
  bulkAssignments: document.getElementById('bulk-assignments'),
  sendAnnouncement: document.getElementById('send-announcement'),
  // Event simulator elements
  createEvent: document.getElementById('create-event'),
  scenarioTemplates: document.getElementById('scenario-templates'),
  eventHistory: document.getElementById('event-history'),
  eventType: document.getElementById('event-type'),
  eventIntensity: document.getElementById('event-intensity'),
  intensityValue: document.getElementById('intensity-value'),
  eventScope: document.getElementById('event-scope'),
  generateEvent: document.getElementById('generate-event'),
};

function $(sel, ctx=document) { return ctx.querySelector(sel); }

async function carregarCatalogo() {
  try {
    const doc = await db.collection('configuracoes').doc('campos').get();
    catalog = doc.exists ? doc.data() : localCatalog;
  } catch (e) {
    console.warn('Falha ao carregar catálogo, usando local.', e);
    catalog = localCatalog;
  }
}

function renderMenuSecoes() {
  if (!el.menuSecoes || !catalog) return;
  el.menuSecoes.innerHTML = '';
  Object.keys(catalog).forEach((secKey) => {
    const s = catalog[secKey];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `w-full text-left rounded-md px-2 py-1.5 text-sm ${state.secaoSelecionada===secKey? 'bg-white/5 border border-slate-600/40' : 'border border-transparent hover:bg-white/5'}`;
    btn.textContent = s.label || secKey;
    btn.onclick = () => { state.secaoSelecionada = secKey; renderMenuSecoes(); renderForm(); };
    el.menuSecoes.appendChild(btn);
  });
  // Preenche também o select secundário se existir
  if (el.selectSecao) {
    el.selectSecao.innerHTML = Object.keys(catalog).map(key => `<option value="${key}" ${key===state.secaoSelecionada? 'selected':''}>${catalog[key].label||key}</option>`).join('');
  }
}

function renderSelectPaises() {
  if (!el.selectPais) return;
  el.selectPais.innerHTML = '';
  state.paises.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.Pais || p.id;
    el.selectPais.appendChild(opt);
  });
  if (!state.paisSelecionado && state.paises.length) {
    state.paisSelecionado = state.paises[0].id;
  }
  if (state.paisSelecionado) el.selectPais.value = state.paisSelecionado;
}

function inputFor(fieldKey, fieldDef, valor) {
  const wrap = document.createElement('div');
  const label = document.createElement('label');
  label.className = 'block text-xs text-slate-400 mb-1';
  label.textContent = fieldDef.label || fieldKey;

  let inp;
  if (fieldDef.tipo === 'opcoes' && Array.isArray(fieldDef.opcoes)) {
    inp = document.createElement('select');
    fieldDef.opcoes.forEach(op => {
      const o = document.createElement('option');
      o.value = op; o.textContent = op; if (valor === op) o.selected = true; inp.appendChild(o);
    });
  } else {
    inp = document.createElement('input');
    if (fieldDef.tipo === 'percent' || fieldDef.tipo === 'inteiro' || fieldDef.tipo === 'moeda') inp.type = 'number';
    else inp.type = 'text';
    inp.value = valor ?? '';
    if (fieldDef.min != null) inp.min = String(fieldDef.min);
    if (fieldDef.max != null) inp.max = String(fieldDef.max);
    
    // Adicionar step apropriado para diferentes tipos
    if (fieldDef.tipo === 'moeda') inp.step = '0.01';
    else if (fieldDef.tipo === 'percent') inp.step = '0.1';
    else if (fieldDef.tipo === 'inteiro') inp.step = '1';
  }
  
  inp.name = fieldKey;
  inp.className = 'mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors';
  
  // Adicionar indicador de mudanças em tempo real
  if (state.realTimeEnabled) {
    const indicator = document.createElement('div');
    indicator.className = 'absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full opacity-0 transition-opacity';
    indicator.id = `indicator-${fieldKey}`;
    
    wrap.style.position = 'relative';
    wrap.appendChild(indicator);
    
    // Listener para mudanças em tempo real
    inp.addEventListener('input', async (e) => {
      if (state.autoSave) {
        await handleRealTimeChange(fieldKey, fieldDef, e.target.value, indicator);
      }
    });
    
    // Debounce para evitar muitas chamadas
    inp.addEventListener('blur', async (e) => {
      await handleRealTimeChange(fieldKey, fieldDef, e.target.value, indicator);
    });
  }
  
  wrap.appendChild(label);
  wrap.appendChild(inp);

  return { 
    wrap, 
    input: inp,
    get: () => (fieldDef.tipo==='inteiro'||fieldDef.tipo==='percent'||fieldDef.tipo==='moeda') ? Number(inp.value || 0) : (inp.value ?? ''),
    set: (value) => { inp.value = value ?? ''; },
    showChange: () => {
      const indicator = wrap.querySelector(`#indicator-${fieldKey}`);
      if (indicator) {
        indicator.style.opacity = '1';
        setTimeout(() => indicator.style.opacity = '0', 2000);
      }
    }
  };
}

function renderForm() {
  if (!catalog || !el.formSecao) return;
  const pais = state.paises.find(p => p.id === state.paisSelecionado);
  const sec = catalog[state.secaoSelecionada];
  const dadosSecao = (pais && pais[state.secaoSelecionada]) || {};
  el.formSecao.innerHTML = '';
  if (el.listaCampos) el.listaCampos.innerHTML = '';

  const getters = {};
  (sec.campos||[]).forEach(def => {
    const g = inputFor(def.key, def, dadosSecao[def.key] ?? pais?.[def.key]);
    el.formSecao.appendChild(g.wrap);
    getters[def.key] = g.get;
    if (el.listaCampos) {
      const li = document.createElement('div');
      li.className = 'text-slate-300 text-sm';
      li.textContent = `${def.label || def.key} (${def.tipo})`;
      el.listaCampos.appendChild(li);
    }
  });

  // Sistema de salvamento em tempo real ou manual
  if (el.btnSalvarSecao) {
    // Atualizar texto do botão baseado no modo
    el.btnSalvarSecao.textContent = state.realTimeEnabled ? 'Aplicar Todas' : 'Salvar Seção';
    
    el.btnSalvarSecao.onclick = async () => {
      if (!pais) return;
      
      try {
        el.btnSalvarSecao.disabled = true;
        el.btnSalvarSecao.textContent = 'Salvando...';
        
        const payload = {};
        Object.keys(getters).forEach(k => payload[k] = getters[k]());
        
        // Validações básicas
        const defsByKey = Object.fromEntries((sec.campos||[]).map(d => [d.key, d]));
        for (const [k,v] of Object.entries(payload)) {
          const d = defsByKey[k];
          if (!d) continue;
          if (d.min != null && v < d.min) { 
            showNotification('error', `Campo ${d.label||k}: mínimo ${d.min}`);
            return; 
          }
          if (d.max != null && v > d.max) { 
            showNotification('error', `Campo ${d.label||k}: máximo ${d.max}`);
            return; 
          }
        }
        
        // Sempre usar modo direto e sincronizar raiz com geral
        const updateData = {
          [`${state.secaoSelecionada}`]: payload
        };
        
        // Se estamos editando a seção "geral", também atualizar campos na raiz
        if (state.secaoSelecionada === 'geral') {
          Object.entries(payload).forEach(([key, value]) => {
            // Campos que devem ser sincronizados na raiz
            if (['PIB', 'Populacao', 'Estabilidade', 'Tecnologia', 'Urbanizacao', 'ModeloPolitico', 'Visibilidade'].includes(key)) {
              updateData[key] = value;
            }
          });
        }
        
        await db.collection('paises').doc(pais.id).update(updateData);
        
        showNotification('success', 'Seção salva com sucesso');
        
      } catch (e) {
        Logger.error('Erro ao salvar seção:', e);
        showNotification('error', `Erro ao salvar: ${e.message}`);
      } finally {
        el.btnSalvarSecao.disabled = false;
        el.btnSalvarSecao.textContent = state.realTimeEnabled ? 'Aplicar Todas' : 'Salvar Seção';
      }
    };
  }
}

// carregarTudo definido no final do arquivo com funcionalidades adicionais

async function gatekeeper(user) {
  if (!user) { window.location.href = 'index.html'; return; }
  try {
    const perms = await checkUserPermissions(user.uid);
    const allowed = perms.isNarrator || perms.isAdmin;
    if (!allowed) {
      if (el.gate) el.gate.classList.remove('hidden');
      el.adminRoot?.classList.add('hidden');
      return;
    }
    if (el.gate) el.gate.classList.add('hidden');
    el.adminRoot?.classList.remove('hidden');
    await carregarCatalogo();
    await carregarTudo();
  } catch (e) {
    console.error('Erro no gatekeeper', e);
    if (el.gate) el.gate.classList.remove('hidden');
    el.adminRoot?.classList.add('hidden');
  }
}

// Eventos básicos
if (el.selectPais) el.selectPais.addEventListener('change', (e)=> { state.paisSelecionado = e.target.value; renderForm(); });
if (el.selectSecao) el.selectSecao.addEventListener('change', (e)=> { state.secaoSelecionada = e.target.value; renderMenuSecoes(); renderForm(); });
if (el.btnRecarregar) el.btnRecarregar.addEventListener('click', carregarTudo);
if (el.btnSalvarTurno) el.btnSalvarTurno.addEventListener('click', async ()=>{
  const n = Number(el.turnoInput?.value||'');
  if (Number.isNaN(n) || n < 0) { alert('Informe um número de turno válido.'); return; }
  const ok = await updateTurn(n);
  if (ok) { alert(`Turno atualizado para #${n}`); await carregarTudo(); }
  else { alert('Erro ao salvar turno.'); }
});
if (el.btnSalvarCatalogo) el.btnSalvarCatalogo.addEventListener('click', async ()=>{
  try { await db.collection('configuracoes').doc('campos').set(catalog || localCatalog, { merge: false }); alert('Catálogo salvo no servidor.'); }
  catch (e) { console.error(e); alert('Erro ao salvar catálogo.'); }
});
if (el.btnCarregarCatalogo) el.btnCarregarCatalogo.addEventListener('click', async ()=>{ await carregarCatalogo(); renderMenuSecoes(); renderForm(); });
if (el.btnAdicionarCampo) el.btnAdicionarCampo.addEventListener('click', ()=>{
  const sec = catalog[state.secaoSelecionada]; if (!sec) return;
  const key = prompt('Chave do campo (sem espaços, ex: LanchaTorpedeira)'); if (!key) return;
  const label = prompt('Rótulo (ex: Lancha torpedeira)') || key;
  const tipo = prompt('Tipo (inteiro|percent|moeda|texto|opcoes)', 'inteiro') || 'inteiro';
  const opcoes = (tipo==='opcoes') ? (prompt('Opções separadas por vírgula', 'Público,Privado')||'').split(',').map(s=>s.trim()) : undefined;
  sec.campos.push({ key, label, tipo, ...(opcoes?{opcoes}:{} )});
  renderForm();
  renderMenuSecoes();
});
if (el.logout) el.logout.addEventListener('click', (e)=>{ e.preventDefault(); auth.signOut(); });

// Função para lidar com mudanças em tempo real (DESABILITADA)
async function handleRealTimeChange(fieldKey, fieldDef, value, indicator) {
  // Auto-save desabilitado para evitar problemas - use o botão "Salvar Seção"
  return;
  
  try {
    // Converter valor baseado no tipo
    let processedValue;
    if (fieldDef.tipo === 'inteiro' || fieldDef.tipo === 'percent' || fieldDef.tipo === 'moeda') {
      processedValue = Number(value || 0);
    } else {
      processedValue = value ?? '';
    }
    
    // Validação rápida
    if (fieldDef.min != null && processedValue < fieldDef.min) return;
    if (fieldDef.max != null && processedValue > fieldDef.max) return;
    
    // Aplicar mudança em tempo real
    await realTimeUpdates.updateField({
      countryId: state.paisSelecionado,
      section: state.secaoSelecionada,
      field: fieldKey,
      value: processedValue,
      reason: 'Edição em tempo real'
    });
    
    // Mostrar indicador visual
    if (indicator) {
      indicator.style.opacity = '1';
      setTimeout(() => indicator.style.opacity = '0', 2000);
    }
    
  } catch (error) {
    Logger.warn('Erro na mudança em tempo real:', error);
    // Em caso de erro, não mostrar notificação para não incomodar o usuário
  }
}

// Função para configurar listeners de tempo real
function setupRealTimeListeners() {
  // Limpar listeners existentes
  state.listeners.forEach(unsubscribe => unsubscribe());
  state.listeners.clear();
  
  if (!state.paisSelecionado) return;
  
  // Listener para mudanças no país atual
  const countryUnsubscribe = realTimeUpdates.subscribeToCountryChanges(
    state.paisSelecionado,
    (changeData) => {
      // Atualizar formulário se necessário
      updateFormFromRealTimeData(changeData.data);
    }
  );
  
  state.listeners.set('country', countryUnsubscribe);
  
  // Listener para histórico
  const { unsubscribe: historyUnsubscribe } = realTimeUpdates.subscribeToHistory(
    { countryId: state.paisSelecionado, limit: 20 },
    (changes) => {
      updateHistoryDisplay(changes);
    }
  );
  
  state.listeners.set('history', historyUnsubscribe);
}

// Função para atualizar formulário com dados em tempo real
function updateFormFromRealTimeData(countryData) {
  if (!countryData || !catalog || !state.secaoSelecionada) return;
  
  const sectionData = countryData[state.secaoSelecionada] || {};
  const section = catalog[state.secaoSelecionada];
  
  (section.campos || []).forEach(field => {
    const input = document.querySelector(`input[name="${field.key}"], select[name="${field.key}"]`);
    if (input && sectionData[field.key] !== undefined) {
      const newValue = sectionData[field.key];
      if (input.value != newValue) {
        input.value = newValue;
        
        // Mostrar indicador de mudança externa
        const indicator = document.querySelector(`#indicator-${field.key}`);
        if (indicator) {
          indicator.style.backgroundColor = '#3b82f6'; // azul para mudanças externas
          indicator.style.opacity = '1';
          setTimeout(() => {
            indicator.style.backgroundColor = '#10b981'; // volta ao verde
            indicator.style.opacity = '0';
          }, 3000);
        }
      }
    }
  });
}

// Função para atualizar display do histórico
function updateHistoryDisplay(changes) {
  const historyList = document.getElementById('history-list');
  if (!historyList) return;
  
  historyList.innerHTML = '';
  
  changes.forEach(change => {
    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-3 bg-bg-soft/50 rounded-lg border border-bg-ring/30';
    
    const timeAgo = formatTimeAgo(change.timestamp);
    const fieldLabel = catalog[change.section]?.campos?.find(f => f.key === change.field)?.label || change.field;
    
    item.innerHTML = `
      <div class="flex-1">
        <div class="text-sm font-medium text-slate-200">
          ${fieldLabel} (${catalog[change.section]?.label})
        </div>
        <div class="text-xs text-slate-400">
          ${change.oldValue} → ${change.newValue} • ${change.userName}
        </div>
        ${change.reason ? `<div class="text-xs text-slate-500 mt-1">${change.reason}</div>` : ''}
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span>${timeAgo}</span>
        ${!change.rolledBack ? `<button onclick="rollbackSingle('${change.id}')" class="text-red-400 hover:text-red-300">↶</button>` : '<span class="text-slate-500">Revertido</span>'}
      </div>
    `;
    
    historyList.appendChild(item);
  });
}

// Função para rollback individual
window.rollbackSingle = async function(changeId) {
  try {
    const confirmed = await showConfirmBox(
      'Confirmar Rollback',
      'Tem certeza que deseja reverter esta mudança?',
      'Reverter',
      'Cancelar'
    );
    
    if (!confirmed) return;
    
    await changeHistory.rollbackChange(changeId, 'Revertido via interface do narrador');
    showNotification('success', 'Mudança revertida com sucesso');
    
  } catch (error) {
    Logger.error('Erro no rollback:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
};

// Função auxiliar para formatar tempo
function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'agora';
  if (diffMins < 60) return `${diffMins}min`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

// Setup de event listeners para controles de tempo real
function setupRealTimeControls() {
  // Toggle de tempo real
  if (el.realTimeToggle) {
    el.realTimeToggle.addEventListener('change', (e) => {
      state.realTimeEnabled = e.target.checked;
      renderForm(); // Re-render para aplicar/remover listeners
      
      if (state.realTimeEnabled) {
        showNotification('info', 'Sistema de tempo real ativado');
      } else {
        showNotification('info', 'Sistema de tempo real desativado');
      }
    });
  }
  
  // Toggle de auto save
  if (el.autoSaveToggle) {
    el.autoSaveToggle.addEventListener('change', (e) => {
      state.autoSave = e.target.checked;
      if (state.autoSave && state.realTimeEnabled) {
        showNotification('info', 'Auto-salvamento ativado');
      } else if (!state.autoSave) {
        showNotification('info', 'Auto-salvamento desativado');
      }
    });
  }
  
  // Controles de histórico
  if (el.historyRefresh) {
    el.historyRefresh.addEventListener('click', () => {
      setupRealTimeListeners(); // Recarrega o histórico
    });
  }
  
  if (el.exportHistory) {
    el.exportHistory.addEventListener('click', exportHistoryToCSV);
  }
  
  // Controles de deltas em massa
  setupDeltaControls();
}

// Setup dos controles de deltas
function setupDeltaControls() {
  if (el.deltaSelecionarTodos) {
    el.deltaSelecionarTodos.addEventListener('click', () => {
      const checkboxes = el.deltaPaises.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = true);
      updateSelectedCount();
    });
  }
  
  if (el.deltaLimpar) {
    el.deltaLimpar.addEventListener('click', () => {
      const checkboxes = el.deltaPaises.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(cb => cb.checked = false);
      updateSelectedCount();
      
      // Limpar inputs
      if (el.deltaPib) el.deltaPib.value = '';
      if (el.deltaTec) el.deltaTec.value = '';
      if (el.deltaEst) el.deltaEst.value = '';
      if (el.deltaReason) el.deltaReason.value = '';
    });
  }
  
  if (el.deltaPreview) {
    el.deltaPreview.addEventListener('click', previewDeltas);
  }
  
  if (el.deltaAplicar) {
    el.deltaAplicar.addEventListener('click', applyMassDeltas);
  }
}

// Atualiza contador de países selecionados
function updateSelectedCount() {
  const checkboxes = el.deltaPaises.querySelectorAll('input[type="checkbox"]:checked');
  const count = checkboxes.length;
  
  if (el.selectedCount) {
    el.selectedCount.textContent = `${count} países selecionados`;
  }
  
  // Habilitar/desabilitar botão aplicar
  if (el.deltaAplicar) {
    el.deltaAplicar.disabled = count === 0;
  }
}

// Renderiza lista de países para deltas
function renderDeltaCountries() {
  if (!el.deltaPaises) return;
  
  el.deltaPaises.innerHTML = '';
  
  state.paises.forEach(pais => {
    const item = document.createElement('label');
    item.className = 'flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = pais.id;
    checkbox.className = 'rounded border-bg-ring/70 bg-bg text-brand-500 focus:ring-brand-500/50';
    checkbox.addEventListener('change', updateSelectedCount);
    
    const label = document.createElement('span');
    label.className = 'text-sm text-slate-300';
    label.textContent = pais.Pais || pais.id;
    
    item.appendChild(checkbox);
    item.appendChild(label);
    el.deltaPaises.appendChild(item);
  });
  
  updateSelectedCount();
}

// Prévia dos deltas
async function previewDeltas() {
  const selectedCountries = getSelectedCountriesForDelta();
  const deltas = getDeltaValues();
  
  if (selectedCountries.length === 0) {
    showNotification('warning', 'Selecione pelo menos um país');
    return;
  }
  
  if (!hasValidDeltas(deltas)) {
    showNotification('warning', 'Informe pelo menos um valor de delta');
    return;
  }
  
  try {
    // Criar modal de prévia
    const previewModal = createPreviewModal(selectedCountries, deltas);
    document.body.appendChild(previewModal);
    
  } catch (error) {
    Logger.error('Erro na prévia:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
}

// Aplicar deltas em massa
async function applyMassDeltas() {
  const selectedCountries = getSelectedCountriesForDelta();
  const deltas = getDeltaValues();
  const reason = el.deltaReason?.value || 'Aplicação de deltas em massa';
  
  if (selectedCountries.length === 0) {
    showNotification('warning', 'Selecione pelo menos um país');
    return;
  }
  
  if (!hasValidDeltas(deltas)) {
    showNotification('warning', 'Informe pelo menos um valor de delta');
    return;
  }
  
  try {
    const confirmed = await showConfirmBox(
      'Confirmar Deltas em Massa',
      `Aplicar deltas em ${selectedCountries.length} países?\n\nEsta ação será registrada no histórico e pode ser revertida.`,
      'Aplicar',
      'Cancelar'
    );
    
    if (!confirmed) return;
    
    el.deltaAplicar.disabled = true;
    el.deltaAplicar.textContent = 'Aplicando...';
    
    const countryIds = selectedCountries.map(country => country.id);
    const deltaObject = {
      geral: {}
    };
    
    if (deltas.pib !== 0) deltaObject.geral.PIB = deltas.pib;
    if (deltas.tecnologia !== 0) deltaObject.geral.Tecnologia = deltas.tecnologia;
    if (deltas.estabilidade !== 0) deltaObject.geral.Estabilidade = deltas.estabilidade;
    
    const batchId = await realTimeUpdates.applyMassDeltas({
      countryIds,
      deltas: deltaObject,
      reason
    });
    
    showNotification('success', `Deltas aplicados com sucesso! Batch ID: ${batchId}`);
    
    // Limpar formulário
    el.deltaLimpar.click();
    
  } catch (error) {
    Logger.error('Erro ao aplicar deltas:', error);
    showNotification('error', `Erro: ${error.message}`);
  } finally {
    el.deltaAplicar.disabled = false;
    el.deltaAplicar.textContent = '⚡ Aplicar em Tempo Real';
  }
}

// Funções auxiliares
function getSelectedCountriesForDelta() {
  const checkboxes = el.deltaPaises.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => {
    return state.paises.find(p => p.id === cb.value);
  }).filter(Boolean);
}

function getDeltaValues() {
  return {
    pib: parseFloat(el.deltaPib?.value) || 0,
    tecnologia: parseFloat(el.deltaTec?.value) || 0,
    estabilidade: parseFloat(el.deltaEst?.value) || 0
  };
}

function hasValidDeltas(deltas) {
  return deltas.pib !== 0 || deltas.tecnologia !== 0 || deltas.estabilidade !== 0;
}

function createPreviewModal(countries, deltas) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-2xl w-full max-h-96 overflow-y-auto';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">Prévia dos Deltas</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div class="space-y-4">
      <div class="grid grid-cols-3 gap-4 p-3 bg-bg/50 rounded-lg">
        <div class="text-center">
          <div class="text-xs text-slate-400">PIB</div>
          <div class="font-semibold ${deltas.pib > 0 ? 'text-emerald-400' : deltas.pib < 0 ? 'text-red-400' : 'text-slate-500'}">
            ${deltas.pib !== 0 ? (deltas.pib > 0 ? '+' : '') + deltas.pib + '%' : '—'}
          </div>
        </div>
        <div class="text-center">
          <div class="text-xs text-slate-400">Tecnologia</div>
          <div class="font-semibold ${deltas.tecnologia > 0 ? 'text-emerald-400' : deltas.tecnologia < 0 ? 'text-red-400' : 'text-slate-500'}">
            ${deltas.tecnologia !== 0 ? (deltas.tecnologia > 0 ? '+' : '') + deltas.tecnologia : '—'}
          </div>
        </div>
        <div class="text-center">
          <div class="text-xs text-slate-400">Estabilidade</div>
          <div class="font-semibold ${deltas.estabilidade > 0 ? 'text-emerald-400' : deltas.estabilidade < 0 ? 'text-red-400' : 'text-slate-500'}">
            ${deltas.estabilidade !== 0 ? (deltas.estabilidade > 0 ? '+' : '') + deltas.estabilidade : '—'}
          </div>
        </div>
      </div>
      
      <div>
        <div class="text-sm font-medium text-slate-300 mb-2">Países Afetados (${countries.length}):</div>
        <div class="grid grid-cols-2 gap-2 text-sm text-slate-400">
          ${countries.map(c => `<div>• ${c.Pais || c.id}</div>`).join('')}
        </div>
      </div>
    </div>
    
    <div class="mt-6 flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg border border-bg-ring/70 text-slate-300 hover:bg-white/5">
        Fechar
      </button>
      <button onclick="this.closest('.fixed').remove(); document.getElementById('delta-aplicar').click()" class="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400">
        Aplicar Agora
      </button>
    </div>
  `;
  
  modal.appendChild(content);
  return modal;
}

// Exportar histórico para CSV
async function exportHistoryToCSV() {
  if (!state.paisSelecionado) {
    showNotification('warning', 'Selecione um país primeiro');
    return;
  }
  
  try {
    const history = await changeHistory.getChangeHistory({
      countryId: state.paisSelecionado,
      limit: 1000 // Exportar até 1000 registros
    });
    
    if (history.length === 0) {
      showNotification('info', 'Nenhum histórico encontrado para exportar');
      return;
    }
    
    const csvContent = [
      ['Data', 'Seção', 'Campo', 'Valor Anterior', 'Valor Novo', 'Usuário', 'Motivo'].join(','),
      ...history.map(h => [
        h.timestamp.toISOString(),
        h.section,
        h.field,
        h.oldValue,
        h.newValue,
        h.userName,
        h.reason || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `historico_${state.paisSelecionado}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('success', 'Histórico exportado com sucesso');
    
  } catch (error) {
    Logger.error('Erro ao exportar histórico:', error);
    showNotification('error', `Erro na exportação: ${error.message}`);
  }
}

// Carregamento atualizado
async function carregarTudo() {
  const cfg = await getGameConfig();
  if (cfg && cfg.turnoAtual && el.turnoAtual) el.turnoAtual.textContent = `#${cfg.turnoAtual}`;
  if (cfg && cfg.turnoAtual && el.turnoInput) el.turnoInput.value = cfg.turnoAtual;
  state.paises = await getAllCountries();
  state.paises.sort((a,b)=> (a.Pais||'').localeCompare(b.Pais||''));
  renderSelectPaises();
  renderMenuSecoes();
  renderForm();
  renderDeltaCountries(); // Renderizar lista de países para deltas
  setupRealTimeControls(); // Setup dos controles de tempo real
  
  // Inicializar ferramentas avançadas e gerenciamento de jogadores
  await advancedTools.init();
  await initPlayerManagement();
  await initEventSimulator();
}

auth.onAuthStateChanged(gatekeeper);

// Event listeners para mudanças de país/seção
if (el.selectPais) el.selectPais.addEventListener('change', (e) => { 
  state.paisSelecionado = e.target.value; 
  setupRealTimeListeners();
  renderForm(); 
});

if (el.selectSecao) el.selectSecao.addEventListener('change', (e) => { 
  state.secaoSelecionada = e.target.value; 
  setupRealTimeListeners();
  renderMenuSecoes(); 
  renderForm(); 
});

// Inicializaçãoo do gerenciamento de jogadores
async function initPlayerManagement() {
  try {
    await playerManager.loadPlayers();
    await playerManager.loadCountries();
    playerManager.setupRealTimeListeners();
    
    renderPlayersList();
    renderAvailableCountries();
    setupPlayerManagementListeners();
    
    Logger.info('Sistema de gerenciamento de jogadores inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar gerenciamento de jogadores:', error);
  }
}

// Setup dos event listeners para gerenciamento de jogadores
function setupPlayerManagementListeners() {
  if (el.refreshPlayers) {
    el.refreshPlayers.addEventListener('click', async () => {
      await playerManager.loadPlayers();
      await playerManager.loadCountries();
      renderPlayersList();
      renderAvailableCountries();
    });
  }
  
  if (el.assignRandom) {
    el.assignRandom.addEventListener('click', async () => {
      await playerManager.assignRandomCountries();
      renderPlayersList();
      renderAvailableCountries();
    });
  }
  
  if (el.clearAllAssignments) {
    el.clearAllAssignments.addEventListener('click', async () => {
      await playerManager.clearAllAssignments();
      renderPlayersList();
      renderAvailableCountries();
    });
  }
  
  if (el.playerAnalytics) {
    el.playerAnalytics.addEventListener('click', showPlayerAnalytics);
  }
  
  if (el.sendAnnouncement) {
    el.sendAnnouncement.addEventListener('click', showAnnouncementModal);
  }
  
  // Listener para updates em tempo real
  window.addEventListener('playerManager:update', (e) => {
    if (e.detail.type === 'players') {
      renderPlayersList();
    } else if (e.detail.type === 'countries') {
      renderAvailableCountries();
    }
  });
}

// Renderiza lista de jogadores
function renderPlayersList() {
  if (!el.playersList) return;
  
  const players = playerManager.players.filter(p => p.paisId);
  
  if (el.playerCount) {
    el.playerCount.textContent = `${players.length} jogadores`;
  }
  
  if (players.length === 0) {
    el.playersList.innerHTML = `
      <div class="text-sm text-slate-500 text-center py-4">
        Nenhum jogador com país atribuído
      </div>
    `;
    return;
  }
  
  const playersHtml = players.map(player => {
    const country = playerManager.countries.find(c => c.id === player.paisId);
    const lastLoginText = player.lastLogin ? 
      formatTimeAgo(player.lastLogin) : 'Nunca';
    
    return `
      <div class="flex items-center justify-between p-2 rounded-lg border border-bg-ring/30 hover:bg-white/5">
        <div class="flex-1">
          <div class="text-sm font-medium text-slate-200">
            ${player.nome || 'Sem nome'}
          </div>
          <div class="text-xs text-slate-400">
            ${country?.Pais || 'País não encontrado'} • ${lastLoginText}
          </div>
        </div>
        <div class="flex gap-1">
          <button onclick="unassignPlayer('${player.paisId}')" 
                  class="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded transition-colors"
                  title="Remover atribuição">
            ❌
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  el.playersList.innerHTML = playersHtml;
}

// Renderiza países disponíveis
function renderAvailableCountries() {
  if (!el.availableCountries) return;
  
  const availableCountries = playerManager.countries.filter(c => !c.Player);
  
  if (el.availableCount) {
    el.availableCount.textContent = `${availableCountries.length} países`;
  }
  
  if (availableCountries.length === 0) {
    el.availableCountries.innerHTML = `
      <div class="text-sm text-slate-500 text-center py-4">
        Todos os países estão atribuídos
      </div>
    `;
    return;
  }
  
  const countriesHtml = availableCountries.map(country => {
    const gdp = country.geral?.PIB;
    const stability = country.geral?.Estabilidade;
    
    return `
      <div class="flex items-center justify-between p-2 rounded-lg border border-bg-ring/30 hover:bg-white/5">
        <div class="flex-1">
          <div class="text-sm font-medium text-slate-200">
            ${country.Pais || country.id}
          </div>
          <div class="text-xs text-slate-400">
            PIB: ${gdp ? (typeof gdp === 'number' ? gdp.toLocaleString() : gdp) : '-'} • 
            Est: ${stability || '-'}%
          </div>
        </div>
        <div class="flex gap-1">
          <button onclick="quickAssignCountry('${country.id}')" 
                  class="text-emerald-400 hover:text-emerald-300 text-xs px-2 py-1 rounded transition-colors"
                  title="Atribuição rápida">
            ➕
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  el.availableCountries.innerHTML = countriesHtml;
}

// Funções globais para os botões
window.unassignPlayer = async function(countryId) {
  try {
    await playerManager.unassignCountry(countryId);
    renderPlayersList();
    renderAvailableCountries();
  } catch (error) {
    Logger.error('Erro ao remover atribuição:', error);
  }
};

window.quickAssignCountry = async function(countryId) {
  const playersWithoutCountries = playerManager.players.filter(p => 
    p.papel !== 'admin' && p.papel !== 'narrador' && !p.paisId
  );
  
  if (playersWithoutCountries.length === 0) {
    showNotification('warning', 'Nenhum jogador disponível para atribuição');
    return;
  }
  
  // Mostrar modal de seleção de jogador
  showPlayerSelectionModal(countryId, playersWithoutCountries);
};

// Modal de seleção de jogador
function showPlayerSelectionModal(countryId, players) {
  const country = playerManager.countries.find(c => c.id === countryId);
  if (!country) return;
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-md w-full';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">Atribuir ${country.Pais}</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">
        ✕
      </button>
    </div>
    
    <div class="mb-4">
      <label class="text-sm text-slate-400 mb-2 block">Selecionar jogador:</label>
      <select id="player-select" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm">
        <option value="">-- Escolha um jogador --</option>
        ${players.map(p => `<option value="${p.id}">${p.nome || p.id}</option>`).join('')}
      </select>
    </div>
    
    <div class="mb-4">
      <label class="text-sm text-slate-400 mb-2 block">Motivo (opcional):</label>
      <input id="assignment-reason" type="text" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm" placeholder="Ex.: Atribuição manual, substituição, etc." />
    </div>
    
    <div class="flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg border border-bg-ring/70 text-slate-300 hover:bg-white/5">
        Cancelar
      </button>
      <button onclick="confirmPlayerAssignment('${countryId}', this.closest('.fixed'))" class="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400">
        Atribuir
      </button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
}

window.confirmPlayerAssignment = async function(countryId, modal) {
  const playerSelect = modal.querySelector('#player-select');
  const reasonInput = modal.querySelector('#assignment-reason');
  
  const playerId = playerSelect.value;
  const reason = reasonInput.value;
  
  if (!playerId) {
    showNotification('warning', 'Selecione um jogador');
    return;
  }
  
  try {
    await playerManager.assignCountryToPlayer(playerId, countryId, reason);
    renderPlayersList();
    renderAvailableCountries();
    modal.remove();
  } catch (error) {
    Logger.error('Erro na atribuição:', error);
  }
};

// Mostrar analytics de jogadores
function showPlayerAnalytics() {
  const analytics = playerManager.getPlayerAnalytics();
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-4xl w-full max-h-96 overflow-y-auto';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">📊 Analytics de Jogadores</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✕</button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-bg/50 rounded-lg p-4 border border-blue-500/20">
        <h4 class="text-sm font-semibold text-blue-200 mb-3">👥 Jogadores</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-400">Total:</span><span class="text-slate-200">${analytics.players.total}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Com país:</span><span class="text-emerald-400">${analytics.players.active}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Sem país:</span><span class="text-red-400">${analytics.players.inactive}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Ativos hoje:</span><span class="text-blue-400">${analytics.players.recentlyActive}</span></div>
        </div>
      </div>
      
      <div class="bg-bg/50 rounded-lg p-4 border border-green-500/20">
        <h4 class="text-sm font-semibold text-green-200 mb-3">🌍 Países</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-400">Total:</span><span class="text-slate-200">${analytics.countries.total}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Atribuídos:</span><span class="text-emerald-400">${analytics.countries.assigned}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Disponíveis:</span><span class="text-red-400">${analytics.countries.available}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Taxa:</span><span class="text-blue-400">${analytics.countries.assignmentRate}%</span></div>
        </div>
      </div>
      
      <div class="bg-bg/50 rounded-lg p-4 border border-purple-500/20">
        <h4 class="text-sm font-semibold text-purple-200 mb-3">⚖️ Administração</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-slate-400">Admins:</span><span class="text-purple-400">${analytics.players.admins}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Narradores:</span><span class="text-purple-400">${analytics.players.narrators}</span></div>
          <div class="flex justify-between"><span class="text-slate-400">Semanais:</span><span class="text-purple-400">${analytics.players.weeklyActive}</span></div>
        </div>
      </div>
    </div>
    
    <div class="mt-6 flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500">Fechar</button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Modal de anúncios
function showAnnouncementModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-md w-full';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">📢 Enviar Anúncio</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✕</button>
    </div>
    
    <div class="space-y-4">
      <div>
        <label class="text-sm text-slate-400 mb-2 block">Título:</label>
        <input id="announcement-title" type="text" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm" placeholder="Título do anúncio" />
      </div>
      
      <div>
        <label class="text-sm text-slate-400 mb-2 block">Mensagem:</label>
        <textarea id="announcement-message" rows="4" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm" placeholder="Conteúdo da mensagem..."></textarea>
      </div>
      
      <div>
        <label class="text-sm text-slate-400 mb-2 block">Destinatários:</label>
        <select id="announcement-target" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm">
          <option value="all">Todos os jogadores</option>
          <option value="active">Apenas jogadores com países</option>
          <option value="inactive">Apenas jogadores sem países</option>
        </select>
      </div>
      
      <div>
        <label class="text-sm text-slate-400 mb-2 block">Prioridade:</label>
        <select id="announcement-priority" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm">
          <option value="normal">Normal</option>
          <option value="high">Alta</option>
          <option value="urgent">Urgente</option>
        </select>
      </div>
    </div>
    
    <div class="mt-6 flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg border border-bg-ring/70 text-slate-300 hover:bg-white/5">Cancelar</button>
      <button onclick="sendAnnouncementConfirm(this.closest('.fixed'))" class="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400">Enviar</button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
}

window.sendAnnouncementConfirm = async function(modal) {
  const title = modal.querySelector('#announcement-title').value;
  const message = modal.querySelector('#announcement-message').value;
  const target = modal.querySelector('#announcement-target').value;
  const priority = modal.querySelector('#announcement-priority').value;
  
  if (!title.trim() || !message.trim()) {
    showNotification('warning', 'Título e mensagem são obrigatórios');
    return;
  }
  
  try {
    await playerManager.sendAnnouncement({
      title: title.trim(),
      message: message.trim(),
      targetPlayers: target,
      priority
    });
    
    modal.remove();
  } catch (error) {
    Logger.error('Erro ao enviar anúncio:', error);
  }
};

// Inicialização do simulador de eventos
async function initEventSimulator() {
  try {
    setupEventSimulatorListeners();
    Logger.info('Simulador de eventos inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar simulador de eventos:', error);
  }
}

// Setup dos event listeners para simulador de eventos
function setupEventSimulatorListeners() {
  // Slider de intensidade
  if (el.eventIntensity && el.intensityValue) {
    el.eventIntensity.addEventListener('input', (e) => {
      el.intensityValue.textContent = e.target.value;
    });
  }
  
  // Gerador de eventos
  if (el.generateEvent) {
    el.generateEvent.addEventListener('click', generateRandomEvent);
  }
  
  // Botões principais
  if (el.createEvent) {
    el.createEvent.addEventListener('click', showEventCreatorModal);
  }
  
  if (el.scenarioTemplates) {
    el.scenarioTemplates.addEventListener('click', showScenarioTemplatesModal);
  }
  
  if (el.eventHistory) {
    el.eventHistory.addEventListener('click', showEventHistoryModal);
  }
}

// Gerar evento aleatório
async function generateRandomEvent() {
  try {
    const type = el.eventType?.value || 'random';
    const intensity = parseInt(el.eventIntensity?.value || '5');
    const scope = el.eventScope?.value || 'single';
    
    el.generateEvent.disabled = true;
    el.generateEvent.textContent = 'Gerando...';
    
    const event = eventSimulator.generateRandomEvent(type, intensity, scope);
    
    // Mostrar preview do evento antes de aplicar
    showEventPreview(event);
    
  } catch (error) {
    Logger.error('Erro ao gerar evento:', error);
    showNotification('error', `Erro: ${error.message}`);
  } finally {
    el.generateEvent.disabled = false;
    el.generateEvent.textContent = '🎲 Gerar Evento';
  }
}

// Preview do evento
function showEventPreview(event) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-md w-full';
  
  const effectsText = Object.entries(event.effects || {})
    .map(([field, effect]) => `${field}: ${effect}`)
    .join(', ');
  
  const intensityColor = event.intensity >= 7 ? 'text-red-400' : 
                        event.intensity >= 4 ? 'text-yellow-400' : 'text-green-400';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">🎲 Evento Gerado</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✕</button>
    </div>
    
    <div class="space-y-4">
      <div class="bg-bg/50 rounded-lg p-3 border border-orange-500/20">
        <div class="text-lg font-semibold text-orange-200 mb-2">
          ${event.isPositive ? '✨' : '⚡'} ${event.name}
        </div>
        <div class="text-sm text-slate-300 mb-3">
          ${event.description}
        </div>
        
        <div class="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-slate-400">Tipo:</span>
            <span class="text-slate-200 ml-1 capitalize">${event.type}</span>
          </div>
          <div>
            <span class="text-slate-400">Intensidade:</span>
            <span class="${intensityColor} ml-1 font-semibold">${event.intensity}/10</span>
          </div>
          <div class="col-span-2">
            <span class="text-slate-400">Alcance:</span>
            <span class="text-slate-200 ml-1 capitalize">${event.scope}</span>
          </div>
        </div>
        
        <div class="mt-3 pt-3 border-t border-bg-ring/30">
          <div class="text-xs text-slate-400 mb-1">Efeitos:</div>
          <div class="text-sm ${event.isPositive ? 'text-emerald-300' : 'text-red-300'}">
            ${effectsText || 'Nenhum efeito definido'}
          </div>
        </div>
      </div>
      
      <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
        <div class="text-yellow-200 text-sm font-medium mb-1">⚠️ Confirmação</div>
        <div class="text-yellow-100 text-xs">
          Este evento será aplicado ${event.scope === 'global' ? 'globalmente' : 
          event.scope === 'regional' ? 'regionalmente' : 
          event.scope === 'single' ? 'em um país' : 'nos países selecionados'}.
        </div>
      </div>
    </div>
    
    <div class="mt-6 flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg border border-bg-ring/70 text-slate-300 hover:bg-white/5">
        Cancelar
      </button>
      <button onclick="applyGeneratedEvent('${event.id}', this.closest('.fixed'))" class="px-4 py-2 rounded-lg bg-orange-500 text-slate-950 font-semibold hover:bg-orange-400">
        Aplicar Evento
      </button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Armazenar evento temporariamente
  window.tempEvent = event;
}

window.applyGeneratedEvent = async function(eventId, modal) {
  try {
    const event = window.tempEvent;
    if (!event || event.id !== eventId) {
      showNotification('error', 'Evento não encontrado');
      return;
    }
    
    await eventSimulator.applyEvent(event);
    modal.remove();
    
    // Atualizar displays se necessário
    await advancedTools.refresh();
    
  } catch (error) {
    Logger.error('Erro ao aplicar evento:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
};

// Modal de templates de cenários
function showScenarioTemplatesModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-4xl w-full max-h-96 overflow-y-auto';
  
  const scenarios = {
    oil_crisis: '🛢️ Crise do Petróleo - Reduz PIB global',
    tech_revolution: '💻 Revolução Tecnológica - Beneficia países desenvolvidos', 
    cold_war_intensifies: '🚀 Guerra Fria Intensifica - Reduz estabilidade global',
    economic_boom: '📈 Boom Econômico - Crescimento para países sortudos',
    global_pandemic: '🦠 Pandemia Global - Afeta todos os países'
  };
  
  const scenarioButtons = Object.entries(scenarios)
    .map(([key, description]) => `
      <button onclick="applyScenario('${key}', this.closest('.fixed'))" 
              class="w-full text-left p-3 rounded-lg border border-bg-ring/50 hover:bg-white/5 transition-colors mb-2">
        <div class="font-medium text-sm text-orange-200">${description}</div>
      </button>
    `).join('');
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">📚 Templates de Cenários</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✕</button>
    </div>
    
    <div class="space-y-2">
      ${scenarioButtons}
    </div>
    
    <div class="mt-6 flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500">
        Fechar
      </button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
}

window.applyScenario = async function(scenarioKey, modal) {
  try {
    const confirmed = await showConfirmBox(
      'Aplicar Cenário',
      `Tem certeza que deseja aplicar este cenário? Esta ação afetará múltiplos países.`,
      'Aplicar',
      'Cancelar'
    );
    
    if (!confirmed) return;
    
    await eventSimulator.applyScenario(scenarioKey);
    modal.remove();
    
    // Atualizar displays
    await advancedTools.refresh();
    
  } catch (error) {
    Logger.error('Erro ao aplicar cenário:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
};

// Modal de histórico de eventos
function showEventHistoryModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-6xl w-full max-h-96 overflow-y-auto';
  
  const history = eventSimulator.getEventHistory();
  
  const historyItems = history.length > 0 ? history.map(event => `
    <div class="bg-bg/50 rounded-lg p-3 border border-orange-500/20 mb-3">
      <div class="flex items-center justify-between mb-2">
        <div class="font-medium text-orange-200">${event.name}</div>
        <div class="text-xs text-slate-400">${formatTimeAgo(new Date(event.appliedAt))}</div>
      </div>
      <div class="text-sm text-slate-300 mb-2">${event.description}</div>
      <div class="text-xs text-slate-400">
        Afetou ${event.affectedCountries?.length || 0} países
      </div>
    </div>
  `).join('') : '<div class="text-center text-slate-400 py-8">Nenhum evento aplicado ainda</div>';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">📊 Histórico de Eventos</h3>
      <div class="flex gap-2">
        <button onclick="eventSimulator.clearEventHistory(); this.closest('.fixed').remove()" 
                class="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded border border-red-500/30 hover:bg-red-500/10">
          🗑️ Limpar
        </button>
        <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✕</button>
      </div>
    </div>
    
    <div class="max-h-80 overflow-y-auto">
      ${historyItems}
    </div>
    
    <div class="mt-6 flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg bg-slate-600 text-slate-200 hover:bg-slate-500">
        Fechar
      </button>
    </div>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
}

// Modal de criação de evento personalizado
function showEventCreatorModal() {
  showNotification('info', 'Criador de eventos personalizados em desenvolvimento');
}
