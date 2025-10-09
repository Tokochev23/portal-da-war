import { auth, checkPlayerCountry, getAllCountries, db } from "../services/firebase.js";
import { formatCurrencyCompact } from "../utils.js";
import { InventorySystem } from "../components/inventorySystem.js";
import EconomicCalculations from '../systems/economicCalculations.js';
import ConsumerGoodsCalculator from '../systems/consumerGoodsCalculator.js';
import ResourceConsumptionCalculator from '../systems/resourceConsumptionCalculator.js';
import ResourceProductionCalculator from '../systems/resourceProductionCalculator.js';
import { ShipyardSystem } from '../systems/shipyardSystem.js';
import MarketplaceSystem from '../systems/marketplaceSystem.js';
import { OfferModalManager } from '../components/offerModalManager.js';
import { getFlagHTML } from '../ui/renderer.js';

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

function formatCurrencyBrazil(valor) {
  const num = parseFloat(valor) || 0;
  if (num === 0) return 'US$ 0';

  if (num >= 1000000000) {
    const bi = (num / 1000000000).toFixed(1);
    return `US$ ${bi}bi`;
  }
  if (num >= 1000000) {
    const mi = (num / 1000000).toFixed(1);
    return `US$ ${mi}mi`;
  }
  if (num >= 1000) {
    const mil = (num / 1000).toFixed(1);
    return `US$ ${mil}mil`;
  }

  return `US$ ${Math.round(num)}`;
}

function calculateWPI(country) {
  const industryFactor = parseFloat(country.WarPower) || 0;
  return Math.round(industryFactor);
}

function calculateBudget(country) {
  const pibBruto = parseFloat(country.PIB) || 0;
  const burocracia = (parseFloat(country.Burocracia) || 0) / 100; // Converter para decimal
  const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100; // Converter para decimal
  const orcamentoTotal = pibBruto * 0.25 * burocracia * (estabilidade * 1.5);

  // Descontar orçamento já gasto (agência + pesquisas + outros gastos)
  const orcamentoGasto = parseFloat(country.OrcamentoGasto || 0);
  const agencyBudget = parseFloat(country.AgencyBudgetSpent || 0);

  return Math.max(0, orcamentoTotal - orcamentoGasto - agencyBudget); // Nunca negativo
}

function calculateMilitaryBudget(country) {
  const generalBudget = calculateBudget(country); // Get the general budget
  const percentualMilitar = (parseFloat(country.MilitaryBudgetPercent) || 30) / 100; // Default to 30%
  return generalBudget * percentualMilitar; // ORÇAMENTO MILITAR ESPECÍFICO
}

