// js/utils/realisticPerformanceCalculator.js - Realistic Aircraft Performance Calculator
// Adapted from War-1918-aeronautica system

class RealisticPerformanceCalculator {
    constructor() {
        // Physical constants (ISA Standard Atmosphere)
        this.constants = {
            temp_sea_level_k: 288.15,           // K
            pressure_sea_level_pa: 101325,      // Pa
            temp_lapse_rate_k_per_m: 0.0065,    // K/m
            gas_constant_air_specific: 287,      // J/(kg·K)
            standard_gravity_ms2: 9.80665,      // m/s²
            density_sea_level_kg_m3: 1.225,     // kg/m³
            min_roc_for_ceiling: 0.5,           // m/s minimum RoC for service ceiling
            turn_g_force: 6                     // Maximum sustained G-force for turns
        };
    }

    /**
     * Calculates air properties at given altitude using ISA model
     */
    getAirPropertiesAtAltitude(altitude_m) {
        const h = Math.max(0, altitude_m);
        const T0 = this.constants.temp_sea_level_k;
        const P0 = this.constants.pressure_sea_level_pa;
        const L = this.constants.temp_lapse_rate_k_per_m;
        const R = this.constants.gas_constant_air_specific;
        const g = this.constants.standard_gravity_ms2;

        const T = Math.max(216.65, T0 - L * h); // Temperature limited at tropopause
        const P = P0 * Math.pow((T / T0), g / (L * R));
        const rho = P / (R * T);

        return { temperature: T, pressure: P, density: rho };
    }

    /**
     * Calculates engine power at altitude for piston engines
     */
    calculatePistonEnginePowerAtAltitude(basePowerHP, altitude_m, engine) {
        const superchargerAlt = engine.supercharger_altitude_m || 0;
        let currentPower = 0;

        if (superchargerAlt === 0) {
            const currentAltProps = this.getAirPropertiesAtAltitude(altitude_m);
            const densityRatio = currentAltProps.density / this.constants.density_sea_level_kg_m3;
            currentPower = basePowerHP * densityRatio;
        } else if (altitude_m <= superchargerAlt) {
            currentPower = basePowerHP;
        } else {
            const ratedAltProps = this.getAirPropertiesAtAltitude(superchargerAlt);
            const currentAltProps = this.getAirPropertiesAtAltitude(altitude_m);
            const densityRatio = currentAltProps.density / ratedAltProps.density;
            currentPower = basePowerHP * densityRatio;
        }
        return currentPower;
    }

