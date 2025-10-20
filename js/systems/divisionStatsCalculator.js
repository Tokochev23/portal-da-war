/**
 * @file divisionStatsCalculator.js
 * @description Calculador de estatísticas para divisões - War1954
 * Calcula todos os stats baseado nas unidades e nível de treinamento
 */

export class DivisionStatsCalculator {

  /**
   * Calcula todas as estatísticas da divisão
   * @param {Object} division - Objeto da divisão atual
   * @param {Object} combatUnitsData - Dados das unidades de combate
   * @param {Object} supportUnitsData - Dados das unidades de suporte
   * @param {Object} trainingLevels - Dados dos níveis de treinamento
   * @returns {Object} Estatísticas calculadas
   */
  static calculateDivisionStats(division, combatUnitsData, supportUnitsData, trainingLevels) {
    const trainingLevel = trainingLevels[division.trainingLevel] || trainingLevels.regular;
    const trainingMods = trainingLevel.modifiers;

    let stats = {
      manpower: { combat: 0, support: 0, total: 0 },
      equipment: {},
      costs: { production: 0, maintenance: 0 },
      combatStats: {
        softAttack: 0,
        hardAttack: 0,
        defense: 0,
        breakthrough: 0,
        armor: 0,
        piercing: 0,
        hp: 0,
        organization: 0,
        recovery: 0,
        reconnaissance: 0,
        suppression: 0,
        weight: 0,
        combatWidth: 0
      }
    };

    // Processar unidades de combate
    if (division.combatUnits && Array.isArray(division.combatUnits)) {
      division.combatUnits.forEach(unit => {
        const unitData = combatUnitsData[unit.unitType];
        if (!unitData) {
          console.warn(`Unidade de combate não encontrada: ${unit.unitType}`);
          return;
        }

        // Manpower
        stats.manpower.combat += unitData.composition.manpower;

        // Equipamentos
        this.mergeEquipment(stats.equipment, unitData.composition.equipment);

        // Custos (com modificadores de treinamento)
        stats.costs.production += unitData.costs.production * trainingMods.costs.production;
        stats.costs.maintenance += unitData.costs.maintenance * trainingMods.costs.maintenance;

        // Stats de combate (com modificadores de treinamento)
        Object.keys(stats.combatStats).forEach(key => {
          const baseStat = unitData.stats[key] || 0;
          const modifier = trainingMods.stats[key] || 1.0;
          stats.combatStats[key] += baseStat * modifier;
        });
      });
    }

    // Processar unidades de suporte
    if (division.supportUnits && Array.isArray(division.supportUnits)) {
      division.supportUnits.forEach(unit => {
        const unitData = supportUnitsData[unit.unitType];
        if (!unitData) {
          console.warn(`Unidade de suporte não encontrada: ${unit.unitType}`);
          return;
        }

        // Manpower
        stats.manpower.support += unitData.composition.manpower;

        // Equipamentos
        this.mergeEquipment(stats.equipment, unitData.composition.equipment);

        // Custos (sem modificadores de treinamento para suporte)
        stats.costs.production += unitData.costs.production;
        stats.costs.maintenance += unitData.costs.maintenance;

        // Bônus da divisão (já considerando modificadores de treinamento onde aplicável)
        if (unitData.divisionBonuses) {
          Object.keys(unitData.divisionBonuses).forEach(key => {
            const bonusValue = unitData.divisionBonuses[key];
            // Alguns bônus devem ser afetados pelo treinamento
            const shouldApplyTraining = ['softAttack', 'hardAttack', 'defense', 'breakthrough', 'reconnaissance'].includes(key);
            const modifier = shouldApplyTraining ? (trainingMods.stats[key] || 1.0) : 1.0;
            stats.combatStats[key] += bonusValue * modifier;
          });
        }
      });
    }

    // Total de manpower
    stats.manpower.total = stats.manpower.combat + stats.manpower.support;

    // Arredondar valores
    stats = this.roundStats(stats);

    return stats;
  }

  /**
   * Mescla equipamentos de uma unidade no total
   * @param {Object} target - Objeto de equipamentos alvo
   * @param {Object} source - Equipamentos da unidade
   */
  static mergeEquipment(target, source) {
    if (!source) return;

    Object.keys(source).forEach(key => {
      target[key] = (target[key] || 0) + source[key];
    });
  }

  /**
   * Arredonda estatísticas para valores apropriados
   * @param {Object} stats - Estatísticas para arredondar
   * @returns {Object} Estatísticas arredondadas
   */
  static roundStats(stats) {
    // Manpower sempre inteiro
    stats.manpower.combat = Math.round(stats.manpower.combat);
    stats.manpower.support = Math.round(stats.manpower.support);
    stats.manpower.total = Math.round(stats.manpower.total);

    // Equipamentos sempre inteiros
    Object.keys(stats.equipment).forEach(key => {
      stats.equipment[key] = Math.round(stats.equipment[key]);
    });

    // Custos arredondados para 2 casas decimais
    stats.costs.production = Math.round(stats.costs.production * 100) / 100;
    stats.costs.maintenance = Math.round(stats.costs.maintenance * 100) / 100;

    // Stats de combate com 1 casa decimal
    Object.keys(stats.combatStats).forEach(key => {
      stats.combatStats[key] = Math.round(stats.combatStats[key] * 10) / 10;
    });

    return stats;
  }

