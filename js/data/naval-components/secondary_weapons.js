// js/data/naval-components/secondary_weapons.js - Secondary Weapons for Naval Ships 1954

export const aa_guns = {
  // LIGHT AA GUNS (20-40mm)
  "aa_20mm_oerlikon": {
    name: "Canhão AA 20mm Oerlikon",
    caliber: 20,
    type: "light_aa",
    rate_of_fire: 450, // rounds per minute
    max_range_yards: 4800,
    effective_range_aa: 1500,
    weight_tons: 0.68,
    crew: 2,
    cost: 45000,
    year_introduced: 1940,
    tech_level: 35,
    description: "Canhão AA leve padrão para defesa próxima contra aeronaves",
    mount_types: ["single", "twin"],
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier", "escort"],
    ammunition_capacity: 1000,
    traverse_speed: "high",
    advantages: ["Alta cadência", "Compacto", "Confiável"],
    disadvantages: ["Curto alcance", "Calibre pequeno", "Vulnerável"]
  },

  "aa_40mm_bofors": {
    name: "Canhão AA 40mm Bofors",
    caliber: 40,
    type: "medium_aa",
    rate_of_fire: 160,
    max_range_yards: 10500,
    effective_range_aa: 3500,
    weight_tons: 2.4,
    crew: 4,
    cost: 125000,
    year_introduced: 1936,
    tech_level: 30,
    description: "Canhão AA médio versátil, padrão das marinhas aliadas",
    mount_types: ["single", "twin", "quad"],
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    ammunition_capacity: 400,
    traverse_speed: "high",
    advantages: ["Excelente alcance", "Boa potência", "Versátil"],
    disadvantages: ["Pesado", "Complexo", "Caro"]
  },

  // DUAL PURPOSE GUNS (3-5 inch)
  "dp_76mm_50cal": {
    name: "Canhão DP 76mm/50",
    caliber: 76.2,
    type: "dual_purpose",
    rate_of_fire: 45,
    max_range_yards: 14500,
    max_range_aa: 8000,
    weight_tons: 6.8,
    crew: 7,
    cost: 420000,
    year_introduced: 1940,
    tech_level: 40,
    description: "Canhão dual-purpose compacto para destroyers e escorts",
    mount_types: ["single"],
    suitable_ships: ["destroyer", "escort", "frigate"],
    ammunition_types: ["HE", "AA", "AP"],
    fire_control_compatible: true,
    advantages: ["Dual-purpose", "Compacto", "Rápido"],
    disadvantages: ["Alcance limitado", "Peso moderado", "Manual"]
  },

  "dp_127mm_38cal": {
    name: "Canhão DP 127mm/38",
    caliber: 127,
    type: "dual_purpose", 
    rate_of_fire: 22,
    max_range_yards: 18200,
    max_range_aa: 11000,
    weight_tons: 156.7, // complete twin mount
    crew: 27,
    cost: 850000,
    year_introduced: 1935,
    tech_level: 35,
    description: "Canhão dual-purpose padrão - excelente para AA e superfície",
    mount_types: ["single", "twin"],
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    ammunition_types: ["HE", "AA", "AP", "VT"],
    fire_control_compatible: true,
    advantages: ["Excelente versatilidade", "Comprovado", "VT ammo"],
    disadvantages: ["Pesado", "Complexo", "Caro"]
  },

  // ADVANCED AA SYSTEMS (1950s)
  "aa_76mm_auto": {
    name: "Canhão AA 76mm Automático",
    caliber: 76.2,
    type: "automatic_aa",
    rate_of_fire: 85,
    max_range_yards: 16000,
    effective_range_aa: 9000,
    weight_tons: 34.5,
    crew: 4, // automated systems
    cost: 1200000,
    year_introduced: 1953,
    tech_level: 60,
    description: "Canhão AA automático avançado com carregamento automático",
    mount_types: ["single", "twin"],
    suitable_ships: ["destroyer", "cruiser", "carrier"],
    ammunition_types: ["HE", "AA", "VT", "Prox"],
    fire_control_required: true,
    radar_guided: true,
    advantages: ["Totalmente automático", "Alta precisão", "Moderno"],
    disadvantages: ["Muito caro", "Complexo", "Dependente de energia"]
  }
};

