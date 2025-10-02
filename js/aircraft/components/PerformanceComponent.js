/**
 * Performance Component - War1954 Aircraft Creator
 *
 * ECS component that holds comprehensive aircraft performance data.
 * This component stores calculated performance metrics that are computed
 * by the PerformanceSystem based on other aircraft components.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

/**
 * Performance component containing all calculated aircraft performance metrics
 */
export class PerformanceComponent {
    constructor() {
        // Basic flight performance
        this.maxSpeed = {
            seaLevel: 0,        // km/h at sea level
            altitude: 0,        // km/h at optimal altitude
            optimalAltitude: 0, // meters
            mach: 0            // Mach number at max speed
        };

        this.cruiseSpeed = {
            speed: 0,          // km/h
            altitude: 0,       // meters
            fuelEfficiency: 0  // km per kg of fuel
        };

        this.stallSpeed = {
            clean: 0,          // km/h with gear up, flaps up
            landing: 0,        // km/h with gear down, flaps full
            takeoff: 0         // km/h with takeoff configuration
        };

        // Climb and ceiling performance
        this.climbRate = {
            seaLevel: 0,       // m/s at sea level
            initial: 0,        // m/s initial climb
            sustained: 0,      // m/s sustained climb
            timeTo10k: 0       // seconds to 10,000m
        };

        this.ceiling = {
            service: 0,        // meters (climb rate > 0.5 m/s)
            absolute: 0,       // meters (theoretical maximum)
            combat: 0          // meters (effective combat altitude)
        };

        // Range and endurance
        this.range = {
            maximum: 0,        // km with max fuel, optimal conditions
            combat: 0,         // km with combat load
            ferry: 0,          // km with external tanks
            tactical: 0        // km with standard loadout
        };

        this.endurance = {
            maximum: 0,        // hours with max fuel
            combat: 0,         // hours with combat load
            patrol: 0          // hours on patrol configuration
        };

        // Maneuverability
        this.maneuverability = {
            gLimit: 0,         // Maximum G-force
            rollRate: 0,       // degrees per second
            turnRate: 0,       // degrees per second (sustained)
            turnRadius: 0,     // meters at best turn speed
            instantTurnRate: 0 // degrees per second (instantaneous)
        };

        // Weight and balance
        this.weight = {
            empty: 0,          // kg - aircraft without fuel, weapons, crew
            loaded: 0,         // kg - current configuration
            maximum: 0,        // kg - maximum takeoff weight
            fuel: 0,           // kg - current fuel weight
            payload: 0         // kg - weapons and equipment
        };

        this.balance = {
            centerOfGravity: 0,    // % MAC
            stability: 'unknown', // 'optimal', 'acceptable', 'warning', 'critical'
            longitudinal: true,    // longitudinally stable
            directional: true      // directionally stable
        };

        // Power and efficiency
        this.power = {
            totalThrust: 0,        // kgf or HP depending on engine type
            thrustToWeight: 0,     // ratio
            powerLoading: 0,       // kg per kW or HP
            wingLoading: 0,        // kg per m²
            diskLoading: 0         // kg per m² (helicopters)
        };

        this.efficiency = {
            fuelConsumption: {
                cruise: 0,         // kg/h at cruise
                combat: 0,         // kg/h at combat power
                economy: 0         // kg/h at economy cruise
            },
            energySpecific: 0,     // m²/s² (specific energy)
            powerSpecific: 0       // W/kg (specific power)
        };

        // Takeoff and landing performance
        this.takeoff = {
            distance: 0,           // meters ground roll
            distanceToObstacle: 0, // meters to 15m obstacle
            speed: 0,              // km/h rotation speed
            groundRoll: 0          // meters to liftoff
        };

        this.landing = {
            distance: 0,           // meters ground roll
            distanceFromObstacle: 0, // meters from 15m obstacle
            speed: 0,              // km/h touchdown speed
            groundRoll: 0          // meters after touchdown
        };

        // Combat performance
        this.combat = {
            turnFightRating: 0,    // 0-100 dogfight capability
            boomZoomRating: 0,     // 0-100 energy fighting capability
            interceptorRating: 0,  // 0-100 interception capability
            attackRating: 0,       // 0-100 ground attack capability
            survivabilityRating: 0 // 0-100 survivability rating
        };

        // Operational characteristics
        this.operational = {
            maintenanceHours: 0,   // hours per flight hour
            reliabilityFactor: 0,  // 0-1 reliability rating
            operationalCost: 0,    // currency per flight hour
            pilotDemand: 0,        // 0-100 pilot skill required
            weatherLimits: {
                maxWind: 0,        // km/h maximum crosswind
                visibility: 0,     // km minimum visibility
                cloudCeiling: 0    // meters minimum ceiling
            }
        };

        // Radar and signatures
        this.signatures = {
            radarCrossSection: 1.0, // m² RCS
            infraredSignature: 1.0, // relative IR signature
            visualSignature: 1.0,   // relative visual signature
            acousticSignature: 1.0  // relative noise signature
        };

        // Special capabilities
        this.capabilities = {
            carrierCompatible: false,    // aircraft carrier operations
            roughFieldCapable: false,    // unprepared airstrip ops
            allWeatherCapable: false,    // IFR/night operations
            airRefuelCapable: false,     // in-flight refueling
            nuclearHardened: false       // nuclear environment ops
        };

        // Performance at different altitudes
        this.altitudePerformance = new Map(); // altitude -> performance metrics

        // Performance with different loadouts
        this.loadoutPerformance = new Map(); // loadout -> performance metrics

        // Calculation metadata
        this.calculationMeta = {
            lastUpdated: null,
            calculationVersion: '1.0.0',
            dataSource: 'calculated',
            confidence: 1.0,           // 0-1 confidence in calculations
            assumptions: []            // list of assumptions made
        };

        console.log('📊 PerformanceComponent created');
    }

