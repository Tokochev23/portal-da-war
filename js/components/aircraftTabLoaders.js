// js/components/aircraftTabLoaders.js - Abas específicas do criador de aeronaves (Fase 1)

export class TabLoaders {
  constructor() { this.tabContent = null; }

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

  // ========= AIRCRAFT TABS =========
  loadAirframeTab() {
    const data = window.AIRCRAFT_COMPONENTS?.airframes || {};
    const ids = Object.keys(data);
    if (ids.length === 0) return this.showEmptyState('Nenhuma fuselagem disponível.');

    let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    ids.forEach(id => {
      const af = data[id];
      if (!this.isAvailable(af)) return; // gating simples
      html += this.renderAirframeCard(id, af);
    });
    html += '</div>';
    this.getTabContent().innerHTML = html;
  }

  renderAirframeCard(id, af) {
    const isSelected = window.currentAircraft?.airframe === id;
    const maxKph = af.max_speed_kph || 0;
    const weight = af.base_weight || 0;
    const mtow = af.max_takeoff_weight || 0;
    return `
      <button class="airframe-card component-card relative w-full text-left rounded-2xl p-4 border transition ${isSelected ? 'selected border-brand-400 ring-1 ring-brand-400/50' : 'border-slate-700/50 bg-slate-800/40'}" onclick="selectAirframe('${id}')">
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
        ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
      </button>`;
  }

  loadEngineTab() {
    const data = window.AIRCRAFT_COMPONENTS?.aircraft_engines || {};
    const ids = Object.keys(data);
    if (ids.length === 0) return this.showEmptyState('Nenhum motor disponível.');
    if (!window.currentAircraft?.airframe) return this.showEmptyState('Selecione uma fuselagem primeiro.');

    // Filtra por compatibilidade básica com a fuselagem
    const airframe = window.AIRCRAFT_COMPONENTS.airframes[window.currentAircraft.airframe];
    const allowedTypes = new Set(airframe?.compatible_engine_types || []);

    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    ids.forEach(id => {
      const eng = data[id];
      if (allowedTypes.size && !allowedTypes.has(eng.type)) return;
      html += this.renderEngineCard(id, eng);
    });
    html += '</div>';
    this.getTabContent().innerHTML = html;
  }

  renderEngineCard(id, eng) {
    const isSelected = window.currentAircraft?.engine === id;
    const thr = (eng.military_thrust || eng.thrust || 0);
    const rel = Math.round((eng.reliability || 0) * 100);
    return `
      <button class="engine-card component-card relative rounded-2xl p-4 text-left border transition ${isSelected ? 'selected border-brand-400 ring-1 ring-brand-400/50' : 'border-slate-700/50 bg-slate-800/40'}" onclick="selectAircraftEngine('${id}')">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-base font-semibold text-slate-100">${eng.name}</h4>
          ${eng.afterburner_thrust ? '<span class="px-2 py-0.5 text-xs rounded-lg text-white bg-amber-600">Pós-combustão</span>' : ''}
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>Empuxo: <b>${Math.round(thr)} kgf</b></div>
          <div>Peso: <b>${Math.round(eng.weight || 0)} kg</b></div>
          <div>Confiab.: <b>${rel}%</b></div>
          <div>Consumo: <b>${(eng.fuel_consumption || eng.sfc_mil || 0).toFixed(2)}</b></div>
        </div>
        ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
      </button>`;
  }

  loadWeaponsTab() {
    const data = window.AIRCRAFT_COMPONENTS?.aircraft_weapons || {};
    const ids = Object.keys(data);
    if (ids.length === 0) return this.showEmptyState('Nenhum armamento disponível.');
    if (!window.currentAircraft?.airframe) return this.showEmptyState('Selecione uma fuselagem primeiro.');

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
    // Fase 1: placeholder
    this.showEmptyState('Aviônicos mais avançados chegam na Fase 2.');
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

