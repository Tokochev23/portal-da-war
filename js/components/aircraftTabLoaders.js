// js/components/aircraftTabLoaders.js - Abas específicas do criador de aeronaves (Fase 1)

class TabLoaders {
  constructor() { 
    this.tabContent = null; 
    this.currentTechLevel = 50; // Default tech level
  }

  getTabContent() {
    if (!this.tabContent) this.tabContent = document.getElementById('tab-content');
    return this.tabContent;
  }

  showLoadingState(message = 'Carregando componentes...') {
    const el = this.getTabContent();
    if (el) el.innerHTML = `<div class="text-center text-slate-400 p-8">${message}</div>`;
  }

  showEmptyState(message) {
    const el = this.getTabContent();
    if (el) el.innerHTML = `<div class=\"text-center text-slate-500 p-8\">${message}</div>`;
  }

  // Update current tech level from the globally available user country data
  updateTechLevel() {
    if (window.currentUserCountry && typeof window.currentUserCountry.aircraftTech !== 'undefined') {
        this.currentTechLevel = window.currentUserCountry.aircraftTech;
        console.log(`✅ Tech level successfully set to: ${this.currentTechLevel} for country: ${window.currentUserCountry.Pais}`);
    } else {
        // This case should ideally not be reached if the new initialization flow works correctly.
        this.currentTechLevel = 50; // Fallback to default
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
    const requiredTech = component.tech_level || 0;
    const isAvailable = this.currentTechLevel >= requiredTech;
    
    return {
      isAvailable,
      requiredTech,
      currentTech: this.currentTechLevel,
      missingTech: Math.max(0, requiredTech - this.currentTechLevel)
    };
  }

  // ========= AIRCRAFT TABS =========
  loadCellTab() {
    console.log('🔄 Loading Cell Tab (Airframes)...');
    this.loadAirframeTab();
  }

  loadAirframeTab() {
    console.log('🔄 Loading Airframe Tab...');
    
    // Check if components are loaded
    if (!window.AIRCRAFT_COMPONENTS || !window.AIRCRAFT_COMPONENTS.airframes) {
      console.warn('⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...');
      // Show loading state
      this.showLoadingState('Carregando componentes de aeronaves...');
      
      // Try to trigger component loading
      if (window.loadAircraftComponents) {
        window.loadAircraftComponents().then(() => {
          console.log('✅ Components loaded, retrying...');
          this.loadAirframeTab();
        }).catch(error => {
          console.error('❌ Failed to load components:', error);
          this.showEmptyState('Erro ao carregar componentes de aeronaves.');
        });
      } else {
        this.showEmptyState('Sistema de componentes não encontrado.');
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

  loadWingsTab() {
    console.log('🔄 Loading Wings Tab...');
    this.updateTechLevel();

    // Ensure components are loaded
    if (!window.AIRCRAFT_COMPONENTS?.wing_types || !window.AIRCRAFT_COMPONENTS?.wing_features) {
      // Attempt to load them if they are missing
      if (window.loadAircraftComponents) {
        this.showLoadingState('Carregando componentes de asas...');
        window.loadAircraftComponents().then(() => this.loadWingsTab());
      } else {
        this.showEmptyState('Componentes de asas não encontrados.');
      }
      return;
    }

    // Fetch and render the tab template
    fetch('templates/aircraft-creator/wings-tab.html')
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(html => {
        this.getTabContent().innerHTML = html;
        this.populateWingsTab();
      })
      .catch(error => {
        console.error('❌ Failed to load wings tab template:', error);
        this.showEmptyState('Erro ao carregar a aba de Asas.');
      });
  }

  populateWingsTab() {
    const wingTypeSelect = document.getElementById('wing_type');
    const wingFeaturesContainer = document.getElementById('wing_features_checkboxes');
    const noteElement = document.getElementById('wing_type_note');

    if (!wingTypeSelect || !wingFeaturesContainer || !noteElement) {
        console.error('Wing tab elements not found');
        return;
    }

    const wingTypes = this.filterAvailableComponents(window.AIRCRAFT_COMPONENTS.wing_types);
    const wingFeatures = this.filterAvailableComponents(window.AIRCRAFT_COMPONENTS.wing_features);

    // Categorize wing types
    const categories = {
      obsolete: [], // Tech <= 30
      piston: [],   // Tech 31-45  
      earlyJet: [], // Tech 46-60
      experimental: [] // Tech 61+
    };
    
    for (const [id, type] of Object.entries(wingTypes)) {
      const techLevel = type.tech_level || 0;
      if (techLevel <= 30) categories.obsolete.push({id, type});
      else if (techLevel <= 45) categories.piston.push({id, type});
      else if (techLevel <= 60) categories.earlyJet.push({id, type});
      else categories.experimental.push({id, type});
    }

    // Find optgroups and populate them
    const optGroups = wingTypeSelect.querySelectorAll('optgroup');
    
    // Clear existing options except the default
    wingTypeSelect.innerHTML = '<option value="">-- Selecione um Tipo de Asa --</option>';
    
    // Recreate optgroups and populate
    if (categories.obsolete.length > 0) {
      const obsoleteGroup = document.createElement('optgroup');
      obsoleteGroup.label = '🏛️ Era da Hélice (Obsoletas)';
      categories.obsolete.forEach(({id, type}) => {
        const isSelected = window.currentAircraft?.wings?.type === id;
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${type.name} (Tech ${type.tech_level || 0})`;
        option.selected = isSelected;
        obsoleteGroup.appendChild(option);
      });
      wingTypeSelect.appendChild(obsoleteGroup);
    }
    
    if (categories.piston.length > 0) {
      const pistonGroup = document.createElement('optgroup');
      pistonGroup.label = '✈️ Caças a Hélice (1945-1950)';
      categories.piston.forEach(({id, type}) => {
        const isSelected = window.currentAircraft?.wings?.type === id;
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${type.name} (Tech ${type.tech_level || 0})`;
        option.selected = isSelected;
        pistonGroup.appendChild(option);
      });
      wingTypeSelect.appendChild(pistonGroup);
    }
    
    if (categories.earlyJet.length > 0) {
      const jetGroup = document.createElement('optgroup');
      jetGroup.label = '🚀 Primeiros Jatos (1950-1954)';
      categories.earlyJet.forEach(({id, type}) => {
        const isSelected = window.currentAircraft?.wings?.type === id;
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${type.name} (Tech ${type.tech_level || 0})`;
        option.selected = isSelected;
        jetGroup.appendChild(option);
      });
      wingTypeSelect.appendChild(jetGroup);
    }
    
    if (categories.experimental.length > 0) {
      const expGroup = document.createElement('optgroup');
      expGroup.label = '🔬 Experimentais (1954)';
      categories.experimental.forEach(({id, type}) => {
        const isSelected = window.currentAircraft?.wings?.type === id;
        const option = document.createElement('option');
        option.value = id;
        option.textContent = `${type.name} (Tech ${type.tech_level || 0})`;
        option.selected = isSelected;
        expGroup.appendChild(option);
      });
      wingTypeSelect.appendChild(expGroup);
    }

    // Populate Wing Features organized by category
    wingFeaturesContainer.innerHTML = '';
    
    // Categorize wing features
    const featureCategories = {
      hyperlift: [],    // Flaps, slats
      naval: [],        // Naval systems
      control: [],      // Control surfaces
      advanced: [],     // Advanced systems
      payload: []       // Tanks, hardpoints
    };
    
    for (const [id, feature] of Object.entries(wingFeatures)) {
      if (id.includes('flaps') || id.includes('slats')) featureCategories.hyperlift.push({id, feature});
      else if (id.includes('folding') || id.includes('reinforced')) featureCategories.naval.push({id, feature});
      else if (id.includes('ailerons') || id.includes('spoilers') || id.includes('air_brakes')) featureCategories.control.push({id, feature});
      else if (id.includes('fences') || id.includes('boundary_layer')) featureCategories.advanced.push({id, feature});
      else if (id.includes('tanks') || id.includes('hardpoints')) featureCategories.payload.push({id, feature});
      else featureCategories.hyperlift.push({id, feature}); // Default category
    }
    
    // Create organized sections
    const createFeatureSection = (title, features, icon) => {
      if (features.length === 0) return '';
      
      let html = `<div class="col-span-full"><h4 class="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2"><span>${icon}</span>${title}</h4></div>`;
      
      features.forEach(({id, feature}) => {
        const isChecked = window.currentAircraft?.wings?.features?.includes(id);
        html += `
          <div class="form-check flex items-center gap-2 mb-1">
            <input class="form-check-input h-4 w-4 rounded-md" type="checkbox" value="${id}" id="wing-feature-${id}" ${isChecked ? 'checked' : ''}>
            <label class="form-check-label text-slate-300 text-sm" for="wing-feature-${id}">
              ${feature.name} <span class="text-xs text-slate-500">(Tech ${feature.tech_level || 0})</span>
            </label>
          </div>
        `;
      });
      
      return html;
    };
    
    wingFeaturesContainer.innerHTML = 
      createFeatureSection('Dispositivos Hipersustentadores', featureCategories.hyperlift, '🛬') +
      createFeatureSection('Sistemas de Controle', featureCategories.control, '🎛️') +
      createFeatureSection('Sistemas Navais', featureCategories.naval, '🚢') +
      createFeatureSection('Sistemas Avançados', featureCategories.advanced, '🔬') +
      createFeatureSection('Tanques & Armamentos', featureCategories.payload, '⚡');
    
    
    // Set initial note
    if(window.currentAircraft?.wings?.type) {
        noteElement.textContent = window.AIRCRAFT_COMPONENTS.wing_types[window.currentAircraft.wings.type]?.description || 'Selecione um tipo de asa.';
    }

    // Add event listeners
    wingTypeSelect.addEventListener('change', (e) => {
      if (!window.currentAircraft.wings) window.currentAircraft.wings = {};
      window.currentAircraft.wings.type = e.target.value;
      noteElement.textContent = window.AIRCRAFT_COMPONENTS.wing_types[e.target.value]?.description || 'Selecione um tipo de asa.';
      updateAircraftCalculations();
    });

    wingFeaturesContainer.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox') {
        if (!window.currentAircraft.wings) window.currentAircraft.wings = { features: [] };
        if (!window.currentAircraft.wings.features) window.currentAircraft.wings.features = [];
        
        const featureId = e.target.value;
        if (e.target.checked) {
          if (!window.currentAircraft.wings.features.includes(featureId)) {
            window.currentAircraft.wings.features.push(featureId);
          }
        } else {
          const index = window.currentAircraft.wings.features.indexOf(featureId);
          if (index > -1) {
            window.currentAircraft.wings.features.splice(index, 1);
          }
        }
        updateAircraftCalculations();
      }
    });
  }

  loadPropulsionTab() {
    console.log('🔄 Loading Propulsion Tab (Engines)...');
    this.loadEngineTab();
  }

  loadEngineTab() {
    console.log('🔄 Loading Engine Tab...');
    
    // Check if components are loaded
    if (!window.AIRCRAFT_COMPONENTS || !window.AIRCRAFT_COMPONENTS.aircraft_engines) {
      console.warn('⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...');
      // Show loading state
      this.showLoadingState('Carregando motores de aeronaves...');
      
      // Try to trigger component loading
      if (window.loadAircraftComponents) {
        window.loadAircraftComponents().then(() => {
          console.log('✅ Components loaded, retrying...');
          this.loadEngineTab();
        }).catch(error => {
          console.error('❌ Failed to load components:', error);
          this.showEmptyState('Erro ao carregar componentes de aeronaves.');
        });
      } else {
        this.showEmptyState('Sistema de componentes não encontrado.');
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

    // Filter engines based on tech level
    const availableData = this.filterAvailableComponents(allData);
    console.log(`🔬 Engines: ${Object.keys(availableData).length} available out of ${ids.length} total`);
    
    const data = allData; // Use all data for display, but mark unavailable ones

    const airframe = window.AIRCRAFT_COMPONENTS.airframes[window.currentAircraft.airframe];
    const allowedTypes = new Set(airframe?.compatible_engine_types || []);

    // Nova interface avançada de cálculo de potência
    const desiredSpeedSection = window.advancedPerformanceCalculator ? 
        window.advancedPerformanceCalculator.renderPowerCalculationInterface() : 
        `<div class="mb-6 p-6 bg-slate-900/50 border border-slate-700/50 rounded-xl">
            <h3 class="text-lg font-semibold text-slate-100 mb-4">1. Definir Performance Desejada</h3>
            <div class="flex items-center gap-4">
                <div class="flex-1">
                    <label for="target-speed" class="block text-sm font-medium text-slate-300 mb-2">Velocidade Máxima Desejada (km/h)</label>
                    <input type="number" id="target-speed" min="100" max="1000" step="10" value="400" class="w-full bg-slate-800 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500" placeholder="Ex: 950">
                </div>
                <button id="calculate-power-btn" class="self-end px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">Calcular</button>
            </div>
            <div id="power-calculation-result" class="mt-4 text-center p-4 bg-slate-800 rounded-lg min-h-[60px]">
                <span class="text-slate-400">Insira uma velocidade e clique em calcular.</span>
            </div>
        </div>`;

    let html = desiredSpeedSection;
    html += `<h3 class="text-lg font-semibold text-slate-100 mb-4">2. Selecionar Motor Compatível</h3>`;
    html += '<div id="engine-list-container" class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    ids.forEach(id => {
      const eng = data[id];
      if (allowedTypes.size && !allowedTypes.has(eng.type)) return;
      html += this.renderEngineCard(id, eng);
    });
    html += '</div>';
    this.getTabContent().innerHTML = html;
    
    // Adiciona o event listener para o novo botão
    document.getElementById('calculate-power-btn').addEventListener('click', () => {
        if (typeof window.handleCalculateRequiredPower === 'function') {
            window.handleCalculateRequiredPower();
        }
    });
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
        if (airframe) {
          const aircraftConfig = {
            airframe: airframe,
            engine: engine,
            engineCount: engineCount,
            weapons: window.currentAircraft.weapons || [],
            avionics: window.currentAircraft.avionics || [],
            fuel: window.currentAircraft.fuelLevel || 1.0,
            altitude: 0
          };
          
          const advancedResults = window.advancedPerformanceCalculator.calculateCompletePerformance(aircraftConfig);
          
          if (advancedResults && !advancedResults.error) {
            console.log('✅ TabLoaders: Sistema avançado executado');
            
            // Converte para formato compatível
            const summary = advancedResults.summary;
            const isPistonEngine = advancedResults.power.type === 'piston';
            const hasAfterburner = engine.afterburner_thrust > 0;
            
            let totalThrust;
            if (isPistonEngine) {
              totalThrust = `${Math.round((engine.power_hp || 0) * engineCount)} HP`;
            } else {
              totalThrust = `${Math.round((engine.military_thrust || engine.thrust || 0) * engineCount)} kgf`;
            }
            
            return {
              totalThrust,
              totalThrustAB: hasAfterburner ? `${Math.round(engine.afterburner_thrust * engineCount)} kgf` : null,
              totalEngineWeight: advancedResults.mass.engineWeight,
              fuelConsumption: `${advancedResults.operationalPerformance.fuelFlowRate.toFixed(2)} kg/h`,
              reliability: Math.round((engine.reliability || 0.8) * 100 * Math.pow(0.96, engineCount - 1)),
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

  loadWeaponsTab() {
    console.log('🔄 Loading Weapons Tab...');
    
    // Check if components are loaded
    if (!window.AIRCRAFT_COMPONENTS || !window.AIRCRAFT_COMPONENTS.aircraft_weapons) {
      console.warn('⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...');
      // Show loading state
      this.showLoadingState('Carregando armamentos de aeronaves...');
      
      // Try to trigger component loading
      if (window.loadAircraftComponents) {
        window.loadAircraftComponents().then(() => {
          console.log('✅ Components loaded, retrying...');
          this.loadWeaponsTab();
        }).catch(error => {
          console.error('❌ Failed to load components:', error);
          this.showEmptyState('Erro ao carregar componentes de aeronaves.');
        });
      } else {
        this.showEmptyState('Sistema de componentes não encontrado.');
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

  loadAvionicsTab() {
    console.log('🔄 Loading Avionics Tab...');
    
    if (!window.AIRCRAFT_COMPONENTS?.avionics) {
      this.showLoadingState('Carregando sistemas aviônicos...');
      if (window.loadAircraftComponents) {
        window.loadAircraftComponents().then(() => this.loadAvionicsTab());
      } else {
        this.showEmptyState('Sistema de componentes não encontrado.');
      }
      return;
    }
    
    this.updateTechLevel();
    
    fetch('templates/aircraft-creator/avionics-tab.html')
      .then(response => response.text())
      .then(html => {
        this.getTabContent().innerHTML = html;
        this.populateAvionicsTab();
      })
      .catch(error => {
        console.error('❌ Failed to load avionics tab template:', error);
        this.showEmptyState('Erro ao carregar a aba de Aviônicos.');
      });
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
}

window.tabLoaders = new TabLoaders();

