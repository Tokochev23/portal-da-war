// js/components/tabLoaders.js - Funções de carregamento de abas
// Versão final e correta, combinando o UI original com a nova lógica.

export class TabLoaders {
    constructor() {
        this.tabContent = null;
    }

    getTabContent() {
        if (!this.tabContent) {
            this.tabContent = document.getElementById('tab-content');
        }
        return this.tabContent;
    }

    showLoadingState(message = 'Carregando componentes...') {
        const tabContent = this.getTabContent();
        if (tabContent) {
            tabContent.innerHTML = `<div class="text-center text-slate-400 p-8">${message}</div>`;
        }
    }

    showEmptyState(message) {
        const tabContent = this.getTabContent();
        if (tabContent) {
            tabContent.innerHTML = `<div class="text-center text-slate-500 p-8">${message}</div>`;
        }
    }

    // --- MASTER TAB LOADERS ---

    loadChassisTab() {
        const chassisComponents = window.VEHICLE_COMPONENTS.chassis || {};
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        Object.entries(chassisComponents).forEach(([id, chassis]) => {
            html += this.renderChassisCard(id, chassis);
        });
        html += '</div>';
        this.getTabContent().innerHTML = html;
    }

    loadEngineTab() {
        const engines = window.filterCompatibleComponents('engines');
        if (Object.keys(engines).length === 0) {
            this.showEmptyState('Nenhum motor compatível para o chassi selecionado.');
            return;
        }
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        Object.entries(engines).forEach(([id, rawEngine]) => {
            html += this.renderEngineCardV2(id, rawEngine);
        });
        html += '</div>';
        this.getTabContent().innerHTML = html;
    }

    // Nova versão do card de motor, com layout aprimorado
    renderEngineCardV2(id, rawEngine) {
        const isSelected = window.currentVehicle?.engine === id;
        const engine = window.getResolvedComponent('engines', id);
        if (!engine) return '';
        const category = rawEngine?.category || engine.category || '';
        const hp = Math.round(engine.power || 0);
        const weightKg = Math.round(engine.weight || 0);
        const costK = engine.cost ? Math.round(engine.cost/1000) : 0;
        const energy = engine.energy_output ?? rawEngine?.energy_output ?? 0;
        const rel = Math.min(100, Math.max(0, Math.round((engine.reliability || 0)*100)));
        const badgeColor = category === 'heavy' ? 'bg-red-600' : category === 'medium' ? 'bg-blue-600' : 'bg-emerald-600';
        return `
        <button class="component-card relative w-full text-left rounded-2xl p-4 shadow-lg transition ${isSelected ? 'selected border-brand-400 ring-1 ring-brand-400/50' : ''} bg-gradient-to-br from-slate-800 to-slate-900 hover:scale-[1.01] hover:shadow-xl" onclick="selectEngine('${id}')">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-base font-semibold text-slate-100">${engine.name}</h4>
            <span class="px-2 py-0.5 text-xs rounded-lg text-white ${badgeColor}">${category || '—'}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="flex items-center gap-1"><span>⚙️</span> <b>${hp}hp</b></div>
            <div class="flex items-center gap-1"><span>⚖️</span> <b>${weightKg}kg</b></div>
            <div class="flex items-center gap-1 text-yellow-400"><span>💰</span> $${costK}K</div>
            <div class="flex items-center gap-1 text-green-400"><span>⚡</span> ${energy}kW</div>
          </div>
          <div class="mt-3">
            <span class="text-xs text-slate-400">Confiabilidade</span>
            <div class="w-full bg-slate-700 rounded-full h-2 mt-1">
              <div class="bg-green-500 h-2 rounded-full" style="width: ${rel}%"></div>
            </div>
            <p class="text-xs text-right text-slate-300">${rel}%</p>
          </div>
          ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
        </button>`;
    }

    loadTransmissionTab() {
        const transmissions = window.filterCompatibleComponents('transmissions');
        if (Object.keys(transmissions).length === 0) {
            this.showEmptyState('Nenhuma transmissão compatível para o chassi selecionado.');
            return;
        }
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        Object.entries(transmissions).forEach(([id, transmission]) => {
            html += this.renderTransmissionCard(id, transmission);
        });
        html += '</div>';
        this.getTabContent().innerHTML = html;
    }

    loadSuspensionTab() {
        const suspensions = window.filterCompatibleComponents('suspensions');
        if (Object.keys(suspensions).length === 0) {
            this.showEmptyState('Nenhuma suspensão compatível para o chassi selecionado.');
            return;
        }
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        Object.entries(suspensions).forEach(([id, suspension]) => {
            html += this.renderSuspensionCard(id, suspension);
        });
        html += '</div>';
        this.getTabContent().innerHTML = html;
    }

    loadCrewTab() {
        const currentCrewSize = window.currentVehicle?.crewSize || 3;
        const currentTrainingLevel = window.currentVehicle?.trainingLevel || 'standard';
        this.getTabContent().innerHTML = this.renderCrewInterface(currentCrewSize, currentTrainingLevel);
        if (window.updateCrewRolesDisplay) {
            try { window.updateCrewRolesDisplay(currentCrewSize); } catch (e) {}
        }
    }

    loadArmorTab() {
        const currentVehicle = window.currentVehicle || {};
        const armorMaterials = window.VEHICLE_COMPONENTS.armor_materials;
        const additionalArmor = window.VEHICLE_COMPONENTS.additional_armor;
        const armorAngles = window.VEHICLE_COMPONENTS.armor_angles;
        const currentThickness = currentVehicle.armorThickness || 80;
        const currentMaterial = currentVehicle.armorMaterial || 'rolled_homogeneous_armor';
        const currentAngle = currentVehicle.armorAngle || 'vertical_90';
        const currentAdditional = currentVehicle.additionalArmor || [];
        this.getTabContent().innerHTML = this.renderArmorInterfaceV2(currentThickness, currentMaterial, currentAngle, currentAdditional, armorMaterials, additionalArmor, armorAngles);
        if (window.updateArmorEfficiency) {
            try { window.updateArmorEfficiency(); } catch (e) {}
        }
    }

    loadWeaponsTab() {
        this.getTabContent().innerHTML = this.renderWeaponsInterface();
        if (window.updateGunPreview) {
            try { window.updateGunPreview(); } catch (e) {}
        }
    }

    loadSystemsTab() {
        this.getTabContent().innerHTML = this.renderSystemsInterface();
    }

    loadEquipmentTab() {
        this.getTabContent().innerHTML = this.renderEquipmentInterface();
    }

    // --- CARD & UI RENDERERS ---

