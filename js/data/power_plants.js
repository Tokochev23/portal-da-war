// js/data/power_plants.js

export const POWER_PLANTS = {
    THERMAL_COAL: {
        id: 'THERMAL_COAL',
        name: 'Termelétrica a Carvão',
        type: 'thermal',
        resource_input: 'Carvao',
        resource_consumption: 10, // Unidades de Carvão por turno
        energy_output: 50, // Unidades de Energia Elétrica por turno (ex: GW)
        cost: 500, // Milhões
        tech_requirement: 20, // Tecnologia mínima %
        pollution: 0.1, // Placeholder para futura mecânica de poluição
        description: 'Baixo requisito tecnológico, converte Carvão em Energia Elétrica. Gera poluição.'
    },
    THERMAL_FUEL: {
        id: 'THERMAL_FUEL',
        name: 'Termelétrica a Combustível',
        type: 'thermal',
        resource_input: 'Combustivel',
        resource_consumption: 8, // Unidades de Combustível por turno
        energy_output: 60, // Unidades de Energia Elétrica por turno
        cost: 700, // Milhões
        tech_requirement: 30,
        pollution: 0.08,
        description: 'Mais eficiente que a carvão, converte Combustível em Energia Elétrica. Gera poluição.'
    },
    HYDROELECTRIC: {
        id: 'HYDROELECTRIC',
        name: 'Hidrelétrica',
        type: 'hydro',
        resource_input: null, // Não consome recurso diretamente
        resource_consumption: 0,
        energy_output: 80, // Unidades de Energia Elétrica por turno
        cost: 1500, // Milhões (alto custo)
        tech_requirement: 40,
        potential_requirement: 'PotencialHidreletrico', // Requer um potencial geográfico
        pollution: 0.01, // Poluição muito baixa
        description: 'Requer potencial geográfico. Custo de construção alto, mas geração de energia barata e constante.'
    },
    NUCLEAR: {
        id: 'NUCLEAR',
        name: 'Usina Nuclear',
        type: 'nuclear',
        resource_input: 'Uranio', // Recurso futuro
        resource_consumption: 1, // Consumo muito baixo de Urânio
        energy_output: 200, // Unidades de Energia Elétrica por turno (produção massiva)
        cost: 5000, // Milhões (custo muito alto)
        tech_requirement: 70, // Alto requisito tecnológico
        pollution: 0.005, // Muito baixa, mas alto risco
        description: 'Requer altíssima tecnologia e Urânio. Geração massiva de energia.'
    }
};