// js/components/tabLoaders.js - Funções de carregamento de abas
// Extraído do HTML original e otimizado para o sistema modular

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
            tabContent.innerHTML = `<div class="text-center text-slate-400">${message}</div>`;
        }
    }

    loadChassisTab() {
        if (!window.VEHICLE_COMPONENTS || !window.VEHICLE_COMPONENTS.chassis) {
            this.showLoadingState();
            return;
        }
        
        const chassisComponents = window.VEHICLE_COMPONENTS.chassis;
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        
        Object.entries(chassisComponents).forEach(([id, chassis]) => {
            const compatibility = window.checkComponentCompatibility ? 
                window.checkComponentCompatibility('chassis', id) : { compatible: true };
            const compatClass = compatibility.compatible ? '' : 'incompatible';
            const isSelected = window.currentVehicle && window.currentVehicle.chassis === id;
            const costLevel = chassis.base_cost > 120000 ? 'high' : 
                chassis.base_cost > 80000 ? 'medium' : 'low';
            const techLevel = chassis.tech_requirement && chassis.tech_requirement.level > 70 ? 'advanced' : 
                chassis.tech_requirement && chassis.tech_requirement.level > 50 ? 'standard' : 'basic';
            const reliabilityLevel = chassis.reliability > 0.85 ? 'excellent' : 
                chassis.reliability > 0.7 ? 'good' : 'fair';
            
            html += this.renderChassisCard(id, chassis, {
                compatClass,
                isSelected,
                costLevel,
                techLevel,
                reliabilityLevel,
                compatibility
            });
        });
        
        tabContent.innerHTML = html + '</div>';
    }

    renderChassisCard(id, chassis, options) {
        const { compatClass, isSelected, costLevel, techLevel, reliabilityLevel, compatibility } = options;
        
        let cardHtml = `<div class="component-card ${compatClass}`;
        cardHtml += isSelected ? ' selected bg-brand-900/30 border-brand-400 shadow-brand-500/20 shadow-lg' : 
            ' bg-slate-800/40 border-slate-700/50';
        cardHtml += ` rounded-xl p-4 cursor-pointer hover:border-brand-500/60 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-200" onclick="selectChassis('${id}')" data-tooltip="${compatibility.reason || 'Compatível'}">`;
        
        // Header
        cardHtml += '<div class="flex items-start justify-between mb-3">';
        cardHtml += `<h4 class="font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-100'} text-base">${chassis.name}</h4>`;
        
        if (chassis.tech_requirement && chassis.tech_requirement.level) {
            const techClass = techLevel === 'advanced' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                techLevel === 'standard' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-slate-600/50 text-slate-400';
            cardHtml += `<span class="text-xs px-2 py-1 rounded font-medium ${techClass}">${chassis.tech_requirement.level}% tech</span>`;
        }
        
        cardHtml += '</div>';
        
        // Stats
        cardHtml += '<div class="grid grid-cols-2 gap-2 text-xs text-slate-400">';
        cardHtml += '<div class="space-y-1">';
        cardHtml += `<div><span class="text-slate-500">Peso:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${(chassis.base_weight/1000).toFixed(1)}t</span></div>`;
        cardHtml += `<div><span class="text-slate-500">Vel Máx:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${chassis.base_speed}km/h</span></div>`;
        cardHtml += '</div>';
        cardHtml += '<div class="space-y-1">';
        
        const costColor = costLevel === 'high' ? 'text-red-400' : 
            costLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400';
        cardHtml += `<div><span class="text-slate-500">Custo:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium ${costColor}">$${(chassis.base_cost/1000).toFixed(0)}K</span></div>`;
        
        if (chassis.max_armor_thickness) {
            cardHtml += `<div><span class="text-slate-500">Blindagem:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${chassis.max_armor_thickness}mm</span></div>`;
        }
        
        cardHtml += '</div>';
        cardHtml += '</div>';
        
        // Reliability bar
        if (chassis.reliability) {
            cardHtml += `<div class="mt-3 pt-2 border-t ${isSelected ? 'border-brand-700/50' : 'border-slate-700/50'}">`;
            cardHtml += '<div class="flex justify-between items-center text-xs">';
            cardHtml += '<span class="text-slate-500">Confiabilidade</span>';
            cardHtml += '<div class="flex items-center gap-2">';
            cardHtml += '<div class="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">';
            
            const reliabilityColor = reliabilityLevel === 'excellent' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                reliabilityLevel === 'good' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                'bg-gradient-to-r from-amber-500 to-amber-400';
            cardHtml += `<div class="h-full rounded-full ${reliabilityColor}" style="width: ${chassis.reliability * 100}%"></div>`;
            cardHtml += '</div>';
            
            const reliabilityTextColor = reliabilityLevel === 'excellent' ? 'text-emerald-400' :
                reliabilityLevel === 'good' ? 'text-blue-400' : 'text-amber-400';
            cardHtml += `<span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium ${reliabilityTextColor}">${Math.round(chassis.reliability * 100)}%</span>`;
            cardHtml += '</div>';
            cardHtml += '</div>';
            cardHtml += '</div>';
        }
        
        // Selected indicator
        if (isSelected) {
            cardHtml += '<div class="absolute top-2 right-2"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
        }
        
        // Incompatibility warning
        if (!compatibility.compatible) {
            cardHtml += '<div class="absolute top-2 left-2"><div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div></div>';
            cardHtml += `<div class="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-300">${compatibility.reason}</div>`;
        }
        
        cardHtml += '</div>';
        return cardHtml;
    }

    loadEngineTab() {
        if (!window.VEHICLE_COMPONENTS || !window.VEHICLE_COMPONENTS.engines) {
            this.showLoadingState();
            return;
        }
        
        const engines = window.filterCompatibleComponents ? 
            window.filterCompatibleComponents('engines') : window.VEHICLE_COMPONENTS.engines;
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        
        Object.entries(engines).forEach(([id, engine]) => {
            const compatibility = window.checkComponentCompatibility ? 
                window.checkComponentCompatibility('engines', id) : { compatible: true };
            const compatClass = compatibility.compatible ? '' : 'incompatible';
            const isSelected = window.currentVehicle && window.currentVehicle.engine === id;
            
            html += this.renderEngineCard(id, engine, {
                compatClass,
                isSelected,
                compatibility
            });
        });
        
        tabContent.innerHTML = html + '</div>';
    }

    renderEngineCard(id, engine, options) {
        const { compatClass, isSelected, compatibility } = options;
        
        let cardClass = 'component-card ' + compatClass;
        if (isSelected) {
            cardClass += ' selected bg-brand-900/30 border-brand-400 shadow-brand-500/20 shadow-lg';
        } else if (compatibility.compatible) {
            cardClass += ' bg-slate-800/40 border-slate-700/50';
        } else {
            cardClass += ' bg-red-900/20 border-red-500/50';
        }
        
        const tooltipText = compatibility.reason || 'Compatível';
        const techText = (engine.tech_requirement && engine.tech_requirement.level || 50) + '% tech';
        
        let cardHtml = `<div class="${cardClass} rounded-xl p-4 cursor-pointer hover:border-brand-500/60 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-200" onclick="selectEngine('${id}')" data-tooltip="${tooltipText}">`;
        cardHtml += '<div class="flex items-start justify-between mb-3">';
        cardHtml += `<h4 class="font-semibold text-slate-100 text-base">${engine.name}</h4>`;
        cardHtml += `<span class="text-xs px-2 py-1 rounded font-medium">${techText}</span>`;
        cardHtml += '</div>';
        cardHtml += '<div class="grid grid-cols-2 gap-2 text-xs text-slate-400">';
        cardHtml += '<div class="space-y-1">';
        cardHtml += `<div><span class="text-slate-500">Potência:</span> <span class="text-slate-300 font-medium">${engine.power}hp</span></div>`;
        cardHtml += `<div><span class="text-slate-500">Peso:</span> <span class="text-slate-300 font-medium">${engine.weight}kg</span></div>`;
        cardHtml += '</div>';
        cardHtml += '<div class="space-y-1">';
        cardHtml += `<div><span class="text-slate-500">Custo:</span> <span class="text-slate-300 font-medium">$${(engine.cost/1000).toFixed(0)}K</span></div>`;
        cardHtml += `<div><span class="text-slate-500">Consumo:</span> <span class="text-slate-300 font-medium">${engine.consumption}L/h</span></div>`;
        cardHtml += '</div>';
        cardHtml += '</div>';
        cardHtml += '<div class="mt-3 pt-2 border-t border-slate-700/50">';
        cardHtml += '<div class="flex justify-between items-center text-xs">';
        cardHtml += '<span class="text-slate-500">Confiabilidade</span>';
        cardHtml += '<div class="flex items-center gap-2">';
        cardHtml += '<div class="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">';
        cardHtml += `<div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400" style="width: ${engine.reliability * 100}%"></div>`;
        cardHtml += '</div>';
        cardHtml += `<span class="font-medium">${Math.round(engine.reliability * 100)}%</span>`;
        cardHtml += '</div>';
        cardHtml += '</div>';
        cardHtml += '</div>';
        
        if (isSelected) {
            cardHtml += '<div class="absolute top-2 right-2"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
        }
        if (!compatibility.compatible) {
            cardHtml += '<div class="absolute top-2 left-2"><div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div></div>';
            cardHtml += `<div class="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-300">${compatibility.reason}</div>`;
        }
        cardHtml += '</div>';
        
        return cardHtml;
    }

    loadTransmissionTab() {
        if (!window.VEHICLE_COMPONENTS || !window.VEHICLE_COMPONENTS.transmissions) {
            this.showLoadingState();
            return;
        }
        
        const transmissions = window.filterCompatibleComponents ? 
            window.filterCompatibleComponents('transmissions') : window.VEHICLE_COMPONENTS.transmissions;
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        
        Object.entries(transmissions).forEach(([id, transmission]) => {
            const compatibility = window.checkComponentCompatibility ? 
                window.checkComponentCompatibility('transmissions', id) : { compatible: true };
            const compatClass = compatibility.compatible ? '' : 'incompatible';
            const isSelected = window.currentVehicle && window.currentVehicle.transmission === id;
            
            html += this.renderTransmissionCard(id, transmission, {
                compatClass,
                isSelected,
                compatibility
            });
        });
        
        tabContent.innerHTML = html + '</div>';
    }

    renderTransmissionCard(id, transmission, options) {
        const { compatClass, isSelected, compatibility } = options;
        
        let cardClass = 'component-card ' + compatClass;
        if (isSelected) {
            cardClass += ' selected bg-brand-900/30 border-brand-400 shadow-brand-500/20 shadow-lg';
        } else {
            cardClass += ' bg-slate-800/40 border-slate-700/50';
        }
        
        // Determine transmission type color and icon
        const typeInfo = this.getTransmissionTypeInfo(transmission.type);
        const gearDisplay = transmission.gears === "infinite" ? "∞" : 
                           transmission.gears === "variable" ? "VAR" : transmission.gears;
        
        const tooltipText = compatibility.reason || 'Compatível';
        const techText = (transmission.tech_requirement?.level || 50) + '% tech';
        
        let cardHtml = `<div class="${cardClass} rounded-xl p-4 cursor-pointer hover:border-brand-500/60 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-200" onclick="selectTransmission('${id}')" data-tooltip="${tooltipText}">`;
        
        // Header with type badge
        cardHtml += '<div class="flex items-start justify-between mb-3">';
        cardHtml += `<h4 class="font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-100'} text-base">${transmission.name}</h4>`;
        cardHtml += `<div class="flex gap-2">`;
        cardHtml += `<span class="text-xs px-2 py-1 rounded font-medium ${typeInfo.badgeClass}">${typeInfo.icon} ${typeInfo.name}</span>`;
        cardHtml += `</div>`;
        cardHtml += '</div>';
        
        // Main stats
        cardHtml += '<div class="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">';
        cardHtml += '<div class="space-y-1">';
        cardHtml += `<div><span class="text-slate-500">Marchas:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${gearDisplay}</span></div>`;
        cardHtml += `<div><span class="text-slate-500">Peso:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${transmission.weight}kg</span></div>`;
        if (transmission.shift_time) {
            cardHtml += `<div><span class="text-slate-500">Troca:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${transmission.shift_time}s</span></div>`;
        }
        cardHtml += '</div>';
        cardHtml += '<div class="space-y-1">';
        cardHtml += `<div><span class="text-slate-500">Custo:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">$${(transmission.cost/1000).toFixed(0)}K</span></div>`;
        cardHtml += `<div><span class="text-slate-500">Eficiência:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${Math.round(transmission.efficiency * 100)}%</span></div>`;
        if (transmission.max_speed_road) {
            cardHtml += `<div><span class="text-slate-500">Vel Máx:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${transmission.max_speed_road}km/h</span></div>`;
        }
        cardHtml += '</div>';
        cardHtml += '</div>';
        
        // Special features
        const features = this.getTransmissionFeatures(transmission);
        if (features.length > 0) {
            cardHtml += '<div class="flex flex-wrap gap-1 mb-3">';
            features.forEach(feature => {
                cardHtml += `<span class="text-xs px-2 py-1 rounded ${feature.class}">${feature.text}</span>`;
            });
            cardHtml += '</div>';
        }
        
        // Reliability and complexity bars
        cardHtml += `<div class="mt-3 pt-2 border-t ${isSelected ? 'border-brand-700/50' : 'border-slate-700/50'}">`;
        cardHtml += '<div class="space-y-2">';
        
        // Reliability bar
        cardHtml += '<div class="flex justify-between items-center text-xs">';
        cardHtml += '<span class="text-slate-500">Confiabilidade</span>';
        cardHtml += '<div class="flex items-center gap-2">';
        cardHtml += '<div class="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">';
        const reliabilityColor = transmission.reliability > 0.9 ? 'bg-emerald-500' : 
                                transmission.reliability > 0.8 ? 'bg-blue-500' : 'bg-amber-500';
        cardHtml += `<div class="h-full rounded-full ${reliabilityColor}" style="width: ${transmission.reliability * 100}%"></div>`;
        cardHtml += '</div>';
        cardHtml += `<span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${Math.round(transmission.reliability * 100)}%</span>`;
        cardHtml += '</div>';
        cardHtml += '</div>';
        
        // Complexity indicator
        const complexityLevel = transmission.maintenance_complexity > 1.5 ? 'Alta' :
                               transmission.maintenance_complexity > 0.8 ? 'Média' : 'Baixa';
        const complexityColor = transmission.maintenance_complexity > 1.5 ? 'text-red-400' :
                               transmission.maintenance_complexity > 0.8 ? 'text-amber-400' : 'text-emerald-400';
        cardHtml += '<div class="flex justify-between items-center text-xs">';
        cardHtml += '<span class="text-slate-500">Manutenção</span>';
        cardHtml += `<span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium ${complexityColor}">${complexityLevel}</span>`;
        cardHtml += '</div>';
        
        cardHtml += '</div>';
        cardHtml += '</div>';
        
        // Historical note tooltip
        if (transmission.historical_note) {
            cardHtml += `<div class="mt-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300" title="${transmission.historical_note}">`;
            cardHtml += `📚 ${transmission.historical_note.substring(0, 50)}...`;
            cardHtml += '</div>';
        }
        
        // Special indicators
        if (isSelected) {
            cardHtml += '<div class="absolute top-2 right-2"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
        }
        if (transmission.prototype_only) {
            cardHtml += '<div class="absolute top-2 left-2"><div class="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">P</div></div>';
        }
        if (!compatibility.compatible) {
            cardHtml += '<div class="absolute top-2 left-2"><div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div></div>';
            cardHtml += `<div class="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-300">${compatibility.reason}</div>`;
        }
        
        cardHtml += '</div>';
        return cardHtml;
    }

    getTransmissionTypeInfo(type) {
        const typeMap = {
            manual: { name: 'Manual', icon: '🔧', badgeClass: 'bg-slate-600/50 text-slate-300' },
            semi_auto: { name: 'Semi-Auto', icon: '⚙️', badgeClass: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
            automatic: { name: 'Automática', icon: '🤖', badgeClass: 'bg-green-500/20 text-green-300 border border-green-500/30' },
            planetary: { name: 'Planetário', icon: '🌍', badgeClass: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
            cvt: { name: 'CVT', icon: '♾️', badgeClass: 'bg-orange-500/20 text-orange-300 border border-orange-500/30' },
            electric: { name: 'Elétrica', icon: '⚡', badgeClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' },
            hydrostatic: { name: 'Hidrostática', icon: '💧', badgeClass: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' }
        };
        return typeMap[type] || { name: type, icon: '❓', badgeClass: 'bg-slate-600/50 text-slate-300' };
    }

    getTransmissionFeatures(transmission) {
        const features = [];
        
        if (transmission.torque_converter) {
            features.push({ text: 'Conversor Torque', class: 'bg-green-500/15 text-green-300' });
        }
        if (transmission.synchromesh) {
            features.push({ text: 'Sincronizada', class: 'bg-blue-500/15 text-blue-300' });
        }
        if (transmission.pre_selection) {
            features.push({ text: 'Pré-Seleção', class: 'bg-purple-500/15 text-purple-300' });
        }
        if (transmission.pivot_turn) {
            features.push({ text: 'Giro Pivô', class: 'bg-orange-500/15 text-orange-300' });
        }
        if (transmission.hydraulic_assist) {
            features.push({ text: 'Assist. Hidráulica', class: 'bg-cyan-500/15 text-cyan-300' });
        }
        if (transmission.continuously_variable) {
            features.push({ text: 'Variação Contínua', class: 'bg-pink-500/15 text-pink-300' });
        }
        if (transmission.instant_torque) {
            features.push({ text: 'Torque Instantâneo', class: 'bg-yellow-500/15 text-yellow-300' });
        }
        if (transmission.silent_operation) {
            features.push({ text: 'Operação Silenciosa', class: 'bg-gray-500/15 text-gray-300' });
        }
        if (transmission.fuel_economy_bonus && transmission.fuel_economy_bonus > 0) {
            features.push({ text: `+${(transmission.fuel_economy_bonus * 100).toFixed(0)}% Economia`, class: 'bg-emerald-500/15 text-emerald-300' });
        }
        if (transmission.acceleration_bonus && transmission.acceleration_bonus > 0) {
            features.push({ text: `+${(transmission.acceleration_bonus * 100).toFixed(0)}% Aceleração`, class: 'bg-red-500/15 text-red-300' });
        }
        
        return features;
    }

    loadSuspensionTab() {
        if (!window.VEHICLE_COMPONENTS || !window.VEHICLE_COMPONENTS.suspensions) {
            this.showLoadingState();
            return;
        }
        
        const suspensions = window.filterCompatibleComponents ? 
            window.filterCompatibleComponents('suspensions') : window.VEHICLE_COMPONENTS.suspensions;
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        
        Object.entries(suspensions).forEach(([id, suspension]) => {
            const compatibility = window.checkComponentCompatibility ? 
                window.checkComponentCompatibility('suspensions', id) : { compatible: true };
            const compatClass = compatibility.compatible ? '' : 'incompatible';
            const isSelected = window.currentVehicle && window.currentVehicle.suspension === id;
            
            html += this.renderSuspensionCard(id, suspension, {
                compatClass,
                isSelected,
                compatibility
            });
        });
        
        tabContent.innerHTML = html + '</div>';
    }

    renderSuspensionCard(id, suspension, options) {
        const { compatClass, isSelected, compatibility } = options;
        
        let cardHtml = `<div class="component-card ${compatClass}`;
        cardHtml += isSelected ? ' selected bg-brand-900/30 border-brand-400 shadow-brand-500/20 shadow-lg' : 
            ' bg-slate-800/40 border-slate-700/50';
        cardHtml += ` rounded-xl p-4 cursor-pointer hover:border-brand-500/60 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-200" onclick="selectSuspension('${id}')" data-tooltip="${compatibility.reason || 'Compatível'}">`;
        cardHtml += '<div class="flex items-start justify-between mb-3">';
        cardHtml += `<h4 class="font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-100'} text-base">${suspension.name}</h4>`;
        cardHtml += '</div>';
        cardHtml += '<div class="grid grid-cols-2 gap-2 text-xs text-slate-400">';
        cardHtml += '<div class="space-y-1">';
        cardHtml += `<div><span class="text-slate-500">Tipo:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${suspension.type}</span></div>`;
        cardHtml += `<div><span class="text-slate-500">Peso:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${suspension.weight}kg</span></div>`;
        cardHtml += '</div>';
        cardHtml += '<div class="space-y-1">';
        cardHtml += `<div><span class="text-slate-500">Custo:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">$${(suspension.cost/1000).toFixed(0)}K</span></div>`;
        cardHtml += `<div><span class="text-slate-500">Conforto:</span> <span class="${isSelected ? 'text-brand-200' : 'text-slate-300'} font-medium">${Math.round(suspension.comfort * 100)}%</span></div>`;
        cardHtml += '</div>';
        cardHtml += '</div>';
        
        if (isSelected) {
            cardHtml += '<div class="absolute top-2 right-2"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
        }
        if (!compatibility.compatible) {
            cardHtml += '<div class="absolute top-2 left-2"><div class="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">!</div></div>';
            cardHtml += `<div class="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-300">${compatibility.reason}</div>`;
        }
        cardHtml += '</div>';
        
        return cardHtml;
    }

    loadCrewTab() {
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        const currentCrewSize = window.currentVehicle && window.currentVehicle.crewSize || 3;
        const currentTrainingLevel = window.currentVehicle && window.currentVehicle.trainingLevel || 'standard';
        
        tabContent.innerHTML = this.renderCrewInterface(currentCrewSize, currentTrainingLevel);
    }

    renderCrewInterface(currentCrewSize, currentTrainingLevel) {
        const crewRoles = {
            2: ['Motorista', 'Gunner/Comandante'],
            3: ['Motorista', 'Gunner', 'Comandante'],
            4: ['Motorista', 'Gunner', 'Comandante', 'Carregador'],
            5: ['Motorista', 'Gunner', 'Comandante', 'Carregador', 'Operador de Rádio']
        };
        
        const trainingLevels = {
            rookie: { name: 'Recruta', costMultiplier: 0.7, reliabilityBonus: -0.15, description: 'Treinamento básico, custo baixo mas menos eficiente' },
            standard: { name: 'Padrão', costMultiplier: 1.0, reliabilityBonus: 0, description: 'Treinamento militar padrão, equilibrado' },
            veteran: { name: 'Veterano', costMultiplier: 1.5, reliabilityBonus: 0.1, description: 'Experiência em combate, mais confiável' },
            elite: { name: 'Elite', costMultiplier: 2.2, reliabilityBonus: 0.2, description: 'Treinamento especializado, máxima eficiência' }
        };
        
        let html = '<div class="space-y-6">';
        
        // Crew Size Selection
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">👥 Tamanho da Tripulação</h3>';
        html += '<div class="space-y-4">';
        html += '<div class="flex items-center justify-between">';
        html += '<span class="text-slate-300">Número de Tripulantes:</span>';
        html += `<span class="text-2xl font-bold text-brand-400" id="crew-size-display">${currentCrewSize}</span>`;
        html += '</div>';
        html += '<div class="relative">';
        html += `<input type="range" id="crew-size-slider" min="2" max="5" value="${currentCrewSize}" class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-thumb" oninput="updateCrewSize(this.value)" />`;
        html += '<div class="flex justify-between text-xs text-slate-400 mt-1">';
        html += '<span>2</span><span>3</span><span>4</span><span>5</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        // Crew Roles
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">🎯 Funções da Tripulação</h3>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" id="crew-roles">';
        
        if (crewRoles[currentCrewSize]) {
            crewRoles[currentCrewSize].forEach((role, index) => {
                html += '<div class="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">';
                html += `<div class="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center text-brand-300 text-sm font-semibold">${index + 1}</div>`;
                html += `<span class="text-slate-200 font-medium">${role}</span>`;
                html += '</div>';
            });
        }
        
        html += '</div>';
        html += '</div>';

        // Training Level Selection
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">🎖️ Nível de Treinamento</h3>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
        
        Object.entries(trainingLevels).forEach(([key, level]) => {
            const isSelected = currentTrainingLevel === key;
            const cardClass = isSelected ? 
                'bg-brand-900/30 border-brand-400 shadow-brand-500/20 shadow-lg' : 
                'bg-slate-700/30 border-slate-700/50 hover:border-slate-600';
            
            html += `<div class="component-card ${cardClass} rounded-xl p-4 cursor-pointer transition-all duration-200" onclick="selectTrainingLevel('${key}')">`;
            html += `<h4 class="font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-100'} mb-2">${level.name}</h4>`;
            html += `<p class="text-xs ${isSelected ? 'text-brand-200' : 'text-slate-400'} mb-3">${level.description}</p>`;
            html += '<div class="flex justify-between items-center text-xs">';
            html += `<span class="text-slate-500">Multiplicador de Custo:</span>`;
            html += `<span class="${isSelected ? 'text-brand-300' : 'text-slate-300'} font-medium">${level.costMultiplier}x</span>`;
            html += '</div>';
            html += '<div class="flex justify-between items-center text-xs mt-1">';
            html += `<span class="text-slate-500">Bônus de Confiabilidade:</span>`;
            html += `<span class="${isSelected ? 'text-brand-300' : 'text-slate-300'} font-medium">${level.reliabilityBonus >= 0 ? '+' : ''}${(level.reliabilityBonus * 100).toFixed(0)}%</span>`;
            html += '</div>';
            
            if (isSelected) {
                html += '<div class="absolute top-2 right-2"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
            }
            html += '</div>';
        });
        
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        return html;
    }

    loadArmorTab() {
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        // Verificar se os dados de blindagem estão disponíveis
        if (!window.VEHICLE_COMPONENTS || !window.VEHICLE_COMPONENTS.armor_materials) {
            this.showLoadingState('Carregando sistema de blindagem...');
            return;
        }

        const currentVehicle = window.currentVehicle || {};
        const armorMaterials = window.VEHICLE_COMPONENTS.armor_materials;
        const additionalArmor = window.VEHICLE_COMPONENTS.additional_armor;
        const armorAngles = window.VEHICLE_COMPONENTS.armor_angles;
        
        // Estados atuais
        const currentThickness = currentVehicle.armorThickness || 80;
        const currentMaterial = currentVehicle.armorMaterial || 'rolled_homogeneous_armor';
        const currentAngle = currentVehicle.armorAngle || 'vertical_90';
        const currentAdditional = currentVehicle.additionalArmor || [];

        tabContent.innerHTML = this.renderArmorInterface(
            currentThickness, 
            currentMaterial, 
            currentAngle, 
            currentAdditional,
            armorMaterials,
            additionalArmor,
            armorAngles
        );
    }

    renderArmorInterface(thickness, material, angle, additional, materials, additionalArmors, angles) {
        let html = '<div class="space-y-6">';

        // === SEÇÃO BLINDAGEM BASE ===
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">🛡️ Blindagem Base</h3>';
        
        // Material e espessura
        html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
        
        // Seletor de material
        html += '<div>';
        html += '<label class="block text-sm font-medium text-slate-300 mb-2">Material da Blindagem</label>';
        html += '<select id="armor-material-select" class="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-brand-500 transition-colors" onchange="updateArmorMaterial(this.value)">';
        Object.entries(materials).forEach(([id, mat]) => {
            const selected = id === material ? 'selected' : '';
            const techText = mat.tech_requirement ? `(${mat.tech_requirement.level}% tech, ${mat.tech_requirement.year})` : '';
            html += `<option value="${id}" ${selected}>${mat.name} ${techText}</option>`;
        });
        html += '</select>';
        html += '</div>';

        // Slider de espessura
        html += '<div>';
        html += '<label class="block text-sm font-medium text-slate-300 mb-2">Espessura Base</label>';
        html += '<div class="space-y-2">';
        html += '<div class="flex items-center justify-between">';
        html += '<span class="text-slate-400 text-sm">Espessura:</span>';
        html += `<span class="text-xl font-bold text-brand-400" id="armor-thickness-display">${thickness}mm</span>`;
        html += '</div>';
        html += `<input type="range" id="armor-thickness-slider" min="20" max="300" value="${thickness}" class="w-full h-3 bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer armor-slider" oninput="updateArmorThickness(this.value)" />`;
        html += '<div class="flex justify-between text-xs text-slate-400">';
        html += '<span>20mm</span><span>160mm</span><span>300mm</span>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';

        // === SEÇÃO ÂNGULO DE BLINDAGEM ===
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">📐 Ângulo da Blindagem</h3>';
        html += '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        
        Object.entries(angles).forEach(([id, angleData]) => {
            const isSelected = id === angle;
            const cardClass = isSelected ? 
                'component-card selected bg-brand-900/30 border-brand-400 shadow-brand-500/20 shadow-lg' :
                'component-card bg-slate-800/40 border-slate-700/50 hover:border-brand-500/60';
            
            html += `<div class="${cardClass} rounded-xl p-4 cursor-pointer transition-all duration-200" onclick="selectArmorAngle('${id}')">`;
            html += `<h4 class="font-semibold ${isSelected ? 'text-brand-100' : 'text-slate-100'} text-sm mb-2">${angleData.name}</h4>`;
            html += '<div class="space-y-1 text-xs">';
            html += `<div><span class="text-slate-500">Multiplicador:</span> <span class="text-green-300 font-medium">${angleData.effectiveness_multiplier}x</span></div>`;
            
            if (angleData.crew_capacity_penalty > 0) {
                html += `<div><span class="text-slate-500">Tripulação:</span> <span class="text-red-400 font-medium">-${angleData.crew_capacity_penalty}</span></div>`;
            }
            if (angleData.gun_depression_penalty > 0) {
                html += `<div><span class="text-slate-500">Depressão Canhão:</span> <span class="text-orange-400 font-medium">-${angleData.gun_depression_penalty}°</span></div>`;
            }
            if (angleData.visibility_penalty > 0) {
                html += `<div><span class="text-slate-500">Visibilidade:</span> <span class="text-yellow-400 font-medium">-${Math.round(angleData.visibility_penalty*100)}%</span></div>`;
            }
            html += '</div>';
            
            if (isSelected) {
                html += '<div class="absolute top-2 right-2"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
            }
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';

        // === SEÇÃO BLINDAGENS ADICIONAIS ===
        html += '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">🔧 Blindagens Adicionais</h3>';
        
        // Organizar por categorias
        const categories = {
            improvised: { name: '🏗️ Improvisadas', items: [] },
            welded_addition: { name: '🔨 Soldadas', items: [] },
            salvaged_armor: { name: '🎖️ Históricas', items: [] },
            reactive_armor: { name: '💥 Reativas (ERA)', items: [] },
            composite_armor: { name: '🧪 Compostas', items: [] },
            standoff_armor: { name: '🕸️ Especiais', items: [] }
        };

        Object.entries(additionalArmors).forEach(([id, armor]) => {
            const category = armor.type || 'improvised';
            if (categories[category]) {
                categories[category].items.push([id, armor]);
            }
        });

        // Renderizar categorias
        Object.entries(categories).forEach(([catId, category]) => {
            if (category.items.length === 0) return;
            
            html += `<div class="mb-6">`;
            html += `<h4 class="text-md font-medium text-slate-200 mb-3">${category.name}</h4>`;
            html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">`;
            
            category.items.forEach(([id, armor]) => {
                const isSelected = additional.includes(id);
                const cardClass = isSelected ? 
                    'component-card selected bg-brand-900/30 border-brand-400' :
                    'component-card bg-slate-700/30 border-slate-600/50 hover:border-slate-500';
                
                html += `<div class="${cardClass} rounded-lg p-3 cursor-pointer transition-all duration-200" onclick="toggleAdditionalArmor('${id}')">`;
                html += `<h5 class="font-medium ${isSelected ? 'text-brand-100' : 'text-slate-100'} text-sm mb-2">${armor.name}</h5>`;
                
                // Badges de tipo
                html += '<div class="flex flex-wrap gap-1 mb-2">';
                if (armor.experimental) {
                    html += '<span class="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded">Experimental</span>';
                }
                if (armor.historical) {
                    html += '<span class="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded">Histórica</span>';
                }
                if (armor.prototype_only) {
                    html += '<span class="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">Protótipo</span>';
                }
                html += '</div>';
                
                // Estatísticas
                html += '<div class="space-y-1 text-xs">';
                html += `<div><span class="text-slate-500">Proteção:</span> <span class="text-green-300 font-medium">+${armor.protection_bonus}mm</span></div>`;
                html += `<div><span class="text-slate-500">Peso:</span> <span class="text-slate-300 font-medium">${armor.weight}kg</span></div>`;
                html += `<div><span class="text-slate-500">Custo:</span> <span class="text-slate-300 font-medium">$${(armor.cost/1000).toFixed(0)}K</span></div>`;
                html += '</div>';
                
                // Efetividade vs tipos de munição
                if (armor.effectiveness_vs) {
                    html += '<div class="mt-2 pt-2 border-t border-slate-600">';
                    html += '<div class="flex justify-between text-xs">';
                    html += `<span class="text-slate-500">vs AP:</span><span class="text-slate-300">${Math.round(armor.effectiveness_vs.ap*100)}%</span>`;
                    html += `<span class="text-slate-500">vs HE:</span><span class="text-slate-300">${Math.round(armor.effectiveness_vs.he*100)}%</span>`;
                    html += `<span class="text-slate-500">vs HEAT:</span><span class="text-slate-300">${Math.round(armor.effectiveness_vs.heat*100)}%</span>`;
                    html += '</div>';
                    html += '</div>';
                }
                
                if (isSelected) {
                    html += '<div class="absolute top-1 right-1"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
                }
                html += '</div>';
            });
            html += '</div>';
            html += '</div>';
        });
        html += '</div>';

        // === RESUMO DE EFICIÊNCIA ===
        html += '<div class="bg-slate-900/60 border border-slate-600/50 rounded-xl p-6">';
        html += '<h3 class="text-xl font-semibold text-slate-100 mb-4">📊 Eficiência da Blindagem</h3>';
        html += '<div id="armor-efficiency-summary">';
        html += this.calculateArmorEfficiency(thickness, material, angle, additional, materials, angles, additionalArmors);
        html += '</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    calculateArmorEfficiency(thickness, materialId, angleId, additionalIds, materials, angles, additionalArmors) {
        const material = materials[materialId];
        const angle = angles[angleId];
        const additional = additionalIds.map(id => additionalArmors[id]).filter(Boolean);
        
        // Calcular espessura efetiva
        let effectiveness = thickness;
        
        // Aplicar fator do material
        if (material?.effectiveness_factor) {
            effectiveness *= material.effectiveness_factor;
        }
        
        // Aplicar multiplicador do ângulo
        if (angle?.effectiveness_multiplier) {
            effectiveness *= angle.effectiveness_multiplier;
        }
        
        // Adicionar blindagens adicionais
        additional.forEach(armor => {
            if (armor?.protection_bonus) {
                effectiveness += armor.protection_bonus * (armor.effectiveness_vs?.ap || 1.0);
            }
        });
        
        const effectiveThickness = Math.round(effectiveness);
        
        // Determinar classificação
        let rating, color;
        if (effectiveThickness >= 300) { rating = "Excepcional"; color = "text-purple-400"; }
        else if (effectiveThickness >= 200) { rating = "Excelente"; color = "text-green-400"; }
        else if (effectiveThickness >= 150) { rating = "Boa"; color = "text-blue-400"; }
        else if (effectiveThickness >= 100) { rating = "Adequada"; color = "text-yellow-400"; }
        else if (effectiveThickness >= 50) { rating = "Fraca"; color = "text-orange-400"; }
        else { rating = "Inadequada"; color = "text-red-400"; }
        
        // Calcular penalidades
        let crewPenalty = 0, weightPenalty = 0, mobilityPenalty = 0, costMultiplier = 1.0;
        
        if (angle) {
            crewPenalty += angle.crew_capacity_penalty || 0;
            weightPenalty += ((angle.weight_distribution || 1.0) - 1.0) * thickness;
            if (angle.cost_multiplier) costMultiplier *= angle.cost_multiplier;
        }
        
        additional.forEach(armor => {
            weightPenalty += (armor.weight || 0) / 1000;
            mobilityPenalty += armor.mobility_penalty || 0;
        });
        
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
        
        // Coluna esquerda - Eficiência
        html += '<div>';
        html += '<div class="text-center mb-4">';
        html += `<div class="text-4xl font-bold ${color} mb-2">${effectiveThickness}mm</div>`;
        html += `<div class="text-lg ${color} font-medium">${rating}</div>`;
        html += '<div class="text-sm text-slate-400">Espessura Efetiva</div>';
        html += '</div>';
        
        // Barra visual de eficiência
        html += '<div class="mb-4">';
        html += '<div class="w-full bg-slate-700 rounded-full h-3 overflow-hidden">';
        const percentage = Math.min(100, (effectiveThickness / 300) * 100);
        const barColor = effectiveThickness >= 200 ? 'bg-green-500' : 
                        effectiveThickness >= 150 ? 'bg-blue-500' :
                        effectiveThickness >= 100 ? 'bg-yellow-500' :
                        effectiveThickness >= 50 ? 'bg-orange-500' : 'bg-red-500';
        html += `<div class="${barColor} h-full transition-all duration-500" style="width: ${percentage}%"></div>`;
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        // Coluna direita - Penalidades
        html += '<div>';
        html += '<h4 class="font-medium text-slate-200 mb-3">⚠️ Impactos no Veículo</h4>';
        html += '<div class="space-y-2 text-sm">';
        
        if (crewPenalty > 0) {
            html += `<div class="flex justify-between"><span class="text-red-400">Capacidade Tripulação:</span><span class="text-red-400 font-medium">-${crewPenalty}</span></div>`;
        }
        
        if (weightPenalty > 0.1) {
            html += `<div class="flex justify-between"><span class="text-orange-400">Peso Extra:</span><span class="text-orange-400 font-medium">+${weightPenalty.toFixed(1)}t</span></div>`;
        }
        
        if (mobilityPenalty > 0) {
            html += `<div class="flex justify-between"><span class="text-yellow-400">Mobilidade:</span><span class="text-yellow-400 font-medium">-${Math.round(mobilityPenalty*100)}%</span></div>`;
        }
        
        if (costMultiplier > 1.0) {
            html += `<div class="flex justify-between"><span class="text-cyan-400">Multiplicador Custo:</span><span class="text-cyan-400 font-medium">${costMultiplier.toFixed(1)}x</span></div>`;
        }
        
        if (crewPenalty === 0 && weightPenalty < 0.1 && mobilityPenalty === 0 && costMultiplier <= 1.0) {
            html += '<div class="text-green-400 text-center">✅ Sem penalidades significativas</div>';
        }
        
        html += '</div>';
        html += '</div>';
        html += '</div>';
        
        return html;
    }

    loadWeaponsTab() {
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        tabContent.innerHTML = '<div class="text-center py-8"><p class="text-slate-400">Sistema de armamento será implementado em breve...</p></div>';
    }

    loadSystemsTab() {
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        tabContent.innerHTML = '<div class="text-center py-8"><p class="text-slate-400">Sistemas avançados serão implementados em breve...</p></div>';
    }

    loadEquipmentTab() {
        const tabContent = this.getTabContent();
        if (!tabContent) return;

        tabContent.innerHTML = '<div class="text-center py-8"><p class="text-slate-400">Equipamentos adicionais serão implementados em breve...</p></div>';
    }
}

// Instância global para compatibilidade
window.tabLoaders = new TabLoaders();

// Override Equipamentos tab to render full catalog and add toggle handler
window.tabLoaders.loadEquipmentTab = function () {
  const tabContent = this.getTabContent();
  if (!tabContent) return;
  const equipmentData = window.VEHICLE_COMPONENTS?.special_equipment || {};
  const currentSpecialEquipment = window.currentVehicle?.specialEquipment || [];

  let html = '';
  html += '<div class="flex items-center justify-between mb-4">';
  html += '  <h3 class="text-lg font-semibold text-slate-100">Equipamentos Especiais</h3>';
  html += '  <div class="text-sm text-slate-400">Selecionados: <span id="equipment-selected-count" class="text-slate-200">' + currentSpecialEquipment.length + '</span></div>';
  html += '</div>';

  const categories = {
    survivability: { name: 'Sobrevivência', items: [] },
    detection: { name: 'Observação & Detecção', items: [] },
    mobility: { name: 'Mobilidade & Engenharia', items: [] },
    camouflage: { name: 'Camuflagem & Ocultação', items: [] },
    ew: { name: 'Guerra Eletrônica', items: [] },
    comfort: { name: 'Conforto da Tripulação', items: [] },
    maintenance: { name: 'Manutenção & Logística', items: [] },
    other: { name: 'Outros', items: [] }
  };

  Object.entries(equipmentData).forEach(([id, eq]) => {
    let cat = 'other';
    if (eq.crew_survival_bonus || eq.explosion_resistance || eq.fire_suppression_bonus) cat = 'survivability';
    else if (eq.visibility_bonus || eq.blind_spot_reduction || eq.night_combat_bonus || eq.detection_range) cat = 'detection';
    else if (eq.range_bonus || eq.water_crossing_depth || eq.mine_clearance_capability || eq.earthwork_capability) cat = 'mobility';
    else if (eq.concealment_bonus || eq.smoke_deployment_range || eq.continuous_smoke) cat = 'camouflage';
    else if (eq.enemy_communication_disruption || eq.radar_warning) cat = 'ew';
    else if (eq.crew_endurance_bonus || eq.cold_weather_performance || eq.crew_comfort_bonus) cat = 'comfort';
    else if (eq.field_repair_capability || eq.preventive_maintenance_bonus || eq.reliability_bonus || eq.maintenance_time_reduction) cat = 'maintenance';
    const n = (eq.name || '').toLowerCase();
    if (cat === 'other') {
      if (n.includes('spall') || n.includes('armazenamento') || n.includes('supress')) cat = 'survivability';
      else if (n.includes('cúpula') || n.includes('perisc') || n.includes('holofote')) cat = 'detection';
      else if (n.includes('vadeamento') || n.includes('rolo') || n.includes('dozer') || n.includes('tanques')) cat = 'mobility';
      else if (n.includes('camuflag') || n.includes('fuma')) cat = 'camouflage';
      else if (n.includes('jammer') || n.includes('radar')) cat = 'ew';
      else if (n.includes('ventila') || n.includes('aquec') || n.includes('assento')) cat = 'comfort';
      else if (n.includes('reparo') || n.includes('peças') || n.includes('diagn')) cat = 'maintenance';
    }
    categories[cat].items.push([id, eq]);
  });

  html += '<div class="space-y-6">';
  Object.entries(categories).forEach(([key, cat]) => {
    if (cat.items.length === 0) return;
    html += '<div class="mb-2">';
    html += '  <h4 class="text-md font-medium text-slate-200 mb-3">' + cat.name + '</h4>';
    html += '  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">';
    cat.items.forEach(([id, eq]) => {
      const isSelected = currentSpecialEquipment.includes(id);
      html += '<div class="relative ' + (isSelected ? 'selected bg-brand-900/30 border-brand-400' : 'bg-slate-700/30 border-slate-600/50') + ' border rounded-lg p-3 cursor-pointer hover:border-brand-500/60 transition-all duration-200" onclick="window.tabLoaders.toggleSpecialEquipment(\'' + id + '\')">';
      html += '  <div class="flex items-start justify-between mb-1">';
      html += '    <h5 class="font-medium text-sm ' + (isSelected ? 'text-brand-100' : 'text-slate-100') + '\">' + (eq.name || id) + '</h5>';
      html += '    <span class="text-xs bg-slate-600/50 text-slate-300 px-1 py-0.5 rounded">' + (eq.weight || 0) + 'kg</span>';
      html += '  </div>';
      html += '  <div class="text-xs text-slate-400">';
      html += '    <div><span class="text-slate-500">Custo:</span> <span class="text-slate-300">$' + (eq.cost || 0).toLocaleString() + '</span></div>';
      if (eq.tech_requirement) {
        const lvl = eq.tech_requirement.level || 0;
        html += '    <div class="mt-1"><span class="text-slate-500">Requisito:</span> <span class="text-slate-300">' + (eq.tech_requirement.year || '—') + ' · ' + lvl + '%</span></div>';
      }
      if (eq.experimental) {
        html += '    <div class="text-purple-400 mt-1">Experimental</div>';
      }
      html += '  </div>';
      if (isSelected) {
        html += '  <div class="absolute top-1 right-1"><div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div></div>';
      }
      html += '</div>';
    });
    html += '  </div>';
    html += '</div>';
  });
  html += '</div>';

  tabContent.innerHTML = html;
};

window.tabLoaders.toggleSpecialEquipment = function (equipmentId) {
  if (!window.currentVehicle) return;
  if (!window.currentVehicle.specialEquipment) window.currentVehicle.specialEquipment = [];
  const idx = window.currentVehicle.specialEquipment.indexOf(equipmentId);
  if (idx > -1) window.currentVehicle.specialEquipment.splice(idx, 1);
  else window.currentVehicle.specialEquipment.push(equipmentId);

  try {
    window.currentVehicle.special_equipment = Array.from(window.currentVehicle.specialEquipment);
  } catch (e) {
    window.currentVehicle.special_equipment = window.currentVehicle.specialEquipment.slice();
  }

  const countEl = document.getElementById('equipment-selected-count');
  if (countEl) countEl.textContent = window.currentVehicle.specialEquipment.length;

  const card = document.querySelector(`[onclick="window.tabLoaders.toggleSpecialEquipment('${equipmentId}')"]`);
  if (card) {
    const selected = window.currentVehicle.specialEquipment.includes(equipmentId);
    if (selected) {
      card.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
      card.classList.remove('bg-slate-700/30', 'border-slate-600/50');
      if (!card.querySelector('.animate-pulse')) {
        const indicator = document.createElement('div');
        indicator.className = 'absolute top-1 right-1';
        indicator.innerHTML = '<div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>';
        card.appendChild(indicator);
      }
    } else {
      card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
      card.classList.add('bg-slate-700/30', 'border-slate-600/50');
      const indicator = card.querySelector('.animate-pulse');
      if (indicator) indicator.parentElement.remove();
    }
  }

  if (window.updateVehicleCalculations) window.updateVehicleCalculations();
};
