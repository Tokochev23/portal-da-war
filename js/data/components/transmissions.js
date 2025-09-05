export const transmissions = {
    // === TRANSMISSÕES MANUAIS BÁSICAS ===
    manual_2speed_simple: {
        name: "Manual Simples 2 Marchas",
        type: "manual",
        gears: 2,
        weight: 180,
        cost: 2200,
        efficiency: 0.72,
        max_input_torque: 800,
        reliability: 0.98,
        maintenance_complexity: 0.15,
        driver_skill_required: 0.95,
        tech_requirement: { year: 1925, level: 15 },
        gear_ratios: [6.8, 1.0],
        reverse_ratio: 8.2,
        shift_time: 4.5,
        max_speed_road: 35,
        max_speed_offroad: 22,
        terrain_performance: { mud: 1.15, sand: 1.08, snow: 1.12 },
        fuel_economy_bonus: 0.08,
        description: "Transmissão extremamente simples e robusta, ideal para veículos utilitários",
        historical_note: "Baseada em designs dos anos 1920-30, muito comum em veículos civis convertidos"
    },

    manual_3speed_utility: {
        name: "Manual Utilitária 3 Marchas",
        type: "manual",
        gears: 3,
        weight: 240,
        cost: 3200,
        efficiency: 0.78,
        max_input_torque: 1100,
        reliability: 0.96,
        maintenance_complexity: 0.25,
        driver_skill_required: 0.88,
        tech_requirement: { year: 1935, level: 22 },
        gear_ratios: [5.8, 3.2, 1.0],
        reverse_ratio: 6.5,
        shift_time: 3.8,
        max_speed_road: 45,
        max_speed_offroad: 32,
        terrain_performance: { mud: 1.12, sand: 1.05, snow: 1.08 },
        description: "Transmissão robusta para veículos de apoio e transporte",
        optimal_applications: ["transport", "utility", "light_armor"]
    },

    manual_4speed_combat: {
        name: "Manual de Combate 4 Marchas",
        type: "manual",
        gears: 4,
        weight: 310,
        cost: 4800,
        efficiency: 0.82,
        max_input_torque: 1450,
        reliability: 0.94,
        maintenance_complexity: 0.35,
        driver_skill_required: 0.82,
        tech_requirement: { year: 1940, level: 30 },
        gear_ratios: [4.8, 2.9, 1.9, 1.0],
        reverse_ratio: 5.4,
        shift_time: 2.8,
        max_speed_road: 58,
        max_speed_offroad: 42,
        terrain_performance: { mud: 1.05, sand: 1.02, snow: 1.04 },
        description: "Transmissão padrão para tanques médios, equilibrada para combate",
        optimal_applications: ["main_battle_tank", "medium_tank", "tank_destroyer"]
    },

    manual_5speed_advanced: {
        name: "Manual Avançada 5 Marchas",
        type: "manual",
        gears: 5,
        weight: 385,
        cost: 7200,
        efficiency: 0.85,
        max_input_torque: 1650,
        reliability: 0.92,
        maintenance_complexity: 0.45,
        driver_skill_required: 0.75,
        tech_requirement: { year: 1948, level: 42 },
        gear_ratios: [4.5, 2.8, 1.9, 1.3, 1.0],
        reverse_ratio: 5.1,
        shift_time: 2.2,
        max_speed_road: 68,
        max_speed_offroad: 52,
        terrain_performance: { mud: 1.02, sand: 0.98, snow: 1.01 },
        fuel_economy_bonus: 0.12,
        description: "Transmissão moderna com marcha extra para economia de combustível",
        optimal_applications: ["reconnaissance", "light_tank", "wheeled_vehicles"]
    },

    // === TRANSMISSÕES ESPECIALIZADAS ===
    manual_6speed_racing: {
        name: "Manual Esportiva 6 Marchas",
        type: "manual",
        gears: 6,
        weight: 420,
        cost: 12500,
        efficiency: 0.87,
        max_input_torque: 1800,
        reliability: 0.89,
        maintenance_complexity: 0.65,
        driver_skill_required: 0.65,
        tech_requirement: { year: 1952, level: 58 },
        gear_ratios: [4.2, 2.6, 1.8, 1.4, 1.1, 1.0],
        reverse_ratio: 4.8,
        shift_time: 1.8,
        max_speed_road: 85,
        max_speed_offroad: 62,
        terrain_performance: { road: 1.15, mud: 0.95, sand: 0.92, snow: 0.94 },
        acceleration_bonus: 0.18,
        description: "Transmissão de alta performance para veículos leves e rápidos",
        optimal_applications: ["reconnaissance", "armored_car", "light_tank"],
        doctrinal_bonus: { NATO: 0.1, neutral: 0.05 }
    },

    // === TRANSMISSÕES SEMI-AUTOMÁTICAS ===
    semi_auto_preselector: {
        name: "Semi-Automática Pré-Seletora",
        type: "semi_auto",
        gears: 4,
        weight: 450,
        cost: 9800,
        efficiency: 0.81,
        max_input_torque: 1950,
        reliability: 0.87,
        maintenance_complexity: 0.75,
        driver_skill_required: 0.55,
        tech_requirement: { year: 1943, level: 48 },
        gear_ratios: [4.1, 2.4, 1.6, 1.0],
        shift_time: 1.5,
        max_speed_road: 72,
        max_speed_offroad: 55,
        pre_selection: true,
        clutch_assisted: true,
        description: "Sistema britânico de pré-seleção, usado em tanques Cromwell",
        historical_note: "Tecnologia britânica Wilson, permite mudanças rápidas sem desacelerar",
        optimal_applications: ["british_tanks", "fast_tanks"],
        doctrinal_bonus: { NATO: 0.15 }
    },

    semi_auto_synchromesh: {
        name: "Semi-Automática Sincronizada",
        type: "semi_auto",
        gears: 5,
        weight: 520,
        cost: 11500,
        efficiency: 0.83,
        max_input_torque: 2100,
        reliability: 0.85,
        maintenance_complexity: 0.85,
        driver_skill_required: 0.45,
        tech_requirement: { year: 1947, level: 52 },
        gear_ratios: [3.8, 2.3, 1.5, 1.2, 1.0],
        shift_time: 1.2,
        max_speed_road: 78,
        max_speed_offroad: 58,
        synchromesh: true,
        smooth_shifting: true,
        description: "Transmissão com sincronizadores, mudanças suaves mesmo em combate",
        optimal_applications: ["medium_tank", "main_battle_tank", "heavy_tank"]
    },

    // === TRANSMISSÕES AUTOMÁTICAS ===
    automatic_torque_converter: {
        name: "Automática com Conversor de Torque",
        type: "automatic",
        gears: 3,
        weight: 680,
        cost: 18500,
        efficiency: 0.73,
        max_input_torque: 2800,
        reliability: 0.82,
        maintenance_complexity: 1.2,
        driver_skill_required: 0.15,
        tech_requirement: { year: 1947, level: 62 },
        gear_ratios: [3.6, 2.2, 1.0],
        torque_converter: true,
        torque_multiplication: 2.4,
        shift_time: 0.8,
        max_speed_road: 65,
        max_speed_offroad: 42,
        fuel_penalty: 0.18,
        smooth_operation: true,
        description: "Primeira geração de transmissões automáticas militares",
        historical_note: "Baseada em tecnologia da GM Hydra-Matic, adaptada para uso militar",
        optimal_applications: ["heavy_tank", "assault_gun", "self_propelled_artillery"],
        crew_fatigue_reduction: 0.25,
        energy_consumption: 3 // kW - hydraulic control systems
    },

    automatic_4speed_advanced: {

        name: "Automática Avançada 4 Marchas",
        type: "automatic",
        gears: 4,
        weight: 750,
        cost: 24000,
        efficiency: 0.76,
        max_input_torque: 3200,
        reliability: 0.79,
        maintenance_complexity: 1.4,
        driver_skill_required: 0.12,
        tech_requirement: { year: 1952, level: 68 },
        gear_ratios: [3.4, 2.1, 1.4, 1.0],
        torque_converter: true,
        torque_multiplication: 2.8,
        shift_time: 0.6,
        max_speed_road: 72,
        max_speed_offroad: 48,
        fuel_penalty: 0.15,
        adaptive_shifting: true,
        description: "Transmissão automática de segunda geração, mais eficiente",
        optimal_applications: ["main_battle_tank", "command_vehicle", "recovery_vehicle"],
        crew_fatigue_reduction: 0.35,
        doctrinal_bonus: { NATO: 0.12 }
    ,
        energy_consumption: 3 // kW - Power required
    },

    // === TRANSMISSÕES PLANETÁRIAS ===
    planetary_differential_steering: {

        name: "Planetário com Direção Diferencial",
        type: "planetary",
        gears: "variable",
        weight: 920,
        cost: 32000,
        efficiency: 0.77,
        max_input_torque: 4800,
        reliability: 0.75,
        maintenance_complexity: 1.8,
        driver_skill_required: 0.35,
        tech_requirement: { year: 1949, level: 72 },
        steering_system: "differential",
        pivot_turn: true,
        max_speed_road: 52,
        max_speed_offroad: 38,
        maneuverability_bonus: 0.35,
        description: "Sistema alemão avançado com direção por alavancas",
        historical_note: "Usado em tanques alemães Panzer IV tardios e Panther",
        optimal_applications: ["heavy_tank", "tank_destroyer", "assault_gun"],
        doctrinal_bonus: { Warsaw: 0.18 },
        terrain_performance: { urban: 1.25, forest: 1.15 },
        energy_consumption: 4 // kW - Power required
    },

    planetary_hydraulic_assist: {
        name: "Planetário com Assistência Hidráulica",
        type: "planetary",
        gears: "variable",
        weight: 1050,
        cost: 42000,
        efficiency: 0.79,
        max_input_torque: 5500,
        reliability: 0.72,
        maintenance_complexity: 2.1,
        driver_skill_required: 0.28,
        tech_requirement: { year: 1953, level: 78 },
        hydraulic_assist: true,
        power_steering: true,
        pivot_turn: true,
        max_speed_road: 58,
        max_speed_offroad: 42,
        maneuverability_bonus: 0.45,
        fuel_penalty: 0.08,
        description: "Sistema planetário com assistência hidráulica para veículos super-pesados",
        optimal_applications: ["superheavy_tank", "heavy_assault_gun", "bunker_buster"],
        crew_fatigue_reduction: 0.4,
        doctrinal_bonus: { NATO: 0.08, Warsaw: 0.15 },
        energy_consumption: 4 // kW - Power required
    },

    // === TRANSMISSÕES ESPECIAIS ===
    cvt_experimental: {
        name: "CVT Experimental",
        type: "cvt",
        gears: "infinite",
        weight: 850,
        cost: 55000,
        efficiency: 0.81,
        max_input_torque: 2200,
        reliability: 0.68,
        maintenance_complexity: 2.5,
        driver_skill_required: 0.20,
        tech_requirement: { year: 1954, level: 85 },
        continuously_variable: true,
        optimal_rpm_range: true,
        max_speed_road: 75,
        max_speed_offroad: 55,
        fuel_economy_bonus: 0.22,
        acceleration_bonus: 0.15,
        description: "Transmissão continuamente variável experimental",
        historical_note: "Tecnologia experimental, apenas para protótipos avançados",
        optimal_applications: ["prototype", "experimental_vehicle"],
        prototype_only: true,
        research_cost_multiplier: 3.5
    },

    electric_single_speed: {
        name: "Elétrica Velocidade Única",
        type: "electric",
        gears: 1,
        weight: 120,
        cost: 28000,
        efficiency: 0.94,
        max_input_torque: 3500,
        reliability: 0.91,
        maintenance_complexity: 0.8,
        driver_skill_required: 0.05,
        tech_requirement: { year: 1952, level: 82 },
        instant_torque: true,
        silent_operation: true,
        max_speed_road: 45,
        max_speed_offroad: 35,
        torque_at_zero_rpm: true,
        description: "Transmissão elétrica experimental para veículos híbridos",
        historical_note: "Baseada em experimentos de Ferdinand Porsche com o Elefant",
        optimal_applications: ["experimental_vehicle", "stealth_vehicle"],
        special_requirements: ["electric_motor", "battery_pack"],
        stealth_bonus: 0.6,
        prototype_only: true,
        energy_consumption: 8 // kW - Electric motors and control systems
    },

    hydrostatic_infinite: {
        name: "Hidrostática de Variação Infinita",
        type: "hydrostatic",
        gears: "infinite",
        weight: 780,
        cost: 38000,
        efficiency: 0.75,
        max_input_torque: 4200,
        reliability: 0.76,
        maintenance_complexity: 2.0,
        driver_skill_required: 0.25,
        tech_requirement: { year: 1953, level: 76 },
        hydraulic_pump: true,
        hydraulic_motor: true,
        infinite_speed_control: true,
        max_speed_road: 48,
        max_speed_offroad: 38,
        maneuverability_bonus: 0.4,
        precise_control: true,
        description: "Sistema hidrostático para controle preciso de velocidade",
        optimal_applications: ["engineering_vehicle", "recovery_vehicle", "bridge_layer"],
        special_capabilities: ["precise_positioning", "variable_speed_pto"],
        energy_consumption: 5 // kW - Hydraulic pumps and control systems
    }
};

