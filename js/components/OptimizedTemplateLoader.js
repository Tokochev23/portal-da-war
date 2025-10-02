/**
 * Optimized Template Loader - War1954 Aircraft Creator
 *
 * Implements performance optimizations for template and component loading:
 * - Template caching to avoid redundant fetch operations
 * - Lazy loading of components
 * - Batch component requests
 * - Debounced UI updates
 * - Background loading with prioritization
 * - Performance monitoring integration
 *
 * @author War1954 Performance Team
 * @version 1.0.0
 */

import { performanceMonitor } from '../utils/PerformanceMonitor.js';

export class OptimizedTemplateLoader {
    constructor() {
        this.templateCache = new Map();
        this.componentCache = new Map();
        this.loadingStates = new Map();
        this.pendingRequests = new Map();
        this.priorities = new Map();
        this.loadingQueue = [];
        this.maxConcurrentLoads = 3;
        this.currentLoads = 0;
        this.initialized = false;

        // Performance tracking
        this.performanceMetrics = {
            templateLoads: 0,
            cacheHits: 0,
            loadTime: [],
            errors: 0
        };

        // Debounce timers
        this.updateTimers = new Map();

        console.log('🚀 OptimizedTemplateLoader initialized');
    }

    /**
     * Initialize the loader with preload critical templates
     */
    async initialize() {
        if (this.initialized) return;

        console.log('⚡ Initializing optimized template loader...');

        // Preload critical templates in background
        const criticalTemplates = [
            'templates/aircraft-creator/airframes-tab.html',
            'templates/aircraft-creator/engines-tab.html',
            'templates/aircraft-creator/wings-tab.html'
        ];

        try {
            await this.preloadTemplates(criticalTemplates);
            console.log('✅ Critical templates preloaded');
        } catch (error) {
            console.warn('⚠️ Some critical templates failed to preload:', error);
        }

        this.initialized = true;
        console.log('🎯 OptimizedTemplateLoader ready');
    }

    /**
     * Preload templates in background with low priority
     */
    async preloadTemplates(templatePaths) {
        const preloadPromises = templatePaths.map(path =>
            this.loadTemplate(path, { priority: 'low', cache: true })
        );

        return Promise.allSettled(preloadPromises);
    }

    /**
     * Load template with caching and optimization
     */
    async loadTemplate(templatePath, options = {}) {
        const {
            priority = 'normal',
            cache = true,
            force = false,
            timeout = 5000
        } = options;

        const startTime = performance.now();

        // Check cache first (unless forced)
        if (!force && cache && this.templateCache.has(templatePath)) {
            this.performanceMetrics.cacheHits++;
            performanceMonitor.recordCacheEvent('hit', templatePath);
            console.log(`📋 Template cache hit: ${templatePath}`);
            return this.templateCache.get(templatePath);
        }

        performanceMonitor.recordCacheEvent('miss', templatePath);

        // Check if already loading
        if (this.pendingRequests.has(templatePath)) {
            console.log(`⏳ Template already loading: ${templatePath}`);
            return this.pendingRequests.get(templatePath);
        }

        // Create loading promise
        const loadPromise = this.performTemplateLoad(templatePath, timeout);
        this.pendingRequests.set(templatePath, loadPromise);
        this.priorities.set(templatePath, priority);

        try {
            const result = await loadPromise;

            // Cache the result
            if (cache) {
                this.templateCache.set(templatePath, result);
            }

            // Track performance
            const loadTime = performance.now() - startTime;
            this.performanceMetrics.templateLoads++;
            this.performanceMetrics.loadTime.push(loadTime);

            performanceMonitor.recordLoad(`template:${templatePath}`, loadTime, true);
            console.log(`✅ Template loaded: ${templatePath} (${loadTime.toFixed(2)}ms)`);
            return result;

        } catch (error) {
            this.performanceMetrics.errors++;
            const loadTime = performance.now() - startTime;
            performanceMonitor.recordLoad(`template:${templatePath}`, loadTime, false);
            console.error(`❌ Template load failed: ${templatePath}`, error);
            throw error;
        } finally {
            this.pendingRequests.delete(templatePath);
            this.priorities.delete(templatePath);
        }
    }

    /**
     * Perform the actual template loading with timeout
     */
    async performTemplateLoad(templatePath, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(templatePath, {
                signal: controller.signal,
                cache: 'force-cache' // Use browser cache when possible
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const content = await response.text();
            clearTimeout(timeoutId);
            return content;

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error(`Template load timeout: ${templatePath}`);
            }

            throw error;
        }
    }

