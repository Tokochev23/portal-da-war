/**
 * Performance Indicators - War1954 Aircraft Creator
 *
 * Visual performance indicators that provide intuitive feedback about aircraft
 * capabilities through gauges, charts, and visual elements. Creates an
 * immersive cockpit-like experience for aircraft design evaluation.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class PerformanceIndicators {
    constructor() {
        this.initialized = false;
        this.indicatorContainer = null;
        this.currentAircraft = null;
        this.gauges = new Map();
        this.charts = new Map();
        this.animations = new Map();

        // Performance indicator types
        this.indicatorTypes = {
            gauge: 'CircularGauge',
            bar: 'LinearBar',
            chart: 'MiniChart',
            status: 'StatusLight',
            radar: 'RadarDisplay'
        };

        // Gauge configurations
        this.gaugeConfigs = {
            thrust_to_weight: {
                type: 'gauge',
                label: 'T/W Ratio',
                min: 0,
                max: 2.0,
                optimal: { min: 0.8, max: 1.5 },
                units: ':1',
                precision: 2,
                color: '#3b82f6',
                icon: '🚀'
            },
            max_speed: {
                type: 'gauge',
                label: 'Velocidade',
                min: 0,
                max: 1000,
                optimal: { min: 400, max: 800 },
                units: 'km/h',
                precision: 0,
                color: '#10b981',
                icon: '⚡'
            },
            wing_loading: {
                type: 'bar',
                label: 'Carga Alar',
                min: 0,
                max: 600,
                optimal: { min: 200, max: 400 },
                units: 'kg/m²',
                precision: 0,
                color: '#f59e0b',
                icon: '✈️',
                inverted: true // Lower is better
            },
            range: {
                type: 'bar',
                label: 'Alcance',
                min: 0,
                max: 3000,
                optimal: { min: 800, max: 2000 },
                units: 'km',
                precision: 0,
                color: '#8b5cf6',
                icon: '🌍'
            },
            climb_rate: {
                type: 'gauge',
                label: 'Taxa Subida',
                min: 0,
                max: 50,
                optimal: { min: 15, max: 35 },
                units: 'm/s',
                precision: 1,
                color: '#06b6d4',
                icon: '📈'
            },
            fuel_efficiency: {
                type: 'bar',
                label: 'Eficiência',
                min: 0,
                max: 100,
                optimal: { min: 60, max: 90 },
                units: '%',
                precision: 1,
                color: '#84cc16',
                icon: '🛢️'
            },
            maneuverability: {
                type: 'radar',
                label: 'Manobrabilidade',
                min: 0,
                max: 100,
                units: '%',
                precision: 0,
                color: '#ef4444',
                icon: '🎯'
            },
            cost_efficiency: {
                type: 'status',
                label: 'Custo-Benefício',
                states: ['poor', 'adequate', 'good', 'excellent'],
                colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'],
                icon: '💰'
            }
        };

        // Animation configurations
        this.animationConfig = {
            duration: 800,
            easing: 'easeOutCubic',
            stagger: 100,
            updateInterval: 200
        };

        console.log('📊 PerformanceIndicators initialized');
    }

    /**
     * Initializes the performance indicators system
     */
    initialize(containerId) {
        try {
            this.indicatorContainer = document.getElementById(containerId);
            if (!this.indicatorContainer) {
                throw new Error(`Indicator container '${containerId}' not found`);
            }

            this.createIndicatorStructure();
            this.initializeIndicators();
            this.setupEventListeners();

            this.initialized = true;
            console.log('✅ Performance Indicators initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Performance Indicators:', error);
            throw error;
        }
    }

    /**
     * Creates the main indicator structure
     */
    createIndicatorStructure() {
        const indicatorHTML = `
            <div class="performance-indicators">
                <!-- Header -->
                <div class="indicators-header">
                    <h3>📊 Indicadores de Performance</h3>
                    <div class="header-controls">
                        <button class="indicator-btn" id="toggle-animation">
                            🎬 Animação
                        </button>
                        <button class="indicator-btn" id="reset-indicators">
                            🔄 Reset
                        </button>
                    </div>
                </div>

                <!-- Primary Gauges -->
                <div class="primary-gauges" id="primary-gauges">
                    <div class="gauge-section">
                        <h4>Performance Principal</h4>
                        <div class="gauge-grid">
                            <!-- Primary gauges will be populated -->
                        </div>
                    </div>
                </div>

                <!-- Secondary Indicators -->
                <div class="secondary-indicators" id="secondary-indicators">
                    <div class="indicators-row">
                        <div class="linear-indicators">
                            <h4>Características</h4>
                            <div class="linear-grid" id="linear-grid">
                                <!-- Linear indicators will be populated -->
                            </div>
                        </div>
                        <div class="status-indicators">
                            <h4>Status</h4>
                            <div class="status-grid" id="status-grid">
                                <!-- Status indicators will be populated -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Performance Radar -->
                <div class="performance-radar-section" id="performance-radar-section">
                    <h4>Radar de Capacidades</h4>
                    <div class="radar-container">
                        <canvas id="performance-radar-indicator" width="300" height="300"></canvas>
                        <div class="radar-legend" id="radar-legend">
                            <!-- Radar legend will be populated -->
                        </div>
                    </div>
                </div>

                <!-- Live Performance Feed -->
                <div class="performance-feed" id="performance-feed">
                    <h4>📡 Feed de Performance</h4>
                    <div class="feed-content" id="feed-content">
                        <div class="feed-item excellent">
                            <span class="feed-icon">✅</span>
                            <span class="feed-text">Sistema inicializado</span>
                            <span class="feed-time">agora</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.indicatorContainer.innerHTML = indicatorHTML;
    }

    /**
     * Initializes all performance indicators
     */
    initializeIndicators() {
        this.createPrimaryGauges();
        this.createLinearIndicators();
        this.createStatusIndicators();
        this.createPerformanceRadar();
    }

    /**
     * Creates primary circular gauges
     */
    createPrimaryGauges() {
        const gaugeGrid = this.indicatorContainer.querySelector('.gauge-grid');
        const primaryMetrics = ['thrust_to_weight', 'max_speed', 'climb_rate'];

        primaryMetrics.forEach(metric => {
            const config = this.gaugeConfigs[metric];
            const gaugeElement = this.createCircularGauge(metric, config);
            gaugeGrid.appendChild(gaugeElement);
        });
    }

    /**
     * Creates linear bar indicators
     */
    createLinearIndicators() {
        const linearGrid = document.getElementById('linear-grid');
        const linearMetrics = ['wing_loading', 'range', 'fuel_efficiency'];

        linearMetrics.forEach(metric => {
            const config = this.gaugeConfigs[metric];
            const indicatorElement = this.createLinearIndicator(metric, config);
            linearGrid.appendChild(indicatorElement);
        });
    }

    /**
     * Creates status light indicators
     */
    createStatusIndicators() {
        const statusGrid = document.getElementById('status-grid');
        const statusMetrics = ['cost_efficiency'];

        statusMetrics.forEach(metric => {
            const config = this.gaugeConfigs[metric];
            const statusElement = this.createStatusIndicator(metric, config);
            statusGrid.appendChild(statusElement);
        });

        // Add additional status indicators
        const additionalStatuses = [
            {
                id: 'compatibility',
                label: 'Compatibilidade',
                icon: '🔧',
                status: 'good'
            },
            {
                id: 'safety',
                label: 'Segurança',
                icon: '🛡️',
                status: 'excellent'
            },
            {
                id: 'maintenance',
                label: 'Manutenção',
                icon: '🔧',
                status: 'adequate'
            }
        ];

        additionalStatuses.forEach(status => {
            const statusElement = this.createSimpleStatusIndicator(status);
            statusGrid.appendChild(statusElement);
        });
    }

    /**
     * Creates performance radar chart
     */
    createPerformanceRadar() {
        const canvas = document.getElementById('performance-radar-indicator');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Initialize with Chart.js
        this.charts.set('radar', new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Velocidade', 'Agilidade', 'Alcance', 'Carga', 'Economia', 'Durabilidade'],
                datasets: [{
                    label: 'Performance Atual',
                    data: [0, 0, 0, 0, 0, 0],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20,
                            color: '#64748b',
                            backdropColor: 'transparent'
                        },
                        grid: {
                            color: '#334155'
                        },
                        angleLines: {
                            color: '#334155'
                        },
                        pointLabels: {
                            color: '#94a3b8',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                animation: {
                    duration: this.animationConfig.duration,
                    easing: this.animationConfig.easing
                }
            }
        }));
    }

    /**
     * Creates a circular gauge element
     */
    createCircularGauge(metricKey, config) {
        const gauge = document.createElement('div');
        gauge.className = 'circular-gauge';
        gauge.id = `gauge-${metricKey}`;

        gauge.innerHTML = `
            <div class="gauge-container">
                <svg class="gauge-svg" viewBox="0 0 200 200">
                    <!-- Background circle -->
                    <circle
                        cx="100" cy="100" r="80"
                        fill="none"
                        stroke="#334155"
                        stroke-width="8"
                    />
                    <!-- Progress circle -->
                    <circle
                        cx="100" cy="100" r="80"
                        fill="none"
                        stroke="${config.color}"
                        stroke-width="8"
                        stroke-linecap="round"
                        stroke-dasharray="502.65"
                        stroke-dashoffset="502.65"
                        transform="rotate(-90 100 100)"
                        class="gauge-progress"
                        id="progress-${metricKey}"
                    />
                    <!-- Optimal range indicator -->
                    <circle
                        cx="100" cy="100" r="75"
                        fill="none"
                        stroke="#10b981"
                        stroke-width="2"
                        stroke-dasharray="10 5"
                        opacity="0.5"
                        transform="rotate(-90 100 100)"
                        class="gauge-optimal"
                        id="optimal-${metricKey}"
                    />
                </svg>

                <div class="gauge-content">
                    <div class="gauge-icon">${config.icon}</div>
                    <div class="gauge-value" id="value-${metricKey}">0</div>
                    <div class="gauge-unit">${config.units}</div>
                    <div class="gauge-label">${config.label}</div>
                </div>
            </div>
        `;

        return gauge;
    }

    /**
     * Creates a linear bar indicator
     */
    createLinearIndicator(metricKey, config) {
        const indicator = document.createElement('div');
        indicator.className = 'linear-indicator';
        indicator.id = `linear-${metricKey}`;

        indicator.innerHTML = `
            <div class="linear-header">
                <div class="linear-info">
                    <span class="linear-icon">${config.icon}</span>
                    <span class="linear-label">${config.label}</span>
                </div>
                <div class="linear-value">
                    <span id="linear-value-${metricKey}">0</span>
                    <span class="linear-unit">${config.units}</span>
                </div>
            </div>

            <div class="linear-bar-container">
                <div class="linear-bar-background">
                    <!-- Optimal range background -->
                    <div class="optimal-range" id="optimal-range-${metricKey}"></div>
                    <!-- Progress bar -->
                    <div class="linear-bar-fill" id="linear-fill-${metricKey}"></div>
                </div>
                <div class="linear-scale">
                    <span class="scale-min">${config.min}</span>
                    <span class="scale-max">${config.max}</span>
                </div>
            </div>
        `;

        return indicator;
    }

    /**
     * Creates a status light indicator
     */
    createStatusIndicator(metricKey, config) {
        const indicator = document.createElement('div');
        indicator.className = 'status-indicator';
        indicator.id = `status-${metricKey}`;

        indicator.innerHTML = `
            <div class="status-light" id="status-light-${metricKey}">
                <div class="status-glow"></div>
            </div>
            <div class="status-info">
                <div class="status-icon">${config.icon}</div>
                <div class="status-label">${config.label}</div>
                <div class="status-text" id="status-text-${metricKey}">Avaliando...</div>
            </div>
        `;

        return indicator;
    }

    /**
     * Creates a simple status indicator
     */
    createSimpleStatusIndicator(statusConfig) {
        const indicator = document.createElement('div');
        indicator.className = 'status-indicator';
        indicator.id = `status-${statusConfig.id}`;

        indicator.innerHTML = `
            <div class="status-light ${statusConfig.status}">
                <div class="status-glow"></div>
            </div>
            <div class="status-info">
                <div class="status-icon">${statusConfig.icon}</div>
                <div class="status-label">${statusConfig.label}</div>
                <div class="status-text">${this.getStatusText(statusConfig.status)}</div>
            </div>
        `;

        return indicator;
    }

    /**
     * Updates all indicators with new aircraft data
     */
    updateIndicators(aircraft) {
        if (!this.initialized || !aircraft) return;

        this.currentAircraft = aircraft;

        // Calculate current metrics
        const metrics = this.calculateAircraftMetrics(aircraft);

        // Update each indicator type
        this.updateCircularGauges(metrics);
        this.updateLinearIndicators(metrics);
        this.updateStatusIndicators(metrics);
        this.updatePerformanceRadar(metrics);
        this.updatePerformanceFeed(metrics);
    }

    /**
     * Updates circular gauges
     */
    updateCircularGauges(metrics) {
        const gaugeMetrics = ['thrust_to_weight', 'max_speed', 'climb_rate'];

        gaugeMetrics.forEach(metric => {
            const config = this.gaugeConfigs[metric];
            const value = metrics[metric] || 0;

            this.updateCircularGauge(metric, value, config);
        });
    }

    /**
     * Updates a single circular gauge
     */
    updateCircularGauge(metricKey, value, config) {
        const progressElement = document.getElementById(`progress-${metricKey}`);
        const valueElement = document.getElementById(`value-${metricKey}`);

        if (!progressElement || !valueElement) return;

        // Calculate progress percentage
        const percentage = Math.min(100, (value / config.max) * 100);
        const circumference = 502.65; // 2 * π * 80
        const offset = circumference - (percentage / 100) * circumference;

        // Animate progress
        this.animateProperty(progressElement, 'stroke-dashoffset', offset, this.animationConfig.duration);

        // Update value display
        valueElement.textContent = value.toFixed(config.precision);

        // Update color based on optimal range
        const isOptimal = value >= config.optimal.min && value <= config.optimal.max;
        const color = isOptimal ? '#10b981' : config.color;
        progressElement.setAttribute('stroke', color);
    }

    /**
     * Updates linear bar indicators
     */
    updateLinearIndicators(metrics) {
        const linearMetrics = ['wing_loading', 'range', 'fuel_efficiency'];

        linearMetrics.forEach(metric => {
            const config = this.gaugeConfigs[metric];
            const value = metrics[metric] || 0;

            this.updateLinearIndicator(metric, value, config);
        });
    }

    /**
     * Updates a single linear indicator
     */
    updateLinearIndicator(metricKey, value, config) {
        const fillElement = document.getElementById(`linear-fill-${metricKey}`);
        const valueElement = document.getElementById(`linear-value-${metricKey}`);
        const rangeElement = document.getElementById(`optimal-range-${metricKey}`);

        if (!fillElement || !valueElement) return;

        // Calculate progress percentage
        const percentage = Math.min(100, (value / config.max) * 100);

        // Animate fill
        this.animateProperty(fillElement, 'width', `${percentage}%`, this.animationConfig.duration);

        // Update value display
        valueElement.textContent = value.toFixed(config.precision);

        // Update optimal range display
        if (rangeElement) {
            const optimalStart = (config.optimal.min / config.max) * 100;
            const optimalWidth = ((config.optimal.max - config.optimal.min) / config.max) * 100;

            rangeElement.style.left = `${optimalStart}%`;
            rangeElement.style.width = `${optimalWidth}%`;
        }

        // Update color based on performance
        const isOptimal = value >= config.optimal.min && value <= config.optimal.max;
        const color = isOptimal ? '#10b981' : config.inverted ? '#ef4444' : config.color;
        fillElement.style.backgroundColor = color;
    }

    /**
     * Updates status indicators
     */
    updateStatusIndicators(metrics) {
        // Update cost efficiency status
        const costEfficiency = this.calculateCostEfficiencyStatus(metrics);
        this.updateStatusLight('cost_efficiency', costEfficiency);

        // Update other status indicators based on aircraft state
        this.updateCompatibilityStatus();
        this.updateSafetyStatus();
        this.updateMaintenanceStatus();
    }

    /**
     * Updates a status light
     */
    updateStatusLight(metricKey, status) {
        const lightElement = document.getElementById(`status-light-${metricKey}`);
        const textElement = document.getElementById(`status-text-${metricKey}`);

        if (!lightElement || !textElement) return;

        // Update light color
        lightElement.className = `status-light ${status}`;

        // Update status text
        textElement.textContent = this.getStatusText(status);

        // Add pulse animation for status changes
        lightElement.classList.add('status-pulse');
        setTimeout(() => {
            lightElement.classList.remove('status-pulse');
        }, 1000);
    }

    /**
     * Updates performance radar
     */
    updatePerformanceRadar(metrics) {
        const radarChart = this.charts.get('radar');
        if (!radarChart) return;

        const radarData = [
            Math.min(100, (metrics.max_speed / 800) * 100),           // Velocidade
            Math.min(100, (2 - metrics.wing_loading / 400) * 100),    // Agilidade (inverted)
            Math.min(100, (metrics.range / 2000) * 100),              // Alcance
            Math.min(100, (metrics.payload / 5000) * 100),            // Carga
            Math.min(100, metrics.fuel_efficiency),                    // Economia
            Math.min(100, (1 / metrics.maintenance_burden) * 100)     // Durabilidade
        ];

        radarChart.data.datasets[0].data = radarData;
        radarChart.update('none');
    }

    /**
     * Updates performance feed
     */
    updatePerformanceFeed(metrics) {
        const feedContent = document.getElementById('feed-content');
        if (!feedContent) return;

        // Generate performance insights
        const insights = this.generatePerformanceInsights(metrics);

        // Add new insights to feed
        insights.forEach(insight => {
            const feedItem = this.createFeedItem(insight);
            feedContent.insertBefore(feedItem, feedContent.firstChild);
        });

        // Limit feed items
        const items = feedContent.children;
        while (items.length > 5) {
            feedContent.removeChild(items[items.length - 1]);
        }
    }

    /**
     * Creates a feed item
     */
    createFeedItem(insight) {
        const item = document.createElement('div');
        item.className = `feed-item ${insight.type}`;

        item.innerHTML = `
            <span class="feed-icon">${insight.icon}</span>
            <span class="feed-text">${insight.message}</span>
            <span class="feed-time">${insight.time}</span>
        `;

        // Animate in
        setTimeout(() => {
            item.classList.add('feed-item-enter');
        }, 50);

        return item;
    }

    /**
     * Generates performance insights
     */
    generatePerformanceInsights(metrics) {
        const insights = [];
        const now = new Date().toLocaleTimeString();

        // Speed analysis
        if (metrics.max_speed > 600) {
            insights.push({
                type: 'excellent',
                icon: '⚡',
                message: 'Velocidade máxima excelente detectada',
                time: now
            });
        }

        // T/W ratio analysis
        if (metrics.thrust_to_weight > 1.2) {
            insights.push({
                type: 'good',
                icon: '🚀',
                message: 'Razão empuxo/peso superior à média',
                time: now
            });
        }

        // Efficiency analysis
        if (metrics.fuel_efficiency > 80) {
            insights.push({
                type: 'excellent',
                icon: '🌱',
                message: 'Eficiência de combustível otimizada',
                time: now
            });
        }

        return insights;
    }

    /**
     * Sets up event listeners
     */
    setupEventListeners() {
        const toggleAnimationBtn = document.getElementById('toggle-animation');
        const resetBtn = document.getElementById('reset-indicators');

        if (toggleAnimationBtn) {
            toggleAnimationBtn.addEventListener('click', () => this.toggleAnimations());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetIndicators());
        }
    }

    /**
     * Toggles animations on/off
     */
    toggleAnimations() {
        // Implementation for toggling animations
        console.log('🎬 Toggling animations...');
    }

    /**
     * Resets all indicators
     */
    resetIndicators() {
        // Reset all indicators to zero state
        console.log('🔄 Resetting indicators...');
        this.updateIndicators({});
    }

    // ===== HELPER METHODS =====

    calculateAircraftMetrics(aircraft) {
        // This would integrate with actual calculation systems
        return {
            thrust_to_weight: Math.random() * 2,
            max_speed: Math.random() * 800 + 200,
            wing_loading: Math.random() * 400 + 200,
            range: Math.random() * 2000 + 500,
            climb_rate: Math.random() * 40 + 10,
            fuel_efficiency: Math.random() * 100,
            payload: Math.random() * 5000 + 1000,
            maintenance_burden: Math.random() * 20 + 5
        };
    }

    calculateCostEfficiencyStatus(metrics) {
        // Simplified cost efficiency calculation
        const efficiency = metrics.fuel_efficiency || 50;

        if (efficiency >= 85) return 'excellent';
        if (efficiency >= 70) return 'good';
        if (efficiency >= 50) return 'adequate';
        return 'poor';
    }

    updateCompatibilityStatus() {
        this.updateStatusLight('compatibility', 'good');
    }

    updateSafetyStatus() {
        this.updateStatusLight('safety', 'excellent');
    }

    updateMaintenanceStatus() {
        this.updateStatusLight('maintenance', 'adequate');
    }

    getStatusText(status) {
        const statusTexts = {
            excellent: 'Excelente',
            good: 'Bom',
            adequate: 'Adequado',
            poor: 'Ruim'
        };
        return statusTexts[status] || 'Desconhecido';
    }

    animateProperty(element, property, targetValue, duration) {
        // Simple animation helper
        const startValue = parseFloat(element.style[property]) || 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = startValue + (parseFloat(targetValue) - startValue) * easeProgress;

            if (property === 'stroke-dashoffset') {
                element.setAttribute('stroke-dashoffset', currentValue);
            } else {
                element.style[property] = typeof targetValue === 'string' && targetValue.includes('%')
                    ? `${currentValue}%`
                    : currentValue;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * Destroys the performance indicators
     */
    destroy() {
        // Destroy charts
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();

        // Clear animations
        this.animations.clear();

        this.initialized = false;
        console.log('🗑️ Performance Indicators destroyed');
    }
}

// Create global instance
export const performanceIndicators = new PerformanceIndicators();

// Make it available globally
window.performanceIndicators = performanceIndicators;

console.log('📊 PerformanceIndicators module loaded');