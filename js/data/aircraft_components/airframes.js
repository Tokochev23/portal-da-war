export const airframes = {
    // =================================================================================
    // NOTA DE DESENVOLVIMENTO:
    // As propriedades cl_max, cd_0, aspect_ratio e oswald_efficiency foram adicionadas
    // para permitir um cálculo de performance dinâmico, inspirado no projeto de referência.
    // O campo max_speed_kph será depreciado e substituído por um cálculo em tempo real
    // baseado na potência do motor, arrasto e outras características da fuselagem.
    // =================================================================================

    // ========== ÁRVORE TECNOLÓGICA: CAÇAS (Inspirado no projeto de referência) =========

    light_fighter: {
        name: "Caça Leve",
        description: "Uma fuselagem de caça leve padrão, equilibrando agilidade e custo. Estrutura metálica.",
        category: "fighter",
        tech_tree: "fighters",
        tech_era: "piston",
        base_weight: 1800,
        max_takeoff_weight: 3200,
        wing_area_m2: 20,
        internal_fuel_kg: 450,
        g_limit: 9,
        hardpoints: 2,
        min_engines: 1,
        max_engines: 1,
        compatible_engine_types: ["piston_inline", "piston_radial"],
        tech_level: 30,
        year_introduced: 1946,
        prerequisites: [],
        advantages: ["Excelente manobrabilidade", "Baixo custo", "Leve"],
        disadvantages: ["Armamento limitado", "Alcance curto", "Estrutura padrão"],
        // --- Parâmetros Aerodinâmicos ---
        cl_max: 1.6,
        cd_0: 0.028, // Slightly more drag than wood/fabric
        aspect_ratio: 6.2,
        oswald_efficiency: 0.8,
        max_speed_kph: 700,
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 1.0,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 30,
        position: [0, 0, 0]
    },
    
    // === CAÇAS A JATO INICIAL (1950-1952) ===
    early_jet_fighter: {
        name: "Caça a Jato Inicial",
        description: "Primeiro caça a jato subsônico básico",
        category: "fighter",
        tech_tree: "fighters",
        tech_era: "early_jet",
        base_weight: 4000,
        max_takeoff_weight: 8000,
        wing_area_m2: 24,
        internal_fuel_kg: 1200,
        g_limit: 7,
        hardpoints: 4,
        min_engines: 1,
        max_engines: 2,
        compatible_engine_types: ["turbojet_early"],
        compatible_missions: ["air_superiority", "interceptor", "training"],
        tech_level: 60,
        year_introduced: 1950,
        prerequisites: ["light_fighter"],
        advantages: ["Manobrabilidade alta", "Custo baixo", "Manutenção simples"],
        disadvantages: ["Velocidade limitada", "Alcance reduzido"],
        // --- Parâmetros Aerodinâmicos ---
        cl_max: 1.4,
        cd_0: 0.022,
        aspect_ratio: 5.5,
        oswald_efficiency: 0.75,
        max_speed_kph: 1100, // Será depreciado
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0.95,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 60,
        position: [0, 0, 0]
    },

    // === CAÇA DE 1ª GERAÇÃO A JATO (1952-1954) ===
    first_gen_jet_fighter: {
        name: "Caça de 1ª Geração a Jato",
        description: "Caça a jato melhorado com performance superior",
        category: "fighter",
        tech_tree: "fighters",
        tech_era: "first_gen_jet",
        base_weight: 4800,
        max_takeoff_weight: 9500,
        wing_area_m2: 26,
        internal_fuel_kg: 1500,
        g_limit: 7.5,
        hardpoints: 4,
        min_engines: 1,
        max_engines: 2,
        compatible_engine_types: ["turbojet_early", "turbojet_improved"],
        compatible_missions: ["air_superiority", "interceptor", "multi_role"],
        tech_level: 75,
        year_introduced: 1952,
        prerequisites: ["early_jet_fighter"],
        advantages: ["Performance equilibrada", "Versatilidade", "Confiabilidade boa"],
        disadvantages: ["Ainda subsônico", "Consumo moderado"],
        // --- Parâmetros Aerodinâmicos ---
        cl_max: 1.45,
        cd_0: 0.021,
        aspect_ratio: 5.8,
        oswald_efficiency: 0.77,
        max_speed_kph: 1200, // Será depreciado
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.15,
        radarSignatureModifier: 0.9,
        lifecycleCostMultiplier: 1.3,
        techLevelRequirement: 75,
        position: [0, 0, 0]
    },

    // === CAÇA SUPERSÔNICO 2ª GERAÇÃO (1954-1956) ===
    supersonic_gen2_fighter: {
        name: "Caça Supersônico 2ª Geração",
        description: "Primeiro caça supersônico operacional",
        category: "fighter",
        tech_tree: "fighters",
        tech_era: "supersonic",
        base_weight: 5500,
        max_takeoff_weight: 11000,
        wing_area_m2: 28,
        internal_fuel_kg: 2200,
        g_limit: 6.5,
        hardpoints: 4,
        min_engines: 1,
        max_engines: 2,
        compatible_engine_types: ["afterburning_turbojet_early"],
        compatible_missions: ["air_superiority", "interceptor", "multi_role"],
        tech_level: 90,
        year_introduced: 1954,
        prerequisites: ["first_gen_jet_fighter"],
        advantages: ["Velocidade supersônica", "Versatilidade", "Capacidade BVR"],
        disadvantages: ["Consumo alto", "Complexidade elevada", "Caro"],
        // --- Parâmetros Aerodinâmicos ---
        cl_max: 1.3,
        cd_0: 0.018,
        aspect_ratio: 4.5,
        oswald_efficiency: 0.72,
        max_speed_kph: 1450, // Será depreciado
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.4,
        radarSignatureModifier: 0.8,
        lifecycleCostMultiplier: 1.6,
        techLevelRequirement: 90,
        position: [0, 0, 0]
    },

    // ========== ÁRVORE TECNOLÓGICA: AERONAVES DE ATAQUE =========

    cas_piston: {
        name: "Apoio Aéreo Próximo (Pistão)",
        description: "Robusto e bem armado para atacar alvos terrestres. Geralmente mais lento e blindado.",
        category: "attacker",
        tech_tree: "attackers",
        tech_era: "piston",
        base_weight: 3000,
        max_takeoff_weight: 5500,
        wing_area_m2: 28,
        internal_fuel_kg: 700,
        g_limit: 6.5,
        hardpoints: 6,
        min_engines: 1,
        max_engines: 1,
        compatible_engine_types: ["piston_radial", "piston_radial_heavy"],
        tech_level: 25,
        year_introduced: 1945,
        prerequisites: [],
        advantages: ["Robusto", "Grande capacidade de armas", "Boa blindagem"],
        disadvantages: ["Lento", "Alvo grande", "Pouco manobrável"],
        // --- Parâmetros Aerodinâmicos ---
        cl_max: 1.7,
        cd_0: 0.038,
        aspect_ratio: 5.8,
        oswald_efficiency: 0.75,
        max_speed_kph: 550, // Será depreciado
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 0.9,
        radarSignatureModifier: 1.2,
        lifecycleCostMultiplier: 0.9,
        techLevelRequirement: 25,
        position: [0, 0, 0]
    },

    // ... (outras aeronaves de ataque mantidas como no original)

    // ========== ÁRVORE TECNOLÓGICA: BOMBARDEIROS =========

    tactical_bomber_piston: {
        name: "Bombardeiro Tático (Pistão)",
        description: "Velocidade e alcance para atacar alvos táticos atrás das linhas inimigas. Carga de bombas moderada.",
        category: "bomber",
        tech_tree: "bombers",
        tech_era: "piston",
        base_weight: 5000,
        max_takeoff_weight: 9000,
        wing_area_m2: 50,
        internal_fuel_kg: 1500,
        g_limit: 5,
        hardpoints: 4,
        bomb_bay_capacity: 2000,
        min_engines: 2,
        max_engines: 2,
        compatible_engine_types: ["piston_radial", "piston_radial_heavy"],
        tech_level: 30,
        year_introduced: 1945,
        prerequisites: [],
        advantages: ["Boa velocidade para um bimotor", "Carga útil decente"],
        disadvantages: ["Vulnerável a caças", "Caro de manter"],
        // --- Parâmetros Aerodinâmicos ---
        cl_max: 1.4,
        cd_0: 0.033,
        aspect_ratio: 7.0,
        oswald_efficiency: 0.82,
        max_speed_kph: 580, // Será depreciado
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 1.5,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 30,
        position: [0, 0, 0]
    },

    strategic_bomber_piston: {
        name: "Bombardeiro Estratégico (Pistão)",
        description: "Longo alcance e grande capacidade de bombas para missões estratégicas profundas em território inimigo.",
        category: "bomber",
        tech_tree: "bombers",
        tech_era: "piston",
        base_weight: 15000,
        max_takeoff_weight: 35000,
        wing_area_m2: 120,
        internal_fuel_kg: 8000,
        g_limit: 3,
        hardpoints: 2,
        bomb_bay_capacity: 8000,
        min_engines: 4,
        max_engines: 4,
        compatible_engine_types: ["piston_radial_heavy"],
        tech_level: 35,
        year_introduced: 1946,
        prerequisites: ["tactical_bomber_piston"],
        advantages: ["Payload massivo", "Alcance intercontinental", "Resistente a danos"],
        disadvantages: ["Extremamente lento", "Muito vulnerável", "Tripulação grande"],
        // --- Parâmetros Aerodinâmicos ---
        cl_max: 1.5,
        cd_0: 0.030,
        aspect_ratio: 8.5,
        oswald_efficiency: 0.85,
        max_speed_kph: 480, // Será depreciado
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.8,
        radarSignatureModifier: 2.5,
        lifecycleCostMultiplier: 2.0,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    },

    // ... (outros bombardeiros e transportes mantidos como no original, mas com adição dos parâmetros)
    // ... (Vou omitir o resto para brevidade, mas a estrutura seria a mesma)
    
    // (Caças restantes do arquivo original, agora com os novos parâmetros)
    heavy_interceptor: {
        name: "Caça Interceptador Pesado",
        description: "Interceptador especializado para alvos de alta velocidade",
        category: "fighter",
        tech_tree: "fighters",
        tech_era: "supersonic",
        base_weight: 6200,
        max_takeoff_weight: 12500,
        max_speed_kph: 1680, // Será depreciado
        wing_area_m2: 32,
        internal_fuel_kg: 2800,
        g_limit: 5.5,
        hardpoints: 2,
        min_engines: 1,
        max_engines: 2,
        compatible_engine_types: ["afterburning_turbojet_early", "afterburning_turbojet_improved"],
        compatible_missions: ["interceptor", "air_defense"],
        tech_level: 100,
        year_introduced: 1955,
        prerequisites: ["supersonic_gen2_fighter"],
        advantages: ["Velocidade máxima", "Radar integrado", "Mísseis BVR"],
        disadvantages: ["Manobrabilidade limitada", "Custo altíssimo", "Combustível voraz"],
        cl_max: 1.2,
        cd_0: 0.019,
        aspect_ratio: 4.0,
        oswald_efficiency: 0.70,
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.6,
        radarSignatureModifier: 1.1,
        lifecycleCostMultiplier: 1.8,
        techLevelRequirement: 100,
        position: [0, 0, 0]
    },
    multi_role_fighter: {
        name: "Caça Multi-Propósito",
        description: "Plataforma versátil para múltiplas missões",
        category: "fighter",
        tech_tree: "fighters",
        tech_era: "supersonic",
        base_weight: 5200,
        max_takeoff_weight: 12800,
        max_speed_kph: 1250, // Será depreciado
        wing_area_m2: 34,
        internal_fuel_kg: 2400,
        g_limit: 6.5,
        hardpoints: 6,
        min_engines: 1,
        max_engines: 2,
        compatible_engine_types: ["turbojet_early", "afterburning_turbojet_early"],
        compatible_missions: ["air_superiority", "ground_attack", "multi_role", "reconnaissance"],
        tech_level: 85,
        year_introduced: 1954,
        prerequisites: ["first_gen_jet_fighter"],
        advantages: ["Versatilidade máxima", "Bom alcance", "Carga útil alta"],
        disadvantages: ["Especialização limitada", "Complexidade", "Peso elevado"],
        cl_max: 1.4,
        cd_0: 0.024,
        aspect_ratio: 5.0,
        oswald_efficiency: 0.78,
        // --- Novos Parâmetros Sistêmicos ---
        maintainabilityModifier: 1.3,
        radarSignatureModifier: 1.0,
        lifecycleCostMultiplier: 1.4,
        techLevelRequirement: 85,
        position: [0, 0, 0]
    }
};