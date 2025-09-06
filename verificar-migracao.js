/**
 * Script para verificar e corrigir migração PIB per capita
 * Execute no console do narrador.html
 */

async function verificarMigracao() {
    console.log('🔍 Verificando migração PIB per capita...');
    
    try {
        // Buscar Afeganistão especificamente
        const afegDoc = await db.collection('paises').doc('afeganistao').get();
        const afeganistao = afegDoc.data();
        
        console.log('📊 Dados atuais do Afeganistão:');
        console.log('- PIB Total:', afeganistao?.PIB?.toLocaleString() || 'Não definido');
        console.log('- PIB per Capita:', afeganistao?.PIBPerCapita?.toLocaleString() || 'Não definido');
        console.log('- População:', afeganistao?.Populacao?.toLocaleString() || 'Não definido');
        console.log('- Migrado em:', afeganistao?._migradoEm || 'Não migrado');
        
        // Se não tem PIB per capita, fazer migração manual
        if (!afeganistao?.PIBPerCapita && afeganistao?.PIB && afeganistao?.Populacao) {
            console.log('⚠️ Afeganistão precisa de migração manual...');
            
            const pibPerCapita = afeganistao.PIB / afeganistao.Populacao;
            
            await db.collection('paises').doc('afeganistao').update({
                PIBPerCapita: pibPerCapita,
                _migradoEm: new Date(),
                _migracaoManual: true
            });
            
            console.log(`✅ Migração manual concluída! PIB per capita: $${pibPerCapita.toFixed(2)}`);
            
            // Recarregar página
            setTimeout(() => {
                console.log('🔄 Recarregando para aplicar mudanças...');
                location.reload();
            }, 2000);
        }
        
        // Verificar outros países
        const snapshot = await db.collection('paises').limit(5).get();
        let semPIBPerCapita = 0;
        
        snapshot.docs.forEach(doc => {
            const country = doc.data();
            if (!country.PIBPerCapita && country.PIB && country.Populacao) {
                semPIBPerCapita++;
                console.log(`❌ ${country.Pais || doc.id}: sem PIB per capita`);
            }
        });
        
        if (semPIBPerCapita > 0) {
            console.log(`⚠️ ${semPIBPerCapita} países ainda precisam de migração`);
            console.log('💡 Execute migrarTodosOsPaises() para migrar todos de uma vez');
        } else {
            console.log('🎉 Todos os países verificados têm PIB per capita!');
        }
        
    } catch (error) {
        console.error('💥 Erro na verificação:', error);
    }
}

async function migrarTodosOsPaises() {
    console.log('🚀 Migrando todos os países...');
    
    try {
        const { calculatePIBPerCapita } = await import('./js/utils/pibCalculations.js');
        const snapshot = await db.collection('paises').get();
        
        let migrados = 0;
        const batch = db.batch();
        
        snapshot.docs.forEach(doc => {
            const country = doc.data();
            const pib = parseFloat(country.PIB) || 0;
            const populacao = parseFloat(country.Populacao) || 0;
            const pibPerCapitaAtual = parseFloat(country.PIBPerCapita) || 0;
            
            // Se precisa de migração
            if (!pibPerCapitaAtual && pib > 0 && populacao > 0) {
                const pibPerCapita = calculatePIBPerCapita(pib, populacao);
                
                batch.update(doc.ref, {
                    PIBPerCapita: pibPerCapita,
                    _migradoEm: new Date(),
                    _migracaoCompleta: true
                });
                
                console.log(`📝 ${country.Pais || doc.id}: $${pibPerCapita.toFixed(2)}`);
                migrados++;
            }
        });
        
        if (migrados > 0) {
            await batch.commit();
            console.log(`✅ ${migrados} países migrados com sucesso!`);
            
            setTimeout(() => {
                console.log('🔄 Recarregando página...');
                location.reload();
            }, 2000);
        } else {
            console.log('ℹ️ Nenhum país precisava de migração');
        }
        
    } catch (error) {
        console.error('💥 Erro na migração completa:', error);
    }
}

// Executar verificação automaticamente
if (typeof db !== 'undefined') {
    console.log('🔍 Iniciando verificação em 2 segundos...');
    setTimeout(verificarMigracao, 2000);
} else {
    console.log('⚠️ Firebase não detectado. Execute verificarMigracao() após carregar o narrador.');
}

// Exportar funções para uso manual
window.verificarMigracao = verificarMigracao;
window.migrarTodosOsPaises = migrarTodosOsPaises;