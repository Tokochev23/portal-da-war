// Configuração Firebase com variáveis de ambiente
// IMPORTANTE: Em produção, estas variáveis devem vir de variáveis de ambiente

const firebaseConfig = {
    // Estas chaves podem ser públicas segundo documentação Firebase
    // mas é recomendado usar Domain restrictions no Console
    apiKey: window.FIREBASE_API_KEY || "AIzaSyBd-cQsmXqgU9wVDtxYdaeLFQIfIUxv6GE",
    authDomain: window.FIREBASE_AUTH_DOMAIN || "war-1954-1799c.firebaseapp.com",
    projectId: window.FIREBASE_PROJECT_ID || "war-1954-1799c",
    storageBucket: window.FIREBASE_STORAGE_BUCKET || "war-1954-1799c.firebasestorage.app",
    messagingSenderId: window.FIREBASE_MESSAGING_SENDER_ID || "147967902110",
    appId: window.FIREBASE_APP_ID || "1:147967902110:web:2e2a54b98ef9474d7a968f",
    measurementId: window.FIREBASE_MEASUREMENT_ID || "G-LQNDE985RB",
    // URL do Realtime Database (opcional). Defina via window.FIREBASE_DATABASE_URL
    // Exemplo: https://seu-projeto-default-rtdb.firebaseio.com/
    databaseURL: window.FIREBASE_DATABASE_URL || undefined
};

// Validação de configuração
function validateConfig(config) {
    const required = ['apiKey', 'authDomain', 'projectId'];
    for (const key of required) {
        if (!config[key]) {
            throw new Error(`Configuração Firebase inválida: ${key} é obrigatório`);
        }
    }
    return config;
}

// Preenche databaseURL automaticamente se estiver faltando e houver PROJECT_ID
if (!firebaseConfig.databaseURL && firebaseConfig.projectId) {
    try {
        const pid = firebaseConfig.projectId;
        // Tenta padrão .firebaseio.com (funciona para maioria dos projetos)
        firebaseConfig.databaseURL = `https://${pid}-default-rtdb.firebaseio.com/`;
    } catch {}
}

export const FIREBASE_CONFIG = validateConfig(firebaseConfig);

// Configurações de segurança
export const SECURITY_CONFIG = {
    maxLoginAttempts: 3,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 horas
    allowedDomains: ['localhost', 'war-1954-1799c.web.app'],
    rateLimiting: {
        requests: 100,
        windowMs: 15 * 60 * 1000 // 15 minutos
    }
};
