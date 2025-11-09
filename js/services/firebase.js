import { showNotification, Logger, ValidationUtils, globalCache, Formatter } from "../utils.js";
import { FIREBASE_CONFIG, SECURITY_CONFIG } from "../config/firebase-config.js";

// Inicializa Firebase SDKs.
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";

// === INICIALIZAÇÃO SEGURA DO FIREBASE ===
let app, auth, db, storage, firebase;
let loginAttempts = new Map(); // Rate limiting por usuário

// Classe para tratamento centralizado de erros Firebase
class FirebaseErrorHandler {
    static getErrorMessage(error) {
        const errorMessages = {
            'auth/user-not-found': 'Usuário não encontrado. Verifique o email.',
            'auth/wrong-password': 'Senha incorreta. Tente novamente.',
            'auth/email-already-in-use': 'Este email já está em uso.',
            'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
            'auth/invalid-email': 'Email inválido. Verifique o formato.',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
            'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
            'permission-denied': 'Acesso negado. Verifique suas permissões.',
            'unavailable': 'Serviço temporariamente indisponível.',
            'cancelled': 'Operação cancelada.',
            'deadline-exceeded': 'Tempo limite excedido. Tente novamente.',
            'not-found': 'Documento não encontrado.',
            'already-exists': 'Documento já existe.',
            'resource-exhausted': 'Limite de requisições excedido.',
            'failed-precondition': 'Condição prévia falhou.',
            'aborted': 'Operação abortada.',
            'out-of-range': 'Valor fora do intervalo permitido.',
            'unimplemented': 'Funcionalidade não implementada.',
            'internal': 'Erro interno do servidor.',
            'data-loss': 'Perda de dados detectada.'
        };
        
        const code = error.code || error.message;
        return errorMessages[code] || `Erro: ${error.message || 'Erro desconhecido'}`;
    }
    
    static handleError(error, operation = 'operação') {
        const message = this.getErrorMessage(error);
        Logger.error(`Firebase ${operation} failed:`, error);
        showNotification('error', message, { duration: 6000 });
        return { success: false, error, message };
    }
}

// Rate limiting para login
function checkRateLimit(identifier) {
    const now = Date.now();
    const attempts = loginAttempts.get(identifier) || [];
    
    // Remove tentativas antigas (15 minutos)
    const recentAttempts = attempts.filter(time => now - time < SECURITY_CONFIG.rateLimiting.windowMs);
    
    if (recentAttempts.length >= SECURITY_CONFIG.maxLoginAttempts) {
        throw new Error('too-many-requests');
    }
    
    recentAttempts.push(now);
    loginAttempts.set(identifier, recentAttempts);
}

// Inicialização com tratamento de erro
try {
    firebase = window.firebase; // Capturar referência global
    app = firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    
    // Configurar persistência offline
    db.enablePersistence({ synchronizeTabs: true })
        .catch(err => Logger.warn('Não foi possível habilitar persistência:', err));
    
    Logger.info('Firebase inicializado com sucesso');
} catch (error) {
    Logger.error('Erro crítico ao inicializar Firebase:', error);
    showNotification('error', 'Erro crítico: Não foi possível conectar ao servidor. Recarregue a página.', { persistent: true });
}

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Tornar db acessível globalmente para scripts de console
window.db = db;
window.auth = auth;

export { app, auth, db, storage, googleProvider };

export async function signInWithGoogle() {
    try {
        checkRateLimit('google-login');
        
        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;
        
        // Validar dados do usuário
        if (!user.email || !ValidationUtils.isValidEmail(user.email)) {
            throw new Error('Email inválido recebido do Google');
        }
        
        await db.collection('usuarios').doc(user.uid).set({
            nome: ValidationUtils.sanitizeInput(user.displayName || 'Usuário', { maxLength: 100 }),
            email: user.email.toLowerCase(),
            photoURL: user.photoURL || null,
            papel: 'jogador',
            dataIngresso: firebase.firestore.Timestamp.now(),
            ultimoLogin: firebase.firestore.Timestamp.now(),
            ativo: true,
            versaoTermos: '1.0' // Para controle de aceitação de termos
        }, { merge: true });
        
        Logger.info('Login Google realizado com sucesso', { uid: user.uid, email: user.email });
        return { success: true, user };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'login com Google');
    }
}

