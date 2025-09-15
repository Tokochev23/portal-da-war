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
  if (!num || isNaN(num)) return '0';
  const n = parseFloat(num);
  if (n >= 1000000000) return (n/1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(0) + 'K';
  return Math.round(n).toLocaleString('pt-BR');
}

function formatCurrency(num) {
  if (!num) return 'US$ 0';
  const n = parseFloat(num);
  if (n >= 1000000000) return 'US$ ' + (n/1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return 'US$ ' + (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return 'US$ ' + (n/1000).toFixed(1) + 'K';
  return 'US$ ' + n.toLocaleString();
}

function formatCurrencyBR(v){
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v||0);
}

function formatCurrencyMBT(valor) {
  const num = parseFloat(valor) || 0;
  if (num === 0) return 'US$ 0';
  if (num >= 1000000000) return 'US$ ' + (num/1000000000).toFixed(1) + 'B';
  if (num >= 1000000) return 'US$ ' + (num/1000000).toFixed(1) + 'M';
  if (num >= 1000) return 'US$ ' + (num/1000).toFixed(1) + 'K';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
}

function calculateWPI(country) {
  const industryFactor = parseFloat(country.WarPower) || 0;
  return Math.round(industryFactor);
}

function calculateBudget(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const burocracia = parseFloat(country.Burocracia) || 0;
  const estabilidade = parseFloat(country.Estabilidade) || 0;
  return pibBruto * 0.25 * burocracia * (estabilidade * 1.5); // Novo cálculo de orçamento
}

function calculateMilitaryBudget(country) {
  const generalBudget = calculateBudget(country); // Get the general budget
  const percentualMilitar = (parseFloat(country.MilitaryBudgetPercent) || 30) / 100; // Default to 30%
  return generalBudget * percentualMilitar; // ORÇAMENTO MILITAR ESPECÍFICO
}

function getMilitaryDistribution(country) {
  return {
    vehicles: (parseFloat(country.MilitaryDistributionVehicles) || 30) / 100,
    aircraft: (parseFloat(country.MilitaryDistributionAircraft) || 25) / 100,
    naval: (parseFloat(country.MilitaryDistributionNaval) || 20) / 100,
    other: (parseFloat(country.MilitaryDistributionOther) || 25) / 100 // Pessoal, manutenção, etc.
  };
}

function calculateMilitaryBudgetConsequences(country) {
  const militaryPercent = parseFloat(country.MilitaryBudgetPercent) || 30; // Default to 30%
  const basePercent = 30; // New base percent
  const excessPercent = militaryPercent - basePercent;

  let stabilityPenalty = 0;
  let economicPenalty = 0;

  if (excessPercent > 0) {
    // Penalidade de estabilidade: -1% para cada 2% extra de orçamento militar
    stabilityPenalty = Math.floor(excessPercent / 2) * -1;

    // Penalidade econômica: redução do crescimento do PIB
    economicPenalty = excessPercent * -0.5; // -0.5% de crescimento para cada 1% extra
  }

  return {
    stabilityPenalty,
    economicPenalty,
    isOverBudget: excessPercent > 0
  };
}

function calculateVehicleProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);

  // Fatores tecnológicos e industriais
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const eficienciaIndustrial = (parseFloat(country.IndustrialEfficiency) || 30) / 100;
  const tecnologiaVeiculos = (parseFloat(country.Veiculos) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;

  return orcamentoMilitar * distribution.vehicles * tecnologiaCivil * eficienciaIndustrial * tecnologiaVeiculos * urbanizacao;
}

function calculateAircraftProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);

  // Fatores tecnológicos e industriais
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const eficienciaIndustrial = (parseFloat(country.IndustrialEfficiency) || 30) / 100;
  const tecnologiaAeronautica = (parseFloat(country.Aeronautica) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;

  return orcamentoMilitar * distribution.aircraft * tecnologiaCivil * eficienciaIndustrial * tecnologiaAeronautica * urbanizacao;
}

function calculateShipProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);

  // Fatores tecnológicos e industriais
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const eficienciaIndustrial = (parseFloat(country.IndustrialEfficiency) || 30) / 100;
  const tecnologiaNaval = (parseFloat(country.Marinha) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;

  return orcamentoMilitar * distribution.naval * tecnologiaCivil * eficienciaIndustrial * tecnologiaNaval * urbanizacao;
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
  const warPower = calculateWPI(country);
  const pibPerCapita = (parseFloat(country.PIB) || 0) / (parseFloat(country.Populacao) || 1);
  const budget = calculateBudget(country); // ORÇAMENTO GERAL DO PAÍS
  const militaryBudget = calculateMilitaryBudget(country); // ORÇAMENTO MILITAR
  const vehicleProductionCapacity = calculateVehicleProductionCapacity(country);
  const aircraftProductionCapacity = calculateAircraftProductionCapacity(country);
  const shipProductionCapacity = calculateShipProductionCapacity(country);
  const militaryConsequences = calculateMilitaryBudgetConsequences(country);
  const distribution = getMilitaryDistribution(country);

  // Bandeira com fallback melhorado
  const getBandeiraURL = () => {
    const countryKey = (country.Pais || '').toLowerCase().trim();
    const historicalFlags = {
      'urss': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_Soviet_Union_(1936_%E2%80%93_1955).svg.png?alt=media',
      'estados unidos': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_United_States_(1912-1959).svg.png?alt=media',
      'reino unido': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_United_Kingdom_(1801%E2%80%931922).svg.png?alt=media',
      'frança': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_France.svg.png?alt=media',
      'alemanha': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_West_Germany.svg.png?alt=media',
      'china': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_the_People%27s_Republic_of_China.svg.png?alt=media',
      'japão': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_Japan.svg.png?alt=media',
      'brasil': 'https://firebasestorage.googleapis.com/v0/b/war-1954-1799c.firebasestorage.app/o/images%2Fbandeiras%2FFlag_of_Brazil.svg.png?alt=media'
    };
    return historicalFlags[countryKey] || country.FlagURL || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='40' viewBox='0 0 60 40'%3E%3Crect width='60' height='40' fill='%23374151'/%3E%3Ctext x='30' y='24' text-anchor='middle' fill='%23e5e7eb' font-size='8'%3E${(country.Pais || 'Flag').slice(0, 4)}%3C/text%3E%3C/svg%3E`;
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
                <div class="text-2xl font-bold text-red-400">${formatNumber(warPower)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">PIB per capita</div>
                <div class="text-lg font-semibold text-emerald-400">${formatCurrency(pibPerCapita)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">Estabilidade</div>
                <div class="text-lg font-semibold text-slate-200">${Math.round(country.Estabilidade || 0)}%</div>
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
                    <div class="text-xl font-bold text-emerald-400">${formatCurrency(budget)}</div>
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
                  Efeito Estabilidade: <span class="${consumerGoodsData.metadata.stabilityEffect > 0 ? 'text-green-400' : consumerGoodsData.metadata.stabilityEffect < 0 ? 'text-red-400' : 'text-slate-400'}">${consumerGoodsData.metadata.stabilityEffect > 0 ? '+' : ''}${consumerGoodsData.metadata.stabilityEffect}%</span>
                </div>
              </div>

              <!-- Military Budget Control -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🏛️ Controle do Orçamento Militar</h3>

                <!-- Total Military Budget Control -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-slate-400">Percentual do PIB para Defesa</span>
                    <span class="text-lg font-bold text-emerald-400">${formatCurrency(militaryBudget)}</span>
                  </div>

                  <div class="mb-3">
                    <label class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-300">Orçamento Militar: <span id="budget-display">${parseFloat(country.MilitaryBudgetPercent) || 30}</span>%</span></span>
                      <button onclick="saveMilitaryBudget()" class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors">Salvar</button>
                    </label>
                    <input
                      type="range"
                      id="military-budget-slider"
                      min="20"
                      max="50"
                      step="1"
                      value="${parseFloat(country.MilitaryBudgetPercent) || 30}"
                      class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      oninput="updateBudgetDisplay(this.value)"
                    >
                    <div class="flex justify-between text-xs text-slate-500 mt-1">
                      <span>20% (Mínimo)</span>
                      <span>50% (Máximo)</span>
                    </div>
                  </div>

                  ${militaryConsequences.isOverBudget ? `
                    <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                      <div class="text-xs text-red-400">
                        ⚠️ <strong>Gastos militares excessivos!</strong><br>
                        Penalidade de estabilidade: ${militaryConsequences.stabilityPenalty}%<br>
                        Impacto econômico: ${militaryConsequences.economicPenalty}% no crescimento
                      </div>
                    </div>
                  ` : ''}
                </div>

                <!-- Military Distribution Control -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-slate-300">Distribuição do Orçamento Militar</h4>
                    <button onclick="saveMilitaryDistribution()" class="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors">Salvar Distribuição</button>
                  </div>

                  <!-- Vehicles -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">🚗</span>
                        <span class="text-sm font-medium text-slate-200">Veículos Terrestres</span>
                      </div>
                      <span class="text-sm font-bold text-blue-400"><span id="vehicles-display">${Math.round(distribution.vehicles * 100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="vehicles-slider"
                      min="10"
                      max="60"
                      step="5"
                      value="${Math.round(distribution.vehicles * 100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay()"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="vehicles-amount">${formatCurrency(militaryBudget * distribution.vehicles)}</span></div>
                  </div>

                  <!-- Aircraft -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">✈️</span>
                        <span class="text-sm font-medium text-slate-200">Força Aérea</span>
                      </div>
                      <span class="text-sm font-bold text-cyan-400"><span id="aircraft-display">${Math.round(distribution.aircraft * 100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="aircraft-slider"
                      min="10"
                      max="50"
                      step="5"
                      value="${Math.round(distribution.aircraft * 100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay()"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="aircraft-amount">${formatCurrency(militaryBudget * distribution.aircraft)}</span></div>
                  </div>

                  <!-- Naval -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">🚢</span>
                        <span class="text-sm font-medium text-slate-200">Marinha de Guerra</span>
                      </div>
                      <span class="text-sm font-bold text-purple-400"><span id="naval-display">${Math.round(distribution.naval * 100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="naval-slider"
                      min="10"
                      max="40"
                      step="5"
                      value="${Math.round(distribution.naval * 100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay()"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="naval-amount">${formatCurrency(militaryBudget * distribution.naval)}</span></div>
                  </div>

                  <!-- Auto-calculated Others -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">👥</span>
                        <span class="text-sm font-medium text-slate-200">Outros (Automático)</span>
                      </div>
                      <span class="text-sm font-bold text-slate-400"><span id="others-display">${Math.round(distribution.other * 100)}</span>%</span>
                    </div>
                    <div class="text-xs text-slate-500">Pessoal, manutenção, logística, treinamento</div>
                    <div class="text-xs text-slate-400 mt-1">Investimento: <span id="others-amount">${formatCurrency(militaryBudget * distribution.other)}</span></div>
                  </div>

                  <div class="text-xs text-slate-500 bg-slate-800/20 rounded p-2">
                    💡 <strong>Dica:</strong> Ajuste a distribuição conforme sua estratégia militar. Mais investimento em uma área = maior capacidade de produção nessa área.
                  </div>
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

              <!-- Production Capacities -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🏭 Capacidades de Produção</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🚗</span>
                      <span class="text-sm text-slate-300">Veículos Terrestres</span>
                    </div>
                    <span class="text-sm font-semibold text-blue-400">${formatNumber(vehicleProductionCapacity)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">✈️</span>
                      <span class="text-sm text-slate-300">Aeronaves</span>
                    </div>
                    <span class="text-sm font-semibold text-cyan-400">${formatNumber(aircraftProductionCapacity)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🚢</span>
                      <span class="text-sm text-slate-300">Embarcações</span>
                    </div>
                    <span class="text-sm font-semibold text-purple-400">${formatNumber(shipProductionCapacity)}/turno</span>
                  </div>
                </div>
                <div class="mt-4 p-3 bg-slate-800/20 rounded-lg">
                  <div class="text-xs text-slate-400">
                    💡 <strong>Capacidade de Produção Militar:</strong><br>
                    • Orçamento Total: ${formatCurrency(militaryBudget)} (${parseFloat(country.MilitaryBudgetPercent) || 12}% do PIB)<br>
                    • Distribuição: Veículos ${Math.round(distribution.vehicles * 100)}%, Aeronaves ${Math.round(distribution.aircraft * 100)}%, Navios ${Math.round(distribution.naval * 100)}%<br>
                    • Multiplicadores: Tec. Civil ${Math.round(country.Tecnologia || 0)}%, Ef. Industrial ${Math.round(country.IndustrialEfficiency || 0)}%, Urbanização ${Math.round(country.Urbanizacao || 0)}%
                  </div>
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

              <!-- Ferramentas de Design -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span class="text-xl">🛠️</span>
                  Ferramentas de Design
                </h3>
                <p class="text-sm text-slate-400 mb-6">Crie veículos, aeronaves e navios customizados para seu exército</p>

                <div class="space-y-4">
                  <a href="criador-veiculos-refatorado.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">🚗</span>
                        <div>
                          <div class="font-medium text-slate-200">Criador de Veículos</div>
                          <div class="text-xs text-slate-400">Tanques principais, veículos blindados, SPGs e caça-tanques personalizados</div>
                          <div class="text-xs text-blue-400 mt-1">Tecnologia disponível: ${Math.round(country.Veiculos || 0)}%</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">US$ ${formatCurrencyMBT(vehicleProductionCapacity)}/turno</div>
                      </div>
                    </div>
                  </a>

                  <a href="criador-aeronaves.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">✈️</span>
                        <div>
                          <div class="font-medium text-slate-200">Criador de Aeronaves</div>
                          <div class="text-xs text-slate-400">Caças, bombardeiros e aeronaves de apoio próximo (em desenvolvimento)</div>
                          <div class="text-xs text-cyan-400 mt-1">Tecnologia disponível: ${Math.round(country.Aeronautica || 0)}%</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">US$ ${formatCurrencyMBT(aircraftProductionCapacity)}/turno</div>
                      </div>
                    </div>
                  </a>

                  <a href="criador-navios.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">🚢</span>
                        <div>
                          <div class="font-medium text-slate-200">Criador de Navios</div>
                          <div class="text-xs text-slate-400">Destroyers, cruzadores e navios de transporte personalizados (em desenvolvimento)</div>
                          <div class="text-xs text-purple-400 mt-1">Tecnologia disponível: ${Math.round(country.Naval || 0)}%</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">US$ ${formatCurrencyMBT(shipProductionCapacity)}/turno</div>
                      </div>
                    </div>
                  </a>
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
              const potential = country[`Potencial${resource}`] || (resource === 'Energia' ? 'N/A' : '3');
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

      document.getElementById(`tab-${tabId}`)?.classList.remove('hidden');
    }
  });
}

async function initDashboard() {
  try {
    // Aguardar autenticação e obter usuário
    await new Promise((resolve) => {
      auth.onAuthStateChanged(resolve);
    });

    const user = auth.currentUser;
    if (!user) {
      document.getElementById('dashboard-content').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa estar logado.</p>
          </div>
        </div>
      `;
      return;
    }

    // Obter país do usuário
    const paisId = await checkPlayerCountry(user.uid);
    const allCountries = await getAllCountries();
    const country = paisId ? allCountries.find(c => c.id === paisId) : null;

    if (!country) {
      document.getElementById('dashboard-content').innerHTML = `
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa ter um país atribuído.</p>
          </div>
        </div>
      `;
      return;
    }

    // Salvar país globalmente para as funções de controle
    window.currentCountry = country;

    document.getElementById('dashboard-content').innerHTML = renderDashboard(country);
    setupDashboardTabs();

  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    document.getElementById('dashboard-content').innerHTML = `
      <div class="min-h-screen flex items-center justify-center bg-slate-950">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p class="text-slate-400">Erro ao carregar dashboard: ${error.message}</p>
        </div>
      </div>
    `;
  }
}

