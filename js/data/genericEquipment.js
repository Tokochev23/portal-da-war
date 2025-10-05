/**
 * Biblioteca de Equipamentos Genéricos para Arsenal Inicial
 * Equipamentos balanceados para a era de 1954
 * Atualizado com as categorias corretas conforme planilhas oficiais
 */

export const GENERIC_EQUIPMENT = {
  // ==================== VEÍCULOS TERRESTRES ====================
  vehicles: {
    "Howitzer": {
      name: "Howitzer",
      description: "Peça de artilharia rebocada",
      stats: { armor: 0, firepower: 75, speed: 0, reliability: 80, cost: 50000 },
      icon: "🎯",
      year: 1954
    },
    "SPA": {
      name: "SPA (Artilharia Autopropulsada)",
      description: "Artilharia autopropulsada",
      stats: { armor: 20, firepower: 70, speed: 30, reliability: 75, cost: 65000 },
      icon: "💥",
      year: 1954
    },
    "Antiaerea": {
      name: "Antiaérea",
      description: "Artilharia antiaérea",
      stats: { armor: 0, firepower: 40, speed: 0, reliability: 80, cost: 30000 },
      icon: "🎪",
      year: 1954
    },
    "SPAA": {
      name: "SPAA",
      description: "Artilharia Antiaérea Autopropulsada",
      stats: { armor: 15, firepower: 35, speed: 40, reliability: 80, cost: 40000 },
      icon: "🎪",
      year: 1954
    },
    "APC": {
      name: "APC",
      description: "Transporte de Pessoal Blindado",
      stats: { armor: 15, firepower: 10, speed: 50, reliability: 85, cost: 25000 },
      icon: "🚐",
      year: 1954
    },
    "IFV": {
      name: "IFV",
      description: "Veículo de Combate de Infantaria",
      stats: { armor: 20, firepower: 25, speed: 45, reliability: 80, cost: 35000 },
      icon: "👥",
      year: 1954
    },
    "TanqueLeve": {
      name: "Tanque Leve",
      description: "Tanque leve de reconhecimento e apoio",
      stats: { armor: 30, firepower: 35, speed: 50, reliability: 85, cost: 40000 },
      icon: "🛡️",
      year: 1954
    },
    "MBT": {
      name: "MBT",
      description: "Tanque de Batalha Principal",
      stats: { armor: 50, firepower: 50, speed: 40, reliability: 80, cost: 80000 },
      icon: "🛡️",
      year: 1954
    },
    "Transporte": {
      name: "Transporte",
      description: "Veículo de transporte de pessoal e suprimentos",
      stats: { armor: 5, firepower: 0, speed: 60, reliability: 90, cost: 15000 },
      icon: "🚚",
      year: 1954
    },
    "Utilitarios": {
      name: "Utilitários",
      description: "Veículos utilitários diversos",
      stats: { armor: 5, firepower: 0, speed: 70, reliability: 95, cost: 10000 },
      icon: "🚙",
      year: 1954
    }
  },

  // ==================== AERONAVES ====================
  aircraft: {
    "Caca": {
      name: "Caça",
      description: "Caça para superioridade aérea",
      stats: { speed: 900, maneuverability: 75, firepower: 45, range: 1200, cost: 250000 },
      icon: "✈️",
      year: 1954
    },
    "CAS": {
      name: "CAS",
      description: "Close Air Support - Apoio aéreo aproximado",
      stats: { speed: 600, maneuverability: 60, firepower: 70, range: 800, cost: 180000 },
      icon: "💣",
      year: 1954
    },
    "Bomber": {
      name: "Bomber",
      description: "Bombardeiro tático",
      stats: { speed: 550, maneuverability: 40, firepower: 80, range: 2500, cost: 400000 },
      icon: "✈️",
      year: 1954
    },
    "BomberAJato": {
      name: "Bomber a Jato",
      description: "Bombardeiro tático a jato",
      stats: { speed: 850, maneuverability: 45, firepower: 85, range: 3000, cost: 600000 },
      icon: "✈️",
      year: 1954
    },
    "BomberEstrategico": {
      name: "Bomber Estratégico",
      description: "Bombardeiro pesado estratégico",
      stats: { speed: 500, maneuverability: 30, firepower: 100, range: 5000, cost: 900000 },
      icon: "🛫",
      year: 1954
    },
    "BomberEstrategicoAJato": {
      name: "Bomber Estratégico a Jato",
      description: "Bombardeiro estratégico a jato",
      stats: { speed: 900, maneuverability: 35, firepower: 105, range: 6000, cost: 1500000 },
      icon: "🛫",
      year: 1954
    },
    "AWAC": {
      name: "AWAC",
      description: "Aeronave de alerta e controle antecipado",
      stats: { speed: 600, maneuverability: 40, firepower: 0, range: 4000, cost: 800000 },
      icon: "📡",
      year: 1954
    },
    "HeliTransporte": {
      name: "Helicóptero de Transporte",
      description: "Helicóptero para transporte de tropas",
      stats: { speed: 250, maneuverability: 70, firepower: 5, range: 400, cost: 120000 },
      icon: "🚁",
      year: 1954
    },
    "HeliAtaque": {
      name: "Helicóptero de Ataque",
      description: "Helicóptero de combate",
      stats: { speed: 280, maneuverability: 75, firepower: 50, range: 500, cost: 200000 },
      icon: "🚁",
      year: 1954
    },
    "TransporteAereo": {
      name: "Transporte Aéreo",
      description: "Aeronave de transporte de passageiros",
      stats: { speed: 500, maneuverability: 35, firepower: 0, range: 3000, cost: 300000 },
      icon: "✈️",
      year: 1954
    },
    "Carga": {
      name: "Aeronave de Carga",
      description: "Aeronave de transporte de carga pesada",
      stats: { speed: 450, maneuverability: 30, firepower: 0, range: 3500, cost: 350000 },
      icon: "✈️",
      year: 1954
    }
  },

  // ==================== NAVIOS ====================
  naval: {
    "PAEsquadra": {
      name: "PA de Esquadra",
      description: "Porta-Aviões de Esquadra",
      stats: { armor: 60, firepower: 50, speed: 32, range: 10000, cost: 25000000 },
      icon: "🛩️",
      year: 1954
    },
    "PAEscolta": {
      name: "PA de Escolta",
      description: "Porta-Aviões de Escolta",
      stats: { armor: 40, firepower: 35, speed: 28, range: 8000, cost: 12000000 },
      icon: "🛩️",
      year: 1954
    },
    "Encouracado": {
      name: "Encouraçado",
      description: "Navio de batalha pesado",
      stats: { armor: 95, firepower: 100, speed: 28, range: 8000, cost: 20000000 },
      icon: "⚓",
      year: 1954
    },
    "CruzadorMisseis": {
      name: "Cruzador de Mísseis",
      description: "Cruzador armado com mísseis",
      stats: { armor: 65, firepower: 80, speed: 32, range: 7000, cost: 12000000 },
      icon: "🚢",
      year: 1954
    },
    "Cruzador": {
      name: "Cruzador",
      description: "Cruzador padrão",
      stats: { armor: 60, firepower: 70, speed: 32, range: 6500, cost: 8000000 },
      icon: "🚢",
      year: 1954
    },
    "Fragata": {
      name: "Fragata",
      description: "Navio de escolta e patrulha",
      stats: { armor: 35, firepower: 45, speed: 30, range: 5000, cost: 4000000 },
      icon: "🚤",
      year: 1954
    },
    "Destroyer": {
      name: "Destroyer",
      description: "Contratorpedeiro de escolta e ataque",
      stats: { armor: 45, firepower: 60, speed: 35, range: 5500, cost: 6000000 },
      icon: "🛥️",
      year: 1954
    },
    "Submarino": {
      name: "Submarino",
      description: "Submarino convencional diesel-elétrico",
      stats: { armor: 20, firepower: 70, speed: 22, range: 8000, cost: 5000000 },
      icon: "🤿",
      year: 1954
    },
    "SubmarinoBalístico": {
      name: "Submarino Balístico",
      description: "Submarino com mísseis balísticos",
      stats: { armor: 25, firepower: 90, speed: 24, range: 10000, cost: 30000000 },
      icon: "🚀",
      year: 1954
    },
    "SubmarinoNuclear": {
      name: "Submarino Nuclear",
      description: "Submarino com propulsão nuclear",
      stats: { armor: 30, firepower: 85, speed: 32, range: 99999, cost: 50000000 },
      icon: "☢️",
      year: 1954
    },
    "TransporteNaval": {
      name: "Transporte Naval",
      description: "Navio de transporte de tropas e carga",
      stats: { armor: 15, firepower: 10, speed: 20, range: 7000, cost: 2000000 },
      icon: "🚢",
      year: 1954
    },
    "Desembarque": {
      name: "Navio de Desembarque",
      description: "Navio para operações anfíbias",
      stats: { armor: 25, firepower: 25, speed: 22, range: 6000, cost: 3500000 },
      icon: "⚓",
      year: 1954
    }
  }
};

// Helper: obter equipamento por tipo e classe
export function getEquipment(type, category) {
  return GENERIC_EQUIPMENT[type]?.[category] || null;
}

// Helper: obter todas as categorias de um tipo
export function getCategoriesByType(type) {
  return Object.keys(GENERIC_EQUIPMENT[type] || {});
}

// Helper: obter todos os tipos disponíveis
export function getAvailableTypes() {
  return Object.keys(GENERIC_EQUIPMENT);
}

export default GENERIC_EQUIPMENT;