/**
 * Sistema de Penalidade de Energia Automática - War 1954
 * Processa automaticamente os efeitos de déficit energético nos países
 */

import { db, getAllCountries } from '../services/firebase.js';
import { Logger } from '../utils.js';
import EconomicCalculations from './economicCalculations.js';

class EnergyPenaltyProcessor {
  constructor() {
    this.isProcessing = false;
  }

  /**
   * Processa penalidades de energia para todos os países
   */
  async processAllCountries() {
    if (this.isProcessing) {
      Logger.warn('EnergyPenaltyProcessor já está em execução');
      return;
    }

    try {
      this.isProcessing = true;
      Logger.info('Iniciando processamento de penalidades de energia...');

      const countries = await getAllCountries();
      const batch = db.batch();
      let processedCount = 0;

      for (const country of countries) {
        const result = await this.processCountryEnergyPenalty(country);

        if (result.needsUpdate) {
          const countryRef = db.collection('paises').doc(country.id);
          batch.update(countryRef, result.updates);
          processedCount++;

          if (result.penalty > 0) {
            Logger.info(`${country.Pais}: déficit de ${result.deficitPercent}%, penalidade de -$${result.penalty.toFixed(0)}`);
          }
        }
      }

      if (processedCount > 0) {
        await batch.commit();
        Logger.info(`Penalidades de energia aplicadas em ${processedCount} países`);
      } else {
        Logger.info('Nenhum país precisou de penalidade de energia');
      }

    } catch (error) {
      Logger.error('Erro ao processar penalidades de energia:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Processa penalidade para um país específico
   */
  async processCountryEnergyPenalty(country) {
    try {
      // Calcular demanda atual
      const demandData = EconomicCalculations.computeEnergyDemandGW(country);
      const currentCapacity = parseFloat(country.EnergiaCapacidade) || parseFloat(country.Energia?.capacidade) || 0;

      // Verificar se há déficit
      if (currentCapacity >= demandData.demandaGW) {
        return { needsUpdate: false };
      }

      // Calcular penalidade
      const deficit = demandData.demandaGW - currentCapacity;
      const deficitPercent = (deficit / demandData.demandaGW) * 100;
      const penaltyMultiplier = EconomicCalculations.computeEnergyPenalty(currentCapacity, demandData.demandaGW);

      // Aplicar penalidade no PIB (mais moderada que no simulador econômico)
      const currentPIB = parseFloat(country.PIB) || 0;
      const maxPenaltyPercent = 0.02; // Máximo 2% do PIB por turno
      const penaltyAmount = currentPIB * Math.min(maxPenaltyPercent, (1 - penaltyMultiplier) * 0.05);

      if (penaltyAmount > 0) {
        const newPIB = Math.max(currentPIB - penaltyAmount, currentPIB * 0.98); // Nunca reduzir mais que 2%
        const newPIBPerCapita = newPIB / (parseFloat(country.Populacao) || 1);

        // Aplicar também pequena penalidade na estabilidade para países com déficit crítico
        const currentStability = parseFloat(country.Estabilidade) || 50;
        const stabilityPenalty = deficitPercent > 50 ? 1 : 0; // -1 estabilidade se déficit > 50%

        const updates = {
          PIB: newPIB,
          PIBPerCapita: newPIBPerCapita,
          'Energia.demanda': demandData.demandaGW,
          'geral.PIB': newPIB,
          'geral.PIBPerCapita': newPIBPerCapita
        };

        if (stabilityPenalty > 0) {
          updates.Estabilidade = Math.max(0, currentStability - stabilityPenalty);
          updates['geral.Estabilidade'] = Math.max(0, currentStability - stabilityPenalty);
        }

        return {
          needsUpdate: true,
          updates,
          penalty: penaltyAmount,
          deficitPercent: deficitPercent.toFixed(1)
        };
      }

      return { needsUpdate: false };

    } catch (error) {
      Logger.error(`Erro ao processar penalidade para ${country.Pais}:`, error);
      return { needsUpdate: false };
    }
  }

  /**
   * Aplicar consumo de recursos das usinas
   */
  async processResourceConsumption() {
    try {
      const countries = await getAllCountries();
      const batch = db.batch();
      let processedCount = 0;

      for (const country of countries) {
        if (!country.power_plants || country.power_plants.length === 0) {
          continue;
        }

        const currentResources = {
          Carvao: parseFloat(country.CarvaoSaldo || country.Carvao || 0),
          Combustivel: parseFloat(country.Combustivel || 0),
          Uranio: parseFloat(country.Uranio || 0)
        };

        const consumption = EconomicCalculations.calculateEnergyProduction(country, currentResources);

        if (consumption.consumedResources && Object.values(consumption.consumedResources).some(v => v > 0)) {
          const updates = {};

          if (consumption.consumedResources.Carvao > 0) {
            updates.CarvaoSaldo = Math.max(0, currentResources.Carvao - consumption.consumedResources.Carvao);
          }
          if (consumption.consumedResources.Combustivel > 0) {
            updates.Combustivel = Math.max(0, currentResources.Combustivel - consumption.consumedResources.Combustivel);
          }
          if (consumption.consumedResources.Uranio > 0) {
            updates.Uranio = Math.max(0, currentResources.Uranio - consumption.consumedResources.Uranio);
          }

          if (Object.keys(updates).length > 0) {
            const countryRef = db.collection('paises').doc(country.id);
            batch.update(countryRef, updates);
            processedCount++;
          }
        }
      }

      if (processedCount > 0) {
        await batch.commit();
        Logger.info(`Consumo de recursos aplicado em ${processedCount} países`);
      }

    } catch (error) {
      Logger.error('Erro ao processar consumo de recursos:', error);
    }
  }
}

// Instância global
const energyPenaltyProcessor = new EnergyPenaltyProcessor();

/**
 * Executar processamento completo (penalidades + consumo)
 */
export async function processEnergySystemTurn() {
  await Promise.all([
    energyPenaltyProcessor.processAllCountries(),
    energyPenaltyProcessor.processResourceConsumption()
  ]);
}

export { EnergyPenaltyProcessor, energyPenaltyProcessor };