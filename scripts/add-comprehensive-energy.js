// Comprehensive energy consumption addition script
// Reviews all tank components and adds energy consumption where appropriate

const fs = require('fs');
const path = require('path');

const componentFiles = [
    'transmissions.js',
    'suspensions.js', 
    'aa_guns.js',
    'main_guns.js',
    'secondary_weapons.js',
    'additional_armor.js'
];

function addEnergyToComponent(component, componentType, componentId) {
    let energyConsumption = 0;
    
    switch (componentType) {
        case 'transmissions':
            if (component.includes('type: "automatic"') || component.includes('type: "semi_automatic"')) {
                if (component.includes('hydrostatic') || component.includes('cvt')) {
                    energyConsumption = 5; // Advanced systems
                } else if (component.includes('torque_converter') || component.includes('hydraulic')) {
                    energyConsumption = 3; // Standard automatic
                } else {
                    energyConsumption = 1; // Semi-automatic
                }
            } else if (component.includes('planetary') || component.includes('differential_steering')) {
                energyConsumption = 4; // Complex steering systems
            } else if (component.includes('synchromesh') && component.includes('level: 6')) {
                energyConsumption = 1; // Advanced manual with electrical assists
            }
            // Manual transmissions = 0 (no electrical systems)
            break;
            
        case 'suspensions':
            if (component.includes('hydropneumatic') || component.includes('adaptive')) {
                energyConsumption = component.includes('experimental') ? 3 : 2;
            } else if (component.includes('active') || component.includes('variable_height')) {
                energyConsumption = 2;
            } else if (component.includes('stabilization_bonus') && 
                       parseFloat(component.match(/stabilization_bonus:\s*([\d.]+)/)?.[1] || 0) > 0.15) {
                energyConsumption = 1; // Advanced stabilization
            }
            // Passive suspensions = 0
            break;
            
        case 'aa_guns':
        case 'main_guns':  
        case 'secondary_weapons':
            if (component.includes('automatic') || component.includes('power')) {
                const rateOfFire = parseInt(component.match(/rate_of_fire:\s*(\d+)/)?.[1] || 0);
                if (rateOfFire > 600) {
                    energyConsumption = 4; // High-ROF automatic systems
                } else if (rateOfFire > 300) {
                    energyConsumption = 2; // Medium-ROF systems  
                } else if (rateOfFire > 100) {
                    energyConsumption = 1; // Low-ROF systems
                }
            }
            
            if (component.includes('stabilization') || component.includes('powered_traverse')) {
                energyConsumption += 2; // Gun stabilization/powered traverse
            }
            
            if (component.includes('radar') || component.includes('fire_control')) {
                energyConsumption += 3; // Fire control systems
            }
            break;
            
        case 'additional_armor':
            if (component.includes('reactive') || component.includes('explosive')) {
                energyConsumption = 1; // Detection/triggering systems
            } else if (component.includes('electric') || component.includes('powered')) {
                energyConsumption = 2; // Powered systems
            } else if (component.includes('active') || component.includes('adaptive')) {
                energyConsumption = 4; // Active protection systems
            }
            break;
    }
    
    return energyConsumption;
}

console.log('🔍 Comprehensive Energy Consumption Review\n');

componentFiles.forEach(fileName => {
    const filePath = path.join(__dirname, '..', 'js', 'data', 'components', fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const componentType = fileName.replace('.js', '');
    let modificationsCount = 0;
    
    // Regex to find component objects
    const componentRegex = /(\w+):\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\},?/g;
    
    let newContent = content.replace(componentRegex, (match, componentId, componentBody) => {
        // Skip if already has energy_consumption
        if (componentBody.includes('energy_consumption:')) {
            return match;
        }
        
        const energyConsumption = addEnergyToComponent(componentBody, componentType, componentId);
        
        if (energyConsumption > 0) {
            modificationsCount++;
            const modifiedBody = componentBody + `,\n        energy_consumption: ${energyConsumption} // kW - Power required`;
            return `${componentId}: {\n${modifiedBody}\n    },`;
        }
        
        return match;
    });
    
    if (modificationsCount > 0) {
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ ${fileName}: Added energy to ${modificationsCount} components`);
    } else {
        console.log(`ℹ️  ${fileName}: No energy-consuming components found`);
    }
});

console.log('\n🔋 Comprehensive Energy System Review Complete!');
console.log('\n📊 Energy Categories Added:');
console.log('🔧 Transmissions: 0-5 kW (automatic/hydraulic systems)');
console.log('🏗️ Suspensions: 0-3 kW (hydropneumatic/adaptive)');  
console.log('🔫 Weapons: 0-4 kW (automatic fire/stabilization)');
console.log('🛡️ Armor: 0-4 kW (reactive/active protection)');
console.log('\n💡 Energy Balance Guidelines:');
console.log('• Basic Tank: ~5-15 kW total consumption');
console.log('• Advanced Tank: ~15-30 kW total consumption');
console.log('• Experimental Tank: ~25-45 kW total consumption');