/**
 * @file lawAndExhaustionCalculator.js
 * @description Contém as funções de cálculo para os efeitos de Leis Nacionais e Exaustão de Guerra.
 */

/**
 * Calcula os modificadores efetivos para um país com base em suas leis nacionais (atuais ou em transição).
 * @param {object} countryData - O objeto de dados do país do Firestore.
 * @param {object} lawsConfig - O objeto de configuração com as definições das leis (do gameConfig).
 * @returns {object} Um objeto consolidado com todos os modificadores a serem aplicados.
 */
export function calculateEffectiveModifiers(countryData, lawsConfig) {
  if (!countryData || !lawsConfig) {
    console.error('Dados do país ou configuração de leis ausentes para o cálculo.');
    return {};
  }

  let effectiveModifiers = {};

  // Processa a lei de mobilização e a lei econômica
  const lawTypes = ['mobilization', 'economic'];
  lawTypes.forEach(type => {
    const lawData = {
      currentLawId: countryData[type + 'Law'],
      lawChange: countryData.lawChange && countryData.lawChange.type === type ? countryData.lawChange : null,
      config: lawsConfig[type + 'Laws']
    };

    let lawModifiers;
    if (lawData.lawChange) {
      // Interpolação durante a transição
      lawModifiers = getInterpolatedModifiers(lawData.lawChange, lawData.config);
    } else {
      // Efeitos da lei atual
      lawModifiers = getLawModifiers(lawData.currentLawId, lawData.config);
    }
    // Mescla os modificadores calculados no objeto principal
    Object.assign(effectiveModifiers, lawModifiers);
  });

  // Adiciona penalidades de Exaustão de Guerra
  const exhaustion = countryData.warExhaustion || 0;
  if (exhaustion > 0) {
    let exhaustionPenalties = {};
    if (exhaustion > 75) {
      exhaustionPenalties = { militaryCapacity: -0.30, resourceProduction: -0.20 };
    } else if (exhaustion > 50) {
      exhaustionPenalties = { militaryCapacity: -0.15, resourceProduction: -0.10 };
    } else if (exhaustion > 25) {
      exhaustionPenalties = { militaryCapacity: -0.05 };
    }

    // Combina as penalidades com os modificadores existentes
    for (const key in exhaustionPenalties) {
      if (effectiveModifiers[key]) {
        effectiveModifiers[key] += exhaustionPenalties[key];
      } else {
        effectiveModifiers[key] = exhaustionPenalties[key];
      }
    }
  }

  return effectiveModifiers;
}

/**
 * Retorna os modificadores de uma única lei.
 * @param {string} lawId - O ID da lei (ex: 'volunteer_only').
 * @param {object} config - A seção de configuração para este tipo de lei.
 * @returns {object} Os modificadores da lei.
 */
function getLawModifiers(lawId, config) {
  const law = config[lawId];
  if (!law) return {};
  // Combina bônus e penalidades em um único objeto de modificadores
  return { ...law.bonuses, ...law.penalties, consumptionModifiers: law.consumptionModifiers || {} };
}

/**
 * Calcula os modificadores interpolados entre uma lei de origem e uma de destino.
 * @param {object} lawChange - O objeto de transição de lei do país.
 * @param {object} config - A seção de configuração para este tipo de lei.
 * @returns {object} Os modificadores efetivos para o turno atual.
 */
function getInterpolatedModifiers(lawChange, config) {
  const originLawId = lawChange.originLaw;
  const targetLawId = lawChange.targetLaw;
  const progress = lawChange.progress;
  const totalTurns = lawChange.totalTurns;

  const originModifiers = getLawModifiers(originLawId, config);
  const targetModifiers = getLawModifiers(targetLawId, config);

  const factorNew = progress / totalTurns;
  const factorOrigin = 1 - factorNew;

  const interpolated = {};
  const allKeys = new Set([...Object.keys(originModifiers), ...Object.keys(targetModifiers)]);

  allKeys.forEach(key => {
    // Lida com modificadores de consumo separadamente
    if (key === 'consumptionModifiers') {
      interpolated.consumptionModifiers = {};
      const consumptionKeys = new Set([
        ...Object.keys(originModifiers.consumptionModifiers || {}),
        ...Object.keys(targetModifiers.consumptionModifiers || {})
      ]);
      consumptionKeys.forEach(cKey => {
        const originVal = originModifiers.consumptionModifiers?.[cKey] || 0;
        const targetVal = targetModifiers.consumptionModifiers?.[cKey] || 0;
        interpolated.consumptionModifiers[cKey] = (originVal * factorOrigin) + (targetVal * factorNew);
      });
      return;
    }

    const originValue = originModifiers[key] || 0;
    const targetValue = targetModifiers[key] || 0;
    interpolated[key] = (originValue * factorOrigin) + (targetValue * factorNew);
  });

  return interpolated;
}
