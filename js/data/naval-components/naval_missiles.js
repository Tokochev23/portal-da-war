// js/data/naval-components/naval_missiles.js - Naval Missile Systems for 1954

export const naval_missiles = {
  // SURFACE-TO-AIR MISSILES (SAM)
  "sam_terrier_basic": {
    name: "SAM Terrier Básico",
    type: "surface_to_air",
    range_km: 32,
    max_altitude_m: 18000,
    guidance: "beam_riding",
    warhead_kg: 136,
    launch_weight_kg: 1392,
    launcher_weight_tons: 12,
    cost_per_launcher: 2800000,
    cost_per_missile: 45000,
    missiles_per_launcher: 40, // magazine capacity
    reload_time_seconds: 30,
    year_introduced: 1951,
    tech_level: 65,
    reliability: 0.72,
    description: "Primeiro míssel SAM naval operacional, sistema experimental com guiamento por feixe",
    advantages: ["Pioneiro em SAM naval", "Alcance respeitável", "Capacidade todo-tempo"],
    disadvantages: ["Baixa confiabilidade", "Sistema complexo", "Muito caro"],
    suitable_ships: ["destroyer_modern", "light_cruiser_aa", "heavy_cruiser_advanced"],
    power_consumption_kw: 120,
    crew_required: 8
  },

  "sam_terrier_improved": {
    name: "SAM Terrier Aperfeiçoado",
    type: "surface_to_air",
    range_km: 37,
    max_altitude_m: 20000,
    guidance: "beam_riding_improved",
    warhead_kg: 136,
    launch_weight_kg: 1392,
    launcher_weight_tons: 11,
    cost_per_launcher: 3200000,
    cost_per_missile: 48000,
    missiles_per_launcher: 42,
    reload_time_seconds: 25,
    year_introduced: 1954,
    tech_level: 70,
    reliability: 0.78,
    description: "Versão melhorada do Terrier com maior confiabilidade e alcance",
    advantages: ["Maior confiabilidade", "Alcance estendido", "Melhor precisão"],
    disadvantages: ["Ainda experimental", "Muito caro", "Pesado"],
    suitable_ships: ["destroyer_modern", "light_cruiser_aa", "heavy_cruiser_advanced"],
    power_consumption_kw: 115,
    crew_required: 7
  },

  // CRUISE MISSILES
  "cruise_regulus": {
    name: "Míssel de Cruzeiro Regulus",
    type: "cruise_missile",
    range_km: 926,
    max_altitude_m: 12000,
    guidance: "inertial_radar",
    warhead_kg: 1360, // can carry nuclear warhead
    warhead_nuclear: true,
    launch_weight_kg: 6350,
    launcher_weight_tons: 8,
    cost_per_launcher: 4500000,
    cost_per_missile: 285000,
    missiles_per_launcher: 4, // external storage
    reload_time_minutes: 45,
    year_introduced: 1953,
    tech_level: 68,
    reliability: 0.75,
    description: "Míssel de cruzeiro de longo alcance, capaz de portar ogiva nuclear",
    advantages: ["Longo alcance", "Capacidade nuclear", "Baixo voo"],
    disadvantages: ["Muito grande", "Lento carregamento", "Detectável"],
    suitable_ships: ["heavy_cruiser_advanced", "battleship_fast", "submarine_advanced", "submarine_nuclear"],
    power_consumption_kw: 80,
    crew_required: 6,
    storage_requirements: "external_deck"
  },

  // ANTI-SHIP MISSILES (Early development)
  "asm_experimental": {
    name: "Míssel Anti-Navio Experimental",
    type: "anti_ship",
    range_km: 48,
    guidance: "radar_homing",
    warhead_kg: 365,
    launch_weight_kg: 1950,
    launcher_weight_tons: 6,
    cost_per_launcher: 3800000,
    cost_per_missile: 125000,
    missiles_per_launcher: 8,
    reload_time_seconds: 60,
    year_introduced: 1954,
    tech_level: 72,
    reliability: 0.68,
    description: "Míssel experimental anti-navio com guiamento radar ativo",
    advantages: ["Guiamento autônomo", "Boa penetração", "Compacto"],
    disadvantages: ["Muito experimental", "Baixa confiabilidade", "Alcance limitado"],
    suitable_ships: ["destroyer_modern", "light_cruiser_aa", "heavy_cruiser_advanced"],
    power_consumption_kw: 95,
    crew_required: 5
  },

  // ANTI-SUBMARINE WEAPONS (Proto-ASROC)
  "asw_rocket_basic": {
    name: "Foguete ASW Básico",
    type: "anti_submarine",
    range_km: 8,
    guidance: "ballistic",
    warhead_kg: 136, // depth charge or torpedo
    warhead_type: "depth_charge",
    launch_weight_kg: 485,
    launcher_weight_tons: 4,
    cost_per_launcher: 850000,
    cost_per_missile: 18000,
    missiles_per_launcher: 24,
    reload_time_seconds: 15,
    year_introduced: 1952,
    tech_level: 60,
    reliability: 0.85,
    description: "Foguete ASW de curto alcance para defesa próxima",
    advantages: ["Confiável", "Resposta rápida", "Barato"],
    disadvantages: ["Curto alcance", "Básico", "Balístico apenas"],
    suitable_ships: ["destroyer_standard", "destroyer_modern", "frigate_asw"],
    power_consumption_kw: 25,
    crew_required: 4
  }
};

