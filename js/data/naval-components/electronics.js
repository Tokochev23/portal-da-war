// js/data/naval-components/electronics.js - Naval Electronics Systems for 1954

export const radar_systems = {
  // BASIC RADARS - Para navios menores
  "so_3_basic": {
    name: "Radar SO-3 Básico",
    type: "surface_search",
    frequency_band: "X",
    max_range_miles: 25,
    max_altitude_feet: 15000,
    antenna_diameter_feet: 4,
    weight_tons: 1.2,
    power_consumption_kw: 45,
    crew_required: 2,
    cost: 85000,
    year_introduced: 1943,
    tech_level: 25,
    description: "Radar básico para detecção de superfície e baixa altitude",
    suitable_ships: ["escort", "patrol", "minesweeper", "destroyer_escort", "frigate"],
    advantages: ["Barato", "Simples", "Confiável"],
    disadvantages: ["Alcance limitado", "Sem IFF"],
    reliability: 0.90,
    detection_capability: {
      surface_ships: 20,
      low_aircraft: 15,
      periscopes: 8
    },
    iff_compatible: false
  },

  "sg_radar_compact": {
    name: "Radar SG Compacto",
    type: "surface_search",
    frequency_band: "S",
    max_range_miles: 35,
    max_altitude_feet: 20000,
    antenna_diameter_feet: 6,
    weight_tons: 2.1,
    power_consumption_kw: 65,
    crew_required: 2,
    cost: 125000,
    year_introduced: 1945,
    tech_level: 30,
    description: "Radar de superfície melhorado para destroyers",
    suitable_ships: ["destroyer_escort", "frigate", "destroyer", "corvette"],
    advantages: ["Bom custo-benefício", "Versátil", "Moderado consumo"],
    disadvantages: ["Alcance moderado", "Antena visível"],
    reliability: 0.88,
    detection_capability: {
      surface_ships: 30,
      aircraft: 25,
      small_boats: 12
    },
    iff_compatible: true
  },

  // AIR SEARCH RADARS
  "an_sps_6": {
    name: "Radar de Busca Aérea AN/SPS-6",
    type: "air_search",
    frequency_band: "S",
    max_range_miles: 120,
    max_altitude_feet: 40000,
    antenna_diameter_feet: 15,
    weight_tons: 6.2,
    power_consumption_kw: 180,
    crew_required: 4,
    cost: 450000,
    year_introduced: 1953,
    tech_level: 45,
    description: "Radar de busca aérea de longo alcance com alta precisão",
    suitable_ships: ["destroyer", "destroyer_escort", "frigate", "cruiser", "battleship", "carrier"],
    advantages: ["Longo alcance", "Alta precisão", "Todo tempo"],
    disadvantages: ["Consumo moderado", "Complexo", "Grande antena"],
    reliability: 0.85,
    detection_capability: {
      fighter_aircraft: 80, // miles
      bomber_aircraft: 120,
      missiles: 45
    },
    iff_compatible: true
  },

  "an_sps_8": {
    name: "Radar de Busca Aérea AN/SPS-8",
    type: "air_search",
    frequency_band: "L",
    max_range_miles: 200,
    max_altitude_feet: 50000,
    antenna_diameter_feet: 18,
    weight_tons: 12.3,
    power_consumption_kw: 350,
    crew_required: 8,
    cost: 1200000,
    year_introduced: 1954,
    tech_level: 65,
    description: "Radar de busca aérea avançado para detecção de longo alcance",
    suitable_ships: ["cruiser", "battleship", "carrier"],
    advantages: ["Alcance máximo", "Alta resolução", "Resistente ECM"],
    disadvantages: ["Muito caro", "Pesado", "Energia intensiva"],
    reliability: 0.82,
    detection_capability: {
      fighter_aircraft: 120,
      bomber_aircraft: 200,
      missiles: 65
    },
    iff_compatible: true,
    ecm_resistance: "medium"
  },

  // SURFACE SEARCH RADARS
  "an_sps_10": {
    name: "Radar de Superfície AN/SPS-10",
    type: "surface_search",
    frequency_band: "X",
    max_range_miles: 25,
    antenna_rotation_rpm: 15,
    weight_tons: 2.8,
    power_consumption_kw: 85,
    crew_required: 3,
    cost: 320000,
    year_introduced: 1953,
    tech_level: 58,
    description: "Radar de navegação e busca de superfície de alta resolução",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier", "escort"],
    advantages: ["Alta resolução", "Compacto", "Confiável"],
    disadvantages: ["Alcance limitado", "Tempo sensível", "X-band vulnerável"],
    reliability: 0.90,
    detection_capability: {
      large_ships: 25, // miles
      small_ships: 12,
      periscopes: 3,
      aircraft_low: 15
    },
    weather_capable: false
  },

  // FIRE CONTROL RADARS
  "an_spg_49": {
    name: "Radar Controle de Tiro AN/SPG-49",
    type: "fire_control",
    frequency_band: "X",
    max_range_miles: 35,
    tracking_accuracy: "0.1_mil",
    weight_tons: 5.2,
    power_consumption_kw: 120,
    crew_required: 4,
    cost: 680000,
    year_introduced: 1951,
    tech_level: 55,
    description: "Sistema de controle de tiro para artilharia naval e mísseis",
    suitable_ships: ["destroyer", "cruiser", "battleship"],
    advantages: ["Alta precisão", "Rastreamento automático", "Dual-purpose"],
    disadvantages: ["Alcance médio", "X-band limitações", "Caro"],
    reliability: 0.88,
    compatible_weapons: ["5inch_guns", "6inch_guns", "8inch_guns", "terrier_missiles"],
    simultaneous_targets: 2,
    elevation_tracking: 85 // degrees
  },

  "an_spg_55": {
    name: "Radar Controle de Tiro AN/SPG-55",
    type: "fire_control",
    frequency_band: "X",
    max_range_miles: 40,
    tracking_accuracy: "0.05_mil",
    weight_tons: 6.8,
    power_consumption_kw: 180,
    crew_required: 3, // more automated
    cost: 950000,
    year_introduced: 1955,
    tech_level: 68,
    description: "Sistema de controle avançado com automação melhorada",
    suitable_ships: ["cruiser", "battleship"],
    advantages: ["Máxima precisão", "Automação", "Multi-target"],
    disadvantages: ["Muito caro", "Complexo", "Manutenção intensiva"],
    reliability: 0.85,
    compatible_weapons: ["6inch_guns", "8inch_guns", "14inch_guns", "16inch_guns"],
    simultaneous_targets: 4,
    elevation_tracking: 90,
    automatic_tracking: true
  }
};

