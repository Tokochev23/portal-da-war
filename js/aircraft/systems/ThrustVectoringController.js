/**
 * Thrust Vectoring Controller System - War1954 Aircraft Creator
 *
 * Advanced thrust vectoring control system with multi-axis control,
 * stability augmentation, and super-maneuverability capabilities.
 * Supports both 2D and 3D thrust vectoring for advanced aircraft.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class ThrustVectoringController {
    constructor() {
        this.initialized = false;
        this.currentAircraft = null;
        this.active = false;

        // Thrust vectoring configuration
        this.vectoringConfig = {
            type: 'none',           // 'none', '2d', '3d', 'differential'
            maxDeflection: 20,      // degrees
            responseTime: 0.5,      // seconds
            authority: 1.0,         // 0-1 (authority over control surfaces)
            asymmetricCapable: false
        };

        // Current vectoring state
        this.vectoringState = {
            pitch: 0,               // degrees (-max to +max)
            yaw: 0,                 // degrees (-max to +max)
            targetPitch: 0,         // commanded pitch deflection
            targetYaw: 0,           // commanded yaw deflection
            actualPitch: 0,         // actual nozzle position
            actualYaw: 0,           // actual nozzle position
            leftEngine: 0,          // differential vectoring
            rightEngine: 0          // differential vectoring
        };

        // Control modes
        this.controlModes = {
            current: 'manual',      // 'manual', 'stability', 'performance', 'combat'
            manual: {
                description: 'Manual pilot control',
                stabilityAugmentation: false,
                autoTrim: false,
                responseGain: 1.0
            },
            stability: {
                description: 'Stability augmentation mode',
                stabilityAugmentation: true,
                autoTrim: true,
                responseGain: 0.7
            },
            performance: {
                description: 'Performance optimization mode',
                stabilityAugmentation: true,
                autoTrim: true,
                responseGain: 0.5,
                trimForEfficiency: true
            },
            combat: {
                description: 'Combat super-maneuverability mode',
                stabilityAugmentation: false,
                autoTrim: false,
                responseGain: 1.5,
                aggressiveResponse: true
            }
        };

        // Performance effects
        this.performanceEffects = {
            thrustEfficiency: 1.0,   // Forward thrust efficiency
            maneuverability: 1.0,    // Maneuverability enhancement
            dragIncrease: 0,         // Additional drag from vectoring
            momentGeneration: {      // Control moments generated
                pitch: 0,            // Nm
                yaw: 0,              // Nm
                roll: 0              // Nm (for 3D vectoring)
            }
        };

        // Physical constraints
        this.physicalLimits = {
            deflectionRate: 30,      // degrees/second
            maxGLoad: 12,           // G-forces that can be sustained
            minSpeed: 100,          // km/h minimum for effective control
            maxSpeed: 2000,         // km/h maximum operating speed
            altitudeLimit: 20000,   // meters
            powerRequirement: 50    // kW hydraulic power required
        };

        // Technology factors
        this.technologyFactors = {
            baseYear: 1980,         // First practical thrust vectoring
            techLevel: 50,          // Current technology level
            responsiveness: 1.0,    // Technology-dependent responsiveness
            reliability: 0.9,       // System reliability
            precision: 0.95         // Control precision
        };

        // System health
        this.systemHealth = {
            hydraulicPressure: 100, // % of nominal
            actuatorHealth: [100, 100], // % health per actuator
            sensorHealth: 100,      // % sensor accuracy
            computerHealth: 100,    // % flight computer health
            faultCodes: [],
            lastMaintenance: Date.now()
        };

        this.initializeController();
    }

    /**
     * Initialize the thrust vectoring controller
     */
    initializeController() {
        this.resetToNeutral();
        this.initialized = true;
        console.log('🎯 ThrustVectoringController initialized');
    }

    /**
     * Configure thrust vectoring system for aircraft
     */
    configureSystem(aircraft, techLevel = 50) {
        if (!aircraft.propulsion?.engines?.length) {
            this.vectoringConfig.type = 'none';
            return false;
        }

        const engineId = aircraft.propulsion.engines[0];
        const engineData = this.getEngineData(engineId);

        if (!engineData) {
            this.vectoringConfig.type = 'none';
            return false;
        }

        // Determine vectoring capability
        this.vectoringConfig = this.determineVectoringCapability(engineData, techLevel);
        this.technologyFactors.techLevel = techLevel;

        // Update technology-dependent factors
        this.updateTechnologyFactors();

        console.log(`🎯 Configured ${this.vectoringConfig.type} thrust vectoring`);
        return this.vectoringConfig.type !== 'none';
    }

    /**
     * Determine vectoring capability based on engine and tech level
     */
    determineVectoringCapability(engineData, techLevel) {
        // Check explicit thrust vectoring capability
        if (engineData.features?.includes('thrust_vectoring') ||
            engineData.advancedFeatures?.thrustVectoring) {

            // Technology level determines sophistication
            if (techLevel >= 85) {
                return {
                    type: '3d',
                    maxDeflection: 20,
                    responseTime: 0.3,
                    authority: 0.9,
                    asymmetricCapable: true
                };
            } else if (techLevel >= 75) {
                return {
                    type: '2d',
                    maxDeflection: 15,
                    responseTime: 0.5,
                    authority: 0.7,
                    asymmetricCapable: false
                };
            } else if (techLevel >= 65) {
                return {
                    type: '2d',
                    maxDeflection: 10,
                    responseTime: 0.8,
                    authority: 0.5,
                    asymmetricCapable: false
                };
            }
        }

        // Check for differential thrust (twin-engine aircraft)
        if (aircraft.propulsion.engineCount >= 2 && techLevel >= 60) {
            return {
                type: 'differential',
                maxDeflection: 5, // degrees equivalent
                responseTime: 0.2,
                authority: 0.4,
                asymmetricCapable: true
            };
        }

        return {
            type: 'none',
            maxDeflection: 0,
            responseTime: 0,
            authority: 0,
            asymmetricCapable: false
        };
    }

    /**
     * Update technology-dependent factors
     */
    updateTechnologyFactors() {
        const techLevel = this.technologyFactors.techLevel;
        const baseYear = this.technologyFactors.baseYear;

        // Responsiveness improves with technology
        this.technologyFactors.responsiveness = Math.min(2.0, 0.5 + (techLevel - 60) * 0.025);

        // Reliability improves with technology
        this.technologyFactors.reliability = Math.min(0.99, 0.7 + (techLevel - 50) * 0.006);

        // Precision improves with technology
        this.technologyFactors.precision = Math.min(0.99, 0.8 + (techLevel - 60) * 0.005);
    }

    /**
     * Command thrust vector deflection
     */
    commandDeflection(pitchCommand = 0, yawCommand = 0, mode = null) {
        if (!this.canOperate()) {
            return { success: false, reason: 'System not operational' };
        }

        // Apply control mode modifications
        const activeMode = mode || this.controlModes.current;
        const modeConfig = this.controlModes[activeMode];

        // Apply gain and limits
        let targetPitch = this.applyLimits(pitchCommand * modeConfig.responseGain);
        let targetYaw = this.applyLimits(yawCommand * modeConfig.responseGain);

        // Apply stability augmentation if enabled
        if (modeConfig.stabilityAugmentation) {
            const stabAug = this.calculateStabilityAugmentation();
            targetPitch += stabAug.pitch;
            targetYaw += stabAug.yaw;
        }

        // Update target deflections
        this.vectoringState.targetPitch = targetPitch;
        this.vectoringState.targetYaw = targetYaw;

        // Calculate actuator movements
        this.updateActuatorPositions();

        // Calculate performance effects
        this.calculatePerformanceEffects();

        return {
            success: true,
            targetPitch,
            targetYaw,
            actualPitch: this.vectoringState.actualPitch,
            actualYaw: this.vectoringState.actualYaw,
            thrustEfficiency: this.performanceEffects.thrustEfficiency,
            moments: this.performanceEffects.momentGeneration
        };
    }

    /**
     * Apply deflection limits
     */
    applyLimits(deflection) {
        return Math.max(-this.vectoringConfig.maxDeflection,
                       Math.min(this.vectoringConfig.maxDeflection, deflection));
    }

    /**
     * Calculate stability augmentation commands
     */
    calculateStabilityAugmentation() {
        // Simplified stability augmentation
        // In reality, this would use aircraft state (angular rates, accelerations, etc.)

        return {
            pitch: 0, // Would be calculated from pitch rate damping
            yaw: 0    // Would be calculated from yaw rate damping
        };
    }

    /**
     * Update actuator positions based on commands
     */
    updateActuatorPositions() {
        const deltaTime = 0.1; // Simulation time step
        const maxRate = this.physicalLimits.deflectionRate * this.technologyFactors.responsiveness;

        // Pitch actuator
        const pitchError = this.vectoringState.targetPitch - this.vectoringState.actualPitch;
        const pitchRate = Math.sign(pitchError) * Math.min(maxRate * deltaTime, Math.abs(pitchError));
        this.vectoringState.actualPitch += pitchRate;

        // Yaw actuator (for 3D systems)
        if (this.vectoringConfig.type === '3d') {
            const yawError = this.vectoringState.targetYaw - this.vectoringState.actualYaw;
            const yawRate = Math.sign(yawError) * Math.min(maxRate * deltaTime, Math.abs(yawError));
            this.vectoringState.actualYaw += yawRate;
        }

        // Differential thrust (for twin-engine)
        if (this.vectoringConfig.type === 'differential') {
            this.vectoringState.leftEngine = -this.vectoringState.targetYaw / 2;
            this.vectoringState.rightEngine = this.vectoringState.targetYaw / 2;
        }

        // Apply precision limitations
        const precisionError = (1 - this.technologyFactors.precision) * 2; // ±2 degrees max error
        this.vectoringState.actualPitch += (Math.random() - 0.5) * precisionError;
        this.vectoringState.actualYaw += (Math.random() - 0.5) * precisionError;
    }

    /**
     * Calculate performance effects of thrust vectoring
     */
    calculatePerformanceEffects() {
        const pitchAngle = Math.abs(this.vectoringState.actualPitch) * Math.PI / 180;
        const yawAngle = Math.abs(this.vectoringState.actualYaw) * Math.PI / 180;

        // Forward thrust efficiency (cosine loss)
        this.performanceEffects.thrustEfficiency = Math.cos(pitchAngle) * Math.cos(yawAngle);

        // Drag increase from nozzle deflection
        this.performanceEffects.dragIncrease =
            (Math.sin(pitchAngle) + Math.sin(yawAngle)) * 0.1; // 10% max drag increase

        // Maneuverability enhancement
        const totalDeflection = Math.sqrt(pitchAngle * pitchAngle + yawAngle * yawAngle);
        this.performanceEffects.maneuverability = 1.0 + totalDeflection * 2.0; // Up to 200% increase

        // Control moments (simplified)
        const thrustMagnitude = 50000; // N - typical fighter engine
        const momentArm = 5; // meters - typical distance from CG

        this.performanceEffects.momentGeneration = {
            pitch: thrustMagnitude * Math.sin(pitchAngle) * momentArm,
            yaw: thrustMagnitude * Math.sin(yawAngle) * momentArm,
            roll: 0 // Would be calculated for asymmetric deflection
        };
    }

    /**
     * Set control mode
     */
    setControlMode(mode) {
        if (!this.controlModes[mode]) {
            return { success: false, reason: 'Invalid control mode' };
        }

        this.controlModes.current = mode;
        console.log(`🎯 Thrust vectoring mode: ${mode}`);

        return {
            success: true,
            mode,
            description: this.controlModes[mode].description
        };
    }

    /**
     * Execute super-maneuver
     */
    executeSuperManeuver(maneuverType, intensity = 1.0) {
        if (this.vectoringConfig.type === 'none' || this.controlModes.current !== 'combat') {
            return { success: false, reason: 'Super-maneuvers require combat mode with thrust vectoring' };
        }

        let pitchCommand = 0;
        let yawCommand = 0;

        switch (maneuverType) {
            case 'cobra':
                pitchCommand = this.vectoringConfig.maxDeflection * intensity;
                break;
            case 'kulbit':
                pitchCommand = this.vectoringConfig.maxDeflection * intensity;
                break;
            case 'pugachev':
                yawCommand = this.vectoringConfig.maxDeflection * intensity * 0.5;
                pitchCommand = this.vectoringConfig.maxDeflection * intensity * 0.8;
                break;
            case 'tailslide':
                pitchCommand = -this.vectoringConfig.maxDeflection * intensity;
                break;
            default:
                return { success: false, reason: 'Unknown maneuver type' };
        }

        return this.commandDeflection(pitchCommand, yawCommand, 'combat');
    }

    /**
     * Check if system can operate
     */
    canOperate() {
        return this.vectoringConfig.type !== 'none' &&
               this.systemHealth.hydraulicPressure > 50 &&
               this.systemHealth.computerHealth > 70 &&
               this.systemHealth.faultCodes.length === 0;
    }

    /**
     * Update system health
     */
    updateSystemHealth() {
        // Simulate system degradation
        const operatingTime = (Date.now() - this.systemHealth.lastMaintenance) / (1000 * 60 * 60); // hours

        // Gradual degradation
        this.systemHealth.hydraulicPressure = Math.max(60, 100 - operatingTime * 0.1);
        this.systemHealth.actuatorHealth[0] = Math.max(70, 100 - operatingTime * 0.05);
        this.systemHealth.actuatorHealth[1] = Math.max(70, 100 - operatingTime * 0.05);

        // Random faults (very low probability)
        if (Math.random() < 0.0001) {
            this.addFault('HYDRAULIC_PRESSURE_LOW');
        }
    }

    /**
     * Add system fault
     */
    addFault(faultCode) {
        if (!this.systemHealth.faultCodes.includes(faultCode)) {
            this.systemHealth.faultCodes.push(faultCode);
            console.warn(`🎯 Thrust vectoring fault: ${faultCode}`);
        }
    }

    /**
     * Clear system fault
     */
    clearFault(faultCode) {
        const index = this.systemHealth.faultCodes.indexOf(faultCode);
        if (index > -1) {
            this.systemHealth.faultCodes.splice(index, 1);
        }
    }

    /**
     * Reset to neutral position
     */
    resetToNeutral() {
        this.vectoringState = {
            pitch: 0,
            yaw: 0,
            targetPitch: 0,
            targetYaw: 0,
            actualPitch: 0,
            actualYaw: 0,
            leftEngine: 0,
            rightEngine: 0
        };

        this.performanceEffects = {
            thrustEfficiency: 1.0,
            maneuverability: 1.0,
            dragIncrease: 0,
            momentGeneration: { pitch: 0, yaw: 0, roll: 0 }
        };
    }

    /**
     * Get engine data from global components
     */
    getEngineData(engineId) {
        if (!engineId || !window.AIRCRAFT_COMPONENTS?.aircraft_engines) return null;
        return window.AIRCRAFT_COMPONENTS.aircraft_engines[engineId];
    }

    /**
     * Get current status for UI display
     */
    getStatus() {
        return {
            active: this.active,
            type: this.vectoringConfig.type,
            available: this.vectoringConfig.type !== 'none',
            canOperate: this.canOperate(),

            deflections: {
                targetPitch: this.vectoringState.targetPitch,
                targetYaw: this.vectoringState.targetYaw,
                actualPitch: this.vectoringState.actualPitch,
                actualYaw: this.vectoringState.actualYaw,
                maxDeflection: this.vectoringConfig.maxDeflection
            },

            performance: {
                thrustEfficiency: this.performanceEffects.thrustEfficiency,
                maneuverability: this.performanceEffects.maneuverability,
                dragIncrease: this.performanceEffects.dragIncrease,
                momentGeneration: this.performanceEffects.momentGeneration
            },

            controlMode: {
                current: this.controlModes.current,
                description: this.controlModes[this.controlModes.current].description
            },

            systemHealth: {
                hydraulicPressure: Math.round(this.systemHealth.hydraulicPressure),
                actuatorHealth: this.systemHealth.actuatorHealth.map(h => Math.round(h)),
                sensorHealth: Math.round(this.systemHealth.sensorHealth),
                faultCodes: this.systemHealth.faultCodes
            },

            technology: {
                techLevel: this.technologyFactors.techLevel,
                responsiveness: this.technologyFactors.responsiveness,
                reliability: this.technologyFactors.reliability,
                precision: this.technologyFactors.precision
            }
        };
    }

    /**
     * Export thrust vectoring analysis
     */
    exportAnalysis() {
        return {
            timestamp: Date.now(),
            configuration: this.vectoringConfig,
            currentState: this.vectoringState,
            performanceEffects: this.performanceEffects,
            systemHealth: this.systemHealth,
            technologyFactors: this.technologyFactors,
            capabilities: {
                superManeuvers: this.vectoringConfig.type !== 'none' && this.vectoringConfig.maxDeflection > 10,
                stabilityAugmentation: true,
                differentialThrust: this.vectoringConfig.type === 'differential'
            }
        };
    }
}

// Create global instance
export const thrustVectoringController = new ThrustVectoringController();

// Make it available globally
window.thrustVectoringController = thrustVectoringController;

console.log('🎯 ThrustVectoringController module loaded');