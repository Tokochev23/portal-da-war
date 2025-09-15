// js/aircraftCreator.js - War-1954 Aircraft Creator System
// Main logic file - loads component data and runs calculations.

import { auth, checkPlayerCountry, getCountryData, getGameConfig } from './services/firebase.js';

// Global state for the creator
let currentUserCountry = null;

/**
 * Primary initialization function for the Aircraft Creator.
 * This function ensures that all necessary data (user, country, tech levels)
 * is loaded and validated before initializing the main UI.
 * This makes the creator self-contained and robust.
 */
async function initializeAircraftCreatorApp() {
    const loadingElement = document.getElementById('initial-loading');
    const statusElement = document.getElementById('loading-status');

    const updateLoadingStatus = (message) => {
        if (statusElement) statusElement.textContent = message;
    };

    try {
        updateLoadingStatus('Aguardando autenticação...');
        
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                updateLoadingStatus('Usuário autenticado. Verificando país...');
                
                const paisId = await checkPlayerCountry(user.uid);
                
                if (paisId) {
                    updateLoadingStatus('País encontrado. Carregando dados de tecnologia...');
                    
                    const [countryData, gameConfig] = await Promise.all([
                        getCountryData(paisId),
                        getGameConfig()
                    ]);
                    
                    if (countryData) {
                        const currentYear = 1953 + (gameConfig?.turnoAtual || 1);
                        const aircraftTech = countryData.Aeronautica || 50;
                        
                        currentUserCountry = {
                            ...countryData,
                            id: paisId,
                            aircraftTech: aircraftTech,
                            name: countryData.Pais,
                            year: currentYear
                        };
                        
                        window.currentUserCountry = currentUserCountry;
                        
                        console.log(`✅ País do usuário carregado: ${currentUserCountry.name} | Ano: ${currentUserCountry.year}`, currentUserCountry);
                        
                        if (window.aircraftCreatorApp && !window.aircraftCreatorApp.isInitialized) {
                            await window.aircraftCreatorApp.initialize();
                        }
                    } else {
                        throw new Error(`Não foi possível carregar os dados para o país com ID: ${paisId}`);
                    }
                } else {
                    updateLoadingStatus('Você não está vinculado a um país. Redirecionando...');
                    setTimeout(() => { window.location.href = 'index.html'; }, 3000);
                     throw new Error('Usuário não vinculado a um país.');
                }
            } else {
                updateLoadingStatus('Nenhum usuário logado. Redirecionando para a página inicial...');
                setTimeout(() => { window.location.href = 'index.html'; }, 3000);
                throw new Error('Usuário não autenticado.');
            }
        });

    } catch (error) {
        console.error('❌ Erro fatal na inicialização do Criador de Aeronaves:', error);
        updateLoadingStatus(`Erro: ${error.message}`);
        if (loadingElement) {
            loadingElement.innerHTML = `<div class="text-red-400 text-center p-4">${error.message}</div>`;
        }
    }
}


// Dados dos componentes incluídos diretamente (para evitar problemas CORS)
async function loadAircraftComponents() {
    console.log('🔄 Carregando todos os componentes da aeronave via import dinâmico...');
    try {
        const airframesModule = await import('./data/aircraft_components/airframes.js');
        const enginesModule = await import('./data/aircraft_components/aircraft_engines.js');
        const weaponsModule = await import('./data/aircraft_components/aircraft_weapons.js');
        const avionicsModule = await import('./data/aircraft_components/avionics.js');
        const wingsModule = await import('./data/aircraft_components/wings.js');
        const superchargersModule = await import('./data/aircraft_components/superchargers.js');
        const specialEquipmentModule = await import('./data/aircraft_components/special_equipment.js'); // NEW

        window.AIRCRAFT_COMPONENTS.airframes = airframesModule.airframes;
        window.AIRCRAFT_COMPONENTS.aircraft_engines = enginesModule.aircraft_engines;
        window.AIRCRAFT_COMPONENTS.aircraft_weapons = weaponsModule.aircraft_weapons;
        window.AIRCRAFT_COMPONENTS.avionics = avionicsModule.avionics;
        window.AIRCRAFT_COMPONENTS.wing_types = wingsModule.wing_types;
        window.AIRCRAFT_COMPONENTS.wing_features = wingsModule.wing_features;
        window.AIRCRAFT_COMPONENTS.superchargers = superchargersModule.superchargers;
        window.AIRCRAFT_COMPONENTS.special_equipment = specialEquipmentModule.special_equipment; // NEW

        console.log('✅ Todos os componentes foram carregados com sucesso.');
        return true;
    } catch (error) {
        console.error('❌ Erro fatal ao carregar componentes dinamicamente:', error);
        return false;
    }
}