    renderChassisCard(id, chassis) {
        const isSelected = window.currentVehicle?.chassis === id;
        const costLevel = chassis.base_cost > 120000 ? 'high' : chassis.base_cost > 80000 ? 'medium' : 'low';
        const techLevel = chassis.tech_requirement?.level > 70 ? 'advanced' : chassis.tech_requirement?.level > 50 ? 'standard' : 'basic';
        const reliabilityLevel = chassis.reliability > 0.85 ? 'excellent' : chassis.reliability > 0.7 ? 'good' : 'fair';
        
        return `<div class="component-card relative p-4 rounded-xl cursor-pointer ${isSelected ? 'selected bg-brand-900/30 border-brand-400 shadow-brand-500/20 shadow-lg' : 'bg-slate-800/40 border-slate-700/50'} hover:border-brand-500/60 transition-all duration-200" onclick="selectChassis('${id}')">
            <div class="flex items-start justify-between mb-3">
                <h4 class="font-semibold text-base ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${chassis.name}</h4>
                ${chassis.tech_requirement?.level ? `<span class="text-xs px-2 py-1 rounded font-medium ${techLevel === 'advanced' ? 'bg-purple-500/20 text-purple-300' : techLevel === 'standard' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-600/50 text-slate-400'}">${chassis.tech_requirement.level}% tech</span>` : ''}
            </div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
                <div><span class="text-slate-500">Peso:</span> <span class="font-medium text-slate-300">${(chassis.base_weight/1000).toFixed(1)}t</span></div>
                <div><span class="text-slate-500">Vel Máx:</span> <span class="font-medium text-slate-300">${chassis.base_speed} km/h</span></div>
                <div><span class="text-slate-500">Custo:</span> <span class="font-medium ${costLevel === 'high' ? 'text-red-400' : costLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'}">$${(chassis.base_cost/1000).toFixed(0)}K</span></div>
                <div><span class="text-slate-500">Blind. Máx:</span> <span class="font-medium text-slate-300">${chassis.max_armor_thickness}mm</span></div>
            </div>
            ${chassis.reliability ? `<div class="mt-3 pt-2 border-t ${isSelected ? 'border-brand-700/50' : 'border-slate-700/50'}">
                <div class="flex justify-between items-center text-xs">
                    <span class="text-slate-500">Confiabilidade</span>
                    <div class="flex items-center gap-2">
                        <div class="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full rounded-full ${reliabilityLevel === 'excellent' ? 'bg-emerald-500' : reliabilityLevel === 'good' ? 'bg-blue-500' : 'bg-amber-500'}" style="width: ${chassis.reliability * 100}%"></div>
                        </div>
                        <span class="font-medium ${reliabilityLevel === 'excellent' ? 'text-emerald-400' : reliabilityLevel === 'good' ? 'text-blue-400' : 'text-amber-400'}">${Math.round(chassis.reliability * 100)}%</span>
                    </div>
                </div>
            </div>` : ''}
            ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
        </div>`;
    }

    renderEngineCard(id, rawEngine) {
        const isSelected = window.currentVehicle?.engine === id;
        const engine = window.getResolvedComponent('engines', id);
        if (!engine) return '';
        return `<div class="component-card relative p-4 rounded-xl cursor-pointer ${isSelected ? 'selected bg-brand-900/30 border-brand-400' : 'bg-slate-800/40 border-slate-700/50'} hover:border-brand-500/60 transition-all duration-200" onclick="selectEngine('${id}')">
            <h4 class="font-semibold text-base ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${engine.name}</h4>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-slate-400">
                <span>Potência: <span class="font-medium text-slate-300">${engine.power}hp</span></span>
                <span>Peso: <span class="font-medium text-slate-300">${engine.weight}kg</span></span>
                <span>Custo: <span class="font-medium text-slate-300">$${(engine.cost/1000).toFixed(0)}K</span></span>
                <span>Consumo: <span class="font-medium text-slate-300">${engine.consumption} L/h</span></span>
            </div>
            ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
        </div>`;
    }

    renderTransmissionCard(id, transmission) {
        const isSelected = window.currentVehicle?.transmission === id;
        const typeInfo = this.getTransmissionTypeInfo(transmission.type);
        const efficiency = Math.round(transmission.efficiency * 100);
        const gears = transmission.gears === "infinite" ? "∞" : transmission.gears === "variable" ? "Var" : transmission.gears;
        const costK = Math.round(transmission.cost / 1000);
        const weightKg = Math.round(transmission.weight);
        
        return `
        <div class="component-card relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isSelected ? 'selected bg-gradient-to-br from-brand-900/40 to-brand-800/30 border-2 border-brand-400 shadow-lg shadow-brand-500/20' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-slate-600/60'}" onclick="selectTransmission('${id}')">
            <!-- Header with type badge -->
            <div class="flex items-start justify-between p-4 pb-3">
                <div class="flex-1">
                    <h4 class="font-bold text-lg ${isSelected ? 'text-brand-100' : 'text-slate-100'} mb-1">${transmission.name}</h4>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1.5 rounded-full text-sm font-semibold ${typeInfo.badgeClass}">
                            ${typeInfo.icon} ${typeInfo.name}
                        </span>
                    </div>
                </div>
                ${isSelected ? '<div class="w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
            </div>
            
            <!-- Main stats row -->
            <div class="px-4 pb-3">
                <div class="flex items-center justify-between mb-3">
                    <div class="text-center">
                        <div class="text-2xl font-bold ${isSelected ? 'text-brand-200' : 'text-slate-200'}">${gears}</div>
                        <div class="text-xs text-slate-400">Marchas</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl font-bold text-slate-300">${weightKg}kg</div>
                        <div class="text-xs text-slate-400">Peso</div>
                    </div>
                    <div class="text-center">
                        <div class="text-xl font-bold text-green-400">$${costK}K</div>
                        <div class="text-xs text-slate-400">Custo</div>
                    </div>
                </div>
            </div>
            
            <!-- Efficiency bar and percentage -->
            <div class="px-4 pb-4">
                <div class="flex items-center justify-between text-sm mb-2">
                    <span class="text-slate-400">Eficiência</span>
                    <span class="font-bold ${efficiency >= 80 ? 'text-green-400' : efficiency >= 70 ? 'text-yellow-400' : 'text-orange-400'}">${efficiency}%</span>
                </div>
                <div class="w-full bg-slate-700/60 rounded-full h-3 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500 ${efficiency >= 80 ? 'bg-gradient-to-r from-green-600 to-green-400' : efficiency >= 70 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-orange-600 to-orange-400'}" style="width: ${efficiency}%"></div>
                </div>
            </div>
            
            <!-- Special features badges (if any) -->
            ${this.renderTransmissionSpecialFeatures(transmission)}
            
            ${isSelected ? '<div class="absolute inset-0 border-2 border-brand-400/30 rounded-2xl pointer-events-none"></div>' : ''}
        </div>`;
    }

