// js/utils/navalPerformanceCalculator.js - Naval Performance Calculator for 1954

class NavalPerformanceCalculator {
    constructor() {
        // Naval constants
        this.constants = {
            water_density: 1025, // kg/m³ seawater
            water_resistance_factor: 0.15, // hull resistance
            speed_power_factor: 3.0, // power increases by cube of speed
            displacement_speed_factor: 0.85, // larger ships slower acceleration
            fuel_efficiency_base: 0.75, // base fuel efficiency
            crew_efficiency_factor: 0.92 // crew training impact
        };
    }

    // Use the same hull multipliers from NavalCostSystem
    static getHullMultipliers() {
        return window.NavalCostSystem?.getHullMultipliers() || {
            corvette: { electronics: 0.4, armor: 0.6, weapons: 0.7, cost: 0.5, weight: 0.3 },
            destroyer: { electronics: 0.7, armor: 0.8, weapons: 0.8, cost: 0.8, weight: 0.6 },
            frigate: { electronics: 0.6, armor: 0.7, weapons: 0.75, cost: 0.7, weight: 0.5 },
            escort: { electronics: 0.5, armor: 0.6, weapons: 0.7, cost: 0.6, weight: 0.4 },
            cruiser: { electronics: 1.0, armor: 1.0, weapons: 1.0, cost: 1.0, weight: 1.0 },
            battleship: { electronics: 1.8, armor: 2.2, weapons: 2.5, cost: 2.0, weight: 2.8 },
            carrier: { electronics: 1.5, armor: 1.2, weapons: 0.9, cost: 1.3, weight: 1.1 },
            submarine: { electronics: 0.8, armor: 0.3, weapons: 0.6, cost: 0.9, weight: 0.4 }
        };
    }

    static applyHullScaling(baseValue, valueType, hull) {
        const multipliers = this.getHullMultipliers();
        const role = hull?.role || 'cruiser';
        const roleMultipliers = multipliers[role] || multipliers.cruiser;
        
        const multiplier = roleMultipliers[valueType] || 1.0;
        return baseValue * multiplier;
    }

    /**
     * Calculates complete naval performance
     */
    calculateShipPerformance(ship) {
        try {
            if (!ship || !ship.hull) {
                return this.getDefaultPerformance();
            }

            const hull = window.NAVAL_COMPONENTS?.hulls[ship.hull];
            const propulsion = ship.propulsion ? window.NAVAL_COMPONENTS?.propulsion_systems[ship.propulsion] : null;
            
            if (!hull) {
                console.error('Hull not found:', ship.hull);
                return this.getDefaultPerformance();
            }

            const performance = {
                // Basic specs
                totalDisplacement: this.calculateTotalDisplacement(hull, ship),
                maxSpeed: this.calculateMaxSpeed(hull, propulsion),
                cruiseSpeed: this.calculateCruiseSpeed(hull, propulsion),
                
                // Combat capabilities
                mainArmament: this.calculateMainArmamentCount(ship),
                secondaryArmament: this.calculateSecondaryArmamentCount(ship),
                aaRating: this.calculateAAEffectiveness(ship),
                
                // Operational specs
                range: this.calculateRange(hull, propulsion),
                fuelCapacity: this.calculateFuelCapacity(hull),
                endurance: this.calculateEndurance(hull, propulsion),
                
                // Performance ratings
                seaworthiness: this.calculateSeaworthiness(hull, ship),
                maneuverability: this.calculateManeuverability(hull, propulsion),
                stability: this.calculateStability(hull, ship),
                
                // Detection and stealth
                radarSignature: this.calculateRadarSignature(hull, ship),
                sonarSignature: this.calculateSonarSignature(hull, propulsion),
                
                // Crew and logistics
                crewSize: this.calculateCrewRequirements(hull, ship),
                maintenanceRating: this.calculateMaintenanceRequirements(ship)
            };

            console.log('✅ Naval performance calculated:', performance);
            return performance;

        } catch (error) {
            console.error('❌ Error calculating naval performance:', error);
            return this.getDefaultPerformance();
        }
    }

