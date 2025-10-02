/**
 * Performance Monitor - War1954 Aircraft Creator
 *
 * Monitors and reports on system performance metrics
 * - Loading times
 * - Memory usage
 * - Component load efficiency
 * - Template cache effectiveness
 *
 * @author War1954 Performance Team
 * @version 1.0.0
 */

export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTimes: [],
            componentLoads: 0,
            templateCacheHits: 0,
            templateCacheMisses: 0,
            errors: 0,
            totalLoadTime: 0,
            averageLoadTime: 0,
            worstLoadTime: 0,
            bestLoadTime: Infinity
        };

        this.observers = [];
        this.startTime = performance.now();
        this.isEnabled = true;

        console.log('📊 PerformanceMonitor initialized');
    }

    /**
     * Record a loading operation
     */
    recordLoad(operation, duration, success = true) {
        if (!this.isEnabled) return;

        this.metrics.loadTimes.push({
            operation,
            duration,
            success,
            timestamp: Date.now()
        });

        if (success) {
            this.metrics.totalLoadTime += duration;
            this.metrics.componentLoads++;

            // Update best/worst times
            if (duration > this.metrics.worstLoadTime) {
                this.metrics.worstLoadTime = duration;
            }
            if (duration < this.metrics.bestLoadTime) {
                this.metrics.bestLoadTime = duration;
            }

            // Calculate average
            this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.componentLoads;
        } else {
            this.metrics.errors++;
        }

        this.notifyObservers('load', { operation, duration, success });
    }

    /**
     * Record cache hit/miss
     */
    recordCacheEvent(type, operation) {
        if (!this.isEnabled) return;

        if (type === 'hit') {
            this.metrics.templateCacheHits++;
        } else {
            this.metrics.templateCacheMisses++;
        }

        this.notifyObservers('cache', { type, operation });
    }

    /**
     * Get current performance summary
     */
    getPerformanceSummary() {
        const totalCacheAttempts = this.metrics.templateCacheHits + this.metrics.templateCacheMisses;
        const cacheHitRate = totalCacheAttempts > 0
            ? (this.metrics.templateCacheHits / totalCacheAttempts * 100).toFixed(1)
            : 0;

        const uptime = ((performance.now() - this.startTime) / 1000).toFixed(1);

        return {
            uptime: `${uptime}s`,
            totalLoads: this.metrics.componentLoads,
            averageLoadTime: `${this.metrics.averageLoadTime.toFixed(2)}ms`,
            worstLoadTime: `${this.metrics.worstLoadTime.toFixed(2)}ms`,
            bestLoadTime: this.metrics.bestLoadTime === Infinity ? '0ms' : `${this.metrics.bestLoadTime.toFixed(2)}ms`,
            cacheHitRate: `${cacheHitRate}%`,
            cacheHits: this.metrics.templateCacheHits,
            cacheMisses: this.metrics.templateCacheMisses,
            errors: this.metrics.errors,
            successRate: this.metrics.componentLoads > 0
                ? `${((this.metrics.componentLoads / (this.metrics.componentLoads + this.metrics.errors)) * 100).toFixed(1)}%`
                : '100%'
        };
    }

    /**
     * Log performance summary to console
     */
    logPerformanceSummary() {
        const summary = this.getPerformanceSummary();

        console.group('📊 Performance Summary');
        console.log(`⏱️  Uptime: ${summary.uptime}`);
        console.log(`🔄 Total Loads: ${summary.totalLoads}`);
        console.log(`⚡ Average Load Time: ${summary.averageLoadTime}`);
        console.log(`🐌 Worst Load Time: ${summary.worstLoadTime}`);
        console.log(`🚀 Best Load Time: ${summary.bestLoadTime}`);
        console.log(`📋 Cache Hit Rate: ${summary.cacheHitRate}`);
        console.log(`✅ Success Rate: ${summary.successRate}`);
        if (summary.errors > 0) {
            console.warn(`❌ Errors: ${summary.errors}`);
        }
        console.groupEnd();
    }

    /**
     * Get detailed load history
     */
    getLoadHistory(limit = 10) {
        return this.metrics.loadTimes
            .slice(-limit)
            .map(load => ({
                operation: load.operation,
                duration: `${load.duration.toFixed(2)}ms`,
                success: load.success ? '✅' : '❌',
                timestamp: new Date(load.timestamp).toLocaleTimeString()
            }));
    }

    /**
     * Get performance recommendations
     */
    getRecommendations() {
        const recommendations = [];
        const summary = this.getPerformanceSummary();

        // Cache efficiency
        const cacheHitRate = parseFloat(summary.cacheHitRate);
        if (cacheHitRate < 60) {
            recommendations.push({
                type: 'cache',
                priority: 'high',
                message: `Cache hit rate is low (${summary.cacheHitRate}). Consider preloading more templates.`
            });
        }

        // Average load time
        const avgLoadTime = parseFloat(summary.averageLoadTime);
        if (avgLoadTime > 200) {
            recommendations.push({
                type: 'performance',
                priority: 'medium',
                message: `Average load time is high (${summary.averageLoadTime}). Consider optimizing component loading.`
            });
        }

        // Error rate
        const errorRate = 100 - parseFloat(summary.successRate);
        if (errorRate > 5) {
            recommendations.push({
                type: 'reliability',
                priority: 'high',
                message: `Error rate is concerning (${errorRate.toFixed(1)}%). Check network and component availability.`
            });
        }

        // Memory usage (if available)
        if (performance.memory) {
            const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
            if (memoryUsage > 50) {
                recommendations.push({
                    type: 'memory',
                    priority: 'medium',
                    message: `Memory usage is high (${memoryUsage.toFixed(1)}MB). Consider clearing caches periodically.`
                });
            }
        }

        return recommendations;
    }

    /**
     * Add observer for performance events
     */
    addObserver(callback) {
        this.observers.push(callback);
    }

    /**
     * Remove observer
     */
    removeObserver(callback) {
        this.observers = this.observers.filter(obs => obs !== callback);
    }

    /**
     * Notify observers of performance events
     */
    notifyObservers(event, data) {
        this.observers.forEach(observer => {
            try {
                observer(event, data);
            } catch (error) {
                console.warn('Performance observer error:', error);
            }
        });
    }

    /**
     * Start periodic performance reporting
     */
    startPeriodicReporting(intervalSeconds = 60) {
        setInterval(() => {
            if (this.isEnabled) {
                this.logPerformanceSummary();

                const recommendations = this.getRecommendations();
                if (recommendations.length > 0) {
                    console.group('💡 Performance Recommendations');
                    recommendations.forEach(rec => {
                        const icon = rec.priority === 'high' ? '🔴' :
                                   rec.priority === 'medium' ? '🟡' : '🟢';
                        console.log(`${icon} ${rec.message}`);
                    });
                    console.groupEnd();
                }
            }
        }, intervalSeconds * 1000);
    }

    /**
     * Enable or disable monitoring
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        console.log(`📊 Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
    }

    /**
     * Reset all metrics
     */
    reset() {
        this.metrics = {
            loadTimes: [],
            componentLoads: 0,
            templateCacheHits: 0,
            templateCacheMisses: 0,
            errors: 0,
            totalLoadTime: 0,
            averageLoadTime: 0,
            worstLoadTime: 0,
            bestLoadTime: Infinity
        };
        this.startTime = performance.now();
        console.log('📊 Performance metrics reset');
    }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// Make it available globally
window.performanceMonitor = performanceMonitor;

// Auto-start periodic reporting in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    performanceMonitor.startPeriodicReporting(120); // Every 2 minutes
}