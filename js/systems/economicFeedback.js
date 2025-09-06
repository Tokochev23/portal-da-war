/**
 * Sistema de Feedback Narrativo Econômico - War 1954
 * Gera feedback narrativo automatizado para players baseado em ações econômicas
 */

import { db } from '../services/firebase.js';
import { Logger } from '../utils.js';
import economicDependency from './economicDependency.js';

// Templates de feedback narrativo
const FEEDBACK_TEMPLATES = {
  growth: {
    excellent: [
      "✨ **Crescimento Excepcional!** A economia nacional floresceu sob suas políticas visionárias.",
      "🚀 **Boom Econômico!** Seus investimentos estratégicos criaram um círculo virtuoso de prosperidade.",
      "⭐ **Era Dourada!** O país vivencia seu melhor período econômico em décadas."
    ],
    
    good: [
      "✅ **Crescimento Sólido** A diversificação econômica está dando frutos positivos.",
      "📈 **Progresso Sustentável** Suas reformas econômicas mostram resultados consistentes.",
      "💪 **Economia Resiliente** O país demonstra capacidade de crescimento estável."
    ],
    
    moderate: [
      "📊 **Crescimento Moderado** A economia mantém trajetória de expansão cautelosa.",
      "⚖️ **Desenvolvimento Equilibrado** O país avança de forma sustentada, sem riscos.",
      "🎯 **Metas Atingidas** Os objetivos econômicos estão sendo cumpridos gradualmente."
    ],
    
    poor: [
      "⚠️ **Crescimento Limitado** A economia enfrenta desafios que impedem maior expansão.",
      "🔄 **Ajustes Necessários** É preciso revisar as estratégias de investimento atuais.",
      "📉 **Potencial Não Realizado** O país possui capacidade para crescimento maior."
    ],
    
    negative: [
      "🚨 **Recessão Econômica** A economia nacional enfrenta sérias dificuldades.",
      "⛈️ **Crise Econômica** Políticas de emergência são necessárias para estabilização.",
      "🆘 **Situação Crítica** Reformas estruturais urgentes são essenciais para recuperação."
    ]
  },

  inflation: {
    low: [
      "💡 **Gestão Eficiente** Seus investimentos foram bem planejados, com baixa inflação.",
      "🎯 **Precisão Econômica** A estratégia de diversificação evitou pressões inflacionárias.",
      "⚡ **Investimento Inteligente** A alocação equilibrada de recursos maximizou a eficiência."
    ],
    
    moderate: [
      "⚠️ **Inflação Controlável** Há sinais de aquecimento econômico que requerem atenção.",
      "🌡️ **Economia Aquecida** O volume de investimentos está criando pressões de preços.",
      "⚖️ **Equilíbrio Delicado** É preciso balancear crescimento com estabilidade de preços."
    ],
    
    high: [
      "🔥 **Alta Inflação** O excesso de investimentos está criando desequilíbrios econômicos.",
      "⛔ **Superaquecimento** A economia precisa de políticas de resfriamento urgentes.",
      "📈 **Pressão de Preços** A concentração de gastos está gerando inflação preocupante."
    ],
    
    severe: [
      "🚨 **Hiperinflação Ameaça** Os investimentos excessivos criaram uma crise inflacionária.",
      "💥 **Colapso de Preços** A estratégia econômica resultou em instabilidade monetária severa.",
      "🌪️ **Descontrole Inflacionário** Medidas de emergência são necessárias imediatamente."
    ]
  },

  chains: [
    "🔗 **Sinergia Perfeita!** A combinação de infraestrutura e indústria potencializou o crescimento.",
    "⚙️ **Engrenagem Eficiente** Pesquisa & Desenvolvimento impulsionou a modernização industrial.",
    "🧬 **DNA de Inovação** A integração entre ciência e políticas sociais criou resultados excepcionais.",
    "🏗️ **Base Sólida** Investimentos em infraestrutura criaram fundações para expansão industrial.",
    "🔬 **Revolução Científica** P&D transformou o panorama tecnológico e social do país."
  ],

  dependency: {
    created: [
      "🤝 **Nova Parceria** Sua cooperação com {investor} fortaleceu os laços econômicos.",
      "🌍 **Integração Internacional** Os investimentos externos expandiram horizontes econômicos.",
      "💼 **Diplomacia Econômica** A parceria internacional traz benefícios mútuos."
    ],
    
    increased: [
      "📈 **Dependência Crescente** Sua economia está cada vez mais integrada com {investor}.",
      "⚠️ **Atenção Necessária** A dependência de {investor} requer monitoramento cuidadoso.",
      "🔄 **Diversificação Recomendada** Considere expandir parcerias para reduzir riscos."
    ],
    
    critical: [
      "🚨 **Dependência Crítica** Sua economia tornou-se vulnerável às crises de {investor}.",
      "⛔ **Risco Elevado** A dependência excessiva de {investor} compromete a autonomia nacional.",
      "🆘 **Alerta Máximo** É urgente diversificar fontes de investimento externo."
    ]
  },

  external_actions: [
    "🌐 **Influência Internacional** Seus investimentos em {target} fortalecem sua posição geopolítica.",
    "🤝 **Soft Power** A ajuda econômica a {target} amplia sua influência regional.",
    "💰 **Diplomacia do Dólar** Os investimentos externos são uma ferramenta de política externa eficaz.",
    "🌟 **Liderança Global** Sua capacidade de investir no exterior demonstra força econômica.",
    "⚖️ **Responsabilidade Internacional** Os investimentos externos equilibram desenvolvimento e cooperação."
  ],

  stability: [
    "🏥 **Bem-Estar Social** Investimentos em saúde e educação fortalecem a coesão nacional.",
    "👥 **Harmonia Social** Políticas sociais reduzem tensões e aumentam a estabilidade.",
    "🛡️ **Resiliência Nacional** A estabilidade política é a base para crescimento sustentado.",
    "🕊️ **Paz Social** Investimentos sociais criam um ambiente favorável ao desenvolvimento."
  ],

  rejection: [
    "😠 **Resistência Popular** A população de {target} vê seus investimentos como ingerência externa.",
    "🗳️ **Tensão Política** Os investimentos em {target} geraram protestos e instabilidade.",
    "🚫 **Rejeição Nacional** {target} demonstra resistência crescente à sua influência econômica.",
    "⚡ **Conflito Diplomático** Os investimentos externos criaram atritos internacionais."
  ]
};

