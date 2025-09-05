// js/utils/energySystem.js - Energy balance validation and calculation system

// Energy system utilities
class EnergySystem {
    
    static calculateEnergyProduction(vehicle) {
        // Use resolved component so tuning (by chassis class) is applied
        if (!vehicle?.engine || !window.VEHICLE_COMPONENTS?.engines) {
            return 0;
        }

        // Prefer the resolver (merges base+tuning). Fallback to raw.base.
        const resolved = (typeof window.getResolvedComponent === 'function')
            ? window.getResolvedComponent('engines', vehicle.engine)
            : null;
        const raw = window.VEHICLE_COMPONENTS.engines[vehicle.engine];

        const energyOutput = (
            (resolved && typeof resolved.energy_output === 'number') ? resolved.energy_output :
            (raw && raw.base && typeof raw.base.energy_output === 'number') ? raw.base.energy_output : 0
        );

        return Number.isFinite(energyOutput) ? energyOutput : 0;
    }
    
    static calculateEnergyConsumption(vehicle) {
        // If nothing relevante is selected, consumption should be 0
        const noChassis = !vehicle?.chassis;
        const noEngine = !vehicle?.engine;
        const noSystems = !vehicle?.fcs && !vehicle?.optics && !vehicle?.communication &&
                          !vehicle?.transmission && !vehicle?.suspension &&
                          !(vehicle?.specialEquipment && vehicle.specialEquipment.length) &&
                          !(vehicle?.special_equipment && vehicle.special_equipment.length) &&
                          !(vehicle?.additional_armor && vehicle.additional_armor.length);
        if (noChassis && noEngine && noSystems) {
            return 0;
        }

        let totalConsumption = 0;
        
        // Base vehicle systems — count only when there is any system/engine selected
        totalConsumption += 2;
        
        // Fire control systems
        if (vehicle?.fcs && window.VEHICLE_COMPONENTS?.fire_control) {
            const fcs = window.VEHICLE_COMPONENTS.fire_control[vehicle.fcs];
            totalConsumption += fcs?.energy_consumption || 0;
        }
        
        // Optics systems
        if (vehicle?.optics && window.VEHICLE_COMPONENTS?.optics_systems) {
            const optics = window.VEHICLE_COMPONENTS.optics_systems[vehicle.optics];
            totalConsumption += optics?.energy_consumption || 0;
        }
        
        // Communication systems
        if (vehicle?.communication && window.VEHICLE_COMPONENTS?.communication) {
            const comm = window.VEHICLE_COMPONENTS.communication[vehicle.communication];
            totalConsumption += comm?.energy_consumption || 0;
        }
        
        // Transmissions (automatic/electric/hydraulic systems)
        if (vehicle?.transmission && window.VEHICLE_COMPONENTS?.transmissions) {
            const transmission = window.VEHICLE_COMPONENTS.transmissions[vehicle.transmission];
            totalConsumption += transmission?.energy_consumption || 0;
        }
        
        // Suspensions (hydropneumatic/adaptive systems)
        if (vehicle?.suspension && window.VEHICLE_COMPONENTS?.suspensions) {
            const suspension = window.VEHICLE_COMPONENTS.suspensions[vehicle.suspension];
            totalConsumption += suspension?.energy_consumption || 0;
        }
        
        // AA guns fire control systems
        if (vehicle?.aa_guns && window.VEHICLE_COMPONENTS?.aa_guns && window.VEHICLE_COMPONENTS?.aa_fire_control) {
            vehicle.aa_guns.forEach(gunId => {
                // Check if gun has integrated fire control
                const gun = window.VEHICLE_COMPONENTS.aa_guns[gunId];
                if (gun?.fire_control) {
                    const fcs = window.VEHICLE_COMPONENTS.aa_fire_control[gun.fire_control];
                    totalConsumption += fcs?.energy_consumption || 0;
                }
            });
        }
        
        // Additional armor (reactive/active systems)
        if (vehicle?.additional_armor && window.VEHICLE_COMPONENTS?.additional_armor) {
            vehicle.additional_armor.forEach(armorId => {
                const armor = window.VEHICLE_COMPONENTS.additional_armor[armorId];
                totalConsumption += armor?.energy_consumption || 0;
            });
        }
        
        // Special equipment (can have multiple) - support both camelCase and snake_case
        const specialEquipList = vehicle?.specialEquipment || vehicle?.special_equipment || [];
        if (Array.isArray(specialEquipList) && window.VEHICLE_COMPONENTS?.special_equipment) {
            specialEquipList.forEach(equipId => {
                const equipment = window.VEHICLE_COMPONENTS.special_equipment[equipId];
                totalConsumption += equipment?.energy_consumption || 0;
            });
        }
        
        return totalConsumption;
    }
    
