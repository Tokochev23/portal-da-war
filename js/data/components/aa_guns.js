export const aa_guns = {
    // === CANHÕES AUTOMÁTICOS RÁPIDOS ===
    cannon_20mm: {
        name: "Canhão AA 20mm",
        caliber: 20,
        weight: 180,
        cost: 8500,
        rate_of_fire: 800,
        effective_range: 2000,
        max_elevation: 85,
        traverse_speed: 50,
        ammunition_weight: 0.12,
        ammo_capacity: 400,
        tech_requirement: { year: 1943, level: 50 },
        penetration_armor: 25,
        aa_effectiveness: 0.70,
        mount_options: ["single", "twin", "quad"],
        description: "Canhão automático leve, alta cadência de tiro"
    },

    mg_23mm: {
        name: "Canhão AA 23mm",
        caliber: 23,
        weight: 280,
        cost: 12000,
        rate_of_fire: 650,
        effective_range: 2500,
        max_elevation: 85,
        traverse_speed: 45,
        ammunition_weight: 0.18,
        ammo_capacity: 250,
        tech_requirement: { year: 1945, level: 55 },
        penetration_armor: 30,
        aa_effectiveness: 0.75,
        mount_options: ["single", "twin", "quad"],
        description: "Canhão automático médio, equilibrado"
    },

    cannon_25mm: {
        name: "Canhão AA 25mm",
        caliber: 25,
        weight: 320,
        cost: 14000,
        rate_of_fire: 550,
        effective_range: 2800,
        max_elevation: 85,
        traverse_speed: 42,
        ammunition_weight: 0.22,
        ammo_capacity: 220,
        tech_requirement: { year: 1944, level: 52 },
        penetration_armor: 35,
        aa_effectiveness: 0.78,
        mount_options: ["single", "twin", "triple"],
        description: "Canhão automático versátil, boa penetração"
    },
    
    cannon_30mm: {
        name: "Canhão AA 30mm",
        caliber: 30,
        weight: 420,
        cost: 18000,
        rate_of_fire: 450,
        effective_range: 3000,
        max_elevation: 85,
        traverse_speed: 40,
        ammunition_weight: 0.35,
        ammo_capacity: 200,
        tech_requirement: { year: 1946, level: 60 },
        penetration_armor: 45,
        aa_effectiveness: 0.85,
        mount_options: ["single", "twin"],
        description: "Canhão pesado, alto poder de parada"
    },

    cannon_37mm: {
        name: "Canhão AA 37mm",
        caliber: 37,
        weight: 580,
        cost: 22000,
        rate_of_fire: 180,
        effective_range: 3500,
        max_elevation: 85,
        traverse_speed: 35,
        ammunition_weight: 0.68,
        ammo_capacity: 150,
        tech_requirement: { year: 1943, level: 58 },
        penetration_armor: 55,
        aa_effectiveness: 0.82,
        mount_options: ["single", "twin"],
        description: "Canhão de calibre médio, boa precisão"
    },
    
    bofors_40mm: {
        name: "Canhão AA 40mm",
        caliber: 40,
        weight: 650,
        cost: 25000,
        rate_of_fire: 120,
        effective_range: 4000,
        max_elevation: 90,
        traverse_speed: 35,
        ammunition_weight: 0.95,
        ammo_capacity: 160,
        tech_requirement: { year: 1943, level: 65 },
        penetration_armor: 65,
        aa_effectiveness: 0.90,
        mount_options: ["single", "twin", "quad"],
        description: "Canhão padrão NATO, excelente eficácia"
    },

    cannon_57mm: {
        name: "Canhão AA 57mm",
        caliber: 57,
        weight: 980,
        cost: 35000,
        rate_of_fire: 90,
        effective_range: 5000,
        max_elevation: 85,
        traverse_speed: 28,
        ammunition_weight: 2.8,
        ammo_capacity: 100,
        tech_requirement: { year: 1944, level: 68 },
        penetration_armor: 85,
        aa_effectiveness: 0.88,
        dual_purpose: true,
        mount_options: ["single", "twin"],
        description: "Canhão dual-purpose, eficaz contra terra e ar"
    },
    
    flak_88mm: {
        name: "Canhão AA 88mm",
        caliber: 88,
        weight: 1800,
        cost: 45000,
        rate_of_fire: 15,
        effective_range: 8000,
        max_elevation: 85,
        traverse_speed: 20,
        ammunition_weight: 9.5,
        ammo_capacity: 80,
        tech_requirement: { year: 1944, level: 70 },
        penetration_armor: 180,
        aa_effectiveness: 0.95,
        dual_purpose: true,
        mount_options: ["single"],
        description: "Canhão pesado dual-purpose, lendária eficácia"
    }
};

