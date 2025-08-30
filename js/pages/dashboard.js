import { auth, checkPlayerCountry, getAllCountries } from "../services/firebase.js";

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function getStabilityInfo(stability) {
  if (stability <= 20) return { label: "Anarquia", tone: "bg-rose-500/15 text-rose-300 border-rose-400/30" };
  if (stability <= 49) return { label: "Instável", tone: "bg-amber-500/15 text-amber-300 border-amber-400/30" };
  if (stability <= 74) return { label: "Neutro", tone: "bg-sky-500/15 text-sky-300 border-sky-400/30" };
  return { label: "Tranquilo", tone: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" };
}
function formatCurrencyBR(v){
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v||0);
}
function calculateWPI(country) {
  const pibPerCapita = (parseFloat(country.PIB) || 0) / (parseFloat(country.Populacao) || 1);
  const normalizedPib = clamp(pibPerCapita, 0, 20000) / 200; // 0..100
  const score = Math.round((normalizedPib * 0.45) + (parseFloat(country.Tecnologia) || 0) * 0.55);
  return clamp(score, 1, 100);
}

function renderDashboard(country) {
  const el = document.getElementById('dashboard-content');
  if (!el) return;
  const wpi = calculateWPI(country);
  const stability = getStabilityInfo(parseFloat(country.Estabilidade) || 0);

  const bandeiraURL = country.BandeiraURL || '';
  const bandeiraImg = bandeiraURL ? `<img src="${bandeiraURL}" alt="Bandeira de ${country.Pais}" class="h-40 w-full object-cover" />` : `<div class="h-40 w-full grid place-items-center text-6xl bg-slate-800">🏴</div>`;

  el.innerHTML = `
    <div class="grid gap-6 md:grid-cols-2">
      <div class="relative rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/70 to-slate-950/70 p-6 backdrop-blur-xl shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-slate-100">${country.Pais}</h1>
            <p class="text-sm text-slate-400 mt-1">PIB per capita <span class="font-semibold text-slate-200">${formatCurrencyBR((parseFloat(country.PIB)||0)/(parseFloat(country.Populacao)||1))}</span></p>
          </div>
          <div class="shrink-0">
            <div class="grid place-items-center h-14 w-14 rounded-2xl border border-white/10 bg-slate-900/60 shadow-inner">
              <span class="text-xl font-extrabold text-slate-100">${wpi}</span>
            </div>
            <div class="mt-1 text-[10px] text-center uppercase tracking-wider text-slate-400">War Power</div>
          </div>
        </div>
        <div class="relative overflow-hidden rounded-xl mt-5 ring-1 ring-white/10">
          ${bandeiraImg}
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
          <div class="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-slate-200/90">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <span>Estabilidade: ${country.ModeloPolitico || '—'}</span>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-2 gap-4">
          <div class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-400">PIB</div>
            <div class="mt-1 text-lg font-semibold text-slate-100">${formatCurrencyBR(country.PIB)}</div>
          </div>
          <div class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-400">População</div>
            <div class="mt-1 text-lg font-semibold text-slate-100">${Number(country.Populacao||0).toLocaleString('pt-BR')}</div>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-4">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border ${stability.tone}">Estabilidade: ${stability.label}</span>
            <div class="text-sm text-slate-300">Índice: <span class="font-semibold text-slate-100">${country.Estabilidade}/100</span></div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-slate-300 text-sm"><span>Tecnologia</span><span class="font-medium text-slate-200">${country.Tecnologia}%</span></div>
            <div class="h-2.5 w-full rounded-full bg-slate-800/60 ring-1 ring-white/5 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300" style="width: ${clamp(country.Tecnologia,0,100)}%"></div></div>
          </div>
        </div>
      </div>

      <div class="relative rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/70 p-6 backdrop-blur-xl shadow-xl">
        <h2 class="text-lg font-semibold text-slate-100">Resumo Estratégico</h2>
        <div class="mt-5 grid gap-4">
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"><span class="text-sm text-slate-400">Modelo Político</span><span class="text-sm font-medium text-slate-100">${country.ModeloPolitico || '—'}</span></div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"><span class="text-sm text-slate-400">War Power Index</span><span class="text-sm font-medium text-slate-100">${wpi}/100</span></div>
        </div>
      </div>
    </div>`;
}

async function initDashboard(user){
  const content = document.getElementById('dashboard-content');
  if (!user){
    // Não logado -> volta para home
    window.location.href = 'index.html';
    return;
  }
  try{
    const paisId = await checkPlayerCountry(user.uid);
    const all = await getAllCountries();
    const country = paisId ? all.find(c => c.id === paisId) : null;
    if (!country){
      content.innerHTML = '<div class="rounded-xl border border-bg-ring/70 p-6 bg-bg-soft text-slate-300">Você ainda não está vinculado a um país.</div>';
      return;
    }
    renderDashboard(country);
  }catch(e){
    console.error('Erro ao carregar dashboard:', e);
    content.innerHTML = '<div class="rounded-xl border border-red-500/30 p-6 bg-red-500/5 text-red-300">Erro ao carregar painel do jogador.</div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const logout = document.getElementById('logout-link');
  if (logout) logout.addEventListener('click', (e) => { e.preventDefault(); auth.signOut(); });
  auth.onAuthStateChanged(initDashboard);
});

