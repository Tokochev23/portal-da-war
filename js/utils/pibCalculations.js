/**
 * Utilitários para Cálculos de PIB - War 1954
 * Sistema: PIB = População × PIB per capita
 */

/**
 * Calcular PIB total baseado na população e PIB per capita
 * @param {number} populacao - População do país
 * @param {number} pibPerCapita - PIB per capita
 * @returns {number} PIB total
 */
export function calculatePIBTotal(populacao, pibPerCapita) {
  const pop = parseFloat(populacao) || 0;
  const perCapita = parseFloat(pibPerCapita) || 0;
  return pop * perCapita;
}

/**
 * Calcular PIB per capita baseado no PIB total e população
 * @param {number} pibTotal - PIB total do país
 * @param {number} populacao - População do país
 * @returns {number} PIB per capita
 */
export function calculatePIBPerCapita(pibTotal, populacao) {
  const pib = parseFloat(pibTotal) || 0;
  const pop = parseFloat(populacao) || 0;
  
  if (pop === 0) return 0;
  return pib / pop;
}

/**
 * Validar consistência dos dados PIB
 * @param {object} country - Dados do país
 * @returns {object} Resultado da validação
 */
export function validatePIBConsistency(country) {
  const pib = parseFloat(country.PIB) || 0;
  const populacao = parseFloat(country.Populacao) || 0;
  const pibPerCapita = parseFloat(country.PIBPerCapita) || 0;
  
  if (populacao === 0) {
    return {
      isConsistent: false,
      issue: 'population_zero',
      message: 'População não pode ser zero'
    };
  }
  
  const calculatedPIBTotal = calculatePIBTotal(populacao, pibPerCapita);
  const calculatedPIBPerCapita = calculatePIBPerCapita(pib, populacao);
  
  // Verificar qual campo usar como referência
  const pibDiscrepancy = Math.abs(pib - calculatedPIBTotal) / Math.max(pib, calculatedPIBTotal);
  const perCapitaDiscrepancy = Math.abs(pibPerCapita - calculatedPIBPerCapita) / Math.max(pibPerCapita, calculatedPIBPerCapita);
  
  // Tolerância de 1% para diferenças de arredondamento
  const tolerance = 0.01;
  
  if (pibDiscrepancy <= tolerance) {
    return {
      isConsistent: true,
      preferredSource: 'pib_total',
      calculatedPIBPerCapita,
      calculatedPIBTotal: pib
    };
  }
  
  if (perCapitaDiscrepancy <= tolerance) {
    return {
      isConsistent: true,
      preferredSource: 'pib_per_capita',
      calculatedPIBTotal,
      calculatedPIBPerCapita: pibPerCapita
    };
  }
  
  return {
    isConsistent: false,
    issue: 'inconsistent_data',
    message: 'PIB total e PIB per capita são inconsistentes',
    currentPIB: pib,
    currentPIBPerCapita: pibPerCapita,
    calculatedFromTotal: calculatedPIBPerCapita,
    calculatedFromPerCapita: calculatedPIBTotal,
    suggestedFix: 'use_pib_total' // Usar PIB total como fonte da verdade
  };
}

/**
 * Corrigir dados inconsistentes de um país
 * @param {object} country - Dados do país
 * @param {string} preferredSource - 'pib_total' ou 'pib_per_capita'
 * @returns {object} Dados corrigidos
 */
export function fixPIBInconsistency(country, preferredSource = 'pib_total') {
  const pib = parseFloat(country.PIB) || 0;
  const populacao = parseFloat(country.Populacao) || 0;
  const pibPerCapita = parseFloat(country.PIBPerCapita) || 0;
  
  if (populacao === 0) {
    return {
      ...country,
      PIB: 0,
      PIBPerCapita: 0,
      _correctionApplied: 'zero_population'
    };
  }
  
  if (preferredSource === 'pib_per_capita') {
    // Usar PIB per capita como fonte da verdade
    const correctedPIB = calculatePIBTotal(populacao, pibPerCapita);
    return {
      ...country,
      PIB: correctedPIB,
      PIBPerCapita: pibPerCapita,
      _correctionApplied: 'from_per_capita'
    };
  } else {
    // Usar PIB total como fonte da verdade (padrão)
    const correctedPIBPerCapita = calculatePIBPerCapita(pib, populacao);
    return {
      ...country,
      PIB: pib,
      PIBPerCapita: correctedPIBPerCapita,
      _correctionApplied: 'from_total'
    };
  }
}

/**
 * Aplicar crescimento econômico no PIB per capita
 * @param {number} currentPIBPerCapita - PIB per capita atual
 * @param {number} growthPercentage - Percentual de crescimento (ex: 0.05 para 5%)
 * @returns {number} Novo PIB per capita
 */
export function applyGrowthToPIBPerCapita(currentPIBPerCapita, growthPercentage) {
  const current = parseFloat(currentPIBPerCapita) || 0;
  const growth = parseFloat(growthPercentage) || 0;
  
  return current * (1 + growth);
}

/**
 * Calcular orçamento baseado no novo sistema PIB
 * @param {object} country - Dados do país
 * @returns {number} Orçamento disponível
 */
export function calculateBudgetFromPIB(country) {
  const populacao = parseFloat(country.Populacao) || 0;
  const pibPerCapita = parseFloat(country.PIBPerCapita) || 0;
  const pibTotal = calculatePIBTotal(populacao, pibPerCapita);
  
  const burocracia = (parseFloat(country.Burocracia) || 0) / 100;
  const estabilidade = (parseFloat(country.Estabilidade) || 0) / 100;
  
  return pibTotal * 0.25 * burocracia * estabilidade * 1.5;
}

/**
 * Formatar valores monetários
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
export function formatCurrency(value) {
  if (value >= 1000000000000) {
    return `$${(value / 1000000000000).toFixed(1)}T`;
  } else if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}bi`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  } else {
    return `$${value.toLocaleString()}`;
  }
}

/**
 * Formatar PIB per capita
 * @param {number} value - Valor do PIB per capita
 * @returns {string} Valor formatado
 */
export function formatPIBPerCapita(value) {
  if (value >= 1000) {
    return `$${value.toLocaleString()}`;
  } else {
    return `$${value.toFixed(0)}`;
  }
}