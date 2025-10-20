/**
 * Sistema de Cálculo de Produção de Recursos - War 1954
 * Calcula a produção mensal base de recursos baseada nas características dos países
 */

import { Logger } from '../utils.js';

/**
 * Fatores de produção baseados na realidade de 1954
 */
const PRODUCTION_FACTORS = {
  // Produção base per capita (por milhão de habitantes)
  BASE_PRODUCTION_PER_MILLION: {
    Graos: 200,        // 200 unidades por milhão (agricultura básica)
    Combustivel: 20,   // 20 unidades por milhão (refinarias básicas)
    Metais: 15,        // 15 unidades por milhão (mineração básica)
    Carvao: 25,        // 25 unidades por milhão (mineração de carvão)
    Energia: 80        // 80 MW por milhão (geração elétrica básica)
  },

  // Multiplicadores por nível de desenvolvimento (PIB per capita)
  DEVELOPMENT_MULTIPLIERS: {
    // PIB per capita (USD 1954) - multiplicadores de produção
    ultraDeveloped: { threshold: 2000, multiplier: 3.0 }, // EUA, Suíça
    highlyDeveloped: { threshold: 1200, multiplier: 2.5 }, // Reino Unido, França
    developed: { threshold: 800, multiplier: 2.0 },       // Alemanha Ocidental
    moderate: { threshold: 500, multiplier: 1.5 },        // URSS, Japão
    developing: { threshold: 200, multiplier: 1.0 },      // Brasil, México
    underdeveloped: { threshold: 0, multiplier: 0.6 }     // Países pobres
  },

  // Modificadores por urbanização (afeta produção industrial)
  URBANIZATION_MODIFIERS: {
    Combustivel: 0.015, // +1.5% produção por % urbanização (refinarias urbanas)
    Metais: 0.012,      // +1.2% produção por % urbanização (indústria)
    Energia: 0.02,      // +2% produção por % urbanização (demanda urbana)
    Graos: -0.012       // -1.2% produção por % urbanização (menos gente no campo)
  },

  // Modificadores especiais para grãos (produção automática)
  GRAIN_PRODUCTION_FACTORS: {
    // Fórmula base: População rural × Tecnologia agrícola × Geografia × Clima
    RURAL_PRODUCTIVITY_BASE: 250,  // Produção por milhão de população rural
    TECHNOLOGY_EFFICIENCY: 0.025,  // +2.5% por ponto de tecnologia (tratores, fertilizantes, etc.)
    MAX_URBANIZATION_PENALTY: 0.3, // Máximo de 70% de redução (quando 100% urbano)
    DEVELOPMENT_BONUS: 0.001        // Pequeno bônus por PIB per capita (investimento em agricultura)
  },

  // Modificadores por tecnologia (eficiência de produção)
  TECHNOLOGY_MULTIPLIERS: {
    Graos: 0.015,       // +1.5% por ponto de tecnologia (agricultura moderna)
    Combustivel: 0.02,  // +2% por ponto (refinarias eficientes)
    Metais: 0.018,      // +1.8% por ponto (mineração moderna)
    Carvao: 0.012,      // +1.2% por ponto (extração eficiente)
    Energia: 0.025      // +2.5% por ponto (geração eficiente)
  },

  // Modificadores por geografia/recursos naturais históricos
  GEOGRAPHIC_MODIFIERS: {
    // Países com abundância histórica de recursos específicos (1954)
    oil_rich: {
      countries: ['Venezuela', 'Arábia Saudita', 'Kuwait', 'Iraque', 'Estados Unidos', 'URSS', 'Irã'],
      modifier: { Combustivel: 2.5 }
    },
    coal_rich: {
      countries: ['Estados Unidos', 'Reino Unido', 'Alemanha', 'URSS', 'China', 'Polônia'],
      modifier: { Carvao: 2.0 }
    },
    mineral_rich: {
      countries: ['Estados Unidos', 'URSS', 'Canadá', 'Austrália', 'Brasil', 'África do Sul'],
      modifier: { Metais: 1.8 }
    },
    agricultural: {
      countries: ['Estados Unidos', 'URSS', 'Argentina', 'Brasil', 'Canadá', 'Austrália', 'França', 'Ucrânia'],
      modifier: { Graos: 1.8 }  // Aumentado para refletir melhor a vantagem agrícola
    },
    super_agricultural: {
      countries: ['URSS', 'Estados Unidos'],  // Superpotências agrícolas
      modifier: { Graos: 2.2 }  // URSS com Ucrânia + EUA com Great Plains
    },
    industrialized: {
      countries: ['Estados Unidos', 'Reino Unido', 'Alemanha', 'França', 'URSS', 'Japão'],
      modifier: { Energia: 1.4 }
    }
  },

  // Modificadores climáticos para produção
  CLIMATE_PRODUCTION_MODIFIERS: {
    cold: { Graos: 0.8, Energia: 1.2 },     // Menos agricultura, mais energia para aquecimento
    temperate: { Graos: 1.0, Energia: 1.0 }, // Balanceado
    warm: { Graos: 1.1, Energia: 0.9 },     // Mais agricultura, menos energia
    hot: { Graos: 0.7, Energia: 0.8 }       // Agricultura difícil, menos energia
  }
};

