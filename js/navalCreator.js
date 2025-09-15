// js/navalCreator.js - Main Naval Creator System for War 1954

// Import naval components
import hulls from './data/naval-components/hulls.js';
import { propulsion_systems, boilers, auxiliary_systems } from './data/naval-components/propulsion.js';
import { naval_guns, gun_mounts, fire_control_systems, ammunition_types } from './data/naval-components/naval_guns.js';
import { naval_missiles, missile_launchers, guidance_systems, missile_magazines } from './data/naval-components/naval_missiles.js';
import { aa_guns, torpedo_tubes, depth_charges, countermeasures, searchlights } from './data/naval-components/secondary_weapons.js';
import { radar_systems, sonar_systems, communication_systems, electronic_warfare, navigation_systems, data_processing } from './data/naval-components/electronics.js';
import { armor_materials, armor_zones, armor_schemes } from './data/naval-components/armor.js';

// Assemble the main naval components object
const NAVAL_COMPONENTS = {
    hulls,
    propulsion_systems,
    boilers,
    auxiliary_systems,
    naval_guns,
    gun_mounts,
    fire_control_systems,
    ammunition_types,
    naval_missiles,
    missile_launchers,
    guidance_systems,
    missile_magazines,
    aa_guns,
    torpedo_tubes,
    depth_charges,
    countermeasures,
    searchlights,
    radar_systems,
    sonar_systems,
    communication_systems,
    electronic_warfare,
    navigation_systems,
    data_processing,
    armor_materials,
    armor_zones,
    armor_schemes
};

// Make available globally
window.NAVAL_COMPONENTS = NAVAL_COMPONENTS;

// Global naval ship state
window.currentShip = {
    name: 'Novo Navio',
    hull: null,
    propulsion: null,
    armor: {
        scheme: 'unarmored',
        custom_zones: {
            belt: 'no_armor',
            deck: 'structural_steel',
            turrets: 'no_armor', 
            conning_tower: 'structural_steel',
            barbettes: 'no_armor',
            magazines: 'light_armor'
        }
    },
    main_guns: [],
    secondary_weapons: [],
    missiles: [],
    aa_guns: [],
    torpedo_tubes: [],
    depth_charges: [],
    countermeasures: [],
    searchlights: [],
    electronics: [],
    quantity: 1
};

// Component loader function
window.loadNavalComponents = async function() {
    try {
        console.log('📦 Loading naval components for War 1954...');
        
        // Components are already loaded via imports
        if (NAVAL_COMPONENTS && Object.keys(NAVAL_COMPONENTS.hulls || {}).length > 0) {
            console.log(`✅ Loaded ${Object.keys(NAVAL_COMPONENTS.hulls).length} hull types`);
            console.log(`✅ Loaded ${Object.keys(NAVAL_COMPONENTS.propulsion_systems).length} propulsion systems`);
            console.log(`✅ Loaded ${Object.keys(NAVAL_COMPONENTS.naval_guns).length} naval guns`);
            return true;
        } else {
            console.error('❌ Naval components not properly loaded');
            return false;
        }
    } catch (error) {
        console.error('❌ Error loading naval components:', error);
        return false;
    }
};

// Naval creator class
class NavalCreator {
    constructor() {
        this.initialized = false;
        this.performanceCalculator = null;
        this.costSystem = null;
    }

    async initialize() {
        try {
            console.log('🚢 Initializing Naval Creator System...');
            
            // Load components
            const componentsLoaded = await window.loadNavalComponents();
            if (!componentsLoaded) {
                throw new Error('Failed to load naval components');
            }

            // Initialize systems
            this.initializeSystems();
            
            this.initialized = true;
            console.log('✅ Naval Creator System initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Naval Creator initialization failed:', error);
            return false;
        }
    }

    initializeSystems() {
        // Performance calculator should be available from navalPerformanceCalculator.js
        if (window.navalPerformanceCalculator) {
            this.performanceCalculator = window.navalPerformanceCalculator;
            console.log('✅ Naval Performance Calculator connected');
        }

        // Cost system should be available from navalCostSystem.js  
        if (window.NavalCostSystem) {
            this.costSystem = window.NavalCostSystem;
            console.log('✅ Naval Cost System connected');
        }
    }

    calculateShipPerformance(ship = window.currentShip) {
        if (!this.performanceCalculator) {
            console.warn('⚠️ Performance calculator not available');
            return { error: 'Performance calculator not loaded' };
        }
        return this.performanceCalculator.calculateShipPerformance(ship);
    }

