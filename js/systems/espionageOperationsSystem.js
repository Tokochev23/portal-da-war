/**
 * Sistema de Operações de Espionagem
 * Gerencia infiltração progressiva e operações de inteligência
 */

import { db } from '../services/firebase.js';
import intelligenceAgencySystem from './intelligenceAgencySystem.js';

// Fases de infiltração
const INFILTRATION_PHASES = {
  1: {
    name: 'Estabelecer Presença',
    icon: '🚶',
    duration: [2, 4], // turnos mínimo-máximo
    activities: [
      'Enviar operativos',
      'Criar identidades de cobertura',
      'Estabelecer safe houses',
      'Mapear território'
    ],
    intelUnlocked: 0,
    risks: ['Operativos capturados', 'Identidades expostas'],
    description: 'Primeiros passos em território inimigo'
  },
  2: {
    name: 'Recrutar Rede Local',
    icon: '👥',
    duration: [2, 6],
    activities: [
      'Identificar alvos para recrutamento',
      'Aproximar e recrutar',
      'Construir rede de informantes',
      'Estabelecer comunicações seguras'
    ],
    intelUnlocked: 10,
    risks: ['Informantes capturados', 'Rede comprometida'],
    description: 'Construir base de operações local'
  },
  3: {
    name: 'Penetração',
    icon: '🎯',
    duration: [3, 8],
    activities: [
      'Infiltrar instalações-chave',
      'Plantar dispositivos',
      'Subornar oficiais',
      'Acessar documentos classificados'
    ],
    intelUnlocked: 40,
    risks: ['Contra-espionagem ativa', 'Dispositivos descobertos'],
    description: 'Acesso a informações sensíveis'
  },
  4: {
    name: 'Operações Completas',
    icon: '⚡',
    duration: 'ongoing',
    activities: [
      'Acesso total a informações',
      'Capacidade de sabotagem',
      'Influenciar decisões',
      'Operações encobertas'
    ],
    intelUnlocked: 100,
    risks: ['Detecção constante', 'Guerra de contra-espionagem'],
    description: 'Domínio completo de inteligência'
  }
};

// Camadas de informação desbloqueadas
const INTEL_LAYERS = {
  0: {
    label: 'Público',
    info: ['PIB', 'População', 'Modelo Político', 'WPI', 'Estabilidade (geral)', 'Urbanização', 'Tecnologia (%)']
  },
  10: {
    label: 'Presença Estabelecida',
    info: ['Orçamento Nacional aproximado', 'Recursos principais', 'Principais cidades']
  },
  40: {
    label: 'Rede Infiltrada',
    info: ['Orçamento detalhado', 'Distribuição militar', 'Tecnologias específicas', 'Capacidade de produção']
  },
  70: {
    label: 'Penetração Profunda',
    info: ['Inventário militar parcial', 'Planos de produção', 'Bens de consumo', 'Recursos detalhados']
  },
  100: {
    label: 'Domínio Total',
    info: ['Inventário completo', 'Ordens de batalha', 'Intenções diplomáticas', 'Projetos secretos', 'Agência inimiga (se houver)']
  }
};

// Tipos de falha em operações
const FAILURE_TYPES = {
  CLEAN_FAIL: {
    name: 'Falha Limpa',
    exposed: false,
    detailsRevealed: 0,
    severity: 'low'
  },
  MINOR_EXPOSURE: {
    name: 'Exposição Menor',
    exposed: true,
    detailsRevealed: 20,
    severity: 'medium'
  },
  MAJOR_EXPOSURE: {
    name: 'Exposição Grave',
    exposed: true,
    detailsRevealed: 60,
    severity: 'high'
  },
  TOTAL_COMPROMISE: {
    name: 'Comprometimento Total',
    exposed: true,
    detailsRevealed: 100,
    operativesCaptured: true,
    severity: 'critical'
  }
};

class EspionageOperationsSystem {
  constructor() {
    this.operations = new Map();
  }

  /**
   * Calcula custo de uma operação
   */
  calculateOperationCost(targetCountry, duration) {
    const baseCostPerTurn = 25000; // US$ 25k por turno

    // Ajustar pelo WPI do alvo (países mais poderosos são mais caros de espionar)
    const targetWPI = parseFloat(targetCountry.WarPower) || 50;
    const wpiMultiplier = 0.5 + (targetWPI / 100); // 0.5x a 1.5x

    return Math.round(baseCostPerTurn * duration * wpiMultiplier);
  }

