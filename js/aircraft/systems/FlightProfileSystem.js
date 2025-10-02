/**
 * Flight Profile System - War1954 Aircraft Creator
 *
 * Comprehensive flight profile management system that defines mission profiles,
 * performance envelopes, and operational parameters for different aircraft roles.
 * Implements realistic flight planning and performance analysis.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { dynamicPropulsionSystem } from './DynamicPropulsionSystem.js';

export class FlightProfileSystem {
    constructor() {
        this.initialized = false;
        this.currentAircraft = null;
        this.activeProfile = null;

        // Mission profile templates
        this.missionProfiles = {
            // Fighter missions
            interceptor: {
                name: 'Interceptação',
                category: 'fighter',
                description: 'Missão de interceptação de bombardeiros inimigos',
                phases: [
                    { name: 'takeoff', duration: 120, altitude: { start: 0, end: 1000 }, speed: { start: 0, end: 300 } },
                    { name: 'climb', duration: 480, altitude: { start: 1000, end: 10000 }, speed: { start: 300, end: 600 } },
                    { name: 'cruise', duration: 1200, altitude: { start: 10000, end: 10000 }, speed: { start: 600, end: 750 } },
                    { name: 'combat', duration: 600, altitude: { start: 8000, end: 12000 }, speed: { start: 600, end: 900 } },
                    { name: 'cruise', duration: 900, altitude: { start: 10000, end: 10000 }, speed: { start: 600, end: 600 } },
                    { name: 'descent', duration: 600, altitude: { start: 10000, end: 1000 }, speed: { start: 600, end: 300 } },
                    { name: 'approach', duration: 180, altitude: { start: 1000, end: 100 }, speed: { start: 300, end: 200 } },
                    { name: 'landing', duration: 60, altitude: { start: 100, end: 0 }, speed: { start: 200, end: 0 } }
                ],
                fuelReserve: 0.15, // 15% reserve
                payload: 500, // kg (missiles)
                priority: 'speed'
            },
            cas: {
                name: 'Apoio Aéreo Próximo',
                category: 'attack',
                description: 'Missão de apoio às tropas terrestres',
                phases: [
                    { name: 'takeoff', duration: 120, altitude: { start: 0, end: 500 }, speed: { start: 0, end: 250 } },
                    { name: 'climb', duration: 600, altitude: { start: 500, end: 3000 }, speed: { start: 250, end: 400 } },
                    { name: 'cruise', duration: 1800, altitude: { start: 3000, end: 3000 }, speed: { start: 400, end: 400 } },
                    { name: 'combat', duration: 1200, altitude: { start: 1000, end: 5000 }, speed: { start: 300, end: 500 } },
                    { name: 'cruise', duration: 1200, altitude: { start: 3000, end: 3000 }, speed: { start: 400, end: 400 } },
                    { name: 'descent', duration: 420, altitude: { start: 3000, end: 500 }, speed: { start: 400, end: 250 } },
                    { name: 'approach', duration: 240, altitude: { start: 500, end: 100 }, speed: { start: 250, end: 180 } },
                    { name: 'landing', duration: 90, altitude: { start: 100, end: 0 }, speed: { start: 180, end: 0 } }
                ],
                fuelReserve: 0.20, // 20% reserve for longer loiter
                payload: 2000, // kg (bombs/rockets)
                priority: 'endurance'
            },
            escort: {
                name: 'Escolta de Bombardeiros',
                category: 'fighter',
                description: 'Proteção de formação de bombardeiros',
                phases: [
                    { name: 'takeoff', duration: 120, altitude: { start: 0, end: 1000 }, speed: { start: 0, end: 300 } },
                    { name: 'climb', duration: 900, altitude: { start: 1000, end: 8000 }, speed: { start: 300, end: 500 } },
                    { name: 'cruise', duration: 3600, altitude: { start: 8000, end: 8000 }, speed: { start: 500, end: 500 } },
                    { name: 'combat', duration: 900, altitude: { start: 6000, end: 10000 }, speed: { start: 450, end: 650 } },
                    { name: 'cruise', duration: 2700, altitude: { start: 8000, end: 8000 }, speed: { start: 500, end: 500 } },
                    { name: 'descent', duration: 720, altitude: { start: 8000, end: 1000 }, speed: { start: 500, end: 300 } },
                    { name: 'approach', duration: 180, altitude: { start: 1000, end: 100 }, speed: { start: 300, end: 200 } },
                    { name: 'landing', duration: 60, altitude: { start: 100, end: 0 }, speed: { start: 200, end: 0 } }
                ],
                fuelReserve: 0.10, // 10% reserve
                payload: 800, // kg (fuel tanks + light armament)
                priority: 'range'
            },

            // Bomber missions
            strategic_bombing: {
                name: 'Bombardeio Estratégico',
                category: 'bomber',
                description: 'Ataque a alvos estratégicos profundos',
                phases: [
                    { name: 'takeoff', duration: 180, altitude: { start: 0, end: 1000 }, speed: { start: 0, end: 250 } },
                    { name: 'climb', duration: 1800, altitude: { start: 1000, end: 12000 }, speed: { start: 250, end: 450 } },
                    { name: 'cruise', duration: 10800, altitude: { start: 12000, end: 12000 }, speed: { start: 450, end: 450 } },
                    { name: 'combat', duration: 600, altitude: { start: 10000, end: 12000 }, speed: { start: 400, end: 450 } },
                    { name: 'cruise', duration: 9000, altitude: { start: 12000, end: 12000 }, speed: { start: 450, end: 450 } },
                    { name: 'descent', duration: 1200, altitude: { start: 12000, end: 1000 }, speed: { start: 450, end: 250 } },
                    { name: 'approach', duration: 300, altitude: { start: 1000, end: 100 }, speed: { start: 250, end: 180 } },
                    { name: 'landing', duration: 120, altitude: { start: 100, end: 0 }, speed: { start: 180, end: 0 } }
                ],
                fuelReserve: 0.15, // 15% reserve
                payload: 5000, // kg (heavy bomb load)
                priority: 'range'
            },

            // Transport missions
            cargo_transport: {
                name: 'Transporte de Carga',
                category: 'transport',
                description: 'Transporte de equipamentos e suprimentos',
                phases: [
                    { name: 'takeoff', duration: 150, altitude: { start: 0, end: 800 }, speed: { start: 0, end: 200 } },
                    { name: 'climb', duration: 1200, altitude: { start: 800, end: 6000 }, speed: { start: 200, end: 350 } },
                    { name: 'cruise', duration: 7200, altitude: { start: 6000, end: 6000 }, speed: { start: 350, end: 350 } },
                    { name: 'descent', duration: 900, altitude: { start: 6000, end: 800 }, speed: { start: 350, end: 200 } },
                    { name: 'approach', duration: 240, altitude: { start: 800, end: 100 }, speed: { start: 200, end: 150 } },
                    { name: 'landing', duration: 120, altitude: { start: 100, end: 0 }, speed: { start: 150, end: 0 } }
                ],
                fuelReserve: 0.20, // 20% reserve
                payload: 8000, // kg (cargo)
                priority: 'efficiency'
            },

            // Reconnaissance missions
            photo_recon: {
                name: 'Reconhecimento Fotográfico',
                category: 'reconnaissance',
                description: 'Missão de reconhecimento e coleta de inteligência',
                phases: [
                    { name: 'takeoff', duration: 120, altitude: { start: 0, end: 1000 }, speed: { start: 0, end: 300 } },
                    { name: 'climb', duration: 1200, altitude: { start: 1000, end: 15000 }, speed: { start: 300, end: 600 } },
                    { name: 'cruise', duration: 1800, altitude: { start: 15000, end: 15000 }, speed: { start: 600, end: 700 } },
                    { name: 'recon', duration: 900, altitude: { start: 12000, end: 18000 }, speed: { start: 500, end: 800 } },
                    { name: 'cruise', duration: 1200, altitude: { start: 15000, end: 15000 }, speed: { start: 700, end: 700 } },
                    { name: 'descent', duration: 900, altitude: { start: 15000, end: 1000 }, speed: { start: 700, end: 300 } },
                    { name: 'approach', duration: 180, altitude: { start: 1000, end: 100 }, speed: { start: 300, end: 220 } },
                    { name: 'landing', duration: 60, altitude: { start: 100, end: 0 }, speed: { start: 220, end: 0 } }
                ],
                fuelReserve: 0.10, // 10% reserve
                payload: 300, // kg (cameras, sensors)
                priority: 'speed'
            }
        };

        // Performance envelope parameters
        this.performanceEnvelopes = {
            // Altitude-speed envelopes
            operational: {
                name: 'Envelope Operacional',
                description: 'Limites normais de operação',
                altitudeLimit: 15000, // m
                speedLimit: 900, // km/h
                gLimitPositive: 6,
                gLimitNegative: -3,
                loadFactor: 1.0
            },
            combat: {
                name: 'Envelope de Combate',
                description: 'Limites durante combate',
                altitudeLimit: 12000, // m
                speedLimit: 950, // km/h
                gLimitPositive: 8,
                gLimitNegative: -4,
                loadFactor: 1.2
            },
            emergency: {
                name: 'Envelope de Emergência',
                description: 'Limites absolutos da aeronave',
                altitudeLimit: 18000, // m
                speedLimit: 1000, // km/h
                gLimitPositive: 10,
                gLimitNegative: -5,
                loadFactor: 1.5
            }
        };

        // Environmental conditions
        this.environmentalConditions = {
            standard: {
                name: 'Condições Padrão',
                temperature: 15, // °C
                pressure: 1013.25, // hPa
                humidity: 0.5,
                windSpeed: 0, // m/s
                visibility: 10000 // m
            },
            hot_high: {
                name: 'Quente e Alta Altitude',
                temperature: 35, // °C
                pressure: 850, // hPa
                humidity: 0.8,
                windSpeed: 5, // m/s
                visibility: 8000 // m
            },
            cold_low: {
                name: 'Frio e Baixa Altitude',
                temperature: -20, // °C
                pressure: 1030, // hPa
                humidity: 0.3,
                windSpeed: 10, // m/s
                visibility: 15000 // m
            },
            adverse: {
                name: 'Condições Adversas',
                temperature: 0, // °C
                pressure: 950, // hPa
                humidity: 0.9,
                windSpeed: 15, // m/s
                visibility: 2000 // m
            }
        };

        console.log('✈️ FlightProfileSystem initialized');
    }

    /**
     * Calculates complete mission performance
     */
    calculateMissionPerformance(aircraft, missionType, conditions = {}) {
        const mission = this.missionProfiles[missionType];
        if (!mission) {
            throw new Error(`Mission type '${missionType}' not found`);
        }

        const {
            environmentalCondition = 'standard',
            countryTechLevel = 50,
            pilotSkill = 'average',
            loadout = 'standard'
        } = conditions;

        // Get environmental conditions
        const envConditions = this.environmentalConditions[environmentalCondition];

        // Calculate performance for each phase
        const phaseResults = [];
        let totalFuelUsed = 0;
        let totalDistance = 0;
        let totalTime = 0;
        let currentWeight = this.calculateMissionWeight(aircraft, mission, loadout);

        mission.phases.forEach((phase, index) => {
            const phaseResult = this.calculatePhasePerformance(
                aircraft,
                phase,
                currentWeight,
                envConditions,
                countryTechLevel
            );

            // Update weight and totals
            currentWeight -= phaseResult.fuelConsumption;
            totalFuelUsed += phaseResult.fuelConsumption;
            totalDistance += phaseResult.distance;
            totalTime += phase.duration;

            phaseResults.push({
                ...phaseResult,
                phaseName: phase.name,
                phaseIndex: index,
                weightAtStart: currentWeight + phaseResult.fuelConsumption,
                weightAtEnd: currentWeight
            });
        });

        // Calculate mission summary
        const missionSummary = this.calculateMissionSummary(
            mission,
            phaseResults,
            totalFuelUsed,
            totalDistance,
            totalTime,
            aircraft
        );

        return {
            mission: mission.name,
            missionType,
            aircraft: aircraft.name,
            conditions: {
                environmental: environmentalCondition,
                techLevel: countryTechLevel,
                pilotSkill,
                loadout
            },
            phases: phaseResults,
            summary: missionSummary,
            performance: this.assessMissionPerformance(missionSummary, mission),
            recommendations: this.generateMissionRecommendations(missionSummary, mission, aircraft)
        };
    }

    /**
     * Calculates performance for a single mission phase
     */
    calculatePhasePerformance(aircraft, phase, weight, envConditions, techLevel) {
        // Average conditions for the phase
        const avgAltitude = (phase.altitude.start + phase.altitude.end) / 2;
        const avgSpeed = (phase.speed.start + phase.speed.end) / 2;

        // Calculate atmospheric effects
        const atmosphericConditions = this.calculateAtmosphericEffects(avgAltitude, envConditions);

        // Get thrust data from propulsion system
        const thrustData = dynamicPropulsionSystem.calculateDynamicThrust(aircraft, {
            altitude: avgAltitude,
            speed: avgSpeed,
            flightPhase: phase.name,
            countryTechLevel: techLevel
        });

        // Calculate required thrust for this phase
        const requiredThrust = this.calculateRequiredThrust(weight, avgSpeed, avgAltitude, phase.name);

        // Calculate fuel consumption
        const fuelConsumption = this.calculatePhaseFuelConsumption(
            aircraft,
            thrustData,
            phase,
            atmosphericConditions
        );

        // Calculate distance covered
        const distance = this.calculatePhaseDistance(phase);

        // Performance metrics
        const thrustMargin = (thrustData.totalThrust - requiredThrust) / requiredThrust;
        const powerLoading = weight / thrustData.totalThrust;
        const wingLoading = weight / (aircraft.wings?.area || 25);

        // Phase assessment
        const adequate = thrustData.totalThrust >= requiredThrust;
        const efficient = fuelConsumption <= this.getOptimalFuelConsumption(phase, aircraft);

        return {
            altitude: {
                start: phase.altitude.start,
                end: phase.altitude.end,
                average: avgAltitude
            },
            speed: {
                start: phase.speed.start,
                end: phase.speed.end,
                average: avgSpeed
            },
            duration: phase.duration,
            distance,
            thrustAvailable: thrustData.totalThrust,
            thrustRequired: requiredThrust,
            thrustMargin,
            fuelConsumption,
            powerLoading,
            wingLoading,
            atmosphericConditions,
            adequate,
            efficient,
            performance: {
                excellent: adequate && efficient && thrustMargin > 0.3,
                good: adequate && (efficient || thrustMargin > 0.2),
                adequate: adequate,
                poor: !adequate
            }
        };
    }

    /**
     * Calculates atmospheric effects on performance
     */
    calculateAtmosphericEffects(altitude, envConditions) {
        // Standard atmospheric model with environmental modifications
        const standardTemp = 288.15 - 0.0065 * altitude; // K
        const actualTemp = standardTemp + envConditions.temperature - 15; // Adjust for non-standard temp

        const pressureRatio = Math.pow(actualTemp / 288.15, 5.2561);
        const densityRatio = pressureRatio * (288.15 / actualTemp);

        // Wind effects
        const headwindComponent = envConditions.windSpeed * 0.5; // Simplified
        const effectiveSpeed = headwindComponent;

        return {
            temperatureRatio: actualTemp / 288.15,
            pressureRatio,
            densityRatio,
            windEffect: effectiveSpeed,
            visibility: envConditions.visibility,
            humidity: envConditions.humidity
        };
    }

    /**
     * Calculates required thrust for specific flight phase
     */
    calculateRequiredThrust(weight, speed, altitude, phaseName) {
        const conditions = dynamicPropulsionSystem.atmosphericModel.getConditions(altitude);
        const dynamicPressure = 0.5 * conditions.density * Math.pow(speed, 2);

        // Base drag coefficient varies by phase
        const dragCoefficients = {
            takeoff: 0.08,  // High drag during takeoff
            climb: 0.04,    // Moderate drag
            cruise: 0.025,  // Low drag
            combat: 0.06,   // Higher drag due to maneuvering
            descent: 0.03,  // Low drag
            approach: 0.07, // Higher drag with flaps
            landing: 0.10,  // Maximum drag
            recon: 0.025    // Optimized for efficiency
        };

        const cd = dragCoefficients[phaseName] || 0.04;

        // Estimate reference area (simplified)
        const referenceArea = Math.max(15, weight / 300); // m²

        const drag = cd * dynamicPressure * referenceArea;

        // Add thrust for climb if applicable
        let climbThrust = 0;
        if (phaseName === 'climb' || phaseName === 'takeoff') {
            const climbAngle = Math.atan(10 / speed); // Simplified climb angle
            climbThrust = weight * 9.81 * Math.sin(climbAngle);
        }

        return drag + climbThrust; // N
    }

    /**
     * Calculates fuel consumption for a phase
     */
    calculatePhaseFuelConsumption(aircraft, thrustData, phase, atmosphericConditions) {
        // Base fuel flow calculation
        const engineData = this.getEngineData(aircraft.propulsion?.engines?.[0]);
        if (!engineData) return 0;

        // Get specific fuel consumption
        let sfc = dynamicPropulsionSystem.getTypicalSFC(engineData.type);

        // Apply atmospheric effects
        sfc *= (2 - atmosphericConditions.densityRatio); // Higher altitude = higher SFC

        // Apply phase-specific multipliers
        const phaseMultipliers = {
            takeoff: 2.0,
            climb: 1.6,
            cruise: 1.0,
            combat: 2.5,
            descent: 0.6,
            approach: 1.1,
            landing: 0.8,
            recon: 1.1
        };

        const multiplier = phaseMultipliers[phase.name] || 1.0;

        // Calculate fuel flow (kg/h)
        const fuelFlow = (thrustData.totalThrust / 1000) * sfc * multiplier / thrustData.efficiency;

        // Convert to total fuel consumption for phase
        return (fuelFlow * phase.duration) / 3600; // kg
    }

    /**
     * Calculates distance covered in a phase
     */
    calculatePhaseDistance(phase) {
        const avgSpeed = (phase.speed.start + phase.speed.end) / 2;
        return (avgSpeed * phase.duration) / 3.6; // Convert km/h to m
    }

    /**
     * Calculates mission weight including payload
     */
    calculateMissionWeight(aircraft, mission, loadout) {
        const emptyWeight = aircraft.performance?.weight?.empty || 5000;
        const fuelWeight = aircraft.propulsion?.fuelCapacity || 1000;
        const payloadWeight = this.calculatePayloadWeight(mission, loadout);

        return emptyWeight + fuelWeight + payloadWeight;
    }

    /**
     * Calculates payload weight based on mission and loadout
     */
    calculatePayloadWeight(mission, loadout) {
        const basePayload = mission.payload || 0;

        const loadoutMultipliers = {
            light: 0.7,
            standard: 1.0,
            heavy: 1.3,
            maximum: 1.6
        };

        return basePayload * (loadoutMultipliers[loadout] || 1.0);
    }

    /**
     * Calculates mission summary statistics
     */
    calculateMissionSummary(mission, phaseResults, totalFuelUsed, totalDistance, totalTime, aircraft) {
        const fuelCapacity = aircraft.propulsion?.fuelCapacity || 1000;
        const requiredFuel = totalFuelUsed * (1 + mission.fuelReserve);

        return {
            totalDuration: totalTime / 3600, // hours
            totalDistance: totalDistance / 1000, // km
            totalFuelUsed,
            requiredFuelCapacity: requiredFuel,
            fuelMargin: fuelCapacity - requiredFuel,
            fuelEfficiency: totalDistance / totalFuelUsed, // km/kg
            averageSpeed: (totalDistance / 1000) / (totalTime / 3600), // km/h
            missionFeasible: requiredFuel <= fuelCapacity,
            fuelReserveActual: Math.max(0, (fuelCapacity - totalFuelUsed) / fuelCapacity),
            criticalPhases: phaseResults.filter(phase => !phase.adequate),
            excellentPhases: phaseResults.filter(phase => phase.performance.excellent),
            overallPerformance: this.calculateOverallPerformance(phaseResults)
        };
    }

    /**
     * Calculates overall mission performance score
     */
    calculateOverallPerformance(phaseResults) {
        let totalScore = 0;
        let weightedDuration = 0;

        phaseResults.forEach(phase => {
            let phaseScore = 0;
            if (phase.performance.excellent) phaseScore = 100;
            else if (phase.performance.good) phaseScore = 80;
            else if (phase.performance.adequate) phaseScore = 60;
            else phaseScore = 20;

            totalScore += phaseScore * phase.duration;
            weightedDuration += phase.duration;
        });

        return weightedDuration > 0 ? totalScore / weightedDuration : 0;
    }

    /**
     * Assesses mission performance
     */
    assessMissionPerformance(summary, mission) {
        const assessment = {
            feasibility: summary.missionFeasible ? 'feasible' : 'unfeasible',
            fuelAdequacy: summary.fuelMargin > 0 ? 'adequate' : 'insufficient',
            performanceLevel: 'adequate',
            riskLevel: 'medium',
            recommendedAction: 'proceed'
        };

        // Determine performance level
        if (summary.overallPerformance >= 85) {
            assessment.performanceLevel = 'excellent';
            assessment.riskLevel = 'low';
        } else if (summary.overallPerformance >= 70) {
            assessment.performanceLevel = 'good';
            assessment.riskLevel = 'low';
        } else if (summary.overallPerformance >= 50) {
            assessment.performanceLevel = 'adequate';
            assessment.riskLevel = 'medium';
        } else {
            assessment.performanceLevel = 'poor';
            assessment.riskLevel = 'high';
            assessment.recommendedAction = 'reconsider';
        }

        // Adjust for fuel situation
        if (summary.fuelMargin < 0) {
            assessment.riskLevel = 'critical';
            assessment.recommendedAction = 'abort';
        } else if (summary.fuelReserveActual < mission.fuelReserve * 0.8) {
            assessment.riskLevel = Math.min('high', assessment.riskLevel);
        }

        return assessment;
    }

    /**
     * Generates mission recommendations
     */
    generateMissionRecommendations(summary, mission, aircraft) {
        const recommendations = [];

        // Fuel recommendations
        if (summary.fuelMargin < 0) {
            recommendations.push({
                type: 'critical',
                category: 'fuel',
                message: 'Capacidade de combustível insuficiente para a missão',
                suggestion: 'Aumente a capacidade de combustível ou reduza o payload',
                priority: 'high'
            });
        } else if (summary.fuelReserveActual < mission.fuelReserve) {
            recommendations.push({
                type: 'warning',
                category: 'fuel',
                message: 'Reserva de combustível abaixo do recomendado',
                suggestion: 'Considere tanques auxiliares ou redução de payload',
                priority: 'medium'
            });
        }

        // Performance recommendations
        if (summary.criticalPhases.length > 0) {
            recommendations.push({
                type: 'warning',
                category: 'performance',
                message: `${summary.criticalPhases.length} fase(s) com performance inadequada`,
                suggestion: 'Revise configuração da aeronave ou perfil de missão',
                priority: 'high'
            });
        }

        // Efficiency recommendations
        if (summary.fuelEfficiency < 0.5) { // km per kg of fuel
            recommendations.push({
                type: 'info',
                category: 'efficiency',
                message: 'Eficiência de combustível pode ser melhorada',
                suggestion: 'Otimize altitude de cruzeiro e velocidade',
                priority: 'low'
            });
        }

        return recommendations;
    }

    /**
     * Gets optimal fuel consumption for comparison
     */
    getOptimalFuelConsumption(phase, aircraft) {
        // Simplified optimal consumption calculation
        const baseConsumption = 100; // kg/h base
        const phaseMultipliers = {
            takeoff: 2.0,
            climb: 1.5,
            cruise: 1.0,
            combat: 2.2,
            descent: 0.7,
            approach: 1.0,
            landing: 0.8
        };

        return (baseConsumption * (phaseMultipliers[phase.name] || 1.0) * phase.duration) / 3600;
    }

    /**
     * Gets engine data
     */
    getEngineData(engineId) {
        return dynamicPropulsionSystem.getEngineData(engineId);
    }

    /**
     * Gets available mission profiles for aircraft category
     */
    getAvailableMissions(aircraftCategory) {
        return Object.entries(this.missionProfiles)
            .filter(([_, mission]) =>
                mission.category === aircraftCategory ||
                aircraftCategory === 'multirole'
            )
            .map(([key, mission]) => ({
                id: key,
                name: mission.name,
                description: mission.description,
                category: mission.category,
                priority: mission.priority
            }));
    }

    /**
     * Creates custom mission profile
     */
    createCustomMission(missionData) {
        const customMission = {
            name: missionData.name || 'Missão Personalizada',
            category: missionData.category || 'custom',
            description: missionData.description || 'Missão definida pelo usuário',
            phases: missionData.phases || [],
            fuelReserve: missionData.fuelReserve || 0.15,
            payload: missionData.payload || 0,
            priority: missionData.priority || 'balanced'
        };

        return customMission;
    }

    /**
     * Exports flight profile analysis
     */
    exportFlightProfile(aircraft, missionType, conditions = {}) {
        const analysis = this.calculateMissionPerformance(aircraft, missionType, conditions);

        return {
            timestamp: Date.now(),
            exportType: 'flight_profile',
            data: analysis,
            metadata: {
                version: '1.0.0',
                aircraft: aircraft.name,
                mission: missionType
            }
        };
    }
}

// Create global instance
export const flightProfileSystem = new FlightProfileSystem();

// Make it available globally
window.flightProfileSystem = flightProfileSystem;

console.log('✈️ FlightProfileSystem module loaded');