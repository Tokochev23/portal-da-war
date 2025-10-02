/**
 * Performance Calculation System - War1954 Aircraft Creator
 *
 * Advanced system that calculates comprehensive aircraft performance metrics
 * based on all aircraft components. This replaces the scattered calculation
 * logic with a unified, physics-based approach.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { PerformanceComponent } from '../components/PerformanceComponent.js';

export class PerformanceCalculationSystem {
    constructor() {
        this.initialized = false;

        // Physical constants
        this.constants = {
            gravityAcceleration: 9.81,          // m/s²
            airDensitySeaLevel: 1.225,          // kg/m³
            standardTemperature: 288.15,        // K (15°C)
            standardPressure: 101325,           // Pa
            gasConstant: 287.05,                // J/(kg·K) for dry air
            soundSpeedSeaLevel: 343,            // m/s
            earthRadius: 6371000                // meters
        };

        // Atmospheric model coefficients
        this.atmosphere = {
            temperatureLapseRate: 0.0065,       // K/m
            troposphereHeight: 11000,           // m
            stratosphereHeight: 20000           // m
        };

        console.log('🧮 PerformanceCalculationSystem initialized');
    }

    /**
     * Calculates comprehensive performance for an aircraft entity
     * @param {Object} aircraft - Aircraft entity with components
     * @returns {PerformanceComponent} Calculated performance component
     */
    calculatePerformance(aircraft) {
        const performance = new PerformanceComponent();

        try {
            // Extract components
            const structure = aircraft.structure || {};
            const propulsion = aircraft.propulsion || {};
            const wings = aircraft.wings || {};
            const avionics = aircraft.avionics || {};
            const weapons = aircraft.weapons || {};

            // Get detailed component data
            const airframeData = this.getAirframeData(structure.airframe);
            const engineData = this.getEngineData(propulsion.engines);
            const wingData = this.getWingData(wings);

            if (!airframeData || !engineData) {
                console.warn('⚠️ Missing critical aircraft data for performance calculation');
                return performance;
            }

            // Calculate basic metrics
            this.calculateWeightAndBalance(performance, aircraft, airframeData, engineData);
            this.calculatePowerMetrics(performance, engineData, propulsion);
            this.calculateAerodynamics(performance, airframeData, wingData, aircraft);
            this.calculateSpeedPerformance(performance, airframeData, engineData);
            this.calculateClimbAndCeiling(performance, engineData, airframeData);
            this.calculateRangeAndEndurance(performance, engineData, airframeData, propulsion);
            this.calculateManeuverability(performance, airframeData, wingData);
            this.calculateTakeoffLanding(performance, airframeData, engineData);
            this.calculateCombatRatings(performance, aircraft);
            this.calculateOperationalCharacteristics(performance, aircraft);
            this.calculateSignatures(performance, aircraft);

            // Performance at different altitudes
            this.calculateAltitudePerformance(performance, engineData, airframeData);

            // Performance with different loadouts
            this.calculateLoadoutPerformance(performance, aircraft);

            // Mark as calculated
            performance.calculationMeta.lastUpdated = Date.now();
            performance.calculationMeta.dataSource = 'calculated';
            performance.calculationMeta.confidence = this.assessCalculationConfidence(aircraft);

            console.log('✅ Performance calculation completed');

        } catch (error) {
            console.error('❌ Performance calculation failed:', error);
            performance.calculationMeta.lastUpdated = Date.now();
            performance.calculationMeta.confidence = 0;
            performance.calculationMeta.assumptions.push(`Calculation failed: ${error.message}`);
        }

        return performance;
    }

    /**
     * Calculates weight and balance metrics
     */
    calculateWeightAndBalance(performance, aircraft, airframeData, engineData) {
        // Empty weight calculation
        let emptyWeight = airframeData.baseWeight || 0;

        // Add engine weight
        const engineCount = aircraft.propulsion?.engineCount || 1;
        emptyWeight += (engineData.weight || 0) * engineCount;

        // Add avionics weight
        if (aircraft.avionics?.length > 0) {
            emptyWeight += aircraft.avionics.reduce((total, avionicId) => {
                const avionic = this.getAvionicsData(avionicId);
                return total + (avionic?.weight || 0);
            }, 0);
        }

        // Add structural material modifier
        if (aircraft.structure?.material) {
            const material = this.getMaterialData(aircraft.structure.material);
            if (material) {
                emptyWeight *= material.modifiers.weight;
            }
        }

        // Current fuel weight
        const fuelWeight = aircraft.propulsion?.currentFuel || 0;

        // Weapons and payload weight
        let payloadWeight = 0;
        if (aircraft.weapons?.length > 0) {
            payloadWeight = aircraft.weapons.reduce((total, weaponId) => {
                const weapon = this.getWeaponData(weaponId);
                return total + (weapon?.weight || 0);
            }, 0);
        }

        // Total loaded weight
        const loadedWeight = emptyWeight + fuelWeight + payloadWeight;

        // Maximum takeoff weight
        const maxWeight = airframeData.maxTakeoffWeight || loadedWeight * 1.3;

        // Update performance component
        performance.weight.empty = emptyWeight;
        performance.weight.fuel = fuelWeight;
        performance.weight.payload = payloadWeight;
        performance.weight.loaded = loadedWeight;
        performance.weight.maximum = maxWeight;

        // Center of gravity (using CenterOfGravity system if available)
        if (window.centerOfGravity) {
            const cgResult = window.centerOfGravity.calculateCG(aircraft);
            performance.balance.centerOfGravity = cgResult.position.percentMAC;
            performance.balance.stability = cgResult.stability.level;
            performance.balance.longitudinal = cgResult.stability.level !== 'critical';
            performance.balance.directional = true; // Simplified assumption
        }

        console.log(`⚖️ Weight calculated: ${Math.round(loadedWeight)}kg (empty: ${Math.round(emptyWeight)}kg)`);
    }

    /**
     * Calculates power and thrust metrics
     */
    calculatePowerMetrics(performance, engineData, propulsion) {
        const engineCount = propulsion.engineCount || 1;
        const isPistonEngine = engineData.type && engineData.type.includes('piston');

        let totalPower = 0;
        let powerUnit = '';

        if (isPistonEngine) {
            totalPower = (engineData.powerHP || 0) * engineCount;
            powerUnit = 'HP';
        } else {
            totalPower = (engineData.militaryThrust || engineData.thrust || 0) * engineCount;
            powerUnit = 'kgf';
        }

        // Thrust-to-weight ratio
        const thrustToWeight = performance.weight.loaded > 0 ?
            (isPistonEngine ? totalPower * 0.75 : totalPower) / performance.weight.loaded : 0;

        // Power loading (kg per HP or kW)
        const powerLoading = totalPower > 0 ? performance.weight.loaded / totalPower : 0;

        performance.power.totalThrust = totalPower;
        performance.power.thrustToWeight = thrustToWeight;
        performance.power.powerLoading = powerLoading;

        console.log(`🚀 Power: ${Math.round(totalPower)} ${powerUnit}, T/W: ${thrustToWeight.toFixed(2)}`);
    }

    /**
     * Calculates aerodynamic characteristics
     */
    calculateAerodynamics(performance, airframeData, wingData, aircraft) {
        // Wing loading calculation
        const wingArea = airframeData.wingArea || wingData.area || 20; // m²
        const wingLoading = wingArea > 0 ? performance.weight.loaded / wingArea : 0;

        performance.power.wingLoading = wingLoading;

        // Drag coefficient estimation
        const baseDragCoeff = this.estimateDragCoefficient(airframeData, wingData, aircraft);

        // Lift coefficient estimation
        const maxLiftCoeff = this.estimateMaxLiftCoefficient(wingData, aircraft);

        // Store for use in other calculations
        performance.calculationMeta.aerodynamics = {
            wingArea,
            baseDragCoeff,
            maxLiftCoeff,
            wingLoading
        };

        console.log(`🌪️ Wing loading: ${wingLoading.toFixed(1)} kg/m²`);
    }

    /**
     * Calculates speed performance at different conditions
     */
    calculateSpeedPerformance(performance, airframeData, engineData) {
        const aerodynamics = performance.calculationMeta.aerodynamics;
        const isPistonEngine = engineData.type && engineData.type.includes('piston');

        // Maximum speed calculation using simplified drag/thrust balance
        let maxSpeedSeaLevel = 0;
        let maxSpeedAltitude = 0;
        let optimalAltitude = 0;

        if (isPistonEngine) {
            // Piston engine performance
            const powerHP = engineData.powerHP || 0;
            const engineCount = performance.power.totalThrust / powerHP;

            // Simplified speed calculation for piston aircraft
            maxSpeedSeaLevel = Math.sqrt(
                (powerHP * engineCount * 745.7 * 0.8) / // 80% prop efficiency
                (0.5 * this.constants.airDensitySeaLevel * aerodynamics.wingArea * aerodynamics.baseDragCoeff)
            ) * 3.6; // Convert m/s to km/h

            // Piston engines perform best at medium altitudes
            optimalAltitude = 6000; // meters
            maxSpeedAltitude = maxSpeedSeaLevel * 1.15; // 15% faster at altitude

        } else {
            // Jet engine performance
            const thrustKgf = engineData.militaryThrust || engineData.thrust || 0;
            const engineCount = performance.power.totalThrust / thrustKgf;

            // Simplified speed calculation for jet aircraft
            maxSpeedSeaLevel = Math.sqrt(
                (thrustKgf * engineCount * this.constants.gravityAcceleration) /
                (0.5 * this.constants.airDensitySeaLevel * aerodynamics.wingArea * aerodynamics.baseDragCoeff)
            ) * 3.6; // Convert m/s to km/h

            // Jet engines perform better at high altitude
            optimalAltitude = 10000; // meters
            const altitudeDensity = this.getAirDensity(optimalAltitude);
            maxSpeedAltitude = Math.sqrt(
                (thrustKgf * engineCount * this.constants.gravityAcceleration) /
                (0.5 * altitudeDensity * aerodynamics.wingArea * aerodynamics.baseDragCoeff)
            ) * 3.6;
        }

        // Limit by airframe structural limits
        maxSpeedSeaLevel = Math.min(maxSpeedSeaLevel, airframeData.maxSpeedKph || 2000);
        maxSpeedAltitude = Math.min(maxSpeedAltitude, airframeData.maxSpeedKph || 2000);

        // Mach number at max speed
        const machNumber = maxSpeedAltitude / (this.getSoundSpeed(optimalAltitude) * 3.6);

        // Cruise speed (typically 75-85% of max speed)
        const cruiseSpeed = maxSpeedSeaLevel * 0.8;
        const cruiseAltitude = optimalAltitude * 0.7;

        // Stall speeds
        const stallSpeedClean = this.calculateStallSpeed(performance.weight.loaded, aerodynamics.wingArea, aerodynamics.maxLiftCoeff);
        const stallSpeedLanding = stallSpeedClean * 0.85; // With flaps
        const stallSpeedTakeoff = stallSpeedClean * 0.9;   // With takeoff flaps

        // Update performance component
        performance.maxSpeed.seaLevel = maxSpeedSeaLevel;
        performance.maxSpeed.altitude = maxSpeedAltitude;
        performance.maxSpeed.optimalAltitude = optimalAltitude;
        performance.maxSpeed.mach = machNumber;

        performance.cruiseSpeed.speed = cruiseSpeed;
        performance.cruiseSpeed.altitude = cruiseAltitude;

        performance.stallSpeed.clean = stallSpeedClean;
        performance.stallSpeed.landing = stallSpeedLanding;
        performance.stallSpeed.takeoff = stallSpeedTakeoff;

        console.log(`💨 Max speed: ${Math.round(maxSpeedSeaLevel)} km/h (sea level), ${Math.round(maxSpeedAltitude)} km/h (altitude)`);
    }

    /**
     * Calculates climb performance and service ceiling
     */
    calculateClimbAndCeiling(performance, engineData, airframeData) {
        const thrustToWeight = performance.power.thrustToWeight;
        const wingLoading = performance.power.wingLoading;

        // Initial climb rate estimation (simplified)
        const initialClimbRate = Math.max(0, (thrustToWeight - 0.3) * 50); // m/s

        // Sea level climb rate
        const seaLevelClimbRate = initialClimbRate * 0.8;

        // Sustained climb rate (energy management)
        const sustainedClimbRate = seaLevelClimbRate * 0.6;

        // Time to 10,000m (simplified calculation)
        const timeTo10k = sustainedClimbRate > 0 ? 10000 / sustainedClimbRate : 3600;

        // Service ceiling estimation
        let serviceCeiling = 0;
        if (engineData.type && engineData.type.includes('piston')) {
            // Piston engines limited by air density
            serviceCeiling = Math.min(12000, thrustToWeight * 8000);
        } else {
            // Jet engines can go higher
            serviceCeiling = Math.min(18000, thrustToWeight * 12000);
        }

        // Absolute ceiling (theoretical maximum)
        const absoluteCeiling = serviceCeiling * 1.2;

        // Combat ceiling (effective operational altitude)
        const combatCeiling = serviceCeiling * 0.8;

        performance.climbRate.initial = initialClimbRate;
        performance.climbRate.seaLevel = seaLevelClimbRate;
        performance.climbRate.sustained = sustainedClimbRate;
        performance.climbRate.timeTo10k = timeTo10k;

        performance.ceiling.service = serviceCeiling;
        performance.ceiling.absolute = absoluteCeiling;
        performance.ceiling.combat = combatCeiling;

        console.log(`📈 Climb: ${seaLevelClimbRate.toFixed(1)} m/s, Ceiling: ${Math.round(serviceCeiling)}m`);
    }

    /**
     * Calculates range and endurance performance
     */
    calculateRangeAndEndurance(performance, engineData, airframeData, propulsion) {
        const fuelCapacity = propulsion.fuelCapacity || 1000; // kg
        const cruiseSpeed = performance.cruiseSpeed.speed;

        // Fuel consumption estimation
        let cruiseFuelFlow = 0; // kg/h
        let combatFuelFlow = 0; // kg/h

        if (engineData.type && engineData.type.includes('piston')) {
            // Piston engine fuel consumption
            const engineCount = performance.power.totalThrust / (engineData.powerHP || 1);
            cruiseFuelFlow = (engineData.powerHP || 0) * engineCount * 0.2; // kg/h at cruise
            combatFuelFlow = cruiseFuelFlow * 1.8; // Combat power
        } else {
            // Jet engine fuel consumption
            const engineCount = performance.power.totalThrust / (engineData.militaryThrust || engineData.thrust || 1);
            cruiseFuelFlow = (engineData.fuelConsumption || 100) * engineCount * 3600 * 0.6; // kg/h at cruise
            combatFuelFlow = (engineData.fuelConsumption || 100) * engineCount * 3600; // kg/h at military power
        }

        // Range calculations
        const maxRange = cruiseFuelFlow > 0 ? (fuelCapacity * 0.9 / cruiseFuelFlow) * cruiseSpeed : 0;
        const combatRange = combatFuelFlow > 0 ? (fuelCapacity * 0.7 / combatFuelFlow) * cruiseSpeed * 0.8 : 0;
        const ferryRange = maxRange * 1.3; // With external tanks
        const tacticalRange = combatRange * 0.8; // With typical loadout

        // Endurance calculations
        const maxEndurance = cruiseFuelFlow > 0 ? fuelCapacity * 0.9 / cruiseFuelFlow : 0;
        const combatEndurance = combatFuelFlow > 0 ? fuelCapacity * 0.7 / combatFuelFlow : 0;
        const patrolEndurance = maxEndurance * 0.8; // Patrol configuration

        // Fuel efficiency
        const fuelEfficiency = cruiseFuelFlow > 0 ? cruiseSpeed / cruiseFuelFlow : 0;

        performance.range.maximum = maxRange;
        performance.range.combat = combatRange;
        performance.range.ferry = ferryRange;
        performance.range.tactical = tacticalRange;

        performance.endurance.maximum = maxEndurance;
        performance.endurance.combat = combatEndurance;
        performance.endurance.patrol = patrolEndurance;

        performance.cruiseSpeed.fuelEfficiency = fuelEfficiency;

        performance.efficiency.fuelConsumption.cruise = cruiseFuelFlow;
        performance.efficiency.fuelConsumption.combat = combatFuelFlow;
        performance.efficiency.fuelConsumption.economy = cruiseFuelFlow * 0.8;

        console.log(`🛣️ Range: ${Math.round(maxRange)}km max, ${Math.round(combatRange)}km combat`);
    }

    /**
     * Calculates maneuverability characteristics
     */
    calculateManeuverability(performance, airframeData, wingData) {
        const wingLoading = performance.power.wingLoading;
        const thrustToWeight = performance.power.thrustToWeight;

        // G-limit from airframe
        const gLimit = airframeData.gLimit || 6;

        // Roll rate estimation
        const rollRate = Math.max(30, 180 - wingLoading * 3); // deg/s

        // Turn rate calculation (simplified)
        const turnSpeed = performance.stallSpeed.clean * 1.4; // Corner speed
        const turnRate = Math.min(15, Math.sqrt(gLimit * this.constants.gravityAcceleration * 57.3) / (turnSpeed / 3.6));

        // Turn radius at best turn speed
        const turnRadius = (turnSpeed / 3.6) / (turnRate * Math.PI / 180);

        // Instantaneous turn rate (energy bleeding)
        const instantTurnRate = turnRate * 1.3;

        performance.maneuverability.gLimit = gLimit;
        performance.maneuverability.rollRate = rollRate;
        performance.maneuverability.turnRate = turnRate;
        performance.maneuverability.turnRadius = turnRadius;
        performance.maneuverability.instantTurnRate = instantTurnRate;

        console.log(`🔄 Maneuverability: ${gLimit}G, ${turnRate.toFixed(1)}°/s turn`);
    }

    /**
     * Calculates takeoff and landing performance
     */
    calculateTakeoffLanding(performance, airframeData, engineData) {
        const wingLoading = performance.power.wingLoading;
        const thrustToWeight = performance.power.thrustToWeight;
        const stallSpeed = performance.stallSpeed.takeoff;

        // Takeoff distance estimation
        const takeoffSpeed = stallSpeed * 1.2; // Rotation speed
        const groundRollTakeoff = Math.pow(takeoffSpeed / 3.6, 2) / (2 * this.constants.gravityAcceleration * (thrustToWeight - 0.02));
        const takeoffDistance = groundRollTakeoff * 1.2; // To 15m obstacle

        // Landing distance estimation
        const landingSpeed = performance.stallSpeed.landing * 1.3;
        const groundRollLanding = Math.pow(landingSpeed / 3.6, 2) / (2 * this.constants.gravityAcceleration * 0.4); // Braking deceleration
        const landingDistance = groundRollLanding * 1.4; // From 15m obstacle

        performance.takeoff.speed = takeoffSpeed;
        performance.takeoff.groundRoll = groundRollTakeoff;
        performance.takeoff.distance = takeoffDistance;
        performance.takeoff.distanceToObstacle = takeoffDistance;

        performance.landing.speed = landingSpeed;
        performance.landing.groundRoll = groundRollLanding;
        performance.landing.distance = landingDistance;
        performance.landing.distanceFromObstacle = landingDistance;

        // Check for rough field capability
        performance.capabilities.roughFieldCapable = takeoffDistance < 800 && landingDistance < 600;

        console.log(`🛬 Takeoff: ${Math.round(takeoffDistance)}m, Landing: ${Math.round(landingDistance)}m`);
    }

    /**
     * Calculates combat effectiveness ratings
     */
    calculateCombatRatings(performance, aircraft) {
        // Turn fight rating (dogfight capability)
        const turnFightRating = Math.min(100,
            performance.maneuverability.turnRate * 4 +
            performance.maneuverability.gLimit * 8 +
            Math.max(0, (1.2 - performance.power.wingLoading / 300) * 50)
        );

        // Boom and zoom rating (energy fighting)
        const boomZoomRating = Math.min(100,
            performance.maxSpeed.seaLevel / 10 +
            performance.climbRate.initial * 10 +
            performance.power.thrustToWeight * 40
        );

        // Interceptor rating
        const interceptorRating = Math.min(100,
            performance.maxSpeed.altitude / 12 +
            performance.ceiling.service / 150 +
            performance.climbRate.sustained * 15
        );

        // Attack rating
        const attackRating = Math.min(100,
            (performance.weight.payload / performance.weight.maximum) * 200 +
            performance.range.combat / 15 +
            Math.max(0, (600 - performance.stallSpeed.clean)) / 5
        );

        // Survivability rating
        const survivabilityRating = Math.min(100,
            performance.maxSpeed.seaLevel / 8 +
            performance.ceiling.service / 100 +
            (2.0 - performance.signatures.radarCrossSection) * 30
        );

        performance.combat.turnFightRating = turnFightRating;
        performance.combat.boomZoomRating = boomZoomRating;
        performance.combat.interceptorRating = interceptorRating;
        performance.combat.attackRating = attackRating;
        performance.combat.survivabilityRating = survivabilityRating;

        console.log(`⚔️ Combat ratings: Turn ${Math.round(turnFightRating)}, BnZ ${Math.round(boomZoomRating)}`);
    }

    /**
     * Calculates operational characteristics
     */
    calculateOperationalCharacteristics(performance, aircraft) {
        // Maintenance hours estimation
        let maintenanceHours = 2.0; // Base maintenance

        if (aircraft.structure?.material) {
            const material = this.getMaterialData(aircraft.structure.material);
            if (material) {
                maintenanceHours *= material.modifiers.maintenance;
            }
        }

        // Engine complexity factor
        if (aircraft.propulsion?.engines?.length > 0) {
            const engineData = this.getEngineData(aircraft.propulsion.engines[0]);
            if (engineData && engineData.type && engineData.type.includes('jet')) {
                maintenanceHours *= 1.5; // Jets need more maintenance
            }
        }

        // Reliability estimation
        let reliabilityFactor = 0.85; // Base reliability

        if (aircraft.structure?.material) {
            const material = this.getMaterialData(aircraft.structure.material);
            if (material && material.modifiers.durability) {
                reliabilityFactor *= Math.min(1.0, material.modifiers.durability);
            }
        }

        // Operational cost
        const operationalCost = maintenanceHours * 150 + performance.efficiency.fuelConsumption.cruise * 2;

        // Pilot skill requirement
        const pilotDemand = Math.min(100,
            (performance.maxSpeed.seaLevel / 800) * 30 +
            (performance.maneuverability.gLimit / 6) * 20 +
            (aircraft.avionics?.length || 0) * 10 + 20
        );

        performance.operational.maintenanceHours = maintenanceHours;
        performance.operational.reliabilityFactor = reliabilityFactor;
        performance.operational.operationalCost = operationalCost;
        performance.operational.pilotDemand = pilotDemand;

        // Weather limits
        performance.operational.weatherLimits.maxWind = 25; // km/h crosswind
        performance.operational.weatherLimits.visibility = 5; // km
        performance.operational.weatherLimits.cloudCeiling = 300; // meters

        console.log(`🔧 Maintenance: ${maintenanceHours.toFixed(1)}h/fh, Reliability: ${Math.round(reliabilityFactor * 100)}%`);
    }

    /**
     * Calculates radar and other signatures
     */
    calculateSignatures(performance, aircraft) {
        let radarCrossSection = 1.0; // Base RCS

        // Material effect on RCS
        if (aircraft.structure?.material) {
            const material = this.getMaterialData(aircraft.structure.material);
            if (material) {
                radarCrossSection *= material.modifiers.radarSignature;
            }
        }

        // Size effect
        const sizeCategory = aircraft.structure?.size || 'medium';
        const sizeMultipliers = {
            light: 0.7,
            medium: 1.0,
            heavy: 1.5,
            super_heavy: 2.2
        };
        radarCrossSection *= sizeMultipliers[sizeCategory] || 1.0;

        // IR signature (simplified)
        const infraredSignature = 1.0; // Would depend on engine type and exhaust design

        // Visual signature
        const visualSignature = sizeMultipliers[sizeCategory] || 1.0;

        // Acoustic signature
        const acousticSignature = aircraft.propulsion?.engines?.some(e =>
            this.getEngineData(e)?.type?.includes('jet')) ? 1.5 : 0.8;

        performance.signatures.radarCrossSection = radarCrossSection;
        performance.signatures.infraredSignature = infraredSignature;
        performance.signatures.visualSignature = visualSignature;
        performance.signatures.acousticSignature = acousticSignature;

        console.log(`📡 RCS: ${radarCrossSection.toFixed(2)} m²`);
    }

    /**
     * Calculates performance at different altitudes
     */
    calculateAltitudePerformance(performance, engineData, airframeData) {
        const altitudes = [0, 3000, 6000, 9000, 12000, 15000]; // meters

        altitudes.forEach(altitude => {
            const altPerformance = this.calculatePerformanceAtAltitude(
                performance, engineData, airframeData, altitude
            );
            performance.setAltitudePerformance(altitude, altPerformance);
        });
    }

    /**
     * Calculates performance with different loadouts
     */
    calculateLoadoutPerformance(performance, aircraft) {
        const loadouts = [
            'clean',      // No external stores
            'light',      // Light combat load
            'standard',   // Standard combat load
            'heavy',      // Heavy attack load
            'ferry'       // Maximum fuel
        ];

        loadouts.forEach(loadout => {
            const loadoutPerformance = this.calculatePerformanceWithLoadout(
                performance, aircraft, loadout
            );
            performance.setLoadoutPerformance(loadout, loadoutPerformance);
        });
    }

    // ===== UTILITY METHODS =====

    /**
     * Gets airframe data from components database
     */
    getAirframeData(airframeId) {
        if (!airframeId || !window.AIRCRAFT_COMPONENTS?.airframes) return null;
        return window.AIRCRAFT_COMPONENTS.airframes[airframeId];
    }

    /**
     * Gets engine data from components database
     */
    getEngineData(engineIds) {
        if (!engineIds || !Array.isArray(engineIds) || engineIds.length === 0) return null;
        if (!window.AIRCRAFT_COMPONENTS?.aircraft_engines) return null;

        // Return first engine data (simplified)
        return window.AIRCRAFT_COMPONENTS.aircraft_engines[engineIds[0]];
    }

    /**
     * Gets wing data from components database
     */
    getWingData(wings) {
        if (!wings?.type || !window.AIRCRAFT_COMPONENTS?.wing_types) return {};
        return window.AIRCRAFT_COMPONENTS.wing_types[wings.type] || {};
    }

    /**
     * Gets material data
     */
    getMaterialData(materialId) {
        if (!materialId || !window.STRUCTURAL_MATERIALS) return null;
        return window.STRUCTURAL_MATERIALS[materialId];
    }

    /**
     * Gets avionics data
     */
    getAvionicsData(avionicId) {
        if (!avionicId || !window.AIRCRAFT_COMPONENTS?.avionics) return null;
        return window.AIRCRAFT_COMPONENTS.avionics[avionicId];
    }

    /**
     * Gets weapon data
     */
    getWeaponData(weaponId) {
        if (!weaponId || !window.AIRCRAFT_COMPONENTS?.aircraft_weapons) return null;
        return window.AIRCRAFT_COMPONENTS.aircraft_weapons[weaponId];
    }

    /**
     * Estimates drag coefficient based on aircraft configuration
     */
    estimateDragCoefficient(airframeData, wingData, aircraft) {
        let baseCd = 0.025; // Clean aircraft base drag

        // Airframe contribution
        if (airframeData.category === 'fighter') baseCd = 0.02;
        else if (airframeData.category === 'bomber') baseCd = 0.035;
        else if (airframeData.category === 'transport') baseCd = 0.04;

        // Wing configuration
        if (wingData.type === 'swept') baseCd *= 0.9;
        else if (wingData.type === 'delta') baseCd *= 0.85;

        // External stores penalty
        const weaponsCount = aircraft.weapons?.length || 0;
        baseCd += weaponsCount * 0.005;

        return baseCd;
    }

    /**
     * Estimates maximum lift coefficient
     */
    estimateMaxLiftCoefficient(wingData, aircraft) {
        let baseCl = 1.2; // Basic airfoil

        // Wing type effects
        if (wingData.type === 'high_lift') baseCl = 1.6;
        else if (wingData.type === 'swept') baseCl = 1.0;

        // High-lift devices
        if (wingData.features?.includes('flaps')) baseCl += 0.8;
        if (wingData.features?.includes('slats')) baseCl += 0.3;

        return baseCl;
    }

    /**
     * Calculates stall speed
     */
    calculateStallSpeed(weight, wingArea, maxLiftCoeff) {
        if (wingArea <= 0 || maxLiftCoeff <= 0) return 150; // Fallback

        const stallSpeedMS = Math.sqrt(
            (weight * this.constants.gravityAcceleration) /
            (0.5 * this.constants.airDensitySeaLevel * wingArea * maxLiftCoeff)
        );

        return stallSpeedMS * 3.6; // Convert to km/h
    }

    /**
     * Gets air density at altitude
     */
    getAirDensity(altitude) {
        if (altitude <= this.atmosphere.troposphereHeight) {
            const temperature = this.constants.standardTemperature -
                this.atmosphere.temperatureLapseRate * altitude;
            const pressure = this.constants.standardPressure *
                Math.pow(temperature / this.constants.standardTemperature, 5.256);
            return pressure / (this.constants.gasConstant * temperature);
        } else {
            // Simplified stratosphere calculation
            return this.constants.airDensitySeaLevel * 0.1;
        }
    }

    /**
     * Gets speed of sound at altitude
     */
    getSoundSpeed(altitude) {
        const temperature = this.constants.standardTemperature -
            Math.min(altitude, this.atmosphere.troposphereHeight) * this.atmosphere.temperatureLapseRate;
        return Math.sqrt(1.4 * this.constants.gasConstant * temperature);
    }

    /**
     * Calculates performance at specific altitude
     */
    calculatePerformanceAtAltitude(basePerformance, engineData, airframeData, altitude) {
        const density = this.getAirDensity(altitude);
        const densityRatio = density / this.constants.airDensitySeaLevel;

        return {
            altitude: altitude,
            airDensity: density,
            maxSpeed: basePerformance.maxSpeed.seaLevel * Math.sqrt(1 / densityRatio) * 0.9,
            climbRate: basePerformance.climbRate.seaLevel * Math.pow(densityRatio, 0.7),
            stallSpeed: basePerformance.stallSpeed.clean / Math.sqrt(densityRatio),
            turnRate: basePerformance.maneuverability.turnRate * Math.sqrt(densityRatio)
        };
    }

    /**
     * Calculates performance with specific loadout
     */
    calculatePerformanceWithLoadout(basePerformance, aircraft, loadout) {
        const loadoutModifiers = {
            clean: { weightFactor: 1.0, dragFactor: 1.0 },
            light: { weightFactor: 1.1, dragFactor: 1.05 },
            standard: { weightFactor: 1.2, dragFactor: 1.15 },
            heavy: { weightFactor: 1.4, dragFactor: 1.3 },
            ferry: { weightFactor: 1.3, dragFactor: 1.1 }
        };

        const modifier = loadoutModifiers[loadout] || loadoutModifiers.standard;

        return {
            loadout: loadout,
            maxSpeed: basePerformance.maxSpeed.seaLevel / modifier.dragFactor,
            climbRate: basePerformance.climbRate.seaLevel / modifier.weightFactor,
            range: basePerformance.range.maximum * (loadout === 'ferry' ? 1.5 : 1 / modifier.weightFactor),
            maneuverability: basePerformance.maneuverability.turnRate / modifier.weightFactor
        };
    }

    /**
     * Assesses confidence in calculation results
     */
    assessCalculationConfidence(aircraft) {
        let confidence = 1.0;

        // Reduce confidence for missing data
        if (!aircraft.structure?.airframe) confidence *= 0.3;
        if (!aircraft.propulsion?.engines?.length) confidence *= 0.5;
        if (!aircraft.structure?.material) confidence *= 0.9;

        // Reduce confidence for unconventional configurations
        const engineCount = aircraft.propulsion?.engineCount || 1;
        if (engineCount > 4) confidence *= 0.8;

        return Math.max(0.1, confidence);
    }
}

// Create global instance
export const performanceCalculationSystem = new PerformanceCalculationSystem();

// Make it available globally
window.performanceCalculationSystem = performanceCalculationSystem;

console.log('🧮 PerformanceCalculationSystem module loaded');