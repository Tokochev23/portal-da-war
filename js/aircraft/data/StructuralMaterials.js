/**
 * Structural Materials System - War1954 Aircraft Creator
 *
 * Defines aircraft structural materials and their characteristics for the PRD refactor.
 * Materials provide different trade-offs in cost, weight, durability, maintenance and radar signature.
 *
 * @author War1954 Aircraft Refactor Team
 * @version 1.0.0
 */

/**
 * Aircraft structural materials with their properties
 */
export const STRUCTURAL_MATERIALS = {
    aluminum: {
        id: 'aluminum',
        name: 'Alumínio',
        icon: '🔩',
        description: 'Liga de alumínio padrão, equilibrando peso, custo e durabilidade.',
        characteristics: {
            availability: 'common',
            workability: 'excellent',
            corrosionResistance: 'good',
            temperature: 'medium'
        },
        modifiers: {
            cost: 1.0,           // Padrão (100%)
            weight: 1.0,         // Padrão (100%)
            durability: 1.0,     // HP padrão (100%)
            maintenance: 1.0,    // Manutenção padrão (100%)
            radarSignature: 1.0  // Assinatura radar neutra (100%)
        },
        techRequirements: {
            minAeronautics: 20,
            yearIntroduced: 1930,
            preferredEra: ['piston', 'early_jet', 'jet']
        },
        advantages: ['Baixo custo', 'Fácil de trabalhar', 'Amplamente disponível', 'Boa relação peso/resistência'],
        disadvantages: ['Performance média em todos os aspectos'],
        compatibleCategories: ['fighter', 'attacker', 'bomber', 'transport', 'reconnaissance', 'helicopter'],
        notes: 'Material padrão da indústria aeronáutica. Referência para comparações.'
    },

    steel: {
        id: 'steel',
        name: 'Aço',
        icon: '🔨',
        description: 'Aço estrutural de alta resistência, muito durável mas pesado.',
        characteristics: {
            availability: 'very_common',
            workability: 'good',
            corrosionResistance: 'poor',
            temperature: 'high'
        },
        modifiers: {
            cost: 0.85,          // 15% mais barato
            weight: 1.25,        // 25% mais pesado
            durability: 1.5,     // 50% mais HP
            maintenance: 0.85,   // 15% menos manutenção
            radarSignature: 1.0  // Neutro
        },
        techRequirements: {
            minAeronautics: 15,
            yearIntroduced: 1925,
            preferredEra: ['piston', 'early_jet']
        },
        advantages: ['Muito resistente', 'Baixo custo', 'Fácil manutenção', 'Alta temperatura'],
        disadvantages: ['Muito pesado', 'Propensão à corrosão', 'Performance limitada'],
        compatibleCategories: ['attacker', 'bomber', 'transport', 'helicopter'],
        notes: 'Ideal para aeronaves que precisam suportar muito dano ou operar em condições adversas.'
    },

    titanium: {
        id: 'titanium',
        name: 'Titânio',
        icon: '⚙️',
        description: 'Liga de titânio avançada, leve e resistente, mas cara e complexa.',
        characteristics: {
            availability: 'rare',
            workability: 'difficult',
            corrosionResistance: 'excellent',
            temperature: 'very_high'
        },
        modifiers: {
            cost: 3.0,           // 200% mais caro
            weight: 1.1,         // 10% mais pesado que alumínio
            durability: 1.3,     // 30% mais HP
            maintenance: 1.0,    // Manutenção neutra
            radarSignature: 1.0  // Neutro
        },
        techRequirements: {
            minAeronautics: 70,
            yearIntroduced: 1955,
            preferredEra: ['jet', 'modern']
        },
        advantages: ['Excelente resistência', 'Alta temperatura', 'Resistente à corrosão', 'Leve para a resistência'],
        disadvantages: ['Muito caro', 'Difícil de trabalhar', 'Tecnologia avançada'],
        compatibleCategories: ['fighter', 'attacker', 'reconnaissance'],
        notes: 'Material premium para aeronaves de alto desempenho que operam em condições extremas.'
    },

    composite: {
        id: 'composite',
        name: 'Compósitos',
        icon: '🧬',
        description: 'Materiais compostos avançados, extremamente leves com propriedades furtivas.',
        characteristics: {
            availability: 'very_rare',
            workability: 'very_difficult',
            corrosionResistance: 'excellent',
            temperature: 'medium'
        },
        modifiers: {
            cost: 5.0,           // 400% mais caro
            weight: 0.8,         // 20% mais leve
            durability: 0.9,     // 10% menos HP
            maintenance: 1.15,   // 15% mais manutenção
            radarSignature: 0.7  // 30% menos detectable (furtividade)
        },
        techRequirements: {
            minAeronautics: 85,
            yearIntroduced: 1960,
            preferredEra: ['modern', 'future']
        },
        advantages: ['Muito leve', 'Furtividade', 'Resistente à corrosão', 'Flexibilidade de design'],
        disadvantages: ['Extremamente caro', 'Complexa manutenção', 'Menor durabilidade', 'Tecnologia cutting-edge'],
        compatibleCategories: ['fighter', 'reconnaissance'],
        notes: 'Material experimental para aeronaves furtivas e de reconhecimento de última geração.'
    },

    wood_fabric: {
        id: 'wood_fabric',
        name: 'Madeira e Tecido',
        icon: '🪵',
        description: 'Construção tradicional com madeira e tecido, muito leve e barata.',
        characteristics: {
            availability: 'very_common',
            workability: 'excellent',
            corrosionResistance: 'poor',
            temperature: 'low'
        },
        modifiers: {
            cost: 0.6,           // 40% mais barato
            weight: 0.7,         // 30% mais leve
            durability: 0.6,     // 40% menos HP
            maintenance: 1.3,    // 30% mais manutenção
            radarSignature: 0.9  // Ligeiramente menos detectável
        },
        techRequirements: {
            minAeronautics: 5,
            yearIntroduced: 1920,
            preferredEra: ['early_piston']
        },
        advantages: ['Muito barato', 'Muito leve', 'Fácil reparo de campo', 'Disponível globalmente'],
        disadvantages: ['Frágil', 'Vulnerável ao clima', 'Limitações de velocidade', 'Alta manutenção'],
        compatibleCategories: ['fighter', 'reconnaissance', 'transport'],
        notes: 'Material da era pioneira da aviação. Ainda útil para aeronaves leves e baratas.'
    },

    magnesium: {
        id: 'magnesium',
        name: 'Magnésio',
        icon: '✨',
        description: 'Liga de magnésio ultra-leve, mas com riscos de incêndio.',
        characteristics: {
            availability: 'uncommon',
            workability: 'good',
            corrosionResistance: 'poor',
            temperature: 'low'
        },
        modifiers: {
            cost: 1.4,           // 40% mais caro
            weight: 0.75,        // 25% mais leve
            durability: 0.8,     // 20% menos HP
            maintenance: 1.4,    // 40% mais manutenção
            radarSignature: 1.0  // Neutro
        },
        techRequirements: {
            minAeronautics: 45,
            yearIntroduced: 1940,
            preferredEra: ['piston', 'early_jet']
        },
        advantages: ['Muito leve', 'Boa resistência específica', 'Excelente para racing'],
        disadvantages: ['Risco de incêndio', 'Corrosão galvânica', 'Manutenção complexa', 'Temperatura limitada'],
        compatibleCategories: ['fighter', 'reconnaissance'],
        notes: 'Material especializado para aeronaves que priorizam peso mínimo acima de tudo.'
    }
};