export async function registerWithEmailPassword(email, password, displayName) {
    try {
        // Validações de entrada
        if (!ValidationUtils.isValidEmail(email)) {
            throw new Error('invalid-email');
        }
        
        if (!ValidationUtils.isStrongPassword(password)) {
            throw new Error('weak-password');
        }
        
        const sanitizedName = ValidationUtils.sanitizeInput(displayName, { maxLength: 100 });
        if (!sanitizedName || sanitizedName.length < 2) {
            throw new Error('Nome deve ter pelo menos 2 caracteres');
        }
        
        checkRateLimit(email.toLowerCase());
        
        const result = await auth.createUserWithEmailAndPassword(email.toLowerCase(), password);
        const user = result.user;
        
        await user.updateProfile({
            displayName: sanitizedName
        });
        
        await db.collection('usuarios').doc(user.uid).set({
            nome: sanitizedName,
            email: email.toLowerCase(),
            papel: 'jogador',
            dataIngresso: firebase.firestore.Timestamp.now(),
            ultimoLogin: firebase.firestore.Timestamp.now(),
            ativo: true,
            versaoTermos: '1.0',
            configuracoes: {
                notificacoes: true,
                tema: 'dark'
            }
        });
        
        Logger.info('Registro realizado com sucesso', { uid: user.uid, email: user.email });
        return { success: true, user };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'registro');
    }
}

export async function signInWithEmailPassword(email, password) {
    try {
        if (!ValidationUtils.isValidEmail(email)) {
            throw new Error('invalid-email');
        }
        
        if (!password || password.length < 6) {
            throw new Error('wrong-password');
        }
        
        checkRateLimit(email.toLowerCase());
        
        const result = await auth.signInWithEmailAndPassword(email.toLowerCase(), password);
        
        // Atualizar último login de forma segura
        try {
            await db.collection('usuarios').doc(result.user.uid).update({
                ultimoLogin: firebase.firestore.Timestamp.now()
            });
        } catch (updateError) {
            Logger.warn('Não foi possível atualizar último login:', updateError);
        }
        
        Logger.info('Login realizado com sucesso', { uid: result.user.uid, email: result.user.email });
        return { success: true, user: result.user };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'login');
    }
}

export async function vincularJogadorAoPais(userId, paisId) {
    if (!userId || !paisId) {
        const error = new Error('userId e paisId são obrigatórios');
        return FirebaseErrorHandler.handleError(error, 'vinculação jogador-país');
    }
    
    try {
        // Verificar se o país está disponível
        const paisDoc = await db.collection('paises').doc(paisId).get();
        if (!paisDoc.exists) {
            throw new Error('País não encontrado');
        }
        
        const paisData = paisDoc.data();
        if (paisData.Player) {
            throw new Error('País já possui um jogador');
        }
        
        // Usar transação para garantir consistência
        await db.runTransaction(async (transaction) => {
            // Atualizar país
            transaction.update(db.collection('paises').doc(paisId), {
                Player: userId,
                DataVinculacao: firebase.firestore.Timestamp.now()
            });
            
            // Atualizar usuário
            transaction.set(db.collection('usuarios').doc(userId), {
                paisId: paisId,
                papel: 'jogador',
                ultimaAtualizacao: firebase.firestore.Timestamp.now(),
                ativo: true
            }, { merge: true });
        });
        
        // Limpar cache relacionado
        globalCache.clear();
        
        Logger.info('Jogador vinculado ao país com sucesso', { userId, paisId });
        return { success: true };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'vinculação jogador-país');
    }
}

export async function checkUserPermissions(userId, useCache = true) {
    if (!userId) {
        Logger.warn('checkUserPermissions: userId é obrigatório');
        return { isNarrator: false, isAdmin: false, isPlayer: true };
    }
    
    const cacheKey = `permissions-${userId}`;
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug(`Permissões do usuário ${userId} carregadas do cache`);
                return cached;
            }
        }
        
        const userDoc = await db.collection('usuarios').doc(userId).get();
        
        let permissions = {
            isNarrator: false,
            isAdmin: false,
            isPlayer: true,
            role: 'jogador'
        };
        
        if (userDoc.exists) {
            const userData = userDoc.data();
            const role = userData.papel || 'jogador';
            
            permissions = {
                isNarrator: role === 'narrador' || role === 'admin',
                isAdmin: role === 'admin',
                isPlayer: role === 'jogador' || role === 'narrador' || role === 'admin',
                role: role,
                ativo: userData.ativo !== false
            };
        }
        
        // Cache por 10 minutos
        globalCache.set(cacheKey, permissions, 600000);
        
        Logger.debug(`Permissões verificadas para ${userId}:`, permissions);
        return permissions;
    } catch (error) {
        Logger.error('Erro ao verificar permissões:', error);
        return { isNarrator: false, isAdmin: false, isPlayer: true, role: 'jogador' };
    }
}