/**
 * Mapeamento de países para zonas climáticas (reutilizando do consumo)
 */
const CLIMATE_ZONES = {
  cold: [
    'URSS', 'Canadá', 'Finlândia', 'Suécia', 'Noruega', 'Islândia',
    'Dinamarca', 'Polônia', 'Tchecoslováquia', 'Mongólia'
  ],
  temperate: [
    'Estados Unidos', 'Reino Unido', 'França', 'Alemanha', 'Itália',
    'Espanha', 'Portugal', 'Holanda', 'Bélgica', 'Suíça', 'Áustria',
    'Hungria', 'Romênia', 'Bulgária', 'Iugoslávia', 'Coreia do Sul',
    'Coreia do Norte', 'Japão', 'China', 'Argentina', 'Chile', 'Uruguai'
  ],
  warm: [
    'Brasil', 'México', 'Venezuela', 'Colômbia', 'Equador', 'Peru',
    'Bolívia', 'Paraguai', 'Guatemala', 'Cuba', 'Índia', 'Paquistão',
    'Bangladesh', 'Birmânia', 'Tailândia', 'Vietnã', 'Filipinas',
    'Indonésia', 'Malásia', 'Turquia', 'Síria', 'Líbano', 'Israel',
    'Jordânia', 'Irã', 'Afeganistão', 'Marrocos', 'Argélia', 'Tunísia'
  ],
  hot: [
    'Arábia Saudita', 'Kuwait', 'Iraque', 'Líbia', 'Egito', 'Sudão',
    'Etiópia', 'Quênia', 'Tanzânia', 'Somália', 'Chade', 'Nigéria',
    'Mali', 'Níger', 'Austrália', 'Sri Lanka', 'Emirados Árabes Unidos'
  ]
};

class ResourceProductionCalculator {

