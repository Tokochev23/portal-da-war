export const wing_types = {
    // === Era da Hélice (Obsoletas em 1954, mas ainda em uso) ===
    biplane: {
        name: "Biplano",
        description: "Duas asas sobrepostas. Tecnologia obsoleta em 1954, usado apenas em aeronaves de treinamento básico.",
        cost_mod: 0.8,
        weight_mod: 1.1,
        drag_mod: 1.3,
        cl_max_mod: 1.25,
        maneuverability_mod: 1.2,
        reliability_mod: 1.0,
        tech_level: 15,
        max_speed_limit: 450, // km/h - limitação física
        maintainabilityModifier: 0.9,
        radarSignatureModifier: 1.2,
        lifecycleCostMultiplier: 0.9,
        techLevelRequirement: 15,
        position: [0, 0, 0]
    },
    
    monoplane_wood: {
        name: "Monoplano Madeira",
        description: "Asa única de madeira. Tecnologia da guerra, ainda usada em aviões civis leves.",
        cost_mod: 0.9,
        weight_mod: 0.95,
        drag_mod: 1.05,
        cl_max_mod: 1.0,
        maneuverability_mod: 1.0,
        reliability_mod: 0.94,
        tech_level: 20,
        max_speed_limit: 550,
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0.9,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 20,
        position: [0, 0, 0]
    },

    // === Era dos Caças a Hélice (1945-1950) ===
    monoplane_metal: {
        name: "Monoplano Metal Convencional",
        description: "Asa reta metálica padrão da 2ª Guerra. Robusta e confiável para caças a hélice.",
        cost_mod: 1.0,
        weight_mod: 1.0,
        drag_mod: 1.0,
        cl_max_mod: 1.0,
        maneuverability_mod: 1.0,
        reliability_mod: 1.0,
        tech_level: 30,
        max_speed_limit: 720,
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 1.0,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 30,
        position: [0, 0, 0]
    },

    laminar_flow: {
        name: "Perfil Laminar",
        description: "Asa com perfil aerodinâmico avançado. Reduz arrasto, mas sensível à rugosidade superficial.",
        cost_mod: 1.3,
        weight_mod: 1.05,
        drag_mod: 0.92,
        cl_max_mod: 0.98,
        maneuverability_mod: 0.98,
        reliability_mod: 0.96,
        tech_level: 45,
        max_speed_limit: 750,
        maintainabilityModifier: 1.4,
        radarSignatureModifier: 1.0,
        lifecycleCostMultiplier: 1.3,
        techLevelRequirement: 45,
        position: [0, 0, 0]
    },

    // === Era dos Primeiros Jatos (1950-1954) ===
    straight_jet: {
        name: "Asa Reta (Jato)",
        description: "Asa reta otimizada para jatos subsônicos. Boa sustentação em baixa velocidade.",
        cost_mod: 1.1,
        weight_mod: 1.05,
        drag_mod: 0.98,
        cl_max_mod: 1.05,
        maneuverability_mod: 1.02,
        reliability_mod: 1.02,
        tech_level: 55,
        max_speed_limit: 900,
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 1.0,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 55,
        position: [0, 0, 0]
    },

    swept_wing_mild: {
        name: "Asa Levemente Enflechada",
        description: "Enflechamento suave (15-25°) para jatos de transição. Compromisso entre baixa e alta velocidade.",
        cost_mod: 1.2,
        weight_mod: 1.08,
        drag_mod: 0.95,
        cl_max_mod: 0.98,
        maneuverability_mod: 0.99,
        reliability_mod: 1.0,
        tech_level: 65,
        max_speed_limit: 1050,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0.9,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 65,
        position: [0, 0, 0]
    },

    swept_wing: {
        name: "Asa Enflechada (35°)",
        description: "Enflechamento acentuado para jatos transônicos. Padrão dos caças modernos de 1954.",
        cost_mod: 1.4,
        weight_mod: 1.12,
        drag_mod: 0.88,
        cl_max_mod: 0.92,
        maneuverability_mod: 0.96,
        reliability_mod: 0.98,
        tech_level: 75,
        max_speed_limit: 1200,
        maintainabilityModifier: 1.3,
        radarSignatureModifier: 0.85,
        lifecycleCostMultiplier: 1.4,
        techLevelRequirement: 75,
        position: [0, 0, 0]
    },

    swept_wing_sharp: {
        name: "Asa Agudamente Enflechada",
        description: "Enflechamento extremo (45°+) para interceptadores supersônicos. Excelente em Mach 1+.",
        cost_mod: 1.6,
        weight_mod: 1.15,
        drag_mod: 0.82,
        cl_max_mod: 0.88,
        maneuverability_mod: 0.94,
        reliability_mod: 0.96,
        tech_level: 85,
        max_speed_limit: 1400,
        maintainabilityModifier: 1.4,
        radarSignatureModifier: 0.8,
        lifecycleCostMultiplier: 1.5,
        techLevelRequirement: 85,
        position: [0, 0, 0]
    },

    // === Configurações Experimentais (1954) ===
    delta_wing: {
        name: "Asa Delta",
        description: "Asa triangular experimental. Excelente para supersônicos, mas decolagem/pouso complicados.",
        cost_mod: 1.8,
        weight_mod: 1.0,
        drag_mod: 0.78,
        cl_max_mod: 0.82,
        maneuverability_mod: 1.08,
        reliability_mod: 0.92,
        tech_level: 95,
        max_speed_limit: 1600,
        maintainabilityModifier: 1.6,
        radarSignatureModifier: 0.75,
        lifecycleCostMultiplier: 1.8,
        techLevelRequirement: 95,
        position: [0, 0, 0]
    },

    variable_sweep: {
        name: "Asa de Geometria Variável (Protótipo)",
        description: "Tecnologia experimental: asa que muda o enflechamento em voo. Complexa mas versátil.",
        cost_mod: 2.2,
        weight_mod: 1.25,
        drag_mod: 0.85,
        cl_max_mod: 1.0,
        maneuverability_mod: 1.1,
        reliability_mod: 0.88,
        tech_level: 110,
        max_speed_limit: 1500,
        maintainabilityModifier: 2.5,
        radarSignatureModifier: 0.8,
        lifecycleCostMultiplier: 2.5,
        techLevelRequirement: 110,
        position: [0, 0, 0]
    }
};

