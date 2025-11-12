import './accessibility/a11y.js';
import {
  auth,
  checkUserPermissions,
  checkPlayerCountry,
  getAvailableCountries,
  vincularJogadorAoPaisSemRebaixar as vincularJogadorAoPais,
  getAllCountries,
  getGameConfig,
  updateTurn,
  signInWithGooglePreserveRole as signInWithGoogle,
  registerWithEmailPassword,
  signInWithEmailPassword,
  db,
  handleGoogleRedirectResult
} from "./services/firebase.js";
import {
  renderPublicCountries,
  updateKPIs,
  fillPlayerPanel,
  createCountrySelectionModal,
  updateNarratorUI,
  renderDetailedCountryPanel
} from "./ui/renderer.js";
import { showNotification } from "./utils.js";
import { initializeMobileMenu } from './mobile/mobile-optimizations.js';
import turnEventsSystem from './systems/turnEventsSystem.js';

// Elementos do DOM
const authButton = document.getElementById('auth-button');
const mainLoginBtn = document.getElementById('main-login-btn');
const heroBlurb = document.getElementById('hero-blurb');
const heroFacebookBtn = document.getElementById('hero-facebook-btn');
function getHeroBlurb() {
  return heroBlurb || (document.querySelector('h1.text-4xl') ? document.querySelector('h1.text-4xl').parentElement : null);
}
const turnPostBtn = document.getElementById('turn-post-button');
const filterSelect = document.getElementById('filtro-visibilidade');
const refreshButton = document.getElementById('refresh-paises');
const searchInput = document.getElementById('search-country-input'); // Adicionado
const turnoEditor = document.getElementById('turno-editor');
const lastSyncElement = document.getElementById('last-sync');
const countryListContainer = document.getElementById('lista-paises-publicos');
const countryPanelModal = document.getElementById('country-panel-modal');
const closeCountryPanelBtn = document.getElementById('close-country-panel');
const authModal = document.getElementById('auth-modal');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const googleLoginBtn = document.getElementById('google-login-btn');
const closeAuthModal = document.getElementById('close-auth-modal');
const authErrorMessage = document.getElementById('auth-error-message');
const authSuccessMessage = document.getElementById('auth-success-message');

// Estado da aplicação
let appState = {
  allCountries: [],
  gameConfig: {},
  isDataLoaded: false,
  playerCountry: null,
  currentTurn: 0,
};

// Tornar appState global para acesso pelos módulos
window.appState = appState;

let currentAuthMode = 'login'; // 'login' ou 'register'

// Funções de UI para o modal
function showAuthModal(mode = 'login') {
  currentAuthMode = mode;
  updateAuthModalUI();
  authModal.classList.remove('hidden');
  document.body.classList.add('auth-modal-open');
  clearAuthMessages();
  if (countryPanelModal && !countryPanelModal.classList.contains('hidden')) {
    countryPanelModal.classList.add('hidden');
  }
}

function hideAuthModal() {
  authModal.classList.add('hidden');
  document.body.classList.remove('auth-modal-open');
  clearAuthMessages();
  resetAuthForms();
}

function updateAuthModalUI() {
  const isLogin = currentAuthMode === 'login';

  // Atualizar tabs
  if (isLogin) {
    loginTab.classList.add('bg-brand-500', 'text-slate-950');
    loginTab.classList.remove('text-slate-300', 'hover:text-slate-100');
    registerTab.classList.remove('bg-brand-500', 'text-slate-950');
    registerTab.classList.add('text-slate-300', 'hover:text-slate-100');
  } else {
    registerTab.classList.add('bg-brand-500', 'text-slate-950');
    registerTab.classList.remove('text-slate-300', 'hover:text-slate-100');
    loginTab.classList.remove('bg-brand-500', 'text-slate-950');
    loginTab.classList.add('text-slate-300', 'hover:text-slate-100');
  }

  // Atualizar forms
  if (isLogin) {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    document.getElementById('auth-modal-title').textContent = 'Entrar no Portal';
    document.getElementById('auth-modal-subtitle').textContent = 'Acesse sua conta';
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    document.getElementById('auth-modal-title').textContent = 'Criar Conta';
    document.getElementById('auth-modal-subtitle').textContent = 'Registre-se para começar';
  }
}

