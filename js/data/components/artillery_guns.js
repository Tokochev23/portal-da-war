export const artillery_guns = {
    // === OBUSES MÉDIOS ===
    howitzer_105mm: {
        name: "Obuz 105mm",
        caliber: 105,
        weight: 2200,
        cost: 35000,
        rate_of_fire: 8,
        effective_range: 11000,
        max_elevation: 65,
        traverse_speed: 8,
        ammunition_weight: 15,
        ammo_capacity: 60,
        tech_requirement: { year: 1942, level: 55 },
        penetration_armor: 85,
        he_effectiveness: 0.85,
        mount_options: ["open_mount", "enclosed_turret"],
        ammunition_types: ["HE", "AP", "HEAT", "Smoke"],
        description: "Obuz padrão, versátil e confiável"
    },

    howitzer_122mm: {
        name: "Obuz 122mm",
        caliber: 122,
        weight: 2800,
        cost: 42000,
        rate_of_fire: 6,
        effective_range: 12000,
        max_elevation: 65,
        traverse_speed: 7,
        ammunition_weight: 22,
        ammo_capacity: 50,
        tech_requirement: { year: 1943, level: 58 },
        penetration_armor: 110,
        he_effectiveness: 0.90,
        mount_options: ["open_mount", "enclosed_turret"],
        ammunition_types: ["HE", "AP", "HEAT", "Smoke"],
        description: "Obuz pesado soviético, grande poder destrutivo"
    },

    howitzer_130mm: {
        name: "Canhão 130mm",
        caliber: 130,
        weight: 3200,
        cost: 48000,
        rate_of_fire: 5,
        effective_range: 15000,
        max_elevation: 45,
        traverse_speed: 6,
        ammunition_weight: 33,
        ammo_capacity: 45,
        tech_requirement: { year: 1944, level: 62 },
        penetration_armor: 165,
        he_effectiveness: 0.88,
        dual_purpose: true,
        mount_options: ["open_mount", "enclosed_turret"],
        ammunition_types: ["HE", "AP", "APCR", "Smoke"],
        description: "Canhão de campanha, excelente contra tanques"
    },

    // === OBUSES PESADOS ===
    howitzer_150mm: {
        name: "Obuz 150mm",
        caliber: 150,
        weight: 4200,
        cost: 65000,
        rate_of_fire: 4,
        effective_range: 13500,
        max_elevation: 65,
        traverse_speed: 5,
        ammunition_weight: 45,
        ammo_capacity: 35,
        tech_requirement: { year: 1943, level: 65 },
        penetration_armor: 120,
        he_effectiveness: 0.95,
        mount_options: ["open_mount", "enclosed_turret"],
        ammunition_types: ["HE", "AP", "Smoke", "Concrete-Piercing"],
        description: "Obuz pesado alemão, devastador contra infantaria"
    },

    howitzer_152mm: {
        name: "Obuz-Canhão 152mm",
        caliber: 152,
        weight: 4500,
        cost: 70000,
        rate_of_fire: 4,
        effective_range: 17000,
        max_elevation: 65,
        traverse_speed: 5,
        ammunition_weight: 48,
        ammo_capacity: 32,
        tech_requirement: { year: 1944, level: 68 },
        penetration_armor: 180,
        he_effectiveness: 0.95,
        dual_purpose: true,
        mount_options: ["open_mount", "enclosed_turret"],
        ammunition_types: ["HE", "AP", "APCR", "Smoke"],
        description: "Artilharia pesada soviética, versátil e potente"
    },

    howitzer_155mm: {
        name: "Obuz 155mm",
        caliber: 155,
        weight: 4800,
        cost: 75000,
        rate_of_fire: 3,
        effective_range: 14000,
        max_elevation: 65,
        traverse_speed: 4,
        ammunition_weight: 52,
        ammo_capacity: 30,
        tech_requirement: { year: 1945, level: 70 },
        penetration_armor: 135,
        he_effectiveness: 1.0,
        mount_options: ["open_mount", "enclosed_turret"],
        ammunition_types: ["HE", "AP", "Smoke", "Concrete-Piercing"],
        description: "Obuz pesado NATO, padrão de artilharia moderna"
    },

    // === ARTILHARIA SUPER-PESADA ===
    gun_170mm: {
        name: "Canhão 170mm",
        caliber: 170,
        weight: 6200,
        cost: 95000,
        rate_of_fire: 2,
        effective_range: 22000,
        max_elevation: 50,
        traverse_speed: 3,
        ammunition_weight: 85,
        ammo_capacity: 25,
        tech_requirement: { year: 1945, level: 75 },
        penetration_armor: 250,
        he_effectiveness: 0.92,
        mount_options: ["open_mount"],
        ammunition_types: ["HE", "AP", "APCR"],
        description: "Canhão super-pesado, alcance extremo"
    },

    howitzer_203mm: {
        name: "Obuz 203mm",
        caliber: 203,
        weight: 8500,
        cost: 125000,
        rate_of_fire: 1,
        effective_range: 16000,
        max_elevation: 65,
        traverse_speed: 2,
        ammunition_weight: 145,
        ammo_capacity: 20,
        tech_requirement: { year: 1945, level: 78 },
        penetration_armor: 180,
        he_effectiveness: 1.2,
        mount_options: ["open_mount"],
        ammunition_types: ["HE", "Concrete-Piercing"],
        description: "Artilharia de cerco, poder destrutivo máximo"
    }
};

