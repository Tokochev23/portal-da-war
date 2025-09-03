// js/vehicleCreator.js - Advanced War-1954 Vehicle Creator System
// Main logic file - imports component data and runs calculations.

// Component Data Imports
import { chassis } from './data/components/chassis.js';
import { engines } from './data/components/engines.js';
import { transmissions } from './data/components/transmissions.js';
import { suspensions } from './data/components/suspensions.js';
import { armor_materials } from './data/components/armor_materials.js';
import { additional_armor } from './data/components/additional_armor.js';
import { main_guns } from './data/components/main_guns.js';
import { secondary_weapons } from './data/components/secondary_weapons.js';
import { aa_guns, aa_fire_control, aa_mount_configs } from './data/components/aa_guns.js';
import { optics_systems } from './data/components/optics_systems.js';
import { communication } from './data/components/communication.js';
import { special_equipment } from './data/components/special_equipment.js';
import { fire_control } from './data/components/fire_control.js';
import { vehicle_templates } from './data/components/vehicle_templates.js';

// Firebase integration
let firebaseDb = null;
let countryData = null;

// Global state
let currentVehicle = {
    name: '',
    type: null,
    chassis: null,
    engine: null,
    transmission: null,
    suspension: null,
    // New simplified armor system
    armorMaterial: 'rolled_homogeneous_armor',
    armorThickness: 0,
    // New crew system
    crewSize: 3,
    trainingLevel: 'standard',
    // Legacy fields (kept for compatibility)  
    armor_material: null,
    armor_thickness: 80,
    additional_armor: [],
    // New armor system
    armorAngle: 'vertical_90',
    main_gun_caliber: 75,
    secondary_weapons: [],
    aa_gun: null,
    ammunition: {},
    optics: null,
    communication: null,
    fcs: null,
    special_equipment: [],
    crew_positions: [],
    crew_training: 'regular',
    crew_specialization: 'none',
    crew_ergonomics: 'basic',
    quantity: 1
};

// Import armor angles system
import { armor_angles, armorEfficiencyCalculator } from './data/components/additional_armor.js';

// Assemble the main components object from imported modules
const VEHICLE_COMPONENTS = {
    chassis,
    engines,
    transmissions,
    suspensions,
    armor_materials,
    additional_armor,
    armor_angles,
    main_guns,
    secondary_weapons,
    aa_guns,
    aa_fire_control,
    aa_mount_configs,
    optics_systems,
    communication,
    special_equipment,
    fire_control,
    vehicle_templates
};

