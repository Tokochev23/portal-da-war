// js/utils/navalCostSystem.js - Naval Cost Calculation System for 1954

class NavalCostSystem {
    // Hull-based scaling multipliers for equipment
    static getHullMultipliers() {
        return {
            // Size-based multipliers
            corvette: {
                electronics: 0.4,   // Smaller, simpler electronics
                armor: 0.6,         // Less armor needed
                weapons: 0.7,       // Smaller mountings
                cost: 0.5,          // Much cheaper to install
                weight: 0.3         // Lighter variants
            },
            destroyer: {
                electronics: 0.7,
                armor: 0.8,
                weapons: 0.8,
                cost: 0.8,
                weight: 0.6
            },
            frigate: {
                electronics: 0.6,
                armor: 0.7,
                weapons: 0.75,
                cost: 0.7,
                weight: 0.5
            },
            escort: {
                electronics: 0.5,
                armor: 0.6,
                weapons: 0.7,
                cost: 0.6,
                weight: 0.4
            },
            cruiser: {
                electronics: 1.0,   // Base multiplier
                armor: 1.0,
                weapons: 1.0,
                cost: 1.0,
                weight: 1.0
            },
            battleship: {
                electronics: 1.8,   // Larger, more capable systems
                armor: 2.2,         // Much thicker armor
                weapons: 2.5,       // Massive mountings
                cost: 2.0,          // More expensive to install
                weight: 2.8         // Much heavier
            },
            carrier: {
                electronics: 1.5,
                armor: 1.2,
                weapons: 0.9,       // Less weapons, more aircraft
                cost: 1.3,
                weight: 1.1
            },
            submarine: {
                electronics: 0.8,
                armor: 0.3,         // Minimal armor
                weapons: 0.6,       // Torpedo tubes mainly
                cost: 0.9,
                weight: 0.4
            }
        };
    }

    static getHullRole(hull) {
        if (!hull) return 'cruiser'; // Default
        return hull.role || 'cruiser';
    }

    static applyHullScaling(baseValue, valueType, hull) {
        const multipliers = this.getHullMultipliers();
        const role = this.getHullRole(hull);
        const roleMultipliers = multipliers[role] || multipliers.cruiser;
        
        const multiplier = roleMultipliers[valueType] || 1.0;
        return Math.round(baseValue * multiplier);
    }
    static getSelectedHull(ship) {
        const id = ship?.hull;
        return id && window.NAVAL_COMPONENTS?.hulls?.[id] ? window.NAVAL_COMPONENTS.hulls[id] : null;
    }

    static getSelectedPropulsion(ship) {
        const id = ship?.propulsion;
        return id && window.NAVAL_COMPONENTS?.propulsion_systems?.[id] ? window.NAVAL_COMPONENTS.propulsion_systems[id] : null;
    }

    static getSelectedMainGuns(ship) {
        const guns = Array.isArray(ship?.main_guns) ? ship.main_guns : [];
        const allGuns = window.NAVAL_COMPONENTS?.naval_guns || {};
        return guns.map(gunMount => {
            const gun = allGuns[gunMount.type];
            if (gun) {
                return { ...gun, mount: gunMount.mount, quantity: gunMount.quantity || 1 };
            }
            return null;
        }).filter(Boolean);
    }

    static calculateCosts(ship) {
        const hull = this.getSelectedHull(ship);
        const propulsion = this.getSelectedPropulsion(ship);

        if (!hull) {
            return this.getDefaultCosts();
        }

        try {
            const breakdown = this.calculateCostBreakdown(ship, hull, propulsion);
            let productionCost = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
            const maintenanceCost = this.calculateMaintenanceCost(ship, hull, propulsion);
            const operationalCost = this.calculateOperationalCost(ship, hull, propulsion);

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

            const totalOwnershipCost = productionCost + (maintenanceCost * 10) + (operationalCost * 10); // 10-year lifecycle

            return {
                production: productionCost,
                maintenance: maintenanceCost,
                operational: operationalCost,
                total_ownership: totalOwnershipCost,
                breakdown: breakdown,
                efficiency_metrics: this.calculateCostEfficiency(ship, productionCost)
            };
        } catch (error) {
            console.error('🚨 Error in naval cost calculation:', error);
            return this.getDefaultCosts();
        }
    }

