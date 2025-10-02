import { formatCurrency, formatCurrencyCompact, formatDelta, animateCounter } from "../utils.js";

// Cache de elementos do DOM
const DOM = {
  countryListContainer: document.getElementById('lista-paises-publicos'),
  emptyState: document.getElementById('empty-state'),
  totalCountriesBadge: document.getElementById('total-paises-badge'),
  totalPlayers: document.getElementById('total-players'),
  pibMedio: document.getElementById('pib-medio'),
  estabilidadeMedia: document.getElementById('estabilidade-media'),
  paisesPublicos: document.getElementById('paises-publicos'),
  playerCountryName: document.getElementById('player-country-name'),
  playerCurrentTurn: document.getElementById('player-current-turn'),
  playerPib: document.getElementById('player-pib'),
  playerEstabilidade: document.getElementById('player-estabilidade'),
  playerCombustivel: document.getElementById('player-combustivel'),
  playerPibDelta: document.getElementById('player-pib-delta'),
  playerEstabilidadeDelta: document.getElementById('player-estabilidade-delta'),
  playerCombustivelDelta: document.getElementById('player-combustivel-delta'),
  playerHistorico: document.getElementById('player-historico'),
  playerNotifications: document.getElementById('player-notifications'),
  playerPanel: document.getElementById('player-panel'),
  narratorTools: document.getElementById('narrator-tools'),
  userRoleBadge: document.getElementById('user-role-badge'),
  countryPanelModal: document.getElementById('country-panel-modal'),
  countryPanelContent: document.getElementById('country-panel-content'),
  closeCountryPanelBtn: document.getElementById('close-country-panel'),
};

// Utils
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function getStabilityInfo(stability) {
  if (stability <= 20) return { label: "Anarquia", tone: "bg-rose-500/15 text-rose-300 border-rose-400/30" };
  if (stability <= 49) return { label: "Instável", tone: "bg-amber-500/15 text-amber-300 border-amber-400/30" };
  if (stability <= 74) return { label: "Neutro", tone: "bg-sky-500/15 text-sky-300 border-sky-400/30" };
  return { label: "Tranquilo", tone: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" };
}
function calculateWPI(country) {
  const pibPerCapita = (parseFloat(country.PIB) || 0) / (parseFloat(country.Populacao) || 1);
  const normalizedPib = clamp(pibPerCapita, 0, 20000) / 200; // 0..100
  const score = Math.round((normalizedPib * 0.45) + (parseFloat(country.Tecnologia) || 0) * 0.55);
  return clamp(score, 1, 100);
}
function calculateBudget(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
  const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;
  return pibBruto * 0.25 * burocracia * estabilidade * 1.5;
}
function calculateMilitaryBudget(country) {
  const generalBudget = calculateBudget(country);
  const percentualMilitar = (parseFloat(country.MilitaryBudgetPercent) || 30) / 100;
  return generalBudget * percentualMilitar;
}

function getMilitaryDistribution(country) {
  const vehicles = (parseFloat(country.MilitaryDistributionVehicles) || 40) / 100;
  const aircraft = (parseFloat(country.MilitaryDistributionAircraft) || 30) / 100;
  const naval = (parseFloat(country.MilitaryDistributionNaval) || 30) / 100;

  return {
    vehicles: vehicles,
    aircraft: aircraft,
    naval: naval,
    maintenancePercent: 0.15
  };
}

function calculateVehicleProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);
  return orcamentoMilitar * distribution.vehicles;
}
function calculateAircraftProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);
  return orcamentoMilitar * distribution.aircraft;
}
function calculateShipProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);
  return orcamentoMilitar * distribution.naval;
}



// === SISTEMA DE BANDEIRAS OTIMIZADO ===

