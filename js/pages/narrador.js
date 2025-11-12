import { auth, db, getAllCountries, getGameConfig, updateTurn, checkUserPermissions } from "../services/firebase.js";
import { realTimeUpdates } from "../services/realTimeUpdates.js";
import { changeHistory } from "../services/changeHistory.js";
import { playerManager } from "../services/playerManager.js";
import { VehicleApprovalSystem } from "../components/vehicleApproval.js";
import { NavalProductionSystem } from "../components/navalProduction.js";
import { InventorySystem } from "../components/inventorySystem.js";
import { GenericEquipmentManager } from "../components/genericEquipmentManager.js";
import { initAdvancedCountryEditor } from "../components/advancedCountryEditor.js";
import { showNotification, Logger, showConfirmBox } from "../utils.js";
import { initEconomicSimulator } from "../systems/economicSimulator.js";
import { calculatePIBTotal, formatCurrency, formatPIBPerCapita } from "../utils/pibCalculations.js";
import { runAdvancedEconomyMigration } from '../../scripts/migrate-advanced-economy.js';
import { initTabSystem } from "../utils/tabSystem.js";
import { WorldMap } from "../components/worldMap.js";
import { MapControls } from "../components/mapControls.js";
import { initDivisionsApprovalSystem } from "../systems/divisionsApprovalSystem.js";

// Catálogo local (fallback). Pode ser salvo no Firestore em configuracoes/campos
const localCatalog = {
  geral: {
    label: "Geral",
    campos: [
      { key: "PIBPerCapita", label: "PIB per Capita", tipo: "moeda", min: 0 },
      { key: "PIB", label: "PIB Total", tipo: "calculado", dependeDe: ["PIBPerCapita", "Populacao"] },
      { key: "Populacao", label: "População", tipo: "inteiro", min: 0 },
      { key: "Estabilidade", label: "Estabilidade", tipo: "percent", min: 0, max: 100 },
      { key: "Burocracia", label: "Burocracia", tipo: "percent", min: 0, max: 100 },
      { key: "Urbanizacao", label: "Urbanização", tipo: "percent", min: 0, max: 100 },
      { key: "Tecnologia", label: "Tecnologia", tipo: "percent", min: 0, max: 100 },
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
  recursos: { label: "Recursos", campos: [
    { key: "Graos", label: "Graos (estoque)", tipo: "inteiro", min: 0 },
    { key: "Combustivel", label: "Combustível (unidades)", tipo: "inteiro", min: 0 },
    { key: "CombustivelSaldo", label: "Saldo de Combustível", tipo: "inteiro" },
    { key: "Metais", label: "Metais", tipo: "inteiro" },
    { key: "PotencialCarvao", label: "Potencial de Carvão (Jazidas)", tipo: "inteiro", min: 0 }
  ] },
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
  realTimeToggle: document.getElementById('realtime-toggle'),
  autoSaveToggle: document.getElementById('autosave-toggle'),
  historyList: document.getElementById('history-list'),
  historyRefresh: document.getElementById('history-refresh'),
  exportHistory: document.getElementById('export-history'),
  playersList: document.getElementById('players-list'),
  availableCountries: document.getElementById('available-countries'),
  playerCount: document.getElementById('player-count'),
  availableCount: document.getElementById('available-count'),
  refreshPlayers: document.getElementById('refresh-players'),
  assignRandom: document.getElementById('assign-random'),
  clearAllAssignments: document.getElementById('clear-all-assignments'),

  // Gestão Manual de Exaustão
  exhaustionCountrySelect: document.getElementById('exhaustion-country-select'),
  exhaustionValueInput: document.getElementById('exhaustion-value-input'),
  exhaustionReasonInput: document.getElementById('exhaustion-reason-input'),
  btnApplyManualExhaustion: document.getElementById('btn-apply-manual-exhaustion'),

  // Gestão de Estado de Guerra
  warCountrySelect: document.getElementById('war-country-select'),
  warTargetSelect: document.getElementById('war-target-select'),
  currentWarsDisplay: document.getElementById('current-wars-display'),
  btnUpdateWarStatus: document.getElementById('btn-update-war-status'),
};

async function carregarCatalogo() {
  try {
    const doc = await db.collection('configuracoes').doc('campos').get();
    const remote = doc.exists ? doc.data() : {};
    // merge missing sections from localCatalog so UI always has sensible fields
    catalog = Object.assign({}, localCatalog, remote);
    // ensure nested sections are merged (avoid overwriting local campos with empty remote)
    Object.keys(localCatalog).forEach(k => {
      if (!catalog[k]) catalog[k] = localCatalog[k];
      else if (!catalog[k].campos || catalog[k].campos.length === 0) catalog[k].campos = localCatalog[k].campos;
    });
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
    btn.onclick = () => { 
      state.secaoSelecionada = secKey; 
      renderMenuSecoes(); 
      renderForm(); 
    };
    el.menuSecoes.appendChild(btn);
  });
  if (el.selectSecao) {
    el.selectSecao.innerHTML = Object.keys(catalog).map(key => `<option value="${key}" ${key===state.secaoSelecionada? 'selected':''}>${catalog[key].label||key}</option>`).join('');
  }
}

function renderSelectPaises() {
  const selects = [el.selectPais, el.exhaustionCountrySelect, el.warCountrySelect].filter(Boolean);
  if (selects.length === 0) return;

  const optionsHtml = state.paises.map(p => `<option value="${p.id}">${p.Pais || p.id}</option>`).join('');

  selects.forEach(select => {
    select.innerHTML = optionsHtml;
    if (select.id === 'select-pais' && state.paisSelecionado) {
      select.value = state.paisSelecionado;
    }
  });

  if (!state.paisSelecionado && state.paises.length) {
    state.paisSelecionado = state.paises[0].id;
  }
}

function inputFor(fieldKey, fieldDef, valor, paisData = null) {
  const wrap = document.createElement('div');
  const label = document.createElement('label');
  label.className = 'block text-xs text-slate-400 mb-1';
  label.textContent = fieldDef.label || fieldKey;
  let inp;
  if (fieldDef.tipo === 'calculado') {
    inp = document.createElement('div');
    inp.className = 'mt-1 w-full rounded-lg bg-slate-700/50 border border-slate-600 p-2 text-sm text-slate-300 italic';
    if (fieldKey === 'PIB' && paisData) {
      const populacao = parseFloat(paisData.Populacao) || 0;
      const pibPerCapita = parseFloat(paisData.PIBPerCapita) || 0;
      const pibTotal = calculatePIBTotal(populacao, pibPerCapita);
      inp.textContent = `${formatCurrency(pibTotal)} (calculado)`;
      inp.dataset.calculatedValue = pibTotal;
    } else {
      inp.textContent = 'Campo calculado';
    }
    inp.name = fieldKey;
  } else if (fieldDef.tipo === 'opcoes' && Array.isArray(fieldDef.opcoes)) {
    inp = document.createElement('select');
    fieldDef.opcoes.forEach(op => {
      const o = document.createElement('option');
      o.value = op; o.textContent = op; if (valor === op) o.selected = true; inp.appendChild(o);
    });
    inp.name = fieldKey;
    inp.className = 'mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors';
  } else {
    inp = document.createElement('input');
    if (fieldDef.tipo === 'percent' || fieldDef.tipo === 'inteiro' || fieldDef.tipo === 'moeda') inp.type = 'number';
    else inp.type = 'text';
    inp.value = valor ?? '';
    if (fieldDef.min != null) inp.min = String(fieldDef.min);
    if (fieldDef.max != null) inp.max = String(fieldDef.max);
    if (fieldDef.tipo === 'moeda') inp.step = '0.01';
    else if (fieldDef.tipo === 'percent') inp.step = '0.1';
    else if (fieldDef.tipo === 'inteiro') inp.step = '1';
    inp.name = fieldKey;
    inp.className = 'mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors';
  }
  wrap.appendChild(label);
  wrap.appendChild(inp);
  return { 
    wrap, 
    input: inp,
    get: () => {
      if (fieldDef.tipo === 'calculado') {
        return Number(inp.dataset.calculatedValue || 0);
      }
      return (fieldDef.tipo==='inteiro'||fieldDef.tipo==='percent'||fieldDef.tipo==='moeda') ? Number(inp.value || 0) : (inp.value ?? '');
    },
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
    const g = inputFor(def.key, def, dadosSecao[def.key] ?? pais?.[def.key], pais);
    el.formSecao.appendChild(g.wrap);
    getters[def.key] = g.get;
  });

  if (el.btnSalvarSecao) {
    el.btnSalvarSecao.onclick = async () => {
      if (!pais) return;
      try {
        el.btnSalvarSecao.disabled = true;
        el.btnSalvarSecao.textContent = 'Salvando...';
        const payload = {};
        Object.keys(getters).forEach(k => payload[k] = getters[k]());
        if (state.secaoSelecionada === 'geral' && payload.PIBPerCapita && payload.Populacao) {
          payload.PIB = calculatePIBTotal(payload.Populacao, payload.PIBPerCapita);
        }
        const updateData = { [`${state.secaoSelecionada}`]: payload };
        if (state.secaoSelecionada === 'geral') {
          Object.assign(updateData, payload);
        }
        await db.collection('paises').doc(pais.id).update(updateData);
        showNotification('success', 'Seção salva com sucesso');
      } catch (e) {
        Logger.error('Erro ao salvar seção:', e);
        showNotification('error', `Erro ao salvar: ${e.message}`);
      } finally {
        el.btnSalvarSecao.disabled = false;
        el.btnSalvarSecao.textContent = 'Salvar Seção';
      }
    };
  }
}

