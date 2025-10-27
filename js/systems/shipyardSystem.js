// js/systems/shipyardSystem.js - Sistema de Estaleiros

import { db, auth } from '../services/firebase.js';
import { checkPlayerCountry } from '../services/firebase.js';
import BudgetTracker from './budgetTracker.js';

/**
 * Fetches all countries and calculates the average GDP.
 * @returns {Promise<number>} The average GDP of all countries.
 */
async function getGlobalAverageGDP() {
    try {
        const snapshot = await db.collection('paises').get();
        if (snapshot.empty) {
            return 0;
        }
        let totalGDP = 0;
        let countryCount = 0;
        snapshot.forEach(doc => {
            const pib = parseFloat(doc.data().PIB);
            if (!isNaN(pib)) {
                totalGDP += pib;
                countryCount++;
            }
        });
        return countryCount > 0 ? totalGDP / countryCount : 0;
    } catch (error) {
        console.error("Error calculating global average GDP:", error);
        return 0; // Return 0 or a fallback value on error
    }
}

export class ShipyardSystem {
    constructor() {
        this.maxLevel = 10;
        this.baseMaintenancePercent = 0.005; // 0.5% do orçamento para nível 1
    }

    /**
     * Calcular custo de upgrade para próximo nível de forma dinâmica.
     */
    calculateUpgradeCost(currentLevel, countryData, globalAverageGDP, targetLevel = null) {
        if (currentLevel >= this.maxLevel) return 0;

        const nextLevel = targetLevel || (currentLevel + 1);
        if (nextLevel > this.maxLevel) return 0;

        // --- Dynamic Base Cost Calculation ---
        const navalTech = countryData.Marinha || 1;
        const industrialEfficiency = countryData.IndustrialEfficiency || 30;
        const countryGDP = countryData.PIB || 0;

        // Fatores de Balanceamento
        const GDP_FACTOR = 0.0000015; 
        const NAVAL_TECH_DAMPENER = 100;
        const EFFICIENCY_DAMPENER = 200;
        const GLOBAL_GDP_WEIGHT = 0.5; // 50%
        const COUNTRY_GDP_WEIGHT = 0.5; // 50%

        // Modificadores de desconto
        const navalTechModifier = 1 + (navalTech / NAVAL_TECH_DAMPENER);
        const efficiencyModifier = 1 + (industrialEfficiency / EFFICIENCY_DAMPENER);

        // PIB Híbrido: 50% da média global + 50% do PIB do país
        const blendedGDP = (globalAverageGDP * GLOBAL_GDP_WEIGHT) + (countryGDP * COUNTRY_GDP_WEIGHT);

        const dynamicBaseCost = (blendedGDP * GDP_FACTOR) / (navalTechModifier * efficiencyModifier);
        // --- End of Dynamic Calculation ---

        const cost = dynamicBaseCost * Math.pow(nextLevel, 2) * Math.pow(1.6, nextLevel);
        return Math.round(cost * 1000);
    }

    /**
     * Calcular custo de manutenção mensal
     */
    calculateMaintenanceCost(level, countryBudget) {
        if (level === 0) return 0;

        const maintenancePercent = this.baseMaintenancePercent * Math.pow(level, 2) * Math.pow(1.5, level);
        return Math.round(countryBudget * maintenancePercent);
    }

    /**
     * Calcular bônus de produção naval baseado no nível
     */
    calculateProductionBonus(level) {
        if (level === 0) {
            return {
                parallelMultiplier: 0.5, // 50% capacidade sem estaleiros
                timeReduction: 0,        // Sem redução de tempo
                maxSimultaneous: 1       // Máximo 1 projeto
            };
        }

        const parallelMultiplier = 1 + (level * 0.3); // +30% por nível
        const timeReduction = Math.min(0.5, level * 0.05); // Até 50% redução no tempo
        const maxSimultaneous = Math.min(15, 1 + level); // +1 projeto por nível (máximo 15)

        return {
            parallelMultiplier,
            timeReduction,
            maxSimultaneous
        };
    }

