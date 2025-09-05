// js/utils/aircraftCostSystem.js - Aircraft cost calculation system (Phase 1)

export class AircraftCostSystem {
  static getSelectedAirframe(aircraft) {
    const id = aircraft?.airframe;
    return id && window.AIRCRAFT_COMPONENTS?.airframes?.[id] ? window.AIRCRAFT_COMPONENTS.airframes[id] : null;
  }

  static getSelectedEngine(aircraft) {
    const id = aircraft?.engine;
    return id && window.AIRCRAFT_COMPONENTS?.aircraft_engines?.[id] ? window.AIRCRAFT_COMPONENTS.aircraft_engines[id] : null;
  }

  static getSelectedWeapons(aircraft) {
    const ids = Array.isArray(aircraft?.weapons) ? aircraft.weapons : [];
    const all = window.AIRCRAFT_COMPONENTS?.aircraft_weapons || {};
    return ids.map(id => all[id]).filter(Boolean);
  }

  static calculateCosts(aircraft) {
    const airframe = this.getSelectedAirframe(aircraft);
    const engine = this.getSelectedEngine(aircraft);
    if (!airframe || !engine) {
      return this.getDefaultCosts();
    }

    // Airframe base cost: weight-driven, supersonic multiplier
    const emptyKg = Number(airframe.base_weight) || 0;
    const isSupersonic = (Number(airframe.max_speed_kph) || 0) >= 1200;
    let airframeCost = emptyKg * 60; // $60/kg baseline
    if (isSupersonic) airframeCost *= 1.6;

    // Engine cost: function of thrust and complexity
    const thrustMil = Number(engine.military_thrust || engine.thrust) || 0; // kgf
    let engineCost = thrustMil * 250; // ~$250 por kgf (jet inicial)
    if (engine.afterburner_thrust) engineCost *= 1.3; // complexidade do pós-combustor

    // Weapons cost (hardware)
    const weapons = this.getSelectedWeapons(aircraft);
    let weaponsCost = 0;
    weapons.forEach(w => {
      if (!w) return;
      if (w.type === 'cannon') weaponsCost += 120000; // canhão interno/torreta
      else if (w.type === 'bomb') weaponsCost += 10000; // pilone + integração
      else weaponsCost += 8000; // fallback para outras cargas
    });

    // Integration & systems baseline (fase 1: baixo)
    const integrationCost = Math.round((airframeCost + engineCost + weaponsCost) * 0.08);

    const production = Math.round(airframeCost + engineCost + weaponsCost + integrationCost);

    // Manutenção por hora: tipo de motor e confiabilidade
    const baseMaint = engine.afterburner_thrust ? 3200 : 2200; // $/hora
    const reliability = Number(engine.reliability) || 0.8;
    const maintenance = Math.round(baseMaint * (1.2 - 0.4 * reliability));

    return {
      unitCost: production,
      maintenanceCostPerHour: maintenance,
      breakdown: {
        airframe: Math.round(airframeCost),
        engine: Math.round(engineCost),
        weapons: Math.round(weaponsCost),
        integration: Math.round(integrationCost)
      }
    };
  }

  static getDefaultCosts() {
    return {
      unitCost: 0,
      maintenanceCostPerHour: 0,
      breakdown: {
        airframe: 0,
        engine: 0,
        weapons: 0,
        integration: 0
      }
    };
  }

  static renderCostDisplay(aircraft) {
    const costs = this.calculateCosts(aircraft || window.currentAircraft || {});
    const quantity = Number(aircraft?.quantity || (window.currentAircraft?.quantity) || 1) || 1;
    const unitK = (costs.unitCost / 1000) || 0;
    const maintK = (costs.maintenanceCostPerHour / 1) || 0;

    let html = '<h3 class="text-xl font-semibold text-slate-100 mb-4">Custos</h3>';
    html += '<div class="grid grid-cols-2 gap-4 mb-6">';
    html += `<div class="p-4 rounded-lg bg-green-900/20 border border-green-500/30"><div class="text-green-300 text-sm font-medium">Custo por Unidade</div><div class="text-green-100 text-xl font-bold">$${unitK.toFixed(0)}K</div></div>`;
    html += `<div class="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30"><div class="text-yellow-300 text-sm font-medium">Manutenção por Hora</div><div class="text-yellow-100 text-xl font-bold">$${maintK.toFixed(0)}</div></div>`;
    html += '</div>';

    if (quantity > 1) {
      html += `<div class="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 mb-4"><div class="flex items-center justify-between"><span class="text-blue-300 font-medium">Custo Total do Projeto (${quantity} unidades)</span><span class="text-blue-100 font-bold text-lg">$${((costs.unitCost * quantity) / 1_000_000).toFixed(1)}M</span></div></div>`;
    }

    const order = Object.entries(costs.breakdown || {}).sort((a,b)=>b[1]-a[1]);
    html += '<div class="mb-2"><h4 class="text-slate-200 font-medium mb-3">Breakdown por Unidade</h4><div class="space-y-2">';
    order.forEach(([k,v]) => {
      if (!v) return;
      const pct = costs.unitCost > 0 ? ((v / costs.unitCost) * 100).toFixed(1) : '0.0';
      html += `<div class="flex items-center justify-between p-2 rounded bg-slate-800/30"><span class="text-slate-200">${this.fmt(k)}</span><div class="flex items-center gap-3"><span class="text-slate-400 text-sm">${pct}%</span><span class="text-slate-100 font-semibold">$${(v/1000).toFixed(0)}K</span></div></div>`;
      html += `<div class="h-1 bg-slate-700 rounded-full overflow-hidden ml-2 mb-2"><div class="h-full bg-brand-500" style="width:${pct}%"></div></div>`;
    });
    html += '</div></div>';

    return html;
  }

  static fmt(k) {
    const map = { airframe: 'Fuselagem', engine: 'Motor', weapons: 'Armamentos', integration: 'Integração' };
    return map[k] || k;
  }
}

// Global exposure for non-module callers
window.AircraftCostSystem = AircraftCostSystem;

