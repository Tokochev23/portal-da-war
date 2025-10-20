// js/utils/costSystem.js - Vehicle cost calculation and analysis system

class CostSystem {
    
    static calculateCosts(vehicle) {
        console.log('📊 CostSystem: Starting cost calculation');

        // FORÇA valores básicos se não encontrar dados
        let productionCost = 50000; // Base mínima de $50K
        let maintenanceCost = 5000;  // Base mínima de $5K
        let operationalCost = 15000; // Base mínima de $15K

        try {
            if (vehicle && window.VEHICLE_COMPONENTS) {
                // Early exit: nothing selected -> zero costs
                const isEmpty = (
                    !vehicle.chassis && !vehicle.engine && !vehicle.transmission && !vehicle.suspension &&
                    !vehicle.fcs && !vehicle.optics && !vehicle.communication &&
                    (!vehicle.special_equipment || vehicle.special_equipment.length === 0) &&
                    (!vehicle.specialEquipment || vehicle.specialEquipment.length === 0) &&
                    (!vehicle.secondary_weapons || vehicle.secondary_weapons.length === 0)
                );
                if (isEmpty) {
                    return this.getDefaultCosts();
                }
                const calculatedProduction = this.calculateProductionCost(vehicle);
                const calculatedMaintenance = this.calculateMaintenanceCost(vehicle, calculatedProduction);
                const calculatedOperational = this.calculateOperationalCost(vehicle);

                // Use valores calculados se são válidos
                if (!isNaN(calculatedProduction) && calculatedProduction > 0) {
                    productionCost = calculatedProduction;
                }
                if (!isNaN(calculatedMaintenance) && calculatedMaintenance > 0) {
                    maintenanceCost = calculatedMaintenance;
                }
                if (!isNaN(calculatedOperational) && calculatedOperational > 0) {
                    operationalCost = calculatedOperational;
                }

                // Aplicar modificadores de leis nacionais
                if (window.currentUserCountry?.currentModifiers) {
                    const modifiers = window.currentUserCountry.currentModifiers;

                    // Modificador de custo de produção militar (negativo reduz custo)
                    if (typeof modifiers.militaryProductionCost === 'number') {
                        const costModifier = 1 + modifiers.militaryProductionCost;
                        productionCost *= costModifier;
                        console.log(`🏛️ Lei Nacional: Custo de produção ${modifiers.militaryProductionCost > 0 ? '+' : ''}${(modifiers.militaryProductionCost * 100).toFixed(0)}%`);
                    }
                }
            }
        } catch (error) {
            console.error('🚨 Error in cost calculation, using defaults:', error);
        }

        const totalOwnershipCost = productionCost + (maintenanceCost * 10) + (operationalCost * 10);

        console.log('💰 Final CostSystem Results:', {
            production: productionCost,
            maintenance: maintenanceCost,
            operational: operationalCost,
            total_ownership: totalOwnershipCost
        });

        return {
            production: productionCost,
            maintenance: maintenanceCost,
            operational: operationalCost,
            total_ownership: totalOwnershipCost,
            breakdown: this.getCostBreakdown(vehicle, productionCost),
            efficiency_metrics: this.calculateCostEfficiency(vehicle, productionCost)
        };
    }
    