  /**
   * Calcula chance de sucesso de uma fase
   */
  calculatePhaseSuccessChance(phase, spyAgency, targetCountry, spyCountry) {
    let baseChance = 0.6; // 60% base

    // Ajustar por fase (fases mais avançadas são mais difíceis)
    baseChance -= (phase - 1) * 0.1; // -10% por fase

    // Tier da agência
    const tierBonus = {
      'limited': -0.1,
      'competent': 0,
      'powerful': 0.1,
      'elite': 0.2
    };
    baseChance += tierBonus[spyAgency.tier] || 0;

    // Tecnologia do país espião
    const spyTech = (parseFloat(spyCountry.TecnologiaCivil) || parseFloat(spyCountry.Tecnologia) || 0) / 100;
    baseChance += spyTech * 0.15;

    // Contra-espionagem do alvo
    const targetCounterIntel = (parseFloat(targetCountry.CounterIntelligence) || 0) / 100;
    baseChance -= targetCounterIntel * 2.5; // -25% se alvo tiver 10% contra-intel

    // Urbanização do alvo (mais difícil espionar países urbanos)
    const targetUrban = (parseFloat(targetCountry.Urbanizacao) || 0) / 100;
    baseChance -= targetUrban * 0.08;

    // Tecnologias desbloqueadas
    if (spyAgency.technologies) {
      if (spyAgency.technologies.includes('tradecraft_basic')) baseChance += 0.1;
      if (spyAgency.technologies.includes('recruitment_native')) baseChance += 0.15;
      if (phase >= 3 && spyAgency.technologies.includes('surveillance_electronic')) baseChance += 0.1;
    }

    // Garantir entre 5% e 95%
    return Math.max(0.05, Math.min(0.95, baseChance));
  }

  /**
   * Calcula chance de detecção
   */
  calculateDetectionChance(phase, targetCountry) {
    const counterIntel = (parseFloat(targetCountry.CounterIntelligence) || 0) / 100;

    // Base aumenta com a fase
    let baseDetection = phase * 0.05; // 5% por fase

    // Contra-espionagem aumenta detecção
    baseDetection += counterIntel * 4; // +40% se alvo tiver 10% contra-intel

    return Math.min(0.9, baseDetection); // Máximo 90%
  }

  /**
   * Verifica se país já tem operação ativa contra alvo
   */
  async hasActiveOperation(spyCountryId, targetCountryId) {
    try {
      const snapshot = await db.collection('espionage_operations')
        .where('spyCountryId', '==', spyCountryId)
        .where('targetCountryId', '==', targetCountryId)
        .where('active', '==', true)
        .get();

      if (!snapshot.empty) {
        const opData = snapshot.docs[0].data();
        opData.id = snapshot.docs[0].id;
        return opData;
      }

      return null;
    } catch (error) {
      console.error('Erro ao verificar operação:', error);
      return null;
    }
  }

  /**
   * Inicia uma nova operação de espionagem
   */
  async initiateOperation(spyAgency, targetCountry, spyCountry, duration, currentTurn) {
    try {
      // Verificar se já existe operação ativa
      const existing = await this.hasActiveOperation(spyAgency.countryId, targetCountry.id);
      if (existing) {
        return {
          success: false,
          error: 'Você já tem uma operação ativa neste país!'
        };
      }

      // Calcular custo
      const cost = this.calculateOperationCost(targetCountry, duration);

      // Verificar orçamento
      if (spyAgency.budget < cost) {
        return {
          success: false,
          error: 'Orçamento da agência insuficiente!'
        };
      }

      // Criar operação
      const operation = {
        agencyId: spyAgency.id,
        spyCountryId: spyAgency.countryId,
        spyCountryName: spyAgency.countryName,
        targetCountryId: targetCountry.id,
        targetCountryName: targetCountry.Pais,
        phase: 1,
        progress: 0,
        startedTurn: currentTurn,
        lastProgressTurn: currentTurn,
        plannedDuration: duration,
        operativesDeployed: Math.floor(3 + Math.random() * 5), // 3-8 operativos
        coverIdentities: this.generateCoverIdentities(),
        detected: false,
        detectedTurn: null,
        active: true,
        intelLevel: 0,
        createdAt: new Date().toISOString()
      };

      const docRef = await db.collection('espionage_operations').add(operation);

      return {
        success: true,
        operation: { ...operation, id: docRef.id },
        cost: cost
      };

    } catch (error) {
      console.error('Erro ao iniciar operação:', error);
      return {
        success: false,
        error: 'Erro ao processar operação: ' + error.message
      };
    }
  }

