/**
 * Sistema de Cálculos Econômicos - War 1954
 * Implementa todas as mecânicas de crescimento, inflação e cadeias produtivas
 */

import { Logger } from '../utils.js';
import { calculatePIBTotal, calculatePIBPerCapita, applyGrowthToPIBPerCapita } from '../utils/pibCalculations.js';
import { POWER_PLANTS } from '../data/power_plants.js';

// Configurações de cálculo
const CALCULATION_CONFIG = {
  // Base do dado D12
  diceBase: {
    successThreshold: 5, // Dados > 5 são sucessos
    maxDice: 12,
    failurePenalty: 0.02 // -2% para dados críticos baixos (1-3)
  },

  // Modificadores de inflação
  inflation: {
    external: {
      impact_5_percent: 0.20,    // +20% inflação se >5% PIB receptor
      impact_20_percent: 0.40,   // +40% adicional se >20%
      impact_40_percent: 0.40,   // +40% adicional se >40%
      economic_ratio_5x: 0.15,   // +15% se doador 5x maior
      economic_ratio_10x: 0.25   // +25% adicional se 10x maior
    },
    
    internal: {
      concentration_80: 0.15     // APENAS penalidade leve por concentração extrema (>80% em um tipo)
    },
    
    resistance: {
      technology_70: 0.25,       // Aumentado: -25% inflação se tecnologia >70
      stability_75: 0.20,        // Aumentado: -20% se estabilidade >75
      superpower: 0.30,          // Aumentado: -30% se superpotência
      max_resistance: 0.60       // Aumentado: Máximo 60% resistência
    }
  }
};

// Classe principal de cálculos
class EconomicCalculations {
  
  // Calcular crescimento base de uma ação
  static calculateBaseGrowth(action, country) {
    const { dice, type, value, buff = 0 } = action;
    
    // 1. Base do dado (D12: sucesso se > 5) - FÓRMULA MUITO MAIS GENEROSA
    let baseGrowth = 0;
    if (dice > CALCULATION_CONFIG.diceBase.successThreshold) {
      // Fórmula MUITO mais generosa: crescimento exponencial
      baseGrowth = (dice - CALCULATION_CONFIG.diceBase.successThreshold) / 12;
    } else if (dice <= 3) {
      // Dados críticos baixos podem causar pequenas perdas
      baseGrowth = -CALCULATION_CONFIG.diceBase.failurePenalty;
    } else {
      // Dados 4-5 agora dão crescimento mínimo
      baseGrowth = 0.02; // 2% mínimo
    }

    // 2. Modificador do país MUITO MAIS GENEROSO (tecnologia × urbanização)
    const technology = (parseFloat(country.Tecnologia) || 0) / 100;
    const urbanization = (parseFloat(country.Urbanizacao) || 0) / 100;
    const countryModifier = 1 + (technology * urbanization * 1.5); // 3x mais generoso

    // 3. Modificador de estabilidade
    const stability = parseFloat(country.Estabilidade) || 0;
    let stabilityModifier = 1.0;
    
    if (stability < 30) {
      stabilityModifier = 0.6; // -40% se crítica
    } else if (stability < 50) {
      stabilityModifier = 0.8; // -20% se baixa
    } else if (stability > 80) {
      stabilityModifier = 1.2; // +20% se alta
    }

    // 4. Multiplicador do tipo de ação
    const typeConfig = this.getActionTypeConfig(type);
    let typeMultiplier = typeConfig.multiplier;
    
    // Aplicar bônus/penalidades específicos do tipo
    typeMultiplier = this.applyTypeSpecificModifiers(typeMultiplier, typeConfig, country);

    // 5. Buff/Debuff manual
    const buffModifier = 1 + (buff / 100);

    // Cálculo final antes da inflação
    const preInflationGrowth = baseGrowth * countryModifier * stabilityModifier * typeMultiplier * buffModifier;

    return {
      baseGrowth,
      countryModifier,
      stabilityModifier,
      typeMultiplier,
      buffModifier,
      preInflationGrowth,
      value: parseFloat(value) || 0
    };
  }

