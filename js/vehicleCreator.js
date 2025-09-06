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
    // Comprimento do canhão (L/xx) para cálculo de penetração
    main_gun_length_ratio: 40, // L/40 default
    // Tipo de munição exibido no preview (visualização apenas)
    ammo_view: 'AP',
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

// ⚙️ NEW: Component Resolver System
function getResolvedComponent(componentType, componentId) {
    if (!componentType || !componentId || !VEHICLE_COMPONENTS[componentType]) {
        return null;
    }

    const baseComponent = VEHICLE_COMPONENTS[componentType][componentId];
    if (!baseComponent) {
        return null;
    }

    // If the component doesn't have a 'base' property, it's a static component. Return as is.
    if (!baseComponent.base || !baseComponent.tuning) {
        return { ...baseComponent };
    }

    const chassisId = window.currentVehicle.chassis;
    if (!chassisId) {
        // No chassis selected, return base stats
        return { ...baseComponent.base, name: baseComponent.name };
    }

    const chassis = VEHICLE_COMPONENTS.chassis[chassisId];
    const chassisClass = chassis?.weight_class || 'medium'; // Default to medium if no class

    const tuning = baseComponent.tuning[chassisClass];

    // Start with a copy of the base stats
    let resolved = { ...baseComponent.base };
    resolved.name = baseComponent.name; // Keep original name

    if (tuning) {
        // Apply modifiers
        for (const [key, value] of Object.entries(tuning)) {
            if (key === 'name_suffix') {
                resolved.name += value;
            } else if (typeof resolved[key] === 'number') {
                resolved[key] += value;
            } else {
                // For non-numeric properties, overwrite if needed (not used in example but possible)
                resolved[key] = value;
            }
        }
    }

    return resolved;
}


// ⚙️ ADVANCED PHYSICS & COMPATIBILITY SYSTEM

// Check component compatibility
function checkComponentCompatibility(componentType, componentId) {
    const rawComponent = VEHICLE_COMPONENTS[componentType]?.[componentId];
    if (!rawComponent) return { compatible: false, reason: "Componente não encontrado" };

    // Resolve the component to get its stats for the current context
    const component = getResolvedComponent(componentType, componentId);
    if (!component) return { compatible: false, reason: "Falha ao resolver componente" };

    const country = getCurrentCountry();
    if (!country) {
        return { compatible: true }; 
    }
    
    const techReq = rawComponent.tech_requirement || component.tech_requirement;
    if (techReq && country.tech_level < techReq.level) {
        return { compatible: false, reason: `Tecnologia insuficiente. Necessário: ${techReq.level}%` };
    }
    if (techReq && country.year < techReq.year) {
        return { compatible: false, reason: `Não disponível em ${country.year}` };
    }
    if ((rawComponent.experimental || component.experimental) && country.research_points < 100) {
        return { compatible: false, reason: "Requer 100+ pontos de P&D" };
    }

    if (!currentVehicle.chassis) {
        return { compatible: true };
    }

    const chassis = VEHICLE_COMPONENTS.chassis[currentVehicle.chassis];
    if (!chassis) return { compatible: true };

    // === VERIFICAÇÃO DE MOTORES ===
    if (componentType === 'engines') {
        if (chassis.compatible_engines && !chassis.compatible_engines.includes(rawComponent.category)) {
            return { compatible: false, reason: `Chassi não suporta motores da categoria '${rawComponent.category}'` };
        }
        // Use the *resolved* power for the check
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
    
    const chassis = getResolvedComponent('chassis', currentVehicle.chassis);
    const engine = getResolvedComponent('engines', currentVehicle.engine);
    const transmission = getResolvedComponent('transmissions', currentVehicle.transmission);
    const mainGun = getResolvedComponent('main_guns', currentVehicle.mainGun);
    
    // Calculate total weight
    let totalWeight = chassis.base_weight + engine.weight;
    
    if (transmission) totalWeight += transmission.weight;
    if (mainGun) totalWeight += mainGun.weight;
    
    // Add armor weight (new simplified system)
    if (currentVehicle.armorThickness && currentVehicle.armorMaterial) {
        const material = getResolvedComponent('armor_materials', currentVehicle.armorMaterial);
        if (material) {
            const approximateArea = chassis.weight_class === 'light' ? 25 : 
                                  chassis.weight_class === 'medium' ? 35 : 50; // m²
            const armorWeight = currentVehicle.armorThickness * 0.001 * approximateArea * 7850 * material.weight_factor; // kg
            totalWeight += armorWeight;
        }
    }
    
    let crewSize = currentVehicle.crewSize || 3;
    const angle = getResolvedComponent('armor_angles', currentVehicle.armorAngle || 'vertical_90');
    if (angle?.crew_capacity_penalty) {
        crewSize = Math.max(1, crewSize - angle.crew_capacity_penalty);
    }
    const crewWeight = crewSize * 80;
    totalWeight += crewWeight;
    
    // Add special equipment weight (safe iteration)
    const specialEquipment = currentVehicle.special_equipment || [];
    if (Array.isArray(specialEquipment)) {
        specialEquipment.forEach(equipId => {
            const equipment = getResolvedComponent('special_equipment', equipId);
            if (equipment) totalWeight += equipment.weight;
        });
    }
    
    const overweight = totalWeight > chassis.max_weight_capacity;
    const overweightPercent = ((totalWeight - chassis.max_weight_capacity) / chassis.max_weight_capacity) * 100;
    
    const powerToWeight = engine.power / (totalWeight / 1000);
    
    const transmissionEfficiency = transmission ? transmission.efficiency : 0.85;
    const baseSpeed = chassis.base_speed;
    const powerFactor = Math.min(1.5, powerToWeight / 15);
    const weightPenalty = totalWeight > chassis.max_weight_capacity * 0.8 ? 0.85 : 1.0;
    
    const topSpeed = {
        road: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.road),
        offroad: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.offroad),
        mud: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.mud),
        snow: Math.round(baseSpeed * powerFactor * transmissionEfficiency * weightPenalty * chassis.terrain_mult.snow)
    };
    
    const baseFuelConsumption = engine.consumption;
    const chassisFuelMod = chassis.fuel_consumption_base;
    const weightFuelPenalty = totalWeight > (chassis.base_weight * 1.5) ? 1.3 : 1.0;
    const fuelConsumption = baseFuelConsumption * chassisFuelMod * weightFuelPenalty;
    
    let armorProtection = 0;
    if (currentVehicle.armorThickness && currentVehicle.armorMaterial) {
        const material = getResolvedComponent('armor_materials', currentVehicle.armorMaterial);
        const angle = getResolvedComponent('armor_angles', currentVehicle.armorAngle || 'vertical_90');
        const additionalIds = currentVehicle.additionalArmor || [];
        
        if (material) {
            let effectiveness = currentVehicle.armorThickness;
            effectiveness *= material.effectiveness_factor || 1.0;
            if (angle?.effectiveness_multiplier) {
                effectiveness *= angle.effectiveness_multiplier;
            }
            additionalIds.forEach(armorId => {
                const additionalArmor = getResolvedComponent('additional_armor', armorId);
                if (additionalArmor?.protection_bonus) {
                    effectiveness += additionalArmor.protection_bonus * (additionalArmor.effectiveness_vs?.ap || 1.0);
                }
            });
            armorProtection = Math.round(effectiveness);
        }
    }
    
    let reliabilityFactor = (engine.reliability + chassis.reliability) / 2;
    if (transmission) {
        reliabilityFactor = (reliabilityFactor * 2 + transmission.reliability) / 3;
    }
    
    const trainingLevels = { rookie: -0.15, standard: 0, veteran: 0.1, elite: 0.2 };
    const trainingBonus = trainingLevels[currentVehicle.trainingLevel] || 0;
    reliabilityFactor += trainingBonus;
    
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
    
    if (currentVehicle.chassis) {
        const chassis = getResolvedComponent('chassis', currentVehicle.chassis);
        baseCost += chassis.base_cost;
        maintenanceCostPerHour += chassis.base_cost * 0.001 * chassis.maintenance_complexity;
    }
    
    if (currentVehicle.engine) {
        const engine = getResolvedComponent('engines', currentVehicle.engine);
        baseCost += engine.cost;
        maintenanceCostPerHour += engine.maintenance_hours * 50;
        const fuelCostPerLiter = engine.fuel_type === 'kerosene' ? 2.5 : engine.fuel_type === 'diesel' ? 1.2 : 1.0;
        annualOperatingCost += engine.consumption * 1000 * fuelCostPerLiter;
    }
    
    if (currentVehicle.transmission) {
        const transmission = getResolvedComponent('transmissions', currentVehicle.transmission);
        baseCost += transmission.cost;
        maintenanceCostPerHour += transmission.cost * 0.0008 * transmission.maintenance_complexity;
    }
    
    if (currentVehicle.mainGun) {
        const gun = getResolvedComponent('main_guns', currentVehicle.mainGun);
        baseCost += gun.cost;
        maintenanceCostPerHour += 25;
    }
    
    if (currentVehicle.armorThickness && currentVehicle.armorMaterial) {
        const material = getResolvedComponent('armor_materials', currentVehicle.armorMaterial);
        const chassis = getResolvedComponent('chassis', currentVehicle.chassis);
        if (material && chassis) {
            const approximateArea = chassis.weight_class === 'light' ? 25 : 
                                  chassis.weight_class === 'medium' ? 35 : 50;
            const armorVolume = currentVehicle.armorThickness * 0.001 * approximateArea;
            const armorCost = armorVolume * 7850 * 2 * material.cost_factor;
            baseCost += armorCost;
        }
    }
    
    const trainingCosts = { rookie: 5000, standard: 8000, veteran: 15000, elite: 25000 };
    const crewSize = currentVehicle.crewSize || 3;
    const trainingLevel = currentVehicle.trainingLevel || 'standard';
    const crewTrainingCost = trainingCosts[trainingLevel] * crewSize;
    baseCost += crewTrainingCost;
    
    // Add special equipment costs (safe iteration)
    const specialEquipment = currentVehicle.special_equipment || [];
    if (Array.isArray(specialEquipment)) {
        specialEquipment.forEach(equipId => {
            const equipment = getResolvedComponent('special_equipment', equipId);
            if (equipment) {
                baseCost += equipment.cost;
                if (equipment.power_consumption) {
                    annualOperatingCost += equipment.power_consumption * 0.15 * 8760;
                }
            }
        });
    }
    
    if (currentVehicle.fcs) {
        const fcs = getResolvedComponent('fire_control', currentVehicle.fcs);
        if (fcs) {
            baseCost += fcs.cost;
            if (fcs.power_consumption) {
                annualOperatingCost += fcs.power_consumption * 0.15 * 8760;
            }
        }
    }
    
    const doctrineModifiers = { 'NATO': 1.25, 'Warsaw': 0.85, 'neutral': 1.10 };
    const doctrineMod = doctrineModifiers[country.doctrine] || 1.0;
    baseCost *= doctrineMod;
    
    let researchCost = 0;
    [currentVehicle.engine, currentVehicle.mainGun, currentVehicle.fcs].forEach(componentId => {
        if (componentId) {
            const component = getResolvedComponent(Object.keys(VEHICLE_COMPONENTS).find(key => VEHICLE_COMPONENTS[key][componentId]), componentId);
            if (component && component.experimental) {
                researchCost += baseCost * 0.15;
            }
        }
    });
    
    const totalUnitCost = baseCost + researchCost;
    const totalProjectCost = totalUnitCost * currentVehicle.quantity;
    
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
        productionTimeMonths,
        affordability: totalProjectCost <= country.budget ? 'affordable' : 'expensive',
        budgetPercentage: Math.round((totalProjectCost / country.budget) * 100)
    };
}

function calculateProductionComplexity() {
    let complexity = 1.0;
    if (currentVehicle.engine) {
        const engine = getResolvedComponent('engines', currentVehicle.engine);
        if (engine.experimental) complexity += 0.5;
        if (engine.fuel_type === 'kerosene') complexity += 0.3;
    }
    if (currentVehicle.transmission) {
        const trans = getResolvedComponent('transmissions', currentVehicle.transmission);
        complexity += trans.maintenance_complexity * 0.2;
    }
    // This part needs to be updated to handle the new armor structure
    // For now, it's disabled to avoid errors
    /*
    Object.values(currentVehicle.armor).forEach(armor => {
        if (armor.material) {
            const material = getResolvedComponent('armor_materials', armor.material);
            if (material) {
                complexity += (1 - material.weldability) * 0.3;
                if (material.experimental) complexity += 0.4;
            }
        }
    });
    */
    return complexity;
}


function calculateEngineTorque(engine) {
    const avgRPM = engine.max_rpm ? engine.max_rpm * 0.6 : 2000;
    return (engine.power * 5252) / avgRPM;
}

