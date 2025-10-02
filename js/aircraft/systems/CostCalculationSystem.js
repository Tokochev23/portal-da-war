/**
 * Cost Calculation System - War1954 Aircraft Creator
 *
 * Calculates Development, Production, and Operational costs for an aircraft design.
 * 
 * @version 2.1.0 (Added Operational and Lifecycle Cost calculations)
 */

export class CostCalculationSystem {
    constructor() {
        // Cost factors
        this.BASE_DEV_COST = 50000; // Base R&D cost
        this.BASE_MAINTENANCE_COST_PER_HOUR = 50; // $50/hr for a baseline aircraft
        this.FUEL_COST_PER_KG = 0.20; // $0.20 per kg of jet fuel

        console.log('💰 CostCalculationSystem initialized');
    }

    /**
     * Calculates all costs for an aircraft and stores them on the entity.
     * @param {Object} entity - The aircraft entity, containing components.
     */
    calculate(entity) {
        if (!entity || !entity.components) return;

        // Ensure costs object exists
        if (!entity.costs) {
            entity.costs = {};
        }

        this._calculateUpfrontCosts(entity);
        this._calculateOperationalCosts(entity);
        this._calculateLifecycleCost(entity);

        console.log(`Costs Calculated: Dev=$${(entity.costs.developmentCost / 1000).toFixed(0)}k, Prod=$${(entity.costs.unitProductionCost / 1000).toFixed(0)}k, Op/hr=$${entity.costs.costPerHour.toFixed(0)}`);
    }

    /**
     * Calculates one-time Development (R&D) and per-unit Production costs.
     * @private
     */
    _calculateUpfrontCosts(entity) {
        let developmentCost = this.BASE_DEV_COST;
        let productionCost = 0;

        for (const component of entity.components) {
            const cost = component.cost || component.cost_base || 0;
            const techLevel = component.techLevelRequirement || 10;

            productionCost += cost;
            developmentCost += cost * Math.pow(techLevel / 40, 2) * 0.1;
        }

        const structure = entity.components.find(c => c.type === 'structure_material');
        if (structure && structure.cost_modifier) {
            productionCost *= structure.cost_modifier;
        }

        entity.costs.developmentCost = developmentCost;
        entity.costs.unitProductionCost = productionCost;
    }

    /**
     * Calculates ongoing operational costs per flight hour.
     * @private
     */
    _calculateOperationalCosts(entity) {
        // Maintenance Cost
        const totalMaintainability = entity.components.reduce((total, c) => total + (c.maintainabilityModifier || 1.0), 0);
        const maintenanceCostPerHour = this.BASE_MAINTENANCE_COST_PER_HOUR * totalMaintainability;

        // Fuel Cost
        // Converts fuel consumption from kg/s to kg/h (x 3600)
        const fuelConsumptionKGH = (entity.performance?.currentFuelConsumption || 0) * 3600;
        const fuelCostPerHour = fuelConsumptionKGH * this.FUEL_COST_PER_KG;

        entity.costs.maintenanceCostPerHour = maintenanceCostPerHour;
        entity.costs.fuelCostPerHour = fuelCostPerHour;
        entity.costs.costPerHour = maintenanceCostPerHour + fuelCostPerHour;
    }

    /**
     * Calculates a default Lifecycle Cost (LCC) for a standard fleet.
     * @private
     */
    _calculateLifecycleCost(entity, quantity = 100, lifetimeHours = 6000) {
        const dev = entity.costs.developmentCost || 0;
        const prod = entity.costs.unitProductionCost || 0;
        const op = entity.costs.costPerHour || 0;

        const totalDevCost = dev;
        const totalProdCost = prod * quantity;
        const totalOpCost = op * lifetimeHours * quantity;

        const lifecycleCost = totalDevCost + totalProdCost + totalOpCost;

        entity.costs.lcc = {
            total: lifecycleCost,
            assumptions: { quantity, lifetimeHours },
            breakdown: {
                development: totalDevCost,
                production: totalProdCost,
                operation: totalOpCost
            }
        };
    }
}