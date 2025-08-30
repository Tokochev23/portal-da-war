import { auth, db, getAllCountries, getGameConfig, checkUserPermissions, updateTurn } from "../services/firebase.js";

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

let econ = {
  dadoScale: {6:0.40,7:0.60,8:0.80,9:1.00,10:1.20,11:1.50,12:2.00},
  eficiencia: { base: 0.50, wTec: 0.004, wInd: 0.004, min: 0.30, max: 1.50 },
  splitExterno: 0.5,
  bonusMin: -0.03,
  bonusMax: 0.03,
  acoesPorTurno: 10,
  arredondamento: 0
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
  ecoInvestidor: document.getElementById('eco-investidor'),
  ecoParceiro: document.getElementById('eco-parceiro'),
  ecoInvestimento: document.getElementById('eco-investimento'),
  ecoD12: document.getElementById('eco-d12'),
  ecoRoll: document.getElementById('eco-roll'),
  ecoBonus: document.getElementById('eco-bonus'),
  ecoBonusLabel: document.getElementById('eco-bonus-label'),
  ecoNotas: document.getElementById('eco-notas'),
  ecoEff: document.getElementById('eco-eff'),
  ecoFdado: document.getElementById('eco-fdado'),
  ecoPreview: document.getElementById('eco-preview'),
  ecoAplicar: document.getElementById('eco-aplicar'),
  logRecarregar: document.getElementById('log-recarregar'),
  listaAcoes: document.getElementById('lista-acoes'),
  deltaPIB: document.getElementById('delta-pib'),
  deltaTec: document.getElementById('delta-tec'),
  deltaEst: document.getElementById('delta-est'),
  deltaPaises: document.getElementById('delta-paises'),
  deltaSelecionarTodos: document.getElementById('delta-selecionar-todos'),
  deltaLimpar: document.getElementById('delta-limpar'),
  deltaAplicar: document.getElementById('delta-aplicar'),
  csvInput: document.getElementById('csv-input'),
  csvPreviewBtn: document.getElementById('csv-preview'),
  csvAplicarBtn: document.getElementById('csv-aplicar'),
  csvPreviewArea: document.getElementById('csv-preview-area'),
};

function $(sel, ctx=document) { return ctx.querySelector(sel); }

async function carregarCatalogo() {
  try {
    const doc = await db.collection('configuracoes').doc('campos').get();
    catalog = doc.exists ? doc.data() : localCatalog;
  } catch (e) {
    console.warn('Catálogo não encontrado no Firestore, usando local.', e);
    catalog = localCatalog;
  }
}

function renderMenuSecoes() {
  el.menuSecoes.innerHTML = '';
  el.selectSecao.innerHTML = '';
  Object.entries(catalog).forEach(([secKey, sec]) => {
    const btn = document.createElement('button');
    btn.className = `w-full text-left rounded-lg px-3 py-2 text-sm border ${state.secaoSelecionada===secKey? 'border-brand-500/40 bg-brand-500/5' : 'border-white/10 hover:border-slate-500/40 hover:bg-white/5'}`;
    btn.textContent = sec.label || secKey;
    btn.onclick = () => { state.secaoSelecionada = secKey; renderMenuSecoes(); renderForm(); };
    el.menuSecoes.appendChild(btn);

    const opt = document.createElement('option');
    opt.value = secKey; opt.textContent = sec.label || secKey;
    if (secKey === state.secaoSelecionada) opt.selected = true;
    el.selectSecao.appendChild(opt);
  });
}

function renderSelectPaises() {
  el.selectPais.innerHTML = '';
  state.paises.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.Pais;
    el.selectPais.appendChild(opt);
  });
  if (state.paises.length) {
    state.paisSelecionado = state.paisSelecionado || state.paises[0].id;
    el.selectPais.value = state.paisSelecionado;
  }
}