    /**
     * Load and inject template with optimization
     */
    async loadAndInjectTemplate(containerId, templatePath, data = {}) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Container not found: ${containerId}`);
            }

            // Show loading state immediately
            this.showOptimizedLoadingState(container);

            // Load template
            const template = await this.loadTemplate(templatePath, { priority: 'high' });

            // Process template with data if needed
            const processedTemplate = this.processTemplate(template, data);

            // Inject with smooth transition and wait for completion
            await this.injectWithTransitionAsync(container, processedTemplate);

            return processedTemplate;

        } catch (error) {
            console.error(`❌ Template injection failed: ${templatePath}`, error);
            this.showErrorState(containerId, error.message);
            throw error;
        }
    }

    /**
     * Process template with data interpolation
     */
    processTemplate(template, data) {
        if (!data || Object.keys(data).length === 0) {
            return template;
        }

        let processed = template;

        // Simple template variable replacement
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            processed = processed.replace(regex, String(value));
        }

        return processed;
    }

    /**
     * Inject content with smooth transition
     */
    injectWithTransition(container, content) {
        // Fade out
        container.style.opacity = '0.7';
        container.style.transition = 'opacity 0.15s ease';

        setTimeout(() => {
            container.innerHTML = content;

            // Fade in
            container.style.opacity = '1';

            // Clean up transition after completion
            setTimeout(() => {
                container.style.transition = '';
            }, 150);
        }, 50);
    }

    /**
     * Inject content with smooth transition (async version)
     */
    async injectWithTransitionAsync(container, content) {
        return new Promise((resolve) => {
            // Fade out
            container.style.opacity = '0.7';
            container.style.transition = 'opacity 0.15s ease';

            setTimeout(() => {
                container.innerHTML = content;

                // Fade in
                container.style.opacity = '1';

                // Clean up transition after completion
                setTimeout(() => {
                    container.style.transition = '';
                    resolve(); // Resolve after everything is complete
                }, 150);
            }, 50);
        });
    }

    /**
     * Show optimized loading state
     */
    showOptimizedLoadingState(container, message = 'Carregando...') {
        container.innerHTML = `
            <div class="loading-spinner-optimized">
                <div class="spinner"></div>
                <div class="loading-text">${message}</div>
            </div>
            <style>
                .loading-spinner-optimized {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    color: rgb(148 163 184);
                }
                .spinner {
                    width: 24px;
                    height: 24px;
                    border: 2px solid rgb(51 65 85);
                    border-top: 2px solid rgb(6 182 212);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                .loading-text {
                    margin-top: 0.75rem;
                    font-size: 0.875rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    /**
     * Show error state
     */
    showErrorState(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-state-optimized">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">Erro ao carregar: ${message}</div>
                    <button class="retry-button" onclick="location.reload()">Tentar Novamente</button>
                </div>
                <style>
                    .error-state-optimized {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                        color: rgb(248 113 113);
                        text-align: center;
                    }
                    .error-icon {
                        font-size: 2rem;
                        margin-bottom: 0.5rem;
                    }
                    .error-message {
                        font-size: 0.875rem;
                        margin-bottom: 1rem;
                        max-width: 300px;
                    }
                    .retry-button {
                        padding: 0.5rem 1rem;
                        background: rgb(239 68 68);
                        color: white;
                        border: none;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 0.875rem;
                    }
                    .retry-button:hover {
                        background: rgb(220 38 38);
                    }
                </style>
            `;
        }
    }

    /**
     * Debounced update function to prevent excessive DOM updates
     */
    debouncedUpdate(key, updateFunction, delay = 100) {
        // Clear existing timer
        if (this.updateTimers.has(key)) {
            clearTimeout(this.updateTimers.get(key));
        }

        // Set new timer
        const timer = setTimeout(() => {
            updateFunction();
            this.updateTimers.delete(key);
        }, delay);

        this.updateTimers.set(key, timer);
    }

    /**
     * Batch load multiple components efficiently
     */
    async batchLoadComponents(componentTypes) {
        const loadPromises = [];

        for (const type of componentTypes) {
            if (!this.componentCache.has(type)) {
                loadPromises.push(this.loadComponentType(type));
            }
        }

        if (loadPromises.length === 0) {
            console.log('📋 All components cached, no loading needed');
            return;
        }

        console.log(`🔄 Batch loading ${loadPromises.length} component types...`);

        try {
            await Promise.all(loadPromises);
            console.log('✅ Batch component loading completed');
        } catch (error) {
            console.error('❌ Batch loading failed:', error);
            throw error;
        }
    }

    /**
     * Load specific component type with caching
     */
    async loadComponentType(componentType) {
        if (this.componentCache.has(componentType)) {
            return this.componentCache.get(componentType);
        }

        // This would integrate with the existing component loading system
        if (window.loadAircraftComponents) {
            try {
                await window.loadAircraftComponents();

                // Cache the loaded components
                if (window.AIRCRAFT_COMPONENTS && window.AIRCRAFT_COMPONENTS[componentType]) {
                    this.componentCache.set(componentType, window.AIRCRAFT_COMPONENTS[componentType]);
                    console.log(`✅ Component type cached: ${componentType}`);
                }
            } catch (error) {
                console.error(`❌ Failed to load component type: ${componentType}`, error);
                throw error;
            }
        }
    }

    /**
     * Clear caches to free memory
     */
    clearCaches() {
        console.log('🧹 Clearing template and component caches...');
        this.templateCache.clear();
        this.componentCache.clear();
        this.loadingStates.clear();

        // Clear any pending timers
        for (const timer of this.updateTimers.values()) {
            clearTimeout(timer);
        }
        this.updateTimers.clear();

        console.log('✅ Caches cleared');
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        const avgLoadTime = this.performanceMetrics.loadTime.length > 0
            ? this.performanceMetrics.loadTime.reduce((a, b) => a + b) / this.performanceMetrics.loadTime.length
            : 0;

        return {
            ...this.performanceMetrics,
            avgLoadTime: avgLoadTime.toFixed(2),
            cacheHitRate: this.performanceMetrics.templateLoads > 0
                ? ((this.performanceMetrics.cacheHits / (this.performanceMetrics.templateLoads + this.performanceMetrics.cacheHits)) * 100).toFixed(1)
                : 0
        };
    }

    /**
     * Log performance summary
     */
    logPerformanceMetrics() {
        const metrics = this.getPerformanceMetrics();
        console.log('📊 Template Loader Performance:', metrics);
    }
}

// Global instance
export const optimizedTemplateLoader = new OptimizedTemplateLoader();

// Make it available globally
window.optimizedTemplateLoader = optimizedTemplateLoader;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        optimizedTemplateLoader.initialize();
    });
} else {
    optimizedTemplateLoader.initialize();
}