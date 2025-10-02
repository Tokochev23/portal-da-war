/**
 * Afterburner Controller System - War1954 Aircraft Creator
 *
 * Advanced afterburner control system with thermal management,
 * fuel flow optimization, and thrust control mechanics.
 * Simulates realistic afterburner operation for 1954-era and beyond.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class AfterburnerController {
    constructor() {
        this.initialized = false;
        this.currentAircraft = null;
        this.afterburnerStage = 0; // 0 = off, 1-5 = stages
        this.maxStages = 5;

        // Afterburner operational parameters
        this.operationalLimits = {
            minAltitude: 0,         // meters
            maxAltitude: 18000,     // meters
            minSpeed: 200,          // km/h
            maxSpeed: 2500,         // km/h
            minThrottle: 0.8,       // 80% minimum throttle for afterburner
            maxContinuousTime: 300, // seconds (5 minutes max continuous)
            cooldownTime: 120       // seconds between uses
        };

        // Thermal management system
        this.thermalSystem = {
            currentTemperature: 20,  // °C ambient
            maxOperatingTemp: 1200,  // °C
            criticalTemp: 1400,      // °C
            coolingRate: 2.5,        // °C/second
            heatingRate: 15,         // °C/second per stage
            thermalStress: 0,        // 0-100%
            durabilityLoss: 0        // cumulative damage
        };

        // Fuel injection system
        this.fuelSystem = {
            primaryFuelFlow: 0,      // kg/s
            afterburnerFuelFlow: 0,  // kg/s
            injectorStages: [
                { active: false, fuelFlow: 0.5, thrustMultiplier: 1.15 },  // Stage 1
                { active: false, fuelFlow: 1.0, thrustMultiplier: 1.30 },  // Stage 2
                { active: false, fuelFlow: 1.8, thrustMultiplier: 1.50 },  // Stage 3
                { active: false, fuelFlow: 2.8, thrustMultiplier: 1.75 },  // Stage 4
                { active: false, fuelFlow: 4.2, thrustMultiplier: 2.00 }   // Stage 5 (max)
            ],
            ignitionSystem: {
                ready: true,
                ignitionDelay: 0.5,    // seconds
                lightoffSuccess: 0.95,  // 95% success rate
                flameout: false
            }
        };

        // Performance monitoring
        this.performance = {
            thrustMultiplier: 1.0,
            fuelConsumptionMultiplier: 1.0,
            temperatureRise: 0,
            vibrationLevel: 0,
            nozzlePosition: 0,       // 0-100% (variable geometry)
            exhaustVelocity: 0
        };

        // Operational state
        this.operationalState = {
            active: false,
            startupTime: 0,
            operatingTime: 0,
            lastShutdown: 0,
            faultCodes: [],
            statusMessage: 'Afterburner Ready'
        };

        this.initializeController();
    }

    /**
     * Initialize the afterburner controller
     */
    initializeController() {
        this.resetToIdle();
        this.initialized = true;
        console.log('🔥 AfterburnerController initialized');
    }

    /**
     * Activates afterburner to specified stage
     */
    activateAfterburner(targetStage, aircraft, conditions = {}) {
        if (!this.canActivate(aircraft, conditions)) {
            return this.getActivationFailureReason(aircraft, conditions);
        }

        const previousStage = this.afterburnerStage;
        this.afterburnerStage = Math.min(targetStage, this.maxStages);

        // Update fuel injection stages
        this.updateFuelInjection();

        // Calculate performance effects
        this.updatePerformance(aircraft, conditions);

        // Update thermal system
        this.updateThermalSystem();

        // Update operational state
        this.operationalState.active = this.afterburnerStage > 0;
        this.operationalState.startupTime = Date.now();
        this.operationalState.statusMessage = `Afterburner Stage ${this.afterburnerStage}`;

        // Log stage change
        console.log(`🔥 Afterburner: ${previousStage} → ${this.afterburnerStage}`);

        return {
            success: true,
            stage: this.afterburnerStage,
            thrustIncrease: this.performance.thrustMultiplier,
            fuelIncrease: this.performance.fuelConsumptionMultiplier,
            temperature: this.thermalSystem.currentTemperature
        };
    }

    /**
     * Deactivates afterburner
     */
    deactivateAfterburner() {
        const previousStage = this.afterburnerStage;
        this.afterburnerStage = 0;

        // Reset fuel injection
        this.fuelSystem.injectorStages.forEach(stage => stage.active = false);
        this.fuelSystem.afterburnerFuelFlow = 0;

        // Update performance
        this.performance.thrustMultiplier = 1.0;
        this.performance.fuelConsumptionMultiplier = 1.0;

        // Update operational state
        this.operationalState.active = false;
        this.operationalState.lastShutdown = Date.now();
        this.operationalState.statusMessage = 'Afterburner Off - Cooling';

        console.log(`🔥 Afterburner deactivated from stage ${previousStage}`);

        return {
            success: true,
            previousStage,
            cooldownRequired: this.operationalLimits.cooldownTime
        };
    }

    /**
     * Checks if afterburner can be activated
     */
    canActivate(aircraft, conditions) {
        const { altitude = 0, speed = 0, throttle = 0 } = conditions;

        // Check basic operational limits
        if (altitude > this.operationalLimits.maxAltitude) return false;
        if (speed < this.operationalLimits.minSpeed) return false;
        if (throttle < this.operationalLimits.minThrottle) return false;

        // Check thermal state
        if (this.thermalSystem.currentTemperature > this.thermalSystem.maxOperatingTemp) return false;

        // Check cooldown period
        const timeSinceShutdown = (Date.now() - this.operationalState.lastShutdown) / 1000;
        if (timeSinceShutdown < this.operationalLimits.cooldownTime) return false;

        // Check engine compatibility
        if (!this.hasAfterburnerCapability(aircraft)) return false;

        // Check fuel availability
        const currentFuelFlow = this.fuelSystem.primaryFuelFlow;
        if (currentFuelFlow <= 0) return false;

        return true;
    }

    /**
     * Gets reason for activation failure
     */
    getActivationFailureReason(aircraft, conditions) {
        const { altitude = 0, speed = 0, throttle = 0 } = conditions;

        if (altitude > this.operationalLimits.maxAltitude) {
            return { success: false, reason: 'Altitude too high for afterburner operation' };
        }
        if (speed < this.operationalLimits.minSpeed) {
            return { success: false, reason: 'Airspeed too low for safe afterburner ignition' };
        }
        if (throttle < this.operationalLimits.minThrottle) {
            return { success: false, reason: 'Throttle must be at 80% or higher' };
        }
        if (this.thermalSystem.currentTemperature > this.thermalSystem.maxOperatingTemp) {
            return { success: false, reason: 'Engine temperature too high' };
        }

        const timeSinceShutdown = (Date.now() - this.operationalState.lastShutdown) / 1000;
        if (timeSinceShutdown < this.operationalLimits.cooldownTime) {
            return {
                success: false,
                reason: `Cooldown period: ${Math.ceil(this.operationalLimits.cooldownTime - timeSinceShutdown)}s remaining`
            };
        }

        if (!this.hasAfterburnerCapability(aircraft)) {
            return { success: false, reason: 'Engine does not support afterburner operation' };
        }

        return { success: false, reason: 'Unknown restriction' };
    }

    /**
     * Updates fuel injection system
     */
    updateFuelInjection() {
        this.fuelSystem.afterburnerFuelFlow = 0;

        // Activate stages up to current level
        for (let i = 0; i < this.afterburnerStage; i++) {
            this.fuelSystem.injectorStages[i].active = true;
            this.fuelSystem.afterburnerFuelFlow += this.fuelSystem.injectorStages[i].fuelFlow;
        }

        // Deactivate higher stages
        for (let i = this.afterburnerStage; i < this.maxStages; i++) {
            this.fuelSystem.injectorStages[i].active = false;
        }
    }

    /**
     * Updates performance calculations
     */
    updatePerformance(aircraft, conditions) {
        if (this.afterburnerStage === 0) {
            this.performance.thrustMultiplier = 1.0;
            this.performance.fuelConsumptionMultiplier = 1.0;
            return;
        }

        // Calculate thrust multiplier from active stages
        let thrustMultiplier = 1.0;
        let fuelMultiplier = 1.0;

        for (let i = 0; i < this.afterburnerStage; i++) {
            const stage = this.fuelSystem.injectorStages[i];
            if (stage.active) {
                thrustMultiplier = stage.thrustMultiplier;
                fuelMultiplier += stage.fuelFlow / this.fuelSystem.primaryFuelFlow;
            }
        }

        // Apply atmospheric effects
        const { altitude = 0, speed = 0 } = conditions;
        const atmEffects = this.calculateAtmosphericEffects(altitude, speed);

        thrustMultiplier *= atmEffects.thrustModifier;
        fuelMultiplier *= atmEffects.fuelModifier;

        // Apply thermal derating
        const thermalDerating = this.calculateThermalDerating();
        thrustMultiplier *= thermalDerating;

        this.performance.thrustMultiplier = thrustMultiplier;
        this.performance.fuelConsumptionMultiplier = fuelMultiplier;

        // Update nozzle position for optimal performance
        this.performance.nozzlePosition = this.calculateOptimalNozzlePosition();
    }

    /**
     * Updates thermal management system
     */
    updateThermalSystem() {
        const targetTemp = this.calculateTargetTemperature();
        const tempDifference = targetTemp - this.thermalSystem.currentTemperature;

        // Temperature change rate
        const changeRate = tempDifference > 0 ?
            this.thermalSystem.heatingRate :
            this.thermalSystem.coolingRate;

        // Update temperature (simplified for demo)
        this.thermalSystem.currentTemperature += Math.sign(tempDifference) * changeRate * 0.1;

        // Calculate thermal stress
        const tempRatio = this.thermalSystem.currentTemperature / this.thermalSystem.maxOperatingTemp;
        this.thermalSystem.thermalStress = Math.min(100, tempRatio * 100);

        // Accumulate durability loss if over-temperature
        if (this.thermalSystem.currentTemperature > this.thermalSystem.maxOperatingTemp) {
            this.thermalSystem.durabilityLoss += 0.1;
        }
    }

    /**
     * Calculates target operating temperature
     */
    calculateTargetTemperature() {
        const baseTemp = 20; // Ambient
        const stageTemp = this.afterburnerStage * 200; // 200°C per stage
        return baseTemp + stageTemp;
    }

    /**
     * Calculates atmospheric effects on afterburner performance
     */
    calculateAtmosphericEffects(altitude, speed) {
        // Simplified atmospheric model
        const pressureRatio = Math.exp(-altitude / 8400); // Barometric formula
        const densityRatio = pressureRatio;

        // Afterburner performance improves with altitude (less backpressure)
        const thrustModifier = 1 + (1 - pressureRatio) * 0.2;

        // Fuel mixing efficiency affected by air density
        const fuelModifier = 0.8 + densityRatio * 0.2;

        return { thrustModifier, fuelModifier, pressureRatio, densityRatio };
    }

    /**
     * Calculates thermal derating factor
     */
    calculateThermalDerating() {
        if (this.thermalSystem.currentTemperature <= this.thermalSystem.maxOperatingTemp) {
            return 1.0;
        }

        // Linear derating above max operating temperature
        const overtemp = this.thermalSystem.currentTemperature - this.thermalSystem.maxOperatingTemp;
        const criticalRange = this.thermalSystem.criticalTemp - this.thermalSystem.maxOperatingTemp;

        const deratingFactor = 1.0 - (overtemp / criticalRange) * 0.5;
        return Math.max(0.3, deratingFactor);
    }

    /**
     * Calculates optimal nozzle position
     */
    calculateOptimalNozzlePosition() {
        // Variable geometry nozzle position based on afterburner stage
        const basePosition = 30; // 30% for dry thrust
        const additionalOpening = this.afterburnerStage * 15; // 15% per stage

        return Math.min(100, basePosition + additionalOpening);
    }

    /**
     * Checks if aircraft has afterburner capability
     */
    hasAfterburnerCapability(aircraft) {
        if (!aircraft.propulsion?.engines?.length) return false;

        const engineId = aircraft.propulsion.engines[0];
        const engineData = this.getEngineData(engineId);

        return engineData && (
            engineData.afterburner_thrust > 0 ||
            engineData.features?.includes('afterburner') ||
            ['turbojet', 'turbofan'].includes(engineData.type)
        );
    }

    /**
     * Gets engine data from global components
     */
    getEngineData(engineId) {
        if (!engineId || !window.AIRCRAFT_COMPONENTS?.aircraft_engines) return null;
        return window.AIRCRAFT_COMPONENTS.aircraft_engines[engineId];
    }

    /**
     * Updates controller with new flight conditions
     */
    updateConditions(conditions) {
        // Update primary fuel flow
        this.fuelSystem.primaryFuelFlow = conditions.fuelFlow || 0;

        // Update operational time
        if (this.operationalState.active) {
            this.operationalState.operatingTime =
                (Date.now() - this.operationalState.startupTime) / 1000;

            // Check for operational limits
            if (this.operationalState.operatingTime > this.operationalLimits.maxContinuousTime) {
                this.addFaultCode('MAX_TIME_EXCEEDED');
                this.deactivateAfterburner();
            }
        }

        // Update thermal system
        this.updateThermalSystem();
    }

    /**
     * Adds fault code to system
     */
    addFaultCode(code) {
        if (!this.operationalState.faultCodes.includes(code)) {
            this.operationalState.faultCodes.push(code);
            console.warn(`🔥 Afterburner fault: ${code}`);
        }
    }

    /**
     * Clears fault codes
     */
    clearFaultCodes() {
        this.operationalState.faultCodes = [];
    }

    /**
     * Resets controller to idle state
     */
    resetToIdle() {
        this.afterburnerStage = 0;
        this.fuelSystem.injectorStages.forEach(stage => stage.active = false);
        this.fuelSystem.afterburnerFuelFlow = 0;
        this.performance.thrustMultiplier = 1.0;
        this.performance.fuelConsumptionMultiplier = 1.0;
        this.thermalSystem.currentTemperature = 20;
        this.operationalState.active = false;
        this.operationalState.faultCodes = [];
        this.operationalState.statusMessage = 'Afterburner Ready';
    }

    /**
     * Gets current status for UI display
     */
    getStatus() {
        return {
            active: this.operationalState.active,
            stage: this.afterburnerStage,
            maxStages: this.maxStages,
            thrustMultiplier: this.performance.thrustMultiplier,
            fuelMultiplier: this.performance.fuelConsumptionMultiplier,
            temperature: Math.round(this.thermalSystem.currentTemperature),
            thermalStress: Math.round(this.thermalSystem.thermalStress),
            nozzlePosition: Math.round(this.performance.nozzlePosition),
            operatingTime: Math.round(this.operationalState.operatingTime),
            statusMessage: this.operationalState.statusMessage,
            faultCodes: this.operationalState.faultCodes,
            canActivate: this.afterburnerStage < this.maxStages,
            canDeactivate: this.afterburnerStage > 0
        };
    }

    /**
     * Exports afterburner analysis data
     */
    exportAnalysis() {
        return {
            timestamp: Date.now(),
            configuration: {
                maxStages: this.maxStages,
                operationalLimits: this.operationalLimits
            },
            currentState: this.getStatus(),
            thermalData: this.thermalSystem,
            fuelSystemData: this.fuelSystem,
            performanceData: this.performance,
            operationalHistory: {
                totalOperatingTime: this.operationalState.operatingTime,
                durabilityLoss: this.thermalSystem.durabilityLoss,
                faultHistory: this.operationalState.faultCodes
            }
        };
    }
}

// Create global instance
export const afterburnerController = new AfterburnerController();

// Make it available globally
window.afterburnerController = afterburnerController;

console.log('🔥 AfterburnerController module loaded');