// Mapeamento de nomes de países para códigos de duas letras
const COUNTRY_CODE_MAP = {
    'afeganistao':'AF','afghanistan':'AF',
    'africa do sul':'ZA','south africa':'ZA',
    'alemanha':'DE','germany':'DE',
    'argentina':'AR',
    'australia':'AU',
    'austria':'AT',
    'belgica':'BE','belgium':'BE',
    'bolivia':'BO',
    'brasil':'BR','brazil':'BR',
    'canada':'CA',
    'chile':'CL',
    'china':'CN',
    'colombia':'CO',
    'coreia do sul':'KR','south korea':'KR',
    'coreia do norte':'KP','north korea':'KP',
    'cuba':'CU',
    'dinamarca':'DK','denmark':'DK',
    'egito':'EG','egypt':'EG',
    'espanha':'ES','spain':'ES',
    'estados unidos':'US','eua':'US','usa':'US','united states':'US',
    'finlandia':'FI',
    'franca':'FR','france':'FR',
    'grecia':'GR','greece':'GR',
    'holanda':'NL','paises baixos':'NL','netherlands':'NL',
    'hungria':'HU','hungary':'HU',
    'india':'IN',
    'indonesia':'ID',
    'ira':'IR','iran':'IR',
    'iraque':'IQ','iraq':'IQ',
    'irlanda':'IE','ireland':'IE',
    'israel':'IL',
    'italia':'IT','italy':'IT',
    'japao':'JP','japan':'JP',
    'malasia':'MY','malaysia':'MY',
    'marrocos':'MA','morocco':'MA',
    'mexico':'MX',
    'nigeria':'NG',
    'noruega':'NO','norway':'NO',
    'nova zelandia':'NZ','new zealand':'NZ',
    'peru':'PE',
    'polonia':'PL','poland':'PL',
    'portugal':'PT',
    'reino unido':'GB','inglaterra':'GB','uk':'GB','united kingdom':'GB',
    'russia':'RU',
    'urss':'RU',
    'uniao sovietica':'RU',
    'singapura':'SG','singapore':'SG',
    'suecia':'SE','sweden':'SE',
    'suica':'CH','switzerland':'CH',
    'turquia':'TR','turkey':'TR',
    'ucrania':'UA','ukraine':'UA',
    'uruguai':'UY',
    'venezuela':'VE',
    'vietna':'VN','vietnam':'VN',
    'equador':'EC',
    'paraguai':'PY',
    'albania':'AL',
    'argelia':'DZ','algeria':'DZ',
    'andorra':'AD',
    'angola':'AO',
    'antigua e barbuda':'AG','antigua and barbuda':'AG',
    'armenia':'AM',
    'azerbaijao':'AZ','azerbaijan':'AZ',
    'bahamas':'BS',
    'bahrein':'BH','bahrain':'BH',
    'bangladesh':'BD',
    'barbados':'BB',
    'belarus':'BY','bielorrússia':'BY',
    'belize':'BZ',
    'benin':'BJ',
    'butao':'BT','bhutan':'BT',
    'bosnia e herzegovina':'BA','bosnia and herzegovina':'BA',
    'botsuana':'BW','botswana':'BW',
    'brunei':'BN',
    'bulgaria':'BG',
    'burkina faso':'BF',
    'burundi':'BI',
    'camboja':'KH','cambodia':'KH',
    'camarões':'CM','cameroon':'CM',
    'cabo verde':'CV','cape verde':'CV',
    'republica centro-africana':'CF','central african republic':'CF',
    'chade':'TD','chad':'TD',
    'comores':'KM','comoros':'KM',
    'congo':'CG',
    'costa rica':'CR',
    'croacia':'HR','croatia':'HR',
    'chipre':'CY','cyprus':'CY',
    'republica tcheca':'CZ','czech republic':'CZ','tchequia':'CZ',
    'republica dominicana':'DO','dominican republic':'DO',
    'timor-leste':'TL','east timor':'TL',
    'el salvador':'SV',
    'guine equatorial':'GQ','equatorial guinea':'GQ',
    'eritreia':'ER',
    'estonia':'EE',
    'etiopia':'ET','ethiopia':'ET',
    'fiji':'FJ',
    'gabao':'GA','gabon':'GA',
    'gambia':'GM',
    'georgia':'GE',
    'gana':'GH','ghana':'GH',
    'guatemala':'GT',
    'guine':'GN','guinea':'GN',
    'guine-bissau':'GW','guinea-bissau':'GW',
    'guiana':'GY','guyana':'GY',
    'haiti':'HT',
    'honduras':'HN',
    'islandia':'IS','iceland':'IS',
    'jamaica':'JM',
    'jordania':'JO','jordan':'JO',
    'cazaquistao':'KZ','kazakhstan':'KZ',
    'quenia':'KE','kenya':'KE',
    'kiribati':'KI',
    'kuwait':'KW',
    'quirguistao':'KG','kyrgyzstan':'KG',
    'laos':'LA',
    'letonia':'LV','latvia':'LV',
    'libano':'LB','lebanon':'LB',
    'lesoto':'LS','lesotho':'LS',
    'liberia':'LR',
    'libia':'LY','libya':'LY',
    'liechtenstein':'LI',
    'lituania':'LT','lithuania':'LT',
    'luxemburgo':'LU','luxembourg':'LU',
    'madagascar':'MG',
    'malawi':'MW',
    'maldivas':'MV','maldives':'MV',
    'mali':'ML',
    'malta':'MT',
    'ilhas marshall':'MH','marshall islands':'MH',
    'mauritania':'MR',
    'mauricio':'MU','mauritius':'MU',
    'micronesia':'FM',
    'moldova':'MD',
    'monaco':'MC',
    'mongolia':'MN',
    'montenegro':'ME',
    'mocambique':'MZ','mozambique':'MZ',
    'myanmar':'MM','birmania':'MM',
    'namibia':'NA',
    'nauru':'NR',
    'nepal':'NP',
    'nicaragua':'NI',
    'niger':'NE',
    'macedonia do norte':'MK','north macedonia':'MK',
    'oma':'OM','oman':'OM',
    'paquistao':'PK','pakistan':'PK',
    'palau':'PW',
    'panama':'PA',
    'papua-nova guine':'PG','papua new guinea':'PG',
    'filipinas':'PH','philippines':'PH',
    'catar':'QA','qatar':'QA',
    'romenia':'RO','romania':'RO',
    'ruanda':'RW',
    'sao cristovao e nevis':'KN','saint kitts and nevis':'KN',
    'santa lucia':'LC','saint lucia':'LC',
    'sao vicente e granadinas':'VC','saint vincent and the grenadines':'VC',
    'samoa':'WS',
    'san marino':'SM',
    'sao tome e principe':'ST','sao tome and principe':'ST',
    'arabia saudita':'SA','saudi arabia':'SA',
    'senegal':'SN',
    'servia':'RS','serbia':'RS',
    'seicheles':'SC','seychelles':'SC',
    'serra leoa':'SL','sierra leone':'SL',
    'eslovaquia':'SK','slovakia':'SK',
    'eslovenia':'SI','slovenia':'SI',
    'ilhas salomao':'SB','solomon islands':'SB',
    'somalia':'SO',
    'sri lanka':'LK',
    'sudao':'SD','sudan':'SD',
    'suriname':'SR',
    'siria':'SY','syria':'SY',
    'tajiquistao':'TJ','tajikistan':'TJ',
    'tanzania':'TZ',
    'tailandia':'TH','thailand':'TH',
    'togo':'TG',
    'tonga':'TO',
    'trinidad e tobago':'TT','trinidad and tobago':'TT',
    'tunisia':'TN',
    'turcomenistao':'TM','turkmenistan':'TM',
    'tuvalu':'TV',
    'uganda':'UG',
    'emirados arabes unidos':'AE','united arab emirates':'AE',
    'uzbequistao':'UZ','uzbekistan':'UZ',
    'vanuatu':'VU',
    'cidade do vaticano':'VA','vatican city':'VA','vaticano':'VA',
    'iemen':'YE','yemen':'YE',
    'zambia':'ZM',
    'zimbabue':'ZW','zimbabwe':'ZW'
};

