/**
 * Sistema de Alertas de Segurança e Investigação
 * Gerencia detecção de espionagem e investigações
 */

import { db } from '../services/firebase.js';
import intelligenceAgencySystem from './intelligenceAgencySystem.js';

// Níveis de gravidade de alertas
const ALERT_SEVERITY = {
  low: {
    name: 'Baixa',
    icon: '🟢',
    color: 'green',
    baseCost: 100000
  },
  medium: {
    name: 'Média',
    icon: '🟡',
    color: 'amber',
    baseCost: 200000
  },
  high: {
    name: 'Alta',
    icon: '🔴',
    color: 'red',
    baseCost: 300000
  },
  critical: {
    name: 'Crítica',
    icon: '⚫',
    color: 'purple',
    baseCost: 500000
  }
};

// Setores afetados
const AFFECTED_SECTORS = [
  'Instalações Militares',
  'Telecomunicações',
  'Infraestrutura Crítica',
  'Governo Central',
  'Indústria de Defesa',
  'Pesquisa e Desenvolvimento',
  'Inteligência Nacional',
  'Fronteiras',
  'Portos e Aeroportos'
];

class SecurityAlertsSystem {
  constructor() {
    this.alerts = new Map();
  }

  /**
   * Determina gravidade do alerta baseado na fase da operação
   */
  determineSeverity(operation) {
    const phase = operation.phase || 1;

    if (phase === 1) return 'low';
    if (phase === 2) return 'medium';
    if (phase === 3) return 'high';
    return 'critical';
  }

  /**
   * Determina setor afetado aleatoriamente
   */
  determineAffectedSector() {
    return AFFECTED_SECTORS[Math.floor(Math.random() * AFFECTED_SECTORS.length)];
  }

