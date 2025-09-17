/**
 * Motor de Avaliação de Fórmulas Dinâmicas
 * Implementação simplificada para evitar dependências externas
 */
import { Logger } from '../utils.js';

// Parser básico de expressões matemáticas
class SimpleExpressionParser {
  constructor(scope) {
    this.scope = scope;
  }

  evaluate(expression) {
    // Remove espaços
    expression = expression.replace(/\s+/g, '');

    // Substitui variáveis pelos valores
    for (const [key, value] of Object.entries(this.scope)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      expression = expression.replace(regex, String(parseFloat(value) || 0));
    }

    // Avalia a expressão usando Function (com validação de segurança)
    if (!/^[0-9+\-*/.()%\s]+$/.test(expression)) {
      throw new Error('Expressão contém caracteres não permitidos');
    }

    try {
      // eslint-disable-next-line no-new-func
      return new Function(`return ${expression}`)();
    } catch (error) {
      throw new Error(`Erro ao avaliar expressão: ${error.message}`);
    }
  }

  parse(expression) {
    return {
      evaluate: (scope) => {
        const parser = new SimpleExpressionParser(scope);
        return parser.evaluate(expression);
      }
    };
  }
}

// Objeto math simplificado compatível
const math = {
  parse: (expression) => new SimpleExpressionParser({}).parse(expression)
};

/**
 * Prepara o escopo para a avaliação da fórmula, achatando o objeto do país.
 * Transforma um objeto como { recursos: { Graos: 100 }, PIB: 1000 }
 * em um escopo como { Graos: 100, PIB: 1000 }.
 * @param {object} countryData - O objeto de dados completo do país.
 * @returns {object} Um objeto achatado para ser usado como escopo.
 */
function createFormulaScope(countryData) {
    const scope = {};
    if (!countryData || typeof countryData !== 'object') {
        return scope;
    }

    for (const key in countryData) {
        const value = countryData[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Se for um objeto aninhado (como 'recursos'), adiciona suas chaves ao escopo principal
            for (const nestedKey in value) {
                // Evita sobrescrever chaves do nível principal se houver conflito
                if (!(nestedKey in scope)) {
                    scope[nestedKey] = value[nestedKey];
                }
            }
        } else {
            // Adiciona chaves do nível principal
            scope[key] = value;
        }
    }
    return scope;
}

/**
 * Avalia uma string de fórmula usando um escopo de dados seguro.
 * @param {string} formulaString - A fórmula a ser avaliada (ex: "PIB * 0.1 + Populacao").
 * @param {object} countryData - O objeto com os dados do país para o escopo.
 * @returns {{success: boolean, value: number, error: string|null}} - O resultado da avaliação.
 */
export function evaluateFormula(formulaString, countryData) {
    if (!formulaString || typeof formulaString !== 'string') {
        return { success: false, value: 0, error: 'Fórmula inválida ou não fornecida.' };
    }

    const scope = createFormulaScope(countryData);

    try {
        const node = math.parse(formulaString);
        const result = node.evaluate(scope);

        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('O resultado da fórmula não é um número válido.');
        }

        return { success: true, value: result, error: null };
    } catch (err) {
        Logger.error(`Erro ao avaliar a fórmula "${formulaString}":`, err);
        return { success: false, value: 0, error: err.message };
    }
}
