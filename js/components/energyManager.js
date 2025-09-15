/**
 * Sistema de Gestão de Energia - War 1954
 * Gerencia a matriz energética de um país, incluindo usinas, capacidade e demanda.
 */

import { db } from '../services/firebase.js';
import { showNotification, showConfirmBox, Logger } from '../utils.js';

// Configurações das Usinas
const POWER_PLANT_CONFIG = {
  termica_carvao: {
    name: 'Usina Térmica a Carvão',
    icon: '🏭',
    baseCost: 50000000, // 50M
    baseGeneration: 100, // MW
    baseMaintenance: 1000000, // 1M/turno
    techRequirement: 0,
    resourceConsumed: 'Carvao',
    efficiency: 0.8
  },
  termica_combustivel: {
    name: 'Usina Térmica a Combustível',
    icon: '🏭',
    baseCost: 75000000, // 75M
    baseGeneration: 150, // MW
    baseMaintenance: 2000000, // 2M/turno
    techRequirement: 20,
    resourceConsumed: 'Combustivel',
    efficiency: 1.0
  },
  hidreletrica: {
    name: 'Usina Hidrelétrica',
    icon: '🌊',
    baseCost: 200000000, // 200M
    baseGeneration: 300, // MW
    baseMaintenance: 500000, // 0.5M/turno
    techRequirement: 30,
    potentialRequirement: 'potencialHidreletrico' // Novo campo a ser adicionado nos países
  },
  nuclear: {
    name: 'Usina Nuclear',
    icon: '☢️',
    baseCost: 1000000000, // 1B
    baseGeneration: 1000, // MW
    baseMaintenance: 10000000, // 10M/turno
    techRequirement: 70,
    resourceConsumed: 'Uranio' // Recurso futuro
  }
};

class EnergyManager {
  constructor() {
    this.countryId = null;
    this.powerPlants = [];
    this.countryData = null;
  }

  async initialize(countryId) {
    this.countryId = countryId;
    if (!this.countryId) {
      this.renderEmpty();
      return;
    }

    Logger.info(`Inicializando EnergyManager para ${this.countryId}`);
    await this.loadPowerPlants();
    await this.loadCountryData();
    this.renderPanel();
  }

  async loadPowerPlants() {
    try {
      // Usinas estão no array power_plants do país
      if (this.countryData && this.countryData.power_plants) {
        this.powerPlants = this.countryData.power_plants;
      } else {
        this.powerPlants = [];
      }
      Logger.info(`${this.powerPlants.length} usinas carregadas para ${this.countryId}`);
    } catch (error) {
      Logger.error('Erro ao carregar usinas:', error);
      this.powerPlants = [];
    }
  }

  async loadCountryData() {
    try {
      const doc = await db.collection('paises').doc(this.countryId).get();
      if (doc.exists) {
        this.countryData = { id: doc.id, ...doc.data() };
      }
    } catch (error) {
      Logger.error('Erro ao carregar dados do país:', error);
    }
  }

  renderEmpty() {
    const panel = document.getElementById('panel-energia');
    if (!panel) return;
    panel.innerHTML = `
      <div class="text-center py-16 rounded-xl bg-bg-soft border border-bg-ring/70">
        <span class="text-slate-400 text-sm">Selecione um país na aba 'Gameplay' para gerenciar a energia.</span>
      </div>
    `;
  }

