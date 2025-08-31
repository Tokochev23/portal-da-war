import { auth, db } from './firebase.js';
import { Logger, showNotification } from '../utils.js';

/**
 * Serviço de Histórico de Mudanças
 * Gerencia o registro, consulta e rollback de alterações em tempo real
 */
export class ChangeHistoryService {
    constructor() {
        this.batchQueue = [];
        this.batchTimer = null;
        this.batchDelay = 500; // 500ms para agrupar mudanças rápidas
    }

    /**
     * Registra uma mudança no histórico
     */
    async recordChange({
        countryId,
        section,
        field,
        oldValue,
        newValue,
        userId = null,
        userName = null,
        reason = null,
        metadata = {}
    }) {
        try {
            const user = auth.currentUser;
            if (!user && !userId) {
                throw new Error('Usuário não autenticado');
            }

            const changeRecord = {
                countryId: countryId,
                section: section,
                field: field,
                oldValue: this.sanitizeValue(oldValue),
                newValue: this.sanitizeValue(newValue),
                userId: userId || user.uid,
                userName: userName || user.displayName || 'Sistema',
                timestamp: firebase.firestore.Timestamp.now(),
                reason: reason,
                metadata: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    ...metadata
                },
                // Dados calculados
                changeType: this.getChangeType(oldValue, newValue),
                delta: this.calculateDelta(oldValue, newValue),
                severity: this.calculateSeverity(section, field, oldValue, newValue)
            };

            // Adicionar à fila de batch para otimizar escritas
            this.batchQueue.push(changeRecord);
            this.scheduleBatchWrite();

            Logger.debug('Mudança registrada:', changeRecord);
            return changeRecord;

        } catch (error) {
            Logger.error('Erro ao registrar mudança:', error);
            throw error;
        }
    }

    /**
     * Registra múltiplas mudanças em lote (para operações massa)
     */
    async recordBatchChanges(changes, reason = null) {
        try {
            const batch = db.batch();
            const timestamp = firebase.firestore.Timestamp.now();
            const user = auth.currentUser;
            
            const batchId = this.generateBatchId();
            
            changes.forEach(change => {
                const changeRecord = {
                    ...change,
                    batchId: batchId,
                    userId: user?.uid,
                    userName: user?.displayName || 'Sistema',
                    timestamp: timestamp,
                    reason: reason,
                    changeType: this.getChangeType(change.oldValue, change.newValue),
                    delta: this.calculateDelta(change.oldValue, change.newValue),
                    severity: this.calculateSeverity(change.section, change.field, change.oldValue, change.newValue)
                };

                const docRef = db.collection('changeHistory').doc();
                batch.set(docRef, changeRecord);
            });

            await batch.commit();
            Logger.info(`Lote de ${changes.length} mudanças registrado com ID: ${batchId}`);
            
            return batchId;

        } catch (error) {
            Logger.error('Erro ao registrar mudanças em lote:', error);
            throw error;
        }
    }

    /**
     * Aplica uma mudança em tempo real
     */
    async applyRealTimeChange({
        countryId,
        section,
        field,
        newValue,
        reason = null,
        skipHistory = false
    }) {
        try {
            // 1. Buscar valor atual
            const countryRef = db.collection('paises').doc(countryId);
            const countryDoc = await countryRef.get();
            
            if (!countryDoc.exists) {
                throw new Error(`País ${countryId} não encontrado`);
            }

            const countryData = countryDoc.data();
            const currentSectionData = countryData[section] || {};
            const oldValue = currentSectionData[field];

            // 2. Validar mudança
            this.validateChange(section, field, oldValue, newValue);

            // 3. Aplicar mudança no Firebase
            const updatePath = `${section}.${field}`;
            const updateData = {
                [updatePath]: newValue,
                [`${section}.lastModified`]: firebase.firestore.Timestamp.now(),
                [`${section}.lastModifiedBy`]: auth.currentUser?.uid
            };

            await countryRef.update(updateData);

            // 4. Registrar no histórico (se não for para pular)
            if (!skipHistory) {
                await this.recordChange({
                    countryId,
                    section,
                    field,
                    oldValue,
                    newValue,
                    reason
                });
            }

            // 5. Notificar mudança em tempo real
            this.broadcastChange({
                countryId,
                section,
                field,
                oldValue,
                newValue,
                timestamp: new Date()
            });

            Logger.info(`Mudança aplicada em tempo real: ${countryId}.${section}.${field}`);
            return true;

        } catch (error) {
            Logger.error('Erro ao aplicar mudança em tempo real:', error);
            showNotification('error', `Erro ao aplicar mudança: ${error.message}`);
            throw error;
        }
    }

    /**
     * Busca histórico de mudanças
     */
    async getChangeHistory({
        countryId = null,
        section = null,
        field = null,
        userId = null,
        startDate = null,
        endDate = null,
        limit = 50,
        orderBy = 'timestamp',
        orderDirection = 'desc'
    } = {}) {
        try {
            let query = db.collection('changeHistory');

            // Aplicar filtros
            if (countryId) query = query.where('countryId', '==', countryId);
            if (section) query = query.where('section', '==', section);
            if (field) query = query.where('field', '==', field);
            if (userId) query = query.where('userId', '==', userId);
            
            if (startDate) {
                query = query.where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(startDate));
            }
            if (endDate) {
                query = query.where('timestamp', '<=', firebase.firestore.Timestamp.fromDate(endDate));
            }

            // Ordenar e limitar
            query = query.orderBy(orderBy, orderDirection);
            if (limit) query = query.limit(limit);

            const snapshot = await query.get();
            const changes = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp.toDate()
            }));

            Logger.debug(`Histórico recuperado: ${changes.length} mudanças`);
            return changes;

        } catch (error) {
            Logger.error('Erro ao buscar histórico:', error);
            throw error;
        }
    }

    /**
     * Executa rollback de uma mudança específica
     */
    async rollbackChange(changeId, reason = null) {
        try {
            // 1. Buscar mudança original
            const changeDoc = await db.collection('changeHistory').doc(changeId).get();
            if (!changeDoc.exists) {
                throw new Error('Mudança não encontrada');
            }

            const changeData = changeDoc.data();
            const { countryId, section, field, oldValue, newValue } = changeData;

            // 2. Verificar se rollback é possível
            const currentCountryDoc = await db.collection('paises').doc(countryId).get();
            if (!currentCountryDoc.exists) {
                throw new Error('País não existe mais');
            }

            const currentData = currentCountryDoc.data();
            const currentValue = currentData[section]?.[field];

            // Verificar se o valor atual ainda é o mesmo da mudança (evitar conflitos)
            if (!this.valuesEqual(currentValue, newValue)) {
                throw new Error('O valor foi modificado após esta mudança. Rollback automático não é seguro.');
            }

            // 3. Aplicar rollback
            await this.applyRealTimeChange({
                countryId,
                section,
                field,
                newValue: oldValue,
                reason: `ROLLBACK: ${reason || 'Revertido pelo narrador'}`,
                skipHistory: false
            });

            // 4. Marcar mudança original como revertida
            await db.collection('changeHistory').doc(changeId).update({
                rolledBack: true,
                rollbackTimestamp: firebase.firestore.Timestamp.now(),
                rollbackUserId: auth.currentUser?.uid,
                rollbackReason: reason
            });

            showNotification('success', `Mudança revertida com sucesso`);
            Logger.info(`Rollback executado para mudança: ${changeId}`);

            return true;

        } catch (error) {
            Logger.error('Erro no rollback:', error);
            showNotification('error', `Erro no rollback: ${error.message}`);
            throw error;
        }
    }

    /**
     * Executa rollback de um lote de mudanças
     */
    async rollbackBatch(batchId, reason = null) {
        try {
            // Buscar todas as mudanças do lote
            const batchChanges = await db.collection('changeHistory')
                .where('batchId', '==', batchId)
                .where('rolledBack', '!=', true)
                .orderBy('timestamp', 'desc')
                .get();

            if (batchChanges.empty) {
                throw new Error('Nenhuma mudança encontrada para este lote');
            }

            const rollbackPromises = [];
            
            batchChanges.forEach(doc => {
                rollbackPromises.push(this.rollbackChange(doc.id, reason));
            });

            await Promise.all(rollbackPromises);
            
            showNotification('success', `Lote de ${rollbackPromises.length} mudanças revertido`);
            return true;

        } catch (error) {
            Logger.error('Erro no rollback do lote:', error);
            showNotification('error', `Erro no rollback do lote: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gera estatísticas do histórico
     */
    async getHistoryStats(countryId = null, days = 30) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            let query = db.collection('changeHistory')
                .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(startDate));
            
            if (countryId) {
                query = query.where('countryId', '==', countryId);
            }

            const snapshot = await query.get();
            const changes = snapshot.docs.map(doc => doc.data());

            // Calcular estatísticas
            const stats = {
                totalChanges: changes.length,
                bySection: {},
                byUser: {},
                bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
                dailyActivity: {},
                mostActiveFields: {},
                rollbackRate: 0
            };

            changes.forEach(change => {
                // Por seção
                if (!stats.bySection[change.section]) stats.bySection[change.section] = 0;
                stats.bySection[change.section]++;

                // Por usuário
                if (!stats.byUser[change.userName]) stats.byUser[change.userName] = 0;
                stats.byUser[change.userName]++;

                // Por severidade
                if (change.severity) stats.bySeverity[change.severity]++;

                // Atividade diária
                const day = change.timestamp.toDate().toISOString().split('T')[0];
                if (!stats.dailyActivity[day]) stats.dailyActivity[day] = 0;
                stats.dailyActivity[day]++;

                // Campos mais ativos
                const fieldKey = `${change.section}.${change.field}`;
                if (!stats.mostActiveFields[fieldKey]) stats.mostActiveFields[fieldKey] = 0;
                stats.mostActiveFields[fieldKey]++;

                // Taxa de rollback
                if (change.rolledBack) stats.rollbackRate++;
            });

            stats.rollbackRate = stats.totalChanges > 0 ? (stats.rollbackRate / stats.totalChanges * 100) : 0;

            return stats;

        } catch (error) {
            Logger.error('Erro ao gerar estatísticas:', error);
            throw error;
        }
    }

    // Métodos auxiliares privados
    sanitizeValue(value) {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object') return JSON.parse(JSON.stringify(value));
        return value;
    }

    getChangeType(oldValue, newValue) {
        if (oldValue === null || oldValue === undefined) return 'create';
        if (newValue === null || newValue === undefined) return 'delete';
        return 'update';
    }

    calculateDelta(oldValue, newValue) {
        if (typeof oldValue === 'number' && typeof newValue === 'number') {
            return {
                absolute: newValue - oldValue,
                percentage: oldValue !== 0 ? ((newValue - oldValue) / oldValue * 100) : null
            };
        }
        return null;
    }

    calculateSeverity(section, field, oldValue, newValue) {
        // Critérios de severidade baseados no impacto
        const criticalFields = ['PIB', 'Estabilidade', 'Populacao'];
        const highImpactSections = ['geral', 'exercito'];

        if (criticalFields.includes(field)) {
            const delta = this.calculateDelta(oldValue, newValue);
            if (delta && Math.abs(delta.percentage) > 50) return 'critical';
            if (delta && Math.abs(delta.percentage) > 20) return 'high';
            return 'medium';
        }

        if (highImpactSections.includes(section)) return 'medium';
        return 'low';
    }

    validateChange(section, field, oldValue, newValue) {
        // Validações básicas de negócio
        if (field === 'PIB' && newValue < 0) {
            throw new Error('PIB não pode ser negativo');
        }
        if (field === 'Estabilidade' && (newValue < 0 || newValue > 100)) {
            throw new Error('Estabilidade deve estar entre 0 e 100');
        }
        if (field === 'Populacao' && newValue < 0) {
            throw new Error('População não pode ser negativa');
        }
    }

    valuesEqual(a, b) {
        if (a === b) return true;
        if (typeof a === 'object' && typeof b === 'object') {
            return JSON.stringify(a) === JSON.stringify(b);
        }
        return false;
    }

    generateBatchId() {
        return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    scheduleBatchWrite() {
        if (this.batchTimer) clearTimeout(this.batchTimer);
        
        this.batchTimer = setTimeout(async () => {
            if (this.batchQueue.length === 0) return;
            
            try {
                const batch = db.batch();
                const currentQueue = [...this.batchQueue];
                this.batchQueue = [];

                currentQueue.forEach(record => {
                    const docRef = db.collection('changeHistory').doc();
                    batch.set(docRef, record);
                });

                await batch.commit();
                Logger.debug(`Lote de ${currentQueue.length} mudanças salvo no histórico`);

            } catch (error) {
                Logger.error('Erro ao salvar lote no histórico:', error);
                // Recolocar na fila em caso de erro
                this.batchQueue.unshift(...this.batchQueue);
            }
        }, this.batchDelay);
    }

    broadcastChange(changeData) {
        // Broadcast via Custom Events para componentes reagirem
        window.dispatchEvent(new CustomEvent('country:changed', {
            detail: changeData
        }));
    }
}

// Singleton para uso global
export const changeHistory = new ChangeHistoryService();
export default changeHistory;