// === SISTEMAS DE CONTROLE DE FOGO PARA ARTILHARIA ===
export const artillery_fire_control = {
    basic_sights: {
        name: "Miras Básicas",
        type: "optical",
        weight: 45,
        cost: 1200,
        tech_requirement: { year: 1940, level: 25 },
        accuracy_bonus: 0.05,
        indirect_fire: false,
        description: "Miras diretas simples para tiro direto"
    },

    panoramic_sight: {
        name: "Mira Panorâmica",
        type: "optical",
        weight: 85,
        cost: 3500,
        tech_requirement: { year: 1942, level: 45 },
        accuracy_bonus: 0.15,
        indirect_fire: true,
        max_indirect_range: 10000,
        description: "Sistema para tiro indireto básico"
    },

    ballistic_computer: {
        name: "Computador Balístico",
        type: "mechanical",
        weight: 220,
        cost: 8500,
        tech_requirement: { year: 1944, level: 60 },
        accuracy_bonus: 0.3,
        indirect_fire: true,
        max_indirect_range: 20000,
        weather_compensation: true,
        description: "Cálculos balísticos automáticos"
    },

    advanced_fcs: {
        name: "Sistema Avançado de Controle",
        type: "electronic",
        weight: 380,
        cost: 18000,
        tech_requirement: { year: 1945, level: 72 },
        accuracy_bonus: 0.45,
        indirect_fire: true,
        max_indirect_range: 25000,
        weather_compensation: true,
        rapid_targeting: true,
        description: "Sistema eletrônico com cálculo rápido"
    }
};

// === TIPOS DE MONTAGEM PARA ARTILHARIA ===
export const artillery_mount_configs = {
    open_mount: {
        name: "Montagem Aberta",
        weight_multiplier: 1.0,
        cost_multiplier: 1.0,
        armor_protection: 0,
        crew_protection: 0.3,
        reload_speed: 1.0,
        description: "Montagem simples, sem proteção"
    },

    shield_mount: {
        name: "Montagem com Escudo",
        weight_multiplier: 1.15,
        cost_multiplier: 1.1,
        armor_protection: 10,
        crew_protection: 0.6,
        reload_speed: 0.95,
        description: "Escudo frontal para proteção básica"
    },

    enclosed_turret: {
        name: "Torre Blindada",
        weight_multiplier: 1.4,
        cost_multiplier: 1.5,
        armor_protection: 25,
        crew_protection: 0.9,
        reload_speed: 0.85,
        all_weather: true,
        description: "Torre totalmente blindada"
    }
};