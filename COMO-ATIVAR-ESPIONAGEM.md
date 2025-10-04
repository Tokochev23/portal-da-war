# Como Ativar o Sistema de Espionagem

## Método 1: Via Console do Navegador (Recomendado)

1. **Abra o site** (`index.html`) usando um servidor local ou hospedado
   - Se usar VS Code: instale "Live Server" e clique com botão direito em `index.html` > "Open with Live Server"
   - Ou use: `python -m http.server 8000` e acesse `http://localhost:8000`

2. **Faça login** como **NARRADOR** no site

3. **Abra o Console** do navegador (pressione `F12` e clique na aba "Console")

4. **Execute o setup**:
   - Abra o arquivo `setup-espionage-console.js`
   - Copie TODO o conteúdo
   - Cole no console
   - Pressione Enter

5. **Aguarde** - O script irá adicionar o campo `CounterIntelligence: 0` em todos os países

6. **Pronto!** O sistema de espionagem está ativo

---

## Método 2: Script Direto (Mais Rápido)

Copie e cole este código no console do navegador (F12) quando estiver logado:

```javascript
(async function() {
  const { collection, getDocs, updateDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js');
  const snapshot = await getDocs(collection(db, 'countries'));
  let updated = 0;

  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    if (data.CounterIntelligence === undefined) {
      await updateDoc(doc(db, 'countries', docSnapshot.id), { CounterIntelligence: 0 });
      console.log('✅', data.Pais);
      updated++;
    }
  }

  console.log(`🎉 ${updated} países atualizados!`);
})();
```

---

## Verificar se Funcionou

Após executar o setup, você pode verificar se funcionou:

1. Clique em qualquer país na lista
2. Se for **seu país**: verá o painel "🛡️ Contra-Espionagem"
3. Se for **outro país**: verá o botão "🕵️ ESPIONAR ESTE PAÍS"

---

## Solução de Problemas

### Erro: "db is not defined"
- Você não está no contexto correto
- Certifique-se de estar na página `index.html` com o site carregado

### Erro: "Permission denied"
- Você precisa estar logado como NARRADOR
- Verifique suas permissões no Firebase

### Países não aparecem com o campo
- Recarregue a página (F5)
- Limpe o cache do navegador

---

## Como Usar Depois de Ativado

### Para Espionar um País:
1. Clique no card do país que deseja espionar
2. Clique em "🕵️ ESPIONAR ESTE PAÍS"
3. Escolha o nível (Básica, Intermediária ou Total)
4. Defina a duração (1-10 turnos)
5. Confirme a operação

### Para Se Proteger:
1. Clique no seu próprio país
2. No painel "🛡️ Contra-Espionagem"
3. Ajuste o slider de investimento (0-10%)
4. Clique em "💾 Salvar Configuração"

---

**Dica:** O sistema funciona melhor com países que tenham tecnologia e urbanização altas!
