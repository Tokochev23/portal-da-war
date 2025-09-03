import { auth, checkPlayerCountry, getAllCountries } from "../services/firebase.js";
import { formatCurrencyCompact } from "../utils.js";

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
function formatCurrencyMBT(valor) {
  const num = parseFloat(valor) || 0;
  if (num === 0) return 'US$ 0';
  
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (abs >= 1000000000000) {
    // Trilhões - mostrar com 3 casas: 1.234.567T
    return `${sign}US$ ${(abs / 1000000000000).toFixed(3).replace('.', ',')}T`.replace(/,(\d{3})$/, '.$1');
  } else if (abs >= 1000000000) {
    // Bilhões - mostrar com 3 casas: 265.525B  
    const billions = abs / 1000000000;
    return `${sign}US$ ${billions.toFixed(3).replace('.', ',')}B`.replace(/,(\d{3})$/, '.$1');
  } else if (abs >= 1000000) {
    // Milhões - mostrar com 3 casas: 31.365M
    const millions = abs / 1000000;
    return `${sign}US$ ${millions.toFixed(3).replace('.', ',')}M`.replace(/,(\d{3})$/, '.$1');
  } else if (abs >= 1000) {
    // Milhares - mostrar sem decimais: 500K
    return `${sign}US$ ${(abs / 1000).toFixed(0)}K`;
  } else {
    return `${sign}US$ ${abs.toFixed(0)}`;
  }
}
function calculateWPI(country) {
  const pibPerCapita = (parseFloat(country.PIB) || 0) / (parseFloat(country.Populacao) || 1);
  const normalizedPib = clamp(pibPerCapita, 0, 20000) / 200; // 0..100
  const score = Math.round((normalizedPib * 0.45) + (parseFloat(country.Tecnologia) || 0) * 0.55);
  return clamp(score, 1, 100);
}
function calculateBudget(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const burocracia = (parseFloat(country.Burocracia) || 0) / 100; // converter porcentagem para decimal
  const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100; // converter para decimal
  return pibBruto * 0.25 * burocracia * estabilidade * 1.5;
}
function calculateVehicleProductionCapacity(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100; // converter para decimal
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100; // converter para decimal
  const tecnologiaVeiculos = (parseFloat(country.Veiculos) || 0) / 100; // campo Veiculos = tecnologia de veículos
  
  // Fórmula: PIB × TecnologiaCivil × Urbanização × TecnologiaVeículos × fator_multiplicador
  const fatorMultiplicador = 0.15; // ajustável conforme necessário
  return pibBruto * tecnologiaCivil * urbanizacao * tecnologiaVeiculos * fatorMultiplicador;
}
function calculateAircraftProductionCapacity(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;
  const tecnologiaAeronautica = (parseFloat(country.Aeronautica) || 0) / 100; // campo Aeronautica = tecnologia aeronáutica
  
  const fatorMultiplicador = 0.12; // aeronaves são mais complexas, fator menor
  return pibBruto * tecnologiaCivil * urbanizacao * tecnologiaAeronautica * fatorMultiplicador;
}
function calculateShipProductionCapacity(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;
  const tecnologiaMarinha = (parseFloat(country.Marinha) || 0) / 100; // campo Marinha = tecnologia naval
  
  const fatorMultiplicador = 0.18; // navios são caros mas mais simples que aeronaves
  return pibBruto * tecnologiaCivil * urbanizacao * tecnologiaMarinha * fatorMultiplicador;
}

