/**
 * Gerenciador de Equipamentos Genéricos
 * Permite narradores adicionarem equipamentos iniciais ao inventário dos países
 */

import { db } from '../services/firebase.js';
import { GENERIC_EQUIPMENT, getEquipment, getCategoriesByType } from '../data/genericEquipment.js';
import { formatCurrency } from '../utils.js';

export class GenericEquipmentManager {
  constructor() {
    this.selectedCountry = null;
    this.selectedType = 'vehicles'; // 'vehicles', 'aircraft', 'naval'
    this.countries = [];
    this.currentInventory = {};
  }

  async initialize() {
    console.log('⚙️ Inicializando Gerenciador de Equipamentos Genéricos...');
    await this.loadCountries();
    this.attachButtonListener();
  }

  async loadCountries() {
    try {
      const snapshot = await db.collection('paises').orderBy('Pais').get();
      this.countries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Erro ao carregar países:', error);
      this.countries = [];
    }
  }

  attachButtonListener() {
    const button = document.getElementById('open-generic-equipment-manager');
    if (button) {
      button.addEventListener('click', () => {
        this.openModal();
      });
      console.log('✅ Gerenciador de Equipamentos Genéricos pronto (botão conectado)');
    } else {
      console.warn('⚠️ Botão open-generic-equipment-manager não encontrado, tentando novamente...');
      setTimeout(() => this.attachButtonListener(), 500);
    }
  }

  openModal() {
    this.renderModal();
  }

  renderModal() {
    // Remover modal existente se houver
    const existing = document.getElementById('generic-equipment-modal');
    if (existing) {
      existing.remove();
    }

    // Criar modal
    const modal = document.createElement('div');
    modal.id = 'generic-equipment-modal';
    modal.innerHTML = this.getModalHTML();

    document.body.appendChild(modal);

    this.setupEventListeners();
  }

  closeModal() {
    const modal = document.getElementById('generic-equipment-modal');
    if (modal) {
      modal.remove();
    }
  }

