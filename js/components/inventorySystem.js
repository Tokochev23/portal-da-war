import { db } from '../services/firebase.js';

export class InventorySystem {
    constructor() {
        this.inventories = new Map();
        this.categories = [
            { id: 'MBT', name: 'Main Battle Tank', icon: '🛡️' },
            { id: 'Medium Tank', name: 'Tanque Médio', icon: '⚙️' },
            { id: 'Light Tank', name: 'Tanque Leve', icon: '🏃' },
            { id: 'IFV', name: 'Infantry Fighting Vehicle', icon: '👥' },
            { id: 'APC', name: 'Armored Personnel Carrier', icon: '🚐' },
            { id: 'SPG', name: 'Self-Propelled Gun', icon: '💥' },
            { id: 'SPH', name: 'Self-Propelled Howitzer', icon: '🎯' },
            { id: 'SPAA', name: 'Self-Propelled Anti-Aircraft', icon: '🎪' },
            { id: 'Other', name: 'Outros Veículos', icon: '🔧' }
        ];
        this.selectedCountry = null;
    }

    async initialize() {
        console.log('📦 Inicializando sistema de inventário...');
        this.render();
        
        // Auto-refresh every 60 seconds
        setInterval(() => this.refreshCurrentInventory(), 60000);
    }

    render() {
        const anchor = document.getElementById('vehicle-approval-anchor');
        if (!anchor) return;
        
        // Add inventory section after approval section
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
        
        content.innerHTML = `
            <div class="mb-4">
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-emerald-200">
                        🏠 ${countryName || this.selectedCountry}
                    </h3>
                    <div class="text-sm text-slate-400">
                        <span class="font-semibold text-emerald-300">${totalVehicles}</span> veículos • 
                        <span class="font-semibold text-emerald-300">$${totalValue.toLocaleString()}</span> valor total
                    </div>
                </div>
            </div>
            
            <!-- Categories Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${this.categories.map(category => this.renderCategoryCard(category, inventory[category.id] || {})).join('')}
            </div>
        `;
        
        this.loadCountryOptions();
    }

    renderCategoryCard(category, vehicles) {
        const vehicleCount = Object.keys(vehicles).length;
        const totalQuantity = Object.values(vehicles).reduce((sum, vehicle) => sum + (vehicle.quantity || 0), 0);
        const categoryValue = Object.values(vehicles).reduce((sum, vehicle) => sum + ((vehicle.cost || 0) * (vehicle.quantity || 0)), 0);
        
        return `
            <div class="bg-bg/30 border border-emerald-500/20 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">${category.icon}</span>
                        <div>
                            <div class="font-semibold text-emerald-200">${category.name}</div>
                            <div class="text-xs text-slate-400">${vehicleCount} tipos • ${totalQuantity} unidades</div>
                        </div>
                    </div>
                    <div class="text-xs text-slate-400">
                        $${categoryValue.toLocaleString()}
                    </div>
                </div>
                
                <div class="space-y-2 max-h-40 overflow-y-auto">
                    ${Object.keys(vehicles).length === 0 ? `
                        <div class="text-center text-slate-500 text-xs py-2">
                            Nenhum veículo nesta categoria
                        </div>
                    ` : Object.entries(vehicles).map(([vehicleKey, vehicleData]) => `
                        <div class="bg-bg/50 rounded p-2 border border-slate-600/30">
                            <div class="flex items-center justify-between mb-1">
                                <div class="font-medium text-sm text-slate-200">${vehicleKey}</div>
                                <div class="flex gap-1">
                                    <button data-edit-quantity="${vehicleKey}" data-category="${category.id}" 
                                            class="px-2 py-0.5 text-xs rounded bg-blue-500/20 border border-blue-500/50 text-blue-200 hover:bg-blue-500/30 transition-colors">
                                        ✏️
                                    </button>
                                    <button data-remove-vehicle="${vehicleKey}" data-category="${category.id}" 
                                            class="px-2 py-0.5 text-xs rounded bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 transition-colors">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            <div class="text-xs text-slate-400 space-y-0.5">
                                <div><strong>Quantidade:</strong> ${vehicleData.quantity || 0}</div>
                                <div><strong>Custo unitário:</strong> $${(vehicleData.cost || 0).toLocaleString()}</div>
                                <div><strong>Valor total:</strong> $${((vehicleData.cost || 0) * (vehicleData.quantity || 0)).toLocaleString()}</div>
                            </div>
                        </div>
                    `).join('')}
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
}