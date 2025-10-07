import"./modulepreload-polyfill-B5Qt9EMX.js";class g{constructor(){this.metrics={loadTimes:[],componentLoads:0,templateCacheHits:0,templateCacheMisses:0,errors:0,totalLoadTime:0,averageLoadTime:0,worstLoadTime:0,bestLoadTime:1/0},this.observers=[],this.startTime=performance.now(),this.isEnabled=!0,console.log("📊 PerformanceMonitor initialized")}recordLoad(e,t,r=!0){this.isEnabled&&(this.metrics.loadTimes.push({operation:e,duration:t,success:r,timestamp:Date.now()}),r?(this.metrics.totalLoadTime+=t,this.metrics.componentLoads++,t>this.metrics.worstLoadTime&&(this.metrics.worstLoadTime=t),t<this.metrics.bestLoadTime&&(this.metrics.bestLoadTime=t),this.metrics.averageLoadTime=this.metrics.totalLoadTime/this.metrics.componentLoads):this.metrics.errors++,this.notifyObservers("load",{operation:e,duration:t,success:r}))}recordCacheEvent(e,t){this.isEnabled&&(e==="hit"?this.metrics.templateCacheHits++:this.metrics.templateCacheMisses++,this.notifyObservers("cache",{type:e,operation:t}))}getPerformanceSummary(){const e=this.metrics.templateCacheHits+this.metrics.templateCacheMisses,t=e>0?(this.metrics.templateCacheHits/e*100).toFixed(1):0;return{uptime:`${((performance.now()-this.startTime)/1e3).toFixed(1)}s`,totalLoads:this.metrics.componentLoads,averageLoadTime:`${this.metrics.averageLoadTime.toFixed(2)}ms`,worstLoadTime:`${this.metrics.worstLoadTime.toFixed(2)}ms`,bestLoadTime:this.metrics.bestLoadTime===1/0?"0ms":`${this.metrics.bestLoadTime.toFixed(2)}ms`,cacheHitRate:`${t}%`,cacheHits:this.metrics.templateCacheHits,cacheMisses:this.metrics.templateCacheMisses,errors:this.metrics.errors,successRate:this.metrics.componentLoads>0?`${(this.metrics.componentLoads/(this.metrics.componentLoads+this.metrics.errors)*100).toFixed(1)}%`:"100%"}}logPerformanceSummary(){const e=this.getPerformanceSummary();console.group("📊 Performance Summary"),console.log(`⏱️  Uptime: ${e.uptime}`),console.log(`🔄 Total Loads: ${e.totalLoads}`),console.log(`⚡ Average Load Time: ${e.averageLoadTime}`),console.log(`🐌 Worst Load Time: ${e.worstLoadTime}`),console.log(`🚀 Best Load Time: ${e.bestLoadTime}`),console.log(`📋 Cache Hit Rate: ${e.cacheHitRate}`),console.log(`✅ Success Rate: ${e.successRate}`),e.errors>0&&console.warn(`❌ Errors: ${e.errors}`),console.groupEnd()}getLoadHistory(e=10){return this.metrics.loadTimes.slice(-e).map(t=>({operation:t.operation,duration:`${t.duration.toFixed(2)}ms`,success:t.success?"✅":"❌",timestamp:new Date(t.timestamp).toLocaleTimeString()}))}getRecommendations(){const e=[],t=this.getPerformanceSummary();parseFloat(t.cacheHitRate)<60&&e.push({type:"cache",priority:"high",message:`Cache hit rate is low (${t.cacheHitRate}). Consider preloading more templates.`}),parseFloat(t.averageLoadTime)>200&&e.push({type:"performance",priority:"medium",message:`Average load time is high (${t.averageLoadTime}). Consider optimizing component loading.`});const i=100-parseFloat(t.successRate);if(i>5&&e.push({type:"reliability",priority:"high",message:`Error rate is concerning (${i.toFixed(1)}%). Check network and component availability.`}),performance.memory){const c=performance.memory.usedJSHeapSize/1024/1024;c>50&&e.push({type:"memory",priority:"medium",message:`Memory usage is high (${c.toFixed(1)}MB). Consider clearing caches periodically.`})}return e}addObserver(e){this.observers.push(e)}removeObserver(e){this.observers=this.observers.filter(t=>t!==e)}notifyObservers(e,t){this.observers.forEach(r=>{try{r(e,t)}catch(s){console.warn("Performance observer error:",s)}})}startPeriodicReporting(e=60){setInterval(()=>{if(this.isEnabled){this.logPerformanceSummary();const t=this.getRecommendations();t.length>0&&(console.group("💡 Performance Recommendations"),t.forEach(r=>{const s=r.priority==="high"?"🔴":r.priority==="medium"?"🟡":"🟢";console.log(`${s} ${r.message}`)}),console.groupEnd())}},e*1e3)}setEnabled(e){this.isEnabled=e,console.log(`📊 Performance monitoring ${e?"enabled":"disabled"}`)}reset(){this.metrics={loadTimes:[],componentLoads:0,templateCacheHits:0,templateCacheMisses:0,errors:0,totalLoadTime:0,averageLoadTime:0,worstLoadTime:0,bestLoadTime:1/0},this.startTime=performance.now(),console.log("📊 Performance metrics reset")}}const m=new g;window.performanceMonitor=m;(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&m.startPeriodicReporting(120);class f{constructor(){this.templateCache=new Map,this.componentCache=new Map,this.loadingStates=new Map,this.pendingRequests=new Map,this.priorities=new Map,this.loadingQueue=[],this.maxConcurrentLoads=3,this.currentLoads=0,this.initialized=!1,this.performanceMetrics={templateLoads:0,cacheHits:0,loadTime:[],errors:0},this.updateTimers=new Map,console.log("🚀 OptimizedTemplateLoader initialized")}async initialize(){if(this.initialized)return;console.log("⚡ Initializing optimized template loader...");const e=["templates/aircraft-creator/airframes-tab.html","templates/aircraft-creator/engines-tab.html","templates/aircraft-creator/wings-tab.html"];try{await this.preloadTemplates(e),console.log("✅ Critical templates preloaded")}catch(t){console.warn("⚠️ Some critical templates failed to preload:",t)}this.initialized=!0,console.log("🎯 OptimizedTemplateLoader ready")}async preloadTemplates(e){const t=e.map(r=>this.loadTemplate(r,{priority:"low",cache:!0}));return Promise.allSettled(t)}async loadTemplate(e,t={}){const{priority:r="normal",cache:s=!0,force:i=!1,timeout:c=5e3}=t,p=performance.now();if(!i&&s&&this.templateCache.has(e))return this.performanceMetrics.cacheHits++,m.recordCacheEvent("hit",e),console.log(`📋 Template cache hit: ${e}`),this.templateCache.get(e);if(m.recordCacheEvent("miss",e),this.pendingRequests.has(e))return console.log(`⏳ Template already loading: ${e}`),this.pendingRequests.get(e);const h=this.performTemplateLoad(e,c);this.pendingRequests.set(e,h),this.priorities.set(e,r);try{const l=await h;s&&this.templateCache.set(e,l);const d=performance.now()-p;return this.performanceMetrics.templateLoads++,this.performanceMetrics.loadTime.push(d),m.recordLoad(`template:${e}`,d,!0),console.log(`✅ Template loaded: ${e} (${d.toFixed(2)}ms)`),l}catch(l){this.performanceMetrics.errors++;const d=performance.now()-p;throw m.recordLoad(`template:${e}`,d,!1),console.error(`❌ Template load failed: ${e}`,l),l}finally{this.pendingRequests.delete(e),this.priorities.delete(e)}}async performTemplateLoad(e,t){const r=new AbortController,s=setTimeout(()=>r.abort(),t);try{const i=await fetch(e,{signal:r.signal,cache:"force-cache"});if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const c=await i.text();return clearTimeout(s),c}catch(i){throw clearTimeout(s),i.name==="AbortError"?new Error(`Template load timeout: ${e}`):i}}async loadAndInjectTemplate(e,t,r={}){try{const s=document.getElementById(e);if(!s)throw new Error(`Container not found: ${e}`);this.showOptimizedLoadingState(s);const i=await this.loadTemplate(t,{priority:"high"}),c=this.processTemplate(i,r);return await this.injectWithTransitionAsync(s,c),c}catch(s){throw console.error(`❌ Template injection failed: ${t}`,s),this.showErrorState(e,s.message),s}}processTemplate(e,t){if(!t||Object.keys(t).length===0)return e;let r=e;for(const[s,i]of Object.entries(t)){const c=new RegExp(`{{\\s*${s}\\s*}}`,"g");r=r.replace(c,String(i))}return r}injectWithTransition(e,t){e.style.opacity="0.7",e.style.transition="opacity 0.15s ease",setTimeout(()=>{e.innerHTML=t,e.style.opacity="1",setTimeout(()=>{e.style.transition=""},150)},50)}async injectWithTransitionAsync(e,t){return new Promise(r=>{e.style.opacity="0.7",e.style.transition="opacity 0.15s ease",setTimeout(()=>{e.innerHTML=t,e.style.opacity="1",setTimeout(()=>{e.style.transition="",r()},150)},50)})}showOptimizedLoadingState(e,t="Carregando..."){e.innerHTML=`
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
        `}showErrorState(e,t){const r=document.getElementById(e);r&&(r.innerHTML=`
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
            `)}debouncedUpdate(e,t,r=100){this.updateTimers.has(e)&&clearTimeout(this.updateTimers.get(e));const s=setTimeout(()=>{t(),this.updateTimers.delete(e)},r);this.updateTimers.set(e,s)}async batchLoadComponents(e){const t=[];for(const r of e)this.componentCache.has(r)||t.push(this.loadComponentType(r));if(t.length===0){console.log("📋 All components cached, no loading needed");return}console.log(`🔄 Batch loading ${t.length} component types...`);try{await Promise.all(t),console.log("✅ Batch component loading completed")}catch(r){throw console.error("❌ Batch loading failed:",r),r}}async loadComponentType(e){if(this.componentCache.has(e))return this.componentCache.get(e);if(window.loadAircraftComponents)try{await window.loadAircraftComponents(),window.AIRCRAFT_COMPONENTS&&window.AIRCRAFT_COMPONENTS[e]&&(this.componentCache.set(e,window.AIRCRAFT_COMPONENTS[e]),console.log(`✅ Component type cached: ${e}`))}catch(t){throw console.error(`❌ Failed to load component type: ${e}`,t),t}}clearCaches(){console.log("🧹 Clearing template and component caches..."),this.templateCache.clear(),this.componentCache.clear(),this.loadingStates.clear();for(const e of this.updateTimers.values())clearTimeout(e);this.updateTimers.clear(),console.log("✅ Caches cleared")}getPerformanceMetrics(){const e=this.performanceMetrics.loadTime.length>0?this.performanceMetrics.loadTime.reduce((t,r)=>t+r)/this.performanceMetrics.loadTime.length:0;return{...this.performanceMetrics,avgLoadTime:e.toFixed(2),cacheHitRate:this.performanceMetrics.templateLoads>0?(this.performanceMetrics.cacheHits/(this.performanceMetrics.templateLoads+this.performanceMetrics.cacheHits)*100).toFixed(1):0}}logPerformanceMetrics(){const e=this.getPerformanceMetrics();console.log("📊 Template Loader Performance:",e)}}const n=new f;window.optimizedTemplateLoader=n;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{n.initialize()}):n.initialize();window.testTemplateLoading=async function(){a("🔄 Testando carregamento de templates...");try{const o=["templates/aircraft-creator/airframes-tab.html","templates/aircraft-creator/engines-tab.html","templates/aircraft-creator/wings-tab.html"];for(const e of o){const t=performance.now();await n.loadTemplate(e);const r=performance.now()-t;a(`✅ ${e} carregado em ${r.toFixed(2)}ms`)}a("✅ Todos os templates carregados com sucesso!"),updateMetrics()}catch(o){a(`❌ Erro no carregamento: ${o.message}`)}};window.testTemplateCaching=async function(){a("📋 Testando eficiência do cache...");try{const o="templates/aircraft-creator/airframes-tab.html",e=performance.now();await n.loadTemplate(o);const t=performance.now()-e;a(`✅ Template carregado do cache em ${t.toFixed(2)}ms`),updateMetrics()}catch(o){a(`❌ Erro no cache: ${o.message}`)}};window.testBatchLoading=async function(){a("📦 Testando carregamento em lote...");try{const o=["templates/aircraft-creator/avionics-tab.html","templates/aircraft-creator/weapons-tab.html","templates/aircraft-creator/special-equipment-tab.html"],e=performance.now(),t=o.map(s=>n.loadTemplate(s,{priority:"normal"}));await Promise.all(t);const r=performance.now()-e;a(`✅ ${o.length} templates carregados em paralelo em ${r.toFixed(2)}ms`),updateMetrics()}catch(o){a(`❌ Erro no carregamento em lote: ${o.message}`)}};window.clearTemplateCache=function(){n.clearCaches(),a("🧹 Cache de templates limpo"),updateMetrics()};window.testComponentLoading=async function(){a("🔄 Testando carregamento de componentes..."),window.loadAircraftComponents||(window.loadAircraftComponents=async function(){return new Promise(o=>{setTimeout(()=>{window.AIRCRAFT_COMPONENTS={airframes:{test:{name:"Test Airframe"}},aircraft_engines:{test:{name:"Test Engine"}},wing_types:{test:{name:"Test Wing"}}},o()},100)})});try{const o=performance.now();await window.loadAircraftComponents();const e=performance.now()-o;a(`✅ Componentes carregados em ${e.toFixed(2)}ms`),updateMetrics()}catch(o){a(`❌ Erro no carregamento de componentes: ${o.message}`)}};window.testAirframeTab=async function(){a("✈️ Testando aba de fuselagens...");try{const o=performance.now();await n.loadAndInjectTemplate("test-content","templates/aircraft-creator/airframes-tab.html");const e=performance.now()-o;a(`✅ Aba de fuselagens carregada em ${e.toFixed(2)}ms`),updateMetrics()}catch(o){a(`❌ Erro na aba de fuselagens: ${o.message}`)}};window.testEnginesTab=async function(){a("⚙️ Testando aba de motores...");try{const o=performance.now();await n.loadAndInjectTemplate("test-content","templates/aircraft-creator/engines-tab.html");const e=performance.now()-o;a(`✅ Aba de motores carregada em ${e.toFixed(2)}ms`),updateMetrics()}catch(o){a(`❌ Erro na aba de motores: ${o.message}`)}};window.testWingsTab=async function(){a("🛩️ Testando aba de asas...");try{const o=performance.now();await n.loadAndInjectTemplate("test-content","templates/aircraft-creator/wings-tab.html");const e=performance.now()-o;a(`✅ Aba de asas carregada em ${e.toFixed(2)}ms`),updateMetrics()}catch(o){a(`❌ Erro na aba de asas: ${o.message}`)}};window.updateMetrics=function(){const o=m.getPerformanceSummary();n.getPerformanceMetrics();const e=document.getElementById("metrics-display");e.innerHTML=`
                <div class="metric">
                    <div class="metric-value">${o.totalLoads}</div>
                    <div class="metric-label">Total de Carregamentos</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${o.averageLoadTime}</div>
                    <div class="metric-label">Tempo Médio</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${o.cacheHitRate}</div>
                    <div class="metric-label">Taxa de Cache Hit</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${o.successRate}</div>
                    <div class="metric-label">Taxa de Sucesso</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${o.uptime}</div>
                    <div class="metric-label">Tempo Ativo</div>
                </div>
                <div class="metric">
                    <div class="metric-value">${o.errors}</div>
                    <div class="metric-label">Erros</div>
                </div>
            `};window.showDetailedMetrics=function(){m.logPerformanceSummary(),n.logPerformanceMetrics();const o=m.getRecommendations();o.length>0?(a("💡 Recomendações de performance:"),o.forEach(e=>{a(`  • ${e.message}`)})):a("✅ Nenhuma recomendação de performance no momento")};window.resetMetrics=function(){m.reset(),n.clearCaches(),a("🔄 Métricas resetadas"),updateMetrics()};function a(o){const e=document.getElementById("system-log"),t=new Date().toLocaleTimeString();e.innerHTML+=`[${t}] ${o}
`,e.scrollTop=e.scrollHeight}a("🚀 Sistema de teste inicializado");updateMetrics();
