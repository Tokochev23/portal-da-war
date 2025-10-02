/**
 * Flight Profile Manager - War1954 Aircraft Creator
 *
 * Advanced flight profile management system that creates detailed mission profiles,
 * optimizes flight paths, and analyzes performance across different flight phases.
 * Integrates with dynamic propulsion system for comprehensive mission planning.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { dynamicPropulsionSystem } from './DynamicPropulsionSystem.js';

export class FlightProfileManager {
    constructor() {
        this.initialized = false;
        this.currentAircraft = null;
        this.activeProfile = null;

        // Mission profile templates
        this.profileTemplates = {
            civilian_transport: {
                name: 'Transporte Civil',
                description: 'Perfil otimizado para transporte de passageiros',
                phases: ['taxi', 'takeoff', 'climb', 'cruise', 'descent', 'approach', 'landing'],
                cruiseAltitude: 10000,
                cruiseSpeed: 500,
                efficiency: 0.85,
                payload: 2000,
                range: 1500
            },
            military_transport: {
                name: 'Transporte Militar',
                description: 'Perfil para transporte militar com capacidade de carga',
                phases: ['taxi', 'takeoff', 'climb', 'cruise', 'descent', 'approach', 'landing'],
                cruiseAltitude: 8000,
                cruiseSpeed: 450,
                efficiency: 0.75,
                payload: 5000,
                range: 2000
            },
            fighter_intercept: {
                name: 'Interceptação',
                description: 'Perfil de interceptação para caças',
                phases: ['takeoff', 'climb', 'combat', 'descent', 'landing'],
                cruiseAltitude: 12000,
                cruiseSpeed: 800,
                efficiency: 0.60,
                payload: 500,
                range: 800,
                afterburnerUse: true
            },
            fighter_patrol: {
                name: 'Patrulha de Combate',
                description: 'Perfil de patrulha para caças',
                phases: ['takeoff', 'climb', 'cruise', 'combat', 'cruise', 'descent', 'landing'],
                cruiseAltitude: 10000,
                cruiseSpeed: 600,
                efficiency: 0.70,
                payload: 1000,
                range: 1200
            },
            bomber_mission: {
                name: 'Missão de Bombardeio',
                description: 'Perfil para bombardeiros estratégicos',
                phases: ['taxi', 'takeoff', 'climb', 'cruise', 'bomb_run', 'cruise', 'descent', 'approach', 'landing'],
                cruiseAltitude: 15000,
                cruiseSpeed: 550,
                efficiency: 0.65,
                payload: 8000,
                range: 3000
            },
            reconnaissance: {
                name: 'Reconhecimento',
                description: 'Perfil para missões de reconhecimento',
                phases: ['takeoff', 'climb', 'cruise', 'reconnaissance', 'cruise', 'descent', 'landing'],
                cruiseAltitude: 18000,
                cruiseSpeed: 650,
                efficiency: 0.80,
                payload: 200,
                range: 2500
            },
            training: {
                name: 'Treinamento',
                description: 'Perfil para voos de treinamento',
                phases: ['taxi', 'takeoff', 'climb', 'training_maneuvers', 'approach', 'landing'],
                cruiseAltitude: 3000,
                cruiseSpeed: 300,
                efficiency: 0.90,
                payload: 200,
                range: 400
            }
        };

        // Custom flight phases for specific missions
        this.customPhases = {
            bomb_run: {
                label: 'Bombardeio',
                thrustRequirement: 0.7,
                fuelConsumptionMultiplier: 2.0,
                duration: 300,
                altitudeRange: { min: 8000, max: 15000 },
                speedRange: { min: 400, max: 600 },
                description: 'Fase de aproximação e ataque ao alvo'
            },
            reconnaissance: {
                label: 'Reconhecimento',
                thrustRequirement: 0.4,
                fuelConsumptionMultiplier: 1.1,
                duration: 1800,
                altitudeRange: { min: 10000, max: 20000 },
                speedRange: { min: 300, max: 700 },
                description: 'Fase de coleta de inteligência'
            },
            training_maneuvers: {
                label: 'Manobras de Treinamento',
                thrustRequirement: 0.8,
                fuelConsumptionMultiplier: 2.2,
                duration: 1200,
                altitudeRange: { min: 1000, max: 8000 },
                speedRange: { min: 200, max: 800 },
                description: 'Manobras acrobáticas e treinamento de combate'
            },
            air_refueling: {
                label: 'Reabastecimento Aéreo',
                thrustRequirement: 0.3,
                fuelConsumptionMultiplier: 0.9,
                duration: 600,
                altitudeRange: { min: 8000, max: 12000 },
                speedRange: { min: 400, max: 500 },
                description: 'Reabastecimento em voo'
            },
            loiter: {
                label: 'Órbita/Espera',
                thrustRequirement: 0.25,
                fuelConsumptionMultiplier: 0.8,
                duration: 3600,
                altitudeRange: { min: 5000, max: 15000 },
                speedRange: { min: 300, max: 500 },
                description: 'Voo em padrão de espera'
            }
        };

        // Weather conditions impact
        this.weatherConditions = {
            clear: {
                name: 'Céu Limpo',
                visibility: 1.0,
                dragMultiplier: 1.0,
                fuelPenalty: 1.0
            },
            light_clouds: {
                name: 'Nuvens Dispersas',
                visibility: 0.9,
                dragMultiplier: 1.02,
                fuelPenalty: 1.05
            },
            overcast: {
                name: 'Nublado',
                visibility: 0.7,
                dragMultiplier: 1.05,
                fuelPenalty: 1.1
            },
            rain: {
                name: 'Chuva',
                visibility: 0.5,
                dragMultiplier: 1.1,
                fuelPenalty: 1.15
            },
            storm: {
                name: 'Tempestade',
                visibility: 0.3,
                dragMultiplier: 1.2,
                fuelPenalty: 1.25
            },
            icing: {
                name: 'Formação de Gelo',
                visibility: 0.8,
                dragMultiplier: 1.15,
                fuelPenalty: 1.2
            }
        };

        this.initializeManager();
    }

    /**
     * Initialize the flight profile manager
     */
    initializeManager() {
        this.activeProfile = null;
        this.initialized = true;
        console.log('✈️ FlightProfileManager initialized');
    }

    /**
     * Create a mission profile from template
     */
    createMissionProfile(templateName, customization = {}) {
        const template = this.profileTemplates[templateName];
        if (!template) {
            return { success: false, reason: 'Template not found' };
        }

        const profile = {
            id: `${templateName}_${Date.now()}`,
            name: customization.name || template.name,
            template: templateName,
            description: customization.description || template.description,

            // Mission parameters
            phases: customization.phases || [...template.phases],
            cruiseAltitude: customization.cruiseAltitude || template.cruiseAltitude,
            cruiseSpeed: customization.cruiseSpeed || template.cruiseSpeed,
            payload: customization.payload || template.payload,
            range: customization.range || template.range,

            // Weather and conditions
            weather: customization.weather || 'clear',
            timeOfDay: customization.timeOfDay || 'day',
            season: customization.season || 'summer',

            // Performance targets
            targetEfficiency: customization.efficiency || template.efficiency,
            maxFuelBurn: customization.maxFuelBurn || null,
            minRange: customization.minRange || template.range * 0.8,

            // Special requirements
            afterburnerUse: customization.afterburnerUse || template.afterburnerUse || false,
            vectoringRequired: customization.vectoringRequired || false,

            // Generated data
            estimatedDuration: 0,
            estimatedFuelBurn: 0,
            phases: [],

            created: Date.now(),
            status: 'created'
        };

        return { success: true, profile };
    }

    /**
     * Calculate detailed mission profile
     */
    calculateMissionProfile(profile, aircraft, techLevel = 50) {
        if (!aircraft || !profile) {
            return { success: false, reason: 'Missing aircraft or profile data' };
        }

        const calculatedPhases = [];
        let totalDuration = 0;
        let totalFuelBurn = 0;
        let totalDistance = 0;
        let remainingFuel = aircraft.propulsion?.fuelCapacity || 1000;
        let currentWeight = this.calculateAircraftWeight(aircraft, profile.payload, remainingFuel);

        // Get weather effects
        const weatherEffects = this.weatherConditions[profile.weather] || this.weatherConditions.clear;

        // Calculate each phase
        for (let i = 0; i < profile.phases.length; i++) {
            const phaseName = profile.phases[i];
            const phaseData = this.getPhaseData(phaseName);

            if (!phaseData) continue;

            // Calculate phase performance
            const phaseResult = this.calculatePhasePerformance(
                aircraft,
                phaseData,
                profile,
                currentWeight,
                techLevel,
                weatherEffects
            );

            // Update totals
            totalDuration += phaseResult.duration;
            totalFuelBurn += phaseResult.fuelBurn;
            totalDistance += phaseResult.distance;
            remainingFuel -= phaseResult.fuelBurn;
            currentWeight = this.calculateAircraftWeight(aircraft, profile.payload, remainingFuel);

            // Store phase results
            calculatedPhases.push({
                name: phaseName,
                ...phaseResult,
                remainingFuel,
                currentWeight
            });

            // Check fuel constraints
            if (remainingFuel < 0) {
                return {
                    success: false,
                    reason: 'Insufficient fuel for mission',
                    fuelShortfall: Math.abs(remainingFuel),
                    failedAtPhase: phaseName
                };
            }
        }

        // Calculate mission summary
        const missionSummary = {
            totalDuration: totalDuration / 3600, // Convert to hours
            totalFuelBurn,
            totalDistance: totalDistance / 1000, // Convert to km
            averageSpeed: (totalDistance / totalDuration) * 3.6, // km/h
            fuelEfficiency: totalDistance / totalFuelBurn, // meters per kg fuel
            remainingFuel,
            fuelMargin: (remainingFuel / (aircraft.propulsion?.fuelCapacity || 1000)) * 100,
            phases: calculatedPhases
        };

        // Performance analysis
        const analysis = this.analyzeMissionPerformance(missionSummary, profile, aircraft);

        return {
            success: true,
            profile: {
                ...profile,
                calculated: true,
                calculation: missionSummary,
                analysis
            }
        };
    }

    /**
     * Get phase data (built-in or custom)
     */
    getPhaseData(phaseName) {
        // Check custom phases first
        if (this.customPhases[phaseName]) {
            return this.customPhases[phaseName];
        }

        // Check built-in phases
        if (dynamicPropulsionSystem.flightPhases[phaseName]) {
            return dynamicPropulsionSystem.flightPhases[phaseName];
        }

        return null;
    }

    /**
     * Calculate performance for a specific phase
     */
    calculatePhasePerformance(aircraft, phaseData, profile, weight, techLevel, weatherEffects) {
        // Determine phase conditions
        const avgAltitude = profile.cruiseAltitude || (phaseData.altitudeRange.min + phaseData.altitudeRange.max) / 2;
        const avgSpeed = profile.cruiseSpeed || (phaseData.speedRange.min + phaseData.speedRange.max) / 2;

        // Apply weather effects
        const effectiveSpeed = avgSpeed * weatherEffects.visibility;
        const thrustRequirement = phaseData.thrustRequirement * weatherEffects.dragMultiplier;

        // Calculate propulsion performance
        const propulsionData = dynamicPropulsionSystem.calculateDynamicThrust(aircraft, {
            altitude: avgAltitude,
            speed: effectiveSpeed,
            flightPhase: phaseData.label.toLowerCase(),
            countryTechLevel: techLevel,
            afterburnerActive: profile.afterburnerUse && this.shouldUseAfterburner(phaseData)
        });

        // Calculate fuel consumption
        const baseFuelFlow = this.calculatePhaseFuelFlow(aircraft, propulsionData, phaseData.fuelConsumptionMultiplier);
        const weatherAdjustedFuelFlow = baseFuelFlow * weatherEffects.fuelPenalty;
        const phaseFuelBurn = (weatherAdjustedFuelFlow * phaseData.duration) / 3600; // Convert to kg

        // Calculate distance
        const phaseDistance = (effectiveSpeed * phaseData.duration) / 3.6; // Convert to meters

        // Performance metrics
        const thrustAvailable = propulsionData.totalThrust;
        const thrustRequired = this.calculateRequiredThrust(weight, effectiveSpeed, avgAltitude) * thrustRequirement;
        const thrustMargin = (thrustAvailable - thrustRequired) / thrustRequired;

        return {
            phase: phaseData.label,
            duration: phaseData.duration,
            altitude: avgAltitude,
            speed: effectiveSpeed,
            thrustAvailable,
            thrustRequired,
            thrustMargin,
            fuelFlow: weatherAdjustedFuelFlow,
            fuelBurn: phaseFuelBurn,
            distance: phaseDistance,
            efficiency: propulsionData.efficiency,
            weatherImpact: {
                visibility: weatherEffects.visibility,
                dragMultiplier: weatherEffects.dragMultiplier,
                fuelPenalty: weatherEffects.fuelPenalty
            },
            adequate: thrustAvailable >= thrustRequired
        };
    }

    /**
     * Calculate aircraft weight including payload and fuel
     */
    calculateAircraftWeight(aircraft, payload, fuel) {
        const emptyWeight = aircraft.performance?.weight?.empty || 5000;
        return emptyWeight + payload + fuel;
    }

    /**
     * Determine if afterburner should be used for phase
     */
    shouldUseAfterburner(phaseData) {
        const highThrustPhases = ['takeoff', 'climb', 'combat', 'training_maneuvers'];
        return highThrustPhases.includes(phaseData.label.toLowerCase()) ||
               phaseData.thrustRequirement > 0.8;
    }

    /**
     * Calculate fuel flow for phase
     */
    calculatePhaseFuelFlow(aircraft, propulsionData, multiplier) {
        const engineId = aircraft.propulsion?.engines?.[0];
        const engineData = dynamicPropulsionSystem.getEngineData(engineId);

        if (!engineData) return 0;

        // Base specific fuel consumption
        const sfc = engineData.specificFuelConsumption ||
                   dynamicPropulsionSystem.getTypicalSFC(engineData.type);

        // Calculate fuel flow
        const fuelFlow = (propulsionData.totalThrust / 1000) * sfc * multiplier;
        return fuelFlow / propulsionData.efficiency; // Account for efficiency
    }

    /**
     * Calculate required thrust for conditions
     */
    calculateRequiredThrust(weight, speed, altitude) {
        // Simplified calculation - in reality this would be much more complex
        const atmosphericDensity = 1.225 * Math.exp(-altitude / 8400);
        const dynamicPressure = 0.5 * atmosphericDensity * Math.pow(speed, 2);
        const dragCoefficient = 0.03;
        const referenceArea = 20; // m²

        return dragCoefficient * dynamicPressure * referenceArea;
    }

    /**
     * Analyze mission performance
     */
    analyzeMissionPerformance(missionSummary, profile, aircraft) {
        const analysis = {
            overallRating: 'good',
            strengths: [],
            weaknesses: [],
            recommendations: [],
            criticalIssues: []
        };

        // Fuel margin analysis
        if (missionSummary.fuelMargin < 10) {
            analysis.criticalIssues.push('Margem de combustível muito baixa (<10%)');
            analysis.overallRating = 'poor';
        } else if (missionSummary.fuelMargin < 20) {
            analysis.weaknesses.push('Margem de combustível baixa');
            if (analysis.overallRating === 'good') analysis.overallRating = 'fair';
        } else {
            analysis.strengths.push(`Boa margem de combustível (${missionSummary.fuelMargin.toFixed(1)}%)`);
        }

        // Range analysis
        const rangeAchieved = missionSummary.totalDistance;
        const rangeTarget = profile.range;
        const rangeRatio = rangeAchieved / rangeTarget;

        if (rangeRatio < 0.8) {
            analysis.criticalIssues.push('Alcance insuficiente para missão');
            analysis.overallRating = 'poor';
        } else if (rangeRatio < 0.9) {
            analysis.weaknesses.push('Alcance marginal');
            if (analysis.overallRating === 'good') analysis.overallRating = 'fair';
        } else {
            analysis.strengths.push('Alcance adequado para missão');
        }

        // Efficiency analysis
        if (missionSummary.fuelEfficiency < 3) {
            analysis.weaknesses.push('Baixa eficiência de combustível');
        } else if (missionSummary.fuelEfficiency > 6) {
            analysis.strengths.push('Excelente eficiência de combustível');
        }

        // Thrust adequacy
        const inadequatePhases = missionSummary.phases.filter(phase => !phase.adequate);
        if (inadequatePhases.length > 0) {
            analysis.criticalIssues.push(`Empuxo insuficiente em ${inadequatePhases.length} fase(s)`);
            analysis.overallRating = 'poor';
        }

        // Generate recommendations
        if (analysis.criticalIssues.length === 0) {
            if (missionSummary.fuelMargin > 30) {
                analysis.recommendations.push('Considere aumentar carga útil ou alcance');
            }
            if (missionSummary.averageSpeed < profile.cruiseSpeed * 0.8) {
                analysis.recommendations.push('Otimize perfil de velocidade');
            }
        } else {
            analysis.recommendations.push('Motor mais potente necessário');
            analysis.recommendations.push('Reduza carga útil ou distância da missão');
        }

        return analysis;
    }

    /**
     * Optimize mission profile
     */
    optimizeMissionProfile(profile, aircraft, techLevel, objectives = {}) {
        const {
            optimizeFor = 'efficiency', // 'efficiency', 'speed', 'range', 'payload'
            constraints = {}
        } = objectives;

        let bestProfile = null;
        let bestScore = -Infinity;

        // Test different parameter combinations
        const altitudeRange = [8000, 10000, 12000, 15000, 18000];
        const speedRange = [0.7, 0.8, 0.9, 1.0, 1.1]; // Multipliers of cruise speed

        for (const altitude of altitudeRange) {
            for (const speedMult of speedRange) {
                const testProfile = {
                    ...profile,
                    cruiseAltitude: altitude,
                    cruiseSpeed: profile.cruiseSpeed * speedMult
                };

                const result = this.calculateMissionProfile(testProfile, aircraft, techLevel);

                if (result.success) {
                    const score = this.calculateOptimizationScore(
                        result.profile.calculation,
                        optimizeFor,
                        constraints
                    );

                    if (score > bestScore) {
                        bestScore = score;
                        bestProfile = result.profile;
                    }
                }
            }
        }

        return bestProfile ?
            { success: true, optimizedProfile: bestProfile, improvementScore: bestScore } :
            { success: false, reason: 'No viable optimization found' };
    }

    /**
     * Calculate optimization score
     */
    calculateOptimizationScore(missionData, optimizeFor, constraints) {
        let score = 0;

        switch (optimizeFor) {
            case 'efficiency':
                score = missionData.fuelEfficiency * 10;
                break;
            case 'speed':
                score = missionData.averageSpeed;
                break;
            case 'range':
                score = missionData.totalDistance / 1000;
                break;
            case 'time':
                score = 1000 / missionData.totalDuration; // Inverse of time
                break;
        }

        // Apply constraint penalties
        if (constraints.maxFuelBurn && missionData.totalFuelBurn > constraints.maxFuelBurn) {
            score *= 0.5;
        }
        if (constraints.minFuelMargin && missionData.fuelMargin < constraints.minFuelMargin) {
            score *= 0.3;
        }
        if (constraints.maxDuration && missionData.totalDuration > constraints.maxDuration) {
            score *= 0.7;
        }

        return score;
    }

    /**
     * Export mission profile analysis
     */
    exportMissionAnalysis(profile) {
        if (!profile || !profile.calculated) {
            return { success: false, reason: 'Profile not calculated' };
        }

        return {
            timestamp: Date.now(),
            profileInfo: {
                name: profile.name,
                template: profile.template,
                description: profile.description
            },
            missionParameters: {
                phases: profile.phases,
                cruiseAltitude: profile.cruiseAltitude,
                cruiseSpeed: profile.cruiseSpeed,
                payload: profile.payload,
                weather: profile.weather
            },
            calculatedPerformance: profile.calculation,
            analysis: profile.analysis,
            recommendations: this.generateDetailedRecommendations(profile)
        };
    }

    /**
     * Generate detailed recommendations
     */
    generateDetailedRecommendations(profile) {
        const recommendations = [];
        const calc = profile.calculation;
        const analysis = profile.analysis;

        // Fuel recommendations
        if (calc.fuelMargin < 15) {
            recommendations.push({
                category: 'fuel',
                priority: 'high',
                title: 'Aumentar Capacidade de Combustível',
                description: 'Margem de combustível insuficiente para segurança operacional',
                actions: [
                    'Instalar tanques auxiliares',
                    'Reduzir carga útil',
                    'Encurtar rota',
                    'Considerar reabastecimento aéreo'
                ]
            });
        }

        // Performance recommendations
        const inadequatePhases = calc.phases.filter(p => p.thrustMargin < 0.1);
        if (inadequatePhases.length > 0) {
            recommendations.push({
                category: 'performance',
                priority: 'high',
                title: 'Melhorar Performance do Motor',
                description: `Empuxo inadequado em ${inadequatePhases.length} fase(s)`,
                actions: [
                    'Upgrade do motor',
                    'Reduzir peso da aeronave',
                    'Usar afterburner quando disponível',
                    'Otimizar perfil de voo'
                ]
            });
        }

        // Efficiency recommendations
        if (calc.fuelEfficiency < 4) {
            recommendations.push({
                category: 'efficiency',
                priority: 'medium',
                title: 'Otimizar Eficiência de Combustível',
                description: 'Consumo de combustível acima do ideal',
                actions: [
                    'Ajustar altitude de cruzeiro',
                    'Otimizar velocidade de cruzeiro',
                    'Melhorar aerodinâmica',
                    'Considerar motor mais eficiente'
                ]
            });
        }

        return recommendations;
    }

    /**
     * Get available profile templates
     */
    getAvailableTemplates() {
        return Object.keys(this.profileTemplates).map(key => ({
            id: key,
            ...this.profileTemplates[key]
        }));
    }

    /**
     * Get weather conditions
     */
    getWeatherConditions() {
        return Object.keys(this.weatherConditions).map(key => ({
            id: key,
            ...this.weatherConditions[key]
        }));
    }
}

// Create global instance
export const flightProfileManager = new FlightProfileManager();

// Make it available globally
window.flightProfileManager = flightProfileManager;

console.log('✈️ FlightProfileManager module loaded');