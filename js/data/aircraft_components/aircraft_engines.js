export const aircraft_engines = {
    turbojet_early: {
        name: "Turbojato de Primeira Geração",
        type: "turbojet_early",
        thrust: 2500, // kgf
        weight: 800, // kg
        fuel_consumption: 1.0, // units per second at full thrust
        reliability: 0.85,
    },
    afterburning_turbojet_early: {
        name: "Turbojato com Pós-combustor (Inicial)",
        type: "afterburning_turbojet_early",
        military_thrust: 3200, // kgf (sem pós-combustão)
        afterburner_thrust: 4800, // kgf (com pós-combustão)
        weight: 1200, // kg
        fuel_consumption: 0.9, // base
        afterburner_fuel_consumption: 3.5, // massive consumption
        reliability: 0.78, // afterburners were unreliable
    }
};