// Funções para controlar orçamento militar
window.updateBudgetDisplay = function(value) {
  document.getElementById('budget-display').textContent = value;
};

window.updateDistributionDisplay = function() {
  const vehicles = parseInt(document.getElementById('vehicles-slider').value);
  const aircraft = parseInt(document.getElementById('aircraft-slider').value);
  const naval = parseInt(document.getElementById('naval-slider').value);
  const others = Math.max(0, 100 - vehicles - aircraft - naval);

  // Atualizar displays
  document.getElementById('vehicles-display').textContent = vehicles;
  document.getElementById('aircraft-display').textContent = aircraft;
  document.getElementById('naval-display').textContent = naval;
  document.getElementById('others-display').textContent = others;

  // Calcular orçamento atual
  const budgetSlider = document.getElementById('military-budget-slider');
  const budgetPercent = parseFloat(budgetSlider.value) / 100;
  const pib = parseFloat(window.currentCountry?.PIB || 0);
  const budget = pib * budgetPercent;

  // Atualizar valores em dólar
  document.getElementById('vehicles-amount').textContent = formatCurrency(budget * vehicles / 100);
  document.getElementById('aircraft-amount').textContent = formatCurrency(budget * aircraft / 100);
  document.getElementById('naval-amount').textContent = formatCurrency(budget * naval / 100);
  document.getElementById('others-amount').textContent = formatCurrency(budget * others / 100);
};

