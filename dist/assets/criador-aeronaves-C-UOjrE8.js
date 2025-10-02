import{_ as A,a as O,f as F,i as N,e as W}from"./firebase-DhoRyF0N.js";/* empty css                                 */import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";class z{constructor(){this.metrics={loadTimes:[],componentLoads:0,templateCacheHits:0,templateCacheMisses:0,errors:0,totalLoadTime:0,averageLoadTime:0,worstLoadTime:0,bestLoadTime:1/0},this.observers=[],this.startTime=performance.now(),this.isEnabled=!0,console.log("📊 PerformanceMonitor initialized")}recordLoad(e,t,a=!0){this.isEnabled&&(this.metrics.loadTimes.push({operation:e,duration:t,success:a,timestamp:Date.now()}),a?(this.metrics.totalLoadTime+=t,this.metrics.componentLoads++,t>this.metrics.worstLoadTime&&(this.metrics.worstLoadTime=t),t<this.metrics.bestLoadTime&&(this.metrics.bestLoadTime=t),this.metrics.averageLoadTime=this.metrics.totalLoadTime/this.metrics.componentLoads):this.metrics.errors++,this.notifyObservers("load",{operation:e,duration:t,success:a}))}recordCacheEvent(e,t){this.isEnabled&&(e==="hit"?this.metrics.templateCacheHits++:this.metrics.templateCacheMisses++,this.notifyObservers("cache",{type:e,operation:t}))}getPerformanceSummary(){const e=this.metrics.templateCacheHits+this.metrics.templateCacheMisses,t=e>0?(this.metrics.templateCacheHits/e*100).toFixed(1):0;return{uptime:`${((performance.now()-this.startTime)/1e3).toFixed(1)}s`,totalLoads:this.metrics.componentLoads,averageLoadTime:`${this.metrics.averageLoadTime.toFixed(2)}ms`,worstLoadTime:`${this.metrics.worstLoadTime.toFixed(2)}ms`,bestLoadTime:this.metrics.bestLoadTime===1/0?"0ms":`${this.metrics.bestLoadTime.toFixed(2)}ms`,cacheHitRate:`${t}%`,cacheHits:this.metrics.templateCacheHits,cacheMisses:this.metrics.templateCacheMisses,errors:this.metrics.errors,successRate:this.metrics.componentLoads>0?`${(this.metrics.componentLoads/(this.metrics.componentLoads+this.metrics.errors)*100).toFixed(1)}%`:"100%"}}logPerformanceSummary(){const e=this.getPerformanceSummary();console.group("📊 Performance Summary"),console.log(`⏱️  Uptime: ${e.uptime}`),console.log(`🔄 Total Loads: ${e.totalLoads}`),console.log(`⚡ Average Load Time: ${e.averageLoadTime}`),console.log(`🐌 Worst Load Time: ${e.worstLoadTime}`),console.log(`🚀 Best Load Time: ${e.bestLoadTime}`),console.log(`📋 Cache Hit Rate: ${e.cacheHitRate}`),console.log(`✅ Success Rate: ${e.successRate}`),e.errors>0&&console.warn(`❌ Errors: ${e.errors}`),console.groupEnd()}getLoadHistory(e=10){return this.metrics.loadTimes.slice(-e).map(t=>({operation:t.operation,duration:`${t.duration.toFixed(2)}ms`,success:t.success?"✅":"❌",timestamp:new Date(t.timestamp).toLocaleTimeString()}))}getRecommendations(){const e=[],t=this.getPerformanceSummary();parseFloat(t.cacheHitRate)<60&&e.push({type:"cache",priority:"high",message:`Cache hit rate is low (${t.cacheHitRate}). Consider preloading more templates.`}),parseFloat(t.averageLoadTime)>200&&e.push({type:"performance",priority:"medium",message:`Average load time is high (${t.averageLoadTime}). Consider optimizing component loading.`});const s=100-parseFloat(t.successRate);if(s>5&&e.push({type:"reliability",priority:"high",message:`Error rate is concerning (${s.toFixed(1)}%). Check network and component availability.`}),performance.memory){const n=performance.memory.usedJSHeapSize/1024/1024;n>50&&e.push({type:"memory",priority:"medium",message:`Memory usage is high (${n.toFixed(1)}MB). Consider clearing caches periodically.`})}return e}addObserver(e){this.observers.push(e)}removeObserver(e){this.observers=this.observers.filter(t=>t!==e)}notifyObservers(e,t){this.observers.forEach(a=>{try{a(e,t)}catch(i){console.warn("Performance observer error:",i)}})}startPeriodicReporting(e=60){setInterval(()=>{if(this.isEnabled){this.logPerformanceSummary();const t=this.getRecommendations();t.length>0&&(console.group("💡 Performance Recommendations"),t.forEach(a=>{const i=a.priority==="high"?"🔴":a.priority==="medium"?"🟡":"🟢";console.log(`${i} ${a.message}`)}),console.groupEnd())}},e*1e3)}setEnabled(e){this.isEnabled=e,console.log(`📊 Performance monitoring ${e?"enabled":"disabled"}`)}reset(){this.metrics={loadTimes:[],componentLoads:0,templateCacheHits:0,templateCacheMisses:0,errors:0,totalLoadTime:0,averageLoadTime:0,worstLoadTime:0,bestLoadTime:1/0},this.startTime=performance.now(),console.log("📊 Performance metrics reset")}}const S=new z;window.performanceMonitor=S;(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&S.startPeriodicReporting(120);class I{constructor(){this.templateCache=new Map,this.componentCache=new Map,this.loadingStates=new Map,this.pendingRequests=new Map,this.priorities=new Map,this.loadingQueue=[],this.maxConcurrentLoads=3,this.currentLoads=0,this.initialized=!1,this.performanceMetrics={templateLoads:0,cacheHits:0,loadTime:[],errors:0},this.updateTimers=new Map,console.log("🚀 OptimizedTemplateLoader initialized")}async initialize(){if(this.initialized)return;console.log("⚡ Initializing optimized template loader...");const e=["templates/aircraft-creator/airframes-tab.html","templates/aircraft-creator/engines-tab.html","templates/aircraft-creator/wings-tab.html"];try{await this.preloadTemplates(e),console.log("✅ Critical templates preloaded")}catch(t){console.warn("⚠️ Some critical templates failed to preload:",t)}this.initialized=!0,console.log("🎯 OptimizedTemplateLoader ready")}async preloadTemplates(e){const t=e.map(a=>this.loadTemplate(a,{priority:"low",cache:!0}));return Promise.allSettled(t)}async loadTemplate(e,t={}){const{priority:a="normal",cache:i=!0,force:s=!1,timeout:n=5e3}=t,o=performance.now();if(!s&&i&&this.templateCache.has(e))return this.performanceMetrics.cacheHits++,S.recordCacheEvent("hit",e),console.log(`📋 Template cache hit: ${e}`),this.templateCache.get(e);if(S.recordCacheEvent("miss",e),this.pendingRequests.has(e))return console.log(`⏳ Template already loading: ${e}`),this.pendingRequests.get(e);const r=this.performTemplateLoad(e,n);this.pendingRequests.set(e,r),this.priorities.set(e,a);try{const l=await r;i&&this.templateCache.set(e,l);const d=performance.now()-o;return this.performanceMetrics.templateLoads++,this.performanceMetrics.loadTime.push(d),S.recordLoad(`template:${e}`,d,!0),console.log(`✅ Template loaded: ${e} (${d.toFixed(2)}ms)`),l}catch(l){this.performanceMetrics.errors++;const d=performance.now()-o;throw S.recordLoad(`template:${e}`,d,!1),console.error(`❌ Template load failed: ${e}`,l),l}finally{this.pendingRequests.delete(e),this.priorities.delete(e)}}async performTemplateLoad(e,t){const a=new AbortController,i=setTimeout(()=>a.abort(),t);try{const s=await fetch(e,{signal:a.signal,cache:"force-cache"});if(!s.ok)throw new Error(`HTTP ${s.status}: ${s.statusText}`);const n=await s.text();return clearTimeout(i),n}catch(s){throw clearTimeout(i),s.name==="AbortError"?new Error(`Template load timeout: ${e}`):s}}async loadAndInjectTemplate(e,t,a={}){try{const i=document.getElementById(e);if(!i)throw new Error(`Container not found: ${e}`);this.showOptimizedLoadingState(i);const s=await this.loadTemplate(t,{priority:"high"}),n=this.processTemplate(s,a);return await this.injectWithTransitionAsync(i,n),n}catch(i){throw console.error(`❌ Template injection failed: ${t}`,i),this.showErrorState(e,i.message),i}}processTemplate(e,t){if(!t||Object.keys(t).length===0)return e;let a=e;for(const[i,s]of Object.entries(t)){const n=new RegExp(`{{\\s*${i}\\s*}}`,"g");a=a.replace(n,String(s))}return a}injectWithTransition(e,t){e.style.opacity="0.7",e.style.transition="opacity 0.15s ease",setTimeout(()=>{e.innerHTML=t,e.style.opacity="1",setTimeout(()=>{e.style.transition=""},150)},50)}async injectWithTransitionAsync(e,t){return new Promise(a=>{e.style.opacity="0.7",e.style.transition="opacity 0.15s ease",setTimeout(()=>{e.innerHTML=t,e.style.opacity="1",setTimeout(()=>{e.style.transition="",a()},150)},50)})}showOptimizedLoadingState(e,t="Carregando..."){e.innerHTML=`
            <div class="loading-spinner-optimized">
                <div class="spinner"></div>
                <div class="loading-text">${t}</div>
            </div>
            <style>
                .loading-spinner-optimized {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    color: rgb(148 163 184);
                }
                .spinner {
                    width: 24px;
                    height: 24px;
                    border: 2px solid rgb(51 65 85);
                    border-top: 2px solid rgb(6 182 212);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                .loading-text {
                    margin-top: 0.75rem;
                    font-size: 0.875rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `}showErrorState(e,t){const a=document.getElementById(e);a&&(a.innerHTML=`
                <div class="error-state-optimized">
                    <div class="error-icon">⚠️</div>
                    <div class="error-message">Erro ao carregar: ${t}</div>
                    <button class="retry-button" onclick="location.reload()">Tentar Novamente</button>
                </div>
                <style>
                    .error-state-optimized {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 2rem;
                        color: rgb(248 113 113);
                        text-align: center;
                    }
                    .error-icon {
                        font-size: 2rem;
                        margin-bottom: 0.5rem;
                    }
                    .error-message {
                        font-size: 0.875rem;
                        margin-bottom: 1rem;
                        max-width: 300px;
                    }
                    .retry-button {
                        padding: 0.5rem 1rem;
                        background: rgb(239 68 68);
                        color: white;
                        border: none;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 0.875rem;
                    }
                    .retry-button:hover {
                        background: rgb(220 38 38);
                    }
                </style>
            `)}debouncedUpdate(e,t,a=100){this.updateTimers.has(e)&&clearTimeout(this.updateTimers.get(e));const i=setTimeout(()=>{t(),this.updateTimers.delete(e)},a);this.updateTimers.set(e,i)}async batchLoadComponents(e){const t=[];for(const a of e)this.componentCache.has(a)||t.push(this.loadComponentType(a));if(t.length===0){console.log("📋 All components cached, no loading needed");return}console.log(`🔄 Batch loading ${t.length} component types...`);try{await Promise.all(t),console.log("✅ Batch component loading completed")}catch(a){throw console.error("❌ Batch loading failed:",a),a}}async loadComponentType(e){if(this.componentCache.has(e))return this.componentCache.get(e);if(window.loadAircraftComponents)try{await window.loadAircraftComponents(),window.AIRCRAFT_COMPONENTS&&window.AIRCRAFT_COMPONENTS[e]&&(this.componentCache.set(e,window.AIRCRAFT_COMPONENTS[e]),console.log(`✅ Component type cached: ${e}`))}catch(t){throw console.error(`❌ Failed to load component type: ${e}`,t),t}}clearCaches(){console.log("🧹 Clearing template and component caches..."),this.templateCache.clear(),this.componentCache.clear(),this.loadingStates.clear();for(const e of this.updateTimers.values())clearTimeout(e);this.updateTimers.clear(),console.log("✅ Caches cleared")}getPerformanceMetrics(){const e=this.performanceMetrics.loadTime.length>0?this.performanceMetrics.loadTime.reduce((t,a)=>t+a)/this.performanceMetrics.loadTime.length:0;return{...this.performanceMetrics,avgLoadTime:e.toFixed(2),cacheHitRate:this.performanceMetrics.templateLoads>0?(this.performanceMetrics.cacheHits/(this.performanceMetrics.templateLoads+this.performanceMetrics.cacheHits)*100).toFixed(1):0}}logPerformanceMetrics(){const e=this.getPerformanceMetrics();console.log("📊 Template Loader Performance:",e)}}const C=new I;window.optimizedTemplateLoader=C;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{C.initialize()}):C.initialize();class B{constructor(){this.tabContent=null,this.currentTechLevel=50,this.loadingCache=new Map,this.componentLoadPromise=null}getTabContent(){return this.tabContent||(this.tabContent=document.getElementById("tab-content")),this.tabContent}showLoadingState(e="Carregando componentes..."){const t=this.getTabContent();t&&C.showOptimizedLoadingState(t,e)}showEmptyState(e){const t=this.getTabContent();t&&(t.innerHTML=`<div class="text-center text-slate-500 p-8">${e}</div>`)}updateTechLevel(){window.currentUserCountry&&typeof window.currentUserCountry.aircraftTech<"u"?(this.currentTechLevel=window.currentUserCountry.aircraftTech,console.log(`✅ Tech level successfully set to: ${this.currentTechLevel} for country: ${window.currentUserCountry.Pais}`)):(this.currentTechLevel=50,console.warn(`⚠️ Could not determine user country tech level. Using default: ${this.currentTechLevel}`))}filterAvailableComponents(e){const t={},a=window.currentUserCountry?.year||1954;for(const[i,s]of Object.entries(e)){const n=s.tech_level||0,o=s.year_introduced||1945,r=this.currentTechLevel>=n,l=a>=o;r&&l&&(t[i]=s)}return t}getComponentStatusClass(e){const t=e.tech_level||0;return this.currentTechLevel>=t?"available":"locked"}getComponentAvailabilityInfo(e){const t=e.tech_level||0;return{isAvailable:this.currentTechLevel>=t,requiredTech:t,currentTech:this.currentTechLevel,missingTech:Math.max(0,t-this.currentTechLevel)}}loadCategoryTab(){console.log("🔄 Loading Category Selection Tab...");const e=this.createCategorySelectionInterface();this.getTabContent().innerHTML=e,this.initializeCategoryControls()}createCategorySelectionInterface(){return`
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">🎯</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Categoria da Aeronave</h2>
            <p class="text-sm text-slate-400">Escolha o tipo geral da sua aeronave</p>
          </div>
        </div>

        <!-- Category Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <!-- Fighter Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="fighter">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">🛩️</span>
              <h3 class="text-xl font-semibold text-slate-200">Caça</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves de combate ágeis, focadas em superioridade aérea e interceptação</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Alta manobrabilidade</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Velocidade elevada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Alcance médio</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Capacidade de carga limitada</span>
              </div>
            </div>
          </div>

          <!-- Bomber Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="bomber">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">💣</span>
              <h3 class="text-xl font-semibold text-slate-200">Bombardeiro</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves pesadas para bombardeio estratégico e tático</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Grande capacidade de bombas</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Longo alcance</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Baixa manobrabilidade</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Vulnerável a caças</span>
              </div>
            </div>
          </div>

          <!-- Transport Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="transport">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">✈️</span>
              <h3 class="text-xl font-semibold text-slate-200">Transporte</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves para transporte de tropas, suprimentos e equipamentos</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Grande capacidade de carga</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Versátil</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Velocidade moderada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Sem armamento pesado</span>
              </div>
            </div>
          </div>

          <!-- Attack Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="attack">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">⚔️</span>
              <h3 class="text-xl font-semibold text-slate-200">Ataque ao Solo</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves especializadas em apoio aéreo aproximado</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Armamento variado</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Boa proteção</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Velocidade moderada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Manobrabilidade média</span>
              </div>
            </div>
          </div>

          <!-- Experimental Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="experimental">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">🧪</span>
              <h3 class="text-xl font-semibold text-slate-200">Experimental</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Projetos experimentais e protótipos avançados</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Tecnologia avançada</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Performance única</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Custo muito alto</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Confiabilidade baixa</span>
              </div>
            </div>
          </div>

          <!-- Helicopter Category -->
          <div class="category-option p-6 border border-slate-600 rounded-xl cursor-pointer hover:border-slate-500 transition-colors" data-category="helicopter">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-4xl">🚁</span>
              <h3 class="text-xl font-semibold text-slate-200">Helicóptero</h3>
            </div>
            <p class="text-sm text-slate-400 mb-4">Aeronaves de asas rotativas para missões especiais e suporte</p>
            <div class="space-y-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Decolagem vertical</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Capacidade de hover</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Alta manobrabilidade</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>Alcance limitado</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Selected Category Info -->
        <div id="selected-category-info" class="hidden bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4">Categoria Selecionada: <span id="selected-category-name">-</span></h3>
          <div id="category-description" class="text-sm text-slate-300 mb-4"></div>

          <div class="flex items-center justify-between">
            <div class="text-sm text-slate-400">
              Prossiga para a aba <strong>Célula</strong> para escolher a fuselagem específica
            </div>
            <button id="continue-to-cell-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Continuar →
            </button>
          </div>
        </div>
      </div>

      <style>
        .category-option.selected {
          border-color: rgb(6 182 212);
          background: rgb(6 182 212 / 0.1);
        }
        .category-option.selected h3 {
          color: rgb(103 232 249);
        }
      </style>
    `}initializeCategoryControls(){let e=null;const t=document.querySelectorAll(".category-option"),a=document.getElementById("selected-category-info"),i=document.getElementById("selected-category-name"),s=document.getElementById("category-description"),n=document.getElementById("continue-to-cell-btn");t.forEach(r=>{r.addEventListener("click",()=>{t.forEach(l=>l.classList.remove("selected")),r.classList.add("selected"),e=r.dataset.category,this.updateCategoryInfo(e,i,s,a),window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.category=e})}),n&&n.addEventListener("click",()=>{const r=document.querySelector('[data-tab="cell"]');r&&r.click()});const o=document.querySelector('[data-category="fighter"]');o&&o.click()}updateCategoryInfo(e,t,a,i){const n={fighter:{name:"Caça",description:"Aeronaves de combate projetadas para domínio aéreo. Priorizam velocidade, manobrabilidade e capacidade de combate ar-ar. Ideais para interceptação e superioridade aérea."},bomber:{name:"Bombardeiro",description:"Aeronaves pesadas focadas em bombardeio estratégico e tático. Grande capacidade de carga de bombas e longo alcance, mas com menor agilidade."},transport:{name:"Transporte",description:"Aeronaves versáteis para transporte de tropas, equipamentos e suprimentos. Focam em capacidade de carga e alcance em vez de performance de combate."},helicopter:{name:"Helicóptero",description:"Aeronaves de asas rotativas para missões especiais e suporte. Capacidade de decolagem e pouso vertical, hover e operação em baixa altitude."},attack:{name:"Ataque ao Solo",description:"Aeronaves especializadas em apoio aéreo aproximado e ataque a alvos terrestres. Balanceiam armamento, proteção e manobrabilidade."},experimental:{name:"Experimental",description:"Projetos avançados e protótipos que testam novas tecnologias. Oferece capacidades únicas mas com custos elevados e confiabilidade questionável."}}[e];t.textContent=n.name,a.textContent=n.description,i.classList.remove("hidden")}loadStructureTab(){console.log("🔄 Loading Structure & Materials Tab..."),this.updateTechLevel();const e=this.createSimplifiedStructureInterface();this.getTabContent().innerHTML=e,this.initializeSimpleStructureControls()}createSimplifiedStructureInterface(){return`
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">🏗️</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Estrutura e Materiais</h2>
            <p class="text-sm text-slate-400">Configure a estrutura da sua aeronave</p>
          </div>
        </div>

        <!-- Material Selection -->
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>🔩</span>
            <span>Material Estrutural</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="material-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-material="aluminum">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🔩</span>
                <h4 class="font-semibold text-slate-200">Alumínio</h4>
              </div>
              <p class="text-sm text-slate-400 mb-3">Liga de alumínio padrão, equilibrando peso e custo</p>
              <div class="text-xs text-slate-300">
                <div>Custo: <span class="text-green-400">Padrão</span></div>
                <div>Peso: <span class="text-yellow-400">Leve</span></div>
                <div>Durabilidade: <span class="text-blue-400">Boa</span></div>
              </div>
            </div>

            <div class="material-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-material="steel">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">⚙️</span>
                <h4 class="font-semibold text-slate-200">Aço</h4>
              </div>
              <p class="text-sm text-slate-400 mb-3">Estrutura de aço resistente, mais pesada mas durável</p>
              <div class="text-xs text-slate-300">
                <div>Custo: <span class="text-green-400">Baixo</span></div>
                <div>Peso: <span class="text-red-400">Pesado</span></div>
                <div>Durabilidade: <span class="text-green-400">Excelente</span></div>
              </div>
            </div>

            <div class="material-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-material="composite">
              <div class="flex items-center gap-3 mb-2">
                <span class="text-2xl">🧪</span>
                <h4 class="font-semibold text-slate-200">Compósito</h4>
              </div>
              <p class="text-sm text-slate-400 mb-3">Materiais avançados, leves mas caros (Experimental)</p>
              <div class="text-xs text-slate-300">
                <div>Custo: <span class="text-red-400">Alto</span></div>
                <div>Peso: <span class="text-green-400">Muito Leve</span></div>
                <div>Durabilidade: <span class="text-yellow-400">Boa</span></div>
              </div>
            </div>
          </div>

          <div id="selected-material-info" class="mt-4 p-4 bg-slate-700/30 rounded-lg hidden">
            <h4 class="font-semibold text-slate-200 mb-2">Material Selecionado: <span id="selected-material-name">-</span></h4>
            <div id="material-effects" class="text-sm text-slate-300">
              <!-- Effects will be populated -->
            </div>
          </div>
        </div>

        <!-- Center of Gravity -->
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>⚖️</span>
            <span>Centro de Gravidade</span>
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- CG Visualization -->
            <div>
              <div class="relative mb-4">
                <div class="h-8 bg-slate-700 rounded-lg overflow-hidden">
                  <div class="absolute left-0 top-0 w-4 h-full bg-red-500/30 border-r border-red-500"></div>
                  <div class="absolute left-1/4 top-0 w-1/2 h-full bg-green-500/20"></div>
                  <div class="absolute right-0 top-0 w-4 h-full bg-red-500/30 border-l border-red-500"></div>
                  <div id="cg-indicator" class="absolute top-0 w-2 h-full bg-yellow-400 transition-all duration-300" style="left: 45%;"></div>
                </div>
                <div class="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Nariz</span>
                  <span>Faixa Ideal</span>
                  <span>Cauda</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-slate-400">Posição:</span>
                  <span id="cg-position" class="text-slate-200 font-mono">45% MAC</span>
                </div>
                <div>
                  <span class="text-slate-400">Massa Total:</span>
                  <span id="cg-total-mass" class="text-slate-200 font-mono">2500 kg</span>
                </div>
              </div>
            </div>

            <!-- Mass Distribution -->
            <div>
              <h4 class="font-semibold text-slate-200 mb-3">Distribuição de Massa</h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-400">Fuselagem:</span>
                  <span class="text-slate-200" id="mass-airframe">1800 kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Motor:</span>
                  <span class="text-slate-200" id="mass-engine">800 kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Combustível:</span>
                  <span class="text-slate-200" id="mass-fuel">450 kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Armamento:</span>
                  <span class="text-slate-200" id="mass-weapons">150 kg</span>
                </div>
                <div class="border-t border-slate-600 pt-2 mt-2">
                  <div class="flex justify-between font-semibold">
                    <span class="text-slate-300">Total:</span>
                    <span class="text-slate-100" id="mass-total">3200 kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .material-option.selected {
          border-color: rgb(6 182 212);
          background: rgb(6 182 212 / 0.1);
        }
        .material-option.selected h4 {
          color: rgb(103 232 249);
        }
      </style>
    `}initializeSimpleStructureControls(){let e="aluminum";const t=document.querySelectorAll(".material-option"),a=document.getElementById("selected-material-info"),i=document.getElementById("selected-material-name"),s=document.getElementById("material-effects");t.forEach(o=>{o.addEventListener("click",()=>{t.forEach(r=>r.classList.remove("selected")),o.classList.add("selected"),e=o.dataset.material,this.updateMaterialInfo(e,i,s,a),window.currentAircraft.structure||(window.currentAircraft.structure={}),window.currentAircraft.structure.material=e,this.updateStructureCalculations(e)})});const n=document.querySelector('[data-material="aluminum"]');n?n.click():setTimeout(()=>{const o=document.querySelector('[data-material="aluminum"]');o&&o.click()},100)}updateMaterialInfo(e,t,a,i){const n={aluminum:{name:"Alumínio",effects:["Custo base padrão (100%)","Peso estrutural normal","Manutenção padrão","Resistência à corrosão boa"]},steel:{name:"Aço",effects:["Custo reduzido (-20%)","Peso estrutural aumentado (+30%)","Durabilidade aumentada (+50%)","Manutenção reduzida (-10%)"]},composite:{name:"Compósito",effects:["Custo elevado (+80%)","Peso estrutural reduzido (-25%)","Assinatura radar reduzida (-30%)","Requer tech level 70+"]}}[e];t.textContent=n.name,a.innerHTML=n.effects.map(o=>`<div class="flex items-center gap-2"><span class="text-cyan-400">•</span>${o}</div>`).join(""),i.classList.remove("hidden")}updateStructureCalculations(e){const a={aluminum:{weightModifier:1,costModifier:1,cgOffset:0},steel:{weightModifier:1.3,costModifier:.8,cgOffset:-.02},composite:{weightModifier:.75,costModifier:1.8,cgOffset:.01}}[e],i=window.currentAircraft?.airframe?.base_weight||window.currentAircraft?.selectedAirframe?.base_weight||1800,s=window.currentAircraft?.engine?.weight||window.currentAircraft?.selectedEngine?.weight||800,n=window.currentAircraft?.fuel_capacity||window.currentAircraft?.selectedAirframe?.internal_fuel_kg||450,o=window.currentAircraft?.weapons?.total_weight||150;console.log("🔄 Structure calculations:",{material:e,baseAirframeWeight:i,baseEngineWeight:s,baseFuelWeight:n,baseWeaponsWeight:o,modifiers:a});const r=Math.round(i*a.weightModifier),l=r+s+n+o,u=Math.max(25,Math.min(65,45+a.cgOffset*100));this.updateDisplayValues({airframeWeight:r,engineWeight:s,fuelWeight:n,weaponsWeight:o,totalWeight:l,cgPosition:u}),window.currentAircraft.calculatedValues||(window.currentAircraft.calculatedValues={}),window.currentAircraft.calculatedValues.totalWeight=l,window.currentAircraft.calculatedValues.cgPosition=u,window.currentAircraft.calculatedValues.airframeWeight=r}updateDisplayValues(e){const t=document.getElementById("mass-airframe"),a=document.getElementById("mass-engine"),i=document.getElementById("mass-fuel"),s=document.getElementById("mass-weapons"),n=document.getElementById("mass-total");t&&(t.textContent=`${e.airframeWeight} kg`),a&&(a.textContent=`${e.engineWeight} kg`),i&&(i.textContent=`${e.fuelWeight} kg`),s&&(s.textContent=`${e.weaponsWeight} kg`),n&&(n.textContent=`${e.totalWeight} kg`);const o=document.getElementById("cg-position"),r=document.getElementById("cg-total-mass"),l=document.getElementById("cg-indicator");if(o&&(o.textContent=`${e.cgPosition.toFixed(1)}% MAC`),r&&(r.textContent=`${e.totalWeight} kg`),l){const d=Math.max(0,Math.min(96,e.cgPosition/100*96));l.style.left=`${d}%`,e.cgPosition<30||e.cgPosition>60?l.style.background="#ef4444":e.cgPosition<35||e.cgPosition>55?l.style.background="#f59e0b":l.style.background="#10b981"}typeof window.updateWeightDisplay=="function"&&window.updateWeightDisplay(e.totalWeight)}loadCellTab(){console.log("🔄 Loading Cell Tab (Airframes)...");const e=this.createSimplifiedAirframeInterface();this.getTabContent().innerHTML=e,this.initializeSimpleAirframeControls(),this.restoreAirframeSelection()}createSimplifiedAirframeInterface(){const e=window.currentAircraft?.category||"fighter";return`
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">✈️</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Células/Fuselagens</h2>
            <p class="text-sm text-slate-400">Fuselagens disponíveis para categoria: <strong class="text-blue-400">${this.getCategoryDisplayName(e)}</strong></p>
          </div>
        </div>

        ${window.currentAircraft?.category?"":`
        <div class="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2">
            <span class="text-yellow-400">⚠️</span>
            <span class="text-yellow-100 font-medium">Categoria não selecionada</span>
          </div>
          <p class="text-yellow-200 text-sm mt-1">
            Volte para a aba <strong>Categoria</strong> para escolher o tipo de aeronave primeiro.
          </p>
        </div>
        `}

        <!-- Airframe Options -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${this.generateAirframeOptions(e)}
        </div>

        <!-- Selected Airframe Info -->
        <div id="selected-airframe-info" class="hidden bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h3 class="text-lg font-semibold text-slate-200 mb-4">Fuselagem Selecionada: <span id="selected-airframe-name">-</span></h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-slate-300 mb-3">Especificações</h4>
              <div id="airframe-specs" class="space-y-2 text-sm text-slate-300">
                <!-- Specs will be populated -->
              </div>
            </div>

            <div>
              <h4 class="font-semibold text-slate-300 mb-3">Características</h4>
              <div id="airframe-characteristics" class="space-y-2 text-sm text-slate-300">
                <!-- Characteristics will be populated -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        .airframe-option.selected {
          border-color: rgb(6 182 212);
          background: rgb(6 182 212 / 0.1);
        }
        .airframe-option.selected h4 {
          color: rgb(103 232 249);
        }
      </style>
    `}initializeSimpleAirframeControls(){let e=null;const t=document.querySelectorAll(".airframe-option"),a=document.getElementById("selected-airframe-info"),i=document.getElementById("selected-airframe-name"),s=document.getElementById("airframe-specs"),n=document.getElementById("airframe-characteristics");t.forEach(o=>{o.addEventListener("click",()=>{t.forEach(r=>r.classList.remove("selected")),o.classList.add("selected"),e=o.dataset.airframe,this.updateAirframeInfo(e,i,s,n,a),window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.selectedAirframe=this.getAirframeData(e),window.currentAircraft.airframeType=e,window.currentAircraft.airframe=e,typeof this.updateStructureCalculations=="function"&&this.updateStructureCalculations(window.currentAircraft.structure?.material||"aluminum"),console.log(`✅ Airframe selected: ${e}`)})})}restoreAirframeSelection(){const e=window.currentAircraft?.airframe||window.currentAircraft?.airframeType;if(e){console.log(`🔄 Restoring airframe selection: ${e}`);const t=document.querySelector(`[data-airframe="${e}"]`);if(t){document.querySelectorAll(".airframe-option").forEach(o=>o.classList.remove("selected")),t.classList.add("selected");const a=document.getElementById("selected-airframe-info"),i=document.getElementById("selected-airframe-name"),s=document.getElementById("airframe-specs"),n=document.getElementById("airframe-characteristics");this.updateAirframeInfo(e,i,s,n,a),console.log(`✅ Airframe selection restored: ${e}`)}else console.warn(`⚠️ Could not find airframe option for: ${e}`)}else console.log("ℹ️ No previous airframe selection to restore")}getAirframeData(e){const t={light_fighter:{name:"Caça Leve",base_weight:1800,max_takeoff_weight:3200,g_limit:9,hardpoints:2,internal_fuel_kg:450,advantages:["Excelente manobrabilidade","Baixo custo","Leve"],disadvantages:["Armamento limitado","Alcance curto"]},early_jet_fighter:{name:"Caça a Jato Inicial",base_weight:2200,max_takeoff_weight:4e3,g_limit:8,hardpoints:4,internal_fuel_kg:600,advantages:["Boa velocidade","Moderadamente ágil"],disadvantages:["Consumo alto","Tecnologia inicial"]},multirole_fighter:{name:"Caça Multifunção",base_weight:2800,max_takeoff_weight:5500,g_limit:7.5,hardpoints:6,internal_fuel_kg:800,advantages:["Versátil","Bom alcance","Múltiplas missões"],disadvantages:["Peso médio","Custo elevado"]},heavy_fighter:{name:"Caça Pesado",base_weight:3500,max_takeoff_weight:7e3,g_limit:6,hardpoints:8,internal_fuel_kg:1200,advantages:["Alta capacidade","Muito resistente","Longo alcance"],disadvantages:["Pouco ágil","Caro","Pesado"]},light_bomber:{name:"Bombardeiro Leve",base_weight:4200,max_takeoff_weight:8500,g_limit:5,hardpoints:12,internal_fuel_kg:1800,advantages:["Grande capacidade de bombas","Excelente alcance"],disadvantages:["Muito lento","Vulnerável","Pouco ágil"]},transport:{name:"Transporte",base_weight:5800,max_takeoff_weight:12e3,g_limit:4,hardpoints:2,internal_fuel_kg:2500,advantages:["Enorme capacidade","Excelente alcance","Múltiplas configurações"],disadvantages:["Muito lento","Vulnerável","Caro"]}};return t[e]||t.light_fighter}updateAirframeInfo(e,t,a,i,s){const n=this.getAirframeData(e);t.textContent=n.name,a.innerHTML=`
      <div class="flex justify-between"><span>Peso Base:</span><span>${n.base_weight} kg</span></div>
      <div class="flex justify-between"><span>Peso Máx Decolagem:</span><span>${n.max_takeoff_weight} kg</span></div>
      <div class="flex justify-between"><span>Limite G:</span><span>${n.g_limit}G</span></div>
      <div class="flex justify-between"><span>Hardpoints:</span><span>${n.hardpoints}</span></div>
      <div class="flex justify-between"><span>Combustível Interno:</span><span>${n.internal_fuel_kg} kg</span></div>
    `,i.innerHTML=`
      <div>
        <h5 class="text-green-400 font-medium mb-1">Vantagens:</h5>
        ${n.advantages.map(o=>`<div class="flex items-center gap-2"><span class="text-green-400">•</span>${o}</div>`).join("")}
      </div>
      <div class="mt-3">
        <h5 class="text-red-400 font-medium mb-1">Desvantagens:</h5>
        ${n.disadvantages.map(o=>`<div class="flex items-center gap-2"><span class="text-red-400">•</span>${o}</div>`).join("")}
      </div>
    `,s.classList.remove("hidden")}async loadAirframeTab(){if(console.log("🔄 Loading Airframe Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.airframes){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load..."),this.showLoadingState("Carregando componentes de aeronaves...");try{await this.ensureComponentsLoaded(["airframes"]),console.log("✅ Components loaded, retrying..."),this.loadAirframeTab()}catch(n){console.error("❌ Failed to load components:",n),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}return}this.updateTechLevel();const e=window.AIRCRAFT_COMPONENTS?.airframes||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhuma fuselagem disponível.");console.log(`📊 Found ${t.length} airframes in data`);const a=this.filterAvailableComponents(e);console.log(`🔬 Airframes: ${Object.keys(a).length} available out of ${t.length} total`);const i=this.organizeTechFamilies(e),s=this.renderTechTreeInterface(i,e);this.getTabContent().innerHTML=s,this.setupTechTreeTabs(i)}renderTechTreeInterface(e){return`
      <!-- Header Section -->
      <div class="mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-100 tracking-tight">Árvores Tecnológicas – Fuselagens (1954–1980)</h2>
            <p class="text-slate-400 mt-1">Layout em timeline vertical com progressão tecnológica</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-slate-400">Selecionada:</div>
            <div class="text-lg font-semibold text-cyan-300" id="selected-airframe-name">Nenhuma</div>
          </div>
        </div>
      </div>

      <!-- Technology Trees Tabs -->
      <nav class="flex flex-wrap gap-2 mb-8">
        <button class="tech-tree-tab active" data-tree="fighters">
          <span class="icon">✈️</span>
          <span class="label">Caças</span>
        </button>
        <button class="tech-tree-tab" data-tree="bombers">
          <span class="icon">🎯</span>
          <span class="label">Bombardeiros</span>
        </button>
        <button class="tech-tree-tab" data-tree="attackers">
          <span class="icon">💥</span>
          <span class="label">Aeronaves de Ataque</span>
        </button>
        <button class="tech-tree-tab" data-tree="transports">
          <span class="icon">📦</span>
          <span class="label">Transportes</span>
        </button>
        <button class="tech-tree-tab" data-tree="helicopters">
          <span class="icon">🚁</span>
          <span class="label">Helicópteros</span>
        </button>
      </nav>

      <!-- Timeline Section -->
      <section class="relative mb-8">
        <!-- Central Spine -->
        <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-cyan-400/60 via-cyan-300/30 to-cyan-400/60 rounded-full"></div>

        <!-- Timeline Content -->
        <div id="tech-timeline" class="grid grid-cols-1 gap-6">
          ${this.renderTechTimelineContent("fighters",e)}
        </div>
      </section>

      <!-- Legend -->
      <div class="mt-10 grid sm:grid-cols-3 gap-3 text-xs">
        <div class="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <div class="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <span>📖</span>
            <span>Como usar</span>
          </div>
          <p class="text-slate-400">A timeline avança de cima para baixo. Cada cartão é uma fuselagem disponível. Clique para selecionar e ver os pré-requisitos.</p>
        </div>
        <div class="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <div class="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <span>🏷️</span>
            <span>Tags de Categoria</span>
          </div>
          <div class="flex gap-2 flex-wrap mt-2">
            <span class="tag-piston">Pistão</span>
            <span class="tag-subsonic">Sub/Transônico</span>
            <span class="tag-supersonic">Supersônico</span>
            <span class="tag-special">Especializado</span>
          </div>
        </div>
        <div class="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <div class="font-semibold text-slate-100 mb-2 flex items-center gap-2">
            <span>⚡</span>
            <span>Progressão</span>
          </div>
          <p class="text-slate-400">Fuselagens destacadas são marcos importantes. Siga a linha cronológica para desbloquear tecnologias avançadas.</p>
        </div>
      </div>

      <style>
        /* Tech Tree Tabs */
        .tech-tree-tab {
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid rgb(51 65 85 / 0.5);
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgb(30 41 59 / 0.5);
          color: rgb(148 163 184);
          cursor: pointer;
        }
        .tech-tree-tab:hover {
          color: rgb(241 245 249);
          background: rgb(51 65 85 / 0.5);
        }
        .tech-tree-tab.active {
          background: rgb(6 182 212 / 0.15);
          color: rgb(165 243 252);
          border-color: rgb(6 182 212 / 0.4);
        }
        .tech-tree-tab .icon {
          font-size: 16px;
        }

        /* Timeline Node Cards */
        .timeline-node-card {
          position: relative;
          width: 100%;
          max-width: 480px;
          border-radius: 16px;
          backdrop-filter: blur(8px);
          padding: 16px 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border: 1px solid rgb(51 65 85 / 0.4);
          transition: all 0.2s;
          cursor: pointer;
          background: rgb(30 41 59 / 0.4);
        }
        .timeline-node-card:hover {
          background: rgb(51 65 85 / 0.5);
          border-color: rgb(71 85 105 / 0.5);
        }
        .timeline-node-card.selected {
          border-color: rgb(6 182 212 / 0.6);
          background: rgb(8 145 178 / 0.2);
          box-shadow: 0 0 0 1px rgb(6 182 212 / 0.3);
        }
        .timeline-node-card.highlight {
          border-color: rgb(16 185 129 / 0.4);
          box-shadow: 0 0 20px rgba(16,185,129,0.15);
        }
        .timeline-node-card.left {
          margin-left: auto;
          padding-right: 24px;
        }
        .timeline-node-card.right {
          margin-right: auto;
          padding-left: 24px;
        }

        /* Node connector dots */
        .timeline-node-card.left::before {
          content: '';
          position: absolute;
          top: 24px;
          right: 0;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(6 182 212);
          box-shadow: 0 0 0 4px rgba(6,182,212,0.15);
        }
        .timeline-node-card.right::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 0;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          background: rgb(6 182 212);
          box-shadow: 0 0 0 4px rgba(6,182,212,0.15);
        }
        .timeline-node-card.selected::before {
          background: rgb(16 185 129);
          box-shadow: 0 0 0 4px rgba(16,185,129,0.15);
        }

        /* Era Pills */
        .era-pill {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
          color: rgb(199 210 254);
          background: rgb(99 102 241 / 0.1);
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgb(99 102 241 / 0.3);
        }

        /* Technology Tags */
        .tag-piston {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(100 116 139 / 0.1);
          color: rgb(148 163 184);
          border: 1px solid rgb(100 116 139 / 0.3);
        }
        .tag-subsonic {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(59 130 246 / 0.1);
          color: rgb(147 197 253);
          border: 1px solid rgb(59 130 246 / 0.3);
        }
        .tag-supersonic {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(244 63 94 / 0.1);
          color: rgb(251 113 133);
          border: 1px solid rgb(244 63 94 / 0.3);
        }
        .tag-special {
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 2px 8px;
          font-size: 10px;
          font-weight: 600;
          background: rgb(245 158 11 / 0.1);
          color: rgb(252 211 77);
          border: 1px solid rgb(245 158 11 / 0.3);
        }

        /* Decade Tick */
        .decade-tick {
          position: relative;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: rgb(148 163 184);
        }
        .decade-tick span {
          padding: 4px 8px;
          border-radius: 6px;
          background: rgb(30 41 59 / 0.5);
          border: 1px solid rgb(51 65 85 / 0.5);
        }
        .decade-tick::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          height: 8px;
          width: 8px;
          border-radius: 50%;
          background: rgb(103 232 249);
          box-shadow: 0 0 0 6px rgba(6,182,212,0.12);
        }

        /* Meta data grid */
        .node-meta {
          margin-top: 12px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 16px;
          font-size: 12px;
          color: rgb(148 163 184);
        }
        .node-meta .meta-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgb(51 65 85 / 0.3);
          padding-bottom: 2px;
        }
        .node-meta .meta-key {
          color: rgb(100 116 139);
        }
        .node-meta .meta-value {
          font-weight: 500;
          color: rgb(226 232 240);
        }
      </style>
    `}organizeTechFamilies(e){const t={fighters:{label:"Caças",items:[]},bombers:{label:"Bombardeiros",items:[]},attackers:{label:"Aeronaves de Ataque",items:[]},transports:{label:"Transportes",items:[]},helicopters:{label:"Helicópteros",items:[]}};return Object.entries(e).forEach(([a,i])=>{if(!this.isAvailable(i))return;const s=i.tech_tree||"fighters";t[s]&&t[s].items.push({id:a,...i})}),Object.values(t).forEach(a=>{a.items.sort((i,s)=>(i.year_introduced||0)-(s.year_introduced||0))}),t}loadTechTimeline(e,t){const a=t[e];if(!a||a.items.length===0){const r=this.getTabContent().querySelector("#tech-timeline");r&&(r.innerHTML='<div class="text-center py-8 text-slate-400">Nenhuma aeronave disponível nesta categoria.</div>');return}const i=this.renderTechTimelineContent(e,t),n=this.getTabContent().querySelector("#tech-timeline");n&&(n.innerHTML=i)}renderTechTimelineContent(e,t){const a=t[e];if(!a||a.items.length===0)return'<div class="text-center py-8 text-slate-400">Nenhuma aeronave disponível nesta categoria.</div>';let i="";return a.items.forEach((s,n)=>{const o=n%2===0?"left":"right",r=this.getDecadeLabel(s.year_introduced);i+=this.renderTimelineItem(s,o,r,n)}),i}renderTimelineItem(e,t,a,i){const s=window.currentAircraft?.airframe===e.id,n=this.generateTechTags(e),o=this.generateMetaData(e),r=this.isHighlightNode(e);return`
      <div class="relative">
        <!-- Decade Tick -->
        <div class="decade-tick">
          <span>${a}</span>
        </div>
        
        <!-- Timeline Item -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6">
          ${t==="left"?`
            <div class="timeline-node-card left ${s?"selected":""} ${r?"highlight":""}" 
                 onclick="selectAirframe('${e.id}')" data-airframe-id="${e.id}">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base sm:text-lg font-semibold text-slate-100 leading-tight">${e.name}</h3>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    ${n.join("")}
                  </div>
                </div>
                <span class="era-pill">${e.tech_era||"Unknown"}</span>
              </div>
              ${o.length>0?`
                <div class="node-meta">
                  ${o.map(l=>`
                    <div class="meta-item">
                      <div class="meta-key">${l.k}</div>
                      <div class="meta-value">${l.v}</div>
                    </div>
                  `).join("")}
                </div>
              `:""}
              ${e.prerequisites&&e.prerequisites.length>0?`
                <div class="prerequisites-indicator ${this.hasPrerequisites(e)?"locked":""}"></div>
              `:""}
            </div>
            <div></div>
          `:`
            <div></div>
            <div class="timeline-node-card right ${s?"selected":""} ${r?"highlight":""}" 
                 onclick="selectAirframe('${e.id}')" data-airframe-id="${e.id}">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base sm:text-lg font-semibold text-slate-100 leading-tight">${e.name}</h3>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    ${n.join("")}
                  </div>
                </div>
                <span class="era-pill">${e.tech_era||"Unknown"}</span>
              </div>
              ${o.length>0?`
                <div class="node-meta">
                  ${o.map(l=>`
                    <div class="meta-item">
                      <div class="meta-key">${l.k}</div>
                      <div class="meta-value">${l.v}</div>
                    </div>
                  `).join("")}
                </div>
              `:""}
              ${e.prerequisites&&e.prerequisites.length>0?`
                <div class="prerequisites-indicator ${this.hasPrerequisites(e)?"locked":""}"></div>
              `:""}
            </div>
          `}
        </div>
      </div>
    `}generateTechTags(e){const t=[];return e.tech_era==="piston"?t.push('<span class="tag-piston">Pistão</span>'):e.max_speed_kph>=1200?t.push('<span class="tag-supersonic">Supersônico</span>'):(e.tech_era?.includes("jet")||e.max_speed_kph>=800)&&t.push('<span class="tag-subsonic">Sub/Transônico</span>'),(e.category==="helicopter"||e.role==="reconnaissance")&&t.push('<span class="tag-special">Especializado</span>'),t}generateMetaData(e){return[{k:"Vel Máx",v:`${Math.round(e.max_speed_kph||0)} km/h`},{k:"G-Limit",v:`${e.g_limit||0}`},{k:"Peso",v:`${Math.round((e.base_weight||0)/1e3)} t`},{k:"Ano",v:`${e.year_introduced||"?"}`}]}getDecadeLabel(e){return e>=1945&&e<=1950?"1945–50":e>=1950&&e<=1954?"1950–54":e>=1954&&e<=1958?"1954–58":e>=1958&&e<=1962?"1958–62":`${e}`}isHighlightNode(e){return e.tech_level>=65||e.max_speed_kph>=1400}hasPrerequisites(e){return!1}setupTechTreeTabs(e){const t=document.querySelectorAll(".tech-tree-tab");t.forEach(a=>{a.addEventListener("click",i=>{t.forEach(n=>n.classList.remove("active")),a.classList.add("active");const s=a.dataset.tree;this.loadTechTimeline(s,e)})})}renderAirframeCard(e,t){const a=window.currentAircraft?.airframe===e,i=t.max_speed_kph||0,s=t.base_weight||0,n=t.max_takeoff_weight||0,o=this.getComponentAvailabilityInfo(t);this.getComponentStatusClass(t);const r=a?"selected border-brand-400 ring-1 ring-brand-400/50":"border-slate-700/50 bg-slate-800/40",l=o.isAvailable?"":"opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10",d=o.isAvailable?`onclick="selectAirframe('${e}')"`:`onclick="showTechRequirement('${t.name}', ${o.requiredTech}, ${o.currentTech})"`;return`
      <button class="airframe-card component-card relative w-full text-left rounded-2xl p-4 border transition ${r} ${l}" ${d}>
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-base font-semibold text-slate-100">${t.name}</h4>
          <span class="px-2 py-0.5 text-xs rounded-lg text-white ${i>=1200?"bg-red-600":"bg-blue-600"}">${i>=1200?"Supersônico":"Sub- ou Transônico"}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>Base: <b>${Math.round(s)} kg</b></div>
          <div>MTOW: <b>${Math.round(n)} kg</b></div>
          <div>Vel Máx: <b>${Math.round(i)} km/h</b></div>
          <div>G-Limit: <b>${t.g_limit??6}</b></div>
        </div>
        
        <!-- Tech Level Indicator -->
        <div class="mt-2 flex items-center justify-between">
          <div class="text-xs">
            <span class="text-slate-400">Tech Level:</span>
            <span class="${o.isAvailable?"text-green-400":"text-red-400"} font-semibold">
              ${o.requiredTech}
            </span>
          </div>
          ${o.isAvailable?"":`<div class="flex items-center gap-1">
              <span class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <span class="text-red-400 text-xs">🔒</span>
              </span>
              <span class="text-xs text-red-400">Requer ${o.missingTech} tech</span>
            </div>`}
        </div>
        
        ${a?'<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full animate-pulse"></div>':""}
      </button>`}async loadWingsTab(){console.log("🔄 Loading Wings Tab...");try{const e=await this.loadOptimizedTemplate("templates/aircraft-creator/wings-tab.html");C.injectWithTransition(this.getTabContent(),e),setTimeout(()=>{this.initializeWingsInterface()},100)}catch(e){console.error("❌ Failed to load wings tab template:",e),this.showEmptyState("Erro ao carregar a aba de Asas.")}}initializeWingsInterface(){console.log("🦅 Initializing intuitive wings interface..."),this.selectedWingType="straight",this.selectedWingSize="medium",this.selectedFlaps="basic",this.selectedControls="standard",document.querySelectorAll(".wing-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.wingType;this.selectWingType(t)})}),document.querySelectorAll(".size-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.size;this.selectWingSize(t)})}),document.querySelectorAll(".flap-option").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.flap;this.selectFlaps(t)})}),document.querySelectorAll(".control-option").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.control;this.selectControls(t)})}),this.selectWingType(this.selectedWingType),this.selectWingSize(this.selectedWingSize),this.selectFlaps(this.selectedFlaps),this.selectControls(this.selectedControls),console.log("✅ Wings interface initialized successfully")}selectWingType(e){this.selectedWingType=e,document.querySelectorAll(".wing-card").forEach(t=>{const a=t.dataset.wingType===e;t.classList.toggle("border-cyan-400",a),t.classList.toggle("bg-cyan-900/20",a),t.classList.toggle("ring-1",a),t.classList.toggle("ring-cyan-400/50",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.type=e,this.updateWingPerformance(),this.updateWingRecommendations(),console.log(`🦅 Wing type selected: ${e}`)}selectWingSize(e){this.selectedWingSize=e,document.querySelectorAll(".size-card").forEach(t=>{const a=t.dataset.size===e;t.classList.toggle("border-cyan-400",a),t.classList.toggle("bg-cyan-900/20",a),t.classList.toggle("ring-1",a),t.classList.toggle("ring-cyan-400/50",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.size=e,this.updateWingPerformance(),console.log(`📏 Wing size selected: ${e}`)}selectFlaps(e){this.selectedFlaps=e,document.querySelectorAll(".flap-option").forEach(t=>{const a=t.dataset.flap===e;t.classList.toggle("border-cyan-500",a),t.classList.toggle("bg-cyan-900/20",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.flaps=e,this.updateWingPerformance(),console.log(`⬆️ Flaps selected: ${e}`)}selectControls(e){this.selectedControls=e,document.querySelectorAll(".control-option").forEach(t=>{const a=t.dataset.control===e;t.classList.toggle("border-cyan-500",a),t.classList.toggle("bg-cyan-900/20",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.controls=e,this.updateWingPerformance(),console.log(`🎮 Controls selected: ${e}`)}updateWingPerformance(){const e=this.calculateWingPerformance(),t=document.getElementById("lift-rating"),a=document.getElementById("maneuver-rating"),i=document.getElementById("speed-rating"),s=document.getElementById("stability-rating");t&&(t.textContent=e.lift),a&&(a.textContent=e.maneuverability),i&&(i.textContent=e.speed),s&&(s.textContent=e.stability),typeof window.updateAircraftCalculations=="function"&&window.updateAircraftCalculations()}calculateWingPerformance(){const e={straight:{lift:7,maneuverability:6,speed:5,stability:9},swept:{lift:6,maneuverability:7,speed:9,stability:7},delta:{lift:5,maneuverability:4,speed:10,stability:8},variable:{lift:8,maneuverability:9,speed:9,stability:6},"forward-swept":{lift:8,maneuverability:10,speed:7,stability:4},canard:{lift:7,maneuverability:9,speed:8,stability:7}},t={small:{lift:-1,maneuverability:2,speed:1,stability:-1},medium:{lift:0,maneuverability:0,speed:0,stability:0},large:{lift:2,maneuverability:-2,speed:-1,stability:1}},a={basic:{lift:0,maneuverability:0,speed:0,stability:0},advanced:{lift:1,maneuverability:0,speed:-1,stability:0},modern:{lift:2,maneuverability:1,speed:-1,stability:1}},i={standard:{lift:0,maneuverability:0,speed:0,stability:0},enhanced:{lift:0,maneuverability:2,speed:0,stability:-1},"fly-by-wire":{lift:1,maneuverability:3,speed:0,stability:2}},s=e[this.selectedWingType]||e.straight,n=t[this.selectedWingSize]||t.medium,o=a[this.selectedFlaps]||a.basic,r=i[this.selectedControls]||i.standard;return{lift:Math.max(1,Math.min(10,s.lift+n.lift+o.lift+r.lift)),maneuverability:Math.max(1,Math.min(10,s.maneuverability+n.maneuverability+o.maneuverability+r.maneuverability)),speed:Math.max(1,Math.min(10,s.speed+n.speed+o.speed+r.speed)),stability:Math.max(1,Math.min(10,s.stability+n.stability+o.stability+r.stability))}}updateWingRecommendations(){const e={fighter:["swept","delta","canard"],bomber:["straight","swept"],transport:["straight"],helicopter:["straight"],attacker:["straight","swept"]},t=window.currentAircraft?.category||"fighter",a=e[t]||[];a.includes(this.selectedWingType)?document.getElementById("wing-recommendations")?.classList.add("hidden"):this.showWingRecommendations(a)}showWingRecommendations(e){const t=document.getElementById("wing-recommendations"),a=document.getElementById("recommendations-content");!t||!a||(a.innerHTML=e.map(i=>`
        <div class="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <div class="text-yellow-400 font-medium">💡 Recomendação</div>
          <div class="text-sm text-slate-300 mt-1">
            ${{straight:"Asa Reta",swept:"Asa Enflechada",delta:"Asa Delta",variable:"Geometria Variável","forward-swept":"Enflechamento Inverso",canard:"Configuração Canard"}[i]} seria mais adequada para este tipo de aeronave.
          </div>
        </div>
      `).join(""),t.classList.remove("hidden"))}loadPropulsionTab(){console.log("🔄 Loading Propulsion Tab (Engines)..."),this.loadEngineTab()}async loadEngineTab(){if(console.log("🔄 Loading Engine Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.aircraft_engines){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...");try{this.showLoadingState("Carregando motores de aeronaves..."),await this.ensureComponentsLoaded(["aircraft_engines"]),console.log("✅ Components loaded, retrying..."),this.loadEngineTab()}catch(i){console.error("❌ Failed to load components:",i),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}return}this.updateTechLevel();const e=window.AIRCRAFT_COMPONENTS?.aircraft_engines||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhum motor disponível.");if(!window.currentAircraft?.airframe)return this.showEmptyState("Selecione uma fuselagem primeiro.");console.log(`📊 Found ${t.length} engines in data`);const a=this.createModernPropulsionInterface(e);this.getTabContent().innerHTML=a,setTimeout(()=>{this.initializePropulsionInterface(e)},100)}createModernPropulsionInterface(e){return window.currentAircraft?.category,`
      <!-- Modern Propulsion Interface -->
      <div id="aircraft-propulsion" class="space-y-6">

        <!-- Section Header -->
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span class="text-xl">🚀</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Sistema de Propulsão</h2>
            <p class="text-sm text-slate-400">Escolha o motor ideal para sua aeronave</p>
          </div>
        </div>

        <!-- Performance Calculator -->
        <div class="mb-8 p-6 bg-slate-800/30 rounded-lg border border-slate-600/30">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Calculadora de Performance</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm text-slate-400 mb-2">Velocidade Desejada (km/h)</label>
              <input type="number" id="target-speed" min="100" max="3000" step="10" value="400"
                     class="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500">
            </div>
            <div>
              <label class="block text-sm text-slate-400 mb-2">Altitude (m)</label>
              <input type="number" id="target-altitude" min="0" max="20000" step="100" value="0"
                     class="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-cyan-500">
            </div>
            <div class="flex items-end">
              <button id="calculate-power-btn" class="w-full px-4 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors">
                Calcular
              </button>
            </div>
          </div>

          <div id="power-calculation-result" class="p-4 bg-slate-700/50 rounded-lg text-center">
            <span class="text-slate-400">Configure velocidade e altitude, depois clique em calcular</span>
          </div>
        </div>

        <!-- Engine Type Categories -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            <span>Tipos de Motor</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <!-- Piston Engines -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-orange-500/50 transition-all duration-200" data-filter="piston">
              <div class="text-center">
                <div class="text-3xl mb-2">🛩️</div>
                <h4 class="font-semibold text-slate-200">Motor a Pistão</h4>
                <p class="text-xs text-slate-400 mt-2">Confiável (1945-1955)</p>
                <div class="mt-2 text-xs text-slate-500">Potência: 500-3000 HP</div>
              </div>
            </div>

            <!-- Early Jets -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-blue-500/50 transition-all duration-200" data-filter="early_jet">
              <div class="text-center">
                <div class="text-3xl mb-2">💨</div>
                <h4 class="font-semibold text-slate-200">Primeiro Jato</h4>
                <p class="text-xs text-slate-400 mt-2">Turbojet (1950-1965)</p>
                <div class="mt-2 text-xs text-slate-500">Empuxo: 1000-8000 kgf</div>
              </div>
            </div>

            <!-- Modern Jets -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition-all duration-200" data-filter="modern_jet">
              <div class="text-center">
                <div class="text-3xl mb-2">🚀</div>
                <h4 class="font-semibold text-slate-200">Jato Moderno</h4>
                <p class="text-xs text-slate-400 mt-2">Turbofan (1960-1990)</p>
                <div class="mt-2 text-xs text-slate-500">Empuxo: 3000-20000 kgf</div>
              </div>
            </div>

            <!-- Turboprop -->
            <div class="engine-type-filter cursor-pointer p-4 border-2 border-slate-700/50 rounded-lg hover:border-green-500/50 transition-all duration-200" data-filter="turboprop">
              <div class="text-center">
                <div class="text-3xl mb-2">🌪️</div>
                <h4 class="font-semibold text-slate-200">Turboprop</h4>
                <p class="text-xs text-slate-400 mt-2">Eficiente (1955-1990)</p>
                <div class="mt-2 text-xs text-slate-500">Potência: 1000-5000 HP</div>
              </div>
            </div>

          </div>

          <!-- Filter Controls -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="all">
              Todas as Eras
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1945-1955">
              1945-1955
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1955-1965">
              1955-1965
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1965-1975">
              1965-1975
            </button>
            <button class="era-filter px-3 py-1 rounded-lg text-xs border border-slate-600 text-slate-300 hover:border-cyan-500 transition-colors" data-era="1975-1990">
              1975-1990
            </button>
          </div>
        </div>

        <!-- Engines Grid -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>🔧</span>
            <span>Motores Disponíveis</span>
          </h3>

          <div id="engines-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Engines will be populated here -->
          </div>
        </div>

        <!-- Recommendations -->
        <div id="engine-recommendations" class="hidden">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>Recomendações</span>
          </h3>

          <div id="recommendation-cards" class="space-y-3">
            <!-- Recommendations will be populated -->
          </div>
        </div>

        <!-- Selected Engine Info -->
        <div id="selected-engine-info" class="hidden">
          <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span>Motor Selecionado</span>
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
              <h4 class="font-semibold text-slate-200 mb-3">Especificações</h4>
              <div id="engine-specs" class="space-y-2 text-sm">
                <!-- Specs will be populated -->
              </div>
            </div>

            <div class="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
              <h4 class="font-semibold text-slate-200 mb-3">Performance</h4>
              <div id="engine-performance" class="space-y-2 text-sm">
                <!-- Performance will be populated -->
              </div>
            </div>
          </div>
        </div>

      </div>
    `}initializePropulsionInterface(e){console.log("🚀 Initializing modern propulsion interface..."),this.selectedEngine=null,this.currentFilter="all",this.currentEraFilter="all",this.populateEnginesGrid(e),document.querySelectorAll(".engine-type-filter").forEach(t=>{t.addEventListener("click",()=>{this.currentFilter=t.dataset.filter,this.updateEngineTypeFilters(),this.filterEngines(e)})}),document.querySelectorAll(".era-filter").forEach(t=>{t.addEventListener("click",()=>{this.currentEraFilter=t.dataset.era,this.updateEraFilters(),this.filterEngines(e)})}),document.getElementById("calculate-power-btn").addEventListener("click",()=>{this.calculateRequiredPower()}),this.currentFilter="all",this.currentEraFilter="all",this.updateEngineRecommendations(e)}populateEnginesGrid(e){const t=window.currentAircraft?.category||"fighter",a=window.AIRCRAFT_COMPONENTS?.airframes?.[window.currentAircraft?.airframe],i=new Set(a?.compatible_engine_types||[]),s=document.getElementById("engines-grid");if(!s){console.error("❌ Engines grid element not found");return}let n="",o=0;Object.entries(e).forEach(([r,l])=>{let d=!0;if(i.size>0&&a&&a.strict_engine_compatibility&&(d=i.has(l.type)),d)try{n+=this.createModernEngineCard(r,l,t),o++}catch(u){console.error(`❌ Error creating card for engine ${r}:`,u)}}),o===0&&(n=`
        <div class="col-span-full text-center py-8">
          <div class="text-slate-400 mb-4">🔍 Nenhum motor encontrado</div>
          <div class="text-sm text-slate-500">
            Verifique se uma fuselagem foi selecionada ou tente outros filtros.
          </div>
        </div>
      `),s.innerHTML=n,document.querySelectorAll(".modern-engine-card").forEach(r=>{r.addEventListener("click",()=>{const l=r.dataset.engineId;this.selectEngine(l,e[l])})})}createModernEngineCard(e,t,a){const i=this.getComponentAvailabilityInfo(t),s=window.currentAircraft?.engine===e,n=t.type&&(t.type.includes("piston")||t.power_hp),o=t.afterburner_thrust>0,r=t.year_introduced||t.tech_level*25+1945;let l="unknown";r<=1955?l="1945-1955":r<=1965?l="1955-1965":r<=1975?l="1965-1975":l="1975-1990";let d="unknown";n?d="piston":t.type?.includes("turbojet")||r<=1965?d="early_jet":t.type?.includes("turboprop")?d="turboprop":d="modern_jet";let u;n?u=`${Math.round(t.power_hp||0)} HP`:u=`${Math.round(t.military_thrust||t.thrust||0)} kgf`;const p={piston:"🛩️",early_jet:"💨",modern_jet:"🚀",turboprop:"🌪️",unknown:"⚙️"},m=i.isAvailable,b=Math.round((t.reliability||0)*100);return`
      <div class="modern-engine-card cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${s?"border-cyan-400 bg-cyan-900/20 ring-1 ring-cyan-400/50":"border-slate-700/50 bg-slate-800/40 hover:border-slate-600"} ${m?"":"opacity-50"}"
           data-engine-id="${e}"
           data-type="${d}"
           data-era="${l}"
           ${m?"":'data-unavailable="true"'}>

        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${p[d]}</span>
            <h4 class="font-semibold text-slate-200 text-sm">${t.name}</h4>
          </div>
          ${o?'<span class="px-2 py-0.5 text-xs bg-red-600 text-white rounded-lg">AB</span>':""}
        </div>

        <div class="space-y-2 text-xs">
          <div class="grid grid-cols-2 gap-2">
            <div class="text-slate-300">
              <span class="text-slate-400">${n?"Potência:":"Empuxo:"}</span>
              <span class="font-semibold text-cyan-400">${u}</span>
            </div>
            <div class="text-slate-300">
              <span class="text-slate-400">Peso:</span>
              <span class="font-semibold">${Math.round(t.weight||0)} kg</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="text-slate-300">
              <span class="text-slate-400">Confiabilidade:</span>
              <span class="font-semibold ${b>=85?"text-green-400":b>=75?"text-yellow-400":"text-red-400"}">${b}%</span>
            </div>
            <div class="text-slate-300">
              <span class="text-slate-400">Consumo:</span>
              <span class="font-semibold">${(t.fuel_consumption||0).toFixed(1)} kg/s</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-600">
            <div class="text-slate-400">
              <span>Tech: ${i.requiredTech}</span>
              ${t.year_introduced?`<span class="text-slate-500"> • ${t.year_introduced}</span>`:""}
            </div>
            ${m?"":'<span class="text-red-400 text-xs">🔒 Indisponível</span>'}
          </div>
        </div>

        ${s?'<div class="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>':""}
      </div>
    `}updateEngineTypeFilters(){document.querySelectorAll(".engine-type-filter").forEach(e=>{e.dataset.filter===this.currentFilter?(e.classList.add("border-cyan-400","bg-cyan-900/20"),e.classList.remove("border-slate-700/50")):(e.classList.remove("border-cyan-400","bg-cyan-900/20"),e.classList.add("border-slate-700/50"))})}updateEraFilters(){document.querySelectorAll(".era-filter").forEach(e=>{e.dataset.era===this.currentEraFilter?(e.classList.add("border-cyan-500","bg-cyan-600","text-white"),e.classList.remove("border-slate-600","text-slate-300")):(e.classList.remove("border-cyan-500","bg-cyan-600","text-white"),e.classList.add("border-slate-600","text-slate-300"))})}filterEngines(e){document.querySelectorAll(".modern-engine-card").forEach(t=>{const a=t.dataset.type,i=t.dataset.era;let s=!0;this.currentFilter!=="all"&&a!==this.currentFilter&&(s=!1),this.currentEraFilter!=="all"&&i!==this.currentEraFilter&&(s=!1),t.style.display=s?"block":"none"})}calculateRequiredPower(){const e=document.getElementById("target-speed").value,t=document.getElementById("target-altitude").value,a=document.getElementById("power-calculation-result");if(!e||e<100){a.innerHTML='<span class="text-red-400">Por favor, insira uma velocidade válida (mín. 100 km/h)</span>';return}const i=e/3.6,s=window.currentAircraft?.selectedAirframe?.base_weight||3e3,o=1.225*Math.exp(-t/8400),r=window.currentAircraft?.category||"fighter";let l,d;switch(r){case"fighter":l=s/400,d=.025;break;case"bomber":l=s/250,d=.035;break;case"transport":l=s/200,d=.03;break;default:l=s/350,d=.03}const u=.5*o*Math.pow(i,2)*l*d;let p=1;i>250&&(p=1+Math.pow((i-250)/100,1.5));const m=u*p*(1+t/15e3),b=m*i/745.7;a.innerHTML=`
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div>
          <div class="text-slate-400">Empuxo Necessário:</div>
          <div class="text-xl font-bold text-cyan-400">${Math.round(m)} kgf</div>
        </div>
        <div>
          <div class="text-slate-400">Potência Equivalente:</div>
          <div class="text-xl font-bold text-cyan-400">${Math.round(b)} HP</div>
        </div>
        <div>
          <div class="text-slate-400">Densidade do Ar:</div>
          <div class="text-lg font-semibold text-yellow-400">${o.toFixed(3)} kg/m³</div>
        </div>
      </div>
      <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <div class="text-slate-500">Parâmetros estimados:</div>
          <div class="text-slate-400">• Área alar: ${l.toFixed(1)} m²</div>
          <div class="text-slate-400">• Coef. arrasto: ${d}</div>
          <div class="text-slate-400">• Fator compressibilidade: ${p.toFixed(2)}</div>
        </div>
        <div>
          <div class="text-slate-500">Baseado em:</div>
          <div class="text-slate-400">• Categoria: ${r}</div>
          <div class="text-slate-400">• Peso: ${s} kg</div>
          <div class="text-slate-400">• Velocidade: ${i.toFixed(1)} m/s</div>
        </div>
      </div>
    `,this.highlightSuitableEngines(m,b)}highlightSuitableEngines(e,t){document.querySelectorAll(".modern-engine-card").forEach(a=>{const i=a.dataset.engineId,s=window.AIRCRAFT_COMPONENTS?.aircraft_engines?.[i];if(!s)return;const n=s.type&&(s.type.includes("piston")||s.power_hp);let o=!1;if(n?o=(s.power_hp||0)>=t:o=(s.military_thrust||s.thrust||0)>=e,o){if(a.classList.add("ring-2","ring-green-400/50"),!a.querySelector(".suitable-badge")){const r=document.createElement("div");r.className="suitable-badge absolute top-1 left-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-lg",r.textContent="✓ Adequado",a.style.position="relative",a.appendChild(r)}}else{a.classList.remove("ring-2","ring-green-400/50");const r=a.querySelector(".suitable-badge");r&&r.remove()}})}selectEngine(e,t){this.selectedEngine=e,document.querySelectorAll(".modern-engine-card").forEach(a=>{a.dataset.engineId===e?(a.classList.add("border-cyan-400","bg-cyan-900/20","ring-1","ring-cyan-400/50"),a.classList.remove("border-slate-700/50")):(a.classList.remove("border-cyan-400","bg-cyan-900/20","ring-1","ring-cyan-400/50"),a.classList.add("border-slate-700/50"))}),window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.engine=e,this.showSelectedEngineInfo(t),typeof window.updateAircraftCalculations=="function"&&window.updateAircraftCalculations(),console.log(`⚡ Engine selected: ${t.name}`)}showSelectedEngineInfo(e){const t=document.getElementById("selected-engine-info"),a=document.getElementById("engine-specs"),i=document.getElementById("engine-performance");if(!t||!a||!i)return;const s=e.type&&(e.type.includes("piston")||e.power_hp),n=e.afterburner_thrust>0;a.innerHTML=`
      <div class="flex justify-between">
        <span class="text-slate-400">Nome:</span>
        <span class="text-slate-200">${e.name}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Tipo:</span>
        <span class="text-slate-200">${e.type||"Desconhecido"}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">${s?"Potência:":"Empuxo Militar:"}</span>
        <span class="text-cyan-400 font-semibold">${s?Math.round(e.power_hp||0)+" HP":Math.round(e.military_thrust||e.thrust||0)+" kgf"}</span>
      </div>
      ${n?`
        <div class="flex justify-between">
          <span class="text-slate-400">Empuxo c/ Pós-queimador:</span>
          <span class="text-red-400 font-semibold">${Math.round(e.afterburner_thrust)} kgf</span>
        </div>
      `:""}
      <div class="flex justify-between">
        <span class="text-slate-400">Peso:</span>
        <span class="text-slate-200">${Math.round(e.weight||0)} kg</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Tech Level:</span>
        <span class="text-slate-200">${e.tech_level||0}</span>
      </div>
    `;const o=Math.round((e.reliability||0)*100),r=s?((e.power_hp||0)*.75/(e.weight||1)).toFixed(1):((e.military_thrust||e.thrust||0)/(e.weight||1)).toFixed(1);i.innerHTML=`
      <div class="flex justify-between">
        <span class="text-slate-400">Confiabilidade:</span>
        <span class="${o>=85?"text-green-400":o>=75?"text-yellow-400":"text-red-400"} font-semibold">${o}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Relação Empuxo/Peso:</span>
        <span class="text-slate-200">${r}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Consumo:</span>
        <span class="text-slate-200">${(e.fuel_consumption||0).toFixed(2)} kg/s</span>
      </div>
      ${n?`
        <div class="flex justify-between">
          <span class="text-slate-400">Consumo c/ Pós-queimador:</span>
          <span class="text-red-400">${(e.afterburner_fuel_consumption||0).toFixed(1)} kg/s</span>
        </div>
      `:""}
      ${e.year_introduced?`
        <div class="flex justify-between">
          <span class="text-slate-400">Ano de Introdução:</span>
          <span class="text-slate-200">${e.year_introduced}</span>
        </div>
      `:""}
    `,t.classList.remove("hidden")}updateEngineRecommendations(e){const t=window.currentAircraft?.category||"fighter",i={fighter:["early_jet","modern_jet"],bomber:["piston","turboprop","early_jet"],transport:["piston","turboprop"],helicopter:["piston","turboprop"],attacker:["piston","early_jet"]}[t]||["early_jet"],s=document.getElementById("engine-recommendations"),n=document.getElementById("recommendation-cards");if(!s||!n)return;const o={piston:"Motores a Pistão",early_jet:"Primeiros Jatos",modern_jet:"Jatos Modernos",turboprop:"Turboprops"};n.innerHTML=i.map(r=>`
      <div class="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
        <div class="text-green-400 font-medium">💡 Recomendado</div>
        <div class="text-sm text-slate-300 mt-1">
          ${o[r]} são ideais para aeronaves do tipo ${t}.
        </div>
      </div>
    `).join(""),s.classList.remove("hidden")}renderEngineCountSelector(e){const t=e?.min_engines||1,a=e?.max_engines||1,i=window.currentAircraft?.engineCount||t;return`
      <!-- Engine Count Selector -->
      <div id="engine-count-selector" class="mb-6 p-6 bg-blue-900/20 border border-blue-700/50 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-xl">🔢</span>
            <h3 class="font-semibold text-blue-200">Quantidade de Motores</h3>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-300" id="engine-count-display">${i}</div>
            <div class="text-xs text-slate-400">motores</div>
          </div>
        </div>
        
        <div class="mb-4">
          <div class="flex items-center gap-4">
            <span class="text-sm text-slate-400 min-w-0">${t}</span>
            <div class="flex-1">
              <input 
                type="range" 
                id="engine-count-slider" 
                min="${t}" 
                max="${a}" 
                value="${i}" 
                class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span class="text-sm text-slate-400 min-w-0">${a}</span>
          </div>
          <div class="mt-2 flex justify-between text-xs text-slate-500">
            <span>Mínimo</span>
            <span id="engine-count-info" class="text-blue-300">Selecionado: ${i} motor${i>1?"es":""}</span>
            <span>Máximo</span>
          </div>
        </div>

        <!-- Performance Impact Preview -->
        <div id="engine-count-impact" class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="total-power-display">0</div>
            <div class="text-xs text-slate-400">Potência Total</div>
          </div>
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="total-weight-display">0 kg</div>
            <div class="text-xs text-slate-400">Peso Total</div>
          </div>
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="fuel-consumption-display">0</div>
            <div class="text-xs text-slate-400">Consumo Total</div>
          </div>
          <div class="text-center p-2 bg-slate-800/40 rounded-lg">
            <div class="text-blue-300 font-semibold" id="reliability-display">0%</div>
            <div class="text-xs text-slate-400">Confiabilidade</div>
          </div>
        </div>

        <!-- Engine Configuration Warning -->
        <div id="engine-config-warning" class="hidden mt-4 p-3 bg-amber-900/20 border border-amber-800/50 rounded-lg">
          <div class="flex items-start gap-2">
            <span class="text-amber-400">⚠️</span>
            <div class="text-sm text-amber-200">
              <div class="font-medium mb-1">Configuração Complexa</div>
              <div id="engine-config-warning-text"></div>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        /* Custom Slider Styles */
        .slider {
          -webkit-appearance: none;
          appearance: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e293b;
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
          transform: scale(1.1);
        }
        .slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(90deg, #1e293b 0%, #3b82f6 100%);
        }
      </style>
    `}setupEngineCountSelector(e){const t=document.getElementById("engine-count-selector"),a=document.getElementById("engine-count-slider"),i=document.getElementById("engine-count-display"),s=document.getElementById("engine-count-info");if(!t||!a||!i||!s||!e)return;const n=e.min_engines||1,o=e.max_engines||1;a.min=n,a.max=o,a.value=window.currentAircraft?.engineCount||n;const r=parseInt(a.value);i.textContent=r,s.textContent=`Selecionado: ${r} motor${r>1?"es":""}`,t.classList.remove("hidden"),a.oninput=l=>{const d=parseInt(l.target.value);i.textContent=d,s.textContent=`Selecionado: ${d} motor${d>1?"es":""}`,window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.engineCount=d,this.updateEngineCountImpact(),this.updateEngineConfigWarning(d,o)},this.updateEngineCountImpact(),this.updateEngineConfigWarning(r,o)}updateEngineCountImpact(){console.log("🔄 updateEngineCountImpact executado");const e=window.currentAircraft?.engine,t=window.currentAircraft?.engineCount||1;if(console.log("🔍 Motor selecionado:",e,"Quantidade:",t),!e){console.warn("⚠️ Nenhum motor selecionado");return}const a=window.AIRCRAFT_COMPONENTS?.aircraft_engines[e];if(!a){console.error("❌ Motor não encontrado:",e);return}console.log("✅ Motor encontrado:",a.name);const i=this.calculateAircraftPerformance(a,t);console.log("📊 Performance calculada:",i);const s=document.getElementById("total-power-display"),n=document.getElementById("total-weight-display"),o=document.getElementById("fuel-consumption-display"),r=document.getElementById("reliability-display");s&&(s.textContent=i.totalThrust,console.log("✅ Empuxo total atualizado:",i.totalThrust)),n&&(n.textContent=`${Math.round(i.totalEngineWeight)} kg`,console.log("✅ Peso dos motores atualizado:",i.totalEngineWeight)),o&&(o.textContent=i.fuelConsumption,console.log("✅ Consumo atualizado:",i.fuelConsumption)),r&&(r.textContent=`${i.reliability}%`,console.log("✅ Confiabilidade atualizada:",i.reliability)),console.log("🎯 Atualizando performance global..."),this.updateGlobalPerformance(i)}calculateAircraftPerformance(e,t){if(console.log("🔧 TabLoaders: Calculando performance..."),window.advancedPerformanceCalculator&&window.currentAircraft?.airframe)try{const x=window.AIRCRAFT_COMPONENTS?.airframes?.[window.currentAircraft.airframe];if(x){const L={airframe:x,engine:e,engineCount:t,weapons:window.currentAircraft.weapons||[],avionics:window.currentAircraft.avionics||[],fuel:window.currentAircraft.fuelLevel||1,altitude:0},y=window.advancedPerformanceCalculator.calculateCompletePerformance(L);if(y&&!y.error){console.log("✅ TabLoaders: Sistema avançado executado");const T=y.summary,P=y.power.type==="piston",R=e.afterburner_thrust>0;let M;return P?M=`${Math.round((e.power_hp||0)*t)} HP`:M=`${Math.round((e.military_thrust||e.thrust||0)*t)} kgf`,{totalThrust:M,totalThrustAB:R?`${Math.round(e.afterburner_thrust*t)} kgf`:null,totalEngineWeight:y.mass.engineWeight,fuelConsumption:`${y.operationalPerformance.fuelFlowRate.toFixed(2)} kg/h`,reliability:Math.round((e.reliability||.8)*100*Math.pow(.96,t-1)),maxSpeed:T.maxSpeed,thrustToWeight:T.thrustToWeight.toFixed(2),range:T.maxRange,hasAfterburner:R,isPistonEngine:P}}}}catch(x){console.warn("⚠️ TabLoaders: Erro no sistema avançado, usando cálculo simplificado:",x)}console.log("🔄 TabLoaders: Usando sistema de fallback");const a=window.currentAircraft?.airframe,i=window.AIRCRAFT_COMPONENTS?.airframes?.[a],s=e.type&&(e.type.includes("piston")||e.power_hp),n=e.afterburner_thrust>0;let o,r=null;if(s)o=`${Math.round((e.power_hp||0)*t)} HP`;else{const x=(e.military_thrust||e.thrust||0)*t;if(o=`${Math.round(x)} kgf`,n){const L=e.afterburner_thrust*t;r=`${Math.round(L)} kgf`}}const l=e.weight*t,d=(e.fuel_consumption||0)*t,u=n?(e.afterburner_fuel_consumption||0)*t:null;let p=d.toFixed(2);u?p+=` / ${u.toFixed(1)} kg/s`:p+=" kg/s";const m=e.reliability||.8,b=Math.round(m*100*Math.pow(.96,t-1));let h=0,v=0,w=0;if(i){const x=(i.base_weight||0)+l;v=((s?(e.power_hp||0)*t*.75:(e.military_thrust||e.thrust||0)*t)/x).toFixed(2),h=s?Math.min(i.max_speed_kph||650,400+(e.power_hp||0)*t*.15):Math.min(i.max_speed_kph||1200,600+(e.military_thrust||e.thrust||0)*t*.1);const y=i.internal_fuel_kg||1e3,T=d*.6;w=T>0?y/T*(h*.8)/1e3:0}return{totalThrust:o,totalThrustAB:r,totalEngineWeight:l,fuelConsumption:p,reliability:b,maxSpeed:Math.round(h),thrustToWeight:v,range:Math.round(w),hasAfterburner:n,isPistonEngine:s}}updateGlobalPerformance(e){console.log("🎯 Atualizando performance global:",e);const t=window.currentAircraft?.airframe,a=window.AIRCRAFT_COMPONENTS?.airframes?.[t];let i=0;a&&e.totalEngineWeight&&(i=(a.base_weight||0)+e.totalEngineWeight);const s=document.getElementById("total-weight-display");s&&i>0&&(s.textContent=`${Math.round(i)} kg`,console.log("✅ Peso atualizado:",i));const n=document.getElementById("max-speed-display");n&&e.maxSpeed&&(n.textContent=`${e.maxSpeed} km/h`,console.log("✅ Velocidade atualizada:",e.maxSpeed));const o=document.getElementById("thrust-weight-ratio-display");o&&e.thrustToWeight&&(o.textContent=`${e.thrustToWeight}:1`,console.log("✅ Empuxo/Peso atualizado:",e.thrustToWeight)),typeof window.updateAircraftCalculations=="function"&&setTimeout(()=>{window.updateAircraftCalculations()},100)}updateEngineConfigWarning(e,t){const a=document.getElementById("engine-config-warning"),i=document.getElementById("engine-config-warning-text");!a||!i||(e>=4?(a.classList.remove("hidden"),e>=6?i.textContent="Configurações com 6+ motores são extremamente complexas e caras. Requer tripulação especializada e manutenção intensiva.":i.textContent="Configurações com 4+ motores aumentam significativamente a complexidade e custos operacionais."):a.classList.add("hidden"))}renderEngineCard(e,t){const a=window.currentAircraft?.engine===e,i=t.type&&(t.type.includes("piston")||t.power_hp),s=t.afterburner_thrust>0,n=Math.round((t.reliability||0)*100),o=this.getComponentAvailabilityInfo(t);this.getComponentStatusClass(t);let r,l="";if(i)r=`Potência: <b>${Math.round(t.power_hp||0)} HP</b>`;else{const h=t.military_thrust||t.thrust||0;r=`Empuxo: <b>${Math.round(h)} kgf</b>`,s&&(l=`Pós-comb.: <b>${Math.round(t.afterburner_thrust)} kgf</b>`)}let d;if(s){const h=(t.fuel_consumption||0).toFixed(2),v=(t.afterburner_fuel_consumption||0).toFixed(1);d=`${h}/${v} kg/s`}else d=`${(t.fuel_consumption||t.sfc_mil||0).toFixed(2)} kg/s`;const u=i?((t.power_hp||0)*.75/(t.weight||1)).toFixed(1):((t.military_thrust||t.thrust||0)/(t.weight||1)).toFixed(1),p=a?"selected border-brand-400 ring-1 ring-brand-400/50":"border-slate-700/50 bg-slate-800/40",m=o.isAvailable?"":"opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10",b=o.isAvailable?`onclick="selectAircraftEngine('${e}')"`:`onclick="showTechRequirement('${t.name}', ${o.requiredTech}, ${o.currentTech})"`;return`
      <button class="engine-card component-card relative rounded-2xl p-4 text-left border transition ${p} ${m}" ${b}>
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-base font-semibold text-slate-100">${t.name}</h4>
          <div class="flex gap-1">
            ${s?'<span class="afterburner-indicator">🔥 AB</span>':""}
            ${i?'<span class="px-2 py-0.5 text-xs rounded-lg text-white bg-orange-600">Pistão</span>':'<span class="px-2 py-0.5 text-xs rounded-lg text-white bg-blue-600">Jato</span>'}
          </div>
        </div>
        
        <div class="space-y-2 text-xs text-slate-300">
          <div class="grid grid-cols-2 gap-2">
            <div>${r}</div>
            <div>Peso: <b>${Math.round(t.weight||0)} kg</b></div>
          </div>
          
          ${l?`<div class="grid grid-cols-2 gap-2"><div>${l}</div><div>T/W: <b>${u}</b></div></div>`:`<div class="grid grid-cols-2 gap-2"><div>T/W: <b>${u}</b></div><div></div></div>`}
          
          <div class="grid grid-cols-2 gap-2">
            <div class="reliability-indicator">
              <span class="reliability-dot ${n>=85?"high":n>=75?"medium":"low"}"></span>
              Confiab.: <b>${n}%</b>
            </div>
            <div>Consumo: <b>${d}</b></div>
          </div>
          
          <!-- Tech Level Indicator -->
          <div class="mt-2 flex items-center justify-between">
            <div class="text-xs">
              <span class="text-slate-400">Tech Level:</span>
              <span class="${o.isAvailable?"text-green-400":"text-red-400"} font-semibold">
                ${o.requiredTech}
              </span>
              ${t.year_introduced?`<span class="text-slate-500"> • ${t.year_introduced}</span>`:""}
            </div>
            ${o.isAvailable?"":`<div class="flex items-center gap-1">
                <span class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span class="text-red-400 text-xs">🔒</span>
                </span>
                <span class="text-xs text-red-400">Requer ${o.missingTech} tech</span>
              </div>`}
          </div>
        </div>
        
        ${a?'<div class="absolute top-2 right-2 w-3 h-3 bg-brand-400 rounded-full animate-pulse"></div>':""}
      </button>`}async loadWeaponsTab(){if(console.log("🔄 Loading Weapons Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.aircraft_weapons){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...");try{this.showLoadingState("Carregando armamentos de aeronaves..."),await this.ensureComponentsLoaded(["aircraft_weapons"]),console.log("✅ Components loaded, retrying..."),this.loadWeaponsTab()}catch(s){console.error("❌ Failed to load components:",s),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}return}const e=window.AIRCRAFT_COMPONENTS?.aircraft_weapons||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhum armamento disponível.");if(!window.currentAircraft?.airframe)return this.showEmptyState("Selecione uma fuselagem primeiro.");console.log(`📊 Found ${t.length} weapons in data`);const a=new Set(window.currentAircraft?.weapons||[]);let i='<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';t.forEach(s=>{const n=e[s],o=a.has(s);i+=`
        <div class="component-card relative rounded-2xl p-4 border cursor-pointer ${o?"selected border-brand-400 bg-brand-900/20":"border-slate-700/50 bg-slate-800/40"}" onclick="toggleAircraftWeapon('${s}')">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-semibold text-slate-100">${n.name}</h4>
            <span class="text-xs px-2 py-0.5 rounded-lg bg-slate-700/60 text-slate-200">${n.type||"payload"}</span>
          </div>
          <div class="text-xs text-slate-300">Peso: <b>${Math.round(n.weight||0)} kg</b></div>
          ${o?'<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full"></div>':""}
        </div>`}),i+="</div>",this.getTabContent().innerHTML=i}async loadAvionicsTab(){if(console.log("🔄 Loading Avionics Tab..."),!window.AIRCRAFT_COMPONENTS?.avionics){try{this.showLoadingState("Carregando sistemas aviônicos..."),await this.ensureComponentsLoaded(["avionics"]),this.loadAvionicsTab()}catch(e){console.error("❌ Failed to load avionics components:",e),this.showEmptyState("Sistema de componentes não encontrado.")}return}this.updateTechLevel();try{const e=await this.loadOptimizedTemplate("templates/aircraft-creator/avionics-tab.html");C.injectWithTransition(this.getTabContent(),e),this.debouncedUIUpdate("avionics-populate",()=>this.populateAvionicsTab(),50)}catch(e){console.error("❌ Failed to load avionics tab template:",e),this.showEmptyState("Erro ao carregar a aba de Aviônicos.")}}populateAvionicsTab(){const e=document.getElementById("avionics-groups-container");if(!e)return;const t=window.AIRCRAFT_COMPONENTS.avionics||{},a=Object.keys(t);if(a.length===0){e.innerHTML='<p class="text-slate-400">Nenhum sistema de aviônica disponível.</p>';return}const i=new Set(window.currentAircraft?.avionics||[]),s={};a.forEach(r=>{const l=t[r],d=l.type||"misc";s[d]||(s[d]=[]),s[d].push({id:r,...l})});const n={communication:"Sistemas de Comunicação",navigation:"Navegação e Piloto Automático",fcs:"Controle de Tiro e Mira",radar:"Radar de Busca",ew:"Guerra Eletrônica e Contramedidas",cockpit:"Sistemas de Cabine e Suporte"};let o="";for(const r in n)s[r]&&(o+=`<h3 class="text-lg font-semibold text-slate-200 mt-6 mb-4 border-b border-slate-700 pb-2">${n[r]}</h3>`,o+='<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">',s[r].forEach(l=>{o+=this.renderAvionicsCard(l.id,l,i.has(l.id))}),o+="</div>");e.innerHTML=o,e.addEventListener("click",r=>{const l=r.target.closest(".component-card");if(l&&l.dataset.avionicId){const d=l.dataset.avionicId;if(l.classList.contains("locked")){const p=t[d],m=this.getComponentAvailabilityInfo(p);window.showTechRequirement&&window.showTechRequirement(p.name,m.requiredTech,m.currentTech);return}window.currentAircraft.avionics||(window.currentAircraft.avionics=[]);const u=window.currentAircraft.avionics.indexOf(d);u>-1?window.currentAircraft.avionics.splice(u,1):window.currentAircraft.avionics.push(d),this.populateAvionicsTab(),updateAircraftCalculations()}})}renderAvionicsCard(e,t,a){const s=!this.getComponentAvailabilityInfo(t).isAvailable;return`
        <div class="component-card relative rounded-xl p-4 border transition-all ${a?"selected border-cyan-400 ring-1 ring-cyan-400/50":"border-slate-700/50 bg-slate-800/40"} ${s?"locked opacity-60 cursor-not-allowed":"hover:border-slate-600 hover:bg-slate-800"}" data-avionic-id="${e}">
            <div class="flex items-start justify-between mb-2">
                <h4 class="text-sm font-semibold text-slate-100 pr-4">${t.name}</h4>
                ${s?`<span class="text-red-400 text-xs">🔒 Tech ${t.tech_level}</span>`:""}
            </div>
            <p class="text-xs text-slate-400 mb-3 h-10 overflow-hidden">${t.description}</p>
            <div class="text-xs text-slate-300 grid grid-cols-2 gap-1">
                <div>Peso: <b>${t.weight} kg</b></div>
                <div>Custo: <b>${(t.cost/1e3).toFixed(0)}K</b></div>
            </div>
            ${a?'<div class="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-slate-800"></div>':""}
        </div>
    `}loadSuperchargerTab(){if(console.log("🔄 Loading Supercharger Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.superchargers){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load..."),this.showLoadingState("Carregando superchargers..."),window.loadAircraftComponents?window.loadAircraftComponents().then(()=>{console.log("✅ Components loaded, retrying..."),this.loadSuperchargerTab()}).catch(o=>{console.error("❌ Failed to load components:",o),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}):this.showEmptyState("Sistema de componentes não encontrado.");return}if(!window.currentAircraft?.airframe||!window.currentAircraft?.engine){this.showEmptyState("Selecione uma fuselagem e um motor primeiro.");return}this.updateTechLevel();const e=window.AIRCRAFT_COMPONENTS?.superchargers||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhum supercharger disponível.");console.log(`📊 Found ${t.length} superchargers in data`);const a=this.filterAvailableComponents(e);console.log(`🔬 Superchargers: ${Object.keys(a).length} available out of ${t.length} total`);const i=e,s=window.currentAircraft?.supercharger||"none";let n=`
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-100">Sistema de Superalimentação</h2>
            <p class="text-slate-400 text-sm">Melhore a performance em altitude com superchargers e turboalimentadores</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-slate-400">Selecionado:</div>
            <div class="text-lg font-semibold text-cyan-300" id="selected-supercharger-name">${i[s]?.name||"Nenhum"}</div>
          </div>
        </div>

        <!-- Info Box -->
        <div class="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
          <div class="flex items-center space-x-2 text-blue-300">
            <span>💡</span>
            <span class="font-semibold">Superalimentação em 1954</span>
          </div>
          <p class="text-blue-200 text-sm mt-2">
            Superchargers mecânicos são padrão em caças, enquanto turboalimentadores representam tecnologia de ponta para bombardeiros de alta altitude. Cada sistema tem trade-offs únicos de peso, complexidade e performance.
          </p>
        </div>

        <!-- Supercharger Selection -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    `;t.forEach(o=>{const r=i[o],l=s===o,d=this.getComponentAvailabilityInfo(r),u=l?"selected border-cyan-400 ring-1 ring-cyan-400/50 bg-cyan-900/20":"border-slate-700/50 bg-slate-800/40",p=d.isAvailable?"cursor-pointer hover:border-slate-600 hover:bg-slate-700/50":"opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10",m=d.isAvailable?`onclick="selectSupercharger('${o}')"`:`onclick="showTechRequirement('${r.name}', ${d.requiredTech}, ${d.currentTech})"`;n+=`
        <div class="component-card relative rounded-2xl p-6 border transition ${u} ${p}" ${m}>
          <div class="flex items-start justify-between mb-4">
            <div>
              <h4 class="text-lg font-semibold text-slate-100">${r.name}</h4>
              <p class="text-sm text-slate-400 mt-1">${r.description}</p>
            </div>
            ${d.isAvailable?"":`<div class="flex items-center gap-1">
                <span class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span class="text-red-400 text-xs">🔒</span>
                </span>
              </div>`}
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">Custo:</span>
                <span class="text-yellow-300 font-semibold">$${(r.cost/1e3).toFixed(0)}K</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Peso:</span>
                <span class="text-orange-300 font-semibold">${r.weight} kg</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">Alt. Nominal:</span>
                <span class="text-green-300 font-semibold">${r.rated_altitude_m||0}m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Confiabilidade:</span>
                <span class="text-blue-300 font-semibold">${Math.round((r.reliability_mod||1)*100)}%</span>
              </div>
            </div>
          </div>
          
          <!-- Tech Level Indicator -->
          <div class="mt-4 flex items-center justify-between">
            <div class="text-xs">
              <span class="text-slate-400">Tech Level:</span>
              <span class="${d.isAvailable?"text-green-400":"text-red-400"} font-semibold">
                ${r.tech_level||0}
              </span>
            </div>
            ${d.isAvailable?"":`<span class="text-xs text-red-400">Requer ${d.missingTech} tech adicional</span>`}
          </div>
          
          ${l?'<div class="absolute top-3 right-3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>':""}
        </div>
      `}),n+=`
        </div>

        <!-- Performance Impact -->
        <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6" id="supercharger-impact">
          <h3 class="text-lg font-semibold text-slate-100 mb-4 flex items-center space-x-2">
            <span>📊</span>
            <span>Impacto na Performance</span>
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-green-300 font-semibold" id="supercharger-altitude-gain">+0m</div>
              <div class="text-xs text-slate-400">Teto Efetivo</div>
            </div>
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-orange-300 font-semibold" id="supercharger-weight-impact">+0 kg</div>
              <div class="text-xs text-slate-400">Peso Adicional</div>
            </div>
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-yellow-300 font-semibold" id="supercharger-cost-impact">+$0K</div>
              <div class="text-xs text-slate-400">Custo Adicional</div>
            </div>
            <div class="text-center p-3 bg-slate-700/30 rounded-lg">
              <div class="text-red-300 font-semibold" id="supercharger-reliability-impact">100%</div>
              <div class="text-xs text-slate-400">Confiabilidade</div>
            </div>
          </div>
        </div>
      </div>
    `,this.getTabContent().innerHTML=n,this.updateSuperchargerImpact()}updateSuperchargerImpact(){const e=window.currentAircraft?.supercharger||"none",t=window.AIRCRAFT_COMPONENTS?.superchargers?.[e];if(!t)return;const a=document.getElementById("supercharger-altitude-gain"),i=document.getElementById("supercharger-weight-impact"),s=document.getElementById("supercharger-cost-impact"),n=document.getElementById("supercharger-reliability-impact");if(a){const o=t.rated_altitude_m||0;a.textContent=o>0?`+${o}m`:"0m"}if(i){const o=t.weight||0;i.textContent=o>0?`+${o} kg`:"0 kg"}if(s){const o=t.cost||0;s.textContent=o>0?`+$${(o/1e3).toFixed(0)}K`:"$0K"}if(n){const o=Math.round((t.reliability_mod||1)*100);n.textContent=`${o}%`}}async ensureComponentsLoaded(e=[]){if(window.AIRCRAFT_COMPONENTS&&e.every(t=>window.AIRCRAFT_COMPONENTS[t])){console.log("📋 All required components already loaded");return}this.componentLoadPromise||(this.componentLoadPromise=this.performComponentLoading());try{await this.componentLoadPromise,console.log("✅ Component loading completed")}finally{this.componentLoadPromise=null}}async performComponentLoading(){if(window.loadAircraftComponents)return console.log("🔄 Loading aircraft components with optimization..."),window.loadAircraftComponents();throw new Error("Component loading system not available")}async loadOptimizedTemplate(e){try{return await C.loadTemplate(e,{priority:"high",cache:!0})}catch(t){throw console.error(`❌ Failed to load template: ${e}`,t),t}}debouncedUIUpdate(e,t,a=150){C.debouncedUpdate(e,t,a)}isAvailable(e){try{const t=typeof window.getCurrentCountry=="function"?window.getCurrentCountry():null,a=e?.tech_level;if(t&&a&&Number.isFinite(a)&&t.tech_level<a)return!1;const i=t?.year;if(i){const s=e?.era_start,n=e?.era_end;if(s&&i<s||n&&i>n)return!1}return!0}catch{return!0}}getCategoryDisplayName(e){return{fighter:"Caça",bomber:"Bombardeiro",transport:"Transporte",attack:"Ataque ao Solo",helicopter:"Helicóptero",experimental:"Experimental"}[e]||"Desconhecida"}generateAirframeOptions(e){return({fighter:[{id:"light_fighter",icon:"🛩️",name:"Caça Leve",description:"Fuselagem ágil e econômica para caças leves (1954-1960)",weight:1600,gLimit:9,hardpoints:2,fuel:400},{id:"early_jet_fighter",icon:"🚀",name:"Caça a Jato Inicial",description:"Primeiro caça a jato subsônico básico (1954-1958)",weight:2200,gLimit:8,hardpoints:4,fuel:600},{id:"supersonic_fighter",icon:"⚡",name:"Caça Supersônico",description:"Caça supersônico de 2ª geração (1958-1965)",weight:2800,gLimit:7.5,hardpoints:4,fuel:900},{id:"interceptor_fighter",icon:"🎯",name:"Interceptador",description:"Especializado em interceptação de alta altitude (1960-1970)",weight:3200,gLimit:6,hardpoints:6,fuel:1400},{id:"multirole_fighter",icon:"⚔️",name:"Caça Multifunção",description:"Caça versátil de 3ª geração (1965-1975)",weight:3e3,gLimit:8,hardpoints:8,fuel:1100},{id:"air_superiority_fighter",icon:"🦅",name:"Superioridade Aérea",description:"Caça pesado de domínio aéreo (1970-1980)",weight:4200,gLimit:9,hardpoints:8,fuel:2200},{id:"modern_multirole",icon:"🌟",name:"Caça Moderno",description:"Caça de 4ª geração com aviônicos avançados (1975-1985)",weight:2600,gLimit:9,hardpoints:9,fuel:1e3},{id:"naval_fighter",icon:"⚓",name:"Caça Naval",description:"Caça reforçado para operações em porta-aviões (1960-1980)",weight:3400,gLimit:7,hardpoints:6,fuel:1300},{id:"stealth_prototype",icon:"👻",name:"Protótipo Furtivo",description:"Caça experimental com tecnologia stealth (1980-1990)",weight:3800,gLimit:6.5,hardpoints:4,fuel:1600}],bomber:[{id:"light_bomber",icon:"💣",name:"Bombardeiro Leve",description:"Fuselagem para bombardeio tático",weight:4200,gLimit:5,hardpoints:12,fuel:1800},{id:"medium_bomber",icon:"✈️",name:"Bombardeiro Médio",description:"Bombardeiro de médio alcance para missões estratégicas",weight:6800,gLimit:4,hardpoints:16,fuel:3200}],transport:[{id:"light_transport",icon:"📦",name:"Transporte Leve",description:"Transporte para pequenas cargas e pessoal",weight:3800,gLimit:4,hardpoints:2,fuel:1500},{id:"heavy_transport",icon:"✈️",name:"Transporte Pesado",description:"Grande capacidade para tropas e equipamentos",weight:8500,gLimit:3,hardpoints:4,fuel:4500}],attack:[{id:"ground_attack",icon:"⚔️",name:"Ataque ao Solo",description:"Especializado em apoio aéreo aproximado",weight:3200,gLimit:6,hardpoints:10,fuel:900}],helicopter:[{id:"light_helicopter",icon:"🚁",name:"Helicóptero Leve",description:"Helicóptero de observação e transporte leve",weight:1800,gLimit:4,hardpoints:4,fuel:600},{id:"medium_helicopter",icon:"🚁",name:"Helicóptero Médio",description:"Helicóptero multifunção para combate e transporte",weight:3200,gLimit:3,hardpoints:6,fuel:1200}],experimental:[{id:"prototype_x1",icon:"🧪",name:"Protótipo X-1",description:"Projeto experimental avançado",weight:2100,gLimit:12,hardpoints:4,fuel:500}]}[e]||[]).map(i=>`
      <div class="airframe-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-airframe="${i.id}">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">${i.icon}</span>
          <h4 class="font-semibold text-slate-200">${i.name}</h4>
        </div>
        <p class="text-sm text-slate-400 mb-3">${i.description}</p>
        <div class="text-xs text-slate-300 space-y-1">
          <div>Peso: <span class="text-yellow-400">${i.weight.toLocaleString()} kg</span></div>
          <div>Limite G: <span class="text-green-400">${i.gLimit}G</span></div>
          <div>Hardpoints: <span class="text-blue-400">${i.hardpoints}</span></div>
          <div>Combustível: <span class="text-cyan-400">${i.fuel}L</span></div>
        </div>
      </div>
    `).join("")}}window.tabLoaders=new B;class D{constructor(){console.log("⚖️ CenterOfGravitySystem initialized")}calculate(e){const t=this.calculateAtFuelLevel(e,1);e.totalMass=t.totalMass,e.centerOfGravity=t.cg}calculateAtFuelLevel(e,t=1){if(!e||!e.components||e.components.length===0)return{totalMass:0,cg:[0,0,0],warnings:["No components to calculate CG."]};const a=[];for(const o of e.components){let r=o.weight||0;const l=o.position;if(!(!l||l.length!==3)){if(o.type==="fuel_tank"){const d=(o.fuel_weight||0)*t;r=(o.empty_weight||0)+d}else if(o.internal_fuel_kg){const d=(o.internal_fuel_kg||0)*t;a.push({mass:o.base_weight||r,position:l}),a.push({mass:d,position:[l[0]+.5,l[1],l[2]-.1]});continue}r>0&&a.push({mass:r,position:l})}}let i=0;const s=[0,0,0];for(const o of a)i+=o.mass,s[0]+=o.mass*o.position[0],s[1]+=o.mass*o.position[1],s[2]+=o.mass*o.position[2];if(i===0)return{totalMass:0,cg:[0,0,0],warnings:["Total mass is zero."]};const n=[s[0]/i,s[1]/i,s[2]/i];return console.log(`CG Calculated at ${t*100}% fuel: Mass = ${i.toFixed(2)}kg, CG = [${n[0].toFixed(3)}, ${n[1].toFixed(3)}, ${n[2].toFixed(3)}]`),{totalMass:i,cg:n,warnings:[]}}}new D;class q{constructor(){this.maxSpeed={seaLevel:0,altitude:0,optimalAltitude:0,mach:0},this.cruiseSpeed={speed:0,altitude:0,fuelEfficiency:0},this.stallSpeed={clean:0,landing:0,takeoff:0},this.climbRate={seaLevel:0,initial:0,sustained:0,timeTo10k:0},this.ceiling={service:0,absolute:0,combat:0},this.range={maximum:0,combat:0,ferry:0,tactical:0},this.endurance={maximum:0,combat:0,patrol:0},this.maneuverability={gLimit:0,rollRate:0,turnRate:0,turnRadius:0,instantTurnRate:0},this.weight={empty:0,loaded:0,maximum:0,fuel:0,payload:0},this.balance={centerOfGravity:0,stability:"unknown",longitudinal:!0,directional:!0},this.power={totalThrust:0,thrustToWeight:0,powerLoading:0,wingLoading:0,diskLoading:0},this.efficiency={fuelConsumption:{cruise:0,combat:0,economy:0},energySpecific:0,powerSpecific:0},this.takeoff={distance:0,distanceToObstacle:0,speed:0,groundRoll:0},this.landing={distance:0,distanceFromObstacle:0,speed:0,groundRoll:0},this.combat={turnFightRating:0,boomZoomRating:0,interceptorRating:0,attackRating:0,survivabilityRating:0},this.operational={maintenanceHours:0,reliabilityFactor:0,operationalCost:0,pilotDemand:0,weatherLimits:{maxWind:0,visibility:0,cloudCeiling:0}},this.signatures={radarCrossSection:1,infraredSignature:1,visualSignature:1,acousticSignature:1},this.capabilities={carrierCompatible:!1,roughFieldCapable:!1,allWeatherCapable:!1,airRefuelCapable:!1,nuclearHardened:!1},this.altitudePerformance=new Map,this.loadoutPerformance=new Map,this.calculationMeta={lastUpdated:null,calculationVersion:"1.0.0",dataSource:"calculated",confidence:1,assumptions:[]},console.log("📊 PerformanceComponent created")}updateMetric(e,t,a){this[e]&&typeof this[e]=="object"?this[e][t]=a:this[e]=a,this.calculationMeta.lastUpdated=Date.now()}getMetric(e,t=null){return t&&this[e]&&typeof this[e]=="object"?this[e][t]:this[e]}setAltitudePerformance(e,t){this.altitudePerformance.set(e,{...t,altitude:e})}getAltitudePerformance(e){return this.altitudePerformance.get(e)}setLoadoutPerformance(e,t){this.loadoutPerformance.set(e,{...t,loadout:e})}getLoadoutPerformance(e){return this.loadoutPerformance.get(e)}calculateOverallRating(e="fighter"){const t={fighter:()=>(this.combat.turnFightRating*.3+this.combat.boomZoomRating*.2+this.maneuverability.gLimit*5+Math.min(this.maxSpeed.seaLevel/10,100)*.2+this.power.thrustToWeight*30)/5,attacker:()=>this.combat.attackRating*.4+this.weight.payload/this.weight.maximum*100*.3+Math.min(this.range.combat/10,100)*.2+this.operational.reliabilityFactor*100*.1,bomber:()=>this.weight.payload/this.weight.maximum*100*.4+Math.min(this.range.maximum/20,100)*.3+this.ceiling.service/150*.2+this.operational.reliabilityFactor*100*.1,transport:()=>this.weight.payload/this.weight.maximum*100*.3+Math.min(this.range.maximum/15,100)*.3+this.operational.reliabilityFactor*100*.2+(100-this.operational.pilotDemand)*.2,reconnaissance:()=>Math.min(this.maxSpeed.altitude/12,100)*.3+this.ceiling.service/150*.3+Math.min(this.range.maximum/15,100)*.2+(2-this.signatures.radarCrossSection)*50*.2},a=t[e]||t.fighter;return Math.max(0,Math.min(100,a()))}exportData(){return{maxSpeed:{...this.maxSpeed},cruiseSpeed:{...this.cruiseSpeed},stallSpeed:{...this.stallSpeed},climbRate:{...this.climbRate},ceiling:{...this.ceiling},range:{...this.range},endurance:{...this.endurance},maneuverability:{...this.maneuverability},weight:{...this.weight},balance:{...this.balance},power:{...this.power},efficiency:{...this.efficiency},takeoff:{...this.takeoff},landing:{...this.landing},combat:{...this.combat},operational:{...this.operational},signatures:{...this.signatures},capabilities:{...this.capabilities},altitudePerformance:Object.fromEntries(this.altitudePerformance),loadoutPerformance:Object.fromEntries(this.loadoutPerformance),calculationMeta:{...this.calculationMeta}}}importData(e){Object.keys(e).forEach(t=>{t==="altitudePerformance"?this.altitudePerformance=new Map(Object.entries(e[t])):t==="loadoutPerformance"?this.loadoutPerformance=new Map(Object.entries(e[t])):this.hasOwnProperty(t)&&typeof this[t]=="object"?Object.assign(this[t],e[t]):this[t]=e[t]}),this.calculationMeta.lastUpdated=Date.now()}validate(){const e=[],t=[];return this.maxSpeed.seaLevel<=0&&t.push("Max speed at sea level must be positive"),this.weight.empty<=0&&t.push("Empty weight must be positive"),this.weight.loaded<this.weight.empty&&t.push("Loaded weight cannot be less than empty weight"),this.weight.loaded>this.weight.maximum&&e.push("Loaded weight exceeds maximum takeoff weight"),(this.balance.centerOfGravity<.1||this.balance.centerOfGravity>.6)&&e.push("Center of gravity outside normal range"),this.power.thrustToWeight<.1&&e.push("Very low thrust-to-weight ratio"),this.stallSpeed.clean>=this.maxSpeed.seaLevel*.8&&e.push("Stall speed very close to max speed"),{isValid:t.length===0,errors:t,warnings:e}}getSummary(){return{maxSpeed:this.maxSpeed.seaLevel,climbRate:this.climbRate.seaLevel,ceiling:this.ceiling.service,range:this.range.maximum,weight:this.weight.loaded,thrustToWeight:this.power.thrustToWeight,wingLoading:this.power.wingLoading,overallRating:this.calculateOverallRating()}}}console.log("📊 PerformanceComponent module loaded");class j{constructor(){this.initialized=!1,this.constants={gravityAcceleration:9.81,airDensitySeaLevel:1.225,standardTemperature:288.15,standardPressure:101325,gasConstant:287.05,soundSpeedSeaLevel:343,earthRadius:6371e3},this.atmosphere={temperatureLapseRate:.0065,troposphereHeight:11e3,stratosphereHeight:2e4},console.log("🧮 PerformanceCalculationSystem initialized")}calculatePerformance(e){const t=new q;try{const a=e.structure||{},i=e.propulsion||{},s=e.wings||{},n=e.avionics||{},o=e.weapons||{},r=this.getAirframeData(a.airframe),l=this.getEngineData(i.engines),d=this.getWingData(s);if(!r||!l)return console.warn("⚠️ Missing critical aircraft data for performance calculation"),t;this.calculateWeightAndBalance(t,e,r,l),this.calculatePowerMetrics(t,l,i),this.calculateAerodynamics(t,r,d,e),this.calculateSpeedPerformance(t,r,l),this.calculateClimbAndCeiling(t,l,r),this.calculateRangeAndEndurance(t,l,r,i),this.calculateManeuverability(t,r,d),this.calculateTakeoffLanding(t,r,l),this.calculateCombatRatings(t,e),this.calculateOperationalCharacteristics(t,e),this.calculateSignatures(t,e),this.calculateAltitudePerformance(t,l,r),this.calculateLoadoutPerformance(t,e),t.calculationMeta.lastUpdated=Date.now(),t.calculationMeta.dataSource="calculated",t.calculationMeta.confidence=this.assessCalculationConfidence(e),console.log("✅ Performance calculation completed")}catch(a){console.error("❌ Performance calculation failed:",a),t.calculationMeta.lastUpdated=Date.now(),t.calculationMeta.confidence=0,t.calculationMeta.assumptions.push(`Calculation failed: ${a.message}`)}return t}calculateWeightAndBalance(e,t,a,i){let s=a.baseWeight||0;const n=t.propulsion?.engineCount||1;if(s+=(i.weight||0)*n,t.avionics?.length>0&&(s+=t.avionics.reduce((u,p)=>{const m=this.getAvionicsData(p);return u+(m?.weight||0)},0)),t.structure?.material){const u=this.getMaterialData(t.structure.material);u&&(s*=u.modifiers.weight)}const o=t.propulsion?.currentFuel||0;let r=0;t.weapons?.length>0&&(r=t.weapons.reduce((u,p)=>{const m=this.getWeaponData(p);return u+(m?.weight||0)},0));const l=s+o+r,d=a.maxTakeoffWeight||l*1.3;if(e.weight.empty=s,e.weight.fuel=o,e.weight.payload=r,e.weight.loaded=l,e.weight.maximum=d,window.centerOfGravity){const u=window.centerOfGravity.calculateCG(t);e.balance.centerOfGravity=u.position.percentMAC,e.balance.stability=u.stability.level,e.balance.longitudinal=u.stability.level!=="critical",e.balance.directional=!0}console.log(`⚖️ Weight calculated: ${Math.round(l)}kg (empty: ${Math.round(s)}kg)`)}calculatePowerMetrics(e,t,a){const i=a.engineCount||1,s=t.type&&t.type.includes("piston");let n=0,o="";s?(n=(t.powerHP||0)*i,o="HP"):(n=(t.militaryThrust||t.thrust||0)*i,o="kgf");const r=e.weight.loaded>0?(s?n*.75:n)/e.weight.loaded:0,l=n>0?e.weight.loaded/n:0;e.power.totalThrust=n,e.power.thrustToWeight=r,e.power.powerLoading=l,console.log(`🚀 Power: ${Math.round(n)} ${o}, T/W: ${r.toFixed(2)}`)}calculateAerodynamics(e,t,a,i){const s=t.wingArea||a.area||20,n=s>0?e.weight.loaded/s:0;e.power.wingLoading=n;const o=this.estimateDragCoefficient(t,a,i),r=this.estimateMaxLiftCoefficient(a,i);e.calculationMeta.aerodynamics={wingArea:s,baseDragCoeff:o,maxLiftCoeff:r,wingLoading:n},console.log(`🌪️ Wing loading: ${n.toFixed(1)} kg/m²`)}calculateSpeedPerformance(e,t,a){const i=e.calculationMeta.aerodynamics,s=a.type&&a.type.includes("piston");let n=0,o=0,r=0;if(s){const h=a.powerHP||0,v=e.power.totalThrust/h;n=Math.sqrt(h*v*745.7*.8/(.5*this.constants.airDensitySeaLevel*i.wingArea*i.baseDragCoeff))*3.6,r=6e3,o=n*1.15}else{const h=a.militaryThrust||a.thrust||0,v=e.power.totalThrust/h;n=Math.sqrt(h*v*this.constants.gravityAcceleration/(.5*this.constants.airDensitySeaLevel*i.wingArea*i.baseDragCoeff))*3.6,r=1e4;const w=this.getAirDensity(r);o=Math.sqrt(h*v*this.constants.gravityAcceleration/(.5*w*i.wingArea*i.baseDragCoeff))*3.6}n=Math.min(n,t.maxSpeedKph||2e3),o=Math.min(o,t.maxSpeedKph||2e3);const l=o/(this.getSoundSpeed(r)*3.6),d=n*.8,u=r*.7,p=this.calculateStallSpeed(e.weight.loaded,i.wingArea,i.maxLiftCoeff),m=p*.85,b=p*.9;e.maxSpeed.seaLevel=n,e.maxSpeed.altitude=o,e.maxSpeed.optimalAltitude=r,e.maxSpeed.mach=l,e.cruiseSpeed.speed=d,e.cruiseSpeed.altitude=u,e.stallSpeed.clean=p,e.stallSpeed.landing=m,e.stallSpeed.takeoff=b,console.log(`💨 Max speed: ${Math.round(n)} km/h (sea level), ${Math.round(o)} km/h (altitude)`)}calculateClimbAndCeiling(e,t,a){const i=e.power.thrustToWeight;e.power.wingLoading;const s=Math.max(0,(i-.3)*50),n=s*.8,o=n*.6,r=o>0?1e4/o:3600;let l=0;t.type&&t.type.includes("piston")?l=Math.min(12e3,i*8e3):l=Math.min(18e3,i*12e3);const d=l*1.2,u=l*.8;e.climbRate.initial=s,e.climbRate.seaLevel=n,e.climbRate.sustained=o,e.climbRate.timeTo10k=r,e.ceiling.service=l,e.ceiling.absolute=d,e.ceiling.combat=u,console.log(`📈 Climb: ${n.toFixed(1)} m/s, Ceiling: ${Math.round(l)}m`)}calculateRangeAndEndurance(e,t,a,i){const s=i.fuelCapacity||1e3,n=e.cruiseSpeed.speed;let o=0,r=0;if(t.type&&t.type.includes("piston")){const w=e.power.totalThrust/(t.powerHP||1);o=(t.powerHP||0)*w*.2,r=o*1.8}else{const w=e.power.totalThrust/(t.militaryThrust||t.thrust||1);o=(t.fuelConsumption||100)*w*3600*.6,r=(t.fuelConsumption||100)*w*3600}const l=o>0?s*.9/o*n:0,d=r>0?s*.7/r*n*.8:0,u=l*1.3,p=d*.8,m=o>0?s*.9/o:0,b=r>0?s*.7/r:0,h=m*.8,v=o>0?n/o:0;e.range.maximum=l,e.range.combat=d,e.range.ferry=u,e.range.tactical=p,e.endurance.maximum=m,e.endurance.combat=b,e.endurance.patrol=h,e.cruiseSpeed.fuelEfficiency=v,e.efficiency.fuelConsumption.cruise=o,e.efficiency.fuelConsumption.combat=r,e.efficiency.fuelConsumption.economy=o*.8,console.log(`🛣️ Range: ${Math.round(l)}km max, ${Math.round(d)}km combat`)}calculateManeuverability(e,t,a){const i=e.power.wingLoading;e.power.thrustToWeight;const s=t.gLimit||6,n=Math.max(30,180-i*3),o=e.stallSpeed.clean*1.4,r=Math.min(15,Math.sqrt(s*this.constants.gravityAcceleration*57.3)/(o/3.6)),l=o/3.6/(r*Math.PI/180),d=r*1.3;e.maneuverability.gLimit=s,e.maneuverability.rollRate=n,e.maneuverability.turnRate=r,e.maneuverability.turnRadius=l,e.maneuverability.instantTurnRate=d,console.log(`🔄 Maneuverability: ${s}G, ${r.toFixed(1)}°/s turn`)}calculateTakeoffLanding(e,t,a){e.power.wingLoading;const i=e.power.thrustToWeight,n=e.stallSpeed.takeoff*1.2,o=Math.pow(n/3.6,2)/(2*this.constants.gravityAcceleration*(i-.02)),r=o*1.2,l=e.stallSpeed.landing*1.3,d=Math.pow(l/3.6,2)/(2*this.constants.gravityAcceleration*.4),u=d*1.4;e.takeoff.speed=n,e.takeoff.groundRoll=o,e.takeoff.distance=r,e.takeoff.distanceToObstacle=r,e.landing.speed=l,e.landing.groundRoll=d,e.landing.distance=u,e.landing.distanceFromObstacle=u,e.capabilities.roughFieldCapable=r<800&&u<600,console.log(`🛬 Takeoff: ${Math.round(r)}m, Landing: ${Math.round(u)}m`)}calculateCombatRatings(e,t){const a=Math.min(100,e.maneuverability.turnRate*4+e.maneuverability.gLimit*8+Math.max(0,(1.2-e.power.wingLoading/300)*50)),i=Math.min(100,e.maxSpeed.seaLevel/10+e.climbRate.initial*10+e.power.thrustToWeight*40),s=Math.min(100,e.maxSpeed.altitude/12+e.ceiling.service/150+e.climbRate.sustained*15),n=Math.min(100,e.weight.payload/e.weight.maximum*200+e.range.combat/15+Math.max(0,600-e.stallSpeed.clean)/5),o=Math.min(100,e.maxSpeed.seaLevel/8+e.ceiling.service/100+(2-e.signatures.radarCrossSection)*30);e.combat.turnFightRating=a,e.combat.boomZoomRating=i,e.combat.interceptorRating=s,e.combat.attackRating=n,e.combat.survivabilityRating=o,console.log(`⚔️ Combat ratings: Turn ${Math.round(a)}, BnZ ${Math.round(i)}`)}calculateOperationalCharacteristics(e,t){let a=2;if(t.structure?.material){const o=this.getMaterialData(t.structure.material);o&&(a*=o.modifiers.maintenance)}if(t.propulsion?.engines?.length>0){const o=this.getEngineData(t.propulsion.engines[0]);o&&o.type&&o.type.includes("jet")&&(a*=1.5)}let i=.85;if(t.structure?.material){const o=this.getMaterialData(t.structure.material);o&&o.modifiers.durability&&(i*=Math.min(1,o.modifiers.durability))}const s=a*150+e.efficiency.fuelConsumption.cruise*2,n=Math.min(100,e.maxSpeed.seaLevel/800*30+e.maneuverability.gLimit/6*20+(t.avionics?.length||0)*10+20);e.operational.maintenanceHours=a,e.operational.reliabilityFactor=i,e.operational.operationalCost=s,e.operational.pilotDemand=n,e.operational.weatherLimits.maxWind=25,e.operational.weatherLimits.visibility=5,e.operational.weatherLimits.cloudCeiling=300,console.log(`🔧 Maintenance: ${a.toFixed(1)}h/fh, Reliability: ${Math.round(i*100)}%`)}calculateSignatures(e,t){let a=1;if(t.structure?.material){const l=this.getMaterialData(t.structure.material);l&&(a*=l.modifiers.radarSignature)}const i=t.structure?.size||"medium",s={light:.7,medium:1,heavy:1.5,super_heavy:2.2};a*=s[i]||1;const n=1,o=s[i]||1,r=t.propulsion?.engines?.some(l=>this.getEngineData(l)?.type?.includes("jet"))?1.5:.8;e.signatures.radarCrossSection=a,e.signatures.infraredSignature=n,e.signatures.visualSignature=o,e.signatures.acousticSignature=r,console.log(`📡 RCS: ${a.toFixed(2)} m²`)}calculateAltitudePerformance(e,t,a){[0,3e3,6e3,9e3,12e3,15e3].forEach(s=>{const n=this.calculatePerformanceAtAltitude(e,t,a,s);e.setAltitudePerformance(s,n)})}calculateLoadoutPerformance(e,t){["clean","light","standard","heavy","ferry"].forEach(i=>{const s=this.calculatePerformanceWithLoadout(e,t,i);e.setLoadoutPerformance(i,s)})}getAirframeData(e){return!e||!window.AIRCRAFT_COMPONENTS?.airframes?null:window.AIRCRAFT_COMPONENTS.airframes[e]}getEngineData(e){return!e||!Array.isArray(e)||e.length===0||!window.AIRCRAFT_COMPONENTS?.aircraft_engines?null:window.AIRCRAFT_COMPONENTS.aircraft_engines[e[0]]}getWingData(e){return!e?.type||!window.AIRCRAFT_COMPONENTS?.wing_types?{}:window.AIRCRAFT_COMPONENTS.wing_types[e.type]||{}}getMaterialData(e){return!e||!window.STRUCTURAL_MATERIALS?null:window.STRUCTURAL_MATERIALS[e]}getAvionicsData(e){return!e||!window.AIRCRAFT_COMPONENTS?.avionics?null:window.AIRCRAFT_COMPONENTS.avionics[e]}getWeaponData(e){return!e||!window.AIRCRAFT_COMPONENTS?.aircraft_weapons?null:window.AIRCRAFT_COMPONENTS.aircraft_weapons[e]}estimateDragCoefficient(e,t,a){let i=.025;e.category==="fighter"?i=.02:e.category==="bomber"?i=.035:e.category==="transport"&&(i=.04),t.type==="swept"?i*=.9:t.type==="delta"&&(i*=.85);const s=a.weapons?.length||0;return i+=s*.005,i}estimateMaxLiftCoefficient(e,t){let a=1.2;return e.type==="high_lift"?a=1.6:e.type==="swept"&&(a=1),e.features?.includes("flaps")&&(a+=.8),e.features?.includes("slats")&&(a+=.3),a}calculateStallSpeed(e,t,a){return t<=0||a<=0?150:Math.sqrt(e*this.constants.gravityAcceleration/(.5*this.constants.airDensitySeaLevel*t*a))*3.6}getAirDensity(e){if(e<=this.atmosphere.troposphereHeight){const t=this.constants.standardTemperature-this.atmosphere.temperatureLapseRate*e;return this.constants.standardPressure*Math.pow(t/this.constants.standardTemperature,5.256)/(this.constants.gasConstant*t)}else return this.constants.airDensitySeaLevel*.1}getSoundSpeed(e){const t=this.constants.standardTemperature-Math.min(e,this.atmosphere.troposphereHeight)*this.atmosphere.temperatureLapseRate;return Math.sqrt(1.4*this.constants.gasConstant*t)}calculatePerformanceAtAltitude(e,t,a,i){const s=this.getAirDensity(i),n=s/this.constants.airDensitySeaLevel;return{altitude:i,airDensity:s,maxSpeed:e.maxSpeed.seaLevel*Math.sqrt(1/n)*.9,climbRate:e.climbRate.seaLevel*Math.pow(n,.7),stallSpeed:e.stallSpeed.clean/Math.sqrt(n),turnRate:e.maneuverability.turnRate*Math.sqrt(n)}}calculatePerformanceWithLoadout(e,t,a){const i={clean:{weightFactor:1,dragFactor:1},light:{weightFactor:1.1,dragFactor:1.05},standard:{weightFactor:1.2,dragFactor:1.15},heavy:{weightFactor:1.4,dragFactor:1.3},ferry:{weightFactor:1.3,dragFactor:1.1}},s=i[a]||i.standard;return{loadout:a,maxSpeed:e.maxSpeed.seaLevel/s.dragFactor,climbRate:e.climbRate.seaLevel/s.weightFactor,range:e.range.maximum*(a==="ferry"?1.5:1/s.weightFactor),maneuverability:e.maneuverability.turnRate/s.weightFactor}}assessCalculationConfidence(e){let t=1;return e.structure?.airframe||(t*=.3),e.propulsion?.engines?.length||(t*=.5),e.structure?.material||(t*=.9),(e.propulsion?.engineCount||1)>4&&(t*=.8),Math.max(.1,t)}}const H=new j;window.performanceCalculationSystem=H;console.log("🧮 PerformanceCalculationSystem module loaded");class G{static calculateCosts(e){if(!e||!e.airframe||!e.engine)return this.getDefaultCosts();try{const t=this.calculateCostBreakdown(e),a=Object.values(t).reduce((o,r)=>o+r,0),i=this.calculateMaintenanceCost(e,t),s=this.calculateOperationalCost(e),n=a+i*10+s*10;return{production:a,maintenance:i,operational:s,total_ownership:n,breakdown:t,efficiency_metrics:this.calculateCostEfficiency(e,a)}}catch(t){return console.error("🚨 Error in advanced aircraft cost calculation:",t),this.getDefaultCosts()}}static calculateCostBreakdown(e){const t=window.AIRCRAFT_COMPONENTS.airframes[e.airframe],a=window.AIRCRAFT_COMPONENTS.aircraft_engines[e.engine],i=e.wings||{},s=e.avionics||[],n=e.weapons||[];let o=(t.base_weight||0)*70;(t.max_speed_kph||0)>=1200&&(o*=1.8),t.tech_era==="stealth"&&(o*=3);let r=0;a.type.includes("piston")?r=(a.power_hp||0)*50:r=(a.thrust||a.military_thrust||0)*280,a.afterburner_thrust&&(r*=1.4),a.type.includes("turbofan")&&(r*=1.6),a.experimental&&(r*=2.2);const l=i.type?window.AIRCRAFT_COMPONENTS.wing_types[i.type]:null;let d=(t.wing_area_m2||20)*1500;l&&(d*=l.cost_mod||1),(i.features||[]).forEach(h=>d+=window.AIRCRAFT_COMPONENTS.wing_features[h]?.cost||0);const u=s.reduce((h,v)=>h+(window.AIRCRAFT_COMPONENTS.avionics[v]?.cost||0),0),p=n.reduce((h,v)=>h+(window.AIRCRAFT_COMPONENTS.aircraft_weapons[v]?.cost_base||0),0),b=(o+r+d+u+p)*.15;return{airframe:Math.round(o),engine:Math.round(r),wings:Math.round(d),avionics:Math.round(u),weapons:Math.round(p),integration:Math.round(b)}}static calculateMaintenanceCost(e,t){const a=window.AIRCRAFT_COMPONENTS.aircraft_engines[e.engine];let i=(t.airframe+t.wings)*.03;const s=a.maintenance_hours||50,n=a.reliability||.85;let o=50;return a.type.includes("piston")&&(o=30),a.type.includes("turboprop")&&(o=70),a.type.includes("turbofan")&&(o=120),a.experimental&&(o*=3),i+=s*o*(1.6-n),i+=(t.avionics+t.weapons)*.05,Math.round(i)}static calculateOperationalCost(e){const t=window.AIRCRAFT_COMPONENTS.aircraft_engines[e.engine],a=window.AIRCRAFT_COMPONENTS.airframes[e.airframe],i=t.sfc_military||1,s=250,n=1.5,o=t.military_thrust||t.thrust||t.power_hp*.8,r=i*o*s*n,d=(a.crew||1)*5e4,u=(e.weapons||[]).length*5e3;return Math.round(r+d+u)}static calculateCostEfficiency(e,t){let a={};try{a=window.realisticPerformanceCalculator.calculateAircraftPerformance(e)}catch(n){console.error("Cost system failed to get performance data:",n),a={error:!0}}if(!a||a.error)return{cost_per_ton:0,bang_for_buck:0};const i=a.totalWeight||1,s=(a.maxSpeedKph||0)+(a.range||0)/5+(a.rateOfClimb||0)/10;return{cost_per_ton:Math.round(t/(i/1e3)),bang_for_buck:Math.round(s*100/t)}}static getDefaultCosts(){return{production:0,maintenance:0,operational:0,total_ownership:0,breakdown:{},efficiency_metrics:{cost_per_ton:0,bang_for_buck:0}}}static renderCostDisplay(e){const t=this.calculateCosts(e||window.currentAircraft||{});Number(e?.quantity||window.currentAircraft?.quantity||1);const a=o=>isNaN(o)?"0":(o/1e3).toFixed(0),i=o=>isNaN(o)?"0":(o/1e6).toFixed(1);let s='<h3 class="text-xl font-semibold text-slate-100 mb-4">💰 Análise de Custos Avançada</h3>';return s+=`
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
                    <div class="text-green-300 text-sm font-medium">Custo de Produção</div>
                    <div class="text-green-100 text-2xl font-bold">$${a(t.production)}K</div>
                </div>
                <div class="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30">
                    <div class="text-yellow-300 text-sm font-medium">Manutenção Anual</div>
                    <div class="text-yellow-100 text-2xl font-bold">$${a(t.maintenance)}K</div>
                </div>
                <div class="p-4 rounded-lg bg-orange-900/20 border border-orange-500/30">
                    <div class="text-orange-300 text-sm font-medium">Custo Operacional Anual</div>
                    <div class="text-orange-100 text-2xl font-bold">$${a(t.operational)}K</div>
                </div>
            </div>
        `,s+=`
            <div class="p-4 rounded-lg bg-red-900/20 border border-red-500/30 mb-6">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-red-300 font-medium">Custo Total de Propriedade (10 anos)</span>
                    <span class="text-red-100 font-bold text-lg">$${i(t.total_ownership)}M</span>
                </div>
                <div class="text-xs text-red-300/70">
                    Compra ($${a(t.production)}K) + Manutenção ($${a(t.maintenance*10)}K) + Operação ($${a(t.operational*10)}K)
                </div>
            </div>
        `,s+='<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">',s+='<div><h4 class="text-slate-200 font-medium mb-3">📊 Breakdown de Produção</h4><div class="space-y-2">',Object.entries(t.breakdown).sort((o,r)=>r[1]-o[1]).forEach(([o,r])=>{if(r>0){const l=t.production>0?(r/t.production*100).toFixed(1):"0.0";s+=`
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-slate-300">${this.formatComponentName(o)}</span>
                            <span class="font-medium text-slate-100">$${a(r)}K (${l}%)</span>
                        </div>
                        <div class="h-2 bg-slate-700 rounded-full"><div class="h-2 bg-cyan-500 rounded-full" style="width: ${l}%"></div></div>
                    </div>
                `}}),s+="</div></div>",s+='<div><h4 class="text-slate-200 font-medium mb-3">📈 Métricas de Eficiência</h4><div class="space-y-3">',s+=`<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Custo por Tonelada</span><span class="text-slate-100 font-semibold">$${(t.efficiency_metrics.cost_per_ton||0).toLocaleString()}</span></div>`,s+=`<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Bang for Buck</span><span class="text-slate-100 font-semibold">${(t.efficiency_metrics.bang_for_buck||0).toLocaleString()} pts/$M</span></div>`,s+="</div></div>",s+="</div>",s}static formatComponentName(e){return{airframe:"Fuselagem",engine:"Motor",wings:"Asas",avionics:"Aviônicos",weapons:"Armamentos",integration:"Integração e Sistemas"}[e]||e}}window.AircraftCostSystem=G;class V{constructor(){this.entities=new Map,this.components=new Map,this.nextEntityId=1,this.systems=new Set,console.log("✈️ AircraftECS initialized")}createAircraft(){const e=this.nextEntityId++;return this.entities.set(e,new Set),console.log(`✨ Aircraft entity created: ${e}`),e}destroyAircraft(e){if(!this.entities.has(e)){console.warn(`⚠️ Attempted to destroy non-existent aircraft: ${e}`);return}const t=this.entities.get(e);for(const a of t)this.removeComponent(e,a);this.entities.delete(e),console.log(`🗑️ Aircraft entity destroyed: ${e}`)}addComponent(e,t,a){if(!this.entities.has(e))throw new Error(`Aircraft ${e} does not exist`);this.components.has(t)||this.components.set(t,new Map),this.components.get(t).set(e,a),this.entities.get(e).add(t),console.log(`🔧 Component '${t}' added to aircraft ${e}`)}removeComponent(e,t){if(!this.entities.has(e)){console.warn(`⚠️ Attempted to remove component from non-existent aircraft: ${e}`);return}this.components.has(t)&&(this.components.get(t).delete(e),this.entities.get(e).delete(t),console.log(`🔧 Component '${t}' removed from aircraft ${e}`))}getComponent(e,t){return this.components.has(t)&&this.components.get(t).get(e)||null}hasComponent(e,t){return this.entities.has(e)&&this.entities.get(e).has(t)}getAircraftWithComponents(...e){const t=[];for(const[a,i]of this.entities)e.every(n=>i.has(n))&&t.push(a);return t}getDebugInfo(){const e={};for(const[t,a]of this.components)e[t]=a.size;return{totalAircraft:this.entities.size,componentCounts:e,registeredSystems:Array.from(this.systems).map(t=>t.constructor.name)}}}const g=new V;window.aircraftECS=g;class U{constructor(){this.activeAircraftId=null,this.initialized=!1}initialize(){this.initialized||(this.createDefaultAircraft(),this.initialized=!0,console.log("✈️ AircraftEntity system initialized"))}createAircraft(e="Nova Aeronave"){const t=g.createAircraft();return g.addComponent(t,"Identity",{name:e,type:"aircraft",category:null,createdAt:Date.now(),lastModified:Date.now()}),g.addComponent(t,"Structure",{airframe:null,material:"aluminum",size:"medium",baseWeight:0,maxTakeoffWeight:0,centerOfGravity:{x:0,y:0,z:0}}),g.addComponent(t,"Propulsion",{engines:[],totalThrust:0,thrustToWeight:0,fuelCapacity:0,fuelConsumption:{idle:0,cruise:0,combat:0}}),g.addComponent(t,"Aerodynamics",{wings:{type:null,area:0,features:[]},clMax:0,cd0:0,liftToDrag:0}),g.addComponent(t,"Performance",{maxSpeed:0,cruiseSpeed:0,climbRate:0,serviceceiling:0,range:0,gLimit:0}),g.addComponent(t,"Armament",{hardpoints:[],weapons:[],maxWeaponLoad:0}),g.addComponent(t,"Avionics",{radar:null,irst:null,jammer:null,countermeasures:[]}),g.addComponent(t,"Economics",{developmentCost:0,unitCost:0,maintenanceCost:0,techLevel:0}),console.log(`✈️ Aircraft created: ${e} (ID: ${t})`),t}createDefaultAircraft(){this.activeAircraftId||(this.activeAircraftId=this.createAircraft(),console.log(`🎯 Default aircraft created: ${this.activeAircraftId}`))}setActiveAircraft(e){if(!g.entities.has(e))throw new Error(`Aircraft ${e} does not exist`);this.activeAircraftId=e,console.log(`🎯 Active aircraft set to: ${e}`)}getActiveAircraftId(){return this.activeAircraftId}getAircraftData(e=null){const t=e||this.activeAircraftId;return!t||!g.entities.has(t)?null:{id:t,identity:g.getComponent(t,"Identity"),structure:g.getComponent(t,"Structure"),propulsion:g.getComponent(t,"Propulsion"),aerodynamics:g.getComponent(t,"Aerodynamics"),performance:g.getComponent(t,"Performance"),armament:g.getComponent(t,"Armament"),avionics:g.getComponent(t,"Avionics"),economics:g.getComponent(t,"Economics")}}updateComponent(e,t,a){const i=g.getComponent(e,t);if(!i)throw new Error(`Component ${t} not found on aircraft ${e}`);const s={...i,...a};g.addComponent(e,t,s),this.updateLastModified(e),console.log(`🔧 Aircraft ${e} component '${t}' updated`)}updateLastModified(e){const t=g.getComponent(e,"Identity");if(t){const a={...t,lastModified:Date.now()};g.addComponent(e,"Identity",a)}}validateAircraft(e=null){const t=e||this.activeAircraftId,a=this.getAircraftData(t);if(!a)return{isValid:!1,errors:["Aircraft not found"]};const i=[],s=[];return a.structure?.airframe||i.push("Nenhuma fuselagem selecionada"),a.propulsion?.engines?.length||i.push("Nenhum motor selecionado"),a.aerodynamics?.wings?.type||i.push("Nenhum tipo de asa selecionado"),a.performance?.thrustToWeight<.3&&s.push("Relação empuxo/peso muito baixa"),{isValid:i.length===0,errors:i,warnings:s}}getAllAircraft(){return g.getAircraftWithComponents("Identity","Structure")}destroyAircraft(e){this.activeAircraftId===e&&(this.activeAircraftId=null),g.destroyAircraft(e),console.log(`🗑️ Aircraft destroyed: ${e}`)}}const f=new U;window.aircraftEntityManager=f;class K{constructor(){this.isInitialized=!1,this.legacyAircraftProxy=null,this.updating=!1,this.updateTimeout=null}initialize(){this.isInitialized||(f.initialize(),this.setupLegacyProxy(),this.setupLegacyFunctions(),this.isInitialized=!0,console.log("🔄 Legacy bridge initialized"))}setupLegacyProxy(){this.legacyAircraftProxy=new Proxy({},{get:(e,t)=>{const a=f.getAircraftData();if(!a)return this.getDefaultValue(t);switch(t){case"name":return a.identity?.name||"Nova Aeronave";case"airframe":return a.structure?.airframe||null;case"engine":return a.propulsion?.engines?.[0]||null;case"wings":return{type:a.aerodynamics?.wings?.type||null,features:a.aerodynamics?.wings?.features||[]};case"weapons":return a.armament?.weapons||[];case"avionics":return a.avionics||{};case"quantity":return a.economics?.quantity||1;default:return e[t]}},set:(e,t,a)=>{const i=f.getActiveAircraftId();if(!i)return console.warn("⚠️ No active aircraft to update"),!1;if(this.updating)return!0;try{switch(this.updating=!0,t){case"name":f.updateComponent(i,"Identity",{name:a});break;case"airframe":f.updateComponent(i,"Structure",{airframe:a});break;case"engine":f.updateComponent(i,"Propulsion",{engines:a?[a]:[]});break;case"wings":if(typeof a=="object"){const s=f.getAircraftData()?.aerodynamics?.wings||{};f.updateComponent(i,"Aerodynamics",{wings:{...s,...a}})}break;case"weapons":f.updateComponent(i,"Armament",{weapons:a});break;case"avionics":f.updateComponent(i,"Avionics",a);break;case"quantity":f.updateComponent(i,"Economics",{quantity:a});break;default:e[t]=a}return window.updateAircraftCalculations&&!this.updateTimeout&&(this.updateTimeout=setTimeout(()=>{window.updateAircraftCalculations&&window.updateAircraftCalculations(),this.updateTimeout=null},100)),!0}catch(s){return console.error(`❌ Error setting legacy property ${t}:`,s),!1}finally{this.updating=!1}}}),window.currentAircraft=this.legacyAircraftProxy,console.log("🔗 Legacy currentAircraft proxy established")}getDefaultValue(e){const t={name:"Nova Aeronave",airframe:null,engine:null,wings:{type:null,features:[]},weapons:[],avionics:{},quantity:1};return t[e]!==void 0?t[e]:null}setupLegacyFunctions(){const e=window.selectAirframe,t=window.selectAircraftEngine,a=window.toggleAircraftWeapon,i=window.updateAircraftCalculations;window.selectAirframe=s=>{e&&e(s);const n=f.getActiveAircraftId();n&&f.updateComponent(n,"Structure",{airframe:s}),console.log(`🛩️ Airframe selected via legacy bridge: ${s}`)},window.selectAircraftEngine=s=>{t&&t(s);const n=f.getActiveAircraftId();n&&f.updateComponent(n,"Propulsion",{engines:[s]}),console.log(`⚙️ Engine selected via legacy bridge: ${s}`)},window.toggleAircraftWeapon=s=>{a&&a(s);const n=f.getActiveAircraftId();if(n){const r=f.getAircraftData()?.armament?.weapons||[],l=r.indexOf(s);let d;l>-1?d=r.filter(u=>u!==s):d=[...r,s],f.updateComponent(n,"Armament",{weapons:d})}console.log(`💥 Weapon toggled via legacy bridge: ${s}`)},window.updateAircraftCalculations=()=>{i&&i(),console.log("📊 Aircraft calculations updated via legacy bridge")},window.getCurrentAircraft=()=>window.currentAircraft,window.getAircraftECSData=()=>f.getAircraftData(),console.log("🔗 Legacy functions bridged")}validateBridge(){try{if(!window.currentAircraft)throw new Error("currentAircraft proxy not available");return typeof window.currentAircraft.name!="string"&&console.warn("⚠️ currentAircraft.name not returning string, but bridge is functional"),typeof window.selectAirframe!="function"&&console.warn("⚠️ selectAirframe function not available"),typeof window.updateAircraftCalculations!="function"&&console.warn("⚠️ updateAircraftCalculations function not available"),console.log("✅ Legacy bridge validation passed"),!0}catch(e){return console.error("❌ Legacy bridge validation failed:",e),!1}}getActiveAircraftId(){return f.getActiveAircraftId()}createAircraft(e){return f.createAircraft(e)}}const $=new K;window.legacyBridge=$;let E=null;async function J(){const c=document.getElementById("initial-loading"),e=document.getElementById("loading-status"),t=a=>{e&&(e.textContent=a)};try{t("Aguardando autenticação..."),O.onAuthStateChanged(async a=>{if(a){t("Usuário autenticado. Verificando país...");const i=await F(a.uid);if(i){t("País encontrado. Carregando dados de tecnologia...");const[s,n]=await Promise.all([N(i),W()]);if(s){const o=1953+(n?.turnoAtual||1),r=s.Aeronautica||50;if(E={...s,id:i,aircraftTech:r,name:s.Pais,year:o},window.currentUserCountry=E,console.log(`✅ País do usuário carregado: ${E.name} | Ano: ${E.year}`,E),t("Inicializando sistema de aeronaves..."),$.initialize(),!$.validateBridge())throw new Error("Falha na inicialização do sistema ECS de aeronaves");console.log("✅ Aircraft ECS system initialized successfully"),window.aircraftCreatorApp&&!window.aircraftCreatorApp.isInitialized&&await window.aircraftCreatorApp.initialize()}else throw new Error(`Não foi possível carregar os dados para o país com ID: ${i}`)}else throw t("Você não está vinculado a um país. Redirecionando..."),setTimeout(()=>{window.location.href="index.html"},3e3),new Error("Usuário não vinculado a um país.")}else throw t("Nenhum usuário logado. Redirecionando para a página inicial..."),setTimeout(()=>{window.location.href="index.html"},3e3),new Error("Usuário não autenticado.")})}catch(a){console.error("❌ Erro fatal na inicialização do Criador de Aeronaves:",a),t(`Erro: ${a.message}`),c&&(c.innerHTML=`<div class="text-red-400 text-center p-4">${a.message}</div>`)}}async function Z(){console.log("🔄 Carregando todos os componentes da aeronave via import dinâmico...");try{const c=await A(()=>import("./airframes-BQ2DhmGT.js"),[]),e=await A(()=>import("./aircraft_engines-CxKa-iZa.js"),[]),t=await A(()=>import("./aircraft_weapons-D0VVw60T.js"),[]),a=await A(()=>import("./avionics-C4CyQW2d.js"),[]),i=await A(()=>import("./wings-CKabl5NO.js"),[]),s=await A(()=>import("./superchargers-DOJWOdFG.js"),[]),n=await A(()=>import("./special_equipment-Dql9NOlA.js"),[]);return window.AIRCRAFT_COMPONENTS.airframes=c.airframes,window.AIRCRAFT_COMPONENTS.aircraft_engines=e.aircraft_engines,window.AIRCRAFT_COMPONENTS.aircraft_weapons=t.aircraft_weapons,window.AIRCRAFT_COMPONENTS.avionics=a.avionics,window.AIRCRAFT_COMPONENTS.wing_types=i.wing_types,window.AIRCRAFT_COMPONENTS.wing_features=i.wing_features,window.AIRCRAFT_COMPONENTS.superchargers=s.superchargers,window.AIRCRAFT_COMPONENTS.special_equipment=n.special_equipment,console.log("✅ Todos os componentes foram carregados com sucesso."),!0}catch(c){return console.error("❌ Erro fatal ao carregar componentes dinamicamente:",c),!1}}window.loadAircraftComponents=Z;window.currentAircraft={name:"Nova Aeronave",airframe:null,engine:null,wings:{type:null,features:[]},supercharger:"none",weapons:[],avionics:[],quantity:1};window.AIRCRAFT_COMPONENTS||(window.AIRCRAFT_COMPONENTS={airframes:{},aircraft_engines:{},aircraft_weapons:{},avionics:{},wing_types:{},wing_features:{},superchargers:{}});window.AIRCRAFT_COMPONENTS=window.AIRCRAFT_COMPONENTS;window.currentAircraft=window.currentAircraft;window.getCurrentUserCountry=()=>E;window.selectAirframe=function(c){if(!window.AIRCRAFT_COMPONENTS?.airframes[c]){console.error("Airframe not found:",c);return}window.currentAircraft.airframe=c,document.querySelectorAll(".airframe-card").forEach(t=>{t.classList.remove("selected","border-cyan-400","ring-1","ring-cyan-400/50"),t.classList.add("border-slate-700/50","bg-slate-800/40")});const e=document.querySelector(`[onclick="selectAirframe('${c}')"]`);e&&(e.classList.add("selected","border-cyan-400","ring-1","ring-cyan-400/50"),e.classList.remove("border-slate-700/50","bg-slate-800/40")),updateAircraftCalculations()};window.selectAircraftEngine=function(c){if(!window.AIRCRAFT_COMPONENTS?.aircraft_engines[c]){console.error("Engine not found:",c);return}window.currentAircraft.engine=c,document.querySelectorAll(".engine-card").forEach(t=>{t.classList.remove("selected","border-cyan-400","ring-1","ring-cyan-400/50"),t.classList.add("border-slate-700/50","bg-slate-800/40")});const e=document.querySelector(`[onclick="selectAircraftEngine('${c}')"]`);e&&(e.classList.add("selected","border-cyan-400","ring-1","ring-cyan-400/50"),e.classList.remove("border-slate-700/50","bg-slate-800/40")),updateAircraftCalculations()};window.toggleAircraftWeapon=function(c){window.currentAircraft.weapons||(window.currentAircraft.weapons=[]);const e=window.currentAircraft.weapons.indexOf(c);e>-1?window.currentAircraft.weapons.splice(e,1):window.currentAircraft.weapons.push(c);const t=document.querySelector(`[onclick="toggleAircraftWeapon('${c}')"]`);t&&(t.classList.toggle("selected"),t.classList.toggle("border-cyan-400")),updateAircraftCalculations()};window.updateAircraftCalculations=function(){if(window.calculateAircraftPerformance){const c=window.calculateAircraftPerformance();Y(c)}if(window.calculateAircraftCosts){const c=window.calculateAircraftCosts();updateCostDisplays(c)}};function Y(c){const e=document.getElementById("total-weight-display"),t=document.getElementById("max-speed-display"),a=document.getElementById("thrust-weight-ratio-display");if(e&&c.totalWeight&&(e.textContent=Math.round(c.totalWeight)+" kg"),t&&(c.maxSpeed||c.maxSpeedKph)){const i=c.maxSpeed||c.maxSpeedKph;t.textContent=Math.round(i)+" km/h"}a&&c.thrustToWeight&&(a.textContent=c.thrustToWeight.toFixed(2)+":1")}document.addEventListener("DOMContentLoaded",function(){console.log("🚀 Inicializando sistema de aeronaves com novo fluxo..."),J()});class Q{constructor(e){const t=document.getElementById(e);if(!t){console.error(`Canvas element with id '${e}' not found.`);return}this.chart=this._createChart(t.getContext("2d")),console.log("📊 EngineeringDashboard initialized with Radar Chart.")}_createChart(e){return new Chart(e,{type:"radar",data:{labels:["Velocidade","Manobrabilidade","Alcance","Sobrevivência","Furtividade","Custo-Benefício"],datasets:[{label:"Performance da Aeronave",data:[0,0,0,0,0,0],backgroundColor:"rgba(34, 211, 238, 0.2)",borderColor:"rgba(34, 211, 238, 0.8)",pointBackgroundColor:"rgba(34, 211, 238, 1)",pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:"rgba(34, 211, 238, 1)"}]},options:{responsive:!0,maintainAspectRatio:!1,scales:{r:{angleLines:{color:"rgba(255, 255, 255, 0.1)"},grid:{color:"rgba(255, 255, 255, 0.1)"},min:0,max:100,ticks:{display:!1,stepSize:25},pointLabels:{color:"#cbd5e1",font:{size:12}}}},plugins:{legend:{display:!1}}}})}update(e){if(!this.chart||!e)return;const t=e.performance||{},a=e.costs||{},i=e.signatures||{},s=[this._normalize(t.maxSpeed,300,1800),this._normalize(t.maneuveringThrust,0,5e3),this._normalize(t.range,500,4e3),this._normalize((t.chaffEffectiveness||0)+(t.flareEffectiveness||0),0,1.5),this._normalize(i.radarCrossSection,5,.5,!0),this._normalize(a.unitProductionCost,5e5,5e4,!0)];this.chart.data.datasets[0].data=s,this.chart.update()}_normalize(e=0,t,a,i=!1){i&&([t,a]=[a,t]);const s=(e-t)/(a-t)*100;return Math.max(0,Math.min(100,s))}}class X{constructor(e,t){if(this.container=document.getElementById(e),this.list=document.getElementById(t),!this.container||!this.list){console.error("WarningsDisplay: Container or list element not found.");return}console.log("⚠️ WarningsDisplay initialized")}update(e=[],t=[]){if(!this.container||!this.list)return;this.list.innerHTML="";const a=[...t,...e];if(a.length===0){this.container.classList.add("hidden");return}a.forEach(i=>{const s=i.severity==="critical"||i.severity==="error",n=this._createMessageElement(i,s);this.list.appendChild(n)}),this.container.classList.remove("hidden")}_createMessageElement(e,t){const a=document.createElement("div");a.className=`p-3 rounded-lg mb-2 ${t?"bg-red-900/40 text-red-300":"bg-amber-900/30 text-amber-300"}`;const i=t?"🚨":"⚠️";return a.innerHTML=`
            <div class="flex items-start space-x-3">
                <div class="text-xl">${i}</div>
                <div>
                    <div class="font-semibold">${e.title||"Aviso de Design"}</div>
                    <div class="text-sm opacity-90">${e.message||"Problema não especificado."}</div>
                    ${e.recommendation?`<div class="text-xs opacity-70 mt-1"><em>Sugestão: ${e.recommendation}</em></div>`:""}
                </div>
            </div>
        `,a}}class ee{constructor(e){if(this.container=document.getElementById(e),!this.container){console.error(`CostDisplay: Container element with id '${e}' not found.`);return}console.log("💰 CostDisplay initialized")}update(e={}){if(!this.container)return;const t=e.developmentCost||0,a=e.unitProductionCost||0,i=e.costPerHour||0,s=e.lcc||{total:0,assumptions:{quantity:100,lifetimeHours:6e3}};this.container.innerHTML=`
            <div class="space-y-3 text-sm">
                ${this._createCostRow("Custo de P&D",t,"Custo único para desenvolver o protótipo e ferramental.")}
                ${this._createCostRow("Custo de Produção",a,"Custo para construir cada unidade da aeronave.")}
                ${this._createCostRow("Custo Operacional",i,"Custo estimado por hora de voo (combustível + manutenção).",!0)}
                <div class="pt-3 mt-3 border-t border-slate-700/50">
                    ${this._createCostRow("Custo de Ciclo de Vida (LCC)",s.total,`Custo total estimado para uma frota de ${s.assumptions.quantity} unidades voando ${s.assumptions.lifetimeHours} horas.`)}
                </div>
            </div>
        `}_createCostRow(e,t,a,i=!1){return`
            <div class="flex justify-between items-center" title="${a}">
                <span class="text-slate-400">${e}</span>
                <span class="font-semibold text-cyan-300">${this._formatCurrency(t)}${i?"/hr":""}</span>
            </div>
        `}_formatCurrency(e){return e>=1e9?`$${(e/1e9).toFixed(2)}B`:e>=1e6?`$${(e/1e6).toFixed(2)}M`:e>=1e3?`$${(e/1e3).toFixed(1)}K`:`$${e.toFixed(0)}`}}class te{constructor(){this.currentTab="category",this.dashboard=null,this.warningsDisplay=null,this.costDisplay=null,this.isInitialized=!1,this.loadingElement=document.getElementById("initial-loading"),this.statusElement=document.getElementById("loading-status"),window.templateInjector=new I}updateLoadingStatus(e){this.statusElement&&(this.statusElement.textContent=e)}async initialize(){try{if(this.updateLoadingStatus("Iniciando sistema de aeronaves..."),this.updateLoadingStatus("Carregando templates..."),window.progressiveLoader&&await window.progressiveLoader.loadAll(),this.updateLoadingStatus("Carregando componentes de aeronaves..."),window.loadAircraftComponents){if(!await window.loadAircraftComponents())throw new Error("Falha ao carregar componentes de aeronaves")}else if(console.warn("⚠️ loadAircraftComponents function not found - using fallback"),await new Promise(e=>setTimeout(e,1e3)),!window.AIRCRAFT_COMPONENTS||Object.keys(window.AIRCRAFT_COMPONENTS.airframes||{}).length===0)throw new Error("Componentes de aeronaves não foram carregados");this.updateLoadingStatus("Inicializando interface..."),this.initializeInterface(),this.setupTabNavigation(),this.dashboard=new Q("performance-radar"),this.warningsDisplay=new X("warnings-container","warnings-list"),this.costDisplay=new ee("cost-breakdown"),this.updateLoadingStatus("Carregando categorias..."),this.loadTabContent("category"),setTimeout(()=>{typeof window.updateAircraftCalculations=="function"&&window.updateAircraftCalculations()},200),setTimeout(()=>this.hideLoadingScreen(),500)}catch(e){console.error("❌ Initialization failed:",e),this.showInitializationError(e)}}hideLoadingScreen(){this.loadingElement&&(this.loadingElement.style.opacity="0",setTimeout(()=>{this.loadingElement.style.display="none"},300)),this.isInitialized=!0,console.log("✅ Aircraft Creator fully initialized")}showInitializationError(e){console.error("❌ Erro de inicialização:",e),this.statusElement&&(this.statusElement.innerHTML=`
            <div class="text-red-400 text-center">
              <div class="text-lg font-semibold mb-2">❌ Erro de Inicialização</div>
              <div class="text-sm">${e.message}</div>
              <button onclick="window.location.reload()" class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Recarregar Página
              </button>
            </div>
          `)}initializeInterface(){const e=localStorage.getItem("loggedCountry")||"Desconhecido",t=document.getElementById("current-country");t&&(t.textContent=e),window.currentAircraft||(window.currentAircraft={name:"Nova Aeronave",airframe:null,engine:null,weapons:[],avionics:[],supercharger:null,quantity:1}),this.setActiveTab("airframes")}setupTabNavigation(){document.querySelectorAll(".tab-button").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.tab;this.setActiveTab(a),this.loadTabContent(a)})})}setActiveTab(e){this.currentTab=e,document.querySelectorAll(".tab-button").forEach(a=>{a.classList.remove("border-cyan-500","text-cyan-300"),a.classList.add("border-transparent","text-slate-400")});const t=document.querySelector(`[data-tab="${e}"]`);t&&(t.classList.add("border-cyan-500","text-cyan-300"),t.classList.remove("border-transparent","text-slate-400"))}loadTabContent(e){const t=document.getElementById("tab-content");t&&(t.innerHTML='<div class="text-center py-8"><div class="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto"></div></div>',setTimeout(()=>{switch(e){case"category":this.loadCategoryTab();break;case"structure":this.loadStructureTab();break;case"cell":this.loadCellTab();break;case"wings":this.loadWingsTab();break;case"propulsion":this.loadPropulsionTab();break;case"supercharger":this.loadSuperchargerTab();break;case"weapons":this.loadWeaponsTab();break;case"avionics":this.loadAvionicsTab();break}},200))}loadWingsTab(){window.tabLoaders&&window.tabLoaders.loadWingsTab()}loadCellTab(){window.tabLoaders&&window.tabLoaders.loadCellTab()}loadPropulsionTab(){window.tabLoaders&&window.tabLoaders.loadPropulsionTab()}loadSuperchargerTab(){window.tabLoaders&&window.tabLoaders.loadSuperchargerTab()}loadWeaponsTab(){window.tabLoaders&&window.tabLoaders.loadWeaponsTab()}loadAvionicsTab(){window.tabLoaders&&window.tabLoaders.loadAvionicsTab()}loadCategoryTab(){window.tabLoaders&&window.tabLoaders.loadCategoryTab()}loadStructureTab(){window.tabLoaders&&window.tabLoaders.loadStructureTab()}}window.aircraftCreatorApp=new te;window.selectAirframe=function(c){if(!window.AIRCRAFT_COMPONENTS?.airframes[c]){console.error("Airframe not found:",c);return}window.currentAircraft.airframe=c,console.log("Selected airframe:",c),document.querySelectorAll(".airframe-card").forEach(t=>{t.classList.remove("selected","border-cyan-400","ring-1","ring-cyan-400/50"),t.classList.add("border-slate-700/50","bg-slate-800/40")});const e=document.querySelector(`[onclick="selectAirframe('${c}')"]`);e&&(e.classList.add("selected","border-cyan-400","ring-1","ring-cyan-400/50"),e.classList.remove("border-slate-700/50","bg-slate-800/40")),updateAircraftCalculations(),window.aircraftCreatorApp.currentTab==="engines"&&window.aircraftCreatorApp.loadEnginesTab()};window.selectAircraftEngine=function(c){if(!window.AIRCRAFT_COMPONENTS?.aircraft_engines[c]){console.error("Engine not found:",c);return}window.currentAircraft.engine=c,console.log("Selected engine:",c),document.querySelectorAll(".engine-card").forEach(t=>{t.classList.remove("selected","border-cyan-400","ring-1","ring-cyan-400/50"),t.classList.add("border-slate-700/50","bg-slate-800/40")});const e=document.querySelector(`[onclick="selectAircraftEngine('${c}')"]`);e&&(e.classList.add("selected","border-cyan-400","ring-1","ring-cyan-400/50"),e.classList.remove("border-slate-700/50","bg-slate-800/40")),updateAircraftCalculations()};window.toggleAircraftWeapon=function(c){window.currentAircraft.weapons||(window.currentAircraft.weapons=[]);const e=window.currentAircraft.weapons.indexOf(c);e>-1?window.currentAircraft.weapons.splice(e,1):window.currentAircraft.weapons.push(c),console.log("Weapon toggled:",c,"Current weapons:",window.currentAircraft.weapons),updateAircraftCalculations()};window.selectSupercharger=function(c){if(!window.AIRCRAFT_COMPONENTS?.superchargers[c]){console.error("Supercharger not found:",c);return}window.currentAircraft.supercharger=c,console.log("Selected supercharger:",c),document.querySelectorAll('.component-card[onclick*="selectSupercharger"]').forEach(a=>{a.classList.remove("selected","border-cyan-400","ring-1","ring-cyan-400/50","bg-cyan-900/20"),a.classList.add("border-slate-700/50","bg-slate-800/40")});const e=document.querySelector(`[onclick="selectSupercharger('${c}')"]`);e&&(e.classList.add("selected","border-cyan-400","ring-1","ring-cyan-400/50","bg-cyan-900/20"),e.classList.remove("border-slate-700/50","bg-slate-800/40"));const t=document.getElementById("selected-supercharger-name");t&&window.AIRCRAFT_COMPONENTS.superchargers[c]&&(t.textContent=window.AIRCRAFT_COMPONENTS.superchargers[c].name),window.tabLoaders&&typeof window.tabLoaders.updateSuperchargerImpact=="function"&&window.tabLoaders.updateSuperchargerImpact(),updateAircraftCalculations()};window.showTechRequirement=function(c,e,t){const a=e-t;alert(`${c} requer nível tecnológico ${e}.