    static calculateCostBreakdown(ship, hull, propulsion) {
        // Hull base cost with complexity multipliers
        let hullCost = hull.cost_base || 0;
        
        // Technology multipliers
        if (hull.tech_level > 60) hullCost *= 1.3;
        else if (hull.tech_level > 50) hullCost *= 1.15;
        
        // Role-specific multipliers
        if (hull.role === 'battleship') hullCost *= 1.2; // Complex construction
        else if (hull.role === 'carrier') hullCost *= 1.4; // Very complex
        else if (hull.role === 'submarine') hullCost *= 1.1; // Specialized construction

        // Propulsion costs
        let propulsionCost = 0;
        if (propulsion) {
            propulsionCost = propulsion.cost || 0;
            
            // Nuclear propulsion needs extensive shielding and safety systems
            if (propulsion.type === 'nuclear') {
                propulsionCost *= 1.8; // Massive infrastructure costs
            }
            
            // Complex systems cost more to integrate
            if (propulsion.type === 'combined') {
                propulsionCost *= 1.3;
            }
        }

        // Armament costs with hull-based scaling
        const mainGuns = this.getSelectedMainGuns(ship);
        let armamentCost = 0;
        mainGuns.forEach(gun => {
            let gunCost = gun.cost || 0;
            
            // Apply hull scaling for weapons
            gunCost = this.applyHullScaling(gunCost, 'weapons', hull);
            
            // Mount complexity affects cost
            const mountMultipliers = {
                'single_mount': 1.0,
                'twin_mount': 1.8,
                'triple_mount': 2.4,
                'quad_mount': 2.8
            };
            
            const mountMultiplier = mountMultipliers[gun.mount] || 1.0;
            gunCost *= mountMultiplier;
            
            // Fire control systems
            if (gun.caliber >= 203) { // 8" and above need sophisticated FC
                gunCost *= 1.4;
            } else if (gun.caliber >= 127) { // 5" and above
                gunCost *= 1.2;
            }
            
            armamentCost += gunCost * gun.quantity;
        });

        // Secondary weapons and AA systems
        let secondaryCost = 0;
        if (ship.secondary_weapons && Array.isArray(ship.secondary_weapons)) {
            secondaryCost = ship.secondary_weapons.length * 280000; // Average secondary weapon cost
            
            // AA effectiveness bonus cost
            if (hull.aa_slots > 20) {
                secondaryCost *= 1.5; // Heavy AA ships need more complex systems
            }
        }

        // Missile systems (1954 era)
        let missileCost = 0;
        if (ship.missiles && Array.isArray(ship.missiles)) {
            ship.missiles.forEach(missileMount => {
                if (missileMount.type && window.NAVAL_COMPONENTS?.naval_missiles[missileMount.type]) {
                    const missile = window.NAVAL_COMPONENTS.naval_missiles[missileMount.type];
                    let systemCost = missile.cost_per_launcher || 0;
                    const missilesIncluded = missile.missiles_per_launcher || 0;
                    const missileUnitCost = missile.cost_per_missile || 0;
                    
                    // Full system cost includes launcher + initial missiles
                    systemCost += (missilesIncluded * missileUnitCost);
                    
                    // Technology penalty for early missile systems
                    if (missile.tech_level >= 65) {
                        systemCost *= 1.8; // Very experimental technology
                    } else if (missile.tech_level >= 55) {
                        systemCost *= 1.4; // Advanced technology
                    }
                    
                    missileCost += systemCost * (missileMount.quantity || 1);
                }
            });
        }

        // Secondary armament systems (AA, torpedo, ASW, etc.)
        let secondarySystemsCost = 0;

        // AA Guns with hull scaling
        if (ship.aa_guns && Array.isArray(ship.aa_guns)) {
            ship.aa_guns.forEach(aaMount => {
                if (aaMount.type && window.NAVAL_COMPONENTS?.aa_guns[aaMount.type]) {
                    const gun = window.NAVAL_COMPONENTS.aa_guns[aaMount.type];
                    let gunCost = gun.cost || 0;
                    
                    // Apply hull scaling
                    gunCost = this.applyHullScaling(gunCost, 'weapons', hull);
                    
                    // Advanced AA systems cost more
                    if (gun.type === 'automatic_aa') {
                        gunCost *= 1.5;
                    }
                    
                    secondarySystemsCost += gunCost * (aaMount.quantity || 1);
                }
            });
        }

        // Torpedo Tubes
        if (ship.torpedo_tubes && Array.isArray(ship.torpedo_tubes)) {
            ship.torpedo_tubes.forEach(torpedoMount => {
                if (torpedoMount.type && window.NAVAL_COMPONENTS?.torpedo_tubes[torpedoMount.type]) {
                    const torpedo = window.NAVAL_COMPONENTS.torpedo_tubes[torpedoMount.type];
                    let torpedoCost = torpedo.cost || 0;
                    
                    // Guided torpedos cost significantly more
                    if (torpedo.type === 'acoustic_torpedo') {
                        torpedoCost *= 2.0;
                    }
                    
                    secondarySystemsCost += torpedoCost * (torpedoMount.quantity || 1);
                }
            });
        }

        // ASW Systems (Depth Charges)
        if (ship.depth_charges && Array.isArray(ship.depth_charges)) {
            ship.depth_charges.forEach(aswMount => {
                if (aswMount.type && window.NAVAL_COMPONENTS?.depth_charges[aswMount.type]) {
                    const asw = window.NAVAL_COMPONENTS.depth_charges[aswMount.type];
                    let aswCost = asw.cost || 0;
                    
                    // Advanced systems like Squid cost more
                    if (asw.sonar_integrated) {
                        aswCost *= 1.4;
                    }
                    
                    secondarySystemsCost += aswCost * (aswMount.quantity || 1);
                }
            });
        }

        // Countermeasures
        if (ship.countermeasures && Array.isArray(ship.countermeasures)) {
            ship.countermeasures.forEach(cmMount => {
                if (cmMount.type && window.NAVAL_COMPONENTS?.countermeasures[cmMount.type]) {
                    const cm = window.NAVAL_COMPONENTS.countermeasures[cmMount.type];
                    secondarySystemsCost += (cm.cost || 0) * (cmMount.quantity || 1);
                }
            });
        }

        // Searchlights
        if (ship.searchlights && Array.isArray(ship.searchlights)) {
            ship.searchlights.forEach(lightMount => {
                if (lightMount.type && window.NAVAL_COMPONENTS?.searchlights[lightMount.type]) {
                    const light = window.NAVAL_COMPONENTS.searchlights[lightMount.type];
                    secondarySystemsCost += (light.cost || 0) * (lightMount.quantity || 1);
                }
            });
        }

        // Electronics and sensors with hull scaling
        let electronicsCost = 0;
        if (ship.electronics && Array.isArray(ship.electronics)) {
            ship.electronics.forEach(electronicsMount => {
                if (electronicsMount.category && electronicsMount.type && window.NAVAL_COMPONENTS?.[electronicsMount.category]?.[electronicsMount.type]) {
                    const electronics = window.NAVAL_COMPONENTS[electronicsMount.category][electronicsMount.type];
                    let systemCost = electronics.cost || 0;
                    
                    // Apply hull scaling for electronics
                    systemCost = this.applyHullScaling(systemCost, 'electronics', hull);
                    
                    // Technology level cost multipliers
                    if (electronics.tech_level >= 65) {
                        systemCost *= 1.8; // Very advanced systems
                    } else if (electronics.tech_level >= 55) {
                        systemCost *= 1.4; // Advanced systems
                    }
                    
                    // Category-specific multipliers
                    if (electronicsMount.category === 'electronic_warfare') {
                        systemCost *= 1.5; // EW systems are expensive
                    } else if (electronicsMount.category === 'data_processing') {
                        systemCost *= 1.3; // CIC systems require integration
                    }
                    
                    electronicsCost += systemCost * (electronicsMount.quantity || 1);
                }
            });
        }

        // Armor systems - calculate actual costs based on configuration
        let armorCost = 0;
        if (ship.armor && window.NAVAL_COMPONENTS?.armor_zones) {
            const hullRole = hull.role || 'destroyer';
            
            Object.entries(ship.armor.custom_zones || {}).forEach(([zoneId, materialId]) => {
                const zone = window.NAVAL_COMPONENTS.armor_zones[zoneId];
                const material = window.NAVAL_COMPONENTS.armor_materials[materialId];
                
                if (zone && material) {
                    const area = zone.area_sqm_base[hullRole] || zone.area_sqm_base.destroyer;
                    let zoneCost = material.cost_per_sqm * area;
                    
                    // Apply hull scaling for armor
                    zoneCost = this.applyHullScaling(zoneCost, 'armor', hull);
                    
                    // Technology level multipliers for advanced materials
                    if (material.tech_level >= 60) {
                        zoneCost *= 2.0; // Experimental materials very expensive
                    } else if (material.tech_level >= 45) {
                        zoneCost *= 1.5; // Advanced materials expensive
                    }
                    
                    // Zone importance multipliers
                    if (zone.importance === 'critical') {
                        zoneCost *= 1.2; // Critical zones need more precise manufacturing
                    }
                    
                    armorCost += zoneCost;
                }
            });
        } else {
            // Fallback to old estimation if armor system not configured
            if (hull.role === 'battleship') {
                armorCost = hullCost * 0.35;
            } else if (hull.role === 'cruiser') {
                armorCost = hullCost * 0.25;
            } else if (hull.role === 'carrier') {
                armorCost = hullCost * 0.15;
            } else if (hull.role === 'destroyer') {
                armorCost = hullCost * 0.08;
            }
        }

        // Integration and shipyard costs (labor, testing, trials)
        const subtotal = hullCost + propulsionCost + armamentCost + secondaryCost + missileCost + secondarySystemsCost + electronicsCost + armorCost;
        const integrationCost = subtotal * 0.18; // 18% for integration

        return {
            hull: Math.round(hullCost),
            propulsion: Math.round(propulsionCost),
            armament: Math.round(armamentCost),
            secondary: Math.round(secondaryCost),
            missiles: Math.round(missileCost),
            secondary_systems: Math.round(secondarySystemsCost),
            electronics: Math.round(electronicsCost),
            armor: Math.round(armorCost),
            integration: Math.round(integrationCost)
        };
    }