// Initialize Firebase connection
async function initFirebase() {
    try {
        const { getFirestore } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        const { getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");
        
        const app = getApps().length ? getApp() : null;
        if (app) {
            firebaseDb = getFirestore(app);
            await loadCountriesFromFirebase();
        }
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        loadDefaultCountries();
    }
}

// Load countries and set up doctrine-based availability
async function loadCountriesFromFirebase() {
    try {
        const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
        
        const countriesSnapshot = await getDocs(collection(firebaseDb, 'paises'));
        const countries = {};
        
        countriesSnapshot.forEach(doc => {
            const data = doc.data();
            const doctrine = getDoctrinForCountry(doc.id);
            
            countries[doc.id] = {
                name: doc.id,
                industry: data.Industria || 50,
                vehicles: data.Veiculos || 50,
                steel_production: data.CapacidadeProducaoAco || 0,
                vehicle_production: data.CapacidadeProducaoVeiculos || 0,
                budget: data.Orcamento || 0,
                doctrine: doctrine,
                tech_level: calculateTechLevel(data),
                year: 1954,
                available_materials: getAvailableMaterials(doctrine, data),
                research_points: data.PontosP || 0
            };
        });
        
        window.gameCountries = countries;
        populateCountrySelect();
        
    } catch (error) {
        console.error('Error loading countries:', error);
        loadDefaultCountries();
    }
}

function getDoctrinForCountry(countryName) {
    const nato = ['EUA', 'Reino Unido', 'França', 'Alemanha Ocidental', 'Canadá', 'Itália', 'Holanda', 'Bélgica'];
    const warsaw = ['URSS', 'Alemanha Oriental', 'Polônia', 'Checoslováquia', 'Hungria', 'Romênia', 'Bulgária', 'China'];
    
    if (nato.includes(countryName)) return 'NATO';
    if (warsaw.includes(countryName)) return 'Warsaw';
    return 'neutral';
}

function calculateTechLevel(countryData) {
    const baseLevel = (countryData.Tecnologia || 50);
    const vehicleBonus = (countryData.Veiculos || 50) * 0.3;
    const industryBonus = (countryData.Industria || 50) * 0.2;
    
    return Math.min(100, baseLevel + vehicleBonus + industryBonus);
}

function getAvailableMaterials(doctrine, countryData) {
    const baseMaterials = ['mild_steel', 'rolled_homogeneous_armor'];
    const industry = countryData.Industria || 50;
    const tech = countryData.Tecnologia || 50;
    
    if (industry >= 70 && tech >= 60) {
        baseMaterials.push('face_hardened_armor');
    }
    
    if (doctrine === 'NATO' && tech >= 75) {
        baseMaterials.push('composite_experimental');
    }
    
    return baseMaterials;
}

// ⚙️ ADVANCED PHYSICS & COMPATIBILITY SYSTEM

// Check component compatibility
function checkComponentCompatibility(componentType, componentId) {
    // Generic checks that don't depend on a selected chassis
    const component = VEHICLE_COMPONENTS[componentType]?.[componentId];
    if (!component) return { compatible: false, reason: "Componente não encontrado" };
    
    const country = getCurrentCountry();
    if (!country) {
        // If country data isn't loaded, we can't check, so assume compatible for now.
        return { compatible: true }; 
    }
    
    if (component.available_to && !component.available_to.includes(country.doctrine)) {
        return { compatible: false, reason: `Requer doutrina: ${component.available_to.join(', ')}` };
    }
    const techReq = component.tech_requirement;
    if (techReq && country.tech_level < techReq.level) {
        return { compatible: false, reason: `Tecnologia insuficiente. Necessário: ${techReq.level}%` };
    }
    if (techReq && country.year < techReq.year) {
        return { compatible: false, reason: `Não disponível em ${country.year}` };
    }
    if (component.experimental && country.research_points < 100) {
        return { compatible: false, reason: "Requer 100+ pontos de P&D" };
    }

    // Chassis-specific checks
    if (!currentVehicle.chassis) {
        // No chassis selected, so we can't check chassis compatibility.
        return { compatible: true };
    }

    const chassis = VEHICLE_COMPONENTS.chassis[currentVehicle.chassis];
    if (!chassis) return { compatible: true }; // Should not happen if chassis is set

    // === VERIFICAÇÃO DE MOTORES ===
    if (componentType === 'engines') {
        if (chassis.compatible_engines && !chassis.compatible_engines.includes(component.category)) {
            return { compatible: false, reason: `Chassi não suporta motores da categoria '${component.category}'` };
        }
        if (chassis.max_engine_power && component.power > chassis.max_engine_power) {
            return { compatible: false, reason: `Potência excede o limite de ${chassis.max_engine_power}hp` };
        }
        if (chassis.min_engine_power && component.power < chassis.min_engine_power) {
            return { compatible: false, reason: `Potência abaixo do mínimo de ${chassis.min_engine_power}hp` };
        }
    }

    // === VERIFICAÇÃO DE TRANSMISSÕES ===
    if (componentType === 'transmissions') {
        if (chassis.compatible_transmissions && !chassis.compatible_transmissions.includes(component.type)) {
            return { compatible: false, reason: `Chassi não suporta transmissão do tipo '${component.type}'` };
        }
    }

    // === VERIFICAÇÃO DE SUSPENSÕES ===
    if (componentType === 'suspensions') {
        if (chassis.compatible_suspensions && !chassis.compatible_suspensions.includes(componentId)) {
            return { compatible: false, reason: 'Suspensão não compatível com este chassi' };
        }
    }

    // === VERIFICAÇÃO DE ARMAMENTOS SECUNDÁRIOS ===
    if (componentType === 'secondary_weapons') {
        if (chassis.compatible_secondary_weapons && !chassis.compatible_secondary_weapons.includes(componentId)) {
            return { compatible: false, reason: 'Arma secundária não compatível' };
        }
    }

    return { compatible: true };
}

// Calculate realistic vehicle physics
function calculateVehiclePhysics() {
    if (!currentVehicle.chassis || !currentVehicle.engine) {
        return { error: "Chassi e motor são obrigatórios" };
    }
    
    const chassis = VEHICLE_COMPONENTS.chassis[currentVehicle.chassis];
    const engine = VEHICLE_COMPONENTS.engines[currentVehicle.engine];
    const transmission = currentVehicle.transmission ? VEHICLE_COMPONENTS.transmissions[currentVehicle.transmission] : null;
    const mainGun = currentVehicle.mainGun ? VEHICLE_COMPONENTS.main_guns[currentVehicle.mainGun] : null;
    
    // Calculate total weight
    let totalWeight = chassis.base_weight + engine.weight;
    
    if (transmission) totalWeight += transmission.weight;
    if (mainGun) totalWeight += mainGun.weight;
    
    // Add armor weight (new simplified system)
    if (currentVehicle.armorThickness && currentVehicle.armorMaterial) {
        const material = VEHICLE_COMPONENTS.armor_materials[currentVehicle.armorMaterial];
        if (material) {
            // Calculate armor weight based on thickness and material
            // Approximate total armor area based on vehicle size
            const approximateArea = chassis.weight_class === 'light' ? 25 : 
                                  chassis.weight_class === 'medium' ? 35 : 50; // m²
            const armorWeight = currentVehicle.armorThickness * 0.001 * approximateArea * 7850 * material.weight_factor; // kg
            totalWeight += armorWeight;
        }
    }
    
    // Add crew weight and equipment (apply armor angle penalties)
    let crewSize = currentVehicle.crewSize || 3;
    const angle = VEHICLE_COMPONENTS.armor_angles[currentVehicle.armorAngle || 'vertical_90'];
    if (angle?.crew_capacity_penalty) {
        crewSize = Math.max(1, crewSize - angle.crew_capacity_penalty);
    }
    const crewWeight = crewSize * 80; // 80kg per crew member including equipment
    totalWeight += crewWeight;
    
    // Special equipment weight
    currentVehicle.special_equipment.forEach(equipId => {
        const equipment = VEHICLE_COMPONENTS.special_equipment[equipId];
        if (equipment) totalWeight += equipment.weight;
    });
    
    // Check weight limits
    const overweight = totalWeight > chassis.max_weight_capacity;
    const overweightPercent = ((totalWeight - chassis.max_weight_capacity) / chassis.max_weight_capacity) * 100;
    
    // Calculate power-to-weight ratio
    const powerToWeight = engine.power / (totalWeight / 1000); // hp/ton
    
    // Calculate realistic top speed
    const transmissionEfficiency = transmission ? transmission.efficiency : 0.85;
    const baseSpeed = chassis.base_speed;
    const powerFactor = Math.min(1.5, powerToWeight / 15); // Optimal around 15hp/ton
    const weightPenalty = totalWeight > chassis.max_weight_capacity * 0.8 ? 0.85 : 1.0;
    
    const topSpeed = {
        road: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.road),
        offroad: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.offroad),
        mud: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.mud),
        snow: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.snow)
    };
    
    // Calculate fuel consumption
    const baseFuelConsumption = engine.consumption;
    const chassisFuelMod = chassis.fuel_consumption_base;
    const weightFuelPenalty = totalWeight > (chassis.base_weight * 1.5) ? 1.3 : 1.0;
    const fuelConsumption = baseFuelConsumption * chassisFuelMod * weightFuelPenalty;
    
    // Calculate armor effectiveness (enhanced system with angles and additional armor)
    let armorProtection = 0;
    if (currentVehicle.armorThickness && currentVehicle.armorMaterial) {
        const material = VEHICLE_COMPONENTS.armor_materials[currentVehicle.armorMaterial];
        const angle = VEHICLE_COMPONENTS.armor_angles[currentVehicle.armorAngle || 'vertical_90'];
        const additionalIds = currentVehicle.additionalArmor || [];
        
        if (material) {
            let effectiveness = currentVehicle.armorThickness;
            
            // Apply material effectiveness factor
            effectiveness *= material.effectiveness_factor || 1.0;
            
            // Apply angle effectiveness multiplier
            if (angle?.effectiveness_multiplier) {
                effectiveness *= angle.effectiveness_multiplier;
            }
            
            // Add additional armor bonuses
            additionalIds.forEach(armorId => {
                const additionalArmor = VEHICLE_COMPONENTS.additional_armor[armorId];
                if (additionalArmor?.protection_bonus) {
                    effectiveness += additionalArmor.protection_bonus * (additionalArmor.effectiveness_vs?.ap || 1.0);
                }
            });
            
            armorProtection = Math.round(effectiveness);
        }
    }
    
    // Calculate reliability with crew training factor
    let reliabilityFactor = (engine.reliability + chassis.reliability) / 2;
    if (transmission) {
        reliabilityFactor = (reliabilityFactor * 2 + transmission.reliability) / 3;
    }
    
    // Apply crew training bonus/penalty
    const trainingLevels = {
        rookie: -0.15,
        standard: 0,
        veteran: 0.1,
        elite: 0.2
    };
    const trainingBonus = trainingLevels[currentVehicle.trainingLevel] || 0;
    reliabilityFactor += trainingBonus;
    
    // Complexity penalties
    if (overweight) reliabilityFactor *= 0.9;
    if (engine.experimental) reliabilityFactor *= 0.85;
    if (currentVehicle.special_equipment?.length > 3) reliabilityFactor *= 0.95;
    
    const reliability = Math.round(Math.min(100, Math.max(0, reliabilityFactor * 100)));
    
    return {
        totalWeight: Math.round(totalWeight),
        powerToWeight: Math.round(powerToWeight * 10) / 10,
        topSpeed,
        fuelConsumption: Math.round(fuelConsumption * 10) / 10,
        armorProtection,
        reliability,
        crewSize,
        effectiveCrewSize: crewSize,
        trainingLevel: currentVehicle.trainingLevel || 'standard',
        overweight,
        overweightPercent: overweight ? Math.round(overweightPercent) : 0,
        armorAnglePenalties: angle ? {
            crewPenalty: angle.crew_capacity_penalty || 0,
            gunDepressionPenalty: angle.gun_depression_penalty || 0
        } : null,
        warnings: generateVehicleWarnings(totalWeight, chassis, engine, powerToWeight, angle)
    };
}