  /**
   * Calcula resumo de equipamentos por categoria
   * @param {Object} equipment - Objeto de equipamentos
   * @returns {Object} Resumo categorizado
   */
  static categorizeEquipment(equipment) {
    return {
      vehicles: {
        trucks: equipment.trucks || 0,
        utility_vehicles: equipment.utility_vehicles || 0,
        apc: equipment.apc || 0,
        ifv: equipment.ifv || 0,
        amtrac: equipment.amtrac || 0
      },
      tanks: {
        light_tanks: equipment.light_tanks || 0,
        medium_tanks: equipment.medium_tanks || 0,
        mbt: equipment.mbt || 0,
        amphibious_tanks: equipment.amphibious_tanks || 0
      },
      artillery: {
        artillery: equipment.artillery || 0,
        aa_guns: equipment.aa_guns || 0,
        rocket_launchers: equipment.rocket_launchers || 0,
        spg: equipment.spg || 0,
        spaa: equipment.spaa || 0,
        mlrs: equipment.mlrs || 0
      },
      missiles: {
        atcms: equipment.atcms || 0,
        manpads: equipment.manpads || 0
      },
      aircraft: {
        attack_helicopters: equipment.attack_helicopters || 0,
        utility_helicopters: equipment.utility_helicopters || 0
      },
      infantry: {
        small_arms: equipment.small_arms || 0,
        light_mg: equipment.light_mg || 0,
        heavy_mg: equipment.heavy_mg || 0,
        mortars: equipment.mortars || 0,
        autocannons: equipment.autocannons || 0,
        atgm: equipment.atgm || 0
      }
    };
  }

  /**
   * Calcula efetividade da divisão (score geral)
   * @param {Object} stats - Estatísticas da divisão
   * @returns {Number} Score de efetividade (0-100)
   */
  static calculateEffectiveness(stats) {
    const combat = stats.combatStats;

    // Pontuação baseada em diferentes aspectos
    const offensiveScore = (combat.softAttack + combat.hardAttack + combat.breakthrough) / 3;
    const defensiveScore = (combat.defense + combat.armor + combat.hp) / 3;
    const utilityScore = (combat.reconnaissance + combat.suppression + combat.organization) / 3;

    // Média ponderada
    const totalScore = (offensiveScore * 0.4) + (defensiveScore * 0.4) + (utilityScore * 0.2);

    // Normalizar para 0-100
    return Math.min(100, Math.round(totalScore));
  }

  /**
   * Calcula custo por soldado
   * @param {Object} stats - Estatísticas da divisão
   * @returns {Number} Custo de produção por manpower
   */
  static calculateCostPerManpower(stats) {
    if (stats.manpower.total === 0) return 0;
    return Math.round(stats.costs.production / stats.manpower.total);
  }

  /**
   * Calcula combate width relativo (normalizado)
   * @param {Object} stats - Estatísticas da divisão
   * @returns {String} Classificação da largura de combate
   */
  static getWidthClassification(stats) {
    const width = stats.combatStats.combatWidth;

    if (width <= 10) return 'Muito Estreita';
    if (width <= 20) return 'Estreita';
    if (width <= 30) return 'Média';
    if (width <= 40) return 'Larga';
    return 'Muito Larga';
  }

  /**
   * Calcula pontos fortes e fracos da divisão
   * @param {Object} stats - Estatísticas da divisão
   * @returns {Object} Análise de pontos fortes/fracos
   */
  static analyzeDivision(stats) {
    const combat = stats.combatStats;

    const strengths = [];
    const weaknesses = [];

    // Análise de ataque
    if (combat.softAttack > 200) strengths.push('Alto ataque contra infantaria');
    else if (combat.softAttack < 50) weaknesses.push('Baixo ataque contra infantaria');

    if (combat.hardAttack > 200) strengths.push('Alto ataque contra blindados');
    else if (combat.hardAttack < 20) weaknesses.push('Baixo ataque contra blindados');

    // Análise de defesa
    if (combat.defense > 200) strengths.push('Alta defesa');
    else if (combat.defense < 50) weaknesses.push('Baixa defesa');

    if (combat.armor > 50) strengths.push('Boa proteção blindada');
    else if (combat.armor < 10) weaknesses.push('Pouca proteção blindada');

    // Análise de mobilidade/utilidade
    if (combat.reconnaissance > 15) strengths.push('Excelente reconhecimento');
    else if (combat.reconnaissance < 5) weaknesses.push('Reconhecimento limitado');

    if (combat.organization > 60) strengths.push('Alta organização');
    else if (combat.organization < 40) weaknesses.push('Baixa organização');

    // Análise de largura
    if (combat.combatWidth > 40) weaknesses.push('Largura de combate muito alta');
    else if (combat.combatWidth < 10) weaknesses.push('Largura de combate muito baixa');

    return {
      strengths,
      weaknesses,
      overallRating: this.calculateEffectiveness(stats)
    };
  }
}

export default DivisionStatsCalculator;
