import { auth, db, getAllCountries, getGameConfig, updateTurn, checkUserPermissions } from "../services/firebase.js";
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
  veiculos: { label: "Veículos", campos: [ { key: "MBT", label: "MBT", tipo: "inteiro", min: 0 }, { key: "IFV", label: "IFV", tipo: "inteiro", min: 0 }, { key: "APC", label: "APC", tipo: "inteiro", min: 0 } ] },
  recursos: { label: "Recursos", campos: [ { key: "CombustivelSaldo", label: "Saldo de Combustível", tipo: "inteiro" }, { key: "Metais", label: "Metais", tipo: "inteiro" } ] },
  ocupacao: { label: "Ocupação", campos: [ { key: "PopOcupada", label: "População Ocupada", tipo: "inteiro", min: 0 }, { key: "PIBOcupado", label: "PIB Ocupado", tipo: "moeda", min: 0 } ] },
  arsenal: { label: "Arsenal Especial", campos: [ { key: "Nuclear", label: "Bomba Nuclear", tipo: "inteiro", min: 0 } ] }
};

let catalog = null;
let state = {
  paises: [],
  paisSelecionado: null,
  secaoSelecionada: "geral",
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
  label.className = 'block text-xs text-slate-400';
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
  }
  inp.name = fieldKey;
  inp.className = 'mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm';
  wrap.appendChild(label); wrap.appendChild(inp);

  return { wrap, get: ()=> (fieldDef.tipo==='inteiro'||fieldDef.tipo==='percent'||fieldDef.tipo==='moeda') ? Number(inp.value || 0) : (inp.value ?? '') };
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

  if (el.btnSalvarSecao) el.btnSalvarSecao.onclick = async () => {
    if (!pais) return;
    const payload = {};
    Object.keys(getters).forEach(k => payload[k] = getters[k]());
    // validações básicas
    const defsByKey = Object.fromEntries((sec.campos||[]).map(d => [d.key, d]));
    for (const [k,v] of Object.entries(payload)) {
      const d = defsByKey[k];
      if (!d) continue;
      if (d.min != null && v < d.min) { alert(`Campo ${d.label||k}: mínimo ${d.min}`); return; }
      if (d.max != null && v > d.max) { alert(`Campo ${d.label||k}: máximo ${d.max}`); return; }
    }
    try {
      await db.collection('paises').doc(pais.id).set({ [state.secaoSelecionada]: payload }, { merge: true });
      alert('Seção salva com sucesso.');
    } catch (e) { console.error(e); alert('Erro ao salvar.'); }
  };
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
}

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

auth.onAuthStateChanged(gatekeeper);

