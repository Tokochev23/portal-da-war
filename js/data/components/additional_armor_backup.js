export const additional_armor = {
    sandbags: {
        name: "Sacos de Areia",
        protection_bonus: 15,
        weight: 500,
        cost: 200,
        coverage: "Frontal",
        tech_requirement: { year: 1939, level: 0 },
        description: "Proteção barata e improvisada, muito pesada"
    },
    concrete_blocks: {
        name: "Blocos de Concreto",
        protection_bonus: 25,
        weight: 800,
        cost: 300,
        coverage: "Frontal",
        tech_requirement: { year: 1940, level: 10 },
        description: "Proteção sólida mas extremamente pesada"
    },
    spare_tracks: {
        name: "Esteiras Sobressalentes",
        protection_bonus: 12,
        weight: 200,
        cost: 150,
        coverage: "Frontal/Lateral",
        tech_requirement: { year: 1942, level: 20 },
        description: "Proteção leve usando peças sobressalentes"
    },
    add_on_armor: {
        name: "Blindagem Adicional",
        protection_bonus: 30,
        weight: 600,
        cost: 2500,
        coverage: "Frontal",
        tech_requirement: { year: 1943, level: 45 },
        description: "Placas de blindagem soldadas ou aparafusadas"
    },
    cage_armor: {
        name: "Blindagem Gaiola",
        protection_bonus: 8,
        weight: 120,
        cost: 800,
        coverage: "Traseira/Lateral",
        tech_requirement: { year: 1944, level: 35 },
        anti_heat: true,
        description: "Proteção contra granadas de forma (HEAT)"
    },
    era_primitive: {
        name: "ERA Primitiva",
        protection_bonus: 40,
        weight: 300,
        cost: 5000,
        coverage: "Frontal",
        tech_requirement: { year: 1954, level: 80 },
        experimental: true,
        anti_heat: true,
        description: "Blindagem reativa explosiva experimental"
    },
    wood_logs: {
        name: "Toras de Madeira",
        protection_bonus: 8,
        weight: 300,
        cost: 50,
        coverage: "Lateral",
        tech_requirement: { year: 1941, level: 0 },
        description: "Proteção improvisada muito barata"
    },
    fuel_drums: {
        name: "Tambores Externos",
        protection_bonus: 5,
        weight: 150,
        cost: 100,
        coverage: "Traseira",
        tech_requirement: { year: 1940, level: 0 },
        fire_risk: 0.15,
        description: "Proteção mínima mas aumenta risco de incêndio"
    }
};