class EconomicFeedbackSystem {
  
  // Gerar feedback completo para o player
  async generatePlayerFeedback(countryId, economicResults, actions) {
    try {
      const feedback = {
        countryId,
        turn: this.getCurrentTurn(),
        timestamp: new Date(),
        mainMessage: "",
        details: [],
        warnings: [],
        achievements: [],
        recommendations: []
      };

      // 1. Feedback de crescimento principal
      const growthFeedback = this.generateGrowthFeedback(economicResults);
      feedback.mainMessage = growthFeedback.message;
      if (growthFeedback.achievement) {
        feedback.achievements.push(growthFeedback.achievement);
      }

      // 2. Feedback de inflação
      const inflationFeedback = this.generateInflationFeedback(economicResults);
      if (inflationFeedback) {
        feedback.details.push(inflationFeedback);
      }

      // 3. Feedback de cadeias produtivas
      if (economicResults.productiveChains.length > 0) {
        const chainFeedback = this.generateChainFeedback(economicResults.productiveChains);
        feedback.details.push(chainFeedback);
      }

      // 4. Feedback de ações externas
      const externalActions = actions.filter(a => a.isExternal);
      if (externalActions.length > 0) {
        const externalFeedback = await this.generateExternalFeedback(externalActions, countryId);
        feedback.details.push(...externalFeedback);
      }

      // 5. Análise de dependência
      const dependencyFeedback = await this.generateDependencyFeedback(countryId);
      if (dependencyFeedback) {
        feedback.warnings.push(...dependencyFeedback);
      }

      // 6. Recomendações estratégicas
      const recommendations = this.generateStrategicRecommendations(economicResults, actions);
      feedback.recommendations.push(...recommendations);

      // Salvar feedback no Firebase
      await this.saveFeedback(feedback);

      return feedback;

    } catch (error) {
      Logger.error('Erro ao gerar feedback do player:', error);
      throw error;
    }
  }

  // Gerar feedback de crescimento
  generateGrowthFeedback(results) {
    const growthPercent = (results.finalGrowth / results.newPIB) * 100;
    
    let category, achievement = null;
    
    if (growthPercent >= 15) {
      category = 'excellent';
      achievement = '🏆 **Milagre Econômico** - Crescimento excepcional de mais de 15%';
    } else if (growthPercent >= 8) {
      category = 'good';
      achievement = '🥇 **Crescimento Exemplar** - Expansão econômica robusta';
    } else if (growthPercent >= 3) {
      category = 'moderate';
    } else if (growthPercent >= 0) {
      category = 'poor';
    } else {
      category = 'negative';
    }

    const templates = FEEDBACK_TEMPLATES.growth[category];
    const message = this.randomChoice(templates);

    return { message, achievement };
  }

