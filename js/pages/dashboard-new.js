import { auth, checkPlayerCountry, getAllCountries } from "../services/firebase.js";
import { formatCurrencyCompact } from "../utils.js";
import { InventorySystem } from "../components/inventorySystem.js";
import EconomicCalculations from '../systems/economicCalculations.js';
import ConsumerGoodsCalculator from '../systems/consumerGoodsCalculator.js';
import ResourceConsumptionCalculator from '../systems/resourceConsumptionCalculator.js';
import ResourceProductionCalculator from '../systems/resourceProductionCalculator.js';

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function getStabilityInfo(stability) {
  if (stability <= 20) return { label: "Anarquia", tone: "bg-rose-500/15 text-rose-300 border-rose-400/30" };
  if (stability <= 49) return { label: "Instável", tone: "bg-amber-500/15 text-amber-300 border-amber-400/30" };
  if (stability <= 74) return { label: "Neutro", tone: "bg-sky-500/15 text-sky-300 border-sky-400/30" };
  return { label: "Tranquilo", tone: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30" };
}

function formatNumber(num) {
  if (!num) return '0';
  const n = parseFloat(num);
  if (n >= 1000000000) return (n/1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function formatCurrency(num) {
  if (!num) return 'US$ 0';
  const n = parseFloat(num);
  if (n >= 1000000000) return 'US$ ' + (n/1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return 'US$ ' + (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return 'US$ ' + (n/1000).toFixed(1) + 'K';
  return 'US$ ' + n.toLocaleString();
}

function renderDashboard(country) {
  // Cálculos essenciais
  const energyEstimate = EconomicCalculations.computeEnergyDemandGW(country);
  const consumerGoodsData = ConsumerGoodsCalculator.calculateConsumerGoods(country);
  const resourceConsumption = ResourceConsumptionCalculator.calculateCountryConsumption(country);
  const resourceProduction = ResourceProductionCalculator.calculateCountryProduction(country);

  // Calcular saldos de recursos (produção - consumo)
  const resourceBalances = {
    Carvao: Math.round((resourceProduction.Carvao || 0) - (resourceConsumption.Carvao || 0)),
    Combustivel: Math.round((resourceProduction.Combustivel || 0) - (resourceConsumption.Combustivel || 0)),
    Metais: Math.round((resourceProduction.Metais || 0) - (resourceConsumption.Metais || 0)),
    Graos: Math.round((resourceProduction.Graos || 0) - (resourceConsumption.Graos || 0)),
    Energia: Math.round((resourceProduction.Energia || 0) - (resourceConsumption.Energia || 0))
  };

  const stability = getStabilityInfo(parseFloat(country.Estabilidade) || 0);
  const warPower = parseFloat(country.WarPower) || 0;
  const pibPerCapita = (parseFloat(country.PIB) || 0) / (parseFloat(country.Populacao) || 1);

  // Bandeira
  const getBandeiraURL = () => {
    const countryKey = (country.Pais || '').toLowerCase();
    const historicalFlags = {
      'urss': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_Soviet_Union_(1936_%E2%80%93_1955).svg.png',
      'estados unidos': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_United_States_(1912-1959).svg.png',
      'reino unido': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_United_Kingdom_(1801%E2%80%931922).svg.png',
      'frança': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_France.svg.png',
      'alemanha': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_West_Germany.svg.png',
      'china': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_People%27s_Republic_of_China.svg.png',
      'japão': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_Japan.svg.png',
      'brasil': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_Brazil.svg.png'
    };
    return historicalFlags[countryKey] || country.FlagURL || 'https://via.placeholder.com/300x200/1e293b/64748b?text=Flag';
  };

  return `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <!-- Header -->
      <div class="border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 rounded border border-slate-600 overflow-hidden">
                <img src="${getBandeiraURL()}" alt="${country.Pais}" class="w-full h-full object-cover">
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-100">${country.Pais}</h1>
                <p class="text-sm text-slate-400">${country.ModeloPolitico || 'Sistema Político'}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">War Power</div>
                <div class="text-2xl font-bold text-red-400">${Math.round(warPower)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">PIB per capita</div>
                <div class="text-lg font-semibold text-emerald-400">${formatCurrency(pibPerCapita)}</div>
              </div>
              <div class="px-3 py-1 rounded-lg border ${stability.tone}">
                <span class="text-sm font-medium">${stability.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="max-w-7xl mx-auto px-6">
        <div class="border-b border-slate-800/50">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button class="dashboard-tab active border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-400" data-tab="overview">
              📊 Visão Geral
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="resources">
              ⛏️ Recursos
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="vehicles">
              🚗 Veículos
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="aircraft">
              ✈️ Aeronáutica
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="naval">
              🚢 Marinha
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="market">
              🌍 Mercado Internacional
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Contents -->
      <div class="max-w-7xl mx-auto px-6 py-6">

        <!-- Overview Tab -->
        <div id="tab-overview" class="dashboard-tab-content">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Economic Overview -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">💰 Economia</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">PIB Total</div>
                    <div class="text-xl font-bold text-slate-100">${formatCurrency(country.PIB)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Orçamento</div>
                    <div class="text-xl font-bold text-emerald-400">${formatCurrency(parseFloat(country.PIB) * 0.12)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">População</div>
                    <div class="text-xl font-bold text-slate-100">${formatNumber(country.Populacao)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Tecnologia</div>
                    <div class="text-xl font-bold text-blue-400">${Math.round(country.Tecnologia || 0)}%</div>
                  </div>
                </div>
              </div>

              <!-- Consumer Goods -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🛍️ Bens de Consumo</h3>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-slate-400">Satisfação da População</span>
                  <span class="text-sm font-semibold text-slate-200">${consumerGoodsData.level}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-3 mb-3">
                  <div class="h-3 rounded-full transition-all duration-300 ${
                    consumerGoodsData.level >= 70 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                    consumerGoodsData.level >= 50 ? 'bg-gradient-to-r from-yellow-500 to-amber-400' :
                    'bg-gradient-to-r from-red-500 to-rose-400'
                  }" style="width: ${Math.min(consumerGoodsData.level, 100)}%"></div>
                </div>
                <div class="text-xs text-slate-500">
                  Produção: ${formatNumber(consumerGoodsData.production)} •
                  Demanda: ${formatNumber(consumerGoodsData.demand)} •
                  Efeito Estabilidade: ${consumerGoodsData.metadata.stabilityEffect > 0 ? '+' : ''}${consumerGoodsData.metadata.stabilityEffect}%
                </div>
              </div>

              <!-- Resource Summary -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">📈 Balanço de Recursos</h3>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                  ${Object.entries(resourceBalances).map(([resource, balance]) => {
                    const icons = { Carvao: '🪨', Combustivel: '⛽', Metais: '🔩', Graos: '🌾', Energia: '⚡' };
                    const names = { Carvao: 'Carvão', Combustivel: 'Combustível', Metais: 'Metais', Graos: 'Grãos', Energia: 'Energia' };
                    const unit = resource === 'Energia' ? 'MW' : '';
                    return `
                      <div class="text-center">
                        <div class="text-lg mb-1">${icons[resource]}</div>
                        <div class="text-xs text-slate-400 mb-1">${names[resource]}</div>
                        <div class="text-sm font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                          ${balance >= 0 ? '+' : ''}${formatNumber(balance)}${unit}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- Country Info Sidebar -->
            <div class="space-y-6">
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <div class="aspect-[3/2] rounded-lg overflow-hidden mb-4">
                  <img src="${getBandeiraURL()}" alt="${country.Pais}" class="w-full h-full object-cover">
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-400">Urbanização</span>
                    <span class="text-sm font-medium text-slate-200">${Math.round(country.Urbanizacao || 0)}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-400">Burocracia</span>
                    <span class="text-sm font-medium text-slate-200">${Math.round(country.Burocracia || 0)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-400">Eficiência Industrial</span>
                    <span class="text-sm font-medium text-slate-200">${Math.round(country.IndustrialEfficiency || 0)}%</span>
                  </div>
                </div>
              </div>

              <!-- Quick Actions -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">⚡ Ações Rápidas</h3>
                <div class="space-y-2">
                  <button class="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors">
                    📊 Simulador Econômico
                  </button>
                  <button class="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors">
                    🏭 Gerenciar Produção
                  </button>
                  <button class="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 rounded-lg transition-colors">
                    🔬 Pesquisa & Desenvolvimento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources Tab -->
        <div id="tab-resources" class="dashboard-tab-content hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            ${['Carvao', 'Combustivel', 'Metais', 'Graos', 'Energia'].map(resource => {
              const icons = { Carvao: '🪨', Combustivel: '⛽', Metais: '🔩', Graos: '🌾', Energia: '⚡' };
              const names = { Carvao: 'Carvão', Combustivel: 'Combustível', Metais: 'Metais', Graos: 'Grãos', Energia: 'Energia' };
              const potential = country[\`Potencial\${resource}\`] || (resource === 'Energia' ? 'N/A' : '3');
              const production = Math.round(resourceProduction[resource] || 0);
              const consumption = Math.round(resourceConsumption[resource] || 0);
              const balance = resourceBalances[resource];
              const unit = resource === 'Energia' ? 'MW' : 'unidades';

              return `
                <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">${icons[resource]}</span>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-200">${names[resource]}</h3>
                        ${resource !== 'Energia' ? `<p class="text-sm text-slate-400">Potencial: ${potential}/10</p>` : ''}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                        ${balance >= 0 ? '+' : ''}${formatNumber(balance)}
                      </div>
                      <div class="text-xs text-slate-400">${unit}/mês</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Produção</div>
                      <div class="text-lg font-semibold text-cyan-400">${formatNumber(production)} ${unit}</div>
                    </div>
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Consumo</div>
                      <div class="text-lg font-semibold text-amber-400">${formatNumber(consumption)} ${unit}</div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-400">Eficiência</span>
                      <span class="text-slate-200">${production > 0 ? Math.round((production / Math.max(consumption, 1)) * 100) : 0}%</span>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-2">
                      <div class="h-2 rounded-full ${balance >= 0 ? 'bg-emerald-500' : 'bg-red-500'}"
                           style="width: ${Math.min(Math.max((production / Math.max(consumption, 1)) * 100, 0), 100)}%"></div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Vehicles Tab -->
        <div id="tab-vehicles" class="dashboard-tab-content hidden">
          <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div class="text-6xl mb-4">🚗</div>
            <h3 class="text-xl font-semibold text-slate-200 mb-2">Sistema de Veículos</h3>
            <p class="text-slate-400 mb-4">Gerencie sua frota de veículos terrestres</p>
            <div class="text-sm text-slate-500">Em desenvolvimento...</div>
          </div>
        </div>

        <!-- Aircraft Tab -->
        <div id="tab-aircraft" class="dashboard-tab-content hidden">
          <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div class="text-6xl mb-4">✈️</div>
            <h3 class="text-xl font-semibold text-slate-200 mb-2">Sistema Aeronáutico</h3>
            <p class="text-slate-400 mb-4">Gerencie sua força aérea</p>
            <div class="text-sm text-slate-500">Em desenvolvimento...</div>
          </div>
        </div>

        <!-- Naval Tab -->
        <div id="tab-naval" class="dashboard-tab-content hidden">
          <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div class="text-6xl mb-4">🚢</div>
            <h3 class="text-xl font-semibold text-slate-200 mb-2">Sistema Naval</h3>
            <p class="text-slate-400 mb-4">Gerencie sua marinha de guerra</p>
            <div class="text-sm text-slate-500">Em desenvolvimento...</div>
          </div>
        </div>

        <!-- Market Tab -->
        <div id="tab-market" class="dashboard-tab-content hidden">
          <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div class="text-6xl mb-4">🌍</div>
            <h3 class="text-xl font-semibold text-slate-200 mb-2">Mercado Internacional</h3>
            <p class="text-slate-400 mb-4">Comércio global de recursos e tecnologia</p>
            <div class="text-sm text-slate-500">Em desenvolvimento...</div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function setupDashboardTabs() {
  document.addEventListener('click', (e) => {
    if (e.target.matches('.dashboard-tab')) {
      const tabId = e.target.dataset.tab;

      // Update tab buttons
      document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active', 'border-blue-500', 'text-blue-400');
        tab.classList.add('border-transparent', 'text-slate-400');
      });

      e.target.classList.add('active', 'border-blue-500', 'text-blue-400');
      e.target.classList.remove('border-transparent', 'text-slate-400');

      // Update tab content
      document.querySelectorAll('.dashboard-tab-content').forEach(content => {
        content.classList.add('hidden');
      });

      document.getElementById(\`tab-\${tabId}\`)?.classList.remove('hidden');
    }
  });
}

async function initDashboard() {
  try {
    const country = await checkPlayerCountry();
    if (!country) {
      document.getElementById('dashboard-container').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa estar logado e ter um país atribuído.</p>
          </div>
        </div>
      `;
      return;
    }

    document.getElementById('dashboard-container').innerHTML = renderDashboard(country);
    setupDashboardTabs();

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    document.getElementById('dashboard-container').innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-slate-950">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p class="text-slate-400">Erro ao carregar dashboard: \${error.message}</p>
        </div>
      </div>
    `;
  }
}

export { initDashboard };