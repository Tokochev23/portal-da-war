export const communication = {
    signal_flags: {
        name: "Bandeiras de Sinalização",
        weight: 5,
        cost: 100,
        range: 2, // km
        reliability: 0.95,
        weather_resistance: 0.3,
        tech_requirement: { year: 1900, level: 10 },
        requires_training: false
    },
    
    radio_basic: {
        name: "Rádio Básico",
        weight: 25,
        cost: 2500,
        range: 5,
        reliability: 0.80,
        weather_resistance: 0.7,
        tech_requirement: { year: 1940, level: 35 },
        power_consumption: 50,
        frequency_bands: 1
    },
    
    radio_advanced: {
        name: "Rádio Avançado",
        weight: 35,
        cost: 5000,
        range: 15,
        reliability: 0.85,
        weather_resistance: 0.8,
        tech_requirement: { year: 1944, level: 50 },
        power_consumption: 80,
        frequency_bands: 3,
        encryption_capable: false
    },
    
    radio_fm: {
        name: "Rádio FM Militar",
        weight: 45,
        cost: 8500,
        range: 25,
        reliability: 0.90,
        weather_resistance: 0.9,
        tech_requirement: { year: 1948, level: 65 },
        power_consumption: 120,
        frequency_bands: 10,
        encryption_capable: true
    },
    
    radio_command: {
        name: "Estação de Comando",
        weight: 80,
        cost: 15000,
        range: 50,
        reliability: 0.87,
        weather_resistance: 0.85,
        tech_requirement: { year: 1945, level: 60 },
        power_consumption: 200,
        frequency_bands: 5,
        encryption_capable: true,
        command_bonus: 2,
        special: "artillery_coordination"
    }
};
