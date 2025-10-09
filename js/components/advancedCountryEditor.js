/**
 * Advanced Country Editor
 * Gerenciador unificado para edição de todos os atributos de um país
 */

import { db, getAllCountries } from '../services/firebase.js';
import { showNotification, Logger } from '../utils.js';
import { calculatePIBTotal, formatCurrency } from '../utils/pibCalculations.js';

export class AdvancedCountryEditor {
  constructor() {
    this.countries = [];
    this.selectedCountry = null;
    this.originalData = null;
    this.fieldGetters = new Map();
    this.hasUnsavedChanges = false;

    // Definição dos campos por categoria
    this.fieldSchema = {
      'geral-politico': {
        title: 'Geral e Político',
        fields: [
          { key: 'Pais', label: 'Nome do País', type: 'text', required: true },
          { key: 'Player', label: 'Jogador (UID)', type: 'text' },
          { key: 'ModeloPolitico', label: 'Modelo Político', type: 'text' },
          { key: 'Populacao', label: 'População', type: 'number', min: 0, step: 1000 },
          { key: 'Estabilidade', label: 'Estabilidade (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'Burocracia', label: 'Burocracia (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'Urbanizacao', label: 'Urbanização (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'Visibilidade', label: 'Visibilidade', type: 'select', options: ['Público', 'Privado'] },
          { key: 'Ativo', label: 'País Ativo', type: 'checkbox' },
          { key: 'DataCriacao', label: 'Data de Criação', type: 'readonly', description: 'Timestamp automático do Firebase' },
          { key: 'DataVinculacao', label: 'Data de Vinculação', type: 'readonly', description: 'Timestamp de quando jogador foi vinculado' }
        ]
      },
      'economia-recursos': {
        title: 'Economia e Recursos',
        fields: [
          { key: 'PIB', label: 'PIB Total', type: 'calculated', formula: 'PIBPerCapita * Populacao' },
          { key: 'PIBPerCapita', label: 'PIB per Capita', type: 'number', min: 0, step: 0.01 },
          { key: 'IndustrialEfficiency', label: 'Eficiência Industrial (%)', type: 'number', min: 0, max: 200, step: 0.1 },
          { key: 'PoliticaIndustrial', label: 'Política Industrial', type: 'select',
            options: ['combustivel', 'metais', 'graos', 'energia', 'balanceada'] },
          { key: 'BensDeConsumo', label: 'Bens de Consumo (estoque)', type: 'number', min: 0 },
          { key: 'OrcamentoGasto', label: 'Orçamento Gasto', type: 'number', min: 0 },
          { key: 'TurnoUltimaAtualizacao', label: 'Turno Última Atualização', type: 'number', min: 0, step: 1 },

          // Grãos
          { key: 'Graos', label: 'Grãos (estoque)', type: 'number', min: 0, step: 1 },
          { key: 'PotencialAgricola', label: 'Potencial Agrícola', type: 'number', min: 0, step: 1 },
          { key: 'ProducaoGraos', label: 'Produção de Grãos (mensal)', type: 'number', min: 0, step: 1 },
          { key: 'ConsumoGraos', label: 'Consumo de Grãos (mensal)', type: 'number', min: 0, step: 1 },

          // Combustível
          { key: 'Combustivel', label: 'Combustível (estoque)', type: 'number', min: 0, step: 1 },
          { key: 'PotencialCombustivel', label: 'Potencial de Combustível', type: 'number', min: 0, step: 1 },
          { key: 'ProducaoCombustivel', label: 'Produção de Combustível (mensal)', type: 'number', min: 0, step: 1 },
          { key: 'ConsumoCombustivel', label: 'Consumo de Combustível (mensal)', type: 'number', min: 0, step: 1 },
          { key: 'CombustivelSaldo', label: 'Saldo de Combustível', type: 'number', step: 1 },

          // Metais
          { key: 'Metais', label: 'Metais (estoque)', type: 'number', step: 1 },
          { key: 'PotencialMetais', label: 'Potencial de Metais', type: 'number', min: 0, step: 1 },
          { key: 'ProducaoMetais', label: 'Produção de Metais (mensal)', type: 'number', min: 0, step: 1 },
          { key: 'ConsumoMetais', label: 'Consumo de Metais (mensal)', type: 'number', min: 0, step: 1 },

          // Carvão
          { key: 'CarvaoSaldo', label: 'Saldo de Carvão', type: 'number', step: 1 },
          { key: 'PotencialCarvao', label: 'Potencial de Carvão', type: 'number', min: 0, step: 1 },
          { key: 'ProducaoCarvao', label: 'Produção de Carvão (mensal)', type: 'number', min: 0, step: 1 },
          { key: 'ConsumoCarvao', label: 'Consumo de Carvão (mensal)', type: 'number', min: 0, step: 1 },

          // Urânio
          { key: 'Uranio', label: 'Urânio (estoque)', type: 'number', min: 0, step: 1 },
          { key: 'PotencialUranio', label: 'Potencial de Urânio', type: 'number', min: 0, step: 1 },

          // Hidrelétrico
          { key: 'PotencialHidreletrico', label: 'Potencial Hidrelétrico', type: 'number', min: 0, step: 1 },

          // Estruturas calculadas (readonly)
          { key: 'BensDeConsumoCalculado', label: 'Bens de Consumo (dados calculados)', type: 'readonly',
            description: 'Estrutura com demand, production, satisfactionLevel, stabilityEffect' },
          { key: 'ConsumoCalculado', label: 'Consumo (dados calculados)', type: 'readonly',
            description: 'Estrutura com climateZone, developmentLevel, multiplier' },
          { key: 'ProducaoCalculada', label: 'Produção (dados calculados)', type: 'readonly',
            description: 'Estrutura com climateZone, developmentLevel, geographicBonuses' }
        ]
      },
      'energia': {
        title: 'Energia',
        fields: [
          { key: 'Energia.capacidade', label: 'Capacidade de Energia', type: 'number', min: 0, step: 1 },
          { key: 'Energia.demanda', label: 'Demanda de Energia', type: 'number', min: 0, step: 1 },
          { key: 'ProducaoEnergia', label: 'Produção de Energia (mensal)', type: 'number', min: 0, step: 1 },
          { key: 'ConsumoEnergia', label: 'Consumo de Energia (mensal)', type: 'number', min: 0, step: 1 },
          { key: 'Energia', label: 'Energia (estrutura completa)', type: 'readonly',
            description: 'Estrutura complexa com power_plants - use o dashboard para editar' }
        ]
      },
      'militar-defesa': {
        title: 'Militar e Defesa',
        fields: [
          { key: 'WarPower', label: 'WarPower', type: 'number', min: 0, step: 0.1 },
          { key: 'CounterIntelligence', label: 'Contra-Inteligência', type: 'number', min: 0, max: 100, step: 0.1 },

          // Orçamento Militar
          { key: 'MilitaryBudgetPercent', label: 'Orçamento Militar (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'MilitaryDistributionAircraft', label: 'Distribuição - Aviação (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'MilitaryDistributionNaval', label: 'Distribuição - Naval (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'MilitaryDistributionVehicles', label: 'Distribuição - Veículos (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'AgencyBudgetSpent', label: 'Gasto da Agência de Inteligência', type: 'number', min: 0 },

          // Totalizadores simples
          { key: 'Exercito', label: 'Exército (total simplificado)', type: 'number', min: 0, step: 1 },
          { key: 'Aeronautica', label: 'Aeronáutica (total simplificado)', type: 'number', min: 0, step: 1 },
          { key: 'Marinha', label: 'Marinha (total simplificado)', type: 'number', min: 0, step: 1 },
          { key: 'Veiculos', label: 'Veículos (total simplificado)', type: 'number', min: 0, step: 1 },

          // === INVENTÁRIO DETALHADO ===

          // Veículos Terrestres
          { key: 'inventario.Howitzer', label: '🎖️ Howitzer', type: 'number', min: 0, step: 1 },
          { key: 'inventario.SPA', label: '🎖️ SPA (Artilharia Autopropulsada)', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Antiaerea', label: '🎖️ Antiaérea', type: 'number', min: 0, step: 1 },
          { key: 'inventario.SPAA', label: '🎖️ SPAA', type: 'number', min: 0, step: 1 },
          { key: 'inventario.APC', label: '🎖️ APC', type: 'number', min: 0, step: 1 },
          { key: 'inventario.IFV', label: '🎖️ IFV', type: 'number', min: 0, step: 1 },
          { key: 'inventario.TanqueLeve', label: '🎖️ Tanque Leve', type: 'number', min: 0, step: 1 },
          { key: 'inventario.MBT', label: '🎖️ MBT', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Transporte', label: '🎖️ Transporte', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Utilitarios', label: '🎖️ Utilitários', type: 'number', min: 0, step: 1 },

          // Aeronaves
          { key: 'inventario.Caca', label: '✈️ Caça', type: 'number', min: 0, step: 1 },
          { key: 'inventario.CAS', label: '✈️ CAS', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Bomber', label: '✈️ Bomber', type: 'number', min: 0, step: 1 },
          { key: 'inventario.BomberAJato', label: '✈️ Bomber a Jato', type: 'number', min: 0, step: 1 },
          { key: 'inventario.BomberEstrategico', label: '✈️ Bomber Estratégico', type: 'number', min: 0, step: 1 },
          { key: 'inventario.BomberEstrategicoAJato', label: '✈️ Bomber Estratégico a Jato', type: 'number', min: 0, step: 1 },
          { key: 'inventario.AWAC', label: '✈️ AWAC', type: 'number', min: 0, step: 1 },
          { key: 'inventario.HeliTransporte', label: '🚁 Helicóptero de Transporte', type: 'number', min: 0, step: 1 },
          { key: 'inventario.HeliAtaque', label: '🚁 Helicóptero de Ataque', type: 'number', min: 0, step: 1 },
          { key: 'inventario.TransporteAereo', label: '✈️ Transporte Aéreo', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Carga', label: '✈️ Aeronave de Carga', type: 'number', min: 0, step: 1 },

          // Navios
          { key: 'inventario.PAEsquadra', label: '⚓ PA de Esquadra', type: 'number', min: 0, step: 1 },
          { key: 'inventario.PAEscolta', label: '⚓ PA de Escolta', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Encouracado', label: '⚓ Encouraçado', type: 'number', min: 0, step: 1 },
          { key: 'inventario.CruzadorMisseis', label: '⚓ Cruzador de Mísseis', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Cruzador', label: '⚓ Cruzador', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Fragata', label: '⚓ Fragata', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Destroyer', label: '⚓ Destroyer', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Submarino', label: '⚓ Submarino', type: 'number', min: 0, step: 1 },
          { key: 'inventario.SubmarinoBalístico', label: '⚓ Submarino Balístico', type: 'number', min: 0, step: 1 },
          { key: 'inventario.SubmarinoNuclear', label: '⚓ Submarino Nuclear', type: 'number', min: 0, step: 1 },
          { key: 'inventario.TransporteNaval', label: '⚓ Transporte Naval', type: 'number', min: 0, step: 1 },
          { key: 'inventario.Desembarque', label: '⚓ Navio de Desembarque', type: 'number', min: 0, step: 1 },

          // Forças convencionais (mantidas para compatibilidade)
          { key: 'exercito.Infantaria', label: '👥 Exército: Infantaria', type: 'number', min: 0, step: 1 },
          { key: 'exercito.Artilharia', label: '👥 Exército: Artilharia', type: 'number', min: 0, step: 1 },
          { key: 'aeronautica.Caca', label: '👥 Aeronáutica: Caça', type: 'number', min: 0, step: 1 },
          { key: 'aeronautica.CAS', label: '👥 Aeronáutica: CAS', type: 'number', min: 0, step: 1 },
          { key: 'aeronautica.Bomber', label: '👥 Aeronáutica: Bombardeiro', type: 'number', min: 0, step: 1 },
          { key: 'marinha.Fragata', label: '👥 Marinha: Fragata', type: 'number', min: 0, step: 1 },
          { key: 'marinha.Destroyer', label: '👥 Marinha: Destroyer', type: 'number', min: 0, step: 1 },
          { key: 'marinha.Submarino', label: '👥 Marinha: Submarino', type: 'number', min: 0, step: 1 },
          { key: 'marinha.Transporte', label: '👥 Marinha: Transporte', type: 'number', min: 0, step: 1 },

          // Arsenal especial
          { key: 'arsenal.Nuclear', label: '☢️ Arsenal: Bomba Nuclear', type: 'number', min: 0, step: 1 }
        ]
      },
      'tecnologia': {
        title: 'Tecnologia',
        fields: [
          { key: 'Tecnologia', label: 'Tecnologia Militar (%)', type: 'number', min: 0, max: 100, step: 0.1 },
          { key: 'TecnologiaCivil', label: 'Tecnologia Civil (%)', type: 'number', min: 0, max: 100, step: 0.1 }
        ]
      }
    };

    this.elements = {};
  }

  async initialize() {
    try {
      this.cacheElements();
      this.setupEventListeners();
      await this.loadCountries();
      Logger.info('Editor de País Avançado inicializado');
    } catch (error) {
      Logger.error('Erro ao inicializar Editor de País Avançado:', error);
      showNotification('error', 'Erro ao inicializar o editor');
    }
  }

  cacheElements() {
    this.elements = {
      selectCountry: document.getElementById('select-pais-avancado'),
      btnSave: document.getElementById('btn-salvar-pais-avancado'),
      btnCreate: document.getElementById('btn-criar-pais'),
      btnDelete: document.getElementById('btn-deletar-pais'),
      btnSplit: document.getElementById('btn-dividir-pais'),
      editorLoading: document.getElementById('editor-loading'),
      sections: {
        'geral-politico': document.getElementById('section-geral-politico'),
        'economia-recursos': document.getElementById('section-economia-recursos'),
        'energia': document.getElementById('section-energia'),
        'militar-defesa': document.getElementById('section-militar-defesa'),
        'tecnologia': document.getElementById('section-tecnologia')
      }
    };
  }

  setupEventListeners() {
    if (this.elements.selectCountry) {
      this.elements.selectCountry.addEventListener('change', () => {
        this.onCountryChanged();
      });
    }

    if (this.elements.btnSave) {
      this.elements.btnSave.addEventListener('click', () => {
        this.saveAllChanges();
      });
    }

    if (this.elements.btnCreate) {
      this.elements.btnCreate.addEventListener('click', () => {
        this.createNewCountry();
      });
    }

    if (this.elements.btnDelete) {
      this.elements.btnDelete.addEventListener('click', () => {
        this.deleteCountry();
      });
    }

    if (this.elements.btnSplit) {
      this.elements.btnSplit.addEventListener('click', () => {
        this.splitCountry();
      });
    }

    // Detectar mudanças no formulário
    document.addEventListener('input', (e) => {
      if (e.target.closest('#country-editor-accordion')) {
        this.markAsChanged();
      }
    });

    // Aviso ao sair com mudanças não salvas
    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
        return e.returnValue;
      }
    });
  }

  async loadCountries() {
    try {
      this.countries = await getAllCountries();
      this.countries.sort((a, b) => (a.Pais || '').localeCompare(b.Pais || ''));
      this.populateCountryDropdown();
    } catch (error) {
      Logger.error('Erro ao carregar países:', error);
      showNotification('error', 'Erro ao carregar países');
    }
  }

  populateCountryDropdown() {
    if (!this.elements.selectCountry) return;

    this.elements.selectCountry.innerHTML = '<option value="">Selecione um país...</option>';

    this.countries.forEach(country => {
      const option = document.createElement('option');
      option.value = country.id;
      option.textContent = country.Pais || country.id;
      this.elements.selectCountry.appendChild(option);
    });
  }

  async onCountryChanged() {
    const countryId = this.elements.selectCountry.value;

    if (!countryId) {
      this.clearEditor();
      return;
    }

    // Verificar mudanças não salvas
    if (this.hasUnsavedChanges) {
      const confirm = await this.confirmDiscard();
      if (!confirm) {
        // Restaurar seleção anterior
        this.elements.selectCountry.value = this.selectedCountry?.id || '';
        return;
      }
    }

    await this.loadCountryData(countryId);
  }

  async confirmDiscard() {
    return new Promise((resolve) => {
      const result = window.confirm(
        'Você tem alterações não salvas. Deseja descartá-las e continuar?'
      );
      resolve(result);
    });
  }

  async loadCountryData(countryId) {
    try {
      this.showLoading(true);

      const doc = await db.collection('paises').doc(countryId).get();
      if (!doc.exists) {
        showNotification('error', 'País não encontrado');
        return;
      }

      this.selectedCountry = { id: doc.id, ...doc.data() };
      this.originalData = JSON.parse(JSON.stringify(this.selectedCountry));

      this.renderAllSections();
      this.showLoading(false);
      this.hasUnsavedChanges = false;
      this.updateSaveButton();
      this.updateActionButtons();

      showNotification('success', `País ${this.selectedCountry.Pais} carregado`);
    } catch (error) {
      Logger.error('Erro ao carregar dados do país:', error);
      showNotification('error', 'Erro ao carregar dados do país');
      this.showLoading(false);
    }
  }

  showLoading(loading) {
    if (!this.elements.editorLoading) return;

    if (loading) {
      this.elements.editorLoading.style.display = 'block';
      Object.values(this.elements.sections).forEach(section => {
        if (section) section.innerHTML = '';
      });
    } else {
      this.elements.editorLoading.style.display = 'none';
    }
  }

  clearEditor() {
    this.selectedCountry = null;
    this.originalData = null;
    this.fieldGetters.clear();
    this.hasUnsavedChanges = false;
    this.updateSaveButton();
    this.updateActionButtons();

    Object.values(this.elements.sections).forEach(section => {
      if (section) section.innerHTML = '';
    });

    this.showLoading(true);
  }

  updateActionButtons() {
    const hasCountry = this.selectedCountry !== null;

    if (this.elements.btnDelete) {
      this.elements.btnDelete.disabled = !hasCountry;
    }

    if (this.elements.btnSplit) {
      this.elements.btnSplit.disabled = !hasCountry;
    }
  }

  renderAllSections() {
    this.fieldGetters.clear();

    Object.keys(this.fieldSchema).forEach(sectionKey => {
      this.renderSection(sectionKey);
    });
  }

  renderSection(sectionKey) {
    const schema = this.fieldSchema[sectionKey];
    const container = this.elements.sections[sectionKey];

    if (!container || !schema) return;

    container.innerHTML = '';

    schema.fields.forEach(fieldDef => {
      const fieldElement = this.createFieldElement(fieldDef);
      if (fieldElement) {
        container.appendChild(fieldElement.wrapper);
        if (fieldElement.getter) {
          this.fieldGetters.set(fieldDef.key, fieldElement.getter);
        }
      }
    });
  }

  createFieldElement(fieldDef) {
    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-1';

    const label = document.createElement('label');
    label.className = 'block text-xs font-medium text-slate-400';
    label.textContent = fieldDef.label;
    wrapper.appendChild(label);

    let input;
    let getter;

    // Obter valor atual
    const currentValue = this.getNestedValue(this.selectedCountry, fieldDef.key);

    switch (fieldDef.type) {
      case 'calculated':
        input = this.createCalculatedField(fieldDef, currentValue);
        getter = () => this.calculateFieldValue(fieldDef);
        break;

      case 'readonly':
        input = this.createReadOnlyField(fieldDef, currentValue);
        getter = () => currentValue;
        break;

      case 'select':
        input = this.createSelectField(fieldDef, currentValue);
        getter = () => input.value;
        break;

      case 'checkbox':
        input = this.createCheckboxField(fieldDef, currentValue);
        // input é um wrapper, precisamos buscar o checkbox dentro dele
        const checkbox = input.querySelector('input[type="checkbox"]');
        getter = () => checkbox.checked;
        break;

      case 'number':
        input = this.createNumberField(fieldDef, currentValue);
        getter = () => {
          const val = parseFloat(input.value);
          return isNaN(val) ? 0 : val;
        };
        break;

      case 'text':
      default:
        input = this.createTextField(fieldDef, currentValue);
        getter = () => input.value || '';
        break;
    }

    if (fieldDef.description) {
      const description = document.createElement('p');
      description.className = 'text-xs text-slate-500 italic mt-1';
      description.textContent = fieldDef.description;
      wrapper.appendChild(description);
    }

    wrapper.appendChild(input);

    return { wrapper, getter };
  }

  createTextField(fieldDef, value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value ?? '';
    input.className = 'w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all';
    input.dataset.fieldKey = fieldDef.key;
    return input;
  }

  createNumberField(fieldDef, value) {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = value ?? 0;
    input.className = 'w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all';
    input.dataset.fieldKey = fieldDef.key;

    if (fieldDef.min !== undefined) input.min = fieldDef.min;
    if (fieldDef.max !== undefined) input.max = fieldDef.max;
    if (fieldDef.step !== undefined) input.step = fieldDef.step;

    return input;
  }

  createSelectField(fieldDef, value) {
    const select = document.createElement('select');
    select.className = 'w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all';
    select.dataset.fieldKey = fieldDef.key;

    (fieldDef.options || []).forEach(option => {
      const opt = document.createElement('option');
      opt.value = option;
      opt.textContent = option;
      if (value === option) opt.selected = true;
      select.appendChild(opt);
    });

    return select;
  }

  createCheckboxField(fieldDef, value) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-2';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = value === true;
    input.className = 'rounded border-bg-ring/70 bg-bg text-brand-500 focus:ring-brand-500/30 focus:ring-offset-0 focus:ring-2 transition-all';
    input.dataset.fieldKey = fieldDef.key;

    const label = document.createElement('span');
    label.className = 'text-sm text-slate-300';
    label.textContent = value ? 'Sim' : 'Não';

    input.addEventListener('change', () => {
      label.textContent = input.checked ? 'Sim' : 'Não';
    });

    wrapper.appendChild(input);
    wrapper.appendChild(label);

    return wrapper;
  }

  createCalculatedField(fieldDef, value) {
    const div = document.createElement('div');
    div.className = 'w-full rounded-lg bg-slate-700/50 border border-slate-600 p-2 text-sm text-slate-300 italic';

    if (fieldDef.key === 'PIB') {
      const populacao = parseFloat(this.selectedCountry.Populacao) || 0;
      const pibPerCapita = parseFloat(this.selectedCountry.PIBPerCapita) || 0;
      const pibTotal = calculatePIBTotal(populacao, pibPerCapita);
      div.textContent = `${formatCurrency(pibTotal)} (calculado automaticamente)`;
      div.dataset.calculatedValue = pibTotal;
    } else {
      div.textContent = 'Campo calculado';
      div.dataset.calculatedValue = value ?? 0;
    }

    div.dataset.fieldKey = fieldDef.key;
    return div;
  }

  createReadOnlyField(fieldDef, value) {
    const div = document.createElement('div');
    div.className = 'w-full rounded-lg bg-slate-700/30 border border-slate-600/50 p-2 text-sm text-slate-400';

    let displayValue = 'Não editável aqui';
    if (typeof value === 'object' && value !== null) {
      displayValue = `${Object.keys(value).length} itens (use ferramenta específica)`;
    }

    div.textContent = displayValue;
    div.dataset.fieldKey = fieldDef.key;
    return div;
  }

  calculateFieldValue(fieldDef) {
    if (fieldDef.key === 'PIB') {
      const populacao = this.fieldGetters.get('Populacao')?.() || 0;
      const pibPerCapita = this.fieldGetters.get('PIBPerCapita')?.() || 0;
      return calculatePIBTotal(populacao, pibPerCapita);
    }
    return 0;
  }

  getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;

    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
    }

    return value;
  }

  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = obj;

    for (const key of keys) {
      if (!(key in target) || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }

    target[lastKey] = value;
  }

  markAsChanged() {
    if (!this.hasUnsavedChanges) {
      this.hasUnsavedChanges = true;
      this.updateSaveButton();
    }
  }

  updateSaveButton() {
    if (!this.elements.btnSave) return;

    if (this.hasUnsavedChanges && this.selectedCountry) {
      this.elements.btnSave.disabled = false;
      this.elements.btnSave.classList.add('shadow-lg', 'shadow-emerald-500/20');
    } else {
      this.elements.btnSave.disabled = true;
      this.elements.btnSave.classList.remove('shadow-lg', 'shadow-emerald-500/20');
    }
  }

  async saveAllChanges() {
    if (!this.selectedCountry) {
      showNotification('error', 'Nenhum país selecionado');
      return;
    }

    try {
      this.elements.btnSave.disabled = true;
      this.elements.btnSave.textContent = '💾 Salvando...';

      const updateData = {};

      // Coletar todos os valores dos campos, exceto os readonly e calculated
      this.fieldGetters.forEach((getter, key) => {
        // Pular campos readonly e calculated (eles não devem ser salvos)
        const fieldDef = this.findFieldDefinition(key);
        if (fieldDef && (fieldDef.type === 'readonly' || fieldDef.type === 'calculated')) {
          return; // Skip
        }

        const value = getter();

        // Pular valores undefined
        if (value === undefined) {
          return;
        }

        this.setNestedValue(updateData, key, value);
      });

      // Recalcular PIB se necessário
      if (updateData.PIBPerCapita !== undefined && updateData.Populacao !== undefined) {
        updateData.PIB = calculatePIBTotal(updateData.Populacao, updateData.PIBPerCapita);
      }

      // Limpar campos undefined recursivamente
      this.cleanUndefinedFields(updateData);

      // Salvar no Firestore
      await db.collection('paises').doc(this.selectedCountry.id).update(updateData);

      // Atualizar dados locais
      Object.assign(this.selectedCountry, updateData);
      this.originalData = JSON.parse(JSON.stringify(this.selectedCountry));
      this.hasUnsavedChanges = false;
      this.updateSaveButton();

      showNotification('success', `✅ ${this.selectedCountry.Pais} salvo com sucesso!`);
      Logger.info('País atualizado:', this.selectedCountry.id, updateData);

    } catch (error) {
      Logger.error('Erro ao salvar país:', error);
      showNotification('error', `Erro ao salvar: ${error.message}`);
    } finally {
      this.elements.btnSave.disabled = false;
      this.elements.btnSave.textContent = '💾 Salvar Alterações';
    }
  }

  findFieldDefinition(key) {
    for (const sectionKey in this.fieldSchema) {
      const section = this.fieldSchema[sectionKey];
      const field = section.fields.find(f => f.key === key);
      if (field) return field;
    }
    return null;
  }

  cleanUndefinedFields(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] === undefined) {
        delete obj[key];
      } else if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        this.cleanUndefinedFields(obj[key]);
        // Se o objeto ficar vazio após limpar, remover ele também
        if (Object.keys(obj[key]).length === 0) {
          delete obj[key];
        }
      }
    });
  }

  // ========== CRIAR NOVO PAÍS ==========
  async createNewCountry() {
    const countryName = prompt('🌍 Nome do novo país:');
    if (!countryName || !countryName.trim()) {
      return;
    }

    const countryId = `pais_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const defaultCountry = {
      Pais: countryName.trim(),
      Ativo: true,
      Player: '',
      ModeloPolitico: 'República',
      Populacao: 10000000,
      PIBPerCapita: 100,
      PIB: 1000000000,
      Estabilidade: 50,
      Burocracia: 50,
      Urbanizacao: 30,
      Tecnologia: 20,
      TecnologiaCivil: 20,
      Visibilidade: 'Público',
      IndustrialEfficiency: 30,
      PoliticaIndustrial: 'balanceada',

      // Recursos
      Graos: 0,
      Combustivel: 50,
      Metais: 0,
      Carvao: 0,
      Uranio: 0,
      BensDeConsumo: 0,

      // Potenciais
      PotencialAgricola: 5,
      PotencialCombustivel: 2,
      PotencialMetais: 3,
      PotencialCarvao: 3,
      PotencialUranio: 1,
      PotencialHidreletrico: 5,

      // Militar
      WarPower: 0,
      CounterIntelligence: 0,
      Exercito: 0,
      Aeronautica: 0,
      Marinha: 0,
      Veiculos: 0,

      // Energia
      Energia: {
        capacidade: 100,
        demanda: 100
      },

      DataCriacao: new Date()
    };

    try {
      await db.collection('paises').doc(countryId).set(defaultCountry);
      showNotification('success', `País "${countryName}" criado com sucesso!`);
      await this.loadCountries();
      this.elements.selectCountry.value = countryId;
      await this.onCountryChanged();
    } catch (error) {
      Logger.error('Erro ao criar país:', error);
      showNotification('error', 'Erro ao criar país: ' + error.message);
    }
  }

  // ========== DELETAR PAÍS ==========
  async deleteCountry() {
    if (!this.selectedCountry) {
      showNotification('warning', 'Selecione um país primeiro');
      return;
    }

    const countryName = this.selectedCountry.Pais;

    // Confirmação dupla
    const confirm1 = confirm(`⚠️ ATENÇÃO: Você está prestes a DELETAR o país "${countryName}".\n\nEsta ação é IRREVERSÍVEL!\n\nDeseja continuar?`);
    if (!confirm1) return;

    const confirm2 = prompt(`Digite o nome do país "${countryName}" para confirmar a exclusão:`);
    if (confirm2 !== countryName) {
      showNotification('warning', 'Nome não corresponde. Operação cancelada.');
      return;
    }

    try {
      const countryId = this.selectedCountry.id;
      await db.collection('paises').doc(countryId).delete();

      showNotification('success', `País "${countryName}" deletado com sucesso`);

      this.selectedCountry = null;
      this.originalData = null;
      await this.loadCountries();
      this.hideEditor();
    } catch (error) {
      Logger.error('Erro ao deletar país:', error);
      showNotification('error', 'Erro ao deletar país: ' + error.message);
    }
  }

  // ========== DIVIDIR PAÍS ==========
  async splitCountry() {
    if (!this.selectedCountry) {
      showNotification('warning', 'Selecione um país primeiro');
      return;
    }

    const originalName = this.selectedCountry.Pais;

    // Perguntar quantos países criar
    const numCountries = parseInt(prompt(`🗺️ Dividir "${originalName}"\n\nEm quantos países deseja dividir? (2-10):`, '2'));

    if (!numCountries || numCountries < 2 || numCountries > 10) {
      showNotification('warning', 'Número inválido. Escolha entre 2 e 10 países.');
      return;
    }

    const newCountries = [];
    let totalPercentage = 0;

    // Coletar nomes e percentuais
    for (let i = 0; i < numCountries; i++) {
      const name = prompt(`Nome do país ${i + 1}/${numCountries}:`, `${originalName} ${i + 1}`);
      if (!name) {
        showNotification('warning', 'Operação cancelada');
        return;
      }

      const defaultPercent = Math.round((100 - totalPercentage) / (numCountries - i));
      const percent = parseFloat(prompt(`Percentual de recursos para "${name}" (${100 - totalPercentage}% restante):`, defaultPercent));

      if (!percent || percent <= 0 || percent > 100 - totalPercentage) {
        showNotification('warning', 'Percentual inválido');
        return;
      }

      newCountries.push({ name, percent: percent / 100 });
      totalPercentage += percent;
    }

    // Confirmar
    const summary = newCountries.map(c => `  • ${c.name}: ${(c.percent * 100).toFixed(1)}%`).join('\n');
    if (!confirm(`Confirma divisão de "${originalName}"?\n\n${summary}`)) {
      return;
    }

    try {
      // Criar novos países
      for (const newCountry of newCountries) {
        const countryId = `pais_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const countryData = {
          ...this.selectedCountry,
          id: countryId,
          Pais: newCountry.name,
          PIB: Math.round(this.selectedCountry.PIB * newCountry.percent),
          Populacao: Math.round(this.selectedCountry.Populacao * newCountry.percent),
          Graos: Math.round((this.selectedCountry.Graos || 0) * newCountry.percent),
          Combustivel: Math.round((this.selectedCountry.Combustivel || 0) * newCountry.percent),
          Metais: Math.round((this.selectedCountry.Metais || 0) * newCountry.percent),
          Carvao: Math.round((this.selectedCountry.Carvao || 0) * newCountry.percent),
          Uranio: Math.round((this.selectedCountry.Uranio || 0) * newCountry.percent),
          BensDeConsumo: Math.round((this.selectedCountry.BensDeConsumo || 0) * newCountry.percent),
          Player: null,
          DataCriacao: new Date()
        };

        delete countryData.DataVinculacao;

        await db.collection('paises').doc(countryId).set(countryData);
      }

      // Deletar país original
      await db.collection('paises').doc(this.selectedCountry.id).delete();

      showNotification('success', `País "${originalName}" dividido em ${numCountries} países com sucesso!`);

      await this.loadCountries();
      this.selectedCountry = null;
      this.hideEditor();
    } catch (error) {
      Logger.error('Erro ao dividir país:', error);
      showNotification('error', 'Erro ao dividir país: ' + error.message);
    }
  }
}

// Instância global
let editorInstance = null;

export async function initAdvancedCountryEditor() {
  if (!editorInstance) {
    editorInstance = new AdvancedCountryEditor();
    await editorInstance.initialize();
  }
  return editorInstance;
}
