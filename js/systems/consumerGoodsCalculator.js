/**
 * Sistema de Cálculo de Bens de Consumo - War 1954
 * Calcula a disponibilidade de bens de consumo e seus efeitos na estabilidade
 */

import { Logger } from '../utils.js';

/**
 * Fatores para cálculo de bens de consumo
 */
const CONSUMER_GOODS_FACTORS = {
  // Produção base de bens de consumo (baseada na capacidade industrial)
  BASE_PRODUCTION_FACTORS: {
    // Produção per capita baseada no desenvolvimento (reduzida para mais realismo)
    ULTRA_DEVELOPED: 0.6,    // EUA, Suíça - mesmo ricos têm desafios
    HIGHLY_DEVELOPED: 0.45,  // Reino Unido, França
    DEVELOPED: 0.35,         // Alemanha Ocidental
    MODERATE: 0.22,          // URSS, Japão - URSS priorizava indústria pesada
    DEVELOPING: 0.15,        // Brasil, México
    UNDERDEVELOPED: 0.08     // Países pobres
  },

  // Multiplicadores por características do país
  MULTIPLIERS: {
    // Tecnologia industrial (eficiência de produção)
    TECHNOLOGY_EFFICIENCY: 0.008,  // +0.8% por ponto de tecnologia

    // Urbanização (infraestrutura de distribuição)
    URBANIZATION_BONUS: 0.005,    // +0.5% por % de urbanização

    // PIB per capita (poder de compra)
    WEALTH_MULTIPLIER: 0.0002,    // +0.02% por $ de PIB per capita

    // Estabilidade (capacidade de produzir e distribuir)
    STABILITY_EFFECT: 0.01        // +1% por % de estabilidade
  },

  // Penalidades por situações especiais (economias planificadas removidas)
  ECONOMIC_SYSTEM_MODIFIERS: {
    // Países em guerra têm produção voltada para esforço de guerra
    WARTIME_ECONOMY: {
      production_penalty: 0.7,   // -30% produção civil
      demand_stability: 0.9      // -10% demanda (racionamento)
    }
  },

  // Demanda base da população (necessidades básicas)
  POPULATION_DEMAND: {
    BASE_DEMAND_PER_MILLION: 80,   // Demanda básica por milhão de habitantes (aumentada)
    URBANIZATION_INCREASE: 0.018,  // +1.8% demanda por % urbanização (cidades demandam muito mais)
    WEALTH_EXPECTATION: 0.0003     // +0.03% demanda por $ de PIB per capita (ricos querem mais)
  },

  // Efeitos na estabilidade por nível de bens de consumo
  STABILITY_EFFECTS: {
    // Níveis de satisfação e seus efeitos
    EXCELLENT: { threshold: 85, effect: 3.0 },   // >85% = +3% estabilidade
    GOOD: { threshold: 70, effect: 2.0 },        // 70-85% = +2% estabilidade
    ADEQUATE: { threshold: 50, effect: 0.0 },    // 50-70% = neutro
    POOR: { threshold: 30, effect: -2.0 },       // 30-50% = -2% estabilidade
    BAD: { threshold: 15, effect: -3.5 },        // 15-30% = -3.5% estabilidade
    CRITICAL: { threshold: 0, effect: -5.0 }     // <15% = -5% estabilidade
  }
};

class ConsumerGoodsCalculator {

