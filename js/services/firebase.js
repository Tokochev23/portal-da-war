import { showNotification, Logger, ValidationUtils, globalCache, Formatter } from "../utils.js";
import { FIREBASE_CONFIG, SECURITY_CONFIG } from "../config/firebase-config.js";

// Inicializa Firebase SDKs.
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";
import "https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";

// === INICIALIZA├ç├âO SEGURA DO FIREBASE ===
let app, auth, db, storage, firebase;
let loginAttempts = new Map(); // Rate limiting por usu├írio

// Classe para tratamento centralizado de erros Firebase
class FirebaseErrorHandler {
    static getErrorMessage(error) {
        const errorMessages = {
            'auth/user-not-found': 'Usu├írio n├úo encontrado. Verifique o email.',
            'auth/wrong-password': 'Senha incorreta. Tente novamente.',
            'auth/email-already-in-use': 'Este email j├í est├í em uso.',
            'auth/weak-password': 'A senha ├® muito fraca. Use pelo menos 6 caracteres.',
            'auth/invalid-email': 'Email inv├ílido. Verifique o formato.',
            'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
            'auth/network-request-failed': 'Erro de conex├úo. Verifique sua internet.',
            'permission-denied': 'Acesso negado. Verifique suas permiss├Áes.',
            'unavailable': 'Servi├ºo temporariamente indispon├¡vel.',
            'cancelled': 'Opera├º├úo cancelada.',
            'deadline-exceeded': 'Tempo limite excedido. Tente novamente.',
            'not-found': 'Documento n├úo encontrado.',
            'already-exists': 'Documento j├í existe.',
            'resource-exhausted': 'Limite de requisi├º├Áes excedido.',
            'failed-precondition': 'Condi├º├úo pr├®via falhou.',
            'aborted': 'Opera├º├úo abortada.',
            'out-of-range': 'Valor fora do intervalo permitido.',
            'unimplemented': 'Funcionalidade n├úo implementada.',
            'internal': 'Erro interno do servidor.',
            'data-loss': 'Perda de dados detectada.'
        };
        
        const code = error.code || error.message;
        return errorMessages[code] || `Erro: ${error.message || 'Erro desconhecido'}`;
    }
    
    static handleError(error, operation = 'opera├º├úo') {
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

// Inicializa├º├úo com tratamento de erro
try {
    firebase = window.firebase; // Capturar refer├¬ncia global
    app = firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    
    // Configurar persist├¬ncia offline
    db.enablePersistence({ synchronizeTabs: true })
        .catch(err => Logger.warn('N├úo foi poss├¡vel habilitar persist├¬ncia:', err));
    
    Logger.info('Firebase inicializado com sucesso');
} catch (error) {
    Logger.error('Erro cr├¡tico ao inicializar Firebase:', error);
    showNotification('error', 'Erro cr├¡tico: N├úo foi poss├¡vel conectar ao servidor. Recarregue a p├ígina.', { persistent: true });
}

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Tornar db acess├¡vel globalmente para scripts de console
window.db = db;
window.auth = auth;

export { app, auth, db, storage, googleProvider };

const POPUP_FALLBACK_ERRORS = new Set(['auth/popup-blocked', 'auth/cancelled-popup-request']);

async function attemptGoogleSignIn() {
    try {
        const result = await auth.signInWithPopup(googleProvider);
        return { user: result.user, redirectTriggered: false };
    } catch (error) {
        if (POPUP_FALLBACK_ERRORS.has(error?.code)) {
            Logger.warn('Popup do Google bloqueado. Alternando para redirect.', error);
            await auth.signInWithRedirect(googleProvider);
            return { user: null, redirectTriggered: true };
        }
        throw error;
    }
}

async function upsertGoogleUserProfile(user, { preserveRole = false } = {}) {
    const userRef = db.collection('usuarios').doc(user.uid);
    const sanitizedName = ValidationUtils.sanitizeInput(user.displayName || 'Usuário', { maxLength: 100 });
    const baseData = {
        nome: sanitizedName,
        email: user.email.toLowerCase(),
        photoURL: user.photoURL || null,
        ultimoLogin: firebase.firestore.Timestamp.now(),
        ativo: true,
        versaoTermos: '1.0'
    };

    if (preserveRole) {
        const existing = await userRef.get();
        if (!existing.exists) {
            baseData.dataIngresso = firebase.firestore.Timestamp.now();
            baseData.papel = 'jogador';
        } else {
            const currentRole = (existing.data() || {}).papel;
            if (!currentRole) {
                baseData.papel = 'jogador';
            }
        }
    } else {
        baseData.dataIngresso = firebase.firestore.Timestamp.now();
        baseData.papel = 'jogador';
    }

    await userRef.set(baseData, { merge: true });
}

export async function signInWithGoogle() {
    try {
        checkRateLimit('google-login');
        
        const { user, redirectTriggered } = await attemptGoogleSignIn();
        if (redirectTriggered) {
            return { success: true, redirect: true };
        }
        
        // Validar dados do usuario
        if (!user.email || !ValidationUtils.isValidEmail(user.email)) {
            throw new Error('Email invalido recebido do Google');
        }
        
        await upsertGoogleUserProfile(user);
        
        Logger.info('Login Google realizado com sucesso', { uid: user.uid, email: user.email });
        return { success: true, user };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'login com Google');
    }
}

export async function registerWithEmailPassword(email, password, displayName) {
    try {
        // Valida├º├Áes de entrada
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
        
        // Atualizar ├║ltimo login de forma segura
        try {
            await db.collection('usuarios').doc(result.user.uid).update({
                ultimoLogin: firebase.firestore.Timestamp.now()
            });
        } catch (updateError) {
            Logger.warn('N├úo foi poss├¡vel atualizar ├║ltimo login:', updateError);
        }
        
        Logger.info('Login realizado com sucesso', { uid: result.user.uid, email: result.user.email });
        return { success: true, user: result.user };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'login');
    }
}