function getCurrentCountry() {
    const countryName = localStorage.getItem('loggedCountry') || 
                       localStorage.getItem('currentCountry') || 
                       localStorage.getItem('selectedCountry') ||
                       localStorage.getItem('playerCountry');
    
    if (countryName && window.gameCountries && window.gameCountries[countryName]) {
        return window.gameCountries[countryName];
    }
    
    // Default fallback country for testing
    return {
        name: 'Default Country',
        doctrine: 'NATO',
        budget: 1000000000,
        vehicle_production: 50000
    };
}

function setupUI() {
    console.log('Setting up advanced UI...');
}

function populateCountrySelect() {
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Advanced Vehicle Creator...');
    initFirebase();
    setupUI();
});

function updateVehicleCalculations() {
    console.log('🔄 Iniciando atualização completa dos cálculos...');
    console.log('🔍 Estado atual do currentVehicle:', currentVehicle);
    
    // Sincronizar campos de blindagem adicional (camelCase vs snake_case)
    try {
        if (window.currentVehicle) {
            const a = new Set(Array.isArray(window.currentVehicle.additionalArmor) ? window.currentVehicle.additionalArmor : []);
            const b = new Set(Array.isArray(window.currentVehicle.additional_armor) ? window.currentVehicle.additional_armor : []);
            const merged = Array.from(new Set([...a, ...b]));
            window.currentVehicle.additionalArmor = merged;
            window.currentVehicle.additional_armor = merged;
        }
    } catch (e) { 
        console.error('❌ Erro na sincronização de blindagem adicional:', e);
    }
    
    if (!currentVehicle?.chassis) {
        console.log('⚠️ Nenhum chassi selecionado - atualizações limitadas');
        // Mesmo sem chassi, vamos tentar atualizar o que for possível
        try {
            updateEnergyDisplay();
            updatePerformanceDisplay(); 
            updateCostDisplay();
            console.log('✅ Atualizações básicas concluídas sem chassi');
        } catch (e) {
            console.error('❌ Erro nas atualizações básicas:', e);
        }
        return;
    }
    
    try {
        console.log('🔧 Iniciando cálculo de física...');
        // Calcular física do veículo
        const physics = calculateVehiclePhysics();
        console.log('🔧 Física calculada:', physics);
        
        if (physics.error) {
            console.error('❌ Erro na física:', physics.error);
            return;
        }
        
        console.log('💰 Iniciando cálculo de custos...');
        // Calcular custos
        const costs = window.CostSystem ? window.CostSystem.calculateCosts(currentVehicle) : calculateVehicleCosts();
        console.log('💰 Custos calculados:', costs);
        
        if (costs.error) {
            console.error('❌ Erro nos custos:', costs.error);
        }
        
        console.log('📱 Atualizando displays...');
        // Atualizar displays básicos
        updateVehicleDisplays(physics, costs);
        
        console.log('⚡ Atualizando energia...');
        // Atualizar sistemas específicos
        updateEnergyDisplay();
        
        console.log('🏃 Atualizando performance...');
        updatePerformanceDisplay();
        
        console.log('💰 Atualizando custos...');
        updateCostDisplay();
        
        console.log('📊 Atualizando gráfico...');
        // Atualizar gráfico de performance
        if (window.updatePerformanceChart) {
            window.updatePerformanceChart(physics);
        }
        
        console.log('✅ Todos os cálculos foram atualizados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao atualizar cálculos do veículo:', error);
        console.error('❌ Stack trace:', error.stack);
    }
}

function updateVehicleDisplays(physics, costs) {
    const weightDisplay = document.getElementById('total-weight');
    if (weightDisplay && physics.totalWeight) {
        weightDisplay.textContent = physics.totalWeight + 'kg';
    }
    
    const armorDisplay = document.getElementById('armor-protection');
    if (armorDisplay && physics.armorProtection) {
        armorDisplay.innerHTML = `<span class="text-brand-400">${physics.armorProtection}mm efetivos</span>`;
    }
    
    const crewDisplay = document.getElementById('crew-size');
    if (crewDisplay && physics.effectiveCrewSize) {
        const crewText = physics.effectiveCrewSize < (currentVehicle.crewSize || 3) ? 
            `${physics.effectiveCrewSize}/${currentVehicle.crewSize || 3} (reduzida)` : 
            physics.effectiveCrewSize.toString();
        crewDisplay.textContent = crewText;
    }
    
    const powerDisplay = document.getElementById('power-to-weight');
    if (powerDisplay && physics.powerToWeight) {
        powerDisplay.textContent = physics.powerToWeight + ' hp/ton';
    }
}

window.initFirebase = initFirebase;
window.VEHICLE_COMPONENTS = VEHICLE_COMPONENTS;
window.currentVehicle = currentVehicle;
window.checkComponentCompatibility = checkComponentCompatibility;
window.calculateVehiclePhysics = calculateVehiclePhysics;
window.calculateVehicleCosts = calculateVehicleCosts;
window.updateVehicleCalculations = updateVehicleCalculations;
window.getResolvedComponent = getResolvedComponent; // Expose the new function

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.CostSystem) {
            console.log('✅ CostSystem initialized with components');
            updateCostDisplay();
        } else {
            console.warn('⚠️ CostSystem not found - cost calculations may not work');
        }
    }, 100);
});

function checkMainGunCaliber(caliber) {
    if (!window.currentVehicle?.chassis || !window.VEHICLE_COMPONENTS) {
        return { compatible: true };
    }
    const chassis = getResolvedComponent('chassis', window.currentVehicle.chassis);
    if (!chassis) return { compatible: true };

    if (chassis.aa_only && caliber > 0) {
        return { compatible: false, reason: `Chassis SPAA não permite canhão principal. Use apenas armas AA.` };
    }
    if (chassis.artillery_specialized && caliber < chassis.min_main_gun_caliber) {
        return { compatible: false, reason: `Chassis SPG requer calibres de pelo menos ${chassis.min_main_gun_caliber}mm` };
    }
    if (chassis.max_main_gun_caliber && caliber > chassis.max_main_gun_caliber) {
        return { compatible: false, reason: `Calibre muito grande (${caliber}mm). Chassis suporta até ${chassis.max_main_gun_caliber}mm` };
    }
    if (caliber > 130 && !chassis.large_caliber_capable) {
        return { compatible: false, reason: `Calibres >130mm só são permitidos em chassis SPG especializados` };
    }
    return { compatible: true };
}

function updateChassisLimits() {
    if (!window.currentVehicle?.chassis || !window.VEHICLE_COMPONENTS) return;
    const chassis = getResolvedComponent('chassis', window.currentVehicle.chassis);
    if (!chassis) return;

    // Update armor slider, etc. (code omitted for brevity, no changes needed here)
}

window.checkMainGunCaliber = checkMainGunCaliber;
window.updateChassisLimits = updateChassisLimits;

window.filterCompatibleComponents = function(componentType) {
    if (!window.VEHICLE_COMPONENTS || !window.currentVehicle?.chassis) {
        return window.VEHICLE_COMPONENTS?.[componentType] || {};
    }

    const allComponents = window.VEHICLE_COMPONENTS[componentType];
    const compatibleComponents = {};

    for (const id in allComponents) {
        const compatibility = window.checkComponentCompatibility(componentType, id);
        if (compatibility.compatible) {
            compatibleComponents[id] = allComponents[id];
        }
    }
    return compatibleComponents;
};

