/**
 * @file divisionValidator.js
 * @description Sistema de validação de divisões - War1954
 * Valida composição, limites e configurações das divisões
 */

import { DivisionStatsCalculator } from '../systems/divisionStatsCalculator.js';

export class DivisionValidator {

  /**
   * Valida uma divisão completa
   * @param {Object} division - Divisão a ser validada
   * @param {Object} combatUnitsData - Dados das unidades de combate
   * @param {Object} supportUnitsData - Dados das unidades de suporte
   * @param {Object} trainingLevels - Dados dos níveis de treinamento
   * @returns {Object} Resultado da validação {valid, errors, warnings}
   */
  static validate(division, combatUnitsData, supportUnitsData, trainingLevels) {
    const errors = [];
    const warnings = [];

    // Validar metadados
    this.validateMetadata(division, errors);

    // Validar unidades de combate
    this.validateCombatUnits(division, combatUnitsData, errors, warnings);

    // Validar unidades de suporte
    this.validateSupportUnits(division, supportUnitsData, errors, warnings);

    // Validar estatísticas
    if (errors.length === 0) {
      const stats = DivisionStatsCalculator.calculateDivisionStats(
        division,
        combatUnitsData,
        supportUnitsData,
        trainingLevels
      );
      this.validateStats(stats, errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valida metadados da divisão
   */
  static validateMetadata(division, errors) {
    // Validar nome
    if (!division.name || typeof division.name !== 'string') {
      errors.push('Nome da divisão é obrigatório');
    } else if (division.name.trim() === '') {
      errors.push('Nome da divisão não pode ser vazio');
    } else if (division.name.length > 50) {
      errors.push('Nome da divisão muito longo (máximo 50 caracteres)');
    }

    // Validar nível de treinamento
    const validTrainingLevels = ['conscript', 'regular', 'elite'];
    if (!validTrainingLevels.includes(division.trainingLevel)) {
      errors.push('Nível de treinamento inválido');
    }
  }

  /**
   * Valida unidades de combate
   */
  static validateCombatUnits(division, combatUnitsData, errors, warnings) {
    // Verificar se combatUnits existe e é array
    if (!division.combatUnits || !Array.isArray(division.combatUnits)) {
      errors.push('Lista de unidades de combate inválida');
      return;
    }

    const combatUnits = division.combatUnits;

    // Validar quantidade
    if (combatUnits.length === 0) {
      errors.push('A divisão deve ter pelo menos uma unidade de combate');
    }

    if (combatUnits.length > 25) {
      errors.push('Máximo de 25 unidades de combate permitidas');
    }

    // Validar cada unidade
    combatUnits.forEach((unit, index) => {
      // Verificar estrutura
      if (!unit.unitType || !unit.id) {
        errors.push(`Unidade de combate #${index + 1} com estrutura inválida`);
        return;
      }

      // Verificar se unidade existe
      if (!combatUnitsData[unit.unitType]) {
        errors.push(`Tipo de unidade de combate não encontrado: ${unit.unitType}`);
      }
    });

    // Avisos para composição
    if (combatUnits.length < 5) {
      warnings.push('Divisão muito pequena (menos de 5 batalhões). Considere adicionar mais unidades.');
    }

    // Verificar diversidade
    const unitTypes = combatUnits.map(u => u.unitType);
    const uniqueTypes = new Set(unitTypes);
    const diversity = uniqueTypes.size / unitTypes.length;

    if (diversity < 0.3 && combatUnits.length > 5) {
      warnings.push('Pouca variedade de tipos de unidade. Considere diversificar a composição.');
    }
  }

  /**
   * Valida unidades de suporte
   */
  static validateSupportUnits(division, supportUnitsData, errors, warnings) {
    // Verificar se supportUnits existe e é array
    if (!division.supportUnits || !Array.isArray(division.supportUnits)) {
      errors.push('Lista de unidades de suporte inválida');
      return;
    }

    const supportUnits = division.supportUnits;

    // Validar quantidade máxima
    if (supportUnits.length > 5) {
      errors.push('Máximo de 5 unidades de suporte permitidas');
    }

    // Validar cada unidade
    supportUnits.forEach((unit, index) => {
      // Verificar estrutura
      if (!unit.unitType || !unit.id) {
        errors.push(`Unidade de suporte #${index + 1} com estrutura inválida`);
        return;
      }

      // Verificar se unidade existe
      if (!supportUnitsData[unit.unitType]) {
        errors.push(`Tipo de unidade de suporte não encontrado: ${unit.unitType}`);
      }
    });

    // Verificar duplicatas
    const supportTypes = supportUnits.map(u => u.unitType);
    const uniqueSupportTypes = new Set(supportTypes);

    if (supportTypes.length > uniqueSupportTypes.size) {
      const duplicates = supportTypes.filter((type, index) =>
        supportTypes.indexOf(type) !== index
      );
      warnings.push(`Unidades de suporte duplicadas (${[...new Set(duplicates)].join(', ')}). Duplicatas não fornecem benefícios adicionais.`);
    }

    // Avisos para suporte ausente
    if (supportUnits.length === 0 && division.combatUnits && division.combatUnits.length > 5) {
      warnings.push('Divisão sem unidades de suporte. Considere adicionar suporte para melhorar desempenho.');
    }
  }

  /**
   * Valida estatísticas calculadas
   */
  static validateStats(stats, errors, warnings) {
    const combat = stats.combatStats;

    // Validar largura de combate
    if (combat.combatWidth > 40) {
      warnings.push(`Largura de combate muito alta (${combat.combatWidth}). Divisões largas são menos eficientes em terrenos difíceis. Recomendado: ≤40`);
    }

    if (combat.combatWidth < 10) {
      warnings.push(`Largura de combate muito baixa (${combat.combatWidth}). Divisões estreitas podem não aproveitar todo o front. Recomendado: ≥10`);
    }

    // Validar organização
    if (combat.organization < 20) {
      warnings.push('Organização muito baixa (<20). A divisão pode quebrar rapidamente em combate.');
    }

    if (combat.organization < 10) {
      errors.push('Organização crítica (<10). Divisão inviável para combate.');
    }

    // Validar HP
    if (combat.hp < 5) {
      errors.push('HP muito baixo (<5). Divisão não sobreviveria a combate.');
    }

    if (combat.hp < 10) {
      warnings.push('HP baixo (<10). Considere adicionar mais unidades ou melhorar treinamento.');
    }

    // Validar capacidade ofensiva
    if (combat.softAttack < 10 && combat.hardAttack < 10) {
      warnings.push('Capacidade ofensiva muito baixa. Divisão terá dificuldade em causar dano ao inimigo.');
    }

    // Validar peso (para mobilidade)
    if (combat.weight > 5) {
      warnings.push(`Divisão muito pesada (${combat.weight.toFixed(1)} ton). Mobilidade reduzida e maior consumo de combustível.`);
    }

    // Validar custo-benefício
    const costPerManpower = DivisionStatsCalculator.calculateCostPerManpower(stats);
    if (costPerManpower > 10000) {
      warnings.push(`Custo por soldado muito alto ($${(costPerManpower / 1000).toFixed(1)}k). Considere otimizar composição.`);
    }

    // Validar manpower total
    if (stats.manpower.total < 500) {
      warnings.push('Divisão muito pequena (<500 MP). Pode não ser efetiva em combate.');
    }

    if (stats.manpower.total > 25000) {
      warnings.push('Divisão muito grande (>25k MP). Difícil de manter e suprir.');
    }
  }

  /**
   * Valida se o país tem recursos para criar a divisão
   */
  static validateResources(division, stats, countryData, errors, warnings) {
    if (!countryData) return;

    // Validar orçamento
    const budget = countryData.Orcamento || 0;
    if (stats.costs.production > budget) {
      errors.push(`Custo de produção ($${(stats.costs.production / 1000000).toFixed(1)}M) excede orçamento disponível ($${(budget / 1000000).toFixed(1)}M)`);
    }

    if (stats.costs.production > budget * 0.8) {
      warnings.push(`Custo de produção muito alto (${((stats.costs.production / budget) * 100).toFixed(0)}% do orçamento)`);
    }

    // Validar manpower disponível
    const availableManpower = countryData.ManpowerDisponivel || 0;
    if (stats.manpower.total > availableManpower) {
      errors.push(`Manpower necessário (${stats.manpower.total}) excede disponível (${availableManpower})`);
    }

    // Validar capacidade de produção militar
    const militaryCapacity = countryData.CapacidadeProducaoVeiculos || 0;
    const equipmentValue = this.estimateEquipmentValue(stats.equipment);

    if (equipmentValue > militaryCapacity) {
      warnings.push(`Equipamentos requeridos excedem capacidade de produção militar. Produção pode levar múltiplos turnos.`);
    }
  }

  /**
   * Estima valor dos equipamentos necessários
   */
  static estimateEquipmentValue(equipment) {
    // Valores aproximados de equipamentos
    const values = {
      mbt: 100000,
      medium_tanks: 20000,
      light_tanks: 67000,
      ifv: 30000,
      apc: 20000,
      spg: 187500,
      spaa: 187500,
      mlrs: 312500,
      artillery: 41667,
      aa_guns: 41667,
      attack_helicopters: 133333,
      utility_helicopters: 33333
    };

    let totalValue = 0;
    Object.keys(equipment).forEach(key => {
      if (values[key]) {
        totalValue += equipment[key] * values[key];
      }
    });

    return totalValue;
  }

  /**
   * Valida compatibilidade entre unidades
   */
  static validateCompatibility(division, combatUnitsData, supportUnitsData, warnings) {
    const combatUnits = division.combatUnits || [];
    const supportUnits = division.supportUnits || [];

    // Verificar se há unidades aerotransportadas sem suporte aéreo
    const hasAirborne = combatUnits.some(u => {
      const unit = combatUnitsData[u.unitType];
      return unit && (unit.category === 'special' && unit.subcategory === 'airborne');
    });

    const hasAirSupport = supportUnits.some(u => {
      const unit = supportUnitsData[u.unitType];
      return unit && unit.category === 'air_support';
    });

    if (hasAirborne && !hasAirSupport) {
      warnings.push('Divisão tem unidades aerotransportadas mas não tem suporte aéreo. Considere adicionar suporte de helicópteros.');
    }

    // Verificar blindados sem manutenção adequada
    const armorCount = combatUnits.filter(u => {
      const unit = combatUnitsData[u.unitType];
      return unit && unit.category === 'armor';
    }).length;

    const hasMaintenance = supportUnits.some(u =>
      u.unitType === 'suporte_manutencao_reparo'
    );

    if (armorCount > 3 && !hasMaintenance) {
      warnings.push('Muitas unidades blindadas sem suporte de manutenção. Considere adicionar Suporte: Manutenção e Reparo.');
    }
  }

  /**
   * Gera relatório de validação formatado
   */
  static generateReport(validation) {
    let report = [];

    if (validation.errors.length > 0) {
      report.push('❌ ERROS:');
      validation.errors.forEach(error => {
        report.push(`  • ${error}`);
      });
    }

    if (validation.warnings.length > 0) {
      if (report.length > 0) report.push('');
      report.push('⚠️ AVISOS:');
      validation.warnings.forEach(warning => {
        report.push(`  • ${warning}`);
      });
    }

    if (validation.valid && validation.warnings.length === 0) {
      report.push('✅ Divisão válida e otimizada!');
    }

    return report.join('\n');
  }
}

export default DivisionValidator;