export async function vincularJogadorAoPais(userId, paisId) {
    if (!userId || !paisId) {
        const error = new Error('userId e paisId s├úo obrigat├│rios');
        return FirebaseErrorHandler.handleError(error, 'vincula├º├úo jogador-pa├¡s');
    }
    
    try {
        // Verificar se o pa├¡s est├í dispon├¡vel
        const paisDoc = await db.collection('paises').doc(paisId).get();
        if (!paisDoc.exists) {
            throw new Error('Pa├¡s n├úo encontrado');
        }
        
        const paisData = paisDoc.data();
        if (paisData.Player) {
            throw new Error('Pa├¡s j├í possui um jogador');
        }
        
        // Usar transa├º├úo para garantir consist├¬ncia
        await db.runTransaction(async (transaction) => {
            // Atualizar pa├¡s
            transaction.update(db.collection('paises').doc(paisId), {
                Player: userId,
                DataVinculacao: firebase.firestore.Timestamp.now()
            });
            
            // Atualizar usu├írio
            transaction.set(db.collection('usuarios').doc(userId), {
                paisId: paisId,
                papel: 'jogador',
                ultimaAtualizacao: firebase.firestore.Timestamp.now(),
                ativo: true
            }, { merge: true });
        });
        
        // Limpar cache relacionado
        globalCache.clear();
        
        Logger.info('Jogador vinculado ao pa├¡s com sucesso', { userId, paisId });
        return { success: true };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'vincula├º├úo jogador-pa├¡s');
    }
}

export async function checkUserPermissions(userId, useCache = true) {
    if (!userId) {
        Logger.warn('checkUserPermissions: userId ├® obrigat├│rio');
        return { isNarrator: false, isAdmin: false, isPlayer: true };
    }
    
    const cacheKey = `permissions-${userId}`;
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug(`Permiss├Áes do usu├írio ${userId} carregadas do cache`);
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
        
        Logger.debug(`Permiss├Áes verificadas para ${userId}:`, permissions);
        return permissions;
    } catch (error) {
        Logger.error('Erro ao verificar permiss├Áes:', error);
        return { isNarrator: false, isAdmin: false, isPlayer: true, role: 'jogador' };
    }
}