    /**
     * Finds equilibrium velocity where thrust equals drag. This is the core calculation.
     */
    findEquilibriumPerformance(aircraft, altitude_m) {
        const airframe = this.getAirframe(aircraft);
        const engine = this.getEngine(aircraft);
        if (!airframe || !engine) return { error: "Missing data" };

        const airProps = this.getAirPropertiesAtAltitude(altitude_m);
        const engineCount = aircraft.engineCount || 1;

        // --- Determine available power/thrust at current altitude ---
        let powerWatts = 0;
        let thrustNewtons = 0;
        
        const engineType = engine.type || '';
        if (engineType.includes('piston')) {
            const basePowerHP = (engine.power_hp || 0) * engineCount;
            const powerAtAltitudeHP = this.calculatePistonEnginePowerAtAltitude(basePowerHP, altitude_m, engine);
            powerWatts = powerAtAltitudeHP * 745.7;
        } else if (engineType.includes('turboprop')) {
            const baseShaftHP = (engine.shaft_hp || 0) * engineCount;
            // Turboprop power also decreases with altitude, similar to a supercharged piston engine
            const powerAtAltitudeHP = this.calculatePistonEnginePowerAtAltitude(baseShaftHP, altitude_m, { supercharger_altitude_m: 5000 }); // Assume a generic rated altitude
            powerWatts = powerAtAltitudeHP * 745.7;
        } else { // Jet engines
            const baseThrustKgF = (engine.military_thrust || engine.thrust || 0) * engineCount;
            const densityRatio = airProps.density / this.constants.density_sea_level_kg_m3;
            // Jet thrust decreases with altitude, proportional to air density ^ 0.7 (approximation)
            thrustNewtons = (baseThrustKgF * this.constants.standard_gravity_ms2) * Math.pow(densityRatio, 0.7);
        }

        // --- Aircraft Weight and Aero Properties (with Wing modifications) ---

        // 1. Get wing components
        const wingTypeData = aircraft.wings?.type ? window.AIRCRAFT_COMPONENTS.wing_types[aircraft.wings.type] : null;
        const wingFeaturesData = (aircraft.wings?.features || []).map(id => window.AIRCRAFT_COMPONENTS.wing_features[id]).filter(Boolean);

        // 2. Calculate wing modifiers
        let wingWeightMod = wingTypeData?.weight_mod || 1.0;
        let wingDragMod = wingTypeData?.drag_mod || 1.0;
        let wingClMaxMod = wingTypeData?.cl_max_mod || 1.0;
        let wingExtraWeight = 0;

        wingFeaturesData.forEach(feature => {
            wingDragMod *= (feature.drag_mod || 1.0);
            wingClMaxMod *= (feature.cl_max_mod || 1.0);
            wingExtraWeight += (feature.weight || 0);
        });

        // 3. Apply modifiers to calculate final stats
        const avionicsWeight = (aircraft.avionics || []).reduce((total, id) => total + (window.AIRCRAFT_COMPONENTS.avionics[id]?.weight || 0), 0);
        const baseEmptyWeight = (airframe.base_weight || 0) + ((engine.weight || 0) * engineCount);
        const emptyWeight = (baseEmptyWeight * wingWeightMod) + avionicsWeight + wingExtraWeight;
        
        const fuelWeight = (airframe.internal_fuel_kg || 0);
        const weaponsWeight = this.getWeaponsWeight(aircraft);
        const combatWeight = emptyWeight + fuelWeight + weaponsWeight;

        const wingArea = airframe.wing_area_m2 || 25;
        const aspectRatio = airframe.aspect_ratio || 6.0;
        const oswaldEfficiency = 0.8;
        const avionicsDrag = (aircraft.avionics || []).reduce((total, id) => total + (window.AIRCRAFT_COMPONENTS.avionics[id]?.drag_penalty || 0), 0);
        
        const baseCd0 = (airframe.cd_0 || airframe.base_drag_index || 0.025); // Use new cd_0 property
        const cd0 = (baseCd0 * wingDragMod) + avionicsDrag;
        
        const baseClMax = (airframe.cl_max || 1.5); // Use new cl_max property
        const cl_max = baseClMax * wingClMaxMod;

        // --- Iteratively find max speed (Thrust = Drag) ---
        let bestVelocity_ms = 0;
        let minDifference = Infinity;
        const maxSearchVelocity = engineType.includes('jet') ? 450 : 280; // m/s

        for (let v = 40; v <= maxSearchVelocity; v += 2) {
            const dynamicPressure = 0.5 * airProps.density * v * v;
            const CL = (combatWeight * this.constants.standard_gravity_ms2) / (dynamicPressure * wingArea);
            const CDi = (CL * CL) / (Math.PI * aspectRatio * oswaldEfficiency);
            
            const machNumber = v / Math.sqrt(1.4 * this.constants.gas_constant_air_specific * airProps.temperature);
            let waveDrag = 0;
            if (machNumber > 0.75) {
                waveDrag = 0.02 * Math.pow(machNumber - 0.75, 2.5);
            }

            const CD = cd0 + CDi + waveDrag;
            const dragForce = CD * dynamicPressure * wingArea;

            // --- Calculate Thrust at current velocity 'v' ---
            let thrustForce = 0;
            if (engineType.includes('piston') || engineType.includes('turboprop')) {
                const propEfficiency = 0.85; // Assume modern constant-speed propeller
                thrustForce = (powerWatts * propEfficiency) / Math.max(v, 1);
            } else { // Jet
                thrustForce = thrustNewtons;
            }

            const difference = Math.abs(thrustForce - dragForce);
            if (difference < minDifference) {
                minDifference = difference;
                bestVelocity_ms = v;
            }
        }
        
        const maxStructuralSpeed = (airframe.max_speed_kph || 900) / 3.6;
        bestVelocity_ms = Math.min(bestVelocity_ms, maxStructuralSpeed);

        // --- Calculate other metrics based on equilibrium speed ---
        const rateOfClimb = this.calculateRateOfClimb(bestVelocity_ms, combatWeight, wingArea, cd0, aspectRatio, oswaldEfficiency, powerWatts, thrustNewtons, airProps, engine);
        const thrustToWeight = this.calculateThrustToWeight(bestVelocity_ms, powerWatts, thrustNewtons, combatWeight, engine);

        return {
            totalWeight: combatWeight,
            maxSpeedKph: bestVelocity_ms * 3.6,
            rateOfClimb_ms: rateOfClimb,
            thrustToWeight: thrustToWeight,
            wingLoading: combatWeight / wingArea,
            stallSpeedKph: Math.sqrt((2 * combatWeight * this.constants.standard_gravity_ms2) / (airProps.density * wingArea * cl_max)) * 3.6,
            fuelWeight: fuelWeight
        };
    }

