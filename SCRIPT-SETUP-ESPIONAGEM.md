# Script de Setup - Sistema de Espionagem

## Como Usar

1. Abra o site em: http://127.0.0.1:8080
2. Faça login como **NARRADOR**
3. Pressione **F12** para abrir o Console
4. Cole o código abaixo e pressione **Enter**

---

## Código para Colar no Console

```javascript
(async function setupEspionage() {
  console.log('🕵️ Iniciando Setup do Sistema de Espionagem...\n');

  try {
    // Usar a API compat do Firestore
    const countriesRef = db.collection('countries');
    const snapshot = await countriesRef.get();

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

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const paisNome = data.Pais || 'País sem nome';

      try {
        // Verificar se já tem o campo
        if (data.CounterIntelligence !== undefined) {
          console.log(`⏩ ${paisNome}: já possui CounterIntelligence (${data.CounterIntelligence}%)`);
          skipped++;
        } else {
          // Adicionar campo
          await doc.ref.update({
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
      console.log('\n📝 Próximos passos:');
      console.log('1. Recarregue a página (F5)');
      console.log('2. Clique em qualquer país');
      console.log('3. Você verá o botão "🕵️ ESPIONAR ESTE PAÍS" ou o painel de contra-espionagem');
    } else {
      console.warn('⚠️ Setup concluído com alguns erros.');
      console.log('Verifique os erros acima e tente novamente se necessário.');
    }

  } catch (error) {
    console.error('\n❌ ERRO CRÍTICO:', error.message);
    console.error('Stack trace:', error);
  }
})();
```

---

## Verificar se Funcionou

Após executar o script:

1. Recarregue a página (F5)
2. Faça login novamente
3. Clique em qualquer país da lista
4. Você deve ver:
   - **Se for outro país**: Botão "🕵️ ESPIONAR ESTE PAÍS"
   - **Se for seu país**: Painel "🛡️ Contra-Espionagem"

---

## Problemas Comuns

### "db is not defined"
- Certifique-se de estar acessando via servidor local (http://127.0.0.1:8080)
- Aguarde o site carregar completamente antes de colar o script

### "Permission denied"
- Você precisa estar logado como NARRADOR
- Verifique suas credenciais no Firebase Console

### Nada aparece após recarregar
- Limpe o cache do navegador (Ctrl + Shift + Delete)
- Faça logout e login novamente

---

**Dica:** Mantenha o console aberto para ver o progresso em tempo real!
