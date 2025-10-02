export const special_equipment = {
    "extra_fuel_tank": {
        name: "Tanque de Combustível Extra Interno",
        description: "Um tanque de combustível adicional instalado dentro da fuselagem, não ejetável.",
        weight: 150, // kg
        cost: 5000, // $
        range_modifier: 0.2, // +20% range
        tech_level: 1945,
        maintainabilityModifier: 1.05,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.0,
        techLevelRequirement: 25,
        position: [0, 0, 0]
    },
    "recon_camera_internal": {
        name: "Câmera de Reconhecimento Interna",
        description: "Uma câmera para missões de reconhecimento instalada internamente, sem a necessidade de um pod.",
        weight: 100, // kg
        cost: 15000, // $
        drag_penalty: 0, 
        tech_level: 1950,
        maintainabilityModifier: 1.3,
        radarSignatureModifier: 0.01, // Abertura da câmera
        lifecycleCostMultiplier: 1.4,
        techLevelRequirement: 60,
        position: [0, 0, 0]
    },
    "reinforced_structure": {
        name: "Estrutura Reforçada para Gs Elevados",
        description: "Reforços estruturais que permitem à aeronave suportar manobras com mais Gs.",
        weight: 200, // kg
        cost: 25000, // $
        g_limit_modifier: 1.5, // Adiciona 1.5G ao limite
        tech_level: 1952,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 65,
        position: [0, 0, 0]
    },
    "vtol_engine_core_modification": {
        name: "Modificação Central para VTOL",
        description: "Modificação interna no motor e dutos para permitir decolagem e pouso vertical. Adiciona muito peso e complexidade.",
        weight: 500, // kg
        cost: 80000, // $
        thrust_modifier: -0.1, // Reduces effective forward thrust
        tech_level: 1955,
        maintainabilityModifier: 2.5,
        radarSignatureModifier: 0.2,
        lifecycleCostMultiplier: 2.8,
        techLevelRequirement: 120, // Tecnologia muito avançada
        position: [0, 0, 0]
    },
    "chaff_dispenser": {
        name: "Dispensador de Chaff",
        description: "Lança nuvens de partículas metálicas para confundir mísseis guiados por radar.",
        type: "countermeasure",
        weight: 25, // kg
        cost: 18000,
        capacity: 30, // 30 usos
        effectiveness: 0.5, // 50% de chance base de enganar um míssil de radar
        tech_level: 80,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0.01,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 80,
        position: [0.8, 0, 0.1] // Na cauda
    },
    "flare_dispenser": {
        name: "Dispensador de Flares",
        description: "Lança iscas de calor para confundir mísseis guiados por infravermelho.",
        type: "countermeasure",
        weight: 25, // kg
        cost: 18000,
        capacity: 30, // 30 usos
        effectiveness: 0.6, // 60% de chance base de enganar um míssil de calor
        tech_level: 85,
        maintainabilityModifier: 1.2,
        radarSignatureModifier: 0.01,
        lifecycleCostMultiplier: 1.2,
        techLevelRequirement: 85,
        position: [0.8, 0.1, 0.1] // Na cauda
    }
};