    calculateRateOfClimb(climb_v_ms, weight, wingArea, cd0, aspectRatio, oswaldEff, powerWatts, thrustNewtons, airProps, engine) {
        const dynamicPressure = 0.5 * airProps.density * climb_v_ms * climb_v_ms;
        const CL = (weight * this.constants.standard_gravity_ms2) / (dynamicPressure * wingArea);
        const CDi = (CL * CL) / (Math.PI * aspectRatio * oswaldEff);
        const CD = cd0 + CDi;
        const dragForce = CD * dynamicPressure * wingArea;

        let thrustForce = 0;
        const engineType = engine.type || '';
        if (engineType.includes('piston') || engineType.includes('turboprop')) {
            const propEfficiency = 0.80; // Slightly lower efficiency during climb
            thrustForce = (powerWatts * propEfficiency) / Math.max(climb_v_ms, 1);
        } else { // Jet
            thrustForce = thrustNewtons;
        }

        const excessPower = (thrustForce - dragForce) * climb_v_ms;
        const rateOfClimb = excessPower / (weight * this.constants.standard_gravity_ms2);
        return Math.max(0, rateOfClimb);
    }

    calculateThrustToWeight(velocity_ms, powerWatts, thrustNewtons, weight, engine) {
        let actualThrust = 0;
        const engineType = engine.type || '';
        if (engineType.includes('piston') || engineType.includes('turboprop')) {
            const propEfficiency = 0.85;
            actualThrust = (powerWatts * propEfficiency) / Math.max(velocity_ms, 1);
        } else { // Jet
            actualThrust = thrustNewtons;
        }
        const weightNewtons = weight * this.constants.standard_gravity_ms2;
        return actualThrust / weightNewtons;
    }

    calculateServiceCeiling(aircraft) {
        let ceiling = 15000; // Max search altitude
        for (let h = 1000; h <= 15000; h += 500) {
            const perf = this.findEquilibriumPerformance(aircraft, h);
            if (perf.rateOfClimb_ms < this.constants.min_roc_for_ceiling) {
                ceiling = h;
                break;
            }
        }
        return ceiling;
    }

    calculateRange(aircraft, perf) {
        const engine = this.getEngine(aircraft);
        if (!engine || perf.fuelWeight <= 0) return 0;

        const cruiseSpeed_ms = perf.maxSpeedKph / 3.6 * 0.75;
        const L_D_ratio = 12; // Approximation for L/D max
        const g = this.constants.standard_gravity_ms2;
        const W_initial = perf.totalWeight;
        const W_final = perf.totalWeight - perf.fuelWeight;

        let sfc; // Specific Fuel Consumption in kg/(N·s)
        const engineType = engine.type || '';
        if (engineType.includes('jet')) {
            // sfc_military is often given in g/(kN·s) or similar, here we use a direct approach
            // fuel_consumption (kg/s) / thrust (N)
            const thrust_N = (engine.military_thrust || engine.thrust) * g;
            sfc = (engine.fuel_consumption || 1.0) / thrust_N;
        } else { // Piston or Turboprop
            // Convert power-specific fuel consumption to thrust-specific
            // PSFC (kg/W·s) = (sfc_g_kwh / 1000) / 3.6e6
            // TSFC = PSFC * V / prop_eff
            // This is complex, let's use a simplified SFC based on fuel flow at cruise
            const power_W = (engine.power_hp || engine.shaft_hp || 0) * 745.7;
            const fuel_flow_cruise = (engine.fuel_consumption || 0.2); // kg/s
            sfc = fuel_flow_cruise / (power_W * 0.7); // Rough TSFC
        }
        
        // Breguet Range Equation for jet aircraft
        const range_m = (cruiseSpeed_ms / (sfc * g)) * L_D_ratio * Math.log(W_initial / W_final);
        
        // Apply a balance factor
        const balanceFactor = (engineType.includes('jet') || engineType.includes('turboprop')) ? 1.2 : 1.8;

        return (range_m / 1000) * balanceFactor;
    }

