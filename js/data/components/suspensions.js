export const suspensions = {
    leaf_spring: {
        name: "Mola de Lâmina",
        weight: 180,
        cost: 2500,
        comfort_factor: 0.65,
        stability_factor: 0.85,
        terrain_performance: 0.75,
        reliability: 0.95,
        maintenance_complexity: 0.3,
        tech_requirement: { year: 1930, level: 20 },
        ground_clearance: 0.35,
        description: "Sistema mais simples e confiável, mas pouco confortável"
    },

    coil_spring: {
        name: "Mola Helicoidal",
        weight: 220,
        cost: 4000,
        comfort_factor: 0.78,
        stability_factor: 0.88,
        terrain_performance: 0.82,
        reliability: 0.90,
        maintenance_complexity: 0.5,
        tech_requirement: { year: 1940, level: 35 },
        ground_clearance: 0.42,
        description: "Melhor conforto que mola de lâmina, mais complexa"
    },

    torsion_bar: {
        name: "Barra de Torção",
        weight: 280,
        cost: 6000,
        comfort_factor: 0.85,
        stability_factor: 0.90,
        terrain_performance: 0.88,
        reliability: 0.85,
        maintenance_complexity: 0.7,
        tech_requirement: { year: 1942, level: 45 },
        ground_clearance: 0.45,
        internal_space_savings: 0.1,
        description: "Padrão da era moderna, bom equilíbrio"
    },

    christie_suspension: {
        name: "Suspensão Christie",
        weight: 320,
        cost: 8000,
        comfort_factor: 0.82,
        stability_factor: 0.95,
        terrain_performance: 0.92,
        speed_bonus: 0.12,
        reliability: 0.78,
        maintenance_complexity: 1.0,
        tech_requirement: { year: 1938, level: 55 },
        ground_clearance: 0.48,
        high_speed_stability: true,
        description: "Excelente para alta velocidade, manutenção complexa"
    },

    hydropneumatic: {
        name: "Suspensão Hidropneumática",
        weight: 450,
        cost: 15000,
        comfort_factor: 0.95,
        stability_factor: 0.92,
        terrain_performance: 0.95,
        reliability: 0.72,
        maintenance_complexity: 1.8,
        tech_requirement: { year: 1950, level: 75 },
        ground_clearance: 0.55,
        variable_height: true,
        stabilization_bonus: 0.25,
        power_requirement: 150, // watts
        description: "Máximo conforto e performance, muito complexa"
    },

    adaptive_experimental: {
        name: "Suspensão Adaptativa Experimental",
        weight: 520,
        cost: 25000,
        comfort_factor: 0.98,
        stability_factor: 0.96,
        terrain_performance: 0.98,
        reliability: 0.68,
        maintenance_complexity: 2.1,
        tech_requirement: { year: 1954, level: 85 },
        experimental: true,
        ground_clearance: 0.60,
        variable_height: true,
        automatic_adjustment: true,
        stabilization_bonus: 0.35,
        power_requirement: 300,
        description: "Sistema que se adapta automaticamente ao terreno"
    },

    interleaved_roadwheels: {
        name: "Rodas Intercaladas",
        weight: 380,
        cost: 9500,
        comfort_factor: 0.88,
        stability_factor: 0.94,
        terrain_performance: 0.90,
        reliability: 0.75,
        maintenance_complexity: 1.4,
        tech_requirement: { year: 1940, level: 60 },
        ground_clearance: 0.52,
        track_contact_bonus: 0.15,
        maintenance_difficulty: true,
        description: "Melhor distribuição de peso, manutenção difícil"
    }
};
