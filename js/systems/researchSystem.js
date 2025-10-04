/**
 * Sistema de Pesquisa de Tecnologias com D12
 * Gerencia pesquisa de tecnologias de inteligência
 */

import { db } from '../services/firebase.js';
import { TECHNOLOGIES } from './agencyTechnologies.js';
import intelligenceAgencySystem from './intelligenceAgencySystem.js';

// Resultados possíveis do D12
const RESEARCH_RESULTS = {
  CRITICAL_FAILURE: {
    range: [1, 3],
    name: 'Falha Crítica',
    icon: '💥',
    costLoss: 0.5,
    waitTurns: 2,
    message: 'Projeto comprometido! Recursos perdidos e pesquisa suspensa.'
  },
  FAILURE: {
    range: [4, 6],
    name: 'Falha',
    icon: '❌',
    costLoss: 0.25,
    waitTurns: 1,
    message: 'Pesquisa falhou. Recursos parcialmente perdidos.'
  },
  PARTIAL_SUCCESS: {
    range: [7, 9],
    name: 'Sucesso Parcial',
    icon: '⚠️',
    progress: 50,
    waitTurns: 0,
    message: 'Progresso parcial (50%). Continue no próximo turno.'
  },
  TOTAL_SUCCESS: {
    range: [10, 12],
    name: 'Sucesso Total',
    icon: '✅',
    unlocked: true,
    waitTurns: 0,
    message: 'Sucesso! Tecnologia desbloqueada.'
  }
};

class ResearchSystem {
  constructor() {
    this.activeResearches = new Map();
  }

  /**
   * Calcula modificadores do D12 para pesquisa
   */
  calculateModifiers(agency, tech, country) {
    let mods = 0;

    // Tech Civil do país
    const techCivil = parseFloat(country.TecnologiaCivil) || parseFloat(country.Tecnologia) || 0;
    if (techCivil > 60) mods += 1;
    if (techCivil < 30) mods -= 2;

    // Tier da agência
    if (agency.tier === 'powerful' || agency.tier === 'elite') {
      mods += 1;
    }

    // Tecnologias relacionadas
    const relatedTechs = this.getRelatedTechnologies(tech.id, agency.technologies);
    if (relatedTechs >= 2) mods += 2;
    else if (relatedTechs >= 1) mods += 1;

    // Foco da agência alinhado com categoria
    const techCategory = tech.category;
    if (agency.focus === 'external_espionage' && (techCategory === 'humint' || techCategory === 'sigint')) {
      mods += 1;
    } else if (agency.focus === 'counterintelligence' && techCategory === 'counterintel') {
      mods += 1;
    } else if (agency.focus === 'covert_operations' && techCategory === 'covert_ops') {
      mods += 1;
    }

    return mods;
  }

  /**
   * Conta quantas tecnologias relacionadas já foram desbloqueadas
   */
  getRelatedTechnologies(techId, unlockedTechs) {
    const tech = TECHNOLOGIES[techId];
    if (!tech) return 0;

    let count = 0;

    // Verificar pré-requisitos
    tech.prerequisites.forEach(prereq => {
      if (unlockedTechs.includes(prereq)) count++;
    });

    // Verificar mesma categoria
    Object.values(TECHNOLOGIES).forEach(t => {
      if (t.category === tech.category && unlockedTechs.includes(t.id) && t.id !== techId) {
        count++;
      }
    });

    return count;
  }

  /**
   * Rola D12 para pesquisa
   */
  rollD12(modifiers = 0) {
    const baseRoll = Math.floor(Math.random() * 12) + 1; // 1-12
    const finalRoll = baseRoll + modifiers;

    return {
      baseRoll,
      modifiers,
      finalRoll: Math.max(1, finalRoll) // Mínimo 1
    };
  }

  /**
   * Determina resultado baseado no roll
   */
  determineResult(roll) {
    const finalRoll = roll.finalRoll;

    if (finalRoll <= 3) {
      return RESEARCH_RESULTS.CRITICAL_FAILURE;
    } else if (finalRoll <= 6) {
      return RESEARCH_RESULTS.FAILURE;
    } else if (finalRoll <= 9) {
      return RESEARCH_RESULTS.PARTIAL_SUCCESS;
    } else {
      return RESEARCH_RESULTS.TOTAL_SUCCESS;
    }
  }