export const sonar_systems = {
  // BASIC SONARS - Para navios menores
  "qc_sonar_basic": {
    name: "Sonar QC Básico",
    type: "hull_mounted",
    frequency_khz: 15,
    max_range_yards: 2000,
    max_depth_detection_feet: 800,
    weight_tons: 1.8,
    power_consumption_kw: 25,
    crew_required: 2,
    cost: 95000,
    year_introduced: 1943,
    tech_level: 25,
    description: "Sonar básico para guerra anti-submarina",
    suitable_ships: ["destroyer_escort", "frigate", "corvette", "patrol"],
    advantages: ["Barato", "Simples", "Confiável"],
    disadvantages: ["Alcance limitado", "Resolução baixa"],
    reliability: 0.92,
    passive_capable: false,
    active_only: true
  },

  "qhu_improved": {
    name: "Sonar QHU Melhorado", 
    type: "hull_mounted",
    frequency_khz: 12,
    max_range_yards: 3200,
    max_depth_detection_feet: 1200,
    weight_tons: 2.8,
    power_consumption_kw: 40,
    crew_required: 3,
    cost: 165000,
    year_introduced: 1948,
    tech_level: 35,
    description: "Sonar melhorado para destroyers padrão",
    suitable_ships: ["destroyer", "frigate", "destroyer_escort"],
    advantages: ["Bom alcance", "Dual-mode", "Custo razoável"],
    disadvantages: ["Peso moderado", "Necessita manutenção"],
    reliability: 0.89,
    passive_capable: true,
    active_capable: true
  },

  // HULL-MOUNTED SONARS
  "an_sqs_4": {
    name: "Sonar de Casco AN/SQS-4",
    type: "hull_mounted",
    frequency_khz: 10,
    max_range_yards: 4000,
    max_depth_detection_feet: 1500,
    weight_tons: 3.5,
    power_consumption_kw: 55,
    crew_required: 3,
    cost: 285000,
    year_introduced: 1952,
    tech_level: 45,
    description: "Sonar ativo padrão para detecção de submarinos",
    suitable_ships: ["destroyer", "escort", "frigate"],
    advantages: ["Confiável", "Boa detecção", "Comprovado"],
    disadvantages: ["Revela posição", "Alcance limitado", "Vulnerável ECM"],
    reliability: 0.87,
    detection_capability: {
      submarine_submerged: 3500, // yards
      submarine_snorkel: 4000,
      torpedo_wake: 800,
      mines: 400
    },
    active_passive: "both"
  },

  "an_sqs_23": {
    name: "Sonar Avançado AN/SQS-23",
    type: "hull_mounted",
    frequency_khz: 3.5,
    max_range_yards: 8000,
    max_depth_detection_feet: 2500,
    weight_tons: 6.8,
    power_consumption_kw: 120,
    crew_required: 6,
    cost: 750000,
    year_introduced: 1954,
    tech_level: 62,
    description: "Sonar de baixa frequência para detecção de longo alcance",
    suitable_ships: ["destroyer", "cruiser", "carrier"],
    advantages: ["Longo alcance", "Baixa frequência", "Penetração profunda"],
    disadvantages: ["Muito caro", "Complexo", "Tamanho grande"],
    reliability: 0.82,
    detection_capability: {
      submarine_submerged: 7000,
      submarine_snorkel: 8000,
      torpedo_wake: 1200,
      thermal_layers: true
    },
    active_passive: "both",
    variable_depth: false
  },

  // VARIABLE DEPTH SONARS
  "an_sqs_35": {
    name: "Sonar Profundidade Variável AN/SQS-35",
    type: "variable_depth",
    frequency_khz: 8,
    max_range_yards: 12000,
    operating_depth_feet: 600,
    weight_tons: 12.5,
    power_consumption_kw: 200,
    crew_required: 8,
    cost: 1400000,
    year_introduced: 1955,
    tech_level: 70,
    description: "Sonar rebocado para evitar camadas térmicas",
    suitable_ships: ["destroyer", "cruiser"],
    advantages: ["Evita camadas térmicas", "Máximo alcance", "Flexibilidade"],
    disadvantages: ["Extremamente caro", "Complexo", "Velocidade limitada"],
    reliability: 0.78,
    detection_capability: {
      submarine_submerged: 12000,
      submarine_snorkel: 15000,
      deep_targets: true
    },
    active_passive: "both",
    towed_array: true,
    max_speed_knots: 15 // speed limitation when deployed
  }
};