  /**
   * Calcula o nível de bens de consumo para um país (0-100%)
   */
  static calculateConsumerGoods(country) {
    try {
      const population = parseFloat(country.Populacao) || 1;
      const pibPerCapita = parseFloat(country.PIBPerCapita) || 500;
      const urbanization = parseFloat(country.Urbanizacao) || 30;
      const technology = parseFloat(country.Tecnologia) || 20;
      const stability = parseFloat(country.Estabilidade) || 50;

      const countryName = country.Pais || country.Nome || 'Desconhecido';

      // 1. Calcular produção de bens de consumo
      const production = this.calculateProduction(population, pibPerCapita, urbanization, technology, stability, countryName);

      // 2. Calcular demanda da população
      const demand = this.calculateDemand(population, urbanization, pibPerCapita, countryName);

      // 3. Calcular nível de satisfação (produção/demanda * 100)
      let consumerGoodsLevel = (production / demand) * 100;

      // 4. Limitar entre 0-100%
      consumerGoodsLevel = Math.max(0, Math.min(100, consumerGoodsLevel));

      return {
        level: Math.round(consumerGoodsLevel),
        production: Math.round(production),
        demand: Math.round(demand),
        metadata: {
          calculatedAt: new Date().toISOString(),
          country: country.Pais || country.Nome || 'Desconhecido',
          developmentLevel: this.getDevelopmentLevel(pibPerCapita),
          stabilityEffect: this.getStabilityEffect(consumerGoodsLevel)
        }
      };

    } catch (error) {
      Logger.error('Erro ao calcular bens de consumo:', error);
      return {
        level: 50,
        production: 100,
        demand: 100,
        metadata: {
          error: 'Valores padrão aplicados devido a erro no cálculo'
        }
      };
    }
  }

  /**
   * Calcula a produção de bens de consumo
   */
  static calculateProduction(population, pibPerCapita, urbanization, technology, stability, countryName) {
    const populationInMillions = population / 1000000;

    // 1. Produção base por desenvolvimento
    const developmentLevel = this.getDevelopmentLevel(pibPerCapita);
    const baseProduction = this.getBaseProductionRate(developmentLevel);
    let production = populationInMillions * baseProduction * 100; // Base 100 por milhão

    // 2. Multiplicador por tecnologia (eficiência industrial)
    const technologyMultiplier = 1 + (CONSUMER_GOODS_FACTORS.MULTIPLIERS.TECHNOLOGY_EFFICIENCY * technology);
    production *= technologyMultiplier;

    // 3. Multiplicador por urbanização (infraestrutura)
    const urbanizationMultiplier = 1 + (CONSUMER_GOODS_FACTORS.MULTIPLIERS.URBANIZATION_BONUS * urbanization);
    production *= urbanizationMultiplier;

    // 4. Multiplicador por riqueza (poder de compra)
    const wealthMultiplier = 1 + (CONSUMER_GOODS_FACTORS.MULTIPLIERS.WEALTH_MULTIPLIER * pibPerCapita);
    production *= wealthMultiplier;

    // 5. Multiplicador por estabilidade (capacidade de produzir)
    const stabilityMultiplier = 1 + (CONSUMER_GOODS_FACTORS.MULTIPLIERS.STABILITY_EFFECT * (stability - 50) / 100);
    production *= stabilityMultiplier;

    // 6. [Removido] Penalidade para economias planificadas (removida por solicitação)

    return production;
  }

  /**
   * Calcula a demanda de bens de consumo
   */
  static calculateDemand(population, urbanization, pibPerCapita, countryName) {
    const populationInMillions = population / 1000000;

    // 1. Demanda base por população
    let demand = populationInMillions * CONSUMER_GOODS_FACTORS.POPULATION_DEMAND.BASE_DEMAND_PER_MILLION;

    // 2. Aumento por urbanização (cidades demandam muito mais bens)
    const urbanizationIncrease = 1 + (CONSUMER_GOODS_FACTORS.POPULATION_DEMAND.URBANIZATION_INCREASE * urbanization);
    demand *= urbanizationIncrease;

    // 3. Aumento por riqueza (expectativas maiores com desenvolvimento)
    const wealthIncrease = 1 + (CONSUMER_GOODS_FACTORS.POPULATION_DEMAND.WEALTH_EXPECTATION * pibPerCapita);
    demand *= wealthIncrease;

    // 4. [Removido] Modificador para economias planificadas (removido por solicitação)

    return demand;
  }

