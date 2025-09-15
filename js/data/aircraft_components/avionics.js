export const avionics = {
    // === Sistemas de Comunicação ===
    radio_scr_274: {
        name: "Rádio SCR-274-N",
        description: "Conjunto de rádio padrão para aeronaves americanas da Segunda Guerra. Confiável, mas pesado.",
        type: "communication",
        cost: 12000,
        weight: 45, // kg
        drag_penalty: 0.0001, // Antena externa
        tech_level: 20,
        year_introduced: 1945
    },
    radio_fu_g_17: {
        name: "Rádio FuG 17",
        description: "Rádio VHF para comunicação ar-terra e navegação. Padrão da Luftwaffe.",
        type: "communication",
        cost: 15000,
        weight: 30, // kg
        drag_penalty: 0.0001,
        tech_level: 25,
        year_introduced: 1945
    },
    radio_arc_27: {
        name: "Rádio AN/ARC-27",
        description: "Rádio UHF moderno do início da Guerra Fria, com mais canais e maior clareza.",
        type: "communication",
        cost: 25000,
        weight: 25, // kg
        drag_penalty: 0.00005, // Antena mais aerodinâmica
        tech_level: 65,
        year_introduced: 1952
    },

    // === Sistemas de Navegação ===
    nav_basic: {
        name: "Instrumentos de Voo Básicos",
        description: "Conjunto padrão de altímetro, velocímetro e bússola magnética.",
        type: "navigation",
        cost: 5000,
        weight: 10,
        drag_penalty: 0,
        tech_level: 10,
        year_introduced: 1945
    },
    nav_rdf: {
        name: "Rádio Direção (RDF)",
        description: "Permite navegar se orientando por estações de rádio em terra (beacons).",
        type: "navigation",
        cost: 18000,
        weight: 20,
        drag_penalty: 0.0002, // Antena de loop
        tech_level: 35,
        year_introduced: 1948
    },
    nav_vor: {
        name: "Navegação VOR",
        description: "Sistema de navegação por rádio VHF muito mais preciso que o RDF, tornando-se o padrão para voo por instrumentos.",
        type: "navigation",
        cost: 35000,
        weight: 15,
        drag_penalty: 0.0001,
        tech_level: 70,
        year_introduced: 1953
    },

    // === Miras e Controle de Tiro ===
    fcs_iron_sights: {
        name: "Mira de Ferro Simples",
        description: "Uma mira básica para pontaria visual.",
        type: "fcs",
        cost: 1000,
        weight: 2,
        drag_penalty: 0,
        tech_level: 10,
        year_introduced: 1945
    },
    fcs_reflector_sight: {
        name: "Mira Refletora K-14",
        description: "Mira giroscópica que calcula a deflexão necessária para atingir alvos em movimento, melhorando drasticamente a precisão.",
        type: "fcs",
        cost: 22000,
        weight: 8,
        drag_penalty: 0,
        tech_level: 50,
        year_introduced: 1948
    },
    fcs_apg_30: {
        name: "Radar de Tiro AN/APG-30",
        description: "Primeiro radar de controle de tiro, usado no F-86 Sabre. Permite mira guiada por radar em curto alcance.",
        type: "fcs",
        cost: 80000,
        weight: 70,
        drag_penalty: 0.001, // Radome no nariz
        tech_level: 90,
        year_introduced: 1954
    },

    // === Radar e Guerra Eletrônica ===
    radar_aps_4: {
        name: "Radar de Busca AN/APS-4",
        description: "Radar de busca ar-ar primitivo, montado em um pod. Pesado e com performance limitada, mas permite detecção noturna.",
        type: "radar",
        cost: 120000,
        weight: 110,
        drag_penalty: 0.005, // Pod externo
        tech_level: 70,
        year_introduced: 1951
    },
    radar_aps_21: {
        name: "Radar de Busca AN/APS-21",
        description: "Radar de busca integrado para interceptadores, com maior alcance e resolução.",
        type: "radar",
        cost: 250000,
        weight: 250,
        drag_penalty: 0.002, // Radome grande
        tech_level: 100,
        year_introduced: 1955
    },
    ew_jammer_apt1: {
        name: "Jammer AN/APT-1",
        description: "Sistema de contramedidas eletrônicas (ECM) para interferir em radares inimigos. Defesa essencial para bombardeiros.",
        type: "ew",
        cost: 75000,
        weight: 60,
        drag_penalty: 0.0005,
        tech_level: 85,
        year_introduced: 1954
    },

    // === Sistemas de Cabine e Suporte ===
    cockpit_oxygen: {
        name: "Sistema de Oxigênio",
        description: "Permite operações seguras em altitudes elevadas (acima de 4000m).",
        type: "cockpit",
        cost: 4000,
        weight: 15,
        drag_penalty: 0,
        tech_level: 30,
        year_introduced: 1945
    },
    cockpit_pressurized: {
        name: "Cabine Pressurizada",
        description: "Mantém a pressão da cabine em voos de altitude muito elevada, essencial para o conforto e eficácia da tripulação.",
        type: "cockpit",
        cost: 60000,
        weight: 120,
        drag_penalty: 0,
        tech_level: 75,
        year_introduced: 1953
    }
};