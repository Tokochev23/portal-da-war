// js/utils/templateLoader.js - Sistema de carregamento de templates
// Carregamento progressivo e cache de templates para melhor performance

class TemplateLoader {
    constructor() {
        this.cache = new Map();
        this.loadingQueue = new Set();
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    async loadTemplate(templatePath, useCache = true) {
        if (useCache && this.cache.has(templatePath)) {
            return this.cache.get(templatePath);
        }

        if (this.loadingQueue.has(templatePath)) {
            return this.waitForTemplate(templatePath);
        }

        this.loadingQueue.add(templatePath);

        try {
            const response = await this.fetchWithRetry(templatePath);
            const templateContent = await response.text();
            
            this.cache.set(templatePath, templateContent);
            this.loadingQueue.delete(templatePath);
            
            return templateContent;
        } catch (error) {
            this.loadingQueue.delete(templatePath);
            console.error(`Failed to load template: ${templatePath}`, error);
            throw new Error(`Template loading failed: ${templatePath}`);
        }
    }

    async fetchWithRetry(url, attempts = 0) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            if (attempts < this.retryAttempts - 1) {
                await this.delay(this.retryDelay * (attempts + 1));
                return this.fetchWithRetry(url, attempts + 1);
            }
            throw error;
        }
    }

    async waitForTemplate(templatePath) {
        while (this.loadingQueue.has(templatePath)) {
            await this.delay(50);
        }
        return this.cache.get(templatePath);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    preloadTemplates(templatePaths) {
        return Promise.allSettled(
            templatePaths.map(path => this.loadTemplate(path))
        );
    }

    clearCache() {
        this.cache.clear();
        this.loadingQueue.clear();
    }

    getCacheSize() {
        return this.cache.size;
    }
}

// Instância global do carregador de templates
window.templateLoader = new TemplateLoader();

// Sistema de injeção de templates no DOM
class TemplateInjector {
    constructor(templateLoader) {
        this.loader = templateLoader;
        this.injectionQueue = [];
        this.isProcessing = false;
    }

    async injectTemplate(containerId, templatePath, data = {}) {
        return new Promise((resolve, reject) => {
            this.injectionQueue.push({
                containerId,
                templatePath,
                data,
                resolve,
                reject
            });
            
            if (!this.isProcessing) {
                this.processQueue();
            }
        });
    }

    async processQueue() {
        if (this.injectionQueue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;
        const injection = this.injectionQueue.shift();
        
        try {
            const templateContent = await this.loader.loadTemplate(injection.templatePath);
            const processedContent = this.processTemplate(templateContent, injection.data);
            
            const container = document.getElementById(injection.containerId);
            if (!container) {
                throw new Error(`Container not found: ${injection.containerId}`);
            }
            
            container.innerHTML = processedContent;
            injection.resolve(processedContent);
            
        } catch (error) {
            console.error('Template injection failed:', error);
            injection.reject(error);
        }

        setTimeout(() => this.processQueue(), 10);
    }

    processTemplate(template, data) {
        let processed = template;
        
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            processed = processed.replace(regex, String(value));
        }
        
        return processed;
    }

    async injectMultipleTemplates(injections) {
        const promises = injections.map(injection => 
            this.injectTemplate(injection.containerId, injection.templatePath, injection.data)
        );
        
        return Promise.allSettled(promises);
    }
}

// Instância global do injetor de templates
window.templateInjector = new TemplateInjector(window.templateLoader);

// Função de conveniência para carregar templates
window.loadTemplate = async function(containerId, templatePath, data = {}) {
    try {
        await window.templateInjector.injectTemplate(containerId, templatePath, data);
    } catch (error) {
        console.error(`Failed to load template into ${containerId}:`, error);
        
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center py-8 text-red-400">
                    <div class="text-2xl mb-2">⚠️</div>
                    <p>Erro ao carregar componente</p>
                    <p class="text-sm text-slate-500 mt-2">${error.message}</p>
                </div>
            `;
        }
    }
};

// Sistema de carregamento progressivo
class ProgressiveLoader {
    constructor() {
        this.criticalTemplates = [
            'templates/aircraft-creator/airframes-tab.html',
            'templates/aircraft-creator/engines-tab.html'
        ];
        
        this.secondaryTemplates = [
            'templates/aircraft-creator/weapons-tab.html',
            'templates/aircraft-creator/wings-tab.html',
            'templates/aircraft-creator/avionics-tab.html'
        ];
        
        this.tertiaryTemplates = [
            'templates/aircraft-creator/component-tabs.html'
        ];
    }

    async loadCritical() {
        console.log('🚀 Loading critical templates...');
        const results = await window.templateLoader.preloadTemplates(this.criticalTemplates);
        
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
            console.warn('Some critical templates failed to load:', failed);
        }
        
        return results;
    }

    async loadSecondary() {
        console.log('📦 Loading secondary templates...');
        return window.templateLoader.preloadTemplates(this.secondaryTemplates);
    }

    async loadTertiary() {
        console.log('🔧 Loading tertiary templates...');
        return window.templateLoader.preloadTemplates(this.tertiaryTemplates);
    }

    async loadAll() {
        try {
            await this.loadCritical();
            
            setTimeout(() => this.loadSecondary(), 100);
            
            setTimeout(() => this.loadTertiary(), 500);
            
            console.log('✅ Progressive loading initiated');
        } catch (error) {
            console.error('❌ Progressive loading failed:', error);
        }
    }
}

window.progressiveLoader = new ProgressiveLoader();

console.log('📝 Template Loader carregado!');