function inputFor(fieldKey, fieldDef, valor) {
  const wrap = document.createElement('div');
  const label = document.createElement('label');
  label.className = 'text-xs text-slate-400';
  label.textContent = fieldDef.label || fieldKey;
  const inp = document.createElement(fieldDef.tipo === 'texto' ? 'input' : 'input');
  inp.className = 'mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm';
  inp.name = fieldKey;
  if (fieldDef.tipo === 'percent' || fieldDef.tipo === 'inteiro') inp.type = 'number';
  else if (fieldDef.tipo === 'moeda') inp.type = 'number';
  else inp.type = 'text';
  if (fieldDef.min != null) inp.min = String(fieldDef.min);
  if (fieldDef.max != null) inp.max = String(fieldDef.max);
  inp.value = valor ?? '';
  wrap.appendChild(label); wrap.appendChild(inp);
  return { wrap, get: ()=> (fieldDef.tipo==='inteiro'||fieldDef.tipo==='percent'||fieldDef.tipo==='moeda') ? Number(inp.value || 0) : inp.value };
}

function renderForm() {
  const pais = state.paises.find(p => p.id === state.paisSelecionado);
  const sec = catalog[state.secaoSelecionada];
  const dadosSecao = (pais && pais[state.secaoSelecionada]) || {};
  el.formSecao.innerHTML = '';
  el.listaCampos.innerHTML = '';
  const getters = {};
  sec.campos.forEach(def => {
    const g = inputFor(def.key, def, dadosSecao[def.key]);
    el.formSecao.appendChild(g.wrap);
    getters[def.key] = g.get;
    const li = document.createElement('div');
    li.className = 'text-slate-300 text-sm';
    li.textContent = `${def.label || def.key} (${def.tipo})`;
    el.listaCampos.appendChild(li);
  });

  el.btnSalvarSecao.onclick = async () => {
    if (!pais) return;
    const payload = {};
    Object.keys(getters).forEach(k => payload[k] = getters[k]());
    // validações básicas
    const defsByKey = Object.fromEntries(sec.campos.map(d => [d.key, d]));
    for (const [k,v] of Object.entries(payload)) {
      const d = defsByKey[k];
      if (d.min != null && v < d.min) return alert(`Campo ${d.label||k}: mínimo ${d.min}`);
      if (d.max != null && v > d.max) return alert(`Campo ${d.label||k}: máximo ${d.max}`);
    }
    try {
      await db.collection('paises').doc(pais.id).set({ [state.secaoSelecionada]: payload }, { merge: true });
      alert('Seção salva com sucesso.');
    } catch (e) {
      console.error(e); alert('Erro ao salvar. Veja o console.');
    }
  };
}

async function carregarTudo() {
  const cfg = await getGameConfig();
  if (cfg && cfg.turnoAtual) el.turnoAtual.textContent = `#${cfg.turnoAtual}`;
  if (cfg && cfg.turnoAtual && el.turnoInput) el.turnoInput.value = cfg.turnoAtual;
  state.paises = await getAllCountries();
  state.paises.sort((a,b)=> (a.Pais||'').localeCompare(b.Pais||''));
  renderSelectPaises();
  renderMenuSecoes();
  renderForm();
  // Preencher selects do simulador
  fillEcoSelects();
  updateEcoPreview();
  renderDeltaPaises();
  await carregarLogAcoes();
}

async function gatekeeper(user) {
  if (!user) { window.location.href = 'index.html'; return; }
  const perms = await checkUserPermissions(user.uid);
  if (!perms.isNarrator && !perms.isAdmin) {
    el.gate.classList.remove('hidden');
    document.getElementById('admin-root').classList.add('hidden');
    return;
  }
  // autorizado
  el.gate.classList.add('hidden');
  document.getElementById('admin-root').classList.remove('hidden');
  await carregarCatalogo();
  await carregarEconomia();
  await carregarTudo();
}