    calculateTotalDisplacement(hull, ship) {
        let displacement = hull.displacement || 0;
        
        // Add weight from propulsion
        if (ship.propulsion && window.NAVAL_COMPONENTS?.propulsion_systems[ship.propulsion]) {
            const propulsion = window.NAVAL_COMPONENTS.propulsion_systems[ship.propulsion];
            displacement += propulsion.weight || 0;
        }
        
        // Add weight from armament
        displacement += this.calculateArmamentWeight(ship);
        
        // Add weight from armor
        displacement += this.calculateArmorWeight(ship);
        
        // Add weight from electronics
        displacement += this.calculateElectronicsWeight(ship);
        
        // Add fuel and supplies (typically 20-30% of hull displacement)
        displacement += (hull.displacement || 0) * 0.25;
        
        return Math.round(displacement);
    }

    calculateMaxSpeed(hull, propulsion) {
        let baseSpeed = hull.max_speed || 0;
        
        if (!propulsion) return baseSpeed;
        
        // Calculate power-to-weight ratio effect
        const powerToWeight = (propulsion.power_hp || 0) / (hull.displacement || 1);
        const speedMultiplier = Math.min(1.5, Math.max(0.7, powerToWeight / 30));
        
        return Math.round(baseSpeed * speedMultiplier * 10) / 10;
    }

    calculateCruiseSpeed(hull, propulsion) {
        const maxSpeed = this.calculateMaxSpeed(hull, propulsion);
        // Cruise speed is typically 60-70% of max speed for optimal efficiency
        return Math.round(maxSpeed * 0.65 * 10) / 10;
    }

    calculateMainArmamentCount(ship) {
        let count = 0;
        if (ship.main_guns && Array.isArray(ship.main_guns)) {
            ship.main_guns.forEach(gunMount => {
                if (gunMount.type && window.NAVAL_COMPONENTS?.naval_guns[gunMount.type]) {
                    const gun = window.NAVAL_COMPONENTS.naval_guns[gunMount.type];
                    const mount = window.NAVAL_COMPONENTS?.gun_mounts[gunMount.mount] || 
                                 window.NAVAL_COMPONENTS?.gun_mounts.single_mount;
                    count += (gunMount.quantity || 1) * (mount.guns_per_mount || 1);
                }
            });
        }
        return count;
    }

    calculateSecondaryArmamentCount(ship) {
        let count = 0;
        if (ship.secondary_weapons && Array.isArray(ship.secondary_weapons)) {
            count = ship.secondary_weapons.length;
        }
        return count;
    }

    calculateAAEffectiveness(ship) {
        let aaRating = 0;
        const hull = window.NAVAL_COMPONENTS?.hulls[ship.hull];
        
        if (!hull) return 0;
        
        // Base AA from hull design
        aaRating += (hull.aa_slots || 0) * 5;
        
        // Add AA weapons effectiveness
        if (ship.secondary_weapons) {
            ship.secondary_weapons.forEach(weapon => {
                if (weapon.type === 'aa_gun') {
                    aaRating += 15; // Each AA mount adds significant capability
                }
            });
        }
        
        // Bonus for modern fire control
        if (ship.electronics) {
            ship.electronics.forEach(system => {
                if (system.includes('radar') || system.includes('fire_control')) {
                    aaRating *= 1.3;
                }
            });
        }
        
        return Math.round(aaRating);
    }

    calculateRange(hull, propulsion) {
        let baseRange = 5000; // nautical miles base
        
        if (!propulsion) return baseRange;
        
        // Fuel efficiency affects range
        const fuelEfficiency = 1.0 / (propulsion.fuel_consumption || 100);
        const rangeMultiplier = fuelEfficiency * 1000;
        
        // Hull size affects fuel capacity
        const sizeMultiplier = Math.sqrt((hull.displacement || 1000) / 1000);
        
        return Math.round(baseRange * rangeMultiplier * sizeMultiplier);
    }

    calculateFuelCapacity(hull) {
        // Fuel capacity as percentage of displacement (varies by ship type)
        const displacement = hull.displacement || 0;
        let fuelPercentage = 0.15; // 15% default
        
        if (hull.role === 'destroyer' || hull.role === 'escort') {
            fuelPercentage = 0.20; // Destroyers need more fuel for speed
        } else if (hull.role === 'cruiser') {
            fuelPercentage = 0.18;
        } else if (hull.role === 'battleship') {
            fuelPercentage = 0.12; // Battleships have more armor, less fuel
        } else if (hull.role === 'carrier') {
            fuelPercentage = 0.22; // Carriers need fuel for aircraft too
        }
        
        return Math.round(displacement * fuelPercentage);
    }