    /**
     * Obter informações do nível do estaleiro
     */
    getLevelInfo(level, countryData = null, globalAverageGDP = null) {
        const bonus = this.calculateProductionBonus(level);
        const upgradeCost = (countryData && globalAverageGDP != null) 
            ? this.calculateUpgradeCost(level, countryData, globalAverageGDP) 
            : 0;

        return {
            level,
            description: this.getLevelDescription(level),
            upgradeCost, // Será 0 se os dados estiverem faltando
            parallelBonus: Math.round((bonus.parallelMultiplier - 1) * 100),
            timeReduction: Math.round(bonus.timeReduction * 100),
            maxProjects: bonus.maxSimultaneous,
            maintenancePercent: level === 0 ? 0 : this.baseMaintenancePercent * Math.pow(level, 2) * Math.pow(1.5, level)
        };
    }

    /**
     * Descrições por nível
     */
    getLevelDescription(level) {
        const descriptions = {
            0: "Sem estaleiros - Produção naval severamente limitada",
            1: "Estaleiro Básico - Operações navais simples",
            2: "Estaleiro Melhorado - Maior eficiência produtiva",
            3: "Estaleiro Avançado - Construção de navios médios",
            4: "Estaleiro Industrial - Produção em série",
            5: "Estaleiro Moderno - Tecnologia avançada",
            6: "Complexo Naval - Múltiplos projetos simultâneos",
            7: "Arsenal Imperial - Construção de grandes navios",
            8: "Estaleiro de Elite - Eficiência excepcional",
            9: "Complexo Estratégico - Supremacia naval",
            10: "Arsenal Supremo - Poder naval absoluto"
        };
        return descriptions[level] || "Nível desconhecido";
    }

    /**
     * Verificar se pode fazer upgrade
     */
    canUpgrade(currentLevel, countryData, globalAverageGDP, countryBudget) {
        if (currentLevel >= this.maxLevel) return { canUpgrade: false, reason: "Nível máximo atingido" };

        const upgradeCost = this.calculateUpgradeCost(currentLevel, countryData, globalAverageGDP);
        if (countryBudget < upgradeCost) {
            return {
                canUpgrade: false,
                reason: `Orçamento insuficiente. Necessário: ${upgradeCost.toLocaleString()}`
            };
        }

        return { canUpgrade: true, upgradeCost };
    }

    /**
     * Aplicar bônus aos dados de produção naval
     */
    applyShipyardBonusToProduction(baseProductionData, shipyardLevel, productionLineBonus = 0) {
        const bonus = this.calculateProductionBonus(shipyardLevel);
        
        const finalBuildTime = baseProductionData.build_time_months * (1 - bonus.timeReduction) * (1 - productionLineBonus);

        return {
            ...baseProductionData,
            build_time_months: Math.ceil(finalBuildTime),
            max_parallel: Math.ceil((baseProductionData.max_parallel || 1) * bonus.parallelMultiplier),
            shipyard_efficiency: bonus.parallelMultiplier,
            time_reduction_percent: Math.round(bonus.timeReduction * 100),
            production_line_bonus_percent: Math.round(productionLineBonus * 100)
        };
    }

    /**
     * Obter nível atual do estaleiro do país
     */
    async getCurrentShipyardLevel(countryId) {
        try {
            const countryDoc = await db.collection('paises').doc(countryId).get();
            if (!countryDoc.exists) return 0;

            const data = countryDoc.data();
            return data.shipyardLevel || 0;
        } catch (error) {
            console.error('Erro ao obter nível do estaleiro:', error);
            return 0;
        }
    }

