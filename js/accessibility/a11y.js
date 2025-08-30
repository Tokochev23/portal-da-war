// === SISTEMA DE ACESSIBILIDADE COMPLETO ===

import { Logger, DOMUtils } from '../utils.js';

class AccessibilityManager {
    constructor() {
        this.focusableElements = [];
        this.currentFocusIndex = -1;
        this.skipLinks = [];
        this.announcements = new Set();
        this.init();
    }

    init() {
        this.createSkipLinks();
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupLiveRegions();
        this.setupAnnouncements();
        this.setupColorContrastMode();
        this.setupReducedMotion();
        Logger.info('Sistema de acessibilidade inicializado');
    }

    // === SKIP LINKS ===
    createSkipLinks() {
        const skipContainer = document.createElement('div');
        skipContainer.className = 'skip-links sr-only-focusable';
        skipContainer.innerHTML = `
            <a href="#main-content" class="skip-link">Pular para conteúdo principal</a>
            <a href="#navigation" class="skip-link">Pular para navegação</a>
            <a href="#countries-list" class="skip-link">Pular para lista de países</a>
            <a href="#player-panel" class="skip-link">Pular para painel do jogador</a>
        `;
        
        document.body.insertBefore(skipContainer, document.body.firstChild);
        
        // Adicionar estilos CSS para skip links
        this.addSkipLinksStyles();
    }

    addSkipLinksStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .skip-links {
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 1000;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #ffb400;
                color: #0b1020;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                font-size: 14px;
                transition: top 0.3s ease;
            }
            
            .skip-link:focus {
                top: 6px;
            }
            
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            .sr-only-focusable:focus,
            .sr-only-focusable:active {
                position: static !important;
                width: auto !important;
                height: auto !important;
                padding: inherit !important;
                margin: inherit !important;
                overflow: visible !important;
                clip: auto !important;
                white-space: inherit !important;
            }
            
