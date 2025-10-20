/**
 * @file lawChangeModalManager.js
 * @description Gerencia o modal para mudança de Leis Nacionais.
 */

import { db } from '../services/firebase.js';
import { showConfirmBox, showNotification } from '../utils.js';

export class LawChangeModalManager {
  constructor() {
    this.modal = null;
    this.country = null;
    this.lawsConfig = null;
  }

  /**
   * Abre o modal para mudar um tipo de lei.
   * @param {'mobilization' | 'economic'} lawType - O tipo de lei a ser mudada.
   * @param {object} country - Os dados do país do jogador.
   * @param {object} lawsConfig - A configuração de todas as leis.
   */
  openModal(lawType, country, lawsConfig) {
    this.country = country;
    this.lawsConfig = lawsConfig;

    if (document.getElementById('law-change-modal')) return; // Evita abrir múltiplos modais

    const modalHtml = this.renderModal(lawType);
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    this.modal = document.getElementById('law-change-modal');

    this.setupEventListeners(lawType);
  }

  /**
   * Renderiza o HTML do modal.
   */
  renderModal(lawType) {
    const config = this.lawsConfig[lawType + 'Laws'];
    const currentLawId = this.country[lawType + 'Law'];
    const isChangingLaw = !!this.country.lawChange;

    const title = lawType === 'mobilization' ? 'Leis de Conscrição' : 'Leis Econômicas';
    const icon = lawType === 'mobilization' ? '🎖️' : '💼';
    const description = lawType === 'mobilization'
      ? 'Defina a política de recrutamento militar do seu país'
      : 'Ajuste o foco da economia entre produção civil e militar';

    return `
      <div id="law-change-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
          <!-- Header -->
          <div class="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl">
                  ${icon}
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-100">${title}</h3>
                  <p class="text-sm text-slate-400 mt-0.5">${description}</p>
                </div>
              </div>
              <button data-action="close" class="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-2 rounded-lg transition-all">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Laws List -->
          <div class="flex-1 overflow-y-auto p-6 space-y-3">
            ${Object.entries(config)
              .sort(([, a], [, b]) => a.level - b.level)
              .map(([lawId, lawData]) => this.renderLawOption(lawId, lawData, currentLawId, isChangingLaw, lawType)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renderiza uma única opção de lei no modal.
   */
  renderLawOption(lawId, lawData, currentLawId, isChangingLaw, lawType) {
    const config = this.lawsConfig[lawType + 'Laws'][currentLawId];
    const isCurrent = lawId === currentLawId;
    const transitionTime = this.calculateTransitionTime(lawData.level, config.level);

    let buttonHtml;
    let statusBadge = '';

    if (isCurrent) {
      buttonHtml = '<button class="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-400 text-sm font-medium rounded-lg cursor-not-allowed" disabled>Lei Atual</button>';
      statusBadge = '<span class="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium rounded">ATIVA</span>';
    } else if (isChangingLaw) {
      buttonHtml = '<button class="px-4 py-2 bg-slate-600/20 border border-slate-500/30 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed" disabled>Mudança em Progresso</button>';
    } else {
      buttonHtml = `<button data-action="adopt" data-law-id="${lawId}" data-law-type="${lawType}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">Adotar (${transitionTime} turnos)</button>`;
    }

    return `
      <div class="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 border ${isCurrent ? 'border-green-500/50 shadow-lg shadow-green-900/20' : 'border-slate-700/50 hover:border-slate-600/70'} rounded-xl p-4 transition-all hover:shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-400 text-xs font-bold">
                ${lawData.level}
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-slate-100 text-base">${lawData.name}</h4>
              </div>
              ${statusBadge}
            </div>
            <div class="text-xs text-slate-400 mt-2 space-y-1">${this.getLawEffects(lawData)}</div>
          </div>
          <div class="flex items-center">
            ${buttonHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Calcula o tempo de transição para uma nova lei.
   */
  calculateTransitionTime(newLevel, currentLevel) {
    const isInWar = this.country.inWarWith && this.country.inWarWith.length > 0;
    const levelDiff = Math.abs(newLevel - currentLevel);
    const baseDuration = levelDiff * 2;
    
    if (isInWar) {
      return Math.max(1, baseDuration);
    } else {
      return Math.max(2, baseDuration * 2);
    }
  }

  /**
   * Formata os efeitos de uma lei para exibição.
   */
  getLawEffects(lawData) {
    const effects = [];

    // Bônus (verde)
    if (lawData.bonuses) {
      Object.entries(lawData.bonuses).forEach(([key, value]) => {
        const displayName = this.getEffectDisplayName(key);
        effects.push(`
          <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="font-medium">${displayName}: +${(value * 100).toFixed(0)}%</span>
          </div>
        `);
      });
    }

    // Penalidades (vermelho)
    if (lawData.penalties) {
      Object.entries(lawData.penalties).forEach(([key, value]) => {
        const displayName = this.getEffectDisplayName(key);
        effects.push(`
          <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="font-medium">${displayName}: ${(value * 100).toFixed(0)}%</span>
          </div>
        `);
      });
    }

    // Modificadores de consumo
    if (lawData.consumptionModifiers) {
      Object.entries(lawData.consumptionModifiers).forEach(([key, value]) => {
        const prefix = value > 0 ? '+' : '';
        const color = value > 0 ? 'red' : 'green';
        const icon = value > 0 ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7';
        effects.push(`
          <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-${color}-500/10 border border-${color}-500/20 rounded text-${color}-400">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${icon}" />
            </svg>
            <span class="font-medium">Consumo ${key}: ${prefix}${(value * 100).toFixed(0)}%</span>
          </div>
        `);
      });
    }

    if (effects.length === 0) {
      return '<div class="text-slate-500 italic">Nenhum efeito especial</div>';
    }

    return `<div class="flex flex-wrap gap-2">${effects.join('')}</div>`;
  }

  /**
   * Converte nomes de efeitos em português legível.
   */
  getEffectDisplayName(key) {
    const names = {
      'resourceProduction': 'Produção de Recursos',
      'civilianFactoryEfficiency': 'Eficiência Civil',
      'militaryProductionSpeed': 'Produção Militar',
      'recruitablePopulation': 'População Recrutável',
      'militaryProductionCost': 'Custo Militar',
      'warExhaustionPassiveGain': 'Exaustão de Guerra',
      'militaryCapacity': 'Capacidade Militar'
    };
    return names[key] || key;
  }

  /**
   * Adiciona os event listeners ao modal.
   */
  setupEventListeners(lawType) {
    this.modal.addEventListener('click', (e) => {
      // Procura pelo elemento com data-action (pode ser um parent se clicar no SVG)
      const actionElement = e.target.closest('[data-action]');
      if (!actionElement) return;

      const action = actionElement.dataset.action;
      if (action === 'close') {
        this.closeModal();
      } else if (action === 'adopt') {
        this.handleAdopt(actionElement.dataset.lawId, actionElement.dataset.lawType);
      }
    });

    // Fecha o modal ao clicar no backdrop (fundo escuro)
    this.modal.addEventListener('click', (e) => {
      if (e.target.id === 'law-change-modal') {
        this.closeModal();
      }
    });
  }

  /**
   * Lida com o clique no botão "Adotar".
   */
  async handleAdopt(lawId, lawType) {
    const targetLaw = this.lawsConfig[lawType + 'Laws'][lawId];
    const currentLaw = this.lawsConfig[lawType + 'Laws'][this.country[lawType + 'Law']];
    const transitionTime = this.calculateTransitionTime(targetLaw.level, currentLaw.level);

    const confirmed = await showConfirmBox(
      'Confirmar Mudança de Lei',
      `Você tem certeza que deseja iniciar a transição para a lei "${targetLaw.name}"? O processo levará ${transitionTime} turnos e não poderá ser cancelado.`,
      'Sim, iniciar transição',
      'Cancelar'
    );

    if (!confirmed) return;

    const lawChangeObject = {
      type: lawType,
      originLaw: this.country[lawType + 'Law'],
      targetLaw: lawId,
      progress: 0,
      totalTurns: transitionTime
    };

    try {
      const countryRef = db.collection('paises').doc(this.country.id);
      await countryRef.update({ lawChange: lawChangeObject });
      
      showNotification('success', `Transição para ${targetLaw.name} iniciada!`);
      this.closeModal();
      
      // Recarrega o dashboard para mostrar o painel de progresso
      setTimeout(() => window.location.reload(), 500);

    } catch (error) {
      console.error('Erro ao iniciar mudança de lei:', error);
      showNotification('error', `Erro: ${error.message}`);
    }
  }

  /**
   * Fecha e remove o modal.
   */
  closeModal() {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }
}