    calculateEndurance(hull, propulsion) {
        // Endurance in days at cruise speed
        const fuelCapacity = this.calculateFuelCapacity(hull);
        const dailyConsumption = propulsion ? (propulsion.fuel_consumption || 100) * 0.6 * 24 : 2400;
        
        return Math.round(fuelCapacity / dailyConsumption);
    }

    calculateSeaworthiness(hull, ship) {
        let rating = 70; // Base rating
        
        // Hull size improves seaworthiness
        const displacement = hull.displacement || 0;
        rating += Math.min(25, displacement / 1000);
        
        // Hull design affects seaworthiness
        if (hull.role === 'battleship' || hull.role === 'cruiser') {
            rating += 10; // Larger warships more seaworthy
        } else if (hull.role === 'destroyer') {
            rating -= 5; // Destroyers less seaworthy in heavy seas
        }
        
        return Math.min(100, Math.max(0, Math.round(rating)));
    }

    calculateManeuverability(hull, propulsion) {
        let rating = 50; // Base rating
        
        // Smaller ships more maneuverable
        const displacement = hull.displacement || 1000;
        rating += Math.max(-20, 60 - displacement / 500);
        
        // Propulsion type affects maneuverability
        if (propulsion) {
            if (propulsion.type === 'gas_turbine') {
                rating += 15; // Gas turbines very responsive
            } else if (propulsion.type === 'diesel') {
                rating += 5; // Diesels moderately responsive
            } else if (propulsion.type === 'nuclear') {
                rating += 10; // Nuclear very responsive
            }
        }
        
        return Math.min(100, Math.max(0, Math.round(rating)));
    }

    calculateStability(hull, ship) {
        let rating = 75; // Base rating
        
        // Hull form affects stability
        const displacement = hull.displacement || 1000;
        rating += Math.min(15, displacement / 2000);
        
        // Top weight (superstructure, weapons) reduces stability
        const armamentWeight = this.calculateArmamentWeight(ship);
        const topWeightPenalty = armamentWeight / (displacement * 0.02); // 2% threshold
        rating -= Math.min(20, topWeightPenalty);
        
        return Math.min(100, Math.max(0, Math.round(rating)));
    }

    calculateRadarSignature(hull, ship) {
        // Radar cross section - higher is more detectable
        let signature = Math.sqrt(hull.displacement || 1000); // Base on size
        
        // Superstructure and equipment increase signature
        if (ship.electronics) {
            signature += ship.electronics.length * 10;
        }
        
        // Armament increases signature
        signature += this.calculateMainArmamentCount(ship) * 5;
        
        return Math.round(signature);
    }

    calculateSonarSignature(hull, propulsion) {
        let signature = 50; // Base noise level
        
        // Propulsion type heavily affects noise
        if (propulsion) {
            switch (propulsion.type) {
                case 'diesel':
                    signature += 20; // Diesels noisy
                    break;
                case 'steam_turbine':
                    signature += 10; // Steam turbines moderate
                    break;
                case 'gas_turbine':
                    signature += 25; // Gas turbines very noisy
                    break;
                case 'nuclear':
                    signature -= 10; // Nuclear quieter
                    break;
                case 'diesel_electric':
                    signature -= 20; // Electric drive very quiet
                    break;
            }
        }
        
        // Speed affects noise (cavitation)
        const maxSpeed = this.calculateMaxSpeed(hull, propulsion);
        signature += Math.max(0, maxSpeed - 25) * 2;
        
        return Math.max(0, Math.round(signature));
    }

    calculateCrewRequirements(hull, ship) {
        let crew = hull.crew || 100;
        
        // Armament requires additional crew
        crew += this.calculateMainArmamentCount(ship) * 8; // 8 crew per gun average
        crew += this.calculateSecondaryArmamentCount(ship) * 4;
        
        // Electronics require specialists
        if (ship.electronics) {
            crew += ship.electronics.length * 5;
        }
        
        return Math.round(crew);
    }

