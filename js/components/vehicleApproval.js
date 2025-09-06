import { db, storage } from '../services/firebase.js';

export class VehicleApprovalSystem {
    constructor() {
        this.pendingVehicles = [];
        this.approvedVehicles = [];
        this.rejectedVehicles = [];
        this.currentFilter = 'pending';
        this.currentSort = 'newest';
        this.pendingListener = null; // Store listener reference for cleanup
        
        this.setupEventListeners();
    }

    async initialize() {
        console.log('🚗 Inicializando sistema de aprovação de veículos...');
        
        // Check if user is authenticated and has permissions
        if (!window.firebase || !window.firebase.auth) {
            console.error('❌ Firebase não inicializado');
            return;
        }
        
        const user = window.firebase.auth().currentUser;
        if (!user) {
            console.log('⚠️ Usuário não logado, aguardando auth state...');
            window.firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    console.log('✅ Usuário logado, inicializando sistema...');
                    this.loadAndRender();
                }
            });
            return;
        }
        
        await this.loadAndRender();
    }
    
    async loadAndRender() {
        await this.loadPendingVehicles();
        this.render();
        
        // Setup real-time listener for new submissions
        this.setupRealTimeListener();
        
        // Auto-refresh every 30 seconds as backup
        setInterval(() => this.refreshData(), 30000);
    }

    setupRealTimeListener() {
        try {
            console.log('🔄 Configurando listener em tempo real para veículos pendentes...');
            
            // Listen for real-time changes to vehicles_pending collection
            this.pendingListener = db.collection('vehicles_pending')
                .onSnapshot((snapshot) => {
                    console.log('🔔 Mudança detectada na coleção vehicles_pending');
                    
                    if (!snapshot.empty) {
                        console.log(`📊 ${snapshot.size} documentos na coleção`);
                        
                        // Process the snapshot with same logic as loadPendingVehicles
                        this.processPendingSnapshot(snapshot);
                    } else {
                        console.log('⚠️ Coleção vazia');
                        this.pendingVehicles = [];
                        this.render();
                    }
                }, (error) => {
                    console.error('❌ Erro no listener de veículos pendentes:', error);
                    // Fallback to manual refresh on listener error
                    setTimeout(() => this.refreshData(), 5000);
                });
                
        } catch (error) {
            console.error('❌ Erro ao configurar listener:', error);
        }
    }

    processPendingSnapshot(snapshot) {
        try {
            const oldCount = this.pendingVehicles.length;
            this.pendingVehicles = [];
            
            for (const doc of snapshot.docs) {
                try {
                    const data = doc.data();
                    
                    // Handle date with fallback
                    let date = new Date(); // Default to now
                    if (data.submittedAt && data.submittedAt.toDate) {
                        date = data.submittedAt.toDate();
                    } else if (data.submissionDate && data.submissionDate.toDate) {
                        date = data.submissionDate.toDate();
                    }
                    
                    const vehicle = {
                        id: doc.id,
                        ...data,
                        submissionDate: date
                    };
                    
                    this.pendingVehicles.push(vehicle);
                    
                } catch (docError) {
                    console.error('❌ Erro ao processar documento no snapshot:', doc.id, docError);
                }
            }
            
            const newCount = this.pendingVehicles.length;
            console.log(`🔔 Atualização em tempo real: ${newCount} veículos pendentes`);
            
            // Show notification if new vehicles were added
            if (newCount > oldCount) {
                const newVehicles = newCount - oldCount;
                console.log(`🆕 ${newVehicles} novo(s) veículo(s) recebido(s)!`);
                this.showNewVehicleNotification(newVehicles);
            }
            
            // Re-render only if currently showing pending vehicles
            if (this.currentFilter === 'pending') {
                this.render();
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar snapshot:', error);
        }
    }

    showNewVehicleNotification(count) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-brand-500 text-slate-900 px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
        notification.style.zIndex = '10000';
        notification.innerHTML = `🆕 ${count} novo(s) veículo(s) para aprovação!`;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Cleanup function to remove listener
    destroy() {
        if (this.pendingListener) {
            console.log('🧹 Removendo listener de veículos pendentes...');
            this.pendingListener();
            this.pendingListener = null;
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-filter]')) {
                this.currentFilter = e.target.dataset.filter;
                this.render();
            }
            
            if (e.target.matches('[data-sort]')) {
                this.currentSort = e.target.dataset.sort;
                this.render();
            }
            
            if (e.target.matches('[data-approve]')) {
                const vehicleId = e.target.dataset.approve;
                this.showApprovalModal(vehicleId);
            }
            
            if (e.target.matches('[data-reject]')) {
                const vehicleId = e.target.dataset.reject;
                this.rejectVehicle(vehicleId);
            }
            
            if (e.target.matches('[data-view-sheet]')) {
                const vehicleId = e.target.dataset.viewSheet;
                this.viewVehicleSheet(vehicleId);
            }
            
            if (e.target.id === 'refresh-vehicles') {
                this.refreshData();
            }
            
            if (e.target.id === 'debug-vehicles') {
                this.debugSystem();
            }
            
            if (e.target.id === 'force-reload') {
                this.forceReload();
            }
            
            if (e.target.id === 'bulk-approve') {
                this.bulkApprove();
            }
            
            if (e.target.id === 'bulk-reject') {
                this.bulkReject();
            }
        });
    }

    async loadPendingVehicles() {
        try {
            console.log('🔍 Buscando veículos pendentes...');
            
            // Clear current data
            this.pendingVehicles = [];
            
            // Use simple approach that works (same as forceReload)
            const snapshot = await db.collection('vehicles_pending').get();
            console.log(`📊 Total de documentos encontrados: ${snapshot.size}`);
            
            if (snapshot.empty) {
                console.log('⚠️ Nenhum veículo pendente encontrado');
                return;
            }
            
            // Process each document with simplified logic
            for (const doc of snapshot.docs) {
                try {
                    const data = doc.data();
                    console.log('🔍 Processando documento:', doc.id, Object.keys(data));
                    
                    // Handle date with fallback
                    let date = new Date(); // Default to now
                    if (data.submittedAt && data.submittedAt.toDate) {
                        date = data.submittedAt.toDate();
                    } else if (data.submissionDate && data.submissionDate.toDate) {
                        date = data.submissionDate.toDate();
                    }
                    
                    const vehicle = {
                        id: doc.id,
                        ...data,
                        submissionDate: date
                    };
                    
                    this.pendingVehicles.push(vehicle);
                    console.log('✅ Veículo adicionado:', vehicle.id, vehicle.vehicleData?.name || 'Nome não encontrado');
                    
                } catch (docError) {
                    console.error('❌ Erro ao processar documento:', doc.id, docError);
                    // Continue processing other documents even if one fails
                }
            }
            
            console.log(`📋 ${this.pendingVehicles.length} veículos pendentes carregados com sucesso`);
            
        } catch (error) {
            console.error('❌ Erro ao carregar veículos pendentes:', error);
            console.error('📋 Detalhes do erro:', error.code, error.message);
            this.pendingVehicles = [];
        }
    }

    async loadApprovedVehicles() {
        try {
            const snapshot = await db.collection('vehicles_approved')
                .orderBy('approvalDate', 'desc')
                .limit(50)
                .get();
            
            this.approvedVehicles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                approvalDate: doc.data().approvalDate?.toDate() || new Date()
            }));
            
            console.log(`✅ ${this.approvedVehicles.length} veículos aprovados carregados`);
        } catch (error) {
            console.error('❌ Erro ao carregar veículos aprovados:', error);
            this.approvedVehicles = [];
        }
    }

    async loadRejectedVehicles() {
        try {
            const snapshot = await db.collection('vehicles_rejected')
                .orderBy('rejectionDate', 'desc')
                .limit(50)
                .get();
            
            this.rejectedVehicles = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                rejectionDate: doc.data().rejectionDate?.toDate() || new Date()
            }));
            
            console.log(`❌ ${this.rejectedVehicles.length} veículos rejeitados carregados`);
        } catch (error) {
            console.error('❌ Erro ao carregar veículos rejeitados:', error);
            this.rejectedVehicles = [];
        }
    }

    async refreshData() {
        console.log('🔄 Atualizando dados de aprovação...');
        
        if (this.currentFilter === 'pending') {
            await this.loadPendingVehicles();
        } else if (this.currentFilter === 'approved') {
            await this.loadApprovedVehicles();
        } else if (this.currentFilter === 'rejected') {
            await this.loadRejectedVehicles();
        }
        
        this.render();
    }

    render() {
        const anchor = document.getElementById('vehicle-approval-anchor');
        if (!anchor) return;

        anchor.innerHTML = this.getHTML();
        this.updateStats();
    }

    getHTML() {
        const vehicles = this.getFilteredVehicles();
        
        return `
            <div class="rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-500/5 to-brand-600/5 p-5 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-brand-200">🚗 Sistema de Aprovação de Veículos</h2>
                        <p class="text-xs text-slate-400 mt-1">Aprovar, rejeitar e gerenciar submissões de veículos dos jogadores</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="refresh-vehicles" class="rounded-lg border border-brand-500/50 text-brand-200 px-3 py-1.5 text-sm hover:bg-brand-500/10 transition-colors">
                            🔄 Atualizar
                        </button>
                        <button id="debug-vehicles" class="rounded-lg border border-red-500/50 text-red-200 px-3 py-1.5 text-sm hover:bg-red-500/10 transition-colors">
                            🔍 Debug
                        </button>
                        <button id="force-reload" class="rounded-lg border border-orange-500/50 text-orange-200 px-3 py-1.5 text-sm hover:bg-orange-500/10 transition-colors">
                            🔧 Force Reload
                        </button>
                        <div class="flex items-center gap-3">
                            <div class="text-sm text-brand-200">
                                <span class="font-semibold" id="pending-count">${this.pendingVehicles.length}</span> pendentes
                            </div>
                            <div class="flex items-center gap-1 text-xs" id="realtime-indicator">
                                <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span class="text-emerald-300">Tempo Real</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Filter and Sort Controls -->
                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <div class="flex gap-1">
                        <button data-filter="pending" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter === 'pending' ? 'bg-brand-500 text-slate-900 font-semibold' : 'border border-brand-500/30 text-brand-200 hover:bg-brand-500/10'}">
                            Pendentes (${this.pendingVehicles.length})
                        </button>
                        <button data-filter="approved" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter === 'approved' ? 'bg-emerald-500 text-slate-900 font-semibold' : 'border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10'}">
                            Aprovados (${this.approvedVehicles.length})
                        </button>
                        <button data-filter="rejected" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter === 'rejected' ? 'bg-red-500 text-slate-900 font-semibold' : 'border border-red-500/30 text-red-200 hover:bg-red-500/10'}">
                            Rejeitados (${this.rejectedVehicles.length})
                        </button>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-slate-400">Ordenar:</span>
                        <select id="sort-vehicles" class="text-xs bg-bg border border-bg-ring/70 rounded px-2 py-1">
                            <option value="newest" ${this.currentSort === 'newest' ? 'selected' : ''}>Mais recentes</option>
                            <option value="oldest" ${this.currentSort === 'oldest' ? 'selected' : ''}>Mais antigos</option>
                            <option value="country" ${this.currentSort === 'country' ? 'selected' : ''}>Por país</option>
                            <option value="category" ${this.currentSort === 'category' ? 'selected' : ''}>Por categoria</option>
                        </select>
                    </div>
                    
                    ${this.currentFilter === 'pending' ? `
                        <div class="ml-auto flex gap-2">
                            <button id="bulk-approve" class="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30 transition-colors">
                                ✅ Aprovar Selecionados
                            </button>
                            <button id="bulk-reject" class="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 transition-colors">
                                ❌ Rejeitar Selecionados
                            </button>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Vehicle List -->
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${vehicles.length === 0 ? `
                        <div class="text-center py-8 text-slate-400">
                            <div class="text-2xl mb-2">🚗</div>
                            <div class="text-sm">Nenhum veículo ${this.currentFilter === 'pending' ? 'pendente' : this.currentFilter === 'approved' ? 'aprovado' : 'rejeitado'}</div>
                        </div>
                    ` : vehicles.map(vehicle => this.renderVehicleCard(vehicle)).join('')}
                </div>
            </div>
        `;
    }

    renderVehicleCard(vehicle) {
        const statusColors = {
            pending: 'border-brand-500/30 bg-brand-500/5',
            approved: 'border-emerald-500/30 bg-emerald-500/5',
            rejected: 'border-red-500/30 bg-red-500/5'
        };
        
        const formatDate = (date) => {
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        };

        const vehicleData = vehicle.vehicleData || {};
        const cost = vehicleData.total_cost || vehicleData.totalCost || 0;
        
        return `
            <div class="border rounded-lg p-4 ${statusColors[this.currentFilter] || statusColors.pending}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="font-semibold text-slate-200">${vehicleData.name || vehicleData.vehicle_name || 'Veículo Sem Nome'}</h3>
                            <span class="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">${vehicle.category || 'N/A'}</span>
                        </div>
                        <div class="text-xs text-slate-400 space-y-1">
                            <div>👤 <strong>Jogador:</strong> ${vehicle.playerName} (${vehicle.playerEmail})</div>
                            <div>🏠 <strong>País:</strong> ${vehicle.countryName}</div>
                            <div>📅 <strong>Enviado:</strong> ${formatDate(vehicle.submissionDate)}</div>
                            <div>📦 <strong>Quantidade:</strong> ${vehicle.quantity || 1} unidades</div>
                            <div>💰 <strong>Custo unitário:</strong> $${cost.toLocaleString()}</div>
                            <div>💰 <strong>Custo total:</strong> $${((cost || 0) * (vehicle.quantity || 1)).toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2 min-w-32">
                        ${(vehicle.imageUrl || vehicle.vehicleSheetImageUrl) ? `
                            <button data-view-sheet="${vehicle.id}" class="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                                🖼️ Ver Ficha
                            </button>
                        ` : ''}
                        
                        ${this.currentFilter === 'pending' ? `
                            <div class="flex gap-1">
                                <button data-approve="${vehicle.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition-colors">
                                    ✅
                                </button>
                                <button data-reject="${vehicle.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-red-500 text-slate-900 font-semibold hover:bg-red-400 transition-colors">
                                    ❌
                                </button>
                            </div>
                            <label class="flex items-center gap-1 text-xs text-slate-400">
                                <input type="checkbox" class="vehicle-select" data-vehicle-id="${vehicle.id}">
                                <span>Selecionar</span>
                            </label>
                        ` : ''}
                    </div>
                </div>
                
                <!-- Vehicle Specs Summary -->
                <div class="mt-3 pt-3 border-t border-slate-600/30">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                        <div><strong>Chassi:</strong> ${vehicleData.chassis || 'N/A'}</div>
                        <div><strong>Motor:</strong> ${vehicleData.engine || 'N/A'}</div>
                        <div><strong>Blindagem:</strong> ${vehicleData.armorThickness || vehicleData.armor_thickness || 0}mm</div>
                        <div><strong>Armamento:</strong> ${vehicleData.main_gun_caliber || 0}mm</div>
                    </div>
                </div>
            </div>
        `;
    }

    getFilteredVehicles() {
        let vehicles = [];
        
        switch (this.currentFilter) {
            case 'pending':
                vehicles = [...this.pendingVehicles];
                break;
            case 'approved':
                vehicles = [...this.approvedVehicles];
                break;
            case 'rejected':
                vehicles = [...this.rejectedVehicles];
                break;
        }
        
        // Sort vehicles
        switch (this.currentSort) {
            case 'newest':
                vehicles.sort((a, b) => (b.submissionDate || b.approvalDate || b.rejectionDate) - (a.submissionDate || a.approvalDate || a.rejectionDate));
                break;
            case 'oldest':
                vehicles.sort((a, b) => (a.submissionDate || a.approvalDate || a.rejectionDate) - (b.submissionDate || b.approvalDate || b.rejectionDate));
                break;
            case 'country':
                vehicles.sort((a, b) => (a.countryName || '').localeCompare(b.countryName || ''));
                break;
            case 'category':
                vehicles.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
                break;
        }
        
        return vehicles;
    }

    async showApprovalModal(vehicleId) {
        try {
            // Find the vehicle
            const vehicle = this.pendingVehicles.find(v => v.id === vehicleId);
            if (!vehicle) {
                alert('Veículo não encontrado');
                return;
            }

            const vehicleData = vehicle.vehicleData || {};
            const requestedQuantity = vehicle.quantity || 1;
            const unitCost = vehicleData.total_cost || vehicleData.totalCost || 0;

            // Remove existing modal
            const existingModal = document.getElementById('approval-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create modal
            const modal = document.createElement('div');
            modal.id = 'approval-modal';
            modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
            modal.style.zIndex = '9999';

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'bg-bg border border-emerald-500/50 rounded-2xl max-w-md w-full p-6';

            modalContent.innerHTML = `
                <style>
                    #approval-quantity-slider {
                        -webkit-appearance: none;
                        appearance: none;
                        background: transparent;
                        cursor: pointer;
                    }
                    
                    #approval-quantity-slider::-webkit-slider-track {
                        background: #475569;
                        height: 8px;
                        border-radius: 4px;
                    }
                    
                    #approval-quantity-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #065f46;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }
                    
                    #approval-quantity-slider::-moz-range-track {
                        background: #475569;
                        height: 8px;
                        border-radius: 4px;
                        border: none;
                    }
                    
                    #approval-quantity-slider::-moz-range-thumb {
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #065f46;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }
                </style>
                
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-emerald-200 mb-2">✅ Aprovar Veículo</h3>
                    <div class="text-sm text-slate-400 space-y-1">
                        <div><strong>Veículo:</strong> ${vehicleData.name || 'Sem nome'}</div>
                        <div><strong>País:</strong> ${vehicle.countryName}</div>
                        <div><strong>Jogador:</strong> ${vehicle.playerName}</div>
                        <div><strong>Quantidade solicitada:</strong> ${requestedQuantity} unidades</div>
                        <div><strong>Custo unitário:</strong> $${unitCost.toLocaleString()}</div>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-emerald-200 mb-3">
                        Quantidade a ser aprovada:
                    </label>
                    <div class="space-y-3">
                        <input type="range" 
                               id="approval-quantity-slider" 
                               min="1" 
                               max="${requestedQuantity}" 
                               value="${requestedQuantity}"
                               class="w-full h-2 cursor-pointer">
                        <div class="flex justify-between text-xs text-slate-400">
                            <span>1</span>
                            <span id="current-quantity" class="text-emerald-300 font-semibold text-lg">${requestedQuantity}</span>
                            <span>${requestedQuantity}</span>
                        </div>
                        <div class="text-center text-sm text-slate-300 bg-slate-800/50 rounded-lg p-2">
                            <span class="font-semibold">Custo total: $<span id="total-cost" class="text-emerald-300">${(unitCost * requestedQuantity).toLocaleString()}</span></span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button id="confirm-approval" class="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
                        ✅ Aprovar
                    </button>
                    <button id="cancel-approval" class="flex-1 px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                        ❌ Cancelar
                    </button>
                </div>
            `;

            modal.appendChild(modalContent);

            // Event listeners for slider
            const slider = modalContent.querySelector('#approval-quantity-slider');
            const currentQuantitySpan = modalContent.querySelector('#current-quantity');
            const totalCostSpan = modalContent.querySelector('#total-cost');

            slider.addEventListener('input', (e) => {
                const quantity = parseInt(e.target.value);
                currentQuantitySpan.textContent = quantity;
                totalCostSpan.textContent = (unitCost * quantity).toLocaleString();
            });

            // Event listeners for buttons
            const confirmBtn = modalContent.querySelector('#confirm-approval');
            const cancelBtn = modalContent.querySelector('#cancel-approval');

            confirmBtn.addEventListener('click', () => {
                const approvedQuantity = parseInt(slider.value);
                modal.remove();
                this.approveVehicle(vehicleId, approvedQuantity);
            });

            cancelBtn.addEventListener('click', () => {
                modal.remove();
            });

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });

            // Keyboard support
            document.addEventListener('keydown', function escapeHandler(e) {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', escapeHandler);
                }
            });

            // Add to DOM
            document.body.appendChild(modal);
            slider.focus();

        } catch (error) {
            console.error('❌ Erro ao mostrar modal de aprovação:', error);
            alert('Erro ao abrir modal: ' + error.message);
        }
    }

    async approveVehicle(vehicleId, approvedQuantity = null) {
        try {
            console.log(`✅ Aprovando veículo ${vehicleId}...`);
            
            // Get vehicle data
            const vehicleDoc = await db.collection('vehicles_pending').doc(vehicleId).get();
            if (!vehicleDoc.exists) {
                throw new Error('Veículo não encontrado');
            }
            
            const vehicleData = vehicleDoc.data();
            const originalQuantity = vehicleData.quantity || 1;
            const finalQuantity = approvedQuantity || originalQuantity;
            
            console.log(`📦 Quantidade original: ${originalQuantity}, aprovada: ${finalQuantity}`);
            
            // Move to approved collection with updated quantity
            await db.collection('vehicles_approved').doc(vehicleId).set({
                ...vehicleData,
                quantity: finalQuantity,
                originalQuantity: originalQuantity,
                approvalDate: new Date(),
                status: 'approved'
            });
            
            // Add to country inventory with approved quantity
            await this.addToInventory({...vehicleData, quantity: finalQuantity});
            
            // Remove from pending
            await db.collection('vehicles_pending').doc(vehicleId).delete();
            
            // Refresh data
            await this.refreshData();
            
            console.log(`✅ Veículo ${vehicleId} aprovado: ${finalQuantity}/${originalQuantity} unidades`);
            
        } catch (error) {
            console.error('❌ Erro ao aprovar veículo:', error);
            alert('Erro ao aprovar veículo: ' + error.message);
        }
    }

    async rejectVehicle(vehicleId) {
        try {
            const reason = prompt('Motivo da rejeição (opcional):');
            
            console.log(`❌ Rejeitando veículo ${vehicleId}...`);
            
            // Get vehicle data
            const vehicleDoc = await db.collection('vehicles_pending').doc(vehicleId).get();
            if (!vehicleDoc.exists) {
                throw new Error('Veículo não encontrado');
            }
            
            const vehicleData = vehicleDoc.data();
            
            // Move to rejected collection
            await db.collection('vehicles_rejected').doc(vehicleId).set({
                ...vehicleData,
                rejectionDate: new Date(),
                rejectionReason: reason || 'Sem motivo especificado',
                status: 'rejected'
            });
            
            // Remove from pending
            await db.collection('vehicles_pending').doc(vehicleId).delete();
            
            // Refresh data
            await this.refreshData();
            
            console.log(`❌ Veículo ${vehicleId} rejeitado com sucesso`);
            
        } catch (error) {
            console.error('❌ Erro ao rejeitar veículo:', error);
            alert('Erro ao rejeitar veículo: ' + error.message);
        }
    }

    async addToInventory(vehicleData) {
        try {
            const inventoryRef = db.collection('inventory').doc(vehicleData.countryId);
            const inventoryDoc = await inventoryRef.get();
            
            let inventory = {};
            if (inventoryDoc.exists) {
                inventory = inventoryDoc.data();
            }
            
            const category = vehicleData.category || 'Other';
            if (!inventory[category]) {
                inventory[category] = {};
            }
            
            const vehicleName = vehicleData.vehicleData?.name || vehicleData.vehicleData?.vehicle_name || 'Veículo Sem Nome';
            
            if (!inventory[category][vehicleName]) {
                inventory[category][vehicleName] = {
                    quantity: 0,
                    specs: vehicleData.vehicleData,
                    cost: vehicleData.vehicleData?.total_cost || vehicleData.vehicleData?.totalCost || 0
                };
            }
            
            inventory[category][vehicleName].quantity += vehicleData.quantity || 1;
            
            await inventoryRef.set(inventory, { merge: true });
            
            console.log(`📦 ${vehicleData.quantity || 1}x ${vehicleName} adicionado ao inventário de ${vehicleData.countryName}`);
            
        } catch (error) {
            console.error('❌ Erro ao adicionar ao inventário:', error);
        }
    }

    async viewVehicleSheet(vehicleId) {
        try {
            // Find vehicle in current data
            const allVehicles = [...this.pendingVehicles, ...this.approvedVehicles, ...this.rejectedVehicles];
            const vehicle = allVehicles.find(v => v.id === vehicleId);
            
            if (!vehicle) {
                alert('Veículo não encontrado');
                return;
            }
            
            // Try multiple image field names and prioritize PNG from Storage
            console.log('🔍 Campos do veículo:', Object.keys(vehicle));
            console.log('🔍 imageUrl:', vehicle.imageUrl);
            console.log('🔍 vehicleSheetImageUrl:', vehicle.vehicleSheetImageUrl?.substring(0, 50) + '...');
            
            // Check for Firebase Storage URL first (PNG images)
            let imageUrl = null;
            
            if (vehicle.imageUrl && vehicle.imageUrl.startsWith('http')) {
                imageUrl = vehicle.imageUrl;
                console.log('✅ Usando imageUrl (Firebase Storage):', imageUrl);
            } else if (vehicle.vehicleSheetImageUrl && vehicle.vehicleSheetImageUrl.startsWith('http')) {
                imageUrl = vehicle.vehicleSheetImageUrl;
                console.log('✅ Usando vehicleSheetImageUrl (Firebase Storage):', imageUrl);
            } else if (vehicle.vehicleSheetImageUrl && vehicle.vehicleSheetImageUrl.startsWith('data:text/html')) {
                imageUrl = vehicle.vehicleSheetImageUrl;
                console.log('⚠️ Usando HTML fallback');
            } else {
                console.error('❌ Nenhuma URL de imagem encontrada');
            }
            
            if (!imageUrl) {
                alert('Ficha do veículo não encontrada');
                return;
            }
            
            console.log('🖼️ Abrindo ficha em modal para veículo:', vehicleId);
            this.showVehicleSheetModal(vehicle, imageUrl);
            
        } catch (error) {
            console.error('❌ Erro ao visualizar ficha:', error);
            alert('Erro ao abrir ficha: ' + error.message);
        }
    }

    showVehicleSheetModal(vehicle, imageUrl) {
        // Remove any existing modal
        const existingModal = document.getElementById('vehicle-sheet-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'vehicle-sheet-modal';
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
                <h3 class="text-lg font-semibold text-slate-200">📋 Ficha Técnica</h3>
                <p class="text-sm text-slate-400">${vehicle.vehicleData?.name || 'Veículo'} - ${vehicle.countryName}</p>
            </div>
            <div class="flex items-center gap-2">
                <button id="open-in-new-tab" class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                    🔗 Nova Aba
                </button>
                <button id="close-modal" class="text-slate-400 hover:text-slate-200 p-1">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        `;

        // Modal body
        const body = document.createElement('div');
        body.className = 'flex-1 overflow-auto p-4';

        // Handle different content types  
        if (imageUrl.startsWith('data:text/html')) {
            // HTML content - use iframe for proper rendering
            const iframe = document.createElement('iframe');
            iframe.src = imageUrl;
            iframe.style.cssText = 'width: 100%; height: 70vh; border: none; border-radius: 8px;';
            iframe.onload = () => {
                console.log('✅ Ficha carregada no iframe');
            };
            iframe.onerror = () => {
                console.error('❌ Erro ao carregar ficha no iframe');
                body.innerHTML = '<p class="text-red-400">Erro ao carregar ficha</p>';
            };
            
            body.innerHTML = '';
            body.appendChild(iframe);
        } else if (imageUrl.startsWith('http')) {
            // Image URL
            body.innerHTML = `
                <div class="text-center">
                    <img src="${imageUrl}" alt="Ficha do Veículo" class="max-w-full max-h-full mx-auto rounded-lg shadow-lg" 
                         style="max-height: 70vh;" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;">
                </div>
            `;
        } else {
            body.innerHTML = '<p class="text-red-400">Formato de ficha não suportado</p>';
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
            if (imageUrl.startsWith('data:text/html')) {
                const htmlContent = decodeURIComponent(imageUrl.split(',')[1]);
                const newWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                if (newWindow) {
                    newWindow.document.open();
                    newWindow.document.write(htmlContent);
                    newWindow.document.close();
                    newWindow.document.title = `Ficha - ${vehicle.vehicleData?.name || 'Veículo'}`;
                }
            } else {
                window.open(imageUrl, '_blank');
            }
        };

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        header.querySelector('#close-modal').addEventListener('click', closeModal);
        header.querySelector('#open-in-new-tab').addEventListener('click', openInNewTab);

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

    async bulkApprove() {
        const selected = this.getSelectedVehicles();
        if (selected.length === 0) {
            alert('Selecione pelo menos um veículo');
            return;
        }
        
        if (!confirm(`Aprovar ${selected.length} veículo(s) selecionado(s)?`)) {
            return;
        }
        
        for (const vehicleId of selected) {
            await this.approveVehicle(vehicleId);
        }
    }

    async bulkReject() {
        const selected = this.getSelectedVehicles();
        if (selected.length === 0) {
            alert('Selecione pelo menos um veículo');
            return;
        }
        
        const reason = prompt('Motivo da rejeição em lote (opcional):');
        
        if (!confirm(`Rejeitar ${selected.length} veículo(s) selecionado(s)?`)) {
            return;
        }
        
        for (const vehicleId of selected) {
            await this.rejectVehicle(vehicleId);
        }
    }

    getSelectedVehicles() {
        const checkboxes = document.querySelectorAll('.vehicle-select:checked');
        return Array.from(checkboxes).map(cb => cb.dataset.vehicleId);
    }

    updateStats() {
        const pendingCountEl = document.getElementById('pending-count');
        if (pendingCountEl) {
            pendingCountEl.textContent = this.pendingVehicles.length;
        }
    }

    async debugSystem() {
        console.log('🔍 === DEBUG DO SISTEMA DE APROVAÇÃO ===');
        
        try {
            // Check Firebase status
            console.log('🔥 Firebase auth:', window.firebase?.auth());
            console.log('👤 Current user:', window.firebase?.auth()?.currentUser);
            console.log('🗃️ Firestore db:', db);
            
            // Check collections
            const pendingRef = db.collection('vehicles_pending');
            console.log('📁 Pending collection ref:', pendingRef);
            
            // Raw query
            const snapshot = await pendingRef.get();
            console.log('📊 Snapshot size:', snapshot.size);
            console.log('📊 Snapshot empty:', snapshot.empty);
            
            if (!snapshot.empty) {
                snapshot.docs.forEach((doc, index) => {
                    console.log(`📄 Doc ${index + 1}:`, doc.id, doc.data());
                });
                
                // Force process the documents to see what happens
                console.log('🔧 FORÇANDO PROCESSAMENTO DOS DOCUMENTOS:');
                const processedVehicles = [];
                
                for (const doc of snapshot.docs) {
                    try {
                        const data = doc.data();
                        console.log('🔍 Processando no debug:', doc.id, Object.keys(data));
                        
                        let date = new Date();
                        if (data.submittedAt && data.submittedAt.toDate) {
                            date = data.submittedAt.toDate();
                        }
                        
                        const vehicle = {
                            id: doc.id,
                            ...data,
                            submissionDate: date
                        };
                        
                        processedVehicles.push(vehicle);
                        console.log('✅ Processado no debug:', vehicle.id, vehicle.vehicleData?.name);
                        
                    } catch (error) {
                        console.error('❌ Erro no debug:', error);
                    }
                }
                
                console.log('🚀 Total processado no debug:', processedVehicles.length);
            }
            
            // Check current state
            console.log('🧠 Current pending vehicles:', this.pendingVehicles);
            console.log('🎯 Current filter:', this.currentFilter);
            
        } catch (error) {
            console.error('💥 Debug error:', error);
        }
        
        console.log('🔍 === FIM DO DEBUG ===');
    }

    async forceReload() {
        console.log('🔧 === FORCE RELOAD INICIADO ===');
        
        try {
            // Clear current data
            this.pendingVehicles = [];
            
            // Force reload with raw query
            const snapshot = await db.collection('vehicles_pending').get();
            console.log('📊 Force reload - documents found:', snapshot.size);
            
            for (const doc of snapshot.docs) {
                const data = doc.data();
                console.log('🔍 Processing in force reload:', doc.id);
                
                let date = new Date();
                if (data.submittedAt && data.submittedAt.toDate) {
                    date = data.submittedAt.toDate();
                } else if (data.submissionDate && data.submissionDate.toDate) {
                    date = data.submissionDate.toDate();
                }
                
                const vehicle = {
                    id: doc.id,
                    ...data,
                    submissionDate: date
                };
                
                this.pendingVehicles.push(vehicle);
                console.log('✅ Added vehicle:', vehicle.id, vehicle.vehicleData?.name);
            }
            
            console.log('🚀 Force reload completed:', this.pendingVehicles.length, 'vehicles');
            
            // Re-render
            this.render();
            
        } catch (error) {
            console.error('❌ Force reload failed:', error);
        }
        
        console.log('🔧 === FORCE RELOAD FIM ===');
    }
}