import { db } from '../services/firebase.js';

export class InventorySystem {
    constructor() {
        this.inventories = new Map();
        this.categories = [
            // Vehicle Categories
            { id: 'MBT', name: 'Main Battle Tank', icon: '🛡️', type: 'vehicle' },
            { id: 'Medium Tank', name: 'Tanque Médio', icon: '⚙️', type: 'vehicle' },
            { id: 'Light Tank', name: 'Tanque Leve', icon: '🏃', type: 'vehicle' },
            { id: 'IFV', name: 'Infantry Fighting Vehicle', icon: '👥', type: 'vehicle' },
            { id: 'APC', name: 'Armored Personnel Carrier', icon: '🚐', type: 'vehicle' },
            { id: 'SPG', name: 'Self-Propelled Gun', icon: '💥', type: 'vehicle' },
            { id: 'SPH', name: 'Self-Propelled Howitzer', icon: '🎯', type: 'vehicle' },
            { id: 'SPAA', name: 'Self-Propelled Anti-Aircraft', icon: '🎪', type: 'vehicle' },
            { id: 'Other', name: 'Outros Veículos', icon: '🔧', type: 'vehicle' },
            
            // Naval Categories
            { id: 'Couraçados', name: 'Couraçados', icon: '⚓', type: 'naval' },
            { id: 'Cruzadores', name: 'Cruzadores', icon: '🚢', type: 'naval' },
            { id: 'Destróieres', name: 'Destróieres', icon: '🛥️', type: 'naval' },
            { id: 'Fragatas', name: 'Fragatas', icon: '🚤', type: 'naval' },
            { id: 'Corvetas', name: 'Corvetas', icon: '⛵', type: 'naval' },
            { id: 'Submarinos', name: 'Submarinos', icon: '🤿', type: 'naval' },
            { id: 'Porta-aviões', name: 'Porta-aviões', icon: '🛩️', type: 'naval' },
            { id: 'Patrulhas', name: 'Patrulhas', icon: '🚨', type: 'naval' },
            { id: 'Auxiliares', name: 'Auxiliares', icon: '🔧', type: 'naval' },
            { id: 'Naval - Outros', name: 'Outros Navios', icon: '🌊', type: 'naval' }
        ];
        this.selectedCountry = null;
        this.typeFilter = 'all'; // 'all', 'vehicle', 'naval'
        
        // Component name translations
        this.componentNames = {
            // Engines
            'gasoline_v8_medium': 'Motor V8 a Gasolina Médio',
            'diesel_v12_heavy': 'Motor V12 Diesel Pesado',
            'gasoline_inline6_light': 'Motor I6 a Gasolina Leve',
            'diesel_v8_medium': 'Motor V8 Diesel Médio',
            'gasoline_v12_heavy': 'Motor V12 a Gasolina Pesado',
            
            // Chassis
            'mbt_medium': 'Chassi MBT Médio',
            'light_tank': 'Chassi Tanque Leve',
            'heavy_tank': 'Chassi Tanque Pesado',
            'spg_chassis': 'Chassi SPG',
            'apc_chassis': 'Chassi APC',
            'ifv_chassis': 'Chassi IFV',
            
            // Common fallbacks
            'standard': 'Padrão',
            'advanced': 'Avançado',
            'basic': 'Básico'
        };
    }

    async initialize() {
        console.log('📦 Inicializando sistema de inventário...');
        this.render();
        
        // Auto-refresh every 60 seconds
        setInterval(() => this.refreshCurrentInventory(), 60000);
    }