    calculateMaintenanceRequirements(ship) {
        let rating = 50; // Base maintenance (lower is better)
        
        const hull = window.NAVAL_COMPONENTS?.hulls[ship.hull];
        const propulsion = ship.propulsion ? window.NAVAL_COMPONENTS?.propulsion_systems[ship.propulsion] : null;
        
        // Older tech requires more maintenance
        if (hull && hull.tech_level < 40) {
            rating += 20;
        } else if (hull && hull.tech_level > 60) {
            rating += 10; // Modern tech complex but reliable
        }
        
        // Propulsion complexity
        if (propulsion) {
            rating += Math.round((1.0 - (propulsion.reliability || 0.9)) * 50);
        }
        
        return Math.min(100, Math.max(0, Math.round(rating)));
    }

    // Helper methods
    calculateArmamentWeight(ship) {
        let weight = 0;
        const hull = window.NAVAL_COMPONENTS?.hulls[ship.hull];
        
        if (ship.main_guns && Array.isArray(ship.main_guns)) {
            ship.main_guns.forEach(gunMount => {
                if (gunMount.type && window.NAVAL_COMPONENTS?.naval_guns[gunMount.type]) {
                    const gun = window.NAVAL_COMPONENTS.naval_guns[gunMount.type];
                    let gunWeight = gun.weight_tons || 0;
                    
                    // Apply hull scaling for weapons weight
                    gunWeight = NavalPerformanceCalculator.applyHullScaling(gunWeight, 'weight', hull);
                    
                    weight += gunWeight * (gunMount.quantity || 1);
                }
            });
        }
        
        // Add secondary weapons weight (estimate)
        if (ship.secondary_weapons) {
            weight += ship.secondary_weapons.length * 2; // 2 tons average per secondary weapon
        }
        
        // Add missile systems weight
        if (ship.missiles && Array.isArray(ship.missiles)) {
            ship.missiles.forEach(missileMount => {
                if (missileMount.type && window.NAVAL_COMPONENTS?.naval_missiles[missileMount.type]) {
                    const missile = window.NAVAL_COMPONENTS.naval_missiles[missileMount.type];
                    const launcherWeight = missile.launcher_weight_tons || 0;
                    const missilesWeight = (missile.launch_weight_kg || 0) * (missile.missiles_per_launcher || 0) / 1000; // Convert kg to tons
                    weight += (launcherWeight + missilesWeight) * (missileMount.quantity || 1);
                }
            });
        }

        // Add AA guns weight with hull scaling
        if (ship.aa_guns && Array.isArray(ship.aa_guns)) {
            ship.aa_guns.forEach(aaMount => {
                if (aaMount.type && window.NAVAL_COMPONENTS?.aa_guns[aaMount.type]) {
                    const gun = window.NAVAL_COMPONENTS.aa_guns[aaMount.type];
                    let gunWeight = gun.weight_tons || 0;
                    
                    // Apply hull scaling for AA weapons
                    gunWeight = NavalPerformanceCalculator.applyHullScaling(gunWeight, 'weight', hull);
                    
                    weight += gunWeight * (aaMount.quantity || 1);
                }
            });
        }

        // Add torpedo tubes weight
        if (ship.torpedo_tubes && Array.isArray(ship.torpedo_tubes)) {
            ship.torpedo_tubes.forEach(torpedoMount => {
                if (torpedoMount.type && window.NAVAL_COMPONENTS?.torpedo_tubes[torpedoMount.type]) {
                    const torpedo = window.NAVAL_COMPONENTS.torpedo_tubes[torpedoMount.type];
                    weight += (torpedo.weight_tons || 0) * (torpedoMount.quantity || 1);
                }
            });
        }

        // Add depth charges/ASW systems weight
        if (ship.depth_charges && Array.isArray(ship.depth_charges)) {
            ship.depth_charges.forEach(aswMount => {
                if (aswMount.type && window.NAVAL_COMPONENTS?.depth_charges[aswMount.type]) {
                    const asw = window.NAVAL_COMPONENTS.depth_charges[aswMount.type];
                    weight += (asw.launcher_weight_tons || 0) * (aswMount.quantity || 1);
                }
            });
        }

        // Add countermeasures weight
        if (ship.countermeasures && Array.isArray(ship.countermeasures)) {
            ship.countermeasures.forEach(cmMount => {
                if (cmMount.type && window.NAVAL_COMPONENTS?.countermeasures[cmMount.type]) {
                    const cm = window.NAVAL_COMPONENTS.countermeasures[cmMount.type];
                    weight += (cm.weight_tons || 0) * (cmMount.quantity || 1);
                }
            });
        }

        // Add searchlights weight
        if (ship.searchlights && Array.isArray(ship.searchlights)) {
            ship.searchlights.forEach(lightMount => {
                if (lightMount.type && window.NAVAL_COMPONENTS?.searchlights[lightMount.type]) {
                    const light = window.NAVAL_COMPONENTS.searchlights[lightMount.type];
                    weight += (light.weight_tons || 0) * (lightMount.quantity || 1);
                }
            });
        }
        
        return weight;
    }