// Generate warnings about vehicle design
function generateVehicleWarnings(totalWeight, chassis, engine, powerToWeight, angle) {
    const warnings = [];
    
    if (totalWeight > chassis.max_weight_capacity) {
        warnings.push({
            level: 'error',
            message: `Veículo ${Math.round(((totalWeight - chassis.max_weight_capacity) / chassis.max_weight_capacity) * 100)}% acima do limite de peso do chassi`
        });
    }
    
    if (powerToWeight < 10) {
        warnings.push({
            level: 'warning',
            message: "Relação potência/peso baixa. Veículo será lento e com dificuldades em terrenos difíceis"
        });
    }
    
    if (powerToWeight > 25) {
        warnings.push({
            level: 'warning',
            message: "Relação potência/peso muito alta. Pode causar problemas de controle e confiabilidade"
        });
    }
    
    if (engine.experimental) {
        warnings.push({
            level: 'info',
            message: "Motor experimental: maior potência, mas menor confiabilidade e custos de manutenção elevados"
        });
    }
    
    if (engine.fuel_type === "kerosene") {
        warnings.push({
            level: 'warning',
            message: "Combustível especial (querosene): logística complexa e consumo elevado"
        });
    }
    
    // Armor angle warnings
    if (angle) {
        if (angle.crew_capacity_penalty > 0) {
            warnings.push({
                level: 'warning',
                message: `Blindagem extremamente inclinada reduz tripulação em ${angle.crew_capacity_penalty} membros`
            });
        }
        
        if (angle.gun_depression_penalty > 5) {
            warnings.push({
                level: 'warning',
                message: `Ângulo da blindagem limita depressão do canhão em ${angle.gun_depression_penalty}°`
            });
        }
        
        if (angle.effectiveness_multiplier >= 1.8) {
            warnings.push({
                level: 'info',
                message: "Blindagem altamente eficaz contra projéteis diretos, mas com limitações internas"
            });
        }
    }
    
    return warnings;
}

