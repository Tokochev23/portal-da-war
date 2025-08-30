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
        
        // 1. Configurações básicas mobile
        this.setupMobileViewport();
        this.addMobileClasses();
        
        // 2. Barra de busca inteligente
        this.createSearchBar();
        
        // 3. Gestos touch
        this.setupTouchGestures();
        
        // 4. Menu mobile
        this.createMobileMenu();
        
        // 5. Painel slide-up mobile
        this.setupMobilePanels();
        
        // 6. Quick actions mobile
        this.createQuickActions();
        
        // 7. Otimizações de performance mobile
        this.optimizeForMobile();
        
        Logger.info('✅ Otimizações mobile ativadas');
    }
    
    // === CONFIGURAÇÕES BÁSICAS ===
    setupMobileViewport() {
        // Adicionar meta viewport se não existir
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
            document.head.appendChild(viewport);
        }
        
        // Prevenir zoom duplo-toque em elementos específicos
        const style = document.createElement('style');
        style.textContent = `
            .no-zoom {
                touch-action: manipulation;
            }
            
            button, .country-card-button {
                touch-action: manipulation;
            }
        `;
        document.head.appendChild(style);
    }
    
    // === GESTOS TOUCH ===
    setupTouchGestures() {
        let startY = 0;
        let currentY = 0;
        let isScrolling = false;
        let pullToRefreshTriggered = false;
        
        // Pull-to-refresh
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
            if (pullToRefreshTriggered) {
                this.triggerRefresh();
            }
            this.hidePullToRefresh();
            startY = 0;
            isScrolling = false;
            pullToRefreshTriggered = false;
        }, { passive: true });
        
        // Swipe gestures nos cards
        this.setupSwipeGestures();
        
        // Long press para mais opções
        this.setupLongPress();
    }
    
    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let currentCard = null;
        
        document.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.country-card-button');
            if (card) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                currentCard = card;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!currentCard) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Se é um swipe horizontal (não scroll vertical)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                e.preventDefault();
                this.showCardSwipeActions(currentCard, diffX > 0 ? 'left' : 'right');
            }
        });
        
        document.addEventListener('touchend', () => {
            if (currentCard) {
                this.hideCardSwipeActions(currentCard);
                currentCard = null;
            }
        }, { passive: true });
    }
    
    setupLongPress() {
        let pressTimer;
        
        document.addEventListener('touchstart', (e) => {
            const card = e.target.closest('.country-card-button');
            if (card) {
                pressTimer = setTimeout(() => {
                    this.showCardContextMenu(card, e.touches[0].clientX, e.touches[0].clientY);
                    if (navigator.vibrate) navigator.vibrate(50);
                }, 500);
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        }, { passive: true });
        
        document.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        }, { passive: true });
    }
    
    showPullToRefresh() {
        let indicator = document.getElementById('pull-refresh-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pull-refresh-indicator';
            indicator.className = 'fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-brand-500 text-slate-950 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all';
            indicator.innerHTML = `
                <div class="animate-spin h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full"></div>
                <span class="text-sm font-medium">Puxe para atualizar</span>
            `;
            document.body.appendChild(indicator);
        }
        indicator.style.transform = 'translate(-50%, 0)';
    }
    
    hidePullToRefresh() {
        const indicator = document.getElementById('pull-refresh-indicator');
        if (indicator) {
            indicator.style.transform = 'translate(-50%, -100%)';
            setTimeout(() => indicator.remove(), 300);
        }
    }
    
    triggerRefresh() {
        // Atualizar dados
        if (window.loadSiteData) {
            window.loadSiteData();
        }
        
        // Feedback visual
        const indicator = document.getElementById('pull-refresh-indicator');
        if (indicator) {
            indicator.innerHTML = `
                <svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-sm font-medium">Atualizado!</span>
            `;
            indicator.className = indicator.className.replace('bg-brand-500', 'bg-emerald-500');
        }
        
        A11y.announce('Lista de países atualizada');
        Logger.info('📱 Pull-to-refresh executado');
    }
    
    showCardSwipeActions(card, direction) {
        const countryName = card.querySelector('.text-sm.font-semibold')?.textContent;
        
        // Adicionar indicador visual
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
        if (indicator) {
            indicator.remove();
        }
    }
    
    showCardContextMenu(card, x, y) {
        const countryName = card.querySelector('.text-sm.font-semibold')?.textContent;
        const countryId = card.dataset.countryId;
        
        const menu = document.createElement('div');
        menu.className = 'fixed z-50 bg-bg-soft border border-bg-ring/70 rounded-xl shadow-xl p-2 min-w-48';
        menu.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
        menu.style.top = `${Math.min(y, window.innerHeight - 150)}px`;
        
        menu.innerHTML = `
            <div class="text-sm font-medium text-slate-200 px-3 py-2 border-b border-bg-ring/50">
                ${ValidationUtils.sanitizeInput(countryName || 'País')}
            </div>
            <button class="context-menu-item" data-action="view">
                <span class="emoji">👁️</span>
                <span>Ver detalhes</span>
            </button>
            <button class="context-menu-item" data-action="favorite">
                <span class="emoji">⭐</span>
                <span>Adicionar aos favoritos</span>
            </button>
            <button class="context-menu-item" data-action="share">
                <span class="emoji">📤</span>
                <span>Compartilhar</span>
            </button>
            <button class="context-menu-item" data-action="compare">
                <span class="emoji">⚖️</span>
                <span>Comparar</span>
            </button>
        `;
        
        // Event listeners
        menu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleContextAction(item.dataset.action, countryId, countryName);
                menu.remove();
            });
        });
        
        // Fechar ao tocar fora
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('touchstart', closeMenu);
            }
        };
        document.addEventListener('touchstart', closeMenu);
        
        document.body.appendChild(menu);
        
        // Adicionar estilos
        if (!document.getElementById('context-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'context-menu-styles';
            style.textContent = `
                .context-menu-item {
                    @apply w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-3 text-sm text-slate-200;
                }
                .context-menu-item .emoji {
                    @apply text-base;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    handleContextAction(action, countryId, countryName) {
        switch (action) {
            case 'view':
                // Abrir painel detalhado
                if (window.showCountryDetails) {
                    window.showCountryDetails(countryId);
                }
                break;
            case 'favorite':
                this.toggleFavorite(countryId, countryName);
                break;
            case 'share':
                this.shareCountry(countryId, countryName);
                break;
            case 'compare':
                this.addToCompare(countryId, countryName);
                break;
        }
        
        A11y.announce(`Ação ${action} executada para ${countryName}`);
    }
    
    // === MENU MOBILE ===
    createMobileMenu() {
        if (this.viewportWidth > 768) return; // Apenas em telas pequenas
        
        const header = document.querySelector('header');
        if (!header) return;
        
        // Hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'md:hidden p-2 text-slate-300 hover:text-white transition-colors';
        hamburger.innerHTML = `
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        `;
        hamburger.setAttribute('aria-label', 'Abrir menu');
        
        // Inserir no header
        const nav = header.querySelector('nav');
        if (nav) {
            nav.style.display = 'none'; // Esconder nav original em mobile
            header.appendChild(hamburger);
        }
        
        // Menu overlay
        hamburger.addEventListener('click', () => {
            this.showMobileMenu();
        });
    }
    
    showMobileMenu() {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm';
        
        const menu = document.createElement('div');
        menu.className = 'fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-bg border-l border-bg-ring/70 shadow-xl transform translate-x-full transition-transform duration-300';
        
        menu.innerHTML = `
            <div class="flex items-center justify-between p-4 border-b border-bg-ring/70">
                <h2 class="text-lg font-semibold text-slate-100">Menu</h2>
                <button id="close-mobile-menu" class="p-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <nav class="p-4">
                <div class="space-y-2">
                    <a href="#paises" class="mobile-menu-item">
                        <span class="emoji">🌍</span>
                        <span>Países</span>
                    </a>
                    <a href="#turnos" class="mobile-menu-item">
                        <span class="emoji">🔄</span>
                        <span>Turnos</span>
                    </a>
                    <a href="#regras" class="mobile-menu-item">
                        <span class="emoji">📋</span>
                        <span>Regras</span>
                    </a>
                    <a href="narrador.html" class="mobile-menu-item">
                        <span class="emoji">🎭</span>
                        <span>Narrador</span>
                    </a>
                    <a href="dashboard.html" class="mobile-menu-item">
                        <span class="emoji">📊</span>
                        <span>Meu Painel</span>
                    </a>
                </div>
                
                <div class="mt-6 pt-6 border-t border-bg-ring/70">
                    <button id="mobile-theme-toggle" class="mobile-menu-item">
                        <span class="emoji">🌙</span>
                        <span>Tema Escuro</span>
                    </button>
                    <button id="mobile-accessibility" class="mobile-menu-item">
                        <span class="emoji">♿</span>
                        <span>Acessibilidade</span>
                    </button>
                </div>
            </nav>
        `;
        
        overlay.appendChild(menu);
        document.body.appendChild(overlay);
        
        // Animar entrada
        requestAnimationFrame(() => {
            menu.style.transform = 'translateX(0)';
        });
        
        // Event listeners
        const closeMenu = () => {
            menu.style.transform = 'translateX(100%)';
            setTimeout(() => overlay.remove(), 300);
        };
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMenu();
        });
        
        menu.querySelector('#close-mobile-menu').addEventListener('click', closeMenu);
        
        // Links do menu
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
        
        // Adicionar estilos do menu
        this.addMobileMenuStyles();
    }
    
    addMobileMenuStyles() {
        if (document.getElementById('mobile-menu-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'mobile-menu-styles';
        style.textContent = `
            .mobile-menu-item {
                @apply flex items-center gap-3 w-full p-3 text-left text-slate-200 hover:bg-white/5 rounded-lg transition-colors;
            }
            
            .mobile-menu-item .emoji {
                @apply text-lg;
            }
            
            .mobile-menu-item:active {
                @apply bg-white/10 scale-98;
            }
        `;
        document.head.appendChild(style);
    }
    
    // === PAINÉIS SLIDE-UP MOBILE ===
    setupMobilePanels() {
        // Converter player panel em slide-up
        this.convertToSlideUp('#player-panel', 'Meu País');
        
        // Converter narrator tools em slide-up  
        this.convertToSlideUp('#narrator-tools', 'Ferramentas');
    }
    
    convertToSlideUp(selector, title) {
        const panel = document.querySelector(selector);
        if (!panel || this.viewportWidth > 768) return;
        
        // Criar trigger button
        const trigger = document.createElement('button');
        trigger.className = 'fixed bottom-4 right-4 z-40 bg-brand-500 text-slate-950 p-4 rounded-full shadow-lg hover:bg-brand-400 transition-all';
        trigger.innerHTML = `
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        `;
        trigger.setAttribute('aria-label', `Abrir ${title}`);
        
        // Esconder panel original
        panel.style.display = 'none';
        
        document.body.appendChild(trigger);
        
        trigger.addEventListener('click', () => {
            this.showSlideUpPanel(panel, title);
        });
    }
    
    showSlideUpPanel(originalPanel, title) {
        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 z-50 bg-black/30';
        
        const panel = document.createElement('div');
        panel.className = 'fixed bottom-0 left-0 right-0 bg-bg border-t border-bg-ring/70 rounded-t-2xl shadow-xl transform translate-y-full transition-transform duration-300 max-h-[85vh] overflow-y-auto';
        
        // Handle para arrastar
        panel.innerHTML = `
            <div class="flex items-center justify-between p-4 border-b border-bg-ring/70">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-1 bg-slate-500 rounded-full"></div>
                    <h2 class="text-lg font-semibold text-slate-100">${title}</h2>
                </div>
                <button class="close-slide-panel p-2 text-slate-400 hover:text-slate-200 transition-colors">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
            <div class="p-4">
                ${originalPanel.innerHTML}
            </div>
        `;
        
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        
        // Animar entrada
        requestAnimationFrame(() => {
            panel.style.transform = 'translateY(0)';
        });
        
        // Event listeners
        const closePanel = () => {
            panel.style.transform = 'translateY(100%)';
            setTimeout(() => overlay.remove(), 300);
        };
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePanel();
        });
        
        panel.querySelector('.close-slide-panel').addEventListener('click', closePanel);
        
        // Swipe down para fechar
        this.setupSwipeToClose(panel, closePanel);
    }
    
    setupSwipeToClose(panel, closeCallback) {
        let startY = 0;
        let currentY = 0;
        
        const handle = panel.querySelector('.w-12.h-1');
        
        panel.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        panel.addEventListener('touchmove', (e) => {
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            if (diff > 0) {
                panel.style.transform = `translateY(${Math.min(diff, 100)}px)`;
            }
        }, { passive: true });
        
        panel.addEventListener('touchend', () => {
            const diff = currentY - startY;
            
            if (diff > 100) {
                closeCallback();
            } else {
                panel.style.transform = 'translateY(0)';
            }
        }, { passive: true });
    }
    
    // === QUICK ACTIONS ===
    createQuickActions() {
        if (this.viewportWidth > 768) return;
        
        const fab = document.createElement('div');
        fab.className = 'fixed bottom-20 right-4 z-40 flex flex-col-reverse gap-3';
        fab.innerHTML = `
            <button id="main-fab" class="bg-brand-500 text-slate-950 p-4 rounded-full shadow-lg hover:bg-brand-400 transition-all">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        `;
        
        document.body.appendChild(fab);
        
        const mainFab = fab.querySelector('#main-fab');
        let isOpen = false;
        
        mainFab.addEventListener('click', () => {
            if (isOpen) {
                this.closeQuickActions(fab);
            } else {
                this.openQuickActions(fab);
            }
            isOpen = !isOpen;
        });
    }
    
    openQuickActions(fab) {
        const actions = [
            { icon: '🔍', label: 'Buscar', action: () => document.getElementById('country-search')?.focus() },
            { icon: '📊', label: 'Dashboard', action: () => window.location.href = 'dashboard.html' },
            { icon: '🔄', label: 'Atualizar', action: () => window.loadSiteData?.() },
            { icon: '⭐', label: 'Favoritos', action: () => this.showFavorites() }
        ];
        
        actions.forEach((action, index) => {
            const btn = document.createElement('button');
            btn.className = 'bg-bg-soft border border-bg-ring/70 text-slate-200 p-3 rounded-full shadow-lg hover:bg-slate-700 transition-all transform scale-0';
            btn.innerHTML = `
                <span class="text-lg">${action.icon}</span>
                <span class="sr-only">${action.label}</span>
            `;
            btn.addEventListener('click', action.action);
            
            fab.insertBefore(btn, fab.firstChild);
            
            // Animar entrada
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, index * 50);
        });
        
        // Rotacionar ícone principal
        const mainIcon = fab.querySelector('#main-fab svg');
        mainIcon.style.transform = 'rotate(45deg)';
    }
    
    closeQuickActions(fab) {
        const actionBtns = fab.querySelectorAll('button:not(#main-fab)');
        
        actionBtns.forEach((btn, index) => {
            setTimeout(() => {
                btn.style.transform = 'scale(0)';
                setTimeout(() => btn.remove(), 150);
            }, index * 30);
        });
        
        // Rotacionar ícone principal de volta
        const mainIcon = fab.querySelector('#main-fab svg');
        mainIcon.style.transform = 'rotate(0deg)';
    }
    
    // === OTIMIZAÇÕES DE PERFORMANCE ===
    optimizeForMobile() {
        // Reduzir quantidade de países renderizados inicialmente em mobile
        if (this.isMobile && window.appState?.allCountries) {
            const originalRender = window.renderPublicCountries;
            
            window.renderPublicCountries = (countries) => {
                // Em mobile, mostrar apenas 20 países inicialmente
                const limit = this.isMobile ? 20 : countries.length;
                const limited = countries.slice(0, limit);
                
                if (originalRender) {
                    originalRender(limited);
                }
                
                // Botão "Ver mais" se necessário
                if (countries.length > limit) {
                    this.addShowMoreButton(countries, limited.length);
                }
            };
        }
        
        // Debounce scroll events
        this.debounceScrollEvents();
        
        // Reduzir animações em mobile
        if (this.isMobile) {
            document.body.classList.add('reduce-animations');
        }
    }
    
    addShowMoreButton(allCountries, currentCount) {
        const container = document.getElementById('lista-paises-publicos');
        if (!container) return;
        
        let showMoreBtn = document.getElementById('show-more-countries');
        if (!showMoreBtn) {
            showMoreBtn = document.createElement('button');
            showMoreBtn.id = 'show-more-countries';
            showMoreBtn.className = 'col-span-full mt-4 p-4 bg-bg-soft border border-bg-ring/70 rounded-xl text-slate-300 hover:text-slate-100 hover:bg-slate-800/50 transition-colors';
            container.parentNode.appendChild(showMoreBtn);
        }
        
        const remaining = allCountries.length - currentCount;
        showMoreBtn.innerHTML = `
            <div class="flex items-center justify-center gap-2">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span>Ver mais ${remaining} países</span>
            </div>
        `;
        
        showMoreBtn.onclick = () => {
            // Renderizar próximos 20
            const nextBatch = allCountries.slice(currentCount, currentCount + 20);
            
            // Adicionar ao DOM existente
            nextBatch.forEach(country => {
                // Usar renderer para criar card individual
                const card = this.createCountryCard(country);
                container.appendChild(card);
            });
            
            const newCount = currentCount + nextBatch.length;
            
            if (newCount >= allCountries.length) {
                showMoreBtn.remove();
            } else {
                this.addShowMoreButton(allCountries, newCount);
            }
            
            A11y.announce(`${nextBatch.length} países adicionais carregados`);
        };
    }
    
    debounceScrollEvents() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Lógica de scroll otimizada aqui
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // === FUNCIONALIDADES MOBILE ESPECÍFICAS ===
    toggleFavorite(countryId, countryName) {
        const favorites = JSON.parse(localStorage.getItem('favoriteCountries') || '[]');
        const index = favorites.indexOf(countryId);
        
        if (index === -1) {
            favorites.push(countryId);
            localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
            showNotification('success', `${countryName} adicionado aos favoritos`);
        } else {
            favorites.splice(index, 1);
            localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
            showNotification('info', `${countryName} removido dos favoritos`);
        }
        
        this.updateFavoriteIndicators();
    }
    
    shareCountry(countryId, countryName) {
        if (navigator.share) {
            navigator.share({
                title: `${countryName} - WAR Era 1954`,
                text: `Confira os dados de ${countryName} no RPG WAR Era 1954`,
                url: `${window.location.origin}#country-${countryId}`
            }).catch(err => Logger.warn('Erro ao compartilhar:', err));
        } else {
            // Fallback para clipboard
            const url = `${window.location.origin}#country-${countryId}`;
            navigator.clipboard?.writeText(url).then(() => {
                showNotification('success', 'Link copiado para área de transferência!');
            });
        }
    }
    
    addToCompare(countryId, countryName) {
        const comparing = JSON.parse(sessionStorage.getItem('compareCountries') || '[]');
        
        if (comparing.length >= 3) {
            showNotification('warning', 'Máximo 3 países para comparação');
            return;
        }
        
        if (!comparing.find(c => c.id === countryId)) {
            comparing.push({ id: countryId, name: countryName });
            sessionStorage.setItem('compareCountries', JSON.stringify(comparing));
            showNotification('success', `${countryName} adicionado à comparação (${comparing.length}/3)`);
        }
    }
    
    showFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favoriteCountries') || '[]');
        
        if (favorites.length === 0) {
            showNotification('info', 'Nenhum país favoritado ainda');
            return;
        }
        
        // Filtrar países favoritos
        if (window.appState?.allCountries) {
            const favoriteCountries = window.appState.allCountries.filter(c => 
                favorites.includes(c.id)
            );
            
            if (window.renderPublicCountries) {
                window.renderPublicCountries(favoriteCountries);
            }
            
            A11y.announce(`Exibindo ${favoriteCountries.length} países favoritos`);
        }
    }
    
    updateFavoriteIndicators() {
        const favorites = JSON.parse(localStorage.getItem('favoriteCountries') || '[]');
        const cards = document.querySelectorAll('.country-card-button');
        
        cards.forEach(card => {
            const countryId = card.dataset.countryId;
            const isFavorite = favorites.includes(countryId);
            
            let indicator = card.querySelector('.favorite-indicator');
            if (isFavorite && !indicator) {
                indicator = document.createElement('div');
                indicator.className = 'favorite-indicator absolute top-2 right-2 text-yellow-400 text-sm';
                indicator.innerHTML = '⭐';
                card.style.position = 'relative';
                card.appendChild(indicator);
            } else if (!isFavorite && indicator) {
                indicator.remove();
            }
        });
    }
}