  /**
   * Calcula a produção total de recursos para um país
   */
  static calculateCountryProduction(country) {
    try {
      const population = parseFloat(country.Populacao) || 1;
      const pibPerCapita = parseFloat(country.PIBPerCapita) || 500;
      const urbanization = parseFloat(country.Urbanizacao) || 30;
      const technology = parseFloat(country.Tecnologia) || 20;
      const countryName = country.Pais || country.Nome || 'Desconhecido';

      // 1. Produção base per capita
      const baseProduction = this.calculateBaseProduction(population);

      // 2. Multiplicador por desenvolvimento
      const devMultiplier = this.getDevelopmentMultiplier(pibPerCapita);

      // 3. Modificadores por urbanização
      const urbanModifiers = this.calculateUrbanizationModifiers(urbanization);

      // 4. Modificadores de tecnologia
      const technologyModifiers = this.calculateTechnologyModifiers(technology);

      // 5. Modificadores geográficos/recursos naturais
      const geographicModifiers = this.getGeographicModifiers(countryName);

      // 6. Modificadores climáticos
      const climateModifiers = this.getClimateProductionModifiers(countryName);

      // Calcular produção final para cada recurso
      const production = {};

      // 1. GRÃOS - Sistema automático especial baseado em população rural + tecnologia
      const grainResult = this.calculateGrainProduction(country);
      production.Graos = grainResult.production;

      // 2. OUTROS RECURSOS - Sistema industrial baseado em desenvolvimento
      const industrialResources = ['Combustivel', 'Metais', 'Carvao', 'Energia'];

      industrialResources.forEach(resource => {
        let resourceProduction = baseProduction[resource] * devMultiplier;

        // Aplicar modificadores específicos
        if (urbanModifiers[resource]) {
          resourceProduction *= urbanModifiers[resource];
        }

        if (technologyModifiers[resource]) {
          resourceProduction *= technologyModifiers[resource];
        }

        if (geographicModifiers[resource]) {
          resourceProduction *= geographicModifiers[resource];
        }

        if (climateModifiers[resource]) {
          resourceProduction *= climateModifiers[resource];
        }

        // NOVO: 7. Aplicar modificadores das Leis Nacionais
        if (country.currentModifiers) {
          // Modificador geral de produção de recursos
          if (typeof country.currentModifiers.resourceProduction === 'number') {
            resourceProduction *= (1 + country.currentModifiers.resourceProduction);
          }
          // Modificador de eficiência de fábrica civil (afeta recursos industriais)
          if (typeof country.currentModifiers.civilianFactoryEfficiency === 'number') {
            resourceProduction *= (1 + country.currentModifiers.civilianFactoryEfficiency);
          }
        }

        // Arredondar para inteiro
        production[resource] = Math.round(resourceProduction);
      });

      // Adicionar metadados do cálculo
      production._metadata = {
        calculatedAt: new Date().toISOString(),
        countryName,
        population: Math.round(population),
        pibPerCapita: Math.round(pibPerCapita),
        developmentLevel: this.getDevelopmentLevel(pibPerCapita),
        climateZone: this.getClimateZone(countryName),
        devMultiplier,
        geographicBonuses: this.getCountryGeographicBonuses(countryName),
        // Metadados específicos de grãos
        grainDetails: grainResult.metadata
      };

      return production;

    } catch (error) {
      Logger.error('Erro ao calcular produção:', error);
      return this.getDefaultProduction();
    }
  }

  /**
   * Calcula produção base baseada na população
   */
  static calculateBaseProduction(population) {
    const populationInMillions = population / 1000000;
    const baseFactors = PRODUCTION_FACTORS.BASE_PRODUCTION_PER_MILLION;

    return {
      Graos: Math.round(baseFactors.Graos * populationInMillions),
      Combustivel: Math.round(baseFactors.Combustivel * populationInMillions),
      Metais: Math.round(baseFactors.Metais * populationInMillions),
      Carvao: Math.round(baseFactors.Carvao * populationInMillions),
      Energia: Math.round(baseFactors.Energia * populationInMillions)
    };
  }