export async function checkPlayerCountry(userId, useCache = true) {
    if (!userId) {
        Logger.warn('checkPlayerCountry: userId ├® obrigat├│rio');
        return null;
    }
    
    const cacheKey = `player-country-${userId}`;
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached !== null) {
                Logger.debug(`Pa├¡s do jogador ${userId} carregado do cache: ${cached}`);
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
        
        Logger.debug(`Pa├¡s do jogador ${userId}: ${paisId || 'nenhum'}`);
        return paisId;
    } catch (error) {
        Logger.error('Erro ao verificar pa├¡s do jogador:', error);
        return null;
    }
}

export async function getAvailableCountries(useCache = true) {
    const cacheKey = 'available-countries';
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug('Pa├¡ses dispon├¡veis carregados do cache');
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
            // Filtrar pa├¡ses com dados m├¡nimos necess├írios
            return country.Pais && country.PIB !== undefined;
        });
        
        // Cache por 3 minutos
        globalCache.set(cacheKey, availableCountries, 180000);
        
        Logger.info(`${availableCountries.length} pa├¡ses dispon├¡veis encontrados`);
        return availableCountries;
    } catch (error) {
        FirebaseErrorHandler.handleError(error, 'busca de pa├¡ses dispon├¡veis');
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
                Logger.debug('Pa├¡ses carregados do cache');
                return cached;
            }
        }
        
        const paisesRef = db.collection('paises');
        const querySnapshot = await paisesRef.get();
        
        if (querySnapshot.empty) {
            Logger.warn('Nenhum pa├¡s encontrado na cole├º├úo');
            return [];
        }
        
        const countries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const country = {
                id: doc.id,
                ...data,
                // Sanitizar dados sens├¡veis se necess├írio
                Pais: ValidationUtils.sanitizeInput(data.Pais || '', { maxLength: 100 }),
                PIB: Math.max(0, Formatter.parseNumber(data.PIB) || 0)
            };

            // Adicionar Carvao e PotencialCarvao se n├úo existirem
            if (country.Carvao === undefined) {
                country.Carvao = 0;
            }
            if (country.PotencialCarvao === undefined) {
                // Definir valores padr├úo e espec├¡ficos para alguns pa├¡ses
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
                        country.PotencialCarvao = 5; // Valor padr├úo para outros pa├¡ses
                }
            }
            // Adicionar array para usinas de energia se n├úo existir
            if (country.power_plants === undefined) {
                country.power_plants = [];
            }
            // Adicionar PotencialHidreletrico se n├úo existir
            if (country.PotencialHidreletrico === undefined) {
                country.PotencialHidreletrico = 5; // Valor padr├úo
            }
            return country;
        });

        const playerIds = [...new Set(countries.filter(c => c.Player).map(c => c.Player))];
        if (playerIds.length > 0) {
            const playerMap = await fetchPlayersInfo(playerIds);
            countries.forEach(country => {
                if (country.Player && playerMap.has(country.Player)) {
                    const info = playerMap.get(country.Player);
                    country.PlayerName = info.nome || info.displayName || info.email?.split('@')[0] || country.Player;
                    country.PlayerEmail = info.email || null;
                }
            });
        }
        
        // Cachear resultado por 5 minutos
        globalCache.set(cacheKey, countries, 300000);
        
        Logger.info(`${countries.length} pa├¡ses carregados com sucesso`);
        return countries;
    } catch (error) {
        const result = FirebaseErrorHandler.handleError(error, 'carregamento de pa├¡ses');
        return [];
    }
}