            /* Focus indicators melhorados */
            *:focus {
                outline: 2px solid #ffb400;
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            button:focus,
            .country-card-button:focus {
                outline: 2px solid #ffb400;
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(255, 180, 0, 0.2);
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .kpi-card,
                .country-card-button,
                .player-panel {
                    border: 2px solid #ffffff;
                    background: #000000;
                    color: #ffffff;
                }
                
                .text-slate-400 {
                    color: #ffffff !important;
                }
                
                .bg-slate-900\\/60 {
                    background: #000000 !important;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // === NAVEGAÇÃO POR TECLADO ===
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Tab':
                    this.handleTabNavigation(e);
                    break;
                case 'Escape':
                    this.handleEscape(e);
                    break;
                case 'Enter':
                case ' ':
                    this.handleActivation(e);
                    break;
                case 'ArrowDown':
                case 'ArrowUp':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.handleArrowNavigation(e);
                    break;
                case 'Home':
                case 'End':
                    this.handleHomeEnd(e);
                    break;
            }
        });
    }

    handleTabNavigation(e) {
        this.updateFocusableElements();
        
        if (this.focusableElements.length === 0) return;
        
        const currentIndex = this.focusableElements.indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Tab reverso
            const newIndex = currentIndex <= 0 ? this.focusableElements.length - 1 : currentIndex - 1;
            this.focusableElements[newIndex]?.focus();
        } else {
            // Tab normal
            const newIndex = currentIndex >= this.focusableElements.length - 1 ? 0 : currentIndex + 1;
            this.focusableElements[newIndex]?.focus();
        }
    }

    handleEscape(e) {
        // Fechar modais
        const modals = document.querySelectorAll('[role="dialog"]:not(.hidden)');
        modals.forEach(modal => {
            modal.classList.add('hidden');
            // Retornar foco para elemento que abriu o modal
            const trigger = modal.getAttribute('data-trigger-element');
            if (trigger) {
                document.getElementById(trigger)?.focus();
            }
        });
        
        // Limpar seleções
        const selected = document.querySelectorAll('[aria-selected="true"]');
        selected.forEach(el => el.setAttribute('aria-selected', 'false'));
    }

    handleActivation(e) {
        const target = e.target;
        
        // Simular click em elementos não-button que têm role="button"
        if (target.getAttribute('role') === 'button' && target.tagName !== 'BUTTON') {
            e.preventDefault();
            target.click();
        }
    }

    handleArrowNavigation(e) {
        const target = e.target;
        const parent = target.closest('[role="grid"], [role="listbox"], [role="tablist"]');
        
        if (!parent) return;
        
        e.preventDefault();
        
        const items = Array.from(parent.querySelectorAll('[role="gridcell"], [role="option"], [role="tab"]'));
        const currentIndex = items.indexOf(target);
        
        let newIndex;
        switch(e.key) {
            case 'ArrowDown':
                newIndex = Math.min(currentIndex + 1, items.length - 1);
                break;
            case 'ArrowUp':
                newIndex = Math.max(currentIndex - 1, 0);
                break;
            case 'ArrowRight':
                newIndex = Math.min(currentIndex + 1, items.length - 1);
                break;
            case 'ArrowLeft':
                newIndex = Math.max(currentIndex - 1, 0);
                break;
        }
        
        if (newIndex !== undefined && items[newIndex]) {
            items[newIndex].focus();
            // Atualizar aria-selected se aplicável
            items.forEach((item, index) => {
                item.setAttribute('aria-selected', index === newIndex ? 'true' : 'false');
            });
        }
    }

    handleHomeEnd(e) {
        const target = e.target;
        const parent = target.closest('[role="grid"], [role="listbox"]');
        
        if (!parent) return;
        
        e.preventDefault();
        
        const items = Array.from(parent.querySelectorAll('[role="gridcell"], [role="option"]'));
        
        if (e.key === 'Home' && items[0]) {
            items[0].focus();
        } else if (e.key === 'End' && items[items.length - 1]) {
            items[items.length - 1].focus();
        }
    }

    // === GERENCIAMENTO DE FOCO ===
    setupFocusManagement() {
        // Interceptar mudanças de foco para anunciar contexto
        document.addEventListener('focusin', (e) => {
            this.announceFocusContext(e.target);
        });
    }

    updateFocusableElements() {
        const selector = `
            button:not([disabled]):not(.hidden),
            [href]:not([disabled]):not(.hidden),
            input:not([disabled]):not(.hidden),
            select:not([disabled]):not(.hidden),
            textarea:not([disabled]):not(.hidden),
            [tabindex]:not([tabindex="-1"]):not([disabled]):not(.hidden),
            [role="button"]:not([disabled]):not(.hidden),
            [role="link"]:not([disabled]):not(.hidden)
        `;
        
        this.focusableElements = Array.from(document.querySelectorAll(selector))
            .filter(el => {
                const style = getComputedStyle(el);
                return style.display !== 'none' && style.visibility !== 'hidden';
            });
    }

    announceFocusContext(element) {
        let announcement = '';
        
        // Contextualizar baseado no pai
        const card = element.closest('.country-card-button');
        if (card) {
            const countryName = card.querySelector('.text-sm.font-semibold')?.textContent;
            const wpi = card.querySelector('[class*="font-bold"]')?.textContent;
            announcement = `País: ${countryName}, Índice de poder: ${wpi}`;
        }
        
        const panel = element.closest('.player-panel');
        if (panel) {
            announcement = 'Painel do jogador';
        }
        
        const modal = element.closest('[role="dialog"]');
        if (modal) {
            const title = modal.querySelector('h1, h2, h3')?.textContent;
            announcement = `Modal: ${title || 'Diálogo aberto'}`;
        }
        
        if (announcement) {
            this.announce(announcement);
        }
    }

    // === LIVE REGIONS ===
    setupLiveRegions() {
        // Criar regiões para anúncios
        const liveRegions = [
            { id: 'live-polite', level: 'polite' },
            { id: 'live-assertive', level: 'assertive' },
            { id: 'live-status', level: 'polite' }
        ];
        
        liveRegions.forEach(region => {
            if (!document.getElementById(region.id)) {
                const liveRegion = document.createElement('div');
                liveRegion.id = region.id;
                liveRegion.className = 'sr-only';
                liveRegion.setAttribute('aria-live', region.level);
                liveRegion.setAttribute('aria-atomic', 'true');
                document.body.appendChild(liveRegion);
            }
        });
    }

    // === ANÚNCIOS PARA SCREEN READERS ===
    setupAnnouncements() {
        // Interceptar notificações para anunciar
        const originalShowNotification = window.showNotification;
        if (originalShowNotification) {
            window.showNotification = (type, message, options) => {
                this.announce(`${type}: ${message}`, type === 'error' ? 'assertive' : 'polite');
                return originalShowNotification(type, message, options);
            };
        }
    }

    announce(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'live-assertive' : 'live-polite';
        const region = document.getElementById(regionId);
        
        if (!region || this.announcements.has(message)) return;
        
        this.announcements.add(message);
        
        // Limpar região primeiro
        region.textContent = '';
        
        // Adicionar mensagem após pequeno delay
        setTimeout(() => {
            region.textContent = message;
            
            // Limpar após 5 segundos
            setTimeout(() => {
                region.textContent = '';
                this.announcements.delete(message);
            }, 5000);
        }, 100);
        
        Logger.debug(`Anúncio (${priority}): ${message}`);
    }

    // === MODO ALTO CONTRASTE ===
    setupColorContrastMode() {
        // Detectar preferência do sistema
        const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
        
        this.applyContrastMode(highContrastQuery.matches);
        
        highContrastQuery.addEventListener('change', (e) => {
            this.applyContrastMode(e.matches);
        });
        
        // Toggle manual
        this.createContrastToggle();
    }

    createContrastToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'contrast-toggle';
        toggle.className = 'fixed top-4 left-4 z-50 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg sr-only-focusable';
        toggle.innerHTML = `
            <span class="sr-only">Alternar modo alto contraste</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
            </svg>
        `;
        
        toggle.addEventListener('click', () => {
            const isHighContrast = document.body.classList.toggle('high-contrast-mode');
            this.announce(`Modo alto contraste ${isHighContrast ? 'ativado' : 'desativado'}`);
            localStorage.setItem('highContrastMode', isHighContrast);
        });
        
        document.body.appendChild(toggle);
        
        // Restaurar preferência salva
        if (localStorage.getItem('highContrastMode') === 'true') {
            document.body.classList.add('high-contrast-mode');
        }
    }

    applyContrastMode(isHighContrast) {
        document.body.classList.toggle('system-high-contrast', isHighContrast);
        if (isHighContrast) {
            this.announce('Modo alto contraste do sistema detectado');
        }
    }

    // === MOVIMENTO REDUZIDO ===
    setupReducedMotion() {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        this.applyMotionPreference(motionQuery.matches);
        
        motionQuery.addEventListener('change', (e) => {
            this.applyMotionPreference(e.matches);
        });
    }

    applyMotionPreference(reduceMotion) {
        document.body.classList.toggle('reduce-motion', reduceMotion);
        
        if (reduceMotion) {
            // Desabilitar animações no DOMUtils
            if (window.DOMUtils) {
                const originalAnimateCounter = DOMUtils.animateCounter;
                DOMUtils.animateCounter = (elementId, finalValue, options = {}) => {
                    const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
                    if (element) {
                        element.textContent = finalValue.toLocaleString(options.locale || 'pt-BR');
                        options.onComplete?.();
                    }
                };
            }
            
            this.announce('Animações reduzidas ativadas');
        }
    }

    // === LANDMARKS E ESTRUTURA ===
    improveSemantics() {
        // Adicionar landmarks se não existirem
        const main = document.querySelector('main') || document.querySelector('#main-content');
        if (!main) {
            const content = document.querySelector('.mx-auto.max-w-7xl') || document.body;
            if (content && !content.querySelector('main')) {
                content.setAttribute('role', 'main');
                content.id = 'main-content';
            }
        }
        
        // Melhorar navegação
        const nav = document.querySelector('nav');
        if (nav && !nav.id) {
            nav.id = 'navigation';
            nav.setAttribute('aria-label', 'Navegação principal');
        }
        
        // Melhorar lista de países
        const countriesList = document.getElementById('lista-paises-publicos');
        if (countriesList) {
            countriesList.setAttribute('role', 'grid');
            countriesList.setAttribute('aria-label', 'Lista de países disponíveis');
            countriesList.id = 'countries-list';
            
            // Melhorar cards de países
            const countryCards = countriesList.querySelectorAll('.country-card-button');
            countryCards.forEach((card, index) => {
                card.setAttribute('role', 'gridcell');
                card.setAttribute('aria-rowindex', Math.floor(index / 4) + 1);
                card.setAttribute('aria-colindex', (index % 4) + 1);
                
                const countryName = card.querySelector('.text-sm.font-semibold')?.textContent;
                if (countryName) {
                    card.setAttribute('aria-label', `Selecionar país ${countryName}`);
                }
            });
        }
        
        // Melhorar formulários
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label') && !input.id) {
                const label = input.parentElement.querySelector('label');
                if (label) {
                    const id = `input-${Math.random().toString(36).substr(2, 9)}`;
                    input.id = id;
                    label.setAttribute('for', id);
                } else {
                    const placeholder = input.getAttribute('placeholder');
                    if (placeholder) {
                        input.setAttribute('aria-label', placeholder);
                    }
                }
            }
            
            // Adicionar aria-required para campos obrigatórios
            if (input.hasAttribute('required')) {
                input.setAttribute('aria-required', 'true');
            }
        });
    }

    // === TESTES DE ACESSIBILIDADE ===
    runAccessibilityCheck() {
        const issues = [];
        
        // Verificar imagens sem alt
        document.querySelectorAll('img:not([alt])').forEach(img => {
            issues.push(`Imagem sem texto alternativo: ${img.src}`);
        });
        
        // Verificar contraste de cores (simulação simples)
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const style = getComputedStyle(el);
            const color = style.color;
            const background = style.backgroundColor;
            
            if (color && background && color !== 'rgba(0, 0, 0, 0)' && background !== 'rgba(0, 0, 0, 0)') {
                // Aqui seria implementada verificação real de contraste
                // Para simplicidade, apenas logamos
                Logger.debug(`Elemento com cores definidas:`, { color, background });
            }
        });
        
        // Verificar elementos interativos sem labels
        document.querySelectorAll('button:not([aria-label]):not([title])').forEach(btn => {
            if (!btn.textContent.trim()) {
                issues.push(`Botão sem label: ${btn.outerHTML.substring(0, 50)}...`);
            }
        });
        
        // Verificar ordem de headings
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        let lastLevel = 0;
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                issues.push(`Heading level skip: ${heading.tagName} after h${lastLevel}`);
            }
            lastLevel = level;
        });
        
        if (issues.length > 0) {
            Logger.warn('Issues de acessibilidade encontrados:', issues);
        } else {
            Logger.info('Nenhum issue crítico de acessibilidade encontrado');
        }
        
        return issues;
    }
}

// Instanciar e exportar
const accessibilityManager = new AccessibilityManager();

// API pública
export const A11y = {
    announce: (message, priority) => accessibilityManager.announce(message, priority),
    focus: (element) => {
        if (typeof element === 'string') {
            element = document.getElementById(element) || document.querySelector(element);
        }
        element?.focus();
    },
    check: () => accessibilityManager.runAccessibilityCheck(),
    improveSemantics: () => accessibilityManager.improveSemantics()
};

// Auto-inicialização
document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager.improveSemantics();
    Logger.info('Sistema de acessibilidade totalmente carregado');
});

export default accessibilityManager;