// Função para normalizar nomes de países para busca de código
function getCountryCode(name) {
  if (!name) return null;
  const key = (name || '').toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  return COUNTRY_CODE_MAP[key] || null;
}

// Função para normalizar nomes de países para busca de bandeira histórica
function normalizeName(name) {
  return (name || '').toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Base de dados das bandeiras históricas de 1954
const HISTORICAL_FLAGS_1954 = {
  // África
  'africa equatorial francesa': 'assets/flags/historical/África Equatorial Francesa_.png',
  'africa ocidental francesa': 'assets/flags/historical/África Ocidental Francesa.gif',
  'africa portuguesa': 'assets/flags/historical/África Portuguesa.png',
  
  // Alemanhas
  'alemanha ocidental': 'assets/flags/historical/Alemanha Ocidental_.png',
  'alemanha oriental': 'assets/flags/historical/Alemanha Oriental.png',
  
  // Países europeus
  'andorra': 'assets/flags/historical/Andorra.png',
  'bulgaria': 'assets/flags/historical/Flag_of_Bulgaria_(1948–1967).svg.png',
  'canada': 'assets/flags/historical/Flag_of_Canada_(1921–1957).svg.png',
  'espanha': 'assets/flags/historical/Flag_of_Spain_(1945–1977).svg.png',
  'grecia': 'assets/flags/historical/State_Flag_of_Greece_(1863-1924_and_1935-1973).svg.png',
  'hungria': 'assets/flags/historical/Flag_of_Hungary_(1949-1956).svg.png',
  'iugoslavia': 'assets/flags/historical/Flag_of_Yugoslavia_(1946-1992).svg.png',
  'romenia': 'assets/flags/historical/Flag_of_Romania_(1952–1965).svg.png',
  
  // Oriente Médio e África
  'caribe britanico': 'assets/flags/historical/Caribe Britânico.png',
  'congo': 'assets/flags/historical/Flag_of_the_Congo_Free_State.svg.png',
  'costa do ouro': 'assets/flags/historical/Flag_of_the_Gold_Coast_(1877–1957).svg.png',
  'egito': 'assets/flags/historical/Flag_of_Egypt_(1952–1958).svg.png',
  'etiopia': 'assets/flags/historical/Flag_of_Ethiopia_(1897–1974).svg.png',
  'ira': 'assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png',
  'iran': 'assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png',
  'iraque': 'assets/flags/historical/Flag_of_Iraq_(1924–1959).svg.png',
  'quenia': 'assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png',
  'kenya': 'assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png',
  'rodesia do sul': 'assets/flags/historical/Flag_of_Southern_Rhodesia_(1924–1964).svg.png',
  'siria': 'assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png',
  'syria': 'assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png',
  
  // União Soviética e variações
  'uniao sovietica': 'assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png',
  'urss': 'assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png',
  'russia': 'assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png'
};

// Busca bandeira histórica por nome
function getHistoricalFlagUrl(countryName) {
  if (!countryName) return null;
  const normalized = normalizeName(countryName);
  // Busca exata
  if (HISTORICAL_FLAGS_1954[normalized]) {
    return HISTORICAL_FLAGS_1954[normalized];
  }
  // Busca parcial
  for (const [key, url] of Object.entries(HISTORICAL_FLAGS_1954)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }
  return null;
}

// Gera HTML da bandeira com sistema de prioridades
export function getFlagHTML(name, innerSizeClass = 'h-full w-full') {
  if (!name) return `<span class="text-slate-400 text-xs">🏴</span>`;

  // PRIORIDADE 1: Bandeiras históricas customizadas
  const historicalUrl = getHistoricalFlagUrl(name);
  if (historicalUrl) {
    return `<img src="${historicalUrl}" alt="Bandeira de ${name}" class="${innerSizeClass} object-contain" loading="lazy">`;
  }

  // PRIORIDADE 2: Bandeiras de países (PNG local)
  const countryCode = getCountryCode(name);
  if (countryCode) {
    const flagUrl = `assets/flags/countries/${countryCode.toLowerCase()}.png`;
    return `<img src="${flagUrl}" alt="Bandeira de ${name}" class="${innerSizeClass} object-contain" loading="lazy">`;
  }

  // PRIORIDADE 3: Fallback
  NO_FLAG_COUNTRIES.add(String(name || '').trim());
  return `<span class="text-slate-400 text-xs">🏴</span>`;
}


// Lista pública de países
const NO_FLAG_COUNTRIES = new Set();
if (!window.getMissingFlagCountries) {
  window.getMissingFlagCountries = () => Array.from(NO_FLAG_COUNTRIES).sort();
}
export function renderPublicCountries(countries) {
  if (!DOM.countryListContainer) return;
  DOM.countryListContainer.innerHTML = '';

  const validCountries = countries.filter(c => c.Pais && c.PIB && c.Populacao && c.Estabilidade && c.Urbanizacao && c.Tecnologia);
  if (DOM.totalCountriesBadge) DOM.totalCountriesBadge.textContent = `${validCountries.length} países`;

  if (validCountries.length === 0) {
    DOM.countryListContainer.innerHTML = `<div class="col-span-full text-center py-12"><div class="text-slate-400 mb-2">Nenhum país para exibir.</div></div>`;
    return;
  }

  validCountries.forEach(country => {
    // Priorizar dados da raiz (mais atualizados), senão usar da seção 'geral'
    const pib = country.PIB ?? country.geral?.PIB ?? 0;
    const populacao = country.geral?.Populacao ?? country.Populacao ?? 0;
    const estabilidade = country.geral?.Estabilidade ?? country.Estabilidade ?? 0;
    const tecnologia = country.geral?.Tecnologia ?? country.Tecnologia ?? 0;
    const urbanizacao = country.geral?.Urbanizacao ?? country.Urbanizacao ?? 0;
    
    const formattedPib = formatCurrency(pib);
    const formattedPopulation = Number(populacao).toLocaleString('pt-BR');
    const stabilityInfo = getStabilityInfo(parseFloat(estabilidade));
    // Passar dados atualizados para o WPI
    const countryForWPI = {
      ...country,
      PIB: pib,
      Populacao: populacao,
      Tecnologia: tecnologia,
      Estabilidade: estabilidade,
      Urbanizacao: urbanizacao
    };
    const wpi = calculateWPI(countryForWPI);
    const flagHTML = getFlagHTML(country.Pais);

    const cardHtml = `
      <button class="country-card-button group relative w-full rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_6px_20px_-12px_rgba(0,0,0,0.6)] hover:border-slate-600/60 hover:bg-slate-900/70 transition-all" data-country-id="${country.id}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-10 grid place-items-center rounded-md ring-1 ring-white/10 bg-slate-800">${flagHTML}</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-100">${country.Pais}</div>
              <div class="text-[10px] text-slate-400">PIB pc ${formatCurrency(country.PIBPerCapita || (pib / populacao))}</div>
            </div>
          </div>
          <div class="shrink-0 text-center">
            <div class="grid place-items-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/70 text-[11px] font-bold text-slate-100">${wpi}</div>
            <div class="mt-0.5 text-[9px] uppercase text-slate-500">WPI</div>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="flex items-center gap-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
              PIB
            </div>
            <div class="mt-0.5 font-medium text-slate-100">${formattedPib}</div>
          </div>
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="flex items-center gap-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
              Pop.
            </div>
            <div class="mt-0.5 font-medium text-slate-100">${formattedPopulation}</div>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between gap-2">
          <div class="truncate text-[11px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${country.ModeloPolitico || '—'}</div>
          <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${stabilityInfo.tone}">${stabilityInfo.label}</span>
        </div>
        <div class="mt-2">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span class="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
              Urbanização
            </span>
            <span class="text-slate-300">${Math.max(0, Math.min(100, urbanizacao))}%</span>
          </div>
          <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-1.5 rounded-full bg-emerald-500" style="width: ${Math.max(0, Math.min(100, urbanizacao))}%"></div>
          </div>
        </div>
      </button>`;

    DOM.countryListContainer.innerHTML += cardHtml;
  });


}

// Painel detalhado (compacto)
export function renderDetailedCountryPanel(country) {
  if (!DOM.countryPanelContent || !DOM.countryPanelModal) return;
  
  // Priorizar dados da seção 'geral' se existir
  const pib = country.PIB ?? country.geral?.PIB ?? 0;
  const populacao = country.geral?.Populacao ?? country.Populacao ?? 0;
  const estabilidade = country.geral?.Estabilidade ?? country.Estabilidade ?? 0;
  const tecnologia = country.geral?.Tecnologia ?? country.Tecnologia ?? 0;
  const urbanizacao = country.geral?.Urbanizacao ?? country.Urbanizacao ?? 0;
  
  const countryForWPI = { ...country, PIB: pib, Populacao: populacao, Tecnologia: tecnologia };
  const wpi = calculateWPI(countryForWPI);
  const budget = calculateBudget({ PIB: pib, Burocracia: country.Burocracia, Estabilidade: estabilidade });
  const vehicleProductionCapacity = calculateVehicleProductionCapacity({ PIB: pib, Tecnologia: tecnologia, Urbanizacao: urbanizacao, Veiculos: country.Veiculos });
  const aircraftProductionCapacity = calculateAircraftProductionCapacity({ PIB: pib, Tecnologia: tecnologia, Urbanizacao: urbanizacao, Aeronautica: country.Aeronautica });
  const shipProductionCapacity = calculateShipProductionCapacity({ PIB: pib, Tecnologia: tecnologia, Urbanizacao: urbanizacao, Marinha: country.Marinha });
  const stabilityInfo = getStabilityInfo(parseFloat(estabilidade));
  const pibTotal = formatCurrency(pib);
  const popTotal = Number(populacao).toLocaleString('pt-BR');
  const pibPerCapita = formatCurrency(country.PIBPerCapita || (pib / populacao));
  const urban = Math.max(0, Math.min(100, parseFloat(urbanizacao)));
  const flagContainer = `<span class=\"inline-grid h-8 w-12 place-items-center rounded-md ring-1 ring-white/10 bg-slate-800 overflow-hidden\">${getFlagHTML(country.Pais)}</span>`;

  const leftColumn = `
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight flex items-center gap-2">${flagContainer} ${country.Pais}</h2>
          <div class="text-sm text-slate-400">PIB per capita <span class="font-semibold text-slate-200">${pibPerCapita}</span></div>
        </div>
        <div class="text-center">
          <div class="h-12 w-12 grid place-items-center rounded-full border border-white/10 bg-slate-900/60 text-sm font-bold">${wpi}</div>
          <div class="text-[10px] uppercase text-slate-500 mt-0.5">War Power</div>
        </div>
      </div>

      <div class="text-[12px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${country.ModeloPolitico || '—'}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
            PIB
          </div>
          <div class="mt-1 text-lg font-semibold">${pibTotal}</div>
        </div>
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            População
          </div>
          <div class="mt-1 text-lg font-semibold">${popTotal}</div>
          <div class="mt-2 text-[12px] text-slate-400">Densidade urbana</div>
          <div class="mt-1">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
                Urbanização
              </span>
              <span class="text-slate-300">${urban}%</span>
            </div>
            <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div class="h-1.5 rounded-full bg-emerald-500" style="width:${urban}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Força Militar</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Exército</div>
            <div class="text-sm font-semibold text-slate-100">${country.Exercito || 0}</div>
            <div class="text-[9px] text-slate-500">Força terrestre</div>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Burocracia</div>
          <div class="text-sm font-semibold text-slate-100">${country.Burocracia || 0}%</div>
        </div>
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Combustível</div>
          <div class="text-sm font-semibold text-slate-100">${country.Combustivel || 0}</div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Capacidade de Produção</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Veículos por Turno</div>
            <div class="text-sm font-semibold text-blue-400">${formatCurrency(vehicleProductionCapacity)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Aeronaves por Turno</div>
            <div class="text-sm font-semibold text-cyan-400">${formatCurrency(aircraftProductionCapacity)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Navios por Turno</div>
            <div class="text-sm font-semibold text-indigo-400">${formatCurrency(shipProductionCapacity)}</div>
          </div>
        </div>
        
        <h5 class="text-xs font-medium text-slate-300 mt-3 mb-1">Tecnologias Militares</h5>
        <div class="grid grid-cols-3 gap-1">
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Veículos</div>
            <div class="text-xs font-semibold text-slate-100">${country.Veiculos || 0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Aeronáutica</div>
            <div class="text-xs font-semibold text-slate-100">${country.Aeronautica || 0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Naval</div>
            <div class="text-xs font-semibold text-slate-100">${country.Marinha || 0}%</div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-2">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border ${stabilityInfo.tone}">
          Estabilidade: ${stabilityInfo.label}
        </span>
        <div class="ml-auto text-[12px] text-slate-400">Índice: <span class="text-slate-200 font-semibold">${estabilidade}</span></div>
      </div>

      <div class="space-y-3 mt-2">
        <div>
          <div class="flex items-center justify-between text-[12px] text-slate-400">
            <span>Estabilidade Interna</span>
            <span class="text-slate-200">${estabilidade}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-cyan-400" style="width:${Math.max(0, Math.min(100, estabilidade))}%"></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between text-[12px] text-slate-400">
            <span>Tecnologia</span>
            <span class="text-slate-200">${tecnologia}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-emerald-400" style="width:${Math.max(0, Math.min(100, tecnologia))}%"></div>
          </div>
        </div>
      </div>
    </div>`;

  const rightColumn = `
    <div class="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
      <h3 class="text-lg font-semibold">Resumo Estratégico</h3>
      <p class="mt-1 text-[12px] text-slate-400">Visão geral de capacidades e riscos do país no contexto do seu RPG.</p>
      <div class="mt-4 space-y-2">
        ${[
          ['Modelo Político', country.ModeloPolitico || '—'],
          ['PIB total', pibTotal],
          ['PIB per capita', pibPerCapita],
          ['Orçamento Nacional', `<span class="text-emerald-400">${formatCurrency(budget)}</span>`],
          ['Prod. Veículos/turno', `<span class="text-blue-400">${formatCurrency(vehicleProductionCapacity)}</span>`],
          ['Prod. Aeronaves/turno', `<span class="text-cyan-400">${formatCurrency(aircraftProductionCapacity)}</span>`],
          ['Prod. Navios/turno', `<span class="text-indigo-400">${formatCurrency(shipProductionCapacity)}</span>`],
          ['População', popTotal],
          ['War Power Index', `${wpi}/100`],
          ['Burocracia', `${country.Burocracia || 0}%`],
          ['Combustível', `${country.Combustivel || 0}`],
          ['Último Turno', `#${country.TurnoUltimaAtualizacao || 0}`],
        ].map(([k,v]) => `
          <div class="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2 text-[13px]">
            <span class="text-slate-400">${k}</span>
            <span class="font-medium text-slate-100">${v}</span>
          </div>`).join('')}
      </div>
      <div class="mt-3 text-[11px] text-slate-500">
        * O War Power Index pondera tecnologia e renda per capita.<br>
        * Orçamento = PIB × 0,25 × Burocracia × Estabilidade × 1,5<br>
        * Prod. Veículos = PIB × TecnologiaCivil × Urbanização × Veículos × 0,15<br>
        * Prod. Aeronaves = PIB × TecnologiaCivil × Urbanização × Aeronáutica × 0,12<br>
        * Prod. Navios = PIB × TecnologiaCivil × Urbanização × Naval × 0,18
      </div>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Ver Exército</button>
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Diplomacia</button>
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Indústria</button>
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Relatórios</button>
      </div>
    </div>`;

  const html = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${leftColumn}
      ${rightColumn}
    </div>`;

  DOM.countryPanelContent.innerHTML = html;

  // show with transition
  const modal = DOM.countryPanelModal;
  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
    const panel = modal.querySelector('.transform');
    if (panel) panel.classList.remove('-translate-y-2');
  });
}

