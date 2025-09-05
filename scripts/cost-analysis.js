// Real-world tank production and maintenance cost analysis (1940s-1950s)
const fs = require('fs');
const path = require('path');

// Historical tank costs (adjusted to ~1950 USD, then inflated to modern equivalent)
const historicalTankCosts = {
    light_tanks: {
        examples: {
            "M3 Stuart": { production: 44000, crew: 4, year: 1941 },
            "T-70": { production: 35000, crew: 2, year: 1942 },
            "AMX-13": { production: 180000, crew: 3, year: 1952 }
        },
        target_range: [40000, 200000], // USD production cost
        maintenance_factor: 0.15 // 15% of production cost per year
    },
    medium_tanks: {
        examples: {
            "M4 Sherman": { production: 64000, crew: 5, year: 1942 },
            "T-34": { production: 45000, crew: 4, year: 1941 },
            "Pz.IV": { production: 103000, crew: 5, year: 1942 },
            "Panther": { production: 117000, crew: 5, year: 1943 },
            "Centurion": { production: 250000, crew: 4, year: 1945 }
        },
        target_range: [60000, 300000],
        maintenance_factor: 0.20 // 20% per year
    },
    heavy_tanks: {
        examples: {
            "Tiger I": { production: 250000, crew: 5, year: 1942 },
            "IS-3": { production: 180000, crew: 4, year: 1944 },
            "Tiger II": { production: 321000, crew: 5, year: 1944 },
            "M103": { production: 400000, crew: 5, year: 1953 }
        },
        target_range: [200000, 500000],
        maintenance_factor: 0.25 // 25% per year
    },
    superheavy_tanks: {
        examples: {
            "Maus": { production: 800000, crew: 6, year: 1944 },
            "E-100": { production: 750000, crew: 6, year: 1945 },
            "T95": { production: 500000, crew: 8, year: 1945 }
        },
        target_range: [500000, 1000000],
        maintenance_factor: 0.35 // 35% per year - very expensive
    }
};

// Cost breakdown typical percentages
const costBreakdown = {
    materials: 0.40,        // 40% - Steel, armor, raw materials
    manufacturing: 0.25,    // 25% - Labor, factory overhead
    engine_drivetrain: 0.15, // 15% - Engine, transmission, suspension
    weapons_electronics: 0.10, // 10% - Guns, fire control, communications
    profit_overhead: 0.10   // 10% - Company profit, R&D amortization
};

// Component cost multipliers based on complexity and technology level
const componentCostFactors = {
    chassis: {
        light: 1.0,
        medium: 2.2,
        heavy: 4.5,
        super_heavy: 8.5
    },
    engines: {
        power_factor: 45, // ~$45 per horsepower in 1950s money
        complexity_multiplier: {
            gasoline: 1.0,
            diesel: 1.3,        // Diesel more expensive
            experimental: 2.5   // Experimental tech
        }
    },
    transmissions: {
        manual: 1.0,
        semi_auto: 1.8,
        automatic: 2.5,
        experimental: 4.0
    },
    armor: {
        base_cost_per_kg: 8, // $8 per kg of armor in 1950s
        material_multiplier: {
            mild_steel: 1.0,
            rha: 1.4,
            face_hardened: 1.8,
            cast_steel: 1.2,
            composite: 3.0
        }
    },
    weapons: {
        cost_per_caliber_mm: 180, // $180 per mm of caliber
        fire_control_multiplier: {
            optical: 1.0,
            mechanical: 2.2,
            radar: 8.5,
            electronic: 15.0
        }
    }
};

// Maintenance cost factors
const maintenanceCosts = {
    base_factors: {
        light: 0.12,      // 12% of production cost per year
        medium: 0.18,     // 18% per year  
        heavy: 0.25,      // 25% per year
        super_heavy: 0.35 // 35% per year
    },
    complexity_multipliers: {
        engine: {
            gasoline: 1.0,
            diesel: 0.8,        // Diesel more reliable
            experimental: 2.5
        },
        transmission: {
            manual: 1.0,
            automatic: 1.6,
            experimental: 3.0
        },
        electronics: {
            none: 1.0,
            basic: 1.3,
            advanced: 2.2,
            experimental: 4.5
        }
    },
    operational_factors: {
        fuel_consumption_multiplier: 0.15, // Fuel is 15% of operating cost
        crew_cost_per_person_year: 12000,  // $12k per crew member per year
        ammo_cost_factor: 0.05             // 5% of vehicle cost in ammo per year
    }
};

console.log('💰 Historical Tank Cost Analysis (1940s-1950s)\n');
console.log('===============================================\n');

Object.entries(historicalTankCosts).forEach(([category, data]) => {
    console.log(`${category.toUpperCase().replace('_', ' ')}:`);
    console.log(`Production Range: $${data.target_range[0]/1000}K - $${data.target_range[1]/1000}K`);
    console.log(`Maintenance: ${(data.maintenance_factor * 100).toFixed(0)}% of production cost per year`);
    console.log('Historical Examples:');
    Object.entries(data.examples).forEach(([tank, cost]) => {
        const maintenance = Math.round(cost.production * data.maintenance_factor);
        console.log(`  - ${tank} (${cost.year}): $${(cost.production/1000).toFixed(0)}K prod + $${(maintenance/1000).toFixed(0)}K/year maint`);
    });
    console.log('');
});

console.log('📊 Cost Breakdown Structure:');
Object.entries(costBreakdown).forEach(([component, percentage]) => {
    console.log(`  ${component.replace('_', ' ')}: ${(percentage * 100).toFixed(0)}%`);
});

function calculateRecommendedCosts() {
    console.log('\n🎯 Recommended Component Costs:\n');
    
    // Chassis costs
    console.log('CHASSIS BASE COSTS:');
    Object.entries(componentCostFactors.chassis).forEach(([type, multiplier]) => {
        const baseCost = 50000; // Base light chassis cost
        const cost = baseCost * multiplier;
        console.log(`  ${type.replace('_', ' ')}: $${(cost/1000).toFixed(0)}K`);
    });
    
    // Engine costs
    console.log('\nENGINE COSTS (examples):');
    [180, 450, 820, 1200].forEach(power => {
        const cost = power * componentCostFactors.engines.power_factor;
        console.log(`  ${power}hp engine: ~$${(cost/1000).toFixed(0)}K`);
    });
    
    // Armor costs  
    console.log('\nARMOR COSTS (per 1000kg):');
    Object.entries(componentCostFactors.armor.material_multiplier).forEach(([material, mult]) => {
        const cost = 1000 * componentCostFactors.armor.base_cost_per_kg * mult;
        console.log(`  ${material.replace('_', ' ')}: $${(cost/1000).toFixed(0)}K per ton`);
    });
}

calculateRecommendedCosts();

module.exports = { 
    historicalTankCosts, 
    costBreakdown, 
    componentCostFactors, 
    maintenanceCosts 
};