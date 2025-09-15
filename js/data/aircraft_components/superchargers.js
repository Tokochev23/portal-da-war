export const superchargers = {
    none: {
        name: "Nenhum (Aspiração Natural)",
        description: "O motor não possui superalimentação. Perde potência significativamente com o aumento da altitude.",
        cost: 0,
        weight: 0,
        rated_altitude_m: 0, // Altitude nominal em metros
        reliability_mod: 1.0,
        tech_level: 10
    },
    single_stage: {
        name: "Mecânico - 1 Estágio",
        description: "Um supercharger de estágio único, acionado mecanicamente pelo motor. Melhora a performance em altitudes médias.",
        cost: 15000,
        weight: 50,
        rated_altitude_m: 4000, 
        reliability_mod: 0.97,
        tech_level: 30
    },
    two_stage: {
        name: "Mecânico - 2 Estágios",
        description: "Dois estágios de compressão para excelente performance em altas altitudes. Mais pesado e complexo.",
        cost: 28000,
        weight: 90,
        rated_altitude_m: 7500,
        reliability_mod: 0.94,
        tech_level: 50
    },
    turbo: {
        name: "Turboalimentador",
        description: "Usa os gases de escape para acionar o compressor. Performance superior em altitudes muito elevadas, mas sofre de 'turbo lag'.",
        cost: 40000,
        weight: 120,
        rated_altitude_m: 9000,
        reliability_mod: 0.90, // Mais complexo e quente
        tech_level: 65
    }
};