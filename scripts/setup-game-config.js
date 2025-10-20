/**
 * @file setup-game-config.js
 * @description Script para criar e popular o documento de configuração de leis nacionais no Firestore.
 */

import { db } from '../js/config/firebase-config.js';

const nationalLawsConfig = {
  mobilizationLaws: {
    disarmed_nation: {
      level: 1,
      name: 'Nação Desarmada',
      recruitablePopulation: 0.01,
      bonuses: {
        resourceProduction: 0.15,
        civilianFactoryEfficiency: 0.10
      },
      penalties: {
        militaryProductionSpeed: -0.50
      }
    },
    volunteer_only: {
      level: 2,
      name: 'Apenas Voluntários',
      recruitablePopulation: 0.015,
      bonuses: {
        resourceProduction: 0.05
      },
      penalties: {
        militaryProductionSpeed: -0.10
      }
    },
    limited_conscription: {
      level: 3,
      name: 'Conscrição Limitada',
      recruitablePopulation: 0.025,
      bonuses: {},
      penalties: {}
    },
    extensive_conscription: {
      level: 4,
      name: 'Conscrição Extensa',
      recruitablePopulation: 0.05,
      bonuses: {
        militaryProductionCost: -0.05
      },
      penalties: {
        resourceProduction: -0.07
      }
    },
    service_by_requirement: {
      level: 5,
      name: 'Serviço por Exigência',
      recruitablePopulation: 0.10,
      bonuses: {
        militaryProductionCost: -0.10
      },
      penalties: {
        resourceProduction: -0.14,
        civilianFactoryEfficiency: -0.07
      }
    },
    all_adults_serve: {
      level: 6,
      name: 'Todos os Adultos Servem',
      recruitablePopulation: 0.20,
      bonuses: {
        militaryProductionCost: -0.15
      },
      penalties: {
        resourceProduction: -0.35,
        civilianFactoryEfficiency: -0.20,
        warExhaustionPassiveGain: 0.1 // Adicional
      }
    }
  },
  economicLaws: {
    civilian_economy: {
      level: 1,
      name: 'Economia Civil',
      bonuses: {
        civilianFactoryEfficiency: 0.20
      },
      penalties: {
        militaryCapacity: -0.30
      },
      consumptionModifiers: {
        metals: -0.25,
        fuel: -0.25,
        grain: 0.15
      }
    },
    early_mobilization: {
      level: 2,
      name: 'Mobilização Inicial',
      bonuses: {
        civilianFactoryEfficiency: 0.10
      },
      penalties: {
        militaryCapacity: -0.15
      },
      consumptionModifiers: {
        metals: -0.10,
        fuel: -0.10,
        grain: 0.05
      }
    },
    partial_mobilization: {
      level: 3,
      name: 'Mobilização Parcial',
      bonuses: {},
      penalties: {},
      consumptionModifiers: {}
    },
    war_economy: {
      level: 4,
      name: 'Economia de Guerra',
      bonuses: {
        militaryCapacity: 0.20
      },
      penalties: {
        civilianFactoryEfficiency: -0.20
      },
      consumptionModifiers: {
        metals: 0.20,
        fuel: 0.20,
        coal: 0.20,
        energy: 0.20
      }
    },
    total_mobilization: {
      level: 5,
      name: 'Mobilização Total',
      bonuses: {
        militaryCapacity: 0.40
      },
      penalties: {
        civilianFactoryEfficiency: -0.40,
        recruitablePopulation: -0.05, // Penalidade direta no fator
        warExhaustionPassiveGain: 0.1 // Adicional
      },
      consumptionModifiers: {
        metals: 0.35,
        fuel: 0.35,
        coal: 0.35,
        energy: 0.35,
        grain: -0.20
      }
    }
  }
};

/**
 * Função para escrever a configuração no Firestore.
 */
async function setupGameConfig() {
  console.log('Iniciando a configuração das Leis Nacionais no Firestore...');
  try {
    await db.collection('gameConfig').doc('nationalLaws').set(nationalLawsConfig);
    console.log('✅ Documento 'nationalLaws' criado/atualizado com sucesso em 'gameConfig'.');
    console.log('Todas as definições de leis foram carregadas no banco de dados.');
  } catch (error) {
    console.error('Ocorreu um erro ao configurar as leis do jogo:', error);
  }
}

// Executa a função principal
setupGameConfig();
