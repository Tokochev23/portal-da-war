/**
 * @file gameConfigManager.js
 * @description Módulo para carregar e cachear as configurações do jogo, como as Leis Nacionais.
 * Isso evita leituras repetidas do Firestore.
 */

import { db } from './index.js'; // Assumindo que a inicialização do db está em index.js

let cachedNationalLaws = null;

/**
 * Busca as definições das Leis Nacionais do Firestore, usando um cache em memória
 * para evitar leituras desnecessárias do banco de dados.
 * 
 * @returns {Promise<object>} O objeto de configuração das leis nacionais.
 */
export async function getNationalLawsConfig() {
  if (cachedNationalLaws) {
    // Se o cache já existe, retorna-o imediatamente.
    return cachedNationalLaws;
  }

  try {
    console.log('Cache de configuração de leis vazio. Buscando do Firestore...');
    const doc = await db.collection('gameConfig').doc('nationalLaws').get();

    if (!doc.exists) {
      throw new Error('O documento de configuração 'nationalLaws' não foi encontrado! Execute o script setup-game-config.js.');
    }

    // Armazena a configuração no cache.
    cachedNationalLaws = doc.data();
    console.log('Configuração de leis carregada e armazenada em cache.');
    
    return cachedNationalLaws;

  } catch (error) {
    console.error('Falha ao carregar a configuração do jogo:', error);
    // Em caso de erro, retorna null para que o sistema saiba que falhou.
    return null; 
  }
}

/**
 * Limpa o cache de configuração. Útil para testes ou se as regras forem atualizadas dinamicamente.
 */
export function clearConfigCache() {
  console.log('Limpando cache de configuração de leis.');
  cachedNationalLaws = null;
}