    static calculateProductionCost(vehicle) {
        let totalCost = 0;
        let costDetails = {};
        
        // Chassis base cost
        if (vehicle?.chassis && window.VEHICLE_COMPONENTS?.chassis) {
            const chassis = window.VEHICLE_COMPONENTS.chassis[vehicle.chassis];
            if (chassis) {
                const chassisCost = chassis.base_cost || 0;
                totalCost += chassisCost;
                costDetails.chassis = chassisCost;
                console.log(`🏗️ Chassis cost: $${chassisCost.toLocaleString()}`);
            }
        } else {
            console.log('⚠️ No chassis selected');
        }
        
        // Engine cost (based on power and complexity)
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.power) {
                let engineCost = engine.power * 45; // $45 per hp base cost
                const rawEngineRef = window.VEHICLE_COMPONENTS.engines[vehicle.engine];
                const fuelType = engine.fuel_type || rawEngineRef?.fuel_type;
                const isExperimental = (typeof engine.experimental !== 'undefined') ? engine.experimental : !!rawEngineRef?.experimental;
                const isSupercharged = (typeof engine.supercharged !== 'undefined') ? engine.supercharged : !!rawEngineRef?.supercharged;

                // Complexity multipliers
                if (fuelType === 'diesel') engineCost *= 1.3;
                if (isExperimental) engineCost *= 2.5;
                if (isSupercharged) engineCost *= 1.4;
                
                totalCost += Math.round(engineCost);
            }
        }
        
        // Transmission cost
        if (vehicle?.transmission && window.VEHICLE_COMPONENTS?.transmissions) {
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            if (transmission) {
                let transCost = transmission.cost || 5000;
                
                // Technology multipliers
                if (transmission.type === 'automatic') transCost *= 1.5;
                else if (transmission.type === 'semi_auto') transCost *= 1.3;
                else if (transmission.type === 'planetary') transCost *= 2.0;
                else if (transmission.type === 'cvt' || transmission.type === 'electric') transCost *= 3.0;
                
                totalCost += Math.round(transCost);
            }
        }
        
        // Suspension cost
        if (vehicle?.suspension && window.VEHICLE_COMPONENTS?.suspensions) {
            const suspension = window.VEHICLE_COMPONENTS.suspensions[vehicle.suspension];
            if (suspension) {
                let suspCost = suspension.cost || 2500;
                
                // Advanced suspension multipliers
                if (suspension.hydropneumatic) suspCost *= 2.5;
                if (suspension.adaptive_experimental) suspCost *= 4.0;
                if (suspension.variable_height) suspCost *= 1.8;
                
                totalCost += Math.round(suspCost);
            }
        }
        
        // Armor cost (calculated based on weight and material)
        totalCost += this.calculateArmorCost(vehicle);
        
        // Weapons cost
        totalCost += this.calculateWeaponsCost(vehicle);
        
        // Systems cost (fire control, optics, communication)
        totalCost += this.calculateSystemsCost(vehicle);
        
        // Crew training and equipment cost
        const crewCost = this.calculateCrewCost(vehicle);
        totalCost += crewCost;
        costDetails.crew = crewCost;
        
        // Special equipment cost (support both naming conventions)
        const specialEquipment = vehicle?.specialEquipment || vehicle?.special_equipment || [];
        console.log('🛠️ Special Equipment Check:', {
            specialEquipmentFound: specialEquipment,
            length: specialEquipment.length,
            componentsAvailable: !!window.VEHICLE_COMPONENTS?.special_equipment
        });
        
        if (specialEquipment.length > 0 && window.VEHICLE_COMPONENTS?.special_equipment) {
            let equipmentCost = 0;
            specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment?.cost) {
                    equipmentCost += equipment.cost;
                    console.log(`⚙️ Special Equipment: ${equipment.name} - $${equipment.cost.toLocaleString()}`);
                } else {
                    console.log(`❌ Special Equipment not found or no cost: ${equipId}`);
                }
            });
            totalCost += equipmentCost;
            costDetails.specialEquipment = equipmentCost;
        } else if (specialEquipment.length === 0) {
            console.log('ℹ️ No special equipment selected');
        }
        
        // Additional armor cost
        if (vehicle?.additional_armor && window.VEHICLE_COMPONENTS?.additional_armor) {
            vehicle.additional_armor.forEach(armorId => {
                const armor = window.VEHICLE_COMPONENTS.additional_armor[armorId];
                if (armor?.cost) {
                    totalCost += armor.cost;
                }
            });
        }
        
        console.log('📋 Production Cost Breakdown:', costDetails);
        console.log(`💰 Total Production Cost: $${totalCost.toLocaleString()}`);
        
        return Math.round(totalCost);
    }
    
    static calculateArmorCost(vehicle) {
        // Support both naming conventions
        const armorThickness = vehicle?.armor_thickness || vehicle?.armorThickness || 0;
        const armorMaterial = vehicle?.armor_material || vehicle?.armorMaterial;
        
        if (!armorThickness) return 0;
        
        // Get armor weight (calculate here if PerformanceSystem not available)
        let armorWeight = 0;
        if (window.PerformanceSystem && window.PerformanceSystem.calculateArmorWeight) {
            armorWeight = window.PerformanceSystem.calculateArmorWeight(vehicle);
        } else {
            // Fallback calculation
            armorWeight = this.calculateArmorWeight(vehicle);
        }
        
        // Base cost: $8 per kg of armor
        let armorCost = armorWeight * 8;
        
        // Material multipliers
        if (armorMaterial && window.VEHICLE_COMPONENTS?.armor_materials) {
            const material = window.VEHICLE_COMPONENTS.armor_materials[armorMaterial];
            if (material?.cost_factor) {
                armorCost *= material.cost_factor;
            }
        }
        
        return Math.round(armorCost);
    }
    
    static calculateWeaponsCost(vehicle) {
        let weaponsCost = 0;
        // No weapons cost without a selected chassis
        if (!vehicle?.chassis) {
            return 0;
        }
        
        // Main gun cost (based on caliber)
        const mainGunCaliber = vehicle?.main_gun_caliber || 0;
        console.log('🎯 Main Gun Check:', { 
            caliber: mainGunCaliber,
            main_gun_caliber: vehicle?.main_gun_caliber 
        });
        
        if (mainGunCaliber && mainGunCaliber > 0 && !isNaN(mainGunCaliber)) {
            const gunCost = mainGunCaliber * 180; // $180 per mm of caliber
            const mountCost = mainGunCaliber * 120; // Additional $120/mm for mount
            const totalGunCost = gunCost + mountCost;
            
            weaponsCost += totalGunCost;
            console.log(`🎯 Main gun: ${mainGunCaliber}mm - Gun: $${gunCost.toLocaleString()}, Mount: $${mountCost.toLocaleString()}, Total: $${totalGunCost.toLocaleString()}`);
        } else if (mainGunCaliber === 0) {
            console.log('ℹ️ No main gun selected');
        } else {
            console.log('⚠️ Invalid main gun caliber:', mainGunCaliber);
        }
        
        // Secondary weapons (support multiple naming conventions)
        let secondaryWeapons = [];
        
        // Check all possible ways secondary weapons might be stored
        if (vehicle?.secondary_weapons && Array.isArray(vehicle.secondary_weapons) && vehicle.secondary_weapons.length > 0) {
            secondaryWeapons = vehicle.secondary_weapons;
        } else if (vehicle?.secondary_weapon && vehicle.secondary_weapon !== null && vehicle.secondary_weapon !== '') {
            secondaryWeapons = [vehicle.secondary_weapon];
        } else if (vehicle?.secondaryWeapon && vehicle.secondaryWeapon !== null && vehicle.secondaryWeapon !== '') {
            secondaryWeapons = [vehicle.secondaryWeapon];
        } else {
            // Try to find any property that looks like it contains secondary weapons
            for (const [key, value] of Object.entries(vehicle || {})) {
                if (key.toLowerCase().includes('secondary') && value) {
                    if (Array.isArray(value) && value.length > 0) {
                        secondaryWeapons = value;
                        console.log(`🔍 Found secondary weapons in property: ${key}`, value);
                        break;
                    } else if (typeof value === 'string' && value.trim() !== '') {
                        secondaryWeapons = [value];
                        console.log(`🔍 Found secondary weapon in property: ${key}`, value);
                        break;
                    }
                }
            }
            
            // If still no weapons found, try to detect from UI
            if (secondaryWeapons.length === 0) {
                const selectedCards = document.querySelectorAll('.component-card.selected, [class*="selected"], .bg-brand-900, .border-brand-400');
                selectedCards.forEach(card => {
                    const onclick = card.getAttribute('onclick');
                    if (onclick && onclick.includes('selectSecondaryWeapon')) {
                        const match = onclick.match(/selectSecondaryWeapon\(['"]([^'"]+)['"]\)/);
                        if (match && match[1]) {
                            secondaryWeapons.push(match[1]);
                            console.log(`🔍 Found selected weapon from UI: ${match[1]}`);
                        }
                    }
                });
            }
        }
        
        console.log('🔫 FULL Secondary Weapons Debug:', {
            vehicle_keys: Object.keys(vehicle || {}),
            secondary_weapon: vehicle?.secondary_weapon,
            secondary_weapons: vehicle?.secondary_weapons,
            secondaryWeapon: vehicle?.secondaryWeapon,
            secondaryWeapons_final: secondaryWeapons,
            components_available: !!window.VEHICLE_COMPONENTS?.secondary_weapons,
            all_secondary_weapons_ids: Object.keys(window.VEHICLE_COMPONENTS?.secondary_weapons || {}).slice(0, 5) // Show first 5
        });
        
        if (secondaryWeapons.length > 0 && window.VEHICLE_COMPONENTS?.secondary_weapons) {
            secondaryWeapons.forEach(weaponId => {
                if (weaponId && weaponId !== null && weaponId !== undefined && weaponId !== '') {
                    const weapon = window.VEHICLE_COMPONENTS.secondary_weapons[weaponId];
                    console.log(`🔍 Looking up weapon: "${weaponId}"`, weapon);
                    
                    if (weapon && weapon.cost && typeof weapon.cost === 'number' && !isNaN(weapon.cost) && weapon.cost > 0) {
                        weaponsCost += weapon.cost;
                        console.log(`✅ Secondary weapon: ${weapon.name} - $${weapon.cost.toLocaleString()}`);
                    } else {
                        // Try to find the weapon by searching all weapons
                        let found = false;
                        for (const [id, weaponData] of Object.entries(window.VEHICLE_COMPONENTS.secondary_weapons)) {
                            if (weaponData.name && weaponData.name.toLowerCase().includes('7.62')) {
                                if (weaponData.cost && !isNaN(weaponData.cost)) {
                                    weaponsCost += weaponData.cost;
                                    console.log(`🔍 Found by name match: ${weaponData.name} (${id}) - $${weaponData.cost.toLocaleString()}`);
                                    found = true;
                                    break;
                                }
                            }
                        }
                        
                        if (!found) {
                            const defaultCost = 1800; // Custo típico de metralhadora 7.62mm
                            weaponsCost += defaultCost;
                            console.log(`🔫 Secondary weapon (fallback): ${weaponId} - $${defaultCost.toLocaleString()}`);
                            console.log(`❌ Weapon data issue:`, { weaponId, weapon, cost: weapon?.cost });
                        }
                    }
                } else {
                    console.log('⚠️ Invalid secondary weapon ID:', weaponId);
                }
            });
        }
        
        // AA guns (support multiple naming conventions)
        const aaGuns = vehicle?.aa_guns || (vehicle?.aa_gun ? [vehicle.aa_gun] : []);
        console.log('🎯 AA Guns Check:', {
            aaGuns,
            length: aaGuns.length,
            aa_gun: vehicle?.aa_gun,
            aa_guns: vehicle?.aa_guns
        });
        
        if (aaGuns.length > 0 && window.VEHICLE_COMPONENTS?.aa_guns) {
            aaGuns.forEach(gunId => {
                if (gunId && gunId !== null && gunId !== undefined) {
                    const gun = window.VEHICLE_COMPONENTS.aa_guns[gunId];
                    if (gun?.cost && !isNaN(gun.cost)) {
                        weaponsCost += gun.cost;
                        console.log(`🎯 AA gun: ${gun.name} - $${gun.cost.toLocaleString()}`);
                    } else {
                        const fallbackCost = (gun?.caliber && !isNaN(gun.caliber)) ? gun.caliber * 200 : 4000;
                        weaponsCost += fallbackCost;
                        console.log(`🎯 AA gun (fallback cost): ${gunId} - $${fallbackCost.toLocaleString()}`);
                    }
                } else {
                    console.log('⚠️ Invalid AA gun ID:', gunId);
                }
            });
        }
        
        return Math.round(weaponsCost);
    }
    
    static calculateSystemsCost(vehicle) {
        let systemsCost = 0;
        
        // Fire control system
        if (vehicle?.fcs && window.VEHICLE_COMPONENTS?.fire_control) {
            const fcs = window.VEHICLE_COMPONENTS.fire_control[vehicle.fcs];
            console.log('🎯 Fire Control Check:', { fcs_id: vehicle.fcs, fcs_data: fcs });
            
            if (fcs) {
                let fcsCost = fcs.cost || 5000;
                
                // Technology multipliers
                if (fcs.type === 'radar') fcsCost *= 3.0;
                else if (fcs.type === 'electronic') fcsCost *= 5.0;
                else if (fcs.type === 'mechanical') fcsCost *= 1.8;
                
                if (!isNaN(fcsCost)) {
                    systemsCost += fcsCost;
                    console.log(`🎯 Fire Control: ${fcs.name} - $${fcsCost.toLocaleString()}`);
                } else {
                    console.log('❌ FCS cost is NaN:', fcsCost);
                    systemsCost += 5000; // Fallback
                }
            }
        }
        
        // Optics system
        if (vehicle?.optics && window.VEHICLE_COMPONENTS?.optics_systems) {
            const optics = window.VEHICLE_COMPONENTS.optics_systems[vehicle.optics];
            console.log('👁️ Optics Check:', { optics_id: vehicle.optics, optics_data: optics });
            
            if (optics?.cost && !isNaN(optics.cost)) {
                systemsCost += optics.cost;
                console.log(`👁️ Optics: ${optics.name} - $${optics.cost.toLocaleString()}`);
            } else {
                const defaultCost = 1000;
                systemsCost += defaultCost;
                console.log(`👁️ Optics (default): ${vehicle.optics} - $${defaultCost.toLocaleString()}`);
            }
        }
        
        // Communication system
        if (vehicle?.communication && window.VEHICLE_COMPONENTS?.communication) {
            const comm = window.VEHICLE_COMPONENTS.communication[vehicle.communication];
            console.log('📡 Communication Check:', { comm_id: vehicle.communication, comm_data: comm });
            
            if (comm?.cost && !isNaN(comm.cost)) {
                systemsCost += comm.cost;
                console.log(`📡 Communication: ${comm.name} - $${comm.cost.toLocaleString()}`);
            } else {
                const defaultCost = 2000;
                systemsCost += defaultCost;
                console.log(`📡 Communication (default): ${vehicle.communication} - $${defaultCost.toLocaleString()}`);
            }
        }
        
        return Math.round(systemsCost);
    }
    
    static calculateCrewCost(vehicle) {
        let crewCost = 0;
        
        // Basic crew size cost
        const crewSize = vehicle?.crewSize || 3;
        const trainingLevel = vehicle?.trainingLevel || 'standard';
        
        console.log('👥 Crew Cost Check:', { crewSize, trainingLevel });
        
        // Base equipment cost per crew member (uniforms, personal gear, etc.)
        const baseEquipmentCost = 800; // $800 per crew member
        crewCost += crewSize * baseEquipmentCost;
        
        // Training cost based on level
        const trainingCosts = {
            rookie: 1200,    // $1,200 per crew member
            standard: 2500,  // $2,500 per crew member
            veteran: 5000,   // $5,000 per crew member
            elite: 8500      // $8,500 per crew member
        };
        
        const trainingCost = trainingCosts[trainingLevel] || trainingCosts.standard;
        crewCost += crewSize * trainingCost;
        
        console.log(`👥 Crew cost: ${crewSize} crew @ ${trainingLevel} = $${crewCost.toLocaleString()}`);
        
        return crewCost;
    }
    
    static calculateMaintenanceCost(vehicle, productionCost) {
        let totalMaintenanceCost = 0;
        
        // CHASSIS MAINTENANCE (baseado em complexidade e classe de peso)
        if (vehicle?.chassis && window.VEHICLE_COMPONENTS?.chassis) {
            const chassis = window.VEHICLE_COMPONENTS.chassis[vehicle.chassis];
            if (chassis) {
                let chassisMaintenanceRate = chassis.maintenance_complexity || 0.15;
                if (chassis.weight_class === 'light') chassisMaintenanceRate *= 1.0;
                else if (chassis.weight_class === 'medium') chassisMaintenanceRate *= 1.2;
                else if (chassis.weight_class === 'heavy') chassisMaintenanceRate *= 1.6;
                else if (chassis.weight_class === 'super_heavy') chassisMaintenanceRate *= 2.2;
                
                totalMaintenanceCost += (chassis.base_cost || 0) * chassisMaintenanceRate;
            }
        }
        
        // ENGINE MAINTENANCE (motores a diesel são mais baratos de manter que turbinas)
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine) {
                let engineMaintenanceCost = engine.maintenance_hours || 2.0; // horas por mês
                
                // Custo por hora de manutenção baseado no tipo de combustível
                let costPerHour = 25; // Base: $25/hora
                if ((engine.fuel_type || window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.fuel_type) === 'diesel') costPerHour = 20; // Diesel mais barato
                else if ((engine.fuel_type || window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.fuel_type) === 'kerosene') costPerHour = 45; // Turbina mais cara
                else if ((engine.fuel_type || window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.fuel_type) === 'gasoline') costPerHour = 22;
                
                // Motores experimentais custam muito mais
                if (engine.experimental || window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.experimental) costPerHour *= 3.5;
                
                // Supercharged aumenta custo
                if (engine.supercharged || window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.supercharged) costPerHour *= 1.8;
                
                // Reliability factor (melhor confiabilidade = menor manutenção)
                if (engine.reliability) {
                    costPerHour *= (1.5 - (engine.reliability * 0.5));
                }
                
                totalMaintenanceCost += engineMaintenanceCost * costPerHour * 12; // Por ano
            }
        }
        
        // TRANSMISSION MAINTENANCE (automáticas custam mais que manuais)
        if (vehicle?.transmission && window.VEHICLE_COMPONENTS?.transmissions) {
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            if (transmission) {
                let transmissionMaintenance = (transmission.cost || 5000) * (transmission.maintenance_complexity || 0.2);
                
                // Multiplicadores por tipo de transmissão
                if (transmission.type === 'manual') transmissionMaintenance *= 1.0; // Baseline
                else if (transmission.type === 'semi_auto') transmissionMaintenance *= 1.4;
                else if (transmission.type === 'automatic') transmissionMaintenance *= 2.1;
                else if (transmission.type === 'planetary') transmissionMaintenance *= 2.8;
                else if (transmission.type === 'cvt') transmissionMaintenance *= 3.5;
                else if (transmission.type === 'electric') transmissionMaintenance *= 1.8; // Elétrica menos peças móveis
                
                totalMaintenanceCost += transmissionMaintenance;
            }
        }
        
        // SUSPENSION MAINTENANCE
        if (vehicle?.suspension && window.VEHICLE_COMPONENTS?.suspensions) {
            const suspension = window.VEHICLE_COMPONENTS.suspensions[vehicle.suspension];
            if (suspension) {
                let suspensionMaintenance = (suspension.cost || 2500) * 0.25; // 25% do custo por ano
                
                // Suspensões hidropneumáticas e adaptáveis custam mais
                if (suspension.hydropneumatic) suspensionMaintenance *= 2.2;
                if (suspension.adaptive_experimental) suspensionMaintenance *= 4.5;
                if (suspension.variable_height) suspensionMaintenance *= 1.9;
                
                totalMaintenanceCost += suspensionMaintenance;
            }
        }
        
        // WEAPONS MAINTENANCE (canhões maiores custam mais)
        if (vehicle?.chassis && vehicle?.main_gun_caliber) {
            const caliberMaintenance = vehicle.main_gun_caliber * 15; // $15 por mm por ano
            totalMaintenanceCost += caliberMaintenance;
        }
        
        // Secondary weapons maintenance
        const secondaryWeapons = vehicle?.secondary_weapons || vehicle?.secondary_weapon ? [vehicle.secondary_weapon] : [];
        if (secondaryWeapons.length > 0 && window.VEHICLE_COMPONENTS?.secondary_weapons) {
            secondaryWeapons.forEach(weaponId => {
                const weapon = window.VEHICLE_COMPONENTS.secondary_weapons[weaponId];
                if (weapon) {
                    totalMaintenanceCost += (weapon.cost || 1500) * 0.3; // 30% do custo por ano
                }
            });
        }
        
        // AA guns maintenance
        const aaGuns = vehicle?.aa_guns || vehicle?.aa_gun ? [vehicle.aa_gun] : [];
        if (aaGuns.length > 0 && window.VEHICLE_COMPONENTS?.aa_guns) {
            aaGuns.forEach(gunId => {
                if (gunId) {
                    const gun = window.VEHICLE_COMPONENTS.aa_guns[gunId];
                    if (gun) {
                        const gunMaintenance = (gun.cost || gun.caliber * 200) * 0.35;
                        totalMaintenanceCost += gunMaintenance;
                    }
                }
            });
        }
        
        // SYSTEMS MAINTENANCE (sistemas eletrônicos custam mais)
        if (vehicle?.fcs && window.VEHICLE_COMPONENTS?.fire_control) {
            const fcs = window.VEHICLE_COMPONENTS.fire_control[vehicle.fcs];
            if (fcs) {
                let fcsMaintenance = (fcs.cost || 5000) * 0.4; // 40% por ano
                
                if (fcs.type === 'mechanical') fcsMaintenance *= 0.8; // Mais simples
                else if (fcs.type === 'radar') fcsMaintenance *= 2.5; // Complexo
                else if (fcs.type === 'electronic') fcsMaintenance *= 4.2; // Muito complexo
                
                totalMaintenanceCost += fcsMaintenance;
            }
        }
        
        // Optics maintenance
        if (vehicle?.optics && window.VEHICLE_COMPONENTS?.optics_systems) {
            const optics = window.VEHICLE_COMPONENTS.optics_systems[vehicle.optics];
            if (optics) {
                totalMaintenanceCost += (optics.cost || 1000) * 0.25; // 25% por ano
            }
        }
        
        // Communication maintenance
        if (vehicle?.communication && window.VEHICLE_COMPONENTS?.communication) {
            const comm = window.VEHICLE_COMPONENTS.communication[vehicle.communication];
            if (comm) {
                totalMaintenanceCost += (comm.cost || 2000) * 0.3; // 30% por ano
            }
        }
        
        // SPECIAL EQUIPMENT MAINTENANCE (equipamentos complexos custam mais)
        const specialEquipment = vehicle?.specialEquipment || vehicle?.special_equipment || [];
        if (specialEquipment.length > 0 && window.VEHICLE_COMPONENTS?.special_equipment) {
            specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment) {
                    let equipMaintenance = (equipment.cost || 3000) * 0.35;
                    
                    // Equipamentos com consumo de energia custam mais
                    if (equipment.energy_consumption > 2) equipMaintenance *= 1.5;
                    if (equipment.installation_complexity > 0.7) equipMaintenance *= 1.3;
                    
                    totalMaintenanceCost += equipMaintenance;
                }
            });
        }
        
        // ARMOR MAINTENANCE (materiais avançados custam mais para manter)
        const armorThickness = vehicle?.armor_thickness || vehicle?.armorThickness || 0;
        const armorMaterial = vehicle?.armor_material || vehicle?.armorMaterial;
        
        if (armorThickness && armorMaterial) {
            const armorWeight = this.calculateArmorWeight(vehicle);
            let armorMaintenance = armorWeight * 0.5; // $0.5 per kg per year base
            
            if (armorMaterial && window.VEHICLE_COMPONENTS?.armor_materials) {
                const material = window.VEHICLE_COMPONENTS.armor_materials[armorMaterial];
                if (material) {
                    if (material.cost_factor > 1.5) armorMaintenance *= 1.4; // Materiais caros
                    if (material.experimental) armorMaintenance *= 2.8;
                }
            }
            
            totalMaintenanceCost += armorMaintenance;
        }
        
        return Math.round(totalMaintenanceCost);
    }
    
    static calculateArmorWeight(vehicle) {
        const armorThickness = vehicle?.armor_thickness || vehicle?.armorThickness || 0;
        if (!armorThickness) return 0;
        
        const chassis = window.VEHICLE_COMPONENTS?.chassis?.[vehicle?.chassis];
        if (!chassis) return 0;
        
        // Calculate armor area based on vehicle size
        const approximateArea = chassis.weight_class === 'light' ? 25 : 
                              chassis.weight_class === 'medium' ? 35 : 
                              chassis.weight_class === 'heavy' ? 50 : 65; // m²
        
        const armorWeight = armorThickness * 0.001 * approximateArea * 7850; // kg
        return armorWeight;
    }
    
    static calculateOperationalCost(vehicle) {
        let operationalCost = 0;
        
        // Fuel cost (annual estimate)
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
            const engine = (typeof window.getResolvedComponent === 'function')
                ? window.getResolvedComponent('engines', vehicle.engine)
                : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine?.consumption) {
                // Assume 1000 hours operation per year, fuel at $4/gallon ($1.06/liter)
                const fuelCostPerYear = engine.consumption * 1000 * 1.06;
                operationalCost += fuelCostPerYear;
            }
        }
        
        // Crew cost (salaries, training, benefits) - only if a chassis exists
        if (vehicle?.chassis) {
            const crewSize = vehicle?.crewSize || 0;
            const crewCostPerYear = crewSize * 12000; // $12k per crew member per year
            operationalCost += crewCostPerYear;
        }
        
        // Ammunition cost (rough estimate) - only with chassis selected
        if (vehicle?.chassis && vehicle?.main_gun_caliber) {
            const ammoCost = vehicle.main_gun_caliber * 50; // Rough estimate per year
            operationalCost += ammoCost;
        }
        
        return Math.round(operationalCost);
    }
    
    static calculateTotalOwnershipCost(productionCost, maintenanceCost, operationalCost) {
        // 10-year total ownership cost
        return Math.round(productionCost + (maintenanceCost * 10) + (operationalCost * 10));
    }
    
    static getCostBreakdown(vehicle, productionCost) {
        // FORÇA breakdown básico para garantir que sempre funcione
        const safeProductionCost = isNaN(productionCost) ? 50000 : productionCost;
        
        return {
            chassis: Math.floor(safeProductionCost * 0.25), // 25%
            armor: Math.floor(safeProductionCost * 0.20),   // 20%
            engine_drivetrain: Math.floor(safeProductionCost * 0.25), // 25%
            weapons: Math.floor(safeProductionCost * 0.15), // 15%
            systems: Math.floor(safeProductionCost * 0.10), // 10%
            crew: Math.floor(safeProductionCost * 0.05),    // 5%
            special_equipment: 0,
            other: 0
        };
    }
    
    static calculateSpecialEquipmentCost(vehicle) {
        let equipmentCost = 0;
        const specialEquipment = vehicle?.specialEquipment || vehicle?.special_equipment || [];
        
        if (specialEquipment.length > 0 && window.VEHICLE_COMPONENTS?.special_equipment) {
            specialEquipment.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                if (equipment?.cost && !isNaN(equipment.cost)) {
                    equipmentCost += equipment.cost;
                }
            });
        }
        
        return equipmentCost;
    }
    
    static calculateEngineCost(vehicle) {
        if (!vehicle?.engine || !window.VEHICLE_COMPONENTS?.engines) return 0;
        
        const engine = (typeof window.getResolvedComponent === 'function')
            ? window.getResolvedComponent('engines', vehicle.engine)
            : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
        if (!engine) return 0;
        
        let engineCost = engine.power * 45;
        if ((engine.fuel_type || window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.fuel_type) === 'diesel') engineCost *= 1.3;
        if (engine.experimental || window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.experimental) engineCost *= 2.5;
        
        // Add transmission cost
        if (vehicle?.transmission && window.VEHICLE_COMPONENTS?.transmissions) {
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            if (transmission) {
                engineCost += transmission.cost || 5000;
            }
        }
        
        // Add suspension cost
        if (vehicle?.suspension && window.VEHICLE_COMPONENTS?.suspensions) {
            const suspension = window.VEHICLE_COMPONENTS.suspensions[vehicle.suspension];
            if (suspension) {
                engineCost += suspension.cost || 2500;
            }
        }
        
        return Math.round(engineCost);
    }
    
    static calculateCostEfficiency(vehicle, productionCost) {
        const weight = window.PerformanceSystem ? 
            window.PerformanceSystem.calculateTotalWeight(vehicle) : 30000;
        const performance = window.PerformanceSystem ? 
            window.PerformanceSystem.calculatePerformanceMetrics(vehicle) : { combat_effectiveness: 50 };
        
        return {
            cost_per_ton: Math.round(productionCost / (weight / 1000)),
            cost_per_performance_point: Math.round(productionCost / Math.max(1, performance.combat_effectiveness)),
            bang_for_buck: Math.round((performance.combat_effectiveness * 1000) / productionCost)
        };
    }
    
    static getDefaultCosts() {
        return {
            production: 0,
            maintenance: 0,
            operational: 0,
            total_ownership: 0,
            breakdown: {
                chassis: 0,
                armor: 0,
                engine_drivetrain: 0,
                weapons: 0,
                systems: 0,
                other: 0
            },
            efficiency_metrics: {
                cost_per_ton: 0,
                cost_per_performance_point: 0,
                bang_for_buck: 0
            }
        };
    }
    
    static renderCostDisplay(vehicle) {
        // FORÇA uma verificação direta do currentVehicle global
        const actualVehicle = window.currentVehicle || vehicle || {};
        
        // Debug completo
        console.log('🔍 ULTIMATE DEBUG:', {
            passedVehicle: vehicle,
            windowCurrentVehicle: window.currentVehicle,
            actualVehicle: actualVehicle,
            allKeys: Object.keys(actualVehicle || {})
        });
        
        // Se o vehicle passado está vazio, use o global
        const vehicleToUse = Object.keys(actualVehicle).length > Object.keys(vehicle || {}).length ? 
            actualVehicle : vehicle;
        
        console.log('🎯 Using vehicle:', vehicleToUse);
        
        const costs = this.calculateCosts(vehicleToUse);
        const quantity = vehicle?.quantity || 1;
        
        let html = '<h3 class="text-xl font-semibold text-slate-100 mb-4">💰 Análise de Custos</h3>';
        
        // Cost per Unit Summary
        html += '<div class="grid grid-cols-2 gap-4 mb-6">';
        html += '<div class="p-4 rounded-lg bg-green-900/20 border border-green-500/30">';
        html += '<div class="text-green-300 text-sm font-medium">Custo por Unidade</div>';
        const safeProductionCost = isNaN(costs.production) ? 0 : costs.production;
        html += `<div class="text-green-100 text-xl font-bold">$${(safeProductionCost / 1000).toFixed(0)}K</div>`;
        html += '</div>';
        html += '<div class="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">';
        html += '<div class="text-yellow-300 text-sm font-medium">Manutenção por Unidade/Ano</div>';
        const safeMaintenanceCost = isNaN(costs.maintenance) ? 0 : costs.maintenance;
        html += `<div class="text-yellow-100 text-xl font-bold">$${(safeMaintenanceCost / 1000).toFixed(0)}K</div>`;
        html += '</div>';
        html += '</div>';
        
        // Total Project Cost (if quantity > 1)
        if (quantity > 1) {
            html += '<div class="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 mb-4">';
            html += '<div class="flex items-center justify-between">';
            html += `<span class="text-blue-300 font-medium">Custo Total do Projeto (${quantity} unidades)</span>`;
            html += `<span class="text-blue-100 font-bold text-lg">$${((costs.production * quantity) / 1000000).toFixed(1)}M</span>`;
            html += '</div>';
            html += '</div>';
        }
        
        // Production Cost Breakdown
        html += '<div class="mb-6">';
        html += '<h4 class="text-slate-200 font-medium mb-3">📊 Breakdown de Custos (por unidade)</h4>';
        html += '<div class="space-y-2">';
        
        const sortedBreakdown = Object.entries(costs.breakdown).sort((a, b) => b[1] - a[1]);
        sortedBreakdown.forEach(([component, cost]) => {
            if (cost && cost > 0 && !isNaN(cost)) {
                const safePercentage = costs.production > 0 ? ((cost / costs.production) * 100).toFixed(1) : '0.0';
                const safeCostDisplay = (cost / 1000).toFixed(0);
                
                html += '<div class="flex items-center justify-between p-2 rounded bg-slate-800/30">';
                html += `<span class="text-slate-200">${this.formatComponentName(component)}</span>`;
                html += '<div class="flex items-center gap-3">';
                html += `<span class="text-slate-400 text-sm">${safePercentage}%</span>`;
                html += `<span class="text-slate-100 font-semibold">$${safeCostDisplay}K</span>`;
                html += '</div>';
                html += '</div>';
                
                // Progress bar
                html += `<div class="h-1 bg-slate-700 rounded-full overflow-hidden ml-2 mb-2">`;
                html += `<div class="h-full bg-brand-500 transition-all duration-300" style="width: ${safePercentage}%"></div>`;
                html += `</div>`;
            }
        });
        html += '</div>';
        html += '</div>';
        
        // Maintenance Cost Details
        html += '<div class="mb-6">';
        html += '<h4 class="text-slate-200 font-medium mb-3">🔧 Detalhes de Manutenção (por unidade/ano)</h4>';
        html += this.renderMaintenanceBreakdown(vehicle, costs.maintenance);
        html += '</div>';
        
        // Operating Costs
        html += '<div class="grid grid-cols-3 gap-3 mb-6">';
        html += '<div class="p-3 rounded bg-slate-800/40">';
        html += '<div class="text-xs text-slate-400">Combustível/Ano</div>';
        const safeFuelCost = isNaN(costs.operational) ? 0 : (costs.operational * 0.4);
        html += `<div class="text-orange-400 font-semibold">$${(safeFuelCost / 1000).toFixed(0)}K</div>`;
        html += '</div>';
        html += '<div class="p-3 rounded bg-slate-800/40">';
        html += '<div class="text-xs text-slate-400">Tripulação/Ano</div>';
        const safeCrewCost = isNaN(costs.operational) ? 0 : (costs.operational * 0.6);
        html += `<div class="text-blue-400 font-semibold">$${(safeCrewCost / 1000).toFixed(0)}K</div>`;
        html += '</div>';
        html += '<div class="p-3 rounded bg-slate-800/40">';
        html += '<div class="text-xs text-slate-400">Total Operação</div>';
        const safeOperationalCost = isNaN(costs.operational) ? 0 : costs.operational;
        html += `<div class="text-purple-400 font-semibold">$${(safeOperationalCost / 1000).toFixed(0)}K</div>`;
        html += '</div>';
        html += '</div>';
        
        // Total Ownership Cost
        html += '<div class="p-4 rounded-lg bg-red-900/20 border border-red-500/30 mb-6">';
        html += '<div class="flex items-center justify-between mb-2">';
        html += '<span class="text-red-300 font-medium">Custo Total de Propriedade (10 anos por unidade)</span>';
        const safeTotalOwnership = isNaN(costs.total_ownership) ? 0 : costs.total_ownership;
        html += `<span class="text-red-100 font-bold text-lg">$${(safeTotalOwnership / 1000).toFixed(0)}K</span>`;
        html += '</div>';
        html += '<div class="text-xs text-red-300/70">';
        const safeProductionForDetail = isNaN(costs.production) ? 0 : costs.production;
        const safeMaintenanceForDetail = isNaN(costs.maintenance) ? 0 : costs.maintenance;
        const safeOperationalForDetail = isNaN(costs.operational) ? 0 : costs.operational;
        html += `Inclui: Compra ($${(safeProductionForDetail/1000).toFixed(0)}K) + Manutenção 10 anos ($${(safeMaintenanceForDetail*10/1000).toFixed(0)}K) + Operação 10 anos ($${(safeOperationalForDetail*10/1000).toFixed(0)}K)`;
        html += '</div>';
        html += '</div>';
        
        // Efficiency Metrics
        html += '<div class="pt-4 border-t border-slate-700/50">';
        html += '<h4 class="text-slate-200 font-medium mb-3">📈 Métricas de Eficiência</h4>';
        html += '<div class="grid grid-cols-1 gap-3">';
        
        html += '<div class="flex justify-between items-center p-2 rounded bg-slate-800/30">';
        html += '<span class="text-slate-400">Custo por Tonelada</span>';
        const safeCostPerTon = isNaN(costs.efficiency_metrics.cost_per_ton) ? 0 : costs.efficiency_metrics.cost_per_ton;
        html += `<span class="text-slate-100 font-semibold">$${safeCostPerTon.toLocaleString()}</span>`;
        html += '</div>';
        
        html += '<div class="flex justify-between items-center p-2 rounded bg-slate-800/30">';
        html += '<span class="text-slate-400">Custo-benefício</span>';
        const safeBangForBuck = isNaN(costs.efficiency_metrics.bang_for_buck) ? 0 : costs.efficiency_metrics.bang_for_buck;
        html += `<span class="text-slate-100 font-semibold">${safeBangForBuck} pts/$1K</span>`;
        html += '</div>';
        
        html += '<div class="flex justify-between items-center p-2 rounded bg-slate-800/30">';
        html += '<span class="text-slate-400">Custo/Performance</span>';
        const safeCostPerPerformance = isNaN(costs.efficiency_metrics.cost_per_performance_point) ? 0 : costs.efficiency_metrics.cost_per_performance_point;
        html += `<span class="text-slate-100 font-semibold">$${safeCostPerPerformance.toLocaleString()}</span>`;
        html += '</div>';
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    static renderMaintenanceBreakdown(vehicle, totalMaintenance) {
        let html = '<div class="space-y-2 text-sm">';
        const safeTotalMaintenance = isNaN(totalMaintenance) || totalMaintenance <= 0 ? 1 : totalMaintenance; // Avoid division by zero
        
        // Engine maintenance
        if (vehicle?.engine && window.VEHICLE_COMPONENTS?.engines) {
        const engine = (typeof window.getResolvedComponent === 'function')
            ? window.getResolvedComponent('engines', vehicle.engine)
            : (window.VEHICLE_COMPONENTS.engines[vehicle.engine]?.base || window.VEHICLE_COMPONENTS.engines[vehicle.engine]);
            if (engine) {
                const engineCost = (engine.maintenance_hours || 2.0) * this.getEngineMaintenanceCostPerHour(engine) * 12;
                const safeEngineCost = isNaN(engineCost) ? 0 : engineCost;
                const percentage = ((safeEngineCost / safeTotalMaintenance) * 100).toFixed(1);
                
                html += '<div class="flex justify-between text-slate-400">';
                html += `<span>🔧 Motor (${engine.fuel_type})</span>`;
                html += `<span>$${(safeEngineCost/1000).toFixed(1)}K (${percentage}%)</span>`;
                html += '</div>';
            }
        }
        
        // Transmission maintenance
        if (vehicle?.transmission && window.VEHICLE_COMPONENTS?.transmissions) {
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            if (transmission) {
                let transmissionCost = (transmission.cost || 5000) * (transmission.maintenance_complexity || 0.2);
                if (transmission.type === 'automatic') transmissionCost *= 2.1;
                else if (transmission.type === 'manual') transmissionCost *= 1.0;
                
                const safeTransmissionCost = isNaN(transmissionCost) ? 0 : transmissionCost;
                const percentage = ((safeTransmissionCost / safeTotalMaintenance) * 100).toFixed(1);
                
                html += '<div class="flex justify-between text-slate-400">';
                html += `<span>⚙️ Transmissão (${transmission.type})</span>`;
                html += `<span>$${(safeTransmissionCost/1000).toFixed(1)}K (${percentage}%)</span>`;
                html += '</div>';
            }
        }
        
        // Weapons maintenance (only if a chassis is selected)
        if (vehicle?.chassis && vehicle?.main_gun_caliber && !isNaN(vehicle.main_gun_caliber)) {
            const weaponCost = vehicle.main_gun_caliber * 15;
            const safeWeaponCost = isNaN(weaponCost) ? 0 : weaponCost;
            const percentage = ((safeWeaponCost / safeTotalMaintenance) * 100).toFixed(1);
            
            html += '<div class="flex justify-between text-slate-400">';
            html += `<span>🔫 Canhão Principal (${vehicle.main_gun_caliber}mm)</span>`;
            html += `<span>$${(safeWeaponCost/1000).toFixed(1)}K (${percentage}%)</span>`;
            html += '</div>';
        }
        
        // Systems maintenance
        if (vehicle?.fcs && window.VEHICLE_COMPONENTS?.fire_control) {
            const fcs = window.VEHICLE_COMPONENTS.fire_control[vehicle.fcs];
            if (fcs) {
                let systemCost = (fcs.cost || 5000) * 0.4;
                if (fcs.type === 'electronic') systemCost *= 4.2;
                else if (fcs.type === 'radar') systemCost *= 2.5;
                
                const safeSystemCost = isNaN(systemCost) ? 0 : systemCost;
                const percentage = ((safeSystemCost / safeTotalMaintenance) * 100).toFixed(1);
                
                html += '<div class="flex justify-between text-slate-400">';
                html += `<span>🎯 Fire Control (${fcs.type})</span>`;
                html += `<span>$${(safeSystemCost/1000).toFixed(1)}K (${percentage}%)</span>`;
                html += '</div>';
            }
        }
        
        html += '</div>';
        return html;
    }
    
    static getEngineMaintenanceCostPerHour(engine) {
        let costPerHour = 25;
        if (engine.fuel_type === 'diesel') costPerHour = 20;
        else if (engine.fuel_type === 'kerosene') costPerHour = 45;
        else if (engine.fuel_type === 'gasoline') costPerHour = 22;
        
        if (engine.experimental) costPerHour *= 3.5;
        if (engine.supercharged) costPerHour *= 1.8;
        if (engine.reliability) costPerHour *= (1.5 - (engine.reliability * 0.5));
        
        return costPerHour;
    }
    
    static formatComponentName(component) {
        const names = {
            chassis: 'Chassi',
            armor: 'Blindagem',
            engine_drivetrain: 'Motor/Tração',
            weapons: 'Armamentos',
            systems: 'Sistemas',
            crew: 'Tripulação',
            special_equipment: 'Equip. Especiais',
            other: 'Outros'
        };
        return names[component] || component;
    }
    
    static syncVehicleWithUI(vehicle) {
        if (!vehicle) return;
        
        console.log('🔄 Syncing vehicle with UI selections...');
        
        // Try to detect selected secondary weapons from UI
        const selectedWeaponCards = document.querySelectorAll('[onclick*="selectSecondaryWeapon"].selected, [onclick*="selectSecondaryWeapon"][class*="brand-"], [onclick*="selectSecondaryWeapon"][class*="selected"]');
        if (selectedWeaponCards.length > 0) {
            const weaponIds = [];
            selectedWeaponCards.forEach(card => {
                const onclick = card.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/selectSecondaryWeapon\(['"]([^'"]+)['"]\)/);
                    if (match && match[1]) {
                        weaponIds.push(match[1]);
                        console.log(`🔄 UI Sync: Found selected secondary weapon: ${match[1]}`);
                    }
                }
            });
            
            if (weaponIds.length > 0) {
                if (!vehicle.secondary_weapons || vehicle.secondary_weapons.length === 0) {
                    vehicle.secondary_weapons = weaponIds;
                    console.log(`🔄 UI Sync: Updated vehicle.secondary_weapons:`, weaponIds);
                }
            }
        }
        
        // Try to detect selected systems
        const selectedSystemCards = document.querySelectorAll('[onclick*="select"][class*="brand-"], [onclick*="select"][class*="selected"]');
        selectedSystemCards.forEach(card => {
            const onclick = card.getAttribute('onclick');
            if (onclick) {
                if (onclick.includes('selectFireControl')) {
                    const match = onclick.match(/selectFireControl\(['"]([^'"]+)['"]\)/);
                    if (match && match[1] && !vehicle.fcs) {
                        vehicle.fcs = match[1];
                        console.log(`🔄 UI Sync: Found fire control: ${match[1]}`);
                    }
                } else if (onclick.includes('selectOptics')) {
                    const match = onclick.match(/selectOptics\(['"]([^'"]+)['"]\)/);
                    if (match && match[1] && !vehicle.optics) {
                        vehicle.optics = match[1];
                        console.log(`🔄 UI Sync: Found optics: ${match[1]}`);
                    }
                } else if (onclick.includes('selectCommunication')) {
                    const match = onclick.match(/selectCommunication\(['"]([^'"]+)['"]\)/);
                    if (match && match[1] && !vehicle.communication) {
                        vehicle.communication = match[1];
                        console.log(`🔄 UI Sync: Found communication: ${match[1]}`);
                    }
                }
            }
        });
    }
}

// Export for global use
window.CostSystem = CostSystem;
