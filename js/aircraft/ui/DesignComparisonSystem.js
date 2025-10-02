/**
 * Design Comparison System - War1954 Aircraft Creator
 *
 * Advanced comparison tool that allows engineers to analyze multiple aircraft
 * configurations side-by-side with detailed metrics, visual comparisons,
 * and trade-off analysis. Essential for optimal design decision making.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

export class DesignComparisonSystem {
    constructor() {
        this.initialized = false;
        this.comparisonModal = null;
        this.savedDesigns = new Map();
        this.currentComparison = [];
        this.maxComparisons = 4;

        // Comparison categories
        this.comparisonCategories = {
            performance: {
                label: 'Performance',
                icon: '🚀',
                metrics: [
                    'thrust_to_weight',
                    'wing_loading',
                    'max_speed',
                    'climb_rate',
                    'service_ceiling',
                    'range',
                    'fuel_efficiency'
                ]
            },
            economics: {
                label: 'Economia',
                icon: '💰',
                metrics: [
                    'development_cost',
                    'unit_cost',
                    'operational_cost_per_hour',
                    'maintenance_burden',
                    'cost_effectiveness',
                    'lifecycle_cost'
                ]
            },
            capabilities: {
                label: 'Capacidades',
                icon: '⚔️',
                metrics: [
                    'payload_capacity',
                    'weapon_hardpoints',
                    'avionics_score',
                    'survivability',
                    'mission_flexibility',
                    'combat_rating'
                ]
            },
            engineering: {
                label: 'Engenharia',
                icon: '🔧',
                metrics: [
                    'structural_efficiency',
                    'aerodynamic_efficiency',
                    'weight_fraction',
                    'technology_level',
                    'complexity_score',
                    'reliability_rating'
                ]
            }
        };

        // Comparison visualization types
        this.visualizationTypes = {
            radar: 'Radar Chart',
            bar: 'Bar Chart',
            table: 'Detailed Table',
            spider: 'Spider Diagram',
            scatter: 'Scatter Plot'
        };

        console.log('📊 DesignComparisonSystem initialized');
    }

    /**
     * Initializes the design comparison system
     */
    initialize() {
        this.createComparisonModal();
        this.setupEventListeners();
        this.loadSavedDesigns();

        this.initialized = true;
        console.log('✅ Design Comparison System initialized');
    }

    /**
     * Creates the comparison modal interface
     */
    createComparisonModal() {
        const modalHTML = `
            <div class="comparison-modal" id="comparison-modal">
                <div class="modal-backdrop" id="modal-backdrop"></div>
                <div class="modal-content">
                    <!-- Modal Header -->
                    <div class="modal-header">
                        <div class="header-title">
                            <h2>📊 Comparação de Designs</h2>
                            <p>Analise diferentes configurações lado a lado</p>
                        </div>
                        <button class="modal-close" id="modal-close">×</button>
                    </div>

                    <!-- Design Selection Panel -->
                    <div class="design-selection-panel">
                        <div class="selection-header">
                            <h3>Selecionar Designs para Comparar</h3>
                            <div class="selection-controls">
                                <button class="btn-secondary" id="save-current-design">
                                    💾 Salvar Design Atual
                                </button>
                                <button class="btn-secondary" id="load-reference-designs">
                                    📁 Carregar Referências
                                </button>
                            </div>
                        </div>

                        <div class="design-slots" id="design-slots">
                            <!-- Design slots will be populated dynamically -->
                        </div>
                    </div>

                    <!-- Comparison Controls -->
                    <div class="comparison-controls">
                        <div class="category-filters">
                            <label>Categoria de Análise:</label>
                            <select id="comparison-category">
                                <option value="all">Todas as Categorias</option>
                                <option value="performance">Performance</option>
                                <option value="economics">Economia</option>
                                <option value="capabilities">Capacidades</option>
                                <option value="engineering">Engenharia</option>
                            </select>
                        </div>

                        <div class="visualization-controls">
                            <label>Tipo de Visualização:</label>
                            <select id="visualization-type">
                                <option value="radar">Radar Chart</option>
                                <option value="bar">Bar Chart</option>
                                <option value="table">Tabela Detalhada</option>
                                <option value="spider">Spider Diagram</option>
                            </select>
                        </div>

                        <div class="analysis-options">
                            <label>
                                <input type="checkbox" id="normalize-values">
                                Normalizar Valores
                            </label>
                            <label>
                                <input type="checkbox" id="show-differences">
                                Destacar Diferenças
                            </label>
                            <label>
                                <input type="checkbox" id="show-recommendations">
                                Mostrar Recomendações
                            </label>
                        </div>
                    </div>

                    <!-- Comparison Display Area -->
                    <div class="comparison-display" id="comparison-display">
                        <!-- Comparison content will be populated here -->
                    </div>

                    <!-- Trade-off Analysis -->
                    <div class="tradeoff-analysis" id="tradeoff-analysis">
                        <h3>🎯 Análise de Trade-offs</h3>
                        <div class="tradeoff-content" id="tradeoff-content">
                            <!-- Trade-off analysis will be populated here -->
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="modal-actions">
                        <button class="btn-primary" id="export-comparison">
                            📄 Exportar Comparação
                        </button>
                        <button class="btn-secondary" id="share-comparison">
                            🔗 Compartilhar
                        </button>
                        <button class="btn-secondary" id="save-comparison">
                            💾 Salvar Comparação
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.comparisonModal = document.getElementById('comparison-modal');
    }

    /**
     * Sets up event listeners for the comparison system
     */
    setupEventListeners() {
        // Modal controls
        const modalClose = document.getElementById('modal-close');
        const modalBackdrop = document.getElementById('modal-backdrop');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeComparison());
        }

        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', () => this.closeComparison());
        }

        // Design management
        const saveCurrentBtn = document.getElementById('save-current-design');
        const loadReferenceBtn = document.getElementById('load-reference-designs');

        if (saveCurrentBtn) {
            saveCurrentBtn.addEventListener('click', () => this.saveCurrentDesign());
        }

        if (loadReferenceBtn) {
            loadReferenceBtn.addEventListener('click', () => this.loadReferenceDesigns());
        }

        // Comparison controls
        const categorySelect = document.getElementById('comparison-category');
        const visualizationSelect = document.getElementById('visualization-type');

        if (categorySelect) {
            categorySelect.addEventListener('change', () => this.updateComparison());
        }

        if (visualizationSelect) {
            visualizationSelect.addEventListener('change', () => this.updateVisualization());
        }

        // Analysis options
        const checkboxes = ['normalize-values', 'show-differences', 'show-recommendations'];
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => this.updateComparison());
            }
        });

        // Action buttons
        const exportBtn = document.getElementById('export-comparison');
        const shareBtn = document.getElementById('share-comparison');
        const saveBtn = document.getElementById('save-comparison');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportComparison());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareComparison());
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveComparison());
        }
    }

    /**
     * Opens the comparison interface
     */
    openComparison(currentAircraft = null) {
        if (!this.initialized) {
            console.error('Design Comparison System not initialized');
            return;
        }

        // Add current aircraft if provided
        if (currentAircraft) {
            this.addDesignToComparison({
                id: 'current',
                name: currentAircraft.name || 'Design Atual',
                aircraft: currentAircraft,
                timestamp: Date.now(),
                isCurrent: true
            });
        }

        this.createDesignSlots();
        this.updateComparison();
        this.comparisonModal.classList.add('active');
    }

    /**
     * Closes the comparison interface
     */
    closeComparison() {
        this.comparisonModal.classList.remove('active');
        this.currentComparison = [];
    }

    /**
     * Creates design selection slots
     */
    createDesignSlots() {
        const slotsContainer = document.getElementById('design-slots');
        if (!slotsContainer) return;

        slotsContainer.innerHTML = '';

        for (let i = 0; i < this.maxComparisons; i++) {
            const slot = this.createDesignSlot(i);
            slotsContainer.appendChild(slot);
        }
    }

    /**
     * Creates an individual design slot
     */
    createDesignSlot(index) {
        const slot = document.createElement('div');
        slot.className = 'design-slot';
        slot.dataset.slotIndex = index;

        const design = this.currentComparison[index];

        if (design) {
            slot.innerHTML = this.renderPopulatedSlot(design, index);
            slot.classList.add('populated');
        } else {
            slot.innerHTML = this.renderEmptySlot(index);
            slot.classList.add('empty');
        }

        return slot;
    }

    /**
     * Renders a populated design slot
     */
    renderPopulatedSlot(design, index) {
        const summary = this.generateDesignSummary(design);

        return `
            <div class="slot-header">
                <div class="design-info">
                    <h4 class="design-name">${design.name}</h4>
                    <span class="design-category">${design.aircraft.category || 'Fighter'}</span>
                    ${design.isCurrent ? '<span class="current-badge">Atual</span>' : ''}
                </div>
                <button class="remove-design" data-index="${index}">×</button>
            </div>

            <div class="slot-content">
                <div class="design-preview">
                    <div class="preview-stats">
                        <div class="stat-item">
                            <span class="stat-label">T/W:</span>
                            <span class="stat-value">${summary.thrustToWeight.toFixed(2)}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Custo:</span>
                            <span class="stat-value">$${(summary.cost / 1000).toFixed(0)}K</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Velocidade:</span>
                            <span class="stat-value">${summary.maxSpeed.toFixed(0)} km/h</span>
                        </div>
                    </div>
                </div>

                <div class="design-actions">
                    <button class="btn-mini" onclick="designComparisonSystem.highlightDesign(${index})">
                        🔍 Destacar
                    </button>
                    <button class="btn-mini" onclick="designComparisonSystem.copyDesign(${index})">
                        📋 Copiar
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Renders an empty design slot
     */
    renderEmptySlot(index) {
        return `
            <div class="slot-header">
                <h4>Design ${index + 1}</h4>
            </div>

            <div class="slot-content empty">
                <div class="empty-message">
                    <div class="empty-icon">📊</div>
                    <p>Selecione um design para comparar</p>
                </div>

                <div class="slot-actions">
                    <button class="btn-mini" onclick="designComparisonSystem.selectDesignForSlot(${index})">
                        ➕ Adicionar Design
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Adds a design to the comparison
     */
    addDesignToComparison(design) {
        if (this.currentComparison.length >= this.maxComparisons) {
            console.warn('Maximum comparison slots reached');
            return false;
        }

        this.currentComparison.push(design);
        this.createDesignSlots();
        this.updateComparison();
        return true;
    }

    /**
     * Removes a design from comparison
     */
    removeDesignFromComparison(index) {
        if (index >= 0 && index < this.currentComparison.length) {
            this.currentComparison.splice(index, 1);
            this.createDesignSlots();
            this.updateComparison();
        }
    }

    /**
     * Updates the comparison display
     */
    updateComparison() {
        if (this.currentComparison.length < 2) {
            this.showNoComparisonMessage();
            return;
        }

        const category = document.getElementById('comparison-category')?.value || 'all';
        const normalizationEnabled = document.getElementById('normalize-values')?.checked || false;
        const showDifferences = document.getElementById('show-differences')?.checked || false;

        const comparisonData = this.generateComparisonData(category, normalizationEnabled);
        this.renderComparison(comparisonData, showDifferences);
        this.updateTradeoffAnalysis();
    }

    /**
     * Shows message when no comparison is available
     */
    showNoComparisonMessage() {
        const displayArea = document.getElementById('comparison-display');
        if (displayArea) {
            displayArea.innerHTML = `
                <div class="no-comparison">
                    <div class="no-comparison-icon">📊</div>
                    <h3>Adicione pelo menos 2 designs para comparar</h3>
                    <p>Selecione designs nas slots acima para começar a análise comparativa.</p>
                </div>
            `;
        }
    }

    /**
     * Generates comparison data for selected category
     */
    generateComparisonData(category, normalize = false) {
        const designs = this.currentComparison;
        const metrics = this.getMetricsForCategory(category);

        const data = {
            designs: designs.map(d => d.name),
            categories: {},
            summary: {}
        };

        // Calculate metrics for each design
        designs.forEach((design, designIndex) => {
            const designMetrics = this.calculateDesignMetrics(design.aircraft);

            metrics.forEach(metric => {
                if (!data.categories[metric]) {
                    data.categories[metric] = {
                        label: this.getMetricLabel(metric),
                        unit: this.getMetricUnit(metric),
                        values: [],
                        normalized: []
                    };
                }

                const value = designMetrics[metric] || 0;
                data.categories[metric].values[designIndex] = value;
            });
        });

        // Normalize values if requested
        if (normalize) {
            Object.keys(data.categories).forEach(metric => {
                const values = data.categories[metric].values;
                const max = Math.max(...values);
                const min = Math.min(...values);
                const range = max - min;

                data.categories[metric].normalized = values.map(v =>
                    range > 0 ? ((v - min) / range) * 100 : 50
                );
            });
        }

        return data;
    }

    /**
     * Renders the comparison based on visualization type
     */
    renderComparison(data, showDifferences) {
        const displayArea = document.getElementById('comparison-display');
        const visualizationType = document.getElementById('visualization-type')?.value || 'radar';

        switch (visualizationType) {
            case 'radar':
                this.renderRadarComparison(displayArea, data);
                break;
            case 'bar':
                this.renderBarComparison(displayArea, data);
                break;
            case 'table':
                this.renderTableComparison(displayArea, data, showDifferences);
                break;
            case 'spider':
                this.renderSpiderComparison(displayArea, data);
                break;
            default:
                this.renderTableComparison(displayArea, data, showDifferences);
        }
    }

    /**
     * Renders radar chart comparison
     */
    renderRadarComparison(container, data) {
        container.innerHTML = `
            <div class="radar-comparison">
                <div class="radar-chart-container">
                    <canvas id="comparison-radar-chart" width="600" height="400"></canvas>
                </div>
                <div class="radar-legend" id="radar-legend">
                    <!-- Legend will be populated -->
                </div>
            </div>
        `;

        this.createRadarChart(data);
    }

    /**
     * Renders bar chart comparison
     */
    renderBarComparison(container, data) {
        container.innerHTML = `
            <div class="bar-comparison">
                <div class="bar-chart-container">
                    <canvas id="comparison-bar-chart" width="800" height="500"></canvas>
                </div>
            </div>
        `;

        this.createBarChart(data);
    }

    /**
     * Renders detailed table comparison
     */
    renderTableComparison(container, data, showDifferences) {
        const tableHTML = this.generateComparisonTable(data, showDifferences);
        container.innerHTML = `
            <div class="table-comparison">
                <div class="table-container">
                    ${tableHTML}
                </div>
            </div>
        `;
    }

    /**
     * Generates detailed comparison table
     */
    generateComparisonTable(data, showDifferences) {
        const designs = data.designs;
        const metrics = Object.keys(data.categories);

        let tableHTML = `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th class="metric-header">Métrica</th>
                        ${designs.map(name => `<th class="design-header">${name}</th>`).join('')}
                        <th class="best-header">Melhor</th>
                    </tr>
                </thead>
                <tbody>
        `;

        metrics.forEach(metric => {
            const metricData = data.categories[metric];
            const bestIndex = this.findBestValueIndex(metricData.values, metric);

            tableHTML += `
                <tr class="metric-row" data-metric="${metric}">
                    <td class="metric-name">
                        <span class="metric-label">${metricData.label}</span>
                        <span class="metric-unit">${metricData.unit}</span>
                    </td>
            `;

            metricData.values.forEach((value, index) => {
                const isBest = index === bestIndex;
                const cellClass = isBest ? 'best-value' : '';
                const formattedValue = this.formatMetricValue(value, metric);

                tableHTML += `
                    <td class="metric-value ${cellClass}">
                        ${formattedValue}
                        ${isBest ? ' 🏆' : ''}
                    </td>
                `;
            });

            tableHTML += `
                    <td class="best-indicator">
                        ${designs[bestIndex]}
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        return tableHTML;
    }

    /**
     * Creates radar chart using Chart.js
     */
    createRadarChart(data) {
        const canvas = document.getElementById('comparison-radar-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const designs = data.designs;
        const metrics = Object.keys(data.categories);

        const datasets = designs.map((name, index) => ({
            label: name,
            data: metrics.map(metric => {
                const values = data.categories[metric].normalized || data.categories[metric].values;
                return values[index] || 0;
            }),
            borderColor: this.getDesignColor(index),
            backgroundColor: this.getDesignColor(index, 0.2),
            pointBackgroundColor: this.getDesignColor(index),
            pointBorderColor: '#fff',
            pointBorderWidth: 2
        }));

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: metrics.map(m => data.categories[m].label),
                datasets: datasets
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
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    /**
     * Creates bar chart using Chart.js
     */
    createBarChart(data) {
        const canvas = document.getElementById('comparison-bar-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const designs = data.designs;
        const metrics = Object.keys(data.categories);

        const datasets = designs.map((name, index) => ({
            label: name,
            data: metrics.map(metric => data.categories[metric].values[index] || 0),
            backgroundColor: this.getDesignColor(index, 0.8),
            borderColor: this.getDesignColor(index),
            borderWidth: 1
        }));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: metrics.map(m => data.categories[m].label),
                datasets: datasets
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    }
                }
            }
        });
    }

    /**
     * Updates trade-off analysis
     */
    updateTradeoffAnalysis() {
        const tradeoffContent = document.getElementById('tradeoff-content');
        if (!tradeoffContent || this.currentComparison.length < 2) return;

        const analysis = this.generateTradeoffAnalysis();
        tradeoffContent.innerHTML = this.renderTradeoffAnalysis(analysis);
    }

    /**
     * Generates trade-off analysis between designs
     */
    generateTradeoffAnalysis() {
        const tradeoffs = [];

        // Performance vs Cost analysis
        const perfVsCost = this.analyzePerformanceVsCost();
        if (perfVsCost) tradeoffs.push(perfVsCost);

        // Speed vs Maneuverability
        const speedVsManeuver = this.analyzeSpeedVsManeuverability();
        if (speedVsManeuver) tradeoffs.push(speedVsManeuver);

        // Range vs Payload
        const rangeVsPayload = this.analyzeRangeVsPayload();
        if (rangeVsPayload) tradeoffs.push(rangeVsPayload);

        return tradeoffs;
    }

    /**
     * Renders trade-off analysis
     */
    renderTradeoffAnalysis(analysis) {
        if (analysis.length === 0) {
            return '<p>Análise de trade-offs não disponível para a seleção atual.</p>';
        }

        return analysis.map(tradeoff => `
            <div class="tradeoff-item">
                <h4>${tradeoff.title}</h4>
                <p>${tradeoff.description}</p>
                <div class="tradeoff-recommendations">
                    ${tradeoff.recommendations.map(rec => `
                        <div class="recommendation">
                            <strong>${rec.design}:</strong> ${rec.text}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // ===== HELPER METHODS =====

    getMetricsForCategory(category) {
        if (category === 'all') {
            return Object.values(this.comparisonCategories).flatMap(cat => cat.metrics);
        }
        return this.comparisonCategories[category]?.metrics || [];
    }

    calculateDesignMetrics(aircraft) {
        // This would integrate with actual calculation systems
        return {
            thrust_to_weight: Math.random() * 2,
            wing_loading: Math.random() * 600 + 200,
            max_speed: Math.random() * 500 + 300,
            climb_rate: Math.random() * 50 + 10,
            service_ceiling: Math.random() * 15000 + 10000,
            range: Math.random() * 2000 + 500,
            development_cost: Math.random() * 10000000 + 5000000,
            unit_cost: Math.random() * 1000000 + 500000,
            // ... more metrics
        };
    }

    getMetricLabel(metric) {
        const labels = {
            thrust_to_weight: 'Empuxo/Peso',
            wing_loading: 'Carga Alar',
            max_speed: 'Velocidade Máxima',
            climb_rate: 'Taxa de Subida',
            service_ceiling: 'Teto de Serviço',
            range: 'Alcance',
            development_cost: 'Custo de Desenvolvimento',
            unit_cost: 'Custo Unitário'
        };
        return labels[metric] || metric;
    }

    getMetricUnit(metric) {
        const units = {
            thrust_to_weight: ':1',
            wing_loading: 'kg/m²',
            max_speed: 'km/h',
            climb_rate: 'm/s',
            service_ceiling: 'm',
            range: 'km',
            development_cost: 'USD',
            unit_cost: 'USD'
        };
        return units[metric] || '';
    }

    formatMetricValue(value, metric) {
        const precision = {
            thrust_to_weight: 2,
            wing_loading: 0,
            max_speed: 0,
            climb_rate: 1,
            service_ceiling: 0,
            range: 0,
            development_cost: 0,
            unit_cost: 0
        };

        const p = precision[metric] || 1;

        if (metric.includes('cost')) {
            return `$${(value / 1000000).toFixed(1)}M`;
        }

        return value.toFixed(p);
    }

    findBestValueIndex(values, metric) {
        const isHigherBetter = !metric.includes('cost') && !metric.includes('weight') && metric !== 'wing_loading';

        if (isHigherBetter) {
            return values.indexOf(Math.max(...values));
        } else {
            return values.indexOf(Math.min(...values));
        }
    }

    getDesignColor(index, alpha = 1) {
        const colors = [
            `rgba(59, 130, 246, ${alpha})`,   // Blue
            `rgba(16, 185, 129, ${alpha})`,   // Green
            `rgba(251, 191, 36, ${alpha})`,   // Yellow
            `rgba(239, 68, 68, ${alpha})`     // Red
        ];
        return colors[index % colors.length];
    }

    saveCurrentDesign() {
        // Implementation for saving current design
        console.log('💾 Saving current design...');
    }

    loadReferenceDesigns() {
        // Implementation for loading reference designs
        console.log('📁 Loading reference designs...');
    }

    exportComparison() {
        // Implementation for exporting comparison
        console.log('📄 Exporting comparison...');
    }

    shareComparison() {
        // Implementation for sharing comparison
        console.log('🔗 Sharing comparison...');
    }

    saveComparison() {
        // Implementation for saving comparison
        console.log('💾 Saving comparison...');
    }

    analyzePerformanceVsCost() {
        // Performance vs cost trade-off analysis
        return {
            title: 'Performance vs Custo',
            description: 'Análise do equilíbrio entre capacidades e investimento necessário.',
            recommendations: [
                { design: 'Design A', text: 'Melhor custo-benefício geral' },
                { design: 'Design B', text: 'Performance superior, custo elevado' }
            ]
        };
    }

    analyzeSpeedVsManeuverability() {
        // Speed vs maneuverability analysis
        return null; // Placeholder
    }

    analyzeRangeVsPayload() {
        // Range vs payload analysis
        return null; // Placeholder
    }

    generateDesignSummary(design) {
        const metrics = this.calculateDesignMetrics(design.aircraft);
        return {
            thrustToWeight: metrics.thrust_to_weight,
            cost: metrics.unit_cost,
            maxSpeed: metrics.max_speed
        };
    }

    loadSavedDesigns() {
        // Load designs from localStorage or server
        const saved = localStorage.getItem('war1954_saved_designs');
        if (saved) {
            try {
                const designs = JSON.parse(saved);
                designs.forEach(design => this.savedDesigns.set(design.id, design));
            } catch (error) {
                console.error('Failed to load saved designs:', error);
            }
        }
    }

    /**
     * Destroys the comparison system
     */
    destroy() {
        if (this.comparisonModal && this.comparisonModal.parentNode) {
            this.comparisonModal.parentNode.removeChild(this.comparisonModal);
        }

        this.initialized = false;
        console.log('🗑️ Design Comparison System destroyed');
    }
}

// Create global instance
export const designComparisonSystem = new DesignComparisonSystem();

// Make it available globally
window.designComparisonSystem = designComparisonSystem;

console.log('📊 DesignComparisonSystem module loaded');