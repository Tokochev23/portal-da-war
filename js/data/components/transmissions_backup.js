export const transmissions = {
    // === BASIC MANUAL TRANSMISSIONS ===
    manual_3speed_basic: {
        name: "Manual Básica 3 Marchas",
        type: "manual",
        gears: 3,
        weight: 280,
        cost: 3500,
        efficiency: 0.76,
        max_input_torque: 1200,
        reliability: 0.96,
        maintenance_complexity: 0.3,
        driver_skill_required: 0.9,
        tech_requirement: { year: 1930, level: 20 },
        gear_ratios: [5.2, 2.9, 1.0],
        reverse_ratio: 6.1,
        shift_time: 3.2,
        max_speed_road: 42,
        max_speed_offroad: 28,
        description: "Transmissão mais simples, limita velocidade máxima"
    },
    
    manual_4speed_standard: {
        name: "Manual Padrão 4 Marchas",
        type: "manual",
        gears: 4,
        weight: 320,
        cost: 5000,
        efficiency: 0.80,
        max_input_torque: 1500,
        reliability: 0.95,
        maintenance_complexity: 0.4,
        driver_skill_required: 0.85,
        tech_requirement: { year: 1935, level: 25 },
        gear_ratios: [4.5, 2.8, 1.8, 1.0],
        reverse_ratio: 5.2,
        shift_time: 2.5,
        max_speed_road: 58,
        max_speed_offroad: 42,
        description: "Transmissão padrão balanceada"
    },
    
    // === SEMI-AUTOMATIC TRANSMISSIONS ===
    semi_auto_4speed: {
        name: "Semi-Automática 4 Marchas",
        type: "semi_auto",
        gears: 4,
        weight: 420,
        cost: 8500,
        efficiency: 0.82,
        max_input_torque: 1800,
        reliability: 0.88,
        maintenance_complexity: 0.7,
        driver_skill_required: 0.6,
        tech_requirement: { year: 1942, level: 45 },
        gear_ratios: [4.2, 2.5, 1.6, 1.0],
        shift_time: 1.8,
        max_speed_road: 65,
        max_speed_offroad: 48,
        description: "Facilita condução sem perder eficiência"
    },
    
    // === AUTOMATIC TRANSMISSIONS ===
    automatic_3speed_basic: {
        name: "Automática Básica 3 Marchas",
        type: "automatic",
        gears: 3,
        weight: 580,
        cost: 15000,
        efficiency: 0.74,
        max_input_torque: 2200,
        reliability: 0.85,
        maintenance_complexity: 1.0,
        driver_skill_required: 0.2,
        tech_requirement: { year: 1945, level: 55 },
        gear_ratios: [4.0, 2.4, 1.0],
        torque_converter: true,
        shift_time: 1.2,
        max_speed_road: 55,
        max_speed_offroad: 38,
        fuel_penalty: 0.12,
        description: "Automática simples, ideal para wheeled"
    },
    
    // === PLANETARY TRANSMISSIONS ===  
    planetary_heavy: {
        name: "Planetário Pesado",
        type: "planetary",
        gears: "variable",
        weight: 820,
        cost: 28000,
        efficiency: 0.79,
        max_input_torque: 4500,
        reliability: 0.78,
        maintenance_complexity: 1.5,
        driver_skill_required: 0.4,
        tech_requirement: { year: 1950, level: 75 },
        max_speed_road: 48,
        max_speed_offroad: 35,
        maneuverability_bonus: 0.25,
        description: "Para veículos pesados e SPG"
    }
};
