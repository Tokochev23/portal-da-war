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
        simulateButton.textContent = '🔮 Simular 3 Turnos';
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
    // playerManager is exported singleton from services/playerManager.js
    if (playerManager && typeof playerManager.loadPlayers === 'function') {
      await playerManager.loadPlayers();
      await playerManager.loadCountries();
      playerManager.setupRealTimeListeners?.();
      Logger.info('Player management inicializado');
    } else {
      Logger.warn('playerManager não disponível para inicialização');
    }
  } catch (error) {
    Logger.error('Erro ao inicializar player management:', error);
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