  /**
   * Verifica pré-requisitos de uma tecnologia
   */
  checkPrerequisites(techId, unlockedTechs) {
    const tech = TECHNOLOGIES[techId];
    if (!tech) return { valid: false, missing: [] };

    const missing = tech.prerequisites.filter(prereq => !unlockedTechs.includes(prereq));

    return {
      valid: missing.length === 0,
      missing: missing.map(id => TECHNOLOGIES[id]?.name || id)
    };
  }

  /**
   * Verifica Tech Civil mínima
   */
  checkTechCivil(techId, country) {
    const tech = TECHNOLOGIES[techId];
    if (!tech) return false;

    const techCivil = parseFloat(country.TecnologiaCivil) || parseFloat(country.Tecnologia) || 0;
    return techCivil >= tech.minTechCivil;
  }

  /**
   * Inicia uma pesquisa
   */
  async startResearch(agencyId, techId, country, currentTurn) {
    try {
      // Buscar agência
      const agencySnap = await db.collection('agencies').doc(agencyId).get();

      if (!agencySnap.exists) {
        return {
          success: false,
          error: 'Agência não encontrada!'
        };
      }

      const agency = agencySnap.data();

      // Verificar se já está pesquisando algo
      if (agency.currentResearch && agency.currentResearch.techId) {
        return {
          success: false,
          error: 'Já existe uma pesquisa em andamento!'
        };
      }

      // Verificar se tecnologia existe
      const tech = TECHNOLOGIES[techId];
      if (!tech) {
        return {
          success: false,
          error: 'Tecnologia não encontrada!'
        };
      }

      // Verificar se já foi desbloqueada
      if (agency.technologies && agency.technologies.includes(techId)) {
        return {
          success: false,
          error: 'Esta tecnologia já foi desbloqueada!'
        };
      }

      // Verificar pré-requisitos
      const prereqCheck = this.checkPrerequisites(techId, agency.technologies || []);
      if (!prereqCheck.valid) {
        return {
          success: false,
          error: `Pré-requisitos não atendidos: ${prereqCheck.missing.join(', ')}`
        };
      }

      // Verificar Tech Civil
      if (!this.checkTechCivil(techId, country)) {
        return {
          success: false,
          error: `Tecnologia Civil insuficiente! Necessário: ${tech.minTechCivil}%`
        };
      }

      // Calcular custo
      const cost = intelligenceAgencySystem.calculateCostByPIB(tech.baseCost, country);

      // Verificar orçamento
      if (agency.budget < cost) {
        return {
          success: false,
          error: 'Orçamento da agência insuficiente!'
        };
      }

      // Iniciar pesquisa
      const research = {
        techId: techId,
        techName: tech.name,
        progress: 0,
        startedTurn: currentTurn,
        rollsAttempted: 0,
        cost: cost,
        totalSpent: 0
      };

      await db.collection('agencies').doc(agencyId).update({
        currentResearch: research
      });

      // Descontar custo da pesquisa do orçamento nacional do país
      const currentNationalBudget = parseFloat(country.OrcamentoGasto || 0);
      await db.collection('paises').doc(country.id).update({
        OrcamentoGasto: currentNationalBudget + cost
      });

      return {
        success: true,
        research: research,
        tech: tech,
        cost: cost,
        budgetSpent: cost
      };

    } catch (error) {
      console.error('Erro ao iniciar pesquisa:', error);
      return {
        success: false,
        error: 'Erro ao processar pesquisa: ' + error.message
      };
    }
  }

