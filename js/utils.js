// === UTILIDADES CENTRALIZADAS ===

// === SISTEMA DE MODAIS UNIFICADO ===
class ModalManager {
    constructor() {
        this.createModalContainer();
    }

    createModalContainer() {
        if (document.getElementById('unified-modal-container')) return;
        
        const container = document.createElement('div');
        container.id = 'unified-modal-container';
        container.innerHTML = `
            <div id="message-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm hidden" role="dialog" aria-modal="true">
                <div class="w-full max-w-md rounded-2xl bg-bg-soft border border-bg-ring/70 p-6">
                    <h2 id="modal-title" class="text-xl font-bold text-slate-100 mb-4"></h2>
                    <p id="modal-text" class="text-sm text-slate-300 mb-6"></p>
                    <div class="flex gap-3 justify-end">
                        <button id="modal-cancel-btn" class="px-4 py-2 rounded-xl border border-bg-ring/70 text-slate-300 hover:bg-white/5 transition-all" aria-label="Cancelar">Cancelar</button>
                        <button id="modal-ok-btn" class="px-4 py-2 rounded-xl bg-brand-500 text-slate-950 font-semibold hover:bg-brand-400 transition-all" aria-label="Confirmar">OK</button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(container);
    }

    show(title, message, showCancel = false) {
        const modal = document.getElementById('message-modal');
        const titleEl = document.getElementById('modal-title');
        const textEl = document.getElementById('modal-text');
        const cancelBtn = document.getElementById('modal-cancel-btn');
        const okBtn = document.getElementById('modal-ok-btn');

        if (!modal || !titleEl || !textEl || !cancelBtn || !okBtn) {
            console.error('Elementos do modal não encontrados');
            return Promise.resolve(false);
        }

        titleEl.textContent = title;
        textEl.textContent = message;
        cancelBtn.style.display = showCancel ? 'block' : 'none';
        modal.classList.remove('hidden');
        
        // Focus no botão OK para acessibilidade
        okBtn.focus();

        return new Promise(resolve => {
            const cleanup = () => {
                modal.classList.add('hidden');
                okBtn.onclick = null;
                cancelBtn.onclick = null;
                document.removeEventListener('keydown', handleEscape);
            };

            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    resolve(false);
                }
            };

            okBtn.onclick = () => {
                cleanup();
                resolve(true);
            };

            cancelBtn.onclick = () => {
                cleanup();
                resolve(false);
            };

            document.addEventListener('keydown', handleEscape);
        });
    }
}

const modalManager = new ModalManager();

export function showMessageBox(title, message) {
    return modalManager.show(title, message, false);
}

export function showConfirmBox(title, message) {
    return modalManager.show(title, message, true);
}

// === FORMATAÇÃO UNIFICADA ===
class Formatter {
    static formatCurrency(valor, currency = 'USD', locale = 'pt-BR') {
        const numero = this.parseNumber(valor);
        if (isNaN(numero)) return currency === 'USD' ? '$0' : '0';
        
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numero);
    }

    static parseNumber(valor) {
        if (typeof valor === 'number') return valor;
        return parseFloat(String(valor).replace(/[^-0-9.,]/g, '').replace(',', '.'));
    }

    static formatNumber(valor, locale = 'pt-BR') {
        const numero = this.parseNumber(valor);
        if (isNaN(numero)) return '0';
        return new Intl.NumberFormat(locale).format(numero);
    }

    static formatPercent(valor, decimals = 1) {
        const numero = this.parseNumber(valor);
        if (isNaN(numero)) return '0%';
        return `${numero.toFixed(decimals)}%`;
    }
    
    static formatCurrencyCompact(valor, currency = 'USD', locale = 'pt-BR') {
        const numero = this.parseNumber(valor);
        if (isNaN(numero)) return currency === 'USD' ? '$0' : '0';
        
        // Para números menores que 1 trilhão, usa formato normal
        if (numero < 1000000000000) {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(numero);
        }
        
        // Para números muito grandes, usa notação compacta
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            notation: 'compact',
            compactDisplay: 'short',
            minimumFractionDigits: 0,
            maximumFractionDigits: 1
        }).format(numero);
    }
}

// Mantém compatibilidade com código existente
export function formatCurrency(valor) {
    return Formatter.formatCurrency(valor);
}

export function formatCurrencyCompact(valor) {
    return Formatter.formatCurrencyCompact(valor);
}

export function formatNumber(valor) {
    return Formatter.formatNumber(valor);
}

export { Formatter };

// === UTILITÁRIOS DE CÁLCULO ===
class MathUtils {
    // Formata a diferença entre dois valores como percentual
    static formatDelta(atual, anterior, options = {}) {
        const { showIcon = false, precision = 1, neutralColor = 'text-slate-400' } = options;
        
        if (!anterior || anterior === 0) return `<span class="${neutralColor}">---</span>`;
        
        const diferenca = atual - anterior;
        const percentual = ((diferenca / anterior) * 100).toFixed(precision);
        const sinal = diferenca >= 0 ? '+' : '';
        const cor = diferenca > 0 ? 'text-emerald-400' : 
                    diferenca < 0 ? 'text-red-400' : neutralColor;
        const icon = showIcon ? 
            (diferenca > 0 ? '↗' : diferenca < 0 ? '↘' : '→') : '';
        
        return `<span class="${cor}">${icon}${sinal}${percentual}%</span>`;
    }
    
    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    // Interpolação linear
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Gerar número aleatório em range
    static randomInRange(min, max, integer = false) {
        const value = Math.random() * (max - min) + min;
        return integer ? Math.floor(value) : value;
    }
}

// Mantém compatibilidade com código existente
export function formatDelta(atual, anterior) {
    return MathUtils.formatDelta(atual, anterior);
}

export { MathUtils };

// === UTILITÁRIOS DE VALIDAÇÃO E SEGURANÇA ===
class ValidationUtils {
    // Validar email
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Validar senha forte
    static isStrongPassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
    }
    
    // Sanitizar entrada de texto
    static sanitizeInput(input, options = {}) {
        const { allowHTML = false, maxLength = null } = options;
        
        let sanitized = String(input).trim();
        
        if (!allowHTML) {
            sanitized = sanitized
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;');
        }
        
        if (maxLength && sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }
        
        return sanitized;
    }
    
    // Validar entrada numérica
    static validateNumber(value, min = null, max = null) {
        const num = Formatter.parseNumber(value);
        if (isNaN(num)) return { valid: false, error: 'Valor deve ser um número' };
        if (min !== null && num < min) return { valid: false, error: `Valor deve ser maior que ${min}` };
        if (max !== null && num > max) return { valid: false, error: `Valor deve ser menor que ${max}` };
        return { valid: true, value: num };
    }
}

// === UTILITÁRIOS DE CACHE E PERFORMANCE ===
class CacheUtils {
    constructor() {
        this.cache = new Map();
        this.timestamps = new Map();
    }
    
    set(key, value, ttl = 300000) { // TTL padrão: 5 minutos
        this.cache.set(key, value);
        this.timestamps.set(key, Date.now() + ttl);
    }
    
    get(key) {
        const timestamp = this.timestamps.get(key);
        if (!timestamp || Date.now() > timestamp) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            return null;
        }
        return this.cache.get(key);
    }
    
    has(key) {
        return this.get(key) !== null;
    }
    
    clear() {
        this.cache.clear();
        this.timestamps.clear();
    }
    
    // Cache com callback para buscar dados se não existir
    async getOrFetch(key, fetchFn, ttl = 300000) {
        let value = this.get(key);
        if (value === null) {
            try {
                value = await fetchFn();
                this.set(key, value, ttl);
            } catch (error) {
                console.error(`Erro ao buscar dados para cache ${key}:`, error);
                throw error;
            }
        }
        return value;
    }
}

// === SISTEMA DE LOG CENTRALIZADO ===
class Logger {
    static levels = {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3
    };
    
    static currentLevel = this.levels.INFO;
    
    static log(level, message, ...args) {
        if (level > this.currentLevel) return;
        
        const timestamp = new Date().toISOString();
        const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
        const levelName = levelNames[level];
        
        const logEntry = {
            timestamp,
            level: levelName,
            message,
            data: args
        };
        
        // Console output with colors
        const colors = ['🔴', '🟡', '🔵', '🟣'];
        console.log(`${colors[level]} [${timestamp}] ${levelName}: ${message}`, ...args);
        
        // Store in localStorage for debugging (limit size)
        try {
            const logs = JSON.parse(localStorage.getItem('war1954_logs') || '[]');
            logs.push(logEntry);
            if (logs.length > 100) logs.splice(0, 50); // Keep last 100 entries
            localStorage.setItem('war1954_logs', JSON.stringify(logs));
        } catch (error) {
            console.error('Failed to store log:', error);
        }
    }
    
    static error(message, ...args) { this.log(this.levels.ERROR, message, ...args); }
    static warn(message, ...args) { this.log(this.levels.WARN, message, ...args); }
    static info(message, ...args) { this.log(this.levels.INFO, message, ...args); }
    static debug(message, ...args) { this.log(this.levels.DEBUG, message, ...args); }
    
    static getLogs() {
        try {
            return JSON.parse(localStorage.getItem('war1954_logs') || '[]');
        } catch {
            return [];
        }
    }
    
    static clearLogs() {
        localStorage.removeItem('war1954_logs');
    }
}

// Instâncias globais
const globalCache = new CacheUtils();

export { ValidationUtils, CacheUtils, Logger, globalCache };

// === UTILITÁRIOS DE ANIMAÇÃO E DOM ===
class DOMUtils {
    // Anima um contador para um valor final
    static animateCounter(elementId, finalValue, options = {}) {
        const { 
            duration = 1000, 
            locale = 'pt-BR',
            onComplete = null,
            easing = 'easeOutQuart'
        } = options;
        
        const element = typeof elementId === 'string' 
            ? document.getElementById(elementId) 
            : elementId;
            
        if (!element) {
            console.warn(`Elemento não encontrado: ${elementId}`);
            return;
        }
        
        const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        const diff = finalValue - currentValue;
        
        if (diff === 0) {
            onComplete?.();
            return;
        }
        
        const startTime = Date.now();
        const easingFunctions = {
            linear: t => t,
            easeOutQuart: t => 1 - Math.pow(1 - t, 4),
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        };
        
        const easeFn = easingFunctions[easing] || easingFunctions.easeOutQuart;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeFn(progress);
            
            const currentCounter = currentValue + (diff * easedProgress);
            element.textContent = Math.round(currentCounter).toLocaleString(locale);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = Math.round(finalValue).toLocaleString(locale);
                onComplete?.();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Debounce para otimização de performance
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }
    
    // Throttle para eventos frequentes
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Lazy loading de imagens
    static lazyLoadImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Mantém compatibilidade com código existente
export function animateCounter(elementId, finalValue) {
    DOMUtils.animateCounter(elementId, finalValue);
}

export { DOMUtils };
// Expor também no escopo global para consumidores que não usam import nomeado
try { window.DOMUtils = DOMUtils; } catch {}

// === SISTEMA DE NOTIFICAÇÕES APRIMORADO ===
class NotificationManager {
    constructor() {
        this.notifications = new Set();
        this.maxNotifications = 5;
    }

    show(type, message, options = {}) {
        const {
            duration = 4000,
            closable = true,
            position = 'top-right',
            persistent = false
        } = options;

        const colors = {
            success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
            error: 'bg-red-500/10 border-red-500/20 text-red-400',
            warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
            info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
        };

        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const positionClasses = {
            'top-right': 'top-4 right-4',
            'top-left': 'top-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'bottom-left': 'bottom-4 left-4'
        };

        const notification = document.createElement('div');
        notification.className = `fixed ${positionClasses[position]} z-50 px-4 py-3 rounded-xl border ${colors[type]} animate-slide-up shadow-lg max-w-md`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        const content = document.createElement('div');
        content.className = 'flex items-start gap-2';
        
        const icon = document.createElement('span');
        icon.className = 'text-lg flex-shrink-0';
        icon.textContent = icons[type] || icons.info;
        
        const text = document.createElement('span');
        text.className = 'flex-1 text-sm';
        text.textContent = message;
        
        content.appendChild(icon);
        content.appendChild(text);
        
        if (closable) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'ml-2 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity';
            closeBtn.innerHTML = '✕';
            closeBtn.setAttribute('aria-label', 'Fechar notificação');
            closeBtn.onclick = () => this.remove(notification);
            content.appendChild(closeBtn);
        }
        
        notification.appendChild(content);
        
        // Limitar número de notificações
        if (this.notifications.size >= this.maxNotifications) {
            const oldest = Array.from(this.notifications)[0];
            this.remove(oldest);
        }
        
        this.notifications.add(notification);
        document.body.appendChild(notification);
        
        if (!persistent && duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }
        
        return notification;
    }

    remove(notification) {
        if (!notification || !this.notifications.has(notification)) return;
        
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications.delete(notification);
        }, 300);
    }

    clear() {
        Array.from(this.notifications).forEach(notification => {
            this.remove(notification);
        });
    }
}

const notificationManager = new NotificationManager();

// Mantém compatibilidade com código existente
export function showNotification(type, message, options) {
    return notificationManager.show(type, message, options);
}

export { NotificationManager };
