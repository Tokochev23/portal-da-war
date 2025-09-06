/**
 * Script de migração SIMPLES para PIB per capita
 * Execute no console do narrador.html para migrar os dados imediatamente
 */

async function migrarParaPIBPerCapita() {
    console.log('🔄 Iniciando migração para PIB per capita...');
    
    try {
        // Importar função de cálculo
        const { calculatePIBPerCapita } = await import('./js/utils/pibCalculations.js');
        
        // Buscar todos os países
        const snapshot = await db.collection('paises').get();
        console.log(`📂 Encontrados ${snapshot.docs.length} países`);
        
        let migrados = 0;
        let pulados = 0;
        
        for (const doc of snapshot.docs) {
            const country = { id: doc.id, ...doc.data() };
            const pib = parseFloat(country.PIB) || 0;
            const populacao = parseFloat(country.Populacao) || 0;
            const pibPerCapitaAtual = parseFloat(country.PIBPerCapita) || 0;
            
            // Se já tem PIB per capita, pular
            if (pibPerCapitaAtual > 0) {
                console.log(`⏭️ ${country.Pais || country.id}: já tem PIB per capita`);
                pulados++;
                continue;
            }
            
            // Se não tem PIB ou população, pular
            if (pib <= 0 || populacao <= 0) {
                console.log(`⏭️ ${country.Pais || country.id}: dados insuficientes (PIB: ${pib}, Pop: ${populacao})`);
                pulados++;
                continue;
            }
            
            // Calcular PIB per capita
            const pibPerCapita = calculatePIBPerCapita(pib, populacao);
            
            // Atualizar no Firebase
            await db.collection('paises').doc(country.id).update({
                PIBPerCapita: pibPerCapita,
                _migradoEm: new Date(),
                _versaoSistema: 'pib-per-capita-v1'
            });
            
            console.log(`✅ ${country.Pais || country.id}: PIB per capita = $${pibPerCapita.toFixed(2)}`);
            migrados++;
        }
        
        console.log(`🎉 Migração concluída! Migrados: ${migrados}, Pulados: ${pulados}`);
        
        // Recarregar página para ver mudanças
        if (migrados > 0) {
            console.log('🔄 Recarregando página para aplicar mudanças...');
            setTimeout(() => location.reload(), 2000);
        }
        
    } catch (error) {
        console.error('💥 Erro na migração:', error);
        throw error;
    }
}

// Executar automaticamente se db estiver disponível
if (typeof db !== 'undefined') {
    console.log('🚀 Script de migração carregado! Executando em 3 segundos...');
    setTimeout(migrarParaPIBPerCapita, 3000);
} else {
    console.log('⚠️ Firebase não detectado. Execute migrarParaPIBPerCapita() manualmente após carregar o narrador.');
    window.migrarParaPIBPerCapita = migrarParaPIBPerCapita;
}