function clearAuthMessages() {
  authErrorMessage.classList.add('hidden');
  authSuccessMessage.classList.add('hidden');
}

function showAuthError(message) {
  authErrorMessage.textContent = message;
  authErrorMessage.classList.remove('hidden');
  authSuccessMessage.classList.add('hidden');
}

function showAuthSuccess(message) {
  authSuccessMessage.textContent = message;
  authSuccessMessage.classList.remove('hidden');
  authErrorMessage.classList.add('hidden');
}

function resetAuthForms() {
  loginForm.reset();
  registerForm.reset();
}

async function processGoogleRedirectLogin() {
  try {
    const result = await handleGoogleRedirectResult(true);
    if (result && result.success && result.user) {
      hideAuthModal();
      clearAuthMessages();
      const displayName = result.user.displayName || result.user.email;
      showNotification('success', `Bem-vindo, ${displayName}!`);
    }
  } catch (error) {
    console.error('Erro ao processar redirect do Google:', error);
    showAuthError('Não foi possível concluir o login com Google.');
  }
}

// Funções de controle
async function loadSiteData() {
  console.log("Carregando dados do site...");
  
  try {
    // Mostrar loading
    document.querySelectorAll('.loading-shimmer').forEach(el => el.style.display = 'inline');

    appState.allCountries = await getAllCountries();
    appState.gameConfig = await getGameConfig();
    appState.currentTurn = appState.gameConfig?.turnoAtual || 0;

    // Inicializar sistema de eventos de turno
    turnEventsSystem.init(appState.currentTurn);

    console.log("Países carregados:", appState.allCountries.length);
    console.log("Config do jogo:", appState.gameConfig);

    if (appState.allCountries.length > 0) {
      updateKPIs(appState.allCountries);
      filterAndRenderCountries();
      
      // Atualizar turno atual na interface
      const turnoAtualElement = document.getElementById('turno-atual');
      if (turnoAtualElement && appState.gameConfig && appState.gameConfig.turnoAtual) {
        turnoAtualElement.textContent = `#${appState.gameConfig.turnoAtual}`;
      }
      
      // Esconder loading
      document.querySelectorAll('.loading-shimmer').forEach(el => el.style.display = 'none');
      appState.isDataLoaded = true;
      
      // Ativar sincronização em tempo real após carregamento inicial
      setupRealTimeSync();
    } else {
      console.warn("Nenhum país encontrado no Firestore");
      showNotification('warning', 'Nenhum país encontrado. Verifique a configuração do Firestore.');
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    showNotification('error', 'Erro ao carregar dados do servidor.');
  }
  
  updateLastSyncTime();

  // Atualiza o texto do botão de turno (se logado)
  if (auth.currentUser && turnPostBtn && appState.gameConfig && appState.gameConfig.turnoAtual) {
    turnPostBtn.textContent = `Ver turno #${appState.gameConfig.turnoAtual} (Facebook)`;
  }
}

function filterAndRenderCountries() {
  const filterValue = filterSelect.value;
  const searchTerm = searchInput.value.toLowerCase(); // Get search term
  let filteredCountries = [];

  // Apply visibility filter first
  if (filterValue === 'todos') {
    filteredCountries = appState.allCountries;
  } else if (filterValue === 'publicos') {
    filteredCountries = appState.allCountries.filter(c => c.Visibilidade && c.Visibilidade.toLowerCase() === 'público');
  } else if (filterValue === 'privados') {
    filteredCountries = appState.allCountries.filter(c => c.Visibilidade && c.Visibilidade.toLowerCase() === 'privado');
  } else if (filterValue === 'com-jogadores') {
    filteredCountries = appState.allCountries.filter(c => c.Player);
  } else if (filterValue === 'sem-jogadores') {
    filteredCountries = appState.allCountries.filter(c => !c.Player);
  }

  // Apply search term filter
  if (searchTerm) {
    filteredCountries = filteredCountries.filter(c => 
      c.Pais && c.Pais.toLowerCase().includes(searchTerm)
    );
  }

  console.log(`Renderizando ${filteredCountries.length} países (filtro: ${filterValue}, busca: ${searchTerm})`);
  renderPublicCountries(filteredCountries);
  
  // Adicionar event listeners para os países após renderizar
  addCountryEventListeners();
}

countryPanelModal.addEventListener('click', (e) => {
  if (e.target === countryPanelModal) {
    countryPanelModal.classList.add('hidden');
  }
});

// Abrir painel detalhado ao clicar em qualquer card (delegação)
if (countryListContainer) {
  countryListContainer.addEventListener('click', async (e) => {
    const button = e.target.closest('.country-card-button');
    if (!button) return;
    e.preventDefault();
    const countryId = button.dataset.countryId;
    const countryData = appState.allCountries.find(c => c.id === countryId);
    if (countryData) {
      await renderDetailedCountryPanel(countryData);
    }
  });
}

// Esc para fechar modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!authModal.classList.contains('hidden')) {
      hideAuthModal();
    }
    if (!countryPanelModal.classList.contains('hidden')) {
      countryPanelModal.classList.add('hidden');
    }
  }
});

