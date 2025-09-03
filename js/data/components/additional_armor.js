export const additional_armor = {
    // === BLINDAGENS IMPROVISADAS ===
    sandbags: {
        name: "Sacos de Areia",
        type: "improvised",
        protection_bonus: 15,
        weight: 500,
        cost: 200,
        coverage: ["frontal", "lateral"],
        max_thickness: 300,
        tech_requirement: { year: 1939, level: 0 },
        effectiveness_vs: {
            ap: 0.3,     // Pouca proteção contra perfurantes
            he: 0.7,     // Boa contra explosivos
            heat: 0.2    // Ruim contra HEAT
        },
        durability: 0.4,
        weather_resistance: 0.2,
        description: "Proteção barata e improvisada, absorve fragmentos"
    },

    concrete_blocks: {
        name: "Blocos de Concreto",
        type: "improvised", 
        protection_bonus: 25,
        weight: 800,
        cost: 300,
        coverage: ["frontal"],
        max_thickness: 400,
        tech_requirement: { year: 1940, level: 10 },
        effectiveness_vs: {
            ap: 0.4,
            he: 0.8,
            heat: 0.3
        },
        durability: 0.6,
        weather_resistance: 0.9,
        description: "Proteção sólida mas extremamente pesada"
    },

    wood_logs: {
        name: "Toras de Madeira",
        type: "improvised",
        protection_bonus: 8,
        weight: 300,
        cost: 50,
        coverage: ["lateral", "traseira"],
        max_thickness: 200,
        tech_requirement: { year: 1941, level: 0 },
        effectiveness_vs: {
            ap: 0.1,
            he: 0.5,
            heat: 0.3
        },
        durability: 0.3,
        fire_risk: 0.25,
        weather_resistance: 0.1,
        description: "Proteção improvisada muito barata, risco de incêndio"
    },

    spare_tracks: {
        name: "Esteiras Sobressalentes",
        type: "field_modification",
        protection_bonus: 12,
        weight: 200,
        cost: 150,
        coverage: ["frontal", "lateral"],
        max_thickness: 50,
        tech_requirement: { year: 1942, level: 20 },
        effectiveness_vs: {
            ap: 0.6,
            he: 0.4,
            heat: 0.2
        },
        durability: 0.8,
        mobility_penalty: 0.02,
        description: "Proteção usando peças sobressalentes, prática comum"
    },

    fuel_drums_empty: {
        name: "Tambores Vazios",
        type: "improvised",
        protection_bonus: 5,
        weight: 150,
        cost: 100,
        coverage: ["traseira", "lateral"],
        max_thickness: 200,
        tech_requirement: { year: 1940, level: 0 },
        effectiveness_vs: {
            ap: 0.1,
            he: 0.3,
            heat: 0.2
        },
        durability: 0.2,
        description: "Proteção mínima, mais psicológica que real"
    },

    // === BLINDAGENS ADICIONAIS SOLDADAS ===
    welded_plates_light: {
        name: "Placas Soldadas Leves",
        type: "welded_addition",
        protection_bonus: 20,
        weight: 400,
        cost: 1800,
        coverage: ["frontal", "lateral"],
        max_thickness: 25,
        tech_requirement: { year: 1942, level: 35 },
        effectiveness_vs: {
            ap: 0.8,
            he: 0.7,
            heat: 0.6
        },
        durability: 0.9,
        weld_quality_factor: 0.85,
        description: "Placas de aço leve soldadas, solução econômica"
    },

    welded_plates_medium: {
        name: "Placas Soldadas Médias",
        type: "welded_addition",
        protection_bonus: 35,
        weight: 600,
        cost: 2800,
        coverage: ["frontal", "lateral"],
        max_thickness: 40,
        tech_requirement: { year: 1943, level: 45 },
        effectiveness_vs: {
            ap: 0.9,
            he: 0.8,
            heat: 0.7
        },
        durability: 0.9,
        weld_quality_factor: 0.9,
        description: "Placas de espessura média, bom equilíbrio"
    },

    welded_plates_heavy: {
        name: "Placas Soldadas Pesadas",
        type: "welded_addition",
        protection_bonus: 50,
        weight: 900,
        cost: 4200,
        coverage: ["frontal"],
        max_thickness: 80,
        tech_requirement: { year: 1944, level: 55 },
        effectiveness_vs: {
            ap: 0.95,
            he: 0.85,
            heat: 0.8
        },
        durability: 0.95,
        weld_quality_factor: 0.95,
        mobility_penalty: 0.05,
        description: "Placas pesadas soldadas, máxima proteção"
    },

    // === BLINDAGENS HISTÓRICAS ESPECÍFICAS ===
    welded_additional_plates: {
        name: "Placas Adicionais Soldadas",
        type: "welded_armor",
        protection_bonus: 35,
        weight: 450,
        cost: 800,
        coverage: ["frontal", "lateral"],
        max_thickness: 60,
        tech_requirement: { year: 1943, level: 35 },
        effectiveness_vs: {
            ap: 0.85,
            he: 0.9,
            heat: 0.8
        },
        durability: 0.8,
        availability: 0.8,
        description: "Placas de blindagem soldadas nas oficinas, proteção adicional confiável"
    },

    sherman_applique: {
        name: "Blindagem Aplique Sherman",
        type: "field_modification",
        protection_bonus: 25,
        weight: 500,
        cost: 2000,
        coverage: ["frontal"],
        max_thickness: 38,
        tech_requirement: { year: 1944, level: 40 },
        effectiveness_vs: {
            ap: 0.85,
            he: 0.75,
            heat: 0.7
        },
        durability: 0.88,
        historical: true,
        description: "Kit de blindagem adicional para M4 Sherman"
    },

    // === BLINDAGENS REATIVAS ===
    era_primitive: {
        name: "ERA Primitiva Experimental",
        type: "reactive_armor",
        protection_bonus: 80,
        weight: 300,
        cost: 8000,
        coverage: ["frontal"],
        max_thickness: 15,
        tech_requirement: { year: 1954, level: 85 },
        effectiveness_vs: {
            ap: 0.6,     // Menos efetiva contra cinéticos
            he: 0.95,    // Muito efetiva contra HE
            heat: 1.2    // Extremamente efetiva contra HEAT
        },
        durability: 0.7,
        experimental: true,
        reliability: 0.75,
        maintenance_complexity: 2.0,
        description: "Primeira geração de blindagem reativa explosiva"
    },

    era_advanced_prototype: {
        name: "ERA Avançada (Protótipo)",
        type: "reactive_armor",
        protection_bonus: 120,
        weight: 250,
        cost: 15000,
        coverage: ["frontal", "lateral"],
        max_thickness: 12,
        tech_requirement: { year: 1954, level: 95 },
        effectiveness_vs: {
            ap: 0.8,
            he: 1.1,
            heat: 1.4    // Devastadora contra HEAT
        },
        durability: 0.8,
        experimental: true,
        prototype_only: true,
        reliability: 0.65,
        maintenance_complexity: 3.0,
        description: "Protótipo avançado de ERA, tecnologia experimental"
    },

    // === BLINDAGENS ESPECIAIS ===
    cage_armor: {
        name: "Blindagem Gaiola",
        type: "standoff_armor",
        protection_bonus: 8,
        weight: 120,
        cost: 800,
        coverage: ["lateral", "traseira"],
        max_thickness: 200,
        tech_requirement: { year: 1944, level: 35 },
        effectiveness_vs: {
            ap: 0.1,     // Inútil contra AP
            he: 0.4,
            heat: 0.9    // Excelente contra HEAT
        },
        durability: 0.6,
        mobility_penalty: 0.03,
        description: "Grades metálicas contra granadas HEAT"
    },

    spaced_armor: {
        name: "Blindagem Espaçada",
        type: "spaced_armor",
        protection_bonus: 30,
        weight: 400,
        cost: 2500,
        coverage: ["frontal", "lateral"],
        max_thickness: 20,
        tech_requirement: { year: 1943, level: 50 },
        effectiveness_vs: {
            ap: 0.7,
            he: 0.9,     // Muito boa contra HE
            heat: 1.1    // Excelente contra HEAT
        },
        durability: 0.8,
        air_gap: 150,
        description: "Placas com espaçamento de ar, quebra projéteis HEAT"
    },

    schurzen: {
        name: "Schürzen (Saias Laterais)",
        type: "side_skirts",
        protection_bonus: 15,
        weight: 180,
        cost: 600,
        coverage: ["lateral"],
        max_thickness: 5,
        tech_requirement: { year: 1943, level: 30 },
        effectiveness_vs: {
            ap: 0.2,
            he: 0.8,     // Boa contra HE e fragmentos
            heat: 0.6
        },
        durability: 0.5,
        historical: true,
        description: "Saias laterais alemãs, proteção contra projéteis HE"
    },

    // === BLINDAGENS COMPOSTAS EXPERIMENTAIS ===
    composite_ceramic: {
        name: "Compósito Cerâmico Experimental",
        type: "composite_armor",
        protection_bonus: 90,
        weight: 600,
        cost: 12000,
        coverage: ["frontal"],
        max_thickness: 60,
        tech_requirement: { year: 1954, level: 90 },
        effectiveness_vs: {
            ap: 1.3,     // Excelente contra AP
            he: 1.0,
            heat: 1.1
        },
        durability: 0.85,
        experimental: true,
        prototype_only: true,
        heat_resistance: 1.5,
        description: "Blindagem compósita experimental com cerâmica"
    },

    laminated_armor: {
        name: "Blindagem Laminada Experimental",
        type: "laminated_armor",
        protection_bonus: 70,
        weight: 550,
        cost: 9500,
        coverage: ["frontal", "lateral"],
        max_thickness: 50,
        tech_requirement: { year: 1953, level: 80 },
        effectiveness_vs: {
            ap: 1.1,
            he: 0.95,
            heat: 1.0
        },
        durability: 0.9,
        experimental: true,
        spall_resistance: 1.3,
        description: "Múltiplas camadas de materiais diferentes"
    }
};