    static calculateMaintenanceCost(ship, hull, propulsion) {
        let maintenanceCost = 0;
        
        // Base hull maintenance (% of hull cost annually)
        const hullMaintenanceRate = {
            'destroyer': 0.04,
            'frigate': 0.035,
            'cruiser': 0.05,
            'battleship': 0.06,
            'carrier': 0.08, // Complex flight operations
            'submarine': 0.07 // Pressure hull maintenance critical
        };
        
        const rate = hullMaintenanceRate[hull.role] || 0.045;
        maintenanceCost += (hull.cost_base || 0) * rate;
        
        // Propulsion maintenance
        if (propulsion) {
            let propMaintenanceCost = (propulsion.cost || 0) * 0.08; // 8% annually
            
            // Reliability affects maintenance cost
            const reliabilityFactor = 2.0 - (propulsion.reliability || 0.9);
            propMaintenanceCost *= reliabilityFactor;
            
            // Nuclear requires specialized maintenance
            if (propulsion.type === 'nuclear') {
                propMaintenanceCost *= 2.5; // Very expensive to maintain
            }
            
            maintenanceCost += propMaintenanceCost;
        }
        
        // Crew size affects maintenance (more systems to maintain)
        const crewSize = hull.crew || 100;
        maintenanceCost += crewSize * 800; // $800 per crew member for maintenance overhead
        
        // Technology level affects maintenance
        if (hull.tech_level > 60) {
            maintenanceCost *= 1.3; // Modern systems complex to maintain
        } else if (hull.tech_level < 40) {
            maintenanceCost *= 1.1; // Old systems need more frequent maintenance
        }
        
        return Math.round(maintenanceCost);
    }

