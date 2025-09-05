// js/utils/aircraftPerformanceSystem.js - Aircraft performance calculation system (Phase 1)

export class AircraftPerformanceSystem {
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

  static calculatePerformance(aircraft) {
    const airframe = this.getSelectedAirframe(aircraft);
    const engine = this.getSelectedEngine(aircraft);
    if (!airframe || !engine) {
      return { error: 'Fuselagem e motor são obrigatórios', warnings: [] };
    }

    // Defaults to keep values safe
    const defaults = {
      wing_area_m2: 25,            // generic fighter wing area
      internal_fuel_kg: 1200,      // early jet internal fuel
      payload_max_kg: 2000,        // generic payload allowance
      base_drag_index: 1.0         // baseline drag factor
    };

    const wingArea = Number(airframe.wing_area_m2) || defaults.wing_area_m2;
    const internalFuel = Number(airframe.internal_fuel_kg) || defaults.internal_fuel_kg;
    const baseWeight = Number(airframe.base_weight) || 0;
    const mtow = Number(airframe.max_takeoff_weight) || (baseWeight + internalFuel + defaults.payload_max_kg);

    // Engine thrust handling (kgf). Prefer military (dry) thrust for baseline.
    const thrustMil = Number(engine.military_thrust || engine.thrust) || 0; // kgf
    const thrustAB = Number(engine.afterburner_thrust) || 0;                // kgf

    // Engine and weapons weights
    const engineWeight = Number(engine.weight) || 0;
    const weapons = this.getSelectedWeapons(aircraft);
    const weaponsWeight = weapons.reduce((sum, w) => sum + (Number(w.weight) || 0), 0);

    // Assume full internal fuel for ferry calculations; allow override via aircraft.fuel_load_kg
    const fuelLoad = Number(aircraft?.fuel_load_kg) || internalFuel;

    // Total weight estimate (kg)
    const totalWeight = baseWeight + engineWeight + weaponsWeight + fuelLoad;

    // Thrust-to-weight ratio (using kgf/kg simplifies, ~ g cancels out)
    const thrustToWeight = totalWeight > 0 ? (thrustMil / totalWeight) : 0;

    // Wing loading (kg/m2)
    const wingLoading = wingArea > 0 ? (totalWeight / wingArea) : 0;

    // Speed estimate: start from airframe max_speed_kph and adjust mildly by T/W and drag
    const baseMaxKph = Number(airframe.max_speed_kph) || 900;
    const dragFactor = Number(airframe.base_drag_index) || defaults.base_drag_index;
    const twAdj = 0.85 + Math.min(0.25, Math.max(-0.15, (thrustToWeight - 0.35))); // soft scaling
    const estimatedMaxSpeedKph = Math.round(baseMaxKph * twAdj / Math.max(0.8, dragFactor));

    // Rate of climb estimate (m/s): simple function of excess thrust
    const rateOfClimb = Math.max(0, Math.round(5 + 60 * Math.max(0, thrustToWeight - 0.25)));

    // Range estimate (km): endurance from fuel/SFC and cruise speed ~ 0.6 * max
    const sfcMil = Number(engine.fuel_consumption || engine.sfc_mil) || 1.0; // kg/s at military ~ placeholder
    const cruiseSpeed = 0.6 * estimatedMaxSpeedKph; // kph
    const enduranceHours = (fuelLoad > 0 && sfcMil > 0) ? (fuelLoad / sfcMil) / 3600 : 0; // hours
    const rangeFerryKm = Math.max(0, Math.round(enduranceHours * cruiseSpeed));

    const warnings = [];
    if (totalWeight > mtow) {
      warnings.push(`Peso total (${Math.round(totalWeight)} kg) excede MTOW (${mtow} kg)`);
    }

    return {
      totalWeight: Math.round(totalWeight),
      thrustToWeight: Number(thrustToWeight.toFixed(2)),
      wingLoading: Math.round(wingLoading),
      estimatedMaxSpeedKph,
      rateOfClimb,
      rangeFerryKm,
      hasAfterburner: thrustAB > 0,
      warnings
    };
  }

  static renderPerformanceDisplay(aircraft) {
    const perf = this.calculatePerformance(aircraft);
    if (perf?.error) {
      return `<div class="text-slate-300">${perf.error}</div>`;
    }
    return `
      <h3 class="text-xl font-semibold text-slate-100 mb-4">Desempenho de Voo</h3>
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div class="flex justify-between p-2 rounded bg-slate-800/30"><span class="text-slate-400">Peso Total</span><span class="text-slate-100 font-semibold">${perf.totalWeight.toLocaleString()} kg</span></div>
        <div class="flex justify-between p-2 rounded bg-slate-800/30"><span class="text-slate-400">Relação Empuxo/Peso</span><span class="text-slate-100 font-semibold">${perf.thrustToWeight}</span></div>
        <div class="flex justify-between p-2 rounded bg-slate-800/30"><span class="text-slate-400">Carga Alar</span><span class="text-slate-100 font-semibold">${perf.wingLoading} kg/m²</span></div>
        <div class="flex justify-between p-2 rounded bg-slate-800/30"><span class="text-slate-400">Velocidade Máx.</span><span class="text-slate-100 font-semibold">${perf.estimatedMaxSpeedKph} km/h</span></div>
        <div class="flex justify-between p-2 rounded bg-slate-800/30"><span class="text-slate-400">Razão de Subida</span><span class="text-slate-100 font-semibold">${perf.rateOfClimb} m/s</span></div>
        <div class="flex justify-between p-2 rounded bg-slate-800/30"><span class="text-slate-400">Alcance (ferry)</span><span class="text-slate-100 font-semibold">${perf.rangeFerryKm} km</span></div>
      </div>
      ${Array.isArray(perf.warnings) && perf.warnings.length ? (`<div class=\"mt-3 text-amber-300 text-xs\">${perf.warnings.map(w=>`• ${w}`).join('<br/>')}</div>`) : ''}
    `;
  }
}

// Global exposure for non-module callers
window.AircraftPerformanceSystem = AircraftPerformanceSystem;

