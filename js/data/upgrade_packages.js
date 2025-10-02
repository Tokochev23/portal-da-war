export const upgrade_packages = {
    avionics_upgrade_1: {
        id: "avionics_upgrade_1",
        name: "Modernização de Aviônicos (Padrão 1955)",
        description: "Substitui sistemas de radar e navegação antigos por modelos mais novos e capazes, melhorando a eficácia em combate.",
        cost: 75000, // Custo base de P&D para adaptar o pacote à fuselagem
        techLevelRequirement: 100,
        replaces: {
            // old_component_id: new_component_id
            "radar_aps_4": "radar_aps_21",
            "nav_rdf": "nav_vor"
        }
    },
    engine_upgrade_1: {
        id: "engine_upgrade_1",
        name: "Modernização de Propulsão (Padrão 1952)",
        description: "Substitui um motor a jato inicial por uma versão melhorada, com mais empuxo e maior eficiência.",
        cost: 120000, // Custo base de P&D para reengenharia do motor na fuselagem
        techLevelRequirement: 80,
        replaces: {
            "turbojet_early": "turbojet_improved"
        }
    }
};