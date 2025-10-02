/**
 * Aircraft Entity-Component-System - War1954 Aircraft Creator
 *
 * ECS system specifically designed for aircraft management in the War1954 game.
 * This system provides the foundation for the new aircraft creation architecture.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class AircraftECS {
    constructor() {
        this.entities = new Map();
        this.components = new Map();
        this.nextEntityId = 1;
        this.systems = new Set();

        console.log('✈️ AircraftECS initialized');
    }

    /**
     * Creates a new aircraft entity
     * @returns {number} Entity ID
     */
    createAircraft() {
        const entityId = this.nextEntityId++;
        this.entities.set(entityId, new Set());

        console.log(`✨ Aircraft entity created: ${entityId}`);
        return entityId;
    }

    /**
     * Destroys an aircraft entity
     * @param {number} entityId - The entity to destroy
     */
    destroyAircraft(entityId) {
        if (!this.entities.has(entityId)) {
            console.warn(`⚠️ Attempted to destroy non-existent aircraft: ${entityId}`);
            return;
        }

        // Remove all components for this entity
        const entityComponents = this.entities.get(entityId);
        for (const componentType of entityComponents) {
            this.removeComponent(entityId, componentType);
        }

        this.entities.delete(entityId);
        console.log(`🗑️ Aircraft entity destroyed: ${entityId}`);
    }

    /**
     * Adds a component to an aircraft
     * @param {number} entityId - Target aircraft
     * @param {string} componentType - Component type name
     * @param {Object} componentData - Component data
     */
    addComponent(entityId, componentType, componentData) {
        if (!this.entities.has(entityId)) {
            throw new Error(`Aircraft ${entityId} does not exist`);
        }

        if (!this.components.has(componentType)) {
            this.components.set(componentType, new Map());
        }

        this.components.get(componentType).set(entityId, componentData);
        this.entities.get(entityId).add(componentType);

        console.log(`🔧 Component '${componentType}' added to aircraft ${entityId}`);
    }

    /**
     * Removes a component from an aircraft
     * @param {number} entityId - Target aircraft
     * @param {string} componentType - Component type to remove
     */
    removeComponent(entityId, componentType) {
        if (!this.entities.has(entityId)) {
            console.warn(`⚠️ Attempted to remove component from non-existent aircraft: ${entityId}`);
            return;
        }

        if (this.components.has(componentType)) {
            this.components.get(componentType).delete(entityId);
            this.entities.get(entityId).delete(componentType);

            console.log(`🔧 Component '${componentType}' removed from aircraft ${entityId}`);
        }
    }

    /**
     * Gets a component from an aircraft
     * @param {number} entityId - Target aircraft
     * @param {string} componentType - Component type to get
     * @returns {Object|null} Component data or null if not found
     */
    getComponent(entityId, componentType) {
        if (!this.components.has(componentType)) {
            return null;
        }

        return this.components.get(componentType).get(entityId) || null;
    }

    /**
     * Checks if an aircraft has a specific component
     * @param {number} entityId - Target aircraft
     * @param {string} componentType - Component type to check
     * @returns {boolean} True if aircraft has the component
     */
    hasComponent(entityId, componentType) {
        return this.entities.has(entityId) &&
               this.entities.get(entityId).has(componentType);
    }

    /**
     * Gets all aircraft that have all specified components
     * @param {...string} componentTypes - Component types to filter by
     * @returns {Array<number>} Array of aircraft IDs
     */
    getAircraftWithComponents(...componentTypes) {
        const aircraftWithComponents = [];

        for (const [entityId, entityComponents] of this.entities) {
            const hasAllComponents = componentTypes.every(type =>
                entityComponents.has(type)
            );

            if (hasAllComponents) {
                aircraftWithComponents.push(entityId);
            }
        }

        return aircraftWithComponents;
    }

    /**
     * Gets debug information about the ECS
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        const componentCounts = {};
        for (const [componentType, components] of this.components) {
            componentCounts[componentType] = components.size;
        }

        return {
            totalAircraft: this.entities.size,
            componentCounts,
            registeredSystems: Array.from(this.systems).map(s => s.constructor.name)
        };
    }
}

// Global instance for aircraft ECS
export const aircraftECS = new AircraftECS();

// Make it available globally for compatibility
window.aircraftECS = aircraftECS;