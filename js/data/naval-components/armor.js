// js/data/naval-components/armor.js - Naval Armor Systems for 1954

export const armor_materials = {
  "no_armor": {
    name: "Sem Blindagem",
    thickness_mm: 0,
    protection_rating: 0,
    weight_per_sqm_kg: 0,
    cost_per_sqm: 0,
    year_introduced: 1900,
    tech_level: 0,
    description: "Casco não blindado - apenas estrutura básica"
  },

  "structural_steel": {
    name: "Aço Estrutural",
    thickness_mm: 12,
    protection_rating: 0.15,
    weight_per_sqm_kg: 94,
    cost_per_sqm: 45,
    year_introduced: 1900,
    tech_level: 10,
    description: "Aço estrutural básico com proteção mínima contra fragmentos"
  },

  "light_armor": {
    name: "Blindagem Leve",
    thickness_mm: 25,
    protection_rating: 0.4,
    weight_per_sqm_kg: 196,
    cost_per_sqm: 120,
    year_introduced: 1920,
    tech_level: 20,
    description: "Blindagem leve contra artilharia pequena e fragmentos"
  },

  "medium_armor": {
    name: "Blindagem Média",
    thickness_mm: 76,
    protection_rating: 0.7,
    weight_per_sqm_kg: 597,
    cost_per_sqm: 380,
    year_introduced: 1925,
    tech_level: 25,
    description: "Proteção padrão contra artilharia média"
  },

  "heavy_armor": {
    name: "Blindagem Pesada",
    thickness_mm: 152,
    protection_rating: 1.0,
    weight_per_sqm_kg: 1194,
    cost_per_sqm: 850,
    year_introduced: 1930,
    tech_level: 30,
    description: "Blindagem pesada para áreas vitais"
  },

  "krupp_armor": {
    name: "Aço Krupp Face-Hardened",
    thickness_mm: 203,
    protection_rating: 1.4,
    weight_per_sqm_kg: 1595,
    cost_per_sqm: 1400,
    year_introduced: 1935,
    tech_level: 35,
    description: "Aço endurecido superficialmente - excelente contra AP"
  },

  "advanced_armor": {
    name: "Blindagem Avançada",
    thickness_mm: 254,
    protection_rating: 1.6,
    weight_per_sqm_kg: 1996,
    cost_per_sqm: 1800,
    year_introduced: 1945,
    tech_level: 45,
    description: "Aço de alta qualidade com tratamento térmico especial"
  },

  "super_heavy_armor": {
    name: "Blindagem Super-Pesada",
    thickness_mm: 406,
    protection_rating: 2.2,
    weight_per_sqm_kg: 3189,
    cost_per_sqm: 3200,
    year_introduced: 1940,
    tech_level: 40,
    description: "Máxima proteção para encouraçados - extremamente caro"
  },

  "composite_experimental": {
    name: "Composta Experimental",
    thickness_mm: 127,
    protection_rating: 1.8,
    weight_per_sqm_kg: 900,
    cost_per_sqm: 4500,
    year_introduced: 1955,
    tech_level: 70,
    description: "Camadas múltiplas experimentais - leve mas caríssimo"
  }
};

export const armor_zones = {
  // BELT ARMOR - Cinturão principal
  "belt": {
    name: "Cinturão Principal",
    description: "Proteção lateral do casco na linha d'água",
    area_sqm_base: {
      corvette: 95,
      destroyer: 180,
      cruiser: 420,
      battleship: 890,
      carrier: 650,
      submarine: 85
    },
    importance: "critical",
    coverage: "waterline_sides",
    suitable_materials: ["light_armor", "medium_armor", "heavy_armor", "krupp_armor", "advanced_armor", "super_heavy_armor"],
    protection_against: ["ap_shells", "he_shells", "torpedoes"],
    weight_multiplier: 1.0
  },

  // DECK ARMOR - Convés blindado
  "deck": {
    name: "Convés Blindado",
    description: "Proteção horizontal contra bombas e projéteis mergulhantes",
    area_sqm_base: {
      corvette: 480,
      destroyer: 850,
      cruiser: 1800,
      battleship: 3200,
      carrier: 4500,
      submarine: 120
    },
    importance: "high",
    coverage: "horizontal_top",
    suitable_materials: ["structural_steel", "light_armor", "medium_armor", "heavy_armor", "krupp_armor"],
    protection_against: ["bombs", "plunging_fire", "fragments"],
    weight_multiplier: 0.8 // Deck armor é tipicamente mais leve
  },

  // TURRET ARMOR - Torres principais
  "turrets": {
    name: "Torres Principais",
    description: "Blindagem das torres de artilharia principal",
    area_sqm_base: {
      corvette: 15,
      destroyer: 45,
      cruiser: 120,
      battleship: 280,
      carrier: 0, // Carriers não têm torres principais
      submarine: 0
    },
    importance: "high",
    coverage: "turret_faces",
    suitable_materials: ["medium_armor", "heavy_armor", "krupp_armor", "advanced_armor", "super_heavy_armor"],
    protection_against: ["ap_shells", "he_shells"],
    weight_multiplier: 1.2 // Torres precisam de proteção extra
  },

  // CONNING TOWER - Torre de comando
  "conning_tower": {
    name: "Torre de Comando",
    description: "Proteção da estrutura de comando e controle",
    area_sqm_base: {
      corvette: 4,
      destroyer: 8,
      cruiser: 25,
      battleship: 45,
      carrier: 35,
      submarine: 12
    },
    importance: "critical",
    coverage: "command_structure",
    suitable_materials: ["light_armor", "medium_armor", "heavy_armor", "krupp_armor", "advanced_armor"],
    protection_against: ["ap_shells", "he_shells", "fragments"],
    weight_multiplier: 1.1
  },

  // BARBETTES - Base das torres
  "barbettes": {
    name: "Barbetas",
    description: "Proteção cilíndrica ao redor da base das torres",
    area_sqm_base: {
      corvette: 8,
      destroyer: 25,
      cruiser: 80,
      battleship: 180,
      carrier: 0,
      submarine: 0
    },
    importance: "high",
    coverage: "turret_base",
    suitable_materials: ["medium_armor", "heavy_armor", "krupp_armor", "advanced_armor", "super_heavy_armor"],
    protection_against: ["ap_shells", "he_shells"],
    weight_multiplier: 1.15
  },

  // MAGAZINE ARMOR - Paióis
  "magazines": {
    name: "Paióis de Munição",
    description: "Proteção extra para armazenamento de munição",
    area_sqm_base: {
      corvette: 12,
      destroyer: 35,
      cruiser: 85,
      battleship: 220,
      carrier: 150,
      submarine: 18
    },
    importance: "critical",
    coverage: "ammunition_storage",
    suitable_materials: ["medium_armor", "heavy_armor", "krupp_armor", "advanced_armor"],
    protection_against: ["ap_shells", "he_shells", "fragments", "fire"],
    weight_multiplier: 1.3 // Proteção extra crítica
  },

  // TORPEDO PROTECTION - Sistema anti-torpedo
  "torpedo_defense": {
    name: "Proteção Anti-Torpedo",
    description: "Bulges, compartimentação e sistemas de proteção lateral subaquática",
    area_sqm_base: {
      corvette: 45,
      destroyer: 95,
      cruiser: 180,
      battleship: 320,
      carrier: 280,
      submarine: 45
    },
    importance: "high",
    coverage: "underwater_sides",
    suitable_materials: ["no_armor", "structural_steel", "light_armor", "medium_armor", "heavy_armor"],
    protection_against: ["torpedoes", "underwater_explosions", "mines"],
    weight_multiplier: 0.9, // Mostly air gaps and compartmentalization
    special_properties: ["bulge_system", "compartmentalization", "liquid_loading"]
  }
};