export async function checkPlayerCountry(userId, useCache = true) {
    if (!userId) {
        Logger.warn('checkPlayerCountry: userId é obrigatório');
        return null;
    }
    
    const cacheKey = `player-country-${userId}`;
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached !== null) {
                Logger.debug(`País do jogador ${userId} carregado do cache: ${cached}`);
                return cached;
            }
        }
        
        const userDoc = await db.collection('usuarios').doc(userId).get();
        
        let paisId = null;
        if (userDoc.exists) {
            const userData = userDoc.data();
            paisId = userData.paisId || null;
        }
        
        // Cache por 5 minutos
        globalCache.set(cacheKey, paisId, 300000);
        
        Logger.debug(`País do jogador ${userId}: ${paisId || 'nenhum'}`);
        return paisId;
    } catch (error) {
        Logger.error('Erro ao verificar país do jogador:', error);
        return null;
    }
}

export async function getAvailableCountries(useCache = true) {
    const cacheKey = 'available-countries';
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug('Países disponíveis carregados do cache');
                return cached;
            }
        }
        
        const paisesRef = db.collection('paises');
        const querySnapshot = await paisesRef
            .where('Player', 'in', [null, '', undefined])
            .get();
        
        const availableCountries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                Pais: ValidationUtils.sanitizeInput(data.Pais || '', { maxLength: 100 })
            };
        }).filter(country => {
            // Filtrar países com dados mínimos necessários
            return country.Pais && country.PIB !== undefined;
        });
        
        // Cache por 3 minutos
        globalCache.set(cacheKey, availableCountries, 180000);
        
        Logger.info(`${availableCountries.length} países disponíveis encontrados`);
        return availableCountries;
    } catch (error) {
        FirebaseErrorHandler.handleError(error, 'busca de países disponíveis');
        return [];
    }
}

export async function getAllCountries(useCache = true) {
    const cacheKey = 'all-countries';
    
    try {
        // Tentar buscar do cache primeiro
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug('Países carregados do cache');
                return cached;
            }
        }
        
        const paisesRef = db.collection('paises');
        const querySnapshot = await paisesRef.get();
        
        if (querySnapshot.empty) {
            Logger.warn('Nenhum país encontrado na coleção');
            return [];
        }
        
        const countries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const country = {
                id: doc.id,
                ...data,
                // Sanitizar dados sensíveis se necessário
                Pais: ValidationUtils.sanitizeInput(data.Pais || '', { maxLength: 100 }),
                PIB: Math.max(0, Formatter.parseNumber(data.PIB) || 0)
            };

            // Adicionar Carvao e PotencialCarvao se não existirem
            if (country.Carvao === undefined) {
                country.Carvao = 0;
            }
            if (country.PotencialCarvao === undefined) {
                // Definir valores padrão e específicos para alguns países
                switch (country.Pais) {
                    case 'Alemanha':
                        country.PotencialCarvao = 10;
                        break;
                    case 'Reino Unido':
                        country.PotencialCarvao = 9;
                        break;
                    case 'Brasil':
                        country.PotencialCarvao = 4;
                        break;
                    default:
                        country.PotencialCarvao = 5; // Valor padrão para outros países
                }
            }
            // Adicionar array para usinas de energia se não existir
            if (country.power_plants === undefined) {
                country.power_plants = [];
            }
            // Adicionar PotencialHidreletrico se não existir
            if (country.PotencialHidreletrico === undefined) {
                country.PotencialHidreletrico = 5; // Valor padrão
            }
            return country;
        });
        
        // Cachear resultado por 5 minutos
        globalCache.set(cacheKey, countries, 300000);
        
        Logger.info(`${countries.length} países carregados com sucesso`);
        return countries;
    } catch (error) {
        const result = FirebaseErrorHandler.handleError(error, 'carregamento de países');
        return [];
    }
}