  renderPanel() {
    const panel = document.getElementById('panel-energia');
    if (!panel || !this.countryData) {
      this.renderEmpty();
      return;
    }

    panel.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Coluna de Status e Ações -->
        <div class="lg:col-span-1 space-y-6">
          ${this.renderStatusCard()}
          ${this.renderBuildCard()}
        </div>

        <!-- Coluna de Usinas -->
        <div class="lg:col-span-2">
          ${this.renderPlantsList()}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  renderStatusCard() {
    const { capacidade = 0, demanda = 0 } = this.countryData.Energia || {};
    const balance = capacidade - demanda;
    const balanceColor = balance >= 0 ? 'text-emerald-400' : 'text-red-400';

    return `
      <div class="rounded-xl border border-bg-ring/70 bg-bg-soft p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4">Balanço Energético</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-baseline">
            <span class="text-slate-400">Capacidade Total</span>
            <span class="text-2xl font-bold text-emerald-300">${Math.round(capacidade)} <span class="text-sm font-normal">MW</span></span>
          </div>
          <div class="flex justify-between items-baseline">
            <span class="text-slate-400">Demanda Estimada</span>
            <span class="text-2xl font-bold text-amber-300">${Math.round(demanda)} <span class="text-sm font-normal">MW</span></span>
          </div>
          <hr class="border-bg-ring/50">
          <div class="flex justify-between items-baseline">
            <span class="text-slate-300 font-semibold">Saldo</span>
            <span class="text-2xl font-bold ${balanceColor}">${balance >= 0 ? '+' : ''}${Math.round(balance)} <span class="text-sm font-normal">MW</span></span>
          </div>
        </div>
        <button id="btn-recalculate-energy" class="w-full mt-4 rounded-lg border border-bg-ring/70 px-3 py-1.5 text-sm hover:border-slate-500/60 hover:bg-white/5">Recalcular Balanço</button>
      </div>
    `;
  }

  renderBuildCard() {
    return `
      <div class="rounded-xl border border-bg-ring/70 bg-bg-soft p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4">Construir Nova Usina</h3>
        <div class="space-y-3">
          <select id="select-plant-type" class="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm">
            <option value="">-- Selecione o tipo --</option>
            ${Object.entries(POWER_PLANT_CONFIG).map(([key, config]) => `<option value="${key}">${config.icon} ${config.name}</option>`).join('')}
          </select>
          <button id="btn-build-plant" class="w-full rounded-lg bg-emerald-600 text-white font-semibold px-3 py-2 hover:bg-emerald-500 transition-colors" disabled>Construir</button>
        </div>
        <div id="plant-info-preview" class="mt-4 text-xs text-slate-400"></div>
      </div>
    `;
  }

  renderPlantsList() {
    let plantListHTML = this.powerPlants.map(plant => this.renderPlantItem(plant)).join('');

    if (this.powerPlants.length === 0) {
      plantListHTML = `<div class="text-center py-12 text-slate-500">Nenhuma usina construída.</div>`;
    }

    return `
      <div class="rounded-xl border border-bg-ring/70 bg-bg-soft p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4">Matriz Energética Nacional</h3>
        <div id="power-plant-list" class="space-y-3">
          ${plantListHTML}
        </div>
      </div>
    `;
  }

  renderPlantItem(plant) {
    // Mapear os IDs das usinas para os configs
    const typeToConfigMap = {
      'THERMAL_COAL': 'termica_carvao',
      'THERMAL_FUEL': 'termica_combustivel',
      'HYDROELECTRIC': 'hidreletrica',
      'NUCLEAR': 'nuclear'
    };

    const configType = typeToConfigMap[plant.id] || typeToConfigMap[plant.type];
    const config = POWER_PLANT_CONFIG[configType];

    if (!config) {
      Logger.warn(`Config não encontrado para usina tipo: ${plant.id || plant.type}`);
      return '';
    }

    return `
      <div class="rounded-lg bg-slate-800/40 p-4 border border-slate-600/50 flex items-center gap-4">
        <div class="text-3xl">${config.icon}</div>
        <div class="flex-1">
          <div class="font-semibold text-slate-200">${config.name} (Nível ${plant.level || 1})</div>
          <div class="text-sm text-slate-400">Geração: ${plant.generation || config.baseGeneration} MW</div>
          <div class="text-xs text-slate-500">Construída no turno ${plant.built_turn || '?'}</div>
        </div>
        <div>
          <button class="btn-upgrade-plant text-sm text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded border border-emerald-500/30" data-plant-id="${plant.id}">Aprimorar</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const panel = document.getElementById('panel-energia');
    if (!panel) return;

    // Recalcular balanço energético
    const recalcBtn = panel.querySelector('#btn-recalculate-energy');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', () => this.recalculateEnergyBalance());
    }

    // Seletor de tipo de usina
    const plantTypeSelect = panel.querySelector('#select-plant-type');
    if (plantTypeSelect) {
      plantTypeSelect.addEventListener('change', (e) => this.updatePlantPreview(e.target.value));
    }

    // Botão de construir usina
    const buildBtn = panel.querySelector('#btn-build-plant');
    if (buildBtn) {
      buildBtn.addEventListener('click', () => this.buildPowerPlant());
    }

    // Botões de aprimorar usinas
    panel.addEventListener('click', (e) => {
      if (e.target.matches('.btn-upgrade-plant')) {
        const plantId = e.target.dataset.plantId;
        this.upgradePowerPlant(plantId);
      }
    });
  }

  async recalculateEnergyBalance() {
    if (!this.countryData) return;

    try {
      // Usar o cálculo de demanda do EconomicCalculations
      const { default: EconomicCalculations } = await import('../systems/economicCalculations.js');

      const demandData = EconomicCalculations.computeEnergyDemandGW(this.countryData);
      const energyProduction = EconomicCalculations.calculateEnergyProduction(
        this.countryData,
        {
          Carvao: this.countryData.CarvaoSaldo || 0,
          Combustivel: this.countryData.Combustivel || 0,
          Uranio: this.countryData.Uranio || 0
        }
      );

      // Atualizar no Firebase
      await db.collection('paises').doc(this.countryId).update({
        'Energia.capacidade': energyProduction.totalProduction,
        'Energia.demanda': demandData.demandaGW,
        EnergiaCapacidade: energyProduction.totalProduction
      });

      // Atualizar dados locais
      this.countryData.Energia = {
        capacidade: energyProduction.totalProduction,
        demanda: demandData.demandaGW
      };
      this.countryData.EnergiaCapacidade = energyProduction.totalProduction;

      // Re-renderizar
      this.renderPanel();
      showNotification('success', 'Balanço energético recalculado!');

    } catch (error) {
      Logger.error('Erro ao recalcular energia:', error);
      showNotification('error', 'Erro ao recalcular energia');
    }
  }

  updatePlantPreview(plantType) {
    const preview = document.getElementById('plant-info-preview');
    const buildBtn = document.getElementById('btn-build-plant');

    if (!plantType || !preview || !buildBtn) return;

    const config = POWER_PLANT_CONFIG[plantType];
    if (!config) return;

    const canAfford = (this.countryData.PIB || 0) >= config.baseCost;
    const hasTech = (this.countryData.Tecnologia || 0) >= config.techRequirement;

    let requirements = [];
    if (!canAfford) requirements.push(`PIB: ${this.formatCurrency(config.baseCost)}`);
    if (!hasTech) requirements.push(`Tecnologia: ${config.techRequirement}%`);

    if (config.potentialRequirement && !this.countryData[config.potentialRequirement]) {
      requirements.push('Potencial geográfico insuficiente');
    }

    preview.innerHTML = `
      <div class="text-slate-300 mb-1">${config.name}</div>
      <div class="text-emerald-400">⚡ ${config.baseGeneration} MW</div>
      <div class="text-amber-400">💰 ${this.formatCurrency(config.baseCost)}</div>
      <div class="text-blue-400">🔬 Tech: ${config.techRequirement}%</div>
      ${requirements.length > 0 ? `<div class="text-red-400 mt-1">❌ ${requirements.join(', ')}</div>` : ''}
    `;

    buildBtn.disabled = requirements.length > 0;
  }

  async buildPowerPlant() {
    const plantType = document.getElementById('select-plant-type')?.value;
    if (!plantType) return;

    const config = POWER_PLANT_CONFIG[plantType];
    if (!config) return;

    try {
      // Mapear tipos para compatibilidade com o sistema existente
      const typeMapping = {
        'termica_carvao': 'THERMAL_COAL',
        'termica_combustivel': 'THERMAL_FUEL',
        'hidreletrica': 'HYDROELECTRIC',
        'nuclear': 'NUCLEAR'
      };

      const mappedType = typeMapping[plantType];
      if (!mappedType) {
        showNotification('error', 'Tipo de usina não suportado');
        return;
      }

      // Construir usina diretamente
      await this.constructPowerPlant(mappedType, config);

    } catch (error) {
      Logger.error('Erro ao construir usina:', error);
      showNotification('error', 'Erro ao construir usina');
    }
  }

  async constructPowerPlant(plantTypeId, config) {
    try {
      // Verificações
      if (this.countryData.PIB < config.baseCost) {
        showNotification('error', `PIB insuficiente. Necessário: ${this.formatCurrency(config.baseCost)}`);
        return;
      }

      if (this.countryData.Tecnologia < config.techRequirement) {
        showNotification('error', `Tecnologia insuficiente. Necessário: ${config.techRequirement}%`);
        return;
      }

      // Verificar potencial para hidrelétricas
      if (config.potentialRequirement && (!this.countryData[config.potentialRequirement] || this.countryData[config.potentialRequirement] <= 0)) {
        showNotification('error', 'Potencial geográfico insuficiente');
        return;
      }

      // Transação atômica
      await db.runTransaction(async (transaction) => {
        const countryRef = db.collection('paises').doc(this.countryId);
        const doc = await transaction.get(countryRef);
        const data = doc.data();

        const updates = {
          PIB: data.PIB - config.baseCost,
          power_plants: [...(data.power_plants || []), {
            id: plantTypeId,
            type: plantTypeId,
            generation: config.baseGeneration,
            level: 1,
            built_turn: parseInt(document.getElementById('turno-atual-admin')?.textContent?.replace('#', '')) || 1
          }]
        };

        // Decrementar potencial se aplicável
        if (config.potentialRequirement) {
          updates[config.potentialRequirement] = data[config.potentialRequirement] - 1;
        }

        transaction.update(countryRef, updates);
      });

      showNotification('success', `${config.name} construída com sucesso!`);

      // Recarregar dados
      await this.loadCountryData();
      this.renderPanel();
      await this.recalculateEnergyBalance();

    } catch (error) {
      Logger.error('Erro na construção:', error);
      showNotification('error', 'Erro ao construir usina');
    }
  }

  async upgradePowerPlant(plantId) {
    showNotification('info', 'Sistema de upgrade em desenvolvimento');
    // TODO: Implementar upgrade de usinas
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}

export { EnergyManager };