  // Obter configuração do tipo de ação - MULTIPLICADORES MAIS GENEROSOS
  static getActionTypeConfig(type) {
    const types = {
      infrastructure: { multiplier: 1.3, bonusCondition: 'urbanization', bonusThreshold: 50, bonusValue: 0.4 }, // Era 0.9, agora 1.3
      research: { multiplier: 1.8, bonusCondition: 'technology', bonusThreshold: 60, bonusValue: 0.5 }, // Era 1.2, agora 1.8  
      industry: { multiplier: 1.6, pibBonus: 0.5, penaltyCondition: 'stability', penaltyThreshold: 40, penaltyValue: 0.15 }, // Era 1.1, agora 1.6
      social: { multiplier: 1.1, stabilityBonus: 1 } // Era 0.8, agora 1.1
    };

    return types[type] || { multiplier: 1.2 };
  }

  // Aplicar modificadores específicos do tipo
  static applyTypeSpecificModifiers(baseMultiplier, typeConfig, country) {
    let multiplier = baseMultiplier;
    
    // Bônus por condição
    if (typeConfig.bonusCondition) {
      const value = this.getCountryStatValue(country, typeConfig.bonusCondition);
      if (value > typeConfig.bonusThreshold) {
        multiplier *= (1 + typeConfig.bonusValue);
      }
    }

    // Penalidade por condição
    if (typeConfig.penaltyCondition) {
      const value = this.getCountryStatValue(country, typeConfig.penaltyCondition);
      if (value < typeConfig.penaltyThreshold) {
        multiplier *= (1 - typeConfig.penaltyValue);
      }
    }

    // Bônus específico no PIB (indústria)
    if (typeConfig.pibBonus) {
      multiplier *= (1 + typeConfig.pibBonus);
    }

    return multiplier;
  }

  // Obter valor de estatística do país
  static getCountryStatValue(country, stat) {
    const statMap = {
      technology: parseFloat(country.Tecnologia) || 0,
      urbanization: parseFloat(country.Urbanizacao) || 0,
      stability: parseFloat(country.Estabilidade) || 0,
      pib: parseFloat(country.PIB) || 0
    };

    return statMap[stat] || 0;
  }

  // Calcular cadeias produtivas (sinergias)
  static calculateProductiveChains(actions, country) {
    const activeTypes = [...new Set(actions.map(a => a.type))];
    const bonuses = [];

    // Infraestrutura + Indústria
    if (activeTypes.includes('infrastructure') && activeTypes.includes('industry')) {
      bonuses.push({
        name: 'Infraestrutura + Indústria',
        bonus: 0.35, // Era 0.15, agora 0.35
        affectedType: 'industry',
        description: 'Infraestrutura potencializa desenvolvimento industrial'
      });

      // Efeito especial: elimina penalidade de estabilidade se < 50
      const stability = parseFloat(country.Estabilidade) || 0;
      if (stability < 50) {
        bonuses.push({
          name: 'Infraestrutura + Indústria (Estabilidade)',
          bonus: 0.30, // Era 0.20, agora 0.30
          affectedType: 'industry',
          description: 'Infraestrutura elimina penalidade de estabilidade baixa'
        });
      }
    }

    // P&D + Indústria
    if (activeTypes.includes('research') && activeTypes.includes('industry')) {
      bonuses.push({
        name: 'P&D + Indústria',
        bonus: 0.25, // Era 0.10, agora 0.25
        affectedType: 'industry',
        description: 'Inovação acelera crescimento industrial',
        techBonus: 1 // +1 ponto adicional de tecnologia
      });
    }

    // P&D + Social
    if (activeTypes.includes('research') && activeTypes.includes('social')) {
      bonuses.push({
        name: 'P&D + Social',
        bonus: 0.35, // Era 0.20, agora 0.35
        affectedType: 'social',
        description: 'Pesquisa melhora eficiência de políticas sociais',
        techBonus: 1 // +1 ponto adicional de tecnologia
      });
    }

    return bonuses;
  }