    static calculateOperationalCost(ship, hull, propulsion) {
        let operationalCost = 0;
        
        // Fuel costs
        if (propulsion && propulsion.type !== 'nuclear') {
            const annualOperatingHours = 2000; // Hours at sea per year
            const fuelConsumption = propulsion.fuel_consumption || 200; // gallons per hour
            const fuelPricePerGallon = 0.25; // 1954 fuel prices
            const fuelCost = annualOperatingHours * fuelConsumption * fuelPricePerGallon;
            operationalCost += fuelCost;
        } else if (propulsion && propulsion.type === 'nuclear') {
            // Nuclear fuel costs much less but requires special handling
            operationalCost += 150000; // Annual nuclear fuel and handling
        }
        
        // Crew costs (salaries, food, accommodation)
        const crewSize = hull.crew || 100;
        const avgSalaryPerCrewMember = 3600; // Annual salary in 1954
        const crewOverheadMultiplier = 1.8; // Benefits, food, etc.
        operationalCost += crewSize * avgSalaryPerCrewMember * crewOverheadMultiplier;
        
        // Ammunition and training costs
        const mainGuns = this.getSelectedMainGuns(ship);
        let ammunitionCost = 0;
        mainGuns.forEach(gun => {
            // Training rounds per gun per year
            const roundsPerYear = gun.caliber >= 356 ? 50 : gun.caliber >= 203 ? 150 : 300;
            const costPerRound = gun.caliber >= 356 ? 2500 : gun.caliber >= 203 ? 800 : 450;
            ammunitionCost += roundsPerYear * costPerRound * gun.quantity;
        });
        operationalCost += ammunitionCost;
        
        // Port fees, supplies, and miscellaneous
        operationalCost += (hull.displacement || 1000) * 15; // $15 per ton displacement annually
        
        return Math.round(operationalCost);
    }

