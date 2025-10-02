/**
 * Unified Calculation System - War1954 Aircraft Creator
 *
 * Master system that orchestrates the calculation pipeline, ensuring systems run in the correct order
 * and that data flows between them.
 * 
 * @version 2.1.0 (Integrated Electronic Warfare Systems)
 */

// Import the system classes
import { PerformanceCalculationSystem } from './PerformanceCalculationSystem.js';
import { CostCalculationSystem } from './CostCalculationSystem.js';
import { CenterOfGravitySystem } from './CenterOfGravity.js';
import { DynamicPropulsionSystem } from './DynamicPropulsionSystem.js';
import { RadarSystem } from './RadarSystem.js';
import { IRSTSystem } from './IRSTSystem.js';
import { CountermeasuresSystem } from './CountermeasuresSystem.js';

export class UnifiedCalculationSystem {
    constructor() {
        // Instantiate all the systems this orchestrator will use
        this.centerOfGravitySystem = new CenterOfGravitySystem();
        this.dynamicPropulsionSystem = new DynamicPropulsionSystem();
        this.costCalculationSystem = new CostCalculationSystem();
        this.performanceCalculationSystem = new PerformanceCalculationSystem();
        this.radarSystem = new RadarSystem();
        this.irstSystem = new IRSTSystem();
        this.countermeasuresSystem = new CountermeasuresSystem();

        console.log('🎯 UnifiedCalculationSystem initialized and owns instances of all calculation subsystems.');
    }

    /**
     * Runs the entire calculation pipeline in the correct, dependent order.
     * @param {Object} entity - The aircraft entity, containing a `components` array.
     * @param {Object} conditions - Flight conditions like altitude, afterburner status, etc.
     * @returns {Object} The same entity, now populated with calculation results.
     */
    runCalculations(entity, conditions = { altitude: 0, afterburnerActive: false, thrustVectoringAngle: 0 }) {
        console.log(`🎯 Running unified calculations for entity: ${entity.name || 'Unnamed Aircraft'}`);
        const startTime = performance.now();

        if (!entity || !entity.components) {
            console.error('Calculation failed: Entity or entity.components is missing.');
            return entity;
        }

        // --- STAGE 1: Mass and Balance ---
        this.centerOfGravitySystem.calculate(entity); // Calculates CG at 100% fuel

        // --- STAGE 2: Propulsion ---
        this.dynamicPropulsionSystem.calculate(entity, conditions.altitude, conditions.afterburnerActive, conditions.thrustVectoringAngle);

        // --- STAGE 3: Cost ---
        this.costCalculationSystem.calculate(entity);

        // --- STAGE 4: Performance ---
        this.performanceCalculationSystem.calculate(entity);
        
        // --- STAGE 5: Signatures & Electronic Warfare ---
        this._calculateSignaturesAndEW(entity);

        const executionTime = performance.now() - startTime;
        console.log(`✅ Unified calculation completed in ${executionTime.toFixed(1)}ms`);

        return entity;
    }

    /**
     * Private helper to run all signature and EW calculations.
     * @param {Object} entity 
     */
    _calculateSignaturesAndEW(entity) {
        // --- A: Calculate own signatures ---
        if (!entity.signatures) entity.signatures = {};

        // Radar Signature: Sum of all component modifiers.
        entity.signatures.radarCrossSection = entity.components.reduce((total, c) => total + (c.radarSignatureModifier || 0), 0);

        // Heat Signature: Proportional to current engine thrust.
        const heatFromThrust = (entity.performance?.currentThrust || 0) / 1000; // Baseline
        entity.signatures.heatSignature = heatFromThrust;

        // --- B: Calculate sensor performance ---
        // For now, we calculate against a "standard" target.
        const standardRadarTarget = 1.0;
        const standardHeatTarget = 4.0; // A jet at military power

        this.radarSystem.calculate(entity, standardRadarTarget);
        this.irstSystem.calculate(entity, standardHeatTarget);

        // --- C: Calculate countermeasures ---
        this.countermeasuresSystem.calculate(entity);

        console.log(`EW Calculated: RCS=${entity.signatures.radarCrossSection.toFixed(2)}, Heat=${entity.signatures.heatSignature.toFixed(2)}`);
    }
}