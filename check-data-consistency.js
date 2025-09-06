/**
 * Script para verificar consistência dos dados PIB vs PIB per capita vs População
 */

// Simulação de verificação - você pode rodar isso no console do Firebase ou adaptar
const checkDataConsistency = (countries) => {
  const inconsistencies = [];
  
  countries.forEach(country => {
    const pib = parseFloat(country.PIB) || 0;
    const populacao = parseFloat(country.Populacao) || 0;
    const pibPerCapita = parseFloat(country.PIBPerCapita) || 0;
    
    if (populacao > 0 && pib > 0) {
      // Calcular PIB per capita baseado nos dados atuais
      const calculatedPIBPerCapita = pib / populacao;
      
      // Verificar se há discrepância significativa (mais de 10%)
      const discrepancy = Math.abs((calculatedPIBPerCapita - pibPerCapita) / calculatedPIBPerCapita);
      
      if (discrepancy > 0.1) { // 10% de tolerância
        inconsistencies.push({
          country: country.Pais || country.id,
          currentPIB: pib,
          currentPopulation: populacao,
          currentPIBPerCapita: pibPerCapita,
          calculatedPIBPerCapita: calculatedPIBPerCapita,
          discrepancyPercentage: (discrepancy * 100).toFixed(2) + '%'
        });
      }
    }
  });
  
  return inconsistencies;
};

// Função para gerar PIB per capita realista baseado no PIB atual
const generateRealisticPIBPerCapita = (pib, populacao) => {
  if (populacao === 0) return 0;
  return pib / populacao;
};

console.log('Script de verificação de consistência pronto.');
console.log('Para usar: checkDataConsistency(arrayDePaises)');

export { checkDataConsistency, generateRealisticPIBPerCapita };