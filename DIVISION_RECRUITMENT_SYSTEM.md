# 🎖️ Sistema de Recrutamento Progressivo de Divisões

## 📋 Visão Geral

O sistema de recrutamento progressivo implementa o treinamento realista de divisões militares, onde diferentes níveis de treinamento afetam custos, stats e tempo de preparação.

---

## 🎯 Níveis de Treinamento

### ⚔️ **CONSCRITO** (Conscript)
- **Descrição**: Recrutamento emergencial com treinamento mínimo
- **💰 Custo**: **-50%** (metade do preço base)
- **⚔️ Combat Stats**: **-50%** em todos os stats
- **⏱️ Tempo**: **1 turno** (prontas no mesmo turno)
- **📊 Progresso**: 100% no primeiro turno

**Uso Tático:**
- Defesa territorial urgente
- Carne de canhão para frentes secundárias
- Recrutamento massivo emergencial
- Guarnições de cidades

---

### 🎖️ **REGULAR** (Regular)
- **Descrição**: Treinamento padrão do exército
- **💰 Custo**: **100%** (preço base)
- **⚔️ Combat Stats**: **100%** (stats balanceados)
- **⏱️ Tempo**: **2 turnos** (progressivo)
- **📊 Progresso**: 50% por turno

**Uso Tático:**
- Backbone do exército
- Operações gerais
- Ocupação de território
- Reservas estratégicas

**Exemplo Progressivo:**
```
Recruta 10 divisões Regular:
  Turno 1: 5 divisões prontas (50%)
  Turno 2: 10 divisões prontas (100%)
```

---

### 🏆 **ELITE** (Elite)
- **Descrição**: Veteranos com treinamento avançado
- **💰 Custo**: **+500%** (6x mais caro!)
- **⚔️ Combat Stats**: **+50%** em todos os stats
- **⏱️ Tempo**: **6 turnos** (progressivo)
- **📊 Progresso**: ~16.67% por turno

**Uso Tático:**
- Operações especiais
- Spearhead de ofensivas
- Elite forces
- Operações críticas

**Exemplo Progressivo:**
```
Recruta 6 divisões Elite:
  Turno 1: 1 divisão pronta (16.67%)
  Turno 2: 2 divisões prontas (33.33%)
  Turno 3: 3 divisões prontas (50%)
  Turno 4: 4 divisões prontas (66.67%)
  Turno 5: 5 divisões prontas (83.33%)
  Turno 6: 6 divisões prontas (100%) ✅
```

---

## 📊 Tabela Comparativa

| Nível | Custo | Manutenção | Stats | Turnos | Progress/Turno | Eficiência |
|-------|-------|------------|-------|--------|----------------|------------|
| **Conscrito** | 0.5x | 0.5x | 0.5x | 1 | 100% | ⚡ Rápido & Barato |
| **Regular** | 1.0x | 1.0x | 1.0x | 2 | 50% | ⚖️ Balanceado |
| **Elite** | 6.0x | 6.0x | 1.5x | 6 | 16.67% | 💎 Poderoso & Caro |

---

## 🔧 Implementação Técnica

### 1. Estrutura de Dados no Firestore

Quando uma divisão é salva, os seguintes campos são criados:

```javascript
{
  id: "division_123",
  name: "1ª Divisão Blindada",
  trainingLevel: "regular",

  // Status de recrutamento
  recruitmentStatus: "recruiting", // ou "ready", "deployed"

  // Dados de progresso
  recruitment: {
    totalTurns: 2,           // Total de turnos necessários
    currentTurn: 0,          // Turno atual (0 = início)
    progressPerTurn: 0.5,    // 50% de progresso por turno
    progress: 0,             // Progresso atual (0.0 a 1.0)
    startedAt: Timestamp,
    trainingLevel: "regular"
  },

  combatUnits: [...],
  supportUnits: [...],
  calculatedStats: {...},

  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### 2. Processamento Automático de Turnos

O sistema `turnProcessor.js` executa automaticamente a cada turno:

```javascript
// No processTurnEnd()
await this.processDivisionRecruitment(turnNumber);
```

**Lógica de Processamento:**

```javascript
1. Buscar todas divisões com recruitmentStatus = "recruiting"
2. Para cada divisão:
   a. Incrementar currentTurn
   b. Calcular novo progresso: currentTurn * progressPerTurn
   c. Se progresso >= 1.0 ou currentTurn >= totalTurns:
      - Marcar como "ready"
      - Atualizar completedAt e completedAtTurn
   d. Senão:
      - Atualizar progresso atual