export const wing_features = {
    // === Dispositivos Hipersustentadores ===
    flaps_simple: {
        name: "Flaps Simples",
        description: "Flaps básicos para melhorar decolagem/pouso. Padrão em aeronaves civis.",
        cost: 3000,
        weight: 30,
        cl_max_mod: 1.12,
        drag_mod: 1.03,
        reliability_mod: 0.99,
        tech_level: 25,
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.01,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 25,
        position: [0, 0, 0]
    },
    
    flaps_split: {
        name: "Flaps Divididos",
        description: "Flaps militares da 2ª Guerra. Robustos e eficazes para caças.",
        cost: 5000,
        weight: 45,
        cl_max_mod: 1.18,
        drag_mod: 1.05,
        reliability_mod: 0.98,
        tech_level: 30,
        maintainabilityModifier: 1.05,
        radarSignatureModifier: 0.01,
        lifecycleCostMultiplier: 1.05,
        techLevelRequirement: 30,
        position: [0, 0, 0]
    },

    flaps_fowler: {
        name: "Flaps Fowler",
        description: "Flaps avançados que aumentam área da asa. Máxima eficácia para jatos pesados.",
        cost: 12000,
        weight: 85,
        cl_max_mod: 1.28,
        drag_mod: 1.08,
        reliability_mod: 0.95,
        tech_level: 60,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0.02,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 60,
        position: [0, 0, 0]
    },

    slats_fixed: {
        name: "Slats Fixos",
        description: "Bordos de ataque fixos para melhorar comportamento em estol.",
        cost: 4000,
        weight: 25,
        cl_max_mod: 1.08,
        stall_speed_mod: 0.94,
        reliability_mod: 1.0,
        tech_level: 35,
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.02,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    },

    slats_automatic: {
        name: "Slats Automáticos",
        description: "Slats que abrem automaticamente em alto ângulo. Padrão em caças avançados.",
        cost: 8000,
        weight: 40,
        cl_max_mod: 1.15,
        stall_speed_mod: 0.88,
        reliability_mod: 0.97,
        tech_level: 55,
        maintainabilityModifier: 1.3,
        radarSignatureModifier: 0.01,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 55,
        position: [0, 0, 0]
    },

    // === Sistemas Navais ===
    folding_wings: {
        name: "Asas Dobráveis (Naval)",
        description: "Para porta-aviões. Asas dobram para economizar espaço no hangar.",
        cost: 15000,
        weight: 180,
        reliability_mod: 0.94,
        tech_level: 40,
        maintainabilityModifier: 1.5,
        radarSignatureModifier: 0.05,
        lifecycleCostMultiplier: 1.4,
        techLevelRequirement: 40,
        position: [0, 0, 0]
    },

    reinforced_structure: {
        name: "Estrutura Naval Reforçada",
        description: "Estrutura robusta para pousos violentos em porta-aviões e gancho de cauda.",
        cost: 8000,
        weight: 120,
        reliability_mod: 1.05,
        durability_mod: 1.2,
        tech_level: 35,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    },

    // === Sistemas de Controle ===
    ailerons_powered: {
        name: "Ailerons Servoassistidos",
        description: "Controles assistidos por pressão hidráulica. Essencial para jatos de alta velocidade.",
        cost: 18000,
        weight: 60,
        maneuverability_mod: 1.12,
        reliability_mod: 0.96,
        tech_level: 65,
        maintainabilityModifier: 1.4,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.3,
        techLevelRequirement: 65,
        position: [0, 0, 0]
    },

    spoilers: {
        name: "Spoilers",
        description: "Superfícies que destroem sustentação para pouso íngreme ou redução rápida de velocidade.",
        cost: 10000,
        weight: 45,
        landing_mod: 1.15,
        drag_mod_deployable: 1.25,
        tech_level: 60,
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0.01,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 60,
        position: [0, 0, 0]
    },

    air_brakes: {
        name: "Freios Aerodinâmicos",
        description: "Placas que abrem para aumentar arrasto. Cruciais para jatos rápidos.",
        cost: 6000,
        weight: 35,
        deceleration_mod: 1.3,
        reliability_mod: 0.98,
        tech_level: 55,
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0.02,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 55,
        position: [0, 0, 0]
    },

    // === Sistemas Avançados (1954) ===
    wing_fences: {
        name: "Cercas de Asa",
        description: "Pequenas placas verticais que melhoram fluxo de ar em asas enflechadas.",
        cost: 2000,
        weight: 15,
        drag_mod: 0.98,
        stall_characteristics_mod: 1.1,
        tech_level: 70,
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.03,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 70,
        position: [0, 0, 0]
    },

    boundary_layer_control: {
        name: "Controle de Camada Limite",
        description: "Sistema experimental que sopra ar dos motores sobre as asas para aumentar sustentação.",
        cost: 25000,
        weight: 90,
        cl_max_mod: 1.22,
        fuel_consumption_mod: 1.08,
        reliability_mod: 0.92,
        tech_level: 90,
        maintainabilityModifier: 1.8,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.7,
        techLevelRequirement: 90,
        position: [0, 0, 0]
    },

    // === Tanques e Armamentos ===
    wing_tanks: {
        name: "Tanques de Combustível Integrais",
        description: "Combustível armazenado dentro da estrutura da asa. Aumenta autonomia.",
        cost: 8000,
        weight: 50, // Peso do sistema, não do combustível
        fuel_capacity_mod: 1.4,
        reliability_mod: 0.97,
        tech_level: 35,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    },

    wing_hardpoints: {
        name: "Pontos de Fixação (4x)",
        description: "Pontos reforçados para carregar bombas, mísseis ou tanques externos.",
        cost: 5000,
        weight: 80,
        payload_capacity_mod: 1.25,
        reliability_mod: 0.99,
        tech_level: 30,
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0.05,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 30,
        position: [0, 0, 0]
    },

    wing_hardpoints_heavy: {
        name: "Pontos Pesados (6x)",
        description: "Pontos de fixação reforçados para cargas pesadas como bombas de 500kg+.",
        cost: 12000,
        weight: 150,
        payload_capacity_mod: 1.6,
        drag_mod: 1.02,
        reliability_mod: 0.98,
        tech_level: 55,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0.08,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 55,
        position: [0, 0, 0]
    }
};