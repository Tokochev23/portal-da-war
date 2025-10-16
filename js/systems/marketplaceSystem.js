// js/systems/marketplaceSystem.js - Sistema de Marketplace Internacional

import { db, auth } from '../services/firebase.js';
import { checkPlayerCountry } from '../services/firebase.js';
import { getMarketTypeConfig, getGameResourceKey, RESOURCE_MAPPING } from '../data/resourceMapping.js';

export class MarketplaceSystem {
    constructor() {
        this.collections = {
            offers: 'marketplace_offers',
            transactions: 'marketplace_transactions',
            embargoes: 'marketplace_embargoes',
            orders: 'marketplace_orders'
        };
    }

    /**
     * Estrutura de dados para ofertas do marketplace
     * Coleção: marketplace_offers
     */
    getOfferSchema() {
        return {
            // Identificação
            id: 'string', // Auto-gerado pelo Firestore
            type: 'string', // 'sell' ou 'buy'
            category: 'string', // 'resources', 'vehicles', 'naval'

            // Informações da oferta
            title: 'string',
            description: 'string',
            item_id: 'string', // ID do item específico (ex: 'steel', 'mbt_modern', 'destroyer_standard')
            item_name: 'string', // Nome do item

            // Quantidade e preço
            quantity: 'number',
            unit: 'string', // 'toneladas', 'unidades', 'navios', etc.
            price_per_unit: 'number', // Preço em USD
            total_value: 'number', // quantity * price_per_unit

            // País vendedor/comprador
            country_id: 'string',
            country_name: 'string',
            country_flag: 'string',
            player_id: 'string', // UID do jogador

            // Status e controle
            status: 'string', // 'active', 'completed', 'cancelled', 'expired'
            created_at: 'timestamp',
            updated_at: 'timestamp',
            expires_at: 'timestamp',

            // Condições especiais
            min_quantity: 'number', // Quantidade mínima para compra (opcional)
            max_quantity: 'number', // Quantidade máxima por transação (opcional)
            delivery_time_days: 'number', // Tempo de entrega em dias

            // Metadados
            views: 'number', // Quantas vezes foi vista
            interested_countries: 'array', // Lista de países interessados

            // Filtros adicionais
            tech_level_required: 'number', // Nível tecnológico necessário (opcional)
            diplomatic_status_required: 'string' // 'neutral', 'friendly', 'allied' (opcional)
        };
    }

    /**
     * Estrutura de dados para transações
     * Coleção: marketplace_transactions
     */
    getTransactionSchema() {
        return {
            // Identificação
            id: 'string',
            offer_id: 'string', // Referência à oferta original

            // Partes envolvidas
            seller_country_id: 'string',
            seller_country_name: 'string',
            seller_player_id: 'string',
            buyer_country_id: 'string',
            buyer_country_name: 'string',
            buyer_player_id: 'string',

            // Detalhes da transação
            item_id: 'string',
            item_name: 'string',
            quantity: 'number',
            unit: 'string',
            price_per_unit: 'number',
            total_value: 'number',

            // Status e cronologia
            status: 'string', // 'pending', 'confirmed', 'processing', 'completed', 'cancelled'
            created_at: 'timestamp',
            confirmed_at: 'timestamp',
            completed_at: 'timestamp',
            delivery_deadline: 'timestamp',

            // Logs de status
            status_history: 'array', // [{status, timestamp, note}]

            // Informações de entrega
            delivery_time_days: 'number',
            delivery_status: 'string', // 'pending', 'in_transit', 'delivered'

            // Metadados
            negotiated_price: 'boolean', // Se o preço foi negociado
            original_price_per_unit: 'number', // Preço original da oferta
            discount_percent: 'number' // Desconto aplicado (se houver)
        };
    }

    /**
     * Estrutura de dados para embargos
     * Coleção: marketplace_embargoes
     */
    getEmbargoSchema() {
        return {
            // Identificação
            id: 'string',

            // Países envolvidos
            embargo_country_id: 'string', // País que aplica o embargo
            embargo_country_name: 'string',
            target_country_id: 'string', // País alvo do embargo
            target_country_name: 'string',

            // Configurações do embargo
            type: 'string', // 'full' (total), 'partial' (categorias específicas)
            categories_blocked: 'array', // ['resources', 'vehicles', 'naval'] ou empty para full
            reason: 'string', // Motivo do embargo

            // Cronologia
            created_at: 'timestamp',
            expires_at: 'timestamp', // null para indefinido

            // Status
            status: 'string', // 'active', 'expired', 'lifted'

            // Metadados
            created_by_player_id: 'string',
            notifications_sent: 'boolean'
        };
    }

    /**
     * Estrutura de dados para ordens automáticas/recorrentes
     * Coleção: marketplace_orders
     */
    getOrderSchema() {
        return {
            // Identificação
            id: 'string',

            // País e jogador
            country_id: 'string',
            country_name: 'string',
            player_id: 'string',

            // Configurações da ordem
            type: 'string', // 'buy' ou 'sell'
            item_id: 'string',
            item_name: 'string',
            category: 'string',

            // Parâmetros da ordem
            quantity: 'number',
            unit: 'string',
            max_price_per_unit: 'number', // Para ordens de compra
            min_price_per_unit: 'number', // Para ordens de venda

            // Configurações de recorrência
            is_recurring: 'boolean',
            recurrence_type: 'string', // 'weekly', 'monthly', 'quarterly'
            recurrence_interval: 'number', // A cada X semanas/meses
            max_executions: 'number', // Máximo de execuções (null = infinito)
            executions_count: 'number', // Quantas vezes já foi executada

            // Status e controle
            status: 'string', // 'active', 'paused', 'completed', 'cancelled'
            created_at: 'timestamp',
            last_execution: 'timestamp',
            next_execution: 'timestamp',

            // Condições de execução
            auto_execute: 'boolean', // Executar automaticamente quando encontrar correspondência
            require_confirmation: 'boolean', // Requer confirmação manual

            // Histórico
            execution_history: 'array' // [{timestamp, offer_id, transaction_id, status}]
        };
    }

