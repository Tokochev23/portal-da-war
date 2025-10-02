/**
 * Advanced Avionics Handler - War1954 Aircraft Creator
 *
 * Handles the advanced avionics configuration interface with real-time
 * dependency checking, power management, and system integration analysis.
 * Provides sophisticated visualization of system interactions.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { avionicsIntegrationSystem } from '../systems/AvionicsIntegrationSystem.js';

class AvionicsAdvancedHandler {
    constructor() {
        this.initialized = false;
        this.currentCategory = 'radar';
        this.installedSystems = new Set();
        this.availableSystems = new Map();
        this.systemDependencyGraph = null;

        // UI elements cache
        this.elements = {
            categoryTabs: null,
            categoryContent: null,
            systemCards: null,
            powerBars: new Map(),
            warningsContainer: null,
            recommendationsContainer: null
        };

        // Update intervals
        this.updateInterval = null;
        this.animationFrame = null;

        console.log('📡 AvionicsAdvancedHandler initialized');
    }

    /**
     * Initializes the advanced avionics interface
     */
    initialize() {
        if (this.initialized) return;

        // Cache UI elements
        this.cacheUIElements();

        // Set up event listeners
        this.setupEventListeners();

        // Load initial data
        this.loadAvionicsData();

        // Initialize category tabs
        this.initializeCategoryTabs();

        // Load default category
        this.loadCategory(this.currentCategory);

        // Start update loop
        this.startUpdateLoop();

        this.initialized = true;
        console.log('✅ Advanced avionics interface initialized');
    }

    /**
     * Caches frequently used UI elements
     */
    cacheUIElements() {
        this.elements.categoryTabs = document.querySelectorAll('.avionics-category-tab');
        this.elements.categoryContent = document.getElementById('avionics-category-content');
        this.elements.warningsContainer = document.getElementById('avionics-warnings-container');
        this.elements.recommendationsContainer = document.getElementById('integration-recommendations');

        // Cache power management elements
        this.elements.powerBars.set('primary', {
            bar: document.getElementById('primary-bus-bar'),
            text: document.getElementById('primary-bus-power'),
            systems: document.getElementById('primary-bus-systems')
        });

        this.elements.powerBars.set('secondary', {
            bar: document.getElementById('secondary-bus-bar'),
            text: document.getElementById('secondary-bus-power'),
            systems: document.getElementById('secondary-bus-systems')
        });

        this.elements.powerBars.set('battery', {
            bar: document.getElementById('battery-backup-bar'),
            text: document.getElementById('battery-backup-time')
        });
    }

    /**
     * Sets up event listeners for the interface
     */
    setupEventListeners() {
        // Category tab clicks
        this.elements.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category);
            });
        });

        // System configuration changes
        const configElements = [
            'radar-mode-select',
            'navigation-mode-select',
            'communication-freq-select',
            'ecm-mode-select'
        ];

        configElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.handleConfigurationChange(elementId, e.target.value);
                });
            }
        });

        // Listen for aircraft changes
        window.addEventListener('aircraftCalculationComplete', (e) => {
            this.handleAircraftUpdate(e.detail);
        });
    }

    /**
     * Loads avionics data from global components
     */
    loadAvionicsData() {
        if (!window.AIRCRAFT_COMPONENTS?.avionics) {
            console.warn('⚠️ Avionics components not loaded');
            return;
        }

        const avionicsData = window.AIRCRAFT_COMPONENTS.avionics;

        // Categorize systems
        this.availableSystems.clear();

        Object.entries(avionicsData).forEach(([systemId, systemData]) => {
            const category = this.categorizeSystem(systemData);

            if (!this.availableSystems.has(category)) {
                this.availableSystems.set(category, []);
            }

            this.availableSystems.get(category).push({
                id: systemId,
                ...systemData
            });
        });

        // Sort systems by tech level and name
        this.availableSystems.forEach(systems => {
            systems.sort((a, b) => {
                const techDiff = (a.tech_level || 0) - (b.tech_level || 0);
                if (techDiff !== 0) return techDiff;
                return (a.name || '').localeCompare(b.name || '');
            });
        });

        console.log(`📡 Loaded ${Object.keys(avionicsData).length} avionics systems`);
    }

    /**
     * Categorizes a system based on its properties
     */
    categorizeSystem(systemData) {
        const name = (systemData.name || '').toLowerCase();
        const type = (systemData.type || '').toLowerCase();

        if (name.includes('radar') || type.includes('radar')) return 'radar';
        if (name.includes('navigation') || name.includes('compass') || name.includes('gyro')) return 'navigation';
        if (name.includes('communication') || name.includes('radio')) return 'communication';
        if (name.includes('fire control') || name.includes('gunsight') || name.includes('targeting')) return 'firecontrol';
        if (name.includes('ecm') || name.includes('countermeasure') || name.includes('chaff')) return 'countermeasures';
        if (name.includes('autopilot') || name.includes('flight control')) return 'autopilot';

        return 'radar'; // Default category
    }

    /**
     * Initializes category tabs
     */
    initializeCategoryTabs() {
        this.elements.categoryTabs.forEach(tab => {
            tab.classList.remove('active');
        });

        const activeTab = document.querySelector(`[data-category="${this.currentCategory}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    /**
     * Switches to a different category
     */
    switchCategory(category) {
        if (category === this.currentCategory) return;

        this.currentCategory = category;

        // Update tab appearance
        this.elements.categoryTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.category === category) {
                tab.classList.add('active');
            }
        });

        // Load category content
        this.loadCategory(category);

        console.log(`📡 Switched to category: ${category}`);
    }

    /**
     * Loads systems for a specific category
     */
    loadCategory(category) {
        const systems = this.availableSystems.get(category) || [];

        if (systems.length === 0) {
            this.elements.categoryContent.innerHTML = `
                <div class="text-center py-16 text-slate-400">
                    <span class="text-4xl block mb-4">📡</span>
                    <p>Nenhum sistema disponível nesta categoria</p>
                </div>
            `;
            return;
        }

        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';

        systems.forEach(system => {
            html += this.renderSystemCard(system);
        });

        html += '</div>';

        this.elements.categoryContent.innerHTML = html;

        // Add event listeners to system cards
        this.setupSystemCardListeners();
    }

    /**
     * Renders a system card
     */
    renderSystemCard(system) {
        const isInstalled = this.installedSystems.has(system.id);
        const isAvailable = this.isSystemAvailable(system);
        const dependencyStatus = this.checkDependencyStatus(system);

        let cardClass = 'avionics-system-card';
        if (isInstalled) cardClass += ' installed';
        else if (!isAvailable) cardClass += ' unavailable';
        else if (!dependencyStatus.met) cardClass += ' dependency-missing';

        const techLevel = this.getTechLevelClass(system.tech_level || 0);

        return `
            <div class="${cardClass}" data-system-id="${system.id}">
                <div class="tech-level-indicator ${techLevel}">
                    Tech ${system.tech_level || 0}
                </div>

                <div class="mb-3">
                    <h4 class="text-base font-semibold text-slate-100">${system.name}</h4>
                    <p class="text-sm text-slate-400 mt-1">${system.description || 'Sistema avançado de aviônica'}</p>
                </div>

                <div class="grid grid-cols-2 gap-3 text-xs text-slate-300 mb-3">
                    <div>
                        <span class="text-slate-400">Peso:</span>
                        <span class="font-semibold">${(system.weight || 0).toFixed(1)} kg</span>
                    </div>
                    <div>
                        <span class="text-slate-400">Potência:</span>
                        <span class="font-semibold">${(system.powerDraw || 0).toFixed(1)} kW</span>
                    </div>
                    <div>
                        <span class="text-slate-400">Custo:</span>
                        <span class="font-semibold">$${Math.round((system.cost || 0) / 1000)}K</span>
                    </div>
                    <div>
                        <span class="text-slate-400">MTBF:</span>
                        <span class="font-semibold">${system.mtbf || 1000}h</span>
                    </div>
                </div>

                ${this.renderSystemDependencies(system, dependencyStatus)}

                <div class="system-status-icon ${this.getSystemStatusClass(system, isInstalled)}">
                    ${this.getSystemStatusIcon(system, isInstalled)}
                </div>

                ${isInstalled ? '<div class="absolute top-2 left-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>' : ''}
            </div>
        `;
    }

    /**
     * Renders system dependencies information
     */
    renderSystemDependencies(system, dependencyStatus) {
        if (!dependencyStatus.dependencies.length && !dependencyStatus.conflicts.length) {
            return '';
        }

        let html = '<div class="mt-3 space-y-2">';

        if (dependencyStatus.dependencies.length > 0) {
            html += '<div class="text-xs">';
            html += '<span class="text-blue-400">Requer:</span> ';
            html += dependencyStatus.dependencies.map(dep => {
                const depSystem = this.getSystemById(dep);
                const isDepMet = this.installedSystems.has(dep);
                return `<span class="${isDepMet ? 'text-green-400' : 'text-red-400'}">${depSystem?.name || dep}</span>`;
            }).join(', ');
            html += '</div>';
        }

        if (dependencyStatus.conflicts.length > 0) {
            html += '<div class="text-xs">';
            html += '<span class="text-red-400">Conflita com:</span> ';
            html += dependencyStatus.conflicts.map(conflict => {
                const conflictSystem = this.getSystemById(conflict);
                return `<span class="text-red-400">${conflictSystem?.name || conflict}</span>`;
            }).join(', ');
            html += '</div>';
        }

        html += '</div>';
        return html;
    }

    /**
     * Sets up event listeners for system cards
     */
    setupSystemCardListeners() {
        const systemCards = document.querySelectorAll('.avionics-system-card');

        systemCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const systemId = e.currentTarget.dataset.systemId;
                this.toggleSystem(systemId);
            });

            // Hover effects for dependency visualization
            card.addEventListener('mouseenter', (e) => {
                const systemId = e.currentTarget.dataset.systemId;
                this.highlightSystemDependencies(systemId);
            });

            card.addEventListener('mouseleave', () => {
                this.clearDependencyHighlights();
            });
        });
    }

    /**
     * Toggles system installation
     */
    toggleSystem(systemId) {
        const system = this.getSystemById(systemId);
        if (!system) return;

        if (this.installedSystems.has(systemId)) {
            this.removeSystem(systemId);
        } else {
            this.installSystem(systemId);
        }
    }

    /**
     * Installs a system
     */
    installSystem(systemId) {
        const system = this.getSystemById(systemId);
        if (!system) return;

        // Check availability
        if (!this.isSystemAvailable(system)) {
            this.showSystemUnavailableMessage(system);
            return;
        }

        // Check dependencies
        const dependencyStatus = this.checkDependencyStatus(system);
        if (!dependencyStatus.met) {
            this.showDependencyMessage(system, dependencyStatus);
            return;
        }

        // Check conflicts
        if (dependencyStatus.hasConflicts) {
            this.showConflictMessage(system, dependencyStatus);
            return;
        }

        // Install the system
        this.installedSystems.add(systemId);

        // Update aircraft configuration
        if (!window.currentAircraft.avionics) {
            window.currentAircraft.avionics = [];
        }
        if (!window.currentAircraft.avionics.includes(systemId)) {
            window.currentAircraft.avionics.push(systemId);
        }

        // Update UI
        this.updateSystemCard(systemId);
        this.updateOverallStatus();

        // Trigger aircraft calculations
        if (typeof window.updateAircraftCalculations === 'function') {
            window.updateAircraftCalculations();
        }

        console.log(`✅ Installed system: ${system.name}`);
    }

    /**
     * Removes a system
     */
    removeSystem(systemId) {
        const system = this.getSystemById(systemId);
        if (!system) return;

        // Check if other systems depend on this one
        const dependentSystems = this.findDependentSystems(systemId);
        if (dependentSystems.length > 0) {
            this.showDependentSystemsMessage(system, dependentSystems);
            return;
        }

        // Remove the system
        this.installedSystems.delete(systemId);

        // Update aircraft configuration
        if (window.currentAircraft.avionics) {
            const index = window.currentAircraft.avionics.indexOf(systemId);
            if (index > -1) {
                window.currentAircraft.avionics.splice(index, 1);
            }
        }

        // Update UI
        this.updateSystemCard(systemId);
        this.updateOverallStatus();

        // Trigger aircraft calculations
        if (typeof window.updateAircraftCalculations === 'function') {
            window.updateAircraftCalculations();
        }

        console.log(`🗑️ Removed system: ${system.name}`);
    }

    /**
     * Updates a system card appearance
     */
    updateSystemCard(systemId) {
        const card = document.querySelector(`[data-system-id="${systemId}"]`);
        if (!card) return;

        const isInstalled = this.installedSystems.has(systemId);

        if (isInstalled) {
            card.classList.add('installed');
            card.classList.remove('dependency-missing', 'unavailable');
        } else {
            card.classList.remove('installed');

            const system = this.getSystemById(systemId);
            if (system) {
                const isAvailable = this.isSystemAvailable(system);
                const dependencyStatus = this.checkDependencyStatus(system);

                if (!isAvailable) {
                    card.classList.add('unavailable');
                } else if (!dependencyStatus.met) {
                    card.classList.add('dependency-missing');
                }
            }
        }

        // Update indicator
        const indicator = card.querySelector('.system-status-icon');
        if (indicator) {
            const system = this.getSystemById(systemId);
            indicator.className = `system-status-icon ${this.getSystemStatusClass(system, isInstalled)}`;
            indicator.innerHTML = this.getSystemStatusIcon(system, isInstalled);
        }
    }

    /**
     * Updates overall status displays
     */
    updateOverallStatus() {
        // Update system count
        const countElement = document.getElementById('installed-systems-count');
        if (countElement) {
            countElement.textContent = this.installedSystems.size;
        }

        // Calculate totals
        let totalWeight = 0;
        let totalPower = 0;
        let totalCost = 0;
        let averageMTBF = 0;
        let systemCount = 0;

        this.installedSystems.forEach(systemId => {
            const system = this.getSystemById(systemId);
            if (system) {
                totalWeight += system.weight || 0;
                totalPower += system.powerDraw || 0;
                totalCost += system.cost || 0;
                averageMTBF += system.mtbf || 1000;
                systemCount++;
            }
        });

        if (systemCount > 0) {
            averageMTBF = Math.round(averageMTBF / systemCount);
        }

        // Update displays
        this.updateDisplay('total-weight', `${totalWeight.toFixed(1)}`);
        this.updateDisplay('total-power-consumption', `${totalPower.toFixed(1)}`);
        this.updateDisplay('reliability-rating', `${averageMTBF}`);

        // Update power bars
        this.updatePowerBars(totalPower);

        // Update efficiency calculation
        this.updateIntegrationEfficiency();

        // Update warnings and recommendations
        this.updateWarningsAndRecommendations();
    }

    /**
     * Updates power management displays
     */
    updatePowerBars(totalPower) {
        const maxPower = 15; // Total capacity
        const powerPercentage = Math.min(100, (totalPower / maxPower) * 100);

        // Update main power bar
        const powerBar = document.getElementById('power-usage-bar');
        if (powerBar) {
            powerBar.style.width = `${powerPercentage}%`;
        }

        const powerMargin = document.getElementById('power-margin');
        if (powerMargin) {
            const margin = Math.max(0, ((maxPower - totalPower) / maxPower) * 100);
            powerMargin.textContent = `Margem: ${margin.toFixed(0)}%`;
        }

        // Update individual bus bars (simplified distribution)
        const primaryPower = totalPower * 0.6; // 60% to primary bus
        const secondaryPower = totalPower * 0.4; // 40% to secondary bus

        this.updatePowerBus('primary', primaryPower, 10);
        this.updatePowerBus('secondary', secondaryPower, 5);

        // Update battery backup time
        const essentialPower = primaryPower * 0.5; // Essential systems
        const backupTime = essentialPower > 0 ? Math.round((2 * 60) / essentialPower) : 30; // 2kW battery

        const batteryElement = this.elements.powerBars.get('battery');
        if (batteryElement?.text) {
            batteryElement.text.textContent = `${Math.min(30, backupTime)} min`;
        }
    }

    /**
     * Updates a specific power bus display
     */
    updatePowerBus(busName, power, capacity) {
        const busElements = this.elements.powerBars.get(busName);
        if (!busElements) return;

        const percentage = Math.min(100, (power / capacity) * 100);

        if (busElements.bar) {
            busElements.bar.style.width = `${percentage}%`;
        }

        if (busElements.text) {
            busElements.text.textContent = `${power.toFixed(1)} / ${capacity.toFixed(1)} kW`;
        }
    }

    /**
     * Updates integration efficiency calculation
     */
    updateIntegrationEfficiency() {
        // Simplified efficiency calculation
        let efficiency = 100;

        // Reduce efficiency for excessive system count
        if (this.installedSystems.size > 8) {
            efficiency -= (this.installedSystems.size - 8) * 5;
        }

        // Check for synergies
        const synergyCount = this.calculateSynergies();
        if (synergyCount > 0) {
            efficiency += synergyCount * 3;
        }

        efficiency = Math.max(0, Math.min(100, efficiency));

        this.updateDisplay('integration-efficiency', `${Math.round(efficiency)}`);

        const efficiencyBar = document.getElementById('efficiency-bar');
        if (efficiencyBar) {
            efficiencyBar.style.width = `${efficiency}%`;
        }

        const synergyElement = document.getElementById('synergy-count');
        if (synergyElement) {
            synergyElement.textContent = `${synergyCount} sinergias ativas`;
        }
    }

    /**
     * Calculates system synergies
     */
    calculateSynergies() {
        let synergyCount = 0;

        // Check for common synergies
        const hasRadar = this.hasSystemCategory('radar');
        const hasFireControl = this.hasSystemCategory('firecontrol');
        const hasNavigation = this.hasSystemCategory('navigation');
        const hasAutopilot = this.hasSystemCategory('autopilot');

        if (hasRadar && hasFireControl) synergyCount++;
        if (hasNavigation && hasAutopilot) synergyCount++;
        if (hasRadar && hasNavigation) synergyCount++;

        return synergyCount;
    }

    /**
     * Updates warnings and recommendations
     */
    updateWarningsAndRecommendations() {
        const warnings = this.generateWarnings();
        const recommendations = this.generateRecommendations();

        this.updateWarningsDisplay(warnings);
        this.updateRecommendationsDisplay(recommendations);
    }

    /**
     * Generates system warnings
     */
    generateWarnings() {
        const warnings = [];
        let totalPower = 0;
        let totalWeight = 0;

        this.installedSystems.forEach(systemId => {
            const system = this.getSystemById(systemId);
            if (system) {
                totalPower += system.powerDraw || 0;
                totalWeight += system.weight || 0;
            }
        });

        // Power warnings
        if (totalPower > 12) {
            warnings.push({
                type: 'power',
                severity: 'critical',
                message: 'Consumo de energia excede capacidade do gerador',
                recommendation: 'Instale gerador mais potente ou remova sistemas não essenciais'
            });
        } else if (totalPower > 10) {
            warnings.push({
                type: 'power',
                severity: 'warning',
                message: 'Consumo de energia próximo do limite',
                recommendation: 'Monitore consumo de energia cuidadosamente'
            });
        }

        // Weight warnings
        if (totalWeight > 400) {
            warnings.push({
                type: 'weight',
                severity: 'warning',
                message: 'Peso da aviônica pode afetar performance',
                recommendation: 'Considere sistemas mais leves'
            });
        }

        // Missing essential systems
        if (!this.hasSystemCategory('communication')) {
            warnings.push({
                type: 'missing',
                severity: 'critical',
                message: 'Sistema de comunicação é essencial',
                recommendation: 'Instale ao menos um rádio básico'
            });
        }

        return warnings;
    }

    /**
     * Generates system recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        // Basic recommendations based on aircraft category
        const aircraftCategory = window.currentAircraft?.category || 'fighter';

        if (aircraftCategory === 'fighter') {
            if (!this.hasSystemCategory('radar')) {
                recommendations.push({
                    priority: 'high',
                    title: 'Instalar Radar de Interceptação',
                    description: 'Caças se beneficiam muito de sistemas radar para combate ar-ar',
                    systems: ['radar_intercept_x_band', 'radar_search_s_band']
                });
            }

            if (!this.hasSystemCategory('firecontrol')) {
                recommendations.push({
                    priority: 'high',
                    title: 'Instalar Sistema de Controle de Tiro',
                    description: 'Melhora significativamente a precisão das armas',
                    systems: ['fire_control_lead_computing', 'gunsight_gyroscopic']
                });
            }
        }

        if (aircraftCategory === 'bomber') {
            if (!this.hasSystemCategory('navigation')) {
                recommendations.push({
                    priority: 'high',
                    title: 'Instalar Navegação Avançada',
                    description: 'Bombardeiros precisam de navegação precisa para missões de longo alcance',
                    systems: ['navigation_precision', 'navigation_inertial']
                });
            }

            if (!this.hasSystemCategory('autopilot')) {
                recommendations.push({
                    priority: 'medium',
                    title: 'Considerar Piloto Automático',
                    description: 'Reduz carga de trabalho em voos longos',
                    systems: ['autopilot_three_axis']
                });
            }
        }

        // Synergy recommendations
        if (this.hasSystemCategory('radar') && !this.hasSystemCategory('firecontrol')) {
            recommendations.push({
                priority: 'medium',
                title: 'Aproveitar Sinergia Radar-Tiro',
                description: 'Combine radar com controle de tiro para máxima efetividade',
                systems: ['fire_control_ballistic_computer']
            });
        }

        return recommendations;
    }

    /**
     * Updates warnings display
     */
    updateWarningsDisplay(warnings) {
        const container = this.elements.warningsContainer;
        if (!container) return;

        if (warnings.length === 0) {
            container.classList.add('hidden');
            return;
        }

        container.classList.remove('hidden');

        const warningsList = document.getElementById('avionics-warnings-list');
        if (warningsList) {
            let html = '';

            warnings.forEach(warning => {
                const severityClass = warning.severity === 'critical' ? 'text-red-300' : 'text-yellow-300';
                const severityIcon = warning.severity === 'critical' ? '🚨' : '⚠️';

                html += `
                    <div class="flex items-start gap-3 p-3 rounded-lg border ${
                        warning.severity === 'critical'
                            ? 'border-red-800/50 bg-red-900/20'
                            : 'border-yellow-800/50 bg-yellow-900/20'
                    }">
                        <span class="text-xl">${severityIcon}</span>
                        <div>
                            <h4 class="font-semibold ${severityClass}">${warning.message}</h4>
                            <p class="text-sm text-slate-300 mt-1">${warning.recommendation}</p>
                        </div>
                    </div>
                `;
            });

            warningsList.innerHTML = html;
        }
    }

    /**
     * Updates recommendations display
     */
    updateRecommendationsDisplay(recommendations) {
        const container = this.elements.recommendationsContainer;
        if (!container) return;

        let html = '';

        if (recommendations.length === 0) {
            html = `
                <div class="flex items-center gap-2 text-blue-200">
                    <span>✅</span>
                    <span>Configuração de aviônica adequada para esta aeronave</span>
                </div>
            `;
        } else {
            recommendations.forEach(rec => {
                const priorityColor = rec.priority === 'high' ? 'text-red-300' : 'text-yellow-300';
                const priorityIcon = rec.priority === 'high' ? '🔥' : '💡';

                html += `
                    <div class="flex items-start gap-3 p-3 rounded-lg border border-blue-800/50 bg-blue-900/20">
                        <span class="text-xl">${priorityIcon}</span>
                        <div>
                            <h4 class="font-semibold ${priorityColor}">${rec.title}</h4>
                            <p class="text-sm text-blue-200 mt-1">${rec.description}</p>
                            ${rec.systems ? `
                                <div class="mt-2 text-xs text-blue-300">
                                    Sistemas sugeridos: ${rec.systems.join(', ')}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            });
        }

        container.innerHTML = html;
    }

    /**
     * Handles configuration changes
     */
    handleConfigurationChange(elementId, value) {
        console.log(`⚙️ Configuration changed: ${elementId} = ${value}`);

        // Update aircraft configuration
        if (!window.currentAircraft.avionicsConfig) {
            window.currentAircraft.avionicsConfig = {};
        }

        const configMap = {
            'radar-mode-select': 'radarMode',
            'navigation-mode-select': 'navigationMode',
            'communication-freq-select': 'communicationFreq',
            'ecm-mode-select': 'ecmMode'
        };

        const configKey = configMap[elementId];
        if (configKey) {
            window.currentAircraft.avionicsConfig[configKey] = value;
        }

        // Update performance modifiers based on configuration
        this.updateConfigurationEffects(configKey, value);

        // Trigger aircraft calculations
        if (typeof window.updateAircraftCalculations === 'function') {
            window.updateAircraftCalculations();
        }
    }

    /**
     * Updates performance effects based on configuration
     */
    updateConfigurationEffects(configKey, value) {
        const effects = {
            pilot_workload: document.getElementById('pilot-workload-display'),
            situational_awareness: document.getElementById('situational-awareness-display'),
            weapon_accuracy: document.getElementById('weapon-accuracy-display'),
            survival_probability: document.getElementById('survival-probability-display')
        };

        // Calculate configuration bonuses
        let workloadMultiplier = 1.0;
        let awarenessMultiplier = 1.0;
        let accuracyMultiplier = 1.0;
        let survivalMultiplier = 1.0;

        // Apply configuration effects
        if (configKey === 'radarMode' && value === 'air_to_air') {
            accuracyMultiplier += 0.2;
            awarenessMultiplier += 0.15;
        }

        if (configKey === 'navigationMode' && value === 'autopilot') {
            workloadMultiplier -= 0.3;
        }

        if (configKey === 'ecmMode' && value === 'active') {
            survivalMultiplier += 0.3;
        }

        // Update displays
        if (effects.pilot_workload) {
            effects.pilot_workload.textContent = `${Math.round(workloadMultiplier * 100)}%`;
        }
        if (effects.situational_awareness) {
            effects.situational_awareness.textContent = `${Math.round(awarenessMultiplier * 100)}%`;
        }
        if (effects.weapon_accuracy) {
            effects.weapon_accuracy.textContent = `${Math.round(accuracyMultiplier * 100)}%`;
        }
        if (effects.survival_probability) {
            effects.survival_probability.textContent = `${Math.round(survivalMultiplier * 100)}%`;
        }
    }

    /**
     * Starts the update loop for real-time interface updates
     */
    startUpdateLoop() {
        // Update every 2 seconds
        this.updateInterval = setInterval(() => {
            this.updateOverallStatus();
        }, 2000);
    }

    /**
     * Handles aircraft update events
     */
    handleAircraftUpdate(calculationResults) {
        // Update installed systems from aircraft data
        if (window.currentAircraft?.avionics) {
            this.installedSystems.clear();
            window.currentAircraft.avionics.forEach(systemId => {
                this.installedSystems.add(systemId);
            });

            // Refresh current category display
            this.loadCategory(this.currentCategory);
            this.updateOverallStatus();
        }
    }

    // ===== UTILITY METHODS =====

    updateDisplay(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    getSystemById(systemId) {
        for (const systems of this.availableSystems.values()) {
            const system = systems.find(s => s.id === systemId);
            if (system) return system;
        }
        return null;
    }

    isSystemAvailable(system) {
        const currentYear = window.currentUserCountry?.year || 1954;
        const techLevel = window.currentUserCountry?.aircraftTech || 50;

        if (system.year_introduced && currentYear < system.year_introduced) return false;
        if (system.tech_level && techLevel < system.tech_level) return false;

        return true;
    }

    checkDependencyStatus(system) {
        // Simplified dependency checking
        const dependencies = avionicsIntegrationSystem.systemDependencies[system.id] || [];
        const conflicts = avionicsIntegrationSystem.systemConflicts[system.id] || [];

        const unmetDependencies = dependencies.filter(dep => !this.installedSystems.has(dep));
        const activeConflicts = conflicts.filter(conflict => this.installedSystems.has(conflict));

        return {
            met: unmetDependencies.length === 0,
            hasConflicts: activeConflicts.length > 0,
            dependencies: dependencies,
            conflicts: activeConflicts,
            unmetDependencies
        };
    }

    findDependentSystems(systemId) {
        const dependentSystems = [];

        this.installedSystems.forEach(installedId => {
            const dependencies = avionicsIntegrationSystem.systemDependencies[installedId] || [];
            if (dependencies.includes(systemId)) {
                const system = this.getSystemById(installedId);
                if (system) {
                    dependentSystems.push(system);
                }
            }
        });

        return dependentSystems;
    }

    getTechLevelClass(techLevel) {
        if (techLevel <= 30) return 'early';
        if (techLevel <= 50) return 'standard';
        if (techLevel <= 70) return 'advanced';
        return 'experimental';
    }

    getSystemStatusClass(system, isInstalled) {
        if (!isInstalled) return 'failed';
        return 'operational';
    }

    getSystemStatusIcon(system, isInstalled) {
        if (!isInstalled) return '○';
        return '●';
    }

    hasSystemCategory(category) {
        const categoryMap = {
            radar: ['radar', 'search', 'intercept'],
            navigation: ['navigation', 'compass', 'gyro'],
            communication: ['communication', 'radio'],
            firecontrol: ['fire_control', 'gunsight'],
            countermeasures: ['ecm', 'chaff'],
            autopilot: ['autopilot', 'flight_control']
        };

        const keywords = categoryMap[category] || [];

        for (const systemId of this.installedSystems) {
            const system = this.getSystemById(systemId);
            if (system) {
                const name = (system.name || '').toLowerCase();
                const type = (system.type || '').toLowerCase();

                if (keywords.some(keyword => name.includes(keyword) || type.includes(keyword))) {
                    return true;
                }
            }
        }

        return false;
    }

    showSystemUnavailableMessage(system) {
        const currentYear = window.currentUserCountry?.year || 1954;
        const techLevel = window.currentUserCountry?.aircraftTech || 50;

        let message = `${system.name} não está disponível.\n\n`;

        if (system.year_introduced && currentYear < system.year_introduced) {
            message += `Será disponível em ${system.year_introduced}`;
        }

        if (system.tech_level && techLevel < system.tech_level) {
            message += `Requer nível tecnológico ${system.tech_level} (atual: ${techLevel})`;
        }

        alert(message);
    }

    showDependencyMessage(system, dependencyStatus) {
        const deps = dependencyStatus.unmetDependencies.map(dep => {
            const depSystem = this.getSystemById(dep);
            return depSystem?.name || dep;
        }).join(', ');

        alert(`${system.name} requer os seguintes sistemas:\n\n${deps}\n\nInstale-os primeiro.`);
    }

    showConflictMessage(system, dependencyStatus) {
        const conflicts = dependencyStatus.conflicts.map(conflict => {
            const conflictSystem = this.getSystemById(conflict);
            return conflictSystem?.name || conflict;
        }).join(', ');

        alert(`${system.name} conflita com:\n\n${conflicts}\n\nRemova-os primeiro.`);
    }

    showDependentSystemsMessage(system, dependentSystems) {
        const deps = dependentSystems.map(s => s.name).join(', ');

        alert(`Não é possível remover ${system.name}.\n\nOs seguintes sistemas dependem dele:\n\n${deps}\n\nRemova-os primeiro.`);
    }

    highlightSystemDependencies(systemId) {
        // Visual dependency highlighting implementation
        // This would draw lines or highlight related systems
        console.log(`Highlighting dependencies for ${systemId}`);
    }

    clearDependencyHighlights() {
        // Clear all dependency highlights
        console.log('Clearing dependency highlights');
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.initialized = false;
    }
}

// Create global instance
const avionicsAdvancedHandler = new AvionicsAdvancedHandler();

// Make it available globally
window.avionicsAdvancedHandler = avionicsAdvancedHandler;

// Global initialization function
window.initializeAdvancedAvionics = function() {
    avionicsAdvancedHandler.initialize();
};

// Export for module use
export { avionicsAdvancedHandler };

console.log('📡 AvionicsAdvancedHandler module loaded');