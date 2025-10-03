/**
 * Sistema Econômico Completo - War 1954
 * Simulação estratégica de investimentos econômicos com mecânicas anti-exploit
 */

import { auth, db, getAllCountries } from '../services/firebase.js';
import { showNotification, Logger } from '../utils.js';
import EconomicCalculations from './economicCalculations.js';
import economicDependency from './economicDependency.js';
import economicFeedback from './economicFeedback.js';
import { calculateBudgetFromPIB, formatCurrency, formatPIBPerCapita } from '../utils/pibCalculations.js';
import { POWER_PLANTS } from '../data/power_plants.js';

// Configurações do Sistema Econômico
const ECONOMIC_CONFIG = {
  maxInternalActions: 10,
  maxExternalActions: 3,
  
  // Tipos de ação disponíveis
  actionTypes: {
    infrastructure: {
      id: 'infrastructure',
      name: '🏗️ Infraestrutura',
      multiplier: 1.3, // Atualizado
      description: 'Estradas, energia, telecomunicações',
      bonusCondition: 'urbanization > 50',
      bonusValue: 0.4, // Atualizado
      examples: ['Construção de rodovias', 'Expansão da rede elétrica', 'Fibra óptica nacional']
    },
    
    research: {
      id: 'research',
      name: '🔬 Pesquisa & Desenvolvimento',
      multiplier: 1.8, // Atualizado
      description: 'Universidades, inovação científica',
      bonusCondition: 'technology > 60',
      bonusValue: 0.5, // Atualizado
      examples: ['Centros de pesquisa', 'Universidades tecnológicas', 'Programas de inovação']
    },
    
    industry: {
      id: 'industry',
      name: '🏭 Desenvolvimento Industrial',
      multiplier: 1.6, // Atualizado
      description: 'Fábricas, refinarias',
      bonusValue: 0.5, // Atualizado
      penaltyCondition: 'stability < 40',
      penaltyValue: 0.15, // Atualizado
      examples: ['Complexos industriais', 'Refinarias de petróleo', 'Siderúrgicas']
    },
    
    exploration: {
      id: 'exploration',
      name: '⛏️ Exploração de Recursos',
      multiplier: 0.8, // Menor retorno de PIB, mas adiciona recursos físicos
      description: 'Exploração mineral e de recursos primários. Gera menos crescimento econômico que outras ações, mas adiciona recursos ao estoque do país.',
      examples: ['Exploração de jazidas', 'Perfuração de poços', 'Mineração']
    },

    social: {
      id: 'social',
      name: '🏥 Investimento Social',
      multiplier: 1.1, // Atualizado
      description: 'Saúde, educação, habitação',
      stabilityBonus: 1, // +1 ponto de estabilidade por ação bem-sucedida
      examples: ['Hospitais públicos', 'Escolas técnicas', 'Programas habitacionais']
    }
  },

  // Cadeias Produtivas - Sinergias entre tipos de ação
  productiveChains: {
    'infrastructure+industry': {
      name: 'Infraestrutura + Indústria',
      bonus: 0.15,
      effect: 'Elimina penalidade de estabilidade se < 50',
      description: 'Infraestrutura potencializa desenvolvimento industrial'
    },
    
    'research+industry': {
      name: 'P&D + Indústria',
      bonus: 0.10,
      effect: '+1 ponto adicional de tecnologia',
      description: 'Inovação acelera crescimento industrial'
    },
    
    'research+social': {
      name: 'P&D + Social',
      socialBonus: 0.20,
      effect: '+1 ponto adicional de tecnologia',
      description: 'Pesquisa melhora políticas sociais'
    }
  }
};

// Classe principal do Sistema Econômico (expandida para Turn Management Panel)
class EconomicSimulator {
  constructor() {
    this.countries = [];
    this.selectedCountry = null;
    this.currentBudget = 0;
    this.actions = {
      internal: [],
      external: []
    };
    this.economicHistory = new Map(); // Histórico por país

    // Novos campos para gestão de turno completa
    this.changes = {
      technology: {}, // { Tecnologia: delta, Aeronautica: delta, ... }
      indicators: {}  // { Estabilidade: delta, Burocracia: delta, ... }
    };
  }

  // Inicializar o sistema
  async initialize() {
    try {
      Logger.info('Inicializando Sistema Econômico...');
      await this.loadCountries();
      await this.loadEconomicHistory();
      this.setupEventListeners();
      Logger.info('Sistema Econômico inicializado com sucesso');
    } catch (error) {
      Logger.error('Erro ao inicializar Sistema Econômico:', error);
      throw error;
    }
  }

  // Carregar países do Firebase
    async loadCountries() {
    try {
      this.countries = await getAllCountries(); // Usar a função centralizada
      
      // Ordenar por nome
      this.countries.sort((a, b) => (a.Pais || '').localeCompare(b.Pais || ''));
      Logger.info(`${this.countries.length} países carregados`);
    } catch (error) {
      Logger.error('Erro ao carregar países no EconomicSimulator:', error);
      throw error;
    }
  }

  // Carregar histórico econômico
  async loadEconomicHistory() {
    try {
      const snapshot = await db.collection('economic_history').get();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const countryId = data.countryId;
        
        if (!this.economicHistory.has(countryId)) {
          this.economicHistory.set(countryId, []);
        }
        
        this.economicHistory.get(countryId).push({
          turn: data.turn,
          totalInvestment: data.totalInvestment,
          externalInvestments: data.externalInvestments || {},
          results: data.results
        });
      });
      