// === SISTEMAS DE CONTROLE DE FOGO ===
export const aa_fire_control = {
    optical_sight: {
        name: "Mira Óptica Básica",
        type: "optical",
        weight: 25,
        cost: 800,
        tech_requirement: { year: 1940, level: 30 },
        accuracy_bonus: 0.1,
        night_capable: false,
        weather_penalty: 0.3,
        description: "Mira óptica simples, operação manual"
    },

    mechanical_computer: {
        name: "Computador Mecânico",
        type: "mechanical",
        weight: 180,
        cost: 5000,
        tech_requirement: { year: 1943, level: 55 },
        accuracy_bonus: 0.25,
        night_capable: false,
        weather_penalty: 0.2,
        lead_calculation: true,
        description: "Sistema mecânico para cálculo de tiro avançado"
    },

    radar_tracking: {
        name: "Radar de Rastreamento",
        type: "radar",
        weight: 450,
        cost: 15000,
        tech_requirement: { year: 1944, level: 68 },
        accuracy_bonus: 0.4,
        night_capable: true,
        weather_penalty: 0.1,
        lead_calculation: true,
        automatic_tracking: true,
        detection_range: 15000,
        description: "Sistema de radar primitivo para rastreamento de alvos"
    },

    early_computer: {
        name: "Computador Eletrônico Primitivo",
        type: "electronic",
        weight: 280,
        cost: 25000,
        tech_requirement: { year: 1945, level: 75 },
        accuracy_bonus: 0.5,
        night_capable: true,
        weather_penalty: 0.05,
        lead_calculation: true,
        automatic_tracking: true,
        multiple_targets: 2,
        description: "Sistema eletrônico avançado, múltiplos alvos"
    }
};

// === CONFIGURAÇÕES DE MONTAGEM ===
export const aa_mount_configs = {
    single: {
        name: "Montagem Única",
        gun_count: 1,
        weight_multiplier: 1.0,
        cost_multiplier: 1.0,
        ammo_multiplier: 1.0,
        accuracy_bonus: 0.1,
        description: "Uma arma, máxima precisão"
    },

    twin: {
        name: "Montagem Dupla",
        gun_count: 2,
        weight_multiplier: 1.8,
        cost_multiplier: 1.7,
        ammo_multiplier: 2.0,
        accuracy_bonus: 0.0,
        firepower_multiplier: 1.9,
        description: "Duas armas, bom equilíbrio"
    },

    triple: {
        name: "Montagem Tripla",
        gun_count: 3,
        weight_multiplier: 2.6,
        cost_multiplier: 2.4,
        ammo_multiplier: 3.0,
        accuracy_penalty: -0.1,
        firepower_multiplier: 2.7,
        description: "Três armas, alto poder de fogo"
    },

    quad: {
        name: "Montagem Quádrupla",
        gun_count: 4,
        weight_multiplier: 3.2,
        cost_multiplier: 3.0,
        ammo_multiplier: 4.0,
        accuracy_penalty: -0.2,
        firepower_multiplier: 3.4,
        description: "Quatro armas, máximo poder de fogo"
    }
};