// Calculate comprehensive costs
function calculateVehicleCosts() {
    let baseCost = 0;
    let maintenanceCostPerHour = 0;
    let annualOperatingCost = 0;
    
    const country = getCurrentCountry();
    if (!country) return { error: "País não identificado" };
    
    // Component costs
    if (currentVehicle.chassis) {
        const chassis = VEHICLE_COMPONENTS.chassis[currentVehicle.chassis];
        baseCost += chassis.base_cost;
        maintenanceCostPerHour += chassis.base_cost * 0.001 * chassis.maintenance_complexity;
    }
    
    if (currentVehicle.engine) {
        const engine = VEHICLE_COMPONENTS.engines[currentVehicle.engine];
        baseCost += engine.cost;
        maintenanceCostPerHour += engine.maintenance_hours * 50; // $50 per maintenance hour
        
        // Annual fuel cost (assuming 1000km per year)
        const fuelCostPerLiter = engine.fuel_type === 'kerosene' ? 2.5 : engine.fuel_type === 'diesel' ? 1.2 : 1.0;
        annualOperatingCost += engine.consumption * 1000 * fuelCostPerLiter;
    }
    
    if (currentVehicle.transmission) {
        const transmission = VEHICLE_COMPONENTS.transmissions[currentVehicle.transmission];
        baseCost += transmission.cost;
        maintenanceCostPerHour += transmission.cost * 0.0008 * transmission.maintenance_complexity;
    }
    
    if (currentVehicle.mainGun) {
        const gun = VEHICLE_COMPONENTS.main_guns[currentVehicle.mainGun];
        baseCost += gun.cost;
        maintenanceCostPerHour += 25; // Gun maintenance
    }
    
    // Armor costs (new simplified system)
    if (currentVehicle.armorThickness && currentVehicle.armorMaterial) {
        const material = VEHICLE_COMPONENTS.armor_materials[currentVehicle.armorMaterial];
        const chassis = VEHICLE_COMPONENTS.chassis[currentVehicle.chassis];
        if (material && chassis) {
            // Calculate armor area based on vehicle size
            const approximateArea = chassis.weight_class === 'light' ? 25 : 
                                  chassis.weight_class === 'medium' ? 35 : 50; // m²
            const armorVolume = currentVehicle.armorThickness * 0.001 * approximateArea; // m³
            const armorCost = armorVolume * 7850 * 2 * material.cost_factor; // $2 per kg of steel
            baseCost += armorCost;
        }
    }
    
    // Crew training costs
    const trainingCosts = {
        rookie: 5000,
        standard: 8000,
        veteran: 15000,
        elite: 25000
    };
    const crewSize = currentVehicle.crewSize || 3;
    const trainingLevel = currentVehicle.trainingLevel || 'standard';
    const crewTrainingCost = trainingCosts[trainingLevel] * crewSize;
    baseCost += crewTrainingCost;
    
    // Special equipment costs
    currentVehicle.special_equipment.forEach(equipId => {
        const equipment = VEHICLE_COMPONENTS.special_equipment[equipId];
        if (equipment) {
            baseCost += equipment.cost;
            if (equipment.power_consumption) {
                annualOperatingCost += equipment.power_consumption * 0.15 * 8760; // Power costs
            }
        }
    });
    
    // Fire control system
    if (currentVehicle.fcs) {
        const fcs = VEHICLE_COMPONENTS.fire_control[currentVehicle.fcs];
        if (fcs) {
            baseCost += fcs.cost;
            if (fcs.power_consumption) {
                annualOperatingCost += fcs.power_consumption * 0.15 * 8760;
            }
        }
    }
    
    // Doctrine cost modifiers
    const doctrineModifiers = {
        'NATO': 1.25,     // Higher quality, higher cost
        'Warsaw': 0.85,   // Mass production, lower cost
        'neutral': 1.10   // Balanced
    };
    
    const doctrineMod = doctrineModifiers[country.doctrine] || 1.0;
    baseCost *= doctrineMod;
    
    // Research cost for experimental components
    let researchCost = 0;
    [currentVehicle.engine, currentVehicle.mainGun, currentVehicle.fcs].forEach(componentId => {
        if (componentId) {
            const component = Object.values(VEHICLE_COMPONENTS).find(category => 
                Object.values(category).some(comp => comp.experimental)
            );
            if (component && component.experimental) {
                researchCost += baseCost * 0.15; // 15% R&D cost for experimental tech
            }
        }
    });
    
    const totalUnitCost = baseCost + researchCost;
    const totalProjectCost = totalUnitCost * currentVehicle.quantity;
    
    // Calculate production time (months)
    const productionComplexity = calculateProductionComplexity();
    const countryProductionCapacity = country.vehicle_production || 100000;
    const productionTimeMonths = Math.max(1, Math.ceil((totalProjectCost / countryProductionCapacity) * 12));
    
    return {
        unitCost: Math.round(totalUnitCost),
        totalCost: Math.round(totalProjectCost),
        maintenanceCostPerHour: Math.round(maintenanceCostPerHour),
        annualOperatingCost: Math.round(annualOperatingCost),
        researchCost: Math.round(researchCost),
        crewTrainingCost: Math.round(crewTrainingCost),
        armorCost: currentVehicle.armorThickness && currentVehicle.armorMaterial ? Math.round(armorCost) : 0,
        productionTimeMonths,
        affordability: totalProjectCost <= country.budget ? 'affordable' : 'expensive',
        budgetPercentage: Math.round((totalProjectCost / country.budget) * 100)
    };
}

