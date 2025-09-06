/**
 * Script para sincronizar dados entre raiz e seção 'geral'
 * Execute no console do narrador.html
 */

async function sincronizarDadosGeral() {
    console.log('🔄 Sincronizando dados raiz → geral...');
    
    try {
        const snapshot = await db.collection('paises').get();
        console.log(`📂 Processando ${snapshot.docs.length} países...`);
        
        let atualizados = 0;
        const batch = db.batch();
        
        snapshot.docs.forEach(doc => {
            const country = doc.data();
            const updates = {};
            let needsUpdate = false;
            
            // PIB
            if (country.PIB && country.PIB !== country.geral?.PIB) {
                updates['geral.PIB'] = country.PIB;
                needsUpdate = true;
                console.log(`📊 ${country.Pais || doc.id}: PIB ${country.PIB.toLocaleString()}`);
            }
            
            // PIB per Capita
            if (country.PIBPerCapita && country.PIBPerCapita !== country.geral?.PIBPerCapita) {
                updates['geral.PIBPerCapita'] = country.PIBPerCapita;
                needsUpdate = true;
                console.log(`💰 ${country.Pais || doc.id}: PIB per capita $${country.PIBPerCapita.toFixed(2)}`);
            }
            
            // População
            if (country.Populacao && country.Populacao !== country.geral?.Populacao) {
                updates['geral.Populacao'] = country.Populacao;
                needsUpdate = true;
            }
            
            // Estabilidade
            if (country.Estabilidade && country.Estabilidade !== country.geral?.Estabilidade) {
                updates['geral.Estabilidade'] = country.Estabilidade;
                needsUpdate = true;
            }
            
            // Tecnologia
            if (country.Tecnologia && country.Tecnologia !== country.geral?.Tecnologia) {
                updates['geral.Tecnologia'] = country.Tecnologia;
                needsUpdate = true;
            }
            
            // Urbanização
            if (country.Urbanizacao && country.Urbanizacao !== country.geral?.Urbanizacao) {
                updates['geral.Urbanizacao'] = country.Urbanizacao;
                needsUpdate = true;
            }
            
            if (needsUpdate) {
                batch.update(doc.ref, updates);
                atualizados++;
            }
        });
        
        if (atualizados > 0) {
            await batch.commit();
            console.log(`✅ ${atualizados} países atualizados!`);
            
            // Recarregar página
            setTimeout(() => {
                console.log('🔄 Recarregando página...');
                location.reload();
            }, 2000);
        } else {
            console.log('ℹ️ Todos os dados já estão sincronizados');
        }
        
    } catch (error) {
        console.error('💥 Erro na sincronização:', error);
    }
}

// Executar automaticamente
if (typeof db !== 'undefined') {
    console.log('🔄 Iniciando sincronização em 2 segundos...');
    setTimeout(sincronizarDadosGeral, 2000);
} else {
    console.log('⚠️ Firebase não detectado. Execute sincronizarDadosGeral() manualmente.');
}

window.sincronizarDadosGeral = sincronizarDadosGeral;