// js/utils/armorFunctions.js - Funções globais para o sistema de blindagem

// Função para atualizar material da blindagem
window.updateArmorMaterial = function(materialId) {
    if (window.currentVehicle) {
        window.currentVehicle.armorMaterial = materialId;
        // Atualizar visual
        try {
            document.querySelectorAll('[onclick^="updateArmorMaterial("]').forEach(card => {
                // Remover classes de seleção e estilo realçado
                card.classList.remove('selected', 'border-brand-400', 'border-2', 'shadow-lg', 'shadow-brand-500/20', 'from-brand-900/40', 'to-brand-800/30');
                // Repor classes base
                card.classList.add('border', 'border-slate-700/50', 'from-slate-800/60', 'to-slate-900/40');
                // Remover SOMENTE o nosso indicador, se presente
                card.querySelectorAll('[data-selected-indicator]')?.forEach(el => el.remove());
            });
            const selectedCard = document.querySelector(`[onclick="updateArmorMaterial('${materialId}')"]`);
            if (selectedCard) {
                selectedCard.classList.remove('border', 'border-slate-700/50', 'from-slate-800/60', 'to-slate-900/40');
                selectedCard.classList.add('selected', 'border-brand-400', 'border-2', 'shadow-lg', 'shadow-brand-500/20', 'from-brand-900/40', 'to-brand-800/30');
                const indicatorWrap = document.createElement('div');
                indicatorWrap.className = 'absolute top-2 right-2';
                indicatorWrap.setAttribute('data-selected-indicator', '');
                indicatorWrap.innerHTML = '<div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>';
                selectedCard.appendChild(indicatorWrap);
            }
        } catch (e) { /* noop */ }
        updateArmorEfficiency();
        updateVehicleCalculations();
        
        console.log('Material de blindagem atualizado:', materialId);
    }
};

// Função para atualizar espessura da blindagem
window.updateArmorThickness = function(thickness) {
    const thicknessValue = parseInt(thickness);
    if (window.currentVehicle) {
        // Sync both naming conventions
        window.currentVehicle.armorThickness = thicknessValue;
        window.currentVehicle.armor_thickness = thicknessValue;
        
        // Atualizar display (tolerante a variações de layout)
        const ids = ['armor-thickness-display', 'armor-thickness-value'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = thicknessValue + ' mm';
            }
        });
        
        updateArmorEfficiency();
        updateVehicleCalculations();
        
        console.log('Espessura de blindagem atualizada:', thicknessValue);
    }
};

// Função para selecionar ângulo da blindagem
window.selectArmorAngle = function(angleId) {
    if (window.currentVehicle) {
        window.currentVehicle.armorAngle = angleId;
        
        // Atualizar visual
        document.querySelectorAll('[onclick^="selectArmorAngle("]').forEach(card => {
            card.classList.remove('selected', 'border-brand-400', 'border-2', 'shadow-brand-500/20', 'shadow-lg', 'from-brand-900/40', 'to-brand-800/30');
            card.classList.add('border', 'border-slate-700/50', 'from-slate-800/60', 'to-slate-900/40');
            // Remover indicador selecionado
            card.querySelectorAll('[data-selected-indicator]')?.forEach(el => el.remove());
        });
        
        // Marcar novo selecionado
        const selectedCard = document.querySelector(`[onclick="selectArmorAngle('${angleId}')"]`);
        if (selectedCard) {
            selectedCard.classList.remove('border', 'border-slate-700/50', 'from-slate-800/60', 'to-slate-900/40');
            selectedCard.classList.add('selected', 'border-brand-400', 'border-2', 'shadow-brand-500/20', 'shadow-lg', 'from-brand-900/40', 'to-brand-800/30');
            // Adicionar indicador
        const indicator = document.createElement('div');
        indicator.className = 'absolute top-2 right-2';
        indicator.setAttribute('data-selected-indicator', '');
        indicator.innerHTML = '<div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>';
        selectedCard.appendChild(indicator);
    }
        
        updateArmorEfficiency();
        updateVehicleCalculations();
        
        console.log('Ângulo de blindagem selecionado:', angleId);
    }
};

