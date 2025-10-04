# 🧪 Guia de Teste - Sistema de Marketplace Refatorado

## ✅ O que foi implementado:

### 1. **Sistema de Mapeamento Unificado** (`js/data/resourceMapping.js`)
- ✅ Mapeamento centralizado de recursos
- ✅ Conversão entre IDs do jogo (metais, carvao) e IDs de mercado (steel_high_grade, coal)
- ✅ Preços base e multiplicadores de qualidade
- ✅ Sugestões de preço baseadas em escassez

### 2. **MarketplaceSystem Atualizado** (`js/systems/marketplaceSystem.js`)
- ✅ Validação refatorada usando o novo mapeamento
- ✅ Usa calculadores de produção/consumo para determinar excedentes
- ✅ Logs detalhados para debug
- ✅ Mensagens de erro mais claras

### 3. **OfferModalManager** (`js/components/offerModalManager.js`)
- ✅ Modal inteligente específico para venda de recursos
- ✅ Seleção visual de recursos com badges de disponibilidade
- ✅ Validação em tempo real com feedback visual
- ✅ Barra de progresso para quantidade
- ✅ Sugestão automática de preços
- ✅ Presets rápidos (25%, 50%, 75%, 100%)
- ✅ Resumo dinâmico da transação
- ✅ Comparação com preço de mercado
- ✅ Suporte a múltiplos tipos de produto (ex: Aço Padrão vs Alta Qualidade)

### 4. **Dashboard Integrado** (`js/pages/dashboard.js`)
- ✅ Import do OfferModalManager
- ✅ Inicialização automática
- ✅ Substituição do modal antigo pelo novo

---

## 🚀 Como Testar:

### Passo 1: Abrir o Dashboard
1. Acesse http://localhost:8080/dashboard.html (ou sua URL do servidor)
2. Faça login com sua conta
3. Navegue até a aba "💰 Mercado Internacional"

### Passo 2: Abrir Modal de Criação de Oferta
1. Clique no botão "📝 Criar Nova Oferta"
2. **Resultado esperado:** Modal novo e bonito aparece com:
   - ✅ Header "🔥 Vender Recursos"
   - ✅ Lista de recursos disponíveis (apenas os que têm excedente)
   - ✅ Badges coloridos (Alto/Médio/Baixo estoque)

### Passo 3: Selecionar um Recurso
1. Clique em um recurso disponível (ex: **Metais**)
2. **Resultado esperado:**
   - ✅ Checkbox visual fica marcado
   - ✅ Campo de quantidade fica habilitado
   - ✅ Se o recurso tiver múltiplos tipos (Metais), aparece seção "🏭 Tipo de Produto"
   - ✅ Preço sugerido aparece automaticamente
   - ✅ Botões de preset ficam habilitados

### Passo 4: Testar Validação em Tempo Real
1. Digite uma quantidade (ex: 10000)
2. **Resultado esperado:**
   - ✅ Barra de progresso se move
   - ✅ Feedback "✅ Válido (X% do estoque)" aparece
   - ✅ Resumo da oferta aparece mostrando valor total

3. Digite uma quantidade acima do disponível
4. **Resultado esperado:**
   - ✅ Feedback muda para "❌ Quantidade excede o disponível"
   - ✅ Texto fica vermelho

### Passo 5: Testar Presets de Quantidade
1. Clique no botão "50%"
2. **Resultado esperado:**
   - ✅ Campo de quantidade preenche com 50% do excedente
   - ✅ Barra de progresso atualiza
   - ✅ Resumo atualiza

### Passo 6: Testar Sugestão de Preço
1. Observe o box azul "💡 Preço Sugerido"
2. Clique em "Mercado" nos presets de preço
3. **Resultado esperado:**
   - ✅ Campo de preço preenche com valor sugerido
   - ✅ Comparação mostra "≈ Preço de mercado"

### Passo 7: Criar Oferta
1. Preencha todos os campos
2. Clique em "🚀 Criar Oferta"
3. **Resultado esperado:**
   - ✅ Botão muda para "⏳ Criando oferta..."
   - ✅ Sem erro no console
   - ✅ Após sucesso: "✅ Oferta criada!"
   - ✅ Modal fecha automaticamente
   - ✅ Oferta aparece na lista do marketplace

---

## 🐛 Testes de Erro (O que DEVE falhar):

### Teste 1: Vender mais que o disponível
- Digite quantidade > excedente
- Clique em criar
- **Esperado:** Erro no frontend antes de submeter

### Teste 2: Preço zero ou negativo
- Digite preço = 0
- Clique em criar
- **Esperado:** Validação HTML impede (campo tem min="0.01")

### Teste 3: Nenhum recurso excedente
- Use um país sem excedentes (produção = consumo)
- Abra modal
- **Esperado:** Mensagem "📭 Nenhum recurso disponível para venda"

---

## 🔍 Como Verificar Logs de Debug:

Abra o Console do Navegador (F12) e procure por:

```
🔍 Validando disponibilidade de recurso: steel_standard
✅ Configuração de mercado encontrada: {name: "Aço Padrão", ...}
📊 Recurso do jogo mapeado: Metais
📈 Produção de Metais: 150000
📉 Consumo de Metais: 80000
💰 Disponível para venda: 70000
✅ Validação de recurso passou!
```

Se aparecer:
```
❌ Tipo de recurso não reconhecido
```
**→ O mapeamento falhou! Verifique resourceMapping.js**