export async function getCountryData(paisId, useCache = true) {
    if (!paisId) {
        Logger.warn('getCountryData: paisId é obrigatório');
        return null;
    }
    
    const cacheKey = `country-${paisId}`;
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug(`Dados do país ${paisId} carregados do cache`);
                return cached;
            }
        }
        
        const doc = await db.collection('paises').doc(paisId).get();
        
        if (!doc.exists) {
            Logger.warn(`País ${paisId} não encontrado`);
            return null;
        }
        
        const data = doc.data();
        
        // Validar e sanitizar dados
        const sanitizedData = {
            ...data,
            Pais: ValidationUtils.sanitizeInput(data.Pais || '', { maxLength: 100 }),
            // Normaliza números conforme dashboard
            PIB: Math.max(0, Formatter.parseNumber(data.PIB) || 0),
            Estabilidade: Math.max(0, Math.min(100, Formatter.parseNumber(data.Estabilidade) || 0)),
            // Techs do dashboard (podem vir como string com % ou número)
            Tecnologia: Math.max(0, Formatter.parseNumber(data.Tecnologia) || 0),
            Aeronautica: Math.max(0, Formatter.parseNumber(data.Aeronautica) || 0),
            Veiculos: Math.max(0, Formatter.parseNumber(data.Veiculos) || 0),
            Marinha: Math.max(0, Formatter.parseNumber(data.Marinha) || 0)
        };
        
        globalCache.set(cacheKey, sanitizedData, 180000); // Cache por 3 minutos
        
        Logger.debug(`Dados do país ${paisId} carregados com sucesso`);
        return sanitizedData;
    } catch (error) {
        FirebaseErrorHandler.handleError(error, `carregamento do país ${paisId}`);
        return null;
    }
}

export async function getGameConfig(useCache = true) {
    const cacheKey = 'game-config';
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug('Configuração do jogo carregada do cache');
                return cached;
            }
        }
        
        const doc = await db.collection('configuracoes').doc('jogo').get();
        
        let config = null;
        if (doc.exists) {
            config = doc.data();
            
            // Validar dados da configuração
            if (config.turnoAtual !== undefined) {
                config.turnoAtual = Math.max(0, parseInt(config.turnoAtual) || 0);
            }
        }
        
        // Cache por 2 minutos
        globalCache.set(cacheKey, config, 120000);
        
        Logger.debug('Configuração do jogo carregada:', config);
        return config;
    } catch (error) {
        Logger.error('Erro ao carregar configuração do jogo:', error);
        return null;
    }
}

export async function getCustomRules() {
    try {
        const doc = await db.collection('configuracoes').doc('regrasDinamicas').get();
        
        if (doc.exists) {
            Logger.debug('Regras dinâmicas carregadas do Firestore');
            return doc.data();
        } else {
            Logger.debug('Nenhum documento de regras dinâmicas encontrado, usando objeto vazio.');
            return {}; // Retorna objeto vazio se não houver regras customizadas
        }
    } catch (error) {
        FirebaseErrorHandler.handleError(error, 'carregamento de regras dinâmicas');
        return {}; // Retorna objeto vazio em caso de erro
    }
}

export async function saveCustomRules(rulesObject, userId = null) {
    try {
        if (typeof rulesObject !== 'object' || rulesObject === null) {
            throw new Error('Objeto de regras inválido.');
        }

        if (userId) {
            const permissions = await checkUserPermissions(userId, false);
            if (!permissions.isNarrator && !permissions.isAdmin) {
                throw new Error('Acesso negado: apenas narradores podem salvar regras.');
            }
        }

        const updateData = {
            ...rulesObject,
            ultimaAtualizacao: firebase.firestore.Timestamp.now(),
            ultimoEditor: userId || 'desconhecido'
        };

        await db.collection('configuracoes').doc('regrasDinamicas').set(updateData);

        globalCache.clear(); 

        Logger.info('Regras dinâmicas salvas com sucesso', { userId });
        showNotification('success', 'Conjunto de regras customizadas foi salvo!');
        return { success: true };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'salvamento de regras dinâmicas');
    }
}

