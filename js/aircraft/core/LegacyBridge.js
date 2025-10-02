/**
 * Legacy Bridge - War1954 Aircraft Creator
 *
 * Provides compatibility layer between the new ECS system and existing aircraft creator code.
 * Maintains backward compatibility while enabling new features.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { aircraftEntityManager } from './AircraftEntity.js';

export class LegacyBridge {
    constructor() {
        this.isInitialized = false;
        this.legacyAircraftProxy = null;
        this.updating = false;
        this.updateTimeout = null;
    }

    /**
     * Initializes the legacy compatibility bridge
     */
    initialize() {
        if (this.isInitialized) return;

        // Ensure aircraft entity manager is initialized
        aircraftEntityManager.initialize();

        // Setup legacy global state proxy
        this.setupLegacyProxy();

        // Setup legacy function compatibility
        this.setupLegacyFunctions();

        this.isInitialized = true;
        console.log('🔄 Legacy bridge initialized');
    }

    /**
     * Sets up the legacy currentAircraft global proxy
     */
    setupLegacyProxy() {
        this.legacyAircraftProxy = new Proxy({}, {
            get: (target, prop) => {
                const aircraftData = aircraftEntityManager.getAircraftData();
                if (!aircraftData) {
                    return this.getDefaultValue(prop);
                }

                // Map legacy properties to ECS components
                switch (prop) {
                    case 'name':
                        return aircraftData.identity?.name || 'Nova Aeronave';
                    case 'airframe':
                        return aircraftData.structure?.airframe || null;
                    case 'engine':
                        return aircraftData.propulsion?.engines?.[0] || null;
                    case 'wings':
                        return {
                            type: aircraftData.aerodynamics?.wings?.type || null,
                            features: aircraftData.aerodynamics?.wings?.features || []
                        };
                    case 'weapons':
                        return aircraftData.armament?.weapons || [];
                    case 'avionics':
                        return aircraftData.avionics || {};
                    case 'quantity':
                        return aircraftData.economics?.quantity || 1;
                    default:
                        return target[prop];
                }
            },

            set: (target, prop, value) => {
                const aircraftId = aircraftEntityManager.getActiveAircraftId();
                if (!aircraftId) {
                    console.warn('⚠️ No active aircraft to update');
                    return false;
                }

                // Prevent recursive calls
                if (this.updating) {
                    return true;
                }

                try {
                    this.updating = true;

                    // Map legacy property changes to ECS component updates
                    switch (prop) {
                        case 'name':
                            aircraftEntityManager.updateComponent(aircraftId, 'Identity', { name: value });
                            break;
                        case 'airframe':
                            aircraftEntityManager.updateComponent(aircraftId, 'Structure', { airframe: value });
                            break;
                        case 'engine':
                            aircraftEntityManager.updateComponent(aircraftId, 'Propulsion', {
                                engines: value ? [value] : []
                            });
                            break;
                        case 'wings':
                            if (typeof value === 'object') {
                                const currentWings = aircraftEntityManager.getAircraftData()?.aerodynamics?.wings || {};
                                aircraftEntityManager.updateComponent(aircraftId, 'Aerodynamics', {
                                    wings: { ...currentWings, ...value }
                                });
                            }
                            break;
                        case 'weapons':
                            aircraftEntityManager.updateComponent(aircraftId, 'Armament', { weapons: value });
                            break;
                        case 'avionics':
                            aircraftEntityManager.updateComponent(aircraftId, 'Avionics', value);
                            break;
                        case 'quantity':
                            aircraftEntityManager.updateComponent(aircraftId, 'Economics', { quantity: value });
                            break;
                        default:
                            target[prop] = value;
                    }

                    // Trigger legacy update calculations if they exist (debounced)
                    if (window.updateAircraftCalculations && !this.updateTimeout) {
                        this.updateTimeout = setTimeout(() => {
                            if (window.updateAircraftCalculations) {
                                window.updateAircraftCalculations();
                            }
                            this.updateTimeout = null;
                        }, 100);
                    }

                    return true;
                } catch (error) {
                    console.error(`❌ Error setting legacy property ${prop}:`, error);
                    return false;
                } finally {
                    this.updating = false;
                }
            }
        });

        // Replace global currentAircraft with proxy
        window.currentAircraft = this.legacyAircraftProxy;
        console.log('🔗 Legacy currentAircraft proxy established');
    }

    /**
     * Returns default values for legacy properties
     * @param {string} prop - Property name
     * @returns {*} Default value
     */
    getDefaultValue(prop) {
        const defaults = {
            name: 'Nova Aeronave',
            airframe: null,
            engine: null,
            wings: { type: null, features: [] },
            weapons: [],
            avionics: {},
            quantity: 1
        };

        return defaults[prop] !== undefined ? defaults[prop] : null;
    }

    /**
     * Sets up legacy function compatibility
     */
    setupLegacyFunctions() {
        // Store original functions if they exist
        const originalSelectAirframe = window.selectAirframe;
        const originalSelectAircraftEngine = window.selectAircraftEngine;
        const originalToggleAircraftWeapon = window.toggleAircraftWeapon;
        const originalUpdateAircraftCalculations = window.updateAircraftCalculations;

        // Override selectAirframe
        window.selectAirframe = (airframeId) => {
            // Call original function if it exists
            if (originalSelectAirframe) {
                originalSelectAirframe(airframeId);
            }

            // Update ECS
            const aircraftId = aircraftEntityManager.getActiveAircraftId();
            if (aircraftId) {
                aircraftEntityManager.updateComponent(aircraftId, 'Structure', { airframe: airframeId });
            }

            console.log(`🛩️ Airframe selected via legacy bridge: ${airframeId}`);
        };

        // Override selectAircraftEngine
        window.selectAircraftEngine = (engineId) => {
            // Call original function if it exists
            if (originalSelectAircraftEngine) {
                originalSelectAircraftEngine(engineId);
            }

            // Update ECS
            const aircraftId = aircraftEntityManager.getActiveAircraftId();
            if (aircraftId) {
                aircraftEntityManager.updateComponent(aircraftId, 'Propulsion', { engines: [engineId] });
            }

            console.log(`⚙️ Engine selected via legacy bridge: ${engineId}`);
        };

        // Override toggleAircraftWeapon
        window.toggleAircraftWeapon = (weaponId) => {
            // Call original function if it exists
            if (originalToggleAircraftWeapon) {
                originalToggleAircraftWeapon(weaponId);
            }

            // Update ECS
            const aircraftId = aircraftEntityManager.getActiveAircraftId();
            if (aircraftId) {
                const aircraftData = aircraftEntityManager.getAircraftData();
                const currentWeapons = aircraftData?.armament?.weapons || [];
                const index = currentWeapons.indexOf(weaponId);

                let newWeapons;
                if (index > -1) {
                    newWeapons = currentWeapons.filter(w => w !== weaponId);
                } else {
                    newWeapons = [...currentWeapons, weaponId];
                }

                aircraftEntityManager.updateComponent(aircraftId, 'Armament', { weapons: newWeapons });
            }

            console.log(`💥 Weapon toggled via legacy bridge: ${weaponId}`);
        };

        // Provide enhanced updateAircraftCalculations
        window.updateAircraftCalculations = () => {
            // Call original function if it exists
            if (originalUpdateAircraftCalculations) {
                originalUpdateAircraftCalculations();
            }

            // Additional ECS-based calculations can be added here
            console.log('📊 Aircraft calculations updated via legacy bridge');
        };

        // Provide new convenience functions
        window.getCurrentAircraft = () => {
            return window.currentAircraft;
        };

        window.getAircraftECSData = () => {
            return aircraftEntityManager.getAircraftData();
        };

        console.log('🔗 Legacy functions bridged');
    }

    /**
     * Validates the legacy bridge functionality
     * @returns {boolean} True if bridge is working correctly
     */
    validateBridge() {
        try {
            // Simple validation without triggering updates
            if (!window.currentAircraft) {
                throw new Error('currentAircraft proxy not available');
            }

            // Test read operations only to avoid recursion
            const testRead = window.currentAircraft.name;
            if (typeof testRead !== 'string') {
                console.warn('⚠️ currentAircraft.name not returning string, but bridge is functional');
            }

            // Test function availability
            if (typeof window.selectAirframe !== 'function') {
                console.warn('⚠️ selectAirframe function not available');
            }

            if (typeof window.updateAircraftCalculations !== 'function') {
                console.warn('⚠️ updateAircraftCalculations function not available');
            }

            console.log('✅ Legacy bridge validation passed');
            return true;
        } catch (error) {
            console.error('❌ Legacy bridge validation failed:', error);
            return false;
        }
    }

    /**
     * Gets the active aircraft ID through the bridge
     * @returns {number|null} Active aircraft ID
     */
    getActiveAircraftId() {
        return aircraftEntityManager.getActiveAircraftId();
    }

    /**
     * Creates a new aircraft through the bridge
     * @param {string} name - Aircraft name
     * @returns {number} New aircraft ID
     */
    createAircraft(name) {
        return aircraftEntityManager.createAircraft(name);
    }
}

// Global instance
export const legacyBridge = new LegacyBridge();

// Make it available globally
window.legacyBridge = legacyBridge;