export const armor_schemes = {
  "unarmored": {
    name: "Não Blindado",
    description: "Sem proteção blindada - apenas estrutura básica",
    zones: {
      belt: "no_armor",
      deck: "structural_steel", 
      turrets: "no_armor",
      conning_tower: "structural_steel",
      barbettes: "no_armor",
      magazines: "light_armor",
      torpedo_defense: "no_armor"
    },
    cost_modifier: 1.0,
    weight_modifier: 1.0,
    suitable_ships: ["escort", "minesweeper", "patrol"]
  },

  "light_protection": {
    name: "Proteção Leve",
    description: "Blindagem mínima contra fragmentos e artilharia leve",
    zones: {
      belt: "light_armor",
      deck: "light_armor",
      turrets: "medium_armor", 
      conning_tower: "medium_armor",
      barbettes: "light_armor",
      magazines: "medium_armor",
      torpedo_defense: "structural_steel"
    },
    cost_modifier: 1.2,
    weight_modifier: 1.15,
    suitable_ships: ["destroyer", "frigate"]
  },

  "balanced_protection": {
    name: "Proteção Balanceada",
    description: "Equilíbrio entre proteção, peso e custo",
    zones: {
      belt: "medium_armor",
      deck: "medium_armor",
      turrets: "heavy_armor",
      conning_tower: "heavy_armor", 
      barbettes: "medium_armor",
      magazines: "heavy_armor",
      torpedo_defense: "light_armor"
    },
    cost_modifier: 1.5,
    weight_modifier: 1.35,
    suitable_ships: ["light_cruiser", "heavy_cruiser"]
  },

  "heavy_protection": {
    name: "Proteção Pesada",
    description: "Alta proteção para operações de linha de batalha",
    zones: {
      belt: "heavy_armor",
      deck: "heavy_armor",
      turrets: "krupp_armor",
      conning_tower: "krupp_armor",
      barbettes: "heavy_armor", 
      magazines: "krupp_armor",
      torpedo_defense: "medium_armor"
    },
    cost_modifier: 2.2,
    weight_modifier: 1.8,
    suitable_ships: ["battleship", "battle_cruiser"]
  },

  "maximum_protection": {
    name: "Proteção Máxima",
    description: "Blindagem suprema para super-encouraçados",
    zones: {
      belt: "super_heavy_armor",
      deck: "krupp_armor", 
      turrets: "super_heavy_armor",
      conning_tower: "super_heavy_armor",
      barbettes: "super_heavy_armor",
      magazines: "super_heavy_armor",
      torpedo_defense: "heavy_armor"
    },
    cost_modifier: 4.0,
    weight_modifier: 2.8,
    suitable_ships: ["super_battleship"]
  },

  "experimental_composite": {
    name: "Composta Experimental",
    description: "Materiais experimentais para proteção otimizada",
    zones: {
      belt: "composite_experimental",
      deck: "advanced_armor",
      turrets: "composite_experimental", 
      conning_tower: "composite_experimental",
      barbettes: "advanced_armor",
      magazines: "composite_experimental",
      torpedo_defense: "advanced_armor"
    },
    cost_modifier: 6.5,
    weight_modifier: 1.9,
    suitable_ships: ["experimental"],
    year_available: 1955
  }
};

export default { armor_materials, armor_zones, armor_schemes };