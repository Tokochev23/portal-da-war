// js/utils/armorFunctions.js - Funções globais para o sistema de blindagem

// Função para atualizar material da blindagem
window.updateArmorMaterial = function(materialId) {
    if (window.currentVehicle) {
        window.currentVehicle.armorMaterial = materialId;
        updateArmorEfficiency();
        updateVehicleCalculations();
        
        console.log('Material de blindagem atualizado:', materialId);
    }
};

// Função para atualizar espessura da blindagem
window.updateArmorThickness = function(thickness) {
    const thicknessValue = parseInt(thickness);
    if (window.currentVehicle) {
        window.currentVehicle.armorThickness = thicknessValue;
        
        // Atualizar display
        const display = document.getElementById('armor-thickness-display');
        if (display) {
            display.textContent = thicknessValue + 'mm';
        }
        
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
        document.querySelectorAll('[onclick^="selectArmorAngle"]').forEach(card => {
            card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400', 'shadow-brand-500/20', 'shadow-lg');
            card.classList.add('bg-slate-800/40', 'border-slate-700/50');
            
            // Remover indicador selecionado
            const indicator = card.querySelector('.animate-pulse');
            if (indicator) {
                indicator.parentElement.remove();
            }
        });
        
        // Marcar novo selecionado
        const selectedCard = document.querySelector(`[onclick="selectArmorAngle('${angleId}')"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected', 'bg-brand-900/30', 'border-brand-400', 'shadow-brand-500/20', 'shadow-lg');
            selectedCard.classList.remove('bg-slate-800/40', 'border-slate-700/50');
            
            // Adicionar indicador
            const indicator = document.createElement('div');
            indicator.className = 'absolute top-2 right-2';
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
                card.classList.add('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.remove('bg-slate-700/30', 'border-slate-600/50');
                
                // Adicionar indicador
                const indicator = document.createElement('div');
                indicator.className = 'absolute top-1 right-1';
                indicator.innerHTML = '<div class="w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>';
                card.appendChild(indicator);
            } else {
                card.classList.remove('selected', 'bg-brand-900/30', 'border-brand-400');
                card.classList.add('bg-slate-700/30', 'border-slate-600/50');
                
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
    
    const summaryContainer = document.getElementById('armor-efficiency-summary');
    if (!summaryContainer) return;
    
    const thickness = window.currentVehicle.armorThickness || 80;
    const materialId = window.currentVehicle.armorMaterial || 'rolled_homogeneous_armor';
    const angleId = window.currentVehicle.armorAngle || 'vertical_90';
    const additionalIds = window.currentVehicle.additionalArmor || [];
    
    const materials = window.VEHICLE_COMPONENTS.armor_materials;
    const angles = window.VEHICLE_COMPONENTS.armor_angles;
    const additionalArmors = window.VEHICLE_COMPONENTS.additional_armor;
    
    if (window.tabLoaders) {
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
    const armorPreview = document.getElementById('armor-preview');
    if (!armorPreview) return;
    
    // Calcular eficiência
    const material = materials[materialId];
    const angle = angles[angleId];
    const additional = additionalIds.map(id => additionalArmors[id]).filter(Boolean);
    
    let effectiveness = thickness;
    
    // Aplicar fator do material
    if (material?.effectiveness_factor) {
        effectiveness *= material.effectiveness_factor;
    }
    
    // Aplicar multiplicador do ângulo
    if (angle?.effectiveness_multiplier) {
        effectiveness *= angle.effectiveness_multiplier;
    }
    
    // Adicionar blindagens adicionais
    additional.forEach(armor => {
        if (armor?.protection_bonus) {
            effectiveness += armor.protection_bonus * (armor.effectiveness_vs?.ap || 1.0);
        }
    });
    
    const effectiveThickness = Math.round(effectiveness);
    
    // Determinar cor baseada na eficiência
    let colorClass;
    if (effectiveThickness >= 200) colorClass = 'text-green-400';
    else if (effectiveThickness >= 150) colorClass = 'text-blue-400';
    else if (effectiveThickness >= 100) colorClass = 'text-yellow-400';
    else if (effectiveThickness >= 50) colorClass = 'text-orange-400';
    else colorClass = 'text-red-400';
    
    armorPreview.innerHTML = `<span class="${colorClass}">${effectiveThickness}mm efetivos</span>`;
}

// Função para atualizar cálculos do veículo (placeholder para integração)
function updateVehicleCalculations() {
    if (window.updateVehicleCalculations && typeof window.updateVehicleCalculations === 'function') {
        window.updateVehicleCalculations();
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