    render() {
        const anchor = document.getElementById('inventory-system-anchor');
        if (!anchor) {
            console.warn('⚠️ Âncora inventory-system-anchor não encontrada');
            return;
        }
        
        // Add inventory section after its own anchor
        const existingInventory = document.getElementById('inventory-system-section');
        if (existingInventory) {
            existingInventory.remove();
        }
        
        const inventorySection = document.createElement('div');
        inventorySection.id = 'inventory-system-section';
        inventorySection.innerHTML = this.getHTML();
        
        anchor.parentNode.insertBefore(inventorySection, anchor.nextSibling);
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-load-inventory]')) {
                const countryId = e.target.dataset.loadInventory;
                this.loadCountryInventory(countryId);
            }
            
            if (e.target.id === 'refresh-inventory') {
                this.refreshCurrentInventory();
            }
            
            if (e.target.id === 'export-inventory') {
                this.exportInventory();
            }
            
            if (e.target.matches('[data-edit-quantity]')) {
                const vehicleKey = e.target.dataset.editQuantity;
                const categoryId = e.target.dataset.category;
                this.editVehicleQuantity(categoryId, vehicleKey);
            }
            
            if (e.target.matches('[data-remove-vehicle]')) {
                const vehicleKey = e.target.dataset.removeVehicle;
                const categoryId = e.target.dataset.category;
                this.removeVehicle(categoryId, vehicleKey);
            }
            
            if (e.target.matches('[data-view-category]') || e.target.closest('[data-view-category]')) {
                const element = e.target.matches('[data-view-category]') ? e.target : e.target.closest('[data-view-category]');
                const categoryId = element.dataset.viewCategory;
                this.showCategoryModal(categoryId);
            }
            
            if (e.target.matches('[data-view-vehicle-sheet]')) {
                const vehicleKey = e.target.dataset.viewVehicleSheet;
                const categoryId = e.target.dataset.category;
                this.showVehicleSheet(categoryId, vehicleKey);
            }
            
            if (e.target.matches('[data-filter-type]')) {
                this.typeFilter = e.target.dataset.filterType;
                this.renderInventoryContent();
            }
        });
        
        // Country selector
        const countrySelect = document.getElementById('inventory-country-select');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.loadCountryInventory(e.target.value);
                } else {
                    this.selectedCountry = null;
                    this.renderInventoryContent();
                }
            });
        }
    }

    getHTML() {
        return `
            <div class="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 p-5 mt-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-emerald-200">📦 Sistema de Inventário</h2>
                        <p class="text-xs text-slate-400 mt-1">Gerenciar veículos aprovados por país e categoria</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="refresh-inventory" class="rounded-lg border border-emerald-500/50 text-emerald-200 px-3 py-1.5 text-sm hover:bg-emerald-500/10 transition-colors">
                            🔄 Atualizar
                        </button>
                        <button id="export-inventory" class="rounded-lg border border-emerald-500/50 text-emerald-200 px-3 py-1.5 text-sm hover:bg-emerald-500/10 transition-colors">
                            📁 Exportar
                        </button>
                    </div>
                </div>
                
                <!-- Country Selector -->
                <div class="mb-4">
                    <label class="text-xs text-slate-400 mb-2 block">Selecionar País:</label>
                    <select id="inventory-country-select" class="w-full max-w-md rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50">
                        <option value="">Selecione um país...</option>
                    </select>
                </div>
                
                <!-- Inventory Content -->
                <div id="inventory-content">
                    <div class="text-center py-8 text-slate-400">
                        <div class="text-2xl mb-2">📦</div>
                        <div class="text-sm">Selecione um país para visualizar o inventário</div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadCountryInventory(countryId) {
        try {
            console.log(`📦 Carregando inventário para ${countryId}...`);
            
            this.selectedCountry = countryId;
            
            const inventoryDoc = await db.collection('inventory').doc(countryId).get();
            
            let inventory = {};
            if (inventoryDoc.exists) {
                inventory = inventoryDoc.data();
            }
            
            this.inventories.set(countryId, inventory);
            
            // Load country name
            const countryDoc = await db.collection('paises').doc(countryId).get();
            const countryName = countryDoc.exists ? countryDoc.data().Pais : countryId;
            
            this.renderInventoryContent(inventory, countryName);
            
            console.log(`✅ Inventário de ${countryName} carregado`);
            
        } catch (error) {
            console.error('❌ Erro ao carregar inventário:', error);
            this.renderInventoryError('Erro ao carregar inventário: ' + error.message);
        }
    }

    async refreshCurrentInventory() {
        if (this.selectedCountry) {
            await this.loadCountryInventory(this.selectedCountry);
        }
    }

    renderInventoryContent(inventory = {}, countryName = null) {
        const content = document.getElementById('inventory-content');
        if (!content) return;
        
        if (!this.selectedCountry) {
            content.innerHTML = `
                <div class="text-center py-8 text-slate-400">
                    <div class="text-2xl mb-2">📦</div>
                    <div class="text-sm">Selecione um país para visualizar o inventário</div>
                </div>
            `;
            return;
        }
        
        const totalVehicles = this.calculateTotalVehicles(inventory);
        const totalValue = this.calculateTotalValue(inventory);
        
        const filteredCategories = this.getFilteredCategories();
        
        content.innerHTML = `
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-emerald-200">
                        🏠 ${countryName || this.selectedCountry}
                    </h3>
                    <div class="text-sm text-slate-400">
                        <span class="font-semibold text-emerald-300">${totalVehicles}</span> unidades • 
                        <span class="font-semibold text-emerald-300">$${totalValue.toLocaleString()}</span> valor total
                    </div>
                </div>
                
                <!-- Type Filter -->
                <div class="flex gap-2 mb-4">
                    <button data-filter-type="all" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.typeFilter === 'all' ? 'bg-emerald-500 text-slate-900 font-semibold' : 'border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10'}">
                        🌟 Todos
                    </button>
                    <button data-filter-type="vehicle" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.typeFilter === 'vehicle' ? 'bg-blue-500 text-slate-900 font-semibold' : 'border border-blue-500/30 text-blue-200 hover:bg-blue-500/10'}">
                        🚗 Veículos
                    </button>
                    <button data-filter-type="naval" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.typeFilter === 'naval' ? 'bg-cyan-500 text-slate-900 font-semibold' : 'border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10'}">
                        🚢 Naval
                    </button>
                </div>
            </div>
            
            <!-- Categories Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${filteredCategories.map(category => this.renderCategoryCard(category, inventory[category.id] || {})).join('')}
            </div>
        `;
        
        this.loadCountryOptions();
    }

    getFilteredCategories() {
        if (this.typeFilter === 'all') {
            return this.categories;
        }
        return this.categories.filter(cat => cat.type === this.typeFilter);
    }

    renderCategoryCard(category, vehicles) {
        const vehicleCount = Object.keys(vehicles).length;
        const totalQuantity = Object.values(vehicles).reduce((sum, vehicle) => sum + (vehicle.quantity || 0), 0);
        const categoryValue = Object.values(vehicles).reduce((sum, vehicle) => sum + ((vehicle.cost || 0) * (vehicle.quantity || 0)), 0);
        
        return `
            <div class="bg-bg/30 border border-emerald-500/20 rounded-lg p-4 hover:bg-bg/50 transition-colors cursor-pointer" 
                 data-view-category="${category.id}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${category.icon}</span>
                        <div>
                            <div class="font-semibold text-emerald-200">${category.name}</div>
                            <div class="text-xs text-slate-400">${vehicleCount} modelos • ${totalQuantity} unidades</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-slate-400">$${categoryValue.toLocaleString()}</div>
                        <div class="text-xs text-emerald-300 mt-1">👁️ Ver Detalhes</div>
                    </div>
                </div>
                
                <!-- Quick preview of vehicles -->
                <div class="space-y-1 max-h-20 overflow-hidden">
                    ${Object.keys(vehicles).length === 0 ? `
                        <div class="text-center text-slate-500 text-xs py-2">
                            Nenhum veículo nesta categoria
                        </div>
                    ` : Object.entries(vehicles).slice(0, 2).map(([vehicleKey, vehicleData]) => `
                        <div class="text-xs text-slate-400 flex justify-between">
                            <span>• ${vehicleKey}</span>
                            <span>${vehicleData.quantity || 0}x</span>
                        </div>
                    `).join('') + (Object.keys(vehicles).length > 2 ? `
                        <div class="text-xs text-slate-500 text-center">
                            +${Object.keys(vehicles).length - 2} mais...
                        </div>
                    ` : '')}
                </div>
            </div>
        `;
    }

    renderInventoryError(message) {
        const content = document.getElementById('inventory-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="text-center py-8 text-red-400">
                <div class="text-2xl mb-2">⚠️</div>
                <div class="text-sm">${message}</div>
            </div>
        `;
    }

    calculateTotalVehicles(inventory) {
        let total = 0;
        for (const category of Object.values(inventory)) {
            for (const vehicle of Object.values(category)) {
                total += vehicle.quantity || 0;
            }
        }
        return total;
    }

    calculateTotalValue(inventory) {
        let total = 0;
        for (const category of Object.values(inventory)) {
            for (const vehicle of Object.values(category)) {
                total += (vehicle.cost || 0) * (vehicle.quantity || 0);
            }
        }
        return total;
    }

    async loadCountryOptions() {
        try {
            const select = document.getElementById('inventory-country-select');
            if (!select) return;
            
            // Don't reload if already loaded
            if (select.children.length > 1) return;
            
            const countriesSnapshot = await db.collection('paises').get();
            
            const countries = countriesSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().Pais || doc.id
            })).sort((a, b) => a.name.localeCompare(b.name));
            
            const currentValue = select.value;
            select.innerHTML = '<option value="">Selecione um país...</option>';
            
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.id;
                option.textContent = country.name;
                if (country.id === currentValue) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
            
        } catch (error) {
            console.error('❌ Erro ao carregar países:', error);
        }
    }

    async editVehicleQuantity(categoryId, vehicleKey) {
        try {
            const currentInventory = this.inventories.get(this.selectedCountry) || {};
            const currentVehicle = currentInventory[categoryId]?.[vehicleKey];
            
            if (!currentVehicle) {
                alert('Veículo não encontrado');
                return;
            }
            
            const newQuantity = prompt(
                `Alterar quantidade de "${vehicleKey}":\nQuantidade atual: ${currentVehicle.quantity || 0}`,
                currentVehicle.quantity || 0
            );
            
            if (newQuantity === null) return;
            
            const quantity = parseInt(newQuantity);
            if (isNaN(quantity) || quantity < 0) {
                alert('Quantidade inválida');
                return;
            }
            
            // Update locally
            if (!currentInventory[categoryId]) currentInventory[categoryId] = {};
            currentInventory[categoryId][vehicleKey].quantity = quantity;
            
            // Update in Firebase
            await db.collection('inventory').doc(this.selectedCountry).set(currentInventory, { merge: true });
            
            // Refresh display
            this.renderInventoryContent(currentInventory, this.selectedCountry);
            
            console.log(`✅ Quantidade de "${vehicleKey}" atualizada para ${quantity}`);
            
        } catch (error) {
            console.error('❌ Erro ao editar quantidade:', error);
            alert('Erro ao atualizar quantidade: ' + error.message);
        }
    }

    async removeVehicle(categoryId, vehicleKey) {
        try {
            if (!confirm(`Remover "${vehicleKey}" do inventário?`)) {
                return;
            }
            
            const currentInventory = this.inventories.get(this.selectedCountry) || {};
            
            if (currentInventory[categoryId] && currentInventory[categoryId][vehicleKey]) {
                delete currentInventory[categoryId][vehicleKey];
                
                // Clean up empty category
                if (Object.keys(currentInventory[categoryId]).length === 0) {
                    delete currentInventory[categoryId];
                }
                
                // Update in Firebase
                await db.collection('inventory').doc(this.selectedCountry).set(currentInventory, { merge: true });
                
                // Refresh display
                this.renderInventoryContent(currentInventory, this.selectedCountry);
                
                console.log(`✅ "${vehicleKey}" removido do inventário`);
            }
            
        } catch (error) {
            console.error('❌ Erro ao remover veículo:', error);
            alert('Erro ao remover veículo: ' + error.message);
        }
    }

    async exportInventory() {
        if (!this.selectedCountry) {
            alert('Selecione um país primeiro');
            return;
        }
        
        try {
            const inventory = this.inventories.get(this.selectedCountry) || {};
            const data = JSON.stringify(inventory, null, 2);
            
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `inventario_${this.selectedCountry}_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            console.log('✅ Inventário exportado');
            
        } catch (error) {
            console.error('❌ Erro ao exportar inventário:', error);
            alert('Erro ao exportar: ' + error.message);
        }
    }

    showCategoryModal(categoryId) {
        if (!this.selectedCountry) {
            alert('Selecione um país primeiro');
            return;
        }

        const inventory = this.inventories.get(this.selectedCountry) || {};
        const vehicles = inventory[categoryId] || {};
        const category = this.categories.find(cat => cat.id === categoryId);

        if (!category) {
            alert('Categoria não encontrada');
            return;
        }

        // Remove modal existente
        const existingModal = document.getElementById('category-inventory-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Criar modal
        const modal = document.createElement('div');
        modal.id = 'category-inventory-modal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.style.zIndex = '9999';

        const vehicleCount = Object.keys(vehicles).length;
        const totalQuantity = Object.values(vehicles).reduce((sum, vehicle) => sum + (vehicle.quantity || 0), 0);
        const categoryValue = Object.values(vehicles).reduce((sum, vehicle) => sum + ((vehicle.cost || 0) * (vehicle.quantity || 0)), 0);

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${category.icon}</span>
                        <div>
                            <h3 class="text-xl font-bold text-slate-100">${category.name}</h3>
                            <p class="text-sm text-slate-400">${this.getCountryDisplayName()} - ${vehicleCount} modelos • ${totalQuantity} unidades</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-semibold text-emerald-300">$${categoryValue.toLocaleString()}</div>
                        <button onclick="document.getElementById('category-inventory-modal').remove()" 
                                class="text-slate-400 hover:text-slate-200 text-2xl mt-2">×</button>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-auto p-6">
                    ${Object.keys(vehicles).length === 0 ? `
                        <div class="text-center py-12 text-slate-400">
                            <div class="text-4xl mb-4">${category.icon}</div>
                            <div class="text-lg">Nenhum veículo nesta categoria</div>
                            <div class="text-sm mt-2">Aprove alguns projetos de ${category.name.toLowerCase()} para vê-los aqui</div>
                        </div>
                    ` : `
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${Object.entries(vehicles).map(([vehicleKey, vehicleData]) => this.renderVehicleCard(vehicleKey, vehicleData, categoryId)).join('')}
                        </div>
                    `}
                </div>
            </div>
        `;

        // Adicionar event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        document.body.appendChild(modal);
    }

    renderVehicleCard(vehicleKey, vehicleData, categoryId) {
        const totalValue = (vehicleData.cost || 0) * (vehicleData.quantity || 0);
        const hasSheet = vehicleData.sheetImageUrl || vehicleData.sheetHtmlUrl || vehicleData.specs;
        const specs = vehicleData.specs || {};
        
        // Calculate maintenance costs
        const unitMaintenanceCost = vehicleData.maintenanceCost || vehicleData.costs?.maintenance || 0;
        const totalMaintenanceCost = unitMaintenanceCost * (vehicleData.quantity || 0);

        return `
            <div class="bg-slate-900/50 rounded-lg p-5 border border-slate-600/30 hover:border-slate-500/50 transition-colors">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-100 mb-2 text-lg">${vehicleKey}</h4>
                        
                        <!-- Informações básicas -->
                        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300 mb-3">
                            <div>📦 <strong class="text-emerald-400">Quantidade:</strong> ${vehicleData.quantity || 0}</div>
                            <div>💰 <strong class="text-emerald-400">Custo unit.:</strong> $${(vehicleData.cost || 0).toLocaleString()}</div>
                            <div>💎 <strong class="text-emerald-400">Valor total:</strong> $${totalValue.toLocaleString()}</div>
                            <div>📅 <strong class="text-emerald-400">Aprovado:</strong> ${vehicleData.approvedDate ? new Date(vehicleData.approvedDate).toLocaleDateString('pt-BR') : 'N/A'}</div>
                            <div>🔧 <strong class="text-yellow-400">Manutenção unit.:</strong> $${unitMaintenanceCost.toLocaleString()}/ano</div>
                            <div>🛠️ <strong class="text-yellow-400">Manutenção total:</strong> $${totalMaintenanceCost.toLocaleString()}/ano</div>
                        </div>
                        
                        <!-- Especificações técnicas expandidas -->
                        ${specs ? `
                            <div class="bg-slate-800/30 rounded-lg p-3 mt-3">
                                <h5 class="text-xs font-semibold text-slate-300 mb-2 flex items-center">
                                    ⚙️ Especificações Técnicas
                                </h5>
                                <div class="grid grid-cols-1 gap-2 text-xs">
                                    ${specs.engine ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🔧 Motor:</span>
                                            <span class="text-blue-300 font-medium">${this.getReadableComponentName(specs.engine)}</span>
                                        </div>
                                    ` : ''}
                                    
                                    ${specs.chassis ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🏗️ Chassi:</span>
                                            <span class="text-blue-300 font-medium">${this.getReadableComponentName(specs.chassis)}</span>
                                        </div>
                                    ` : ''}
                                    
                                    ${specs.armor_thickness ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🛡️ Blindagem:</span>
                                            <span class="text-yellow-300 font-medium">${specs.armor_thickness}mm</span>
                                        </div>
                                    ` : ''}
                                    
                                    ${specs.main_gun_caliber ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🎯 Armamento:</span>
                                            <span class="text-red-300 font-medium">${specs.main_gun_caliber}mm</span>
                                        </div>
                                    ` : ''}
                                    
                                    ${specs.weight ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⚖️ Peso:</span>
                                            <span class="text-slate-300 font-medium">${specs.weight}t</span>
                                        </div>
                                    ` : ''}
                                    
                                    ${specs.max_speed ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⚡ Velocidade:</span>
                                            <span class="text-green-300 font-medium">${specs.max_speed} km/h</span>
                                        </div>
                                    ` : ''}
                                    
                                    ${specs.crew_size ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">👥 Tripulação:</span>
                                            <span class="text-cyan-300 font-medium">${specs.crew_size}</span>
                                        </div>
                                    ` : ''}
                                    
                                    ${specs.fuel_capacity ? `
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⛽ Combustível:</span>
                                            <span class="text-slate-300 font-medium">${specs.fuel_capacity}L</span>
                                        </div>
                                    ` : ''}
                                </div>
                                
                                <!-- Performance indicators -->
                                ${(specs.penetration || specs.protection || specs.mobility) ? `
                                    <div class="mt-3 pt-2 border-t border-slate-700/50">
                                        <h6 class="text-xs font-semibold text-slate-400 mb-2">📊 Indicadores</h6>
                                        <div class="grid grid-cols-3 gap-3 text-xs">
                                            ${specs.penetration ? `
                                                <div class="text-center">
                                                    <div class="text-red-400 font-bold">${specs.penetration}mm</div>
                                                    <div class="text-slate-500">Penetração</div>
                                                </div>
                                            ` : ''}
                                            ${specs.protection ? `
                                                <div class="text-center">
                                                    <div class="text-yellow-400 font-bold">${specs.protection}mm</div>
                                                    <div class="text-slate-500">Proteção</div>
                                                </div>
                                            ` : ''}
                                            ${specs.mobility ? `
                                                <div class="text-center">
                                                    <div class="text-green-400 font-bold">${specs.mobility}</div>
                                                    <div class="text-slate-500">Mobilidade</div>
                                                </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex flex-col gap-2 min-w-28 ml-4">
                        ${hasSheet ? `
                            <button data-view-vehicle-sheet="${vehicleKey}" data-category="${categoryId}"
                                    class="px-3 py-2 text-xs rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-200 hover:bg-blue-500/30 transition-colors font-medium">
                                🖼️ Ver Ficha
                            </button>
                        ` : ''}
                        
                        <button data-edit-quantity="${vehicleKey}" data-category="${categoryId}" 
                                class="px-3 py-2 text-xs rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30 transition-colors font-medium">
                            ✏️ Editar Qtd
                        </button>
                        
                        <button data-remove-vehicle="${vehicleKey}" data-category="${categoryId}" 
                                class="px-3 py-2 text-xs rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 transition-colors font-medium">
                            🗑️ Remover
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    showVehicleSheet(categoryId, vehicleKey) {
        if (!this.selectedCountry) {
            alert('Selecione um país primeiro');
            return;
        }

        const inventory = this.inventories.get(this.selectedCountry) || {};
        const vehicleData = inventory[categoryId]?.[vehicleKey];

        if (!vehicleData) {
            alert('Dados do veículo não encontrados');
            return;
        }

        // Priorizar URL de imagem, depois HTML, depois specs
        let sheetUrl = null;
        let sheetType = 'none';

        if (vehicleData.sheetImageUrl && vehicleData.sheetImageUrl.startsWith('http')) {
            sheetUrl = vehicleData.sheetImageUrl;
            sheetType = 'image';
        } else if (vehicleData.sheetHtmlUrl && vehicleData.sheetHtmlUrl.startsWith('http')) {
            sheetUrl = vehicleData.sheetHtmlUrl;
            sheetType = 'html';
        } else if (vehicleData.sheetImageUrl && vehicleData.sheetImageUrl.startsWith('data:')) {
            sheetUrl = vehicleData.sheetImageUrl;
            sheetType = 'data';
        }

        if (!sheetUrl) {
            // Fallback: criar ficha básica com dados disponíveis
            this.showBasicVehicleInfo(vehicleKey, vehicleData);
            return;
        }

        // Remover modal existente
        const existingModal = document.getElementById('vehicle-sheet-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Criar modal da ficha
        const modal = document.createElement('div');
        modal.id = 'vehicle-sheet-modal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.style.zIndex = '10000';

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-slate-600">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-200">🖼️ Ficha Técnica</h3>
                        <p class="text-sm text-slate-400">${vehicleKey} - ${this.getCountryDisplayName()}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.open('${sheetUrl}', '_blank')" 
                                class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10">
                            🔗 Nova Aba
                        </button>
                        <button onclick="document.getElementById('vehicle-sheet-modal').remove()" 
                                class="text-slate-400 hover:text-slate-200 text-xl p-1">×</button>
                    </div>
                </div>
                
                <div class="flex-1 overflow-auto p-4">
                    ${sheetType === 'image' ? `
                        <div class="text-center">
                            <img src="${sheetUrl}" alt="Ficha do Veículo" 
                                 class="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
                                 style="max-height: 70vh;" />
                        </div>
                    ` : sheetType === 'html' || sheetType === 'data' ? `
                        <iframe src="${sheetUrl}" 
                                style="width: 100%; height: 70vh; border: none; border-radius: 8px;"></iframe>
                    ` : `
                        <div class="text-center py-8 text-red-400">
                            Formato de ficha não suportado
                        </div>
                    `}
                </div>
            </div>
        `;

        // Event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        document.body.appendChild(modal);
    }

    showBasicVehicleInfo(vehicleKey, vehicleData) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.style.zIndex = '10000';

        modal.innerHTML = `
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-2xl w-full p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-slate-100">📋 ${vehicleKey}</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-900/50 rounded-lg p-4">
                        <h4 class="text-emerald-300 font-semibold mb-2">📊 Informações Gerais</h4>
                        <div class="space-y-2 text-sm text-slate-300">
                            <div>Quantidade: ${vehicleData.quantity || 0}</div>
                            <div>Custo unitário: $${(vehicleData.cost || 0).toLocaleString()}</div>
                            <div>Valor total: $${((vehicleData.cost || 0) * (vehicleData.quantity || 0)).toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-900/50 rounded-lg p-4">
                        <h4 class="text-blue-300 font-semibold mb-2">⚙️ Especificações</h4>
                        <div class="space-y-2 text-sm text-slate-300">
                            ${vehicleData.specs ? `
                                <div>Motor: ${this.getReadableComponentName(vehicleData.specs.engine)}</div>
                                <div>Chassi: ${this.getReadableComponentName(vehicleData.specs.chassis)}</div>
                                <div>Blindagem: ${vehicleData.specs.armor_thickness || 'N/A'}mm</div>
                                <div>Armamento: ${vehicleData.specs.main_gun_caliber || 'N/A'}mm</div>
                            ` : '<div class="text-slate-400">Especificações não disponíveis</div>'}
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 text-center">
                    <div class="text-sm text-slate-400">Ficha detalhada não disponível para este veículo</div>
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        document.body.appendChild(modal);
    }

    getCountryDisplayName() {
        if (!this.selectedCountry) return 'País Desconhecido';
        
        // Try to get country name from loaded data or use ID
        const countrySelect = document.getElementById('inventory-country-select');
        if (countrySelect) {
            const selectedOption = countrySelect.querySelector(`option[value="${this.selectedCountry}"]`);
            if (selectedOption) {
                return selectedOption.textContent;
            }
        }
        
        return this.selectedCountry;
    }

    // Helper function to get readable component names
    getReadableComponentName(componentId) {
        if (!componentId) return 'N/A';
        
        // Check if we have a translation
        if (this.componentNames[componentId]) {
            return this.componentNames[componentId];
        }
        
        // Try to make a readable name from the ID
        return componentId
            .replace(/_/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
}