const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/navalProduction-C2TpryFF.js","assets/preload-helper-f85Crcwt.js","assets/firebase-BARDcBiw.js","assets/shipyardSystem-3T5A70zK.js"])))=>i.map(i=>d[i]);
import{_ as p}from"./preload-helper-f85Crcwt.js";/* empty css                                 */import{hulls as h}from"./hulls-CFhq2zY8.js";import{auxiliary_systems as w,boilers as f,propulsion_systems as b}from"./propulsion-Ds8gNL2e.js";import{ammunition_types as y,fire_control_systems as S,gun_mounts as x,naval_guns as _}from"./naval_guns-RPDYGynX.js";import{missile_magazines as C,guidance_systems as N,missile_launchers as $,naval_missiles as A}from"./naval_missiles-1gme3iwB.js";import{searchlights as E,countermeasures as P,depth_charges as D,torpedo_tubes as L,aa_guns as O}from"./secondary_weapons-B2--kRuu.js";import{data_processing as M,navigation_systems as I,electronic_warfare as R,communication_systems as T,sonar_systems as U,radar_systems as k}from"./electronics-CC3zpcSk.js";import{armor_schemes as z,armor_zones as q,armor_materials as j}from"./armor-DmFYxSll.js";const i={hulls:h,propulsion_systems:b,boilers:f,auxiliary_systems:w,naval_guns:_,gun_mounts:x,fire_control_systems:S,ammunition_types:y,naval_missiles:A,missile_launchers:$,guidance_systems:N,missile_magazines:C,aa_guns:O,torpedo_tubes:L,depth_charges:D,countermeasures:P,searchlights:E,radar_systems:k,sonar_systems:U,communication_systems:T,electronic_warfare:R,navigation_systems:I,data_processing:M,armor_materials:j,armor_zones:q,armor_schemes:z};window.NAVAL_COMPONENTS=i;window.currentShip={name:"Novo Navio",hull:null,propulsion:null,armor:{scheme:"unarmored",custom_zones:{belt:"no_armor",deck:"structural_steel",turrets:"no_armor",conning_tower:"structural_steel",barbettes:"no_armor",magazines:"light_armor"}},main_guns:[],secondary_weapons:[],missiles:[],aa_guns:[],torpedo_tubes:[],depth_charges:[],countermeasures:[],searchlights:[],electronics:[],quantity:1};window.loadNavalComponents=async function(){try{return console.log("📦 Loading naval components for War 1954..."),i&&Object.keys(i.hulls||{}).length>0?(console.log(`✅ Loaded ${Object.keys(i.hulls).length} hull types`),console.log(`✅ Loaded ${Object.keys(i.propulsion_systems).length} propulsion systems`),console.log(`✅ Loaded ${Object.keys(i.naval_guns).length} naval guns`),!0):(console.error("❌ Naval components not properly loaded"),!1)}catch(a){return console.error("❌ Error loading naval components:",a),!1}};class B{constructor(){this.initialized=!1,this.performanceCalculator=null,this.costSystem=null}async initialize(){try{if(console.log("🚢 Initializing Naval Creator System..."),!await window.loadNavalComponents())throw new Error("Failed to load naval components");return this.initializeSystems(),this.initialized=!0,console.log("✅ Naval Creator System initialized successfully"),!0}catch(e){return console.error("❌ Naval Creator initialization failed:",e),!1}}initializeSystems(){window.navalPerformanceCalculator&&(this.performanceCalculator=window.navalPerformanceCalculator,console.log("✅ Naval Performance Calculator connected")),window.NavalCostSystem&&(this.costSystem=window.NavalCostSystem,console.log("✅ Naval Cost System connected"))}calculateShipPerformance(e=window.currentShip){return this.performanceCalculator?this.performanceCalculator.calculateShipPerformance(e):(console.warn("⚠️ Performance calculator not available"),{error:"Performance calculator not loaded"})}calculateShipCosts(e=window.currentShip){return this.costSystem?this.costSystem.calculateCosts(e):(console.warn("⚠️ Cost system not available"),{error:"Cost system not loaded"})}validateShipConfiguration(e=window.currentShip){const t=[],s=e.hull?i.hulls[e.hull]:null;if(!s)return t.push("Nenhum casco selecionado"),t;if(e.main_guns&&e.main_guns.length>(s.main_armament_slots||0)&&t.push(`Muito armamento principal: ${e.main_guns.length} > ${s.main_armament_slots} slots disponíveis`),e.secondary_weapons&&e.secondary_weapons.length>(s.secondary_armament_slots||0)&&t.push(`Muitas armas secundárias: ${e.secondary_weapons.length} > ${s.secondary_armament_slots} slots disponíveis`),e.propulsion){const o=i.propulsion_systems[e.propulsion];o&&o.suitable_hulls&&!o.suitable_hulls.includes(s.role)&&t.push(`Sistema de propulsão ${o.name} pode não ser adequado para ${s.role}`)}const n=1954;if(s.year_introduced>n&&t.push(`Casco ${s.name} é muito avançado para ${n}`),e.propulsion){const o=i.propulsion_systems[e.propulsion];o&&o.year_introduced>n&&t.push(`Sistema de propulsão ${o.name} é muito avançado para ${n}`)}return t}exportShipDesign(e=window.currentShip){const t={version:"1.0",created:new Date().toISOString(),ship:{...e},performance:this.calculateShipPerformance(e),costs:this.calculateShipCosts(e)};return JSON.stringify(t,null,2)}importShipDesign(e){try{const t=JSON.parse(e);return t.ship?(window.currentShip={...t.ship},!0):!1}catch(t){return console.error("Error importing ship design:",t),!1}}saveDesignToStorage(e){const t=this.exportShipDesign(),s=JSON.parse(localStorage.getItem("navalDesigns")||"{}");s[e]=t,localStorage.setItem("navalDesigns",JSON.stringify(s))}loadDesignFromStorage(e){const t=JSON.parse(localStorage.getItem("navalDesigns")||"{}");return t[e]?this.importShipDesign(t[e]):!1}getSavedDesigns(){return Object.keys(JSON.parse(localStorage.getItem("navalDesigns")||"{}"))}}window.navalCreator=new B;window.updateShipDisplays=function(a){const e=document.getElementById("total-displacement-display"),t=document.getElementById("max-speed-display"),s=document.getElementById("main-armament-display");document.getElementById("total-cost-display"),e&&a.totalDisplacement&&(e.textContent=Math.round(a.totalDisplacement).toLocaleString()+" t"),t&&a.maxSpeed&&(t.textContent=Math.round(a.maxSpeed)+" nós"),s&&a.mainArmament!==void 0&&(s.textContent=a.mainArmament+" canhões")};window.updateShipName=function(a){window.currentShip.name=a;const e=document.getElementById("ship-name-display");e&&(e.textContent=a)};window.resetShipDesign=function(){window.currentShip={name:"Novo Navio",hull:null,propulsion:null,armor:{scheme:"unarmored",custom_zones:{belt:"no_armor",deck:"structural_steel",turrets:"no_armor",conning_tower:"structural_steel",barbettes:"no_armor",magazines:"light_armor",torpedo_defense:"no_armor"}},main_guns:[],secondary_weapons:[],missiles:[],aa_guns:[],torpedo_tubes:[],depth_charges:[],countermeasures:[],searchlights:[],electronics:[],quantity:1},window.navalCreatorApp&&(window.navalCreatorApp.loadTabContent(window.navalCreatorApp.currentTab),typeof window.updateShipCalculations=="function"&&window.updateShipCalculations())};window.showShipSummaryModal=function(){console.log("🚢 Showing ship summary modal");const a=window.currentShip,e=window.navalCreator.calculateShipPerformance(a),t=window.navalCreator.calculateShipCosts(a),s=window.navalCreator.validateShipConfiguration(a);let n=`
        <div id="ship-summary-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="closeShipSummaryModal()">
            <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto p-6" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-slate-100 flex items-center space-x-2">
                        <span>⚓</span>
                        <span>Ficha Completa do Navio</span>
                    </h2>
                    <button onclick="closeShipSummaryModal()" class="text-slate-400 hover:text-slate-200 text-xl">&times;</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-naval-300 mb-3">📋 Informações Básicas</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Nome:</span>
                                    <span class="text-slate-100">${a.name}</span>
                                </div>
                                ${a.hull?`
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Classe:</span>
                                        <span class="text-slate-100">${i.hulls[a.hull].name}</span>
                                    </div>
                                `:""}
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Ano:</span>
                                    <span class="text-slate-100">1954</span>
                                </div>
                            </div>
                        </div>

                        ${e&&!e.error?`
                            <div class="bg-slate-900/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-blue-300 mb-3">📊 Performance</h3>
                                ${window.NavalPerformanceSystem?window.NavalPerformanceSystem.renderPerformanceDisplay(a):'<p class="text-slate-400">Performance data not available</p>'}
                            </div>
                        `:""}
                    </div>

                    <div class="space-y-4">
                        ${t&&!t.error?`
                            <div class="bg-slate-900/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-green-300 mb-3">💰 Análise de Custos</h3>
                                ${window.NavalCostSystem?window.NavalCostSystem.renderCostDisplay(a):'<p class="text-slate-400">Cost data not available</p>'}
                            </div>
                        `:""}

                        ${s.length>0?`
                            <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-amber-300 mb-3">⚠️ Avisos</h3>
                                <div class="space-y-1 text-sm">
                                    ${s.map(l=>`<div class="text-amber-200">• ${l}</div>`).join("")}
                                </div>
                            </div>
                        `:""}
                    </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                    <button onclick="exportShipDesign()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        📄 Exportar Design
                    </button>
                    <button onclick="closeShipSummaryModal()" class="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;const o=document.getElementById("ship-summary-modal");o&&o.remove(),document.body.insertAdjacentHTML("beforeend",n)};window.closeShipSummaryModal=function(){const a=document.getElementById("ship-summary-modal");a&&a.remove()};window.exportShipDesign=function(){const a=window.navalCreator.exportShipDesign(),e=new Blob([a],{type:"application/json"}),t=URL.createObjectURL(e),s=document.createElement("a");s.href=t,s.download=`${window.currentShip.name.replace(/[^a-z0-9]/gi,"_")}_naval_design.json`,s.click(),URL.revokeObjectURL(t)};window.submitNavalProductionOrder=async function(){try{if(!window.currentShip?.hull){alert("Selecione um casco antes de solicitar produção!");return}const a=window.currentShip,e=window.navalCreator.calculateShipPerformance(a),t=window.navalCreator.calculateShipCosts(a),s=window.navalCreator.validateShipConfiguration(a);if(s.some(n=>n.includes("Nenhum casco"))){alert("Configure o navio antes de solicitar produção!");return}showProductionRequestModal(a,e,t,s)}catch(a){console.error("❌ Erro ao solicitar produção:",a),alert("Erro ao solicitar produção: "+a.message)}};window.showProductionRequestModal=function(a,e,t,s){const n=window.NAVAL_COMPONENTS?.hulls[a.hull];if(!n){alert("Dados do casco não encontrados!");return}const o=document.createElement("div");o.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",o.id="production-request-modal";const l=t?.production||n.cost_base,r=n.production?.build_time_months||24;o.innerHTML=`
        <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-lg w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-green-300">🏭 Solicitar Produção Naval</h3>
                <button onclick="closeProductionRequestModal()" class="text-slate-400 hover:text-slate-200 text-xl">&times;</button>
            </div>
            
            <div class="space-y-4 mb-6">
                <div class="bg-slate-900/50 rounded-lg p-4">
                    <h4 class="font-semibold text-slate-200 mb-2">${a.name}</h4>
                    <div class="text-sm text-slate-400 space-y-1">
                        <div>Tipo: <span class="text-slate-200">${n.name}</span></div>
                        <div>Deslocamento: <span class="text-slate-200">${e.totalDisplacement?.toLocaleString()||"?"} t</span></div>
                        <div>Velocidade: <span class="text-slate-200">${e.maxSpeed||"?"} nós</span></div>
                        <div>Custo unitário: <span class="text-green-300">$${l.toLocaleString()}</span></div>
                        <div>Tempo de construção: <span class="text-orange-300">${r} meses</span></div>
                    </div>
                </div>

                ${s.length>0?`
                    <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                        <h5 class="text-amber-300 font-semibold text-sm mb-2">⚠️ Avisos de Design:</h5>
                        <div class="text-xs text-amber-200 space-y-1">
                            ${s.map(u=>`<div>• ${u}</div>`).join("")}
                        </div>
                    </div>
                `:""}

                <div>
                    <label class="block text-sm font-medium text-slate-200 mb-2">Quantidade a solicitar:</label>
                    <input type="number" 
                           id="production-quantity-input" 
                           min="1" 
                           max="50" 
                           value="1"
                           class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-green-500 focus:outline-none">
                    <div class="text-xs text-slate-400 mt-1">Máximo: 50 unidades por pedido</div>
                </div>

                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-slate-400">Custo total estimado:</span>
                        <span id="total-production-cost" class="text-green-300 font-semibold">$${l.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-3">
                <button onclick="confirmProductionOrder()" class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    🏭 Enviar Solicitação
                </button>
                <button onclick="closeProductionRequestModal()" class="flex-1 px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `,document.body.appendChild(o);const c=o.querySelector("#production-quantity-input"),d=o.querySelector("#total-production-cost");c.addEventListener("input",u=>{const g=parseInt(u.target.value)||1,v=l*g;d.textContent=`$${v.toLocaleString()}`})};window.closeProductionRequestModal=function(){const a=document.getElementById("production-request-modal");a&&a.remove()};window.confirmProductionOrder=async function(){try{const a=document.getElementById("production-quantity-input"),e=parseInt(a.value)||1;if(e<1||e>50){alert("Quantidade deve estar entre 1 e 50");return}const t=window.currentShip,s=window.navalCreator.calculateShipPerformance(t),n=window.navalCreator.calculateShipCosts(t),o={design:{...t},performance:s,costs:n,quantity:e,totalCost:(n?.production||window.NAVAL_COMPONENTS.hulls[t.hull].cost_base)*e,submissionDate:new Date};closeProductionRequestModal(),showShipSummaryModal(),setTimeout(async()=>{try{const l=await F(o);o.sheetImageUrl=l.pngUrl,o.sheetHtmlUrl=l.htmlUrl;const{submitNavalOrderForApproval:r}=await p(async()=>{const{submitNavalOrderForApproval:d}=await import("./navalProduction-C2TpryFF.js");return{submitNavalOrderForApproval:d}},__vite__mapDeps([0,1,2,3])),c=await r(o);if(c.success){closeShipSummaryModal();const d=window.NAVAL_COMPONENTS.hulls[t.hull],u=Math.ceil((d.production?.build_time_months||24)/3);alert(`✅ Solicitação enviada com sucesso!

ID: ${c.id.substring(0,8)}
Quantidade: ${e}x ${t.name}
Tempo estimado: ${u} turnos

Ficha do navio capturada para análise do narrador.`)}}catch(l){console.error("❌ Erro ao capturar ficha:",l),alert("Aviso: Pedido será enviado sem imagem da ficha.");const{submitNavalOrderForApproval:r}=await p(async()=>{const{submitNavalOrderForApproval:d}=await import("./navalProduction-C2TpryFF.js");return{submitNavalOrderForApproval:d}},__vite__mapDeps([0,1,2,3]));(await r(o)).success&&(closeShipSummaryModal(),alert("✅ Solicitação enviada (sem imagem da ficha)"))}},500)}catch(a){console.error("❌ Erro ao confirmar pedido:",a),alert("Erro ao confirmar pedido: "+a.message)}};async function F(a){try{console.log("🚀 === INICIANDO CAPTURA DE FICHA NAVAL ==="),console.log("📋 Dados da submissão:",a);const e=document.querySelector("#ship-summary-modal .bg-slate-800");if(console.log("🎯 Elemento da ficha encontrado:",!!e),!e)throw new Error("Elemento da ficha naval não encontrado");if(console.log("🖼️ html2canvas disponível:",typeof html2canvas<"u"),typeof html2canvas>"u")return console.log("⚠️ html2canvas não disponível, usando método alternativo"),{pngUrl:null,htmlUrl:await m(a)};if(console.log("🔥 Firebase disponível:",!!window.firebase),console.log("☁️ Storage disponível:",!!window.firebase?.storage),!window.firebase?.storage)return console.error("❌ Firebase Storage não disponível!"),{pngUrl:null,htmlUrl:await m(a)};const t={backgroundColor:"#1e293b",width:1200,height:Math.max(e.scrollHeight,800),useCORS:!0,scale:2,logging:!1};console.log("🖼️ Capturando imagem da ficha naval...");const s=await html2canvas(e,t);console.log("✅ Canvas capturado:",s.width+"x"+s.height),console.log("💾 Convertendo para arquivo...");const n=await new Promise(r=>{s.toBlob(r,"image/png",.9)});if(console.log("✅ Blob criado:",n?.size,"bytes"),!n)throw new Error("Falha ao criar blob da imagem");console.log("☁️ Fazendo upload para Firebase Storage...");const o=await V(n,a);console.log("✅ Imagem PNG da ficha naval enviada:",o);const l=await m(a);return{pngUrl:o,htmlUrl:l}}catch(e){console.error("💥 Erro ao capturar ficha naval PNG:",e);try{return console.log("🔄 Tentando método alternativo (HTML apenas)..."),{pngUrl:null,htmlUrl:await m(a)}}catch(t){return console.error("💥 Erro no fallback:",t),{pngUrl:null,htmlUrl:null}}}}async function V(a,e){const t=window.firebase.storage(),s=new Date().toISOString().replace(/[:.]/g,"-"),n=`naval-sheets/${e.design.name}_${s}.png`;console.log("📁 Nome do arquivo:",n);const o=t.ref().child(n);console.log("📤 Iniciando upload...");const l=await o.put(a);console.log("✅ Upload concluído:",l.totalBytes,"bytes");const r=await l.ref.getDownloadURL();return console.log("🔗 URL de download obtida:",r),r}async function m(a){try{const e=H(a),t=new Blob([e],{type:"text/html"}),s=window.firebase.storage(),n=new Date().toISOString().replace(/[:.]/g,"-"),o=`naval-sheets/${a.design.name}_${n}.html`,c=await(await s.ref().child(o).put(t)).ref.getDownloadURL();return console.log("📄 HTML da ficha naval salvo:",c),c}catch(e){return console.error("❌ Erro ao salvar HTML da ficha naval:",e),null}}function H(a){const{design:e,performance:t,costs:s}=a,n=window.NAVAL_COMPONENTS?.hulls[e.hull];return`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ficha Naval - ${e.name}</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; background: #1e293b; color: #e2e8f0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .section { background: #334155; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
            .title { color: #3b82f6; font-size: 24px; margin-bottom: 20px; }
            .subtitle { color: #10b981; font-size: 18px; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .stat { display: flex; justify-content: space-between; margin: 4px 0; }
            .stat-label { color: #94a3b8; }
            .stat-value { color: #e2e8f0; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">⚓ ${e.name}</h1>
            
            <div class="section">
                <h2 class="subtitle">📋 Informações Básicas</h2>
                <div class="stat">
                    <span class="stat-label">Classe:</span>
                    <span class="stat-value">${n?.name||"Desconhecido"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Deslocamento:</span>
                    <span class="stat-value">${t?.totalDisplacement||"N/A"} t</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Velocidade Máxima:</span>
                    <span class="stat-value">${t?.maxSpeed||"N/A"} nós</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Tripulação:</span>
                    <span class="stat-value">${t?.crewSize||"N/A"}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">💰 Custos</h2>
                <div class="stat">
                    <span class="stat-label">Custo de Produção:</span>
                    <span class="stat-value">$${s?.production?.toLocaleString()||"N/A"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Custo Total:</span>
                    <span class="stat-value">$${s?.total_ownership?.toLocaleString()||"N/A"}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">⚔️ Armamento</h2>
                <div class="stat">
                    <span class="stat-label">Armas Principais:</span>
                    <span class="stat-value">${e.main_guns?.length||0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Mísseis:</span>
                    <span class="stat-value">${e.missiles?.length||0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Armamento AA:</span>
                    <span class="stat-value">${e.aa_guns?.length||0}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">📊 Performance</h2>
                <div class="stat">
                    <span class="stat-label">Rating AA:</span>
                    <span class="stat-value">${t?.aaRating||"N/A"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Manobrabilidade:</span>
                    <span class="stat-value">${t?.maneuverability||"N/A"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Estabilidade:</span>
                    <span class="stat-value">${t?.stability||"N/A"}</span>
                </div>
            </div>
            
            <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 32px;">
                Ficha gerada automaticamente pelo Sistema Naval WAR 1954<br>
                ${new Date().toLocaleString("pt-BR")}
            </p>
        </div>
    </body>
    </html>
    `}document.addEventListener("DOMContentLoaded",async()=>{console.log("🚢 Starting Naval Creator initialization..."),await window.navalCreator.initialize()});console.log("✅ Naval Creator main system loaded");
