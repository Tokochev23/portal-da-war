# 📑 Sistema Econômico Completo - War 1954

## 🎯 Visão Geral

Sistema de simulação econômica estratégica que permite aos narradores gerenciar investimentos de países com mecânicas realistas, balanceamento anti-exploit e feedback narrativo imersivo.

## 🏗️ Arquitetura do Sistema

### Módulos Principais

- **`economicSimulator.js`** - Interface principal e lógica de negócio
- **`economicCalculations.js`** - Sistema de cálculos e fórmulas
- **`economicDependency.js`** - Análise de dependência econômica
- **`economicFeedback.js`** - Feedback narrativo para players

## 🖥️ Interface de Uso

### Acesso
- **Local**: Aba "Ferramentas" do painel de narrador
- **Botão**: "💰 Simulador Econômico"
- **Modal**: Tela completa com abas organizadas

### Estrutura da Interface
```
┌─ SIMULADOR ECONÔMICO ─────────────────────┐
│ País: [Brasil ▼]  Orçamento: $2.4bi      │
├───────────────────────────────────────────┤
│ AÇÕES INTERNAS (0/10 slots)              │
│ AÇÕES EXTERNAS (0/3 slots)               │
│ RESUMO & APLICAR                          │
└───────────────────────────────────────────┘
```

## ⚙️ Tipos de Ação

### 🏗️ Infraestrutura (Multiplicador: 0.9x)
- **Bônus**: +25% se Urbanização > 50%
- **Exemplos**: Estradas, energia, telecomunicações
- **Impacto**: Melhora base econômica e suporte para outros setores

### 🔬 Pesquisa & Desenvolvimento (Multiplicador: 1.2x)
- **Bônus**: +35% se Tecnologia > 60%
- **Exemplos**: Universidades, inovação científica
- **Impacto**: Crescimento tecnológico e vantagem a longo prazo

### 🏭 Desenvolvimento Industrial (Multiplicador: 1.1x)
- **Bônus**: +30% no crescimento do PIB
- **Penalidade**: -20% se Estabilidade < 40%
- **Exemplos**: Fábricas, refinarias
- **Impacto**: Crescimento rápido, mas arriscado

### 🏥 Investimento Social (Multiplicador: 0.8x)
- **Bônus**: +1 ponto de Estabilidade por ação bem-sucedida
- **Exemplos**: Saúde, educação, habitação
- **Impacto**: Estabilidade política e coesão social

## 🧩 Cadeias Produtivas

### Sinergias Disponíveis

#### 🏗️ + 🏭 Infraestrutura + Indústria
- **Bônus**: +15% ao crescimento industrial
- **Efeito**: Elimina penalidade de estabilidade se < 50%

#### 🔬 + 🏭 P&D + Indústria
- **Bônus**: +10% ao crescimento industrial
- **Efeito**: +1 ponto adicional de tecnologia

#### 🔬 + 🏥 P&D + Social
- **Bônus**: +20% ao ganho de estabilidade
- **Efeito**: +1 ponto adicional de tecnologia

## 📊 Sistema de Cálculos

### Fórmula Principal
```javascript
// 1. Base do crescimento (D12)
baseGrowth = (dado > 5) ? (dado - 5) / 70 : -(6 - dado) / 140

// 2. Modificadores do país
countryMod = 1 + (tecnologia × urbanização / 200)

// 3. Modificador de estabilidade
stabilityMod = estabilidade < 30 ? 0.6 :
               estabilidade < 50 ? 0.8 :
               estabilidade > 80 ? 1.2 : 1.0

// 4. Crescimento final
finalGrowth = baseGrowth × countryMod × stabilityMod × typeMod × (1 + buff) × (1 - inflação)
```

### Dados D12
- **1-3**: Possível perda (-2%)
- **4-5**: Sem crescimento
- **6-12**: Sucesso crescente
- **Críticos (10-12)**: Bônus especial

## 🔥 Sistema de Inflação

### Inflação Externa (Anti-EUA→Chad)
- **>5% PIB receptor**: +20% inflação
- **>20% PIB receptor**: +40% adicional
- **>40% PIB receptor**: +40% adicional
- **Doador 10x maior**: +25% inflação

### Inflação por Distribuição
- **>60% orçamento em um tipo**: +25%
- **>80% orçamento em um tipo**: +35%
- **>90% uso do orçamento**: +20%

### Resistência Inflacionária
- **Tecnologia >70**: -20% inflação
- **Estabilidade >75**: -15% inflação
- **Superpotência (PIB >$500bi)**: -25% inflação
- **Máximo**: 50% de resistência total

## 🌍 Sistema de Dependência Econômica

### Níveis de Dependência
- **Leve (30%)**: Bônus +5% crescimento, -10% em crise
- **Moderada (50%)**: Bônus +10% crescimento, -20% em crise
- **Pesada (70%)**: Bônus +15% crescimento, -35% em crise
- **Crítica (85%)**: Bônus +20% crescimento, -50% em crise

