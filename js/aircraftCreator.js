// js/aircraftCreator.js - War-1954 Aircraft Creator System
// Main logic file - loads component data and runs calculations.

import { auth, checkPlayerCountry, getCountryData, getGameConfig } from './services/firebase.js';
import { legacyBridge } from './aircraft/core/LegacyBridge.js';
import { TabLoaders } from './components/aircraftTabLoaders.js';
// Ensure advanced performance system is available for speed predictions
import './utils/advancedPerformanceCalculator.js';

class AircraftCreatorApp {
    constructor() {
        this.isInitialized = false;
        this.currentUserCountry = null;
        this.tabLoaders = new TabLoaders();
        this.loadingElement = document.getElementById('initial-loading');
        this.statusElement = document.getElementById('loading-status');
    }

    updateLoadingStatus(message) {
        if (this.statusElement) this.statusElement.textContent = message;
    }

    async init() {
        console.log('🚀 Initializing Aircraft Creator App...');
        try {
            this.updateLoadingStatus('Awaiting authentication...');
            
            auth.onAuthStateChanged(async (user) => {
                if (user) {
                    await this.loadUserAndGameData(user);
                } else {
                    this.handleNotAuthenticated();
                }
            });
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    async loadUserAndGameData(user) {
        try {
            this.updateLoadingStatus('User authenticated. Checking country...');
            const paisId = await checkPlayerCountry(user.uid);

            if (paisId) {
                this.updateLoadingStatus('Country found. Loading technology data...');
                const [countryData, gameConfig] = await Promise.all([
                    getCountryData(paisId),
                    getGameConfig()
                ]);

                if (countryData) {
                    const currentYear = 1953 + (gameConfig?.turnoAtual || 1);
                    const aircraftTech = Number(countryData.Aeronautica || 0);
                    const civilTech = Number(countryData.Tecnologia || 0);
                    const vehiclesTech = Number(countryData.Veiculos || 0);
                    const navalTech = Number(countryData.Marinha || 0);

                    this.currentUserCountry = {
                        ...countryData,
                        id: paisId,
                        // Expor todas as techs como no dashboard
                        aircraftTech,         // Aeronáutica
                        civilTech,            // Tecnologia (civil)
                        vehiclesTech,         // Veículos
                        navalTech,            // Marinha
                        name: countryData.Pais,
                        year: currentYear
                    };

                    window.currentUserCountry = this.currentUserCountry;
                    console.log(`✅ User country loaded: ${this.currentUserCountry.name} | Year: ${this.currentUserCountry.year}`,
                        { techs: { civil: civilTech, aircraft: aircraftTech, vehicles: vehiclesTech, naval: navalTech } });

                    // Atualiza cabeçalho e persiste no localStorage
                    try {
                        const headerCountryEl = document.getElementById('current-country');
                        if (headerCountryEl) headerCountryEl.textContent = this.currentUserCountry.name || 'Desconhecido';
                        localStorage.setItem('loggedCountry', this.currentUserCountry.name || '');
                    } catch {}

                    await this.finishInitialization();
                } else {
                    throw new Error(`Could not load data for country with ID: ${paisId}`);
                }
            } else {
                this.handleNoCountryLinked();
            }
        } catch (error) {
            this.handleInitializationError(error);
        }
    }

    async finishInitialization() {
        this.updateLoadingStatus('Initializing aircraft systems...');
        legacyBridge.initialize();

        if (!legacyBridge.validateBridge()) {
            throw new Error('Failed to initialize aircraft ECS system');
        }
        console.log('✅ Aircraft ECS system initialized successfully');

        this.updateLoadingStatus('Loading aircraft components...');
        const componentsLoaded = await loadAircraftComponents();

        if (componentsLoaded) {
            this.updateLoadingStatus('Components loaded. Finalizing...');
            this.setupTabEvents();
            this.tabLoaders.loadCategoryTab(); // Load initial tab
            this.hideLoadingScreen();
            console.log('✅ Aircraft Creator is ready.');
        } else {
            throw new Error('Failed to load essential aircraft components.');
        }
    }

    setupTabEvents() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;
                this.loadTab(tab);
            });
        });
    }

    loadTab(tab) {
        console.log(`Attempting to load tab: ${tab}`);
        switch (tab) {
            case 'category':
                this.tabLoaders.loadCategoryTab();
                break;
            case 'structure':
                this.tabLoaders.loadStructureTab();
                break;
            case 'cell':
                this.tabLoaders.loadCellTab();
                break;
            case 'wings':
                this.tabLoaders.loadWingsTab();
                break;
            case 'propulsion':
                this.tabLoaders.loadPropulsionTab();
                break;
            case 'supercharger':
                this.tabLoaders.loadSuperchargerTab();
                break;
            case 'weapons':
                this.tabLoaders.loadWeaponsTab();
                break;
            case 'avionics':
                this.tabLoaders.loadAvionicsTab();
                break;
            default:
                console.warn(`Unknown tab: ${tab}`);
        }
    }

    hideLoadingScreen() {
        if (this.loadingElement) {
            this.loadingElement.style.opacity = '0';
            setTimeout(() => {
                this.loadingElement.style.display = 'none';
            }, 500); // Fade-out transition time
        }
    }

    handleNotAuthenticated() {
        this.updateLoadingStatus('No user logged in. Redirecting to home page...');
        setTimeout(() => { window.location.href = 'index.html'; }, 3000);
        throw new Error('User not authenticated.');
    }

    handleNoCountryLinked() {
        this.updateLoadingStatus('You are not linked to a country. Redirecting...');
        setTimeout(() => { window.location.href = 'index.html'; }, 3000);
        throw new Error('User not linked to a country.');
    }

    handleInitializationError(error) {
        console.error('❌ Fatal error initializing Aircraft Creator:', error);
        this.updateLoadingStatus(`Error: ${error.message}`);
        if (this.loadingElement) {
            this.loadingElement.innerHTML = `<div class="text-red-400 text-center p-4">${error.message}</div>`;
        }
    }
}

