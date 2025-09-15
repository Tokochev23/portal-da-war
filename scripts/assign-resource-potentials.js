/**
 * Script de Atribuição de Potenciais de Recursos
 * Define potenciais históricos baseados na realidade de 1954
 */

import { db } from '../js/services/firebase.js';
import { showNotification, showConfirmBox } from '../js/utils.js';

// Mapeamento completo de recursos por país (baseado na realidade histórica de 1954)
const RESOURCE_POTENTIALS = {
  // SUPERPOTÊNCIAS
  'Estados Unidos': {
    PotencialCombustivel: 9,
    PotencialCarvao: 10,
    PotencialMetais: 8,
    PotencialAgricola: 10,
    PotencialHidreletrico: 7,
    PotencialUranio: 7
  },

  'URSS': {
    PotencialCombustivel: 8,  // Baku, Sibéria Ocidental
    PotencialCarvao: 10,      // Donbass, Kuzbass (maiores reservas do mundo)
    PotencialMetais: 10,      // Urais, Sibéria (ferro, ouro, platina)
    PotencialAgricola: 10,    // Ucrânia = "celeiro da Europa" + estepes russas
    PotencialHidreletrico: 9, // Rios siberianos, Volga
    PotencialUranio: 9        // Cazaquistão, Urais
  },

  // POTÊNCIAS PETROLÍFERAS
  'Venezuela': {
    PotencialCombustivel: 10,
    PotencialCarvao: 2,
    PotencialMetais: 4,
    PotencialAgricola: 5,
    PotencialHidreletrico: 6,
    PotencialUranio: 1
  },

  'Arábia Saudita': {
    PotencialCombustivel: 9,
    PotencialCarvao: 0,
    PotencialMetais: 2,
    PotencialAgricola: 1,
    PotencialHidreletrico: 1,
    PotencialUranio: 0
  },

  'Irã': {
    PotencialCombustivel: 8,
    PotencialCarvao: 3,
    PotencialMetais: 4,
    PotencialAgricola: 4,
    PotencialHidreletrico: 3,
    PotencialUranio: 2
  },

  'Kuwait': {
    PotencialCombustivel: 8,
    PotencialCarvao: 0,
    PotencialMetais: 1,
    PotencialAgricola: 1,
    PotencialHidreletrico: 0,
    PotencialUranio: 0
  },

  'Iraque': {
    PotencialCombustivel: 7,
    PotencialCarvao: 1,
    PotencialMetais: 3,
    PotencialAgricola: 4,
    PotencialHidreletrico: 2,
    PotencialUranio: 1
  },

  // POTÊNCIAS TRADICIONAIS EUROPEIAS
  'Reino Unido': {
    PotencialCombustivel: 4,
    PotencialCarvao: 8,
    PotencialMetais: 4,
    PotencialAgricola: 5,
    PotencialHidreletrico: 2,
    PotencialUranio: 3
  },

  'Alemanha': {
    PotencialCombustivel: 2,
    PotencialCarvao: 7,
    PotencialMetais: 5,
    PotencialAgricola: 6,
    PotencialHidreletrico: 4,
    PotencialUranio: 4
  },

  'França': {
    PotencialCombustivel: 2,
    PotencialCarvao: 4,
    PotencialMetais: 4,
    PotencialAgricola: 7,
    PotencialHidreletrico: 5,
    PotencialUranio: 5
  },

  'Itália': {
    PotencialCombustivel: 1,
    PotencialCarvao: 2,
    PotencialMetais: 3,
    PotencialAgricola: 6,
    PotencialHidreletrico: 6,
    PotencialUranio: 2
  },

  // POTÊNCIAS AMERICANAS
  'Brasil': {
    PotencialCombustivel: 3,
    PotencialCarvao: 4,
    PotencialMetais: 7,
    PotencialAgricola: 8,
    PotencialHidreletrico: 9,
    PotencialUranio: 4
  },

  'Argentina': {
    PotencialCombustivel: 4,
    PotencialCarvao: 2,
    PotencialMetais: 5,
    PotencialAgricola: 9,
    PotencialHidreletrico: 5,
    PotencialUranio: 3
  },

  'México': {
    PotencialCombustivel: 6,
    PotencialCarvao: 3,
    PotencialMetais: 6,
    PotencialAgricola: 6,
    PotencialHidreletrico: 4,
    PotencialUranio: 3
  },

  'Canadá': {
    PotencialCombustivel: 6,
    PotencialCarvao: 6,
    PotencialMetais: 8,
    PotencialAgricola: 7,
    PotencialHidreletrico: 10,
    PotencialUranio: 9
  },

  // POTÊNCIAS ASIÁTICAS
  'China': {
    PotencialCombustivel: 4,
    PotencialCarvao: 8,
    PotencialMetais: 7,
    PotencialAgricola: 7,
    PotencialHidreletrico: 7,
    PotencialUranio: 5
  },

  'Japão': {
    PotencialCombustivel: 1,
    PotencialCarvao: 3,
    PotencialMetais: 2,
    PotencialAgricola: 4,
    PotencialHidreletrico: 4,
    PotencialUranio: 1
  },

  'Índia': {
    PotencialCombustivel: 3,
    PotencialCarvao: 6,
    PotencialMetais: 6,
    PotencialAgricola: 7,
    PotencialHidreletrico: 6,
    PotencialUranio: 4
  },

  // POTÊNCIAS AFRICANAS
  'África do Sul': {
    PotencialCombustivel: 2,
    PotencialCarvao: 7,
    PotencialMetais: 8,
    PotencialAgricola: 5,
    PotencialHidreletrico: 3,
    PotencialUranio: 8
  },

  'Egito': {
    PotencialCombustivel: 3,
    PotencialCarvao: 1,
    PotencialMetais: 4,
    PotencialAgricola: 5,
    PotencialHidreletrico: 7, // Assuã
    PotencialUranio: 2
  },

  // OCEANIA
  'Austrália': {
    PotencialCombustivel: 3,
    PotencialCarvao: 7,
    PotencialMetais: 7,
    PotencialAgricola: 6,
    PotencialHidreletrico: 4,
    PotencialUranio: 6
  },

  // PAÍSES NÓRDICOS
  'Noruega': {
    PotencialCombustivel: 2, // Petróleo do Mar do Norte ainda não descoberto
    PotencialCarvao: 2,
    PotencialMetais: 5,
    PotencialAgricola: 3,
    PotencialHidreletrico: 9,
    PotencialUranio: 1
  },

  'Suécia': {
    PotencialCombustivel: 1,
    PotencialCarvao: 2,
    PotencialMetais: 7, // Ferro
    PotencialAgricola: 4,
    PotencialHidreletrico: 7,
    PotencialUranio: 3
  },

  'Finlândia': {
    PotencialCombustivel: 1,
    PotencialCarvao: 1,
    PotencialMetais: 4,
    PotencialAgricola: 3,
    PotencialHidreletrico: 5,
    PotencialUranio: 2
  },

  // EUROPA ORIENTAL
  'Polônia': {
    PotencialCombustivel: 2,
    PotencialCarvao: 6,
    PotencialMetais: 5,
    PotencialAgricola: 6,
    PotencialHidreletrico: 3,
    PotencialUranio: 2
  },

  'Tchecoslováquia': {
    PotencialCombustivel: 1,
    PotencialCarvao: 5,
    PotencialMetais: 4,
    PotencialAgricola: 5,
    PotencialHidreletrico: 4,
    PotencialUranio: 6 // Importante na era soviética
  },

  'Romênia': {
    PotencialCombustivel: 5,
    PotencialCarvao: 4,
    PotencialMetais: 4,
    PotencialAgricola: 6,
    PotencialHidreletrico: 4,
    PotencialUranio: 2
  },

  // OUTROS PAÍSES IMPORTANTES
  'Turquia': {
    PotencialCombustivel: 2,
    PotencialCarvao: 4,
    PotencialMetais: 5,
    PotencialAgricola: 6,
    PotencialHidreletrico: 5,
    PotencialUranio: 2
  },

  'Espanha': {
    PotencialCombustivel: 1,
    PotencialCarvao: 3,
    PotencialMetais: 4,
    PotencialAgricola: 6,
    PotencialHidreletrico: 5,
    PotencialUranio: 3
  },

  'Portugal': {
    PotencialCombustivel: 1,
    PotencialCarvao: 2,
    PotencialMetais: 3,
    PotencialAgricola: 4,
    PotencialHidreletrico: 4,
    PotencialUranio: 4 // Descoberto depois
  },

  'Holanda': {
    PotencialCombustivel: 3, // Groningen descoberto depois
    PotencialCarvao: 3,
    PotencialMetais: 2,
    PotencialAgricola: 6,
    PotencialHidreletrico: 1,
    PotencialUranio: 1
  },

  'Bélgica': {
    PotencialCombustivel: 1,
    PotencialCarvao: 4,
    PotencialMetais: 3,
    PotencialAgricola: 5,
    PotencialHidreletrico: 2,
    PotencialUranio: 1
  },

  'Suíça': {
    PotencialCombustivel: 0,
    PotencialCarvao: 1,
    PotencialMetais: 2,
    PotencialAgricola: 4,
    PotencialHidreletrico: 8,
    PotencialUranio: 2
  },

  'Áustria': {
    PotencialCombustivel: 2,
    PotencialCarvao: 3,
    PotencialMetais: 4,
    PotencialAgricola: 5,
    PotencialHidreletrico: 6,
    PotencialUranio: 3
  },

  'Hungria': {
    PotencialCombustivel: 3,
    PotencialCarvao: 3,
    PotencialMetais: 3,
    PotencialAgricola: 6,
    PotencialHidreletrico: 2,
    PotencialUranio: 3
  },

  // MAIS PAÍSES IMPORTANTES
  'Coreia do Sul': {
    PotencialCombustivel: 1,
    PotencialCarvao: 3,
    PotencialMetais: 3,
    PotencialAgricola: 4,
    PotencialHidreletrico: 3,
    PotencialUranio: 1
  },

  'Coreia do Norte': {
    PotencialCombustivel: 2,
    PotencialCarvao: 6,
    PotencialMetais: 6,
    PotencialAgricola: 3,
    PotencialHidreletrico: 5,
    PotencialUranio: 2
  },

  'Taiwan': {
    PotencialCombustivel: 1,
    PotencialCarvao: 2,
    PotencialMetais: 2,
    PotencialAgricola: 4,
    PotencialHidreletrico: 3,
    PotencialUranio: 1
  },

  'Filipinas': {
    PotencialCombustivel: 2,
    PotencialCarvao: 3,
    PotencialMetais: 5,
    PotencialAgricola: 6,
    PotencialHidreletrico: 5,
    PotencialUranio: 1
  },

  'Indonésia': {
    PotencialCombustivel: 6,
    PotencialCarvao: 5,
    PotencialMetais: 6,
    PotencialAgricola: 7,
    PotencialHidreletrico: 6,
    PotencialUranio: 2
  },

  'Malásia': {
    PotencialCombustivel: 5,
    PotencialCarvao: 2,
    PotencialMetais: 4,
    PotencialAgricola: 6,
    PotencialHidreletrico: 4,
    PotencialUranio: 1
  },

  'Tailândia': {
    PotencialCombustivel: 3,
    PotencialCarvao: 2,
    PotencialMetais: 4,
    PotencialAgricola: 7,
    PotencialHidreletrico: 4,
    PotencialUranio: 1
  },

  'Vietnã': {
    PotencialCombustivel: 4,
    PotencialCarvao: 4,
    PotencialMetais: 5,
    PotencialAgricola: 6,
    PotencialHidreletrico: 5,
    PotencialUranio: 1
  },

  'Birmânia': {
    PotencialCombustivel: 4,
    PotencialCarvao: 2,
    PotencialMetais: 4,
    PotencialAgricola: 6,
    PotencialHidreletrico: 6,
    PotencialUranio: 1
  },

  'Paquistão': {
    PotencialCombustivel: 3,
    PotencialCarvao: 3,
    PotencialMetais: 4,
    PotencialAgricola: 6,
    PotencialHidreletrico: 4,
    PotencialUranio: 3
  },

  'Bangladesh': {
    PotencialCombustivel: 2,
    PotencialCarvao: 2,
    PotencialMetais: 2,
    PotencialAgricola: 6,
    PotencialHidreletrico: 3,
    PotencialUranio: 1
  },

  'Sri Lanka': {
    PotencialCombustivel: 1,
    PotencialCarvao: 1,
    PotencialMetais: 3,
    PotencialAgricola: 5,
    PotencialHidreletrico: 5,
    PotencialUranio: 1
  },

  // ORIENTE MÉDIO ADICIONAL
  'Israel': {
    PotencialCombustivel: 2,
    PotencialCarvao: 0,
    PotencialMetais: 3,
    PotencialAgricola: 4,
    PotencialHidreletrico: 1,
    PotencialUranio: 2
  },

  'Jordânia': {
    PotencialCombustivel: 1,
    PotencialCarvao: 0,
    PotencialMetais: 4,
    PotencialAgricola: 2,
    PotencialHidreletrico: 1,
    PotencialUranio: 3
  },

  'Síria': {
    PotencialCombustivel: 3,
    PotencialCarvao: 1,
    PotencialMetais: 3,
    PotencialAgricola: 4,
    PotencialHidreletrico: 2,
    PotencialUranio: 1
  },

  'Líbano': {
    PotencialCombustivel: 1,
    PotencialCarvao: 0,
    PotencialMetais: 2,
    PotencialAgricola: 4,
    PotencialHidreletrico: 3,
    PotencialUranio: 1
  },

  // ÁFRICA ADICIONAL
  'Líbia': {
    PotencialCombustivel: 8, // Descoberto depois, mas jazidas existiam
    PotencialCarvao: 0,
    PotencialMetais: 3,
    PotencialAgricola: 2,
    PotencialHidreletrico: 1,
    PotencialUranio: 2
  },

  'Argélia': {
    PotencialCombustivel: 7,
    PotencialCarvao: 1,
    PotencialMetais: 4,
    PotencialAgricola: 4,
    PotencialHidreletrico: 2,
    PotencialUranio: 2
  },

  'Nigéria': {
    PotencialCombustivel: 6,
    PotencialCarvao: 3,
    PotencialMetais: 4,
    PotencialAgricola: 6,
    PotencialHidreletrico: 5,
    PotencialUranio: 2
  },

  'Marrocos': {
    PotencialCombustivel: 1,
    PotencialCarvao: 2,
    PotencialMetais: 6, // Fosfatos
    PotencialAgricola: 5,
    PotencialHidreletrico: 3,
    PotencialUranio: 3
  },

  'Etiópia': {
    PotencialCombustivel: 2,
    PotencialCarvao: 2,
    PotencialMetais: 4,
    PotencialAgricola: 5,
    PotencialHidreletrico: 8, // Nilo Azul
    PotencialUranio: 1
  },

  'Quênia': {
    PotencialCombustivel: 2,
    PotencialCarvao: 1,
    PotencialMetais: 3,
    PotencialAgricola: 5,
    PotencialHidreletrico: 4,
    PotencialUranio: 1
  },

  // AMÉRICA LATINA ADICIONAL
  'Chile': {
    PotencialCombustivel: 2,
    PotencialCarvao: 3,
    PotencialMetais: 8, // Cobre
    PotencialAgricola: 5,
    PotencialHidreletrico: 6,
    PotencialUranio: 3
  },

  'Peru': {
    PotencialCombustivel: 3,
    PotencialCarvao: 2,
    PotencialMetais: 7,
    PotencialAgricola: 5,
    PotencialHidreletrico: 6,
    PotencialUranio: 2
  },

  'Colômbia': {
    PotencialCombustivel: 5,
    PotencialCarvao: 5,
    PotencialMetais: 5,
    PotencialAgricola: 6,
    PotencialHidreletrico: 7,
    PotencialUranio: 2
  },

  'Equador': {
    PotencialCombustivel: 5,
    PotencialCarvao: 1,
    PotencialMetais: 3,
    PotencialAgricola: 5,
    PotencialHidreletrico: 5,
    PotencialUranio: 1
  },

  'Bolívia': {
    PotencialCombustivel: 4,
    PotencialCarvao: 2,
    PotencialMetais: 6,
    PotencialAgricola: 4,
    PotencialHidreletrico: 4,
    PotencialUranio: 2
  },

  'Uruguai': {
    PotencialCombustivel: 1,
    PotencialCarvao: 1,
    PotencialMetais: 2,
    PotencialAgricola: 7,
    PotencialHidreletrico: 4,
    PotencialUranio: 2
  },

  'Paraguai': {
    PotencialCombustivel: 1,
    PotencialCarvao: 1,
    PotencialMetais: 2,
    PotencialAgricola: 6,
    PotencialHidreletrico: 8, // Itaipu futuro
    PotencialUranio: 1
  },

  'Guatemala': {
    PotencialCombustivel: 2,
    PotencialCarvao: 1,
    PotencialMetais: 3,
    PotencialAgricola: 5,
    PotencialHidreletrico: 5,
    PotencialUranio: 1
  },

  'Cuba': {
    PotencialCombustivel: 2,
    PotencialCarvao: 1,
    PotencialMetais: 4, // Níquel
    PotencialAgricola: 6,
    PotencialHidreletrico: 2,
    PotencialUranio: 1
  }
};

