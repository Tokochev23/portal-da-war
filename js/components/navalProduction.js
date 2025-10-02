// js/components/navalProduction.js - Naval Production System with Firebase Integration

import { db, auth } from '../services/firebase.js';
import { showNotification } from '../utils.js';
import { ShipyardSystem } from '../systems/shipyardSystem.js';

// Load naval components if not already loaded
async function loadNavalComponents() {
    if (!window.NAVAL_COMPONENTS) {
        try {
            const hulls = await import('../data/naval-components/hulls.js');
            const navalGuns = await import('../data/naval-components/naval_guns.js');
            const navalMissiles = await import('../data/naval-components/naval_missiles.js');
            const secondaryWeapons = await import('../data/naval-components/secondary_weapons.js');
            const propulsion = await import('../data/naval-components/propulsion.js');
            const electronics = await import('../data/naval-components/electronics.js');
            const armor = await import('../data/naval-components/armor.js');
            
            window.NAVAL_COMPONENTS = {
                hulls: hulls.hulls || hulls.default,
                naval_guns: navalGuns.naval_guns || navalGuns.default,
                naval_missiles: navalMissiles.naval_missiles || navalMissiles.default,
                secondary_weapons: secondaryWeapons.secondary_weapons || secondaryWeapons.default,
                propulsion: propulsion.propulsion || propulsion.default,
                electronics: electronics.electronics || electronics.default,
                armor: armor.armor || armor.default
            };
            
            console.log('📦 Componentes navais carregados para sistema de produção');
        } catch (error) {
            console.error('❌ Erro ao carregar componentes navais:', error);
        }
    }
}

export class NavalProductionSystem {
    constructor() {
        this.pendingOrders = [];
        this.approvedOrders = [];
        this.completedOrders = [];
        this.inProductionOrders = [];
        this.currentFilter = 'pending';
        this.currentSort = 'newest';
        this.shipyardSystem = new ShipyardSystem();
    }

