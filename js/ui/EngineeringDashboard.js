/**
 * Engineering Dashboard UI System - War1954 Aircraft Creator
 *
 * Manages the dynamic radar chart for visualizing aircraft performance trade-offs.
 * 
 * @version 1.0.0
 */

export class EngineeringDashboard {
    constructor(canvasId) {
        const chartElement = document.getElementById(canvasId);
        if (!chartElement) {
            console.error(`Canvas element with id '${canvasId}' not found.`);
            return;
        }

        this.chart = this._createChart(chartElement.getContext('2d'));
        console.log('📊 EngineeringDashboard initialized with Radar Chart.');
    }

    _createChart(ctx) {
        return new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Velocidade', 'Manobrabilidade', 'Alcance', 'Sobrevivência', 'Furtividade', 'Custo-Benefício'],
                datasets: [{
                    label: 'Performance da Aeronave',
                    data: [0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(34, 211, 238, 0.2)',
                    borderColor: 'rgba(34, 211, 238, 0.8)',
                    pointBackgroundColor: 'rgba(34, 211, 238, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(34, 211, 238, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        min: 0,
                        max: 100,
                        ticks: { display: false, stepSize: 25 },
                        pointLabels: { color: '#cbd5e1', font: { size: 12 } }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    /**
     * Updates the radar chart with data from the calculated aircraft entity.
     * @param {Object} entity - The fully calculated aircraft entity.
     */
    update(entity) {
        if (!this.chart || !entity) return;

        const p = entity.performance || {};
        const c = entity.costs || {};
        const s = entity.signatures || {};

        const data = [
            this._normalize(p.maxSpeed, 300, 1800), // Velocidade (300-1800 km/h)
            this._normalize(p.maneuveringThrust, 0, 5000), // Manobrabilidade (baseado no TVC)
            this._normalize(p.range, 500, 4000), // Alcance (500-4000 km)
            this._normalize((p.chaffEffectiveness || 0) + (p.flareEffectiveness || 0), 0, 1.5), // Sobrevivência
            this._normalize(s.radarCrossSection, 5, 0.5, true), // Furtividade (Invertido: menor é melhor)
            this._normalize(c.unitProductionCost, 500000, 50000, true) // Custo-Benefício (Invertido: menor é melhor)
        ];

        this.chart.data.datasets[0].data = data;
        this.chart.update();
    }

    /**
     * Normalizes a value to a 0-100 scale.
     * @param {number} value - The value to normalize.
     * @param {number} min - The minimum expected value for the input.
     * @param {number} max - The maximum expected value for the input.
     * @param {boolean} invert - If true, a lower value will result in a higher score.
     * @private
     */
    _normalize(value = 0, min, max, invert = false) {
        if (invert) {
            [min, max] = [max, min];
        }

        const normalized = ((value - min) / (max - min)) * 100;
        return Math.max(0, Math.min(100, normalized)); // Clamp between 0 and 100
    }
}
