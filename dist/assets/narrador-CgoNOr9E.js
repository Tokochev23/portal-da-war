const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-BARDcBiw.js","assets/preload-helper-f85Crcwt.js","assets/energyPenaltyProcessor-DXz3MIMO.js","assets/economicCalculations-CFI81dyR.js","assets/assign-resource-potentials-_fSq7czn.js","assets/apply-resource-consumption-Da8rkBTR.js","assets/resourceConsumptionCalculator-dQu245X_.js","assets/apply-resource-production-ClO-bSCB.js","assets/resourceProductionCalculator-b8MxHWSv.js","assets/apply-consumer-goods-Wm1JbdVZ.js","assets/consumerGoodsCalculator-Bg6C08yH.js","assets/turnProcessor-DbjJNSva.js","assets/turnEventsSystem-hr3kPmn_.js","assets/espionageOperationsSystem-yA0URGjb.js"])))=>i.map(i=>d[i]);
import{_ as I}from"./preload-helper-f85Crcwt.js";/* empty css             */import{h as p,a as B,L as d,b as g,n as L,j as Z,g as re,u as be,e as ne,d as ye}from"./firebase-BARDcBiw.js";import{NavalProductionSystem as fe}from"./navalProduction-C2TpryFF.js";import{c as xe,f as ie,E as k,a as Y,P as we,b as ce}from"./economicCalculations-CFI81dyR.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"./shipyardSystem-3T5A70zK.js";class Ce{constructor(){this.inventories=new Map,this.categories=[{id:"MBT",name:"Main Battle Tank",icon:"🛡️",type:"vehicle"},{id:"Medium Tank",name:"Tanque Médio",icon:"⚙️",type:"vehicle"},{id:"Light Tank",name:"Tanque Leve",icon:"🏃",type:"vehicle"},{id:"IFV",name:"Infantry Fighting Vehicle",icon:"👥",type:"vehicle"},{id:"APC",name:"Armored Personnel Carrier",icon:"🚐",type:"vehicle"},{id:"SPG",name:"Self-Propelled Gun",icon:"💥",type:"vehicle"},{id:"SPH",name:"Self-Propelled Howitzer",icon:"🎯",type:"vehicle"},{id:"SPAA",name:"Self-Propelled Anti-Aircraft",icon:"🎪",type:"vehicle"},{id:"Other",name:"Outros Veículos",icon:"🔧",type:"vehicle"},{id:"Couraçados",name:"Couraçados",icon:"⚓",type:"naval"},{id:"Cruzadores",name:"Cruzadores",icon:"🚢",type:"naval"},{id:"Destróieres",name:"Destróieres",icon:"🛥️",type:"naval"},{id:"Fragatas",name:"Fragatas",icon:"🚤",type:"naval"},{id:"Corvetas",name:"Corvetas",icon:"⛵",type:"naval"},{id:"Submarinos",name:"Submarinos",icon:"🤿",type:"naval"},{id:"Porta-aviões",name:"Porta-aviões",icon:"🛩️",type:"naval"},{id:"Patrulhas",name:"Patrulhas",icon:"🚨",type:"naval"},{id:"Auxiliares",name:"Auxiliares",icon:"🔧",type:"naval"},{id:"Naval - Outros",name:"Outros Navios",icon:"🌊",type:"naval"}],this.selectedCountry=null,this.typeFilter="all",this.componentNames={gasoline_v8_medium:"Motor V8 a Gasolina Médio",diesel_v12_heavy:"Motor V12 Diesel Pesado",gasoline_inline6_light:"Motor I6 a Gasolina Leve",diesel_v8_medium:"Motor V8 Diesel Médio",gasoline_v12_heavy:"Motor V12 a Gasolina Pesado",mbt_medium:"Chassi MBT Médio",light_tank:"Chassi Tanque Leve",heavy_tank:"Chassi Tanque Pesado",spg_chassis:"Chassi SPG",apc_chassis:"Chassi APC",ifv_chassis:"Chassi IFV",standard:"Padrão",advanced:"Avançado",basic:"Básico"}}async initialize(){console.log("📦 Inicializando sistema de inventário..."),this.render(),setInterval(()=>this.refreshCurrentInventory(),6e4)}render(){const e=document.getElementById("inventory-system-anchor");if(!e){console.warn("⚠️ Âncora inventory-system-anchor não encontrada");return}const t=document.getElementById("inventory-system-section");t&&t.remove();const a=document.createElement("div");a.id="inventory-system-section",a.innerHTML=this.getHTML(),e.parentNode.insertBefore(a,e.nextSibling),this.setupEventListeners()}setupEventListeners(){document.addEventListener("click",t=>{if(t.target.matches("[data-load-inventory]")){const a=t.target.dataset.loadInventory;this.loadCountryInventory(a)}if(t.target.id==="refresh-inventory"&&this.refreshCurrentInventory(),t.target.id==="export-inventory"&&this.exportInventory(),t.target.matches("[data-edit-quantity]")){const a=t.target.dataset.editQuantity,o=t.target.dataset.category;this.editVehicleQuantity(o,a)}if(t.target.matches("[data-remove-vehicle]")){const a=t.target.dataset.removeVehicle,o=t.target.dataset.category;this.removeVehicle(o,a)}if(t.target.matches("[data-view-category]")||t.target.closest("[data-view-category]")){const o=(t.target.matches("[data-view-category]")?t.target:t.target.closest("[data-view-category]")).dataset.viewCategory;this.showCategoryModal(o)}if(t.target.matches("[data-view-vehicle-sheet]")){const a=t.target.dataset.viewVehicleSheet,o=t.target.dataset.category;this.showVehicleSheet(o,a)}t.target.matches("[data-filter-type]")&&(this.typeFilter=t.target.dataset.filterType,this.renderInventoryContent())});const e=document.getElementById("inventory-country-select");e&&e.addEventListener("change",t=>{t.target.value?this.loadCountryInventory(t.target.value):(this.selectedCountry=null,this.renderInventoryContent())})}getHTML(){return`
            <div class="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 p-5 mt-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-emerald-200">📦 Sistema de Inventário</h2>
                        <p class="text-xs text-slate-400 mt-1">Gerenciar veículos aprovados por país e categoria</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="refresh-inventory" class="rounded-lg border border-emerald-500/50 text-emerald-200 px-3 py-1.5 text-sm hover:bg-emerald-500/10 transition-colors">
                            🔄 Atualizar
                        </button>
                        <button id="export-inventory" class="rounded-lg border border-emerald-500/50 text-emerald-200 px-3 py-1.5 text-sm hover:bg-emerald-500/10 transition-colors">
                            📁 Exportar
                        </button>
                    </div>
                </div>
                
                <!-- Country Selector -->
                <div class="mb-4">
                    <label class="text-xs text-slate-400 mb-2 block">Selecionar País:</label>
                    <select id="inventory-country-select" class="w-full max-w-md rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50">
                        <option value="">Selecione um país...</option>
                    </select>
                </div>
                
                <!-- Inventory Content -->
                <div id="inventory-content">
                    <div class="text-center py-8 text-slate-400">
                        <div class="text-2xl mb-2">📦</div>
                        <div class="text-sm">Selecione um país para visualizar o inventário</div>
                    </div>
                </div>
            </div>
        `}async loadCountryInventory(e){try{console.log(`📦 Carregando inventário para ${e}...`),this.selectedCountry=e;const t=await p.collection("inventory").doc(e).get();let a={};t.exists&&(a=t.data()),this.inventories.set(e,a);const o=await p.collection("paises").doc(e).get(),s=o.exists?o.data().Pais:e;this.renderInventoryContent(a,s),console.log(`✅ Inventário de ${s} carregado`)}catch(t){console.error("❌ Erro ao carregar inventário:",t),this.renderInventoryError("Erro ao carregar inventário: "+t.message)}}async refreshCurrentInventory(){this.selectedCountry&&await this.loadCountryInventory(this.selectedCountry)}renderInventoryContent(e={},t=null){const a=document.getElementById("inventory-content");if(!a)return;if(!this.selectedCountry){a.innerHTML=`
                <div class="text-center py-8 text-slate-400">
                    <div class="text-2xl mb-2">📦</div>
                    <div class="text-sm">Selecione um país para visualizar o inventário</div>
                </div>
            `;return}const o=this.calculateTotalVehicles(e),s=this.calculateTotalValue(e),r=this.getFilteredCategories();a.innerHTML=`
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-emerald-200">
                        🏠 ${t||this.selectedCountry}
                    </h3>
                    <div class="text-sm text-slate-400">
                        <span class="font-semibold text-emerald-300">${o}</span> unidades • 
                        <span class="font-semibold text-emerald-300">$${s.toLocaleString()}</span> valor total
                    </div>
                </div>
                
                <!-- Type Filter -->
                <div class="flex gap-2 mb-4">
                    <button data-filter-type="all" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.typeFilter==="all"?"bg-emerald-500 text-slate-900 font-semibold":"border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10"}">
                        🌟 Todos
                    </button>
                    <button data-filter-type="vehicle" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.typeFilter==="vehicle"?"bg-blue-500 text-slate-900 font-semibold":"border border-blue-500/30 text-blue-200 hover:bg-blue-500/10"}">
                        🚗 Veículos
                    </button>
                    <button data-filter-type="naval" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.typeFilter==="naval"?"bg-cyan-500 text-slate-900 font-semibold":"border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10"}">
                        🚢 Naval
                    </button>
                </div>
            </div>
            
            <!-- Categories Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${r.map(n=>this.renderCategoryCard(n,e[n.id]||{})).join("")}
            </div>
        `,this.loadCountryOptions()}getFilteredCategories(){return this.typeFilter==="all"?this.categories:this.categories.filter(e=>e.type===this.typeFilter)}renderCategoryCard(e,t){const a=Object.keys(t).length,o=Object.values(t).reduce((r,n)=>r+(n.quantity||0),0),s=Object.values(t).reduce((r,n)=>r+(n.cost||0)*(n.quantity||0),0);return`
            <div class="bg-bg/30 border border-emerald-500/20 rounded-lg p-4 hover:bg-bg/50 transition-colors cursor-pointer" 
                 data-view-category="${e.id}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${e.icon}</span>
                        <div>
                            <div class="font-semibold text-emerald-200">${e.name}</div>
                            <div class="text-xs text-slate-400">${a} modelos • ${o} unidades</div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-slate-400">$${s.toLocaleString()}</div>
                        <div class="text-xs text-emerald-300 mt-1">👁️ Ver Detalhes</div>
                    </div>
                </div>
                
                <!-- Quick preview of vehicles -->
                <div class="space-y-1 max-h-20 overflow-hidden">
                    ${Object.keys(t).length===0?`
                        <div class="text-center text-slate-500 text-xs py-2">
                            Nenhum veículo nesta categoria
                        </div>
                    `:Object.entries(t).slice(0,2).map(([r,n])=>`
                        <div class="text-xs text-slate-400 flex justify-between">
                            <span>• ${r}</span>
                            <span>${n.quantity||0}x</span>
                        </div>
                    `).join("")+(Object.keys(t).length>2?`
                        <div class="text-xs text-slate-500 text-center">
                            +${Object.keys(t).length-2} mais...
                        </div>
                    `:"")}
                </div>
            </div>
        `}renderInventoryError(e){const t=document.getElementById("inventory-content");t&&(t.innerHTML=`
            <div class="text-center py-8 text-red-400">
                <div class="text-2xl mb-2">⚠️</div>
                <div class="text-sm">${e}</div>
            </div>
        `)}calculateTotalVehicles(e){let t=0;for(const a of Object.values(e))for(const o of Object.values(a))t+=o.quantity||0;return t}calculateTotalValue(e){let t=0;for(const a of Object.values(e))for(const o of Object.values(a))t+=(o.cost||0)*(o.quantity||0);return t}async loadCountryOptions(){try{const e=document.getElementById("inventory-country-select");if(!e||e.children.length>1)return;const a=(await p.collection("paises").get()).docs.map(s=>({id:s.id,name:s.data().Pais||s.id})).sort((s,r)=>s.name.localeCompare(r.name)),o=e.value;e.innerHTML='<option value="">Selecione um país...</option>',a.forEach(s=>{const r=document.createElement("option");r.value=s.id,r.textContent=s.name,s.id===o&&(r.selected=!0),e.appendChild(r)})}catch(e){console.error("❌ Erro ao carregar países:",e)}}async editVehicleQuantity(e,t){try{const a=this.inventories.get(this.selectedCountry)||{},o=a[e]?.[t];if(!o){alert("Veículo não encontrado");return}const s=prompt(`Alterar quantidade de "${t}":
