// Script to add energy_consumption to all component files
// Based on technology level and component complexity

const fs = require('fs');
const path = require('path');

const componentFiles = [
    'optics_systems.js',
    'communication.js',
    'special_equipment.js',
    'fire_control.js'
];

function calculateEnergyConsumption(component, componentType) {
    let baseConsumption = 0;
    
    // Base consumption by component type
    switch (componentType) {
        case 'optics_systems':
            if (component.includes('night_vision: true') || component.includes('thermal')) {
                baseConsumption = 4; // Night vision/thermal
            } else if (component.includes('magnification')) {
                baseConsumption = 1; // Basic optics with electrical components
            } else {
                baseConsumption = 0; // Pure optical
            }
            break;
            
        case 'communication':
            if (component.includes('long_range') || component.includes('encryption')) {
                baseConsumption = 6; // Advanced comm systems
            } else if (component.includes('range_km')) {
                const rangeMatch = component.match(/range_km:\s*(\d+)/);
                const range = rangeMatch ? parseInt(rangeMatch[1]) : 5;
                baseConsumption = Math.floor(range / 5) + 2; // Scale with range
            } else {
                baseConsumption = 3; // Basic radio
            }
            break;
            
        case 'special_equipment':
            if (component.includes('experimental')) {
                baseConsumption = 8; // Experimental tech
            } else if (component.includes('night_combat_bonus') || component.includes('detection_range')) {
                baseConsumption = 5; // Advanced sensors
            } else if (component.includes('ventilation') || component.includes('heater')) {
                baseConsumption = 3; // Life support
            } else {
                baseConsumption = 1; // Basic equipment
            }
            break;
            
        case 'fire_control':
            if (component.includes('ballistic_computer') || component.includes('radar')) {
                baseConsumption = 12; // Advanced computing
            } else if (component.includes('stabilization') || component.includes('automatic')) {
                baseConsumption = 6; // Powered systems
            } else if (component.includes('rangefinder')) {
                baseConsumption = 2; // Optical with electrical
            } else {
                baseConsumption = 0; // Pure optical
            }
            break;
    }
    
    // Tech level modifier
    const techMatch = component.match(/level:\s*(\d+)/);
    if (techMatch) {
        const techLevel = parseInt(techMatch[1]);
        if (techLevel > 80) baseConsumption = Math.floor(baseConsumption * 1.5);
        else if (techLevel > 60) baseConsumption = Math.floor(baseConsumption * 1.2);
    }
    
    return Math.min(baseConsumption, 15); // Cap at 15kW
}

componentFiles.forEach(fileName => {
    const filePath = path.join(__dirname, '..', 'js', 'data', 'components', fileName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileName}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has energy_consumption
    if (content.includes('energy_consumption:')) {
        console.log(`⏭️  ${fileName} already has energy consumption values`);
        return;
    }
    
    const componentType = fileName.replace('.js', '');
    
    // Regex to find component objects
    const componentRegex = /(\w+):\s*\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\},?/g;
    
    let newContent = content.replace(componentRegex, (match, componentId, componentBody) => {
        const energyConsumption = calculateEnergyConsumption(componentBody, componentType);
        
        // Add energy_consumption before the closing brace
        const modifiedBody = componentBody + `,\n        energy_consumption: ${energyConsumption} // kW - Power required`;
        
        return `${componentId}: {\n${modifiedBody}\n    },`;
    });
    
    fs.writeFileSync(filePath, newContent);
    console.log(`✅ Added energy consumption to ${fileName}`);
});

console.log('\n🔋 Energy Consumption System Added!');
console.log('📊 Consumption Ranges:');
console.log('• Optics: 0-4 kW (night vision highest)');
console.log('• Communication: 2-8 kW (range/encryption dependent)');
console.log('• Special Equipment: 1-8 kW (experimental highest)');
console.log('• Fire Control: 0-12 kW (computers highest)');