  // Calcular inflação total
  static calculateInflation(actions, country, targetCountries = {}) {
    let totalInflation = 0;

    // 1. Inflação por ações externas
    const externalActions = actions.filter(a => a.isExternal);
    for (const action of externalActions) {
      const targetCountry = targetCountries[action.targetCountry];
      if (targetCountry) {
        totalInflation += this.calculateExternalInflation(action, country, targetCountry);
      }
    }

    // 2. Inflação por distribuição interna
    totalInflation += this.calculateDistributionInflation(actions, country);

    // 3. Aplicar resistência à inflação
    const resistance = this.calculateInflationResistance(country);
    totalInflation = Math.max(0, totalInflation - resistance);

    // 4. Cap máximo de 85%
    return Math.min(totalInflation, 0.85);
  }

  // Calcular inflação externa
  static calculateExternalInflation(action, originCountry, targetCountry) {
    let inflation = 0;
    
    const investmentValue = parseFloat(action.value) || 0;
    const targetPIB = parseFloat(targetCountry.PIB) || 1;
    const impact = investmentValue / targetPIB;

    // Inflação por impacto no PIB receptor
    if (impact > 0.05) inflation += CALCULATION_CONFIG.inflation.external.impact_5_percent;
    if (impact > 0.20) inflation += CALCULATION_CONFIG.inflation.external.impact_20_percent;
    if (impact > 0.40) inflation += CALCULATION_CONFIG.inflation.external.impact_40_percent;

    // Inflação por diferença econômica
    const originPIB = parseFloat(originCountry.PIB) || 1;
    const economicRatio = originPIB / targetPIB;
    
    if (economicRatio > 5) inflation += CALCULATION_CONFIG.inflation.external.economic_ratio_5x;
    if (economicRatio > 10) inflation += CALCULATION_CONFIG.inflation.external.economic_ratio_10x;

    return inflation;
  }

  // Calcular inflação por distribuição
  static calculateDistributionInflation(actions, country) {
    let inflation = 0;
    
    if (actions.length === 0) return 0;

    // Análise por tipo de ação
    const typeDistribution = {};
    let totalValue = 0;

    actions.forEach(action => {
      const value = parseFloat(action.value) || 0;
      totalValue += value * 1000000; // Converter de milhões
      
      if (!typeDistribution[action.type]) {
        typeDistribution[action.type] = 0;
      }
      typeDistribution[action.type] += value * 1000000;
    });

    // Inflação APENAS por concentração excessiva em um tipo
    const budget = this.calculateBudget(country);
    for (const [type, value] of Object.entries(typeDistribution)) {
      const concentration = value / budget;
      
      // Só penalizar se concentrar MAIS de 80% em um único tipo
      if (concentration > 0.8) inflation += CALCULATION_CONFIG.inflation.internal.concentration_80;
    }

    // REMOVIDO: Penalidade por usar orçamento total (não faz sentido penalizar o player)

    return inflation;
  }

  // Calcular resistência à inflação - MUITO MAIS GENEROSA
  static calculateInflationResistance(country) {
    let resistance = 0.15; // RESISTÊNCIA BASE de 15% para todos os países

    const technology = parseFloat(country.Tecnologia) || 0;
    const stability = parseFloat(country.Estabilidade) || 0;
    const pib = parseFloat(country.PIB) || 0;

    // Resistência por tecnologia (limites mais baixos)
    if (technology > 50) resistance += 0.15;  // +15% se tech > 50%
    if (technology > 70) resistance += CALCULATION_CONFIG.inflation.resistance.technology_70;

    // Resistência por estabilidade (limites mais baixos)
    if (stability > 50) resistance += 0.10;   // +10% se estabilidade > 50%
    if (stability > 75) resistance += CALCULATION_CONFIG.inflation.resistance.stability_75;

    // Resistência por tamanho da economia
    if (pib > 50000000000) resistance += 0.10;   // +10% se > $50bi
    if (pib > 200000000000) resistance += 0.15;  // +15% adicional se > $200bi
    if (pib > 500000000000) {                     // +30% adicional se > $500bi
      resistance += CALCULATION_CONFIG.inflation.resistance.superpower;
    }

    // Cap máximo de resistência
    return Math.min(resistance, CALCULATION_CONFIG.inflation.resistance.max_resistance);
  }

  // Calcular orçamento (reutilizar fórmula existente)
  static calculateBudget(country) {
    const pib = parseFloat(country.PIB) || 0;
    const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
    const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;
    return pib * 0.25 * burocracia * estabilidade * 1.5;
  }

