export const special_equipment = {
    "extra_fuel_tank": {
        name: "Tanque de Combustível Extra",
        description: "Aumenta o alcance da aeronave.",
        weight: 150, // kg
        cost: 5000, // $
        range_modifier: 0.2, // +20% range
        tech_level: 1945
    },
    "recon_pod": {
        name: "Pod de Reconhecimento",
        description: "Equipamento para missões de reconhecimento.",
        weight: 100, // kg
        cost: 15000, // $
        drag_penalty: 0.002, // Increases drag
        tech_level: 1950
    },
    "ecm_pod": {
        name: "Pod de Contramedidas Eletrônicas (ECM)",
        description: "Dificulta a detecção por radar inimigo.",
        weight: 80, // kg
        cost: 25000, // $
        drag_penalty: 0.001,
        tech_level: 1952
    },
    "vtol_kit": {
        name: "Kit VTOL (Decolagem/Pouso Vertical)",
        description: "Permite decolagem e pouso vertical, mas adiciona peso e complexidade.",
        weight: 500, // kg
        cost: 80000, // $
        thrust_modifier: -0.1, // Reduces effective thrust
        tech_level: 1955
    }
};