function calculateProductionComplexity() {
    let complexity = 1.0;
    
    // Add complexity based on components
    if (currentVehicle.engine) {
        const engine = VEHICLE_COMPONENTS.engines[currentVehicle.engine];
        if (engine.experimental) complexity += 0.5;
        if (engine.fuel_type === 'kerosene') complexity += 0.3;
    }
    
    if (currentVehicle.transmission) {
        const trans = VEHICLE_COMPONENTS.transmissions[currentVehicle.transmission];
        complexity += trans.maintenance_complexity * 0.2;
    }
    
    // Armor complexity
    Object.values(currentVehicle.armor).forEach(armor => {
        if (armor.material) {
            const material = VEHICLE_COMPONENTS.armor_materials[armor.material];
            if (material) {
                complexity += (1 - material.weldability) * 0.3;
                if (material.experimental) complexity += 0.4;
            }
        }
    });
    
    return complexity;
}

function calculateEngineTorque(engine) {
    // Simplified torque calculation: Power(hp) * 5252 / RPM
    const avgRPM = engine.max_rpm ? engine.max_rpm * 0.6 : 2000;
    return (engine.power * 5252) / avgRPM;
}

function getCurrentCountry() {
    const countryName = localStorage.getItem('loggedCountry') || 
                       localStorage.getItem('currentCountry') || 
                       localStorage.getItem('selectedCountry') ||
                       localStorage.getItem('playerCountry');
    
    return countryName && window.gameCountries ? window.gameCountries[countryName] : null;
}