  /**
   * Obtém o nível de desenvolvimento
   */
  static getDevelopmentLevel(pibPerCapita) {
    if (pibPerCapita >= 2000) return 'ULTRA_DEVELOPED';
    if (pibPerCapita >= 1200) return 'HIGHLY_DEVELOPED';
    if (pibPerCapita >= 800) return 'DEVELOPED';
    if (pibPerCapita >= 500) return 'MODERATE';
    if (pibPerCapita >= 200) return 'DEVELOPING';
    return 'UNDERDEVELOPED';
  }

  /**
   * Obtém a taxa base de produção por desenvolvimento
   */
  static getBaseProductionRate(developmentLevel) {
    return CONSUMER_GOODS_FACTORS.BASE_PRODUCTION_FACTORS[developmentLevel] || 0.25;
  }

  /**
   * Calcula o efeito na estabilidade baseado no nível de bens de consumo
   */
  static getStabilityEffect(consumerGoodsLevel) {
    const effects = CONSUMER_GOODS_FACTORS.STABILITY_EFFECTS;

    if (consumerGoodsLevel >= effects.EXCELLENT.threshold) return effects.EXCELLENT.effect;
    if (consumerGoodsLevel >= effects.GOOD.threshold) return effects.GOOD.effect;
    if (consumerGoodsLevel >= effects.ADEQUATE.threshold) return effects.ADEQUATE.effect;
    if (consumerGoodsLevel >= effects.POOR.threshold) return effects.POOR.effect;
    if (consumerGoodsLevel >= effects.BAD.threshold) return effects.BAD.effect;
    return effects.CRITICAL.effect;
  }

  /**
   * Aplica o buff/debuff de estabilidade baseado nos bens de consumo
   */
  static applyStabilityEffect(country) {
    const consumerGoods = this.calculateConsumerGoods(country);
    const stabilityEffect = consumerGoods.metadata.stabilityEffect;
    const currentStability = parseFloat(country.Estabilidade) || 50;

    // Aplicar o efeito (limitado entre 0-100%)
    const newStability = Math.max(0, Math.min(100, currentStability + stabilityEffect));

    return {
      currentStability,
      stabilityEffect,
      newStability: Math.round(newStability * 100) / 100,
      consumerGoodsLevel: consumerGoods.level,
      effectDescription: this.getEffectDescription(stabilityEffect)
    };
  }

  /**
   * Obtém descrição do efeito
   */
  static getEffectDescription(effect) {
    if (effect >= 2.5) return 'População muito satisfeita';
    if (effect >= 1.5) return 'População satisfeita';
    if (effect >= -0.5) return 'População neutra';
    if (effect >= -2.5) return 'População insatisfeita';
    if (effect >= -4) return 'População muito insatisfeita';
    return 'População em crise';
  }

  /**
   * Gera relatório detalhado de bens de consumo
   */
  static generateConsumerGoodsReport(country) {
    const consumerGoods = this.calculateConsumerGoods(country);
    const stabilityEffect = this.applyStabilityEffect(country);
    const countryName = country.Pais || country.Nome || 'Desconhecido';

    return {
      country: countryName,
      consumerGoods,
      stabilityEffect,
      analysis: {
        satisfactionLevel: this.getSatisfactionLevel(consumerGoods.level),
        productionCapacity: consumerGoods.production > consumerGoods.demand ? 'Excedente' : 'Deficitário',
        economicImpact: stabilityEffect.stabilityEffect > 0 ? 'Positivo' : stabilityEffect.stabilityEffect < 0 ? 'Negativo' : 'Neutro'
      }
    };
  }

  /**
   * Obtém nível de satisfação em texto
   */
  static getSatisfactionLevel(level) {
    if (level >= 85) return 'Excelente';
    if (level >= 70) return 'Bom';
    if (level >= 50) return 'Adequado';
    if (level >= 30) return 'Ruim';
    if (level >= 15) return 'Muito Ruim';
    return 'Crítico';
  }
}

export default ConsumerGoodsCalculator;