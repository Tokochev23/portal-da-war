import { realTimeUpdates } from '../services/realTimeUpdates.js';
import { changeHistory } from '../services/changeHistory.js';
import { getAllCountries } from '../services/firebase.js';
import { showNotification, Logger, Formatter } from '../utils.js';

/**
 * Componente de Ferramentas Avançadas do Narrador
 * Inclui comparação de países, operações em lote, analytics, etc.
 */
export class AdvancedTools {
    constructor() {
        this.countries = [];
        this.stats = null;
        this.setupEventListeners();
    }

    async init() {
        await this.loadCountries();
        await this.updateStats();
        this.renderStats();
    }

    async loadCountries() {
        try {
            this.countries = await getAllCountries();
            this.countries.sort((a, b) => (a.Pais || '').localeCompare(b.Pais || ''));
        } catch (error) {
            Logger.error('Erro ao carregar países:', error);
        }
    }

    setupEventListeners() {
        // Botões principais
        document.getElementById('country-comparison')?.addEventListener('click', () => {
            this.showComparisonModal();
        });

        document.getElementById('bulk-operations')?.addEventListener('click', () => {
            this.showBulkOperationsModal();
        });

        document.getElementById('analytics-dashboard')?.addEventListener('click', () => {
            this.showAnalyticsDashboard();
        });

        document.getElementById('refresh-stats')?.addEventListener('click', () => {
            this.updateStats().then(() => this.renderStats());
        });

        // Modais
        this.setupComparisonModal();
        this.setupBulkOperationsModal();
    }

