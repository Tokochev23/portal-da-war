// Weight analysis and correction script for realistic tank masses
const fs = require('fs');
const path = require('path');

// Real-world tank weights for reference (1940s-1950s)
const realTankWeights = {
    light_tanks: {
        // 10-20 tons
        examples: {
            "M3 Stuart": 12700, // kg
            "T-70": 9200,
            "Pz.Kpfw. II": 10000,
            "AMX-13": 15000
        },
        target_range: [10000, 20000] // kg
    },
    medium_tanks: {
        // 25-45 tons  
        examples: {
            "M4 Sherman": 30300,
            "T-34": 26500,
            "Pz.Kpfw. IV": 25000,
            "Panther": 44800,
            "Centurion": 51800
        },
        target_range: [25000, 45000] // kg
    },
    heavy_tanks: {
        // 45-70 tons
        examples: {
            "IS-3": 46500,
            "Tiger I": 57000,
            "Tiger II": 69800,
            "M103": 56700,
            "IS-4": 60000
        },
        target_range: [45000, 70000] // kg
    },
    superheavy_tanks: {
        // 70-200 tons (experimental)
        examples: {
            "Maus": 188000,
            "E-100": 140000,
            "T95": 86200,
            "Object 279": 60000
        },
        target_range: [70000, 200000] // kg
    }
};

// Component weight distribution (typical percentages)
const weightDistribution = {
    chassis_structure: 0.25,    // 25% - Hull, turret structure
    armor: 0.35,               // 35% - All armor plating
    engine_transmission: 0.15,  // 15% - Powerplant
    running_gear: 0.10,        // 10% - Tracks, wheels, suspension
    weapons_ammo: 0.08,        // 8% - Guns, ammunition
    equipment_systems: 0.05,   // 5% - Electronics, special equipment  
    fuel_crew: 0.02           // 2% - Fuel, crew, misc
};

console.log('🔍 Real Tank Weight Analysis');
console.log('============================\n');

Object.entries(realTankWeights).forEach(([category, data]) => {
    console.log(`${category.toUpperCase().replace('_', ' ')}:`);
    console.log(`Target Range: ${data.target_range[0]/1000}-${data.target_range[1]/1000} tons`);
    console.log('Examples:');
    Object.entries(data.examples).forEach(([tank, weight]) => {
        console.log(`  - ${tank}: ${(weight/1000).toFixed(1)}t`);
    });
    console.log('');
});

console.log('📊 Component Weight Distribution (typical):');
Object.entries(weightDistribution).forEach(([component, percentage]) => {
    console.log(`  ${component.replace('_', ' ')}: ${(percentage * 100).toFixed(0)}%`);
});

// Calculate realistic component weights for different tank categories
function calculateRealisticWeights() {
    console.log('\n🎯 Recommended Component Weights:\n');
    
    Object.entries(realTankWeights).forEach(([category, data]) => {
        const avgWeight = (data.target_range[0] + data.target_range[1]) / 2;
        
        console.log(`${category.toUpperCase().replace('_', ' ')} (avg ${(avgWeight/1000).toFixed(1)}t):`);
        console.log(`  Chassis Base: ${Math.round(avgWeight * weightDistribution.chassis_structure)}kg`);
        console.log(`  Armor Suite: ${Math.round(avgWeight * weightDistribution.armor)}kg`);
        console.log(`  Engine: ${Math.round(avgWeight * 0.08)}kg`);
        console.log(`  Transmission: ${Math.round(avgWeight * 0.04)}kg`);
        console.log(`  Suspension: ${Math.round(avgWeight * 0.03)}kg`);
        console.log(`  Main Gun: ${Math.round(avgWeight * 0.04)}kg`);
        console.log('');
    });
}

calculateRealisticWeights();

module.exports = { realTankWeights, weightDistribution };