// js/data/naval-components/naval_guns.js - Naval Artillery Systems for 1954

export const naval_guns = {
  // SMALL VESSEL GUNS - Para corvetas
  "gun_40mm_bofors": {
    name: "Canhão Bofors 40mm",
    caliber: 40,
    barrel_length: 56,
    type: "dual_purpose",
    rate_of_fire: 120,
    max_range_yards: 10500,
    weight_tons: 2.4,
    crew: 4,
    cost: 65000,
    year_introduced: 1938,
    tech_level: 25,
    description: "Canhão automático versátil para navios pequenos",
    mount_type: "single",
    suitable_ships: ["corvette", "escort", "frigate"],
    ammunition_types: ["HE", "AA"]
  },

  "gun_57mm_70cal": {
    name: "Canhão 57mm/70 Compacto",
    caliber: 57,
    barrel_length: 70,
    type: "dual_purpose", 
    rate_of_fire: 65,
    max_range_yards: 12000,
    weight_tons: 4.2,
    crew: 5,
    cost: 185000,
    year_introduced: 1945,
    tech_level: 35,
    description: "Armamento principal compacto para corvetas modernas",
    mount_type: "single",
    suitable_ships: ["corvette", "escort", "frigate"],
    ammunition_types: ["HE", "AA", "AP"]
  },

  // DESTROYER GUNS (3-5 inch)
  "gun_76mm_50cal": {
    name: "Canhão 76mm/50",
    caliber: 76.2,
    barrel_length: 50,
    type: "dual_purpose",
    rate_of_fire: 50, // rounds per minute
    max_range_yards: 14500,
    weight_tons: 6.8,
    crew: 7,
    cost: 4200000, // $4.2M
    year_introduced: 1940,
    tech_level: 40,
    description: "Canhão naval versátil para destroyers e escorts",
    mount_type: "single",
    suitable_ships: ["corvette", "destroyer", "frigate", "escort"],
    ammunition_types: ["HE", "AA", "AP"]
  },

  "gun_127mm_38cal": {
    name: "Canhão 127mm/38",
    caliber: 127,
    barrel_length: 38,
    type: "dual_purpose",
    rate_of_fire: 22,
    max_range_yards: 18200,
    weight_tons: 156.7, // complete twin mount
    crew: 27, // per mount
    cost: 850000,
    year_introduced: 1935,
    tech_level: 35,
    description: "Canhão dual-purpose padrão, excelente versatilidade",
    mount_type: "twin",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    ammunition_types: ["HE", "AA", "AP", "VT"]
  },

  "gun_127mm_54cal": {
    name: "Canhão 127mm/54 Automático",
    caliber: 127,
    barrel_length: 54,
    type: "dual_purpose",
    rate_of_fire: 40, // automatic loading
    max_range_yards: 25909,
    weight_tons: 78.2,
    crew: 6, // automatic systems
    cost: 1200000,
    year_introduced: 1945,
    tech_level: 50,
    description: "Canhão automático avançado com carregamento automático",
    mount_type: "single",
    suitable_ships: ["destroyer", "cruiser"],
    ammunition_types: ["HE", "AA", "AP", "VT", "Prox_Fuse"]
  },

  // CRUISER GUNS (6-8 inch)
  "gun_152mm_47cal": {
    name: "Canhão 152mm/47",
    caliber: 152.4,
    barrel_length: 47,
    type: "naval_gun",
    rate_of_fire: 10,
    max_range_yards: 26118,
    weight_tons: 165.8, // triple mount
    crew: 65,
    cost: 2200000,
    year_introduced: 1935,
    tech_level: 35,
    description: "Artilharia principal para cruzadores leves",
    mount_type: "triple",
    suitable_ships: ["light_cruiser"],
    ammunition_types: ["HE", "AP", "HC"]
  },

  "gun_152mm_47cal_auto": {
    name: "Canhão 152mm/47 Automático",
    caliber: 152.4,
    barrel_length: 47,
    type: "automatic_naval",
    rate_of_fire: 12, // automatic loading
    max_range_yards: 26800,
    weight_tons: 187.3,
    crew: 32, // reduced by automation
    cost: 3100000,
    year_introduced: 1948,
    tech_level: 55,
    description: "Versão automática para cruzadores AA especializados",
    mount_type: "twin",
    suitable_ships: ["light_cruiser", "aa_cruiser"],
    ammunition_types: ["HE", "AP", "AA", "VT"]
  },

  "gun_203mm_55cal": {
    name: "Canhão 203mm/55",
    caliber: 203.2,
    barrel_length: 55,
    type: "heavy_naval",
    rate_of_fire: 3,
    max_range_yards: 30050,
    weight_tons: 298.7, // triple mount
    crew: 85,
    cost: 3800000,
    year_introduced: 1930,
    tech_level: 30,
    description: "Artilharia pesada padrão para cruzadores",
    mount_type: "triple",
    suitable_ships: ["heavy_cruiser"],
    ammunition_types: ["HE", "AP", "HC"]
  },

  "gun_203mm_55cal_auto": {
    name: "Canhão 203mm/55 Automático",
    caliber: 203.2,
    barrel_length: 55,
    type: "automatic_heavy",
    rate_of_fire: 10, // revolutionary automatic
    max_range_yards: 31500,
    weight_tons: 315.2,
    crew: 48,
    cost: 5200000,
    year_introduced: 1948,
    tech_level: 55,
    description: "Canhão automático revolucionário de 8 polegadas",
    mount_type: "triple",
    suitable_ships: ["heavy_cruiser"],
    ammunition_types: ["HE", "AP", "HC", "HCVT"]
  },

  // BATTLESHIP GUNS (14-16 inch)
  "gun_356mm_45cal": {
    name: "Canhão 356mm/45",
    caliber: 356,
    barrel_length: 45,
    type: "battleship_main",
    rate_of_fire: 2,
    max_range_yards: 36300,
    weight_tons: 624.3, // triple mount
    crew: 110,
    cost: 8500000,
    year_introduced: 1940,
    tech_level: 40,
    description: "Artilharia principal de encouraçados médios",
    mount_type: "triple",
    suitable_ships: ["battleship"],
    ammunition_types: ["AP", "HE", "HC"]
  },

  "gun_406mm_45cal": {
    name: "Canhão 406mm/45",
    caliber: 406.4,
    barrel_length: 45,
    type: "battleship_main",
    rate_of_fire: 2,
    max_range_yards: 38720,
    weight_tons: 721.3, // triple mount
    crew: 134,
    cost: 12000000,
    year_introduced: 1940,
    tech_level: 40,
    description: "Canhão pesado de 16 polegadas para encouraçados",
    mount_type: "triple",
    suitable_ships: ["battleship"],
    ammunition_types: ["AP", "HE", "HC"]
  },

  "gun_406mm_50cal": {
    name: "Canhão 406mm/50",
    caliber: 406.4,
    barrel_length: 50,
    type: "battleship_main",
    rate_of_fire: 2,
    max_range_yards: 42345,
    weight_tons: 758.2,
    crew: 148,
    cost: 15000000,
    year_introduced: 1943,
    tech_level: 45,
    description: "Artilharia suprema de 16 polegadas - alcance e poder máximos",
    mount_type: "triple",
    suitable_ships: ["battleship"],
    ammunition_types: ["AP", "HE", "HC", "Nuclear"] // W23 nuclear shell
  },

  "gun_457mm_45cal": {
    name: "Canhão 457mm/45 (Experimental)",
    caliber: 457,
    barrel_length: 45,
    type: "super_battleship",
    rate_of_fire: 1.5,
    max_range_yards: 45000,
    weight_tons: 1200, // triple mount estimated
    crew: 180,
    cost: 25000000,
    year_introduced: 1945,
    tech_level: 55,
    description: "Canhão experimental de 18 polegadas para super-encouraçados",
    mount_type: "triple",
    suitable_ships: ["super_battleship"],
    ammunition_types: ["AP", "HE", "HC"]
  }
};