Quantidade atual: ${o.quantity||0}`,o.quantity||0);if(s===null)return;const r=parseInt(s);if(isNaN(r)||r<0){alert("Quantidade inválida");return}a[e]||(a[e]={}),a[e][t].quantity=r,await p.collection("inventory").doc(this.selectedCountry).set(a,{merge:!0}),this.renderInventoryContent(a,this.selectedCountry),console.log(`✅ Quantidade de "${t}" atualizada para ${r}`)}catch(a){console.error("❌ Erro ao editar quantidade:",a),alert("Erro ao atualizar quantidade: "+a.message)}}async removeVehicle(e,t){try{if(!confirm(`Remover "${t}" do inventário?`))return;const a=this.inventories.get(this.selectedCountry)||{};a[e]&&a[e][t]&&(delete a[e][t],Object.keys(a[e]).length===0&&delete a[e],await p.collection("inventory").doc(this.selectedCountry).set(a,{merge:!0}),this.renderInventoryContent(a,this.selectedCountry),console.log(`✅ "${t}" removido do inventário`))}catch(a){console.error("❌ Erro ao remover veículo:",a),alert("Erro ao remover veículo: "+a.message)}}async exportInventory(){if(!this.selectedCountry){alert("Selecione um país primeiro");return}try{const e=this.inventories.get(this.selectedCountry)||{},t=JSON.stringify(e,null,2),a=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(a),s=document.createElement("a");s.href=o,s.download=`inventario_${this.selectedCountry}_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(o),console.log("✅ Inventário exportado")}catch(e){console.error("❌ Erro ao exportar inventário:",e),alert("Erro ao exportar: "+e.message)}}showCategoryModal(e){if(!this.selectedCountry){alert("Selecione um país primeiro");return}const a=(this.inventories.get(this.selectedCountry)||{})[e]||{},o=this.categories.find(l=>l.id===e);if(!o){alert("Categoria não encontrada");return}const s=document.getElementById("category-inventory-modal");s&&s.remove();const r=document.createElement("div");r.id="category-inventory-modal",r.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",r.style.zIndex="9999";const n=Object.keys(a).length,i=Object.values(a).reduce((l,u)=>l+(u.quantity||0),0),c=Object.values(a).reduce((l,u)=>l+(u.cost||0)*(u.quantity||0),0);r.innerHTML=`
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${o.icon}</span>
                        <div>
                            <h3 class="text-xl font-bold text-slate-100">${o.name}</h3>
                            <p class="text-sm text-slate-400">${this.getCountryDisplayName()} - ${n} modelos • ${i} unidades</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-semibold text-emerald-300">$${c.toLocaleString()}</div>
                        <button onclick="document.getElementById('category-inventory-modal').remove()" 
                                class="text-slate-400 hover:text-slate-200 text-2xl mt-2">×</button>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-auto p-6">
                    ${Object.keys(a).length===0?`
                        <div class="text-center py-12 text-slate-400">
                            <div class="text-4xl mb-4">${o.icon}</div>
                            <div class="text-lg">Nenhum veículo nesta categoria</div>
                            <div class="text-sm mt-2">Aprove alguns projetos de ${o.name.toLowerCase()} para vê-los aqui</div>
                        </div>
                    `:`
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${Object.entries(a).map(([l,u])=>this.renderVehicleCard(l,u,e)).join("")}
                        </div>
                    `}
                </div>
            </div>
        `,r.addEventListener("click",l=>{l.target===r&&r.remove()}),document.addEventListener("keydown",function l(u){u.key==="Escape"&&(r.remove(),document.removeEventListener("keydown",l))}),document.body.appendChild(r)}renderVehicleCard(e,t,a){const o=(t.cost||0)*(t.quantity||0),s=t.sheetImageUrl||t.sheetHtmlUrl||t.specs,r=t.specs||{},n=t.maintenanceCost||t.costs?.maintenance||0,i=n*(t.quantity||0);return`
            <div class="bg-slate-900/50 rounded-lg p-5 border border-slate-600/30 hover:border-slate-500/50 transition-colors">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-100 mb-2 text-lg">${e}</h4>
                        
                        <!-- Informações básicas -->
                        <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-300 mb-3">
                            <div>📦 <strong class="text-emerald-400">Quantidade:</strong> ${t.quantity||0}</div>
                            <div>💰 <strong class="text-emerald-400">Custo unit.:</strong> $${(t.cost||0).toLocaleString()}</div>
                            <div>💎 <strong class="text-emerald-400">Valor total:</strong> $${o.toLocaleString()}</div>
                            <div>📅 <strong class="text-emerald-400">Aprovado:</strong> ${t.approvedDate?new Date(t.approvedDate).toLocaleDateString("pt-BR"):"N/A"}</div>
                            <div>🔧 <strong class="text-yellow-400">Manutenção unit.:</strong> $${n.toLocaleString()}/ano</div>
                            <div>🛠️ <strong class="text-yellow-400">Manutenção total:</strong> $${i.toLocaleString()}/ano</div>
                        </div>
                        
                        <!-- Especificações técnicas expandidas -->
                        ${r?`
                            <div class="bg-slate-800/30 rounded-lg p-3 mt-3">
                                <h5 class="text-xs font-semibold text-slate-300 mb-2 flex items-center">
                                    ⚙️ Especificações Técnicas
                                </h5>
                                <div class="grid grid-cols-1 gap-2 text-xs">
                                    ${r.engine?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🔧 Motor:</span>
                                            <span class="text-blue-300 font-medium">${this.getReadableComponentName(r.engine)}</span>
                                        </div>
                                    `:""}
                                    
                                    ${r.chassis?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🏗️ Chassi:</span>
                                            <span class="text-blue-300 font-medium">${this.getReadableComponentName(r.chassis)}</span>
                                        </div>
                                    `:""}
                                    
                                    ${r.armor_thickness?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🛡️ Blindagem:</span>
                                            <span class="text-yellow-300 font-medium">${r.armor_thickness}mm</span>
                                        </div>
                                    `:""}
                                    
                                    ${r.main_gun_caliber?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🎯 Armamento:</span>
                                            <span class="text-red-300 font-medium">${r.main_gun_caliber}mm</span>
                                        </div>
                                    `:""}
                                    
                                    ${r.weight?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⚖️ Peso:</span>
                                            <span class="text-slate-300 font-medium">${r.weight}t</span>
                                        </div>
                                    `:""}
                                    
                                    ${r.max_speed?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⚡ Velocidade:</span>
                                            <span class="text-green-300 font-medium">${r.max_speed} km/h</span>
                                        </div>
                                    `:""}
                                    
                                    ${r.crew_size?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">👥 Tripulação:</span>
                                            <span class="text-cyan-300 font-medium">${r.crew_size}</span>
                                        </div>
                                    `:""}
                                    
                                    ${r.fuel_capacity?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⛽ Combustível:</span>
                                            <span class="text-slate-300 font-medium">${r.fuel_capacity}L</span>
                                        </div>
                                    `:""}
                                </div>
                                
                                <!-- Performance indicators -->
                                ${r.penetration||r.protection||r.mobility?`
                                    <div class="mt-3 pt-2 border-t border-slate-700/50">
                                        <h6 class="text-xs font-semibold text-slate-400 mb-2">📊 Indicadores</h6>
                                        <div class="grid grid-cols-3 gap-3 text-xs">
                                            ${r.penetration?`
                                                <div class="text-center">
                                                    <div class="text-red-400 font-bold">${r.penetration}mm</div>
                                                    <div class="text-slate-500">Penetração</div>
                                                </div>
                                            `:""}
                                            ${r.protection?`
                                                <div class="text-center">
                                                    <div class="text-yellow-400 font-bold">${r.protection}mm</div>
                                                    <div class="text-slate-500">Proteção</div>
                                                </div>
                                            `:""}
                                            ${r.mobility?`
                                                <div class="text-center">
                                                    <div class="text-green-400 font-bold">${r.mobility}</div>
                                                    <div class="text-slate-500">Mobilidade</div>
                                                </div>
                                            `:""}
                                        </div>
                                    </div>
                                `:""}
                            </div>
                        `:""}
                    </div>
                    
                    <div class="flex flex-col gap-2 min-w-28 ml-4">
                        ${s?`
                            <button data-view-vehicle-sheet="${e}" data-category="${a}"
                                    class="px-3 py-2 text-xs rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-200 hover:bg-blue-500/30 transition-colors font-medium">
                                🖼️ Ver Ficha
                            </button>
                        `:""}
                        
                        <button data-edit-quantity="${e}" data-category="${a}" 
                                class="px-3 py-2 text-xs rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30 transition-colors font-medium">
                            ✏️ Editar Qtd
                        </button>
                        
                        <button data-remove-vehicle="${e}" data-category="${a}" 
                                class="px-3 py-2 text-xs rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 transition-colors font-medium">
                            🗑️ Remover
                        </button>
                    </div>
                </div>
            </div>
        `}showVehicleSheet(e,t){if(!this.selectedCountry){alert("Selecione um país primeiro");return}const o=(this.inventories.get(this.selectedCountry)||{})[e]?.[t];if(!o){alert("Dados do veículo não encontrados");return}let s=null,r="none";if(o.sheetImageUrl&&o.sheetImageUrl.startsWith("http")?(s=o.sheetImageUrl,r="image"):o.sheetHtmlUrl&&o.sheetHtmlUrl.startsWith("http")?(s=o.sheetHtmlUrl,r="html"):o.sheetImageUrl&&o.sheetImageUrl.startsWith("data:")&&(s=o.sheetImageUrl,r="data"),!s){this.showBasicVehicleInfo(t,o);return}const n=document.getElementById("vehicle-sheet-modal");n&&n.remove();const i=document.createElement("div");i.id="vehicle-sheet-modal",i.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",i.style.zIndex="10000",i.innerHTML=`
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-slate-600">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-200">🖼️ Ficha Técnica</h3>
                        <p class="text-sm text-slate-400">${t} - ${this.getCountryDisplayName()}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.open('${s}', '_blank')" 
                                class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10">
                            🔗 Nova Aba
                        </button>
                        <button onclick="document.getElementById('vehicle-sheet-modal').remove()" 
                                class="text-slate-400 hover:text-slate-200 text-xl p-1">×</button>
                    </div>
                </div>
                
                <div class="flex-1 overflow-auto p-4">
                    ${r==="image"?`
                        <div class="text-center">
                            <img src="${s}" alt="Ficha do Veículo" 
                                 class="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
                                 style="max-height: 70vh;" />
                        </div>
                    `:r==="html"||r==="data"?`
                        <iframe src="${s}" 
                                style="width: 100%; height: 70vh; border: none; border-radius: 8px;"></iframe>
                    `:`
                        <div class="text-center py-8 text-red-400">
                            Formato de ficha não suportado
                        </div>
                    `}
                </div>
            </div>
        `,i.addEventListener("click",c=>{c.target===i&&i.remove()}),document.addEventListener("keydown",function c(l){l.key==="Escape"&&(i.remove(),document.removeEventListener("keydown",c))}),document.body.appendChild(i)}showBasicVehicleInfo(e,t){const a=document.createElement("div");a.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.style.zIndex="10000",a.innerHTML=`
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-2xl w-full p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-slate-100">📋 ${e}</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-900/50 rounded-lg p-4">
                        <h4 class="text-emerald-300 font-semibold mb-2">📊 Informações Gerais</h4>
                        <div class="space-y-2 text-sm text-slate-300">
                            <div>Quantidade: ${t.quantity||0}</div>
                            <div>Custo unitário: $${(t.cost||0).toLocaleString()}</div>
                            <div>Valor total: $${((t.cost||0)*(t.quantity||0)).toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-900/50 rounded-lg p-4">
                        <h4 class="text-blue-300 font-semibold mb-2">⚙️ Especificações</h4>
                        <div class="space-y-2 text-sm text-slate-300">
                            ${t.specs?`
                                <div>Motor: ${this.getReadableComponentName(t.specs.engine)}</div>
                                <div>Chassi: ${this.getReadableComponentName(t.specs.chassis)}</div>
                                <div>Blindagem: ${t.specs.armor_thickness||"N/A"}mm</div>
                                <div>Armamento: ${t.specs.main_gun_caliber||"N/A"}mm</div>
                            `:'<div class="text-slate-400">Especificações não disponíveis</div>'}
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 text-center">
                    <div class="text-sm text-slate-400">Ficha detalhada não disponível para este veículo</div>
                </div>
            </div>
        `,a.addEventListener("click",o=>{o.target===a&&a.remove()}),document.body.appendChild(a)}getCountryDisplayName(){if(!this.selectedCountry)return"País Desconhecido";const e=document.getElementById("inventory-country-select");if(e){const t=e.querySelector(`option[value="${this.selectedCountry}"]`);if(t)return t.textContent}return this.selectedCountry}getReadableComponentName(e){return e?this.componentNames[e]?this.componentNames[e]:e.replace(/_/g," ").replace(/([a-z])([A-Z])/g,"$1 $2").split(" ").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"N/A"}}class Ee{constructor(){this.batchQueue=[],this.batchTimer=null,this.batchDelay=500}async recordChange({countryId:e,section:t,field:a,oldValue:o,newValue:s,userId:r=null,userName:n=null,reason:i=null,metadata:c={}}){try{const l=B.currentUser;if(!l&&!r)throw new Error("Usuário não autenticado");const u={countryId:e,section:t,field:a,oldValue:this.sanitizeValue(o),newValue:this.sanitizeValue(s),userId:r||l.uid,userName:n||l.displayName||"Sistema",timestamp:new Date,reason:i,metadata:{userAgent:navigator.userAgent,platform:navigator.platform,...c},changeType:this.getChangeType(o,s),delta:this.calculateDelta(o,s),severity:this.calculateSeverity(t,a,o,s)};return this.batchQueue.push(u),this.scheduleBatchWrite(),d.debug("Mudança registrada:",u),u}catch(l){throw d.error("Erro ao registrar mudança:",l),l}}async recordBatchChanges(e,t=null){try{const a=p.batch(),o=new Date,s=B.currentUser,r=this.generateBatchId();return e.forEach(n=>{const i={...n,batchId:r,userId:s?.uid,userName:s?.displayName||"Sistema",timestamp:o,reason:t,changeType:this.getChangeType(n.oldValue,n.newValue),delta:this.calculateDelta(n.oldValue,n.newValue),severity:this.calculateSeverity(n.section,n.field,n.oldValue,n.newValue)},c=p.collection("changeHistory").doc();a.set(c,i)}),await a.commit(),d.info(`Lote de ${e.length} mudanças registrado com ID: ${r}`),r}catch(a){throw d.error("Erro ao registrar mudanças em lote:",a),a}}async applyRealTimeChange({countryId:e,section:t,field:a,newValue:o,reason:s=null,skipHistory:r=!1}){try{const n=p.collection("paises").doc(e),i=await n.get();if(!i.exists)throw new Error(`País ${e} não encontrado`);const u=(i.data()[t]||{})[a];this.validateChange(t,a,u,o);const f={[`${t}.${a}`]:o,[`${t}.lastModified`]:new Date,[`${t}.lastModifiedBy`]:B.currentUser?.uid};return await n.update(f),r||await this.recordChange({countryId:e,section:t,field:a,oldValue:u,newValue:o,reason:s}),this.broadcastChange({countryId:e,section:t,field:a,oldValue:u,newValue:o,timestamp:new Date}),d.info(`Mudança aplicada em tempo real: ${e}.${t}.${a}`),!0}catch(n){throw d.error("Erro ao aplicar mudança em tempo real:",n),g("error",`Erro ao aplicar mudança: ${n.message}`),n}}async getChangeHistory({countryId:e=null,section:t=null,field:a=null,userId:o=null,startDate:s=null,endDate:r=null,limit:n=50,orderBy:i="timestamp",orderDirection:c="desc"}={}){try{let l=p.collection("changeHistory");e&&(l=l.where("countryId","==",e)),t&&(l=l.where("section","==",t)),a&&(l=l.where("field","==",a)),o&&(l=l.where("userId","==",o)),s&&(l=l.where("timestamp",">=",s)),r&&(l=l.where("timestamp","<=",r)),l=l.orderBy(i,c),n&&(l=l.limit(n));const v=(await l.get()).docs.map(f=>({id:f.id,...f.data(),timestamp:f.data().timestamp.toDate()}));return d.debug(`Histórico recuperado: ${v.length} mudanças`),v}catch(l){throw d.error("Erro ao buscar histórico:",l),l}}async rollbackChange(e,t=null){try{const a=await p.collection("changeHistory").doc(e).get();if(!a.exists)throw new Error("Mudança não encontrada");const o=a.data(),{countryId:s,section:r,field:n,oldValue:i,newValue:c}=o,l=await p.collection("paises").doc(s).get();if(!l.exists)throw new Error("País não existe mais");const v=l.data()[r]?.[n];if(!this.valuesEqual(v,c))throw new Error("O valor foi modificado após esta mudança. Rollback automático não é seguro.");return await this.applyRealTimeChange({countryId:s,section:r,field:n,newValue:i,reason:`ROLLBACK: ${t||"Revertido pelo narrador"}`,skipHistory:!1}),await p.collection("changeHistory").doc(e).update({rolledBack:!0,rollbackTimestamp:new Date,rollbackUserId:B.currentUser?.uid,rollbackReason:t}),g("success","Mudança revertida com sucesso"),d.info(`Rollback executado para mudança: ${e}`),!0}catch(a){throw d.error("Erro no rollback:",a),g("error",`Erro no rollback: ${a.message}`),a}}async rollbackBatch(e,t=null){try{const a=await p.collection("changeHistory").where("batchId","==",e).where("rolledBack","!=",!0).orderBy("timestamp","desc").get();if(a.empty)throw new Error("Nenhuma mudança encontrada para este lote");const o=[];return a.forEach(s=>{o.push(this.rollbackChange(s.id,t))}),await Promise.all(o),g("success",`Lote de ${o.length} mudanças revertido`),!0}catch(a){throw d.error("Erro no rollback do lote:",a),g("error",`Erro no rollback do lote: ${a.message}`),a}}async getHistoryStats(e=null,t=30){try{const a=new Date;a.setDate(a.getDate()-t);let o=p.collection("changeHistory").where("timestamp",">=",a);e&&(o=o.where("countryId","==",e));const r=(await o.get()).docs.map(i=>i.data()),n={totalChanges:r.length,bySection:{},byUser:{},bySeverity:{low:0,medium:0,high:0,critical:0},dailyActivity:{},mostActiveFields:{},rollbackRate:0};return r.forEach(i=>{n.bySection[i.section]||(n.bySection[i.section]=0),n.bySection[i.section]++,n.byUser[i.userName]||(n.byUser[i.userName]=0),n.byUser[i.userName]++,i.severity&&n.bySeverity[i.severity]++;const c=i.timestamp.toDate().toISOString().split("T")[0];n.dailyActivity[c]||(n.dailyActivity[c]=0),n.dailyActivity[c]++;const l=`${i.section}.${i.field}`;n.mostActiveFields[l]||(n.mostActiveFields[l]=0),n.mostActiveFields[l]++,i.rolledBack&&n.rollbackRate++}),n.rollbackRate=n.totalChanges>0?n.rollbackRate/n.totalChanges*100:0,n}catch(a){throw d.error("Erro ao gerar estatísticas:",a),a}}sanitizeValue(e){return e==null?null:typeof e=="object"?JSON.parse(JSON.stringify(e)):e}getChangeType(e,t){return e==null?"create":t==null?"delete":"update"}calculateDelta(e,t){return typeof e=="number"&&typeof t=="number"?{absolute:t-e,percentage:e!==0?(t-e)/e*100:null}:null}calculateSeverity(e,t,a,o){const s=["PIB","Estabilidade","Populacao"],r=["geral","exercito"];if(s.includes(t)){const n=this.calculateDelta(a,o);return n&&Math.abs(n.percentage)>50?"critical":n&&Math.abs(n.percentage)>20?"high":"medium"}return r.includes(e)?"medium":"low"}validateChange(e,t,a,o){if(t==="PIB"&&o<0)throw new Error("PIB não pode ser negativo");if(t==="Estabilidade"&&(o<0||o>100))throw new Error("Estabilidade deve estar entre 0 e 100");if(t==="Populacao"&&o<0)throw new Error("População não pode ser negativa")}valuesEqual(e,t){return e===t?!0:typeof e=="object"&&typeof t=="object"?JSON.stringify(e)===JSON.stringify(t):!1}generateBatchId(){return`batch_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}scheduleBatchWrite(){this.batchTimer&&clearTimeout(this.batchTimer),this.batchTimer=setTimeout(async()=>{if(this.batchQueue.length!==0)try{const e=p.batch(),t=[...this.batchQueue];this.batchQueue=[],t.forEach(a=>{const o=p.collection("changeHistory").doc();e.set(o,a)}),await e.commit(),d.debug(`Lote de ${t.length} mudanças salvo no histórico`)}catch(e){d.error("Erro ao salvar lote no histórico:",e),this.batchQueue.unshift(...this.batchQueue)}},this.batchDelay)}broadcastChange(e){window.dispatchEvent(new CustomEvent("country:changed",{detail:e}))}}const O=new Ee;class $e{constructor(){this.listeners=new Map,this.pendingChanges=new Map,this.isOnline=navigator.onLine,this.setupConnectionHandlers()}async updateField({countryId:e,section:t,field:a,value:o,reason:s=null,broadcast:r=!0,validate:n=!0}){try{if(n&&this.validateFieldValue(t,a,o),!this.isOnline)return this.queueOfflineChange({countryId:e,section:t,field:a,value:o,reason:s});const i=await this.getCurrentFieldValue(e,t,a);return this.valuesEqual(i,o)?(d.debug("Valor não alterado, ignorando update"),!1):(d.info("Salvando diretamente no Firebase (histórico desabilitado)"),await this.saveWithRetry(e,t,a,o),r&&this.broadcastLocalUpdate({countryId:e,section:t,field:a,oldValue:i,newValue:o}),d.debug(`Campo atualizado em tempo real: ${e}.${t}.${a}`),!0)}catch(i){throw d.error("Erro na atualização em tempo real:",i),g("error",`Erro: ${i.message}`),i}}async updateMultipleFields({countryId:e,section:t,fields:a,reason:o=null,broadcast:s=!0}){try{const r=[];for(const[n,i]of Object.entries(a)){const c=await this.getCurrentFieldValue(e,t,n);this.valuesEqual(c,i)||r.push({countryId:e,section:t,field:n,oldValue:c,newValue:i})}return r.length===0?(d.debug("Nenhuma mudança detectada"),!1):(await this.executeDirectUpdate(r),s&&r.forEach(n=>this.broadcastLocalUpdate(n)),g("success",`${r.length} campos atualizados`),!0)}catch(r){throw d.error("Erro na atualização múltipla:",r),g("error",`Erro: ${r.message}`),r}}async applyMassDeltas({countryIds:e,deltas:t,reason:a="Aplicação de deltas em massa"}){try{const o=[];for(const r of e){const n=await p.collection("paises").doc(r).get();if(!n.exists)continue;const i=n.data();for(const[c,l]of Object.entries(t)){const u=i[c]||{};for(const[v,f]of Object.entries(l)){if(f===0||f===null||f===void 0)continue;const x=u[v]||0;let h;if(v==="PIB"&&typeof f=="number")h=x*(1+f/100);else if(typeof x=="number")h=x+f;else{d.warn(`Campo ${v} não suporta delta, ignorando`);continue}h=this.applyFieldLimits(c,v,h),o.push({countryId:r,section:c,field:v,oldValue:x,newValue:h})}}}if(o.length===0)return g("warning","Nenhuma mudança aplicável encontrada"),!1;await this.executeBatchUpdate(o);let s=null;try{s=await O.recordBatchChanges(o,a)}catch(r){d.warn("Erro ao registrar deltas no histórico:",r.message),s="fallback_"+Date.now()}return o.forEach(r=>this.broadcastLocalUpdate(r)),g("success",`Deltas aplicados: ${o.length} mudanças em ${e.length} países`),d.info(`Deltas em massa aplicados (Batch ID: ${s}):`,o),s}catch(o){throw d.error("Erro na aplicação de deltas em massa:",o),g("error",`Erro nos deltas: ${o.message}`),o}}subscribeToCountryChanges(e,t){const a=p.collection("paises").doc(e).onSnapshot(o=>{o.exists&&t({countryId:e,data:o.data(),timestamp:new Date})},o=>{d.error("Erro no listener de mudanças:",o)});return this.listeners.set(`country_${e}`,a),a}subscribeToHistory(e,t){let a=p.collection("changeHistory");e.countryId&&(a=a.where("countryId","==",e.countryId)),e.section&&(a=a.where("section","==",e.section)),e.userId&&(a=a.where("userId","==",e.userId)),a=a.orderBy("timestamp","desc").limit(e.limit||50);const o=a.onSnapshot(r=>{const n=r.docs.map(i=>({id:i.id,...i.data(),timestamp:i.data().timestamp.toDate()}));t(n)},r=>{d.error("Erro no listener de histórico:",r)}),s=`history_${Date.now()}`;return this.listeners.set(s,o),{unsubscribe:o,listenerId:s}}unsubscribe(e){const t=this.listeners.get(e);return t?(t(),this.listeners.delete(e),!0):!1}unsubscribeAll(){this.listeners.forEach(e=>e()),this.listeners.clear()}async getCurrentFieldValue(e,t,a){const o=await p.collection("paises").doc(e).get();if(!o.exists)throw new Error(`País ${e} não encontrado`);return o.data()[t]?.[a]}async executeTransactionalUpdate(e,t){await p.runTransaction(async a=>{const o=new Map;e.forEach(s=>{o.has(s.countryId)||o.set(s.countryId,{});const r=o.get(s.countryId);r[s.section]||(r[s.section]={}),r[s.section][s.field]=s.newValue}),o.forEach((s,r)=>{const n=p.collection("paises").doc(r),i={};Object.entries(s).forEach(([c,l])=>{Object.entries(l).forEach(([u,v])=>{i[`${c}.${u}`]=v}),i[`${c}.lastModified`]=new Date,i[`${c}.lastModifiedBy`]=B.currentUser?.uid}),a.update(n,i)})});try{await O.recordBatchChanges(e,t)}catch(a){d.warn("Erro ao registrar no histórico, continuando:",a.message)}}async executeBatchUpdate(e){const t=p.batch(),a=new Map;e.forEach(o=>{a.has(o.countryId)||a.set(o.countryId,{});const s=a.get(o.countryId);s[o.section]||(s[o.section]={}),s[o.section][o.field]=o.newValue}),a.forEach((o,s)=>{const r=p.collection("paises").doc(s),n={};Object.entries(o).forEach(([i,c])=>{Object.entries(c).forEach(([l,u])=>{n[`${i}.${l}`]=u}),n[`${i}.lastModified`]=new Date,n[`${i}.lastModifiedBy`]=B.currentUser?.uid}),t.update(r,n)}),await t.commit()}validateFieldValue(e,t,a){if(t==="PIB"&&a<0)throw new Error("PIB não pode ser negativo");if(t==="Estabilidade"&&(a<0||a>100))throw new Error("Estabilidade deve estar entre 0 e 100");if(t==="Tecnologia"&&(a<0||a>100))throw new Error("Tecnologia deve estar entre 0 e 100");if(t==="Urbanizacao"&&(a<0||a>100))throw new Error("Urbanização deve estar entre 0 e 100");if(t==="Populacao"&&a<0)throw new Error("População não pode ser negativa")}applyFieldLimits(e,t,a){return t==="Estabilidade"||t==="Tecnologia"||t==="Urbanizacao"?Math.max(0,Math.min(100,a)):t==="PIB"||t==="Populacao"?Math.max(0,a):e==="exercito"||e==="aeronautica"||e==="marinha"||e==="veiculos"?Math.max(0,Math.floor(a)):a}valuesEqual(e,t){return e===t?!0:typeof e=="number"&&typeof t=="number"?Math.abs(e-t)<.001:!1}broadcastLocalUpdate(e){window.dispatchEvent(new CustomEvent("realtime:update",{detail:e}))}setupConnectionHandlers(){window.addEventListener("online",()=>{this.isOnline=!0,d.info("Conexão restaurada, sincronizando mudanças offline"),this.syncOfflineChanges()}),window.addEventListener("offline",()=>{this.isOnline=!1,d.warn("Conexão perdida, mudanças serão enfileiradas")})}queueOfflineChange(e){const t=`${e.countryId}.${e.section}.${e.field}`;this.pendingChanges.set(t,{...e,timestamp:new Date}),g("info","Mudança salva localmente (offline)"),d.debug("Mudança enfileirada para sync:",e)}async syncOfflineChanges(){if(this.pendingChanges.size===0)return;const e=Array.from(this.pendingChanges.values());this.pendingChanges.clear();try{for(const t of e)await this.updateField({...t,reason:`Sync offline: ${t.reason||"Mudança feita offline"}`});g("success",`${e.length} mudanças sincronizadas`),d.info(`${e.length} mudanças offline sincronizadas`)}catch(t){d.error("Erro na sincronização offline:",t),e.forEach(a=>{const o=`${a.countryId}.${a.section}.${a.field}`;this.pendingChanges.set(o,a)})}}async executeDirectUpdate(e){for(const t of e)await this.saveWithRetry(t.countryId,t.section,t.field,t.newValue)}async saveWithRetry(e,t,a,o,s=3){for(let r=1;r<=s;r++)try{const n={};n[`${t}.${a}`]=o,n[`${t}.lastModified`]=new Date,n[`${t}.lastModifiedBy`]=B.currentUser?.uid,await p.collection("paises").doc(e).update(n),d.info(`Mudança salva (tentativa ${r}): ${e}.${t}.${a}`);return}catch(n){if((n.message.includes("ERR_BLOCKED_BY_CLIENT")||n.code==="unavailable"||n.code==="deadline-exceeded")&&r<s)d.warn(`Tentativa ${r} falhou (rede), tentando novamente em ${r*1e3}ms...`),await new Promise(c=>setTimeout(c,r*1e3));else throw d.error(`Falha após ${r} tentativas:`,n),this.broadcastLocalUpdate({countryId:e,section:t,field:a,oldValue:null,newValue:o}),g("warning","Conexão instável. A mudança pode não ter sido salva no servidor, mas foi aplicada localmente."),n}}}new $e;class Ie{constructor(){this.players=[],this.countries=[],this.listeners=new Map,this.isLoading=!1}async loadPlayers(){if(this.isLoading)return this.players;try{this.isLoading=!0;const t=await p.collection("usuarios").get();return t.empty?(d.warn("Nenhum usuário encontrado na coleção"),this.players=[],this.players):(this.players=t.docs.map(a=>{const o=a.data();return{id:a.id,...o,lastLogin:o.ultimoLogin?.toDate(),createdAt:o.criadoEm?.toDate(),isOnline:o.ultimoLogin?Date.now()-o.ultimoLogin.toDate().getTime()<3e5:!1}}),d.debug(`${this.players.length} jogadores carregados`),this.players)}catch(e){if(d.error("Erro ao carregar jogadores:",e),e.code==="permission-denied")return d.warn("Acesso negado à coleção usuarios, usando dados limitados"),this.players=[],this.players;throw e}finally{this.isLoading=!1}}async loadCountries(){try{const{getAllCountries:e}=await I(async()=>{const{getAllCountries:t}=await import("./firebase-BARDcBiw.js").then(a=>a.p);return{getAllCountries:t}},__vite__mapDeps([0,1]));return this.countries=await e(),d.debug(`${this.countries.length} países carregados`),this.countries}catch(e){throw d.error("Erro ao carregar países:",e),e}}async assignCountryToPlayer(e,t,a=null){try{const o=this.players.find(n=>n.id===e),s=this.countries.find(n=>n.id===t);if(!o)throw new Error("Jogador não encontrado");if(!s)throw new Error("País não encontrado");if(s.Player&&s.Player!==e){const n=this.players.find(c=>c.id===s.Player);if(!await L("País já Atribuído",`O país ${s.Pais} já está atribuído a ${n?.nome}. Deseja transferir?`,"Transferir","Cancelar"))return!1}await p.runTransaction(async n=>{const i=p.collection("paises").doc(t),c=p.collection("usuarios").doc(e);n.update(i,{Player:e,DataVinculacao:firebase.firestore.Timestamp.now()}),n.update(c,{paisId:t,ultimaAtualizacao:firebase.firestore.Timestamp.now()})}),await O.recordChange({countryId:t,section:"sistema",field:"Player",oldValue:s.Player||null,newValue:e,reason:a||"Atribuição de país via narrador"}),g("success",`País ${s.Pais} atribuído a ${o.nome}`),d.info(`País ${t} atribuído ao jogador ${e}`);const r=this.countries.findIndex(n=>n.id===t);return r>=0&&(this.countries[r].Player=e,this.countries[r].DataVinculacao=new Date),!0}catch(o){throw d.error("Erro na atribuição:",o),g("error",`Erro: ${o.message}`),o}}async unassignCountry(e,t=null){try{const a=this.countries.find(i=>i.id===e);if(!a)throw new Error("País não encontrado");const o=a.Player;if(!o)return g("info","País já não tem jogador atribuído"),!1;const s=this.players.find(i=>i.id===o);if(!await L("Confirmar Remoção",`Tem certeza que deseja remover ${s?.nome||"jogador"} do país ${a.Pais}?`,"Remover","Cancelar"))return!1;await p.runTransaction(async i=>{const c=p.collection("paises").doc(e),l=p.collection("usuarios").doc(o);i.update(c,{Player:firebase.firestore.FieldValue.delete(),DataVinculacao:firebase.firestore.FieldValue.delete()}),i.update(l,{paisId:firebase.firestore.FieldValue.delete(),ultimaAtualizacao:firebase.firestore.Timestamp.now()})}),await O.recordChange({countryId:e,section:"sistema",field:"Player",oldValue:o,newValue:null,reason:t||"Remoção de atribuição via narrador"}),g("success",`Atribuição removida: ${a.Pais}`),d.info(`País ${e} desvinculado do jogador ${o}`);const n=this.countries.findIndex(i=>i.id===e);return n>=0&&(delete this.countries[n].Player,delete this.countries[n].DataVinculacao),!0}catch(a){throw d.error("Erro na remoção:",a),g("error",`Erro: ${a.message}`),a}}async assignRandomCountries(e=null){try{const t=this.countries.filter(u=>!u.Player),a=this.players.filter(u=>u.papel!=="admin"&&u.papel!=="narrador"&&!u.paisId);if(t.length===0){g("warning","Nenhum país disponível");return}if(a.length===0){g("warning","Nenhum jogador sem país");return}const o=Math.min(t.length,a.length,e||1/0);if(!await L("Atribuição Aleatória",`Atribuir aleatoriamente ${o} países a jogadores sem país?`,"Sim, Atribuir","Cancelar"))return;const r=this.shuffleArray([...t]),n=this.shuffleArray([...a]),i=[];for(let u=0;u<o;u++)i.push({playerId:n[u].id,countryId:r[u].id,playerName:n[u].nome,countryName:r[u].Pais});const c=[];for(const u of i)try{await this.assignCountryToPlayer(u.playerId,u.countryId,"Atribuição aleatória automática"),c.push({...u,success:!0})}catch(v){c.push({...u,success:!1,error:v.message})}const l=c.filter(u=>u.success).length;return g("success",`Atribuição aleatória concluída: ${l}/${o} sucessos`),c}catch(t){throw d.error("Erro na atribuição aleatória:",t),g("error",`Erro: ${t.message}`),t}}async clearAllAssignments(){try{const e=this.countries.filter(r=>r.Player);if(e.length===0){g("info","Nenhuma atribuição para remover");return}if(!await L("ATENÇÃO: Limpar Todas Atribuições",`Isso removerá TODAS as ${e.length} atribuições de países. Esta ação não pode ser desfeita facilmente.`,"Sim, Limpar Tudo","Cancelar")||!await L("Confirmação Final","Tem ABSOLUTA CERTEZA? Todos os jogadores perderão seus países.","CONFIRMAR LIMPEZA","Cancelar"))return;const o=p.batch(),s=[];e.forEach(r=>{const n=p.collection("paises").doc(r.id);if(o.update(n,{Player:firebase.firestore.FieldValue.delete(),DataVinculacao:firebase.firestore.FieldValue.delete()}),r.Player){const i=p.collection("usuarios").doc(r.Player);o.update(i,{paisId:firebase.firestore.FieldValue.delete(),ultimaAtualizacao:firebase.firestore.Timestamp.now()}),s.push({countryId:r.id,section:"sistema",field:"Player",oldValue:r.Player,newValue:null})}}),await o.commit(),await O.recordBatchChanges(s,"Limpeza geral de atribuições"),this.countries.forEach(r=>{r.Player&&(delete r.Player,delete r.DataVinculacao)}),g("success",`${e.length} atribuições removidas`),d.info("Todas as atribuições foram removidas")}catch(e){throw d.error("Erro ao limpar atribuições:",e),g("error",`Erro: ${e.message}`),e}}getPlayerAnalytics(){const e=this.players.length,t=this.players.filter(v=>v.paisId).length,a=this.players.filter(v=>v.papel==="admin").length,o=this.players.filter(v=>v.papel==="narrador").length,s=this.countries.length,r=this.countries.filter(v=>v.Player).length,n=new Date,i=new Date(n.getTime()-1440*60*1e3),c=new Date(n.getTime()-10080*60*1e3),l=this.players.filter(v=>v.lastLogin&&v.lastLogin>i).length,u=this.players.filter(v=>v.lastLogin&&v.lastLogin>c).length;return{players:{total:e,active:t,inactive:e-t,admins:a,narrators:o,recentlyActive:l,weeklyActive:u},countries:{total:s,assigned:r,available:s-r,assignmentRate:(r/s*100).toFixed(1)},assignments:this.countries.filter(v=>v.Player).map(v=>{const f=this.players.find(x=>x.id===v.Player);return{countryId:v.id,countryName:v.Pais,playerId:v.Player,playerName:f?.nome||"Desconhecido",assignedAt:v.DataVinculacao}})}}async sendAnnouncement({title:e,message:t,targetPlayers:a="all",priority:o="normal"}){try{let s=[];switch(a){case"all":s=this.players.filter(i=>i.papel!=="admin");break;case"active":s=this.players.filter(i=>i.paisId&&i.papel!=="admin");break;case"inactive":s=this.players.filter(i=>!i.paisId&&i.papel!=="admin");break;default:Array.isArray(a)&&(s=this.players.filter(i=>a.includes(i.id)))}if(s.length===0){g("warning","Nenhum destinatário encontrado");return}const r={title:e,message:t,sender:B.currentUser?.uid,senderName:B.currentUser?.displayName||"Narrador",timestamp:firebase.firestore.Timestamp.now(),priority:o,read:!1},n=p.batch();s.forEach(i=>{const c=p.collection("notifications").doc();n.set(c,{...r,userId:i.id})}),await n.commit(),g("success",`Anúncio enviado para ${s.length} jogadores`),d.info(`Anúncio enviado para ${s.length} jogadores`)}catch(s){throw d.error("Erro ao enviar anúncio:",s),g("error",`Erro: ${s.message}`),s}}shuffleArray(e){const t=[...e];for(let a=t.length-1;a>0;a--){const o=Math.floor(Math.random()*(a+1));[t[a],t[o]]=[t[o],t[a]]}return t}setupRealTimeListeners(){d.info("Real-time listeners desabilitados - usando refresh periódico"),this.refreshInterval=setInterval(async()=>{try{this.isLoading||(await this.loadPlayers(),await this.loadCountries(),this.broadcastUpdate("periodic-refresh"))}catch(e){d.debug("Erro no refresh periódico (normal):",e.message)}},3e4),this.listeners.set("refreshInterval",this.refreshInterval)}broadcastUpdate(e){window.dispatchEvent(new CustomEvent("playerManager:update",{detail:{type:e,data:e==="players"?this.players:this.countries}}))}cleanup(){this.listeners.forEach((e,t)=>{t==="refreshInterval"?clearInterval(e):typeof e=="function"&&e()}),this.listeners.clear()}}const j=new Ie;class Pe{constructor(){this.pendingVehicles=[],this.approvedVehicles=[],this.rejectedVehicles=[],this.currentFilter="pending",this.currentSort="newest",this.pendingListener=null,this.setupEventListeners()}async initialize(){if(console.log("🚗 Inicializando sistema de aprovação de veículos..."),!window.firebase||!window.firebase.auth){console.error("❌ Firebase não inicializado");return}if(!window.firebase.auth().currentUser){console.log("⚠️ Usuário não logado, aguardando auth state..."),window.firebase.auth().onAuthStateChanged(t=>{t&&(console.log("✅ Usuário logado, inicializando sistema..."),this.loadAndRender())});return}await this.loadAndRender()}async loadAndRender(){await this.loadPendingVehicles(),this.render(),this.setupRealTimeListener(),setInterval(()=>this.refreshData(),3e4)}setupRealTimeListener(){try{console.log("🔄 Configurando listener em tempo real para veículos pendentes..."),this.pendingListener=p.collection("vehicles_pending").onSnapshot(e=>{console.log("🔔 Mudança detectada na coleção vehicles_pending"),e.empty?(console.log("⚠️ Coleção vazia"),this.pendingVehicles=[],this.render()):(console.log(`📊 ${e.size} documentos na coleção`),this.processPendingSnapshot(e))},e=>{console.error("❌ Erro no listener de veículos pendentes:",e),setTimeout(()=>this.refreshData(),5e3)})}catch(e){console.error("❌ Erro ao configurar listener:",e)}}processPendingSnapshot(e){try{const t=this.pendingVehicles.length;this.pendingVehicles=[];for(const o of e.docs)try{const s=o.data();let r=new Date;s.submittedAt&&s.submittedAt.toDate?r=s.submittedAt.toDate():s.submissionDate&&s.submissionDate.toDate&&(r=s.submissionDate.toDate());const n={id:o.id,...s,submissionDate:r};this.pendingVehicles.push(n)}catch(s){console.error("❌ Erro ao processar documento no snapshot:",o.id,s)}const a=this.pendingVehicles.length;if(console.log(`🔔 Atualização em tempo real: ${a} veículos pendentes`),a>t){const o=a-t;console.log(`🆕 ${o} novo(s) veículo(s) recebido(s)!`),this.showNewVehicleNotification(o)}this.currentFilter==="pending"&&this.render()}catch(t){console.error("❌ Erro ao processar snapshot:",t)}}showNewVehicleNotification(e){const t=document.createElement("div");t.className="fixed top-4 right-4 bg-brand-500 text-slate-900 px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce",t.style.zIndex="10000",t.innerHTML=`🆕 ${e} novo(s) veículo(s) para aprovação!`,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},5e3)}destroy(){this.pendingListener&&(console.log("🧹 Removendo listener de veículos pendentes..."),this.pendingListener(),this.pendingListener=null)}setupEventListeners(){document.addEventListener("click",e=>{if(e.target.matches("[data-filter]")&&(this.currentFilter=e.target.dataset.filter,this.render()),e.target.matches("[data-sort]")&&(this.currentSort=e.target.dataset.sort,this.render()),e.target.matches("[data-approve]")){const t=e.target.dataset.approve;this.showApprovalModal(t)}if(e.target.matches("[data-reject]")){const t=e.target.dataset.reject;this.rejectVehicle(t)}if(e.target.matches("[data-view-sheet]")){const t=e.target.dataset.viewSheet;this.viewVehicleSheet(t)}e.target.id==="refresh-vehicles"&&this.refreshData(),e.target.id==="debug-vehicles"&&this.debugSystem(),e.target.id==="force-reload"&&this.forceReload(),e.target.id==="bulk-approve"&&this.bulkApprove(),e.target.id==="bulk-reject"&&this.bulkReject()})}async loadPendingVehicles(){try{console.log("🔍 Buscando veículos pendentes..."),this.pendingVehicles=[];const e=await p.collection("vehicles_pending").get();if(console.log(`📊 Total de documentos encontrados: ${e.size}`),e.empty){console.log("⚠️ Nenhum veículo pendente encontrado");return}for(const t of e.docs)try{const a=t.data();console.log("🔍 Processando documento:",t.id,Object.keys(a));let o=new Date;a.submittedAt&&a.submittedAt.toDate?o=a.submittedAt.toDate():a.submissionDate&&a.submissionDate.toDate&&(o=a.submissionDate.toDate());const s={id:t.id,...a,submissionDate:o};this.pendingVehicles.push(s),console.log("✅ Veículo adicionado:",s.id,s.vehicleData?.name||"Nome não encontrado")}catch(a){console.error("❌ Erro ao processar documento:",t.id,a)}console.log(`📋 ${this.pendingVehicles.length} veículos pendentes carregados com sucesso`)}catch(e){console.error("❌ Erro ao carregar veículos pendentes:",e),console.error("📋 Detalhes do erro:",e.code,e.message),this.pendingVehicles=[]}}async loadApprovedVehicles(){try{console.log("🔄 Carregando veículos aprovados (nova estrutura)...");const e=await p.collection("vehicles_approved").get();this.approvedVehicles=[];for(const t of e.docs){const a=t.id;console.log(`📁 Processando país: ${a}`),(await p.collection("vehicles_approved").doc(a).collection("vehicles").orderBy("approvalDate","desc").limit(20).get()).docs.forEach(s=>{this.approvedVehicles.push({id:s.id,...s.data(),approvalDate:s.data().approvalDate?.toDate()||new Date})})}this.approvedVehicles.sort((t,a)=>(a.approvalDate||0)-(t.approvalDate||0)),this.approvedVehicles=this.approvedVehicles.slice(0,50),console.log(`✅ ${this.approvedVehicles.length} veículos aprovados carregados`)}catch(e){console.error("❌ Erro ao carregar veículos aprovados:",e),this.approvedVehicles=[]}}async loadRejectedVehicles(){try{const e=await p.collection("vehicles_rejected").orderBy("rejectionDate","desc").limit(50).get();this.rejectedVehicles=e.docs.map(t=>({id:t.id,...t.data(),rejectionDate:t.data().rejectionDate?.toDate()||new Date})),console.log(`❌ ${this.rejectedVehicles.length} veículos rejeitados carregados`)}catch(e){console.error("❌ Erro ao carregar veículos rejeitados:",e),this.rejectedVehicles=[]}}async refreshData(){console.log("🔄 Atualizando dados de aprovação..."),this.currentFilter==="pending"?await this.loadPendingVehicles():this.currentFilter==="approved"?await this.loadApprovedVehicles():this.currentFilter==="rejected"&&await this.loadRejectedVehicles(),this.render()}render(){const e=document.getElementById("vehicle-approval-anchor");e&&(e.innerHTML=this.getHTML(),this.updateStats())}getHTML(){const e=this.getFilteredVehicles();return`
            <div class="rounded-2xl border border-brand-500/30 bg-gradient-to-r from-brand-500/5 to-brand-600/5 p-5 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-brand-200">🚗 Sistema de Aprovação de Veículos</h2>
                        <p class="text-xs text-slate-400 mt-1">Aprovar, rejeitar e gerenciar submissões de veículos dos jogadores</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button id="refresh-vehicles" class="rounded-lg border border-brand-500/50 text-brand-200 px-3 py-1.5 text-sm hover:bg-brand-500/10 transition-colors">
                            🔄 Atualizar
                        </button>
                        <button id="debug-vehicles" class="rounded-lg border border-red-500/50 text-red-200 px-3 py-1.5 text-sm hover:bg-red-500/10 transition-colors">
                            🔍 Debug
                        </button>
                        <button id="force-reload" class="rounded-lg border border-orange-500/50 text-orange-200 px-3 py-1.5 text-sm hover:bg-orange-500/10 transition-colors">
                            🔧 Force Reload
                        </button>
                        <div class="flex items-center gap-3">
                            <div class="text-sm text-brand-200">
                                <span class="font-semibold" id="pending-count">${this.pendingVehicles.length}</span> pendentes
                            </div>
                            <div class="flex items-center gap-1 text-xs" id="realtime-indicator">
                                <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span class="text-emerald-300">Tempo Real</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Filter and Sort Controls -->
                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <div class="flex gap-1">
                        <button data-filter="pending" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter==="pending"?"bg-brand-500 text-slate-900 font-semibold":"border border-brand-500/30 text-brand-200 hover:bg-brand-500/10"}">
                            Pendentes (${this.pendingVehicles.length})
                        </button>
                        <button data-filter="approved" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter==="approved"?"bg-emerald-500 text-slate-900 font-semibold":"border border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/10"}">
                            Aprovados (${this.approvedVehicles.length})
                        </button>
                        <button data-filter="rejected" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter==="rejected"?"bg-red-500 text-slate-900 font-semibold":"border border-red-500/30 text-red-200 hover:bg-red-500/10"}">
                            Rejeitados (${this.rejectedVehicles.length})
                        </button>
                    </div>
                    
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-slate-400">Ordenar:</span>
                        <select id="sort-vehicles" class="text-xs bg-bg border border-bg-ring/70 rounded px-2 py-1">
                            <option value="newest" ${this.currentSort==="newest"?"selected":""}>Mais recentes</option>
                            <option value="oldest" ${this.currentSort==="oldest"?"selected":""}>Mais antigos</option>
                            <option value="country" ${this.currentSort==="country"?"selected":""}>Por país</option>
                            <option value="category" ${this.currentSort==="category"?"selected":""}>Por categoria</option>
                        </select>
                    </div>
                    
                    ${this.currentFilter==="pending"?`
                        <div class="ml-auto flex gap-2">
                            <button id="bulk-approve" class="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30 transition-colors">
                                ✅ Aprovar Selecionados
                            </button>
                            <button id="bulk-reject" class="px-3 py-1.5 text-xs rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 transition-colors">
                                ❌ Rejeitar Selecionados
                            </button>
                        </div>
                    `:""}
                </div>
                
                <!-- Vehicle List -->
                <div class="space-y-3 max-h-96 overflow-y-auto">
                    ${e.length===0?`
                        <div class="text-center py-8 text-slate-400">
                            <div class="text-2xl mb-2">🚗</div>
                            <div class="text-sm">Nenhum veículo ${this.currentFilter==="pending"?"pendente":this.currentFilter==="approved"?"aprovado":"rejeitado"}</div>
                        </div>
                    `:e.map(t=>this.renderVehicleCard(t)).join("")}
                </div>
            </div>
        `}renderVehicleCard(e){const t={pending:"border-brand-500/30 bg-brand-500/5",approved:"border-emerald-500/30 bg-emerald-500/5",rejected:"border-red-500/30 bg-red-500/5"},a=r=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(r),o=e.vehicleData||{},s=o.total_cost||o.totalCost||0;return`
            <div class="border rounded-lg p-4 ${t[this.currentFilter]||t.pending}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="font-semibold text-slate-200">${o.name||o.vehicle_name||"Veículo Sem Nome"}</h3>
                            <span class="px-2 py-0.5 text-xs rounded-full bg-slate-700 text-slate-300">${e.category||"N/A"}</span>
                        </div>
                        <div class="text-xs text-slate-400 space-y-1">
                            <div>👤 <strong>Jogador:</strong> ${e.playerName} (${e.playerEmail})</div>
                            <div>🏠 <strong>País:</strong> ${e.countryName}</div>
                            <div>📅 <strong>Enviado:</strong> ${a(e.submissionDate)}</div>
                            <div>📦 <strong>Quantidade:</strong> ${e.quantity||1} unidades</div>
                            <div>💰 <strong>Custo unitário:</strong> $${s.toLocaleString()}</div>
                            <div>💰 <strong>Custo total:</strong> $${((s||0)*(e.quantity||1)).toLocaleString()}</div>
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2 min-w-32">
                        ${e.imageUrl||e.vehicleSheetImageUrl?`
                            <button data-view-sheet="${e.id}" class="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                                🖼️ Ver Ficha
                            </button>
                        `:""}
                        
                        ${this.currentFilter==="pending"?`
                            <div class="flex gap-1">
                                <button data-approve="${e.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition-colors">
                                    ✅
                                </button>
                                <button data-reject="${e.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-red-500 text-slate-900 font-semibold hover:bg-red-400 transition-colors">
                                    ❌
                                </button>
                            </div>
                            <label class="flex items-center gap-1 text-xs text-slate-400">
                                <input type="checkbox" class="vehicle-select" data-vehicle-id="${e.id}">
                                <span>Selecionar</span>
                            </label>
                        `:""}
                    </div>
                </div>
                
                <!-- Vehicle Specs Summary -->
                <div class="mt-3 pt-3 border-t border-slate-600/30">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-400">
                        <div><strong>Chassi:</strong> ${o.chassis||"N/A"}</div>
                        <div><strong>Motor:</strong> ${o.engine||"N/A"}</div>
                        <div><strong>Blindagem:</strong> ${o.armorThickness||o.armor_thickness||0}mm</div>
                        <div><strong>Armamento:</strong> ${o.main_gun_caliber||0}mm</div>
                    </div>
                </div>
            </div>
        `}getFilteredVehicles(){let e=[];switch(this.currentFilter){case"pending":e=[...this.pendingVehicles];break;case"approved":e=[...this.approvedVehicles];break;case"rejected":e=[...this.rejectedVehicles];break}switch(this.currentSort){case"newest":e.sort((t,a)=>(a.submissionDate||a.approvalDate||a.rejectionDate)-(t.submissionDate||t.approvalDate||t.rejectionDate));break;case"oldest":e.sort((t,a)=>(t.submissionDate||t.approvalDate||t.rejectionDate)-(a.submissionDate||a.approvalDate||a.rejectionDate));break;case"country":e.sort((t,a)=>(t.countryName||"").localeCompare(a.countryName||""));break;case"category":e.sort((t,a)=>(t.category||"").localeCompare(a.category||""));break}return e}async showApprovalModal(e){try{const t=this.pendingVehicles.find(x=>x.id===e);if(!t){alert("Veículo não encontrado");return}const a=t.vehicleData||{},o=t.quantity||1,s=a.total_cost||a.totalCost||0,r=document.getElementById("approval-modal");r&&r.remove();const n=document.createElement("div");n.id="approval-modal",n.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",n.style.zIndex="9999";const i=document.createElement("div");i.className="bg-bg border border-emerald-500/50 rounded-2xl max-w-md w-full p-6",i.innerHTML=`
                <style>
                    #approval-quantity-slider {
                        -webkit-appearance: none;
                        appearance: none;
                        background: transparent;
                        cursor: pointer;
                    }
                    
                    #approval-quantity-slider::-webkit-slider-track {
                        background: #475569;
                        height: 8px;
                        border-radius: 4px;
                    }
                    
                    #approval-quantity-slider::-webkit-slider-thumb {
                        -webkit-appearance: none;
                        appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #065f46;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }
                    
                    #approval-quantity-slider::-moz-range-track {
                        background: #475569;
                        height: 8px;
                        border-radius: 4px;
                        border: none;
                    }
                    
                    #approval-quantity-slider::-moz-range-thumb {
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #065f46;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    }
                </style>
                
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-emerald-200 mb-2">✅ Aprovar Veículo</h3>
                    <div class="text-sm text-slate-400 space-y-1">
                        <div><strong>Veículo:</strong> ${a.name||"Sem nome"}</div>
                        <div><strong>País:</strong> ${t.countryName}</div>
                        <div><strong>Jogador:</strong> ${t.playerName}</div>
                        <div><strong>Quantidade solicitada:</strong> ${o} unidades</div>
                        <div><strong>Custo unitário:</strong> $${s.toLocaleString()}</div>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-emerald-200 mb-3">
                        Quantidade a ser aprovada:
                    </label>
                    <div class="space-y-3">
                        <input type="range" 
                               id="approval-quantity-slider" 
                               min="1" 
                               max="${o}" 
                               value="${o}"
                               class="w-full h-2 cursor-pointer">
                        <div class="flex justify-between text-xs text-slate-400">
                            <span>1</span>
                            <span id="current-quantity" class="text-emerald-300 font-semibold text-lg">${o}</span>
                            <span>${o}</span>
                        </div>
                        <div class="text-center text-sm text-slate-300 bg-slate-800/50 rounded-lg p-2">
                            <span class="font-semibold">Custo total: $<span id="total-cost" class="text-emerald-300">${(s*o).toLocaleString()}</span></span>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button id="confirm-approval" class="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
                        ✅ Aprovar
                    </button>
                    <button id="cancel-approval" class="flex-1 px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                        ❌ Cancelar
                    </button>
                </div>
            `,n.appendChild(i);const c=i.querySelector("#approval-quantity-slider"),l=i.querySelector("#current-quantity"),u=i.querySelector("#total-cost");c.addEventListener("input",x=>{const h=parseInt(x.target.value);l.textContent=h,u.textContent=(s*h).toLocaleString()});const v=i.querySelector("#confirm-approval"),f=i.querySelector("#cancel-approval");v.addEventListener("click",()=>{const x=parseInt(c.value);n.remove(),this.approveVehicle(e,x)}),f.addEventListener("click",()=>{n.remove()}),n.addEventListener("click",x=>{x.target===n&&n.remove()}),document.addEventListener("keydown",function x(h){h.key==="Escape"&&(n.remove(),document.removeEventListener("keydown",x))}),document.body.appendChild(n),c.focus()}catch(t){console.error("❌ Erro ao mostrar modal de aprovação:",t),alert("Erro ao abrir modal: "+t.message)}}async approveVehicle(e,t=null){try{console.log(`✅ Aprovando veículo ${e}...`);const a=await p.collection("vehicles_pending").doc(e).get();if(!a.exists)throw new Error("Veículo não encontrado");const o=a.data(),s=o.quantity||1,r=t||s;console.log(`📦 Quantidade original: ${s}, aprovada: ${r}`),console.log(`📁 Salvando na nova estrutura: vehicles_approved/${o.countryId}/vehicles/${e}`),await p.collection("vehicles_approved").doc(o.countryId).collection("vehicles").doc(e).set({...o,quantity:r,originalQuantity:s,approvalDate:new Date,status:"approved"}),console.log("✅ Veículo salvo na nova estrutura Firebase"),console.log("🔍 Dados do veículo antes de adicionar ao inventário:",{countryId:o.countryId,category:o.category,vehicleName:o.vehicleData?.name,quantity:r}),await this.addToInventory({...o,quantity:r}),await p.collection("vehicles_pending").doc(e).delete(),await this.refreshData(),console.log(`✅ Veículo ${e} aprovado: ${r}/${s} unidades`)}catch(a){console.error("❌ Erro ao aprovar veículo:",a),alert("Erro ao aprovar veículo: "+a.message)}}async rejectVehicle(e){try{const t=prompt("Motivo da rejeição (opcional):");console.log(`❌ Rejeitando veículo ${e}...`);const a=await p.collection("vehicles_pending").doc(e).get();if(!a.exists)throw new Error("Veículo não encontrado");const o=a.data();await this.deleteVehicleFiles(o),console.log("🗑️ Veículo rejeitado e arquivos deletados:",{vehicleId:e,vehicleName:o.vehicleData?.name,countryName:o.countryName,rejectionReason:t||"Sem motivo especificado",rejectionDate:new Date().toISOString()}),await p.collection("vehicles_pending").doc(e).delete(),await this.refreshData(),console.log(`✅ Veículo ${e} rejeitado e limpo do sistema`)}catch(t){console.error("❌ Erro ao rejeitar veículo:",t),alert("Erro ao rejeitar veículo: "+t.message)}}async deleteVehicleFiles(e){try{if(console.log("🗑️ Iniciando limpeza de arquivos do veículo rejeitado..."),!window.firebase?.storage){console.warn("⚠️ Firebase Storage não disponível, pulando limpeza de arquivos");return}const t=window.firebase.storage(),a=[];e.imageUrl&&a.push({url:e.imageUrl,type:"PNG"}),e.vehicleSheetImageUrl&&e.vehicleSheetImageUrl.startsWith("http")&&a.push({url:e.vehicleSheetImageUrl,type:"PNG/HTML"});for(const o of a)try{await t.refFromURL(o.url).delete(),console.log(`✅ Arquivo ${o.type} deletado:`,o.url)}catch(s){console.warn(`⚠️ Erro ao deletar arquivo ${o.type}:`,s)}console.log(`✅ Limpeza de arquivos concluída. ${a.length} arquivos processados.`)}catch(t){console.error("❌ Erro geral na limpeza de arquivos:",t)}}async addToInventory(e){try{const t=p.collection("inventory").doc(e.countryId),a=await t.get();let o={};a.exists&&(o=a.data());const s=e.category||"Other";o[s]||(o[s]={});const r=e.vehicleData?.name||e.vehicleData?.vehicle_name||"Veículo Sem Nome";if(!o[s][r]){const n={"vehicleData.vehicleData?.total_cost":e.vehicleData?.total_cost,"vehicleData.vehicleData?.totalCost":e.vehicleData?.totalCost,"vehicleData.total_cost":e.total_cost,"vehicleData.totalCost":e.totalCost,"vehicleData.cost":e.cost};console.log("🔍 Custos possíveis para",r,":",n);const i=e.vehicleData?.total_cost||e.vehicleData?.totalCost||e.total_cost||e.totalCost||e.cost||0;console.log("💰 Custo unitário calculado:",i);const c={quantity:0,specs:e.vehicleData||{},cost:i,approvedDate:new Date().toISOString(),approvedBy:"narrator"};(e.imageUrl||e.vehicleSheetImageUrl)&&(c.sheetImageUrl=e.imageUrl||e.vehicleSheetImageUrl),e.vehicleSheetHtmlUrl&&(c.sheetHtmlUrl=e.vehicleSheetHtmlUrl),o[s][r]=c}o[s][r].quantity+=e.quantity||1,await t.set(o,{merge:!0}),console.log(`📦 ${e.quantity||1}x ${r} adicionado ao inventário com ficha de ${e.countryName}`)}catch(t){console.error("❌ Erro ao adicionar ao inventário:",t)}}async viewVehicleSheet(e){try{const a=[...this.pendingVehicles,...this.approvedVehicles,...this.rejectedVehicles].find(s=>s.id===e);if(!a){alert("Veículo não encontrado");return}console.log("🔍 Campos do veículo:",Object.keys(a)),console.log("🔍 imageUrl:",a.imageUrl),console.log("🔍 vehicleSheetImageUrl:",a.vehicleSheetImageUrl?.substring(0,50)+"...");let o=null;if(a.imageUrl&&a.imageUrl.startsWith("http")?(o=a.imageUrl,console.log("✅ Usando imageUrl (Firebase Storage):",o)):a.vehicleSheetImageUrl&&a.vehicleSheetImageUrl.startsWith("http")?(o=a.vehicleSheetImageUrl,console.log("✅ Usando vehicleSheetImageUrl (Firebase Storage):",o)):a.vehicleSheetImageUrl&&a.vehicleSheetImageUrl.startsWith("data:text/html")?(o=a.vehicleSheetImageUrl,console.log("⚠️ Usando HTML fallback")):console.error("❌ Nenhuma URL de imagem encontrada"),!o){alert("Ficha do veículo não encontrada");return}console.log("🖼️ Abrindo ficha em modal para veículo:",e),this.showVehicleSheetModal(a,o)}catch(t){console.error("❌ Erro ao visualizar ficha:",t),alert("Erro ao abrir ficha: "+t.message)}}showVehicleSheetModal(e,t){const a=document.getElementById("vehicle-sheet-modal");a&&a.remove();const o=document.createElement("div");o.id="vehicle-sheet-modal",o.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",o.style.zIndex="9999";const s=document.createElement("div");s.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col";const r=document.createElement("div");r.className="flex items-center justify-between p-4 border-b border-bg-ring/50",r.innerHTML=`
            <div>
                <h3 class="text-lg font-semibold text-slate-200">📋 Ficha Técnica</h3>
                <p class="text-sm text-slate-400">${e.vehicleData?.name||"Veículo"} - ${e.countryName}</p>
            </div>
            <div class="flex items-center gap-2">
                <button id="open-in-new-tab" class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                    🔗 Nova Aba
                </button>
                <button id="close-modal" class="text-slate-400 hover:text-slate-200 p-1">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        `;const n=document.createElement("div");if(n.className="flex-1 overflow-auto p-4",t.startsWith("data:text/html")){const l=document.createElement("iframe");l.src=t,l.style.cssText="width: 100%; height: 70vh; border: none; border-radius: 8px;",l.onload=()=>{console.log("✅ Ficha carregada no iframe")},l.onerror=()=>{console.error("❌ Erro ao carregar ficha no iframe"),n.innerHTML='<p class="text-red-400">Erro ao carregar ficha</p>'},n.innerHTML="",n.appendChild(l)}else t.startsWith("http")?n.innerHTML=`
                <div class="text-center">
                    <img src="${t}" alt="Ficha do Veículo" class="max-w-full max-h-full mx-auto rounded-lg shadow-lg" 
                         style="max-height: 70vh;" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;">
                </div>
            `:n.innerHTML='<p class="text-red-400">Formato de ficha não suportado</p>';s.appendChild(r),s.appendChild(n),o.appendChild(s);const i=()=>{o.remove()},c=()=>{if(t.startsWith("data:text/html")){const l=decodeURIComponent(t.split(",")[1]),u=window.open("","_blank","width=800,height=600,scrollbars=yes,resizable=yes");u&&(u.document.open(),u.document.write(l),u.document.close(),u.document.title=`Ficha - ${e.vehicleData?.name||"Veículo"}`)}else window.open(t,"_blank")};o.addEventListener("click",l=>{l.target===o&&i()}),r.querySelector("#close-modal").addEventListener("click",i),r.querySelector("#open-in-new-tab").addEventListener("click",c),document.addEventListener("keydown",function l(u){u.key==="Escape"&&(i(),document.removeEventListener("keydown",l))}),document.body.appendChild(o),o.focus()}async bulkApprove(){const e=this.getSelectedVehicles();if(e.length===0){alert("Selecione pelo menos um veículo");return}if(confirm(`Aprovar ${e.length} veículo(s) selecionado(s)?`))for(const t of e)await this.approveVehicle(t)}async bulkReject(){const e=this.getSelectedVehicles();if(e.length===0){alert("Selecione pelo menos um veículo");return}if(prompt("Motivo da rejeição em lote (opcional):"),!!confirm(`Rejeitar ${e.length} veículo(s) selecionado(s)?

