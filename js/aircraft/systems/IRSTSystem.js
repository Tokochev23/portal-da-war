/**
 * IRST System - War1954 Aircraft Creator
 *
 * Calculates the detection range of an aircraft's Infrared Search and Track (IRST) system.
 * 
 * @version 1.0.0
 */

export class IRSTSystem {
    constructor() {
        // A baseline range in km for a typical 1950s IRST against a standard jet engine target.
        this.BASE_IRST_RANGE_KM = 8; // km

        console.log('🔥 IRSTSystem initialized');
    }

    /**
     * Calculates the IRST detection range and stores it on the entity.
     * @param {Object} entity - The aircraft entity, containing components.
     * @param {number} targetHeatSignature - A value representing the target's heat output (e.g., based on engine thrust).
     */
    calculate(entity, targetHeatSignature = 1.0) {
        if (!entity || !entity.components) return;

        // Find the installed IRST component.
        const irst = entity.components.find(c => c.type === 'irst');

        let detectionRange = 0;

        if (irst && irst.sensitivity > 0) {
            // Ensure target heat signature is not zero.
            const effectiveHeat = Math.max(0.1, targetHeatSignature);

            // Simplified IRST range equation: Range is proportional to (Sensitivity * Heat).
            const rangeFactor = irst.sensitivity * effectiveHeat;

            detectionRange = this.BASE_IRST_RANGE_KM * rangeFactor;
        }

        // Ensure performance object exists
        if (!entity.performance) {
            entity.performance = {};
        }

        entity.performance.irstDetectionRange = detectionRange;

        if (irst) {
            console.log(`IRST Calculated: Range = ${detectionRange.toFixed(2)}km against heat signature ${targetHeatSignature}`);
        }
    }
}