export const communication_systems = {
  // BASIC COMMUNICATIONS - Para navios menores
  "tbs_basic": {
    name: "TBS Talk-Between-Ships",
    type: "vhf_radio",
    frequency_range: "60-80_mhz",
    max_range_miles: 25,
    power_output_watts: 35,
    weight_tons: 0.3,
    power_consumption_kw: 8,
    crew_required: 1,
    cost: 15000,
    year_introduced: 1940,
    tech_level: 20,
    description: "Comunicação básica de curto alcance entre navios",
    suitable_ships: ["escort", "patrol", "minesweeper", "destroyer_escort", "frigate", "destroyer"],
    advantages: ["Muito barato", "Simples", "Confiável", "Pequeno"],
    disadvantages: ["Alcance limitado", "Line-of-sight", "Sem criptografia"],
    reliability: 0.95,
    encryption_capable: false,
    voice_data: "voice"
  },

  "an_trc_6_compact": {
    name: "Rádio Portátil AN/TRC-6",
    type: "portable_radio",
    frequency_range: "2-18_mhz",
    max_range_miles: 500,
    power_output_watts: 150,
    weight_tons: 0.6,
    power_consumption_kw: 12,
    crew_required: 1,
    cost: 35000,
    year_introduced: 1945,
    tech_level: 30,
    description: "Sistema rádio compacto para pequenos navios",
    suitable_ships: ["destroyer_escort", "frigate", "corvette", "destroyer", "patrol"],
    advantages: ["Compacto", "Versátil", "Baixo consumo", "Móvel"],
    disadvantages: ["Potência limitada", "Antena pequena", "Alcance variável"],
    reliability: 0.90,
    encryption_capable: false,
    voice_data: "voice"
  },

  // RADIO COMMUNICATIONS
  "an_arc_27": {
    name: "Sistema Rádio AN/ARC-27",
    type: "hf_radio",
    frequency_range: "2-30_mhz",
    max_range_miles: 2000,
    power_output_watts: 400,
    weight_tons: 1.2,
    power_consumption_kw: 25,
    crew_required: 2,
    cost: 85000,
    year_introduced: 1950,
    tech_level: 35,
    description: "Sistema de comunicação HF para longo alcance",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier", "escort"],
    advantages: ["Longo alcance", "Confiável", "Padrão"],
    disadvantages: ["Ionosfera dependente", "Qualidade variável", "Interceptável"],
    reliability: 0.92,
    encryption_capable: false,
    voice_data: "voice"
  },

  "an_wrc_1": {
    name: "Comunicações Seguras AN/WRC-1",
    type: "secure_radio",
    frequency_range: "2-30_mhz",
    max_range_miles: 1500,
    power_output_watts: 200,
    weight_tons: 2.8,
    power_consumption_kw: 45,
    crew_required: 4,
    cost: 280000,
    year_introduced: 1953,
    tech_level: 62,
    description: "Sistema de comunicação criptografada para comando",
    suitable_ships: ["cruiser", "battleship", "carrier"],
    advantages: ["Criptografia", "Seguro", "Anti-intercepção"],
    disadvantages: ["Caro", "Complexo", "Alcance limitado"],
    reliability: 0.85,
    encryption_capable: true,
    voice_data: "both",
    crypto_equipment: "kl_7"
  },

  // TACTICAL COMMUNICATIONS
  "tbs_system": {
    name: "Sistema TBS (Talk Between Ships)",
    type: "vhf_tactical",
    frequency_range: "60-80_mhz",
    max_range_miles: 25,
    power_output_watts: 50,
    weight_tons: 0.4,
    power_consumption_kw: 8,
    crew_required: 1,
    cost: 25000,
    year_introduced: 1942,
    tech_level: 35,
    description: "Comunicação tática de curto alcance entre navios",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier", "escort"],
    advantages: ["Simples", "Confiável", "Barato"],
    disadvantages: ["Curto alcance", "Não criptografado", "VHF limitações"],
    reliability: 0.95,
    encryption_capable: false,
    voice_data: "voice",
    line_of_sight: true
  }
};