  /**
   * Executa tentativa de pesquisa (rola D12)
   */
  async attemptResearch(agencyId, country, currentTurn) {
    try {
      // Buscar agência
      const agencySnap = await db.collection('agencies').doc(agencyId).get();

      if (!agencySnap.exists) {
        return {
          success: false,
          error: 'Agência não encontrada!'
        };
      }

      const agency = agencySnap.data();

      // Verificar se tem pesquisa ativa
      if (!agency.currentResearch || !agency.currentResearch.techId) {
        return {
          success: false,
          error: 'Nenhuma pesquisa em andamento!'
        };
      }

      const research = agency.currentResearch;
      const tech = TECHNOLOGIES[research.techId];

      // Calcular modificadores
      const modifiers = this.calculateModifiers(agency, tech, country);

      // Rolar D12
      const roll = this.rollD12(modifiers);

      // Determinar resultado
      const result = this.determineResult(roll);

      // Calcular custo desta tentativa
      const attemptCost = research.cost * (result.costLoss || 0);

      // Atualizar pesquisa baseado no resultado
      let updates = {
        'currentResearch.rollsAttempted': research.rollsAttempted + 1,
        'currentResearch.totalSpent': research.totalSpent + attemptCost
      };

      if (result.unlocked) {
        // SUCESSO TOTAL - Desbloquear tecnologia
        const newTechs = [...(agency.technologies || []), research.techId];
        updates = {
          technologies: newTechs,
          currentResearch: null // Limpar pesquisa
        };

        // Incrementar operativos se for tech HUMINT
        if (tech.category === 'humint') {
          updates.operatives = (agency.operatives || 0) + 5;
        }

      } else if (result.progress) {
        // SUCESSO PARCIAL - Adicionar progresso
        const newProgress = (research.progress || 0) + result.progress;

        if (newProgress >= 100) {
          // Progresso completou 100% - desbloquear
          const newTechs = [...(agency.technologies || []), research.techId];
          updates = {
            technologies: newTechs,
            currentResearch: null
          };

          if (tech.category === 'humint') {
            updates.operatives = (agency.operatives || 0) + 5;
          }
        } else {
          updates['currentResearch.progress'] = newProgress;
        }

      } else {
        // FALHA - Apenas registrar tentativa
        // Se for falha crítica, pode adicionar penalidade adicional
        if (result === RESEARCH_RESULTS.CRITICAL_FAILURE) {
          updates['currentResearch.progress'] = Math.max(0, (research.progress || 0) - 25);
        }
      }

      await updateDoc(agencyRef, updates);

      return {
        success: true,
        roll: roll,
        result: result,
        cost: attemptCost,
        unlocked: result.unlocked || false,
        tech: tech
      };

    } catch (error) {
      console.error('Erro ao tentar pesquisa:', error);
      return {
        success: false,
        error: 'Erro ao processar tentativa: ' + error.message
      };
    }
  }

  /**
   * Cancela pesquisa atual
   */
  async cancelResearch(agencyId) {
    try {
      const agencyRef = doc(db, 'agencies', agencyId);
      await db.collection('agencies').doc(agencyId).update({
        currentResearch: null
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Erro ao cancelar pesquisa:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retorna todas as tecnologias disponíveis
   */
  getAllTechnologies() {
    return TECHNOLOGIES;
  }

  /**
   * Retorna tecnologias por era
   */
  getTechnologiesByEra(era) {
    return Object.values(TECHNOLOGIES).filter(tech => tech.era === era);
  }

  /**
   * Retorna próximas tecnologias disponíveis para pesquisa
   */
  getAvailableTechnologies(unlockedTechs, country) {
    const techCivil = parseFloat(country.TecnologiaCivil) || parseFloat(country.Tecnologia) || 0;

    return Object.values(TECHNOLOGIES).filter(tech => {
      // Não desbloqueada
      if (unlockedTechs.includes(tech.id)) return false;

      // Pré-requisitos atendidos
      const prereqMet = tech.prerequisites.every(prereq => unlockedTechs.includes(prereq));
      if (!prereqMet) return false;

      // Tech Civil suficiente
      if (techCivil < tech.minTechCivil) return false;

      return true;
    });
  }
}

// Singleton
const researchSystem = new ResearchSystem();
export default researchSystem;
export { RESEARCH_RESULTS };