    /**
     * Updates a specific performance metric
     * @param {string} category - Performance category (e.g., 'maxSpeed', 'weight')
     * @param {string} metric - Specific metric (e.g., 'seaLevel', 'empty')
     * @param {number} value - New value
     */
    updateMetric(category, metric, value) {
        if (this[category] && typeof this[category] === 'object') {
            this[category][metric] = value;
        } else {
            this[category] = value;
        }
        this.calculationMeta.lastUpdated = Date.now();
    }

    /**
     * Gets a specific performance metric
     * @param {string} category - Performance category
     * @param {string} metric - Specific metric (optional)
     * @returns {*} The requested value
     */
    getMetric(category, metric = null) {
        if (metric && this[category] && typeof this[category] === 'object') {
            return this[category][metric];
        }
        return this[category];
    }

    /**
     * Updates performance for a specific altitude
     * @param {number} altitude - Altitude in meters
     * @param {Object} performance - Performance metrics at this altitude
     */
    setAltitudePerformance(altitude, performance) {
        this.altitudePerformance.set(altitude, {
            ...performance,
            altitude: altitude
        });
    }

    /**
     * Gets performance at a specific altitude
     * @param {number} altitude - Altitude in meters
     * @returns {Object} Performance metrics at altitude
     */
    getAltitudePerformance(altitude) {
        return this.altitudePerformance.get(altitude);
    }

    /**
     * Updates performance for a specific loadout
     * @param {string} loadoutId - Loadout identifier
     * @param {Object} performance - Performance metrics with this loadout
     */
    setLoadoutPerformance(loadoutId, performance) {
        this.loadoutPerformance.set(loadoutId, {
            ...performance,
            loadout: loadoutId
        });
    }

    /**
     * Gets performance with a specific loadout
     * @param {string} loadoutId - Loadout identifier
     * @returns {Object} Performance metrics with loadout
     */
    getLoadoutPerformance(loadoutId) {
        return this.loadoutPerformance.get(loadoutId);
    }

    /**
     * Calculates overall aircraft rating based on role
     * @param {string} role - Aircraft role ('fighter', 'attacker', 'bomber', etc.)
     * @returns {number} Overall rating 0-100
     */
    calculateOverallRating(role = 'fighter') {
        const ratings = {
            fighter: () => {
                return (
                    this.combat.turnFightRating * 0.3 +
                    this.combat.boomZoomRating * 0.2 +
                    this.maneuverability.gLimit * 5 +
                    Math.min(this.maxSpeed.seaLevel / 10, 100) * 0.2 +
                    this.power.thrustToWeight * 30
                ) / 5;
            },
            attacker: () => {
                return (
                    this.combat.attackRating * 0.4 +
                    this.weight.payload / this.weight.maximum * 100 * 0.3 +
                    Math.min(this.range.combat / 10, 100) * 0.2 +
                    this.operational.reliabilityFactor * 100 * 0.1
                );
            },
            bomber: () => {
                return (
                    this.weight.payload / this.weight.maximum * 100 * 0.4 +
                    Math.min(this.range.maximum / 20, 100) * 0.3 +
                    this.ceiling.service / 150 * 0.2 +
                    this.operational.reliabilityFactor * 100 * 0.1
                );
            },
            transport: () => {
                return (
                    this.weight.payload / this.weight.maximum * 100 * 0.3 +
                    Math.min(this.range.maximum / 15, 100) * 0.3 +
                    this.operational.reliabilityFactor * 100 * 0.2 +
                    (100 - this.operational.pilotDemand) * 0.2
                );
            },
            reconnaissance: () => {
                return (
                    Math.min(this.maxSpeed.altitude / 12, 100) * 0.3 +
                    this.ceiling.service / 150 * 0.3 +
                    Math.min(this.range.maximum / 15, 100) * 0.2 +
                    (2.0 - this.signatures.radarCrossSection) * 50 * 0.2
                );
            }
        };

        const calculator = ratings[role] || ratings.fighter;
        return Math.max(0, Math.min(100, calculator()));
    }

