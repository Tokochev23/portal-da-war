/**
 * Sistema de Dependência Econômica - War 1954
 * Gerencia relações econômicas entre países e análise de dependência
 */

import { db } from '../services/firebase.js';
import { Logger } from '../utils.js';

// Configurações do sistema de dependência
const DEPENDENCY_CONFIG = {
  // Thresholds para dependência
  dependency: {
    light: 0.30,      // 30% dos investimentos de um país
    moderate: 0.50,   // 50% dos investimentos
    heavy: 0.70,      // 70% dos investimentos
    critical: 0.85    // 85% dos investimentos
  },
  
  // Número de turnos para análise
  historyTurns: 5,
  
  // Efeitos da dependência
  effects: {
    growth_bonus: {
      light: 0.05,      // +5% crescimento adicional
      moderate: 0.10,   // +10% crescimento adicional
      heavy: 0.15,      // +15% crescimento adicional
      critical: 0.20    // +20% crescimento adicional
    },
    
    crisis_impact: {
      light: 0.10,      // -10% PIB se investidor entra em crise
      moderate: 0.20,   // -20% PIB se investidor entra em crise
      heavy: 0.35,      // -35% PIB se investidor entra em crise
      critical: 0.50    // -50% PIB se investidor entra em crise
    }
  }
};

class EconomicDependencySystem {
  constructor() {
    this.dependencyCache = new Map();
    this.lastCacheUpdate = 0;
    this.cacheTimeout = 300000; // 5 minutos
  }