/**
 * Gets material by ID
 * @param {string} materialId - Material ID
 * @returns {Object|null} Material object or null
 */
export function getMaterial(materialId) {
    return STRUCTURAL_MATERIALS[materialId] || null;
}

/**
 * Gets all materials as an array
 * @returns {Array<Object>} Array of material objects
 */
export function getAllMaterials() {
    return Object.values(STRUCTURAL_MATERIALS);
}

/**
 * Gets materials available for a specific category and tech level
 * @param {string} categoryId - Aircraft category
 * @param {number} techLevel - Current technology level
 * @param {number} currentYear - Current game year
 * @returns {Array<Object>} Array of available materials
 */
export function getAvailableMaterials(categoryId, techLevel = 50, currentYear = 1954) {
    return getAllMaterials().filter(material => {
        // Check category compatibility
        if (!material.compatibleCategories.includes(categoryId)) {
            return false;
        }

        // Check tech level requirement
        if (material.techRequirements.minAeronautics > techLevel) {
            return false;
        }

        // Check year introduction
        if (material.techRequirements.yearIntroduced > currentYear) {
            return false;
        }

        return true;
    });
}

/**
 * Calculates material performance impact
 * @param {string} materialId - Material ID
 * @param {Object} baseStats - Base aircraft statistics
 * @returns {Object} Modified statistics
 */
export function applyMaterialModifiers(materialId, baseStats) {
    const material = getMaterial(materialId);
    if (!material) return baseStats;

    const modifiers = material.modifiers;

    return {
        ...baseStats,
        cost: (baseStats.cost || 0) * modifiers.cost,
        weight: (baseStats.weight || 0) * modifiers.weight,
        durability: (baseStats.durability || 100) * modifiers.durability,
        maintenanceCost: (baseStats.maintenanceCost || 0) * modifiers.maintenance,
        radarSignature: (baseStats.radarSignature || 1.0) * modifiers.radarSignature
    };
}