    getTransmissionTypeInfo(type) {
        const typeMap = {
            manual: { name: 'Manual', icon: '🔧', badgeClass: 'bg-gradient-to-r from-slate-600 to-slate-500 text-white border border-slate-400/30' },
            semi_auto: { name: 'Semi-Auto', icon: '⚙️', badgeClass: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-400/30' },
            automatic: { name: 'Automática', icon: '🤖', badgeClass: 'bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/30' },
            planetary: { name: 'Planetário', icon: '🌍', badgeClass: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white border border-purple-400/30' },
            cvt: { name: 'CVT', icon: '♾️', badgeClass: 'bg-gradient-to-r from-orange-600 to-orange-500 text-white border border-orange-400/30' },
            electric: { name: 'Elétrica', icon: '⚡', badgeClass: 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white border border-cyan-400/30' },
            hydrostatic: { name: 'Hidrostática', icon: '💧', badgeClass: 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border border-indigo-400/30' }
        };
        return typeMap[type] || { name: type, icon: '❓', badgeClass: 'bg-gradient-to-r from-slate-600 to-slate-500 text-white border border-slate-400/30' };
    }

    renderTransmissionSpecialFeatures(transmission) {
        const features = [];
        
        if (transmission.torque_converter) features.push({ icon: '🔄', text: 'Conversor de Torque', class: 'bg-blue-600/20 text-blue-300 border border-blue-500/30' });
        if (transmission.hydraulic_assist) features.push({ icon: '💨', text: 'Assistência Hidráulica', class: 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' });
        if (transmission.continuously_variable) features.push({ icon: '♾️', text: 'Variação Contínua', class: 'bg-orange-600/20 text-orange-300 border border-orange-500/30' });
        if (transmission.instant_torque) features.push({ icon: '⚡', text: 'Torque Instantâneo', class: 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' });
        if (transmission.silent_operation) features.push({ icon: '🤫', text: 'Operação Silenciosa', class: 'bg-gray-600/20 text-gray-300 border border-gray-500/30' });
        if (transmission.pivot_turn) features.push({ icon: '🔄', text: 'Giro no Local', class: 'bg-purple-600/20 text-purple-300 border border-purple-500/30' });
        if (transmission.smooth_operation) features.push({ icon: '🌊', text: 'Operação Suave', class: 'bg-teal-600/20 text-teal-300 border border-teal-500/30' });
        if (transmission.prototype_only) features.push({ icon: '🧪', text: 'Protótipo', class: 'bg-red-600/20 text-red-300 border border-red-500/30' });
        
        if (features.length === 0) return '';
        
        return `
        <div class="px-4 pb-3 border-t border-slate-700/40">
            <div class="flex flex-wrap gap-1.5 mt-3">
                ${features.map(feature => `
                    <span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${feature.class}">
                        <span class="text-xs">${feature.icon}</span>
                        ${feature.text}
                    </span>
                `).join('')}
            </div>
        </div>`;
    }

    renderSuspensionCard(id, suspension) {
        const isSelected = window.currentVehicle?.suspension === id;
        const comfort = Math.round(suspension.comfort_factor * 100);
        const costK = Math.round(suspension.cost / 1000);
        const weightKg = Math.round(suspension.weight);
        const techLevel = this.getSuspensionTechLevel(suspension);
        const specialFeatures = this.getSuspensionSpecialFeatures(suspension);
        
        return `
        <div class="component-card relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isSelected ? 'selected bg-gradient-to-br from-brand-900/40 to-brand-800/30 border-2 border-brand-400 shadow-lg shadow-brand-500/20' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-slate-600/60'}" onclick="selectSuspension('${id}')">
            <!-- Header with tech level badge -->
            <div class="flex items-start justify-between p-4 pb-3">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs text-slate-500 uppercase tracking-wide">SUSPENSÃO</span>
                        <span class="px-2 py-1 text-xs font-semibold rounded-md ${techLevel.badgeClass}">
                            ${techLevel.name}
                        </span>
                    </div>
                    <h4 class="font-bold text-lg ${isSelected ? 'text-brand-100' : 'text-slate-100'} mb-1">
                        ${suspension.name}
                        ${suspension.experimental ? ' <span class="text-orange-400">(Experimental)</span>' : ''}
                    </h4>
                </div>
                ${isSelected ? '<div class="w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
            </div>
            
            <!-- Comfort bar - destaque principal -->
            <div class="px-4 pb-3">
                <div class="flex items-center justify-between text-sm mb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-slate-400">🛋️ Conforto</span>
                    </div>
                    <span class="font-bold text-2xl ${comfort >= 90 ? 'text-green-400' : comfort >= 80 ? 'text-blue-400' : comfort >= 70 ? 'text-yellow-400' : 'text-orange-400'}">${comfort}%</span>
                </div>
                <div class="w-full bg-slate-700/60 rounded-full h-4 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500 ${comfort >= 90 ? 'bg-gradient-to-r from-green-600 to-green-400' : comfort >= 80 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : comfort >= 70 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' : 'bg-gradient-to-r from-orange-600 to-orange-400'}" style="width: ${comfort}%"></div>
                </div>
            </div>
            
            <!-- Stats row -->
            <div class="px-4 pb-3">
                <div class="flex items-center justify-between">
                    <div class="text-center">
                        <div class="flex items-center gap-1 text-slate-400 text-xs mb-1">
                            <span>⚖️</span>
                            <span>Peso</span>
                        </div>
                        <div class="text-lg font-bold text-slate-300">${weightKg}kg</div>
                    </div>
                    <div class="text-center">
                        <div class="flex items-center gap-1 text-slate-400 text-xs mb-1">
                            <span>💰</span>
                            <span>Custo</span>
                        </div>
                        <div class="text-lg font-bold text-green-400">$${costK}K</div>
                    </div>
                    <div class="text-center">
                        <div class="flex items-center gap-1 text-slate-400 text-xs mb-1">
                            <span>🏔️</span>
                            <span>Terreno</span>
                        </div>
                        <div class="text-lg font-bold text-slate-300">${Math.round(suspension.terrain_performance * 100)}%</div>
                    </div>
                </div>
            </div>
            
            <!-- Special features badges -->
            ${specialFeatures.length > 0 ? `
            <div class="px-4 pb-3 border-t border-slate-700/40">
                <div class="flex flex-wrap gap-1.5 mt-3">
                    ${specialFeatures.map(feature => `
                        <span class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${feature.class}">
                            <span class="text-xs">${feature.icon}</span>
                            ${feature.text}
                        </span>
                    `).join('')}
                </div>
            </div>` : ''}
            
            ${isSelected ? '<div class="absolute inset-0 border-2 border-brand-400/30 rounded-2xl pointer-events-none"></div>' : ''}
        </div>`;
    }

    getSuspensionTechLevel(suspension) {
        const techReq = suspension.tech_requirement?.level || 0;
        if (techReq >= 75) return { name: 'Avançada', badgeClass: 'bg-gradient-to-r from-purple-600 to-purple-500 text-white border border-purple-400/30' };
        if (techReq >= 50) return { name: 'Moderna', badgeClass: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border border-blue-400/30' };
        if (techReq >= 30) return { name: 'Padrão', badgeClass: 'bg-gradient-to-r from-green-600 to-green-500 text-white border border-green-400/30' };
        return { name: 'Básica', badgeClass: 'bg-gradient-to-r from-slate-600 to-slate-500 text-white border border-slate-400/30' };
    }

    getSuspensionSpecialFeatures(suspension) {
        const features = [];
        
        if (suspension.variable_height) features.push({ icon: '📏', text: 'Altura Ajustável', class: 'bg-blue-600/20 text-blue-300 border border-blue-500/30' });
        if (suspension.automatic_adjustment) features.push({ icon: '🤖', text: 'Ajuste Automático', class: 'bg-green-600/20 text-green-300 border border-green-500/30' });
        if (suspension.high_speed_stability) features.push({ icon: '🏎️', text: 'Estabilidade Velocidade', class: 'bg-orange-600/20 text-orange-300 border border-orange-500/30' });
        if (suspension.internal_space_savings) features.push({ icon: '📦', text: 'Economia de Espaço', class: 'bg-purple-600/20 text-purple-300 border border-purple-500/30' });
        if (suspension.track_contact_bonus) features.push({ icon: '🛤️', text: 'Melhor Contato', class: 'bg-teal-600/20 text-teal-300 border border-teal-500/30' });
        if (suspension.maintenance_difficulty) features.push({ icon: '⚠️', text: 'Manutenção Difícil', class: 'bg-red-600/20 text-red-300 border border-red-500/30' });
        if (suspension.experimental) features.push({ icon: '🧪', text: 'Experimental', class: 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' });
        if (suspension.stabilization_bonus) features.push({ icon: '⚖️', text: 'Estabilização Extra', class: 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' });
        
        return features;
    }

    renderCrewInterface(currentCrewSize, currentTrainingLevel) {
        const crewRoles = { 2: ['Motorista', 'Gunner/Comandante'], 3: ['Motorista', 'Gunner', 'Comandante'], 4: ['Motorista', 'Gunner', 'Comandante', 'Carregador'], 5: ['Motorista', 'Gunner', 'Comandante', 'Carregador', 'Operador de Rádio'] };
        const trainingLevels = { rookie: { name: 'Recruta', desc: 'Custo baixo, menos eficiente' }, standard: { name: 'Padrão', desc: 'Treinamento equilibrado' }, veteran: { name: 'Veterano', desc: 'Experiente e mais confiável' }, elite: { name: 'Elite', desc: 'Máxima eficiência em combate' } };
        let html = '<div class="space-y-6">';
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">👥 Tamanho da Tripulação</h3>';
        html += `<div class="flex items-center justify-between"><span class="text-slate-300">Número de Tripulantes:</span><span class="text-2xl font-bold text-brand-400" id="crew-size-display">${currentCrewSize}</span></div>`;
        html += `<div class="relative"><input type="range" id="crew-size-slider" min="2" max="5" value="${currentCrewSize}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb" oninput="updateCrewSize(this.value)" /></div>`;
        html += '</div>';
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">🎖️ Nível de Treinamento</h3>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        Object.entries(trainingLevels).forEach(([key, level]) => {
            const isSelected = currentTrainingLevel === key;
            html += `<div class="component-card relative p-4 rounded-xl cursor-pointer ${isSelected ? 'selected bg-brand-900/30 border-brand-400' : 'bg-slate-700/30 border-slate-700/50'}" onclick="selectTrainingLevel('${key}')">
                <h4 class="font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${level.name}</h4>
                <p class="text-xs ${isSelected ? 'text-brand-200' : 'text-slate-400'}">${level.desc}</p>
                ${isSelected ? '<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
            </div>`;
        });
        html += '</div></div></div>';
        return html;
    }

    renderArmorInterface(thickness, materialId, angleId, additionalIds, materials, additionalArmors, angles) {
        let html = '<div class="space-y-6">';
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">🛡️ Blindagem Base</h3>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
        html += `<div><label class="block text-sm font-medium text-slate-300 mb-2">Material</label><select id="armor-material-select" class="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg" onchange="updateArmorMaterial(this.value)">${Object.entries(materials).map(([id, mat]) => `<option value="${id}" ${id === materialId ? 'selected' : ''}>${mat.name}</option>`).join('')}</select></div>`;
        html += `<div><label class="block text-sm font-medium text-slate-300 mb-2">Espessura</label><div class="flex items-center"><input type="range" id="armor-thickness-slider" min="20" max="300" value="${thickness}" class="w-full" oninput="updateArmorThickness(this.value)"><span class="ml-4 w-16 text-right font-bold text-brand-400">${thickness}mm</span></div></div>`;
        html += '</div></div>';
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">📐 Ângulo da Blindagem</h3>';
        html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">';
        Object.entries(angles).forEach(([id, angle]) => {
            const isSelected = id === angleId;
            html += `<div class="component-card text-center p-3 rounded-xl cursor-pointer ${isSelected ? 'selected bg-brand-900/30 border-brand-400' : 'bg-slate-800/40 border-slate-700/50'}" onclick="selectArmorAngle('${id}')">
                <div class="font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${angle.name}</div>
                <div class="text-xs text-slate-400">${angle.effectiveness_multiplier}x</div>
            </div>`;
        });
        html += '</div></div>';
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">🔧 Blindagens Adicionais</h3>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        Object.entries(additionalArmors).forEach(([id, armor]) => {
            const isSelected = additionalIds.includes(id);
            html += `<div class="component-card relative p-3 rounded-xl cursor-pointer ${isSelected ? 'selected bg-brand-900/30 border-brand-400' : 'bg-slate-800/40 border-slate-700/50'}" onclick="toggleAdditionalArmor('${id}')">
                <h5 class="font-medium text-sm ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${armor.name}</h5>
                <div class="text-xs text-slate-400">+${armor.protection_bonus}mm, ${armor.weight}kg</div>
                ${isSelected ? '<div class="absolute top-1 right-1 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
            </div>`;
        });
        html += '</div></div></div>';
        return html;
    }

    renderWeaponsInterface() {
        let html = '<div class="space-y-6">';
        
        // === CANHÃO PRINCIPAL ===
        html += this.renderMainGunSection();
        
        // === ARMAMENTO SECUNDÁRIO ===
        html += this.renderSecondaryWeaponsSection();
        
        // === DEFESA ANTIAÉREA ===
        html += this.renderAntiAircraftSection();
        
        // === RESUMO DE ARMAMENTOS ===
        html += this.renderWeaponsResume();
        
        html += '</div>';
        return html;
    }
    
    renderMainGunSection() {
        const chassis = window.currentVehicle?.chassis ? window.VEHICLE_COMPONENTS?.chassis?.[window.currentVehicle.chassis] : null;
        const minCal = chassis?.min_main_gun_caliber ?? 20;
        const maxCal = chassis?.max_main_gun_caliber ?? 180;
        let currentCaliber = window.currentVehicle?.main_gun_caliber || Math.max(37, minCal);
        
        if (currentCaliber < minCal) currentCaliber = minCal;
        if (currentCaliber > maxCal) currentCaliber = maxCal;
        window.currentVehicle.main_gun_caliber = currentCaliber;
        
        // Calculate gun length and penetration
        const currentLength = window.currentVehicle?.main_gun_length_ratio || 40; // L/40 default
        const penetration = this.calculateGunPenetration(currentCaliber, currentLength);
        const gunCost = this.calculateGunCost(currentCaliber, currentLength);
        
        let html = '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">';
        
        // Header with main gun icon
        html += '<div class="bg-gradient-to-r from-orange-600/20 to-red-600/20 border-b border-slate-700/50 p-4">';
        html += '<div class="flex items-center gap-3">';
        html += '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">';
        html += '<span class="text-white text-xl">🎯</span>';
        html += '</div>';
        html += '<h3 class="text-2xl font-bold text-slate-100">Canhão Principal</h3>';
        html += `<div id="main-gun-header-caliber" class="ml-auto text-3xl font-bold text-orange-400">${currentCaliber} mm</div>`;
        html += '</div>';
        html += '</div>';
        
        html += '<div class="p-6">';
        
        // Caliber and Length controls
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">';
        
        // Caliber slider
        html += '<div>';
        html += '<div class="flex items-center justify-between mb-3">';
        html += '<label class="text-sm font-medium text-slate-300">Comprimento do Cano</label>';
        html += '<div class="flex gap-2">';
        ['L/30', 'L/40', 'L/50', 'L/60', 'L/70'].forEach(length => {
            const lengthValue = parseInt(length.substring(2));
            const isSelected = currentLength === lengthValue;
            html += `<button onclick="updateMainGunLength(${lengthValue})" class="px-3 py-1 text-xs rounded-md font-medium transition-colors ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}">${length}</button>`;
        });
        html += '</div>';
        html += '</div>';
        
        // Caliber control
        html += '<div class="relative">';
        html += `<input type="range" id="main-gun-caliber-slider" min="${minCal}" max="${maxCal}" value="${currentCaliber}" class="w-full h-3 bg-slate-700/60 rounded-full appearance-none cursor-pointer slider-thumb" oninput="updateMainGunCaliber(this.value)" />`;
        html += '<div class="flex justify-between text-xs text-slate-400 mt-2">';
        html += `<span>${minCal}mm</span><span>${maxCal}mm</span>`;
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        // Ammunition type selection
        html += '<div>';
        html += '<label class="text-sm font-medium text-slate-300 mb-3 block">Tipo de Munição</label>';
        html += '<div class="flex gap-2 flex-wrap">';
        const ammoTypes = [
            { id: 'AP', name: 'AP', desc: 'Perfurante' },
            { id: 'HE', name: 'HE', desc: 'Alto Explosivo' },
            { id: 'APCR', name: 'APCR', desc: 'Núcleo Rígido' },
            { id: 'HEAT', name: 'HEAT', desc: 'Carga Oca' },
            { id: 'APDS', name: 'APDS', desc: 'Sabot Descartável' }
        ];
        const currentAmmo = window.currentVehicle?.main_gun_ammo || 'AP';
        ammoTypes.forEach(ammo => {
            const isSelected = currentAmmo === ammo.id;
            html += `<button onclick="updateMainGunAmmo('${ammo.id}')" class="px-4 py-2 text-sm rounded-lg font-medium transition-colors ${isSelected ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}">${ammo.name}</button>`;
        });
        html += '</div>';
        html += '</div>';
        
        html += '</div>';
        
        // Gun statistics panel
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">';
        
        html += '<div>';
        html += '<div class="text-xs text-slate-400 mb-1">Penetração estimada</div>';
        html += `<div class="text-xl font-bold text-slate-200" id="main-gun-penetration">${penetration} mm</div>`;
        html += '</div>';
        
        html += '<div>';
        html += '<div class="text-xs text-slate-400 mb-1">Custo do canhão</div>';
        html += `<div class="text-xl font-bold text-slate-200" id="main-gun-cost">$${gunCost}K</div>`;
        html += '</div>';
        
        html += '</div>';
        html += '</div>';
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    renderSecondaryWeaponsSection() {
        const secondaryWeapons = window.filterCompatibleComponents('secondary_weapons') || {};
        let html = '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">';
        
        // Header
        html += '<div class="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-slate-700/50 p-4">';
        html += '<div class="flex items-center gap-3">';
        html += '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">';
        html += '<span class="text-white text-xl">🔫</span>';
        html += '</div>';
        html += '<h3 class="text-2xl font-bold text-slate-100">Armamento Secundário</h3>';
        html += '</div>';
        html += '</div>';
        
        html += '<div class="p-6">';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        
        Object.entries(secondaryWeapons).forEach(([id, weapon]) => {
            const isSelected = window.currentVehicle?.secondary_weapons?.includes(id);
            const costK = Math.round(weapon.cost / 1000);
            
            html += `
            <div class="component-card relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isSelected ? 'selected bg-gradient-to-br from-brand-900/40 to-brand-800/30 border-2 border-brand-400 shadow-lg shadow-brand-500/20' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-slate-600/60'}" onclick="toggleSecondaryWeapon('${id}')">
                <div class="p-4">
                    <div class="flex items-start justify-between mb-3">
                        <h5 class="font-bold text-sm ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${weapon.name}</h5>
                        ${isSelected ? '<div class="w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
                    </div>
                    
                    <div class="grid grid-cols-3 gap-2 text-xs mb-3">
                        <div class="text-center">
                            <div class="text-blue-400 font-medium">${weapon.caliber}mm</div>
                            <div class="text-slate-400">Calibre</div>
                        </div>
                        <div class="text-center">
                            <div class="text-slate-300 font-medium">${weapon.rate_of_fire} tpm</div>
                            <div class="text-slate-400">Taxa de tiro</div>
                        </div>
                        <div class="text-center">
                            <div class="text-green-400 font-medium">$${costK}K</div>
                            <div class="text-slate-400">Custo</div>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        
        html += '</div>';
        html += '<div class="mt-4 text-xs text-slate-400">';
        html += 'Dica: clique para adicionar/remover. Múltiplas fixas comum ao DPS e ao custo.';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    renderAntiAircraftSection() {
        // Check if current chassis is SPAA type
        const currentVehicle = window.currentVehicle || {};
        const chassisInfo = currentVehicle?.chassis ? window.VEHICLE_COMPONENTS?.chassis?.[currentVehicle.chassis] : null;
        const isSpaa = chassisInfo?.category === "Anti-Aircraft";
        
        let html = '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">';
        
        // Header
        html += '<div class="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-b border-slate-700/50 p-4">';
        html += '<div class="flex items-center gap-3">';
        html += '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">';
        html += '<span class="text-white text-xl">🛡️</span>';
        html += '</div>';
        html += '<h3 class="text-2xl font-bold text-slate-100">Defesa Antiaérea</h3>';
        html += '</div>';
        html += '</div>';
        
        html += '<div class="p-6">';
        
        if (!isSpaa) {
            html += '<div class="text-center text-slate-400 py-8">';
            html += '<div class="text-4xl mb-2">⚠️</div>';
            html += '<div class="font-medium text-slate-300 mb-2">Apenas para chassis SPAA</div>';
            html += '<div class="text-sm">Armamentos antiaéreos só estão disponíveis para chassis<br/>especializados em defesa antiaérea (SPAA)</div>';
            html += '</div>';
        } else {
            const aaGuns = window.filterCompatibleComponents('aa_guns') || {};
            
            if (Object.keys(aaGuns).length === 0) {
                html += '<div class="text-center text-slate-400 py-8">';
                html += '<div class="text-4xl mb-2">🚫</div>';
                html += '<div>Nenhum armamento antiaéreo compatível com este chassi SPAA</div>';
                html += '</div>';
            } else {
            html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
            
            Object.entries(aaGuns).forEach(([id, gun]) => {
                const isSelected = window.currentVehicle?.aa_guns?.includes(id);
                const costK = Math.round(gun.cost / 1000);
                
                html += `
                <div class="component-card relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${isSelected ? 'selected bg-gradient-to-br from-brand-900/40 to-brand-800/30 border-2 border-brand-400 shadow-lg shadow-brand-500/20' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-slate-600/60'}" onclick="toggleAAGun('${id}')">
                    <div class="p-4">
                        <div class="flex items-start justify-between mb-3">
                            <h5 class="font-bold text-sm ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${gun.name}</h5>
                            ${isSelected ? '<div class="w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
                        </div>
                        
                        <div class="grid grid-cols-3 gap-2 text-xs mb-3">
                            <div class="text-center">
                                <div class="text-red-400 font-medium">${gun.caliber}mm</div>
                                <div class="text-slate-400">Calibre</div>
                            </div>
                            <div class="text-center">
                                <div class="text-slate-300 font-medium">${gun.rate_of_fire} tpm</div>
                                <div class="text-slate-400">Taxa de tiro</div>
                            </div>
                            <div class="text-center">
                                <div class="text-green-400 font-medium">$${costK}K</div>
                                <div class="text-slate-400">Custo</div>
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            
                html += '</div>';
                html += '<div class="mt-4 text-xs text-slate-400">';
                html += 'Seleção múltipla permitida.';
                html += '</div>';
            }
        }
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    renderWeaponsResume() {
        const currentVehicle = window.currentVehicle || {};
        const mainGunCaliber = currentVehicle.main_gun_caliber || 0;
        const mainGunLength = currentVehicle.main_gun_length_ratio || 40;
        const penetration = this.calculateGunPenetration(mainGunCaliber, mainGunLength);
        const secondaryCount = (currentVehicle.secondary_weapons || []).length;
        const aaCount = (currentVehicle.aa_guns || []).length;
        
        // Calculate costs
        const mainGunCost = this.calculateGunCost(mainGunCaliber, mainGunLength);
        const secondaryCost = this.calculateSecondaryCost(currentVehicle.secondary_weapons || []);
        const aaCost = this.calculateAACost(currentVehicle.aa_guns || []);
        const totalCost = mainGunCost + secondaryCost + aaCost;
        
        let html = '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">';
        
        // Header
        html += '<div class="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-slate-700/50 p-4">';
        html += '<div class="flex items-center gap-3">';
        html += '<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">';
        html += '<span class="text-white text-xl">📋</span>';
        html += '</div>';
        html += '<h3 class="text-2xl font-bold text-slate-100">Resumo</h3>';
        html += '</div>';
        html += '</div>';
        
        html += '<div class="p-6">';
        html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-4">';
        
        // Main gun summary
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">Calibre principal</div>';
        html += `<div id="summary-main-gun-caliber" class="text-2xl font-bold text-slate-200">${mainGunCaliber} mm</div>`;
        html += '</div>';
        
        // Penetration
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">Penetração</div>';
        html += `<div id="summary-penetration" class="text-2xl font-bold text-slate-200">${penetration} mm</div>`;
        html += '</div>';
        
        // Secondary weapons count
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">DPS Secundário</div>';
        html += `<div id="summary-secondary-dps" class="text-2xl font-bold text-slate-200">${secondaryCount}.0</div>`;
        html += '</div>';
        
        // AA count
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">DPS AA</div>';
        html += `<div id="summary-aa-dps" class="text-2xl font-bold text-slate-200">${aaCount}.0</div>`;
        html += '</div>';
        
        html += '</div>';
        
        // Cost breakdown
        html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">';
        
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">Custo Canhão</div>';
        html += `<div class="text-xl font-bold text-slate-200">$${mainGunCost}K</div>`;
        html += '</div>';
        
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">Custo Secundário</div>';
        html += `<div class="text-xl font-bold text-slate-200">$${secondaryCost}K</div>`;
        html += '</div>';
        
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">Custo AA</div>';
        html += `<div class="text-xl font-bold text-slate-200">$${aaCost}K</div>`;
        html += '</div>';
        
        html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30 text-center">';
        html += '<div class="text-xs text-slate-400 mb-1">CUSTO TOTAL</div>';
        html += `<div class="text-xl font-bold text-slate-200">$${totalCost}K</div>`;
        html += '</div>';
        
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    // Helper methods for weapon calculations
    calculateGunPenetration(caliber, length) {
        // Realistic 1954 penetration calculation - historically accurate for WWII/Cold War tanks
        const ammoType = window.currentVehicle?.ammo_view || 'AP';
        // More realistic formula based on actual WWII tank gun performance
        const basePenetration = (caliber * (length || 40)) / 25; // Much more realistic base
        
        const ammoMultipliers = {
            'AP': 1.0,     // Standard AP rounds
            'APCR': 1.4,   // Tungsten core, higher velocity
            'APDS': 1.8,   // Advanced sabot design
            'HEAT': 1.6,   // Chemical energy penetrator
            'HE': 0.15     // High explosive, minimal penetration
        };
        
        const penetration = Math.round(basePenetration * (ammoMultipliers[ammoType] || 1.0));
        console.log('TabLoader penetration calc:', caliber, 'mm L/' + length, ammoType, '=', penetration, 'mm');
        return penetration;
    }
    
    calculateGunCost(caliber, length) {
        const baseCost = Math.pow(caliber / 10, 2) * 2; // Quadratic cost increase
        const lengthFactor = 1 + (length - 30) * 0.02;
        return Math.round(baseCost * lengthFactor);
    }
    
    calculateSecondaryCost(secondaryWeapons) {
        if (!secondaryWeapons || secondaryWeapons.length === 0) return 0;
        let totalCost = 0;
        secondaryWeapons.forEach(weaponId => {
            const weapon = window.VEHICLE_COMPONENTS?.secondary_weapons?.[weaponId];
            if (weapon?.cost) totalCost += weapon.cost;
        });
        return Math.round(totalCost / 1000);
    }
    
    calculateAACost(aaGuns) {
        if (!aaGuns || aaGuns.length === 0) return 0;
        let totalCost = 0;
        aaGuns.forEach(gunId => {
            const gun = window.VEHICLE_COMPONENTS?.aa_guns?.[gunId];
            if (gun?.cost) totalCost += gun.cost;
        });
        return Math.round(totalCost / 1000);
    }

    renderSystemsInterface() {
        let html = '<div class="space-y-6">';
        html += this.renderSystemCategory('fire_control', '🎯 Sistema de Controle de Fogo', this.renderSystemCard);
        html += this.renderSystemCategory('optics_systems', '👁️ Sistemas Ópticos', this.renderSystemCard);
        html += this.renderSystemCategory('communication', '📡 Sistemas de Comunicação', this.renderSystemCard);
        html += '</div>';
        return html;
    }

    renderSystemCategory(componentType, title, renderFunction) {
        let categoryHtml = '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        categoryHtml += `<h3 class="text-lg font-semibold text-slate-100 mb-4">${title}</h3>`;
        const components = window.filterCompatibleComponents(componentType) || {};
        if (Object.keys(components).length > 0) {
            categoryHtml += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
            Object.entries(components).forEach(([id, component]) => {
                categoryHtml += renderFunction.call(this, id, component, componentType);
            });
            categoryHtml += '</div>';
        } else {
            categoryHtml += '<p class="text-slate-500 text-sm">Nenhum sistema compatível disponível.</p>';
        }
        categoryHtml += '</div>';
        return categoryHtml;
    }

    renderSystemCard(id, component, type) {
        const selectionKey = type === 'fire_control' ? 'fcs' : (type === 'optics_systems' ? 'optics' : 'communication');
        const isSelected = window.currentVehicle?.[selectionKey] === id;
        const fnMap = {
            fire_control: 'selectFireControl',
            optics_systems: 'selectOptics',
            communication: 'selectCommunication'
        };
        const onclickFn = fnMap[type] || 'selectCommunication';
        const onclickAction = `${onclickFn}('${id}')`;
        return `<div class="component-card relative p-3 rounded-xl cursor-pointer ${isSelected ? 'selected bg-brand-900/30 border-brand-400' : 'bg-slate-800/40 border-slate-700/50'}" onclick="${onclickAction}">
            <h5 class="font-medium text-sm ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${component.name}</h5>
            <div class="text-xs text-slate-400">Custo: $${(component.cost/1000).toFixed(0)}K</div>
            ${isSelected ? '<div class="absolute top-1 right-1 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
        </div>`;
    }

    renderEquipmentInterface() {
        const equipmentData = window.VEHICLE_COMPONENTS?.special_equipment || {};
        const currentSpecialEquipment = window.currentVehicle?.special_equipment || [];
        let html = '<div class="space-y-6">';
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">Equipamentos Especiais</h3>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        Object.entries(equipmentData).forEach(([id, eq]) => {
            const isSelected = currentSpecialEquipment.includes(id);
            html += `<div class="component-card relative p-3 rounded-xl cursor-pointer ${isSelected ? 'selected bg-brand-900/30 border-brand-400' : 'bg-slate-800/40 border-slate-700/50'}" onclick="toggleSpecialEquipment('${id}')">
                <h5 class="font-medium text-sm ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${eq.name}</h5>
                <div class="text-xs text-slate-400">${eq.weight}kg, $${(eq.cost/1000).toFixed(0)}K</div>
                ${isSelected ? '<div class="absolute top-1 right-1 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
            </div>`;
        });
        html += '</div></div></div>';
        return html;
    }
}

window.tabLoaders = new TabLoaders();

// Métodos auxiliares adicionais na classe
TabLoaders.prototype.calculateArmorEfficiency = function(thickness, materialId, angleId, additionalIds, materials, angles, additionalArmors) {
    try {
        const material = materials?.[materialId];
        const angle = angles?.[angleId];
        const additional = (additionalIds || []).map(id => additionalArmors?.[id]).filter(Boolean);

        let effectiveness = Number(thickness) || 0;
        if (material?.effectiveness_factor) effectiveness *= material.effectiveness_factor;
        if (angle?.effectiveness_multiplier) effectiveness *= angle.effectiveness_multiplier;
        additional.forEach(armor => {
            if (armor?.protection_bonus) {
                const vs = (armor.effectiveness_vs && armor.effectiveness_vs.ap) || 1.0;
                effectiveness += armor.protection_bonus * vs;
            }
        });

        const effectiveThickness = Math.round(effectiveness);

        // Rating e cor aproximados (compatível com js/data/components/additional_armor.js)
        let rating = 'Inadequada';
        let color = 'text-red-400';
        if (effectiveThickness >= 300) { rating = 'Excepcional'; color = 'text-purple-400'; }
        else if (effectiveThickness >= 200) { rating = 'Excelente'; color = 'text-green-400'; }
        else if (effectiveThickness >= 150) { rating = 'Boa'; color = 'text-blue-400'; }
        else if (effectiveThickness >= 100) { rating = 'Adequada'; color = 'text-yellow-400'; }
        else if (effectiveThickness >= 50) { rating = 'Fraca'; color = 'text-orange-400'; }

        // Penalidades resumidas
        const crewPenalty = angle?.crew_capacity_penalty || 0;
        const gunDepressionPenalty = angle?.gun_depression_penalty || 0;

        return `
            <div class="flex items-center justify-between">
                <div>
                    <div class="text-sm text-slate-300">Efetividade</div>
                    <div class="text-lg font-semibold ${color}">${effectiveThickness}mm (${rating})</div>
                </div>
                <div class="text-xs text-slate-400 text-right">
                    ${crewPenalty ? `- Tripulação: -${crewPenalty}` : ''}
                    ${gunDepressionPenalty ? `<br/>- Depressão canhão: -${gunDepressionPenalty}°` : ''}
                </div>
            </div>
        `;
    } catch (e) {
        console.error('Erro ao calcular eficiência de blindagem:', e);
        return '<div class="text-slate-400">Não foi possível calcular a eficiência</div>';
    }
};

// Nova interface visual de blindagem (cards e resumo)
TabLoaders.prototype.renderArmorInterfaceV2 = function(thickness, materialId, angleId, additionalIds, materials, additionalArmors, angles) {
    const hasChassis = !!(window.currentVehicle && window.currentVehicle.chassis);
    const chassis = hasChassis ? (window.getResolvedComponent ? window.getResolvedComponent('chassis', window.currentVehicle.chassis) : (window.VEHICLE_COMPONENTS?.chassis?.[window.currentVehicle.chassis])) : null;
    const maxArmor = chassis?.max_armor_thickness || 300;
    const minArmor = 20;
    const currentThickness = Math.min(Math.max(thickness, minArmor), maxArmor);
    
    let html = '<div class="space-y-6">';

    if (!hasChassis) {
        html += '<div class="border border-yellow-500/30 bg-yellow-500/10 text-yellow-300 text-sm rounded-lg px-4 py-3">Selecione um chassi primeiro para ver os limites de blindagem específicos.</div>';
    }

    // === SLIDER DE ESPESSURA MODERNIZADO ===
    html += '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">';
    html += '<div class="flex items-center gap-3 mb-6">';
    html += '<div class="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">';
    html += '<span class="text-blue-400">🛡️</span>';
    html += '</div>';
    html += '<h3 class="text-xl font-bold text-slate-100">Espessura da Blindagem</h3>';
    html += `<div id="armor-thickness-display" class="ml-auto text-3xl font-bold text-amber-400">${currentThickness} mm</div>`;
    html += '</div>';
    
    // Slider customizado moderno
    html += '<div class="relative">';
    html += `<input type="range" id="armor-thickness-slider" min="${minArmor}" max="${maxArmor}" value="${currentThickness}" class="armor-slider w-full h-3 bg-slate-700/60 rounded-full appearance-none cursor-pointer" oninput="updateArmorThickness(this.value)" />`;
    html += '<div class="flex justify-between text-xs text-slate-400 mt-2">';
    html += `<span>${minArmor}</span>`;
    html += `<span>${maxArmor}</span>`;
    html += '</div>';
    html += '</div>';
    html += '</div>';

    // === MATERIAL DA BLINDAGEM ===
    html += '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">';
    html += '<div class="flex items-center gap-3 mb-6">';
    html += '<div class="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center">';
    html += '<span class="text-orange-400">🧪</span>';
    html += '</div>';
    html += '<h3 class="text-xl font-bold text-slate-100">Material da Blindagem</h3>';
    html += '</div>';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    Object.entries(materials).forEach(([id, mat]) => {
        const isSelected = id === materialId;
        const effPct = Math.round((mat.effectiveness_factor || 1) * 100);
        const costFactor = mat.cost_factor || 1;
        const costPct = Math.round(costFactor * 100);
        html += `
        <div class="component-card relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'selected bg-gradient-to-br from-brand-900/40 to-brand-800/30 border-2 border-brand-400 shadow-lg shadow-brand-500/20' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-slate-600/60'}" onclick="updateArmorMaterial('${id}')">
            <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h4 class="font-bold text-base ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${mat.name}</h4>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="px-2 py-1 text-xs font-semibold rounded-md bg-blue-600/20 text-blue-300 border border-blue-500/30">
                                ${effPct}%
                            </span>
                        </div>
                    </div>
                    ${isSelected ? '<div class="w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
                </div>
                <div class="grid grid-cols-3 gap-2 text-xs text-slate-400">
                    <div class="text-center">
                        <div class="text-slate-300 font-medium">x${mat.effectiveness_factor || 1}</div>
                        <div>Efetividade</div>
                    </div>
                    <div class="text-center">
                        <div class="text-slate-300 font-medium">x${mat.weight_factor || 1}</div>
                        <div>Peso</div>
                    </div>
                    <div class="text-center">
                        <div class="font-medium ${costFactor > 2 ? 'text-red-400' : costFactor > 1.5 ? 'text-yellow-400' : 'text-green-400'}">x${costFactor}</div>
                        <div>Custo</div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    html += '</div></div>';

    // === ÂNGULO DA BLINDAGEM ===
    html += '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">';
    html += '<div class="flex items-center gap-3 mb-6">';
    html += '<div class="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">';
    html += '<span class="text-purple-400">📐</span>';
    html += '</div>';
    html += '<h3 class="text-xl font-bold text-slate-100">Ângulo da Blindagem</h3>';
    html += '</div>';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    Object.entries(angles).forEach(([id, angle]) => {
        const isSelected = id === angleId;
        const mult = angle.effectiveness_multiplier || 1;
        const multFormatted = `x${mult.toFixed(2)}`;
        const penalties = [];
        if (angle.gun_depression_penalty) penalties.push(`Depressão -${angle.gun_depression_penalty}°`);
        if (angle.crew_capacity_penalty) penalties.push(`Tripulação -${angle.crew_capacity_penalty}`);
        
        html += `
        <div class="component-card relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'selected bg-gradient-to-br from-brand-900/40 to-brand-800/30 border-2 border-brand-400 shadow-lg shadow-brand-500/20' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-slate-600/60'}" onclick="selectArmorAngle('${id}')">
            <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <h4 class="font-bold text-base ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${angle.name}</h4>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="px-2 py-1 text-xs font-semibold rounded-md bg-green-600/20 text-green-300 border border-green-500/30">
                                ${multFormatted}
                            </span>
                        </div>
                        ${angle.description ? `<p class="text-xs text-slate-400 mt-2">${angle.description}</p>` : ''}
                    </div>
                    ${isSelected ? '<div class="w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
                </div>
                ${penalties.length > 0 ? `
                <div class="border-t border-slate-700/40 pt-2 mt-2">
                    <div class="flex flex-wrap gap-1">
                        ${penalties.map(penalty => `<span class="px-2 py-1 text-xs rounded-md bg-amber-600/20 text-amber-300">⚠️ ${penalty}</span>`).join('')}
                    </div>
                </div>` : ''}
            </div>
        </div>`;
    });
    html += '</div></div>';

    // === BLINDAGENS ADICIONAIS ===
    html += '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">';
    html += '<div class="flex items-center gap-3 mb-6">';
    html += '<div class="w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center">';
    html += '<span class="text-green-400">🔧</span>';
    html += '</div>';
    html += '<h3 class="text-xl font-bold text-slate-100">Blindagens Adicionais</h3>';
    html += '</div>';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
    Object.entries(additionalArmors).forEach(([id, armor]) => {
        const isSelected = (additionalIds || []).includes(id);
        const cost = armor.cost || 0;
        const costK = cost >= 1000 ? `$${Math.round(cost/1000)}K` : `$${cost}`;
        html += `
        <div class="component-card relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 ${isSelected ? 'selected bg-gradient-to-br from-brand-900/40 to-brand-800/30 border-2 border-brand-400 shadow-lg shadow-brand-500/20' : 'bg-gradient-to-br from-slate-800/60 to-slate-900/40 border border-slate-700/50 hover:border-slate-600/60'}" onclick="toggleAdditionalArmor('${id}')">
            <div class="p-4">
                <div class="flex items-start justify-between mb-3">
                    <h5 class="font-bold text-sm ${isSelected ? 'text-brand-100' : 'text-slate-100'}">${armor.name}</h5>
                    ${isSelected ? '<div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>' : ''}
                </div>
                <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="text-center">
                        <div class="text-blue-400 font-medium">+${armor.protection_bonus}mm</div>
                        <div class="text-slate-400">Proteção</div>
                    </div>
                    <div class="text-center">
                        <div class="text-slate-300 font-medium">${armor.weight}kg</div>
                        <div class="text-slate-400">Peso</div>
                    </div>
                    <div class="text-center">
                        <div class="text-green-400 font-medium">${costK}</div>
                        <div class="text-slate-400">Custo</div>
                    </div>
                </div>
            </div>
        </div>`;
    });
    html += '</div></div>';

    // === RESUMO FINAL ===
    html += '<div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">';
    html += '<div class="flex items-center gap-3 mb-6">';
    html += '<div class="w-8 h-8 rounded-lg bg-cyan-600/20 flex items-center justify-center">';
    html += '<span class="text-cyan-400">📊</span>';
    html += '</div>';
    html += '<h3 class="text-xl font-bold text-slate-100">Resumo</h3>';
    html += '</div>';
    
    // Grid de resumo como na imagem
    html += '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">';
    
    // Espessura base
    html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">';
    html += '<div class="text-xs text-slate-400 mb-1">Espessura base</div>';
    html += `<div class="text-2xl font-bold text-slate-200" id="summary-base-thickness">${currentThickness} mm</div>`;
    html += '</div>';
    
    // Efetividade total
    html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">';
    html += '<div class="text-xs text-slate-400 mb-1">Efetividade total</div>';
    html += '<div class="text-2xl font-bold text-slate-200" id="summary-effectiveness">x1.00</div>';
    html += '</div>';
    
    // Espessura efetiva
    html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">';
    html += '<div class="text-xs text-slate-400 mb-1">Espessura efetiva</div>';
    html += `<div class="text-2xl font-bold text-slate-200" id="summary-effective-thickness">${currentThickness} mm</div>`;
    html += '</div>';
    
    // Material
    html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">';
    html += '<div class="text-xs text-slate-400 mb-1">Material</div>';
    html += '<div class="text-sm font-bold text-slate-200" id="summary-material">RHA</div>';
    html += '</div>';
    
    // Ângulo
    html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">';
    html += '<div class="text-xs text-slate-400 mb-1">Ângulo</div>';
    html += '<div class="text-sm font-bold text-slate-200" id="summary-angle">Vertical (90°)</div>';
    html += '</div>';
    
    // Peso relativo
    html += '<div class="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">';
    html += '<div class="text-xs text-slate-400 mb-1">Peso relativo</div>';
    html += '<div class="text-sm font-bold text-slate-200" id="summary-weight">x1.00</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';

    html += '</div>';
    
    // Agendar atualização do resumo após renderização
    setTimeout(() => {
        if (window.updateArmorEfficiency) {
            window.updateArmorEfficiency();
        }
    }, 100);
    
    return html;
};
