/**
 * Structure Materials Handler - War1954 Aircraft Creator
 *
 * Handles the structure materials tab interface, populating material cards
 * and managing user interaction.
 * 
 * @version 2.0.0 (Refactored to use card-based UI)
 */

import { getAllMaterials, getAvailableMaterials } from '../data/StructuralMaterials.js';

export class StructureMaterialsHandler {
    constructor() {
        this.currentMaterial = 'aluminum_structure'; // Default material
        this.techLevel = 50;
        this.currentYear = 1954;
        this.initialized = false;

        console.log('🔧 StructureMaterialsHandler initialized');
    }

    /**
     * Initializes the structure materials interface by finding key elements.
     */
    initialize() {
        if (this.initialized) return;

        this.cardsContainer = document.getElementById('material-cards-container');

        if (!this.cardsContainer) {
            console.warn('StructureMaterialsHandler: #material-cards-container not found, retrying in 200ms...');
            // Retry after a short delay
            setTimeout(() => {
                this.cardsContainer = document.getElementById('material-cards-container');
                if (!this.cardsContainer) {
                    console.error('StructureMaterialsHandler Error: #material-cards-container still not found after retry.');
                    return;
                }
                this.continueInitialization();
            }, 200);
            return;
        }

        this.continueInitialization();
    }

    continueInitialization() {

        this.updateContextualData();
        this.loadMaterialSelection();
        this.selectMaterial(this.currentMaterial); // Select default

        this.initialized = true;
        console.log('✅ Structure materials interface initialized');
    }

    updateContextualData() {
        this.techLevel = window.currentUserCountry?.aircraftTech || 50;
        this.currentYear = window.currentUserCountry?.year || 1954;
    }

    /**
     * Loads and populates material selection cards.
     */
    loadMaterialSelection() {
        const aircraftCategory = window.currentAircraft?.category || 'fighter';
        const availableMaterials = getAvailableMaterials(aircraftCategory, this.techLevel, this.currentYear);

        this.cardsContainer.innerHTML = ''; // Clear existing cards

        availableMaterials.forEach(material => {
            const card = this._createMaterialCard(material);
            this.cardsContainer.appendChild(card);
        });
    }

    /**
     * Handles the selection of a material.
     * @param {string} materialId - The ID of the selected material.
     */
    selectMaterial(materialId) {
        if (!materialId) return;

        this.currentMaterial = materialId;

        // Update the global aircraft entity
        if (!window.currentAircraft.components) window.currentAircraft.components = [];
        
        // Remove any existing structure material
        window.currentAircraft.components = window.currentAircraft.components.filter(c => c.type !== 'structure_material');
        
        // Add the new one
        const materialData = getAllMaterials()[materialId];
        if(materialData) {
            window.currentAircraft.components.push({ id: materialId, ...materialData });
        }

        // Update card visuals
        document.querySelectorAll('.material-card').forEach(card => {
            const isSelected = card.dataset.materialId === materialId;
            card.classList.toggle('border-cyan-400', isSelected);
            card.classList.toggle('bg-cyan-900/20', isSelected);
            card.classList.toggle('ring-1', isSelected);
            card.classList.toggle('ring-cyan-400/50', isSelected);
            card.classList.toggle('border-slate-700/50', !isSelected);
            card.classList.toggle('bg-slate-800/40', !isSelected);
        });

        // Trigger global calculations
        if (typeof window.updateAircraftCalculations === 'function') {
            window.updateAircraftCalculations();
        }

        console.log(`🔧 Material selected: ${materialId}`);
    }

    /**
     * Creates a single HTML element for a material card.
     * @param {Object} material - The material data object.
     * @private
     */
    _createMaterialCard(material) {
        const card = document.createElement('div');
        card.className = 'material-card cursor-pointer p-4 border-2 rounded-lg hover:border-cyan-500/50 hover:bg-slate-700/40 transition-all duration-200';
        card.dataset.materialId = material.id;
        card.onclick = () => this.selectMaterial(material.id);

        const modifiers = material.modifiers || {};

        card.innerHTML = `
            <div class="text-center">
                <div class="text-2xl mb-2">${material.icon || '🔩'}</div>
                <h4 class="font-semibold text-slate-200 mb-1">${material.name}</h4>
                <p class="text-xs text-slate-400 leading-relaxed mb-3 h-16">${material.description}</p>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="text-center">
                    <div class="text-slate-400">Custo</div>
                    <div class="${this._getModifierColor(modifiers.cost, true)}">${this._formatModifier(modifiers.cost)}</div>
                </div>
                <div class="text-center">
                    <div class="text-slate-400">Peso</div>
                    <div class="${this._getModifierColor(modifiers.weight, true)}">${this._formatModifier(modifiers.weight)}</div>
                </div>
            </div>
        `;
        return card;
    }

    _formatModifier(value = 1) {
        const percentage = Math.round((value - 1) * 100);
        if (percentage === 0) return 'Padrão';
        const sign = percentage > 0 ? '+' : '';
        return `${sign}${percentage}%`;
    }

    _getModifierColor(value = 1, isInverted = false) {
        const isGood = isInverted ? value > 1 : value < 1;
        const isBad = isInverted ? value < 1 : value > 1;
        if (value === 1) return 'text-slate-300';
        if (isGood) return 'text-green-400';
        if (isBad) return 'text-red-400';
        return 'text-slate-300';
    }
}
