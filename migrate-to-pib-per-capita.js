/**
 * Script de migração para PIB per capita - War 1954
 * 
 * Este script migra os dados existentes de PIB total para o novo sistema PIB per capita.
 * Para cada país, calcula o PIB per capita baseado no PIB atual e população,
 * então atualiza o documento no Firebase.
 */

import { db } from './js/services/firebase.js';
import { calculatePIBPerCapita, validatePIBConsistency, fixPIBInconsistency } from './js/utils/pibCalculations.js';

// Configuração da migração
const MIGRATION_CONFIG = {
  dryRun: false, // Executar migração real
  batchSize: 10, // Processar países em lotes
  logDetails: true
};

async function migrateCountriesToPIBPerCapita() {
  console.log('🔄 Iniciando migração para PIB per capita...');
  console.log(`Modo: ${MIGRATION_CONFIG.dryRun ? 'DRY RUN (simulação)' : 'EXECUÇÃO REAL'}`);
  
  try {
    // 1. Buscar todos os países
    console.log('📂 Carregando países do Firebase...');
    const snapshot = await db.collection('paises').get();
    const countries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log(`✅ ${countries.length} países carregados`);
    
    // 2. Analisar dados atuais
    const analysis = analyzeCurrentData(countries);
    console.log('\n📊 Análise dos dados atuais:');
    console.log(`- Países com PIB: ${analysis.withPIB}`);
    console.log(`- Países com População: ${analysis.withPopulation}`);
    console.log(`- Países com PIB per capita: ${analysis.withPIBPerCapita}`);
    console.log(`- Países que precisam de migração: ${analysis.needsMigration}`);
    console.log(`- Inconsistências encontradas: ${analysis.inconsistencies}`);
    
    // 3. Processar migração
    const migrationResults = await processMigration(countries);
    
    // 4. Resumo final
    console.log('\n✅ Migração concluída!');
    console.log('📋 Resumo:');
    console.log(`- Países processados: ${migrationResults.processed}`);
    console.log(`- Migrações bem-sucedidas: ${migrationResults.successful}`);
    console.log(`- Erros: ${migrationResults.errors}`);
    console.log(`- Pular (já migrados): ${migrationResults.skipped}`);
    
    if (migrationResults.errorDetails.length > 0) {
      console.log('\n❌ Detalhes dos erros:');
      migrationResults.errorDetails.forEach(error => {
        console.log(`- ${error.country}: ${error.error}`);
      });
    }
    
    if (MIGRATION_CONFIG.dryRun) {
      console.log('\n⚠️ Esta foi uma simulação. Para executar a migração real, altere MIGRATION_CONFIG.dryRun para false');
    }
    
  } catch (error) {
    console.error('💥 Erro fatal na migração:', error);
    throw error;
  }
}

function analyzeCurrentData(countries) {
  let withPIB = 0;
  let withPopulation = 0;
  let withPIBPerCapita = 0;
  let needsMigration = 0;
  let inconsistencies = 0;
  
  countries.forEach(country => {
    const pib = parseFloat(country.PIB) || 0;
    const population = parseFloat(country.Populacao) || 0;
    const pibPerCapita = parseFloat(country.PIBPerCapita) || 0;
    
    if (pib > 0) withPIB++;
    if (population > 0) withPopulation++;
    if (pibPerCapita > 0) withPIBPerCapita++;
    
    // Precisa de migração se tem PIB e população, mas não tem PIB per capita
    if (pib > 0 && population > 0 && pibPerCapita === 0) {
      needsMigration++;
    }
    
    // Verificar inconsistências
    if (pib > 0 && population > 0 && pibPerCapita > 0) {
      const validation = validatePIBConsistency(country);
      if (!validation.isConsistent) {
        inconsistencies++;
      }
    }
  });
  
  return {
    withPIB,
    withPopulation, 
    withPIBPerCapita,
    needsMigration,
    inconsistencies
  };
}