    calculateShipCosts(ship = window.currentShip) {
        if (!this.costSystem) {
            console.warn('⚠️ Cost system not available');
            return { error: 'Cost system not loaded' };
        }
        return this.costSystem.calculateCosts(ship);
    }

    // Validation methods
    validateShipConfiguration(ship = window.currentShip) {
        const warnings = [];
        const hull = ship.hull ? NAVAL_COMPONENTS.hulls[ship.hull] : null;
        
        if (!hull) {
            warnings.push('Nenhum casco selecionado');
            return warnings;
        }

        // Check if main armament fits hull capabilities
        if (ship.main_guns && ship.main_guns.length > (hull.main_armament_slots || 0)) {
            warnings.push(`Muito armamento principal: ${ship.main_guns.length} > ${hull.main_armament_slots} slots disponíveis`);
        }

        // Check if secondary weapons fit
        if (ship.secondary_weapons && ship.secondary_weapons.length > (hull.secondary_armament_slots || 0)) {
            warnings.push(`Muitas armas secundárias: ${ship.secondary_weapons.length} > ${hull.secondary_armament_slots} slots disponíveis`);
        }

        // Check propulsion compatibility
        if (ship.propulsion) {
            const propulsion = NAVAL_COMPONENTS.propulsion_systems[ship.propulsion];
            if (propulsion && propulsion.suitable_hulls && !propulsion.suitable_hulls.includes(hull.role)) {
                warnings.push(`Sistema de propulsão ${propulsion.name} pode não ser adequado para ${hull.role}`);
            }
        }

        // Technology level warnings
        const currentYear = 1954;
        if (hull.year_introduced > currentYear) {
            warnings.push(`Casco ${hull.name} é muito avançado para ${currentYear}`);
        }

        if (ship.propulsion) {
            const propulsion = NAVAL_COMPONENTS.propulsion_systems[ship.propulsion];
            if (propulsion && propulsion.year_introduced > currentYear) {
                warnings.push(`Sistema de propulsão ${propulsion.name} é muito avançado para ${currentYear}`);
            }
        }

        return warnings;
    }

    // Export/Import methods
    exportShipDesign(ship = window.currentShip) {
        const design = {
            version: '1.0',
            created: new Date().toISOString(),
            ship: { ...ship },
            performance: this.calculateShipPerformance(ship),
            costs: this.calculateShipCosts(ship)
        };
        
        return JSON.stringify(design, null, 2);
    }