/**
 * Gets material comparison data
 * @param {Array<string>} materialIds - Array of material IDs to compare
 * @returns {Object} Comparison data
 */
export function compareMaterials(materialIds) {
    const comparison = {
        materials: {},
        metrics: ['cost', 'weight', 'durability', 'maintenance', 'radarSignature']
    };

    materialIds.forEach(id => {
        const material = getMaterial(id);
        if (material) {
            comparison.materials[id] = {
                name: material.name,
                modifiers: material.modifiers,
                advantages: material.advantages,
                disadvantages: material.disadvantages
            };
        }
    });

    return comparison;
}

/**
 * Gets recommended material for a specific use case
 * @param {Object} requirements - Requirements object
 * @returns {Object} Recommendation result
 */
export function getRecommendedMaterial(requirements) {
    const {
        category = 'fighter',
        priority = 'balanced', // 'cost', 'weight', 'durability', 'stealth', 'balanced'
        techLevel = 50,
        currentYear = 1954,
        budget = 'medium' // 'low', 'medium', 'high', 'unlimited'
    } = requirements;

    const availableMaterials = getAvailableMaterials(category, techLevel, currentYear);

    if (availableMaterials.length === 0) {
        return { material: null, reason: 'No materials available for current tech level' };
    }

    // Score materials based on priority
    const scoredMaterials = availableMaterials.map(material => {
        let score = 0;
        const mods = material.modifiers;

        switch (priority) {
            case 'cost':
                score = 2.0 - mods.cost; // Lower cost = higher score
                break;
            case 'weight':
                score = 2.0 - mods.weight; // Lower weight = higher score
                break;
            case 'durability':
                score = mods.durability; // Higher durability = higher score
                break;
            case 'stealth':
                score = 2.0 - mods.radarSignature; // Lower signature = higher score
                break;
            case 'balanced':
            default:
                // Balanced scoring considers all factors
                score = (
                    (2.0 - mods.cost) * 0.2 +
                    (2.0 - mods.weight) * 0.3 +
                    mods.durability * 0.3 +
                    (2.0 - mods.maintenance) * 0.2
                );
                break;
        }

        // Apply budget constraints
        if (budget === 'low' && mods.cost > 1.5) score *= 0.3;
        if (budget === 'medium' && mods.cost > 2.5) score *= 0.5;
        // High and unlimited budgets don't penalize cost

        return { material, score };
    });

    // Sort by score (descending)
    scoredMaterials.sort((a, b) => b.score - a.score);

    const recommended = scoredMaterials[0];
    return {
        material: recommended.material,
        score: recommended.score,
        reason: `Best ${priority} option available`,
        alternatives: scoredMaterials.slice(1, 3).map(sm => sm.material)
    };
}

/**
 * Validates material selection for aircraft configuration
 * @param {string} materialId - Selected material ID
 * @param {Object} aircraftConfig - Aircraft configuration
 * @returns {Object} Validation result
 */
export function validateMaterialSelection(materialId, aircraftConfig) {
    const material = getMaterial(materialId);
    if (!material) {
        return { isValid: false, errors: ['Material not found'] };
    }

    const errors = [];
    const warnings = [];

    // Check category compatibility
    if (aircraftConfig.category && !material.compatibleCategories.includes(aircraftConfig.category)) {
        errors.push(`${material.name} não é compatível com aeronaves de categoria ${aircraftConfig.category}`);
    }

    // Check tech level
    if (aircraftConfig.techLevel < material.techRequirements.minAeronautics) {
        errors.push(`${material.name} requer nível tecnológico ${material.techRequirements.minAeronautics}, atual: ${aircraftConfig.techLevel}`);
    }

    // Check year
    if (aircraftConfig.currentYear < material.techRequirements.yearIntroduced) {
        errors.push(`${material.name} só estará disponível em ${material.techRequirements.yearIntroduced}`);
    }

    // Performance warnings
    if (material.modifiers.durability < 0.8) {
        warnings.push(`${material.name} reduz significativamente a durabilidade da aeronave`);
    }

    if (material.modifiers.cost > 2.0) {
        warnings.push(`${material.name} aumenta substancialmente o custo da aeronave`);
    }

    if (material.modifiers.maintenance > 1.3) {
        warnings.push(`${material.name} requer manutenção mais complexa e custosa`);
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        material
    };
}