    /**
     * Exports performance data for saving/analysis
     * @returns {Object} Serializable performance data
     */
    exportData() {
        return {
            maxSpeed: { ...this.maxSpeed },
            cruiseSpeed: { ...this.cruiseSpeed },
            stallSpeed: { ...this.stallSpeed },
            climbRate: { ...this.climbRate },
            ceiling: { ...this.ceiling },
            range: { ...this.range },
            endurance: { ...this.endurance },
            maneuverability: { ...this.maneuverability },
            weight: { ...this.weight },
            balance: { ...this.balance },
            power: { ...this.power },
            efficiency: { ...this.efficiency },
            takeoff: { ...this.takeoff },
            landing: { ...this.landing },
            combat: { ...this.combat },
            operational: { ...this.operational },
            signatures: { ...this.signatures },
            capabilities: { ...this.capabilities },
            altitudePerformance: Object.fromEntries(this.altitudePerformance),
            loadoutPerformance: Object.fromEntries(this.loadoutPerformance),
            calculationMeta: { ...this.calculationMeta }
        };
    }

    /**
     * Imports performance data from saved state
     * @param {Object} data - Performance data to import
     */
    importData(data) {
        Object.keys(data).forEach(key => {
            if (key === 'altitudePerformance') {
                this.altitudePerformance = new Map(Object.entries(data[key]));
            } else if (key === 'loadoutPerformance') {
                this.loadoutPerformance = new Map(Object.entries(data[key]));
            } else if (this.hasOwnProperty(key) && typeof this[key] === 'object') {
                Object.assign(this[key], data[key]);
            } else {
                this[key] = data[key];
            }
        });
        this.calculationMeta.lastUpdated = Date.now();
    }

    /**
     * Validates performance data consistency
     * @returns {Object} Validation result with warnings and errors
     */
    validate() {
        const warnings = [];
        const errors = [];

        // Basic sanity checks
        if (this.maxSpeed.seaLevel <= 0) {
            errors.push('Max speed at sea level must be positive');
        }

        if (this.weight.empty <= 0) {
            errors.push('Empty weight must be positive');
        }

        if (this.weight.loaded < this.weight.empty) {
            errors.push('Loaded weight cannot be less than empty weight');
        }

        if (this.weight.loaded > this.weight.maximum) {
            warnings.push('Loaded weight exceeds maximum takeoff weight');
        }

        if (this.balance.centerOfGravity < 0.1 || this.balance.centerOfGravity > 0.6) {
            warnings.push('Center of gravity outside normal range');
        }

        if (this.power.thrustToWeight < 0.1) {
            warnings.push('Very low thrust-to-weight ratio');
        }

        if (this.stallSpeed.clean >= this.maxSpeed.seaLevel * 0.8) {
            warnings.push('Stall speed very close to max speed');
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Gets a summary of key performance metrics
     * @returns {Object} Summary metrics for display
     */
    getSummary() {
        return {
            maxSpeed: this.maxSpeed.seaLevel,
            climbRate: this.climbRate.seaLevel,
            ceiling: this.ceiling.service,
            range: this.range.maximum,
            weight: this.weight.loaded,
            thrustToWeight: this.power.thrustToWeight,
            wingLoading: this.power.wingLoading,
            overallRating: this.calculateOverallRating()
        };
    }
}

// Export for ECS registration
export const PERFORMANCE_COMPONENT_TYPE = 'Performance';

console.log('📊 PerformanceComponent module loaded');