  // Processar todas as ações e calcular resultado final
  static processAllActions(actions, country, targetCountries = {}) {
    const results = {
      actions: [],
      totalGrowth: 0,
      totalInflation: 0,
      finalGrowth: 0,
      newPIB: 0,
      productiveChains: [],
      stabilityChanges: 0,
      technologyChanges: 0
    };

    // 1. Calcular crescimento base de cada ação
    actions.forEach(action => {
      const actionResult = this.calculateBaseGrowth(action, country);
      results.actions.push({
        ...action,
        ...actionResult
      });
    });

    // 2. Aplicar cadeias produtivas
    const productiveChains = this.calculateProductiveChains(actions, country);
    results.productiveChains = productiveChains;

    // Aplicar bônus das cadeias
    productiveChains.forEach(chain => {
      results.actions.forEach(actionResult => {
        if (actionResult.type === chain.affectedType) {
          actionResult.preInflationGrowth *= (1 + chain.bonus);
          actionResult.chainBonus = chain.bonus;
        }
      });

      // Bônus de tecnologia das cadeias
      if (chain.techBonus) {
        results.technologyChanges += chain.techBonus;
      }
    });

    // 3. Calcular crescimento total antes da inflação - SISTEMA PIB PER CAPITA
    const currentPIBPerCapita = parseFloat(country.PIBPerCapita) || calculatePIBPerCapita(parseFloat(country.PIB) || 0, parseFloat(country.Populacao) || 1);
    const populacao = parseFloat(country.Populacao) || 1;
    
    results.totalGrowth = results.actions.reduce((acc, action) => {
      // Crescimento baseado na proporção do investimento vs PIB per capita
      const actionGrowth = action.preInflationGrowth * (action.value * 1000000) / (currentPIBPerCapita * populacao);
      return acc + actionGrowth;
    }, 0);

    // 4. Calcular inflação
    results.totalInflation = this.calculateInflation(actions, country, targetCountries);

    // 5. Aplicar inflação ao crescimento
    results.finalGrowth = results.totalGrowth * (1 - results.totalInflation);

    // 6. Calcular novo PIB per capita e PIB total
    results.newPIBPerCapita = applyGrowthToPIBPerCapita(currentPIBPerCapita, results.finalGrowth);
    results.newPIB = calculatePIBTotal(populacao, results.newPIBPerCapita);

    // 7. Calcular mudanças de estabilidade
    results.stabilityChanges = actions
      .filter(a => a.type === 'social' && a.dice > CALCULATION_CONFIG.diceBase.successThreshold)
      .length;

    return results;
  }

  // Calcular dependência econômica
  static calculateEconomicDependency(countryId, history, investorId) {
    if (!history || history.length < 3) return 0;

    // Analisar últimos 5 turnos
    const recentHistory = history.slice(-5);
    let totalExternal = 0;
    let fromInvestor = 0;

    recentHistory.forEach(turn => {
      if (turn.externalInvestments) {
        Object.entries(turn.externalInvestments).forEach(([investor, amount]) => {
          totalExternal += amount;
          if (investor === investorId) {
            fromInvestor += amount;
          }
        });
      }
    });

    if (totalExternal === 0) return 0;

    // Dependência = % dos investimentos externos vindos deste investidor
    return fromInvestor / totalExternal;
  }

    // --- NOVAS FUNÇÕES: recursos, energia e bens de consumo ---
    // Consumo de recurso pela ação industrial (valor em milhões -> unidades de recurso)
    static computeIndustryResourceConsumption(actionValueMillions, country) {
      // regra simples: cada 1M investido consome 0.2 unidades de recurso base
      const baseRate = 0.2;
      const amount = (parseFloat(actionValueMillions) || 0) * baseRate;
      return amount;
    }

    // Calcula penalidade por déficit de energia (0..1 multiplicador de eficácia)
    static computeEnergyPenalty(energyCapacity, energyDemand) {
      if (energyCapacity >= energyDemand) return 1.0;
      // deficit fraction
      const deficit = (energyDemand - energyCapacity) / Math.max(energyDemand, 1);
      // cada 25% de déficit reduz eficácia em 15% (exponencial leve)
      const penalty = Math.max(0, 1 - deficit * 0.6);
      return penalty;
    }