// Eventos
el.selectPais.addEventListener('change', (e)=> { state.paisSelecionado = e.target.value; renderForm(); });
el.selectSecao.addEventListener('change', (e)=> { state.secaoSelecionada = e.target.value; renderMenuSecoes(); renderForm(); });
el.btnRecarregar.addEventListener('click', carregarTudo);
el.btnSalvarTurno?.addEventListener('click', async ()=>{
  const n = Number(el.turnoInput?.value||'');
  if (Number.isNaN(n) || n < 0) { alert('Informe um número de turno válido.'); return; }
  const ok = await updateTurn(n);
  if (ok) { alert(`Turno atualizado para #${n}`); await carregarTudo(); }
  else { alert('Erro ao salvar turno.'); }
});
el.btnSalvarCatalogo.addEventListener('click', async ()=>{
  try {
    await db.collection('configuracoes').doc('campos').set(catalog || localCatalog, { merge: false });
    alert('Catálogo salvo no servidor.');
  } catch (e) { console.error(e); alert('Erro ao salvar catálogo.'); }
});
el.btnCarregarCatalogo.addEventListener('click', async ()=>{ await carregarCatalogo(); renderMenuSecoes(); renderForm(); });
el.btnAdicionarCampo.addEventListener('click', ()=>{
  const sec = catalog[state.secaoSelecionada];
  const key = prompt('Chave do campo (sem espaços, ex: LanchaTorpedeira)'); if (!key) return;
  const label = prompt('Rótulo (ex: Lancha torpedeira)') || key;
  const tipo = prompt('Tipo (inteiro|percent|moeda|texto)', 'inteiro') || 'inteiro';
  sec.campos.push({ key, label, tipo });
  renderForm();
  renderMenuSecoes();
});
if (el.logout) el.logout.addEventListener('click', (e)=>{ e.preventDefault(); auth.signOut(); });

auth.onAuthStateChanged(gatekeeper);

// ===== Simulador Econômico =====
async function carregarEconomia(){
  try{
    const doc = await db.collection('configuracoes').doc('economia').get();
    if (doc.exists) econ = { ...econ, ...doc.data() };
  } catch(e){ console.warn('Sem config economia; usando padrão', e); }
}

function fillEcoSelects(){
  if (!state.paises.length) {
    el.ecoInvestidor.innerHTML = `<option value="" disabled selected>(nenhum país encontrado)</option>`;
    el.ecoParceiro.innerHTML = `<option value="" disabled selected>—</option>`;
    return;
  }
  const opts = state.paises.map(p=>`<option value="${p.id}">${p.Pais || '(Sem nome)'}</option>`).join('');
  el.ecoInvestidor.innerHTML = opts;
  el.ecoParceiro.innerHTML = `<option value="">—</option>`+opts;
}

function getPaisById(id){ return state.paises.find(p=> p.id===id); }

function effPais(p){
  // tecnologia = Tec civil, urbanizacao = industrialização
  const tec = Number((p.geral?.Tecnologia ?? p.Tecnologia) || 0);
  const ind = Number((p.geral?.Urbanizacao ?? p.Urbanizacao) || 0);
  const e = econ.eficiencia;
  const raw = e.base + e.wTec*tec + e.wInd*ind;
  return Math.min(e.max, Math.max(e.min, raw));
}

function fdado(v){
  const n = Number(v||0);
  if (n<=5) return 0;
  const map = econ.dadoScale;
  return map[n] ?? 0;
}

function parseBonusPercent(){
  const b = Number(el.ecoBonus?.value || 0);
  const clamped = Math.min(3, Math.max(-3, b));
  return clamped/100;
}

function updateEcoPreview(){
  const invId = el.ecoInvestidor.value || (state.paises[0]?.id);
  const inv = getPaisById(invId);
  const parId = el.ecoParceiro.value;
  const par = getPaisById(parId);
  const investimento = Number(el.ecoInvestimento.value||0);
  const d = Number(el.ecoD12.value||0);
  const bonus = parseBonusPercent();
  const eff = inv ? effPais(inv) : 0;
  const fd = fdado(d);
  const mult = fd * eff * (1+bonus);
  const crescimento = Math.round(investimento * mult);
  const externo = $('input[name="eco-tipo"]:checked')?.value === 'externo';
  const split = externo ? econ.splitExterno : 1;
  const a = Math.round(crescimento * split);
  const b = externo ? Math.round(crescimento * split) : 0;

  el.ecoEff.textContent = inv ? `Tec ${inv.geral?.Tecnologia ?? inv.Tecnologia || 0} · Ind ${inv.geral?.Urbanizacao ?? inv.Urbanizacao || 0} → fator ${eff.toFixed(3)}` : '—';
  el.ecoFdado.textContent = d ? `${d} → fator ${fd.toFixed(2)}` : '—';
  el.ecoPreview.textContent = externo ? `${inv?.Pais||'—'} +${a.toLocaleString('pt-BR',{style:'currency',currency:'USD',maximumFractionDigits:0})} · ${par?.Pais||'—'} +${b.toLocaleString('pt-BR',{style:'currency',currency:'USD',maximumFractionDigits:0})}` : `${inv?.Pais||'—'} +${a.toLocaleString('pt-BR',{style:'currency',currency:'USD',maximumFractionDigits:0})}`;
  if (el.ecoBonusLabel) el.ecoBonusLabel.textContent = `${(bonus*100).toFixed(1)}%`;
}