filterSelect.addEventListener('change', filterAndRenderCountries);
searchInput.addEventListener('input', filterAndRenderCountries); // Add event listener for search input
refreshButton.addEventListener('click', loadSiteData);

// NOVA FUNÇÃO: Adicionar event listeners para os botões dos países
function addCountryEventListeners() {
  const countryButtons = document.querySelectorAll('.country-card-button');
  
  countryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const countryId = button.dataset.countryId;
      const countryData = appState.allCountries.find(c => c.id === countryId);
      
      if (countryData) {
        console.log("País clicado:", countryData.Pais);
        // Por enquanto só mostrar no console - painel detalhado virá depois
        showNotification('info', `Você clicou em ${countryData.Pais}`);
      }
    });
  });
  
  console.log(`Event listeners adicionados para ${countryButtons.length} países`);
}

function updateLastSyncTime() {
  const now = new Date();
  const lastSyncElement = document.getElementById('last-sync');
  if (lastSyncElement) {
    lastSyncElement.textContent = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Lógica de Autenticação e Dados do Jogador
async function handleUserLogin(user) {
  console.log("Mudança de estado de autenticação:", user ? "Logado" : "Deslogado");
  
  if (user) {
    hideAuthModal();
    clearAuthMessages();
    authButton.querySelector('.btn-text').textContent = 'Sair';
    const hb = getHeroBlurb();
    if (hb) hb.classList.add('hidden');
    if (turnPostBtn) turnPostBtn.classList.remove('hidden');
    if (mainLoginBtn) mainLoginBtn.classList.add('hidden');
    if (heroFacebookBtn) heroFacebookBtn.classList.add('hidden');
    console.log("Usuário logado:", user.displayName || user.email);
    
    try {
      const userPermissions = await checkUserPermissions(user.uid);
      console.log("Permissões do usuário:", userPermissions);
      updateNarratorUI(userPermissions.isNarrator, userPermissions.isAdmin);

      const paisId = await checkPlayerCountry(user.uid);
      console.log("País do jogador:", paisId);
      
      if (paisId) {
        const playerData = appState.allCountries.find(c => c.id === paisId);
        if (playerData) {
          // Store country in localStorage for vehicle creator
          localStorage.setItem('loggedCountry', playerData.id);
          console.log('País salvo no localStorage (main):', playerData.id);

          // Atualizar appState com dados do jogador
          appState.playerCountry = playerData;
          console.log('DEBUG: appState.playerCountry definido como:', playerData); // Adicionado para depuração
          appState.currentTurn = appState.gameConfig.turnoAtual || 0;

          fillPlayerPanel(playerData, appState.gameConfig.turnoAtual);
        }
      } else {
        const availableCountries = appState.allCountries.filter(c => !c.Player);
        if (availableCountries.length > 0) {
          const modal = createCountrySelectionModal(availableCountries);
          handleCountrySelection(modal, user.uid);
        } else {
          showNotification('warning', 'Não há países disponíveis para seleção no momento.');
        }
      }
    } catch (error) {
      console.error("Erro ao processar login do usuário:", error);
      showNotification('error', 'Erro ao carregar dados do usuário.');
    }
  } else {
    authButton.querySelector('.btn-text').textContent = 'Entrar';
    updateNarratorUI(false, false);
    fillPlayerPanel(null); // Limpa o painel do jogador
    
    // Limpar listeners de tempo real ao deslogar
    teardownRealTimeSync();
    
    const hb2 = getHeroBlurb();
    if (hb2) hb2.classList.remove('hidden');
    if (turnPostBtn) turnPostBtn.classList.add('hidden');
    if (mainLoginBtn) mainLoginBtn.classList.remove('hidden');
    if (heroFacebookBtn) heroFacebookBtn.classList.remove('hidden');
  }
}

// Lida com a seleção de país no modal
function handleCountrySelection(modal, userId) {
  let selectedCountry = null;
  const countryOptions = modal.querySelectorAll('.pais-option');
  const confirmButton = modal.querySelector('#confirmar-selecao');
  const cancelButton = modal.querySelector('#cancelar-selecao');
  const searchInput = modal.querySelector('#busca-pais');
  const visibleCountriesCount = modal.querySelector('#paises-visiveis');

  countryOptions.forEach(option => {
    option.addEventListener('click', () => {
      countryOptions.forEach(op => op.classList.remove('border-brand-500', 'bg-brand-500/10'));
      option.classList.add('border-brand-500', 'bg-brand-500/10');
      selectedCountry = {
        id: option.dataset.paisId,
        name: option.dataset.paisNome
      };
      confirmButton.disabled = false;
    });
  });

  if (searchInput && visibleCountriesCount) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      let visibleCount = 0;
      countryOptions.forEach(option => {
        const countryName = option.dataset.paisNome.toLowerCase();
        const isVisible = countryName.includes(searchTerm);
        option.style.display = isVisible ? 'block' : 'none';
        if (isVisible) visibleCount++;
      });
      visibleCountriesCount.textContent = visibleCount;
    });
  }

  if (confirmButton) {
    confirmButton.addEventListener('click', async () => {
      if (selectedCountry) {
        confirmButton.textContent = 'Vinculando...';
        confirmButton.disabled = true;
        try {
          await vincularJogadorAoPais(userId, selectedCountry.id);
          modal.remove();
          showNotification('success', `Você agora governa ${selectedCountry.name}!`);
          loadSiteData(); // Recarregar todos os dados
        } catch (error) {
          showNotification('error', 'Erro ao vincular país. Tente novamente.');
          console.error('Erro ao vincular país:', error);
        } finally {
          confirmButton.textContent = 'Confirmar Seleção';
          confirmButton.disabled = false;
        }
      }
    });
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      modal.remove();
    });
  }
}