export const gun_mounts = {
  "single_mount": {
    name: "Torre Individual",
    guns_per_mount: 1,
    weight_modifier: 1.0,
    cost_modifier: 1.0,
    rate_of_fire_modifier: 1.0,
    description: "Torre simples com um canhão"
  },
  
  "twin_mount": {
    name: "Torre Dupla",
    guns_per_mount: 2,
    weight_modifier: 1.7,
    cost_modifier: 1.6,
    rate_of_fire_modifier: 0.9,
    description: "Torre com dois canhões"
  },
  
  "triple_mount": {
    name: "Torre Tripla", 
    guns_per_mount: 3,
    weight_modifier: 2.3,
    cost_modifier: 2.2,
    rate_of_fire_modifier: 0.8,
    description: "Torre com três canhões"
  },
  
  "quad_mount": {
    name: "Torre Quádrupla",
    guns_per_mount: 4,
    weight_modifier: 2.8,
    cost_modifier: 2.6,
    rate_of_fire_modifier: 0.7,
    description: "Torre com quatro canhões (raro)"
  }
};

export const fire_control_systems = {
  "mk37_director": {
    name: "Diretor de Tiro Mark 37",
    type: "optical_radar",
    max_targets: 1,
    accuracy_bonus: 1.3,
    range_bonus: 1.2,
    weight: 18,
    cost: 280000,
    year_introduced: 1942,
    tech_level: 40,
    description: "Sistema padrão com radar de direção de tiro",
    suitable_guns: ["5inch", "6inch"]
  },

  "mk38_director": {
    name: "Diretor de Tiro Mark 38",
    type: "advanced_radar",
    max_targets: 2,
    accuracy_bonus: 1.5,
    range_bonus: 1.4,
    weight: 22,
    cost: 4200000, // $4.2M
    year_introduced: 1945,
    tech_level: 50,
    description: "Sistema avançado para artilharia pesada",
    suitable_guns: ["8inch", "14inch", "16inch"]
  },

  "mk56_director": {
    name: "Diretor de Tiro Mark 56",
    type: "automatic_tracking",
    max_targets: 1,
    accuracy_bonus: 1.6,
    range_bonus: 1.3,
    weight: 15,
    cost: 320000,
    year_introduced: 1955,
    tech_level: 60,
    description: "Sistema automático para armas de fogo rápido",
    suitable_guns: ["3inch", "5inch"]
  }
};