// Sistema de ângulos de blindagem
export const armor_angles = {
    vertical_90: {
        name: "Vertical (90°)",
        angle: 90,
        effectiveness_multiplier: 1.0,
        internal_space_factor: 1.0,
        crew_capacity_penalty: 0,
        weight_distribution: 1.0,
        visibility_penalty: 0,
        description: "Blindagem vertical tradicional"
    },
    
    sloped_75: {
        name: "Inclinada 75°",
        angle: 75,
        effectiveness_multiplier: 1.1,
        internal_space_factor: 0.95,
        crew_capacity_penalty: 0,
        weight_distribution: 1.05,
        visibility_penalty: 0.05,
        description: "Inclinação leve, bom equilíbrio"
    },
    
    sloped_60: {
        name: "Inclinada 60°",
        angle: 60,
        effectiveness_multiplier: 1.25,
        internal_space_factor: 0.9,
        crew_capacity_penalty: 0,
        weight_distribution: 1.1,
        visibility_penalty: 0.1,
        gun_depression_penalty: 2,
        description: "Inclinação moderada, boa proteção"
    },
    
    sloped_45: {
        name: "Inclinada 45°",
        angle: 45,
        effectiveness_multiplier: 1.41,  // 1/sin(45°)
        internal_space_factor: 0.85,
        crew_capacity_penalty: 0,
        weight_distribution: 1.15,
        visibility_penalty: 0.15,
        gun_depression_penalty: 4,
        description: "Inclinação acentuada, excelente proteção"
    },
    
    sloped_30: {
        name: "Extremamente Inclinada 30°",
        angle: 30,
        effectiveness_multiplier: 2.0,
        internal_space_factor: 0.75,
        crew_capacity_penalty: 1,  // Reduz 1 tripulante
        weight_distribution: 1.25,
        visibility_penalty: 0.25,
        gun_depression_penalty: 8,
        ammo_capacity_penalty: 0.2,
        description: "Proteção máxima, severas limitações internas"
    },
    
    pike_nose: {
        name: "Nariz de Lúcio",
        angle: 55,
        effectiveness_multiplier: 1.35,
        internal_space_factor: 0.8,
        crew_capacity_penalty: 0,
        weight_distribution: 1.2,
        visibility_penalty: 0.2,
        gun_depression_penalty: 3,
        complex_manufacturing: true,
        cost_multiplier: 1.3,
        description: "Design angulado complexo, como IS-3"
    },
    
    mantlet_heavy: {
        name: "Mantlet Pesado",
        angle: 85,
        effectiveness_multiplier: 1.4,
        internal_space_factor: 0.9,
        crew_capacity_penalty: 0,
        weight_distribution: 1.3,
        visibility_penalty: 0.1,
        turret_only: true,
        gun_handling_penalty: 0.1,
        description: "Mantlet blindado reforçado"
    }
};