// Event Listeners
authButton.addEventListener('click', () => {
  console.log("Botão auth clicado");
  if (auth.currentUser) {
    console.log("Fazendo logout");
    auth.signOut();
  } else {
    console.log("Abrindo modal de login");
    showAuthModal('login');
  }
});

mainLoginBtn.addEventListener('click', () => {
  console.log("Botão main login clicado");
  showAuthModal('login');
});

loginTab.addEventListener('click', () => {
  currentAuthMode = 'login';
  updateAuthModalUI();
  clearAuthMessages();
});

registerTab.addEventListener('click', () => {
  currentAuthMode = 'register';
  updateAuthModalUI();
  clearAuthMessages();
});

closeAuthModal.addEventListener('click', hideAuthModal);

// Fechar modal do país
closeCountryPanelBtn.addEventListener('click', () => {
  countryPanelModal.classList.add('hidden');
});

// Google Login
googleLoginBtn.addEventListener('click', async () => {
  console.log("Tentando login com Google");
  clearAuthMessages();

  try {
    const result = await signInWithGoogle();
    console.log("Resultado do login Google:", result);
    if (result.redirect) {
      showAuthSuccess('Abrindo login do Google em nova janela...');
      return;
    }
    if (result.success) {
      hideAuthModal();
      const displayName = result.user.displayName || result.user.email;
      showNotification('success', `Bem-vindo, ${displayName}!`);
    } else {
      console.error("Erro no login Google:", result.error);
      showAuthError(result.error ? result.error.message : 'Erro no login com Google.');
    }
  } catch (error) {
    console.error("Erro inesperado no login Google:", error);
    showAuthError('Erro inesperado no login com Google.');
  }
});

