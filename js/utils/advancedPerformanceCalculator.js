// js/utils/advancedPerformanceCalculator.js - Sistema Avançado de Cálculo de Performance para 1954
// Baseado no sistema do War-1918-aeronautica

class AdvancedPerformanceCalculator {
    constructor() {
        // Constantes físicas (ISA Standard Atmosphere)
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
     * Calcula as propriedades do ar em uma altitude usando o modelo ISA
     */
    getAirPropertiesAtAltitude(altitude_m) {
        const h = Math.max(0, altitude_m);
        const T0 = this.constants.temp_sea_level_k;
        const P0 = this.constants.pressure_sea_level_pa;
        const L = this.constants.temp_lapse_rate_k_per_m;
        const R = this.constants.gas_constant_air_specific;
        const g = this.constants.standard_gravity_ms2;

        const T = Math.max(216.65, T0 - L * h); // Temperatura limitada na tropopausa
        const P = P0 * Math.pow((T / T0), g / (L * R));
        const rho = P / (R * T);

        return { temperature: T, pressure: P, density: rho };
    }

    /**
     * Calcula a potência do motor a pistão em altitude com supercharger
     */
    calculatePistonEnginePowerAtAltitude(basePowerHP, altitude_m, engine, supercharger = null) {
        let ratedAltitude = 0;
        let superchargerEfficiency = 1.0;
        
        if (supercharger && supercharger.rated_altitude_m) {
            ratedAltitude = supercharger.rated_altitude_m;
            superchargerEfficiency = supercharger.reliability_mod || 0.95;
        }
        
        const currentAltProps = this.getAirPropertiesAtAltitude(altitude_m);
        
        let currentPower = 0;
        if (ratedAltitude === 0) {
            // Motor naturalmente aspirado
            const densityRatio = currentAltProps.density / this.constants.density_sea_level_kg_m3;
            currentPower = basePowerHP * densityRatio;
        } else if (altitude_m <= ratedAltitude) {
            // Dentro da altitude nominal do supercharger
            currentPower = basePowerHP * superchargerEfficiency;
        } else {
            // Acima da altitude nominal
            const ratedAltProps = this.getAirPropertiesAtAltitude(ratedAltitude);
            const densityRatio = currentAltProps.density / ratedAltProps.density;
            currentPower = basePowerHP * superchargerEfficiency * densityRatio;
        }
        
        return Math.max(currentPower * 0.1, currentPower); // Mínimo de 10% da potência
    }

    /**
     * Calcula a potência/empuxo necessário para atingir uma velocidade específica
     */
    calculateRequiredPowerForSpeed(aircraftConfig, targetSpeedKmh, altitude_m = 0) {
        const { airframe, wings = {}, avionics = [], weapons = [] } = aircraftConfig;
        
        if (!airframe) {
            return { error: "Configuração de aeronave incompleta" };
        }

        const targetSpeed_ms = targetSpeedKmh / 3.6;
        const airProps = this.getAirPropertiesAtAltitude(altitude_m);

        // 1. Calcular peso da aeronave (sem motor)
        const wingTypeData = wings.type ? window.AIRCRAFT_COMPONENTS.wing_types[wings.type] : null;
        const wingFeaturesData = (wings.features || []).map(id => 
            window.AIRCRAFT_COMPONENTS.wing_features[id]
        ).filter(Boolean);

        let wingWeightMod = wingTypeData?.weight_mod || 1.0;
        let wingDragMod = wingTypeData?.drag_mod || 1.0;
        let wingClMaxMod = wingTypeData?.cl_max_mod || 1.0;
        let wingExtraWeight = 0;

        wingFeaturesData.forEach(feature => {
            wingDragMod *= (feature.drag_mod || 1.0);
            wingClMaxMod *= (feature.cl_max_mod || 1.0);
            wingExtraWeight += (feature.weight || 0);
        });

        const avionicsWeight = avionics.reduce((total, id) => {
            const item = window.AIRCRAFT_COMPONENTS.avionics[id];
            return total + (item?.weight || 0);
        }, 0);

        const weaponsWeight = weapons.reduce((total, id) => {
            const item = window.AIRCRAFT_COMPONENTS.aircraft_weapons[id];
            return total + (item?.weight || 0);
        }, 0);

        const estimatedEngineWeight = this.estimateEngineWeight(airframe, targetSpeedKmh);
        const baseWeight = (airframe.base_weight || 0) * wingWeightMod;
        const combatWeight = baseWeight + avionicsWeight + wingExtraWeight + weaponsWeight + estimatedEngineWeight;

        // 2. Propriedades aerodinâmicas
        const wingArea = airframe.wing_area_m2 || 25;
        const aspectRatio = airframe.aspect_ratio || 6.0;
        const oswaldEfficiency = 0.8;
        const avionicsDrag = avionics.reduce((total, id) => {
            const item = window.AIRCRAFT_COMPONENTS.avionics[id];
            return total + (item?.drag_penalty || 0);
        }, 0);

        const baseCd0 = (airframe.cd_0 || airframe.base_drag_index || 0.025);
        const cd0 = (baseCd0 * wingDragMod) + avionicsDrag;

        // 3. Calcular arrasto na velocidade alvo
        const dynamicPressure = 0.5 * airProps.density * targetSpeed_ms * targetSpeed_ms;
        const CL = (combatWeight * this.constants.standard_gravity_ms2) / (dynamicPressure * wingArea);
        const CDi = (CL * CL) / (Math.PI * aspectRatio * oswaldEfficiency);
        
        // Arrasto de onda (aproximação)
        const machNumber = targetSpeed_ms / Math.sqrt(1.4 * this.constants.gas_constant_air_specific * airProps.temperature);
        let waveDrag = 0;
        if (machNumber > 0.75) {
            waveDrag = 0.02 * Math.pow(machNumber - 0.75, 2.5);
        }

        const CD = cd0 + CDi + waveDrag;
        const dragForce = CD * dynamicPressure * wingArea;

        // 4. Potência/empuxo necessário
        const requiredThrust_N = dragForce;
        const propEfficiency = 0.85;
        const requiredPower_HP = (requiredThrust_N * targetSpeed_ms) / (propEfficiency * 745.7);
        const requiredThrust_KgF = requiredThrust_N / this.constants.standard_gravity_ms2;

        return {
            requiredHP: Math.round(requiredPower_HP),
            requiredThrustKgf: Math.round(requiredThrust_KgF),
            combatWeight: Math.round(combatWeight),
            dragForce: Math.round(dragForce),
            cl: CL.toFixed(3),
            cd: CD.toFixed(4),
            machNumber: machNumber.toFixed(3),
            details: {
                baseCd0: baseCd0.toFixed(4),
                inducedDrag: CDi.toFixed(4),
                waveDrag: waveDrag.toFixed(4),
                wingDragMod: wingDragMod.toFixed(2),
                avionicsDragPenalty: avionicsDrag.toFixed(4)
            }
        };
    }

    /**
     * Estima o peso do motor baseado no tipo de aeronave e velocidade alvo
     */
    estimateEngineWeight(airframe, targetSpeedKmh) {
        const isPiston = targetSpeedKmh < 600; // Aproximação: motores a pistão para vel < 600 km/h
        
        if (isPiston) {
            // Motores a pistão: peso baseado na potência necessária estimada
            const estimatedPowerHP = Math.max(300, targetSpeedKmh * 2);
            return Math.min(800, 200 + estimatedPowerHP * 0.8); // kg
        } else {
            // Motores a jato: peso baseado no empuxo necessário estimado
            const estimatedThrustKgf = Math.max(500, targetSpeedKmh * 1.5);
            return Math.min(1500, 300 + estimatedThrustKgf * 0.6); // kg
        }
    }

    /**
     * Filtra motores compatíveis baseado nos requisitos de potência/empuxo
     */
    getCompatibleEngines(requiredPowerHP, requiredThrustKgf, airframe, margin = 1.2) {
        const engines = window.AIRCRAFT_COMPONENTS?.aircraft_engines || {};
        const allowedTypes = new Set(airframe?.compatible_engine_types || []);
        const compatible = [];

        for (const [id, engine] of Object.entries(engines)) {
            // Verificar compatibilidade de tipo
            if (allowedTypes.size > 0 && !allowedTypes.has(engine.type)) {
                continue;
            }

            let meetsRequirement = false;
            let powerRating = "N/A";
            let efficiency = "standard";

            if (engine.power_hp) {
                // Motor a pistão
                const availablePower = engine.power_hp;
                meetsRequirement = availablePower >= (requiredPowerHP / margin);
                powerRating = `${availablePower} HP`;
                efficiency = availablePower > (requiredPowerHP * 1.5) ? "overpowered" : 
                           availablePower < (requiredPowerHP * 1.1) ? "minimal" : "optimal";
            } else if (engine.military_thrust || engine.thrust) {
                // Motor a jato
                const availableThrust = engine.military_thrust || engine.thrust;
                meetsRequirement = availableThrust >= (requiredThrustKgf / margin);
                powerRating = `${availableThrust} kgf`;
                efficiency = availableThrust > (requiredThrustKgf * 1.5) ? "overpowered" : 
                           availableThrust < (requiredThrustKgf * 1.1) ? "minimal" : "optimal";
            }

            if (meetsRequirement) {
                compatible.push({
                    id,
                    engine,
                    powerRating,
                    efficiency,
                    weightPenalty: engine.weight || 0,
                    costMultiplier: engine.cost_multiplier || 1.0,
                    reliability: engine.reliability || 0.85
                });
            }
        }

        // Ordenar por eficiência e peso
        compatible.sort((a, b) => {
            const efficiencyOrder = { optimal: 0, minimal: 1, overpowered: 2 };
            const effDiff = efficiencyOrder[a.efficiency] - efficiencyOrder[b.efficiency];
            if (effDiff !== 0) return effDiff;
            return a.weightPenalty - b.weightPenalty;
        });

        return compatible;
    }

    /**
     * Calcula a performance completa da aeronave
     */
    calculateCompletePerformance(aircraftConfig) {
        const { airframe, engine, engineCount = 1, wings = {}, supercharger, avionics = [], weapons = [], fuel = 1.0, altitude = 0 } = aircraftConfig;
        
        if (!airframe || !engine) {
            return { error: 'Selecione uma fuselagem e um motor para calcular a performance.' };
        }

        try {
            // 1. Calcular peso total
            const mass = this.calculateMass(aircraftConfig);
            
            // 2. Calcular potência/empuxo disponível
            const power = this.calculatePower(aircraftConfig, altitude);
            
            // 3. Calcular aerodinâmica
            const aero = this.calculateAerodynamics(aircraftConfig);
            
            // 4. Calcular performance de voo
            const performance = this.calculateFlightPerformance(mass, power, aero, altitude);
            
            // 5. Calcular performance operacional
            const operationalPerformance = this.calculateOperationalPerformance(aircraftConfig, performance);
            
            // 6. Gerar resumo
            const summary = this.generatePerformanceSummary(performance, operationalPerformance);

            return {
                mass,
                power,
                aero,
                performance,
                operationalPerformance,
                summary,
                warnings: this.generateWarnings(aircraftConfig, performance)
            };
        } catch (error) {
            console.error('Erro no cálculo de performance:', error);
            return { error: error.message };
        }
    }

    calculateMass(config) {
        const { airframe, engine, engineCount = 1, wings = {}, supercharger, avionics = [], weapons = [], fuel = 1.0 } = config;
        
        // Peso básico da fuselagem
        let emptyWeight = airframe.base_weight || 0;
        
        // Modificador de peso das asas
        const wingTypeData = wings.type ? window.AIRCRAFT_COMPONENTS.wing_types[wings.type] : null;
        const wingWeightMod = wingTypeData?.weight_mod || 1.0;
        emptyWeight *= wingWeightMod;
        
        // Peso das características das asas
        const wingFeaturesWeight = (wings.features || []).reduce((total, featureId) => {
            const feature = window.AIRCRAFT_COMPONENTS.wing_features[featureId];
            return total + (feature?.weight || 0);
        }, 0);
        
        // Peso dos motores
        const engineWeight = (engine.weight || 0) * engineCount;
        
        // Peso do supercharger
        const superchargerWeight = supercharger ? (supercharger.weight || 0) * engineCount : 0;
        
        // Peso dos aviônicos
        const avionicsWeight = avionics.reduce((total, id) => {
            const item = window.AIRCRAFT_COMPONENTS.avionics[id];
            return total + (item?.weight || 0);
        }, 0);
        
        // Peso dos armamentos
        const weaponsWeight = weapons.reduce((total, id) => {
            const item = window.AIRCRAFT_COMPONENTS.aircraft_weapons[id];
            return total + (item?.weight || 0);
        }, 0);
        
        // Peso do combustível
        const fuelCapacity = airframe.internal_fuel_kg || 1000;
        const fuelWeight = fuelCapacity * fuel;
        
        const totalEmptyWeight = emptyWeight + wingFeaturesWeight + engineWeight + superchargerWeight + avionicsWeight;
        const totalWeight = totalEmptyWeight + weaponsWeight + fuelWeight;
        
        return {
            empty: Math.round(totalEmptyWeight),
            fuel: Math.round(fuelWeight),
            weapons: Math.round(weaponsWeight),
            total: Math.round(totalWeight),
            engineWeight: Math.round(engineWeight),
            breakdown: {
                airframe: Math.round(emptyWeight),
                wingFeatures: Math.round(wingFeaturesWeight),
                engines: Math.round(engineWeight),
                supercharger: Math.round(superchargerWeight),
                avionics: Math.round(avionicsWeight)
            }
        };
    }

    calculatePower(config, altitude = 0) {
        const { engine, engineCount = 1, supercharger } = config;
        
        const isPistonEngine = engine.type && (engine.type.includes('piston') || engine.power_hp);
        
        if (isPistonEngine) {
            const basePowerHP = (engine.power_hp || 0) * engineCount;
            const powerAtAltitude = this.calculatePistonEnginePowerAtAltitude(basePowerHP, altitude, engine, supercharger);
            
            return {
                type: 'piston',
                seaLevelHP: basePowerHP,
                currentHP: Math.round(powerAtAltitude),
                powerWatts: powerAtAltitude * 745.7,
                thrustNewtons: 0,
                supercharger: supercharger?.name || 'Nenhum'
            };
        } else {
            const baseThrustKgf = (engine.military_thrust || engine.thrust || 0) * engineCount;
            const airProps = this.getAirPropertiesAtAltitude(altitude);
            const densityRatio = airProps.density / this.constants.density_sea_level_kg_m3;
            const thrustAtAltitude = baseThrustKgf * Math.pow(densityRatio, 0.7);
            
            return {
                type: 'jet',
                seaLevelThrust: baseThrustKgf,
                currentThrust: Math.round(thrustAtAltitude),
                powerWatts: 0,
                thrustNewtons: thrustAtAltitude * this.constants.standard_gravity_ms2,
                hasAfterburner: engine.afterburner_thrust > 0,
                afterburnerThrust: engine.afterburner_thrust ? engine.afterburner_thrust * engineCount : 0
            };
        }
    }

    calculateAerodynamics(config) {
        const { airframe, wings = {}, avionics = [] } = config;
        
        // Área da asa e propriedades básicas
        const wingArea = airframe.wing_area_m2 || 25;
        const aspectRatio = airframe.aspect_ratio || 6.0;
        
        // Modificadores das asas
        const wingTypeData = wings.type ? window.AIRCRAFT_COMPONENTS.wing_types[wings.type] : null;
        let wingDragMod = wingTypeData?.drag_mod || 1.0;
        let wingClMaxMod = wingTypeData?.cl_max_mod || 1.0;
        
        (wings.features || []).forEach(featureId => {
            const feature = window.AIRCRAFT_COMPONENTS.wing_features[featureId];
            if (feature) {
                wingDragMod *= (feature.drag_mod || 1.0);
                wingClMaxMod *= (feature.cl_max_mod || 1.0);
            }
        });
        
        // Arrasto dos aviônicos
        const avionicsDrag = avionics.reduce((total, id) => {
            const item = window.AIRCRAFT_COMPONENTS.avionics[id];
            return total + (item?.drag_penalty || 0);
        }, 0);
        
        // Coeficientes finais
        const baseCd0 = airframe.cd_0 || airframe.base_drag_index || 0.025;
        const cd0 = (baseCd0 * wingDragMod) + avionicsDrag;
        const baseClMax = airframe.cl_max || 1.5;
        const clMax = baseClMax * wingClMaxMod;
        
        return {
            wingArea,
            aspectRatio,
            cd0,
            clMax,
            oswaldEfficiency: 0.8,
            wingDragMod,
            wingClMaxMod,
            avionicsDragPenalty: avionicsDrag
        };
    }

    calculateFlightPerformance(mass, power, aero, altitude = 0) {
        const airProps = this.getAirPropertiesAtAltitude(altitude);
        
        // Encontrar velocidade de equilíbrio (empuxo = arrasto)
        const maxSpeedResult = this.findEquilibriumSpeed(mass.total, power, aero, airProps);
        
        // Velocidade de stall
        const stallSpeed = Math.sqrt((2 * mass.total * this.constants.standard_gravity_ms2) / 
                                   (airProps.density * aero.wingArea * aero.clMax)) * 3.6;
        
        // Taxa de subida
        const rateOfClimb = this.calculateRateOfClimb(maxSpeedResult.velocity_ms, mass.total, power, aero, airProps);
        
        // Relação empuxo/peso
        const thrustToWeight = this.calculateThrustToWeight(maxSpeedResult.velocity_ms, power, mass.total);
        
        return {
            maxSpeedKph: Math.round(maxSpeedResult.velocity_ms * 3.6),
            stallSpeedKph: Math.round(stallSpeed),
            rateOfClimbMpm: Math.round(rateOfClimb * 60), // m/min
            thrustToWeight: Number(thrustToWeight.toFixed(3)),
            wingLoading: Math.round(mass.total / aero.wingArea),
            equilibriumDetails: maxSpeedResult.details
        };
    }

    findEquilibriumSpeed(weight, power, aero, airProps) {
        let bestVelocity = 0;
        let minDifference = Infinity;
        const maxSearchVelocity = power.type === 'jet' ? 450 : 280; // m/s
        let bestDetails = {};

        for (let v = 40; v <= maxSearchVelocity; v += 2) {
            const dynamicPressure = 0.5 * airProps.density * v * v;
            const CL = (weight * this.constants.standard_gravity_ms2) / (dynamicPressure * aero.wingArea);
            const CDi = (CL * CL) / (Math.PI * aero.aspectRatio * aero.oswaldEfficiency);
            
            // Arrasto de onda
            const machNumber = v / Math.sqrt(1.4 * this.constants.gas_constant_air_specific * airProps.temperature);
            let waveDrag = 0;
            if (machNumber > 0.75) {
                waveDrag = 0.02 * Math.pow(machNumber - 0.75, 2.5);
            }

            const CD = aero.cd0 + CDi + waveDrag;
            const dragForce = CD * dynamicPressure * aero.wingArea;

            // Calcular empuxo disponível
            let thrustForce = 0;
            if (power.type === 'piston') {
                const propEfficiency = 0.85;
                thrustForce = (power.powerWatts * propEfficiency) / Math.max(v, 1);
            } else {
                thrustForce = power.thrustNewtons;
            }

            const difference = Math.abs(thrustForce - dragForce);
            if (difference < minDifference) {
                minDifference = difference;
                bestVelocity = v;
                bestDetails = {
                    CL: CL.toFixed(3),
                    CD: CD.toFixed(4),
                    CDi: CDi.toFixed(4),
                    waveDrag: waveDrag.toFixed(4),
                    machNumber: machNumber.toFixed(3),
                    dragForce: Math.round(dragForce),
                    thrustForce: Math.round(thrustForce)
                };
            }
        }

        return {
            velocity_ms: bestVelocity,
            details: bestDetails
        };
    }

    calculateRateOfClimb(velocity_ms, weight, power, aero, airProps) {
        const dynamicPressure = 0.5 * airProps.density * velocity_ms * velocity_ms;
        const CL = (weight * this.constants.standard_gravity_ms2) / (dynamicPressure * aero.wingArea);
        const CDi = (CL * CL) / (Math.PI * aero.aspectRatio * aero.oswaldEfficiency);
        const CD = aero.cd0 + CDi;
        const dragForce = CD * dynamicPressure * aero.wingArea;

        let thrustForce = 0;
        if (power.type === 'piston') {
            const propEfficiency = 0.80; // Ligeiramente menor na subida
            thrustForce = (power.powerWatts * propEfficiency) / Math.max(velocity_ms, 1);
        } else {
            thrustForce = power.thrustNewtons;
        }

        const excessPower = (thrustForce - dragForce) * velocity_ms;
        const rateOfClimb = excessPower / (weight * this.constants.standard_gravity_ms2);
        return Math.max(0, rateOfClimb);
    }

    calculateThrustToWeight(velocity_ms, power, weight) {
        let actualThrust = 0;
        if (power.type === 'piston') {
            const propEfficiency = 0.85;
            actualThrust = (power.powerWatts * propEfficiency) / Math.max(velocity_ms, 1);
        } else {
            actualThrust = power.thrustNewtons;
        }
        const weightNewtons = weight * this.constants.standard_gravity_ms2;
        return actualThrust / weightNewtons;
    }

    calculateOperationalPerformance(config, flightPerformance) {
        const { engine, engineCount = 1, airframe } = config;
        
        // Consumo de combustível
        const fuelFlowRate = this.calculateFuelConsumption(engine, engineCount, flightPerformance.maxSpeedKph);
        
        // Alcance
        const range = this.calculateRange(config, flightPerformance, fuelFlowRate);
        
        // Teto de serviço
        const serviceCeiling = this.calculateServiceCeiling(config);
        
        // Confiabilidade geral
        const reliability = this.calculateSystemReliability(config);
        
        return {
            fuelFlowRate: Number(fuelFlowRate.toFixed(2)),
            range: Math.round(range),
            serviceCeiling: Math.round(serviceCeiling),
            reliability: Number((reliability * 100).toFixed(1))
        };
    }

    calculateFuelConsumption(engine, engineCount, speedKph) {
        const isPiston = engine.type && (engine.type.includes('piston') || engine.power_hp);
        
        if (isPiston) {
            // Para motores a pistão, usar BSFC (brake specific fuel consumption)
            const powerHP = (engine.power_hp || 0) * engineCount;
            const cruisePower = powerHP * 0.75; // 75% de potência em cruzeiro
            const bsfc = 0.45; // kg/kWh (típico para motores a pistão da época)
            return cruisePower * 0.7457 * bsfc; // kg/h
        } else {
            // Para motores a jato, usar consumo específico
            const baseConsumption = (engine.fuel_consumption || 1.0) * engineCount;
            return baseConsumption * 3600; // kg/h
        }
    }

    calculateRange(config, flightPerformance, fuelFlowRate) {
        const { airframe } = config;
        const fuelCapacity = airframe.internal_fuel_kg || 1000;
        const cruiseSpeed = flightPerformance.maxSpeedKph * 0.75; // 75% da velocidade máxima
        
        if (fuelFlowRate <= 0) return 0;
        
        const flightTime = fuelCapacity / fuelFlowRate; // horas
        return flightTime * cruiseSpeed; // km
    }

    calculateServiceCeiling(config) {
        // Simplificado: calcular até onde a taxa de subida é > 0.5 m/s
        for (let altitude = 1000; altitude <= 15000; altitude += 500) {
            const mass = this.calculateMass(config);
            const power = this.calculatePower(config, altitude);
            const aero = this.calculateAerodynamics(config);
            const airProps = this.getAirPropertiesAtAltitude(altitude);
            
            const speedResult = this.findEquilibriumSpeed(mass.total, power, aero, airProps);
            const rateOfClimb = this.calculateRateOfClimb(speedResult.velocity_ms, mass.total, power, aero, airProps);
            
            if (rateOfClimb < this.constants.min_roc_for_ceiling) {
                return altitude;
            }
        }
        return 15000; // Limite máximo
    }

    calculateSystemReliability(config) {
        const { engine, engineCount = 1, supercharger, avionics = [], wings = {} } = config;
        
        let reliability = engine.reliability || 0.85;
        
        // Penalidade por múltiplos motores
        if (engineCount > 1) {
            reliability *= Math.pow(0.96, engineCount - 1);
        }
        
        // Penalidade do supercharger
        if (supercharger && supercharger.reliability_mod) {
            reliability *= supercharger.reliability_mod;
        }
        
        // Penalidade dos aviônicos
        const avionicsReliabilityPenalty = avionics.length * 0.02;
        reliability *= (1 - avionicsReliabilityPenalty);
        
        // Penalidade das características das asas
        const wingFeaturesCount = (wings.features || []).length;
        reliability *= Math.pow(0.98, wingFeaturesCount);
        
        return Math.max(0.3, Math.min(1.0, reliability));
    }

    generatePerformanceSummary(flightPerformance, operationalPerformance) {
        return {
            maxSpeed: flightPerformance.maxSpeedKph,
            cruiseSpeed: Math.round(flightPerformance.maxSpeedKph * 0.75),
            stallSpeed: flightPerformance.stallSpeedKph,
            rateOfClimb: flightPerformance.rateOfClimbMpm,
            thrustToWeight: flightPerformance.thrustToWeight,
            wingLoading: flightPerformance.wingLoading,
            maxRange: operationalPerformance.range,
            serviceCeiling: operationalPerformance.serviceCeiling,
            fuelConsumption: operationalPerformance.fuelFlowRate,
            reliability: operationalPerformance.reliability
        };
    }

    generateWarnings(config, performance) {
        const warnings = [];
        const { airframe } = config;
        
        if (performance.maxSpeedKph > (airframe.max_speed_kph || 900)) {
            warnings.push(`Velocidade máxima excede o limite estrutural da fuselagem (${airframe.max_speed_kph} km/h)`);
        }
        
        if (performance.stallSpeedKph > 180) {
            warnings.push(`Velocidade de stall muito alta (${performance.stallSpeedKph} km/h) - perigoso para pouso`);
        }
        
        if (performance.wingLoading > 300) {
            warnings.push(`Carga alar muito alta (${performance.wingLoading} kg/m²) - baixa manobrabilidade`);
        }
        
        if (performance.thrustToWeight < 0.3) {
            warnings.push(`Relação empuxo/peso muito baixa (${performance.thrustToWeight}) - performance limitada`);
        }
        
        return warnings;
    }

    /**
     * Renderiza uma interface de cálculo de potência necessária para velocidade
     */
    renderPowerCalculationInterface() {
        return `
            <div class="power-calculation-interface bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-6">
                <h3 class="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
                    <span>🧮</span>
                    <span>Calculadora de Potência Necessária</span>
                </h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label for="target-speed" class="block text-sm font-medium text-slate-300 mb-2">Velocidade Desejada (km/h)</label>
                        <input type="number" id="target-speed" min="100" max="1000" step="10" value="400" 
                               class="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    </div>
                    
                    <div>
                        <label for="target-altitude" class="block text-sm font-medium text-slate-300 mb-2">Altitude (m)</label>
                        <input type="number" id="target-altitude" min="0" max="10000" step="500" value="0" 
                               class="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    </div>
                    
                    <div class="flex items-end">
                        <button id="calculate-power-btn" 
                                class="w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">
                            Calcular
                        </button>
                    </div>
                </div>
                
                <div id="power-calculation-result" class="hidden bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                    <!-- Resultado será inserido aqui -->
                </div>
            </div>
        `;
    }
}

// Criar instância global
window.advancedPerformanceCalculator = new AdvancedPerformanceCalculator();

// Função para calcular potência necessária para velocidade
window.handleCalculateRequiredPower = function() {
    const targetSpeed = parseInt(document.getElementById('target-speed')?.value) || 400;
    const targetAltitude = parseInt(document.getElementById('target-altitude')?.value) || 0;
    const resultDiv = document.getElementById('power-calculation-result');
    
    if (!window.currentAircraft?.airframe) {
        if (resultDiv) {
            resultDiv.className = 'bg-red-900/20 border border-red-700/50 rounded-lg p-4';
            resultDiv.innerHTML = '<p class="text-red-300">❌ Selecione uma fuselagem primeiro</p>';
            resultDiv.classList.remove('hidden');
        }
        return;
    }
    
    const result = window.advancedPerformanceCalculator.calculateRequiredPowerForSpeed(
        window.currentAircraft, 
        targetSpeed, 
        targetAltitude
    );
    
    if (result.error) {
        if (resultDiv) {
            resultDiv.className = 'bg-red-900/20 border border-red-700/50 rounded-lg p-4';
            resultDiv.innerHTML = `<p class="text-red-300">❌ ${result.error}</p>`;
            resultDiv.classList.remove('hidden');
        }
        return;
    }
    
    const compatibleEngines = window.advancedPerformanceCalculator.getCompatibleEngines(
        result.requiredHP, 
        result.requiredThrustKgf, 
        window.AIRCRAFT_COMPONENTS.airframes[window.currentAircraft.airframe]
    );
    
    if (resultDiv) {
        resultDiv.className = 'bg-slate-700/30 border border-slate-600/50 rounded-lg p-4';
        resultDiv.innerHTML = `
            <div class="mb-4">
                <h4 class="text-lg font-semibold text-cyan-300 mb-2">Requisitos de Potência para ${targetSpeed} km/h</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div class="text-center p-2 bg-slate-800/40 rounded">
                        <div class="text-orange-300 font-semibold">${result.requiredHP} HP</div>
                        <div class="text-xs text-slate-400">Potência (Pistão)</div>
                    </div>
                    <div class="text-center p-2 bg-slate-800/40 rounded">
                        <div class="text-blue-300 font-semibold">${result.requiredThrustKgf} kgf</div>
                        <div class="text-xs text-slate-400">Empuxo (Jato)</div>
                    </div>
                    <div class="text-center p-2 bg-slate-800/40 rounded">
                        <div class="text-green-300 font-semibold">${result.combatWeight} kg</div>
                        <div class="text-xs text-slate-400">Peso Total</div>
                    </div>
                    <div class="text-center p-2 bg-slate-800/40 rounded">
                        <div class="text-purple-300 font-semibold">Mach ${result.machNumber}</div>
                        <div class="text-xs text-slate-400">Número de Mach</div>
                    </div>
                </div>
            </div>
            
            <div class="mb-4">
                <h5 class="font-semibold text-slate-200 mb-2">Motores Compatíveis (${compatibleEngines.length} encontrados):</h5>
                ${compatibleEngines.length > 0 ? `
                    <div class="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                        ${compatibleEngines.slice(0, 6).map(e => `
                            <div class="flex justify-between items-center p-2 bg-slate-800/40 rounded text-sm">
                                <span class="text-slate-200">${e.engine.name}</span>
                                <div class="flex items-center space-x-2">
                                    <span class="text-cyan-300">${e.powerRating}</span>
                                    <span class="px-2 py-1 rounded text-xs ${
                                        e.efficiency === 'optimal' ? 'bg-green-500/20 text-green-300' :
                                        e.efficiency === 'minimal' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-red-500/20 text-red-300'
                                    }">${e.efficiency}</span>
                                    <button onclick="selectAircraftEngine('${e.id}')" 
                                            class="px-2 py-1 bg-cyan-600 text-white rounded text-xs hover:bg-cyan-700">
                                        Selecionar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                        ${compatibleEngines.length > 6 ? `<p class="text-xs text-slate-400 text-center">... e mais ${compatibleEngines.length - 6} motores</p>` : ''}
                    </div>
                ` : '<p class="text-slate-400 text-sm">Nenhum motor disponível atende aos requisitos.</p>'}
            </div>
            
            <details class="text-xs text-slate-400">
                <summary class="cursor-pointer hover:text-slate-300">Detalhes técnicos</summary>
                <div class="mt-2 grid grid-cols-2 gap-2">
                    <div>CD₀ base: ${result.details.baseCd0}</div>
                    <div>Arrasto induzido: ${result.details.inducedDrag}</div>
                    <div>Arrasto de onda: ${result.details.waveDrag}</div>
                    <div>Mod. arrasto asas: ${result.details.wingDragMod}</div>
                </div>
            </details>
        `;
        resultDiv.classList.remove('hidden');
    }
};

console.log('✅ Advanced Performance Calculator for 1954 Aircraft loaded.');