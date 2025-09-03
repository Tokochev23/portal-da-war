export const special_equipment = {
    // SURVIVABILITY EQUIPMENT
    spall_liner: {
        name: "Revestimento Anti-Fragmentos",
        weight: 200,
        cost: 8000,
        crew_survival_bonus: 0.25,
        internal_damage_reduction: 0.20,
        tech_requirement: { year: 1943, level: 50 },
        installation_complexity: 0.6,
        space_required: 0.3
    },
    
    wet_ammunition_storage: {
        name: "Armazenamento Úmido de Munição",
        weight: 150,
        cost: 6000,
        explosion_resistance: 0.40,
        ammo_capacity_reduction: 0.15,
        fire_suppression_bonus: 0.5,
        tech_requirement: { year: 1944, level: 55 },
        maintenance_complexity: 0.3
    },
    
    fire_suppression_system: {
        name: "Sistema Supressão Automática",
        weight: 80,
        cost: 12000,
        fire_suppression_bonus: 0.75,
        power_consumption: 100,
        activation_time: 2, // seconds
        tech_requirement: { year: 1950, level: 70 },
        reliability: 0.88,
        refill_cost: 500
    },
    
    escape_hatches: {
        name: "Escotilhas de Emergência",
        weight: 120,
        cost: 3000,
        crew_survival_bonus: 0.15,
        escape_time_reduction: 0.40,
        armor_integrity_reduction: 0.05,
        tech_requirement: { year: 1940, level: 30 }
    },

    // OBSERVATION & DETECTION
    commanders_cupola: {
        name: "Cúpula do Comandante",
        weight: 180,
        cost: 5500,
        visibility_bonus: 0.30,
        command_efficiency: 0.20,
        armor_thickness: 25, // mm
        rotating: true,
        tech_requirement: { year: 1942, level: 45 },
        vulnerability_increase: 0.10
    },
    
    periscope_array: {
        name: "Array de Periscópios",
        weight: 45,
        cost: 3200,
        visibility_bonus: 0.15,
        blind_spot_reduction: 0.25,
        tech_requirement: { year: 1940, level: 40 },
        fragility_factor: 1.3
    },
    
    searchlight_infrared: {
        name: "Holofote Infravermelho",
        weight: 60,
        cost: 8000,
        night_combat_bonus: 0.35,
        detection_range: 600, // meters
        power_consumption: 500,
        tech_requirement: { year: 1945, level: 65 },
        gives_away_position: true
    },

    // MOBILITY & ENGINEERING
    extra_fuel_tanks_external: {
        name: "Tanques Externos de Combustível",
        weight: 300,
        cost: 3000,
        range_bonus: 0.50,
        fire_vulnerability: 0.25,
        jettison_capable: true,
        armor_reduction_sides: 0.1,
        tech_requirement: { year: 1940, level: 25 }
    },
    
    extra_fuel_tanks_internal: {
        name: "Tanques Internos Extras",
        weight: 400,
        cost: 4500,
        range_bonus: 0.35,
        fire_vulnerability: 0.10,
        internal_space_reduction: 0.15,
        tech_requirement: { year: 1942, level: 35 }
    },
    
    deep_wading_kit: {
        name: "Kit Vadeamento Profundo",
        weight: 250,
        cost: 6000,
        water_crossing_depth: 4.0, // meters
        installation_time: 2, // hours
        speed_reduction_water: 0.6,
        tech_requirement: { year: 1943, level: 50 },
        available_to: ["NATO", "Warsaw"]
    },
    
    mine_roller: {
        name: "Rolos Detectores de Mina",
        weight: 800,
        cost: 8500,
        mine_clearance_capability: true,
        speed_reduction: 0.30,
        ground_pressure_increase: 0.25,
        detachable: true,
        tech_requirement: { year: 1942, level: 45 }
    },
    
    dozer_blade: {
        name: "Lâmina Bulldozer",
        weight: 600,
        cost: 7500,
        earthwork_capability: true,
        obstacle_clearing: true,
        speed_reduction: 0.20,
        frontal_protection_bonus: 0.15,
        tech_requirement: { year: 1944, level: 40 }
    },

    // CAMOUFLAGE & CONCEALMENT  
    camouflage_nets: {
        name: "Redes de Camuflagem",
        weight: 50,
        cost: 800,
        concealment_bonus: 0.20,
        setup_time: 15, // minutes
        air_detection_reduction: 0.25,
        tech_requirement: { year: 1940, level: 20 },
        weather_degradation: true
    },
    
    smoke_dispensers: {
        name: "Lança-fumígenos",
        weight: 80,
        cost: 5000,
        smoke_deployment_range: 50, // meters
        concealment_duration: 3, // minutes
        reload_time: 30, // seconds
        tech_requirement: { year: 1943, level: 40 },
        ammo_capacity: 12
    },
    
    exhaust_smoke_system: {
        name: "Sistema Fumígeno por Escape",
        weight: 35,
        cost: 3500,
        continuous_smoke: true,
        fuel_consumption_increase: 0.15,
        engine_performance_reduction: 0.08,
        tech_requirement: { year: 1941, level: 35 },
        available_to: ["Warsaw"]
    },

    // ELECTRONIC WARFARE & ADVANCED TECH
    radio_jammer: {
        name: "Jammer de Rádio",
        weight: 120,
        cost: 18000,
        enemy_communication_disruption: 0.60,
        jamming_range: 10, // km
        power_consumption: 300,
        tech_requirement: { year: 1952, level: 80 },
        experimental: true
    },
    
    radar_detector: {
        name: "Detector de Radar",
        weight: 45,
        cost: 15000,
        radar_warning: true,
        detection_range: 25, // km
        power_consumption: 80,
        tech_requirement: { year: 1954, level: 85 },
        experimental: true
    },

    // CREW COMFORT & PERFORMANCE
    improved_ventilation: {
        name: "Ventilação Melhorada",
        weight: 90,
        cost: 2500,
        crew_endurance_bonus: 0.15,
        nbc_protection_bonus: 0.20,
        power_consumption: 150,
        tech_requirement: { year: 1948, level: 45 }
    },
    
    crew_heater: {
        name: "Aquecedor da Tripulação",
        weight: 35,
        cost: 1800,
        cold_weather_performance: 0.25,
        crew_comfort_bonus: 0.20,
        power_consumption: 200,
        fuel_consumption_increase: 0.05,
        tech_requirement: { year: 1942, level: 30 }
    },
    
    improved_seats: {
        name: "Assentos Ergonômicos",
        weight: 60,
        cost: 2200,
        crew_fatigue_reduction: 0.18,
        accuracy_bonus_long_missions: 0.08,
        tech_requirement: { year: 1945, level: 35 },
        available_to: ["NATO"]
    },

    // MAINTENANCE & LOGISTICS
    field_repair_kit: {
        name: "Kit Reparos de Campo",
        weight: 150,
        cost: 4500,
        field_repair_capability: 0.30,
        maintenance_time_reduction: 0.20,
        consumable_cost_per_use: 200,
        tech_requirement: { year: 1940, level: 40 }
    },
    
    spare_parts_storage: {
        name: "Compartimento Peças Sobressalente",
        weight: 200,
        cost: 3000,
        reliability_bonus: 0.12,
        maintenance_interval_extension: 0.15,
        internal_space_reduction: 0.10,
        tech_requirement: { year: 1941, level: 35 }
    },
    
    diagnostic_equipment: {
        name: "Equipamento Diagnóstico",
        weight: 80,
        cost: 12000,
        fault_detection_speed: 0.50,
        preventive_maintenance_bonus: 0.25,
        power_consumption: 100,
        tech_requirement: { year: 1950, level: 75 },
        requires_training: true
    }
};
