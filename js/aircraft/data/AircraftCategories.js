/**
 * Aircraft Categories System - War1954 Aircraft Creator
 *
 * Defines aircraft categories, sizes, and their characteristics for the PRD refactor.
 * This system enables component filtering and performance calculations based on role.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

/**
 * Aircraft categories with their characteristics and limitations
 */
export const AIRCRAFT_CATEGORIES = {
    fighter: {
        id: 'fighter',
        name: 'Caça',
        icon: '🛩️',
        description: 'Aeronave otimizada para combate ar-ar, alta manobrabilidade e velocidade.',
        characteristics: {
            primaryRole: 'air_superiority',
            maneuverability: 'high',
            speed: 'high',
            range: 'medium',
            payload: 'light'
        },
        compatibleSizes: ['light', 'medium', 'heavy'],
        defaultSize: 'medium',
        maxHardpoints: 8,
        preferredEngineTypes: ['piston_inline', 'piston_radial', 'turbojet', 'turbofan'],
        specialCapabilities: ['air_to_air_combat', 'interception', 'air_superiority'],
        limitations: {
            maxBombLoad: 2000,  // kg
            internalBays: false,
            maxRange: 3000      // km
        },
        techRequirements: {
            minAeronautics: 30,
            preferredEra: ['piston', 'early_jet', 'jet']
        }
    },

    attacker: {
        id: 'attacker',
        name: 'Ataque',
        icon: '⚔️',
        description: 'Aeronave especializada em ataques ar-solo, com alta capacidade de armamento.',
        characteristics: {
            primaryRole: 'ground_attack',
            maneuverability: 'medium',
            speed: 'medium',
            range: 'medium',
            payload: 'heavy'
        },
        compatibleSizes: ['medium', 'heavy'],
        defaultSize: 'medium',
        maxHardpoints: 12,
        preferredEngineTypes: ['piston_radial', 'turbojet', 'turbofan'],
        specialCapabilities: ['ground_attack', 'close_air_support', 'anti_armor'],
        limitations: {
            maxBombLoad: 8000,
            internalBays: true,
            maxRange: 2500
        },
        techRequirements: {
            minAeronautics: 40,
            preferredEra: ['piston', 'early_jet', 'jet']
        }
    },

    bomber: {
        id: 'bomber',
        name: 'Bombardeiro',
        icon: '💣',
        description: 'Aeronave de grande porte para bombardeio estratégico de longo alcance.',
        characteristics: {
            primaryRole: 'strategic_bombing',
            maneuverability: 'low',
            speed: 'medium',
            range: 'very_high',
            payload: 'very_heavy'
        },
        compatibleSizes: ['heavy', 'super_heavy'],
        defaultSize: 'heavy',
        maxHardpoints: 16,
        preferredEngineTypes: ['piston_radial', 'turbojet', 'turbofan'],
        specialCapabilities: ['strategic_bombing', 'long_range_missions'],
        limitations: {
            maxBombLoad: 20000,
            internalBays: true,
            maxRange: 8000
        },
        techRequirements: {
            minAeronautics: 50,
            preferredEra: ['piston', 'early_jet', 'jet']
        }
    },

    transport: {
        id: 'transport',
        name: 'Transporte',
        icon: '✈️',
        description: 'Aeronave para transporte de tropas, equipamentos e suprimentos.',
        characteristics: {
            primaryRole: 'transport',
            maneuverability: 'low',
            speed: 'low',
            range: 'high',
            payload: 'very_heavy'
        },
        compatibleSizes: ['medium', 'heavy', 'super_heavy'],
        defaultSize: 'heavy',
        maxHardpoints: 4,
        preferredEngineTypes: ['piston_radial', 'turboprop', 'turbofan'],
        specialCapabilities: ['troop_transport', 'cargo_transport', 'airdrop'],
        limitations: {
            maxBombLoad: 0,
            internalBays: false,
            maxRange: 6000
        },
        techRequirements: {
            minAeronautics: 25,
            preferredEra: ['piston', 'turboprop', 'jet']
        }
    },

    helicopter: {
        id: 'helicopter',
        name: 'Helicóptero',
        icon: '🚁',
        description: 'Aeronave de asas rotativas para missões especiais e suporte.,
        characteristics: {
            primaryRole: 'utility',
            maneuverability: 'very_high',
            speed: 'low',
            range: 'low',
            payload: 'medium'
        },
        compatibleSizes: ['light', 'medium', 'heavy'],
        defaultSize: 'medium',
        maxHardpoints: 6,
        preferredEngineTypes: ['piston_radial', 'turboshaft'],
        specialCapabilities: ['vtol', 'hover', 'low_altitude'],
        limitations: {
            maxBombLoad: 1500,
            internalBays: false,
            maxRange: 800
        },
        techRequirements: {
            minAeronautics: 60,
            preferredEra: ['late_piston', 'turboshaft']
        }
    }
};