export async function updateTurn(newTurn, userId = null) {
    try {
        const turn = parseInt(newTurn);
        if (isNaN(turn) || turn < 0) {
            throw new Error('Número do turno inválido');
        }
        
        // Verificar permissões se userId fornecido
        if (userId) {
            const permissions = await checkUserPermissions(userId, false);
            if (!permissions.isNarrator && !permissions.isAdmin) {
                throw new Error('Acesso negado: apenas narradores podem atualizar turnos');
            }
        }
        
        const updateData = {
            turnoAtual: turn,
            ultimaAtualizacao: firebase.firestore.Timestamp.now()
        };
        
        if (userId) {
            updateData.ultimoEditor = userId;
        }
        
        await db.collection('configuracoes').doc('jogo').set(updateData, { merge: true });

        // Executar processamento automático do turno
        try {
            const { default: TurnProcessor } = await import('../systems/turnProcessor.js');

            // Verificar se turno já foi processado para evitar duplicação
            const alreadyProcessed = await TurnProcessor.isTurnProcessed(turn);

            if (!alreadyProcessed) {
                Logger.info(`Iniciando processamento automático do turno ${turn}`);
                const processingResult = await TurnProcessor.processTurnEnd(turn);
                Logger.info(`Processamento do turno ${turn} concluído`, processingResult);
            } else {
                Logger.info(`Turno ${turn} já foi processado anteriormente`);
            }
        } catch (processingError) {
            // Não falhar a atualização do turno se houver erro no processamento
            Logger.error('Erro no processamento automático do turno:', processingError);
            console.warn('⚠️ Erro no processamento automático, mas turno foi atualizado');
        }

        // Limpar cache relacionado
        globalCache.clear();

        Logger.info(`Turno atualizado para #${turn}`, { userId, newTurn: turn });
        return { success: true, turno: turn };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'atualização de turno');
    }
}

// === Funções auxiliares que preservam o papel existente ===
export async function signInWithGooglePreserveRole() {
    try {
        checkRateLimit('google-login');

        const result = await auth.signInWithPopup(googleProvider);
        const user = result.user;

        if (!user.email || !ValidationUtils.isValidEmail(user.email)) {
            throw new Error('Email inválido recebido do Google');
        }

        const userRef = db.collection('usuarios').doc(user.uid);
        const existing = await userRef.get();

        const baseData = {
            nome: ValidationUtils.sanitizeInput(user.displayName || 'Usuário', { maxLength: 100 }),
            email: user.email.toLowerCase(),
            photoURL: user.photoURL || null,
            ultimoLogin: firebase.firestore.Timestamp.now(),
            ativo: true,
            versaoTermos: '1.0'
        };

        if (!existing.exists) {
            baseData.dataIngresso = firebase.firestore.Timestamp.now();
            baseData.papel = 'jogador';
        } else {
            const currentRole = (existing.data() || {}).papel;
            if (!currentRole) {
                baseData.papel = 'jogador';
            }
        }

        await userRef.set(baseData, { merge: true });

        Logger.info('Login Google (preservando papel) realizado com sucesso', { uid: user.uid, email: user.email });
        return { success: true, user };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'login com Google (preservar papel)');
    }
}

export async function vincularJogadorAoPaisSemRebaixar(userId, paisId) {
    if (!userId || !paisId) {
        const error = new Error('userId e paisId são obrigatórios');
        return FirebaseErrorHandler.handleError(error, 'vinculação jogador-país (preservar papel)');
    }

    try {
        const paisDoc = await db.collection('paises').doc(paisId).get();
        if (!paisDoc.exists) {
            throw new Error('País não encontrado');
        }

        const paisData = paisDoc.data();
        if (paisData.Player) {
            throw new Error('País já possui um jogador');
        }

        await db.runTransaction(async (transaction) => {
            transaction.update(db.collection('paises').doc(paisId), {
                Player: userId,
                DataVinculacao: firebase.firestore.Timestamp.now()
            });

            // Não alterar 'papel' para não rebaixar admin/narrador
            transaction.set(db.collection('usuarios').doc(userId), {
                paisId: paisId,
                ultimaAtualizacao: firebase.firestore.Timestamp.now(),
                ativo: true
            }, { merge: true });
        });

        globalCache.clear();

        Logger.info('Jogador vinculado ao país (preservando papel) com sucesso', { userId, paisId });
        return { success: true };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'vinculação jogador-país (preservar papel)');
    }
}