  /**
   * Cria um alerta de segurança quando espionagem é detectada
   */
  async createSecurityAlert(operation, targetCountry, currentTurn, exposureLevel = 20) {
    try {
      const severity = this.determineSeverity(operation);
      const sector = this.determineAffectedSector();

      const alert = {
        targetCountryId: operation.targetCountryId,
        targetCountryName: operation.targetCountryName,
        spyCountryId: exposureLevel >= 80 ? operation.spyCountryId : null,
        spyCountryName: exposureLevel >= 80 ? operation.spyCountryName : null,
        spyAgencyId: exposureLevel >= 100 ? operation.agencyId : null,
        operationId: operation.id || null,
        detectedTurn: currentTurn,
        severity: severity,
        severityName: ALERT_SEVERITY[severity].name,
        sector: sector,
        exposureLevel: exposureLevel,
        status: 'pending', // pending, investigating, resolved
        investigation: {
          started: false,
          startedTurn: null,
          cost: null,
          result: null,
          rollResult: null
        },
        revealed: null,
        createdAt: new Date().toISOString()
      };

      const docRef = await db.collection('security_alerts').add(alert);

      return {
        success: true,
        alert: { ...alert, id: docRef.id }
      };

    } catch (error) {
      console.error('Erro ao criar alerta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calcula custo de investigação baseado em PIB e gravidade
   */
  calculateInvestigationCost(alert, country) {
    const severityData = ALERT_SEVERITY[alert.severity];
    const baseCost = severityData.baseCost;

    return intelligenceAgencySystem.calculateCostByPIB(baseCost, country);
  }

  /**
   * Calcula modificadores para investigação (D12)
   */
  calculateInvestigationModifiers(agency, alert, country) {
    let mods = 0;

    // Tecnologias da agência
    if (agency.technologies) {
      if (agency.technologies.includes('forensic_tactical')) mods += 2;
      if (agency.technologies.includes('surveillance_electronic')) mods += 2;
      if (agency.technologies.includes('double_agents')) mods += 3;
      if (agency.technologies.includes('biometrics_id')) mods += 2;
    }

    // Tier da agência
    if (agency.tier === 'powerful' || agency.tier === 'elite') {
      mods += 1;
    }

    // Foco em contra-espionagem
    if (agency.focus === 'counterintelligence') {
      mods += 2;
    }

    // Tech Civil
    const techCivil = parseFloat(country.TecnologiaCivil) || parseFloat(country.Tecnologia) || 0;
    if (techCivil > 60) mods += 1;

    // Urbanização
    const urbanization = parseFloat(country.Urbanizacao) || 0;
    if (urbanization > 70) mods += 1;

    // Gravidade do alerta (alertas mais graves dão mais pistas)
    if (alert.severity === 'high' || alert.severity === 'critical') {
      mods += 1;
    }

    return mods;
  }

  /**
   * Rola D12 para investigação
   */
  rollInvestigation(modifiers = 0) {
    const baseRoll = Math.floor(Math.random() * 12) + 1;
    const finalRoll = baseRoll + modifiers;

    return {
      baseRoll,
      modifiers,
      finalRoll: Math.max(1, finalRoll)
    };
  }

  /**
   * Determina resultado da investigação
   */
  determineInvestigationResult(roll, alert, operation) {
    const finalRoll = roll.finalRoll;

    if (finalRoll <= 3) {
      // FALHA CRÍTICA
      return {
        success: false,
        critical: true,
        level: 'CRITICAL_FAILURE',
        message: 'Investigação comprometida! Suspeitos alertados e fugiram.',
        revealed: null,
        penalty: 'Espionagem inimiga acelera (próxima fase em -1 turno)',
        actions: []
      };

    } else if (finalRoll <= 6) {
      // FALHA
      return {
        success: false,
        level: 'FAILURE',
        message: 'Investigação não encontrou evidências conclusivas.',
        revealed: {
          level: 'VAGUE',
          info: 'Possível origem: ' + this.getVagueRegion(operation)
        },
        actions: []
      };

    } else if (finalRoll <= 9) {
      // SUCESSO PARCIAL
      return {
        success: true,
        level: 'PARTIAL',
        message: 'Investigação revelou informações parciais.',
        revealed: {
          level: 'PARTIAL',
          region: this.getRegion(operation),
          operativesCount: `estimativa: ${operation.operativesDeployed - 2}-${operation.operativesDeployed + 2}`,
          phase: INFILTRATION_PHASES[operation.phase]?.name || 'Desconhecida',
          info: `País suspeito está na região: ${this.getRegion(operation)}`
        },
        bonus: '+20% detecção contra suspeitos por 3 turnos',
        actions: ['AUMENTAR_VIGILANCIA']
      };

    } else {
      // SUCESSO TOTAL
      return {
        success: true,
        level: 'COMPLETE',
        message: 'Rede de espionagem identificada e neutralizada!',
        revealed: {
          level: 'COMPLETE',
          spyCountry: operation.spyCountryName,
          spyAgency: operation.agencyId,
          operativesCount: operation.operativesDeployed,
          phase: operation.phase,
          coverIdentities: operation.coverIdentities,
          startedTurn: operation.startedTurn,
          info: `${operation.spyCountryName} está operando espionagem contra você!`
        },
        bonus: 'Operativos capturados',
        actions: [
          'DENUNCIAR_PUBLICAMENTE',
          'CAPTURAR_OPERATIVOS',
          'VIRAR_AGENTES',
          'EXPULSAR_DIPLOMATAS',
          'NEGOCIAR_SECRETO',
          'RETALIACAO_ENCOBERTA'
        ]
      };
    }
  }

  /**
   * Inicia investigação de um alerta
   */
  async investigateAlert(alertId, agency, country, currentTurn) {
    try {
      const alertRef = db.collection('security_alerts').doc(alertId);
      const alertSnap = await alertRef.get();

      if (!alertSnap.exists) {
        return {
          success: false,
          error: 'Alerta não encontrado!'
        };
      }

      const alert = alertSnap.data();

      // Verificar se já está sendo investigado
      if (alert.investigation.started) {
        return {
          success: false,
          error: 'Este alerta já está sendo investigado!'
        };
      }

      // Calcular custo
      const cost = this.calculateInvestigationCost(alert, country);

      // Verificar orçamento
      if (agency.budget < cost) {
        return {
          success: false,
          error: 'Orçamento da agência insuficiente!'
        };
      }

      // Buscar operação original (se disponível)
      let operation = null;
      if (alert.operationId) {
        const opSnap = await db.collection('espionage_operations').doc(alert.operationId).get();
        if (opSnap.exists) {
          operation = opSnap.data();
        }
      }

      // Calcular modificadores
      const modifiers = this.calculateInvestigationModifiers(agency, alert, country);

      // Rolar D12
      const roll = this.rollInvestigation(modifiers);

      // Determinar resultado
      const result = this.determineInvestigationResult(roll, alert, operation);

      // Atualizar alerta
      await alertRef.update({
        'investigation.started': true,
        'investigation.startedTurn': currentTurn,
        'investigation.cost': cost,
        'investigation.rollResult': roll,
        'investigation.result': result.level,
        revealed: result.revealed,
        status: result.success ? 'resolved' : 'investigated'
      });

      return {
        success: true,
        roll: roll,
        result: result,
        cost: cost
      };

    } catch (error) {
      console.error('Erro ao investigar alerta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém alertas ativos de um país
   */
  async getCountryAlerts(countryId, status = 'pending') {
    try {
      const snapshot = await db.collection('security_alerts')
        .where('targetCountryId', '==', countryId)
        .where('status', '==', status)
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return [];
    }
  }

  /**
   * Obtém todos os alertas (incluindo resolvidos) de um país
   */
  async getAllCountryAlerts(countryId) {
    try {
      const snapshot = await db.collection('security_alerts')
        .where('targetCountryId', '==', countryId)
        .get();

      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ordenar por data (mais recentes primeiro)
      alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return alerts;

    } catch (error) {
      console.error('Erro ao buscar todos os alertas:', error);
      return [];
    }
  }

  /**
   * Retorna região vaga (para falha)
   */
  getVagueRegion(operation) {
    const regions = [
      'América do Sul',
      'América do Norte',
      'Europa Ocidental',
      'Europa Oriental',
      'Ásia',
      'África',
      'Oriente Médio'
    ];
    return regions[Math.floor(Math.random() * regions.length)];
  }

  /**
   * Retorna região específica (para sucesso parcial)
   */
  getRegion(operation) {
    // Idealmente, buscar do país real
    // Por enquanto, retorna genérico
    return this.getVagueRegion(operation);
  }

  /**
   * Retorna níveis de gravidade
   */
  getSeverityLevels() {
    return ALERT_SEVERITY;
  }
}

// Singleton
const securityAlertsSystem = new SecurityAlertsSystem();
export default securityAlertsSystem;
export { ALERT_SEVERITY, AFFECTED_SECTORS };

// Import necessário para usar INFILTRATION_PHASES
import { INFILTRATION_PHASES } from './espionageOperationsSystem.js';
