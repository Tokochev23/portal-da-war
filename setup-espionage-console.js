/**
 * Script de Setup do Sistema de Espionagem
 *
 * COMO USAR:
 * 1. Abra index.html no navegador (usando servidor local ou hospedado)
 * 2. Faça login como NARRADOR
 * 3. Abra o Console do navegador (F12 > Console)
 * 4. Copie e cole TODO este arquivo no console
 * 5. Pressione Enter
 * 6. O script irá adicionar o campo CounterIntelligence em todos os países
 */

(async function setupEspionageSystem() {
  console.log('🕵️ Iniciando Setup do Sistema de Espionagem...\n');

  // Verificar se está no contexto correto
  if (typeof db === 'undefined') {
    console.error('❌ ERRO: Banco de dados não encontrado!');
    console.log('💡 Certifique-se de que você está na página index.html e que o Firebase foi carregado.');
    return;
  }

  // Importar funções do Firestore
  const { collection, getDocs, updateDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');

  try {
    console.log('🔍 Buscando países no Firestore...');
    const countriesRef = collection(db, 'countries');
    const snapshot = await getDocs(countriesRef);

    const totalPaises = snapshot.size;
    console.log(`✅ Encontrados ${totalPaises} países\n`);

    if (totalPaises === 0) {
      console.warn('⚠️ Nenhum país encontrado no banco de dados!');
      return;
    }

    // Processar cada país
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    let processed = 0;

    for (const docSnapshot of snapshot.docs) {
      processed++;
      const countryData = docSnapshot.data();
      const paisNome = countryData.Pais || 'País sem nome';

      try {
        // Verificar se já tem o campo
        if (countryData.CounterIntelligence !== undefined) {
          console.log(`⏩ ${paisNome}: já possui CounterIntelligence (${countryData.CounterIntelligence}%)`);
          skipped++;
        } else {
          // Adicionar campo
          await updateDoc(doc(db, 'countries', docSnapshot.id), {
            CounterIntelligence: 0
          });
          console.log(`✅ ${paisNome}: CounterIntelligence adicionado (0%)`);
          updated++;
        }
      } catch (error) {
        console.error(`❌ ${paisNome}: ERRO - ${error.message}`);
        errors++;
      }

      // Pequeno delay para não sobrecarregar o Firestore
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Resumo final
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO DO PROCESSO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Total de países: ${totalPaises}`);
    console.log(`✅ Atualizados: ${updated}`);
    console.log(`⏩ Já existiam: ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (errors === 0) {
      console.log('🎉 SETUP CONCLUÍDO COM SUCESSO!');
      console.log('O sistema de espionagem está pronto para uso.');
    } else {
      console.warn('⚠️ Setup concluído com alguns erros.');
      console.log('Verifique os erros acima e tente novamente se necessário.');
    }

  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    console.error('Stack trace:', error.stack);
  }
})();