export const torpedo_tubes = {
  "torpedo_533mm_standard": {
    name: "Tubo de Torpedo 533mm Padrão",
    caliber: 533,
    type: "torpedo_launcher",
    tubes_per_mount: 1,
    weight_tons: 3.2,
    cost: 180000,
    year_introduced: 1930,
    tech_level: 25,
    description: "Tubo de torpedo padrão para destroyers e cruzadores",
    suitable_ships: ["destroyer", "cruiser", "submarine"],
    torpedo_types: ["Mark 15", "Mark 16", "Acoustic"],
    reload_time_minutes: 8,
    training_arc: 270, // degrees
    advantages: ["Comprovado", "Confiável", "Versátil"],
    disadvantages: ["Manual", "Lento reload", "Vulnerável"]
  },

  "torpedo_533mm_quintuple": {
    name: "Montagem Quíntupla 533mm",
    caliber: 533,
    type: "torpedo_launcher",
    tubes_per_mount: 5,
    weight_tons: 16.8,
    cost: 750000,
    year_introduced: 1934,
    tech_level: 35,
    description: "Montagem quíntupla para máxima potência de fogo",
    suitable_ships: ["destroyer", "light_cruiser"],
    torpedo_types: ["Mark 15", "Mark 16", "Long Lance"],
    reload_time_minutes: 12,
    training_arc: 270,
    advantages: ["Alta potência de fogo", "Salva devastadora", "Eficaz"],
    disadvantages: ["Muito pesado", "Vulnerável", "Caro"]
  },

  "torpedo_acoustic_homing": {
    name: "Torpedo Acústico Homing",
    caliber: 533,
    type: "acoustic_torpedo",
    guidance: "acoustic_homing",
    range_yards: 8000,
    speed_knots: 24,
    warhead_kg: 270,
    cost_per_torpedo: 85000,
    year_introduced: 1950,
    tech_level: 55,
    description: "Torpedo com guiamento acústico para ASW",
    suitable_ships: ["destroyer", "frigate", "submarine"],
    homing_range: 1500,
    reliability: 0.78,
    advantages: ["Guiamento autônomo", "Eficaz ASW", "Moderno"],
    disadvantages: ["Experimental", "Caro", "Velocidade baixa"]
  }
};

export const depth_charges = {
  "depth_charge_mk6": {
    name: "Cargas de Profundidade Mk 6",
    type: "depth_charge",
    warhead_kg: 136,
    max_depth: 180,
    weight_per_charge: 196,
    launcher_weight_tons: 2.1,
    capacity: 24,
    cost: 28000,
    year_introduced: 1940,
    tech_level: 30,
    description: "Cargas de profundidade padrão para guerra ASW",
    suitable_ships: ["destroyer", "escort", "frigate"],
    launch_method: "rail_dropped",
    effectiveness_range: 50, // meters
    advantages: ["Comprovado", "Barato", "Simples"],
    disadvantages: ["Curto alcance", "Manual", "Previsível"]
  },

  "hedgehog_mortar": {
    name: "Morteiro Hedgehog",
    type: "ahead_throwing",
    projectiles: 24,
    range_yards: 230,
    warhead_kg: 16, // per projectile
    launcher_weight_tons: 1.8,
    cost: 120000,
    year_introduced: 1942,
    tech_level: 40,
    description: "Morteiro que lança projéteis à frente do navio",
    suitable_ships: ["destroyer", "escort", "frigate"],
    pattern_diameter: 130, // meters
    contact_fused: true,
    advantages: ["Ataque frontal", "Padrão de tiro", "Eficaz"],
    disadvantages: ["Curto alcance", "Munição limitada", "Complexo"]
  },

  "squid_mortar": {
    name: "Morteiro Squid Triplo",
    type: "ahead_throwing",
    projectiles: 3,
    range_yards: 275,
    warhead_kg: 91, // per projectile  
    launcher_weight_tons: 4.2,
    cost: 285000,
    year_introduced: 1950,
    tech_level: 50,
    description: "Morteiro ASW avançado com padrão triangular",
    suitable_ships: ["destroyer", "frigate"],
    pattern_type: "triangular",
    sonar_integrated: true,
    advantages: ["Padrão letal", "Integração sonar", "Potente"],
    disadvantages: ["Pesado", "Caro", "Munição especial"]
  }
};

