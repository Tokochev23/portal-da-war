/**
 * Dashboard Integration - War1954 Aircraft Creator
 *
 * Master integration system that coordinates all UI/UX components of the
 * Engineering Dashboard. Manages communication between systems and provides
 * a unified interface for the aircraft creator.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { engineeringDashboard } from './EngineeringDashboard.js';
import { smartTooltipSystem } from './SmartTooltipSystem.js';
import { realTimeFeedbackSystem } from './RealTimeFeedbackSystem.js';
import { designComparisonSystem } from './DesignComparisonSystem.js';
import { performanceIndicators } from './PerformanceIndicators.js';

export class DashboardIntegration {
    constructor() {
        this.initialized = false;
        this.currentAircraft = null;
        this.systems = new Map();
        this.eventListeners = new Map();

        // Integration configuration
        this.config = {
            autoUpdate: true,
            updateInterval: 500,
            syncSystems: true,
            enableTooltips: true,
            enableFeedback: true,
            enableComparison: true
        };

        // System dependencies
        this.systemDependencies = {
            dashboard: { deps: [], required: true },
            tooltips: { deps: ['dashboard'], required: true },
            feedback: { deps: ['dashboard'], required: true },
            comparison: { deps: ['dashboard'], required: false },
            indicators: { deps: ['dashboard'], required: true }
        };

        console.log('🔧 DashboardIntegration initialized');
    }

    /**
     * Initializes the complete dashboard integration
     */
    async initialize(containerId, options = {}) {
        try {
            // Apply configuration options
            Object.assign(this.config, options);

            // Register all systems
            this.registerSystems();

            // Initialize systems in dependency order
            await this.initializeSystems(containerId);

            // Setup inter-system communication
            this.setupSystemCommunication();

            // Setup global event listeners
            this.setupGlobalEventListeners();

            // Start monitoring and updates
            this.startMonitoring();

            this.initialized = true;
            console.log('✅ Dashboard Integration initialized successfully');

            // Trigger initialization complete event
            this.dispatchEvent('dashboardInitialized', {
                systems: Array.from(this.systems.keys()),
                config: this.config
            });

        } catch (error) {
            console.error('❌ Failed to initialize Dashboard Integration:', error);
            throw error;
        }
    }

    /**
     * Registers all dashboard systems
     */
    registerSystems() {
        this.systems.set('dashboard', {
            instance: engineeringDashboard,
            status: 'pending',
            container: null
        });

        this.systems.set('tooltips', {
            instance: smartTooltipSystem,
            status: 'pending',
            container: null
        });

        this.systems.set('feedback', {
            instance: realTimeFeedbackSystem,
            status: 'pending',
            container: null
        });

        this.systems.set('comparison', {
            instance: designComparisonSystem,
            status: 'pending',
            container: null
        });

        this.systems.set('indicators', {
            instance: performanceIndicators,
            status: 'pending',
            container: null
        });
    }

    /**
     * Initializes systems in proper dependency order
     */
    async initializeSystems(containerId) {
        // Create main dashboard structure
        const mainContainer = document.getElementById(containerId);
        if (!mainContainer) {
            throw new Error(`Main container '${containerId}' not found`);
        }

        await this.createDashboardLayout(mainContainer);

        // Initialize core dashboard first
        await this.initializeSystem('dashboard', 'main-dashboard');

        // Initialize tooltip system globally
        if (this.config.enableTooltips) {
            await this.initializeSystem('tooltips');
        }

        // Initialize feedback system
        if (this.config.enableFeedback) {
            await this.initializeSystem('feedback', 'feedback-panel');
        }

        // Initialize performance indicators
        await this.initializeSystem('indicators', 'performance-indicators');

        // Initialize comparison system
        if (this.config.enableComparison) {
            await this.initializeSystem('comparison');
        }
    }

    /**
     * Creates the main dashboard layout
     */
    async createDashboardLayout(container) {
        const layoutHTML = `
            <div class="dashboard-integration-layout">
                <!-- Main Dashboard Area -->
                <div class="dashboard-main" id="main-dashboard">
                    <!-- Main dashboard content will be populated here -->
                </div>

                <!-- Secondary Panels -->
                <div class="dashboard-secondary">
                    <!-- Performance Indicators -->
                    <div class="dashboard-panel" id="performance-indicators">
                        <!-- Performance indicators will be populated here -->
                    </div>

                    <!-- Real-time Feedback -->
                    <div class="dashboard-panel" id="feedback-panel">
                        <!-- Feedback system will be populated here -->
                    </div>
                </div>

                <!-- Quick Actions Bar -->
                <div class="quick-actions-bar" id="quick-actions">
                    <button class="quick-action" id="quick-compare" title="Comparar Designs">
                        📊
                    </button>
                    <button class="quick-action" id="quick-export" title="Exportar Análise">
                        💾
                    </button>
                    <button class="quick-action" id="quick-help" title="Ajuda">
                        ❓
                    </button>
                    <button class="quick-action" id="quick-settings" title="Configurações">
                        ⚙️
                    </button>
                </div>

                <!-- Dashboard Status Bar -->
                <div class="dashboard-status-bar" id="status-bar">
                    <div class="status-item">
                        <span class="status-label">Sistema:</span>
                        <span class="status-value" id="system-status">Inicializando...</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Última Atualização:</span>
                        <span class="status-value" id="last-update">--</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Performance:</span>
                        <span class="status-value" id="performance-status">--</span>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = layoutHTML;
    }

    /**
     * Initializes a specific system
     */
    async initializeSystem(systemName, containerId = null) {
        const systemInfo = this.systems.get(systemName);
        if (!systemInfo) {
            throw new Error(`System '${systemName}' not registered`);
        }

        try {
            systemInfo.status = 'initializing';

            // Check dependencies
            const deps = this.systemDependencies[systemName];
            if (deps && deps.deps.length > 0) {
                for (const dep of deps.deps) {
                    const depSystem = this.systems.get(dep);
                    if (!depSystem || depSystem.status !== 'ready') {
                        throw new Error(`Dependency '${dep}' not ready for '${systemName}'`);
                    }
                }
            }

            // Initialize the system
            if (containerId) {
                await systemInfo.instance.initialize(containerId);
                systemInfo.container = containerId;
            } else {
                await systemInfo.instance.initialize();
            }

            systemInfo.status = 'ready';
            console.log(`✅ System '${systemName}' initialized`);

        } catch (error) {
            systemInfo.status = 'error';
            console.error(`❌ Failed to initialize system '${systemName}':`, error);

            // Check if system is required
            if (this.systemDependencies[systemName]?.required) {
                throw error;
            }
        }
    }

    /**
     * Sets up inter-system communication
     */
    setupSystemCommunication() {
        // Dashboard to indicators communication
        this.setupCommunicationLink('dashboard', 'indicators', (data) => {
            if (this.getSystemStatus('indicators') === 'ready') {
                performanceIndicators.updateIndicators(data.aircraft);
            }
        });

        // Dashboard to feedback communication
        this.setupCommunicationLink('dashboard', 'feedback', (data) => {
            if (this.getSystemStatus('feedback') === 'ready') {
                realTimeFeedbackSystem.updateAircraftContext(data.aircraft);
            }
        });

        // Tooltips aircraft context updates
        this.setupCommunicationLink('dashboard', 'tooltips', (data) => {
            if (this.getSystemStatus('tooltips') === 'ready') {
                smartTooltipSystem.updateAircraftContext(data.aircraft);
            }
        });

        // Cross-system event forwarding
        this.setupEventForwarding();
    }

    /**
     * Sets up communication link between systems
     */
    setupCommunicationLink(sourceSystem, targetSystem, handler) {
        const linkId = `${sourceSystem}->${targetSystem}`;
        this.eventListeners.set(linkId, handler);

        document.addEventListener(`${sourceSystem}Updated`, (event) => {
            try {
                handler(event.detail);
            } catch (error) {
                console.error(`Communication error ${linkId}:`, error);
            }
        });
    }

    /**
     * Sets up event forwarding between systems
     */
    setupEventForwarding() {
        // Aircraft configuration change events
        document.addEventListener('aircraftConfigChanged', (event) => {
            this.broadcastToAllSystems('aircraftUpdated', event.detail);
        });

        // Component selection events
        document.addEventListener('componentSelected', (event) => {
            this.broadcastToAllSystems('componentChanged', event.detail);
        });

        // Performance calculation events
        document.addEventListener('performanceCalculated', (event) => {
            this.broadcastToAllSystems('performanceUpdated', event.detail);
        });
    }

    /**
     * Sets up global event listeners
     */
    setupGlobalEventListeners() {
        // Quick action buttons
        this.setupQuickActions();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Window events
        this.setupWindowEvents();
    }

    /**
     * Sets up quick action buttons
     */
    setupQuickActions() {
        const quickCompare = document.getElementById('quick-compare');
        const quickExport = document.getElementById('quick-export');
        const quickHelp = document.getElementById('quick-help');
        const quickSettings = document.getElementById('quick-settings');

        if (quickCompare) {
            quickCompare.addEventListener('click', () => {
                if (this.getSystemStatus('comparison') === 'ready') {
                    designComparisonSystem.openComparison(this.currentAircraft);
                }
            });
        }

        if (quickExport) {
            quickExport.addEventListener('click', () => {
                this.exportDashboardData();
            });
        }

        if (quickHelp) {
            quickHelp.addEventListener('click', () => {
                this.showHelp();
            });
        }

        if (quickSettings) {
            quickSettings.addEventListener('click', () => {
                this.showSettings();
            });
        }
    }

    /**
     * Sets up keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + Shift + C: Open comparison
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
                event.preventDefault();
                if (this.getSystemStatus('comparison') === 'ready') {
                    designComparisonSystem.openComparison(this.currentAircraft);
                }
            }

            // Ctrl/Cmd + Shift + E: Export data
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
                event.preventDefault();
                this.exportDashboardData();
            }

            // F1: Help
            if (event.key === 'F1') {
                event.preventDefault();
                this.showHelp();
            }
        });
    }

    /**
     * Sets up window events
     */
    setupWindowEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseMonitoring();
            } else {
                this.resumeMonitoring();
            }
        });
    }

    /**
     * Starts monitoring and automatic updates
     */
    startMonitoring() {
        if (!this.config.autoUpdate) return;

        this.monitoringInterval = setInterval(() => {
            this.updateSystemStatus();
            this.checkSystemHealth();
        }, this.config.updateInterval);

        console.log('📡 Dashboard monitoring started');
    }

    /**
     * Updates the aircraft context across all systems
     */
    updateAircraftContext(aircraft) {
        this.currentAircraft = aircraft;

        // Update main dashboard
        if (this.getSystemStatus('dashboard') === 'ready') {
            engineeringDashboard.updateDashboard(aircraft);
        }

        // Broadcast aircraft update to all systems
        this.broadcastToAllSystems('aircraftUpdated', { aircraft });

        // Update status bar
        this.updateStatusBar();
    }

    /**
     * Broadcasts event to all ready systems
     */
    broadcastToAllSystems(eventType, data) {
        this.systems.forEach((systemInfo, systemName) => {
            if (systemInfo.status === 'ready') {
                this.dispatchEvent(`${systemName}Updated`, data);
            }
        });
    }

    /**
     * Updates dashboard status bar
     */
    updateStatusBar() {
        const systemStatus = document.getElementById('system-status');
        const lastUpdate = document.getElementById('last-update');
        const performanceStatus = document.getElementById('performance-status');

        if (systemStatus) {
            const readySystems = Array.from(this.systems.values()).filter(s => s.status === 'ready').length;
            const totalSystems = this.systems.size;
            systemStatus.textContent = `${readySystems}/${totalSystems} sistemas ativos`;
        }

        if (lastUpdate) {
            lastUpdate.textContent = new Date().toLocaleTimeString();
        }

        if (performanceStatus && this.currentAircraft) {
            performanceStatus.textContent = this.calculateOverallPerformanceStatus();
        }
    }

    /**
     * Updates system status indicators
     */
    updateSystemStatus() {
        this.updateStatusBar();

        // Check for system errors and recovery
        this.systems.forEach((systemInfo, systemName) => {
            if (systemInfo.status === 'error') {
                this.attemptSystemRecovery(systemName);
            }
        });
    }

    /**
     * Checks health of all systems
     */
    checkSystemHealth() {
        const healthStatus = {
            overall: 'healthy',
            systems: {}
        };

        this.systems.forEach((systemInfo, systemName) => {
            const health = this.assessSystemHealth(systemName);
            healthStatus.systems[systemName] = health;

            if (health === 'critical') {
                healthStatus.overall = 'critical';
            } else if (health === 'warning' && healthStatus.overall === 'healthy') {
                healthStatus.overall = 'warning';
            }
        });

        // Dispatch health status event
        this.dispatchEvent('systemHealthUpdate', healthStatus);
    }

    /**
     * Attempts to recover a failed system
     */
    async attemptSystemRecovery(systemName) {
        const systemInfo = this.systems.get(systemName);
        if (!systemInfo) return;

        console.log(`🔄 Attempting recovery for system '${systemName}'`);

        try {
            // Re-initialize the system
            await this.initializeSystem(systemName, systemInfo.container);
            console.log(`✅ System '${systemName}' recovered successfully`);

        } catch (error) {
            console.error(`❌ Failed to recover system '${systemName}':`, error);

            // If it's a non-required system, disable it
            if (!this.systemDependencies[systemName]?.required) {
                systemInfo.status = 'disabled';
                console.log(`⚠️ System '${systemName}' disabled due to repeated failures`);
            }
        }
    }

    /**
     * Exports dashboard data
     */
    exportDashboardData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            aircraft: this.currentAircraft,
            dashboardState: this.getDashboardState(),
            systemStatus: this.getSystemsStatus()
        };

        // Create and download file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aircraft-analysis-${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        console.log('💾 Dashboard data exported');
    }

    /**
     * Shows help dialog
     */
    showHelp() {
        // Implementation would show help modal
        console.log('❓ Help requested');
    }

    /**
     * Shows settings dialog
     */
    showSettings() {
        // Implementation would show settings modal
        console.log('⚙️ Settings requested');
    }

    /**
     * Handles window resize
     */
    handleWindowResize() {
        // Notify systems of resize
        this.broadcastToAllSystems('windowResized', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    /**
     * Pauses monitoring
     */
    pauseMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    /**
     * Resumes monitoring
     */
    resumeMonitoring() {
        if (!this.monitoringInterval && this.config.autoUpdate) {
            this.startMonitoring();
        }
    }

    // ===== UTILITY METHODS =====

    getSystemStatus(systemName) {
        return this.systems.get(systemName)?.status || 'unknown';
    }

    assessSystemHealth(systemName) {
        const systemInfo = this.systems.get(systemName);
        if (!systemInfo) return 'unknown';

        switch (systemInfo.status) {
            case 'ready': return 'healthy';
            case 'error': return 'critical';
            case 'initializing': return 'warning';
            default: return 'unknown';
        }
    }

    calculateOverallPerformanceStatus() {
        if (!this.currentAircraft) return 'N/A';

        // Simplified performance calculation
        return 'Bom'; // This would integrate with actual performance calculations
    }

    getDashboardState() {
        return {
            systemsReady: Array.from(this.systems.entries())
                .filter(([_, info]) => info.status === 'ready')
                .map(([name, _]) => name),
            config: this.config,
            lastUpdate: Date.now()
        };
    }

    getSystemsStatus() {
        const status = {};
        this.systems.forEach((info, name) => {
            status[name] = info.status;
        });
        return status;
    }

    dispatchEvent(eventType, detail) {
        document.dispatchEvent(new CustomEvent(eventType, { detail }));
    }

    /**
     * Destroys the dashboard integration
     */
    destroy() {
        // Stop monitoring
        this.pauseMonitoring();

        // Destroy all systems
        this.systems.forEach((systemInfo, systemName) => {
            if (systemInfo.instance && typeof systemInfo.instance.destroy === 'function') {
                systemInfo.instance.destroy();
            }
        });

        // Clear event listeners
        this.eventListeners.clear();
        this.systems.clear();

        this.initialized = false;
        console.log('🗑️ Dashboard Integration destroyed');
    }
}

// Create global instance
export const dashboardIntegration = new DashboardIntegration();

// Make it available globally
window.dashboardIntegration = dashboardIntegration;

// Global convenience function
window.initializeEngineeringDashboard = function(containerId, options = {}) {
    return dashboardIntegration.initialize(containerId, options);
};

console.log('🔧 DashboardIntegration module loaded');