export const airframes = {
    subsonic_fighter_frame: {
        name: "Fuselagem de Caça Sub-sônico",
        base_weight: 4000, // kg
        max_takeoff_weight: 8000, // kg
        max_speed_kph: 1100,
        g_limit: 7,
        hardpoints: 4,
        compatible_engine_types: ["turbojet_early"],
        tech_level: 50,
    },
    supersonic_gen1_frame: {
        name: "Fuselagem Supersônica de 1ª Geração",
        base_weight: 5500, // kg
        max_takeoff_weight: 11000, // kg
        max_speed_kph: 1450, // ~Mach 1.3
        g_limit: 6.5,
        hardpoints: 4,
        compatible_engine_types: ["afterburning_turbojet_early"],
        tech_level: 65,
    }
};