// UI Setup function
function setupUI() {
    console.log('Setting up advanced UI...');
    // UI setup will be implemented when we redesign the HTML
}

function populateCountrySelect() {
    // Will be implemented when we redesign the HTML interface
    console.log('Countries loaded:', Object.keys(window.gameCountries || {}));
}

function loadDefaultCountries() {
    window.gameCountries = {
        'EUA': { name: 'EUA', doctrine: 'NATO', tech_level: 85, budget: 1000000000 },
        'URSS': { name: 'URSS', doctrine: 'Warsaw', tech_level: 80, budget: 800000000 },
        'Brasil': { name: 'Brasil', doctrine: 'neutral', tech_level: 45, budget: 50000000 }
    };
    populateCountrySelect();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Advanced Vehicle Creator...');
    initFirebase();
    setupUI();
});

// Update all vehicle calculations and UI
function updateVehicleCalculations() {
    if (!currentVehicle?.chassis) return;
    
    try {
        // Recalculate vehicle physics with new armor data
        const physics = calculateVehiclePhysics();
        const costs = calculateVehicleCosts();
        
        // Update displays if they exist
        updateVehicleDisplays(physics, costs);
        
        // Update any charts or visualizations
        if (window.updatePerformanceChart) {
            window.updatePerformanceChart(physics);
        }
        
        console.log('Vehicle calculations updated:', { physics, costs });
    } catch (error) {
        console.error('Error updating vehicle calculations:', error);
    }
}