export const electronic_warfare = {
  // ELECTRONIC COUNTERMEASURES
  "an_spr_2": {
    name: "Receptor de Alerta Radar AN/SPR-2",
    type: "radar_warning",
    frequency_coverage: "1-18_ghz",
    detection_range_miles: 150,
    weight_tons: 0.8,
    power_consumption_kw: 15,
    crew_required: 2,
    cost: 120000,
    year_introduced: 1954,
    tech_level: 58,
    description: "Sistema de alerta precoce contra radares inimigos",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    advantages: ["Detecção precoce", "Cobertura ampla", "Passivo"],
    disadvantages: ["Não identifica tipo", "Limitado", "Novo"],
    reliability: 0.82,
    threat_library: "limited",
    bearing_accuracy: "medium"
  },

  "an_spq_5": {
    name: "Jammer Eletrônico AN/SPQ-5",
    type: "active_jammer",
    frequency_coverage: "8-12_ghz",
    jammer_power_watts: 5000,
    weight_tons: 3.2,
    power_consumption_kw: 180,
    crew_required: 4,
    cost: 450000,
    year_introduced: 1955,
    tech_level: 65,
    description: "Sistema ativo de interferência eletrônica contra radares",
    suitable_ships: ["cruiser", "battleship", "carrier"],
    advantages: ["Interferência ativa", "Potente", "Múltiplas ameaças"],
    disadvantages: ["Muito caro", "Revela posição", "Experimental"],
    reliability: 0.75,
    simultaneous_targets: 3,
    burn_through_resistance: "medium"
  },

  // DECOY SYSTEMS
  "mk_36_chaff": {
    name: "Sistema de Chaff Mk 36",
    type: "chaff_dispenser",
    chaff_rounds: 200,
    effectiveness_duration_minutes: 12,
    weight_tons: 1.5,
    cost: 85000,
    year_introduced: 1952,
    tech_level: 50,
    description: "Dispensador automático de chaff para confundir radares",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    advantages: ["Automático", "Múltiplos usos", "Efetivo"],
    disadvantages: ["Temporário", "Limitado", "Vento dependente"],
    reliability: 0.90,
    radar_bands_covered: ["X", "S", "C"],
    launch_patterns: ["single", "salvo", "continuous"]
  }
};

