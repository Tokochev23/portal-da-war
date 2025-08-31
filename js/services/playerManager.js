import { auth, db } from './firebase.js';
import { realTimeUpdates } from './realTimeUpdates.js';
import { changeHistory } from './changeHistory.js';
import { showNotification, Logger, showConfirmBox } from '../utils.js';

/**
 * Serviço de Gerenciamento de Jogadores
 * Gerencia atribuições de países, comunicações e analytics de jogadores
 */
export class PlayerManagerService {
    constructor() {
        this.players = [];
        this.countries = [];
        this.listeners = new Map();
    }

    /**
     * Carrega todos os jogadores do sistema
     */
    async loadPlayers() {
        try {
            const snapshot = await db.collection('usuarios').get();
            this.players = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                lastLogin: doc.data().ultimoLogin?.toDate(),
                createdAt: doc.data().criadoEm?.toDate()
            }));

            Logger.debug(`${this.players.length} jogadores carregados`);
            return this.players;

        } catch (error) {
            Logger.error('Erro ao carregar jogadores:', error);
            throw error;
        }
    }

    /**
     * Carrega todos os países
     */
    async loadCountries() {
        try {
            const snapshot = await db.collection('paises').get();
            this.countries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            Logger.debug(`${this.countries.length} países carregados`);
            return this.countries;

        } catch (error) {
            Logger.error('Erro ao carregar países:', error);
            throw error;
        }
    }

    /**
     * Atribui um país a um jogador
     */
    async assignCountryToPlayer(playerId, countryId, reason = null) {
        try {
            const player = this.players.find(p => p.id === playerId);
            const country = this.countries.find(c => c.id === countryId);

            if (!player) throw new Error('Jogador não encontrado');
            if (!country) throw new Error('País não encontrado');

            // Verificar se país já tem jogador
            if (country.Player && country.Player !== playerId) {
                const currentPlayer = this.players.find(p => p.id === country.Player);
                const confirmed = await showConfirmBox(
                    'País já Atribuído',
                    `O país ${country.Pais} já está atribuído a ${currentPlayer?.nome}. Deseja transferir?`,
                    'Transferir',
                    'Cancelar'
                );

                if (!confirmed) return false;
            }

            // Usar transação para garantir consistência
            await db.runTransaction(async (transaction) => {
                const countryRef = db.collection('paises').doc(countryId);
                const playerRef = db.collection('usuarios').doc(playerId);

                // Atualizar país
                transaction.update(countryRef, {
                    Player: playerId,
                    DataVinculacao: firebase.firestore.Timestamp.now()
                });

                // Atualizar usuário
                transaction.update(playerRef, {
                    paisId: countryId,
                    ultimaAtualizacao: firebase.firestore.Timestamp.now()
                });
            });

            // Registrar no histórico
            await changeHistory.recordChange({
                countryId,
                section: 'sistema',
                field: 'Player',
                oldValue: country.Player || null,
                newValue: playerId,
                reason: reason || 'Atribuição de país via narrador'
            });

            showNotification('success', `País ${country.Pais} atribuído a ${player.nome}`);
            Logger.info(`País ${countryId} atribuído ao jogador ${playerId}`);

            // Atualizar dados locais
            const countryIndex = this.countries.findIndex(c => c.id === countryId);
            if (countryIndex >= 0) {
                this.countries[countryIndex].Player = playerId;
                this.countries[countryIndex].DataVinculacao = new Date();
            }

            return true;

        } catch (error) {
            Logger.error('Erro na atribuição:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    /**
     * Remove atribuição de um país
     */
    async unassignCountry(countryId, reason = null) {
        try {
            const country = this.countries.find(c => c.id === countryId);
            if (!country) throw new Error('País não encontrado');

            const oldPlayerId = country.Player;
            if (!oldPlayerId) {
                showNotification('info', 'País já não tem jogador atribuído');
                return false;
            }

            const player = this.players.find(p => p.id === oldPlayerId);

            const confirmed = await showConfirmBox(
                'Confirmar Remoção',
                `Tem certeza que deseja remover ${player?.nome || 'jogador'} do país ${country.Pais}?`,
                'Remover',
                'Cancelar'
            );

            if (!confirmed) return false;

            // Usar transação
            await db.runTransaction(async (transaction) => {
                const countryRef = db.collection('paises').doc(countryId);
                const playerRef = db.collection('usuarios').doc(oldPlayerId);

                // Remover do país
                transaction.update(countryRef, {
                    Player: firebase.firestore.FieldValue.delete(),
                    DataVinculacao: firebase.firestore.FieldValue.delete()
                });

                // Atualizar usuário
                transaction.update(playerRef, {
                    paisId: firebase.firestore.FieldValue.delete(),
                    ultimaAtualizacao: firebase.firestore.Timestamp.now()
                });
            });

            // Registrar no histórico
            await changeHistory.recordChange({
                countryId,
                section: 'sistema',
                field: 'Player',
                oldValue: oldPlayerId,
                newValue: null,
                reason: reason || 'Remoção de atribuição via narrador'
            });

            showNotification('success', `Atribuição removida: ${country.Pais}`);
            Logger.info(`País ${countryId} desvinculado do jogador ${oldPlayerId}`);

            // Atualizar dados locais
            const countryIndex = this.countries.findIndex(c => c.id === countryId);
            if (countryIndex >= 0) {
                delete this.countries[countryIndex].Player;
                delete this.countries[countryIndex].DataVinculacao;
            }

            return true;

        } catch (error) {
            Logger.error('Erro na remoção:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    /**
     * Atribuição aleatória de países disponíveis
     */
    async assignRandomCountries(maxAssignments = null) {
        try {
            const availableCountries = this.countries.filter(c => !c.Player);
            const playersWithoutCountries = this.players.filter(p => 
                p.papel !== 'admin' && p.papel !== 'narrador' && !p.paisId
            );

            if (availableCountries.length === 0) {
                showNotification('warning', 'Nenhum país disponível');
                return;
            }

            if (playersWithoutCountries.length === 0) {
                showNotification('warning', 'Nenhum jogador sem país');
                return;
            }

            const assignmentsToMake = Math.min(
                availableCountries.length,
                playersWithoutCountries.length,
                maxAssignments || Infinity
            );

            const confirmed = await showConfirmBox(
                'Atribuição Aleatória',
                `Atribuir aleatoriamente ${assignmentsToMake} países a jogadores sem país?`,
                'Sim, Atribuir',
                'Cancelar'
            );

            if (!confirmed) return;

            // Embaralhar arrays
            const shuffledCountries = this.shuffleArray([...availableCountries]);
            const shuffledPlayers = this.shuffleArray([...playersWithoutCountries]);

            const assignments = [];
            for (let i = 0; i < assignmentsToMake; i++) {
                assignments.push({
                    playerId: shuffledPlayers[i].id,
                    countryId: shuffledCountries[i].id,
                    playerName: shuffledPlayers[i].nome,
                    countryName: shuffledCountries[i].Pais
                });
            }

            // Executar atribuições em lote
            const results = [];
            for (const assignment of assignments) {
                try {
                    await this.assignCountryToPlayer(
                        assignment.playerId,
                        assignment.countryId,
                        'Atribuição aleatória automática'
                    );
                    results.push({ ...assignment, success: true });
                } catch (error) {
                    results.push({ ...assignment, success: false, error: error.message });
                }
            }

            const successful = results.filter(r => r.success).length;
            showNotification('success', 
                `Atribuição aleatória concluída: ${successful}/${assignmentsToMake} sucessos`);

            return results;

        } catch (error) {
            Logger.error('Erro na atribuição aleatória:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    /**
     * Remove todas as atribuições
     */
    async clearAllAssignments() {
        try {
            const assignedCountries = this.countries.filter(c => c.Player);
            
            if (assignedCountries.length === 0) {
                showNotification('info', 'Nenhuma atribuição para remover');
                return;
            }

            const confirmed = await showConfirmBox(
                'ATENÇÃO: Limpar Todas Atribuições',
                `Isso removerá TODAS as ${assignedCountries.length} atribuições de países. Esta ação não pode ser desfeita facilmente.`,
                'Sim, Limpar Tudo',
                'Cancelar'
            );

            if (!confirmed) return;

            // Confirmar novamente para operação crítica
            const doubleConfirmed = await showConfirmBox(
                'Confirmação Final',
                'Tem ABSOLUTA CERTEZA? Todos os jogadores perderão seus países.',
                'CONFIRMAR LIMPEZA',
                'Cancelar'
            );

            if (!doubleConfirmed) return;

            const batch = db.batch();
            const changes = [];

            // Preparar updates em lote
            assignedCountries.forEach(country => {
                const countryRef = db.collection('paises').doc(country.id);
                batch.update(countryRef, {
                    Player: firebase.firestore.FieldValue.delete(),
                    DataVinculacao: firebase.firestore.FieldValue.delete()
                });

                if (country.Player) {
                    const playerRef = db.collection('usuarios').doc(country.Player);
                    batch.update(playerRef, {
                        paisId: firebase.firestore.FieldValue.delete(),
                        ultimaAtualizacao: firebase.firestore.Timestamp.now()
                    });

                    changes.push({
                        countryId: country.id,
                        section: 'sistema',
                        field: 'Player',
                        oldValue: country.Player,
                        newValue: null
                    });
                }
            });

            // Executar lote
            await batch.commit();

            // Registrar no histórico
            await changeHistory.recordBatchChanges(changes, 'Limpeza geral de atribuições');

            // Atualizar dados locais
            this.countries.forEach(country => {
                if (country.Player) {
                    delete country.Player;
                    delete country.DataVinculacao;
                }
            });

            showNotification('success', `${assignedCountries.length} atribuições removidas`);
            Logger.info('Todas as atribuições foram removidas');

        } catch (error) {
            Logger.error('Erro ao limpar atribuições:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    /**
     * Gera analytics de jogadores
     */
    getPlayerAnalytics() {
        const totalPlayers = this.players.length;
        const activePlayers = this.players.filter(p => p.paisId).length;
        const adminCount = this.players.filter(p => p.papel === 'admin').length;
        const narratorCount = this.players.filter(p => p.papel === 'narrador').length;
        
        const totalCountries = this.countries.length;
        const assignedCountries = this.countries.filter(c => c.Player).length;
        
        // Jogadores por última atividade
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentlyActive = this.players.filter(p => 
            p.lastLogin && p.lastLogin > oneDayAgo
        ).length;
        
        const weeklyActive = this.players.filter(p => 
            p.lastLogin && p.lastLogin > oneWeekAgo
        ).length;

        return {
            players: {
                total: totalPlayers,
                active: activePlayers,
                inactive: totalPlayers - activePlayers,
                admins: adminCount,
                narrators: narratorCount,
                recentlyActive,
                weeklyActive
            },
            countries: {
                total: totalCountries,
                assigned: assignedCountries,
                available: totalCountries - assignedCountries,
                assignmentRate: (assignedCountries / totalCountries * 100).toFixed(1)
            },
            assignments: this.countries
                .filter(c => c.Player)
                .map(c => {
                    const player = this.players.find(p => p.id === c.Player);
                    return {
                        countryId: c.id,
                        countryName: c.Pais,
                        playerId: c.Player,
                        playerName: player?.nome || 'Desconhecido',
                        assignedAt: c.DataVinculacao
                    };
                })
        };
    }

    /**
     * Envia anúncio para jogadores
     */
    async sendAnnouncement({ title, message, targetPlayers = 'all', priority = 'normal' }) {
        try {
            let recipients = [];

            switch (targetPlayers) {
                case 'all':
                    recipients = this.players.filter(p => p.papel !== 'admin');
                    break;
                case 'active':
                    recipients = this.players.filter(p => p.paisId && p.papel !== 'admin');
                    break;
                case 'inactive':
                    recipients = this.players.filter(p => !p.paisId && p.papel !== 'admin');
                    break;
                default:
                    if (Array.isArray(targetPlayers)) {
                        recipients = this.players.filter(p => targetPlayers.includes(p.id));
                    }
            }

            if (recipients.length === 0) {
                showNotification('warning', 'Nenhum destinatário encontrado');
                return;
            }

            const announcement = {
                title,
                message,
                sender: auth.currentUser?.uid,
                senderName: auth.currentUser?.displayName || 'Narrador',
                timestamp: firebase.firestore.Timestamp.now(),
                priority,
                read: false
            };

            // Salvar anúncio na coleção de notificações
            const batch = db.batch();
            
            recipients.forEach(player => {
                const notificationRef = db.collection('notifications').doc();
                batch.set(notificationRef, {
                    ...announcement,
                    userId: player.id
                });
            });

            await batch.commit();

            showNotification('success', `Anúncio enviado para ${recipients.length} jogadores`);
            Logger.info(`Anúncio enviado para ${recipients.length} jogadores`);

        } catch (error) {
            Logger.error('Erro ao enviar anúncio:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    // Métodos auxiliares
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Inicializa listeners em tempo real
     */
    setupRealTimeListeners() {
        // Listener para mudanças em usuários
        const usersUnsubscribe = db.collection('usuarios')
            .onSnapshot(snapshot => {
                this.players = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    lastLogin: doc.data().ultimoLogin?.toDate(),
                    createdAt: doc.data().criadoEm?.toDate()
                }));
                
                this.broadcastUpdate('players');
            });

        // Listener para mudanças em países (atribuições)
        const countriesUnsubscribe = db.collection('paises')
            .onSnapshot(snapshot => {
                this.countries = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                this.broadcastUpdate('countries');
            });

        this.listeners.set('users', usersUnsubscribe);
        this.listeners.set('countries', countriesUnsubscribe);
    }

    broadcastUpdate(type) {
        window.dispatchEvent(new CustomEvent('playerManager:update', {
            detail: { type, data: type === 'players' ? this.players : this.countries }
        }));
    }

    /**
     * Limpa listeners
     */
    cleanup() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners.clear();
    }
}

// Singleton para uso global
export const playerManager = new PlayerManagerService();
export default playerManager;