// Update UI displays with calculated values
function updateVehicleDisplays(physics, costs) {
    // Update weight display
    const weightDisplay = document.getElementById('total-weight');
    if (weightDisplay && physics.totalWeight) {
        weightDisplay.textContent = physics.totalWeight + 'kg';
    }
    
    // Update armor protection display in main summary
    const armorDisplay = document.getElementById('armor-protection');
    if (armorDisplay && physics.armorProtection) {
        armorDisplay.innerHTML = `<span class="text-brand-400">${physics.armorProtection}mm efetivos</span>`;
    }
    
    // Update crew size display
    const crewDisplay = document.getElementById('crew-size');
    if (crewDisplay && physics.effectiveCrewSize) {
        const crewText = physics.effectiveCrewSize < (currentVehicle.crewSize || 3) ? 
            `${physics.effectiveCrewSize}/${currentVehicle.crewSize || 3} (reduzida)` : 
            physics.effectiveCrewSize.toString();
        crewDisplay.textContent = crewText;
    }
    
    // Update power-to-weight ratio
    const powerDisplay = document.getElementById('power-to-weight');
    if (powerDisplay && physics.powerToWeight) {
        powerDisplay.textContent = physics.powerToWeight + ' hp/ton';
    }
}

// Make functions globally available
window.initFirebase = initFirebase;
window.VEHICLE_COMPONENTS = VEHICLE_COMPONENTS;
window.currentVehicle = currentVehicle;
window.checkComponentCompatibility = checkComponentCompatibility;
window.calculateVehiclePhysics = calculateVehiclePhysics;
window.calculateVehicleCosts = calculateVehicleCosts;
window.updateVehicleCalculations = updateVehicleCalculations;
// filterCompatibleComponents will be assigned to window after definition

function checkMainGunCaliber(caliber) {
    if (!window.currentVehicle?.chassis || !window.VEHICLE_COMPONENTS) {
        return { compatible: true };
    }

    const chassis = window.VEHICLE_COMPONENTS.chassis[window.currentVehicle.chassis];
    if (!chassis) return { compatible: true };

    if (chassis.aa_only && caliber > 0) {
        return { 
            compatible: false, 
            reason: `Chassis SPAA não permite canhão principal. Use apenas armas AA.` 
        };
    }

    if (chassis.artillery_specialized && caliber < chassis.min_main_gun_caliber) {
        return { 
            compatible: false, 
            reason: `Chassis SPG requer calibres de pelo menos ${chassis.min_main_gun_caliber}mm` 
        };
    }

    if (chassis.max_main_gun_caliber && caliber > chassis.max_main_gun_caliber) {
        return { 
            compatible: false, 
            reason: `Calibre muito grande (${caliber}mm). Chassis suporta até ${chassis.max_main_gun_caliber}mm` 
        };
    }

    if (caliber > 130 && !chassis.large_caliber_capable) {
        return { 
            compatible: false, 
            reason: `Calibres >130mm só são permitidos em chassis SPG especializados` 
        };
    }

    return { compatible: true };
}