    static calculateCostEfficiency(ship, productionCost) {
        let performance = {};
        try {
            performance = window.navalPerformanceCalculator.calculateShipPerformance(ship);
        } catch (e) {
            console.error('Naval cost system failed to get performance data:', e);
            performance = { error: true };
        }
        
        if (!performance || performance.error) {
            return { cost_per_ton: 0, bang_for_buck: 0 };
        }

        const totalDisplacement = performance.totalDisplacement || 1;
        
        // Performance score based on naval capabilities
        const performanceScore = (performance.maxSpeed || 0) * 2 + 
                               (performance.mainArmament || 0) * 10 + 
                               (performance.aaRating || 0) * 0.5 + 
                               (performance.range || 0) / 100 +
                               (performance.seaworthiness || 0) * 0.8;
        
        return {
            cost_per_ton: Math.round(productionCost / totalDisplacement),
            bang_for_buck: totalDisplacement > 0 ? Math.round((performanceScore * 1000) / (productionCost / 1000000)) : 0
        };
    }

    static getDefaultCosts() {
        return {
            production: 0, 
            maintenance: 0, 
            operational: 0, 
            total_ownership: 0,
            breakdown: {},
            efficiency_metrics: { cost_per_ton: 0, bang_for_buck: 0 }
        };
    }