// Login Form
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("Submetendo form de login");
  clearAuthMessages();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  console.log("Tentando login com email:", email);

  try {
    const result = await signInWithEmailPassword(email, password);
    console.log("Resultado do login:", result);
    if (result.success) {
      hideAuthModal();
      showNotification('success', 'Login realizado com sucesso!');
    } else {
      console.error("Erro no login:", result.error);
      showAuthError(result.error ? result.error.message : 'Erro no login.');
    }
  } catch (error) {
    console.error("Erro inesperado no login:", error);
    showAuthError('Erro inesperado no login.');
  }
});

// Register Form
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log("Submetendo form de registro");
  clearAuthMessages();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;

  // Validações
  if (password !== confirmPassword) {
    showAuthError('As senhas não coincidem.');
    return;
  }

  if (password.length < 6) {
    showAuthError('A senha deve ter pelo menos 6 caracteres.');
    return;
  }

  console.log("Tentando registro com email:", email);

  try {
    const result = await registerWithEmailPassword(email, password, name);
    console.log("Resultado do registro:", result);
    if (result.success) {
      showAuthSuccess('Conta criada com sucesso! Redirecionando...');
      setTimeout(() => {
        hideAuthModal();
        showNotification('success', `Bem-vindo ao WAR, ${name}!`);
      }, 1500);
    } else {
      console.error("Erro no registro:", result.error);
      showAuthError(result.error ? result.error.message : 'Erro no registro.');
    }
  } catch (error) {
    console.error("Erro inesperado no registro:", error);
    showAuthError('Erro inesperado no registro.');
  }
});

// Fechar modal ao clicar fora
authModal.addEventListener('click', (e) => {
  if (e.target === authModal) {
    hideAuthModal();
  }
});

countryPanelModal.addEventListener('click', (e) => {
  if (e.target === countryPanelModal) {
    countryPanelModal.classList.add('hidden');
  }
});

// Abrir painel detalhado ao clicar em qualquer card (delegação)
if (countryListContainer) {
  countryListContainer.addEventListener('click', async (e) => {
    const button = e.target.closest('.country-card-button');
    if (!button) return;
    e.preventDefault();
    const countryId = button.dataset.countryId;
    const countryData = appState.allCountries.find(c => c.id === countryId);
    if (countryData) {
      await renderDetailedCountryPanel(countryData);
    }
  });
}

// Esc para fechar modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!authModal.classList.contains('hidden')) {
      hideAuthModal();
    }
    if (!countryPanelModal.classList.contains('hidden')) {
      countryPanelModal.classList.add('hidden');
    }
  }
});