  // Gerar feedback de inflação
  generateInflationFeedback(results) {
    const inflationPercent = results.totalInflation * 100;
    
    let category;
    if (inflationPercent >= 60) {
      category = 'severe';
    } else if (inflationPercent >= 35) {
      category = 'high';
    } else if (inflationPercent >= 15) {
      category = 'moderate';
    } else {
      category = 'low';
    }

    if (category === 'low') return null; // Não mostrar feedback para inflação baixa

    const templates = FEEDBACK_TEMPLATES.inflation[category];
    return this.randomChoice(templates);
  }

  // Gerar feedback de cadeias produtivas
  generateChainFeedback(chains) {
    const chainNames = chains.map(c => c.name).join(', ');
    let message = this.randomChoice(FEEDBACK_TEMPLATES.chains);
    
    // Personalizar mensagem baseada nas cadeias
    if (chains.some(c => c.name.includes('Infraestrutura'))) {
      message = "🔗 **Sinergia Infraestrutural** A base sólida potencializou outros setores da economia.";
    } else if (chains.some(c => c.name.includes('P&D'))) {
      message = "🧬 **Inovação Integrada** Pesquisa & Desenvolvimento revolucionou múltiplos setores.";
    }

    return message;
  }

  // Gerar feedback de ações externas
  async generateExternalFeedback(externalActions, originCountryId) {
    const feedback = [];

    for (const action of externalActions) {
      if (!action.targetCountry) continue;

      // Buscar país de destino
      const targetCountry = await this.getCountryData(action.targetCountry);
      if (!targetCountry) continue;

      // Verificar risco de rejeição
      const rejectionRisk = this.checkRejectionRisk(action, targetCountry);
      
      if (rejectionRisk.hasRisk) {
        const rejectionMsg = this.randomChoice(FEEDBACK_TEMPLATES.rejection)
          .replace('{target}', targetCountry.Pais || action.targetCountry);
        feedback.push(rejectionMsg);
      } else {
        const externalMsg = this.randomChoice(FEEDBACK_TEMPLATES.external_actions)
          .replace('{target}', targetCountry.Pais || action.targetCountry);
        feedback.push(externalMsg);
      }
    }

    return feedback;
  }

  // Gerar feedback de dependência
  async generateDependencyFeedback(countryId) {
    try {
      const analysis = await economicDependency.analyzeAllDependencies(countryId);
      const feedback = [];

      if (analysis.dependencies.length === 0) return null;

      // Analisar dependências críticas
      const criticalDeps = analysis.dependencies.filter(([, dep]) => dep.level === 'critical');
      const heavyDeps = analysis.dependencies.filter(([, dep]) => dep.level === 'heavy');

      for (const [investorId, dependency] of criticalDeps) {
        const investor = await this.getCountryData(investorId);
        const message = this.randomChoice(FEEDBACK_TEMPLATES.dependency.critical)
          .replace('{investor}', investor?.Pais || investorId);
        feedback.push(message);
      }

      for (const [investorId, dependency] of heavyDeps.slice(0, 2)) { // Máximo 2 avisos
        const investor = await this.getCountryData(investorId);
        const message = this.randomChoice(FEEDBACK_TEMPLATES.dependency.increased)
          .replace('{investor}', investor?.Pais || investorId);
        feedback.push(message);
      }

      return feedback;

    } catch (error) {
      Logger.error('Erro ao gerar feedback de dependência:', error);
      return null;
    }
  }

