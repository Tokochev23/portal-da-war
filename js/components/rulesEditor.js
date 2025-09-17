import { Logger, showNotification } from '../utils.js';
import { evaluateFormula } from '../systems/formulaEvaluator.js';
import { auth, getCustomRules, saveCustomRules } from '../services/firebase.js';

const editorHTML = `
<div id="formula-editor-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden items-center justify-center">
  <div class="bg-bg-soft rounded-xl border border-bg-ring/70 w-full max-w-3xl shadow-2xl">
    <div class="p-4 border-b border-bg-ring/50 flex justify-between items-center">
      <h3 id="editor-title" class="text-lg font-semibold text-slate-200">Editar Fórmula</h3>
      <button id="btn-close-editor" class="text-slate-400 hover:text-white text-2xl">&times;</button>
    </div>
    <div class="p-6 space-y-6">
      <div>
        <p class="text-sm text-slate-400 mb-2">Fórmula:</p>
        <div id="formula-display" class="w-full rounded-lg bg-bg p-4 min-h-[5rem] text-slate-200 border border-bg-ring font-mono text-xl"></div>
      </div>
      <div>
        <p class="text-sm text-slate-400 mb-2">Construtor:</p>
        <div class="flex flex-wrap gap-3">
          <button id="btn-add-indicator" class="btn-builder bg-sky-600 hover:bg-sky-500">Indicador</button>
          <button id="btn-add-number" class="btn-builder bg-amber-600 hover:bg-amber-500">Número</button>
          <button class="btn-builder btn-op" data-token="(">(</button>
          <button class="btn-builder btn-op" data-token=")">)</button>
          <button class="btn-builder btn-op" data-token="+">+</button>
          <button class="btn-builder btn-op" data-token="-">-</button>
          <button class="btn-builder btn-op" data-token="*">*</button>
          <button class="btn-builder btn-op" data-token="/">/</button>
          <button id="btn-undo" class="btn-builder bg-slate-600 hover:bg-slate-500">Desfazer</button>
          <button id="btn-clear" class="btn-builder bg-red-700 hover:bg-red-600">Limpar</button>
        </div>
      </div>
      <div class="border-t border-bg-ring/50 pt-6">
        <p class="text-sm text-slate-400 mb-2">Área de Teste</p>
        <div class="grid grid-cols-3 gap-4 items-center">
          <select id="test-country-select" class="col-span-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm"></select>
          <button id="btn-test-formula" class="col-span-1 rounded-lg bg-purple-600 text-white font-semibold px-4 py-2 hover:bg-purple-500">Testar</button>
          <div id="test-result-output" class="col-span-1 rounded-lg bg-bg p-2 text-center text-lg font-bold border border-bg-ring">--</div>
        </div>
      </div>
    </div>
    <div class="p-4 bg-bg/30 border-t border-bg-ring/50 flex justify-end gap-4">
      <button id="btn-cancel-editor" class="px-5 py-2 rounded-lg border border-bg-ring/70 text-slate-300 hover:bg-white/5">Cancelar</button>
      <button id="btn-save-formula" class="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500">Salvar Fórmula</button>
    </div>
  </div>
</div>

<div id="indicator-selector-modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden items-center justify-center">
  <div class="bg-bg-soft rounded-xl border border-bg-ring/70 w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col">
    <div class="p-4 border-b border-bg-ring/50 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-slate-200">Selecionar Indicador</h3>
      <button id="btn-close-indicator-selector" class="text-slate-400 hover:text-white text-2xl">&times;</button>
    </div>
    <div id="indicator-list" class="p-4 overflow-y-auto"></div>
  </div>
</div>
`;

class RulesEditorManager {
    constructor() {
        this.state = {
            activeRule: null,
            formulaTokens: [],
        };
        this.init();
    }

    async init() {
        document.body.insertAdjacentHTML('beforeend', editorHTML);

        this.dom = {
            modal: document.getElementById('formula-editor-modal'),
            title: document.getElementById('editor-title'),
            display: document.getElementById('formula-display'),
            saveBtn: document.getElementById('btn-save-formula'),
            cancelBtn: document.getElementById('btn-cancel-editor'),
            closeBtn: document.getElementById('btn-close-editor'),
            undoBtn: document.getElementById('btn-undo'),
            clearBtn: document.getElementById('btn-clear'),
            addNumberBtn: document.getElementById('btn-add-number'),
            addIndicatorBtn: document.getElementById('btn-add-indicator'),
            testCountrySelect: document.getElementById('test-country-select'),
            testFormulaBtn: document.getElementById('btn-test-formula'),
            testResultOutput: document.getElementById('test-result-output'),
            indicatorModal: document.getElementById('indicator-selector-modal'),
            indicatorList: document.getElementById('indicator-list'),
            closeIndicatorBtn: document.getElementById('btn-close-indicator-selector'),
        };

        this.addEventListeners();
        await this.loadAndApplyCustomRules();
        Logger.info('Editor de Regras inicializado e regras carregadas.');
    }

