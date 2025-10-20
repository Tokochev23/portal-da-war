/**
 * @file combat_units.js
 * @description Definições de todas as unidades de combate (batalhões) para o Division Designer
 * Baseado no DLC Infantaria - War1954
 */

export const combat_units = {
  // ==================== INFANTARIA ====================

  irregulares: {
    id: 'irregulares',
    name: 'Irregulares',
    nameEn: 'Irregulars',
    category: 'infantry',
    subcategory: 'light',

    composition: {
      manpower: 1000,
      equipment: {
        small_arms: 1000,
        light_mg: 50
      }
    },

    costs: {
      production: 300000,        // $0.3M
      maintenance: 15000         // 5% do custo
    },

    stats: {
      softAttack: 15,
      hardAttack: 1,
      defense: 20,
      breakthrough: 8,
      armor: 0,
      piercing: 1,
      hp: 8,
      organization: 50,
      recovery: 0.3,
      reconnaissance: 3,
      suppression: 8,
      weight: 0.1,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 0,
      requiredTech: [],
      incompatibleWith: []
    },

    icon: '🎖️',
    color: '#78716c'
  },

  infantaria_linha: {
    id: 'infantaria_linha',
    name: 'Infantaria de Linha',
    nameEn: 'Line Infantry',
    category: 'infantry',
    subcategory: 'standard',

    composition: {
      manpower: 800,
      equipment: {
        small_arms: 800,
        light_mg: 80,
        mortars: 12
      }
    },

    costs: {
      production: 600000,
      maintenance: 30000
    },

    stats: {
      softAttack: 20,
      hardAttack: 2,
      defense: 25,
      breakthrough: 12,
      armor: 0,
      piercing: 1,
      hp: 10,
      organization: 60,
      recovery: 0.4,
      reconnaissance: 2,
      suppression: 10,
      weight: 0.15,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 1
    },

    icon: '🪖',
    color: '#4a7c59'
  },

  infantaria_leve: {
    id: 'infantaria_leve',
    name: 'Infantaria Leve',
    nameEn: 'Light Infantry',
    category: 'infantry',
    subcategory: 'light',

    composition: {
      manpower: 800,
      equipment: {
        small_arms: 800,
        light_mg: 60,
        mortars: 8
      }
    },

    costs: {
      production: 600000,
      maintenance: 30000
    },

    stats: {
      softAttack: 18,
      hardAttack: 1,
      defense: 22,
      breakthrough: 10,
      armor: 0,
      piercing: 1,
      hp: 9,
      organization: 65,
      recovery: 0.45,
      reconnaissance: 4,
      suppression: 8,
      weight: 0.12,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 1
    },

    icon: '🎯',
    color: '#6b8e23'
  },

  tropa_choque: {
    id: 'tropa_choque',
    name: 'Tropa de Choque',
    nameEn: 'Shock Troops',
    category: 'infantry',
    subcategory: 'elite',

    composition: {
      manpower: 800,
      equipment: {
        small_arms: 800,
        light_mg: 100,
        mortars: 16,
        explosives: 400
      }
    },

    costs: {
      production: 800000,
      maintenance: 40000
    },

    stats: {
      softAttack: 28,
      hardAttack: 4,
      defense: 20,
      breakthrough: 20,
      armor: 0,
      piercing: 2,
      hp: 11,
      organization: 55,
      recovery: 0.35,
      reconnaissance: 2,
      suppression: 15,
      weight: 0.18,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '💥',
    color: '#dc2626'
  },

  montanhistas: {
    id: 'montanhistas',
    name: 'Montanhistas',
    nameEn: 'Mountain Infantry',
    category: 'infantry',
    subcategory: 'special',

    composition: {
      manpower: 800,
      equipment: {
        small_arms: 800,
        light_mg: 70,
        mortars: 10,
        climbing_gear: 800
      }
    },

    costs: {
      production: 800000,
      maintenance: 40000
    },

    stats: {
      softAttack: 19,
      hardAttack: 2,
      defense: 28,
      breakthrough: 10,
      armor: 0,
      piercing: 1,
      hp: 10,
      organization: 70,
      recovery: 0.4,
      reconnaissance: 3,
      suppression: 9,
      weight: 0.14,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '⛰️',
    color: '#8b7355'
  },

  paraquedistas: {
    id: 'paraquedistas',
    name: 'Paraquedistas',
    nameEn: 'Paratroopers',
    category: 'infantry',
    subcategory: 'special',

    composition: {
      manpower: 800,
      equipment: {
        small_arms: 800,
        light_mg: 80,
        mortars: 12,
        parachutes: 800
      }
    },

    costs: {
      production: 800000,
      maintenance: 40000
    },

    stats: {
      softAttack: 22,
      hardAttack: 3,
      defense: 23,
      breakthrough: 14,
      armor: 0,
      piercing: 2,
      hp: 10,
      organization: 65,
      recovery: 0.42,
      reconnaissance: 4,
      suppression: 11,
      weight: 0.13,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '🪂',
    color: '#1e40af'
  },

  fuzileiros_navais: {
    id: 'fuzileiros_navais',
    name: 'Fuzileiros Navais',
    nameEn: 'Marines',
    category: 'infantry',
    subcategory: 'special',

    composition: {
      manpower: 800,
      equipment: {
        small_arms: 800,
        light_mg: 85,
        mortars: 14,
        amphibious_gear: 800
      }
    },

    costs: {
      production: 800000,
      maintenance: 40000
    },

    stats: {
      softAttack: 24,
      hardAttack: 3,
      defense: 26,
      breakthrough: 15,
      armor: 0,
      piercing: 2,
      hp: 11,
      organization: 68,
      recovery: 0.43,
      reconnaissance: 3,
      suppression: 12,
      weight: 0.16,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '⚓',
    color: '#1e3a8a'
  },

  // ==================== INFANTARIA MOTORIZADA ====================

  infantaria_motorizada: {
    id: 'infantaria_motorizada',
    name: 'Infantaria Motorizada',
    nameEn: 'Motorized Infantry',
    category: 'motorized',
    subcategory: 'standard',

    composition: {
      manpower: 800,
      equipment: {
        trucks: 40,
        small_arms: 800,
        light_mg: 80,
        mortars: 16
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    stats: {
      softAttack: 25,
      hardAttack: 2,
      defense: 30,
      breakthrough: 15,
      armor: 0,
      piercing: 1,
      hp: 10,
      organization: 60,
      recovery: 0.4,
      reconnaissance: 2,
      suppression: 12,
      weight: 0.8,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '🚛',
    color: '#92400e'
  },

  carro_armado_irregulares: {
    id: 'carro_armado_irregulares',
    name: 'Carro Armado (Irregulares)',
    nameEn: 'Gun Truck (Irregulars)',
    category: 'motorized',
    subcategory: 'light',

    composition: {
      manpower: 800,
      equipment: {
        utility_vehicles: 120,
        small_arms: 800,
        light_mg: 120,
        heavy_mg: 40
      }
    },

    costs: {
      production: 800000,
      maintenance: 40000
    },

    stats: {
      softAttack: 28,
      hardAttack: 3,
      defense: 22,
      breakthrough: 16,
      armor: 2,
      piercing: 3,
      hp: 9,
      organization: 55,
      recovery: 0.38,
      reconnaissance: 4,
      suppression: 14,
      weight: 0.6,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 1
    },

    icon: '🚙',
    color: '#78350f'
  },

  carro_armado: {
    id: 'carro_armado',
    name: 'Carro Armado',
    nameEn: 'Gun Truck',
    category: 'motorized',
    subcategory: 'standard',

    composition: {
      manpower: 800,
      equipment: {
        utility_vehicles: 160,
        small_arms: 800,
        light_mg: 160,
        heavy_mg: 60,
        autocannons: 20
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    stats: {
      softAttack: 32,
      hardAttack: 5,
      defense: 25,
      breakthrough: 18,
      armor: 3,
      piercing: 4,
      hp: 10,
      organization: 58,
      recovery: 0.4,
      reconnaissance: 5,
      suppression: 16,
      weight: 0.7,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '🛻',
    color: '#a16207'
  },

  // ==================== INFANTARIA MECANIZADA ====================

  mecanizada_leve_apc: {
    id: 'mecanizada_leve_apc',
    name: 'Infantaria Mecanizada Leve (APC)',
    nameEn: 'Light Mechanized (APC)',
    category: 'mechanized',
    subcategory: 'apc',

    composition: {
      manpower: 800,
      equipment: {
        apc: 100,
        small_arms: 800,
        light_mg: 100
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    stats: {
      softAttack: 30,
      hardAttack: 4,
      defense: 35,
      breakthrough: 20,
      armor: 10,
      piercing: 5,
      hp: 12,
      organization: 65,
      recovery: 0.42,
      reconnaissance: 3,
      suppression: 14,
      weight: 1.2,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 3
    },

    icon: '🚜',
    color: '#15803d'
  },

  mecanizada_ifv: {
    id: 'mecanizada_ifv',
    name: 'Infantaria Mecanizada (IFV)',
    nameEn: 'Mechanized Infantry (IFV)',
    category: 'mechanized',
    subcategory: 'ifv',

    composition: {
      manpower: 800,
      equipment: {
        ifv: 100,
        small_arms: 800,
        autocannons: 100,
        atgm: 50
      }
    },

    costs: {
      production: 3000000,
      maintenance: 150000
    },

    stats: {
      softAttack: 38,
      hardAttack: 12,
      defense: 40,
      breakthrough: 25,
      armor: 15,
      piercing: 20,
      hp: 14,
      organization: 68,
      recovery: 0.45,
      reconnaissance: 4,
      suppression: 16,
      weight: 1.5,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 4
    },

    icon: '🛡️',
    color: '#166534'
  },

  // ==================== BLINDADOS ====================

  tanque_leve: {
    id: 'tanque_leve',
    name: 'Tanque Leve',
    nameEn: 'Light Tank',
    category: 'armor',
    subcategory: 'light',

    composition: {
      manpower: 300,
      equipment: {
        light_tanks: 60
      }
    },

    costs: {
      production: 4000000,
      maintenance: 200000
    },

    stats: {
      softAttack: 25,
      hardAttack: 20,
      defense: 30,
      breakthrough: 35,
      armor: 30,
      piercing: 40,
      hp: 12,
      organization: 50,
      recovery: 0.35,
      reconnaissance: 8,
      suppression: 10,
      weight: 2.5,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 3
    },

    icon: '🚗',
    color: '#713f12'
  },

  tanque_medio: {
    id: 'tanque_medio',
    name: 'Tanque Médio',
    nameEn: 'Medium Tank',
    category: 'armor',
    subcategory: 'medium',

    composition: {
      manpower: 400,
      equipment: {
        medium_tanks: 80
      }
    },

    costs: {
      production: 1600000,
      maintenance: 80000
    },

    stats: {
      softAttack: 30,
      hardAttack: 35,
      defense: 40,
      breakthrough: 45,
      armor: 60,
      piercing: 70,
      hp: 15,
      organization: 55,
      recovery: 0.38,
      reconnaissance: 6,
      suppression: 12,
      weight: 3.5,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 3
    },

    icon: '🚙',
    color: '#854d0e'
  },

  tanque_mbt: {
    id: 'tanque_mbt',
    name: 'Tanque (MBT)',
    nameEn: 'Main Battle Tank',
    category: 'armor',
    subcategory: 'mbt',

    composition: {
      manpower: 300,
      equipment: {
        mbt: 60
      }
    },

    costs: {
      production: 6000000,
      maintenance: 300000
    },

    stats: {
      softAttack: 35,
      hardAttack: 50,
      defense: 50,
      breakthrough: 60,
      armor: 90,
      piercing: 100,
      hp: 18,
      organization: 58,
      recovery: 0.4,
      reconnaissance: 7,
      suppression: 15,
      weight: 4.5,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 4
    },

    icon: '🛡️',
    color: '#a16207'
  },

  tanque_anfibio: {
    id: 'tanque_anfibio',
    name: 'Tanque Anfíbio',
    nameEn: 'Amphibious Tank',
    category: 'armor',
    subcategory: 'amphibious',

    composition: {
      manpower: 400,
      equipment: {
        amphibious_tanks: 60
      }
    },

    costs: {
      production: 4000000,
      maintenance: 200000
    },

    stats: {
      softAttack: 28,
      hardAttack: 25,
      defense: 35,
      breakthrough: 38,
      armor: 40,
      piercing: 50,
      hp: 14,
      organization: 52,
      recovery: 0.37,
      reconnaissance: 7,
      suppression: 11,
      weight: 3.0,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 3
    },

    icon: '🛶',
    color: '#0c4a6e'
  },

  // ==================== ARTILHARIA ====================

  bateria_antiaerea: {
    id: 'bateria_antiaerea',
    name: 'Bateria Antiaérea',
    nameEn: 'Anti-Aircraft Battery',
    category: 'artillery',
    subcategory: 'aa',

    composition: {
      manpower: 400,
      equipment: {
        aa_guns: 24,
        trucks: 24
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    stats: {
      softAttack: 5,
      hardAttack: 2,
      defense: 15,
      breakthrough: 5,
      armor: 0,
      piercing: 10,
      hp: 8,
      organization: 45,
      recovery: 0.3,
      reconnaissance: 1,
      suppression: 5,
      weight: 0.6,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '🎯',
    color: '#713f12'
  },

  bateria_artilharia: {
    id: 'bateria_artilharia',
    name: 'Bateria de Artilharia',
    nameEn: 'Artillery Battery',
    category: 'artillery',
    subcategory: 'howitzer',

    composition: {
      manpower: 400,
      equipment: {
        artillery: 24,
        trucks: 24
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    stats: {
      softAttack: 40,
      hardAttack: 8,
      defense: 12,
      breakthrough: 6,
      armor: 0,
      piercing: 5,
      hp: 8,
      organization: 40,
      recovery: 0.3,
      reconnaissance: 1,
      suppression: 8,
      weight: 0.8,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 2
    },

    icon: '🎯',
    color: '#92400e'
  },

  lancador_foguete: {
    id: 'lancador_foguete',
    name: 'Lançador de Foguete',
    nameEn: 'Rocket Launcher',
    category: 'artillery',
    subcategory: 'rocket',

    composition: {
      manpower: 400,
      equipment: {
        rocket_launchers: 24,
        trucks: 24
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    stats: {
      softAttack: 50,
      hardAttack: 10,
      defense: 10,
      breakthrough: 8,
      armor: 0,
      piercing: 6,
      hp: 7,
      organization: 38,
      recovery: 0.28,
      reconnaissance: 1,
      suppression: 10,
      weight: 0.9,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 3
    },

    icon: '🚀',
    color: '#b45309'
  },

  grupo_atcms: {
    id: 'grupo_atcms',
    name: 'Grupo de Armas (ATCMS)',
    nameEn: 'ATGM Group',
    category: 'artillery',
    subcategory: 'atgm',

    composition: {
      manpower: 400,
      equipment: {
        atcms: 36,
        trucks: 18
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    stats: {
      softAttack: 15,
      hardAttack: 35,
      defense: 18,
      breakthrough: 10,
      armor: 0,
      piercing: 60,
      hp: 8,
      organization: 42,
      recovery: 0.32,
      reconnaissance: 2,
      suppression: 6,
      weight: 0.7,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 4
    },

    icon: '🎯',
    color: '#dc2626'
  },

  grupo_manpad: {
    id: 'grupo_manpad',
    name: 'Grupo MANPAD',
    nameEn: 'MANPAD Group',
    category: 'artillery',
    subcategory: 'manpad',

    composition: {
      manpower: 400,
      equipment: {
        manpads: 36,
        trucks: 12
      }
    },

    costs: {
      production: 2200000,
      maintenance: 110000
    },

    stats: {
      softAttack: 8,
      hardAttack: 3,
      defense: 16,
      breakthrough: 6,
      armor: 0,
      piercing: 12,
      hp: 7,
      organization: 43,
      recovery: 0.31,
      reconnaissance: 2,
      suppression: 5,
      weight: 0.5,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 4
    },

    icon: '🎯',
    color: '#ef4444'
  },

  mlrs: {
    id: 'mlrs',
    name: 'MLRS',
    nameEn: 'Multiple Rocket Launch System',
    category: 'artillery',
    subcategory: 'mlrs',

    composition: {
      manpower: 400,
      equipment: {
        mlrs: 32
      }
    },

    costs: {
      production: 10000000,
      maintenance: 500000
    },

    stats: {
      softAttack: 80,
      hardAttack: 15,
      defense: 8,
      breakthrough: 10,
      armor: 5,
      piercing: 10,
      hp: 10,
      organization: 35,
      recovery: 0.25,
      reconnaissance: 1,
      suppression: 15,
      weight: 2.0,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 5
    },

    icon: '🚀',
    color: '#991b1b'
  },

  spg: {
    id: 'spg',
    name: 'Artilharia Autopropulsada (SPG)',
    nameEn: 'Self-Propelled Gun',
    category: 'artillery',
    subcategory: 'spg',

    composition: {
      manpower: 400,
      equipment: {
        spg: 32
      }
    },

    costs: {
      production: 6000000,
      maintenance: 300000
    },

    stats: {
      softAttack: 55,
      hardAttack: 12,
      defense: 20,
      breakthrough: 15,
      armor: 20,
      piercing: 15,
      hp: 12,
      organization: 45,
      recovery: 0.35,
      reconnaissance: 2,
      suppression: 12,
      weight: 2.5,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 4
    },

    icon: '🚜',
    color: '#a16207'
  },

  spaa: {
    id: 'spaa',
    name: 'Artilharia AA Autopropulsada (SPAA)',
    nameEn: 'Self-Propelled Anti-Aircraft',
    category: 'artillery',
    subcategory: 'spaa',

    composition: {
      manpower: 400,
      equipment: {
        spaa: 32
      }
    },

    costs: {
      production: 6000000,
      maintenance: 300000
    },

    stats: {
      softAttack: 10,
      hardAttack: 4,
      defense: 25,
      breakthrough: 10,
      armor: 15,
      piercing: 20,
      hp: 11,
      organization: 48,
      recovery: 0.36,
      reconnaissance: 2,
      suppression: 8,
      weight: 2.2,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 4
    },

    icon: '🎯',
    color: '#ca8a04'
  },

  // ==================== FORÇAS ESPECIAIS ====================

  tropas_aerotransportadas: {
    id: 'tropas_aerotransportadas',
    name: 'Tropas Aerotransportadas',
    nameEn: 'Air Assault',
    category: 'special',
    subcategory: 'airborne',

    composition: {
      manpower: 800,
      equipment: {
        utility_helicopters: 40,
        small_arms: 800,
        light_mg: 80,
        mortars: 16
      }
    },

    costs: {
      production: 6000000,
      maintenance: 300000
    },

    stats: {
      softAttack: 26,
      hardAttack: 4,
      defense: 24,
      breakthrough: 18,
      armor: 0,
      piercing: 2,
      hp: 10,
      organization: 70,
      recovery: 0.45,
      reconnaissance: 6,
      suppression: 12,
      weight: 0.2,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 4
    },

    icon: '🚁',
    color: '#0369a1'
  },

  helicoptero_ataque: {
    id: 'helicoptero_ataque',
    name: 'Helicóptero de Ataque',
    nameEn: 'Attack Helicopter',
    category: 'special',
    subcategory: 'attack_heli',

    composition: {
      manpower: 200,
      equipment: {
        attack_helicopters: 30
      }
    },

    costs: {
      production: 4000000,
      maintenance: 200000
    },

    stats: {
      softAttack: 35,
      hardAttack: 40,
      defense: 10,
      breakthrough: 25,
      armor: 5,
      piercing: 45,
      hp: 8,
      organization: 40,
      recovery: 0.3,
      reconnaissance: 10,
      suppression: 15,
      weight: 0.5,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 5
    },

    icon: '🚁',
    color: '#be123c'
  },

  // ==================== ANFÍBIOS ====================

  anfibio_mecanizado: {
    id: 'anfibio_mecanizado',
    name: 'Anfíbio Mecanizado',
    nameEn: 'Amphibious Mechanized',
    category: 'amphibious',
    subcategory: 'amtrac',

    composition: {
      manpower: 800,
      equipment: {
        amtrac: 60,
        small_arms: 800,
        light_mg: 80
      }
    },

    costs: {
      production: 3000000,
      maintenance: 150000
    },

    stats: {
      softAttack: 28,
      hardAttack: 6,
      defense: 32,
      breakthrough: 18,
      armor: 8,
      piercing: 8,
      hp: 12,
      organization: 62,
      recovery: 0.4,
      reconnaissance: 4,
      suppression: 13,
      weight: 1.8,
      combatWidth: 2
    },

    requirements: {
      minTechLevel: 3
    },

    icon: '🛶',
    color: '#0891b2'
  }
};

export default combat_units;
