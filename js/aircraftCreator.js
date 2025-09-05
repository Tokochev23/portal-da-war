// js/aircraftCreator.js - War-1954 Aircraft Creator System
// Main logic file - imports component data and runs calculations.

// Component Data Imports
import { airframes } from './data/aircraft_components/airframes.js';
import { aircraft_engines } from './data/aircraft_components/aircraft_engines.js';
import { aircraft_weapons } from './data/aircraft_components/aircraft_weapons.js';

// Firebase integration
let firebaseDb = null;
let countryData = null;

// Global state for the aircraft being designed
let currentAircraft = {
    name: 'Nova Aeronave',
    airframe: null,
    engine: null,
    weapons: [],
    avionics: [],
    quantity: 1
};

// Assemble the main components object from imported modules
const AIRCRAFT_COMPONENTS = {
    airframes,
    aircraft_engines,
    aircraft_weapons
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


// Calculate aircraft performance
function calculateAircraftPerformance() {
    if (!currentAircraft.airframe || !currentAircraft.engine) {
        return { error: "Fuselagem e motor são obrigatórios" };
    }

    // Placeholder for future calculations
    return {
        totalWeight: 0,
        maxSpeedKph: 0,
        thrustToWeight: 0,
        wingLoading: 0,
        rateOfClimb: 0,
        warnings: []
    };
}

// Generate warnings about aircraft design
function generateAircraftWarnings() {
    const warnings = [];
    // Placeholder for future warnings
    return warnings;
}

// Calculate comprehensive costs for an aircraft
function calculateAircraftCosts() {
    // Placeholder for future calculations
    return {
        unitCost: 0,
        totalCost: 0,
        maintenanceCostPerHour: 0,
        researchCost: 0
    };
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

function updateAircraftCalculations() {
    console.log('🔄 Iniciando atualização completa dos cálculos da aeronave...');
    console.log('🔍 Estado atual da currentAircraft:', currentAircraft);
    
    if (!currentAircraft?.airframe) {
        console.log('⚠️ Nenhuma fuselagem selecionada - atualizações limitadas');
        return;
    }
    
    try {
        console.log('🔧 Iniciando cálculo de performance...');
        const performance = calculateAircraftPerformance();
        console.log('🔧 Performance calculada:', performance);
        
        if (performance.error) {
            console.error('❌ Erro na performance:', performance.error);
            return;
        }
        
        console.log('💰 Iniciando cálculo de custos...');
        const costs = calculateAircraftCosts();
        console.log('💰 Custos calculados:', costs);
        
        if (costs.error) {
            console.error('❌ Erro nos custos:', costs.error);
        }
        
        // TODO: Implementar updateAircraftDisplays
        // updateAircraftDisplays(performance, costs);
        
        // TODO: Atualizar gráfico de performance para aeronaves
        // if (window.updatePerformanceChart) {
        //     window.updatePerformanceChart(performance);
        // }
        
        console.log('✅ Todos os cálculos da aeronave foram atualizados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao atualizar cálculos da aeronave:', error);
        console.error('❌ Stack trace:', error.stack);
    }
}

function updateAircraftDisplays(performance, costs) {
    // Placeholder para atualizar a UI com os dados da aeronave
}

window.initFirebase = initFirebase;
window.AIRCRAFT_COMPONENTS = AIRCRAFT_COMPONENTS;
window.currentAircraft = currentAircraft;
window.checkComponentCompatibility = checkComponentCompatibility; // Manter por enquanto, será adaptado
window.calculateAircraftPerformance = calculateAircraftPerformance;
window.calculateAircraftCosts = calculateAircraftCosts;
window.updateAircraftCalculations = updateAircraftCalculations;
window.getResolvedComponent = getResolvedComponent; // Manter por enquanto, será adaptado

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

window.selectAirframe = function(airframeId) {
    if (!AIRCRAFT_COMPONENTS?.airframes[airframeId]) {
        console.error('Airframe not found:', airframeId);
        return;
    }
    
    window.currentAircraft.airframe = airframeId;
    console.log('Selected airframe:', airframeId);

    // TODO: Deselect incompatible components (e.g., engine)
    
    document.querySelectorAll('.airframe-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    });
    
    const selectedCard = document.querySelector(`[onclick="selectAirframe('${airframeId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('ring-2', 'ring-brand-500', 'bg-brand-500/10');
    }
    
    // Refresh current tab to show new compatibility
    if(window.aircraftCreatorApp) {
        window.aircraftCreatorApp.loadTabContent(window.aircraftCreatorApp.currentTab);
    }

    updateAircraftCalculations();
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
        window.currentVehicle.main_gun_length = lengthValue;
        console.log('Main gun length updated:', lengthValue);
        
        // Update button visual states
        updateGunLengthButtonStates(lengthValue);
        
        // Update gun statistics display
        updateWeaponCalculations();
        
        // Update calculations
        if (typeof updateVehicleCalculations === 'function') {
            updateVehicleCalculations();
        }
    }
};

window.updateMainGunAmmo = function(ammoType) {
    const validAmmoTypes = ['AP', 'HE', 'APCR', 'HEAT', 'APDS'];
    if (window.currentVehicle && validAmmoTypes.includes(ammoType)) {
        window.currentVehicle.main_gun_ammo = ammoType;
        console.log('Main gun ammo type updated:', ammoType);
        
        // Update button visual states
        updateGunAmmoButtonStates(ammoType);
        
        // Update gun statistics display
        updateWeaponCalculations();
        
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
        button.className = button.className.replace('bg-brand-600 text-white', 'bg-slate-700 text-slate-300 hover:bg-slate-600');
    });
    
    // Add selected class to the current length button
    const selectedButton = document.querySelector(`[onclick="updateMainGunLength(${selectedLength})"]`);
    if (selectedButton) {
        selectedButton.className = selectedButton.className.replace('bg-slate-700 text-slate-300 hover:bg-slate-600', 'bg-brand-600 text-white');
    }
}

function updateGunAmmoButtonStates(selectedAmmo) {
    // Remove selected class from all ammo buttons
    const ammoButtons = document.querySelectorAll('[onclick^="updateMainGunAmmo("]');
    ammoButtons.forEach(button => {
        button.className = button.className.replace('bg-brand-600 text-white', 'bg-slate-700 text-slate-300 hover:bg-slate-600');
    });
    
    // Add selected class to the current ammo button
    const selectedButton = document.querySelector(`[onclick="updateMainGunAmmo('${selectedAmmo}')"]`);
    if (selectedButton) {
        selectedButton.className = selectedButton.className.replace('bg-slate-700 text-slate-300 hover:bg-slate-600', 'bg-brand-600 text-white');
    }
}

function updateWeaponCalculations() {
    // Update main gun statistics in the UI
    const currentVehicle = window.currentVehicle || {};
    const mainGunCaliber = currentVehicle.main_gun_caliber || 0;
    const mainGunLength = currentVehicle.main_gun_length || 40;
    const mainGunAmmo = currentVehicle.main_gun_ammo || 'AP';
    
    // Update header caliber display
    const headerDisplay = document.getElementById('main-gun-header-caliber');
    if (headerDisplay && mainGunCaliber > 0) {
        headerDisplay.textContent = mainGunCaliber + ' mm';
    }
    
    // Update button states
    updateGunLengthButtonStates(mainGunLength);
    updateGunAmmoButtonStates(mainGunAmmo);
    
    if (window.tabLoaders && typeof window.tabLoaders.calculateGunPenetration === 'function') {
        const penetration = window.tabLoaders.calculateGunPenetration(mainGunCaliber, mainGunLength);
        const gunCost = window.tabLoaders.calculateGunCost(mainGunCaliber, mainGunLength);
        
        // Update penetration display
        const penetrationEl = document.getElementById('main-gun-penetration');
        if (penetrationEl) penetrationEl.textContent = penetration + ' mm';
        
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