window.saveMilitaryBudget = async function() {
  try {
    const budgetPercent = parseFloat(document.getElementById('military-budget-slider').value);
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Importar Firebase functions
    const { updateDoc, doc } = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js');
    const { db } = await import('../services/firebase.js');

    await updateDoc(doc(db, 'countries', paisId), {
      MilitaryBudgetPercent: budgetPercent
    });

    // Feedback visual
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Salvo!';
    button.classList.add('bg-green-600');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-600');
    }, 2000);

    // Recarregar dashboard
    setTimeout(() => window.location.reload(), 1000);
  } catch (error) {
    console.error('Erro ao salvar orçamento militar:', error);
    alert('Erro ao salvar orçamento militar. Tente novamente.');
  }
};

window.saveMilitaryDistribution = async function() {
  try {
    const vehicles = parseInt(document.getElementById('vehicles-slider').value);
    const aircraft = parseInt(document.getElementById('aircraft-slider').value);
    const naval = parseInt(document.getElementById('naval-slider').value);
    const others = Math.max(0, 100 - vehicles - aircraft - naval);

    // Validar se soma não passa de 100%
    if (vehicles + aircraft + naval > 100) {
      alert('A soma das distribuições não pode passar de 100%!');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Importar Firebase functions
    const { updateDoc, doc } = await import('https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js');
    const { db } = await import('../services/firebase.js');

    await updateDoc(doc(db, 'countries', paisId), {
      MilitaryDistributionVehicles: vehicles,
      MilitaryDistributionAircraft: aircraft,
      MilitaryDistributionNaval: naval,
      MilitaryDistributionOther: others
    });

    // Feedback visual
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✓ Salvo!';
    button.classList.add('bg-green-600');
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('bg-green-600');
    }, 2000);

    // Recarregar dashboard
    setTimeout(() => window.location.reload(), 1000);
  } catch (error) {
    console.error('Erro ao salvar distribuição militar:', error);
    alert('Erro ao salvar distribuição militar. Tente novamente.');
  }
};

export { initDashboard };