window.selectChassis = function(chassisId) {
    if (!window.VEHICLE_COMPONENTS?.chassis[chassisId]) {
        console.error('Chassis not found:', chassisId);
        return;
    }
    
    window.currentVehicle.chassis = chassisId;
    console.log('Selected chassis:', chassisId);

    // Deselect incompatible components
    if (window.currentVehicle.engine) {
        const compat = checkComponentCompatibility('engines', window.currentVehicle.engine);
        if (!compat.compatible) {
            window.currentVehicle.engine = null;
        }
    }
    if (window.currentVehicle.transmission) {
        const compat = checkComponentCompatibility('transmissions', window.currentVehicle.transmission);
        if (!compat.compatible) {
            window.currentVehicle.transmission = null;
        }
    }
    // Add similar checks for other components...
    
    document.querySelectorAll('.chassis-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    });
    
    const selectedCard = document.querySelector(`[onclick="selectChassis('${chassisId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    }
    
    // Refresh current tab to show new compatibility
    if(window.vehicleCreatorApp) {
        window.vehicleCreatorApp.loadTabContent(window.vehicleCreatorApp.currentTab);
    }

    updateVehicleCalculations();
};

window.selectEngine = function(engineId) {
    if (!window.VEHICLE_COMPONENTS?.engines[engineId]) {
        console.error('Engine not found:', engineId);
        return;
    }
    window.currentVehicle.engine = engineId;
    console.log('Selected engine:', engineId);
    
    document.querySelectorAll('.component-card').forEach(card => {
        if (card.onclick && card.onclick.toString().includes('selectEngine')) {
            card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400', 'shadow-brand-500/20', 'shadow-lg');
            card.classList.add('bg-slate-800/40', 'border-slate-700/50');
        }
    });
    
    const selectedCard = document.querySelector(`[onclick="selectEngine('${engineId}')"]`);
    if (selectedCard) {
        selectedCard.classList.remove('bg-slate-800/40', 'border-slate-700/50');
        selectedCard.classList.add('selected', 'bg-brand-900/30', 'border-brand-400', 'shadow-brand-500/20', 'shadow-lg');
    }
    
    updateVehicleCalculations();
};

window.selectTransmission = function(transmissionId) {
    if (!window.VEHICLE_COMPONENTS?.transmissions[transmissionId]) {
        console.error('Transmission not found:', transmissionId);
        return;
    }
    window.currentVehicle.transmission = transmissionId;
    console.log('Selected transmission:', transmissionId);
    
    document.querySelectorAll('.transmission-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    });
    
    const selectedCard = document.querySelector(`[onclick="selectTransmission('${transmissionId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    }
    
    updateVehicleCalculations();
};

window.selectSuspension = function(suspensionId) {
    if (!window.VEHICLE_COMPONENTS?.suspensions[suspensionId]) {
        console.error('Suspension not found:', suspensionId);
        return;
    }
    window.currentVehicle.suspension = suspensionId;
    console.log('Selected suspension:', suspensionId);
    
    document.querySelectorAll('.suspension-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    });
    
    const selectedCard = document.querySelector(`[onclick="selectSuspension('${suspensionId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    }
    
    updateVehicleCalculations();
};

function updatePerformanceChart() {
    if (!window.currentVehicle?.chassis || !window.currentVehicle?.engine) {
        if (window.vehicleCreatorApp?.performanceChart) {
            window.vehicleCreatorApp.performanceChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0];
            window.vehicleCreatorApp.performanceChart.update();
        }
        return;
    }

    const physics = calculateVehiclePhysics();
    const costs = window.CostSystem ? window.CostSystem.calculateCosts(window.currentVehicle) : calculateVehicleCosts();

    const normalizedPerformance = {
        speed: Math.min(100, (physics.topSpeed.road / 80) * 100),
        armor: Math.min(100, (physics.armorProtection / 250) * 100),
        power: Math.min(100, (physics.powerToWeight / 20) * 100),
        reliability: physics.reliability,
        economy: Math.max(0, 100 - (physics.fuelConsumption / 100) * 100),
        maintenance: Math.max(0, 100 - (costs.maintenanceCostPerHour / 500) * 100)
    };
    
    if (window.vehicleCreatorApp?.performanceChart) {
        window.vehicleCreatorApp.performanceChart.data.datasets[0].data = [
            normalizedPerformance.speed,
            normalizedPerformance.armor,
            normalizedPerformance.power,
            normalizedPerformance.reliability,
            normalizedPerformance.economy,
            normalizedPerformance.maintenance
        ];
        window.vehicleCreatorApp.performanceChart.update();
    }
    
    updateEnergyDisplay();
    updatePerformanceDisplay();
    updateCostDisplay();
}

function updateEnergyDisplay() {
    if (!window.EnergySystem || !window.currentVehicle) return;
    const energyContainer = document.getElementById('energy-analysis');
    if (energyContainer) {
        const energyHtml = window.EnergySystem.renderEnergyDisplay(window.currentVehicle);
        energyContainer.innerHTML = energyHtml;
    }
}

function updatePerformanceDisplay() {
    if (!window.PerformanceSystem || !window.currentVehicle) return;
    const performanceContainer = document.getElementById('performance-analysis');
    if (performanceContainer) {
        const performanceHtml = window.PerformanceSystem.renderPerformanceDisplay(window.currentVehicle);
        performanceContainer.innerHTML = performanceHtml;
    }
}

function updateCostDisplay() {
    if (!window.CostSystem || !currentVehicle) return;
    const costContainer = document.getElementById('cost-breakdown');
    if (costContainer) {
        const costHtml = window.CostSystem.renderCostDisplay(currentVehicle);
        costContainer.innerHTML = costHtml;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateEnergyDisplay();
        updatePerformanceDisplay();
        updateCostDisplay();
    }, 1000);
});

window.updateMainGunCaliber = function(caliber) {
    const caliberValue = parseInt(caliber);
    if (window.currentVehicle) {
        const chassis = window.currentVehicle?.chassis ? (window.VEHICLE_COMPONENTS?.chassis?.[window.currentVehicle.chassis]) : null;
        const minCal = chassis?.min_main_gun_caliber ?? 20;
        const maxCal = chassis?.max_main_gun_caliber ?? 180;
        const clamped = Math.max(minCal, Math.min(maxCal, caliberValue));
        window.currentVehicle.main_gun_caliber = clamped;
        const display = document.getElementById('main-gun-caliber-display');
        const headerDisplay = document.getElementById('main-gun-header-caliber');
        const summaryDisplay = document.getElementById('summary-main-gun-caliber');
        const slider = document.getElementById('main-gun-caliber-slider');
        if (slider) {
            slider.min = String(minCal);
            slider.max = String(maxCal);
            slider.value = String(clamped);
        }
        if (display) display.textContent = clamped + 'mm';
        if (headerDisplay) headerDisplay.textContent = clamped + ' mm';
        if (summaryDisplay) summaryDisplay.textContent = clamped + 'mm';
        updateGunCategoryHighlighting(clamped);
        updateWeaponCalculations();
        updateWeaponsSummary();
        console.log('Main gun caliber updated:', clamped);
        // Atualiza todos os cálculos mesmo sem o gráfico presente
        if (typeof updateVehicleCalculations === 'function') {
            updateVehicleCalculations();
        } else if (typeof updatePerformanceChart === 'function') {
            updatePerformanceChart();
        }
    }
};

// New weapon functions for the updated UI
window.updateMainGunLength = function(length) {
    const lengthValue = parseInt(length);
    if (window.currentVehicle && lengthValue >= 30 && lengthValue <= 70) {
        window.currentVehicle.main_gun_length_ratio = lengthValue;
        console.log('Main gun length updated:', lengthValue);
        
        // Update button visual states
        updateGunLengthButtonStates(lengthValue);
        
        // Update gun statistics display
        updateWeaponCalculations();
        updateWeaponsSummary();
        
        // Update calculations
        if (typeof updateVehicleCalculations === 'function') {
            updateVehicleCalculations();
        }
    }
};

window.updateMainGunAmmo = function(ammoType) {
    const validAmmoTypes = ['AP', 'HE', 'APCR', 'HEAT', 'APDS'];
    if (window.currentVehicle && validAmmoTypes.includes(ammoType)) {
        window.currentVehicle.ammo_view = ammoType;
        console.log('Main gun ammo type updated:', ammoType);
        
        // Update button visual states
        updateGunAmmoButtonStates(ammoType);
        
        // Update gun statistics display
        updateWeaponCalculations();
        updateWeaponsSummary();
        
        // Update calculations
        if (typeof updateVehicleCalculations === 'function') {
            updateVehicleCalculations();
        }
    }
};

window.toggleAAGun = function(gunId) {
    if (!window.currentVehicle) return;
    
    if (!window.currentVehicle.aa_guns) {
        window.currentVehicle.aa_guns = [];
    }
    
    const index = window.currentVehicle.aa_guns.indexOf(gunId);
    if (index > -1) {
        window.currentVehicle.aa_guns.splice(index, 1);
        console.log('AA gun removed:', gunId);
    } else {
        window.currentVehicle.aa_guns.push(gunId);
        console.log('AA gun added:', gunId);
    }
    
    // Update weapon calculations and displays
    updateWeaponCalculations();
    
    if (typeof updateVehicleCalculations === 'function') {
        updateVehicleCalculations();
    }
    
    // Refresh the UI to show updated selection
    setTimeout(() => {
        if (window.tabLoaders && typeof window.tabLoaders.loadWeaponsTab === 'function') {
            window.tabLoaders.loadWeaponsTab();
        }
    }, 100);
};

function updateGunLengthButtonStates(selectedLength) {
    // Remove selected class from all length buttons
    const lengthButtons = document.querySelectorAll('[onclick^="updateMainGunLength("]');
    lengthButtons.forEach(button => {
        button.classList.remove('bg-brand-600', 'text-white');
        button.classList.add('bg-slate-700', 'text-slate-300');
    });
    
    // Add selected class to the current length button
    const selectedButton = document.querySelector(`[onclick="updateMainGunLength(${selectedLength})"]`);
    if (selectedButton) {
        selectedButton.classList.remove('bg-slate-700', 'text-slate-300');
        selectedButton.classList.add('bg-brand-600', 'text-white');
    }
}

function updateGunAmmoButtonStates(selectedAmmo) {
    // Remove selected class from all ammo buttons
    const ammoButtons = document.querySelectorAll('[onclick^="updateMainGunAmmo("]');
    ammoButtons.forEach(button => {
        button.classList.remove('bg-brand-600', 'text-white');
        button.classList.add('bg-slate-700', 'text-slate-300');
    });
    
    // Add selected class to the current ammo button
    const selectedButton = document.querySelector(`[onclick="updateMainGunAmmo('${selectedAmmo}')"]`);
    if (selectedButton) {
        selectedButton.classList.remove('bg-slate-700', 'text-slate-300');
        selectedButton.classList.add('bg-brand-600', 'text-white');
    }
}

function updateWeaponCalculations() {
    // Update main gun statistics in the UI
    const currentVehicle = window.currentVehicle || {};
    const mainGunCaliber = currentVehicle.main_gun_caliber || 0;
    const mainGunLength = currentVehicle.main_gun_length_ratio || 40;
    const mainGunAmmo = currentVehicle.ammo_view || 'AP';
    
    // Update header caliber display
    const headerDisplay = document.getElementById('main-gun-header-caliber');
    if (headerDisplay && mainGunCaliber > 0) {
        headerDisplay.textContent = mainGunCaliber + ' mm';
    }
    
    // Update summary caliber display
    const summaryDisplay = document.getElementById('summary-main-gun-caliber');
    if (summaryDisplay && mainGunCaliber > 0) {
        summaryDisplay.textContent = mainGunCaliber + ' mm';
    }
    
    // Calculate and update penetration - consistent with tabLoaders.js
    const basePenetration = (mainGunCaliber * mainGunLength) / 25; // Historically accurate values
    const ammoMultipliers = {
        'AP': 1.0,     // Standard AP rounds
        'APCR': 1.4,   // Tungsten core, higher velocity
        'APDS': 1.8,   // Advanced sabot design
        'HEAT': 1.6,   // Chemical energy penetrator
        'HE': 0.15     // High explosive, minimal penetration
    };
    const penetration = Math.round(basePenetration * (ammoMultipliers[mainGunAmmo] || 1.0));
    
    // Update penetration display in summary
    const summaryPenetrationDisplay = document.getElementById('summary-penetration');
    if (summaryPenetrationDisplay) {
        summaryPenetrationDisplay.textContent = penetration + ' mm';
    }
    
    // Update estimated penetration display in main gun section
    const estimatedDisplay = document.getElementById('main-gun-penetration');
    if (estimatedDisplay) {
        estimatedDisplay.textContent = penetration + ' mm';
        console.log('Updated main gun penetration to:', penetration + 'mm', 'for ammo type:', mainGunAmmo);
    }
    
    // Update button states
    updateGunLengthButtonStates(mainGunLength);
    updateGunAmmoButtonStates(mainGunAmmo);
    
    if (window.tabLoaders && typeof window.tabLoaders.calculateGunPenetration === 'function') {
        const legacyPenetration = window.tabLoaders.calculateGunPenetration(mainGunCaliber, mainGunLength);
        const gunCost = window.tabLoaders.calculateGunCost(mainGunCaliber, mainGunLength);
        
        // Update penetration display (legacy)
        const penetrationEl = document.getElementById('main-gun-penetration');
        if (penetrationEl) penetrationEl.textContent = legacyPenetration + ' mm';
        
        // Update cost display
        const costEl = document.getElementById('main-gun-cost');
        if (costEl) costEl.textContent = '$' + gunCost + 'K';
    }
}

function updateGunCategoryHighlighting(caliber) {
    // UI update logic
}

// Visualização de penetração do canhão principal (AP, APDS, APCR, APHE, HEAT, HE)
window.calculateEstimatedPenetration = function(caliber, lengthRatio, ammoType) {
    const cal = Math.max(1, Number(caliber) || 0);
    const L = Math.max(10, Number(lengthRatio) || 40);
    const Lf = 0.85 + 0.15 * (L / 40); // L/40 como base

    const t = (ammoType || 'AP').toUpperCase();
    let base;
    switch (t) {
        case 'AP':   base = cal * 3.0 * Lf; break;
        case 'APCR': base = cal * 3.6 * Lf; break;
        case 'APDS': base = cal * 5.0 * Lf; break;
        case 'APHE': base = cal * 2.6 * Lf; break;
        case 'HEAT': base = cal * 4.2 * (0.95 + 0.05 * (L / 40)); break; // pouco dependente de L
        case 'HE':   base = 0; break;
        default:     base = cal * 3.0 * Lf;
    }
    return Math.round(base);
}

window.updateGunLength = function(lengthRatio) {
    const L = parseInt(lengthRatio);
    if (!window.currentVehicle) return;
    window.currentVehicle.main_gun_length_ratio = L;
    updateGunPreview();
    if (typeof updateVehicleCalculations === 'function') updateVehicleCalculations();
}

window.setAmmoView = function(type) {
    if (!window.currentVehicle) return;
    window.currentVehicle.ammo_view = String(type || 'AP').toUpperCase();
    updateGunPreview();
}

function updateGunPreview() {
    const v = window.currentVehicle || {};
    const ammo = (v.ammo_view || 'AP').toUpperCase();
    const pen = window.calculateEstimatedPenetration(v.main_gun_caliber || 0, v.main_gun_length_ratio || 40, ammo);

    const penEl = document.getElementById('gun-penetration-estimate');
    if (penEl) penEl.textContent = `${pen} mm`;

    // Highlight chips
    try {
        document.querySelectorAll('[data-ammo-chip]').forEach(el => {
            if (el.getAttribute('data-ammo-chip') === ammo) {
                el.classList.add('selected','bg-brand-900/30','border-brand-400');
                el.classList.remove('bg-slate-700/30','border-slate-700/50');
            } else {
                el.classList.remove('selected','bg-brand-900/30','border-brand-400');
                el.classList.add('bg-slate-700/30','border-slate-700/50');
            }
        });
        document.querySelectorAll('[data-length-chip]').forEach(el => {
            if (parseInt(el.getAttribute('data-length-chip')) === (v.main_gun_length_ratio || 40)) {
                el.classList.add('selected','bg-brand-900/30','border-brand-400');
                el.classList.remove('bg-slate-700/30','border-slate-700/50');
            } else {
                el.classList.remove('selected','bg-brand-900/30','border-brand-400');
                el.classList.add('bg-slate-700/30','border-slate-700/50');
            }
        });
    } catch (e) { /* noop */ }
}

// Expor preview para chamadas pós-render
window.updateGunPreview = updateGunPreview;

window.selectSecondaryWeapon = function(weaponId) {
    // Selection logic
};

window.toggleSecondaryWeapon = function(weaponId) {
    if (!window.currentVehicle) return;
    if (!Array.isArray(window.currentVehicle.secondary_weapons)) {
        window.currentVehicle.secondary_weapons = [];
    }
    const idx = window.currentVehicle.secondary_weapons.indexOf(weaponId);
    if (idx >= 0) {
        window.currentVehicle.secondary_weapons.splice(idx, 1);
    } else {
        window.currentVehicle.secondary_weapons.push(weaponId);
    }

    // Atualizar visual do card
    try {
        const card = document.querySelector(`[onclick="toggleSecondaryWeapon('${weaponId}')"]`);
        if (card) {
            const isSelected = window.currentVehicle.secondary_weapons.includes(weaponId);
            if (isSelected) {
                card.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.remove('bg-slate-800/40', 'border-slate-700/50');
            } else {
                card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.add('bg-slate-800/40', 'border-slate-700/50');
            }
        }
    } catch (e) { /* noop */ }

    updateVehicleCalculations();
    updateWeaponsSummary();
};

// System selection functions
window.selectFireControl = function(fcsId) {
    if (!window.currentVehicle) return;
    window.currentVehicle.fcs = fcsId;
    try {
        document.querySelectorAll('.component-card').forEach(card => {
            if (card.onclick && card.onclick.toString().includes('selectFireControl')) {
                card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.add('bg-slate-800/40', 'border-slate-700/50');
            }
        });
        const selected = document.querySelector(`[onclick="selectFireControl('${fcsId}')"]`);
        if (selected) {
            selected.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
            selected.classList.remove('bg-slate-800/40', 'border-slate-700/50');
        }
    } catch (e) { /* noop */ }
    updateVehicleCalculations();
};

window.selectOptics = function(opticsId) {
    if (!window.currentVehicle) return;
    window.currentVehicle.optics = opticsId;
    try {
        document.querySelectorAll('.component-card').forEach(card => {
            if (card.onclick && card.onclick.toString().includes('selectOptics')) {
                card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.add('bg-slate-800/40', 'border-slate-700/50');
            }
        });
        const selected = document.querySelector(`[onclick="selectOptics('${opticsId}')"]`);
        if (selected) {
            selected.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
            selected.classList.remove('bg-slate-800/40', 'border-slate-700/50');
        }
    } catch (e) { /* noop */ }
    updateVehicleCalculations();
};

window.selectCommunication = function(commId) {
    if (!window.currentVehicle) return;
    window.currentVehicle.communication = commId;
    try {
        document.querySelectorAll('.component-card').forEach(card => {
            if (card.onclick && card.onclick.toString().includes('selectCommunication')) {
                card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.add('bg-slate-800/40', 'border-slate-700/50');
            }
        });
        const selected = document.querySelector(`[onclick="selectCommunication('${commId}')"]`);
        if (selected) {
            selected.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
            selected.classList.remove('bg-slate-800/40', 'border-slate-700/50');
        }
    } catch (e) { /* noop */ }
    updateVehicleCalculations();
};

// Crew management functions
window.updateCrewSize = function(size) {
    if (!window.currentVehicle) return;
    const val = parseInt(size);
    if (!Number.isFinite(val)) return;
    window.currentVehicle.crewSize = val;
    try {
        const display = document.getElementById('crew-size-display');
        if (display) display.textContent = String(val);
        // Atualiza a lista de funções exibidas
        updateCrewRolesDisplay(val);
    } catch (e) { /* noop */ }
    updateVehicleCalculations();
};

function updateCrewRolesDisplay(crewSize) {
    const rolesMap = {
        2: ['Motorista', 'Gunner'],
        3: ['Motorista', 'Gunner', 'Comandante'],
        4: ['Motorista', 'Gunner', 'Comandante', 'Carregador'],
        5: ['Motorista', 'Gunner', 'Comandante', 'Carregador', 'Operador de Rádio']
    };
    const roles = rolesMap[crewSize] || rolesMap[3];

    // Gera HTML dos itens
    const itemsHtml = roles.map((role, idx) => `
        <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
            <span class="w-6 h-6 flex items-center justify-center text-xs font-bold bg-brand-900/50 text-brand-300 rounded-full">${idx + 1}</span>
            <span class="text-slate-200 text-sm">${role}</span>
        </div>
    `).join('');

    let container = document.getElementById('crew-roles-container');
    if (!container) {
        // Criar card de funções após o card do slider
        const slider = document.getElementById('crew-size-slider');
        const card = slider ? (slider.closest('.rounded-xl.p-6') || slider.closest('.p-6')) : null;
        const wrapper = document.createElement('div');
        wrapper.className = 'bg-slate-800/40 border border-slate-700/50 rounded-xl p-6';
        wrapper.innerHTML = `
            <h3 class="text-lg font-semibold text-slate-100 mb-4">Funções da Tripulação</h3>
            <div id="crew-roles-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">${itemsHtml}</div>
        `;
        if (card && card.parentElement) {
            card.parentElement.insertBefore(wrapper, card.nextSibling);
        } else {
            document.getElementById('tab-content')?.appendChild(wrapper);
        }
        container = wrapper.querySelector('#crew-roles-container');
    }

    if (container) {
        container.innerHTML = itemsHtml;
    }
}

window.updateCrewTraining = function(trainingLevel) {
    if (!window.currentVehicle) return;
    window.currentVehicle.trainingLevel = trainingLevel;
    updateVehicleCalculations();
};

window.selectTrainingLevel = function(trainingLevel) {
    if (!window.currentVehicle) return;
    window.currentVehicle.trainingLevel = trainingLevel;
    try {
        document.querySelectorAll('[onclick^="selectTrainingLevel("]').forEach(card => {
            card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
            card.classList.add('bg-slate-700/30', 'border-slate-700/50');
        });
        const selected = document.querySelector(`[onclick="selectTrainingLevel('${trainingLevel}')"]`);
        if (selected) {
            selected.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
            selected.classList.remove('bg-slate-700/30', 'border-slate-700/50');
        }
    } catch (e) { /* noop */ }
    updateVehicleCalculations();
};

// AA gun selection
window.selectAAGun = function(gunId) {
    if (!window.currentVehicle) return;
    window.currentVehicle.aa_gun = gunId;
    try {
        document.querySelectorAll('[onclick^="selectAAGun("]').forEach(card => {
            card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
            card.classList.add('bg-slate-800/40', 'border-slate-700/50');
        });
        const selected = document.querySelector(`[onclick="selectAAGun('${gunId}')"]`);
        if (selected) {
            selected.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
            selected.classList.remove('bg-slate-800/40', 'border-slate-700/50');
        }
    } catch (e) { /* noop */ }
    updateVehicleCalculations();
    updateWeaponsSummary();
};

// Special equipment toggle
window.toggleSpecialEquipment = function(id) {
    if (!window.currentVehicle) return;
    if (!Array.isArray(window.currentVehicle.special_equipment)) {
        window.currentVehicle.special_equipment = [];
    }
    const idx = window.currentVehicle.special_equipment.indexOf(id);
    if (idx >= 0) {
        window.currentVehicle.special_equipment.splice(idx, 1);
    } else {
        window.currentVehicle.special_equipment.push(id);
    }
    try {
        const card = document.querySelector(`[onclick="toggleSpecialEquipment('${id}')"]`);
        if (card) {
            const isSelected = window.currentVehicle.special_equipment.includes(id);
            if (isSelected) {
                card.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.remove('bg-slate-800/40', 'border-slate-700/50');
            } else {
                card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.add('bg-slate-800/40', 'border-slate-700/50');
            }
        }
    } catch (e) { /* noop */ }
    updateVehicleCalculations();
};

// Vehicle Summary Modal Functions
window.showVehicleSummaryModal = function() {
    const modal = document.getElementById('vehicle-summary-modal');
    if (!modal) return;
    
    // Generate vehicle summary content
    generateVehicleSummary();
    
    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.hideVehicleSummaryModal = function() {
    const modal = document.getElementById('vehicle-summary-modal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    document.body.style.overflow = '';
};

// Detailed component generation functions
function generateChassisDetails() {
    if (!currentVehicle.chassis) {
        return '<div class="text-slate-400 text-sm">Nenhum chassi selecionado</div>';
    }
    
    const chassisData = chassis[currentVehicle.chassis];
    if (!chassisData) return '<div class="text-slate-400 text-sm">Chassi não encontrado</div>';
    
    return `
        <div class="space-y-3">
            <h4 class="text-lg font-semibold text-slate-200">Chassi</h4>
            <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                <div class="text-sm font-medium text-slate-300 mb-2">${chassisData.name}</div>
                <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>Classe: ${chassisData.weight_class || 'N/A'}</div>
                    <div>Peso Base: ${(chassisData.base_weight/1000).toFixed(1)}t</div>
                    <div>Velocidade Base: ${chassisData.base_speed || 'N/A'} km/h</div>
                    <div>Tripulação: ${chassisData.crew_capacity || 'N/A'}</div>
                </div>
            </div>
        </div>
    `;
}

function generateDrivetrainDetails() {
    let html = '<h4 class="text-lg font-semibold text-slate-200">Sistema de Propulsão</h4>';
    
    // Engine
    if (currentVehicle.engine) {
        const engineData = engines[currentVehicle.engine];
        if (engineData) {
            const resolvedEngine = getResolvedComponent('engines', currentVehicle.engine);
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">🔧 ${engineData.name}</div>
                    <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div>Potência: ${resolvedEngine?.power || engineData.max_power || 'N/A'} hp</div>
                        <div>Combustível: ${resolvedEngine?.fuel_type || engineData.fuel_type || 'N/A'}</div>
                        <div>Consumo: ${resolvedEngine?.consumption || engineData.consumption || 'N/A'} L/h</div>
                        <div>Peso: ${resolvedEngine?.weight || engineData.weight || 'N/A'} kg</div>
                    </div>
                </div>
            `;
        }
    }
    
    // Transmission
    if (currentVehicle.transmission) {
        const transmissionData = transmissions[currentVehicle.transmission];
        if (transmissionData) {
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">⚙️ ${transmissionData.name}</div>
                    <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div>Tipo: ${transmissionData.type || 'N/A'}</div>
                        <div>Marchas: ${transmissionData.gears || 'N/A'}</div>
                        <div>Eficiência: ${Math.round((transmissionData.efficiency || 0.85) * 100)}%</div>
                        <div>Peso: ${transmissionData.weight || 'N/A'} kg</div>
                    </div>
                </div>
            `;
        }
    }
    
    // Suspension
    if (currentVehicle.suspension) {
        const suspensionData = suspensions[currentVehicle.suspension];
        if (suspensionData) {
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">🚗 ${suspensionData.name}</div>
                    <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div>Tipo: ${suspensionData.type || 'N/A'}</div>
                        <div>Curso: ${suspensionData.travel || 'N/A'} mm</div>
                        <div>Conforto: ${suspensionData.comfort_rating || 'N/A'}/5</div>
                        <div>Peso: ${suspensionData.weight || 'N/A'} kg</div>
                    </div>
                </div>
            `;
        }
    }
    
    return html;
}

function generateArmamentDetails() {
    let html = '';
    
    // Main Gun
    if (currentVehicle.main_gun_caliber && currentVehicle.main_gun_caliber > 0) {
        const caliber = currentVehicle.main_gun_caliber;
        const length = currentVehicle.main_gun_length_ratio || 40;
        const ammoType = currentVehicle.ammo_view || 'AP';
        const penetration = calculateMainGunPenetration();
        
        html += `
            <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                <div class="text-sm font-medium text-slate-300 mb-2">🎯 Canhão Principal</div>
                <div class="space-y-1 text-xs text-slate-400">
                    <div>Calibre: ${caliber}mm</div>
                    <div>Comprimento: L/${length}</div>
                    <div>Munição: ${ammoType}</div>
                    <div>Penetração: ${penetration}mm</div>
                </div>
            </div>
        `;
    }
    
    // Secondary Weapons
    if (currentVehicle.secondary_weapons && currentVehicle.secondary_weapons.length > 0) {
        currentVehicle.secondary_weapons.forEach(weaponId => {
            const weaponData = secondary_weapons[weaponId];
            if (weaponData) {
                html += `
                    <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                        <div class="text-sm font-medium text-slate-300 mb-2">🔫 ${weaponData.name}</div>
                        <div class="space-y-1 text-xs text-slate-400">
                            <div>Calibre: ${weaponData.caliber || 'N/A'}mm</div>
                            <div>ROF: ${weaponData.rate_of_fire || 'N/A'} rpm</div>
                            <div>Munição: ${weaponData.ammo_capacity || 'N/A'}</div>
                        </div>
                    </div>
                `;
            }
        });
    }
    
    // AA Guns
    if (currentVehicle.aa_gun) {
        const aaGunData = aa_guns[currentVehicle.aa_gun];
        if (aaGunData) {
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">🎯 ${aaGunData.name}</div>
                    <div class="space-y-1 text-xs text-slate-400">
                        <div>Calibre: ${aaGunData.caliber}mm</div>
                        <div>ROF: ${aaGunData.rate_of_fire} rpm</div>
                        <div>Alcance: ${aaGunData.effective_range}m</div>
                    </div>
                </div>
            `;
        }
    }
    
    if (!html) {
        html = '<div class="text-slate-400 text-sm col-span-3">Nenhum armamento selecionado</div>';
    }
    
    return html;
}

function generateArmorDetails() {
    let html = '<div class="space-y-3">';
    
    // Primary Armor
    html += '<h4 class="text-lg font-semibold text-slate-200">Blindagem Principal</h4>';
    
    const armorThickness = currentVehicle.armorThickness || currentVehicle.armor_thickness || 0;
    const armorMaterial = currentVehicle.armorMaterial || currentVehicle.armor_material;
    const armorAngle = currentVehicle.armorAngle;
    
    if (armorThickness > 0) {
        let materialName = 'Aço Padrão';
        if (armorMaterial && armor_materials[armorMaterial]) {
            materialName = armor_materials[armorMaterial].name;
        }
        
        let angleName = 'Vertical (90°)';
        if (armorAngle && armor_angles[armorAngle]) {
            angleName = armor_angles[armorAngle].name;
        }
        
        html += `
            <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>Espessura: ${armorThickness}mm</div>
                    <div>Material: ${materialName}</div>
                    <div>Ângulo: ${angleName}</div>
                    <div>Proteção Efetiva: ${calculateEffectiveArmor()}mm</div>
                </div>
            </div>
        `;
    } else {
        html += '<div class="text-slate-400 text-sm">Blindagem não configurada</div>';
    }
    
    html += '</div>';
    
    // Additional Armor
    const additionalArmor = currentVehicle.additional_armor || currentVehicle.additionalArmor || [];
    if (additionalArmor.length > 0) {
        html += '<div class="space-y-3">';
        html += '<h4 class="text-lg font-semibold text-slate-200">Blindagem Adicional</h4>';
        
        additionalArmor.forEach(armorId => {
            const armorData = additional_armor[armorId];
            if (armorData) {
                html += `
                    <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                        <div class="text-sm font-medium text-slate-300 mb-2">${armorData.name}</div>
                        <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
                            <div>Proteção: +${armorData.protection_bonus || 0}mm</div>
                            <div>Peso: +${armorData.weight_penalty || 0}kg</div>
                        </div>
                    </div>
                `;
            }
        });
        
        html += '</div>';
    }
    
    return html;
}

function generateSystemsDetails() {
    let html = '';
    
    // Fire Control System
    if (currentVehicle.fcs) {
        const fcsData = fire_control[currentVehicle.fcs];
        if (fcsData) {
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">🎯 Controle de Tiro</div>
                    <div class="text-xs text-slate-200 mb-1">${fcsData.name}</div>
                    <div class="space-y-1 text-xs text-slate-400">
                        <div>Tipo: ${fcsData.type || 'N/A'}</div>
                        <div>Precisão: +${fcsData.accuracy_bonus || 0}%</div>
                        <div>Consumo: ${fcsData.power_consumption || 0}kW</div>
                    </div>
                </div>
            `;
        }
    }
    
    // Optics System
    if (currentVehicle.optics) {
        const opticsData = optics_systems[currentVehicle.optics];
        if (opticsData) {
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">👁️ Sistema Ótico</div>
                    <div class="text-xs text-slate-200 mb-1">${opticsData.name}</div>
                    <div class="space-y-1 text-xs text-slate-400">
                        <div>Zoom: ${opticsData.magnification || 'N/A'}x</div>
                        <div>Visão Noturna: ${opticsData.night_vision ? 'Sim' : 'Não'}</div>
                        <div>Termal: ${opticsData.thermal ? 'Sim' : 'Não'}</div>
                    </div>
                </div>
            `;
        }
    }
    
    // Communication System
    if (currentVehicle.communication) {
        const commData = communication[currentVehicle.communication];
        if (commData) {
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">📡 Comunicação</div>
                    <div class="text-xs text-slate-200 mb-1">${commData.name}</div>
                    <div class="space-y-1 text-xs text-slate-400">
                        <div>Alcance: ${commData.range || 'N/A'}km</div>
                        <div>Canais: ${commData.channels || 'N/A'}</div>
                        <div>Criptografia: ${commData.encrypted ? 'Sim' : 'Não'}</div>
                    </div>
                </div>
            `;
        }
    }
    
    if (!html) {
        html = '<div class="text-slate-400 text-sm col-span-3">Nenhum sistema eletrônico selecionado</div>';
    }
    
    return html;
}

function generateCrewDetails() {
    const crewSize = currentVehicle.crewSize || 3;
    const trainingLevel = currentVehicle.trainingLevel || 'standard';
    
    const trainingNames = {
        rookie: 'Recruta',
        standard: 'Padrão', 
        veteran: 'Veterano',
        elite: 'Elite'
    };
    
    const crewRoles = {
        2: ['Motorista', 'Artilheiro'],
        3: ['Motorista', 'Artilheiro', 'Comandante'],
        4: ['Motorista', 'Artilheiro', 'Comandante', 'Carregador'],
        5: ['Motorista', 'Artilheiro', 'Comandante', 'Carregador', 'Operador de Rádio']
    };
    
    let html = `
        <div class="space-y-3">
            <h4 class="text-lg font-semibold text-slate-200">Composição</h4>
            <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
                    <div>Tamanho: ${crewSize} membros</div>
                    <div>Treinamento: ${trainingNames[trainingLevel]}</div>
                </div>
                <div class="space-y-1">
                    ${(crewRoles[crewSize] || crewRoles[3]).map((role, index) => 
                        `<div class="flex items-center gap-2 text-xs text-slate-300">
                            <span class="w-5 h-5 bg-brand-900/50 text-brand-300 rounded-full flex items-center justify-center text-xs font-bold">${index + 1}</span>
                            ${role}
                        </div>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Performance impact
    const trainingBonuses = {
        rookie: { accuracy: -10, reload: -15, mobility: -5 },
        standard: { accuracy: 0, reload: 0, mobility: 0 },
        veteran: { accuracy: 10, reload: 15, mobility: 5 },
        elite: { accuracy: 20, reload: 25, mobility: 10 }
    };
    
    const bonus = trainingBonuses[trainingLevel];
    
    html += `
        <div class="space-y-3">
            <h4 class="text-lg font-semibold text-slate-200">Impacto no Desempenho</h4>
            <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                <div class="space-y-1 text-xs">
                    <div class="flex justify-between">
                        <span class="text-slate-400">Precisão:</span>
                        <span class="${bonus.accuracy >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${bonus.accuracy > 0 ? '+' : ''}${bonus.accuracy}%
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Recarga:</span>
                        <span class="${bonus.reload >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${bonus.reload > 0 ? '+' : ''}${bonus.reload}%
                        </span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-slate-400">Mobilidade:</span>
                        <span class="${bonus.mobility >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${bonus.mobility > 0 ? '+' : ''}${bonus.mobility}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

function generateSpecialEquipmentSection() {
    const specialEquipment = currentVehicle.special_equipment || currentVehicle.specialEquipment || [];
    
    if (!specialEquipment || specialEquipment.length === 0) {
        return ''; // Don't show section if no equipment
    }
    
    let html = `
        <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
            <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span class="text-2xl">🛠️</span>
                Equipamentos Especiais
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    `;
    
    specialEquipment.forEach(equipId => {
        const equipData = special_equipment[equipId];
        if (equipData) {
            html += `
                <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-300 mb-2">${equipData.name}</div>
                    <div class="text-xs text-slate-400 mb-2">${equipData.description || ''}</div>
                    <div class="space-y-1 text-xs text-slate-400">
                        <div>Peso: ${equipData.weight || 0}kg</div>
                        <div>Consumo: ${equipData.energy_consumption || 0}kW</div>
                        <div>Custo: $${(equipData.cost || 0).toLocaleString()}</div>
                    </div>
                </div>
            `;
        }
    });
    
    html += '</div></div>';
    return html;
}

function calculateEffectiveArmor() {
    const thickness = currentVehicle.armorThickness || currentVehicle.armor_thickness || 0;
    const angle = currentVehicle.armorAngle;
    
    let effectiveness = thickness;
    
    if (angle && armor_angles[angle]) {
        effectiveness *= armor_angles[angle].effectiveness_multiplier || 1.0;
    }
    
    return Math.round(effectiveness);
}

function generateVehicleSummary() {
    const contentDiv = document.getElementById('vehicle-summary-content');
    if (!contentDiv) return;
    
    // Get current turn for year calculation (assuming turn 0 = 1954)
    const currentTurn = window.gameState?.currentTurn || 0;
    const developmentYear = 1954 + currentTurn;
    
    // Get vehicle name or generate default
    const vehicleName = currentVehicle.name || `Veículo Experimental ${Math.floor(Math.random() * 1000)}`;
    
    // Calculate performance metrics
    const performance = calculateVehiclePerformance();
    const cost = calculateTotalCost();
    const energy = calculateEnergyConsumption();
    
    contentDiv.innerHTML = `
        <div class="space-y-8">
            <!-- Header Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-slate-400 mb-2">Nome do Veículo</label>
                        <input 
                            type="text" 
                            id="vehicle-name-input"
                            value="${vehicleName}"
                            class="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="Nome do seu veículo"
                        >
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-2">Ano de Desenvolvimento</label>
                            <div class="px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-lg text-brand-300 font-semibold">
                                ${developmentYear}
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-slate-400 mb-2">Tipo</label>
                            <div class="px-4 py-3 bg-slate-800/40 border border-slate-700 rounded-lg text-brand-300 font-semibold">
                                ${getChassisDisplayName()}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Vehicle Image Upload -->
                <div class="relative">
                    <div id="vehicle-image-container" class="flex items-center justify-center bg-slate-800/40 border-2 border-dashed border-slate-600 rounded-xl p-8 transition-all duration-200 hover:border-brand-500 hover:bg-slate-800/60 cursor-pointer min-h-[200px]" onclick="triggerImageUpload()">
                        <div class="text-center">
                            <div id="vehicle-image-preview" class="hidden">
                                <img id="uploaded-vehicle-image" class="max-w-full max-h-48 rounded-lg object-contain mx-auto mb-4" alt="Imagem do Veículo">
                            </div>
                            <div id="vehicle-image-placeholder">
                                <div class="text-6xl mb-4">${getVehicleEmoji()}</div>
                                <p class="text-slate-400 mb-2">Clique para adicionar imagem do veículo</p>
                                <p class="text-xs text-slate-500">PNG, JPG ou GIF até 5MB</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Hidden file input -->
                    <input 
                        type="file" 
                        id="vehicle-image-input" 
                        class="hidden" 
                        accept="image/*" 
                        onchange="handleImageUpload(event)"
                    >
                    
                    <!-- Remove image button (shown when image is uploaded) -->
                    <button 
                        id="remove-image-btn" 
                        onclick="removeVehicleImage()" 
                        class="hidden absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                        title="Remover imagem"
                    >
                        <span class="text-sm">×</span>
                    </button>
                </div>
            </div>
            
            <!-- Technical Specifications -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Performance Stats -->
                <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span class="text-2xl">⚡</span>
                        Desempenho
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Velocidade Máxima</span>
                            <span class="font-semibold text-brand-300">${performance.maxSpeed || 0} km/h</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Aceleração</span>
                            <span class="font-semibold text-brand-300">${performance.acceleration || 0} km/h/s</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Peso Total</span>
                            <span class="font-semibold text-brand-300">${performance.totalWeight || 0} tons</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-slate-300">Potência Específica</span>
                            <span class="font-semibold text-brand-300">${performance.powerToWeight || 0} hp/ton</span>
                        </div>
                    </div>
                </div>
                
                <!-- Combat Stats -->
                <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span class="text-2xl">💥</span>
                        Capacidade de Combate
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Armamento Principal</span>
                            <span class="font-semibold text-brand-300">${currentVehicle.main_gun_caliber || 0}mm</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Penetração</span>
                            <span class="font-semibold text-brand-300">${calculateMainGunPenetration()}mm</span>
                        </div>
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Blindagem Frontal</span>
                            <span class="font-semibold text-brand-300">${currentVehicle.armorThickness || 0}mm</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-slate-300">Tripulação</span>
                            <span class="font-semibold text-brand-300">${currentVehicle.crewSize || 3} membros</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Detailed Components Sections -->
            
            <!-- Chassis & Drivetrain -->
            <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span class="text-2xl">🏗️</span>
                    Chassi e Sistema de Propulsão
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-3">
                        ${generateChassisDetails()}
                    </div>
                    <div class="space-y-3">
                        ${generateDrivetrainDetails()}
                    </div>
                </div>
            </div>
            
            <!-- Armaments -->
            <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span class="text-2xl">🔫</span>
                    Sistema de Armamento
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${generateArmamentDetails()}
                </div>
            </div>
            
            <!-- Armor System -->
            <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span class="text-2xl">🛡️</span>
                    Sistema de Blindagem
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${generateArmorDetails()}
                </div>
            </div>
            
            <!-- Electronics & Systems -->
            <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span class="text-2xl">📡</span>
                    Sistemas Eletrônicos
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${generateSystemsDetails()}
                </div>
            </div>
            
            <!-- Crew -->
            <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <span class="text-2xl">👥</span>
                    Tripulação
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${generateCrewDetails()}
                </div>
            </div>
            
            <!-- Special Equipment -->
            ${generateSpecialEquipmentSection()}
            
            <!-- Cost & Energy -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span class="text-2xl">💰</span>
                        Custos
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Custo por Unidade</span>
                            <span class="font-semibold text-green-400">$${((cost.perUnit || 0) / 1000).toFixed(0)}K</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-slate-300">Manutenção por Unidade/Ano</span>
                            <span class="font-semibold text-yellow-400">$${getCostSystemMaintenanceCost().toFixed(0)}K</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
                    <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span class="text-2xl">⚡</span>
                        Energia
                    </h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center py-2 border-b border-slate-700/50">
                            <span class="text-slate-300">Consumo Total</span>
                            <span class="font-semibold text-blue-400">${energy.total || 0} kW</span>
                        </div>
                        <div class="flex justify-between items-center py-2">
                            <span class="text-slate-300">Eficiência</span>
                            <span class="font-semibold text-blue-400">${energy.efficiency || 0}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize image drag & drop after content is loaded
    setTimeout(() => {
        setupImageDragDrop();
        
        // Load existing image if present
        if (currentVehicle.vehicleImage) {
            displayVehicleImage(currentVehicle.vehicleImage);
        }
        
        // Show admin country selection if user is admin/narrator
        setupAdminCountrySelection();
    }, 100);
}

function getChassisDisplayName() {
    if (!currentVehicle.chassis) return 'Não Selecionado';
    const chassisData = chassis[currentVehicle.chassis];
    return chassisData ? chassisData.name : 'Chassi Personalizado';
}

function getVehicleEmoji() {
    if (!currentVehicle.chassis) return '🚗';
    const chassisData = chassis[currentVehicle.chassis];
    if (!chassisData) return '🚗';
    
    // Use weight_class from the actual data structure
    switch (chassisData.weight_class) {
        case 'light': return '🚙';
        case 'medium': return '🚚';
        case 'heavy': return '🚛';
        case 'super_heavy': return '🏗️';
        default: return '🚗';
    }
}

function calculateMainGunPenetration() {
    const caliber = currentVehicle.main_gun_caliber || 75;
    const length = currentVehicle.main_gun_length_ratio || 40;
    const ammoType = currentVehicle.ammo_view || 'AP';
    
    const basePenetration = (caliber * length) / 25; // Consistent with other calculations
    const ammoMultipliers = {
        'AP': 1.0,     // Standard AP rounds
        'APCR': 1.4,   // Tungsten core, higher velocity
        'APDS': 1.8,   // Advanced sabot design
        'HEAT': 1.6,   // Chemical energy penetrator
        'HE': 0.15     // High explosive, minimal penetration
    };
    
    return Math.round(basePenetration * (ammoMultipliers[ammoType] || 1.0));
}

function generateComponentsList() {
    const components = [
        { label: 'Chassi', value: getComponentName('chassis', currentVehicle.chassis) },
        { label: 'Motor', value: getComponentName('engines', currentVehicle.engine) },
        { label: 'Transmissão', value: getComponentName('transmissions', currentVehicle.transmission) },
        { label: 'Suspensão', value: getComponentName('suspensions', currentVehicle.suspension) },
        { label: 'Óptica', value: getComponentName('optics_systems', currentVehicle.optics_system) },
        { label: 'Comunicação', value: getComponentName('communication', currentVehicle.communication_system) }
    ].filter(comp => comp.value !== 'Não Selecionado');
    
    return components.map(comp => `
        <div class="bg-slate-900/40 border border-slate-700/30 rounded-lg p-3">
            <div class="text-xs font-medium text-slate-400 mb-1">${comp.label}</div>
            <div class="text-sm text-slate-200">${comp.value}</div>
        </div>
    `).join('');
}

function getComponentName(componentType, componentId) {
    if (!componentId) return 'Não Selecionado';
    
    let componentData;
    switch (componentType) {
        case 'chassis':
            componentData = chassis[componentId];
            break;
        case 'engines':
            componentData = engines[componentId];
            break;
        case 'transmissions':
            componentData = transmissions[componentId];
            break;
        case 'suspensions':
            componentData = suspensions[componentId];
            break;
        case 'optics_systems':
            componentData = optics_systems[componentId];
            break;
        case 'communication':
            componentData = communication[componentId];
            break;
    }
    
    return componentData ? componentData.name : 'Componente Personalizado';
}

// Export to PDF
window.exportVehicleToPDF = function() {
    const vehicleName = document.getElementById('vehicle-name-input')?.value || 'Veiculo';
    
    // Create a temporary div with the content for PDF
    const printContent = document.createElement('div');
    printContent.innerHTML = document.getElementById('vehicle-summary-content').innerHTML;
    
    // Include vehicle image in PDF if present
    let imageHtml = '';
    if (currentVehicle.vehicleImage) {
        imageHtml = `
            <div style="text-align: center; margin: 20px 0;">
                <img src="${currentVehicle.vehicleImage}" 
                     style="max-width: 300px; max-height: 300px; border-radius: 8px; border: 1px solid #dee2e6;" 
                     alt="Imagem do Veículo">
            </div>
        `;
    }
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Ficha do Veículo - ${vehicleName}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; line-height: 1.4; }
                .space-y-8 > * { margin-bottom: 2rem; }
                .grid { display: grid; gap: 1rem; }
                .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
                .bg-slate-800 { background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 1rem; border-radius: 8px; }
                .text-xl { font-size: 1.25rem; font-weight: bold; margin-bottom: 1rem; }
                .font-semibold { font-weight: 600; }
                .text-brand-300 { color: #3b82f6; }
                .text-yellow-400 { color: #f59e0b; }
                .text-blue-400 { color: #60a5fa; }
                .text-green-400 { color: #10b981; }
                input { border: 1px solid #ccc; padding: 8px; border-radius: 4px; }
                h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
                .hidden { display: none !important; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <h1>📋 Ficha Completa do Veículo - ${vehicleName}</h1>
            ${imageHtml}
            ${printContent.innerHTML}
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center; color: #6b7280; font-size: 12px;">
                Gerado automaticamente pelo Sistema de Criação de Veículos War1954
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
};

// Update weapons summary display
function updateWeaponsSummary() {
    if (!currentVehicle) return;
    
    // Update secondary weapons count
    const secondaryCount = Array.isArray(currentVehicle.secondary_weapons) ? currentVehicle.secondary_weapons.length : 0;
    const secondaryDpsDisplay = document.getElementById('summary-secondary-dps');
    if (secondaryDpsDisplay) {
        secondaryDpsDisplay.textContent = secondaryCount + '.0';
    }
    
    // Update AA weapons count
    const aaCount = currentVehicle.aa_gun ? 1 : 0;
    const aaDpsDisplay = document.getElementById('summary-aa-dps');
    if (aaDpsDisplay) {
        aaDpsDisplay.textContent = aaCount + '.0';
    }
}

// Vehicle performance calculation functions for the summary modal
function calculateVehiclePerformance() {
    if (!currentVehicle) return { maxSpeed: 0, acceleration: 0, totalWeight: 0, powerToWeight: 0 };
    
    // Get component data - components are objects, not arrays
    const chassisData = currentVehicle.chassis ? chassis[currentVehicle.chassis] : null;
    const engineData = currentVehicle.engine ? engines[currentVehicle.engine] : null;
    const transmissionData = currentVehicle.transmission ? transmissions[currentVehicle.transmission] : null;
    
    // Calculate basic metrics
    const baseWeight = (chassisData?.base_weight || 20000) / 1000; // Convert kg to tons
    const armorWeight = (currentVehicle.armorThickness || 80) * 0.05; // Simplified armor weight in tons
    const engineWeight = (engineData?.weight || 2000) / 1000; // Convert kg to tons
    const totalWeight = Math.round((baseWeight + armorWeight + engineWeight) * 10) / 10;
    
    const enginePower = engineData?.max_power || 300;
    const powerToWeight = Math.round((enginePower / totalWeight) * 10) / 10;
    
    // Calculate performance based on power-to-weight ratio and transmission efficiency
    const transmissionEfficiency = transmissionData?.efficiency || 0.85;
    const maxSpeed = Math.round(Math.min(chassisData?.base_speed || 50, powerToWeight * 2.5 * transmissionEfficiency));
    const acceleration = Math.round((powerToWeight * transmissionEfficiency * 0.08) * 100) / 100;
    
    return {
        maxSpeed,
        acceleration,
        totalWeight,
        powerToWeight
    };
}

function calculateTotalCost() {
    if (!currentVehicle) return { total: 0, perUnit: 0 };
    
    // Always use CostSystem for consistency with the cost analysis panel
    if (window.CostSystem && typeof window.CostSystem.calculateCosts === 'function') {
        const costs = window.CostSystem.calculateCosts(currentVehicle);
        return {
            total: Math.round(costs.production), // Keep original values, not converted to K
            perUnit: Math.round(costs.production) // Use production cost as per unit cost
        };
    }
    
    // Fallback calculation if CostSystem is not available
    console.warn('CostSystem não disponível, usando cálculo simplificado');
    return { total: 0, perUnit: 0 };
}

function getCostSystemMaintenanceCost() {
    if (!currentVehicle) return 0;
    
    // Get maintenance cost from CostSystem
    if (window.CostSystem && typeof window.CostSystem.calculateCosts === 'function') {
        const costs = window.CostSystem.calculateCosts(currentVehicle);
        return (costs.maintenance || 0) / 1000; // Convert to K format
    }
    
    return 0;
}

function calculateEnergyConsumption() {
    if (!currentVehicle) return { total: 0, efficiency: 0 };
    
    // Get engine data - access as object property
    const engineData = currentVehicle.engine ? engines[currentVehicle.engine] : null;
    const enginePower = engineData?.max_power || 300;
    
    // Calculate base energy consumption
    const baseConsumption = Math.round(enginePower * 0.8); // kW
    
    // Add system consumption
    const systemConsumption = 
        (currentVehicle.optics_system ? 15 : 0) +
        (currentVehicle.communication_system ? 10 : 0) +
        (currentVehicle.fcs ? 20 : 0) +
        (currentVehicle.special_equipment?.length || 0) * 5;
    
    const total = baseConsumption + systemConsumption;
    
    // Calculate efficiency based on engine and transmission
    const transmissionData = currentVehicle.transmission ? transmissions[currentVehicle.transmission] : null;
    const baseEfficiency = (transmissionData?.efficiency || 0.85) * 100;
    const efficiency = Math.round(baseEfficiency * 0.9); // Account for other losses
    
    return { total, efficiency };
}

// Vehicle Image Management
window.triggerImageUpload = function() {
    document.getElementById('vehicle-image-input').click();
};

window.handleImageUpload = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!validateImageFile(file)) {
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageUrl = e.target.result;
        
        // Store image in current vehicle
        currentVehicle.vehicleImage = imageUrl;
        
        // Update UI
        displayVehicleImage(imageUrl);
        
        console.log('Imagem do veículo carregada com sucesso');
    };
    
    reader.readAsDataURL(file);
};

function validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        showImageError('Formato não suportado. Use PNG, JPG, GIF ou WebP.');
        return false;
    }
    
    if (file.size > maxSize) {
        showImageError('Imagem muito grande. Máximo 5MB.');
        return false;
    }
    
    return true;
}

function displayVehicleImage(imageUrl) {
    const placeholder = document.getElementById('vehicle-image-placeholder');
    const preview = document.getElementById('vehicle-image-preview');
    const image = document.getElementById('uploaded-vehicle-image');
    const removeBtn = document.getElementById('remove-image-btn');
    const container = document.getElementById('vehicle-image-container');
    
    if (placeholder && preview && image && removeBtn && container) {
        // Hide placeholder, show preview
        placeholder.classList.add('hidden');
        preview.classList.remove('hidden');
        removeBtn.classList.remove('hidden');
        
        // Set image source
        image.src = imageUrl;
        
        // Update container styling
        container.classList.remove('border-dashed', 'cursor-pointer');
        container.classList.add('border-solid');
        container.onclick = null; // Remove click to upload when image is present
    }
}

window.removeVehicleImage = function() {
    const placeholder = document.getElementById('vehicle-image-placeholder');
    const preview = document.getElementById('vehicle-image-preview');
    const image = document.getElementById('uploaded-vehicle-image');
    const removeBtn = document.getElementById('remove-image-btn');
    const container = document.getElementById('vehicle-image-container');
    const input = document.getElementById('vehicle-image-input');
    
    if (placeholder && preview && image && removeBtn && container && input) {
        // Show placeholder, hide preview
        preview.classList.add('hidden');
        placeholder.classList.remove('hidden');
        removeBtn.classList.add('hidden');
        
        // Clear image source
        image.src = '';
        input.value = '';
        
        // Remove from vehicle data
        delete currentVehicle.vehicleImage;
        
        // Restore container styling
        container.classList.add('border-dashed', 'cursor-pointer');
        container.classList.remove('border-solid');
        container.onclick = triggerImageUpload;
        
        console.log('Imagem do veículo removida');
    }
};

function showImageError(message) {
    // Create temporary error message
    const container = document.getElementById('vehicle-image-container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'absolute top-2 left-2 right-2 bg-red-600 text-white text-xs px-3 py-2 rounded-lg z-10';
        errorDiv.textContent = message;
        
        container.appendChild(errorDiv);
        
        setTimeout(() => {
            if (container.contains(errorDiv)) {
                container.removeChild(errorDiv);
            }
        }, 3000);
    }
}

// Drag and drop support
window.setupImageDragDrop = function() {
    const container = document.getElementById('vehicle-image-container');
    if (!container) return;
    
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        container.classList.add('border-brand-500', 'bg-slate-800/80');
    });
    
    container.addEventListener('dragleave', function(e) {
        e.preventDefault();
        container.classList.remove('border-brand-500', 'bg-slate-800/80');
    });
    
    container.addEventListener('drop', function(e) {
        e.preventDefault();
        container.classList.remove('border-brand-500', 'bg-slate-800/80');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (validateImageFile(file)) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imageUrl = e.target.result;
                    currentVehicle.vehicleImage = imageUrl;
                    displayVehicleImage(imageUrl);
                    console.log('Imagem arrastada e carregada com sucesso');
                };
                reader.readAsDataURL(file);
            }
        }
    });
};

