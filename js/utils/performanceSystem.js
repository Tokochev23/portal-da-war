// js/utils/performanceSystem.js - Vehicle performance calculation and analysis system

class PerformanceSystem {
    
    static calculatePerformanceMetrics(vehicle) {
        if (!vehicle || !window.VEHICLE_COMPONENTS) {
            return this.getDefaultMetrics();
        }
        // If nothing relevante is selected, keep metrics at zero
        const empty = (!vehicle.chassis && !vehicle.engine && !vehicle.transmission && !vehicle.suspension &&
                       !vehicle.main_gun_caliber && (!vehicle.secondary_weapons || vehicle.secondary_weapons.length === 0) &&
                       !vehicle.fcs && !vehicle.optics && !vehicle.communication);
        if (empty) {
            return this.getDefaultMetrics();
        }
        
        // Get chassis info for role-specific analysis
        const chassis = this.getChassisInfo(vehicle);
        
        const mobility = this.calculateMobility(vehicle, chassis);
        const firepower = this.calculateFirepower(vehicle, chassis);
        const protection = this.calculateProtection(vehicle, chassis);
        const survivability = this.calculateSurvivability(vehicle, chassis);
        const reconnaissance = this.calculateReconnaissance(vehicle, chassis);
        const maintenance = this.calculateMaintenance(vehicle, chassis);
        
        // Overall combat effectiveness with chassis-specific weights
        const weights = this.getChassisSpecificWeights(chassis);
        const combat_effectiveness = Math.round(
            (firepower * weights.firepower) + 
            (protection * weights.protection) + 
            (mobility * weights.mobility) + 
            (survivability * weights.survivability) + 
            (reconnaissance * weights.reconnaissance)
        );
        
        return {
            mobility,
            firepower,
            protection,
            survivability,
            reconnaissance,
            maintenance,
            combat_effectiveness,
            details: this.getPerformanceDetails(vehicle, chassis)
        };
    }
    
    static getChassisInfo(vehicle) {
        if (!vehicle?.chassis || !window.VEHICLE_COMPONENTS?.chassis) {
            return { category: "Unknown", weight_class: "medium" };
        }
        return window.VEHICLE_COMPONENTS.chassis[vehicle.chassis] || { category: "Unknown", weight_class: "medium" };
    }
    
    static getChassisSpecificWeights(chassis) {
        // Adjust importance of each metric based on chassis type
        switch (chassis.category) {
            case "Main Battle Tank":
            case "Super Heavy Tank":
                return { firepower: 0.35, protection: 0.30, mobility: 0.15, survivability: 0.15, reconnaissance: 0.05 };
            
            case "Light Tracked":
                return { mobility: 0.35, reconnaissance: 0.25, survivability: 0.15, firepower: 0.15, protection: 0.10 };
            
            case "Wheeled":
                return { mobility: 0.40, reconnaissance: 0.30, maintenance: 0.15, survivability: 0.10, protection: 0.05 };
            
            case "Anti-Aircraft":
                return { firepower: 0.45, mobility: 0.25, reconnaissance: 0.15, survivability: 0.10, protection: 0.05 };
            
            case "Self-Propelled Artillery":
                return { firepower: 0.50, protection: 0.20, survivability: 0.15, mobility: 0.10, reconnaissance: 0.05 };
            
            case "Amphibious":
                return { mobility: 0.30, survivability: 0.25, reconnaissance: 0.20, firepower: 0.15, protection: 0.10 };
            
            case "Airmobile":
                return { mobility: 0.40, reconnaissance: 0.25, survivability: 0.20, maintenance: 0.10, protection: 0.05 };
                
            default:
                return { firepower: 0.25, protection: 0.25, mobility: 0.25, survivability: 0.15, reconnaissance: 0.10 };
        }
    }
    