      Logger.info('Histórico econômico carregado');
    } catch (error) {
      Logger.warn('Erro ao carregar histórico econômico:', error);
      // Não é crítico, continuar sem histórico
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    const economicButton = document.getElementById('economic-simulator');
    if (economicButton) {
      economicButton.addEventListener('click', () => this.showModal());
    }
  }

  // Mostrar modal do simulador
  showModal() {
    if (!this.selectedCountry) {
      // Usar país selecionado no narrador ou primeiro da lista
      const narratorCountry = document.getElementById('select-pais')?.value;
      this.selectedCountry = narratorCountry || (this.countries.length > 0 ? this.countries[0].id : null);
    }

    if (!this.selectedCountry) {
      showNotification('warning', 'Nenhum país disponível');
      return;
    }

    this.createModal();
  }

  // Criar interface do modal
  createModal() {
    const country = this.getCountryById(this.selectedCountry);
    if (!country) return;

    this.currentBudget = this.calculateBudget(country);

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.id = 'economic-simulator-modal';

    const content = document.createElement('div');
    content.className = 'bg-slate-800 border border-slate-600/70 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col';

    content.innerHTML = `
      ${this.createModalHeader(country)}
      ${this.createModalTabs()}
      ${this.createModalContent(country)}
      ${this.createModalFooter()}
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Setup dos event listeners do modal
    this.setupModalEventListeners();

    // Focar no primeiro campo
    setTimeout(() => {
      const firstInput = modal.querySelector('input[type="number"]');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  // Cabeçalho do modal
  createModalHeader(country) {
    const budgetFormatted = this.formatCurrency(this.currentBudget);
    
    return `
      <div class="flex items-center justify-between p-6 border-b border-slate-600/50">
        <div class="flex items-center gap-4">
          <div class="text-2xl">💰</div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Painel de Gestão de Turno</h2>
            <p class="text-sm text-slate-400">Controle completo de economia, tecnologia, recursos e indicadores</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="text-sm text-slate-400">País Selecionado</div>
            <select id="modal-country-select" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-slate-200">
              ${this.countries.map(c => `
                <option value="${c.id}" ${c.id === this.selectedCountry ? 'selected' : ''}>
                  ${c.Pais || c.id}
                </option>
              `).join('')}
            </select>
          </div>

          <div class="text-right">
            <div class="text-sm text-slate-400">Política Industrial</div>
            <select id="modal-industrial-policy" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-slate-200">
              <option value="combustivel" ${((country.PoliticaIndustrial || country.Politica) || 'combustivel') === 'combustivel' ? 'selected' : ''}>Combustível</option>
              <option value="carvao" ${((country.PoliticaIndustrial || country.Politica) || 'combustivel') === 'carvao' ? 'selected' : ''}>Carvão</option>
            </select>
          </div>

          <div class="text-right">
            <div class="text-sm text-slate-400">Orçamento Disponível</div>
            <div class="text-lg font-semibold text-emerald-400">${budgetFormatted}</div>
          </div>

          <button id="close-economic-modal" class="text-slate-400 hover:text-slate-200 text-2xl">
            ×
          </button>
        </div>
      </div>
    `;
  }

  // Abas do modal
  createModalTabs() {
    return `
      <div class="flex border-b border-slate-600/50 overflow-x-auto">
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-purple-500 text-purple-400 bg-slate-700/30 whitespace-nowrap" data-tab="internal">
          💰 Economia
        </button>
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 whitespace-nowrap" data-tab="technology">
          🔬 Tecnologia
        </button>
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 whitespace-nowrap" data-tab="indicators">
          📊 Indicadores
        </button>
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 whitespace-nowrap" data-tab="summary">
          ✅ Resumo
        </button>
      </div>
    `;
  }

  // Conteúdo principal do modal
  createModalContent(country) {
    return `
      <div class="flex-1 overflow-y-auto">
        <!-- Tab Economia (Ações Internas/Externas) -->
        <div id="economic-tab-internal" class="economic-tab-content p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-200 mb-2">💰 Sistema Econômico</h3>
            <p class="text-sm text-slate-400">Gestão de investimentos internos e externos</p>
          </div>

          <!-- Sub-tabs para Internal/External -->
          <div class="flex gap-2 mb-4">
            <button class="economy-subtab px-4 py-2 rounded-lg bg-purple-600 text-white text-sm" data-subtab="internal">
              🏠 Investimentos Internos (0/${ECONOMIC_CONFIG.maxInternalActions})
            </button>
            <button class="economy-subtab px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600" data-subtab="external">
              🌍 Investimentos Externos (0/${ECONOMIC_CONFIG.maxExternalActions})
            </button>
          </div>

          <!-- Ações Internas -->
          <div id="economy-subtab-internal" class="economy-subtab-content">
            <div id="internal-actions-container" class="space-y-4">
              ${this.createActionSlots('internal')}
            </div>

            <div class="mt-6">
              <button id="add-internal-action" class="w-full border-2 border-dashed border-slate-600 rounded-lg py-8 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors">
                + Adicionar Ação Interna
              </button>
            </div>
          </div>

          <!-- Ações Externas -->
          <div id="economy-subtab-external" class="economy-subtab-content hidden">
            <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div class="flex items-start gap-3">
                <div class="text-yellow-400">⚠️</div>
                <div>
                  <div class="text-yellow-200 font-medium mb-1">Atenção: Investimentos Externos</div>
                  <div class="text-yellow-100 text-sm">
                    • Grandes investimentos podem criar dependência econômica<br>
                    • Países instáveis podem rejeitar ajuda externa<br>
                    • Benefícios são divididos 50/50 entre os países
                  </div>
                </div>
              </div>
            </div>

            <div id="external-actions-container" class="space-y-4">
              ${this.createActionSlots('external')}
            </div>

            <div class="mt-6">
              <button id="add-external-action" class="w-full border-2 border-dashed border-slate-600 rounded-lg py-8 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors">
                + Adicionar Ação Externa
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Tecnologia -->
        <div id="economic-tab-technology" class="economic-tab-content hidden p-6">
          ${this.createTechnologyTab(country)}
        </div>

        <!-- Tab Indicadores -->
        <div id="economic-tab-indicators" class="economic-tab-content hidden p-6">
          ${this.createIndicatorsTab(country)}
        </div>

        <!-- Tab Resumo -->
        <div id="economic-tab-summary" class="economic-tab-content hidden p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-200 mb-2">✅ Resumo do Turno</h3>
            <p class="text-sm text-slate-400">Análise final antes de aplicar as mudanças</p>
          </div>

          <div id="economic-summary-content">
            <!-- Será preenchido dinamicamente -->
          </div>
        </div>
      </div>
    `;
  }

  // Tab de Tecnologia
  createTechnologyTab(country) {
    const techs = {
      Tecnologia: { label: 'Tecnologia Civil', current: parseFloat(country.Tecnologia) || 0 },
      Aeronautica: { label: 'Aeronáutica', current: parseFloat(country.Aeronautica) || 0 },
      Marinha: { label: 'Marinha', current: parseFloat(country.Marinha) || 0 },
      Veiculos: { label: 'Veículos', current: parseFloat(country.Veiculos) || 0 },
      Exercito: { label: 'Exército', current: parseFloat(country.Exercito) || 0 }
    };

    return `
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-slate-200 mb-2">🔬 Ajustes de Tecnologia</h3>
        <p class="text-sm text-slate-400">Adicionar ou subtrair pontos de tecnologia (sem limite superior)</p>
      </div>

      <div class="space-y-4">
        ${Object.entries(techs).map(([key, tech]) => `
          <div class="border border-slate-600/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-slate-200">${tech.label}</label>
              <div class="text-sm text-slate-400">Atual: <span class="text-slate-200 font-semibold">${tech.current}</span></div>
            </div>

            <div class="flex items-center gap-3">
              <button class="tech-decrement px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-lg" data-field="${key}">−</button>
              <input type="number"
                     class="tech-input flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-center"
                     data-field="${key}"
                     placeholder="0"
                     value="${this.changes.technology[key] || 0}">
              <button class="tech-increment px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-lg" data-field="${key}">+</button>
              <div class="text-sm text-slate-300 min-w-[80px] text-right">
                → <span class="font-semibold tech-preview" data-field="${key}">${tech.current + (this.changes.technology[key] || 0)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Tab de Indicadores
  createIndicatorsTab(country) {
    const indicators = {
      Estabilidade: { label: 'Estabilidade', current: parseFloat(country.Estabilidade) || 0, min: 0, max: 100 },
      Burocracia: { label: 'Burocracia', current: parseFloat(country.Burocracia) || 0, min: 0, max: 100 },
      Urbanizacao: { label: 'Urbanização', current: parseFloat(country.Urbanizacao) || 0, min: 0, max: 100 },
      IndustrialEfficiency: { label: 'Eficiência Industrial', current: parseFloat(country.IndustrialEfficiency) || 0, min: 0, max: 100 }
    };

    return `
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-slate-200 mb-2">📊 Indicadores Nacionais</h3>
        <p class="text-sm text-slate-400">Ajustar indicadores percentuais (0-100%)</p>
      </div>

      <div class="mb-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div class="text-blue-200 text-sm">
          <strong>População:</strong> ${(parseFloat(country.Populacao) || 0).toLocaleString('pt-BR')} habitantes (somente leitura)
        </div>
      </div>

      <div class="space-y-4">
        ${Object.entries(indicators).map(([key, ind]) => `
          <div class="border border-slate-600/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-slate-200">${ind.label}</label>
              <div class="text-sm text-slate-400">Atual: <span class="text-slate-200 font-semibold">${ind.current}%</span></div>
            </div>

            <div class="flex items-center gap-3">
              <button class="indicator-decrement px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-lg" data-field="${key}">−</button>
              <input type="number"
                     class="indicator-input flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-center"
                     data-field="${key}"
                     placeholder="0"
                     min="${ind.min - ind.current}"
                     max="${ind.max - ind.current}"
                     value="${this.changes.indicators[key] || 0}">
              <button class="indicator-increment px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-lg" data-field="${key}">+</button>
              <div class="text-sm text-slate-300 min-w-[80px] text-right">
                → <span class="font-semibold indicator-preview" data-field="${key}">
                  ${Math.min(ind.max, Math.max(ind.min, ind.current + (this.changes.indicators[key] || 0)))}%
                </span>
              </div>
            </div>

            <!-- Barra de progresso -->
            <div class="mt-2 w-full bg-slate-700 rounded-full h-2">
              <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                   style="width: ${Math.min(ind.max, Math.max(ind.min, ind.current + (this.changes.indicators[key] || 0)))}%">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Rodapé do modal
  createModalFooter() {
    return `
      <div class="border-t border-slate-600/50 p-6 bg-slate-800/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="text-sm text-slate-400">
              Orçamento Usado: <span id="budget-used" class="text-slate-200 font-medium">$0</span> / ${this.formatCurrency(this.currentBudget)}
            </div>
            <div class="w-64 bg-slate-700 rounded-full h-2">
              <div id="budget-bar" class="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full transition-all" style="width: 0%"></div>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button id="reset-economic-actions" class="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors">
              🔄 Resetar
            </button>
            <button id="apply-economic-actions" class="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              ⚡ Aplicar Investimentos
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Criar slots de ação
  createActionSlots(type) {
    const maxSlots = type === 'internal' ? ECONOMIC_CONFIG.maxInternalActions : ECONOMIC_CONFIG.maxExternalActions;
    const actions = this.actions[type];
    
    let html = '';
    
    // Slots existentes
    for (let i = 0; i < actions.length; i++) {
      html += this.createActionSlot(type, i, actions[i]);
    }
    
    // Slot vazio se ainda há espaço
    if (actions.length < maxSlots) {
      html += this.createActionSlot(type, actions.length, null);
    }
    
    return html;
  }

  // Criar um slot individual de ação
  createActionSlot(type, index, action = null) {
    const isExternal = type === 'external';
    const isExploration = action?.type === 'exploration';
    const actionTypes = ECONOMIC_CONFIG.actionTypes;

    return `
      <div class="action-slot border border-slate-600/50 rounded-lg p-4" data-type="${type}" data-index="${index}">
        <div class="grid grid-cols-1 md:grid-cols-${isExternal ? '6' : '5'} gap-4 items-end">

          <!-- Tipo de Ação -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Tipo de Ação</label>
            <select class="action-type w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              ${Object.values(actionTypes).map(type => `
                <option value="${type.id}" ${action?.type === type.id ? 'selected' : ''}>
                  ${type.name}
                </option>
              `).join('')}
            </select>
          </div>

          ${isExternal ? `
          <!-- País Destino -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">País Destino</label>
            <select class="target-country w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              ${this.countries.filter(c => c.id !== this.selectedCountry).map(c => `
                <option value="${c.id}" ${action?.targetCountry === c.id ? 'selected' : ''}>
                  ${c.Pais || c.id}
                </option>
              `).join('')}
            </select>
          </div>
          ` : ''}

          <!-- Tipo de Recurso (apenas para exploration) -->
          <div class="resource-type-selector ${isExploration ? '' : 'hidden'}">
            <label class="block text-xs text-slate-400 mb-1">Tipo de Recurso</label>
            <select class="resource-type w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              <option value="Combustivel" ${action?.resourceType === 'Combustivel' ? 'selected' : ''}>🛢️ Combustível (Petróleo)</option>
              <option value="Carvao" ${action?.resourceType === 'Carvao' ? 'selected' : ''}>⚫ Carvão</option>
              <option value="Metais" ${action?.resourceType === 'Metais' ? 'selected' : ''}>⛏️ Metais</option>
            </select>
          </div>

          <!-- Valor Investido -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Valor (milhões)</label>
            <input type="number" class="action-value w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200"
                   placeholder="0" min="0" step="10" value="${action?.value || ''}">
          </div>

          <!-- Resultado do Dado -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Dado D12</label>
            <input type="number" class="action-dice w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200"
                   placeholder="1-12" min="1" max="12" value="${action?.dice || ''}">
          </div>

          <!-- Buff/Debuff -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Buff/Debuff (%)</label>
            <input type="range" class="action-buff w-full" min="-3" max="3" step="0.5" value="${action?.buff || 0}">
            <div class="text-xs text-center text-slate-300 mt-1"><span class="buff-value">${action?.buff || 0}</span>%</div>
          </div>

          <!-- Preview e Ações -->
          <div class="flex flex-col gap-2">
            <div class="growth-preview text-xs text-center px-2 py-1 rounded bg-slate-700 text-slate-300">
              +0.0%
            </div>
            <button class="remove-action text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10">
              🗑️ Remover
            </button>
          </div>

        </div>

        <!-- Descrição do Tipo -->
        <div class="action-description mt-3 p-3 bg-slate-700/30 rounded-lg hidden">
          <div class="text-sm text-slate-300"></div>
        </div>

        <!-- Preview de Extração (apenas para exploration) -->
        <div class="extraction-preview mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg ${isExploration ? '' : 'hidden'}">
          <div class="text-xs text-emerald-300">
            <strong>Extração Estimada:</strong> <span class="extraction-amount">Aguardando dados...</span>
          </div>
        </div>
      </div>
    `;
  }

  // Configurar event listeners do modal
  setupModalEventListeners() {
    const modal = document.getElementById('economic-simulator-modal');
    if (!modal) return;

    // Fechar modal
    modal.querySelector('#close-economic-modal').addEventListener('click', () => {
      modal.remove();
    });

    // Fechar modal clicando fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Troca de país
    modal.querySelector('#modal-country-select').addEventListener('change', (e) => {
      this.selectedCountry = e.target.value;
      this.resetActions();
      modal.remove();
      this.showModal(); // Recriar modal com novo país
    });

    // Política industrial selector - atualizar objeto país em memória
    const policySelect = modal.querySelector('#modal-industrial-policy');
    if (policySelect) {
      policySelect.addEventListener('change', (e) => {
        const countryObj = this.getCountryById(this.selectedCountry);
        if (countryObj) {
          countryObj.PoliticaIndustrial = e.target.value;
          // Persistir imediatamente para refletir no painel
          try {
            db.collection('paises').doc(this.selectedCountry).update({ PoliticaIndustrial: e.target.value });
          } catch (err) {
            console.warn('Erro ao salvar PoliticaIndustrial:', err);
          }
        }
      });
    }

    // Troca de abas
    modal.querySelectorAll('.economic-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Adicionar ações
    modal.querySelector('#add-internal-action')?.addEventListener('click', () => {
      this.addAction('internal');
    });

    modal.querySelector('#add-external-action')?.addEventListener('click', () => {
      this.addAction('external');
    });

    // Resetar ações
    modal.querySelector('#reset-economic-actions')?.addEventListener('click', () => {
      this.resetActions();
    });

    // Aplicar ações
    modal.querySelector('#apply-economic-actions')?.addEventListener('click', () => {
      this.applyEconomicActions();
    });

    // Event listeners dos campos de ação
    this.setupActionFieldListeners();
  }

  // Event listeners para os campos das ações
  setupActionFieldListeners() {
    const modal = document.getElementById('economic-simulator-modal');
    if (!modal) return;

    // Delegate events para campos dinâmicos
    modal.addEventListener('input', (e) => {
      if (e.target.matches('.action-type, .target-country, .action-value, .action-dice, .action-buff, .resource-type')) {
        const slot = e.target.closest('.action-slot');
        const type = slot.dataset.type;
        const index = parseInt(slot.dataset.index);

        this.updateActionFromSlot(type, index, slot);
        this.updatePreview(slot);
        this.updateBudgetBar();
        this.updateSummary();
      }
    });

    // Remover ações
    modal.addEventListener('click', (e) => {
      if (e.target.matches('.remove-action')) {
        const slot = e.target.closest('.action-slot');
        const type = slot.dataset.type;
        const index = parseInt(slot.dataset.index);

        this.removeAction(type, index);
      }
    });

    // Mostrar/esconder descrições e seletor de recurso
    modal.addEventListener('change', (e) => {
      if (e.target.matches('.action-type')) {
        this.toggleActionDescription(e.target);
        this.toggleResourceSelector(e.target);
      }
    });

    // === NOVOS EVENT LISTENERS PARA TABS DE GESTÃO ===

    // Sub-tabs da economia (internal/external)
    modal.querySelectorAll('.economy-subtab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subtab = e.target.dataset.subtab;
        this.switchEconomySubtab(subtab);
      });
    });

    // Tecnologia: botões de incremento/decremento
    modal.addEventListener('click', (e) => {
      if (e.target.matches('.tech-increment')) {
        const field = e.target.dataset.field;
        this.adjustTechnology(field, 1);
      } else if (e.target.matches('.tech-decrement')) {
        const field = e.target.dataset.field;
        this.adjustTechnology(field, -1);
      }
    });

    // Tecnologia: input manual
    modal.addEventListener('input', (e) => {
      if (e.target.matches('.tech-input')) {
        const field = e.target.dataset.field;
        const value = parseInt(e.target.value) || 0;
        this.changes.technology[field] = value;
        this.updateTechPreview(field);
        this.updateSummary();
      }
    });


    // Indicadores: botões de incremento/decremento
    modal.addEventListener('click', (e) => {
      if (e.target.matches('.indicator-increment')) {
        const field = e.target.dataset.field;
        this.adjustIndicator(field, 1);
      } else if (e.target.matches('.indicator-decrement')) {
        const field = e.target.dataset.field;
        this.adjustIndicator(field, -1);
      }
    });

    // Indicadores: input manual
    modal.addEventListener('input', (e) => {
      if (e.target.matches('.indicator-input')) {
        const field = e.target.dataset.field;
        const value = parseFloat(e.target.value) || 0;
        this.changes.indicators[field] = value;
        this.updateIndicatorPreview(field);
        this.updateSummary();
      }
    });
  }

  // Utilitários
  calculateBudget(country) {
    return calculateBudgetFromPIB(country);
  }

  formatCurrency(value) {
    return formatCurrency(value);
  }

  getCountryById(id) {
    return this.countries.find(c => c.id === id);
  }

  // Métodos de interface
  switchTab(tabId) {
    const modal = document.getElementById('economic-simulator-modal');
    if (!modal) return;

    // Atualizar abas
    modal.querySelectorAll('.economic-tab').forEach(tab => {
      tab.classList.remove('border-purple-500', 'text-purple-400', 'bg-slate-700/30');
      tab.classList.add('border-transparent', 'text-slate-400');
    });

    modal.querySelectorAll('.economic-tab-content').forEach(content => {
      content.classList.add('hidden');
    });

    // Ativar aba selecionada
    const activeTab = modal.querySelector(`[data-tab="${tabId}"]`);
    const activeContent = modal.querySelector(`#economic-tab-${tabId}`);

    if (activeTab && activeContent) {
      activeTab.classList.add('border-purple-500', 'text-purple-400', 'bg-slate-700/30');
      activeTab.classList.remove('border-transparent', 'text-slate-400');
      activeContent.classList.remove('hidden');
    }

    // Atualizar resumo se necessário
    if (tabId === 'summary') {
      this.updateSummary();
    }
  }

  addAction(type) {
    const maxActions = type === 'internal' ? ECONOMIC_CONFIG.maxInternalActions : ECONOMIC_CONFIG.maxExternalActions;
    
    if (this.actions[type].length >= maxActions) {
      showNotification('warning', `Máximo de ${maxActions} ações ${type === 'internal' ? 'internas' : 'externas'} atingido`);
      return;
    }

    // Adicionar ação vazia
    this.actions[type].push({
      type: '',
      value: 0,
      dice: 0,
      buff: 0,
      targetCountry: type === 'external' ? '' : null
    });

    // Recriar slots
    this.recreateActionSlots(type);
    this.updateTabCounters();
  }

  removeAction(type, index) {
    if (index >= 0 && index < this.actions[type].length) {
      this.actions[type].splice(index, 1);
      this.recreateActionSlots(type);
      this.updateTabCounters();
      this.updateBudgetBar();
      this.updateSummary();
    }
  }

  recreateActionSlots(type) {
    const container = document.getElementById(`${type}-actions-container`);
    if (!container) return;

    container.innerHTML = this.createActionSlots(type);
  }

  updateActionFromSlot(type, index, slot) {
    if (!this.actions[type][index]) {
      this.actions[type][index] = {};
    }

    const action = this.actions[type][index];

    // Atualizar dados da ação
    action.type = slot.querySelector('.action-type')?.value || '';
    action.value = parseFloat(slot.querySelector('.action-value')?.value) || 0;
    action.dice = parseInt(slot.querySelector('.action-dice')?.value) || 0;
    action.buff = parseFloat(slot.querySelector('.action-buff')?.value) || 0;
    action.isExternal = type === 'external';

    if (type === 'external') {
      action.targetCountry = slot.querySelector('.target-country')?.value || '';
    }

    // Se for exploration, adicionar tipo de recurso
    if (action.type === 'exploration') {
      action.resourceType = slot.querySelector('.resource-type')?.value || '';
    }

    // Atualizar display do buff
    const buffDisplay = slot.querySelector('.buff-value');
    if (buffDisplay) {
      buffDisplay.textContent = action.buff;
    }

    // Atualizar preview de extração se for exploration
    if (action.type === 'exploration') {
      this.updateExtractionPreview(slot, action);
    }
  }

  updatePreview(slot) {
    const type = slot.dataset.type;
    const index = parseInt(slot.dataset.index);
    const action = this.actions[type][index];

    if (!action || !action.type || !action.value || !action.dice) {
      slot.querySelector('.growth-preview').textContent = '+0.0%';
      return;
    }

    const country = this.getCountryById(this.selectedCountry);
    if (!country) return;

    try {
      let actionGrowthPercent;

      // Lógica especial para exploration: calcular baseado no estoque de recursos
      if (action.type === 'exploration' && action.resourceType) {
        const resourceProductionMap = {
          'Combustivel': 'CombustivelProducao',
          'Carvao': 'CarvaoProducao',
          'Metais': 'MetaisProducao'
        };

        const resourceField = resourceProductionMap[action.resourceType];
        const currentResourceStock = parseFloat(country[resourceField]) || 1; // Mínimo 1 para evitar divisão por zero

        // Fórmula: (Investimento em milhões / Estoque do Recurso) * Multiplicador da ação
        const actionConfig = ECONOMIC_CONFIG.actionTypes[action.type];
        const multiplier = actionConfig?.multiplier || 0.8;
        const growthRelativeToResource = (action.value / currentResourceStock) * multiplier;

        actionGrowthPercent = (growthRelativeToResource * 100).toFixed(2);
      } else {
        // Lógica padrão para outras ações (baseado no PIB)
        const result = EconomicCalculations.calculateBaseGrowth(action, country);
        actionGrowthPercent = (result.preInflationGrowth * 100).toFixed(2);
      }

      const preview = slot.querySelector('.growth-preview');
      preview.textContent = `+${actionGrowthPercent}%`;

      // Colorir baseado no resultado
      preview.className = 'growth-preview text-xs text-center px-2 py-1 rounded';
      const growthValue = parseFloat(actionGrowthPercent);

      if (growthValue > 1.0) {
        preview.classList.add('bg-emerald-700', 'text-emerald-200');
      } else if (growthValue > 0) {
        preview.classList.add('bg-blue-700', 'text-blue-200');
      } else if (growthValue === 0) {
        preview.classList.add('bg-yellow-700', 'text-yellow-200');
      } else {
        preview.classList.add('bg-red-700', 'text-red-200');
      }
    } catch (error) {
      Logger.error('Erro no preview:', error);
      slot.querySelector('.growth-preview').textContent = 'Erro';
    }
  }

  updateBudgetBar() {
    const totalUsed = [...this.actions.internal, ...this.actions.external]
      .reduce((acc, action) => acc + (parseFloat(action.value) || 0), 0);
    
    const usedFormatted = this.formatCurrency(totalUsed * 1000000); // Converter de milhões
    const percentage = Math.min((totalUsed * 1000000 / this.currentBudget) * 100, 100);
    
    const budgetUsedElement = document.getElementById('budget-used');
    const budgetBarElement = document.getElementById('budget-bar');
    const applyButton = document.getElementById('apply-economic-actions');
    
    if (budgetUsedElement) budgetUsedElement.textContent = usedFormatted;
    if (budgetBarElement) {
      budgetBarElement.style.width = `${percentage}%`;
      
      // Mudar cor baseado no uso
      budgetBarElement.className = 'h-2 rounded-full transition-all';
      if (percentage > 90) {
        budgetBarElement.classList.add('bg-gradient-to-r', 'from-red-500', 'to-red-600');
      } else if (percentage > 70) {
        budgetBarElement.classList.add('bg-gradient-to-r', 'from-yellow-500', 'to-orange-500');
      } else {
        budgetBarElement.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-green-500');
      }
    }
    
    // Habilitar/desabilitar botão
    if (applyButton) {
      const hasValidActions = [...this.actions.internal, ...this.actions.external]
        .some(action => action.type && action.value > 0 && action.dice > 0);
      
      const isOverBudget = (totalUsed * 1000000) > this.currentBudget;
      
      applyButton.disabled = !hasValidActions || isOverBudget;
      
      if (isOverBudget) {
        applyButton.textContent = '❌ Orçamento Excedido';
      } else if (hasValidActions) {
        applyButton.textContent = '⚡ Aplicar Investimentos';
      } else {
        applyButton.textContent = '⏳ Configure as Ações';
      }
    }
  }

  updateTabCounters() {
    const internalTab = document.querySelector('[data-tab="internal"]');
    const externalTab = document.querySelector('[data-tab="external"]');
    
    if (internalTab) {
      internalTab.innerHTML = `🏠 Ações Internas (${this.actions.internal.length}/${ECONOMIC_CONFIG.maxInternalActions})`;
    }
    
    if (externalTab) {
      externalTab.innerHTML = `🌍 Ações Externas (${this.actions.external.length}/${ECONOMIC_CONFIG.maxExternalActions})`;
    }
  }

  updateSummary() {
    const summaryContainer = document.getElementById('economic-summary-content');
    if (!summaryContainer) return;

    const country = this.getCountryById(this.selectedCountry);
    if (!country) return;

    const allActions = [...this.actions.internal, ...this.actions.external]
      .filter(a => a.type && a.value > 0);

    // Verificar se há alguma mudança (econômica, tecnologia ou indicadores)
    const hasTechChanges = Object.values(this.changes.technology).some(v => v !== 0);
    const hasIndicatorChanges = Object.values(this.changes.indicators).some(v => v !== 0);
    const hasAnyChanges = allActions.length > 0 || hasTechChanges || hasIndicatorChanges;

    if (!hasAnyChanges) {
      summaryContainer.innerHTML = `
        <div class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-4">📊</div>
          <div class="text-lg mb-2">Nenhuma mudança configurada</div>
          <div class="text-sm">Configure ações econômicas, tecnologia, recursos ou indicadores para ver o resumo</div>
        </div>
      `;
      return;
    }

    try {
      // Calcular resultados econômicos se houver ações
      let economicResults = null;
      if (allActions.length > 0) {
        const targetCountries = {};
        allActions.filter(a => a.isExternal).forEach(action => {
          if (action.targetCountry) {
            targetCountries[action.targetCountry] = this.getCountryById(action.targetCountry);
          }
        });
        economicResults = EconomicCalculations.processAllActions(allActions, country, targetCountries);
      }

      summaryContainer.innerHTML = this.createSummaryHTML(economicResults, country);
    } catch (error) {
      Logger.error('Erro ao atualizar resumo:', error);
      summaryContainer.innerHTML = `
        <div class="text-center py-12 text-red-400">
          <div class="text-4xl mb-4">❌</div>
          <div class="text-lg mb-2">Erro no cálculo</div>
          <div class="text-sm">Verifique se todas as ações estão configuradas corretamente</div>
        </div>
      `;
    }
  }

  createSummaryHTML(results, country) {
    let html = '<div class="space-y-6">';

    // === SEÇÃO ECONÔMICA (se houver ações econômicas) ===
    if (results) {
      const currentPIB = parseFloat(country.PIB) || 0;
      const growthPercentage = (results.finalGrowth * 100).toFixed(2);
      const potentialGrowthPercentage = (results.totalGrowth * 100).toFixed(2);
      const inflationPercentage = (results.totalInflation * 100).toFixed(1);

      html += `
        <!-- Resultado Principal -->
        <div class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">💰 Impacto Econômico</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-lg font-bold text-slate-300">${formatPIBPerCapita(parseFloat(country.PIBPerCapita) || 0)}</div>
              <div class="text-xs text-slate-400 mt-1">PIB per Capita</div>
            </div>
            
            <div class="text-center">
              <div class="text-lg font-bold text-emerald-400">${formatPIBPerCapita(results.newPIBPerCapita)}</div>
              <div class="text-xs text-slate-400 mt-1">Novo PIB per Capita</div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">+${growthPercentage}%</div>
              <div class="text-xs text-slate-400 mt-1">Crescimento Real</div>
              <div class="text-xs text-emerald-300">${this.formatCurrency(results.newPIB)} PIB</div>
            </div>
            
            <div class="text-center">
              <div class="text-xl font-bold text-red-400">${inflationPercentage}%</div>
              <div class="text-xs text-slate-400 mt-1">Inflação Aplicada</div>
            </div>
          </div>
          
          ${results.technologyChanges > 0 || results.stabilityChanges > 0 ? `
            <div class="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <div class="text-emerald-200 text-sm font-medium mb-2">📈 Bônus Adicionais</div>
              <div class="flex gap-4 text-xs">
                ${results.technologyChanges > 0 ? `<div class="text-emerald-300">🔬 Tecnologia: +${results.technologyChanges} pontos</div>` : ''}
                ${results.stabilityChanges > 0 ? `<div class="text-emerald-300">🏥 Estabilidade: +${results.stabilityChanges} pontos</div>` : ''}
              </div>
            </div>
          ` : ''}
          
          ${results.totalInflation > 0.3 ? `
            <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div class="text-yellow-200 text-sm">
                ⚠️ <strong>Alta Inflação:</strong> Sem inflação, o crescimento seria de +${potentialGrowthPercentage}%
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Breakdown por Ação -->
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">📋 Detalhamento por Ação</h4>
          
          <div class="space-y-3">
            ${results.actions.map(action => {
              const actionGrowthPercent = (action.preInflationGrowth * 100).toFixed(3);
              const typeConfig = ECONOMIC_CONFIG.actionTypes[action.type];
              const isSuccess = action.dice > 5;
              const isMinimal = action.dice === 4 || action.dice === 5;
              
              return `
                <div class="flex items-center justify-between p-3 rounded-lg ${
                  isSuccess ? 'bg-emerald-900/20 border border-emerald-500/30' : 
                  action.dice <= 3 ? 'bg-red-900/20 border border-red-500/30' :
                  isMinimal ? 'bg-yellow-900/20 border border-yellow-500/30' :
                  'bg-slate-700/30 border border-slate-600/30'
                }">
                  <div class="flex-1">
                    <div class="font-medium text-slate-200">
                      ${typeConfig?.name || action.type} 
                      ${action.isExternal ? `→ ${this.getCountryById(action.targetCountry)?.Pais || 'País'}` : ''}
                    </div>
                    <div class="text-sm text-slate-400">
                      ${this.formatCurrency(action.value * 1000000)} • Dado: ${action.dice}/12
                      ${action.buff !== 0 ? ` • Buff: ${action.buff > 0 ? '+' : ''}${action.buff}%` : ''}
                      ${action.chainBonus ? ` • Cadeia: +${(action.chainBonus * 100).toFixed(0)}%` : ''}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold ${
                      isSuccess ? 'text-emerald-400' : 
                      action.dice <= 3 ? 'text-red-400' : 
                      isMinimal ? 'text-yellow-400' : 'text-slate-400'
                    }">
                      ${parseFloat(actionGrowthPercent) >= 0 ? '+' : ''}${actionGrowthPercent}%
                    </div>
                    <div class="text-xs text-slate-500">
                      +${formatPIBPerCapita(action.preInflationGrowth * (parseFloat(country.PIBPerCapita) || 0))}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Cadeias Produtivas -->
        ${results.productiveChains.length > 0 ? `
          <div class="border border-slate-600/50 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-slate-200 mb-4">🔗 Cadeias Produtivas Ativadas</h4>
            
            <div class="space-y-3">
              ${results.productiveChains.map(chain => `
                <div class="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div>
                    <div class="font-medium text-blue-200">${chain.name}</div>
                    <div class="text-sm text-blue-300">${chain.description}</div>
                  </div>
                  <div class="text-blue-400 font-semibold">+${(chain.bonus * 100).toFixed(0)}%</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      `;
    }

    // === SEÇÃO DE TECNOLOGIA ===
    const hasTechChanges = Object.values(this.changes.technology).some(v => v !== 0);
    if (hasTechChanges) {
      html += `
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">🔬 Mudanças em Tecnologia</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.technology)
              .filter(([_, delta]) => delta !== 0)
              .map(([field, delta]) => {
                const current = parseFloat(country[field]) || 0;
                const newValue = Math.max(0, current + delta);
                const labels = {
                  Tecnologia: 'Tecnologia Civil',
                  Aeronautica: 'Aeronáutica',
                  Marinha: 'Marinha',
                  Veiculos: 'Veículos',
                  Exercito: 'Exército'
                };
                return `
                  <div class="flex items-center justify-between p-3 rounded-lg ${delta > 0 ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-red-900/20 border border-red-500/30'}">
                    <div class="text-slate-200">${labels[field] || field}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${current} → ${newValue}</div>
                      <div class="font-semibold ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}">${delta > 0 ? '+' : ''}${delta}</div>
                    </div>
                  </div>
                `;
              }).join('')}
          </div>
        </div>
      `;
    }

    // === SEÇÃO DE INDICADORES ===
    const hasIndicatorChanges = Object.values(this.changes.indicators).some(v => v !== 0);
    if (hasIndicatorChanges) {
      html += `
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">📊 Mudanças em Indicadores</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.indicators)
              .filter(([_, delta]) => delta !== 0)
              .map(([field, delta]) => {
                const current = parseFloat(country[field]) || 0;
                const newValue = Math.min(100, Math.max(0, current + delta));
                const labels = {
                  Estabilidade: 'Estabilidade',
                  Burocracia: 'Burocracia',
                  Urbanizacao: 'Urbanização',
                  IndustrialEfficiency: 'Eficiência Industrial'
                };
                return `
                  <div class="flex items-center justify-between p-3 rounded-lg ${delta > 0 ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-red-900/20 border border-red-500/30'}">
                    <div class="text-slate-200">${labels[field] || field}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${current}% → ${newValue}%</div>
                      <div class="font-semibold ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}">${delta > 0 ? '+' : ''}${delta}%</div>
                    </div>
                  </div>
                `;
              }).join('')}
          </div>
        </div>
      `;
    }

    // === AVISO FINAL ===
    html += `
      <div class="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-slate-200 mb-3">⚠️ Confirmação Final</h4>
        <div class="text-sm text-slate-300 space-y-2">
          <div>• Todas as mudanças serão aplicadas permanentemente ao país</div>
          ${results ? '<div>• Ações econômicas serão registradas no histórico</div>' : ''}
          ${results?.actions.some(a => a.isExternal) ? '<div>• Ações externas afetarão os países de destino</div>' : ''}
          ${hasTechChanges ? '<div>• Valores de tecnologia serão atualizados</div>' : ''}
          ${hasResourceChanges ? '<div>• Recursos serão modificados</div>' : ''}
          ${hasIndicatorChanges ? '<div>• Indicadores nacionais serão alterados</div>' : ''}
        </div>
      </div>
    </div>
    `;

    return html;
  }

  // === MÉTODOS PARA GESTÃO DAS NOVAS TABS ===

  switchEconomySubtab(subtab) {
    const modal = document.getElementById('economic-simulator-modal');
    if (!modal) return;

    // Atualizar botões
    modal.querySelectorAll('.economy-subtab').forEach(btn => {
      if (btn.dataset.subtab === subtab) {
        btn.classList.remove('bg-slate-700', 'text-slate-300');
        btn.classList.add('bg-purple-600', 'text-white');
      } else {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('bg-slate-700', 'text-slate-300');
      }
    });

    // Mostrar/esconder conteúdo
    modal.querySelectorAll('.economy-subtab-content').forEach(content => {
      content.classList.add('hidden');
    });
    modal.querySelector(`#economy-subtab-${subtab}`)?.classList.remove('hidden');
  }

  adjustTechnology(field, delta) {
    this.changes.technology[field] = (this.changes.technology[field] || 0) + delta;

    // Atualizar input
    const input = document.querySelector(`.tech-input[data-field="${field}"]`);
    if (input) input.value = this.changes.technology[field];

    this.updateTechPreview(field);
    this.updateSummary();
  }

  updateTechPreview(field) {
    const country = this.getCountryById(this.selectedCountry);
    if (!country) return;

    const current = parseFloat(country[field]) || 0;
    const delta = this.changes.technology[field] || 0;
    const newValue = Math.max(0, current + delta);

    const preview = document.querySelector(`.tech-preview[data-field="${field}"]`);
    if (preview) preview.textContent = newValue;
  }

  adjustIndicator(field, delta) {
    const country = this.getCountryById(this.selectedCountry);
    if (!country) return;

    const current = parseFloat(country[field]) || 0;
    const currentDelta = this.changes.indicators[field] || 0;
    const newDelta = currentDelta + delta;
    const newValue = current + newDelta;

    // Validar limites 0-100
    if (newValue < 0 || newValue > 100) {
      showNotification('warning', `${field} deve estar entre 0% e 100%`);
      return;
    }

    this.changes.indicators[field] = newDelta;

    // Atualizar input
    const input = document.querySelector(`.indicator-input[data-field="${field}"]`);
    if (input) input.value = this.changes.indicators[field];

    this.updateIndicatorPreview(field);
    this.updateSummary();
  }

  updateIndicatorPreview(field) {
    const country = this.getCountryById(this.selectedCountry);
    if (!country) return;

    const current = parseFloat(country[field]) || 0;
    const delta = this.changes.indicators[field] || 0;
    const newValue = Math.min(100, Math.max(0, current + delta));

    const preview = document.querySelector(`.indicator-preview[data-field="${field}"]`);
    if (preview) preview.textContent = `${newValue}%`;

    // Atualizar barra de progresso
    const bar = preview?.closest('.border')?.querySelector('.bg-gradient-to-r');
    if (bar) bar.style.width = `${newValue}%`;
  }

  resetActions() {
    this.actions.internal = [];
    this.actions.external = [];
    this.changes = {
      technology: {},
      indicators: {}
    };

    // Recriar interface
    this.recreateActionSlots('internal');
    this.recreateActionSlots('external');
    this.updateTabCounters();
    this.updateBudgetBar();
    this.updateSummary();
  }

  toggleActionDescription(selectElement) {
    const slot = selectElement.closest('.action-slot');
    const description = slot.querySelector('.action-description');
    const descriptionText = description.querySelector('div');

    if (selectElement.value) {
      const typeConfig = ECONOMIC_CONFIG.actionTypes[selectElement.value];
      if (typeConfig) {
        descriptionText.textContent = `${typeConfig.description}. Exemplos: ${typeConfig.examples.join(', ')}.`;
        description.classList.remove('hidden');
      }
    } else {
      description.classList.add('hidden');
    }
  }

  toggleResourceSelector(selectElement) {
    const slot = selectElement.closest('.action-slot');
    const resourceSelector = slot.querySelector('.resource-type-selector');
    const extractionPreview = slot.querySelector('.extraction-preview');

    if (selectElement.value === 'exploration') {
      // Mostrar seletor de recurso e preview de extração
      resourceSelector?.classList.remove('hidden');
      extractionPreview?.classList.remove('hidden');
    } else {
      // Esconder seletor de recurso e preview de extração
      resourceSelector?.classList.add('hidden');
      extractionPreview?.classList.add('hidden');
    }
  }

  updateExtractionPreview(slot, action) {
    const extractionAmount = slot.querySelector('.extraction-amount');
    if (!extractionAmount) return;

    if (!action.resourceType || !action.value || !action.dice) {
      extractionAmount.textContent = 'Aguardando dados...';
      return;
    }

    const country = this.getCountryById(this.selectedCountry);
    if (!country) return;

    // Pegar potencial do recurso
    const potentialMap = {
      'Combustivel': 'PotencialCombustivel',
      'Carvao': 'PotencialCarvao',
      'Metais': 'PotencialMetais'
    };

    const potentialField = potentialMap[action.resourceType];
    const potential = parseFloat(country[potentialField]) || 0;

    // Fórmula de extração: (Investimento / 10) * (Dado / 12) * (Potencial / 10)
    // Exemplo: 100M investimento, dado 12, potencial 10 = (100/10) * (12/12) * (10/10) = 10 * 1 * 1 = 10 unidades
    const baseExtraction = (action.value / 10) * (action.dice / 12) * (potential / 10);
    const finalExtraction = Math.round(baseExtraction * 100) / 100; // arredondar para 2 casas

    const resourceLabels = {
      'Combustivel': 'Combustível',
      'Carvao': 'Carvão',
      'Metais': 'Metais'
    };

    extractionAmount.innerHTML = `<strong>${finalExtraction.toFixed(2)}</strong> unidades de ${resourceLabels[action.resourceType]} (Potencial: ${potential}/10)`;
  }

  async applyEconomicActions() {
    const modal = document.getElementById('economic-simulator-modal');
    const applyButton = document.getElementById('apply-economic-actions');
    
    if (!modal || !applyButton) return;
    
    try {
      applyButton.disabled = true;
      applyButton.textContent = '⏳ Aplicando...';
      
      const country = this.getCountryById(this.selectedCountry);
      if (!country) throw new Error('País não encontrado');
      
      const allActions = [...this.actions.internal, ...this.actions.external]
        .filter(a => a.type && a.value > 0);

      // Verificar se há QUALQUER mudança (econômica, tecnologia ou indicadores)
      const hasTechChanges = Object.values(this.changes.technology).some(v => v !== 0);
      const hasIndicatorChanges = Object.values(this.changes.indicators).some(v => v !== 0);
      const hasAnyChanges = allActions.length > 0 || hasTechChanges || hasIndicatorChanges;

      if (!hasAnyChanges) {
        throw new Error('Nenhuma mudança configurada');
      }
      
      // Obter países de destino
      const targetCountries = {};
      for (const action of allActions.filter(a => a.isExternal)) {
        if (action.targetCountry) {
          targetCountries[action.targetCountry] = this.getCountryById(action.targetCountry);
        }
      }
      
      // Calcular resultados finais (apenas se houver ações econômicas)
      const results = allActions.length > 0
        ? EconomicCalculations.processAllActions(allActions, country, targetCountries)
        : null;

      // Aplicar mudanças no Firebase
      await this.saveEconomicResults(results, allActions, targetCountries);
      
      // Gerar feedback narrativo para o player
      try {
        await economicFeedback.generatePlayerFeedback(this.selectedCountry, results, allActions);
        Logger.info('Feedback narrativo gerado para o player');
      } catch (feedbackError) {
        Logger.warn('Erro ao gerar feedback narrativo:', feedbackError);
        // Não bloquear o processo por erro no feedback
      }
      
      // Mensagem de sucesso customizada
      let successMsg = 'Mudanças aplicadas com sucesso!';
      if (results) {
        successMsg = `Investimentos aplicados! PIB cresceu ${(results.finalGrowth * 100).toFixed(2)}%`;
      } else if (hasTechChanges || hasResourceChanges || hasIndicatorChanges) {
        const changes = [];
        if (hasTechChanges) changes.push('tecnologia');
        if (hasResourceChanges) changes.push('recursos');
        if (hasIndicatorChanges) changes.push('indicadores');
        successMsg = `Mudanças em ${changes.join(', ')} aplicadas!`;
      }
      showNotification('success', successMsg);
      
      // Fechar modal
      modal.remove();
      
      // Recarregar dados do narrador se necessário
      if (window.carregarTudo) {
        await window.carregarTudo();
      }
      
      // Forçar atualização completa da interface
      setTimeout(() => {
        if (window.location.pathname.includes('narrador')) {
          window.location.reload();
        }
      }, 1500);
      
    } catch (error) {
      Logger.error('Erro ao aplicar ações econômicas:', error);
      showNotification('error', `Erro: ${error.message}`);
    } finally {
      if (applyButton) {
        applyButton.disabled = false;
        applyButton.textContent = '⚡ Aplicar Investimentos';
      }
    }
  }

  async saveEconomicResults(results, actions, targetCountries) {
    const batch = db.batch();
    const currentTurn = parseInt(document.getElementById('turno-atual-admin')?.textContent?.replace('#', '')) || 1;
    
    try {
      // 1. Atualizar país principal
      const countryRef = db.collection('paises').doc(this.selectedCountry);
      const country = this.getCountryById(this.selectedCountry) || {};

      // Inicializar updates
      const countryUpdates = {
        TurnoUltimaAtualizacao: currentTurn
      };

      // === APLICAR MUDANÇAS ECONÔMICAS (se houver) ===
      if (results) {
        countryUpdates.PIB = results.newPIB;
        countryUpdates.PIBPerCapita = results.newPIBPerCapita;
        countryUpdates['geral.PIB'] = results.newPIB;
        countryUpdates['geral.PIBPerCapita'] = results.newPIBPerCapita;
      }

      // === APLICAR MUDANÇAS DE TECNOLOGIA ===
      for (const [field, delta] of Object.entries(this.changes.technology)) {
        if (delta !== 0) {
          const current = parseFloat(country[field]) || 0;
          const newValue = Math.max(0, current + delta);
          countryUpdates[field] = newValue;
          countryUpdates[`geral.${field}`] = newValue;
        }
      }

      // === APLICAR MUDANÇAS DE INDICADORES ===
      for (const [field, delta] of Object.entries(this.changes.indicators)) {
        if (delta !== 0) {
          const current = parseFloat(country[field]) || 0;
          const newValue = Math.min(100, Math.max(0, current + delta));
          countryUpdates[field] = newValue;
          countryUpdates[`geral.${field}`] = newValue;
        }
      }

      // === APLICAR EXTRAÇÃO DE RECURSOS (ações de exploration) ===
      const explorationActions = actions.filter(a => a.type === 'exploration' && a.resourceType && a.value && a.dice);
      for (const action of explorationActions) {
        const potentialMap = {
          'Combustivel': 'PotencialCombustivel',
          'Carvao': 'PotencialCarvao',
          'Metais': 'PotencialMetais'
        };

        const potentialField = potentialMap[action.resourceType];
        const potential = parseFloat(country[potentialField]) || 0;

        // Fórmula: (Investimento / 10) * (Dado / 12) * (Potencial / 10)
        const extraction = (action.value / 10) * (action.dice / 12) * (potential / 10);

        // Arredondar para não ter valores quebrados demais
        const roundedExtraction = Math.round(extraction * 100) / 100;

        // Adicionar ao estoque do recurso
        // Usar nomes de campos de produção por turno (que são acumulados)
        const resourceFieldMap = {
          'Combustivel': 'CombustivelProducao',
          'Carvao': 'CarvaoProducao',
          'Metais': 'MetaisProducao'
        };

        const resourceField = resourceFieldMap[action.resourceType];
        const currentProduction = parseFloat(country[resourceField]) || 0;
        countryUpdates[resourceField] = currentProduction + roundedExtraction;

        Logger.log(`[Exploration] ${country.Pais}: Extraiu ${roundedExtraction} unidades de ${action.resourceType} (Potencial: ${potential}/10, Dado: ${action.dice}/12)`);
      }

      // --- Recursos e Energia: calcular consumo/produção e índices ---
      // Agregar consumo de recursos por ações industriais
      let totalCombustivelConsumed = 0;
      let totalCarvaoConsumed = 0;
      let energyDemand = 0;
  let totalCarvaoProduced = 0;

      // Política industrial do país (default: 'combustivel')
      const politica = country.PoliticaIndustrial || country.Politica || 'combustivel';

  for (const action of actions) {
        if (action.type === 'industry') {
          const consume = EconomicCalculations.computeIndustryResourceConsumption(action.value, country);
          // usar a política definida
          if (politica === 'carvao') {
            totalCarvaoConsumed += consume;
          } else {
            totalCombustivelConsumed += consume;
          }
          // estimativa de demanda de energia: cada 1M investido requer 0.5 unidades
          energyDemand += (parseFloat(action.value) || 0) * 0.5;
        }

        // Exploração de recursos -> pode produzir Carvão
        if (action.type === 'exploration') {
          // Produção proporcional ao investimento, limitada pelo potencial do país
          const invested = parseFloat(action.value) || 0; // em milhões
          const potencial = parseFloat(country.PotencialCarvao || country.Potencial || country.PotencialCarvao || 0) || 0;
          // regra simples: cada 1M investido produz 0.1 unidades de carvão, mas não pode exceder potencial * 0.1
          const produced = Math.min(potencial * 0.1, invested * 0.1);
          totalCarvaoProduced += produced;
        }

        // Ações de research e social também demandam energia levemente
        if (action.type === 'research') {
          energyDemand += (parseFloat(action.value) || 0) * 0.2;
        }
      }

      // Calcular nova eficiência industrial: aumenta levemente com investments e tecnologia
      const currentEfficiency = parseFloat(country.IndustrialEfficiency) || 50;
      const efficiencyGainFromIndustry = actions.filter(a => a.type === 'industry').length * 0.5; // +0.5 por ação
      const newEfficiency = Math.min(100, currentEfficiency + efficiencyGainFromIndustry + (results.technologyChanges || 0) * 0.2);
      countryUpdates.IndustrialEfficiency = newEfficiency;

      // Energia: ler capacidade atual (EnergiaCapacidade) e aplicar penalty se necessário
      const energyCapacity = parseFloat(country.EnergiaCapacidade) || parseFloat(country.EnergiaDisponivel) || 0;
      const energyPenalty = EconomicCalculations.computeEnergyPenalty(energyCapacity, energyDemand);

      // Aplicar penalidade de energia reduzindo PIB se déficit for crítico
      if (energyPenalty < 1.0) {
        const penaltyPercent = (1 - energyPenalty) * 100;
        const pibPenalty = results.newPIB * (1 - energyPenalty) * 0.1; // 10% do déficit em PIB
        results.newPIB = Math.max(results.newPIB - pibPenalty, results.newPIB * 0.95); // Máximo -5% PIB
        results.newPIBPerCapita = results.newPIB / (parseFloat(country.Populacao) || 1);

        Logger.info(`Penalidade de energia aplicada: ${penaltyPercent.toFixed(1)}% déficit, -${pibPenalty.toFixed(0)} PIB`);
      }

      // Salvar capacidade atual para comparação
      countryUpdates.EnergiaCapacidade = energyCapacity;

      // Debitar recursos (garantir não ficar negativo)
      const currentCombustivel = parseFloat(country.Combustivel) || 0;
      const currentCarvao = parseFloat(country.CarvaoSaldo || country.Carvao || 0);

      const newCombustivel = Math.max(0, currentCombustivel - totalCombustivelConsumed);
      // Incluir produção de carvão
      const newCarvao = Math.max(0, currentCarvao - totalCarvaoConsumed + totalCarvaoProduced);

      countryUpdates.Combustivel = newCombustivel;
      countryUpdates.CarvaoSaldo = newCarvao;

      // Registrar produção no histórico (opcional)
      if (totalCarvaoProduced > 0) {
        historyData.results.producedCarvao = totalCarvaoProduced;
      }

      // Calcular índice de Bens de Consumo usando o helper
      const resourcesSnapshot = {
        Graos: country.Graos || 0,
        Combustivel: newCombustivel,
        EnergiaDisponivel: energyCapacity
      };

      const consumerGoodsIndex = EconomicCalculations.computeConsumerGoodsIndex(country, resourcesSnapshot);
      countryUpdates.BensDeConsumo = consumerGoodsIndex;

      // Aplicar efeito sobre Estabilidade conforme PRD
      const currentStab = parseFloat(country.Estabilidade) || 0;
      if (consumerGoodsIndex > 75) {
        countryUpdates.Estabilidade = Math.min(100, currentStab + 3);
        countryUpdates['geral.Estabilidade'] = Math.min(100, currentStab + 3);
      } else if (consumerGoodsIndex < 25) {
        countryUpdates.Estabilidade = Math.max(0, currentStab - 3);
        countryUpdates['geral.Estabilidade'] = Math.max(0, currentStab - 3);
      }
      
      // Aplicar mudanças de tecnologia e estabilidade
      if (results.technologyChanges > 0) {
        const currentTech = parseFloat(this.getCountryById(this.selectedCountry).Tecnologia) || 0;
        const newTech = Math.min(100, currentTech + results.technologyChanges);
        countryUpdates.Tecnologia = newTech;
        
        // Atualizar também na seção geral para sincronizar
        countryUpdates['geral.Tecnologia'] = newTech;
      }
      
      if (results.stabilityChanges > 0) {
        const currentStability = parseFloat(this.getCountryById(this.selectedCountry).Estabilidade) || 0;
        const newStability = Math.min(100, currentStability + results.stabilityChanges);
        countryUpdates.Estabilidade = newStability;
        
        // Atualizar também na seção geral para sincronizar
        countryUpdates['geral.Estabilidade'] = newStability;
      }
      
      batch.update(countryRef, countryUpdates);
      
      // 2. Atualizar países de destino (ações externas)
      for (const action of actions.filter(a => a.isExternal)) {
        if (action.targetCountry && targetCountries[action.targetCountry]) {
          const targetCountry = targetCountries[action.targetCountry];
          const targetResult = EconomicCalculations.calculateBaseGrowth(action, targetCountry);
          const targetGrowth = targetResult.preInflationGrowth * action.value / 1000000 * 0.5; // 50% do benefício
          
          const targetRef = db.collection('paises').doc(action.targetCountry);
          const targetPopulation = parseFloat(targetCountry.Populacao) || 1;
          const newTargetPIBPerCapita = parseFloat(targetCountry.PIBPerCapita || 0) + (targetGrowth / 1000000);
          const newTargetPIB = targetPopulation * newTargetPIBPerCapita;
          
          batch.update(targetRef, {
            PIB: newTargetPIB,
            PIBPerCapita: newTargetPIBPerCapita,
            TurnoUltimaAtualizacao: currentTurn
          });
        }
      }
      
      // 3. Salvar histórico econômico
      const historyRef = db.collection('economic_history').doc();
      const historyData = {
        countryId: this.selectedCountry,
        turn: currentTurn,
        timestamp: new Date(),
        totalInvestment: actions.reduce((acc, a) => acc + (parseFloat(a.value) || 0), 0),
        actions: actions,
        results: {
          totalGrowth: results.totalGrowth,
          finalGrowth: results.finalGrowth,
          inflation: results.totalInflation,
          newPIB: results.newPIB,
          productiveChains: results.productiveChains
        },
        externalInvestments: {}
      };
      
      // Registrar investimentos externos
      actions.filter(a => a.isExternal).forEach(action => {
        if (action.targetCountry) {
          historyData.externalInvestments[action.targetCountry] = (parseFloat(action.value) || 0);
        }
      });
      
      batch.set(historyRef, historyData);
      
      // 4. Registrar no log de mudanças
      const changeRef = db.collection('change_history').doc();
      batch.set(changeRef, {
        countryId: this.selectedCountry,
        section: 'economia',
        field: 'simulacao_economica',
        oldValue: {
          PIB: parseFloat(this.getCountryById(this.selectedCountry).PIB),
          PIBPerCapita: parseFloat(this.getCountryById(this.selectedCountry).PIBPerCapita) || 0
        },
        newValue: {
          PIB: results.newPIB,
          PIBPerCapita: results.newPIBPerCapita
        },
        userName: auth.currentUser?.displayName || 'Narrador',
        reason: `Simulação econômica: ${actions.length} ações aplicadas`,
        timestamp: new Date(),
        turn: currentTurn
      });
      
      // Executar todas as operações
      await batch.commit();
      
      Logger.info('Simulação econômica aplicada com sucesso');
      
    } catch (error) {
      Logger.error('Erro ao salvar resultados econômicos:', error);
      throw error;
    }
  }

  async buildPowerPlant(countryId, plantTypeId) {
    try {
      const country = this.getCountryById(countryId);
      if (!country) {
        showNotification('error', 'País não encontrado.');
        return { success: false, message: 'País não encontrado.' };
      }

      const plant = POWER_PLANTS[plantTypeId];
      if (!plant) {
        showNotification('error', 'Tipo de usina inválido.');
        return { success: false, message: 'Tipo de usina inválido.' };
      }

      // 1. Verificar custo
      if (country.PIB < plant.cost) {
        showNotification('error', `PIB insuficiente para construir ${plant.name}. Necessário: ${this.formatCurrency(plant.cost)}`);
        return { success: false, message: 'PIB insuficiente.' };
      }

      // 2. Verificar requisito tecnológico
      if (country.Tecnologia < plant.tech_requirement) {
        showNotification('error', `Tecnologia insuficiente para construir ${plant.name}. Necessário: ${plant.tech_requirement}%`);
        return { success: false, message: 'Tecnologia insuficiente.' };
      }

      // 3. Verificar potencial (para hidrelétricas)
      if (plant.type === 'hydro') {
        if (!country.PotencialHidreletrico || country.PotencialHidreletrico <= 0) {
          showNotification('error', `País não possui potencial hidrelétrico para construir ${plant.name}.`);
          return { success: false, message: 'Potencial hidrelétrico insuficiente.' };
        }
        // Decrementar potencial após construção
        country.PotencialHidreletrico--;
      }

      // 4. Verificar recurso (para nucleares - Urânio)
      if (plant.resource_input === 'Uranio') {
        // Assumindo que Urânio é um recurso como Carvao ou Combustivel
        if (!country.Uranio || country.Uranio <= 0) {
          showNotification('error', `País não possui Urânio suficiente para construir ${plant.name}.`);
          return { success: false, message: 'Urânio insuficiente.' };
        }
        // Decrementar Urânio após construção
        country.Uranio--;
      }

      // Usar transação para garantir atomicidade
      await db.runTransaction(async (transaction) => {
        const countryRef = db.collection('paises').doc(countryId);
        const currentCountryDoc = await transaction.get(countryRef);
        const currentCountryData = currentCountryDoc.data();

        // Recalcular PIB e power_plants com base nos dados mais recentes
        const newPIB = currentCountryData.PIB - plant.cost;
        const newPowerPlants = [...(currentCountryData.power_plants || []), { id: plantTypeId, built_turn: parseInt(document.getElementById('turno-atual-admin')?.textContent?.replace('#', '')) || 1 }];
        
        const updates = {
          PIB: newPIB,
          power_plants: newPowerPlants,
          // Atualizar potencial hidrelétrico e urânio se aplicável
          ...(plant.type === 'hydro' && { PotencialHidreletrico: country.PotencialHidreletrico }),
          ...(plant.resource_input === 'Uranio' && { Uranio: country.Uranio }),
        };

        transaction.update(countryRef, updates);
      });

      // Atualizar o objeto local do país
      country.PIB -= plant.cost;
      country.power_plants.push({ id: plantTypeId, built_turn: parseInt(document.getElementById('turno-atual-admin')?.textContent?.replace('#', '')) || 1 });

      showNotification('success', `${plant.name} construída com sucesso!`);
      Logger.info(`${plant.name} construída para ${country.Pais}`, { countryId, plantTypeId });
      return { success: true, message: `${plant.name} construída.` };

    } catch (error) {
      Logger.error(`Erro ao construir usina ${plantTypeId} para ${countryId}:`, error);
      showNotification('error', `Erro ao construir usina: ${error.message}`);
      return { success: false, message: `Erro ao construir usina: ${error.message}` };
    }
  }
}

// Instância global
let economicSimulator = null;

// Inicializar quando o documento carregar
export async function initEconomicSimulator() {
  try {
    economicSimulator = new EconomicSimulator();
    await economicSimulator.initialize();
    return economicSimulator;
  } catch (error) {
    Logger.error('Erro ao inicializar simulador econômico:', error);
    throw error;
  }
}

// Exportar para uso global
export { economicSimulator, EconomicSimulator };