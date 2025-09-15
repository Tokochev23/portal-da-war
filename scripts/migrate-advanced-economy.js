// Em: scripts/migrate-advanced-economy.js

import { db } from '../js/services/firebase.js'; // CAMINHO CORRIGIDO
import { showNotification, showConfirmBox } from '../js/utils.js';

// A função que fará a mágica
export async function runAdvancedEconomyMigration() {
  try {
    // 1. Pedir confirmação para segurança
    const confirmed = await showConfirmBox(
      'Confirmar Migração de Dados',
      'Esta ação irá verificar TODOS os países e adicionar os novos campos de economia (Carvão, Energia, etc.) com valores padrão. Execute esta operação APENAS UMA VEZ. Deseja continuar?',
      'Sim, migrar agora',
      'Cancelar'
    );

    if (!confirmed) {
      showNotification('info', 'Migração cancelada pelo usuário.');
      return;
    }

    showNotification('info', 'Iniciando migração... Isso pode levar um momento.');

    // 2. Buscar todos os países
    const querySnapshot = await db.collection('paises').get();
    const batch = db.batch();
    let migratedCount = 0;

    // 3. Verificar cada país e adicionar campos se necessário
    querySnapshot.forEach(doc => {
      const pais = doc.data();
      const docRef = doc.ref;
      const updates = {};

      if (pais.PotencialCarvao === undefined) updates.PotencialCarvao = 3;
      if (pais.CarvaoSaldo === undefined) updates.CarvaoSaldo = 0;
      if (pais.PoliticaIndustrial === undefined) updates.PoliticaIndustrial = 'combustivel';
      if (pais.Energia === undefined) updates.Energia = { capacidade: 100, demanda: 100 };
      if (pais.IndustrialEfficiency === undefined) updates.IndustrialEfficiency = 30;
      if (pais.BensDeConsumo === undefined) updates.BensDeConsumo = 50;

      // Novos campos para sistema de energia
      if (pais.PotencialHidreletrico === undefined) updates.PotencialHidreletrico = 2;
      if (pais.Uranio === undefined) updates.Uranio = 0;
      if (pais.EnergiaCapacidade === undefined) updates.EnergiaCapacidade = 100;
      if (pais.power_plants === undefined) updates.power_plants = [];

      if (Object.keys(updates).length > 0) {
        migratedCount++;
        batch.update(docRef, updates);
      }
    });

    // 4. Executar todas as atualizações de uma vez
    if (migratedCount > 0) {
      await batch.commit();
      showNotification('success', `${migratedCount} países foram migrados com sucesso!`);
    } else {
      showNotification('info', 'Nenhum país precisava de migração. Tudo já está atualizado.');
    }

  } catch (error) {
    console.error("Erro durante a migração:", error);
    showNotification('error', `Erro na migração: ${error.message}`);
  }
}