export const optics_systems = {
    basic_periscope: {

        name: "Periscópio Básico",
        weight: 15,
        cost: 800,
        magnification: "1x",
        field_of_view: 60, // degrees
        accuracy_bonus: 0.00,
        range_estimation: 0.00,
        tech_requirement: { year: 1935, level: 25 },
        night_vision: false,
        reliability: 0.95
    ,
        energy_consumption: 1 // kW - Power required
    },
    
    telescopic_sight: {

        name: "Mira Telescópica 4x",
        weight: 35,
        cost: 2500,
        magnification: "4x",
        field_of_view: 15,
        accuracy_bonus: 0.15,
        range_estimation: 0.10,
        tech_requirement: { year: 1940, level: 40 },
        night_vision: false,
        reliability: 0.90
    ,
        energy_consumption: 1 // kW - Power required
    },
    
    coincidence_rangefinder: {

        name: "Telêmetro de Coincidência",
        weight: 85,
        cost: 8000,
        magnification: "8x",
        field_of_view: 8,
        accuracy_bonus: 0.25,
        range_estimation: 0.30,
        max_range: 3000, // meters
        tech_requirement: { year: 1942, level: 55 },
        night_vision: false,
        reliability: 0.85,
        requires_training: true
    ,
        energy_consumption: 1 // kW - Power required
    },
    
    stereoscopic_rangefinder: {

        name: "Telêmetro Estereoscópico",
        weight: 120,
        cost: 15000,
        magnification: "10x",
        field_of_view: 6,
        accuracy_bonus: 0.30,
        range_estimation: 0.45,
        max_range: 4000,
        tech_requirement: { year: 1945, level: 65 },
        night_vision: false,
        reliability: 0.82,
        requires_training: true
    ,
        energy_consumption: 1 // kW - Power required
    },
    
    // INFRARED SYSTEMS
    infrared_sight_basic: {

        name: "Mira Infravermelha Básica",
        weight: 150,
        cost: 25000,
        magnification: "3x",
        field_of_view: 20,
        accuracy_bonus: 0.10,
        range_estimation: 0.05,
        effective_range: 800,
        tech_requirement: { year: 1943, level: 70 },
        night_vision: true,
        reliability: 0.75,
        power_consumption: 800, // watts
        operational_time: 4 // hours per battery
    ,
        energy_consumption: 4 // kW - Power required
    },
    
    infrared_sight_advanced: {

        name: "Sistema IV Avançado",
        weight: 200,
        cost: 45000,
        magnification: "6x",
        field_of_view: 12,
        accuracy_bonus: 0.20,
        range_estimation: 0.15,
        effective_range: 1200,
        tech_requirement: { year: 1950, level: 80 },
        night_vision: true,
        reliability: 0.78,
        power_consumption: 1200,
        operational_time: 6,
        experimental: true
    ,
        energy_consumption: 4 // kW - Power required
    },
};
