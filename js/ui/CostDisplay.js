/**
 * Cost Display UI System - War1954 Aircraft Creator
 *
 * Manages the display of the detailed cost breakdown for an aircraft design.
 * 
 * @version 1.0.0
 */

export class CostDisplay {
    /**
     * @param {string} containerId - The ID of the element where the cost breakdown will be rendered.
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);

        if (!this.container) {
            console.error(`CostDisplay: Container element with id '${containerId}' not found.`);
            return;
        }
        console.log('💰 CostDisplay initialized');
    }

    /**
     * Updates the display with a new set of cost data.
     * @param {Object} costs - The costs object from the calculation results.
     */
    update(costs = {}) {
        if (!this.container) return;

        const devCost = costs.developmentCost || 0;
        const prodCost = costs.unitProductionCost || 0;
        const opCost = costs.costPerHour || 0;
        const lcc = costs.lcc || { total: 0, assumptions: { quantity: 100, lifetimeHours: 6000 } };

        this.container.innerHTML = `
            <div class="space-y-3 text-sm">
                ${this._createCostRow('Custo de P&D', devCost, 'Custo único para desenvolver o protótipo e ferramental.')}
                ${this._createCostRow('Custo de Produção', prodCost, 'Custo para construir cada unidade da aeronave.')}
                ${this._createCostRow('Custo Operacional', opCost, 'Custo estimado por hora de voo (combustível + manutenção).', true)}
                <div class="pt-3 mt-3 border-t border-slate-700/50">
                    ${this._createCostRow('Custo de Ciclo de Vida (LCC)', lcc.total, `Custo total estimado para uma frota de ${lcc.assumptions.quantity} unidades voando ${lcc.assumptions.lifetimeHours} horas.`)}
                </div>
            </div>
        `;
    }

    /**
     * Creates a single row for the cost display.
     * @private
     */
    _createCostRow(label, value, tooltip, isPerHour = false) {
        return `
            <div class="flex justify-between items-center" title="${tooltip}">
                <span class="text-slate-400">${label}</span>
                <span class="font-semibold text-cyan-300">${this._formatCurrency(value)}${isPerHour ? '/hr' : ''}</span>
            </div>
        `;
    }

    /**
     * Formats a number into a readable currency string (e.g., $1.2M).
     * @private
     */
    _formatCurrency(value) {
        if (value >= 1000000000) {
            return `$${(value / 1000000000).toFixed(2)}B`;
        }
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(2)}M`;
        }
        if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}K`;
        }
        return `$${value.toFixed(0)}`;
    }
}
