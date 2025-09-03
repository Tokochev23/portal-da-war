export const armor_materials = {
    mild_steel: {
        name: "Aço Comum",
        effectiveness_factor: 0.75,
        weight_factor: 1.0,
        cost_factor: 1.0,
        weldability: 0.95,
        availability: 1.0,
        tech_requirement: { year: 1939, level: 20 },
        spall_resistance: 0.6
    },
    rolled_homogeneous_armor: {
        name: "Aço Laminado Homogêneo (RHA)",
        effectiveness_factor: 1.0,
        weight_factor: 1.0,
        cost_factor: 1.4,
        weldability: 0.85,
        availability: 0.8,
        tech_requirement: { year: 1942, level: 50 },
        spall_resistance: 0.8
    },
    face_hardened_armor: {
        name: "Blindagem Endurecida Superficialmente",
        effectiveness_factor: 1.15,
        weight_factor: 1.05,
        cost_factor: 1.8,
        weldability: 0.70,
        availability: 0.6,
        tech_requirement: { year: 1944, level: 65 },
        spall_resistance: 0.85
    },
    cast_armor: {
        name: "Blindagem Fundida",
        effectiveness_factor: 0.90,
        weight_factor: 1.25,
        cost_factor: 1.2,
        weldability: 0.60,
        availability: 0.7,
        tech_requirement: { year: 1940, level: 45 },
        spall_resistance: 0.7,
        complex_shapes: true
    },
    composite_experimental: {
        name: "Blindagem Composta Experimental",
        effectiveness_factor: 1.35,
        weight_factor: 1.15,
        cost_factor: 3.5,
        weldability: 0.40,
        availability: 0.2,
        tech_requirement: { year: 1953, level: 85 },
        spall_resistance: 0.95,
        experimental: true,
        heat_resistance: 1.5
    }
};