    /**
     * Realizar upgrade do estaleiro
     */
    async upgradeShipyard(countryId) {
        try {
            const countryDoc = await db.collection('paises').doc(countryId).get();
            if (!countryDoc.exists) throw new Error("País não encontrado.");
            const countryData = countryDoc.data();
            const currentLevel = countryData.shipyardLevel || 0;

            // Calcular orçamento atual
            const pibBruto = parseFloat(countryData.PIB) || 0;
            const burocracia = (parseFloat(countryData.Burocracia) || 0) / 100;
            const estabilidade = (parseFloat(countryData.Estabilidade) || 0) / 100;
            const budget = pibBruto * 0.25 * burocracia * (estabilidade * 1.5);

            // Buscar PIB médio global para cálculo de custo dinâmico
            const globalAverageGDP = await getGlobalAverageGDP();

            const canUpgradeResult = this.canUpgrade(currentLevel, countryData, globalAverageGDP, budget);
            if (!canUpgradeResult.canUpgrade) {
                throw new Error(canUpgradeResult.reason);
            }

            const newLevel = currentLevel + 1;
            const upgradeCost = canUpgradeResult.upgradeCost;

            // Atualizar nível do estaleiro
            await db.collection('paises').doc(countryId).update({
                shipyardLevel: newLevel,
                lastShipyardUpgrade: new Date()
            });

            // Registrar transação (opcional)
            await db.collection('shipyard_transactions').add({
                countryId,
                type: 'upgrade',
                fromLevel: currentLevel,
                toLevel: newLevel,
                cost: upgradeCost,
                timestamp: new Date()
            });

            return {
                success: true,
                newLevel,
                cost: upgradeCost,
                levelInfo: this.getLevelInfo(newLevel, countryData, globalAverageGDP)
            };

        } catch (error) {
            console.error('Erro ao fazer upgrade do estaleiro:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Aplicar custos de manutenção mensais (chamado pelo sistema de turnos)
     */
    async applyMaintenanceCosts() {
        try {
            console.log('🔧 Aplicando custos de manutenção dos estaleiros...');

            const countriesSnapshot = await db.collection('paises').get();
            const results = [];

            for (const doc of countriesSnapshot.docs) {
                const countryData = doc.data();
                const shipyardLevel = countryData.shipyardLevel || 0;

                if (shipyardLevel === 0) continue;

                // Calcular orçamento atual
                const pibBruto = parseFloat(countryData.PIB) || 0;
                const burocracia = (parseFloat(countryData.Burocracia) || 0) / 100;
                const estabilidade = (parseFloat(countryData.Estabilidade) || 0) / 100;
                const budget = pibBruto * 0.25 * burocracia * (estabilidade * 1.5);

      const maintenanceCost = this.calculateMaintenanceCost(shipyardLevel, budget);
      const maintenancePercent = (maintenanceCost / budget) * 100;

      // Aplicar penalidade de estabilidade se a manutenção for muito cara
      let stabilityImpact = 0;
      if (maintenancePercent > 10) { // Mais de 10% do orçamento
        stabilityImpact = -Math.min(5, Math.floor((maintenancePercent - 10) / 2));
      }

      const finalStability = Math.max(0, (parseFloat(countryData.Estabilidade) || 0) + stabilityImpact);

      const updates = {
        lastShipyardMaintenance: new Date(),
      };

      if (stabilityImpact !== 0) {
        updates.Estabilidade = finalStability;
      }

      await l.collection("paises").doc(o.id).update(updates);

      // Registrar no BudgetTracker
      await BudgetTracker.addExpense(
        o.id,
        BudgetTracker.EXPENSE_CATEGORIES.SHIPYARD_MAINTENANCE,
        maintenanceCost,
        `Manutenção de Estaleiros (Nível ${shipyardLevel})`
      );

      t.push({
        countryId: o.id,
        countryName: a.Pais,
        shipyardLevel: n,
        maintenanceCost: s,
        maintenancePercent: r.toFixed(2),
        stabilityImpact: i,
      });
            }

            console.log(`✅ Manutenção aplicada a ${results.length} países com estaleiros`);
            return results;

        } catch (error) {
            console.error('❌ Erro ao aplicar manutenção dos estaleiros:', error);
            throw error;
        }
    }
}