/**
 * Aircraft size categories with their specifications
 */
export const AIRCRAFT_SIZES = {
    light: {
        id: 'light',
        name: 'Leve',
        icon: '🪶',
        description: 'Aeronave pequena e ágil, ideal para missões de interceptação.',
        specifications: {
            baseWeight: { min: 800, max: 2500 },      // kg
            maxTakeoffWeight: { min: 1500, max: 4000 },
            wingArea: { min: 12, max: 25 },           // m²
            fuelCapacity: { min: 200, max: 800 },     // kg
            crew: { min: 1, max: 2 },
            engines: { min: 1, max: 1 }
        },
        modifiers: {
            cost: 0.7,
            weight: 0.6,
            maneuverability: 1.4,
            range: 0.7,
            payload: 0.5,
            maintenance: 0.8
        },
        compatibleCategories: ['fighter', 'helicopter'],
        advantages: ['Alta manobrabilidade', 'Baixo custo', 'Fácil manutenção'],
        disadvantages: ['Alcance limitado', 'Baixa capacidade de carga', 'Estrutura frágil']
    },

    medium: {
        id: 'medium',
        name: 'Médio',
        icon: '⚖️',
        description: 'Aeronave equilibrada entre performance e capacidade.',
        specifications: {
            baseWeight: { min: 2000, max: 8000 },
            maxTakeoffWeight: { min: 3500, max: 15000 },
            wingArea: { min: 20, max: 45 },
            fuelCapacity: { min: 600, max: 3000 },
            crew: { min: 1, max: 4 },
            engines: { min: 1, max: 2 }
        },
        modifiers: {
            cost: 1.0,
            weight: 1.0,
            maneuverability: 1.0,
            range: 1.0,
            payload: 1.0,
            maintenance: 1.0
        },
        compatibleCategories: ['fighter', 'attacker', 'transport', 'helicopter'],
        advantages: ['Equilibrio geral', 'Versatilidade', 'Boa relação custo-benefício'],
        disadvantages: ['Sem especialização extrema']
    },

    heavy: {
        id: 'heavy',
        name: 'Pesado',
        icon: '🏋️',
        description: 'Aeronave robusta com alta capacidade de carga e alcance.',
        specifications: {
            baseWeight: { min: 6000, max: 25000 },
            maxTakeoffWeight: { min: 12000, max: 50000 },
            wingArea: { min: 35, max: 120 },
            fuelCapacity: { min: 2000, max: 15000 },
            crew: { min: 2, max: 8 },
            engines: { min: 2, max: 4 }
        },
        modifiers: {
            cost: 1.8,
            weight: 2.2,
            maneuverability: 0.6,
            range: 1.6,
            payload: 2.5,
            maintenance: 1.4
        },
        compatibleCategories: ['attacker', 'bomber', 'transport', 'helicopter'],
        advantages: ['Alta capacidade de carga', 'Longo alcance', 'Estrutura resistente'],
        disadvantages: ['Baixa manobrabilidade', 'Alto custo', 'Complexa manutenção']
    },

    super_heavy: {
        id: 'super_heavy',
        name: 'Super Pesado',
        icon: '🦣',
        description: 'Aeronave de grande porte para missões estratégicas especiais.',
        specifications: {
            baseWeight: { min: 20000, max: 80000 },
            maxTakeoffWeight: { min: 40000, max: 150000 },
            wingArea: { min: 80, max: 300 },
            fuelCapacity: { min: 10000, max: 50000 },
            crew: { min: 4, max: 12 },
            engines: { min: 4, max: 8 }
        },
        modifiers: {
            cost: 3.5,
            weight: 4.0,
            maneuverability: 0.3,
            range: 2.0,
            payload: 4.0,
            maintenance: 2.5
        },
        compatibleCategories: ['bomber', 'transport'],
        advantages: ['Capacidade máxima', 'Alcance intercontinental', 'Múltiplas missões'],
        disadvantages: ['Muito caro', 'Baixíssima agilidade', 'Manutenção complexa']
    }
};

