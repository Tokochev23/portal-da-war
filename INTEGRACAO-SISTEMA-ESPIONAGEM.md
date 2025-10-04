# 🔧 Integração do Sistema de Agências de Inteligência

## ✅ Arquivos Criados

### **Sistemas (Backend)**
1. `js/systems/intelligenceAgencySystem.js` - Sistema principal de agências
2. `js/systems/agencyTechnologies.js` - Definição de todas as tecnologias
3. `js/systems/researchSystem.js` - Sistema de pesquisa com D12
4. `js/systems/espionageOperationsSystem.js` - Operações e infiltração
5. `js/systems/securityAlertsSystem.js` - Alertas e investigação

### **Componentes (Frontend)**
6. `js/components/agencyFoundationModal.js` - Modal para fundar agência
7. `js/components/agencyDashboard.js` - Dashboard principal da agência
8. `js/components/securityAlertsPanel.js` - Painel de alertas de segurança

---

## 🗄️ Estrutura no Firebase

### **Coleções Necessárias:**

```javascript
// 1. agencies (criar via sistema)
agencies/
  └─ {agencyId}/
      ├─ countryId: string
      ├─ countryName: string
      ├─ name: string
      ├─ foundedTurn: number
      ├─ budgetPercent: number
      ├─ budget: number
      ├─ tier: "limited"|"competent"|"powerful"|"elite"
      ├─ focus: "external_espionage"|"counterintelligence"|"covert_operations"
      ├─ technologies: array<string>
      ├─ currentResearch: object|null
      ├─ operatives: number
      └─ createdAt: timestamp

// 2. espionage_operations (criar via sistema)
espionage_operations/
  └─ {operationId}/
      ├─ agencyId: string
      ├─ spyCountryId: string
      ├─ targetCountryId: string
      ├─ phase: 1|2|3|4
      ├─ progress: 0-100
      ├─ startedTurn: number
      ├─ operativesDeployed: number
      ├─ detected: boolean
      ├─ active: boolean
      └─ intelLevel: 0|10|40|70|100

// 3. security_alerts (criar via sistema)
security_alerts/
  └─ {alertId}/
      ├─ targetCountryId: string
      ├─ spyCountryId: string|null
      ├─ detectedTurn: number
      ├─ severity: "low"|"medium"|"high"|"critical"
      ├─ status: "pending"|"investigating"|"resolved"
      ├─ investigation: object
      └─ revealed: object|null

// 4. paises (atualizar documentos existentes)
paises/
  └─ {paisId}/
      ├─ ... (campos existentes)
      ├─ hasAgency: boolean
      └─ agencyId: string|null
```

---

## 📝 Passo a Passo de Integração

### **1. Adicionar Botão no Dashboard do País**

Edite o arquivo onde você renderiza o dashboard do jogador e adicione:

```javascript
// Em algum lugar do dashboard do país:
<button id="open-agency-dashboard" class="...">
  🕵️ Agência de Inteligência
</button>

// Script:
import { renderAgencyDashboard } from './components/agencyDashboard.js';

const btn = document.getElementById('open-agency-dashboard');
btn.addEventListener('click', () => {
  // Criar modal ou seção
  const container = document.getElementById('agency-container');
  const playerCountry = window.appState.playerCountry;

  renderAgencyDashboard(playerCountry, container);
});
```

### **2. Atualizar Campo CounterIntelligence nos Países**

Execute o script no console (F12) quando estiver logado como narrador:

```javascript
(async function() {
  const countriesRef = db.collection('paises');
  const snapshot = await countriesRef.get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.CounterIntelligence === undefined) {
      await doc.ref.update({ CounterIntelligence: 0, hasAgency: false, agencyId: null });
      console.log('✅', data.Pais);
    }
  }

  console.log('🎉 Concluído!');
})();
```

### **3. Garantir appState Global**

Certifique-se que em `js/main.js` você tem:

```javascript
// Estado da aplicação
let appState = {
  allCountries: [],
  gameConfig: {},
  isDataLoaded: false,
  playerCountry: null,
  currentTurn: 0,
};

// Tornar global
window.appState = appState;

// Atualizar quando carregar dados do jogador:
appState.playerCountry = playerData;
appState.currentTurn = appState.gameConfig.turnoAtual || 0;
```

---

## 🎮 Fluxo de Uso Para o Jogador

### **1. Fundar Agência**
```
Dashboard → Botão "Agência de Inteligência" → Fundar Agência
├─ Escolher nome
├─ Definir % orçamento (0.5-15%)
├─ Escolher foco (Espionagem Externa, Contra-Intel, Ops Encobertas)
└─ Pagar custo de fundação
```

