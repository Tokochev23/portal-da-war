/**
 * Avionics Component - War1954 Aircraft Creator
 *
 * ECS component that manages aircraft avionics systems including radar,
 * navigation, communication, flight control systems, and their interactions.
 * Handles dependencies, power requirements, and performance effects.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class AvionicsComponent {
    constructor() {
        // Primary avionics systems
        this.systems = {
            radar: null,              // Radar system ID
            navigation: null,         // Navigation system ID
            communication: null,      // Communication system ID
            flightControl: null,      // Flight control system ID
            fireControl: null,        // Fire control system ID
            countermeasures: null,    // ECM/ECCM system ID
            autopilot: null,         // Autopilot system ID
            instruments: null         // Instrument package ID
        };

        // Installed avionics (array of system IDs)
        this.installedSystems = [];

        // System configurations
        this.configurations = {
            radarMode: 'air_to_air',     // 'air_to_air', 'air_to_ground', 'navigation'
            navigationMode: 'manual',    // 'manual', 'autopilot', 'coupled'
            communicationFreq: 'uhf',    // 'hf', 'vhf', 'uhf'
            autopilotMode: 'off',        // 'off', 'attitude', 'altitude', 'navigation'
            ecmMode: 'passive'           // 'off', 'passive', 'active'
        };

        // Power and weight summary
        this.powerRequirements = {
            totalPowerDraw: 0,           // kW
            primaryBusPower: 0,          // kW
            secondaryBusPower: 0,        // kW
            batteryBackupTime: 0,        // minutes
            generatorCapacity: 0         // kW
        };

        this.physicalCharacteristics = {
            totalWeight: 0,              // kg
            totalVolume: 0,              // cubic meters
            coolingRequirement: 0,       // kW thermal
            vibrationSensitivity: 0,     // 0-10 scale
            temperatureRange: {
                min: -40,                // Celsius
                max: 70                  // Celsius
            }
        };

        // System dependencies and interactions
        this.dependencies = new Map();   // system -> [required systems]
        this.conflicts = new Map();      // system -> [conflicting systems]
        this.synergies = new Map();      // system -> [synergistic systems]

        // Operational characteristics
        this.reliability = {
            overallMTBF: 0,              // hours (Mean Time Between Failures)
            criticalSystemsMTBF: 0,      // hours
            redundancyLevel: 0,          // 0-100%
            maintenanceComplexity: 0     // 0-10 scale
        };

        this.capabilities = {
            allWeatherCapable: false,     // IFR operations
            nightCapable: false,          // Night operations
            precisionApproach: false,     // ILS/precision approach
            automaticFlight: false,       // Full autopilot
            advancedNavigation: false,    // Inertial/GPS navigation
            electronicWarfare: false,     // ECM/ECCM capability
            dataLink: false,              // Tactical data link
            computerAssisted: false       // Flight management computer
        };

        // Performance effects
        this.performanceModifiers = {
            pilotWorkload: 1.0,          // Multiplier (lower = less workload)
            situationalAwareness: 1.0,   // Multiplier (higher = better awareness)
            weaponAccuracy: 1.0,         // Multiplier
            navigationAccuracy: 1.0,     // Multiplier
            communicationRange: 1.0,     // Multiplier
            survivalProbability: 1.0,    // Multiplier in combat
            weatherLimitations: 1.0,     // Multiplier (lower = fewer limitations)
            maintenanceRequirement: 1.0  // Multiplier
        };

        // Failure modes and degraded operations
        this.failureModes = {
            primaryPowerFailure: false,
            hydraulicFailure: false,
            coolingSystemFailure: false,
            antennaFailure: false,
            computerFailure: false,
            sensorFailure: false
        };

        this.degradedModes = {
            emergencyPowerOnly: false,
            manualReversion: false,
            limitedCapability: false,
            backupSystemsOnly: false
        };

        // Technology integration
        this.technologyLevel = {
            vacuum_tubes: 0,             // % of systems using vacuum tubes
            transistors: 0,              // % of systems using transistors
            integrated_circuits: 0,      // % of systems using ICs
            analog_computers: 0,         // % using analog computers
            digital_computers: 0,        // % using digital computers
            overall_tech_rating: 0       // 0-100 overall technology rating
        };

        console.log('📡 AvionicsComponent created');
    }

    /**
     * Installs an avionics system
     * @param {string} systemId - System identifier
     * @param {string} systemType - Type of system (radar, navigation, etc.)
     * @returns {boolean} Success status
     */
    installSystem(systemId, systemType) {
        if (!systemId || !systemType) return false;

        // Check if system is already installed
        if (this.installedSystems.includes(systemId)) {
            console.warn(`⚠️ System ${systemId} already installed`);
            return false;
        }

        // Get system data
        const systemData = this.getSystemData(systemId);
        if (!systemData) {
            console.error(`❌ System data not found for ${systemId}`);
            return false;
        }

        // Check dependencies
        if (!this.checkDependencies(systemId, systemData)) {
            console.warn(`⚠️ Dependencies not met for ${systemId}`);
            return false;
        }

        // Check conflicts
        if (this.checkConflicts(systemId, systemData)) {
            console.warn(`⚠️ System conflicts detected for ${systemId}`);
            return false;
        }

        // Install the system
        this.systems[systemType] = systemId;
        this.installedSystems.push(systemId);

        // Update component characteristics
        this.updateComponentCharacteristics();

        console.log(`✅ Installed ${systemType} system: ${systemData.name}`);
        return true;
    }

    /**
     * Removes an avionics system
     * @param {string} systemId - System identifier
     * @returns {boolean} Success status
     */
    removeSystem(systemId) {
        if (!systemId) return false;

        const index = this.installedSystems.indexOf(systemId);
        if (index === -1) {
            console.warn(`⚠️ System ${systemId} not installed`);
            return false;
        }

        // Remove from systems mapping
        Object.keys(this.systems).forEach(type => {
            if (this.systems[type] === systemId) {
                this.systems[type] = null;
            }
        });

        // Remove from installed systems
        this.installedSystems.splice(index, 1);

        // Check if removal breaks dependencies for other systems
        this.validateRemainingDependencies();

        // Update component characteristics
        this.updateComponentCharacteristics();

        console.log(`🗑️ Removed system: ${systemId}`);
        return true;
    }

    /**
     * Configures system operation mode
     * @param {string} systemType - Type of system
     * @param {string} mode - Operation mode
     */
    configureSystem(systemType, mode) {
        if (!this.systems[systemType]) {
            console.warn(`⚠️ ${systemType} system not installed`);
            return false;
        }

        if (systemType === 'radar') {
            this.configurations.radarMode = mode;
        } else if (systemType === 'navigation') {
            this.configurations.navigationMode = mode;
        } else if (systemType === 'autopilot') {
            this.configurations.autopilotMode = mode;
        } else if (systemType === 'countermeasures') {
            this.configurations.ecmMode = mode;
        }

        // Update performance modifiers based on configuration
        this.updatePerformanceModifiers();

        console.log(`⚙️ Configured ${systemType} to ${mode}`);
        return true;
    }

    /**
     * Updates component characteristics based on installed systems
     */
    updateComponentCharacteristics() {
        // Reset characteristics
        this.powerRequirements.totalPowerDraw = 0;
        this.physicalCharacteristics.totalWeight = 0;
        this.physicalCharacteristics.totalVolume = 0;
        this.physicalCharacteristics.coolingRequirement = 0;

        let totalMTBF = 0;
        let systemCount = 0;
        let totalTechRating = 0;

        // Calculate accumulated characteristics
        this.installedSystems.forEach(systemId => {
            const systemData = this.getSystemData(systemId);
            if (systemData) {
                this.powerRequirements.totalPowerDraw += systemData.powerDraw || 0;
                this.physicalCharacteristics.totalWeight += systemData.weight || 0;
                this.physicalCharacteristics.totalVolume += systemData.volume || 0;
                this.physicalCharacteristics.coolingRequirement += systemData.heatGeneration || 0;

                totalMTBF += systemData.mtbf || 1000;
                totalTechRating += systemData.techRating || 30;
                systemCount++;
            }
        });

        // Calculate average reliability
        if (systemCount > 0) {
            this.reliability.overallMTBF = totalMTBF / systemCount;
            this.technologyLevel.overall_tech_rating = totalTechRating / systemCount;
        }

        // Update capabilities based on installed systems
        this.updateCapabilities();

        // Update performance modifiers
        this.updatePerformanceModifiers();

        console.log(`📊 Updated avionics characteristics: ${this.installedSystems.length} systems`);
    }

    /**
     * Updates aircraft capabilities based on installed systems
     */
    updateCapabilities() {
        // Reset capabilities
        Object.keys(this.capabilities).forEach(cap => {
            this.capabilities[cap] = false;
        });

        this.installedSystems.forEach(systemId => {
            const systemData = this.getSystemData(systemId);
            if (systemData && systemData.capabilities) {
                // Merge capabilities
                Object.keys(systemData.capabilities).forEach(cap => {
                    if (systemData.capabilities[cap]) {
                        this.capabilities[cap] = true;
                    }
                });
            }
        });

        // Special capability combinations
        if (this.systems.navigation && this.systems.autopilot) {
            this.capabilities.automaticFlight = true;
        }

        if (this.systems.radar && this.systems.fireControl) {
            this.capabilities.advancedTargeting = true;
        }

        if (this.systems.communication && this.systems.navigation) {
            this.capabilities.dataLink = true;
        }
    }

    /**
     * Updates performance modifiers based on installed systems and configurations
     */
    updatePerformanceModifiers() {
        // Reset to baseline
        Object.keys(this.performanceModifiers).forEach(mod => {
            this.performanceModifiers[mod] = 1.0;
        });

        let workloadReduction = 0;
        let awarenessBonus = 0;
        let accuracyBonus = 0;
        let survivalBonus = 0;

        this.installedSystems.forEach(systemId => {
            const systemData = this.getSystemData(systemId);
            if (systemData && systemData.performanceEffects) {
                const effects = systemData.performanceEffects;

                workloadReduction += effects.pilotWorkloadReduction || 0;
                awarenessBonus += effects.situationalAwarenessBonus || 0;
                accuracyBonus += effects.accuracyBonus || 0;
                survivalBonus += effects.survivalBonus || 0;
            }
        });

        // Apply modifiers
        this.performanceModifiers.pilotWorkload = Math.max(0.1, 1.0 - workloadReduction);
        this.performanceModifiers.situationalAwareness = 1.0 + awarenessBonus;
        this.performanceModifiers.weaponAccuracy = 1.0 + accuracyBonus;
        this.performanceModifiers.survivalProbability = 1.0 + survivalBonus;

        // Configuration-specific modifiers
        if (this.configurations.autopilotMode !== 'off') {
            this.performanceModifiers.pilotWorkload *= 0.7;
        }

        if (this.configurations.radarMode === 'air_to_air') {
            this.performanceModifiers.weaponAccuracy *= 1.2;
        }

        if (this.configurations.ecmMode === 'active') {
            this.performanceModifiers.survivalProbability *= 1.3;
            this.powerRequirements.totalPowerDraw *= 1.5; // ECM uses more power
        }
    }

    /**
     * Checks system dependencies
     * @param {string} systemId - System to check
     * @param {Object} systemData - System data
     * @returns {boolean} Dependencies met
     */
    checkDependencies(systemId, systemData) {
        if (!systemData.dependencies) return true;

        for (const dependency of systemData.dependencies) {
            if (!this.installedSystems.includes(dependency)) {
                console.warn(`❌ Dependency not met: ${systemId} requires ${dependency}`);
                return false;
            }
        }

        return true;
    }

    /**
     * Checks for system conflicts
     * @param {string} systemId - System to check
     * @param {Object} systemData - System data
     * @returns {boolean} Has conflicts
     */
    checkConflicts(systemId, systemData) {
        if (!systemData.conflicts) return false;

        for (const conflict of systemData.conflicts) {
            if (this.installedSystems.includes(conflict)) {
                console.warn(`❌ Conflict detected: ${systemId} conflicts with ${conflict}`);
                return true;
            }
        }

        return false;
    }

    /**
     * Validates that remaining systems still have their dependencies
     */
    validateRemainingDependencies() {
        const invalidSystems = [];

        this.installedSystems.forEach(systemId => {
            const systemData = this.getSystemData(systemId);
            if (systemData && systemData.dependencies) {
                for (const dependency of systemData.dependencies) {
                    if (!this.installedSystems.includes(dependency)) {
                        invalidSystems.push(systemId);
                        break;
                    }
                }
            }
        });

        // Remove systems with broken dependencies
        invalidSystems.forEach(systemId => {
            console.warn(`⚠️ Removing ${systemId} due to broken dependencies`);
            this.removeSystem(systemId);
        });
    }

    /**
     * Simulates system failure
     * @param {string} failureType - Type of failure
     */
    simulateFailure(failureType) {
        this.failureModes[failureType] = true;

        switch (failureType) {
            case 'primaryPowerFailure':
                this.degradedModes.emergencyPowerOnly = true;
                this.performanceModifiers.pilotWorkload *= 2.0;
                break;

            case 'hydraulicFailure':
                this.degradedModes.manualReversion = true;
                this.performanceModifiers.pilotWorkload *= 1.5;
                break;

            case 'coolingSystemFailure':
                this.degradedModes.limitedCapability = true;
                this.performanceModifiers.situationalAwareness *= 0.7;
                break;

            case 'computerFailure':
                this.degradedModes.backupSystemsOnly = true;
                this.performanceModifiers.weaponAccuracy *= 0.5;
                break;
        }

        console.log(`⚠️ System failure simulated: ${failureType}`);
    }

    /**
     * Repairs system failure
     * @param {string} failureType - Type of failure to repair
     */
    repairFailure(failureType) {
        this.failureModes[failureType] = false;

        // Reset degraded modes if no active failures
        if (!Object.values(this.failureModes).some(failed => failed)) {
            Object.keys(this.degradedModes).forEach(mode => {
                this.degradedModes[mode] = false;
            });

            // Recalculate performance modifiers
            this.updatePerformanceModifiers();
        }

        console.log(`🔧 System repaired: ${failureType}`);
    }

    /**
     * Gets comprehensive system status
     * @returns {Object} System status information
     */
    getSystemStatus() {
        return {
            installedSystems: this.installedSystems.length,
            totalWeight: this.physicalCharacteristics.totalWeight,
            totalPowerDraw: this.powerRequirements.totalPowerDraw,
            overallReliability: this.reliability.overallMTBF,
            technologyRating: this.technologyLevel.overall_tech_rating,
            capabilities: { ...this.capabilities },
            performanceModifiers: { ...this.performanceModifiers },
            configurations: { ...this.configurations },
            failureModes: { ...this.failureModes },
            degradedModes: { ...this.degradedModes }
        };
    }

    /**
     * Gets installation recommendations
     * @param {string} aircraftCategory - Aircraft category
     * @param {string} primaryRole - Primary role
     * @returns {Array} Array of recommended systems
     */
    getInstallationRecommendations(aircraftCategory, primaryRole) {
        const recommendations = [];

        // Basic systems for all aircraft
        if (!this.systems.communication) {
            recommendations.push({
                systemType: 'communication',
                priority: 'essential',
                reason: 'Required for basic operations',
                suggestions: ['uhf_radio_basic', 'vhf_radio_standard']
            });
        }

        if (!this.systems.navigation) {
            recommendations.push({
                systemType: 'navigation',
                priority: 'essential',
                reason: 'Required for navigation',
                suggestions: ['compass_gyroscopic', 'navigation_basic']
            });
        }

        // Role-specific recommendations
        if (primaryRole === 'fighter') {
            if (!this.systems.radar) {
                recommendations.push({
                    systemType: 'radar',
                    priority: 'high',
                    reason: 'Air-to-air combat effectiveness',
                    suggestions: ['radar_intercept_x_band', 'radar_search_s_band']
                });
            }

            if (!this.systems.fireControl) {
                recommendations.push({
                    systemType: 'fireControl',
                    priority: 'high',
                    reason: 'Weapon accuracy and effectiveness',
                    suggestions: ['fire_control_lead_computing', 'gunsight_gyroscopic']
                });
            }
        }

        if (primaryRole === 'bomber') {
            if (!this.systems.navigation) {
                recommendations.push({
                    systemType: 'navigation',
                    priority: 'high',
                    reason: 'Long-range precision navigation',
                    suggestions: ['navigation_doppler', 'navigation_inertial']
                });
            }

            if (!this.systems.autopilot) {
                recommendations.push({
                    systemType: 'autopilot',
                    priority: 'medium',
                    reason: 'Reduce pilot workload on long missions',
                    suggestions: ['autopilot_attitude', 'autopilot_three_axis']
                });
            }
        }

        if (primaryRole === 'reconnaissance') {
            if (!this.systems.navigation) {
                recommendations.push({
                    systemType: 'navigation',
                    priority: 'high',
                    reason: 'Precise navigation for intelligence gathering',
                    suggestions: ['navigation_precision', 'navigation_inertial']
                });
            }

            if (!this.systems.countermeasures) {
                recommendations.push({
                    systemType: 'countermeasures',
                    priority: 'medium',
                    reason: 'Survivability in hostile airspace',
                    suggestions: ['ecm_passive', 'chaff_dispenser']
                });
            }
        }

        return recommendations;
    }

    /**
     * Exports avionics configuration
     * @returns {Object} Serializable avionics data
     */
    exportConfiguration() {
        return {
            systems: { ...this.systems },
            installedSystems: [...this.installedSystems],
            configurations: { ...this.configurations },
            powerRequirements: { ...this.powerRequirements },
            physicalCharacteristics: { ...this.physicalCharacteristics },
            reliability: { ...this.reliability },
            capabilities: { ...this.capabilities },
            performanceModifiers: { ...this.performanceModifiers },
            technologyLevel: { ...this.technologyLevel }
        };
    }

    /**
     * Imports avionics configuration
     * @param {Object} config - Configuration to import
     */
    importConfiguration(config) {
        if (config.systems) Object.assign(this.systems, config.systems);
        if (config.installedSystems) this.installedSystems = [...config.installedSystems];
        if (config.configurations) Object.assign(this.configurations, config.configurations);

        // Recalculate characteristics
        this.updateComponentCharacteristics();

        console.log('📡 Avionics configuration imported');
    }

    /**
     * Gets system data from global components
     */
    getSystemData(systemId) {
        return window.AIRCRAFT_COMPONENTS?.avionics?.[systemId] || null;
    }
}

// Export for ECS registration
export const AVIONICS_COMPONENT_TYPE = 'Avionics';

console.log('📡 AvionicsComponent module loaded');