export async function getCountryData(paisId, useCache = true) {
    if (!paisId) {
        Logger.warn('getCountryData: paisId ├® obrigat├│rio');
        return null;
    }
    
    const cacheKey = `country-${paisId}`;
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug(`Dados do pa├¡s ${paisId} carregados do cache`);
                return cached;
            }
        }
        
        const doc = await db.collection('paises').doc(paisId).get();
        
        if (!doc.exists) {
            Logger.warn(`Pa├¡s ${paisId} n├úo encontrado`);
            return null;
        }
        
        const data = doc.data();
        
        // Validar e sanitizar dados
        const sanitizedData = {
            ...data,
            Pais: ValidationUtils.sanitizeInput(data.Pais || '', { maxLength: 100 }),
            // Normaliza n├║meros conforme dashboard
            PIB: Math.max(0, Formatter.parseNumber(data.PIB) || 0),
            Estabilidade: Math.max(0, Math.min(100, Formatter.parseNumber(data.Estabilidade) || 0)),
            // Techs do dashboard (podem vir como string com % ou n├║mero)
            Tecnologia: Math.max(0, Formatter.parseNumber(data.Tecnologia) || 0),
            Aeronautica: Math.max(0, Formatter.parseNumber(data.Aeronautica) || 0),
            Veiculos: Math.max(0, Formatter.parseNumber(data.Veiculos) || 0),
            Marinha: Math.max(0, Formatter.parseNumber(data.Marinha) || 0)
        };
        
        globalCache.set(cacheKey, sanitizedData, 180000); // Cache por 3 minutos
        
        Logger.debug(`Dados do pa├¡s ${paisId} carregados com sucesso`);
        return sanitizedData;
    } catch (error) {
        FirebaseErrorHandler.handleError(error, `carregamento do pa├¡s ${paisId}`);
        return null;
    }
}

export async function getGameConfig(useCache = true) {
    const cacheKey = 'game-config';
    
    try {
        if (useCache) {
            const cached = globalCache.get(cacheKey);
            if (cached) {
                Logger.debug('Configura├º├úo do jogo carregada do cache');
                return cached;
            }
        }
        
        const doc = await db.collection('configuracoes').doc('jogo').get();
        
        let config = null;
        if (doc.exists) {
            config = doc.data();
            
            // Validar dados da configura├º├úo
            if (config.turnoAtual !== undefined) {
                config.turnoAtual = Math.max(0, parseInt(config.turnoAtual) || 0);
            }
        }
        
        // Cache por 2 minutos
        globalCache.set(cacheKey, config, 120000);
        
        Logger.debug('Configura├º├úo do jogo carregada:', config);
        return config;
    } catch (error) {
        Logger.error('Erro ao carregar configura├º├úo do jogo:', error);
        return null;
    }
}

async function fetchPlayersInfo(playerIds) {
    const map = new Map();
    const uniqueIds = Array.from(new Set(playerIds.filter(Boolean)));
    const chunkSize = 10;
    
    for (let i = 0; i < uniqueIds.length; i += chunkSize) {
        const chunk = uniqueIds.slice(i, i + chunkSize);
        try {
            const snapshot = await db.collection('usuarios')
                .where(firebase.firestore.FieldPath.documentId(), 'in', chunk)
                .get();
            snapshot.forEach(doc => {
                map.set(doc.id, doc.data() || {});
            });
        } catch (error) {
            Logger.warn('Falha ao carregar dados de jogadores para países:', error);
        }
    }
    
    return map;
}

export async function getCustomRules() {
    try {
        const doc = await db.collection('configuracoes').doc('regrasDinamicas').get();
        
        if (doc.exists) {
            Logger.debug('Regras din├ómicas carregadas do Firestore');
            return doc.data();
        } else {
            Logger.debug('Nenhum documento de regras din├ómicas encontrado, usando objeto vazio.');
            return {}; // Retorna objeto vazio se n├úo houver regras customizadas
        }
    } catch (error) {
        FirebaseErrorHandler.handleError(error, 'carregamento de regras din├ómicas');
        return {}; // Retorna objeto vazio em caso de erro
    }
}

export async function saveCustomRules(rulesObject, userId = null) {
    try {
        if (typeof rulesObject !== 'object' || rulesObject === null) {
            throw new Error('Objeto de regras inv├ílido.');
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

        Logger.info('Regras din├ómicas salvas com sucesso', { userId });
        showNotification('success', 'Conjunto de regras customizadas foi salvo!');
        return { success: true };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'salvamento de regras din├ómicas');
    }
}

