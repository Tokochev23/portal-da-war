/**
 * @file basic_templates.js
 * @description Templates básicos de divisões pré-configuradas - War1954
 */

export const basicTemplates = {
  // ==================== INFANTARIA ====================

  infantaria_basica: {
    id: 'infantaria_basica',
    name: 'Divisão de Infantaria Básica',
    description: 'Divisão de infantaria padrão para combate geral',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' }
    ],
    supportUnits: [
      { unitType: 'suporte_artilharia' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_recon_desmontado' }
    ],
    category: 'infantry',
    icon: 'assets/division-icons/unit_infantry_icon.png'
  },

  infantaria_elite: {
    id: 'infantaria_elite',
    name: 'Divisão de Infantaria de Elite',
    description: 'Infantaria de alto nível para operações críticas',
    trainingLevel: 'elite',
    combatUnits: [
      { unitType: 'tropa_choque' },
      { unitType: 'tropa_choque' },
      { unitType: 'tropa_choque' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' },
      { unitType: 'infantaria_linha' }
    ],
    supportUnits: [
      { unitType: 'suporte_artilharia' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_hospital_campo' },
      { unitType: 'suporte_recon_desmontado' }
    ],
    category: 'infantry',
    icon: 'assets/division-icons/unit_heavy_infantry_icon.png'
  },

  // ==================== MOTORIZADA ====================

  infantaria_motorizada: {
    id: 'infantaria_motorizada',
    name: 'Divisão Motorizada',
    description: 'Infantaria com alta mobilidade em estradas',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'carro_armado' },
      { unitType: 'carro_armado' }
    ],
    supportUnits: [
      { unitType: 'suporte_artilharia' },
      { unitType: 'suporte_recon_motorizado' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_antiaerea' }
    ],
    category: 'motorized',
    icon: 'assets/division-icons/unit_motorized_icon.png'
  },

  // ==================== MECANIZADA ====================

  divisao_mecanizada: {
    id: 'divisao_mecanizada',
    name: 'Divisão Mecanizada (IFV)',
    description: 'Divisão mecanizada com IFVs para combate moderno',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' }
    ],
    supportUnits: [
      { unitType: 'suporte_spg' },
      { unitType: 'suporte_recon_mecanizado' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_spaa' },
      { unitType: 'suporte_manutencao_reparo' }
    ],
    category: 'mechanized',
    icon: 'assets/division-icons/unit_mechanized_icon.png'
  },

  // ==================== BLINDADOS ====================

  divisao_blindada: {
    id: 'divisao_blindada',
    name: 'Divisão Blindada',
    description: 'Divisão de tanques pesados para breakthrough',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' }
    ],
    supportUnits: [
      { unitType: 'suporte_spg' },
      { unitType: 'suporte_recon_tanque_leve' },
      { unitType: 'suporte_spaa' },
      { unitType: 'suporte_manutencao_reparo' },
      { unitType: 'suporte_engenheiros' }
    ],
    category: 'armor',
    icon: 'assets/division-icons/unit_mbt_company_icon.png'
  },

  tanques_leves: {
    id: 'tanques_leves',
    name: 'Divisão de Tanques Leves',
    description: 'Blindados leves para reconhecimento e flanqueamento',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'tanque_leve' },
      { unitType: 'tanque_leve' },
      { unitType: 'tanque_leve' },
      { unitType: 'tanque_leve' },
      { unitType: 'tanque_leve' },
      { unitType: 'tanque_leve' },
      { unitType: 'mecanizada_leve_apc' },
      { unitType: 'mecanizada_leve_apc' },
      { unitType: 'mecanizada_leve_apc' },
      { unitType: 'mecanizada_leve_apc' }
    ],
    supportUnits: [
      { unitType: 'suporte_artilharia' },
      { unitType: 'suporte_recon_tanque_leve' },
      { unitType: 'suporte_antiaerea' },
      { unitType: 'suporte_engenheiros' }
    ],
    category: 'armor',
    icon: 'assets/division-icons/unit_light_tank_icon.png'
  },

  // ==================== FORÇAS ESPECIAIS ====================

  paraquedistas: {
    id: 'paraquedistas',
    name: 'Divisão Paraquedista',
    description: 'Forças aerotransportadas para operações especiais',
    trainingLevel: 'elite',
    combatUnits: [
      { unitType: 'paraquedistas' },
      { unitType: 'paraquedistas' },
      { unitType: 'paraquedistas' },
      { unitType: 'paraquedistas' },
      { unitType: 'paraquedistas' },
      { unitType: 'paraquedistas' },
      { unitType: 'paraquedistas' },
      { unitType: 'paraquedistas' },
      { unitType: 'infantaria_leve' },
      { unitType: 'infantaria_leve' }
    ],
    supportUnits: [
      { unitType: 'suporte_tanque_leve_aerotrans' },
      { unitType: 'suporte_ifv_aerotrans' },
      { unitType: 'suporte_artilharia' },
      { unitType: 'suporte_engenheiros' }
    ],
    category: 'special',
    icon: 'assets/division-icons/unit_paratroop_icon.png'
  },

  fuzileiros_navais: {
    id: 'fuzileiros_navais',
    name: 'Divisão de Fuzileiros Navais',
    description: 'Infantaria naval para assaltos anfíbios',
    trainingLevel: 'elite',
    combatUnits: [
      { unitType: 'fuzileiros_navais' },
      { unitType: 'fuzileiros_navais' },
      { unitType: 'fuzileiros_navais' },
      { unitType: 'fuzileiros_navais' },
      { unitType: 'fuzileiros_navais' },
      { unitType: 'fuzileiros_navais' },
      { unitType: 'anfibio_mecanizado' },
      { unitType: 'anfibio_mecanizado' },
      { unitType: 'tanque_anfibio' },
      { unitType: 'tanque_anfibio' }
    ],
    supportUnits: [
      { unitType: 'suporte_artilharia' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_hospital_campo' },
      { unitType: 'suporte_antiaerea' }
    ],
    category: 'special',
    icon: 'assets/division-icons/unit_marine_icon.png'
  },

  montanhistas: {
    id: 'montanhistas',
    name: 'Divisão de Montanha',
    description: 'Especializada em combate em terreno montanhoso',
    trainingLevel: 'elite',
    combatUnits: [
      { unitType: 'montanhistas' },
      { unitType: 'montanhistas' },
      { unitType: 'montanhistas' },
      { unitType: 'montanhistas' },
      { unitType: 'montanhistas' },
      { unitType: 'montanhistas' },
      { unitType: 'montanhistas' },
      { unitType: 'montanhistas' },
      { unitType: 'infantaria_leve' },
      { unitType: 'infantaria_leve' }
    ],
    supportUnits: [
      { unitType: 'suporte_artilharia' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_recon_desmontado' },
      { unitType: 'suporte_hospital_campo' }
    ],
    category: 'special',
    icon: 'assets/division-icons/unit_mountain_icon.png'
  },

  // ==================== ARTILHARIA ====================

  artilharia_pesada: {
    id: 'artilharia_pesada',
    name: 'Divisão de Artilharia Pesada',
    description: 'Suporte de fogo massivo de longo alcance',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'spg' },
      { unitType: 'spg' },
      { unitType: 'spg' },
      { unitType: 'spg' },
      { unitType: 'mlrs' },
      { unitType: 'mlrs' },
      { unitType: 'bateria_artilharia' },
      { unitType: 'bateria_artilharia' },
      { unitType: 'bateria_artilharia' },
      { unitType: 'bateria_artilharia' }
    ],
    supportUnits: [
      { unitType: 'suporte_recon_motorizado' },
      { unitType: 'suporte_spaa' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_manutencao_reparo' }
    ],
    category: 'artillery',
    icon: 'assets/division-icons/unit_spa_company_icon.png'
  },

  // ==================== DEFESA ====================

  defesa_antiaerea: {
    id: 'defesa_antiaerea',
    name: 'Divisão Antiaérea',
    description: 'Especializada em defesa aérea',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'spaa' },
      { unitType: 'spaa' },
      { unitType: 'spaa' },
      { unitType: 'bateria_antiaerea' },
      { unitType: 'bateria_antiaerea' },
      { unitType: 'bateria_antiaerea' },
      { unitType: 'grupo_manpad' },
      { unitType: 'grupo_manpad' },
      { unitType: 'infantaria_motorizada' },
      { unitType: 'infantaria_motorizada' }
    ],
    supportUnits: [
      { unitType: 'suporte_spaa' },
      { unitType: 'suporte_antiaerea' },
      { unitType: 'suporte_recon_motorizado' },
      { unitType: 'suporte_comunicacao_sinal' }
    ],
    category: 'artillery',
    icon: 'assets/division-icons/unit_spaa_company_icon.png'
  },

  // ==================== MISTAS ====================

  forca_tarefa_combinada: {
    id: 'forca_tarefa_combinada',
    name: 'Força-Tarefa Combinada',
    description: 'Divisão balanceada com múltiplos tipos de unidades',
    trainingLevel: 'regular',
    combatUnits: [
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' },
      { unitType: 'tanque_mbt' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'mecanizada_ifv' },
      { unitType: 'spg' },
      { unitType: 'spaa' },
      { unitType: 'helicoptero_ataque' },
      { unitType: 'helicoptero_ataque' }
    ],
    supportUnits: [
      { unitType: 'suporte_recon_mecanizado' },
      { unitType: 'suporte_engenheiros' },
      { unitType: 'suporte_hospital_campo' },
      { unitType: 'suporte_manutencao_reparo' },
      { unitType: 'suporte_comunicacao_sinal' }
    ],
    category: 'combined',
    icon: 'assets/division-icons/unit_mbt_company_icon.png'
  }
};

export default basicTemplates;
