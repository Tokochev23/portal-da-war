export const structures = {
    aluminum_structure: {
        name: "Estrutura de Alumínio",
        description: "Estrutura padrão de alumínio aeronáutico. Um balanço entre peso, custo e durabilidade.",
        type: "structure_material",
        weight_modifier: 1.0, // Modificador sobre o peso base da fuselagem
        hp_modifier: 1.0, // Modificador sobre a durabilidade (HP) base
        cost_modifier: 1.0,
        tech_level: 20,
        maintainabilityModifier: 1.0,
        radarSignatureModifier: 1.0,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 20,
        position: [0, 0, 0]
    },
    steel_structure: {
        name: "Estrutura de Aço",
        description: "Estrutura de aço tubular. Mais pesada e mais barata, porém muito mais resistente a danos.",
        type: "structure_material",
        weight_modifier: 1.25, // 25% mais pesado
        hp_modifier: 1.5, // 50% mais durável
        cost_modifier: 0.8, // 20% mais barato
        tech_level: 15,
        advantages: ["Muito durável", "Barato"],
        disadvantages: ["Muito pesado"],
        maintainabilityModifier: 0.9, // Aço é mais fácil de reparar
        radarSignatureModifier: 1.1, // Aço reflete mais
        lifecycleCostMultiplier: 0.9,
        techLevelRequirement: 15,
        position: [0, 0, 0]
    },
    titanium_reinforced_structure: {
        name: "Estrutura Reforçada com Titânio",
        description: "Uso de titânio em pontos críticos da estrutura. Mais leve que aço para a mesma resistência, mas extremamente caro.",
        type: "structure_material",
        weight_modifier: 0.9, // 10% mais leve
        hp_modifier: 1.3, // 30% mais durável
        cost_modifier: 3.0, // 200% mais caro
        tech_level: 90,
        advantages: ["Leve e forte"],
        disadvantages: ["Extremamente caro"],
        maintainabilityModifier: 1.8, // Titânio é difícil de trabalhar
        radarSignatureModifier: 0.95,
        lifecycleCostMultiplier: 2.5,
        techLevelRequirement: 90,
        position: [0, 0, 0]
    },
    composite_structure: {
        name: "Estrutura de Compósitos",
        description: "Uso extensivo de materiais compósitos. Muito leve e ajuda a reduzir a assinatura de radar, mas é caro e menos resistente a dano bruto.",
        type: "structure_material",
        weight_modifier: 0.8, // 20% mais leve
        hp_modifier: 0.9, // 10% menos durável
        cost_modifier: 4.0, // 300% mais caro
        tech_level: 110,
        advantages: ["Muito leve", "Furtividade aumentada"],
        disadvantages: ["Muito caro", "Menos resistente"],
        maintainabilityModifier: 2.2, // Compósitos requerem reparos especializados
        radarSignatureModifier: 0.7, // Reduz a assinatura de radar em 30%
        lifecycleCostMultiplier: 3.0,
        techLevelRequirement: 110,
        position: [0, 0, 0]
    }
};