/**
 * @file training_levels.js
 * @description Níveis de treinamento para divisões - War1954
 * Cada nível aplica modificadores diferentes nos stats e custos da divisão
 */

export const training_levels = {
  conscript: {
    id: 'conscript',
    name: 'Conscrito',
    nameEn: 'Conscript',
    description: 'Recrutamento rápido • Prontas no mesmo turno • -50% stats',

    // Modificadores (multiplicadores que serão aplicados nos stats)
    modifiers: {
      costs: {
        production: 0.5,       // -50% custo de produção ✅
        maintenance: 0.5       // -50% custo de manutenção
      },
      stats: {
        softAttack: 0.5,       // -50% soft attack
        hardAttack: 0.5,       // -50% hard attack
        defense: 0.5,          // -50% defense
        breakthrough: 0.5,     // -50% breakthrough
        armor: 1.0,            // Sem mudança
        piercing: 1.0,         // Sem mudança
        hp: 0.5,               // -50% hp
        organization: 0.5,     // -50% organização
        recovery: 0.5,         // -50% recovery
        reconnaissance: 0.5,   // -50% reconhecimento
        suppression: 0.5,      // -50% suppression
        weight: 1.0,           // Sem mudança
        combatWidth: 1.0       // Sem mudança
      },
      recruitmentTurns: 1,     // Pronto no mesmo turno ✅
      recruitmentProgress: 1.0 // 100% no primeiro turno
    },

    // Visual
    icon: '⚔️',
    color: '#78716c',
    bgColor: '#44403c'
  },

  regular: {
    id: 'regular',
    name: 'Regular',
    nameEn: 'Regular',
    description: 'Treinamento padrão • 2 turnos • Stats balanceados',

    modifiers: {
      costs: {
        production: 1.0,       // Baseline - sem mudança ✅
        maintenance: 1.0       // Baseline - sem mudança
      },
      stats: {
        softAttack: 1.0,       // Baseline
        hardAttack: 1.0,
        defense: 1.0,
        breakthrough: 1.0,
        armor: 1.0,
        piercing: 1.0,
        hp: 1.0,
        organization: 1.0,
        recovery: 1.0,
        reconnaissance: 1.0,
        suppression: 1.0,
        weight: 1.0,
        combatWidth: 1.0
      },
      recruitmentTurns: 2,     // 2 turnos para ficar pronto ✅
      recruitmentProgress: 0.5 // 50% por turno (progressivo)
    },

    icon: '🎖️',
    color: '#3b82f6',
    bgColor: '#1e40af'
  },

  elite: {
    id: 'elite',
    name: 'Elite',
    nameEn: 'Elite',
    description: 'Veteranos experientes • 6 turnos • +50% stats • +500% custo',

    modifiers: {
      costs: {
        production: 6.0,       // +500% custo de produção (6x) ✅
        maintenance: 6.0       // +500% custo de manutenção
      },
      stats: {
        softAttack: 1.5,       // +50% soft attack
        hardAttack: 1.5,       // +50% hard attack
        defense: 1.5,          // +50% defense
        breakthrough: 1.5,     // +50% breakthrough
        armor: 1.0,            // Sem mudança
        piercing: 1.0,         // Sem mudança
        hp: 1.5,               // +50% hp
        organization: 1.5,     // +50% organização
        recovery: 1.5,         // +50% recovery
        reconnaissance: 1.5,   // +50% reconhecimento
        suppression: 1.5,      // +50% suppression
        weight: 1.0,           // Sem mudança
        combatWidth: 1.0       // Sem mudança
      },
      recruitmentTurns: 6,     // 6 turnos para ficar pronto ✅
      recruitmentProgress: 0.1667 // ~16.67% por turno (progressivo)
    },

    icon: '🏆',
    color: '#eab308',
    bgColor: '#ca8a04'
  }
};

/**
 * Retorna informação de display para um nível de treinamento
 */
export function getTrainingLevelDisplay(levelId) {
  const level = training_levels[levelId];
  if (!level) return null;

  return {
    name: level.name,
    icon: level.icon,
    color: level.color,
    description: level.description,
    costMultiplier: level.modifiers.costs.production,
    maintenanceMultiplier: level.modifiers.costs.maintenance,
    trainingTime: level.modifiers.trainingTime
  };
}

/**
 * Retorna lista de todos os níveis de treinamento ordenados
 */
export function getAllTrainingLevels() {
  return [
    training_levels.conscript,
    training_levels.regular,
    training_levels.elite
  ];
}

export default training_levels;