  getModalHTML() {
    return `
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" id="generic-equipment-backdrop">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden m-4 flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h3 class="text-2xl font-bold text-purple-100 flex items-center gap-2">
                ⚙️ Equipamentos Genéricos
              </h3>
              <p class="text-sm text-slate-400 mt-1">
                Adicione equipamentos padrão ao inventário dos países sem usar os criadores
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button id="refresh-generic-equipment" class="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold transition">
                🔄 Atualizar
              </button>
              <button id="close-generic-equipment-modal" class="text-slate-400 hover:text-slate-200 text-2xl px-2">×</button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">

        <!-- Seletor de País -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-slate-200 mb-2">
            🌍 Selecionar País
          </label>
          <select id="generic-country-select" class="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100">
            <option value="">-- Escolha um país --</option>
            ${this.countries.map(c => `
              <option value="${c.id}">${c.Pais}</option>
            `).join('')}
          </select>
        </div>

            <div id="generic-equipment-content">
              ${this.getContentHTML()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  getContentHTML() {
    if (!this.selectedCountry) {
      return `
        <div class="text-center py-12 border border-dashed border-slate-700 rounded-xl">
          <span class="text-6xl mb-4 block">🌍</span>
          <p class="text-slate-400">Selecione um país para começar</p>
        </div>
      `;
    }

    const country = this.countries.find(c => c.id === this.selectedCountry);

    return `
      <div class="space-y-6">
        <!-- Header do País -->
        <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <h4 class="text-xl font-bold text-slate-100 text-center">${country?.Pais || 'País'}</h4>
        </div>

        <!-- Tabs de Tipo -->
        <div class="flex gap-2 border-b border-slate-700">
          <button class="generic-type-tab px-4 py-2 text-sm font-semibold transition border-b-2 ${this.selectedType === 'vehicles' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}" data-type="vehicles">
            🚗 Veículos
          </button>
          <button class="generic-type-tab px-4 py-2 text-sm font-semibold transition border-b-2 ${this.selectedType === 'aircraft' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}" data-type="aircraft">
            ✈️ Aviões
          </button>
          <button class="generic-type-tab px-4 py-2 text-sm font-semibold transition border-b-2 ${this.selectedType === 'naval' ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}" data-type="naval">
            ⚓ Navios
          </button>
        </div>

        <!-- Grid de Equipamentos -->
        <div>
          <h5 class="text-sm font-semibold text-slate-200 mb-3">📦 Equipamentos Disponíveis</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${this.getEquipmentCardsHTML()}
          </div>
        </div>

        <!-- Inventário Atual -->
        <div>
          <h5 class="text-sm font-semibold text-slate-200 mb-3">📋 Inventário Atual (Genéricos)</h5>
          <div id="current-generic-inventory">
            ${this.getCurrentInventoryHTML()}
          </div>
        </div>
      </div>
    `;
  }

  getEquipmentCardsHTML() {
    const equipment = GENERIC_EQUIPMENT[this.selectedType] || {};
    const categories = Object.keys(equipment);

    if (categories.length === 0) {
      return '<p class="text-slate-400 col-span-full text-center py-8">Nenhum equipamento disponível</p>';
    }

    return categories.map(category => {
      const item = equipment[category];

      return `
        <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-3xl">${item.icon}</span>
            <div class="flex-1">
              <h6 class="font-semibold text-slate-100">${item.name}</h6>
            </div>
          </div>

          <!-- Form para adicionar -->
          <div class="flex gap-2">
            <input
              type="number"
              min="1"
              value="10"
              placeholder="Qtd"
              class="w-24 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 text-sm"
              id="qty-${category}"
            >
            <button
              class="add-generic-equipment flex-1 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-semibold text-sm transition"
              data-category="${category}"
              data-type="${this.selectedType}"
            >
              + Adicionar
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  getCurrentInventoryHTML() {
    const items = Object.entries(this.currentInventory);

    if (items.length === 0) {
      return `
        <div class="text-center py-8 border border-dashed border-slate-700 rounded-xl">
          <span class="text-4xl mb-3 block">📦</span>
          <p class="text-slate-400">Nenhum equipamento genérico adicionado ainda</p>
        </div>
      `;
    }

    return `
      <div class="space-y-2">
        ${items.map(([key, item]) => `
          <div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${item.icon}</span>
              <p class="font-semibold text-slate-100">${item.name}</p>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-lg font-bold text-purple-400">${item.quantity}x</p>
              <button
                class="edit-generic-qty px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition"
                data-item-id="${key}"
              >
                ✏️
              </button>
              <button
                class="remove-generic-equipment px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition"
                data-item-id="${key}"
              >
                🗑️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  setupEventListeners() {
    // Fechar modal
    const closeBtn = document.getElementById('close-generic-equipment-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Fechar ao clicar no backdrop
    const backdrop = document.getElementById('generic-equipment-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeModal();
        }
      });
    }

    // Seletor de país
    const countrySelect = document.getElementById('generic-country-select');
    if (countrySelect) {
      countrySelect.addEventListener('change', (e) => {
        this.selectedCountry = e.target.value;
        if (this.selectedCountry) {
          this.loadCountryInventory(this.selectedCountry);
        } else {
          this.currentInventory = {};
          this.renderContent();
        }
      });
    }

    // Tabs de tipo
    document.addEventListener('click', (e) => {
      if (e.target.matches('.generic-type-tab')) {
        this.selectedType = e.target.dataset.type;
        this.renderContent();
      }

      // Adicionar equipamento
      if (e.target.matches('.add-generic-equipment')) {
        const category = e.target.dataset.category;
        const type = e.target.dataset.type;
        const qtyInput = document.getElementById(`qty-${category}`);
        const quantity = parseInt(qtyInput?.value || 10);

        if (quantity > 0) {
          this.addEquipment(type, category, quantity);
        }
      }

      // Editar quantidade
      if (e.target.matches('.edit-generic-qty')) {
        const itemId = e.target.dataset.itemId;
        this.editQuantity(itemId);
      }

      // Remover equipamento
      if (e.target.matches('.remove-generic-equipment')) {
        const itemId = e.target.dataset.itemId;
        this.removeEquipment(itemId);
      }

      // Refresh
      if (e.target.id === 'refresh-generic-equipment') {
        if (this.selectedCountry) {
          this.loadCountryInventory(this.selectedCountry);
        }
      }
    });
  }