    setupComparisonModal() {
        const modal = document.getElementById('comparison-modal');
        if (!modal) return;

        document.getElementById('close-comparison')?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('close-comparison-btn')?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('export-comparison')?.addEventListener('click', () => {
            this.exportComparison();
        });

        // Click fora para fechar
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    setupBulkOperationsModal() {
        const modal = document.getElementById('bulk-operations-modal');
        if (!modal) return;

        document.getElementById('close-bulk')?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('close-bulk-btn')?.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        // Click fora para fechar
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    showComparisonModal() {
        const modal = document.getElementById('comparison-modal');
        if (!modal) return;

        this.renderComparisonCountries();
        modal.classList.remove('hidden');
    }

    showBulkOperationsModal() {
        const modal = document.getElementById('bulk-operations-modal');
        if (!modal) return;

        modal.classList.remove('hidden');
    }

    renderComparisonCountries() {
        const container = document.getElementById('comparison-countries');
        if (!container) return;

        container.innerHTML = '';

        this.countries.forEach(country => {
            const item = document.createElement('label');
            item.className = 'flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = country.id;
            checkbox.className = 'rounded border-bg-ring/70 bg-bg text-brand-500 focus:ring-brand-500/50';
            checkbox.addEventListener('change', () => this.updateComparison());

            const label = document.createElement('span');
            label.className = 'text-sm text-slate-300';
            label.textContent = country.Pais || country.id;

            item.appendChild(checkbox);
            item.appendChild(label);
            container.appendChild(item);
        });
    }

    updateComparison() {
        const checkboxes = document.querySelectorAll('#comparison-countries input:checked');
        const selectedCountries = Array.from(checkboxes).map(cb => {
            return this.countries.find(c => c.id === cb.value);
        }).filter(Boolean);

        if (selectedCountries.length < 2) {
            document.getElementById('comparison-results').innerHTML = 
                '<div class="text-center text-slate-400 py-8">Selecione pelo menos 2 países para comparar</div>';
            return;
        }

        this.renderComparison(selectedCountries);
    }

    renderComparison(countries) {
        const container = document.getElementById('comparison-results');
        if (!container) return;

        const fields = [
            { key: 'PIB', section: 'geral', label: 'PIB', format: 'currency' },
            { key: 'Populacao', section: 'geral', label: 'Population', format: 'number' },
            { key: 'Estabilidade', section: 'geral', label: 'Estabilidade', format: 'percent' },
            { key: 'Tecnologia', section: 'geral', label: 'Tecnologia', format: 'percent' },
            { key: 'Urbanizacao', section: 'geral', label: 'Urbanização', format: 'percent' },
            { key: 'ModeloPolitico', section: 'geral', label: 'Modelo Político', format: 'text' },
            { key: 'Infantaria', section: 'exercito', label: 'Infantaria', format: 'number' },
            { key: 'Caca', section: 'aeronautica', label: 'Caças', format: 'number' },
            { key: 'Fragata', section: 'marinha', label: 'Fragatas', format: 'number' },
        ];

        let html = `
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-bg-ring/50">
                            <th class="text-left py-2 px-3 text-slate-400 font-medium">Campo</th>
                            ${countries.map(c => `<th class="text-left py-2 px-3 text-slate-200 font-medium">${c.Pais || c.id}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
        `;

        fields.forEach((field, index) => {
            html += `
                <tr class="${index % 2 === 0 ? 'bg-bg/20' : ''} hover:bg-white/5">
                    <td class="py-2 px-3 text-slate-300 font-medium">${field.label}</td>
            `;

            countries.forEach(country => {
                const sectionData = country[field.section] || {};
                const value = sectionData[field.key];
                let formattedValue = '-';

                if (value != null) {
                    switch (field.format) {
                        case 'currency':
                            formattedValue = Formatter.formatCurrency(value);
                            break;
                        case 'percent':
                            formattedValue = `${value}%`;
                            break;
                        case 'number':
                            formattedValue = Formatter.formatNumber(value);
                            break;
                        default:
                            formattedValue = String(value);
                    }
                }

                // Destacar valores extremos
                const isHighest = this.isHighestValue(countries, field, country);
                const isLowest = this.isLowestValue(countries, field, country);
                const cellClass = isHighest ? 'text-emerald-400 font-semibold' : 
                                 isLowest ? 'text-red-400 font-semibold' : 'text-slate-300';

                html += `<td class="py-2 px-3 ${cellClass}">${formattedValue}</td>`;
            });

            html += '</tr>';
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        container.innerHTML = html;
    }

    isHighestValue(countries, field, targetCountry) {
        const values = countries.map(c => {
            const sectionData = c[field.section] || {};
            return sectionData[field.key] || 0;
        }).filter(v => typeof v === 'number');

        if (values.length === 0) return false;
        
        const maxValue = Math.max(...values);
        const targetValue = (targetCountry[field.section] || {})[field.key] || 0;
        
        return targetValue === maxValue && maxValue > 0;
    }

    isLowestValue(countries, field, targetCountry) {
        const values = countries.map(c => {
            const sectionData = c[field.section] || {};
            return sectionData[field.key] || 0;
        }).filter(v => typeof v === 'number');

        if (values.length === 0) return false;
        
        const minValue = Math.min(...values);
        const targetValue = (targetCountry[field.section] || {})[field.key] || 0;
        
        return targetValue === minValue;
    }

    async exportComparison() {
        const checkboxes = document.querySelectorAll('#comparison-countries input:checked');
        const selectedCountries = Array.from(checkboxes).map(cb => {
            return this.countries.find(c => c.id === cb.value);
        }).filter(Boolean);

        if (selectedCountries.length === 0) {
            showNotification('warning', 'Selecione países para exportar');
            return;
        }

        try {
            const csvContent = this.generateComparisonCSV(selectedCountries);
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            link.setAttribute('href', url);
            link.setAttribute('download', `comparacao_paises_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showNotification('success', 'Comparação exportada com sucesso');

        } catch (error) {
            Logger.error('Erro ao exportar comparação:', error);
            showNotification('error', `Erro na exportação: ${error.message}`);
        }
    }

    generateComparisonCSV(countries) {
        const fields = [
            { key: 'PIB', section: 'geral', label: 'PIB' },
            { key: 'Populacao', section: 'geral', label: 'População' },
            { key: 'Estabilidade', section: 'geral', label: 'Estabilidade' },
            { key: 'Tecnologia', section: 'geral', label: 'Tecnologia' },
            { key: 'Urbanizacao', section: 'geral', label: 'Urbanização' },
            { key: 'ModeloPolitico', section: 'geral', label: 'Modelo Político' },
        ];

        // Cabeçalho
        const header = ['Campo', ...countries.map(c => c.Pais || c.id)];
        
        // Dados
        const rows = fields.map(field => {
            const row = [field.label];
            countries.forEach(country => {
                const sectionData = country[field.section] || {};
                const value = sectionData[field.key] ?? '-';
                row.push(value);
            });
            return row;
        });

        // Converter para CSV
        const csvLines = [header, ...rows].map(row => 
            row.map(field => `"${field}"`).join(',')
        );

        return csvLines.join('\n');
    }

    async updateStats() {
        try {
            // Estatísticas básicas
            const totalCountries = this.countries.length;
            const withPlayers = this.countries.filter(c => c.Player).length;
            
            // Cálculos econômicos
            const totalGDP = this.countries.reduce((sum, c) => {
                const pib = c.geral?.PIB || 0;
                return sum + (typeof pib === 'number' ? pib : 0);
            }, 0);

            const avgStability = this.countries.reduce((sum, c) => {
                const est = c.geral?.Estabilidade || 0;
                return sum + (typeof est === 'number' ? est : 0);
            }, 0) / totalCountries;

            // Rankings
            const sortedByGDP = [...this.countries].sort((a, b) => 
                (b.geral?.PIB || 0) - (a.geral?.PIB || 0)
            );
            const sortedByPop = [...this.countries].sort((a, b) => 
                (b.geral?.Populacao || 0) - (a.geral?.Populacao || 0)
            );
            const sortedByStability = [...this.countries].sort((a, b) => 
                (b.geral?.Estabilidade || 0) - (a.geral?.Estabilidade || 0)
            );
            const sortedByTech = [...this.countries].sort((a, b) => 
                (b.geral?.Tecnologia || 0) - (a.geral?.Tecnologia || 0)
            );

            // Estatísticas de atividade (últimas 24h)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const historyStats = await changeHistory.getHistoryStats(null, 1);

            this.stats = {
                totalCountries,
                withPlayers,
                totalGDP,
                avgStability: Math.round(avgStability * 10) / 10,
                highestGDP: sortedByGDP[0],
                highestPop: sortedByPop[0],
                mostStable: sortedByStability[0],
                mostTech: sortedByTech[0],
                changesToday: historyStats.totalChanges || 0,
                rollbacksToday: Math.round((historyStats.rollbackRate || 0) / 100 * historyStats.totalChanges),
                mostActiveCountry: this.getMostActiveCountry(historyStats),
                mostActiveUser: this.getMostActiveUser(historyStats)
            };

        } catch (error) {
            Logger.error('Erro ao atualizar estatísticas:', error);
            this.stats = null;
        }
    }

    getMostActiveCountry(historyStats) {
        if (!historyStats.bySection) return '-';
        
        // Lógica simplificada - na implementação real, precisaríamos dados por país
        return Object.keys(historyStats.bySection)[0] || '-';
    }

    getMostActiveUser(historyStats) {
        if (!historyStats.byUser) return '-';
        
        const users = Object.entries(historyStats.byUser);
        if (users.length === 0) return '-';
        
        const mostActive = users.sort((a, b) => b[1] - a[1])[0];
        return mostActive[0] || '-';
    }

    renderStats() {
        if (!this.stats) return;

        // Estatísticas gerais
        this.updateElement('stats-total-countries', this.stats.totalCountries);
        this.updateElement('stats-with-players', `${this.stats.withPlayers}/${this.stats.totalCountries}`);
        this.updateElement('stats-global-gdp', Formatter.formatCurrencyCompact(this.stats.totalGDP));
        this.updateElement('stats-avg-stability', `${this.stats.avgStability}%`);

        // Atividade recente
        this.updateElement('stats-changes-today', this.stats.changesToday);
        this.updateElement('stats-rollbacks-today', this.stats.rollbacksToday);
        this.updateElement('stats-most-active', this.stats.mostActiveCountry);
        this.updateElement('stats-most-active-user', this.stats.mostActiveUser);

        // Rankings
        this.updateElement('stats-highest-gdp', this.stats.highestGDP?.Pais || '-');
        this.updateElement('stats-highest-pop', this.stats.highestPop?.Pais || '-');
        this.updateElement('stats-most-stable', this.stats.mostStable?.Pais || '-');
        this.updateElement('stats-most-tech', this.stats.mostTech?.Pais || '-');
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = String(value);
        }
    }

    showAnalyticsDashboard() {
        // Implementar dashboard de analytics mais avançado
        showNotification('info', 'Dashboard de Analytics em desenvolvimento');
        
        // Placeholder - futura implementação de gráficos e análises mais profundas
        Logger.info('Analytics Dashboard solicitado', this.stats);
    }

    // Métodos públicos para serem chamados externamente
    async refresh() {
        await this.loadCountries();
        await this.updateStats();
        this.renderStats();
    }

    getStats() {
        return this.stats;
    }

    getCountries() {
        return this.countries;
    }
}

// Singleton para uso global
export const advancedTools = new AdvancedTools();
export default advancedTools;