function renderDashboard(country) {
  const el = document.getElementById('dashboard-content');
  if (!el) return;
  const wpi = calculateWPI(country);
  const budget = calculateBudget(country);
  const vehicleProductionCapacity = calculateVehicleProductionCapacity(country);
  const aircraftProductionCapacity = calculateAircraftProductionCapacity(country);
  const shipProductionCapacity = calculateShipProductionCapacity(country);
  const stability = getStabilityInfo(parseFloat(country.Estabilidade) || 0);

  // Importar função de bandeiras do renderer
  const getBandeiraHTML = () => {
    // Tentar bandeira histórica primeiro
    const historicalFlags = {
      'urss': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_Soviet_Union_(1936_%E2%80%93_1955).svg.png?alt=media&token=9fee6c50-c4db-4e08-817a-941eb31724bf',
      'uniao sovietica': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_Soviet_Union_(1936_%E2%80%93_1955).svg.png?alt=media&token=9fee6c50-c4db-4e08-817a-941eb31724bf',
      'russia': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_Soviet_Union_(1936_%E2%80%93_1955).svg.png?alt=media&token=9fee6c50-c4db-4e08-817a-941eb31724bf'
    };
    
    const countryKey = (country.Pais || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const historicalUrl = historicalFlags[countryKey];
    
    if (historicalUrl) {
      return `<img src="${historicalUrl}" alt="Bandeira de ${country.Pais}" class="h-40 w-full object-cover" loading="lazy" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'h-40 w-full grid place-items-center text-4xl bg-slate-800\\'>🏴</div>';">`;
    }
    
    // Fallback para bandeira do país ou placeholder
    if (country.BandeiraURL) {
      return `<img src="${country.BandeiraURL}" alt="Bandeira de ${country.Pais}" class="h-40 w-full object-cover" />`;
    }
    
    return `<div class="h-40 w-full grid place-items-center text-4xl bg-slate-800">🏴</div>`;
  };
  
  const bandeiraImg = getBandeiraHTML();

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
        <div class="mt-6 grid grid-cols-3 gap-4">
          <div class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-400">PIB</div>
            <div class="mt-1 text-base font-semibold text-slate-100">${formatCurrencyMBT(country.PIB)}</div>
          </div>
          <div class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-400">Orçamento</div>
            <div class="mt-1 text-base font-semibold text-emerald-400">${formatCurrencyMBT(budget)}</div>
          </div>
          <div class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-400">População</div>
            <div class="mt-1 text-base font-semibold text-slate-100 break-words">${formatCurrencyCompact(country.Populacao, 'BRL').replace('R$', '').replace('US$', '')}</div>
          </div>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-4">
          <div class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-400">Burocracia</div>
            <div class="mt-1 text-lg font-semibold text-slate-100">${country.Burocracia || 0}</div>
          </div>
          <div class="rounded-xl border border-white/5 bg-slate-900/40 p-4">
            <div class="text-xs uppercase tracking-wide text-slate-400">Combustível</div>
            <div class="mt-1 text-lg font-semibold text-slate-100">${country.Combustivel || 0}</div>
          </div>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-4">
          <div class="flex items-center justify-between">
            <span class="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border ${stability.tone}">Estabilidade: ${stability.label}</span>
            <div class="text-sm text-slate-300">Índice: <span class="font-semibold text-slate-100">${country.Estabilidade}/100</span></div>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-slate-300 text-sm"><span>Tecnologia</span><span class="font-medium text-slate-200">${country.Tecnologia}</span></div>
            <div class="h-2.5 w-full rounded-full bg-slate-800/60 ring-1 ring-white/5 overflow-hidden"><div class="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300" style="width: ${clamp(country.Tecnologia,0,100)}%"></div></div>
          </div>
        </div>
      </div>

      <div class="relative rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/70 p-6 backdrop-blur-xl shadow-xl">
        <h2 class="text-lg font-semibold text-slate-100">Inventário de Veículos</h2>
        <div class="mt-5 grid grid-cols-3 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="cavalos">
            <div class="text-xs text-slate-400">Cavalos</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.cavalos || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="tanquesLeves">
            <div class="text-xs text-slate-400">Tanques Leves</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.tanquesLeves || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="mbt">
            <div class="text-xs text-slate-400">MBT</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.mbt || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="tanquesPesados">
            <div class="text-xs text-slate-400">Tanques Pesados</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.tanquesPesados || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="caminhoes">
            <div class="text-xs text-slate-400">Caminhões</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.caminhoes || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="spg">
            <div class="text-xs text-slate-400">SPG</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.spg || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="sph">
            <div class="text-xs text-slate-400">SPH</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.sph || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="spaa">
            <div class="text-xs text-slate-400">SPAA</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.spaa || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="apc">
            <div class="text-xs text-slate-400">APC</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.apc || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="cacaTanques">
            <div class="text-xs text-slate-400">Caça-Tanques</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.cacaTanques || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="veiculosEng">
            <div class="text-xs text-slate-400">Eng. Veículos</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.veiculosEng || 0}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-2 hover:bg-slate-900/60 cursor-pointer transition-colors" data-inventory-type="ifv">
            <div class="text-xs text-slate-400">IFV</div>
            <div class="mt-1 text-sm font-semibold text-slate-100">${country.inventario?.ifv || 0}</div>
          </div>
        </div>
        
        <h3 class="text-md font-semibold text-slate-100 mt-6">Resumo Militar</h3>
        <div class="mt-3 grid grid-cols-1 gap-3">
          <div class="rounded-lg border border-white/5 bg-slate-900/40 p-3">
            <div class="text-xs text-slate-400">Força Terrestre</div>
            <div class="mt-1 text-lg font-semibold text-slate-100">${country.Exercito || 0}</div>
            <div class="mt-1 text-xs text-slate-500">Soldados convencionais</div>
          </div>
        </div>
        
        <h3 class="text-md font-semibold text-slate-100 mt-6">Capacidades de Produção</h3>
        <div class="mt-3 grid gap-3">
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
            <span class="text-sm text-slate-400">Veículos</span>
            <span class="text-sm font-medium text-blue-400">${formatCurrencyMBT(vehicleProductionCapacity)}/turno</span>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
            <span class="text-sm text-slate-400">Aeronaves</span>
            <span class="text-sm font-medium text-cyan-400">${formatCurrencyMBT(aircraftProductionCapacity)}/turno</span>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
            <span class="text-sm text-slate-400">Navios</span>
            <span class="text-sm font-medium text-indigo-400">${formatCurrencyMBT(shipProductionCapacity)}/turno</span>
          </div>
        </div>
        
        <h4 class="text-sm font-semibold text-slate-100 mt-4">Tecnologias</h4>
        <div class="mt-2 grid grid-cols-3 gap-3">
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
            <span class="text-xs text-slate-400">Veículos</span>
            <span class="text-xs font-medium text-slate-100">${country.Veiculos || 0}</span>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
            <span class="text-xs text-slate-400">Aeronáutica</span>
            <span class="text-xs font-medium text-slate-100">${country.Aeronautica || 0}</span>
          </div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
            <span class="text-xs text-slate-400">Naval</span>
            <span class="text-xs font-medium text-slate-100">${country.Marinha || 0}</span>
          </div>
        </div>
        
        <h4 class="text-sm font-semibold text-slate-100 mt-6">🏗️ Ferramentas de Design</h4>
        <p class="text-xs text-slate-400 mt-1">Crie veículos, aeronaves e navios customizados para seu exército</p>
        <div class="mt-3 grid grid-cols-1 gap-3">
          <a href="criador-veiculos.html" class="group rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 p-4 transition-all duration-200 hover:border-blue-500/50">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">🚗</div>
              <div class="flex-1">
                <h3 class="font-semibold text-blue-100 group-hover:text-white transition-colors">Criador de Veículos</h3>
                <p class="text-xs text-blue-300/80 group-hover:text-blue-300 transition-colors mt-0.5">Tanques principais, veículos blindados, SPGs e caça-tanques personalizados</p>
                <div class="text-xs text-blue-400 mt-1">Tecnologia disponível: ${country.Veiculos || 0}%</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
          <div class="group rounded-lg border border-slate-600/30 bg-slate-600/10 p-4 opacity-60 cursor-not-allowed">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-600/20 flex items-center justify-center text-lg">✈️</div>
              <div class="flex-1">
                <h3 class="font-semibold text-slate-300">Criador de Aeronaves</h3>
                <p class="text-xs text-slate-400 mt-0.5">Caças, bombardeiros e aeronaves de apoio próximo (em desenvolvimento)</p>
                <div class="text-xs text-slate-500 mt-1">Tecnologia disponível: ${country.Aeronautica || 0}%</div>
              </div>
            </div>
          </div>
          <div class="group rounded-lg border border-slate-600/30 bg-slate-600/10 p-4 opacity-60 cursor-not-allowed">
            <div class="flex items-center gap-3">
              <div class="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-600/20 flex items-center justify-center text-lg">🚢</div>
              <div class="flex-1">
                <h3 class="font-semibold text-slate-300">Criador de Navios</h3>
                <p class="text-xs text-slate-400 mt-0.5">Destroyers, submarinos e navios de transporte personalizados (em desenvolvimento)</p>
                <div class="text-xs text-slate-500 mt-1">Tecnologia disponível: ${country.Marinha || 0}%</div>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="text-md font-semibold text-slate-100 mt-6">Resumo Estratégico</h3>
        <div class="mt-3 grid gap-3">
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"><span class="text-sm text-slate-400">Modelo Político</span><span class="text-sm font-medium text-slate-100">${country.ModeloPolitico || '—'}</span></div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"><span class="text-sm text-slate-400">War Power Index</span><span class="text-sm font-medium text-slate-100">${wpi}/100</span></div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"><span class="text-sm text-slate-400">Orçamento Nacional</span><span class="text-sm font-medium text-emerald-400">${formatCurrencyMBT(budget)}</span></div>
          <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2"><span class="text-sm text-slate-400">Último Turno</span><span class="text-sm font-medium text-slate-100">#${country.TurnoUltimaAtualizacao || 0}</span></div>
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
    
    // Store country in localStorage for vehicle creator
    localStorage.setItem('loggedCountry', country.id);
    console.log('País salvo no localStorage:', country.id);
    
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

