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
id: 'metais',
name: 'Metais',
description: 'Metais diversos para construção e indústria',
basePrice: 500000,  // USD por tonelada
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
id: 'combustivel',
name: 'Combustível',
description: 'Petróleo e derivados',
basePrice: 80000,  // USD por barril
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
id: 'carvao',
name: 'Carvão',
description: 'Carvão mineral para usinas termelétricas',
basePrice: 100000,
qualityMultiplier: 1.0
}
]
},

// Grãos (Alimentos)
Graos: {
gameResourceId: 'graos',
displayName: 'Alimentos',
description: 'Produtos agrícolas e alimentos processados',
defaultUnit: 'toneladas',
marketTypes: [
{
id: 'graos',
name: 'Alimentos',
description: 'Grãos, carnes e produtos alimentícios',
basePrice: 300000,
qualityMultiplier: 1.0
}
]
}
};

/**
* Função helper: Converter gameResourceId para marketType padrão
*/
export function getDefaultMarketType(gameResourceId) {
const resource = Object.values(RESOURCE_MAPPING).find(
r => r.gameResourceId === gameResourceId
);

return resource?.marketTypes[0]?.id || null;
}

/**
* Função helper: Obter configuração completa de um marketType
*/
export function getMarketTypeConfig(marketTypeId) {
for (const resource of Object.values(RESOURCE_MAPPING)) {
const marketType = resource.marketTypes.find(mt => mt.id === marketTypeId);
if (marketType) {
return {
...marketType,
gameResourceId: resource.gameResourceId,
defaultUnit: resource.defaultUnit
};
}
}
return null;
}

/**
* Função helper: Validar se marketType é compatível com gameResource
*/
export function isCompatibleMarketType(gameResourceId, marketTypeId) {
const resource = Object.values(RESOURCE_MAPPING).find(
r => r.gameResourceId === gameResourceId
);

return resource?.marketTypes.some(mt => mt.id === marketTypeId) || false;
}

/**
* Função helper: Obter preço sugerido baseado em oferta/demanda
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
* Função helper: Obter a chave principal do recurso (ex: 'Metais') a partir de um marketTypeId
*/
export function getGameResourceKey(marketTypeId) {
  for (const resourceKey in RESOURCE_MAPPING) {
    const resource = RESOURCE_MAPPING[resourceKey];
    if (resource.marketTypes.some(mt => mt.id === marketTypeId)) {
      return resourceKey;
    }
  }
  return null;
}
