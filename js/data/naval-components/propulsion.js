// js/data/naval-components/propulsion.js - Naval Propulsion Systems for 1954

export const propulsion_systems = {
  // SMALL VESSEL PROPULSION - Para corvetas e navios menores
  "diesel_engines_compact": {
    name: "Motores Diesel Compactos",
    type: "diesel",
    power_hp: 8000,
    fuel_consumption: 45, // gallons per hour
    weight: 85, // tons
    cost: 8500000, // $8.5M
    reliability: 0.95,
    tech_level: 25,
    year_introduced: 1940,
    description: "Motores diesel confiáveis para navios pequenos e médios",
    advantages: ["Muito confiável", "Baixo consumo", "Start rápido", "Manutenção simples"],
    disadvantages: ["Potência limitada", "Velocidade menor", "Vibração"],
    suitable_hulls: ["corvette", "escort", "frigate"]
  },

  "diesel_engines_twin": {
    name: "Motores Diesel Gêmeos",
    type: "diesel",
    power_hp: 15000,
    fuel_consumption: 80,
    weight: 140,
    cost: 14000000, // $14M
    reliability: 0.92,
    tech_level: 30,
    year_introduced: 1943,
    description: "Sistema duplo de motores diesel para maior potência",
    advantages: ["Boa potência", "Redundância", "Eficiente", "Confiável"],
    disadvantages: ["Mais pesado", "Espaço duplo", "Custo maior"],
    suitable_hulls: ["corvette", "escort", "frigate", "destroyer"]
  },

  "steam_turbine_light": {
    name: "Turbinas Leves",
    type: "steam_turbine",
    power_hp: 25000,
    fuel_consumption: 180,
    weight: 220,
    cost: 35000000, // $35M
    reliability: 0.88,
    tech_level: 35,
    year_introduced: 1942,
    description: "Turbinas a vapor compactas para navios de escolta",
    advantages: ["Boa velocidade", "Potência adequada", "Tecnologia conhecida"],
    disadvantages: ["Tempo aquecimento", "Consumo moderado", "Complexidade"],
    suitable_hulls: ["escort", "frigate", "destroyer"]
  },

  // STEAM TURBINES - Standard naval propulsion
  "steam_turbine_standard": {
    name: "Turbinas a Vapor Convencionais",
    type: "steam_turbine",
    power_hp: 60000,
    fuel_consumption: 350, // gallons per hour at full power
    weight: 450, // tons
    cost: 80000000, // $80M
    reliability: 0.90,
    tech_level: 35,
    year_introduced: 1940,
    description: "Turbinas a vapor padrão com caldeiras convencionais",
    advantages: ["Tecnologia comprovada", "Manutenção conhecida", "Confiável"],
    disadvantages: ["Alto consumo", "Tempo de aquecimento", "Peso elevado"],
    suitable_hulls: ["destroyer", "cruiser", "battleship", "carrier"]
  },

  "steam_turbine_high_pressure": {
    name: "Turbinas a Vapor de Alta Pressão",
    type: "steam_turbine",
    power_hp: 80000,
    fuel_consumption: 320,
    weight: 420,
    cost: 120000000, // $120M
    reliability: 0.88,
    tech_level: 45,
    year_introduced: 1945,
    description: "Turbinas com caldeiras de alta pressão para maior eficiência",
    advantages: ["Maior potência", "Melhor eficiência", "Menor peso"],
    disadvantages: ["Mais complexa", "Manutenção especializada", "Custo elevado"],
    suitable_hulls: ["destroyer", "cruiser", "battleship", "carrier"]
  },

  "steam_turbine_reheat": {
    name: "Turbinas com Reaquecimento",
    type: "steam_turbine",
    power_hp: 100000,
    fuel_consumption: 300,
    weight: 480,
    cost: 150000000, // $150M
    reliability: 0.85,
    tech_level: 55,
    year_introduced: 1950,
    description: "Sistema avançado com reaquecimento do vapor para máxima eficiência",
    advantages: ["Máxima potência", "Excelente eficiência", "Performance superior"],
    disadvantages: ["Muito complexa", "Manutenção intensiva", "Muito cara"],
    suitable_hulls: ["cruiser", "battleship", "carrier"]
  },

  // DIESEL ENGINES - Efficient for smaller vessels
  "diesel_standard": {
    name: "Motores Diesel Marinhos",
    type: "diesel",
    power_hp: 3000,
    fuel_consumption: 45,
    weight: 85,
    cost: 1200000,
    reliability: 0.95,
    tech_level: 30,
    year_introduced: 1935,
    description: "Motores diesel confiáveis para embarcações menores",
    advantages: ["Muito confiável", "Econômico", "Fácil manutenção"],
    disadvantages: ["Baixa potência", "Limitado a navios pequenos", "Ruído"],
    suitable_hulls: ["frigate", "patrol_boat", "auxiliary"]
  },

  "diesel_high_speed": {
    name: "Diesel de Alta Velocidade",
    type: "diesel",
    power_hp: 8000,
    fuel_consumption: 95,
    weight: 120,
    cost: 2800000,
    reliability: 0.92,
    tech_level: 45,
    year_introduced: 1948,
    description: "Diesel modernos para destroyers e fragatas",
    advantages: ["Boa potência", "Eficiente", "Resposta rápida"],
    disadvantages: ["Custo moderado", "Manutenção regular", "Limitações de tamanho"],
    suitable_hulls: ["destroyer", "frigate", "escort"]
  },

  // DIESEL-ELECTRIC - Submarines and some surface ships
  "diesel_electric_submarine": {
    name: "Diesel-Elétrico Submarino",
    type: "diesel_electric",
    power_hp: 4800, // surface
    power_hp_submerged: 2400,
    battery_capacity: 252, // cells
    weight: 180,
    cost: 35000000, // $35M
    reliability: 0.88,
    tech_level: 40,
    year_introduced: 1942,
    description: "Sistema diesel-elétrico padrão para submarinos",
    advantages: ["Operação silenciosa submersa", "Flexibilidade", "Proven design"],
    disadvantages: ["Complexidade", "Peso das baterias", "Tempo de recarga"],
    suitable_hulls: ["submarine"]
  },

  "diesel_electric_advanced": {
    name: "Diesel-Elétrico Avançado",
    type: "diesel_electric",
    power_hp: 6500,
    power_hp_submerged: 4200,
    battery_capacity: 372,
    weight: 220,
    cost: 5200000,
    reliability: 0.90,
    tech_level: 52,
    year_introduced: 1951,
    description: "Sistema moderno com baterias melhoradas",
    advantages: ["Melhor performance submersa", "Baterias duradouras", "Mais silencioso"],
    disadvantages: ["Muito caro", "Complexo", "Manutenção especializada"],
    suitable_hulls: ["submarine", "research_vessel"]
  },

  // NUCLEAR PROPULSION - Revolutionary but experimental
  "nuclear_pressurized_water": {
    name: "Reator Nuclear PWR",
    type: "nuclear",
    power_hp: 15000,
    fuel_consumption: 0.1, // virtually unlimited range
    weight: 800, // includes shielding
    cost: 450000000, // $450M - nuclear
    reliability: 0.85,
    tech_level: 75,
    year_introduced: 1955,
    description: "Reator nuclear de água pressurizada - tecnologia revolucionária",
    advantages: ["Alcance ilimitado", "Não precisa de ar", "Alta potência constante"],
    disadvantages: ["Extremamente caro", "Complexo", "Riscos radiológicos"],
    suitable_hulls: ["submarine", "carrier"]
  },

  // GAS TURBINES - Experimental for 1954
  "gas_turbine_experimental": {
    name: "Turbina a Gás (Experimental)",
    type: "gas_turbine",
    power_hp: 25000,
    fuel_consumption: 420,
    weight: 180,
    cost: 18000000,
    reliability: 0.75,
    tech_level: 65,
    year_introduced: 1954,
    description: "Turbina a gás experimental derivada da aviação",
    advantages: ["Muito leve", "Resposta rápida", "Compacta"],
    disadvantages: ["Não testada", "Alto consumo", "Manutenção cara"],
    suitable_hulls: ["destroyer", "frigate", "fast_attack"]
  },

  // COMBINED SYSTEMS
  "combined_diesel_gas": {
    name: "CODAG (Diesel + Turbina a Gás)",
    type: "combined",
    power_hp_cruise: 8000, // diesel for cruising
    power_hp_sprint: 28000, // gas turbine for high speed
    fuel_consumption_cruise: 95,
    fuel_consumption_sprint: 450,
    weight: 280,
    cost: 22000000,
    reliability: 0.82,
    tech_level: 70,
    year_introduced: 1955,
    description: "Sistema combinado experimental para máxima eficiência",
    advantages: ["Eficiente em cruzeiro", "Alta velocidade disponível", "Flexível"],
    disadvantages: ["Muito complexo", "Caro", "Duas plantas diferentes"],
    suitable_hulls: ["destroyer", "frigate"]
  }
};