// Auto-inicialização
let mobileOptimizations = null;

document.addEventListener('DOMContentLoaded', () => {
    mobileOptimizations = new MobileOptimizations();
    
    // Expor para debug
    window.__MOBILE_OPTIMIZATIONS__ = mobileOptimizations;
});

export default MobileOptimizations;
    
    addMobileClasses() {
        document.body.classList.add(
            this.isMobile ? 'is-mobile' : 'is-desktop',
            this.isTablet ? 'is-tablet' : 'is-phone',
            this.hasTouch ? 'has-touch' : 'no-touch'
        );
    }
    
    // === BARRA DE BUSCA INTELIGENTE ===
    createSearchBar() {
        const countriesSection = document.querySelector('#paises');
        if (!countriesSection) return;
        
        const existingSearch = document.querySelector('#mobile-search-container');
        if (existingSearch) existingSearch.remove();
        
        const searchContainer = document.createElement('div');
        searchContainer.id = 'mobile-search-container';
        searchContainer.className = 'sticky top-16 z-30 bg-bg/95 backdrop-blur-sm border-b border-bg-ring/30 p-4 mb-4';
        searchContainer.innerHTML = `
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input 
                    type="text" 
                    id="country-search" 
                    class="block w-full pl-10 pr-12 py-3 border border-bg-ring/70 rounded-xl bg-bg-soft/50 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all text-base"
                    placeholder="Buscar países... (ex: Brasil, United States)"
                    autocomplete="off"
                    autocapitalize="words"
                    spellcheck="false"
                >
                <div class="absolute inset-y-0 right-0 flex items-center">
                    <button id="clear-search" class="p-2 text-slate-400 hover:text-slate-200 transition-colors hidden" aria-label="Limpar busca">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <!-- Filtros rápidos -->
            <div class="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button class="filter-chip active" data-filter="todos">
                    <span class="emoji">🌍</span>
                    <span class="text">Todos</span>
                </button>
                <button class="filter-chip" data-filter="publicos">
                    <span class="emoji">👁️</span>
                    <span class="text">Públicos</span>
                </button>
                <button class="filter-chip" data-filter="com-jogadores">
                    <span class="emoji">👤</span>
                    <span class="text">Ocupados</span>
                </button>
                <button class="filter-chip" data-filter="sem-jogadores">
                    <span class="emoji">🆓</span>
                    <span class="text">Livres</span>
                </button>
                <button class="filter-chip" data-filter="americas">
                    <span class="emoji">🌎</span>
                    <span class="text">Américas</span>
                </button>
                <button class="filter-chip" data-filter="europa">
                    <span class="emoji">🇪🇺</span>
                    <span class="text">Europa</span>
                </button>
                <button class="filter-chip" data-filter="asia">
                    <span class="emoji">🌏</span>
                    <span class="text">Ásia</span>
                </button>
            </div>
            
            <!-- Resultados da busca -->
            <div id="search-results" class="mt-3 hidden">
                <div class="text-xs text-slate-400 mb-2">
                    <span id="search-count">0</span> países encontrados
                </div>
            </div>
        `;
        
        // Inserir antes da lista de países
        const countriesList = document.querySelector('#lista-paises-publicos');
        if (countriesList && countriesList.parentNode) {
            countriesList.parentNode.insertBefore(searchContainer, countriesList);
        }
        
        this.setupSearchFunctionality();
        this.addSearchStyles();
    }
    
    setupSearchFunctionality() {
        const searchInput = document.getElementById('country-search');
        const clearButton = document.getElementById('clear-search');
        const filterChips = document.querySelectorAll('.filter-chip');
        const searchResults = document.getElementById('search-results');
        const searchCount = document.getElementById('search-count');
        
        if (!searchInput) return;
        
        let searchTimeout;
        
        // Busca em tempo real
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            this.currentSearchTerm = term;
            
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(term);
                this.updateClearButton(term);
            }, 300);
        });
        
        // Limpar busca
        clearButton?.addEventListener('click', () => {
            searchInput.value = '';
            this.currentSearchTerm = '';
            this.clearSearch();
            this.updateClearButton('');
            searchInput.focus();
        });
        
        // Filtros rápidos
        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Atualizar estado ativo
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                const filter = chip.dataset.filter;
                this.applyQuickFilter(filter);
                
                // Feedback tátil
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
        
        // Pesquisa por voz (se disponível)
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.addVoiceSearch(searchInput);
        }
    }
    
    performSearch(term) {
        if (!window.appState?.allCountries) return;
        
        const countries = window.appState.allCountries;
        const searchResults = document.getElementById('search-results');
        const searchCount = document.getElementById('search-count');
        
        if (!term) {
            this.clearSearch();
            return;
        }
        
        // Criar índice de busca se não existir
        if (!this.searchIndex) {
            this.createSearchIndex(countries);
        }
        
        // Busca fuzzy
        const results = this.fuzzySearch(term, countries);
        
        // Atualizar UI
        if (searchResults && searchCount) {
            searchCount.textContent = results.length;
            searchResults.classList.remove('hidden');
        }
        
        // Renderizar resultados
        this.renderSearchResults(results);
        
        // Anunciar para screen readers
        A11y.announce(`${results.length} países encontrados para "${term}"`);
        
        Logger.debug(`Busca mobile: "${term}" -> ${results.length} resultados`);
    }
    
    createSearchIndex(countries) {
        this.searchIndex = countries.map(country => ({
            ...country,
            searchTerms: [
                country.Pais || '',
                country.ModeloPolitico || '',
                this.getRegion(country.Pais) || '',
                // Adicionar termos em inglês para países conhecidos
                this.getEnglishName(country.Pais) || ''
            ].filter(Boolean).join(' ').toLowerCase()
        }));
    }
    
    fuzzySearch(term, countries) {
        if (!term) return countries;
        
        const searchTerm = term.toLowerCase();
        
        return countries.filter(country => {
            const name = (country.Pais || '').toLowerCase();
            const region = this.getRegion(country.Pais)?.toLowerCase() || '';
            const englishName = this.getEnglishName(country.Pais)?.toLowerCase() || '';
            const political = (country.ModeloPolitico || '').toLowerCase();\n            \n            // Busca exata no início (prioridade alta)\n            if (name.startsWith(searchTerm)) return true;\n            \n            // Busca exata em qualquer lugar\n            if (name.includes(searchTerm)) return true;\n            if (englishName.includes(searchTerm)) return true;\n            \n            // Busca por região\n            if (region.includes(searchTerm)) return true;\n            \n            // Busca por sistema político\n            if (political.includes(searchTerm)) return true;\n            \n            // Busca fuzzy simples (caracteres em comum)\n            if (this.fuzzyMatch(searchTerm, name)) return true;\n            \n            return false;\n        }).sort((a, b) => {\n            // Ordenar por relevância\n            const aName = (a.Pais || '').toLowerCase();\n            const bName = (b.Pais || '').toLowerCase();\n            \n            // Países que começam com o termo têm prioridade\n            const aStarts = aName.startsWith(searchTerm) ? 0 : 1;\n            const bStarts = bName.startsWith(searchTerm) ? 0 : 1;\n            \n            if (aStarts !== bStarts) return aStarts - bStarts;\n            \n            // Ordenar alfabeticamente\n            return aName.localeCompare(bName);\n        });\n    }\n    \n    fuzzyMatch(term, text) {\n        if (term.length < 3) return false;\n        \n        let termIndex = 0;\n        let textIndex = 0;\n        \n        while (termIndex < term.length && textIndex < text.length) {\n            if (term[termIndex] === text[textIndex]) {\n                termIndex++;\n            }\n            textIndex++;\n        }\n        \n        return termIndex === term.length;\n    }\n    \n    getRegion(countryName) {\n        const name = (countryName || '').toLowerCase();\n        \n        // Américas\n        if (['brasil', 'brazil', 'argentina', 'chile', 'colombia', 'venezuela', 'peru', 'equador', 'bolivia', 'uruguai', 'paraguai', 'mexico', 'estados unidos', 'canada', 'eua', 'usa'].some(c => name.includes(c))) {\n            return 'Americas';\n        }\n        \n        // Europa\n        if (['alemanha', 'franca', 'reino unido', 'italia', 'espanha', 'portugal', 'russia', 'polonia', 'suecia', 'noruega', 'dinamarca', 'holanda', 'belgica', 'suica', 'austria', 'hungria'].some(c => name.includes(c))) {\n            return 'Europa';\n        }\n        \n        // Ásia\n        if (['china', 'japao', 'india', 'coreia', 'tailandia', 'vietnam', 'indonesia', 'malasia', 'singapura', 'filipinas'].some(c => name.includes(c))) {\n            return 'Asia';\n        }\n        \n        // África\n        if (['africa', 'egito', 'nigeria', 'marrocos', 'argelia', 'etiopia', 'quenia', 'gana'].some(c => name.includes(c))) {\n            return 'Africa';\n        }\n        \n        return 'Outros';\n    }\n    \n    getEnglishName(countryName) {\n        const translations = {\n            'brasil': 'brazil',\n            'alemanha': 'germany',\n            'franca': 'france',\n            'reino unido': 'united kingdom uk england',\n            'estados unidos': 'united states usa america',\n            'espanha': 'spain',\n            'italia': 'italy',\n            'japao': 'japan',\n            'china': 'china',\n            'russia': 'russia ussr soviet union',\n            'coreia do sul': 'south korea',\n            'coreia do norte': 'north korea'\n        };\n        \n        const name = (countryName || '').toLowerCase();\n        return translations[name] || '';\n    }\n    \n    applyQuickFilter(filter) {\n        if (!window.appState?.allCountries) return;\n        \n        let filtered = [];\n        const countries = window.appState.allCountries;\n        \n        switch (filter) {\n            case 'todos':\n                filtered = countries;\n                break;\n            case 'publicos':\n                filtered = countries.filter(c => {\n                    const v = (c.Visibilidade || '').toLowerCase();\n                    return ['público', 'publico', 'public'].includes(v);\n                });\n                break;\n            case 'com-jogadores':\n                filtered = countries.filter(c => c.Player);\n                break;\n            case 'sem-jogadores':\n                filtered = countries.filter(c => !c.Player);\n                break;\n            case 'americas':\n                filtered = countries.filter(c => this.getRegion(c.Pais) === 'Americas');\n                break;\n            case 'europa':\n                filtered = countries.filter(c => this.getRegion(c.Pais) === 'Europa');\n                break;\n            case 'asia':\n                filtered = countries.filter(c => this.getRegion(c.Pais) === 'Asia');\n                break;\n        }\n        \n        this.renderSearchResults(filtered);\n        \n        // Atualizar contador\n        const searchCount = document.getElementById('search-count');\n        const searchResults = document.getElementById('search-results');\n        \n        if (searchCount) searchCount.textContent = filtered.length;\n        if (searchResults) searchResults.classList.remove('hidden');\n        \n        A11y.announce(`Filtro aplicado: ${filtered.length} países encontrados`);\n    }\n    \n    renderSearchResults(countries) {\n        // Usar o renderer existente\n        if (window.renderPublicCountries) {\n            window.renderPublicCountries(countries);\n        }\n        \n        // Adicionar highlighting nos resultados\n        this.highlightSearchTerms();\n    }\n    \n    highlightSearchTerms() {\n        if (!this.currentSearchTerm) return;\n        \n        const cards = document.querySelectorAll('.country-card-button');\n        const term = this.currentSearchTerm;\n        \n        cards.forEach(card => {\n            const nameEl = card.querySelector('.text-sm.font-semibold');\n            if (nameEl) {\n                const originalText = nameEl.textContent;\n                const highlightedText = originalText.replace(\n                    new RegExp(`(${term})`, 'gi'),\n                    '<mark class=\"bg-brand-400/30 text-brand-200 px-1 rounded\">$1</mark>'\n                );\n                \n                if (highlightedText !== originalText) {\n                    nameEl.innerHTML = highlightedText;\n                }\n            }\n        });\n    }\n    \n    clearSearch() {\n        // Limpar highlights\n        const marks = document.querySelectorAll('.country-card-button mark');\n        marks.forEach(mark => {\n            const parent = mark.parentNode;\n            parent.replaceChild(document.createTextNode(mark.textContent), mark);\n            parent.normalize();\n        });\n        \n        // Esconder resultados\n        const searchResults = document.getElementById('search-results');\n        if (searchResults) {\n            searchResults.classList.add('hidden');\n        }\n        \n        // Restaurar lista completa\n        if (window.appState?.allCountries) {\n            this.renderSearchResults(window.appState.allCountries);\n        }\n        \n        // Resetar filtros\n        const filterChips = document.querySelectorAll('.filter-chip');\n        filterChips.forEach(chip => {\n            chip.classList.remove('active');\n            if (chip.dataset.filter === 'todos') {\n                chip.classList.add('active');\n            }\n        });\n    }\n    \n    updateClearButton(term) {\n        const clearButton = document.getElementById('clear-search');\n        if (clearButton) {\n            if (term) {\n                clearButton.classList.remove('hidden');\n            } else {\n                clearButton.classList.add('hidden');\n            }\n        }\n    }\n    \n    addVoiceSearch(searchInput) {\n        const voiceButton = document.createElement('button');\n        voiceButton.className = 'p-2 text-slate-400 hover:text-slate-200 transition-colors';\n        voiceButton.innerHTML = `\n            <svg class=\"h-5 w-5\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\">\n                <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z\" />\n            </svg>\n        `;\n        voiceButton.setAttribute('aria-label', 'Busca por voz');\n        \n        // Inserir antes do botão clear\n        const clearButton = document.getElementById('clear-search');\n        if (clearButton?.parentNode) {\n            clearButton.parentNode.insertBefore(voiceButton, clearButton);\n        }\n        \n        voiceButton.addEventListener('click', () => {\n            this.startVoiceRecognition(searchInput);\n        });\n    }\n    \n    startVoiceRecognition(searchInput) {\n        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;\n        const recognition = new SpeechRecognition();\n        \n        recognition.lang = 'pt-BR';\n        recognition.interimResults = false;\n        recognition.maxAlternatives = 1;\n        \n        recognition.onstart = () => {\n            searchInput.placeholder = '🎤 Fale o nome do país...';\n            if (navigator.vibrate) navigator.vibrate(50);\n        };\n        \n        recognition.onresult = (event) => {\n            const transcript = event.results[0][0].transcript;\n            searchInput.value = transcript;\n            this.performSearch(transcript.toLowerCase());\n            A11y.announce(`Busca por voz: ${transcript}`);\n        };\n        \n        recognition.onerror = (event) => {\n            Logger.warn('Erro na busca por voz:', event.error);\n            searchInput.placeholder = 'Buscar países...';\n        };\n        \n        recognition.onend = () => {\n            searchInput.placeholder = 'Buscar países...';\n        };\n        \n        recognition.start();\n    }\n    \n    addSearchStyles() {\n        const style = document.createElement('style');\n        style.textContent = `\n            .scrollbar-hide {\n                -ms-overflow-style: none;\n                scrollbar-width: none;\n            }\n            \n            .scrollbar-hide::-webkit-scrollbar {\n                display: none;\n            }\n            \n            .filter-chip {\n                @apply flex items-center gap-2 px-3 py-2 rounded-full border border-bg-ring/50 bg-bg-soft/30 text-sm font-medium text-slate-300 hover:text-slate-100 hover:border-slate-500/50 transition-all whitespace-nowrap;\n            }\n            \n            .filter-chip.active {\n                @apply bg-brand-500/20 border-brand-500/50 text-brand-200;\n            }\n            \n            .filter-chip .emoji {\n                @apply text-base;\n            }\n            \n            @media (max-width: 640px) {\n                .filter-chip .text {\n                    @apply sr-only;\n                }\n                \n                .filter-chip {\n                    @apply px-2 py-2;\n                }\n                \n                .filter-chip .emoji {\n                    @apply text-lg;\n                }\n            }\n            \n            /* Feedback visual para touch */\n            .filter-chip:active {\n                @apply scale-95 bg-brand-500/30;\n                transition: transform 0.1s ease;\n            }\n            \n            .country-card-button:active {\n                @apply scale-98;\n                transition: transform 0.1s ease;\n            }\n        `;\n        document.head.appendChild(style);\n    }"}