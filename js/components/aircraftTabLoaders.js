// js/components/aircraftTabLoaders.js - Abas específicas do criador de aeronaves (Fase 1)

import { optimizedTemplateLoader } from './OptimizedTemplateLoader.js';

export class TabLoaders {
  constructor() {
    this.tabContent = null;
    this.currentTechLevel = 50; // Default tech level
    this.loadingCache = new Map(); // Local loading cache
    this.componentLoadPromise = null; // Shared component loading promise
  }

  getTabContent() {
    if (!this.tabContent) this.tabContent = document.getElementById('tab-content');
    return this.tabContent;
  }

  showLoadingState(message = 'Carregando componentes...') {
    const el = this.getTabContent();
    if (el) {
      optimizedTemplateLoader.showOptimizedLoadingState(el, message);
    }
  }

  showEmptyState(message) {
    const el = this.getTabContent();
    if (el) el.innerHTML = `<div class=\"text-center text-slate-500 p-8\">${message}</div>`;
  }

  // Update current tech level from the globally available user country data
  updateTechLevel() {
    if (window.currentUserCountry) {
      const area = Number(window.currentUserCountry.aircraftTech ?? 0);
      const civil = Number(window.currentUserCountry.civilTech ?? window.currentUserCountry.Tecnologia ?? 0);
      // Política: não ultrapassar o teto da tecnologia civil
      this.currentTechLevel = civil > 0 ? Math.min(area, civil) : area;
      console.log(`✅ Aircraft tech set: ${this.currentTechLevel} (civil=${civil}, area=${area})`);
    } else {
      this.currentTechLevel = 50; // Fallback
      console.warn(`⚠️ Could not determine user country tech level. Using default: ${this.currentTechLevel}`);
    }
  }

  // Filter components based on tech level AND year
  filterAvailableComponents(components) {
    const filtered = {};
    const currentYear = window.currentUserCountry?.year || 1954; // Get year from global object
    
    for (const [id, component] of Object.entries(components)) {
      const requiredTech = component.tech_level || 0;
      const requiredYear = component.year_introduced || 1945; // Default to past if not specified

      const techAvailable = this.currentTechLevel >= requiredTech;
      const yearAvailable = currentYear >= requiredYear;
      
      if (techAvailable && yearAvailable) {
        filtered[id] = component;
      } else {
        // Optional: Log reason for unavailability for debugging
        if (!techAvailable) {
            // console.log(`🔒 Component ${id} requires tech level ${requiredTech}, current: ${this.currentTechLevel}`);
        }
        if (!yearAvailable) {
            // console.log(`📅 Component ${id} requires year ${requiredYear}, current: ${currentYear}`);
        }
      }
    }
    
    return filtered;
  }

  // Add visual indicators for locked/unlocked components
  getComponentStatusClass(component) {
    const requiredTech = component.tech_level || 0;
    const isAvailable = this.currentTechLevel >= requiredTech;
    
    if (isAvailable) {
      return 'available';
    } else {
      return 'locked';
    }
  }

  // Get component availability info
  getComponentAvailabilityInfo(component) {
    const requiredTech = Number(component.tech_level || 0);
    const requiredYear = Number(component.year_introduced || 1945);
    const currentYear = window.currentUserCountry?.year || 1954;
    
    const techOk = this.currentTechLevel >= requiredTech;
    const yearOk = currentYear >= requiredYear;

    const isAvailable = techOk && yearOk;
    
    return {
      isAvailable,
      requiredTech,
      currentTech: this.currentTechLevel,
      missingTech: Math.max(0, requiredTech - this.currentTechLevel),
      requiredYear,
      currentYear,
      techOk,
      yearOk
    };
  }

  // ========= AIRCRAFT TABS =========

  // NEW: Category Selection Tab
  loadCategoryTab() {
    console.log('🔄 Loading Category Selection Tab...');

    // Create category selection interface
    const html = this.createCategorySelectionInterface();
    this.getTabContent().innerHTML = html;

    // Initialize category controls
    this.initializeCategoryControls();
  }

  createCategorySelectionInterface() {
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">🎯</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Categoria da Aeronave</h2>
            <p class="text-sm text-slate-400">Escolha o tipo geral da sua aeronave</p>
          </div>
        </div>

        <!-- Category Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <!-- Fighter Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="fighter">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">🛩️</span>
              <h3 class="text-xl font-semibold text-slate-200">Caça</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves de combate ágeis, focadas em superioridade aérea e interceptação</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Alta manobrabilidade</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Velocidade elevada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Alcance médio</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Capacidade de carga limitada</span>
              </div>
            </div>
          </div>

          <!-- Bomber Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="bomber">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">💣</span>
              <h3 class="text-xl font-semibold text-slate-200">Bombardeiro</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves pesadas para bombardeio estratégico e tático</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Grande capacidade de bombas</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Longo alcance</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Baixa manobrabilidade</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Vulnerável a caças</span>
              </div>
            </div>
          </div>

          <!-- Transport Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="transport">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">✈️</span>
              <h3 class="text-xl font-semibold text-slate-200">Transporte</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves para transporte de tropas, suprimentos e equipamentos</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Grande capacidade de carga</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Versátil</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Velocidade moderada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Sem armamento pesado</span>
              </div>
            </div>
          </div>

          <!-- Attack Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="attack">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">⚔️</span>
              <h3 class="text-xl font-semibold text-slate-200">Ataque ao Solo</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves especializadas em apoio aéreo aproximado</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Armamento variado</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Boa proteção</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Velocidade moderada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Manobrabilidade média</span>
              </div>
            </div>
          </div>

          <!-- Experimental Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="experimental">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">🧪</span>
              <h3 class="text-xl font-semibold text-slate-200">Experimental</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Projetos experimentais e protótipos avançados</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Tecnologia avançada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Performance única</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Custo muito alto</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Confiabilidade baixa</span>
              </div>
            </div>
          </div>

          <!-- Helicopter Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="helicopter">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">🚁</span>
              <h3 class="text-xl font-semibold text-slate-200">Helicóptero</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves de asas rotativas para missões especiais e suporte</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Decolagem vertical</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Capacidade de hover</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Alta manobrabilidade</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Alcance limitado</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Selected Category Info -->
        <div id="selected-category-info" class="hidden bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4">Categoria Selecionada: <span id="selected-category-name">-</span></h3>
          <div id="category-description" class="text-sm text-slate-300 mb-4"></div>

          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-400">
              Prossiga para a aba <strong>Célula</strong> para escolher a fuselagem específica
            </div>
            <button id="continue-to-cell-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Continuar →
            </button>
          </div>
        </div>
      </div>

      <style>
        .category-option.selected {
          border-color: rgb(6 182 212);
          background: rgb(6 182 212 / 0.1);
        }
        .category-option.selected h3 {
          color: rgb(103 232 249);
        }
      </style>
    `;
  }

  initializeCategoryControls() {
    let selectedCategory = null;

    const categoryOptions = document.querySelectorAll('.category-option');
    const selectedInfo = document.getElementById('selected-category-info');
    const selectedName = document.getElementById('selected-category-name');
    const categoryDescription = document.getElementById('category-description');
    const continueBtn = document.getElementById('continue-to-cell-btn');

    categoryOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selection from all options
        categoryOptions.forEach(opt => opt.classList.remove('selected'));

        // Add selection to clicked option
        option.classList.add('selected');

        // Update selected category
        selectedCategory = option.dataset.category;

        // Update info display
        this.updateCategoryInfo(selectedCategory, selectedName, categoryDescription, selectedInfo);

        // Store in global aircraft state
        if (!window.currentAircraft) {
          window.currentAircraft = {};
        }
        window.currentAircraft.category = selectedCategory;
      });
    });

    // Continue button functionality
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        // Switch to cell tab
        const cellTab = document.querySelector('[data-tab="cell"]');
        if (cellTab) {
          cellTab.click();
        }
      });
    }

    // Set default selection to Fighter when page loads
    const defaultOption = document.querySelector('[data-category="fighter"]');
    if (defaultOption) {
      // Trigger click to select fighter by default
      defaultOption.click();
    }
  }

  updateCategoryInfo(category, nameElement, descriptionElement, containerElement) {
    const categories = {
      fighter: {
        name: 'Caça',
        description: 'Aeronaves de combate projetadas para domínio aéreo. Priorizam velocidade, manobrabilidade e capacidade de combate ar-ar. Ideais para interceptação e superioridade aérea.'
      },
      bomber: {
        name: 'Bombardeiro',
        description: 'Aeronaves pesadas focadas em bombardeio estratégico e tático. Grande capacidade de carga de bombas e longo alcance, mas com menor agilidade.'
      },
      transport: {
        name: 'Transporte',
        description: 'Aeronaves versáteis para transporte de tropas, equipamentos e suprimentos. Focam em capacidade de carga e alcance em vez de performance de combate.'
      },
      helicopter: {
        name: 'Helicóptero',
        description: 'Aeronaves de asas rotativas para missões especiais e suporte. Capacidade de decolagem e pouso vertical, hover e operação em baixa altitude.'
      },
      attack: {
        name: 'Ataque ao Solo',
        description: 'Aeronaves especializadas em apoio aéreo aproximado e ataque a alvos terrestres. Balanceiam armamento, proteção e manobrabilidade.'
      },
      experimental: {
        name: 'Experimental',
        description: 'Projetos avançados e protótipos que testam novas tecnologias. Oferece capacidades únicas mas com custos elevados e confiabilidade questionável.'
      }
    };

    const categoryData = categories[category];
    nameElement.textContent = categoryData.name;
    descriptionElement.textContent = categoryData.description;

    containerElement.classList.remove('hidden');
  }

  // NEW: Structure & Materials Tab
  loadStructureTab() {
    console.log('🔄 Loading Structure & Materials Tab...');

    this.updateTechLevel();

    // Create simplified structure interface directly
    const html = this.createSimplifiedStructureInterface();
    this.getTabContent().innerHTML = html;

    // Initialize simple controls
    this.initializeSimpleStructureControls();
  }

  createSimplifiedStructureInterface() {
    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">🏗️</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Estrutura e Materiais</h2>
            <p class="text-sm text-slate-400">Configure a estrutura da sua aeronave</p>
          </div>
        </div>

        <!-- Material Selection -->
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>🔩</span>
            <span>Material Estrutural</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="material-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-material="aluminum">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🔩</span>
                <h4 class="font-semibold text-slate-200">Alumínio</h4>
              </div>
              <p class="text-sm text-slate-400 mb-3">Liga de alumínio padrão, equilibrando peso e custo</p>
              <div class="text-xs text-slate-300">
                <div>Custo: <span class="text-green-400">Padrão</span></div>
                <div>Peso: <span class="text-yellow-400">Leve</span></div>
                <div>Durabilidade: <span class="text-blue-400">Boa</span></div>
              </div>
            </div>

            <div class="material-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-material="steel">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">⚙️</span>
                <h4 class="font-semibold text-slate-200">Aço</h4>
              </div>
              <p class="text-sm text-slate-400 mb-3">Estrutura de aço resistente, mais pesada mas durável</p>
              <div class="text-xs text-slate-300">
                <div>Custo: <span class="text-green-400">Baixo</span></div>
                <div>Peso: <span class="text-red-400">Pesado</span></div>
                <div>Durabilidade: <span class="text-green-400">Excelente</span></div>
              </div>
            </div>

            <div class="material-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-material="composite">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🧪</span>
                <h4 class="font-semibold text-slate-200">Compósito</h4>
              </div>
              <p class="text-sm text-slate-400 mb-3">Materiais avançados, leves mas caros (Experimental)</p>
              <div class="text-xs text-slate-300">
                <div>Custo: <span class="text-red-400">Alto</span></div>
                <div>Peso: <span class="text-green-400">Muito Leve</span></div>
                <div>Durabilidade: <span class="text-yellow-400">Boa</span></div>
              </div>
            </div>
          </div>

          <div id="selected-material-info" class="mt-4 p-4 bg-slate-700/30 rounded-lg hidden">
            <h4 class="font-semibold text-slate-200 mb-2">Material Selecionado: <span id="selected-material-name">-</span></h4>
            <div id="material-effects" class="text-sm text-slate-300">
              <!-- Effects will be populated -->
            </div>
          </div>
        </div>

        <!-- Center of Gravity -->
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>⚖️</span>
            <span>Centro de Gravidade</span>
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- CG Visualization -->
            <div>
              <div class="relative mb-4">
                <div class="h-8 bg-slate-700 rounded-lg overflow-hidden">
                  <div class="absolute left-0 top-0 w-4 h-full bg-red-500/30 border-r border-red-500"></div>
                  <div class="absolute left-1/4 top-0 w-1/2 h-full bg-green-500/20"></div>
                  <div class="absolute right-0 top-0 w-4 h-full bg-red-500/30 border-l border-red-500"></div>
                  <div id="cg-indicator" class="absolute top-0 w-2 h-full bg-yellow-400 transition-all duration-300" style="left: 45%;"></div>
                </div>
                <div class="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Nariz</span>
                  <span>Faixa Ideal</span>
                  <span>Cauda</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-400">Posição:</span>
                  <span id="cg-position" class="text-slate-200 font-mono">45% MAC</span>
                </div>
                <div>
                  <span class="text-slate-400">Massa Total:</span>
                  <span id="cg-total-mass" class="text-slate-200 font-mono">2500 kg</span>
                </div>
              </div>
            </div>

            <!-- Mass Distribution -->
            <div>
              <h4 class="font-semibold text-slate-200 mb-3">Distribuição de Massa</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-400">Fuselagem:</span>
                  <span class="text-slate-200" id="mass-airframe">1800 kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Motor:</span>
                  <span class="text-slate-200" id="mass-engine">800 kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Combustível:</span>
                  <span class="text-slate-200" id="mass-fuel">450 kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Armamento:</span>
                  <span class="text-slate-200" id="mass-weapons">150 kg</span>
                </div>
                <div class="border-t border-slate-600 pt-2 mt-2">
                  <div class="flex justify-between font-semibold">
                    <span class="text-slate-300">Total:</span>
                    <span class="text-slate-100" id="mass-total">3200 kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .material-option.selected {
          border-color: rgb(6 182 212);
          background: rgb(6 182 212 / 0.1);
        }
        .material-option.selected h4 {
          color: rgb(103 232 249);
        }
      </style>
    `;
  }

