/**
 * @file migrate-national-laws.js
 * @description Script para migrar a base de dados de países, adicionando os campos necessários para o novo sistema de Leis Nacionais e Exaustão de Guerra.
 */

import { db } from '../js/config/firebase-config.js';

/**
 * Valores padrão para os novos campos
 */
const DEFAULT_VALUES = {
  mobilizationLaw: 'volunteer_only',      // Lei de conscrição inicial (Apenas Voluntários)
  economicLaw: 'civilian_economy',        // Lei econômica inicial (Economia Civil)
  warExhaustion: 0,                       // Sem exaustão inicial
  inWarWith: [],                          // Nenhuma guerra ativa
  lawChange: null                         // Nenhuma transição em andamento
};

/**
 * Função principal para executar a migração.
 */
async function migrateNationalLaws() {
  console.log('='.repeat(60));
  console.log('🔧 MIGRAÇÃO: Sistema de Leis Nacionais e Exaustão de Guerra');
  console.log('='.repeat(60));
  console.log('');

  try {
    // 1. Buscar todos os países
    const paisesSnapshot = await db.collection('paises').get();

    if (paisesSnapshot.empty) {
      console.log('⚠️  Nenhum país encontrado na coleção.');
      console.log('   A migração não é necessária.');
      return;
    }

    console.log(`📊 Encontrados ${paisesSnapshot.size} países na base de dados.`);
    console.log('');

    // 2. Analisar quais países precisam de migração
    let needsMigration = 0;
    let alreadyMigrated = 0;
    const countriesToMigrate = [];

    paisesSnapshot.forEach(doc => {
      const countryData = doc.data();
      const countryName = countryData.Pais || countryData.Nome || doc.id;

      // Verificar quais campos estão faltando
      const missingFields = [];
      if (countryData.mobilizationLaw === undefined) missingFields.push('mobilizationLaw');
      if (countryData.economicLaw === undefined) missingFields.push('economicLaw');
      if (countryData.warExhaustion === undefined) missingFields.push('warExhaustion');
      if (countryData.inWarWith === undefined) missingFields.push('inWarWith');
      if (countryData.lawChange === undefined) missingFields.push('lawChange');

      if (missingFields.length > 0) {
        needsMigration++;
        countriesToMigrate.push({
          id: doc.id,
          ref: doc.ref,
          name: countryName,
          missingFields: missingFields
        });
        console.log(`⚙️  ${countryName}:`);
        console.log(`   Campos faltando: ${missingFields.join(', ')}`);
      } else {
        alreadyMigrated++;
        console.log(`✅ ${countryName}: Já possui todos os campos`);
      }
    });

    console.log('');
    console.log('-'.repeat(60));
    console.log(`📈 Resumo:`);
    console.log(`   Total de países: ${paisesSnapshot.size}`);
    console.log(`   Precisam migração: ${needsMigration}`);
    console.log(`   Já migrados: ${alreadyMigrated}`);
    console.log('-'.repeat(60));
    console.log('');

    // 3. Executar migração se necessário
    if (needsMigration === 0) {
      console.log('✨ Todos os países já estão atualizados!');
      console.log('   Nenhuma ação necessária.');
      return;
    }

    console.log(`🚀 Iniciando migração de ${needsMigration} países...`);
    console.log('');

    // Usar batch para melhor performance (máximo 500 operações por batch)
    const BATCH_SIZE = 500;
    let currentBatch = db.batch();
    let operationCount = 0;
    let batchCount = 0;
    let totalUpdated = 0;

    for (const country of countriesToMigrate) {
      // Criar objeto de update apenas com campos faltando
      const updates = {};

      country.missingFields.forEach(field => {
        updates[field] = DEFAULT_VALUES[field];
      });

      currentBatch.update(country.ref, updates);
      operationCount++;
      totalUpdated++;

      // Se atingiu o limite do batch, commitar e criar novo
      if (operationCount >= BATCH_SIZE) {
        await currentBatch.commit();
        batchCount++;
        console.log(`   Batch ${batchCount} commitado (${operationCount} operações)`);
        currentBatch = db.batch();
        operationCount = 0;
      }
    }

    // Commitar batch restante
    if (operationCount > 0) {
      await currentBatch.commit();
      batchCount++;
      console.log(`   Batch ${batchCount} commitado (${operationCount} operações)`);
    }

    console.log('');
    console.log('='.repeat(60));
    console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('');
    console.log(`📊 Estatísticas:`);
    console.log(`   Países atualizados: ${totalUpdated}`);
    console.log(`   Batches executados: ${batchCount}`);
    console.log('');
    console.log('📝 Valores padrão aplicados:');
    console.log(`   mobilizationLaw: "${DEFAULT_VALUES.mobilizationLaw}" (Apenas Voluntários)`);
    console.log(`   economicLaw: "${DEFAULT_VALUES.economicLaw}" (Economia Civil)`);
    console.log(`   warExhaustion: ${DEFAULT_VALUES.warExhaustion}%`);
    console.log(`   inWarWith: [] (vazio)`);
    console.log(`   lawChange: null`);
    console.log('');
    console.log('🎯 Próximos passos:');
    console.log('   1. Execute o script setup-game-config.js se ainda não fez');
    console.log('   2. Teste o sistema no painel do narrador');
    console.log('   3. Verifique se os países aparecem corretamente no dashboard');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ ERRO DURANTE A MIGRAÇÃO:');
    console.error('='.repeat(60));
    console.error(error);
    console.error('='.repeat(60));
    console.error('');
    console.error('⚠️  A migração foi interrompida.');
    console.error('   Alguns países podem ter sido atualizados parcialmente.');
    console.error('   Você pode executar o script novamente com segurança.');
    console.error('');
  }
}

// Executa a função principal
migrateNationalLaws();
