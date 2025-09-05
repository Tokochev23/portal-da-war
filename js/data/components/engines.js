export const engines = {
  gasoline_i4_light: {
    name: "4 Cilindros Gasolina",
    category: "light",
    fuel_type: "gasoline",
    tech_requirement: { year: 1940, level: 25 },
    base: {
      power: 180,
      weight: 280,
      cost: 4500,
      consumption: 1.0,
      reliability: 0.92,
      maintenance_hours: 1.5,
      energy_output: 12
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -5,  weight: -15 },
      medium: { name_suffix: " (M)", power: +15, weight: +25 },
      heavy:  { name_suffix: " (H)", power: +35, weight: +60 }
    },
    optimal_chassis: ["mbt_light","wheeled_6x6","airtransportable"]
  },

  gasoline_v6_light: {
    name: "V6 Gasolina Leve",
    category: "light",
    fuel_type: "gasoline",
    tech_requirement: { year: 1940, level: 35 },
    base: {
      power: 320,
      weight: 480,
      cost: 8500,
      consumption: 1.2,
      reliability: 0.85,
      maintenance_hours: 2,
      fire_risk: 0.18,
      cold_start: 0.92,
      torque_curve: { low: 0.65, mid: 1, high: 0.85 },
      operational_temp: { min: -15, max: 45 },
      energy_output: 18
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -10, weight: -30 },
      medium: { name_suffix: " (M)", power: +20, weight: +40 },
      heavy:  { name_suffix: " (H)", power: +40, weight: +80 }
    }
  },

  diesel_i4_light: {
    name: "I4 Diesel Leve",
    category: "light",
    fuel_type: "diesel",
    tech_requirement: { year: 1941, level: 40 },
    base: {
      power: 280,
      weight: 420,
      cost: 9500,
      consumption: 0.8,
      reliability: 0.88,
      maintenance_hours: 1.6,
      fire_risk: 0.08,
      cold_start: 0.72,
      torque_curve: { low: 1.25, mid: 1, high: 0.65 },
      energy_output: 16
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -10, weight: -20 },
      medium: { name_suffix: " (M)", power: +20, weight: +35 },
      heavy:  { name_suffix: " (H)", power: +45, weight: +70 }
    },
    optimal_chassis: ["mbt_light","wheeled_6x6","airtransportable"]
  },

  gasoline_v8_medium: {
    name: "V8 Gasolina Médio",
    category: "medium",
    fuel_type: "gasoline",
    tech_requirement: { year: 1942, level: 42 },
    base: {
      power: 450,
      weight: 650,
      cost: 12000,
      consumption: 1.35,
      reliability: 0.82,
      maintenance_hours: 2.2,
      fire_risk: 0.16,
      cold_start: 0.94,
      torque_curve: { low: 0.72, mid: 1, high: 0.88 },
      energy_output: 24
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -60, weight: -90 },
      medium: { name_suffix: " (M)", power: 0,   weight: 0   },
      heavy:  { name_suffix: " (H)", power: +70, weight: +110 }
    },
    optimal_chassis: ["mbt_medium","tracked_medium","wheeled_8x8"]
  },

  diesel_v6_medium: {
    name: "V6 Diesel Médio",
    category: "medium",
    fuel_type: "diesel",
    tech_requirement: { year: 1943, level: 45 },
    base: {
      power: 520,
      weight: 720,
      cost: 15000,
      consumption: 1.1,
      reliability: 0.86,
      maintenance_hours: 2,
      fire_risk: 0.07,
      cold_start: 0.75,
      torque_curve: { low: 1.2, mid: 1, high: 0.7 },
      energy_output: 28
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -80, weight: -100 },
      medium: { name_suffix: " (M)", power: 0,    weight: 0    },
      heavy:  { name_suffix: " (H)", power: +90,  weight: +140 }
    },
    optimal_chassis: ["mbt_medium","tracked_medium","amphibious_tracked"]
  },

  gasoline_v8_supercharged: {
    name: "V8 Gasolina Supercharger",
    category: "heavy",
    fuel_type: "gasoline",
    tech_requirement: { year: 1944, level: 58 },
    base: {
      power: 750,
      weight: 890,
      cost: 22000,
      consumption: 1.8,
      reliability: 0.78,
      maintenance_hours: 3.2,
      fire_risk: 0.22,
      cold_start: 0.85,
      torque_curve: { low: 0.85, mid: 1, high: 0.95 },
      energy_output: 45
    },
    tuning: {
      light:  { name_suffix: " (lim.)", power: -150, weight: -180, reliability: 0.03 },
      medium: { name_suffix: " (M)",     power: -60,  weight: -80  },
      heavy:  { name_suffix: " (H)",     power: 0,    weight: 0    }
    },
    optimal_chassis: ["mbt_heavy","mbt_super_heavy","tracked_heavy"]
  },

  gasoline_v12_contextual: {
    name: "V12 Gasolina (Ajustável)",
    category: "medium",
    fuel_type: "gasoline",
    tech_requirement: { year: 1946, level: 65 },
    base: {
      power: 800,
      weight: 1100,
      cost: 30000,
      consumption: 1.9,
      reliability: 0.80,
      maintenance_hours: 4,
      energy_output: 50,
      fire_risk: 0.2,
      cold_start: 0.88,
      torque_curve: { low: 0.78, mid: 1, high: 0.92 }
    },
    tuning: {
      light:  { name_suffix: " (Leve)",   power: -150, weight: -250, cost: -4000, consumption: -0.4, reliability:  0.05 },
      medium: { name_suffix: " (Médio)",  power:  -50, weight: -100, cost: -2000, consumption: -0.2, reliability:  0.02 },
      heavy:  { name_suffix: " (Pesado)", power:  150, weight:  180, cost:  5000, consumption:  0.2, reliability: -0.05 }
    }
  },

  diesel_v8_heavy: {
    name: "V8 Diesel Pesado",
    category: "heavy",
    fuel_type: "diesel",
    tech_requirement: { year: 1945, level: 55 },
    base: {
      power: 820,
      weight: 1050,
      cost: 28000,
      consumption: 1.4,
      reliability: 0.82,
      maintenance_hours: 2.8,
      fire_risk: 0.08,
      cold_start: 0.68,
      torque_curve: { low: 1.35, mid: 1, high: 0.65 },
      energy_output: 54
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -160, weight: -180 },
      medium: { name_suffix: " (M)", power:  -60, weight:  -80 },
      heavy:  { name_suffix: " (H)", power:    0, weight:    0 }
    },
    optimal_chassis: ["mbt_heavy","mbt_super_heavy","spg_chassis"]
  },

  diesel_v12_superheavy: {
    name: "V12 Diesel Super Pesado",
    category: "super_heavy",
    fuel_type: "diesel",
    tech_requirement: { year: 1948, level: 72 },
    base: {
      power: 1200,
      weight: 1650,
      cost: 48000,
      consumption: 1.8,
      reliability: 0.78,
      maintenance_hours: 3.5,
      fire_risk: 0.09,
      cold_start: 0.65,
      torque_curve: { low: 1.4, mid: 1, high: 0.6 },
      energy_output: 79
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -250, weight: -250 },
      medium: { name_suffix: " (M)", power: -120, weight: -140 },
      heavy:  { name_suffix: " (H)", power:    0, weight:    0 }
    },
    optimal_chassis: ["mbt_super_heavy","tracked_heavy"]
  },

  gasoline_v16_experimental: {
    name: "V16 Gasolina Experimental",
    category: "super_heavy",
    fuel_type: "gasoline",
    tech_requirement: { year: 1952, level: 85 },
    base: {
      power: 1450,
      weight: 1950,
      cost: 65000,
      consumption: 2.8,
      reliability: 0.72,
      maintenance_hours: 5,
      fire_risk: 0.25,
      cold_start: 0.82,
      torque_curve: { low: 0.88, mid: 1, high: 0.98 },
      energy_output: 87
    },
    tuning: {
      light:  { name_suffix: " (L)", power: -300, weight: -300 },
      medium: { name_suffix: " (M)", power: -150, weight: -160 },
      heavy:  { name_suffix: " (H)", power:    0, weight:    0 }
    },
    optimal_chassis: ["modular_experimental"],
    experimental: true
  }
};