function updateChassisLimits() {
    if (!window.currentVehicle?.chassis || !window.VEHICLE_COMPONENTS) {
        return;
    }

    const chassis = window.VEHICLE_COMPONENTS.chassis[window.currentVehicle.chassis];
    if (!chassis) return;

    const armorSlider = document.querySelector('input[type="range"][oninput*="updateArmorThickness"]');
    const maxArmorDisplay = document.getElementById('max-armor-thickness');
    
    if (armorSlider && chassis.max_armor_thickness) {
        armorSlider.max = chassis.max_armor_thickness;
        if (maxArmorDisplay) {
            maxArmorDisplay.textContent = chassis.max_armor_thickness + 'mm';
        }
        
        if (window.currentVehicle.armor_thickness > chassis.max_armor_thickness) {
            window.currentVehicle.armor_thickness = chassis.max_armor_thickness;
            armorSlider.value = chassis.max_armor_thickness;
        }
    }

    const caliberSlider = document.querySelector('input[type="range"][min="12.7"][max="180"]');
    if (caliberSlider && chassis.max_main_gun_caliber !== undefined) {
        if (chassis.aa_only) {
            caliberSlider.max = 0;
            caliberSlider.min = 0;
            caliberSlider.disabled = true;
            window.currentVehicle.main_gun_caliber = 0;
        } else {
            caliberSlider.max = chassis.max_main_gun_caliber || 180;
            caliberSlider.min = chassis.min_main_gun_caliber || 12.7;
            caliberSlider.disabled = false;
            
            const currentCaliber = window.currentVehicle.main_gun_caliber || 75;
            if (currentCaliber > chassis.max_main_gun_caliber) {
                window.currentVehicle.main_gun_caliber = chassis.max_main_gun_caliber;
                caliberSlider.value = chassis.max_main_gun_caliber;
            }
            if (currentCaliber < chassis.min_main_gun_caliber) {
                window.currentVehicle.main_gun_caliber = chassis.min_main_gun_caliber;
                caliberSlider.value = chassis.min_main_gun_caliber;
            }
        }
    }

    const chassisInfo = document.getElementById('chassis-compatibility-info');
    if (chassisInfo) {
        let warnings = [];
        if (chassis.aa_only) {
            warnings.push('⚠️ Chassis SPAA: Somente armas antiaéreas permitidas');
        }
        if (chassis.artillery_specialized) {
            warnings.push('⚠️ Chassis SPG: Somente calibres grandes (130mm+)');
        }
        if (chassis.wheeled_restrictions) {
            warnings.push('⚠️ Chassi com rodas: Limitações de recuo (máx 90mm)');
        }
        chassisInfo.innerHTML = warnings.length ? warnings.join('<br>') : '';
    }
}

window.checkMainGunCaliber = checkMainGunCaliber;
window.updateChassisLimits = updateChassisLimits;
// Função para filtrar componentes compatíveis, agora centralizada aqui.
window.filterCompatibleComponents = function(componentType) {
    if (!window.VEHICLE_COMPONENTS || !window.currentVehicle?.chassis) {
        return window.VEHICLE_COMPONENTS?.[componentType] || {};
    }

    const allComponents = window.VEHICLE_COMPONENTS[componentType];
    const compatibleComponents = {};

    Object.entries(allComponents).forEach(([id, component]) => {
        const compatibility = window.checkComponentCompatibility(componentType, id);
        if (compatibility.compatible) {
            compatibleComponents[id] = component;
        }
    });

    return compatibleComponents;
};
