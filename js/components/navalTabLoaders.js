// js/components/navalTabLoaders.js - Naval Tab Content Loaders for 1954

class NavalTabLoaders {
    // Helper function to show scaled values based on selected hull
    static getScaledValue(baseValue, valueType, suffix = '') {
        if (!window.currentShip?.hull || !window.NavalCostSystem) {
            return `${baseValue}${suffix}`;
        }
        
        const hull = window.NAVAL_COMPONENTS?.hulls[window.currentShip.hull];
        if (!hull) return `${baseValue}${suffix}`;
        
        const scaledValue = window.NavalCostSystem.applyHullScaling(baseValue, valueType, hull);
        const difference = scaledValue - baseValue;
        
        if (difference === 0) {
            return `${scaledValue}${suffix}`;
        } else if (difference > 0) {
            return `<span class="text-red-300">${scaledValue}${suffix}</span> <span class="text-xs text-red-400">(+${difference}${suffix})</span>`;
        } else {
            return `<span class="text-green-300">${scaledValue}${suffix}</span> <span class="text-xs text-green-400">(${difference}${suffix})</span>`;
        }
    }

    static getScaledCostDisplay(baseCost) {
        return this.getScaledValue(baseCost, 'cost', '');
    }

    static getScaledWeightDisplay(baseWeight) {
        return this.getScaledValue(baseWeight, 'weight', 't');
    }

    // Check if component is compatible with current hull
    static isComponentCompatible(component, currentHull) {
        if (!component.suitable_ships || !currentHull) {
            return true; // No restrictions = compatible with all
        }
        
        // Check direct hull name match
        if (component.suitable_ships.includes(currentHull.id)) {
            return true;
        }
        
        // Check hull role match  
        if (component.suitable_ships.includes(currentHull.role)) {
            return true;
        }
        
        // Check for hull-specific suitable_hulls (for propulsion systems)
        if (component.suitable_hulls) {
            return component.suitable_hulls.includes(currentHull.role) || component.suitable_hulls.includes(currentHull.id);
        }
        
        return false;
    }

