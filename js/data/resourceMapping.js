// js/data/resourceMapping.js - Mapeamento centralizado entre recursos do jogo e tipos de mercado

/**
 * Mapeamento centralizado entre recursos do jogo e tipos de mercado
 *
 * Estrutura:
 * - gameResourceId: Nome interno do recurso (dashboard)
 * - marketTypes: Tipos que podem ser vendidos no marketplace
 * - displayName: Nome amigável para o usuário
 * - unit: Unidade de medida
 * - description: Descrição para ajuda contextual
 */
export const RESOURCE_MAPPING = {
  // Metais
  Metais: {
    gameResourceId: 'metais',
    displayName: 'Metais',
    description: 'Matéria-prima para construção e indústria',
    defaultUnit: 'toneladas',
    marketTypes: [
      {
        id: 'metals',
        name: 'Metais',
        description: 'Aço, ferro e outros metais para indústria',
        basePrice: 500,  // USD por tonelada
        qualityMultiplier: 1.0
      }
    ]
  },

  // Combustível
  Combustivel: {
    gameResourceId: 'combustivel',
    displayName: 'Combustível',
    description: 'Petróleo e derivados para energia e transporte',
    defaultUnit: 'barris',
    marketTypes: [
      {
        id: 'oil',
        name: 'Combustível',
        description: 'Petróleo e derivados',
        basePrice: 80,  // USD por barril
        qualityMultiplier: 1.0
      }
    ]
  },

  // Carvão
  Carvao: {
    gameResourceId: 'carvao',
    displayName: 'Carvão',
    description: 'Combustível fóssil para geração de energia',
    defaultUnit: 'toneladas',
    marketTypes: [
      {
        id: 'coal',
        name: 'Carvão',
        description: 'Carvão mineral para usinas termelétricas',
        basePrice: 100,
        qualityMultiplier: 1.0
      }
    ]
  },

  // Grãos
  Graos: {
    gameResourceId: 'graos',
    displayName: 'Alimentos',
    description: 'Produtos agrícolas e alimentos processados',
    defaultUnit: 'toneladas',
    marketTypes: [
      {
        id: 'food',
        name: 'Alimentos',
        description: 'Grãos, carnes e produtos alimentícios',
        basePrice: 300,
        qualityMultiplier: 1.0
      }
    ]
  }
};

/**
 * Função helper: Converter gameResourceId para marketType padrão
 * @param {string} gameResourceId - ID interno do recurso (ex: 'metais', 'carvao')
 * @returns {string|null} - ID do tipo de mercado padrão ou null se não encontrado
 */
export function getDefaultMarketType(gameResourceId) {
  const resource = Object.values(RESOURCE_MAPPING).find(
    r => r.gameResourceId === gameResourceId
  );

  return resource?.marketTypes[0]?.id || null;
}

/**
 * Função helper: Obter configuração completa de um marketType
 * @param {string} marketTypeId - ID do tipo de mercado (ex: 'steel_high_grade')
 * @returns {Object|null} - Configuração completa ou null se não encontrado
 */
export function getMarketTypeConfig(marketTypeId) {
  for (const resource of Object.values(RESOURCE_MAPPING)) {
    const marketType = resource.marketTypes.find(mt => mt.id === marketTypeId);
    if (marketType) {
      return {
        ...marketType,
        gameResourceId: resource.gameResourceId,
        defaultUnit: resource.defaultUnit,
        displayName: resource.displayName
      };
    }
  }
  return null;
}

/**
 * Função helper: Validar se marketType é compatível com gameResource
 * @param {string} gameResourceId - ID interno do recurso
 * @param {string} marketTypeId - ID do tipo de mercado
 * @returns {boolean} - true se compatível
 */
export function isCompatibleMarketType(gameResourceId, marketTypeId) {
  const resource = Object.values(RESOURCE_MAPPING).find(
    r => r.gameResourceId === gameResourceId
  );

  return resource?.marketTypes.some(mt => mt.id === marketTypeId) || false;
}

/**
 * Função helper: Obter preço sugerido baseado em oferta/demanda
 * @param {string} marketTypeId - ID do tipo de mercado
 * @param {number} availableQuantity - Quantidade disponível
 * @returns {Object|null} - Objeto com preços min, suggested, max e unit
 */
export function getSuggestedPrice(marketTypeId, availableQuantity) {
  const config = getMarketTypeConfig(marketTypeId);
  if (!config) return null;

  // Ajustar preço baseado em escassez
  // Menos disponível = mais caro
  const scarcityFactor = availableQuantity < 10000 ? 1.3 :
                         availableQuantity < 50000 ? 1.1 :
                         availableQuantity > 200000 ? 0.9 : 1.0;

  return {
    min: Math.round(config.basePrice * 0.7 * scarcityFactor),
    suggested: Math.round(config.basePrice * scarcityFactor),
    max: Math.round(config.basePrice * 1.5 * scarcityFactor),
    unit: config.defaultUnit
  };
}

/**
 * Função helper: Buscar recurso do jogo por gameResourceId
 * @param {string} gameResourceId - ID interno do recurso
 * @returns {Object|null} - Configuração do recurso ou null
 */
export function getResourceByGameId(gameResourceId) {
  return Object.values(RESOURCE_MAPPING).find(
    r => r.gameResourceId === gameResourceId
  ) || null;
}

/**
 * Função helper: Obter nome do recurso do jogo a partir do marketTypeId
 * @param {string} marketTypeId - ID do tipo de mercado
 * @returns {string|null} - Nome da chave do recurso no jogo (ex: 'Metais', 'Carvao')
 */
export function getGameResourceKey(marketTypeId) {
  for (const [key, resource] of Object.entries(RESOURCE_MAPPING)) {
    if (resource.marketTypes.some(mt => mt.id === marketTypeId)) {
      return key;
    }
  }
  return null;
}