    importShipDesign(designJson) {
        try {
            const design = JSON.parse(designJson);
            if (design.ship) {
                window.currentShip = { ...design.ship };
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing ship design:', error);
            return false;
        }
    }

    // Save to localStorage
    saveDesignToStorage(name) {
        const design = this.exportShipDesign();
        const savedDesigns = JSON.parse(localStorage.getItem('navalDesigns') || '{}');
        savedDesigns[name] = design;
        localStorage.setItem('navalDesigns', JSON.stringify(savedDesigns));
    }

    loadDesignFromStorage(name) {
        const savedDesigns = JSON.parse(localStorage.getItem('navalDesigns') || '{}');
        if (savedDesigns[name]) {
            return this.importShipDesign(savedDesigns[name]);
        }
        return false;
    }

    getSavedDesigns() {
        return Object.keys(JSON.parse(localStorage.getItem('navalDesigns') || '{}'));
    }
}

// Create global instance
window.navalCreator = new NavalCreator();

// Global ship management functions
window.updateShipDisplays = function(performance) {
    // Update header displays
    const displacementEl = document.getElementById('total-displacement-display');
    const speedEl = document.getElementById('max-speed-display');
    const armamentEl = document.getElementById('main-armament-display');
    const costEl = document.getElementById('total-cost-display');
    
    if (displacementEl && performance.totalDisplacement) {
        displacementEl.textContent = Math.round(performance.totalDisplacement).toLocaleString() + ' t';
    }
    if (speedEl && performance.maxSpeed) {
        speedEl.textContent = Math.round(performance.maxSpeed) + ' nós';
    }
    if (armamentEl && performance.mainArmament !== undefined) {
        armamentEl.textContent = performance.mainArmament + ' canhões';
    }
};

window.updateShipName = function(name) {
    window.currentShip.name = name;
    const nameDisplay = document.getElementById('ship-name-display');
    if (nameDisplay) {
        nameDisplay.textContent = name;
    }
};

window.resetShipDesign = function() {
    window.currentShip = {
        name: 'Novo Navio',
        hull: null,
        propulsion: null,
        armor: {
            scheme: 'unarmored',
            custom_zones: {
                belt: 'no_armor',
                deck: 'structural_steel',
                turrets: 'no_armor', 
                conning_tower: 'structural_steel',
                barbettes: 'no_armor',
                magazines: 'light_armor',
                torpedo_defense: 'no_armor'
            }
        },
        main_guns: [],
        secondary_weapons: [],
        missiles: [],
        aa_guns: [],
        torpedo_tubes: [],
        depth_charges: [],
        countermeasures: [],
        searchlights: [],
        electronics: [],
        quantity: 1
    };
    
    // Refresh current tab
    if (window.navalCreatorApp) {
        window.navalCreatorApp.loadTabContent(window.navalCreatorApp.currentTab);
        if (typeof window.updateShipCalculations === 'function') {
            window.updateShipCalculations();
        }
    }
};

// Ship summary modal
window.showShipSummaryModal = function() {
    console.log('🚢 Showing ship summary modal');
    const ship = window.currentShip;
    const performance = window.navalCreator.calculateShipPerformance(ship);
    const costs = window.navalCreator.calculateShipCosts(ship);
    const warnings = window.navalCreator.validateShipConfiguration(ship);

    // Create modal HTML
    let modalHtml = `
        <div id="ship-summary-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="closeShipSummaryModal()">
            <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto p-6" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-slate-100 flex items-center space-x-2">
                        <span>⚓</span>
                        <span>Ficha Completa do Navio</span>
                    </h2>
                    <button onclick="closeShipSummaryModal()" class="text-slate-400 hover:text-slate-200 text-xl">&times;</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-naval-300 mb-3">📋 Informações Básicas</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Nome:</span>
                                    <span class="text-slate-100">${ship.name}</span>
                                </div>
                                ${ship.hull ? `
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Classe:</span>
                                        <span class="text-slate-100">${NAVAL_COMPONENTS.hulls[ship.hull].name}</span>
                                    </div>
                                ` : ''}
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Ano:</span>
                                    <span class="text-slate-100">1954</span>
                                </div>
                            </div>
                        </div>

                        ${performance && !performance.error ? `
                            <div class="bg-slate-900/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-blue-300 mb-3">📊 Performance</h3>
                                ${window.NavalPerformanceSystem ? window.NavalPerformanceSystem.renderPerformanceDisplay(ship) : '<p class="text-slate-400">Performance data not available</p>'}
                            </div>
                        ` : ''}
                    </div>

                    <div class="space-y-4">
                        ${costs && !costs.error ? `
                            <div class="bg-slate-900/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-green-300 mb-3">💰 Análise de Custos</h3>
                                ${window.NavalCostSystem ? window.NavalCostSystem.renderCostDisplay(ship) : '<p class="text-slate-400">Cost data not available</p>'}
                            </div>
                        ` : ''}

                        ${warnings.length > 0 ? `
                            <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-amber-300 mb-3">⚠️ Avisos</h3>
                                <div class="space-y-1 text-sm">
                                    ${warnings.map(warning => `<div class="text-amber-200">• ${warning}</div>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                    <button onclick="exportShipDesign()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        📄 Exportar Design
                    </button>
                    <button onclick="closeShipSummaryModal()" class="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add to body
    const existingModal = document.getElementById('ship-summary-modal');
    if (existingModal) {
        existingModal.remove();
    }
    document.body.insertAdjacentHTML('beforeend', modalHtml);
};

window.closeShipSummaryModal = function() {
    const modal = document.getElementById('ship-summary-modal');
    if (modal) {
        modal.remove();
    }
};

window.exportShipDesign = function() {
    const design = window.navalCreator.exportShipDesign();
    const blob = new Blob([design], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${window.currentShip.name.replace(/[^a-z0-9]/gi, '_')}_naval_design.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// Submit naval production order
window.submitNavalProductionOrder = async function() {
    try {
        if (!window.currentShip?.hull) {
            alert('Selecione um casco antes de solicitar produção!');
            return;
        }

        const ship = window.currentShip;
        const performance = window.navalCreator.calculateShipPerformance(ship);
        const costs = window.navalCreator.calculateShipCosts(ship);
        const warnings = window.navalCreator.validateShipConfiguration(ship);

        // Check for critical issues
        if (warnings.some(w => w.includes('Nenhum casco'))) {
            alert('Configure o navio antes de solicitar produção!');
            return;
        }

        // Show production request modal
        showProductionRequestModal(ship, performance, costs, warnings);

    } catch (error) {
        console.error('❌ Erro ao solicitar produção:', error);
        alert('Erro ao solicitar produção: ' + error.message);
    }
};

// Show production request modal
window.showProductionRequestModal = function(ship, performance, costs, warnings) {
    const hull = window.NAVAL_COMPONENTS?.hulls[ship.hull];
    if (!hull) {
        alert('Dados do casco não encontrados!');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4';
    modal.id = 'production-request-modal';

    const totalCost = costs?.production || hull.cost_base;
    const buildTime = hull.production?.build_time_months || 24;
    
    modal.innerHTML = `
        <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-lg w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-green-300">🏭 Solicitar Produção Naval</h3>
                <button onclick="closeProductionRequestModal()" class="text-slate-400 hover:text-slate-200 text-xl">&times;</button>
            </div>
            
            <div class="space-y-4 mb-6">
                <div class="bg-slate-900/50 rounded-lg p-4">
                    <h4 class="font-semibold text-slate-200 mb-2">${ship.name}</h4>
                    <div class="text-sm text-slate-400 space-y-1">
                        <div>Tipo: <span class="text-slate-200">${hull.name}</span></div>
                        <div>Deslocamento: <span class="text-slate-200">${performance.totalDisplacement?.toLocaleString() || '?'} t</span></div>
                        <div>Velocidade: <span class="text-slate-200">${performance.maxSpeed || '?'} nós</span></div>
                        <div>Custo unitário: <span class="text-green-300">$${totalCost.toLocaleString()}</span></div>
                        <div>Tempo de construção: <span class="text-orange-300">${buildTime} meses</span></div>
                    </div>
                </div>

                ${warnings.length > 0 ? `
                    <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                        <h5 class="text-amber-300 font-semibold text-sm mb-2">⚠️ Avisos de Design:</h5>
                        <div class="text-xs text-amber-200 space-y-1">
                            ${warnings.map(w => `<div>• ${w}</div>`).join('')}
                        </div>
                    </div>
                ` : ''}

                <div>
                    <label class="block text-sm font-medium text-slate-200 mb-2">Quantidade a solicitar:</label>
                    <input type="number" 
                           id="production-quantity-input" 
                           min="1" 
                           max="50" 
                           value="1"
                           class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-green-500 focus:outline-none">
                    <div class="text-xs text-slate-400 mt-1">Máximo: 50 unidades por pedido</div>
                </div>

                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-slate-400">Custo total estimado:</span>
                        <span id="total-production-cost" class="text-green-300 font-semibold">$${totalCost.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-3">
                <button onclick="confirmProductionOrder()" class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    🏭 Enviar Solicitação
                </button>
                <button onclick="closeProductionRequestModal()" class="flex-1 px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Update total cost when quantity changes
    const quantityInput = modal.querySelector('#production-quantity-input');
    const totalCostSpan = modal.querySelector('#total-production-cost');

    quantityInput.addEventListener('input', (e) => {
        const quantity = parseInt(e.target.value) || 1;
        const total = totalCost * quantity;
        totalCostSpan.textContent = `$${total.toLocaleString()}`;
    });
};

window.closeProductionRequestModal = function() {
    const modal = document.getElementById('production-request-modal');
    if (modal) modal.remove();
};

window.confirmProductionOrder = async function() {
    try {
        const quantityInput = document.getElementById('production-quantity-input');
        const quantity = parseInt(quantityInput.value) || 1;

        if (quantity < 1 || quantity > 50) {
            alert('Quantidade deve estar entre 1 e 50');
            return;
        }

        const ship = window.currentShip;
        const performance = window.navalCreator.calculateShipPerformance(ship);
        const costs = window.navalCreator.calculateShipCosts(ship);

        const orderData = {
            design: { ...ship },
            performance: performance,
            costs: costs,
            quantity: quantity,
            totalCost: (costs?.production || window.NAVAL_COMPONENTS.hulls[ship.hull].cost_base) * quantity,
            submissionDate: new Date()
        };

        // Close production modal first
        closeProductionRequestModal();
        
        // Show ship summary modal for screenshot capture
        showShipSummaryModal();
        
        // Wait a bit for modal to render, then capture screenshot
        setTimeout(async () => {
            try {
                const sheetResult = await captureAndUploadNavalSheet(orderData);
                orderData.sheetImageUrl = sheetResult.pngUrl;
                orderData.sheetHtmlUrl = sheetResult.htmlUrl;

                // Import and use the submission function
                const { submitNavalOrderForApproval } = await import('./components/navalProduction.js');
                const result = await submitNavalOrderForApproval(orderData);

                if (result.success) {
                    closeShipSummaryModal();
                    
                    // Show success message with more details
                    const hull = window.NAVAL_COMPONENTS.hulls[ship.hull];
                    const estimatedTurns = Math.ceil((hull.production?.build_time_months || 24) / 3);
                    
                    alert(`✅ Solicitação enviada com sucesso!\n\nID: ${result.id.substring(0, 8)}\nQuantidade: ${quantity}x ${ship.name}\nTempo estimado: ${estimatedTurns} turnos\n\nFicha do navio capturada para análise do narrador.`);
                }
            } catch (error) {
                console.error('❌ Erro ao capturar ficha:', error);
                alert('Aviso: Pedido será enviado sem imagem da ficha.');
                
                // Continue with submission even without screenshot
                const { submitNavalOrderForApproval } = await import('./components/navalProduction.js');
                const result = await submitNavalOrderForApproval(orderData);
                
                if (result.success) {
                    closeShipSummaryModal();
                    alert('✅ Solicitação enviada (sem imagem da ficha)');
                }
            }
        }, 500);

    } catch (error) {
        console.error('❌ Erro ao confirmar pedido:', error);
        alert('Erro ao confirmar pedido: ' + error.message);
    }
};

// Naval sheet capture and upload system
async function captureAndUploadNavalSheet(submissionData) {
    try {
        console.log('🚀 === INICIANDO CAPTURA DE FICHA NAVAL ===');
        console.log('📋 Dados da submissão:', submissionData);
        
        // Get the modal content (the entire ship sheet)
        const sheetElement = document.querySelector('#ship-summary-modal .bg-slate-800');
        console.log('🎯 Elemento da ficha encontrado:', !!sheetElement);
        if (!sheetElement) {
            throw new Error('Elemento da ficha naval não encontrado');
        }
        
        // Check if html2canvas is available
        console.log('🖼️ html2canvas disponível:', typeof html2canvas !== 'undefined');
        if (typeof html2canvas === 'undefined') {
            console.log('⚠️ html2canvas não disponível, usando método alternativo');
            const htmlResult = await uploadTextBasedNavalSheet(submissionData);
            return { pngUrl: null, htmlUrl: htmlResult };
        }
        
        // Check Firebase Storage availability
        console.log('🔥 Firebase disponível:', !!window.firebase);
        console.log('☁️ Storage disponível:', !!window.firebase?.storage);
        
        if (!window.firebase?.storage) {
            console.error('❌ Firebase Storage não disponível!');
            const htmlResult = await uploadTextBasedNavalSheet(submissionData);
            return { pngUrl: null, htmlUrl: htmlResult };
        }
        
        // Configure html2canvas options
        const options = {
            backgroundColor: '#1e293b', // Slate-800 background
            width: 1200,
            height: Math.max(sheetElement.scrollHeight, 800),
            useCORS: true,
            scale: 2, // High resolution
            logging: false
        };
        
        console.log('🖼️ Capturando imagem da ficha naval...');
        const canvas = await html2canvas(sheetElement, options);
        console.log('✅ Canvas capturado:', canvas.width + 'x' + canvas.height);
        
        // Convert canvas to blob
        console.log('💾 Convertendo para arquivo...');
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 0.9);
        });
        console.log('✅ Blob criado:', blob?.size, 'bytes');
        
        if (!blob) {
            throw new Error('Falha ao criar blob da imagem');
        }
        
        // Upload to Firebase Storage
        console.log('☁️ Fazendo upload para Firebase Storage...');
        const downloadURL = await uploadNavalSheetToFirebaseStorage(blob, submissionData);
        
        console.log('✅ Imagem PNG da ficha naval enviada:', downloadURL);
        
        // Also generate HTML fallback
        const htmlUrl = await uploadTextBasedNavalSheet(submissionData);
        
        return {
            pngUrl: downloadURL,
            htmlUrl: htmlUrl
        };
        
    } catch (error) {
        console.error('💥 Erro ao capturar ficha naval PNG:', error);
        
        // Fallback: upload text-based version only
        try {
            console.log('🔄 Tentando método alternativo (HTML apenas)...');
            const htmlUrl = await uploadTextBasedNavalSheet(submissionData);
            return {
                pngUrl: null,
                htmlUrl: htmlUrl
            };
        } catch (fallbackError) {
            console.error('💥 Erro no fallback:', fallbackError);
            return { pngUrl: null, htmlUrl: null };
        }
    }
}

async function uploadNavalSheetToFirebaseStorage(blob, submissionData) {
    const storage = window.firebase.storage();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `naval-sheets/${submissionData.design.name}_${timestamp}.png`;
    
    console.log('📁 Nome do arquivo:', filename);
    
    const storageRef = storage.ref().child(filename);
    console.log('📤 Iniciando upload...');
    
    const snapshot = await storageRef.put(blob);
    console.log('✅ Upload concluído:', snapshot.totalBytes, 'bytes');
    
    const downloadURL = await snapshot.ref.getDownloadURL();
    console.log('🔗 URL de download obtida:', downloadURL);
    
    return downloadURL;
}

async function uploadTextBasedNavalSheet(submissionData) {
    try {
        const htmlContent = generateNavalSheetHTML(submissionData);
        const blob = new Blob([htmlContent], { type: 'text/html' });
        
        const storage = window.firebase.storage();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `naval-sheets/${submissionData.design.name}_${timestamp}.html`;
        
        const storageRef = storage.ref().child(filename);
        const snapshot = await storageRef.put(blob);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        console.log('📄 HTML da ficha naval salvo:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('❌ Erro ao salvar HTML da ficha naval:', error);
        return null;
    }
}

function generateNavalSheetHTML(submissionData) {
    const { design, performance, costs } = submissionData;
    const hull = window.NAVAL_COMPONENTS?.hulls[design.hull];
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ficha Naval - ${design.name}</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; background: #1e293b; color: #e2e8f0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .section { background: #334155; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
            .title { color: #3b82f6; font-size: 24px; margin-bottom: 20px; }
            .subtitle { color: #10b981; font-size: 18px; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .stat { display: flex; justify-content: space-between; margin: 4px 0; }
            .stat-label { color: #94a3b8; }
            .stat-value { color: #e2e8f0; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">⚓ ${design.name}</h1>
            
            <div class="section">
                <h2 class="subtitle">📋 Informações Básicas</h2>
                <div class="stat">
                    <span class="stat-label">Classe:</span>
                    <span class="stat-value">${hull?.name || 'Desconhecido'}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Deslocamento:</span>
                    <span class="stat-value">${performance?.totalDisplacement || 'N/A'} t</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Velocidade Máxima:</span>
                    <span class="stat-value">${performance?.maxSpeed || 'N/A'} nós</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Tripulação:</span>
                    <span class="stat-value">${performance?.crewSize || 'N/A'}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">💰 Custos</h2>
                <div class="stat">
                    <span class="stat-label">Custo de Produção:</span>
                    <span class="stat-value">$${costs?.production?.toLocaleString() || 'N/A'}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Custo Total:</span>
                    <span class="stat-value">$${costs?.total_ownership?.toLocaleString() || 'N/A'}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">⚔️ Armamento</h2>
                <div class="stat">
                    <span class="stat-label">Armas Principais:</span>
                    <span class="stat-value">${design.main_guns?.length || 0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Mísseis:</span>
                    <span class="stat-value">${design.missiles?.length || 0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Armamento AA:</span>
                    <span class="stat-value">${design.aa_guns?.length || 0}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">📊 Performance</h2>
                <div class="stat">
                    <span class="stat-label">Rating AA:</span>
                    <span class="stat-value">${performance?.aaRating || 'N/A'}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Manobrabilidade:</span>
                    <span class="stat-value">${performance?.maneuverability || 'N/A'}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Estabilidade:</span>
                    <span class="stat-value">${performance?.stability || 'N/A'}</span>
                </div>
            </div>
            
            <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 32px;">
                Ficha gerada automaticamente pelo Sistema Naval WAR 1954<br>
                ${new Date().toLocaleString('pt-BR')}
            </p>
        </div>
    </body>
    </html>
    `;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚢 Starting Naval Creator initialization...');
    await window.navalCreator.initialize();
});

console.log('✅ Naval Creator main system loaded');