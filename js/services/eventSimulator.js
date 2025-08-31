import { realTimeUpdates } from './realTimeUpdates.js';
import { changeHistory } from './changeHistory.js';
import { getAllCountries } from './firebase.js';
import { showNotification, Logger } from '../utils.js';

/**
 * Serviço de Simulação de Eventos
 * Gera e aplica eventos aleatórios e cenários predefinidos
 */
export class EventSimulatorService {
    constructor() {
        this.eventTemplates = this.initializeEventTemplates();
        this.scenarioTemplates = this.initializeScenarioTemplates();
        this.eventHistory = [];
    }

    /**
     * Templates de eventos aleatórios
     */
    initializeEventTemplates() {
        return {
            economic: {
                positive: [
                    {
                        name: "Descoberta de Recursos",
                        description: "Descoberta de vastas reservas de recursos naturais",
                        effects: { PIB: "+15-30%", Estabilidade: "+5-10" },
                        probability: 0.3
                    },
                    {
                        name: "Boom Econômico",
                        description: "Crescimento econômico excepcional devido a políticas eficazes",
                        effects: { PIB: "+20-40%", Tecnologia: "+5-15" },
                        probability: 0.4
                    },
                    {
                        name: "Parceria Comercial",
                        description: "Estabelecimento de importante parceria comercial internacional",
                        effects: { PIB: "+10-25%", Estabilidade: "+3-8" },
                        probability: 0.5
                    }
                ],
                negative: [
                    {
                        name: "Recessão Econômica",
                        description: "Período de contração econômica e desemprego",
                        effects: { PIB: "-20-40%", Estabilidade: "-10-20" },
                        probability: 0.4
                    },
                    {
                        name: "Crise Financeira",
                        description: "Colapso do sistema financeiro e crise bancária",
                        effects: { PIB: "-30-50%", Estabilidade: "-15-25" },
                        probability: 0.2
                    },
                    {
                        name: "Inflação Descontrolada",
                        description: "Hiperinflação devastando a economia nacional",
                        effects: { PIB: "-25-45%", Estabilidade: "-20-30" },
                        probability: 0.3
                    }
                ]
            },
            political: {
                positive: [
                    {
                        name: "Reforma Democrática",
                        description: "Implementação bem-sucedida de reformas democráticas",
                        effects: { Estabilidade: "+15-25", Tecnologia: "+5-10" },
                        probability: 0.4
                    },
                    {
                        name: "Líder Carismático",
                        description: "Ascensão de um líder popular e eficiente",
                        effects: { Estabilidade: "+10-20", PIB: "+5-15%" },
                        probability: 0.5
                    }
                ],
                negative: [
                    {
                        name: "Golpe de Estado",
                        description: "Golpe militar derruba o governo estabelecido",
                        effects: { Estabilidade: "-25-40", PIB: "-15-30%" },
                        probability: 0.2
                    },
                    {
                        name: "Corrupção Generalizada",
                        description: "Escândalos de corrupção abalam a confiança pública",
                        effects: { Estabilidade: "-20-35", Tecnologia: "-5-15" },
                        probability: 0.4
                    }
                ]
            },
            military: {
                positive: [
                    {
                        name: "Modernização Militar",
                        description: "Programa bem-sucedido de modernização das forças armadas",
                        effects: { "Tecnologia": "+10-20", "Estabilidade": "+5-10" },
                        probability: 0.6
                    }
                ],
                negative: [
                    {
                        name: "Conflito Armado",
                        description: "Envolvimento em conflito militar custoso",
                        effects: { PIB: "-20-35%", Estabilidade: "-15-25", Populacao: "-5-15%" },
                        probability: 0.3
                    },
                    {
                        name: "Insurgência",
                        description: "Movimento insurgente ganha força no país",
                        effects: { Estabilidade: "-20-35", PIB: "-10-20%" },
                        probability: 0.4
                    }
                ]
            },
            natural: {
                negative: [
                    {
                        name: "Grande Terremoto",
                        description: "Terremoto devastador causa destruição massiva",
                        effects: { PIB: "-30-50%", Populacao: "-5-15%", Estabilidade: "-15-25" },
                        probability: 0.1
                    },
                    {
                        name: "Seca Severa",
                        description: "Período prolongado de seca afeta agricultura",
                        effects: { PIB: "-15-30%", Estabilidade: "-10-20" },
                        probability: 0.3
                    },
                    {
                        name: "Inundações",
                        description: "Inundações massivas destroem infraestrutura",
                        effects: { PIB: "-20-35%", Populacao: "-2-8%" },
                        probability: 0.2
                    }
                ]
            },
            technological: {
                positive: [
                    {
                        name: "Breakthrough Científico",
                        description: "Grande avanço científico nacional",
                        effects: { Tecnologia: "+15-30", PIB: "+10-25%" },
                        probability: 0.3
                    },
                    {
                        name: "Revolução Digital",
                        description: "Adoção massiva de novas tecnologias",
                        effects: { Tecnologia: "+20-35", Estabilidade: "+5-15" },
                        probability: 0.4
                    }
                ],
                negative: [
                    {
                        name: "Cyberattack",
                        description: "Ataque cibernético massivo paralisa infraestrutura",
                        effects: { Tecnologia: "-10-25", PIB: "-15-30%", Estabilidade: "-10-20" },
                        probability: 0.2
                    }
                ]
            },
            diplomatic: {
                positive: [
                    {
                        name: "Aliança Estratégica",
                        description: "Formação de aliança militar ou econômica importante",
                        effects: { Estabilidade: "+10-20", PIB: "+5-15%" },
                        probability: 0.5
                    }
                ],
                negative: [
                    {
                        name: "Isolamento Internacional",
                        description: "País torna-se pária internacional",
                        effects: { PIB: "-25-40%", Estabilidade: "-15-30" },
                        probability: 0.2
                    },
                    {
                        name: "Sanctions Económicas",
                        description: "Imposição de severas sanções econômicas",
                        effects: { PIB: "-30-50%", Tecnologia: "-10-20" },
                        probability: 0.3
                    }
                ]
            }
        };
    }

