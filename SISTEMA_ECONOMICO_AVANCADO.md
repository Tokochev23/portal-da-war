# Documentação: Sistema Econômico Avançado (v3.0)

Este documento detalha as regras e mecânicas dos sistemas econômicos avançados implementados no War 1954, construídos sobre a base do simulador econômico original.

## 1. Visão Geral

O objetivo destes sistemas é aprofundar a simulação, tornando a gestão de recursos, energia e bem-estar da população pilares centrais da estratégia de uma nação. As decisões agora têm efeitos cascata mais realistas, onde a indústria depende de matéria-prima, a tecnologia depende de energia, e a população depende de alimentos e bens de consumo.

---

## 2. Novos Recursos

Além do Combustível, Grãos e Metais, dois novos recursos foram adicionados.

### 2.1. Carvão (Recurso Primário)

- **O que é:** Uma fonte de energia alternativa ao combustível, crucial para nações sem acesso a grandes reservas de petróleo.
- **Produção:** É extraído através da ação **"⛏️ Exploração de Recursos"** no simulador econômico. A quantidade produzida depende do investimento, da rolagem de dado e do **`PotencialCarvao`** (Jazidas) do país.
- **Uso:** Serve como matéria-prima para a **Política Industrial** e para a geração de **Energia Elétrica** em termelétricas.

### 2.2. Energia Elétrica (Recurso Secundário)

- **O que é:** Um recurso produzido, não extraído. Representa a capacidade de geração elétrica da nação, medida em capacidade vs. demanda.
- **Produção (Modelo Simplificado Atual):** A capacidade de energia é um valor abstrato no documento do país (`Energia.capacidade`).
- **Produção (Modelo Detalhado Futuro):** A capacidade será a soma da geração de diferentes usinas (Termelétricas, Hidrelétricas, Nucleares) que podem ser construídas e aprimoradas.
- **Consumo/Demanda:** A demanda (`Energia.demanda`) aumenta com a urbanização, o nível tecnológico e a atividade industrial.
- **Impacto (Déficit):** Se a demanda exceder a capacidade, o país sofre um "apagão", resultando em penalidades severas para a eficiência industrial, pesquisa tecnológica e estabilidade.

---

## 3. Novas Mecânicas

### 3.1. Política Industrial: Combustível vs. Carvão

Para dar mais flexibilidade estratégica, cada país agora possui uma **"Política Industrial"**.

- **Como funciona:** No painel do país, o jogador/narrador pode definir o **Foco Industrial** para "Combustível" ou "Carvão".
- **Efeito:** A ação "🏭 Desenvolvimento Industrial" no simulador passará a consumir o recurso selecionado.
- **Trade-off:**
  - **Combustível:** É mais eficiente, gerando mais pontos de desenvolvimento por unidade.
  - **Carvão:** É menos eficiente (ex: -20% de eficácia), mas pode ser uma alternativa vital se o país tiver mais acesso a carvão do que a petróleo.

### 3.2. Métrica: Eficiência Industrial

- **O que é:** Um índice (0-100) que representa a maturidade, tecnologia e produtividade do parque industrial de uma nação.
- **Como Aumenta:** A eficiência industrial aumenta passivamente com o nível de **Tecnologia** do país e ativamente com investimentos bem-sucedidos na ação "🏭 Desenvolvimento Industrial".
- **Impacto:** É um dos componentes chave para o cálculo do índice de **Bens de Consumo**.

### 3.3. Métrica: Bens de Consumo

- **O que é:** Um índice (0-100) que mede a qualidade de vida e o acesso da população a produtos e serviços. Não é um recurso estocável.
- **Cálculo:** O índice é calculado a cada turno com base em:
  1. **Acesso a Alimentos:** Superávit de **Grãos**.
  2. **Acesso a Energia:** Superávit de **Combustível** e/ou **Energia Elétrica**.
  3. **Disponibilidade de Produtos:** Nível da **Eficiência Industrial**.
- **Impacto na Estabilidade:**
  - **Índice Alto (> 75):** População satisfeita. Causa um **bônus de +3 de Estabilidade** por turno.
  - **Índice Baixo (< 25):** População insatisfeita. Causa uma **penalidade de -3 de Estabilidade** por turno.

---

## 4. Refinamento: Impacto Demográfico dos Grãos

Conforme refinado, o balanço de Grãos agora afeta diretamente a população.

- **Déficit Crítico (Fome):** Causa **perda populacional** e uma grande penalidade de estabilidade.
- **Déficit Leve (Escassez):** Estagna o crescimento populacional.
- **Superávit (Abundância):** Causa um **crescimento populacional acelerado** e um bônus de estabilidade.

---

## 5. Novos Campos no Banco de Dados (Referência Técnica)

Os seguintes campos foram adicionados aos documentos na coleção `paises`:

- `PotencialCarvao` (number): Nível da jazida de carvão (1-10).
- `CarvaoSaldo` (number): Estoque atual de carvão.
- `PoliticaIndustrial` (string): "combustivel" ou "carvao".
- `Energia` (map): Contém `capacidade` e `demanda`.
- `IndustrialEfficiency` (number): Índice de 0-100.
- `BensDeConsumo` (number): Índice de 0-100.