// Submit vehicle for approval
window.submitForApproval = async function() {
    const vehicleName = document.getElementById('vehicle-name-input')?.value;
    const quantity = parseInt(document.getElementById('vehicle-quantity-input')?.value) || 50;
    const button = document.getElementById('submit-approval-btn');
    const statusDiv = document.getElementById('submission-status');
    
    // Validation
    if (!vehicleName || vehicleName.trim().length < 3) {
        showSubmissionMessage('❌ Nome do veículo deve ter pelo menos 3 caracteres', 'error');
        return;
    }
    
    if (quantity < 1 || quantity > 1000) {
        showSubmissionMessage('❌ Quantidade deve estar entre 1 e 1000 unidades', 'error');
        return;
    }
    
    if (!currentVehicle.chassis || !currentVehicle.engine) {
        showSubmissionMessage('❌ Chassi e Motor são obrigatórios', 'error');
        return;
    }
    
    // Update vehicle name
    currentVehicle.name = vehicleName.trim();
    
    // Disable button and show loading
    if (button) {
        button.disabled = true;
        button.innerHTML = '<span class="flex items-center gap-2"><span class="animate-spin">⏳</span><span>Enviando...</span></span>';
    }
    
    try {
        // Determine vehicle category
        const category = determineVehicleCategory(currentVehicle);
        
        // Get current user info
        const user = window.firebase?.auth()?.currentUser;
        if (!user) {
            throw new Error('Usuário não está logado');
        }
        
        // Get user's country
        let userCountry;
        try {
            userCountry = await getUserCountry(user.uid);
            console.log('🏁 País detectado:', userCountry);
        } catch (countryError) {
            console.error('Erro ao detectar país:', countryError);
            throw new Error('Erro ao detectar país do usuário: ' + countryError.message);
        }
        
        // Handle country selection
        if (!userCountry) {
            throw new Error('Usuário não está vinculado a um país. Contate o administrador.');
        }
        
        // For admin/narrator, check for manual country selection
        if (userCountry.id === 'admin-manual') {
            const selectedCountryId = document.getElementById('vehicle-target-country')?.value;
            if (selectedCountryId && selectedCountryId !== '') {
                console.log('🎯 Admin selecionou país:', selectedCountryId);
                try {
                    const db = window.firebase.firestore();
                    const countryDoc = await db.collection('paises').doc(selectedCountryId).get();
                    if (countryDoc.exists) {
                        const countryData = countryDoc.data();
                        userCountry = {
                            id: selectedCountryId,
                            name: countryData.Pais || 'País Selecionado'
                        };
                        console.log('✅ País resolvido:', userCountry);
                    } else {
                        userCountry = {
                            id: selectedCountryId,
                            name: selectedCountryId
                        };
                        console.log('⚠️ País não encontrado, usando ID:', userCountry);
                    }
                } catch (error) {
                    console.log('💥 Erro ao buscar dados do país selecionado:', error);
                    userCountry = {
                        id: selectedCountryId,
                        name: selectedCountryId
                    };
                }
            } else {
                throw new Error('Admin/Narrador deve selecionar um país de destino.');
            }
        }
        
        // Clean and prepare vehicle data (remove functions, undefined values, etc.)
        const cleanVehicleData = cleanObjectForFirebase({
            ...currentVehicle,
            submissionId: generateSubmissionId(),
            version: '1.0'
        });
        
        // Prepare submission data
        const submissionData = {
            // Vehicle data (cleaned)
            vehicleData: cleanVehicleData,
            
            // Submission metadata
            playerId: user.uid,
            playerName: user.displayName || user.email || 'Usuário Desconhecido',
            playerEmail: user.email || '',
            countryId: userCountry.id,
            countryName: userCountry.name,
            
            // Production info
            quantity: quantity,
            category: category,
            
            // Status tracking
            status: 'pending',
            submittedAt: window.firebase.firestore.Timestamp.now(),
            lastUpdated: window.firebase.firestore.Timestamp.now(),
            
            // Admin fields (empty initially)
            reviewedBy: null,
            reviewedAt: null,
            reviewComments: '',
            approvedQuantity: 0
        };
        
        // Generate and upload vehicle sheet as image
        console.log('📸 Gerando captura da ficha técnica...');
        const sheetResult = await captureAndUploadVehicleSheet(submissionData);
        
        // Add both image URL and fallback HTML to submission data
        if (sheetResult && typeof sheetResult === 'object') {
            // New format with both PNG and HTML
            submissionData.imageUrl = sheetResult.pngUrl;
            submissionData.vehicleSheetImageUrl = sheetResult.htmlUrl || sheetResult.pngUrl;
            submissionData.hasVisualSheet = !!sheetResult.pngUrl;
        } else {
            // Legacy format (HTML only)
            submissionData.vehicleSheetImageUrl = sheetResult;
            submissionData.hasVisualSheet = sheetResult && sheetResult.startsWith('http');
        }
        
        console.log('🧹 Dados limpos para envio:', submissionData);
        console.log('📊 Tamanho dos dados:', JSON.stringify(submissionData).length, 'caracteres');
        
        // Submit to Firebase
        await submitVehicleForApproval(submissionData);
        
        // Success feedback
        showSubmissionMessage(`✅ Veículo "${vehicleName}" enviado para aprovação! (${quantity} unidades)`, 'success');
        
        // Reset button after delay
        setTimeout(() => {
            if (button) {
                button.disabled = false;
                button.innerHTML = '<span class="flex items-center gap-2"><span>📋</span><span>Enviar para Aprovação</span></span>';
            }
        }, 3000);
        
    } catch (error) {
        console.error('💥 Erro ao enviar para aprovação:', error);
        console.error('🔍 Detalhes do erro:', {
            code: error.code,
            message: error.message,
            details: error.details || error.stack
        });
        
        let errorMessage = error.message;
        if (error.code === 'invalid-argument') {
            errorMessage = 'Dados do veículo inválidos. Verifique se todos os campos estão preenchidos corretamente.';
        } else if (error.code === 'permission-denied') {
            errorMessage = 'Permissão negada. Verifique suas credenciais.';
        }
        
        showSubmissionMessage(`❌ Erro: ${errorMessage}`, 'error');
        
        // Reset button
        if (button) {
            button.disabled = false;
            button.innerHTML = '<span class="flex items-center gap-2"><span>📋</span><span>Enviar para Aprovação</span></span>';
        }
    }
};