    getWeaponsWeight(aircraft) {
        if (!aircraft.weapons || !Array.isArray(aircraft.weapons)) return 0;
        return aircraft.weapons.reduce((total, weaponId) => {
            const weapon = window.AIRCRAFT_COMPONENTS?.aircraft_weapons?.[weaponId];
            return total + (weapon?.weight || 0);
        }, 0);
    }

    getAirframe(aircraft) {
        return window.AIRCRAFT_COMPONENTS?.airframes?.[aircraft.airframe];
    }

    getEngine(aircraft) {
        return window.AIRCRAFT_COMPONENTS?.aircraft_engines?.[aircraft.engine];
    }
    
    generateWarnings(aircraft, perf) {
        const warnings = [];
        const airframe = this.getAirframe(aircraft);
        const engine = this.getEngine(aircraft);
        const currentUserCountry = window.getCurrentUserCountry();
        const currentTech = currentUserCountry?.aircraftTech || 0;

        // Basic checks
        if (!airframe) {
            warnings.push("Fuselagem não selecionada.");
            return warnings; // Stop further checks if basic components are missing
        }
        if (!engine) {
            warnings.push("Motor não selecionado.");
            return warnings; // Stop further checks if basic components are missing
        }

        // Weight and structural limits
        if (perf.totalWeight > (airframe.max_takeoff_weight || Infinity)) {
            warnings.push(`Peso total (${Math.round(perf.totalWeight)} kg) excede o Peso Máximo de Decolagem (MTOW) da fuselagem (${airframe.max_takeoff_weight} kg).`);
        }
        if (perf.maxSpeedKph > (airframe.max_speed_kph || Infinity)) {
             warnings.push(`Velocidade máxima (${Math.round(perf.maxSpeedKph)} km/h) excede o limite estrutural da fuselagem (${airframe.max_speed_kph} km/h).`);
        }
        if (perf.stallSpeedKph > 200) { // High stall speed is dangerous
            warnings.push(`Velocidade de stall (${Math.round(perf.stallSpeedKph)} km/h) é perigosamente alta, dificultando pousos e decolagens.`);
        }
        if (perf.wingLoading > 300) { // Very high wing loading
            warnings.push(`Carga alar (${Math.round(perf.wingLoading)} kg/m²) muito alta, comprometendo a manobrabilidade e a sustentação.`);
        }

        // Engine performance
        if (perf.thrustToWeight < 0.25) { // Very low thrust-to-weight ratio
            warnings.push(`Relação Empuxo/Peso (${perf.thrustToWeight.toFixed(2)}:1) muito baixa. A aeronave terá dificuldade em decolar e subir.`);
        }
        if (perf.rateOfClimb < 100) { // Very low rate of climb
            warnings.push(`Taxa de subida (${Math.round(perf.rateOfClimb)} m/min) muito baixa, indicando performance de ascensão pobre.`);
        }

        // Technology requirements
        if (airframe.tech_level > currentTech) {
            warnings.push(`Nível tecnológico da fuselagem (${airframe.tech_level}) excede sua tecnologia atual (${currentTech}).`);
        }
        if (engine.tech_level > currentTech) {
            warnings.push(`Nível tecnológico do motor (${engine.tech_level}) excede sua tecnologia atual (${currentTech}).`);
        }
        // Check weapons and avionics tech levels
        (aircraft.weapons || []).forEach(weaponId => {
            const weapon = window.AIRCRAFT_COMPONENTS.aircraft_weapons[weaponId];
            if (weapon && weapon.tech_level > currentTech) {
                warnings.push(`Nível tecnológico do armamento "${weapon.name}" (${weapon.tech_level}) excede sua tecnologia atual (${currentTech}).`);
            }
        });
        (aircraft.avionics || []).forEach(avionicsId => {
            const avionicsComp = window.AIRCRAFT_COMPONENTS.avionics[avionicsId];
            if (avionicsComp && avionicsComp.tech_level > currentTech) {
                warnings.push(`Nível tecnológico da aviônica "${avionicsComp.name}" (${avionicsComp.tech_level}) excede sua tecnologia atual (${currentTech}).`);
            }
        });

        // Incompatibilities (example: piston engine with very high speed airframe)
        if (engine.type.includes('piston') && (airframe.max_speed_kph || 0) > 700) {
            warnings.push(`Fuselagem de alta velocidade (${airframe.max_speed_kph} km/h) pode não ser ideal para um motor a pistão.`);
        }
        if (engine.type.includes('jet') && (airframe.max_speed_kph || 0) < 500) {
            warnings.push(`Motor a jato em fuselagem de baixa velocidade (${airframe.max_speed_kph} km/h) pode ser ineficiente.`);
        }

        return warnings;
    }