  /**
   * Calcula produção específica de grãos (sistema automático)
   * Baseado principalmente em: população rural + tecnologia + geografia + clima
   */
  static calculateGrainProduction(country) {
    const population = parseFloat(country.Populacao) || 1;
    const urbanization = parseFloat(country.Urbanizacao) || 30;
    const technology = parseFloat(country.Tecnologia) || 20;
    const pibPerCapita = parseFloat(country.PIBPerCapita) || 500;
    const countryName = country.Pais || country.Nome || 'Desconhecido';

    // 1. Calcular população rural (% que está no campo)
    const ruralPopulationPercent = Math.max(10, 100 - urbanization); // Mínimo 10% rural
    const ruralPopulationMillions = (population * ruralPopulationPercent / 100) / 1000000;

    // 2. Produtividade base da população rural
    const grainFactors = PRODUCTION_FACTORS.GRAIN_PRODUCTION_FACTORS;
    let grainProduction = ruralPopulationMillions * grainFactors.RURAL_PRODUCTIVITY_BASE;

    // 3. Multiplicador de tecnologia (tratores, fertilizantes, sementes melhoradas)
    const technologyMultiplier = 1 + (grainFactors.TECHNOLOGY_EFFICIENCY * technology);
    grainProduction *= technologyMultiplier;

    // 4. Pequeno bônus por desenvolvimento (investimento em agricultura)
    const developmentBonus = 1 + (grainFactors.DEVELOPMENT_BONUS * pibPerCapita);
    grainProduction *= developmentBonus;

    // 5. Modificadores geográficos (países naturalmente agrícolas)
    const geographicModifiers = this.getGeographicModifiers(countryName);
    if (geographicModifiers.Graos) {
      grainProduction *= geographicModifiers.Graos;
    }

    // 6. Modificadores climáticos
    const climateModifiers = this.getClimateProductionModifiers(countryName);
    if (climateModifiers.Graos) {
      grainProduction *= climateModifiers.Graos;
    }

    return {
      production: Math.round(grainProduction),
      metadata: {
        ruralPopulationPercent: Math.round(ruralPopulationPercent),
        ruralPopulationMillions: Math.round(ruralPopulationMillions * 100) / 100,
        technologyMultiplier: Math.round(technologyMultiplier * 100) / 100,
        developmentBonus: Math.round(developmentBonus * 100) / 100,
        geographicBonus: geographicModifiers.Graos || 1.0,
        climateEffect: climateModifiers.Graos || 1.0
      }
    };
  }

  /**
   * Obtém multiplicador por nível de desenvolvimento
   */
  static getDevelopmentMultiplier(pibPerCapita) {
    const levels = PRODUCTION_FACTORS.DEVELOPMENT_MULTIPLIERS;

    if (pibPerCapita >= levels.ultraDeveloped.threshold) return levels.ultraDeveloped.multiplier;
    if (pibPerCapita >= levels.highlyDeveloped.threshold) return levels.highlyDeveloped.multiplier;
    if (pibPerCapita >= levels.developed.threshold) return levels.developed.multiplier;
    if (pibPerCapita >= levels.moderate.threshold) return levels.moderate.multiplier;
    if (pibPerCapita >= levels.developing.threshold) return levels.developing.multiplier;
    return levels.underdeveloped.multiplier;
  }

  /**
   * Obtém o nível de desenvolvimento em texto
   */
  static getDevelopmentLevel(pibPerCapita) {
    const levels = PRODUCTION_FACTORS.DEVELOPMENT_MULTIPLIERS;

    if (pibPerCapita >= levels.ultraDeveloped.threshold) return 'Ultra Desenvolvido';
    if (pibPerCapita >= levels.highlyDeveloped.threshold) return 'Muito Desenvolvido';
    if (pibPerCapita >= levels.developed.threshold) return 'Desenvolvido';
    if (pibPerCapita >= levels.moderate.threshold) return 'Moderado';
    if (pibPerCapita >= levels.developing.threshold) return 'Em Desenvolvimento';
    return 'Subdesenvolvido';
  }

  /**
   * Calcula modificadores por urbanização
   */
  static calculateUrbanizationModifiers(urbanization) {
    const modifiers = PRODUCTION_FACTORS.URBANIZATION_MODIFIERS;

    return {
      Combustivel: 1 + (modifiers.Combustivel * urbanization),
      Metais: 1 + (modifiers.Metais * urbanization),
      Energia: 1 + (modifiers.Energia * urbanization),
      Graos: 1 + (modifiers.Graos * urbanization)
    };
  }

  /**
   * Calcula modificadores de tecnologia
   */
  static calculateTechnologyModifiers(technology) {
    const modifiers = PRODUCTION_FACTORS.TECHNOLOGY_MULTIPLIERS;

    return {
      Graos: 1 + (modifiers.Graos * technology),
      Combustivel: 1 + (modifiers.Combustivel * technology),
      Metais: 1 + (modifiers.Metais * technology),
      Carvao: 1 + (modifiers.Carvao * technology),
      Energia: 1 + (modifiers.Energia * technology)
    };
  }