// Bloco de bandeiras duplicado removido — as definições originais estão no topo do arquivo

// UI do narrador
export function updateNarratorUI(isNarrator, isAdmin) {
  const { narratorTools, userRoleBadge } = DOM;
  
  if (narratorTools) {
    narratorTools.style.display = (isNarrator || isAdmin) ? 'block' : 'none';
  }
  
  const narratorLink = document.querySelector('a[href="narrador.html"]');
  if (narratorLink) {
    narratorLink.style.display = (isNarrator || isAdmin) ? 'block' : 'none';
  }
  
  if (userRoleBadge) {
    if (isAdmin) {
      userRoleBadge.textContent = 'Admin';
      userRoleBadge.className = 'text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20';
    } else if (isNarrator) {
      userRoleBadge.textContent = 'Narrador';
      userRoleBadge.className = 'text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20';
    } else {
      userRoleBadge.textContent = 'Jogador';
      userRoleBadge.className = 'text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20';
    }
  }
}

// Modal de seleção de país (resumo)
export function createCountrySelectionModal(availableCountries) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
  const modalContent = `
    <div class="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-bg-soft border border-bg-ring/70 p-6 overflow-hidden">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-slate-100">Escolha seu País</h2>
        <p class="text-sm text-slate-400 mt-1">Selecione um país para governar no RPG</p>
      </div>
      <div class="mb-4">
        <input type="text" id="busca-pais" placeholder="Buscar país..." class="w-full rounded-xl bg-bg border border-bg-ring/70 p-3 text-sm">
        <div class="mt-2 text-xs text-slate-400">Mostrando <span id="paises-visiveis">${availableCountries.length}</span> países disponíveis</div>
      </div>
      <div class="max-h-96 overflow-y-auto space-y-2">
        ${availableCountries.map(country => {
          const bandeira = getFlagHTML(country.Pais, 'h-6 w-9');
          return `
            <div class="pais-option rounded-xl border border-bg-ring/70 p-3 cursor-pointer" data-pais-id="${country.id}" data-pais-nome="${country.Pais}">
              <div class="flex items-center gap-3">
                <div class="h-6 w-9 rounded bg-slate-800 grid place-items-center">${bandeira}</div>
                <div class="flex-1">
                  <div class="font-medium text-slate-100">${country.Pais}</div>
                  <div class="text-xs text-slate-400">PIB: ${formatCurrency(country.PIB || 0)} · Pop: ${Number(country.Populacao || 0).toLocaleString('pt-BR')} · Tech: ${country.Tecnologia || 0}% · Estab: ${country.Estabilidade || 0}/100</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">WPI</div>
                  <div class="text-sm font-bold text-slate-200">${calculateWPI(country)}</div>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
      <div class="mt-6 flex gap-3">
        <button id="cancelar-selecao" class="flex-1 rounded-xl border border-bg-ring/70 px-4 py-2.5 text-slate-300">Cancelar</button>
        <button id="confirmar-selecao" class="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-slate-950 font-semibold" disabled>Confirmar Seleção</button>
      </div>
    </div>`;
  modal.innerHTML = modalContent;
  document.body.appendChild(modal);
  return modal;
}

// KPIs principais
export function updateKPIs(allCountries) {
  const activePlayers = allCountries.filter(c => c.Player);
  const pibs = activePlayers.map(c => parseFloat(String(c.PIB).replace(/[$.]+/g, '').replace(',', '.')) || 0);
  const stabilities = activePlayers.map(c => parseFloat(String(c.Estabilidade).replace(/%/g, '')) || 0);
  const avgPib = pibs.length > 0 ? pibs.reduce((sum, p) => sum + p, 0) / pibs.length : 0;
  const avgStability = stabilities.length > 0 ? stabilities.reduce((sum, s) => sum + s, 0) / stabilities.length : 0;
  const publicCountries = allCountries.filter(c => {
    const v = (c.Visibilidade || '').toString().trim().toLowerCase();
    return v === 'público' || v === 'publico' || v === 'public';
  }).length;
  if (DOM.totalPlayers) animateCounter('total-players', activePlayers.length);
  if (DOM.pibMedio) DOM.pibMedio.textContent = formatCurrency(avgPib);
  if (DOM.estabilidadeMedia) DOM.estabilidadeMedia.textContent = `${Math.round(avgStability)}/100`;
  if (DOM.paisesPublicos) animateCounter('paises-publicos', publicCountries);
}

// Painel do jogador redesenhado
export function fillPlayerPanel(playerData, currentTurn) {
  if (playerData && DOM.playerPanel) {
    // Atualizar nome do país
    if (DOM.playerCountryName) DOM.playerCountryName.textContent = playerData.Pais || 'País do Jogador';
    
    // Atualizar bandeira do país
    const flagContainer = document.getElementById('player-flag-container');
    if (flagContainer) {
      flagContainer.innerHTML = getFlagHTML(playerData.Pais, 'h-full w-full');
    }
    
    // Atualizar turno atual
    if (DOM.playerCurrentTurn) DOM.playerCurrentTurn.textContent = `#${currentTurn}`;
    
    // Calcular PIB per capita
    const pibPerCapita = (parseFloat(playerData.PIB) || 0) / (parseFloat(playerData.Populacao) || 1);
    const pibPerCapitaElement = document.getElementById('player-pib-per-capita');
    if (pibPerCapitaElement) {
      pibPerCapitaElement.textContent = formatCurrency(pibPerCapita);
    }
    
    // Atualizar PIB com formatação responsiva
    if (DOM.playerPib) {
      const pibValue = playerData.PIB || 0;
      const formattedPib = formatCurrencyCompact(pibValue);
      DOM.playerPib.textContent = formattedPib;
    }
    
    // Atualizar estabilidade
    const estabilidade = Number(playerData.Estabilidade) || 0;
    if (DOM.playerEstabilidade) DOM.playerEstabilidade.textContent = `${estabilidade}/100`;
    
    // Atualizar barra de estabilidade
    const estabilidadeBar = document.getElementById('player-estabilidade-bar');
    if (estabilidadeBar) {
      estabilidadeBar.style.width = `${Math.max(0, Math.min(100, estabilidade))}%`;
      // Mudar cor baseado no valor
      if (estabilidade >= 75) {
        estabilidadeBar.className = 'h-1.5 rounded-full bg-emerald-400';
      } else if (estabilidade >= 50) {
        estabilidadeBar.className = 'h-1.5 rounded-full bg-cyan-400';
      } else if (estabilidade >= 25) {
        estabilidadeBar.className = 'h-1.5 rounded-full bg-yellow-400';
      } else {
        estabilidadeBar.className = 'h-1.5 rounded-full bg-red-400';
      }
    }
    
    // Atualizar combustível
    if (DOM.playerCombustivel) DOM.playerCombustivel.textContent = playerData.Combustivel || '50';
    
    // Atualizar deltas (se não houver histórico)
    if (DOM.playerPibDelta) DOM.playerPibDelta.textContent = 'Sem histórico';
    if (DOM.playerEstabilidadeDelta) DOM.playerEstabilidadeDelta.textContent = 'Sem histórico';
    
    // Atualizar histórico
    if (DOM.playerHistorico) {
      DOM.playerHistorico.innerHTML = `
        <div class="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3 mb-2">
          <div class="font-medium">Turno #${currentTurn} (atual)</div>
          <div class="text-xs text-slate-400">PIB: ${formatCurrency(playerData.PIB)} · Estab: ${estabilidade}/100 · Pop: ${Number(playerData.Populacao || 0).toLocaleString('pt-BR')}</div>
        </div>`;
    }
    
    // Verificar se precisa mostrar notificações
    const isTurnLate = playerData.TurnoUltimaAtualizacao < currentTurn;
    if (DOM.playerNotifications) {
      isTurnLate ? DOM.playerNotifications.classList.remove('hidden') : DOM.playerNotifications.classList.add('hidden');
    }
    
    DOM.playerPanel.style.display = 'block';
  } else {
    // Estado de carregamento/erro
    if (DOM.playerCountryName) DOM.playerCountryName.textContent = 'Carregando...';
    if (DOM.playerHistorico) {
      DOM.playerHistorico.innerHTML = '<div class="text-sm text-slate-400 italic">Nenhum histórico disponível</div>';
    }
    if (DOM.playerPanel) DOM.playerPanel.style.display = 'none';
  }
}