export const navigation_systems = {
  // BASIC NAVIGATION - Para todos os navios
  "magnetic_compass": {
    name: "Bússola Magnética Padrão",
    type: "magnetic_compass",
    accuracy_degrees: 2,
    weight_tons: 0.05,
    power_consumption_kw: 0,
    crew_required: 0,
    cost: 2500,
    year_introduced: 1900,
    tech_level: 5,
    description: "Bússola magnética básica para navegação",
    suitable_ships: ["escort", "patrol", "minesweeper", "destroyer_escort", "frigate", "destroyer", "cruiser"],
    advantages: ["Muito barato", "Sem energia", "Confiável", "Simples"],
    disadvantages: ["Desvio magnético", "Impreciso", "Manual"],
    reliability: 0.98,
    all_weather: true
  },

  "gyrocompass_mk_14": {
    name: "Giroscópio de Navegação Mk 14",
    type: "gyrocompass", 
    accuracy_degrees: 0.5,
    weight_tons: 0.8,
    power_consumption_kw: 12,
    crew_required: 1,
    cost: 35000,
    year_introduced: 1942,
    tech_level: 25,
    description: "Giroscópio para navegação precisa",
    suitable_ships: ["destroyer_escort", "frigate", "destroyer", "cruiser", "battleship"],
    advantages: ["Muito preciso", "Sem desvio magnético", "Automático"],
    disadvantages: ["Precisa energia", "Sensível", "Manutenção"],
    reliability: 0.92,
    settling_time_hours: 2
  },

  "surface_radar_nav": {
    name: "Radar Navegação SU Simples",
    type: "surface_navigation",
    frequency_band: "X",
    max_range_miles: 8,
    minimum_range_yards: 25,
    weight_tons: 0.9,
    power_consumption_kw: 18,
    crew_required: 1,
    cost: 65000,
    year_introduced: 1945,
    tech_level: 30,
    description: "Radar básico para navegação costeira",
    suitable_ships: ["destroyer_escort", "frigate", "destroyer", "patrol"],
    advantages: ["Barato", "Simples", "Todo tempo"],
    disadvantages: ["Alcance limitado", "Sem precisão", "PPI básico"],
    reliability: 0.88,
    ppi_display: true
  },

  // NAVIGATION RADARS
  "an_sps_53": {
    name: "Radar de Navegação AN/SPS-53",
    type: "navigation",
    frequency_band: "X",
    max_range_miles: 12,
    minimum_range_yards: 50,
    weight_tons: 1.8,
    power_consumption_kw: 35,
    crew_required: 2,
    cost: 125000,
    year_introduced: 1953,
    tech_level: 40,
    description: "Radar de navegação preciso para operações portuárias",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier", "escort"],
    advantages: ["Alta resolução", "Mínimo alcance", "Navegação precisa"],
    disadvantages: ["Curto alcance", "Tempo sensível", "Apenas navegação"],
    reliability: 0.93,
    resolution_feet: 25,
    bearing_accuracy_degrees: 0.5
  },

  // GYROSCOPIC SYSTEMS
  "mk_19_gyro": {
    name: "Giroscópio Naval Mk 19",
    type: "gyroscopic_compass",
    accuracy_degrees: 0.1,
    settling_time_minutes: 45,
    weight_tons: 2.2,
    power_consumption_kw: 12,
    cost: 150000,
    year_introduced: 1945,
    tech_level: 42,
    description: "Sistema giroscópico de alta precisão para navegação",
    suitable_ships: ["destroyer", "cruiser", "battleship", "carrier"],
    advantages: ["Alta precisão", "Não magnético", "Confiável"],
    disadvantages: ["Tempo de aquecimento", "Caro", "Manutenção"],
    reliability: 0.96,
    latitude_compensation: true,
    shock_resistant: true
  }
};

export const data_processing = {
  // COMBAT INFORMATION CENTERS
  "cic_basic": {
    name: "Centro de Informações de Combate Básico",
    type: "combat_information_center",
    plotting_positions: 6,
    radar_repeaters: 4,
    communication_circuits: 8,
    weight_tons: 8.5,
    power_consumption_kw: 85,
    crew_required: 12,
    cost: 320000,
    year_introduced: 1944,
    tech_level: 45,
    description: "Centro básico para coordenação de informações de combate",
    suitable_ships: ["destroyer", "cruiser"],
    advantages: ["Coordenação centralizada", "Múltiplas fontes", "Comprovado"],
    disadvantages: ["Manual", "Limitado", "Intensivo em pessoal"],
    reliability: 0.88,
    data_sources: ["radar", "sonar", "visual", "radio"]
  },

  "cic_advanced": {
    name: "Centro de Informações Avançado",
    type: "combat_information_center",
    plotting_positions: 12,
    radar_repeaters: 8,
    communication_circuits: 16,
    weight_tons: 15.2,
    power_consumption_kw: 180,
    crew_required: 20,
    cost: 750000,
    year_introduced: 1950,
    tech_level: 58,
    description: "Centro avançado com capacidades de comando de esquadra",
    suitable_ships: ["cruiser", "battleship", "carrier"],
    advantages: ["Capacidade comando", "Múltiplas ameaças", "Integração"],
    disadvantages: ["Muito caro", "Complexo", "Grande pessoal"],
    reliability: 0.85,
    data_sources: ["radar", "sonar", "visual", "radio", "data_link"],
    command_capability: true
  }
};

export default { 
  radar_systems, 
  sonar_systems, 
  communication_systems, 
  electronic_warfare, 
  navigation_systems, 
  data_processing 
};