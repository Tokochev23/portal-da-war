export const landing_gear = {
    fixed_basic: {
        name: "Trem de Pouso Fixo Básico",
        description: "Um trem de pouso simples e fixo. Confiável e barato, mas gera arrasto significativo.",
        type: "landing_gear",
        weight: 150, // kg
        drag_penalty: 0.003,
        max_takeoff_weight_supported: 4000, // kg
        tech_level: 10,
        cost: 8000,
        maintainabilityModifier: 0.8, // Muito fácil de manter
        radarSignatureModifier: 0.1, // Fixo, aumenta a assinatura
        lifecycleCostMultiplier: 0.8,
        techLevelRequirement: 10,
        position: [0, 0, 0]
    },
    retractable_standard: {
        name: "Trem de Pouso Retrátil Padrão",
        description: "Trem de pouso retrátil padrão para caças e aeronaves leves. Reduz o arrasto em voo.",
        type: "landing_gear",
        weight: 250, // kg
        drag_penalty: 0.0005, // Arrasto mínimo quando retraído
        max_takeoff_weight_supported: 7000, // kg
        tech_level: 35,
        cost: 25000,
        maintainabilityModifier: 1.2, // Mais complexo para manter
        radarSignatureModifier: 0.01, // Mínimo quando retraído
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 35,
        position: [0, 0, 0]
    },
    heavy_duty_retractable: {
        name: "Trem de Pouso Retrátil Reforçado",
        description: "Trem de pouso robusto para bombardeiros e aeronaves de transporte pesadas.",
        type: "landing_gear",
        weight: 800, // kg
        drag_penalty: 0.001, // Maior mesmo quando retraído
        max_takeoff_weight_supported: 40000, // kg
        tech_level: 45,
        cost: 70000,
        maintainabilityModifier: 1.4, // Complexo e pesado
        radarSignatureModifier: 0.05, // Portas maiores, etc.
        lifecycleCostMultiplier: 1.5,
        techLevelRequirement: 45,
        position: [0, 0, 0]
    }
};