  async loadCountryInventory(countryId) {
    try {
      const snapshot = await db.collection('inventories')
        .doc(countryId)
        .collection('items')
        .where('isGeneric', '==', true)
        .get();

      this.currentInventory = {};
      snapshot.docs.forEach(doc => {
        this.currentInventory[doc.id] = {
          id: doc.id,
          ...doc.data()
        };
      });

      this.renderContent();
    } catch (error) {
      console.error('Erro ao carregar inventário:', error);
      alert('Erro ao carregar inventário: ' + error.message);
    }
  }

  async addEquipment(type, category, quantity) {
    if (!this.selectedCountry) {
      alert('Selecione um país primeiro!');
      return;
    }

    const equipment = getEquipment(type, category);
    if (!equipment) {
      alert('Equipamento não encontrado!');
      return;
    }

    try {
      const itemData = {
        name: equipment.name,
        category: category,
        type: type,
        quantity: quantity,
        isGeneric: true,
        stats: equipment.stats,
        icon: equipment.icon,
        description: equipment.description,
        year: equipment.year,
        addedBy: window.currentUser?.uid || 'narrator',
        addedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('inventories')
        .doc(this.selectedCountry)
        .collection('items')
        .add(itemData);

      alert(`✅ ${quantity}x ${equipment.name} adicionado ao inventário!`);

      // Recarregar inventário
      await this.loadCountryInventory(this.selectedCountry);
    } catch (error) {
      console.error('Erro ao adicionar equipamento:', error);
      alert('Erro ao adicionar equipamento: ' + error.message);
    }
  }

  async editQuantity(itemId) {
    const item = this.currentInventory[itemId];
    if (!item) return;

    const newQty = prompt(`Nova quantidade para ${item.name}:`, item.quantity);
    if (newQty === null) return;

    const quantity = parseInt(newQty);
    if (isNaN(quantity) || quantity < 0) {
      alert('Quantidade inválida!');
      return;
    }

    try {
      if (quantity === 0) {
        // Se for 0, remover
        await this.removeEquipment(itemId);
        return;
      }

      await db.collection('inventories')
        .doc(this.selectedCountry)
        .collection('items')
        .doc(itemId)
        .update({
          quantity: quantity,
          updatedAt: new Date().toISOString()
        });

      alert(`✅ Quantidade atualizada para ${quantity}`);
      await this.loadCountryInventory(this.selectedCountry);
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      alert('Erro ao atualizar: ' + error.message);
    }
  }

  async removeEquipment(itemId) {
    const item = this.currentInventory[itemId];
    if (!item) return;

    if (!confirm(`Remover ${item.name} do inventário?`)) return;

    try {
      await db.collection('inventories')
        .doc(this.selectedCountry)
        .collection('items')
        .doc(itemId)
        .delete();

      alert(`✅ ${item.name} removido do inventário!`);
      await this.loadCountryInventory(this.selectedCountry);
    } catch (error) {
      console.error('Erro ao remover equipamento:', error);
      alert('Erro ao remover: ' + error.message);
    }
  }

  renderContent() {
    const content = document.getElementById('generic-equipment-content');
    if (content) {
      content.innerHTML = this.getContentHTML();
    }
  }
}

export default GenericEquipmentManager;
