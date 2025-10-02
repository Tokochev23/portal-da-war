export const aircraft_weapons = {
    // === CANHÕES INTERNOS ===
    cannon_20mm: {
        name: "Canhão Automático 20mm",
        description: "Canhão padrão para caças",
        type: "cannon",
        category: "internal_gun",
        caliber: 20, // mm
        weight: 80, // kg (sistema completo)
        rate_of_fire: 800, // rpm
        muzzle_velocity: 850, // m/s
        ammunition_weight: 120, // kg (200 rounds)
        effective_range: 800, // meters
        tech_level: 40,
        cost_base: 45000, // USD
        advantages: ["Alta taxa de tiro", "Munição abundante"],
        disadvantages: ["Alcance limitado", "Poder de parada médio"],
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 40,
        position: [0, 0, 0]
    },

    cannon_30mm: {
        name: "Canhão Pesado 30mm",
        description: "Canhão de maior calibre para interceptadores",
        type: "cannon",
        category: "internal_gun",
        caliber: 30, // mm
        weight: 145, // kg
        rate_of_fire: 600, // rpm  
        muzzle_velocity: 820, // m/s
        ammunition_weight: 180, // kg (120 rounds)
        effective_range: 1000, // meters
        tech_level: 55,
        cost_base: 78000, // USD
        advantages: ["Alto poder destruitivo", "Eficaz contra bombardeiros"],
        disadvantages: ["Taxa de tiro menor", "Peso alto", "Munição pesada"],
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 55,
        position: [0, 0, 0]
    },

    cannon_37mm: {
        name: "Canhão Anti-Aereo 37mm",
        description: "Canhão especializado anti-bombardeiro",
        type: "cannon", 
        category: "internal_gun",
        caliber: 37, // mm
        weight: 220, // kg
        rate_of_fire: 400, // rpm
        muzzle_velocity: 900, // m/s
        ammunition_weight: 240, // kg (80 rounds)
        effective_range: 1200, // meters
        tech_level: 60,
        cost_base: 125000, // USD
        advantages: ["Poder destrutivo máximo", "Longo alcance"],
        disadvantages: ["Taxa de tiro baixa", "Muito pesado", "Munição escassa"],
        maintainabilityModifier: 1.3,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.3,
        techLevelRequirement: 60,
        position: [0, 0, 0]
    },

    // === BOMBAS CONVENCIONAIS ===
    bomb_100kg: {
        name: "Bomba 100kg (Uso Geral)",
        description: "Bomba leve para ataques de precisão",
        type: "bomb",
        category: "general_purpose",
        weight: 100, // kg
        explosive_weight: 45, // kg
        blast_radius: 35, // meters
        armor_penetration: 150, // mm RHA equivalent
        tech_level: 35,
        cost_base: 800, // USD
        hardpoint_types: ["small", "medium", "large"],
        advantages: ["Leve", "Precisão boa", "Barato"],
        disadvantages: ["Poder limitado", "Área de efeito pequena"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.05,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    },

    bomb_250kg: {
        name: "Bomba 250kg (Uso Geral)",
        description: "Bomba média padrão",
        type: "bomb",
        category: "general_purpose", 
        weight: 250, // kg
        explosive_weight: 115, // kg
        blast_radius: 50, // meters
        armor_penetration: 280, // mm RHA equivalent
        tech_level: 40,
        cost_base: 1200, // USD
        hardpoint_types: ["medium", "large"],
        advantages: ["Balanceada", "Versátil", "Amplamente disponível"],
        disadvantages: ["Peso médio", "Especialização limitada"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.1,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 40,
        position: [0, 0, 0]
    },

    bomb_500kg: {
        name: "Bomba 500kg (Uso Geral)",
        description: "Bomba pesada para alvos fortificados",
        type: "bomb",
        category: "general_purpose",
        weight: 500, // kg
        explosive_weight: 240, // kg
        blast_radius: 75, // meters
        armor_penetration: 450, // mm RHA equivalent
        tech_level: 45,
        cost_base: 2100, // USD
        hardpoint_types: ["large"],
        advantages: ["Poder destrutivo alto", "Eficaz contra fortificações"],
        disadvantages: ["Peso alto", "Reduz manobrabilidade", "Caro"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.15,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 45,
        position: [0, 0, 0]
    },

    bomb_1000kg: {
        name: "Bomba 1000kg (Pesada)",
        description: "Bomba de demolição para alvos estratégicos",
        type: "bomb",
        category: "heavy_demolition",
        weight: 1000, // kg
        explosive_weight: 480, // kg
        blast_radius: 120, // meters
        armor_penetration: 750, // mm RHA equivalent
        tech_level: 50,
        cost_base: 4200, // USD
        hardpoint_types: ["large", "centerline"],
        advantages: ["Poder destrutivo massivo", "Alvos estratégicos"],
        disadvantages: ["Peso excessivo", "Impacto severo na performance"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.2,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 50,
        position: [0, 0, 0]
    },

    // === BOMBAS ESPECIALIZADAS ===
    bomb_250kg_ap: {
        name: "Bomba Anti-Blindagem 250kg",
        description: "Bomba perfurante para tanques",
        type: "bomb",
        category: "armor_piercing",
        weight: 250, // kg
        explosive_weight: 65, // kg (menos explosivo, mais penetração)
        blast_radius: 25, // meters
        armor_penetration: 650, // mm RHA equivalent
        tech_level: 48,
        cost_base: 1800, // USD
        hardpoint_types: ["medium", "large"],
        advantages: ["Penetração excelente", "Eficaz contra blindados"],
        disadvantages: ["Área de efeito pequena", "Caro", "Uso específico"],
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0.1,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 48,
        position: [0, 0, 0]
    },

    bomb_cluster_250kg: {
        name: "Bomba Cluster 250kg",
        description: "Bomba com múltiplas submunições",
        type: "bomb",
        category: "cluster",
        weight: 250, // kg
        submunitions: 48,
        coverage_area: 2500, // square meters
        tech_level: 70,
        cost_base: 3200, // USD
        hardpoint_types: ["medium", "large"],
        advantages: ["Área de cobertura grande", "Eficaz contra pessoal"],
        disadvantages: ["Complexo", "Caro", "Menos eficaz contra blindados"],
        maintainabilityModifier: 1.4,
        radarSignatureModifier: 0.1,
        lifecycleCostMultiplier: 1.5,
        techLevelRequirement: 70,
        position: [0, 0, 0]
    },

    // === FOGUETES ===
    rocket_68mm_he: {
        name: "Foguete 68mm HE",
        description: "Foguete não-guiado de alto explosivo",
        type: "rocket",
        category: "unguided_rocket",
        caliber: 68, // mm
        weight: 12, // kg each
        warhead_weight: 3.2, // kg
        range: 2000, // meters
        launcher_capacity: 7, // rockets per pod
        pod_weight: 45, // kg (empty pod)
        tech_level: 42,
        cost_base: 180, // USD per rocket
        hardpoint_types: ["small", "medium"],
        advantages: ["Saturação de área", "Baixo custo unitário"],
        disadvantages: ["Precisão baixa", "Alcance limitado"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.1,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 42,
        position: [0, 0, 0]
    },

    rocket_127mm_he: {
        name: "Foguete 127mm HE",
        description: "Foguete pesado não-guiado",
        type: "rocket",
        category: "unguided_rocket",
        caliber: 127, // mm
        weight: 45, // kg each
        warhead_weight: 18, // kg
        range: 4000, // meters
        launcher_capacity: 4, // rockets per pod
        pod_weight: 85, // kg
        tech_level: 48,
        cost_base: 650, // USD per rocket
        hardpoint_types: ["medium", "large"],
        advantages: ["Poder destrutivo alto", "Alcance bom"],
        disadvantages: ["Peso alto", "Precisão média", "Caro"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.15,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 48,
        position: [0, 0, 0]
    },

    // === MÍSSEIS (EXPERIMENTAIS) ===
    missile_air_to_air_ir: {
        name: "Míssil Ar-Ar Infravermelho",
        description: "Primeiro míssil guiado por calor",
        type: "missile",
        category: "air_to_air",
        guidance: "infrared",
        weight: 85, // kg
        warhead_weight: 12, // kg
        range: 8000, // meters
        max_g: 18,
        tech_level: 105,
        cost_base: 25000, // USD each
        experimental: true,
        hardpoint_types: ["small", "medium"],
        advantages: ["Guiamento automático", "Alta manobrabilidade"],
        disadvantages: ["Experimental", "Custíssimo", "Pouco confiável"],
        maintainabilityModifier: 2.5,
        radarSignatureModifier: 0.2,
        lifecycleCostMultiplier: 3.0,
        techLevelRequirement: 105,
        position: [0, 0, 0]
    },

    missile_air_to_surface: {
        name: "Míssil Ar-Solo Básico",
        description: "Míssil tático guiado para alvos terrestres",
        type: "missile",
        category: "air_to_surface",
        guidance: "command",
        weight: 180, // kg
        warhead_weight: 45, // kg
        range: 12000, // meters
        accuracy: 50, // meters CEP
        tech_level: 115,
        cost_base: 45000, // USD each
        experimental: true,
        hardpoint_types: ["large"],
        advantages: ["Alcance longo", "Precisão boa"],
        disadvantages: ["Experimental", "Extremamente caro", "Complexo"],
        maintainabilityModifier: 2.8,
        radarSignatureModifier: 0.25,
        lifecycleCostMultiplier: 3.5,
        techLevelRequirement: 115,
        position: [0, 0, 0]
    },

    // === TANQUES DE COMBUSTÍVEL ===
    fuel_tank_300l: {
        name: "Tanque Externo 300L",
        description: "Tanque auxiliar pequeno",
        type: "fuel_tank",
        category: "external_fuel",
        capacity: 300, // liters
        fuel_weight: 240, // kg (when full)
        empty_weight: 35, // kg
        drag_penalty: 0.08, // drag coefficient increase
        tech_level: 35,
        cost_base: 1200, // USD
        jettison_capable: true,
        hardpoint_types: ["small", "medium"],
        advantages: ["Alcance estendido", "Ejetável"],
        disadvantages: ["Penalidade aerodinâmica", "Vulnerabilidade"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.1,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    },

    fuel_tank_600l: {
        name: "Tanque Externo 600L", 
        description: "Tanque auxiliar médio",
        type: "fuel_tank",
        category: "external_fuel",
        capacity: 600, // liters
        fuel_weight: 480, // kg
        empty_weight: 65, // kg
        drag_penalty: 0.12,
        tech_level: 40,
        cost_base: 1800, // USD
        jettison_capable: true,
        hardpoint_types: ["medium", "large"],
        advantages: ["Alcance muito estendido", "Ejetável"],
        disadvantages: ["Penalidade aerodinâmica alta", "Peso significativo"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.15,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 40,
        position: [0, 0, 0]
    },

    fuel_tank_1200l: {
        name: "Tanque Externo 1200L",
        description: "Tanque auxiliar grande para ferry",
        type: "fuel_tank",
        category: "external_fuel",
        capacity: 1200, // liters
        fuel_weight: 960, // kg
        empty_weight: 120, // kg
        drag_penalty: 0.18,
        tech_level: 45,
        cost_base: 2800, // USD
        jettison_capable: true,
        hardpoint_types: ["large", "centerline"],
        advantages: ["Alcance máximo", "Voos ferry"],
        disadvantages: ["Penalidade aerodinâmica severa", "Muito pesado"],
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0.2,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 45,
        position: [0, 0, 0]
    },

    // === EQUIPAMENTOS ESPECIAIS ===
    reconnaissance_pod: {
        name: "Pod de Reconhecimento",
        description: "Câmeras e equipamentos de inteligência",
        type: "special_equipment",
        category: "reconnaissance",
        weight: 180, // kg
        camera_types: ["oblique", "vertical", "panoramic"],
        film_capacity: 500, // exposures
        tech_level: 75,
        cost_base: 85000, // USD
        hardpoint_types: ["medium", "large"],
        advantages: ["Inteligência detalhada", "Múltiplos sensores"],
        disadvantages: ["Peso alto", "Sem capacidade ofensiva", "Caro"],
        maintainabilityModifier: 1.5,
        radarSignatureModifier: 0.3,
        lifecycleCostMultiplier: 1.8,
        techLevelRequirement: 75,
        position: [0, 0, 0]
    },

    ecm_pod: {
        name: "Pod de Contramedidas Eletrônicas",
        description: "Sistema de guerra eletrônica básico",
        type: "special_equipment", 
        category: "electronic_warfare",
        weight: 140, // kg
        power_consumption: 8, // kW
        jamming_range: 15000, // meters
        tech_level: 95,
        cost_base: 125000, // USD
        experimental: true,
        hardpoint_types: ["medium", "large"],
        advantages: ["Proteção contra radar", "Tecnologia avançada"],
        disadvantages: ["Experimental", "Consumo alto", "Custíssimo"],
        maintainabilityModifier: 2.2,
        radarSignatureModifier: 0.4,
        lifecycleCostMultiplier: 2.5,
        techLevelRequirement: 95,
        position: [0, 0, 0]
    }
};