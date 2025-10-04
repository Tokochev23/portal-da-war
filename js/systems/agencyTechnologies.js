/**
 * Árvore de Tecnologias de Inteligência
 * Baseada na era da Guerra Fria (1954-1970+)
 */

// Definição completa de todas as tecnologias disponíveis
export const TECHNOLOGIES = {
  // === ERA 1: FUNDAMENTOS (1954-1957) ===

  tradecraft_basic: {
    id: 'tradecraft_basic',
    name: 'Tradecraft Básico',
    year: 1954,
    era: 1,
    icon: '🎓',
    description: 'Treinamento formal em técnicas de agente: identidades falsas, contatos seguros, evasão, dead drops',
    flavorText: 'Formação essencial para operações encobertas. Todo agente precisa dominar o básico.',
    effects: {
      humintSuccess: 10,
      operativeDetectionReduction: 5,
      fakeIdentitiesPerSemester: 1
    },
    baseCost: 500000000,
    prerequisites: [],
    minTechCivil: 15,
    researchTime: 1,
    category: 'humint'
  },

  sigint_radio: {
    id: 'sigint_radio',
    name: 'Interceptação de Rádio',
    year: 1955,
    era: 1,
    icon: '📡',
    description: 'Equipamentos para escutar comunicações rádio inimigas e catalogar tráfego',
    flavorText: 'As ondas de rádio carregam segredos. Quem souber ouvir, terá vantagem.',
    effects: {
      sigintIntel: 15,
      revealsMovements: true
    },
    baseCost: 750000000,
    prerequisites: ['tradecraft_basic'],
    minTechCivil: 20,
    researchTime: 1,
    category: 'sigint'
  },

  counter_recon_passive: {
    id: 'counter_recon_passive',
    name: 'Contra-Reconhecimento Passivo',
    year: 1956,
    era: 1,
    icon: '🛡️',
    description: 'Unidades de contra-espionagem, triagem de suspeitos, segurança em instalações',
    flavorText: 'Vigilância constante. Todo visitante é um suspeito em potencial.',
    effects: {
      passiveDetection: 20,
      sabotageReduction: 15,
      detectorsPerProvince: 1
    },
    baseCost: 1000000000,
    prerequisites: ['tradecraft_basic'],
    minTechCivil: 20,
    researchTime: 1,
    category: 'counterintel'
  },

  crypto_field: {
    id: 'crypto_field',
    name: 'Criptografia de Campo',
    year: 1957,
    era: 1,
    icon: '🔐',
    description: 'Sistemas de cifra para comunicações (one-time pad limitado, rolos de cifra)',
    flavorText: 'Mensagens que só os destinatários podem ler. A primeira linha de defesa.',
    effects: {
      enemyInterceptionReduction: 25,
      secureCommunications: true
    },
    baseCost: 850000000,
    prerequisites: ['sigint_radio'],
    minTechCivil: 25,
    researchTime: 1,
    category: 'sigint'
  },

  // === ERA 2: OPERAÇÕES AVANÇADAS (1958-1962) ===

  sabotage_industrial: {
    id: 'sabotage_industrial',
    name: 'Sabotagem Industrial',
    year: 1958,
    era: 2,
    icon: '💣',
    description: 'Técnicas para atacar instalações industriais (incêndios, sabotagem, contaminação)',
    flavorText: 'Destruição silenciosa. Uma fábrica parada vale mais que mil soldados.',
    effects: {
      sabotageEnabled: true,
      productionReduction: 25,
      sabotageSuccessBase: 35,
      diplomaticRisk: 'high'
    },
    baseCost: 1250000000,
    prerequisites: ['tradecraft_basic', 'sigint_radio'],
    minTechCivil: 30,
    researchTime: 2,
    category: 'covert_ops'
  },

  direction_finding: {
    id: 'direction_finding',
    name: 'Direction Finding',
    year: 1959,
    era: 2,
    icon: '📍',
    description: 'Triangulação de transmissores rádio e localização de estações clandestinas',
    flavorText: 'Toda transmissão deixa rastros. Nós seguimos esses rastros.',
    effects: {
      locateTransmissions: 30,
      identificationSpeed: 50,
      captureRadioOperatives: true
    },
    baseCost: 180000,
    prerequisites: ['sigint_radio'],
    minTechCivil: 30,
    researchTime: 1,
    category: 'sigint'
  },

  psychological_warfare: {
    id: 'psychological_warfare',
    name: 'Guerra Psicológica',
    year: 1960,
    era: 2,
    icon: '🎭',
    description: 'Propaganda, emissoras clandestinas, panfletagem, apoio a grupos de oposição',
    flavorText: 'Vencer mentes é mais eficaz que vencer batalhas.',
    effects: {
      influenceIdeology: true,
      sowDissent: true,
      stabilityReduction: [8, 15],
      languageBonus: true
    },
    baseCost: 1500000000,
    prerequisites: ['tradecraft_basic', 'crypto_field'],
    minTechCivil: 35,
    researchTime: 2,
    category: 'covert_ops'
  },

  forensic_tactical: {
    id: 'forensic_tactical',
    name: 'Forense Tático',
    year: 1961,
    era: 2,
    icon: '🔬',
    description: 'Investigação para rastrear explosivos, materiais e descobrir autoria de sabotagens',
    flavorText: 'Todo crime deixa evidências. Nós as encontramos.',
    effects: {
      identifyAuthors: 25,
      sabotageEffectReduction: 50,
      forensicAnalysis: true
    },
    baseCost: 1000000000,
    prerequisites: ['counter_recon_passive'],
    minTechCivil: 35,
    researchTime: 1,
    category: 'counterintel'
  },

  cryptanalysis: {
    id: 'cryptanalysis',
    name: 'Criptoanálise',
    year: 1962,
    era: 2,
    icon: '🔓',
    description: 'Quebrar cifras de nível campo (análise estatística, máquinas de apoio)',
    flavorText: 'Nenhum código é inquebrável. Apenas uma questão de tempo e recursos.',
    effects: {
      breakCodes: true,
      passiveIntel: 30,
      duration: 30,
      requiresMaintenance: true
    },
    baseCost: 1750000000,
    prerequisites: ['crypto_field', 'sigint_radio'],
    minTechCivil: 40,
    researchTime: 2,
    category: 'sigint'
  },

  // === ERA 3: SOFISTICAÇÃO (1963-1967) ===

  recruitment_native: {
    id: 'recruitment_native',
    name: 'Recrutamento de Nativos',
    year: 1963,
    era: 3,
    icon: '👥',
    description: 'Recrutar agentes locais com aparência e contatos genuínos',
    flavorText: 'O melhor espião é aquele que pertence ao lugar.',
    effects: {
      recruitmentSuccess: 35,
      nativeDetectionReduction: 15,
      intelBonus: 20
    },
    baseCost: 220000,
    prerequisites: ['tradecraft_basic'],
    minTechCivil: 40,
    researchTime: 2,
    category: 'humint'
  },

  interrogation_advanced: {
    id: 'interrogation_advanced',
    name: 'Interrogatório Avançado',
    year: 1964,
    era: 3,
    icon: '🗣️',
    description: 'Métodos formais para extrair informação de operativos capturados',
    flavorText: 'Todo homem tem um ponto de quebra. Nossa função é encontrá-lo.',
    effects: {
      intelFromCaptured: 50,
      identifyNetworks: true,
      reputationCost: -5
    },
    baseCost: 180000,
    prerequisites: ['forensic_tactical'],
    minTechCivil: 40,
    researchTime: 1,
    category: 'counterintel'
  },

  wiretap: {
    id: 'wiretap',
    name: 'Escutas Telefônicas',
    year: 1965,
    era: 3,
    icon: '📞',
    description: 'Interceptação telefônica em grande escala, técnicas para ocultar escutas',
    flavorText: 'Toda ligação é uma confissão esperando para ser gravada.',
    effects: {
      wiretapEnabled: true,
      internalCommsIntel: 35,
      generatesEvidence: true,
      requiresInsiders: true
    },
    baseCost: 280000,
    prerequisites: ['sigint_radio', 'forensic_tactical'],
    minTechCivil: 45,
    researchTime: 2,
    category: 'sigint'
  },

  sabotage_naval: {
    id: 'sabotage_naval',
    name: 'Sabotagem Naval',
    year: 1966,
    era: 3,
    icon: '⚓',
    description: 'Técnicas contra infraestrutura naval: minas improvisadas, sabotagem em docas',
    flavorText: 'Controlar os mares começa nos portos.',
    effects: {
      harborSabotage: true,
      supplyReduction: 35,
      portSecurityDependent: true
    },
    baseCost: 320000,
    prerequisites: ['sabotage_industrial', 'direction_finding'],
    minTechCivil: 50,
    researchTime: 2,
    category: 'covert_ops'
  },

  surveillance_electronic: {
    id: 'surveillance_electronic',
    name: 'Vigilância Eletrônica',
    year: 1967,
    era: 3,
    icon: '📹',
    description: 'Câmeras simples, microfones escondidos, rastreadores mecânicos',
    flavorText: 'Olhos e ouvidos em todo lugar. Nada passa despercebido.',
    effects: {
      defensiveOpsBonus: 25,
      detectMeetings: 25,
      plantDevice: true
    },
    baseCost: 2000000000,
    prerequisites: ['wiretap', 'forensic_tactical'],
    minTechCivil: 50,
    researchTime: 2,
    category: 'counterintel'
  },

  // === ERA 4: MODERNIZAÇÃO (1968-1970+) ===

  double_agents: {
    id: 'double_agents',
    name: 'Contra-Inteligência Ativa',
    year: 1968,
    era: 4,
    icon: '🎭',
    description: 'Manipular agentes capturados para alimentar desinformação',
    flavorText: 'O maior trunfo é fazer o inimigo acreditar em suas próprias mentiras.',
    effects: {
      turnAgent: true,
      feedFalseIntel: true,
      enemyPlanningReduction: 30,
      exposureRisk: 'high'
    },
    baseCost: 2250000000,
    prerequisites: ['interrogation_advanced', 'cryptanalysis'],
    minTechCivil: 55,
    researchTime: 3,
    category: 'counterintel'
  },

  biometrics_id: {
    id: 'biometrics_id',
    name: 'Sistemas de Identificação',
    year: 1969,
    era: 4,
    icon: '🆔',
    description: 'Sistema centralizado: fotos, impressões digitais, controle de fronteiras',
    flavorText: 'Conhecer cada rosto, cada impressão digital. Controle total.',
    effects: {
      enemyMobilityReduction: 35,
      fakeIdDifficulty: 50,
      borderDetection: 25
    },
    baseCost: 450000,
    prerequisites: ['surveillance_electronic', 'recruitment_native'],
    minTechCivil: 60,
    researchTime: 2,
    category: 'counterintel'
  },

  crypto_automation: {
    id: 'crypto_automation',
    name: 'Automação Cripto & Fusão de Sinais',
    year: 1970,
    era: 4,
    icon: '🖥️',
    description: 'Mainframes iniciais, fusão de dados, alertas em tempo real',
    flavorText: 'A era da computação. Processamento que humanos jamais alcançariam.',
    effects: {
      decryptionSpeedBonus: 40,
      sigintIntelBonus: 20,
      realTimeAlerts: true
    },
    baseCost: 2500000000,
    prerequisites: ['cryptanalysis', 'direction_finding', 'wiretap', 'surveillance_electronic'],
    minTechCivil: 65,
    researchTime: 3,
    category: 'sigint'
  }
};

// Categorias de tecnologias
export const TECH_CATEGORIES = {
  humint: {
    name: 'HUMINT',
    fullName: 'Inteligência Humana',
    icon: '👤',
    color: 'blue'
  },
  sigint: {
    name: 'SIGINT',
    fullName: 'Inteligência de Sinais',
    icon: '📡',
    color: 'cyan'
  },
  counterintel: {
    name: 'Contra-Intel',
    fullName: 'Contra-Inteligência',
    icon: '🛡️',
    color: 'emerald'
  },
  covert_ops: {
    name: 'Ops Encobertas',
    fullName: 'Operações Encobertas',
    icon: '🎭',
    color: 'purple'
  }
};

// Eras para organização visual
export const TECH_ERAS = {
  1: { name: 'Fundamentos', years: '1954-1957', color: 'slate' },
  2: { name: 'Operações Avançadas', years: '1958-1962', color: 'blue' },
  3: { name: 'Sofisticação', years: '1963-1967', color: 'purple' },
  4: { name: 'Modernização', years: '1968-1970+', color: 'amber' }
};

export default TECHNOLOGIES;
