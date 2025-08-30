// === INICIALIZAÇÃO PRINCIPAL DA APLICAÇÃO ===

import { Logger, showNotification } from './utils.js';
import { A11y } from './accessibility/a11y.js';
import { auth } from './services/firebase.js';

class AppInitializer {
    constructor() {
        this.isInitialized = false;
        this.modules = new Map();
        this.startTime = Date.now();
    }
    
    async init() {
        try {
            Logger.info('🚀 Iniciando aplicação WAR • Era 1954...');
            
            // 1. Verificar compatibilidade do browser
            this.checkBrowserCompatibility();
            
            // 2. Configurar handlers de erro global
            this.setupGlobalErrorHandlers();
            
            // 3. Detectar capacidades do dispositivo
            this.detectDeviceCapabilities();
            
            // 4. Aguardar DOM estar pronto
            await this.waitForDOM();
            
            // 5. Inicializar acessibilidade primeiro
            await this.initializeAccessibility();
            
            // 6. Carregar módulos principais
            await this.loadCoreModules();
            
            // 7. Configurar Service Worker (se disponível)
            this.setupServiceWorker();
            
            // 8. Finalizar inicialização
            this.finalizeBoot();
            
            const loadTime = Date.now() - this.startTime;
            Logger.info(`✅ Aplicação inicializada com sucesso em ${loadTime}ms`);
            
            return true;
        } catch (error) {
            Logger.error('❌ Falha na inicialização da aplicação:', error);
            this.showCriticalError(error);
            return false;
        }
    }
    
    checkBrowserCompatibility() {
        const required = {
            'Promise': window.Promise,
            'fetch': window.fetch,
            'localStorage': window.localStorage,
            'sessionStorage': window.sessionStorage,
            'IntersectionObserver': window.IntersectionObserver,
            'MutationObserver': window.MutationObserver
        };
        
        const missing = Object.entries(required)
            .filter(([name, feature]) => !feature)
            .map(([name]) => name);
            
        if (missing.length > 0) {
            throw new Error(`Browser não compatível. Recursos ausentes: ${missing.join(', ')}`);
        }
        
        Logger.info('✅ Compatibilidade do browser verificada');
    }
    
    setupGlobalErrorHandlers() {
        // Erros JavaScript não capturados
        window.addEventListener('error', (e) => {
            Logger.error('Erro global:', {
                message: e.message,
                filename: e.filename,
                line: e.lineno,
                column: e.colno,
                error: e.error
            });
            
            // Notificar usuário apenas em desenvolvimento
            if (window.location.hostname === 'localhost') {
                showNotification('error', `Erro: ${e.message}`, { duration: 8000 });
            }
        });
        
        // Promises rejeitadas não capturadas
        window.addEventListener('unhandledrejection', (e) => {
            Logger.error('Promise rejeitada:', e.reason);
            
            // Prevenir que o erro apareça no console em produção
            if (window.location.hostname !== 'localhost') {
                e.preventDefault();
            }
        });
        
        // Erros de carregamento de recursos
        window.addEventListener('error', (e) => {
            if (e.target && e.target !== window) {
                Logger.warn('Falha ao carregar recurso:', {
                    type: e.target.tagName,
                    source: e.target.src || e.target.href
                });
            }
        }, true);
        
        Logger.info('✅ Handlers de erro globais configurados');
    }
    