export const boilers = {
  "watertube_standard": {
    name: "Caldeira Tubos d'Água Padrão",
    type: "watertube",
    pressure_psi: 465,
    temperature_f: 750,
    efficiency: 0.85,
    weight: 120, // tons each
    cost: 800000,
    reliability: 0.92,
    tech_level: 30,
    year_introduced: 1935,
    description: "Caldeira padrão da marinha com boa confiabilidade",
    maintenance_hours: 120 // per month
  },

  "watertube_superheat": {
    name: "Caldeira Superaquecida",
    type: "watertube_superheat", 
    pressure_psi: 615,
    temperature_f: 875,
    efficiency: 0.90,
    weight: 135,
    cost: 1200000,
    reliability: 0.88,
    tech_level: 45,
    year_introduced: 1945,
    description: "Caldeira com superaquecimento para maior eficiência",
    maintenance_hours: 140
  },

  "watertube_high_pressure": {
    name: "Caldeira Alta Pressão",
    type: "watertube_hp",
    pressure_psi: 850,
    temperature_f: 950,
    efficiency: 0.93,
    weight: 145,
    cost: 1800000,
    reliability: 0.85,
    tech_level: 55,
    year_introduced: 1950,
    description: "Caldeira de alta pressão para máximo desempenho",
    maintenance_hours: 160
  }
};

export const auxiliary_systems = {
  "electrical_turbo_generator": {
    name: "Turbo-Gerador Elétrico",
    power_output_kw: 1000,
    weight: 45,
    cost: 450000,
    reliability: 0.90,
    description: "Gerador principal para sistemas elétricos do navio"
  },

  "emergency_diesel_generator": {
    name: "Gerador Diesel de Emergência",
    power_output_kw: 200,
    weight: 8,
    cost: 120000,
    reliability: 0.95,
    description: "Gerador de backup para emergências"
  },

  "air_conditioning_plant": {
    name: "Sistema de Ar Condicionado",
    cooling_capacity_tons: 150,
    power_consumption_kw: 180,
    weight: 25,
    cost: 380000,
    description: "Sistema de climatização para áreas habitáveis"
  },

  "freshwater_evaporators": {
    name: "Evaporadores de Água Doce",
    production_gallons_day: 20000,
    power_consumption_kw: 85,
    weight: 18,
    cost: 240000,
    description: "Sistema de produção de água potável"
  }
};

export default { propulsion_systems, boilers, auxiliary_systems };