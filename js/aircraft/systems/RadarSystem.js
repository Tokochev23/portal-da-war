/**
 * Radar System - War1954 Aircraft Creator
 *
 * Calculates the detection range of an aircraft's radar system against a given target signature.
 * 
 * @version 1.0.0
 */

export class RadarSystem {
    constructor() {
        // A baseline range in km for a typical 1954-era radar against a 1.0 signature target.
        // This constant helps in scaling the radar equation to produce plausible numbers.
        this.BASE_RADAR_RANGE_KM = 20; // km

        console.log('📡 RadarSystem initialized');
    }

    /**
     * Calculates the radar detection range and stores it on the entity.
     * @param {Object} entity - The aircraft entity, containing components.
     * @param {number} targetSignature - The radar signature modifier of the target (e.g., 1.0 for standard, 0.7 for stealthy).
     */
    calculate(entity, targetSignature = 1.0) {
        if (!entity || !entity.components) return;

        // Find the installed radar component.
        const radar = entity.components.find(c => c.type === 'radar' || c.type === 'fcs_radar');

        let detectionRange = 0;

        if (radar && radar.radar_power > 0) {
            // Ensure target signature is not zero to avoid division by zero.
            const effectiveSignature = Math.max(0.01, targetSignature);

            // Simplified radar range equation:
            // Range is proportional to the 4th root of (Power / Signature).
            const ratio = radar.radar_power / effectiveSignature;
            const rangeFactor = Math.pow(ratio, 0.25); // 0.25 is the 4th root

            detectionRange = this.BASE_RADAR_RANGE_KM * rangeFactor;
        }

        // Ensure performance object exists
        if (!entity.performance) {
            entity.performance = {};
        }

        entity.performance.radarDetectionRange = detectionRange;

        if (radar) {
            console.log(`Radar Calculated: Range = ${detectionRange.toFixed(2)}km against signature ${targetSignature}`);
        }
    }
}