    addEventListeners() {
        document.body.addEventListener('click', (e) => {
            if (e.target.matches('.btn-edit-rule')) {
                const ruleId = e.target.dataset.rule;
                const currentFormula = document.getElementById(`rule-formula-${ruleId}`).textContent;
                this.openEditor(ruleId, currentFormula);
            } else if (e.target.matches('.btn-reset-rule')) {
                const ruleId = e.target.dataset.rule;
                this.resetFormula(ruleId);
            }
        });

        document.querySelectorAll('.btn-op').forEach(btn => {
            btn.addEventListener('click', () => this.addToken(btn.dataset.token));
        });
        
        this.dom.addNumberBtn.addEventListener('click', () => this.addNumber());
        this.dom.addIndicatorBtn.addEventListener('click', () => this.openIndicatorSelector());
        this.dom.undoBtn.addEventListener('click', () => this.undo());
        this.dom.clearBtn.addEventListener('click', () => this.clear());

        this.dom.cancelBtn.addEventListener('click', () => this.closeEditor());
        this.dom.closeBtn.addEventListener('click', () => this.closeEditor());
        this.dom.modal.addEventListener('click', (e) => {
            if (e.target.id === 'formula-editor-modal') this.closeEditor();
        });

        this.dom.closeIndicatorBtn.addEventListener('click', () => this.closeIndicatorSelector());
        this.dom.indicatorModal.addEventListener('click', (e) => {
            if (e.target.id === 'indicator-selector-modal') this.closeIndicatorSelector();
        });
        this.dom.indicatorList.addEventListener('click', (e) => {
            if (e.target.matches('.indicator-item')) {
                this.addToken(e.target.dataset.key);
                this.closeIndicatorSelector();
            }
        });

        this.dom.testFormulaBtn.addEventListener('click', () => this.runTest());
        this.dom.saveBtn.addEventListener('click', () => this.saveFormula());
    }

    openEditor(ruleId, currentFormula) {
        this.state.activeRule = ruleId;
        this.dom.title.textContent = `Editar Fórmula: ${ruleId.charAt(0).toUpperCase() + ruleId.slice(1)}`;
        this.state.formulaTokens = currentFormula.trim().split(' ').filter(t => t);
        this.updateDisplay();
        this.populateTestCountries();
        this.dom.modal.classList.remove('hidden');
        this.dom.modal.classList.add('flex');
    }

    closeEditor() {
        this.dom.modal.classList.add('hidden');
        this.dom.modal.classList.remove('flex');
        this.state.activeRule = null;
        this.state.formulaTokens = [];
        this.dom.testResultOutput.textContent = '--';
    }

    updateDisplay() {
        this.dom.display.textContent = this.state.formulaTokens.join(' ');
    }

    addToken(token) {
        this.state.formulaTokens.push(token);
        this.updateDisplay();
    }
    
    addNumber() {
        const num = prompt('Digite o número:');
        if (num !== null && !isNaN(parseFloat(num)) && isFinite(num)) {
            this.addToken(num);
        } else if (num !== null) {
            alert('Por favor, insira um número válido.');
        }
    }

    undo() {
        this.state.formulaTokens.pop();
        this.updateDisplay();
    }

    clear() {
        this.state.formulaTokens = [];
        this.updateDisplay();
    }

    openIndicatorSelector() {
        const catalog = window.narratorData?.getCatalog();
        if (!catalog) {
            Logger.error('Catálogo de indicadores não encontrado.');
            return;
        }

        let html = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">';
        for (const sectionKey in catalog) {
            const section = catalog[sectionKey];
            html += '<div>';
            html += `<h4 class="text-lg font-semibold text-brand-300 mb-2">${section.label}</h4>`;
            html += '<div class="space-y-1">';
            section.campos.forEach(field => {
                html += `<button class="indicator-item w-full text-left p-2 rounded-md bg-bg hover:bg-bg-ring" data-key="${field.key}">${field.label} <span class="text-xs text-slate-500">(${field.key})</span></button>`;
            });
            html += '</div></div>';
        }
        html += '</div>';

        this.dom.indicatorList.innerHTML = html;
        this.dom.indicatorModal.classList.remove('hidden');
        this.dom.indicatorModal.classList.add('flex');
    }