function onEcoTipoChange(){
  const externo = $('input[name="eco-tipo"]:checked')?.value === 'externo';
  el.ecoParceiro.disabled = !externo;
  updateEcoPreview();
}

el.ecoRoll?.addEventListener('click', ()=>{ el.ecoD12.value = String(Math.floor(Math.random()*12)+1); updateEcoPreview(); });
el.ecoInvestidor?.addEventListener('change', updateEcoPreview);
el.ecoParceiro?.addEventListener('change', updateEcoPreview);
el.ecoInvestimento?.addEventListener('input', updateEcoPreview);
el.ecoD12?.addEventListener('input', updateEcoPreview);
el.ecoBonus?.addEventListener('input', updateEcoPreview);
document.addEventListener('change', (e)=>{ if (e.target && e.target.name==='eco-tipo') onEcoTipoChange(); });

el.ecoAplicar?.addEventListener('click', async ()=>{
  const invId = el.ecoInvestidor.value; if(!invId) return alert('Selecione o investidor');
  const externo = $('input[name="eco-tipo"]:checked')?.value === 'externo';
  const parId = el.ecoParceiro.value;
  const investimento = Number(el.ecoInvestimento.value||0); if(!(investimento>0)) return alert('Informe o investimento');
  const d = Number(el.ecoD12.value||0); if(!(d>=1 && d<=12)) return alert('Informe o D12 (1..12)');
  const bonus = parseBonusPercent();
  const notas = el.ecoNotas.value||'';

  const cfg = await getGameConfig();
  const turno = cfg?.turnoAtual ?? 0;

  try{
    await db.runTransaction(async (tx)=>{
      const invRef = db.collection('paises').doc(invId);
      const invSnap = await tx.get(invRef);
      if(!invSnap.exists) throw new Error('Investidor não encontrado');
      const invData = invSnap.data();
      const eff = effPais(invData);
      const mult = fdado(d) * eff * (1+bonus);
      const crescimento = Math.round(investimento * mult);
      const split = externo ? econ.splitExterno : 1;
      const addInv = Math.round(crescimento * split);

      // Atualiza PIB do investidor (suporta plano antigo ou seção 'geral')
      const invPIB = Number(invData.geral?.PIB ?? invData.PIB ?? 0) + addInv;
      if (invData.geral && invData.geral.PIB !== undefined) tx.update(invRef, { 'geral.PIB': invPIB });
      else tx.update(invRef, { PIB: invPIB });

      // Log da ação no investidor
      tx.set(invRef.collection('acoes').doc(), {
        turno, tipo: 'economia', externo, parceiroId: externo? parId:null,
        investimento, d12: d, bonus, fatores: { eficiencia: eff, dado: fdado(d) },
        crescimentoTotal: crescimento, recebido: addInv, notas, createdAt: new Date()
      });

      if (externo && parId) {
        const parRef = db.collection('paises').doc(parId);
        const parSnap = await tx.get(parRef);
        if (parSnap.exists) {
          const parData = parSnap.data();
          const addPar = Math.round(crescimento * split);
          const parPIB = Number(parData.geral?.PIB ?? parData.PIB ?? 0) + addPar;
          if (parData.geral && parData.geral.PIB !== undefined) tx.update(parRef, { 'geral.PIB': parPIB });
          else tx.update(parRef, { PIB: parPIB });
          tx.set(parRef.collection('acoes').doc(), {
            turno, tipo: 'economia', externo, parceiroId: invId,
            investimento, d12: d, bonus, fatores: { eficiencia: eff, dado: fdado(d) },
            crescimentoTotal: crescimento, recebido: addPar, notas, createdAt: new Date()
          });
        }
      }
    });
    alert('Ação aplicada com sucesso.');
    await carregarTudo();
  } catch(e){ console.error(e); alert('Erro ao aplicar ação.'); }
});

