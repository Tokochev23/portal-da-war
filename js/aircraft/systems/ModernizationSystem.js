/**
 * Modernization System - War1954 Aircraft Creator
 *
 * Handles the logic for applying upgrade packages to existing aircraft designs.
 * 
 * @version 1.0.0
 */

// Assume all component data is loaded into a global object for easy lookup.
// This would be managed by a central data loader in a full application.
// import { ALL_COMPONENTS } from '../data/all_components.js';

export class ModernizationSystem {
    constructor(allComponents) {
        // A real implementation would load this from all data files.
        // For now, we'll rely on it being passed in or available globally.
        this.allComponents = allComponents || window.ALL_COMPONENTS || {};
        console.log('🔧 ModernizationSystem initialized');
    }

    /**
     * Applies an upgrade package to an aircraft entity.
     * @param {Object} originalEntity - The original aircraft design entity.
     * @param {Object} upgradePackage - The upgrade package to apply.
     * @returns {Object} An object containing the new upgraded entity and the calculated cost.
     */
    applyUpgrade(originalEntity, upgradePackage) {
        if (!originalEntity || !upgradePackage || !upgradePackage.replaces) {
            console.error("Invalid entity or upgrade package.");
            return null;
        }

        // Create a deep copy to avoid modifying the original entity
        const upgradedEntity = JSON.parse(JSON.stringify(originalEntity));
        upgradedEntity.name = `${originalEntity.name} (${upgradePackage.name})`;

        let newComponentCost = 0;
        let componentsReplaced = 0;

        const newComponents = upgradedEntity.components.map(component => {
            // Check if this component's ID is listed in the package's `replaces` map
            const newComponentId = upgradePackage.replaces[component.id];
            
            if (newComponentId) {
                // If it is, find the full data for the new component
                const newComponentData = this._findComponentById(newComponentId);
                if (newComponentData) {
                    console.log(`Upgrading: ${component.name} -> ${newComponentData.name}`);
                    newComponentCost += newComponentData.cost || newComponentData.cost_base || 0;
                    componentsReplaced++;
                    return newComponentData; // Replace the old component with the new one
                }
            }
            // If not being replaced, keep the original component
            return component;
        });

        if (componentsReplaced === 0) {
            console.warn("Upgrade package did not result in any component changes.");
            return { upgradedEntity: originalEntity, upgradeCost: 0, warning: "No applicable components found for this upgrade." };
        }

        upgradedEntity.components = newComponents;

        // The cost of an upgrade is the package's R&D cost plus the cost of the new hardware.
        const upgradeCost = upgradePackage.cost + newComponentCost;

        return {
            upgradedEntity,
            upgradeCost
        };
    }

    /**
     * Helper to find a component's data from a single aggregated source.
     * In a real app, this would be more robust.
     * @param {string} componentId - The ID of the component to find.
     * @private
     */
    _findComponentById(componentId) {
        for (const category in this.allComponents) {
            if (this.allComponents[category][componentId]) {
                // Return a copy of the component data with its ID
                return {
                    id: componentId,
                    ...this.allComponents[category][componentId]
                };
            }
        }
        console.error(`Component with ID '${componentId}' not found in any data source.`);
        return null;
    }
}