// Helper functions
function showSubmissionMessage(message, type) {
    const statusDiv = document.getElementById('submission-status');
    if (!statusDiv) return;
    
    const bgColor = type === 'success' ? 'bg-green-600/20 border-green-500/50 text-green-300' : 'bg-red-600/20 border-red-500/50 text-red-300';
    
    statusDiv.className = `mt-3 rounded-lg p-3 text-sm border ${bgColor}`;
    statusDiv.textContent = message;
    statusDiv.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.classList.add('hidden');
    }, 5000);
}

function determineVehicleCategory(vehicle) {
    // Logic to determine category based on vehicle specs
    const weight = calculateTotalWeight(vehicle);
    const hasMainGun = (vehicle.main_gun_caliber || 0) > 0;
    const mainGunSize = vehicle.main_gun_caliber || 0;
    
    if (hasMainGun && mainGunSize >= 100 && weight > 40) {
        return 'MBT'; // Main Battle Tank
    } else if (hasMainGun && mainGunSize >= 70 && weight > 20) {
        return 'Medium Tank';
    } else if (hasMainGun && weight < 20) {
        return 'Light Tank';
    } else if (vehicle.secondary_weapons?.length > 0) {
        return 'IFV'; // Infantry Fighting Vehicle
    } else {
        return 'APC'; // Armored Personnel Carrier
    }
}