// Função para alternar blindagem adicional
window.toggleAdditionalArmor = function(armorId) {
    if (window.currentVehicle) {
        if (!window.currentVehicle.additionalArmor) {
            window.currentVehicle.additionalArmor = [];
        }
        
        const index = window.currentVehicle.additionalArmor.indexOf(armorId);
        
        if (index > -1) {
            // Remover
            window.currentVehicle.additionalArmor.splice(index, 1);
        } else {
            // Adicionar
            window.currentVehicle.additionalArmor.push(armorId);
        }
        
        // Atualizar visual do card
        const card = document.querySelector(`[onclick="toggleAdditionalArmor('${armorId}')"]`);
        if (card) {
            const isSelected = window.currentVehicle.additionalArmor.includes(armorId);
            
            if (isSelected) {
                card.classList.add('selected', 'border-brand-400');
                
                // Adicionar indicador
                const indicator = document.createElement('div');
                indicator.className = 'absolute top-1 right-1';
                indicator.innerHTML = '<div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>';
                card.appendChild(indicator);
            } else {
                card.classList.remove('selected', 'border-brand-400');
                
                // Remover indicador
                const indicator = card.querySelector('.animate-pulse');
                if (indicator) {
                    indicator.parentElement.remove();
                }
            }
        }
        
        updateArmorEfficiency();
        updateVehicleCalculations();
        
        console.log('Blindagem adicional alterada:', armorId, window.currentVehicle.additionalArmor);
    }
};

// Função para calcular e atualizar eficiência da blindagem
function updateArmorEfficiency() {
    if (!window.currentVehicle || !window.VEHICLE_COMPONENTS) return;
    
    const thickness = (window.currentVehicle.armorThickness ?? window.currentVehicle.armor_thickness ?? 80);
    const materialId = window.currentVehicle.armorMaterial || 'rolled_homogeneous_armor';
    const angleId = window.currentVehicle.armorAngle || 'vertical_90';
    const additionalIds = window.currentVehicle.additionalArmor || [];
    
    const materials = window.VEHICLE_COMPONENTS.armor_materials;
    const angles = window.VEHICLE_COMPONENTS.armor_angles;
    const additionalArmors = window.VEHICLE_COMPONENTS.additional_armor;
    
    console.log('Atualizando eficiência de blindagem:', {
        thickness,
        materialId,
        angleId,
        additionalIds,
        material: materials[materialId],
        angle: angles[angleId]
    });
    
    const summaryContainer = document.getElementById('armor-efficiency-summary');
    if (summaryContainer && window.tabLoaders) {
        summaryContainer.innerHTML = window.tabLoaders.calculateArmorEfficiency(
            thickness, materialId, angleId, additionalIds, 
            materials, angles, additionalArmors
        );
    }
    
    // Atualizar preview no resumo principal (se existir)
    updateArmorPreview(thickness, materialId, angleId, additionalIds, materials, angles, additionalArmors);
}

// Função para atualizar preview de blindagem no resumo principal
function updateArmorPreview(thickness, materialId, angleId, additionalIds, materials, angles, additionalArmors) {
    if (!materials || !angles) {
        console.log('Materiais ou ângulos não disponíveis');
        return;
    }
    
    const armorPreview = document.getElementById('armor-preview');
    
    // Obter dados dos componentes
    const material = materials[materialId];
    const angle = angles[angleId];
    const additional = additionalIds.map(id => additionalArmors?.[id]).filter(Boolean);
    
    console.log('Calculando blindagem:', {
        thickness,
        material: material?.name,
        materialFactor: material?.effectiveness_factor,
        angle: angle?.name,
        angleFactor: angle?.effectiveness_multiplier,
        additionalCount: additional.length
    });
    
    let effectiveness = thickness;
    let totalEffectiveness = 1.0;
    
    // Aplicar fator do material
    if (material?.effectiveness_factor) {
        effectiveness *= material.effectiveness_factor;
        totalEffectiveness *= material.effectiveness_factor;
    }
    
    // Aplicar multiplicador do ângulo
    if (angle?.effectiveness_multiplier) {
        effectiveness *= angle.effectiveness_multiplier;
        totalEffectiveness *= angle.effectiveness_multiplier;
    }
    
    // Adicionar blindagens adicionais
    additional.forEach(armor => {
        if (armor?.protection_bonus) {
            const bonus = armor.protection_bonus * (armor.effectiveness_vs?.ap || 1.0);
            effectiveness += bonus;
        }
    });
    
    const effectiveThickness = Math.round(effectiveness);
    
    console.log('Resultado do cálculo:', {
        baseThickness: thickness,
        totalEffectiveness,
        effectiveThickness
    });
    
    // Determinar cor baseada na eficiência
    let colorClass;
    if (effectiveThickness >= 200) colorClass = 'text-green-400';
    else if (effectiveThickness >= 150) colorClass = 'text-blue-400';
    else if (effectiveThickness >= 100) colorClass = 'text-yellow-400';
    else if (effectiveThickness >= 50) colorClass = 'text-orange-400';
    else colorClass = 'text-red-400';
    
    if (armorPreview) {
        armorPreview.innerHTML = `<span class="${colorClass}">${effectiveThickness}mm efetivos</span>`;
    }
    
    // Atualizar resumo detalhado se existir
    updateArmorSummaryCards(thickness, materialId, angleId, totalEffectiveness, effectiveThickness, material, angle);
}