// Valores padrão para países não listados
const DEFAULT_POTENTIALS = {
  PotencialCombustivel: 2,
  PotencialCarvao: 3,
  PotencialMetais: 3,
  PotencialAgricola: 4,
  PotencialHidreletrico: 2,
  PotencialUranio: 1
};

export async function assignResourcePotentials() {
  try {
    const confirmed = await showConfirmBox(
      'Atribuir Potenciais de Recursos',
      'Esta ação irá definir os potenciais de recursos para todos os países baseado na realidade histórica de 1954. Esta operação pode ser executada múltiplas vezes para atualizações. Continuar?',
      'Sim, atribuir potenciais',
      'Cancelar'
    );

    if (!confirmed) {
      showNotification('info', 'Operação cancelada pelo usuário.');
      return;
    }

    showNotification('info', 'Iniciando atribuição de potenciais de recursos...');

    const querySnapshot = await db.collection('paises').get();
    const batch = db.batch();
    let updatedCount = 0;

    querySnapshot.forEach(doc => {
      const country = doc.data();
      const countryName = country.Pais || country.Nome || 'Desconhecido';

      // Usar mapeamento específico ou valores padrão
      const potentials = RESOURCE_POTENTIALS[countryName] || DEFAULT_POTENTIALS;

      const updates = {};
      let hasUpdates = false;

      // Verificar e atualizar cada potencial
      Object.entries(potentials).forEach(([key, value]) => {
        if (country[key] !== value) {
          updates[key] = value;
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        batch.update(doc.ref, updates);
        updatedCount++;

        console.log(`${countryName}: ${Object.keys(updates).join(', ')}`);
      }
    });

    if (updatedCount > 0) {
      await batch.commit();
      showNotification('success', `Potenciais atualizados para ${updatedCount} países!`);

      // Log detalhado
      console.log('=== POTENCIAIS ATRIBUÍDOS ===');
      Object.entries(RESOURCE_POTENTIALS).forEach(([country, potentials]) => {
        console.log(`${country}:`, potentials);
      });
    } else {
      showNotification('info', 'Nenhum país precisava de atualização de potenciais.');
    }

  } catch (error) {
    console.error('Erro ao atribuir potenciais:', error);
    showNotification('error', `Erro: ${error.message}`);
  }
}

// Função para gerar relatório de recursos
export function generateResourceReport() {
  console.log('=== RELATÓRIO DE RECURSOS POR TIPO ===');

  const resourceTypes = ['PotencialCombustivel', 'PotencialCarvao', 'PotencialMetais', 'PotencialAgricola', 'PotencialHidreletrico', 'PotencialUranio'];
  const resourceNames = ['🛢️ Petróleo', '⚫ Carvão', '⛏️ Metais', '🌾 Agricultura', '🌊 Hidrelétrico', '☢️ Urânio'];

  resourceTypes.forEach((resourceType, index) => {
    console.log(`\n${resourceNames[index]}:`);

    // Ordenar países por potencial deste recurso
    const sorted = Object.entries(RESOURCE_POTENTIALS)
      .map(([country, potentials]) => ([country, potentials[resourceType]]))
      .sort((a, b) => b[1] - a[1])
      .filter(([country, value]) => value >= 6); // Apenas produtores significativos

    sorted.forEach(([country, value]) => {
      console.log(`  ${country}: ${value}/10`);
    });
  });
}