### Efeitos
- **Crescimento**: Países dependentes crescem mais
- **Vulnerabilidade**: Sofrem em crises do investidor
- **Rejeição Popular**: Países instáveis podem rejeitar ajuda

## 🎮 Feedback Narrativo

### Tipos de Mensagem

#### Crescimento
- **Excelente (>15%)**: "✨ Crescimento Excepcional!"
- **Bom (8-15%)**: "✅ Crescimento Sólido"
- **Moderado (3-8%)**: "📊 Crescimento Moderado"
- **Fraco (0-3%)**: "⚠️ Crescimento Limitado"
- **Negativo (<0%)**: "🚨 Recessão Econômica"

#### Inflação
- **Baixa (<15%)**: "💡 Gestão Eficiente"
- **Moderada (15-35%)**: "⚠️ Inflação Controlável"
- **Alta (35-60%)**: "🔥 Alta Inflação"
- **Severa (>60%)**: "🚨 Hiperinflação Ameaça"

#### Cadeias Produtivas
- "🔗 Sinergia Perfeita! A combinação potencializou o crescimento."

#### Dependência
- "🤝 Nova Parceria fortaleceu os laços econômicos."
- "🚨 Dependência Crítica compromete a autonomia."

## 💾 Estrutura de Dados

### Firebase Collections

#### `economic_history`
```javascript
{
  countryId: "brasil",
  turn: 15,
  timestamp: Date,
  totalInvestment: 2500, // milhões
  actions: [...],
  results: {
    totalGrowth: 0.08,
    finalGrowth: 0.06,
    inflation: 0.25,
    newPIB: 105000000000
  },
  externalInvestments: {
    "franca": 500,
    "alemanha": 300
  }
}
```

#### `player_feedback`
```javascript
{
  countryId: "brasil",
  turn: 15,
  timestamp: Date,
  mainMessage: "✅ Crescimento Sólido...",
  details: [...],
  warnings: [...],
  achievements: [...],
  recommendations: [...]
}
```

## 🧪 Testes

### Arquivo de Teste
- **Local**: `test-economic-system.html`
- **Funcionalidades**:
  - Teste de cálculos individuais
  - Teste de inflação
  - Abertura do simulador
  - Log de debug

### Como Testar
1. Abra o arquivo `test-economic-system.html` no navegador
2. Configure os parâmetros de teste
3. Execute os testes de cálculo
4. Teste o simulador completo

## 🔧 Instalação e Configuração

### Pré-requisitos
- Firebase configurado
- Usuário com permissões de narrador
- Navegador moderno com suporte a ES6+

### Integração
O sistema já está integrado automaticamente com:
- `narrador.js` - Inicialização automática
- Firebase - Persistência de dados
- Sistema de notificações existente

### Inicialização
```javascript
// Automática no carregamento do painel do narrador
await initEconomicSimulator();
```

## ⚖️ Balanceamento

### Mecânicas Anti-Exploit
- **Inflação progressiva** para investimentos desproporcionais
- **Dependência econômica** limita investimentos externos massivos
- **Diminishing returns** em estratégias repetitivas
- **Risco de rejeição** em países instáveis

### Elementos Estratégicos
- **5 tipos de ação** com características únicas
- **Cadeias produtivas** recompensam diversificação
- **Sistema de dados** equilibra sorte e estratégia
- **Feedback imediato** orienta decisões

## 🐛 Troubleshooting

### Problemas Comuns

#### Modal não abre
- Verificar se usuário tem permissões de narrador
- Verificar console para erros de JavaScript
- Confirmar inicialização do sistema econômico

#### Cálculos incorretos
- Verificar se dados do país estão válidos
- Confirmar formato dos números (sem caracteres especiais)
- Checar se Firebase está acessível

#### Feedback não aparece
- Verificar permissões de escrita no Firebase
- Confirmar que o turno está definido corretamente
- Checar logs no console

### Debug
```javascript
// Verificar inicialização
console.log(window.economicSimulator);

// Testar cálculos
import EconomicCalculations from './js/systems/economicCalculations.js';
EconomicCalculations.calculateBaseGrowth(action, country);
```

## 📝 Notas de Versão

### v1.0.0 - Sistema Inicial
- ✅ Interface completa do simulador
- ✅ Sistema de cálculos econômicos
- ✅ Cadeias produtivas
- ✅ Sistema de inflação
- ✅ Análise de dependência econômica
- ✅ Feedback narrativo automático
- ✅ Integração com Firebase
- ✅ Arquivo de testes

### Próximas Versões
- 📋 Presets de estratégias históricas
- 📊 Relatórios estatísticos detalhados
- 🎯 Sistema de metas econômicas
- 🌐 Integração com diplomacia

---

**Sistema desenvolvido para War 1954**  
**Balanceamento realista • Anti-exploit • Narrativa imersiva**