import{_ as y}from"./preload-helper-f85Crcwt.js";/* empty css                                 */import{auth as k,checkPlayerCountry as I,getCountryData as P,getGameConfig as R}from"./firebase-BN3MSMQD.js";import"./utils-DLoRv3re.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";class F{constructor(){this.entities=new Map,this.components=new Map,this.nextEntityId=1,this.systems=new Set,console.log("✈️ AircraftECS initialized")}createAircraft(){const e=this.nextEntityId++;return this.entities.set(e,new Set),console.log(`✨ Aircraft entity created: ${e}`),e}destroyAircraft(e){if(!this.entities.has(e)){console.warn(`⚠️ Attempted to destroy non-existent aircraft: ${e}`);return}const t=this.entities.get(e);for(const a of t)this.removeComponent(e,a);this.entities.delete(e),console.log(`🗑️ Aircraft entity destroyed: ${e}`)}addComponent(e,t,a){if(!this.entities.has(e))throw new Error(`Aircraft ${e} does not exist`);this.components.has(t)||this.components.set(t,new Map),this.components.get(t).set(e,a),this.entities.get(e).add(t),console.log(`🔧 Component '${t}' added to aircraft ${e}`)}removeComponent(e,t){if(!this.entities.has(e)){console.warn(`⚠️ Attempted to remove component from non-existent aircraft: ${e}`);return}this.components.has(t)&&(this.components.get(t).delete(e),this.entities.get(e).delete(t),console.log(`🔧 Component '${t}' removed from aircraft ${e}`))}getComponent(e,t){return this.components.has(t)&&this.components.get(t).get(e)||null}hasComponent(e,t){return this.entities.has(e)&&this.entities.get(e).has(t)}getAircraftWithComponents(...e){const t=[];for(const[a,s]of this.entities)e.every(r=>s.has(r))&&t.push(a);return t}getDebugInfo(){const e={};for(const[t,a]of this.components)e[t]=a.size;return{totalAircraft:this.entities.size,componentCounts:e,registeredSystems:Array.from(this.systems).map(t=>t.constructor.name)}}}const d=new F;window.aircraftECS=d;class O{constructor(){this.activeAircraftId=null,this.initialized=!1}initialize(){this.initialized||(this.createDefaultAircraft(),this.initialized=!0,console.log("✈️ AircraftEntity system initialized"))}createAircraft(e="Nova Aeronave"){const t=d.createAircraft();return d.addComponent(t,"Identity",{name:e,type:"aircraft",category:null,createdAt:Date.now(),lastModified:Date.now()}),d.addComponent(t,"Structure",{airframe:null,material:"aluminum",size:"medium",baseWeight:0,maxTakeoffWeight:0,centerOfGravity:{x:0,y:0,z:0}}),d.addComponent(t,"Propulsion",{engines:[],totalThrust:0,thrustToWeight:0,fuelCapacity:0,fuelConsumption:{idle:0,cruise:0,combat:0}}),d.addComponent(t,"Aerodynamics",{wings:{type:null,area:0,features:[]},clMax:0,cd0:0,liftToDrag:0}),d.addComponent(t,"Performance",{maxSpeed:0,cruiseSpeed:0,climbRate:0,serviceceiling:0,range:0,gLimit:0}),d.addComponent(t,"Armament",{hardpoints:[],weapons:[],maxWeaponLoad:0}),d.addComponent(t,"Avionics",{radar:null,irst:null,jammer:null,countermeasures:[]}),d.addComponent(t,"Economics",{developmentCost:0,unitCost:0,maintenanceCost:0,techLevel:0}),console.log(`✈️ Aircraft created: ${e} (ID: ${t})`),t}createDefaultAircraft(){this.activeAircraftId||(this.activeAircraftId=this.createAircraft(),console.log(`🎯 Default aircraft created: ${this.activeAircraftId}`))}setActiveAircraft(e){if(!d.entities.has(e))throw new Error(`Aircraft ${e} does not exist`);this.activeAircraftId=e,console.log(`🎯 Active aircraft set to: ${e}`)}getActiveAircraftId(){return this.activeAircraftId}getAircraftData(e=null){const t=e||this.activeAircraftId;return!t||!d.entities.has(t)?null:{id:t,identity:d.getComponent(t,"Identity"),structure:d.getComponent(t,"Structure"),propulsion:d.getComponent(t,"Propulsion"),aerodynamics:d.getComponent(t,"Aerodynamics"),performance:d.getComponent(t,"Performance"),armament:d.getComponent(t,"Armament"),avionics:d.getComponent(t,"Avionics"),economics:d.getComponent(t,"Economics")}}updateComponent(e,t,a){const s=d.getComponent(e,t);if(!s)throw new Error(`Component ${t} not found on aircraft ${e}`);const i={...s,...a};d.addComponent(e,t,i),this.updateLastModified(e),console.log(`🔧 Aircraft ${e} component '${t}' updated`)}updateLastModified(e){const t=d.getComponent(e,"Identity");if(t){const a={...t,lastModified:Date.now()};d.addComponent(e,"Identity",a)}}validateAircraft(e=null){const t=e||this.activeAircraftId,a=this.getAircraftData(t);if(!a)return{isValid:!1,errors:["Aircraft not found"]};const s=[],i=[];return a.structure?.airframe||s.push("Nenhuma fuselagem selecionada"),a.propulsion?.engines?.length||s.push("Nenhum motor selecionado"),a.aerodynamics?.wings?.type||s.push("Nenhum tipo de asa selecionado"),a.performance?.thrustToWeight<.3&&i.push("Relação empuxo/peso muito baixa"),{isValid:s.length===0,errors:s,warnings:i}}getAllAircraft(){return d.getAircraftWithComponents("Identity","Structure")}destroyAircraft(e){this.activeAircraftId===e&&(this.activeAircraftId=null),d.destroyAircraft(e),console.log(`🗑️ Aircraft destroyed: ${e}`)}}const m=new O;window.aircraftEntityManager=m;class N{constructor(){this.isInitialized=!1,this.legacyAircraftProxy=null,this.updating=!1,this.updateTimeout=null}initialize(){this.isInitialized||(m.initialize(),this.setupLegacyProxy(),this.setupLegacyFunctions(),this.isInitialized=!0,console.log("🔄 Legacy bridge initialized"))}setupLegacyProxy(){this.legacyAircraftProxy=new Proxy({},{get:(e,t)=>{const a=m.getAircraftData();if(!a)return this.getDefaultValue(t);switch(t){case"name":return a.identity?.name||"Nova Aeronave";case"airframe":return a.structure?.airframe||null;case"engine":return a.propulsion?.engines?.[0]||null;case"wings":return{type:a.aerodynamics?.wings?.type||null,features:a.aerodynamics?.wings?.features||[]};case"weapons":return a.armament?.weapons||[];case"avionics":return a.avionics||{};case"quantity":return a.economics?.quantity||1;default:return e[t]}},set:(e,t,a)=>{const s=m.getActiveAircraftId();if(!s)return console.warn("⚠️ No active aircraft to update"),!1;if(this.updating)return!0;try{switch(this.updating=!0,t){case"name":m.updateComponent(s,"Identity",{name:a});break;case"airframe":m.updateComponent(s,"Structure",{airframe:a});break;case"engine":m.updateComponent(s,"Propulsion",{engines:a?[a]:[]});break;case"wings":if(typeof a=="object"){const i=m.getAircraftData()?.aerodynamics?.wings||{};m.updateComponent(s,"Aerodynamics",{wings:{...i,...a}})}break;case"weapons":m.updateComponent(s,"Armament",{weapons:a});break;case"avionics":m.updateComponent(s,"Avionics",a);break;case"quantity":m.updateComponent(s,"Economics",{quantity:a});break;default:e[t]=a}return window.updateAircraftCalculations&&!this.updateTimeout&&(this.updateTimeout=setTimeout(()=>{window.updateAircraftCalculations&&window.updateAircraftCalculations(),this.updateTimeout=null},100)),!0}catch(i){return console.error(`❌ Error setting legacy property ${t}:`,i),!1}finally{this.updating=!1}}}),window.currentAircraft=this.legacyAircraftProxy,console.log("🔗 Legacy currentAircraft proxy established")}getDefaultValue(e){const t={name:"Nova Aeronave",airframe:null,engine:null,wings:{type:null,features:[]},weapons:[],avionics:{},quantity:1};return t[e]!==void 0?t[e]:null}setupLegacyFunctions(){const e=window.selectAirframe,t=window.selectAircraftEngine,a=window.toggleAircraftWeapon,s=window.updateAircraftCalculations;window.selectAirframe=i=>{e&&e(i);const r=m.getActiveAircraftId();r&&m.updateComponent(r,"Structure",{airframe:i}),console.log(`🛩️ Airframe selected via legacy bridge: ${i}`)},window.selectAircraftEngine=i=>{t&&t(i);const r=m.getActiveAircraftId();r&&m.updateComponent(r,"Propulsion",{engines:[i]}),console.log(`⚙️ Engine selected via legacy bridge: ${i}`)},window.toggleAircraftWeapon=i=>{a&&a(i);const r=m.getActiveAircraftId();if(r){const n=m.getAircraftData()?.armament?.weapons||[],l=n.indexOf(i);let c;l>-1?c=n.filter(p=>p!==i):c=[...n,i],m.updateComponent(r,"Armament",{weapons:c})}console.log(`💥 Weapon toggled via legacy bridge: ${i}`)},window.updateAircraftCalculations=()=>{s&&s(),console.log("📊 Aircraft calculations updated via legacy bridge")},window.getCurrentAircraft=()=>window.currentAircraft,window.getAircraftECSData=()=>m.getAircraftData(),console.log("🔗 Legacy functions bridged")}validateBridge(){try{if(!window.currentAircraft)throw new Error("currentAircraft proxy not available");return typeof window.currentAircraft.name!="string"&&console.warn("⚠️ currentAircraft.name not returning string, but bridge is functional"),typeof window.selectAirframe!="function"&&console.warn("⚠️ selectAirframe function not available"),typeof window.updateAircraftCalculations!="function"&&console.warn("⚠️ updateAircraftCalculations function not available"),console.log("✅ Legacy bridge validation passed"),!0}catch(e){return console.error("❌ Legacy bridge validation failed:",e),!1}}getActiveAircraftId(){return m.getActiveAircraftId()}createAircraft(e){return m.createAircraft(e)}}const C=new N;window.legacyBridge=C;class z{constructor(){this.metrics={loadTimes:[],componentLoads:0,templateCacheHits:0,templateCacheMisses:0,errors:0,totalLoadTime:0,averageLoadTime:0,worstLoadTime:0,bestLoadTime:1/0},this.observers=[],this.startTime=performance.now(),this.isEnabled=!0,console.log("📊 PerformanceMonitor initialized")}recordLoad(e,t,a=!0){this.isEnabled&&(this.metrics.loadTimes.push({operation:e,duration:t,success:a,timestamp:Date.now()}),a?(this.metrics.totalLoadTime+=t,this.metrics.componentLoads++,t>this.metrics.worstLoadTime&&(this.metrics.worstLoadTime=t),t<this.metrics.bestLoadTime&&(this.metrics.bestLoadTime=t),this.metrics.averageLoadTime=this.metrics.totalLoadTime/this.metrics.componentLoads):this.metrics.errors++,this.notifyObservers("load",{operation:e,duration:t,success:a}))}recordCacheEvent(e,t){this.isEnabled&&(e==="hit"?this.metrics.templateCacheHits++:this.metrics.templateCacheMisses++,this.notifyObservers("cache",{type:e,operation:t}))}getPerformanceSummary(){const e=this.metrics.templateCacheHits+this.metrics.templateCacheMisses,t=e>0?(this.metrics.templateCacheHits/e*100).toFixed(1):0;return{uptime:`${((performance.now()-this.startTime)/1e3).toFixed(1)}s`,totalLoads:this.metrics.componentLoads,averageLoadTime:`${this.metrics.averageLoadTime.toFixed(2)}ms`,worstLoadTime:`${this.metrics.worstLoadTime.toFixed(2)}ms`,bestLoadTime:this.metrics.bestLoadTime===1/0?"0ms":`${this.metrics.bestLoadTime.toFixed(2)}ms`,cacheHitRate:`${t}%`,cacheHits:this.metrics.templateCacheHits,cacheMisses:this.metrics.templateCacheMisses,errors:this.metrics.errors,successRate:this.metrics.componentLoads>0?`${(this.metrics.componentLoads/(this.metrics.componentLoads+this.metrics.errors)*100).toFixed(1)}%`:"100%"}}logPerformanceSummary(){const e=this.getPerformanceSummary();console.group("📊 Performance Summary"),console.log(`⏱️  Uptime: ${e.uptime}`),console.log(`🔄 Total Loads: ${e.totalLoads}`),console.log(`⚡ Average Load Time: ${e.averageLoadTime}`),console.log(`🐌 Worst Load Time: ${e.worstLoadTime}`),console.log(`🚀 Best Load Time: ${e.bestLoadTime}`),console.log(`📋 Cache Hit Rate: ${e.cacheHitRate}`),console.log(`✅ Success Rate: ${e.successRate}`),e.errors>0&&console.warn(`❌ Errors: ${e.errors}`),console.groupEnd()}getLoadHistory(e=10){return this.metrics.loadTimes.slice(-e).map(t=>({operation:t.operation,duration:`${t.duration.toFixed(2)}ms`,success:t.success?"✅":"❌",timestamp:new Date(t.timestamp).toLocaleTimeString()}))}getRecommendations(){const e=[],t=this.getPerformanceSummary();parseFloat(t.cacheHitRate)<60&&e.push({type:"cache",priority:"high",message:`Cache hit rate is low (${t.cacheHitRate}). Consider preloading more templates.`}),parseFloat(t.averageLoadTime)>200&&e.push({type:"performance",priority:"medium",message:`Average load time is high (${t.averageLoadTime}). Consider optimizing component loading.`});const i=100-parseFloat(t.successRate);if(i>5&&e.push({type:"reliability",priority:"high",message:`Error rate is concerning (${i.toFixed(1)}%). Check network and component availability.`}),performance.memory){const r=performance.memory.usedJSHeapSize/1024/1024;r>50&&e.push({type:"memory",priority:"medium",message:`Memory usage is high (${r.toFixed(1)}MB). Consider clearing caches periodically.`})}return e}addObserver(e){this.observers.push(e)}removeObserver(e){this.observers=this.observers.filter(t=>t!==e)}notifyObservers(e,t){this.observers.forEach(a=>{try{a(e,t)}catch(s){console.warn("Performance observer error:",s)}})}startPeriodicReporting(e=60){setInterval(()=>{if(this.isEnabled){this.logPerformanceSummary();const t=this.getRecommendations();t.length>0&&(console.group("💡 Performance Recommendations"),t.forEach(a=>{const s=a.priority==="high"?"🔴":a.priority==="medium"?"🟡":"🟢";console.log(`${s} ${a.message}`)}),console.groupEnd())}},e*1e3)}setEnabled(e){this.isEnabled=e,console.log(`📊 Performance monitoring ${e?"enabled":"disabled"}`)}reset(){this.metrics={loadTimes:[],componentLoads:0,templateCacheHits:0,templateCacheMisses:0,errors:0,totalLoadTime:0,averageLoadTime:0,worstLoadTime:0,bestLoadTime:1/0},this.startTime=performance.now(),console.log("📊 Performance metrics reset")}}const T=new z;window.performanceMonitor=T;(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1")&&T.startPeriodicReporting(120);class W{constructor(){this.templateCache=new Map,this.componentCache=new Map,this.loadingStates=new Map,this.pendingRequests=new Map,this.priorities=new Map,this.loadingQueue=[],this.maxConcurrentLoads=3,this.currentLoads=0,this.initialized=!1,this.performanceMetrics={templateLoads:0,cacheHits:0,loadTime:[],errors:0},this.updateTimers=new Map,console.log("🚀 OptimizedTemplateLoader initialized")}async initialize(){if(this.initialized)return;console.log("⚡ Initializing optimized template loader...");const e=["templates/aircraft-creator/airframes-tab.html","templates/aircraft-creator/engines-tab.html","templates/aircraft-creator/wings-tab.html"];try{await this.preloadTemplates(e),console.log("✅ Critical templates preloaded")}catch(t){console.warn("⚠️ Some critical templates failed to preload:",t)}this.initialized=!0,console.log("🎯 OptimizedTemplateLoader ready")}async preloadTemplates(e){const t=e.map(a=>this.loadTemplate(a,{priority:"low",cache:!0}));return Promise.allSettled(t)}async loadTemplate(e,t={}){const{priority:a="normal",cache:s=!0,force:i=!1,timeout:r=5e3}=t,o=performance.now();if(!i&&s&&this.templateCache.has(e))return this.performanceMetrics.cacheHits++,T.recordCacheEvent("hit",e),console.log(`📋 Template cache hit: ${e}`),this.templateCache.get(e);if(T.recordCacheEvent("miss",e),this.pendingRequests.has(e))return console.log(`⏳ Template already loading: ${e}`),this.pendingRequests.get(e);const n=this.performTemplateLoad(e,r);this.pendingRequests.set(e,n),this.priorities.set(e,a);try{const l=await n;s&&this.templateCache.set(e,l);const c=performance.now()-o;return this.performanceMetrics.templateLoads++,this.performanceMetrics.loadTime.push(c),T.recordLoad(`template:${e}`,c,!0),console.log(`✅ Template loaded: ${e} (${c.toFixed(2)}ms)`),l}catch(l){this.performanceMetrics.errors++;const c=performance.now()-o;throw T.recordLoad(`template:${e}`,c,!1),console.error(`❌ Template load failed: ${e}`,l),l}finally{this.pendingRequests.delete(e),this.priorities.delete(e)}}async performTemplateLoad(e,t){const a=new AbortController,s=setTimeout(()=>a.abort(),t);try{const i=await fetch(e,{signal:a.signal,cache:"force-cache"});if(!i.ok)throw new Error(`HTTP ${i.status}: ${i.statusText}`);const r=await i.text();return clearTimeout(s),r}catch(i){throw clearTimeout(s),i.name==="AbortError"?new Error(`Template load timeout: ${e}`):i}}async loadAndInjectTemplate(e,t,a={}){try{const s=document.getElementById(e);if(!s)throw new Error(`Container not found: ${e}`);this.showOptimizedLoadingState(s);const i=await this.loadTemplate(t,{priority:"high"}),r=this.processTemplate(i,a);return await this.injectWithTransitionAsync(s,r),r}catch(s){throw console.error(`❌ Template injection failed: ${t}`,s),this.showErrorState(e,s.message),s}}processTemplate(e,t){if(!t||Object.keys(t).length===0)return e;let a=e;for(const[s,i]of Object.entries(t)){const r=new RegExp(`{{\\s*${s}\\s*}}`,"g");a=a.replace(r,String(i))}return a}injectWithTransition(e,t){e.style.opacity="0.7",e.style.transition="opacity 0.15s ease",setTimeout(()=>{e.innerHTML=t,e.style.opacity="1",setTimeout(()=>{e.style.transition=""},150)},50)}async injectWithTransitionAsync(e,t){return new Promise(a=>{e.style.opacity="0.7",e.style.transition="opacity 0.15s ease",setTimeout(()=>{e.innerHTML=t,e.style.opacity="1",setTimeout(()=>{e.style.transition="",a()},150)},50)})}showOptimizedLoadingState(e,t="Carregando..."){e.innerHTML=`
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
            `)}debouncedUpdate(e,t,a=100){this.updateTimers.has(e)&&clearTimeout(this.updateTimers.get(e));const s=setTimeout(()=>{t(),this.updateTimers.delete(e)},a);this.updateTimers.set(e,s)}async batchLoadComponents(e){const t=[];for(const a of e)this.componentCache.has(a)||t.push(this.loadComponentType(a));if(t.length===0){console.log("📋 All components cached, no loading needed");return}console.log(`🔄 Batch loading ${t.length} component types...`);try{await Promise.all(t),console.log("✅ Batch component loading completed")}catch(a){throw console.error("❌ Batch loading failed:",a),a}}async loadComponentType(e){if(this.componentCache.has(e))return this.componentCache.get(e);if(window.loadAircraftComponents)try{await window.loadAircraftComponents(),window.AIRCRAFT_COMPONENTS&&window.AIRCRAFT_COMPONENTS[e]&&(this.componentCache.set(e,window.AIRCRAFT_COMPONENTS[e]),console.log(`✅ Component type cached: ${e}`))}catch(t){throw console.error(`❌ Failed to load component type: ${e}`,t),t}}clearCaches(){console.log("🧹 Clearing template and component caches..."),this.templateCache.clear(),this.componentCache.clear(),this.loadingStates.clear();for(const e of this.updateTimers.values())clearTimeout(e);this.updateTimers.clear(),console.log("✅ Caches cleared")}getPerformanceMetrics(){const e=this.performanceMetrics.loadTime.length>0?this.performanceMetrics.loadTime.reduce((t,a)=>t+a)/this.performanceMetrics.loadTime.length:0;return{...this.performanceMetrics,avgLoadTime:e.toFixed(2),cacheHitRate:this.performanceMetrics.templateLoads>0?(this.performanceMetrics.cacheHits/(this.performanceMetrics.templateLoads+this.performanceMetrics.cacheHits)*100).toFixed(1):0}}logPerformanceMetrics(){const e=this.getPerformanceMetrics();console.log("📊 Template Loader Performance:",e)}}const x=new W;window.optimizedTemplateLoader=x;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{x.initialize()}):x.initialize();class j{constructor(){this.tabContent=null,this.currentTechLevel=50,this.loadingCache=new Map,this.componentLoadPromise=null}getTabContent(){return this.tabContent||(this.tabContent=document.getElementById("tab-content")),this.tabContent}showLoadingState(e="Carregando componentes..."){const t=this.getTabContent();t&&x.showOptimizedLoadingState(t,e)}showEmptyState(e){const t=this.getTabContent();t&&(t.innerHTML=`<div class="text-center text-slate-500 p-8">${e}</div>`)}updateTechLevel(){window.currentUserCountry&&typeof window.currentUserCountry.aircraftTech<"u"?(this.currentTechLevel=window.currentUserCountry.aircraftTech,console.log(`✅ Tech level successfully set to: ${this.currentTechLevel} for country: ${window.currentUserCountry.Pais}`)):(this.currentTechLevel=50,console.warn(`⚠️ Could not determine user country tech level. Using default: ${this.currentTechLevel}`))}filterAvailableComponents(e){const t={},a=window.currentUserCountry?.year||1954;for(const[s,i]of Object.entries(e)){const r=i.tech_level||0,o=i.year_introduced||1945,n=this.currentTechLevel>=r,l=a>=o;n&&l&&(t[s]=i)}return t}getComponentStatusClass(e){const t=e.tech_level||0;return this.currentTechLevel>=t?"available":"locked"}getComponentAvailabilityInfo(e){const t=e.tech_level||0;return{isAvailable:this.currentTechLevel>=t,requiredTech:t,currentTech:this.currentTechLevel,missingTech:Math.max(0,t-this.currentTechLevel)}}loadCategoryTab(){console.log("🔄 Loading Category Selection Tab...");const e=this.createCategorySelectionInterface();this.getTabContent().innerHTML=e,this.initializeCategoryControls()}createCategorySelectionInterface(){return`
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
    `}initializeCategoryControls(){let e=null;const t=document.querySelectorAll(".category-option"),a=document.getElementById("selected-category-info"),s=document.getElementById("selected-category-name"),i=document.getElementById("category-description"),r=document.getElementById("continue-to-cell-btn");t.forEach(n=>{n.addEventListener("click",()=>{t.forEach(l=>l.classList.remove("selected")),n.classList.add("selected"),e=n.dataset.category,this.updateCategoryInfo(e,s,i,a),window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.category=e})}),r&&r.addEventListener("click",()=>{const n=document.querySelector('[data-tab="cell"]');n&&n.click()});const o=document.querySelector('[data-category="fighter"]');o&&o.click()}updateCategoryInfo(e,t,a,s){const r={fighter:{name:"Caça",description:"Aeronaves de combate projetadas para domínio aéreo. Priorizam velocidade, manobrabilidade e capacidade de combate ar-ar. Ideais para interceptação e superioridade aérea."},bomber:{name:"Bombardeiro",description:"Aeronaves pesadas focadas em bombardeio estratégico e tático. Grande capacidade de carga de bombas e longo alcance, mas com menor agilidade."},transport:{name:"Transporte",description:"Aeronaves versáteis para transporte de tropas, equipamentos e suprimentos. Focam em capacidade de carga e alcance em vez de performance de combate."},helicopter:{name:"Helicóptero",description:"Aeronaves de asas rotativas para missões especiais e suporte. Capacidade de decolagem e pouso vertical, hover e operação em baixa altitude."},attack:{name:"Ataque ao Solo",description:"Aeronaves especializadas em apoio aéreo aproximado e ataque a alvos terrestres. Balanceiam armamento, proteção e manobrabilidade."},experimental:{name:"Experimental",description:"Projetos avançados e protótipos que testam novas tecnologias. Oferece capacidades únicas mas com custos elevados e confiabilidade questionável."}}[e];t.textContent=r.name,a.textContent=r.description,s.classList.remove("hidden")}loadStructureTab(){console.log("🔄 Loading Structure & Materials Tab..."),this.updateTechLevel();const e=this.createSimplifiedStructureInterface();this.getTabContent().innerHTML=e,this.initializeSimpleStructureControls()}createSimplifiedStructureInterface(){return`
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
    `}initializeSimpleStructureControls(){let e="aluminum";const t=document.querySelectorAll(".material-option"),a=document.getElementById("selected-material-info"),s=document.getElementById("selected-material-name"),i=document.getElementById("material-effects");t.forEach(o=>{o.addEventListener("click",()=>{t.forEach(n=>n.classList.remove("selected")),o.classList.add("selected"),e=o.dataset.material,this.updateMaterialInfo(e,s,i,a),window.currentAircraft.structure||(window.currentAircraft.structure={}),window.currentAircraft.structure.material=e,this.updateStructureCalculations(e)})});const r=document.querySelector('[data-material="aluminum"]');r?r.click():setTimeout(()=>{const o=document.querySelector('[data-material="aluminum"]');o&&o.click()},100)}updateMaterialInfo(e,t,a,s){const r={aluminum:{name:"Alumínio",effects:["Custo base padrão (100%)","Peso estrutural normal","Manutenção padrão","Resistência à corrosão boa"]},steel:{name:"Aço",effects:["Custo reduzido (-20%)","Peso estrutural aumentado (+30%)","Durabilidade aumentada (+50%)","Manutenção reduzida (-10%)"]},composite:{name:"Compósito",effects:["Custo elevado (+80%)","Peso estrutural reduzido (-25%)","Assinatura radar reduzida (-30%)","Requer tech level 70+"]}}[e];t.textContent=r.name,a.innerHTML=r.effects.map(o=>`<div class="flex items-center gap-2"><span class="text-cyan-400">•</span>${o}</div>`).join(""),s.classList.remove("hidden")}updateStructureCalculations(e){const a={aluminum:{weightModifier:1,costModifier:1,cgOffset:0},steel:{weightModifier:1.3,costModifier:.8,cgOffset:-.02},composite:{weightModifier:.75,costModifier:1.8,cgOffset:.01}}[e],s=window.currentAircraft?.airframe?.base_weight||window.currentAircraft?.selectedAirframe?.base_weight||1800,i=window.currentAircraft?.engine?.weight||window.currentAircraft?.selectedEngine?.weight||800,r=window.currentAircraft?.fuel_capacity||window.currentAircraft?.selectedAirframe?.internal_fuel_kg||450,o=window.currentAircraft?.weapons?.total_weight||150;console.log("🔄 Structure calculations:",{material:e,baseAirframeWeight:s,baseEngineWeight:i,baseFuelWeight:r,baseWeaponsWeight:o,modifiers:a});const n=Math.round(s*a.weightModifier),l=n+i+r+o,p=Math.max(25,Math.min(65,45+a.cgOffset*100));this.updateDisplayValues({airframeWeight:n,engineWeight:i,fuelWeight:r,weaponsWeight:o,totalWeight:l,cgPosition:p}),window.currentAircraft.calculatedValues||(window.currentAircraft.calculatedValues={}),window.currentAircraft.calculatedValues.totalWeight=l,window.currentAircraft.calculatedValues.cgPosition=p,window.currentAircraft.calculatedValues.airframeWeight=n}updateDisplayValues(e){const t=document.getElementById("mass-airframe"),a=document.getElementById("mass-engine"),s=document.getElementById("mass-fuel"),i=document.getElementById("mass-weapons"),r=document.getElementById("mass-total");t&&(t.textContent=`${e.airframeWeight} kg`),a&&(a.textContent=`${e.engineWeight} kg`),s&&(s.textContent=`${e.fuelWeight} kg`),i&&(i.textContent=`${e.weaponsWeight} kg`),r&&(r.textContent=`${e.totalWeight} kg`);const o=document.getElementById("cg-position"),n=document.getElementById("cg-total-mass"),l=document.getElementById("cg-indicator");if(o&&(o.textContent=`${e.cgPosition.toFixed(1)}% MAC`),n&&(n.textContent=`${e.totalWeight} kg`),l){const c=Math.max(0,Math.min(96,e.cgPosition/100*96));l.style.left=`${c}%`,e.cgPosition<30||e.cgPosition>60?l.style.background="#ef4444":e.cgPosition<35||e.cgPosition>55?l.style.background="#f59e0b":l.style.background="#10b981"}typeof window.updateWeightDisplay=="function"&&window.updateWeightDisplay(e.totalWeight)}loadCellTab(){console.log("🔄 Loading Cell Tab (Airframes)...");const e=this.createSimplifiedAirframeInterface();this.getTabContent().innerHTML=e,this.initializeSimpleAirframeControls(),this.restoreAirframeSelection()}createSimplifiedAirframeInterface(){const e=window.currentAircraft?.category||"fighter";return`
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
    `}initializeSimpleAirframeControls(){let e=null;const t=document.querySelectorAll(".airframe-option"),a=document.getElementById("selected-airframe-info"),s=document.getElementById("selected-airframe-name"),i=document.getElementById("airframe-specs"),r=document.getElementById("airframe-characteristics");t.forEach(o=>{o.addEventListener("click",()=>{t.forEach(n=>n.classList.remove("selected")),o.classList.add("selected"),e=o.dataset.airframe,this.updateAirframeInfo(e,s,i,r,a),window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.selectedAirframe=this.getAirframeData(e),window.currentAircraft.airframeType=e,window.currentAircraft.airframe=e,typeof this.updateStructureCalculations=="function"&&this.updateStructureCalculations(window.currentAircraft.structure?.material||"aluminum"),console.log(`✅ Airframe selected: ${e}`)})})}restoreAirframeSelection(){const e=window.currentAircraft?.airframe||window.currentAircraft?.airframeType;if(e){console.log(`🔄 Restoring airframe selection: ${e}`);const t=document.querySelector(`[data-airframe="${e}"]`);if(t){document.querySelectorAll(".airframe-option").forEach(o=>o.classList.remove("selected")),t.classList.add("selected");const a=document.getElementById("selected-airframe-info"),s=document.getElementById("selected-airframe-name"),i=document.getElementById("airframe-specs"),r=document.getElementById("airframe-characteristics");this.updateAirframeInfo(e,s,i,r,a),console.log(`✅ Airframe selection restored: ${e}`)}else console.warn(`⚠️ Could not find airframe option for: ${e}`)}else console.log("ℹ️ No previous airframe selection to restore")}getAirframeData(e){const t={light_fighter:{name:"Caça Leve",base_weight:1800,max_takeoff_weight:3200,g_limit:9,hardpoints:2,internal_fuel_kg:450,advantages:["Excelente manobrabilidade","Baixo custo","Leve"],disadvantages:["Armamento limitado","Alcance curto"]},early_jet_fighter:{name:"Caça a Jato Inicial",base_weight:2200,max_takeoff_weight:4e3,g_limit:8,hardpoints:4,internal_fuel_kg:600,advantages:["Boa velocidade","Moderadamente ágil"],disadvantages:["Consumo alto","Tecnologia inicial"]},multirole_fighter:{name:"Caça Multifunção",base_weight:2800,max_takeoff_weight:5500,g_limit:7.5,hardpoints:6,internal_fuel_kg:800,advantages:["Versátil","Bom alcance","Múltiplas missões"],disadvantages:["Peso médio","Custo elevado"]},heavy_fighter:{name:"Caça Pesado",base_weight:3500,max_takeoff_weight:7e3,g_limit:6,hardpoints:8,internal_fuel_kg:1200,advantages:["Alta capacidade","Muito resistente","Longo alcance"],disadvantages:["Pouco ágil","Caro","Pesado"]},light_bomber:{name:"Bombardeiro Leve",base_weight:4200,max_takeoff_weight:8500,g_limit:5,hardpoints:12,internal_fuel_kg:1800,advantages:["Grande capacidade de bombas","Excelente alcance"],disadvantages:["Muito lento","Vulnerável","Pouco ágil"]},transport:{name:"Transporte",base_weight:5800,max_takeoff_weight:12e3,g_limit:4,hardpoints:2,internal_fuel_kg:2500,advantages:["Enorme capacidade","Excelente alcance","Múltiplas configurações"],disadvantages:["Muito lento","Vulnerável","Caro"]}};return t[e]||t.light_fighter}updateAirframeInfo(e,t,a,s,i){const r=this.getAirframeData(e);t.textContent=r.name,a.innerHTML=`
      <div class="flex justify-between"><span>Peso Base:</span><span>${r.base_weight} kg</span></div>
      <div class="flex justify-between"><span>Peso Máx Decolagem:</span><span>${r.max_takeoff_weight} kg</span></div>
      <div class="flex justify-between"><span>Limite G:</span><span>${r.g_limit}G</span></div>
      <div class="flex justify-between"><span>Hardpoints:</span><span>${r.hardpoints}</span></div>
      <div class="flex justify-between"><span>Combustível Interno:</span><span>${r.internal_fuel_kg} kg</span></div>
    `,s.innerHTML=`
      <div>
        <h5 class="text-green-400 font-medium mb-1">Vantagens:</h5>
        ${r.advantages.map(o=>`<div class="flex items-center gap-2"><span class="text-green-400">•</span>${o}</div>`).join("")}
      </div>
      <div class="mt-3">
        <h5 class="text-red-400 font-medium mb-1">Desvantagens:</h5>
        ${r.disadvantages.map(o=>`<div class="flex items-center gap-2"><span class="text-red-400">•</span>${o}</div>`).join("")}
      </div>
    `,i.classList.remove("hidden")}async loadAirframeTab(){if(console.log("🔄 Loading Airframe Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.airframes){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load..."),this.showLoadingState("Carregando componentes de aeronaves...");try{await this.ensureComponentsLoaded(["airframes"]),console.log("✅ Components loaded, retrying..."),this.loadAirframeTab()}catch(r){console.error("❌ Failed to load components:",r),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}return}this.updateTechLevel();const e=window.AIRCRAFT_COMPONENTS?.airframes||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhuma fuselagem disponível.");console.log(`📊 Found ${t.length} airframes in data`);const a=this.filterAvailableComponents(e);console.log(`🔬 Airframes: ${Object.keys(a).length} available out of ${t.length} total`);const s=this.organizeTechFamilies(e),i=this.renderTechTreeInterface(s,e);this.getTabContent().innerHTML=i,this.setupTechTreeTabs(s)}renderTechTreeInterface(e){return`
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
    `}organizeTechFamilies(e){const t={fighters:{label:"Caças",items:[]},bombers:{label:"Bombardeiros",items:[]},attackers:{label:"Aeronaves de Ataque",items:[]},transports:{label:"Transportes",items:[]},helicopters:{label:"Helicópteros",items:[]}};return Object.entries(e).forEach(([a,s])=>{if(!this.isAvailable(s))return;const i=s.tech_tree||"fighters";t[i]&&t[i].items.push({id:a,...s})}),Object.values(t).forEach(a=>{a.items.sort((s,i)=>(s.year_introduced||0)-(i.year_introduced||0))}),t}loadTechTimeline(e,t){const a=t[e];if(!a||a.items.length===0){const n=this.getTabContent().querySelector("#tech-timeline");n&&(n.innerHTML='<div class="text-center py-8 text-slate-400">Nenhuma aeronave disponível nesta categoria.</div>');return}const s=this.renderTechTimelineContent(e,t),r=this.getTabContent().querySelector("#tech-timeline");r&&(r.innerHTML=s)}renderTechTimelineContent(e,t){const a=t[e];if(!a||a.items.length===0)return'<div class="text-center py-8 text-slate-400">Nenhuma aeronave disponível nesta categoria.</div>';let s="";return a.items.forEach((i,r)=>{const o=r%2===0?"left":"right",n=this.getDecadeLabel(i.year_introduced);s+=this.renderTimelineItem(i,o,n,r)}),s}renderTimelineItem(e,t,a,s){const i=window.currentAircraft?.airframe===e.id,r=this.generateTechTags(e),o=this.generateMetaData(e),n=this.isHighlightNode(e);return`
      <div class="relative">
        <!-- Decade Tick -->
        <div class="decade-tick">
          <span>${a}</span>
        </div>
        
        <!-- Timeline Item -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6">
          ${t==="left"?`
            <div class="timeline-node-card left ${i?"selected":""} ${n?"highlight":""}" 
                 onclick="selectAirframe('${e.id}')" data-airframe-id="${e.id}">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base sm:text-lg font-semibold text-slate-100 leading-tight">${e.name}</h3>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    ${r.join("")}
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
            <div class="timeline-node-card right ${i?"selected":""} ${n?"highlight":""}" 
                 onclick="selectAirframe('${e.id}')" data-airframe-id="${e.id}">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base sm:text-lg font-semibold text-slate-100 leading-tight">${e.name}</h3>
                  <div class="mt-1.5 flex flex-wrap gap-1.5">
                    ${r.join("")}
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
    `}generateTechTags(e){const t=[];return e.tech_era==="piston"?t.push('<span class="tag-piston">Pistão</span>'):e.max_speed_kph>=1200?t.push('<span class="tag-supersonic">Supersônico</span>'):(e.tech_era?.includes("jet")||e.max_speed_kph>=800)&&t.push('<span class="tag-subsonic">Sub/Transônico</span>'),(e.category==="helicopter"||e.role==="reconnaissance")&&t.push('<span class="tag-special">Especializado</span>'),t}generateMetaData(e){return[{k:"Vel Máx",v:`${Math.round(e.max_speed_kph||0)} km/h`},{k:"G-Limit",v:`${e.g_limit||0}`},{k:"Peso",v:`${Math.round((e.base_weight||0)/1e3)} t`},{k:"Ano",v:`${e.year_introduced||"?"}`}]}getDecadeLabel(e){return e>=1945&&e<=1950?"1945–50":e>=1950&&e<=1954?"1950–54":e>=1954&&e<=1958?"1954–58":e>=1958&&e<=1962?"1958–62":`${e}`}isHighlightNode(e){return e.tech_level>=65||e.max_speed_kph>=1400}hasPrerequisites(e){return!1}setupTechTreeTabs(e){const t=document.querySelectorAll(".tech-tree-tab");t.forEach(a=>{a.addEventListener("click",s=>{t.forEach(r=>r.classList.remove("active")),a.classList.add("active");const i=a.dataset.tree;this.loadTechTimeline(i,e)})})}renderAirframeCard(e,t){const a=window.currentAircraft?.airframe===e,s=t.max_speed_kph||0,i=t.base_weight||0,r=t.max_takeoff_weight||0,o=this.getComponentAvailabilityInfo(t);this.getComponentStatusClass(t);const n=a?"selected border-brand-400 ring-1 ring-brand-400/50":"border-slate-700/50 bg-slate-800/40",l=o.isAvailable?"":"opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10",c=o.isAvailable?`onclick="selectAirframe('${e}')"`:`onclick="showTechRequirement('${t.name}', ${o.requiredTech}, ${o.currentTech})"`;return`
      <button class="airframe-card component-card relative w-full text-left rounded-2xl p-4 border transition ${n} ${l}" ${c}>
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-base font-semibold text-slate-100">${t.name}</h4>
          <span class="px-2 py-0.5 text-xs rounded-lg text-white ${s>=1200?"bg-red-600":"bg-blue-600"}">${s>=1200?"Supersônico":"Sub- ou Transônico"}</span>
        </div>
        <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div>Base: <b>${Math.round(i)} kg</b></div>
          <div>MTOW: <b>${Math.round(r)} kg</b></div>
          <div>Vel Máx: <b>${Math.round(s)} km/h</b></div>
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
      </button>`}async loadWingsTab(){console.log("🔄 Loading Wings Tab...");try{const e=await this.loadOptimizedTemplate("templates/aircraft-creator/wings-tab.html");x.injectWithTransition(this.getTabContent(),e),setTimeout(()=>{this.initializeWingsInterface()},100)}catch(e){console.error("❌ Failed to load wings tab template:",e),this.showEmptyState("Erro ao carregar a aba de Asas.")}}initializeWingsInterface(){console.log("🦅 Initializing intuitive wings interface..."),this.selectedWingType="straight",this.selectedWingSize="medium",this.selectedFlaps="basic",this.selectedControls="standard",document.querySelectorAll(".wing-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.wingType;this.selectWingType(t)})}),document.querySelectorAll(".size-card").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.size;this.selectWingSize(t)})}),document.querySelectorAll(".flap-option").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.flap;this.selectFlaps(t)})}),document.querySelectorAll(".control-option").forEach(e=>{e.addEventListener("click",()=>{const t=e.dataset.control;this.selectControls(t)})}),this.selectWingType(this.selectedWingType),this.selectWingSize(this.selectedWingSize),this.selectFlaps(this.selectedFlaps),this.selectControls(this.selectedControls),console.log("✅ Wings interface initialized successfully")}selectWingType(e){this.selectedWingType=e,document.querySelectorAll(".wing-card").forEach(t=>{const a=t.dataset.wingType===e;t.classList.toggle("border-cyan-400",a),t.classList.toggle("bg-cyan-900/20",a),t.classList.toggle("ring-1",a),t.classList.toggle("ring-cyan-400/50",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.type=e,this.updateWingPerformance(),this.updateWingRecommendations(),console.log(`🦅 Wing type selected: ${e}`)}selectWingSize(e){this.selectedWingSize=e,document.querySelectorAll(".size-card").forEach(t=>{const a=t.dataset.size===e;t.classList.toggle("border-cyan-400",a),t.classList.toggle("bg-cyan-900/20",a),t.classList.toggle("ring-1",a),t.classList.toggle("ring-cyan-400/50",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.size=e,this.updateWingPerformance(),console.log(`📏 Wing size selected: ${e}`)}selectFlaps(e){this.selectedFlaps=e,document.querySelectorAll(".flap-option").forEach(t=>{const a=t.dataset.flap===e;t.classList.toggle("border-cyan-500",a),t.classList.toggle("bg-cyan-900/20",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.flaps=e,this.updateWingPerformance(),console.log(`⬆️ Flaps selected: ${e}`)}selectControls(e){this.selectedControls=e,document.querySelectorAll(".control-option").forEach(t=>{const a=t.dataset.control===e;t.classList.toggle("border-cyan-500",a),t.classList.toggle("bg-cyan-900/20",a)}),window.currentAircraft.wings||(window.currentAircraft.wings={}),window.currentAircraft.wings.controls=e,this.updateWingPerformance(),console.log(`🎮 Controls selected: ${e}`)}updateWingPerformance(){const e=this.calculateWingPerformance(),t=document.getElementById("lift-rating"),a=document.getElementById("maneuver-rating"),s=document.getElementById("speed-rating"),i=document.getElementById("stability-rating");t&&(t.textContent=e.lift),a&&(a.textContent=e.maneuverability),s&&(s.textContent=e.speed),i&&(i.textContent=e.stability),typeof window.updateAircraftCalculations=="function"&&window.updateAircraftCalculations()}calculateWingPerformance(){const e={straight:{lift:7,maneuverability:6,speed:5,stability:9},swept:{lift:6,maneuverability:7,speed:9,stability:7},delta:{lift:5,maneuverability:4,speed:10,stability:8},variable:{lift:8,maneuverability:9,speed:9,stability:6},"forward-swept":{lift:8,maneuverability:10,speed:7,stability:4},canard:{lift:7,maneuverability:9,speed:8,stability:7}},t={small:{lift:-1,maneuverability:2,speed:1,stability:-1},medium:{lift:0,maneuverability:0,speed:0,stability:0},large:{lift:2,maneuverability:-2,speed:-1,stability:1}},a={basic:{lift:0,maneuverability:0,speed:0,stability:0},advanced:{lift:1,maneuverability:0,speed:-1,stability:0},modern:{lift:2,maneuverability:1,speed:-1,stability:1}},s={standard:{lift:0,maneuverability:0,speed:0,stability:0},enhanced:{lift:0,maneuverability:2,speed:0,stability:-1},"fly-by-wire":{lift:1,maneuverability:3,speed:0,stability:2}},i=e[this.selectedWingType]||e.straight,r=t[this.selectedWingSize]||t.medium,o=a[this.selectedFlaps]||a.basic,n=s[this.selectedControls]||s.standard;return{lift:Math.max(1,Math.min(10,i.lift+r.lift+o.lift+n.lift)),maneuverability:Math.max(1,Math.min(10,i.maneuverability+r.maneuverability+o.maneuverability+n.maneuverability)),speed:Math.max(1,Math.min(10,i.speed+r.speed+o.speed+n.speed)),stability:Math.max(1,Math.min(10,i.stability+r.stability+o.stability+n.stability))}}updateWingRecommendations(){const e={fighter:["swept","delta","canard"],bomber:["straight","swept"],transport:["straight"],helicopter:["straight"],attacker:["straight","swept"]},t=window.currentAircraft?.category||"fighter",a=e[t]||[];a.includes(this.selectedWingType)?document.getElementById("wing-recommendations")?.classList.add("hidden"):this.showWingRecommendations(a)}showWingRecommendations(e){const t=document.getElementById("wing-recommendations"),a=document.getElementById("recommendations-content");!t||!a||(a.innerHTML=e.map(s=>`
        <div class="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <div class="text-yellow-400 font-medium">💡 Recomendação</div>
          <div class="text-sm text-slate-300 mt-1">
            ${{straight:"Asa Reta",swept:"Asa Enflechada",delta:"Asa Delta",variable:"Geometria Variável","forward-swept":"Enflechamento Inverso",canard:"Configuração Canard"}[s]} seria mais adequada para este tipo de aeronave.
          </div>
        </div>
      `).join(""),t.classList.remove("hidden"))}loadPropulsionTab(){console.log("🔄 Loading Propulsion Tab (Engines)..."),this.loadEngineTab()}async loadEngineTab(){if(console.log("🔄 Loading Engine Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.aircraft_engines){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...");try{this.showLoadingState("Carregando motores de aeronaves..."),await this.ensureComponentsLoaded(["aircraft_engines"]),console.log("✅ Components loaded, retrying..."),this.loadEngineTab()}catch(s){console.error("❌ Failed to load components:",s),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}return}this.updateTechLevel();const e=window.AIRCRAFT_COMPONENTS?.aircraft_engines||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhum motor disponível.");if(!window.currentAircraft?.airframe)return this.showEmptyState("Selecione uma fuselagem primeiro.");console.log(`📊 Found ${t.length} engines in data`);const a=this.createModernPropulsionInterface(e);this.getTabContent().innerHTML=a,setTimeout(()=>{this.initializePropulsionInterface(e)},100)}createModernPropulsionInterface(e){return window.currentAircraft?.category,`
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
    `}initializePropulsionInterface(e){console.log("🚀 Initializing modern propulsion interface..."),this.selectedEngine=null,this.currentFilter="all",this.currentEraFilter="all",this.populateEnginesGrid(e),document.querySelectorAll(".engine-type-filter").forEach(t=>{t.addEventListener("click",()=>{this.currentFilter=t.dataset.filter,this.updateEngineTypeFilters(),this.filterEngines(e)})}),document.querySelectorAll(".era-filter").forEach(t=>{t.addEventListener("click",()=>{this.currentEraFilter=t.dataset.era,this.updateEraFilters(),this.filterEngines(e)})}),document.getElementById("calculate-power-btn").addEventListener("click",()=>{this.calculateRequiredPower()}),this.currentFilter="all",this.currentEraFilter="all",this.updateEngineRecommendations(e)}populateEnginesGrid(e){const t=window.currentAircraft?.category||"fighter",a=window.AIRCRAFT_COMPONENTS?.airframes?.[window.currentAircraft?.airframe],s=new Set(a?.compatible_engine_types||[]),i=document.getElementById("engines-grid");if(!i){console.error("❌ Engines grid element not found");return}let r="",o=0;Object.entries(e).forEach(([n,l])=>{let c=!0;if(s.size>0&&a&&a.strict_engine_compatibility&&(c=s.has(l.type)),c)try{r+=this.createModernEngineCard(n,l,t),o++}catch(p){console.error(`❌ Error creating card for engine ${n}:`,p)}}),o===0&&(r=`
        <div class="col-span-full text-center py-8">
          <div class="text-slate-400 mb-4">🔍 Nenhum motor encontrado</div>
          <div class="text-sm text-slate-500">
            Verifique se uma fuselagem foi selecionada ou tente outros filtros.
          </div>
        </div>
      `),i.innerHTML=r,document.querySelectorAll(".modern-engine-card").forEach(n=>{n.addEventListener("click",()=>{const l=n.dataset.engineId;this.selectEngine(l,e[l])})})}createModernEngineCard(e,t,a){const s=this.getComponentAvailabilityInfo(t),i=window.currentAircraft?.engine===e,r=t.type&&(t.type.includes("piston")||t.power_hp),o=t.afterburner_thrust>0,n=t.year_introduced||t.tech_level*25+1945;let l="unknown";n<=1955?l="1945-1955":n<=1965?l="1955-1965":n<=1975?l="1965-1975":l="1975-1990";let c="unknown";r?c="piston":t.type?.includes("turbojet")||n<=1965?c="early_jet":t.type?.includes("turboprop")?c="turboprop":c="modern_jet";let p;r?p=`${Math.round(t.power_hp||0)} HP`:p=`${Math.round(t.military_thrust||t.thrust||0)} kgf`;const g={piston:"🛩️",early_jet:"💨",modern_jet:"🚀",turboprop:"🌪️",unknown:"⚙️"},f=s.isAvailable,h=Math.round((t.reliability||0)*100);return`
      <div class="modern-engine-card cursor-pointer p-4 border-2 rounded-lg transition-all duration-200 ${i?"border-cyan-400 bg-cyan-900/20 ring-1 ring-cyan-400/50":"border-slate-700/50 bg-slate-800/40 hover:border-slate-600"} ${f?"":"opacity-50"}"
           data-engine-id="${e}"
           data-type="${c}"
           data-era="${l}"
           ${f?"":'data-unavailable="true"'}>

        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${g[c]}</span>
            <h4 class="font-semibold text-slate-200 text-sm">${t.name}</h4>
          </div>
          ${o?'<span class="px-2 py-0.5 text-xs bg-red-600 text-white rounded-lg">AB</span>':""}
        </div>

        <div class="space-y-2 text-xs">
          <div class="grid grid-cols-2 gap-2">
            <div class="text-slate-300">
              <span class="text-slate-400">${r?"Potência:":"Empuxo:"}</span>
              <span class="font-semibold text-cyan-400">${p}</span>
            </div>
            <div class="text-slate-300">
              <span class="text-slate-400">Peso:</span>
              <span class="font-semibold">${Math.round(t.weight||0)} kg</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="text-slate-300">
              <span class="text-slate-400">Confiabilidade:</span>
              <span class="font-semibold ${h>=85?"text-green-400":h>=75?"text-yellow-400":"text-red-400"}">${h}%</span>
            </div>
            <div class="text-slate-300">
              <span class="text-slate-400">Consumo:</span>
              <span class="font-semibold">${(t.fuel_consumption||0).toFixed(1)} kg/s</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-slate-600">
            <div class="text-slate-400">
              <span>Tech: ${s.requiredTech}</span>
              ${t.year_introduced?`<span class="text-slate-500"> • ${t.year_introduced}</span>`:""}
            </div>
            ${f?"":'<span class="text-red-400 text-xs">🔒 Indisponível</span>'}
          </div>
        </div>

        ${i?'<div class="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>':""}
      </div>
    `}updateEngineTypeFilters(){document.querySelectorAll(".engine-type-filter").forEach(e=>{e.dataset.filter===this.currentFilter?(e.classList.add("border-cyan-400","bg-cyan-900/20"),e.classList.remove("border-slate-700/50")):(e.classList.remove("border-cyan-400","bg-cyan-900/20"),e.classList.add("border-slate-700/50"))})}updateEraFilters(){document.querySelectorAll(".era-filter").forEach(e=>{e.dataset.era===this.currentEraFilter?(e.classList.add("border-cyan-500","bg-cyan-600","text-white"),e.classList.remove("border-slate-600","text-slate-300")):(e.classList.remove("border-cyan-500","bg-cyan-600","text-white"),e.classList.add("border-slate-600","text-slate-300"))})}filterEngines(e){document.querySelectorAll(".modern-engine-card").forEach(t=>{const a=t.dataset.type,s=t.dataset.era;let i=!0;this.currentFilter!=="all"&&a!==this.currentFilter&&(i=!1),this.currentEraFilter!=="all"&&s!==this.currentEraFilter&&(i=!1),t.style.display=i?"block":"none"})}calculateRequiredPower(){const e=document.getElementById("target-speed").value,t=document.getElementById("target-altitude").value,a=document.getElementById("power-calculation-result");if(!e||e<100){a.innerHTML='<span class="text-red-400">Por favor, insira uma velocidade válida (mín. 100 km/h)</span>';return}const s=e/3.6,i=window.currentAircraft?.selectedAirframe?.base_weight||3e3,o=1.225*Math.exp(-t/8400),n=window.currentAircraft?.category||"fighter";let l,c;switch(n){case"fighter":l=i/400,c=.025;break;case"bomber":l=i/250,c=.035;break;case"transport":l=i/200,c=.03;break;default:l=i/350,c=.03}const p=.5*o*Math.pow(s,2)*l*c;let g=1;s>250&&(g=1+Math.pow((s-250)/100,1.5));const f=p*g*(1+t/15e3),h=f*s/745.7;a.innerHTML=`
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div>
          <div class="text-slate-400">Empuxo Necessário:</div>
          <div class="text-xl font-bold text-cyan-400">${Math.round(f)} kgf</div>
        </div>
        <div>
          <div class="text-slate-400">Potência Equivalente:</div>
          <div class="text-xl font-bold text-cyan-400">${Math.round(h)} HP</div>
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
          <div class="text-slate-400">• Coef. arrasto: ${c}</div>
          <div class="text-slate-400">• Fator compressibilidade: ${g.toFixed(2)}</div>
        </div>
        <div>
          <div class="text-slate-500">Baseado em:</div>
          <div class="text-slate-400">• Categoria: ${n}</div>
          <div class="text-slate-400">• Peso: ${i} kg</div>
          <div class="text-slate-400">• Velocidade: ${s.toFixed(1)} m/s</div>
        </div>
      </div>
    `,this.highlightSuitableEngines(f,h)}highlightSuitableEngines(e,t){document.querySelectorAll(".modern-engine-card").forEach(a=>{const s=a.dataset.engineId,i=window.AIRCRAFT_COMPONENTS?.aircraft_engines?.[s];if(!i)return;const r=i.type&&(i.type.includes("piston")||i.power_hp);let o=!1;if(r?o=(i.power_hp||0)>=t:o=(i.military_thrust||i.thrust||0)>=e,o){if(a.classList.add("ring-2","ring-green-400/50"),!a.querySelector(".suitable-badge")){const n=document.createElement("div");n.className="suitable-badge absolute top-1 left-1 px-2 py-0.5 bg-green-600 text-white text-xs rounded-lg",n.textContent="✓ Adequado",a.style.position="relative",a.appendChild(n)}}else{a.classList.remove("ring-2","ring-green-400/50");const n=a.querySelector(".suitable-badge");n&&n.remove()}})}selectEngine(e,t){this.selectedEngine=e,document.querySelectorAll(".modern-engine-card").forEach(a=>{a.dataset.engineId===e?(a.classList.add("border-cyan-400","bg-cyan-900/20","ring-1","ring-cyan-400/50"),a.classList.remove("border-slate-700/50")):(a.classList.remove("border-cyan-400","bg-cyan-900/20","ring-1","ring-cyan-400/50"),a.classList.add("border-slate-700/50"))}),window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.engine=e,this.showSelectedEngineInfo(t),typeof window.updateAircraftCalculations=="function"&&window.updateAircraftCalculations(),console.log(`⚡ Engine selected: ${t.name}`)}showSelectedEngineInfo(e){const t=document.getElementById("selected-engine-info"),a=document.getElementById("engine-specs"),s=document.getElementById("engine-performance");if(!t||!a||!s)return;const i=e.type&&(e.type.includes("piston")||e.power_hp),r=e.afterburner_thrust>0;a.innerHTML=`
      <div class="flex justify-between">
        <span class="text-slate-400">Nome:</span>
        <span class="text-slate-200">${e.name}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Tipo:</span>
        <span class="text-slate-200">${e.type||"Desconhecido"}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">${i?"Potência:":"Empuxo Militar:"}</span>
        <span class="text-cyan-400 font-semibold">${i?Math.round(e.power_hp||0)+" HP":Math.round(e.military_thrust||e.thrust||0)+" kgf"}</span>
      </div>
      ${r?`
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
    `;const o=Math.round((e.reliability||0)*100),n=i?((e.power_hp||0)*.75/(e.weight||1)).toFixed(1):((e.military_thrust||e.thrust||0)/(e.weight||1)).toFixed(1);s.innerHTML=`
      <div class="flex justify-between">
        <span class="text-slate-400">Confiabilidade:</span>
        <span class="${o>=85?"text-green-400":o>=75?"text-yellow-400":"text-red-400"} font-semibold">${o}%</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Relação Empuxo/Peso:</span>
        <span class="text-slate-200">${n}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-slate-400">Consumo:</span>
        <span class="text-slate-200">${(e.fuel_consumption||0).toFixed(2)} kg/s</span>
      </div>
      ${r?`
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
    `,t.classList.remove("hidden")}updateEngineRecommendations(e){const t=window.currentAircraft?.category||"fighter",s={fighter:["early_jet","modern_jet"],bomber:["piston","turboprop","early_jet"],transport:["piston","turboprop"],helicopter:["piston","turboprop"],attacker:["piston","early_jet"]}[t]||["early_jet"],i=document.getElementById("engine-recommendations"),r=document.getElementById("recommendation-cards");if(!i||!r)return;const o={piston:"Motores a Pistão",early_jet:"Primeiros Jatos",modern_jet:"Jatos Modernos",turboprop:"Turboprops"};r.innerHTML=s.map(n=>`
      <div class="p-3 bg-green-900/20 border border-green-600/30 rounded-lg">
        <div class="text-green-400 font-medium">💡 Recomendado</div>
        <div class="text-sm text-slate-300 mt-1">
          ${o[n]} são ideais para aeronaves do tipo ${t}.
        </div>
      </div>
    `).join(""),i.classList.remove("hidden")}renderEngineCountSelector(e){const t=e?.min_engines||1,a=e?.max_engines||1,s=window.currentAircraft?.engineCount||t;return`
      <!-- Engine Count Selector -->
      <div id="engine-count-selector" class="mb-6 p-6 bg-blue-900/20 border border-blue-700/50 rounded-xl">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <span class="text-xl">🔢</span>
            <h3 class="font-semibold text-blue-200">Quantidade de Motores</h3>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-300" id="engine-count-display">${s}</div>
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
                value="${s}" 
                class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <span class="text-sm text-slate-400 min-w-0">${a}</span>
          </div>
          <div class="mt-2 flex justify-between text-xs text-slate-500">
            <span>Mínimo</span>
            <span id="engine-count-info" class="text-blue-300">Selecionado: ${s} motor${s>1?"es":""}</span>
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
    `}setupEngineCountSelector(e){const t=document.getElementById("engine-count-selector"),a=document.getElementById("engine-count-slider"),s=document.getElementById("engine-count-display"),i=document.getElementById("engine-count-info");if(!t||!a||!s||!i||!e)return;const r=e.min_engines||1,o=e.max_engines||1;a.min=r,a.max=o,a.value=window.currentAircraft?.engineCount||r;const n=parseInt(a.value);s.textContent=n,i.textContent=`Selecionado: ${n} motor${n>1?"es":""}`,t.classList.remove("hidden"),a.oninput=l=>{const c=parseInt(l.target.value);s.textContent=c,i.textContent=`Selecionado: ${c} motor${c>1?"es":""}`,window.currentAircraft||(window.currentAircraft={}),window.currentAircraft.engineCount=c,this.updateEngineCountImpact(),this.updateEngineConfigWarning(c,o)},this.updateEngineCountImpact(),this.updateEngineConfigWarning(n,o)}updateEngineCountImpact(){console.log("🔄 updateEngineCountImpact executado");const e=window.currentAircraft?.engine,t=window.currentAircraft?.engineCount||1;if(console.log("🔍 Motor selecionado:",e,"Quantidade:",t),!e){console.warn("⚠️ Nenhum motor selecionado");return}const a=window.AIRCRAFT_COMPONENTS?.aircraft_engines[e];if(!a){console.error("❌ Motor não encontrado:",e);return}console.log("✅ Motor encontrado:",a.name);const s=this.calculateAircraftPerformance(a,t);console.log("📊 Performance calculada:",s);const i=document.getElementById("total-power-display"),r=document.getElementById("total-weight-display"),o=document.getElementById("fuel-consumption-display"),n=document.getElementById("reliability-display");i&&(i.textContent=s.totalThrust,console.log("✅ Empuxo total atualizado:",s.totalThrust)),r&&(r.textContent=`${Math.round(s.totalEngineWeight)} kg`,console.log("✅ Peso dos motores atualizado:",s.totalEngineWeight)),o&&(o.textContent=s.fuelConsumption,console.log("✅ Consumo atualizado:",s.fuelConsumption)),n&&(n.textContent=`${s.reliability}%`,console.log("✅ Confiabilidade atualizada:",s.reliability)),console.log("🎯 Atualizando performance global..."),this.updateGlobalPerformance(s)}calculateAircraftPerformance(e,t){if(console.log("🔧 TabLoaders: Calculando performance..."),window.advancedPerformanceCalculator&&window.currentAircraft?.airframe)try{const b=window.AIRCRAFT_COMPONENTS?.airframes?.[window.currentAircraft.airframe];if(b){const $={airframe:b,engine:e,engineCount:t,weapons:window.currentAircraft.weapons||[],avionics:window.currentAircraft.avionics||[],fuel:window.currentAircraft.fuelLevel||1,altitude:0},v=window.advancedPerformanceCalculator.calculateCompletePerformance($);if(v&&!v.error){console.log("✅ TabLoaders: Sistema avançado executado");const A=v.summary,S=v.power.type==="piston",M=e.afterburner_thrust>0;let L;return S?L=`${Math.round((e.power_hp||0)*t)} HP`:L=`${Math.round((e.military_thrust||e.thrust||0)*t)} kgf`,{totalThrust:L,totalThrustAB:M?`${Math.round(e.afterburner_thrust*t)} kgf`:null,totalEngineWeight:v.mass.engineWeight,fuelConsumption:`${v.operationalPerformance.fuelFlowRate.toFixed(2)} kg/h`,reliability:Math.round((e.reliability||.8)*100*Math.pow(.96,t-1)),maxSpeed:A.maxSpeed,thrustToWeight:A.thrustToWeight.toFixed(2),range:A.maxRange,hasAfterburner:M,isPistonEngine:S}}}}catch(b){console.warn("⚠️ TabLoaders: Erro no sistema avançado, usando cálculo simplificado:",b)}console.log("🔄 TabLoaders: Usando sistema de fallback");const a=window.currentAircraft?.airframe,s=window.AIRCRAFT_COMPONENTS?.airframes?.[a],i=e.type&&(e.type.includes("piston")||e.power_hp),r=e.afterburner_thrust>0;let o,n=null;if(i)o=`${Math.round((e.power_hp||0)*t)} HP`;else{const b=(e.military_thrust||e.thrust||0)*t;if(o=`${Math.round(b)} kgf`,r){const $=e.afterburner_thrust*t;n=`${Math.round($)} kgf`}}const l=e.weight*t,c=(e.fuel_consumption||0)*t,p=r?(e.afterburner_fuel_consumption||0)*t:null;let g=c.toFixed(2);p?g+=` / ${p.toFixed(1)} kg/s`:g+=" kg/s";const f=e.reliability||.8,h=Math.round(f*100*Math.pow(.96,t-1));let w=0,E=0,_=0;if(s){const b=(s.base_weight||0)+l;E=((i?(e.power_hp||0)*t*.75:(e.military_thrust||e.thrust||0)*t)/b).toFixed(2),w=i?Math.min(s.max_speed_kph||650,400+(e.power_hp||0)*t*.15):Math.min(s.max_speed_kph||1200,600+(e.military_thrust||e.thrust||0)*t*.1);const v=s.internal_fuel_kg||1e3,A=c*.6;_=A>0?v/A*(w*.8)/1e3:0}return{totalThrust:o,totalThrustAB:n,totalEngineWeight:l,fuelConsumption:g,reliability:h,maxSpeed:Math.round(w),thrustToWeight:E,range:Math.round(_),hasAfterburner:r,isPistonEngine:i}}updateGlobalPerformance(e){console.log("🎯 Atualizando performance global:",e);const t=window.currentAircraft?.airframe,a=window.AIRCRAFT_COMPONENTS?.airframes?.[t];let s=0;a&&e.totalEngineWeight&&(s=(a.base_weight||0)+e.totalEngineWeight);const i=document.getElementById("total-weight-display");i&&s>0&&(i.textContent=`${Math.round(s)} kg`,console.log("✅ Peso atualizado:",s));const r=document.getElementById("max-speed-display");r&&e.maxSpeed&&(r.textContent=`${e.maxSpeed} km/h`,console.log("✅ Velocidade atualizada:",e.maxSpeed));const o=document.getElementById("thrust-weight-ratio-display");o&&e.thrustToWeight&&(o.textContent=`${e.thrustToWeight}:1`,console.log("✅ Empuxo/Peso atualizado:",e.thrustToWeight)),typeof window.updateAircraftCalculations=="function"&&setTimeout(()=>{window.updateAircraftCalculations()},100)}updateEngineConfigWarning(e,t){const a=document.getElementById("engine-config-warning"),s=document.getElementById("engine-config-warning-text");!a||!s||(e>=4?(a.classList.remove("hidden"),e>=6?s.textContent="Configurações com 6+ motores são extremamente complexas e caras. Requer tripulação especializada e manutenção intensiva.":s.textContent="Configurações com 4+ motores aumentam significativamente a complexidade e custos operacionais."):a.classList.add("hidden"))}renderEngineCard(e,t){const a=window.currentAircraft?.engine===e,s=t.type&&(t.type.includes("piston")||t.power_hp),i=t.afterburner_thrust>0,r=Math.round((t.reliability||0)*100),o=this.getComponentAvailabilityInfo(t);this.getComponentStatusClass(t);let n,l="";if(s)n=`Potência: <b>${Math.round(t.power_hp||0)} HP</b>`;else{const w=t.military_thrust||t.thrust||0;n=`Empuxo: <b>${Math.round(w)} kgf</b>`,i&&(l=`Pós-comb.: <b>${Math.round(t.afterburner_thrust)} kgf</b>`)}let c;if(i){const w=(t.fuel_consumption||0).toFixed(2),E=(t.afterburner_fuel_consumption||0).toFixed(1);c=`${w}/${E} kg/s`}else c=`${(t.fuel_consumption||t.sfc_mil||0).toFixed(2)} kg/s`;const p=s?((t.power_hp||0)*.75/(t.weight||1)).toFixed(1):((t.military_thrust||t.thrust||0)/(t.weight||1)).toFixed(1),g=a?"selected border-brand-400 ring-1 ring-brand-400/50":"border-slate-700/50 bg-slate-800/40",f=o.isAvailable?"":"opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10",h=o.isAvailable?`onclick="selectAircraftEngine('${e}')"`:`onclick="showTechRequirement('${t.name}', ${o.requiredTech}, ${o.currentTech})"`;return`
      <button class="engine-card component-card relative rounded-2xl p-4 text-left border transition ${g} ${f}" ${h}>
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-base font-semibold text-slate-100">${t.name}</h4>
          <div class="flex gap-1">
            ${i?'<span class="afterburner-indicator">🔥 AB</span>':""}
            ${s?'<span class="px-2 py-0.5 text-xs rounded-lg text-white bg-orange-600">Pistão</span>':'<span class="px-2 py-0.5 text-xs rounded-lg text-white bg-blue-600">Jato</span>'}
          </div>
        </div>
        
        <div class="space-y-2 text-xs text-slate-300">
          <div class="grid grid-cols-2 gap-2">
            <div>${n}</div>
            <div>Peso: <b>${Math.round(t.weight||0)} kg</b></div>
          </div>
          
          ${l?`<div class="grid grid-cols-2 gap-2"><div>${l}</div><div>T/W: <b>${p}</b></div></div>`:`<div class="grid grid-cols-2 gap-2"><div>T/W: <b>${p}</b></div><div></div></div>`}
          
          <div class="grid grid-cols-2 gap-2">
            <div class="reliability-indicator">
              <span class="reliability-dot ${r>=85?"high":r>=75?"medium":"low"}"></span>
              Confiab.: <b>${r}%</b>
            </div>
            <div>Consumo: <b>${c}</b></div>
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
      </button>`}async loadWeaponsTab(){if(console.log("🔄 Loading Weapons Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.aircraft_weapons){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load...");try{this.showLoadingState("Carregando armamentos de aeronaves..."),await this.ensureComponentsLoaded(["aircraft_weapons"]),console.log("✅ Components loaded, retrying..."),this.loadWeaponsTab()}catch(i){console.error("❌ Failed to load components:",i),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}return}const e=window.AIRCRAFT_COMPONENTS?.aircraft_weapons||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhum armamento disponível.");if(!window.currentAircraft?.airframe)return this.showEmptyState("Selecione uma fuselagem primeiro.");console.log(`📊 Found ${t.length} weapons in data`);const a=new Set(window.currentAircraft?.weapons||[]);let s='<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';t.forEach(i=>{const r=e[i],o=a.has(i);s+=`
        <div class="component-card relative rounded-2xl p-4 border cursor-pointer ${o?"selected border-brand-400 bg-brand-900/20":"border-slate-700/50 bg-slate-800/40"}" onclick="toggleAircraftWeapon('${i}')">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-sm font-semibold text-slate-100">${r.name}</h4>
            <span class="text-xs px-2 py-0.5 rounded-lg bg-slate-700/60 text-slate-200">${r.type||"payload"}</span>
          </div>
          <div class="text-xs text-slate-300">Peso: <b>${Math.round(r.weight||0)} kg</b></div>
          ${o?'<div class="absolute top-2 right-2 w-2 h-2 bg-brand-400 rounded-full"></div>':""}
        </div>`}),s+="</div>",this.getTabContent().innerHTML=s}async loadAvionicsTab(){if(console.log("🔄 Loading Avionics Tab..."),!window.AIRCRAFT_COMPONENTS?.avionics){try{this.showLoadingState("Carregando sistemas aviônicos..."),await this.ensureComponentsLoaded(["avionics"]),this.loadAvionicsTab()}catch(e){console.error("❌ Failed to load avionics components:",e),this.showEmptyState("Sistema de componentes não encontrado.")}return}this.updateTechLevel();try{const e=await this.loadOptimizedTemplate("templates/aircraft-creator/avionics-tab.html");x.injectWithTransition(this.getTabContent(),e),this.debouncedUIUpdate("avionics-populate",()=>this.populateAvionicsTab(),50)}catch(e){console.error("❌ Failed to load avionics tab template:",e),this.showEmptyState("Erro ao carregar a aba de Aviônicos.")}}populateAvionicsTab(){const e=document.getElementById("avionics-groups-container");if(!e)return;const t=window.AIRCRAFT_COMPONENTS.avionics||{},a=Object.keys(t);if(a.length===0){e.innerHTML='<p class="text-slate-400">Nenhum sistema de aviônica disponível.</p>';return}const s=new Set(window.currentAircraft?.avionics||[]),i={};a.forEach(n=>{const l=t[n],c=l.type||"misc";i[c]||(i[c]=[]),i[c].push({id:n,...l})});const r={communication:"Sistemas de Comunicação",navigation:"Navegação e Piloto Automático",fcs:"Controle de Tiro e Mira",radar:"Radar de Busca",ew:"Guerra Eletrônica e Contramedidas",cockpit:"Sistemas de Cabine e Suporte"};let o="";for(const n in r)i[n]&&(o+=`<h3 class="text-lg font-semibold text-slate-200 mt-6 mb-4 border-b border-slate-700 pb-2">${r[n]}</h3>`,o+='<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">',i[n].forEach(l=>{o+=this.renderAvionicsCard(l.id,l,s.has(l.id))}),o+="</div>");e.innerHTML=o,e.addEventListener("click",n=>{const l=n.target.closest(".component-card");if(l&&l.dataset.avionicId){const c=l.dataset.avionicId;if(l.classList.contains("locked")){const g=t[c],f=this.getComponentAvailabilityInfo(g);window.showTechRequirement&&window.showTechRequirement(g.name,f.requiredTech,f.currentTech);return}window.currentAircraft.avionics||(window.currentAircraft.avionics=[]);const p=window.currentAircraft.avionics.indexOf(c);p>-1?window.currentAircraft.avionics.splice(p,1):window.currentAircraft.avionics.push(c),this.populateAvionicsTab(),updateAircraftCalculations()}})}renderAvionicsCard(e,t,a){const i=!this.getComponentAvailabilityInfo(t).isAvailable;return`
        <div class="component-card relative rounded-xl p-4 border transition-all ${a?"selected border-cyan-400 ring-1 ring-cyan-400/50":"border-slate-700/50 bg-slate-800/40"} ${i?"locked opacity-60 cursor-not-allowed":"hover:border-slate-600 hover:bg-slate-800"}" data-avionic-id="${e}">
            <div class="flex items-start justify-between mb-2">
                <h4 class="text-sm font-semibold text-slate-100 pr-4">${t.name}</h4>
                ${i?`<span class="text-red-400 text-xs">🔒 Tech ${t.tech_level}</span>`:""}
            </div>
            <p class="text-xs text-slate-400 mb-3 h-10 overflow-hidden">${t.description}</p>
            <div class="text-xs text-slate-300 grid grid-cols-2 gap-1">
                <div>Peso: <b>${t.weight} kg</b></div>
                <div>Custo: <b>${(t.cost/1e3).toFixed(0)}K</b></div>
            </div>
            ${a?'<div class="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full ring-2 ring-slate-800"></div>':""}
        </div>
    `}loadSuperchargerTab(){if(console.log("🔄 Loading Supercharger Tab..."),!window.AIRCRAFT_COMPONENTS||!window.AIRCRAFT_COMPONENTS.superchargers){console.warn("⚠️ AIRCRAFT_COMPONENTS not loaded, attempting to load..."),this.showLoadingState("Carregando superchargers..."),window.loadAircraftComponents?window.loadAircraftComponents().then(()=>{console.log("✅ Components loaded, retrying..."),this.loadSuperchargerTab()}).catch(o=>{console.error("❌ Failed to load components:",o),this.showEmptyState("Erro ao carregar componentes de aeronaves.")}):this.showEmptyState("Sistema de componentes não encontrado.");return}if(!window.currentAircraft?.airframe||!window.currentAircraft?.engine){this.showEmptyState("Selecione uma fuselagem e um motor primeiro.");return}this.updateTechLevel();const e=window.AIRCRAFT_COMPONENTS?.superchargers||{},t=Object.keys(e);if(t.length===0)return this.showEmptyState("Nenhum supercharger disponível.");console.log(`📊 Found ${t.length} superchargers in data`);const a=this.filterAvailableComponents(e);console.log(`🔬 Superchargers: ${Object.keys(a).length} available out of ${t.length} total`);const s=e,i=window.currentAircraft?.supercharger||"none";let r=`
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-bold text-slate-100">Sistema de Superalimentação</h2>
            <p class="text-slate-400 text-sm">Melhore a performance em altitude com superchargers e turboalimentadores</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-slate-400">Selecionado:</div>
            <div class="text-lg font-semibold text-cyan-300" id="selected-supercharger-name">${s[i]?.name||"Nenhum"}</div>
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
    `;t.forEach(o=>{const n=s[o],l=i===o,c=this.getComponentAvailabilityInfo(n),p=l?"selected border-cyan-400 ring-1 ring-cyan-400/50 bg-cyan-900/20":"border-slate-700/50 bg-slate-800/40",g=c.isAvailable?"cursor-pointer hover:border-slate-600 hover:bg-slate-700/50":"opacity-50 cursor-not-allowed border-red-500/30 bg-red-900/10",f=c.isAvailable?`onclick="selectSupercharger('${o}')"`:`onclick="showTechRequirement('${n.name}', ${c.requiredTech}, ${c.currentTech})"`;r+=`
        <div class="component-card relative rounded-2xl p-6 border transition ${p} ${g}" ${f}>
          <div class="flex items-start justify-between mb-4">
            <div>
              <h4 class="text-lg font-semibold text-slate-100">${n.name}</h4>
              <p class="text-sm text-slate-400 mt-1">${n.description}</p>
            </div>
            ${c.isAvailable?"":`<div class="flex items-center gap-1">
                <span class="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <span class="text-red-400 text-xs">🔒</span>
                </span>
              </div>`}
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">Custo:</span>
                <span class="text-yellow-300 font-semibold">$${(n.cost/1e3).toFixed(0)}K</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Peso:</span>
                <span class="text-orange-300 font-semibold">${n.weight} kg</span>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-slate-400">Alt. Nominal:</span>
                <span class="text-green-300 font-semibold">${n.rated_altitude_m||0}m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Confiabilidade:</span>
                <span class="text-blue-300 font-semibold">${Math.round((n.reliability_mod||1)*100)}%</span>
              </div>
            </div>
          </div>
          
          <!-- Tech Level Indicator -->
          <div class="mt-4 flex items-center justify-between">
            <div class="text-xs">
              <span class="text-slate-400">Tech Level:</span>
              <span class="${c.isAvailable?"text-green-400":"text-red-400"} font-semibold">
                ${n.tech_level||0}
              </span>
            </div>
            ${c.isAvailable?"":`<span class="text-xs text-red-400">Requer ${c.missingTech} tech adicional</span>`}
          </div>
          
          ${l?'<div class="absolute top-3 right-3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>':""}
        </div>
      `}),r+=`
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
    `,this.getTabContent().innerHTML=r,this.updateSuperchargerImpact()}updateSuperchargerImpact(){const e=window.currentAircraft?.supercharger||"none",t=window.AIRCRAFT_COMPONENTS?.superchargers?.[e];if(!t)return;const a=document.getElementById("supercharger-altitude-gain"),s=document.getElementById("supercharger-weight-impact"),i=document.getElementById("supercharger-cost-impact"),r=document.getElementById("supercharger-reliability-impact");if(a){const o=t.rated_altitude_m||0;a.textContent=o>0?`+${o}m`:"0m"}if(s){const o=t.weight||0;s.textContent=o>0?`+${o} kg`:"0 kg"}if(i){const o=t.cost||0;i.textContent=o>0?`+$${(o/1e3).toFixed(0)}K`:"$0K"}if(r){const o=Math.round((t.reliability_mod||1)*100);r.textContent=`${o}%`}}async ensureComponentsLoaded(e=[]){if(window.AIRCRAFT_COMPONENTS&&e.every(t=>window.AIRCRAFT_COMPONENTS[t])){console.log("📋 All required components already loaded");return}this.componentLoadPromise||(this.componentLoadPromise=this.performComponentLoading());try{await this.componentLoadPromise,console.log("✅ Component loading completed")}finally{this.componentLoadPromise=null}}async performComponentLoading(){if(window.loadAircraftComponents)return console.log("🔄 Loading aircraft components with optimization..."),window.loadAircraftComponents();throw new Error("Component loading system not available")}async loadOptimizedTemplate(e){try{return await x.loadTemplate(e,{priority:"high",cache:!0})}catch(t){throw console.error(`❌ Failed to load template: ${e}`,t),t}}debouncedUIUpdate(e,t,a=150){x.debouncedUpdate(e,t,a)}isAvailable(e){try{const t=typeof window.getCurrentCountry=="function"?window.getCurrentCountry():null,a=e?.tech_level;if(t&&a&&Number.isFinite(a)&&t.tech_level<a)return!1;const s=t?.year;if(s){const i=e?.era_start,r=e?.era_end;if(i&&s<i||r&&s>r)return!1}return!0}catch{return!0}}getCategoryDisplayName(e){return{fighter:"Caça",bomber:"Bombardeiro",transport:"Transporte",attack:"Ataque ao Solo",helicopter:"Helicóptero",experimental:"Experimental"}[e]||"Desconhecida"}generateAirframeOptions(e){return({fighter:[{id:"light_fighter",icon:"🛩️",name:"Caça Leve",description:"Fuselagem ágil e econômica para caças leves (1954-1960)",weight:1600,gLimit:9,hardpoints:2,fuel:400},{id:"early_jet_fighter",icon:"🚀",name:"Caça a Jato Inicial",description:"Primeiro caça a jato subsônico básico (1954-1958)",weight:2200,gLimit:8,hardpoints:4,fuel:600},{id:"supersonic_fighter",icon:"⚡",name:"Caça Supersônico",description:"Caça supersônico de 2ª geração (1958-1965)",weight:2800,gLimit:7.5,hardpoints:4,fuel:900},{id:"interceptor_fighter",icon:"🎯",name:"Interceptador",description:"Especializado em interceptação de alta altitude (1960-1970)",weight:3200,gLimit:6,hardpoints:6,fuel:1400},{id:"multirole_fighter",icon:"⚔️",name:"Caça Multifunção",description:"Caça versátil de 3ª geração (1965-1975)",weight:3e3,gLimit:8,hardpoints:8,fuel:1100},{id:"air_superiority_fighter",icon:"🦅",name:"Superioridade Aérea",description:"Caça pesado de domínio aéreo (1970-1980)",weight:4200,gLimit:9,hardpoints:8,fuel:2200},{id:"modern_multirole",icon:"🌟",name:"Caça Moderno",description:"Caça de 4ª geração com aviônicos avançados (1975-1985)",weight:2600,gLimit:9,hardpoints:9,fuel:1e3},{id:"naval_fighter",icon:"⚓",name:"Caça Naval",description:"Caça reforçado para operações em porta-aviões (1960-1980)",weight:3400,gLimit:7,hardpoints:6,fuel:1300},{id:"stealth_prototype",icon:"👻",name:"Protótipo Furtivo",description:"Caça experimental com tecnologia stealth (1980-1990)",weight:3800,gLimit:6.5,hardpoints:4,fuel:1600}],bomber:[{id:"light_bomber",icon:"💣",name:"Bombardeiro Leve",description:"Fuselagem para bombardeio tático",weight:4200,gLimit:5,hardpoints:12,fuel:1800},{id:"medium_bomber",icon:"✈️",name:"Bombardeiro Médio",description:"Bombardeiro de médio alcance para missões estratégicas",weight:6800,gLimit:4,hardpoints:16,fuel:3200}],transport:[{id:"light_transport",icon:"📦",name:"Transporte Leve",description:"Transporte para pequenas cargas e pessoal",weight:3800,gLimit:4,hardpoints:2,fuel:1500},{id:"heavy_transport",icon:"✈️",name:"Transporte Pesado",description:"Grande capacidade para tropas e equipamentos",weight:8500,gLimit:3,hardpoints:4,fuel:4500}],attack:[{id:"ground_attack",icon:"⚔️",name:"Ataque ao Solo",description:"Especializado em apoio aéreo aproximado",weight:3200,gLimit:6,hardpoints:10,fuel:900}],helicopter:[{id:"light_helicopter",icon:"🚁",name:"Helicóptero Leve",description:"Helicóptero de observação e transporte leve",weight:1800,gLimit:4,hardpoints:4,fuel:600},{id:"medium_helicopter",icon:"🚁",name:"Helicóptero Médio",description:"Helicóptero multifunção para combate e transporte",weight:3200,gLimit:3,hardpoints:6,fuel:1200}],experimental:[{id:"prototype_x1",icon:"🧪",name:"Protótipo X-1",description:"Projeto experimental avançado",weight:2100,gLimit:12,hardpoints:4,fuel:500}]}[e]||[]).map(s=>`
      <div class="airframe-option p-4 border border-slate-600 rounded-lg cursor-pointer hover:border-slate-500 transition-colors" data-airframe="${s.id}">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-2xl">${s.icon}</span>
          <h4 class="font-semibold text-slate-200">${s.name}</h4>
        </div>
        <p class="text-sm text-slate-400 mb-3">${s.description}</p>
        <div class="text-xs text-slate-300 space-y-1">
          <div>Peso: <span class="text-yellow-400">${s.weight.toLocaleString()} kg</span></div>
          <div>Limite G: <span class="text-green-400">${s.gLimit}G</span></div>
          <div>Hardpoints: <span class="text-blue-400">${s.hardpoints}</span></div>
          <div>Combustível: <span class="text-cyan-400">${s.fuel}L</span></div>
        </div>
      </div>
    `).join("")}}class B{constructor(){this.isInitialized=!1,this.currentUserCountry=null,this.tabLoaders=new j,this.loadingElement=document.getElementById("initial-loading"),this.statusElement=document.getElementById("loading-status")}updateLoadingStatus(e){this.statusElement&&(this.statusElement.textContent=e)}async init(){console.log("🚀 Initializing Aircraft Creator App...");try{this.updateLoadingStatus("Awaiting authentication..."),k.onAuthStateChanged(async e=>{e?await this.loadUserAndGameData(e):this.handleNotAuthenticated()})}catch(e){this.handleInitializationError(e)}}async loadUserAndGameData(e){try{this.updateLoadingStatus("User authenticated. Checking country...");const t=await I(e.uid);if(t){this.updateLoadingStatus("Country found. Loading technology data...");const[a,s]=await Promise.all([P(t),R()]);if(a){const i=1953+(s?.turnoAtual||1),r=a.Aeronautica||50;this.currentUserCountry={...a,id:t,aircraftTech:r,name:a.Pais,year:i},window.currentUserCountry=this.currentUserCountry,console.log(`✅ User country loaded: ${this.currentUserCountry.name} | Year: ${this.currentUserCountry.year}`,this.currentUserCountry),await this.finishInitialization()}else throw new Error(`Could not load data for country with ID: ${t}`)}else this.handleNoCountryLinked()}catch(t){this.handleInitializationError(t)}}async finishInitialization(){if(this.updateLoadingStatus("Initializing aircraft systems..."),C.initialize(),!C.validateBridge())throw new Error("Failed to initialize aircraft ECS system");if(console.log("✅ Aircraft ECS system initialized successfully"),this.updateLoadingStatus("Loading aircraft components..."),await q())this.updateLoadingStatus("Components loaded. Finalizing..."),this.setupTabEvents(),this.tabLoaders.loadCategoryTab(),this.hideLoadingScreen(),console.log("✅ Aircraft Creator is ready.");else throw new Error("Failed to load essential aircraft components.")}setupTabEvents(){document.querySelectorAll(".tab-button").forEach(t=>{t.addEventListener("click",()=>{const a=t.dataset.tab;this.loadTab(a)})})}loadTab(e){switch(console.log(`Attempting to load tab: ${e}`),e){case"category":this.tabLoaders.loadCategoryTab();break;case"structure":this.tabLoaders.loadStructureTab();break;case"cell":this.tabLoaders.loadCellTab();break;case"wings":this.tabLoaders.loadWingsTab();break;case"propulsion":this.tabLoaders.loadPropulsionTab();break;case"supercharger":this.tabLoaders.loadSuperchargerTab();break;case"weapons":this.tabLoaders.loadWeaponsTab();break;case"avionics":this.tabLoaders.loadAvionicsTab();break;default:console.warn(`Unknown tab: ${e}`)}}hideLoadingScreen(){this.loadingElement&&(this.loadingElement.style.opacity="0",setTimeout(()=>{this.loadingElement.style.display="none"},500))}handleNotAuthenticated(){throw this.updateLoadingStatus("No user logged in. Redirecting to home page..."),setTimeout(()=>{window.location.href="index.html"},3e3),new Error("User not authenticated.")}handleNoCountryLinked(){throw this.updateLoadingStatus("You are not linked to a country. Redirecting..."),setTimeout(()=>{window.location.href="index.html"},3e3),new Error("User not linked to a country.")}handleInitializationError(e){console.error("❌ Fatal error initializing Aircraft Creator:",e),this.updateLoadingStatus(`Error: ${e.message}`),this.loadingElement&&(this.loadingElement.innerHTML=`<div class="text-red-400 text-center p-4">${e.message}</div>`)}}async function q(){console.log("🔄 Loading all aircraft components via dynamic import...");try{const[u,e,t,a,s,i,r]=await Promise.all([y(()=>import("./airframes-BQ2DhmGT.js"),[]),y(()=>import("./aircraft_engines-CxKa-iZa.js"),[]),y(()=>import("./aircraft_weapons-D0VVw60T.js"),[]),y(()=>import("./avionics-C4CyQW2d.js"),[]),y(()=>import("./wings-CKabl5NO.js"),[]),y(()=>import("./superchargers-DOJWOdFG.js"),[]),y(()=>import("./special_equipment-Dql9NOlA.js"),[])]);return window.AIRCRAFT_COMPONENTS.airframes=u.airframes,window.AIRCRAFT_COMPONENTS.aircraft_engines=e.aircraft_engines,window.AIRCRAFT_COMPONENTS.aircraft_weapons=t.aircraft_weapons,window.AIRCRAFT_COMPONENTS.avionics=a.avionics,window.AIRCRAFT_COMPONENTS.wing_types=s.wing_types,window.AIRCRAFT_COMPONENTS.wing_features=s.wing_features,window.AIRCRAFT_COMPONENTS.superchargers=i.superchargers,window.AIRCRAFT_COMPONENTS.special_equipment=r.special_equipment,console.log("✅ All components loaded successfully."),!0}catch(u){return console.error("❌ Fatal error loading components dynamically:",u),!1}}window.AIRCRAFT_COMPONENTS={};window.currentAircraft={name:"New Aircraft",airframe:null,engine:null,wings:{type:null,features:[]},supercharger:"none",weapons:[],avionics:[],quantity:1};window.getCurrentUserCountry=()=>window.aircraftCreatorApp?.currentUserCountry;window.selectAirframe=function(u){console.warn("Legacy selectAirframe called. Please update to use the new system."),C.legacyAircraftProxy.airframe=u};window.selectAircraftEngine=function(u){console.warn("Legacy selectAircraftEngine called. Please update to use the new system."),C.legacyAircraftProxy.engine=u};window.toggleAircraftWeapon=function(u){console.warn("Legacy toggleAircraftWeapon called. Please update to use the new system.");const e=C.legacyAircraftProxy.weapons||[],t=e.indexOf(u);t>-1?e.splice(t,1):e.push(u),C.legacyAircraftProxy.weapons=e};window.updateAircraftCalculations=function(){};document.addEventListener("DOMContentLoaded",()=>{window.aircraftCreatorApp=new B,window.aircraftCreatorApp.init()});
