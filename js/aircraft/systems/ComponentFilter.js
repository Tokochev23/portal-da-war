/**
 * Component Filter System - War1954 Aircraft Creator
 *
 * Filters aircraft components based on category, size, technology level,
 * and other criteria. Ensures only compatible components are shown to users.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

import { AIRCRAFT_CATEGORIES, AIRCRAFT_SIZES, isValidCombination } from '../data/AircraftCategories.js';

export class ComponentFilter {
    constructor() {
        this.activeFilters = {
            category: null,
            size: null,
            techLevel: 0,
            era: null,
            countryTech: {},
            budget: Infinity
        };

        this.componentCache = new Map();
        console.log('🔍 ComponentFilter initialized');
    }

    /**
     * Sets active filters
     * @param {Object} filters - Filter configuration
     */
    setFilters(filters) {
        this.activeFilters = { ...this.activeFilters, ...filters };
        this.clearCache();

        console.log('🔍 Filters updated:', this.activeFilters);
    }

    /**
     * Gets current filters
     * @returns {Object} Current filters
     */
    getFilters() {
        return { ...this.activeFilters };
    }

    /**
     * Clears the component cache
     */
    clearCache() {
        this.componentCache.clear();
    }

    /**
     * Filters airframes based on current criteria
     * @param {Object} airframes - All available airframes
     * @returns {Object} Filtered airframes
     */
    filterAirframes(airframes) {
        const cacheKey = `airframes_${JSON.stringify(this.activeFilters)}`;

        if (this.componentCache.has(cacheKey)) {
            return this.componentCache.get(cacheKey);
        }

        const filtered = {};

        for (const [id, airframe] of Object.entries(airframes)) {
            if (this.isAirframeCompatible(airframe)) {
                filtered[id] = {
                    ...airframe,
                    _filterReason: this.getAirframeCompatibilityReason(airframe),
                    _isRecommended: this.isRecommendedAirframe(airframe)
                };
            }
        }

        this.componentCache.set(cacheKey, filtered);
        return filtered;
    }

    /**
     * Filters engines based on current criteria
     * @param {Object} engines - All available engines
     * @returns {Object} Filtered engines
     */
    filterEngines(engines) {
        const cacheKey = `engines_${JSON.stringify(this.activeFilters)}`;

        if (this.componentCache.has(cacheKey)) {
            return this.componentCache.get(cacheKey);
        }

        const filtered = {};

        for (const [id, engine] of Object.entries(engines)) {
            if (this.isEngineCompatible(engine)) {
                filtered[id] = {
                    ...engine,
                    _filterReason: this.getEngineCompatibilityReason(engine),
                    _isRecommended: this.isRecommendedEngine(engine)
                };
            }
        }

        this.componentCache.set(cacheKey, filtered);
        return filtered;
    }

    /**
     * Filters weapons based on current criteria
     * @param {Object} weapons - All available weapons
     * @returns {Object} Filtered weapons
     */
    filterWeapons(weapons) {
        const cacheKey = `weapons_${JSON.stringify(this.activeFilters)}`;

        if (this.componentCache.has(cacheKey)) {
            return this.componentCache.get(cacheKey);
        }

        const filtered = {};

        for (const [id, weapon] of Object.entries(weapons)) {
            if (this.isWeaponCompatible(weapon)) {
                filtered[id] = {
                    ...weapon,
                    _filterReason: this.getWeaponCompatibilityReason(weapon),
                    _isRecommended: this.isRecommendedWeapon(weapon)
                };
            }
        }

        this.componentCache.set(cacheKey, filtered);
        return filtered;
    }

    /**
     * Filters avionics based on current criteria
     * @param {Object} avionics - All available avionics
     * @returns {Object} Filtered avionics
     */
    filterAvionics(avionics) {
        const cacheKey = `avionics_${JSON.stringify(this.activeFilters)}`;

        if (this.componentCache.has(cacheKey)) {
            return this.componentCache.get(cacheKey);
        }

        const filtered = {};

        for (const [id, avionic] of Object.entries(avionics)) {
            if (this.isAvionicCompatible(avionic)) {
                filtered[id] = {
                    ...avionic,
                    _filterReason: this.getAvionicCompatibilityReason(avionic),
                    _isRecommended: this.isRecommendedAvionic(avionic)
                };
            }
        }

        this.componentCache.set(cacheKey, filtered);
        return filtered;
    }

    /**
     * Checks if an airframe is compatible with current filters
     * @param {Object} airframe - Airframe to check
     * @returns {boolean} True if compatible
     */
    isAirframeCompatible(airframe) {
        // Category compatibility
        if (this.activeFilters.category && airframe.category !== this.activeFilters.category) {
            return false;
        }

        // Size compatibility (if size is set in airframe)
        if (this.activeFilters.size && airframe.size && airframe.size !== this.activeFilters.size) {
            return false;
        }

        // Technology level check
        if (airframe.tech_level && this.activeFilters.techLevel < airframe.tech_level) {
            return false;
        }

        // Era compatibility
        if (this.activeFilters.era && airframe.tech_era && airframe.tech_era !== this.activeFilters.era) {
            return false;
        }

        return true;
    }

    /**
     * Checks if an engine is compatible with current filters
     * @param {Object} engine - Engine to check
     * @returns {boolean} True if compatible
     */
    isEngineCompatible(engine) {
        // Category-specific engine type check
        if (this.activeFilters.category) {
            const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];
            if (category && category.preferredEngineTypes) {
                if (!category.preferredEngineTypes.includes(engine.type)) {
                    return false;
                }
            }
        }

        // Technology level check
        if (engine.tech_level && this.activeFilters.techLevel < engine.tech_level) {
            return false;
        }

        // Era compatibility
        if (this.activeFilters.era && engine.era && engine.era !== this.activeFilters.era) {
            return false;
        }

        // Size compatibility (power vs aircraft size)
        if (this.activeFilters.size && engine.power) {
            const size = AIRCRAFT_SIZES[this.activeFilters.size];
            if (size) {
                const minPower = this.calculateMinimumPower(size);
                const maxPower = this.calculateMaximumPower(size);

                if (engine.power < minPower || engine.power > maxPower) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Checks if a weapon is compatible with current filters
     * @param {Object} weapon - Weapon to check
     * @returns {boolean} True if compatible
     */
    isWeaponCompatible(weapon) {
        // Category-specific weapon type check
        if (this.activeFilters.category) {
            const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];

            // Bombers can't use air-to-air weapons effectively
            if (category.id === 'bomber' && weapon.type === 'air_to_air') {
                return false;
            }

            // Fighters have limited ground attack capability
            if (category.id === 'fighter' && weapon.type === 'air_to_ground' && weapon.weight > 500) {
                return false;
            }

            // Transport aircraft typically don't carry weapons
            if (category.id === 'transport' && weapon.type !== 'defensive') {
                return false;
            }
        }

        // Technology level check
        if (weapon.tech_level && this.activeFilters.techLevel < weapon.tech_level) {
            return false;
        }

        return true;
    }

    /**
     * Checks if an avionic is compatible with current filters
     * @param {Object} avionic - Avionic to check
     * @returns {boolean} True if compatible
     */
    isAvionicCompatible(avionic) {
        // Category-specific avionics check
        if (this.activeFilters.category) {
            const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];

            // Some avionics are category-specific
            if (avionic.categories && !avionic.categories.includes(category.id)) {
                return false;
            }

            // Transport aircraft don't need combat avionics
            if (category.id === 'transport' && avionic.type === 'combat') {
                return false;
            }
        }

        // Technology level check
        if (avionic.tech_level && this.activeFilters.techLevel < avionic.tech_level) {
            return false;
        }

        return true;
    }

    /**
     * Calculates minimum required power for a given size
     * @param {Object} size - Size object
     * @returns {number} Minimum power in HP
     */
    calculateMinimumPower(size) {
        const baseWeight = (size.specifications.baseWeight.min + size.specifications.baseWeight.max) / 2;
        return baseWeight * 0.15; // 0.15 HP per kg minimum
    }

    /**
     * Calculates maximum useful power for a given size
     * @param {Object} size - Size object
     * @returns {number} Maximum useful power in HP
     */
    calculateMaximumPower(size) {
        const maxWeight = size.specifications.maxTakeoffWeight.max;
        return maxWeight * 0.5; // 0.5 HP per kg maximum
    }

    /**
     * Gets compatibility reason for an airframe
     * @param {Object} airframe - Airframe object
     * @returns {string} Compatibility reason
     */
    getAirframeCompatibilityReason(airframe) {
        if (!this.activeFilters.category) return 'Compatible';

        const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];
        if (airframe.category === category.id) {
            return `Otimizado para ${category.name}`;
        }

        return 'Compatible';
    }

    /**
     * Gets compatibility reason for an engine
     * @param {Object} engine - Engine object
     * @returns {string} Compatibility reason
     */
    getEngineCompatibilityReason(engine) {
        if (!this.activeFilters.category) return 'Compatible';

        const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];
        if (category.preferredEngineTypes?.includes(engine.type)) {
            return `Recomendado para ${category.name}`;
        }

        return 'Compatible';
    }

    /**
     * Gets compatibility reason for a weapon
     * @param {Object} weapon - Weapon object
     * @returns {string} Compatibility reason
     */
    getWeaponCompatibilityReason(weapon) {
        if (!this.activeFilters.category) return 'Compatible';

        const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];

        if (category.id === 'fighter' && weapon.type === 'air_to_air') {
            return 'Ideal para combate ar-ar';
        }

        if (category.id === 'attacker' && weapon.type === 'air_to_ground') {
            return 'Ideal para ataque ao solo';
        }

        return 'Compatible';
    }

    /**
     * Gets compatibility reason for an avionic
     * @param {Object} avionic - Avionic object
     * @returns {string} Compatibility reason
     */
    getAvionicCompatibilityReason(avionic) {
        if (!this.activeFilters.category) return 'Compatible';

        const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];

        if (avionic.categories?.includes(category.id)) {
            return `Especializado para ${category.name}`;
        }

        return 'Compatible';
    }

    /**
     * Checks if an airframe is recommended for current configuration
     * @param {Object} airframe - Airframe object
     * @returns {boolean} True if recommended
     */
    isRecommendedAirframe(airframe) {
        if (!this.activeFilters.category) return false;

        const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];
        return airframe.category === category.id &&
               airframe.tech_level <= this.activeFilters.techLevel + 10;
    }

    /**
     * Checks if an engine is recommended for current configuration
     * @param {Object} engine - Engine object
     * @returns {boolean} True if recommended
     */
    isRecommendedEngine(engine) {
        if (!this.activeFilters.category) return false;

        const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];
        return category.preferredEngineTypes?.includes(engine.type) &&
               engine.tech_level <= this.activeFilters.techLevel + 10;
    }

    /**
     * Checks if a weapon is recommended for current configuration
     * @param {Object} weapon - Weapon object
     * @returns {boolean} True if recommended
     */
    isRecommendedWeapon(weapon) {
        if (!this.activeFilters.category) return false;

        const category = AIRCRAFT_CATEGORIES[this.activeFilters.category];

        return (
            (category.id === 'fighter' && weapon.type === 'air_to_air') ||
            (category.id === 'attacker' && weapon.type === 'air_to_ground') ||
            (category.id === 'bomber' && weapon.type === 'bomb')
        ) && weapon.tech_level <= this.activeFilters.techLevel + 10;
    }

    /**
     * Checks if an avionic is recommended for current configuration
     * @param {Object} avionic - Avionic object
     * @returns {boolean} True if recommended
     */
    isRecommendedAvionic(avionic) {
        if (!this.activeFilters.category) return false;

        return avionic.categories?.includes(this.activeFilters.category) &&
               avionic.tech_level <= this.activeFilters.techLevel + 10;
    }

    /**
     * Gets filtered components for all types
     * @param {Object} allComponents - All available components
     * @returns {Object} Filtered components by type
     */
    getAllFilteredComponents(allComponents) {
        return {
            airframes: this.filterAirframes(allComponents.airframes || {}),
            engines: this.filterEngines(allComponents.aircraft_engines || {}),
            weapons: this.filterWeapons(allComponents.aircraft_weapons || {}),
            avionics: this.filterAvionics(allComponents.avionics || {})
        };
    }

    /**
     * Gets statistics about filtered components
     * @param {Object} allComponents - All available components
     * @returns {Object} Filter statistics
     */
    getFilterStatistics(allComponents) {
        const filtered = this.getAllFilteredComponents(allComponents);
        const total = {
            airframes: Object.keys(allComponents.airframes || {}).length,
            engines: Object.keys(allComponents.aircraft_engines || {}).length,
            weapons: Object.keys(allComponents.aircraft_weapons || {}).length,
            avionics: Object.keys(allComponents.avionics || {}).length
        };

        return {
            airframes: {
                filtered: Object.keys(filtered.airframes).length,
                total: total.airframes,
                percentage: total.airframes > 0 ? Math.round((Object.keys(filtered.airframes).length / total.airframes) * 100) : 0
            },
            engines: {
                filtered: Object.keys(filtered.engines).length,
                total: total.engines,
                percentage: total.engines > 0 ? Math.round((Object.keys(filtered.engines).length / total.engines) * 100) : 0
            },
            weapons: {
                filtered: Object.keys(filtered.weapons).length,
                total: total.weapons,
                percentage: total.weapons > 0 ? Math.round((Object.keys(filtered.weapons).length / total.weapons) * 100) : 0
            },
            avionics: {
                filtered: Object.keys(filtered.avionics).length,
                total: total.avionics,
                percentage: total.avionics > 0 ? Math.round((Object.keys(filtered.avionics).length / total.avionics) * 100) : 0
            }
        };
    }
}

// Global instance
export const componentFilter = new ComponentFilter();

// Make it available globally
window.componentFilter = componentFilter;