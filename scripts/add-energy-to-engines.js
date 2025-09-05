// Script to add energy_output to all engines based on power
// Formula: energy_output = Math.floor(power * 0.06) with category modifiers

const fs = require('fs');
const path = require('path');

const enginesFilePath = path.join(__dirname, '..', 'js', 'data', 'components', 'engines.js');

// Read current engines file
let content = fs.readFileSync(enginesFilePath, 'utf8');

// Define energy calculation function
function calculateEnergyOutput(power, category, fuelType) {
    let baseEnergy = Math.floor(power * 0.06); // Base: 6% of mechanical power as electrical
    
    // Category modifiers
    if (category === 'light') baseEnergy = Math.max(10, baseEnergy * 0.9);
    else if (category === 'medium') baseEnergy = Math.floor(baseEnergy * 1.0);
    else if (category === 'heavy') baseEnergy = Math.floor(baseEnergy * 1.1);
    
    // Fuel type modifiers (diesel engines have better generators)
    if (fuelType === 'diesel') baseEnergy = Math.floor(baseEnergy * 1.1);
    
    return Math.min(baseEnergy, 80); // Cap at 80kW for realism
}

// Regex to find engine objects and add energy_output
const engineRegex = /(\w+):\s*\{([^}]+power:\s*(\d+)[^}]+category:\s*"(\w+)"[^}]*fuel_type:\s*"(\w+)"[^}]*)\},?/g;

let newContent = content.replace(engineRegex, (match, engineId, engineBody, power, category, fuelType) => {
    // Check if energy_output already exists
    if (engineBody.includes('energy_output:')) {
        return match; // Skip if already has energy_output
    }
    
    const energyOutput = calculateEnergyOutput(parseInt(power), category, fuelType);
    
    // Add energy_output before the closing brace
    const modifiedBody = engineBody + `,\n        energy_output: ${energyOutput} // kW - Generated electrical power`;
    
    return `${engineId}: {\n${modifiedBody}\n    },`;
});

console.log('Adding energy_output to engines...');
console.log('Energy calculation: power * 0.06 with category and fuel modifiers');
console.log('Light engines: -10%, Medium: 0%, Heavy: +10%');
console.log('Diesel engines: +10% (better generators)');

// Write the updated content back to file
fs.writeFileSync(enginesFilePath, newContent);
console.log('✅ Energy system added to engines.js');