    /**
     * Criar nova oferta no marketplace
     */
    async createOffer(offerData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            const countryId = await checkPlayerCountry(user.uid);
            if (!countryId) throw new Error('Jogador não associado a um país');

            // Validar dados da oferta
            const validatedOffer = await this.validateOfferData(offerData, countryId, user.uid);

            // Adicionar timestamps e metadados
            const completeOffer = {
                ...validatedOffer,
                country_id: countryId,
                player_id: user.uid,
                created_at: new Date(),
                updated_at: new Date(),
                expires_at: new Date(Date.now() + (validatedOffer.duration_days * 24 * 60 * 60 * 1000)),
                status: 'active',
                views: 0,
                interested_countries: []
            };

            // Salvar no Firestore
            const docRef = await db.collection(this.collections.offers).add(completeOffer);

            return {
                success: true,
                offerId: docRef.id,
                offer: { id: docRef.id, ...completeOffer }
            };

        } catch (error) {
            console.error('Erro ao criar oferta:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Validar dados da oferta antes de salvar
     */
    async validateOfferData(data, countryId, playerId) {
        // Validações básicas
        if (!data.type || !['sell', 'buy'].includes(data.type)) {
            throw new Error('Tipo de oferta inválido');
        }

        if (!data.category || !['resources', 'vehicles', 'naval'].includes(data.category)) {
            throw new Error('Categoria inválida');
        }

        if (!data.title || data.title.trim().length < 3) {
            throw new Error('Título deve ter pelo menos 3 caracteres');
        }

        if (!data.quantity || data.quantity <= 0) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        if (!data.price_per_unit || data.price_per_unit <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }

        // Obter dados do país
        const countryDoc = await db.collection('paises').doc(countryId).get();
        if (!countryDoc.exists) {
            throw new Error('País não encontrado');
        }

        const countryData = countryDoc.data();

        // Verificar se o país pode fazer esta oferta (orçamento, recursos, etc)
        if (data.type === 'sell') {
            // Para vendas, validar inventário real
            await this.validateSellOfferAvailability(data, countryId);
            await this.validateSellOffer(data, countryData);
        } else {
            await this.validateBuyOffer(data, countryData);
        }

        // Calcular valor total
        const total_value = data.quantity * data.price_per_unit;

        return {
            type: data.type,
            category: data.category,
            title: data.title.trim(),
            description: (data.description || '').trim(),
            item_id: data.item_id,
            item_name: data.item_name,
            quantity: data.quantity,
            unit: data.unit,
            price_per_unit: data.price_per_unit,
            total_value: total_value,
            country_name: countryData.Pais,
            country_flag: countryData.Flag || '🏳️',
            delivery_time_days: data.delivery_time_days || 30,
            min_quantity: data.min_quantity || 1,
            max_quantity: data.max_quantity || data.quantity,
            tech_level_required: data.tech_level_required || 0,
            duration_days: data.duration_days || 30
        };
    }

    /**
     * Validar oferta de venda
     */
    async validateSellOffer(data, countryData) {
        // Para ofertas de venda, verificar se o país tem os recursos/equipamentos
        if (data.category === 'resources') {
            // Verificar recursos disponíveis
            // TODO: Implementar verificação de inventário de recursos
        } else if (data.category === 'vehicles' || data.category === 'naval') {
            // Verificar equipamentos no inventário
            const inventoryDoc = await db.collection('inventory').doc(countryData.id || data.country_id).get();
            if (inventoryDoc.exists) {
                const inventory = inventoryDoc.data();
                // TODO: Verificar se tem quantidade suficiente do item
            }
        }
    }

    /**
     * Validar oferta de compra
     */
    async validateBuyOffer(data, countryData) {
        // Para ofertas de compra, verificar se o país tem orçamento suficiente
        const budget = this.calculateCountryBudget(countryData);
        const totalCost = data.quantity * data.price_per_unit;

        if (budget < totalCost) {
            throw new Error(`Orçamento insuficiente. Necessário: $${totalCost.toLocaleString()}, Disponível: $${budget.toLocaleString()}`);
        }
    }

    /**
     * Calcular orçamento do país (mesma fórmula do dashboard)
     */
    calculateCountryBudget(countryData) {
        const pibBruto = parseFloat(countryData.PIB) || 0;
        const burocracia = (parseFloat(countryData.Burocracia) || 0) / 100;
        const estabilidade = (parseFloat(countryData.Estabilidade) || 0) / 100;
        return pibBruto * 0.25 * burocracia * (estabilidade * 1.5);
    }

    /**
     * Buscar ofertas com filtros - Versão completamente sem índices
     */
    async getOffers(filters = {}) {
        try {
            const collectionRef = db.collection(this.collections.offers);
            let offers = [];
            let snapshot;

            // Abordagem completamente sem índices: buscar todos os documentos e filtrar no cliente
            try {
                console.info('🔍 Buscando ofertas usando filtragem client-side (sem índices)');
                snapshot = await collectionRef.get();
            } catch (getAllError) {
                console.warn('Falha ao buscar todos os documentos, tentando listagem:', getAllError);

                try {
                    // Fallback: tentar listar documentos se disponível
                    const docRefs = await collectionRef.listDocuments();
                    const docPromises = docRefs.slice(0, 100).map(ref => ref.get());
                    const docs = await Promise.all(docPromises);

                    // Criar um objeto snapshot mock
                    snapshot = {
                        docs: docs.filter(doc => doc.exists),
                        size: docs.filter(doc => doc.exists).length,
                        empty: docs.filter(doc => doc.exists).length === 0,
                        forEach: function(callback) {
                            this.docs.forEach(callback);
                        }
                    };
                } catch (listError) {
                    console.warn('Listagem de documentos falhou, retornando resultados vazios:', listError);

                    // Fallback final: retornar resultados vazios mas sistema funcionando
                    snapshot = {
                        docs: [],
                        size: 0,
                        empty: true,
                        forEach: function() {}
                    };
                }
            }

            // Processar todos os documentos e aplicar filtros client-side
            snapshot.forEach(doc => {
                const data = doc.data();

                // Filtro básico de status (sempre ativo)
                if (data.status !== 'active') {
                    return;
                }

                // Verificar se expirou (ignorar se expires_at for null/undefined)
                if (data.expires_at) {
                    const expiresAt = data.expires_at?.toDate ? data.expires_at.toDate() : new Date(data.expires_at);
                    if (expiresAt && expiresAt <= new Date()) {
                        return;
                    }
                }

                offers.push({
                    id: doc.id,
                    ...data
                });
            });

            // Aplicar todos os filtros client-side
            let filteredOffers = offers;

            // Filtros básicos
            if (filters.category && filters.category !== 'all') {
                filteredOffers = filteredOffers.filter(offer => offer.category === filters.category);
            }

            if (filters.type && filters.type !== 'all') {
                filteredOffers = filteredOffers.filter(offer => offer.type === filters.type);
            }

            if (filters.seller_id) {
                filteredOffers = filteredOffers.filter(offer => offer.seller_id === filters.seller_id);
            }

            if (filters.buyer_id) {
                filteredOffers = filteredOffers.filter(offer => offer.buyer_id === filters.buyer_id);
            }

            // Filtros de busca
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                filteredOffers = filteredOffers.filter(offer =>
                    (offer.title && offer.title.toLowerCase().includes(term)) ||
                    (offer.description && offer.description.toLowerCase().includes(term)) ||
                    (offer.item_name && offer.item_name.toLowerCase().includes(term)) ||
                    (offer.country_name && offer.country_name.toLowerCase().includes(term))
                );
            }

            // Filtros avançados de preço e quantidade
            if (filters.priceMin !== null && filters.priceMin !== undefined) {
                filteredOffers = filteredOffers.filter(offer => offer.price_per_unit >= filters.priceMin);
            }

            if (filters.priceMax !== null && filters.priceMax !== undefined) {
                filteredOffers = filteredOffers.filter(offer => offer.price_per_unit <= filters.priceMax);
            }

            if (filters.quantityMin !== null && filters.quantityMin !== undefined) {
                filteredOffers = filteredOffers.filter(offer => offer.quantity >= filters.quantityMin);
            }

            if (filters.quantityMax !== null && filters.quantityMax !== undefined) {
                filteredOffers = filteredOffers.filter(offer => offer.quantity <= filters.quantityMax);
            }

            // Ordenação client-side
            const orderBy = filters.orderBy || 'created_at';
            const orderDirection = filters.orderDirection || 'desc';

            filteredOffers.sort((a, b) => {
                let aVal = a[orderBy];
                let bVal = b[orderBy];

                // Converter datas se necessário
                if (orderBy.includes('_at') && aVal && bVal) {
                    aVal = aVal.toDate ? aVal.toDate() : new Date(aVal);
                    bVal = bVal.toDate ? bVal.toDate() : new Date(bVal);
                }

                // Converter para números se necessário
                if (typeof aVal === 'string' && !isNaN(aVal)) aVal = parseFloat(aVal);
                if (typeof bVal === 'string' && !isNaN(bVal)) bVal = parseFloat(bVal);

                if (orderDirection === 'desc') {
                    return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
                } else {
                    return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                }
            });

            // Filtros adicionais
            if (filters.countryFilter) {
                filteredOffers = filteredOffers.filter(offer => offer.country_id === filters.countryFilter);
            }

            if (filters.timeFilter !== null && filters.timeFilter !== undefined) {
                const now = new Date();
                const maxTime = new Date(now.getTime() + filters.timeFilter * 24 * 60 * 60 * 1000);
                filteredOffers = filteredOffers.filter(offer => {
                    const expiresAt = offer.expires_at?.toDate ? offer.expires_at.toDate() : new Date(offer.expires_at);
                    return expiresAt <= maxTime;
                });
            }

            // Verificar embargos
            filteredOffers = await this.filterEmbargoedOffers(filteredOffers, filters.current_country_id);

            // Aplicar limite final após toda a filtragem
            if (filters.limit && filteredOffers.length > filters.limit) {
                filteredOffers = filteredOffers.slice(0, filters.limit);
            }

            console.info(`✅ Ofertas filtradas: ${filteredOffers.length} encontradas usando filtragem client-side`);

            return {
                success: true,
                offers: filteredOffers,
                total: filteredOffers.length,
                totalCount: filteredOffers.length
            };

        } catch (error) {
            console.error('Erro ao buscar ofertas:', error);
            return {
                success: false,
                error: error.message,
                offers: []
            };
        }
    }

    /**
     * Filtrar ofertas baseado em embargos
     */
    async filterEmbargoedOffers(offers, currentCountryId) {
        if (!currentCountryId) return offers;

        try {
            // Buscar embargos ativos que afetam o país atual
            const embargoesSnapshot = await db.collection(this.collections.embargoes)
                .where('status', '==', 'active')
                .where('target_country_id', '==', currentCountryId)
                .get();

            const embargoes = [];
            embargoesSnapshot.forEach(doc => {
                embargoes.push(doc.data());
            });

            if (embargoes.length === 0) return offers;

            // Filtrar ofertas baseado nos embargos
            return offers.filter(offer => {
                const embargo = embargoes.find(e => e.embargo_country_id === offer.country_id);
                if (!embargo) return true;

                // Se é embargo total, bloquear tudo
                if (embargo.type === 'full') return false;

                // Se é embargo parcial, verificar categorias
                if (embargo.type === 'partial' && embargo.categories_blocked) {
                    return !embargo.categories_blocked.includes(offer.category);
                }

                return true;
            });

        } catch (error) {
            console.error('Erro ao verificar embargos:', error);
            return offers; // Em caso de erro, retornar ofertas sem filtro
        }
    }

    /**
     * Incrementar contador de visualizações
     */
    async incrementOfferViews(offerId) {
        try {
            const offerRef = db.collection(this.collections.offers).doc(offerId);
            const offerDoc = await offerRef.get();

            if (offerDoc.exists) {
                const currentViews = offerDoc.data().views || 0;
                await offerRef.update({
                    views: currentViews + 1,
                    updated_at: new Date()
                });
            }
        } catch (error) {
            console.error('Erro ao incrementar visualizações:', error);
        }
    }

    /**
     * Criar transação a partir de uma oferta
     */
    async createTransaction(offerId, buyerData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            const buyerCountryId = await checkPlayerCountry(user.uid);
            if (!buyerCountryId) throw new Error('Jogador não associado a um país');

            // Buscar oferta
            const offerDoc = await db.collection(this.collections.offers).doc(offerId).get();
            if (!offerDoc.exists) throw new Error('Oferta não encontrada');

            const offer = offerDoc.data();
            if (offer.status !== 'active') throw new Error('Oferta não está ativa');

            // Validar quantidade
            const quantity = buyerData.quantity || offer.quantity;
            if (quantity > offer.quantity) throw new Error('Quantidade solicitada excede disponível');
            if (quantity < offer.min_quantity) throw new Error(`Quantidade mínima: ${offer.min_quantity}`);
            if (quantity > offer.max_quantity) throw new Error(`Quantidade máxima: ${offer.max_quantity}`);

            // Buscar dados do comprador
            const buyerCountryDoc = await db.collection('paises').doc(buyerCountryId).get();
            const buyerCountryData = buyerCountryDoc.data();

            // Verificar orçamento
            const totalCost = quantity * offer.price_per_unit;
            const buyerBudget = this.calculateCountryBudget(buyerCountryData);
            if (buyerBudget < totalCost) {
                throw new Error('Orçamento insuficiente');
            }

            // Criar transação
            const transaction = {
                offer_id: offerId,
                seller_country_id: offer.country_id,
                seller_country_name: offer.country_name,
                seller_player_id: offer.player_id,
                buyer_country_id: buyerCountryId,
                buyer_country_name: buyerCountryData.Pais,
                buyer_player_id: user.uid,
                item_id: offer.item_id,
                item_name: offer.item_name,
                quantity: quantity,
                unit: offer.unit,
                price_per_unit: offer.price_per_unit,
                total_value: totalCost,
                status: 'pending',
                created_at: new Date(),
                delivery_deadline: new Date(Date.now() + (offer.delivery_time_days * 24 * 60 * 60 * 1000)),
                delivery_time_days: offer.delivery_time_days,
                delivery_status: 'pending',
                status_history: [{
                    status: 'pending',
                    timestamp: new Date(),
                    note: 'Transação criada'
                }],
                negotiated_price: false,
                original_price_per_unit: offer.price_per_unit,
                discount_percent: 0
            };

            const transactionRef = await db.collection(this.collections.transactions).add(transaction);

            // Atualizar oferta (reduzir quantidade disponível)
            await db.collection(this.collections.offers).doc(offerId).update({
                quantity: offer.quantity - quantity,
                updated_at: new Date(),
                status: offer.quantity - quantity === 0 ? 'completed' : 'active'
            });

            // TRANSFERIR RECURSOS IMEDIATAMENTE (comprou/vendeu = entregou)
            await this.transferResources(offer, quantity, offer.country_id, buyerCountryId);

            // Marcar transação como completada instantaneamente
            await transactionRef.update({
                status: 'completed',
                delivery_status: 'delivered',
                completed_at: new Date()
            });

            return {
                success: true,
                transactionId: transactionRef.id,
                transaction: { id: transactionRef.id, ...transaction, status: 'completed' }
            };

        } catch (error) {
            console.error('Erro ao criar transação:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Transferir recursos entre países (vendedor → comprador)
     */
    async transferResources(offer, quantity, sellerCountryId, buyerCountryId) {
        try {
            console.log(`🔄 Transferindo recursos: ${quantity} ${offer.unit} de ${offer.item_name}`);
            console.log(`   Vendedor: ${sellerCountryId}`);
            console.log(`   Comprador: ${buyerCountryId}`);

            // Mapear item_id para campo de recurso do país
            const resourceFieldMap = {
                'coal': 'Carvao',
                'oil': 'Combustivel',
                'metals': 'Metais',
                'food': 'Graos'
            };

            const resourceField = resourceFieldMap[offer.item_id];
            if (!resourceField) {
                console.warn(`⚠️ Item ${offer.item_id} não é um recurso transferível`);
                return;
            }

            // Buscar dados atuais dos países
            const sellerDoc = await db.collection('paises').doc(sellerCountryId).get();
            const buyerDoc = await db.collection('paises').doc(buyerCountryId).get();

            if (!sellerDoc.exists || !buyerDoc.exists) {
                throw new Error('País não encontrado');
            }

            const sellerData = sellerDoc.data();
            const buyerData = buyerDoc.data();

            // Recursos atuais
            const sellerCurrentAmount = parseFloat(sellerData[resourceField]) || 0;
            const buyerCurrentAmount = parseFloat(buyerData[resourceField]) || 0;

            // Calcular novos valores
            const sellerNewAmount = Math.max(0, sellerCurrentAmount - quantity);
            const buyerNewAmount = buyerCurrentAmount + quantity;

            console.log(`   ${resourceField} vendedor: ${sellerCurrentAmount} → ${sellerNewAmount}`);
            console.log(`   ${resourceField} comprador: ${buyerCurrentAmount} → ${buyerNewAmount}`);

            // Atualizar vendedor (remover recursos)
            await db.collection('paises').doc(sellerCountryId).update({
                [resourceField]: sellerNewAmount
            });

            // Atualizar comprador (adicionar recursos)
            await db.collection('paises').doc(buyerCountryId).update({
                [resourceField]: buyerNewAmount
            });

            console.log(`✅ Recursos transferidos com sucesso!`);

        } catch (error) {
            console.error('❌ Erro ao transferir recursos:', error);
            throw error;
        }
    }

    /**
     * Aplicar embargo entre países
     */
    async applyEmbargo(embargoData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Usuário não autenticado');

            const embargoCountryId = await checkPlayerCountry(user.uid);
            if (!embargoCountryId) throw new Error('Jogador não associado a um país');

            // Buscar dados do país que aplica o embargo
            const embargoCountryDoc = await db.collection('paises').doc(embargoCountryId).get();
            const embargoCountryData = embargoCountryDoc.data();

            // Buscar dados do país alvo
            const targetCountryDoc = await db.collection('paises').doc(embargoData.target_country_id).get();
            if (!targetCountryDoc.exists) throw new Error('País alvo não encontrado');
            const targetCountryData = targetCountryDoc.data();

            // Verificar se já existe embargo ativo
            const existingEmbargo = await db.collection(this.collections.embargoes)
                .where('embargo_country_id', '==', embargoCountryId)
                .where('target_country_id', '==', embargoData.target_country_id)
                .where('status', '==', 'active')
                .get();

            if (!existingEmbargo.empty) {
                throw new Error('Já existe um embargo ativo contra este país');
            }

            const embargo = {
                embargo_country_id: embargoCountryId,
                embargo_country_name: embargoCountryData.Pais,
                target_country_id: embargoData.target_country_id,
                target_country_name: targetCountryData.Pais,
                type: embargoData.type || 'full',
                categories_blocked: embargoData.categories_blocked || [],
                reason: embargoData.reason || 'Motivos diplomáticos',
                created_at: new Date(),
                expires_at: embargoData.expires_at || null,
                status: 'active',
                created_by_player_id: user.uid,
                notifications_sent: false
            };

            const embargoRef = await db.collection(this.collections.embargoes).add(embargo);

            // Send notification to target country
            await this.sendEmbargoNotification(embargo, embargoRef.id);

            return {
                success: true,
                embargoId: embargoRef.id,
                embargo: { id: embargoRef.id, ...embargo }
            };

        } catch (error) {
            console.error('Erro ao aplicar embargo:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Enviar notificação sobre embargo aplicado
     */
    async sendEmbargoNotification(embargoData, embargoId) {
        try {
            // Create notification document
            const notification = {
                type: 'embargo_applied',
                embargo_id: embargoId,
                target_country_id: embargoData.target_country_id,
                target_country_name: embargoData.target_country_name,
                embargo_country_id: embargoData.embargo_country_id,
                embargo_country_name: embargoData.embargo_country_name,
                embargo_type: embargoData.type,
                categories_blocked: embargoData.categories_blocked || [],
                reason: embargoData.reason,
                created_at: new Date(),
                read: false,
                expires_at: embargoData.expires_at,

                // Notification content
                title: `🚫 Embargo Aplicado por ${embargoData.embargo_country_name}`,
                message: this.getEmbargoNotificationMessage(embargoData),
                priority: 'high'
            };

            // Save notification
            await db.collection('notifications').add(notification);

            // Update embargo to mark notification as sent
            await db.collection(this.collections.embargoes).doc(embargoId).update({
                notifications_sent: true
            });

            console.log(`Notificação de embargo enviada para ${embargoData.target_country_name}`);

        } catch (error) {
            console.error('Erro ao enviar notificação de embargo:', error);
        }
    }

    /**
     * Gerar mensagem da notificação de embargo
     */
    getEmbargoNotificationMessage(embargoData) {
        const typeText = embargoData.type === 'full' ? 'total' : 'parcial';
        let message = `${embargoData.embargo_country_name} aplicou um embargo ${typeText} contra seu país.`;

        if (embargoData.type === 'partial' && embargoData.categories_blocked && embargoData.categories_blocked.length > 0) {
            const categoryNames = {
                resources: 'Recursos',
                vehicles: 'Veículos',
                naval: 'Naval'
            };

            const blockedNames = embargoData.categories_blocked.map(cat => categoryNames[cat] || cat);
            message += ` Categorias bloqueadas: ${blockedNames.join(', ')}.`;
        } else if (embargoData.type === 'full') {
            message += ' Todas as trocas comerciais estão bloqueadas.';
        }

        if (embargoData.reason && embargoData.reason !== 'Motivos diplomáticos') {
            message += ` Motivo: ${embargoData.reason}`;
        }

        if (embargoData.expires_at) {
            const expirationDate = new Date(embargoData.expires_at);
            const daysUntilExpiration = Math.ceil((expirationDate - new Date()) / (24 * 60 * 60 * 1000));
            message += ` O embargo expira em ${daysUntilExpiration} dias.`;
        } else {
            message += ' O embargo é por tempo indefinido.';
        }

        return message;
    }

    /**
     * Buscar notificações de embargo para um país
     */
    async getEmbargoNotifications(countryId, limit = 10) {
        try {
            const snapshot = await db.collection('notifications')
                .where('target_country_id', '==', countryId)
                .where('type', '==', 'embargo_applied')
                .orderBy('created_at', 'desc')
                .limit(limit)
                .get();

            const notifications = [];
            snapshot.forEach(doc => {
                notifications.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return {
                success: true,
                notifications
            };

        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
            return {
                success: false,
                error: error.message,
                notifications: []
            };
        }
    }

    /**
     * Marcar notificação como lida
     */
    async markNotificationAsRead(notificationId) {
        try {
            await db.collection('notifications').doc(notificationId).update({
                read: true,
                read_at: new Date()
            });

            return { success: true };

        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Obter inventário real do país para validação
     */
    async getCountryInventory(countryId) {
        try {
            const inventoryDoc = await db.collection('inventory').doc(countryId).get();
            return inventoryDoc.exists ? inventoryDoc.data() : {};
        } catch (error) {
            console.error('Erro ao buscar inventário:', error);
            return {};
        }
    }

    /**
     * Obter dados do país incluindo recursos
     */
    async getCountryData(countryId) {
        try {
            const countryDoc = await db.collection('paises').doc(countryId).get();
            return countryDoc.exists ? { id: countryId, ...countryDoc.data() } : null;
        } catch (error) {
            console.error('Erro ao buscar dados do país:', error);
            return null;
        }
    }

    /**
     * Calcular recursos disponíveis para venda
     */
    calculateAvailableResources(countryData) {
        console.log('🔍 Debug: Dados do país recebidos:', countryData);

        // USAR OS RECURSOS REAIS DO DASHBOARD - NÃO CÁLCULOS!
        // O país só pode vender o que realmente tem armazenado
        console.log('📊 Usando recursos REAIS do dashboard (não calculados)');

        // Verificar os valores reais dos recursos
        console.log('🔍 Recursos reais no país:');
        console.log('  - Carvao:', countryData.Carvao);
        console.log('  - Combustivel:', countryData.Combustivel);
        console.log('  - Metais:', countryData.Metais);
        console.log('  - Graos:', countryData.Graos);

        // Usar os valores REAIS dos recursos que o país tem
        // REGRA REMOVIDA: Agora permite vender 100% do estoque.
        const realResources = {
            Carvao: Math.max(0, Math.floor(parseFloat(countryData.Carvao) || 0)),
            Combustivel: Math.max(0, Math.floor(parseFloat(countryData.Combustivel) || 0)),
            Metais: Math.max(0, Math.floor(parseFloat(countryData.Metais) || 0)),
            Graos: Math.max(0, Math.floor(parseFloat(countryData.Graos) || 0))
            // Energia removida - não é comerciável
        };

        console.log('📦 Recursos REAIS disponíveis para venda (50% do estoque):', realResources);
        return realResources;
    }

    /**
     * Obter equipamentos disponíveis para venda do inventário
     */
    getAvailableEquipment(inventory) {
        const availableEquipment = [];

        Object.keys(inventory).forEach(category => {
            if (typeof inventory[category] === 'object' && inventory[category] !== null) {
                Object.keys(inventory[category]).forEach(equipmentName => {
                    const equipment = inventory[category][equipmentName];

                    if (equipment && typeof equipment === 'object' && equipment.quantity > 0) {
                        // REGRA REMOVIDA: Agora permite vender 100% do estoque.
                        const availableQuantity = equipment.quantity;

                        if (availableQuantity > 0) {
                            availableEquipment.push({
                                id: `${category}_${equipmentName}`.toLowerCase().replace(/\s+/g, '_'),
                                name: equipmentName,
                                category: category,
                                available_quantity: availableQuantity,
                                total_quantity: equipment.quantity,
                                unit_cost: equipment.cost || 0,
                                maintenance_cost: (equipment.cost || 0) * 0.05 || 0,
                                type: this.getEquipmentType(category)
                            });
                        }
                    }
                });
            }
        });

        return availableEquipment;
    }

    /**
     * Determinar tipo de equipamento baseado na categoria
     */
    getEquipmentType(category) {
        const navalCategories = ['Couraçados', 'Cruzadores', 'Destróieres', 'Fragatas', 'Corvetas', 'Submarinos', 'Porta-aviões', 'Patrulhas', 'Auxiliares', 'Naval - Outros'];

        if (navalCategories.includes(category)) {
            return 'naval';
        }

        return 'vehicles'; // Default para veículos
    }

    /**
     * Validar disponibilidade para oferta de venda
     */
    async validateSellOfferAvailability(offerData, countryId) {
        const countryData = await this.getCountryData(countryId);
        if (!countryData) {
            throw new Error('Dados do país não encontrados');
        }

        if (offerData.category === 'resources') {
            return this.validateResourceAvailability(offerData, countryData);
        } else {
            return this.validateEquipmentAvailability(offerData, countryId);
        }
    }

    /**
     * Validar disponibilidade de recursos
     * Usa o sistema de mapeamento unificado para validar corretamente
     */
    validateResourceAvailability(offerData, countryData) {
        console.log('🔍 Validando disponibilidade de recurso:', offerData.item_id);

        // Obter configuração do tipo de mercado usando o novo sistema de mapeamento
        const marketConfig = getMarketTypeConfig(offerData.item_id);

        if (!marketConfig) {
            console.error('❌ Tipo de recurso não reconhecido:', offerData.item_id);
            throw new Error(`Tipo de recurso não reconhecido: ${offerData.item_id}`);
        }

        console.log('✅ Configuração de mercado encontrada:', marketConfig);

        // Obter a chave do recurso no jogo (ex: 'Metais', 'Carvao')
        const gameResourceKey = getGameResourceKey(offerData.item_id);

        if (!gameResourceKey) {
            throw new Error(`Não foi possível mapear ${offerData.item_id} para recurso do jogo`);
        }

        console.log('📊 Recurso do jogo mapeado:', gameResourceKey);

        // Calcular excedente usando os calculadores do sistema
        // Verificar se os calculadores estão disponíveis
        if (!window.ResourceProductionCalculator || !window.ResourceConsumptionCalculator) {
            console.error('❌ Calculadores de recursos não encontrados');
            throw new Error('Sistema de cálculo de recursos não está disponível');
        }

        const resourceProduction = window.ResourceProductionCalculator.calculateCountryProduction(countryData);
        const resourceConsumption = window.ResourceConsumptionCalculator.calculateCountryConsumption(countryData);

        const production = resourceProduction[gameResourceKey] || 0;
        const consumption = resourceConsumption[gameResourceKey] || 0;
        const available = Math.max(0, Math.round(production - consumption));

        console.log(`📈 Produção de ${gameResourceKey}:`, production);
        console.log(`📉 Consumo de ${gameResourceKey}:`, consumption);
        console.log(`💰 Disponível para venda:`, available);

        if (offerData.quantity > available) {
            throw new Error(
                `Quantidade insuficiente. Disponível: ${available.toLocaleString()} ${marketConfig.defaultUnit} de ${marketConfig.displayName}`
            );
        }

        console.log('✅ Validação de recurso passou!');

        return {
            valid: true,
            available: available,
            resourceType: gameResourceKey,
            marketType: offerData.item_id,
            unit: marketConfig.defaultUnit
        };
    }

    /**
     * Validar disponibilidade de equipamentos
     */
    async validateEquipmentAvailability(offerData, countryId) {
        const inventory = await this.getCountryInventory(countryId);
        const availableEquipment = this.getAvailableEquipment(inventory);

        const equipment = availableEquipment.find(eq => eq.id === offerData.item_id);
        if (!equipment) {
            throw new Error(`Equipamento "${offerData.item_name}" não encontrado no inventário ou indisponível para venda`);
        }

        if (offerData.quantity > equipment.available_quantity) {
            throw new Error(`Quantidade insuficiente. Disponível para venda: ${equipment.available_quantity} de ${equipment.total_quantity} unidades totais`);
        }

        return {
            valid: true,
            equipment: equipment,
            availableQuantity: equipment.available_quantity,
            totalQuantity: equipment.total_quantity
        };
    }

    /**
     * Criar ofertas de teste para desenvolvimento
     */
    async createTestOffers() {
        try {
            console.log('🧪 Criando ofertas de teste...');

            const testOffers = [
                {
                    type: 'sell',
                    category: 'resources',
                    title: 'Aço de Alta Qualidade',
                    description: 'Aço especializado para construção naval e industrial',
                    item_id: 'steel_high_grade',
                    item_name: 'Aço de Alta Qualidade',
                    quantity: 5000,
                    unit: 'toneladas',
                    price_per_unit: 850,
                    total_value: 5000 * 850,
                    country_id: 'test_country_1',
                    country_name: 'Estados Unidos',
                    country_flag: '🇺🇸',
                    player_id: 'test_player_1',
                    status: 'active',
                    created_at: new Date(),
                    updated_at: new Date(),
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    delivery_time_days: 30,
                    min_quantity: 100,
                    max_quantity: 5000,
                    views: 23,
                    interested_countries: []
                },
                {
                    type: 'buy',
                    category: 'vehicles',
                    title: 'Tanques MBT Modernos',
                    description: 'Procurando tanques de batalha principais para modernização das forças armadas',
                    item_id: 'mbt_modern',
                    item_name: 'Tanque MBT Moderno',
                    quantity: 50,
                    unit: 'unidades',
                    price_per_unit: 2500000,
                    total_value: 50 * 2500000,
                    country_id: 'test_country_2',
                    country_name: 'Brasil',
                    country_flag: '🇧🇷',
                    player_id: 'test_player_2',
                    status: 'active',
                    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                    delivery_time_days: 45,
                    min_quantity: 5,
                    max_quantity: 50,
                    views: 45,
                    interested_countries: []
                },
                {
                    type: 'sell',
                    category: 'naval',
                    title: 'Destroyers Classe Fletcher',
                    description: 'Destroyers modernizados, prontos para serviço imediato',
                    item_id: 'destroyer_fletcher',
                    item_name: 'Destroyer Classe Fletcher',
                    quantity: 3,
                    unit: 'navios',
                    price_per_unit: 180000000,
                    total_value: 3 * 180000000,
                    country_id: 'test_country_3',
                    country_name: 'Reino Unido',
                    country_flag: '🇬🇧',
                    player_id: 'test_player_3',
                    status: 'active',
                    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    expires_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                    delivery_time_days: 60,
                    min_quantity: 1,
                    max_quantity: 3,
                    views: 67,
                    interested_countries: []
                },
                {
                    type: 'sell',
                    category: 'resources',
                    title: 'Petróleo Refinado',
                    description: 'Combustível de alta octanagem para aviação militar',
                    item_id: 'oil_aviation',
                    item_name: 'Petróleo de Aviação',
                    quantity: 10000,
                    unit: 'barris',
                    price_per_unit: 120,
                    total_value: 10000 * 120,
                    country_id: 'test_country_4',
                    country_name: 'Arábia Saudita',
                    country_flag: '🇸🇦',
                    player_id: 'test_player_4',
                    status: 'active',
                    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                    delivery_time_days: 15,
                    min_quantity: 500,
                    max_quantity: 10000,
                    views: 89,
                    interested_countries: []
                },
                {
                    type: 'buy',
                    category: 'naval',
                    title: 'Submarinos Diesel-Elétricos',
                    description: 'Necessitamos de submarinos para patrulha costeira',
                    item_id: 'submarine_diesel',
                    item_name: 'Submarino Diesel-Elétrico',
                    quantity: 2,
                    unit: 'submarinos',
                    price_per_unit: 45000000,
                    total_value: 2 * 45000000,
                    country_id: 'test_country_5',
                    country_name: 'Argentina',
                    country_flag: '🇦🇷',
                    player_id: 'test_player_5',
                    status: 'active',
                    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
                    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    delivery_time_days: 90,
                    min_quantity: 1,
                    max_quantity: 2,
                    views: 12,
                    interested_countries: []
                }
            ];

            for (const offer of testOffers) {
                await db.collection(this.collections.offers).add(offer);
            }

            console.log(`✅ ${testOffers.length} ofertas de teste criadas com sucesso!`);
            return { success: true, count: testOffers.length };

        } catch (error) {
            console.error('❌ Erro ao criar ofertas de teste:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Limpar todas as ofertas de teste
     */
    async clearTestOffers() {
        try {
            console.log('🗑️ Removendo ofertas de teste...');

            const snapshot = await db.collection(this.collections.offers)
                .where('player_id', '>=', 'test_player_')
                .where('player_id', '<', 'test_player_z')
                .get();

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();

            console.log(`✅ ${snapshot.docs.length} ofertas de teste removidas!`);
            return { success: true, count: snapshot.docs.length };

        } catch (error) {
            console.error('❌ Erro ao remover ofertas de teste:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cancela uma oferta de venda, restituindo os itens ao vendedor.
     * @param {string} offerId - O ID da oferta a ser cancelada.
     * @returns {Promise<{success: boolean, error?: string}>}
     */
    async cancelOffer(offerId) {
        const user = auth.currentUser;
        if (!user) {
            return { success: false, error: "Usuário não autenticado." };
        }

        const offerRef = db.collection(this.collections.offers).doc(offerId);

        try {
            await db.runTransaction(async (transaction) => {
                const offerDoc = await transaction.get(offerRef);

                if (!offerDoc.exists) {
                    throw new Error("Oferta não encontrada.");
                }

                const offerData = offerDoc.data();

                // Security check: only the owner can cancel
                if (offerData.player_id !== user.uid) {
                    throw new Error("Você não tem permissão para cancelar esta oferta.");
                }

                if (offerData.type !== 'sell') {
                    throw new Error("Apenas ofertas de venda podem ser canceladas.");
                }
                
                if (offerData.status !== 'active') {
                    throw new Error(`A oferta não está mais ativa (status: ${offerData.status}).`);
                }

                // Restore items/resources to the seller
                if (offerData.category === 'resources') {
                    const countryRef = db.collection('paises').doc(offerData.country_id);
                    const gameResourceKey = getGameResourceKey(offerData.item_id);
                    if (!gameResourceKey) {
                        throw new Error(`Mapeamento de recurso inválido para item: ${offerData.item_id}`);
                    }
                    
                    const countryDoc = await transaction.get(countryRef);
                    if(!countryDoc.exists) {
                        throw new Error("País do vendedor não encontrado.");
                    }
                    const countryData = countryDoc.data();
                    const currentAmount = countryData[gameResourceKey] || 0;

                    const updateData = {};
                    updateData[gameResourceKey] = currentAmount + offerData.quantity;
                    transaction.update(countryRef, updateData);

                } else if (offerData.category === 'vehicles' || offerData.category === 'naval') {
                    const inventoryRef = db.collection('inventory').doc(offerData.country_id);
                    const inventoryDoc = await transaction.get(inventoryRef);
                    
                    const itemCategory = offerData.category;
                    const itemName = offerData.item_name;

                    if (!inventoryDoc.exists) {
                        // If inventory doesn't exist, we can't increment, so we create it.
                        const newInventory = {
                            [itemCategory]: {
                                [itemName]: {
                                    quantity: offerData.quantity
                                }
                            }
                        };
                        transaction.set(inventoryRef, newInventory);
                    } else {
                        const inventoryData = inventoryDoc.data();
                        const currentQuantity = inventoryData[itemCategory]?.[itemName]?.quantity || 0;
                        const newQuantity = currentQuantity + offerData.quantity;

                        const inventoryPath = `${itemCategory}.${itemName}.quantity`;
                        transaction.update(inventoryRef, { [inventoryPath]: newQuantity });
                    }
                }

                // Update the offer status to 'cancelled'
                transaction.update(offerRef, {
                    status: 'cancelled',
                    updated_at: new Date()
                });
            });

            return { success: true };

        } catch (error) {
            console.error("Erro ao cancelar oferta:", error);
            return { success: false, error: error.message };
        }
    }
}

export default MarketplaceSystem;