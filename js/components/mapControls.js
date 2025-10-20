/**
 * Map Controls - Controles para o mapa (seletor de cores, ferramentas)
 */

export class MapControls {
    constructor(worldMap) {
        this.worldMap = worldMap;
        this.colorPalette = [
            // Cores primárias vibrantes
            { name: 'Vermelho', color: '#ef4444' },
            { name: 'Azul', color: '#3b82f6' },
            { name: 'Verde', color: '#22c55e' },
            { name: 'Amarelo', color: '#eab308' },
            { name: 'Roxo', color: '#a855f7' },
            { name: 'Rosa', color: '#ec4899' },
            { name: 'Laranja', color: '#f97316' },
            { name: 'Ciano', color: '#06b6d4' },

            // Tons escuros
            { name: 'Vermelho Escuro', color: '#991b1b' },
            { name: 'Azul Escuro', color: '#1e3a8a' },
            { name: 'Verde Escuro', color: '#064e3b' },
            { name: 'Roxo Escuro', color: '#581c87' },
            { name: 'Laranja Escuro', color: '#9a3412' },
            { name: 'Rosa Escuro', color: '#9f1239' },

            // Tons claros/pastéis
            { name: 'Vermelho Claro', color: '#fca5a5' },
            { name: 'Azul Claro', color: '#93c5fd' },
            { name: 'Verde Claro', color: '#86efac' },
            { name: 'Amarelo Claro', color: '#fde047' },
            { name: 'Roxo Claro', color: '#d8b4fe' },
            { name: 'Rosa Claro', color: '#fbcfe8' },

            // Cores adicionais
            { name: 'Lima', color: '#84cc16' },
            { name: 'Índigo', color: '#6366f1' },
            { name: 'Turquesa', color: '#14b8a6' },
            { name: 'Magenta', color: '#c026d3' },
            { name: 'Âmbar', color: '#f59e0b' },
            { name: 'Esmeralda', color: '#10b981' },

            // Neutros
            { name: 'Marrom', color: '#92400e' },
            { name: 'Cinza Escuro', color: '#4b5563' },
            { name: 'Cinza', color: '#6b7280' },
            { name: 'Cinza Claro', color: '#d1d5db' },
            { name: 'Preto', color: '#1f2937' },
            { name: 'Branco', color: '#f9fafb' },

            // Especiais
            { name: 'Dourado', color: '#fbbf24' },
            { name: 'Prata', color: '#94a3b8' },
            { name: 'Bronze', color: '#b45309' },
            { name: 'Cobre', color: '#c2410c' }
        ];
    }

