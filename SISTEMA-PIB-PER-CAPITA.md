# Sistema PIB per Capita - War 1954

## 📋 Resumo da Implementação

O sistema econômico do War 1954 foi atualizado para usar **PIB per capita** como campo principal ao invés do PIB total. Esta mudança torna o sistema mais realista demograficamente, evitando situações onde um país perde população mas mantém o mesmo PIB total.

## 🔧 Arquivos Modificados e Criados

### Novos Arquivos:
- `js/utils/pibCalculations.js` - Utilitários para cálculos PIB
- `migrate-to-pib-per-capita.js` - Script de migração de dados
- `test-pib-system.html` - Página de testes do sistema
- `SISTEMA-PIB-PER-CAPITA.md` - Esta documentação

### Arquivos Modificados:
- `js/systems/economicCalculations.js` - Adaptado para PIB per capita
- `js/systems/economicSimulator.js` - Interface atualizada
- `js/pages/narrador.js` - Interface do narrador atualizada

## 🧮 Como Funciona o Novo Sistema

### Fórmulas Principais:
```javascript
PIB Total = População × PIB per Capita
PIB per Capita = PIB Total ÷ População
Orçamento = PIB Total × 0.25 × (Burocracia/100) × (Estabilidade/100) × 1.5
```

### Crescimento Econômico:
- O crescimento é aplicado diretamente ao **PIB per capita**
- O PIB total é recalculado automaticamente: `PIB = População × PIB per capita`
- Isso significa que mudanças demográficas afetam automaticamente o PIB total

## 🎮 Interface do Usuário

### No Painel do Narrador:
1. **PIB per Capita**: Campo editável para definir a riqueza per capita
2. **PIB Total**: Campo calculado automaticamente (não editável)
3. **População**: Campo editável que afeta o PIB total

### No Simulador Econômico:
- Todas as ações econômicas agora afetam o PIB per capita
- O PIB total é recalculado automaticamente
- Interface mostra crescimento em % e valores absolutos

## 🔄 Migração de Dados Existentes

### Script de Migração:
```bash
# Para simular a migração (não altera dados):
node migrate-to-pib-per-capita.js

# Para executar migração real:
# 1. Edite o arquivo e altere dryRun: false
# 2. Execute: node migrate-to-pib-per-capita.js
```

### O que a Migração Faz:
1. **Analisa** todos os países no Firebase
2. **Calcula** PIB per capita para países que não têm
3. **Corrige** inconsistências entre PIB total e per capita
4. **Valida** os dados após migração
5. **Relatórios** detalhados de todo o processo

## 🧪 Testes

### Página de Teste (`test-pib-system.html`):
1. Teste dos cálculos PIB
2. Validação de consistência de dados
3. Verificação de módulos carregados
4. Simulação de orçamento

### Como Testar:
1. Abra `test-pib-system.html` no navegador
2. Teste os cálculos básicos
3. Valide consistência de dados
4. Abra `narrador.html` para testar o simulador

## 📊 Exemplos Práticos

### Exemplo 1: País Desenvolvido
- População: 50 milhões
- PIB per capita: $45,000
- PIB total: $2.25 trilhões
- Orçamento (80% buro, 90% est): $607.5 bilhões

### Exemplo 2: Crescimento Econômico
- PIB per capita inicial: $25,000
- Crescimento de 3%: PIB per capita = $25,750
- Se população = 100M: PIB cresce de $2.5T para $2.575T

### Exemplo 3: Mudança Demográfica
- PIB per capita: $30,000 (constante)
- População inicial: 80M → PIB: $2.4T
- População final: 85M → PIB: $2.55T (crescimento automático)

## ⚙️ Configuração Técnica

### Dependências:
```javascript
// Em qualquer arquivo que use os cálculos:
import { 
    calculatePIBTotal, 
    calculatePIBPerCapita,
    calculateBudgetFromPIB,
    formatCurrency,
    formatPIBPerCapita
} from './js/utils/pibCalculations.js';
```

### Validação de Dados:
```javascript
// Verificar consistência de um país:
const validation = validatePIBConsistency(country);
if (!validation.isConsistent) {
    const corrected = fixPIBInconsistency(country, 'pib_total');
    // Aplicar correção...
}
```

## 🎯 Benefícios do Novo Sistema

### Realismo Demográfico:
- PIB total muda automaticamente com população
- Países com alta densidade econômica ficam mais valiosos per capita
- Mudanças demográficas têm impacto econômico realista

### Balanceamento de Jogo:
- Crescimento econômico é proporcional à base per capita
- Países menores podem ter PIB per capita alto
- Países grandes precisam desenvolver eficiência per capita

### Consistência de Dados:
- Sistema de validação automática
- Correção de inconsistências
- Migração segura de dados existentes

## 🚀 Como Usar

### Para Narradores:
1. **Editar País**: Use PIB per capita como campo principal
2. **Simulador**: Configure ações econômicas normalmente
3. **Resultado**: Veja crescimento em PIB per capita e total

### Para Desenvolvimento:
1. **Novos Campos**: Use PIB per capita em formulários
2. **Cálculos**: Importe utilitários de `pibCalculations.js`  
3. **Validação**: Sempre valide consistência dos dados

## 🔧 Manutenção

### Monitoramento:
- Execute `validateMigration()` periodicamente
- Verifique inconsistências em dados antigos
- Monitore logs de erro no console

### Updates Futuros:
- PIB per capita deve ser sempre o campo primário
- PIB total calculado automaticamente
- Manter compatibilidade com sistema anterior durante transição

## 📞 Suporte

Se encontrar problemas:
1. Verifique console do navegador por erros
2. Execute página de teste (`test-pib-system.html`)
3. Valide dados com script de migração
4. Verifique se todos os módulos estão importados corretamente

---
*Sistema implementado com sucesso! O War 1954 agora usa PIB per capita como base econômica.* 🎉