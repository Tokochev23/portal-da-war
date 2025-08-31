import { auth, db } from './firebase.js';
import { changeHistory } from './changeHistory.js';
import { Logger, showNotification } from '../utils.js';

/**
 * Serviço de Atualizações em Tempo Real
 * Gerencia mudanças instantâneas com histórico e sincronização
 */
export class RealTimeUpdateService {
    constructor() {
        this.listeners = new Map();
        this.pendingChanges = new Map();
        this.isOnline = navigator.onLine;
        this.setupConnectionHandlers();
    }

    /**
     * Atualiza um campo específico em tempo real
     */
    async updateField({
        countryId,
        section,
        field,
        value,
        reason = null,
        broadcast = true,
        validate = true
    }) {
        try {
            // 1. Validação offline primeiro
            if (validate) {
                this.validateFieldValue(section, field, value);
            }

            // 2. Se offline, armazenar para sync posterior
            if (!this.isOnline) {
                return this.queueOfflineChange({ countryId, section, field, value, reason });
            }

            // 3. Buscar valor atual
            const currentData = await this.getCurrentFieldValue(countryId, section, field);
            
            // 4. Se valor não mudou, não fazer nada
            if (this.valuesEqual(currentData, value)) {
                Logger.debug('Valor não alterado, ignorando update');
                return false;
            }

            // 5. Aplicar mudança - direto no Firebase (sem histórico)
            Logger.info('Salvando diretamente no Firebase (histórico desabilitado)');
            await this.saveWithRetry(countryId, section, field, value);

            // 6. Broadcast local se solicitado
            if (broadcast) {
                this.broadcastLocalUpdate({
                    countryId,
                    section,
                    field,
                    oldValue: currentData,
                    newValue: value
                });
            }

            Logger.debug(`Campo atualizado em tempo real: ${countryId}.${section}.${field}`);
            return true;

        } catch (error) {
            Logger.error('Erro na atualização em tempo real:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    /**
     * Atualiza múltiplos campos de uma vez
     */
    async updateMultipleFields({
        countryId,
        section,
        fields, // { fieldName: newValue, ... }
        reason = null,
        broadcast = true
    }) {
        try {
            const updates = [];
            
            // Preparar todas as mudanças
            for (const [field, value] of Object.entries(fields)) {
                const currentValue = await this.getCurrentFieldValue(countryId, section, field);
                
                if (!this.valuesEqual(currentValue, value)) {
                    updates.push({
                        countryId,
                        section,
                        field,
                        oldValue: currentValue,
                        newValue: value
                    });
                }
            }

            if (updates.length === 0) {
                Logger.debug('Nenhuma mudança detectada');
                return false;
            }

            // Aplicar todas as mudanças diretamente (sem transação/histórico)
            await this.executeDirectUpdate(updates);

            if (broadcast) {
                updates.forEach(update => this.broadcastLocalUpdate(update));
            }

            showNotification('success', `${updates.length} campos atualizados`);
            return true;

        } catch (error) {
            Logger.error('Erro na atualização múltipla:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    /**
     * Aplica deltas em massa para múltiplos países
     */
    async applyMassDeltas({
        countryIds,
        deltas, // { section: { field: delta, ... }, ... }
        reason = 'Aplicação de deltas em massa'
    }) {
        try {
            const allChanges = [];
            
            // Para cada país
            for (const countryId of countryIds) {
                const countryDoc = await db.collection('paises').doc(countryId).get();
                if (!countryDoc.exists) continue;

                const countryData = countryDoc.data();

                // Para cada seção
                for (const [section, sectionDeltas] of Object.entries(deltas)) {
                    const sectionData = countryData[section] || {};

                    // Para cada campo
                    for (const [field, delta] of Object.entries(sectionDeltas)) {
                        if (delta === 0 || delta === null || delta === undefined) continue;

                        const oldValue = sectionData[field] || 0;
                        let newValue;

                        // Aplicar delta baseado no tipo
                        if (field === 'PIB' && typeof delta === 'number') {
                            // Delta percentual para PIB
                            newValue = oldValue * (1 + delta / 100);
                        } else if (typeof oldValue === 'number') {
                            // Delta absoluto para outros campos numéricos
                            newValue = oldValue + delta;
                        } else {
                            Logger.warn(`Campo ${field} não suporta delta, ignorando`);
                            continue;
                        }

                        // Aplicar limites se necessário
                        newValue = this.applyFieldLimits(section, field, newValue);

                        allChanges.push({
                            countryId,
                            section,
                            field,
                            oldValue,
                            newValue
                        });
                    }
                }
            }

            if (allChanges.length === 0) {
                showNotification('warning', 'Nenhuma mudança aplicável encontrada');
                return false;
            }

            // Aplicar todas as mudanças no Firebase primeiro
            await this.executeBatchUpdate(allChanges);

            // Tentar registrar no histórico (opcional)
            let batchId = null;
            try {
                batchId = await changeHistory.recordBatchChanges(allChanges, reason);
            } catch (historyError) {
                Logger.warn('Erro ao registrar deltas no histórico:', historyError.message);
                batchId = 'fallback_' + Date.now();
            }

            // Broadcast das mudanças
            allChanges.forEach(change => this.broadcastLocalUpdate(change));

            showNotification('success', 
                `Deltas aplicados: ${allChanges.length} mudanças em ${countryIds.length} países`);

            Logger.info(`Deltas em massa aplicados (Batch ID: ${batchId}):`, allChanges);
            return batchId;

        } catch (error) {
            Logger.error('Erro na aplicação de deltas em massa:', error);
            showNotification('error', `Erro nos deltas: ${error.message}`);
            throw error;
        }
    }

    /**
     * Subscreve a mudanças em tempo real de um país
     */
    subscribeToCountryChanges(countryId, callback) {
        const unsubscribe = db.collection('paises').doc(countryId)
            .onSnapshot(doc => {
                if (doc.exists) {
                    callback({
                        countryId,
                        data: doc.data(),
                        timestamp: new Date()
                    });
                }
            }, error => {
                Logger.error('Erro no listener de mudanças:', error);
            });

        this.listeners.set(`country_${countryId}`, unsubscribe);
        return unsubscribe;
    }

    /**
     * Subscreve ao histórico de mudanças
     */
    subscribeToHistory(filters, callback) {
        let query = db.collection('changeHistory');

        // Aplicar filtros
        if (filters.countryId) query = query.where('countryId', '==', filters.countryId);
        if (filters.section) query = query.where('section', '==', filters.section);
        if (filters.userId) query = query.where('userId', '==', filters.userId);

        // Ordenar por mais recente
        query = query.orderBy('timestamp', 'desc').limit(filters.limit || 50);

        const unsubscribe = query.onSnapshot(snapshot => {
            const changes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate()
            }));
            callback(changes);
        }, error => {
            Logger.error('Erro no listener de histórico:', error);
        });

        const listenerId = `history_${Date.now()}`;
        this.listeners.set(listenerId, unsubscribe);
        return { unsubscribe, listenerId };
    }

    /**
     * Remove listener específico
     */
    unsubscribe(listenerId) {
        const unsubscribe = this.listeners.get(listenerId);
        if (unsubscribe) {
            unsubscribe();
            this.listeners.delete(listenerId);
            return true;
        }
        return false;
    }

    /**
     * Remove todos os listeners
     */
    unsubscribeAll() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners.clear();
    }

    // Métodos auxiliares privados

    async getCurrentFieldValue(countryId, section, field) {
        const doc = await db.collection('paises').doc(countryId).get();
        if (!doc.exists) throw new Error(`País ${countryId} não encontrado`);
        
        const data = doc.data();
        return data[section]?.[field];
    }

    async executeTransactionalUpdate(updates, reason) {
        await db.runTransaction(async (transaction) => {
            // Agrupar por país
            const updatesByCountry = new Map();
            
            updates.forEach(update => {
                if (!updatesByCountry.has(update.countryId)) {
                    updatesByCountry.set(update.countryId, {});
                }
                
                const countryUpdates = updatesByCountry.get(update.countryId);
                if (!countryUpdates[update.section]) {
                    countryUpdates[update.section] = {};
                }
                
                countryUpdates[update.section][update.field] = update.newValue;
            });

            // Aplicar updates agrupados
            updatesByCountry.forEach((sectionUpdates, countryId) => {
                const countryRef = db.collection('paises').doc(countryId);
                const updateData = {};
                
                Object.entries(sectionUpdates).forEach(([section, fields]) => {
                    Object.entries(fields).forEach(([field, value]) => {
                        updateData[`${section}.${field}`] = value;
                    });
                    
                    // Metadata da seção
                    updateData[`${section}.lastModified`] = new Date();
                    updateData[`${section}.lastModifiedBy`] = auth.currentUser?.uid;
                });

                transaction.update(countryRef, updateData);
            });
        });

        // Tentar registrar no histórico (opcional se falhar)
        try {
            await changeHistory.recordBatchChanges(updates, reason);
        } catch (historyError) {
            Logger.warn('Erro ao registrar no histórico, continuando:', historyError.message);
        }
    }

    async executeBatchUpdate(changes) {
        const batch = db.batch();
        const updatesByCountry = new Map();
        
        // Agrupar mudanças por país
        changes.forEach(change => {
            if (!updatesByCountry.has(change.countryId)) {
                updatesByCountry.set(change.countryId, {});
            }
            
            const countryUpdates = updatesByCountry.get(change.countryId);
            if (!countryUpdates[change.section]) {
                countryUpdates[change.section] = {};
            }
            
            countryUpdates[change.section][change.field] = change.newValue;
        });

        // Aplicar updates em lote
        updatesByCountry.forEach((sectionUpdates, countryId) => {
            const countryRef = db.collection('paises').doc(countryId);
            const updateData = {};
            
            Object.entries(sectionUpdates).forEach(([section, fields]) => {
                Object.entries(fields).forEach(([field, value]) => {
                    updateData[`${section}.${field}`] = value;
                });
                
                updateData[`${section}.lastModified`] = new Date();
                updateData[`${section}.lastModifiedBy`] = auth.currentUser?.uid;
            });

            batch.update(countryRef, updateData);
        });

        await batch.commit();
    }

    validateFieldValue(section, field, value) {
        // Validações básicas de negócio
        if (field === 'PIB' && value < 0) {
            throw new Error('PIB não pode ser negativo');
        }
        if (field === 'Estabilidade' && (value < 0 || value > 100)) {
            throw new Error('Estabilidade deve estar entre 0 e 100');
        }
        if (field === 'Tecnologia' && (value < 0 || value > 100)) {
            throw new Error('Tecnologia deve estar entre 0 e 100');
        }
        if (field === 'Urbanizacao' && (value < 0 || value > 100)) {
            throw new Error('Urbanização deve estar entre 0 e 100');
        }
        if (field === 'Populacao' && value < 0) {
            throw new Error('População não pode ser negativa');
        }
    }

    applyFieldLimits(section, field, value) {
        // Aplicar limites automáticos
        if (field === 'Estabilidade' || field === 'Tecnologia' || field === 'Urbanizacao') {
            return Math.max(0, Math.min(100, value));
        }
        if (field === 'PIB' || field === 'Populacao') {
            return Math.max(0, value);
        }
        
        // Limites para campos militares (não negativos)
        if (section === 'exercito' || section === 'aeronautica' || section === 'marinha' || section === 'veiculos') {
            return Math.max(0, Math.floor(value));
        }
        
        return value;
    }

    valuesEqual(a, b) {
        if (a === b) return true;
        if (typeof a === 'number' && typeof b === 'number') {
            return Math.abs(a - b) < 0.001; // Tolerância para números decimais
        }
        return false;
    }

    broadcastLocalUpdate(changeData) {
        window.dispatchEvent(new CustomEvent('realtime:update', {
            detail: changeData
        }));
    }

    setupConnectionHandlers() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            Logger.info('Conexão restaurada, sincronizando mudanças offline');
            this.syncOfflineChanges();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            Logger.warn('Conexão perdida, mudanças serão enfileiradas');
        });
    }

    queueOfflineChange(changeData) {
        const key = `${changeData.countryId}.${changeData.section}.${changeData.field}`;
        this.pendingChanges.set(key, {
            ...changeData,
            timestamp: new Date()
        });
        
        showNotification('info', 'Mudança salva localmente (offline)');
        Logger.debug('Mudança enfileirada para sync:', changeData);
    }

    async syncOfflineChanges() {
        if (this.pendingChanges.size === 0) return;

        const changes = Array.from(this.pendingChanges.values());
        this.pendingChanges.clear();

        try {
            for (const change of changes) {
                await this.updateField({
                    ...change,
                    reason: `Sync offline: ${change.reason || 'Mudança feita offline'}`
                });
            }

            showNotification('success', `${changes.length} mudanças sincronizadas`);
            Logger.info(`${changes.length} mudanças offline sincronizadas`);

        } catch (error) {
            Logger.error('Erro na sincronização offline:', error);
            // Recolocar mudanças na fila
            changes.forEach(change => {
                const key = `${change.countryId}.${change.section}.${change.field}`;
                this.pendingChanges.set(key, change);
            });
        }
    }

    async executeDirectUpdate(updates) {
        for (const update of updates) {
            await this.saveWithRetry(
                update.countryId, 
                update.section, 
                update.field, 
                update.newValue
            );
        }
    }

    async saveWithRetry(countryId, section, field, value, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const updateData = {};
                updateData[`${section}.${field}`] = value;
                updateData[`${section}.lastModified`] = new Date();
                updateData[`${section}.lastModifiedBy`] = auth.currentUser?.uid;
                
                await db.collection('paises').doc(countryId).update(updateData);
                Logger.info(`Mudança salva (tentativa ${attempt}): ${countryId}.${section}.${field}`);
                return;
                
            } catch (error) {
                const isNetworkError = error.message.includes('ERR_BLOCKED_BY_CLIENT') || 
                                     error.code === 'unavailable' || 
                                     error.code === 'deadline-exceeded';
                
                if (isNetworkError && attempt < maxRetries) {
                    Logger.warn(`Tentativa ${attempt} falhou (rede), tentando novamente em ${attempt * 1000}ms...`);
                    await new Promise(resolve => setTimeout(resolve, attempt * 1000));
                } else {
                    Logger.error(`Falha após ${attempt} tentativas:`, error);
                    
                    // Se falhou, pelo menos fazer broadcast local para atualizar a UI
                    this.broadcastLocalUpdate({
                        countryId,
                        section,
                        field,
                        oldValue: null,
                        newValue: value
                    });
                    
                    showNotification('warning', 
                        'Conexão instável. A mudança pode não ter sido salva no servidor, mas foi aplicada localmente.');
                    throw error;
                }
            }
        }
    }
}

// Singleton para uso global
export const realTimeUpdates = new RealTimeUpdateService();
export default realTimeUpdates;