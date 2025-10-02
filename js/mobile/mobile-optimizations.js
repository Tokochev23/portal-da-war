// === OTIMIZAÇÕES PARA DISPOSITIVOS MÓVEIS ===

import { Logger, DOMUtils, ValidationUtils } from '../utils.js';
import { A11y } from '../accessibility/a11y.js';

class MobileOptimizations {
    constructor() {
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isTablet = /iPad|Android.*Tablet/i.test(navigator.userAgent);
        this.hasTouch = 'ontouchstart' in window;
        this.viewportWidth = window.innerWidth;
        this.searchResults = [];
        this.currentSearchTerm = '';
        this.searchIndex = null;
        
        if (this.isMobile || this.hasTouch) {
            this.init();
        }
    }
    
    init() {
        Logger.info('🔧 Inicializando otimizações mobile');
        this.setupMobileViewport();
        this.addMobileClasses();
        this.createSearchBar();
        this.setupTouchGestures();
        this.createMobileMenu();
        this.setupMobilePanels();
        this.createQuickActions();
        this.optimizeForMobile();
        Logger.info('✅ Otimizações mobile ativadas');
    }

    setupMobileViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
            document.head.appendChild(viewport);
        }
        const style = document.createElement('style');
        style.textContent = `
            .no-zoom { touch-action: manipulation; }
            button, .country-card-button { touch-action: manipulation; }
        `;
        document.head.appendChild(style);
    }

    addMobileClasses() {
        document.body.classList.add(
            this.isMobile ? 'is-mobile' : 'is-desktop',
            this.isTablet ? 'is-tablet' : 'is-phone',
            this.hasTouch ? 'has-touch' : 'no-touch'
        );
    }

    setupTouchGestures() {
        let startY = 0, currentY = 0, isScrolling = false, pullToRefreshTriggered = false;
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isScrolling = false;
                pullToRefreshTriggered = false;
            }
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                currentY = e.touches[0].clientY;
                const pullDistance = currentY - startY;
                if (pullDistance > 60 && !pullToRefreshTriggered) {
                    pullToRefreshTriggered = true;
                    this.showPullToRefresh();
                    if (navigator.vibrate) navigator.vibrate(30);
                }
            }
        }, { passive: true });
        document.addEventListener('touchend', () => {
            if (pullToRefreshTriggered) this.triggerRefresh();
            this.hidePullToRefresh();
            startY = 0; isScrolling = false; pullToRefreshTriggered = false;
        }, { passive: true });
        this.setupSwipeGestures();
        this.setupLongPress();
    }

    setupSwipeGestures() {
        let startX = 0, startY = 0, currentCard = null;
        document.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.country-card-button');
            if (card) { startX = e.touches[0].clientX; startY = e.touches[0].clientY; currentCard = card; }
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (!currentCard) return;
            const diffX = startX - e.touches[0].clientX, diffY = startY - e.touches[0].clientY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                e.preventDefault();
                this.showCardSwipeActions(currentCard, diffX > 0 ? 'left' : 'right');
            }
        });
        document.addEventListener('touchend', () => { if (currentCard) { this.hideCardSwipeActions(currentCard); currentCard = null; } }, { passive: true });
    }

    setupLongPress() {
        let pressTimer;
        document.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.country-card-button');
            if (card) pressTimer = setTimeout(() => { this.showCardContextMenu(card, e.touches[0].clientX, e.touches[0].clientY); if (navigator.vibrate) navigator.vibrate(50); }, 500);
        }, { passive: true });
        document.addEventListener('touchend', () => clearTimeout(pressTimer), { passive: true });
        document.addEventListener('touchmove', () => clearTimeout(pressTimer), { passive: true });
    }

    showPullToRefresh() {
        let indicator = document.getElementById('pull-refresh-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pull-refresh-indicator';
            indicator.className = 'fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-brand-500 text-slate-950 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all';
            indicator.innerHTML = `<div class="animate-spin h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full"></div><span class="text-sm font-medium">Puxe para atualizar</span>`;
            document.body.appendChild(indicator);
        }
        indicator.style.transform = 'translate(-50%, 0)';
    }

    hidePullToRefresh() {
        const indicator = document.getElementById('pull-refresh-indicator');
        if (indicator) { indicator.style.transform = 'translate(-50%, -100%)'; setTimeout(() => indicator.remove(), 300); }
    }

    triggerRefresh() {
        if (window.loadSiteData) window.loadSiteData();
        const indicator = document.getElementById('pull-refresh-indicator');
        if (indicator) {
            indicator.innerHTML = `<svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><span class="text-sm font-medium">Atualizado!</span>`;
            indicator.className = indicator.className.replace('bg-brand-500', 'bg-emerald-500');
        }
        A11y.announce('Lista de países atualizada');
        Logger.info('📱 Pull-to-refresh executado');
    }

    showCardSwipeActions(card, direction) {
        if (!card.querySelector('.swipe-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'swipe-indicator absolute inset-y-0 right-2 flex items-center text-brand-400 opacity-50';
            indicator.innerHTML = direction === 'left' ? '👁️ Ver detalhes' : '⭐ Favoritar';
            card.style.position = 'relative';
            card.appendChild(indicator);
        }
    }

    hideCardSwipeActions(card) {
        const indicator = card.querySelector('.swipe-indicator');
        if (indicator) indicator.remove();
    }

    showCardContextMenu(card, x, y) {
        const countryName = card.querySelector('.text-sm.font-semibold')?.textContent, countryId = card.dataset.countryId;
        const menu = document.createElement('div');
        menu.className = 'fixed z-50 bg-bg-soft border border-bg-ring/70 rounded-xl shadow-xl p-2 min-w-48';
        menu.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
        menu.style.top = `${Math.min(y, window.innerHeight - 150)}px`;
        menu.innerHTML = `
            <div class="text-sm font-medium text-slate-200 px-3 py-2 border-b border-bg-ring/50">${ValidationUtils.sanitizeInput(countryName || 'País')}</div>
            <button class="context-menu-item" data-action="view">...</button>
            ...
        `;
        menu.querySelectorAll('.context-menu-item').forEach(item => item.addEventListener('click', () => { this.handleContextAction(item.dataset.action, countryId, countryName); menu.remove(); }));
        const closeMenu = (e) => { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('touchstart', closeMenu); } };
        document.addEventListener('touchstart', closeMenu);
        document.body.appendChild(menu);
    }

    handleContextAction(action, countryId, countryName) {
        // ... (implementation)
    }

    createMobileMenu() {
        // ... (implementation)
    }

    showMobileMenu() {
        // ... (implementation)
    }

    addMobileMenuStyles() {
        // ... (implementation)
    }

    setupMobilePanels() {
        // ... (implementation)
    }

    convertToSlideUp(selector, title) {
        // ... (implementation)
    }

    showSlideUpPanel(originalPanel, title) {
        // ... (implementation)
    }

    setupSwipeToClose(panel, closeCallback) {
        // ... (implementation)
    }

    createQuickActions() {
        // ... (implementation)
    }

    openQuickActions(fab) {
        // ... (implementation)
    }

    closeQuickActions(fab) {
        // ... (implementation)
    }

    optimizeForMobile() {
        // ... (implementation)
    }

    addShowMoreButton(allCountries, currentCount) {
        // ... (implementation)
    }

    debounceScrollEvents() {
        // ... (implementation)
    }

    toggleFavorite(countryId, countryName) {
        // ... (implementation)
    }

    shareCountry(countryId, countryName) {
        // ... (implementation)
    }

    addToCompare(countryId, countryName) {
        // ... (implementation)
    }

    showFavorites() {
        // ... (implementation)
    }

    updateFavoriteIndicators() {
        // ... (implementation)
    }

    createSearchBar() {
        // ... (implementation)
    }

    setupSearchFunctionality() {
        // ... (implementation)
    }

    performSearch(term) {
        // ... (implementation)
    }

    createSearchIndex(countries) {
        // ... (implementation)
    }

    fuzzySearch(term, countries) {
        // ... (implementation)
    }

    fuzzyMatch(term, text) {
        // ... (implementation)
    }

    getRegion(countryName) {
        // ... (implementation)
    }
}

export function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenu = document.getElementById('close-mobile-menu');

    function openMobileMenu() {
        if (!mobileMenuOverlay) return;
        mobileMenuOverlay.classList.remove('hidden');
        setTimeout(() => { if(mobileMenu) mobileMenu.style.transform = 'translateX(0)'; }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenuFunc() {
        if (!mobileMenuOverlay || !mobileMenu) return;
        mobileMenu.style.transform = 'translateX(100%)';
        setTimeout(() => {
            mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    mobileMenuBtn?.addEventListener('click', openMobileMenu);
    closeMobileMenu?.addEventListener('click', closeMobileMenuFunc);
    mobileMenuOverlay?.addEventListener('click', (e) => { if (e.target === mobileMenuOverlay) closeMobileMenuFunc(); });
    document.querySelectorAll('.mobile-menu-item').forEach(item => item.addEventListener('click', closeMobileMenuFunc));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !mobileMenuOverlay?.classList.contains('hidden')) closeMobileMenuFunc(); });
}

document.addEventListener('DOMContentLoaded', () => {
    const mobileOptimizations = new MobileOptimizations();
    window.__MOBILE_OPTIMIZATIONS__ = mobileOptimizations;
});

export default MobileOptimizations;