// ===== Log de ações do turno =====
async function carregarLogAcoes(){
  if (!el.listaAcoes) return;
  el.listaAcoes.innerHTML = '<div class="text-slate-400">Carregando...</div>';
  const cfg = await getGameConfig();
  const turno = cfg?.turnoAtual ?? 0;
  const id = el.ecoInvestidor?.value;
  if (!id) { el.listaAcoes.innerHTML = '<div class="text-slate-400">Selecione um investidor.</div>'; return; }
  try {
    const snap = await db.collection('paises').doc(id).collection('acoes').where('turno','==',turno).orderBy('createdAt','desc').limit(50).get();
    if (snap.empty) { el.listaAcoes.innerHTML = '<div class="text-slate-400">Sem ações registradas neste turno.</div>'; return; }
    const items = [];
    snap.forEach(doc=>{
      const a = doc.data();
      const valor = (a.recebido||0).toLocaleString('pt-BR',{style:'currency',currency:'USD',maximumFractionDigits:0});
      items.push(`<div class="rounded-lg border border-white/10 p-2">
        <div class="flex items-center justify-between">
          <div class="text-slate-300">${a.tipo==='economia'?'Economia':''} ${a.externo?'(externo)':''}</div>
          <div class="text-slate-400 text-xs">d12=${a.d12} • eff=${(a.fatores?.eficiencia||0).toFixed(3)}</div>
        </div>
        <div class="text-slate-400 text-sm">Recebido: <span class="text-slate-200 font-medium">${valor}</span> ${a.parceiroId?`• Parceiro: ${a.parceiroId}`:''}</div>
        ${a.notas?`<div class="text-slate-500 text-xs mt-1">${a.notas}</div>`:''}
      </div>`);
    });
    el.listaAcoes.innerHTML = items.join('');
  } catch(e){ console.error(e); el.listaAcoes.innerHTML = '<div class="text-red-400">Erro ao carregar ações.</div>'; }
}
el.logRecarregar?.addEventListener('click', carregarLogAcoes);
el.ecoInvestidor?.addEventListener('change', carregarLogAcoes);

// ===== Deltas em massa =====
function renderDeltaPaises(){
  if (!el.deltaPaises) return;
  if (!state.paises.length){ el.deltaPaises.innerHTML = '<div class="text-slate-400">Sem países.</div>'; return; }
  el.deltaPaises.innerHTML = state.paises.map(p=>`
    <label class="inline-flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1 text-sm">
      <input type="checkbox" class="delta-check" value="${p.id}" />
      <span>${p.Pais}</span>
    </label>
  `).join('');
}
el.deltaSelecionarTodos?.addEventListener('click', ()=>{ document.querySelectorAll('.delta-check').forEach(ch=> ch.checked = true); });
el.deltaLimpar?.addEventListener('click', ()=>{ document.querySelectorAll('.delta-check').forEach(ch=> ch.checked = false); });

el.deltaAplicar?.addEventListener('click', async ()=>{
  const ids = Array.from(document.querySelectorAll('.delta-check')).filter(ch=> ch.checked).map(ch=> ch.value);
  if (!ids.length) { alert('Selecione ao menos um país'); return; }
  const p = Number(el.deltaPIB?.value||0);
  const t = Number(el.deltaTec?.value||0);
  const e = Number(el.deltaEst?.value||0);
  if (!(p||t||e)) { alert('Informe ao menos um delta'); return; }
  if (Math.abs(t)>100 || Math.abs(e)>100) { alert('Valores fora do limite.'); return; }
  try{
    const batch = db.batch();
    ids.forEach(id=>{
      const ref = db.collection('paises').doc(id);
      batch.update(ref, {}); // placeholder to ensure valid batch; updates set below via get? we'll use FieldValue.increment style for PIB
    });
    // Firestore compat não suporta aritmética em objetos aninhados em batch sem ler antes
    // Então fazemos em série (ainda eficiente para dezenas)
    for (const id of ids){
      const ref = db.collection('paises').doc(id);
      const snap = await ref.get();
      if (!snap.exists) continue;
      const data = snap.data();
      const pathPIB = (data.geral && data.geral.PIB !== undefined) ? 'geral' : null;
      let pib = Number(pathPIB? data.geral.PIB : data.PIB || 0);
      let tec = Number(data.geral?.Tecnologia ?? data.Tecnologia ?? 0);
      let est = Number(data.geral?.Estabilidade ?? data.Estabilidade ?? 0);
      if (p) pib = Math.round(pib * (1 + p/100));
      if (t) tec = Math.max(0, Math.min(100, tec + t));
      if (e) est = Math.max(0, Math.min(100, est + e));
      const payload = pathPIB? { 'geral.PIB': pib, 'geral.Tecnologia': tec, 'geral.Estabilidade': est } : { PIB: pib, Tecnologia: tec, Estabilidade: est };
      await ref.set(payload, { merge: true });
    }
    alert('Deltas aplicados com sucesso.');
    await carregarTudo();
  } catch(err){ console.error(err); alert('Erro ao aplicar deltas.'); }
});