    static calculateMobility(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseScore = 40;
        
        // Chassis-specific base mobility expectations
        switch (chassisInfo.category) {
            case "Wheeled":
                baseScore = 60; // Wheeled vehicles are inherently more mobile on roads
                break;
            case "Light Tracked":
                baseScore = 50; // Light tracked are designed for mobility
                break;
            case "Airmobile":
                baseScore = 55; // Airmobile prioritizes mobility
                break;
            case "Anti-Aircraft":
                baseScore = 45; // SPAA needs some mobility for repositioning
                break;
            case "Main Battle Tank":
                baseScore = 35; // MBTs balance mobility with protection
                break;
            case "Super Heavy Tank":
            case "Self-Propelled Artillery":
                baseScore = 25; // Heavy vehicles sacrifice mobility
                break;
            case "Amphibious":
                baseScore = 35; // Amphibious has unique mobility but lower on land
                break;
        }
        
        let score = baseScore;
        
        // Engine contribution - adjusted for chassis expectations
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.power) {
                const powerToWeight = engine.power / (this.calculateTotalWeight(vehicle) / 1000);
                let engineContribution = powerToWeight * 2;
                
                // Chassis-specific power-to-weight expectations
                if (chassisInfo.weight_class === 'light') {
                    engineContribution *= 1.2; // Light chassis get more benefit from power
                } else if (chassisInfo.weight_class === 'super_heavy') {
                    engineContribution *= 0.7; // Heavy chassis get less benefit
                }
                
                score += Math.min(35, engineContribution);
            }
        }
        
        // Transmission contribution - chassis-specific
        if (vehicle?.transmission && window.VEHICLE_COMPONENTS?.transmissions) {
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            if (transmission) {
                let transmissionScore = 0;
                
                if (transmission.type === 'automatic') transmissionScore = 10;
                else if (transmission.type === 'semi_auto') transmissionScore = 7;
                else if (transmission.gears >= 5) transmissionScore = 5;
                else if (transmission.gears >= 4) transmissionScore = 3;
                
                // Wheeled vehicles benefit more from smooth transmissions
                if (chassisInfo.category === "Wheeled" && transmission.type === 'automatic') {
                    transmissionScore += 5;
                }
                
                if (transmission.efficiency) transmissionScore += (transmission.efficiency - 0.7) * 20;
                score += transmissionScore;
            }
        }
        
        // Suspension contribution - chassis-specific
        if (vehicle?.suspension && window.VEHICLE_COMPONENTS?.suspensions) {
            const suspension = window.VEHICLE_COMPONENTS.suspensions[vehicle.suspension];
            if (suspension) {
                let suspensionScore = (suspension.terrain_performance || 0.8) * 10;
                
                // SPAA benefits more from stabilization
                if (chassisInfo.category === "Anti-Aircraft" && suspension.stabilization_bonus) {
                    suspensionScore += suspension.stabilization_bonus * 30;
                } else if (suspension.stabilization_bonus) {
                    suspensionScore += suspension.stabilization_bonus * 20;
                }
                
                score += suspensionScore;
            }
        }
        
        // Chassis-specific terrain multiplier bonus
        if (chassisInfo.terrain_mult) {
            const avgTerrain = (chassisInfo.terrain_mult.road + chassisInfo.terrain_mult.offroad + 
                              (chassisInfo.terrain_mult.mud || 0.7) + (chassisInfo.terrain_mult.snow || 0.7)) / 4;
            score += (avgTerrain - 0.8) * 25; // Bonus/penalty based on terrain performance
        }
        
        // Special equipment effects on mobility
        if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
            vehicle.specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment) {
                    // Mobility penalties from heavy equipment
                    if (equipment.speed_reduction) {
                        score -= equipment.speed_reduction * 35; // mine_roller, dozer_blade
                    }
                    if (equipment.ground_pressure_increase) {
                        score -= equipment.ground_pressure_increase * 20; // mine_roller
                    }
                    
                    // Special mobility capabilities
                    if (equipment.water_crossing_depth && equipment.water_crossing_depth > 1.0) {
                        score += Math.min(10, equipment.water_crossing_depth * 2); // deep_wading_kit
                    }
                    if (equipment.obstacle_clearing) {
                        score += 5; // dozer_blade - tactical mobility
                    }
                    if (equipment.mine_clearance_capability) {
                        score += 3; // mine_roller - safe mobility
                    }
                    
                    // Weight impacts (already handled in weight calculation, but mention here)
                    // Heavy equipment reduces power-to-weight ratio
                }
            });
        }
        
        // Prevent NaN
        if (isNaN(score) || !isFinite(score)) score = baseScore;
        return Math.min(100, Math.max(0, Math.round(score)));
    }
    
    static calculateFirepower(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseScore = 20;
        
        // Chassis-specific firepower expectations
        switch (chassisInfo.category) {
            case "Self-Propelled Artillery":
                baseScore = 10; // SPG should get most points from large caliber guns
                break;
            case "Anti-Aircraft":
                baseScore = 15; // SPAA gets points primarily from AA weapons
                break;
            case "Main Battle Tank":
            case "Super Heavy Tank":
                baseScore = 25; // MBTs expected to have good baseline firepower
                break;
            case "Light Tracked":
                baseScore = 15; // Light vehicles have limited firepower capacity
                break;
            case "Wheeled":
                baseScore = 10; // Wheeled limited by recoil management
                break;
            case "Amphibious":
                baseScore = 18; // Amphibious has moderate firepower
                break;
            case "Airmobile":
                baseScore = 12; // Airmobile limited by weight constraints
                break;
        }
        
        let score = baseScore;
        
        // Main gun contribution - chassis-specific scaling
        if (vehicle?.main_gun && window.VEHICLE_COMPONENTS?.main_guns) {
            const gun = window.VEHICLE_COMPONENTS.main_guns[vehicle.main_gun];
            if (gun) {
                const caliber = gun.caliber;
                let gunScore = caliber / 3; // Base caliber contribution
                
                // Add penetration and accuracy bonuses
                if (gun.penetration_1000m) {
                    gunScore += gun.penetration_1000m / 20; // Penetration at range
                }
                if (gun.accuracy) {
                    gunScore += (gun.accuracy - 0.7) * 30; // Accuracy bonus
                }
                if (gun.rate_of_fire) {
                    gunScore += Math.min(10, gun.rate_of_fire); // Rate of fire
                }
                
                // Chassis-specific caliber effectiveness
                if (chassisInfo.category === "Self-Propelled Artillery" && caliber >= 130) {
                    gunScore *= 1.5; // SPG gets bonus for large calibers it's designed for
                } else if (chassisInfo.category === "Wheeled" && caliber > 90) {
                    gunScore *= 0.6; // Wheeled vehicles suffer penalty for large calibers
                } else if (chassisInfo.category === "Light Tracked" && caliber > 75) {
                    gunScore *= 0.8; // Light chassis gets penalty for heavy guns
                } else if (chassisInfo.category === "Anti-Aircraft" && caliber > 0) {
                    gunScore *= 0.3; // SPAA not optimized for main guns
                }
                
                score += Math.min(50, gunScore);
            }
        } else if (vehicle?.main_gun_caliber) {
            // Fallback to caliber-only calculation
            const caliber = vehicle.main_gun_caliber;
            let gunScore = caliber / 3;
            
            if (chassisInfo.category === "Self-Propelled Artillery" && caliber >= 130) {
                gunScore *= 1.5;
            } else if (chassisInfo.category === "Wheeled" && caliber > 90) {
                gunScore *= 0.6;
            } else if (chassisInfo.category === "Light Tracked" && caliber > 75) {
                gunScore *= 0.8;
            } else if (chassisInfo.category === "Anti-Aircraft" && caliber > 0) {
                gunScore *= 0.3;
            }
            
            score += Math.min(40, gunScore);
        }
        
        // Secondary weapons contribution - chassis-aware
        if (vehicle?.secondary_weapons && window.VEHICLE_COMPONENTS?.secondary_weapons) {
            let secondaryScore = 0;
            vehicle.secondary_weapons.forEach(weaponId => {
                const weapon = window.VEHICLE_COMPONENTS.secondary_weapons[weaponId];
                if (weapon) {
                    secondaryScore += weapon.rate_of_fire / 100;
                }
            });
            
            // Light vehicles get more benefit from secondary weapons
            if (chassisInfo.weight_class === 'light') {
                secondaryScore *= 1.3;
            }
            
            score += Math.min(15, secondaryScore);
        }
        
        // AA guns contribution - heavily chassis-dependent
        if (vehicle?.aa_guns && window.VEHICLE_COMPONENTS?.aa_guns) {
            let aaScore = 0;
            vehicle.aa_guns.forEach(gunId => {
                const gun = window.VEHICLE_COMPONENTS.aa_guns[gunId];
                if (gun) {
                    aaScore += gun.aa_effectiveness * 10;
                }
            });
            
            // SPAA chassis get major bonus for AA weapons
            if (chassisInfo.category === "Anti-Aircraft") {
                aaScore *= 3; // Triple effectiveness for dedicated SPAA
                score += Math.min(50, aaScore); // Higher cap for SPAA
            } else {
                score += Math.min(10, aaScore); // Standard cap for others
            }
        }
        
        // Fire control system bonus - chassis-specific value
        if (vehicle?.fcs && window.VEHICLE_COMPONENTS?.fire_control) {
            const fcs = window.VEHICLE_COMPONENTS.fire_control[vehicle.fcs];
            if (fcs) {
                let fcsScore = (fcs.accuracy_bonus || 0) * 30;
                if (fcs.night_capable) fcsScore += 3;
                if (fcs.automatic_tracking) fcsScore += 5;
                
                // SPAA and MBT benefit more from advanced FCS
                if (chassisInfo.category === "Anti-Aircraft" || chassisInfo.category === "Main Battle Tank") {
                    fcsScore *= 1.2;
                }
                
                score += fcsScore;
            }
        }
        
        // Special equipment effects on firepower
        if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
            vehicle.specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment) {
                    // Accuracy and combat effectiveness bonuses
                    if (equipment.accuracy_bonus_long_missions) {
                        score += equipment.accuracy_bonus_long_missions * 25; // improved_seats
                    }
                    if (equipment.command_efficiency) {
                        score += equipment.command_efficiency * 15; // commanders_cupola
                    }
                    
                    // Night combat capability
                    if (equipment.night_combat_bonus) {
                        score += equipment.night_combat_bonus * 20; // searchlight_infrared
                    }
                    
                    // Concealment for better positioning
                    if (equipment.smoke_deployment_range) {
                        score += Math.min(8, equipment.smoke_deployment_range / 10); // smoke_dispensers
                    }
                    if (equipment.continuous_smoke) {
                        score += 5; // exhaust_smoke_system
                    }
                    
                    // Penalties that affect firepower
                    if (equipment.engine_performance_reduction) {
                        score -= equipment.engine_performance_reduction * 15; // exhaust_smoke_system
                    }
                    if (equipment.gives_away_position) {
                        score -= 5; // searchlight_infrared - tactical disadvantage
                    }
                }
            });
        }
        
        // Prevent NaN
        if (isNaN(score) || !isFinite(score)) score = baseScore;
        return Math.min(100, Math.max(0, Math.round(score)));
    }
    
    static calculateProtection(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseScore = 30;
        
        // Chassis-specific protection expectations
        switch (chassisInfo.category) {
            case "Super Heavy Tank":
                baseScore = 50; // Super heavy designed for maximum protection
                break;
            case "Main Battle Tank":
                baseScore = 40; // MBTs balance protection with mobility
                break;
            case "Self-Propelled Artillery":
                baseScore = 25; // SPG has some protection but not primary focus
                break;
            case "Anti-Aircraft":
                baseScore = 20; // SPAA prioritizes mobility over protection
                break;
            case "Light Tracked":
                baseScore = 15; // Light vehicles sacrifice protection for mobility
                break;
            case "Wheeled":
                baseScore = 10; // Wheeled vehicles have minimal protection
                break;
            case "Amphibious":
                baseScore = 20; // Waterproofing limits armor thickness
                break;
            case "Airmobile":
                baseScore = 12; // Weight constraints limit armor
                break;
        }
        
        let score = baseScore;
        
        // Main armor contribution - chassis-specific scaling
        if (vehicle?.armor_thickness || vehicle?.armorThickness) {
            const frontal = (vehicle.armor_thickness?.frontal ?? vehicle.armorThickness ?? 50);
            const side = vehicle.armor_thickness?.side || frontal * 0.6;
            const rear = vehicle.armor_thickness?.rear || frontal * 0.4;
            const avgThickness = (frontal + side + rear) / 3;
            
            let armorScore = avgThickness / 3;
            
            // Chassis-specific armor effectiveness
            if (chassisInfo.category === "Super Heavy Tank") {
                armorScore *= 1.2; // Super heavy gets full benefit from thick armor
            } else if (chassisInfo.category === "Wheeled" && avgThickness > 25) {
                armorScore *= 0.7; // Wheeled chassis can't effectively use thick armor
            } else if (chassisInfo.category === "Airmobile" && avgThickness > 30) {
                armorScore *= 0.6; // Weight restrictions
            }
            
            score += Math.min(50, armorScore);
        }
        
        // Additional armor (0-20 points) - chassis-aware
        if (vehicle?.additional_armor && window.VEHICLE_COMPONENTS?.additional_armor) {
            let additionalScore = 0;
            vehicle.additional_armor.forEach(armorId => {
                const armor = window.VEHICLE_COMPONENTS.additional_armor[armorId];
                if (armor) {
                    additionalScore += armor.protection_bonus / 5;
                }
            });
            
            // Heavy chassis benefit more from additional armor
            if (chassisInfo.weight_class === 'super_heavy' || chassisInfo.weight_class === 'heavy') {
                additionalScore *= 1.2;
            } else if (chassisInfo.weight_class === 'light') {
                additionalScore *= 0.8;
            }
            
            score += Math.min(20, additionalScore);
        }
        
        // Special equipment effects on protection
        if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
            vehicle.specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment) {
                    // Direct protection bonuses
                    if (equipment.frontal_protection_bonus) {
                        score += equipment.frontal_protection_bonus * 30; // dozer_blade
                    }
                    if (equipment.armor_thickness && typeof equipment.armor_thickness === 'number') {
                        score += equipment.armor_thickness / 5; // commanders_cupola armor
                    }
                    
                    // Protection penalties
                    if (equipment.armor_reduction_sides) {
                        score -= equipment.armor_reduction_sides * 25; // extra_fuel_tanks_external
                    }
                    if (equipment.armor_integrity_reduction) {
                        score -= equipment.armor_integrity_reduction * 20; // escape_hatches
                    }
                    if (equipment.fire_vulnerability) {
                        score -= equipment.fire_vulnerability * 15; // external fuel tanks
                    }
                }
            });
        }
        
        // Prevent NaN
        if (isNaN(score) || !isFinite(score)) score = baseScore;
        return Math.min(100, Math.max(0, Math.round(score)));
    }
    
    static calculateSurvivability(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseScore = 40;
        
        // Chassis-specific survivability expectations
        switch (chassisInfo.category) {
            case "Main Battle Tank":
            case "Super Heavy Tank":
                baseScore = 50; // MBTs prioritize crew survival
                break;
            case "Self-Propelled Artillery":
                baseScore = 35; // SPG has larger crew, more vulnerable
                break;
            case "Anti-Aircraft":
                baseScore = 30; // SPAA exposed positions
                break;
            case "Light Tracked":
                baseScore = 35; // Light chassis reasonably survivable
                break;
            case "Wheeled":
                baseScore = 25; // Wheeled less survivable in combat
                break;
            case "Amphibious":
                baseScore = 30; // Water operations add risk
                break;
            case "Airmobile":
                baseScore = 32; // Quick deployment but limited protection
                break;
        }
        
        let score = baseScore;
        
        // Crew size consideration - chassis-specific
        const crewSize = vehicle?.crewSize || chassisInfo?.crew_capacity?.optimal || 3;
        let crewScore = Math.min(15, crewSize * 3);
        
        // Adjust crew survivability by chassis type
        if (chassisInfo.category === "Self-Propelled Artillery" && crewSize > 4) {
            crewScore *= 0.8; // Larger crews in SPG are more vulnerable
        } else if (chassisInfo.category === "Anti-Aircraft") {
            crewScore *= 0.7; // SPAA crews more exposed
        } else if (chassisInfo.category === "Main Battle Tank") {
            crewScore *= 1.2; // MBT crews better protected
        }
        
        score += crewScore;
        
        // Special equipment contribution - chassis-aware
        if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
            let equipScore = 0;
            vehicle.specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment) {
                    // Direct survivability bonuses
                    if (equipment.crew_survival_bonus) equipScore += equipment.crew_survival_bonus * 25;
                    if (equipment.fire_suppression_bonus) equipScore += equipment.fire_suppression_bonus * 15;
                    if (equipment.escape_time_reduction) equipScore += equipment.escape_time_reduction * 20;
                    if (equipment.explosion_resistance) equipScore += equipment.explosion_resistance * 20;
                    if (equipment.internal_damage_reduction) equipScore += equipment.internal_damage_reduction * 25;
                    
                    // Crew comfort affects survivability
                    if (equipment.crew_endurance_bonus) equipScore += equipment.crew_endurance_bonus * 15;
                    if (equipment.crew_comfort_bonus) equipScore += equipment.crew_comfort_bonus * 10;
                    if (equipment.crew_fatigue_reduction) equipScore += equipment.crew_fatigue_reduction * 12;
                    if (equipment.cold_weather_performance) equipScore += equipment.cold_weather_performance * 8;
                    
                    // NBC protection
                    if (equipment.nbc_protection_bonus) equipScore += equipment.nbc_protection_bonus * 12;
                }
            });
            
            // Some chassis benefit more from survival equipment
            if (chassisInfo.category === "Main Battle Tank" || chassisInfo.category === "Super Heavy Tank") {
                equipScore *= 1.1;
            }
            
            score += Math.min(35, equipScore);
        }
        
        // Reliability factor - chassis-specific impact
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.reliability) {
                let reliabilityScore = (engine.reliability - 0.7) * 66;
                
                // Some chassis types are more affected by engine reliability
                if (chassisInfo.category === "Wheeled" || chassisInfo.category === "Amphibious") {
                    reliabilityScore *= 1.3; // More dependent on mobility for survival
                }
                
                score += Math.min(20, reliabilityScore);
            }
        }
        
        // Chassis inherent survivability features
        if (chassisInfo.reliability) {
            score += (chassisInfo.reliability - 0.75) * 40; // Chassis reliability affects survivability
        }
        
        // Prevent NaN
        if (isNaN(score) || !isFinite(score)) score = baseScore;
        return Math.min(100, Math.max(0, Math.round(score)));
    }
    
    static calculateReconnaissance(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseScore = 30;
        
        // Chassis-specific reconnaissance expectations
        switch (chassisInfo.category) {
            case "Light Tracked":
                baseScore = 45; // Light vehicles excel at reconnaissance
                break;
            case "Wheeled":
                baseScore = 50; // Wheeled vehicles ideal for recon missions
                break;
            case "Airmobile":
                baseScore = 40; // Airmobile good for deep reconnaissance
                break;
            case "Anti-Aircraft":
                baseScore = 35; // SPAA needs good situational awareness
                break;
            case "Amphibious":
                baseScore = 35; // Amphibious useful for coastal recon
                break;
            case "Main Battle Tank":
                baseScore = 25; // MBTs not optimized for recon but capable
                break;
            case "Super Heavy Tank":
                baseScore = 15; // Super heavy tanks poor at reconnaissance
                break;
            case "Self-Propelled Artillery":
                baseScore = 20; // SPG needs observation but not mobile recon
                break;
        }
        
        let score = baseScore;
        
        // Optics contribution - chassis-specific effectiveness
        if (vehicle?.optics && window.VEHICLE_COMPONENTS?.optics_systems) {
            const optics = window.VEHICLE_COMPONENTS.optics_systems[vehicle.optics];
            if (optics) {
                const magnification = typeof optics.magnification === 'number' && !isNaN(optics.magnification) ? optics.magnification : 1;
                let opticsScore = magnification * 8;
                
                // Some chassis get more benefit from advanced optics
                if (chassisInfo.category === "Light Tracked" || chassisInfo.category === "Wheeled") {
                    opticsScore *= 1.3; // Recon vehicles get more from optics
                } else if (chassisInfo.category === "Self-Propelled Artillery") {
                    opticsScore *= 1.2; // Artillery needs good observation
                }
                
                if (optics.night_vision) {
                    let nightScore = 15;
                    if (chassisInfo.category === "Light Tracked" || chassisInfo.category === "Wheeled") {
                        nightScore *= 1.5; // Night vision more valuable for recon
                    }
                    opticsScore += nightScore;
                }
                
                if (optics.thermal_imaging) opticsScore += 20;
                if (optics.range_finding) opticsScore += 10;
                
                score += Math.min(35, opticsScore);
            }
        }
        
        // Communication range bonus - chassis-specific importance
        if (vehicle?.communication && window.VEHICLE_COMPONENTS?.communication) {
            const comm = window.VEHICLE_COMPONENTS.communication[vehicle.communication];
            if (comm && typeof comm.range === 'number' && !isNaN(comm.range)) {
                let commScore = Math.min(20, comm.range * 0.8);
                if (comm.encryption_capable) commScore += 5;
                
                // Reconnaissance and command vehicles benefit more from communications
                if (chassisInfo.category === "Light Tracked" || chassisInfo.category === "Wheeled") {
                    commScore *= 1.4; // Recon needs excellent comms
                } else if (chassisInfo.category === "Anti-Aircraft") {
                    commScore *= 1.2; // SPAA needs good coordination
                }
                
                score += commScore;
            }
        }
        
        // Mobility contribution to reconnaissance
        let mobilityBonus = 0;
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.power) {
                const powerToWeight = engine.power / (this.calculateTotalWeight(vehicle) / 1000);
                mobilityBonus = Math.min(15, (powerToWeight / 20) * 15);
                
                // Light and wheeled vehicles get more reconnaissance benefit from mobility
                if (chassisInfo.weight_class === 'light') {
                    mobilityBonus *= 1.3;
                }
            }
        }
        score += mobilityBonus;
        
        // Special equipment effects on reconnaissance
        if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
            vehicle.specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment) {
                    // Vision and detection equipment
                    if (equipment.visibility_bonus) {
                        score += equipment.visibility_bonus * 30; // commanders_cupola
                    }
                    if (equipment.blind_spot_reduction) {
                        score += equipment.blind_spot_reduction * 25; // periscope_array
                    }
                    if (equipment.night_combat_bonus) {
                        score += equipment.night_combat_bonus * 25; // searchlight_infrared
                    }
                    if (equipment.detection_range && equipment.detection_range > 1000) {
                        score += Math.min(15, equipment.detection_range / 1000); // Various detection equipment
                    }
                    
                    // Concealment equipment (reduces enemy detection)
                    if (equipment.concealment_bonus) {
                        score += equipment.concealment_bonus * 20; // camouflage_nets
                    }
                    if (equipment.air_detection_reduction) {
                        score += equipment.air_detection_reduction * 15; // camouflage_nets
                    }
                    
                    // Electronic warfare
                    if (equipment.radar_warning) {
                        score += 10; // radar_detector
                    }
                    if (equipment.enemy_communication_disruption) {
                        score += equipment.enemy_communication_disruption * 12; // radio_jammer
                    }
                    
                    // Penalties for equipment that compromises stealth
                    if (equipment.gives_away_position) {
                        score -= 8; // searchlight_infrared
                    }
                    if (equipment.vulnerability_increase) {
                        score -= equipment.vulnerability_increase * 15; // commanders_cupola
                    }
                }
            });
        }
        
        // Chassis stealth/profile bonus
        if (chassisInfo.weight_class === 'light' || chassisInfo.category === "Wheeled") {
            score += 5; // Smaller profile aids reconnaissance
        } else if (chassisInfo.weight_class === 'super_heavy') {
            score -= 5; // Large vehicles easier to detect
        }
        
        // Final validation to prevent NaN
        if (isNaN(score) || !isFinite(score)) {
            score = baseScore;
        }
        return Math.min(100, Math.max(0, Math.round(score)));
    }
    
    static calculateMaintenance(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseScore = 50;
        
        // Chassis-specific maintenance expectations (higher = easier maintenance)
        switch (chassisInfo.category) {
            case "Wheeled":
                baseScore = 70; // Wheeled vehicles easier to maintain
                break;
            case "Light Tracked":
                baseScore = 60; // Light vehicles easier to maintain
                break;
            case "Airmobile":
                baseScore = 65; // Designed for easy maintenance in field
                break;
            case "Main Battle Tank":
                baseScore = 40; // MBTs have moderate maintenance complexity
                break;
            case "Anti-Aircraft":
                baseScore = 45; // SPAA moderate maintenance requirements
                break;
            case "Amphibious":
                baseScore = 35; // Amphibious vehicles complex to maintain
                break;
            case "Self-Propelled Artillery":
                baseScore = 30; // SPG heavy and complex
                break;
            case "Super Heavy Tank":
                baseScore = 15; // Super heavy very difficult maintenance
                break;
        }
        
        let score = baseScore;
        
        // Weight penalty/bonus - chassis-specific scaling
        const weight = this.calculateTotalWeight(vehicle);
        let weightPenalty = 0;
        
        if (chassisInfo.weight_class === 'light') {
            if (weight > 25000) weightPenalty = -10;
            else if (weight < 15000) weightPenalty = +15; // Light chassis get big bonus for being light
        } else if (chassisInfo.weight_class === 'medium') {
            if (weight > 45000) weightPenalty = -20;
            else if (weight > 35000) weightPenalty = -10;
            else if (weight < 25000) weightPenalty = +8;
        } else if (chassisInfo.weight_class === 'heavy') {
            if (weight > 60000) weightPenalty = -25;
            else if (weight > 50000) weightPenalty = -15;
            else if (weight < 40000) weightPenalty = +5;
        } else if (chassisInfo.weight_class === 'super_heavy') {
            if (weight > 80000) weightPenalty = -35;
            else if (weight > 70000) weightPenalty = -25;
            // No bonus for super heavy - they're inherently logistically challenging
        }
        
        score += weightPenalty;
        
        // Fuel consumption - chassis-specific impact
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.consumption) {
                let fuelPenalty = 0;
                if (engine.consumption > 2.5) fuelPenalty = -25;
                else if (engine.consumption > 2.0) fuelPenalty = -20;
                else if (engine.consumption > 1.5) fuelPenalty = -10;
                else if (engine.consumption < 1.0) fuelPenalty = +8;
                else if (engine.consumption < 0.8) fuelPenalty = +12;
                
                // Wheeled and light vehicles get more benefit from fuel efficiency
                if (chassisInfo.category === "Wheeled" || chassisInfo.weight_class === 'light') {
                    if (fuelPenalty > 0) fuelPenalty *= 1.5; // Bigger bonus for efficiency
                }
                
                score += fuelPenalty;
            }
        }
        
        // Maintenance complexity - chassis and component interaction
        let maintenancePenalty = 0;
        
        // Chassis base maintenance complexity
        if (chassisInfo.maintenance_complexity) {
            maintenancePenalty += chassisInfo.maintenance_complexity * 15;
        }
        
        // Transmission maintenance
        if (vehicle?.transmission && window.VEHICLE_COMPONENTS?.transmissions) {
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            if (transmission?.maintenance_complexity) {
                maintenancePenalty += transmission.maintenance_complexity * 10;
            }
        }
        
        // Special complexity penalties for certain combinations
        if (chassisInfo.category === "Amphibious") {
            maintenancePenalty += 10; // Waterproofing adds complexity
        }
        if (chassisInfo.category === "Experimental") {
            maintenancePenalty += 15; // Experimental tech harder to maintain
        }
        
        score -= maintenancePenalty;
        
        // Special equipment effects on maintenance
        if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
            vehicle.specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment) {
                    // Maintenance-specific equipment
                    if (equipment.field_repair_capability) {
                        score += equipment.field_repair_capability * 40; // field_repair_kit
                    }
                    if (equipment.reliability_bonus) {
                        score += equipment.reliability_bonus * 50; // spare_parts_storage
                    }
                    if (equipment.maintenance_time_reduction) {
                        score += equipment.maintenance_time_reduction * 35; // field_repair_kit
                    }
                    if (equipment.preventive_maintenance_bonus) {
                        score += equipment.preventive_maintenance_bonus * 30; // diagnostic_equipment
                    }
                    if (equipment.maintenance_interval_extension) {
                        score += equipment.maintenance_interval_extension * 25; // spare_parts_storage
                    }
                    
                    // Equipment that makes maintenance harder
                    if (equipment.maintenance_complexity) {
                        score -= equipment.maintenance_complexity * 15; // Complex equipment
                    }
                    if (equipment.installation_complexity) {
                        score -= equipment.installation_complexity * 10; // Hard to install/maintain
                    }
                }
            });
        }
        
        // Road speed bonus for maintenance (easier to get to repair facilities)
        if (chassisInfo.terrain_mult?.road > 1.1) {
            score += (chassisInfo.terrain_mult.road - 1.0) * 20; // Wheeled get bonus
        }
        
        // Prevent NaN
        if (isNaN(score) || !isFinite(score)) score = baseScore;
        return Math.min(100, Math.max(0, Math.round(score)));
    }
    
    static calculateTotalWeight(vehicle) {
        let weight = 3000; // Base vehicle weight (kg) - just basic hull structure
        
        // Chassis base weight (includes basic structure)
        if (vehicle?.chassis && window.VEHICLE_COMPONENTS?.chassis) {
            const chassis = window.VEHICLE_COMPONENTS.chassis[vehicle.chassis];
            if (chassis) weight = chassis.base_weight || weight;
        }
        
        // Add component weights
        const components = ['engine', 'transmission', 'suspension'];
        components.forEach(comp => {
            if (vehicle?.[comp] && window.VEHICLE_COMPONENTS?.[comp + 's']) {
                let component;
                if (comp === 'engine') {
                    component = (typeof window.getResolvedComponent === 'function')
                        ? window.getResolvedComponent('engines', vehicle.engine)
                        : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
                } else {
                    component = window.VEHICLE_COMPONENTS[comp + 's'][vehicle[comp]];
                }
                if (component?.weight) weight += component.weight;
            }
        });
        
        // Calculate realistic armor weight based on thickness and material
        weight += this.calculateArmorWeight(vehicle);
        
        // Add weapon weights
        weight += this.calculateWeaponWeight(vehicle);
        
        // Add additional armor weights
        if (vehicle?.additional_armor && window.VEHICLE_COMPONENTS?.additional_armor) {
            vehicle.additional_armor.forEach(armorId => {
                const armor = window.VEHICLE_COMPONENTS.additional_armor[armorId];
                if (armor?.weight) weight += armor.weight;
            });
        }
        
        // Add special equipment weights
        const specialEquipList = vehicle?.specialEquipment || vehicle?.special_equipment || [];
        if (Array.isArray(specialEquipList) && window.VEHICLE_COMPONENTS?.special_equipment) {
            specialEquipList.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment?.weight) {
                    weight += equipment.weight;
                    
                    // Some equipment affects internal space/storage which might affect weight distribution
                    if (equipment.internal_space_reduction) {
                        // Space reduction might mean less ammo/fuel can be carried
                        // This is already handled in other calculations, but noted here
                    }
                }
            });
        }
        
        // Add ammunition weight (rough estimate)
        weight += this.calculateAmmoWeight(vehicle);
        
        // Add fuel weight (rough estimate)
        weight += this.calculateFuelWeight(vehicle);
        
        return weight;
    }
    
    static calculateArmorWeight(vehicle) {
        let armorWeight = 0;
        
        // Support both legacy and new naming conventions
        if (!(vehicle?.armor_thickness || vehicle?.armorThickness)) return armorWeight;
        
        // Get material weight factor
        let materialFactor = 1.0; // Default for mild steel
        if (vehicle?.armor_material && window.VEHICLE_COMPONENTS?.armor_materials) {
            const material = window.VEHICLE_COMPONENTS.armor_materials[vehicle.armor_material];
            if (material?.weight_factor) {
                materialFactor = material.weight_factor;
            }
        }
        
        // Calculate armor weight based on vehicle size and thickness
        // Rough formula: surface area * thickness * steel density * material factor
        const chassis = window.VEHICLE_COMPONENTS?.chassis?.[vehicle?.chassis];
        if (chassis) {
            let surfaceAreaFactor = 1.0;
            
            // Estimate surface area based on chassis type
            if (chassis.weight_class === 'light') surfaceAreaFactor = 35; // ~35m² surface area
            else if (chassis.weight_class === 'medium') surfaceAreaFactor = 50; // ~50m²
            else if (chassis.weight_class === 'heavy') surfaceAreaFactor = 65; // ~65m²
            else if (chassis.weight_class === 'super_heavy') surfaceAreaFactor = 90; // ~90m²
            
            // Steel density: ~7.85 kg per m² per mm thickness
            const steelDensity = 7.85;
            
            // Average thickness (frontal is thickest, sides/rear are thinner)
            const frontal = (vehicle.armor_thickness?.frontal ?? vehicle.armorThickness ?? 50);
            const side = vehicle.armor_thickness?.side || frontal * 0.6;
            const rear = vehicle.armor_thickness?.rear || frontal * 0.4;
            const avgThickness = (frontal + side + rear) / 3;
            
            armorWeight = surfaceAreaFactor * avgThickness * steelDensity * materialFactor;
        }
        
        return Math.round(armorWeight);
    }
    
    static calculateWeaponWeight(vehicle) {
        let weaponWeight = 0;
        
        // Main gun weight - use actual gun data when available
        if (vehicle?.main_gun && window.VEHICLE_COMPONENTS?.main_guns) {
            const gun = window.VEHICLE_COMPONENTS.main_guns[vehicle.main_gun];
            if (gun?.weight) {
                weaponWeight += gun.weight;
            }
        } else if (vehicle?.main_gun_caliber) {
            // Fallback to caliber-based estimates
            const caliber = vehicle.main_gun_caliber;
            if (caliber <= 37) weaponWeight += 200;       // Light AT guns
            else if (caliber <= 57) weaponWeight += 800;  // Medium guns
            else if (caliber <= 75) weaponWeight += 1500; // Heavy guns  
            else if (caliber <= 88) weaponWeight += 2200; // Very heavy
            else if (caliber <= 105) weaponWeight += 3000; // Artillery
            else if (caliber <= 122) weaponWeight += 4500; // Heavy artillery
            else if (caliber <= 152) weaponWeight += 6500; // Very heavy artillery
            else weaponWeight += 8000; // Super heavy guns
        }
        
        // Secondary weapons weight - use actual data when available
        if (vehicle?.secondary_weapons && window.VEHICLE_COMPONENTS?.secondary_weapons) {
            vehicle.secondary_weapons.forEach(weaponId => {
                const weapon = window.VEHICLE_COMPONENTS.secondary_weapons[weaponId];
                if (weapon?.weight) {
                    weaponWeight += weapon.weight;
                } else {
                    weaponWeight += 150; // Fallback estimate
                }
            });
        }
        
        // AA guns weight - use actual data when available
        if (vehicle?.aa_guns && window.VEHICLE_COMPONENTS?.aa_guns) {
            vehicle.aa_guns.forEach(gunId => {
                const gun = window.VEHICLE_COMPONENTS.aa_guns[gunId];
                if (gun?.weight) {
                    weaponWeight += gun.weight;
                } else {
                    weaponWeight += 400; // Fallback estimate
                }
            });
        }
        
        return weaponWeight;
    }
    
    static calculateAmmoWeight(vehicle) {
        let ammoWeight = 0;
        
        // Main gun ammo - use actual gun data when available
        if (vehicle?.main_gun && window.VEHICLE_COMPONENTS?.main_guns) {
            const gun = window.VEHICLE_COMPONENTS.main_guns[vehicle.main_gun];
            if (gun?.ammunition_weight) {
                const roundCount = vehicle?.ammoCapacity || 40; // Use actual capacity if available
                ammoWeight += roundCount * gun.ammunition_weight;
            } else if (gun?.caliber) {
                // Fallback using caliber from gun data
                const caliber = gun.caliber;
                const roundCount = 40;
                if (caliber <= 37) ammoWeight += roundCount * 2;
                else if (caliber <= 57) ammoWeight += roundCount * 4;
                else if (caliber <= 75) ammoWeight += roundCount * 8;
                else if (caliber <= 88) ammoWeight += roundCount * 12;
                else if (caliber <= 105) ammoWeight += roundCount * 18;
                else if (caliber <= 122) ammoWeight += roundCount * 25;
                else if (caliber <= 152) ammoWeight += roundCount * 45;
                else ammoWeight += roundCount * 60;
            }
        } else if (vehicle?.main_gun_caliber) {
            // Fallback to caliber-based estimates
            const caliber = vehicle.main_gun_caliber;
            const roundCount = 40; // Average round count
            
            if (caliber <= 37) ammoWeight += roundCount * 2;     // ~2kg per round
            else if (caliber <= 57) ammoWeight += roundCount * 4;  // ~4kg per round
            else if (caliber <= 75) ammoWeight += roundCount * 8;  // ~8kg per round
            else if (caliber <= 88) ammoWeight += roundCount * 12; // ~12kg per round
            else if (caliber <= 105) ammoWeight += roundCount * 18; // ~18kg per round
            else if (caliber <= 122) ammoWeight += roundCount * 25; // ~25kg per round
            else if (caliber <= 152) ammoWeight += roundCount * 45; // ~45kg per round
            else ammoWeight += roundCount * 60; // ~60kg per round for super heavy
        }
        
        // Secondary weapon ammo
        if (vehicle?.secondary_weapons) {
            ammoWeight += vehicle.secondary_weapons.length * 200; // ~200kg per MG ammo load
        }
        
        // Apply ammo reduction from wet storage
        if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
            vehicle.specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment?.ammo_capacity_reduction) {
                    ammoWeight *= (1 - equipment.ammo_capacity_reduction); // wet_ammunition_storage
                }
            });
        }
        
        return ammoWeight;
    }
    
    static calculateFuelWeight(vehicle) {
        // Estimate fuel capacity based on engine size and vehicle type
        let fuelCapacity = 400; // liters, default
        
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.power) {
                // Bigger engines need more fuel for same range
                fuelCapacity = Math.max(300, engine.power * 0.6);
            }
        }
        
        // Diesel/gasoline density ~0.85kg/L
        return Math.round(fuelCapacity * 0.85);
    }
    
    static getPerformanceDetails(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        return {
            weight: this.calculateTotalWeight(vehicle),
            power_to_weight: (vehicle?.engine ? (
                ((typeof window.getResolvedComponent === 'function')
                    ? window.getResolvedComponent('engines', vehicle.engine)?.power
                    : (window.VEHICLE_COMPONENTS?.engines[vehicle.engine]?.base?.power || window.VEHICLE_COMPONENTS?.engines[vehicle.engine]?.power)) || 0
            ) / Math.max(1, (this.calculateTotalWeight(vehicle) / 1000)) : 0),
            max_speed: this.calculateMaxSpeed(vehicle, chassisInfo),
            range: this.calculateRange(vehicle, chassisInfo),
            crew_size: vehicle?.crewSize || chassisInfo?.crew_capacity?.optimal || 2,
            chassis_type: chassisInfo.category || "Unknown",
            role_optimization: this.getRoleOptimization(chassisInfo)
        };
    }
    
    static getRoleOptimization(chassisInfo) {
        // Return a description of what the chassis is optimized for
        switch (chassisInfo.category) {
            case "Main Battle Tank": return "Combate balanceado";
            case "Super Heavy Tank": return "Máxima proteção";
            case "Light Tracked": return "Mobilidade e reconhecimento";
            case "Wheeled": return "Mobilidade estratégica";
            case "Anti-Aircraft": return "Defesa antiaérea";
            case "Self-Propelled Artillery": return "Suporte de fogo";
            case "Amphibious": return "Operações anfíbias";
            case "Airmobile": return "Desdobramento rápido";
            default: return "Uso geral";
        }
    }
    
    static calculateMaxSpeed(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseSpeed = chassisInfo?.base_speed || 45;
        
        if (vehicle?.engine && vehicle?.transmission && window.VEHICLE_COMPONENTS?.engines && window.VEHICLE_COMPONENTS?.transmissions) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            
            if (engine && transmission) {
                const powerToWeight = (engine?.power || 0) / (this.calculateTotalWeight(vehicle) / 1000);
                let calculatedSpeed = Math.min(80, 25 + powerToWeight * 1.5);
                
                // Apply chassis-specific speed characteristics
                if (chassisInfo.category === "Wheeled") {
                    calculatedSpeed *= 1.2; // Wheeled vehicles faster on roads
                } else if (chassisInfo.category === "Super Heavy Tank") {
                    calculatedSpeed *= 0.7; // Super heavy tanks much slower
                } else if (chassisInfo.category === "Light Tracked") {
                    calculatedSpeed *= 1.1; // Light vehicles slightly faster
                }
                
                // Use chassis base speed as minimum, calculated speed as potential maximum
                baseSpeed = Math.max(chassisInfo?.base_speed || 45, calculatedSpeed);
                
                if (transmission.max_speed_road) {
                    baseSpeed = Math.min(baseSpeed, transmission.max_speed_road);
                }
                
                // Apply terrain multiplier for road speed
                if (chassisInfo.terrain_mult?.road) {
                    baseSpeed *= chassisInfo.terrain_mult.road;
                }
            }
        }
        
        return Math.round(baseSpeed);
    }
    
    static calculateRange(vehicle, chassis = null) {
        const chassisInfo = chassis || this.getChassisInfo(vehicle);
        let baseRange = 200; // km
        
        // Chassis-specific fuel capacity estimates
        let fuelCapacity = 400; // liters, default
        switch (chassisInfo.weight_class) {
            case "light": fuelCapacity = 300; break;
            case "medium": fuelCapacity = 500; break;
            case "heavy": fuelCapacity = 700; break;
            case "super_heavy": fuelCapacity = 1000; break;
        }
        
        // Special chassis adjustments
        if (chassisInfo.category === "Wheeled") {
            fuelCapacity *= 0.8; // Wheeled vehicles have less space for fuel
        } else if (chassisInfo.category === "Self-Propelled Artillery") {
            fuelCapacity *= 1.2; // SPG can carry more fuel
        }
        
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.consumption) {
                let effectiveConsumption = engine.consumption;
                
                // Apply chassis fuel consumption multiplier
                if (chassisInfo.fuel_consumption_base) {
                    effectiveConsumption *= chassisInfo.fuel_consumption_base;
                }
                
                // Apply special equipment fuel effects
                let rangeMultiplier = 1.0;
                if (vehicle?.specialEquipment && window.VEHICLE_COMPONENTS?.special_equipment) {
                    vehicle.specialEquipment.forEach(equipId => {
                        const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                        if (equipment) {
                            // Fuel tank equipment
                            if (equipment.range_bonus) {
                                rangeMultiplier += equipment.range_bonus; // extra_fuel_tanks_external/internal
                            }
                            // Equipment that increases fuel consumption
                            if (equipment.fuel_consumption_increase) {
                                effectiveConsumption *= (1 + equipment.fuel_consumption_increase); // exhaust_smoke_system, crew_heater
                            }
                        }
                    });
                }
                
                baseRange = Math.round((fuelCapacity / effectiveConsumption) * rangeMultiplier);
            }
        }
        
        return baseRange;
    }
    
    static getDefaultMetrics() {
        return {
            mobility: 0,
            firepower: 0,
            protection: 0,
            survivability: 0,
            reconnaissance: 0,
            logistics: 0,
            combat_effectiveness: 0,
            details: {
                weight: 0,
                power_to_weight: 0,
                max_speed: 0,
                range: 0,
                crew_size: 0
            }
        };
    }
    
    static renderPerformanceDisplay(vehicle) {
        const metrics = this.calculatePerformanceMetrics(vehicle);
        const chassisInfo = this.getChassisInfo(vehicle);
        
        let html = '<h3 class="text-xl font-semibold text-slate-100 mb-4">📈 Análise de Performance</h3>';
        
        // Chassis Role Information
        html += '<div class="mb-3 p-2 rounded bg-slate-800/30 border border-slate-700/30">';
        html += '<div class="flex items-center justify-between text-sm">';
        html += `<span class="text-slate-400">Tipo de Chassi:</span>`;
        html += `<span class="text-slate-200 font-medium">${chassisInfo.name || "Desconhecido"}</span>`;
        html += '</div>';
        html += '<div class="flex items-center justify-between text-sm mt-1">';
        html += `<span class="text-slate-400">Otimizado para:</span>`;
        html += `<span class="text-slate-300">${metrics.details.role_optimization}</span>`;
        html += '</div>';
        html += '</div>';
        
        // Combat Effectiveness Score
        const effectivenessColor = metrics.combat_effectiveness >= 80 ? 'text-green-400' : 
                                 metrics.combat_effectiveness >= 60 ? 'text-yellow-400' : 'text-red-400';
        
        html += '<div class="mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">';
        html += '<div class="flex items-center justify-between">';
        html += '<span class="text-slate-200 font-medium">Eficácia de Combate Geral</span>';
        html += `<span class="${effectivenessColor} font-bold text-xl">${metrics.combat_effectiveness}/100</span>`;
        html += '</div>';
        html += '<div class="w-full bg-slate-700 rounded-full h-2 mt-2">';
        html += `<div class="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style="width: ${metrics.combat_effectiveness}%"></div>`;
        html += '</div>';
        html += '</div>';
        
        // Performance Categories - with chassis-specific icons
        html += '<div class="space-y-3">';
        
        const categories = this.getChassisSpecificCategories(chassisInfo);
        
        categories.forEach(cat => {
            const score = metrics[cat.key];
            const color = score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400';
            const bgColor = score >= 75 ? 'from-green-500 to-green-400' : 
                           score >= 50 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400';
            
            html += '<div class="flex items-center justify-between text-sm">';
            html += `<span class="text-slate-300">${cat.icon} ${cat.name}</span>`;
            html += '<div class="flex items-center gap-2 flex-1 ml-3">';
            html += '<div class="flex-1 bg-slate-700 rounded-full h-1.5">';
            html += `<div class="h-1.5 rounded-full bg-gradient-to-r ${bgColor}" style="width: ${score}%"></div>`;
            html += '</div>';
            html += `<span class="${color} font-medium w-8 text-right">${score}</span>`;
            html += '</div>';
            html += '</div>';
        });
        
        html += '</div>';
        
        // Performance Details
        html += '<div class="mt-4 pt-3 border-t border-slate-700/50">';
        html += '<h4 class="text-slate-200 font-medium mb-2">Detalhes Técnicos</h4>';
        html += '<div class="grid grid-cols-2 gap-2 text-xs text-slate-400">';
        html += `<div><span class="text-slate-500">Peso:</span> <span class="text-slate-300">${(metrics.details.weight/1000).toFixed(1)}t</span></div>`;
        html += `<div><span class="text-slate-500">Vel. Máx:</span> <span class="text-slate-300">${metrics.details.max_speed}km/h</span></div>`;
        html += `<div><span class="text-slate-500">Potência/Peso:</span> <span class="text-slate-300">${metrics.details.power_to_weight.toFixed(1)}hp/t</span></div>`;
        html += `<div><span class="text-slate-500">Alcance:</span> <span class="text-slate-300">${metrics.details.range}km</span></div>`;
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    static getChassisSpecificCategories(chassisInfo) {
        // Return categories with appropriate icons for the chassis type
        const baseCategories = [
            { key: 'mobility', name: 'Mobilidade', icon: '🚛' },
            { key: 'firepower', name: 'Poder de Fogo', icon: '💥' },
            { key: 'protection', name: 'Proteção', icon: '🛡️' },
            { key: 'survivability', name: 'Sobrevivência', icon: '❤️' },
            { key: 'reconnaissance', name: 'Reconhecimento', icon: '👁️' },
            { key: 'maintenance', name: 'Manutenção', icon: '🔧' }
        ];
        
        // Customize icons based on chassis category
        switch (chassisInfo.category) {
            case "Wheeled":
                baseCategories[0].icon = '🚗'; // Car for wheeled mobility
                baseCategories[5].icon = '🔧'; // Wrench for easy maintenance
                break;
            case "Anti-Aircraft":
                baseCategories[1].icon = '🎯'; // Target for AA firepower
                baseCategories[4].icon = '📡'; // Radar for reconnaissance
                break;
            case "Self-Propelled Artillery":
                baseCategories[1].icon = '💣'; // Bomb for artillery firepower
                break;
            case "Amphibious":
                baseCategories[0].icon = '🛟'; // Life preserver for amphibious mobility
                break;
            case "Airmobile":
                baseCategories[0].icon = '✈️'; // Plane for air mobility
                baseCategories[5].icon = '🛠️'; // Tools for field maintenance
                break;
        }
        
        return baseCategories;
    }
}

// Export for global use
window.PerformanceSystem = PerformanceSystem;