    static calculateEnergyBalance(vehicle) {
        const production = this.calculateEnergyProduction(vehicle);
        const consumption = this.calculateEnergyConsumption(vehicle);
        
        return {
            production,
            consumption,
            balance: production - consumption,
            efficiency: production > 0 ? (consumption / production) * 100 : 0,
            isValid: production >= consumption
        };
    }
    
    static validateEnergyBalance(vehicle) {
        const energy = this.calculateEnergyBalance(vehicle);
        
        if (!energy.isValid) {
            return {
                valid: false,
                message: `⚡ Consumo de energia excede a produção! (${energy.consumption}kW > ${energy.production}kW)`,
                shortfall: Math.abs(energy.balance)
            };
        }
        
        // Warning for high consumption (>90%)
        if (energy.efficiency > 90) {
            return {
                valid: true,
                warning: true,
                message: `⚠️ Alto consumo de energia (${energy.efficiency.toFixed(1)}%)`,
                efficiency: energy.efficiency
            };
        }
        
        return {
            valid: true,
            message: `✅ Energia balanceada (${energy.efficiency.toFixed(1)}% utilização)`,
            efficiency: energy.efficiency
        };
    }
    
    static getEnergyRecommendations(vehicle) {
        const energy = this.calculateEnergyBalance(vehicle);
        const recommendations = [];
        
        if (!energy.isValid) {
            recommendations.push({
                type: 'error',
                message: `Necessário motor com pelo menos ${energy.consumption}kW de saída`,
                priority: 'high'
            });
        } else if (energy.efficiency > 90) {
            recommendations.push({
                type: 'warning', 
                message: 'Considere motor mais potente para margem de segurança',
                priority: 'medium'
            });
        }
        
        if (energy.consumption > 20) {
            recommendations.push({
                type: 'info',
                message: 'Alto consumo pode afetar autonomia e confiabilidade',
                priority: 'low'
            });
        }
        
        return recommendations;
    }
    
    // UI Helper functions
    static renderEnergyDisplay(vehicle) {
        const energy = this.calculateEnergyBalance(vehicle);
        const validation = this.validateEnergyBalance(vehicle);
        
        let html = '<div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">';
        html += '<h3 class="text-lg font-semibold text-slate-100 mb-4">⚡ Sistema de Energia</h3>';
        
        // Energy bars
        html += '<div class="space-y-4">';
        
        // Production bar
        html += '<div>';
        html += '<div class="flex items-center justify-between text-sm mb-2">';
        html += '<span class="text-slate-300">Produção (Motor)</span>';
        html += `<span class="text-emerald-400 font-bold">${energy.production} kW</span>`;
        html += '</div>';
        html += '<div class="w-full bg-slate-700 rounded-full h-2">';
        const productionWidth = Math.min((energy.production / 50) * 100, 100);
        html += `<div class="bg-emerald-500 h-2 rounded-full transition-all duration-300" style="width: ${productionWidth}%"></div>`;
        html += '</div>';
        html += '</div>';
        
        // Consumption bar
        html += '<div>';
        html += '<div class="flex items-center justify-between text-sm mb-2">';
        html += '<span class="text-slate-300">Consumo (Sistemas)</span>';
        const consumptionColor = energy.isValid ? 'text-blue-400' : 'text-red-400';
        html += `<span class="${consumptionColor} font-bold">${energy.consumption} kW</span>`;
        html += '</div>';
        html += '<div class="w-full bg-slate-700 rounded-full h-2">';
        const consumptionWidth = Math.min((energy.consumption / 50) * 100, 100);
        const barColor = energy.isValid ? 'bg-blue-500' : 'bg-red-500';
        html += `<div class="${barColor} h-2 rounded-full transition-all duration-300" style="width: ${consumptionWidth}%"></div>`;
        html += '</div>';
        html += '</div>';
        
        // Balance display
        html += '<div class="flex items-center justify-between p-3 rounded-lg ' + 
                (energy.isValid ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-red-900/30 border border-red-500/30') + '">';
        html += `<span class="text-slate-200 font-medium">Balanço Energético</span>`;
        const balanceColor = energy.balance >= 0 ? 'text-emerald-400' : 'text-red-400';
        const balanceIcon = energy.balance >= 0 ? '+' : '';
        html += `<span class="${balanceColor} font-bold">${balanceIcon}${energy.balance} kW</span>`;
        html += '</div>';
        
        // Status message
        const messageColor = validation.valid ? (validation.warning ? 'text-amber-400' : 'text-emerald-400') : 'text-red-400';
        html += `<div class="${messageColor} text-sm text-center mt-2">${validation.message}</div>`;
        
        html += '</div></div>';
        
        return html;
    }
}

// Export for global use
window.EnergySystem = EnergySystem;

export default EnergySystem;