// Garantir que a função esteja disponível globalmente
window.loadAircraftComponents = loadAircraftComponents;

// Global state for the aircraft being designed
window.currentAircraft = {
    name: 'Nova Aeronave',
    airframe: null,
    engine: null,
    wings: {
        type: null,
        features: []
    },
    supercharger: 'none',
    weapons: [],
    avionics: [],
    quantity: 1
};

// Initialize global components object
if (!window.AIRCRAFT_COMPONENTS) {
    window.AIRCRAFT_COMPONENTS = {
        airframes: {},
        aircraft_engines: {},
        aircraft_weapons: {},
        avionics: {},
        wing_types: {},
        wing_features: {},
        superchargers: {}
    };
}

// --- GLOBAL FUNCTIONS --- //
window.AIRCRAFT_COMPONENTS = window.AIRCRAFT_COMPONENTS;
window.currentAircraft = window.currentAircraft;
window.getCurrentUserCountry = () => currentUserCountry;

window.selectAirframe = function(airframeId) {
    if (!window.AIRCRAFT_COMPONENTS?.airframes[airframeId]) {
        console.error('Airframe not found:', airframeId);
        return;
    }
    window.currentAircraft.airframe = airframeId;
    document.querySelectorAll('.airframe-card').forEach(card => {
        card.classList.remove('selected', 'border-cyan-400', 'ring-1', 'ring-cyan-400/50');
        card.classList.add('border-slate-700/50', 'bg-slate-800/40');
    });
    const selectedCard = document.querySelector(`[onclick="selectAirframe('${airframeId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected', 'border-cyan-400', 'ring-1', 'ring-cyan-400/50');
        selectedCard.classList.remove('border-slate-700/50', 'bg-slate-800/40');
    }
    updateAircraftCalculations();
};

window.selectAircraftEngine = function(engineId) {
    if (!window.AIRCRAFT_COMPONENTS?.aircraft_engines[engineId]) {
        console.error('Engine not found:', engineId);
        return;
    }
    window.currentAircraft.engine = engineId;
    document.querySelectorAll('.engine-card').forEach(card => {
        card.classList.remove('selected', 'border-cyan-400', 'ring-1', 'ring-cyan-400/50');
        card.classList.add('border-slate-700/50', 'bg-slate-800/40');
    });
    const selectedCard = document.querySelector(`[onclick="selectAircraftEngine('${engineId}')"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected', 'border-cyan-400', 'ring-1', 'ring-cyan-400/50');
        selectedCard.classList.remove('border-slate-700/50', 'bg-slate-800/40');
    }
    updateAircraftCalculations();
};

window.toggleAircraftWeapon = function(weaponId) {
    if (!window.currentAircraft.weapons) {
        window.currentAircraft.weapons = [];
    }
    const index = window.currentAircraft.weapons.indexOf(weaponId);
    if (index > -1) {
        window.currentAircraft.weapons.splice(index, 1);
    } else {
        window.currentAircraft.weapons.push(weaponId);
    }
    const card = document.querySelector(`[onclick="toggleAircraftWeapon('${weaponId}')"]`);
    if (card) {
        card.classList.toggle('selected');
        card.classList.toggle('border-cyan-400');
    }
    updateAircraftCalculations();
};

window.updateAircraftCalculations = function() {
    // Always update displays, even if no airframe is selected, to show default/empty states
    // The calculation functions themselves will return error/default objects if data is missing.
    if (window.calculateAircraftPerformance) {
        const performance = window.calculateAircraftPerformance();
        updateAircraftDisplays(performance);
    }
    if (window.calculateAircraftCosts) {
        const costs = window.calculateAircraftCosts();
        updateCostDisplays(costs);
    }
};

function updateAircraftDisplays(performance) {
    const weightEl = document.getElementById('total-weight-display');
    const speedEl = document.getElementById('max-speed-display');
    const thrustEl = document.getElementById('thrust-weight-ratio-display');
    if (weightEl && performance.totalWeight) {
        weightEl.textContent = Math.round(performance.totalWeight) + ' kg';
    }
    if (speedEl && (performance.maxSpeed || performance.maxSpeedKph)) {
        const speed = performance.maxSpeed || performance.maxSpeedKph;
        speedEl.textContent = Math.round(speed) + ' km/h';
    }
    if (thrustEl && performance.thrustToWeight) {
        thrustEl.textContent = performance.thrustToWeight.toFixed(2) + ':1';
    }
}

// --- ROBUST INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sistema de aeronaves com novo fluxo...');
    initializeAircraftCreatorApp();
});