export const countermeasures = {
  "smoke_generator": {
    name: "Gerador de Cortina de Fumaça",
    type: "smoke_screen",
    coverage_duration_minutes: 15,
    coverage_area_meters: 2000,
    weight_tons: 1.2,
    cost: 45000,
    year_introduced: 1940,
    tech_level: 25,
    description: "Sistema para gerar cortinas de fumaça defensivas",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    fuel_consumption_high: true,
    advantages: ["Ocultação efetiva", "Defensivo", "Simples"],
    disadvantages: ["Temporário", "Consome combustível", "Vento dependente"]
  },

  "chaff_dispenser": {
    name: "Dispensador de Chaff",
    type: "radar_countermeasure",
    chaff_clouds: 50,
    effectiveness_duration_minutes: 8,
    weight_tons: 0.8,
    cost: 75000,
    year_introduced: 1943,
    tech_level: 45,
    description: "Contramedida primitiva contra radar",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    radar_bands: ["X", "S"],
    advantages: ["Anti-radar", "Leve", "Múltiplos usos"],
    disadvantages: ["Limitado", "Experimental", "Temporário"]
  },

  "degaussing_system": {
    name: "Sistema de Desmagnetização",
    type: "magnetic_protection",
    protection_type: "magnetic_mines",
    power_consumption_kw: 45,
    weight_tons: 3.5,
    cost: 180000,
    year_introduced: 1940,
    tech_level: 35,
    description: "Sistema para neutralizar assinatura magnética",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    mine_protection: 0.85, // 85% effectiveness
    advantages: ["Proteção minas", "Passivo", "Automático"],
    disadvantages: ["Consumo energia", "Pesado", "Manutenção"]
  }
};

export const searchlights = {
  "searchlight_60inch": {
    name: "Holofote 60 polegadas",
    diameter_inches: 60,
    range_yards: 8000,
    type: "carbon_arc",
    weight_tons: 2.8,
    cost: 35000,
    year_introduced: 1935,
    tech_level: 25,
    description: "Holofote padrão para iluminação noturna",
    suitable_ships: ["destroyer", "cruiser", "battleship"],
    power_consumption_kw: 15,
    crew: 2,
    advantages: ["Longo alcance", "Potente", "Confiável"],
    disadvantages: ["Revela posição", "Alvo fácil", "Manual"]
  },

  "searchlight_36inch_radar": {
    name: "Holofote 36\" com Radar",
    diameter_inches: 36,
    range_yards: 5000,
    type: "radar_controlled",
    weight_tons: 1.8,
    cost: 125000,
    year_introduced: 1945,
    tech_level: 50,
    description: "Holofote controlado por radar para maior precisão",
    suitable_ships: ["destroyer", "cruiser"],
    power_consumption_kw: 25,
    crew: 1,
    radar_integrated: true,
    advantages: ["Controle automático", "Preciso", "Moderno"],
    disadvantages: ["Caro", "Complexo", "Radar dependente"]
  }
};

export default { 
  aa_guns, 
  torpedo_tubes, 
  depth_charges, 
  countermeasures, 
  searchlights 
};