3. Salvar mudanças em batch
4. Log de divisões prontas
```

### 3. Modificadores Aplicados

Os modificadores de training level são aplicados em `divisionStatsCalculator.js`:

```javascript
// Custos
const baseCost = calculateBaseCost(division);
const trainingModifier = trainingLevel.modifiers.costs.production;
const finalCost = baseCost * trainingModifier;

// Stats
const baseStats = calculateBaseStats(division);
const statModifier = trainingLevel.modifiers.stats;
const finalStats = applyModifiers(baseStats, statModifier);
```

---

## 🎮 Exemplos de Uso

### Exemplo 1: Recrutamento Emergencial
```
Situação: Invasão iminente, preciso de tropas AGORA
Solução: Recrutar 20 divisões Conscrito
Resultado: 20 divisões prontas no mesmo turno (50% dos stats, 50% do custo)
```

### Exemplo 2: Build-up Estratégico
```
Situação: Preparando ofensiva em 3 turnos
Solução: Recrutar 15 divisões Regular no turno 1
Resultado:
  - Turno 1: 7-8 divisões prontas
  - Turno 2: 15 divisões prontas (100%)
  - Turno 3: Lançar ofensiva
```

### Exemplo 3: Elite Force
```
Situação: Criar força de elite para operação especial
Solução: Recrutar 3 divisões Elite
Custo: 6x o preço normal por divisão
Resultado:
  - Turno 1-5: Treinando progressivamente
  - Turno 6: 3 divisões Elite prontas (150% dos stats)
```

---

## 📈 Balanceamento

### Custo-Benefício por Nível

**Conscrito:**
- ✅ Muito barato (50% do custo)
- ✅ Disponível imediatamente
- ❌ Stats fracos (50%)
- 🎯 Ideal para: Defesa, números, emergências

**Regular:**
- ✅ Custo razoável (100%)
- ✅ Stats balanceados (100%)
- ⚠️ 2 turnos de espera
- 🎯 Ideal para: Uso geral, backbone do exército

**Elite:**
- ❌ Muito caro (600% do custo!)
- ❌ 6 turnos de espera
- ✅ Stats superiores (150%)
- 🎯 Ideal para: Operações críticas, spearhead

### Fórmula de Eficiência

```
Eficiência = (Stats / Custo) * (1 / Turnos)

Conscrito: (0.5 / 0.5) * (1 / 1) = 1.0
Regular:   (1.0 / 1.0) * (1 / 2) = 0.5
Elite:     (1.5 / 6.0) * (1 / 6) = 0.042
```

**Conclusão:** Conscritos são mais eficientes em custo/tempo, mas Elites são superiores em combate.

---

## 🔍 Console Logs

Durante o processamento de turnos, o console exibe:

```
🎖️ Processando recrutamento de divisões (Turno 5)...
🔄 1ª Divisão Blindada: 50% (1/2 turnos)
✅ 2ª Divisão Mecanizada: Divisão pronta! (regular)
🔄 Elite Guard: 83% (5/6 turnos)
✅ 3 divisões processadas, 1 pronta!
```

---

## 📝 Notas de Desenvolvimento

### Arquivo: `training_levels.js`
- Define os 3 níveis de treinamento
- Contém todos os modificadores
- Exporta funções helper

### Arquivo: `turnProcessor.js`
- Função `processDivisionRecruitment()` processa turnos
- Executa automaticamente no fechamento do turno
- Atualiza status e progresso

### Arquivo: `divisionCreator.js`
- Função `saveDivision()` cria dados de recrutamento
- Aplica modificadores na UI
- Exibe tooltips informativos

### Arquivo: `divisionStatsCalculator.js`
- Aplica modificadores de training level nos stats
- Calcula custos finais
- Retorna stats calculados

---

## 🚀 Roadmap Futuro

- [ ] Notificações quando divisões ficarem prontas
- [ ] Dashboard de divisões em treinamento
- [ ] Sistema de experiência pós-combate
- [ ] Upgrades de divisões (Conscrito → Regular → Elite)
- [ ] Penalties por recrutar muito rápido (manpower shortage)
- [ ] Bônus por academias militares/training facilities

---

**Status:** ✅ Sistema implementado e funcional
**Versão:** 1.0
**Data:** 2025-01-20