filterSelect.addEventListener('change', filterAndRenderCountries);
refreshButton.addEventListener('click', loadSiteData);

if (turnoEditor) {
  turnoEditor.addEventListener('change', async (e) => {
    const newTurn = e.target.value;
    if (auth.currentUser) {
      const permissions = await checkUserPermissions(auth.currentUser.uid);
      if (permissions.isNarrator) {
        const success = await updateTurn(newTurn);
        if (success) {
          showNotification('success', `Turno atualizado para #${newTurn}`);
          appState.gameConfig.turnoAtual = newTurn;
          const playerData = appState.allCountries.find(c => c.Player === auth.currentUser.uid);
          if (playerData) {
            localStorage.setItem('loggedCountry', playerData.id);
          }
          fillPlayerPanel(playerData, newTurn);
        } else {
          showNotification('error', 'Erro ao salvar turno.');
        }
      }
    }
  });
}

// Monitora o estado da autenticação
auth.onAuthStateChanged(handleUserLogin);

// Sistema de sincronização em tempo real
let realTimeListeners = new Map();

function setupRealTimeSync() {
  console.log("Configurando sincronização em tempo real...");
  
  // 1. Listener para mudanças na coleção de países
  const countriesListener = db.collection('paises').onSnapshot(snapshot => {
    console.log("Mudanças detectadas na coleção de países");
    
    // Atualizar dados locais
    snapshot.docChanges().forEach(change => {
      const countryData = { id: change.doc.id, ...change.doc.data() };
      const countryIndex = appState.allCountries.findIndex(c => c.id === change.doc.id);
      
      if (change.type === 'added' && countryIndex === -1) {
        appState.allCountries.push(countryData);
        console.log(`País adicionado: ${countryData.Pais}`);
      } else if (change.type === 'modified' && countryIndex !== -1) {
        appState.allCountries[countryIndex] = countryData;
        console.log(`País atualizado: ${countryData.Pais}`);
      } else if (change.type === 'removed' && countryIndex !== -1) {
        appState.allCountries.splice(countryIndex, 1);
        console.log(`País removido: ${countryData.Pais}`);
      }
    });
    
    // Re-renderizar interface se dados foram carregados
    if (appState.isDataLoaded) {
      updateKPIs(appState.allCountries);
      filterAndRenderCountries();
      console.log("Interface atualizada automaticamente");
    }
  }, error => {
    console.error("Erro no listener de países:", error);
  });
  
  realTimeListeners.set('countries', countriesListener);
  
  // 2. Listener para eventos de broadcast do realTimeUpdates
  window.addEventListener('realtime:update', (event) => {
    console.log("Evento realtime:update recebido:", event.detail);
    
    const { countryId, section, field, newValue } = event.detail;
    
    // Encontrar e atualizar o país afetado
    const countryIndex = appState.allCountries.findIndex(c => c.id === countryId);
    if (countryIndex !== -1) {
      const country = appState.allCountries[countryIndex];
      
      // Garantir que a seção existe
      if (!country[section]) {
        country[section] = {};
      }
      
      // Atualizar o campo
      country[section][field] = newValue;
      
      // Se é um campo do nível raiz (como no geral), também atualizar lá
      if (section === 'geral') {
        country[field] = newValue;
      }
      
      console.log(`Campo ${field} do país ${country.Pais} atualizado via broadcast:`, newValue);
      
      // Re-renderizar interface
      updateKPIs(appState.allCountries);
      filterAndRenderCountries();
    }
  });
  
  // 3. Listener para mudanças de configuração do jogo
  const configListener = db.collection('configuracoes').doc('jogo').onSnapshot(doc => {
    if (doc.exists) {
      const newConfig = doc.data();
      if (appState.gameConfig.turnoAtual !== newConfig.turnoAtual) {
        console.log(`Turno atualizado: ${appState.gameConfig.turnoAtual} → ${newConfig.turnoAtual}`);
        appState.gameConfig = newConfig;
        
        // Atualizar interface do turno
        const turnoAtualElement = document.getElementById('turno-atual');
        if (turnoAtualElement) {
          turnoAtualElement.textContent = `#${newConfig.turnoAtual}`;
        }
        
        if (turnPostBtn) {
          turnPostBtn.textContent = `Ver turno #${newConfig.turnoAtual} (Facebook)`;
        }
      }
    }
  }, error => {
    console.error("Erro no listener de configuração:", error);
  });
  
  realTimeListeners.set('config', configListener);
  
  console.log("Sincronização em tempo real ativada ✅");
}

