/**
 * Biblioteca de Equipamentos Genéricos para Arsenal Inicial
 * Equipamentos balanceados para a era de 1954
 */

export const GENERIC_EQUIPMENT = {
  // ==================== VEÍCULOS TERRESTRES ====================
  vehicles: {
    "MBT": {
      name: "MBT Genérico (1954)",
      description: "Tanque de batalha principal padrão da época",
      stats: {
        armor: 50,
        firepower: 40,
        speed: 30,
        reliability: 70,
        cost: 50000
      },
      icon: "🛡️",
      year: 1954
    },
    "Medium Tank": {
      name: "Tanque Médio Genérico",
      description: "Tanque médio versátil",
      stats: {
        armor: 40,
        firepower: 35,
        speed: 35,
        reliability: 75,
        cost: 40000
      },
      icon: "⚙️",
      year: 1954
    },
    "Light Tank": {
      name: "Tanque Leve Genérico",
      description: "Tanque leve rápido para reconhecimento",
      stats: {
        armor: 25,
        firepower: 25,
        speed: 50,
        reliability: 80,
        cost: 25000
      },
      icon: "🏃",
      year: 1954
    },
    "Heavy Tank": {
      name: "Tanque Pesado Genérico",
      description: "Tanque pesado com armadura reforçada",
      stats: {
        armor: 70,
        firepower: 50,
        speed: 20,
        reliability: 60,
        cost: 75000
      },
      icon: "🐘",
      year: 1954
    },
    "IFV": {
      name: "IFV Genérico",
      description: "Veículo de combate de infantaria",
      stats: {
        armor: 20,
        firepower: 20,
        speed: 45,
        reliability: 75,
        cost: 30000
      },
      icon: "👥",
      year: 1954
    },
    "APC": {
      name: "APC Genérico",
      description: "Transporte blindado de pessoal",
      stats: {
        armor: 15,
        firepower: 10,
        speed: 50,
        reliability: 85,
        cost: 20000
      },
      icon: "🚐",
      year: 1954
    },
    "SPG": {
      name: "SPG Genérico",
      description: "Canhão autopropulsado antitanque",
      stats: {
        armor: 25,
        firepower: 55,
        speed: 30,
        reliability: 70,
        cost: 45000
      },
      icon: "💥",
      year: 1954
    },
    "SPH": {
      name: "SPH Genérico",
      description: "Obuseiro autopropulsado de artilharia",
      stats: {
        armor: 20,
        firepower: 60,
        speed: 25,
        reliability: 75,
        cost: 55000
      },
      icon: "🎯",
      year: 1954
    },
    "SPAA": {
      name: "SPAA Genérico",
      description: "Antiaéreo autopropulsado",
      stats: {
        armor: 15,
        firepower: 30,
        speed: 40,
        reliability: 80,
        cost: 35000
      },
      icon: "🎪",
      year: 1954
    },
    "Tank Destroyer": {
      name: "Caça-Tanques Genérico",
      description: "Destruidor de tanques especializado",
      stats: {
        armor: 30,
        firepower: 60,
        speed: 35,
        reliability: 70,
        cost: 48000
      },
      icon: "🎯",
      year: 1954
    },
    "Engineering Vehicle": {
      name: "Veículo de Engenharia Genérico",
      description: "Veículo para construção e demolição",
      stats: {
        armor: 25,
        firepower: 5,
        speed: 20,
        reliability: 90,
        cost: 40000
      },
      icon: "🔧",
      year: 1954
    },
    "Other": {
      name: "Veículo Utilitário Genérico",
      description: "Veículo de uso geral",
      stats: {
        armor: 10,
        firepower: 5,
        speed: 60,
        reliability: 85,
        cost: 15000
      },
      icon: "🚙",
      year: 1954
    }
  },

  // ==================== AERONAVES ====================
  aircraft: {
    "Fighter": {
      name: "Caça Leve Genérico (1954)",
      description: "Caça interceptador leve",
      stats: {
        speed: 800,
        maneuverability: 75,
        firepower: 35,
        range: 1200,
        cost: 150000
      },
      icon: "✈️",
      year: 1954
    },
    "Heavy Fighter": {
      name: "Caça Pesado Genérico",
      description: "Caça pesado multifunção",
      stats: {
        speed: 700,
        maneuverability: 60,
        firepower: 50,
        range: 1800,
        cost: 200000
      },
      icon: "🛩️",
      year: 1954
    },
    "Interceptor": {
      name: "Interceptador Genérico",
      description: "Interceptador de alta altitude",
      stats: {
        speed: 900,
        maneuverability: 70,
        firepower: 40,
        range: 1000,
        cost: 180000
      },
      icon: "🚀",
      year: 1954
    },
    "CAS": {
      name: "CAS Genérico",
      description: "Aeronave de suporte aéreo próximo",
      stats: {
        speed: 500,
        maneuverability: 50,
        firepower: 65,
        range: 800,
        cost: 120000
      },
      icon: "💣",
      year: 1954
    },
    "Bomber": {
      name: "Bombardeiro Genérico",
      description: "Bombardeiro médio",
      stats: {
        speed: 550,
        maneuverability: 30,
        firepower: 80,
        range: 2500,
        cost: 350000
      },
      icon: "✈️",
      year: 1954
    },
    "Heavy Bomber": {
      name: "Bombardeiro Pesado Genérico",
      description: "Bombardeiro estratégico pesado",
      stats: {
        speed: 500,
        maneuverability: 20,
        firepower: 100,
        range: 4000,
        cost: 500000
      },
      icon: "🛫",
      year: 1954
    },
    "Naval Bomber": {
      name: "Bombardeiro Naval Genérico",
      description: "Bombardeiro torpedo naval",
      stats: {
        speed: 450,
        maneuverability: 40,
        firepower: 70,
        range: 1500,
        cost: 180000
      },
      icon: "🌊",
      year: 1954
    },
    "Transport": {
      name: "Transporte Genérico",
      description: "Avião de transporte de tropas/carga",
      stats: {
        speed: 350,
        maneuverability: 25,
        firepower: 0,
        range: 2000,
        cost: 200000
      },
      icon: "📦",
      year: 1954
    },
    "Reconnaissance": {
      name: "Reconhecimento Genérico",
      description: "Avião de reconhecimento",
      stats: {
        speed: 600,
        maneuverability: 55,
        firepower: 10,
        range: 2200,
        cost: 140000
      },
      icon: "🔍",
      year: 1954
    }
  },

  // ==================== NAVIOS ====================
  naval: {
    "Couraçados": {
      name: "Couraçado Genérico (1954)",
      description: "Encouraçado de batalha pesado",
      stats: {
        armor: 90,
        firepower: 95,
        speed: 25,
        range: 8000,
        cost: 15000000
      },
      icon: "⚓",
      year: 1954
    },
    "Cruzadores": {
      name: "Cruzador Genérico",
      description: "Cruzador de combate médio",
      stats: {
        armor: 70,
        firepower: 75,
        speed: 32,
        range: 6000,
        cost: 8000000
      },
      icon: "🚢",
      year: 1954
    },
    "Destróieres": {
      name: "Destróier Genérico",
      description: "Destróier de escolta e ataque",
      stats: {
        armor: 40,
        firepower: 60,
        speed: 35,
        range: 4500,
        cost: 4000000
      },
      icon: "🛥️",
      year: 1954
    },
    "Fragatas": {
      name: "Fragata Genérica",
      description: "Fragata de patrulha e escolta",
      stats: {
        armor: 30,
        firepower: 45,
        speed: 30,
        range: 4000,
        cost: 2500000
      },
      icon: "🚤",
      year: 1954
    },
    "Corvetas": {
      name: "Corveta Genérica",
      description: "Corveta de patrulha costeira",
      stats: {
        armor: 20,
        firepower: 30,
        speed: 28,
        range: 2500,
        cost: 1200000
      },
      icon: "⛵",
      year: 1954
    },
    "Submarinos": {
      name: "Submarino Genérico",
      description: "Submarino diesel-elétrico",
      stats: {
        armor: 15,
        firepower: 70,
        speed: 20,
        range: 8000,
        cost: 5000000
      },
      icon: "🤿",
      year: 1954
    },
    "Porta-aviões": {
      name: "Porta-aviões Genérico",
      description: "Porta-aviões de esquadra",
      stats: {
        armor: 50,
        firepower: 40,
        speed: 30,
        range: 10000,
        cost: 25000000
      },
      icon: "🛩️",
      year: 1954
    },
    "Patrulhas": {
      name: "Patrulha Genérica",
      description: "Embarcação de patrulha costeira",
      stats: {
        armor: 10,
        firepower: 20,
        speed: 25,
        range: 1500,
        cost: 500000
      },
      icon: "🚨",
      year: 1954
    },
    "Auxiliares": {
      name: "Navio Auxiliar Genérico",
      description: "Navio de suporte e logística",
      stats: {
        armor: 5,
        firepower: 5,
        speed: 18,
        range: 6000,
        cost: 1500000
      },
      icon: "🔧",
      year: 1954
    },
    "Naval - Outros": {
      name: "Embarcação Genérica",
      description: "Embarcação de uso geral",
      stats: {
        armor: 8,
        firepower: 10,
        speed: 20,
        range: 2000,
        cost: 800000
      },
      icon: "🌊",
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