Todos os arquivos associados serão removidos para economizar espaço.`)){console.log(`🗑️ Iniciando rejeição em lote de ${e.length} veículos...`);for(const t of e)await this.rejectVehicle(t);console.log(`✅ Rejeição em lote concluída. ${e.length} veículos e arquivos removidos.`)}}getSelectedVehicles(){const e=document.querySelectorAll(".vehicle-select:checked");return Array.from(e).map(t=>t.dataset.vehicleId)}updateStats(){const e=document.getElementById("pending-count");e&&(e.textContent=this.pendingVehicles.length)}async debugSystem(){console.log("🔍 === DEBUG DO SISTEMA DE APROVAÇÃO ===");try{console.log("🔥 Firebase auth:",window.firebase?.auth()),console.log("👤 Current user:",window.firebase?.auth()?.currentUser),console.log("🗃️ Firestore db:",p);const e=p.collection("vehicles_pending");console.log("📁 Pending collection ref:",e);const t=await e.get();if(console.log("📊 Snapshot size:",t.size),console.log("📊 Snapshot empty:",t.empty),!t.empty){t.docs.forEach((o,s)=>{console.log(`📄 Doc ${s+1}:`,o.id,o.data())}),console.log("🔧 FORÇANDO PROCESSAMENTO DOS DOCUMENTOS:");const a=[];for(const o of t.docs)try{const s=o.data();console.log("🔍 Processando no debug:",o.id,Object.keys(s));let r=new Date;s.submittedAt&&s.submittedAt.toDate&&(r=s.submittedAt.toDate());const n={id:o.id,...s,submissionDate:r};a.push(n),console.log("✅ Processado no debug:",n.id,n.vehicleData?.name)}catch(s){console.error("❌ Erro no debug:",s)}console.log("🚀 Total processado no debug:",a.length)}console.log("🧠 Current pending vehicles:",this.pendingVehicles),console.log("🎯 Current filter:",this.currentFilter)}catch(e){console.error("💥 Debug error:",e)}console.log("🔍 === FIM DO DEBUG ===")}async forceReload(){console.log("🔧 === FORCE RELOAD INICIADO ===");try{this.pendingVehicles=[];const e=await p.collection("vehicles_pending").get();console.log("📊 Force reload - documents found:",e.size);for(const t of e.docs){const a=t.data();console.log("🔍 Processing in force reload:",t.id);let o=new Date;a.submittedAt&&a.submittedAt.toDate?o=a.submittedAt.toDate():a.submissionDate&&a.submissionDate.toDate&&(o=a.submissionDate.toDate());const s={id:t.id,...a,submissionDate:o};this.pendingVehicles.push(s),console.log("✅ Added vehicle:",s.id,s.vehicleData?.name)}console.log("🚀 Force reload completed:",this.pendingVehicles.length,"vehicles"),this.render()}catch(e){console.error("❌ Force reload failed:",e)}console.log("🔧 === FORCE RELOAD FIM ===")}}const le={vehicles:{MBT:{name:"MBT Genérico (1954)",description:"Tanque de batalha principal padrão da época",stats:{armor:50,firepower:40,speed:30,reliability:70,cost:5e4},icon:"🛡️",year:1954},"Medium Tank":{name:"Tanque Médio Genérico",description:"Tanque médio versátil",stats:{armor:40,firepower:35,speed:35,reliability:75,cost:4e4},icon:"⚙️",year:1954},"Light Tank":{name:"Tanque Leve Genérico",description:"Tanque leve rápido para reconhecimento",stats:{armor:25,firepower:25,speed:50,reliability:80,cost:25e3},icon:"🏃",year:1954},"Heavy Tank":{name:"Tanque Pesado Genérico",description:"Tanque pesado com armadura reforçada",stats:{armor:70,firepower:50,speed:20,reliability:60,cost:75e3},icon:"🐘",year:1954},IFV:{name:"IFV Genérico",description:"Veículo de combate de infantaria",stats:{armor:20,firepower:20,speed:45,reliability:75,cost:3e4},icon:"👥",year:1954},APC:{name:"APC Genérico",description:"Transporte blindado de pessoal",stats:{armor:15,firepower:10,speed:50,reliability:85,cost:2e4},icon:"🚐",year:1954},SPG:{name:"SPG Genérico",description:"Canhão autopropulsado antitanque",stats:{armor:25,firepower:55,speed:30,reliability:70,cost:45e3},icon:"💥",year:1954},SPH:{name:"SPH Genérico",description:"Obuseiro autopropulsado de artilharia",stats:{armor:20,firepower:60,speed:25,reliability:75,cost:55e3},icon:"🎯",year:1954},SPAA:{name:"SPAA Genérico",description:"Antiaéreo autopropulsado",stats:{armor:15,firepower:30,speed:40,reliability:80,cost:35e3},icon:"🎪",year:1954},"Tank Destroyer":{name:"Caça-Tanques Genérico",description:"Destruidor de tanques especializado",stats:{armor:30,firepower:60,speed:35,reliability:70,cost:48e3},icon:"🎯",year:1954},"Engineering Vehicle":{name:"Veículo de Engenharia Genérico",description:"Veículo para construção e demolição",stats:{armor:25,firepower:5,speed:20,reliability:90,cost:4e4},icon:"🔧",year:1954},Other:{name:"Veículo Utilitário Genérico",description:"Veículo de uso geral",stats:{armor:10,firepower:5,speed:60,reliability:85,cost:15e3},icon:"🚙",year:1954}},aircraft:{Fighter:{name:"Caça Leve Genérico (1954)",description:"Caça interceptador leve",stats:{speed:800,maneuverability:75,firepower:35,range:1200,cost:15e4},icon:"✈️",year:1954},"Heavy Fighter":{name:"Caça Pesado Genérico",description:"Caça pesado multifunção",stats:{speed:700,maneuverability:60,firepower:50,range:1800,cost:2e5},icon:"🛩️",year:1954},Interceptor:{name:"Interceptador Genérico",description:"Interceptador de alta altitude",stats:{speed:900,maneuverability:70,firepower:40,range:1e3,cost:18e4},icon:"🚀",year:1954},CAS:{name:"CAS Genérico",description:"Aeronave de suporte aéreo próximo",stats:{speed:500,maneuverability:50,firepower:65,range:800,cost:12e4},icon:"💣",year:1954},Bomber:{name:"Bombardeiro Genérico",description:"Bombardeiro médio",stats:{speed:550,maneuverability:30,firepower:80,range:2500,cost:35e4},icon:"✈️",year:1954},"Heavy Bomber":{name:"Bombardeiro Pesado Genérico",description:"Bombardeiro estratégico pesado",stats:{speed:500,maneuverability:20,firepower:100,range:4e3,cost:5e5},icon:"🛫",year:1954},"Naval Bomber":{name:"Bombardeiro Naval Genérico",description:"Bombardeiro torpedo naval",stats:{speed:450,maneuverability:40,firepower:70,range:1500,cost:18e4},icon:"🌊",year:1954},Transport:{name:"Transporte Genérico",description:"Avião de transporte de tropas/carga",stats:{speed:350,maneuverability:25,firepower:0,range:2e3,cost:2e5},icon:"📦",year:1954},Reconnaissance:{name:"Reconhecimento Genérico",description:"Avião de reconhecimento",stats:{speed:600,maneuverability:55,firepower:10,range:2200,cost:14e4},icon:"🔍",year:1954}},naval:{Couraçados:{name:"Couraçado Genérico (1954)",description:"Encouraçado de batalha pesado",stats:{armor:90,firepower:95,speed:25,range:8e3,cost:15e6},icon:"⚓",year:1954},Cruzadores:{name:"Cruzador Genérico",description:"Cruzador de combate médio",stats:{armor:70,firepower:75,speed:32,range:6e3,cost:8e6},icon:"🚢",year:1954},Destróieres:{name:"Destróier Genérico",description:"Destróier de escolta e ataque",stats:{armor:40,firepower:60,speed:35,range:4500,cost:4e6},icon:"🛥️",year:1954},Fragatas:{name:"Fragata Genérica",description:"Fragata de patrulha e escolta",stats:{armor:30,firepower:45,speed:30,range:4e3,cost:25e5},icon:"🚤",year:1954},Corvetas:{name:"Corveta Genérica",description:"Corveta de patrulha costeira",stats:{armor:20,firepower:30,speed:28,range:2500,cost:12e5},icon:"⛵",year:1954},Submarinos:{name:"Submarino Genérico",description:"Submarino diesel-elétrico",stats:{armor:15,firepower:70,speed:20,range:8e3,cost:5e6},icon:"🤿",year:1954},"Porta-aviões":{name:"Porta-aviões Genérico",description:"Porta-aviões de esquadra",stats:{armor:50,firepower:40,speed:30,range:1e4,cost:25e6},icon:"🛩️",year:1954},Patrulhas:{name:"Patrulha Genérica",description:"Embarcação de patrulha costeira",stats:{armor:10,firepower:20,speed:25,range:1500,cost:5e5},icon:"🚨",year:1954},Auxiliares:{name:"Navio Auxiliar Genérico",description:"Navio de suporte e logística",stats:{armor:5,firepower:5,speed:18,range:6e3,cost:15e5},icon:"🔧",year:1954},"Naval - Outros":{name:"Embarcação Genérica",description:"Embarcação de uso geral",stats:{armor:8,firepower:10,speed:20,range:2e3,cost:8e5},icon:"🌊",year:1954}}};function Se(m,e){return le[m]?.[e]||null}class Ae{constructor(){this.selectedCountry=null,this.selectedType="vehicles",this.countries=[],this.currentInventory={}}async initialize(){console.log("⚙️ Inicializando Gerenciador de Equipamentos Genéricos..."),await this.loadCountries(),this.attachButtonListener()}async loadCountries(){try{const e=await p.collection("paises").orderBy("Pais").get();this.countries=e.docs.map(t=>({id:t.id,...t.data()}))}catch(e){console.error("Erro ao carregar países:",e),this.countries=[]}}attachButtonListener(){const e=document.getElementById("open-generic-equipment-manager");e?(e.addEventListener("click",()=>{this.openModal()}),console.log("✅ Gerenciador de Equipamentos Genéricos pronto (botão conectado)")):(console.warn("⚠️ Botão open-generic-equipment-manager não encontrado, tentando novamente..."),setTimeout(()=>this.attachButtonListener(),500))}openModal(){this.renderModal()}renderModal(){const e=document.getElementById("generic-equipment-modal");e&&e.remove();const t=document.createElement("div");t.id="generic-equipment-modal",t.innerHTML=this.getModalHTML(),document.body.appendChild(t),this.setupEventListeners()}closeModal(){const e=document.getElementById("generic-equipment-modal");e&&e.remove()}getModalHTML(){return`
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" id="generic-equipment-backdrop">
        <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden m-4 flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-700">
            <div>
              <h3 class="text-2xl font-bold text-purple-100 flex items-center gap-2">
                ⚙️ Equipamentos Genéricos
              </h3>
              <p class="text-sm text-slate-400 mt-1">
                Adicione equipamentos padrão ao inventário dos países sem usar os criadores
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button id="refresh-generic-equipment" class="px-4 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-semibold transition">
                🔄 Atualizar
              </button>
              <button id="close-generic-equipment-modal" class="text-slate-400 hover:text-slate-200 text-2xl px-2">×</button>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">

        <!-- Seletor de País -->
        <div class="mb-6">
          <label class="block text-sm font-semibold text-slate-200 mb-2">
            🌍 Selecionar País
          </label>
          <select id="generic-country-select" class="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100">
            <option value="">-- Escolha um país --</option>
            ${this.countries.map(e=>`
              <option value="${e.id}">${e.Pais}</option>
            `).join("")}
          </select>
        </div>

            <div id="generic-equipment-content">
              ${this.getContentHTML()}
            </div>
          </div>
        </div>
      </div>
    `}getContentHTML(){if(!this.selectedCountry)return`
        <div class="text-center py-12 border border-dashed border-slate-700 rounded-xl">
          <span class="text-6xl mb-4 block">🌍</span>
          <p class="text-slate-400">Selecione um país para começar</p>
        </div>
      `;const e=this.countries.find(t=>t.id===this.selectedCountry);return`
      <div class="space-y-6">
        <!-- Header do País -->
        <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-xl font-bold text-slate-100">${e?.Pais||"País"}</h4>
              <p class="text-sm text-slate-400">Gerenciando equipamentos genéricos</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-slate-500">Orçamento</p>
              <p class="text-lg font-bold text-emerald-400">${Z(e?.PIB*.25||0)}</p>
            </div>
          </div>
        </div>

        <!-- Tabs de Tipo -->
        <div class="flex gap-2 border-b border-slate-700">
          <button class="generic-type-tab px-4 py-2 text-sm font-semibold transition border-b-2 ${this.selectedType==="vehicles"?"border-purple-500 text-purple-400":"border-transparent text-slate-400 hover:text-slate-200"}" data-type="vehicles">
            🚗 Veículos
          </button>
          <button class="generic-type-tab px-4 py-2 text-sm font-semibold transition border-b-2 ${this.selectedType==="aircraft"?"border-purple-500 text-purple-400":"border-transparent text-slate-400 hover:text-slate-200"}" data-type="aircraft">
            ✈️ Aviões
          </button>
          <button class="generic-type-tab px-4 py-2 text-sm font-semibold transition border-b-2 ${this.selectedType==="naval"?"border-purple-500 text-purple-400":"border-transparent text-slate-400 hover:text-slate-200"}" data-type="naval">
            ⚓ Navios
          </button>
        </div>

        <!-- Grid de Equipamentos -->
        <div>
          <h5 class="text-sm font-semibold text-slate-200 mb-3">📦 Equipamentos Disponíveis</h5>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${this.getEquipmentCardsHTML()}
          </div>
        </div>

        <!-- Inventário Atual -->
        <div>
          <h5 class="text-sm font-semibold text-slate-200 mb-3">📋 Inventário Atual (Genéricos)</h5>
          <div id="current-generic-inventory">
            ${this.getCurrentInventoryHTML()}
          </div>
        </div>
      </div>
    `}getEquipmentCardsHTML(){const e=le[this.selectedType]||{},t=Object.keys(e);return t.length===0?'<p class="text-slate-400 col-span-full text-center py-8">Nenhum equipamento disponível</p>':t.map(a=>{const o=e[a],s=o.stats;return`
        <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition">
          <div class="flex items-start gap-3 mb-3">
            <span class="text-3xl">${o.icon}</span>
            <div class="flex-1">
              <h6 class="font-semibold text-slate-100">${o.name}</h6>
              <p class="text-xs text-slate-400">${o.description}</p>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
            ${Object.entries(s).slice(0,4).map(([r,n])=>`
              <div class="flex justify-between">
                <span class="text-slate-500 capitalize">${r}:</span>
                <span class="text-slate-300 font-semibold">${r==="cost"?Z(n):n}</span>
              </div>
            `).join("")}
          </div>

          <!-- Form para adicionar -->
          <div class="flex gap-2">
            <input
              type="number"
              min="1"
              value="10"
              placeholder="Qtd"
              class="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 text-sm"
              id="qty-${a}"
            >
            <button
              class="add-generic-equipment px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-semibold text-sm transition"
              data-category="${a}"
              data-type="${this.selectedType}"
            >
              + Adicionar
            </button>
          </div>
        </div>
      `}).join("")}getCurrentInventoryHTML(){const e=Object.entries(this.currentInventory);return e.length===0?`
        <div class="text-center py-8 border border-dashed border-slate-700 rounded-xl">
          <span class="text-4xl mb-3 block">📦</span>
          <p class="text-slate-400">Nenhum equipamento genérico adicionado ainda</p>
        </div>
      `:`
      <div class="space-y-2">
        ${e.map(([t,a])=>`
          <div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${a.icon}</span>
              <div>
                <p class="font-semibold text-slate-100">${a.name}</p>
                <p class="text-xs text-slate-400">${a.category}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-bold text-purple-400">${a.quantity} unidades</p>
                <p class="text-xs text-slate-500">Total: ${Z(a.stats.cost*a.quantity)}</p>
              </div>
              <button
                class="edit-generic-qty px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition"
                data-item-id="${t}"
              >
                ✏️
              </button>
              <button
                class="remove-generic-equipment px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition"
                data-item-id="${t}"
              >
                🗑️
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `}setupEventListeners(){const e=document.getElementById("close-generic-equipment-modal");e&&e.addEventListener("click",()=>this.closeModal());const t=document.getElementById("generic-equipment-backdrop");t&&t.addEventListener("click",o=>{o.target===t&&this.closeModal()});const a=document.getElementById("generic-country-select");a&&a.addEventListener("change",o=>{this.selectedCountry=o.target.value,this.selectedCountry?this.loadCountryInventory(this.selectedCountry):(this.currentInventory={},this.renderContent())}),document.addEventListener("click",o=>{if(o.target.matches(".generic-type-tab")&&(this.selectedType=o.target.dataset.type,this.renderContent()),o.target.matches(".add-generic-equipment")){const s=o.target.dataset.category,r=o.target.dataset.type,n=document.getElementById(`qty-${s}`),i=parseInt(n?.value||10);i>0&&this.addEquipment(r,s,i)}if(o.target.matches(".edit-generic-qty")){const s=o.target.dataset.itemId;this.editQuantity(s)}if(o.target.matches(".remove-generic-equipment")){const s=o.target.dataset.itemId;this.removeEquipment(s)}o.target.id==="refresh-generic-equipment"&&this.selectedCountry&&this.loadCountryInventory(this.selectedCountry)})}async loadCountryInventory(e){try{const t=await p.collection("inventories").doc(e).collection("items").where("isGeneric","==",!0).get();this.currentInventory={},t.docs.forEach(a=>{this.currentInventory[a.id]={id:a.id,...a.data()}}),this.renderContent()}catch(t){console.error("Erro ao carregar inventário:",t),alert("Erro ao carregar inventário: "+t.message)}}async addEquipment(e,t,a){if(!this.selectedCountry){alert("Selecione um país primeiro!");return}const o=Se(e,t);if(!o){alert("Equipamento não encontrado!");return}try{const s={name:o.name,category:t,type:e,quantity:a,isGeneric:!0,stats:o.stats,icon:o.icon,description:o.description,year:o.year,addedBy:window.currentUser?.uid||"narrator",addedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};await p.collection("inventories").doc(this.selectedCountry).collection("items").add(s),alert(`✅ ${a}x ${o.name} adicionado ao inventário!`),await this.loadCountryInventory(this.selectedCountry)}catch(s){console.error("Erro ao adicionar equipamento:",s),alert("Erro ao adicionar equipamento: "+s.message)}}async editQuantity(e){const t=this.currentInventory[e];if(!t)return;const a=prompt(`Nova quantidade para ${t.name}:`,t.quantity);if(a===null)return;const o=parseInt(a);if(isNaN(o)||o<0){alert("Quantidade inválida!");return}try{if(o===0){await this.removeEquipment(e);return}await p.collection("inventories").doc(this.selectedCountry).collection("items").doc(e).update({quantity:o,updatedAt:new Date().toISOString()}),alert(`✅ Quantidade atualizada para ${o}`),await this.loadCountryInventory(this.selectedCountry)}catch(s){console.error("Erro ao atualizar quantidade:",s),alert("Erro ao atualizar: "+s.message)}}async removeEquipment(e){const t=this.currentInventory[e];if(t&&confirm(`Remover ${t.name} do inventário?`))try{await p.collection("inventories").doc(this.selectedCountry).collection("items").doc(e).delete(),alert(`✅ ${t.name} removido do inventário!`),await this.loadCountryInventory(this.selectedCountry)}catch(a){console.error("Erro ao remover equipamento:",a),alert("Erro ao remover: "+a.message)}}renderContent(){const e=document.getElementById("generic-equipment-content");e&&(e.innerHTML=this.getContentHTML())}}const D={dependency:{light:.3,moderate:.5,heavy:.7,critical:.85},historyTurns:5,effects:{growth_bonus:{light:.05,moderate:.1,heavy:.15,critical:.2},crisis_impact:{light:.1,moderate:.2,heavy:.35,critical:.5}}};class Te{constructor(){this.dependencyCache=new Map,this.lastCacheUpdate=0,this.cacheTimeout=3e5}async analyzeDependency(e,t,a=!1){try{const o=`${e}-${t}`,s=Date.now();if(!a&&this.dependencyCache.has(o)){const i=this.dependencyCache.get(o);if(s-i.timestamp<this.cacheTimeout)return i.data}const r=await this.getEconomicHistory(e),n=this.calculateDependency(r,t);return this.dependencyCache.set(o,{data:n,timestamp:s}),n}catch(o){throw d.error("Erro ao analisar dependência econômica:",o),o}}async getEconomicHistory(e){try{return(await p.collection("economic_history").where("countryId","==",e).orderBy("turn","desc").limit(D.historyTurns).get()).docs.map(a=>({id:a.id,...a.data()}))}catch(t){return d.error("Erro ao buscar histórico econômico:",t),[]}}calculateDependency(e,t){if(!e||e.length<2)return{level:"none",percentage:0,totalExternal:0,fromInvestor:0,turnsAnalyzed:e.length,riskLevel:"low"};let a=0,o=0,s=0;e.forEach(u=>{u.externalInvestments&&Object.entries(u.externalInvestments).forEach(([v,f])=>{const x=parseFloat(f)||0;a+=x,v===t&&(o+=x,s++)})});const r=a>0?o/a:0,n=s/e.length,i=r*(.5+.5*n);let c="none",l="low";return i>=D.dependency.critical?(c="critical",l="critical"):i>=D.dependency.heavy?(c="heavy",l="high"):i>=D.dependency.moderate?(c="moderate",l="medium"):i>=D.dependency.light&&(c="light",l="low"),{level:c,percentage:i,rawPercentage:r,totalExternal:a,fromInvestor:o,turnsAnalyzed:e.length,turnsWithInvestment:s,consistencyFactor:n,riskLevel:l,growthBonus:D.effects.growth_bonus[c]||0,crisisImpact:D.effects.crisis_impact[c]||0}}async analyzeAllDependencies(e){try{const t=await this.getEconomicHistory(e),a=new Map,o=new Set;t.forEach(r=>{r.externalInvestments&&Object.keys(r.externalInvestments).forEach(n=>{o.add(n)})});for(const r of o){const n=this.calculateDependency(t,r);n.level!=="none"&&a.set(r,n)}const s=Array.from(a.entries()).sort((r,n)=>n[1].percentage-r[1].percentage);return{countryId:e,dependencies:s,totalDependencies:a.size,highestDependency:s[0]||null,riskLevel:this.calculateOverallRisk(s)}}catch(t){throw d.error("Erro ao analisar todas as dependências:",t),t}}calculateOverallRisk(e){if(e.length===0)return"none";const t=e.filter(([,s])=>s.level==="critical").length,a=e.filter(([,s])=>s.level==="heavy").length,o=e.filter(([,s])=>s.level==="moderate").length;return t>0?"critical":a>1||a===1&&o>0?"high":a===1||o>1?"medium":"low"}async checkEconomicCrisis(e){try{const t=await p.collection("paises").doc(e).get();if(!t.exists)return!1;const a=t.data(),o=parseFloat(a.PIB)||0,s=parseFloat(a.Estabilidade)||0,r=await this.getEconomicHistory(e);if(r.length<2)return!1;const n=parseFloat(r[1].results?.newPIB||a.PIB),i=(o-n)/n;return{isCrisis:i<-.15||s<25||i<-.05&&s<40,pibChange:i,stability:s,severity:this.calculateCrisisSeverity(i,s)}}catch(t){return d.error("Erro ao verificar crise econômica:",t),!1}}calculateCrisisSeverity(e,t){let a=0;return e<-.3?a+=3:e<-.2?a+=2:e<-.1&&(a+=1),t<20?a+=3:t<35?a+=2:t<50&&(a+=1),a>=5?"severe":a>=3?"moderate":a>=1?"mild":"none"}async applyDependencyCrisisEffects(e){try{const t=await this.checkEconomicCrisis(e);if(!t.isCrisis)return[];const a=[],o=await p.collection("paises").get();for(const s of o.docs){const r=s.id;if(r===e)continue;const n=await this.analyzeDependency(r,e);if(n.level!=="none"){const i=s.data(),c=parseFloat(i.PIB)||0,l=n.crisisImpact*t.severity==="severe"?1.5:1,u=c*l,v=c-u;await p.collection("paises").doc(r).update({PIB:v,TurnoUltimaAtualizacao:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}),a.push({countryId:r,countryName:i.Pais,dependencyLevel:n.level,pibLoss:u,newPIB:v,impact:l*100})}}return a}catch(t){throw d.error("Erro ao aplicar efeitos de crise de dependência:",t),t}}generateDependencyReport(e){const{countryId:t,dependencies:a,riskLevel:o}=e;return{summary:this.generateSummaryText(a,o),recommendations:this.generateRecommendations(a,o),riskMatrix:a.map(([r,n])=>({investor:r,level:n.level,percentage:n.percentage,risk:n.riskLevel,growthBonus:n.growthBonus,crisisImpact:n.crisisImpact}))}}generateSummaryText(e,t){if(e.length===0)return"País mantém independência econômica total. Sem dependências externas significativas.";const a=e.length,o=e.filter(([,n])=>n.level==="critical").length,s=e.filter(([,n])=>n.level==="heavy").length;let r=`País possui ${a} dependência${a>1?"s":""} econômica${a>1?"s":""}.`;return o>0&&(r+=` ${o} crítica${o>1?"s":""}.`),s>0&&(r+=` ${s} pesada${s>1?"s":""}.`),r+=` Risco geral: ${t}.`,r}generateRecommendations(e,t){const a=[];(t==="critical"||t==="high")&&(a.push("Diversificar fontes de investimento externo urgentemente."),a.push("Aumentar investimentos internos para reduzir dependência.")),e.length>3&&a.push("Consolidar parcerias econômicas para reduzir complexidade.");const o=e.filter(([,s])=>s.level==="critical");return o.length>0&&a.push(`Negociar maior autonomia com ${o[0][0]} devido à dependência crítica.`),a.length===0&&a.push("Manter diversificação atual de investimentos externos."),a}clearCache(){this.dependencyCache.clear(),this.lastCacheUpdate=0}}const Be=new Te,F={growth:{excellent:["✨ **Crescimento Excepcional!** A economia nacional floresceu sob suas políticas visionárias.","🚀 **Boom Econômico!** Seus investimentos estratégicos criaram um círculo virtuoso de prosperidade.","⭐ **Era Dourada!** O país vivencia seu melhor período econômico em décadas."],good:["✅ **Crescimento Sólido** A diversificação econômica está dando frutos positivos.","📈 **Progresso Sustentável** Suas reformas econômicas mostram resultados consistentes.","💪 **Economia Resiliente** O país demonstra capacidade de crescimento estável."],moderate:["📊 **Crescimento Moderado** A economia mantém trajetória de expansão cautelosa.","⚖️ **Desenvolvimento Equilibrado** O país avança de forma sustentada, sem riscos.","🎯 **Metas Atingidas** Os objetivos econômicos estão sendo cumpridos gradualmente."],poor:["⚠️ **Crescimento Limitado** A economia enfrenta desafios que impedem maior expansão.","🔄 **Ajustes Necessários** É preciso revisar as estratégias de investimento atuais.","📉 **Potencial Não Realizado** O país possui capacidade para crescimento maior."],negative:["🚨 **Recessão Econômica** A economia nacional enfrenta sérias dificuldades.","⛈️ **Crise Econômica** Políticas de emergência são necessárias para estabilização.","🆘 **Situação Crítica** Reformas estruturais urgentes são essenciais para recuperação."]},inflation:{low:["💡 **Gestão Eficiente** Seus investimentos foram bem planejados, com baixa inflação.","🎯 **Precisão Econômica** A estratégia de diversificação evitou pressões inflacionárias.","⚡ **Investimento Inteligente** A alocação equilibrada de recursos maximizou a eficiência."],moderate:["⚠️ **Inflação Controlável** Há sinais de aquecimento econômico que requerem atenção.","🌡️ **Economia Aquecida** O volume de investimentos está criando pressões de preços.","⚖️ **Equilíbrio Delicado** É preciso balancear crescimento com estabilidade de preços."],high:["🔥 **Alta Inflação** O excesso de investimentos está criando desequilíbrios econômicos.","⛔ **Superaquecimento** A economia precisa de políticas de resfriamento urgentes.","📈 **Pressão de Preços** A concentração de gastos está gerando inflação preocupante."],severe:["🚨 **Hiperinflação Ameaça** Os investimentos excessivos criaram uma crise inflacionária.","💥 **Colapso de Preços** A estratégia econômica resultou em instabilidade monetária severa.","🌪️ **Descontrole Inflacionário** Medidas de emergência são necessárias imediatamente."]},chains:["🔗 **Sinergia Perfeita!** A combinação de infraestrutura e indústria potencializou o crescimento.","⚙️ **Engrenagem Eficiente** Pesquisa & Desenvolvimento impulsionou a modernização industrial.","🧬 **DNA de Inovação** A integração entre ciência e políticas sociais criou resultados excepcionais.","🏗️ **Base Sólida** Investimentos em infraestrutura criaram fundações para expansão industrial.","🔬 **Revolução Científica** P&D transformou o panorama tecnológico e social do país."],dependency:{created:["🤝 **Nova Parceria** Sua cooperação com {investor} fortaleceu os laços econômicos.","🌍 **Integração Internacional** Os investimentos externos expandiram horizontes econômicos.","💼 **Diplomacia Econômica** A parceria internacional traz benefícios mútuos."],increased:["📈 **Dependência Crescente** Sua economia está cada vez mais integrada com {investor}.","⚠️ **Atenção Necessária** A dependência de {investor} requer monitoramento cuidadoso.","🔄 **Diversificação Recomendada** Considere expandir parcerias para reduzir riscos."],critical:["🚨 **Dependência Crítica** Sua economia tornou-se vulnerável às crises de {investor}.","⛔ **Risco Elevado** A dependência excessiva de {investor} compromete a autonomia nacional.","🆘 **Alerta Máximo** É urgente diversificar fontes de investimento externo."]},external_actions:["🌐 **Influência Internacional** Seus investimentos em {target} fortalecem sua posição geopolítica.","🤝 **Soft Power** A ajuda econômica a {target} amplia sua influência regional.","💰 **Diplomacia do Dólar** Os investimentos externos são uma ferramenta de política externa eficaz.","🌟 **Liderança Global** Sua capacidade de investir no exterior demonstra força econômica.","⚖️ **Responsabilidade Internacional** Os investimentos externos equilibram desenvolvimento e cooperação."],stability:["🏥 **Bem-Estar Social** Investimentos em saúde e educação fortalecem a coesão nacional.","👥 **Harmonia Social** Políticas sociais reduzem tensões e aumentam a estabilidade.","🛡️ **Resiliência Nacional** A estabilidade política é a base para crescimento sustentado.","🕊️ **Paz Social** Investimentos sociais criam um ambiente favorável ao desenvolvimento."],rejection:["😠 **Resistência Popular** A população de {target} vê seus investimentos como ingerência externa.","🗳️ **Tensão Política** Os investimentos em {target} geraram protestos e instabilidade.","🚫 **Rejeição Nacional** {target} demonstra resistência crescente à sua influência econômica.","⚡ **Conflito Diplomático** Os investimentos externos criaram atritos internacionais."]};class Le{async generatePlayerFeedback(e,t,a){try{const o={countryId:e,turn:this.getCurrentTurn(),timestamp:new Date,mainMessage:"",details:[],warnings:[],achievements:[],recommendations:[]},s=this.generateGrowthFeedback(t);o.mainMessage=s.message,s.achievement&&o.achievements.push(s.achievement);const r=this.generateInflationFeedback(t);if(r&&o.details.push(r),t.productiveChains.length>0){const l=this.generateChainFeedback(t.productiveChains);o.details.push(l)}const n=a.filter(l=>l.isExternal);if(n.length>0){const l=await this.generateExternalFeedback(n,e);o.details.push(...l)}const i=await this.generateDependencyFeedback(e);i&&o.warnings.push(...i);const c=this.generateStrategicRecommendations(t,a);return o.recommendations.push(...c),await this.saveFeedback(o),o}catch(o){throw d.error("Erro ao gerar feedback do player:",o),o}}generateGrowthFeedback(e){const t=e.finalGrowth/e.newPIB*100;let a,o=null;t>=15?(a="excellent",o="🏆 **Milagre Econômico** - Crescimento excepcional de mais de 15%"):t>=8?(a="good",o="🥇 **Crescimento Exemplar** - Expansão econômica robusta"):t>=3?a="moderate":t>=0?a="poor":a="negative";const s=F.growth[a];return{message:this.randomChoice(s),achievement:o}}generateInflationFeedback(e){const t=e.totalInflation*100;let a;if(t>=60?a="severe":t>=35?a="high":t>=15?a="moderate":a="low",a==="low")return null;const o=F.inflation[a];return this.randomChoice(o)}generateChainFeedback(e){e.map(a=>a.name).join(", ");let t=this.randomChoice(F.chains);return e.some(a=>a.name.includes("Infraestrutura"))?t="🔗 **Sinergia Infraestrutural** A base sólida potencializou outros setores da economia.":e.some(a=>a.name.includes("P&D"))&&(t="🧬 **Inovação Integrada** Pesquisa & Desenvolvimento revolucionou múltiplos setores."),t}async generateExternalFeedback(e,t){const a=[];for(const o of e){if(!o.targetCountry)continue;const s=await this.getCountryData(o.targetCountry);if(!s)continue;if(this.checkRejectionRisk(o,s).hasRisk){const n=this.randomChoice(F.rejection).replace("{target}",s.Pais||o.targetCountry);a.push(n)}else{const n=this.randomChoice(F.external_actions).replace("{target}",s.Pais||o.targetCountry);a.push(n)}}return a}async generateDependencyFeedback(e){try{const t=await Be.analyzeAllDependencies(e),a=[];if(t.dependencies.length===0)return null;const o=t.dependencies.filter(([,r])=>r.level==="critical"),s=t.dependencies.filter(([,r])=>r.level==="heavy");for(const[r,n]of o){const i=await this.getCountryData(r),c=this.randomChoice(F.dependency.critical).replace("{investor}",i?.Pais||r);a.push(c)}for(const[r,n]of s.slice(0,2)){const i=await this.getCountryData(r),c=this.randomChoice(F.dependency.increased).replace("{investor}",i?.Pais||r);a.push(c)}return a}catch(t){return d.error("Erro ao gerar feedback de dependência:",t),null}}generateStrategicRecommendations(e,t){const a=[],o=e.totalInflation*100,s=t.some(n=>n.isExternal),r=[...new Set(t.map(n=>n.type))];return o>40?a.push("💡 **Sugestão:** Reduza o volume de investimentos no próximo turno para controlar a inflação."):o<5&&a.push("💡 **Oportunidade:** Sua economia pode absorver mais investimentos sem riscos inflacionários."),r.length<=2&&a.push("🎯 **Estratégia:** Diversifique os tipos de investimento para ativar cadeias produtivas."),!s&&e.finalGrowth>0?a.push("🌍 **Diplomacia:** Considere investimentos externos para expandir sua influência internacional."):s&&t.filter(n=>n.isExternal).length>=3&&a.push("🏠 **Foco Interno:** Balance investimentos externos com desenvolvimento interno."),e.productiveChains.length===0&&a.push("🔗 **Sinergia:** Combine diferentes tipos de investimento para ativar bônus de cadeias produtivas."),a.slice(0,3)}checkRejectionRisk(e,t){const a=parseFloat(t.Estabilidade)||0,o=parseFloat(t.PIB)||1,r=(parseFloat(e.value)||0)*1e6/o;return{hasRisk:a<40&&r>.1,riskLevel:r>.2?"high":"medium"}}async saveFeedback(e){try{await p.collection("player_feedback").doc().set({...e,createdAt:new Date}),d.info(`Feedback salvo para país ${e.countryId}`)}catch(t){throw d.error("Erro ao salvar feedback:",t),t}}async getPlayerFeedback(e,t=5){try{return(await p.collection("player_feedback").where("countryId","==",e).orderBy("turn","desc").limit(t).get()).docs.map(o=>({id:o.id,...o.data()}))}catch(a){return d.error("Erro ao buscar feedback do player:",a),[]}}randomChoice(e){return e[Math.floor(Math.random()*e.length)]}getCurrentTurn(){return parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}async getCountryData(e){try{const t=await p.collection("paises").doc(e).get();return t.exists?t.data():null}catch(t){return d.error("Erro ao buscar dados do país:",t),null}}formatFeedbackForDisplay(e){let t=`
      <div class="economic-feedback-panel bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6 mb-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="text-2xl">📊</div>
          <div>
            <h3 class="text-lg font-semibold text-slate-200">Panorama Econômico - Turno #${e.turn}</h3>
            <p class="text-sm text-slate-400">Análise do desempenho econômico nacional</p>
          </div>
        </div>

        <div class="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-600/30">
          <div class="text-slate-200 leading-relaxed">${e.mainMessage}</div>
        </div>
    `;return e.achievements.length>0&&(t+=`
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-emerald-400 mb-2">🏆 Conquistas</h4>
          <div class="space-y-2">
            ${e.achievements.map(a=>`
              <div class="text-emerald-300 text-sm">${a}</div>
            `).join("")}
          </div>
        </div>
      `),e.details.length>0&&(t+=`
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-blue-400 mb-2">📋 Detalhes</h4>
          <div class="space-y-2">
            ${e.details.map(a=>`
              <div class="text-slate-300 text-sm">• ${a}</div>
            `).join("")}
          </div>
        </div>
      `),e.warnings.length>0&&(t+=`
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-yellow-400 mb-2">⚠️ Atenção</h4>
          <div class="space-y-2">
            ${e.warnings.map(a=>`
              <div class="text-yellow-300 text-sm">• ${a}</div>
            `).join("")}
          </div>
        </div>
      `),e.recommendations.length>0&&(t+=`
        <div>
          <h4 class="text-sm font-semibold text-purple-400 mb-2">💡 Recomendações</h4>
          <div class="space-y-2">
            ${e.recommendations.map(a=>`
              <div class="text-purple-300 text-sm">• ${a}</div>
            `).join("")}
          </div>
        </div>
      `),t+="</div>",t}}const Me=new Le,A={maxInternalActions:10,maxExternalActions:3,actionTypes:{infrastructure:{id:"infrastructure",name:"🏗️ Infraestrutura",multiplier:1.3,description:"Estradas, energia, telecomunicações",bonusCondition:"urbanization > 50",bonusValue:.4,examples:["Construção de rodovias","Expansão da rede elétrica","Fibra óptica nacional"]},research:{id:"research",name:"🔬 Pesquisa & Desenvolvimento",multiplier:1.8,description:"Universidades, inovação científica",bonusCondition:"technology > 60",bonusValue:.5,examples:["Centros de pesquisa","Universidades tecnológicas","Programas de inovação"]},industry:{id:"industry",name:"🏭 Desenvolvimento Industrial",multiplier:1.6,description:"Fábricas, refinarias",bonusValue:.5,penaltyCondition:"stability < 40",penaltyValue:.15,examples:["Complexos industriais","Refinarias de petróleo","Siderúrgicas"]},exploration:{id:"exploration",name:"⛏️ Exploração de Recursos",multiplier:.8,description:"Exploração mineral e de recursos primários. Gera menos crescimento econômico que outras ações, mas adiciona recursos ao estoque do país.",examples:["Exploração de jazidas","Perfuração de poços","Mineração"]},social:{id:"social",name:"🏥 Investimento Social",multiplier:1.1,description:"Saúde, educação, habitação",stabilityBonus:1,examples:["Hospitais públicos","Escolas técnicas","Programas habitacionais"]}},productiveChains:{"infrastructure+industry":{name:"Infraestrutura + Indústria",bonus:.15,effect:"Elimina penalidade de estabilidade se < 50",description:"Infraestrutura potencializa desenvolvimento industrial"},"research+industry":{name:"P&D + Indústria",bonus:.1,effect:"+1 ponto adicional de tecnologia",description:"Inovação acelera crescimento industrial"},"research+social":{name:"P&D + Social",socialBonus:.2,effect:"+1 ponto adicional de tecnologia",description:"Pesquisa melhora políticas sociais"}}};class ke{constructor(){this.countries=[],this.selectedCountry=null,this.currentBudget=0,this.actions={internal:[],external:[]},this.economicHistory=new Map,this.changes={technology:{},indicators:{}}}async initialize(){try{d.info("Inicializando Sistema Econômico..."),await this.loadCountries(),await this.loadEconomicHistory(),this.setupEventListeners(),d.info("Sistema Econômico inicializado com sucesso")}catch(e){throw d.error("Erro ao inicializar Sistema Econômico:",e),e}}async loadCountries(){try{this.countries=await re(),this.countries.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),d.info(`${this.countries.length} países carregados`)}catch(e){throw d.error("Erro ao carregar países no EconomicSimulator:",e),e}}async loadEconomicHistory(){try{(await p.collection("economic_history").get()).docs.forEach(t=>{const a=t.data(),o=a.countryId;this.economicHistory.has(o)||this.economicHistory.set(o,[]),this.economicHistory.get(o).push({turn:a.turn,totalInvestment:a.totalInvestment,externalInvestments:a.externalInvestments||{},results:a.results})}),d.info("Histórico econômico carregado")}catch(e){d.warn("Erro ao carregar histórico econômico:",e)}}setupEventListeners(){const e=document.getElementById("economic-simulator");e&&e.addEventListener("click",()=>this.showModal())}showModal(){if(!this.selectedCountry){const e=document.getElementById("select-pais")?.value;this.selectedCountry=e||(this.countries.length>0?this.countries[0].id:null)}if(!this.selectedCountry){g("warning","Nenhum país disponível");return}this.createModal()}createModal(){const e=this.getCountryById(this.selectedCountry);if(!e)return;this.currentBudget=this.calculateBudget(e);const t=document.createElement("div");t.className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",t.id="economic-simulator-modal";const a=document.createElement("div");a.className="bg-slate-800 border border-slate-600/70 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col",a.innerHTML=`
      ${this.createModalHeader(e)}
      ${this.createModalTabs()}
      ${this.createModalContent(e)}
      ${this.createModalFooter()}
    `,t.appendChild(a),document.body.appendChild(t),this.setupModalEventListeners(),setTimeout(()=>{const o=t.querySelector('input[type="number"]');o&&o.focus()},100)}createModalHeader(e){const t=this.formatCurrency(this.currentBudget);return`
      <div class="flex items-center justify-between p-6 border-b border-slate-600/50">
        <div class="flex items-center gap-4">
          <div class="text-2xl">💰</div>
          <div>
            <h2 class="text-xl font-bold text-slate-100">Painel de Gestão de Turno</h2>
            <p class="text-sm text-slate-400">Controle completo de economia, tecnologia, recursos e indicadores</p>
          </div>
        </div>
        
        <div class="flex items-center gap-4">
          <div class="text-right">
            <div class="text-sm text-slate-400">País Selecionado</div>
            <select id="modal-country-select" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-slate-200">
              ${this.countries.map(a=>`
                <option value="${a.id}" ${a.id===this.selectedCountry?"selected":""}>
                  ${a.Pais||a.id}
                </option>
              `).join("")}
            </select>
          </div>

          <div class="text-right">
            <div class="text-sm text-slate-400">Política Industrial</div>
            <select id="modal-industrial-policy" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-slate-200">
              <option value="combustivel" ${(e.PoliticaIndustrial||e.Politica||"combustivel")==="combustivel"?"selected":""}>Combustível</option>
              <option value="carvao" ${(e.PoliticaIndustrial||e.Politica||"combustivel")==="carvao"?"selected":""}>Carvão</option>
            </select>
          </div>

          <div class="text-right">
            <div class="text-sm text-slate-400">Orçamento Disponível</div>
            <div class="text-lg font-semibold text-emerald-400">${t}</div>
          </div>

          <button id="close-economic-modal" class="text-slate-400 hover:text-slate-200 text-2xl">
            ×
          </button>
        </div>
      </div>
    `}createModalTabs(){return`
      <div class="flex border-b border-slate-600/50 overflow-x-auto">
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-purple-500 text-purple-400 bg-slate-700/30 whitespace-nowrap" data-tab="internal">
          💰 Economia
        </button>
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 whitespace-nowrap" data-tab="technology">
          🔬 Tecnologia
        </button>
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 whitespace-nowrap" data-tab="indicators">
          📊 Indicadores
        </button>
        <button class="economic-tab px-6 py-3 text-sm font-medium border-b-2 border-transparent text-slate-400 hover:text-slate-200 whitespace-nowrap" data-tab="summary">
          ✅ Resumo
        </button>
      </div>
    `}createModalContent(e){return`
      <div class="flex-1 overflow-y-auto">
        <!-- Tab Economia (Ações Internas/Externas) -->
        <div id="economic-tab-internal" class="economic-tab-content p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-200 mb-2">💰 Sistema Econômico</h3>
            <p class="text-sm text-slate-400">Gestão de investimentos internos e externos</p>
          </div>

          <!-- Sub-tabs para Internal/External -->
          <div class="flex gap-2 mb-4">
            <button class="economy-subtab px-4 py-2 rounded-lg bg-purple-600 text-white text-sm" data-subtab="internal">
              🏠 Investimentos Internos (0/${A.maxInternalActions})
            </button>
            <button class="economy-subtab px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600" data-subtab="external">
              🌍 Investimentos Externos (0/${A.maxExternalActions})
            </button>
          </div>

          <!-- Ações Internas -->
          <div id="economy-subtab-internal" class="economy-subtab-content">
            <div id="internal-actions-container" class="space-y-4">
              ${this.createActionSlots("internal")}
            </div>

            <div class="mt-6">
              <button id="add-internal-action" class="w-full border-2 border-dashed border-slate-600 rounded-lg py-8 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors">
                + Adicionar Ação Interna
              </button>
            </div>
          </div>

          <!-- Ações Externas -->
          <div id="economy-subtab-external" class="economy-subtab-content hidden">
            <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div class="flex items-start gap-3">
                <div class="text-yellow-400">⚠️</div>
                <div>
                  <div class="text-yellow-200 font-medium mb-1">Atenção: Investimentos Externos</div>
                  <div class="text-yellow-100 text-sm">
                    • Grandes investimentos podem criar dependência econômica<br>
                    • Países instáveis podem rejeitar ajuda externa<br>
                    • Benefícios são divididos 50/50 entre os países
                  </div>
                </div>
              </div>
            </div>

            <div id="external-actions-container" class="space-y-4">
              ${this.createActionSlots("external")}
            </div>

            <div class="mt-6">
              <button id="add-external-action" class="w-full border-2 border-dashed border-slate-600 rounded-lg py-8 text-slate-400 hover:border-slate-500 hover:text-slate-300 transition-colors">
                + Adicionar Ação Externa
              </button>
            </div>
          </div>
        </div>

        <!-- Tab Tecnologia -->
        <div id="economic-tab-technology" class="economic-tab-content hidden p-6">
          ${this.createTechnologyTab(e)}
        </div>

        <!-- Tab Indicadores -->
        <div id="economic-tab-indicators" class="economic-tab-content hidden p-6">
          ${this.createIndicatorsTab(e)}
        </div>

        <!-- Tab Resumo -->
        <div id="economic-tab-summary" class="economic-tab-content hidden p-6">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-slate-200 mb-2">✅ Resumo do Turno</h3>
            <p class="text-sm text-slate-400">Análise final antes de aplicar as mudanças</p>
          </div>

          <div id="economic-summary-content">
            <!-- Será preenchido dinamicamente -->
          </div>
        </div>
      </div>
    `}createTechnologyTab(e){const t={Tecnologia:{label:"Tecnologia Civil",current:parseFloat(e.Tecnologia)||0},Aeronautica:{label:"Aeronáutica",current:parseFloat(e.Aeronautica)||0},Marinha:{label:"Marinha",current:parseFloat(e.Marinha)||0},Veiculos:{label:"Veículos",current:parseFloat(e.Veiculos)||0},Exercito:{label:"Exército",current:parseFloat(e.Exercito)||0}};return`
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-slate-200 mb-2">🔬 Ajustes de Tecnologia</h3>
        <p class="text-sm text-slate-400">Adicionar ou subtrair pontos de tecnologia (sem limite superior)</p>
      </div>

      <div class="space-y-4">
        ${Object.entries(t).map(([a,o])=>`
          <div class="border border-slate-600/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-slate-200">${o.label}</label>
              <div class="text-sm text-slate-400">Atual: <span class="text-slate-200 font-semibold">${o.current}</span></div>
            </div>

            <div class="flex items-center gap-3">
              <button class="tech-decrement px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-lg" data-field="${a}">−</button>
              <input type="number"
                     class="tech-input flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-center"
                     data-field="${a}"
                     placeholder="0"
                     value="${this.changes.technology[a]||0}">
              <button class="tech-increment px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-lg" data-field="${a}">+</button>
              <div class="text-sm text-slate-300 min-w-[80px] text-right">
                → <span class="font-semibold tech-preview" data-field="${a}">${o.current+(this.changes.technology[a]||0)}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `}createIndicatorsTab(e){const t={Estabilidade:{label:"Estabilidade",current:parseFloat(e.Estabilidade)||0,min:0,max:100},Burocracia:{label:"Burocracia",current:parseFloat(e.Burocracia)||0,min:0,max:100},Urbanizacao:{label:"Urbanização",current:parseFloat(e.Urbanizacao)||0,min:0,max:100},IndustrialEfficiency:{label:"Eficiência Industrial",current:parseFloat(e.IndustrialEfficiency)||0,min:0,max:100}};return`
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-slate-200 mb-2">📊 Indicadores Nacionais</h3>
        <p class="text-sm text-slate-400">Ajustar indicadores percentuais (0-100%)</p>
      </div>

      <div class="mb-4 bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div class="text-blue-200 text-sm">
          <strong>População:</strong> ${(parseFloat(e.Populacao)||0).toLocaleString("pt-BR")} habitantes (somente leitura)
        </div>
      </div>

      <div class="space-y-4">
        ${Object.entries(t).map(([a,o])=>`
          <div class="border border-slate-600/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <label class="text-sm font-medium text-slate-200">${o.label}</label>
              <div class="text-sm text-slate-400">Atual: <span class="text-slate-200 font-semibold">${o.current}%</span></div>
            </div>

            <div class="flex items-center gap-3">
              <button class="indicator-decrement px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-lg" data-field="${a}">−</button>
              <input type="number"
                     class="indicator-input flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-center"
                     data-field="${a}"
                     placeholder="0"
                     min="${o.min-o.current}"
                     max="${o.max-o.current}"
                     value="${this.changes.indicators[a]||0}">
              <button class="indicator-increment px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-lg" data-field="${a}">+</button>
              <div class="text-sm text-slate-300 min-w-[80px] text-right">
                → <span class="font-semibold indicator-preview" data-field="${a}">
                  ${Math.min(o.max,Math.max(o.min,o.current+(this.changes.indicators[a]||0)))}%
                </span>
              </div>
            </div>

            <!-- Barra de progresso -->
            <div class="mt-2 w-full bg-slate-700 rounded-full h-2">
              <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                   style="width: ${Math.min(o.max,Math.max(o.min,o.current+(this.changes.indicators[a]||0)))}%">
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `}createModalFooter(){return`
      <div class="border-t border-slate-600/50 p-6 bg-slate-800/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="text-sm text-slate-400">
              Orçamento Usado: <span id="budget-used" class="text-slate-200 font-medium">$0</span> / ${this.formatCurrency(this.currentBudget)}
            </div>
            <div class="w-64 bg-slate-700 rounded-full h-2">
              <div id="budget-bar" class="bg-gradient-to-r from-emerald-500 to-yellow-500 h-2 rounded-full transition-all" style="width: 0%"></div>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button id="reset-economic-actions" class="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors">
              🔄 Resetar
            </button>
            <button id="apply-economic-actions" class="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              ⚡ Aplicar Investimentos
            </button>
          </div>
        </div>
      </div>
    `}createActionSlots(e){const t=e==="internal"?A.maxInternalActions:A.maxExternalActions,a=this.actions[e];let o="";for(let s=0;s<a.length;s++)o+=this.createActionSlot(e,s,a[s]);return a.length<t&&(o+=this.createActionSlot(e,a.length,null)),o}createActionSlot(e,t,a=null){const o=e==="external",s=a?.type==="exploration",r=A.actionTypes;return`
      <div class="action-slot border border-slate-600/50 rounded-lg p-4" data-type="${e}" data-index="${t}">
        <div class="grid grid-cols-1 md:grid-cols-${o?"6":"5"} gap-4 items-end">

          <!-- Tipo de Ação -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Tipo de Ação</label>
            <select class="action-type w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              ${Object.values(r).map(n=>`
                <option value="${n.id}" ${a?.type===n.id?"selected":""}>
                  ${n.name}
                </option>
              `).join("")}
            </select>
          </div>

          ${o?`
          <!-- País Destino -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">País Destino</label>
            <select class="target-country w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              ${this.countries.filter(n=>n.id!==this.selectedCountry).map(n=>`
                <option value="${n.id}" ${a?.targetCountry===n.id?"selected":""}>
                  ${n.Pais||n.id}
                </option>
              `).join("")}
            </select>
          </div>
          `:""}

          <!-- Tipo de Recurso (apenas para exploration) -->
          <div class="resource-type-selector ${s?"":"hidden"}">
            <label class="block text-xs text-slate-400 mb-1">Tipo de Recurso</label>
            <select class="resource-type w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              <option value="Combustivel" ${a?.resourceType==="Combustivel"?"selected":""}>🛢️ Combustível (Petróleo)</option>
              <option value="Carvao" ${a?.resourceType==="Carvao"?"selected":""}>⚫ Carvão</option>
              <option value="Metais" ${a?.resourceType==="Metais"?"selected":""}>⛏️ Metais</option>
            </select>
          </div>

          <!-- Valor Investido -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Valor (milhões)</label>
            <input type="number" class="action-value w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200"
                   placeholder="0" min="0" step="10" value="${a?.value||""}">
          </div>

          <!-- Resultado do Dado -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Dado D12</label>
            <input type="number" class="action-dice w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200"
                   placeholder="1-12" min="1" max="12" value="${a?.dice||""}">
          </div>

          <!-- Buff/Debuff -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Buff/Debuff (%)</label>
            <input type="range" class="action-buff w-full" min="-3" max="3" step="0.5" value="${a?.buff||0}">
            <div class="text-xs text-center text-slate-300 mt-1"><span class="buff-value">${a?.buff||0}</span>%</div>
          </div>

          <!-- Preview e Ações -->
          <div class="flex flex-col gap-2">
            <div class="growth-preview text-xs text-center px-2 py-1 rounded bg-slate-700 text-slate-300">
              +0.0%
            </div>
            <button class="remove-action text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/10">
              🗑️ Remover
            </button>
          </div>

        </div>

        <!-- Descrição do Tipo -->
        <div class="action-description mt-3 p-3 bg-slate-700/30 rounded-lg hidden">
          <div class="text-sm text-slate-300"></div>
        </div>

        <!-- Preview de Extração (apenas para exploration) -->
        <div class="extraction-preview mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg ${s?"":"hidden"}">
          <div class="text-xs text-emerald-300">
            <strong>Extração Estimada:</strong> <span class="extraction-amount">Aguardando dados...</span>
          </div>
        </div>
      </div>
    `}setupModalEventListeners(){const e=document.getElementById("economic-simulator-modal");if(!e)return;e.querySelector("#close-economic-modal").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",a=>{a.target===e&&e.remove()}),e.querySelector("#modal-country-select").addEventListener("change",a=>{this.selectedCountry=a.target.value,this.resetActions(),e.remove(),this.showModal()});const t=e.querySelector("#modal-industrial-policy");t&&t.addEventListener("change",a=>{const o=this.getCountryById(this.selectedCountry);if(o){o.PoliticaIndustrial=a.target.value;try{p.collection("paises").doc(this.selectedCountry).update({PoliticaIndustrial:a.target.value})}catch(s){console.warn("Erro ao salvar PoliticaIndustrial:",s)}}}),e.querySelectorAll(".economic-tab").forEach(a=>{a.addEventListener("click",o=>{this.switchTab(o.target.dataset.tab)})}),e.querySelector("#add-internal-action")?.addEventListener("click",()=>{this.addAction("internal")}),e.querySelector("#add-external-action")?.addEventListener("click",()=>{this.addAction("external")}),e.querySelector("#reset-economic-actions")?.addEventListener("click",()=>{this.resetActions()}),e.querySelector("#apply-economic-actions")?.addEventListener("click",()=>{this.applyEconomicActions()}),this.setupActionFieldListeners()}setupActionFieldListeners(){const e=document.getElementById("economic-simulator-modal");e&&(e.addEventListener("input",t=>{if(t.target.matches(".action-type, .target-country, .action-value, .action-dice, .action-buff, .resource-type")){const a=t.target.closest(".action-slot"),o=a.dataset.type,s=parseInt(a.dataset.index);this.updateActionFromSlot(o,s,a),this.updatePreview(a),this.updateBudgetBar(),this.updateSummary()}}),e.addEventListener("click",t=>{if(t.target.matches(".remove-action")){const a=t.target.closest(".action-slot"),o=a.dataset.type,s=parseInt(a.dataset.index);this.removeAction(o,s)}}),e.addEventListener("change",t=>{t.target.matches(".action-type")&&(this.toggleActionDescription(t.target),this.toggleResourceSelector(t.target))}),e.querySelectorAll(".economy-subtab").forEach(t=>{t.addEventListener("click",a=>{const o=a.target.dataset.subtab;this.switchEconomySubtab(o)})}),e.addEventListener("click",t=>{if(t.target.matches(".tech-increment")){const a=t.target.dataset.field;this.adjustTechnology(a,1)}else if(t.target.matches(".tech-decrement")){const a=t.target.dataset.field;this.adjustTechnology(a,-1)}}),e.addEventListener("input",t=>{if(t.target.matches(".tech-input")){const a=t.target.dataset.field,o=parseInt(t.target.value)||0;this.changes.technology[a]=o,this.updateTechPreview(a),this.updateSummary()}}),e.addEventListener("click",t=>{if(t.target.matches(".indicator-increment")){const a=t.target.dataset.field;this.adjustIndicator(a,1)}else if(t.target.matches(".indicator-decrement")){const a=t.target.dataset.field;this.adjustIndicator(a,-1)}}),e.addEventListener("input",t=>{if(t.target.matches(".indicator-input")){const a=t.target.dataset.field,o=parseFloat(t.target.value)||0;this.changes.indicators[a]=o,this.updateIndicatorPreview(a),this.updateSummary()}}))}calculateBudget(e){return xe(e)}formatCurrency(e){return ie(e)}getCountryById(e){return this.countries.find(t=>t.id===e)}switchTab(e){const t=document.getElementById("economic-simulator-modal");if(!t)return;t.querySelectorAll(".economic-tab").forEach(s=>{s.classList.remove("border-purple-500","text-purple-400","bg-slate-700/30"),s.classList.add("border-transparent","text-slate-400")}),t.querySelectorAll(".economic-tab-content").forEach(s=>{s.classList.add("hidden")});const a=t.querySelector(`[data-tab="${e}"]`),o=t.querySelector(`#economic-tab-${e}`);a&&o&&(a.classList.add("border-purple-500","text-purple-400","bg-slate-700/30"),a.classList.remove("border-transparent","text-slate-400"),o.classList.remove("hidden")),e==="summary"&&this.updateSummary()}addAction(e){const t=e==="internal"?A.maxInternalActions:A.maxExternalActions;if(this.actions[e].length>=t){g("warning",`Máximo de ${t} ações ${e==="internal"?"internas":"externas"} atingido`);return}this.actions[e].push({type:"",value:0,dice:0,buff:0,targetCountry:e==="external"?"":null}),this.recreateActionSlots(e),this.updateTabCounters()}removeAction(e,t){t>=0&&t<this.actions[e].length&&(this.actions[e].splice(t,1),this.recreateActionSlots(e),this.updateTabCounters(),this.updateBudgetBar(),this.updateSummary())}recreateActionSlots(e){const t=document.getElementById(`${e}-actions-container`);t&&(t.innerHTML=this.createActionSlots(e))}updateActionFromSlot(e,t,a){this.actions[e][t]||(this.actions[e][t]={});const o=this.actions[e][t];o.type=a.querySelector(".action-type")?.value||"",o.value=parseFloat(a.querySelector(".action-value")?.value)||0,o.dice=parseInt(a.querySelector(".action-dice")?.value)||0,o.buff=parseFloat(a.querySelector(".action-buff")?.value)||0,o.isExternal=e==="external",e==="external"&&(o.targetCountry=a.querySelector(".target-country")?.value||""),o.type==="exploration"&&(o.resourceType=a.querySelector(".resource-type")?.value||"");const s=a.querySelector(".buff-value");s&&(s.textContent=o.buff),o.type==="exploration"&&this.updateExtractionPreview(a,o)}updatePreview(e){const t=e.dataset.type,a=parseInt(e.dataset.index),o=this.actions[t][a];if(!o||!o.type||!o.value||!o.dice){e.querySelector(".growth-preview").textContent="+0.0%";return}const s=this.getCountryById(this.selectedCountry);if(s)try{let r;if(o.type==="exploration"&&o.resourceType){const l={Combustivel:"CombustivelProducao",Carvao:"CarvaoProducao",Metais:"MetaisProducao"}[o.resourceType],u=parseFloat(s[l])||1,f=A.actionTypes[o.type]?.multiplier||.8;r=(o.value/u*f*100).toFixed(2)}else r=(k.calculateBaseGrowth(o,s).preInflationGrowth*100).toFixed(2);const n=e.querySelector(".growth-preview");n.textContent=`+${r}%`,n.className="growth-preview text-xs text-center px-2 py-1 rounded";const i=parseFloat(r);i>1?n.classList.add("bg-emerald-700","text-emerald-200"):i>0?n.classList.add("bg-blue-700","text-blue-200"):i===0?n.classList.add("bg-yellow-700","text-yellow-200"):n.classList.add("bg-red-700","text-red-200")}catch(r){d.error("Erro no preview:",r),e.querySelector(".growth-preview").textContent="Erro"}}updateBudgetBar(){const e=[...this.actions.internal,...this.actions.external].reduce((n,i)=>n+(parseFloat(i.value)||0),0),t=this.formatCurrency(e*1e6),a=Math.min(e*1e6/this.currentBudget*100,100),o=document.getElementById("budget-used"),s=document.getElementById("budget-bar"),r=document.getElementById("apply-economic-actions");if(o&&(o.textContent=t),s&&(s.style.width=`${a}%`,s.className="h-2 rounded-full transition-all",a>90?s.classList.add("bg-gradient-to-r","from-red-500","to-red-600"):a>70?s.classList.add("bg-gradient-to-r","from-yellow-500","to-orange-500"):s.classList.add("bg-gradient-to-r","from-emerald-500","to-green-500")),r){const n=[...this.actions.internal,...this.actions.external].some(c=>c.type&&c.value>0&&c.dice>0),i=e*1e6>this.currentBudget;r.disabled=!n||i,i?r.textContent="❌ Orçamento Excedido":n?r.textContent="⚡ Aplicar Investimentos":r.textContent="⏳ Configure as Ações"}}updateTabCounters(){const e=document.querySelector('[data-tab="internal"]'),t=document.querySelector('[data-tab="external"]');e&&(e.innerHTML=`🏠 Ações Internas (${this.actions.internal.length}/${A.maxInternalActions})`),t&&(t.innerHTML=`🌍 Ações Externas (${this.actions.external.length}/${A.maxExternalActions})`)}updateSummary(){const e=document.getElementById("economic-summary-content");if(!e)return;const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=[...this.actions.internal,...this.actions.external].filter(n=>n.type&&n.value>0),o=Object.values(this.changes.technology).some(n=>n!==0),s=Object.values(this.changes.indicators).some(n=>n!==0);if(!(a.length>0||o||s)){e.innerHTML=`
        <div class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-4">📊</div>
          <div class="text-lg mb-2">Nenhuma mudança configurada</div>
          <div class="text-sm">Configure ações econômicas, tecnologia, recursos ou indicadores para ver o resumo</div>
        </div>
      `;return}try{let n=null;if(a.length>0){const i={};a.filter(c=>c.isExternal).forEach(c=>{c.targetCountry&&(i[c.targetCountry]=this.getCountryById(c.targetCountry))}),n=k.processAllActions(a,t,i)}e.innerHTML=this.createSummaryHTML(n,t)}catch(n){d.error("Erro ao atualizar resumo:",n),e.innerHTML=`
        <div class="text-center py-12 text-red-400">
          <div class="text-4xl mb-4">❌</div>
          <div class="text-lg mb-2">Erro no cálculo</div>
          <div class="text-sm">Verifique se todas as ações estão configuradas corretamente</div>
        </div>
      `}}createSummaryHTML(e,t){let a='<div class="space-y-6">';if(e){parseFloat(t.PIB);const r=(e.finalGrowth*100).toFixed(2),n=(e.totalGrowth*100).toFixed(2),i=(e.totalInflation*100).toFixed(1);a+=`
        <!-- Resultado Principal -->
        <div class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">💰 Impacto Econômico</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-lg font-bold text-slate-300">${Y(parseFloat(t.PIBPerCapita)||0)}</div>
              <div class="text-xs text-slate-400 mt-1">PIB per Capita</div>
            </div>
            
            <div class="text-center">
              <div class="text-lg font-bold text-emerald-400">${Y(e.newPIBPerCapita)}</div>
              <div class="text-xs text-slate-400 mt-1">Novo PIB per Capita</div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">+${r}%</div>
              <div class="text-xs text-slate-400 mt-1">Crescimento Real</div>
              <div class="text-xs text-emerald-300">${this.formatCurrency(e.newPIB)} PIB</div>
            </div>
            
            <div class="text-center">
              <div class="text-xl font-bold text-red-400">${i}%</div>
              <div class="text-xs text-slate-400 mt-1">Inflação Aplicada</div>
            </div>
          </div>
          
          ${e.technologyChanges>0||e.stabilityChanges>0?`
            <div class="mt-4 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <div class="text-emerald-200 text-sm font-medium mb-2">📈 Bônus Adicionais</div>
              <div class="flex gap-4 text-xs">
                ${e.technologyChanges>0?`<div class="text-emerald-300">🔬 Tecnologia: +${e.technologyChanges} pontos</div>`:""}
                ${e.stabilityChanges>0?`<div class="text-emerald-300">🏥 Estabilidade: +${e.stabilityChanges} pontos</div>`:""}
              </div>
            </div>
          `:""}
          
          ${e.totalInflation>.3?`
            <div class="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div class="text-yellow-200 text-sm">
                ⚠️ <strong>Alta Inflação:</strong> Sem inflação, o crescimento seria de +${n}%
              </div>
            </div>
          `:""}
        </div>

        <!-- Breakdown por Ação -->
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">📋 Detalhamento por Ação</h4>
          
          <div class="space-y-3">
            ${e.actions.map(c=>{const l=(c.preInflationGrowth*100).toFixed(3),u=A.actionTypes[c.type],v=c.dice>5,f=c.dice===4||c.dice===5;return`
                <div class="flex items-center justify-between p-3 rounded-lg ${v?"bg-emerald-900/20 border border-emerald-500/30":c.dice<=3?"bg-red-900/20 border border-red-500/30":f?"bg-yellow-900/20 border border-yellow-500/30":"bg-slate-700/30 border border-slate-600/30"}">
                  <div class="flex-1">
                    <div class="font-medium text-slate-200">
                      ${u?.name||c.type} 
                      ${c.isExternal?`→ ${this.getCountryById(c.targetCountry)?.Pais||"País"}`:""}
                    </div>
                    <div class="text-sm text-slate-400">
                      ${this.formatCurrency(c.value*1e6)} • Dado: ${c.dice}/12
                      ${c.buff!==0?` • Buff: ${c.buff>0?"+":""}${c.buff}%`:""}
                      ${c.chainBonus?` • Cadeia: +${(c.chainBonus*100).toFixed(0)}%`:""}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold ${v?"text-emerald-400":c.dice<=3?"text-red-400":f?"text-yellow-400":"text-slate-400"}">
                      ${parseFloat(l)>=0?"+":""}${l}%
                    </div>
                    <div class="text-xs text-slate-500">
                      +${Y(c.preInflationGrowth*(parseFloat(t.PIBPerCapita)||0))}
                    </div>
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- Cadeias Produtivas -->
        ${e.productiveChains.length>0?`
          <div class="border border-slate-600/50 rounded-xl p-6">
            <h4 class="text-lg font-semibold text-slate-200 mb-4">🔗 Cadeias Produtivas Ativadas</h4>
            
            <div class="space-y-3">
              ${e.productiveChains.map(c=>`
                <div class="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div>
                    <div class="font-medium text-blue-200">${c.name}</div>
                    <div class="text-sm text-blue-300">${c.description}</div>
                  </div>
                  <div class="text-blue-400 font-semibold">+${(c.bonus*100).toFixed(0)}%</div>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}

      `}const o=Object.values(this.changes.technology).some(r=>r!==0);o&&(a+=`
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">🔬 Mudanças em Tecnologia</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.technology).filter(([r,n])=>n!==0).map(([r,n])=>{const i=parseFloat(t[r])||0,c=Math.max(0,i+n),l={Tecnologia:"Tecnologia Civil",Aeronautica:"Aeronáutica",Marinha:"Marinha",Veiculos:"Veículos",Exercito:"Exército"};return`
                  <div class="flex items-center justify-between p-3 rounded-lg ${n>0?"bg-emerald-900/20 border border-emerald-500/30":"bg-red-900/20 border border-red-500/30"}">
                    <div class="text-slate-200">${l[r]||r}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${i} → ${c}</div>
                      <div class="font-semibold ${n>0?"text-emerald-400":"text-red-400"}">${n>0?"+":""}${n}</div>
                    </div>
                  </div>
                `}).join("")}
          </div>
        </div>
      `);const s=Object.values(this.changes.indicators).some(r=>r!==0);return s&&(a+=`
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">📊 Mudanças em Indicadores</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.indicators).filter(([r,n])=>n!==0).map(([r,n])=>{const i=parseFloat(t[r])||0,c=Math.min(100,Math.max(0,i+n)),l={Estabilidade:"Estabilidade",Burocracia:"Burocracia",Urbanizacao:"Urbanização",IndustrialEfficiency:"Eficiência Industrial"};return`
                  <div class="flex items-center justify-between p-3 rounded-lg ${n>0?"bg-emerald-900/20 border border-emerald-500/30":"bg-red-900/20 border border-red-500/30"}">
                    <div class="text-slate-200">${l[r]||r}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${i}% → ${c}%</div>
                      <div class="font-semibold ${n>0?"text-emerald-400":"text-red-400"}">${n>0?"+":""}${n}%</div>
                    </div>
                  </div>
                `}).join("")}
          </div>
        </div>
      `),a+=`
      <div class="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6">
        <h4 class="text-lg font-semibold text-slate-200 mb-3">⚠️ Confirmação Final</h4>
        <div class="text-sm text-slate-300 space-y-2">
          <div>• Todas as mudanças serão aplicadas permanentemente ao país</div>
          ${e?"<div>• Ações econômicas serão registradas no histórico</div>":""}
          ${e?.actions.some(r=>r.isExternal)?"<div>• Ações externas afetarão os países de destino</div>":""}
          ${o?"<div>• Valores de tecnologia serão atualizados</div>":""}
          ${hasResourceChanges?"<div>• Recursos serão modificados</div>":""}
          ${s?"<div>• Indicadores nacionais serão alterados</div>":""}
        </div>
      </div>
    </div>
    `,a}switchEconomySubtab(e){const t=document.getElementById("economic-simulator-modal");t&&(t.querySelectorAll(".economy-subtab").forEach(a=>{a.dataset.subtab===e?(a.classList.remove("bg-slate-700","text-slate-300"),a.classList.add("bg-purple-600","text-white")):(a.classList.remove("bg-purple-600","text-white"),a.classList.add("bg-slate-700","text-slate-300"))}),t.querySelectorAll(".economy-subtab-content").forEach(a=>{a.classList.add("hidden")}),t.querySelector(`#economy-subtab-${e}`)?.classList.remove("hidden"))}adjustTechnology(e,t){this.changes.technology[e]=(this.changes.technology[e]||0)+t;const a=document.querySelector(`.tech-input[data-field="${e}"]`);a&&(a.value=this.changes.technology[e]),this.updateTechPreview(e),this.updateSummary()}updateTechPreview(e){const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=parseFloat(t[e])||0,o=this.changes.technology[e]||0,s=Math.max(0,a+o),r=document.querySelector(`.tech-preview[data-field="${e}"]`);r&&(r.textContent=s)}adjustIndicator(e,t){const a=this.getCountryById(this.selectedCountry);if(!a)return;const o=parseFloat(a[e])||0,r=(this.changes.indicators[e]||0)+t,n=o+r;if(n<0||n>100){g("warning",`${e} deve estar entre 0% e 100%`);return}this.changes.indicators[e]=r;const i=document.querySelector(`.indicator-input[data-field="${e}"]`);i&&(i.value=this.changes.indicators[e]),this.updateIndicatorPreview(e),this.updateSummary()}updateIndicatorPreview(e){const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=parseFloat(t[e])||0,o=this.changes.indicators[e]||0,s=Math.min(100,Math.max(0,a+o)),r=document.querySelector(`.indicator-preview[data-field="${e}"]`);r&&(r.textContent=`${s}%`);const n=r?.closest(".border")?.querySelector(".bg-gradient-to-r");n&&(n.style.width=`${s}%`)}resetActions(){this.actions.internal=[],this.actions.external=[],this.changes={technology:{},indicators:{}},this.recreateActionSlots("internal"),this.recreateActionSlots("external"),this.updateTabCounters(),this.updateBudgetBar(),this.updateSummary()}toggleActionDescription(e){const a=e.closest(".action-slot").querySelector(".action-description"),o=a.querySelector("div");if(e.value){const s=A.actionTypes[e.value];s&&(o.textContent=`${s.description}. Exemplos: ${s.examples.join(", ")}.`,a.classList.remove("hidden"))}else a.classList.add("hidden")}toggleResourceSelector(e){const t=e.closest(".action-slot"),a=t.querySelector(".resource-type-selector"),o=t.querySelector(".extraction-preview");e.value==="exploration"?(a?.classList.remove("hidden"),o?.classList.remove("hidden")):(a?.classList.add("hidden"),o?.classList.add("hidden"))}updateExtractionPreview(e,t){const a=e.querySelector(".extraction-amount");if(!a)return;if(!t.resourceType||!t.value||!t.dice){a.textContent="Aguardando dados...";return}const o=this.getCountryById(this.selectedCountry);if(!o)return;const r={Combustivel:"PotencialCombustivel",Carvao:"PotencialCarvao",Metais:"PotencialMetais"}[t.resourceType],n=parseFloat(o[r])||0,i=t.value/10*(t.dice/12)*(n/10),c=Math.round(i*100)/100,l={Combustivel:"Combustível",Carvao:"Carvão",Metais:"Metais"};a.innerHTML=`<strong>${c.toFixed(2)}</strong> unidades de ${l[t.resourceType]} (Potencial: ${n}/10)`}async applyEconomicActions(){const e=document.getElementById("economic-simulator-modal"),t=document.getElementById("apply-economic-actions");if(!(!e||!t))try{t.disabled=!0,t.textContent="⏳ Aplicando...";const a=this.getCountryById(this.selectedCountry);if(!a)throw new Error("País não encontrado");const o=[...this.actions.internal,...this.actions.external].filter(u=>u.type&&u.value>0),s=Object.values(this.changes.technology).some(u=>u!==0),r=Object.values(this.changes.indicators).some(u=>u!==0);if(!(o.length>0||s||r))throw new Error("Nenhuma mudança configurada");const i={};for(const u of o.filter(v=>v.isExternal))u.targetCountry&&(i[u.targetCountry]=this.getCountryById(u.targetCountry));const c=o.length>0?k.processAllActions(o,a,i):null;await this.saveEconomicResults(c,o,i);try{await Me.generatePlayerFeedback(this.selectedCountry,c,o),d.info("Feedback narrativo gerado para o player")}catch(u){d.warn("Erro ao gerar feedback narrativo:",u)}let l="Mudanças aplicadas com sucesso!";if(c)l=`Investimentos aplicados! PIB cresceu ${(c.finalGrowth*100).toFixed(2)}%`;else if(s||hasResourceChanges||r){const u=[];s&&u.push("tecnologia"),hasResourceChanges&&u.push("recursos"),r&&u.push("indicadores"),l=`Mudanças em ${u.join(", ")} aplicadas!`}g("success",l),e.remove(),window.carregarTudo&&await window.carregarTudo(),setTimeout(()=>{window.location.pathname.includes("narrador")&&window.location.reload()},1500)}catch(a){d.error("Erro ao aplicar ações econômicas:",a),g("error",`Erro: ${a.message}`)}finally{t&&(t.disabled=!1,t.textContent="⚡ Aplicar Investimentos")}}async saveEconomicResults(e,t,a){const o=p.batch(),s=parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1;try{const r=p.collection("paises").doc(this.selectedCountry),n=this.getCountryById(this.selectedCountry)||{},i={TurnoUltimaAtualizacao:s};e&&(i.PIB=e.newPIB,i.PIBPerCapita=e.newPIBPerCapita,i["geral.PIB"]=e.newPIB,i["geral.PIBPerCapita"]=e.newPIBPerCapita);for(const[b,w]of Object.entries(this.changes.technology))if(w!==0){const M=parseFloat(n[b])||0,S=Math.max(0,M+w);i[b]=S,i[`geral.${b}`]=S}for(const[b,w]of Object.entries(this.changes.indicators))if(w!==0){const M=parseFloat(n[b])||0,S=Math.min(100,Math.max(0,M+w));i[b]=S,i[`geral.${b}`]=S}const c=t.filter(b=>b.type==="exploration"&&b.resourceType&&b.value&&b.dice);for(const b of c){const M={Combustivel:"PotencialCombustivel",Carvao:"PotencialCarvao",Metais:"PotencialMetais"}[b.resourceType],S=parseFloat(n[M])||0,W=b.value/10*(b.dice/12)*(S/10),N=Math.round(W*100)/100,z={Combustivel:"CombustivelProducao",Carvao:"CarvaoProducao",Metais:"MetaisProducao"}[b.resourceType],ve=parseFloat(n[z])||0;i[z]=ve+N,d.log(`[Exploration] ${n.Pais}: Extraiu ${N} unidades de ${b.resourceType} (Potencial: ${S}/10, Dado: ${b.dice}/12)`)}let l=0,u=0,v=0,f=0;const x=n.PoliticaIndustrial||n.Politica||"combustivel";for(const b of t){if(b.type==="industry"){const w=k.computeIndustryResourceConsumption(b.value,n);x==="carvao"?u+=w:l+=w,v+=(parseFloat(b.value)||0)*.5}if(b.type==="exploration"){const w=parseFloat(b.value)||0,M=parseFloat(n.PotencialCarvao||n.Potencial||n.PotencialCarvao||0)||0,S=Math.min(M*.1,w*.1);f+=S}b.type==="research"&&(v+=(parseFloat(b.value)||0)*.2)}const h=parseFloat(n.IndustrialEfficiency)||50,C=t.filter(b=>b.type==="industry").length*.5,P=Math.min(100,h+C+(e.technologyChanges||0)*.2);i.IndustrialEfficiency=P;const q=parseFloat(n.EnergiaCapacidade)||parseFloat(n.EnergiaDisponivel)||0,V=k.computeEnergyPenalty(q,v);if(V<1){const b=(1-V)*100,w=e.newPIB*(1-V)*.1;e.newPIB=Math.max(e.newPIB-w,e.newPIB*.95),e.newPIBPerCapita=e.newPIB/(parseFloat(n.Populacao)||1),d.info(`Penalidade de energia aplicada: ${b.toFixed(1)}% déficit, -${w.toFixed(0)} PIB`)}i.EnergiaCapacidade=q;const H=parseFloat(n.Combustivel)||0,ue=parseFloat(n.CarvaoSaldo||n.Carvao||0),oe=Math.max(0,H-l),me=Math.max(0,ue-u+f);i.Combustivel=oe,i.CarvaoSaldo=me,f>0&&(Q.results.producedCarvao=f);const pe={Graos:n.Graos||0,Combustivel:oe,EnergiaDisponivel:q},G=k.computeConsumerGoodsIndex(n,pe);i.BensDeConsumo=G;const _=parseFloat(n.Estabilidade)||0;if(G>75?(i.Estabilidade=Math.min(100,_+3),i["geral.Estabilidade"]=Math.min(100,_+3)):G<25&&(i.Estabilidade=Math.max(0,_-3),i["geral.Estabilidade"]=Math.max(0,_-3)),e.technologyChanges>0){const b=parseFloat(this.getCountryById(this.selectedCountry).Tecnologia)||0,w=Math.min(100,b+e.technologyChanges);i.Tecnologia=w,i["geral.Tecnologia"]=w}if(e.stabilityChanges>0){const b=parseFloat(this.getCountryById(this.selectedCountry).Estabilidade)||0,w=Math.min(100,b+e.stabilityChanges);i.Estabilidade=w,i["geral.Estabilidade"]=w}o.update(r,i);for(const b of t.filter(w=>w.isExternal))if(b.targetCountry&&a[b.targetCountry]){const w=a[b.targetCountry],S=k.calculateBaseGrowth(b,w).preInflationGrowth*b.value/1e6*.5,W=p.collection("paises").doc(b.targetCountry),N=parseFloat(w.Populacao)||1,J=parseFloat(w.PIBPerCapita||0)+S/1e6,z=N*J;o.update(W,{PIB:z,PIBPerCapita:J,TurnoUltimaAtualizacao:s})}const he=p.collection("economic_history").doc(),Q={countryId:this.selectedCountry,turn:s,timestamp:new Date,totalInvestment:t.reduce((b,w)=>b+(parseFloat(w.value)||0),0),actions:t,results:{totalGrowth:e.totalGrowth,finalGrowth:e.finalGrowth,inflation:e.totalInflation,newPIB:e.newPIB,productiveChains:e.productiveChains},externalInvestments:{}};t.filter(b=>b.isExternal).forEach(b=>{b.targetCountry&&(Q.externalInvestments[b.targetCountry]=parseFloat(b.value)||0)}),o.set(he,Q);const ge=p.collection("change_history").doc();o.set(ge,{countryId:this.selectedCountry,section:"economia",field:"simulacao_economica",oldValue:{PIB:parseFloat(this.getCountryById(this.selectedCountry).PIB),PIBPerCapita:parseFloat(this.getCountryById(this.selectedCountry).PIBPerCapita)||0},newValue:{PIB:e.newPIB,PIBPerCapita:e.newPIBPerCapita},userName:B.currentUser?.displayName||"Narrador",reason:`Simulação econômica: ${t.length} ações aplicadas`,timestamp:new Date,turn:s}),await o.commit(),d.info("Simulação econômica aplicada com sucesso")}catch(r){throw d.error("Erro ao salvar resultados econômicos:",r),r}}async buildPowerPlant(e,t){try{const a=this.getCountryById(e);if(!a)return g("error","País não encontrado."),{success:!1,message:"País não encontrado."};const o=we[t];if(!o)return g("error","Tipo de usina inválido."),{success:!1,message:"Tipo de usina inválido."};if(a.PIB<o.cost)return g("error",`PIB insuficiente para construir ${o.name}. Necessário: ${this.formatCurrency(o.cost)}`),{success:!1,message:"PIB insuficiente."};if(a.Tecnologia<o.tech_requirement)return g("error",`Tecnologia insuficiente para construir ${o.name}. Necessário: ${o.tech_requirement}%`),{success:!1,message:"Tecnologia insuficiente."};if(o.type==="hydro"){if(!a.PotencialHidreletrico||a.PotencialHidreletrico<=0)return g("error",`País não possui potencial hidrelétrico para construir ${o.name}.`),{success:!1,message:"Potencial hidrelétrico insuficiente."};a.PotencialHidreletrico--}if(o.resource_input==="Uranio"){if(!a.Uranio||a.Uranio<=0)return g("error",`País não possui Urânio suficiente para construir ${o.name}.`),{success:!1,message:"Urânio insuficiente."};a.Uranio--}return await p.runTransaction(async s=>{const r=p.collection("paises").doc(e),i=(await s.get(r)).data(),c=i.PIB-o.cost,l=[...i.power_plants||[],{id:t,built_turn:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}],u={PIB:c,power_plants:l,...o.type==="hydro"&&{PotencialHidreletrico:a.PotencialHidreletrico},...o.resource_input==="Uranio"&&{Uranio:a.Uranio}};s.update(r,u)}),a.PIB-=o.cost,a.power_plants.push({id:t,built_turn:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}),g("success",`${o.name} construída com sucesso!`),d.info(`${o.name} construída para ${a.Pais}`,{countryId:e,plantTypeId:t}),{success:!0,message:`${o.name} construída.`}}catch(a){return d.error(`Erro ao construir usina ${t} para ${e}:`,a),g("error",`Erro ao construir usina: ${a.message}`),{success:!1,message:`Erro ao construir usina: ${a.message}`}}}}let X=null;async function De(){try{return X=new ke,await X.initialize(),X}catch(m){throw d.error("Erro ao inicializar simulador econômico:",m),m}}async function Fe(){try{if(!await L("Confirmar Migração de Dados","Esta ação irá verificar TODOS os países e adicionar os novos campos de economia (Carvão, Energia, etc.) com valores padrão. Execute esta operação APENAS UMA VEZ. Deseja continuar?","Sim, migrar agora","Cancelar")){g("info","Migração cancelada pelo usuário.");return}g("info","Iniciando migração... Isso pode levar um momento.");const e=await p.collection("paises").get(),t=p.batch();let a=0;e.forEach(o=>{const s=o.data(),r=o.ref,n={};s.PotencialCarvao===void 0&&(n.PotencialCarvao=3),s.CarvaoSaldo===void 0&&(n.CarvaoSaldo=0),s.PoliticaIndustrial===void 0&&(n.PoliticaIndustrial="combustivel"),s.Energia===void 0&&(n.Energia={capacidade:100,demanda:100}),s.IndustrialEfficiency===void 0&&(n.IndustrialEfficiency=30),s.BensDeConsumo===void 0&&(n.BensDeConsumo=50),s.PotencialHidreletrico===void 0&&(n.PotencialHidreletrico=2),s.Uranio===void 0&&(n.Uranio=0),s.EnergiaCapacidade===void 0&&(n.EnergiaCapacidade=100),s.power_plants===void 0&&(n.power_plants=[]),Object.keys(n).length>0&&(a++,t.update(r,n))}),a>0?(await t.commit(),g("success",`${a} países foram migrados com sucesso!`)):g("info","Nenhum país precisava de migração. Tudo já está atualizado.")}catch(m){console.error("Erro durante a migração:",m),g("error",`Erro na migração: ${m.message}`)}}function je(){const m=document.querySelectorAll(".tab-button"),e=document.querySelectorAll(".tab-panel");if(!m.length||!e.length)return;function t(o){m.forEach(n=>{n.classList.remove("border-brand-500","text-brand-300"),n.classList.add("border-transparent","text-slate-400"),n.setAttribute("aria-selected","false")}),e.forEach(n=>{n.classList.add("hidden")});const s=document.querySelector(`[data-tab="${o}"]`),r=document.getElementById(`panel-${o}`);s&&r&&(s.classList.remove("border-transparent","text-slate-400"),s.classList.add("border-brand-500","text-brand-300"),s.setAttribute("aria-selected","true"),r.classList.remove("hidden")),o==="players"?setTimeout(()=>{window.playerManager&&(window.playerManager.loadPlayers(),window.playerManager.loadCountries())},100):o==="gameplay"&&setTimeout(()=>{window.updateQuickStats&&window.updateQuickStats()},100)}m.forEach(o=>{o.addEventListener("click",()=>{const s=o.getAttribute("data-tab");t(s)})});const a=m[0]?.getAttribute("data-tab");a&&t(a),window.updateTabBadges=function(o){const s=document.getElementById("gameplay-badge"),r=document.getElementById("players-badge");s&&o?.vehiclesPending>0?(s.textContent=o.vehiclesPending,s.classList.remove("hidden")):s&&s.classList.add("hidden"),r&&o?.playersOnline>0?(r.textContent=o.playersOnline,r.classList.remove("hidden")):r&&r.classList.add("hidden")},window.switchTab=t}const R={geral:{label:"Geral",campos:[{key:"PIBPerCapita",label:"PIB per Capita",tipo:"moeda",min:0},{key:"PIB",label:"PIB Total",tipo:"calculado",dependeDe:["PIBPerCapita","Populacao"]},{key:"Populacao",label:"População",tipo:"inteiro",min:0},{key:"Estabilidade",label:"Estabilidade",tipo:"percent",min:0,max:100},{key:"Burocracia",label:"Burocracia",tipo:"percent",min:0,max:100},{key:"Urbanizacao",label:"Urbanização",tipo:"percent",min:0,max:100},{key:"Tecnologia",label:"Tecnologia",tipo:"percent",min:0,max:100},{key:"ModeloPolitico",label:"Modelo Político",tipo:"texto"},{key:"Visibilidade",label:"Visibilidade",tipo:"opcoes",opcoes:["Público","Privado"]}]},exercito:{label:"Exército",campos:[{key:"Infantaria",label:"Infantaria",tipo:"inteiro",min:0},{key:"Artilharia",label:"Artilharia",tipo:"inteiro",min:0}]},aeronautica:{label:"Aeronáutica",campos:[{key:"Caca",label:"Caça",tipo:"inteiro",min:0},{key:"CAS",label:"CAS",tipo:"inteiro",min:0},{key:"Bomber",label:"Bombardeiro",tipo:"inteiro",min:0}]},marinha:{label:"Marinha",campos:[{key:"Fragata",label:"Fragata",tipo:"inteiro",min:0},{key:"Destroyer",label:"Destroyer",tipo:"inteiro",min:0},{key:"Submarino",label:"Submarino",tipo:"inteiro",min:0},{key:"Transporte",label:"Transporte",tipo:"inteiro",min:0}]},inventario:{label:"Inventário de Veículos",campos:[{key:"cavalos",label:"Cavalos",tipo:"inteiro",min:0},{key:"tanquesLeves",label:"Tanques Leves",tipo:"inteiro",min:0},{key:"mbt",label:"MBT",tipo:"inteiro",min:0},{key:"tanquesPesados",label:"Tanques Pesados",tipo:"inteiro",min:0},{key:"caminhoes",label:"Caminhões de Transporte",tipo:"inteiro",min:0},{key:"spg",label:"SPG",tipo:"inteiro",min:0},{key:"sph",label:"SPH",tipo:"inteiro",min:0},{key:"spaa",label:"SPAA",tipo:"inteiro",min:0},{key:"apc",label:"APC",tipo:"inteiro",min:0},{key:"cacaTanques",label:"Caça-Tanques",tipo:"inteiro",min:0},{key:"veiculosEng",label:"Veículos de Engenharia",tipo:"inteiro",min:0},{key:"ifv",label:"IFV",tipo:"inteiro",min:0}]},recursos:{label:"Recursos",campos:[{key:"Graos",label:"Graos (estoque)",tipo:"inteiro",min:0},{key:"Combustivel",label:"Combustível (unidades)",tipo:"inteiro",min:0},{key:"CombustivelSaldo",label:"Saldo de Combustível",tipo:"inteiro"},{key:"Metais",label:"Metais",tipo:"inteiro"},{key:"PotencialCarvao",label:"Potencial de Carvão (Jazidas)",tipo:"inteiro",min:0}]},ocupacao:{label:"Ocupação",campos:[{key:"PopOcupada",label:"População Ocupada",tipo:"inteiro",min:0},{key:"PIBOcupado",label:"PIB Ocupado",tipo:"moeda",min:0}]},arsenal:{label:"Arsenal Especial",campos:[{key:"Nuclear",label:"Bomba Nuclear",tipo:"inteiro",min:0}]}};let $=null,E={paises:[],paisSelecionado:null,secaoSelecionada:"geral",realTimeEnabled:!0,autoSave:!0,listeners:new Map,pendingChanges:new Set};const y={gate:document.getElementById("gate"),adminRoot:document.getElementById("admin-root"),turnoAtual:document.getElementById("turno-atual-admin"),menuSecoes:document.getElementById("menu-secoes"),selectPais:document.getElementById("select-pais"),selectSecao:document.getElementById("select-secao"),formSecao:document.getElementById("form-secao"),listaCampos:document.getElementById("lista-campos-secao"),btnSalvarSecao:document.getElementById("btn-salvar-secao"),btnRecarregar:document.getElementById("btn-recarregar"),btnSalvarTurno:document.getElementById("btn-salvar-turno"),turnoInput:document.getElementById("turno-input"),btnSalvarCatalogo:document.getElementById("btn-salvar-catalogo"),btnCarregarCatalogo:document.getElementById("btn-carregar-catalogo"),btnAdicionarCampo:document.getElementById("btn-adicionar-campo"),logout:document.getElementById("logout-link"),realTimeToggle:document.getElementById("realtime-toggle"),autoSaveToggle:document.getElementById("autosave-toggle"),historyList:document.getElementById("history-list"),historyRefresh:document.getElementById("history-refresh"),exportHistory:document.getElementById("export-history"),playersList:document.getElementById("players-list"),availableCountries:document.getElementById("available-countries"),playerCount:document.getElementById("player-count"),availableCount:document.getElementById("available-count"),refreshPlayers:document.getElementById("refresh-players"),assignRandom:document.getElementById("assign-random"),clearAllAssignments:document.getElementById("clear-all-assignments")};async function qe(){try{const m=await p.collection("configuracoes").doc("campos").get(),e=m.exists?m.data():{};$=Object.assign({},R,e),Object.keys(R).forEach(t=>{$[t]?(!$[t].campos||$[t].campos.length===0)&&($[t].campos=R[t].campos):$[t]=R[t]})}catch(m){console.warn("Falha ao carregar catálogo, usando local.",m),$=R}}function ae(){!y.menuSecoes||!$||(y.menuSecoes.innerHTML="",Object.keys($).forEach(m=>{const e=$[m],t=document.createElement("button");t.type="button",t.className=`w-full text-left rounded-md px-2 py-1.5 text-sm ${E.secaoSelecionada===m?"bg-white/5 border border-slate-600/40":"border border-transparent hover:bg-white/5"}`,t.textContent=e.label||m,t.onclick=()=>{E.secaoSelecionada=m,ae(),U()},y.menuSecoes.appendChild(t)}),y.selectSecao&&(y.selectSecao.innerHTML=Object.keys($).map(m=>`<option value="${m}" ${m===E.secaoSelecionada?"selected":""}>${$[m].label||m}</option>`).join("")))}function Ve(){y.selectPais&&(y.selectPais.innerHTML="",E.paises.forEach(m=>{const e=document.createElement("option");e.value=m.id,e.textContent=m.Pais||m.id,y.selectPais.appendChild(e)}),!E.paisSelecionado&&E.paises.length&&(E.paisSelecionado=E.paises[0].id),E.paisSelecionado&&(y.selectPais.value=E.paisSelecionado))}function Re(m,e,t,a=null){const o=document.createElement("div"),s=document.createElement("label");s.className="block text-xs text-slate-400 mb-1",s.textContent=e.label||m;let r;if(e.tipo==="calculado"){if(r=document.createElement("div"),r.className="mt-1 w-full rounded-lg bg-slate-700/50 border border-slate-600 p-2 text-sm text-slate-300 italic",m==="PIB"&&a){const n=parseFloat(a.Populacao)||0,i=parseFloat(a.PIBPerCapita)||0,c=ce(n,i);r.textContent=`${ie(c)} (calculado)`,r.dataset.calculatedValue=c}else r.textContent="Campo calculado";r.name=m}else e.tipo==="opcoes"&&Array.isArray(e.opcoes)?(r=document.createElement("select"),e.opcoes.forEach(n=>{const i=document.createElement("option");i.value=n,i.textContent=n,t===n&&(i.selected=!0),r.appendChild(i)}),r.name=m,r.className="mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors"):(r=document.createElement("input"),e.tipo==="percent"||e.tipo==="inteiro"||e.tipo==="moeda"?r.type="number":r.type="text",r.value=t??"",e.min!=null&&(r.min=String(e.min)),e.max!=null&&(r.max=String(e.max)),e.tipo==="moeda"?r.step="0.01":e.tipo==="percent"?r.step="0.1":e.tipo==="inteiro"&&(r.step="1"),r.name=m,r.className="mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors");return o.appendChild(s),o.appendChild(r),{wrap:o,input:r,get:()=>e.tipo==="calculado"?Number(r.dataset.calculatedValue||0):e.tipo==="inteiro"||e.tipo==="percent"||e.tipo==="moeda"?Number(r.value||0):r.value??""}}function U(){if(!$||!y.formSecao)return;const m=E.paises.find(o=>o.id===E.paisSelecionado),e=$[E.secaoSelecionada],t=m&&m[E.secaoSelecionada]||{};y.formSecao.innerHTML="",y.listaCampos&&(y.listaCampos.innerHTML="");const a={};(e.campos||[]).forEach(o=>{const s=Re(o.key,o,t[o.key]??m?.[o.key],m);y.formSecao.appendChild(s.wrap),a[o.key]=s.get}),y.btnSalvarSecao&&(y.btnSalvarSecao.onclick=async()=>{if(m)try{y.btnSalvarSecao.disabled=!0,y.btnSalvarSecao.textContent="Salvando...";const o={};Object.keys(a).forEach(r=>o[r]=a[r]()),E.secaoSelecionada==="geral"&&o.PIBPerCapita&&o.Populacao&&(o.PIB=ce(o.Populacao,o.PIBPerCapita));const s={[`${E.secaoSelecionada}`]:o};E.secaoSelecionada==="geral"&&Object.assign(s,o),await p.collection("paises").doc(m.id).update(s),g("success","Seção salva com sucesso")}catch(o){d.error("Erro ao salvar seção:",o),g("error",`Erro ao salvar: ${o.message}`)}finally{y.btnSalvarSecao.disabled=!1,y.btnSalvarSecao.textContent="Salvar Seção"}})}async function Oe(m){if(!m){window.location.href="index.html";return}try{const e=await ye(m.uid);if(!e.isNarrator&&!e.isAdmin){y.gate&&y.gate.classList.remove("hidden"),y.adminRoot?.classList.add("hidden");return}y.gate&&y.gate.classList.add("hidden"),y.adminRoot?.classList.remove("hidden"),await qe(),await T()}catch(e){console.error("Erro no gatekeeper",e),y.gate&&y.gate.classList.remove("hidden"),y.adminRoot?.classList.add("hidden")}}async function T(){const m=await ne();m&&m.turnoAtual&&y.turnoAtual&&(y.turnoAtual.textContent=`#${m.turnoAtual}`),m&&m.turnoAtual&&y.turnoInput&&(y.turnoInput.value=m.turnoAtual),E.paises=await re(),E.paises.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),Ve(),ae(),U()}B.onAuthStateChanged(Oe);y.selectPais&&y.selectPais.addEventListener("change",async m=>{E.paisSelecionado=m.target.value,U();try{await activateEnergyForSelectedCountry()}catch(e){d.warn("Erro ao ativar EnergyManager após mudança de país:",e)}});y.selectSecao&&y.selectSecao.addEventListener("change",m=>{E.secaoSelecionada=m.target.value,ae(),U()});y.btnRecarregar&&y.btnRecarregar.addEventListener("click",T);y.btnSalvarTurno&&y.btnSalvarTurno.addEventListener("click",async()=>{const m=Number(y.turnoInput?.value||"");if(Number.isNaN(m)||m<0){alert("Informe um número de turno válido.");return}await be(m),alert(`Turno atualizado para #${m}`),await T()});y.logout&&y.logout.addEventListener("click",m=>{m.preventDefault(),B.signOut()});document.addEventListener("DOMContentLoaded",()=>{je();const m=document.getElementById("btn-open-rules-editor"),e=document.getElementById("rules-editor-panel");m&&e&&m.addEventListener("click",()=>{e.classList.toggle("hidden")});const t=document.getElementById("btn-run-migration");t&&t.addEventListener("click",()=>{Fe()});const a=document.getElementById("btn-process-energy");a&&a.addEventListener("click",async()=>{try{a.disabled=!0,a.textContent="⏳ Processando...";const{processEnergySystemTurn:h}=await I(async()=>{const{processEnergySystemTurn:C}=await import("./energyPenaltyProcessor-DXz3MIMO.js");return{processEnergySystemTurn:C}},__vite__mapDeps([2,0,1,3]));await h(),alert("Turno de energia processado com sucesso!"),await T()}catch(h){console.error("Erro ao processar energia:",h),alert("Erro ao processar energia: "+h.message)}finally{a.disabled=!1,a.textContent="⚡ Processar Turno de Energia"}});const o=document.getElementById("btn-assign-resources");o&&o.addEventListener("click",async()=>{try{o.disabled=!0,o.textContent="⏳ Processando...";const{assignResourcePotentials:h}=await I(async()=>{const{assignResourcePotentials:C}=await import("./assign-resource-potentials-_fSq7czn.js");return{assignResourcePotentials:C}},__vite__mapDeps([4,0,1]));await h(),await T()}catch(h){console.error("Erro ao atribuir recursos:",h),alert("Erro ao atribuir recursos: "+h.message)}finally{o.disabled=!1,o.textContent="🌍 Atribuir Potenciais de Recursos"}});const s=document.getElementById("btn-resource-report");s&&s.addEventListener("click",async()=>{try{const{generateResourceReport:h}=await I(async()=>{const{generateResourceReport:C}=await import("./assign-resource-potentials-_fSq7czn.js");return{generateResourceReport:C}},__vite__mapDeps([4,0,1]));h(),alert("Relatório de recursos gerado no console (F12)")}catch(h){console.error("Erro ao gerar relatório:",h),alert("Erro ao gerar relatório: "+h.message)}});const r=document.getElementById("btn-apply-consumption");r&&r.addEventListener("click",async()=>{try{r.disabled=!0,r.textContent="⏳ Calculando...";const{applyResourceConsumption:h}=await I(async()=>{const{applyResourceConsumption:C}=await import("./apply-resource-consumption-Da8rkBTR.js");return{applyResourceConsumption:C}},__vite__mapDeps([5,0,1,6]));await h(),await T()}catch(h){console.error("Erro ao calcular consumo:",h),alert("Erro ao calcular consumo: "+h.message)}finally{r.disabled=!1,r.textContent="🍽️ Calcular Consumo de Recursos"}});const n=document.getElementById("btn-apply-consumption-all");n&&n.addEventListener("click",async()=>{try{if(!await L("Aplicar Consumo a Todos os Países","Esta ação irá calcular e definir o consumo mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, etc.). Esta operação pode ser executada múltiplas vezes. Continuar?","Sim, aplicar","Cancelar")){g("info","Operação cancelada pelo usuário.");return}n.disabled=!0,n.textContent="⏳ Aplicando a todos os países...";const{applyResourceConsumption:C}=await I(async()=>{const{applyResourceConsumption:P}=await import("./apply-resource-consumption-Da8rkBTR.js");return{applyResourceConsumption:P}},__vite__mapDeps([5,0,1,6]));await C(),g("success","🎉 Consumo aplicado a todos os países! Recarregue o dashboard para ver os novos valores."),await T()}catch(h){console.error("Erro ao aplicar consumo:",h),g("error","Erro ao aplicar consumo: "+h.message)}finally{n.disabled=!1,n.textContent="🚀 APLICAR CONSUMO A TODOS OS PAÍSES"}});const i=document.getElementById("btn-apply-production-all");i&&i.addEventListener("click",async()=>{try{if(!await L("Aplicar Produção a Todos os Países","Esta ação irá calcular e definir a produção mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, geografia, clima). Esta operação pode ser executada múltiplas vezes. Continuar?","Sim, aplicar","Cancelar")){g("info","Operação cancelada pelo usuário.");return}i.disabled=!0,i.textContent="⏳ Aplicando produção a todos os países...";const{applyResourceProduction:C}=await I(async()=>{const{applyResourceProduction:P}=await import("./apply-resource-production-ClO-bSCB.js");return{applyResourceProduction:P}},__vite__mapDeps([7,0,1,8]));await C(),g("success","🎉 Produção aplicada a todos os países! Recarregue o dashboard para ver os novos valores."),await T()}catch(h){console.error("Erro ao aplicar produção:",h),g("error","Erro ao aplicar produção: "+h.message)}finally{i.disabled=!1,i.textContent="🏭 APLICAR PRODUÇÃO A TODOS OS PAÍSES"}});const c=document.getElementById("btn-simulate-production");c&&c.addEventListener("click",async()=>{try{c.disabled=!0,c.textContent="⏳ Simulando...";const{simulateProductionTurns:h}=await I(async()=>{const{simulateProductionTurns:C}=await import("./apply-resource-production-ClO-bSCB.js");return{simulateProductionTurns:C}},__vite__mapDeps([7,0,1,8]));await h(6),await T()}catch(h){console.error("Erro ao simular produção:",h),g("error","Erro na simulação: "+h.message)}finally{c.disabled=!1,c.textContent="📊 Simular Produção 6 Turnos"}});const l=document.getElementById("btn-apply-consumer-goods");l&&l.addEventListener("click",async()=>{try{if(!await L("Aplicar Bens de Consumo e Estabilidade","Esta ação irá calcular os bens de consumo para TODOS os países e aplicar os efeitos de estabilidade (+3% até -5%). Esta operação deve ser executada a cada turno. Continuar?","Sim, aplicar","Cancelar")){g("info","Operação cancelada pelo usuário.");return}l.disabled=!0,l.textContent="⏳ Aplicando bens de consumo...";const{applyConsumerGoodsEffects:C}=await I(async()=>{const{applyConsumerGoodsEffects:P}=await import("./apply-consumer-goods-Wm1JbdVZ.js");return{applyConsumerGoodsEffects:P}},__vite__mapDeps([9,0,1,10]));await C(),g("success","🎉 Bens de consumo e efeitos de estabilidade aplicados! Recarregue o dashboard."),await T()}catch(h){console.error("Erro ao aplicar bens de consumo:",h),g("error","Erro ao aplicar bens de consumo: "+h.message)}finally{l.disabled=!1,l.textContent="🛍️ APLICAR BENS DE CONSUMO E ESTABILIDADE"}});const u=document.getElementById("btn-simulate-consumer-goods");u&&u.addEventListener("click",async()=>{try{u.disabled=!0,u.textContent="⏳ Simulando...";const{simulateConsumerGoodsOverTime:h}=await I(async()=>{const{simulateConsumerGoodsOverTime:C}=await import("./apply-consumer-goods-Wm1JbdVZ.js");return{simulateConsumerGoodsOverTime:C}},__vite__mapDeps([9,0,1,10]));await h(5),await T()}catch(h){console.error("Erro ao simular bens de consumo:",h),g("error","Erro na simulação: "+h.message)}finally{u.disabled=!1,u.textContent="📈 Simular Estabilidade 5 Turnos"}});const v=document.getElementById("btn-test-turn-processing");v&&v.addEventListener("click",async()=>{try{v.disabled=!0,v.textContent="⏳ Testando...";const{default:h}=await I(async()=>{const{default:P}=await import("./turnProcessor-DbjJNSva.js");return{default:P}},__vite__mapDeps([11,1,0,10,12,13])),C=await h.testTurnProcessing();g("success",`Teste concluído: ${C.length} países analisados. Veja o console (F12) para detalhes.`)}catch(h){console.error("Erro no teste:",h),g("error","Erro no teste: "+h.message)}finally{v.disabled=!1,v.textContent="🧪 Testar Processamento de Turno"}});const f=document.getElementById("btn-reprocess-turn");f&&f.addEventListener("click",async()=>{try{if(!await L("Reprocessar Turno Atual","Esta ação irá forçar o reprocessamento do turno atual, aplicando novamente todos os efeitos de bens de consumo e estabilidade. Use apenas se necessário. Continuar?","Sim, reprocessar","Cancelar")){g("info","Operação cancelada.");return}f.disabled=!0,f.textContent="⏳ Reprocessando...";const P=(await ne()).turnoAtual||1,{default:q}=await I(async()=>{const{default:H}=await import("./turnProcessor-DbjJNSva.js");return{default:H}},__vite__mapDeps([11,1,0,10,12,13])),V=await q.reprocessTurn(P);g("success",`Turno ${P} reprocessado: ${V.processedCount} países atualizados!`),await T()}catch(h){console.error("Erro no reprocessamento:",h),g("error","Erro no reprocessamento: "+h.message)}finally{f.disabled=!1,f.textContent="🔄 Reprocessar Turno Atual"}});const x=document.getElementById("btn-simulate-consumption");x&&x.addEventListener("click",async()=>{try{x.disabled=!0,x.textContent="⏳ Simulando...";const{simulateConsumptionTurns:h}=await I(async()=>{const{simulateConsumptionTurns:C}=await import("./apply-resource-consumption-Da8rkBTR.js");return{simulateConsumptionTurns:C}},__vite__mapDeps([5,0,1,6]));await h(3),alert("Simulação concluída! Veja os resultados no console (F12)")}catch(h){console.error("Erro na simulação:",h),alert("Erro na simulação: "+h.message)}finally{x.disabled=!1,x.textContent="🔮 Simular 3 Turnos"}})});let K=null,ee=null,te=null,de=null;async function _e(){try{K=new Pe,await K.initialize(),d.info("Sistema de aprovação de veículos inicializado")}catch(m){d.error("Erro ao inicializar sistema de aprovação de veículos:",m)}}async function Ne(){try{ee=new fe,await ee.initialize(),d.info("Sistema de produção naval inicializado")}catch(m){d.error("Erro ao inicializar sistema de produção naval:",m)}}async function ze(){try{te=new Ce,await te.initialize(),d.info("Sistema de inventário inicializado")}catch(m){d.error("Erro ao inicializar sistema de inventário:",m)}}async function Ue(){try{await new Ae().initialize(),d.info("Gerenciador de equipamentos genéricos inicializado")}catch(m){d.error("Erro ao inicializar gerenciador de equipamentos genéricos:",m)}}async function He(){try{de=await De(),d.info("Sistema econômico inicializado")}catch(m){d.error("Erro ao inicializar sistema econômico:",m)}}async function Ge(){try{j&&typeof j.loadPlayers=="function"?(await j.loadPlayers(),await j.loadCountries(),j.setupRealTimeListeners?.(),d.info("Player management inicializado")):d.warn("playerManager não disponível para inicialização")}catch(m){d.error("Erro ao inicializar player management:",m)}}async function se(){try{console.log("🔧 Inicializando sistemas do narrador..."),await Promise.all([Ge(),_e(),Ne(),ze(),Ue(),He()]),window.playerManager=j,window.vehicleApprovalSystem=K,window.navalProductionSystem=ee,window.inventorySystem=te,window.economicSimulator=de,window.narratorData={getCatalog:()=>$,getCountries:()=>E.paises},console.log("✅ Todos os sistemas do narrador inicializados")}catch(m){console.error("❌ Erro ao inicializar sistemas do narrador:",m)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",se):se();
