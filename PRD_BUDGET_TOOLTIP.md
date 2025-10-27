# PRD - Melhoria e Expansão do Tooltip de Orçamento

## 1. Introdução e Objetivo

**Objetivo:** Transformar o tooltip de orçamento em uma ferramenta de análise financeira completa, transparente e em tempo real. O jogador deve ser capaz de entender, com uma simples passada de mouse, de onde vem e para onde vai cada centavo do seu orçamento nacional.

Este documento detalha os requisitos para aprimorar o tooltip de orçamento, garantindo que ele reflita com precisão todas as receitas e despesas que impactam a economia de um país.

## 2. Situação Atual e Problema

Atualmente, o tooltip de orçamento no dashboard é incompleto. Ele exibe apenas uma fração dos gastos do jogador, omitindo despesas críticas e recorrentes. A análise do código revelou que os seguintes custos, entre outros, não estão sendo refletidos:

- **Custos da Agência de Inteligência:**
  - Custo para iniciar novas pesquisas de tecnologia.
  - Custo de manutenção do orçamento da própria agência.
  - Custo para iniciar operações de espionagem.
- **Custos de Manutenção:**
  - Manutenção de todo o inventário militar (veículos, aeronaves, navios).
  - Manutenção de infraestrutura naval (estaleiros).
- **Atividade de Mercado:**
  - Compras e vendas de recursos e equipamentos no mercado internacional.
- **Outras Despesas:**
  - Custos de produção militar.
  - Investimentos em infraestrutura.

Essa falta de informação impede que o jogador tome decisões financeiras estratégicas, levando a surpresas no orçamento e a uma má gestão dos recursos do país.

## 3. Solução Proposta

Propõe-se a criação de um novo tooltip de orçamento, rico em informações, que se baseia no sistema centralizado `budgetTracker.js`. Este sistema já categoriza todas as receitas e despesas do jogo.

O tooltip deverá:
1.  Ser ativado ao passar o mouse sobre o valor do orçamento no dashboard.
2.  Exibir um breakdown financeiro claro, dividido em "Receitas", "Despesas" e "Saldo".
3.  Utilizar os dados do objeto `budgetBreakdown` no documento do país no Firestore, que é a fonte da verdade para as finanças.
4.  Apresentar os dados de forma limpa, com receitas em verde e despesas em vermelho, para fácil leitura.

## 4. Detalhamento dos Dados a Serem Exibidos

O tooltip deve ser estruturado da seguinte forma, utilizando os dados e labels fornecidos pelo `budgetTracker.js`.

---

### **Balanço do Orçamento Nacional**

**Orçamento Base (Receita Bruta):** `+ $1,234.56B`
*(Calculado a partir do PIB, Burocracia e Estabilidade)*

---

#### **(+) Receitas Adicionais**

| Categoria                      | Valor         |
| ------------------------------ | ------------- |
| 💵 Vendas Marketplace          | + $150.00M    |
| 🛢️ Vendas de Recursos          | + $75.00M     |
| 🏦 Empréstimos Recebidos        | + $500.00M    |
| *...outras receitas*            | *...*         |
| **Total de Receitas**          | **+ $725.00M**|

---

#### **(-) Despesas Correntes**

| Categoria                      | Valor         |
| ------------------------------ | ------------- |
| 🕵️ Orçamento Agências          | - $80.00M     |
| 🔬 Pesquisa de Agência          | - $50.00M     |
| 🚗 Manutenção Veículos          | - $120.00M    |
| ⚓ Manutenção Frotas            | - $95.00M     |
| 🏭 Manutenção Estaleiros        | - $25.00M     |
| 🛒 Compras Marketplace          | - $200.00M    |
| ⚔️ Produção Militar             | - $300.00M    |
| 🏗️ Infraestrutura              | - $100.00M    |
| *...outras despesas*            | *...*         |
| **Total de Despesas**          | **- $970.00M**|

---

**Saldo Disponível (Líquido):** `$989.56M`
*(Orçamento Base + Total de Receitas - Total de Despesas)*

---

## 5. Sugestões de Implementação Técnica

1.  **Fonte de Dados:** O frontend deve observar em tempo real o campo `budgetBreakdown` no documento do país do jogador no Firestore.

2.  **Geração do Relatório:** Ao exibir o tooltip, a aplicação deve chamar a função `BudgetTracker.getBreakdown(countryId)` para obter os dados brutos e, em seguida, `BudgetTracker.generateReport(breakdown)` para obter um objeto formatado contendo os totais, labels e valores prontos para exibição.

3.  **Renderização:** O componente do tooltip deve iterar sobre as listas `additions` e `subtractions` do relatório gerado, exibindo cada item com seu `label` e `formatted` value.

4.  **Estilo:**
    - Usar cores para indicar ganhos e perdas (ex: `text-green-400` para receitas, `text-red-400` para despesas).
    - Manter um layout de tabela ou lista alinhada para facilitar a leitura e comparação dos valores.
    - O tooltip deve ter um tamanho máximo e ser rolável caso o número de itens de receita/despesa seja grande.

A implementação desta melhoria fornecerá uma ferramenta poderosa para o jogador, aumentando o engajamento e a profundidade estratégica da gestão econômica no War 1954.