    static renderCostDisplay(ship) {
        const costs = this.calculateCosts(ship || window.currentShip || {});
        const quantity = Number(ship?.quantity || (window.currentShip?.quantity) || 1) || 1;

        const formatM = (value) => isNaN(value) ? '0' : (value / 1000000).toFixed(1);
        const formatK = (value) => isNaN(value) ? '0' : (value / 1000).toFixed(0);

        let html = '<h3 class="text-xl font-semibold text-slate-100 mb-4">💰 Análise de Custos Naval</h3>';

        html += `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                    <div class="text-blue-300 text-sm font-medium">Custo de Produção</div>
                    <div class="text-blue-100 text-2xl font-bold">$${formatM(costs.production)}M</div>
                </div>
                <div class="p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/30">
                    <div class="text-cyan-300 text-sm font-medium">Manutenção Anual</div>
                    <div class="text-cyan-100 text-2xl font-bold">$${formatK(costs.maintenance)}K</div>
                </div>
                <div class="p-4 rounded-lg bg-teal-900/20 border border-teal-500/30">
                    <div class="text-teal-300 text-sm font-medium">Custo Operacional Anual</div>
                    <div class="text-teal-100 text-2xl font-bold">$${formatK(costs.operational)}K</div>
                </div>
            </div>
        `;

        html += `
            <div class="p-4 rounded-lg bg-naval-900/20 border border-naval-500/30 mb-6">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-naval-300 font-medium">Custo Total de Propriedade (10 anos)</span>
                    <span class="text-naval-100 font-bold text-lg">$${formatM(costs.total_ownership)}M</span>
                </div>
                <div class="text-xs text-naval-300/70">
                    Construção ($${formatM(costs.production)}M) + Manutenção ($${formatM(costs.maintenance * 10)}M) + Operação ($${formatM(costs.operational * 10)}M)
                </div>
            </div>
        `;

        if (quantity > 1) {
            html += `
                <div class="p-4 rounded-lg bg-indigo-900/20 border border-indigo-500/30 mb-4">
                    <div class="flex items-center justify-between">
                        <span class="text-indigo-300 font-medium">Custo Total da Frota (${quantity} navios)</span>
                        <span class="text-indigo-100 font-bold text-lg">$${(costs.production * quantity / 1000000).toFixed(1)}M</span>
                    </div>
                </div>
            `;
        }

        html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">';
        html += '<div><h4 class="text-slate-200 font-medium mb-3">📊 Breakdown de Produção</h4><div class="space-y-2">';
        
        const sortedBreakdown = Object.entries(costs.breakdown).sort((a, b) => b[1] - a[1]);
        sortedBreakdown.forEach(([component, cost]) => {
            if (cost > 0) {
                const percentage = costs.production > 0 ? ((cost / costs.production) * 100).toFixed(1) : '0.0';
                html += `
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-slate-300">${this.formatComponentName(component)}</span>
                            <span class="font-medium text-slate-100">$${formatM(cost)}M (${percentage}%)</span>
                        </div>
                        <div class="h-2 bg-slate-700 rounded-full"><div class="h-2 bg-naval-500 rounded-full" style="width: ${percentage}%"></div></div>
                    </div>
                `;
            }
        });
        html += '</div></div>';

        html += '<div><h4 class="text-slate-200 font-medium mb-3">📈 Métricas de Eficiência</h4><div class="space-y-3">';
        html += `<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Custo por Tonelada</span><span class="text-slate-100 font-semibold">$${(costs.efficiency_metrics.cost_per_ton || 0).toLocaleString()}</span></div>`;
        html += `<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Eficiência Naval</span><span class="text-slate-100 font-semibold">${(costs.efficiency_metrics.bang_for_buck || 0).toLocaleString()} pts/$M</span></div>`;
        html += '</div></div>';

        html += '</div>';

        return html;
    }

    static formatComponentName(component) {
        const names = {
            hull: 'Casco',
            propulsion: 'Propulsão',
            armament: 'Artilharia Principal',
            secondary: 'Armamento Secundário',
            electronics: 'Eletrônicos',
            armor: 'Blindagem',
            integration: 'Integração e Testes'
        };
        return names[component] || component;
    }
}

// Global exposure
window.NavalCostSystem = NavalCostSystem;