  // Gerar recomendações estratégicas
  generateStrategicRecommendations(results, actions) {
    const recommendations = [];
    const inflationPercent = results.totalInflation * 100;
    const hasExternalActions = actions.some(a => a.isExternal);
    const actionTypes = [...new Set(actions.map(a => a.type))];

    // Recomendações baseadas na inflação
    if (inflationPercent > 40) {
      recommendations.push("💡 **Sugestão:** Reduza o volume de investimentos no próximo turno para controlar a inflação.");
    } else if (inflationPercent < 5) {
      recommendations.push("💡 **Oportunidade:** Sua economia pode absorver mais investimentos sem riscos inflacionários.");
    }

    // Recomendações baseadas na diversificação
    if (actionTypes.length <= 2) {
      recommendations.push("🎯 **Estratégia:** Diversifique os tipos de investimento para ativar cadeias produtivas.");
    }

    // Recomendações sobre ações externas
    if (!hasExternalActions && results.finalGrowth > 0) {
      recommendations.push("🌍 **Diplomacia:** Considere investimentos externos para expandir sua influência internacional.");
    } else if (hasExternalActions && actions.filter(a => a.isExternal).length >= 3) {
      recommendations.push("🏠 **Foco Interno:** Balance investimentos externos com desenvolvimento interno.");
    }

    // Recomendações sobre cadeias produtivas
    if (results.productiveChains.length === 0) {
      recommendations.push("🔗 **Sinergia:** Combine diferentes tipos de investimento para ativar bônus de cadeias produtivas.");
    }

    return recommendations.slice(0, 3); // Máximo 3 recomendações
  }

  // Verificar risco de rejeição popular
  checkRejectionRisk(action, targetCountry) {
    const stability = parseFloat(targetCountry.Estabilidade) || 0;
    const targetPIB = parseFloat(targetCountry.PIB) || 1;
    const investmentValue = parseFloat(action.value) || 0;
    const impact = (investmentValue * 1000000) / targetPIB;

    // País instável + grande investimento = risco de rejeição
    return {
      hasRisk: stability < 40 && impact > 0.10,
      riskLevel: impact > 0.20 ? 'high' : 'medium'
    };
  }

  // Salvar feedback no Firebase
  async saveFeedback(feedback) {
    try {
      await db.collection('player_feedback').doc().set({
        ...feedback,
        createdAt: new Date()
      });

      Logger.info(`Feedback salvo para país ${feedback.countryId}`);
    } catch (error) {
      Logger.error('Erro ao salvar feedback:', error);
      throw error;
    }
  }

  // Buscar feedback do player
  async getPlayerFeedback(countryId, limit = 5) {
    try {
      const snapshot = await db.collection('player_feedback')
        .where('countryId', '==', countryId)
        .orderBy('turn', 'desc')
        .limit(limit)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      Logger.error('Erro ao buscar feedback do player:', error);
      return [];
    }
  }

  // Métodos auxiliares
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getCurrentTurn() {
    return parseInt(document.getElementById('turno-atual-admin')?.textContent?.replace('#', '')) || 1;
  }

  async getCountryData(countryId) {
    try {
      const doc = await db.collection('paises').doc(countryId).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      Logger.error('Erro ao buscar dados do país:', error);
      return null;
    }
  }

  // Formatar feedback para exibição no dashboard do player
  formatFeedbackForDisplay(feedback) {
    let html = `
      <div class="economic-feedback-panel bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="text-2xl">📊</div>
          <div>
            <h3 class="text-lg font-semibold text-slate-200">Panorama Econômico - Turno #${feedback.turn}</h3>
            <p class="text-sm text-slate-400">Análise do desempenho econômico nacional</p>
          </div>
        </div>

        <div class="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
          <div class="text-slate-200 leading-relaxed">${feedback.mainMessage}</div>
        </div>
    `;

    // Conquistas
    if (feedback.achievements.length > 0) {
      html += `
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-emerald-400 mb-2">🏆 Conquistas</h4>
          <div class="space-y-2">
            ${feedback.achievements.map(achievement => `
              <div class="text-emerald-300 text-sm">${achievement}</div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Detalhes
    if (feedback.details.length > 0) {
      html += `
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-blue-400 mb-2">📋 Detalhes</h4>
          <div class="space-y-2">
            ${feedback.details.map(detail => `
              <div class="text-slate-300 text-sm">• ${detail}</div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Avisos
    if (feedback.warnings.length > 0) {
      html += `
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-yellow-400 mb-2">⚠️ Atenção</h4>
          <div class="space-y-2">
            ${feedback.warnings.map(warning => `
              <div class="text-yellow-300 text-sm">• ${warning}</div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Recomendações
    if (feedback.recommendations.length > 0) {
      html += `
        <div>
          <h4 class="text-sm font-semibold text-purple-400 mb-2">💡 Recomendações</h4>
          <div class="space-y-2">
            ${feedback.recommendations.map(rec => `
              <div class="text-purple-300 text-sm">• ${rec}</div>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }
}

// Instância global
const economicFeedback = new EconomicFeedbackSystem();

export default economicFeedback;