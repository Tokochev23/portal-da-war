/**
* Gerenciador de Modais de Oferta
*
* Responsável por:
* - Renderizar modal correto baseado no tipo de oferta
* - Coordenar validação em tempo real
* - Submeter dados formatados corretamente
*/

import { RESOURCE_MAPPING, getDefaultMarketType, getSuggestedPrice } from '../data/resourceMapping.js';
import { db, auth, checkPlayerCountry } from '../services/firebase.js';

export class OfferModalManager {
    constructor(marketplaceSystem) {
        this.marketplaceSystem = marketplaceSystem;
        this.currentModal = null;
        this.currentOfferType = null; // 'sell' ou 'buy'
        this.currentCategory = null;  // 'resources', 'vehicles', 'naval'
    }

    /**
    * Abrir modal de seleção inicial (Recursos vs Equipamentos)
    */
    async openSelectionModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.id = 'category-selection-modal';

        modal.innerHTML = `
            <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-2xl w-full">
                <div class="p-6 border-b border-bg-ring/50">
                    <h2 class="text-2xl font-bold text-white">O que deseja vender?</h2>
                    <p class="text-slate-400 mt-1">Escolha a categoria do item que deseja vender no mercado internacional</p>
                </div>

                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button data-category="resources" class="category-btn group relative p-6 border-2 border-bg-ring rounded-xl hover:border-brand-400 hover:bg-brand-500/10 transition-all">
                        <div class="text-6xl mb-4">📦</div>
                        <h3 class="text-xl font-bold text-white mb-2">Recursos</h3>
                        <p class="text-slate-400 text-sm">Metais, Combustível, Carvão, Alimentos</p>
                    </button>

                    <button data-category="equipment" class="category-btn group relative p-6 border-2 border-bg-ring rounded-xl hover:border-brand-400 hover:bg-brand-500/10 transition-all">
                        <div class="text-6xl mb-4">🚁</div>
                        <h3 class="text-xl font-bold text-white mb-2">Equipamentos</h3>
                        <p class="text-slate-400 text-sm">Veículos, Navios, Aviões</p>
                    </button>
                </div>

                <div class="p-6 border-t border-bg-ring/50 flex justify-end">
                    <button data-action="close" class="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancelar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('[data-action="close"]').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('[data-category="resources"]').addEventListener('click', () => {
            modal.remove();
            this.openCreateOfferModal('sell', 'resources');
        });

        modal.querySelector('[data-category="equipment"]').addEventListener('click', () => {
            modal.remove();
            this.openEquipmentSelectionModal();
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
    * Modal para selecionar equipamento do inventário para vender
    */
    async openEquipmentSelectionModal() {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            const paisId = await checkPlayerCountry(user.uid);
            if (!paisId) throw new Error('Jogador não associado a um país');

            // Buscar inventário
            const inventory = await this.getCountryInventory(paisId);

            if (Object.keys(inventory).length === 0) {
                alert('Seu país não possui equipamentos no inventário para vender.');
                return;
            }

            this.renderEquipmentSelectionModal(inventory, paisId);

        } catch (error) {
            console.error('Erro ao abrir seleção de equipamentos:', error);
            alert(`Erro: ${error.message}`);
        }
    }

    /**
    * Buscar inventário de equipamentos do país
    */
    async getCountryInventory(countryId) {
        console.log('🔍 Buscando inventário para país:', countryId);
        const inventoryDoc = await db.collection('inventory').doc(countryId).get();

        if (!inventoryDoc.exists) {
            console.log('❌ Documento de inventário não existe');
            return {};
        }

        const inventory = inventoryDoc.data();
        console.log('📦 Inventário bruto do Firestore:', inventory);

        const flattenedInventory = {};

        // A estrutura do Firestore é aninhada: { MBT: { "MBT Genérico": {...} } }
        // Precisamos achatar para: { "MBT/MBT Genérico": {...} }
        for (const [categoryId, categoryData] of Object.entries(inventory)) {
            console.log(`🔍 Verificando categoria: ${categoryId}`, categoryData);

            // Se categoryData é um objeto com subcategorias/itens
            if (categoryData && typeof categoryData === 'object') {
                // Verificar se tem quantity diretamente (estrutura plana)
                if (categoryData.quantity !== undefined) {
                    if (categoryData.quantity > 0) {
                        console.log(`✅ Item direto ${categoryId} adicionado`);
                        flattenedInventory[categoryId] = categoryData;
                    }
                } else {
                    // Estrutura aninhada - iterar pelos subitens
                    for (const [itemName, itemData] of Object.entries(categoryData)) {
                        console.log(`  🔍 Verificando subitem: ${itemName}`, itemData);

                        if (itemData && typeof itemData === 'object' && itemData.quantity > 0) {
                            const fullItemId = `${categoryId}/${itemName}`;
                            console.log(`✅ Item ${fullItemId} adicionado ao inventário`);
                            flattenedInventory[fullItemId] = {
                                ...itemData,
                                categoryId: categoryId,
                                itemName: itemName
                            };
                        }
                    }
                }
            }
        }

        console.log('📦 Inventário achatado:', flattenedInventory);
        return flattenedInventory;
    }

    /**
    * Renderizar modal de seleção de equipamento
    */
    renderEquipmentSelectionModal(inventory, paisId) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.id = 'equipment-selection-modal';

        // Organizar por categoria
        const categories = {
            vehicles: { name: 'Veículos Terrestres', icon: '🚗', items: [] },
            naval: { name: 'Navios', icon: '🚢', items: [] },
            aircraft: { name: 'Aeronaves', icon: '✈️', items: [] }
        };

        for (const [itemId, data] of Object.entries(inventory)) {
            // Determinar categoria baseado em categoryId ou category
            let category = data.category || 'vehicles';

            // Se temos categoryId (ex: "MBT", "Destroyer"), tentar mapear
            if (data.categoryId) {
                const catId = data.categoryId.toLowerCase();
                if (catId.includes('mbt') || catId.includes('tank') || catId.includes('vehicle')) {
                    category = 'vehicles';
                } else if (catId.includes('ship') || catId.includes('destroyer') || catId.includes('carrier') || catId.includes('naval')) {
                    category = 'naval';
                } else if (catId.includes('aircraft') || catId.includes('fighter') || catId.includes('bomber')) {
                    category = 'aircraft';
                }
            }

            if (categories[category]) {
                categories[category].items.push({ itemId, ...data });
            }
        }

        const categoriesHTML = Object.entries(categories)
            .filter(([_, cat]) => cat.items.length > 0)
            .map(([catId, cat]) => `
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span class="text-2xl">${cat.icon}</span>
                        ${cat.name}
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${cat.items.map(item => `
                            <button data-select-equipment="${item.itemId}"
                                class="equipment-card group relative p-4 border-2 border-bg-ring rounded-lg hover:border-brand-400 hover:bg-brand-500/10 transition-all text-left">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div class="font-bold text-white">${item.itemName || item.name || item.itemId}</div>
                                        <div class="text-xs text-slate-400">${item.categoryId || item.type || 'Equipamento'}</div>
                                    </div>
                                    <div class="text-2xl">${item.icon || '🔧'}</div>
                                </div>
                                <div class="text-sm text-slate-300 mt-2">
                                    <div>Disponível: <span class="text-brand-400 font-semibold">${item.quantity}</span></div>
                                    ${item.cost ? `<div class="text-xs text-slate-400 mt-1">Valor base: $${item.cost.toLocaleString()}</div>` : ''}
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `).join('');

        modal.innerHTML = `
            <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-bg-ring/50 sticky top-0 bg-bg-soft z-10">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-white">Selecione o Equipamento para Vender</h2>
                            <p class="text-slate-400 mt-1">Escolha um equipamento do seu inventário</p>
                        </div>
                        <button data-action="close" class="text-slate-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="p-6">
                    ${categoriesHTML}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('[data-action="close"]').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelectorAll('[data-select-equipment]').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.selectEquipment;
                const itemData = inventory[itemId];
                modal.remove();
                this.openEquipmentSellModal(itemId, itemData, paisId);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
    * Modal de venda de equipamento específico
    */
    async openEquipmentSellModal(itemId, itemData, paisId) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.id = 'equipment-sell-modal';

        const suggestedPrice = itemData.cost || 100000;
        const minPrice = Math.round(suggestedPrice * 0.5);
        const maxPrice = Math.round(suggestedPrice * 3);

        modal.innerHTML = `
            <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-bg-ring/50 bg-gradient-to-r from-brand-500/10 to-brand-600/10">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                                <span class="text-3xl">${itemData.icon || '🚁'}</span>
                                Vender ${itemData.name || itemId}
                            </h2>
                            <p class="text-slate-400 mt-1 text-sm">Configure os detalhes da oferta</p>
                        </div>
                        <button data-action="close" class="text-slate-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <form id="equipment-sell-form" class="p-6 space-y-6">
                    <!-- Info do Equipamento -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-slate-400">Tipo:</span>
                                <span class="text-white font-semibold ml-2">${itemData.categoryId || itemData.type || 'Equipamento'}</span>
                            </div>
                            <div>
                                <span class="text-slate-400">Disponível:</span>
                                <span class="text-brand-400 font-semibold ml-2">${itemData.quantity} unidades</span>
                            </div>
                        </div>
                    </div>

                    <!-- Nome da Oferta -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                            🏷️ Nome do Equipamento na Oferta
                        </label>
                        <input type="text" id="equipment-display-name" name="displayName"
                               value="${itemData.itemName || itemData.name || itemId}" required
                               placeholder="Ex: T-34, Sherman M4, Spitfire Mk V..."
                               class="w-full rounded-lg bg-bg border border-bg-ring p-3 text-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400">
                        <div class="mt-2 text-xs text-slate-400">
                            💡 Personalize o nome do equipamento como ele aparecerá no mercado (ex: "T-34" ao invés de "MBT Genérico")
                        </div>
                    </div>

                    <!-- Quantidade -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                            📊 Quantidade
                        </label>
                        <input type="number" id="equipment-quantity" name="quantity"
                               min="1" max="${itemData.quantity}" value="1" required
                               class="w-full rounded-lg bg-bg border border-bg-ring p-3 text-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400">
                        <div class="flex justify-between mt-2 text-xs text-slate-400">
                            <span>Mínimo: 1</span>
                            <span>Máximo disponível: ${itemData.quantity}</span>
                        </div>
                    </div>

                    <!-- Preço -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                            💰 Preço por Unidade (USD)
                        </label>
                        <input type="number" id="equipment-price" name="price"
                               min="${minPrice}" max="${maxPrice}" value="${suggestedPrice}" required
                               class="w-full rounded-lg bg-bg border border-bg-ring p-3 text-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400">
                        <div class="flex gap-2 mt-3">
                            <button type="button" data-price="${minPrice}" class="flex-1 px-3 py-2 rounded-lg bg-bg border border-bg-ring text-xs hover:border-brand-400 transition-colors">
                                Baixo<br>$${minPrice.toLocaleString()}
                            </button>
                            <button type="button" data-price="${suggestedPrice}" class="flex-1 px-3 py-2 rounded-lg bg-bg border border-brand-400 text-xs hover:border-brand-500 transition-colors">
                                Mercado<br>$${suggestedPrice.toLocaleString()}
                            </button>
                            <button type="button" data-price="${maxPrice}" class="flex-1 px-3 py-2 rounded-lg bg-bg border border-bg-ring text-xs hover:border-brand-400 transition-colors">
                                Alto<br>$${maxPrice.toLocaleString()}
                            </button>
                        </div>
                    </div>

                    <!-- Resumo -->
                    <div class="bg-gradient-to-r from-brand-500/10 to-brand-600/10 rounded-lg p-5 border border-brand-500/30">
                        <div class="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">📋 Resumo da Oferta</div>
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-white" id="equipment-summary-total">$0</div>
                                <div class="text-xs text-slate-400 mt-1">Valor Total</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-white" id="equipment-summary-price">$0</div>
                                <div class="text-xs text-slate-400 mt-1">Preço Unitário</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-white" id="equipment-summary-quantity">0</div>
                                <div class="text-xs text-slate-400 mt-1">Quantidade</div>
                            </div>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div class="flex gap-3 pt-4 border-t border-bg-ring/50">
                        <button type="button" data-action="close" class="flex-1 px-6 py-3 rounded-lg border border-bg-ring text-slate-300 hover:text-white hover:border-slate-400 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" id="equipment-submit-btn" class="flex-1 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
                            ✨ Criar Oferta
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.currentModal = modal;

        // Event listeners
        const form = modal.querySelector('#equipment-sell-form');
        const quantityInput = modal.querySelector('#equipment-quantity');
        const priceInput = modal.querySelector('#equipment-price');

        // Atualizar resumo
        const updateSummary = () => {
            const quantity = parseInt(quantityInput.value) || 0;
            const price = parseInt(priceInput.value) || 0;
            const total = quantity * price;

            modal.querySelector('#equipment-summary-quantity').textContent = quantity;
            modal.querySelector('#equipment-summary-price').textContent = `$${price.toLocaleString()}`;
            modal.querySelector('#equipment-summary-total').textContent = `$${total.toLocaleString()}`;
        };

        quantityInput.addEventListener('input', updateSummary);
        priceInput.addEventListener('input', updateSummary);
        updateSummary();

        // Botões de preço sugerido
        modal.querySelectorAll('[data-price]').forEach(btn => {
            btn.addEventListener('click', () => {
                priceInput.value = btn.dataset.price;
                updateSummary();
            });
        });

        // Fechar modal
        modal.querySelectorAll('[data-action="close"]').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Submit
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleEquipmentSellSubmit(itemId, itemData, paisId, form);
        });
    }

    /**
    * Processar submit de venda de equipamento
    */
    async handleEquipmentSellSubmit(itemId, itemData, paisId, form) {
        const submitBtn = form.querySelector('#equipment-submit-btn');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Criando oferta...';

            const quantity = parseInt(form.quantity.value);
            const price = parseInt(form.price.value);
            const displayName = form.displayName.value.trim();

            // Buscar nome do país
            const countryDoc = await db.collection('paises').doc(paisId).get();
            const countryData = countryDoc.data();

            // Determinar categoria correta
            let category = itemData.category || 'vehicles';
            if (itemData.categoryId) {
                const catId = itemData.categoryId.toLowerCase();
                if (catId.includes('mbt') || catId.includes('tank') || catId.includes('vehicle')) {
                    category = 'vehicles';
                } else if (catId.includes('ship') || catId.includes('destroyer') || catId.includes('carrier') || catId.includes('naval')) {
                    category = 'naval';
                } else if (catId.includes('aircraft') || catId.includes('fighter') || catId.includes('bomber')) {
                    category = 'aircraft';
                }
            }

            // Criar oferta de equipamento
            const offerData = {
                type: 'sell',
                category: category,
                item_id: itemId,
                item_name: displayName || itemData.itemName || itemData.name || itemId,
                quantity: quantity,
                unit: 'unidade',
                price_per_unit: price,
                min_quantity: 1,
                max_quantity: quantity,
                delivery_time_days: 1,
                title: `${displayName} - ${quantity} unidade(s)`,
                description: `Venda de ${itemData.categoryId || itemData.type || 'equipamento'} do inventário`,
                country_id: paisId,
                country_name: countryData.Pais,
                player_id: auth.currentUser.uid
            };

            console.log('📤 Criando oferta de equipamento:', offerData);

            const result = await this.marketplaceSystem.createOffer(offerData);

            if (result.success) {
                submitBtn.textContent = '✅ Oferta criada!';
                submitBtn.classList.add('bg-green-600');

                setTimeout(() => {
                    this.closeModal();
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }

        } catch (error) {
            console.error('❌ Erro ao criar oferta:', error);
            submitBtn.textContent = '❌ Erro';
            submitBtn.classList.add('bg-red-600');
            alert(`Erro ao criar oferta: ${error.message}`);

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('bg-red-600');
                submitBtn.disabled = false;
            }, 3000);
        }
    }

    /**
    * Abrir modal de criação de oferta
    */
    async openCreateOfferModal(offerType, category = null, itemData = null) {
        this.currentOfferType = offerType;
        this.currentCategory = category;

        // Renderizar modal baseado no tipo
        if (offerType === 'sell' && category === 'resources') {
            this.currentModal = await this.renderResourceSellModal(itemData);
        } else if (offerType === 'sell' && (category === 'vehicles' || category === 'naval')) {
            // this.currentModal = await this.renderEquipmentSellModal(category, itemData);
            console.warn('Modal de venda de equipamento ainda não implementado.');
        } else if (offerType === 'buy') {
            // this.currentModal = await this.renderBuyModal(category);
            console.warn('Modal de compra ainda não implementado.');
        } else {
            // Fallback: modal genérico de seleção
            // this.currentModal = await this.renderSelectionModal();
            console.warn('Modal de seleção ainda não implementado.');
        }

        if (this.currentModal) {
            document.body.appendChild(this.currentModal);
            this.setupEventListeners();
        }
    }

    
    /**
    * Modal específico para VENDA DE RECURSOS
    */
    async renderResourceSellModal(resourceData) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4';
        modal.id = 'resource-sell-modal';

        // Obter recursos disponíveis
        const availableResources = await this.getAvailableResources();

        modal.innerHTML = `
<div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

<!-- Header -->
<div class="p-6 border-b border-bg-ring/50 bg-gradient-to-r from-brand-500/10 to-brand-600/10">
<div class="flex items-center justify-between">
<div>
<h2 class="text-2xl font-bold text-white flex items-center gap-3">
<span class="text-3xl">🔥</span>
Vender Recursos
</h2>
<p class="text-slate-400 mt-1 text-sm">
Venda seus recursos excedentes no mercado internacional
</p>
</div>
<button data-action="close" class="text-slate-400 hover:text-white transition-colors">
<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
</svg>
</button>
</div>
</div>

<form id="resource-sell-form" class="p-6 space-y-6">

<!-- Seleção de Recurso -->
<div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
<label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
📦 Recurso para Vender
</label>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
${availableResources.map(resource => `
<label class="relative flex items-center p-4 border-2 border-bg-ring rounded-lg cursor-pointer
hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
<input type="radio" name="resource" value="${resource.gameResourceId}"
data-market-type="${resource.defaultMarketType}"
data-unit="${resource.unit}"
data-available="${resource.available}"
class="peer sr-only" required>