    /**
     * Cenários predefinidos
     */
    initializeScenarioTemplates() {
        return {
            oil_crisis: {
                name: "Crise do Petróleo",
                description: "Uma crise energética global afeta todos os países",
                global: true,
                effects: [
                    { condition: "geral.PIB > 50000000000", change: { PIB: "-20-30%" } },
                    { condition: "geral.PIB <= 50000000000", change: { PIB: "-15-25%" } },
                    { condition: "all", change: { Estabilidade: "-5-15" } }
                ]
            },
            tech_revolution: {
                name: "Revolução Tecnológica",
                description: "Avanços tecnológicos beneficiam países desenvolvidos",
                global: false,
                targetCriteria: { "geral.Tecnologia": ">= 60" },
                effects: [
                    { condition: "geral.Tecnologia >= 80", change: { Tecnologia: "+15-25", PIB: "+20-30%" } },
                    { condition: "geral.Tecnologia >= 60", change: { Tecnologia: "+10-20", PIB: "+15-25%" } }
                ]
            },
            cold_war_intensifies: {
                name: "Guerra Fria Intensifica",
                description: "Tensões globais reduzem estabilidade e aumentam gastos militares",
                global: true,
                effects: [
                    { condition: "all", change: { Estabilidade: "-10-20" } },
                    { condition: "geral.PIB > 30000000000", change: { PIB: "-5-15%" } }
                ]
            },
            economic_boom: {
                name: "Boom Econômico",
                description: "Alguns países sortudos experimentam crescimento excepcional",
                global: false,
                randomSelection: { count: 5, criteria: "random" },
                effects: [
                    { condition: "selected", change: { PIB: "+25-40%", Estabilidade: "+10-20" } }
                ]
            },
            global_pandemic: {
                name: "Pandemia Global",
                description: "Uma pandemia afeta todos os países, mas com intensidades diferentes",
                global: true,
                effects: [
                    { condition: "geral.Populacao > 100000000", change: { PIB: "-30-45%", Populacao: "-3-8%", Estabilidade: "-15-25" } },
                    { condition: "geral.Populacao <= 100000000", change: { PIB: "-20-35%", Populacao: "-1-5%", Estabilidade: "-10-20" } }
                ]
            }
        };
    }