    // Filter components based on current hull
    static filterComponentsByHull(components) {
        if (!window.currentShip?.hull) {
            return components; // No hull selected = show all
        }
        
        const currentHull = window.NAVAL_COMPONENTS?.hulls[window.currentShip.hull];
        if (!currentHull) {
            return components;
        }
        
        const filtered = {};
        Object.entries(components).forEach(([id, component]) => {
            if (this.isComponentCompatible(component, currentHull)) {
                filtered[id] = component;
            }
        });
        
        return filtered;
    }
    static loadHullTab() {
        const tabContent = document.getElementById('tab-content');
        if (!tabContent) return;

        let html = `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🚢 Seleção de Casco</h3>
                    <p class="text-slate-400">Escolha o tipo de navio que define as características básicas da embarcação</p>
                </div>
        `;

        if (!window.NAVAL_COMPONENTS?.hulls) {
            html += '<div class="text-center text-red-400">❌ Componentes navais não carregados</div>';
            tabContent.innerHTML = html + '</div>';
            return;
        }

        // Group hulls by role
        const hullsByRole = {};
        Object.entries(window.NAVAL_COMPONENTS.hulls).forEach(([id, hull]) => {
            if (!hullsByRole[hull.role]) {
                hullsByRole[hull.role] = [];
            }
            hullsByRole[hull.role].push({ id, ...hull });
        });

        const roleNames = {
            corvette: 'Corvetas',
            escort: 'Escolta e Patrulha', 
            cruiser: 'Cruzadores',
            battleship: 'Encouraçados',
            carrier: 'Porta-Aviões',
            submarine: 'Submarinos'
        };

        Object.entries(hullsByRole).forEach(([role, hulls]) => {
            html += `
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4 flex items-center space-x-2">
                        <span>${this.getRoleIcon(role)}</span>
                        <span>${roleNames[role] || role}</span>
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            hulls.forEach(hull => {
                const isSelected = window.currentShip?.hull === hull.id;
                const cardClass = isSelected ? 
                    'hull-card selected border-naval-400 ring-1 ring-naval-400/50 bg-naval-900/20' :
                    'hull-card border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50';

                html += `
                    <div class="${cardClass} border rounded-xl p-4 cursor-pointer transition-all duration-200" 
                         onclick="selectHull('${hull.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${hull.name}</h5>
                                <div class="text-xs text-slate-400">${hull.year_introduced} • Tech Level ${hull.tech_level}</div>
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-naval-300 font-semibold">${Math.round(hull.displacement).toLocaleString()}t</div>
                                <div class="text-slate-400">${hull.max_speed} nós</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${hull.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Tripulação: <span class="text-slate-200">${hull.crew}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(hull.cost_base / 1000000)}M</span></div>
                        </div>
                        
                        <div class="grid grid-cols-4 gap-1 text-xs mb-3">
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Princ.</div>
                                <div class="text-slate-100 font-semibold">${hull.main_armament_slots || 0}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Sec.</div>
                                <div class="text-slate-100 font-semibold">${hull.secondary_armament_slots || 0}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">AA</div>
                                <div class="text-slate-100 font-semibold">${hull.aa_slots || 0}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Torp.</div>
                                <div class="text-slate-100 font-semibold">${hull.torpedo_tubes || 0}</div>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${hull.advantages.map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${isSelected ? '<div class="text-center text-naval-300 text-xs font-semibold">✓ SELECIONADO</div>' : ''}
                    </div>
                `;
            });

            html += '</div></div>';
        });

        html += '</div>';
        tabContent.innerHTML = html;
    }

    static loadPropulsionTab() {
        const tabContent = document.getElementById('tab-content');
        if (!tabContent) return;

        let html = `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">⚙️ Sistema de Propulsão</h3>
                    <p class="text-slate-400">Configure o sistema de propulsão que determinará velocidade, autonomia e custos operacionais</p>
                </div>
        `;

        if (!window.NAVAL_COMPONENTS?.propulsion_systems) {
            html += '<div class="text-center text-red-400">❌ Sistemas de propulsão não carregados</div>';
            tabContent.innerHTML = html + '</div>';
            return;
        }

        // Filter and group propulsion by type
        const filteredPropulsion = this.filterComponentsByHull(window.NAVAL_COMPONENTS.propulsion_systems);
        
        // Check if no compatible propulsion systems
        if (Object.keys(filteredPropulsion).length === 0) {
            const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
            html += `<div class="text-center text-amber-400">⚠️ Nenhum sistema de propulsão compatível com ${currentHull?.name || 'casco atual'}</div>`;
            tabContent.innerHTML = html + '</div>';
            return;
        }
        
        const propulsionByType = {};
        Object.entries(filteredPropulsion).forEach(([id, prop]) => {
            if (!propulsionByType[prop.type]) {
                propulsionByType[prop.type] = [];
            }
            propulsionByType[prop.type].push({ id, ...prop });
        });

        const typeNames = {
            steam_turbine: 'Turbinas a Vapor',
            diesel: 'Motores Diesel',
            diesel_electric: 'Diesel-Elétrico',
            nuclear: 'Propulsão Nuclear',
            gas_turbine: 'Turbinas a Gás',
            combined: 'Sistemas Combinados'
        };

        Object.entries(propulsionByType).forEach(([type, systems]) => {
            html += `
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4 flex items-center space-x-2">
                        <span>${this.getPropulsionIcon(type)}</span>
                        <span>${typeNames[type] || type}</span>
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            systems.forEach(system => {
                const isSelected = window.currentShip?.propulsion === system.id;
                const cardClass = isSelected ?
                    'border-naval-400 ring-1 ring-naval-400/50 bg-naval-900/20' :
                    'border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50';

                html += `
                    <div class="${cardClass} border rounded-xl p-4 cursor-pointer transition-all duration-200"
                         onclick="selectPropulsion('${system.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${system.name}</h5>
                                <div class="text-xs text-slate-400">${system.year_introduced} • Tech Level ${system.tech_level}</div>
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${Math.round(system.power_hp / 1000)}k HP</div>
                                <div class="text-slate-400">${Math.round(system.reliability * 100)}% conf.</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${system.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${system.weight}t</span></div>
                            <div class="text-slate-400">Consumo: <span class="text-yellow-300">${system.fuel_consumption} gal/h</span></div>
                            <div class="text-slate-400 col-span-2">Custo: <span class="text-green-300">$${Math.round(system.cost / 1000000)}M</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${system.advantages.map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${system.disadvantages.map(dis => `<span class="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded">${dis}</span>`).join('')}
                        </div>
                        
                        ${isSelected ? '<div class="text-center text-naval-300 text-xs font-semibold">✓ SELECIONADO</div>' : ''}
                    </div>
                `;
            });

            html += '</div></div>';
        });

        html += '</div>';
        tabContent.innerHTML = html;
    }

    static loadArmorTab() {
        const tabContent = document.getElementById('tab-content');
        if (!tabContent) return;

        let html = `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🛡️ Sistema de Blindagem</h3>
                    <p class="text-slate-400">Configure a proteção do navio contra diferentes tipos de ameaças</p>
                </div>
        `;

        if (!window.NAVAL_COMPONENTS?.armor_schemes) {
            html += '<div class="text-center text-red-400">❌ Sistema de blindagem não carregado</div>';
            tabContent.innerHTML = html + '</div>';
            return;
        }

        // Armor Scheme Selection
        html += `
            <div class="bg-slate-800/40 rounded-xl p-6 mb-6">
                <h4 class="text-lg font-semibold text-slate-100 mb-4">📋 Esquema de Blindagem</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        `;

        Object.entries(window.NAVAL_COMPONENTS.armor_schemes).forEach(([schemeId, scheme]) => {
            const currentScheme = window.currentShip?.armor?.scheme || 'unarmored';
            const isSelected = currentScheme === schemeId;
            const cardClass = isSelected ? 
                'border-naval-400 ring-1 ring-naval-400/50 bg-naval-900/20' : 
                'border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50';

            const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
            const isCompatible = !scheme.suitable_ships || !currentHull || scheme.suitable_ships.includes(currentHull.role);
            const cardOpacity = isCompatible ? '' : 'opacity-60';

            html += `
                <div class="border rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardClass} ${cardOpacity}" 
                     ${isCompatible ? `onclick="selectArmorScheme('${schemeId}')"` : ''}>
                    <div class="mb-3">
                        <h5 class="font-semibold text-slate-100 text-sm mb-1">${scheme.name}</h5>
                        ${!isCompatible ? '<div class="text-xs text-red-400 mb-2">Incompatível com casco atual</div>' : ''}
                    </div>
                    
                    <p class="text-xs text-slate-300 mb-3">${scheme.description}</p>
                    
                    <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div class="text-slate-400">Peso: <span class="text-yellow-300">${Math.round((scheme.weight_modifier - 1) * 100)}%</span></div>
                        <div class="text-slate-400">Custo: <span class="text-green-300">${Math.round((scheme.cost_modifier - 1) * 100)}%</span></div>
                    </div>
                    
                    ${isSelected ? '<div class="text-xs text-naval-300 font-medium">✓ Selecionado</div>' : ''}
                </div>
            `;
        });

        html += '</div></div>';

        // Individual Zone Configuration
        html += `
            <div class="bg-slate-800/40 rounded-xl p-6 mb-6">
                <h4 class="text-lg font-semibold text-slate-100 mb-4">⚙️ Configuração Individual por Zona</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        `;

        if (window.NAVAL_COMPONENTS?.armor_zones) {
            Object.entries(window.NAVAL_COMPONENTS.armor_zones).forEach(([zoneId, zone]) => {
                const currentMaterial = window.currentShip?.armor?.custom_zones?.[zoneId] || 'no_armor';
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const hullRole = currentHull?.role || 'destroyer';

                html += `
                    <div class="bg-slate-900/50 rounded-lg p-4">
                        <h5 class="text-md font-semibold text-slate-100 mb-2">${zone.name}</h5>
                        <p class="text-xs text-slate-400 mb-3">${zone.description}</p>
                        
                        <div class="text-xs text-slate-500 mb-3">
                            Área: ${zone.area_sqm_base[hullRole] || zone.area_sqm_base.destroyer}m² • 
                            Importância: ${zone.importance === 'critical' ? '🔴 Crítica' : zone.importance === 'high' ? '🟡 Alta' : '🟢 Média'}
                        </div>
                        
                        <select onchange="updateArmorZone('${zoneId}', this.value)" 
                                class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100 text-sm">
                `;

                // Add material options
                Object.entries(window.NAVAL_COMPONENTS.armor_materials).forEach(([materialId, material]) => {
                    const isCompatible = zone.suitable_materials.includes(materialId) || materialId === 'no_armor' || materialId === 'structural_steel';
                    const selected = currentMaterial === materialId ? 'selected' : '';
                    
                    if (isCompatible) {
                        html += `<option value="${materialId}" ${selected}>${material.name} (${material.thickness_mm}mm)</option>`;
                    }
                });

                html += `
                        </select>
                        
                        <div class="mt-2 text-xs">
                `;

                // Show current material stats
                const material = window.NAVAL_COMPONENTS.armor_materials[currentMaterial];
                if (material && material.thickness_mm > 0) {
                    const area = zone.area_sqm_base[hullRole] || zone.area_sqm_base.destroyer;
                    const weight = (material.weight_per_sqm_kg * area * zone.weight_multiplier) / 1000; // convert to tons
                    const cost = material.cost_per_sqm * area;

                    html += `
                        <div class="flex justify-between">
                            <span class="text-slate-400">Proteção:</span>
                            <span class="text-blue-300">${material.protection_rating.toFixed(1)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Peso:</span>
                            <span class="text-yellow-300">${Math.round(weight)}t</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Custo:</span>
                            <span class="text-green-300">$${Math.round(cost / 1000)}K</span>
                        </div>
                    `;
                }

                html += `
                        </div>
                    </div>
                `;
            });
        }

        html += '</div></div>';

        // Armor Summary
        html += `
            <div class="bg-slate-800/40 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-100 mb-4">📊 Resumo de Blindagem</h4>
                <div id="armor-summary">
                    ${this.renderArmorSummary()}
                </div>
            </div>
        `;

        html += '</div>';
        tabContent.innerHTML = html;
    }

    static loadMainGunsTab() {
        const tabContent = document.getElementById('tab-content');
        if (!tabContent) return;

        let html = `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🎯 Artilharia Principal</h3>
                    <p class="text-slate-400">Configure os canhões principais que definem o poder de fogo do navio</p>
                </div>
        `;

        if (!window.NAVAL_COMPONENTS?.naval_guns) {
            html += '<div class="text-center text-red-400">❌ Sistemas de artilharia não carregados</div>';
            tabContent.innerHTML = html + '</div>';
            return;
        }

        // Group guns by caliber
        const gunsByCaliberRange = {
            'small': [], // < 127mm
            'medium': [], // 127-203mm  
            'large': [], // > 203mm
        };

        // Filter guns by hull compatibility first
        const filteredGuns = this.filterComponentsByHull(window.NAVAL_COMPONENTS.naval_guns);
        
        Object.entries(filteredGuns).forEach(([id, gun]) => {
            const gunWithId = { id, ...gun };
            if (gun.caliber < 127) {
                gunsByCaliberRange.small.push(gunWithId);
            } else if (gun.caliber <= 203) {
                gunsByCaliberRange.medium.push(gunWithId);
            } else {
                gunsByCaliberRange.large.push(gunWithId);
            }
        });

        const rangeNames = {
            'small': 'Canhões Leves (76-120mm)',
            'medium': 'Canhões Médios (127-203mm)',
            'large': 'Canhões Pesados (356mm+)'
        };

        Object.entries(gunsByCaliberRange).forEach(([range, guns]) => {
            if (guns.length === 0) return;

            html += `
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4">${rangeNames[range]}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            guns.forEach(gun => {
                html += `
                    <div class="border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 border rounded-xl p-4 cursor-pointer transition-all duration-200"
                         onclick="addMainGun('${gun.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${gun.name}</h5>
                                <div class="text-xs text-slate-400">${gun.year_introduced} • Tech Level ${gun.tech_level}</div>
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${gun.caliber}mm/${gun.barrel_length}</div>
                                <div class="text-slate-400">${gun.rate_of_fire} rpm</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${gun.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${gun.weight_tons}t</span></div>
                            <div class="text-slate-400">Alcance: <span class="text-yellow-300">${Math.round(gun.max_range_yards * 0.9144 / 1000)}km</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-slate-200">${gun.crew}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(gun.cost / 1000)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${gun.ammunition_types.map(ammo => `<span class="text-xs px-2 py-1 bg-orange-900/30 text-orange-300 rounded">${ammo}</span>`).join('')}
                        </div>
                        
                        <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                            Adicionar Torre
                        </button>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        // Show current main guns configuration
        if (window.currentShip?.main_guns && Array.isArray(window.currentShip.main_guns) && window.currentShip.main_guns.length > 0) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🎯 Configuração Atual</h4>
                    <div id="current-main-guns" class="space-y-2">
                        ${this.renderCurrentMainGuns()}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        tabContent.innerHTML = html;
    }

    static loadSecondaryTab() {
        const tabContent = document.getElementById('tab-content');
        if (!tabContent) return;

        let html = `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🚀 Armamento Secundário & Mísseis</h3>
                    <p class="text-slate-400">Configure sistemas AA, mísseis e armamento de apoio da era 1954</p>
                </div>
        `;

        if (!window.NAVAL_COMPONENTS?.naval_missiles) {
            html += '<div class="text-center text-red-400">❌ Sistemas de mísseis não carregados</div>';
            tabContent.innerHTML = html + '</div>';
            return;
        }

        // Group missiles by type
        const missilesByType = {};
        Object.entries(window.NAVAL_COMPONENTS.naval_missiles).forEach(([id, missile]) => {
            if (!missilesByType[missile.type]) {
                missilesByType[missile.type] = [];
            }
            missilesByType[missile.type].push({ id, ...missile });
        });

        const typeNames = {
            surface_to_air: '🛡️ Mísseis SAM (Defesa Aérea)',
            cruise_missile: '🌊 Mísseis de Cruzeiro',
            anti_ship: '🎯 Mísseis Anti-Navio',
            anti_submarine: '🐟 Foguetes ASW'
        };

        Object.entries(missilesByType).forEach(([type, missiles]) => {
            html += `
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4">${typeNames[type] || type}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            missiles.forEach(missile => {
                // Check if missile is suitable for current hull
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !missile.suitable_ships || !currentHull || missile.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';
                const cardClass = `border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}`;

                html += `
                    <div class="${cardClass}" ${isCompatible ? `onclick="addMissileSystem('${missile.id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${missile.name}</h5>
                                <div class="text-xs text-slate-400">${missile.year_introduced} • Tech Level ${missile.tech_level}</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${missile.range_km}km</div>
                                <div class="text-slate-400">${Math.round(missile.reliability * 100)}% conf.</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${missile.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso Lançador: <span class="text-slate-200">${missile.launcher_weight_tons}t</span></div>
                            <div class="text-slate-400">Ogiva: <span class="text-yellow-300">${missile.warhead_kg}kg</span></div>
                            <div class="text-slate-400">Custo Sistema: <span class="text-green-300">$${Math.round(missile.cost_per_launcher / 1000000)}M</span></div>
                            <div class="text-slate-400">Míssel: <span class="text-green-300">$${Math.round(missile.cost_per_missile / 1000)}K</span></div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-1 text-xs mb-3">
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Mísseis</div>
                                <div class="text-slate-100 font-semibold">${missile.missiles_per_launcher || 'N/A'}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Tripulação</div>
                                <div class="text-slate-100 font-semibold">${missile.crew_required || 'N/A'}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Energia</div>
                                <div class="text-slate-100 font-semibold">${missile.power_consumption_kw || 0}kW</div>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${missile.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${missile.disadvantages.slice(0, 2).map(dis => `<span class="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded">${dis}</span>`).join('')}
                        </div>
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div></div>';
        });

        // Show current missile systems
        if (window.currentShip?.missiles && Array.isArray(window.currentShip.missiles) && window.currentShip.missiles.length > 0) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🚀 Sistemas de Mísseis Instalados</h4>
                    <div id="current-missiles" class="space-y-2">
                        ${this.renderCurrentMissiles()}
                    </div>
                </div>
            `;
        }

        // AA Guns section 
        if (window.NAVAL_COMPONENTS?.aa_guns) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🔫 Artilharia Antiaérea</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            Object.entries(window.NAVAL_COMPONENTS.aa_guns).forEach(([id, gun]) => {
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !gun.suitable_ships || !currentHull || gun.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';

                html += `
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}" ${isCompatible ? `onclick="addAAGun('${id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${gun.name}</h5>
                                <div class="text-xs text-slate-400">${gun.year_introduced} • ${gun.caliber}mm</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${gun.rate_of_fire} TPM</div>
                                <div class="text-slate-400">${Math.round((gun.max_range_yards || gun.effective_range_aa) * 0.9144)}m</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${gun.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${gun.weight_tons}t</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-yellow-300">${gun.crew}</span></div>
                            <div class="text-slate-400">Tipo: <span class="text-blue-300">${gun.type.replace('_', ' ')}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(gun.cost / 1000)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${gun.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Canhão AA
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div>';
            
            // Current AA guns
            if (window.currentShip?.aa_guns && Array.isArray(window.currentShip.aa_guns) && window.currentShip.aa_guns.length > 0) {
                html += `
                    <div class="mt-6">
                        <h5 class="text-md font-semibold text-slate-100 mb-3">🔫 Canhões AA Instalados</h5>
                        <div id="current-aa-guns" class="space-y-2">
                            ${this.renderCurrentAAGuns()}
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
        }

        // Torpedo Tubes section
        if (window.NAVAL_COMPONENTS?.torpedo_tubes) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🚀 Tubos de Torpedo</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            `;

            Object.entries(window.NAVAL_COMPONENTS.torpedo_tubes).forEach(([id, torpedo]) => {
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !torpedo.suitable_ships || !currentHull || torpedo.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';

                html += `
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}" ${isCompatible ? `onclick="addTorpedoTube('${id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${torpedo.name}</h5>
                                <div class="text-xs text-slate-400">${torpedo.year_introduced} • ${torpedo.caliber}mm</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${torpedo.tubes_per_mount || 1} tubos</div>
                                <div class="text-slate-400">${torpedo.reload_time_minutes || 'N/A'} min recarga</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${torpedo.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${torpedo.weight_tons}t</span></div>
                            <div class="text-slate-400">Arco: <span class="text-yellow-300">${torpedo.training_arc || 360}°</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(torpedo.cost / 1000)}K</span></div>
                            <div class="text-slate-400">Tipos: <span class="text-blue-300">${(torpedo.torpedo_types || []).length}</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${torpedo.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div>';
            
            // Current torpedo tubes
            if (window.currentShip?.torpedo_tubes && Array.isArray(window.currentShip.torpedo_tubes) && window.currentShip.torpedo_tubes.length > 0) {
                html += `
                    <div class="mt-6">
                        <h5 class="text-md font-semibold text-slate-100 mb-3">🚀 Torpedos Instalados</h5>
                        <div id="current-torpedo-tubes" class="space-y-2">
                            ${this.renderCurrentTorpedos()}
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
        }

        // ASW Systems section
        if (window.NAVAL_COMPONENTS?.depth_charges) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🐟 Sistemas Anti-Submarino</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            `;

            Object.entries(window.NAVAL_COMPONENTS.depth_charges).forEach(([id, asw]) => {
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !asw.suitable_ships || !currentHull || asw.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';

                html += `
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}" ${isCompatible ? `onclick="addDepthCharge('${id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${asw.name}</h5>
                                <div class="text-xs text-slate-400">${asw.year_introduced} • ${asw.type}</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${asw.warhead_kg}kg</div>
                                <div class="text-slate-400">${asw.range_yards || asw.max_depth}${asw.range_yards ? 'y' : 'm'}</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${asw.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso Sist.: <span class="text-slate-200">${asw.launcher_weight_tons}t</span></div>
                            <div class="text-slate-400">Capacidade: <span class="text-yellow-300">${asw.capacity || asw.projectiles}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(asw.cost / 1000)}K</span></div>
                            <div class="text-slate-400">Método: <span class="text-blue-300">${(asw.launch_method || asw.pattern_type || 'standard').replace('_', ' ')}</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${asw.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema ASW
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div>';
            
            // Current ASW systems
            if (window.currentShip?.depth_charges && Array.isArray(window.currentShip.depth_charges) && window.currentShip.depth_charges.length > 0) {
                html += `
                    <div class="mt-6">
                        <h5 class="text-md font-semibold text-slate-100 mb-3">🐟 Sistemas ASW Instalados</h5>
                        <div id="current-depth-charges" class="space-y-2">
                            ${this.renderCurrentDepthCharges()}
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
        }

        html += '</div>';
        tabContent.innerHTML = html;
    }

    static loadElectronicsTab() {
        const tabContent = document.getElementById('tab-content');
        if (!tabContent) return;

        let html = `
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">📡 Sistemas Eletrônicos</h3>
                    <p class="text-slate-400">Configure radar, sonar, comunicações e sistemas de guerra eletrônica da era 1954</p>
                </div>
        `;

        // Radar Systems Section
        if (window.NAVAL_COMPONENTS?.radar_systems) {
            html += `
                <div class="border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">📡 Sistemas de Radar</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            Object.entries(window.NAVAL_COMPONENTS.radar_systems).forEach(([id, radar]) => {
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !radar.suitable_ships || !currentHull || radar.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';

                const typeIcons = {
                    air_search: '🔍',
                    surface_search: '🌊', 
                    fire_control: '🎯',
                    navigation: '🧭'
                };

                html += `
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}" ${isCompatible ? `onclick="addElectronicsSystem('radar_systems', '${id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${typeIcons[radar.type] || '📡'}</span>
                                    <span>${radar.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${radar.year_introduced} • Banda ${radar.frequency_band}</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${radar.max_range_miles}mi</div>
                                <div class="text-slate-400">${Math.round(radar.reliability * 100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${radar.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: ${this.getScaledWeightDisplay(radar.weight_tons)}</div>
                            <div class="text-slate-400">Energia: <span class="text-yellow-300">${radar.power_consumption_kw}kW</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${radar.crew_required}</span></div>
                            <div class="text-slate-400">Custo: $${this.getScaledCostDisplay(Math.round(radar.cost / 1000))}K</div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${radar.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Radar
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div></div>';
        }

        // Sonar Systems Section
        if (window.NAVAL_COMPONENTS?.sonar_systems) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🔊 Sistemas de Sonar</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            Object.entries(window.NAVAL_COMPONENTS.sonar_systems).forEach(([id, sonar]) => {
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !sonar.suitable_ships || !currentHull || sonar.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';

                const typeIcons = {
                    hull_mounted: '🚢',
                    variable_depth: '🎣',
                    towed_array: '📡'
                };

                html += `
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}" ${isCompatible ? `onclick="addElectronicsSystem('sonar_systems', '${id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${typeIcons[sonar.type] || '🔊'}</span>
                                    <span>${sonar.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${sonar.year_introduced} • ${sonar.frequency_khz}kHz</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${Math.round(sonar.max_range_yards * 0.9144)}m</div>
                                <div class="text-slate-400">${Math.round(sonar.reliability * 100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${sonar.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: ${this.getScaledWeightDisplay(sonar.weight_tons)}</div>
                            <div class="text-slate-400">Energia: <span class="text-yellow-300">${sonar.power_consumption_kw}kW</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${sonar.crew_required}</span></div>
                            <div class="text-slate-400">Custo: $${this.getScaledCostDisplay(Math.round(sonar.cost / 1000))}K</div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${sonar.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sonar
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div></div>';
        }

        // Communication Systems Section
        if (window.NAVAL_COMPONENTS?.communication_systems) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">📻 Sistemas de Comunicação</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            Object.entries(window.NAVAL_COMPONENTS.communication_systems).forEach(([id, comm]) => {
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !comm.suitable_ships || !currentHull || comm.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';

                const typeIcons = {
                    hf_radio: '📻',
                    secure_radio: '🔐',
                    vhf_tactical: '📡'
                };

                html += `
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}" ${isCompatible ? `onclick="addElectronicsSystem('communication_systems', '${id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${typeIcons[comm.type] || '📻'}</span>
                                    <span>${comm.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${comm.year_introduced} • ${comm.frequency_range.replace('_', ' ')}</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${comm.max_range_miles}mi</div>
                                <div class="text-slate-400">${Math.round(comm.reliability * 100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${comm.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${comm.weight_tons}t</span></div>
                            <div class="text-slate-400">Potência: <span class="text-yellow-300">${comm.power_output_watts}W</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${comm.crew_required}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(comm.cost / 1000)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${comm.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${comm.encryption_capable ? '<div class="text-xs text-green-400 mb-2">🔐 Criptografia disponível</div>' : ''}
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Comunicação
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div></div>';
        }

        // Electronic Warfare Section
        if (window.NAVAL_COMPONENTS?.electronic_warfare) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">⚡ Guerra Eletrônica</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `;

            Object.entries(window.NAVAL_COMPONENTS.electronic_warfare).forEach(([id, ew]) => {
                const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
                const isCompatible = !ew.suitable_ships || !currentHull || ew.suitable_ships.includes(window.currentShip.hull);
                const cardOpacity = isCompatible ? '' : 'opacity-60';

                const typeIcons = {
                    radar_warning: '⚠️',
                    active_jammer: '📡',
                    chaff_dispenser: '💨'
                };

                html += `
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${cardOpacity}" ${isCompatible ? `onclick="addElectronicsSystem('electronic_warfare', '${id}')"` : ''}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${typeIcons[ew.type] || '⚡'}</span>
                                    <span>${ew.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${ew.year_introduced} • ${ew.type.replace('_', ' ')}</div>
                                ${!isCompatible ? '<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>' : ''}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${(ew.detection_range_miles || ew.effectiveness_duration_minutes || 'N/A')}</div>
                                <div class="text-slate-400">${Math.round(ew.reliability * 100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${ew.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${ew.weight_tons}t</span></div>
                            <div class="text-slate-400">Energia: <span class="text-yellow-300">${ew.power_consumption_kw || 0}kW</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${ew.crew_required || 0}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(ew.cost / 1000)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${ew.advantages.slice(0, 2).map(adv => `<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${adv}</span>`).join('')}
                        </div>
                        
                        ${isCompatible ? `
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema EW
                            </button>
                        ` : `
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `;
            });

            html += '</div></div>';
        }

        // Current Electronics Systems
        if (window.currentShip?.electronics && Array.isArray(window.currentShip.electronics) && window.currentShip.electronics.length > 0) {
            html += `
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">💻 Sistemas Eletrônicos Instalados</h4>
                    <div id="current-electronics" class="space-y-2">
                        ${this.renderCurrentElectronics()}
                    </div>
                </div>
            `;
        }

        html += '</div>';
        tabContent.innerHTML = html;
    }

    static renderCurrentMainGuns() {
        if (!window.currentShip?.main_guns || !Array.isArray(window.currentShip.main_guns)) {
            return '<p class="text-slate-400 text-sm">Nenhum canhão principal configurado</p>';
        }

        let html = '';
        window.currentShip.main_guns.forEach((gunMount, index) => {
            const gun = window.NAVAL_COMPONENTS?.naval_guns[gunMount.type];
            if (gun) {
                html += `
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100">${gun.name}</div>
                            <div class="text-xs text-slate-400">
                                ${gunMount.quantity || 1}x ${gunMount.mount || 'single_mount'} • 
                                ${gun.caliber}mm/${gun.barrel_length}
                            </div>
                        </div>
                        <button onclick="removeMainGun(${index})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `;
            }
        });

        return html;
    }

    static renderCurrentMissiles() {
        if (!window.currentShip?.missiles || !Array.isArray(window.currentShip.missiles)) {
            return '<p class="text-slate-400 text-sm">Nenhum sistema de míssil instalado</p>';
        }

        let html = '';
        window.currentShip.missiles.forEach((missileMount, index) => {
            const missile = window.NAVAL_COMPONENTS?.naval_missiles[missileMount.type];
            if (missile) {
                const typeIcons = {
                    surface_to_air: '🛡️',
                    cruise_missile: '🌊', 
                    anti_ship: '🎯',
                    anti_submarine: '🐟'
                };
                
                html += `
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>${typeIcons[missile.type] || '🚀'}</span>
                                <span>${missile.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${missileMount.quantity || 1}x Sistema • 
                                Alcance: ${missile.range_km}km • 
                                ${missile.missiles_per_launcher || 'N/A'} mísseis
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${missile.launcher_weight_tons}t • 
                                Custo: $${Math.round(missile.cost_per_launcher / 1000000)}M
                            </div>
                        </div>
                        <button onclick="removeMissileSystem(${index})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `;
            }
        });

        return html;
    }

    static renderCurrentAAGuns() {
        if (!window.currentShip?.aa_guns || !Array.isArray(window.currentShip.aa_guns)) {
            return '<p class="text-slate-400 text-sm">Nenhum canhão AA instalado</p>';
        }

        let html = '';
        window.currentShip.aa_guns.forEach((aaMount, index) => {
            const gun = window.NAVAL_COMPONENTS?.aa_guns[aaMount.type];
            if (gun) {
                html += `
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>🔫</span>
                                <span>${gun.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${aaMount.quantity || 1}x ${gun.type.replace('_', ' ')} • 
                                ${gun.caliber}mm • ${gun.rate_of_fire} TPM
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${gun.weight_tons}t • Custo: $${Math.round(gun.cost / 1000)}K
                            </div>
                        </div>
                        <button onclick="removeAAGun(${index})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `;
            }
        });

        return html;
    }

    static renderCurrentTorpedos() {
        if (!window.currentShip?.torpedo_tubes || !Array.isArray(window.currentShip.torpedo_tubes)) {
            return '<p class="text-slate-400 text-sm">Nenhum sistema de torpedo instalado</p>';
        }

        let html = '';
        window.currentShip.torpedo_tubes.forEach((torpedoMount, index) => {
            const torpedo = window.NAVAL_COMPONENTS?.torpedo_tubes[torpedoMount.type];
            if (torpedo) {
                html += `
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>🚀</span>
                                <span>${torpedo.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${torpedoMount.quantity || 1}x Sistema • 
                                ${torpedo.tubes_per_mount || 1} tubos • 
                                ${torpedo.caliber}mm
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${torpedo.weight_tons}t • 
                                Recarga: ${torpedo.reload_time_minutes}min
                            </div>
                        </div>
                        <button onclick="removeTorpedoTube(${index})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `;
            }
        });

        return html;
    }

    static renderCurrentDepthCharges() {
        if (!window.currentShip?.depth_charges || !Array.isArray(window.currentShip.depth_charges)) {
            return '<p class="text-slate-400 text-sm">Nenhum sistema ASW instalado</p>';
        }

        let html = '';
        window.currentShip.depth_charges.forEach((aswMount, index) => {
            const asw = window.NAVAL_COMPONENTS?.depth_charges[aswMount.type];
            if (asw) {
                html += `
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>🐟</span>
                                <span>${asw.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${aswMount.quantity || 1}x Sistema • 
                                ${asw.warhead_kg}kg ogiva • 
                                ${asw.capacity || asw.projectiles} munições
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${asw.launcher_weight_tons}t • 
                                Alcance: ${asw.range_yards || asw.max_depth}${asw.range_yards ? 'y' : 'm'}
                            </div>
                        </div>
                        <button onclick="removeDepthCharge(${index})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `;
            }
        });

        return html;
    }

    static renderCurrentElectronics() {
        if (!window.currentShip?.electronics || !Array.isArray(window.currentShip.electronics)) {
            return '<p class="text-slate-400 text-sm">Nenhum sistema eletrônico instalado</p>';
        }

        let html = '';
        window.currentShip.electronics.forEach((electronicsMount, index) => {
            const componentCategory = window.NAVAL_COMPONENTS?.[electronicsMount.category];
            const electronics = componentCategory?.[electronicsMount.type];
            if (electronics) {
                const categoryIcons = {
                    radar_systems: '📡',
                    sonar_systems: '🔊',
                    communication_systems: '📻',
                    electronic_warfare: '⚡',
                    navigation_systems: '🧭',
                    data_processing: '💻'
                };
                
                html += `
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>${categoryIcons[electronicsMount.category] || '💻'}</span>
                                <span>${electronics.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${electronicsMount.quantity || 1}x ${electronics.type.replace(/_/g, ' ')} • 
                                ${electronics.year_introduced} • ${Math.round(electronics.reliability * 100)}%
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${electronics.weight_tons}t • 
                                Energia: ${electronics.power_consumption_kw || 0}kW • 
                                Custo: $${Math.round(electronics.cost / 1000)}K
                            </div>
                        </div>
                        <button onclick="removeElectronicsSystem(${index})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `;
            }
        });

        return html;
    }

    static renderArmorSummary() {
        if (!window.currentShip?.armor || !window.NAVAL_COMPONENTS) {
            return '<p class="text-slate-400 text-sm">Dados de blindagem indisponíveis</p>';
        }

        let totalWeight = 0;
        let totalCost = 0;
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';

        const currentHull = window.currentShip?.hull ? window.NAVAL_COMPONENTS.hulls[window.currentShip.hull] : null;
        const hullRole = currentHull?.role || 'destroyer';

        // Calculate totals and render zones
        Object.entries(window.currentShip.armor.custom_zones).forEach(([zoneId, materialId]) => {
            const zone = window.NAVAL_COMPONENTS.armor_zones[zoneId];
            const material = window.NAVAL_COMPONENTS.armor_materials[materialId];
            
            if (zone && material) {
                const area = zone.area_sqm_base[hullRole] || zone.area_sqm_base.destroyer;
                const weight = (material.weight_per_sqm_kg * area * zone.weight_multiplier) / 1000;
                const cost = material.cost_per_sqm * area;
                
                totalWeight += weight;
                totalCost += cost;
            }
        });

        // Left column - Zone details
        html += '<div class="space-y-2">';
        Object.entries(window.currentShip.armor.custom_zones).forEach(([zoneId, materialId]) => {
            const zone = window.NAVAL_COMPONENTS.armor_zones[zoneId];
            const material = window.NAVAL_COMPONENTS.armor_materials[materialId];
            
            if (zone && material) {
                const protectionIcon = material.protection_rating >= 2.0 ? '🛡️' : 
                                     material.protection_rating >= 1.0 ? '🔰' :
                                     material.protection_rating >= 0.5 ? '🟢' : '🔘';
                
                html += `
                    <div class="flex justify-between items-center text-sm">
                        <div class="flex items-center space-x-2">
                            <span>${protectionIcon}</span>
                            <span class="text-slate-300">${zone.name}</span>
                        </div>
                        <div class="text-slate-400">
                            ${material.thickness_mm}mm • ${material.protection_rating.toFixed(1)}
                        </div>
                    </div>
                `;
            }
        });
        html += '</div>';

        // Right column - Totals and effectiveness
        html += `
            <div class="space-y-3">
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-100 mb-2">💰 Totais</div>
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between">
                            <span class="text-slate-400">Peso Total:</span>
                            <span class="text-yellow-300">${Math.round(totalWeight)}t</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Custo Total:</span>
                            <span class="text-green-300">$${Math.round(totalCost / 1000000)}M</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-100 mb-2">🎯 Proteção vs Ameaças</div>
                    <div class="space-y-1 text-xs">
                        ${this.calculateThreatProtection()}
                    </div>
                </div>
            </div>
        `;

        html += '</div>';
        return html;
    }

    static calculateThreatProtection() {
        if (!window.currentShip?.armor) return '';

        const belt = window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.belt];
        const deck = window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.deck];
        const turrets = window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.turrets];
        const magazines = window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.magazines];

        let html = '';

        // Protection against different threat types
        const threats = [
            { name: '127mm HE', rating: belt?.protection_rating || 0, threshold: 0.3, icon: '💥' },
            { name: '203mm AP', rating: belt?.protection_rating || 0, threshold: 1.0, icon: '🔫' },
            { name: '406mm AP', rating: belt?.protection_rating || 0, threshold: 2.0, icon: '⚓' },
            { name: 'Bombas', rating: deck?.protection_rating || 0, threshold: 0.5, icon: '✈️' },
            { 
                name: 'Mísseis', 
                rating: Math.max(belt?.protection_rating || 0, deck?.protection_rating || 0), 
                threshold: 0.8, // Mísseis 1954 tem ogivas de ~300-400kg
                icon: '🚀' 
            },
            { 
                name: 'Torpedos', 
                rating: belt?.protection_rating || 0, 
                threshold: 1.5, // Torpedos tem ogivas pesadas ~270-500kg
                icon: '🐟' 
            }
        ];

        threats.forEach(threat => {
            const effectiveness = Math.min(100, (threat.rating / threat.threshold) * 100);
            const color = effectiveness >= 80 ? 'text-green-300' : 
                         effectiveness >= 50 ? 'text-yellow-300' : 
                         effectiveness >= 25 ? 'text-orange-300' : 'text-red-300';
            const bars = '█'.repeat(Math.floor(effectiveness / 10)) + '░'.repeat(10 - Math.floor(effectiveness / 10));
            
            html += `
                <div class="flex justify-between items-center">
                    <span class="text-slate-400 flex items-center space-x-1">
                        <span>${threat.icon}</span>
                        <span>${threat.name}:</span>
                    </span>
                    <span class="${color} font-mono text-xs">${bars} ${Math.round(effectiveness)}%</span>
                </div>
            `;
        });

        return html;
    }

    static getRoleIcon(role) {
        const icons = {
            escort: '🚤',
            cruiser: '🚢',
            battleship: '⚓',
            carrier: '✈️',
            submarine: '🐟'
        };
        return icons[role] || '🚢';
    }

    static getPropulsionIcon(type) {
        const icons = {
            steam_turbine: '💨',
            diesel: '🔧',
            diesel_electric: '⚡',
            nuclear: '⚛️',
            gas_turbine: '🌪️',
            combined: '⚙️'
        };
        return icons[type] || '⚙️';
    }
}

// Global functions for component selection
window.selectPropulsion = function(propulsionId) {
    if (!window.NAVAL_COMPONENTS?.propulsion_systems[propulsionId]) {
        console.error('Propulsion system not found:', propulsionId);
        return;
    }
    
    window.currentShip.propulsion = propulsionId;
    console.log('Selected propulsion:', propulsionId);

    // Update visual selection
    document.querySelectorAll('[onclick*="selectPropulsion"]').forEach(card => {
        card.classList.remove('border-naval-400', 'ring-1', 'ring-naval-400/50', 'bg-naval-900/20');
        card.classList.add('border-slate-700/50', 'bg-slate-800/40');
    });
    
    const selectedCard = document.querySelector(`[onclick="selectPropulsion('${propulsionId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('border-naval-400', 'ring-1', 'ring-naval-400/50', 'bg-naval-900/20');
        selectedCard.classList.remove('border-slate-700/50', 'bg-slate-800/40');
    }
    
    updateShipCalculations();
};

window.addMainGun = function(gunId) {
    if (!window.NAVAL_COMPONENTS?.naval_guns[gunId]) {
        console.error('Naval gun not found:', gunId);
        return;
    }
    
    if (!window.currentShip.main_guns) {
        window.currentShip.main_guns = [];
    }
    
    // Simple add for now - could add modal for mount selection later
    window.currentShip.main_guns.push({
        type: gunId,
        mount: 'single_mount',
        quantity: 1
    });
    
    console.log('Added main gun:', gunId);
    updateShipCalculations();
    
    // Refresh the current guns display
    const currentGunsDiv = document.getElementById('current-main-guns');
    if (currentGunsDiv) {
        currentGunsDiv.innerHTML = NavalTabLoaders.renderCurrentMainGuns();
    }
};

window.removeMainGun = function(index) {
    if (window.currentShip.main_guns && Array.isArray(window.currentShip.main_guns)) {
        window.currentShip.main_guns.splice(index, 1);
        console.log('Removed main gun at index:', index);
        updateShipCalculations();
        
        // Refresh the current guns display
        const currentGunsDiv = document.getElementById('current-main-guns');
        if (currentGunsDiv) {
            currentGunsDiv.innerHTML = NavalTabLoaders.renderCurrentMainGuns();
        }
    }
};

// Missile system management functions
window.addMissileSystem = function(missileId) {
    if (!window.NAVAL_COMPONENTS?.naval_missiles[missileId]) {
        console.error('Missile system not found:', missileId);
        return;
    }
    
    if (!window.currentShip.missiles) {
        window.currentShip.missiles = [];
    }
    
    // Add missile system
    window.currentShip.missiles.push({
        type: missileId,
        quantity: 1
    });
    
    console.log('Added missile system:', missileId);
    updateShipCalculations();
    
    // Refresh the current missiles display
    const currentMissilesDiv = document.getElementById('current-missiles');
    if (currentMissilesDiv) {
        currentMissilesDiv.innerHTML = NavalTabLoaders.renderCurrentMissiles();
    }
};

window.removeMissileSystem = function(index) {
    if (window.currentShip.missiles && Array.isArray(window.currentShip.missiles)) {
        window.currentShip.missiles.splice(index, 1);
        console.log('Removed missile system at index:', index);
        
        updateShipCalculations();
        
        // Refresh the current missiles display
        const currentMissilesDiv = document.getElementById('current-missiles');
        if (currentMissilesDiv) {
            currentMissilesDiv.innerHTML = NavalTabLoaders.renderCurrentMissiles();
        }
    }
};

// AA Gun management functions
window.addAAGun = function(gunId) {
    if (!window.NAVAL_COMPONENTS?.aa_guns[gunId]) {
        console.error('AA gun not found:', gunId);
        return;
    }
    
    if (!window.currentShip.aa_guns) {
        window.currentShip.aa_guns = [];
    }
    
    window.currentShip.aa_guns.push({
        type: gunId,
        quantity: 1
    });
    
    console.log('Added AA gun:', gunId);
    updateShipCalculations();
    
    const currentAAGunsDiv = document.getElementById('current-aa-guns');
    if (currentAAGunsDiv) {
        currentAAGunsDiv.innerHTML = NavalTabLoaders.renderCurrentAAGuns();
    }
};

window.removeAAGun = function(index) {
    if (window.currentShip.aa_guns && Array.isArray(window.currentShip.aa_guns)) {
        window.currentShip.aa_guns.splice(index, 1);
        console.log('Removed AA gun at index:', index);
        
        updateShipCalculations();
        
        const currentAAGunsDiv = document.getElementById('current-aa-guns');
        if (currentAAGunsDiv) {
            currentAAGunsDiv.innerHTML = NavalTabLoaders.renderCurrentAAGuns();
        }
    }
};

// Torpedo Tube management functions
window.addTorpedoTube = function(torpedoId) {
    if (!window.NAVAL_COMPONENTS?.torpedo_tubes[torpedoId]) {
        console.error('Torpedo tube not found:', torpedoId);
        return;
    }
    
    if (!window.currentShip.torpedo_tubes) {
        window.currentShip.torpedo_tubes = [];
    }
    
    window.currentShip.torpedo_tubes.push({
        type: torpedoId,
        quantity: 1
    });
    
    console.log('Added torpedo tube:', torpedoId);
    updateShipCalculations();
    
    const currentTorpedosDiv = document.getElementById('current-torpedo-tubes');
    if (currentTorpedosDiv) {
        currentTorpedosDiv.innerHTML = NavalTabLoaders.renderCurrentTorpedos();
    }
};

window.removeTorpedoTube = function(index) {
    if (window.currentShip.torpedo_tubes && Array.isArray(window.currentShip.torpedo_tubes)) {
        window.currentShip.torpedo_tubes.splice(index, 1);
        console.log('Removed torpedo tube at index:', index);
        
        updateShipCalculations();
        
        const currentTorpedosDiv = document.getElementById('current-torpedo-tubes');
        if (currentTorpedosDiv) {
            currentTorpedosDiv.innerHTML = NavalTabLoaders.renderCurrentTorpedos();
        }
    }
};

// Depth Charge/ASW management functions
window.addDepthCharge = function(aswId) {
    if (!window.NAVAL_COMPONENTS?.depth_charges[aswId]) {
        console.error('ASW system not found:', aswId);
        return;
    }
    
    if (!window.currentShip.depth_charges) {
        window.currentShip.depth_charges = [];
    }
    
    window.currentShip.depth_charges.push({
        type: aswId,
        quantity: 1
    });
    
    console.log('Added ASW system:', aswId);
    updateShipCalculations();
    
    const currentDepthChargesDiv = document.getElementById('current-depth-charges');
    if (currentDepthChargesDiv) {
        currentDepthChargesDiv.innerHTML = NavalTabLoaders.renderCurrentDepthCharges();
    }
};

window.removeDepthCharge = function(index) {
    if (window.currentShip.depth_charges && Array.isArray(window.currentShip.depth_charges)) {
        window.currentShip.depth_charges.splice(index, 1);
        console.log('Removed ASW system at index:', index);
        
        updateShipCalculations();
        
        const currentDepthChargesDiv = document.getElementById('current-depth-charges');
        if (currentDepthChargesDiv) {
            currentDepthChargesDiv.innerHTML = NavalTabLoaders.renderCurrentDepthCharges();
        }
    }
};

// Electronics System management functions
window.addElectronicsSystem = function(category, systemId) {
    if (!window.NAVAL_COMPONENTS?.[category]?.[systemId]) {
        console.error('Electronics system not found:', category, systemId);
        return;
    }
    
    if (!window.currentShip.electronics) {
        window.currentShip.electronics = [];
    }
    
    window.currentShip.electronics.push({
        category: category,
        type: systemId,
        quantity: 1
    });
    
    console.log('Added electronics system:', category, systemId);
    updateShipCalculations();
    
    const currentElectronicsDiv = document.getElementById('current-electronics');
    if (currentElectronicsDiv) {
        currentElectronicsDiv.innerHTML = NavalTabLoaders.renderCurrentElectronics();
    }
};

window.removeElectronicsSystem = function(index) {
    if (window.currentShip.electronics && Array.isArray(window.currentShip.electronics)) {
        window.currentShip.electronics.splice(index, 1);
        console.log('Removed electronics system at index:', index);
        
        updateShipCalculations();
        
        const currentElectronicsDiv = document.getElementById('current-electronics');
        if (currentElectronicsDiv) {
            currentElectronicsDiv.innerHTML = NavalTabLoaders.renderCurrentElectronics();
        }
    }
};

// Armor System management functions
window.selectArmorScheme = function(schemeId) {
    if (!window.NAVAL_COMPONENTS?.armor_schemes[schemeId]) {
        console.error('Armor scheme not found:', schemeId);
        return;
    }
    
    const scheme = window.NAVAL_COMPONENTS.armor_schemes[schemeId];
    
    // Update armor scheme
    window.currentShip.armor.scheme = schemeId;
    
    // Apply scheme to all zones
    Object.entries(scheme.zones).forEach(([zoneId, materialId]) => {
        window.currentShip.armor.custom_zones[zoneId] = materialId;
    });
    
    console.log('Selected armor scheme:', schemeId);
    updateShipCalculations();
    
    // Refresh armor tab if we're on it
    if (window.navalCreatorApp && window.navalCreatorApp.currentTab === 'armor') {
        window.navalTabLoaders.loadArmorTab();
    }
};

window.updateArmorZone = function(zoneId, materialId) {
    if (!window.NAVAL_COMPONENTS?.armor_materials[materialId]) {
        console.error('Armor material not found:', materialId);
        return;
    }
    
    // Update the specific zone
    window.currentShip.armor.custom_zones[zoneId] = materialId;
    
    // Switch to custom scheme since we're manually adjusting
    window.currentShip.armor.scheme = 'custom';
    
    console.log('Updated armor zone:', zoneId, 'to', materialId);
    updateShipCalculations();
    
    // Refresh armor summary
    const armorSummaryDiv = document.getElementById('armor-summary');
    if (armorSummaryDiv) {
        armorSummaryDiv.innerHTML = NavalTabLoaders.renderArmorSummary();
    }
};

// Make NavalTabLoaders available globally
window.navalTabLoaders = NavalTabLoaders;