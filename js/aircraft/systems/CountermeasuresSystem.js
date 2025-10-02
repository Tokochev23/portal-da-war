/**
 * Countermeasures System - War1954 Aircraft Creator
 *
 * Calculates the effectiveness and capacity of an aircraft's defensive countermeasures (Chaff, Flares).
 * 
 * @version 1.0.0
 */

export class CountermeasuresSystem {
    constructor() {
        console.log('🛡️ CountermeasuresSystem initialized');
    }

    /**
     * Calculates the effectiveness and capacity of installed countermeasures and stores it on the entity.
     * @param {Object} entity - The aircraft entity, containing components.
     */
    calculate(entity) {
        if (!entity || !entity.components) return;

        // Find installed countermeasure dispensers
        const chaffDispenser = entity.components.find(c => c.name === 'Dispensador de Chaff');
        const flareDispenser = entity.components.find(c => c.name === 'Dispensador de Flares');

        let chaffEffectiveness = 0;
        let chaffCapacity = 0;
        let flareEffectiveness = 0;
        let flareCapacity = 0;

        if (chaffDispenser) {
            chaffEffectiveness = chaffDispenser.effectiveness || 0;
            chaffCapacity = chaffDispenser.capacity || 0;
        }

        if (flareDispenser) {
            flareEffectiveness = flareDispenser.effectiveness || 0;
            flareCapacity = flareDispenser.capacity || 0;
        }

        // Ensure performance object exists
        if (!entity.performance) {
            entity.performance = {};
        }

        entity.performance.chaffEffectiveness = chaffEffectiveness;
        entity.performance.chaffCapacity = chaffCapacity;
        entity.performance.flareEffectiveness = flareEffectiveness;
        entity.performance.flareCapacity = flareCapacity;

        if (chaffDispenser || flareDispenser) {
            console.log(`Countermeasures Calculated: Chaff (${chaffCapacity} uses, ${chaffEffectiveness * 100}% effective), Flares (${flareCapacity} uses, ${flareEffectiveness * 100}% effective)`);
        }
    }
}
