// Cole este código no console para VERIFICAR se os países têm o campo CounterIntelligence

(async function verificarEspionagem() {
  console.log('🔍 Verificando países no Firestore...\n');

  try {
    const countriesRef = db.collection('countries');
    const snapshot = await countriesRef.get();

    console.log(`Total de países: ${snapshot.size}\n`);

    let comCampo = 0;
    let semCampo = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const paisNome = data.Pais || 'Sem nome';

      if (data.CounterIntelligence !== undefined) {
        console.log(`✅ ${paisNome}: CounterIntelligence = ${data.CounterIntelligence}`);
        comCampo++;
      } else {
        console.log(`❌ ${paisNome}: NÃO TEM o campo CounterIntelligence`);
        semCampo++;
      }
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Com campo: ${comCampo}`);
    console.log(`❌ Sem campo: ${semCampo}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (semCampo > 0) {
      console.log('⚠️ Alguns países não têm o campo!');
      console.log('Vou adicionar agora...\n');

      // Adicionar campo nos países que não têm
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.CounterIntelligence === undefined) {
          await doc.ref.update({ CounterIntelligence: 0 });
          console.log(`✅ Adicionado em: ${data.Pais || 'Sem nome'}`);
        }
      }

      console.log('\n🎉 Concluído! Recarregue a página (F5)');
    } else {
      console.log('✅ Todos os países já têm o campo!');
      console.log('O sistema de espionagem está pronto.');
    }

  } catch (error) {
    console.error('❌ ERRO:', error);
    console.log('\nPossíveis causas:');
    console.log('1. Você não está logado como narrador');
    console.log('2. Suas permissões no Firestore não permitem UPDATE');
    console.log('3. O db não está disponível (recarregue a página)');
  }
})();