    /**
     * Renderiza os controles na página
     */
    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container de controles não encontrado');
            return;
        }

        container.innerHTML = `
            <div class="map-controls bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-slate-700">
                <!-- Título -->
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-slate-100 mb-1">Controles do Mapa</h3>
                    <p class="text-xs text-slate-400">Clique em uma província para pintá-la</p>
                </div>

                <!-- Seletor de Cor -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-slate-300 mb-2">
                        Cor Selecionada
                    </label>
                    <div class="flex items-center gap-3 mb-3">
                        <div id="current-color-display"
                             class="w-12 h-12 rounded-lg border-2 border-slate-600 shadow-inner"
                             style="background-color: #ef4444;">
                        </div>
                        <input type="color"
                               id="custom-color-picker"
                               value="#ef4444"
                               class="w-16 h-12 rounded-lg border-2 border-slate-600 cursor-pointer">
                        <div class="flex-1">
                            <div id="current-color-hex" class="text-sm font-mono text-slate-300">#ef4444</div>
                            <div id="current-color-name" class="text-xs text-slate-500">Vermelho</div>
                        </div>
                    </div>

                    <!-- Paleta de Cores -->
                    <div class="grid grid-cols-6 gap-2" id="color-palette">
                        ${this.colorPalette.map(c => `
                            <button class="color-btn w-full aspect-square rounded-lg border-2 border-transparent hover:border-slate-400 hover:scale-110 transition-all shadow-md"
                                    style="background-color: ${c.color}"
                                    data-color="${c.color}"
                                    data-name="${c.name}"
                                    title="${c.name}">
                            </button>
                        `).join('')}
                    </div>
                </div>

                <!-- Ferramentas -->
                <div class="space-y-2">
                    <button id="export-json-btn"
                            class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Exportar JSON
                    </button>

                    <button id="import-json-btn"
                            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Importar JSON
                    </button>

                    <button id="reset-map-btn"
                            class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Resetar Mapa
                    </button>
                </div>

                <!-- Input file escondido para import -->
                <input type="file" id="json-file-input" accept=".json" style="display: none;">

                <!-- Estatísticas -->
                <div class="mt-4 pt-4 border-t border-slate-700">
                    <h4 class="text-xs font-semibold text-slate-400 mb-2">Estatísticas</h4>
                    <div class="space-y-1 text-xs text-slate-500">
                        <div class="flex justify-between">
                            <span>Províncias pintadas:</span>
                            <span id="painted-count" class="text-slate-300 font-mono">0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Última atualização:</span>
                            <span id="last-update" class="text-slate-300 font-mono">-</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Seletor de cor personalizado
        const colorPicker = document.getElementById('custom-color-picker');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.selectColor(e.target.value, 'Personalizado');
            });
        }

        // Botões de paleta de cores
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.dataset.color;
                const name = btn.dataset.name;
                this.selectColor(color, name);
            });
        });

        // Botão resetar mapa
        const resetBtn = document.getElementById('reset-map-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.worldMap.resetAllProvinces();
            });
        }

        // Botão exportar JSON
        const exportJsonBtn = document.getElementById('export-json-btn');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => {
                this.exportJSON();
            });
        }

        // Botão importar JSON
        const importJsonBtn = document.getElementById('import-json-btn');
        const fileInput = document.getElementById('json-file-input');

        if (importJsonBtn && fileInput) {
            importJsonBtn.addEventListener('click', () => {
                fileInput.click();
            });

            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await this.importJSON(file);
                    fileInput.value = ''; // Reset input
                }
            });
        }
    }

    /**
     * Seleciona uma cor
     */
    selectColor(color, name) {
        this.worldMap.setSelectedColor(color);

        // Atualizar display
        const display = document.getElementById('current-color-display');
        const hexText = document.getElementById('current-color-hex');
        const nameText = document.getElementById('current-color-name');
        const picker = document.getElementById('custom-color-picker');

        if (display) display.style.backgroundColor = color;
        if (hexText) hexText.textContent = color;
        if (nameText) nameText.textContent = name;
        if (picker) picker.value = color;

        // Destacar botão selecionado
        document.querySelectorAll('.color-btn').forEach(btn => {
            if (btn.dataset.color === color) {
                btn.classList.add('border-white', 'ring-2', 'ring-white');
            } else {
                btn.classList.remove('border-white', 'ring-2', 'ring-white');
            }
        });
    }

    /**
     * Exporta o mapa como JSON
     */
    async exportJSON() {
        try {
            const { provinceService } = await import('../services/provinceService.js');
            const jsonString = await provinceService.exportMapAsJSON();

            if (!jsonString) {
                alert('Erro ao exportar mapa!');
                return;
            }

            // Criar blob e fazer download
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `war-mapa-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('Mapa exportado com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar mapa:', error);
            alert('Erro ao exportar mapa: ' + error.message);
        }
    }

    /**
     * Importa mapa de um arquivo JSON
     */
    async importJSON(file) {
        try {
            if (!confirm('ATENÇÃO: Importar um mapa vai SUBSTITUIR todas as províncias atuais. Deseja continuar?')) {
                return;
            }

            const text = await file.text();
            const { provinceService } = await import('../services/provinceService.js');

            const narratorId = firebase.auth().currentUser?.uid;
            const success = await provinceService.importMapFromJSON(text, narratorId);

            if (success) {
                alert('Mapa importado com sucesso! O mapa será atualizado automaticamente.');
            } else {
                alert('Erro ao importar mapa!');
            }
        } catch (error) {
            console.error('Erro ao importar mapa:', error);
            alert('Erro ao importar mapa: ' + error.message);
        }
    }

    /**
     * Atualiza estatísticas
     */
    updateStats(paintedCount) {
        const countEl = document.getElementById('painted-count');
        const updateEl = document.getElementById('last-update');

        if (countEl) {
            countEl.textContent = paintedCount;
        }

        if (updateEl) {
            const now = new Date().toLocaleTimeString('pt-BR');
            updateEl.textContent = now;
        }
    }
}
