export const aircraft_engines = {
    // === TURBOJATOS BÁSICOS ===
    turbojet_early: {
        name: "Turbojato de Primeira Geração",
        description: "Motor a jato centrifugo básico",
        type: "turbojet_early",
        category: "single_engine",
        thrust: 2500, // kgf
        weight: 800, // kg
        fuel_consumption: 1.0, // kg/s at full thrust
        sfc_military: 1.15, // specific fuel consumption
        reliability: 0.85,
        tech_level: 60,
        year_introduced: 1950,
        cost_multiplier: 1.0,
        maintenance_hours: 50, // between overhauls
        advantages: ["Simples", "Confiável", "Econômico"],
        disadvantages: ["Empuxo limitado", "Eficiência baixa"]
    },

    turbojet_improved: {
        name: "Turbojato Melhorado",
        description: "Versão otimizada do turbojato básico",
        type: "turbojet_early", 
        category: "single_engine",
        thrust: 3100, // kgf
        weight: 850, // kg
        fuel_consumption: 0.92, // kg/s at full thrust
        sfc_military: 1.05,
        reliability: 0.88,
        tech_level: 65,
        year_introduced: 1952,
        cost_multiplier: 1.3,
        maintenance_hours: 65,
        advantages: ["Empuxo maior", "Eficiência melhor"],
        disadvantages: ["Mais caro", "Complexidade maior"]
    },

    turbojet_lightweight: {
        name: "Turbojato Leve",
        description: "Motor compacto para interceptadores",
        type: "turbojet_early",
        category: "single_engine",
        thrust: 2200, // kgf
        weight: 650, // kg
        fuel_consumption: 1.1, // kg/s
        sfc_military: 1.20,
        reliability: 0.82,
        tech_level: 48,
        year_introduced: 1951,
        cost_multiplier: 1.1,
        maintenance_hours: 45,
        advantages: ["Peso baixo", "Taxa empuxo/peso alta"],
        disadvantages: ["Empuxo total limitado", "Autonomia reduzida"]
    },

    // === TURBOJATOS COM PÓS-COMBUSTÃO ===
    afterburning_turbojet_early: {
        name: "Turbojato com Pós-combustor (Inicial)",
        description: "Primeiro motor com pós-combustão operacional",
        type: "afterburning_turbojet_early",
        category: "afterburning_single",
        military_thrust: 3200, // kgf (sem pós-combustão)
        afterburner_thrust: 4800, // kgf (com pós-combustão)
        weight: 1200, // kg
        fuel_consumption: 0.9, // kg/s military
        afterburner_fuel_consumption: 3.5, // kg/s afterburner
        sfc_military: 0.95,
        sfc_afterburner: 2.8,
        reliability: 0.78, // afterburners were unreliable
        tech_level: 85,
        year_introduced: 1954,
        cost_multiplier: 2.2,
        maintenance_hours: 35,
        advantages: ["Empuxo supersônico", "Velocidade máxima"],
        disadvantages: ["Consumo massivo", "Confiabilidade baixa", "Muito caro"]
    },

    afterburning_turbojet_improved: {
        name: "Turbojato Pós-combustão Aprimorado", 
        description: "Versão mais confiável do motor supersônico",
        type: "afterburning_turbojet_early",
        category: "afterburning_single",
        military_thrust: 3600, // kgf
        afterburner_thrust: 5400, // kgf
        weight: 1350, // kg
        fuel_consumption: 0.88, // kg/s military
        afterburner_fuel_consumption: 3.2, // kg/s afterburner
        sfc_military: 0.90,
        sfc_afterburner: 2.6,
        reliability: 0.82,
        tech_level: 95,
        year_introduced: 1955,
        cost_multiplier: 2.8,
        maintenance_hours: 42,
        advantages: ["Empuxo alto", "Confiabilidade melhor"],
        disadvantages: ["Ainda muito caro", "Consumo alto", "Peso elevado"]
    },

    // === MOTORES PARA BOMBARDEIROS ===
    turbojet_heavy: {
        name: "Turbojato Pesado",
        description: "Motor robusto para aeronaves grandes",
        type: "turbojet_early",
        category: "single_engine_heavy",
        thrust: 4200, // kgf
        weight: 1400, // kg
        fuel_consumption: 1.3, // kg/s
        sfc_military: 1.08,
        reliability: 0.90,
        tech_level: 58,
        year_introduced: 1952,
        cost_multiplier: 1.8,
        maintenance_hours: 80,
        advantages: ["Empuxo muito alto", "Confiabilidade excelente"],
        disadvantages: ["Peso excessivo", "Não adequado para caças"]
    },

    turbojet_efficient: {
        name: "Turbojato Econômico",
        description: "Motor otimizado para longo alcance",
        type: "turbojet_early",
        category: "single_engine",
        thrust: 2800, // kgf
        weight: 920, // kg
        fuel_consumption: 0.75, // kg/s - very efficient
        sfc_military: 0.85,
        reliability: 0.91,
        tech_level: 55,
        year_introduced: 1953,
        cost_multiplier: 1.5,
        maintenance_hours: 95,
        advantages: ["Consumo baixíssimo", "Alcance excelente", "Confiável"],
        disadvantages: ["Empuxo médio", "Caro para produzir"]
    },

    // === MOTORES EXPERIMENTAIS ===
    turbojet_experimental: {
        name: "Turbojato Experimental X-1",
        description: "Motor experimental de alta performance",
        type: "turbojet_early",
        category: "experimental",
        thrust: 3800, // kgf
        weight: 1100, // kg
        fuel_consumption: 1.4, // kg/s
        sfc_military: 1.25,
        reliability: 0.65, // experimental = unreliable
        tech_level: 110,
        year_introduced: 1955,
        cost_multiplier: 4.0,
        maintenance_hours: 25,
        experimental: true,
        advantages: ["Empuxo excepcional", "Tecnologia avançada"],
        disadvantages: ["Muito pouco confiável", "Custíssimo", "Requer especialistas"]
    },

    // === TURBOFANS INICIAIS (EXPERIMENTAL) ===
    turbofan_prototype: {
        name: "Turbofan Protótipo", 
        description: "Primeiro motor turbofan experimental",
        type: "turbofan_early",
        category: "experimental",
        thrust: 2900, // kgf
        bypass_ratio: 0.3,
        weight: 1050, // kg
        fuel_consumption: 0.82, // kg/s - more efficient
        sfc_military: 0.88,
        reliability: 0.70,
        tech_level: 125,
        year_introduced: 1956, // ahead of its time
        cost_multiplier: 3.5,
        maintenance_hours: 30,
        experimental: true,
        advantages: ["Eficiência superior", "Ruído menor"],
        disadvantages: ["Tecnologia não madura", "Muito caro", "Complexo"]
    },

    // === MOTORES À PISTÃO ===
    piston_inline_small: {
        name: "Motor Inline 6 cilindros",
        description: "Motor à pistão pequeno para treinamento",
        type: "piston_inline",
        category: "piston_small",
        power_hp: 180, // hp
        power_kgf: 145, // equivalent thrust estimate
        weight: 180, // kg
        fuel_consumption: 0.045, // kg/s at cruise
        fuel_consumption_full: 0.065, // kg/s at full power
        displacement_liters: 6.5,
        supercharger_altitude_m: 0, // Naturally aspirated
        reliability: 0.92,
        tech_level: 15,
        year_introduced: 1940,
        cost_multiplier: 0.3,
        maintenance_hours: 150,
        advantages: ["Muito barato", "Simples", "Confiável", "Fácil manutenção"],
        disadvantages: ["Potência baixa", "Obsoleto", "Vibração"]
    },

    piston_inline: {
        name: "Motor Inline V12",
        description: "Motor líquido-refrigerado de alta performance",
        type: "piston_inline",
        category: "piston_fighter",
        power_hp: 1200, // hp
        power_kgf: 950, // equivalent thrust estimate
        weight: 650, // kg
        fuel_consumption: 0.15, // kg/s at cruise
        fuel_consumption_full: 0.28, // kg/s at full power
        displacement_liters: 27,
        supercharged: true,
        supercharger_altitude_m: 4000, // Single-stage supercharger
        reliability: 0.88,
        tech_level: 35,
        year_introduced: 1942,
        cost_multiplier: 0.8,
        maintenance_hours: 120,
        advantages: ["Boa potência/peso", "Perfil aerodinâmico", "Performance em altitude"],
        disadvantages: ["Sistema de refrigeração vulnerável", "Complexo", "Obsolescente"]
    },

    piston_inline_improved: {
        name: "Motor Inline V12 Melhorado",
        description: "Versão final dos motores inline",
        type: "piston_inline",
        category: "piston_fighter",
        power_hp: 1650, // hp
        power_kgf: 1300, // equivalent thrust estimate
        weight: 720, // kg
        fuel_consumption: 0.18, // kg/s at cruise
        fuel_consumption_full: 0.35, // kg/s at full power
        displacement_liters: 36,
        supercharged: true,
        supercharger_altitude_m: 6000, // Two-stage supercharger
        water_methanol_injection: true,
        reliability: 0.85,
        tech_level: 40,
        year_introduced: 1945,
        cost_multiplier: 1.2,
        maintenance_hours: 100,
        advantages: ["Potência máxima para pistão", "Injeção de água", "Performance excelente"],
        disadvantages: ["Consumo alto", "Complexidade máxima", "Obsoleto"]
    },

    piston_radial_small: {
        name: "Motor Radial 7 cilindros",
        description: "Motor radial pequeno e confiável",
        type: "piston_radial",
        category: "piston_small",
        power_hp: 240, // hp
        power_kgf: 190, // equivalent thrust estimate
        weight: 145, // kg
        fuel_consumption: 0.055, // kg/s at cruise
        fuel_consumption_full: 0.08, // kg/s at full power
        displacement_liters: 9.5,
        air_cooled: true,
        reliability: 0.95,
        tech_level: 20,
        year_introduced: 1938,
        cost_multiplier: 0.4,
        maintenance_hours: 200,
        advantages: ["Muito confiável", "Simples", "Refrigeração a ar", "Durável"],
        disadvantages: ["Potência limitada", "Arrasto alto", "Tecnologia antiga"]
    },

    piston_radial: {
        name: "Motor Radial 14 cilindros",
        description: "Motor radial robusto para caças e ataques",
        type: "piston_radial",
        category: "piston_fighter",
        power_hp: 1800, // hp
        power_kgf: 1420, // equivalent thrust estimate
        weight: 850, // kg
        fuel_consumption: 0.20, // kg/s at cruise
        fuel_consumption_full: 0.38, // kg/s at full power
        displacement_liters: 46,
        air_cooled: true,
        supercharged: true,
        reliability: 0.90,
        tech_level: 32,
        year_introduced: 1943,
        cost_multiplier: 0.9,
        maintenance_hours: 140,
        advantages: ["Muito robusto", "Resistente a danos", "Confiável", "Potência boa"],
        disadvantages: ["Peso alto", "Arrasto significativo", "Obsolescente"]
    },

    piston_radial_heavy: {
        name: "Motor Radial 18 cilindros",
        description: "Motor radial pesado para bombardeiros",
        type: "piston_radial",
        category: "piston_heavy",
        power_hp: 2400, // hp
        power_kgf: 1900, // equivalent thrust estimate
        weight: 1100, // kg
        fuel_consumption: 0.28, // kg/s at cruise
        fuel_consumption_full: 0.52, // kg/s at full power
        displacement_liters: 54,
        air_cooled: true,
        supercharged: true,
        reliability: 0.87,
        tech_level: 38,
        year_introduced: 1944,
        cost_multiplier: 1.1,
        maintenance_hours: 110,
        advantages: ["Potência máxima", "Muito robusto", "Para aeronaves grandes"],
        disadvantages: ["Muito pesado", "Arrasto excessivo", "Consumo alto", "Obsoleto"]
    },

    // === MOTORES TURBOPROP ===
    turboprop_early: {
        name: "Turboprop de Primeira Geração",
        description: "Motor turboprop inicial experimental",
        type: "turboprop_early",
        category: "turboprop",
        shaft_hp: 1800, // hp no eixo
        equivalent_thrust_kgf: 1600, // rough equivalent
        weight: 850, // kg
        fuel_consumption: 0.18, // kg/s at cruise - much more efficient
        fuel_consumption_full: 0.28, // kg/s at full power
        sfc_cruise: 0.32, // lb/hp/hr equivalent
        propeller_diameter: 3.8, // meters
        reduction_ratio: 15.0,
        reliability: 0.82,
        tech_level: 70,
        year_introduced: 1954,
        cost_multiplier: 2.5,
        maintenance_hours: 80,
        advantages: ["Muito eficiente", "Boa para transportes", "Velocidade média-alta"],
        disadvantages: ["Tecnologia nova", "Caro", "Complexidade média", "Limitado em altitude"]
    },

    turboprop_improved: {
        name: "Turboprop Melhorado",
        description: "Versão otimizada do turboprop",
        type: "turboprop_early",
        category: "turboprop",
        shaft_hp: 2200, // hp
        equivalent_thrust_kgf: 1950,
        weight: 920, // kg
        fuel_consumption: 0.16, // kg/s at cruise
        fuel_consumption_full: 0.26, // kg/s at full power
        sfc_cruise: 0.29,
        propeller_diameter: 4.1, // meters
        reduction_ratio: 12.5,
        reliability: 0.85,
        tech_level: 80,
        year_introduced: 1955,
        cost_multiplier: 2.8,
        maintenance_hours: 95,
        advantages: ["Eficiência excelente", "Confiabilidade melhor", "Potência alta"],
        disadvantages: ["Caro", "Tecnologia emergente", "Hélice grande"]
    },

    turboprop_heavy: {
        name: "Turboprop Pesado",
        description: "Turboprop de alta potência para aeronaves grandes",
        type: "turboprop_early",
        category: "turboprop_heavy",
        shaft_hp: 3200, // hp
        equivalent_thrust_kgf: 2800,
        weight: 1300, // kg
        fuel_consumption: 0.24, // kg/s at cruise
        fuel_consumption_full: 0.38, // kg/s at full power
        sfc_cruise: 0.31,
        propeller_diameter: 4.6, // meters
        reduction_ratio: 10.0,
        reliability: 0.80,
        tech_level: 75,
        year_introduced: 1956,
        cost_multiplier: 3.2,
        maintenance_hours: 75,
        experimental: true,
        advantages: ["Potência máxima", "Eficiente para grandes aeronaves"],
        disadvantages: ["Muito caro", "Experimental", "Peso alto", "Complexo"]
    }
};