    /**
     * Gera um evento aleatório
     */
    generateRandomEvent(type = 'random', intensity = 5, scope = 'single') {
        let selectedType = type;
        
        if (type === 'random') {
            const types = Object.keys(this.eventTemplates);
            selectedType = types[Math.floor(Math.random() * types.length)];
        }

        const templates = this.eventTemplates[selectedType];
        if (!templates) {
            throw new Error(`Tipo de evento '${selectedType}' não encontrado`);
        }

        // Determinar se é positivo ou negativo baseado na intensidade
        const isPositive = intensity < 5 ? Math.random() > 0.3 : Math.random() > 0.7;
        
        let eventPool = [];
        if (isPositive && templates.positive) {
            eventPool = templates.positive;
        } else if (!isPositive && templates.negative) {
            eventPool = templates.negative;
        } else {
            // Fallback para eventos negativos se não houver positivos
            eventPool = templates.negative || templates.positive || [];
        }

        if (eventPool.length === 0) {
            throw new Error(`Nenhum evento disponível para tipo '${selectedType}'`);
        }

        const selectedEvent = eventPool[Math.floor(Math.random() * eventPool.length)];
        
        return {
            id: this.generateEventId(),
            type: selectedType,
            ...selectedEvent,
            intensity,
            scope,
            timestamp: new Date(),
            isPositive
        };
    }