// ===== Importação CSV por seção =====
function parseCSV(text){
  // Parser simples com aspas
  const rows = [];
  let i=0, cur='', inq=false, row=[];
  for (const ch of (text||'')){
    if (ch==='"'){ inq=!inq; continue; }
    if (!inq && (ch===',' || ch===';')){ row.push(cur); cur=''; continue; }
    if (!inq && (ch==='\n' || ch==='\r')){ if (cur!=='' || row.length){ row.push(cur); rows.push(row); row=[]; cur=''; } continue; }
    cur+=ch;
  }
  if (cur!=='' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r=> r.length>0);
}

let csvPreviewData = null;
el.csvPreviewBtn?.addEventListener('click', ()=>{
  const secKey = state.secaoSelecionada;
  const sec = catalog[secKey];
  const rows = parseCSV(el.csvInput?.value||'');
  if (!rows.length) { el.csvPreviewArea.innerHTML = '<div class="text-slate-400">Nenhuma linha.</div>'; return; }
  const header = rows[0].map(h=> h.trim());
  const paisIdx = header.findIndex(h=> h.toLowerCase()==='pais');
  if (paisIdx<0){ el.csvPreviewArea.innerHTML = '<div class="text-red-400">Cabeçalho precisa da coluna Pais.</div>'; return; }
  const fieldMap = {}; // header -> key
  const labelsToKey = Object.fromEntries(sec.campos.map(c=> [ (c.label||c.key).toLowerCase(), c.key ]));
  header.forEach((h,idx)=>{
    const k = labelsToKey[h.toLowerCase()] || h; if (idx!==paisIdx) fieldMap[idx]=k;
  });
  const preview = [];
  for (let r=1;r<rows.length;r++){
    const line = rows[r]; if (!line.length) continue;
    const paisNome = (line[paisIdx]||'').trim(); if(!paisNome) continue;
    const m = state.paises.find(p=> (p.Pais||'').toLowerCase() === paisNome.toLowerCase());
    const obj = { pais: paisNome, id: m?.id||null, data: {} };
    Object.entries(fieldMap).forEach(([idx,k])=>{ obj.data[k]= line[Number(idx)] });
    preview.push(obj);
  }
  csvPreviewData = { secKey, preview };
  const html = preview.slice(0,20).map(o=> `<div class="rounded-lg border border-white/10 p-2">${o.pais} ${o.id?'':'<span class=\"text-red-400\">(não encontrado)</span>'} → ${Object.entries(o.data).map(([k,v])=> `${k}:${v}`).join(', ')}</div>`).join('');
  el.csvPreviewArea.innerHTML = html + (preview.length>20? `<div class="text-slate-400 text-xs mt-1">… ${preview.length-20} linhas ocultas</div>` : '');
});

el.csvAplicarBtn?.addEventListener('click', async ()=>{
  if (!csvPreviewData){ alert('Faça a pré-visualização primeiro.'); return; }
  const { secKey, preview } = csvPreviewData;
  try{
    for (const it of preview){
      if (!it.id) continue;
      const ref = db.collection('paises').doc(it.id);
      // Convert números simples onde couber
      const conv = {};
      Object.entries(it.data).forEach(([k,v])=>{
        const n = Number(String(v).replace(/\./g,'').replace(',','.'));
        conv[k] = Number.isFinite(n) ? n : v;
      });
      await ref.set({ [secKey]: conv }, { merge: true });
    }
    alert('Importação concluída.');
    await carregarTudo();
  }catch(e){ console.error(e); alert('Erro na importação.'); }
});