### **2. Pesquisar Tecnologias**
```
Dashboard da Agência → Tab "Pesquisa"
├─ Ver tecnologias disponíveis
├─ Iniciar pesquisa (paga custo)
├─ A cada turno: "Tentar Pesquisa" (rola D12)
└─ Sucesso: tecnologia desbloqueada
```

### **3. Iniciar Operações de Espionagem**
```
Dashboard da Agência → Tab "Operações"
├─ Escolher país-alvo
├─ Definir duração
├─ Pagar custo
├─ Sistema automaticamente progride por 4 fases:
│   1. Estabelecer Presença (2-4 turnos)
│   2. Recrutar Rede Local (2-6 turnos)
│   3. Penetração (3-8 turnos)
│   4. Operações Completas (ongoing)
└─ Informações desbloqueadas gradualmente (0% → 100%)
```

### **4. Investigar Ameaças**
```
Dashboard da Agência → Tab "Segurança"
├─ Ver alertas de espionagem detectada
├─ Clicar "Investigar" (paga custo)
├─ Sistema rola D12
└─ Resultados possíveis:
    ├─ Falha Crítica: Suspeitos fogem
    ├─ Falha: Sem evidências
    ├─ Sucesso Parcial: Informações vagas
    └─ Sucesso Total: País espião identificado + Ações disponíveis
```

### **5. Ações de Retaliação** (após sucesso total)
```
- Denunciar Publicamente (-15 reputação do espião)
- Capturar Operativos (interrogar)
- Virar Agentes (alimentar intel falsa)
- Expulsar Diplomatas (destruir rede)
- Negociar em Segredo (receber compensação)
- Retaliação Encoberta (sabotagem)
```

---

## 🔧 Configurações Importantes

### **Custos Base** (ajustáveis)
```javascript
// Em intelligenceAgencySystem.js
calculateFoundationCost: baseCost = 500000

// Em agencyTechnologies.js
Tecnologias: baseCost varia de 50k a 500k

// Em espionageOperationsSystem.js
calculateOperationCost: baseCostPerTurn = 25000

// Em securityAlertsSystem.js
ALERT_SEVERITY: baseCost de 100k a 500k
```

### **Modificadores D12** (ajustáveis)
```javascript
// Pesquisa (researchSystem.js):
Tech Civil > 60%: +1
Tier Poderosa/Elite: +1
Techs relacionadas: +1 a +2
Foco alinhado: +1

// Investigação (securityAlertsSystem.js):
Forense Tático: +2
Vigilância Eletrônica: +2
Double Agents: +3
Biometria: +2
Tier alta: +1
Foco contra-intel: +2
```

---

## 🐛 Debugging

### **Ver agência de um país:**
```javascript
const agency = await intelligenceAgencySystem.getAgency('pais-id');
console.log(agency);
```

### **Ver operações ativas:**
```javascript
const ops = await espionageOperationsSystem.getAgencyOperations('agency-id');
console.log(ops);
```

### **Ver alertas:**
```javascript
const alerts = await securityAlertsSystem.getAllCountryAlerts('pais-id');
console.log(alerts);
```

### **Testar cálculo de custo:**
```javascript
const cost = intelligenceAgencySystem.calculateCostByPIB(100000, country);
console.log('Custo ajustado:', cost);
```

---

## ⚠️ Limitações Atuais

1. **Operações manuais:** Sistema requer que jogador clique para progredir fases
2. **Sem automação de turno:** Não há processamento automático no fim de cada turno
3. **Ações de retaliação:** Interface básica, não totalmente implementadas
4. **Visualização de intel:** Informações desbloqueadas não são mostradas automaticamente no painel do país-alvo

---

## 🚀 Próximos Passos (Melhorias Futuras)

1. **Automação de Progresso:**
   - Operações progridem automaticamente a cada turno
   - Sistema de notificações push

2. **Visualização de Intel:**
   - Mostrar informações desbloqueadas no painel do país espionado
   - Indicador visual de nível de intel

3. **Ações de Retaliação Completas:**
   - Implementar efeitos de cada ação
   - Sistema de reputação internacional
   - Consequências diplomáticas

4. **Operações Especiais:**
   - Sabotagem ativa
   - Guerra psicológica
   - Assassinatos
   - Golpes de estado

5. **Sistema de Notificações:**
   - Alertas quando operação progride
   - Avisos quando detectado
   - Notificações de tecnologias desbloqueadas

---

**Sistema pronto para testes básicos!** 🎉

Execute o script de atualização dos países e comece a testar a fundação de agências.