Seu nível atual: ${t}
Necessário: +${a} pontos de tecnologia`)};window.calculateAircraftCosts=function(c=window.currentAircraft){return window.AircraftCostSystem?window.AircraftCostSystem.calculateCosts(c):{unitCost:0,maintenanceCostPerHour:0}};window.calculateAircraftCost=function(c=window.currentAircraft){return window.calculateAircraftCosts(c).unitCost||0};window.updateAircraftCalculations=function(){if(console.log("🔄 Updating aircraft calculations..."),!window.currentAircraft?.airframe){console.log("⚠️ No airframe selected - showing zero values"),_({totalWeight:0,maxSpeed:0,thrustToWeight:0}),window.aircraftCreatorApp.costDisplay&&window.aircraftCreatorApp.costDisplay.update();return}if(window.unifiedCalculationSystem){window.calculateAircraftComplete(window.currentAircraft,{includePerformance:!0,includeCosts:!0,includeCenterOfGravity:!0,includeValidation:!0}).then(c=>{console.log("✅ Unified calculations completed:",c),c.summary?.performance&&_({totalWeight:c.summary.balance?.totalMass||0,maxSpeed:c.summary.performance.maxSpeed||0,thrustToWeight:c.summary.performance.thrustToWeight||0,range:c.summary.performance.range||0}),c.costs&&window.aircraftCreatorApp.costDisplay&&window.aircraftCreatorApp.costDisplay.update(c.costs),window.aircraftCreatorApp.warningsDisplay&&window.aircraftCreatorApp.warningsDisplay.update(c.warnings,c.errors),window.aircraftCreatorApp.dashboard&&window.aircraftCreatorApp.dashboard.update(c)}).catch(c=>{console.error("❌ Unified calculation failed, falling back to legacy:",c),k()});return}k()};function k(){try{if(window.calculateAircraftPerformance){const c=window.calculateAircraftPerformance(window.currentAircraft);console.log("Performance calculated:",c),_(c);const e=document.getElementById("warnings-container"),t=document.getElementById("warnings-list");e&&t&&(c.warnings&&c.warnings.length>0?(t.innerHTML=c.warnings.map(a=>`<div class="text-sm">• ${a}</div>`).join(""),e.classList.remove("hidden")):(t.innerHTML="",e.classList.add("hidden"))),window.aircraftCreatorApp.dashboard&&window.aircraftCreatorApp.dashboard.update(window.currentAircraft)}if(window.AircraftCostSystem){const c=window.AircraftCostSystem.calculateCosts(window.currentAircraft);console.log("Costs calculated:",c),window.aircraftCreatorApp.costDisplay&&window.aircraftCreatorApp.costDisplay.update(c)}console.log("✅ Aircraft calculations updated successfully")}catch(c){console.error("❌ Error updating aircraft calculations:",c)}}function _(c){const e=document.getElementById("total-weight-display"),t=document.getElementById("max-speed-display"),a=document.getElementById("thrust-weight-ratio-display");if(e&&c.totalWeight&&(e.textContent=Math.round(c.totalWeight)+" kg"),t&&(c.maxSpeed||c.maxSpeedKph)){const s=c.maxSpeed||c.maxSpeedKph;t.textContent=Math.round(s)+" km/h"}a&&c.thrustToWeight&&(a.textContent=c.thrustToWeight.toFixed(2)+":1");const i=document.getElementById("flight-performance-analysis");i&&window.AircraftPerformanceSystem&&(i.innerHTML=window.AircraftPerformanceSystem.renderPerformanceDisplay(window.currentAircraft))}window.resetAircraft=function(){window.currentAircraft={name:"Nova Aeronave",airframe:null,engine:null,weapons:[],avionics:[],quantity:1},window.aircraftCreatorApp.loadTabContent(window.aircraftCreatorApp.currentTab),updateAircraftCalculations()};window.saveAircraftDesign=function(){console.log("Saving aircraft design:",window.currentAircraft),alert("Design salvo! (funcionalidade será implementada)")};window.showAircraftSummaryModal=function(){console.log("Showing aircraft summary modal"),alert("Modal da aeronave será implementado")};