// Nova função para atualizar o resumo detalhado
function updateArmorSummaryCards(baseThickness, materialId, angleId, totalEffectiveness, effectiveThickness, material, angle) {
    // Atualizar espessura base
    const baseThicknessEl = document.getElementById('summary-base-thickness');
    if (baseThicknessEl) {
        baseThicknessEl.textContent = baseThickness + ' mm';
    }
    
    // Atualizar efetividade total
    const effectivenessEl = document.getElementById('summary-effectiveness');
    if (effectivenessEl) {
        effectivenessEl.textContent = 'x' + totalEffectiveness.toFixed(2);
    }
    
    // Atualizar espessura efetiva
    const effectiveThicknessEl = document.getElementById('summary-effective-thickness');
    if (effectiveThicknessEl) {
        effectiveThicknessEl.textContent = effectiveThickness + ' mm';
    }
    
    // Atualizar material
    const materialEl = document.getElementById('summary-material');
    if (materialEl && material) {
        // Abreviar nomes longos
        let materialName = material.name;
        if (materialName.includes('Aço Laminado')) materialName = 'RHA';
        else if (materialName.includes('Comum')) materialName = 'Aço Comum';
        else if (materialName.includes('Endurecida')) materialName = 'Endurecida';
        else if (materialName.includes('Fundida')) materialName = 'Fundida';
        else if (materialName.includes('Composta')) materialName = 'Composta';
        
        materialEl.textContent = materialName;
    }
    
    // Atualizar ângulo
    const angleEl = document.getElementById('summary-angle');
    if (angleEl && angle) {
        angleEl.textContent = angle.name;
    }
    
    // Atualizar peso relativo (baseado no material)
    const weightEl = document.getElementById('summary-weight');
    if (weightEl && material) {
        const weightFactor = material.weight_factor || 1;
        weightEl.textContent = 'x' + weightFactor.toFixed(2);
    }
}

// Função para atualizar cálculos do veículo (placeholder para integração)
function updateVehicleCalculations() {
    console.log('Atualizando todos os cálculos do veículo...');
    
    // Chamar a função global se existir
    if (window.updateVehicleCalculations && typeof window.updateVehicleCalculations === 'function') {
        window.updateVehicleCalculations();
    }
    
    // Garantir que os sistemas específicos sejam atualizados
    try {
        // Atualizar custos
        if (window.CostSystem && window.currentVehicle) {
            const costContainer = document.getElementById('cost-breakdown');
            if (costContainer) {
                const costHtml = window.CostSystem.renderCostDisplay(window.currentVehicle);
                costContainer.innerHTML = costHtml;
                console.log('✅ Sistema de custos atualizado');
            }
        }
        
        // Atualizar energia
        if (window.EnergySystem && window.currentVehicle) {
            const energyContainer = document.getElementById('energy-analysis');
            if (energyContainer) {
                const energyHtml = window.EnergySystem.renderEnergyDisplay(window.currentVehicle);
                energyContainer.innerHTML = energyHtml;
                console.log('✅ Sistema de energia atualizado');
            }
        }
        
        // Atualizar performance
        if (window.PerformanceSystem && window.currentVehicle) {
            const performanceContainer = document.getElementById('performance-analysis');
            if (performanceContainer) {
                const performanceHtml = window.PerformanceSystem.renderPerformanceDisplay(window.currentVehicle);
                performanceContainer.innerHTML = performanceHtml;
                console.log('✅ Sistema de performance atualizado');
            }
        }
        
        // Atualizar gráfico de performance se existir
        if (window.updatePerformanceChart && typeof window.updatePerformanceChart === 'function') {
            window.updatePerformanceChart();
            console.log('✅ Gráfico de performance atualizado');
        }
        
    } catch (error) {
        console.error('❌ Erro ao atualizar sistemas:', error);
    }
    
    console.log('Cálculos do veículo atualizados com nova blindagem');
}

// Exportar funções para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateArmorMaterial,
        updateArmorThickness,
        selectArmorAngle,
        toggleAdditionalArmor,
        updateArmorEfficiency
    };
}