<!-- Checkbox visual -->
<div class="w-5 h-5 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center
peer-checked:border-brand-400 peer-checked:bg-brand-400">
<svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 12 12">
<path d="M10 3L4.5 8.5L2 6"/>
</svg>
</div>

<!-- Info do recurso -->
<div class="flex-1">
<div class="font-medium text-white">${resource.displayName}</div>
<div class="text-xs text-slate-400 mt-0.5">
Disponível: <span class="text-brand-300 font-semibold">
${resource.available.toLocaleString()} ${resource.unit}
</span>
</div>
</div>

<!-- Badge de disponibilidade -->
<div class="absolute top-2 right-2">
${resource.available > 100000
? '<span class="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">Alto estoque</span>'
: resource.available > 10000
? '<span class="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Estoque médio</span>'
: '<span class="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full">Estoque baixo</span>'
}
</div>
</label>
`).join('')}
</div>

${availableResources.length === 0 ? `
<div class="text-center py-8 text-slate-400">
<div class="text-5xl mb-3">📭</div>
<p class="font-medium">Nenhum recurso disponível para venda</p>
<p class="text-sm mt-1">Você não possui recursos excedentes no momento</p>
</div>
` : ''}
</div>

<!-- Tipo de Produto (apenas se recurso tiver múltiplos tipos) -->
<div id="product-type-section" class="hidden bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
<label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
🏭 Tipo de Produto
</label>
<div id="product-type-options" class="space-y-2">
<!-- Populado dinamicamente quando recurso for selecionado -->
</div>
<p class="text-xs text-slate-400 mt-2">
💡 Produtos de maior qualidade têm preços mais altos no mercado
</p>
</div>

<!-- Quantidade e Preço -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-5">

<!-- Quantidade -->
<div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
<label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
📊 Quantidade
</label>

<div class="relative">
<input type="number" name="quantity" id="quantity-input"
min="1" step="1" placeholder="0" required
class="w-full px-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
focus:border-brand-400 focus:outline-none transition-colors">
<div id="quantity-unit" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
<!-- Unidade -->
</div>
</div>

<!-- Barra de progresso visual -->
<div class="mt-3">
<div class="flex justify-between text-xs text-slate-400 mb-1">
<span>0</span>
<span id="max-quantity-label">Máximo disponível</span>
</div>
<div class="h-2 bg-bg-ring rounded-full overflow-hidden">
<div id="quantity-progress" class="h-full bg-gradient-to-r from-brand-400 to-brand-500
transition-all duration-300" style="width: 0%"></div>
</div>
</div>

<!-- Feedback de validação -->
<div id="quantity-feedback" class="mt-2 text-sm hidden">
<!-- Mensagens dinâmicas -->
</div>

<!-- Sugestões rápidas -->
<div class="mt-3 flex flex-wrap gap-2">
<button type="button" data-quantity-preset="25"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
25%
</button>
<button type="button" data-quantity-preset="50"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
50%
</button>
<button type="button" data-quantity-preset="75"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
75%
</button>
<button type="button" data-quantity-preset="100"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
Tudo
</button>
</div>
</div>

<!-- Preço -->
<div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
<label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
💰 Preço por Unidade (USD)
</label>

<div class="relative">
<div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
<input type="number" name="price_per_unit" id="price-input"
min="0.01" step="0.01" placeholder="0.00" required
class="w-full pl-8 pr-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
focus:border-brand-400 focus:outline-none transition-colors">
</div>

<!-- Sugestão de preço -->
<div id="price-suggestion" class="mt-3 bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 hidden">
<div class="flex items-start gap-2">
<span class="text-blue-400">💡</span>
<div class="flex-1">
<div class="text-xs font-semibold text-blue-300 mb-1">Preço Sugerido</div>
<div class="flex items-center gap-2 text-sm">
<span class="text-slate-400">Faixa:</span>
<span class="text-white font-mono" id="price-range">$0 - $0</span>
</div>
</div>
</div>
</div>

<!-- Sugestões rápidas de preço -->
<div class="mt-3 flex flex-wrap gap-2">
<button type="button" data-price-preset="low"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
Baixo
</button>
<button type="button" data-price-preset="market"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
Mercado
</button>
<button type="button" data-price-preset="high"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
Alto
</button>
</div>
</div>
</div>

<!-- Resumo da Transação -->
<div id="transaction-summary" class="bg-gradient-to-br from-brand-500/10 to-brand-600/10
border-2 border-brand-400/30 rounded-lg p-5">
<h3 class="text-brand-300 font-bold mb-3 flex items-center gap-2">
<span>📊</span>
Resumo da Oferta
</h3>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
<div class="bg-bg/50 rounded-lg p-3">
<div class="text-xs text-slate-400 mb-1">Valor Total</div>
<div id="total-value" class="text-2xl font-bold text-white">$0</div>
</div>

<div class="bg-bg/50 rounded-lg p-3">
<div class="text-xs text-slate-400 mb-1">Valor por Unidade</div>
<div id="unit-value" class="text-xl font-semibold text-white">$0</div>
</div>

<div class="bg-bg/50 rounded-lg p-3">
<div class="text-xs text-slate-400 mb-1">Quantidade</div>
<div id="summary-quantity" class="text-xl font-semibold text-white">0</div>
</div>
</div>

<!-- Estimativa de lucro -->
<div class="mt-4 pt-4 border-t border-brand-400/20">
<div class="flex items-center justify-between text-sm">
<span class="text-slate-300">Comparado ao preço de mercado:</span>
<span id="profit-estimate" class="font-semibold">-</span>
</div>
</div>
</div>

<!-- Configurações Avançadas (Colapsável) -->
<details class="bg-bg/30 rounded-lg border border-bg-ring/50">
<summary class="p-4 cursor-pointer hover:bg-bg/50 transition-colors">
<span class="text-sm font-semibold text-slate-300 uppercase tracking-wide">
⚙️ Configurações Avançadas (Opcional)
</span>
</summary>

<div class="p-5 pt-0 space-y-4">
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="block text-sm text-slate-300 mb-2">
Quantidade Mínima por Pedido
</label>
<input type="number" name="min_quantity" min="1" placeholder="1"
class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
focus:border-brand-400 focus:outline-none">
<p class="text-xs text-slate-400 mt-1">
Compradores devem comprar pelo menos esta quantidade
</p>
</div>

<div>
<label class="block text-sm text-slate-300 mb-2">
Tempo de Entrega (dias)
</label>
<select name="delivery_time_days"
class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
focus:border-brand-400 focus:outline-none">
<option value="15">15 dias (Express)</option>
<option value="30" selected>30 dias (Padrão)</option>
<option value="45">45 dias</option>
<option value="60">60 dias</option>
</select>
</div>

<div>
<label class="block text-sm text-slate-300 mb-2">
Duração da Oferta
</label>
<select name="duration_days"
class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
focus:border-brand-400 focus:outline-none">
<option value="7">7 dias</option>
<option value="14" selected>14 dias</option>
<option value="21">21 dias</option>
<option value="30">30 dias</option>
</select>
</div>

<div>
<label class="block text-sm text-slate-300 mb-2">
Título Personalizado (Opcional)
</label>
<input type="text" name="custom_title" maxlength="100" placeholder="Auto-gerado"
class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
focus:border-brand-400 focus:outline-none">
<p class="text-xs text-slate-400 mt-1">
Deixe em branco para título automático
</p>
</div>
</div>
</div>
</details>

<!-- Botões de Ação -->
<div class="flex items-center gap-3 pt-4">
<button type="submit" id="submit-offer-btn"
class="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg
transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
🚀 Criar Oferta
</button>

<button type="button" data-action="close"
class="px-6 py-3 bg-bg-ring hover:bg-bg text-slate-300 font-semibold rounded-lg
transition-colors">
Cancelar
</button>
</div>

</form>
</div>
`;

        return modal;
    }

    /**
    * Obter recursos disponíveis para venda
    */
    async getAvailableResources() {
        const countryData = window.currentCountry;
        if (!countryData) return [];

        const resourceProduction = window.ResourceProductionCalculator.calculateCountryProduction(countryData);
        const resourceConsumption = window.ResourceConsumptionCalculator.calculateCountryConsumption(countryData);

        const resources = [];

        Object.entries(RESOURCE_MAPPING).forEach(([key, config]) => {
            const production = resourceProduction[key] || 0;
            const consumption = resourceConsumption[key] || 0;
            const balance = production - consumption;

            if (balance > 0) {
                resources.push({
                    gameResourceId: config.gameResourceId,
                    displayName: config.displayName,
                    unit: config.defaultUnit,
                    available: Math.round(balance),
                    defaultMarketType: config.marketTypes[0].id,
                    hasMultipleTypes: config.marketTypes.length > 1,
                    types: config.marketTypes
                });
            }
        });

        return resources;
    }

    /**
    * Configurar event listeners do modal
    */
    setupEventListeners() {
        if (!this.currentModal) return;

        // Fechar modal
        this.currentModal.querySelectorAll('[data-action="close"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Seleção de recurso
        this.currentModal.querySelectorAll('input[name="resource"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.onResourceSelected(e.target));
        });

        // Presets de quantidade
        this.currentModal.querySelectorAll('[data-quantity-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = parseInt(e.target.dataset.quantityPreset);
                this.applyQuantityPreset(preset);
            });
        });

        // Presets de preço
        this.currentModal.querySelectorAll('[data-price-preset]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.pricePreset;
                this.applyPricePreset(preset);
            });
        });

        // Validação em tempo real
        const quantityInput = this.currentModal.querySelector('#quantity-input');
        const priceInput = this.currentModal.querySelector('#price-input');

        quantityInput?.addEventListener('input', () => this.validateAndUpdateSummary());
        priceInput?.addEventListener('input', () => this.validateAndUpdateSummary());

        // Submit do formulário
        const form = this.currentModal.querySelector('form');
        form?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
    * Quando recurso é selecionado
    */
    onResourceSelected(radioElement) {
        const marketType = radioElement.dataset.marketType;
        const unit = radioElement.dataset.unit;
        const available = parseInt(radioElement.dataset.available);

        // Atualizar unidade exibida
        const unitDisplay = this.currentModal.querySelector('#quantity-unit');
        if (unitDisplay) unitDisplay.textContent = unit;

        // Atualizar máximo
        const quantityInput = this.currentModal.querySelector('#quantity-input');
        if (quantityInput) {
            quantityInput.max = available;
            quantityInput.setAttribute('data-available', available);
        }

        // Obter e exibir sugestão de preço
        const priceSuggestion = getSuggestedPrice(marketType, available);
        if (priceSuggestion) {
            const suggestionDiv = this.currentModal.querySelector('#price-suggestion');
            const rangeSpan = this.currentModal.querySelector('#price-range');

            if (suggestionDiv && rangeSpan) {
                suggestionDiv.classList.remove('hidden');
                rangeSpan.textContent = `${priceSuggestion.min} - ${priceSuggestion.max}`;

                // Armazenar para usar nos presets
                this.currentModal.setAttribute('data-price-low', priceSuggestion.min);
                this.currentModal.setAttribute('data-price-market', priceSuggestion.suggested);
                this.currentModal.setAttribute('data-price-high', priceSuggestion.max);
            }

            // Preencher automaticamente com preço sugerido
            const priceInput = this.currentModal.querySelector('#price-input');
            if (priceInput && !priceInput.value) {
                priceInput.value = priceSuggestion.suggested;
            }
        }

        this.validateAndUpdateSummary();
    }

    /**
    * Aplicar preset de quantidade
    */
    applyQuantityPreset(percentage) {
        const quantityInput = this.currentModal.querySelector('#quantity-input');
        const available = parseInt(quantityInput.getAttribute('data-available') || 0);

        const quantity = Math.floor(available * (percentage / 100));
        quantityInput.value = quantity;

        this.validateAndUpdateSummary();
    }

    /**
    * Aplicar preset de preço
    */
    applyPricePreset(preset) {
        const priceInput = this.currentModal.querySelector('#price-input');
        let price = 0;

        if (preset === 'low') {
            price = this.currentModal.getAttribute('data-price-low');
        } else if (preset === 'market') {
            price = this.currentModal.getAttribute('data-price-market');
        } else if (preset === 'high') {
            price = this.currentModal.getAttribute('data-price-high');
        }

        if (price) {
            priceInput.value = price;
            this.validateAndUpdateSummary();
        }
    }

    /**
    * Validar e atualizar resumo em tempo real
    */
    validateAndUpdateSummary() {
        const quantityInput = this.currentModal.querySelector('#quantity-input');
        const priceInput = this.currentModal.querySelector('#price-input');

        const quantity = parseInt(quantityInput?.value || 0);
        const pricePerUnit = parseFloat(priceInput?.value || 0);
        const available = parseInt(quantityInput?.getAttribute('data-available') || 0);

        // Validar quantidade
        const feedbackDiv = this.currentModal.querySelector('#quantity-feedback');
        const progressBar = this.currentModal.querySelector('#quantity-progress');

        if (quantity > 0) {
            const percentage = Math.min((quantity / available) * 100, 100);
            progressBar.style.width = `${percentage}%`;

            if (quantity > available) {
                feedbackDiv.className = 'mt-2 text-sm text-red-400';
                feedbackDiv.textContent = `❌ Quantidade excede o disponível (${available.toLocaleString()})`;
                feedbackDiv.classList.remove('hidden');
            } else {
                feedbackDiv.className = 'mt-2 text-sm text-green-400';
                feedbackDiv.textContent = `✅ Válido (${((quantity/available)*100).toFixed(1)}% do estoque)`;
                feedbackDiv.classList.remove('hidden');
            }
        } else {
            progressBar.style.width = '0%';
            feedbackDiv.classList.add('hidden');
        }

        // Atualizar resumo
        const totalValue = quantity * pricePerUnit;

        this.currentModal.querySelector('#total-value').textContent = `${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        this.currentModal.querySelector('#unit-value').textContent = `${pricePerUnit.toLocaleString('en-US', {minimumFractionDigits: 2})}`;
        this.currentModal.querySelector('#summary-quantity').textContent = quantity.toLocaleString();

        // Comparar com preço de mercado
        const marketPrice = parseFloat(this.currentModal.getAttribute('data-price-market') || 0);
        const profitEstimate = this.currentModal.querySelector('#profit-estimate');

        if (marketPrice > 0 && pricePerUnit > 0) {
            const diff = ((pricePerUnit - marketPrice) / marketPrice) * 100;

            if (diff > 5) {
                profitEstimate.className = 'font-semibold text-green-400';
                profitEstimate.textContent = `+${diff.toFixed(1)}% acima do mercado`;
            } else if (diff < -5) {
                profitEstimate.className = 'font-semibold text-red-400';
                profitEstimate.textContent = `${diff.toFixed(1)}% abaixo do mercado`;
            } else {
                profitEstimate.className = 'font-semibold text-yellow-400';
                profitEstimate.textContent = `≈ Preço de mercado`;
            }
        }
    }

    /**
    * Submeter formulário
    */
    async handleSubmit(event) {
        event.preventDefault();

        const form = event.target;
        const submitBtn = this.currentModal.querySelector('#submit-offer-btn');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = '⏳ Criando oferta...';

            const formData = new FormData(form);

            // Obter dados do recurso selecionado
            const selectedResource = form.querySelector('input[name="resource"]:checked');
            const marketType = selectedResource.dataset.marketType;
            const unit = selectedResource.dataset.unit;

            // Montar objeto de oferta
            const offerData = {
                type: 'sell',
                category: 'resources',
                item_id: marketType,  // ✅ AGORA USA O ID CORRETO!
                item_name: selectedResource.parentElement.querySelector('.font-medium').textContent,
                quantity: parseInt(formData.get('quantity')),
                unit: unit,
                price_per_unit: parseFloat(formData.get('price_per_unit')),
                min_quantity: parseInt(formData.get('min_quantity')) || 1,
                delivery_time_days: parseInt(formData.get('delivery_time_days')) || 30,
                duration_days: parseInt(formData.get('duration_days')) || 14,
                title: formData.get('custom_title') || null  // Auto-gera se vazio
            };

            // Auto-gerar título se não fornecido
            if (!offerData.title) {
                offerData.title = `${offerData.item_name} - ${offerData.quantity.toLocaleString()} ${unit}`;
            }

            console.log('📤 Enviando oferta:', offerData);

            // Criar oferta
            const result = await this.marketplaceSystem.createOffer(offerData);

            if (result.success) {
                submitBtn.textContent = '✅ Oferta criada!';
                submitBtn.classList.add('bg-green-600');

                setTimeout(() => {
                    this.closeModal();
                    window.location.reload(); // Ou atualizar lista de ofertas
                }, 1500);
            } else {
                throw new Error(result.error || 'Erro desconhecido');
            }

        } catch (error) {
            console.error('❌ Erro ao criar oferta:', error);

            submitBtn.textContent = '❌ Erro';
            submitBtn.classList.add('bg-red-600');

            alert(`Erro ao criar oferta: ${error.message}`);

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('bg-red-600');
                submitBtn.disabled = false;
            }, 3000);
        }
    }

    /**
    * Fechar modal
    */
    closeModal() {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

}