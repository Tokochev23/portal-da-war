// Fix chassis weights to realistic values
const fs = require('fs');
const path = require('path');

const chassisPath = path.join(__dirname, '..', 'js', 'data', 'components', 'chassis.js');
let content = fs.readFileSync(chassisPath, 'utf8');

// New realistic chassis weights (base structure + some armor)
const newWeights = {
    // Light tanks: 3750kg base + 2000kg basic armor = ~6000kg
    mbt_light: 6000,
    light_tracked_basic: 4500,
    light_tracked_advanced: 5500,
    wheeled_4x4: 3500,
    wheeled_6x6: 4500,
    wheeled_8x8: 6000,
    airtransportable: 3000,
    amphibious_tracked: 5000,
    amphibious_wheeled: 4000,
    
    // Medium tanks: 8750kg base + 4000kg basic armor = ~13000kg  
    mbt_medium: 13000,
    tracked_medium: 11000,
    
    // Heavy tanks: 14375kg base + 6000kg basic armor = ~21000kg
    mbt_heavy: 21000,
    tracked_heavy: 19000,
    
    // Super heavy: 33750kg base + 12000kg basic armor = ~46000kg
    mbt_super_heavy: 46000,
    
    // Specialized
    spg_chassis: 12000,        // Self-propelled gun
    recovery_vehicle: 15000,   // Recovery vehicle
    bridge_layer: 18000,       // Bridge layer
    engineering_vehicle: 14000, // Engineering
    modular_experimental: 25000, // Experimental modular
    prototype_advanced: 20000   // Advanced prototype
};

console.log('🔧 Updating Chassis Weights to Realistic Values\n');

let updatedCount = 0;

// Update each chassis weight
Object.entries(newWeights).forEach(([chassisId, newWeight]) => {
    // Find the chassis entry and update its weight
    const regex = new RegExp(`(${chassisId}:\\s*\\{[^}]*base_weight:\\s*)(\\d+)`, 'g');
    const newContent = content.replace(regex, (match, prefix, oldWeight) => {
        console.log(`✅ ${chassisId}: ${oldWeight}kg → ${newWeight}kg (+${newWeight - parseInt(oldWeight)}kg)`);
        updatedCount++;
        return prefix + newWeight;
    });
    content = newContent;
});

fs.writeFileSync(chassisPath, content);

console.log(`\n🎯 Updated ${updatedCount} chassis weights`);
console.log('\n📊 New Weight Ranges:');
console.log('  Light Tanks: 3-6 tons (basic structure)');
console.log('  Medium Tanks: 11-13 tons (basic structure)');  
console.log('  Heavy Tanks: 19-21 tons (basic structure)');
console.log('  Super Heavy: 46+ tons (basic structure)');
console.log('\n💡 Note: Final tank weight = chassis + armor + components + ammo');