  /**
   * Obtém modificadores geográficos/recursos naturais
   */
  static getGeographicModifiers(countryName) {
    const modifiers = { Graos: 1, Combustivel: 1, Metais: 1, Carvao: 1, Energia: 1 };
    const geographic = PRODUCTION_FACTORS.GEOGRAPHIC_MODIFIERS;

    // Verificar cada categoria de recurso (super_agricultural tem prioridade)
    const categories = ['oil_rich', 'coal_rich', 'mineral_rich', 'agricultural', 'super_agricultural', 'industrialized'];

    categories.forEach(category => {
      const data = geographic[category];
      if (data && data.countries.includes(countryName)) {
        Object.entries(data.modifier).forEach(([resource, multiplier]) => {
          modifiers[resource] = multiplier; // Super_agricultural sobrescreve agricultural
        });
      }
    });

    return modifiers;
  }

  /**
   * Obtém bônus geográficos de um país para exibição
   */
  static getCountryGeographicBonuses(countryName) {
    const bonuses = [];
    const geographic = PRODUCTION_FACTORS.GEOGRAPHIC_MODIFIERS;

    Object.entries(geographic).forEach(([category, data]) => {
      if (data.countries.includes(countryName)) {
        const categoryNames = {
          oil_rich: 'Rico em Petróleo',
          coal_rich: 'Rico em Carvão',
          mineral_rich: 'Rico em Minerais',
          agricultural: 'Agrícola',
          industrialized: 'Industrializado'
        };
        bonuses.push(categoryNames[category] || category);
      }
    });

    return bonuses;
  }

  /**
   * Obtém modificadores climáticos para produção
   */
  static getClimateProductionModifiers(countryName) {
    const climateZone = this.getClimateZone(countryName);
    return PRODUCTION_FACTORS.CLIMATE_PRODUCTION_MODIFIERS[climateZone] ||
           PRODUCTION_FACTORS.CLIMATE_PRODUCTION_MODIFIERS.temperate;
  }

  /**
   * Determina zona climática do país
   */
  static getClimateZone(countryName) {
    for (const [zone, countries] of Object.entries(CLIMATE_ZONES)) {
      if (countries.includes(countryName)) {
        return zone;
      }
    }
    return 'temperate'; // padrão
  }

  /**
   * Produção padrão em caso de erro
   */
  static getDefaultProduction() {
    return {
      Graos: 100,
      Combustivel: 50,
      Metais: 30,
      Carvao: 40,
      Energia: 80,
      _metadata: {
        calculatedAt: new Date().toISOString(),
        error: 'Valores padrão aplicados devido a erro no cálculo'
      }
    };
  }

  /**
   * Calcula balanço de recursos (produção - consumo)
   */
  static calculateResourceBalance(country) {
    const production = this.calculateCountryProduction(country);

    const balance = {
      Graos: production.Graos - (parseFloat(country.ConsumoGraos) || 0),
      Combustivel: production.Combustivel - (parseFloat(country.ConsumoCombustivel) || 0),
      Metais: production.Metais - (parseFloat(country.ConsumoMetais) || 0),
      Carvao: production.Carvao - (parseFloat(country.ConsumoCarvao) || 0),
      Energia: production.Energia - (parseFloat(country.ConsumoEnergia) || 0)
    };

    return balance;
  }

  /**
   * Gera relatório detalhado de produção
   */
  static generateProductionReport(country) {
    const production = this.calculateCountryProduction(country);
    const balance = this.calculateResourceBalance(country);
    const countryName = country.Pais || country.Nome || 'Desconhecido';

    // Identificar recursos em superávit e déficit
    const surplus = [];
    const deficit = [];

    Object.entries(balance).forEach(([resource, value]) => {
      if (value > 100) surplus.push(resource);
      if (value < -50) deficit.push(resource);
    });

    return {
      country: countryName,
      production,
      balance,
      summary: {
        totalProduction: production.Graos + production.Combustivel + production.Metais + production.Carvao,
        surplusResources: surplus,
        deficitResources: deficit,
        energyBalance: balance.Energia > 0 ? 'Superávit' : 'Déficit'
      },
      analysis: {
        economicLevel: production._metadata.developmentLevel,
        geographicBonuses: production._metadata.geographicBonuses,
        climateZone: production._metadata.climateZone
      }
    };
  }
}

export default ResourceProductionCalculator;