  initializeSimpleStructureControls() {
    // Initialize material selection
    let selectedMaterial = 'aluminum';

    const materialOptions = document.querySelectorAll('.material-option');
    const selectedInfo = document.getElementById('selected-material-info');
    const selectedName = document.getElementById('selected-material-name');
    const materialEffects = document.getElementById('material-effects');

    materialOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selection from all options
        materialOptions.forEach(opt => opt.classList.remove('selected'));

        // Add selection to clicked option
        option.classList.add('selected');

        // Update selected material
        selectedMaterial = option.dataset.material;

        // Update info display
        this.updateMaterialInfo(selectedMaterial, selectedName, materialEffects, selectedInfo);

        // Store in global aircraft state
        if (!window.currentAircraft.structure) {
          window.currentAircraft.structure = {};
        }
        window.currentAircraft.structure.material = selectedMaterial;

        // Update calculations and display
        this.updateStructureCalculations(selectedMaterial);
      });
    });

    // Set default selection and trigger calculations
    const defaultOption = document.querySelector('[data-material="aluminum"]');
    if (defaultOption) {
      defaultOption.click();
    } else {
      // Fallback if element not found immediately
      setTimeout(() => {
        const retryOption = document.querySelector('[data-material="aluminum"]');
        if (retryOption) retryOption.click();
      }, 100);
    }
  }

  updateMaterialInfo(material, nameElement, effectsElement, containerElement) {
    const materials = {
      aluminum: {
        name: 'Alumínio',
        effects: [
          'Custo base padrão (100%)',
          'Peso estrutural normal',
          'Manutenção padrão',
          'Resistência à corrosão boa'
        ]
      },
      steel: {
        name: 'Aço',
        effects: [
          'Custo reduzido (-20%)',
          'Peso estrutural aumentado (+30%)',
          'Durabilidade aumentada (+50%)',
          'Manutenção reduzida (-10%)'
        ]
      },
      composite: {
        name: 'Compósito',
        effects: [
          'Custo elevado (+80%)',
          'Peso estrutural reduzido (-25%)',
          'Assinatura radar reduzida (-30%)',
          'Requer tech level 70+'
        ]
      }
    };

    const materialData = materials[material];
    nameElement.textContent = materialData.name;
    effectsElement.innerHTML = materialData.effects.map(effect =>
      `<div class="flex items-center gap-2"><span class="text-cyan-400">•</span>${effect}</div>`
    ).join('');

    containerElement.classList.remove('hidden');
  }

  updateStructureCalculations(material) {
    // Material modifiers
    const materialData = {
      aluminum: { weightModifier: 1.0, costModifier: 1.0, cgOffset: 0 },
      steel: { weightModifier: 1.3, costModifier: 0.8, cgOffset: -0.02 }, // Steel is heavier, shifts CG forward
      composite: { weightModifier: 0.75, costModifier: 1.8, cgOffset: 0.01 } // Composite is lighter, shifts CG aft
    };

    const modifiers = materialData[material];

    // Base aircraft data (get from current aircraft state or defaults)
    const baseAirframeWeight = window.currentAircraft?.airframe?.base_weight ||
                              window.currentAircraft?.selectedAirframe?.base_weight || 1800;
    const baseEngineWeight = window.currentAircraft?.engine?.weight ||
                            window.currentAircraft?.selectedEngine?.weight || 800;
    const baseFuelWeight = window.currentAircraft?.fuel_capacity ||
                          window.currentAircraft?.selectedAirframe?.internal_fuel_kg || 450;
    const baseWeaponsWeight = window.currentAircraft?.weapons?.total_weight || 150;

    console.log('🔄 Structure calculations:', {
      material,
      baseAirframeWeight,
      baseEngineWeight,
      baseFuelWeight,
      baseWeaponsWeight,
      modifiers
    });

    // Calculate new weights based on material
    const newAirframeWeight = Math.round(baseAirframeWeight * modifiers.weightModifier);
    const totalWeight = newAirframeWeight + baseEngineWeight + baseFuelWeight + baseWeaponsWeight;

    // Calculate new center of gravity
    // Base CG at 45% MAC, material affects this
    const baseCG = 45; // 45% MAC
    const newCG = Math.max(25, Math.min(65, baseCG + (modifiers.cgOffset * 100))); // Keep within reasonable bounds

    // Update DOM elements
    this.updateDisplayValues({
      airframeWeight: newAirframeWeight,
      engineWeight: baseEngineWeight,
      fuelWeight: baseFuelWeight,
      weaponsWeight: baseWeaponsWeight,
      totalWeight: totalWeight,
      cgPosition: newCG
    });

    // Store calculated values in global state
    if (!window.currentAircraft.calculatedValues) {
      window.currentAircraft.calculatedValues = {};
    }

    window.currentAircraft.calculatedValues.totalWeight = totalWeight;
    window.currentAircraft.calculatedValues.cgPosition = newCG;
    window.currentAircraft.calculatedValues.airframeWeight = newAirframeWeight;
  }

  updateDisplayValues(values) {
    // Update mass display
    const massAirframe = document.getElementById('mass-airframe');
    const massEngine = document.getElementById('mass-engine');
    const massFuel = document.getElementById('mass-fuel');
    const massWeapons = document.getElementById('mass-weapons');
    const massTotal = document.getElementById('mass-total');

    if (massAirframe) massAirframe.textContent = `${values.airframeWeight} kg`;
    if (massEngine) massEngine.textContent = `${values.engineWeight} kg`;
    if (massFuel) massFuel.textContent = `${values.fuelWeight} kg`;
    if (massWeapons) massWeapons.textContent = `${values.weaponsWeight} kg`;
    if (massTotal) massTotal.textContent = `${values.totalWeight} kg`;

    // Update CG display
    const cgPosition = document.getElementById('cg-position');
    const cgTotalMass = document.getElementById('cg-total-mass');
    const cgIndicator = document.getElementById('cg-indicator');

    if (cgPosition) cgPosition.textContent = `${values.cgPosition.toFixed(1)}% MAC`;
    if (cgTotalMass) cgTotalMass.textContent = `${values.totalWeight} kg`;

    // Update CG indicator position (visual bar)
    if (cgIndicator) {
      const position = Math.max(0, Math.min(96, (values.cgPosition / 100) * 96)); // Convert to percentage within the bar
      cgIndicator.style.left = `${position}%`;

      // Change color based on CG position
      if (values.cgPosition < 30 || values.cgPosition > 60) {
        cgIndicator.style.background = '#ef4444'; // Red for dangerous positions
      } else if (values.cgPosition < 35 || values.cgPosition > 55) {
        cgIndicator.style.background = '#f59e0b'; // Yellow for marginal positions
      } else {
        cgIndicator.style.background = '#10b981'; // Green for optimal positions
      }
    }

    // Update weight indicator in the top dashboard if it exists
    if (typeof window.updateWeightDisplay === 'function') {
      window.updateWeightDisplay(values.totalWeight);
    }
  }

  loadCellTab() {
    console.log('🔄 Loading Cell Tab (Airframes)...');

    // Create simplified airframe selection interface
    const html = this.createSimplifiedAirframeInterface();
    this.getTabContent().innerHTML = html;

    // Initialize airframe controls
    this.initializeSimpleAirframeControls();

    // Restore previous selection if it exists
    this.restoreAirframeSelection();
  }

  createSimplifiedAirframeInterface() {
    const selectedCategory = window.currentAircraft?.category || 'fighter';
    const categoryName = this.getCategoryDisplayName(selectedCategory);

    return `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">✈️</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Células/Fuselagens</h2>
            <p class="text-sm text-slate-400">Fuselagens disponíveis para categoria: <strong class="text-blue-400">${categoryName}</strong></p>
          </div>
        </div>

        ${!window.currentAircraft?.category ? `
        <div class="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2">
            <span class="text-yellow-400">⚠️</span>
            <span class="text-yellow-100 font-medium">Categoria não selecionada</span>
          </div>
          <p class="text-yellow-200 text-sm mt-1">
            Volte para a aba <strong>Categoria</strong> para escolher o tipo de aeronave primeiro.
          </p>
        </div>
        ` : ''}

        <!-- Airframe Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.generateAirframeOptions(selectedCategory)}
        </div>

        <!-- Selected Airframe Info -->
        <div id="selected-airframe-info" class="hidden bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4">Fuselagem Selecionada: <span id="selected-airframe-name">-</span></h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-slate-300 mb-3">Especificações</h4>
              <div id="airframe-specs" class="space-y-2 text-sm text-slate-300">
                <!-- Specs will be populated -->
              </div>
            </div>

            <div>
              <h4 class="font-semibold text-slate-300 mb-3">Características</h4>
              <div id="airframe-characteristics" class="space-y-2 text-sm text-slate-300">
                <!-- Characteristics will be populated -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .airframe-option.selected {
          border-color: rgb(6 182 212);
          background: rgb(6 182 212 / 0.1);
        }
        .airframe-option.selected h4 {
          color: rgb(103 232 249);
        }
      </style>
    `;
  }

  initializeSimpleAirframeControls() {
    let selectedAirframe = null;

    const airframeOptions = document.querySelectorAll('.airframe-option');
    const selectedInfo = document.getElementById('selected-airframe-info');
    const selectedName = document.getElementById('selected-airframe-name');
    const airframeSpecs = document.getElementById('airframe-specs');
    const airframeCharacteristics = document.getElementById('airframe-characteristics');

    airframeOptions.forEach(option => {
      option.addEventListener('click', () => {
        // Remove selection from all options
        airframeOptions.forEach(opt => opt.classList.remove('selected'));

        // Add selection to clicked option
        option.classList.add('selected');

        // Update selected airframe
        selectedAirframe = option.dataset.airframe;

        // Update info display
        this.updateAirframeInfo(selectedAirframe, selectedName, airframeSpecs, airframeCharacteristics, selectedInfo);

        // Store in global aircraft state
        if (!window.currentAircraft) {
          window.currentAircraft = {};
        }
        window.currentAircraft.selectedAirframe = this.getAirframeData(selectedAirframe);
        window.currentAircraft.airframeType = selectedAirframe;
        // Also save in the expected format for other tabs
        window.currentAircraft.airframe = selectedAirframe;

        // Update calculations
        if (typeof this.updateStructureCalculations === 'function') {
          this.updateStructureCalculations(window.currentAircraft.structure?.material || 'aluminum');
        }

        console.log(`✅ Airframe selected: ${selectedAirframe}`);
      });
    });
  }

  restoreAirframeSelection() {
    // Check if there's a previously selected airframe
    const savedAirframe = window.currentAircraft?.airframe || window.currentAircraft?.airframeType;

    if (savedAirframe) {
      console.log(`🔄 Restoring airframe selection: ${savedAirframe}`);

      // Find and select the corresponding option
      const airframeOption = document.querySelector(`[data-airframe="${savedAirframe}"]`);
      if (airframeOption) {
        // Remove previous selections
        document.querySelectorAll('.airframe-option').forEach(opt => opt.classList.remove('selected'));

        // Select the saved option
        airframeOption.classList.add('selected');

        // Update info display
        const selectedInfo = document.getElementById('selected-airframe-info');
        const selectedName = document.getElementById('selected-airframe-name');
        const airframeSpecs = document.getElementById('airframe-specs');
        const airframeCharacteristics = document.getElementById('airframe-characteristics');

        this.updateAirframeInfo(savedAirframe, selectedName, airframeSpecs, airframeCharacteristics, selectedInfo);

        console.log(`✅ Airframe selection restored: ${savedAirframe}`);
      } else {
        console.warn(`⚠️ Could not find airframe option for: ${savedAirframe}`);
      }
    } else {
      console.log('ℹ️ No previous airframe selection to restore');
    }
  }

  getAirframeData(airframe) {
    const airframes = {
      light_fighter: {
        name: 'Caça Leve',
        base_weight: 1800,
        max_takeoff_weight: 3200,
        g_limit: 9,
        hardpoints: 2,
        internal_fuel_kg: 450,
        advantages: ['Excelente manobrabilidade', 'Baixo custo', 'Leve'],
        disadvantages: ['Armamento limitado', 'Alcance curto']
      },
      early_jet_fighter: {
        name: 'Caça a Jato Inicial',
        base_weight: 2200,
        max_takeoff_weight: 4000,
        g_limit: 8,
        hardpoints: 4,
        internal_fuel_kg: 600,
        advantages: ['Boa velocidade', 'Moderadamente ágil'],
        disadvantages: ['Consumo alto', 'Tecnologia inicial']
      },
      multirole_fighter: {
        name: 'Caça Multifunção',
        base_weight: 2800,
        max_takeoff_weight: 5500,
        g_limit: 7.5,
        hardpoints: 6,
        internal_fuel_kg: 800,
        advantages: ['Versátil', 'Bom alcance', 'Múltiplas missões'],
        disadvantages: ['Peso médio', 'Custo elevado']
      },
      heavy_fighter: {
        name: 'Caça Pesado',
        base_weight: 3500,
        max_takeoff_weight: 7000,
        g_limit: 6,
        hardpoints: 8,
        internal_fuel_kg: 1200,
        advantages: ['Alta capacidade', 'Muito resistente', 'Longo alcance'],
        disadvantages: ['Pouco ágil', 'Caro', 'Pesado']
      },
      light_bomber: {
        name: 'Bombardeiro Leve',
        base_weight: 4200,
        max_takeoff_weight: 8500,
        g_limit: 5,
        hardpoints: 12,
        internal_fuel_kg: 1800,
        advantages: ['Grande capacidade de bombas', 'Excelente alcance'],
        disadvantages: ['Muito lento', 'Vulnerável', 'Pouco ágil']
      },
      transport: {
        name: 'Transporte',
        base_weight: 5800,
        max_takeoff_weight: 12000,
        g_limit: 4,
        hardpoints: 2,
        internal_fuel_kg: 2500,
        advantages: ['Enorme capacidade', 'Excelente alcance', 'Múltiplas configurações'],
        disadvantages: ['Muito lento', 'Vulnerável', 'Caro']
      }
    };

    return airframes[airframe] || airframes.light_fighter;
  }

  updateAirframeInfo(airframe, nameElement, specsElement, characteristicsElement, containerElement) {
    const data = this.getAirframeData(airframe);

    nameElement.textContent = data.name;

    // Update specs
    specsElement.innerHTML = `
      <div class="flex justify-between"><span>Peso Base:</span><span>${data.base_weight} kg</span></div>
      <div class="flex justify-between"><span>Peso Máx Decolagem:</span><span>${data.max_takeoff_weight} kg</span></div>
      <div class="flex justify-between"><span>Limite G:</span><span>${data.g_limit}G</span></div>
      <div class="flex justify-between"><span>Hardpoints:</span><span>${data.hardpoints}</span></div>
      <div class="flex justify-between"><span>Combustível Interno:</span><span>${data.internal_fuel_kg} kg</span></div>
    `;

    // Update characteristics
    characteristicsElement.innerHTML = `
      <div>
        <h5 class="text-green-400 font-medium mb-1">Vantagens:</h5>
        ${data.advantages.map(adv => `<div class="flex items-center gap-2"><span class="text-green-400">•</span>${adv}</div>`).join('')}
      </div>
      <div class="mt-3">
        <h5 class="text-red-400 font-medium mb-1">Desvantagens:</h5>
        ${data.disadvantages.map(dis => `<div class="flex items-center gap-2"><span class="text-red-400">•</span>${dis}</div>`).join('')}
      </div>
    `;

    containerElement.classList.remove('hidden');
  }

  async loadAirframeTab() {
    console.log('🔄 Loading Airframe Tab...');

    // Check if components are loaded
    if (!window.AIRCRAFT_COMPONENTS || !window.AIRCRAFT_COMPONENTS.airframes) {
      console.warn('⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...');
      // Show loading state
      this.showLoadingState('Carregando componentes de aeronaves...');

      try {
        // Use optimized component loading with caching
        await this.ensureComponentsLoaded(['airframes']);
        console.log('✅ Components loaded, retrying...');
        this.loadAirframeTab();
      } catch (error) {
        console.error('❌ Failed to load components:', error);
        this.showEmptyState('Erro ao carregar componentes de aeronaves.');
      }
      return;
    }
    
    // Update tech level first
    this.updateTechLevel();
    
    const allData = window.AIRCRAFT_COMPONENTS?.airframes || {};
    const ids = Object.keys(allData);
    if (ids.length === 0) return this.showEmptyState('Nenhuma fuselagem disponível.');

    console.log(`📊 Found ${ids.length} airframes in data`);

    // Filter components based on tech level - show all but mark unavailable ones
    const availableData = this.filterAvailableComponents(allData);
    
    console.log(`🔬 Airframes: ${Object.keys(availableData).length} available out of ${ids.length} total`);

    // Organiza as fuselagens em famílias tecnológicas (using all data for better organization)
    const families = this.organizeTechFamilies(allData);
    
    // Renderiza o HTML completo da timeline with tech restrictions
    const html = this.renderTechTreeInterface(families, allData);
    this.getTabContent().innerHTML = html;
    
    // Setup event listeners para as tabs depois do HTML ser inserido
    this.setupTechTreeTabs(families);
  }

  renderTechTreeInterface(families) {
    return `
      <!-- Header Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-100 tracking-tight">Árvores Tecnológicas – Fuselagens (1954–1980)</h2>
            <p class="text-slate-400 mt-1">Layout em timeline vertical com progressão tecnológica</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-slate-400">Selecionada:</div>
            <div class="text-lg font-semibold text-cyan-300" id="selected-airframe-name">Nenhuma</div>
          </div>
        </div>
      </div>

      <!-- Technology Trees Tabs -->
      <nav class="flex flex-wrap gap-2 mb-8">
        <button class="tech-tree-tab active" data-tree="fighters">
          <span class="icon">✈️</span>
          <span class="label">Caças</span>
        </button>
        <button class="tech-tree-tab" data-tree="bombers">
          <span class="icon">🎯</span>
          <span class="label">Bombardeiros</span>
        </button>
        <button class="tech-tree-tab" data-tree="attackers">
          <span class="icon">💥</span>
          <span class="label">Aeronaves de Ataque</span>
        </button>
        <button class="tech-tree-tab" data-tree="transports">
          <span class="icon">📦</span>
          <span class="label">Transportes</span>
        </button>
        <button class="tech-tree-tab" data-tree="helicopters">
          <span class="icon">🚁</span>
          <span class="label">Helicópteros</span>
        </button>
      </nav>

      <!-- Timeline Section -->
      <section class="relative mb-8">
        <!-- Central Spine -->
        <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400/60 via-cyan-300/30 to-cyan-400/60 rounded-full"></div>

        <!-- Timeline Content -->
        <div id="tech-timeline" class="grid grid-cols-1 gap-6">
          ${this.renderTechTimelineContent('fighters', families)}
        </div>
      </section>

      <!-- Legend -->
      <div class="mt-10 grid sm:grid-cols-3 gap-3 text-xs">
        <div class="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <div class="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <span>📖</span>
            <span>Como usar</span>
          </div>
          <p class="text-slate-400">A timeline avança de cima para baixo. Cada cartão é uma fuselagem disponível. Clique para selecionar e ver os pré-requisitos.</p>
        </div>
        <div class="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <div class="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <span>🏷️</span>
            <span>Tags de Categoria</span>
          </div>
          <div class="flex gap-2 flex-wrap mt-2">
            <span class="tag-piston">Pistão</span>
            <span class="tag-subsonic">Sub/Transônico</span>
            <span class="tag-supersonic">Supersônico</span>
            <span class="tag-special">Especializado</span>
          </div>
        </div>
        <div class="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <div class="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <span>⚡</span>
            <span>Progressão</span>
          </div>
          <p class="text-slate-400">Fuselagens destacadas são marcos importantes. Siga a linha cronológica para desbloquear tecnologias avançadas.</p>
        </div>
      </div>

      <style>
        /* Tech Tree Tabs */
        .tech-tree-tab {
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid rgb(51 65 85 / 0.5);
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgb(30 41 59 / 0.5);
          color: rgb(148 163 184);
          cursor: pointer;
        }
        .tech-tree-tab:hover {
          color: rgb(241 245 249);
          background: rgb(51 65 85 / 0.5);
        }
        .tech-tree-tab.active {
          background: rgb(6 182 212 / 0.15);
          color: rgb(165 243 252);
          border-color: rgb(6 182 212 / 0.4);
        }
        .tech-tree-tab .icon {
          font-size: 16px;
        }

        /* Timeline Node Cards */
        .timeline-node-card {
          position: relative;
          width: 100%;
          max-width: 480px;
          border-radius: 16px;
          backdrop-filter: blur(8px);
          padding: 16px 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border: 1px solid rgb(51 65 85 / 0.4);
          transition: all 0.2s;
          cursor: pointer;
          background: rgb(30 41 59 / 0.4);
        }
        .timeline-node-card:hover {
          background: rgb(51 65 85 / 0.5);
          border-color: rgb(71 85 105 / 0.5);
        }
        .timeline-node-card.selected {
          border-color: rgb(6 182 212 / 0.6);
          background: rgb(8 145 178 / 0.2);
          box-shadow: 0 0 0 1px rgb(6 182 212 / 0.3);
        }
        .timeline-node-card.highlight {
          border-color: rgb(16 185 129 / 0.4);
          box-shadow: 0 0 20px rgba(16,185,129,0.15);
        }
        .timeline-node-card.left {
          margin-left: auto;
          padding-right: 24px;
        }
        .timeline-node-card.right {
          margin-right: auto;
          padding-left: 24px;
        }

        /* Node connector dots */
        .timeline-node-card.left::before {
          content: '';
          position: absolute;
          top: 24px;
          right: 0;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(6 182 212);
          box-shadow: 0 0 0 4px rgba(6,182,212,0.15);
        }
        .timeline-node-card.right::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 0;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(6 182 212);
          box-shadow: 0 0 0 4px rgba(6,182,212,0.15);
        }
        .timeline-node-card.selected::before {
          background: rgb(16 185 129);
          box-shadow: 0 0 0 4px rgba(16,185,129,0.15);
        }

        /* Era Pills */
        .era-pill {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: rgb(199 210 254);
          background: rgb(99 102 241 / 0.1);
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgb(99 102 241 / 0.3);
        }

        /* Technology Tags */
        .tag-piston {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(100 116 139 / 0.1);
          color: rgb(148 163 184);
          border: 1px solid rgb(100 116 139 / 0.3);
        }
        .tag-subsonic {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(59 130 246 / 0.1);
          color: rgb(147 197 253);
          border: 1px solid rgb(59 130 246 / 0.3);
        }
        .tag-supersonic {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(244 63 94 / 0.1);
          color: rgb(251 113 133);
          border: 1px solid rgb(244 63 94 / 0.3);
        }
        .tag-special {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(245 158 11 / 0.1);
          color: rgb(252 211 77);
          border: 1px solid rgb(245 158 11 / 0.3);
        }

        /* Decade Tick */
        .decade-tick {
          position: relative;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: rgb(148 163 184);
        }
        .decade-tick span {
          padding: 4px 8px;
          border-radius: 6px;
          background: rgb(30 41 59 / 0.5);
          border: 1px solid rgb(51 65 85 / 0.5);
        }
        .decade-tick::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background: rgb(103 232 249);
          box-shadow: 0 0 0 6px rgba(6,182,212,0.12);
        }

        /* Meta data grid */
        .node-meta {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 16px;
          font-size: 12px;
          color: rgb(148 163 184);
        }
        .node-meta .meta-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgb(51 65 85 / 0.3);
          padding-bottom: 2px;
        }
        .node-meta .meta-key {
          color: rgb(100 116 139);
        }
        .node-meta .meta-value {
          font-weight: 500;
          color: rgb(226 232 240);
        }
      </style>
    `;
  }

  organizeTechFamilies(data) {
    const families = {
      fighters: { label: "Caças", items: [] },
      bombers: { label: "Bombardeiros", items: [] },
      attackers: { label: "Aeronaves de Ataque", items: [] },
      transports: { label: "Transportes", items: [] },
      helicopters: { label: "Helicópteros", items: [] }
    };

    Object.entries(data).forEach(([id, airframe]) => {
      if (!this.isAvailable(airframe)) return;
      
      const family = airframe.tech_tree || 'fighters';
      if (families[family]) {
        families[family].items.push({ id, ...airframe });
      }
    });

    // Ordena por ano de introdução
    Object.values(families).forEach(family => {
      family.items.sort((a, b) => (a.year_introduced || 0) - (b.year_introduced || 0));
    });

    return families;
  }

  loadTechTimeline(familyKey, families) {
    const family = families[familyKey];
    if (!family || family.items.length === 0) {
      const tabContent = this.getTabContent();
      const timelineContainer = tabContent.querySelector('#tech-timeline');
      if (timelineContainer) {
        timelineContainer.innerHTML = '<div class="text-center py-8 text-slate-400">Nenhuma aeronave disponível nesta categoria.</div>';
      }
      return;
    }

    const html = this.renderTechTimelineContent(familyKey, families);

    // Carrega o HTML da timeline
    const tabContent = this.getTabContent();
    const timelineContainer = tabContent.querySelector('#tech-timeline');
    if (timelineContainer) {
      timelineContainer.innerHTML = html;
    }
  }

  renderTechTimelineContent(familyKey, families) {
    const family = families[familyKey];
    if (!family || family.items.length === 0) {
      return '<div class="text-center py-8 text-slate-400">Nenhuma aeronave disponível nesta categoria.</div>';
    }

    let html = '';
    family.items.forEach((item, index) => {
      const side = index % 2 === 0 ? 'left' : 'right';
      const decade = this.getDecadeLabel(item.year_introduced);
      
      html += this.renderTimelineItem(item, side, decade, index);
    });

    return html;
  }

  renderTimelineItem(item, side, decade, index) {
    const isSelected = window.currentAircraft?.airframe === item.id;
    const tags = this.generateTechTags(item);
    const meta = this.generateMetaData(item);
    const isHighlight = this.isHighlightNode(item);

    return `
      <div class="relative">
        <!-- Decade Tick -->
        <div class="decade-tick">
          <span>${decade}</span>
        </div>
        
        <!-- Timeline Item -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6">
          ${side === 'left' ? `
            <div class="timeline-node-card left ${isSelected ? 'selected' : ''} ${isHighlight ? 'highlight' : ''}" 
                 onclick="selectAirframe('${item.id}')" data-airframe-id="${item.id}">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base sm:text-lg font-semibold text-slate-100 leading-tight">${item.name}</h3>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    ${tags.join('')}
                  </div>
                </div>
                <span class="era-pill">${item.tech_era || 'Unknown'}</span>
              </div>
              ${meta.length > 0 ? `
                <div class="node-meta">
                  ${meta.map(m => `
                    <div class="meta-item">
                      <div class="meta-key">${m.k}</div>
                      <div class="meta-value">${m.v}</div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${item.prerequisites && item.prerequisites.length > 0 ? `
                <div class="prerequisites-indicator ${this.hasPrerequisites(item) ? 'locked' : ''}"></div>
              ` : ''}
            </div>
            <div></div>
          ` : `
            <div></div>
            <div class="timeline-node-card right ${isSelected ? 'selected' : ''} ${isHighlight ? 'highlight' : ''}" 
                 onclick="selectAirframe('${item.id}')" data-airframe-id="${item.id}">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base sm:text-lg font-semibold text-slate-100 leading-tight">${item.name}</h3>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    ${tags.join('')}
                  </div>
                </div>
                <span class="era-pill">${item.tech_era || 'Unknown'}</span>
              </div>
              ${meta.length > 0 ? `
                <div class="node-meta">
                  ${meta.map(m => `
                    <div class="meta-item">
                      <div class="meta-key">${m.k}</div>
                      <div class="meta-value">${m.v}</div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              ${item.prerequisites && item.prerequisites.length > 0 ? `
                <div class="prerequisites-indicator ${this.hasPrerequisites(item) ? 'locked' : ''}"></div>
              ` : ''}
            </div>
          `}
        </div>
      </div>
    `;
  }

  generateTechTags(item) {
    const tags = [];
    
    if (item.tech_era === 'piston') {
      tags.push('<span class="tag-piston">Pistão</span>');
    } else if (item.max_speed_kph >= 1200) {
      tags.push('<span class="tag-supersonic">Supersônico</span>');
    } else if (item.tech_era?.includes('jet') || item.max_speed_kph >= 800) {
      tags.push('<span class="tag-subsonic">Sub/Transônico</span>');
    }
    
    if (item.category === 'helicopter' || item.role === 'reconnaissance') {
      tags.push('<span class="tag-special">Especializado</span>');
    }
    
    return tags;
  }

  generateMetaData(item) {
    return [
      { k: 'Vel Máx', v: `${Math.round(item.max_speed_kph || 0)} km/h` },
      { k: 'G-Limit', v: `${item.g_limit || 0}` },
      { k: 'Peso', v: `${Math.round((item.base_weight || 0) / 1000)} t` },
      { k: 'Ano', v: `${item.year_introduced || '?'}` }
    ];
  }

  getDecadeLabel(year) {
    if (year >= 1945 && year <= 1950) return '1945–50';
    if (year >= 1950 && year <= 1954) return '1950–54';
    if (year >= 1954 && year <= 1958) return '1954–58';
    if (year >= 1958 && year <= 1962) return '1958–62';
    return `${year}`;
  }

  isHighlightNode(item) {
    // Destaca marcos tecnológicos importantes
    return item.tech_level >= 65 || item.max_speed_kph >= 1400;
  }

  hasPrerequisites(item) {
    // Verifica se os pré-requisitos foram atendidos
    return false; // Simplificado por enquanto
  }

  setupTechTreeTabs(families) {
    const tabs = document.querySelectorAll('.tech-tree-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        // Remove active de todas as tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Adiciona active na tab clicada
        tab.classList.add('active');
        
        // Carrega a timeline da família selecionada
        const familyKey = tab.dataset.tree;
        this.loadTechTimeline(familyKey, families);
      });
    });
  }

  renderAirframeCard(id, af) {
    const isSelected = window.currentAircraft?.airframe === id;
    const maxKph = af.max_speed_kph || 0;
    const weight = af.base_weight || 0;
    const mtow = af.max_takeoff_weight || 0;
    
    // Check tech level availability
    const availability = this.getComponentAvailabilityInfo(af);
    const statusClass = this.getComponentStatusClass(af);
    
    const baseClasses = isSelected ? 
      'selected border-brand-400 ring-1 ring-brand-400/50' : 
      'border-slate-700/50 bg-slate-800/40';
    
    const techClasses = availability.isAvailable ? 
      '' : 
      'opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10';
    
    const clickHandler = availability.isAvailable ? 
      `onclick="selectAirframe('${id}')"` : 
      `onclick="showTechRequirement('${af.name}', ${availability.requiredTech}, ${availability.currentTech})"`;
    
    return `
      <button class="airframe-card component-card relative w-full text-left rounded-2xl p-4 border transition ${baseClasses} ${techClasses}" ${clickHandler}>
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-base font-semibold text-slate-100">${af.name}</h4>
          <span class="px-2 py-0.5 text-xs rounded-lg text-white ${maxKph >= 1200 ? 'bg-red-600' : 'bg-blue-600'}">${maxKph >= 1200 ? 'Supersônico' : 'Sub- ou Transônico'}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>Base: <b>${Math.round(weight)} kg</b></div>
          <div>MTOW: <b>${Math.round(mtow)} kg</b></div>
          <div>Vel Máx: <b>${Math.round(maxKph)} km/h</b></div>
          <div>G-Limit: <b>${af.g_limit ?? 6}</b></div>
        </div>
        
        <!-- Tech Level Indicator -->
        <div class="mt-2 flex items-center justify-between">
          <div class="text-xs">
            <span class="text-slate-400">Tech Level:</span>
            <span class="${availability.isAvailable ? 'text-green-400' : 'text-red-400'} font-semibold">
              ${availability.requiredTech}
            </span>
          </div>
          ${!availability.isAvailable ? 
            `<div class="flex items-center gap-1">
              <span class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <span class="text-red-400 text-xs">🔒</span>
              </span>
              <span class="text-xs text-red-400">Requer ${availability.missingTech} tech</span>
            </div>` : 
            ''}
        </div>
        
        ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
      </button>`;
  }

  async loadWingsTab() {
    console.log('🔄 Loading Wings Tab...');

    try {
      // Load the new intuitive wings template
      const template = await this.loadOptimizedTemplate('templates/aircraft-creator/wings-tab.html');

      // Inject with smooth transition
      optimizedTemplateLoader.injectWithTransition(this.getTabContent(), template);

      // Initialize the new wings interface
      setTimeout(() => {
        this.initializeWingsInterface();
      }, 100);

    } catch (error) {
      console.error('❌ Failed to load wings tab template:', error);
      this.showEmptyState('Erro ao carregar a aba de Asas.');
    }
  }

  initializeWingsInterface() {
    console.log('🦅 Initializing intuitive wings interface...');

    // Default selections
    this.selectedWingType = 'straight';
    this.selectedWingSize = 'medium';
    this.selectedFlaps = 'basic';
    this.selectedControls = 'standard';

    // Set up event listeners for wing type cards
    document.querySelectorAll('.wing-card').forEach(card => {
      card.addEventListener('click', () => {
        const wingType = card.dataset.wingType;
        this.selectWingType(wingType);
      });
    });

    // Set up event listeners for wing size cards
    document.querySelectorAll('.size-card').forEach(card => {
      card.addEventListener('click', () => {
        const size = card.dataset.size;
        this.selectWingSize(size);
      });
    });

    // Set up event listeners for flap options
    document.querySelectorAll('.flap-option').forEach(option => {
      option.addEventListener('click', () => {
        const flapType = option.dataset.flap;
        this.selectFlaps(flapType);
      });
    });

    // Set up event listeners for control options
    document.querySelectorAll('.control-option').forEach(option => {
      option.addEventListener('click', () => {
        const controlType = option.dataset.control;
        this.selectControls(controlType);
      });
    });

    // Set defaults
    this.selectWingType(this.selectedWingType);
    this.selectWingSize(this.selectedWingSize);
    this.selectFlaps(this.selectedFlaps);
    this.selectControls(this.selectedControls);

    console.log('✅ Wings interface initialized successfully');
  }

  selectWingType(wingType) {
    this.selectedWingType = wingType;

    // Update visual selection
    document.querySelectorAll('.wing-card').forEach(card => {
      const isSelected = card.dataset.wingType === wingType;
      card.classList.toggle('border-cyan-400', isSelected);
      card.classList.toggle('bg-cyan-900/20', isSelected);
      card.classList.toggle('ring-1', isSelected);
      card.classList.toggle('ring-cyan-400/50', isSelected);
    });

    // Update aircraft configuration
    if (!window.currentAircraft.wings) window.currentAircraft.wings = {};
    window.currentAircraft.wings.type = wingType;

    this.updateWingPerformance();
    this.updateWingRecommendations();

    console.log(`🦅 Wing type selected: ${wingType}`);
  }

  selectWingSize(size) {
    this.selectedWingSize = size;

    // Update visual selection
    document.querySelectorAll('.size-card').forEach(card => {
      const isSelected = card.dataset.size === size;
      card.classList.toggle('border-cyan-400', isSelected);
      card.classList.toggle('bg-cyan-900/20', isSelected);
      card.classList.toggle('ring-1', isSelected);
      card.classList.toggle('ring-cyan-400/50', isSelected);
    });

    // Update aircraft configuration
    if (!window.currentAircraft.wings) window.currentAircraft.wings = {};
    window.currentAircraft.wings.size = size;

    this.updateWingPerformance();

    console.log(`📏 Wing size selected: ${size}`);
  }

  selectFlaps(flapType) {
    this.selectedFlaps = flapType;

    // Update visual selection
    document.querySelectorAll('.flap-option').forEach(option => {
      const isSelected = option.dataset.flap === flapType;
      option.classList.toggle('border-cyan-500', isSelected);
      option.classList.toggle('bg-cyan-900/20', isSelected);
    });

    // Update aircraft configuration
    if (!window.currentAircraft.wings) window.currentAircraft.wings = {};
    window.currentAircraft.wings.flaps = flapType;

    this.updateWingPerformance();

    console.log(`⬆️ Flaps selected: ${flapType}`);
  }

  selectControls(controlType) {
    this.selectedControls = controlType;

    // Update visual selection
    document.querySelectorAll('.control-option').forEach(option => {
      const isSelected = option.dataset.control === controlType;
      option.classList.toggle('border-cyan-500', isSelected);
      option.classList.toggle('bg-cyan-900/20', isSelected);
    });

    // Update aircraft configuration
    if (!window.currentAircraft.wings) window.currentAircraft.wings = {};
    window.currentAircraft.wings.controls = controlType;

    this.updateWingPerformance();

    console.log(`🎮 Controls selected: ${controlType}`);
  }

  updateWingPerformance() {
    const performance = this.calculateWingPerformance();

    // Update performance displays
    const liftRating = document.getElementById('lift-rating');
    const maneuverRating = document.getElementById('maneuver-rating');
    const speedRating = document.getElementById('speed-rating');
    const stabilityRating = document.getElementById('stability-rating');

    if (liftRating) liftRating.textContent = performance.lift;
    if (maneuverRating) maneuverRating.textContent = performance.maneuverability;
    if (speedRating) speedRating.textContent = performance.speed;
    if (stabilityRating) stabilityRating.textContent = performance.stability;

    // Trigger global calculations
    if (typeof window.updateAircraftCalculations === 'function') {
      window.updateAircraftCalculations();
    }
  }

  calculateWingPerformance() {
    const wingTypePerformance = {
      straight: { lift: 7, maneuverability: 6, speed: 5, stability: 9 },
      swept: { lift: 6, maneuverability: 7, speed: 9, stability: 7 },
      delta: { lift: 5, maneuverability: 4, speed: 10, stability: 8 },
      variable: { lift: 8, maneuverability: 9, speed: 9, stability: 6 },
      'forward-swept': { lift: 8, maneuverability: 10, speed: 7, stability: 4 },
      canard: { lift: 7, maneuverability: 9, speed: 8, stability: 7 }
    };

    const sizeModifiers = {
      small: { lift: -1, maneuverability: +2, speed: +1, stability: -1 },
      medium: { lift: 0, maneuverability: 0, speed: 0, stability: 0 },
      large: { lift: +2, maneuverability: -2, speed: -1, stability: +1 }
    };

    const flapModifiers = {
      basic: { lift: 0, maneuverability: 0, speed: 0, stability: 0 },
      advanced: { lift: +1, maneuverability: 0, speed: -1, stability: 0 },
      modern: { lift: +2, maneuverability: +1, speed: -1, stability: +1 }
    };

    const controlModifiers = {
      standard: { lift: 0, maneuverability: 0, speed: 0, stability: 0 },
      enhanced: { lift: 0, maneuverability: +2, speed: 0, stability: -1 },
      'fly-by-wire': { lift: +1, maneuverability: +3, speed: 0, stability: +2 }
    };

    const base = wingTypePerformance[this.selectedWingType] || wingTypePerformance.straight;
    const sizeMod = sizeModifiers[this.selectedWingSize] || sizeModifiers.medium;
    const flapMod = flapModifiers[this.selectedFlaps] || flapModifiers.basic;
    const controlMod = controlModifiers[this.selectedControls] || controlModifiers.standard;

    return {
      lift: Math.max(1, Math.min(10, base.lift + sizeMod.lift + flapMod.lift + controlMod.lift)),
      maneuverability: Math.max(1, Math.min(10, base.maneuverability + sizeMod.maneuverability + flapMod.maneuverability + controlMod.maneuverability)),
      speed: Math.max(1, Math.min(10, base.speed + sizeMod.speed + flapMod.speed + controlMod.speed)),
      stability: Math.max(1, Math.min(10, base.stability + sizeMod.stability + flapMod.stability + controlMod.stability))
    };
  }

  updateWingRecommendations() {
    const categoryCompatibility = {
      fighter: ['swept', 'delta', 'canard'],
      bomber: ['straight', 'swept'],
      transport: ['straight'],
      helicopter: ['straight'],
      attacker: ['straight', 'swept']
    };

    const currentCategory = window.currentAircraft?.category || 'fighter';
    const recommended = categoryCompatibility[currentCategory] || [];

    if (recommended.includes(this.selectedWingType)) {
      document.getElementById('wing-recommendations')?.classList.add('hidden');
    } else {
      this.showWingRecommendations(recommended);
    }
  }

  showWingRecommendations(recommendedTypes) {
    const recommendationsDiv = document.getElementById('wing-recommendations');
    const contentDiv = document.getElementById('recommendations-content');

    if (!recommendationsDiv || !contentDiv) return;

    contentDiv.innerHTML = recommendedTypes.map(type => {
      const names = {
        straight: 'Asa Reta',
        swept: 'Asa Enflechada',
        delta: 'Asa Delta',
        variable: 'Geometria Variável',
        'forward-swept': 'Enflechamento Inverso',
        canard: 'Configuração Canard'
      };

      return `
        <div class="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <div class="text-yellow-400 font-medium">💡 Recomendação</div>
          <div class="text-sm text-slate-300 mt-1">
            ${names[type]} seria mais adequada para este tipo de aeronave.
          </div>
        </div>
      `;
    }).join('');

    recommendationsDiv.classList.remove('hidden');
  }


  loadPropulsionTab() {
    console.log('🔄 Loading Propulsion Tab (Engines)...');
    this.loadEngineTab();
  }

  async loadEngineTab() {
    console.log('🔄 Loading Engine Tab...');

    // Check if components are loaded
    if (!window.AIRCRAFT_COMPONENTS || !window.AIRCRAFT_COMPONENTS.aircraft_engines) {
      console.warn('⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...');

      try {
        this.showLoadingState('Carregando motores de aeronaves...');
        await this.ensureComponentsLoaded(['aircraft_engines']);
        console.log('✅ Components loaded, retrying...');
        this.loadEngineTab();
      } catch (error) {
        console.error('❌ Failed to load components:', error);
        this.showEmptyState('Erro ao carregar componentes de aeronaves.');
      }
      return;
    }

    // Update tech level first
    this.updateTechLevel();

    const allData = window.AIRCRAFT_COMPONENTS?.aircraft_engines || {};
    const ids = Object.keys(allData);
    if (ids.length === 0) return this.showEmptyState('Nenhum motor disponível.');
    if (!window.currentAircraft?.airframe) return this.showEmptyState('Selecione uma fuselagem primeiro.');

    console.log(`📊 Found ${ids.length} engines in data`);

    // Create the new intuitive propulsion interface
    const html = this.createModernPropulsionInterface(allData);
    this.getTabContent().innerHTML = html;

    // Initialize the interface
    setTimeout(() => {
      this.initializePropulsionInterface(allData);
    }, 100);
  }

  createModernPropulsionInterface(allData) {
    const aircraftCategory = window.currentAircraft?.category || 'fighter';

    return `
      <!-- Modern Propulsion Interface -->
      <div id="aircraft-propulsion" class="space-y-6">

        <!-- Section Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">🚀</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Sistema de Propulsão</h2>
            <p class="text-sm text-slate-400">Escolha o motor ideal para sua aeronave</p>
          </div>
        </div>

        <!-- Engine Tuning & Speed Meter -->
        <div class="mb-8 p-6 bg-slate-800/30 rounded-lg border border-slate-600/30">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>Ajuste de Potência/Empuxo</span>
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Power scale -->
            <div class="col-span-2">
              <label class="block text-sm text-slate-400 mb-2">Nível de Potência/Empuxo</label>
              <input type="range" id="engine-power-scale" min="80" max="120" step="1" value="100"
                     class="w-full">
              <div class="mt-1 text-xs text-slate-400">
                <span>Escala:</span> <span id="engine-power-scale-display" class="text-cyan-300 font-medium">100%</span>
                <span class="ml-2 text-slate-500">(impacta custo, consumo e confiabilidade)</span>
              </div>
            </div>

            <!-- Altitude for prediction -->
            <div>
              <label class="block text-sm text-slate-400 mb-2">Altitude p/ previsão (m)</label>
              <input type="range" id="speed-altitude" min="0" max="15000" step="500" value="0" class="w-full">
              <div class="mt-1 text-xs text-slate-400">Altitude: <span id="speed-altitude-display" class="text-cyan-300 font-medium">0 m</span></div>
            </div>
          </div>

          <!-- Predicted speed & trade-offs -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div class="p-3 bg-slate-900/40 rounded border border-slate-700/40 text-center">
              <div class="text-xs text-slate-400">Velocidade Prevista</div>
              <div id="predicted-speed-display" class="text-2xl font-bold text-cyan-300">— km/h</div>
            </div>
            <div class="p-3 bg-slate-900/40 rounded border border-slate-700/40 text-center">
              <div class="text-xs text-slate-400">Consumo</div>
              <div id="tuning-consumption-display" class="text-lg text-slate-200">—</div>
            </div>
            <div class="p-3 bg-slate-900/40 rounded border border-slate-700/40 text-center">
              <div class="text-xs text-slate-400">Confiabilidade</div>
              <div id="tuning-reliability-display" class="text-lg text-slate-200">—</div>
            </div>
          </div>
        </div>

        <!-- Engine Type Categories -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>Tipos de Motor</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <!-- Piston Engines -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-orange-500/50 transition-all duration-200" data-filter="piston">
              <div class="text-center">
                <div class="text-3xl mb-2">🛩️</div>
                <h4 class="font-semibold text-slate-200">Motor a Pistão</h4>
                <p class="text-xs text-slate-400 mt-2">Confiável (1945-1955)</p>
                <div class="mt-2 text-xs text-slate-500">Potência: 500-3000 HP</div>
              </div>
            </div>

            <!-- Early Jets -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-blue-500/50 transition-all duration-200" data-filter="early_jet">
              <div class="text-center">
                <div class="text-3xl mb-2">💨</div>
                <h4 class="font-semibold text-slate-200">Primeiro Jato</h4>
                <p class="text-xs text-slate-400 mt-2">Turbojet (1950-1965)</p>
                <div class="mt-2 text-xs text-slate-500">Empuxo: 1000-8000 kgf</div>
              </div>
            </div>

            <!-- Modern Jets -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition-all duration-200" data-filter="modern_jet">
              <div class="text-center">
                <div class="text-3xl mb-2">🚀</div>
                <h4 class="font-semibold text-slate-200">Jato Moderno</h4>
                <p class="text-xs text-slate-400 mt-2">Turbofan (1960-1990)</p>
                <div class="mt-2 text-xs text-slate-500">Empuxo: 3000-20000 kgf</div>
              </div>
            </div>

            <!-- Turboprop -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-green-500/50 transition-all duration-200" data-filter="turboprop">
              <div class="text-center">
                <div class="text-3xl mb-2">🌪️</div>
                <h4 class="font-semibold text-slate-200">Turboprop</h4>
                <p class="text-xs text-slate-400 mt-2">Eficiente (1955-1990)</p>
                <div class="mt-2 text-xs text-slate-500">Potência: 1000-5000 HP</div>
              </div>
            </div>

          </div>

          <!-- Filter Controls -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="all">
              Todas as Eras
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1945-1955">
              1945-1955
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1955-1965">
              1955-1965
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1965-1975">
              1965-1975
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1975-1990">
              1975-1990
            </button>
          </div>
        </div>

        <!-- Engines Grid -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>🔧</span>
            <span>Motores Disponíveis</span>
          </h3>

          <div id="engines-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Engines will be populated here -->
          </div>
        </div>

        <!-- Recommendations -->
        <div id="engine-recommendations" class="hidden">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>Recomendações</span>
          </h3>

          <div id="recommendation-cards" class="space-y-3">
            <!-- Recommendations will be populated -->
          </div>
        </div>

        <!-- Selected Engine Info -->
        <div id="selected-engine-info" class="hidden">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span>Motor Selecionado</span>
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
              <h4 class="font-semibold text-slate-200 mb-3">Especificações</h4>
              <div id="engine-specs" class="space-y-2 text-sm">
                <!-- Specs will be populated -->
              </div>
            </div>

            <div class="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
              <h4 class="font-semibold text-slate-200 mb-3">Performance</h4>
              <div id="engine-performance" class="space-y-2 text-sm">
                <!-- Performance will be populated -->
              </div>
            </div>
          </div>
        </div>

      </div>
    `;
  }

  initializePropulsionInterface(allData) {
    console.log('🚀 Initializing modern propulsion interface...');

    this.selectedEngine = null;
    this.currentFilter = 'all';
    this.currentEraFilter = 'all';

    // Populate engines initially
    this.populateEnginesGrid(allData);

    // Set up engine type filters
    document.querySelectorAll('.engine-type-filter').forEach(filter => {
      filter.addEventListener('click', () => {
        this.currentFilter = filter.dataset.filter;
        this.updateEngineTypeFilters();
        this.filterEngines(allData);
      });
    });

    // Set up era filters
    document.querySelectorAll('.era-filter').forEach(filter => {
      filter.addEventListener('click', () => {
        this.currentEraFilter = filter.dataset.era;
        this.updateEraFilters();
        this.filterEngines(allData);
      });
    });

    // Attach tuning listeners (delegated, elements exist in this tab)
    this.attachTuningListeners();

    // Set default filter to 'all'
    this.currentFilter = 'all';
    this.currentEraFilter = 'all';

    // Show recommendations based on aircraft category
    this.updateEngineRecommendations(allData);

  }

  // --- Tuning system ---
  attachTuningListeners() {
    const powerEl = document.getElementById('engine-power-scale');
    const powerOut = document.getElementById('engine-power-scale-display');
    const altEl = document.getElementById('speed-altitude');
    const altOut = document.getElementById('speed-altitude-display');

    const sync = () => {
      if (powerEl && powerOut) powerOut.textContent = `${powerEl.value}%`;
      if (altEl && altOut) altOut.textContent = `${altEl.value} m`;
      // Persist scale
      if (!window.currentAircraft) window.currentAircraft = {};
      window.currentAircraft.enginePowerScale = (parseInt(powerEl?.value || '100', 10)) / 100;
      window.currentAircraft.predictionAltitude = parseInt(altEl?.value || '0', 10);
      // Recompute if an engine is selected
      this.updateTuningImpact();
    };

    if (powerEl) powerEl.addEventListener('input', sync);
    if (altEl) altEl.addEventListener('input', sync);

    // Initialize once
    sync();
  }

  getTuningRange(engine) {
    // Conservative ranges by engine family
    if (!engine) return { min: 0.8, max: 1.2 };
    const type = engine.type || '';
    if (type.startsWith('afterburning')) return { min: 0.9, max: 1.15 };
    if (type.includes('turbofan')) return { min: 0.85, max: 1.15 };
    if (type.includes('turboprop')) return { min: 0.9, max: 1.2 };
    if (type.includes('piston')) return { min: 0.8, max: 1.25 };
    return { min: 0.85, max: 1.2 };
  }

  tuneEngine(engine, scale) {
    // Return a shallow copy with tuned thrust/power, consumption and reliability/cost
    const e = { ...engine };
    const s = Math.max(0.5, Math.min(1.5, scale || 1));

    // Determine whether engine uses thrust or power_hp
    const isPiston = typeof e.power_hp === 'number';
    const baseThrust = e.thrust ?? e.military_thrust ?? e.equivalent_thrust_kgf ?? 0;
    const basePower = e.power_hp ?? 0;

    if (isPiston) {
      e.power_hp = Math.round(basePower * s);
      e.power_kgf = e.power_kgf ? Math.round(e.power_kgf * s) : e.power_kgf;
      // Fuel scales supra-linear when uprated, sub-linear when derated
      const f = e.fuel_consumption_full ?? e.fuel_consumption ?? 0.2;
      const fuelFactor = s >= 1 ? (1 + 0.6 * (s - 1) + 0.6 * (s - 1) * (s - 1)) : (1 - 0.4 * (1 - s));
      e.fuel_consumption_full = parseFloat((f * fuelFactor).toFixed(3));
    } else {
      // Jet/propulsive engines
      const ab = typeof e.afterburner_thrust === 'number';
      if (ab) {
        e.military_thrust = Math.round((e.military_thrust || baseThrust) * s);
        e.afterburner_thrust = Math.round((e.afterburner_thrust || baseThrust) * s);
      } else if (typeof baseThrust === 'number') {
        e.thrust = Math.round(baseThrust * s);
      }
      const f = e.fuel_consumption ?? e.sfc_military ?? 1.0;
      const fuelFactor = s >= 1 ? (1 + 0.5 * (s - 1) + 0.7 * (s - 1) * (s - 1)) : (1 - 0.35 * (1 - s));
      if (typeof e.fuel_consumption === 'number') e.fuel_consumption = parseFloat((f * fuelFactor).toFixed(3));
      if (typeof e.sfc_military === 'number') e.sfc_military = parseFloat((f * fuelFactor).toFixed(3));
      if (typeof e.afterburner_fuel_consumption === 'number') {
        e.afterburner_fuel_consumption = parseFloat((e.afterburner_fuel_consumption * fuelFactor).toFixed(3));
      }
    }

    // Reliability and maintenance trade-off
    const baseRel = (e.reliability ?? 0.85) * 100;
    const relPenalty = s >= 1 ? (12 * (s - 1) + 10 * (s - 1) * (s - 1)) : (-6 * (1 - s));
    e.reliability = Math.max(50, Math.min(98, (baseRel - relPenalty))) / 100;

    // Cost multiplier grows with uprating; small discount for derating
    const baseCost = e.cost_multiplier ?? 1.0;
    const costDelta = s >= 1 ? (0.25 * (s - 1) + 0.35 * (s - 1) * (s - 1)) : (-0.1 * (1 - s));
    e.cost_multiplier = parseFloat((baseCost * (1 + costDelta)).toFixed(2));

    // Maintenance interval impact (hours between overhauls)
    if (typeof e.maintenance_hours === 'number') {
      const mh = e.maintenance_hours;
      const factor = s >= 1 ? (1 - 0.25 * (s - 1)) : (1 + 0.15 * (1 - s));
      e.maintenance_hours = Math.max(20, Math.round(mh * factor));
    }

    e.__tunedScale = s;
    return e;
  }

  updateTuningImpact() {
    const engineId = window.currentAircraft?.engine;
    const engineCount = window.currentAircraft?.engineCount || 1;
    if (!engineId) return;
    const base = window.AIRCRAFT_COMPONENTS?.aircraft_engines?.[engineId];
    if (!base) return;
    const scale = window.currentAircraft?.enginePowerScale || 1.0;
    const tuned = this.tuneEngine(base, scale);

    // Update quick trade-off displays
    const consEl = document.getElementById('tuning-consumption-display');
    const relEl = document.getElementById('tuning-reliability-display');
    if (consEl) {
      const c = tuned.fuel_consumption_full ?? tuned.fuel_consumption ?? tuned.sfc_military ?? 0;
      consEl.textContent = `${(c).toFixed(2)} ${tuned.power_hp ? 'kg/s (pleno)' : 'kg/s'}`;
    }
    if (relEl) relEl.textContent = `${Math.round((tuned.reliability ?? 0.85) * 100)}%`;

    // Predict speed using advanced calculator if available
    const speedEl = document.getElementById('predicted-speed-display');
    const altitude = window.currentAircraft?.predictionAltitude || 0;
    if (window.advancedPerformanceCalculator && window.currentAircraft?.airframe) {
      try {
        const airframe = window.AIRCRAFT_COMPONENTS?.airframes?.[window.currentAircraft.airframe];
        const config = {
          airframe,
          engine: tuned,
          engineCount,
          wings: window.currentAircraft.wings || {},
          avionics: window.currentAircraft.avionics || [],
          weapons: window.currentAircraft.weapons || [],
          fuel: window.currentAircraft.fuelLevel || 1.0,
          altitude
        };
        const result = window.advancedPerformanceCalculator.calculateCompletePerformance(config);
        const spd = Math.round(result?.summary?.max_speed_kmh || result?.maxSpeed || 0);
        if (speedEl && spd > 0) speedEl.textContent = `${spd} km/h`;
      } catch (e) {
        if (speedEl) speedEl.textContent = '— km/h';
      }
    } else if (speedEl) {
      speedEl.textContent = '— km/h';
    }

    // Also refresh existing engine-count impact UI
    this.updateEngineCountImpact();
  }

  populateEnginesGrid(allData) {
    const aircraftCategory = window.currentAircraft?.category || 'fighter';
    const airframe = window.AIRCRAFT_COMPONENTS?.airframes?.[window.currentAircraft?.airframe];
    const allowedTypes = new Set(airframe?.compatible_engine_types || []);


    const enginesGrid = document.getElementById('engines-grid');
    if (!enginesGrid) {
      console.error('❌ Engines grid element not found');
      return;
    }

    let html = '';
    let addedEngines = 0;

    Object.entries(allData).forEach(([id, engine]) => {
      // More relaxed filtering - show most engines for better UX
      let shouldShow = true;

      // Only filter if we have very strict airframe requirements
      if (allowedTypes.size > 0 && airframe && airframe.strict_engine_compatibility) {
        shouldShow = allowedTypes.has(engine.type);
      }

      if (shouldShow) {
        try {
          html += this.createModernEngineCard(id, engine, aircraftCategory);
          addedEngines++;
        } catch (error) {
          console.error(`❌ Error creating card for engine ${id}:`, error);
        }
      }
    });


    if (addedEngines === 0) {
      html = `
        <div class="col-span-full text-center py-8">
          <div class="text-slate-400 mb-4">🔍 Nenhum motor encontrado</div>
          <div class="text-sm text-slate-500">
            Verifique se uma fuselagem foi selecionada ou tente outros filtros.
          </div>
        </div>
      `;
    }

    enginesGrid.innerHTML = html;

    // Set up click handlers for engine selection
    document.querySelectorAll('.modern-engine-card').forEach(card => {
      card.addEventListener('click', () => {
        const engineId = card.dataset.engineId;
        this.selectEngine(engineId, allData[engineId]);
      });
    });
  }

  createModernEngineCard(id, engine, aircraftCategory) {
    const availability = this.getComponentAvailabilityInfo(engine);
    const isSelected = window.currentAircraft?.engine === id;
    const isPiston = engine.type && (engine.type.includes('piston') || engine.power_hp);
    const hasAfterburner = engine.afterburner_thrust > 0;

    // Determine engine era
    const year = engine.year_introduced || engine.tech_level * 25 + 1945;
    let era = 'unknown';
    if (year <= 1955) era = '1945-1955';
    else if (year <= 1965) era = '1955-1965';
    else if (year <= 1975) era = '1965-1975';
    else era = '1975-1990';

    // Determine engine type category
    let typeCategory = 'unknown';
    if (isPiston) typeCategory = 'piston';
    else if (engine.type?.includes('turbojet') || year <= 1965) typeCategory = 'early_jet';
    else if (engine.type?.includes('turboprop')) typeCategory = 'turboprop';
    else typeCategory = 'modern_jet';

    // Power display
    let powerDisplay;
    if (isPiston) {
      powerDisplay = `${Math.round(engine.power_hp || 0)} HP`;
    } else {
      powerDisplay = `${Math.round(engine.military_thrust || engine.thrust || 0)} kgf`;
    }

    // Icons by type
    const typeIcons = {
      piston: '🛩️',
      early_jet: '💨',
      modern_jet: '🚀',
      turboprop: '🌪️',
      unknown: '⚙️'
    };

    const isAvailable = availability.isAvailable;
    const reliabilityPercent = Math.round((engine.reliability || 0) * 100);

    return `
      <div class="modern-engine-card cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${isSelected ? 'border-cyan-400 bg-cyan-900/20 ring-1 ring-cyan-400/50' : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'} ${!isAvailable ? 'opacity-50' : ''}"
           data-engine-id="${id}"
           data-type="${typeCategory}"
           data-era="${era}"
           ${!isAvailable ? 'data-unavailable="true"' : ''}>

        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${typeIcons[typeCategory]}</span>
            <h4 class="font-semibold text-slate-200 text-sm">${engine.name}</h4>
          </div>
          ${hasAfterburner ? '<span class="px-2 py-0.5 text-xs bg-red-600 text-white rounded-lg">AB</span>' : ''}
        </div>

        <div class="space-y-2 text-xs">
          <div class="grid grid-cols-2 gap-2">
            <div class="text-slate-300">
              <span class="text-slate-400">${isPiston ? 'Potência:' : 'Empuxo:'}</span>
              <span class="font-semibold text-cyan-400">${powerDisplay}</span>
            </div>
            <div class="text-slate-300">
              <span class="text-slate-400">Peso:</span>
              <span class="font-semibold">${Math.round(engine.weight || 0)} kg</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="text-slate-300">
              <span class="text-slate-400">Confiabilidade:</span>
              <span class="font-semibold ${reliabilityPercent >= 85 ? 'text-green-400' : reliabilityPercent >= 75 ? 'text-yellow-400' : 'text-red-400'}">${reliabilityPercent}%</span>
            </div>
            <div class="text-slate-300">
              <span class="text-slate-400">Consumo:</span>
              <span class="font-semibold">${(engine.fuel_consumption || 0).toFixed(1)} kg/s</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-600">
            <div class="text-slate-400">
              <span>Tech: ${availability.requiredTech}</span>
              ${engine.year_introduced ? `<span class="text-slate-500"> • ${engine.year_introduced}</span>` : ''}
            </div>
            ${!isAvailable ? '<span class="text-red-400 text-xs">🔒 Indisponível</span>' : ''}
          </div>
        </div>

        ${isSelected ? '<div class="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>' : ''}
      </div>
    `;
  }

  updateEngineTypeFilters() {
    document.querySelectorAll('.engine-type-filter').forEach(filter => {
      const isSelected = filter.dataset.filter === this.currentFilter;
      if (isSelected) {
        filter.classList.add('border-cyan-400', 'bg-cyan-900/20');
        filter.classList.remove('border-slate-700/50');
      } else {
        filter.classList.remove('border-cyan-400', 'bg-cyan-900/20');
        filter.classList.add('border-slate-700/50');
      }
    });
  }

  updateEraFilters() {
    document.querySelectorAll('.era-filter').forEach(filter => {
      const isSelected = filter.dataset.era === this.currentEraFilter;
      if (isSelected) {
        filter.classList.add('border-cyan-500', 'bg-cyan-600', 'text-white');
        filter.classList.remove('border-slate-600', 'text-slate-300');
      } else {
        filter.classList.remove('border-cyan-500', 'bg-cyan-600', 'text-white');
        filter.classList.add('border-slate-600', 'text-slate-300');
      }
    });
  }

  filterEngines(allData) {
    document.querySelectorAll('.modern-engine-card').forEach(card => {
      const engineType = card.dataset.type;
      const engineEra = card.dataset.era;

      let showCard = true;

      // Filter by engine type
      if (this.currentFilter !== 'all' && engineType !== this.currentFilter) {
        showCard = false;
      }

      // Filter by era
      if (this.currentEraFilter !== 'all' && engineEra !== this.currentEraFilter) {
        showCard = false;
      }

      // Show/hide card
      card.style.display = showCard ? 'block' : 'none';
    });
  }

  calculateRequiredPower() {
    const targetSpeed = document.getElementById('target-speed').value;
    const targetAltitude = document.getElementById('target-altitude').value;
    const resultDiv = document.getElementById('power-calculation-result');

    if (!targetSpeed || targetSpeed < 100) {
      resultDiv.innerHTML = '<span class="text-red-400">Por favor, insira uma velocidade válida (mín. 100 km/h)</span>';
      return;
    }

    // More realistic power calculation based on aerodynamics
    const speedMs = targetSpeed / 3.6; // Convert to m/s
    const aircraftWeight = window.currentAircraft?.selectedAirframe?.base_weight || 3000;

    // Atmospheric density at altitude (simplified)
    const seaLevelDensity = 1.225; // kg/m³
    const densityAtAltitude = seaLevelDensity * Math.exp(-targetAltitude / 8400);

    // Estimate wing area and drag coefficient based on aircraft type
    const aircraftCategory = window.currentAircraft?.category || 'fighter';
    let estimatedWingArea, dragCoeff;

    switch(aircraftCategory) {
      case 'fighter':
        estimatedWingArea = aircraftWeight / 400; // Fighter: ~400 kg/m² wing loading
        dragCoeff = 0.025; // Clean fighter
        break;
      case 'bomber':
        estimatedWingArea = aircraftWeight / 250; // Bomber: ~250 kg/m² wing loading
        dragCoeff = 0.035; // Larger aircraft
        break;
      case 'transport':
        estimatedWingArea = aircraftWeight / 200; // Transport: ~200 kg/m² wing loading
        dragCoeff = 0.030; // Transport aircraft
        break;
      default:
        estimatedWingArea = aircraftWeight / 350; // Generic
        dragCoeff = 0.030;
    }

    // Calculate drag force: D = 0.5 * ρ * V² * S * Cd
    const dragForce = 0.5 * densityAtAltitude * Math.pow(speedMs, 2) * estimatedWingArea * dragCoeff;

    // Add induced drag and compressibility effects for high speed
    let compressibilityFactor = 1;
    if (speedMs > 250) { // Above ~900 km/h, compressibility becomes significant
      compressibilityFactor = 1 + Math.pow((speedMs - 250) / 100, 1.5);
    }

    // Required thrust = drag force + altitude penalty + speed penalty
    const requiredThrust = dragForce * compressibilityFactor * (1 + targetAltitude / 15000);

    // Convert to equivalent horsepower (rough approximation)
    const requiredPower = (requiredThrust * speedMs) / 745.7; // Convert watts to HP

    resultDiv.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div>
          <div class="text-slate-400">Empuxo Necessário:</div>
          <div class="text-xl font-bold text-cyan-400">${Math.round(requiredThrust)} kgf</div>
        </div>
        <div>
          <div class="text-slate-400">Potência Equivalente:</div>
          <div class="text-xl font-bold text-cyan-400">${Math.round(requiredPower)} HP</div>
        </div>
        <div>
          <div class="text-slate-400">Densidade do Ar:</div>
          <div class="text-lg font-semibold text-yellow-400">${(densityAtAltitude).toFixed(3)} kg/m³</div>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <div class="text-slate-500">Parâmetros estimados:</div>
          <div class="text-slate-400">• Área alar: ${estimatedWingArea.toFixed(1)} m²</div>
          <div class="text-slate-400">• Coef. arrasto: ${dragCoeff}</div>
          <div class="text-slate-400">• Fator compressibilidade: ${compressibilityFactor.toFixed(2)}</div>
        </div>
        <div>
          <div class="text-slate-500">Baseado em:</div>
          <div class="text-slate-400">• Categoria: ${aircraftCategory}</div>
          <div class="text-slate-400">• Peso: ${aircraftWeight} kg</div>
          <div class="text-slate-400">• Velocidade: ${speedMs.toFixed(1)} m/s</div>
        </div>
      </div>
    `;

    // Highlight engines that meet the requirement
    this.highlightSuitableEngines(requiredThrust, requiredPower);
  }

  highlightSuitableEngines(requiredThrust, requiredPower) {
    document.querySelectorAll('.modern-engine-card').forEach(card => {
      const engineId = card.dataset.engineId;
      const engine = window.AIRCRAFT_COMPONENTS?.aircraft_engines?.[engineId];

      if (!engine) return;

      const isPiston = engine.type && (engine.type.includes('piston') || engine.power_hp);
      let isSuitable = false;

      if (isPiston) {
        isSuitable = (engine.power_hp || 0) >= requiredPower;
      } else {
        isSuitable = (engine.military_thrust || engine.thrust || 0) >= requiredThrust;
      }

      // Add visual indicator
      if (isSuitable) {
        card.classList.add('ring-2', 'ring-green-400/50');
        // Add suitable badge if not already there
        if (!card.querySelector('.suitable-badge')) {
          const badge = document.createElement('div');
          badge.className = 'suitable-badge absolute top-1 left-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-lg';
          badge.textContent = '✓ Adequado';
          card.style.position = 'relative';
          card.appendChild(badge);
        }
      } else {
        card.classList.remove('ring-2', 'ring-green-400/50');
        // Remove suitable badge
        const badge = card.querySelector('.suitable-badge');
        if (badge) badge.remove();
      }
    });
  }

  selectEngine(engineId, engineData) {
    // Bloquear seleção se indisponível por tech/ano
    const availability = this.getComponentAvailabilityInfo(engineData);
    if (!availability.isAvailable) {
      const reasons = [];
      if (!availability.techOk) reasons.push(`Tech ${availability.requiredTech} (você tem ${availability.currentTech})`);
      if (!availability.yearOk) reasons.push(`Ano ${availability.requiredYear} (atual ${availability.currentYear})`);
      try { alert(`Motor indisponível: ${reasons.join(' e ')}`); } catch {}
      return;
    }
    this.selectedEngine = engineId;

    // Update visual selection
    document.querySelectorAll('.modern-engine-card').forEach(card => {
      const isSelected = card.dataset.engineId === engineId;
      if (isSelected) {
        card.classList.add('border-cyan-400', 'bg-cyan-900/20', 'ring-1', 'ring-cyan-400/50');
        card.classList.remove('border-slate-700/50');
      } else {
        card.classList.remove('border-cyan-400', 'bg-cyan-900/20', 'ring-1', 'ring-cyan-400/50');
        card.classList.add('border-slate-700/50');
      }
    });

    // Update aircraft configuration
    if (!window.currentAircraft) window.currentAircraft = {};
    window.currentAircraft.engine = engineId;

    // Show selected engine info
    this.showSelectedEngineInfo(engineData);

    // Trigger global calculations
    if (typeof window.updateAircraftCalculations === 'function') {
      window.updateAircraftCalculations();
    }

    console.log(`⚡ Engine selected: ${engineData.name}`);
  }

  showSelectedEngineInfo(engineData) {
    const infoDiv = document.getElementById('selected-engine-info');
    const specsDiv = document.getElementById('engine-specs');
    const performanceDiv = document.getElementById('engine-performance');

    if (!infoDiv || !specsDiv || !performanceDiv) return;

    const isPiston = engineData.type && (engineData.type.includes('piston') || engineData.power_hp);
    const hasAfterburner = engineData.afterburner_thrust > 0;

    // Populate specs
    specsDiv.innerHTML = `
      <div class="flex justify-between">
        <span class="text-slate-400">Nome:</span>
        <span class="text-slate-200">${engineData.name}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Tipo:</span>
        <span class="text-slate-200">${engineData.type || 'Desconhecido'}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">${isPiston ? 'Potência:' : 'Empuxo Militar:'}</span>
        <span class="text-cyan-400 font-semibold">${isPiston ? Math.round(engineData.power_hp || 0) + ' HP' : Math.round(engineData.military_thrust || engineData.thrust || 0) + ' kgf'}</span>
      </div>
      ${hasAfterburner ? `
        <div class="flex justify-between">
          <span class="text-slate-400">Empuxo c/ Pós-queimador:</span>
          <span class="text-red-400 font-semibold">${Math.round(engineData.afterburner_thrust)} kgf</span>
        </div>
      ` : ''}
      <div class="flex justify-between">
        <span class="text-slate-400">Peso:</span>
        <span class="text-slate-200">${Math.round(engineData.weight || 0)} kg</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Tech Level:</span>
        <span class="text-slate-200">${engineData.tech_level || 0}</span>
      </div>
    `;

    // Populate performance
    const reliabilityPercent = Math.round((engineData.reliability || 0) * 100);
    const thrustToWeight = isPiston
      ? ((engineData.power_hp || 0) * 0.75 / (engineData.weight || 1)).toFixed(1)
      : ((engineData.military_thrust || engineData.thrust || 0) / (engineData.weight || 1)).toFixed(1);

    performanceDiv.innerHTML = `
      <div class="flex justify-between">
        <span class="text-slate-400">Confiabilidade:</span>
        <span class="${reliabilityPercent >= 85 ? 'text-green-400' : reliabilityPercent >= 75 ? 'text-yellow-400' : 'text-red-400'} font-semibold">${reliabilityPercent}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Relação Empuxo/Peso:</span>
        <span class="text-slate-200">${thrustToWeight}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Consumo:</span>
        <span class="text-slate-200">${(engineData.fuel_consumption || 0).toFixed(2)} kg/s</span>
      </div>
      ${hasAfterburner ? `
        <div class="flex justify-between">
          <span class="text-slate-400">Consumo c/ Pós-queimador:</span>
          <span class="text-red-400">${(engineData.afterburner_fuel_consumption || 0).toFixed(1)} kg/s</span>
        </div>
      ` : ''}
      ${engineData.year_introduced ? `
        <div class="flex justify-between">
          <span class="text-slate-400">Ano de Introdução:</span>
          <span class="text-slate-200">${engineData.year_introduced}</span>
        </div>
      ` : ''}
    `;

    infoDiv.classList.remove('hidden');
  }

  updateEngineRecommendations(allData) {
    const aircraftCategory = window.currentAircraft?.category || 'fighter';

    const recommendations = {
      fighter: ['early_jet', 'modern_jet'],
      bomber: ['piston', 'turboprop', 'early_jet'],
      transport: ['piston', 'turboprop'],
      helicopter: ['piston', 'turboprop'],
      attacker: ['piston', 'early_jet']
    };

    const recommendedTypes = recommendations[aircraftCategory] || ['early_jet'];

    const recommendationsDiv = document.getElementById('engine-recommendations');
    const cardsDiv = document.getElementById('recommendation-cards');

    if (!recommendationsDiv || !cardsDiv) return;

    const typeNames = {
      piston: 'Motores a Pistão',
      early_jet: 'Primeiros Jatos',
      modern_jet: 'Jatos Modernos',
      turboprop: 'Turboprops'
    };

    cardsDiv.innerHTML = recommendedTypes.map(type => `
      <div class="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
        <div class="text-green-400 font-medium">💡 Recomendado</div>
        <div class="text-sm text-slate-300 mt-1">
          ${typeNames[type]} são ideais para aeronaves do tipo ${aircraftCategory}.
        </div>
      </div>
    `).join('');

    recommendationsDiv.classList.remove('hidden');
  }

  renderEngineCountSelector(airframe) {
    const minEngines = airframe?.min_engines || 1;
    const maxEngines = airframe?.max_engines || 1;
    const currentCount = window.currentAircraft?.engineCount || minEngines;
    
    return `
      <!-- Engine Count Selector -->
      <div id="engine-count-selector" class="mb-6 p-6 bg-blue-900/20 border border-blue-700/50 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-xl">🔢</span>
            <h3 class="font-semibold text-blue-200">Quantidade de Motores</h3>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-300" id="engine-count-display">${currentCount}</div>
            <div class="text-xs text-slate-400">motores</div>
          </div>
        </div>
        
        <div class="mb-4">
          <div class="flex items-center gap-4">
            <span class="text-sm text-slate-400 min-w-0">${minEngines}</span>
            <div class="flex-1">
              <input 
                type="range" 
                id="engine-count-slider" 
                min="${minEngines}" 
                max="${maxEngines}" 
                value="${currentCount}" 
                class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span class="text-sm text-slate-400 min-w-0">${maxEngines}</span>
          </div>
          <div class="mt-2 flex justify-between text-xs text-slate-500">
            <span>Mínimo</span>
            <span id="engine-count-info" class="text-blue-300">Selecionado: ${currentCount} motor${currentCount > 1 ? 'es' : ''}</span>
            <span>Máximo</span>
          </div>
        </div>

        <!-- Performance Impact Preview -->
        <div id="engine-count-impact" class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="total-power-display">0</div>
            <div class="text-xs text-slate-400">Potência Total</div>
          </div>
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="total-weight-display">0 kg</div>
            <div class="text-xs text-slate-400">Peso Total</div>
          </div>
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="fuel-consumption-display">0</div>
            <div class="text-xs text-slate-400">Consumo Total</div>
          </div>
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="reliability-display">0%</div>
            <div class="text-xs text-slate-400">Confiabilidade</div>
          </div>
        </div>

        <!-- Engine Configuration Warning -->
        <div id="engine-config-warning" class="hidden mt-4 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <div class="flex items-start gap-2">
            <span class="text-amber-400">⚠️</span>
            <div class="text-sm text-amber-200">
              <div class="font-medium mb-1">Configuração Complexa</div>
              <div id="engine-config-warning-text"></div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        /* Custom Slider Styles */
        .slider {
          -webkit-appearance: none;
          appearance: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(90deg, #1e293b 0%, #3b82f6 100%);
        }
      </style>
    `;
  }

  setupEngineCountSelector(airframe) {
    const selector = document.getElementById('engine-count-selector');
    const slider = document.getElementById('engine-count-slider');
    const display = document.getElementById('engine-count-display');
    const info = document.getElementById('engine-count-info');
    
    if (!selector || !slider || !display || !info || !airframe) return;
    
    // Define limites baseado na fuselagem
    const minEngines = airframe.min_engines || 1;
    const maxEngines = airframe.max_engines || 1;
    
    // Configura slider
    slider.min = minEngines;
    slider.max = maxEngines;
    slider.value = window.currentAircraft?.engineCount || minEngines;
    
    // Atualiza displays
    const currentCount = parseInt(slider.value);
    display.textContent = currentCount;
    info.textContent = `Selecionado: ${currentCount} motor${currentCount > 1 ? 'es' : ''}`;
    
    // Mostra o seletor
    selector.classList.remove('hidden');
    
    // Event listener para mudanças no slider
    slider.oninput = (e) => {
      const count = parseInt(e.target.value);
      display.textContent = count;
      info.textContent = `Selecionado: ${count} motor${count > 1 ? 'es' : ''}`;
      
      // Salva no estado global
      if (!window.currentAircraft) window.currentAircraft = {};
      window.currentAircraft.engineCount = count;
      
      // Atualiza preview de performance
      this.updateEngineCountImpact();
      
      // Mostra aviso para configurações complexas
      this.updateEngineConfigWarning(count, maxEngines);
    };
    
    // Atualização inicial
    this.updateEngineCountImpact();
    this.updateEngineConfigWarning(currentCount, maxEngines);
  }

  updateEngineCountImpact() {
    console.log('🔄 updateEngineCountImpact executado');
    const engineId = window.currentAircraft?.engine;
    const engineCount = window.currentAircraft?.engineCount || 1;
    
    console.log('🔍 Motor selecionado:', engineId, 'Quantidade:', engineCount);
    
    if (!engineId) {
      console.warn('⚠️ Nenhum motor selecionado');
      return;
    }
    
    const engine = window.AIRCRAFT_COMPONENTS?.aircraft_engines[engineId];
    if (!engine) {
      console.error('❌ Motor não encontrado:', engineId);
      return;
    }
    
    console.log('✅ Motor encontrado:', engine.name);
    
    // Calcula performance avançada da aeronave
    const performance = this.calculateAircraftPerformance(engine, engineCount);
    console.log('📊 Performance calculada:', performance);
    
    // Atualiza displays locais (dentro da tab de motores)
    const powerDisplay = document.getElementById('total-power-display');
    const weightDisplay = document.getElementById('total-weight-display');
    const consumptionDisplay = document.getElementById('fuel-consumption-display');
    const reliabilityDisplay = document.getElementById('reliability-display');
    
    if (powerDisplay) {
      powerDisplay.textContent = performance.totalThrust;
      console.log('✅ Empuxo total atualizado:', performance.totalThrust);
    }
    if (weightDisplay) {
      weightDisplay.textContent = `${Math.round(performance.totalEngineWeight)} kg`;
      console.log('✅ Peso dos motores atualizado:', performance.totalEngineWeight);
    }
    if (consumptionDisplay) {
      consumptionDisplay.textContent = performance.fuelConsumption;
      console.log('✅ Consumo atualizado:', performance.fuelConsumption);
    }
    if (reliabilityDisplay) {
      reliabilityDisplay.textContent = `${performance.reliability}%`;
      console.log('✅ Confiabilidade atualizada:', performance.reliability);
    }
    
    // Atualiza performance global da aeronave (header)
    console.log('🎯 Atualizando performance global...');
    this.updateGlobalPerformance(performance);
  }

  calculateAircraftPerformance(engine, engineCount) {
    console.log('🔧 TabLoaders: Calculando performance...');
    
    // Tenta usar o sistema avançado se disponível
    if (window.advancedPerformanceCalculator && window.currentAircraft?.airframe) {
      try {
        const airframe = window.AIRCRAFT_COMPONENTS?.airframes?.[window.currentAircraft.airframe];
        // Apply tuning to the selected engine before calculating
        const scale = window.currentAircraft?.enginePowerScale || 1.0;
        const tunedEngine = this.tuneEngine(engine, scale);
        const altitude = window.currentAircraft?.predictionAltitude || 0;
        if (airframe) {
          const aircraftConfig = {
            airframe: airframe,
            engine: tunedEngine,
            engineCount: engineCount,
            weapons: window.currentAircraft.weapons || [],
            avionics: window.currentAircraft.avionics || [],
            fuel: window.currentAircraft.fuelLevel || 1.0,
            altitude: altitude
          };
          
          const advancedResults = window.advancedPerformanceCalculator.calculateCompletePerformance(aircraftConfig);
          
          if (advancedResults && !advancedResults.error) {
            console.log('✅ TabLoaders: Sistema avançado executado');
            
            // Converte para formato compatível
            const summary = advancedResults.summary;
            const isPistonEngine = advancedResults.power.type === 'piston';
            const hasAfterburner = tunedEngine.afterburner_thrust > 0;
            
            let totalThrust;
            if (isPistonEngine) {
              totalThrust = `${Math.round((tunedEngine.power_hp || 0) * engineCount)} HP`;
            } else {
              totalThrust = `${Math.round((tunedEngine.military_thrust || tunedEngine.thrust || 0) * engineCount)} kgf`;
            }
            
            return {
              totalThrust,
              totalThrustAB: hasAfterburner ? `${Math.round(tunedEngine.afterburner_thrust * engineCount)} kgf` : null,
              totalEngineWeight: advancedResults.mass.engineWeight,
              fuelConsumption: `${advancedResults.operationalPerformance.fuelFlowRate.toFixed(2)} kg/h`,
              reliability: Math.round((tunedEngine.reliability || 0.8) * 100 * Math.pow(0.96, engineCount - 1)),
              maxSpeed: summary.maxSpeed,
              thrustToWeight: summary.thrustToWeight.toFixed(2),
              range: summary.maxRange,
              hasAfterburner: hasAfterburner,
              isPistonEngine: isPistonEngine
            };
          }
        }
      } catch (error) {
        console.warn('⚠️ TabLoaders: Erro no sistema avançado, usando cálculo simplificado:', error);
      }
    }
    
    // Sistema de fallback simplificado
    console.log('🔄 TabLoaders: Usando sistema de fallback');
    
    const airframeId = window.currentAircraft?.airframe;
    const airframe = window.AIRCRAFT_COMPONENTS?.airframes?.[airframeId];
    
    // Dados básicos dos motores
    const isPistonEngine = engine.type && (engine.type.includes('piston') || engine.power_hp);
    const hasAfterburner = engine.afterburner_thrust > 0;
    
    // Empuxo/Potência total
    let totalThrust, totalThrustAB = null;
    if (isPistonEngine) {
      totalThrust = `${Math.round((engine.power_hp || 0) * engineCount)} HP`;
    } else {
      const militaryThrust = (engine.military_thrust || engine.thrust || 0) * engineCount;
      totalThrust = `${Math.round(militaryThrust)} kgf`;
      
      if (hasAfterburner) {
        const afterburnerThrust = engine.afterburner_thrust * engineCount;
        totalThrustAB = `${Math.round(afterburnerThrust)} kgf`;
      }
    }
    
    // Peso total dos motores
    const totalEngineWeight = engine.weight * engineCount;
    
    // Consumo de combustível
    const militaryConsumption = (engine.fuel_consumption || 0) * engineCount;
    const afterburnerConsumption = hasAfterburner ? 
      (engine.afterburner_fuel_consumption || 0) * engineCount : null;
    
    let fuelConsumption = militaryConsumption.toFixed(2);
    if (afterburnerConsumption) {
      fuelConsumption += ` / ${afterburnerConsumption.toFixed(1)} kg/s`;
    } else {
      fuelConsumption += ' kg/s';
    }
    
    // Confiabilidade (reduz com múltiplos motores)
    const baseReliability = engine.reliability || 0.8;
    const reliability = Math.round(baseReliability * 100 * Math.pow(0.96, engineCount - 1));
    
    // Cálculos simples de performance da aeronave (se fuselagem selecionada)
    let maxSpeed = 0, thrustToWeight = 0, range = 0;
    
    if (airframe) {
      const aircraftWeight = (airframe.base_weight || 0) + totalEngineWeight;
      const totalThrustKgf = isPistonEngine 
        ? (engine.power_hp || 0) * engineCount * 0.75 // Conversão HP para empuxo equivalente
        : (engine.military_thrust || engine.thrust || 0) * engineCount;
      
      // Relação empuxo/peso
      thrustToWeight = (totalThrustKgf / aircraftWeight).toFixed(2);
      
      // Velocidade máxima simples (limitada pela fuselagem)
      maxSpeed = isPistonEngine ? 
        Math.min(airframe.max_speed_kph || 650, 400 + (engine.power_hp || 0) * engineCount * 0.15) :
        Math.min(airframe.max_speed_kph || 1200, 600 + (engine.military_thrust || engine.thrust || 0) * engineCount * 0.1);
      
      // Autonomia estimada 
      const internalFuel = airframe.internal_fuel_kg || 1000;
      const cruiseConsumption = militaryConsumption * 0.6; // 60% do consumo militar em cruzeiro
      range = cruiseConsumption > 0 ? (internalFuel / cruiseConsumption) * (maxSpeed * 0.8) / 1000 : 0; // km
    }
    
    return {
      totalThrust,
      totalThrustAB,
      totalEngineWeight,
      fuelConsumption,
      reliability,
      maxSpeed: Math.round(maxSpeed),
      thrustToWeight,
      range: Math.round(range),
      hasAfterburner,
      isPistonEngine
    };
  }

  updateGlobalPerformance(performance) {
    console.log('🎯 Atualizando performance global:', performance);
    
    // Calcula peso total da aeronave
    const airframeId = window.currentAircraft?.airframe;
    const airframe = window.AIRCRAFT_COMPONENTS?.airframes?.[airframeId];
    let totalWeight = 0;
    
    if (airframe && performance.totalEngineWeight) {
      totalWeight = (airframe.base_weight || 0) + performance.totalEngineWeight;
    }
    
    // Atualiza displays usando os IDs corretos do HTML
    const weightDisplay = document.getElementById('total-weight-display');
    if (weightDisplay && totalWeight > 0) {
      weightDisplay.textContent = `${Math.round(totalWeight)} kg`;
      console.log('✅ Peso atualizado:', totalWeight);
    }
    
    const speedDisplay = document.getElementById('max-speed-display');
    if (speedDisplay && performance.maxSpeed) {
      speedDisplay.textContent = `${performance.maxSpeed} km/h`;
      console.log('✅ Velocidade atualizada:', performance.maxSpeed);
    }
    
    const thrustWeightDisplay = document.getElementById('thrust-weight-ratio-display');
    if (thrustWeightDisplay && performance.thrustToWeight) {
      thrustWeightDisplay.textContent = `${performance.thrustToWeight}:1`;
      console.log('✅ Empuxo/Peso atualizado:', performance.thrustToWeight);
    }
    
    // Chama também a função global de cálculos se disponível
    if (typeof window.updateAircraftCalculations === 'function') {
      setTimeout(() => {
        window.updateAircraftCalculations();
      }, 100);
    }
  }

  updateEngineConfigWarning(currentCount, maxEngines) {
    const warning = document.getElementById('engine-config-warning');
    const warningText = document.getElementById('engine-config-warning-text');
    
    if (!warning || !warningText) return;
    
    if (currentCount >= 4) {
      warning.classList.remove('hidden');
      if (currentCount >= 6) {
        warningText.textContent = 'Configurações com 6+ motores são extremamente complexas e caras. Requer tripulação especializada e manutenção intensiva.';
      } else {
        warningText.textContent = 'Configurações com 4+ motores aumentam significativamente a complexidade e custos operacionais.';
      }
    } else {
      warning.classList.add('hidden');
    }
  }

  renderEngineCard(id, eng) {
    const isSelected = window.currentAircraft?.engine === id;
    const isPistonEngine = eng.type && (eng.type.includes('piston') || eng.power_hp);
    const hasAfterburner = eng.afterburner_thrust > 0;
    const rel = Math.round((eng.reliability || 0) * 100);
    
    // Check tech level availability
    const availability = this.getComponentAvailabilityInfo(eng);
    const statusClass = this.getComponentStatusClass(eng);
    
    // Determina empuxo/potência para exibição
    let powerDisplay, powerSecondary = '';
    if (isPistonEngine) {
      powerDisplay = `Potência: <b>${Math.round(eng.power_hp || 0)} HP</b>`;
    } else {
      const militaryThrust = eng.military_thrust || eng.thrust || 0;
      powerDisplay = `Empuxo: <b>${Math.round(militaryThrust)} kgf</b>`;
      
      if (hasAfterburner) {
        powerSecondary = `Pós-comb.: <b>${Math.round(eng.afterburner_thrust)} kgf</b>`;
      }
    }
    
    // Consumo de combustível
    let fuelConsumption;
    if (hasAfterburner) {
      const milConsumption = (eng.fuel_consumption || 0).toFixed(2);
      const abConsumption = (eng.afterburner_fuel_consumption || 0).toFixed(1);
      fuelConsumption = `${milConsumption}/${abConsumption} kg/s`;
    } else {
      fuelConsumption = `${(eng.fuel_consumption || eng.sfc_mil || 0).toFixed(2)} kg/s`;
    }
    
    // Calcula relação empuxo/peso do motor
    const thrustToWeight = isPistonEngine 
      ? ((eng.power_hp || 0) * 0.75 / (eng.weight || 1)).toFixed(1)
      : ((eng.military_thrust || eng.thrust || 0) / (eng.weight || 1)).toFixed(1);
    
    const baseClasses = isSelected ? 
      'selected border-brand-400 ring-1 ring-brand-400/50' : 
      'border-slate-700/50 bg-slate-800/40';
    
    const techClasses = availability.isAvailable ? 
      '' : 
      'opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10';
    
    const clickHandler = availability.isAvailable ? 
      `onclick="selectAircraftEngine('${id}')"` : 
      `onclick="showTechRequirement('${eng.name}', ${availability.requiredTech}, ${availability.currentTech})"`;
    
    return `
      <button class="engine-card component-card relative rounded-2xl p-4 text-left border transition ${baseClasses} ${techClasses}" ${clickHandler}>
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-base font-semibold text-slate-100">${eng.name}</h4>
          <div class="flex gap-1">
            ${hasAfterburner ? '<span class="afterburner-indicator">🔥 AB</span>' : ''}
            ${isPistonEngine ? '<span class="px-2 py-0.5 text-xs rounded-lg text-white bg-orange-600">Pistão</span>' : '<span class="px-2 py-0.5 text-xs rounded-lg text-white bg-blue-600">Jato</span>'}
          </div>
        </div>
        
        <div class="space-y-2 text-xs text-slate-300">
          <div class="grid grid-cols-2 gap-2">
            <div>${powerDisplay}</div>
            <div>Peso: <b>${Math.round(eng.weight || 0)} kg</b></div>
          </div>
          
          ${powerSecondary ? `<div class="grid grid-cols-2 gap-2"><div>${powerSecondary}</div><div>T/W: <b>${thrustToWeight}</b></div></div>` : `<div class="grid grid-cols-2 gap-2"><div>T/W: <b>${thrustToWeight}</b></div><div></div></div>`}
          
          <div class="grid grid-cols-2 gap-2">
            <div class="reliability-indicator">
              <span class="reliability-dot ${rel >= 85 ? 'high' : rel >= 75 ? 'medium' : 'low'}"></span>
              Confiab.: <b>${rel}%</b>
            </div>
            <div>Consumo: <b>${fuelConsumption}</b></div>
          </div>
          
          <!-- Tech Level Indicator -->
          <div class="mt-2 flex items-center justify-between">
            <div class="text-xs">
              <span class="text-slate-400">Tech Level:</span>
              <span class="${availability.isAvailable ? 'text-green-400' : 'text-red-400'} font-semibold">
                ${availability.requiredTech}
              </span>
              ${eng.year_introduced ? `<span class="text-slate-500"> • ${eng.year_introduced}</span>` : ''}
            </div>
            ${!availability.isAvailable ? 
              `<div class="flex items-center gap-1">
                <span class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span class="text-red-400 text-xs">🔒</span>
                </span>
                <span class="text-xs text-red-400">Requer ${availability.missingTech} tech</span>
              </div>` : 
              ''}
          </div>
        </div>
        
        ${isSelected ? '<div class="absolute top-2 right-2 w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
      </button>`;
  }

  async loadWeaponsTab() {
    console.log('🔄 Loading Weapons Tab...');

    // Check if components are loaded
    if (!window.AIRCRAFT_COMPONENTS || !window.AIRCRAFT_COMPONENTS.aircraft_weapons) {
      console.warn('⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...');

      try {
        this.showLoadingState('Carregando armamentos de aeronaves...');
        await this.ensureComponentsLoaded(['aircraft_weapons']);
        console.log('✅ Components loaded, retrying...');
        this.loadWeaponsTab();
      } catch (error) {
        console.error('❌ Failed to load components:', error);
        this.showEmptyState('Erro ao carregar componentes de aeronaves.');
      }
      return;
    }
    
    const data = window.AIRCRAFT_COMPONENTS?.aircraft_weapons || {};
    const ids = Object.keys(data);
    if (ids.length === 0) return this.showEmptyState('Nenhum armamento disponível.');
    if (!window.currentAircraft?.airframe) return this.showEmptyState('Selecione uma fuselagem primeiro.');

    console.log(`📊 Found ${ids.length} weapons in data`);

    const selected = new Set(window.currentAircraft?.weapons || []);
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    ids.forEach(id => {
      const w = data[id];
      const isSelected = selected.has(id);
      html += `
        <div class="component-card relative rounded-2xl p-4 border cursor-pointer ${isSelected ? 'selected border-brand-400 bg-brand-900/20' : 'border-slate-700/50 bg-slate-800/40'}" onclick="toggleAircraftWeapon('${id}')">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-semibold text-slate-100">${w.name}</h4>
            <span class="text-xs px-2 py-0.5 rounded-lg bg-slate-700/60 text-slate-200">${w.type || 'payload'}</span>
          </div>
          <div class="text-xs text-slate-300">Peso: <b>${Math.round(w.weight || 0)} kg</b></div>
          ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full"></div>' : ''}
        </div>`;
    });
    html += '</div>';
    this.getTabContent().innerHTML = html;
  }

  async loadAvionicsTab() {
    console.log('🔄 Loading Avionics Tab...');

    if (!window.AIRCRAFT_COMPONENTS?.avionics) {
      try {
        this.showLoadingState('Carregando sistemas aviônicos...');
        await this.ensureComponentsLoaded(['avionics']);
        this.loadAvionicsTab(); // Retry after loading
      } catch (error) {
        console.error('❌ Failed to load avionics components:', error);
        this.showEmptyState('Sistema de componentes não encontrado.');
      }
      return;
    }

    this.updateTechLevel();

    try {
      // Load template with optimization
      const template = await this.loadOptimizedTemplate('templates/aircraft-creator/avionics-tab.html');

      // Inject with smooth transition
      optimizedTemplateLoader.injectWithTransition(this.getTabContent(), template);

      // Populate tab content with debouncing
      this.debouncedUIUpdate('avionics-populate', () => this.populateAvionicsTab(), 50);
    } catch (error) {
      console.error('❌ Failed to load avionics tab template:', error);
      this.showEmptyState('Erro ao carregar a aba de Aviônicos.');
    }
  }

  populateAvionicsTab() {
    const container = document.getElementById('avionics-groups-container');
    if (!container) return;

    const allData = window.AIRCRAFT_COMPONENTS.avionics || {};
    const ids = Object.keys(allData);
    if (ids.length === 0) {
        container.innerHTML = '<p class="text-slate-400">Nenhum sistema de aviônica disponível.</p>';
        return;
    }

    const selected = new Set(window.currentAircraft?.avionics || []);
    
    const groups = {};
    ids.forEach(id => {
        const avionic = allData[id];
        const groupKey = avionic.type || 'misc';
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push({ id, ...avionic });
    });

    const groupNames = {
        communication: 'Sistemas de Comunicação',
        navigation: 'Navegação e Piloto Automático',
        fcs: 'Controle de Tiro e Mira',
        radar: 'Radar de Busca',
        ew: 'Guerra Eletrônica e Contramedidas',
        cockpit: 'Sistemas de Cabine e Suporte'
    };

    let html = '';
    for (const groupKey in groupNames) {
        if (groups[groupKey]) {
            html += `<h3 class="text-lg font-semibold text-slate-200 mt-6 mb-4 border-b border-slate-700 pb-2">${groupNames[groupKey]}</h3>`;
            html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
            groups[groupKey].forEach(item => {
                html += this.renderAvionicsCard(item.id, item, selected.has(item.id));
            });
            html += '</div>';
        }
    }

    container.innerHTML = html;

    // Add event listeners
    container.addEventListener('click', (e) => {
        const card = e.target.closest('.component-card');
        if (card && card.dataset.avionicId) {
            const avionicId = card.dataset.avionicId;
            if (card.classList.contains('locked')) {
                const avionic = allData[avionicId];
                const availability = this.getComponentAvailabilityInfo(avionic);
                if (window.showTechRequirement) {
                    window.showTechRequirement(avionic.name, availability.requiredTech, availability.currentTech);
                }
                return;
            }
            
            if (!window.currentAircraft.avionics) {
                window.currentAircraft.avionics = [];
            }
            const index = window.currentAircraft.avionics.indexOf(avionicId);
            if (index > -1) {
                window.currentAircraft.avionics.splice(index, 1);
            } else {
                window.currentAircraft.avionics.push(avionicId);
            }
            
            this.populateAvionicsTab(); // Re-render to update selection state
            updateAircraftCalculations();
        }
    });
  }

  renderAvionicsCard(id, avionics, isSelected) {
    const availability = this.getComponentAvailabilityInfo(avionics);
    const isLocked = !availability.isAvailable;

    const baseClasses = isSelected ? 
      'selected border-cyan-400 ring-1 ring-cyan-400/50' : 
      'border-slate-700/50 bg-slate-800/40';
    
    const techClasses = isLocked ? 
      'locked opacity-60 cursor-not-allowed' : 
      'hover:border-slate-600 hover:bg-slate-800';

    return `
        <div class="component-card relative rounded-xl p-4 border transition-all ${baseClasses} ${techClasses}" data-avionic-id="${id}">
            <div class="flex items-start justify-between mb-2">
                <h4 class="text-sm font-semibold text-slate-100 pr-4">${avionics.name}</h4>
                ${isLocked ? `<span class="text-red-400 text-xs">🔒 Tech ${avionics.tech_level}</span>` : ''}
            </div>
            <p class="text-xs text-slate-400 mb-3 h-10 overflow-hidden">${avionics.description}</p>
            <div class="text-xs text-slate-300 grid grid-cols-2 gap-1">
                <div>Peso: <b>${avionics.weight} kg</b></div>
                <div>Custo: <b>${(avionics.cost / 1000).toFixed(0)}K</b></div>
            </div>
            ${isSelected ? '<div class="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-slate-800"></div>' : ''}
        </div>
    `;
  }

  loadSuperchargerTab() {
    console.log('🔄 Loading Supercharger Tab...');
    
    // Check if components are loaded
    if (!window.AIRCRAFT_COMPONENTS || !window.AIRCRAFT_COMPONENTS.superchargers) {
      console.warn('⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...');
      // Show loading state
      this.showLoadingState('Carregando superchargers...');
      
      // Try to trigger component loading
      if (window.loadAircraftComponents) {
        window.loadAircraftComponents().then(() => {
          console.log('✅ Components loaded, retrying...');
          this.loadSuperchargerTab();
        }).catch(error => {
          console.error('❌ Failed to load components:', error);
          this.showEmptyState('Erro ao carregar componentes de aeronaves.');
        });
      } else {
        this.showEmptyState('Sistema de componentes não encontrado.');
      }
      return;
    }
    
    if (!window.currentAircraft?.airframe || !window.currentAircraft?.engine) {
      this.showEmptyState('Selecione uma fuselagem e um motor primeiro.');
      return;
    }
    
    // Update tech level first
    this.updateTechLevel();
    
    const allData = window.AIRCRAFT_COMPONENTS?.superchargers || {};
    const ids = Object.keys(allData);
    if (ids.length === 0) return this.showEmptyState('Nenhum supercharger disponível.');

    console.log(`📊 Found ${ids.length} superchargers in data`);

    // Filter superchargers based on tech level
    const availableData = this.filterAvailableComponents(allData);
    console.log(`🔬 Superchargers: ${Object.keys(availableData).length} available out of ${ids.length} total`);
    
    const data = allData; // Use all data for display, but mark unavailable ones
    const currentSupercharger = window.currentAircraft?.supercharger || 'none';
    
    let html = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-100">Sistema de Superalimentação</h2>
            <p class="text-slate-400 text-sm">Melhore a performance em altitude com superchargers e turboalimentadores</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-slate-400">Selecionado:</div>
            <div class="text-lg font-semibold text-cyan-300" id="selected-supercharger-name">${data[currentSupercharger]?.name || 'Nenhum'}</div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
          <div class="flex items-center space-x-2 text-blue-300">
            <span>💡</span>
            <span class="font-semibold">Superalimentação em 1954</span>
          </div>
          <p class="text-blue-200 text-sm mt-2">
            Superchargers mecânicos são padrão em caças, enquanto turboalimentadores representam tecnologia de ponta para bombardeiros de alta altitude. Cada sistema tem trade-offs únicos de peso, complexidade e performance.
          </p>
        </div>

        <!-- Supercharger Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;

    ids.forEach(id => {
      const supercharger = data[id];
      const isSelected = currentSupercharger === id;
      const availability = this.getComponentAvailabilityInfo(supercharger);
      
      const baseClasses = isSelected ? 
        'selected border-cyan-400 ring-1 ring-cyan-400/50 bg-cyan-900/20' : 
        'border-slate-700/50 bg-slate-800/40';
      
      const techClasses = availability.isAvailable ? 
        'cursor-pointer hover:border-slate-600 hover:bg-slate-700/50' : 
        'opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10';
      
      const clickHandler = availability.isAvailable ? 
        `onclick="selectSupercharger('${id}')"` : 
        `onclick="showTechRequirement('${supercharger.name}', ${availability.requiredTech}, ${availability.currentTech})"`;
      
      html += `
        <div class="component-card relative rounded-2xl p-6 border transition ${baseClasses} ${techClasses}" ${clickHandler}>
          <div class="flex items-start justify-between mb-4">
            <div>
              <h4 class="text-lg font-semibold text-slate-100">${supercharger.name}</h4>
              <p class="text-sm text-slate-400 mt-1">${supercharger.description}</p>
            </div>
            ${!availability.isAvailable ? 
              `<div class="flex items-center gap-1">
                <span class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span class="text-red-400 text-xs">🔒</span>
                </span>
              </div>` : 
              ''}
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">Custo:</span>
                <span class="text-yellow-300 font-semibold">$${(supercharger.cost / 1000).toFixed(0)}K</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Peso:</span>
                <span class="text-orange-300 font-semibold">${supercharger.weight} kg</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">Alt. Nominal:</span>
                <span class="text-green-300 font-semibold">${supercharger.rated_altitude_m || 0}m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Confiabilidade:</span>
                <span class="text-blue-300 font-semibold">${Math.round((supercharger.reliability_mod || 1.0) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <!-- Tech Level Indicator -->
          <div class="mt-4 flex items-center justify-between">
            <div class="text-xs">
              <span class="text-slate-400">Tech Level:</span>
              <span class="${availability.isAvailable ? 'text-green-400' : 'text-red-400'} font-semibold">
                ${supercharger.tech_level || 0}
              </span>
            </div>
            ${!availability.isAvailable ? 
              `<span class="text-xs text-red-400">Requer ${availability.missingTech} tech adicional</span>` : 
              ''}
          </div>
          
          ${isSelected ? '<div class="absolute top-3 right-3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>' : ''}
        </div>
      `;
    });

    html += `
        </div>

        <!-- Performance Impact -->
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6" id="supercharger-impact">
          <h3 class="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
            <span>📊</span>
            <span>Impacto na Performance</span>
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-green-300 font-semibold" id="supercharger-altitude-gain">+0m</div>
              <div class="text-xs text-slate-400">Teto Efetivo</div>
            </div>
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-orange-300 font-semibold" id="supercharger-weight-impact">+0 kg</div>
              <div class="text-xs text-slate-400">Peso Adicional</div>
            </div>
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-yellow-300 font-semibold" id="supercharger-cost-impact">+$0K</div>
              <div class="text-xs text-slate-400">Custo Adicional</div>
            </div>
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-red-300 font-semibold" id="supercharger-reliability-impact">100%</div>
              <div class="text-xs text-slate-400">Confiabilidade</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    this.getTabContent().innerHTML = html;
    this.updateSuperchargerImpact();
  }

  updateSuperchargerImpact() {
    const selectedId = window.currentAircraft?.supercharger || 'none';
    const supercharger = window.AIRCRAFT_COMPONENTS?.superchargers?.[selectedId];
    
    if (!supercharger) return;
    
    // Update impact displays
    const altitudeGain = document.getElementById('supercharger-altitude-gain');
    const weightImpact = document.getElementById('supercharger-weight-impact');
    const costImpact = document.getElementById('supercharger-cost-impact');
    const reliabilityImpact = document.getElementById('supercharger-reliability-impact');
    
    if (altitudeGain) {
      const gain = supercharger.rated_altitude_m || 0;
      altitudeGain.textContent = gain > 0 ? `+${gain}m` : '0m';
    }
    
    if (weightImpact) {
      const weight = supercharger.weight || 0;
      weightImpact.textContent = weight > 0 ? `+${weight} kg` : '0 kg';
    }
    
    if (costImpact) {
      const cost = supercharger.cost || 0;
      costImpact.textContent = cost > 0 ? `+$${(cost/1000).toFixed(0)}K` : '$0K';
    }
    
    if (reliabilityImpact) {
      const reliability = Math.round((supercharger.reliability_mod || 1.0) * 100);
      reliabilityImpact.textContent = `${reliability}%`;
    }
  }

  // ===== Optimized Loading Methods =====

  /**
   * Ensure components are loaded with optimization and caching
   */
  async ensureComponentsLoaded(componentTypes = []) {
    // If components already loaded, return immediately
    if (window.AIRCRAFT_COMPONENTS && componentTypes.every(type => window.AIRCRAFT_COMPONENTS[type])) {
      console.log('📋 All required components already loaded');
      return;
    }

    // Reuse existing loading promise if in progress
    if (!this.componentLoadPromise) {
      this.componentLoadPromise = this.performComponentLoading();
    }

    try {
      await this.componentLoadPromise;
      console.log('✅ Component loading completed');
    } finally {
      this.componentLoadPromise = null;
    }
  }

  /**
   * Perform actual component loading with optimization
   */
  async performComponentLoading() {
    if (window.loadAircraftComponents) {
      console.log('🔄 Loading aircraft components with optimization...');
      return window.loadAircraftComponents();
    } else {
      throw new Error('Component loading system not available');
    }
  }

  /**
   * Optimized template loading with caching
   */
  async loadOptimizedTemplate(templatePath) {
    try {
      return await optimizedTemplateLoader.loadTemplate(templatePath, {
        priority: 'high',
        cache: true
      });
    } catch (error) {
      console.error(`❌ Failed to load template: ${templatePath}`, error);
      throw error;
    }
  }

  /**
   * Debounced UI update to prevent excessive renders
   */
  debouncedUIUpdate(key, updateFunction, delay = 150) {
    optimizedTemplateLoader.debouncedUpdate(key, updateFunction, delay);
  }

  // ===== Helpers =====
  isAvailable(component) {
    try {
      const country = (typeof window.getCurrentCountry === 'function') ? window.getCurrentCountry() : null;
      const level = component?.tech_level;
      if (country && level && Number.isFinite(level) && country.tech_level < level) return false;
      const y = country?.year;
      if (y) {
        const start = component?.era_start, end = component?.era_end;
        if (start && y < start) return false;
        if (end && y > end) return false;
      }
      return true;
    } catch { return true; }
  }

  getCategoryDisplayName(category) {
    const names = {
      fighter: 'Caça',
      bomber: 'Bombardeiro',
      transport: 'Transporte',
      attack: 'Ataque ao Solo',
      helicopter: 'Helicóptero',
      experimental: 'Experimental'
    };
    return names[category] || 'Desconhecida';
  }

  generateAirframeOptions(category) {
    const airframesByCategory = {
      fighter: [
        {
          id: 'light_fighter',
          icon: '🛩️',
          name: 'Caça Leve',
          description: 'Fuselagem ágil e econômica para caças leves (1954-1960)',
          weight: 1600,
          gLimit: 9,
          hardpoints: 2,
          fuel: 400
        },
        {
          id: 'early_jet_fighter',
          icon: '🚀',
          name: 'Caça a Jato Inicial',
          description: 'Primeiro caça a jato subsônico básico (1954-1958)',
          weight: 2200,
          gLimit: 8,
          hardpoints: 4,
          fuel: 600
        },
        {
          id: 'supersonic_fighter',
          icon: '⚡',
          name: 'Caça Supersônico',
          description: 'Caça supersônico de 2ª geração (1958-1965)',
          weight: 2800,
          gLimit: 7.5,
          hardpoints: 4,
          fuel: 900
        },
        {
          id: 'interceptor_fighter',
          icon: '🎯',
          name: 'Interceptador',
          description: 'Especializado em interceptação de alta altitude (1960-1970)',
          weight: 3200,
          gLimit: 6,
          hardpoints: 6,
          fuel: 1400
        },
        {
          id: 'multirole_fighter',
          icon: '⚔️',
          name: 'Caça Multifunção',
          description: 'Caça versátil de 3ª geração (1965-1975)',
          weight: 3000,
          gLimit: 8,
          hardpoints: 8,
          fuel: 1100
        },
        {
          id: 'air_superiority_fighter',
          icon: '🦅',
          name: 'Superioridade Aérea',
          description: 'Caça pesado de domínio aéreo (1970-1980)',
          weight: 4200,
          gLimit: 9,
          hardpoints: 8,
          fuel: 2200
        },
        {
          id: 'modern_multirole',
          icon: '🌟',
          name: 'Caça Moderno',
          description: 'Caça de 4ª geração com aviônicos avançados (1975-1985)',
          weight: 2600,
          gLimit: 9,
          hardpoints: 9,
          fuel: 1000
        },
        {
          id: 'naval_fighter',
          icon: '⚓',
          name: 'Caça Naval',
          description: 'Caça reforçado para operações em porta-aviões (1960-1980)',
          weight: 3400,
          gLimit: 7,
          hardpoints: 6,
          fuel: 1300
        },
        {
          id: 'stealth_prototype',
          icon: '👻',
          name: 'Protótipo Furtivo',
          description: 'Caça experimental com tecnologia stealth (1980-1990)',
          weight: 3800,
          gLimit: 6.5,
          hardpoints: 4,
          fuel: 1600
        }
      ],
      bomber: [
        {
          id: 'light_bomber',
          icon: '💣',
          name: 'Bombardeiro Leve',
          description: 'Fuselagem para bombardeio tático',
          weight: 4200,
          gLimit: 5,
          hardpoints: 12,
          fuel: 1800
        },
        {
          id: 'medium_bomber',
          icon: '✈️',
          name: 'Bombardeiro Médio',
          description: 'Bombardeiro de médio alcance para missões estratégicas',
          weight: 6800,
          gLimit: 4,
          hardpoints: 16,
          fuel: 3200
        }
      ],
      transport: [
        {
          id: 'light_transport',
          icon: '📦',
          name: 'Transporte Leve',
          description: 'Transporte para pequenas cargas e pessoal',
          weight: 3800,
          gLimit: 4,
          hardpoints: 2,
          fuel: 1500
        },
        {
          id: 'heavy_transport',
          icon: '✈️',
          name: 'Transporte Pesado',
          description: 'Grande capacidade para tropas e equipamentos',
          weight: 8500,
          gLimit: 3,
          hardpoints: 4,
          fuel: 4500
        }
      ],
      attack: [
        {
          id: 'ground_attack',
          icon: '⚔️',
          name: 'Ataque ao Solo',
          description: 'Especializado em apoio aéreo aproximado',
          weight: 3200,
          gLimit: 6,
          hardpoints: 10,
          fuel: 900
        }
      ],
      helicopter: [
        {
          id: 'light_helicopter',
          icon: '🚁',
          name: 'Helicóptero Leve',
          description: 'Helicóptero de observação e transporte leve',
          weight: 1800,
          gLimit: 4,
          hardpoints: 4,
          fuel: 600
        },
        {
          id: 'medium_helicopter',
          icon: '🚁',
          name: 'Helicóptero Médio',
          description: 'Helicóptero multifunção para combate e transporte',
          weight: 3200,
          gLimit: 3,
          hardpoints: 6,
          fuel: 1200
        }
      ],
      experimental: [
        {
          id: 'prototype_x1',
          icon: '🧪',
          name: 'Protótipo X-1',
          description: 'Projeto experimental avançado',
          weight: 2100,
          gLimit: 12,
          hardpoints: 4,
          fuel: 500
        }
      ]
    };

    const airframes = airframesByCategory[category] || [];

    return airframes.map(airframe => `
      <div class="airframe-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-airframe="${airframe.id}">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">${airframe.icon}</span>
          <h4 class="font-semibold text-slate-200">${airframe.name}</h4>
        </div>
        <p class="text-sm text-slate-400 mb-3">${airframe.description}</p>
        <div class="text-xs text-slate-300 space-y-1">
          <div>Peso: <span class="text-yellow-400">${airframe.weight.toLocaleString()} kg</span></div>
          <div>Limite G: <span class="text-green-400">${airframe.gLimit}G</span></div>
          <div>Hardpoints: <span class="text-blue-400">${airframe.hardpoints}</span></div>
          <div>Combustível: <span class="text-cyan-400">${airframe.fuel}L</span></div>
        </div>
      </div>
    `).join('');
  }
}