function calculateTotalWeight(vehicle) {
    // Simplified weight calculation
    const chassisData = chassis[vehicle.chassis];
    const engineData = engines[vehicle.engine];
    
    const baseWeight = chassisData?.base_weight || 20000; // kg
    const engineWeight = engineData?.weight || 1000;
    const armorWeight = (vehicle.armorThickness || 50) * 100; // simplified
    
    return (baseWeight + engineWeight + armorWeight) / 1000; // return in tons
}

function generateSubmissionId() {
    return 'VEH-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
}

// Clean object for Firebase (remove functions, undefined, etc.)
function cleanObjectForFirebase(obj, depth = 0) {
    // Prevent infinite recursion and excessive depth
    if (depth > 10) {
        console.warn('⚠️ Máxima profundidade atingida, truncando objeto');
        return null;
    }
    
    if (obj === null || obj === undefined) {
        return null;
    }
    
    if (typeof obj === 'function') {
        return null; // Remove functions
    }
    
    if (typeof obj === 'symbol') {
        return null; // Remove symbols
    }
    
    if (typeof obj !== 'object') {
        // Primitive values - check if valid
        if (typeof obj === 'number') {
            if (!isFinite(obj)) {
                return 0; // Replace NaN/Infinity with 0
            }
            // Round numbers to avoid precision issues
            return Math.round(obj * 1000) / 1000;
        }
        
        if (typeof obj === 'string') {
            // Limit string length to prevent size issues
            return obj.length > 10000 ? obj.substring(0, 10000) + '...' : obj;
        }
        
        return obj;
    }
    
    // Handle Date objects
    if (obj instanceof Date) {
        return obj.toISOString();
    }
    
    // Handle DOM elements or other complex objects
    if (obj.nodeType || obj instanceof Element || obj instanceof HTMLElement) {
        return null; // Remove DOM elements
    }
    
    // Handle objects with circular references or special properties
    try {
        JSON.stringify(obj);
    } catch (error) {
        console.warn('⚠️ Objeto com referências circulares detectado, convertendo para string:', error.message);
        return obj.toString();
    }
    
    if (Array.isArray(obj)) {
        const cleanedArray = [];
        for (let i = 0; i < obj.length && i < 100; i++) { // Limit array size
            const cleanItem = cleanObjectForFirebase(obj[i], depth + 1);
            if (cleanItem !== null && cleanItem !== undefined) {
                cleanedArray.push(cleanItem);
            }
        }
        return cleanedArray;
    }
    
    // Regular object - flatten complex structures
    const cleaned = {};
    let propertyCount = 0;
    
    for (const [key, value] of Object.entries(obj)) {
        // Limit number of properties to prevent size issues
        if (propertyCount >= 50) {
            console.warn('⚠️ Muitas propriedades, truncando objeto');
            break;
        }
        
        // Skip problematic keys
        if (key.startsWith('_') || 
            key.startsWith('$') || 
            key.includes('constructor') ||
            key.includes('prototype') ||
            key.includes('__')) {
            continue;
        }
        
        // Validate key name
        if (typeof key !== 'string' || key.length > 100) {
            continue;
        }
        
        const cleanValue = cleanObjectForFirebase(value, depth + 1);
        
        if (cleanValue !== null && cleanValue !== undefined) {
            // Convert complex objects to simpler representations
            if (typeof cleanValue === 'object' && !Array.isArray(cleanValue)) {
                const objectSize = JSON.stringify(cleanValue).length;
                if (objectSize > 1000) {
                    // Convert large objects to summary
                    cleaned[key] = {
                        type: 'complex_object',
                        summary: Object.keys(cleanValue).slice(0, 10),
                        size: objectSize
                    };
                } else {
                    cleaned[key] = cleanValue;
                }
            } else {
                cleaned[key] = cleanValue;
            }
            propertyCount++;
        }
    }
    
    return cleaned;
}

