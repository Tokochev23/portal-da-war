
/**
 * Script para definir os níveis de tecnologia militar iniciais para cada país.
 * Execute no console do narrador.html para definir os dados.
 */

async function setInitialTechLevels() {
    console.log('🔄 Iniciando a definição dos níveis de tecnologia...');

    const techLevels = {
        "Estados Unidos": { aeronautica: 75, marinha: 75, veiculos: 65 },
        "União Soviética": { aeronautica: 75, marinha: 60, veiculos: 75 },
        "Reino Unido": { aeronautica: 65, marinha: 70, veiculos: 60 },
        "França": { aeronautica: 60, marinha: 60, veiculos: 60 },
        "Alemanha Ocidental": { aeronautica: 60, marinha: 50, veiculos: 70 },
        "Alemanha Oriental": { aeronautica: 55, marinha: 45, veiculos: 65 },
        "China": { aeronautica: 50, marinha: 50, veiculos: 50 },
        "Japão": { aeronautica: 55, marinha: 65, veiculos: 55 },
        "Canadá": { aeronautica: 50, marinha: 55, veiculos: 50 },
        "Itália": { aeronautica: 55, marinha: 55, veiculos: 55 },
        "Austrália": { aeronautica: 45, marinha: 50, veiculos: 45 },
        "Índia": { aeronautica: 40, marinha: 40, veiculos: 40 },
        "Brasil": { aeronautica: 40, marinha: 40, veiculos: 40 },
        "Argentina": { aeronautica: 35, marinha: 35, veiculos: 35 },
        "África do Sul": { aeronautica: 30, marinha: 30, veiculos: 30 },
    };

    const defaultTechLevel = { aeronautica: 20, marinha: 20, veiculos: 20 };

    try {
        const snapshot = await db.collection('paises').get();
        console.log(`📂 Encontrados ${snapshot.docs.length} países`);

        let atualizados = 0;

        for (const doc of snapshot.docs) {
            const country = { id: doc.id, ...doc.data() };
            const countryName = country.Pais;

            const tech = techLevels[countryName] || defaultTechLevel;

            const newTechData = {
                ...country.Tecnologia, // Preserva outros campos de tecnologia existentes
                aeronautica: tech.aeronautica,
                marinha: tech.marinha,
                veiculos: tech.veiculos,
            };

            await db.collection('paises').doc(country.id).update({
                Tecnologia: newTechData,
                _techLevelsSet: new Date()
            });

            console.log(`✅ ${countryName}: Tecnologia definida - Aeronáutica: ${tech.aeronautica}, Marinha: ${tech.marinha}, Veículos: ${tech.veiculos}`);
            atualizados++;
        }

        console.log(`🎉 Processo concluído! Países atualizados: ${atualizados}`);

    } catch (error) {
        console.error('💥 Erro ao definir os níveis de tecnologia:', error);
        throw error;
    }
}

// Executar automaticamente se db estiver disponível
if (typeof db !== 'undefined') {
    console.log('🚀 Script de tecnologia carregado! Executando em 3 segundos...');
    setTimeout(setInitialTechLevels, 3000);
} else {
    console.log('⚠️ Firebase não detectado. Execute setInitialTechLevels() manualmente após carregar o narrador.');
    window.setInitialTechLevels = setInitialTechLevels;
}