// Sistema de compatibilidade aprimorado
export const transmissionCompatibility = {
    // Compatibilidade por tipo de chassi
    chassis_compatibility: {

        light_tanks: ["manual_3speed_utility", "manual_4speed_combat", "manual_5speed_advanced", "manual_6speed_racing", "semi_auto_preselector"],
        medium_tanks: ["manual_4speed_combat", "manual_5speed_advanced", "semi_auto_preselector", "semi_auto_synchromesh", "automatic_torque_converter"],
        heavy_tanks: ["manual_4speed_combat", "semi_auto_synchromesh", "automatic_torque_converter", "automatic_4speed_advanced", "planetary_differential_steering"],
        superheavy_tanks: ["automatic_4speed_advanced", "planetary_differential_steering", "planetary_hydraulic_assist", "hydrostatic_infinite"],
        wheeled_vehicles: ["manual_2speed_simple", "manual_3speed_utility", "manual_5speed_advanced", "manual_6speed_racing", "automatic_torque_converter"],
        tracked_utility: ["manual_2speed_simple", "manual_3speed_utility", "manual_4speed_combat", "semi_auto_preselector"],
        experimental: ["cvt_experimental", "electric_single_speed", "hydrostatic_infinite"]
    },

    // Compatibilidade por doutrina militar
    doctrine_preferences: {
        NATO: {
            preferred: ["semi_auto_preselector", "automatic_torque_converter", "automatic_4speed_advanced"],
            bonus_multiplier: 1.15
        },
        Warsaw: {
            preferred: ["manual_4speed_combat", "planetary_differential_steering", "planetary_hydraulic_assist"],
            bonus_multiplier: 1.12
        },
        neutral: {
            preferred: ["manual_3speed_utility", "manual_4speed_combat", "semi_auto_synchromesh"],
            bonus_multiplier: 1.05
        }
    },

    // Incompatibilidades específicas
    incompatible_combinations: {
        electric_single_speed: {
            requires: ["hybrid_engine", "electric_motor"],
            incompatible_with: ["gasoline_engines", "diesel_engines"]
        },
        cvt_experimental: {
            max_weight: 35000,
            requires_tech_level: 85
        },
        planetary_hydraulic_assist: {
            min_weight: 45000,
            incompatible_chassis: ["light_tanks", "wheeled_vehicles"]
        }
    }
};