function getMilitaryDistribution(country) {
  const vehicles = (parseFloat(country.MilitaryDistributionVehicles) || 40) / 100;
  const aircraft = (parseFloat(country.MilitaryDistributionAircraft) || 30) / 100;
  const naval = (parseFloat(country.MilitaryDistributionNaval) || 30) / 100;

  return {
    vehicles: vehicles,
    aircraft: aircraft,
    naval: naval,
    // Manutenção é descontada automaticamente do orçamento geral
    maintenancePercent: 0.15 // 15% para manutenção (não visível ao player)
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

  // Deduzir manutenção do orçamento total antes da distribuição
  const orcamentoDisponivel = orcamentoMilitar * (1 - distribution.maintenancePercent);

  // Fatores tecnológicos e industriais
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const eficienciaIndustrial = (parseFloat(country.IndustrialEfficiency) || 30) / 100;
  const tecnologiaVeiculos = (parseFloat(country.Veiculos) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;

  return orcamentoDisponivel * distribution.vehicles * tecnologiaCivil * eficienciaIndustrial * tecnologiaVeiculos * urbanizacao;
}

function calculateAircraftProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);

  // Deduzir manutenção do orçamento total antes da distribuição
  const orcamentoDisponivel = orcamentoMilitar * (1 - distribution.maintenancePercent);

  // Fatores tecnológicos e industriais
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const eficienciaIndustrial = (parseFloat(country.IndustrialEfficiency) || 30) / 100;
  const tecnologiaAeronautica = (parseFloat(country.Aeronautica) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;

  return orcamentoDisponivel * distribution.aircraft * tecnologiaCivil * eficienciaIndustrial * tecnologiaAeronautica * urbanizacao;
}

function calculateShipProductionCapacity(country) {
  const orcamentoMilitar = calculateMilitaryBudget(country);
  const distribution = getMilitaryDistribution(country);

  // Deduzir manutenção do orçamento total antes da distribuição
  const orcamentoDisponivel = orcamentoMilitar * (1 - distribution.maintenancePercent);

  // Fatores tecnológicos e industriais
  const tecnologiaCivil = (parseFloat(country.Tecnologia) || 0) / 100;
  const eficienciaIndustrial = (parseFloat(country.IndustrialEfficiency) || 30) / 100;
  const tecnologiaNaval = (parseFloat(country.Marinha) || 0) / 100;
  const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;

  return orcamentoDisponivel * distribution.naval * tecnologiaCivil * eficienciaIndustrial * tecnologiaNaval * urbanizacao;
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
  const distribution = getMilitaryDistribution(country);
  // Usar valores de investimento direto (sem deduzir manutenção)
  const vehicleProductionCapacity = militaryBudget * distribution.vehicles;
  const aircraftProductionCapacity = militaryBudget * distribution.aircraft;
  const shipProductionCapacity = militaryBudget * distribution.naval;
  const militaryConsequences = calculateMilitaryBudgetConsequences(country);

  return `
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <!-- Header -->
      <div class="border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 rounded border border-slate-600 overflow-hidden grid place-items-center bg-slate-800">
                ${getFlagHTML(country.Pais, 'w-full h-full')}
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
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="intelligence">
              🕵️ Inteligência
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
                    <div class="text-xl font-bold text-slate-100">${formatCurrencyBrazil(country.PIB)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Orçamento</div>
                    <div class="text-xl font-bold text-emerald-400">${formatCurrencyBrazil(budget)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">População</div>
                    <div class="text-xl font-bold text-slate-100">${formatNumber(country.Populacao)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Tecnologia</div>
                    <div class="text-xl font-bold text-blue-400">${Math.round(country.Tecnologia || 0)}</div>
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
                    <span class="text-lg font-bold text-emerald-400">${formatCurrencyBrazil(militaryBudget)}</span>
                  </div>

                  <div class="mb-3">
                    <label class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-300">Orçamento Militar: <span id="budget-display">${parseFloat(country.MilitaryBudgetPercent) || 30}</span>%</span></span>
                      <button onclick="saveMilitaryBudget(event)" class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors">Salvar</button>
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
                    <button onclick="saveMilitaryDistribution(event)" class="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors">Salvar Distribuição</button>
                  </div>

                  <!-- Total Display -->
                  <div class="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div class="text-xs text-slate-400 mb-1">Total Alocado</div>
                    <div class="text-lg font-bold" id="total-distribution-display">100%</div>
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
                      max="80"
                      step="5"
                      value="${Math.round(distribution.vehicles * 100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('vehicles')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="vehicles-amount">${formatCurrencyBrazil(militaryBudget * distribution.vehicles)}</span></div>
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
                      max="80"
                      step="5"
                      value="${Math.round(distribution.aircraft * 100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('aircraft')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="aircraft-amount">${formatCurrencyBrazil(militaryBudget * distribution.aircraft)}</span></div>
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
                      max="80"
                      step="5"
                      value="${Math.round(distribution.naval * 100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('naval')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="naval-amount">${formatCurrencyBrazil(militaryBudget * distribution.naval)}</span></div>
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
                    <span class="text-sm font-semibold text-blue-400">${formatCurrencyBrazil(vehicleProductionCapacity)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">✈️</span>
                      <span class="text-sm text-slate-300">Aeronaves</span>
                    </div>
                    <span class="text-sm font-semibold text-cyan-400">${formatCurrencyBrazil(aircraftProductionCapacity)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🚢</span>
                      <span class="text-sm text-slate-300">Embarcações</span>
                    </div>
                    <span class="text-sm font-semibold text-purple-400">${formatCurrencyBrazil(shipProductionCapacity)}/turno</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Country Info Sidebar -->
            <div class="space-y-6">
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <div class="aspect-[3/2] rounded-lg overflow-hidden mb-4 grid place-items-center bg-slate-800">
                  ${getFlagHTML(country.Pais, 'w-full h-full')}
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
                          <div class="text-xs text-blue-400 mt-1">Tecnologia disponível: ${Math.round(country.Veiculos || 0)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">${formatCurrencyBrazil(vehicleProductionCapacity)}/turno</div>
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
                          <div class="text-xs text-cyan-400 mt-1">Tecnologia disponível: ${Math.round(country.Aeronautica || 0)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">${formatCurrencyBrazil(aircraftProductionCapacity)}/turno</div>
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
                          <div class="text-xs text-purple-400 mt-1">Tecnologia disponível: ${Math.round(country.Marinha || 0)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">${formatCurrencyBrazil(shipProductionCapacity)}/turno</div>
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
          <div id="vehicles-inventory-container">
            <!-- Inventory will be loaded here -->
          </div>
        </div>

        <!-- Aircraft Tab -->
        <div id="tab-aircraft" class="dashboard-tab-content hidden">
          <div id="aircraft-inventory-container">
            <!-- Aircraft inventory will be loaded here -->
          </div>
        </div>

        <!-- Naval Tab -->
        <div id="tab-naval" class="dashboard-tab-content hidden">
          <div id="naval-content-container">
            <!-- Naval content will be loaded here -->
          </div>
        </div>

        <!-- Market Tab -->
        <div id="tab-market" class="dashboard-tab-content hidden">
          <div id="marketplace-container">
            <!-- Marketplace content will be loaded here -->
          </div>
        </div>

        <!-- Intelligence Tab -->
        <div id="tab-intelligence" class="dashboard-tab-content hidden">
          <div id="intelligence-dashboard-container">
            <div class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <p class="text-slate-400">Carregando agência de inteligência...</p>
            </div>
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

      // Load inventory when vehicles tab is selected
      if (tabId === 'vehicles') {
        loadVehicleInventory();
      }

      // Load aircraft inventory when aircraft tab is selected
      if (tabId === 'aircraft') {
        loadAircraftInventory();
      }

      // Load naval system when naval tab is selected
      if (tabId === 'naval') {
        loadNavalSystem();
      }

      // Load marketplace when market tab is selected
      if (tabId === 'market') {
        loadMarketplace();
      }

      // Load intelligence agency when intelligence tab is selected
      if (tabId === 'intelligence') {
        loadIntelligenceAgency();
      }
    }

    // Handle inventory category clicks
    if (e.target.matches('.inventory-category-card') || e.target.closest('.inventory-category-card')) {
      const card = e.target.closest('.inventory-category-card');
      const category = card.dataset.category;
      showInventoryDetails(category);
    }

    // Handle equipment detail clicks
    if (e.target.matches('.equipment-item') || e.target.closest('.equipment-item')) {
      const item = e.target.closest('.equipment-item');
      const equipmentName = item.dataset.equipment;
      const category = item.dataset.category;
      showEquipmentDetails(category, equipmentName);
    }
  });
}

async function loadVehicleInventory() {
  try {
    const container = document.getElementById('vehicles-inventory-container');
    if (!container) return;

    container.innerHTML = `
      <div class="flex items-center justify-center py-8">
        <div class="text-slate-400">🔄 Carregando inventário...</div>
      </div>
    `;

    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Get inventory from Firebase
    const inventoryDoc = await db.collection('inventory').doc(paisId).get();

    if (!inventoryDoc.exists) {
      container.innerHTML = `
        <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Vazio</h3>
          <p class="text-slate-400">Nenhum equipamento aprovado encontrado</p>
        </div>
      `;
      return;
    }

    const inventory = inventoryDoc.data();
    container.innerHTML = renderInventory(inventory);

  } catch (error) {
    console.error('Erro ao carregar inventário:', error);
    const container = document.getElementById('vehicles-inventory-container');
    if (container) {
      container.innerHTML = `
        <div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3>
          <p class="text-red-400">Erro ao carregar inventário: ${error.message}</p>
        </div>
      `;
    }
  }
}

async function loadAircraftInventory() {
  try {
    const container = document.getElementById('aircraft-inventory-container');
    if (!container) return;

    container.innerHTML = `
      <div class="flex items-center justify-center py-8">
        <div class="text-slate-400">🔄 Carregando inventário aeronáutico...</div>
      </div>
    `;

    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Get inventory from Firebase
    const inventoryDoc = await db.collection('inventory').doc(paisId).get();

    if (!inventoryDoc.exists) {
      container.innerHTML = `
        <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">✈️</div>
          <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Aeronáutico Vazio</h3>
          <p class="text-slate-400">Nenhuma aeronave encontrada</p>
        </div>
      `;
      return;
    }

    const inventory = inventoryDoc.data();
    container.innerHTML = renderAircraftInventory(inventory);

  } catch (error) {
    console.error('Erro ao carregar inventário aeronáutico:', error);
    const container = document.getElementById('aircraft-inventory-container');
    if (container) {
      container.innerHTML = `
        <div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3>
          <p class="text-red-400">Erro ao carregar inventário aeronáutico: ${error.message}</p>
        </div>
      `;
    }
  }
}

function renderAircraftInventory(inventory) {
  // Filtrar apenas categorias de aeronaves
  const aircraftCategories = ['Caca', 'CAS', 'Bomber', 'BomberAJato', 'BomberEstrategico', 'BomberEstrategicoAJato',
                               'AWAC', 'HeliTransporte', 'HeliAtaque', 'TransporteAereo', 'Carga'];

  const categories = Object.keys(inventory).filter(cat => aircraftCategories.includes(cat));

  if (categories.length === 0) {
    return `
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
        <div class="text-6xl mb-4">✈️</div>
        <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Aeronáutico Vazio</h3>
        <p class="text-slate-400">Nenhuma aeronave encontrada</p>
      </div>
    `;
  }

  const categoryIcons = {
    'Caca': '✈️',
    'CAS': '💣',
    'Bomber': '✈️',
    'BomberAJato': '✈️',
    'BomberEstrategico': '🛫',
    'BomberEstrategicoAJato': '🛫',
    'AWAC': '📡',
    'HeliTransporte': '🚁',
    'HeliAtaque': '🚁',
    'TransporteAereo': '✈️',
    'Carga': '✈️'
  };

  const categoryNames = {
    'Caca': 'Caças',
    'CAS': 'CAS',
    'Bomber': 'Bombardeiros',
    'BomberAJato': 'Bombardeiros a Jato',
    'BomberEstrategico': 'Bombardeiros Estratégicos',
    'BomberEstrategicoAJato': 'Bombardeiros Estratégicos a Jato',
    'AWAC': 'AWAC',
    'HeliTransporte': 'Helicópteros de Transporte',
    'HeliAtaque': 'Helicópteros de Ataque',
    'TransporteAereo': 'Transporte Aéreo',
    'Carga': 'Carga'
  };

  return `
    <div class="space-y-6">
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">✈️</span>
          Inventário Aeronáutico
        </h3>
        <p class="text-sm text-slate-400 mb-6">Clique em uma categoria para ver as aeronaves</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${categories.map(category => {
            const categoryData = inventory[category];
            const equipmentCount = Object.keys(categoryData).length;
            const totalQuantity = Object.values(categoryData).reduce((sum, item) => sum + (item.quantity || 0), 0);
            const totalMaintenanceCost = Object.values(categoryData).reduce((sum, item) => {
              const quantity = item.quantity || 0;
              const unitCost = item.cost || 0;
              const maintenanceCost = unitCost * 0.05; // 5% do custo unitário
              return sum + (maintenanceCost * quantity);
            }, 0);

            return `
              <div class="inventory-category-card bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg p-4 cursor-pointer transition-colors" data-category="${category}">
                <div class="text-center">
                  <div class="text-3xl mb-2">${categoryIcons[category] || '✈️'}</div>
                  <h4 class="font-semibold text-slate-200 mb-1">${categoryNames[category] || category}</h4>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>${equipmentCount} tipo${equipmentCount !== 1 ? 's' : ''}</div>
                    <div>${totalQuantity} unidade${totalQuantity !== 1 ? 's' : ''}</div>
                    <div class="text-red-400">🔧 ${formatCurrencyBrazil(totalMaintenanceCost)}/mês</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderInventory(inventory) {
  const categories = Object.keys(inventory);

  if (categories.length === 0) {
    return `
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Vazio</h3>
        <p class="text-slate-400">Nenhum equipamento aprovado encontrado</p>
      </div>
    `;
  }

  const categoryIcons = {
    'MBT': '🚗',
    'Light Tank': '🚙',
    'Heavy Tank': '🚛',
    'SPG': '🎯',
    'SPH': '💥',
    'SPAA': '🚀',
    'APC': '🚌',
    'IFV': '🚐',
    'Tank Destroyer': '🔫',
    'Engineering': '🔧',
    'Other': '📦'
  };

  return `
    <div class="space-y-6">
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">📦</span>
          Inventário de Equipamentos
        </h3>
        <p class="text-sm text-slate-400 mb-6">Clique em uma categoria para ver os equipamentos aprovados</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${categories.map(category => {
            const categoryData = inventory[category];
            const equipmentCount = Object.keys(categoryData).length;
            const totalQuantity = Object.values(categoryData).reduce((sum, item) => sum + (item.quantity || 0), 0);
            const totalMaintenanceCost = Object.values(categoryData).reduce((sum, item) => {
              const quantity = item.quantity || 0;
              const unitCost = item.cost || 0;
              const maintenanceCost = unitCost * 0.05; // 5% do custo unitário
              return sum + (maintenanceCost * quantity);
            }, 0);

            return `
              <div class="inventory-category-card bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg p-4 cursor-pointer transition-colors" data-category="${category}">
                <div class="text-center">
                  <div class="text-3xl mb-2">${categoryIcons[category] || '📦'}</div>
                  <h4 class="font-semibold text-slate-200 mb-1">${category}</h4>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>${equipmentCount} tipo${equipmentCount !== 1 ? 's' : ''}</div>
                    <div>${totalQuantity} unidade${totalQuantity !== 1 ? 's' : ''}</div>
                    <div class="text-red-400">🔧 ${formatCurrencyBrazil(totalMaintenanceCost)}/mês</div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

async function showInventoryDetails(category) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    const inventoryDoc = await db.collection('inventory').doc(paisId).get();
    if (!inventoryDoc.exists) return;

    const inventory = inventoryDoc.data();
    const categoryData = inventory[category];

    if (!categoryData) return;

    // Remove existing modal
    const existingModal = document.getElementById('inventory-details-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'inventory-details-modal';
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col';

    const equipmentList = Object.entries(categoryData);
    const totalQuantity = equipmentList.reduce((sum, [name, data]) => sum + (data.quantity || 0), 0);
    const totalMaintenanceCost = equipmentList.reduce((sum, [name, data]) => {
      const quantity = data.quantity || 0;
      const unitCost = data.cost || 0;
      const maintenanceCost = unitCost * 0.05; // 5% do custo unitário
      return sum + (maintenanceCost * quantity);
    }, 0);

    modalContent.innerHTML = `
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">📦 ${category}</h3>
          <p class="text-sm text-slate-400">${equipmentList.length} equipamentos • ${totalQuantity} unidades • ${formatCurrencyBrazil(totalMaintenanceCost)}/mês manutenção</p>
        </div>
        <button id="close-inventory-modal" class="text-slate-400 hover:text-slate-200 p-1">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${equipmentList.map(([equipmentName, data]) => {
            const quantity = data.quantity || 0;
            const unitCost = data.cost || 0;
            const maintenanceCost = unitCost * 0.05 * quantity; // 5% do custo unitário por mês
            const totalValue = unitCost * quantity;

            return `
              <div class="equipment-item bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 cursor-pointer transition-colors"
                   data-equipment="${equipmentName}" data-category="${category}">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-slate-200 mb-1">${equipmentName}</h4>
                    <div class="text-xs text-slate-400 space-y-1">
                      <div>📦 <strong>Quantidade:</strong> ${quantity} unidades</div>
                      <div>💰 <strong>Custo unitário:</strong> ${formatCurrencyBrazil(unitCost)}</div>
                      <div>💵 <strong>Valor total:</strong> ${formatCurrencyBrazil(totalValue)}</div>
                      <div class="text-red-400">🔧 <strong>Manutenção:</strong> ${formatCurrencyBrazil(maintenanceCost)}/mês</div>
                      ${data.approvedDate ? `<div>📅 <strong>Aprovado em:</strong> ${new Date(data.approvedDate).toLocaleDateString('pt-BR')}</div>` : ''}
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <button class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
                          onclick="showEquipmentDetails('${category}', '${equipmentName}')">
                    📋 Ver Ficha
                  </button>
                  <div class="text-xs text-slate-500">Clique para detalhes</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    modal.appendChild(modalContent);

    // Event listeners
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    modalContent.querySelector('#close-inventory-modal').addEventListener('click', () => {
      modal.remove();
    });

    // Keyboard support
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escapeHandler);
      }
    });

    document.body.appendChild(modal);

  } catch (error) {
    console.error('Erro ao carregar detalhes do inventário:', error);
  }
}

async function showEquipmentDetails(category, equipmentName) {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    const inventoryDoc = await db.collection('inventory').doc(paisId).get();
    if (!inventoryDoc.exists) return;

    const inventory = inventoryDoc.data();
    const equipment = inventory[category]?.[equipmentName];

    if (!equipment) return;

    // Remove existing modal
    const existingModal = document.getElementById('equipment-details-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const quantity = equipment.quantity || 0;
    const unitCost = equipment.cost || 0;
    const maintenanceCost = unitCost * 0.05 * quantity;
    const totalValue = unitCost * quantity;
    const specs = equipment.specs || {};

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'equipment-details-modal';
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col';

    modalContent.innerHTML = `
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">🚗 ${equipmentName}</h3>
          <p class="text-sm text-slate-400">${category} • ${quantity} unidades em serviço</p>
        </div>
        <div class="flex items-center gap-2">
          ${equipment.sheetImageUrl ? `
            <button id="view-equipment-sheet" class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors">
              📋 Ver Ficha
            </button>
          ` : ''}
          <button id="close-equipment-modal" class="text-slate-400 hover:text-slate-200 p-1">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Financial Summary -->
          <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
            <h4 class="font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <span>💰</span>
              Resumo Financeiro
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Custo unitário:</span>
                <span class="text-slate-200">${formatCurrencyBrazil(unitCost)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Quantidade:</span>
                <span class="text-slate-200">${quantity} unidades</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Valor total investido:</span>
                <span class="text-green-400 font-semibold">${formatCurrencyBrazil(totalValue)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Custo de manutenção:</span>
                <span class="text-red-400 font-semibold">${formatCurrencyBrazil(maintenanceCost)}/mês</span>
              </div>
            </div>
          </div>

          <!-- Technical Specifications -->
          <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
            <h4 class="font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <span>⚙️</span>
              Especificações Técnicas
            </h4>
            <div class="space-y-2 text-sm">
              ${Object.entries(specs).map(([key, value]) => {
                if (typeof value === 'object' || key === 'components' || key === 'total_cost') return '';

                const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                let displayValue = value;

                if (key.includes('cost') || key.includes('price')) {
                  displayValue = formatCurrencyBrazil(value);
                } else if (key.includes('weight')) {
                  displayValue = `${value} tons`;
                } else if (key.includes('speed')) {
                  displayValue = `${value} km/h`;
                } else if (key.includes('armor') || key.includes('thickness')) {
                  displayValue = `${value}mm`;
                } else if (key.includes('caliber') || key.includes('gun')) {
                  displayValue = `${value}mm`;
                }

                return `
                  <div class="flex justify-between">
                    <span class="text-slate-400">${displayKey}:</span>
                    <span class="text-slate-200">${displayValue}</span>
                  </div>
                `;
              }).join('')}

              ${equipment.approvedDate ? `
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Data de aprovação:</span>
                  <span class="text-slate-200">${new Date(equipment.approvedDate).toLocaleDateString('pt-BR')}</span>
                </div>
              ` : ''}
              ${equipment.approvedBy ? `
                <div class="flex justify-between">
                  <span class="text-slate-400">Aprovado por:</span>
                  <span class="text-slate-200">${equipment.approvedBy}</span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    modal.appendChild(modalContent);

    // Event listeners
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    modalContent.querySelector('#close-equipment-modal').addEventListener('click', () => {
      modal.remove();
    });

    // View sheet button
    const viewSheetBtn = modalContent.querySelector('#view-equipment-sheet');
    if (viewSheetBtn && equipment.sheetImageUrl) {
      viewSheetBtn.addEventListener('click', () => {
        showEquipmentSheet(equipmentName, equipment.sheetImageUrl);
      });
    }

    // Keyboard support
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', escapeHandler);
      }
    });

    document.body.appendChild(modal);

  } catch (error) {
    console.error('Erro ao carregar detalhes do equipamento:', error);
  }
}

function showEquipmentSheet(equipmentName, imageUrl) {
  // Remove existing modal
  const existingModal = document.getElementById('equipment-sheet-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // Create modal
  const modal = document.createElement('div');
  modal.id = 'equipment-sheet-modal';
  modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';

  const modalContent = document.createElement('div');
  modalContent.className = 'bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col';

  modalContent.innerHTML = `
    <div class="flex items-center justify-between p-4 border-b border-bg-ring/50">
      <div>
        <h3 class="text-lg font-semibold text-slate-200">📋 Ficha Técnica</h3>
        <p class="text-sm text-slate-400">${equipmentName}</p>
      </div>
      <div class="flex items-center gap-2">
        <button id="open-sheet-new-tab" class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
          🔗 Nova Aba
        </button>
        <button id="close-sheet-modal" class="text-slate-400 hover:text-slate-200 p-1">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-4">
      <div class="text-center">
        <img src="${imageUrl}" alt="Ficha do ${equipmentName}"
             class="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
             style="max-height: 70vh;"
             onload="this.style.opacity=1"
             style="opacity:0; transition: opacity 0.3s;">
      </div>
    </div>
  `;

  modal.appendChild(modalContent);

  // Event listeners
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  modalContent.querySelector('#close-sheet-modal').addEventListener('click', () => {
    modal.remove();
  });

  modalContent.querySelector('#open-sheet-new-tab').addEventListener('click', () => {
    window.open(imageUrl, '_blank');
  });

  // Keyboard support
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      modal.remove();
      document.removeEventListener('keydown', escapeHandler);
    }
  });

  document.body.appendChild(modal);
}

async function loadNavalSystem() {
  try {
    const container = document.getElementById('naval-content-container');
    if (!container) return;

    container.innerHTML = `<div class="flex items-center justify-center py-8"><div class="text-slate-400">🔄 Carregando sistema naval...</div></div>`;

    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    const shipyardSystem = new ShipyardSystem();
    const country = window.currentCountry;

    if (!country) {
      throw new Error("Dados do país não encontrados. Recarregue a página.");
    }

    // Fetch necessary data in parallel
    const [currentLevel, globalAverageGDP] = await Promise.all([
        shipyardSystem.getCurrentShipyardLevel(paisId),
        db.collection('paises').get().then(snapshot => {
            if (snapshot.empty) return 0;
            let totalGDP = 0;
            let countryCount = 0;
            snapshot.forEach(doc => {
                const pib = parseFloat(doc.data().PIB);
                if (!isNaN(pib)) {
                    totalGDP += pib;
                    countryCount++;
                }
            });
            return countryCount > 0 ? totalGDP / countryCount : 0;
        })
    ]);

    container.innerHTML = renderNavalSystem(shipyardSystem, currentLevel, country, paisId, globalAverageGDP);

  } catch (error) {
    console.error('Erro ao carregar sistema naval:', error);
    const container = document.getElementById('naval-content-container');
    if (container) {
      container.innerHTML = `<div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center"><div class="text-6xl mb-4">❌</div><h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3><p class="text-red-400">Erro ao carregar sistema naval: ${error.message}</p></div>`;
    }
  }
}

function renderNavalSystem(shipyardSystem, currentLevel, country, paisId, globalAverageGDP) {
  const budget = calculateBudget(country);
  const levelInfo = shipyardSystem.getLevelInfo(currentLevel, country, globalAverageGDP);
  const maintenanceCost = shipyardSystem.calculateMaintenanceCost(currentLevel, budget);
  const canUpgradeResult = shipyardSystem.canUpgrade(currentLevel, country, globalAverageGDP, budget);

  // Próximos 3 níveis para comparação
  const nextLevels = [];
  for (let i = 1; i <= 3; i++) {
    if (currentLevel + i <= shipyardSystem.maxLevel) {
      nextLevels.push(shipyardSystem.getLevelInfo(currentLevel + i, country, globalAverageGDP));
    }
  }

  return `
    <div class="space-y-6">
      <!-- Status Current do Estaleiro -->
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">🏭</span>
          Estaleiros - Nível ${currentLevel}
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Status Atual -->
          <div class="space-y-4">
            <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
              <h4 class="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span>📊</span>
                Status Atual
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-400">Nível:</span>
                  <span class="text-slate-200 font-semibold">${currentLevel}/10</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Descrição:</span>
                  <span class="text-slate-200 text-xs">${levelInfo.description}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Bônus paralelo:</span>
                  <span class="text-green-400">+${levelInfo.parallelBonus}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Redução tempo:</span>
                  <span class="text-blue-400">-${levelInfo.timeReduction}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Projetos simultâneos:</span>
                  <span class="text-purple-400">${levelInfo.maxProjects}</span>
                </div>
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Manutenção/mês:</span>
                  <span class="text-red-400">${formatCurrencyBrazil(maintenanceCost)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">% do orçamento:</span>
                  <span class="text-red-400">${(levelInfo.maintenancePercent * 100).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            ${currentLevel < shipyardSystem.maxLevel ? `
              <!-- Upgrade -->
              <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                <h4 class="font-semibold text-emerald-200 mb-3 flex items-center gap-2">
                  <span>⬆️</span>
                  Upgrade para Nível ${currentLevel + 1}
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Custo do upgrade:</span>
                    <span class="text-emerald-300 font-semibold">${formatCurrencyBrazil(levelInfo.upgradeCost)}</span>
                  </div>

                  ${canUpgradeResult.canUpgrade ? `
                    <button onclick="window.upgradeShipyard('${paisId}')"
                            class="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
                      ⬆️ Fazer Upgrade
                    </button>
                  ` : `
                    <div class="w-full px-4 py-2 bg-slate-700 text-slate-400 text-center rounded-lg text-sm">
                      ${canUpgradeResult.reason}
                    </div>
                  `}
                </div>
              </div>
            ` : `
              <div class="bg-gold-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                <h4 class="font-semibold text-yellow-200 mb-2">👑 Nível Máximo Atingido</h4>
                <p class="text-sm text-yellow-300">Seus estaleiros estão no máximo da tecnologia disponível!</p>
              </div>
            `}
          </div>

          <!-- Próximos Níveis -->
          <div class="space-y-4">
            <h4 class="font-semibold text-slate-200 flex items-center gap-2">
              <span>🔮</span>
              Próximos Níveis
            </h4>

            ${nextLevels.map(levelData => `
              <div class="bg-slate-800/20 border border-slate-600/30 rounded-lg p-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold text-slate-200">Nível ${levelData.level}</span>
                  <span class="text-xs text-emerald-300">${formatCurrencyBrazil(levelData.upgradeCost)}</span>
                </div>
                <div class="text-xs text-slate-400 mb-2">${levelData.description}</div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="text-green-400">+${levelData.parallelBonus}% paralelo</div>
                  <div class="text-blue-400">-${levelData.timeReduction}% tempo</div>
                  <div class="text-purple-400">${levelData.maxProjects} projetos</div>
                  <div class="text-red-400">${(levelData.maintenancePercent * 100).toFixed(1)}% manutenção</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Impacto na Produção Naval -->
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">⚓</span>
          Impacto na Produção Naval
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${renderNavalExamples(shipyardSystem, currentLevel)}
        </div>

        <div class="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h4 class="font-semibold text-blue-200 mb-2">💡 Como Funcionam os Estaleiros:</h4>
          <div class="text-sm text-blue-100 space-y-1">
            <div>• <strong>Produção Paralela:</strong> Mais navios construídos simultaneamente</div>
            <div>• <strong>Redução de Tempo:</strong> Cada navio é construído mais rapidamente</div>
            <div>• <strong>Projetos Simultâneos:</strong> Diferentes tipos de navios ao mesmo tempo</div>
            <div>• <strong>Manutenção:</strong> Custo mensal crescente para manter a infraestrutura</div>
          </div>
        </div>
      </div>

      <!-- Ferramentas Navais -->
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">🔧</span>
          Ferramentas de Construção Naval
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="criador-navios.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-xl">🚢</span>
                <div>
                  <div class="font-medium text-slate-200">Criador de Navios</div>
                  <div class="text-xs text-slate-400">Design customizado de embarcações militares</div>
                  <div class="text-xs text-purple-400 mt-1">Tecnologia naval: ${Math.round(country.Marinha || 0)}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-200">${formatCurrencyBrazil(calculateShipProductionCapacity(country))}/turno</div>
              </div>
            </div>
          </a>

          <div class="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xl">📊</span>
              <div>
                <div class="font-medium text-slate-200">Estatísticas de Produção</div>
                <div class="text-xs text-slate-400">Capacidade atual dos estaleiros</div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Capacidade base:</span>
                <span class="text-slate-200">${formatCurrencyBrazil(calculateShipProductionCapacity(country))}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Bônus estaleiro:</span>
                <span class="text-green-400">+${levelInfo.parallelBonus}%</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Capacidade efetiva:</span>
                <span class="text-emerald-400 font-semibold">${formatCurrencyBrazil(calculateShipProductionCapacity(country) * (1 + levelInfo.parallelBonus / 100))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderNavalExamples(shipyardSystem, currentLevel) {
  const examples = [
    { name: "Corveta", baseTime: 8, baseParallel: 12 },
    { name: "Destroyer", baseTime: 18, baseParallel: 4 },
    { name: "Cruzador", baseTime: 30, baseParallel: 2 }
  ];

  return examples.map(example => {
    const bonus = shipyardSystem.calculateProductionBonus(currentLevel);
    const newTime = Math.ceil(example.baseTime * (1 - bonus.timeReduction));
    const newParallel = Math.ceil(example.baseParallel * bonus.parallelMultiplier);
    const baseTurns = Math.ceil(example.baseTime / 3);
    const newTurns = Math.ceil(newTime / 3);

    return `
      <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <h4 class="font-semibold text-slate-200 mb-3">${example.name}</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo base:</span>
            <span class="text-slate-300">${example.baseTime} meses (${baseTurns} turnos)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo atual:</span>
            <span class="text-blue-400">${newTime} meses (${newTurns} turnos)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Paralelo base:</span>
            <span class="text-slate-300">${example.baseParallel}x</span>
          </div>
          <div class="flex justify-between border-t border-slate-600 pt-2">
            <span class="text-slate-400">Paralelo atual:</span>
            <span class="text-green-400 font-semibold">${newParallel}x</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Função para fazer upgrade do estaleiro
window.upgradeShipyard = async function(countryId) {
  try {
    // Confirmação do usuário
    if (!confirm('Tem certeza que deseja fazer upgrade do estaleiro? O custo será deduzido imediatamente do orçamento.')) {
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Usuário não autenticado');
      return;
    }

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId || paisId !== countryId) {
      alert('Você não tem permissão para fazer upgrade deste país');
      return;
    }

    // Mostrar loading
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '🔄 Processando...';
    button.disabled = true;

    const shipyardSystem = new ShipyardSystem();
    const result = await shipyardSystem.upgradeShipyard(countryId);

    if (result.success) {
      // Sucesso
      button.textContent = '✅ Upgrade Concluído!';
      button.classList.add('bg-green-600');

      // Mostrar notificação de sucesso
      alert(`🏭 Estaleiro upgradado para nível ${result.newLevel}!\n` +
            `💰 Custo: ${formatCurrencyBrazil(result.cost)}\n` +
            `📈 Novos bônus: +${result.levelInfo.parallelBonus}% paralelo, -${result.levelInfo.timeReduction}% tempo`);

      // Recarregar a aba naval após um delay
      setTimeout(() => {
        loadNavalSystem();
      }, 1500);

    } else {
      // Erro
      button.textContent = '❌ Erro';
      button.classList.add('bg-red-600');
      alert('Erro ao fazer upgrade: ' + result.error);

      // Restaurar botão após delay
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-red-600');
        button.disabled = false;
      }, 3000);
    }

  } catch (error) {
    console.error('Erro ao fazer upgrade do estaleiro:', error);
    alert('Erro ao fazer upgrade: ' + error.message);

    // Restaurar botão
    if (event.target) {
      event.target.textContent = '❌ Erro';
      event.target.classList.add('bg-red-600');
      setTimeout(() => {
        event.target.textContent = '⬆️ Fazer Upgrade';
        event.target.classList.remove('bg-red-600');
        event.target.disabled = false;
      }, 3000);
    }
  }
};

// Make functions globally available
window.showEquipmentDetails = showEquipmentDetails;

// Função para recarregar dados do país atual
async function reloadCurrentCountry() {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return null;

    // Buscar dados atualizados do Firebase
    const countryDoc = await db.collection('paises').doc(paisId).get();
    if (countryDoc.exists) {
      const updatedCountry = { id: countryDoc.id, ...countryDoc.data() };
      window.currentCountry = updatedCountry;
      return updatedCountry;
    }

    return null;
  } catch (error) {
    console.error('Erro ao recarregar país:', error);
    return null;
  }
}

// Tornar função global para ser usada pelos sistemas
window.reloadCurrentCountry = reloadCurrentCountry;

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

// Expor calculadores de recursos globalmente para o OfferModalManager
window.ResourceProductionCalculator = ResourceProductionCalculator;
window.ResourceConsumptionCalculator = ResourceConsumptionCalculator;

// Funções para controlar orçamento militar
window.updateBudgetDisplay = function(value) {
  document.getElementById('budget-display').textContent = value;
};

window.updateDistributionDisplay = function(changedSlider) {
  const vehiclesSlider = document.getElementById('vehicles-slider');
  const aircraftSlider = document.getElementById('aircraft-slider');
  const navalSlider = document.getElementById('naval-slider');

  let vehicles = parseInt(vehiclesSlider.value);
  let aircraft = parseInt(aircraftSlider.value);
  let naval = parseInt(navalSlider.value);

  // Se foi especificado qual slider mudou, ajustar os outros para não passar de 100%
  if (changedSlider) {
    const total = vehicles + aircraft + naval;

    if (total > 100) {
      const excess = total - 100;

      if (changedSlider === 'vehicles') {
        // Reduzir proporcionalmente os outros dois
        const otherTotal = aircraft + naval;
        if (otherTotal > 0) {
          aircraft = Math.max(10, Math.floor(aircraft * (100 - vehicles) / otherTotal));
          naval = Math.max(10, 100 - vehicles - aircraft);
        }
      } else if (changedSlider === 'aircraft') {
        // Reduzir proporcionalmente os outros dois
        const otherTotal = vehicles + naval;
        if (otherTotal > 0) {
          vehicles = Math.max(10, Math.floor(vehicles * (100 - aircraft) / otherTotal));
          naval = Math.max(10, 100 - aircraft - vehicles);
        }
      } else if (changedSlider === 'naval') {
        // Reduzir proporcionalmente os outros dois
        const otherTotal = vehicles + aircraft;
        if (otherTotal > 0) {
          vehicles = Math.max(10, Math.floor(vehicles * (100 - naval) / otherTotal));
          aircraft = Math.max(10, 100 - naval - vehicles);
        }
      }

      // Atualizar os valores dos sliders
      vehiclesSlider.value = vehicles;
      aircraftSlider.value = aircraft;
      navalSlider.value = naval;
    }
  }

  // Atualizar displays
  document.getElementById('vehicles-display').textContent = vehicles;
  document.getElementById('aircraft-display').textContent = aircraft;
  document.getElementById('naval-display').textContent = naval;

  // Atualizar total e cor
  const total = vehicles + aircraft + naval;
  const totalDisplay = document.getElementById('total-distribution-display');
  totalDisplay.textContent = total + '%';

  // Mudar cor baseado no total
  if (total === 100) {
    totalDisplay.className = 'text-lg font-bold text-emerald-400';
  } else if (total > 100) {
    totalDisplay.className = 'text-lg font-bold text-red-400';
  } else {
    totalDisplay.className = 'text-lg font-bold text-yellow-400';
  }

  // Calcular orçamento militar atual
  const budgetSlider = document.getElementById('military-budget-slider');
  const budgetPercent = parseFloat(budgetSlider.value) / 100;
  const generalBudget = calculateBudget(window.currentCountry);
  const militaryBudget = generalBudget * budgetPercent;

  // Orçamento disponível após manutenção (15% é deduzido automaticamente)
  const availableBudget = militaryBudget * 0.85;

  // Atualizar valores em dólar
  document.getElementById('vehicles-amount').textContent = formatCurrencyBrazil(availableBudget * vehicles / 100);
  document.getElementById('aircraft-amount').textContent = formatCurrencyBrazil(availableBudget * aircraft / 100);
  document.getElementById('naval-amount').textContent = formatCurrencyBrazil(availableBudget * naval / 100);
};

window.saveMilitaryBudget = async function(event) {
  try {
    const budgetPercent = parseFloat(document.getElementById('military-budget-slider').value);
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Usar Firebase compat API
    const { db } = await import('../services/firebase.js');

    await db.collection('paises').doc(paisId).update({
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

window.saveMilitaryDistribution = async function(event) {
  try {
    const vehicles = parseInt(document.getElementById('vehicles-slider').value);
    const aircraft = parseInt(document.getElementById('aircraft-slider').value);
    const naval = parseInt(document.getElementById('naval-slider').value);

    // Validar se soma é exatamente 100%
    const total = vehicles + aircraft + naval;
    if (total !== 100) {
      alert(`A soma das distribuições deve ser exatamente 100%! Atual: ${total}%`);
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Usar Firebase compat API
    const { db } = await import('../services/firebase.js');

    await db.collection('paises').doc(paisId).update({
      MilitaryDistributionVehicles: vehicles,
      MilitaryDistributionAircraft: aircraft,
      MilitaryDistributionNaval: naval
      // Manutenção é deduzida automaticamente do orçamento, não salva no banco
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

// Marketplace functionality
let marketplaceSystem = null;
let offerModalManager = null;

async function loadMarketplace() {
  const container = document.getElementById('marketplace-container');
  if (!container) return;

  try {
    const user = auth.currentUser;
    if (!user) {
      container.innerHTML = '<div class="text-center py-8 text-slate-400">Faça login para acessar o mercado internacional</div>';
      return;
    }

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) {
      container.innerHTML = '<div class="text-center py-8 text-slate-400">Você precisa estar associado a um país</div>';
      return;
    }

    // Inicializar sistema de marketplace
    if (!marketplaceSystem) {
      marketplaceSystem = new MarketplaceSystem();
    }

    // Inicializar gerenciador de modais de oferta
    if (!offerModalManager) {
      offerModalManager = new OfferModalManager(marketplaceSystem);
    }

    // Renderizar interface do marketplace
    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-white">🌍 Mercado Internacional</h2>
              <p class="text-sm text-slate-400 mt-1">Compre e venda recursos, veículos e equipamentos navais</p>
            </div>
            <div class="flex gap-2">
              <button id="create-test-offers-btn" class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors">
                🧪 Dados Teste
              </button>
              <button id="clear-test-offers-btn" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                🗑️ Limpar Teste
              </button>
              <button id="create-offer-btn" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors">
                + Criar Oferta
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Categories -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-4">
          <div class="flex flex-wrap gap-2">
            <button class="marketplace-category-btn active px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-brand-500/20 text-brand-400 border border-brand-400/30" data-category="all">
              Todos
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="resources">
              🏭 Recursos
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="vehicles">
              🚗 Veículos
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="naval">
              🚢 Naval
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="favorites">
              ⭐ Favoritos
            </button>
          </div>
        </div>

        <!-- Advanced Filters and Search -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-4">
          <!-- Basic Filters Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">🔍 Buscar</label>
              <div class="relative">
                <input type="text" id="marketplace-search" placeholder="Buscar por nome, descrição, país..."
                       class="w-full px-3 py-2 pr-10 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none">
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">📊 Ordenar por</label>
              <select id="marketplace-sort" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                <option value="date">🕒 Mais recente</option>
                <option value="price-low">💰 Menor preço</option>
                <option value="price-high">💎 Maior preço</option>
                <option value="quantity">📦 Maior quantidade</option>
                <option value="popularity">👁️ Mais visualizado</option>
                <option value="expires-soon">⏰ Expira em breve</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">🎯 Tipo</label>
              <select id="marketplace-type" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                <option value="all">Todos</option>
                <option value="sell">💰 Vendas</option>
                <option value="buy">🛒 Compras</option>
              </select>
            </div>
          </div>

          <!-- Advanced Filters Toggle -->
          <div class="border-t border-bg-ring/50 pt-4">
            <button id="toggle-advanced-filters" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <span>⚙️ Filtros Avançados</span>
              <svg id="advanced-filters-icon" class="h-4 w-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Advanced Filters Panel -->
            <div id="advanced-filters-panel" class="hidden mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Price Range -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">💵 Faixa de Preço</label>
                <div class="space-y-2">
                  <input type="number" id="price-min" placeholder="Preço mínimo" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                  <input type="number" id="price-max" placeholder="Preço máximo" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                </div>
              </div>

              <!-- Quantity Range -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">📦 Quantidade</label>
                <div class="space-y-2">
                  <input type="number" id="quantity-min" placeholder="Qtd. mínima" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                  <input type="number" id="quantity-max" placeholder="Qtd. máxima" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                </div>
              </div>

              <!-- Country Filter -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">🌍 País</label>
                <select id="country-filter" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none text-sm">
                  <option value="">Todos os países</option>
                </select>
              </div>

              <!-- Time Filter -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">⏱️ Tempo Restante</label>
                <select id="time-filter" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none text-sm">
                  <option value="">Qualquer tempo</option>
                  <option value="1">Menos de 1 dia</option>
                  <option value="3">Menos de 3 dias</option>
                  <option value="7">Menos de 1 semana</option>
                  <option value="30">Menos de 1 mês</option>
                </select>
              </div>
            </div>

            <!-- Filter Actions -->
            <div class="mt-4 flex gap-2">
              <button id="apply-filters-btn" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black text-sm font-medium rounded-lg transition-colors">
                Aplicar Filtros
              </button>
              <button id="clear-filters-btn" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors">
                Limpar
              </button>
              <button id="save-filters-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                💾 Salvar Filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Embargo Management Section -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">🚫 Embargos Diplomáticos</h3>
              <p class="text-sm text-slate-400">Gerencie bloqueios comerciais com outros países</p>
              <div id="embargo-status-indicator" class="mt-2"></div>
            </div>
            <div class="flex gap-2">
              <button id="view-notifications-btn" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors relative">
                📢 Notificações
                <span id="notifications-count-badge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"></span>
              </button>
              <button id="view-embargoes-btn" class="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors relative">
                Ver Embargos
                <span id="embargo-count-badge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"></span>
              </button>
              <button id="create-embargo-btn" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                Aplicar Embargo
              </button>
            </div>
          </div>
        </div>

        <!-- Marketplace Content -->
        <div id="marketplace-content" class="min-h-[400px]">
          <!-- Content will be loaded here -->
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p class="text-slate-400">Carregando ofertas...</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Setup event listeners
    setupMarketplaceListeners();

    // Load initial content
    loadMarketplaceOffers('all', paisId);

    // Update embargo status indicator and notification count
    updateEmbargoStatusIndicator(paisId);
    updateNotificationCount();

    // Load countries for filter dropdown
    loadCountriesForFilter();

  } catch (error) {
    console.error('Erro ao carregar marketplace:', error);
    container.innerHTML = '<div class="text-center py-8 text-red-400">Erro ao carregar marketplace</div>';
  }
}

function setupMarketplaceListeners() {
  // Category navigation
  document.querySelectorAll('.marketplace-category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      document.querySelectorAll('.marketplace-category-btn').forEach(b => {
        b.classList.remove('active', 'bg-brand-500/20', 'text-brand-400', 'border-brand-400/30');
        b.classList.add('bg-bg/50', 'text-slate-300', 'border-bg-ring');
      });

      btn.classList.add('active', 'bg-brand-500/20', 'text-brand-400', 'border-brand-400/30');
      btn.classList.remove('bg-bg/50', 'text-slate-300', 'border-bg-ring');

      // Load content for category
      const category = btn.dataset.category;
      const user = auth.currentUser;
      if (user) {
        checkPlayerCountry(user.uid).then(paisId => {
          if (paisId) {
            resetPagination();
            loadMarketplaceOffers(category, paisId);
          }
        });
      }
    });
  });

  // Search and filters
  const searchInput = document.getElementById('marketplace-search');
  const sortSelect = document.getElementById('marketplace-sort');
  const typeSelect = document.getElementById('marketplace-type');

  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
      const user = auth.currentUser;
      if (user) {
        checkPlayerCountry(user.uid).then(paisId => {
          if (paisId) loadMarketplaceOffers(activeCategory, paisId);
        });
      }
    }, 300));
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
      const user = auth.currentUser;
      if (user) {
        checkPlayerCountry(user.uid).then(paisId => {
          if (paisId) loadMarketplaceOffers(activeCategory, paisId);
        });
      }
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener('change', () => {
      const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
      const user = auth.currentUser;
      if (user) {
        checkPlayerCountry(user.uid).then(paisId => {
          if (paisId) loadMarketplaceOffers(activeCategory, paisId);
        });
      }
    });
  }

  // Create offer button
  const createOfferBtn = document.getElementById('create-offer-btn');
  if (createOfferBtn) {
    createOfferBtn.addEventListener('click', openCreateOfferModal);
  }

  // Embargo management buttons
  const viewNotificationsBtn = document.getElementById('view-notifications-btn');
  if (viewNotificationsBtn) {
    viewNotificationsBtn.addEventListener('click', openNotificationsModal);
  }

  const viewEmbargoesBtn = document.getElementById('view-embargoes-btn');
  if (viewEmbargoesBtn) {
    viewEmbargoesBtn.addEventListener('click', openEmbargoesModal);
  }

  const createEmbargoBtn = document.getElementById('create-embargo-btn');
  if (createEmbargoBtn) {
    createEmbargoBtn.addEventListener('click', openCreateEmbargoModal);
  }

  // Create test offers button
  const createTestOffersBtn = document.getElementById('create-test-offers-btn');
  if (createTestOffersBtn) {
    createTestOffersBtn.addEventListener('click', async () => {
      createTestOffersBtn.disabled = true;
      createTestOffersBtn.innerHTML = '⏳ Criando...';

      try {
        const result = await marketplaceSystem.createTestOffers();
        if (result.success) {
          createTestOffersBtn.innerHTML = '✅ Criado!';
          createTestOffersBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
          createTestOffersBtn.classList.add('bg-green-600');

          // Recarregar ofertas
          setTimeout(() => {
            const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
            const user = auth.currentUser;
            if (user) {
              checkPlayerCountry(user.uid).then(paisId => {
                if (paisId) loadMarketplaceOffers(activeCategory, paisId);
              });
            }

            // Resetar botão após 3 segundos
            setTimeout(() => {
              createTestOffersBtn.innerHTML = '🧪 Dados Teste';
              createTestOffersBtn.classList.remove('bg-green-600');
              createTestOffersBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');
              createTestOffersBtn.disabled = false;
            }, 3000);
          }, 1000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Erro ao criar ofertas de teste:', error);
        createTestOffersBtn.innerHTML = '❌ Erro';
        createTestOffersBtn.classList.remove('bg-yellow-600', 'hover:bg-yellow-700');
        createTestOffersBtn.classList.add('bg-red-600');

        setTimeout(() => {
          createTestOffersBtn.innerHTML = '🧪 Dados Teste';
          createTestOffersBtn.classList.remove('bg-red-600');
          createTestOffersBtn.classList.add('bg-yellow-600', 'hover:bg-yellow-700');
          createTestOffersBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // Clear test offers button
  const clearTestOffersBtn = document.getElementById('clear-test-offers-btn');
  if (clearTestOffersBtn) {
    clearTestOffersBtn.addEventListener('click', async () => {
      // Confirmar antes de deletar
      if (!confirm('Tem certeza que deseja deletar todas as ofertas de teste? Esta ação não pode ser desfeita.')) {
        return;
      }

      clearTestOffersBtn.disabled = true;
      clearTestOffersBtn.innerHTML = '⏳ Limpando...';

      try {
        const result = await marketplaceSystem.clearTestOffers();
        if (result.success) {
          clearTestOffersBtn.innerHTML = `✅ ${result.count || 0} removidas!`;
          clearTestOffersBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
          clearTestOffersBtn.classList.add('bg-green-600');

          // Recarregar ofertas
          setTimeout(() => {
            const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
            const user = auth.currentUser;
            if (user) {
              checkPlayerCountry(user.uid).then(paisId => {
                if (paisId) loadMarketplaceOffers(activeCategory, paisId);
              });
            }

            // Resetar botão após 3 segundos
            setTimeout(() => {
              clearTestOffersBtn.innerHTML = '🗑️ Limpar Teste';
              clearTestOffersBtn.classList.remove('bg-green-600');
              clearTestOffersBtn.classList.add('bg-red-600', 'hover:bg-red-700');
              clearTestOffersBtn.disabled = false;
            }, 3000);
          }, 1000);
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('Erro ao limpar ofertas de teste:', error);
        clearTestOffersBtn.innerHTML = '❌ Erro';

        setTimeout(() => {
          clearTestOffersBtn.innerHTML = '🗑️ Limpar Teste';
          clearTestOffersBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // Advanced filters functionality
  setupAdvancedFilters();
}

// Intelligence Agency functionality
async function loadIntelligenceAgency() {
  const container = document.getElementById('intelligence-dashboard-container');
  if (!container) return;

  try {
    const country = window.currentCountry;
    if (!country) {
      container.innerHTML = `
        <div class="text-center py-12">
          <span class="text-4xl text-red-400 mb-4 block">❌</span>
          <p class="text-red-300">País não encontrado</p>
        </div>
      `;
      return;
    }

    // Importar e renderizar dashboard da agência
    const { renderAgencyDashboard } = await import('../components/agencyDashboard.js');
    renderAgencyDashboard(country, container);
  } catch (error) {
    console.error('Erro ao carregar agência:', error);
    container.innerHTML = `
      <div class="text-center py-12">
        <span class="text-4xl text-red-400 mb-4 block">❌</span>
        <p class="text-red-300">Erro ao carregar agência de inteligência</p>
        <p class="text-sm text-slate-400 mt-2">${error.message}</p>
      </div>
    `;
  }
}

async function loadMarketplaceOffers(category, currentCountryId) {
  const contentContainer = document.getElementById('marketplace-content');
  if (!contentContainer) return;

  try {
    // Show loading state
    contentContainer.innerHTML = `
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-slate-400">Carregando ofertas...</p>
        </div>
      </div>
    `;

    // Get filter values (basic + advanced)
    const searchTerm = document.getElementById('marketplace-search')?.value || '';
    const sortBy = document.getElementById('marketplace-sort')?.value || 'date';
    const offerType = document.getElementById('marketplace-type')?.value || 'all';

    // Advanced filters
    const priceMin = parseFloat(document.getElementById('price-min')?.value) || null;
    const priceMax = parseFloat(document.getElementById('price-max')?.value) || null;
    const quantityMin = parseInt(document.getElementById('quantity-min')?.value) || null;
    const quantityMax = parseInt(document.getElementById('quantity-max')?.value) || null;
    const countryFilter = document.getElementById('country-filter')?.value || null;
    const timeFilter = parseInt(document.getElementById('time-filter')?.value) || null;

    // Build filters for Firebase query
    const filters = {
      category: category,
      type: offerType,
      searchTerm: searchTerm,
      current_country_id: currentCountryId,
      orderBy: getFirebaseOrderBy(sortBy),
      orderDirection: getFirebaseOrderDirection(sortBy),
      limit: 50, // Limit results for performance

      // Advanced filters
      priceMin: priceMin,
      priceMax: priceMax,
      quantityMin: quantityMin,
      quantityMax: quantityMax,
      countryFilter: countryFilter,
      timeFilter: timeFilter
    };

    // Handle favorites category
    let offers = [];
    let result = { success: true, offers: [] };

    if (category === 'favorites') {
      // Load favorite offers
      const favoriteIds = getFavorites();
      if (favoriteIds.length === 0) {
        offers = [];
        result = { success: true, offers: [], totalCount: 0 };
      } else {
        // Get all offers and filter by favorites
        const allFilters = { ...filters, category: 'all', limit: 1000 };
        result = await marketplaceSystem.getOffers(allFilters);

        if (result.success) {
          offers = result.offers.filter(offer => favoriteIds.includes(offer.id));
        }
      }
    } else {
      // Get offers from Firebase
      result = await marketplaceSystem.getOffers(filters);
      offers = result.offers || [];
    }

    if (!result.success) {
      throw new Error(result.error);
    }

    if (offers.length === 0) {
      // Check if there are embargoes affecting this country
      const embargoInfo = await checkActiveEmbargoes(currentCountryId);

      contentContainer.innerHTML = `
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-lg font-medium text-white mb-2">Nenhuma oferta encontrada</h3>
          <p class="text-slate-400 mb-6">Não há ofertas disponíveis para os filtros selecionados</p>
          ${embargoInfo.hasEmbargoes ? `
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 mx-auto max-w-md">
              <div class="flex items-center gap-2 text-red-400 mb-2">
                <span>🚫</span>
                <span class="font-medium">Embargos Ativos</span>
              </div>
              <p class="text-sm text-red-300">
                ${embargoInfo.totalEmbargoes} país(es) aplicaram embargos contra você,
                limitando ${embargoInfo.blockedCategories.length > 0 ? 'algumas categorias' : 'todas as trocas'}.
              </p>
              <button onclick="openEmbargoesModal()" class="mt-3 text-xs px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors">
                Ver Embargos
              </button>
            </div>
          ` : ''}
          <button onclick="document.getElementById('create-offer-btn').click()" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors">
            Criar primeira oferta
          </button>
        </div>
      `;
      return;
    }

    // Check for active embargoes to show warning
    const embargoInfo = await checkActiveEmbargoes(currentCountryId);

    // Render offers with embargo warning if applicable
    let content = '';

    if (embargoInfo.hasEmbargoes) {
      content += `
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-yellow-400 mb-2">
            <span>⚠️</span>
            <span class="font-medium">Aviso de Embargos</span>
          </div>
          <p class="text-sm text-yellow-300">
            Algumas ofertas podem estar ocultas devido a embargos ativos.
            ${embargoInfo.totalEmbargoes} país(es) aplicaram restrições comerciais.
          </p>
          <button onclick="openEmbargoesModal()" class="mt-2 text-xs px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors">
            Ver Detalhes
          </button>
        </div>
      `;
    }

    content += `
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="offers-grid">
        ${offers.map(offer => renderOfferCard(offer, currentCountryId)).join('')}
      </div>

      <!-- Pagination Controls -->
      <div class="mt-8 border-t border-bg-ring/50 pt-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Results Info -->
          <div class="text-sm text-slate-400">
            Mostrando ${offers.length} de ${result.totalCount || offers.length} ofertas
          </div>

          <!-- Pagination -->
          <div class="flex items-center gap-2">
            <button id="load-more-btn" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              📦 Carregar Mais
            </button>
            <button id="infinite-scroll-toggle" class="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors" title="Toggle carregamento automático">
              <span id="infinite-scroll-icon">🔄</span>
            </button>
          </div>
        </div>

        <!-- Load More State -->
        <div id="load-more-state" class="hidden mt-4 text-center">
          <div class="inline-flex items-center gap-2 text-slate-400">
            <div class="animate-spin w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full"></div>
            <span>Carregando mais ofertas...</span>
          </div>
        </div>
      </div>
    `;

    contentContainer.innerHTML = content;

    // Update favorite button states
    updateFavoriteButtons(offers);

    // Setup pagination listeners
    setupPaginationListeners(currentCountryId, category, filters);

  } catch (error) {
    console.error('Erro ao carregar ofertas:', error);
    contentContainer.innerHTML = `
      <div class="text-center py-12 text-red-400">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-medium mb-2">Erro ao carregar ofertas</h3>
        <p class="mb-4">${error.message || 'Tente novamente em alguns instantes'}</p>
        <button onclick="auth.currentUser && checkPlayerCountry(auth.currentUser.uid).then(paisId => paisId && loadMarketplaceOffers('${category}', paisId))" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Tentar novamente
        </button>
      </div>
    `;
  }
}

// Expor para uso global
window.loadMarketplaceOffers = loadMarketplaceOffers;

// Helper functions for Firebase ordering
function getFirebaseOrderBy(sortBy) {
  switch (sortBy) {
    case 'price-low':
    case 'price-high':
      return 'price_per_unit';
    case 'quantity':
      return 'quantity';
    case 'popularity':
      return 'views';
    case 'expires-soon':
      return 'expires_at';
    case 'date':
    default:
      return 'created_at';
  }
}

function getFirebaseOrderDirection(sortBy) {
  switch (sortBy) {
    case 'price-low':
    case 'expires-soon':
      return 'asc';
    case 'price-high':
    case 'quantity':
    case 'popularity':
    case 'date':
    default:
      return 'desc';
  }
}

// Check active embargoes affecting a country
async function checkActiveEmbargoes(countryId) {
  try {
    if (!countryId) {
      return { hasEmbargoes: false, totalEmbargoes: 0, blockedCategories: [] };
    }

    const embargoesSnapshot = await db.collection('marketplace_embargoes')
      .where('target_country_id', '==', countryId)
      .where('status', '==', 'active')
      .get();

    const embargoes = [];
    embargoesSnapshot.forEach(doc => {
      embargoes.push(doc.data());
    });

    if (embargoes.length === 0) {
      return { hasEmbargoes: false, totalEmbargoes: 0, blockedCategories: [] };
    }

    // Collect all blocked categories
    const blockedCategories = new Set();
    let hasFullEmbargo = false;

    embargoes.forEach(embargo => {
      if (embargo.type === 'full') {
        hasFullEmbargo = true;
        blockedCategories.add('resources');
        blockedCategories.add('vehicles');
        blockedCategories.add('naval');
      } else if (embargo.type === 'partial' && embargo.categories_blocked) {
        embargo.categories_blocked.forEach(category => {
          blockedCategories.add(category);
        });
      }
    });

    return {
      hasEmbargoes: true,
      totalEmbargoes: embargoes.length,
      blockedCategories: Array.from(blockedCategories),
      hasFullEmbargo,
      embargoes
    };

  } catch (error) {
    console.error('Erro ao verificar embargos:', error);
    return { hasEmbargoes: false, totalEmbargoes: 0, blockedCategories: [] };
  }
}

// Remove the generateMockOffers function - now using real Firebase data

function renderOfferCard(offer, currentCountryId) {
  const user = auth.currentUser;
  const isOwnOffer = user && (offer.player_id === user.uid || offer.country_id === currentCountryId);

  // Handle both Firebase timestamp and Date objects
  const expiresAt = offer.expires_at?.toDate ? offer.expires_at.toDate() : new Date(offer.expires_at);
  const totalValue = offer.quantity * offer.price_per_unit;
  const timeLeft = Math.max(0, Math.floor((expiresAt - new Date()) / (24 * 60 * 60 * 1000)));

  const typeInfo = offer.type === 'sell'
    ? { label: 'Venda', color: 'text-green-400 bg-green-400/20', icon: '💰' }
    : { label: 'Compra', color: 'text-blue-400 bg-blue-400/20', icon: '🛒' };

  const categoryIcons = {
    resources: '🏭',
    vehicles: '🚗',
    naval: '🚢'
  };

  return `
    <div id="offer-card-${offer.id}" class="bg-bg-soft border border-bg-ring/70 rounded-xl p-4 hover:border-brand-400/30 transition-colors cursor-pointer" onclick="openOfferDetails('${offer.id}')">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${categoryIcons[offer.category]}</span>
          <span class="px-2 py-1 rounded text-xs font-medium ${typeInfo.color}">
            ${typeInfo.icon} ${typeInfo.label}
          </span>
        </div>
        <div class="text-right text-xs text-slate-400">
          <div>${timeLeft} dias restantes</div>
          ${offer.views ? `<div class="mt-1">${offer.views} visualizações</div>` : ''}
        </div>
      </div>

      <!-- Title and Description -->
      <h3 class="font-semibold text-white mb-2 line-clamp-1">${offer.title}</h3>
      <p class="text-sm text-slate-400 mb-3 line-clamp-2">${offer.description || 'Sem descrição'}</p>

      <!-- Quantity and Price -->
      <div class="space-y-2 mb-3">
        <div class="flex justify-between">
          <span class="text-sm text-slate-300">Quantidade:</span>
          <span class="text-sm font-medium text-white">${offer.quantity.toLocaleString()} ${offer.unit}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-slate-300">Preço unitário:</span>
          <span class="text-sm font-medium text-brand-400">${formatCurrencyBrazil(offer.price_per_unit)}</span>
        </div>
        <div class="flex justify-between border-t border-bg-ring/50 pt-2">
          <span class="text-sm font-medium text-slate-300">Valor total:</span>
          <span class="font-semibold text-white">${formatCurrencyBrazil(totalValue)}</span>
        </div>
      </div>

      <!-- Country -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">${offer.country_flag || '🏳️'}</span>
          <span class="text-sm text-slate-300">${offer.country_name}</span>
        </div>
        <div class="flex gap-2">
          <button id="favorite-btn-${offer.id}" class="text-xs px-2 py-1 bg-slate-600/20 text-slate-400 rounded hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors" onclick="event.stopPropagation(); toggleFavorite('${offer.id}')" title="Adicionar aos favoritos">
            <span id="favorite-icon-${offer.id}">⭐</span>
          </button>
          ${isOwnOffer && offer.type === 'sell' ? `
          <button id="cancel-offer-btn-${offer.id}" class="text-xs px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors" onclick="event.stopPropagation(); cancelOffer('${offer.id}')">
            Cancelar
          </button>
          ` : `
          <button class="text-xs px-3 py-1 bg-brand-500/20 text-brand-400 rounded-lg hover:bg-brand-500/30 transition-colors" onclick="event.stopPropagation(); openOfferDetails('${offer.id}')">
            Ver detalhes
          </button>
          `}
        </div>
      </div>
    </div>
  `;
}

async function cancelOffer(offerId) {
  if (!offerId) return;

  // Confirmation
  if (!confirm('Tem certeza que deseja cancelar esta oferta de venda? Os itens serão restituídos ao seu inventário.')) {
    return;
  }

  const cancelButton = document.getElementById(`cancel-offer-btn-${offerId}`);
  if (cancelButton) {
    cancelButton.disabled = true;
    cancelButton.textContent = 'Cancelando...';
  }

  try {
    if (!marketplaceSystem) {
      marketplaceSystem = new MarketplaceSystem();
    }

    const result = await marketplaceSystem.cancelOffer(offerId);

    if (result.success) {
      // Visual feedback for success
      const offerCard = document.getElementById(`offer-card-${offerId}`);
      if (offerCard) {
        offerCard.style.transition = 'opacity 0.5s ease';
        offerCard.style.opacity = '0';
        setTimeout(() => offerCard.remove(), 500);
      }
      alert('Oferta cancelada com sucesso!');
    } else {
      throw new Error(result.error || 'Erro desconhecido ao cancelar a oferta.');
    }
  } catch (error) {
    console.error('Erro ao cancelar oferta:', error);
    alert(`Não foi possível cancelar a oferta: ${error.message}`);
    if (cancelButton) {
      cancelButton.disabled = false;
      cancelButton.textContent = 'Cancelar';
    }
  }
}
window.cancelOffer = cancelOffer;

async function openOfferDetails(offerId) {
  try {
    // Increment view count
    if (marketplaceSystem) {
      marketplaceSystem.incrementOfferViews(offerId);
    }

    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado para visualizar detalhes');
      return;
    }

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) {
      alert('Você precisa estar associado a um país');
      return;
    }

    // Get country data for budget validation
    const allCountries = await getAllCountries();
    const country = allCountries.find(c => c.id === paisId);
    if (!country) {
      alert('Dados do país não encontrados');
      return;
    }

    // Find the offer in current loaded offers
    const offerCards = document.querySelectorAll('[onclick*="openOfferDetails"]');
    let offer = null;

    // Try to get offer from marketplace system cache or make a direct query
    try {
      const result = await marketplaceSystem.getOffers({ limit: 1000 });
      if (result.success && result.offers) {
        offer = result.offers.find(o => o.id === offerId);
      }
    } catch (error) {
      console.error('Error finding offer:', error);
    }

    if (!offer) {
      alert('Oferta não encontrada');
      return;
    }

    // Remove existing modal
    const existingModal = document.getElementById('offer-details-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'offer-details-modal';
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';

    const isOwnOffer = offer.player_id === user.uid || offer.country_id === paisId;
    const canBuy = !isOwnOffer && offer.type === 'sell' && offer.status === 'active';
    const canSell = !isOwnOffer && offer.type === 'buy' && offer.status === 'active';
    const canInteract = canBuy || canSell;

    // Calculate if user has budget for buy offers
    const budget = calculateBudget(country);
    const totalCost = offer.quantity * offer.price_per_unit;
    const hasBudget = budget >= totalCost;

    const expiresAt = offer.expires_at?.toDate ? offer.expires_at.toDate() : new Date(offer.expires_at);
    const timeLeft = Math.max(0, Math.ceil((expiresAt - new Date()) / (24 * 60 * 60 * 1000)));

    modal.innerHTML = `
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">
                ${offer.type === 'sell' ? '🔥' : '💰'}
                ${offer.category === 'resources' ? '🏭' : offer.category === 'vehicles' ? '🚗' : '🚢'}
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">${offer.title}</h2>
                <div class="flex items-center space-x-4 text-sm text-slate-400">
                  <span>${offer.country_flag} ${offer.country_name}</span>
                  <span>${offer.type === 'sell' ? 'Vendendo' : 'Comprando'}</span>
                  <span>${timeLeft} dias restantes</span>
                </div>
              </div>
            </div>
            <button onclick="closeOfferDetailsModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informações da Oferta -->
            <div class="space-y-6">
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📋 Detalhes do Item</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Item:</span>
                    <span class="text-white">${offer.item_name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${offer.category === 'resources' ? 'Recursos' : offer.category === 'vehicles' ? 'Veículos' : 'Naval'}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade:</span>
                    <span class="text-white font-medium">${offer.quantity.toLocaleString()} ${offer.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço por ${offer.unit.slice(0, -1)}:</span>
                    <span class="text-white font-medium">${formatCurrency(offer.price_per_unit)}</span>
                  </div>
                  <div class="flex justify-between border-t border-bg-ring pt-2 mt-3">
                    <span class="text-slate-400">Valor Total:</span>
                    <span class="text-brand-300 font-bold text-lg">${formatCurrency(offer.total_value)}</span>
                  </div>
                </div>
              </div>

              ${offer.description ? `
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-2">📝 Descrição</h3>
                <p class="text-slate-300 text-sm">${offer.description}</p>
              </div>
              ` : ''}

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">⚙️ Condições</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Mínima:</span>
                    <span class="text-white">${offer.min_quantity || 1} ${offer.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Máxima:</span>
                    <span class="text-white">${offer.max_quantity || offer.quantity} ${offer.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tempo de Entrega:</span>
                    <span class="text-white">${offer.delivery_time_days || 30} dias</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Criado em:</span>
                    <span class="text-white">${new Date(offer.created_at?.seconds * 1000 || offer.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Visualizações:</span>
                    <span class="text-white">${offer.views || 0}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Países Interessados:</span>
                    <span class="text-white">${offer.interested_countries?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações e Compra -->
            <div class="space-y-6">
              ${isOwnOffer ? `
                <div class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <div class="text-blue-400">ℹ️</div>
                    <div>
                      <div class="text-blue-300 font-medium">Esta é sua oferta</div>
                      <div class="text-sm text-slate-300 mt-1">Você não pode interagir com suas próprias ofertas.</div>
                    </div>
                  </div>
                </div>
              ` : canInteract ? `
                <div class="bg-bg/30 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">
                    ${offer.type === 'sell' ? '💰 Comprar Item' : '🔥 Vender Item'}
                  </h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade Desejada</label>
                      <div class="flex space-x-2">
                        <input type="number" id="transaction-quantity" min="${offer.min_quantity || 1}" max="${offer.max_quantity || offer.quantity}" value="${offer.min_quantity || 1}" class="flex-1 px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                        <span class="px-3 py-2 text-slate-400 bg-bg/50 border border-bg-ring rounded-lg">${offer.unit}</span>
                      </div>
                      <div class="text-xs text-slate-400 mt-1">
                        Mín: ${offer.min_quantity || 1} | Máx: ${offer.max_quantity || offer.quantity}
                      </div>
                    </div>

                    <div id="transaction-summary" class="bg-brand-500/10 border border-brand-400/30 rounded-lg p-3">
                      <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                          <span class="text-slate-400">Quantidade:</span>
                          <span class="text-white"><span id="summary-quantity">${offer.min_quantity || 1}</span> ${offer.unit}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-400">Preço unitário:</span>
                          <span class="text-white">${formatCurrency(offer.price_per_unit)}</span>
                        </div>
                        <div class="flex justify-between font-medium border-t border-brand-400/30 pt-1 mt-2">
                          <span class="text-brand-300">Total a pagar:</span>
                          <span class="text-brand-300" id="summary-total">${formatCurrency((offer.min_quantity || 1) * offer.price_per_unit)}</span>
                        </div>
                      </div>
                    </div>

                    ${offer.type === 'sell' && !hasBudget ? `
                      <div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                        <div class="flex items-start space-x-2">
                          <div class="text-red-400">⚠️</div>
                          <div>
                            <div class="text-red-300 font-medium">Orçamento Insuficiente</div>
                            <div class="text-sm text-slate-300 mt-1">
                              Disponível: ${formatCurrency(budget)}<br>
                              Necessário: ${formatCurrency(totalCost)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ` : ''}

                    <div class="flex space-x-2">
                      <button onclick="closeOfferDetailsModal()" class="flex-1 px-4 py-2 text-slate-300 hover:text-white transition-colors border border-bg-ring rounded-lg">
                        Cancelar
                      </button>
                      <button onclick="processTransaction('${offer.id}')" id="process-transaction-btn" class="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors ${(offer.type === 'sell' && !hasBudget) ? 'opacity-50 cursor-not-allowed' : ''}" ${(offer.type === 'sell' && !hasBudget) ? 'disabled' : ''}>
                        ${offer.type === 'sell' ? '💰 Comprar' : '🔥 Vender'}
                      </button>
                    </div>
                  </div>
                </div>
              ` : `
                <div class="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <div class="text-amber-400">⚠️</div>
                    <div>
                      <div class="text-amber-300 font-medium">Oferta não disponível</div>
                      <div class="text-sm text-slate-300 mt-1">
                        ${offer.status !== 'active' ? 'Esta oferta não está mais ativa.' : 'Você não pode interagir com esta oferta.'}
                      </div>
                    </div>
                  </div>
                </div>
              `}

              ${(offer.category === 'vehicles' || offer.category === 'naval') ? `
              <!-- Especificações do Equipamento -->
              <div class="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-purple-300 font-medium">⚙️ Especificações Técnicas</h3>
                  <button onclick="openEquipmentDetails('${offer.item_id}', '${offer.category}', '${offer.country_id}')" class="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-lg hover:bg-purple-600/30 transition-colors">
                    📋 Ver Ficha Completa
                  </button>
                </div>
                <div id="equipment-specs-${offer.id}" class="text-sm text-slate-300 space-y-2">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tipo:</span>
                    <span class="text-white">${offer.category === 'vehicles' ? '🚗 Veículo Terrestre' : '🚢 Embarcação Naval'}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Modelo:</span>
                    <span class="text-white">${offer.item_name}</span>
                  </div>
                  <div class="text-xs text-slate-500 mt-3 p-2 bg-bg/50 rounded">
                    💡 Clique em "Ver Ficha Completa" para especificações detalhadas, componentes, custos e desempenho
                  </div>
                </div>
              </div>
              ` : ''}

              <!-- Informações do Vendedor/Comprador -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">🏛️ Informações do País</h3>
                <div class="flex items-center space-x-3 mb-3">
                  <div class="text-2xl">${offer.country_flag}</div>
                  <div>
                    <div class="text-white font-medium">${offer.country_name}</div>
                    <div class="text-sm text-slate-400">${offer.type === 'sell' ? 'Vendedor' : 'Comprador'}</div>
                  </div>
                </div>
                <div class="text-sm text-slate-400">
                  Este país ${offer.type === 'sell' ? 'está oferecendo' : 'está procurando'} ${offer.item_name.toLowerCase()}
                  ${offer.type === 'sell' ? 'para venda' : 'para compra'} no mercado internacional.
                </div>
              </div>

              <!-- Histórico de Preços (placeholder) -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📈 Informações de Mercado</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço Médio de Mercado:</span>
                    <span class="text-white">${formatCurrency(offer.price_per_unit * (0.9 + Math.random() * 0.2))}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Esta Oferta:</span>
                    <span class="${offer.price_per_unit > (offer.price_per_unit * 1.1) ? 'text-red-300' : offer.price_per_unit < (offer.price_per_unit * 0.9) ? 'text-green-300' : 'text-yellow-300'}">
                      ${offer.price_per_unit > (offer.price_per_unit * 1.1) ? '📈 Acima' : offer.price_per_unit < (offer.price_per_unit * 0.9) ? '📉 Abaixo' : '📊 Na Média'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setupOfferDetailsModal(offer, country, paisId);

  } catch (error) {
    console.error('Erro ao abrir detalhes da oferta:', error);
    alert('Erro ao carregar detalhes da oferta');
  }
}

function closeOfferDetailsModal() {
  const modal = document.getElementById('offer-details-modal');
  if (modal) {
    modal.remove();
  }
}

function setupOfferDetailsModal(offer, country, paisId) {
  const modal = document.getElementById('offer-details-modal');
  if (!modal) return;

  // Setup quantity input change handler
  const quantityInput = modal.querySelector('#transaction-quantity');
  if (quantityInput) {
    quantityInput.addEventListener('input', () => {
      updateTransactionSummary(offer, quantityInput.value);
    });
  }

  // Close modal on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeOfferDetailsModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeOfferDetailsModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

function updateTransactionSummary(offer, quantity) {
  const modal = document.getElementById('offer-details-modal');
  if (!modal) return;

  const summaryQuantity = modal.querySelector('#summary-quantity');
  const summaryTotal = modal.querySelector('#summary-total');

  if (summaryQuantity && summaryTotal) {
    const qty = parseInt(quantity) || 1;
    const total = qty * offer.price_per_unit;

    summaryQuantity.textContent = qty.toLocaleString();
    summaryTotal.textContent = formatCurrency(total);
  }
}

async function processTransaction(offerId) {
  try {
    const modal = document.getElementById('offer-details-modal');
    const quantityInput = modal.querySelector('#transaction-quantity');
    const processBtn = modal.querySelector('#process-transaction-btn');
    const originalText = processBtn.textContent;

    if (!quantityInput) {
      alert('Erro: quantidade não especificada');
      return;
    }

    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity <= 0) {
      alert('Por favor, especifique uma quantidade válida');
      quantityInput.focus();
      return;
    }

    // Get user and country info
    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado');
      return;
    }

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) {
      alert('Você precisa estar associado a um país');
      return;
    }

    // Find the offer
    const result = await marketplaceSystem.getOffers({ limit: 1000 });
    const offer = result.offers?.find(o => o.id === offerId);

    if (!offer) {
      alert('Oferta não encontrada');
      return;
    }

    // Validate quantity limits
    if (quantity < (offer.min_quantity || 1)) {
      alert(`Quantidade mínima: ${offer.min_quantity || 1} ${offer.unit}`);
      return;
    }

    if (quantity > (offer.max_quantity || offer.quantity)) {
      alert(`Quantidade máxima: ${offer.max_quantity || offer.quantity} ${offer.unit}`);
      return;
    }

    if (quantity > offer.quantity) {
      alert(`Quantidade disponível: ${offer.quantity} ${offer.unit}`);
      return;
    }

    // Show confirmation dialog
    const totalCost = quantity * offer.price_per_unit;
    const action = offer.type === 'sell' ? 'comprar' : 'vender';
    const confirmMessage = `
      Confirmar ${action}:

      • Item: ${offer.item_name}
      • Quantidade: ${quantity} ${offer.unit}
      • Preço unitário: ${formatCurrency(offer.price_per_unit)}
      • Valor total: ${formatCurrency(totalCost)}
      • País: ${offer.country_name}

      Deseja continuar?
    `;

    if (!confirm(confirmMessage)) {
      return;
    }

    // Update button state
    processBtn.disabled = true;
    processBtn.textContent = '⏳ Processando...';

    // Create transaction
    const transactionResult = await marketplaceSystem.createTransaction(offerId, {
      quantity: quantity
    });

    if (transactionResult.success) {
      processBtn.textContent = '✅ Sucesso!';
      processBtn.classList.remove('bg-brand-500', 'hover:bg-brand-600');
      processBtn.classList.add('bg-green-600');

      // Show success message
      setTimeout(() => {
        alert('Transação criada com sucesso! A negociação foi iniciada.');
        closeOfferDetailsModal();

        // Refresh marketplace offers
        const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
        const user = auth.currentUser;
        if (user) {
          checkPlayerCountry(user.uid).then(currentPaisId => {
            if (currentPaisId) loadMarketplaceOffers(activeCategory, currentPaisId);
          });
        }
      }, 1500);

    } else {
      throw new Error(transactionResult.error || 'Erro desconhecido ao processar transação');
    }

  } catch (error) {
    console.error('Erro ao processar transação:', error);

    const processBtn = document.querySelector('#process-transaction-btn');
    if (processBtn) {
      processBtn.textContent = '❌ Erro';
      processBtn.classList.remove('bg-brand-500', 'hover:bg-brand-600');
      processBtn.classList.add('bg-red-600');

      setTimeout(() => {
        processBtn.textContent = offer.type === 'sell' ? '💰 Comprar' : '🔥 Vender';
        processBtn.classList.remove('bg-red-600');
        processBtn.classList.add('bg-brand-500', 'hover:bg-brand-600');
        processBtn.disabled = false;
      }, 3000);
    }

    alert('Erro ao processar transação: ' + error.message);
  }
}

// Equipment Details Modal Functions
async function openEquipmentDetails(itemId, category, countryId) {
  try {
    console.log('Abrindo detalhes do equipamento:', { itemId, category, countryId });

    // Get the equipment data from inventory
    const inventory = await marketplaceSystem.getCountryInventory(countryId);

    // Find the equipment in the inventory
    let equipmentData = null;
    let equipmentCategory = null;

    // Search through inventory categories
    Object.keys(inventory).forEach(cat => {
      if (inventory[cat] && typeof inventory[cat] === 'object') {
        Object.keys(inventory[cat]).forEach(name => {
          const equipment = inventory[cat][name];
          if (equipment && typeof equipment === 'object') {
            // Create an ID similar to how it's done in the marketplace
            const generatedId = `${cat}_${name}`.toLowerCase().replace(/\s+/g, '_');
            if (generatedId === itemId || name.toLowerCase().includes(itemId.toLowerCase())) {
              equipmentData = equipment;
              equipmentCategory = cat;
              equipmentData.name = name;
              equipmentData.category = cat;
            }
          }
        });
      }
    });

    if (!equipmentData) {
      alert('Equipamento não encontrado no inventário do país vendedor.');
      return;
    }

    // Remove existing modal
    const existingModal = document.getElementById('equipment-details-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create equipment details modal
    const modal = document.createElement('div');
    modal.id = 'equipment-details-modal';
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4';

    modal.innerHTML = `
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">${category === 'vehicles' ? '🚗' : '🚢'}</div>
              <div>
                <h2 class="text-xl font-bold text-white">${equipmentData.name}</h2>
                <div class="text-sm text-slate-400">Ficha Técnica Completa</div>
              </div>
            </div>
            <button onclick="closeEquipmentDetailsModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informações Gerais -->
            <div class="space-y-4">
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📋 Informações Gerais</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Nome:</span>
                    <span class="text-white">${equipmentData.name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${equipmentCategory}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade no Inventário:</span>
                    <span class="text-white">${equipmentData.quantity || 0} unidades</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo Total de Produção:</span>
                    <span class="text-white">${formatCurrency(equipmentData.cost || 0)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo de Manutenção/Mês:</span>
                    <span class="text-white">${formatCurrency((equipmentData.cost || 0) * 0.05)}</span>
                  </div>
                </div>
              </div>

              ${equipmentData.components ? `
              <!-- Componentes -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">🔧 Componentes</h3>
                <div class="space-y-3 text-sm">
                  ${Object.entries(equipmentData.components).map(([compType, compData]) => `
                    <div class="bg-bg/50 rounded p-3">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="text-brand-300 font-medium">${compType.replace(/_/g, ' ').toUpperCase()}</div>
                          <div class="text-slate-300">${compData.name || 'N/A'}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-slate-400 text-xs">Custo</div>
                          <div class="text-white">${formatCurrency(compData.cost || 0)}</div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}
            </div>

            <!-- Performance e Estatísticas -->
            <div class="space-y-4">
              ${equipmentData.stats ? `
              <!-- Estatísticas -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-3">
                  ${Object.entries(equipmentData.stats).map(([statName, value]) => `
                    <div class="flex justify-between items-center">
                      <span class="text-slate-400">${statName.replace(/_/g, ' ')}:</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-white">${typeof value === 'number' ? value.toLocaleString() : value}</span>
                        ${typeof value === 'number' && value > 0 ? `
                          <div class="bg-bg w-16 h-2 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style="width: ${Math.min(100, (value / 100) * 100)}%"></div>
                          </div>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
              ` : ''}

              <!-- Informações Operacionais -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">⚡ Informações Operacionais</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Estado Operacional:</span>
                    <span class="text-green-400">✅ Ativo</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Disponível para Venda:</span>
                    <span class="text-white">${Math.floor((equipmentData.quantity || 0) * 0.5)} unidades (50% max)</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tempo de Preparação:</span>
                    <span class="text-white">15-30 dias</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Condição:</span>
                    <span class="text-white">Excelente</span>
                  </div>
                </div>
              </div>

              <!-- Notas Técnicas -->
              <div class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <h3 class="text-blue-300 font-medium mb-2">💡 Notas Técnicas</h3>
                <div class="text-sm text-slate-300">
                  <p>Este equipamento foi produzido conforme especificações militares padrão e passou por todos os testes de qualidade necessários.</p>
                  <p class="mt-2">Inclui documentação técnica completa, manuais de operação e suporte técnico básico.</p>
                </div>
              </div>

              <!-- Botão de Fechar -->
              <div class="flex justify-end pt-4">
                <button onclick="closeEquipmentDetailsModal()" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  Fechar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Close modal on click outside
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeEquipmentDetailsModal();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function escapeHandler(e) {
      if (e.key === 'Escape') {
        closeEquipmentDetailsModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    });

  } catch (error) {
    console.error('Erro ao abrir detalhes do equipamento:', error);
    alert('Erro ao carregar detalhes do equipamento');
  }
}

function closeEquipmentDetailsModal() {
  const modal = document.getElementById('equipment-details-modal');
  if (modal) {
    modal.remove();
  }
}

// Make functions globally available
window.openOfferDetails = openOfferDetails;
window.openEquipmentDetails = openEquipmentDetails;
window.closeEquipmentDetailsModal = closeEquipmentDetailsModal;
window.closeOfferDetailsModal = closeOfferDetailsModal;
window.processTransaction = processTransaction;

async function openCreateOfferModal() {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado para criar ofertas');
      return;
    }

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) {
      alert('Você precisa estar associado a um país');
      return;
    }

    // Garantir que window.paisId está disponível
    window.paisId = paisId;

    // Garantir que offerModalManager está inicializado
    if (!offerModalManager) {
      if (!marketplaceSystem) {
        marketplaceSystem = new MarketplaceSystem();
      }
      offerModalManager = new OfferModalManager(marketplaceSystem);
    }

    // Abrir modal inteligente de venda de recursos
    await offerModalManager.openResourceSellModal();

  } catch (error) {
    console.error('Erro ao abrir modal de criação:', error);
    alert('Erro ao abrir formulário de criação de ofertas');
  }
}

// ==================== CÓDIGO ANTIGO COMENTADO - SERÁ REMOVIDO APÓS TESTES ====================
/*
async function openCreateOfferModalOLD() {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert('Você precisa estar logado para criar ofertas');
      return;
    }

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) {
      alert('Você precisa estar associado a um país');
      return;
    }

    // Get country data for budget validation
    const allCountries = await getAllCountries();
    const country = allCountries.find(c => c.id === paisId);
    if (!country) {
      alert('Dados do país não encontrados');
      return;
    }

    // Remove existing modal
    const existingModal = document.getElementById('create-offer-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'create-offer-modal';
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';

    modal.innerHTML = `
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">📝 Criar Nova Oferta</h2>
            <button onclick="closeCreateOfferModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form id="create-offer-form" class="p-6 space-y-6">
          <!-- Tipo da Oferta -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de Oferta</label>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center space-x-3 p-4 border border-bg-ring rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                <input type="radio" name="offer-type" value="sell" class="text-brand-500 focus:ring-brand-400" required>
                <div>
                  <div class="text-white font-medium">🔥 Vender</div>
                  <div class="text-slate-400 text-sm">Ofertar seus recursos/equipamentos</div>
                </div>
              </label>
              <label class="flex items-center space-x-3 p-4 border border-bg-ring rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                <input type="radio" name="offer-type" value="buy" class="text-brand-500 focus:ring-brand-400" required>
                <div>
                  <div class="text-white font-medium">💰 Comprar</div>
                  <div class="text-slate-400 text-sm">Buscar recursos/equipamentos</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
            <select id="offer-category" name="category" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
              <option value="">Selecione uma categoria</option>
              <option value="resources">🏭 Recursos (Aço, Petróleo, Eletrônicos)</option>
              <option value="vehicles">🚗 Veículos (Tanques, Artilharia)</option>
              <option value="naval">🚢 Naval (Navios, Submarinos)</option>
            </select>
          </div>

          <!-- Item Específico -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Item</label>
            <select id="offer-item" name="item_id" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required disabled>
              <option value="">Selecione primeiro uma categoria</option>
            </select>
          </div>

          <!-- Título e Descrição -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Título da Oferta</label>
              <input type="text" id="offer-title" name="title" placeholder="Ex: Aço de Alta Qualidade" maxlength="100" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Duração (dias)</label>
              <select name="duration_days" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
                <option value="7">7 dias</option>
                <option value="14" selected>14 dias</option>
                <option value="21">21 dias</option>
                <option value="30">30 dias</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
            <textarea id="offer-description" name="description" rows="3" placeholder="Descreva o item, qualidade, condições especiais..." maxlength="500" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none resize-none"></textarea>
          </div>

          <!-- Quantidade e Preço -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade</label>
              <input type="number" id="offer-quantity" name="quantity" min="1" placeholder="0" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Unidade</label>
              <select id="offer-unit" name="unit" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
                <option value="toneladas">Toneladas</option>
                <option value="unidades">Unidades</option>
                <option value="barris">Barris</option>
                <option value="navios">Navios</option>
                <option value="submarinos">Submarinos</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Preço por Unidade (USD)</label>
              <input type="number" id="offer-price" name="price_per_unit" min="0.01" step="0.01" placeholder="0.00" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
            </div>
          </div>

          <!-- Configurações Avançadas -->
          <div class="bg-bg/30 rounded-lg p-4 space-y-4">
            <h3 class="text-white font-medium">⚙️ Configurações Avançadas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade Mínima por Pedido</label>
                <input type="number" name="min_quantity" min="1" placeholder="1" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Tempo de Entrega (dias)</label>
                <input type="number" name="delivery_time_days" min="1" value="30" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              </div>
            </div>
          </div>

          <!-- Resumo -->
          <!-- Informações do Item Selecionado -->
          <div id="item-info" class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 hidden">
            <h3 class="text-blue-300 font-medium mb-2">📋 Informações do Item</h3>
            <div id="item-info-content" class="text-sm text-slate-300 space-y-1">
              <!-- Content will be populated by JavaScript -->
            </div>
          </div>

          <!-- Resumo da Oferta -->
          <div id="offer-summary" class="bg-brand-500/10 border border-brand-400/30 rounded-lg p-4 hidden">
            <h3 class="text-brand-300 font-medium mb-2">📊 Resumo da Oferta</h3>
            <div id="offer-summary-content" class="text-sm text-slate-300 space-y-1">
              <!-- Content will be populated by JavaScript -->
            </div>
          </div>

          <!-- Budget Warning for Buy Offers -->
          <div id="budget-warning" class="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 hidden">
            <div class="flex items-start space-x-2">
              <div class="text-amber-400">⚠️</div>
              <div>
                <div class="text-amber-300 font-medium">Atenção: Orçamento</div>
                <div class="text-sm text-slate-300 mt-1">
                  Orçamento disponível: <span class="font-medium">${formatCurrency(calculateBudget(country))}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onclick="closeCreateOfferModal()" class="px-4 py-2 text-slate-300 hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" id="submit-offer-btn" class="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors">
              Criar Oferta
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    setupCreateOfferModal(country, paisId);

    // Focus on first input
    setTimeout(() => {
      const firstRadio = modal.querySelector('input[type="radio"]');
      if (firstRadio) firstRadio.focus();
    }, 100);

  } catch (error) {
    console.error('Erro ao abrir modal de criação:', error);
    alert('Erro ao abrir formulário de criação de ofertas');
  }
}
*/
// ==================== FIM DO CÓDIGO ANTIGO ====================

function closeCreateOfferModal() {
  const modal = document.getElementById('create-offer-modal');
  const resourceModal = document.getElementById('resource-sell-modal');
  if (modal) modal.remove();
  if (resourceModal) resourceModal.remove();
}

/*
// CÓDIGO ANTIGO - setupCreateOfferModal não é mais usado
function setupCreateOfferModal(country, paisId) {
  const modal = document.getElementById('create-offer-modal');
  if (!modal) return;

  // Load available items based on actual inventory
  let availableItems = {
    resources: [],
    vehicles: [],
    naval: []
  };

  // Load available items asynchronously
  async function loadAvailableItems() {
    try {
      // Check offer type first
      const offerTypeInputs = modal.querySelectorAll('input[name="offer-type"]');
      let offerType = null;
      offerTypeInputs.forEach(input => {
        if (input.checked) offerType = input.value;
      });

      console.log('🔍 Tipo de oferta selecionado:', offerType);

      if (offerType === 'sell') {
        // For sell offers, load from actual inventory
        console.log('📦 Carregando itens do inventário real para VENDA');
        await loadInventoryItems();
      } else if (offerType === 'buy') {
        // For buy offers, show all available item types
        console.log('🛒 Carregando todos os tipos de itens para COMPRA');
        loadAllItemTypes();
      } else {
        // Default to sell mode if no offer type selected
        console.log('⚠️ Nenhum tipo selecionado, usando VENDA como padrão');
        await loadInventoryItems();
      }

      // Update the current category selection
      const category = categorySelect.value;
      if (category) {
        populateItemsForCategory(category);
      }
    } catch (error) {
      console.error('Erro ao carregar itens disponíveis:', error);
    }
  }

        async function loadInventoryItems() {
          if (!marketplaceSystem) return;
  
          try {
            console.log('🔍 Carregando itens do inventário para país:', paisId);
  
            const countryData = window.currentCountry; // Use the already loaded country data
            if (!countryData) {
                console.error('❌ Dados do país não encontrados no window.currentCountry');
                return;
            }
  
            // --- NEW LOGIC: Calculate surplus from real production/consumption ---
            const resourceConsumption = ResourceConsumptionCalculator.calculateCountryConsumption(countryData);
            const resourceProduction = ResourceProductionCalculator.calculateCountryProduction(countryData);
  
            const resourceBalances = {
                Carvao: Math.round((resourceProduction.Carvao || 0) - (resourceConsumption.Carvao || 0)),
                Combustivel: Math.round((resourceProduction.Combustivel || 0) - (resourceConsumption.Combustivel || 0)),
                Metais: Math.round((resourceProduction.Metais || 0) - (resourceConsumption.Metais || 0)),
                Graos: Math.round((resourceProduction.Graos || 0) - (resourceConsumption.Graos || 0)),
            };
            
            availableItems.resources = [];
            Object.entries(resourceBalances).forEach(([resourceName, balance]) => {
                if (balance > 0) {
                    availableItems.resources.push({
                        id: resourceName.toLowerCase(),
                        name: `${resourceName} (Excedente: ${balance.toLocaleString()})`,
                        unit: (resourceName === 'Combustivel') ? 'barris' : 'toneladas',
                        available: balance
                    });
                }
            });
            console.log('✅ Recursos excedentes carregados para venda:', availableItems.resources);
            // --- END OF NEW LOGIC ---
  
  
            // Load available equipment (this part remains the same)
            const inventory = await marketplaceSystem.getCountryInventory(paisId);
            const availableEquipment = marketplaceSystem.getAvailableEquipment(inventory);
            availableItems.vehicles = availableEquipment.filter(eq => eq.type === 'vehicles');
            availableItems.naval = availableEquipment.filter(eq => eq.type === 'naval');
  
          } catch (error) {
            console.error('Erro ao carregar itens do inventário:', error);
          }
        }
        // The getResourceItems function is now obsolete and has been removed.
        // Resource availability is calculated directly from production/consumption balance.
  function loadAllItemTypes() {
    // For buy offers, show all possible item types (excluding energy - not tradeable)
    availableItems = {
      resources: [
        { id: 'steel_high_grade', name: 'Aço de Alta Qualidade', unit: 'toneladas' },
        { id: 'steel_standard', name: 'Aço Padrão', unit: 'toneladas' },
        { id: 'oil_crude', name: 'Petróleo Bruto', unit: 'barris' },
        { id: 'oil_aviation', name: 'Petróleo de Aviação', unit: 'barris' },
        { id: 'aluminum', name: 'Alumínio', unit: 'toneladas' },
        { id: 'copper', name: 'Cobre', unit: 'toneladas' },
        { id: 'rare_metals', name: 'Metais Raros', unit: 'toneladas' },
        { id: 'coal', name: 'Carvão', unit: 'toneladas' },
        { id: 'food', name: 'Alimentos', unit: 'toneladas' }
        // Energia removida - não é comerciável
      ],
      vehicles: [
        { id: 'mbt_modern', name: 'Tanque MBT Moderno', unit: 'unidades' },
        { id: 'mbt_standard', name: 'Tanque MBT Padrão', unit: 'unidades' },
        { id: 'light_tank', name: 'Tanque Leve', unit: 'unidades' },
        { id: 'heavy_tank', name: 'Tanque Pesado', unit: 'unidades' },
        { id: 'artillery_howitzer', name: 'Artilharia Howitzer', unit: 'unidades' },
        { id: 'artillery_rocket', name: 'Artilharia de Foguetes', unit: 'unidades' },
        { id: 'apc_standard', name: 'Transporte Blindado', unit: 'unidades' },
        { id: 'ifv_modern', name: 'Veículo de Combate', unit: 'unidades' }
      ],
      naval: [
        { id: 'destroyer_standard', name: 'Destroyer Padrão', unit: 'navios' },
        { id: 'destroyer_fletcher', name: 'Destroyer Classe Fletcher', unit: 'navios' },
        { id: 'cruiser_heavy', name: 'Cruzador Pesado', unit: 'navios' },
        { id: 'cruiser_light', name: 'Cruzador Leve', unit: 'navios' },
        { id: 'submarine_diesel', name: 'Submarino Diesel-Elétrico', unit: 'submarinos' },
        { id: 'submarine_nuclear', name: 'Submarino Nuclear', unit: 'submarinos' },
        { id: 'corvette_patrol', name: 'Corveta de Patrulha', unit: 'navios' },
        { id: 'frigate_escort', name: 'Fragata de Escolta', unit: 'navios' }
      ]
    };
  }

  function populateItemsForCategory(category) {
    console.log(`🎯 Populando itens para categoria: ${category}`);
    console.log('📋 availableItems atual:', availableItems);

    itemSelect.innerHTML = '<option value="">Selecione um item</option>';

    if (category && availableItems[category]) {
      itemSelect.disabled = false;

      const items = availableItems[category];
      console.log(`📦 Itens encontrados para ${category}:`, items);

      if (items.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum item disponível para venda';
        option.disabled = true;
        itemSelect.appendChild(option);
        itemSelect.disabled = true;
      } else {
        items.forEach(item => {
          console.log(`➕ Adicionando item: ${item.name} (${item.id})`);
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = item.name;
          option.dataset.unit = item.unit;
          option.dataset.available = item.available_quantity || item.available || '';
          option.dataset.cost = item.unit_cost || '';
          option.dataset.maintenance = item.maintenance_cost || '';
          itemSelect.appendChild(option);
        });
      }
    } else {
      console.log(`❌ Categoria ${category} não encontrada ou sem itens`);
      itemSelect.disabled = true;
    }

    updateOfferSummary();
  }

  loadAvailableItems();

  // Setup category change handler
  const categorySelect = modal.querySelector('#offer-category');
  const itemSelect = modal.querySelector('#offer-item');
  const unitSelect = modal.querySelector('#offer-unit');

  categorySelect.addEventListener('change', () => {
    const category = categorySelect.value;
    populateItemsForCategory(category);
  });

  // Setup offer type change handler
  const offerTypeInputs = modal.querySelectorAll('input[name="offer-type"]');
  offerTypeInputs.forEach(input => {
    input.addEventListener('change', () => {
      // Reload items when offer type changes
      loadAvailableItems();
    });
  });

  // Setup item change handler to update unit
  itemSelect.addEventListener('change', () => {
    const selectedOption = itemSelect.querySelector('option:checked');
    if (selectedOption && selectedOption.dataset.unit) {
      unitSelect.value = selectedOption.dataset.unit;
    }
    updateOfferSummary();
  });

  // Setup form input change handlers
  const formInputs = modal.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
    input.addEventListener('input', updateOfferSummary);
    input.addEventListener('change', updateOfferSummary);
  });

  // Setup form submission
  const form = modal.querySelector('#create-offer-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = modal.querySelector('#submit-offer-btn');
    const originalText = submitBtn.textContent;

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = '⏳ Criando...';

      const formData = new FormData(form);
      const offerData = {
        type: formData.get('offer-type'),
        category: formData.get('category'),
        item_id: formData.get('item_id'),
        item_name: itemSelect.querySelector('option:checked')?.textContent || '',
        title: formData.get('title'),
        description: formData.get('description'),
        quantity: parseInt(formData.get('quantity')),
        unit: formData.get('unit'),
        price_per_unit: parseFloat(formData.get('price_per_unit')),
        min_quantity: parseInt(formData.get('min_quantity')) || 1,
        delivery_time_days: parseInt(formData.get('delivery_time_days')) || 30,
        duration_days: parseInt(formData.get('duration_days'))
      };

      // Validate required fields
      if (!offerData.type || !offerData.category || !offerData.item_id || !offerData.title || !offerData.quantity || !offerData.price_per_unit) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Create offer using MarketplaceSystem
      const result = await marketplaceSystem.createOffer(offerData);

      if (result.success) {
        submitBtn.textContent = '✅ Criado!';
        submitBtn.classList.remove('bg-brand-500', 'hover:bg-brand-600');
        submitBtn.classList.add('bg-green-600');

        // Show success message
        setTimeout(() => {
          alert('Oferta criada com sucesso!');
          closeCreateOfferModal();

          // Refresh marketplace offers
          const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
          const user = auth.currentUser;
          if (user) {
            checkPlayerCountry(user.uid).then(currentPaisId => {
              if (currentPaisId) loadMarketplaceOffers(activeCategory, currentPaisId);
            });
          }
        }, 1000);

      } else {
        throw new Error(result.error || 'Erro desconhecido ao criar oferta');
      }

    } catch (error) {
      console.error('Erro ao criar oferta:', error);
      submitBtn.textContent = '❌ Erro';
      submitBtn.classList.remove('bg-brand-500', 'hover:bg-brand-600');
      submitBtn.classList.add('bg-red-600');

      alert('Erro ao criar oferta: ' + error.message);

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('bg-red-600');
        submitBtn.classList.add('bg-brand-500', 'hover:bg-brand-600');
        submitBtn.disabled = false;
      }, 3000);
    }
  });

  function updateOfferSummary() {
    const summaryDiv = modal.querySelector('#offer-summary');
    const summaryContent = modal.querySelector('#offer-summary-content');
    const budgetWarning = modal.querySelector('#budget-warning');
    const itemInfoDiv = modal.querySelector('#item-info');
    const itemInfoContent = modal.querySelector('#item-info-content');

    const formData = new FormData(form);
    const offerType = formData.get('offer-type');
    const quantity = parseInt(formData.get('quantity')) || 0;
    const pricePerUnit = parseFloat(formData.get('price_per_unit')) || 0;
    const totalValue = quantity * pricePerUnit;

    // Show item information when item is selected
    const selectedOption = itemSelect.querySelector('option:checked');
    if (selectedOption && selectedOption.value) {
      const itemName = selectedOption.textContent;
      const available = selectedOption.dataset.available;
      const cost = selectedOption.dataset.cost;
      const maintenance = selectedOption.dataset.maintenance;

      let itemInfo = `<div><strong>Item selecionado:</strong> ${itemName}</div>`;

      if (offerType === 'sell' && available) {
        itemInfo += `<div class="text-green-400"><strong>Disponível para venda:</strong> ${parseInt(available).toLocaleString()} unidades</div>`;
      }

      if (cost && parseFloat(cost) > 0) {
        itemInfo += `<div><strong>Custo de produção:</strong> ${formatCurrency(parseFloat(cost))} por unidade</div>`;
      }

      if (maintenance && parseFloat(maintenance) > 0) {
        itemInfo += `<div><strong>Custo de manutenção:</strong> ${formatCurrency(parseFloat(maintenance))} por unidade/mês</div>`;
      }

      // Show validation warnings for sell offers
      if (offerType === 'sell' && available && quantity > 0) {
        const availableQty = parseInt(available);
        if (quantity > availableQty) {
          itemInfo += `<div class="text-red-400 mt-2"><strong>⚠️ Quantidade excede o disponível!</strong><br>Máximo vendível: ${availableQty.toLocaleString()}</div>`;
        }
      }

      itemInfoContent.innerHTML = itemInfo;
      itemInfoDiv.classList.remove('hidden');
    } else {
      itemInfoDiv.classList.add('hidden');
    }

    // Show offer summary
    if (quantity > 0 && pricePerUnit > 0) {
      summaryDiv.classList.remove('hidden');

      const itemName = selectedOption?.textContent || 'Item';
      const unit = formData.get('unit') || 'unidades';

      let summaryInfo = `
        <div><strong>Tipo:</strong> ${offerType === 'sell' ? '🔥 Venda' : '💰 Compra'}</div>
        <div><strong>Item:</strong> ${itemName}</div>
        <div><strong>Quantidade:</strong> ${quantity.toLocaleString()} ${unit}</div>
        <div><strong>Preço por ${unit.slice(0, -1)}:</strong> ${formatCurrency(pricePerUnit)}</div>
        <div class="font-medium text-brand-300"><strong>Valor Total:</strong> ${formatCurrency(totalValue)}</div>
      `;

      // Add profit/cost analysis for sell offers
      if (offerType === 'sell' && cost && parseFloat(cost) > 0) {
        const unitCost = parseFloat(cost);
        const profit = pricePerUnit - unitCost;
        const totalProfit = profit * quantity;
        const profitColor = profit > 0 ? 'text-green-400' : 'text-red-400';

        summaryInfo += `<div class="${profitColor}"><strong>Lucro por unidade:</strong> ${formatCurrency(profit)}</div>`;
        summaryInfo += `<div class="${profitColor}"><strong>Lucro total:</strong> ${formatCurrency(totalProfit)}</div>`;
      }

      summaryContent.innerHTML = summaryInfo;

      // Show budget warning for buy offers
      if (offerType === 'buy') {
        const budget = calculateBudget(country);
        if (totalValue > budget) {
          budgetWarning.classList.remove('hidden');
          budgetWarning.querySelector('.text-sm').innerHTML = `
            Orçamento disponível: <span class="font-medium">${formatCurrency(budget)}</span><br>
            <span class="text-red-300">⚠️ Valor da oferta (${formatCurrency(totalValue)}) excede o orçamento disponível!</span>
          `;
        } else {
          budgetWarning.classList.add('hidden');
        }
      } else {
        budgetWarning.classList.add('hidden');
      }
    } else {
      summaryDiv.classList.add('hidden');
      budgetWarning.classList.add('hidden');
    }
  }

  // Close modal on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeCreateOfferModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeCreateOfferModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });

  // Add modal to DOM
  document.body.appendChild(modal);

  // Set "Vender" as default and load items
  const sellRadio = modal.querySelector('input[name="offer-type"][value="sell"]');
  if (sellRadio) {
    sellRadio.checked = true;
    console.log('✅ Radio "Vender" selecionado por padrão');
  }

  // Load items for sell mode
  console.log('🚀 Carregando itens iniciais para modo VENDA');
  loadAvailableItems();
}
*/
// ==================== FIM DO setupCreateOfferModal ANTIGO ====================

// Make functions globally available
window.closeCreateOfferModal = closeCreateOfferModal;

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Embargo Management Functions
// Notifications Management Functions
async function openNotificationsModal() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.id = 'notifications-modal';

    modal.innerHTML = `
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">📢 Notificações Diplomáticas</h2>
            <div class="flex items-center space-x-2">
              <button onclick="markAllNotificationsAsRead()" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                Marcar Todas como Lidas
              </button>
              <button onclick="closeNotificationsModal()" class="text-slate-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <!-- Filter tabs -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button class="notification-filter-btn active px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-brand-500/20 text-brand-400 border border-brand-400/30" data-filter="all">
                Todas
              </button>
              <button class="notification-filter-btn px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-filter="unread">
                Não Lidas
              </button>
              <button class="notification-filter-btn px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-filter="embargo">
                Embargos
              </button>
              <button class="notification-filter-btn px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-filter="transaction">
                Transações
              </button>
            </div>

            <!-- Notifications list -->
            <div id="notifications-list" class="space-y-3">
              <div class="flex items-center justify-center py-8">
                <div class="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setupNotificationsModal(paisId);
    await loadNotificationsData(paisId);

  } catch (error) {
    console.error('Erro ao abrir modal de notificações:', error);
  }
}

function closeNotificationsModal() {
  const modal = document.getElementById('notifications-modal');
  if (modal) {
    modal.remove();
  }
}

function setupNotificationsModal(paisId) {
  const modal = document.getElementById('notifications-modal');
  if (!modal) return;

  // Setup filter buttons
  const filterBtns = modal.querySelectorAll('.notification-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-brand-500/20', 'text-brand-400', 'border-brand-400/30');
        b.classList.add('bg-bg/50', 'text-slate-300', 'border-bg-ring');
      });

      btn.classList.add('active', 'bg-brand-500/20', 'text-brand-400', 'border-brand-400/30');
      btn.classList.remove('bg-bg/50', 'text-slate-300', 'border-bg-ring');

      // Filter notifications
      const filter = btn.dataset.filter;
      filterNotifications(filter);
    });
  });

  // Close modal on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeNotificationsModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function escapeHandler(e) {
    if (e.key === 'Escape') {
      closeNotificationsModal();
      document.removeEventListener('keydown', escapeHandler);
    }
  });
}

let allNotifications = [];

async function loadNotificationsData(countryId) {
  try {
    // Load all notifications for this country
    const notificationsSnapshot = await db.collection('notifications')
      .where('target_country_id', '==', countryId)
      .orderBy('created_at', 'desc')
      .limit(50)
      .get();

    allNotifications = [];
    notificationsSnapshot.forEach(doc => {
      allNotifications.push({ id: doc.id, ...doc.data() });
    });

    renderNotifications(allNotifications);

  } catch (error) {
    console.error('Erro ao carregar notificações:', error);
    const container = document.getElementById('notifications-list');
    if (container) {
      container.innerHTML = `
        <div class="text-center py-8 text-red-400">
          <div class="text-4xl mb-2">❌</div>
          <p>Erro ao carregar notificações</p>
        </div>
      `;
    }
  }
}

function renderNotifications(notifications) {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  if (notifications.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400">
        <div class="text-4xl mb-2">📪</div>
        <p>Nenhuma notificação encontrada</p>
      </div>
    `;
    return;
  }

  container.innerHTML = notifications.map(notification => renderNotificationCard(notification)).join('');
}

function renderNotificationCard(notification) {
  const isUnread = !notification.read;
  const createdAt = notification.created_at?.toDate ? notification.created_at.toDate() : new Date(notification.created_at);
  const timeAgo = getTimeAgo(createdAt);

  const typeIcons = {
    embargo_applied: '🚫',
    embargo_lifted: '✅',
    transaction_created: '💰',
    transaction_completed: '✅',
    trade_offer: '📦',
    diplomatic: '🏛️'
  };

  const typeColors = {
    embargo_applied: 'border-red-400/30 bg-red-400/10',
    embargo_lifted: 'border-green-400/30 bg-green-400/10',
    transaction_created: 'border-blue-400/30 bg-blue-400/10',
    transaction_completed: 'border-green-400/30 bg-green-400/10',
    trade_offer: 'border-yellow-400/30 bg-yellow-400/10',
    diplomatic: 'border-purple-400/30 bg-purple-400/10'
  };

  const icon = typeIcons[notification.type] || '📬';
  const colorClass = typeColors[notification.type] || 'border-slate-400/30 bg-slate-400/10';

  return `
    <div class="notification-item bg-bg border ${colorClass} rounded-lg p-4 ${isUnread ? 'border-l-4 border-l-brand-400' : ''}"
         data-type="${notification.type}" data-read="${notification.read ? 'true' : 'false'}">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3 flex-1">
          <div class="text-2xl">${icon}</div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="font-medium text-white">${notification.title}</h4>
              ${isUnread ? '<span class="w-2 h-2 bg-brand-400 rounded-full"></span>' : ''}
            </div>
            <p class="text-sm text-slate-300 mb-2">${notification.message}</p>
            <div class="flex items-center space-x-4 text-xs text-slate-400">
              <span>${timeAgo}</span>
              ${notification.priority === 'high' ? '<span class="text-red-400 font-medium">• Alta Prioridade</span>' : ''}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          ${isUnread ? `
            <button onclick="markNotificationAsRead('${notification.id}')" class="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded hover:bg-green-600/30 transition-colors">
              Marcar como Lida
            </button>
          ` : ''}
          <button onclick="deleteNotification('${notification.id}')" class="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  `;
}

function filterNotifications(filter) {
  let filteredNotifications = allNotifications;

  if (filter === 'unread') {
    filteredNotifications = allNotifications.filter(n => !n.read);
  } else if (filter === 'embargo') {
    filteredNotifications = allNotifications.filter(n => n.type && n.type.includes('embargo'));
  } else if (filter === 'transaction') {
    filteredNotifications = allNotifications.filter(n => n.type && n.type.includes('transaction'));
  }

  renderNotifications(filteredNotifications);
}

async function markNotificationAsRead(notificationId) {
  try {
    await db.collection('notifications').doc(notificationId).update({
      read: true,
      read_at: new Date()
    });

    // Update local data
    const notification = allNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }

    // Re-render current filter
    const activeFilter = document.querySelector('.notification-filter-btn.active')?.dataset.filter || 'all';
    filterNotifications(activeFilter);

    // Update notification count
    await updateNotificationCount();

  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
  }
}

async function markAllNotificationsAsRead() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Update all unread notifications
    const batch = db.batch();
    allNotifications.forEach(notification => {
      if (!notification.read) {
        const notificationRef = db.collection('notifications').doc(notification.id);
        batch.update(notificationRef, {
          read: true,
          read_at: new Date()
        });
        notification.read = true;
      }
    });

    await batch.commit();

    // Re-render notifications
    const activeFilter = document.querySelector('.notification-filter-btn.active')?.dataset.filter || 'all';
    filterNotifications(activeFilter);

    // Update notification count
    await updateNotificationCount();

  } catch (error) {
    console.error('Erro ao marcar todas as notificações como lidas:', error);
  }
}

async function deleteNotification(notificationId) {
  try {
    if (!confirm('Tem certeza que deseja excluir esta notificação?')) {
      return;
    }

    await db.collection('notifications').doc(notificationId).delete();

    // Update local data
    allNotifications = allNotifications.filter(n => n.id !== notificationId);

    // Re-render notifications
    const activeFilter = document.querySelector('.notification-filter-btn.active')?.dataset.filter || 'all';
    filterNotifications(activeFilter);

    // Update notification count
    await updateNotificationCount();

  } catch (error) {
    console.error('Erro ao excluir notificação:', error);
  }
}

async function updateNotificationCount() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    const unreadSnapshot = await db.collection('notifications')
      .where('target_country_id', '==', paisId)
      .where('read', '==', false)
      .get();

    const count = unreadSnapshot.size;
    const badge = document.getElementById('notifications-count-badge');

    if (badge) {
      if (count > 0) {
        badge.textContent = count > 99 ? '99+' : count.toString();
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

  } catch (error) {
    console.error('Erro ao atualizar contador de notificações:', error);
  }
}

function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Agora há pouco';
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays} dias atrás`;
  return date.toLocaleDateString('pt-BR');
}

// Make functions globally available
window.closeNotificationsModal = closeNotificationsModal;
window.markNotificationAsRead = markNotificationAsRead;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.deleteNotification = deleteNotification;
window.openEmbargoesModal = openEmbargoesModal;
window.closeEmbargoesModal = closeEmbargoesModal;
window.openCreateEmbargoModal = openCreateEmbargoModal;
window.closeCreateEmbargoModal = closeCreateEmbargoModal;
window.liftEmbargo = liftEmbargo;

async function openEmbargoesModal() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.id = 'embargoes-modal';

    modal.innerHTML = `
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">🚫 Embargos Diplomáticos</h2>
            <button onclick="closeEmbargoesModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Embargos Aplicados -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Embargos que você aplicou</h3>
              <div id="applied-embargoes-list" class="space-y-3">
                <div class="flex items-center justify-center py-8">
                  <div class="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full"></div>
                </div>
              </div>
            </div>

            <!-- Embargos Recebidos -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Embargos contra você</h3>
              <div id="received-embargoes-list" class="space-y-3">
                <div class="flex items-center justify-center py-8">
                  <div class="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Load embargoes data
    await loadEmbargoesData(paisId);

  } catch (error) {
    console.error('Erro ao abrir modal de embargos:', error);
  }
}

async function loadEmbargoesData(countryId) {
  try {
    // Load applied embargoes
    const appliedResult = await db.collection('marketplace_embargoes')
      .where('embargo_country_id', '==', countryId)
      .where('status', '==', 'active')
      .orderBy('created_at', 'desc')
      .get();

    // Load received embargoes
    const receivedResult = await db.collection('marketplace_embargoes')
      .where('target_country_id', '==', countryId)
      .where('status', '==', 'active')
      .orderBy('created_at', 'desc')
      .get();

    const appliedEmbargoes = [];
    const receivedEmbargoes = [];

    appliedResult.forEach(doc => {
      appliedEmbargoes.push({ id: doc.id, ...doc.data() });
    });

    receivedResult.forEach(doc => {
      receivedEmbargoes.push({ id: doc.id, ...doc.data() });
    });

    // Render applied embargoes
    const appliedContainer = document.getElementById('applied-embargoes-list');
    if (appliedContainer) {
      if (appliedEmbargoes.length === 0) {
        appliedContainer.innerHTML = `
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">🕊️</div>
            <p>Nenhum embargo aplicado</p>
          </div>
        `;
      } else {
        appliedContainer.innerHTML = appliedEmbargoes.map(embargo => renderEmbargoCard(embargo, 'applied')).join('');
      }
    }

    // Render received embargoes
    const receivedContainer = document.getElementById('received-embargoes-list');
    if (receivedContainer) {
      if (receivedEmbargoes.length === 0) {
        receivedContainer.innerHTML = `
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">✅</div>
            <p>Nenhum embargo recebido</p>
          </div>
        `;
      } else {
        receivedContainer.innerHTML = receivedEmbargoes.map(embargo => renderEmbargoCard(embargo, 'received')).join('');
      }
    }

  } catch (error) {
    console.error('Erro ao carregar dados de embargos:', error);
  }
}

function renderEmbargoCard(embargo, type) {
  const isExpiring = embargo.expires_at && new Date(embargo.expires_at.toDate ? embargo.expires_at.toDate() : embargo.expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const targetCountry = type === 'applied' ? embargo.target_country_name : embargo.embargo_country_name;
  const targetFlag = type === 'applied' ? '🎯' : '⚠️';

  const typeInfo = embargo.type === 'full'
    ? { label: 'Total', color: 'text-red-400 bg-red-400/20' }
    : { label: 'Parcial', color: 'text-yellow-400 bg-yellow-400/20' };

  const createdAt = embargo.created_at?.toDate ? embargo.created_at.toDate() : new Date(embargo.created_at);
  const timeAgo = Math.floor((new Date() - createdAt) / (24 * 60 * 60 * 1000));

  return `
    <div class="bg-bg border border-bg-ring/70 rounded-lg p-4 ${isExpiring ? 'border-yellow-400/30' : ''}">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${targetFlag}</span>
          <div>
            <h4 class="font-medium text-white">${targetCountry}</h4>
            <span class="px-2 py-1 rounded text-xs font-medium ${typeInfo.color}">
              ${typeInfo.label}
            </span>
          </div>
        </div>
        ${type === 'applied' ? `
          <button onclick="liftEmbargo('${embargo.id}')" class="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors">
            Suspender
          </button>
        ` : ''}
      </div>

      <p class="text-sm text-slate-400 mb-2">${embargo.reason || 'Sem motivo especificado'}</p>

      ${embargo.type === 'partial' && embargo.categories_blocked ? `
        <div class="mb-2">
          <span class="text-xs text-slate-500">Categorias bloqueadas:</span>
          <div class="flex gap-1 mt-1">
            ${embargo.categories_blocked.map(cat => {
              const icons = { resources: '🏭', vehicles: '🚗', naval: '🚢' };
              const names = { resources: 'Recursos', vehicles: 'Veículos', naval: 'Naval' };
              return `<span class="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">${icons[cat]} ${names[cat]}</span>`;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <div class="flex justify-between text-xs text-slate-500">
        <span>Há ${timeAgo} dias</span>
        ${embargo.expires_at ? `
          <span class="${isExpiring ? 'text-yellow-400' : ''}">
            Expira ${embargo.expires_at ? 'em breve' : 'indefinido'}
          </span>
        ` : '<span>Indefinido</span>'}
      </div>
    </div>
  `;
}

function closeEmbargoesModal() {
  const modal = document.getElementById('embargoes-modal');
  if (modal) {
    modal.remove();
  }
}

async function openCreateEmbargoModal() {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const paisId = await checkPlayerCountry(user.uid);
    if (!paisId) return;

    // Get list of all countries for selection
    const countriesSnapshot = await db.collection('paises').get();
    const countries = [];

    countriesSnapshot.forEach(doc => {
      const data = doc.data();
      if (doc.id !== paisId) { // Exclude own country
        countries.push({
          id: doc.id,
          name: data.Pais,
          flag: data.Flag || '🏳️'
        });
      }
    });

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.id = 'create-embargo-modal';

    modal.innerHTML = `
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-md w-full">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">🚫 Aplicar Embargo</h2>
            <button onclick="closeCreateEmbargoModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form id="create-embargo-form" class="p-6 space-y-4">
          <!-- Target Country -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">País alvo</label>
            <select id="target-country" required class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              <option value="">Selecione um país</option>
              ${countries.map(country => `
                <option value="${country.id}">${country.flag} ${country.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Embargo Type -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de embargo</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="embargo-type" value="full" checked class="mr-2 text-brand-400">
                <span class="text-white">Total - Bloqueia todas as categorias</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="embargo-type" value="partial" class="mr-2 text-brand-400">
                <span class="text-white">Parcial - Bloqueia categorias específicas</span>
              </label>
            </div>
          </div>

          <!-- Categories (for partial embargo) -->
          <div id="categories-section" class="hidden">
            <label class="block text-sm font-medium text-slate-300 mb-2">Categorias bloqueadas</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" name="blocked-categories" value="resources" class="mr-2 text-brand-400">
                <span class="text-white">🏭 Recursos</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" name="blocked-categories" value="vehicles" class="mr-2 text-brand-400">
                <span class="text-white">🚗 Veículos</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" name="blocked-categories" value="naval" class="mr-2 text-brand-400">
                <span class="text-white">🚢 Naval</span>
              </label>
            </div>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Motivo</label>
            <textarea id="embargo-reason" placeholder="Descreva o motivo do embargo..." class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none resize-none" rows="3"></textarea>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Duração</label>
            <select id="embargo-duration" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              <option value="">Indefinido</option>
              <option value="7">7 dias</option>
              <option value="14">14 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="button" onclick="closeCreateEmbargoModal()" class="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Aplicar Embargo
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Setup form listeners
    setupCreateEmbargoForm();

  } catch (error) {
    console.error('Erro ao abrir modal de criar embargo:', error);
  }
}

function setupCreateEmbargoForm() {
  // Toggle categories section based on embargo type
  const embargoTypeRadios = document.querySelectorAll('input[name="embargo-type"]');
  const categoriesSection = document.getElementById('categories-section');

  embargoTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'partial') {
        categoriesSection.classList.remove('hidden');
      } else {
        categoriesSection.classList.add('hidden');
      }
    });
  });

  // Handle form submission
  const form = document.getElementById('create-embargo-form');
  if (form) {
    form.addEventListener('submit', handleCreateEmbargo);
  }
}

async function handleCreateEmbargo(event) {
  event.preventDefault();

  try {
    const formData = new FormData(event.target);
    const targetCountryId = document.getElementById('target-country').value;
    const embargoType = formData.get('embargo-type');
    const reason = document.getElementById('embargo-reason').value;
    const duration = document.getElementById('embargo-duration').value;

    if (!targetCountryId) {
      alert('Selecione um país alvo');
      return;
    }

    // Get blocked categories for partial embargo
    let blockedCategories = [];
    if (embargoType === 'partial') {
      const checkedCategories = document.querySelectorAll('input[name="blocked-categories"]:checked');
      blockedCategories = Array.from(checkedCategories).map(cb => cb.value);

      if (blockedCategories.length === 0) {
        alert('Selecione pelo menos uma categoria para embargo parcial');
        return;
      }
    }

    // Calculate expiration date
    let expiresAt = null;
    if (duration) {
      expiresAt = new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000);
    }

    // Create embargo data
    const embargoData = {
      target_country_id: targetCountryId,
      type: embargoType,
      categories_blocked: blockedCategories,
      reason: reason || 'Motivos diplomáticos',
      expires_at: expiresAt
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Aplicando...';
    submitBtn.disabled = true;

    // Apply embargo
    const result = await marketplaceSystem.applyEmbargo(embargoData);

    if (result.success) {
      alert('Embargo aplicado com sucesso!');
      closeCreateEmbargoModal();

      // Refresh marketplace offers to reflect new embargo
      const user = auth.currentUser;
      if (user) {
        const paisId = await checkPlayerCountry(user.uid);
        if (paisId) {
          const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
          loadMarketplaceOffers(activeCategory, paisId);
          updateEmbargoStatusIndicator(paisId);
        }
      }
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error('Erro ao aplicar embargo:', error);
    alert(`Erro ao aplicar embargo: ${error.message}`);

    // Restore button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Aplicar Embargo';
    submitBtn.disabled = false;
  }
}

function closeCreateEmbargoModal() {
  const modal = document.getElementById('create-embargo-modal');
  if (modal) {
    modal.remove();
  }
}

async function liftEmbargo(embargoId) {
  try {
    if (!confirm('Tem certeza que deseja suspender este embargo?')) {
      return;
    }

    await db.collection('marketplace_embargoes').doc(embargoId).update({
      status: 'lifted',
      updated_at: new Date()
    });

    alert('Embargo suspenso com sucesso!');

    // Refresh embargoes list
    const user = auth.currentUser;
    if (user) {
      const paisId = await checkPlayerCountry(user.uid);
      if (paisId) {
        await loadEmbargoesData(paisId);

        // Refresh marketplace offers
        const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
        loadMarketplaceOffers(activeCategory, paisId);
        updateEmbargoStatusIndicator(paisId);
      }
    }

  } catch (error) {
    console.error('Erro ao suspender embargo:', error);
    alert(`Erro ao suspender embargo: ${error.message}`);
  }
}

// Update embargo status indicator
async function updateEmbargoStatusIndicator(countryId) {
  try {
    const embargoInfo = await checkActiveEmbargoes(countryId);
    const statusIndicator = document.getElementById('embargo-status-indicator');
    const countBadge = document.getElementById('embargo-count-badge');

    if (!statusIndicator || !countBadge) return;

    if (embargoInfo.hasEmbargoes) {
      // Show status indicator
      const categoryText = embargoInfo.hasFullEmbargo
        ? 'todas as categorias'
        : `${embargoInfo.blockedCategories.length} categoria(s)`;

      statusIndicator.innerHTML = `
        <div class="flex items-center gap-2 text-red-400 text-sm">
          <span class="animate-pulse">⚠️</span>
          <span>${embargoInfo.totalEmbargoes} embargo(s) ativo(s) bloqueando ${categoryText}</span>
        </div>
      `;

      // Show count badge
      countBadge.textContent = embargoInfo.totalEmbargoes;
      countBadge.classList.remove('hidden');
    } else {
      // Hide indicators
      statusIndicator.innerHTML = `
        <div class="flex items-center gap-2 text-green-400 text-sm">
          <span>✅</span>
          <span>Nenhum embargo ativo</span>
        </div>
      `;

      countBadge.classList.add('hidden');
    }

  } catch (error) {
    console.error('Erro ao atualizar indicador de embargo:', error);
  }
}

// Advanced Filters System
function setupAdvancedFilters() {
  // Toggle advanced filters panel
  const toggleBtn = document.getElementById('toggle-advanced-filters');
  const panel = document.getElementById('advanced-filters-panel');
  const icon = document.getElementById('advanced-filters-icon');

  if (toggleBtn && panel && icon) {
    toggleBtn.addEventListener('click', () => {
      panel.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  }

  // Filter action buttons
  const applyBtn = document.getElementById('apply-filters-btn');
  const clearBtn = document.getElementById('clear-filters-btn');
  const saveBtn = document.getElementById('save-filters-btn');

  if (applyBtn) {
    applyBtn.addEventListener('click', applyAdvancedFilters);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllFilters);
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', saveCurrentFilters);
  }

  // Load saved filters on startup
  loadSavedFilters();
}

async function applyAdvancedFilters() {
  const user = auth.currentUser;
  if (!user) return;

  const paisId = await checkPlayerCountry(user.uid);
  if (!paisId) return;

  // Reset pagination when filters change
  resetPagination();

  const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category || 'all';
  await loadMarketplaceOffers(activeCategory, paisId);
}

function clearAllFilters() {
  // Clear all filter inputs
  document.getElementById('marketplace-search').value = '';
  document.getElementById('marketplace-sort').value = 'date';
  document.getElementById('marketplace-type').value = 'all';
  document.getElementById('price-min').value = '';
  document.getElementById('price-max').value = '';
  document.getElementById('quantity-min').value = '';
  document.getElementById('quantity-max').value = '';
  document.getElementById('country-filter').value = '';
  document.getElementById('time-filter').value = '';

  // Apply cleared filters
  applyAdvancedFilters();
}

function saveCurrentFilters() {
  const filters = {
    search: document.getElementById('marketplace-search').value,
    sort: document.getElementById('marketplace-sort').value,
    type: document.getElementById('marketplace-type').value,
    priceMin: document.getElementById('price-min').value,
    priceMax: document.getElementById('price-max').value,
    quantityMin: document.getElementById('quantity-min').value,
    quantityMax: document.getElementById('quantity-max').value,
    country: document.getElementById('country-filter').value,
    timeFilter: document.getElementById('time-filter').value
  };

  localStorage.setItem('marketplace-filters', JSON.stringify(filters));

  // Show feedback
  const saveBtn = document.getElementById('save-filters-btn');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = '✅ Salvo!';
  saveBtn.disabled = true;

  setTimeout(() => {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }, 2000);
}

function loadSavedFilters() {
  try {
    const savedFilters = localStorage.getItem('marketplace-filters');
    if (!savedFilters) return;

    const filters = JSON.parse(savedFilters);

    // Apply saved values to inputs
    if (filters.search) document.getElementById('marketplace-search').value = filters.search;
    if (filters.sort) document.getElementById('marketplace-sort').value = filters.sort;
    if (filters.type) document.getElementById('marketplace-type').value = filters.type;
    if (filters.priceMin) document.getElementById('price-min').value = filters.priceMin;
    if (filters.priceMax) document.getElementById('price-max').value = filters.priceMax;
    if (filters.quantityMin) document.getElementById('quantity-min').value = filters.quantityMin;
    if (filters.quantityMax) document.getElementById('quantity-max').value = filters.quantityMax;
    if (filters.country) document.getElementById('country-filter').value = filters.country;
    if (filters.timeFilter) document.getElementById('time-filter').value = filters.timeFilter;

  } catch (error) {
    console.error('Erro ao carregar filtros salvos:', error);
  }
}

async function loadCountriesForFilter() {
  try {
    const countriesSnapshot = await db.collection('paises').get();
    const countrySelect = document.getElementById('country-filter');

    if (!countrySelect) return;

    // Clear existing options (except "Todos os países")
    while (countrySelect.children.length > 1) {
      countrySelect.removeChild(countrySelect.lastChild);
    }

    // Add countries to select
    const countries = [];
    countriesSnapshot.forEach(doc => {
      const data = doc.data();
      countries.push({
        id: doc.id,
        name: data.Pais,
        flag: data.Flag || '🏳️'
      });
    });

    // Sort countries alphabetically
    countries.sort((a, b) => a.name.localeCompare(b.name));

    // Add options
    countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.id;
      option.textContent = `${country.flag} ${country.name}`;
      countrySelect.appendChild(option);
    });

  } catch (error) {
    console.error('Erro ao carregar países para filtro:', error);
  }
}

// Pagination and Infinite Scroll System
let currentPage = 1;
let isInfiniteScrollEnabled = false;
let isLoadingMore = false;
let lastLoadedFilters = null;

function setupPaginationListeners(countryId, category, filters) {
  const loadMoreBtn = document.getElementById('load-more-btn');
  const infiniteScrollToggle = document.getElementById('infinite-scroll-toggle');
  const infiniteScrollIcon = document.getElementById('infinite-scroll-icon');

  // Store current filters for pagination
  lastLoadedFilters = { ...filters, countryId, category };

  // Load more button
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      loadMoreOffers();
    });
  }

  // Infinite scroll toggle
  if (infiniteScrollToggle && infiniteScrollIcon) {
    infiniteScrollToggle.addEventListener('click', () => {
      isInfiniteScrollEnabled = !isInfiniteScrollEnabled;

      if (isInfiniteScrollEnabled) {
        infiniteScrollIcon.textContent = '♾️';
        infiniteScrollToggle.title = 'Carregamento automático ativado';
        setupInfiniteScroll();
      } else {
        infiniteScrollIcon.textContent = '🔄';
        infiniteScrollToggle.title = 'Carregamento automático desativado';
        removeInfiniteScroll();
      }

      // Save preference
      localStorage.setItem('marketplace-infinite-scroll', isInfiniteScrollEnabled);
    });

    // Load saved preference
    const savedPreference = localStorage.getItem('marketplace-infinite-scroll');
    if (savedPreference === 'true') {
      infiniteScrollToggle.click();
    }
  }
}

async function loadMoreOffers() {
  if (isLoadingMore || !lastLoadedFilters) return;

  isLoadingMore = true;
  const loadMoreBtn = document.getElementById('load-more-btn');
  const loadMoreState = document.getElementById('load-more-state');
  const offersGrid = document.getElementById('offers-grid');

  // Show loading state
  if (loadMoreBtn) loadMoreBtn.disabled = true;
  if (loadMoreState) loadMoreState.classList.remove('hidden');

  try {
    // Increment page and load more offers
    currentPage++;
    const nextFilters = {
      ...lastLoadedFilters,
      limit: 20, // Smaller batches for load more
      offset: (currentPage - 1) * 20
    };

    const result = await marketplaceSystem.getOffers(nextFilters);

    if (result.success && result.offers.length > 0) {
      // Append new offers to existing grid
      const newOffersHTML = result.offers.map(offer => renderOfferCard(offer)).join('');
      if (offersGrid) {
        offersGrid.innerHTML += newOffersHTML;
      }

      // Update results counter
      const currentCount = offersGrid?.children.length || 0;
      const resultsInfo = document.querySelector('.text-sm.text-slate-400');
      if (resultsInfo) {
        resultsInfo.textContent = `Mostrando ${currentCount} ofertas`;
      }

      // Check if there are more offers to load
      if (result.offers.length < 20) {
        // No more offers to load
        if (loadMoreBtn) {
          loadMoreBtn.textContent = '✅ Todas as ofertas carregadas';
          loadMoreBtn.disabled = true;
        }
      }
    } else {
      // No more offers
      if (loadMoreBtn) {
        loadMoreBtn.textContent = '✅ Todas as ofertas carregadas';
        loadMoreBtn.disabled = true;
      }
    }

  } catch (error) {
    console.error('Erro ao carregar mais ofertas:', error);
    if (loadMoreBtn) loadMoreBtn.disabled = false;
  } finally {
    isLoadingMore = false;
    if (loadMoreState) loadMoreState.classList.add('hidden');
  }
}

function setupInfiniteScroll() {
  // Remove existing listener if any
  removeInfiniteScroll();

  // Add scroll listener
  window.addEventListener('scroll', handleInfiniteScroll);
}

function removeInfiniteScroll() {
  window.removeEventListener('scroll', handleInfiniteScroll);
}

function handleInfiniteScroll() {
  if (!isInfiniteScrollEnabled || isLoadingMore) return;

  // Check if user scrolled near bottom
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.offsetHeight;
  const threshold = 200; // Load more when 200px from bottom

  if (scrollPosition >= documentHeight - threshold) {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn && !loadMoreBtn.disabled) {
      loadMoreOffers();
    }
  }
}

// Reset pagination when filters change
function resetPagination() {
  currentPage = 1;
  isLoadingMore = false;
  lastLoadedFilters = null;
}

// Favorites System
function getFavorites() {
  try {
    const favorites = localStorage.getItem('marketplace-favorites');
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem('marketplace-favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Erro ao salvar favoritos:', error);
  }
}

function isFavorite(offerId) {
  const favorites = getFavorites();
  return favorites.includes(offerId);
}

function toggleFavorite(offerId) {
  try {
    const favorites = getFavorites();
    const favoriteBtn = document.getElementById(`favorite-btn-${offerId}`);
    const favoriteIcon = document.getElementById(`favorite-icon-${offerId}`);

    if (isFavorite(offerId)) {
      // Remove from favorites
      const index = favorites.indexOf(offerId);
      if (index > -1) {
        favorites.splice(index, 1);
      }

      // Update UI
      if (favoriteBtn && favoriteIcon) {
        favoriteBtn.classList.remove('bg-yellow-500/20', 'text-yellow-400');
        favoriteBtn.classList.add('bg-slate-600/20', 'text-slate-400');
        favoriteBtn.title = 'Adicionar aos favoritos';
        favoriteIcon.textContent = '⭐';
      }

      // Show feedback
      showFavoriteNotification('❌ Removido dos favoritos');

      // If currently viewing favorites, remove the card
      const activeCategory = document.querySelector('.marketplace-category-btn.active')?.dataset.category;
      if (activeCategory === 'favorites') {
        const offerCard = favoriteBtn?.closest('.bg-bg-soft');
        if (offerCard) {
          offerCard.remove();
        }
      }

    } else {
      // Add to favorites
      favorites.push(offerId);

      // Update UI
      if (favoriteBtn && favoriteIcon) {
        favoriteBtn.classList.remove('bg-slate-600/20', 'text-slate-400');
        favoriteBtn.classList.add('bg-yellow-500/20', 'text-yellow-400');
        favoriteBtn.title = 'Remover dos favoritos';
        favoriteIcon.textContent = '🌟';
      }

      // Show feedback
      showFavoriteNotification('✅ Adicionado aos favoritos');
    }

    saveFavorites(favorites);

  } catch (error) {
    console.error('Erro ao alterar favorito:', error);
  }
}

function showFavoriteNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'fixed top-20 right-4 bg-bg-soft border border-brand-400/30 text-brand-400 px-4 py-2 rounded-lg shadow-lg z-50 transition-all transform translate-x-full';
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);

  // Animate out and remove
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 2000);
}

function updateFavoriteButtons(offers) {
  // Update favorite button states based on current favorites
  offers.forEach(offer => {
    const favoriteBtn = document.getElementById(`favorite-btn-${offer.id}`);
    const favoriteIcon = document.getElementById(`favorite-icon-${offer.id}`);

    if (favoriteBtn && favoriteIcon) {
      if (isFavorite(offer.id)) {
        favoriteBtn.classList.remove('bg-slate-600/20', 'text-slate-400');
        favoriteBtn.classList.add('bg-yellow-500/20', 'text-yellow-400');
        favoriteBtn.title = 'Remover dos favoritos';
        favoriteIcon.textContent = '🌟';
      } else {
        favoriteBtn.classList.remove('bg-yellow-500/20', 'text-yellow-400');
        favoriteBtn.classList.add('bg-slate-600/20', 'text-slate-400');
        favoriteBtn.title = 'Adicionar aos favoritos';
        favoriteIcon.textContent = '⭐';
      }
    }
  });
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}

export { initDashboard };