async function gatekeeper(user) {
  if (!user) { window.location.href = 'index.html'; return; }
  try {
    const perms = await checkUserPermissions(user.uid);
    if (!perms.isNarrator && !perms.isAdmin) {
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

async function carregarTudo() {
  const cfg = await getGameConfig();
  if (cfg && cfg.turnoAtual && el.turnoAtual) el.turnoAtual.textContent = `#${cfg.turnoAtual}`;
  if (cfg && cfg.turnoAtual && el.turnoInput) el.turnoInput.value = cfg.turnoAtual;
  
  state.paises = await getAllCountries();
  state.paises.sort((a,b)=> (a.Pais||'').localeCompare(b.Pais||''));
  renderSelectPaises();
  renderMenuSecoes();
  renderForm();
  // energy UI removed from narrador: dashboard handles energy display
}

// --- Inicialização e Event Listeners ---

auth.onAuthStateChanged(gatekeeper);
if (el.selectPais) el.selectPais.addEventListener('change', async (e) => { 
  state.paisSelecionado = e.target.value; 
  renderForm(); 
  try {
    await activateEnergyForSelectedCountry();
  } catch (err) {
    Logger.warn('Erro ao ativar EnergyManager após mudança de país:', err);
  }
});
if (el.selectSecao) el.selectSecao.addEventListener('change', (e) => { 
  state.secaoSelecionada = e.target.value; 
  renderMenuSecoes(); 
  renderForm(); 
});
// Energia UI removed from narrador. Dashboard shows country energy data.
if (el.btnRecarregar) el.btnRecarregar.addEventListener('click', carregarTudo);
if (el.btnSalvarTurno) el.btnSalvarTurno.addEventListener('click', async ()=>{
  const n = Number(el.turnoInput?.value||'');
  if (Number.isNaN(n) || n < 0) { alert('Informe um número de turno válido.'); return; }
  await updateTurn(n);
  alert(`Turno atualizado para #${n}`);
  await carregarTudo();
});
if (el.logout) el.logout.addEventListener('click', (e)=>{ e.preventDefault(); auth.signOut(); });
document.addEventListener('DOMContentLoaded', () => {
  initTabSystem(); // Initialize the tab system

  // Inicializar mapa quando a aba for clicada
  const mapTab = document.getElementById('tab-mapa');
  if (mapTab) {
    mapTab.addEventListener('click', async () => {
      // Só inicializar uma vez
      if (!worldMap) {
        await initWorldMap();
      }
    });
  }

  // Inicializar sistema de aprovação de divisões quando a aba for clicada
  const divisionsApprovalTab = document.getElementById('tab-divisions-approval');
  let divisionsApprovalInitialized = false;
  if (divisionsApprovalTab) {
    divisionsApprovalTab.addEventListener('click', async () => {
      if (!divisionsApprovalInitialized) {
        divisionsApprovalInitialized = true;
        const user = auth.currentUser;
        if (user) {
          await initDivisionsApprovalSystem(user);
        }
      }
    });
  }

  const openBtn = document.getElementById('btn-open-rules-editor');
  const rulesPanel = document.getElementById('rules-editor-panel');
  if(openBtn && rulesPanel) {
    openBtn.addEventListener('click', () => {
      rulesPanel.classList.toggle('hidden');
    });
  }

  const migrationButton = document.getElementById('btn-run-migration');
  if (migrationButton) {
    migrationButton.addEventListener('click', () => {
      runAdvancedEconomyMigration();
    });
  }

  const energyButton = document.getElementById('btn-process-energy');
  if (energyButton) {
    energyButton.addEventListener('click', async () => {
      try {
        energyButton.disabled = true;
        energyButton.textContent = '⏳ Processando...';

        const { processEnergySystemTurn } = await import('../systems/energyPenaltyProcessor.js');
        await processEnergySystemTurn();

        alert('Turno de energia processado com sucesso!');
        await carregarTudo();
      } catch (error) {
        console.error('Erro ao processar energia:', error);
        alert('Erro ao processar energia: ' + error.message);
      } finally {
        energyButton.disabled = false;
        energyButton.textContent = '⚡ Processar Turno de Energia';
      }
    });
  }

  const resourceButton = document.getElementById('btn-assign-resources');
  if (resourceButton) {
    resourceButton.addEventListener('click', async () => {
      try {
        resourceButton.disabled = true;
        resourceButton.textContent = '⏳ Processando...';

        const { assignResourcePotentials } = await import('../../scripts/assign-resource-potentials.js');
        await assignResourcePotentials();

        await carregarTudo();
      } catch (error) {
        console.error('Erro ao atribuir recursos:', error);
        alert('Erro ao atribuir recursos: ' + error.message);
      } finally {
        resourceButton.disabled = false;
        resourceButton.textContent = '🌍 Atribuir Potenciais de Recursos';
      }
    });
  }

  const reportButton = document.getElementById('btn-resource-report');
  if (reportButton) {
    reportButton.addEventListener('click', async () => {
      try {
        const { generateResourceReport } = await import('../../scripts/assign-resource-potentials.js');
        generateResourceReport();
        alert('Relatório de recursos gerado no console (F12)');
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        alert('Erro ao gerar relatório: ' + error.message);
      }
    });
  }

  const consumptionButton = document.getElementById('btn-apply-consumption');
  if (consumptionButton) {
    consumptionButton.addEventListener('click', async () => {
      try {
        consumptionButton.disabled = true;
        consumptionButton.textContent = '⏳ Calculando...';

        const { applyResourceConsumption } = await import('../../scripts/apply-resource-consumption.js');
        await applyResourceConsumption();

        await carregarTudo();
      } catch (error) {
        console.error('Erro ao calcular consumo:', error);
        alert('Erro ao calcular consumo: ' + error.message);
      } finally {
        consumptionButton.disabled = false;
        consumptionButton.textContent = '🍽️ Calcular Consumo de Recursos';
      }
    });
  }

  // Botão para aplicar consumo a todos os países
  const applyAllButton = document.getElementById('btn-apply-consumption-all');
  if (applyAllButton) {
    applyAllButton.addEventListener('click', async () => {
      try {
        const confirmed = await showConfirmBox(
          'Aplicar Consumo a Todos os Países',
          'Esta ação irá calcular e definir o consumo mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, etc.). Esta operação pode ser executada múltiplas vezes. Continuar?',
          'Sim, aplicar',
          'Cancelar'
        );

        if (!confirmed) {
          showNotification('info', 'Operação cancelada pelo usuário.');
          return;
        }

        applyAllButton.disabled = true;
        applyAllButton.textContent = '⏳ Aplicando a todos os países...';

        const { applyResourceConsumption } = await import('../../scripts/apply-resource-consumption.js');
        await applyResourceConsumption();

        showNotification('success', '🎉 Consumo aplicado a todos os países! Recarregue o dashboard para ver os novos valores.');
        await carregarTudo();
      } catch (error) {
        console.error('Erro ao aplicar consumo:', error);
        showNotification('error', 'Erro ao aplicar consumo: ' + error.message);
      } finally {
        applyAllButton.disabled = false;
        applyAllButton.textContent = '🚀 APLICAR CONSUMO A TODOS OS PAÍSES';
      }
    });
  }

  // Botão para aplicar produção a todos os países
  const applyProductionButton = document.getElementById('btn-apply-production-all');
  if (applyProductionButton) {
    applyProductionButton.addEventListener('click', async () => {
      try {
        const confirmed = await showConfirmBox(
          'Aplicar Produção a Todos os Países',
          'Esta ação irá calcular e definir a produção mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, geografia, clima). Esta operação pode ser executada múltiplas vezes. Continuar?',
          'Sim, aplicar',
          'Cancelar'
        );

        if (!confirmed) {
          showNotification('info', 'Operação cancelada pelo usuário.');
          return;
        }

        applyProductionButton.disabled = true;
        applyProductionButton.textContent = '⏳ Aplicando produção a todos os países...';

        const { applyResourceProduction } = await import('../../scripts/apply-resource-production.js');
        await applyResourceProduction();

        showNotification('success', '🎉 Produção aplicada a todos os países! Recarregue o dashboard para ver os novos valores.');
        await carregarTudo();
      } catch (error) {
        console.error('Erro ao aplicar produção:', error);
        showNotification('error', 'Erro ao aplicar produção: ' + error.message);
      } finally {
        applyProductionButton.disabled = false;
        applyProductionButton.textContent = '🏭 APLICAR PRODUÇÃO A TODOS OS PAÍSES';
      }
    });
  }

  // Botão para simular produção
  const simulateProductionButton = document.getElementById('btn-simulate-production');
  if (simulateProductionButton) {
    simulateProductionButton.addEventListener('click', async () => {
      try {
        simulateProductionButton.disabled = true;
        simulateProductionButton.textContent = '⏳ Simulando...';

        const { simulateProductionTurns } = await import('../../scripts/apply-resource-production.js');
        await simulateProductionTurns(6);

        await carregarTudo();
      } catch (error) {
        console.error('Erro ao simular produção:', error);
        showNotification('error', 'Erro na simulação: ' + error.message);
      } finally {
        simulateProductionButton.disabled = false;
        simulateProductionButton.textContent = '📊 Simular Produção 6 Turnos';
      }
    });
  }

  // Botão para aplicar bens de consumo e efeitos de estabilidade
  const applyConsumerGoodsButton = document.getElementById('btn-apply-consumer-goods');
  if (applyConsumerGoodsButton) {
    applyConsumerGoodsButton.addEventListener('click', async () => {
      try {
        const confirmed = await showConfirmBox(
          'Aplicar Bens de Consumo e Estabilidade',
          'Esta ação irá calcular os bens de consumo para TODOS os países e aplicar os efeitos de estabilidade (+3% até -5%). Esta operação deve ser executada a cada turno. Continuar?',
          'Sim, aplicar',
          'Cancelar'
        );

        if (!confirmed) {
          showNotification('info', 'Operação cancelada pelo usuário.');
          return;
        }

        applyConsumerGoodsButton.disabled = true;
        applyConsumerGoodsButton.textContent = '⏳ Aplicando bens de consumo...';

        const { applyConsumerGoodsEffects } = await import('../../scripts/apply-consumer-goods.js');
        await applyConsumerGoodsEffects();

        showNotification('success', '🎉 Bens de consumo e efeitos de estabilidade aplicados! Recarregue o dashboard.');
        await carregarTudo();
      } catch (error) {
        console.error('Erro ao aplicar bens de consumo:', error);
        showNotification('error', 'Erro ao aplicar bens de consumo: ' + error.message);
      } finally {
        applyConsumerGoodsButton.disabled = false;
        applyConsumerGoodsButton.textContent = '🛍️ APLICAR BENS DE CONSUMO E ESTABILIDADE';
      }
    });
  }

  // Botão para simular bens de consumo
  const simulateConsumerGoodsButton = document.getElementById('btn-simulate-consumer-goods');
  if (simulateConsumerGoodsButton) {
    simulateConsumerGoodsButton.addEventListener('click', async () => {
      try {
        simulateConsumerGoodsButton.disabled = true;
        simulateConsumerGoodsButton.textContent = '⏳ Simulando...';

        const { simulateConsumerGoodsOverTime } = await import('../../scripts/apply-consumer-goods.js');
        await simulateConsumerGoodsOverTime(5);

        await carregarTudo();
      } catch (error) {
        console.error('Erro ao simular bens de consumo:', error);
        showNotification('error', 'Erro na simulação: ' + error.message);
      } finally {
        simulateConsumerGoodsButton.disabled = false;
        simulateConsumerGoodsButton.textContent = '📈 Simular Estabilidade 5 Turnos';
      }
    });
  }

  // Botão para testar processamento de turno
  const testTurnButton = document.getElementById('btn-test-turn-processing');
  if (testTurnButton) {
    testTurnButton.addEventListener('click', async () => {
      try {
        testTurnButton.disabled = true;
        testTurnButton.textContent = '⏳ Testando...';

        const { default: TurnProcessor } = await import('../../js/systems/turnProcessor.js');
        const results = await TurnProcessor.testTurnProcessing();

        showNotification('success', `Teste concluído: ${results.length} países analisados. Veja o console (F12) para detalhes.`);
      } catch (error) {
        console.error('Erro no teste:', error);
        showNotification('error', 'Erro no teste: ' + error.message);
      } finally {
        testTurnButton.disabled = false;
        testTurnButton.textContent = '🧪 Testar Processamento de Turno';
      }
    });
  }

  // Botão para reprocessar turno atual
  const reprocessTurnButton = document.getElementById('btn-reprocess-turn');
  if (reprocessTurnButton) {
    reprocessTurnButton.addEventListener('click', async () => {
      try {
        const confirmed = await showConfirmBox(
          'Reprocessar Turno Atual',
          'Esta ação irá forçar o reprocessamento do turno atual, aplicando novamente todos os efeitos de bens de consumo e estabilidade. Use apenas se necessário. Continuar?',
          'Sim, reprocessar',
          'Cancelar'
        );

        if (!confirmed) {
          showNotification('info', 'Operação cancelada.');
          return;
        }

        reprocessTurnButton.disabled = true;
        reprocessTurnButton.textContent = '⏳ Reprocessando...';

        // Obter turno atual
        const gameConfig = await getGameConfig();
        const currentTurn = gameConfig.turnoAtual || 1;

        const { default: TurnProcessor } = await import('../../js/systems/turnProcessor.js');
        const result = await TurnProcessor.reprocessTurn(currentTurn);

        showNotification('success', `Turno ${currentTurn} reprocessado: ${result.processedCount} países atualizados!`);
        await carregarTudo();
      } catch (error) {
        console.error('Erro no reprocessamento:', error);
        showNotification('error', 'Erro no reprocessamento: ' + error.message);
      } finally {
        reprocessTurnButton.disabled = false;
        reprocessTurnButton.textContent = '🔄 Reprocessar Turno Atual';
      }
    });
  }

  // Botão para processar transições de leis
  const processLawsButton = document.getElementById('btn-process-law-transitions');
  if (processLawsButton) {
    processLawsButton.addEventListener('click', async () => {
      try {
        processLawsButton.disabled = true;
        processLawsButton.textContent = '🏛️ Processando Leis...';
        await processLawTransitions();
      } catch (error) {
        console.error('Erro ao acionar o processamento de leis:', error);
        showNotification('error', 'Erro ao processar leis: ' + error.message);
      } finally {
        processLawsButton.disabled = false;
        processLawsButton.textContent = '🏛️ Processar Transições de Leis';
      }
    });
  }

  // Botão para aplicar efeitos das leis
  const applyEffectsButton = document.getElementById('btn-apply-law-effects');
  if (applyEffectsButton) {
    applyEffectsButton.addEventListener('click', async () => {
      try {
        applyEffectsButton.disabled = true;
        applyEffectsButton.textContent = '⚙️ Aplicando Efeitos...';
        await applyNationalLawEffects();
      } catch (error) {
        console.error('Erro ao acionar a aplicação de efeitos:', error);
        showNotification('error', 'Erro ao aplicar efeitos: ' + error.message);
      } finally {
        applyEffectsButton.disabled = false;
        applyEffectsButton.textContent = '⚙️ Aplicar Efeitos das Leis';
      }
    });
  }

  // Botão para processar exaustão de guerra
  const processExhaustionButton = document.getElementById('btn-process-exhaustion');
  if (processExhaustionButton) {
    processExhaustionButton.addEventListener('click', async () => {
      try {
        processExhaustionButton.disabled = true;
        processExhaustionButton.textContent = '📉 Processando Exaustão...';
        await processWarExhaustion();
      } catch (error) {
        console.error('Erro ao acionar o processamento de exaustão:', error);
        showNotification('error', 'Erro ao processar exaustão: ' + error.message);
      } finally {
        processExhaustionButton.disabled = false;
        processExhaustionButton.textContent = '📉 Processar Exaustão de Guerra';
      }
    });
  }

  const simulateButton = document.getElementById('btn-simulate-consumption');
  if (simulateButton) {
    simulateButton.addEventListener('click', async () => {
      try {
        simulateButton.disabled = true;
        simulateButton.textContent = '⏳ Simulando...';

        const { simulateConsumptionTurns } = await import('../../scripts/apply-resource-consumption.js');
        await simulateConsumptionTurns(3);

        alert('Simulação concluída! Veja os resultados no console (F12)');
      } catch (error) {
        console.error('Erro na simulação:', error);
        alert('Erro na simulação: ' + error.message);
      } finally {
        simulateButton.disabled = false;
        simulateButton.textContent = '📊 Simular Consumo de Recursos';
      }
    });
  }

  if (el.btnApplyManualExhaustion) {
    el.btnApplyManualExhaustion.addEventListener('click', async () => {
      const countryId = el.exhaustionCountrySelect.value;
      const value = parseFloat(el.exhaustionValueInput.value);
      const reason = el.exhaustionReasonInput.value.trim();

      if (!countryId || isNaN(value)) {
        showNotification('error', 'Por favor, selecione um país e insira um valor numérico.');
        return;
      }

      if (reason.length < 5) {
        showNotification('error', 'Por favor, insira um motivo com pelo menos 5 caracteres.');
        return;
      }

      const btn = el.btnApplyManualExhaustion;
      try {
        btn.disabled = true;
        btn.textContent = 'Aplicando...';

        const countryRef = db.collection('paises').doc(countryId);
        const countryDoc = await countryRef.get();

        if (!countryDoc.exists) {
          throw new Error('País não encontrado no banco de dados.');
        }

        const currentExhaustion = countryDoc.data().warExhaustion || 0;
        const newExhaustion = Math.max(0, Math.min(100, currentExhaustion + value));

        // Atualiza o país e cria um log da alteração
        const batch = db.batch();
        batch.update(countryRef, { warExhaustion: newExhaustion });

        const logRef = db.collection('change_log').doc();
        batch.set(logRef, {
          type: 'MANUAL_EXHAUSTION_CHANGE',
          countryId: countryId,
          countryName: countryDoc.data().Pais || countryId,
          oldValue: currentExhaustion,
          newValue: newExhaustion,
          changeValue: value,
          reason: reason,
          narratorId: auth.currentUser.uid,
          narratorName: auth.currentUser.displayName || 'Narrador',
          timestamp: new Date()
        });

        await batch.commit();

        showNotification('success', `Exaustão de ${countryDoc.data().Pais} ajustada para ${newExhaustion.toFixed(2)}%`);
        el.exhaustionValueInput.value = '';
        el.exhaustionReasonInput.value = '';

      } catch (error) {
        console.error('Erro ao aplicar ajuste manual de exaustão:', error);
        showNotification('error', `Erro: ${error.message}`);
      } finally {
        btn.disabled = false;
        btn.textContent = 'Aplicar Ajuste de Exaustão';
      }
    });
  }

  // Gestão de Estado de Guerra
  if (el.warCountrySelect) {
    el.warCountrySelect.addEventListener('change', async () => {
      const countryId = el.warCountrySelect.value;
      if (!countryId) return;

      try {
        // Carregar dados do país
        const countryDoc = await db.collection('paises').doc(countryId).get();
        if (!countryDoc.exists) return;

        const countryData = countryDoc.data();
        const inWarWith = countryData.inWarWith || [];

        // Atualizar display de guerras atuais
        if (inWarWith.length > 0) {
          const warCountryNames = await Promise.all(
            inWarWith.map(async enemyId => {
              const enemyDoc = await db.collection('paises').doc(enemyId).get();
              return enemyDoc.exists ? enemyDoc.data().Pais : enemyId;
            })
          );
          el.currentWarsDisplay.textContent = `Em guerra com: ${warCountryNames.join(', ')}`;
          el.currentWarsDisplay.className = 'text-sm text-red-400 mb-2';
        } else {
          el.currentWarsDisplay.textContent = 'Este país está em paz';
          el.currentWarsDisplay.className = 'text-sm text-green-400 mb-2';
        }

        // Preencher lista de países disponíveis (exceto o próprio)
        const allCountries = state.paises.filter(p => p.id !== countryId);
        el.warTargetSelect.innerHTML = allCountries.map(p => {
          const isSelected = inWarWith.includes(p.id);
          return `<option value="${p.id}" ${isSelected ? 'selected' : ''}>${p.Pais || p.id}</option>`;
        }).join('');

      } catch (error) {
        console.error('Erro ao carregar estado de guerra:', error);
      }
    });
  }

  if (el.btnUpdateWarStatus) {
    el.btnUpdateWarStatus.addEventListener('click', async () => {
      const countryId = el.warCountrySelect.value;
      if (!countryId) {
        showNotification('error', 'Selecione um país primeiro');
        return;
      }

      try {
        el.btnUpdateWarStatus.disabled = true;
        el.btnUpdateWarStatus.textContent = 'Atualizando...';

        // Pegar países selecionados
        const selectedOptions = Array.from(el.warTargetSelect.selectedOptions);
        const inWarWith = selectedOptions.map(opt => opt.value);

        // Atualizar no Firestore
        await db.collection('paises').doc(countryId).update({
          inWarWith: inWarWith
        });

        // Criar log da mudança
        const countryDoc = await db.collection('paises').doc(countryId).get();
        const countryName = countryDoc.data().Pais || countryId;

        await db.collection('change_log').add({
          type: 'WAR_STATUS_CHANGE',
          countryId: countryId,
          countryName: countryName,
          newWarStatus: inWarWith,
          narratorId: auth.currentUser.uid,
          narratorName: auth.currentUser.displayName || 'Narrador',
          timestamp: new Date()
        });

        showNotification('success', `Estado de guerra de ${countryName} atualizado!`);

        // Recarregar display
        el.warCountrySelect.dispatchEvent(new Event('change'));

      } catch (error) {
        console.error('Erro ao atualizar estado de guerra:', error);
        showNotification('error', `Erro: ${error.message}`);
      } finally {
        el.btnUpdateWarStatus.disabled = false;
        el.btnUpdateWarStatus.textContent = 'Atualizar Estado de Guerra';
      }
    });
  }
});

// --- Gerenciadores de Sistemas ---
let vehicleApprovalSystem = null;
let navalProductionSystem = null;
let inventorySystem = null;
let economicSimulator = null;
let advancedCountryEditor = null;
// energyManager intentionally not initialized here; dashboard handles energy

async function initVehicleApprovalSystem() {
  try {
    vehicleApprovalSystem = new VehicleApprovalSystem();
    await vehicleApprovalSystem.initialize();
    Logger.info('Sistema de aprovação de veículos inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar sistema de aprovação de veículos:', error);
  }
}

async function initNavalProductionSystem() {
  try {
    navalProductionSystem = new NavalProductionSystem();
    await navalProductionSystem.initialize();
    Logger.info('Sistema de produção naval inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar sistema de produção naval:', error);
  }
}

async function initInventorySystem() {
  try {
    inventorySystem = new InventorySystem();
    await inventorySystem.initialize();
    Logger.info('Sistema de inventário inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar sistema de inventário:', error);
  }
}

async function initGenericEquipmentManager() {
  try {
    const genericEquipmentManager = new GenericEquipmentManager();
    await genericEquipmentManager.initialize();
    Logger.info('Gerenciador de equipamentos genéricos inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar gerenciador de equipamentos genéricos:', error);
  }
}

async function initEconomicSystem() {
  try {
    economicSimulator = await initEconomicSimulator();
    Logger.info('Sistema econômico inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar sistema econômico:', error);
  }
}

async function initAdvancedEditor() {
  try {
    advancedCountryEditor = await initAdvancedCountryEditor();
    Logger.info('Editor de País Avançado inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar Editor de País Avançado:', error);
  }
}

async function initPlayerManagement() {
  try {
    console.log('👥 Carregando jogadores...');
    await playerManager.loadPlayers();
    console.log(`✅ ${playerManager.players.length} jogadores carregados`);
    
    console.log('🌍 Carregando países...');
    await playerManager.loadCountries();
    console.log(`✅ ${playerManager.countries.length} países carregados`);
    
    playerManager.setupRealTimeListeners?.();
    
    renderPlayersList();
    renderAvailableCountries();
    setupPlayerManagementListeners();
    
    Logger.info('Sistema de gerenciamento de jogadores inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar gerenciamento de jogadores:', error);
    Logger.error('Erro ao inicializar gerenciamento de jogadores:', error);
    showPlayerManagementError();
  }
}

function showPlayerManagementError() {
  if (el.playersList) {
    el.playersList.innerHTML = `
      <div class="text-sm text-red-400 text-center py-8">
        <div class="mb-2">❌ Erro ao carregar dados de jogadores</div>
        <div class="text-xs text-slate-500">Verifique as permissões do Firebase</div>
      </div>
    `;
  }
  
  if (el.availableCountries) {
    el.availableCountries.innerHTML = `
      <div class="text-sm text-red-400 text-center py-8">
        <div class="mb-2">❌ Erro ao carregar países</div>
        <div class="text-xs text-slate-500">Usando dados básicos do sistema</div>
      </div>
    `;
  }
  
  if (el.playerCount) {
    el.playerCount.textContent = 'Erro ao carregar';
  }
  
  if (el.availableCount) {
    el.availableCount.textContent = 'Erro ao carregar';
  }
}

function setupPlayerManagementListeners() {
  if (setupPlayerManagementListeners.initialized) return;
  
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
  
  window.addEventListener('playerManager:update', (e) => {
    if (e.detail.type === 'players') {
      renderPlayersList();
    } else if (e.detail.type === 'countries') {
      renderAvailableCountries();
    }
  });
  
  setupPlayerManagementListeners.initialized = true;
}

function renderPlayersList() {
  if (!el.playersList) return;
  
  if (!playerManager || !playerManager.players) {
    el.playersList.innerHTML = `
      <div class="text-sm text-yellow-400 text-center py-8">
        <div class="mb-2">🛈 Carregando dados...</div>
        <div class="text-xs text-slate-500">Aguarde a inicialização</div>
      </div>
    `;
    return;
  }
  
  let players = [];
  let playersCount = 0;
  
  if (playerManager.players.length > 0) {
    players = playerManager.players.filter(p => p.paisId);
    playersCount = players.length;
  } else {
    playersCount = state.paises ? state.paises.filter(c => c.Player).length : 0;
  }
  
  if (el.playerCount) {
    el.playerCount.textContent = `${playersCount} jogadores`;
  }
  
  if (playersCount === 0) {
    el.playersList.innerHTML = `
      <div class="text-sm text-slate-500 text-center py-4">
        Nenhum jogador com país atribuído
      </div>
    `;
    return;
  }
  
  if (players.length === 0 && playersCount > 0) {
    el.playersList.innerHTML = `
      <div class="text-sm text-yellow-400 text-center py-4">
        <div class="mb-2">🛈 ${playersCount} jogadores ativos</div>
        <div class="text-xs text-slate-500">Dados limitados devido às permissões do Firebase</div>
      </div>
    `;
    return;
  }
  
  const playersHtml = players.map(player => {
    const country = playerManager.countries.find(c => c.id === player.paisId);
    const lastLoginText = player.lastLogin ? formatTimeAgo(player.lastLogin) : 'Nunca';
    
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
          <button onclick="openReassignModal('${player.id}')"
                  class="text-blue-400 hover:text-blue-300 text-xs px-2 py-1 rounded transition-colors"
                  title="Transferir / Trocar jogador">
            ⇄
          </button>
          <button onclick="unassignPlayer('${player.paisId}')"
                  class="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded transition-colors"
                  title="Remover atribuição">
            ✖
          </button>
        </div>
      </div>
    `;
  }).join('');
  
  el.playersList.innerHTML = playersHtml;
}

function renderAvailableCountries() {
  if (!el.availableCountries) return;
  
  if (!playerManager || !playerManager.countries) {
    el.availableCountries.innerHTML = `
      <div class="text-sm text-yellow-400 text-center py-8">
        <div class="mb-2">🛈 Carregando países...</div>
        <div class="text-xs text-slate-500">Aguarde a inicialização</div>
      </div>
    `;
    return;
  }
  
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
  
  showPlayerSelectionModal(countryId, playersWithoutCountries);
};

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
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✖</button>
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
      <input id="assignment-reason" type="text" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm" placeholder="Ex.: Atribuição manual" />
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

window.openReassignModal = function(playerId) {
  const player = playerManager.players.find(p => p.id === playerId);
  if (!player) {
    showNotification('warning', 'Jogador não encontrado');
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';

  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-md w-full';

  const options = playerManager.countries.map(country => {
    const assignedPlayer = country.Player ? playerManager.players.find(p => p.id === country.Player) : null;
    const label = `${country.Pais || country.id}${assignedPlayer ? ` — ${assignedPlayer.nome || assignedPlayer.id}` : ' (disponível)'}`;
    return `<option value="${country.id}" ${country.id === player.paisId ? 'disabled' : ''}>${label}</option>`;
  }).join('');

  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-slate-200">Reatribuir ${player.nome || player.id}</h3>
        <p class="text-xs text-slate-500">${player.paisId ? 'País atual: ' + (playerManager.countries.find(c => c.id === player.paisId)?.Pais || player.paisId) : 'Sem país atual'}</p>
      </div>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✖</button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="text-sm text-slate-400 mb-2 block">Selecione o novo país:</label>
        <select id="reassign-country-select" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm">
          <option value="">-- Escolha um país --</option>
          ${options}
        </select>
      </div>
      <div class="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" id="swap-option" class="rounded border-bg-ring/70 bg-bg">
        <label for="swap-option">Trocar jogadores entre os países (necessário que o destino tenha jogador)</label>
      </div>
      <div class="text-xs text-slate-500">
        Use "Trocar" para inverter os jogadores entre o país atual e o selecionado.
        Caso o destino esteja vazio, o jogador apenas será movido.
      </div>
    </div>

    <div class="mt-6 flex gap-3 justify-end">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-lg border border-bg-ring/70 text-slate-300 hover:bg-white/5">
        Cancelar
      </button>
      <button onclick="confirmReassignPlayer('${playerId}', this.closest('.fixed'))" class="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400">
        Confirmar
      </button>
    </div>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
};

window.confirmReassignPlayer = async function(playerId, modal) {
  const select = modal.querySelector('#reassign-country-select');
  const swap = modal.querySelector('#swap-option').checked;
  const countryId = select.value;

  if (!countryId) {
    showNotification('warning', 'Selecione um país');
    return;
  }

  const player = playerManager.players.find(p => p.id === playerId);
  if (!player) {
    showNotification('error', 'Jogador não encontrado');
    return;
  }

  const currentCountryId = player.paisId || null;
  const targetCountry = playerManager.countries.find(c => c.id === countryId);

  try {
    if (swap) {
      if (!targetCountry?.Player) {
        showNotification('warning', 'O país selecionado não possui jogador para troca');
        return;
      }
      if (!currentCountryId) {
        showNotification('warning', 'O jogador atual não possui país para realizar a troca');
        return;
      }
      await playerManager.swapCountryPlayers(currentCountryId, countryId);
    } else {
      if (currentCountryId && currentCountryId !== countryId) {
        await playerManager.unassignCountry(currentCountryId, 'Reatribuição manual');
      }
      await playerManager.assignCountryToPlayer(playerId, countryId, 'Reatribuição manual');
    }

    renderPlayersList();
    renderAvailableCountries();
    modal.remove();
  } catch (error) {
    Logger.error('Erro na reatribuição:', error);
  }
};

function showPlayerAnalytics() {
  const analytics = playerManager.getPlayerAnalytics();
  
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-4xl w-full max-h-96 overflow-y-auto';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">📊 Analytics de Jogadores</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✖</button>
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
        <h4 class="text-sm font-semibold text-purple-200 mb-3">🛡️ Administração</h4>
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

function showAnnouncementModal() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
  
  const content = document.createElement('div');
  content.className = 'bg-bg-soft border border-bg-ring/70 rounded-2xl p-6 max-w-md w-full';
  
  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-slate-200">📢 Enviar Anúncio</h3>
      <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-200">✖</button>
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

function formatTimeAgo(date) {
  if (!date) return 'Nunca';
  const now = Date.now();
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `${minutes} min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

let worldMap = null;
let mapControls = null;

async function initWorldMap() {
  try {
    // Verificar se estamos na aba do mapa
    const mapContainer = document.getElementById('world-map');
    if (!mapContainer) {
      Logger.warn('Container do mapa não encontrado');
      return;
    }

    // Criar instância do mapa
    worldMap = new WorldMap('world-map');
    await worldMap.initialize(true); // true = modo narrador

    // Criar controles do mapa
    mapControls = new MapControls(worldMap);
    mapControls.render('map-controls-container');

    // Atualizar mensagem de status
    const mapInfo = document.getElementById('map-info-text');
    if (mapInfo) {
      mapInfo.textContent = 'Mapa carregado com sucesso!';
    }

    Logger.info('Mapa mundial inicializado');
  } catch (error) {
    Logger.error('Erro ao inicializar mapa mundial:', error);
    const mapInfo = document.getElementById('map-info-text');
    if (mapInfo) {
      mapInfo.textContent = 'Erro ao carregar mapa: ' + error.message;
    }
  }
}

// Energy activation removed from narrador; use country dashboard instead.

async function initNarratorSystems() {
  try {
    console.log('🔧 Inicializando sistemas do narrador...');
    await Promise.all([
      initPlayerManagement(),
      initVehicleApprovalSystem(),
      initNavalProductionSystem(),
      initInventorySystem(),
      initGenericEquipmentManager(),
      initEconomicSystem(),
      initAdvancedEditor()
    ]);

    window.playerManager = playerManager;
    window.vehicleApprovalSystem = vehicleApprovalSystem;
    window.navalProductionSystem = navalProductionSystem;
    window.inventorySystem = inventorySystem;
    window.economicSimulator = economicSimulator;
    window.advancedCountryEditor = advancedCountryEditor;

    // Expor dados para outros módulos
    window.narratorData = {
        getCatalog: () => catalog,
        getCountries: () => state.paises,
    };

    console.log('✅ Todos os sistemas do narrador inicializados');
  } catch (error) {
    console.error('❌ Erro ao inicializar sistemas do narrador:', error);
  }
}

// Auto-inicializar quando o documento estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNarratorSystems);
} else {
  initNarratorSystems();
}

/**
 * Executa o script de migração de leis nacionais
 */
async function runMigrationScript() {
  console.log('🔧 Iniciando migração de Leis Nacionais...');
  showNotification('info', 'Iniciando migração...');

  try {
    const DEFAULT_VALUES = {
      mobilizationLaw: 'volunteer_only',
      economicLaw: 'civilian_economy',
      warExhaustion: 0,
      inWarWith: [],
      lawChange: null
    };

    const paisesSnapshot = await db.collection('paises').get();

    if (paisesSnapshot.empty) {
      showNotification('warning', 'Nenhum país encontrado');
      return;
    }

    let needsMigration = 0;
    const countriesToMigrate = [];

    paisesSnapshot.forEach(doc => {
      const countryData = doc.data();
      const missingFields = [];

      if (countryData.mobilizationLaw === undefined) missingFields.push('mobilizationLaw');
      if (countryData.economicLaw === undefined) missingFields.push('economicLaw');
      if (countryData.warExhaustion === undefined) missingFields.push('warExhaustion');
      if (countryData.inWarWith === undefined) missingFields.push('inWarWith');
      if (countryData.lawChange === undefined) missingFields.push('lawChange');

      if (missingFields.length > 0) {
        needsMigration++;
        countriesToMigrate.push({
          ref: doc.ref,
          missingFields: missingFields
        });
      }
    });

    if (needsMigration === 0) {
      console.log('✅ Todos os países já estão atualizados');
      showNotification('success', 'Todos os países já possuem os campos necessários');
      return;
    }

    console.log(`🚀 Migrando ${needsMigration} países...`);

    const batch = db.batch();
    for (const country of countriesToMigrate) {
      const updates = {};
      country.missingFields.forEach(field => {
        updates[field] = DEFAULT_VALUES[field];
      });
      batch.update(country.ref, updates);
    }

    await batch.commit();

    console.log(`✅ Migração concluída: ${needsMigration} países atualizados`);
    showNotification('success', `Migração concluída! ${needsMigration} países atualizados`);

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    showNotification('error', `Erro na migração: ${error.message}`);
  }
}

/**
 * Executa o script de configuração de leis no gameConfig
 */
async function runSetupGameConfig() {
  console.log('⚙️ Configurando leis nacionais no gameConfig...');
  showNotification('info', 'Configurando leis...');

  try {
    // Importar configuração do setup-game-config.js
    const nationalLawsConfig = {
      mobilizationLaws: {
        disarmed_nation: {
          level: 1,
          name: 'Nação Desarmada',
          recruitablePopulation: 0.01,
          bonuses: { resourceProduction: 0.15, civilianFactoryEfficiency: 0.10 },
          penalties: { militaryProductionSpeed: -0.50 }
        },
        volunteer_only: {
          level: 2,
          name: 'Apenas Voluntários',
          recruitablePopulation: 0.015,
          bonuses: { resourceProduction: 0.05 },
          penalties: { militaryProductionSpeed: -0.10 }
        },
        limited_conscription: {
          level: 3,
          name: 'Conscrição Limitada',
          recruitablePopulation: 0.025,
          bonuses: {},
          penalties: {}
        },
        extensive_conscription: {
          level: 4,
          name: 'Conscrição Extensa',
          recruitablePopulation: 0.05,
          bonuses: { militaryProductionCost: -0.05 },
          penalties: { resourceProduction: -0.07 }
        },
        service_by_requirement: {
          level: 5,
          name: 'Serviço por Exigência',
          recruitablePopulation: 0.10,
          bonuses: { militaryProductionCost: -0.10 },
          penalties: { resourceProduction: -0.14, civilianFactoryEfficiency: -0.07 }
        },
        all_adults_serve: {
          level: 6,
          name: 'Todos os Adultos Servem',
          recruitablePopulation: 0.20,
          bonuses: { militaryProductionCost: -0.15 },
          penalties: { resourceProduction: -0.35, civilianFactoryEfficiency: -0.20, warExhaustionPassiveGain: 0.1 }
        }
      },
      economicLaws: {
        civilian_economy: {
          level: 1,
          name: 'Economia Civil',
          bonuses: { civilianFactoryEfficiency: 0.20 },
          penalties: { militaryCapacity: -0.30 },
          consumptionModifiers: { metals: -0.25, fuel: -0.25, grain: 0.15 }
        },
        early_mobilization: {
          level: 2,
          name: 'Mobilização Inicial',
          bonuses: { civilianFactoryEfficiency: 0.10 },
          penalties: { militaryCapacity: -0.15 },
          consumptionModifiers: { metals: -0.10, fuel: -0.10, grain: 0.05 }
        },
        partial_mobilization: {
          level: 3,
          name: 'Mobilização Parcial',
          bonuses: {},
          penalties: {},
          consumptionModifiers: {}
        },
        war_economy: {
          level: 4,
          name: 'Economia de Guerra',
          bonuses: { militaryCapacity: 0.20 },
          penalties: { civilianFactoryEfficiency: -0.20 },
          consumptionModifiers: { metals: 0.20, fuel: 0.20, coal: 0.20, energy: 0.20 }
        },
        total_mobilization: {
          level: 5,
          name: 'Mobilização Total',
          bonuses: { militaryCapacity: 0.40 },
          penalties: { civilianFactoryEfficiency: -0.40, recruitablePopulation: -0.05, warExhaustionPassiveGain: 0.1 },
          consumptionModifiers: { metals: 0.35, fuel: 0.35, coal: 0.35, energy: 0.35, grain: -0.20 }
        }
      }
    };

    await db.collection('gameConfig').doc('nationalLaws').set(nationalLawsConfig);

    console.log('✅ Configuração de leis criada/atualizada com sucesso');
    showNotification('success', 'Configuração de leis criada com sucesso no gameConfig!');

  } catch (error) {
    console.error('❌ Erro ao configurar leis:', error);
    showNotification('error', `Erro ao configurar leis: ${error.message}`);
  }
}

// Event listeners para os botões de migração
document.addEventListener('DOMContentLoaded', () => {
  const btnMigrate = document.getElementById('btn-migrate-national-laws');
  const btnSetup = document.getElementById('btn-setup-game-config');

  if (btnMigrate) {
    btnMigrate.addEventListener('click', async () => {
      const confirmed = await showConfirmBox(
        'Migrar Leis Nacionais',
        'Esta ação adicionará os campos de leis nacionais em todos os países que ainda não os possuem. É seguro executar múltiplas vezes. Continuar?',
        'Sim, migrar',
        'Cancelar'
      );

      if (!confirmed) return;

      try {
        btnMigrate.disabled = true;
        btnMigrate.textContent = '⏳ Migrando...';
        await runMigrationScript();
      } finally {
        btnMigrate.disabled = false;
        btnMigrate.textContent = '🔧 Migrar Leis Nacionais';
      }
    });
  }

  if (btnSetup) {
    btnSetup.addEventListener('click', async () => {
      const confirmed = await showConfirmBox(
        'Configurar Leis no GameConfig',
        'Esta ação criará/atualizará a configuração de leis nacionais no Firestore. Continuar?',
        'Sim, configurar',
        'Cancelar'
      );

      if (!confirmed) return;

      try {
        btnSetup.disabled = true;
        btnSetup.textContent = '⏳ Configurando...';
        await runSetupGameConfig();
      } finally {
        btnSetup.disabled = false;
        btnSetup.textContent = '⚙️ Configurar Leis no GameConfig';
      }
    });
  }
});

import { calculateEffectiveModifiers } from '../systems/lawAndExhaustionCalculator.js';

/**
 * Calcula e aplica os modificadores de Leis Nacionais para todos os países.
 * Salva o resultado no campo 'currentModifiers' de cada país.
 */
async function applyNationalLawEffects() {
  console.log('Calculando e aplicando efeitos de leis nacionais...');
  showNotification('info', 'Calculando efeitos de leis para todos os países...');

  try {
    const lawsDoc = await db.collection('gameConfig').doc('nationalLaws').get();
    if (!lawsDoc.exists) {
      throw new Error('Configuração de Leis Nacionais não encontrada.');
    }
    const lawsConfig = lawsDoc.data();

    const paisesSnapshot = await db.collection('paises').get();
    if (paisesSnapshot.empty) {
      showNotification('warning', 'Nenhum país encontrado.');
      return;
    }

    const batch = db.batch();
    let processedCount = 0;

    paisesSnapshot.forEach(doc => {
      const countryData = doc.data();
      const countryRef = doc.ref;

      const modifiers = calculateEffectiveModifiers(countryData, lawsConfig);
      
      batch.update(countryRef, { currentModifiers: modifiers });
      processedCount++;
    });

    if (processedCount > 0) {
      await batch.commit();
      console.log(`✅ Efeitos de leis aplicados a ${processedCount} países.`);
      showNotification('success', `Efeitos de leis aplicados a ${processedCount} países.`);
    } else {
      showNotification('info', 'Nenhum país precisou de atualização de efeitos.');
    }

  } catch (error) {
    console.error('Erro ao aplicar efeitos de leis:', error);
    showNotification('error', `Erro no processo: ${error.message}`);
  }
}

/**
 * Processa o ganho ou perda passiva de Exaustão de Guerra para todos os países.
 */
async function processWarExhaustion() {
  console.log('Processando Exaustão de Guerra...');
  showNotification('info', 'Processando Exaustão de Guerra para todos os países...');

  try {
    const lawsDoc = await db.collection('gameConfig').doc('nationalLaws').get();
    if (!lawsDoc.exists) {
      throw new Error('Configuração de Leis Nacionais não encontrada.');
    }
    const lawsConfig = lawsDoc.data();

    const paisesSnapshot = await db.collection('paises').get();
    if (paisesSnapshot.empty) {
      showNotification('warning', 'Nenhum país encontrado.');
      return;
    }

    const batch = db.batch();
    let processedCount = 0;

    paisesSnapshot.forEach(doc => {
      const countryData = doc.data();
      const countryRef = doc.ref;

      const mobilizationLaw = lawsConfig.mobilizationLaws[countryData.mobilizationLaw];
      const economicLaw = lawsConfig.economicLaws[countryData.economicLaw];
      const currentExhaustion = countryData.warExhaustion || 0;
      let newExhaustion = currentExhaustion;

      if (countryData.inWarWith && countryData.inWarWith.length > 0) {
        // Em guerra: aumenta a exaustão
        let increase = 0;
        if (mobilizationLaw && economicLaw) {
          increase = (mobilizationLaw.level + economicLaw.level) * 0.05;
        }
        // Bônus de exaustão de leis de mobilização total
        if (mobilizationLaw?.penalties?.warExhaustionPassiveGain) {
          increase += mobilizationLaw.penalties.warExhaustionPassiveGain;
        }
        if (economicLaw?.penalties?.warExhaustionPassiveGain) {
          increase += economicLaw.penalties.warExhaustionPassiveGain;
        }
        newExhaustion = Math.min(100, currentExhaustion + increase);
      } else {
        // Em paz: diminui a exaustão
        newExhaustion = Math.max(0, currentExhaustion - 2);
      }

      if (newExhaustion !== currentExhaustion) {
        batch.update(countryRef, { warExhaustion: newExhaustion });
        processedCount++;
      }
    });

    if (processedCount > 0) {
      await batch.commit();
      console.log(`✅ Exaustão de Guerra processada para ${processedCount} países.`);
      showNotification('success', `Exaustão de Guerra processada para ${processedCount} países.`);
    } else {
      showNotification('info', 'Nenhum país precisou de atualização de exaustão.');
    }

  } catch (error) {
    console.error('Erro ao processar Exaustão de Guerra:', error);
    showNotification('error', `Erro no processo: ${error.message}`);
  }
}

/**
 * Processa a transição gradual de Leis Nacionais para todos os países.
 * Esta função deve ser chamada como parte do processo de final de turno.
 */
async function processLawTransitions() {
  console.log('Iniciando o processamento da transição de leis...');
  showNotification('info', 'Processando transições de leis para todos os países...');

  try {
    const paisesSnapshot = await db.collection('paises').get();
    if (paisesSnapshot.empty) {
      console.log('Nenhum país para processar.');
      showNotification('warning', 'Nenhum país encontrado.');
      return;
    }

    const batch = db.batch();
    let processedCount = 0;

    paisesSnapshot.forEach(doc => {
      const countryData = doc.data();
      const countryRef = doc.ref;
      const countryName = countryData.Pais || countryData.Nome || doc.id;
      
      if (countryData.lawChange && countryData.lawChange.totalTurns > 0) {
        const newProgress = countryData.lawChange.progress + 1;
        let updates = {};

        if (newProgress >= countryData.lawChange.totalTurns) {
          // Transição concluída
          console.log(`-> Transição para '${countryData.lawChange.targetLaw}' concluída em ${countryName}.`);
          updates.lawChange = null;
          if (countryData.lawChange.type === 'mobilization') {
            updates.mobilizationLaw = countryData.lawChange.targetLaw;
          } else if (countryData.lawChange.type === 'economic') {
            updates.economicLaw = countryData.lawChange.targetLaw;
          }
        } else {
          // Transição em andamento
          updates['lawChange.progress'] = newProgress;
        }
        
        batch.update(countryRef, updates);
        processedCount++;
      }
    });

    if (processedCount > 0) {
      await batch.commit();
      console.log(`✅ Transição de leis processada para ${processedCount} países.`);
      showNotification('success', `Transição de leis processada para ${processedCount} países.`);
    } else {
      console.log('Nenhuma transição de lei ativa para processar.');
      showNotification('info', 'Nenhuma transição de lei ativa encontrada.');
    }

  } catch (error) {
    console.error('Erro ao processar transição de leis:', error);
    showNotification('error', `Erro no processo: ${error.message}`);
  }
}
