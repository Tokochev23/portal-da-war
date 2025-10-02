/**
 * Aircraft Entity Manager - War1954 Aircraft Creator
 *
 * Manages aircraft entities and their components using the Aircraft ECS system.
 * Provides high-level interface for aircraft creation and management.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { aircraftECS } from './AircraftECS.js';

export class AircraftEntity {
    constructor() {
        this.activeAircraftId = null;
        this.initialized = false;
    }

    /**
     * Initializes the aircraft entity system
     */
    initialize() {
        if (this.initialized) return;

        // Create default aircraft for legacy compatibility
        this.createDefaultAircraft();
        this.initialized = true;

        console.log('✈️ AircraftEntity system initialized');
    }

    /**
     * Creates a new aircraft entity with default components
     * @param {string} name - Aircraft name
     * @returns {number} Entity ID of the created aircraft
     */
    createAircraft(name = 'Nova Aeronave') {
        const aircraftId = aircraftECS.createAircraft();

        // Core aircraft identity
        aircraftECS.addComponent(aircraftId, 'Identity', {
            name: name,
            type: 'aircraft',
            category: null,
            createdAt: Date.now(),
            lastModified: Date.now()
        });

        // Physical structure
        aircraftECS.addComponent(aircraftId, 'Structure', {
            airframe: null,
            material: 'aluminum',
            size: 'medium',
            baseWeight: 0,
            maxTakeoffWeight: 0,
            centerOfGravity: { x: 0, y: 0, z: 0 }
        });

        // Propulsion system
        aircraftECS.addComponent(aircraftId, 'Propulsion', {
            engines: [],
            totalThrust: 0,
            thrustToWeight: 0,
            fuelCapacity: 0,
            fuelConsumption: {
                idle: 0,
                cruise: 0,
                combat: 0
            }
        });

        // Aerodynamics
        aircraftECS.addComponent(aircraftId, 'Aerodynamics', {
            wings: {
                type: null,
                area: 0,
                features: []
            },
            clMax: 0,
            cd0: 0,
            liftToDrag: 0
        });

        // Performance metrics
        aircraftECS.addComponent(aircraftId, 'Performance', {
            maxSpeed: 0,
            cruiseSpeed: 0,
            climbRate: 0,
            serviceceiling: 0,
            range: 0,
            gLimit: 0
        });

        // Weapons and armament
        aircraftECS.addComponent(aircraftId, 'Armament', {
            hardpoints: [],
            weapons: [],
            maxWeaponLoad: 0
        });

        // Avionics and electronics
        aircraftECS.addComponent(aircraftId, 'Avionics', {
            radar: null,
            irst: null,
            jammer: null,
            countermeasures: []
        });

        // Economic data
        aircraftECS.addComponent(aircraftId, 'Economics', {
            developmentCost: 0,
            unitCost: 0,
            maintenanceCost: 0,
            techLevel: 0
        });

        console.log(`✈️ Aircraft created: ${name} (ID: ${aircraftId})`);
        return aircraftId;
    }

    /**
     * Creates a default aircraft for the system
     */
    createDefaultAircraft() {
        if (!this.activeAircraftId) {
            this.activeAircraftId = this.createAircraft();
            console.log(`🎯 Default aircraft created: ${this.activeAircraftId}`);
        }
    }

    /**
     * Sets the active aircraft
     * @param {number} aircraftId - Aircraft entity ID
     */
    setActiveAircraft(aircraftId) {
        if (!aircraftECS.entities.has(aircraftId)) {
            throw new Error(`Aircraft ${aircraftId} does not exist`);
        }

        this.activeAircraftId = aircraftId;
        console.log(`🎯 Active aircraft set to: ${aircraftId}`);
    }

    /**
     * Gets the active aircraft ID
     * @returns {number|null} Active aircraft ID
     */
    getActiveAircraftId() {
        return this.activeAircraftId;
    }

    /**
     * Gets complete aircraft data
     * @param {number} aircraftId - Aircraft ID (optional, uses active if not provided)
     * @returns {Object|null} Complete aircraft data
     */
    getAircraftData(aircraftId = null) {
        const id = aircraftId || this.activeAircraftId;

        if (!id || !aircraftECS.entities.has(id)) {
            return null;
        }

        return {
            id: id,
            identity: aircraftECS.getComponent(id, 'Identity'),
            structure: aircraftECS.getComponent(id, 'Structure'),
            propulsion: aircraftECS.getComponent(id, 'Propulsion'),
            aerodynamics: aircraftECS.getComponent(id, 'Aerodynamics'),
            performance: aircraftECS.getComponent(id, 'Performance'),
            armament: aircraftECS.getComponent(id, 'Armament'),
            avionics: aircraftECS.getComponent(id, 'Avionics'),
            economics: aircraftECS.getComponent(id, 'Economics')
        };
    }

    /**
     * Updates a component of an aircraft
     * @param {number} aircraftId - Aircraft entity ID
     * @param {string} componentType - Component type
     * @param {Object} updates - Updates to apply
     */
    updateComponent(aircraftId, componentType, updates) {
        const currentComponent = aircraftECS.getComponent(aircraftId, componentType);
        if (!currentComponent) {
            throw new Error(`Component ${componentType} not found on aircraft ${aircraftId}`);
        }

        const updatedComponent = { ...currentComponent, ...updates };
        aircraftECS.addComponent(aircraftId, componentType, updatedComponent);

        // Update last modified timestamp
        this.updateLastModified(aircraftId);

        console.log(`🔧 Aircraft ${aircraftId} component '${componentType}' updated`);
    }

    /**
     * Updates the last modified timestamp
     * @param {number} aircraftId - Aircraft entity ID
     */
    updateLastModified(aircraftId) {
        const identity = aircraftECS.getComponent(aircraftId, 'Identity');
        if (identity) {
            // Update directly without triggering updateComponent to avoid recursion
            const updatedIdentity = {
                ...identity,
                lastModified: Date.now()
            };
            aircraftECS.addComponent(aircraftId, 'Identity', updatedIdentity);
        }
    }

    /**
     * Validates aircraft design
     * @param {number} aircraftId - Aircraft entity ID
     * @returns {Object} Validation result
     */
    validateAircraft(aircraftId = null) {
        const id = aircraftId || this.activeAircraftId;
        const aircraft = this.getAircraftData(id);

        if (!aircraft) {
            return { isValid: false, errors: ['Aircraft not found'] };
        }

        const errors = [];
        const warnings = [];

        // Basic validation checks
        if (!aircraft.structure?.airframe) {
            errors.push('Nenhuma fuselagem selecionada');
        }

        if (!aircraft.propulsion?.engines?.length) {
            errors.push('Nenhum motor selecionado');
        }

        if (!aircraft.aerodynamics?.wings?.type) {
            errors.push('Nenhum tipo de asa selecionado');
        }

        // Performance warnings
        if (aircraft.performance?.thrustToWeight < 0.3) {
            warnings.push('Relação empuxo/peso muito baixa');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Gets all aircraft entities
     * @returns {Array<number>} Array of aircraft entity IDs
     */
    getAllAircraft() {
        return aircraftECS.getAircraftWithComponents('Identity', 'Structure');
    }

    /**
     * Destroys an aircraft
     * @param {number} aircraftId - Aircraft entity ID
     */
    destroyAircraft(aircraftId) {
        if (this.activeAircraftId === aircraftId) {
            this.activeAircraftId = null;
        }

        aircraftECS.destroyAircraft(aircraftId);
        console.log(`🗑️ Aircraft destroyed: ${aircraftId}`);
    }
}

// Global instance
export const aircraftEntityManager = new AircraftEntity();

// Make it available globally
window.aircraftEntityManager = aircraftEntityManager;