/**
 * Real-Time Feedback System - War1954 Aircraft Creator
 *
 * Provides instant visual feedback and updates as users modify aircraft
 * configurations. Shows performance impacts, warnings, and recommendations
 * in real-time to create an engaging engineering experience.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class RealTimeFeedbackSystem {
    constructor() {
        this.initialized = false;
        this.feedbackContainer = null;
        this.previousAircraftState = null;
        this.currentAircraft = null;
        this.activeAnimations = new Map();

        // Feedback configuration
        this.config = {
            updateThrottle: 150,      // ms between updates
            animationDuration: 400,    // Animation duration
            highlightDuration: 2000,   // How long to highlight changes
            impactThreshold: 0.05,     // Minimum change to show feedback (5%)
            maxFeedbackItems: 8        // Maximum simultaneous feedback items
        };

        // Change impact categories
        this.impactCategories = {
            critical: {
                threshold: 0.3,
                icon: '🚨',
                class: 'critical',
                priority: 1
            },
            significant: {
                threshold: 0.15,
                icon: '⚠️',
                class: 'significant',
                priority: 2
            },
            moderate: {
                threshold: 0.08,
                icon: '📊',
                class: 'moderate',
                priority: 3
            },
            minor: {
                threshold: 0.02,
                icon: '📈',
                class: 'minor',
                priority: 4
            }
        };

        // Feedback message templates
        this.feedbackTemplates = {
            performance: {
                thrust_to_weight: {
                    increase: "Empuxo/peso aumentou {change}% - Melhor aceleração e climb rate",
                    decrease: "Empuxo/peso diminuiu {change}% - Reduzida capacidade de manobra vertical"
                },
                wing_loading: {
                    increase: "Carga alar aumentou {change}% - Menor manobrabilidade, maior velocidade",
                    decrease: "Carga alar diminuiu {change}% - Maior manobrabilidade, menor velocidade máxima"
                },
                fuel_fraction: {
                    increase: "Fração de combustível aumentou {change}% - Maior alcance operacional",
                    decrease: "Fração de combustível diminuiu {change}% - Menor alcance, mais payload"
                },
                l_over_d: {
                    increase: "Eficiência L/D melhorou {change}% - Menor consumo e maior alcance",
                    decrease: "Eficiência L/D piorou {change}% - Maior consumo de combustível"
                }
            },
            cost: {
                total_cost: {
                    increase: "Custo total aumentou {change}% - Impacto no orçamento",
                    decrease: "Custo total diminuiu {change}% - Economia significativa"
                },
                maintenance: {
                    increase: "Carga de manutenção aumentou {change}% - Menor disponibilidade",
                    decrease: "Carga de manutenção diminuiu {change}% - Maior disponibilidade operacional"
                }
            },
            compatibility: {
                engine_airframe: "Motor selecionado pode não ser totalmente compatível com esta fuselagem",
                material_category: "Material escolhido não é ideal para esta categoria de aeronave",
                avionics_power: "Sistemas aviônicos excedem capacidade de energia disponível",
                weight_balance: "Mudança significativa no centro de gravidade detectada"
            },
            recommendations: {
                optimization: "Configuração pode ser otimizada para melhor custo-benefício",
                balance: "Considere rebalancear peso para melhor estabilidade",
                efficiency: "Oportunidade de melhoria na eficiência aerodinâmica detectada",
                cost_reduction: "Alternativas mais econômicas disponíveis"
            }
        };

        // Visual effect types
        this.effectTypes = {
            pulse: 'pulse-effect',
            glow: 'glow-effect',
            shake: 'shake-effect',
            highlight: 'highlight-effect',
            fade: 'fade-effect'
        };

        console.log('⚡ RealTimeFeedbackSystem initialized');
    }

    /**
     * Initializes the real-time feedback system
     */
    initialize(containerId) {
        try {
            this.feedbackContainer = document.getElementById(containerId);
            if (!this.feedbackContainer) {
                throw new Error(`Feedback container '${containerId}' not found`);
            }

            this.createFeedbackStructure();
            this.setupEventListeners();
            this.startRealTimeMonitoring();

            this.initialized = true;
            console.log('✅ Real-Time Feedback System initialized');

        } catch (error) {
            console.error('❌ Failed to initialize Real-Time Feedback System:', error);
            throw error;
        }
    }

    /**
     * Creates the feedback display structure
     */
    createFeedbackStructure() {
        const feedbackHTML = `
            <div class="real-time-feedback">
                <!-- Live Status Indicator -->
                <div class="feedback-status">
                    <div class="status-dot pulse"></div>
                    <span class="status-text">Monitoramento Ativo</span>
                </div>

                <!-- Current Changes Display -->
                <div class="changes-container" id="changes-container">
                    <div class="changes-header">
                        <h4>📊 Mudanças em Tempo Real</h4>
                        <button class="clear-all" id="clear-feedback">Limpar</button>
                    </div>
                    <div class="changes-list" id="changes-list">
                        <!-- Change items will be populated dynamically -->
                    </div>
                </div>

                <!-- Performance Impact Summary -->
                <div class="impact-summary" id="impact-summary">
                    <h4>🎯 Impacto na Performance</h4>
                    <div class="impact-meters">
                        <div class="impact-meter" data-metric="speed">
                            <span class="meter-label">Velocidade</span>
                            <div class="meter-bar">
                                <div class="meter-fill" id="speed-impact"></div>
                            </div>
                            <span class="meter-value" id="speed-value">0%</span>
                        </div>
                        <div class="impact-meter" data-metric="maneuverability">
                            <span class="meter-label">Manobrabilidade</span>
                            <div class="meter-bar">
                                <div class="meter-fill" id="maneuver-impact"></div>
                            </div>
                            <span class="meter-value" id="maneuver-value">0%</span>
                        </div>
                        <div class="impact-meter" data-metric="range">
                            <span class="meter-label">Alcance</span>
                            <div class="meter-bar">
                                <div class="meter-fill" id="range-impact"></div>
                            </div>
                            <span class="meter-value" id="range-value">0%</span>
                        </div>
                        <div class="impact-meter" data-metric="cost">
                            <span class="meter-label">Custo</span>
                            <div class="meter-bar">
                                <div class="meter-fill" id="cost-impact"></div>
                            </div>
                            <span class="meter-value" id="cost-value">0%</span>
                        </div>
                    </div>
                </div>

                <!-- Live Recommendations -->
                <div class="live-recommendations" id="live-recommendations">
                    <h4>💡 Recomendações Inteligentes</h4>
                    <div class="recommendations-list" id="recommendations-list">
                        <!-- Recommendations will be populated dynamically -->
                    </div>
                </div>

                <!-- Configuration Health Score -->
                <div class="health-score" id="health-score">
                    <h4>🏥 Saúde da Configuração</h4>
                    <div class="health-display">
                        <div class="health-circle">
                            <svg class="health-circle-svg" width="80" height="80">
                                <circle cx="40" cy="40" r="35" stroke="#334155" stroke-width="6" fill="none"></circle>
                                <circle cx="40" cy="40" r="35" stroke="#10b981" stroke-width="6" fill="none"
                                        stroke-dasharray="220" stroke-dashoffset="220"
                                        class="health-progress" id="health-progress"></circle>
                            </svg>
                            <div class="health-score-text" id="health-score-text">85</div>
                        </div>
                        <div class="health-details">
                            <div class="health-breakdown">
                                <div class="health-item">
                                    <span class="health-label">Performance:</span>
                                    <span class="health-value" id="perf-health">Good</span>
                                </div>
                                <div class="health-item">
                                    <span class="health-label">Compatibilidade:</span>
                                    <span class="health-value" id="compat-health">Excellent</span>
                                </div>
                                <div class="health-item">
                                    <span class="health-label">Economia:</span>
                                    <span class="health-value" id="econ-health">Adequate</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.feedbackContainer.innerHTML = feedbackHTML;
    }

    /**
     * Sets up event listeners for feedback interactions
     */
    setupEventListeners() {
        const clearButton = document.getElementById('clear-feedback');
        if (clearButton) {
            clearButton.addEventListener('click', () => this.clearAllFeedback());
        }

        // Listen for aircraft changes
        document.addEventListener('aircraftConfigChanged', (event) => {
            this.handleAircraftChange(event.detail);
        });

        // Listen for component selection changes
        document.addEventListener('componentSelected', (event) => {
            this.handleComponentChange(event.detail);
        });
    }

    /**
     * Starts real-time monitoring of aircraft changes
     */
    startRealTimeMonitoring() {
        this.monitoringInterval = setInterval(() => {
            if (this.currentAircraft) {
                this.updateFeedback();
            }
        }, this.config.updateThrottle);
    }

    /**
     * Updates aircraft context and triggers feedback
     */
    updateAircraftContext(aircraft) {
        const previousAircraft = this.currentAircraft;
        this.currentAircraft = aircraft;

        if (previousAircraft) {
            this.analyzeChanges(previousAircraft, aircraft);
        }

        this.updateFeedback();
    }

    /**
     * Analyzes changes between aircraft configurations
     */
    analyzeChanges(previousAircraft, currentAircraft) {
        const changes = this.calculateChanges(previousAircraft, currentAircraft);

        changes.forEach(change => {
            if (Math.abs(change.percentChange) >= this.config.impactThreshold * 100) {
                this.displayChangeNotification(change);
            }
        });

        this.updateImpactMeters(changes);
        this.updateHealthScore(currentAircraft);
        this.generateLiveRecommendations(currentAircraft, changes);
    }

    /**
     * Calculates specific changes between aircraft states
     */
    calculateChanges(previous, current) {
        const changes = [];

        // Performance metrics changes
        const performanceChanges = this.calculatePerformanceChanges(previous, current);
        changes.push(...performanceChanges);

        // Cost changes
        const costChanges = this.calculateCostChanges(previous, current);
        changes.push(...costChanges);

        // Component changes
        const componentChanges = this.calculateComponentChanges(previous, current);
        changes.push(...componentChanges);

        return changes.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
    }

    /**
     * Calculates performance-related changes
     */
    calculatePerformanceChanges(previous, current) {
        const changes = [];

        const metrics = ['thrust_to_weight', 'wing_loading', 'fuel_fraction', 'l_over_d'];

        metrics.forEach(metric => {
            const prevValue = this.getMetricValue(previous, metric);
            const currValue = this.getMetricValue(current, metric);

            if (prevValue > 0) {
                const percentChange = ((currValue - prevValue) / prevValue) * 100;

                if (Math.abs(percentChange) >= this.config.impactThreshold * 100) {
                    changes.push({
                        type: 'performance',
                        metric: metric,
                        previousValue: prevValue,
                        currentValue: currValue,
                        percentChange: percentChange,
                        impact: this.categorizeImpact(Math.abs(percentChange))
                    });
                }
            }
        });

        return changes;
    }

    /**
     * Calculates cost-related changes
     */
    calculateCostChanges(previous, current) {
        const changes = [];

        const costMetrics = ['total_cost', 'maintenance_burden'];

        costMetrics.forEach(metric => {
            const prevValue = this.getCostValue(previous, metric);
            const currValue = this.getCostValue(current, metric);

            if (prevValue > 0) {
                const percentChange = ((currValue - prevValue) / prevValue) * 100;

                if (Math.abs(percentChange) >= this.config.impactThreshold * 100) {
                    changes.push({
                        type: 'cost',
                        metric: metric,
                        previousValue: prevValue,
                        currentValue: currValue,
                        percentChange: percentChange,
                        impact: this.categorizeImpact(Math.abs(percentChange))
                    });
                }
            }
        });

        return changes;
    }

    /**
     * Calculates component-related changes
     */
    calculateComponentChanges(previous, current) {
        const changes = [];

        // Check for component swaps
        const componentTypes = ['engines', 'materials', 'avionics'];

        componentTypes.forEach(type => {
            const prevComponent = this.getComponentId(previous, type);
            const currComponent = this.getComponentId(current, type);

            if (prevComponent !== currComponent) {
                changes.push({
                    type: 'component',
                    componentType: type,
                    previousComponent: prevComponent,
                    currentComponent: currComponent,
                    percentChange: 100, // Component swap is always 100% change
                    impact: this.categorizeImpact(100)
                });
            }
        });

        return changes;
    }

    /**
     * Displays a change notification
     */
    displayChangeNotification(change) {
        const changesList = document.getElementById('changes-list');
        if (!changesList) return;

        const changeElement = this.createChangeElement(change);
        changesList.insertBefore(changeElement, changesList.firstChild);

        // Limit number of visible changes
        const changes = changesList.children;
        if (changes.length > this.config.maxFeedbackItems) {
            changesList.removeChild(changes[changes.length - 1]);
        }

        // Animate in
        requestAnimationFrame(() => {
            changeElement.classList.add('visible');
        });

        // Auto-remove after delay
        setTimeout(() => {
            if (changeElement.parentNode) {
                changeElement.classList.add('fade-out');
                setTimeout(() => {
                    if (changeElement.parentNode) {
                        changeElement.parentNode.removeChild(changeElement);
                    }
                }, this.config.animationDuration);
            }
        }, this.config.highlightDuration);
    }

    /**
     * Creates a change notification element
     */
    createChangeElement(change) {
        const div = document.createElement('div');
        div.className = `change-item ${change.impact.class}`;

        const message = this.generateChangeMessage(change);

        div.innerHTML = `
            <div class="change-icon">${change.impact.icon}</div>
            <div class="change-content">
                <div class="change-message">${message}</div>
                <div class="change-details">
                    ${this.formatChangeDetails(change)}
                </div>
            </div>
            <div class="change-value ${change.percentChange >= 0 ? 'positive' : 'negative'}">
                ${change.percentChange >= 0 ? '+' : ''}${change.percentChange.toFixed(1)}%
            </div>
        `;

        return div;
    }

    /**
     * Generates a contextual message for the change
     */
    generateChangeMessage(change) {
        const templates = this.feedbackTemplates[change.type];
        if (!templates || !templates[change.metric]) {
            return `${change.metric} foi alterado`;
        }

        const direction = change.percentChange >= 0 ? 'increase' : 'decrease';
        const template = templates[change.metric][direction];

        return template.replace('{change}', Math.abs(change.percentChange).toFixed(1));
    }

    /**
     * Formats change details for display
     */
    formatChangeDetails(change) {
        if (change.type === 'component') {
            return `${change.previousComponent} → ${change.currentComponent}`;
        }

        return `${change.previousValue.toFixed(2)} → ${change.currentValue.toFixed(2)}`;
    }

    /**
     * Updates impact meters based on changes
     */
    updateImpactMeters(changes) {
        const impactSummary = {
            speed: 0,
            maneuverability: 0,
            range: 0,
            cost: 0
        };

        // Aggregate impacts by category
        changes.forEach(change => {
            const impact = this.mapChangeToImpactCategory(change);
            Object.keys(impact).forEach(category => {
                if (impactSummary.hasOwnProperty(category)) {
                    impactSummary[category] += impact[category];
                }
            });
        });

        // Update visual meters
        Object.keys(impactSummary).forEach(category => {
            this.updateImpactMeter(category, impactSummary[category]);
        });
    }

    /**
     * Updates a specific impact meter
     */
    updateImpactMeter(category, value) {
        const fillElement = document.getElementById(`${category}-impact`);
        const valueElement = document.getElementById(`${category}-value`);

        if (fillElement && valueElement) {
            const clampedValue = Math.max(-100, Math.min(100, value));
            const absValue = Math.abs(clampedValue);

            fillElement.style.width = `${absValue}%`;
            fillElement.className = `meter-fill ${clampedValue >= 0 ? 'positive' : 'negative'}`;

            valueElement.textContent = `${clampedValue >= 0 ? '+' : ''}${clampedValue.toFixed(1)}%`;
            valueElement.className = `meter-value ${clampedValue >= 0 ? 'positive' : 'negative'}`;
        }
    }

    /**
     * Updates configuration health score
     */
    updateHealthScore(aircraft) {
        const healthScore = this.calculateHealthScore(aircraft);
        const healthCircle = document.getElementById('health-progress');
        const healthText = document.getElementById('health-score-text');

        if (healthCircle && healthText) {
            const circumference = 220;
            const offset = circumference - (healthScore / 100) * circumference;

            healthCircle.style.strokeDashoffset = offset;
            healthText.textContent = Math.round(healthScore);

            // Update color based on score
            if (healthScore >= 80) {
                healthCircle.style.stroke = '#10b981';
            } else if (healthScore >= 60) {
                healthCircle.style.stroke = '#fbbf24';
            } else {
                healthCircle.style.stroke = '#ef4444';
            }
        }

        // Update health breakdown
        this.updateHealthBreakdown(aircraft);
    }

    /**
     * Calculates overall health score
     */
    calculateHealthScore(aircraft) {
        const metrics = {
            performance: this.calculatePerformanceHealth(aircraft),
            compatibility: this.calculateCompatibilityHealth(aircraft),
            economics: this.calculateEconomicsHealth(aircraft)
        };

        return (metrics.performance * 0.4 + metrics.compatibility * 0.3 + metrics.economics * 0.3);
    }

    /**
     * Generates live recommendations based on current state
     */
    generateLiveRecommendations(aircraft, changes) {
        const recommendations = [];

        // Analyze critical changes
        const criticalChanges = changes.filter(c => c.impact.class === 'critical');
        if (criticalChanges.length > 0) {
            recommendations.push({
                type: 'critical',
                message: 'Mudanças críticas detectadas - revisar configuração',
                action: 'Verificar compatibilidades'
            });
        }

        // Performance optimization opportunities
        if (this.hasOptimizationOpportunity(aircraft)) {
            recommendations.push({
                type: 'optimization',
                message: 'Oportunidade de otimização detectada',
                action: 'Explorar alternativas'
            });
        }

        // Cost efficiency recommendations
        if (this.hasCostEfficiencyOpportunity(aircraft)) {
            recommendations.push({
                type: 'cost',
                message: 'Possível redução de custos disponível',
                action: 'Revisar componentes'
            });
        }

        this.displayRecommendations(recommendations);
    }

    /**
     * Displays live recommendations
     */
    displayRecommendations(recommendations) {
        const recList = document.getElementById('recommendations-list');
        if (!recList) return;

        recList.innerHTML = '';

        if (recommendations.length === 0) {
            recList.innerHTML = '<div class="no-recommendations">✅ Configuração otimizada</div>';
            return;
        }

        recommendations.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = `recommendation-item ${rec.type}`;
            recElement.innerHTML = `
                <div class="rec-icon">💡</div>
                <div class="rec-content">
                    <div class="rec-message">${rec.message}</div>
                    <div class="rec-action">${rec.action}</div>
                </div>
            `;
            recList.appendChild(recElement);
        });
    }

    /**
     * Clears all feedback notifications
     */
    clearAllFeedback() {
        const changesList = document.getElementById('changes-list');
        if (changesList) {
            changesList.innerHTML = '';
        }

        // Reset impact meters
        ['speed', 'maneuverability', 'range', 'cost'].forEach(category => {
            this.updateImpactMeter(category, 0);
        });
    }

    /**
     * Updates main feedback display
     */
    updateFeedback() {
        if (!this.currentAircraft) return;

        // Update health score
        this.updateHealthScore(this.currentAircraft);

        // Generate current recommendations
        this.generateLiveRecommendations(this.currentAircraft, []);
    }

    // ===== HELPER METHODS =====

    categorizeImpact(percentChange) {
        for (const [category, config] of Object.entries(this.impactCategories)) {
            if (percentChange >= config.threshold * 100) {
                return config;
            }
        }
        return this.impactCategories.minor;
    }

    getMetricValue(aircraft, metric) {
        // This would integrate with actual metric calculation system
        return Math.random() * 100; // Placeholder
    }

    getCostValue(aircraft, metric) {
        // This would integrate with actual cost calculation system
        return Math.random() * 1000000; // Placeholder
    }

    getComponentId(aircraft, type) {
        // This would get actual component IDs from aircraft
        return aircraft?.[type]?.[0] || 'none';
    }

    mapChangeToImpactCategory(change) {
        // Maps specific changes to impact categories
        const impactMap = {
            thrust_to_weight: { speed: 30, maneuverability: 20 },
            wing_loading: { maneuverability: -25, speed: 15 },
            fuel_fraction: { range: 40, cost: 10 },
            l_over_d: { range: 30, cost: -15 }
        };

        const impact = impactMap[change.metric] || {};
        const multiplier = change.percentChange / 100;

        const result = {};
        Object.keys(impact).forEach(category => {
            result[category] = impact[category] * multiplier;
        });

        return result;
    }

    calculatePerformanceHealth(aircraft) {
        // Simplified performance health calculation
        return 75 + Math.random() * 20;
    }

    calculateCompatibilityHealth(aircraft) {
        // Simplified compatibility health calculation
        return 80 + Math.random() * 15;
    }

    calculateEconomicsHealth(aircraft) {
        // Simplified economics health calculation
        return 70 + Math.random() * 25;
    }

    updateHealthBreakdown(aircraft) {
        const perfHealth = document.getElementById('perf-health');
        const compatHealth = document.getElementById('compat-health');
        const econHealth = document.getElementById('econ-health');

        if (perfHealth) perfHealth.textContent = 'Good';
        if (compatHealth) compatHealth.textContent = 'Excellent';
        if (econHealth) econHealth.textContent = 'Adequate';
    }

    hasOptimizationOpportunity(aircraft) {
        // Logic to detect optimization opportunities
        return Math.random() > 0.7;
    }

    hasCostEfficiencyOpportunity(aircraft) {
        // Logic to detect cost efficiency opportunities
        return Math.random() > 0.8;
    }

    /**
     * Stops real-time monitoring
     */
    stopRealTimeMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    /**
     * Destroys the feedback system
     */
    destroy() {
        this.stopRealTimeMonitoring();
        this.clearAllFeedback();

        this.initialized = false;
        console.log('🗑️ Real-Time Feedback System destroyed');
    }
}

// Create global instance
export const realTimeFeedbackSystem = new RealTimeFeedbackSystem();

// Make it available globally
window.realTimeFeedbackSystem = realTimeFeedbackSystem;

console.log('⚡ RealTimeFeedbackSystem module loaded');