// Load aircraft components data
async function loadAircraftComponents() {
    console.log('🔄 Loading all aircraft components via dynamic import...');
    try {
        const [airframesModule, enginesModule, weaponsModule, avionicsModule, wingsModule, superchargersModule, specialEquipmentModule] = await Promise.all([
            import('./data/aircraft_components/airframes.js'),
            import('./data/aircraft_components/aircraft_engines.js'),
            import('./data/aircraft_components/aircraft_weapons.js'),
            import('./data/aircraft_components/avionics.js'),
            import('./data/aircraft_components/wings.js'),
            import('./data/aircraft_components/superchargers.js'),
            import('./data/aircraft_components/special_equipment.js')
        ]);

        window.AIRCRAFT_COMPONENTS.airframes = airframesModule.airframes;
        window.AIRCRAFT_COMPONENTS.aircraft_engines = enginesModule.aircraft_engines;
        window.AIRCRAFT_COMPONENTS.aircraft_weapons = weaponsModule.aircraft_weapons;
        window.AIRCRAFT_COMPONENTS.avionics = avionicsModule.avionics;
        window.AIRCRAFT_COMPONENTS.wing_types = wingsModule.wing_types;
        window.AIRCRAFT_COMPONENTS.wing_features = wingsModule.wing_features;
        window.AIRCRAFT_COMPONENTS.superchargers = superchargersModule.superchargers;
        window.AIRCRAFT_COMPONENTS.special_equipment = specialEquipmentModule.special_equipment;

        console.log('✅ All components loaded successfully.');
        return true;
    } catch (error) {
        console.error('❌ Fatal error loading components dynamically:', error);
        return false;
    }
}

// Initialize global objects
window.AIRCRAFT_COMPONENTS = {};
window.currentAircraft = {
    name: 'New Aircraft',
    airframe: null,
    engine: null,
    wings: { type: null, features: [] },
    supercharger: 'none',
    weapons: [],
    avionics: [],
    quantity: 1
};

// --- GLOBAL FUNCTIONS --- //
window.getCurrentUserCountry = () => window.aircraftCreatorApp?.currentUserCountry;

// These functions are now handled by the legacy bridge or directly within the tab loaders
// It's recommended to phase them out and use the ECS or tab loader methods directly
window.selectAirframe = function(airframeId) {
    console.warn('Legacy selectAirframe called. Please update to use the new system.');
    legacyBridge.legacyAircraftProxy.airframe = airframeId;
};

window.selectAircraftEngine = function(engineId) {
    console.warn('Legacy selectAircraftEngine called. Please update to use the new system.');
    legacyBridge.legacyAircraftProxy.engine = engineId;
};

window.toggleAircraftWeapon = function(weaponId) {
    console.warn('Legacy toggleAircraftWeapon called. Please update to use the new system.');
    const currentWeapons = legacyBridge.legacyAircraftProxy.weapons || [];
    const index = currentWeapons.indexOf(weaponId);
    if (index > -1) {
        currentWeapons.splice(index, 1);
    } else {
        currentWeapons.push(weaponId);
    }
    legacyBridge.legacyAircraftProxy.weapons = currentWeapons;
};

window.updateAircraftCalculations = function() {
    // This function is now largely managed by the ECS and real-time feedback systems
    // Kept for any remaining legacy dependencies
};

// --- ROBUST INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    window.aircraftCreatorApp = new AircraftCreatorApp();
    window.aircraftCreatorApp.init();
});