async function processMigration(countries) {
  const results = {
    processed: 0,
    successful: 0,
    errors: 0,
    skipped: 0,
    errorDetails: []
  };
  
  console.log('\n🔄 Iniciando processamento dos países...');
  
  for (let i = 0; i < countries.length; i += MIGRATION_CONFIG.batchSize) {
    const batch = countries.slice(i, i + MIGRATION_CONFIG.batchSize);
    
    console.log(`\n📦 Processando lote ${Math.floor(i/MIGRATION_CONFIG.batchSize) + 1} (${batch.length} países)...`);
    
    for (const country of batch) {
      try {
        results.processed++;
        
        const migrationResult = await migrateCountry(country);
        
        if (migrationResult.skipped) {
          results.skipped++;
          if (MIGRATION_CONFIG.logDetails) {
            console.log(`⏭️ ${country.Pais || country.id}: ${migrationResult.reason}`);
          }
        } else {
          results.successful++;
          if (MIGRATION_CONFIG.logDetails) {
            console.log(`✅ ${country.Pais || country.id}: ${migrationResult.message}`);
          }
        }
        
      } catch (error) {
        results.errors++;
        results.errorDetails.push({
          country: country.Pais || country.id,
          error: error.message
        });
        
        console.log(`❌ ${country.Pais || country.id}: ${error.message}`);
      }
    }
    
    // Pequena pausa entre lotes para não sobrecarregar o Firebase
    if (i + MIGRATION_CONFIG.batchSize < countries.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

async function migrateCountry(country) {
  const pib = parseFloat(country.PIB) || 0;
  const population = parseFloat(country.Populacao) || 0;
  const currentPIBPerCapita = parseFloat(country.PIBPerCapita) || 0;
  
  // Verificar se já tem PIB per capita válido
  if (currentPIBPerCapita > 0) {
    // Verificar consistência
    const validation = validatePIBConsistency(country);
    
    if (validation.isConsistent) {
      return {
        skipped: true,
        reason: 'já possui PIB per capita consistente'
      };
    } else {
      // Corrigir inconsistência
      const correctedCountry = fixPIBInconsistency(country, 'pib_total');
      
      const updateData = {
        PIB: correctedCountry.PIB,
        PIBPerCapita: correctedCountry.PIBPerCapita,
        _lastMigration: new Date(),
        _migrationReason: 'inconsistency_fix'
      };
      
      if (!MIGRATION_CONFIG.dryRun) {
        await db.collection('paises').doc(country.id).update(updateData);
      }
      
      return {
        skipped: false,
        message: `inconsistência corrigida - PIB per capita: ${correctedCountry.PIBPerCapita.toFixed(2)}`
      };
    }
  }
  
  // Verificar se tem dados suficientes para migração
  if (pib <= 0) {
    return {
      skipped: true,
      reason: 'PIB não disponível ou zero'
    };
  }
  
  if (population <= 0) {
    return {
      skipped: true,
      reason: 'população não disponível ou zero'
    };
  }
  
  // Calcular PIB per capita
  const calculatedPIBPerCapita = calculatePIBPerCapita(pib, population);
  
  // Preparar dados para update
  const updateData = {
    PIBPerCapita: calculatedPIBPerCapita,
    _lastMigration: new Date(),
    _migrationReason: 'pib_per_capita_calculation'
  };
  
  // Executar update no Firebase (se não for dry run)
  if (!MIGRATION_CONFIG.dryRun) {
    await db.collection('paises').doc(country.id).update(updateData);
  }
  
  return {
    skipped: false,
    message: `PIB per capita calculado: ${calculatedPIBPerCapita.toFixed(2)} (PIB: ${pib.toLocaleString()} / Pop: ${population.toLocaleString()})`
  };
}

// Função para validar migração (executar após a migração)
async function validateMigration() {
  console.log('\n🔍 Validando migração...');
  
  try {
    const snapshot = await db.collection('paises').get();
    const countries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    let validCount = 0;
    let invalidCount = 0;
    const issues = [];
    
    countries.forEach(country => {
      const pib = parseFloat(country.PIB) || 0;
      const population = parseFloat(country.Populacao) || 0;
      const pibPerCapita = parseFloat(country.PIBPerCapita) || 0;
      
      if (pib > 0 && population > 0) {
        if (pibPerCapita > 0) {
          const validation = validatePIBConsistency(country);
          if (validation.isConsistent) {
            validCount++;
          } else {
            invalidCount++;
            issues.push(`${country.Pais || country.id}: ${validation.message}`);
          }
        } else {
          invalidCount++;
          issues.push(`${country.Pais || country.id}: PIB per capita faltando`);
        }
      }
    });
    
    console.log('📊 Resultado da validação:');
    console.log(`✅ Países válidos: ${validCount}`);
    console.log(`❌ Países inválidos: ${invalidCount}`);
    
    if (issues.length > 0) {
      console.log('\n🚨 Problemas encontrados:');
      issues.slice(0, 10).forEach(issue => console.log(`- ${issue}`));
      if (issues.length > 10) {
        console.log(`... e mais ${issues.length - 10} problemas`);
      }
    }
    
  } catch (error) {
    console.error('Erro na validação:', error);
  }
}

// Executar migração se o script for chamado diretamente
if (typeof window === 'undefined') {
  // Executando no Node.js
  migrateCountriesToPIBPerCapita()
    .then(() => {
      console.log('🎉 Script de migração concluído!');
      if (!MIGRATION_CONFIG.dryRun) {
        return validateMigration();
      }
    })
    .catch(error => {
      console.error('💥 Erro na execução:', error);
      process.exit(1);
    });
} else {
  // Executando no browser
  console.log('📝 Script de migração carregado. Execute migrateCountriesToPIBPerCapita() para iniciar.');
  window.migrateCountriesToPIBPerCapita = migrateCountriesToPIBPerCapita;
  window.validateMigration = validateMigration;
}

export { migrateCountriesToPIBPerCapita, validateMigration };