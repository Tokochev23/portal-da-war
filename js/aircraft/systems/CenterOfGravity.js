/**
 * Center of Gravity System - War1954 Aircraft Creator
 *
 * Calculates the aircraft's center of gravity (CG), including dynamic shifts due to fuel consumption.
 * 
 * @version 2.2.0 (Added dynamic CG calculation based on fuel level)
 */

export class CenterOfGravitySystem {
    constructor() {
        console.log('⚖️ CenterOfGravitySystem initialized');
    }

    /**
     * Public-facing method to calculate CG. Defaults to 100% fuel.
     * This is the primary method called by the UnifiedCalculationSystem.
     * It mutates the entity to store the results.
     * @param {Object} entity - The aircraft entity.
     */
    calculate(entity) {
        const results = this.calculateAtFuelLevel(entity, 1.0); // 1.0 means 100% fuel

        // Store the primary result (at 100% fuel) back on the entity
        entity.totalMass = results.totalMass;
        entity.centerOfGravity = results.cg;
    }

    /**
     * Calculates the 3D center of gravity for a given aircraft entity at a specific fuel level.
     * 
     * @param {Object} entity - The aircraft entity containing all selected components.
     * @param {number} fuelPercentage - The fuel level to calculate for (0.0 to 1.0).
     * @returns {Object} An object containing the total mass and the calculated CG vector [x, y, z].
     */
    calculateAtFuelLevel(entity, fuelPercentage = 1.0) {
        if (!entity || !entity.components || entity.components.length === 0) {
            return { totalMass: 0, cg: [0, 0, 0], warnings: ['No components to calculate CG.'] };
        }

        const massPoints = [];

        // Process all components and generate a list of mass points
        for (const component of entity.components) {
            let mass = component.weight || 0;
            const position = component.position; // Expects [x, y, z]

            if (!position || position.length !== 3) continue; // Skip components without a valid position

            // Special handling for fuel tanks
            if (component.type === 'fuel_tank') {
                const fuelMass = (component.fuel_weight || 0) * fuelPercentage;
                mass = (component.empty_weight || 0) + fuelMass;
            } 
            // Special handling for internal fuel in the airframe
            else if (component.internal_fuel_kg) {
                const internalFuelMass = (component.internal_fuel_kg || 0) * fuelPercentage;
                // Add the airframe structure itself
                massPoints.push({ mass: component.base_weight || mass, position: position });
                // Add the internal fuel as a separate mass point near the wing root
                massPoints.push({ mass: internalFuelMass, position: [position[0] + 0.5, position[1], position[2] - 0.1] }); // Assuming fuel is slightly behind and below the airframe's own CG
                continue; // Skip the generic push at the end
            }

            if (mass > 0) {
                massPoints.push({ mass, position });
            }
        }

        let totalMass = 0;
        const moment = [0, 0, 0]; // [x, y, z]

        for (const point of massPoints) {
            totalMass += point.mass;
            moment[0] += point.mass * point.position[0]; // X-axis (longitudinal)
            moment[1] += point.mass * point.position[1]; // Y-axis (lateral)
            moment[2] += point.mass * point.position[2]; // Z-axis (vertical)
        }

        if (totalMass === 0) {
            return { totalMass: 0, cg: [0, 0, 0], warnings: ['Total mass is zero.'] };
        }

        const cg = [
            moment[0] / totalMass,
            moment[1] / totalMass,
            moment[2] / totalMass
        ];

        console.log(`CG Calculated at ${fuelPercentage * 100}% fuel: Mass = ${totalMass.toFixed(2)}kg, CG = [${cg[0].toFixed(3)}, ${cg[1].toFixed(3)}, ${cg[2].toFixed(3)}]`);

        return {
            totalMass: totalMass,
            cg: cg,
            warnings: []
        };
    }
}

// Export a singleton instance for other modules that expect it.
export const centerOfGravity = new CenterOfGravitySystem();