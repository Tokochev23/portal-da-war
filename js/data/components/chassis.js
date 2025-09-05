export const chassis = {
    // === MAIN BATTLE TANK CHASSIS ===
    mbt_light: {
        name: "Chassi MBT Leve",
        category: "Main Battle Tank",
        weight_class: "light",
        base_weight: 6000,
        base_cost: 85000,
        max_weight_capacity: 35000,
        max_armor_thickness: 150,
        base_speed: 52,
        terrain_mult: { road: 1.0, offroad: 0.88, mud: 0.78, snow: 0.82 },
        maintenance_complexity: 0.7,
        fuel_consumption_base: 1.0,
        crew_comfort: 0.7,
        tech_requirement: { year: 1945, level: 55 },
        reliability: 0.84,
        crew_capacity: { min: 3, max: 4, optimal: 3 },
        turret_space: 3.0,
        internal_volume: 45,
        ground_pressure: 0.78,
        variants: ["MBT", "Tank Destroyer", "SPAA", "Command"],
        
        // SISTEMA DE COMPATIBILIDADE
        compatible_engines: ["light", "medium"], // Só motores leves e médios
        compatible_transmissions: ["manual", "semi_auto"], // Sem automáticas pesadas
        compatible_suspensions: ["leaf_spring", "coil_spring", "torsion_bar", "christie"],
        max_main_gun_caliber: 105, // mm - limite de calibre
        min_main_gun_caliber: 37,
        compatible_secondary_weapons: ["mg_7_62mm", "mg_12_7mm", "autocannon_20mm"],
        max_engine_power: 650, // hp - limite de potência
        min_engine_power: 180,
        large_caliber_capable: false,
        aa_optimized: false
    },
    
    mbt_medium: {
        name: "Chassi MBT Médio",
        category: "Main Battle Tank",
        weight_class: "medium",
        base_weight: 13000,
        base_cost: 110000,
        max_weight_capacity: 45000,
        max_armor_thickness: 200,
        base_speed: 48,
        terrain_mult: { road: 1.0, offroad: 0.82, mud: 0.72, snow: 0.75 },
        maintenance_complexity: 0.8,
        fuel_consumption_base: 1.2,
        crew_comfort: 0.75,
        tech_requirement: { year: 1948, level: 62 },
        reliability: 0.81,
        crew_capacity: { min: 3, max: 5, optimal: 4 },
        turret_space: 3.4,
        internal_volume: 52,
        ground_pressure: 0.82,
        variants: ["MBT", "Tank Destroyer", "Recovery", "Bridge Layer"],
        
        // SISTEMA DE COMPATIBILIDADE  
        compatible_engines: ["medium", "heavy"], // Motores médios e pesados
        compatible_transmissions: ["manual", "semi_auto", "automatic"], // Todas as transmissões exceto planetárias
        compatible_suspensions: ["coil_spring", "torsion_bar", "hydropneumatic", "interleaved"],
        max_main_gun_caliber: 125, // mm - pode usar canhões pesados
        min_main_gun_caliber: 75,
        compatible_secondary_weapons: ["mg_7_62mm", "mg_12_7mm", "mg_14_5mm", "autocannon_20mm", "autocannon_25mm"],
        max_engine_power: 900, // hp
        min_engine_power: 400,
        large_caliber_capable: false,
        aa_optimized: false
    },
    
    mbt_super_heavy: {
        name: "Chassi MBT Super-Pesado",
        category: "Super Heavy Tank",
        weight_class: "super_heavy",
        base_weight: 46000,
        base_cost: 280000,
        max_weight_capacity: 75000,
        max_armor_thickness: 350,
        base_speed: 35,
        terrain_mult: { road: 1.0, offroad: 0.65, mud: 0.45, snow: 0.55 },
        maintenance_complexity: 1.4,
        fuel_consumption_base: 2.2,
        crew_comfort: 0.85,
        tech_requirement: { year: 1953, level: 85 },
        reliability: 0.72,
        crew_capacity: { min: 4, max: 6, optimal: 5 },
        turret_space: 4.2,
        internal_volume: 68,
        ground_pressure: 0.95,
        variants: ["Heavy MBT", "Heavy Tank Destroyer", "Breakthrough Tank"]
    },
    
    mbt_heavy: {
        name: "Chassi MBT Pesado",
        category: "Main Battle Tank", 
        weight_class: "heavy",
        base_weight: 21000,
        base_cost: 165000,
        max_weight_capacity: 65000,
        max_armor_thickness: 280,
        base_speed: 42,
        terrain_mult: { road: 1.0, offroad: 0.75, mud: 0.58, snow: 0.65 },
        maintenance_complexity: 1.0,
        fuel_consumption_base: 1.6,
        crew_comfort: 0.82,
        tech_requirement: { year: 1950, level: 72 },
        reliability: 0.78,
        crew_capacity: { min: 4, max: 5, optimal: 4 },
        turret_space: 3.8,
        internal_volume: 58,
        ground_pressure: 0.95,
        variants: ["MBT", "Heavy Tank Destroyer", "Assault Gun"]
    },
    
    // === LIGHT TRACKED CHASSIS ===
    light_tracked_basic: {
        name: "Chassi Leve Tracked Básico",
        category: "Light Tracked",
        weight_class: "light",
        base_weight: 4500,
        base_cost: 42000,
        max_weight_capacity: 25000,
        max_armor_thickness: 35,
        base_speed: 65,
        terrain_mult: { road: 1.0, offroad: 0.92, mud: 0.82, snow: 0.75 },
        maintenance_complexity: 0.55,
        fuel_consumption_base: 0.75,
        crew_comfort: 0.65,
        tech_requirement: { year: 1942, level: 45 },
        reliability: 0.87,
        crew_capacity: { min: 2, max: 3, optimal: 2 },
        turret_space: 1.8,
        internal_volume: 28,
        ground_pressure: 0.45,
        variants: ["APC", "IFV", "Mortar Carrier", "Command", "Ambulance"],
        // Compatibilidade de motores e limites de potência específicos
        compatible_engines: ["light", "medium"],
        compatible_transmissions: ["manual", "semi_auto"],
        compatible_suspensions: ["coil_spring", "torsion_bar"],
        min_engine_power: 120,
        max_engine_power: 450
    },
    
    light_tracked_advanced: {
        name: "Chassi Leve Tracked Avançado",
        category: "Light Tracked",
        weight_class: "light",
        base_weight: 5500,
        base_cost: 58000,
        max_weight_capacity: 32000,
        max_armor_thickness: 50,
        base_speed: 68,
        terrain_mult: { road: 1.0, offroad: 0.95, mud: 0.85, snow: 0.78 },
        maintenance_complexity: 0.7,
        fuel_consumption_base: 0.85,
        crew_comfort: 0.72,
        tech_requirement: { year: 1948, level: 58 },
        reliability: 0.85,
        crew_capacity: { min: 2, max: 4, optimal: 3 },
        turret_space: 2.2,
        internal_volume: 35,
        ground_pressure: 0.52,
        variants: ["IFV", "SPAA", "AT Platform", "Recon", "Engineer"],
        compatible_engines: ["light", "medium"],
        compatible_transmissions: ["manual", "semi_auto", "automatic"],
        compatible_suspensions: ["coil_spring", "torsion_bar", "hydropneumatic"],
        min_engine_power: 150,
        max_engine_power: 550
    },

    heavy_tracked: {
        name: "Chassi Pesado Tracked",
        category: "Heavy Tracked",
        weight_class: "heavy",
        base_weight: 20000,
        base_cost: 95000,
        max_weight_capacity: 48000,
        max_armor_thickness: 120,
        base_speed: 45,
        terrain_mult: { road: 1.0, offroad: 0.78, mud: 0.65, snow: 0.68 },
        maintenance_complexity: 0.9,
        fuel_consumption_base: 1.4,
        crew_comfort: 0.78,
        tech_requirement: { year: 1946, level: 65 },
        reliability: 0.80,
        crew_capacity: { min: 3, max: 6, optimal: 4 },
        turret_space: 3.0,
        internal_volume: 48,
        ground_pressure: 0.88,
        variants: ["Heavy APC", "SPG", "Recovery", "Engineer"],
        compatible_engines: ["medium", "heavy"],
        compatible_transmissions: ["manual", "semi_auto", "automatic"],
        compatible_suspensions: ["torsion_bar", "interleaved", "hydropneumatic"],
        min_engine_power: 450,
        max_engine_power: 1000
    },

    // === WHEELED CHASSIS ===
    wheeled_4x4: {
        name: "Chassi com Rodas 4x4",
        category: "Wheeled",
        weight_class: "light",
        base_weight: 3500,
        base_cost: 32000,
        max_weight_capacity: 18000,
        max_armor_thickness: 25,
        base_speed: 95,
        terrain_mult: { road: 1.4, offroad: 0.65, mud: 0.35, snow: 0.45 },
        maintenance_complexity: 0.45,
        fuel_consumption_base: 0.6,
        crew_comfort: 0.75,
        tech_requirement: { year: 1940, level: 35 },
        reliability: 0.90,
        crew_capacity: { min: 2, max: 4, optimal: 2 },
        turret_space: 1.2,
        internal_volume: 18,
        ground_pressure: 0.68,
        variants: ["Scout", "Light APC", "Command", "AT Platform"],
        // Limitações fortes para chassi 4x4
        compatible_engines: ["light"],
        compatible_transmissions: ["automatic", "semi_auto"],
        compatible_suspensions: ["coil_spring"],
        min_engine_power: 100,
        max_engine_power: 300,
        max_main_gun_caliber: 37,
        large_caliber_capable: false
    },
    
    wheeled_6x6: {
        name: "Chassi com Rodas 6x6",
        category: "Wheeled",
        weight_class: "medium",
        base_weight: 4500,
        base_cost: 45000,
        max_weight_capacity: 28000,
        max_armor_thickness: 35,
        base_speed: 88,
        terrain_mult: { road: 1.3, offroad: 0.72, mud: 0.48, snow: 0.55 },
        maintenance_complexity: 0.55,
        fuel_consumption_base: 0.8,
        crew_comfort: 0.78,
        tech_requirement: { year: 1945, level: 48 },
        reliability: 0.88,
        crew_capacity: { min: 2, max: 6, optimal: 3 },
        turret_space: 1.8,
        internal_volume: 32,
        ground_pressure: 0.72,
        variants: ["APC", "IFV", "SPAA", "Mortar", "Command"],
        compatible_engines: ["light", "medium"],
        compatible_transmissions: ["automatic", "semi_auto"],
        compatible_suspensions: ["coil_spring", "hydropneumatic"],
        min_engine_power: 150,
        max_engine_power: 450,
        max_main_gun_caliber: 57,
        large_caliber_capable: false
    },
    
    wheeled_8x8: {
        name: "Chassi com Rodas 8x8",
        category: "Wheeled",
        weight_class: "heavy",
        base_weight: 6000,
        base_cost: 68000,
        max_weight_capacity: 38000,
        max_armor_thickness: 45,
        base_speed: 85,
        terrain_mult: { road: 1.25, offroad: 0.78, mud: 0.58, snow: 0.62 },
        maintenance_complexity: 0.68,
        fuel_consumption_base: 1.0,
        crew_comfort: 0.82,
        tech_requirement: { year: 1950, level: 62 },
        reliability: 0.85,
        crew_capacity: { min: 3, max: 8, optimal: 4 },
        turret_space: 2.5,
        internal_volume: 42,
        ground_pressure: 0.78,
        variants: ["Heavy APC", "IFV", "Tank Destroyer", "Artillery", "Recovery"],
        
        // SISTEMA DE COMPATIBILIDADE - WHEELED LIMITATIONS
        compatible_engines: ["light", "medium"], // Não suporta motores super pesados
        compatible_transmissions: ["automatic", "semi_auto"], // Precisa de transmissões suaves para rodas
        compatible_suspensions: ["coil_spring", "hydropneumatic"], // Suspensões adequadas para rodas
        max_main_gun_caliber: 90, // mm - LIMITADO - rodas não aguentam recuo de calibres grandes
        min_main_gun_caliber: 25,
        compatible_secondary_weapons: ["mg_7_62mm", "mg_12_7mm", "autocannon_20mm", "autocannon_25mm"],
        max_engine_power: 750, // hp - limitado pelo chassi com rodas
        min_engine_power: 300,
        large_caliber_capable: false, // NUNCA grandes calibres em rodas
        aa_optimized: false,
        wheeled_restrictions: true // Flag especial para limitações de chassi rodado
    },

    // === SPECIALIZED CHASSIS ===
    amphibious_tracked: {
        name: "Chassi Anfíbio Tracked",
        category: "Amphibious",
        weight_class: "medium",
        base_weight: 5000,
        base_cost: 95000,
        max_weight_capacity: 35000,
        max_armor_thickness: 60,
        base_speed: 48,
        water_speed: 8,
        terrain_mult: { road: 1.0, offroad: 0.85, mud: 0.92, snow: 0.72, water: 1.0 },
        maintenance_complexity: 1.1,
        fuel_consumption_base: 1.3,
        crew_comfort: 0.68,
        tech_requirement: { year: 1948, level: 68 },
        reliability: 0.78,
        crew_capacity: { min: 3, max: 5, optimal: 3 },
        turret_space: 2.8,
        internal_volume: 38,
        ground_pressure: 0.65,
        variants: ["Amphibious Tank", "Marine APC", "Beach Assault"],
        special_features: ["waterproofed", "swimming_capability", "bilge_pumps"]
    },
    
    airtransportable: {
        name: "Chassi Aerotransportável",
        category: "Airmobile",
        weight_class: "light",
        base_weight: 3000,
        base_cost: 52000,
        max_weight_capacity: 22000,
        max_armor_thickness: 30,
        base_speed: 62,
        terrain_mult: { road: 1.0, offroad: 0.88, mud: 0.75, snow: 0.72 },
        maintenance_complexity: 0.8,
        fuel_consumption_base: 0.85,
        crew_comfort: 0.65,
        tech_requirement: { year: 1950, level: 72 },
        reliability: 0.82,
        crew_capacity: { min: 2, max: 3, optimal: 2 },
        turret_space: 1.5,
        internal_volume: 22,
        ground_pressure: 0.38,
        variants: ["Airborne Tank", "Air-Mobile APC", "Recon"],
        special_features: ["lightweight_construction", "air_droppable", "quick_deployment"]
    },
    
    modular_experimental: {
        name: "Chassi Modular Experimental",
        category: "Experimental",
        weight_class: "variable",
        base_weight: 25000,
        base_cost: 125000,
        max_weight_capacity: 50000,
        max_armor_thickness: 120,
        base_speed: 55,
        terrain_mult: { road: 1.0, offroad: 0.82, mud: 0.68, snow: 0.72 },
        maintenance_complexity: 1.6,
        fuel_consumption_base: 1.1,
        crew_comfort: 0.85,
        tech_requirement: { year: 1954, level: 88 },
        reliability: 0.75,
        crew_capacity: { min: 2, max: 6, optimal: 3 },
        turret_space: 3.5,
        internal_volume: 55,
        ground_pressure: 0.75,
        variants: ["Modular MBT", "Multi-Role", "Reconfigurable"],
        special_features: ["modular_armor", "swappable_components", "multi_role"],
        experimental: true
    },

    // === DEDICATED SPAA CHASSIS ===
    spaa_light: {
        name: "Chassi SPAA Leve",
        category: "Anti-Aircraft",
        weight_class: "light", 
        base_weight: 12000,
        base_cost: 58000,
        max_weight_capacity: 28000,
        max_armor_thickness: 40,
        base_speed: 65,
        terrain_mult: { road: 1.0, offroad: 0.88, mud: 0.75, snow: 0.78 },
        maintenance_complexity: 0.8,
        fuel_consumption_base: 0.9,
        crew_comfort: 0.70,
        tech_requirement: { year: 1943, level: 50 },
        reliability: 0.85,
        crew_capacity: { min: 3, max: 5, optimal: 4 },
        turret_space: 2.5,
        internal_volume: 32,
        ground_pressure: 0.55,
        variants: ["SPAA", "Mobile AA"],
        special_features: ["aa_fire_control", "radar_compatible", "360_traverse"],
        
        // SISTEMA DE COMPATIBILIDADE - SPAA ESPECIALIZADO
        compatible_engines: ["light", "medium"], // Precisa de mobilidade
        compatible_transmissions: ["manual", "semi_auto"], // Responsividade rápida
        compatible_suspensions: ["coil_spring", "torsion_bar", "christie"], // Estabilidade para tiro
        max_main_gun_caliber: 0, // SEM canhão principal - só AA
        min_main_gun_caliber: 0,
        compatible_secondary_weapons: [], // Sem secundárias - foco no AA
        max_engine_power: 600, // hp - precisa de boa mobilidade
        min_engine_power: 300,
        large_caliber_capable: false,
        aa_optimized: true, // OTIMIZADO PARA AA
        aa_only: true, // SÓ armas AA permitidas
        compatible_aa_weapons: ["mg_23mm", "mg_30mm", "mg_37mm", "mg_40mm"] // Só canhões AA
    },

    spaa_medium: {
        name: "Chassi SPAA Médio",
        category: "Anti-Aircraft",
        weight_class: "medium",
        base_weight: 18000,
        base_cost: 85000,
        max_weight_capacity: 42000,
        max_armor_thickness: 60,
        base_speed: 55,
        terrain_mult: { road: 1.0, offroad: 0.82, mud: 0.68, snow: 0.72 },
        maintenance_complexity: 0.9,
        fuel_consumption_base: 1.2,
        crew_comfort: 0.75,
        tech_requirement: { year: 1945, level: 60 },
        reliability: 0.82,
        crew_capacity: { min: 4, max: 6, optimal: 5 },
        turret_space: 3.2,
        internal_volume: 45,
        ground_pressure: 0.68,
        variants: ["Heavy SPAA", "Multi-Target AA"],
        special_features: ["advanced_fire_control", "radar_integrated", "ammo_handling"],
        aa_optimized: true
    },

    spg_chassis: {
        name: "Chassi SPG/SPH",
        category: "Self-Propelled Artillery",
        weight_class: "heavy",
        base_weight: 12000,
        base_cost: 95000,
        max_weight_capacity: 52000,
        max_armor_thickness: 80,
        base_speed: 45,
        terrain_mult: { road: 1.0, offroad: 0.75, mud: 0.62, snow: 0.68 },
        maintenance_complexity: 0.9,
        fuel_consumption_base: 1.4,
        crew_comfort: 0.65,
        tech_requirement: { year: 1944, level: 55 },
        reliability: 0.80,
        crew_capacity: { min: 4, max: 8, optimal: 6 },
        turret_space: 4.5,
        internal_volume: 55,
        ground_pressure: 0.85,
        variants: ["SPG", "SPH", "Howitzer", "Artillery"],
        special_features: ["large_gun_mount", "ammo_storage", "artillery_systems"],
        
        // SISTEMA DE COMPATIBILIDADE - SPG/SPH ESPECIALIZADO
        compatible_engines: ["heavy", "super_heavy"], // Precisa de muita potência para grandes canhões
        compatible_transmissions: ["manual", "automatic", "planetary"], // Transmissões robustas
        compatible_suspensions: ["torsion_bar", "hydropneumatic", "interleaved"], // Estabilidade para grandes calibres
        max_main_gun_caliber: 180, // mm - PERMITE GRANDES CALIBRES (até 180mm)
        min_main_gun_caliber: 130, // mm - SÓ grandes calibres acima de 130mm
        compatible_secondary_weapons: ["mg_7_62mm", "mg_12_7mm"], // Defesa limitada
        max_engine_power: 1200, // hp - precisa de muito poder
        min_engine_power: 600,
        large_caliber_capable: true, // ESPECIALIZADO EM GRANDES CALIBRES
        aa_optimized: false,
        artillery_specialized: true // Flag especial para artilharia
    }
};