    /**
     * Aplica um evento gerado
     */
    async applyEvent(event, targetCountries = null) {
        try {
            let countries = [];

            // Determinar países alvo baseado no escopo
            switch (event.scope) {
                case 'global':
                    countries = await getAllCountries();
                    break;
                case 'regional':
                    countries = await this.selectRegionalCountries();
                    break;
                case 'single':
                    if (targetCountries && targetCountries.length > 0) {
                        const allCountries = await getAllCountries();
                        countries = allCountries.filter(c => targetCountries.includes(c.id));
                    } else {
                        const allCountries = await getAllCountries();
                        countries = [allCountries[Math.floor(Math.random() * allCountries.length)]];
                    }
                    break;
                case 'custom':
                    if (targetCountries) {
                        const allCountries = await getAllCountries();
                        countries = allCountries.filter(c => targetCountries.includes(c.id));
                    }
                    break;
            }

            if (countries.length === 0) {
                throw new Error('Nenhum país selecionado para aplicar o evento');
            }

            // Aplicar efeitos
            const changes = await this.applyEventEffects(event, countries);
            
            // Registrar evento no histórico
            const eventRecord = {
                ...event,
                affectedCountries: countries.map(c => ({ id: c.id, name: c.Pais })),
                appliedChanges: changes,
                appliedAt: new Date()
            };

            this.eventHistory.push(eventRecord);

            showNotification('success', 
                `Evento "${event.name}" aplicado em ${countries.length} país(es)`);

            Logger.info('Evento aplicado:', eventRecord);
            return eventRecord;

        } catch (error) {
            Logger.error('Erro ao aplicar evento:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    /**
     * Aplica os efeitos de um evento nos países
     */
    async applyEventEffects(event, countries) {
        const allChanges = [];

        for (const country of countries) {
            const countryChanges = [];

            // Processar cada efeito do evento
            if (event.effects) {
                for (const [field, effect] of Object.entries(event.effects)) {
                    const change = this.calculateEffectValue(effect, event.intensity);
                    
                    if (change !== 0) {
                        try {
                            // Aplicar mudança usando realTimeUpdates
                            await realTimeUpdates.updateField({
                                countryId: country.id,
                                section: 'geral',
                                field: field,
                                value: this.applyChange(
                                    country.geral?.[field] || 0, 
                                    change, 
                                    field
                                ),
                                reason: `Evento: ${event.name}`,
                                broadcast: false
                            });

                            countryChanges.push({
                                field,
                                oldValue: country.geral?.[field] || 0,
                                change,
                                newValue: this.applyChange(country.geral?.[field] || 0, change, field)
                            });

                        } catch (error) {
                            Logger.warn(`Erro ao aplicar mudança em ${country.Pais}.${field}:`, error);
                        }
                    }
                }
            }

            allChanges.push({
                countryId: country.id,
                countryName: country.Pais,
                changes: countryChanges
            });
        }

        return allChanges;
    }

    /**
     * Calcula o valor do efeito baseado na intensidade
     */
    calculateEffectValue(effect, intensity = 5) {
        const effectStr = String(effect);
        
        // Efeito percentual (ex: "+15-30%" ou "-20-40%")
        const percentMatch = effectStr.match(/([+-])(\d+)-(\d+)%/);
        if (percentMatch) {
            const [, sign, min, max] = percentMatch;
            const minVal = parseInt(min);
            const maxVal = parseInt(max);
            const range = maxVal - minVal;
            const baseEffect = minVal + (range * intensity / 10);
            return sign === '+' ? baseEffect / 100 : -baseEffect / 100;
        }

        // Efeito absoluto (ex: "+5-15" ou "-10-20")
        const absoluteMatch = effectStr.match(/([+-])(\d+)-(\d+)/);
        if (absoluteMatch) {
            const [, sign, min, max] = absoluteMatch;
            const minVal = parseInt(min);
            const maxVal = parseInt(max);
            const range = maxVal - minVal;
            const baseEffect = minVal + (range * intensity / 10);
            return sign === '+' ? baseEffect : -baseEffect;
        }

        // Valor fixo
        const fixedMatch = effectStr.match(/([+-]?\d+)/);
        if (fixedMatch) {
            return parseInt(fixedMatch[1]) * (intensity / 5);
        }

        return 0;
    }

    /**
     * Aplica uma mudança a um valor existente
     */
    applyChange(currentValue, change, field) {
        let newValue;

        if (change > 0 && change < 1) {
            // Mudança percentual positiva
            newValue = currentValue * (1 + change);
        } else if (change < 0 && change > -1) {
            // Mudança percentual negativa
            newValue = currentValue * (1 + change);
        } else {
            // Mudança absoluta
            newValue = currentValue + change;
        }

        // Aplicar limites baseados no tipo de campo
        switch (field) {
            case 'Estabilidade':
            case 'Tecnologia':
            case 'Urbanizacao':
                newValue = Math.max(0, Math.min(100, newValue));
                break;
            case 'PIB':
            case 'Populacao':
                newValue = Math.max(0, newValue);
                break;
        }

        return Math.round(newValue * 100) / 100; // Arredondar para 2 casas decimais
    }

    /**
     * Aplica um cenário predefinido
     */
    async applyScenario(scenarioKey) {
        const scenario = this.scenarioTemplates[scenarioKey];
        if (!scenario) {
            throw new Error(`Cenário '${scenarioKey}' não encontrado`);
        }

        try {
            const allCountries = await getAllCountries();
            let targetCountries = [];

            if (scenario.global) {
                targetCountries = allCountries;
            } else if (scenario.targetCriteria) {
                targetCountries = this.filterCountriesByCriteria(allCountries, scenario.targetCriteria);
            } else if (scenario.randomSelection) {
                targetCountries = this.selectRandomCountries(allCountries, scenario.randomSelection);
            }

            const allChanges = [];

            for (const country of targetCountries) {
                const countryChanges = [];

                for (const effect of scenario.effects) {
                    if (this.evaluateCondition(country, effect.condition) || 
                        (effect.condition === 'selected' && targetCountries.includes(country))) {
                        
                        for (const [field, changeStr] of Object.entries(effect.change)) {
                            const change = this.calculateEffectValue(changeStr, 7); // Cenários têm intensidade alta
                            
                            if (change !== 0) {
                                try {
                                    const oldValue = country.geral?.[field] || 0;
                                    const newValue = this.applyChange(oldValue, change, field);

                                    await realTimeUpdates.updateField({
                                        countryId: country.id,
                                        section: 'geral',
                                        field: field,
                                        value: newValue,
                                        reason: `Cenário: ${scenario.name}`,
                                        broadcast: false
                                    });

                                    countryChanges.push({
                                        field,
                                        oldValue,
                                        change,
                                        newValue
                                    });

                                } catch (error) {
                                    Logger.warn(`Erro ao aplicar cenário em ${country.Pais}.${field}:`, error);
                                }
                            }
                        }
                    }
                }

                if (countryChanges.length > 0) {
                    allChanges.push({
                        countryId: country.id,
                        countryName: country.Pais,
                        changes: countryChanges
                    });
                }
            }

            // Registrar cenário no histórico
            const scenarioRecord = {
                id: this.generateEventId(),
                type: 'scenario',
                name: scenario.name,
                description: scenario.description,
                affectedCountries: allChanges.map(c => ({ id: c.countryId, name: c.countryName })),
                appliedChanges: allChanges,
                appliedAt: new Date()
            };

            this.eventHistory.push(scenarioRecord);

            showNotification('success', 
                `Cenário "${scenario.name}" aplicado em ${allChanges.length} país(es)`);

            Logger.info('Cenário aplicado:', scenarioRecord);
            return scenarioRecord;

        } catch (error) {
            Logger.error('Erro ao aplicar cenário:', error);
            showNotification('error', `Erro: ${error.message}`);
            throw error;
        }
    }

    // Métodos auxiliares

    generateEventId() {
        return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async selectRegionalCountries() {
        const allCountries = await getAllCountries();
        const regions = ['Europa', 'América', 'Ásia', 'África', 'Oceania'];
        const selectedRegion = regions[Math.floor(Math.random() * regions.length)];
        
        // Lógica simplificada de seleção regional
        return allCountries.filter(c => {
            const name = (c.Pais || '').toLowerCase();
            switch (selectedRegion) {
                case 'Europa':
                    return ['alemanha', 'frança', 'reino unido', 'italia', 'espanha', 'russia'].some(r => name.includes(r));
                case 'América':
                    return ['brasil', 'estados unidos', 'canada', 'argentina', 'mexico'].some(r => name.includes(r));
                default:
                    return Math.random() > 0.7; // Fallback aleatório
            }
        });
    }

    filterCountriesByCriteria(countries, criteria) {
        return countries.filter(country => {
            for (const [path, condition] of Object.entries(criteria)) {
                const value = this.getValueByPath(country, path);
                if (!this.evaluateCondition({ [path]: value }, `${path} ${condition}`)) {
                    return false;
                }
            }
            return true;
        });
    }

    selectRandomCountries(countries, selection) {
        const shuffled = [...countries].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(selection.count, countries.length));
    }

    evaluateCondition(country, condition) {
        if (condition === 'all' || condition === 'selected') return true;
        
        // Exemplo: "geral.PIB > 50000000000"
        const match = condition.match(/^(.+?)\s*(>=|<=|>|<|=)\s*(.+)$/);
        if (match) {
            const [, path, operator, valueStr] = match;
            const countryValue = this.getValueByPath(country, path);
            const compareValue = parseFloat(valueStr);
            
            switch (operator) {
                case '>': return countryValue > compareValue;
                case '<': return countryValue < compareValue;
                case '>=': return countryValue >= compareValue;
                case '<=': return countryValue <= compareValue;
                case '=': return countryValue === compareValue;
                default: return false;
            }
        }
        
        return false;
    }

    getValueByPath(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj) || 0;
    }

    /**
     * Obtém histórico de eventos
     */
    getEventHistory(limit = 50) {
        return this.eventHistory
            .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
            .slice(0, limit);
    }

    /**
     * Limpa histórico de eventos
     */
    clearEventHistory() {
        this.eventHistory = [];
        showNotification('info', 'Histórico de eventos limpo');
    }
}

// Singleton para uso global
export const eventSimulator = new EventSimulatorService();
export default eventSimulator;