/**
 * Gets compatible sizes for a given category
 * @param {string} categoryId - Category ID
 * @returns {Array<string>} Array of compatible size IDs
 */
export function getCompatibleSizes(categoryId) {
    const category = AIRCRAFT_CATEGORIES[categoryId];
    return category ? category.compatibleSizes : [];
}

/**
 * Gets compatible categories for a given size
 * @param {string} sizeId - Size ID
 * @returns {Array<string>} Array of compatible category IDs
 */
export function getCompatibleCategories(sizeId) {
    const size = AIRCRAFT_SIZES[sizeId];
    return size ? size.compatibleCategories : [];
}

/**
 * Validates if a category-size combination is valid
 * @param {string} categoryId - Category ID
 * @param {string} sizeId - Size ID
 * @returns {boolean} True if combination is valid
 */
export function isValidCombination(categoryId, sizeId) {
    const compatibleSizes = getCompatibleSizes(categoryId);
    const compatibleCategories = getCompatibleCategories(sizeId);

    return compatibleSizes.includes(sizeId) && compatibleCategories.includes(categoryId);
}

/**
 * Gets default specifications for a category-size combination
 * @param {string} categoryId - Category ID
 * @param {string} sizeId - Size ID
 * @returns {Object|null} Default specifications or null if invalid
 */
export function getDefaultSpecifications(categoryId, sizeId) {
    if (!isValidCombination(categoryId, sizeId)) {
        return null;
    }

    const category = AIRCRAFT_CATEGORIES[categoryId];
    const size = AIRCRAFT_SIZES[sizeId];

    return {
        category: category,
        size: size,
        baseWeight: Math.floor((size.specifications.baseWeight.min + size.specifications.baseWeight.max) / 2),
        maxTakeoffWeight: Math.floor((size.specifications.maxTakeoffWeight.min + size.specifications.maxTakeoffWeight.max) / 2),
        wingArea: Math.floor((size.specifications.wingArea.min + size.specifications.wingArea.max) / 2),
        fuelCapacity: Math.floor((size.specifications.fuelCapacity.min + size.specifications.fuelCapacity.max) / 2),
        crew: Math.ceil((size.specifications.crew.min + size.specifications.crew.max) / 2),
        maxEngines: size.specifications.engines.max,
        maxHardpoints: Math.min(category.maxHardpoints, size.id === 'light' ? 4 : size.id === 'medium' ? 8 : 12)
    };
}

/**
 * Gets all categories as an array
 * @returns {Array<Object>} Array of category objects
 */
export function getAllCategories() {
    return Object.values(AIRCRAFT_CATEGORIES);
}

/**
 * Gets all sizes as an array
 * @returns {Array<Object>} Array of size objects
 */
export function getAllSizes() {
    return Object.values(AIRCRAFT_SIZES);
}

/**
 * Gets category by ID
 * @param {string} categoryId - Category ID
 * @returns {Object|null} Category object or null
 */
export function getCategory(categoryId) {
    return AIRCRAFT_CATEGORIES[categoryId] || null;
}

/**
 * Gets size by ID
 * @param {string} sizeId - Size ID
 * @returns {Object|null} Size object or null
 */
export function getSize(sizeId) {
    return AIRCRAFT_SIZES[sizeId] || null;
}