---

## 📊 Casos de Teste Completos:

### ✅ Teste 1: Vender Metais (Aço Padrão)
1. Selecionar: Metais
2. Tipo: Aço Padrão
3. Quantidade: 10.000
4. Preço: $500 (sugerido)
5. **Esperado:** Oferta criada com `item_id: "steel_standard"`

### ✅ Teste 2: Vender Metais (Alumínio)
1. Selecionar: Metais
2. Tipo: Alumínio
3. Quantidade: 5.000
4. Preço: $2.500 (sugerido)
5. **Esperado:** Oferta criada com `item_id: "aluminum"`

### ✅ Teste 3: Vender Combustível
1. Selecionar: Combustível
2. Tipo: Petróleo Bruto (único tipo, auto-selecionado)
3. Quantidade: 20.000
4. Preço: $80 (sugerido)
5. **Esperado:** Oferta criada com `item_id: "oil_crude"`, unidade = "barris"

### ✅ Teste 4: Vender Carvão
1. Selecionar: Carvão
2. Quantidade: 15.000
3. Preço: $100 (sugerido)
4. **Esperado:** Oferta criada com `item_id: "coal"`, unidade = "toneladas"

### ✅ Teste 5: Vender Alimentos
1. Selecionar: Alimentos
2. Quantidade: 8.000
3. Preço: $300 (sugerido)
4. **Esperado:** Oferta criada com `item_id: "food"`, unidade = "toneladas"

---

## ⚠️ Problemas Conhecidos & Soluções:

### Problema: "window.currentCountry não encontrado"
**Solução:** Certifique-se de que está logado e o dashboard carregou completamente

### Problema: "Calculadores de recursos não encontrados"
**Solução:** Verifique se ResourceProductionCalculator e ResourceConsumptionCalculator estão carregados

### Problema: Modal não abre
**Solução:**
1. Verifique console para erros de import
2. Confirme que offerModalManager foi inicializado
3. Recarregue a página

### Problema: "Tipo de recurso não reconhecido" ainda aparece
**Solução:**
1. Limpe cache do navegador (Ctrl+Shift+Delete)
2. Recarregue com Ctrl+F5
3. Verifique se resourceMapping.js está sendo importado corretamente

---

## 🎯 Checklist de Validação:

- [ ] Modal abre sem erros no console
- [ ] Recursos disponíveis são listados corretamente
- [ ] Badges de disponibilidade aparecem (Alto/Médio/Baixo)
- [ ] Seleção de recurso funciona (checkbox visual)
- [ ] Múltiplos tipos aparecem para Metais e Combustível
- [ ] Campo de quantidade fica habilitado após seleção
- [ ] Validação em tempo real funciona (barra de progresso)
- [ ] Presets de quantidade funcionam (25%, 50%, 75%, 100%)
- [ ] Sugestão de preço aparece
- [ ] Presets de preço funcionam (Baixo, Mercado, Alto)
- [ ] Resumo da oferta atualiza em tempo real
- [ ] Comparação com mercado funciona
- [ ] Submit cria oferta com `item_id` correto (ex: steel_standard, coal)
- [ ] **NÃO** aparece erro "Tipo de recurso não reconhecido"
- [ ] Oferta criada aparece no marketplace
- [ ] Título é auto-gerado corretamente

---

## 📞 Debug Rápido:

### Ver recursos disponíveis no console:
```javascript
const production = ResourceProductionCalculator.calculateCountryProduction(window.currentCountry);
const consumption = ResourceConsumptionCalculator.calculateCountryConsumption(window.currentCountry);
console.log('Produção:', production);
console.log('Consumo:', consumption);
console.log('Excedentes:', {
  Metais: production.Metais - consumption.Metais,
  Combustivel: production.Combustivel - consumption.Combustivel,
  Carvao: production.Carvao - consumption.Carvao,
  Graos: production.Graos - consumption.Graos
});
```

### Testar mapeamento no console:
```javascript
import { getMarketTypeConfig, getSuggestedPrice } from './js/data/resourceMapping.js';

// Testar configuração
console.log(getMarketTypeConfig('steel_standard'));
// Deve retornar: {id: "steel_standard", name: "Aço Padrão", ...}

// Testar sugestão de preço
console.log(getSuggestedPrice('steel_standard', 50000));
// Deve retornar: {min: 350, suggested: 500, max: 750, unit: "toneladas"}
```

---

## ✅ Critérios de Sucesso:

1. **Bug Crítico Resolvido:** Não aparece mais "Tipo de recurso não reconhecido"
2. **UX Melhorada:** Modal adaptativo e bonito para recursos
3. **Validação em Tempo Real:** Feedback instantâneo durante preenchimento
4. **Mapeamento Correto:** Recursos do jogo → Tipos de mercado funcionando
5. **Ofertas Criadas:** Salvam com `item_id` correto no Firestore

---

## 🎉 Próximos Passos (Fase 3 do PRD):

Após validar que a venda de recursos está funcionando:

1. **Modal de Venda de Equipamento:** Similar ao de recursos, mas para veículos/navios
2. **Modal de Compra:** Para buscar recursos/equipamentos de outros países
3. **Preços Dinâmicos:** Análise de ofertas existentes para sugerir preços reais
4. **Analytics:** Dashboard com gráficos de evolução de preços

---

**Última atualização:** $(date)
**Status:** ✅ Fase 1 e 2 implementadas, pronto para testes