    detectDeviceCapabilities() {
        const capabilities = {
            isMobile: /Mobi|Android/i.test(navigator.userAgent),
            isTablet: /Tablet|iPad/i.test(navigator.userAgent),
            hasTouch: 'ontouchstart' in window,
            isOnline: navigator.onLine,
            hasServiceWorker: 'serviceWorker' in navigator,
            hasWebGL: this.checkWebGLSupport(),
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        };\n        \n        // Adicionar classes CSS baseadas nas capacidades\n        document.body.classList.add(\n            capabilities.isMobile ? 'device-mobile' : 'device-desktop',\n            capabilities.hasTouch ? 'has-touch' : 'no-touch',\n            capabilities.isOnline ? 'is-online' : 'is-offline'\n        );\n        \n        // Monitorar mudanças de conectividade\n        window.addEventListener('online', () => {\n            document.body.classList.add('is-online');\n            document.body.classList.remove('is-offline');\n            showNotification('success', 'Conexão restaurada');\n        });\n        \n        window.addEventListener('offline', () => {\n            document.body.classList.add('is-offline');\n            document.body.classList.remove('is-online');\n            showNotification('warning', 'Conexão perdida. Algumas funcionalidades podem não funcionar.');\n        });\n        \n        Logger.info('✅ Capacidades do dispositivo detectadas:', capabilities);\n        return capabilities;\n    }\n    \n    checkWebGLSupport() {\n        try {\n            const canvas = document.createElement('canvas');\n            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));\n        } catch {\n            return false;\n        }\n    }\n    \n    async waitForDOM() {\n        return new Promise(resolve => {\n            if (document.readyState === 'loading') {\n                document.addEventListener('DOMContentLoaded', resolve, { once: true });\n            } else {\n                resolve();\n            }\n        });\n    }\n    \n    async initializeAccessibility() {\n        try {\n            // Acessibilidade é importada automaticamente em a11y.js\n            // Apenas verificar se foi carregada corretamente\n            if (A11y) {\n                A11y.improveSemantics();\n                Logger.info('✅ Sistema de acessibilidade inicializado');\n            }\n        } catch (error) {\n            Logger.warn('⚠️ Falha ao inicializar acessibilidade:', error);\n        }\n    }\n    \n    async loadCoreModules() {\n        const modules = [\n            { name: 'firebase', path: './services/firebase.js' },\n            { name: 'renderer', path: './ui/renderer.js' },\n            { name: 'utils', path: './utils.js' }\n        ];\n        \n        const loadPromises = modules.map(async (module) => {\n            try {\n                const loaded = await import(module.path);\n                this.modules.set(module.name, loaded);\n                Logger.debug(`✅ Módulo ${module.name} carregado`);\n                return { name: module.name, success: true };\n            } catch (error) {\n                Logger.error(`❌ Falha ao carregar módulo ${module.name}:`, error);\n                return { name: module.name, success: false, error };\n            }\n        });\n        \n        const results = await Promise.allSettled(loadPromises);\n        const failed = results.filter(r => r.status === 'rejected' || !r.value.success);\n        \n        if (failed.length > 0) {\n            Logger.warn('⚠️ Alguns módulos falharam ao carregar:', failed);\n        }\n        \n        Logger.info(`✅ ${results.length - failed.length}/${results.length} módulos carregados`);\n    }\n    \n    setupServiceWorker() {\n        if (!('serviceWorker' in navigator) || window.location.hostname === 'localhost') {\n            Logger.info('Service Worker não disponível ou em desenvolvimento');\n            return;\n        }\n        \n        navigator.serviceWorker.register('/sw.js')\n            .then(registration => {\n                Logger.info('✅ Service Worker registrado:', registration.scope);\n            })\n            .catch(error => {\n                Logger.warn('⚠️ Falha ao registrar Service Worker:', error);\n            });\n    }\n    \n    finalizeBoot() {\n        // Remover splash screen se existir\n        const splash = document.getElementById('splash-screen');\n        if (splash) {\n            splash.classList.add('fade-out');\n            setTimeout(() => splash.remove(), 500);\n        }\n        \n        // Adicionar classe indicando que a app está pronta\n        document.body.classList.add('app-ready');\n        \n        // Anunciar que a aplicação está pronta\n        if (A11y) {\n            A11y.announce('Aplicação WAR Era 1954 carregada e pronta para uso');\n        }\n        \n        // Disparar evento personalizado\n        window.dispatchEvent(new CustomEvent('app:ready', {\n            detail: {\n                modules: Array.from(this.modules.keys()),\n                loadTime: Date.now() - this.startTime\n            }\n        }));\n        \n        this.isInitialized = true;\n        Logger.info('🎉 Inicialização da aplicação finalizada');\n    }\n    \n    showCriticalError(error) {\n        const errorHtml = `\n            <div class=\"fixed inset-0 bg-red-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4\">\n                <div class=\"bg-red-900/50 border border-red-500/50 rounded-2xl p-6 max-w-md w-full text-center\">\n                    <div class=\"text-4xl mb-4\">⚠️</div>\n                    <h1 class=\"text-xl font-bold text-red-200 mb-2\">Falha na Inicialização</h1>\n                    <p class=\"text-red-300 text-sm mb-4\">A aplicação não pôde ser carregada devido a um erro crítico.</p>\n                    <details class=\"text-left mb-4\">\n                        <summary class=\"text-red-200 cursor-pointer\">Detalhes técnicos</summary>\n                        <pre class=\"text-xs text-red-300 mt-2 bg-red-950/50 p-2 rounded overflow-auto\">${error.stack || error.message}</pre>\n                    </details>\n                    <button onclick=\"window.location.reload()\" class=\"bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors\">\n                        Tentar Novamente\n                    </button>\n                </div>\n            </div>\n        `;\n        \n        document.body.insertAdjacentHTML('beforeend', errorHtml);\n    }\n    \n    // Métodos públicos para debug\n    getModule(name) {\n        return this.modules.get(name);\n    }\n    \n    getAllModules() {\n        return Object.fromEntries(this.modules);\n    }\n    \n    getStatus() {\n        return {\n            initialized: this.isInitialized,\n            modules: Array.from(this.modules.keys()),\n            loadTime: Date.now() - this.startTime\n        };\n    }\n}\n\n// Inicializar aplicação\nconst app = new AppInitializer();\napp.init();\n\n// Expor para debug global\nwindow.__WAR_APP__ = app;\n\nexport default app;