  /**
   * Gera identidades de cobertura aleatórias
   */
  generateCoverIdentities() {
    const identities = [
      'Comerciante', 'Jornalista', 'Diplomata', 'Professor',
      'Engenheiro', 'Médico', 'Empresário', 'Turista',
      'Estudante', 'Artista', 'Pesquisador', 'Consultor'
    ];

    const count = Math.floor(2 + Math.random() * 3); // 2-4 identidades
    const selected = [];

    for (let i = 0; i < count; i++) {
      const random = identities[Math.floor(Math.random() * identities.length)];
      if (!selected.includes(random)) {
        selected.push(random);
      }
    }

    return selected;
  }

  /**
   * Avança progresso de uma operação
   */
  async progressOperation(operationId, spyAgency, targetCountry, spyCountry, currentTurn) {
    try {
      const opSnap = await db.collection('espionage_operations').doc(operationId).get();

      if (!opSnap.exists) {
        return {
          success: false,
          error: 'Operação não encontrada!'
        };
      }

      const operation = opSnap.data();

      // Verificar se já progrediu este turno
      if (operation.lastProgressTurn === currentTurn) {
        return {
          success: false,
          error: 'Operação já progrediu neste turno!'
        };
      }

      const currentPhase = operation.phase;
      const phaseData = INFILTRATION_PHASES[currentPhase];

      // Calcular chance de sucesso
      const successChance = this.calculatePhaseSuccessChance(
        currentPhase,
        spyAgency,
        targetCountry,
        spyCountry
      );

      // Rolar para sucesso
      const successRoll = Math.random();
      const succeeded = successRoll <= successChance;

      // Calcular chance de detecção
      const detectionChance = this.calculateDetectionChance(currentPhase, targetCountry);
      const detectionRoll = Math.random();
      const detected = detectionRoll <= detectionChance;

      let updates = {
        lastProgressTurn: currentTurn
      };

      if (succeeded) {
        // Sucesso - aumentar progresso
        const progressIncrement = 100 / (phaseData.duration[1] || 4); // Dividir por duração máxima
        const newProgress = Math.min(100, operation.progress + progressIncrement);

        updates.progress = newProgress;

        // Se completou 100%, avançar para próxima fase
        if (newProgress >= 100) {
          if (currentPhase < 4) {
            updates.phase = currentPhase + 1;
            updates.progress = 0;
            updates.intelLevel = INFILTRATION_PHASES[currentPhase + 1].intelUnlocked;
          } else {
            // Fase 4 completa - operação totalmente estabelecida
            updates.intelLevel = 100;
          }
        }
      }

      // Detecção
      if (detected && !operation.detected) {
        updates.detected = true;
        updates.detectedTurn = currentTurn;

        // Criar alerta para o país alvo (implementado na Fase 4)
        // await this.createSecurityAlert(operation, targetCountry, currentTurn);
      }

      await db.collection('espionage_operations').doc(operationId).update(updates);

      return {
        success: true,
        succeeded: succeeded,
        detected: detected,
        newPhase: updates.phase || currentPhase,
        newProgress: updates.progress || operation.progress,
        intelLevel: updates.intelLevel || operation.intelLevel,
        successChance: Math.round(successChance * 100),
        detectionChance: Math.round(detectionChance * 100)
      };

    } catch (error) {
      console.error('Erro ao progredir operação:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém todas as operações ativas de uma agência
   */
  async getAgencyOperations(agencyId) {
    try {
      const snapshot = await db.collection('espionage_operations')
        .where('agencyId', '==', agencyId)
        .where('active', '==', true)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('Erro ao buscar operações:', error);
      return [];
    }
  }

  /**
   * Encerra uma operação
   */
  async terminateOperation(operationId) {
    try {
      await db.collection('espionage_operations').doc(operationId).update({
        active: false,
        terminatedAt: new Date().toISOString()
      });

      return {
        success: true
      };
    } catch (error) {
      console.error('Erro ao encerrar operação:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retorna informações das fases
   */
  getPhases() {
    return INFILTRATION_PHASES;
  }

  /**
   * Retorna camadas de intel
   */
  getIntelLayers() {
    return INTEL_LAYERS;
  }

  /**
   * Retorna tipos de falha
   */
  getFailureTypes() {
    return FAILURE_TYPES;
  }
}

// Singleton
const espionageOperationsSystem = new EspionageOperationsSystem();
export default espionageOperationsSystem;
export { INFILTRATION_PHASES, INTEL_LAYERS, FAILURE_TYPES };