    // Calcular índice de Bens de Consumo (0-100)
    static computeConsumerGoodsIndex(country, resources = {}) {
      // recursos: { Graos, Combustivel, EnergiaDisponivel }
      const graos = parseFloat(resources.Graos || country.Graos || 0);
      const combustivel = parseFloat(resources.Combustivel || country.Combustivel || 0);
      const energia = parseFloat(resources.EnergiaDisponivel || country.EnergiaDisponivel || country.EnergiaCapacidade || 0);
      const industrialEfficiency = parseFloat(country.IndustrialEfficiency) || 50;

      // Normalizar esperadas: supor que 100 é abundante para graos/combustivel/energia
      const gScore = Math.min(1, graos / 100);
      const fScore = Math.min(1, (combustivel + energia) / 100);
      const iScore = Math.min(1, industrialEfficiency / 100);

      // Pesos: 40% alimentos, 30% energia/combustivel, 30% eficiência industrial
      const idx = (gScore * 0.4 + fScore * 0.3 + iScore * 0.3) * 100;
      return Math.round(idx);
    }

    // Nova versão da métrica de Bens de Consumo (V2)
    // Retorna { index: 0..100, breakdown: { g, f, i, p, s }, urbanFactor }
    static computeConsumerGoodsIndexV2(country, resources = {}) {
      try {
        const G = parseFloat(resources.Graos || country.Graos || 0);
        const Comb = parseFloat(resources.Combustivel || country.Combustivel || 0);
        const Energia = parseFloat(resources.EnergiaDisponivel || country.EnergiaDisponivel || country.EnergiaCapacidade || 0);
        const I = parseFloat(country.IndustrialEfficiency) || 50;
        const PIB = parseFloat(country.PIB) || 0;
        const Pop = parseFloat(country.Populacao) || 1;
        const PIBpc = Pop > 0 ? (PIB / Pop) : 0;
        const S = parseFloat(country.Estabilidade) || 50;
        const U = parseFloat(country.Urbanizacao) || 50;

  // Softer reference caps for historical 1954 scale
  const Gref = 150; // permitir maiores estoques sem penalizar
  const Fref = 250; // combustível+energia referência mais alta
  const Pref = 10000; // reduzir referência de PIBpc para refletir 1954 USD

  // Normalizações 0..1
  const g = Math.min(1, G / Gref);
  const f = Math.min(1, (Comb + Energia) / Fref);
  const i = Math.min(1, I / 100);
  const p = Math.min(1, PIBpc / Pref);
  const s = Math.min(1, S / 100);

  // Pesos ajustados: menos penalidade por falta de recursos, mais peso para eficiência e PIB
  const Wg = 0.25, Wf = 0.20, Wi = 0.25, Wp = 0.20, Ws = 0.10;

  // Urbanização multiplicador mais moderado (U=50 => 1.0, +/-5%)
  const urbanFactor = 1 + ((U / 100) - 0.5) * 0.1;

        const base = Wg * g + Wf * f + Wi * i + Wp * p + Ws * s;
        const raw = base * urbanFactor;
        const index = Math.round(Math.max(0, Math.min(1, raw)) * 100);

        return {
          index,
          breakdown: { g: Number((g*100).toFixed(1)), f: Number((f*100).toFixed(1)), i: Number((i*100).toFixed(1)), p: Number((p*100).toFixed(1)), s: Number((s*100).toFixed(1)) },
          urbanFactor: Number(urbanFactor.toFixed(3))
        };
      } catch (err) {
        Logger.error('computeConsumerGoodsIndexV2 failed:', err);
        return { index: 0, breakdown: { g:0,f:0,i:0,p:0,s:0 }, urbanFactor: 1 };
      }
    }