export async function updateTurn(newTurn, userId = null) {
    try {
        const turn = parseInt(newTurn);
        if (isNaN(turn) || turn < 0) {
            throw new Error('N├║mero do turno inv├ílido');
        }
        
        // Verificar permiss├Áes se userId fornecido
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

        // Executar processamento autom├ítico do turno
        try {
            const { default: TurnProcessor } = await import('../systems/turnProcessor.js');

            // Verificar se turno j├í foi processado para evitar duplica├º├úo
            const alreadyProcessed = await TurnProcessor.isTurnProcessed(turn);

            if (!alreadyProcessed) {
                Logger.info(`Iniciando processamento autom├ítico do turno ${turn}`);
                const processingResult = await TurnProcessor.processTurnEnd(turn);
                Logger.info(`Processamento do turno ${turn} conclu├¡do`, processingResult);
            } else {
                Logger.info(`Turno ${turn} j├í foi processado anteriormente`);
            }
        } catch (processingError) {
            // N├úo falhar a atualiza├º├úo do turno se houver erro no processamento
            Logger.error('Erro no processamento autom├ítico do turno:', processingError);
            console.warn('ÔÜá´©Å Erro no processamento autom├ítico, mas turno foi atualizado');
        }

        // Limpar cache relacionado
        globalCache.clear();

        Logger.info(`Turno atualizado para #${turn}`, { userId, newTurn: turn });
        return { success: true, turno: turn };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'atualiza├º├úo de turno');
    }
}

// === Fun├º├Áes auxiliares que preservam o papel existente ===
export async function signInWithGooglePreserveRole() {
    try {
        checkRateLimit('google-login');

        const { user, redirectTriggered } = await attemptGoogleSignIn();
        if (redirectTriggered) {
            return { success: true, redirect: true };
        }

        if (!user.email || !ValidationUtils.isValidEmail(user.email)) {
            throw new Error('Email invalido recebido do Google');
        }

        await upsertGoogleUserProfile(user, { preserveRole: true });

        Logger.info('Login Google (preservando papel) realizado com sucesso', { uid: user.uid, email: user.email });
        return { success: true, user };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'login com Google (preservar papel)');
    }
}

export async function handleGoogleRedirectResult(preserveRole = false) {
    try {
        const result = await auth.getRedirectResult();
        if (result && result.user) {
            if (!result.user.email || !ValidationUtils.isValidEmail(result.user.email)) {
                throw new Error('Email invalido recebido do Google');
            }

            await upsertGoogleUserProfile(result.user, { preserveRole });
            Logger.info('Login Google via redirect concluido', { uid: result.user.uid, email: result.user.email });
            return { success: true, user: result.user };
        }
        return { success: false, user: null };
    } catch (error) {
        if (error?.code === 'auth/no-auth-event') {
            return { success: false, user: null };
        }
        return FirebaseErrorHandler.handleError(error, 'login com Google (redirect)');
    }
}

export async function vincularJogadorAoPaisSemRebaixar(userId, paisId) {
    if (!userId || !paisId) {
        const error = new Error('userId e paisId s├úo obrigat├│rios');
        return FirebaseErrorHandler.handleError(error, 'vincula├º├úo jogador-pa├¡s (preservar papel)');
    }

    try {
        const paisDoc = await db.collection('paises').doc(paisId).get();
        if (!paisDoc.exists) {
            throw new Error('Pa├¡s n├úo encontrado');
        }

        const paisData = paisDoc.data();
        if (paisData.Player) {
            throw new Error('Pa├¡s j├í possui um jogador');
        }

        await db.runTransaction(async (transaction) => {
            transaction.update(db.collection('paises').doc(paisId), {
                Player: userId,
                DataVinculacao: firebase.firestore.Timestamp.now()
            });

            // N├úo alterar 'papel' para n├úo rebaixar admin/narrador
            transaction.set(db.collection('usuarios').doc(userId), {
                paisId: paisId,
                ultimaAtualizacao: firebase.firestore.Timestamp.now(),
                ativo: true
            }, { merge: true });
        });

        globalCache.clear();

        Logger.info('Jogador vinculado ao pa├¡s (preservando papel) com sucesso', { userId, paisId });
        return { success: true };
    } catch (error) {
        return FirebaseErrorHandler.handleError(error, 'vincula├º├úo jogador-pa├¡s (preservar papel)');
    }
}