  // Analisar dependência econômica entre países
  async analyzeDependency(dependentCountryId, investorCountryId, forceRefresh = false) {
    try {
      const cacheKey = `${dependentCountryId}-${investorCountryId}`;
      const now = Date.now();
      
      // Verificar cache
      if (!forceRefresh && this.dependencyCache.has(cacheKey)) {
        const cached = this.dependencyCache.get(cacheKey);
        if (now - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      // Buscar histórico econômico
      const history = await this.getEconomicHistory(dependentCountryId);
      
      // Calcular dependência
      const dependencyData = this.calculateDependency(history, investorCountryId);
      
      // Cache do resultado
      this.dependencyCache.set(cacheKey, {
        data: dependencyData,
        timestamp: now
      });

      return dependencyData;

    } catch (error) {
      Logger.error('Erro ao analisar dependência econômica:', error);
      throw error;
    }
  }

  // Obter histórico econômico de um país
  async getEconomicHistory(countryId) {
    try {
      const snapshot = await db.collection('economic_history')
        .where('countryId', '==', countryId)
        .orderBy('turn', 'desc')
        .limit(DEPENDENCY_CONFIG.historyTurns)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      Logger.error('Erro ao buscar histórico econômico:', error);
      return [];
    }
  }

  // Calcular nível de dependência
  calculateDependency(history, investorId) {
    if (!history || history.length < 2) {
      return {
        level: 'none',
        percentage: 0,
        totalExternal: 0,
        fromInvestor: 0,
        turnsAnalyzed: history.length,
        riskLevel: 'low'
      };
    }

    let totalExternal = 0;
    let fromInvestor = 0;
    let turnsWithInvestment = 0;

    // Analisar histórico
    history.forEach(turn => {
      if (turn.externalInvestments) {
        let turnExternal = 0;
        
        Object.entries(turn.externalInvestments).forEach(([investor, amount]) => {
          const investmentAmount = parseFloat(amount) || 0;
          turnExternal += investmentAmount;
          totalExternal += investmentAmount;
          
          if (investor === investorId) {
            fromInvestor += investmentAmount;
            turnsWithInvestment++;
          }
        });
      }
    });

    const dependencyPercentage = totalExternal > 0 ? fromInvestor / totalExternal : 0;
    const consistencyFactor = turnsWithInvestment / history.length;
    
    // Ajustar dependência pela consistência
    const adjustedDependency = dependencyPercentage * (0.5 + 0.5 * consistencyFactor);

    // Determinar nível de dependência
    let level = 'none';
    let riskLevel = 'low';

    if (adjustedDependency >= DEPENDENCY_CONFIG.dependency.critical) {
      level = 'critical';
      riskLevel = 'critical';
    } else if (adjustedDependency >= DEPENDENCY_CONFIG.dependency.heavy) {
      level = 'heavy';
      riskLevel = 'high';
    } else if (adjustedDependency >= DEPENDENCY_CONFIG.dependency.moderate) {
      level = 'moderate';
      riskLevel = 'medium';
    } else if (adjustedDependency >= DEPENDENCY_CONFIG.dependency.light) {
      level = 'light';
      riskLevel = 'low';
    }

    return {
      level,
      percentage: adjustedDependency,
      rawPercentage: dependencyPercentage,
      totalExternal,
      fromInvestor,
      turnsAnalyzed: history.length,
      turnsWithInvestment,
      consistencyFactor,
      riskLevel,
      growthBonus: DEPENDENCY_CONFIG.effects.growth_bonus[level] || 0,
      crisisImpact: DEPENDENCY_CONFIG.effects.crisis_impact[level] || 0
    };
  }

  // Analisar todas as dependências de um país
  async analyzeAllDependencies(countryId) {
    try {
      const history = await this.getEconomicHistory(countryId);
      const dependencies = new Map();

      // Identificar todos os investidores
      const investors = new Set();
      history.forEach(turn => {
        if (turn.externalInvestments) {
          Object.keys(turn.externalInvestments).forEach(investor => {
            investors.add(investor);
          });
        }
      });

      // Calcular dependência para cada investidor
      for (const investor of investors) {
        const dependency = this.calculateDependency(history, investor);
        if (dependency.level !== 'none') {
          dependencies.set(investor, dependency);
        }
      }

      // Ordenar por nível de dependência
      const sortedDependencies = Array.from(dependencies.entries())
        .sort((a, b) => b[1].percentage - a[1].percentage);

      return {
        countryId,
        dependencies: sortedDependencies,
        totalDependencies: dependencies.size,
        highestDependency: sortedDependencies[0] || null,
        riskLevel: this.calculateOverallRisk(sortedDependencies)
      };

    } catch (error) {
      Logger.error('Erro ao analisar todas as dependências:', error);
      throw error;
    }
  }

  // Calcular risco geral de dependência
  calculateOverallRisk(dependencies) {
    if (dependencies.length === 0) return 'none';

    const criticalCount = dependencies.filter(([, dep]) => dep.level === 'critical').length;
    const heavyCount = dependencies.filter(([, dep]) => dep.level === 'heavy').length;
    const moderateCount = dependencies.filter(([, dep]) => dep.level === 'moderate').length;

    if (criticalCount > 0) return 'critical';
    if (heavyCount > 1 || (heavyCount === 1 && moderateCount > 0)) return 'high';
    if (heavyCount === 1 || moderateCount > 1) return 'medium';
    return 'low';
  }

  // Verificar se país está em crise econômica
  async checkEconomicCrisis(countryId) {
    try {
      // Buscar dados atuais do país
      const countryDoc = await db.collection('paises').doc(countryId).get();
      if (!countryDoc.exists) return false;

      const country = countryDoc.data();
      const currentPIB = parseFloat(country.PIB) || 0;
      const stability = parseFloat(country.Estabilidade) || 0;

      // Buscar histórico para comparar
      const history = await this.getEconomicHistory(countryId);
      if (history.length < 2) return false;

      const previousPIB = parseFloat(history[1].results?.newPIB || country.PIB);
      const pibChange = (currentPIB - previousPIB) / previousPIB;

      // Critérios de crise
      const isCrisis = (
        pibChange < -0.15 ||  // PIB caiu mais de 15%
        stability < 25 ||     // Estabilidade muito baixa
        (pibChange < -0.05 && stability < 40) // PIB caiu 5%+ e estabilidade baixa
      );

      return {
        isCrisis,
        pibChange,
        stability,
        severity: this.calculateCrisisSeverity(pibChange, stability)
      };

    } catch (error) {
      Logger.error('Erro ao verificar crise econômica:', error);
      return false;
    }
  }

  // Calcular severidade da crise
  calculateCrisisSeverity(pibChange, stability) {
    let severity = 0;

    // Impacto do PIB
    if (pibChange < -0.30) severity += 3;
    else if (pibChange < -0.20) severity += 2;
    else if (pibChange < -0.10) severity += 1;

    // Impacto da estabilidade
    if (stability < 20) severity += 3;
    else if (stability < 35) severity += 2;
    else if (stability < 50) severity += 1;

    // Classificação
    if (severity >= 5) return 'severe';
    if (severity >= 3) return 'moderate';
    if (severity >= 1) return 'mild';
    return 'none';
  }

  // Aplicar efeitos de dependência durante crise
  async applyDependencyCrisisEffects(investorCountryId) {
    try {
      // Verificar se país investidor está em crise
      const crisis = await this.checkEconomicCrisis(investorCountryId);
      if (!crisis.isCrisis) return [];

      // Buscar todos os países dependentes
      const affectedCountries = [];
      const allCountries = await db.collection('paises').get();

      for (const doc of allCountries.docs) {
        const countryId = doc.id;
        if (countryId === investorCountryId) continue;

        const dependency = await this.analyzeDependency(countryId, investorCountryId);
        if (dependency.level !== 'none') {
          // Aplicar impacto da crise
          const country = doc.data();
          const currentPIB = parseFloat(country.PIB) || 0;
          const impact = dependency.crisisImpact * crisis.severity === 'severe' ? 1.5 : 1.0;
          const pibLoss = currentPIB * impact;
          const newPIB = currentPIB - pibLoss;

          // Atualizar país
          await db.collection('paises').doc(countryId).update({
            PIB: newPIB,
            TurnoUltimaAtualizacao: parseInt(document.getElementById('turno-atual-admin')?.textContent?.replace('#', '')) || 1
          });

          affectedCountries.push({
            countryId,
            countryName: country.Pais,
            dependencyLevel: dependency.level,
            pibLoss,
            newPIB,
            impact: impact * 100
          });
        }
      }

      return affectedCountries;

    } catch (error) {
      Logger.error('Erro ao aplicar efeitos de crise de dependência:', error);
      throw error;
    }
  }

  // Gerar relatório de dependência
  generateDependencyReport(analysisData) {
    const { countryId, dependencies, riskLevel } = analysisData;

    let report = {
      summary: this.generateSummaryText(dependencies, riskLevel),
      recommendations: this.generateRecommendations(dependencies, riskLevel),
      riskMatrix: dependencies.map(([investorId, dep]) => ({
        investor: investorId,
        level: dep.level,
        percentage: dep.percentage,
        risk: dep.riskLevel,
        growthBonus: dep.growthBonus,
        crisisImpact: dep.crisisImpact
      }))
    };

    return report;
  }

  // Gerar texto de resumo
  generateSummaryText(dependencies, riskLevel) {
    if (dependencies.length === 0) {
      return "País mantém independência econômica total. Sem dependências externas significativas.";
    }

    const totalDeps = dependencies.length;
    const criticalDeps = dependencies.filter(([, dep]) => dep.level === 'critical').length;
    const heavyDeps = dependencies.filter(([, dep]) => dep.level === 'heavy').length;

    let summary = `País possui ${totalDeps} dependência${totalDeps > 1 ? 's' : ''} econômica${totalDeps > 1 ? 's' : ''}.`;

    if (criticalDeps > 0) {
      summary += ` ${criticalDeps} crítica${criticalDeps > 1 ? 's' : ''}.`;
    }
    if (heavyDeps > 0) {
      summary += ` ${heavyDeps} pesada${heavyDeps > 1 ? 's' : ''}.`;
    }

    summary += ` Risco geral: ${riskLevel}.`;

    return summary;
  }

  // Gerar recomendações
  generateRecommendations(dependencies, riskLevel) {
    const recommendations = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push("Diversificar fontes de investimento externo urgentemente.");
      recommendations.push("Aumentar investimentos internos para reduzir dependência.");
    }

    if (dependencies.length > 3) {
      recommendations.push("Consolidar parcerias econômicas para reduzir complexidade.");
    }

    const criticalDeps = dependencies.filter(([, dep]) => dep.level === 'critical');
    if (criticalDeps.length > 0) {
      recommendations.push(`Negociar maior autonomia com ${criticalDeps[0][0]} devido à dependência crítica.`);
    }

    if (recommendations.length === 0) {
      recommendations.push("Manter diversificação atual de investimentos externos.");
    }

    return recommendations;
  }

  // Limpar cache
  clearCache() {
    this.dependencyCache.clear();
    this.lastCacheUpdate = 0;
  }
}

// Instância global
const economicDependency = new EconomicDependencySystem();

export default economicDependency;