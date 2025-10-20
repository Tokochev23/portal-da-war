/**
 * Province Service - Gerencia dados das províncias no Firebase
 * NOVO: Usa 1 único documento JSON para todas as províncias
 */

import { db } from './firebase.js';

export class ProvinceService {
    constructor() {
        // Em vez de coleção, usamos 1 documento específico
        this.docRef = db.collection('mapData').doc('worldMap');
    }

    /**
     * Obtém todas as províncias do documento único
     */
    async getAllProvinces() {
        try {
            const doc = await this.docRef.get();

            if (!doc.exists) {
                console.log('Documento do mapa não existe ainda, criando...');
                await this.docRef.set({
                    provinces: {},
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedBy: null
                });
                return {};
            }

            const data = doc.data();
            return data.provinces || {};
        } catch (error) {
            console.error('Erro ao buscar províncias:', error);
            return {};
        }
    }

    /**
     * Atualiza a cor de uma província
     * OTIMIZADO: Usa update com dot notation para só modificar 1 campo
     */
    async updateProvinceColor(provinceId, color, narratorId) {
        try {
            // Sanitizar ID para uso como chave Firestore (remover caracteres especiais)
            const sanitizedId = this.sanitizeProvinceId(provinceId);

            // Usar dot notation para atualizar apenas 1 campo dentro do objeto
            await this.docRef.update({
                [`provinces.${sanitizedId}`]: color,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdatedBy: narratorId
            });

            return true;
        } catch (error) {
            // Se documento não existe, criar
            if (error.code === 'not-found') {
                const sanitizedId = this.sanitizeProvinceId(provinceId);
                await this.docRef.set({
                    provinces: {
                        [sanitizedId]: color
                    },
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedBy: narratorId
                });
                return true;
            }

            console.error('Erro ao atualizar cor da província:', error);
            return false;
        }
    }

    /**
     * Atualiza múltiplas províncias de uma vez
     */
    async updateMultipleProvinces(updates) {
        try {
            const updateData = {
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdatedBy: updates[0]?.narratorId || null
            };

            // Adicionar cada província ao objeto de update
            updates.forEach(update => {
                const sanitizedId = this.sanitizeProvinceId(update.id);
                updateData[`provinces.${sanitizedId}`] = update.color;
            });

            await this.docRef.update(updateData);
            return true;
        } catch (error) {
            console.error('Erro ao atualizar múltiplas províncias:', error);
            return false;
        }
    }

    /**
     * Observa mudanças em tempo real no documento do mapa
     */
    onProvincesChange(callback) {
        return this.docRef.onSnapshot(doc => {
            if (!doc.exists) {
                console.log('Documento do mapa não existe');
                return;
            }

            const data = doc.data();
            const provinces = data.provinces || {};

            // Retornar todas as províncias como um objeto
            callback(provinces);
        }, error => {
            console.error('Erro no listener de províncias:', error);
        });
    }

    /**
     * Inicializa o documento do mapa se não existir
     */
    async initializeMap() {
        try {
            const doc = await this.docRef.get();

            if (!doc.exists) {
                await this.docRef.set({
                    provinces: {},
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                    lastUpdatedBy: null,
                    metadata: {
                        created: firebase.firestore.FieldValue.serverTimestamp(),
                        version: '1.0'
                    }
                });
                console.log('Mapa inicializado com sucesso');
            }

            return true;
        } catch (error) {
            console.error('Erro ao inicializar mapa:', error);
            return false;
        }
    }

    /**
     * Reseta todas as províncias para cor padrão
     * OTIMIZADO: 1 escrita apenas
     */
    async resetAllProvinces(defaultColor = '#d1d5db', narratorId) {
        try {
            await this.docRef.set({
                provinces: {},
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdatedBy: narratorId,
                metadata: {
                    lastReset: firebase.firestore.FieldValue.serverTimestamp(),
                    resetBy: narratorId
                }
            });

            return true;
        } catch (error) {
            console.error('Erro ao resetar províncias:', error);
            return false;
        }
    }

    /**
     * Exporta o mapa como JSON para backup
     */
    async exportMapAsJSON() {
        try {
            const provinces = await this.getAllProvinces();
            const exportData = {
                version: '1.0',
                exportDate: new Date().toISOString(),
                provinces: provinces
            };

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            console.error('Erro ao exportar mapa:', error);
            return null;
        }
    }

    /**
     * Importa mapa de um JSON
     */
    async importMapFromJSON(jsonString, narratorId) {
        try {
            const data = JSON.parse(jsonString);

            if (!data.provinces) {
                throw new Error('Formato de JSON inválido');
            }

            await this.docRef.set({
                provinces: data.provinces,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
                lastUpdatedBy: narratorId,
                metadata: {
                    imported: firebase.firestore.FieldValue.serverTimestamp(),
                    importedBy: narratorId,
                    originalExportDate: data.exportDate
                }
            });

            return true;
        } catch (error) {
            console.error('Erro ao importar mapa:', error);
            return false;
        }
    }

    /**
     * Sanitiza ID da província para uso como chave Firestore
     * Remove caracteres especiais que podem causar problemas
     */
    sanitizeProvinceId(id) {
        // Firestore não permite . ~ * / [ ] em chaves
        return String(id)
            .replace(/\./g, '_')
            .replace(/~/g, '_')
            .replace(/\*/g, '_')
            .replace(/\//g, '_')
            .replace(/\[/g, '_')
            .replace(/\]/g, '_');
    }

    /**
     * Obtém estatísticas do mapa
     */
    async getMapStats() {
        try {
            const provinces = await this.getAllProvinces();
            const provinceCount = Object.keys(provinces).length;

            // Contar cores únicas
            const colors = Object.values(provinces);
            const uniqueColors = new Set(colors);

            return {
                totalProvinces: provinceCount,
                paintedProvinces: provinceCount,
                uniqueColors: uniqueColors.size,
                colors: Array.from(uniqueColors)
            };
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            return null;
        }
    }
}

export const provinceService = new ProvinceService();