    /**
     * Main calculation function. This is the primary entry point.
     */
    calculateAircraftPerformance(aircraft = window.currentAircraft) {
        if (!aircraft || !this.getAirframe(aircraft) || !this.getEngine(aircraft)) {
            return { error: 'Selecione uma fuselagem e um motor para começar.' };
        }

        try {
            // Perform detailed calculation at sea level
            const perfSeaLevel = this.findEquilibriumPerformance(aircraft, 0);
            if (perfSeaLevel.error) return perfSeaLevel;

            // Calculate service ceiling
            const serviceCeiling = this.calculateServiceCeiling(aircraft);
            
            // Calculate range
            const range = this.calculateRange(aircraft, perfSeaLevel);

            const result = {
                totalWeight: Math.round(perfSeaLevel.totalWeight),
                maxSpeed: Math.round(perfSeaLevel.maxSpeedKph),
                maxSpeedKph: Math.round(perfSeaLevel.maxSpeedKph),
                cruiseSpeed: Math.round(perfSeaLevel.maxSpeedKph * 0.75),
                stallSpeed: Math.round(perfSeaLevel.stallSpeedKph),
                rateOfClimb: Math.round(perfSeaLevel.rateOfClimb_ms * 60), // m/min
                thrustToWeight: Number(perfSeaLevel.thrustToWeight.toFixed(2)),
                wingLoading: Math.round(perfSeaLevel.wingLoading),
                serviceCeiling: Math.round(serviceCeiling),
                range: Math.round(range),
                warnings: this.generateWarnings(aircraft, perfSeaLevel),
            };
            
            // Create a summary object for the UI renderer, which expects it
            result.summary = { ...result };
            
            return result;
        } catch (error) {
            console.error('Error calculating aircraft performance:', error);
            return { error: error.message };
        }
    }

    /**
     * Calculates the required power/thrust for a given speed.
     */
    calculateRequiredPowerForSpeed(aircraft, targetSpeedKmh) {
        const airframe = this.getAirframe(aircraft);
        if (!airframe) return { error: "Selecione uma fuselagem primeiro." };

        const targetSpeed_ms = targetSpeedKmh / 3.6;
        const airProps = this.getAirPropertiesAtAltitude(0); // Calculation at sea level

        // --- Get Wing Modifiers ---
        const wingTypeData = aircraft.wings?.type ? window.AIRCRAFT_COMPONENTS.wing_types[aircraft.wings.type] : null;
        const wingFeaturesData = (aircraft.wings?.features || []).map(id => window.AIRCRAFT_COMPONENTS.wing_features[id]).filter(Boolean);
        let wingWeightMod = wingTypeData?.weight_mod || 1.0;
        let wingDragMod = wingTypeData?.drag_mod || 1.0;
        let wingExtraWeight = 0;
        wingFeaturesData.forEach(feature => {
            wingDragMod *= (feature.drag_mod || 1.0);
            wingExtraWeight += (feature.weight || 0);
        });

        // --- Calculate Weight ---
        const avionicsWeight = (aircraft.avionics || []).reduce((total, id) => total + (window.AIRCRAFT_COMPONENTS.avionics[id]?.weight || 0), 0);
        const baseEmptyWeight = (airframe.base_weight || 0);
        const emptyWeightNoEngine = (baseEmptyWeight * wingWeightMod) + avionicsWeight + wingExtraWeight;
        const fuelWeight = (airframe.internal_fuel_kg || 0);
        const weaponsWeight = this.getWeaponsWeight(aircraft);
        const estimatedEngineWeight = airframe.tech_era === 'piston' ? 700 : 1000; // Assume a generic engine weight
        const combatWeight = emptyWeightNoEngine + fuelWeight + weaponsWeight + estimatedEngineWeight;

        // --- Aero properties ---
        const wingArea = airframe.wing_area_m2 || 25;
        const aspectRatio = airframe.aspect_ratio || 6.0;
        const oswaldEfficiency = 0.8;
        const avionicsDrag = (aircraft.avionics || []).reduce((total, id) => total + (window.AIRCRAFT_COMPONENTS.avionics[id]?.drag_penalty || 0), 0);
        const baseCd0 = (airframe.cd_0 || airframe.base_drag_index || 0.025);
        const cd0 = (baseCd0 * wingDragMod) + avionicsDrag;

        // Calculate drag at target speed
        const dynamicPressure = 0.5 * airProps.density * targetSpeed_ms * targetSpeed_ms;
        const CL = (combatWeight * this.constants.standard_gravity_ms2) / (dynamicPressure * wingArea);
        const CDi = (CL * CL) / (Math.PI * aspectRatio * oswaldEfficiency);
        const machNumber = targetSpeed_ms / 343; // Speed of sound at sea level
        let waveDrag = 0;
        if (machNumber > 0.75) {
            waveDrag = 0.02 * Math.pow(machNumber - 0.75, 2.5);
        }
        const CD = cd0 + CDi + waveDrag;
        const dragForce = CD * dynamicPressure * wingArea;

        const requiredThrust_N = dragForce;

        // Convert required thrust to HP for prop aircraft and kgf for jets
        const propEfficiency = 0.85;
        const requiredPower_HP = (requiredThrust_N * targetSpeed_ms) / (propEfficiency * 745.7);
        const requiredThrust_KgF = requiredThrust_N / this.constants.standard_gravity_ms2;

        return {
            requiredHP: Math.round(requiredPower_HP),
            requiredThrustKgf: Math.round(requiredThrust_KgF)
        };
    }

