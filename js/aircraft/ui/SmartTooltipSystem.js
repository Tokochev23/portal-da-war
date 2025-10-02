/**
 * Smart Tooltip System - War1954 Aircraft Creator
 *
 * Intelligent contextual tooltip system that provides detailed explanations,
 * calculations, and recommendations based on current aircraft configuration.
 * Goes beyond simple descriptions to provide engineering insights.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class SmartTooltipSystem {
    constructor() {
        this.initialized = false;
        this.currentTooltip = null;
        this.tooltipContainer = null;
        this.currentAircraft = null;

        // Tooltip configuration
        this.config = {
            showDelay: 500,      // ms before showing tooltip
            hideDelay: 100,      // ms before hiding tooltip
            maxWidth: 320,       // max tooltip width
            animationDuration: 200,
            smartUpdateInterval: 1000, // Update dynamic content
            contextualRadius: 10 // Distance for contextual hints
        };

        // Tooltip types and their templates
        this.tooltipTypes = {
            metric: 'metric-tooltip',
            component: 'component-tooltip',
            calculation: 'calculation-tooltip',
            warning: 'warning-tooltip',
            recommendation: 'recommendation-tooltip',
            comparison: 'comparison-tooltip'
        };

        // Context-aware explanations database
        this.explanations = {
            thrust_to_weight: {
                base: "A razão empuxo/peso determina a capacidade de aceleração e climb rate da aeronave.",
                ranges: {
                    excellent: "Excelente performance! Aeronave terá aceleração superior e climb rate impressionante.",
                    good: "Boa performance. Adequada para a maioria das missões de combate.",
                    adequate: "Performance adequada. Limitações em combate vertical e acceleration.",
                    poor: "Performance insuficiente. Aeronave será lenta e vulnerável em combate."
                },
                formula: "T/W = Empuxo Total / Peso Total",
                factors: [
                    "Tipo e quantidade de motores",
                    "Peso da estrutura e combustível",
                    "Carga de armamentos",
                    "Condições atmosféricas"
                ],
                improvements: [
                    "Motores mais potentes",
                    "Redução de peso estrutural",
                    "Materiais mais leves",
                    "Otimização de combustível"
                ]
            },
            wing_loading: {
                base: "A carga alar afeta diretamente a manobrabilidade e velocidade de estol da aeronave.",
                ranges: {
                    excellent: "Excelente manobrabilidade! Aeronave será ágil em combate fechado.",
                    good: "Boa manobrabilidade. Equilíbrio entre agilidade e velocidade.",
                    adequate: "Manobrabilidade adequada. Foco mais em velocidade que agilidade.",
                    poor: "Baixa manobrabilidade. Aeronave pesada, adequada para long-range."
                },
                formula: "WL = Peso Total / Área das Asas",
                factors: [
                    "Peso total da aeronave",
                    "Área e formato das asas",
                    "Distribuição de peso",
                    "Configuração de flaps"
                ],
                improvements: [
                    "Aumentar área das asas",
                    "Reduzir peso total",
                    "Otimizar formato da asa",
                    "Sistemas de alta sustentação"
                ]
            },
            fuel_fraction: {
                base: "A fração de combustível determina o alcance operacional da aeronave.",
                ranges: {
                    excellent: "Excelente alcance! Adequada para missões de longo alcance.",
                    good: "Bom alcance. Flexibilidade operacional adequada.",
                    adequate: "Alcance limitado. Adequada para missões locais.",
                    poor: "Alcance muito limitado. Requer reabastecimento frequente."
                },
                formula: "FF = Peso do Combustível / Peso Total × 100%",
                factors: [
                    "Capacidade dos tanques",
                    "Peso da estrutura",
                    "Consumo do motor",
                    "Perfil de missão"
                ],
                improvements: [
                    "Tanques de combustível maiores",
                    "Motores mais eficientes",
                    "Redução de peso estrutural",
                    "Aerodinâmica otimizada"
                ]
            },
            l_over_d: {
                base: "A eficiência L/D representa a qualidade aerodinâmica da aeronave.",
                ranges: {
                    excellent: "Excelente eficiência! Baixo consumo e alto alcance.",
                    good: "Boa eficiência aerodinâmica. Design bem otimizado.",
                    adequate: "Eficiência adequada. Compromisso aceitável.",
                    poor: "Baixa eficiência. Alto arrasto compromete performance."
                },
                formula: "L/D = Coeficiente de Sustentação / Coeficiente de Arrasto",
                factors: [
                    "Formato e área das asas",
                    "Acabamento da superfície",
                    "Configuração da fuselagem",
                    "Interferência aerodinâmica"
                ],
                improvements: [
                    "Otimizar perfil das asas",
                    "Reduzir rugosidade",
                    "Minimizar interferências",
                    "Design de fuselagem otimizado"
                ]
            },
            cost_effectiveness: {
                base: "O custo-efetividade mede o valor por capacidade de carga útil.",
                ranges: {
                    excellent: "Excelente valor! Design economicamente eficiente.",
                    good: "Bom custo-benefício. Investimento justificado.",
                    adequate: "Custo adequado. Performance vs preço aceitável.",
                    poor: "Custo elevado. Considere alternativas mais econômicas."
                },
                formula: "CE = Custo Total / Peso da Carga Útil",
                factors: [
                    "Custo de desenvolvimento",
                    "Custo de produção",
                    "Capacidade de payload",
                    "Volumes de produção"
                ],
                improvements: [
                    "Simplificar sistemas",
                    "Materiais mais baratos",
                    "Aumentar payload",
                    "Produção em escala"
                ]
            },
            maintenance_burden: {
                base: "A carga de manutenção afeta a disponibilidade operacional da aeronave.",
                ranges: {
                    excellent: "Baixa manutenção! Alta disponibilidade operacional.",
                    good: "Manutenção razoável. Boa disponibilidade.",
                    adequate: "Manutenção moderada. Disponibilidade aceitável.",
                    poor: "Alta manutenção. Baixa disponibilidade operacional."
                },
                formula: "MB = Horas de Manutenção / Hora de Voo",
                factors: [
                    "Complexidade dos sistemas",
                    "Qualidade dos materiais",
                    "Acessibilidade para reparo",
                    "Confiabilidade dos componentes"
                ],
                improvements: [
                    "Simplificar sistemas",
                    "Materiais mais duráveis",
                    "Design para manutenção",
                    "Componentes modulares"
                ]
            }
        };

        // Component-specific explanations
        this.componentExplanations = {
            engines: {
                piston: "Motores a pistão são confiáveis e econômicos, ideais para aeronaves leves e de baixa velocidade.",
                turbojet: "Turbojatos oferecem alta velocidade mas consomem muito combustível, especialmente em baixas altitudes.",
                turbofan: "Turbofans balanceiam velocidade e eficiência, ideais para aeronaves multirole.",
                turboprop: "Turboprops são muito eficientes em baixas velocidades, perfeitos para transporte."
            },
            materials: {
                aluminum: "Alumínio é o padrão da aviação: equilibra peso, custo e facilidade de fabricação.",
                steel: "Aço é pesado mas muito resistente, adequado para aeronaves que enfrentam stress extremo.",
                titanium: "Titânio oferece resistência superior com peso moderado, mas é muito caro.",
                composites: "Compósitos são leves e podem reduzir assinatura radar, mas complexos de reparar."
            },
            avionics: {
                radar_pesa: "Radar PESA é mais barato que AESA mas mais vulnerável a contramedidas eletrônicas.",
                radar_aesa: "Radar AESA oferece capacidades superiores mas aumenta significativamente o custo.",
                irst: "IRST detecta passivamente por calor, invisível ao inimigo mas limitado por condições climáticas.",
                ecm: "Sistemas ECM protegem contra mísseis guiados mas consomem energia e adicionam peso."
            }
        };

        console.log('🎯 SmartTooltipSystem initialized');
    }

    /**
     * Initializes the smart tooltip system
     */
    initialize() {
        this.createTooltipContainer();
        this.setupGlobalEventListeners();
        this.initialized = true;
        console.log('✅ Smart Tooltip System initialized');
    }

    /**
     * Creates the global tooltip container
     */
    createTooltipContainer() {
        this.tooltipContainer = document.createElement('div');
        this.tooltipContainer.id = 'smart-tooltip-container';
        this.tooltipContainer.className = 'smart-tooltip-container';
        document.body.appendChild(this.tooltipContainer);
    }

    /**
     * Sets up global event listeners for tooltips
     */
    setupGlobalEventListeners() {
        document.addEventListener('mouseover', (e) => {
            const tooltipElement = e.target.closest('[data-tooltip]');
            if (tooltipElement) {
                this.handleTooltipShow(e, tooltipElement);
            }
        });

        document.addEventListener('mouseout', (e) => {
            const tooltipElement = e.target.closest('[data-tooltip]');
            if (tooltipElement) {
                this.handleTooltipHide(e, tooltipElement);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.currentTooltip) {
                this.updateTooltipPosition(e);
            }
        });
    }

    /**
     * Handles showing a tooltip
     */
    handleTooltipShow(event, element) {
        const tooltipData = this.extractTooltipData(element);

        this.showTooltipTimeout = setTimeout(() => {
            this.showSmartTooltip(event, tooltipData);
        }, this.config.showDelay);
    }

    /**
     * Handles hiding a tooltip
     */
    handleTooltipHide(event, element) {
        if (this.showTooltipTimeout) {
            clearTimeout(this.showTooltipTimeout);
        }

        setTimeout(() => {
            this.hideTooltip();
        }, this.config.hideDelay);
    }

    /**
     * Extracts tooltip data from element
     */
    extractTooltipData(element) {
        const data = {
            type: element.dataset.tooltipType || 'basic',
            content: element.dataset.tooltip,
            metricKey: element.dataset.metricKey,
            componentType: element.dataset.componentType,
            componentId: element.dataset.componentId,
            context: element.dataset.tooltipContext,
            value: element.dataset.tooltipValue,
            element: element
        };

        return data;
    }

    /**
     * Shows intelligent contextual tooltip
     */
    showSmartTooltip(event, data) {
        this.hideTooltip(); // Hide any existing tooltip

        const tooltipContent = this.generateSmartTooltipContent(data);

        this.currentTooltip = document.createElement('div');
        this.currentTooltip.className = `smart-tooltip ${data.type}`;
        this.currentTooltip.innerHTML = tooltipContent;

        this.tooltipContainer.appendChild(this.currentTooltip);

        // Position tooltip
        this.positionTooltip(event);

        // Animate in
        requestAnimationFrame(() => {
            this.currentTooltip.classList.add('visible');
        });

        // Start dynamic updates if needed
        if (data.type === 'metric' || data.type === 'calculation') {
            this.startDynamicUpdates(data);
        }
    }

    /**
     * Generates smart tooltip content based on context
     */
    generateSmartTooltipContent(data) {
        switch (data.type) {
            case 'metric':
                return this.generateMetricTooltip(data);
            case 'component':
                return this.generateComponentTooltip(data);
            case 'calculation':
                return this.generateCalculationTooltip(data);
            case 'warning':
                return this.generateWarningTooltip(data);
            case 'recommendation':
                return this.generateRecommendationTooltip(data);
            default:
                return this.generateBasicTooltip(data);
        }
    }

    /**
     * Generates metric-specific tooltip with context
     */
    generateMetricTooltip(data) {
        const metricKey = data.metricKey;
        const explanation = this.explanations[metricKey];

        if (!explanation) {
            return this.generateBasicTooltip(data);
        }

        const currentValue = parseFloat(data.value) || 0;
        const status = this.getMetricStatus(currentValue, metricKey);
        const contextualExplanation = explanation.ranges[status.level] || explanation.base;

        return `
            <div class="tooltip-header">
                <div class="tooltip-title">${explanation.base}</div>
                <div class="tooltip-status ${status.level}">${status.text}</div>
            </div>

            <div class="tooltip-content">
                <div class="current-context">
                    <strong>Situação Atual:</strong>
                    <p>${contextualExplanation}</p>
                </div>

                <div class="formula-section">
                    <strong>Cálculo:</strong>
                    <code>${explanation.formula}</code>
                </div>

                <div class="factors-section">
                    <strong>Fatores que Influenciam:</strong>
                    <ul>
                        ${explanation.factors.map(factor => `<li>${factor}</li>`).join('')}
                    </ul>
                </div>

                <div class="improvements-section">
                    <strong>Como Melhorar:</strong>
                    <ul>
                        ${explanation.improvements.map(improvement => `<li>${improvement}</li>`).join('')}
                    </ul>
                </div>

                ${this.generateRelatedMetrics(metricKey)}
            </div>
        `;
    }

    /**
     * Generates component-specific tooltip
     */
    generateComponentTooltip(data) {
        const componentType = data.componentType;
        const componentId = data.componentId;

        let explanation = this.componentExplanations[componentType]?.[componentId] || data.content;

        return `
            <div class="tooltip-header">
                <div class="tooltip-title">${this.formatComponentName(componentId)}</div>
            </div>

            <div class="tooltip-content">
                <p>${explanation}</p>

                ${this.generateComponentStats(componentType, componentId)}
                ${this.generateComponentComparison(componentType, componentId)}
                ${this.generateComponentRecommendations(componentType, componentId)}
            </div>
        `;
    }

    /**
     * Generates calculation tooltip with step-by-step breakdown
     */
    generateCalculationTooltip(data) {
        const calculation = this.generateCalculationBreakdown(data);

        return `
            <div class="tooltip-header">
                <div class="tooltip-title">Detalhes do Cálculo</div>
            </div>

            <div class="tooltip-content calculation-content">
                ${calculation}
            </div>
        `;
    }

    /**
     * Generates warning tooltip with detailed explanation
     */
    generateWarningTooltip(data) {
        return `
            <div class="tooltip-header warning">
                <div class="tooltip-title">⚠️ Atenção</div>
            </div>

            <div class="tooltip-content">
                <p><strong>Problema:</strong> ${data.content}</p>
                ${this.generateWarningDetails(data)}
                ${this.generateWarningRecommendations(data)}
            </div>
        `;
    }

    /**
     * Generates recommendation tooltip
     */
    generateRecommendationTooltip(data) {
        return `
            <div class="tooltip-header recommendation">
                <div class="tooltip-title">💡 Recomendação</div>
            </div>

            <div class="tooltip-content">
                <p>${data.content}</p>
                ${this.generateRecommendationReasoning(data)}
                ${this.generateAlternativeOptions(data)}
            </div>
        `;
    }

    /**
     * Generates basic tooltip
     */
    generateBasicTooltip(data) {
        return `
            <div class="tooltip-content">
                <p>${data.content}</p>
            </div>
        `;
    }

    /**
     * Generates related metrics section
     */
    generateRelatedMetrics(metricKey) {
        const relationships = {
            thrust_to_weight: ['wing_loading', 'fuel_fraction'],
            wing_loading: ['thrust_to_weight', 'l_over_d'],
            fuel_fraction: ['l_over_d', 'cost_effectiveness'],
            l_over_d: ['fuel_fraction', 'wing_loading'],
            cost_effectiveness: ['maintenance_burden', 'fuel_fraction'],
            maintenance_burden: ['cost_effectiveness']
        };

        const related = relationships[metricKey];
        if (!related || !this.currentAircraft) return '';

        return `
            <div class="related-metrics">
                <strong>Métricas Relacionadas:</strong>
                <div class="metric-chips">
                    ${related.map(metric => {
                        const value = this.getMetricValue(metric);
                        const status = this.getMetricStatus(value, metric);
                        return `<span class="metric-chip ${status.level}" data-metric="${metric}">${this.formatMetricName(metric)}: ${value.toFixed(1)}</span>`;
                    }).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Positions tooltip intelligently on screen
     */
    positionTooltip(event) {
        if (!this.currentTooltip) return;

        const tooltip = this.currentTooltip;
        const rect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = event.clientX + 15;
        let y = event.clientY - rect.height - 10;

        // Adjust if tooltip goes off-screen
        if (x + rect.width > viewportWidth) {
            x = event.clientX - rect.width - 15;
        }

        if (y < 0) {
            y = event.clientY + 15;
        }

        if (y + rect.height > viewportHeight) {
            y = viewportHeight - rect.height - 10;
        }

        tooltip.style.left = `${x}px`;
        tooltip.style.top = `${y}px`;
    }

    /**
     * Updates tooltip position on mouse move
     */
    updateTooltipPosition(event) {
        this.positionTooltip(event);
    }

    /**
     * Hides current tooltip
     */
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.classList.remove('visible');

            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.parentNode.removeChild(this.currentTooltip);
                }
                this.currentTooltip = null;
            }, this.config.animationDuration);
        }

        this.stopDynamicUpdates();
    }

    /**
     * Starts dynamic content updates for live tooltips
     */
    startDynamicUpdates(data) {
        this.dynamicUpdateInterval = setInterval(() => {
            if (this.currentTooltip && this.currentAircraft) {
                this.updateDynamicContent(data);
            }
        }, this.config.smartUpdateInterval);
    }

    /**
     * Stops dynamic updates
     */
    stopDynamicUpdates() {
        if (this.dynamicUpdateInterval) {
            clearInterval(this.dynamicUpdateInterval);
            this.dynamicUpdateInterval = null;
        }
    }

    /**
     * Updates dynamic tooltip content
     */
    updateDynamicContent(data) {
        if (data.type === 'metric' && data.metricKey) {
            const newValue = this.getMetricValue(data.metricKey);
            const statusElement = this.currentTooltip.querySelector('.tooltip-status');
            const status = this.getMetricStatus(newValue, data.metricKey);

            if (statusElement) {
                statusElement.className = `tooltip-status ${status.level}`;
                statusElement.textContent = status.text;
            }
        }
    }

    /**
     * Updates current aircraft reference for context
     */
    updateAircraftContext(aircraft) {
        this.currentAircraft = aircraft;
    }

    // ===== HELPER METHODS =====

    getMetricStatus(value, metricKey) {
        const explanation = this.explanations[metricKey];
        if (!explanation) return { level: 'unknown', text: 'Desconhecido' };

        // This would use the same thresholds as EngineeringDashboard
        // Simplified for now
        if (value >= 1.0) return { level: 'excellent', text: 'Excelente' };
        if (value >= 0.75) return { level: 'good', text: 'Bom' };
        if (value >= 0.5) return { level: 'adequate', text: 'Adequado' };
        return { level: 'poor', text: 'Ruim' };
    }

    getMetricValue(metricKey) {
        if (!this.currentAircraft) return 0;
        // This would integrate with the actual metric calculation system
        return Math.random() * 100; // Placeholder
    }

    formatMetricName(metricKey) {
        const names = {
            thrust_to_weight: 'T/W',
            wing_loading: 'Carga Alar',
            fuel_fraction: 'Combustível',
            l_over_d: 'L/D',
            cost_effectiveness: 'Custo',
            maintenance_burden: 'Manutenção'
        };
        return names[metricKey] || metricKey;
    }

    formatComponentName(componentId) {
        return componentId.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    generateComponentStats(componentType, componentId) {
        // This would fetch actual component data
        return `
            <div class="component-stats">
                <strong>Especificações:</strong>
                <ul>
                    <li>Peso: -- kg</li>
                    <li>Custo: $--</li>
                    <li>Confiabilidade: --%</li>
                </ul>
            </div>
        `;
    }

    generateComponentComparison(componentType, componentId) {
        return `
            <div class="component-comparison">
                <strong>vs. Alternativas:</strong>
                <p>Esta opção oferece melhor equilíbrio custo-benefício.</p>
            </div>
        `;
    }

    generateComponentRecommendations(componentType, componentId) {
        return `
            <div class="component-recommendations">
                <strong>Recomendações:</strong>
                <p>Adequado para a configuração atual.</p>
            </div>
        `;
    }

    generateCalculationBreakdown(data) {
        return `
            <div class="calculation-steps">
                <p>Cálculo detalhado será implementado baseado nos dados atuais da aeronave.</p>
            </div>
        `;
    }

    generateWarningDetails(data) {
        return `
            <div class="warning-details">
                <strong>Impacto:</strong>
                <p>Esta configuração pode afetar a performance da aeronave.</p>
            </div>
        `;
    }

    generateWarningRecommendations(data) {
        return `
            <div class="warning-recommendations">
                <strong>Soluções:</strong>
                <ul>
                    <li>Revisar configuração atual</li>
                    <li>Considerar alternativas</li>
                </ul>
            </div>
        `;
    }

    generateRecommendationReasoning(data) {
        return `
            <div class="recommendation-reasoning">
                <strong>Por quê:</strong>
                <p>Baseado na análise da configuração atual.</p>
            </div>
        `;
    }

    generateAlternativeOptions(data) {
        return `
            <div class="alternative-options">
                <strong>Alternativas:</strong>
                <ul>
                    <li>Opção A</li>
                    <li>Opção B</li>
                </ul>
            </div>
        `;
    }

    /**
     * Destroys the tooltip system
     */
    destroy() {
        this.hideTooltip();
        this.stopDynamicUpdates();

        if (this.tooltipContainer && this.tooltipContainer.parentNode) {
            this.tooltipContainer.parentNode.removeChild(this.tooltipContainer);
        }

        this.initialized = false;
        console.log('🗑️ Smart Tooltip System destroyed');
    }
}

// Create global instance
export const smartTooltipSystem = new SmartTooltipSystem();

// Make it available globally
window.smartTooltipSystem = smartTooltipSystem;

console.log('🎯 SmartTooltipSystem module loaded');