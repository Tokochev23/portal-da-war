/**
 * Engineering Dashboard - War1954 Aircraft Creator
 *
 * Advanced UI/UX system that transforms the aircraft creator into a comprehensive
 * engineering workstation. Provides real-time metrics, visual feedback, and
 * intelligent tooltips for professional aircraft design experience.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class EngineeringDashboard {
    constructor() {
        this.initialized = false;
        this.currentAircraft = null;
        this.dashboardContainer = null;
        this.metrics = new Map();
        this.charts = new Map();
        this.indicators = new Map();

        // Dashboard configuration
        this.config = {
            updateInterval: 250, // ms
            animationDuration: 300,
            chartRefreshRate: 500,
            performanceThresholds: {
                excellent: 85,
                good: 70,
                adequate: 50,
                poor: 30
            }
        };

        // Metric definitions
        this.metricDefinitions = {
            thrust_to_weight: {
                label: 'Razão Empuxo/Peso',
                unit: ':1',
                format: 'decimal',
                precision: 2,
                thresholds: { excellent: 1.2, good: 0.8, adequate: 0.5, poor: 0.3 },
                description: 'Relação entre empuxo total e peso da aeronave'
            },
            wing_loading: {
                label: 'Carga Alar',
                unit: 'kg/m²',
                format: 'integer',
                thresholds: { excellent: 300, good: 400, adequate: 500, poor: 600 },
                description: 'Peso por área de asa - afeta manobrabilidade'
            },
            fuel_fraction: {
                label: 'Fração de Combustível',
                unit: '%',
                format: 'percentage',
                precision: 1,
                thresholds: { excellent: 40, good: 30, adequate: 20, poor: 15 },
                description: 'Percentual do peso total dedicado ao combustível'
            },
            l_over_d: {
                label: 'Eficiência L/D',
                unit: ':1',
                format: 'decimal',
                precision: 1,
                thresholds: { excellent: 15, good: 12, adequate: 8, poor: 5 },
                description: 'Razão sustentação/arrasto - eficiência aerodinâmica'
            },
            cost_effectiveness: {
                label: 'Custo-Efetividade',
                unit: '$/kg',
                format: 'currency',
                thresholds: { excellent: 50000, good: 100000, adequate: 200000, poor: 300000 },
                description: 'Custo por quilograma de peso útil'
            },
            maintenance_burden: {
                label: 'Carga de Manutenção',
                unit: 'h/h',
                format: 'decimal',
                precision: 1,
                thresholds: { excellent: 5, good: 10, adequate: 20, poor: 35 },
                description: 'Horas de manutenção por hora de voo'
            }
        };

        console.log('🎛️ EngineeringDashboard initialized');
    }

    /**
     * Initializes the engineering dashboard
     */
    async initialize(containerId) {
        try {
            this.dashboardContainer = document.getElementById(containerId);
            if (!this.dashboardContainer) {
                throw new Error(`Dashboard container '${containerId}' not found`);
            }

            await this.createDashboardStructure();
            await this.initializeCharts();
            this.setupEventListeners();
            this.startRealTimeUpdates();

            this.initialized = true;
            console.log('✅ Engineering Dashboard initialized successfully');

        } catch (error) {
            console.error('❌ Failed to initialize Engineering Dashboard:', error);
            throw error;
        }
    }

    /**
     * Creates the main dashboard structure
     */
    async createDashboardStructure() {
        const dashboardHTML = `
            <div class="engineering-dashboard">
                <!-- Header Section -->
                <div class="dashboard-header">
                    <div class="header-info">
                        <h2 class="dashboard-title">
                            <span class="icon">🎛️</span>
                            Dashboard do Engenheiro
                        </h2>
                        <div class="aircraft-status">
                            <span class="status-indicator" id="design-status"></span>
                            <span class="aircraft-name" id="current-aircraft-name">Nova Aeronave</span>
                        </div>
                    </div>
                    <div class="header-controls">
                        <button class="dashboard-btn" id="compare-designs">
                            📊 Comparar Designs
                        </button>
                        <button class="dashboard-btn" id="export-analysis">
                            💾 Exportar Análise
                        </button>
                        <button class="dashboard-btn secondary" id="toggle-advanced">
                            🔧 Modo Avançado
                        </button>
                    </div>
                </div>

                <!-- Main Metrics Grid -->
                <div class="metrics-grid" id="metrics-grid">
                    <!-- Metrics will be populated dynamically -->
                </div>

                <!-- Performance Overview -->
                <div class="performance-section">
                    <div class="performance-charts">
                        <div class="chart-container">
                            <h3>Performance Radar</h3>
                            <canvas id="performance-radar-chart"></canvas>
                        </div>
                        <div class="chart-container">
                            <h3>Envelope de Voo</h3>
                            <canvas id="flight-envelope-chart"></canvas>
                        </div>
                    </div>
                    <div class="performance-summary" id="performance-summary">
                        <!-- Performance summary will be populated -->
                    </div>
                </div>

                <!-- Design Alerts and Recommendations -->
                <div class="alerts-section" id="alerts-section">
                    <h3>🚨 Alertas e Recomendações</h3>
                    <div class="alerts-container" id="alerts-container">
                        <!-- Alerts will be populated dynamically -->
                    </div>
                </div>

                <!-- Real-time Feedback Panel -->
                <div class="feedback-panel" id="feedback-panel">
                    <h3>📈 Feedback em Tempo Real</h3>
                    <div class="feedback-content" id="feedback-content">
                        <!-- Real-time feedback will be shown here -->
                    </div>
                </div>
            </div>
        `;

        this.dashboardContainer.innerHTML = dashboardHTML;
        await this.createMetricsGrid();
    }

    /**
     * Creates the dynamic metrics grid
     */
    async createMetricsGrid() {
        const metricsGrid = document.getElementById('metrics-grid');

        Object.entries(this.metricDefinitions).forEach(([key, definition]) => {
            const metricCard = this.createMetricCard(key, definition);
            metricsGrid.appendChild(metricCard);
        });
    }

    /**
     * Creates an individual metric card
     */
    createMetricCard(metricKey, definition) {
        const card = document.createElement('div');
        card.className = 'metric-card';
        card.id = `metric-${metricKey}`;

        card.innerHTML = `
            <div class="metric-header">
                <span class="metric-label">${definition.label}</span>
                <span class="metric-status" id="status-${metricKey}"></span>
            </div>
            <div class="metric-value">
                <span class="value" id="value-${metricKey}">--</span>
                <span class="unit">${definition.unit}</span>
            </div>
            <div class="metric-bar">
                <div class="bar-fill" id="bar-${metricKey}"></div>
            </div>
            <div class="metric-trend" id="trend-${metricKey}">
                <span class="trend-indicator"></span>
                <span class="trend-text">Sem dados</span>
            </div>
        `;

        // Add tooltip
        this.addTooltip(card, definition.description);

        return card;
    }

    /**
     * Initializes Chart.js charts
     */
    async initializeCharts() {
        // Performance Radar Chart
        const radarCtx = document.getElementById('performance-radar-chart').getContext('2d');
        this.charts.set('radar', new Chart(radarCtx, {
            type: 'radar',
            data: {
                labels: ['Velocidade', 'Manobrabilidade', 'Alcance', 'Carga', 'Economia', 'Manutenção'],
                datasets: [{
                    label: 'Performance Atual',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    pointBackgroundColor: '#3b82f6',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: { stepSize: 20 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        }));

        // Flight Envelope Chart
        const envelopeCtx = document.getElementById('flight-envelope-chart').getContext('2d');
        this.charts.set('envelope', new Chart(envelopeCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Envelope de Voo',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Velocidade (km/h)' } },
                    y: { title: { display: true, text: 'Altitude (m)' } }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        }));
    }

    /**
     * Updates the dashboard with current aircraft data
     */
    updateDashboard(aircraft) {
        if (!this.initialized || !aircraft) return;

        this.currentAircraft = aircraft;

        // Update aircraft name and status
        this.updateAircraftInfo(aircraft);

        // Calculate and update metrics
        this.updateMetrics(aircraft);

        // Update charts
        this.updateCharts(aircraft);

        // Update alerts and recommendations
        this.updateAlerts(aircraft);

        // Update real-time feedback
        this.updateFeedback(aircraft);
    }

    /**
     * Updates aircraft information display
     */
    updateAircraftInfo(aircraft) {
        const nameElement = document.getElementById('current-aircraft-name');
        const statusElement = document.getElementById('design-status');

        if (nameElement) {
            nameElement.textContent = aircraft.name || 'Nova Aeronave';
        }

        if (statusElement) {
            const overallScore = this.calculateOverallScore(aircraft);
            const status = this.getStatusFromScore(overallScore);

            statusElement.className = `status-indicator ${status.class}`;
            statusElement.textContent = status.text;
        }
    }

    /**
     * Updates all metric cards
     */
    updateMetrics(aircraft) {
        const calculatedMetrics = this.calculateMetrics(aircraft);

        Object.entries(calculatedMetrics).forEach(([key, value]) => {
            this.updateMetricCard(key, value);
        });
    }

    /**
     * Calculates all metrics from aircraft data
     */
    calculateMetrics(aircraft) {
        const metrics = {};

        // Thrust to Weight Ratio
        const totalThrust = this.getTotalThrust(aircraft);
        const totalWeight = this.getTotalWeight(aircraft);
        metrics.thrust_to_weight = totalWeight > 0 ? totalThrust / totalWeight : 0;

        // Wing Loading
        const wingArea = this.getWingArea(aircraft);
        metrics.wing_loading = wingArea > 0 ? totalWeight / wingArea : 0;

        // Fuel Fraction
        const fuelWeight = this.getFuelWeight(aircraft);
        metrics.fuel_fraction = totalWeight > 0 ? (fuelWeight / totalWeight) * 100 : 0;

        // L/D Ratio
        metrics.l_over_d = this.calculateLiftToDragRatio(aircraft);

        // Cost Effectiveness
        const totalCost = this.getTotalCost(aircraft);
        const payloadWeight = this.getPayloadWeight(aircraft);
        metrics.cost_effectiveness = payloadWeight > 0 ? totalCost / payloadWeight : 0;

        // Maintenance Burden
        metrics.maintenance_burden = this.calculateMaintenanceBurden(aircraft);

        return metrics;
    }

    /**
     * Updates an individual metric card
     */
    updateMetricCard(metricKey, value) {
        const definition = this.metricDefinitions[metricKey];
        if (!definition) return;

        const valueElement = document.getElementById(`value-${metricKey}`);
        const statusElement = document.getElementById(`status-${metricKey}`);
        const barElement = document.getElementById(`bar-${metricKey}`);
        const trendElement = document.getElementById(`trend-${metricKey}`);

        if (valueElement) {
            valueElement.textContent = this.formatValue(value, definition);
        }

        if (statusElement && barElement) {
            const status = this.getMetricStatus(value, definition.thresholds);
            statusElement.className = `metric-status ${status.class}`;
            statusElement.textContent = status.text;

            barElement.className = `bar-fill ${status.class}`;
            barElement.style.width = `${Math.min(100, (value / this.getMaxThreshold(definition.thresholds)) * 100)}%`;
        }

        if (trendElement) {
            this.updateTrendIndicator(metricKey, value, trendElement);
        }
    }

    /**
     * Updates chart data
     */
    updateCharts(aircraft) {
        // Update radar chart
        const radarChart = this.charts.get('radar');
        if (radarChart) {
            const radarData = this.calculateRadarData(aircraft);
            radarChart.data.datasets[0].data = radarData;
            radarChart.update('none');
        }

        // Update flight envelope chart
        const envelopeChart = this.charts.get('envelope');
        if (envelopeChart) {
            const envelopeData = this.calculateFlightEnvelope(aircraft);
            envelopeChart.data.labels = envelopeData.labels;
            envelopeChart.data.datasets[0].data = envelopeData.data;
            envelopeChart.update('none');
        }
    }

    /**
     * Updates alerts and recommendations
     */
    updateAlerts(aircraft) {
        const alertsContainer = document.getElementById('alerts-container');
        if (!alertsContainer) return;

        const alerts = this.generateAlerts(aircraft);

        alertsContainer.innerHTML = '';

        if (alerts.length === 0) {
            alertsContainer.innerHTML = '<div class="no-alerts">✅ Nenhum alerta crítico</div>';
            return;
        }

        alerts.forEach(alert => {
            const alertElement = this.createAlertElement(alert);
            alertsContainer.appendChild(alertElement);
        });
    }

    /**
     * Creates an alert element
     */
    createAlertElement(alert) {
        const div = document.createElement('div');
        div.className = `alert ${alert.severity}`;

        div.innerHTML = `
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-message">${alert.message}</div>
                ${alert.suggestion ? `<div class="alert-suggestion">💡 ${alert.suggestion}</div>` : ''}
            </div>
            <button class="alert-dismiss" onclick="this.parentElement.style.display='none'">×</button>
        `;

        return div;
    }

    /**
     * Adds intelligent tooltip to element
     */
    addTooltip(element, content) {
        element.addEventListener('mouseenter', (e) => {
            this.showTooltip(e.target, content);
        });

        element.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
    }

    /**
     * Shows contextual tooltip
     */
    showTooltip(target, content) {
        const tooltip = document.createElement('div');
        tooltip.className = 'engineering-tooltip';
        tooltip.innerHTML = content;

        document.body.appendChild(tooltip);

        const rect = target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;

        this.currentTooltip = tooltip;
    }

    /**
     * Hides tooltip
     */
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.remove();
            this.currentTooltip = null;
        }
    }

    /**
     * Starts real-time dashboard updates
     */
    startRealTimeUpdates() {
        this.updateInterval = setInterval(() => {
            if (this.currentAircraft) {
                this.updateDashboard(this.currentAircraft);
            }
        }, this.config.updateInterval);
    }

    /**
     * Stops real-time updates
     */
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // ===== CALCULATION HELPERS =====

    getTotalThrust(aircraft) {
        // Implementation depends on aircraft structure
        return aircraft.propulsion?.totalThrust || 0;
    }

    getTotalWeight(aircraft) {
        // Implementation depends on aircraft structure
        return aircraft.performance?.weight?.total || 0;
    }

    getWingArea(aircraft) {
        // Implementation depends on aircraft structure
        return aircraft.wings?.area || 0;
    }

    getFuelWeight(aircraft) {
        // Implementation depends on aircraft structure
        return aircraft.propulsion?.fuelWeight || 0;
    }

    calculateLiftToDragRatio(aircraft) {
        // Simplified L/D calculation
        const cl = aircraft.aerodynamics?.cl || 0.8;
        const cd = aircraft.aerodynamics?.cd || 0.05;
        return cl / cd;
    }

    getTotalCost(aircraft) {
        // Implementation depends on cost calculation system
        return aircraft.costs?.total?.program || 0;
    }

    getPayloadWeight(aircraft) {
        // Implementation depends on aircraft structure
        return aircraft.performance?.payload || 0;
    }

    calculateMaintenanceBurden(aircraft) {
        // Implementation depends on maintenance calculation
        return aircraft.maintenance?.hoursPerFlightHour || 0;
    }

    // ===== UTILITY METHODS =====

    formatValue(value, definition) {
        switch (definition.format) {
            case 'decimal':
                return value.toFixed(definition.precision || 2);
            case 'integer':
                return Math.round(value).toString();
            case 'percentage':
                return `${value.toFixed(definition.precision || 1)}`;
            case 'currency':
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0
                }).format(value);
            default:
                return value.toString();
        }
    }

    getMetricStatus(value, thresholds) {
        if (value >= thresholds.excellent) return { class: 'excellent', text: 'Excelente' };
        if (value >= thresholds.good) return { class: 'good', text: 'Bom' };
        if (value >= thresholds.adequate) return { class: 'adequate', text: 'Adequado' };
        return { class: 'poor', text: 'Ruim' };
    }

    getMaxThreshold(thresholds) {
        return Math.max(...Object.values(thresholds));
    }

    calculateOverallScore(aircraft) {
        const metrics = this.calculateMetrics(aircraft);
        const scores = Object.entries(metrics).map(([key, value]) => {
            const definition = this.metricDefinitions[key];
            const status = this.getMetricStatus(value, definition.thresholds);

            switch (status.class) {
                case 'excellent': return 100;
                case 'good': return 75;
                case 'adequate': return 50;
                case 'poor': return 25;
                default: return 0;
            }
        });

        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    getStatusFromScore(score) {
        if (score >= 85) return { class: 'excellent', text: '🟢 Excelente' };
        if (score >= 70) return { class: 'good', text: '🟡 Bom' };
        if (score >= 50) return { class: 'adequate', text: '🟠 Adequado' };
        return { class: 'poor', text: '🔴 Precisa Melhorar' };
    }

    setupEventListeners() {
        // Dashboard control buttons
        const compareBtn = document.getElementById('compare-designs');
        const exportBtn = document.getElementById('export-analysis');
        const advancedBtn = document.getElementById('toggle-advanced');

        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.openDesignComparison());
        }

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAnalysis());
        }

        if (advancedBtn) {
            advancedBtn.addEventListener('click', () => this.toggleAdvancedMode());
        }
    }

    openDesignComparison() {
        console.log('🔄 Opening design comparison...');
        // Implementation for design comparison
    }

    exportAnalysis() {
        console.log('💾 Exporting analysis...');
        // Implementation for analysis export
    }

    toggleAdvancedMode() {
        console.log('🔧 Toggling advanced mode...');
        // Implementation for advanced mode toggle
    }

    /**
     * Cleanup dashboard resources
     */
    destroy() {
        this.stopRealTimeUpdates();
        this.hideTooltip();

        // Destroy charts
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();

        this.initialized = false;
        console.log('🗑️ Engineering Dashboard destroyed');
    }
}

// Create global instance
export const engineeringDashboard = new EngineeringDashboard();

// Make it available globally
window.engineeringDashboard = engineeringDashboard;

console.log('🎛️ EngineeringDashboard module loaded');