    async initialize() {
        try {
            console.log('🚢 Inicializando sistema de produção naval...');
            
            // Load naval components first
            await loadNavalComponents();
            
            await this.loadPendingOrders();
            await this.loadApprovedOrders();
            await this.loadInProductionOrders();
            
            this.setupEventListeners();
            this.render();
            
            console.log('✅ Sistema de produção naval inicializado');
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de produção naval:', error);
        }
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-approve-production]')) {
                const orderId = e.target.dataset.approveProduction;
                this.showApprovalModal(orderId);
            }
            
            if (e.target.matches('[data-reject-production]')) {
                const orderId = e.target.dataset.rejectProduction;
                this.rejectOrder(orderId);
            }

            if (e.target.matches('[data-filter-production]')) {
                const filter = e.target.dataset.filterProduction;
                this.currentFilter = filter;
                this.render();
            }

            if (e.target.matches('[data-sort-production]')) {
                const sort = e.target.dataset.sortProduction;
                this.currentSort = sort;
                this.render();
            }
            
            if (e.target.matches('[data-view-naval-sheet]')) {
                const orderId = e.target.dataset.viewNavalSheet;
                this.viewNavalSheet(orderId);
            }
        });

        // Auto-refresh every 30 seconds
        setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    async loadPendingOrders() {
        try {
            const snapshot = await db.collection('naval_orders_pending')
                .orderBy('submissionDate', 'desc')
                .get();

            this.pendingOrders = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                submissionDate: doc.data().submissionDate?.toDate() || new Date()
            }));

            console.log(`📋 ${this.pendingOrders.length} ordens pendentes carregadas`);
        } catch (error) {
            console.error('❌ Erro ao carregar ordens pendentes:', error);
            this.pendingOrders = [];
        }
    }

    async loadApprovedOrders() {
        try {
            console.log('🔄 Carregando ordens navais aprovadas (nova estrutura)...');
            
            // Get all countries with approved ships
            const countriesSnapshot = await db.collection('naval_orders_approved').get();
            
            this.approvedOrders = [];
            
            for (const countryDoc of countriesSnapshot.docs) {
                const countryId = countryDoc.id;
                console.log(`📁 Processando país naval: ${countryId}`);
                
                // Get ships for this country
                const shipsSnapshot = await db.collection('naval_orders_approved')
                    .doc(countryId)
                    .collection('ships')
                    .orderBy('approvalDate', 'desc')
                    .limit(20) // Limit per country
                    .get();
                
                shipsSnapshot.docs.forEach(doc => {
                    this.approvedOrders.push({
                        id: doc.id,
                        ...doc.data(),
                        approvalDate: doc.data().approvalDate?.toDate() || new Date()
                    });
                });
            }
            
            // Sort all approved orders by date
            this.approvedOrders.sort((a, b) => (b.approvalDate || 0) - (a.approvalDate || 0));
            
            // Keep only top 50 overall
            this.approvedOrders = this.approvedOrders.slice(0, 50);

            console.log(`✅ ${this.approvedOrders.length} ordens aprovadas carregadas`);
        } catch (error) {
            console.error('❌ Erro ao carregar ordens aprovadas:', error);
            this.approvedOrders = [];
        }
    }

    async loadInProductionOrders() {
        try {
            const snapshot = await db.collection('naval_orders_production')
                .orderBy('productionStartDate', 'desc')
                .get();

            this.inProductionOrders = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    productionStartDate: data.productionStartDate?.toDate() || new Date(),
                    estimatedCompletion: data.estimatedCompletion?.toDate() || new Date()
                };
            });

            console.log(`🏭 ${this.inProductionOrders.length} ordens em produção carregadas`);
        } catch (error) {
            console.error('❌ Erro ao carregar ordens em produção:', error);
            this.inProductionOrders = [];
        }
    }

    async refreshData() {
        await Promise.all([
            this.loadPendingOrders(),
            this.loadApprovedOrders(), 
            this.loadInProductionOrders()
        ]);
        this.render();
    }

    render() {
        console.log('🎨 Tentando renderizar sistema de produção naval...');
        const anchor = document.getElementById('naval-production-anchor');
        if (!anchor) {
            console.error('❌ Âncora naval-production-anchor não encontrada no DOM');
            console.log('🔍 Elementos disponíveis com ID:', 
                Array.from(document.querySelectorAll('[id]')).map(el => el.id));
            
            // Retry after a short delay
            setTimeout(() => {
                console.log('🔄 Tentando novamente após delay...');
                this.render();
            }, 1000);
            return;
        }
        
        console.log('✅ Âncora encontrada, renderizando interface...');
        console.log('📊 Dados: pendentes=' + this.pendingOrders.length + 
                   ', aprovadas=' + this.approvedOrders.length + 
                   ', produção=' + this.inProductionOrders.length);

        // Remove existing content
        const existing = document.getElementById('naval-production-system');
        if (existing) {
            existing.remove();
        }

        const html = `
            <div id="naval-production-system" class="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-bold text-slate-100 flex items-center space-x-2">
                            <span>🏭</span>
                            <span>Sistema de Produção Naval</span>
                        </h2>
                        <p class="text-xs text-slate-400 mt-1">Gerenciar pedidos de construção naval e cronograma de produção</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                    <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-amber-300">${this.pendingOrders.length}</div>
                        <div class="text-xs text-amber-200">Aguardando Aprovação</div>
                    </div>
                    <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-blue-300">${this.approvedOrders.length}</div>
                        <div class="text-xs text-blue-200">Aprovados</div>
                    </div>
                    <div class="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-orange-300">${this.inProductionOrders.length}</div>
                        <div class="text-xs text-orange-200">Em Produção</div>
                    </div>
                    <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-green-300">${this.completedOrders.length}</div>
                        <div class="text-xs text-green-200">Concluídos</div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    <button data-filter-production="pending" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter === 'pending' ? 'bg-amber-500 text-slate-900 font-semibold' : 'border border-amber-500/30 text-amber-200 hover:bg-amber-500/10'}">
                        Pendentes (${this.pendingOrders.length})
                    </button>
                    <button data-filter-production="approved" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter === 'approved' ? 'bg-blue-500 text-slate-900 font-semibold' : 'border border-blue-500/30 text-blue-200 hover:bg-blue-500/10'}">
                        Aprovados (${this.approvedOrders.length})
                    </button>
                    <button data-filter-production="production" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter === 'production' ? 'bg-orange-500 text-slate-900 font-semibold' : 'border border-orange-500/30 text-orange-200 hover:bg-orange-500/10'}">
                        Em Produção (${this.inProductionOrders.length})
                    </button>
                </div>

                <div id="orders-list" class="space-y-3">
                    ${this.renderOrdersList()}
                </div>
            </div>
        `;

        anchor.insertAdjacentHTML('afterend', html);
    }

    renderOrdersList() {
        let orders = [];
        
        switch (this.currentFilter) {
            case 'pending':
                orders = [...this.pendingOrders];
                break;
            case 'approved':
                orders = [...this.approvedOrders];
                break;
            case 'production':
                orders = [...this.inProductionOrders];
                break;
            default:
                orders = [...this.pendingOrders];
        }

        if (orders.length === 0) {
            return `<div class="text-center py-8 text-slate-400">Nenhuma ordem encontrada</div>`;
        }

        // Sort orders
        if (this.currentSort === 'newest') {
            orders.sort((a, b) => (b.submissionDate || b.approvalDate || b.productionStartDate) - (a.submissionDate || a.approvalDate || a.productionStartDate));
        } else if (this.currentSort === 'oldest') {
            orders.sort((a, b) => (a.submissionDate || a.approvalDate || a.productionStartDate) - (b.submissionDate || b.approvalDate || b.productionStartDate));
        }

        return orders.map(order => this.renderOrderCard(order)).join('');
    }

    renderOrderCard(order) {
        const statusColors = {
            pending: 'border-amber-500/30 bg-amber-500/5',
            approved: 'border-blue-500/30 bg-blue-500/5',
            production: 'border-orange-500/30 bg-orange-500/5',
            completed: 'border-green-500/30 bg-green-500/5'
        };

        const hull = window.NAVAL_COMPONENTS?.hulls[order.design.hull];
        const hullName = hull?.name || 'Navio Desconhecido';
        
        // Calculate production timeline if approved
        let timelineHTML = '';
        if (order.status === 'production' || order.status === 'approved') {
            timelineHTML = this.renderProductionTimeline(order);
        }

        const actionButtons = this.renderActionButtons(order);

        return `
            <div class="border rounded-lg p-4 ${statusColors[order.status] || statusColors.pending}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <h3 class="text-sm font-semibold text-slate-100">${order.design.name || hullName}</h3>
                            <span class="px-2 py-1 text-xs rounded-full ${this.getStatusBadge(order.status)}">${this.getStatusLabel(order.status)}</span>
                        </div>
                        <div class="text-xs text-slate-400 space-y-1">
                            {/* TODO: UI for Production Line Bonus can be added here, using order.initialLineBonus */}
                            <div>👤 <strong>Jogador:</strong> ${order.userName || 'Desconhecido'}</div>
                            <div>🏠 <strong>País:</strong> ${order.countryName || 'Desconhecido'}</div>
                            <div>🚢 <strong>Tipo:</strong> ${hullName}</div>
                            <div>📦 <strong>Quantidade:</strong> ${order.quantity}x</div>
                            <div>💰 <strong>Custo unitário:</strong> $${Math.round((order.totalCost || 0) / (order.quantity || 1)).toLocaleString()}</div>
                            <div>💰 <strong>Custo total:</strong> $${(order.totalCost || 0).toLocaleString()}</div>
                            ${order.submissionDate ? `<div>📅 <strong>Solicitado:</strong> ${order.submissionDate.toLocaleDateString('pt-BR')} às ${order.submissionDate.toLocaleTimeString('pt-BR')}</div>` : ''}
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2 min-w-32">
                        ${(order.sheetImageUrl || order.sheetHtmlUrl) ? `
                            <button data-view-naval-sheet="${order.id}" class="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                                🖼️ Ver Ficha
                            </button>
                        ` : ''}
                        
                        ${this.currentFilter === 'pending' ? actionButtons : ''}
                    </div>
                </div>

                ${timelineHTML}
            </div>
        `;
    }

    renderProductionTimeline(order) {
        if (!order.productionSchedule) return '';

        const schedule = order.productionSchedule;
        const currentTurn = window.gameConfig?.currentTurn || 1;
        
        let timelineHTML = '<div class="mt-3 p-3 bg-slate-900/50 rounded-lg"><h4 class="text-sm font-semibold text-slate-200 mb-2">📅 Cronograma de Produção</h4><div class="space-y-2 text-xs">';
        
        schedule.batches.forEach((batch, index) => {
            const isCompleted = currentTurn > batch.completionTurn;
            const isCurrent = currentTurn === batch.completionTurn;
            const isPending = currentTurn < batch.completionTurn;
            
            let statusIcon = '⏳';
            let statusClass = 'text-slate-400';
            
            if (isCompleted) {
                statusIcon = '✅';
                statusClass = 'text-green-300';
            } else if (isCurrent) {
                statusIcon = '🔄';
                statusClass = 'text-orange-300';
            }
            
            timelineHTML += `
                <div class="flex justify-between items-center ${statusClass}">
                    <span>${statusIcon} Lote ${index + 1}: ${batch.quantity}x ${order.design.name}</span>
                    <span>Turno ${batch.completionTurn}</span>
                </div>
            `;
        });
        
        timelineHTML += '</div></div>';
        return timelineHTML;
    }

    renderActionButtons(order) {
        if (order.status === 'pending') {
            return `
                <div class="flex gap-2 mt-3">
                    <button data-approve-production="${order.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition-colors">
                        ✅ Aprovar
                    </button>
                    <button data-reject-production="${order.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-red-500 text-slate-900 font-semibold hover:bg-red-400 transition-colors">
                        ❌ Rejeitar
                    </button>
                </div>
            `;
        }
        return '';
    }

    getStatusBadge(status) {
        const badges = {
            pending: 'bg-amber-500/20 text-amber-200',
            approved: 'bg-blue-500/20 text-blue-200',
            production: 'bg-orange-500/20 text-orange-200',
            completed: 'bg-green-500/20 text-green-200'
        };
        return badges[status] || badges.pending;
    }

    getStatusLabel(status) {
        const labels = {
            pending: 'Pendente',
            approved: 'Aprovado',
            production: 'Em Produção',
            completed: 'Concluído'
        };
        return labels[status] || 'Desconhecido';
    }

    async showApprovalModal(orderId) {
        try {
            const order = this.pendingOrders.find(o => o.id === orderId);
            if (!order) {
                throw new Error('Ordem não encontrada');
            }

            const hull = window.NAVAL_COMPONENTS?.hulls[order.design.hull];
            if (!hull) {
                throw new Error('Dados do casco não encontrados para este tipo de navio');
            }

            // Use production data from hull or create default based on displacement
            let productionData = hull.production;
            if (!productionData) {
                console.warn(`⚠️ Dados de produção não encontrados para ${hull.name}, usando dados padrão`);
                
                // Create default production data based on ship size
                const displacement = hull.displacement || 2000;
                productionData = {
                    build_time_months: Math.max(6, Math.ceil(displacement / 300)), // Bigger ships take longer
                    workers_required: Math.max(800, Math.ceil(displacement * 0.8)),
                    materials_steel_tons: Math.ceil(displacement * 0.7),
                    materials_specialty_tons: Math.ceil(displacement * 0.05),
                    shipyard_type: displacement > 5000 ? "heavy" : displacement > 2000 ? "medium" : "light",
                    max_parallel: Math.max(1, Math.ceil(12 / Math.sqrt(displacement / 1000))),
                    complexity_rating: Math.min(10, Math.max(1, Math.ceil(displacement / 1000)))
                };
            }

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            modal.id = 'production-approval-modal';

            const requestedQuantity = order.quantity;
            const buildTimeMonths = productionData.build_time_months;
            const turnsRequired = Math.ceil(buildTimeMonths / 3); // 3 meses por turno
            
            modal.innerHTML = `
                <style>
                    #production-quantity-slider {
                        background: linear-gradient(to right, #10b981 0%, #10b981 100%, #334155 100%, #334155 100%);
                        border-radius: 5px;
                        height: 10px;
                        outline: none;
                        appearance: none;
                    }
                    
                    #production-quantity-slider::-webkit-slider-track {
                        background: transparent;
                    }
                    
                    #production-quantity-slider::-webkit-slider-thumb {
                        appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #064e3b;
                        box-shadow: 0 0 0 1px #10b981;
                    }
                    
                    #production-quantity-slider::-webkit-slider-thumb:hover {
                        background: #059669;
                        box-shadow: 0 0 0 2px #10b981;
                    }
                    
                    #production-quantity-slider::-moz-range-track {
                        background: linear-gradient(to right, #10b981 0%, #10b981 100%, #334155 100%, #334155 100%);
                        height: 10px;
                        border-radius: 5px;
                        border: none;
                    }
                    
                    #production-quantity-slider::-moz-range-thumb {
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #064e3b;
                    }
                </style>
                
                <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-lg w-full p-6">
                    <h3 class="text-lg font-semibold text-emerald-200 mb-4">✅ Aprovar Ordem de Produção</h3>
                    
                    <div class="space-y-4 mb-6">
                        <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <h4 class="font-semibold text-slate-200 mb-2">${order.design.name}</h4>
                            <div class="text-sm text-slate-400 space-y-1">
                                <div><span class="text-slate-300">Tipo:</span> ${hull.name}</div>
                                <div><span class="text-slate-300">País:</span> ${order.countryName}</div>
                                <div><span class="text-slate-300">Solicitado:</span> ${requestedQuantity}x</div>
                                <div><span class="text-slate-300">Tempo:</span> ${buildTimeMonths} meses por unidade</div>
                                <div><span class="text-slate-300">Custo unitário:</span> <span class="text-green-300">$${(order.totalCost / requestedQuantity).toLocaleString()}</span></div>
                            </div>
                        </div>

                        <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                            <label class="block text-sm font-semibold text-emerald-200 mb-3">
                                🎲 Quantidade a Aprovar (com base no resultado do dado):
                            </label>
                            <div class="space-y-3">
                                <input type="range" 
                                       id="production-quantity-slider" 
                                       min="1" 
                                       max="${requestedQuantity}" 
                                       value="${requestedQuantity}"
                                       class="w-full h-2 cursor-pointer">
                                <div class="flex justify-between text-xs text-slate-400">
                                    <span>1</span>
                                    <span id="production-current-quantity" class="text-emerald-300 font-semibold text-lg">${requestedQuantity}</span>
                                    <span>${requestedQuantity}</span>
                                </div>
                                <div class="text-center text-sm text-slate-300 bg-slate-800/50 rounded-lg p-2">
                                    <span class="font-semibold">Custo total aprovado: $<span id="production-total-cost" class="text-emerald-300">${order.totalCost.toLocaleString()}</span></span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <label class="block text-sm font-semibold text-blue-200 mb-2">📅 Cronograma de Produção:</label>
                            <div class="bg-slate-900/50 rounded-lg p-3 text-xs" id="production-timeline">
                                <!-- Timeline will be generated here -->
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button id="confirm-production-approval" class="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
                            ✅ Aprovar Produção
                        </button>
                        <button id="cancel-production-approval" class="flex-1 px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                            ❌ Cancelar
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const slider = modal.querySelector('#production-quantity-slider');
            const currentQuantitySpan = modal.querySelector('#production-current-quantity');
            const totalCostSpan = modal.querySelector('#production-total-cost');
            const timelineDiv = modal.querySelector('#production-timeline');

            const unitCost = order.totalCost / requestedQuantity;

            const updateTimeline = async (quantity) => {
                // --- Production Line Logic for Preview ---
                const countryRef = db.collection('paises').doc(order.paisId);
                const countryDoc = await countryRef.get();
                const countryData = countryDoc.exists() ? countryDoc.data() : {};
                const productionLines = countryData.productionLines || { naval: {} };
                const navalLines = productionLines.naval || {};
                const line = navalLines[order.design.name];
                
                let initialBonus = line ? (line.efficiency || 0) : -0.10; // Use penalty if no line exists
                // --- End of Preview Logic ---

                const schedule = await this.calculateProductionSchedule(productionData, quantity, order.paisId, {
                    initialBonus,
                    bonusPerShip: 0.05,
                    maxBonus: 0.40
                });
                timelineDiv.innerHTML = this.renderSchedulePreview(schedule, order.design.name);
            };

            slider.addEventListener('input', (e) => {
                const quantity = parseInt(e.target.value);
                currentQuantitySpan.textContent = quantity;
                totalCostSpan.textContent = (unitCost * quantity).toLocaleString();
                updateTimeline(quantity);
                
                // Update slider gradient
                const percentage = (quantity - 1) / (requestedQuantity - 1) * 100;
                slider.style.background = `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, #334155 ${percentage}%, #334155 100%)`;
            });

            // Initial timeline
            updateTimeline(requestedQuantity);

            modal.querySelector('#confirm-production-approval').addEventListener('click', () => {
                const approvedQuantity = parseInt(slider.value);
                modal.remove();
                this.approveOrder(orderId, approvedQuantity);
            });

            modal.querySelector('#cancel-production-approval').addEventListener('click', () => {
                modal.remove();
            });

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
            });

        } catch (error) {
            console.error('❌ Erro ao mostrar modal de aprovação:', error);
            showNotification('error', 'Erro ao abrir modal: ' + error.message);
        }
    }

    async calculateProductionSchedule(hullOrProductionData, quantity, countryId, productionLine) {
        const { initialBonus, bonusPerShip, maxBonus } = productionLine;
        
        // Get base production data from hull
        let baseProductionData = hullOrProductionData.production || hullOrProductionData;
        
        // Get shipyard level and base bonuses (time reduction, parallel capacity)
        const shipyardLevel = await this.shipyardSystem.getCurrentShipyardLevel(countryId);
        const shipyardBonuses = this.shipyardSystem.calculateProductionBonus(shipyardLevel);
        const maxParallel = Math.ceil((baseProductionData.max_parallel || 1) * shipyardBonuses.parallelMultiplier);

        const currentTurn = window.gameConfig?.currentTurn || 1;
        const productionSlots = Array(maxParallel).fill(currentTurn); // Each slot is available at a certain turn
        const batches = [];
        
        let shipsScheduled = 0;
        while(shipsScheduled < quantity) {
            // Find the earliest available production slot
            const earliestSlotTurn = Math.min(...productionSlots);
            const slotIndex = productionSlots.indexOf(earliestSlotTurn);

            // Calculate bonus for the current ship
            const currentShipIndex = shipsScheduled;
            const lineBonus = Math.min(maxBonus, initialBonus + (currentShipIndex * bonusPerShip));

            // Calculate this specific ship's build time
            const finalProductionData = this.shipyardSystem.applyShipyardBonusToProduction(baseProductionData, shipyardLevel, lineBonus);
            const shipBuildTimeTurns = Math.ceil(finalProductionData.build_time_months / 3);

            // This ship will be completed 'shipBuildTimeTurns' after the slot is free
            const completionTurn = earliestSlotTurn + shipBuildTimeTurns;

            // The slot will be free again on the completion turn
            productionSlots[slotIndex] = completionTurn;

            // Add ship to a batch for the schedule
            let batch = batches.find(b => b.completionTurn === completionTurn);
            if (batch) {
                batch.quantity++;
            } else {
                batches.push({
                    quantity: 1,
                    startTurn: earliestSlotTurn,
                    completionTurn: completionTurn,
                    buildTimeMonths: finalProductionData.build_time_months,
                    appliedBonus: lineBonus
                });
            }
            shipsScheduled++;
        }

        // Sort batches by completion turn
        batches.sort((a, b) => a.completionTurn - b.completionTurn);

        return {
            totalQuantity: quantity,
            estimatedTurns: Math.max(...batches.map(b => b.completionTurn)) - currentTurn,
            batches: batches
        };
    }

    renderSchedulePreview(schedule, shipName) {
        let html = `<div class="text-slate-300 font-medium mb-2">Cronograma previsto:</div>`;
        
        schedule.batches.forEach((batch, index) => {
            html += `
                <div class="flex justify-between py-1">
                    <span>Lote ${index + 1}: ${batch.quantity}x ${shipName}</span>
                    <span class="text-orange-300">Turno ${batch.completionTurn}</span>
                </div>
            `;
        });

        html += `<div class="border-t border-slate-600 mt-2 pt-2 font-medium">Total: ${schedule.totalQuantity} navios em ${schedule.estimatedTurns} turnos</div>`;
        
        return html;
    }

    async approveOrder(orderId, approvedQuantity) {
        try {
            console.log(`✅ Aprovando ordem ${orderId} com ${approvedQuantity} unidades...`);
            
            const orderDoc = await db.collection('naval_orders_pending').doc(orderId).get();
            if (!orderDoc.exists) {
                throw new Error('Ordem não encontrada');
            }
            
            const orderData = orderDoc.data();
            const hull = window.NAVAL_COMPONENTS?.hulls[orderData.design.hull];

            const schedule = await this.calculateProductionSchedule(hull, approvedQuantity, orderData.paisId);
            
            // Move to approved collection (NEW STRUCTURE)
            await db.collection('naval_orders_approved')
                  .doc(orderData.paisId)
                  .collection('ships')
                  .doc(orderId)
                  .set({
                ...orderData,
                approvedQuantity: approvedQuantity,
                originalQuantity: orderData.quantity,
                approvalDate: new Date(),
                status: 'approved',
                productionSchedule: schedule
            });
            
            // Start production immediately
            await db.collection('naval_orders_production').doc(orderId).set({
                ...orderData,
                approvedQuantity: approvedQuantity,
                approvalDate: new Date(),
                productionStartDate: new Date(),
                status: 'production',
                productionSchedule: schedule
            });
            
            // Add to country inventory
            await this.addNavalToInventory({
                ...orderData,
                quantity: approvedQuantity
            });
            
            // Remove from pending
            await db.collection('naval_orders_pending').doc(orderId).delete();
            
            await this.refreshData();
            
            showNotification('success', `Ordem aprovada! Produção de ${approvedQuantity} navios iniciada.`);
            
            console.log(`✅ Ordem ${orderId} aprovada e iniciada produção`);
            
        } catch (error) {
            console.error('❌ Erro ao aprovar ordem:', error);
            showNotification('error', 'Erro ao aprovar ordem: ' + error.message);
        }
    }

    async rejectOrder(orderId) {
        try {
            const reason = prompt('Motivo da rejeição (opcional):');
            
            console.log(`❌ Rejeitando ordem ${orderId}...`);
            
            const orderDoc = await db.collection('naval_orders_pending').doc(orderId).get();
            if (!orderDoc.exists) {
                throw new Error('Ordem não encontrada');
            }
            
            const orderData = orderDoc.data();
            
            // Delete associated files from Storage before rejecting
            await this.deleteNavalOrderFiles(orderData);
            
            // Log rejection for audit purposes only (no permanent storage)
            console.log(`🗑️ Ordem naval rejeitada e arquivos deletados:`, {
                orderId: orderId,
                designName: orderData.design?.name,
                countryName: orderData.countryName,
                rejectionReason: reason || 'Sem motivo especificado',
                rejectionDate: new Date().toISOString()
            });
            
            // Remove from pending (no need to store rejected orders)
            await db.collection('naval_orders_pending').doc(orderId).delete();
            
            await this.refreshData();
            
            showNotification('success', 'Ordem rejeitada e arquivos removidos para economizar espaço.');
            
            console.log(`✅ Ordem ${orderId} rejeitada e limpa do sistema`);
            
        } catch (error) {
            console.error('❌ Erro ao rejeitar ordem:', error);
            showNotification('error', 'Erro ao rejeitar ordem: ' + error.message);
        }
    }

    async deleteNavalOrderFiles(orderData) {
        try {
            console.log('🗑️ Iniciando limpeza de arquivos da ordem naval rejeitada...');
            
            if (!window.firebase?.storage) {
                console.warn('⚠️ Firebase Storage não disponível, pulando limpeza de arquivos');
                return;
            }

            const storage = window.firebase.storage();
            const filesToDelete = [];

            // Collect file URLs to delete
            if (orderData.sheetImageUrl) {
                filesToDelete.push({ url: orderData.sheetImageUrl, type: 'PNG' });
            }
            if (orderData.sheetHtmlUrl) {
                filesToDelete.push({ url: orderData.sheetHtmlUrl, type: 'HTML' });
            }

            // Delete each file
            for (const file of filesToDelete) {
                try {
                    // Extract file path from URL
                    const fileRef = storage.refFromURL(file.url);
                    await fileRef.delete();
                    console.log(`✅ Arquivo ${file.type} deletado:`, file.url);
                } catch (deleteError) {
                    console.warn(`⚠️ Erro ao deletar arquivo ${file.type}:`, deleteError);
                    // Continue with other files even if one fails
                }
            }

            console.log(`✅ Limpeza de arquivos concluída. ${filesToDelete.length} arquivos processados.`);

        } catch (error) {
            console.error('❌ Erro geral na limpeza de arquivos:', error);
            // Don't throw error here - rejection should continue even if file cleanup fails
        }
    }

    async viewNavalSheet(orderId) {
        try {
            // Find order in current data
            const allOrders = [...this.pendingOrders, ...this.approvedOrders, ...this.inProductionOrders];
            const order = allOrders.find(o => o.id === orderId);
            
            if (!order) {
                alert('Ordem não encontrada');
                return;
            }
            
            // Check for naval sheet URLs
            console.log('🔍 Campos da ordem naval:', Object.keys(order));
            console.log('🔍 sheetImageUrl:', order.sheetImageUrl);
            console.log('🔍 sheetHtmlUrl:', order.sheetHtmlUrl);
            
            // Prioritize PNG image from Storage, fallback to HTML
            let imageUrl = null;
            
            if (order.sheetImageUrl && order.sheetImageUrl.startsWith('http')) {
                imageUrl = order.sheetImageUrl;
                console.log('✅ Usando sheetImageUrl (PNG):', imageUrl);
            } else if (order.sheetHtmlUrl && order.sheetHtmlUrl.startsWith('http')) {
                imageUrl = order.sheetHtmlUrl;
                console.log('✅ Usando sheetHtmlUrl (HTML):', imageUrl);
            } else {
                console.error('❌ Nenhuma URL de ficha naval encontrada');
            }
            
            if (!imageUrl) {
                alert('Ficha do navio não encontrada');
                return;
            }
            
            console.log('🖼️ Abrindo ficha naval em modal para ordem:', orderId);
            this.showNavalSheetModal(order, imageUrl);
            
        } catch (error) {
            console.error('❌ Erro ao visualizar ficha naval:', error);
            alert('Erro ao abrir ficha: ' + error.message);
        }
    }

    showNavalSheetModal(order, imageUrl) {
        // Remove any existing modal
        const existingModal = document.getElementById('naval-sheet-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'naval-sheet-modal';
        modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.style.zIndex = '9999';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col';

        // Modal header
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between p-4 border-b border-bg-ring/50';
        header.innerHTML = `
            <div>
                <h3 class="text-lg font-semibold text-slate-200">⚓ Ficha Técnica Naval</h3>
                <p class="text-sm text-slate-400">${order.design?.name || 'Navio'} - ${order.countryName}</p>
            </div>
            <div class="flex items-center gap-2">
                <button id="open-naval-sheet-new-tab" class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                    🔗 Nova Aba
                </button>
                <button id="close-naval-modal" class="text-slate-400 hover:text-slate-200 p-1">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        `;

        // Modal body
        const body = document.createElement('div');
        body.className = 'flex-1 overflow-auto p-4';

        // Handle different content types (PNG image vs HTML)
        if (imageUrl.includes('.png') || imageUrl.includes('.jpg') || imageUrl.includes('.jpeg')) {
            // PNG/JPG Image
            body.innerHTML = `
                <div class="text-center">
                    <img src="${imageUrl}" alt="Ficha do Navio" class="max-w-full max-h-full mx-auto rounded-lg shadow-lg" 
                         style="max-height: 70vh;" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display: none;" class="text-red-400">Erro ao carregar imagem da ficha naval</div>
                </div>
            `;
        } else if (imageUrl.includes('.html')) {
            // HTML content - use iframe
            const iframe = document.createElement('iframe');
            iframe.src = imageUrl;
            iframe.style.cssText = 'width: 100%; height: 70vh; border: none; border-radius: 8px;';
            iframe.onload = () => {
                console.log('✅ Ficha naval HTML carregada no iframe');
            };
            iframe.onerror = () => {
                console.error('❌ Erro ao carregar ficha naval HTML no iframe');
                body.innerHTML = '<p class="text-red-400">Erro ao carregar ficha naval</p>';
            };
            
            body.innerHTML = '';
            body.appendChild(iframe);
        } else {
            body.innerHTML = '<p class="text-red-400">Formato de ficha naval não suportado</p>';
        }

        // Assemble modal
        modalContent.appendChild(header);
        modalContent.appendChild(body);
        modal.appendChild(modalContent);

        // Event listeners
        const closeModal = () => {
            modal.remove();
        };

        const openInNewTab = () => {
            window.open(imageUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        };

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        header.querySelector('#close-naval-modal').addEventListener('click', closeModal);
        header.querySelector('#open-naval-sheet-new-tab').addEventListener('click', openInNewTab);

        // Keyboard support
        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        // Add to DOM
        document.body.appendChild(modal);

        // Focus trap for accessibility
        modal.focus();
    }

    async addNavalToInventory(orderData) {
        try {
            const inventoryRef = db.collection('inventory').doc(orderData.paisId);
            const inventoryDoc = await inventoryRef.get();
            
            let inventory = {};
            if (inventoryDoc.exists) {
                inventory = inventoryDoc.data();
            }
            
            // Determine naval category based on hull type
            const hull = window.NAVAL_COMPONENTS?.hulls[orderData.design.hull];
            const navalCategory = this.getNavalCategory(hull);
            
            if (!inventory[navalCategory]) {
                inventory[navalCategory] = {};
            }
            
            const shipName = orderData.design.name || hull?.name || 'Navio Desconhecido';
            
            if (!inventory[navalCategory][shipName]) {
                // Create clean object without undefined values
                const inventoryItem = {
                    quantity: 0,
                    specs: {
                        hull: hull?.name || 'Desconhecido',
                        displacement: hull?.displacement || 0,
                        max_speed: hull?.max_speed || 0,
                        crew: hull?.crew || 0,
                        range: hull?.range || 0,
                        main_guns: orderData.design.main_guns?.length || 0,
                        missiles: orderData.design.missiles?.length || 0,
                        aa_guns: orderData.design.aa_guns?.length || 0
                    },
                    cost: orderData.totalCost / orderData.quantity,
                    approvedDate: new Date().toISOString(),
                    approvedBy: 'narrator'
                };
                
                // Only add URLs if they exist and are valid
                if (orderData.sheetImageUrl) {
                    inventoryItem.sheetImageUrl = orderData.sheetImageUrl;
                }
                
                if (orderData.sheetHtmlUrl) {
                    inventoryItem.sheetHtmlUrl = orderData.sheetHtmlUrl;
                }
                
                inventory[navalCategory][shipName] = inventoryItem;
            }
            
            inventory[navalCategory][shipName].quantity += orderData.quantity || 1;
            
            await inventoryRef.set(inventory, { merge: true });
            
            console.log(`🚢 ${orderData.quantity || 1}x ${shipName} adicionado ao inventário naval de ${orderData.countryName}`);
            
        } catch (error) {
            console.error('❌ Erro ao adicionar navio ao inventário:', error);
        }
    }

    getNavalCategory(hull) {
        if (!hull) return 'Naval - Outros';
        
        const role = hull.role?.toLowerCase() || hull.type?.toLowerCase() || '';
        
        // Map hull roles to inventory categories
        if (role.includes('destroyer')) return 'Destróieres';
        if (role.includes('cruiser')) return 'Cruzadores';
        if (role.includes('battleship') || role.includes('dreadnought')) return 'Couraçados';
        if (role.includes('carrier') || role.includes('cv')) return 'Porta-aviões';
        if (role.includes('submarine') || role.includes('sub')) return 'Submarinos';
        if (role.includes('frigate')) return 'Fragatas';
        if (role.includes('corvette')) return 'Corvetas';
        if (role.includes('patrol')) return 'Patrulhas';
        if (role.includes('transport') || role.includes('auxiliary')) return 'Auxiliares';
        
        return 'Naval - Outros';
    }
}

// Function to submit naval order for approval (called from naval creator)
export async function submitNavalOrderForApproval(orderData) {
    try {
        if (!auth.currentUser) {
            throw new Error('Usuário não autenticado');
        }

        const user = auth.currentUser;
        
        // Get user country
        const userDoc = await db.collection('usuarios').doc(user.uid).get();
        if (!userDoc.exists || !userDoc.data().paisId) {
            throw new Error('País não vinculado ao usuário');
        }
        
        const paisId = userDoc.data().paisId;
        const countryDoc = await db.collection('paises').doc(paisId).get();
        const countryData = countryDoc.exists ? countryDoc.data() : {};
        
        const submissionData = {
            ...orderData,
            userId: user.uid,
            userName: user.displayName || user.email,
            paisId: paisId,
            countryName: countryData.Pais || 'Desconhecido',
            submissionDate: new Date(),
            status: 'pending'
        };

        // Add to Firebase
        const docRef = await db.collection('naval_orders_pending').add(submissionData);
        
        console.log('✅ Ordem de produção naval submetida:', docRef.id);
        
        showNotification('success', `Ordem de produção submetida para aprovação! ID: ${docRef.id.substring(0, 8)}`);
        
        return { success: true, id: docRef.id };
        
    } catch (error) {
        console.error('❌ Erro ao submeter ordem:', error);
        showNotification('error', 'Erro ao submeter ordem: ' + error.message);
        return { success: false, error: error.message };
    }
}