export const missile_launchers = {
  "mk10_twin_terrier": {
    name: "Lançador Duplo Mk 10 (Terrier)",
    type: "twin_rail",
    missiles_ready: 2,
    magazine_capacity: 40,
    elevation_degrees: 85,
    training_degrees: 360,
    weight_tons: 12,
    cost: 2800000,
    compatible_missiles: ["sam_terrier_basic", "sam_terrier_improved"],
    description: "Lançador duplo padrão para mísseis Terrier"
  },

  "mk13_single_terrier": {
    name: "Lançador Simples Mk 13 (Terrier)",
    type: "single_rail",
    missiles_ready: 1,
    magazine_capacity: 40,
    elevation_degrees: 85,
    training_degrees: 360,
    weight_tons: 10,
    cost: 2200000,
    compatible_missiles: ["sam_terrier_basic", "sam_terrier_improved"],
    description: "Lançador simples compacto para Terrier"
  },

  "regulus_launcher": {
    name: "Lançador Regulus",
    type: "cruise_rail",
    missiles_ready: 1,
    storage_capacity: 4,
    elevation_degrees: 45,
    training_degrees: 270,
    weight_tons: 8,
    cost: 4500000,
    compatible_missiles: ["cruise_regulus"],
    description: "Lançador de convés para mísseis Regulus",
    requires_external_storage: true
  },

  "experimental_asm_launcher": {
    name: "Lançador ASM Experimental",
    type: "box_launcher",
    missiles_ready: 4,
    magazine_capacity: 8,
    elevation_degrees: 30,
    training_degrees: 180,
    weight_tons: 6,
    cost: 3800000,
    compatible_missiles: ["asm_experimental"],
    description: "Lançador experimental para mísseis anti-navio"
  },

  "asw_rocket_launcher": {
    name: "Lançador de Foguetes ASW",
    type: "multi_barrel",
    missiles_ready: 24,
    magazine_capacity: 120,
    elevation_degrees: 60,
    training_degrees: 360,
    weight_tons: 4,
    cost: 850000,
    compatible_missiles: ["asw_rocket_basic"],
    description: "Lançador multi-tubo para foguetes ASW"
  }
};

export const guidance_systems = {
  "an_spg_49": {
    name: "Radar de Controle AN/SPG-49",
    type: "fire_control_radar",
    max_targets: 2,
    max_range_km: 150,
    guidance_type: "beam_riding",
    weight_tons: 8,
    cost: 1200000,
    power_consumption_kw: 180,
    compatible_missiles: ["sam_terrier_basic", "sam_terrier_improved"],
    description: "Radar de controle de tiro para mísseis Terrier"
  },

  "inertial_guidance": {
    name: "Sistema Inercial Básico",
    type: "inertial_navigation",
    accuracy_cep_m: 3000, // 3km CEP at max range
    weight_tons: 2,
    cost: 450000,
    power_consumption_kw: 45,
    compatible_missiles: ["cruise_regulus"],
    description: "Sistema de navegação inercial para mísseis de cruzeiro"
  },

  "radar_seeker": {
    name: "Buscador Radar Ativo",
    type: "active_radar",
    acquisition_range_km: 25,
    weight_tons: 1,
    cost: 380000,
    power_consumption_kw: 35,
    compatible_missiles: ["asm_experimental"],
    description: "Buscador radar ativo para mísseis anti-navio"
  }
};

export const missile_magazines = {
  "terrier_magazine": {
    name: "Paiol de Mísseis Terrier",
    capacity: 40,
    weight_tons: 45, // including missiles
    cost: 800000,
    reload_mechanism: "automatic",
    protection_level: "armored",
    compatible_missiles: ["sam_terrier_basic", "sam_terrier_improved"],
    description: "Paiol blindado com sistema de recarga automática"
  },

  "regulus_hangar": {
    name: "Hangar Regulus",
    capacity: 4,
    weight_tons: 28,
    cost: 650000,
    reload_mechanism: "crane",
    protection_level: "weatherproof",
    compatible_missiles: ["cruise_regulus"],
    description: "Hangar pressurizado para mísseis de cruzeiro",
    requires_deck_space: true
  },

  "small_missile_magazine": {
    name: "Paiol de Mísseis Pequeno",
    capacity: 16,
    weight_tons: 18,
    cost: 420000,
    reload_mechanism: "manual",
    protection_level: "basic",
    compatible_missiles: ["asm_experimental", "asw_rocket_basic"],
    description: "Paiol básico para mísseis pequenos e foguetes"
  }
};

export default { naval_missiles, missile_launchers, guidance_systems, missile_magazines };