export const propulsion_systems = {
    standard_fuel_system: {
        name: "Sistema de Combustível Padrão",
        description: "Sistema de alimentação de combustível padrão, com bombas e tanques básicos.",
        type: "fuel_system",
        weight: 50, // kg
        cost: 5000,
        tech_level: 10,
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 10,
        position: [0, 0, 0]
    },
    self_sealing_tanks: {
        name: "Tanques de Combustível Auto-selantes",
        description: "Tanques com revestimento de borracha que sela pequenos furos, reduzindo o risco de incêndio e perda de combustível.",
        type: "fuel_system",
        weight: 120, // kg (adicional sobre o padrão)
        cost: 15000,
        tech_level: 30,
        advantages: ["Maior sobrevivência em combate"],
        disadvantages: ["Peso e custo adicionais"],
        maintainabilityModifier: 1.1,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.1,
        techLevelRequirement: 30,
        position: [0, 0, 0]
    },
    drop_tank_system: {
        name: "Sistema para Tanques Ejetáveis",
        description: "Permite a instalação e ejeção de tanques de combustível externos, aumentando o alcance da missão.",
        type: "fuel_system",
        weight: 40, // kg
        cost: 10000,
        tech_level: 35,
        advantages: ["Flexibilidade de alcance"],
        disadvantages: ["Requer hardpoints externos"],
        maintainabilityModifier: 1.05,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    }
};