// Sistema de cálculo de eficiência
export const armorEfficiencyCalculator = {
    calculateEffectiveThickness(baseThickness, material, angle, additionalArmor) {
        let effectiveness = baseThickness;
        
        // Aplicar fator do material
        if (material && material.effectiveness_factor) {
            effectiveness *= material.effectiveness_factor;
        }
        
        // Aplicar multiplicador do ângulo
        if (angle && angle.effectiveness_multiplier) {
            effectiveness *= angle.effectiveness_multiplier;
        }
        
        // Adicionar blindagens adicionais
        if (additionalArmor && additionalArmor.length > 0) {
            additionalArmor.forEach(armor => {
                if (armor && armor.protection_bonus) {
                    effectiveness += armor.protection_bonus * (armor.effectiveness_vs?.ap || 1.0);
                }
            });
        }
        
        return Math.round(effectiveness);
    },
    
    calculatePenalties(angle, additionalArmor, baseCrewSize) {
        const penalties = {
            crew_capacity: baseCrewSize,
            weight_penalty: 0,
            visibility_penalty: 0,
            mobility_penalty: 0,
            cost_multiplier: 1.0,
            gun_depression_penalty: 0,
            ammo_capacity_penalty: 0
        };
        
        // Penalidades do ângulo
        if (angle) {
            penalties.crew_capacity -= (angle.crew_capacity_penalty || 0);
            penalties.weight_penalty += ((angle.weight_distribution || 1.0) - 1.0);
            penalties.visibility_penalty += (angle.visibility_penalty || 0);
            penalties.gun_depression_penalty += (angle.gun_depression_penalty || 0);
            penalties.ammo_capacity_penalty += (angle.ammo_capacity_penalty || 0);
            if (angle.cost_multiplier) penalties.cost_multiplier *= angle.cost_multiplier;
        }
        
        // Penalidades das blindagens adicionais
        if (additionalArmor) {
            additionalArmor.forEach(armor => {
                if (armor) {
                    penalties.mobility_penalty += (armor.mobility_penalty || 0);
                    penalties.weight_penalty += (armor.weight || 0) / 1000; // kg para toneladas
                }
            });
        }
        
        return penalties;
    },
    
    getArmorRating(effectiveThickness) {
        if (effectiveThickness >= 300) return { rating: "Excepcional", color: "text-purple-400", level: 5 };
        if (effectiveThickness >= 200) return { rating: "Excelente", color: "text-green-400", level: 4 };
        if (effectiveThickness >= 150) return { rating: "Boa", color: "text-blue-400", level: 3 };
        if (effectiveThickness >= 100) return { rating: "Adequada", color: "text-yellow-400", level: 2 };
        if (effectiveThickness >= 50) return { rating: "Fraca", color: "text-orange-400", level: 1 };
        return { rating: "Inadequada", color: "text-red-400", level: 0 };
    }
};