export const ammunition_types = {
  "HE": {
    name: "Alto Explosivo (HE)",
    damage_modifier: 1.0,
    penetration: 0.2,
    blast_radius: 1.0,
    cost_per_round: 450,
    description: "Munição padrão contra alvos não-blindados"
  },

  "AP": {
    name: "Perfurante (AP)",
    damage_modifier: 0.8,
    penetration: 1.0,
    blast_radius: 0.3,
    cost_per_round: 680,
    description: "Munição para penetrar blindagem"
  },

  "HC": {
    name: "Alto Explosivo Pesado (HC)",
    damage_modifier: 1.4,
    penetration: 0.1,
    blast_radius: 1.5,
    cost_per_round: 620,
    description: "Máximo poder destrutivo contra estruturas"
  },

  "VT": {
    name: "Espoleta de Proximidade (VT)",
    damage_modifier: 1.2,
    penetration: 0.1,
    aa_effectiveness: 3.0,
    cost_per_round: 1200,
    year_introduced: 1943,
    tech_level: 45,
    description: "Munição com espoleta radar para AA"
  },

  "Nuclear": {
    name: "Projétil Nuclear W23",
    damage_modifier: 50.0,
    penetration: 10.0,
    blast_radius: 100.0,
    cost_per_round: 250000,
    year_introduced: 1956,
    tech_level: 80,
    restricted: true,
    description: "Projétil nuclear tático (altamente restrito)"
  }
};

export default { naval_guns, gun_mounts, fire_control_systems, ammunition_types };