function teardownRealTimeSync() {
  console.log("Removendo listeners de tempo real...");
  realTimeListeners.forEach(unsubscribe => unsubscribe());
  realTimeListeners.clear();
}

// Limpeza ao fechar a página
window.addEventListener('beforeunload', () => {
  teardownRealTimeSync();
});

// Event listener para botão da agência de inteligência
document.addEventListener('DOMContentLoaded', () => {
  const agencyBtn = document.getElementById('btn-main-agency');
  if (agencyBtn) {
    agencyBtn.addEventListener('click', () => {
      if (appState.playerCountry) {
        // Importar e mostrar o modal da agência
        import('./ui/renderer.js').then(module => {
          // Criar modal
          const modal = document.createElement('div');
          modal.id = 'agency-modal';
          modal.className = 'fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm';

          modal.innerHTML = `
            <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4 p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <span class="text-4xl">🕵️</span>
                  <div>
                    <h3 class="text-2xl font-bold text-slate-100">Agência de Inteligência</h3>
                    <p class="text-sm text-slate-400">${appState.playerCountry.Pais}</p>
                  </div>
                </div>
                <button id="close-agency-modal" class="text-slate-400 hover:text-slate-200 text-2xl transition">×</button>
              </div>
              <div id="agency-dashboard-content">
                <div class="text-center py-12">
                  <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                  <p class="text-slate-400">Carregando...</p>
                </div>
              </div>
            </div>
          `;

          document.body.appendChild(modal);

          // Event listeners de fechamento
          const closeBtn = document.getElementById('close-agency-modal');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => modal.remove());
          }
          modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
          });

          // Carregar dashboard
          import('./components/agencyDashboard.js').then(dashModule => {
            const container = document.getElementById('agency-dashboard-content');
            if (container) {
              dashModule.renderAgencyDashboard(appState.playerCountry, container);
            }
          });
        });
      }
    });
  }
});

// Inicializar mapa do mundo (modo somente visualização)
let playerWorldMap = null;

async function initPlayerWorldMap() {
  try {
    const mapContainer = document.getElementById('world-map-player');
    if (!mapContainer) {
      console.log('Container do mapa não encontrado');
      return;
    }

    // Importar WorldMap
    const { WorldMap } = await import('./components/worldMap.js');

    // Criar instância do mapa em modo somente leitura
    playerWorldMap = new WorldMap('world-map-player');
    await playerWorldMap.initialize(false); // false = modo player (read-only)

    // Atualizar mensagem de status
    const mapInfo = document.getElementById('map-info-text-player');
    if (mapInfo) {
      mapInfo.textContent = 'Mapa carregado com sucesso!';
    }

    console.log('Mapa mundial (players) inicializado');
  } catch (error) {
    console.error('Erro ao inicializar mapa mundial:', error);
    const mapInfo = document.getElementById('map-info-text-player');
    if (mapInfo) {
      mapInfo.textContent = 'Erro ao carregar mapa: ' + error.message;
    }
  }
}

// Carregamento inicial
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM carregado, iniciando aplicação");
  processGoogleRedirectLogin();
  loadSiteData();

  // Inicializar mapa após um pequeno delay para garantir que o Leaflet carregou
  setTimeout(() => {
    initPlayerWorldMap();
  }, 500);
});
