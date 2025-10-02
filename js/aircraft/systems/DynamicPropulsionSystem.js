/**
 * Dynamic Propulsion System - War1954 Aircraft Creator
 *
 * Calculates the dynamic effects of altitude, afterburners, and thrust vectoring on engine performance.
 * 
 * @version 2.1.0 (Added Afterburner and TVC logic)
 */

export class DynamicPropulsionSystem {
    constructor() {
        // ISA (International Standard Atmosphere) model constants
        this.SEA_LEVEL_DENSITY = 1.225; // kg/m³
        console.log('🚀 DynamicPropulsionSystem initialized');
    }

    /**
     * Calculates the air density at a given altitude using a simplified ISA model.
     * @param {number} altitude - Altitude in meters.
     * @returns {number} Air density in kg/m³.
     */
    getDensityAtAltitude(altitude) {
        const h = Math.max(0, altitude);
        if (h <= 11000) { // Troposphere
            const temperature = 288.15 - 0.0065 * h;
            const pressure = 101325 * Math.pow(1 - 0.0065 * h / 288.15, 5.2561);
            return pressure / (287.058 * temperature);
        } else { // Simplified stratosphere
            const temperature = 216.65;
            const pressure = 22632 * Math.exp(-0.0001577 * (h - 11000));
            return pressure / (287.058 * temperature);
        }
    }

    /**
     * Calculates the current thrust and fuel consumption of an aircraft's engines.
     * This method mutates the entity, adding the results to entity.performance.
     * 
     * @param {Object} entity - The aircraft entity, containing components.
     * @param {number} altitude - The current altitude in meters.
     * @param {boolean} afterburnerActive - Whether the afterburner is engaged.
     * @param {number} thrustVectoringAngle - The angle of thrust vectoring in degrees.
     */
    calculate(entity, altitude = 0, afterburnerActive = false, thrustVectoringAngle = 0) {
        if (!entity || !entity.components) return;

        const engines = entity.components.filter(c => c.category && (c.category.includes('engine') || c.category.includes('piston')));
        
        // Ensure performance object exists
        if (!entity.performance) {
            entity.performance = {};
        }

        if (engines.length === 0) {
            entity.performance.currentThrust = 0;
            entity.performance.currentFuelConsumption = 0;
            entity.performance.maneuveringThrust = 0;
            return;
        }

        const densityRatio = this.getDensityAtAltitude(altitude) / this.SEA_LEVEL_DENSITY;
        let totalThrust = 0;
        let totalFuelConsumption = 0;
        let totalManeuveringThrust = 0;

        for (const engine of engines) {
            let thrust = 0;
            let fuelConsumption = 0;

            // 1. Determine base thrust and fuel consumption based on afterburner status
            if (afterburnerActive && engine.afterburner_thrust) {
                thrust = engine.afterburner_thrust;
                fuelConsumption = engine.afterburner_fuel_consumption || (engine.fuel_consumption * 3); // Fallback to a multiplier
            } else {
                thrust = engine.thrust || engine.power_kgf || 0;
                fuelConsumption = engine.fuel_consumption || engine.fuel_consumption_full || 0;
            }

            // 2. Apply altitude effects
            if (engine.type.includes('piston')) {
                const ratedAltitude = engine.supercharger_altitude_m || 0;
                if (altitude > ratedAltitude) {
                    const altitudeDelta = altitude - ratedAltitude;
                    const powerLossFactor = Math.max(0.1, 1 - (altitudeDelta / 300) * 0.03);
                    thrust *= powerLossFactor;
                }
            } else { // Jet engines
                thrust *= densityRatio;
            }

            // 3. Apply thrust vectoring effects
            if (thrustVectoringAngle > 0 && engine.hasThrustVectoring) {
                const angleRadians = (thrustVectoringAngle * Math.PI) / 180;
                const maneuveringThrustComponent = thrust * Math.sin(angleRadians);
                totalManeuveringThrust += maneuveringThrustComponent;
                thrust = thrust * Math.cos(angleRadians); // Forward thrust is reduced
            }

            totalThrust += thrust;
            totalFuelConsumption += fuelConsumption; // Note: Fuel consumption also varies, but we'll keep it simple for now
        }

        entity.performance.currentThrust = totalThrust;
        entity.performance.currentFuelConsumption = totalFuelConsumption;
        entity.performance.maneuveringThrust = totalManeuveringThrust;

        console.log(`Propulsion Calculated at ${altitude}m (AB: ${afterburnerActive}, TVC: ${thrustVectoringAngle}°): Thrust = ${totalThrust.toFixed(2)}kgf, Maneuvering = ${totalManeuveringThrust.toFixed(2)}kgf`);
    }
}