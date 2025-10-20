class AircraftCostSystem {

    static calculateCosts(aircraft) {
        if (!aircraft || !aircraft.airframe || !aircraft.engine) {
            return this.getDefaultCosts();
        }

        try {
            const breakdown = this.calculateCostBreakdown(aircraft);
            let productionCost = Object.values(breakdown).reduce((sum, cost) => sum + cost, 0);
            const maintenanceCost = this.calculateMaintenanceCost(aircraft, breakdown);
            const operationalCost = this.calculateOperationalCost(aircraft);

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
                efficiency_metrics: this.calculateCostEfficiency(aircraft, productionCost)
            };
        } catch (error) {
            console.error('🚨 Error in advanced aircraft cost calculation:', error);
            return this.getDefaultCosts();
        }
    }

    static calculateCostBreakdown(aircraft) {
        const airframe = window.AIRCRAFT_COMPONENTS.airframes[aircraft.airframe];
        const engine = window.AIRCRAFT_COMPONENTS.aircraft_engines[aircraft.engine];
        const wings = aircraft.wings || {};
        const avionics = aircraft.avionics || [];
        const weapons = aircraft.weapons || [];

        let airframeCost = (airframe.base_weight || 0) * 70; // $70/kg baseline
        if ((airframe.max_speed_kph || 0) >= 1200) airframeCost *= 1.8; // Supersonic multiplier
        if (airframe.tech_era === 'stealth') airframeCost *= 3.0; // Stealth multiplier

        let engineCost = 0;
        if (engine.type.includes('piston')) {
            engineCost = (engine.power_hp || 0) * 50; // $50/hp for pistons
        } else {
            engineCost = (engine.thrust || engine.military_thrust || 0) * 280;
        }
        if (engine.afterburner_thrust) engineCost *= 1.4;
        if (engine.type.includes('turbofan')) engineCost *= 1.6;
        if (engine.experimental) engineCost *= 2.2;

        const wingType = wings.type ? window.AIRCRAFT_COMPONENTS.wing_types[wings.type] : null;
        let wingsCost = (airframe.wing_area_m2 || 20) * 1500; // $1500/m² baseline
        if (wingType) wingsCost *= (wingType.cost_mod || 1.0);
        (wings.features || []).forEach(id => wingsCost += window.AIRCRAFT_COMPONENTS.wing_features[id]?.cost || 0);

        const avionicsCost = avionics.reduce((sum, id) => sum + (window.AIRCRAFT_COMPONENTS.avionics[id]?.cost || 0), 0);
        const weaponsCost = weapons.reduce((sum, id) => sum + (window.AIRCRAFT_COMPONENTS.aircraft_weapons[id]?.cost_base || 0), 0);

        const total = airframeCost + engineCost + wingsCost + avionicsCost + weaponsCost;
        const integrationCost = total * 0.15;

        return {
            airframe: Math.round(airframeCost),
            engine: Math.round(engineCost),
            wings: Math.round(wingsCost),
            avionics: Math.round(avionicsCost),
            weapons: Math.round(weaponsCost),
            integration: Math.round(integrationCost),
        };
    }

    static calculateMaintenanceCost(aircraft, breakdown) {
        const engine = window.AIRCRAFT_COMPONENTS.aircraft_engines[aircraft.engine];
        let maintenanceCost = (breakdown.airframe + breakdown.wings) * 0.03; // 3% of airframe/wing cost

        const maintenanceHours = engine.maintenance_hours || 50;
        const reliability = engine.reliability || 0.85;
        let costPerHour = 50;
        if (engine.type.includes('piston')) costPerHour = 30;
        if (engine.type.includes('turboprop')) costPerHour = 70;
        if (engine.type.includes('turbofan')) costPerHour = 120;
        if (engine.experimental) costPerHour *= 3;
        maintenanceCost += (maintenanceHours * costPerHour) * (1.6 - reliability);

        maintenanceCost += (breakdown.avionics + breakdown.weapons) * 0.05; // 5% for systems

        return Math.round(maintenanceCost);
    }

    static calculateOperationalCost(aircraft) {
        const engine = window.AIRCRAFT_COMPONENTS.aircraft_engines[aircraft.engine];
        const airframe = window.AIRCRAFT_COMPONENTS.airframes[aircraft.airframe];

        const fuelConsumption = engine.sfc_military || 1.0; // Use SFC for better accuracy
        const flightHoursPerYear = 250;
        const fuelPricePerKg = 1.5;
        const thrust_kgf = engine.military_thrust || engine.thrust || (engine.power_hp * 0.8);
        const fuelCost = fuelConsumption * thrust_kgf * flightHoursPerYear * fuelPricePerKg;

        const crewSize = airframe.crew || 1;
        const crewCost = crewSize * 50000; // $50k per crew member per year
        
        const munitionsCost = (aircraft.weapons || []).length * 5000; // $5k per weapon system for annual training

        return Math.round(fuelCost + crewCost + munitionsCost);
    }

    static calculateCostEfficiency(aircraft, productionCost) {
                let performance = {};
        try {
            performance = window.realisticPerformanceCalculator.calculateAircraftPerformance(aircraft);
        } catch (e) {
            console.error('Cost system failed to get performance data:', e);
            performance = { error: true }; // Evita que o resto da função quebre
        }
        if (!performance || performance.error) return { cost_per_ton: 0, bang_for_buck: 0 };

        const totalWeight = performance.totalWeight || 1;
        const performanceScore = (performance.maxSpeedKph || 0) + (performance.range || 0) / 5 + (performance.rateOfClimb || 0) / 10;
        
        return {
            cost_per_ton: Math.round(productionCost / (totalWeight / 1000)),
            bang_for_buck: Math.round((performanceScore * 100) / productionCost)
        };
    }

    static getDefaultCosts() {
        return {
            production: 0, maintenance: 0, operational: 0, total_ownership: 0,
            breakdown: {},
            efficiency_metrics: { cost_per_ton: 0, bang_for_buck: 0 }
        };
    }

    static renderCostDisplay(aircraft) {
        const costs = this.calculateCosts(aircraft || window.currentAircraft || {});
        const quantity = Number(aircraft?.quantity || (window.currentAircraft?.quantity) || 1) || 1;

        const formatK = (value) => isNaN(value) ? '0' : (value / 1000).toFixed(0);
        const formatM = (value) => isNaN(value) ? '0' : (value / 1000000).toFixed(1);

        let html = '<h3 class="text-xl font-semibold text-slate-100 mb-4">💰 Análise de Custos Avançada</h3>';

        html += `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                    <div class="text-green-300 text-sm font-medium">Custo de Produção</div>
                    <div class="text-green-100 text-2xl font-bold">$${formatK(costs.production)}K</div>
                </div>
                <div class="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                    <div class="text-yellow-300 text-sm font-medium">Manutenção Anual</div>
                    <div class="text-yellow-100 text-2xl font-bold">$${formatK(costs.maintenance)}K</div>
                </div>
                <div class="p-4 rounded-lg bg-orange-900/20 border border-orange-500/30">
                    <div class="text-orange-300 text-sm font-medium">Custo Operacional Anual</div>
                    <div class="text-orange-100 text-2xl font-bold">$${formatK(costs.operational)}K</div>
                </div>
            </div>
        `;

        html += `
            <div class="p-4 rounded-lg bg-red-900/20 border border-red-500/30 mb-6">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-red-300 font-medium">Custo Total de Propriedade (10 anos)</span>
                    <span class="text-red-100 font-bold text-lg">$${formatM(costs.total_ownership)}M</span>
                </div>
                <div class="text-xs text-red-300/70">
                    Compra ($${formatK(costs.production)}K) + Manutenção ($${formatK(costs.maintenance * 10)}K) + Operação ($${formatK(costs.operational * 10)}K)
                </div>
            </div>
        `;

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
                            <span class="font-medium text-slate-100">$${formatK(cost)}K (${percentage}%)</span>
                        </div>
                        <div class="h-2 bg-slate-700 rounded-full"><div class="h-2 bg-cyan-500 rounded-full" style="width: ${percentage}%"></div></div>
                    </div>
                `;
            }
        });
        html += '</div></div>';

        html += '<div><h4 class="text-slate-200 font-medium mb-3">📈 Métricas de Eficiência</h4><div class="space-y-3">';
        html += `<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Custo por Tonelada</span><span class="text-slate-100 font-semibold">$${(costs.efficiency_metrics.cost_per_ton || 0).toLocaleString()}</span></div>`;
        html += `<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Bang for Buck</span><span class="text-slate-100 font-semibold">${(costs.efficiency_metrics.bang_for_buck || 0).toLocaleString()} pts/$M</span></div>`;
        html += '</div></div>';

        html += '</div>';

        return html;
    }

    static formatComponentName(component) {
        const names = {
            airframe: 'Fuselagem',
            engine: 'Motor',
            wings: 'Asas',
            avionics: 'Aviônicos',
            weapons: 'Armamentos',
            integration: 'Integração e Sistemas'
        };
        return names[component] || component;
    }
}

window.AircraftCostSystem = AircraftCostSystem;