    calculateArmorWeight(ship) {
        if (!ship.armor || !window.NAVAL_COMPONENTS?.armor_zones) {
            return 0;
        }

        let totalWeight = 0;
        const currentHull = ship.hull ? window.NAVAL_COMPONENTS?.hulls[ship.hull] : null;
        const hullRole = currentHull?.role || 'destroyer';

        // Calculate weight for each armor zone
        Object.entries(ship.armor.custom_zones || {}).forEach(([zoneId, materialId]) => {
            const zone = window.NAVAL_COMPONENTS.armor_zones[zoneId];
            const material = window.NAVAL_COMPONENTS.armor_materials[materialId];
            
            if (zone && material) {
                const area = zone.area_sqm_base[hullRole] || zone.area_sqm_base.destroyer;
                const weight = (material.weight_per_sqm_kg * area * zone.weight_multiplier) / 1000; // convert to tons
                totalWeight += weight;
            }
        });

        return totalWeight;
    }

    calculateElectronicsWeight(ship) {
        let weight = 0;
        const hull = window.NAVAL_COMPONENTS?.hulls[ship.hull];
        
        if (ship.electronics && Array.isArray(ship.electronics)) {
            ship.electronics.forEach(electronicsMount => {
                if (electronicsMount.category && electronicsMount.type && window.NAVAL_COMPONENTS?.[electronicsMount.category]?.[electronicsMount.type]) {
                    const electronics = window.NAVAL_COMPONENTS[electronicsMount.category][electronicsMount.type];
                    let itemWeight = electronics.weight_tons || 0;
                    
                    // Apply hull scaling for electronics weight
                    itemWeight = NavalPerformanceCalculator.applyHullScaling(itemWeight, 'weight', hull);
                    
                    weight += itemWeight * (electronicsMount.quantity || 1);
                }
            });
        }
        return weight;
    }

    getDefaultPerformance() {
        return {
            totalDisplacement: 0,
            maxSpeed: 0,
            cruiseSpeed: 0,
            mainArmament: 0,
            secondaryArmament: 0,
            aaRating: 0,
            range: 0,
            fuelCapacity: 0,
            endurance: 0,
            seaworthiness: 0,
            maneuverability: 0,
            stability: 0,
            radarSignature: 0,
            sonarSignature: 0,
            crewSize: 0,
            maintenanceRating: 0
        };
    }

    renderPerformanceDisplay(ship) {
        const performance = this.calculateShipPerformance(ship);
        
        let html = '<div class="grid grid-cols-2 gap-4">';
        
        html += `
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-slate-400">Velocidade Máxima:</span>
                    <span class="text-naval-300 font-semibold">${performance.maxSpeed} nós</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Vel. Cruzeiro:</span>
                    <span class="text-slate-300">${performance.cruiseSpeed} nós</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Autonomia:</span>
                    <span class="text-slate-300">${performance.range} mn</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Resistência:</span>
                    <span class="text-slate-300">${performance.endurance} dias</span>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-slate-400">Navegabilidade:</span>
                    <span class="text-green-300">${performance.seaworthiness}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Manobrabilidade:</span>
                    <span class="text-blue-300">${performance.maneuverability}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Estabilidade:</span>
                    <span class="text-cyan-300">${performance.stability}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Tripulação:</span>
                    <span class="text-slate-300">${performance.crewSize}</span>
                </div>
            </div>
        `;
        
        html += '</div>';
        return html;
    }
}

// Global instance
window.navalPerformanceCalculator = new NavalPerformanceCalculator();

// Global functions for compatibility
window.calculateShipPerformance = function(ship) {
    return window.navalPerformanceCalculator.calculateShipPerformance(ship);
};

window.NavalPerformanceSystem = {
    renderPerformanceDisplay: function(ship) {
        return window.navalPerformanceCalculator.renderPerformanceDisplay(ship);
    }
};