    closeIndicatorSelector() {
        this.dom.indicatorModal.classList.add('hidden');
        this.dom.indicatorModal.classList.remove('flex');
    }

    populateTestCountries() {
        const countries = window.narratorData?.getCountries();
        if (!countries) return;

        this.dom.testCountrySelect.innerHTML = countries
            .map(c => `<option value="${c.id}">${c.Pais || c.id}</option>`)
            .join('');
    }

    runTest() {
        const countryId = this.dom.testCountrySelect.value;
        const countries = window.narratorData?.getCountries();
        const countryData = countries?.find(c => c.id === countryId);

        if (!countryData) {
            this.dom.testResultOutput.textContent = 'Erro';
            Logger.error('País de teste não encontrado.');
            return;
        }

        const formulaString = this.state.formulaTokens.join(' ');
        const result = evaluateFormula(formulaString, countryData);

        if (result.success) {
            this.dom.testResultOutput.textContent = result.value.toLocaleString('pt-BR');
            this.dom.testResultOutput.classList.remove('text-red-400');
            this.dom.testResultOutput.classList.add('text-emerald-400');
        } else {
            this.dom.testResultOutput.textContent = 'Inválido';
            this.dom.testResultOutput.classList.remove('text-emerald-400');
            this.dom.testResultOutput.classList.add('text-red-400');
            Logger.error('Erro no teste da fórmula:', result.error);
        }
    }

    async saveFormula() {
        const formulaString = this.state.formulaTokens.join(' ');
        const ruleId = this.state.activeRule;
        const user = auth.currentUser;

        if (!ruleId || !user) {
            Logger.error('Não foi possível salvar: regra ou usuário não identificado.');
            return;
        }

        // Validação simples
        if (formulaString.trim() === '') {
            showNotification('error', 'A fórmula não pode estar vazia.');
            return;
        }

        this.dom.saveBtn.disabled = true;
        this.dom.saveBtn.textContent = 'Salvando...';

        try {
            const allRules = await getCustomRules();
            allRules[ruleId] = formulaString;
            const result = await saveCustomRules(allRules, user.uid);

            if (result.success) {
                const displayElement = document.getElementById(`rule-formula-${ruleId}`);
                displayElement.textContent = formulaString;
                displayElement.classList.add('text-cyan-300'); // Destaque para fórmula customizada
                this.closeEditor();
            }
        } finally {
            this.dom.saveBtn.disabled = false;
            this.dom.saveBtn.textContent = 'Salvar Fórmula';
        }
    }

    async resetFormula(ruleId) {
        if (!ruleId) return;
        if (!confirm(`Tem certeza que deseja restaurar a fórmula padrão para "${ruleId}"?`)) return;

        const user = auth.currentUser;
        if (!user) {
            Logger.error('Usuário não autenticado.');
            return;
        }

        try {
            const allRules = await getCustomRules();
            if (allRules[ruleId]) {
                delete allRules[ruleId];
                await saveCustomRules(allRules, user.uid);

                const displayElement = document.getElementById(`rule-formula-${ruleId}`);
                const defaultFormula = displayElement.dataset.defaultFormula;
                displayElement.textContent = defaultFormula;
                displayElement.classList.remove('text-cyan-300');
                showNotification('success', `Fórmula para ${ruleId} foi restaurada para o padrão.`);
            } else {
                showNotification('info', 'Esta regra já está usando a fórmula padrão.');
            }
        } catch (err) {
            Logger.error('Erro ao restaurar fórmula:', err);
        }
    }

    async loadAndApplyCustomRules() {
        const allRules = await getCustomRules();
        for (const ruleId in allRules) {
            const displayElement = document.getElementById(`rule-formula-${ruleId}`);
            if (displayElement) {
                const formula = allRules[ruleId];
                if(typeof formula === 'string') { // Garante que não é um campo como 'ultimaAtualizacao'
                    displayElement.textContent = formula;
                    displayElement.classList.add('text-cyan-300');
                }
            }
        }
    }
}

export const rulesEditorManager = new RulesEditorManager();