    /**
     * Render detailed performance display HTML
     */
    renderPerformanceDisplay(aircraft = window.currentAircraft) {
        try {
            const performance = this.calculateAircraftPerformance(aircraft);
            
            if (performance?.error) {
                return `<div class="text-slate-300 p-4">${performance.error}</div>`;
            }

            const summary = performance.summary || performance;
            
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                        <span>🛫</span>
                        <span>Performance de Voo</span>
                    </h3>
                    
                    <div class="grid grid-cols-2 gap-3 text-sm">
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Peso Total</span>
                            <span class="text-slate-100 font-semibold">${Math.round(summary.totalWeight).toLocaleString()} kg</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Velocidade Máxima</span>
                            <span class="text-cyan-300 font-semibold">${Math.round(summary.maxSpeed)} km/h</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Velocidade de Cruzeiro</span>
                            <span class="text-slate-100 font-semibold">${Math.round(performance.cruiseSpeed || summary.maxSpeed * 0.75)} km/h</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Velocidade de Stall</span>
                            <span class="text-yellow-300 font-semibold">${Math.round(summary.stallSpeed || 150)} km/h</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Taxa de Subida</span>
                            <span class="text-green-300 font-semibold">${Math.round(performance.rateOfClimb || 0)} m/min</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Teto de Serviço</span>
                            <span class="text-slate-100 font-semibold">${(Math.round(summary.serviceCeiling / 100) / 10).toFixed(1)} km</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Relação Empuxo/Peso</span>
                            <span class="text-blue-300 font-semibold">${(summary.thrustToWeight || 0).toFixed(2)}:1</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                            <span class="text-slate-400">Carga Alar</span>
                            <span class="text-slate-100 font-semibold">${Math.round(summary.wingLoading || 0)} kg/m²</span>
                        </div>
                        
                        <div class="flex justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30 col-span-2">
                            <span class="text-slate-400">Alcance Máximo</span>
                            <span class="text-purple-300 font-semibold">${Math.round(summary.range || 0)} km</span>
                        </div>
                    </div>
                    
                    ${performance.warnings && performance.warnings.length > 0 ? 
                        `<div class="mt-4 p-3 rounded-lg bg-amber-900/20 border border-amber-500/30">
                            <div class="text-amber-300 text-sm font-medium mb-2">⚠️ Avisos:</div>
                            <div class="text-amber-200 text-xs space-y-1">
                                ${performance.warnings.map(w => `• ${w}`).join('<br/>')}
                            </div>
                        </div>` 
                    : ''}
                </div>
            `;
        } catch (error) {
            console.error('Error rendering performance display:', error);
            return '<div class="text-red-400 p-4">Erro ao renderizar a performance. Verifique o console.</div>';
        }
    }
}

// Create global instance and expose functions
window.realisticPerformanceCalculator = new RealisticPerformanceCalculator();

// Override the existing functions
window.calculateAircraftPerformance = function(aircraft) {
    return window.realisticPerformanceCalculator.calculateAircraftPerformance(aircraft);
};

// Make the performance system available globally
window.AircraftPerformanceSystem = {
    renderPerformanceDisplay: function(aircraft) {
        return window.realisticPerformanceCalculator.renderPerformanceDisplay(aircraft);
    }
};

console.log('✅ Realistic Performance Calculator for 1954 Aircraft loaded and refactored.');
