export const vehicle_templates = {
    // MAIN BATTLE TANK TEMPLATES
    mbt_standard: {
        name: "Tanque de Batalha Padrão",
        role: "main_battle_tank",
        priority_components: {
            main_gun: { min_penetration: 160, weight_factor: 0.25 },
            armor: { min_effectiveness: 120, weight_factor: 0.30 },
            mobility: { min_power_to_weight: 12, weight_factor: 0.20 },
            reliability: { min_reliability: 0.80, weight_factor: 0.25 }
        },
        recommended_equipment: ["spall_liner", "wet_ammunition_storage", "commanders_cupola"],
        crew_size: 4,
        doctrine_variants: {
            NATO: { accuracy_focus: true, advanced_optics: true },
            Warsaw: { armor_focus: true, simplified_systems: true },
            neutral: { balanced_approach: true, cost_effective: true }
        }
    },
    
    mbt_heavy: {
        name: "Tanque Pesado de Batalha",
        role: "heavy_battle_tank",
        priority_components: {
            main_gun: { min_penetration: 200, weight_factor: 0.30 },
            armor: { min_effectiveness: 180, weight_factor: 0.40 },
            mobility: { min_power_to_weight: 8, weight_factor: 0.15 },
            reliability: { min_reliability: 0.75, weight_factor: 0.15 }
        },
        recommended_equipment: ["spall_liner", "fire_suppression_system", "extra_fuel_tanks_internal"],
        crew_size: 5,
        weight_class: "heavy"
    },

    // TANK DESTROYER TEMPLATES
    tank_destroyer_mobile: {
        name: "Caça-Tanques Móvel",
        role: "tank_destroyer",
        priority_components: {
            main_gun: { min_penetration: 180, weight_factor: 0.35 },
            mobility: { min_power_to_weight: 15, weight_factor: 0.30 },
            concealment: { stealth_focus: true, weight_factor: 0.20 },
            reliability: { min_reliability: 0.85, weight_factor: 0.15 }
        },
        recommended_equipment: ["camouflage_nets", "smoke_dispensers", "improved_optics"],
        crew_size: 4,
        armor_philosophy: "minimal_frontal_only"
    },
    
    tank_destroyer_assault: {
        name: "Caça-Tanques de Assalto",
        role: "assault_tank_destroyer",
        priority_components: {
            main_gun: { min_penetration: 220, weight_factor: 0.30 },
            armor: { min_effectiveness: 150, weight_factor: 0.35 },
            mobility: { min_power_to_weight: 10, weight_factor: 0.20 },
            reliability: { min_reliability: 0.78, weight_factor: 0.15 }
        },
        recommended_equipment: ["spall_liner", "extra_ammunition", "dozer_blade"],
        crew_size: 4,
        armor_philosophy: "heavy_frontal_casemate"
    },

    // SELF-PROPELLED ANTI-AIRCRAFT
    spaa_light: {
        name: "Antiaérea Autopropulsada Leve",
        role: "self_propelled_anti_aircraft",
        priority_components: {
            main_gun: { aa_capability: true, weight_factor: 0.30 },
            mobility: { min_power_to_weight: 18, weight_factor: 0.35 },
            detection: { radar_capable: true, weight_factor: 0.20 },
            reliability: { min_reliability: 0.85, weight_factor: 0.15 }
        },
        recommended_equipment: ["radio_advanced", "radar_detector", "quad_maxim"],
        crew_size: 3,
        armor_philosophy: "light_protection_only",
        special_requirements: ["open_turret", "high_elevation_gun"]
    },

    // ARMORED PERSONNEL CARRIER
    apc_standard: {
        name: "Transporte Blindado de Pessoal",
        role: "armored_personnel_carrier",
        priority_components: {
            mobility: { min_power_to_weight: 15, weight_factor: 0.30 },
            troop_capacity: { min_troops: 8, weight_factor: 0.25 },
            protection: { min_armor: 25, weight_factor: 0.25 },
            reliability: { min_reliability: 0.88, weight_factor: 0.20 }
        },
        recommended_equipment: ["improved_ventilation", "radio_basic", "periscope_array"],
        crew_size: 3,
        troop_capacity: 10,
        armor_philosophy: "all_around_light_protection"
    },

    // RECOVERY AND SUPPORT
    recovery_vehicle: {
        name: "Veículo de Recuperação",
        role: "armored_recovery_vehicle",
        priority_components: {
            mobility: { min_power_to_weight: 12, weight_factor: 0.25 },
            reliability: { min_reliability: 0.90, weight_factor: 0.30 },
            utility: { recovery_capability: true, weight_factor: 0.35 },
            protection: { min_armor: 40, weight_factor: 0.10 }
        },
        recommended_equipment: ["field_repair_kit", "spare_parts_storage", "diagnostic_equipment"],
        crew_size: 4,
        special_requirements: ["winch_system", "crane_capability", "welding_equipment"],
        armor_philosophy: "basic_protection"
    },

    // SELF-PROPELLED ARTILLERY
    self_propelled_artillery: {
        name: "Artilharia Autopropulsada",
        role: "self_propelled_artillery",
        priority_components: {
            main_gun: { indirect_fire: true, weight_factor: 0.35 },
            mobility: { min_power_to_weight: 10, weight_factor: 0.25 },
            communication: { long_range_radio: true, weight_factor: 0.25 },
            reliability: { min_reliability: 0.82, weight_factor: 0.15 }
        },
        recommended_equipment: ["radio_command", "extra_fuel_tanks_internal", "camouflage_nets"],
        crew_size: 5,
        armor_philosophy: "minimal_protection",
        special_requirements: ["high_elevation_gun", "large_ammunition_storage"]
    },

    // COMMAND VEHICLES
    command_vehicle: {
        name: "Veículo de Comando",
        role: "command_vehicle",
        priority_components: {
            communication: { advanced_radio: true, weight_factor: 0.40 },
            mobility: { min_power_to_weight: 14, weight_factor: 0.25 },
            protection: { min_armor: 60, weight_factor: 0.20 },
            reliability: { min_reliability: 0.88, weight_factor: 0.15 }
        },
        recommended_equipment: ["radio_command", "improved_ventilation", "commanders_cupola", "periscope_array"],
        crew_size: 6,
        special_requirements: ["multiple_radios", "map_table", "extended_range_antennas"],
        armor_philosophy: "medium_protection"
    },

    // ENGINEER VEHICLES
    engineer_vehicle: {
        name: "Veículo de Engenharia",
        role: "engineer_vehicle",
        priority_components: {
            utility: { engineering_capability: true, weight_factor: 0.35 },
            mobility: { min_power_to_weight: 12, weight_factor: 0.30 },
            protection: { min_armor: 50, weight_factor: 0.20 },
            reliability: { min_reliability: 0.85, weight_factor: 0.15 }
        },
        recommended_equipment: ["dozer_blade", "mine_roller", "field_repair_kit", "deep_wading_kit"],
        crew_size: 4,
        special_requirements: ["engineering_tools", "obstacle_clearing"],
        armor_philosophy: "frontal_protection_focus"
    },

    // FLAMETHROWER TANKS
    flamethrower_tank: {
        name: "Tanque Lança-Chamas",
        role: "flamethrower_tank",
        priority_components: {
            special_weapon: { flamethrower: true, weight_factor: 0.35 },
            protection: { min_armor: 80, weight_factor: 0.30 },
            mobility: { min_power_to_weight: 11, weight_factor: 0.20 },
            reliability: { min_reliability: 0.80, weight_factor: 0.15 }
        },
        recommended_equipment: ["fire_suppression_system", "spall_liner", "escape_hatches"],
        crew_size: 4,
        special_requirements: ["flame_fuel_tank", "protective_equipment"],
        armor_philosophy: "heavy_all_around",
        high_risk_role: true
    }
};
