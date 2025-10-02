/**
 * Propulsion System Loader - War1954 Aircraft Creator
 *
 * Central module loader that initializes and coordinates all propulsion systems.
 * Provides a unified interface for accessing all propulsion functionality.
 * Ensures proper loading order and dependency management.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

// Import all propulsion system modules
import { DynamicPropulsionSystem } from './DynamicPropulsionSystem.js';
import { AfterburnerController } from './AfterburnerController.js';
import { ThrustVectoringController } from './ThrustVectoringController.js';
import { AdvancedPropulsionTech } from './AdvancedPropulsionTech.js';
import { PropulsionPerformanceIntegrator } from './PropulsionPerformanceIntegrator.js';
import { FlightProfileManager } from './FlightProfileManager.js';

// Import UI components
import { AfterburnerControlPanel } from '../ui/AfterburnerControlPanel.js';
import { ThrustVectoringPanel } from '../ui/ThrustVectoringPanel.js';

export class PropulsionSystemLoader {
    constructor() {
        this.initialized = false;
        this.systems = {};
        this.uiComponents = {};
        this.loadingStatus = {};

        // System dependencies map
        this.dependencies = {
            'dynamicPropulsion': [],
            'afterburner': ['dynamicPropulsion'],
            'thrustVectoring': ['dynamicPropulsion'],
            'advancedTech': [],
            'flightProfile': ['dynamicPropulsion'],
            'integrator': ['dynamicPropulsion', 'afterburner', 'thrustVectoring', 'advancedTech']
        };

        // System loading order
        this.loadingOrder = [
            'dynamicPropulsion',
            'afterburner',
            'thrustVectoring',
            'advancedTech',
            'flightProfile',
            'integrator'
        ];
    }

    /**
     * Initialize all propulsion systems in correct order
     */
    async initializeAllSystems() {
        console.log('🚀 Starting PropulsionSystemLoader initialization...');

        try {
            // Initialize systems in dependency order
            for (const systemName of this.loadingOrder) {
                await this.initializeSystem(systemName);
            }

            // Set up cross-system communication
            this.setupSystemCommunication();

            // Initialize UI components
            await this.initializeUIComponents();

            // Set up global event listeners
            this.setupGlobalEventListeners();

            this.initialized = true;
            console.log('✅ All propulsion systems initialized successfully');

            // Dispatch system ready event
            document.dispatchEvent(new CustomEvent('propulsionSystemsReady', {
                detail: {
                    systems: this.systems,
                    uiComponents: this.uiComponents
                }
            }));

            return { success: true, systems: this.getSystemStatus() };

        } catch (error) {
            console.error('❌ Failed to initialize propulsion systems:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Initialize individual system
     */
    async initializeSystem(systemName) {
        console.log(`🔧 Initializing ${systemName}...`);

        this.loadingStatus[systemName] = 'loading';

        try {
            // Check dependencies
            const dependencies = this.dependencies[systemName] || [];
            for (const dep of dependencies) {
                if (this.loadingStatus[dep] !== 'loaded') {
                    throw new Error(`Dependency ${dep} not loaded for ${systemName}`);
                }
            }

            // Initialize the specific system
            switch (systemName) {
                case 'dynamicPropulsion':
                    this.systems.dynamicPropulsion = new DynamicPropulsionSystem();
                    break;

                case 'afterburner':
                    this.systems.afterburner = new AfterburnerController();
                    break;

                case 'thrustVectoring':
                    this.systems.thrustVectoring = new ThrustVectoringController();
                    break;

                case 'advancedTech':
                    this.systems.advancedTech = new AdvancedPropulsionTech();
                    break;

                case 'flightProfile':
                    this.systems.flightProfile = new FlightProfileManager();
                    break;

                case 'integrator':
                    this.systems.integrator = new PropulsionPerformanceIntegrator();
                    break;

                default:
                    throw new Error(`Unknown system: ${systemName}`);
            }

            this.loadingStatus[systemName] = 'loaded';
            console.log(`✅ ${systemName} initialized successfully`);

        } catch (error) {
            this.loadingStatus[systemName] = 'error';
            console.error(`❌ Failed to initialize ${systemName}:`, error);
            throw error;
        }
    }

    /**
     * Set up communication between systems
     */
    setupSystemCommunication() {
        console.log('🔗 Setting up system communication...');

        // Link afterburner to dynamic propulsion
        if (this.systems.afterburner && this.systems.dynamicPropulsion) {
            this.systems.afterburner.dynamicPropulsionSystem = this.systems.dynamicPropulsion;
        }

        // Link thrust vectoring to dynamic propulsion
        if (this.systems.thrustVectoring && this.systems.dynamicPropulsion) {
            this.systems.thrustVectoring.dynamicPropulsionSystem = this.systems.dynamicPropulsion;
        }

        // Link integrator to all systems
        if (this.systems.integrator) {
            this.systems.integrator.dynamicPropulsion = this.systems.dynamicPropulsion;
            this.systems.integrator.afterburner = this.systems.afterburner;
            this.systems.integrator.thrustVectoring = this.systems.thrustVectoring;
            this.systems.integrator.advancedTech = this.systems.advancedTech;
        }

        // Set up event forwarding
        this.setupEventForwarding();
    }

    /**
     * Set up event forwarding between systems
     */
    setupEventForwarding() {
        // Forward propulsion system updates to integrator
        document.addEventListener('propulsionSystemUpdated', (event) => {
            if (this.systems.integrator && event.detail?.aircraft) {
                this.systems.integrator.configureForAircraft(event.detail.aircraft);
            }
        });

        // Forward afterburner changes to integrator
        document.addEventListener('afterburnerStatusChanged', (event) => {
            if (this.systems.integrator) {
                this.systems.integrator.updateFlightConditions({
                    afterburnerStage: event.detail?.stage || 0
                });
            }
        });

        // Forward thrust vectoring changes to integrator
        document.addEventListener('thrustVectoringChanged', (event) => {
            if (this.systems.integrator) {
                this.systems.integrator.updateFlightConditions({
                    vectoringPitch: event.detail?.pitch || 0,
                    vectoringYaw: event.detail?.yaw || 0
                });
            }
        });
    }

    /**
     * Initialize UI components
     */
    async initializeUIComponents() {
        console.log('🎨 Initializing UI components...');

        try {
            // Check if containers exist before creating UI components
            const afterburnerContainer = document.getElementById('afterburner-control-panel');
            if (afterburnerContainer) {
                this.uiComponents.afterburnerPanel = new AfterburnerControlPanel('afterburner-control-panel');
            }

            const vectoringContainer = document.getElementById('thrust-vectoring-panel');
            if (vectoringContainer) {
                this.uiComponents.vectoringPanel = new ThrustVectoringPanel('thrust-vectoring-panel');
            }

            console.log('✅ UI components initialized');

        } catch (error) {
            console.warn('⚠️ Some UI components could not be initialized:', error);
            // Don't throw - UI initialization is optional
        }
    }

    /**
     * Set up global event listeners
     */
    setupGlobalEventListeners() {
        // Listen for aircraft changes
        document.addEventListener('aircraftSelected', (event) => {
            this.handleAircraftChange(event.detail.aircraft, event.detail.techLevel || 50);
        });

        // Listen for flight condition changes
        document.addEventListener('flightConditionsChanged', (event) => {
            this.handleFlightConditionsChange(event.detail);
        });

        // Listen for system performance requests
        document.addEventListener('requestPerformanceCalculation', (event) => {
            this.handlePerformanceRequest(event.detail);
        });
    }

    /**
     * Handle aircraft change
     */
    handleAircraftChange(aircraft, techLevel) {
        console.log(`✈️ Aircraft changed: ${aircraft?.name || 'Unknown'}`);

        // Update all systems with new aircraft
        Object.values(this.systems).forEach(system => {
            if (typeof system.setAircraft === 'function') {
                system.setAircraft(aircraft, techLevel);
            } else if (typeof system.configureForAircraft === 'function') {
                system.configureForAircraft(aircraft, techLevel);
            } else if (typeof system.configureSystem === 'function') {
                system.configureSystem(aircraft, techLevel);
            }
        });

        // Update UI components
        Object.values(this.uiComponents).forEach(component => {
            if (typeof component.setAircraft === 'function') {
                component.setAircraft(aircraft, techLevel);
            }
        });
    }

    /**
     * Handle flight conditions change
     */
    handleFlightConditionsChange(conditions) {
        if (this.systems.integrator) {
            this.systems.integrator.updateFlightConditions(conditions);
        }

        // Update UI components
        Object.values(this.uiComponents).forEach(component => {
            if (typeof component.updateFlightConditions === 'function') {
                component.updateFlightConditions(conditions);
            }
        });
    }

    /**
     * Handle performance calculation request
     */
    handlePerformanceRequest(request) {
        if (this.systems.integrator) {
            const performance = this.systems.integrator.calculateIntegratedPerformance(request.conditions);

            document.dispatchEvent(new CustomEvent('performanceCalculated', {
                detail: { performance, request }
            }));
        }
    }

    /**
     * Get system status
     */
    getSystemStatus() {
        const status = {};

        Object.keys(this.systems).forEach(systemName => {
            const system = this.systems[systemName];
            status[systemName] = {
                loaded: this.loadingStatus[systemName] === 'loaded',
                initialized: system?.initialized || false,
                hasGetStatus: typeof system?.getStatus === 'function',
                status: typeof system?.getStatus === 'function' ? system.getStatus() : null
            };
        });

        return status;
    }

    /**
     * Get system by name
     */
    getSystem(systemName) {
        return this.systems[systemName] || null;
    }

    /**
     * Get UI component by name
     */
    getUIComponent(componentName) {
        return this.uiComponents[componentName] || null;
    }

    /**
     * Check if all systems are ready
     */
    areAllSystemsReady() {
        return this.initialized && Object.values(this.loadingStatus).every(status => status === 'loaded');
    }

    /**
     * Create mission profile with integrated systems
     */
    createIntegratedMissionProfile(template, aircraft, customization = {}) {
        if (!this.systems.flightProfile || !this.systems.integrator) {
            return { success: false, reason: 'Required systems not available' };
        }

        // Create base profile
        const profileResult = this.systems.flightProfile.createMissionProfile(template, customization);
        if (!profileResult.success) return profileResult;

        // Calculate integrated performance
        const performanceResult = this.systems.integrator.calculateMissionProfile(
            profileResult.profile,
            aircraft,
            customization.techLevel || 50
        );

        return performanceResult;
    }

    /**
     * Export complete system state
     */
    exportSystemState() {
        const systemState = {
            timestamp: Date.now(),
            initialized: this.initialized,
            loadingStatus: this.loadingStatus,
            systems: {}
        };

        // Export state from each system
        Object.keys(this.systems).forEach(systemName => {
            const system = this.systems[systemName];
            if (typeof system?.exportAnalysis === 'function') {
                systemState.systems[systemName] = system.exportAnalysis();
            } else if (typeof system?.getStatus === 'function') {
                systemState.systems[systemName] = system.getStatus();
            }
        });

        return systemState;
    }

    /**
     * Restart all systems
     */
    async restartSystems() {
        console.log('🔄 Restarting propulsion systems...');

        // Reset all systems
        Object.values(this.systems).forEach(system => {
            if (typeof system?.resetToIdle === 'function') {
                system.resetToIdle();
            } else if (typeof system?.resetToNeutral === 'function') {
                system.resetToNeutral();
            }
        });

        // Reinitialize
        this.initialized = false;
        this.loadingStatus = {};

        return await this.initializeAllSystems();
    }

    /**
     * Shutdown all systems
     */
    shutdown() {
        console.log('🔴 Shutting down propulsion systems...');

        // Stop UI update loops
        Object.values(this.uiComponents).forEach(component => {
            if (typeof component?.destroy === 'function') {
                component.destroy();
            }
        });

        // Clear systems
        this.systems = {};
        this.uiComponents = {};
        this.initialized = false;
        this.loadingStatus = {};

        console.log('✅ Propulsion systems shutdown complete');
    }
}

// Create and initialize global loader instance
export const propulsionSystemLoader = new PropulsionSystemLoader();

// Make it available globally
window.propulsionSystemLoader = propulsionSystemLoader;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        propulsionSystemLoader.initializeAllSystems();
    });
} else {
    // DOM already loaded, initialize immediately
    propulsionSystemLoader.initializeAllSystems();
}

console.log('🚀 PropulsionSystemLoader module loaded');