async function getUserCountry(userId) {
    try {
        console.log('🔍 Buscando país para usuário:', userId);
        
        // Check if we have Firebase available
        if (!window.firebase || !window.firebase.firestore) {
            throw new Error('Firebase não está disponível');
        }
        
        const db = window.firebase.firestore();
        
        // Method 1: Check user document directly for paisId
        console.log('📋 Verificando documento do usuário...');
        const userDoc = await db.collection('usuarios').doc(userId).get();
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            console.log('👤 Dados do usuário:', userData);
            
            // Check if admin/narrator - they can submit for any country
            if (userData.papel === 'admin' || userData.papel === 'narrador') {
                console.log('🔑 Usuário é admin/narrador - permitindo seleção manual');
                return {
                    id: 'admin-manual',
                    name: 'Admin/Narrador (Seleção Manual)'
                };
            }
            
            // Regular player - check paisId
            if (userData.paisId) {
                console.log('🌍 PaisId encontrado no usuário:', userData.paisId);
                
                // Try to get country data
                try {
                    const countryDoc = await db.collection('paises').doc(userData.paisId).get();
                    if (countryDoc.exists) {
                        const countryData = countryDoc.data();
                        console.log('✅ Dados do país:', countryData);
                        return {
                            id: userData.paisId,
                            name: countryData.Pais || 'País Desconhecido'
                        };
                    }
                } catch (countryError) {
                    console.log('⚠️ Erro ao buscar dados do país:', countryError.message);
                }
                
                // Return basic info if country data fetch failed
                return {
                    id: userData.paisId,
                    name: `País: ${userData.paisId}`
                };
            }
        }
        
        // Method 2: Search in countries collection for this user
        console.log('🔎 Buscando na coleção países...');
        const countriesQuery = await db.collection('paises')
            .where('Player', '==', userId)
            .limit(1)
            .get();
            
        if (!countriesQuery.empty) {
            const countryDoc = countriesQuery.docs[0];
            const countryData = countryDoc.data();
            console.log('🎯 País encontrado via busca:', countryDoc.id, countryData);
            return {
                id: countryDoc.id,
                name: countryData.Pais || 'País Desconhecido'
            };
        }
        
        console.log('❌ Nenhum país encontrado para o usuário');
        return null;
    } catch (error) {
        console.error('💥 Erro ao buscar país do usuário:', error);
        throw error;
    }
}

