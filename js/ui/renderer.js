import { formatCurrency, formatDelta, animateCounter } from "../utils.js";

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

// Bandeiras com segurança de encoding
function flagEmojiFromCode(cc) {
  if (!cc || cc.length !== 2) return '🏴';
  const code = cc.toUpperCase();
  const base = 127397; // regional indicator base
  return String.fromCodePoint(code.charCodeAt(0) + base, code.charCodeAt(1) + base);
}
function countryFlagEmoji(name) {
  const key = (name || '').toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
  const map = {
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
    'russia':'RU','urss':'RU','uniao sovietica':'RU',
    'singapura':'SG','singapore':'SG',
    'suecia':'SE','sweden':'SE',
    'suica':'CH','switzerland':'CH',
    'turquia':'TR','turkey':'TR',
    'ucrania':'UA','ukraine':'UA',
    'uruguai':'UY',
    'venezuela':'VE',
    'vietna':'VN','vietnam':'VN',
    'equador':'EC','paraguai':'PY','argelia':'DZ','algeria':'DZ',
    'australia':'AU'
  };
  const code = map[key];
  return code ? flagEmojiFromCode(code) : '🏴';
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
    const formattedPib = formatCurrency(country.PIB || 0);
    const formattedPopulation = Number(country.Populacao || 0).toLocaleString('pt-BR');
    const stabilityInfo = getStabilityInfo(parseFloat(country.Estabilidade) || 0);
    const wpi = calculateWPI(country);
    const bandeira = countryFlagEmoji(country.Pais);
    if (bandeira === '🏴') {
      NO_FLAG_COUNTRIES.add(String(country.Pais || '').trim());
    }

    const cardHtml = `
      <button class="country-card-button group relative w-full rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-left" data-country-id="${country.id}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-10 grid place-items-center rounded-md ring-1 ring-white/10 bg-slate-800 text-2xl">${bandeira}</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-100">${country.Pais}</div>
              <div class="text-[10px] text-slate-400">PIB pc ${formatCurrency(country.PIBPerCapita || ((parseFloat(country.PIB) || 0) / (parseFloat(country.Populacao) || 1)))}</div>
            </div>
          </div>
          <div class="shrink-0">
            <div class="grid place-items-center h-8 w-8 rounded-lg border border-white/10 bg-slate-900/70 text-[11px] font-bold text-slate-100">${wpi}</div>
            <div class="mt-0.5 text-[9px] text-center uppercase text-slate-500">WPI</div>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="text-slate-400">PIB</div>
            <div class="mt-0.5 font-medium text-slate-100">${formattedPib}</div>
          </div>
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="text-slate-400">Pop.</div>
            <div class="mt-0.5 font-medium text-slate-100">${formattedPopulation}</div>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between gap-2">
          <div class="truncate text-[11px] text-slate-300"><span class="text-slate-400">Tech:</span> ${country.Tecnologia}%</div>
          <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${stabilityInfo.tone}">${stabilityInfo.label}</span>
        </div>
      </button>`;

    DOM.countryListContainer.innerHTML += cardHtml;
  });

  // Converte emojis em imagens SVG para compatibilidade
  if (window.twemoji) {
    window.twemoji.parse(DOM.countryListContainer, { folder: 'svg', ext: '.svg' });
  }
}

// Painel detalhado (compacto)
export function renderDetailedCountryPanel(country) {
  if (!DOM.countryPanelContent || !DOM.countryPanelModal) return;
  const wpi = calculateWPI(country);
  const stabilityInfo = getStabilityInfo(parseFloat(country.Estabilidade) || 0);
  const html = `
    <div class="p-2">
      <h1 class="text-2xl font-bold">${countryFlagEmoji(country.Pais)} ${country.Pais}</h1>
      <div class="mt-2 text-sm text-slate-400">PIB per capita ${formatCurrency(country.PIBPerCapita || ((parseFloat(country.PIB) || 0) / (parseFloat(country.Populacao) || 1)))}</div>
      <div class="mt-3 text-sm">WPI: <span class="font-semibold">${wpi}</span></div>
      <div class="mt-1 text-xs ${stabilityInfo.tone} inline-flex items-center px-2 py-1 rounded">Estabilidade: ${stabilityInfo.label} (${country.Estabilidade}/100)</div>
    </div>`;
  DOM.countryPanelContent.innerHTML = html;
  if (window.twemoji) {
    window.twemoji.parse(DOM.countryPanelContent, { folder: 'svg', ext: '.svg' });
  }
  DOM.countryPanelModal.classList.remove('hidden');
}

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
          const bandeira = countryFlagEmoji(country.Pais);
          return `
            <div class="pais-option rounded-xl border border-bg-ring/70 p-3 cursor-pointer" data-pais-id="${country.id}" data-pais-nome="${country.Pais}">
              <div class="flex items-center gap-3">
                <div class="text-2xl">${bandeira}</div>
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

// Painel do jogador
export function fillPlayerPanel(playerData, currentTurn) {
  if (playerData && DOM.playerPanel) {
    if (DOM.playerCountryName) DOM.playerCountryName.textContent = playerData.Pais || 'País do Jogador';
    if (DOM.playerCurrentTurn) DOM.playerCurrentTurn.textContent = currentTurn;
    if (DOM.playerPib) DOM.playerPib.textContent = formatCurrency(playerData.PIB || 0);
    if (DOM.playerEstabilidade) DOM.playerEstabilidade.textContent = `${Number(playerData.Estabilidade) || 0}/100`;
    if (DOM.playerCombustivel) DOM.playerCombustivel.textContent = playerData.Combustivel || '50';
    if (DOM.playerPibDelta) DOM.playerPibDelta.innerHTML = '<span class="text-slate-400">Sem histórico</span>';
    if (DOM.playerEstabilidadeDelta) DOM.playerEstabilidadeDelta.innerHTML = '<span class="text-slate-400">Sem histórico</span>';
    if (DOM.playerHistorico) {
      DOM.playerHistorico.innerHTML = `
        <div class="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3 mb-2">
          <div class="font-medium">Turno ${currentTurn} (atual)</div>
          <div class="text-xs text-slate-400">PIB: ${formatCurrency(playerData.PIB)} · Estab: ${playerData.Estabilidade}/100 · Pop: ${Number(playerData.Populacao || 0).toLocaleString('pt-BR')}</div>
        </div>`;
    }
    const isTurnLate = playerData.TurnoUltimaAtualizacao < currentTurn;
    if (DOM.playerNotifications) {
      isTurnLate ? DOM.playerNotifications.classList.remove('hidden') : DOM.playerNotifications.classList.add('hidden');
    }
    DOM.playerPanel.style.display = 'block';
  } else {
    if (DOM.playerCountryName) DOM.playerCountryName.textContent = 'Carregando...';
    if (DOM.playerHistorico) DOM.playerHistorico.innerHTML = '<div class="text-sm text-slate-400 italic">Nenhum histórico disponível</div>';
    if (DOM.playerPanel) DOM.playerPanel.style.display = 'none';
  }
}
