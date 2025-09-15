/**
 * Sistema de Cálculo de Consumo de Recursos - War 1954
 * Calcula o consumo de recursos baseado nas características dos países
 */

import { Logger } from '../utils.js';

/**
 * Fatores de consumo baseados na realidade de 1954
 */
const CONSUMPTION_FACTORS = {
  // Consumo per capita base (por milhão de habitantes)
  BASE_CONSUMPTION_PER_MILLION: {
    Graos: 150,        // 150 unidades por milhão de pessoas (alimentação básica)
    Combustivel: 50,   // 50 unidades por milhão (transporte, aquecimento)
    Metais: 30,        // 30 unidades por milhão (infraestrutura, indústria)
    Carvao: 40,        // 40 unidades por milhão (energia, aquecimento)
    Energia: 100       // 100 MW por milhão (energia elétrica básica)
  },

  // Multiplicadores por nível de desenvolvimento
  DEVELOPMENT_MULTIPLIERS: {
    // PIB per capita (USD 1954) - multiplicadores de consumo
    ultraDeveloped: { threshold: 2000, multiplier: 2.5 }, // EUA, Suíça
    highlyDeveloped: { threshold: 1200, multiplier: 2.0 }, // Reino Unido, França
    developed: { threshold: 800, multiplier: 1.5 },       // Alemanha Ocidental
    moderate: { threshold: 500, multiplier: 1.2 },        // URSS, Japão
    developing: { threshold: 200, multiplier: 1.0 },      // Brasil, México
    underdeveloped: { threshold: 0, multiplier: 0.7 }     // Países pobres
  },

  // Modificadores por urbanização (% urbana)
  URBANIZATION_MODIFIERS: {
    Combustivel: 0.02,  // +2% consumo combustível por % urbanização
    Energia: 0.015,     // +1.5% consumo energia por % urbanização
    Graos: -0.005,      // -0.5% consumo grãos por % urbanização (eficiência)
    Metais: 0.01        // +1% consumo metais por % urbanização
  },

  // Modificadores por industrialização (aumento de consumo por produção)
  INDUSTRIAL_MODIFIERS: {
    // Baseado no nível de tecnologia industrial
    Combustivel: 0.03,  // +3% por ponto de tecnologia
    Metais: 0.04,       // +4% por ponto de tecnologia
    Carvao: 0.025,      // +2.5% por ponto de tecnologia
    Energia: 0.02       // +2% por ponto de tecnologia
  },

  // Modificadores de eficiência tecnológica (redução de consumo por eficiência)
  TECHNOLOGY_EFFICIENCY: {
    // Eficiência por nível tecnológico (0-100 pontos)
    // Mais tecnologia = mais eficiência = menos consumo per capita
    Combustivel: 0.008, // -0.8% consumo por ponto de tecnologia (motores eficientes)
    Metais: 0.006,      // -0.6% consumo por ponto (ligas melhores, reciclagem)
    Carvao: 0.01,       // -1% consumo por ponto (fornos eficientes)
    Energia: 0.007,     // -0.7% consumo por ponto (equipamentos eficientes)
    Graos: 0.004        // -0.4% consumo por ponto (agricultura eficiente, conservação)
  },

  // Modificadores climáticos (estimados por região)
  CLIMATE_MODIFIERS: {
    // Países frios consomem mais combustível para aquecimento
    cold: { Combustivel: 1.4, Carvao: 1.6 },      // URSS, Canadá, países nórdicos
    temperate: { Combustivel: 1.0, Carvao: 1.0 }, // Europa, EUA
    warm: { Combustivel: 0.8, Carvao: 0.6 },      // Brasil, México
    hot: { Combustivel: 0.6, Carvao: 0.4 }        // Oriente Médio, África
  },

  // Modificadores por situação militar
  MILITARY_MODIFIERS: {
    // Guerra ativa
    atWar: {
      Combustivel: 2.0,   // Dobra consumo combustível
      Metais: 1.8,        // +80% consumo metais
      Graos: 1.3          // +30% consumo alimentar
    },
    // Mobilização militar
    mobilized: {
      Combustivel: 1.4,
      Metais: 1.3,
      Graos: 1.2
    },
    // Paz
    peace: {
      Combustivel: 1.0,
      Metais: 1.0,
      Graos: 1.0
    }
  }
};

