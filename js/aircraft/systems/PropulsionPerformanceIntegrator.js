/**
 * Propulsion Performance Integrator - War1954 Aircraft Creator
 *
 * Integrates all propulsion systems with aircraft performance calculations,
 * providing comprehensive flight performance analysis and optimization.
 * Coordinates between dynamic propulsion, afterburner, thrust vectoring, and advanced technologies.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { dynamicPropulsionSystem } from './DynamicPropulsionSystem.js';
import { afterburnerController } from './AfterburnerController.js';
import { thrustVectoringController } from './ThrustVectoringController.js';
import { advancedPropulsionTech } from './AdvancedPropulsionTech.js';

export class PropulsionPerformanceIntegrator {
    constructor() {
        this.initialized = false;
        this.currentAircraft = null;
        this.flightConditions = {};
        this.integratedPerformance = {};

        // Performance calculation modes
        this.calculationModes = {
            basic: 'Basic propulsion calculations',
            advanced: 'Advanced with afterburner and vectoring',
            experimental: 'Including experimental technologies',
            realtime: 'Real-time flight simulation'
        };

        this.currentMode = 'advanced';

        // Integration coefficients
        this.integrationCoefficients = {
            thrustCombination: 1.0,        // How systems combine thrust
            efficiencyCombination: 0.95,   // Combined efficiency factor
            weightPenalty: 1.0,            // Weight penalty for multiple systems
            complexityFactor: 1.0,         // Maintenance complexity
            reliabilityFactor: 1.0         // Overall system reliability
        };

        // Performance envelope
        this.performanceEnvelope = {
            altitude: { min: 0, max: 25000 },
            speed: { min: 0, max: 3000 },
            loadFactor: { min: -3, max: 12 },
            fuelFlow: { min: 0, max: 50 }
        };

        this.initializeIntegrator();
    }

    /**
     * Initialize the performance integrator
     */
    initializeIntegrator() {
        this.resetPerformanceData();
        this.initialized = true;
        console.log('⚡ PropulsionPerformanceIntegrator initialized');
    }

    /**
     * Configure integrator for specific aircraft
     */
    configureForAircraft(aircraft, techLevel = 50, configuration = {}) {
        this.currentAircraft = aircraft;

        // Configure all subsystems
        dynamicPropulsionSystem.currentAircraft = aircraft;
        afterburnerController.currentAircraft = aircraft;
        thrustVectoringController.configureSystem(aircraft, techLevel);

        // Set integration coefficients based on aircraft complexity
        this.updateIntegrationCoefficients(aircraft, techLevel);

        // Calculate baseline performance
        this.calculateIntegratedPerformance();

        console.log(`⚡ Configured for aircraft: ${aircraft.name}`);

        return {
            success: true,
            systems: this.getActiveSystemsStatus(),
            performanceEnvelope: this.calculatePerformanceEnvelope(),
            recommendations: this.generateIntegrationRecommendations()
        };
    }

    /**
     * Update integration coefficients based on aircraft and technology
     */
    updateIntegrationCoefficients(aircraft, techLevel) {
        const engineCount = aircraft.propulsion?.engineCount || 1;
        const hasAdvancedSystems = this.countActiveSystems() > 1;

        // Thrust combination efficiency
        this.integrationCoefficients.thrustCombination = engineCount > 1 ? 0.98 : 1.0;

        // System efficiency combination
        this.integrationCoefficients.efficiencyCombination = hasAdvancedSystems ? 0.93 : 0.98;

        // Weight penalty for multiple systems
        this.integrationCoefficients.weightPenalty = 1.0 + (this.countActiveSystems() - 1) * 0.05;

        // Complexity increases with advanced systems
        this.integrationCoefficients.complexityFactor = 1.0 + (this.countActiveSystems() - 1) * 0.15;

        // Reliability decreases with system complexity
        const reliabilityPenalty = Math.max(0, this.countActiveSystems() - 2) * 0.05;
        this.integrationCoefficients.reliabilityFactor = Math.max(0.7, 1.0 - reliabilityPenalty);

        // Technology level affects all coefficients
        const techFactor = Math.min(1.1, techLevel / 100);
        Object.keys(this.integrationCoefficients).forEach(key => {
            if (key !== 'weightPenalty') {
                this.integrationCoefficients[key] *= techFactor;
            }
        });
    }

    /**
     * Count active propulsion systems
     */
    countActiveSystems() {
        let count = 1; // Base propulsion

        if (afterburnerController.vectoringConfig?.type !== 'none') count++;
        if (thrustVectoringController.vectoringConfig?.type !== 'none') count++;

        return count;
    }

    /**
     * Calculate comprehensive integrated performance
     */
    calculateIntegratedPerformance(conditions = {}) {
        const flightConditions = {
            altitude: 0,
            speed: 0,
            loadFactor: 1,
            throttle: 1.0,
            afterburnerStage: 0,
            vectoringPitch: 0,
            vectoringYaw: 0,
            ...this.flightConditions,
            ...conditions
        };

        // Get base propulsion performance
        const basePropulsion = dynamicPropulsionSystem.calculateDynamicThrust(
            this.currentAircraft,
            flightConditions
        );

        // Get afterburner effects
        const afterburnerStatus = afterburnerController.getStatus();
        const afterburnerEffects = this.calculateAfterburnerIntegration(
            basePropulsion,
            afterburnerStatus,
            flightConditions
        );

        // Get thrust vectoring effects
        const vectoringStatus = thrustVectoringController.getStatus();
        const vectoringEffects = this.calculateVectoringIntegration(
            afterburnerEffects,
            vectoringStatus,
            flightConditions
        );

        // Apply integration coefficients
        const finalPerformance = this.applyIntegrationEffects(vectoringEffects, flightConditions);

        // Calculate flight performance metrics
        const flightPerformance = this.calculateFlightPerformanceMetrics(
            finalPerformance,
            flightConditions
        );

        // Update stored performance data
        this.integratedPerformance = {
            timestamp: Date.now(),
            flightConditions,
            propulsionBreakdown: {
                base: basePropulsion,
                afterburner: afterburnerEffects,
                vectoring: vectoringEffects,
                final: finalPerformance
            },
            flightPerformance,
            systemStatus: this.getSystemStatusSummary(),
            warnings: this.checkPerformanceWarnings(finalPerformance, flightConditions)
        };

        return this.integratedPerformance;
    }

    /**
     * Calculate afterburner integration effects
     */
    calculateAfterburnerIntegration(basePropulsion, afterburnerStatus, conditions) {
        let thrustMultiplier = 1.0;
        let fuelMultiplier = 1.0;
        let temperatureIncrease = 0;

        if (afterburnerStatus.active && afterburnerStatus.stage > 0) {
            thrustMultiplier = afterburnerStatus.thrustMultiplier;
            fuelMultiplier = afterburnerStatus.fuelMultiplier;
            temperatureIncrease = afterburnerStatus.temperature - 20; // Above ambient
        }

        return {
            totalThrust: basePropulsion.totalThrust * thrustMultiplier * this.integrationCoefficients.thrustCombination,
            thrustPerEngine: basePropulsion.thrustPerEngine * thrustMultiplier,
            efficiency: basePropulsion.efficiency / fuelMultiplier * this.integrationCoefficients.efficiencyCombination,
            fuelFlow: basePropulsion.totalThrust * 0.0002 * fuelMultiplier, // Simplified fuel flow
            temperatureIncrease,
            afterburnerActive: afterburnerStatus.active,
            afterburnerStage: afterburnerStatus.stage
        };
    }

    /**
     * Calculate thrust vectoring integration effects
     */
    calculateVectoringIntegration(afterburnerEffects, vectoringStatus, conditions) {
        let thrustEfficiency = 1.0;
        let maneuverabilityBonus = 1.0;
        let dragIncrease = 0;

        if (vectoringStatus.available && vectoringStatus.canOperate) {
            thrustEfficiency = vectoringStatus.performance.thrustEfficiency;
            maneuverabilityBonus = vectoringStatus.performance.maneuverability;
            dragIncrease = vectoringStatus.performance.dragIncrease;
        }

        return {
            totalThrust: afterburnerEffects.totalThrust * thrustEfficiency,
            thrustPerEngine: afterburnerEffects.thrustPerEngine * thrustEfficiency,
            efficiency: afterburnerEffects.efficiency,
            fuelFlow: afterburnerEffects.fuelFlow,
            temperatureIncrease: afterburnerEffects.temperatureIncrease,
            maneuverabilityBonus,
            dragIncrease,
            vectoringActive: vectoringStatus.canOperate,
            afterburnerActive: afterburnerEffects.afterburnerActive,
            afterburnerStage: afterburnerEffects.afterburnerStage,
            controlMoments: vectoringStatus.performance?.momentGeneration || { pitch: 0, yaw: 0, roll: 0 }
        };
    }

    /**
     * Apply final integration effects
     */
    applyIntegrationEffects(vectoringEffects, conditions) {
        // Apply weight penalty
        const effectiveWeight = (this.currentAircraft.performance?.weight?.empty || 5000) *
            this.integrationCoefficients.weightPenalty;

        // Calculate thrust-to-weight ratio
        const thrustToWeight = vectoringEffects.totalThrust / (effectiveWeight * 9.81);

        // Apply reliability factor
        const reliableThrust = vectoringEffects.totalThrust * this.integrationCoefficients.reliabilityFactor;

        return {
            ...vectoringEffects,
            totalThrust: reliableThrust,
            thrustToWeight,
            effectiveWeight,
            integrationEfficiency: this.integrationCoefficients.efficiencyCombination,
            systemReliability: this.integrationCoefficients.reliabilityFactor,
            complexityFactor: this.integrationCoefficients.complexityFactor
        };
    }

    /**
     * Calculate flight performance metrics
     */
    calculateFlightPerformanceMetrics(propulsionData, conditions) {
        const weight = propulsionData.effectiveWeight;
        const thrust = propulsionData.totalThrust;
        const altitude = conditions.altitude || 0;
        const speed = conditions.speed || 0;

        // Performance calculations
        const wingLoading = weight / (this.currentAircraft.performance?.wing?.area || 25); // kg/m²
        const powerLoading = weight / (thrust || 1); // kg/N

        // Flight envelope calculations
        const stallSpeed = Math.sqrt((2 * weight * 9.81) /
            (1.225 * (this.currentAircraft.performance?.wing?.area || 25) * 1.4)); // m/s

        const maxSpeed = this.calculateMaxSpeed(thrust, weight, altitude);
        const ceilingService = this.calculateServiceCeiling(thrust, weight);
        const ceilingAbsolute = this.calculateAbsoluteCeiling(thrust, weight);

        // Range and endurance
        const fuelCapacity = this.currentAircraft.propulsion?.fuelCapacity || 1000;
        const range = this.calculateRange(propulsionData.fuelFlow, fuelCapacity, speed);
        const endurance = this.calculateEndurance(propulsionData.fuelFlow, fuelCapacity);

        // Climb performance
        const climbRate = this.calculateClimbRate(thrust, weight, speed);
        const timeToAltitude = this.calculateTimeToAltitude(climbRate, altitude);

        // Turn performance
        const turnRate = this.calculateTurnRate(speed, conditions.loadFactor || 1);
        const turnRadius = this.calculateTurnRadius(speed, conditions.loadFactor || 1);

        return {
            thrustToWeight: thrust / (weight * 9.81),
            wingLoading,
            powerLoading,
            stallSpeed: stallSpeed * 3.6, // Convert to km/h
            maxSpeed: maxSpeed * 3.6,
            ceilingService,
            ceilingAbsolute,
            range: range / 1000, // Convert to km
            endurance: endurance / 3600, // Convert to hours
            climbRate,
            timeToAltitude,
            turnRate: turnRate * 180 / Math.PI, // Convert to degrees/second
            turnRadius,
            maneuverabilityIndex: propulsionData.maneuverabilityBonus * (thrust / (weight * 9.81)),
            efficiencyIndex: propulsionData.efficiency * 100,
            sustainedLoadFactor: Math.min(12, thrust / (weight * 9.81))
        };
    }

    /**
     * Calculate maximum speed
     */
    calculateMaxSpeed(thrust, weight, altitude) {
        // Simplified drag model
        const atmosphericDensity = 1.225 * Math.exp(-altitude / 8400);
        const dragCoefficient = 0.025;
        const referenceArea = this.currentAircraft.performance?.wing?.area || 25;

        // Solve thrust = drag equation
        const k = 0.5 * atmosphericDensity * dragCoefficient * referenceArea;
        return Math.sqrt(thrust / k); // m/s
    }

    /**
     * Calculate service ceiling
     */
    calculateServiceCeiling(thrust, weight) {
        // Service ceiling where climb rate = 0.5 m/s
        const excessPowerRequired = weight * 0.5; // Watts for 0.5 m/s climb
        const altitudeRatio = Math.log(thrust / excessPowerRequired) / Math.log(1.225 / 0.4);
        return Math.min(25000, altitudeRatio * 8400); // meters
    }

    /**
     * Calculate absolute ceiling
     */
    calculateAbsoluteCeiling(thrust, weight) {
        // Absolute ceiling where excess thrust = 0
        return this.calculateServiceCeiling(thrust, weight) * 1.3; // Approximation
    }

    /**
     * Calculate range
     */
    calculateRange(fuelFlow, fuelCapacity, speed) {
        if (fuelFlow <= 0) return 0;
        const flightTime = fuelCapacity / fuelFlow; // hours
        return speed * flightTime * 3.6; // meters
    }

    /**
     * Calculate endurance
     */
    calculateEndurance(fuelFlow, fuelCapacity) {
        if (fuelFlow <= 0) return 0;
        return fuelCapacity / fuelFlow; // hours
    }

    /**
     * Calculate climb rate
     */
    calculateClimbRate(thrust, weight, speed) {
        const excessPower = (thrust - weight * 0.1) * speed; // Simplified
        return Math.max(0, excessPower / (weight * 9.81)); // m/s
    }

    /**
     * Calculate time to altitude
     */
    calculateTimeToAltitude(climbRate, targetAltitude) {
        if (climbRate <= 0) return Infinity;
        return targetAltitude / climbRate; // seconds
    }

    /**
     * Calculate turn rate
     */
    calculateTurnRate(speed, loadFactor) {
        if (speed <= 0) return 0;
        return (9.81 * Math.sqrt(Math.max(0, loadFactor * loadFactor - 1))) / speed; // rad/s
    }

    /**
     * Calculate turn radius
     */
    calculateTurnRadius(speed, loadFactor) {
        if (loadFactor <= 1) return Infinity;
        return (speed * speed) / (9.81 * Math.sqrt(loadFactor * loadFactor - 1)); // meters
    }

    /**
     * Update flight conditions and recalculate
     */
    updateFlightConditions(newConditions) {
        this.flightConditions = { ...this.flightConditions, ...newConditions };

        // Update subsystems
        afterburnerController.updateConditions(this.flightConditions);
        dynamicPropulsionSystem.updatePropulsionSystem(this.currentAircraft);

        // Recalculate performance
        return this.calculateIntegratedPerformance();
    }

    /**
     * Get active systems status
     */
    getActiveSystemsStatus() {
        return {
            basePropulsion: {
                active: true,
                status: 'operational'
            },
            afterburner: {
                active: afterburnerController.getStatus().active,
                status: afterburnerController.getStatus().statusMessage,
                stage: afterburnerController.getStatus().stage
            },
            thrustVectoring: {
                active: thrustVectoringController.getStatus().canOperate,
                status: thrustVectoringController.getStatus().available ? 'available' : 'unavailable',
                type: thrustVectoringController.getStatus().type
            }
        };
    }

    /**
     * Get system status summary
     */
    getSystemStatusSummary() {
        const systems = this.getActiveSystemsStatus();
        let operationalCount = 0;
        let totalCount = 0;

        Object.values(systems).forEach(system => {
            totalCount++;
            if (system.active || system.status === 'operational') {
                operationalCount++;
            }
        });

        return {
            operationalSystems: operationalCount,
            totalSystems: totalCount,
            systemHealth: operationalCount / totalCount,
            integratedComplexity: this.integrationCoefficients.complexityFactor,
            reliability: this.integrationCoefficients.reliabilityFactor
        };
    }

    /**
     * Check for performance warnings
     */
    checkPerformanceWarnings(performance, conditions) {
        const warnings = [];

        // Thrust-to-weight warnings
        if (performance.thrustToWeight < 0.3) {
            warnings.push({
                type: 'performance',
                severity: 'high',
                message: 'Thrust-to-weight ratio critically low',
                recommendation: 'Consider more powerful engines or weight reduction'
            });
        }

        // Temperature warnings
        if (performance.temperatureIncrease > 800) {
            warnings.push({
                type: 'thermal',
                severity: 'medium',
                message: 'High exhaust gas temperature',
                recommendation: 'Monitor thermal stress on engine components'
            });
        }

        // Fuel flow warnings
        if (performance.fuelFlow > 5.0) {
            warnings.push({
                type: 'fuel',
                severity: 'medium',
                message: 'High fuel consumption rate',
                recommendation: 'Review flight profile for fuel efficiency'
            });
        }

        // System reliability warnings
        if (performance.systemReliability < 0.8) {
            warnings.push({
                type: 'reliability',
                severity: 'medium',
                message: 'System reliability below recommended levels',
                recommendation: 'Simplify configuration or improve maintenance'
            });
        }

        return warnings;
    }

    /**
     * Calculate optimal performance envelope
     */
    calculatePerformanceEnvelope() {
        if (!this.currentAircraft) return null;

        const envelope = {
            altitude: { min: 0, max: 0 },
            speed: { min: 0, max: 0 },
            loadFactor: { min: -3, max: 0 },
            range: { min: 0, max: 0 }
        };

        // Test various conditions to find envelope
        const testConditions = [
            { altitude: 0, speed: 100 },
            { altitude: 5000, speed: 300 },
            { altitude: 10000, speed: 500 },
            { altitude: 15000, speed: 700 },
            { altitude: 20000, speed: 900 }
        ];

        testConditions.forEach(condition => {
            const performance = this.calculateIntegratedPerformance(condition);
            const flightPerf = performance.flightPerformance;

            envelope.altitude.max = Math.max(envelope.altitude.max, flightPerf.ceilingService);
            envelope.speed.max = Math.max(envelope.speed.max, flightPerf.maxSpeed);
            envelope.loadFactor.max = Math.max(envelope.loadFactor.max, flightPerf.sustainedLoadFactor);
            envelope.range.max = Math.max(envelope.range.max, flightPerf.range);
        });

        return envelope;
    }

    /**
     * Generate integration recommendations
     */
    generateIntegrationRecommendations() {
        const recommendations = [];
        const performance = this.integratedPerformance;

        if (!performance.flightPerformance) return recommendations;

        // Performance recommendations
        if (performance.flightPerformance.thrustToWeight < 0.5) {
            recommendations.push({
                category: 'performance',
                priority: 'high',
                title: 'Increase Engine Power',
                description: 'Low thrust-to-weight ratio limits performance',
                suggestions: [
                    'Upgrade to more powerful engines',
                    'Reduce aircraft weight',
                    'Consider afterburner installation'
                ]
            });
        }

        if (performance.flightPerformance.efficiencyIndex < 30) {
            recommendations.push({
                category: 'efficiency',
                priority: 'medium',
                title: 'Improve Propulsive Efficiency',
                description: 'Poor fuel efficiency affects range and economics',
                suggestions: [
                    'Optimize engine operating parameters',
                    'Consider more efficient engine technology',
                    'Review flight profile for efficiency'
                ]
            });
        }

        // System integration recommendations
        if (this.integrationCoefficients.complexityFactor > 2.0) {
            recommendations.push({
                category: 'integration',
                priority: 'medium',
                title: 'Simplify System Configuration',
                description: 'High complexity increases maintenance burden',
                suggestions: [
                    'Remove non-essential systems',
                    'Improve integration between systems',
                    'Invest in maintenance training'
                ]
            });
        }

        return recommendations;
    }

    /**
     * Reset performance data
     */
    resetPerformanceData() {
        this.integratedPerformance = {};
        this.flightConditions = {
            altitude: 0,
            speed: 0,
            loadFactor: 1,
            throttle: 1.0
        };
    }

    /**
     * Export complete performance analysis
     */
    exportPerformanceAnalysis() {
        return {
            timestamp: Date.now(),
            aircraft: {
                name: this.currentAircraft?.name || 'Unknown',
                configuration: this.currentAircraft?.propulsion || {}
            },
            integrationConfig: {
                mode: this.currentMode,
                coefficients: this.integrationCoefficients,
                activeSystems: this.countActiveSystems()
            },
            currentPerformance: this.integratedPerformance,
            performanceEnvelope: this.calculatePerformanceEnvelope(),
            systemStatus: this.getSystemStatusSummary(),
            recommendations: this.generateIntegrationRecommendations(),
            warnings: this.checkPerformanceWarnings(
                this.integratedPerformance.propulsionBreakdown?.final || {},
                this.flightConditions
            )
        };
    }
}

// Create global instance
export const propulsionPerformanceIntegrator = new PropulsionPerformanceIntegrator();

// Make it available globally
window.propulsionPerformanceIntegrator = propulsionPerformanceIntegrator;

console.log('⚡ PropulsionPerformanceIntegrator module loaded');