async function submitVehicleForApproval(submissionData) {
    if (!window.firebase || !window.firebase.firestore) {
        throw new Error('Firebase não inicializado');
    }
    
    const db = window.firebase.firestore();
    
    // Submit to vehicles_pending collection
    console.log('📤 Enviando dados para Firebase:', submissionData);
    const docRef = await db.collection('vehicles_pending').add(submissionData);
    
    console.log('✅ Veículo enviado para aprovação com ID:', docRef.id);
    return docRef.id;
}

// Setup admin country selection
async function setupAdminCountrySelection() {
    try {
        console.log('⚙️ Configurando seleção de país...');
        
        const user = window.firebase?.auth()?.currentUser;
        if (!user) {
            console.log('❌ Usuário não logado');
            return;
        }
        
        const adminCountryDiv = document.getElementById('admin-country-selection');
        const countrySelect = document.getElementById('vehicle-target-country');
        
        if (!adminCountryDiv || !countrySelect) {
            console.log('❌ Elementos não encontrados');
            return;
        }
        
        const db = window.firebase.firestore();
        
        // Check if user is admin/narrator
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        if (!userDoc.exists) {
            console.log('❌ Documento do usuário não existe');
            return;
        }
        
        const userData = userDoc.data();
        console.log('👤 Papel do usuário:', userData.papel);
        const isAdminOrNarrator = userData.papel === 'admin' || userData.papel === 'narrador';
        
        if (isAdminOrNarrator) {
            console.log('✅ Mostrando seleção de país para admin/narrador');
            adminCountryDiv.classList.remove('hidden');
            
            // Load countries directly from Firebase
            console.log('📋 Carregando países...');
            const countriesQuery = await db.collection('paises').get();
            
            // Clear and populate select
            countrySelect.innerHTML = '<option value="">Selecione um país...</option>';
            
            countriesQuery.docs.forEach(doc => {
                const country = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = country.Pais || doc.id;
                countrySelect.appendChild(option);
            });
            
            console.log(`📊 ${countriesQuery.docs.length} países carregados`);
            
            // Pre-select the country that shows in header (pais_1756500489204_93)
            const headerCountry = document.body.textContent?.match(/pais_\d+_\d+/)?.[0];
            if (headerCountry) {
                const headerOption = Array.from(countrySelect.options).find(opt => opt.value === headerCountry);
                if (headerOption) {
                    headerOption.selected = true;
                    console.log('🎯 País do cabeçalho pré-selecionado:', headerCountry);
                }
            } else {
                // Fallback to URSS
                const urssOption = Array.from(countrySelect.options).find(opt => 
                    opt.textContent.toLowerCase().includes('urss') || 
                    opt.textContent.toLowerCase().includes('união soviética') ||
                    opt.textContent.toLowerCase().includes('soviet')
                );
                if (urssOption) {
                    urssOption.selected = true;
                    console.log('🎯 URSS pré-selecionada');
                }
            }
            
        } else {
            console.log('🔒 Ocultando seleção para jogador normal');
            adminCountryDiv.classList.add('hidden');
        }
    } catch (error) {
        console.error('💥 Erro ao configurar seleção de país:', error);
        
        // Show error in select
        const countrySelect = document.getElementById('vehicle-target-country');
        if (countrySelect) {
            countrySelect.innerHTML = '<option value="">Erro ao carregar países</option>';
        }
    }
}

// Capture vehicle sheet as image and upload to Firebase Storage
async function captureAndUploadVehicleSheet(submissionData) {
    try {
        console.log('🚀 === INICIANDO CAPTURA DE FICHA ===');
        console.log('📋 Dados da submissão:', submissionData);
        
        // Get the modal content (the entire vehicle sheet)
        const sheetElement = document.getElementById('vehicle-summary-content');
        console.log('🎯 Elemento da ficha encontrado:', !!sheetElement);
        if (!sheetElement) {
            throw new Error('Elemento da ficha não encontrado');
        }
        
        // Check if html2canvas is available
        console.log('🖼️ html2canvas disponível:', typeof html2canvas !== 'undefined');
        if (typeof html2canvas === 'undefined') {
            console.log('⚠️ html2canvas não disponível, usando método alternativo');
            const htmlResult = await uploadTextBasedSheet(submissionData);
            return { pngUrl: null, htmlUrl: htmlResult };
        }
        
        // Check Firebase Storage availability
        console.log('🔥 Firebase disponível:', !!window.firebase);
        console.log('☁️ Storage disponível:', !!window.firebase?.storage);
        
        if (!window.firebase?.storage) {
            console.error('❌ Firebase Storage não disponível!');
            const htmlResult = await uploadTextBasedSheet(submissionData);
            return { pngUrl: null, htmlUrl: htmlResult };
        }
        
        // Configure html2canvas options
        const options = {
            backgroundColor: '#1e293b', // Slate-800 background
            width: 1200,
            height: Math.max(sheetElement.scrollHeight, 800),
            useCORS: true,
            scale: 2, // High resolution
            logging: false
        };
        
        console.log('🖼️ Capturando imagem da ficha...');
        const canvas = await html2canvas(sheetElement, options);
        console.log('✅ Canvas capturado:', canvas.width + 'x' + canvas.height);
        
        // Convert canvas to blob
        console.log('💾 Convertendo para arquivo...');
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 0.9);
        });
        console.log('✅ Blob criado:', blob?.size, 'bytes');
        
        if (!blob) {
            throw new Error('Falha ao criar blob da imagem');
        }
        
        // Upload to Firebase Storage
        console.log('☁️ Fazendo upload para Firebase Storage...');
        const downloadURL = await uploadToFirebaseStorage(blob, submissionData);
        
        console.log('✅ Imagem PNG da ficha enviada:', downloadURL);
        console.log('🔗 URL completa:', downloadURL);
        
        // Also generate HTML fallback
        const htmlUrl = await uploadTextBasedSheet(submissionData);
        
        return {
            pngUrl: downloadURL,
            htmlUrl: htmlUrl
        };
        
    } catch (error) {
        console.error('💥 Erro ao capturar ficha PNG:', error);
        
        // Fallback: upload text-based version only
        try {
            console.log('🔄 Tentando método alternativo (HTML apenas)...');
            const htmlUrl = await uploadTextBasedSheet(submissionData);
            return {
                pngUrl: null,
                htmlUrl: htmlUrl
            };
        } catch (fallbackError) {
            console.error('💥 Erro no método alternativo:', fallbackError);
            return null; // Continue without image
        }
    }
}

// Upload blob to Firebase Storage
async function uploadToFirebaseStorage(blob, submissionData) {
    console.log('🔥 === INICIANDO UPLOAD PARA FIREBASE STORAGE ===');
    
    // Check Firebase availability
    if (!window.firebase) {
        throw new Error('Firebase não inicializado');
    }
    
    let storage;
    try {
        console.log('🔍 Tentando acessar Firebase Storage...');
        // Try different ways to access Firebase Storage
        if (window.firebase.storage) {
            storage = window.firebase.storage();
            console.log('✅ Storage acessado via window.firebase.storage()');
        } else if (window.firebase.app && window.firebase.app().storage) {
            storage = window.firebase.app().storage();
            console.log('✅ Storage acessado via window.firebase.app().storage()');
        } else {
            throw new Error('Firebase Storage não encontrado');
        }
    } catch (error) {
        console.error('💥 Erro ao acessar Firebase Storage:', error);
        throw new Error('Firebase Storage não está configurado corretamente');
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `vehicle-sheets/${submissionData.countryId}/${submissionData.vehicleData.name || 'vehicle'}-${timestamp}.png`;
    
    console.log('📁 Nome do arquivo:', fileName);
    console.log('💾 Tamanho do blob:', blob.size, 'bytes');
    
    try {
        // Create storage reference
        console.log('📂 Criando referência do storage...');
        const storageRef = storage.ref(fileName);
        console.log('✅ Referência criada:', storageRef.fullPath);
        
        // Upload the blob
        console.log('⬆️ Iniciando upload...');
        const uploadTask = await storageRef.put(blob, {
            contentType: 'image/png',
            customMetadata: {
                'vehicleName': submissionData.vehicleData.name || 'Unknown',
                'countryId': submissionData.countryId,
                'submissionId': submissionData.vehicleData.submissionId,
                'uploadedAt': new Date().toISOString()
            }
        });
        console.log('✅ Upload concluído:', uploadTask.state);
        
        // Get download URL
        console.log('🔗 Obtendo URL de download...');
        const downloadURL = await uploadTask.ref.getDownloadURL();
        console.log('✅ URL obtida:', downloadURL);
        
        return downloadURL;
        
    } catch (uploadError) {
        console.error('💥 Erro durante upload:', uploadError);
        console.error('🔍 Detalhes do erro:', uploadError.code, uploadError.message);
        throw uploadError;
    }
}

// Fallback: Create text-based sheet (save as data URI instead of upload)
async function uploadTextBasedSheet(submissionData) {
    console.log('📝 Gerando ficha em formato texto...');
    
    const vehicleData = submissionData.vehicleData;
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ficha Técnica - ${vehicleData.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #1e293b; color: white; }
        .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin-bottom: 20px; padding: 15px; background: #334155; border-radius: 8px; }
        .section h3 { color: #3b82f6; margin-top: 0; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #475569; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Ficha Técnica do Veículo</h1>
        <h2>${vehicleData.name || 'Veículo Experimental'}</h2>
        <p>Submetido para aprovação em ${new Date().toLocaleDateString('pt-BR')}</p>
        <p>País: ${submissionData.countryName} | Quantidade: ${submissionData.quantity} unidades</p>
    </div>
    
    <div class="section">
        <h3>🏗️ Especificações Básicas</h3>
        <div class="info-row"><span>Chassi:</span><span>${vehicleData.chassis || 'N/A'}</span></div>
        <div class="info-row"><span>Motor:</span><span>${vehicleData.engine || 'N/A'}</span></div>
        <div class="info-row"><span>Transmissão:</span><span>${vehicleData.transmission || 'N/A'}</span></div>
        <div class="info-row"><span>Suspensão:</span><span>${vehicleData.suspension || 'N/A'}</span></div>
    </div>
    
    <div class="section">
        <h3>🔫 Armamento</h3>
        <div class="info-row"><span>Canhão Principal:</span><span>${vehicleData.main_gun_caliber || 0}mm</span></div>
        <div class="info-row"><span>Blindagem:</span><span>${vehicleData.armorThickness || vehicleData.armor_thickness || 0}mm</span></div>
    </div>
    
    <div class="section">
        <h3>📊 Informações da Submissão</h3>
        <div class="info-row"><span>ID:</span><span>${vehicleData.submissionId}</span></div>
        <div class="info-row"><span>Categoria:</span><span>${submissionData.category}</span></div>
        <div class="info-row"><span>Status:</span><span>Pendente de Aprovação</span></div>
    </div>
    
    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #475569; color: #94a3b8; font-size: 12px;">
        Gerado automaticamente pelo Sistema de Criação de Veículos War1954
    </div>
</body>
</html>
    `;
    
    // Convert to data URI (embedded HTML) instead of uploading
    const dataUri = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    
    console.log('✅ Ficha em formato HTML gerada como Data URI');
    return dataUri;
}

// Keep the old function for compatibility (but make it redirect)
window.saveVehicleToFirebase = function() {
    showSubmissionMessage('⚠️ Use o botão "Enviar para Aprovação" para submeter o veículo', 'error');
};
