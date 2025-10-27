### Tarefa 1: Backend - Garantir a Integridade dos Dados

O objetivo desta tarefa é assegurar que **toda** transação financeira no jogo seja corretamente registrada pelo `budgetTracker.js`. Sem isso, o tooltip nunca será preciso.

*   **Etapa 1.1: Mapear Pontos de Transação:** Revisar os sistemas identificados na análise (`researchSystem.js`, `intelligenceAgencySystem.js`, `espionageSystem.js`, `navalProduction.js`, etc.) e confirmar onde os custos são gerados.
*   **Etapa 1.2: Integrar o `BudgetTracker`:** Para cada ponto de transação encontrado, garantir que uma chamada a `BudgetTracker.addExpense()` ou `BudgetTracker.addIncome()` seja feita com a categoria e o valor corretos.
*   **Etapa 1.3: Validar Despesas Existentes:** Auditar o campo `OrcamentoGasto` nos países para garantir que ele represente corretamente despesas que ainda não foram migradas para o `BudgetTracker`, como a manutenção de unidades.

### Tarefa 2: Frontend - Construção da Interface do Tooltip

Foco em criar o componente visual do tooltip, ainda sem os dados dinâmicos.

*   **Etapa 2.1: Estrutura HTML:** No arquivo de dashboard apropriado (provavelmente `dashboard.html` ou o JavaScript que o renderiza), criar a estrutura HTML do novo tooltip. Ele deve conter seções para "Receita Bruta", "Receitas Adicionais", "Despesas Correntes" e "Saldo Disponível".
*   **Etapa 2.2: Estilização CSS:** Utilizando o CSS do projeto, estilizar o tooltip para que seja legível, visualmente agradável e consistente com a identidade visual do jogo. Implementar o uso de cores (verde para receitas, vermelho para despesas) e garantir que a lista de itens seja rolável.
*   **Etapa 2.3: Lógica de Exibição:** Implementar o comportamento de JavaScript para que o tooltip apareça quando o mouse estiver sobre o display do orçamento e desapareça quando o mouse sair.

### Tarefa 3: Frontend - Integração e Exibição dos Dados

Conectar a interface do tooltip aos dados do Firestore para torná-lo dinâmico.

*   **Etapa 3.1: Listener de Dados em Tempo Real:** No arquivo JavaScript do dashboard, implementar um listener `onSnapshot` do Firestore que observe o campo `budgetBreakdown` do documento do país do jogador.
*   **Etapa 3.2: Processamento dos Dados:** Quando o listener receber novos dados, utilizar a função `BudgetTracker.generateReport()` (ou uma função similar no frontend) para processar o objeto `budgetBreakdown` e prepará-lo para exibição.
*   **Etapa 3.3: Renderização Dinâmica:** Criar uma função que receba o relatório processado e atualize dinamicamente o conteúdo HTML do tooltip. Esta função será chamada sempre que o listener detectar uma mudança nos dados.

### Tarefa 4: Testes e Refinamento

Garantir que a funcionalidade está robusta e a experiência do usuário é impecável.

*   **Etapa 4.1: Teste Funcional:** Executar diversas ações no jogo que impactam o orçamento (iniciar pesquisas, comprar no mercado, construir unidades, etc.) e verificar se o tooltip reflete essas mudanças em tempo real e com os valores corretos.
*   **Etapa 4.2: Revisão de UI/UX:** Validar se a formatação dos números está correta, se os labels estão claros e se o tooltip é fácil de ler e entender.
*   **Etapa 4.3: Teste de Casos Extremos:** Verificar como o tooltip se comporta com um número muito grande de despesas/receitas (a rolagem funciona bem?) ou com valores zerados.