    // Estimar demanda de energia média (GW) baseada em PIB per capita, população, eficiência industrial e urbanização
    // Retorna objeto { demandaGW, perCapitaKWh, totalGWh }
    static computeEnergyDemandGW(country) {
      try {
        const pib = parseFloat(country.PIB) || 0;
        const pop = parseFloat(country.Populacao) || 1;
        const pibPerCapita = pop > 0 ? (pib / pop) : 0;

        // parâmetros heurísticos — simples e explicáveis
        // consumo base anual por pessoa (kWh) em cenário mínimo
        const baseKWh = 500; // consumo básico por ano

        // aumenta com PIB per capita: cada $1000 adiciona 50 kWh per capita (escala moderada)
        const pibScale = (pibPerCapita / 1000) * 50;

        // urbanização incrementa consumo por pessoa até +40%
        const urbanizacao = (parseFloat(country.Urbanizacao) || 0) / 100;
        const urbanFactor = 1 + Math.min(0.4, urbanizacao * 0.4);

        // eficiência industrial reduz intensidade energética (máx 25% redução)
        const industrialEfficiency = (parseFloat(country.IndustrialEfficiency) || 50) / 100;
        const efficiencyFactor = 1 - Math.min(0.25, industrialEfficiency * 0.25);

        const perCapitaKWh = Math.max(0, (baseKWh + pibScale) * urbanFactor * efficiencyFactor);

        // total anual (GWh)
        const totalGWh = (perCapitaKWh * pop) / 1e6;

        // média contínua em GW = totalGWh / 8760
        const demandaGW = totalGWh / 8760;

        return {
          demandaGW: Number(demandaGW.toFixed(3)),
          perCapitaKWh: Number(perCapitaKWh.toFixed(1)),
          totalGWh: Number(totalGWh.toFixed(2))
        };
      } catch (err) {
        Logger.error('computeEnergyDemandGW failed:', err);
        return { demandaGW: 0, perCapitaKWh: 0, totalGWh: 0 };
      }
    }


  // Calcular produção total de energia elétrica de um país
    static calculateEnergyProduction(country, currentResources) {
      let totalProduction = 0;
      const consumedResources = {
        Carvao: 0,
        Combustivel: 0,
        Uranio: 0 // Future resource
      };

      if (!country.power_plants || country.power_plants.length === 0) {
        return { totalProduction, consumedResources };
      }

      for (const plantInstance of country.power_plants) {
        const plantType = POWER_PLANTS[plantInstance.id];
        if (!plantType) {
          Logger.warn(`Tipo de usina desconhecido: ${plantInstance.id}`);
          continue;
        }

        let canProduce = true;
        // Verificar recursos necessários para usinas térmicas e nucleares
        if (plantType.resource_input) {
          const requiredResource = plantType.resource_input;
          const consumptionAmount = plantType.resource_consumption;

          if (currentResources[requiredResource] < consumptionAmount) {
            canProduce = false;
            Logger.info(`Usina ${plantType.name} não pode produzir por falta de ${requiredResource}.`);
          } else {
            // Simular consumo para o cálculo
            consumedResources[requiredResource] += consumptionAmount;
          }
        }

        // Verificar potencial para hidrelétricas
        if (plantType.type === 'hydro' && country.PotencialHidreletrico <= 0) {
          canProduce = false;
          Logger.info(`Usina ${plantType.name} não pode produzir por falta de potencial hidrelétrico.`);
        }

        if (canProduce) {
          totalProduction += plantType.energy_output;
        }
      }
      return { totalProduction, consumedResources };
    }


  // Verificar risco de rejeição popular
  static checkRejectionRisk(targetCountry, investmentValue, originCountry) {
    const stability = parseFloat(targetCountry.Estabilidade) || 0;
    const targetPIB = parseFloat(targetCountry.PIB) || 1;
    const impact = investmentValue / targetPIB;

    // País instável + grande investimento = risco de rejeição
    if (stability < 40 && impact > 0.10) {
      return {
        hasRisk: true,
        riskLevel: impact > 0.20 ? 'high' : 'medium',
        stabilityPenalty: Math.min(impact * 10, 3) // Até -3 pontos de estabilidade
      };
    }

    return { hasRisk: false };
  }

  // Verificar se país doador instável perde estabilidade
  static checkDonorStabilityPenalty(originCountry, totalExternalInvestment, budget) {
    const stability = parseFloat(originCountry.Estabilidade) || 0;
    const externalRatio = totalExternalInvestment / budget;

    if (stability < 40 && externalRatio > 0.20) {
      return Math.min(externalRatio * 5, 2); // Até -2 pontos de estabilidade
    }

    return 0;
  }
}

export default EconomicCalculations;