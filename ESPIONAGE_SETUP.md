# Setup do Sistema de Espionagem

## ✅ Arquivos Criados

1. **`js/systems/espionageSystem.js`** - Sistema central de espionagem
2. **`js/components/espionageModal.js`** - Modal para iniciar operações
3. **`js/components/counterIntelligencePanel.js`** - Painel de contra-espionagem

## 📝 Arquivos Modificados

1. **`js/ui/renderer.js`** - Adicionado sistema de permissões ao `renderDetailedCountryPanel`
2. **`js/main.js`** - Adicionado `playerCountry` e `currentTurn` ao appState

## 🔥 Configuração do Firebase

### 1. Adicionar campo nos países existentes

Execute este script no console do navegador (F12) quando estiver logado como narrador:

```javascript
// Importar Firestore
import { collection, getDocs, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { db } from './js/services/firebase.js';

// Adicionar campo CounterIntelligence = 0 em todos os países
async function addCounterIntelligenceField() {
  const countriesRef = collection(db, 'countries');
  const snapshot = await getDocs(countriesRef);

  let updated = 0;
  for (const docSnapshot of snapshot.docs) {
    const countryData = docSnapshot.data();

    // Se não tem o campo, adicionar
    if (countryData.CounterIntelligence === undefined) {
      await updateDoc(doc(db, 'countries', docSnapshot.id), {
        CounterIntelligence: 0
      });
      console.log(`✅ Adicionado CounterIntelligence ao país: ${countryData.Pais}`);
      updated++;
    }
  }

  console.log(`\n🎉 Concluído! ${updated} países atualizados.`);
}

// Executar
addCounterIntelligenceField();
```

### 2. Criar coleção de operações de espionagem

A coleção `espionageOperations` será criada automaticamente quando a primeira operação for iniciada.

**Estrutura da coleção:**
```
espionageOperations/
  {operationId}/
    spyCountryId: string
    spyCountryName: string
    targetCountryId: string
    targetCountryName: string
    level: "basic" | "intermediate" | "total"
    startTurn: number
    validUntilTurn: number
    duration: number
    investment: number
    detected: boolean
    succeeded: boolean
    active: boolean
    createdAt: timestamp
```

### 3. Criar índices no Firestore (opcional mas recomendado)

No Firebase Console > Firestore > Indexes, adicione:

**Índice composto para espionageOperations:**
- Coleção: `espionageOperations`
- Campos:
  - `spyCountryId` (Ascending)
  - `active` (Ascending)
  - `validUntilTurn` (Ascending)

**Índice composto para detecções:**
- Coleção: `espionageOperations`
- Campos:
  - `targetCountryId` (Ascending)
  - `detected` (Ascending)
  - `createdAt` (Descending)

## 🎮 Como Usar

### Para o Jogador

#### 1. Espionar um País

1. Clique no card de qualquer país
2. Se não tiver espionagem ativa, verá o botão **"🕵️ ESPIONAR ESTE PAÍS"**
3. Escolha:
   - **Nível** da espionagem (básica, intermediária, total)
   - **Duração** em turnos (1-10)
4. Veja o custo e chance de sucesso
5. Confirme a operação

#### 2. Gerenciar Contra-Espionagem

1. Clique no seu próprio país
2. Role até o painel **"🛡️ Contra-Espionagem"**
3. Ajuste o investimento (0-10% do orçamento)
4. Salve as configurações

### Para o Narrador

#### Limpar Operações Expiradas

Execute a cada turno:

```javascript
import espionageSystem from './js/systems/espionageSystem.js';

// Limpar operações expiradas
const turnoAtual = 45; // Turno atual do jogo
await espionageSystem.cleanExpiredOperations(turnoAtual);
```

## 🔐 Níveis de Espionagem

### Básica (🔍)
- **Custo:** 1x base
- **Sucesso Base:** 70%
- **Informações:** Orçamento e recursos gerais

### Intermediária (🔬)
- **Custo:** 2.5x base
- **Sucesso Base:** 50%
- **Informações:** Recursos + tecnologias e capacidades de produção

### Total (🎯)
- **Custo:** 5x base
- **Sucesso Base:** 30%
- **Informações:** Acesso completo ao inventário militar

## ⚖️ Sistema de Chances

### Fatores que Aumentam Sucesso
- ✅ **Tecnologia do espião** (+20% máximo)

### Fatores que Reduzem Sucesso
- ❌ **Contra-espionagem do alvo** (-30% máximo)
- ❌ **Urbanização do alvo** (-10% máximo)
- ❌ **Nível da operação** (mais ambicioso = menor chance)

### Detecção
- Chance de detecção = `CounterIntelligence do alvo × 5%`
- Se detectado e bem-sucedido: Alvo recebe notificação mas espionagem funciona
- Se detectado e falhou: Alvo sabe quem tentou espionar

## 📊 Informações Visíveis

### Sempre Visível (Público)
- Nome, bandeira, PIB, população
- Modelo político
- War Power Index (WPI)
- Estabilidade (nível geral)
- Urbanização
- Tecnologia (percentual geral)

### Requer Espionagem (Confidencial)
- Orçamento nacional detalhado
- Orçamento militar e distribuição
- Recursos (produção, consumo, saldo)
- Inventário militar completo
- Capacidades de produção
- Tecnologias militares específicas
- Burocracia e combustível exatos

## 🐛 Debugging

### Ver operações ativas
```javascript
const operations = await espionageSystem.getActiveOperations('country-id', currentTurn);
console.log(operations);
```

### Ver tentativas detectadas
```javascript
const attempts = await espionageSystem.getSpyingAttempts('country-id');
console.log(attempts);
```

### Testar cálculos
```javascript
const cost = espionageSystem.calculateOperationCost('total', 5, targetCountry);
const chance = espionageSystem.calculateSuccessChance('total', spyCountry, targetCountry);
console.log(`Custo: ${cost}, Chance: ${Math.round(chance * 100)}%`);
```

## 🎨 Customização

### Ajustar Custos
Edite `BASE_COST_PER_TURN` em `espionageSystem.js` (linha 30)

### Ajustar Chances
Modifique multiplicadores em `calculateSuccessChance()` (linha 89)

### Adicionar Níveis
Adicione novos níveis em `ESPIONAGE_LEVELS` (linha 10)

---

**Pronto!** O sistema de espionagem está configurado e funcionando. 🎉
