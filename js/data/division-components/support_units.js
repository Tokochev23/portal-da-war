/**
 * @file support_units.js
 * @description Definições de todas as unidades de suporte (companhias) para o Division Designer
 * Baseado no DLC Infantaria - War1954
 *
 * Unidades de suporte fornecem bônus para toda a divisão
 */

export const support_units = {
  // ==================== SUPORTE AÉREO ====================

  suporte_helicoptero_ataque: {
    id: 'suporte_helicoptero_ataque',
    name: 'Suporte: Helicóptero de Ataque',
    nameEn: 'Support: Attack Helicopter',
    category: 'air_support',

    composition: {
      manpower: 80,
      equipment: {
        attack_helicopters: 12
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      softAttack: 15,
      hardAttack: 20,
      piercing: 15,
      reconnaissance: 3
    },

    requirements: {
      minTechLevel: 5
    },

    icon: 'assets/division-icons/unit_attack_helicopter_icon_small.png',
    color: '#dc2626'
  },

  suporte_logistica_aerea: {
    id: 'suporte_logistica_aerea',
    name: 'Suporte: Logística Aérea',
    nameEn: 'Support: Air Logistics',
    category: 'air_support',

    composition: {
      manpower: 1200,
      equipment: {
        utility_helicopters: 60
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    divisionBonuses: {
      organization: 5,
      recovery: 0.05,
      suppression: 3
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/unit_category_helicopter_icon_small.png',
    color: '#0891b2'
  },

  suporte_recon_aereo: {
    id: 'suporte_recon_aereo',
    name: 'Suporte: Reconhecimento Aéreo',
    nameEn: 'Support: Air Reconnaissance',
    category: 'air_support',

    composition: {
      manpower: 80,
      equipment: {
        utility_helicopters: 12
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      reconnaissance: 8,
      combatWidth: 0
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/support_unit_helicopter_recon.png',
    color: '#0369a1'
  },

  suporte_evacuacao_medica: {
    id: 'suporte_evacuacao_medica',
    name: 'Suporte: Evacuação Médica Aérea',
    nameEn: 'Support: Medical Evacuation',
    category: 'air_support',

    composition: {
      manpower: 200,
      equipment: {
        utility_helicopters: 24
      }
    },

    costs: {
      production: 3000000,
      maintenance: 150000
    },

    divisionBonuses: {
      recovery: 0.1,
      organization: 3,
      hp: 2
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/support_unit_field_hospital_icon.png',
    color: '#dc2626'
  },

  // ==================== SUPORTE AEROTRANSPORTADO ====================

  suporte_ifv_aerotrans: {
    id: 'suporte_ifv_aerotrans',
    name: 'Suporte: IFV Aerotransportado',
    nameEn: 'Support: Airborne IFV',
    category: 'airborne_support',

    composition: {
      manpower: 300,
      equipment: {
        ifv: 20
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      softAttack: 10,
      hardAttack: 8,
      armor: 5,
      piercing: 8
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/support_unit_air_mechanized_icon.png',
    color: '#16a34a'
  },

  suporte_tanque_leve_aerotrans: {
    id: 'suporte_tanque_leve_aerotrans',
    name: 'Suporte: Tanque Leve Aerotransportado',
    nameEn: 'Support: Airborne Light Tank',
    category: 'airborne_support',

    composition: {
      manpower: 100,
      equipment: {
        light_tanks: 20
      }
    },

    costs: {
      production: 1400000,
      maintenance: 70000
    },

    divisionBonuses: {
      hardAttack: 12,
      armor: 10,
      piercing: 15,
      breakthrough: 8
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/support_unit_airborne_armored_recon_icon.png',
    color: '#ca8a04'
  },

  // ==================== SUPORTE DE FOGO ====================

  suporte_antiaerea: {
    id: 'suporte_antiaerea',
    name: 'Suporte: Antiaérea',
    nameEn: 'Support: Anti-Aircraft',
    category: 'fire_support',

    composition: {
      manpower: 200,
      equipment: {
        aa_guns: 12,
        trucks: 12
      }
    },

    costs: {
      production: 600000,
      maintenance: 30000
    },

    divisionBonuses: {
      piercing: 5,
      defense: 3
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/support_unit_anti_air_icon.png',
    color: '#92400e'
  },

  suporte_artilharia: {
    id: 'suporte_artilharia',
    name: 'Suporte: Artilharia',
    nameEn: 'Support: Artillery',
    category: 'fire_support',

    composition: {
      manpower: 200,
      equipment: {
        artillery: 12,
        trucks: 12
      }
    },

    costs: {
      production: 500000,
      maintenance: 25000
    },

    divisionBonuses: {
      softAttack: 20,
      hardAttack: 5,
      defense: 5,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/support_unit_art_icon.png',
    color: '#b45309'
  },

  suporte_atcms: {
    id: 'suporte_atcms',
    name: 'Suporte: ATCMS',
    nameEn: 'Support: ATGM',
    category: 'fire_support',

    composition: {
      manpower: 20,
      equipment: {
        atcms: 12
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      hardAttack: 15,
      piercing: 25,
      defense: 4
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/support_unit_at_icon.png',
    color: '#dc2626'
  },

  suporte_manpad: {
    id: 'suporte_manpad',
    name: 'Suporte: MANPAD',
    nameEn: 'Support: MANPAD',
    category: 'fire_support',

    composition: {
      manpower: 20,
      equipment: {
        manpads: 12
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      piercing: 6,
      defense: 4
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/support_unit_at_icon.png',
    color: '#ef4444'
  },

  suporte_lancador_foguete: {
    id: 'suporte_lancador_foguete',
    name: 'Suporte: Lançadores de Foguete',
    nameEn: 'Support: Rocket Launchers',
    category: 'fire_support',

    composition: {
      manpower: 200,
      equipment: {
        rocket_launchers: 12,
        trucks: 12
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      softAttack: 25,
      hardAttack: 8,
      suppression: 5,
      combatWidth: 1
    },

    requirements: {
      minTechLevel: 3
    },

    icon: 'assets/division-icons/support_unit_rocket_art_icon.png',
    color: '#ea580c'
  },

  suporte_spg: {
    id: 'suporte_spg',
    name: 'Suporte: Artilharia Autopropulsada',
    nameEn: 'Support: SPG',
    category: 'fire_support',

    composition: {
      manpower: 200,
      equipment: {
        spg: 8
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      softAttack: 18,
      hardAttack: 6,
      armor: 5,
      defense: 4
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/unit_spa_company_icon.png',
    color: '#a16207'
  },

  suporte_spaa: {
    id: 'suporte_spaa',
    name: 'Suporte: Artilharia AA Autopropulsada',
    nameEn: 'Support: SPAA',
    category: 'fire_support',

    composition: {
      manpower: 200,
      equipment: {
        spaa: 8
      }
    },

    costs: {
      production: 1000000,
      maintenance: 50000
    },

    divisionBonuses: {
      piercing: 8,
      armor: 4,
      defense: 5
    },

    requirements: {
      minTechLevel: 4
    },

    icon: 'assets/division-icons/unit_spaa_company_icon.png',
    color: '#eab308'
  },

  // ==================== RECONHECIMENTO ====================

  suporte_recon_mecanizado: {
    id: 'suporte_recon_mecanizado',
    name: 'Suporte: Reconhecimento Mecanizado',
    nameEn: 'Support: Mechanized Recon',
    category: 'reconnaissance',

    composition: {
      manpower: 200,
      equipment: {
        apc: 20
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    divisionBonuses: {
      reconnaissance: 10,
      armor: 3,
      piercing: 3
    },

    requirements: {
      minTechLevel: 3
    },

    icon: 'assets/division-icons/support_unit_armored_recon_icon.png',
    color: '#15803d'
  },

  suporte_recon_tanque_leve: {
    id: 'suporte_recon_tanque_leve',
    name: 'Suporte: Reconhecimento Tanque Leve',
    nameEn: 'Support: Light Tank Recon',
    category: 'reconnaissance',

    composition: {
      manpower: 100,
      equipment: {
        light_tanks: 20
      }
    },

    costs: {
      production: 1200000,
      maintenance: 60000
    },

    divisionBonuses: {
      reconnaissance: 12,
      armor: 8,
      piercing: 10,
      hardAttack: 5
    },

    requirements: {
      minTechLevel: 3
    },

    icon: 'assets/division-icons/support_unit_armored_car_recon_icon.png',
    color: '#ca8a04'
  },

  suporte_recon_motorizado: {
    id: 'suporte_recon_motorizado',
    name: 'Suporte: Reconhecimento Motorizado',
    nameEn: 'Support: Motorized Recon',
    category: 'reconnaissance',

    composition: {
      manpower: 200,
      equipment: {
        trucks: 20
      }
    },

    costs: {
      production: 400000,
      maintenance: 20000
    },

    divisionBonuses: {
      reconnaissance: 6
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/support_unit_motorized_recon_icon.png',
    color: '#92400e'
  },

  suporte_recon_desmontado: {
    id: 'suporte_recon_desmontado',
    name: 'Suporte: Reconhecimento Desmontado',
    nameEn: 'Support: Dismounted Recon',
    category: 'reconnaissance',

    composition: {
      manpower: 200,
      equipment: {
        binoculars: 200,
        radios: 50
      }
    },

    costs: {
      production: 200000,
      maintenance: 10000
    },

    divisionBonuses: {
      reconnaissance: 4
    },

    requirements: {
      minTechLevel: 1
    },

    icon: 'assets/division-icons/support_unit_rangers_icon.png',
    color: '#65a30d'
  },

  // ==================== LOGÍSTICA E ADMINISTRAÇÃO ====================

  suporte_engenheiros: {
    id: 'suporte_engenheiros',
    name: 'Suporte: Engenheiros',
    nameEn: 'Support: Engineers',
    category: 'logistics',

    composition: {
      manpower: 1400,
      equipment: {
        trucks: 100,
        engineering_equipment: 500
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    divisionBonuses: {
      defense: 8,
      recovery: 0.05,
      organization: 4
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/unit_engineer_icon.png',
    color: '#f59e0b'
  },

  suporte_hospital_campo: {
    id: 'suporte_hospital_campo',
    name: 'Suporte: Hospital de Campo',
    nameEn: 'Support: Field Hospital',
    category: 'logistics',

    composition: {
      manpower: 600,
      equipment: {
        trucks: 100,
        medical_equipment: 300
      }
    },

    costs: {
      production: 1600000,
      maintenance: 80000
    },

    divisionBonuses: {
      recovery: 0.12,
      hp: 3,
      organization: 5
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/support_unit_field_hospital_icon.png',
    color: '#dc2626'
  },

  suporte_logistica_admin: {
    id: 'suporte_logistica_admin',
    name: 'Suporte: Logística e Administração',
    nameEn: 'Support: Logistics & Admin',
    category: 'logistics',

    composition: {
      manpower: 800,
      equipment: {
        trucks: 200,
        radios: 100,
        computers: 50
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    divisionBonuses: {
      organization: 8,
      recovery: 0.06,
      suppression: 2
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/support_unit_logistics_company_icon.png',
    color: '#3b82f6'
  },

  suporte_manutencao_reparo: {
    id: 'suporte_manutencao_reparo',
    name: 'Suporte: Manutenção e Reparo',
    nameEn: 'Support: Maintenance & Repair',
    category: 'logistics',

    composition: {
      manpower: 600,
      equipment: {
        trucks: 200,
        repair_equipment: 400,
        spare_parts: 1000
      }
    },

    costs: {
      production: 4000000,
      maintenance: 200000
    },

    divisionBonuses: {
      recovery: 0.15,
      organization: 6
    },

    requirements: {
      minTechLevel: 3
    },

    icon: 'assets/division-icons/support_unit_maintenance_company_icon.png',
    color: '#ea580c'
  },

  suporte_policia_militar: {
    id: 'suporte_policia_militar',
    name: 'Suporte: Polícia Militar',
    nameEn: 'Support: Military Police',
    category: 'logistics',

    composition: {
      manpower: 1000,
      equipment: {
        utility_vehicles: 200,
        dogs: 100,
        small_arms: 1000
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    divisionBonuses: {
      suppression: 15,
      organization: 7,
      defense: 3
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/support_unit_military_police_icon.png',
    color: '#1e40af'
  },

  suporte_comunicacao_sinal: {
    id: 'suporte_comunicacao_sinal',
    name: 'Suporte: Comunicação e Sinal',
    nameEn: 'Support: Signal',
    category: 'logistics',

    composition: {
      manpower: 200,
      equipment: {
        trucks: 80,
        radios: 200,
        communication_equipment: 100
      }
    },

    costs: {
      production: 2000000,
      maintenance: 100000
    },

    divisionBonuses: {
      reconnaissance: 5,
      organization: 5,
      recovery: 0.04
    },

    requirements: {
      minTechLevel: 2
    },

    icon: 'assets/division-icons/support_unit_signal_company_icon.png',
    color: '#059669'
  }
};

export default support_units;
