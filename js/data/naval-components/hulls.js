// js/data/naval-components/hulls.js - Naval Hull Types for 1954

export const hulls = {
  // DESTROYERS - Fast escorts and patrol vessels
  "destroyer_standard": {
    name: "Destroyer Padrão",
    displacement: 2400,
    max_speed: 36,
    crew: 330,
    year_introduced: 1940,
    tech_level: 40,
    cost_base: 180000000, // $180M
    main_armament_slots: 3,
    secondary_armament_slots: 6,
    aa_slots: 8,
    torpedo_tubes: 10,
    description: "Destroyer clássico do pós-guerra com bom equilíbrio entre velocidade e armamento",
    advantages: ["Alta velocidade", "Versatilidade", "Boa capacidade AA"],
    role: "escort"
  },
  
  "destroyer_modern": {
    name: "Destroyer Moderno",
    displacement: 2800,
    max_speed: 33,
    crew: 320,
    year_introduced: 1950,
    tech_level: 55,
    cost_base: 250000000, // $250M
    main_armament_slots: 2,
    secondary_armament_slots: 4,
    aa_slots: 6,
    torpedo_tubes: 6,
    description: "Destroyer com sistemas modernos focado em guerra AA e capacidade de mísseis",
    advantages: ["Sistemas avançados", "Preparado para mísseis", "Automação"],
    role: "escort"
  },

  // FRIGATES - Smaller escorts  
  "frigate_asw": {
    name: "Fragata ASW",
    displacement: 1450,
    max_speed: 25,
    crew: 170,
    year_introduced: 1950,
    tech_level: 45,
    cost_base: 120000000, // $120M - fragata ASW
    main_armament_slots: 1,
    secondary_armament_slots: 3,
    aa_slots: 4,
    torpedo_tubes: 6,
    description: "Fragata especializada em guerra anti-submarina com sistemas sonar avançados",
    advantages: ["Baixo custo", "Eficiente ASW", "Fácil manutenção"],
    role: "escort"
  },

  // CORVETTES - Small patrol and escort vessels
  "corvette_patrol": {
    name: "Corveta de Patrulha",
    displacement: 950,
    max_speed: 28,
    crew: 85,
    year_introduced: 1942,
    tech_level: 25,
    cost_base: 45000000, // $45M - realístico para corveta 1954
    main_armament_slots: 1,
    secondary_armament_slots: 2,
    aa_slots: 4,
    torpedo_tubes: 0,
    description: "Corveta pequena para patrulha costeira e escolta de comboios",
    advantages: ["Muito barata", "Fácil produção", "Baixa tripulação"],
    role: "corvette",
    production: {
      build_time_months: 8,  // 8 meses para construir
      workers_required: 1200, // Força de trabalho necessária
      materials_steel_tons: 850, // Aço necessário
      materials_specialty_tons: 45, // Materiais especiais (eletrônicos, etc)
      shipyard_type: "light", // Tipo de estaleiro necessário
      max_parallel: 12, // Máximo que pode ser construído em paralelo
      complexity_rating: 2 // 1-10, afeta chance de atraso
    }
  },

  "corvette_asw": {
    name: "Corveta Anti-Submarina",
    displacement: 1200,
    max_speed: 24,
    crew: 120,
    year_introduced: 1943,
    tech_level: 30,
    cost_base: 65000000, // $65M
    main_armament_slots: 1,
    secondary_armament_slots: 3,
    aa_slots: 6,
    torpedo_tubes: 0,
    description: "Corveta especializada em guerra anti-submarina com sonar e cargas de profundidade",
    advantages: ["Especializada ASW", "Boa autonomia", "Eficiente"],
    role: "corvette"
  },

  "corvette_modern": {
    name: "Corveta Moderna",
    displacement: 1450,
    max_speed: 30,
    crew: 140,
    year_introduced: 1950,
    tech_level: 45,
    cost_base: 85000000, // $85M
    main_armament_slots: 1,
    secondary_armament_slots: 4,
    aa_slots: 8,
    torpedo_tubes: 4,
    description: "Corveta moderna com eletrônicos atualizados e melhor armamento",
    advantages: ["Eletrônicos modernos", "Versátil", "Boa velocidade"],
    role: "corvette"
  },

  // LIGHT CRUISERS - Balanced warships
  "light_cruiser_aa": {
    name: "Cruzador Leve AA",
    displacement: 17000,
    max_speed: 33,
    crew: 1400,
    year_introduced: 1945,
    tech_level: 50,
    cost_base: 750000000, // $750M - cruzador leve AA
    main_armament_slots: 6,
    secondary_armament_slots: 12,
    aa_slots: 24,
    torpedo_tubes: 0,
    description: "Cruzador leve especializado em defesa aérea com artilharia de tiro rápido",
    advantages: ["Excelente AA", "Alta cadência de tiro", "Boa proteção"],
    role: "cruiser"
  },

  "light_cruiser_balanced": {
    name: "Cruzador Leve Balanceado",
    displacement: 11700,
    max_speed: 32.5,
    crew: 1285,
    year_introduced: 1940,
    tech_level: 40,
    cost_base: 620000000, // $620M - cruzador leve
    main_armament_slots: 4,
    secondary_armament_slots: 6,
    aa_slots: 20,
    torpedo_tubes: 0,
    description: "Cruzador leve versátil com bom equilíbrio entre custo e capacidade",
    advantages: ["Versátil", "Custo-benefício", "Confiável"],
    role: "cruiser"
  },

  // HEAVY CRUISERS - Heavy guns and armor
  "heavy_cruiser_advanced": {
    name: "Cruzador Pesado Avançado",
    displacement: 21500,
    max_speed: 33,
    crew: 1800,
    year_introduced: 1948,
    tech_level: 55,
    cost_base: 1200000000, // $1.2B - cruzador pesado avançado
    main_armament_slots: 3,
    secondary_armament_slots: 6,
    aa_slots: 16,
    torpedo_tubes: 0,
    description: "Cruzador pesado moderno com canhões automáticos e sistemas avançados",
    advantages: ["Artilharia automática", "Boa proteção", "Sistemas modernos"],
    role: "cruiser"
  },

  "heavy_cruiser_standard": {
    name: "Cruzador Pesado Padrão",
    displacement: 17000,
    max_speed: 33,
    crew: 1150,
    year_introduced: 1940,
    tech_level: 40,
    cost_base: 950000000, // $950M - cruzador pesado padrão
    main_armament_slots: 3,
    secondary_armament_slots: 6,
    aa_slots: 12,
    torpedo_tubes: 0,
    description: "Cruzador pesado tradicional com armamento pesado e boa mobilidade",
    advantages: ["Bem balanceado", "Boa mobilidade", "Comprovado"],
    role: "cruiser"
  },

  // BATTLESHIPS - Heavy guns and thick armor
  "battleship_fast": {
    name: "Encouraçado Rápido",
    displacement: 58000,
    max_speed: 33,
    crew: 2700,
    year_introduced: 1940,
    tech_level: 45,
    cost_base: 2800000000, // $2.8B - encouraçado rápido
    main_armament_slots: 3,
    secondary_armament_slots: 10,
    aa_slots: 60,
    torpedo_tubes: 0,
    description: "Encouraçado rápido com artilharia pesada e alta velocidade",
    advantages: ["Alta velocidade", "Artilharia devastadora", "Excelente proteção"],
    role: "battleship"
  },

  "battleship_super": {
    name: "Super-Encouraçado",
    displacement: 71000,
    max_speed: 28,
    crew: 2150,
    year_introduced: 1945,
    tech_level: 50,
    cost_base: 4200000000, // $4.2B - super-encouraçado
    main_armament_slots: 4,
    secondary_armament_slots: 10,
    aa_slots: 40,
    torpedo_tubes: 0,
    description: "Super-encouraçado com máxima potência de fogo e proteção suprema",
    advantages: ["Máximo poder de fogo", "Blindagem suprema", "Intimidante"],
    role: "battleship"
  },

  // AIRCRAFT CARRIERS - Aviation platforms
  "carrier_fleet": {
    name: "Porta-Aviões de Esquadra",
    displacement: 36000,
    max_speed: 33,
    crew: 2600,
    aircraft_capacity: 90,
    year_introduced: 1940,
    tech_level: 40,
    cost_base: 3200000000, // $3.2B - porta-aviões esquadra
    main_armament_slots: 0,
    secondary_armament_slots: 4,
    aa_slots: 32,
    torpedo_tubes: 0,
    description: "Porta-aviões padrão com grande capacidade de aeronaves",
    advantages: ["Grande capacidade", "Versatilidade", "Bem protegido"],
    role: "carrier"
  },

  "carrier_heavy": {
    name: "Porta-Aviões Pesado",
    displacement: 60000,
    max_speed: 33,
    crew: 4100,
    aircraft_capacity: 137,
    year_introduced: 1945,
    tech_level: 50,
    cost_base: 3800000000, // $3.8B - porta-aviões pesado
    main_armament_slots: 0,
    secondary_armament_slots: 6,
    aa_slots: 28,
    torpedo_tubes: 0,
    description: "Porta-aviões pesado com deck blindado para operações com jatos",
    advantages: ["Capacidade máxima", "Deck blindado", "Suporte a jatos"],
    role: "carrier"
  },

  "carrier_super": {
    name: "Super Porta-Aviões",
    displacement: 78000,
    max_speed: 34,
    crew: 5500,
    aircraft_capacity: 90,
    year_introduced: 1955,
    tech_level: 65,
    cost_base: 4500000000, // $4.5B - super-porta-aviões
    main_armament_slots: 0,
    secondary_armament_slots: 0,
    aa_slots: 8,
    torpedo_tubes: 0,
    description: "Super-carrier com catapultas a vapor e tecnologia revolucionária",
    advantages: ["Tecnologia revolucionária", "Jatos pesados", "Design moderno"],
    role: "carrier"
  },

  // SUBMARINES - Underwater warfare
  "submarine_diesel": {
    name: "Submarino Diesel-Elétrico",
    displacement: 1530,
    max_speed: 20,
    max_speed_submerged: 9,
    crew: 60,
    year_introduced: 1940,
    tech_level: 35,
    cost_base: 2700000,
    main_armament_slots: 1,
    secondary_armament_slots: 0,
    aa_slots: 1,
    torpedo_tubes: 10,
    description: "Submarino diesel-elétrico padrão para patrulha e ataque",
    advantages: ["Confiável", "Longo alcance", "Comprovado"],
    role: "submarine"
  },

  "submarine_advanced": {
    name: "Submarino Avançado",
    displacement: 1820,
    max_speed: 20,
    max_speed_submerged: 16,
    crew: 80,
    year_introduced: 1950,
    tech_level: 50,
    cost_base: 4200000,
    main_armament_slots: 1,
    secondary_armament_slots: 0,
    aa_slots: 0,
    torpedo_tubes: 8,
    description: "Submarino moderno com melhor hidrodinâmica e performance submersa",
    advantages: ["Alta velocidade submersa", "Hidrodinâmica avançada", "Sistemas modernos"],
    role: "submarine"
  },

  "submarine_nuclear": {
    name: "Submarino Nuclear (Experimental)",
    displacement: 4090,
    max_speed: 25,
    max_speed_submerged: 25,
    crew: 115,
    year_introduced: 1955,
    tech_level: 75,
    cost_base: 480000000, // $480M - submarino nuclear
    main_armament_slots: 0,
    secondary_armament_slots: 0,
    aa_slots: 0,
    torpedo_tubes: 6,
    description: "Submarino nuclear experimental - revolução na guerra submarina",
    advantages: ["Propulsão nuclear", "Velocidade submersa indefinida", "Alcance ilimitado"],
    role: "submarine"
  }
};

export default hulls;