/**
 * Mapeamento de países para zonas climáticas
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

class ResourceConsumptionCalculator {

  /**
   * Calcula o consumo total de recursos para um país
   */
  static calculateCountryConsumption(country) {
    try {
      const population = parseFloat(country.Populacao) || 1;
      const pibPerCapita = parseFloat(country.PIBPerCapita) || 500;
      const urbanization = parseFloat(country.Urbanizacao) || 30;
      const technology = parseFloat(country.Tecnologia) || 20;
      const countryName = country.Pais || country.Nome || 'Desconhecido';

      // 1. Consumo base per capita
      const baseConsumption = this.calculateBaseConsumption(population);

      // 2. Multiplicador por desenvolvimento
      const devMultiplier = this.getDevelopmentMultiplier(pibPerCapita);

      // 3. Modificadores por urbanização
      const urbanModifiers = this.calculateUrbanizationModifiers(urbanization);

      // 4. Modificadores industriais
      const industrialModifiers = this.calculateIndustrialModifiers(technology);

      // 5. Modificadores de eficiência tecnológica
      const efficiencyModifiers = this.calculateTechnologyEfficiency(technology);

      // 6. Modificadores climáticos
      const climateModifiers = this.getClimateModifiers(countryName);

      // 7. Modificadores militares (assumir paz por padrão)
      const militaryModifiers = CONSUMPTION_FACTORS.MILITARY_MODIFIERS.peace;

      // Calcular consumo final para cada recurso
      const consumption = {};
      const resources = ['Graos', 'Combustivel', 'Metais', 'Carvao', 'Energia'];

      resources.forEach(resource => {
        let resourceConsumption = baseConsumption[resource] * devMultiplier;

        // Aplicar modificadores específicos
        if (urbanModifiers[resource]) {
          resourceConsumption *= urbanModifiers[resource];
        }

        if (industrialModifiers[resource]) {
          resourceConsumption *= industrialModifiers[resource];
        }

        if (efficiencyModifiers[resource]) {
          resourceConsumption *= efficiencyModifiers[resource];
        }

        if (climateModifiers[resource]) {
          resourceConsumption *= climateModifiers[resource];
        }

        if (militaryModifiers[resource]) {
          resourceConsumption *= militaryModifiers[resource];
        }

        // Arredondar para inteiro
        consumption[resource] = Math.round(resourceConsumption);
      });

      // Adicionar metadados do cálculo
      consumption._metadata = {
        population,
        pibPerCapita,
        developmentLevel: this.getDevelopmentLevel(pibPerCapita),
        climateZone: this.getClimateZone(countryName),
        devMultiplier,
        calculatedAt: new Date().toISOString()
      };

      return consumption;

    } catch (error) {
      Logger.error(`Erro ao calcular consumo para ${country.Pais}:`, error);
      return this.getDefaultConsumption();
    }
  }

  /**
   * Calcula consumo base por população
   */
  static calculateBaseConsumption(population) {
    const millionPeople = population / 1000000;
    const base = CONSUMPTION_FACTORS.BASE_CONSUMPTION_PER_MILLION;

    return {
      Graos: Math.round(base.Graos * millionPeople),
      Combustivel: Math.round(base.Combustivel * millionPeople),
      Metais: Math.round(base.Metais * millionPeople),
      Carvao: Math.round(base.Carvao * millionPeople),
      Energia: Math.round(base.Energia * millionPeople)
    };
  }

  /**
   * Obtém multiplicador por nível de desenvolvimento
   */
  static getDevelopmentMultiplier(pibPerCapita) {
    const levels = CONSUMPTION_FACTORS.DEVELOPMENT_MULTIPLIERS;

    if (pibPerCapita >= levels.ultraDeveloped.threshold) return levels.ultraDeveloped.multiplier;
    if (pibPerCapita >= levels.highlyDeveloped.threshold) return levels.highlyDeveloped.multiplier;
    if (pibPerCapita >= levels.developed.threshold) return levels.developed.multiplier;
    if (pibPerCapita >= levels.moderate.threshold) return levels.moderate.multiplier;
    if (pibPerCapita >= levels.developing.threshold) return levels.developing.multiplier;
    return levels.underdeveloped.multiplier;
  }

  /**
   * Calcula modificadores por urbanização
   */
  static calculateUrbanizationModifiers(urbanization) {
    const modifiers = CONSUMPTION_FACTORS.URBANIZATION_MODIFIERS;
    const urbanFactor = urbanization / 100;

    return {
      Combustivel: 1 + (modifiers.Combustivel * urbanization),
      Energia: 1 + (modifiers.Energia * urbanization),
      Graos: 1 + (modifiers.Graos * urbanization),
      Metais: 1 + (modifiers.Metais * urbanization)
    };
  }

  /**
   * Calcula modificadores industriais
   */
  static calculateIndustrialModifiers(technology) {
    const modifiers = CONSUMPTION_FACTORS.INDUSTRIAL_MODIFIERS;
    const techFactor = technology / 100;

    return {
      Combustivel: 1 + (modifiers.Combustivel * technology),
      Metais: 1 + (modifiers.Metais * technology),
      Carvao: 1 + (modifiers.Carvao * technology),
      Energia: 1 + (modifiers.Energia * technology)
    };
  }

  /**
   * Calcula modificadores de eficiência tecnológica
   * Mais tecnologia = mais eficiência = MENOS consumo per capita
   */
  static calculateTechnologyEfficiency(technology) {
    const modifiers = CONSUMPTION_FACTORS.TECHNOLOGY_EFFICIENCY;

    // Calcular redução de consumo por eficiência tecnológica
    return {
      Graos: 1 - (modifiers.Graos * technology),       // -0.4% por ponto
      Combustivel: 1 - (modifiers.Combustivel * technology), // -0.8% por ponto
      Metais: 1 - (modifiers.Metais * technology),     // -0.6% por ponto
      Carvao: 1 - (modifiers.Carvao * technology),     // -1% por ponto
      Energia: 1 - (modifiers.Energia * technology)    // -0.7% por ponto
    };
  }

  /**
   * Obtém modificadores climáticos
   */
  static getClimateModifiers(countryName) {
    const climateZone = this.getClimateZone(countryName);
    return CONSUMPTION_FACTORS.CLIMATE_MODIFIERS[climateZone] || CONSUMPTION_FACTORS.CLIMATE_MODIFIERS.temperate;
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
    return 'temperate'; // Padrão
  }

  /**
   * Determina nível de desenvolvimento
   */
  static getDevelopmentLevel(pibPerCapita) {
    const levels = CONSUMPTION_FACTORS.DEVELOPMENT_MULTIPLIERS;

    if (pibPerCapita >= levels.ultraDeveloped.threshold) return 'Ultradesenvolvido';
    if (pibPerCapita >= levels.highlyDeveloped.threshold) return 'Altamente desenvolvido';
    if (pibPerCapita >= levels.developed.threshold) return 'Desenvolvido';
    if (pibPerCapita >= levels.moderate.threshold) return 'Moderadamente desenvolvido';
    if (pibPerCapita >= levels.developing.threshold) return 'Em desenvolvimento';
    return 'Subdesenvolvido';
  }

  /**
   * Consumo padrão para países com dados insuficientes
   */
  static getDefaultConsumption() {
    return {
      Graos: 100,
      Combustivel: 50,
      Metais: 30,
      Carvao: 40,
      Energia: 80,
      _metadata: {
        note: 'Valores padrão aplicados devido a dados insuficientes'
      }
    };
  }

  /**
   * Calcula balanço de recursos (produção vs consumo)
   */
  static calculateResourceBalance(country) {
    const consumption = this.calculateCountryConsumption(country);

    // Stocks atuais
    const stocks = {
      Graos: parseFloat(country.Graos) || 0,
      Combustivel: parseFloat(country.Combustivel) || 0,
      Metais: parseFloat(country.Metais) || 0,
      Carvao: parseFloat(country.CarvaoSaldo) || 0,
      Energia: parseFloat(country.EnergiaCapacidade) || 0
    };

    // Calcular balanço
    const balance = {};
    Object.keys(stocks).forEach(resource => {
      const currentStock = stocks[resource];
      const monthlyConsumption = consumption[resource];

      balance[resource] = {
        stock: currentStock,
        consumption: monthlyConsumption,
        balance: currentStock - monthlyConsumption,
        monthsRemaining: monthlyConsumption > 0 ? Math.floor(currentStock / monthlyConsumption) : 999
      };
    });

    return balance;
  }

  /**
   * Gera relatório de consumo para debugging
   */
  static generateConsumptionReport(country) {
    const consumption = this.calculateCountryConsumption(country);
    const balance = this.calculateResourceBalance(country);

    return {
      country: country.Pais || 'Desconhecido',
      consumption,
      balance,
      summary: {
        totalResources: Object.values(consumption).slice(0, 5).reduce((a, b) => a + b, 0),
        criticalResources: Object.entries(balance).filter(([_, data]) => data.monthsRemaining < 3).map(([resource, _]) => resource),
        surplusResources: Object.entries(balance).filter(([_, data]) => data.balance > 100).map(([resource, _]) => resource)
      }
    };
  }
}

export default ResourceConsumptionCalculator;