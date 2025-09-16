// js/systems/shipyardSystem.js - Sistema de Estaleiros

import { db, auth } from '../services/firebase.js';
import { checkPlayerCountry } from '../services/firebase.js';

export class ShipyardSystem {
    constructor() {
        this.maxLevel = 10;
        this.baseCost = 200000000; // $200M base para nível 1 (reduzido 60%)
        this.baseMaintenancePercent = 0.005; // 0.5% do orçamento para nível 1
    }

    /**
     * Calcular custo de upgrade para próximo nível
     * Fórmula exponencial suavizada: baseCost * (level^2) * 1.6^level
     */
    calculateUpgradeCost(currentLevel, targetLevel = null) {
        if (currentLevel >= this.maxLevel) return 0;

        const nextLevel = targetLevel || (currentLevel + 1);
        if (nextLevel > this.maxLevel) return 0;

        // Custo exponencial mais suave (reduzido significativamente)
        const cost = this.baseCost * Math.pow(nextLevel, 2) * Math.pow(1.6, nextLevel);
        return Math.round(cost);
    }

    /**
     * Calcular custo de manutenção mensal
     * Fórmula exponencial: basePercent * (level^2) * 1.5^level
     */
    calculateMaintenanceCost(level, countryBudget) {
        if (level === 0) return 0;

        // Percentual exponencial do orçamento
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

        // Bônus progressivo
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
    getLevelInfo(level) {
        const bonus = this.calculateProductionBonus(level);
        const upgradeCost = this.calculateUpgradeCost(level);

        return {
            level,
            description: this.getLevelDescription(level),
            upgradeCost,
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
    canUpgrade(currentLevel, countryBudget) {
        if (currentLevel >= this.maxLevel) return { canUpgrade: false, reason: "Nível máximo atingido" };

        const upgradeCost = this.calculateUpgradeCost(currentLevel);
        if (countryBudget < upgradeCost) {
            return {
                canUpgrade: false,
                reason: `Orçamento insuficiente. Necessário: $${upgradeCost.toLocaleString()}`
            };
        }

        return { canUpgrade: true, upgradeCost };
    }

    /**
     * Aplicar bônus aos dados de produção naval
     */
    applyShipyardBonusToProduction(baseProductionData, shipyardLevel) {
        const bonus = this.calculateProductionBonus(shipyardLevel);

        return {
            ...baseProductionData,
            build_time_months: Math.ceil(baseProductionData.build_time_months * (1 - bonus.timeReduction)),
            max_parallel: Math.ceil((baseProductionData.max_parallel || 1) * bonus.parallelMultiplier),
            shipyard_efficiency: bonus.parallelMultiplier,
            time_reduction_percent: Math.round(bonus.timeReduction * 100)
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
            const currentLevel = await this.getCurrentShipyardLevel(countryId);
            const countryDoc = await db.collection('paises').doc(countryId).get();
            const countryData = countryDoc.data();

            // Calcular orçamento atual (usar a mesma fórmula do dashboard)
            const pibBruto = parseFloat(countryData.PIB) || 0;
            const burocracia = (parseFloat(countryData.Burocracia) || 0) / 100;
            const estabilidade = (parseFloat(countryData.Estabilidade) || 0) / 100;
            const budget = pibBruto * 0.25 * burocracia * (estabilidade * 1.5);

            const canUpgradeResult = this.canUpgrade(currentLevel, budget);
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
                levelInfo: this.getLevelInfo(newLevel)
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

                // Aplicar impacto na estabilidade se manutenção for muito alta
                let stabilityImpact = 0;
                if (maintenancePercent > 10) { // Mais de 10% do orçamento
                    stabilityImpact = -Math.min(5, Math.floor((maintenancePercent - 10) / 2));
                }

                const newStability = Math.max(0, (parseFloat(countryData.Estabilidade) || 0) + stabilityImpact);

                // Atualizar país
                const updates = {
                    lastShipyardMaintenance: new Date(),
                    shipyardMaintenanceCost: maintenanceCost
                };

                if (stabilityImpact !== 0) {
                    updates.Estabilidade = newStability;
                }

                await db.collection('paises').doc(doc.id).update(updates);

                results.push({
                    countryId: doc.id,
                    countryName: countryData.Pais,
                    shipyardLevel,
                    maintenanceCost,
                    maintenancePercent: maintenancePercent.toFixed(2),
                    stabilityImpact
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