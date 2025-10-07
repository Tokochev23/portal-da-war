const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-EZ41UaXc.js","assets/preload-helper-DnKmFyg5.js","assets/energyPenaltyProcessor-DKniJfDm.js","assets/economicCalculations-BH-mOTpL.js","assets/assign-resource-potentials-Dx5WwkOR.js","assets/apply-resource-consumption-BWw60Pmr.js","assets/resourceConsumptionCalculator-CzdzSVq9.js","assets/apply-resource-production-Cz5xKYgG.js","assets/resourceProductionCalculator-DOyDWSO6.js","assets/apply-consumer-goods-D4ehV5s8.js","assets/consumerGoodsCalculator-LctIpTpp.js","assets/turnProcessor-yiatDfKv.js","assets/turnEventsSystem-dd9fLrpO.js","assets/espionageOperationsSystem-DixIzDm0.js"])))=>i.map(i=>d[i]);
import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{_ as $}from"./preload-helper-DnKmFyg5.js";import{h as p,a as k,L as d,b as h,n as T,g as re,u as fe,e as ce,d as xe}from"./firebase-EZ41UaXc.js";import{NavalProductionSystem as we}from"./navalProduction-Bku_9HL-.js";import{f as se,c as O,a as Ce,E as M,b as K,P as Ee}from"./economicCalculations-BH-mOTpL.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"./shipyardSystem-DLUW0CQi.js";class Pe{constructor(){this.inventories=new Map,this.categories=[{id:"MBT",name:"Main Battle Tank",icon:"🛡️",type:"vehicle"},{id:"Medium Tank",name:"Tanque Médio",icon:"⚙️",type:"vehicle"},{id:"Light Tank",name:"Tanque Leve",icon:"🏃",type:"vehicle"},{id:"IFV",name:"Infantry Fighting Vehicle",icon:"👥",type:"vehicle"},{id:"APC",name:"Armored Personnel Carrier",icon:"🚐",type:"vehicle"},{id:"SPG",name:"Self-Propelled Gun",icon:"💥",type:"vehicle"},{id:"SPH",name:"Self-Propelled Howitzer",icon:"🎯",type:"vehicle"},{id:"SPAA",name:"Self-Propelled Anti-Aircraft",icon:"🎪",type:"vehicle"},{id:"Other",name:"Outros Veículos",icon:"🔧",type:"vehicle"},{id:"Couraçados",name:"Couraçados",icon:"⚓",type:"naval"},{id:"Cruzadores",name:"Cruzadores",icon:"🚢",type:"naval"},{id:"Destróieres",name:"Destróieres",icon:"🛥️",type:"naval"},{id:"Fragatas",name:"Fragatas",icon:"🚤",type:"naval"},{id:"Corvetas",name:"Corvetas",icon:"⛵",type:"naval"},{id:"Submarinos",name:"Submarinos",icon:"🤿",type:"naval"},{id:"Porta-aviões",name:"Porta-aviões",icon:"🛩️",type:"naval"},{id:"Patrulhas",name:"Patrulhas",icon:"🚨",type:"naval"},{id:"Auxiliares",name:"Auxiliares",icon:"🔧",type:"naval"},{id:"Naval - Outros",name:"Outros Navios",icon:"🌊",type:"naval"}],this.selectedCountry=null,this.typeFilter="all",this.componentNames={gasoline_v8_medium:"Motor V8 a Gasolina Médio",diesel_v12_heavy:"Motor V12 Diesel Pesado",gasoline_inline6_light:"Motor I6 a Gasolina Leve",diesel_v8_medium:"Motor V8 Diesel Médio",gasoline_v12_heavy:"Motor V12 a Gasolina Pesado",mbt_medium:"Chassi MBT Médio",light_tank:"Chassi Tanque Leve",heavy_tank:"Chassi Tanque Pesado",spg_chassis:"Chassi SPG",apc_chassis:"Chassi APC",ifv_chassis:"Chassi IFV",standard:"Padrão",advanced:"Avançado",basic:"Básico"}}async initialize(){console.log("📦 Inicializando sistema de inventário..."),this.render(),setInterval(()=>this.refreshCurrentInventory(),6e4)}render(){const e=document.getElementById("inventory-system-anchor");if(!e){console.warn("⚠️ Âncora inventory-system-anchor não encontrada");return}const t=document.getElementById("inventory-system-section");t&&t.remove();const a=document.createElement("div");a.id="inventory-system-section",a.innerHTML=this.getHTML(),e.parentNode.insertBefore(a,e.nextSibling),this.setupEventListeners()}setupEventListeners(){document.addEventListener("click",t=>{if(t.target.matches("[data-load-inventory]")){const a=t.target.dataset.loadInventory;this.loadCountryInventory(a)}if(t.target.id==="refresh-inventory"&&this.refreshCurrentInventory(),t.target.id==="export-inventory"&&this.exportInventory(),t.target.matches("[data-edit-quantity]")){const a=t.target.dataset.editQuantity,o=t.target.dataset.category;this.editVehicleQuantity(o,a)}if(t.target.matches("[data-remove-vehicle]")){const a=t.target.dataset.removeVehicle,o=t.target.dataset.category;this.removeVehicle(o,a)}if(t.target.matches("[data-view-category]")||t.target.closest("[data-view-category]")){const o=(t.target.matches("[data-view-category]")?t.target:t.target.closest("[data-view-category]")).dataset.viewCategory;this.showCategoryModal(o)}if(t.target.matches("[data-view-vehicle-sheet]")){const a=t.target.dataset.viewVehicleSheet,o=t.target.dataset.category;this.showVehicleSheet(o,a)}t.target.matches("[data-filter-type]")&&(this.typeFilter=t.target.dataset.filterType,this.renderInventoryContent())});const e=document.getElementById("inventory-country-select");e&&e.addEventListener("change",t=>{t.target.value?this.loadCountryInventory(t.target.value):(this.selectedCountry=null,this.renderInventoryContent())})}getHTML(){return`
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
        `}async loadCountryInventory(e){try{console.log(`📦 Carregando inventário para ${e}...`),this.selectedCountry=e;const t=await p.collection("inventory").doc(e).get();let a={};t.exists&&(a=t.data()),this.inventories.set(e,a);const o=await p.collection("paises").doc(e).get(),r=o.exists?o.data().Pais:e;this.renderInventoryContent(a,r),console.log(`✅ Inventário de ${r} carregado`)}catch(t){console.error("❌ Erro ao carregar inventário:",t),this.renderInventoryError("Erro ao carregar inventário: "+t.message)}}async refreshCurrentInventory(){this.selectedCountry&&await this.loadCountryInventory(this.selectedCountry)}renderInventoryContent(e={},t=null){const a=document.getElementById("inventory-content");if(!a)return;if(!this.selectedCountry){a.innerHTML=`
                <div class="text-center py-8 text-slate-400">
                    <div class="text-2xl mb-2">📦</div>
                    <div class="text-sm">Selecione um país para visualizar o inventário</div>
                </div>
            `;return}const o=this.calculateTotalVehicles(e),r=this.calculateTotalValue(e),s=this.getFilteredCategories();a.innerHTML=`
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-emerald-200">
                        🏠 ${t||this.selectedCountry}
                    </h3>
                    <div class="text-sm text-slate-400">
                        <span class="font-semibold text-emerald-300">${o}</span> unidades • 
                        <span class="font-semibold text-emerald-300">$${r.toLocaleString()}</span> valor total
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
                ${s.map(n=>this.renderCategoryCard(n,e[n.id]||{})).join("")}
            </div>
        `,this.loadCountryOptions()}getFilteredCategories(){return this.typeFilter==="all"?this.categories:this.categories.filter(e=>e.type===this.typeFilter)}renderCategoryCard(e,t){const a=Object.keys(t).length,o=Object.values(t).reduce((s,n)=>s+(n.quantity||0),0),r=Object.values(t).reduce((s,n)=>s+(n.cost||0)*(n.quantity||0),0);return`
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
                        <div class="text-xs text-slate-400">$${r.toLocaleString()}</div>
                        <div class="text-xs text-emerald-300 mt-1">👁️ Ver Detalhes</div>
                    </div>
                </div>
                
                <!-- Quick preview of vehicles -->
                <div class="space-y-1 max-h-20 overflow-hidden">
                    ${Object.keys(t).length===0?`
                        <div class="text-center text-slate-500 text-xs py-2">
                            Nenhum veículo nesta categoria
                        </div>
                    `:Object.entries(t).slice(0,2).map(([s,n])=>`
                        <div class="text-xs text-slate-400 flex justify-between">
                            <span>• ${s}</span>
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
        `)}calculateTotalVehicles(e){let t=0;for(const a of Object.values(e))for(const o of Object.values(a))t+=o.quantity||0;return t}calculateTotalValue(e){let t=0;for(const a of Object.values(e))for(const o of Object.values(a))t+=(o.cost||0)*(o.quantity||0);return t}async loadCountryOptions(){try{const e=document.getElementById("inventory-country-select");if(!e||e.children.length>1)return;const a=(await p.collection("paises").get()).docs.map(r=>({id:r.id,name:r.data().Pais||r.id})).sort((r,s)=>r.name.localeCompare(s.name)),o=e.value;e.innerHTML='<option value="">Selecione um país...</option>',a.forEach(r=>{const s=document.createElement("option");s.value=r.id,s.textContent=r.name,r.id===o&&(s.selected=!0),e.appendChild(s)})}catch(e){console.error("❌ Erro ao carregar países:",e)}}async editVehicleQuantity(e,t){try{const a=this.inventories.get(this.selectedCountry)||{},o=a[e]?.[t];if(!o){alert("Veículo não encontrado");return}const r=prompt(`Alterar quantidade de "${t}":
Quantidade atual: ${o.quantity||0}`,o.quantity||0);if(r===null)return;const s=parseInt(r);if(isNaN(s)||s<0){alert("Quantidade inválida");return}a[e]||(a[e]={}),a[e][t].quantity=s,await p.collection("inventory").doc(this.selectedCountry).set(a,{merge:!0}),this.renderInventoryContent(a,this.selectedCountry),console.log(`✅ Quantidade de "${t}" atualizada para ${s}`)}catch(a){console.error("❌ Erro ao editar quantidade:",a),alert("Erro ao atualizar quantidade: "+a.message)}}async removeVehicle(e,t){try{if(!confirm(`Remover "${t}" do inventário?`))return;const a=this.inventories.get(this.selectedCountry)||{};a[e]&&a[e][t]&&(delete a[e][t],Object.keys(a[e]).length===0&&delete a[e],await p.collection("inventory").doc(this.selectedCountry).set(a,{merge:!0}),this.renderInventoryContent(a,this.selectedCountry),console.log(`✅ "${t}" removido do inventário`))}catch(a){console.error("❌ Erro ao remover veículo:",a),alert("Erro ao remover veículo: "+a.message)}}async exportInventory(){if(!this.selectedCountry){alert("Selecione um país primeiro");return}try{const e=this.inventories.get(this.selectedCountry)||{},t=JSON.stringify(e,null,2),a=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(a),r=document.createElement("a");r.href=o,r.download=`inventario_${this.selectedCountry}_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(o),console.log("✅ Inventário exportado")}catch(e){console.error("❌ Erro ao exportar inventário:",e),alert("Erro ao exportar: "+e.message)}}showCategoryModal(e){if(!this.selectedCountry){alert("Selecione um país primeiro");return}const a=(this.inventories.get(this.selectedCountry)||{})[e]||{},o=this.categories.find(c=>c.id===e);if(!o){alert("Categoria não encontrada");return}const r=document.getElementById("category-inventory-modal");r&&r.remove();const s=document.createElement("div");s.id="category-inventory-modal",s.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",s.style.zIndex="9999";const n=Object.keys(a).length,i=Object.values(a).reduce((c,m)=>c+(m.quantity||0),0),l=Object.values(a).reduce((c,m)=>c+(m.cost||0)*(m.quantity||0),0);s.innerHTML=`
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
                        <div class="text-lg font-semibold text-emerald-300">$${l.toLocaleString()}</div>
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
                            ${Object.entries(a).map(([c,m])=>this.renderVehicleCard(c,m,e)).join("")}
                        </div>
                    `}
                </div>
            </div>
        `,s.addEventListener("click",c=>{c.target===s&&s.remove()}),document.addEventListener("keydown",function c(m){m.key==="Escape"&&(s.remove(),document.removeEventListener("keydown",c))}),document.body.appendChild(s)}renderVehicleCard(e,t,a){const o=(t.cost||0)*(t.quantity||0),r=t.sheetImageUrl||t.sheetHtmlUrl||t.specs,s=t.specs||{},n=t.maintenanceCost||t.costs?.maintenance||0,i=n*(t.quantity||0);return`
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
                        ${s?`
                            <div class="bg-slate-800/30 rounded-lg p-3 mt-3">
                                <h5 class="text-xs font-semibold text-slate-300 mb-2 flex items-center">
                                    ⚙️ Especificações Técnicas
                                </h5>
                                <div class="grid grid-cols-1 gap-2 text-xs">
                                    ${s.engine?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🔧 Motor:</span>
                                            <span class="text-blue-300 font-medium">${this.getReadableComponentName(s.engine)}</span>
                                        </div>
                                    `:""}
                                    
                                    ${s.chassis?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🏗️ Chassi:</span>
                                            <span class="text-blue-300 font-medium">${this.getReadableComponentName(s.chassis)}</span>
                                        </div>
                                    `:""}
                                    
                                    ${s.armor_thickness?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🛡️ Blindagem:</span>
                                            <span class="text-yellow-300 font-medium">${s.armor_thickness}mm</span>
                                        </div>
                                    `:""}
                                    
                                    ${s.main_gun_caliber?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">🎯 Armamento:</span>
                                            <span class="text-red-300 font-medium">${s.main_gun_caliber}mm</span>
                                        </div>
                                    `:""}
                                    
                                    ${s.weight?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⚖️ Peso:</span>
                                            <span class="text-slate-300 font-medium">${s.weight}t</span>
                                        </div>
                                    `:""}
                                    
                                    ${s.max_speed?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⚡ Velocidade:</span>
                                            <span class="text-green-300 font-medium">${s.max_speed} km/h</span>
                                        </div>
                                    `:""}
                                    
                                    ${s.crew_size?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">👥 Tripulação:</span>
                                            <span class="text-cyan-300 font-medium">${s.crew_size}</span>
                                        </div>
                                    `:""}
                                    
                                    ${s.fuel_capacity?`
                                        <div class="flex justify-between items-center">
                                            <span class="text-slate-400">⛽ Combustível:</span>
                                            <span class="text-slate-300 font-medium">${s.fuel_capacity}L</span>
                                        </div>
                                    `:""}
                                </div>
                                
                                <!-- Performance indicators -->
                                ${s.penetration||s.protection||s.mobility?`
                                    <div class="mt-3 pt-2 border-t border-slate-700/50">
                                        <h6 class="text-xs font-semibold text-slate-400 mb-2">📊 Indicadores</h6>
                                        <div class="grid grid-cols-3 gap-3 text-xs">
                                            ${s.penetration?`
                                                <div class="text-center">
                                                    <div class="text-red-400 font-bold">${s.penetration}mm</div>
                                                    <div class="text-slate-500">Penetração</div>
                                                </div>
                                            `:""}
                                            ${s.protection?`
                                                <div class="text-center">
                                                    <div class="text-yellow-400 font-bold">${s.protection}mm</div>
                                                    <div class="text-slate-500">Proteção</div>
                                                </div>
                                            `:""}
                                            ${s.mobility?`
                                                <div class="text-center">
                                                    <div class="text-green-400 font-bold">${s.mobility}</div>
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
                        ${r?`
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
        `}showVehicleSheet(e,t){if(!this.selectedCountry){alert("Selecione um país primeiro");return}const o=(this.inventories.get(this.selectedCountry)||{})[e]?.[t];if(!o){alert("Dados do veículo não encontrados");return}let r=null,s="none";if(o.sheetImageUrl&&o.sheetImageUrl.startsWith("http")?(r=o.sheetImageUrl,s="image"):o.sheetHtmlUrl&&o.sheetHtmlUrl.startsWith("http")?(r=o.sheetHtmlUrl,s="html"):o.sheetImageUrl&&o.sheetImageUrl.startsWith("data:")&&(r=o.sheetImageUrl,s="data"),!r){this.showBasicVehicleInfo(t,o);return}const n=document.getElementById("vehicle-sheet-modal");n&&n.remove();const i=document.createElement("div");i.id="vehicle-sheet-modal",i.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",i.style.zIndex="10000",i.innerHTML=`
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-slate-600">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-200">🖼️ Ficha Técnica</h3>
                        <p class="text-sm text-slate-400">${t} - ${this.getCountryDisplayName()}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.open('${r}', '_blank')" 
                                class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10">
                            🔗 Nova Aba
                        </button>
                        <button onclick="document.getElementById('vehicle-sheet-modal').remove()" 
                                class="text-slate-400 hover:text-slate-200 text-xl p-1">×</button>
                    </div>
                </div>
                
                <div class="flex-1 overflow-auto p-4">
                    ${s==="image"?`
                        <div class="text-center">
                            <img src="${r}" alt="Ficha do Veículo" 
                                 class="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
                                 style="max-height: 70vh;" />
                        </div>
                    `:s==="html"||s==="data"?`
                        <iframe src="${r}" 
                                style="width: 100%; height: 70vh; border: none; border-radius: 8px;"></iframe>
                    `:`
                        <div class="text-center py-8 text-red-400">
                            Formato de ficha não suportado
                        </div>
                    `}
                </div>
            </div>
        `,i.addEventListener("click",l=>{l.target===i&&i.remove()}),document.addEventListener("keydown",function l(c){c.key==="Escape"&&(i.remove(),document.removeEventListener("keydown",l))}),document.body.appendChild(i)}showBasicVehicleInfo(e,t){const a=document.createElement("div");a.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.style.zIndex="10000",a.innerHTML=`
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
        `,a.addEventListener("click",o=>{o.target===a&&a.remove()}),document.body.appendChild(a)}getCountryDisplayName(){if(!this.selectedCountry)return"País Desconhecido";const e=document.getElementById("inventory-country-select");if(e){const t=e.querySelector(`option[value="${this.selectedCountry}"]`);if(t)return t.textContent}return this.selectedCountry}getReadableComponentName(e){return e?this.componentNames[e]?this.componentNames[e]:e.replace(/_/g," ").replace(/([a-z])([A-Z])/g,"$1 $2").split(" ").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"N/A"}}class $e{constructor(){this.batchQueue=[],this.batchTimer=null,this.batchDelay=500}async recordChange({countryId:e,section:t,field:a,oldValue:o,newValue:r,userId:s=null,userName:n=null,reason:i=null,metadata:l={}}){try{const c=k.currentUser;if(!c&&!s)throw new Error("Usuário não autenticado");const m={countryId:e,section:t,field:a,oldValue:this.sanitizeValue(o),newValue:this.sanitizeValue(r),userId:s||c.uid,userName:n||c.displayName||"Sistema",timestamp:new Date,reason:i,metadata:{userAgent:navigator.userAgent,platform:navigator.platform,...l},changeType:this.getChangeType(o,r),delta:this.calculateDelta(o,r),severity:this.calculateSeverity(t,a,o,r)};return this.batchQueue.push(m),this.scheduleBatchWrite(),d.debug("Mudança registrada:",m),m}catch(c){throw d.error("Erro ao registrar mudança:",c),c}}async recordBatchChanges(e,t=null){try{const a=p.batch(),o=new Date,r=k.currentUser,s=this.generateBatchId();return e.forEach(n=>{const i={...n,batchId:s,userId:r?.uid,userName:r?.displayName||"Sistema",timestamp:o,reason:t,changeType:this.getChangeType(n.oldValue,n.newValue),delta:this.calculateDelta(n.oldValue,n.newValue),severity:this.calculateSeverity(n.section,n.field,n.oldValue,n.newValue)},l=p.collection("changeHistory").doc();a.set(l,i)}),await a.commit(),d.info(`Lote de ${e.length} mudanças registrado com ID: ${s}`),s}catch(a){throw d.error("Erro ao registrar mudanças em lote:",a),a}}async applyRealTimeChange({countryId:e,section:t,field:a,newValue:o,reason:r=null,skipHistory:s=!1}){try{const n=p.collection("paises").doc(e),i=await n.get();if(!i.exists)throw new Error(`País ${e} não encontrado`);const m=(i.data()[t]||{})[a];this.validateChange(t,a,m,o);const f={[`${t}.${a}`]:o,[`${t}.lastModified`]:new Date,[`${t}.lastModifiedBy`]:k.currentUser?.uid};return await n.update(f),s||await this.recordChange({countryId:e,section:t,field:a,oldValue:m,newValue:o,reason:r}),this.broadcastChange({countryId:e,section:t,field:a,oldValue:m,newValue:o,timestamp:new Date}),d.info(`Mudança aplicada em tempo real: ${e}.${t}.${a}`),!0}catch(n){throw d.error("Erro ao aplicar mudança em tempo real:",n),h("error",`Erro ao aplicar mudança: ${n.message}`),n}}async getChangeHistory({countryId:e=null,section:t=null,field:a=null,userId:o=null,startDate:r=null,endDate:s=null,limit:n=50,orderBy:i="timestamp",orderDirection:l="desc"}={}){try{let c=p.collection("changeHistory");e&&(c=c.where("countryId","==",e)),t&&(c=c.where("section","==",t)),a&&(c=c.where("field","==",a)),o&&(c=c.where("userId","==",o)),r&&(c=c.where("timestamp",">=",r)),s&&(c=c.where("timestamp","<=",s)),c=c.orderBy(i,l),n&&(c=c.limit(n));const g=(await c.get()).docs.map(f=>({id:f.id,...f.data(),timestamp:f.data().timestamp.toDate()}));return d.debug(`Histórico recuperado: ${g.length} mudanças`),g}catch(c){throw d.error("Erro ao buscar histórico:",c),c}}async rollbackChange(e,t=null){try{const a=await p.collection("changeHistory").doc(e).get();if(!a.exists)throw new Error("Mudança não encontrada");const o=a.data(),{countryId:r,section:s,field:n,oldValue:i,newValue:l}=o,c=await p.collection("paises").doc(r).get();if(!c.exists)throw new Error("País não existe mais");const g=c.data()[s]?.[n];if(!this.valuesEqual(g,l))throw new Error("O valor foi modificado após esta mudança. Rollback automático não é seguro.");return await this.applyRealTimeChange({countryId:r,section:s,field:n,newValue:i,reason:`ROLLBACK: ${t||"Revertido pelo narrador"}`,skipHistory:!1}),await p.collection("changeHistory").doc(e).update({rolledBack:!0,rollbackTimestamp:new Date,rollbackUserId:k.currentUser?.uid,rollbackReason:t}),h("success","Mudança revertida com sucesso"),d.info(`Rollback executado para mudança: ${e}`),!0}catch(a){throw d.error("Erro no rollback:",a),h("error",`Erro no rollback: ${a.message}`),a}}async rollbackBatch(e,t=null){try{const a=await p.collection("changeHistory").where("batchId","==",e).where("rolledBack","!=",!0).orderBy("timestamp","desc").get();if(a.empty)throw new Error("Nenhuma mudança encontrada para este lote");const o=[];return a.forEach(r=>{o.push(this.rollbackChange(r.id,t))}),await Promise.all(o),h("success",`Lote de ${o.length} mudanças revertido`),!0}catch(a){throw d.error("Erro no rollback do lote:",a),h("error",`Erro no rollback do lote: ${a.message}`),a}}async getHistoryStats(e=null,t=30){try{const a=new Date;a.setDate(a.getDate()-t);let o=p.collection("changeHistory").where("timestamp",">=",a);e&&(o=o.where("countryId","==",e));const s=(await o.get()).docs.map(i=>i.data()),n={totalChanges:s.length,bySection:{},byUser:{},bySeverity:{low:0,medium:0,high:0,critical:0},dailyActivity:{},mostActiveFields:{},rollbackRate:0};return s.forEach(i=>{n.bySection[i.section]||(n.bySection[i.section]=0),n.bySection[i.section]++,n.byUser[i.userName]||(n.byUser[i.userName]=0),n.byUser[i.userName]++,i.severity&&n.bySeverity[i.severity]++;const l=i.timestamp.toDate().toISOString().split("T")[0];n.dailyActivity[l]||(n.dailyActivity[l]=0),n.dailyActivity[l]++;const c=`${i.section}.${i.field}`;n.mostActiveFields[c]||(n.mostActiveFields[c]=0),n.mostActiveFields[c]++,i.rolledBack&&n.rollbackRate++}),n.rollbackRate=n.totalChanges>0?n.rollbackRate/n.totalChanges*100:0,n}catch(a){throw d.error("Erro ao gerar estatísticas:",a),a}}sanitizeValue(e){return e==null?null:typeof e=="object"?JSON.parse(JSON.stringify(e)):e}getChangeType(e,t){return e==null?"create":t==null?"delete":"update"}calculateDelta(e,t){return typeof e=="number"&&typeof t=="number"?{absolute:t-e,percentage:e!==0?(t-e)/e*100:null}:null}calculateSeverity(e,t,a,o){const r=["PIB","Estabilidade","Populacao"],s=["geral","exercito"];if(r.includes(t)){const n=this.calculateDelta(a,o);return n&&Math.abs(n.percentage)>50?"critical":n&&Math.abs(n.percentage)>20?"high":"medium"}return s.includes(e)?"medium":"low"}validateChange(e,t,a,o){if(t==="PIB"&&o<0)throw new Error("PIB não pode ser negativo");if(t==="Estabilidade"&&(o<0||o>100))throw new Error("Estabilidade deve estar entre 0 e 100");if(t==="Populacao"&&o<0)throw new Error("População não pode ser negativa")}valuesEqual(e,t){return e===t?!0:typeof e=="object"&&typeof t=="object"?JSON.stringify(e)===JSON.stringify(t):!1}generateBatchId(){return`batch_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}scheduleBatchWrite(){this.batchTimer&&clearTimeout(this.batchTimer),this.batchTimer=setTimeout(async()=>{if(this.batchQueue.length!==0)try{const e=p.batch(),t=[...this.batchQueue];this.batchQueue=[],t.forEach(a=>{const o=p.collection("changeHistory").doc();e.set(o,a)}),await e.commit(),d.debug(`Lote de ${t.length} mudanças salvo no histórico`)}catch(e){d.error("Erro ao salvar lote no histórico:",e),this.batchQueue.unshift(...this.batchQueue)}},this.batchDelay)}broadcastChange(e){window.dispatchEvent(new CustomEvent("country:changed",{detail:e}))}}const z=new $e;class Ie{constructor(){this.listeners=new Map,this.pendingChanges=new Map,this.isOnline=navigator.onLine,this.setupConnectionHandlers()}async updateField({countryId:e,section:t,field:a,value:o,reason:r=null,broadcast:s=!0,validate:n=!0}){try{if(n&&this.validateFieldValue(t,a,o),!this.isOnline)return this.queueOfflineChange({countryId:e,section:t,field:a,value:o,reason:r});const i=await this.getCurrentFieldValue(e,t,a);return this.valuesEqual(i,o)?(d.debug("Valor não alterado, ignorando update"),!1):(d.info("Salvando diretamente no Firebase (histórico desabilitado)"),await this.saveWithRetry(e,t,a,o),s&&this.broadcastLocalUpdate({countryId:e,section:t,field:a,oldValue:i,newValue:o}),d.debug(`Campo atualizado em tempo real: ${e}.${t}.${a}`),!0)}catch(i){throw d.error("Erro na atualização em tempo real:",i),h("error",`Erro: ${i.message}`),i}}async updateMultipleFields({countryId:e,section:t,fields:a,reason:o=null,broadcast:r=!0}){try{const s=[];for(const[n,i]of Object.entries(a)){const l=await this.getCurrentFieldValue(e,t,n);this.valuesEqual(l,i)||s.push({countryId:e,section:t,field:n,oldValue:l,newValue:i})}return s.length===0?(d.debug("Nenhuma mudança detectada"),!1):(await this.executeDirectUpdate(s),r&&s.forEach(n=>this.broadcastLocalUpdate(n)),h("success",`${s.length} campos atualizados`),!0)}catch(s){throw d.error("Erro na atualização múltipla:",s),h("error",`Erro: ${s.message}`),s}}async applyMassDeltas({countryIds:e,deltas:t,reason:a="Aplicação de deltas em massa"}){try{const o=[];for(const s of e){const n=await p.collection("paises").doc(s).get();if(!n.exists)continue;const i=n.data();for(const[l,c]of Object.entries(t)){const m=i[l]||{};for(const[g,f]of Object.entries(c)){if(f===0||f===null||f===void 0)continue;const x=m[g]||0;let v;if(g==="PIB"&&typeof f=="number")v=x*(1+f/100);else if(typeof x=="number")v=x+f;else{d.warn(`Campo ${g} não suporta delta, ignorando`);continue}v=this.applyFieldLimits(l,g,v),o.push({countryId:s,section:l,field:g,oldValue:x,newValue:v})}}}if(o.length===0)return h("warning","Nenhuma mudança aplicável encontrada"),!1;await this.executeBatchUpdate(o);let r=null;try{r=await z.recordBatchChanges(o,a)}catch(s){d.warn("Erro ao registrar deltas no histórico:",s.message),r="fallback_"+Date.now()}return o.forEach(s=>this.broadcastLocalUpdate(s)),h("success",`Deltas aplicados: ${o.length} mudanças em ${e.length} países`),d.info(`Deltas em massa aplicados (Batch ID: ${r}):`,o),r}catch(o){throw d.error("Erro na aplicação de deltas em massa:",o),h("error",`Erro nos deltas: ${o.message}`),o}}subscribeToCountryChanges(e,t){const a=p.collection("paises").doc(e).onSnapshot(o=>{o.exists&&t({countryId:e,data:o.data(),timestamp:new Date})},o=>{d.error("Erro no listener de mudanças:",o)});return this.listeners.set(`country_${e}`,a),a}subscribeToHistory(e,t){let a=p.collection("changeHistory");e.countryId&&(a=a.where("countryId","==",e.countryId)),e.section&&(a=a.where("section","==",e.section)),e.userId&&(a=a.where("userId","==",e.userId)),a=a.orderBy("timestamp","desc").limit(e.limit||50);const o=a.onSnapshot(s=>{const n=s.docs.map(i=>({id:i.id,...i.data(),timestamp:i.data().timestamp.toDate()}));t(n)},s=>{d.error("Erro no listener de histórico:",s)}),r=`history_${Date.now()}`;return this.listeners.set(r,o),{unsubscribe:o,listenerId:r}}unsubscribe(e){const t=this.listeners.get(e);return t?(t(),this.listeners.delete(e),!0):!1}unsubscribeAll(){this.listeners.forEach(e=>e()),this.listeners.clear()}async getCurrentFieldValue(e,t,a){const o=await p.collection("paises").doc(e).get();if(!o.exists)throw new Error(`País ${e} não encontrado`);return o.data()[t]?.[a]}async executeTransactionalUpdate(e,t){await p.runTransaction(async a=>{const o=new Map;e.forEach(r=>{o.has(r.countryId)||o.set(r.countryId,{});const s=o.get(r.countryId);s[r.section]||(s[r.section]={}),s[r.section][r.field]=r.newValue}),o.forEach((r,s)=>{const n=p.collection("paises").doc(s),i={};Object.entries(r).forEach(([l,c])=>{Object.entries(c).forEach(([m,g])=>{i[`${l}.${m}`]=g}),i[`${l}.lastModified`]=new Date,i[`${l}.lastModifiedBy`]=k.currentUser?.uid}),a.update(n,i)})});try{await z.recordBatchChanges(e,t)}catch(a){d.warn("Erro ao registrar no histórico, continuando:",a.message)}}async executeBatchUpdate(e){const t=p.batch(),a=new Map;e.forEach(o=>{a.has(o.countryId)||a.set(o.countryId,{});const r=a.get(o.countryId);r[o.section]||(r[o.section]={}),r[o.section][o.field]=o.newValue}),a.forEach((o,r)=>{const s=p.collection("paises").doc(r),n={};Object.entries(o).forEach(([i,l])=>{Object.entries(l).forEach(([c,m])=>{n[`${i}.${c}`]=m}),n[`${i}.lastModified`]=new Date,n[`${i}.lastModifiedBy`]=k.currentUser?.uid}),t.update(s,n)}),await t.commit()}validateFieldValue(e,t,a){if(t==="PIB"&&a<0)throw new Error("PIB não pode ser negativo");if(t==="Estabilidade"&&(a<0||a>100))throw new Error("Estabilidade deve estar entre 0 e 100");if(t==="Tecnologia"&&(a<0||a>100))throw new Error("Tecnologia deve estar entre 0 e 100");if(t==="Urbanizacao"&&(a<0||a>100))throw new Error("Urbanização deve estar entre 0 e 100");if(t==="Populacao"&&a<0)throw new Error("População não pode ser negativa")}applyFieldLimits(e,t,a){return t==="Estabilidade"||t==="Tecnologia"||t==="Urbanizacao"?Math.max(0,Math.min(100,a)):t==="PIB"||t==="Populacao"?Math.max(0,a):e==="exercito"||e==="aeronautica"||e==="marinha"||e==="veiculos"?Math.max(0,Math.floor(a)):a}valuesEqual(e,t){return e===t?!0:typeof e=="number"&&typeof t=="number"?Math.abs(e-t)<.001:!1}broadcastLocalUpdate(e){window.dispatchEvent(new CustomEvent("realtime:update",{detail:e}))}setupConnectionHandlers(){window.addEventListener("online",()=>{this.isOnline=!0,d.info("Conexão restaurada, sincronizando mudanças offline"),this.syncOfflineChanges()}),window.addEventListener("offline",()=>{this.isOnline=!1,d.warn("Conexão perdida, mudanças serão enfileiradas")})}queueOfflineChange(e){const t=`${e.countryId}.${e.section}.${e.field}`;this.pendingChanges.set(t,{...e,timestamp:new Date}),h("info","Mudança salva localmente (offline)"),d.debug("Mudança enfileirada para sync:",e)}async syncOfflineChanges(){if(this.pendingChanges.size===0)return;const e=Array.from(this.pendingChanges.values());this.pendingChanges.clear();try{for(const t of e)await this.updateField({...t,reason:`Sync offline: ${t.reason||"Mudança feita offline"}`});h("success",`${e.length} mudanças sincronizadas`),d.info(`${e.length} mudanças offline sincronizadas`)}catch(t){d.error("Erro na sincronização offline:",t),e.forEach(a=>{const o=`${a.countryId}.${a.section}.${a.field}`;this.pendingChanges.set(o,a)})}}async executeDirectUpdate(e){for(const t of e)await this.saveWithRetry(t.countryId,t.section,t.field,t.newValue)}async saveWithRetry(e,t,a,o,r=3){for(let s=1;s<=r;s++)try{const n={};n[`${t}.${a}`]=o,n[`${t}.lastModified`]=new Date,n[`${t}.lastModifiedBy`]=k.currentUser?.uid,await p.collection("paises").doc(e).update(n),d.info(`Mudança salva (tentativa ${s}): ${e}.${t}.${a}`);return}catch(n){if((n.message.includes("ERR_BLOCKED_BY_CLIENT")||n.code==="unavailable"||n.code==="deadline-exceeded")&&s<r)d.warn(`Tentativa ${s} falhou (rede), tentando novamente em ${s*1e3}ms...`),await new Promise(l=>setTimeout(l,s*1e3));else throw d.error(`Falha após ${s} tentativas:`,n),this.broadcastLocalUpdate({countryId:e,section:t,field:a,oldValue:null,newValue:o}),h("warning","Conexão instável. A mudança pode não ter sido salva no servidor, mas foi aplicada localmente."),n}}}new Ie;class Se{constructor(){this.players=[],this.countries=[],this.listeners=new Map,this.isLoading=!1}async loadPlayers(){if(this.isLoading)return this.players;try{this.isLoading=!0;const t=await p.collection("usuarios").get();return t.empty?(d.warn("Nenhum usuário encontrado na coleção"),this.players=[],this.players):(this.players=t.docs.map(a=>{const o=a.data();return{id:a.id,...o,lastLogin:o.ultimoLogin?.toDate(),createdAt:o.criadoEm?.toDate(),isOnline:o.ultimoLogin?Date.now()-o.ultimoLogin.toDate().getTime()<3e5:!1}}),d.debug(`${this.players.length} jogadores carregados`),this.players)}catch(e){if(d.error("Erro ao carregar jogadores:",e),e.code==="permission-denied")return d.warn("Acesso negado à coleção usuarios, usando dados limitados"),this.players=[],this.players;throw e}finally{this.isLoading=!1}}async loadCountries(){try{const{getAllCountries:e}=await $(async()=>{const{getAllCountries:t}=await import("./firebase-EZ41UaXc.js").then(a=>a.p);return{getAllCountries:t}},__vite__mapDeps([0,1]));return this.countries=await e(),d.debug(`${this.countries.length} países carregados`),this.countries}catch(e){throw d.error("Erro ao carregar países:",e),e}}async assignCountryToPlayer(e,t,a=null){try{const o=this.players.find(n=>n.id===e),r=this.countries.find(n=>n.id===t);if(!o)throw new Error("Jogador não encontrado");if(!r)throw new Error("País não encontrado");if(r.Player&&r.Player!==e){const n=this.players.find(l=>l.id===r.Player);if(!await T("País já Atribuído",`O país ${r.Pais} já está atribuído a ${n?.nome}. Deseja transferir?`,"Transferir","Cancelar"))return!1}await p.runTransaction(async n=>{const i=p.collection("paises").doc(t),l=p.collection("usuarios").doc(e);n.update(i,{Player:e,DataVinculacao:firebase.firestore.Timestamp.now()}),n.update(l,{paisId:t,ultimaAtualizacao:firebase.firestore.Timestamp.now()})}),await z.recordChange({countryId:t,section:"sistema",field:"Player",oldValue:r.Player||null,newValue:e,reason:a||"Atribuição de país via narrador"}),h("success",`País ${r.Pais} atribuído a ${o.nome}`),d.info(`País ${t} atribuído ao jogador ${e}`);const s=this.countries.findIndex(n=>n.id===t);return s>=0&&(this.countries[s].Player=e,this.countries[s].DataVinculacao=new Date),!0}catch(o){throw d.error("Erro na atribuição:",o),h("error",`Erro: ${o.message}`),o}}async unassignCountry(e,t=null){try{const a=this.countries.find(i=>i.id===e);if(!a)throw new Error("País não encontrado");const o=a.Player;if(!o)return h("info","País já não tem jogador atribuído"),!1;const r=this.players.find(i=>i.id===o);if(!await T("Confirmar Remoção",`Tem certeza que deseja remover ${r?.nome||"jogador"} do país ${a.Pais}?`,"Remover","Cancelar"))return!1;await p.runTransaction(async i=>{const l=p.collection("paises").doc(e),c=p.collection("usuarios").doc(o);i.update(l,{Player:firebase.firestore.FieldValue.delete(),DataVinculacao:firebase.firestore.FieldValue.delete()}),i.update(c,{paisId:firebase.firestore.FieldValue.delete(),ultimaAtualizacao:firebase.firestore.Timestamp.now()})}),await z.recordChange({countryId:e,section:"sistema",field:"Player",oldValue:o,newValue:null,reason:t||"Remoção de atribuição via narrador"}),h("success",`Atribuição removida: ${a.Pais}`),d.info(`País ${e} desvinculado do jogador ${o}`);const n=this.countries.findIndex(i=>i.id===e);return n>=0&&(delete this.countries[n].Player,delete this.countries[n].DataVinculacao),!0}catch(a){throw d.error("Erro na remoção:",a),h("error",`Erro: ${a.message}`),a}}async assignRandomCountries(e=null){try{const t=this.countries.filter(m=>!m.Player),a=this.players.filter(m=>m.papel!=="admin"&&m.papel!=="narrador"&&!m.paisId);if(t.length===0){h("warning","Nenhum país disponível");return}if(a.length===0){h("warning","Nenhum jogador sem país");return}const o=Math.min(t.length,a.length,e||1/0);if(!await T("Atribuição Aleatória",`Atribuir aleatoriamente ${o} países a jogadores sem país?`,"Sim, Atribuir","Cancelar"))return;const s=this.shuffleArray([...t]),n=this.shuffleArray([...a]),i=[];for(let m=0;m<o;m++)i.push({playerId:n[m].id,countryId:s[m].id,playerName:n[m].nome,countryName:s[m].Pais});const l=[];for(const m of i)try{await this.assignCountryToPlayer(m.playerId,m.countryId,"Atribuição aleatória automática"),l.push({...m,success:!0})}catch(g){l.push({...m,success:!1,error:g.message})}const c=l.filter(m=>m.success).length;return h("success",`Atribuição aleatória concluída: ${c}/${o} sucessos`),l}catch(t){throw d.error("Erro na atribuição aleatória:",t),h("error",`Erro: ${t.message}`),t}}async clearAllAssignments(){try{const e=this.countries.filter(s=>s.Player);if(e.length===0){h("info","Nenhuma atribuição para remover");return}if(!await T("ATENÇÃO: Limpar Todas Atribuições",`Isso removerá TODAS as ${e.length} atribuições de países. Esta ação não pode ser desfeita facilmente.`,"Sim, Limpar Tudo","Cancelar")||!await T("Confirmação Final","Tem ABSOLUTA CERTEZA? Todos os jogadores perderão seus países.","CONFIRMAR LIMPEZA","Cancelar"))return;const o=p.batch(),r=[];e.forEach(s=>{const n=p.collection("paises").doc(s.id);if(o.update(n,{Player:firebase.firestore.FieldValue.delete(),DataVinculacao:firebase.firestore.FieldValue.delete()}),s.Player){const i=p.collection("usuarios").doc(s.Player);o.update(i,{paisId:firebase.firestore.FieldValue.delete(),ultimaAtualizacao:firebase.firestore.Timestamp.now()}),r.push({countryId:s.id,section:"sistema",field:"Player",oldValue:s.Player,newValue:null})}}),await o.commit(),await z.recordBatchChanges(r,"Limpeza geral de atribuições"),this.countries.forEach(s=>{s.Player&&(delete s.Player,delete s.DataVinculacao)}),h("success",`${e.length} atribuições removidas`),d.info("Todas as atribuições foram removidas")}catch(e){throw d.error("Erro ao limpar atribuições:",e),h("error",`Erro: ${e.message}`),e}}getPlayerAnalytics(){const e=this.players.length,t=this.players.filter(g=>g.paisId).length,a=this.players.filter(g=>g.papel==="admin").length,o=this.players.filter(g=>g.papel==="narrador").length,r=this.countries.length,s=this.countries.filter(g=>g.Player).length,n=new Date,i=new Date(n.getTime()-1440*60*1e3),l=new Date(n.getTime()-10080*60*1e3),c=this.players.filter(g=>g.lastLogin&&g.lastLogin>i).length,m=this.players.filter(g=>g.lastLogin&&g.lastLogin>l).length;return{players:{total:e,active:t,inactive:e-t,admins:a,narrators:o,recentlyActive:c,weeklyActive:m},countries:{total:r,assigned:s,available:r-s,assignmentRate:(s/r*100).toFixed(1)},assignments:this.countries.filter(g=>g.Player).map(g=>{const f=this.players.find(x=>x.id===g.Player);return{countryId:g.id,countryName:g.Pais,playerId:g.Player,playerName:f?.nome||"Desconhecido",assignedAt:g.DataVinculacao}})}}async sendAnnouncement({title:e,message:t,targetPlayers:a="all",priority:o="normal"}){try{let r=[];switch(a){case"all":r=this.players.filter(i=>i.papel!=="admin");break;case"active":r=this.players.filter(i=>i.paisId&&i.papel!=="admin");break;case"inactive":r=this.players.filter(i=>!i.paisId&&i.papel!=="admin");break;default:Array.isArray(a)&&(r=this.players.filter(i=>a.includes(i.id)))}if(r.length===0){h("warning","Nenhum destinatário encontrado");return}const s={title:e,message:t,sender:k.currentUser?.uid,senderName:k.currentUser?.displayName||"Narrador",timestamp:firebase.firestore.Timestamp.now(),priority:o,read:!1},n=p.batch();r.forEach(i=>{const l=p.collection("notifications").doc();n.set(l,{...s,userId:i.id})}),await n.commit(),h("success",`Anúncio enviado para ${r.length} jogadores`),d.info(`Anúncio enviado para ${r.length} jogadores`)}catch(r){throw d.error("Erro ao enviar anúncio:",r),h("error",`Erro: ${r.message}`),r}}shuffleArray(e){const t=[...e];for(let a=t.length-1;a>0;a--){const o=Math.floor(Math.random()*(a+1));[t[a],t[o]]=[t[o],t[a]]}return t}setupRealTimeListeners(){d.info("Real-time listeners desabilitados - usando refresh periódico"),this.refreshInterval=setInterval(async()=>{try{this.isLoading||(await this.loadPlayers(),await this.loadCountries(),this.broadcastUpdate("periodic-refresh"))}catch(e){d.debug("Erro no refresh periódico (normal):",e.message)}},3e4),this.listeners.set("refreshInterval",this.refreshInterval)}broadcastUpdate(e){window.dispatchEvent(new CustomEvent("playerManager:update",{detail:{type:e,data:e==="players"?this.players:this.countries}}))}cleanup(){this.listeners.forEach((e,t)=>{t==="refreshInterval"?clearInterval(e):typeof e=="function"&&e()}),this.listeners.clear()}}const V=new Se;class Ae{constructor(){this.pendingVehicles=[],this.approvedVehicles=[],this.rejectedVehicles=[],this.currentFilter="pending",this.currentSort="newest",this.pendingListener=null,this.setupEventListeners()}async initialize(){if(console.log("🚗 Inicializando sistema de aprovação de veículos..."),!window.firebase||!window.firebase.auth){console.error("❌ Firebase não inicializado");return}if(!window.firebase.auth().currentUser){console.log("⚠️ Usuário não logado, aguardando auth state..."),window.firebase.auth().onAuthStateChanged(t=>{t&&(console.log("✅ Usuário logado, inicializando sistema..."),this.loadAndRender())});return}await this.loadAndRender()}async loadAndRender(){await this.loadPendingVehicles(),this.render(),this.setupRealTimeListener(),setInterval(()=>this.refreshData(),3e4)}setupRealTimeListener(){try{console.log("🔄 Configurando listener em tempo real para veículos pendentes..."),this.pendingListener=p.collection("vehicles_pending").onSnapshot(e=>{console.log("🔔 Mudança detectada na coleção vehicles_pending"),e.empty?(console.log("⚠️ Coleção vazia"),this.pendingVehicles=[],this.render()):(console.log(`📊 ${e.size} documentos na coleção`),this.processPendingSnapshot(e))},e=>{console.error("❌ Erro no listener de veículos pendentes:",e),setTimeout(()=>this.refreshData(),5e3)})}catch(e){console.error("❌ Erro ao configurar listener:",e)}}processPendingSnapshot(e){try{const t=this.pendingVehicles.length;this.pendingVehicles=[];for(const o of e.docs)try{const r=o.data();let s=new Date;r.submittedAt&&r.submittedAt.toDate?s=r.submittedAt.toDate():r.submissionDate&&r.submissionDate.toDate&&(s=r.submissionDate.toDate());const n={id:o.id,...r,submissionDate:s};this.pendingVehicles.push(n)}catch(r){console.error("❌ Erro ao processar documento no snapshot:",o.id,r)}const a=this.pendingVehicles.length;if(console.log(`🔔 Atualização em tempo real: ${a} veículos pendentes`),a>t){const o=a-t;console.log(`🆕 ${o} novo(s) veículo(s) recebido(s)!`),this.showNewVehicleNotification(o)}this.currentFilter==="pending"&&this.render()}catch(t){console.error("❌ Erro ao processar snapshot:",t)}}showNewVehicleNotification(e){const t=document.createElement("div");t.className="fixed top-4 right-4 bg-brand-500 text-slate-900 px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce",t.style.zIndex="10000",t.innerHTML=`🆕 ${e} novo(s) veículo(s) para aprovação!`,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},5e3)}destroy(){this.pendingListener&&(console.log("🧹 Removendo listener de veículos pendentes..."),this.pendingListener(),this.pendingListener=null)}setupEventListeners(){document.addEventListener("click",e=>{if(e.target.matches("[data-filter]")&&(this.currentFilter=e.target.dataset.filter,this.render()),e.target.matches("[data-sort]")&&(this.currentSort=e.target.dataset.sort,this.render()),e.target.matches("[data-approve]")){const t=e.target.dataset.approve;this.showApprovalModal(t)}if(e.target.matches("[data-reject]")){const t=e.target.dataset.reject;this.rejectVehicle(t)}if(e.target.matches("[data-view-sheet]")){const t=e.target.dataset.viewSheet;this.viewVehicleSheet(t)}e.target.id==="refresh-vehicles"&&this.refreshData(),e.target.id==="debug-vehicles"&&this.debugSystem(),e.target.id==="force-reload"&&this.forceReload(),e.target.id==="bulk-approve"&&this.bulkApprove(),e.target.id==="bulk-reject"&&this.bulkReject()})}async loadPendingVehicles(){try{console.log("🔍 Buscando veículos pendentes..."),this.pendingVehicles=[];const e=await p.collection("vehicles_pending").get();if(console.log(`📊 Total de documentos encontrados: ${e.size}`),e.empty){console.log("⚠️ Nenhum veículo pendente encontrado");return}for(const t of e.docs)try{const a=t.data();console.log("🔍 Processando documento:",t.id,Object.keys(a));let o=new Date;a.submittedAt&&a.submittedAt.toDate?o=a.submittedAt.toDate():a.submissionDate&&a.submissionDate.toDate&&(o=a.submissionDate.toDate());const r={id:t.id,...a,submissionDate:o};this.pendingVehicles.push(r),console.log("✅ Veículo adicionado:",r.id,r.vehicleData?.name||"Nome não encontrado")}catch(a){console.error("❌ Erro ao processar documento:",t.id,a)}console.log(`📋 ${this.pendingVehicles.length} veículos pendentes carregados com sucesso`)}catch(e){console.error("❌ Erro ao carregar veículos pendentes:",e),console.error("📋 Detalhes do erro:",e.code,e.message),this.pendingVehicles=[]}}async loadApprovedVehicles(){try{console.log("🔄 Carregando veículos aprovados (nova estrutura)...");const e=await p.collection("vehicles_approved").get();this.approvedVehicles=[];for(const t of e.docs){const a=t.id;console.log(`📁 Processando país: ${a}`),(await p.collection("vehicles_approved").doc(a).collection("vehicles").orderBy("approvalDate","desc").limit(20).get()).docs.forEach(r=>{this.approvedVehicles.push({id:r.id,...r.data(),approvalDate:r.data().approvalDate?.toDate()||new Date})})}this.approvedVehicles.sort((t,a)=>(a.approvalDate||0)-(t.approvalDate||0)),this.approvedVehicles=this.approvedVehicles.slice(0,50),console.log(`✅ ${this.approvedVehicles.length} veículos aprovados carregados`)}catch(e){console.error("❌ Erro ao carregar veículos aprovados:",e),this.approvedVehicles=[]}}async loadRejectedVehicles(){try{const e=await p.collection("vehicles_rejected").orderBy("rejectionDate","desc").limit(50).get();this.rejectedVehicles=e.docs.map(t=>({id:t.id,...t.data(),rejectionDate:t.data().rejectionDate?.toDate()||new Date})),console.log(`❌ ${this.rejectedVehicles.length} veículos rejeitados carregados`)}catch(e){console.error("❌ Erro ao carregar veículos rejeitados:",e),this.rejectedVehicles=[]}}async refreshData(){console.log("🔄 Atualizando dados de aprovação..."),this.currentFilter==="pending"?await this.loadPendingVehicles():this.currentFilter==="approved"?await this.loadApprovedVehicles():this.currentFilter==="rejected"&&await this.loadRejectedVehicles(),this.render()}render(){const e=document.getElementById("vehicle-approval-anchor");e&&(e.innerHTML=this.getHTML(),this.updateStats())}getHTML(){const e=this.getFilteredVehicles();return`
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
        `}renderVehicleCard(e){const t={pending:"border-brand-500/30 bg-brand-500/5",approved:"border-emerald-500/30 bg-emerald-500/5",rejected:"border-red-500/30 bg-red-500/5"},a=s=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(s),o=e.vehicleData||{},r=o.total_cost||o.totalCost||0;return`
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
                            <div>💰 <strong>Custo unitário:</strong> $${r.toLocaleString()}</div>
                            <div>💰 <strong>Custo total:</strong> $${((r||0)*(e.quantity||1)).toLocaleString()}</div>
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
        `}getFilteredVehicles(){let e=[];switch(this.currentFilter){case"pending":e=[...this.pendingVehicles];break;case"approved":e=[...this.approvedVehicles];break;case"rejected":e=[...this.rejectedVehicles];break}switch(this.currentSort){case"newest":e.sort((t,a)=>(a.submissionDate||a.approvalDate||a.rejectionDate)-(t.submissionDate||t.approvalDate||t.rejectionDate));break;case"oldest":e.sort((t,a)=>(t.submissionDate||t.approvalDate||t.rejectionDate)-(a.submissionDate||a.approvalDate||a.rejectionDate));break;case"country":e.sort((t,a)=>(t.countryName||"").localeCompare(a.countryName||""));break;case"category":e.sort((t,a)=>(t.category||"").localeCompare(a.category||""));break}return e}async showApprovalModal(e){try{const t=this.pendingVehicles.find(x=>x.id===e);if(!t){alert("Veículo não encontrado");return}const a=t.vehicleData||{},o=t.quantity||1,r=a.total_cost||a.totalCost||0,s=document.getElementById("approval-modal");s&&s.remove();const n=document.createElement("div");n.id="approval-modal",n.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",n.style.zIndex="9999";const i=document.createElement("div");i.className="bg-bg border border-emerald-500/50 rounded-2xl max-w-md w-full p-6",i.innerHTML=`
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
                        <div><strong>Custo unitário:</strong> $${r.toLocaleString()}</div>
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
                            <span class="font-semibold">Custo total: $<span id="total-cost" class="text-emerald-300">${(r*o).toLocaleString()}</span></span>
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
            `,n.appendChild(i);const l=i.querySelector("#approval-quantity-slider"),c=i.querySelector("#current-quantity"),m=i.querySelector("#total-cost");l.addEventListener("input",x=>{const v=parseInt(x.target.value);c.textContent=v,m.textContent=(r*v).toLocaleString()});const g=i.querySelector("#confirm-approval"),f=i.querySelector("#cancel-approval");g.addEventListener("click",()=>{const x=parseInt(l.value);n.remove(),this.approveVehicle(e,x)}),f.addEventListener("click",()=>{n.remove()}),n.addEventListener("click",x=>{x.target===n&&n.remove()}),document.addEventListener("keydown",function x(v){v.key==="Escape"&&(n.remove(),document.removeEventListener("keydown",x))}),document.body.appendChild(n),l.focus()}catch(t){console.error("❌ Erro ao mostrar modal de aprovação:",t),alert("Erro ao abrir modal: "+t.message)}}async approveVehicle(e,t=null){try{console.log(`✅ Aprovando veículo ${e}...`);const a=await p.collection("vehicles_pending").doc(e).get();if(!a.exists)throw new Error("Veículo não encontrado");const o=a.data(),r=o.quantity||1,s=t||r;console.log(`📦 Quantidade original: ${r}, aprovada: ${s}`),console.log(`📁 Salvando na nova estrutura: vehicles_approved/${o.countryId}/vehicles/${e}`),await p.collection("vehicles_approved").doc(o.countryId).collection("vehicles").doc(e).set({...o,quantity:s,originalQuantity:r,approvalDate:new Date,status:"approved"}),console.log("✅ Veículo salvo na nova estrutura Firebase"),console.log("🔍 Dados do veículo antes de adicionar ao inventário:",{countryId:o.countryId,category:o.category,vehicleName:o.vehicleData?.name,quantity:s}),await this.addToInventory({...o,quantity:s}),await p.collection("vehicles_pending").doc(e).delete(),await this.refreshData(),console.log(`✅ Veículo ${e} aprovado: ${s}/${r} unidades`)}catch(a){console.error("❌ Erro ao aprovar veículo:",a),alert("Erro ao aprovar veículo: "+a.message)}}async rejectVehicle(e){try{const t=prompt("Motivo da rejeição (opcional):");console.log(`❌ Rejeitando veículo ${e}...`);const a=await p.collection("vehicles_pending").doc(e).get();if(!a.exists)throw new Error("Veículo não encontrado");const o=a.data();await this.deleteVehicleFiles(o),console.log("🗑️ Veículo rejeitado e arquivos deletados:",{vehicleId:e,vehicleName:o.vehicleData?.name,countryName:o.countryName,rejectionReason:t||"Sem motivo especificado",rejectionDate:new Date().toISOString()}),await p.collection("vehicles_pending").doc(e).delete(),await this.refreshData(),console.log(`✅ Veículo ${e} rejeitado e limpo do sistema`)}catch(t){console.error("❌ Erro ao rejeitar veículo:",t),alert("Erro ao rejeitar veículo: "+t.message)}}async deleteVehicleFiles(e){try{if(console.log("🗑️ Iniciando limpeza de arquivos do veículo rejeitado..."),!window.firebase?.storage){console.warn("⚠️ Firebase Storage não disponível, pulando limpeza de arquivos");return}const t=window.firebase.storage(),a=[];e.imageUrl&&a.push({url:e.imageUrl,type:"PNG"}),e.vehicleSheetImageUrl&&e.vehicleSheetImageUrl.startsWith("http")&&a.push({url:e.vehicleSheetImageUrl,type:"PNG/HTML"});for(const o of a)try{await t.refFromURL(o.url).delete(),console.log(`✅ Arquivo ${o.type} deletado:`,o.url)}catch(r){console.warn(`⚠️ Erro ao deletar arquivo ${o.type}:`,r)}console.log(`✅ Limpeza de arquivos concluída. ${a.length} arquivos processados.`)}catch(t){console.error("❌ Erro geral na limpeza de arquivos:",t)}}async addToInventory(e){try{const t=p.collection("inventory").doc(e.countryId),a=await t.get();let o={};a.exists&&(o=a.data());const r=e.category||"Other";o[r]||(o[r]={});const s=e.vehicleData?.name||e.vehicleData?.vehicle_name||"Veículo Sem Nome";if(!o[r][s]){const n={"vehicleData.vehicleData?.total_cost":e.vehicleData?.total_cost,"vehicleData.vehicleData?.totalCost":e.vehicleData?.totalCost,"vehicleData.total_cost":e.total_cost,"vehicleData.totalCost":e.totalCost,"vehicleData.cost":e.cost};console.log("🔍 Custos possíveis para",s,":",n);const i=e.vehicleData?.total_cost||e.vehicleData?.totalCost||e.total_cost||e.totalCost||e.cost||0;console.log("💰 Custo unitário calculado:",i);const l={quantity:0,specs:e.vehicleData||{},cost:i,approvedDate:new Date().toISOString(),approvedBy:"narrator"};(e.imageUrl||e.vehicleSheetImageUrl)&&(l.sheetImageUrl=e.imageUrl||e.vehicleSheetImageUrl),e.vehicleSheetHtmlUrl&&(l.sheetHtmlUrl=e.vehicleSheetHtmlUrl),o[r][s]=l}o[r][s].quantity+=e.quantity||1,await t.set(o,{merge:!0}),console.log(`📦 ${e.quantity||1}x ${s} adicionado ao inventário com ficha de ${e.countryName}`)}catch(t){console.error("❌ Erro ao adicionar ao inventário:",t)}}async viewVehicleSheet(e){try{const a=[...this.pendingVehicles,...this.approvedVehicles,...this.rejectedVehicles].find(r=>r.id===e);if(!a){alert("Veículo não encontrado");return}console.log("🔍 Campos do veículo:",Object.keys(a)),console.log("🔍 imageUrl:",a.imageUrl),console.log("🔍 vehicleSheetImageUrl:",a.vehicleSheetImageUrl?.substring(0,50)+"...");let o=null;if(a.imageUrl&&a.imageUrl.startsWith("http")?(o=a.imageUrl,console.log("✅ Usando imageUrl (Firebase Storage):",o)):a.vehicleSheetImageUrl&&a.vehicleSheetImageUrl.startsWith("http")?(o=a.vehicleSheetImageUrl,console.log("✅ Usando vehicleSheetImageUrl (Firebase Storage):",o)):a.vehicleSheetImageUrl&&a.vehicleSheetImageUrl.startsWith("data:text/html")?(o=a.vehicleSheetImageUrl,console.log("⚠️ Usando HTML fallback")):console.error("❌ Nenhuma URL de imagem encontrada"),!o){alert("Ficha do veículo não encontrada");return}console.log("🖼️ Abrindo ficha em modal para veículo:",e),this.showVehicleSheetModal(a,o)}catch(t){console.error("❌ Erro ao visualizar ficha:",t),alert("Erro ao abrir ficha: "+t.message)}}showVehicleSheetModal(e,t){const a=document.getElementById("vehicle-sheet-modal");a&&a.remove();const o=document.createElement("div");o.id="vehicle-sheet-modal",o.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",o.style.zIndex="9999";const r=document.createElement("div");r.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col";const s=document.createElement("div");s.className="flex items-center justify-between p-4 border-b border-bg-ring/50",s.innerHTML=`
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
        `;const n=document.createElement("div");if(n.className="flex-1 overflow-auto p-4",t.startsWith("data:text/html")){const c=document.createElement("iframe");c.src=t,c.style.cssText="width: 100%; height: 70vh; border: none; border-radius: 8px;",c.onload=()=>{console.log("✅ Ficha carregada no iframe")},c.onerror=()=>{console.error("❌ Erro ao carregar ficha no iframe"),n.innerHTML='<p class="text-red-400">Erro ao carregar ficha</p>'},n.innerHTML="",n.appendChild(c)}else t.startsWith("http")?n.innerHTML=`
                <div class="text-center">
                    <img src="${t}" alt="Ficha do Veículo" class="max-w-full max-h-full mx-auto rounded-lg shadow-lg" 
                         style="max-height: 70vh;" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;">
                </div>
            `:n.innerHTML='<p class="text-red-400">Formato de ficha não suportado</p>';r.appendChild(s),r.appendChild(n),o.appendChild(r);const i=()=>{o.remove()},l=()=>{if(t.startsWith("data:text/html")){const c=decodeURIComponent(t.split(",")[1]),m=window.open("","_blank","width=800,height=600,scrollbars=yes,resizable=yes");m&&(m.document.open(),m.document.write(c),m.document.close(),m.document.title=`Ficha - ${e.vehicleData?.name||"Veículo"}`)}else window.open(t,"_blank")};o.addEventListener("click",c=>{c.target===o&&i()}),s.querySelector("#close-modal").addEventListener("click",i),s.querySelector("#open-in-new-tab").addEventListener("click",l),document.addEventListener("keydown",function c(m){m.key==="Escape"&&(i(),document.removeEventListener("keydown",c))}),document.body.appendChild(o),o.focus()}async bulkApprove(){const e=this.getSelectedVehicles();if(e.length===0){alert("Selecione pelo menos um veículo");return}if(confirm(`Aprovar ${e.length} veículo(s) selecionado(s)?`))for(const t of e)await this.approveVehicle(t)}async bulkReject(){const e=this.getSelectedVehicles();if(e.length===0){alert("Selecione pelo menos um veículo");return}if(prompt("Motivo da rejeição em lote (opcional):"),!!confirm(`Rejeitar ${e.length} veículo(s) selecionado(s)?

Todos os arquivos associados serão removidos para economizar espaço.`)){console.log(`🗑️ Iniciando rejeição em lote de ${e.length} veículos...`);for(const t of e)await this.rejectVehicle(t);console.log(`✅ Rejeição em lote concluída. ${e.length} veículos e arquivos removidos.`)}}getSelectedVehicles(){const e=document.querySelectorAll(".vehicle-select:checked");return Array.from(e).map(t=>t.dataset.vehicleId)}updateStats(){const e=document.getElementById("pending-count");e&&(e.textContent=this.pendingVehicles.length)}async debugSystem(){console.log("🔍 === DEBUG DO SISTEMA DE APROVAÇÃO ===");try{console.log("🔥 Firebase auth:",window.firebase?.auth()),console.log("👤 Current user:",window.firebase?.auth()?.currentUser),console.log("🗃️ Firestore db:",p);const e=p.collection("vehicles_pending");console.log("📁 Pending collection ref:",e);const t=await e.get();if(console.log("📊 Snapshot size:",t.size),console.log("📊 Snapshot empty:",t.empty),!t.empty){t.docs.forEach((o,r)=>{console.log(`📄 Doc ${r+1}:`,o.id,o.data())}),console.log("🔧 FORÇANDO PROCESSAMENTO DOS DOCUMENTOS:");const a=[];for(const o of t.docs)try{const r=o.data();console.log("🔍 Processando no debug:",o.id,Object.keys(r));let s=new Date;r.submittedAt&&r.submittedAt.toDate&&(s=r.submittedAt.toDate());const n={id:o.id,...r,submissionDate:s};a.push(n),console.log("✅ Processado no debug:",n.id,n.vehicleData?.name)}catch(r){console.error("❌ Erro no debug:",r)}console.log("🚀 Total processado no debug:",a.length)}console.log("🧠 Current pending vehicles:",this.pendingVehicles),console.log("🎯 Current filter:",this.currentFilter)}catch(e){console.error("💥 Debug error:",e)}console.log("🔍 === FIM DO DEBUG ===")}async forceReload(){console.log("🔧 === FORCE RELOAD INICIADO ===");try{this.pendingVehicles=[];const e=await p.collection("vehicles_pending").get();console.log("📊 Force reload - documents found:",e.size);for(const t of e.docs){const a=t.data();console.log("🔍 Processing in force reload:",t.id);let o=new Date;a.submittedAt&&a.submittedAt.toDate?o=a.submittedAt.toDate():a.submissionDate&&a.submissionDate.toDate&&(o=a.submissionDate.toDate());const r={id:t.id,...a,submissionDate:o};this.pendingVehicles.push(r),console.log("✅ Added vehicle:",r.id,r.vehicleData?.name)}console.log("🚀 Force reload completed:",this.pendingVehicles.length,"vehicles"),this.render()}catch(e){console.error("❌ Force reload failed:",e)}console.log("🔧 === FORCE RELOAD FIM ===")}}const de={vehicles:{Howitzer:{name:"Howitzer",description:"Peça de artilharia rebocada",stats:{armor:0,firepower:75,speed:0,reliability:80,cost:5e4},icon:"🎯",year:1954},SPA:{name:"SPA (Artilharia Autopropulsada)",description:"Artilharia autopropulsada",stats:{armor:20,firepower:70,speed:30,reliability:75,cost:65e3},icon:"💥",year:1954},Antiaerea:{name:"Antiaérea",description:"Artilharia antiaérea",stats:{armor:0,firepower:40,speed:0,reliability:80,cost:3e4},icon:"🎪",year:1954},SPAA:{name:"SPAA",description:"Artilharia Antiaérea Autopropulsada",stats:{armor:15,firepower:35,speed:40,reliability:80,cost:4e4},icon:"🎪",year:1954},APC:{name:"APC",description:"Transporte de Pessoal Blindado",stats:{armor:15,firepower:10,speed:50,reliability:85,cost:25e3},icon:"🚐",year:1954},IFV:{name:"IFV",description:"Veículo de Combate de Infantaria",stats:{armor:20,firepower:25,speed:45,reliability:80,cost:35e3},icon:"👥",year:1954},TanqueLeve:{name:"Tanque Leve",description:"Tanque leve de reconhecimento e apoio",stats:{armor:30,firepower:35,speed:50,reliability:85,cost:4e4},icon:"🛡️",year:1954},MBT:{name:"MBT",description:"Tanque de Batalha Principal",stats:{armor:50,firepower:50,speed:40,reliability:80,cost:8e4},icon:"🛡️",year:1954},Transporte:{name:"Transporte",description:"Veículo de transporte de pessoal e suprimentos",stats:{armor:5,firepower:0,speed:60,reliability:90,cost:15e3},icon:"🚚",year:1954},Utilitarios:{name:"Utilitários",description:"Veículos utilitários diversos",stats:{armor:5,firepower:0,speed:70,reliability:95,cost:1e4},icon:"🚙",year:1954}},aircraft:{Caca:{name:"Caça",description:"Caça para superioridade aérea",stats:{speed:900,maneuverability:75,firepower:45,range:1200,cost:25e4},icon:"✈️",year:1954},CAS:{name:"CAS",description:"Close Air Support - Apoio aéreo aproximado",stats:{speed:600,maneuverability:60,firepower:70,range:800,cost:18e4},icon:"💣",year:1954},Bomber:{name:"Bomber",description:"Bombardeiro tático",stats:{speed:550,maneuverability:40,firepower:80,range:2500,cost:4e5},icon:"✈️",year:1954},BomberAJato:{name:"Bomber a Jato",description:"Bombardeiro tático a jato",stats:{speed:850,maneuverability:45,firepower:85,range:3e3,cost:6e5},icon:"✈️",year:1954},BomberEstrategico:{name:"Bomber Estratégico",description:"Bombardeiro pesado estratégico",stats:{speed:500,maneuverability:30,firepower:100,range:5e3,cost:9e5},icon:"🛫",year:1954},BomberEstrategicoAJato:{name:"Bomber Estratégico a Jato",description:"Bombardeiro estratégico a jato",stats:{speed:900,maneuverability:35,firepower:105,range:6e3,cost:15e5},icon:"🛫",year:1954},AWAC:{name:"AWAC",description:"Aeronave de alerta e controle antecipado",stats:{speed:600,maneuverability:40,firepower:0,range:4e3,cost:8e5},icon:"📡",year:1954},HeliTransporte:{name:"Helicóptero de Transporte",description:"Helicóptero para transporte de tropas",stats:{speed:250,maneuverability:70,firepower:5,range:400,cost:12e4},icon:"🚁",year:1954},HeliAtaque:{name:"Helicóptero de Ataque",description:"Helicóptero de combate",stats:{speed:280,maneuverability:75,firepower:50,range:500,cost:2e5},icon:"🚁",year:1954},TransporteAereo:{name:"Transporte Aéreo",description:"Aeronave de transporte de passageiros",stats:{speed:500,maneuverability:35,firepower:0,range:3e3,cost:3e5},icon:"✈️",year:1954},Carga:{name:"Aeronave de Carga",description:"Aeronave de transporte de carga pesada",stats:{speed:450,maneuverability:30,firepower:0,range:3500,cost:35e4},icon:"✈️",year:1954}},naval:{PAEsquadra:{name:"PA de Esquadra",description:"Porta-Aviões de Esquadra",stats:{armor:60,firepower:50,speed:32,range:1e4,cost:25e6},icon:"🛩️",year:1954},PAEscolta:{name:"PA de Escolta",description:"Porta-Aviões de Escolta",stats:{armor:40,firepower:35,speed:28,range:8e3,cost:12e6},icon:"🛩️",year:1954},Encouracado:{name:"Encouraçado",description:"Navio de batalha pesado",stats:{armor:95,firepower:100,speed:28,range:8e3,cost:2e7},icon:"⚓",year:1954},CruzadorMisseis:{name:"Cruzador de Mísseis",description:"Cruzador armado com mísseis",stats:{armor:65,firepower:80,speed:32,range:7e3,cost:12e6},icon:"🚢",year:1954},Cruzador:{name:"Cruzador",description:"Cruzador padrão",stats:{armor:60,firepower:70,speed:32,range:6500,cost:8e6},icon:"🚢",year:1954},Fragata:{name:"Fragata",description:"Navio de escolta e patrulha",stats:{armor:35,firepower:45,speed:30,range:5e3,cost:4e6},icon:"🚤",year:1954},Destroyer:{name:"Destroyer",description:"Contratorpedeiro de escolta e ataque",stats:{armor:45,firepower:60,speed:35,range:5500,cost:6e6},icon:"🛥️",year:1954},Submarino:{name:"Submarino",description:"Submarino convencional diesel-elétrico",stats:{armor:20,firepower:70,speed:22,range:8e3,cost:5e6},icon:"🤿",year:1954},SubmarinoBalístico:{name:"Submarino Balístico",description:"Submarino com mísseis balísticos",stats:{armor:25,firepower:90,speed:24,range:1e4,cost:3e7},icon:"🚀",year:1954},SubmarinoNuclear:{name:"Submarino Nuclear",description:"Submarino com propulsão nuclear",stats:{armor:30,firepower:85,speed:32,range:99999,cost:5e7},icon:"☢️",year:1954},TransporteNaval:{name:"Transporte Naval",description:"Navio de transporte de tropas e carga",stats:{armor:15,firepower:10,speed:20,range:7e3,cost:2e6},icon:"🚢",year:1954},Desembarque:{name:"Navio de Desembarque",description:"Navio para operações anfíbias",stats:{armor:25,firepower:25,speed:22,range:6e3,cost:35e5},icon:"⚓",year:1954}}};function R(u,e){return de[u]?.[e]||null}class Be{constructor(){this.selectedCountry=null,this.selectedType="vehicles",this.countries=[],this.currentInventory={}}async initialize(){console.log("⚙️ Inicializando Gerenciador de Equipamentos Genéricos..."),await this.loadCountries(),this.attachButtonListener()}async loadCountries(){try{const e=await p.collection("paises").orderBy("Pais").get();this.countries=e.docs.map(t=>({id:t.id,...t.data()}))}catch(e){console.error("Erro ao carregar países:",e),this.countries=[]}}attachButtonListener(){const e=document.getElementById("open-generic-equipment-manager");e?(e.addEventListener("click",()=>{this.openModal()}),console.log("✅ Gerenciador de Equipamentos Genéricos pronto (botão conectado)")):(console.warn("⚠️ Botão open-generic-equipment-manager não encontrado, tentando novamente..."),setTimeout(()=>this.attachButtonListener(),500))}openModal(){this.renderModal()}renderModal(){const e=document.getElementById("generic-equipment-modal");e&&e.remove();const t=document.createElement("div");t.id="generic-equipment-modal",t.innerHTML=this.getModalHTML(),document.body.appendChild(t),this.setupEventListeners()}closeModal(){const e=document.getElementById("generic-equipment-modal");e&&e.remove()}getModalHTML(){return`
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
    `}getContentHTML(){return this.selectedCountry?`
      <div class="space-y-6">
        <!-- Header do País -->
        <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <h4 class="text-xl font-bold text-slate-100 text-center">${this.countries.find(t=>t.id===this.selectedCountry)?.Pais||"País"}</h4>
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
    `:`
        <div class="text-center py-12 border border-dashed border-slate-700 rounded-xl">
          <span class="text-6xl mb-4 block">🌍</span>
          <p class="text-slate-400">Selecione um país para começar</p>
        </div>
      `}getEquipmentCardsHTML(){const e=de[this.selectedType]||{},t=Object.keys(e);return t.length===0?'<p class="text-slate-400 col-span-full text-center py-8">Nenhum equipamento disponível</p>':t.map(a=>{const o=e[a];return`
        <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-purple-500/50 transition">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-3xl">${o.icon}</span>
            <div class="flex-1">
              <h6 class="font-semibold text-slate-100">${o.name}</h6>
            </div>
          </div>

          <!-- Form para adicionar -->
          <div class="flex gap-2">
            <input
              type="number"
              min="1"
              value="10"
              placeholder="Qtd"
              class="w-24 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-slate-100 text-sm"
              id="qty-${a}"
            >
            <button
              class="add-generic-equipment flex-1 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-semibold text-sm transition"
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
              <p class="font-semibold text-slate-100">${a.name}</p>
            </div>
            <div class="flex items-center gap-3">
              <p class="text-lg font-bold text-purple-400">${a.quantity}x</p>
              <button
                class="edit-generic-qty px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition"
                data-item-id="${t}"
              >
                ✏️
              </button>
              <button
                class="remove-generic-equipment px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm transition"
                data-item-id="${t}"
              >
                🗑️
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `}setupEventListeners(){const e=document.getElementById("close-generic-equipment-modal");e&&e.addEventListener("click",()=>this.closeModal());const t=document.getElementById("generic-equipment-backdrop");t&&t.addEventListener("click",o=>{o.target===t&&this.closeModal()});const a=document.getElementById("generic-country-select");a&&a.addEventListener("change",o=>{this.selectedCountry=o.target.value,this.selectedCountry?this.loadCountryInventory(this.selectedCountry):(this.currentInventory={},this.renderContent())}),document.addEventListener("click",o=>{if(o.target.matches(".generic-type-tab")&&(this.selectedType=o.target.dataset.type,this.renderContent()),o.target.matches(".add-generic-equipment")){const r=o.target.dataset.category,s=o.target.dataset.type,n=document.getElementById(`qty-${r}`),i=parseInt(n?.value||10);i>0&&this.addEquipment(s,r,i)}if(o.target.matches(".edit-generic-qty")){const r=o.target.dataset.itemId;this.editQuantity(r)}if(o.target.matches(".remove-generic-equipment")){const r=o.target.dataset.itemId;this.removeEquipment(r)}o.target.id==="refresh-generic-equipment"&&this.selectedCountry&&this.loadCountryInventory(this.selectedCountry)})}async loadCountryInventory(e){try{const t=await p.collection("paises").doc(e).get();if(!t.exists){this.currentInventory={},this.renderContent();return}const o=t.data().inventario||{};this.currentInventory={},Object.keys(o).forEach(r=>{const s=o[r];if(s>0){let n="vehicles",i=R("vehicles",r);i||(i=R("aircraft",r),n="aircraft"),i||(i=R("naval",r),n="naval"),i&&(this.currentInventory[r]={id:r,category:r,type:n,name:i.name,quantity:s,icon:i.icon})}}),this.renderContent()}catch(t){console.error("Erro ao carregar inventário:",t),alert("Erro ao carregar inventário: "+t.message)}}async addEquipment(e,t,a){if(!this.selectedCountry){alert("Selecione um país primeiro!");return}const o=R(e,t);if(!o){alert("Equipamento não encontrado!");return}try{const r=await p.collection("paises").doc(this.selectedCountry).get();if(!r.exists){alert("País não encontrado!");return}const l=((r.data().inventario||{})[t]||0)+a;await p.collection("paises").doc(this.selectedCountry).update({[`inventario.${t}`]:l}),await this.syncToInventoryCollection(t,o,l),alert(`✅ ${a}x ${o.name} adicionado!
Total agora: ${l}`),await this.loadCountryInventory(this.selectedCountry)}catch(r){console.error("Erro ao adicionar equipamento:",r),alert("Erro ao adicionar equipamento: "+r.message)}}async syncToInventoryCollection(e,t,a){try{const o=p.collection("inventory").doc(this.selectedCountry),r=await o.get(),s={[e]:{name:t.name,quantity:a,icon:t.icon,description:t.description,stats:t.stats,year:t.year,updatedAt:new Date().toISOString()}};r.exists?await o.update(s):await o.set(s)}catch(o){console.error("Erro ao sincronizar com coleção inventory:",o)}}async editQuantity(e){const t=this.currentInventory[e];if(!t)return;const a=prompt(`Nova quantidade para ${t.name}:`,t.quantity);if(a===null)return;const o=parseInt(a);if(isNaN(o)||o<0){alert("Quantidade inválida!");return}try{if(o===0){await this.removeEquipment(e);return}await p.collection("paises").doc(this.selectedCountry).update({[`inventario.${e}`]:o});const r=R(t.type,e);r&&await this.syncToInventoryCollection(e,r,o),alert(`✅ Quantidade atualizada para ${o}`),await this.loadCountryInventory(this.selectedCountry)}catch(r){console.error("Erro ao atualizar quantidade:",r),alert("Erro ao atualizar: "+r.message)}}async removeEquipment(e){const t=this.currentInventory[e];if(t&&confirm(`Remover ${t.name} do inventário?`))try{await p.collection("paises").doc(this.selectedCountry).update({[`inventario.${e}`]:0});const a=p.collection("inventory").doc(this.selectedCountry),o=await a.get();if(o.exists){const r=o.data();if(r[e]){const s={...r};delete s[e],Object.keys(s).length===0?await a.delete():await a.set(s)}}alert(`✅ ${t.name} removido do inventário!`),await this.loadCountryInventory(this.selectedCountry)}catch(a){console.error("Erro ao remover equipamento:",a),alert("Erro ao remover: "+a.message)}}renderContent(){const e=document.getElementById("generic-equipment-content");e&&(e.innerHTML=this.getContentHTML())}}class ke{constructor(){this.countries=[],this.selectedCountry=null,this.originalData=null,this.fieldGetters=new Map,this.hasUnsavedChanges=!1,this.fieldSchema={"geral-politico":{title:"Geral e Político",fields:[{key:"Pais",label:"Nome do País",type:"text",required:!0},{key:"Player",label:"Jogador",type:"text"},{key:"ModeloPolitico",label:"Modelo Político",type:"text"},{key:"Populacao",label:"População",type:"number",min:0,step:1e3},{key:"Estabilidade",label:"Estabilidade (%)",type:"number",min:0,max:100,step:.1},{key:"Burocracia",label:"Burocracia (%)",type:"number",min:0,max:100,step:.1},{key:"Urbanizacao",label:"Urbanização (%)",type:"number",min:0,max:100,step:.1},{key:"Visibilidade",label:"Visibilidade",type:"select",options:["Público","Privado"]}]},"economia-recursos":{title:"Economia e Recursos",fields:[{key:"PIB",label:"PIB Total",type:"calculated",formula:"PIBPerCapita * Populacao"},{key:"PIBPerCapita",label:"PIB per Capita",type:"number",min:0,step:.01},{key:"IndustrialEfficiency",label:"Eficiência Industrial (%)",type:"number",min:0,max:200,step:.1},{key:"PoliticaIndustrial",label:"Política Industrial",type:"select",options:["combustivel","metais","graos","energia","balanceada"]},{key:"BensDeConsumo",label:"Bens de Consumo (estoque)",type:"number",min:0},{key:"OrcamentoGasto",label:"Orçamento Gasto",type:"number",min:0},{key:"TurnoUltimaAtualizacao",label:"Turno Última Atualização",type:"number",min:0,step:1},{key:"Graos",label:"Grãos (estoque)",type:"number",min:0,step:1},{key:"PotencialAgricola",label:"Potencial Agrícola",type:"number",min:0,step:1},{key:"ProducaoGraos",label:"Produção de Grãos (mensal)",type:"number",min:0,step:1},{key:"ConsumoGraos",label:"Consumo de Grãos (mensal)",type:"number",min:0,step:1},{key:"Combustivel",label:"Combustível (estoque)",type:"number",min:0,step:1},{key:"PotencialCombustivel",label:"Potencial de Combustível",type:"number",min:0,step:1},{key:"ProducaoCombustivel",label:"Produção de Combustível (mensal)",type:"number",min:0,step:1},{key:"ConsumoCombustivel",label:"Consumo de Combustível (mensal)",type:"number",min:0,step:1},{key:"CombustivelSaldo",label:"Saldo de Combustível",type:"number",step:1},{key:"Metais",label:"Metais (estoque)",type:"number",step:1},{key:"PotencialMetais",label:"Potencial de Metais",type:"number",min:0,step:1},{key:"ProducaoMetais",label:"Produção de Metais (mensal)",type:"number",min:0,step:1},{key:"ConsumoMetais",label:"Consumo de Metais (mensal)",type:"number",min:0,step:1},{key:"CarvaoSaldo",label:"Saldo de Carvão",type:"number",step:1},{key:"PotencialCarvao",label:"Potencial de Carvão",type:"number",min:0,step:1},{key:"ProducaoCarvao",label:"Produção de Carvão (mensal)",type:"number",min:0,step:1},{key:"ConsumoCarvao",label:"Consumo de Carvão (mensal)",type:"number",min:0,step:1},{key:"Uranio",label:"Urânio (estoque)",type:"number",min:0,step:1},{key:"PotencialUranio",label:"Potencial de Urânio",type:"number",min:0,step:1},{key:"PotencialHidreletrico",label:"Potencial Hidrelétrico",type:"number",min:0,step:1},{key:"BensDeConsumoCalculado",label:"Bens de Consumo (dados calculados)",type:"readonly",description:"Estrutura com demand, production, satisfactionLevel, stabilityEffect"},{key:"ConsumoCalculado",label:"Consumo (dados calculados)",type:"readonly",description:"Estrutura com climateZone, developmentLevel, multiplier"},{key:"ProducaoCalculada",label:"Produção (dados calculados)",type:"readonly",description:"Estrutura com climateZone, developmentLevel, geographicBonuses"}]},energia:{title:"Energia",fields:[{key:"Energia.capacidade",label:"Capacidade de Energia",type:"number",min:0,step:1},{key:"Energia.demanda",label:"Demanda de Energia",type:"number",min:0,step:1},{key:"ProducaoEnergia",label:"Produção de Energia (mensal)",type:"number",min:0,step:1},{key:"ConsumoEnergia",label:"Consumo de Energia (mensal)",type:"number",min:0,step:1},{key:"Energia",label:"Energia (estrutura completa)",type:"readonly",description:"Estrutura complexa com power_plants - use o dashboard para editar"}]},"militar-defesa":{title:"Militar e Defesa",fields:[{key:"WarPower",label:"WarPower",type:"number",min:0,step:.1},{key:"CounterIntelligence",label:"Contra-Inteligência",type:"number",min:0,max:100,step:.1},{key:"Exercito",label:"Exército (total simplificado)",type:"number",min:0,step:1},{key:"Aeronautica",label:"Aeronáutica (total simplificado)",type:"number",min:0,step:1},{key:"Marinha",label:"Marinha (total simplificado)",type:"number",min:0,step:1},{key:"Veiculos",label:"Veículos (total simplificado)",type:"number",min:0,step:1},{key:"inventario.Howitzer",label:"🎖️ Howitzer",type:"number",min:0,step:1},{key:"inventario.SPA",label:"🎖️ SPA (Artilharia Autopropulsada)",type:"number",min:0,step:1},{key:"inventario.Antiaerea",label:"🎖️ Antiaérea",type:"number",min:0,step:1},{key:"inventario.SPAA",label:"🎖️ SPAA",type:"number",min:0,step:1},{key:"inventario.APC",label:"🎖️ APC",type:"number",min:0,step:1},{key:"inventario.IFV",label:"🎖️ IFV",type:"number",min:0,step:1},{key:"inventario.TanqueLeve",label:"🎖️ Tanque Leve",type:"number",min:0,step:1},{key:"inventario.MBT",label:"🎖️ MBT",type:"number",min:0,step:1},{key:"inventario.Transporte",label:"🎖️ Transporte",type:"number",min:0,step:1},{key:"inventario.Utilitarios",label:"🎖️ Utilitários",type:"number",min:0,step:1},{key:"inventario.Caca",label:"✈️ Caça",type:"number",min:0,step:1},{key:"inventario.CAS",label:"✈️ CAS",type:"number",min:0,step:1},{key:"inventario.Bomber",label:"✈️ Bomber",type:"number",min:0,step:1},{key:"inventario.BomberAJato",label:"✈️ Bomber a Jato",type:"number",min:0,step:1},{key:"inventario.BomberEstrategico",label:"✈️ Bomber Estratégico",type:"number",min:0,step:1},{key:"inventario.BomberEstrategicoAJato",label:"✈️ Bomber Estratégico a Jato",type:"number",min:0,step:1},{key:"inventario.AWAC",label:"✈️ AWAC",type:"number",min:0,step:1},{key:"inventario.HeliTransporte",label:"🚁 Helicóptero de Transporte",type:"number",min:0,step:1},{key:"inventario.HeliAtaque",label:"🚁 Helicóptero de Ataque",type:"number",min:0,step:1},{key:"inventario.TransporteAereo",label:"✈️ Transporte Aéreo",type:"number",min:0,step:1},{key:"inventario.Carga",label:"✈️ Aeronave de Carga",type:"number",min:0,step:1},{key:"inventario.PAEsquadra",label:"⚓ PA de Esquadra",type:"number",min:0,step:1},{key:"inventario.PAEscolta",label:"⚓ PA de Escolta",type:"number",min:0,step:1},{key:"inventario.Encouracado",label:"⚓ Encouraçado",type:"number",min:0,step:1},{key:"inventario.CruzadorMisseis",label:"⚓ Cruzador de Mísseis",type:"number",min:0,step:1},{key:"inventario.Cruzador",label:"⚓ Cruzador",type:"number",min:0,step:1},{key:"inventario.Fragata",label:"⚓ Fragata",type:"number",min:0,step:1},{key:"inventario.Destroyer",label:"⚓ Destroyer",type:"number",min:0,step:1},{key:"inventario.Submarino",label:"⚓ Submarino",type:"number",min:0,step:1},{key:"inventario.SubmarinoBalístico",label:"⚓ Submarino Balístico",type:"number",min:0,step:1},{key:"inventario.SubmarinoNuclear",label:"⚓ Submarino Nuclear",type:"number",min:0,step:1},{key:"inventario.TransporteNaval",label:"⚓ Transporte Naval",type:"number",min:0,step:1},{key:"inventario.Desembarque",label:"⚓ Navio de Desembarque",type:"number",min:0,step:1},{key:"exercito.Infantaria",label:"👥 Exército: Infantaria",type:"number",min:0,step:1},{key:"exercito.Artilharia",label:"👥 Exército: Artilharia",type:"number",min:0,step:1},{key:"aeronautica.Caca",label:"👥 Aeronáutica: Caça",type:"number",min:0,step:1},{key:"aeronautica.CAS",label:"👥 Aeronáutica: CAS",type:"number",min:0,step:1},{key:"aeronautica.Bomber",label:"👥 Aeronáutica: Bombardeiro",type:"number",min:0,step:1},{key:"marinha.Fragata",label:"👥 Marinha: Fragata",type:"number",min:0,step:1},{key:"marinha.Destroyer",label:"👥 Marinha: Destroyer",type:"number",min:0,step:1},{key:"marinha.Submarino",label:"👥 Marinha: Submarino",type:"number",min:0,step:1},{key:"marinha.Transporte",label:"👥 Marinha: Transporte",type:"number",min:0,step:1},{key:"arsenal.Nuclear",label:"☢️ Arsenal: Bomba Nuclear",type:"number",min:0,step:1}]},tecnologia:{title:"Tecnologia",fields:[{key:"Tecnologia",label:"Tecnologia Militar (%)",type:"number",min:0,max:100,step:.1},{key:"TecnologiaCivil",label:"Tecnologia Civil (%)",type:"number",min:0,max:100,step:.1}]}},this.elements={}}async initialize(){try{this.cacheElements(),this.setupEventListeners(),await this.loadCountries(),d.info("Editor de País Avançado inicializado")}catch(e){d.error("Erro ao inicializar Editor de País Avançado:",e),h("error","Erro ao inicializar o editor")}}cacheElements(){this.elements={selectCountry:document.getElementById("select-pais-avancado"),btnSave:document.getElementById("btn-salvar-pais-avancado"),editorLoading:document.getElementById("editor-loading"),sections:{"geral-politico":document.getElementById("section-geral-politico"),"economia-recursos":document.getElementById("section-economia-recursos"),energia:document.getElementById("section-energia"),"militar-defesa":document.getElementById("section-militar-defesa"),tecnologia:document.getElementById("section-tecnologia")}}}setupEventListeners(){this.elements.selectCountry&&this.elements.selectCountry.addEventListener("change",()=>{this.onCountryChanged()}),this.elements.btnSave&&this.elements.btnSave.addEventListener("click",()=>{this.saveAllChanges()}),document.addEventListener("input",e=>{e.target.closest("#country-editor-accordion")&&this.markAsChanged()}),window.addEventListener("beforeunload",e=>{if(this.hasUnsavedChanges)return e.preventDefault(),e.returnValue="Você tem alterações não salvas. Deseja realmente sair?",e.returnValue})}async loadCountries(){try{this.countries=await re(),this.countries.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),this.populateCountryDropdown()}catch(e){d.error("Erro ao carregar países:",e),h("error","Erro ao carregar países")}}populateCountryDropdown(){this.elements.selectCountry&&(this.elements.selectCountry.innerHTML='<option value="">Selecione um país...</option>',this.countries.forEach(e=>{const t=document.createElement("option");t.value=e.id,t.textContent=e.Pais||e.id,this.elements.selectCountry.appendChild(t)}))}async onCountryChanged(){const e=this.elements.selectCountry.value;if(!e){this.clearEditor();return}if(this.hasUnsavedChanges&&!await this.confirmDiscard()){this.elements.selectCountry.value=this.selectedCountry?.id||"";return}await this.loadCountryData(e)}async confirmDiscard(){return new Promise(e=>{const t=window.confirm("Você tem alterações não salvas. Deseja descartá-las e continuar?");e(t)})}async loadCountryData(e){try{this.showLoading(!0);const t=await p.collection("paises").doc(e).get();if(!t.exists){h("error","País não encontrado");return}this.selectedCountry={id:t.id,...t.data()},this.originalData=JSON.parse(JSON.stringify(this.selectedCountry)),this.renderAllSections(),this.showLoading(!1),this.hasUnsavedChanges=!1,this.updateSaveButton(),h("success",`País ${this.selectedCountry.Pais} carregado`)}catch(t){d.error("Erro ao carregar dados do país:",t),h("error","Erro ao carregar dados do país"),this.showLoading(!1)}}showLoading(e){this.elements.editorLoading&&(e?(this.elements.editorLoading.style.display="block",Object.values(this.elements.sections).forEach(t=>{t&&(t.innerHTML="")})):this.elements.editorLoading.style.display="none")}clearEditor(){this.selectedCountry=null,this.originalData=null,this.fieldGetters.clear(),this.hasUnsavedChanges=!1,this.updateSaveButton(),Object.values(this.elements.sections).forEach(e=>{e&&(e.innerHTML="")}),this.showLoading(!0)}renderAllSections(){this.fieldGetters.clear(),Object.keys(this.fieldSchema).forEach(e=>{this.renderSection(e)})}renderSection(e){const t=this.fieldSchema[e],a=this.elements.sections[e];!a||!t||(a.innerHTML="",t.fields.forEach(o=>{const r=this.createFieldElement(o);r&&(a.appendChild(r.wrapper),r.getter&&this.fieldGetters.set(o.key,r.getter))}))}createFieldElement(e){const t=document.createElement("div");t.className="space-y-1";const a=document.createElement("label");a.className="block text-xs font-medium text-slate-400",a.textContent=e.label,t.appendChild(a);let o,r;const s=this.getNestedValue(this.selectedCountry,e.key);switch(e.type){case"calculated":o=this.createCalculatedField(e,s),r=()=>this.calculateFieldValue(e);break;case"readonly":o=this.createReadOnlyField(e,s),r=()=>s;break;case"select":o=this.createSelectField(e,s),r=()=>o.value;break;case"number":o=this.createNumberField(e,s),r=()=>{const n=parseFloat(o.value);return isNaN(n)?0:n};break;case"text":default:o=this.createTextField(e,s),r=()=>o.value||"";break}if(e.description){const n=document.createElement("p");n.className="text-xs text-slate-500 italic mt-1",n.textContent=e.description,t.appendChild(n)}return t.appendChild(o),{wrapper:t,getter:r}}createTextField(e,t){const a=document.createElement("input");return a.type="text",a.value=t??"",a.className="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all",a.dataset.fieldKey=e.key,a}createNumberField(e,t){const a=document.createElement("input");return a.type="number",a.value=t??0,a.className="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all",a.dataset.fieldKey=e.key,e.min!==void 0&&(a.min=e.min),e.max!==void 0&&(a.max=e.max),e.step!==void 0&&(a.step=e.step),a}createSelectField(e,t){const a=document.createElement("select");return a.className="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all",a.dataset.fieldKey=e.key,(e.options||[]).forEach(o=>{const r=document.createElement("option");r.value=o,r.textContent=o,t===o&&(r.selected=!0),a.appendChild(r)}),a}createCalculatedField(e,t){const a=document.createElement("div");if(a.className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-2 text-sm text-slate-300 italic",e.key==="PIB"){const o=parseFloat(this.selectedCountry.Populacao)||0,r=parseFloat(this.selectedCountry.PIBPerCapita)||0,s=O(o,r);a.textContent=`${se(s)} (calculado automaticamente)`,a.dataset.calculatedValue=s}else a.textContent="Campo calculado",a.dataset.calculatedValue=t??0;return a.dataset.fieldKey=e.key,a}createReadOnlyField(e,t){const a=document.createElement("div");a.className="w-full rounded-lg bg-slate-700/30 border border-slate-600/50 p-2 text-sm text-slate-400";let o="Não editável aqui";return typeof t=="object"&&t!==null&&(o=`${Object.keys(t).length} itens (use ferramenta específica)`),a.textContent=o,a.dataset.fieldKey=e.key,a}calculateFieldValue(e){if(e.key==="PIB"){const t=this.fieldGetters.get("Populacao")?.()||0,a=this.fieldGetters.get("PIBPerCapita")?.()||0;return O(t,a)}return 0}getNestedValue(e,t){const a=t.split(".");let o=e;for(const r of a){if(o==null)return;o=o[r]}return o}setNestedValue(e,t,a){const o=t.split("."),r=o.pop();let s=e;for(const n of o)(!(n in s)||typeof s[n]!="object")&&(s[n]={}),s=s[n];s[r]=a}markAsChanged(){this.hasUnsavedChanges||(this.hasUnsavedChanges=!0,this.updateSaveButton())}updateSaveButton(){this.elements.btnSave&&(this.hasUnsavedChanges&&this.selectedCountry?(this.elements.btnSave.disabled=!1,this.elements.btnSave.classList.add("shadow-lg","shadow-emerald-500/20")):(this.elements.btnSave.disabled=!0,this.elements.btnSave.classList.remove("shadow-lg","shadow-emerald-500/20")))}async saveAllChanges(){if(!this.selectedCountry){h("error","Nenhum país selecionado");return}try{this.elements.btnSave.disabled=!0,this.elements.btnSave.textContent="💾 Salvando...";const e={};this.fieldGetters.forEach((t,a)=>{const o=this.findFieldDefinition(a);if(o&&(o.type==="readonly"||o.type==="calculated"))return;const r=t();r!==void 0&&this.setNestedValue(e,a,r)}),e.PIBPerCapita!==void 0&&e.Populacao!==void 0&&(e.PIB=O(e.Populacao,e.PIBPerCapita)),this.cleanUndefinedFields(e),await p.collection("paises").doc(this.selectedCountry.id).update(e),Object.assign(this.selectedCountry,e),this.originalData=JSON.parse(JSON.stringify(this.selectedCountry)),this.hasUnsavedChanges=!1,this.updateSaveButton(),h("success",`✅ ${this.selectedCountry.Pais} salvo com sucesso!`),d.info("País atualizado:",this.selectedCountry.id,e)}catch(e){d.error("Erro ao salvar país:",e),h("error",`Erro ao salvar: ${e.message}`)}finally{this.elements.btnSave.disabled=!1,this.elements.btnSave.textContent="💾 Salvar Alterações"}}findFieldDefinition(e){for(const t in this.fieldSchema){const o=this.fieldSchema[t].fields.find(r=>r.key===e);if(o)return o}return null}cleanUndefinedFields(e){Object.keys(e).forEach(t=>{e[t]===void 0?delete e[t]:e[t]!==null&&typeof e[t]=="object"&&!Array.isArray(e[t])&&(this.cleanUndefinedFields(e[t]),Object.keys(e[t]).length===0&&delete e[t])})}}let G=null;async function Te(){return G||(G=new ke,await G.initialize()),G}const D={dependency:{light:.3,moderate:.5,heavy:.7,critical:.85},historyTurns:5,effects:{growth_bonus:{light:.05,moderate:.1,heavy:.15,critical:.2},crisis_impact:{light:.1,moderate:.2,heavy:.35,critical:.5}}};class Le{constructor(){this.dependencyCache=new Map,this.lastCacheUpdate=0,this.cacheTimeout=3e5}async analyzeDependency(e,t,a=!1){try{const o=`${e}-${t}`,r=Date.now();if(!a&&this.dependencyCache.has(o)){const i=this.dependencyCache.get(o);if(r-i.timestamp<this.cacheTimeout)return i.data}const s=await this.getEconomicHistory(e),n=this.calculateDependency(s,t);return this.dependencyCache.set(o,{data:n,timestamp:r}),n}catch(o){throw d.error("Erro ao analisar dependência econômica:",o),o}}async getEconomicHistory(e){try{return(await p.collection("economic_history").where("countryId","==",e).orderBy("turn","desc").limit(D.historyTurns).get()).docs.map(a=>({id:a.id,...a.data()}))}catch(t){return d.error("Erro ao buscar histórico econômico:",t),[]}}calculateDependency(e,t){if(!e||e.length<2)return{level:"none",percentage:0,totalExternal:0,fromInvestor:0,turnsAnalyzed:e.length,riskLevel:"low"};let a=0,o=0,r=0;e.forEach(m=>{m.externalInvestments&&Object.entries(m.externalInvestments).forEach(([g,f])=>{const x=parseFloat(f)||0;a+=x,g===t&&(o+=x,r++)})});const s=a>0?o/a:0,n=r/e.length,i=s*(.5+.5*n);let l="none",c="low";return i>=D.dependency.critical?(l="critical",c="critical"):i>=D.dependency.heavy?(l="heavy",c="high"):i>=D.dependency.moderate?(l="moderate",c="medium"):i>=D.dependency.light&&(l="light",c="low"),{level:l,percentage:i,rawPercentage:s,totalExternal:a,fromInvestor:o,turnsAnalyzed:e.length,turnsWithInvestment:r,consistencyFactor:n,riskLevel:c,growthBonus:D.effects.growth_bonus[l]||0,crisisImpact:D.effects.crisis_impact[l]||0}}async analyzeAllDependencies(e){try{const t=await this.getEconomicHistory(e),a=new Map,o=new Set;t.forEach(s=>{s.externalInvestments&&Object.keys(s.externalInvestments).forEach(n=>{o.add(n)})});for(const s of o){const n=this.calculateDependency(t,s);n.level!=="none"&&a.set(s,n)}const r=Array.from(a.entries()).sort((s,n)=>n[1].percentage-s[1].percentage);return{countryId:e,dependencies:r,totalDependencies:a.size,highestDependency:r[0]||null,riskLevel:this.calculateOverallRisk(r)}}catch(t){throw d.error("Erro ao analisar todas as dependências:",t),t}}calculateOverallRisk(e){if(e.length===0)return"none";const t=e.filter(([,r])=>r.level==="critical").length,a=e.filter(([,r])=>r.level==="heavy").length,o=e.filter(([,r])=>r.level==="moderate").length;return t>0?"critical":a>1||a===1&&o>0?"high":a===1||o>1?"medium":"low"}async checkEconomicCrisis(e){try{const t=await p.collection("paises").doc(e).get();if(!t.exists)return!1;const a=t.data(),o=parseFloat(a.PIB)||0,r=parseFloat(a.Estabilidade)||0,s=await this.getEconomicHistory(e);if(s.length<2)return!1;const n=parseFloat(s[1].results?.newPIB||a.PIB),i=(o-n)/n;return{isCrisis:i<-.15||r<25||i<-.05&&r<40,pibChange:i,stability:r,severity:this.calculateCrisisSeverity(i,r)}}catch(t){return d.error("Erro ao verificar crise econômica:",t),!1}}calculateCrisisSeverity(e,t){let a=0;return e<-.3?a+=3:e<-.2?a+=2:e<-.1&&(a+=1),t<20?a+=3:t<35?a+=2:t<50&&(a+=1),a>=5?"severe":a>=3?"moderate":a>=1?"mild":"none"}async applyDependencyCrisisEffects(e){try{const t=await this.checkEconomicCrisis(e);if(!t.isCrisis)return[];const a=[],o=await p.collection("paises").get();for(const r of o.docs){const s=r.id;if(s===e)continue;const n=await this.analyzeDependency(s,e);if(n.level!=="none"){const i=r.data(),l=parseFloat(i.PIB)||0,c=n.crisisImpact*t.severity==="severe"?1.5:1,m=l*c,g=l-m;await p.collection("paises").doc(s).update({PIB:g,TurnoUltimaAtualizacao:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}),a.push({countryId:s,countryName:i.Pais,dependencyLevel:n.level,pibLoss:m,newPIB:g,impact:c*100})}}return a}catch(t){throw d.error("Erro ao aplicar efeitos de crise de dependência:",t),t}}generateDependencyReport(e){const{countryId:t,dependencies:a,riskLevel:o}=e;return{summary:this.generateSummaryText(a,o),recommendations:this.generateRecommendations(a,o),riskMatrix:a.map(([s,n])=>({investor:s,level:n.level,percentage:n.percentage,risk:n.riskLevel,growthBonus:n.growthBonus,crisisImpact:n.crisisImpact}))}}generateSummaryText(e,t){if(e.length===0)return"País mantém independência econômica total. Sem dependências externas significativas.";const a=e.length,o=e.filter(([,n])=>n.level==="critical").length,r=e.filter(([,n])=>n.level==="heavy").length;let s=`País possui ${a} dependência${a>1?"s":""} econômica${a>1?"s":""}.`;return o>0&&(s+=` ${o} crítica${o>1?"s":""}.`),r>0&&(s+=` ${r} pesada${r>1?"s":""}.`),s+=` Risco geral: ${t}.`,s}generateRecommendations(e,t){const a=[];(t==="critical"||t==="high")&&(a.push("Diversificar fontes de investimento externo urgentemente."),a.push("Aumentar investimentos internos para reduzir dependência.")),e.length>3&&a.push("Consolidar parcerias econômicas para reduzir complexidade.");const o=e.filter(([,r])=>r.level==="critical");return o.length>0&&a.push(`Negociar maior autonomia com ${o[0][0]} devido à dependência crítica.`),a.length===0&&a.push("Manter diversificação atual de investimentos externos."),a}clearCache(){this.dependencyCache.clear(),this.lastCacheUpdate=0}}const Me=new Le,F={growth:{excellent:["✨ **Crescimento Excepcional!** A economia nacional floresceu sob suas políticas visionárias.","🚀 **Boom Econômico!** Seus investimentos estratégicos criaram um círculo virtuoso de prosperidade.","⭐ **Era Dourada!** O país vivencia seu melhor período econômico em décadas."],good:["✅ **Crescimento Sólido** A diversificação econômica está dando frutos positivos.","📈 **Progresso Sustentável** Suas reformas econômicas mostram resultados consistentes.","💪 **Economia Resiliente** O país demonstra capacidade de crescimento estável."],moderate:["📊 **Crescimento Moderado** A economia mantém trajetória de expansão cautelosa.","⚖️ **Desenvolvimento Equilibrado** O país avança de forma sustentada, sem riscos.","🎯 **Metas Atingidas** Os objetivos econômicos estão sendo cumpridos gradualmente."],poor:["⚠️ **Crescimento Limitado** A economia enfrenta desafios que impedem maior expansão.","🔄 **Ajustes Necessários** É preciso revisar as estratégias de investimento atuais.","📉 **Potencial Não Realizado** O país possui capacidade para crescimento maior."],negative:["🚨 **Recessão Econômica** A economia nacional enfrenta sérias dificuldades.","⛈️ **Crise Econômica** Políticas de emergência são necessárias para estabilização.","🆘 **Situação Crítica** Reformas estruturais urgentes são essenciais para recuperação."]},inflation:{low:["💡 **Gestão Eficiente** Seus investimentos foram bem planejados, com baixa inflação.","🎯 **Precisão Econômica** A estratégia de diversificação evitou pressões inflacionárias.","⚡ **Investimento Inteligente** A alocação equilibrada de recursos maximizou a eficiência."],moderate:["⚠️ **Inflação Controlável** Há sinais de aquecimento econômico que requerem atenção.","🌡️ **Economia Aquecida** O volume de investimentos está criando pressões de preços.","⚖️ **Equilíbrio Delicado** É preciso balancear crescimento com estabilidade de preços."],high:["🔥 **Alta Inflação** O excesso de investimentos está criando desequilíbrios econômicos.","⛔ **Superaquecimento** A economia precisa de políticas de resfriamento urgentes.","📈 **Pressão de Preços** A concentração de gastos está gerando inflação preocupante."],severe:["🚨 **Hiperinflação Ameaça** Os investimentos excessivos criaram uma crise inflacionária.","💥 **Colapso de Preços** A estratégia econômica resultou em instabilidade monetária severa.","🌪️ **Descontrole Inflacionário** Medidas de emergência são necessárias imediatamente."]},chains:["🔗 **Sinergia Perfeita!** A combinação de infraestrutura e indústria potencializou o crescimento.","⚙️ **Engrenagem Eficiente** Pesquisa & Desenvolvimento impulsionou a modernização industrial.","🧬 **DNA de Inovação** A integração entre ciência e políticas sociais criou resultados excepcionais.","🏗️ **Base Sólida** Investimentos em infraestrutura criaram fundações para expansão industrial.","🔬 **Revolução Científica** P&D transformou o panorama tecnológico e social do país."],dependency:{created:["🤝 **Nova Parceria** Sua cooperação com {investor} fortaleceu os laços econômicos.","🌍 **Integração Internacional** Os investimentos externos expandiram horizontes econômicos.","💼 **Diplomacia Econômica** A parceria internacional traz benefícios mútuos."],increased:["📈 **Dependência Crescente** Sua economia está cada vez mais integrada com {investor}.","⚠️ **Atenção Necessária** A dependência de {investor} requer monitoramento cuidadoso.","🔄 **Diversificação Recomendada** Considere expandir parcerias para reduzir riscos."],critical:["🚨 **Dependência Crítica** Sua economia tornou-se vulnerável às crises de {investor}.","⛔ **Risco Elevado** A dependência excessiva de {investor} compromete a autonomia nacional.","🆘 **Alerta Máximo** É urgente diversificar fontes de investimento externo."]},external_actions:["🌐 **Influência Internacional** Seus investimentos em {target} fortalecem sua posição geopolítica.","🤝 **Soft Power** A ajuda econômica a {target} amplia sua influência regional.","💰 **Diplomacia do Dólar** Os investimentos externos são uma ferramenta de política externa eficaz.","🌟 **Liderança Global** Sua capacidade de investir no exterior demonstra força econômica.","⚖️ **Responsabilidade Internacional** Os investimentos externos equilibram desenvolvimento e cooperação."],stability:["🏥 **Bem-Estar Social** Investimentos em saúde e educação fortalecem a coesão nacional.","👥 **Harmonia Social** Políticas sociais reduzem tensões e aumentam a estabilidade.","🛡️ **Resiliência Nacional** A estabilidade política é a base para crescimento sustentado.","🕊️ **Paz Social** Investimentos sociais criam um ambiente favorável ao desenvolvimento."],rejection:["😠 **Resistência Popular** A população de {target} vê seus investimentos como ingerência externa.","🗳️ **Tensão Política** Os investimentos em {target} geraram protestos e instabilidade.","🚫 **Rejeição Nacional** {target} demonstra resistência crescente à sua influência econômica.","⚡ **Conflito Diplomático** Os investimentos externos criaram atritos internacionais."]};class De{async generatePlayerFeedback(e,t,a){try{const o={countryId:e,turn:this.getCurrentTurn(),timestamp:new Date,mainMessage:"",details:[],warnings:[],achievements:[],recommendations:[]},r=this.generateGrowthFeedback(t);o.mainMessage=r.message,r.achievement&&o.achievements.push(r.achievement);const s=this.generateInflationFeedback(t);if(s&&o.details.push(s),t.productiveChains.length>0){const c=this.generateChainFeedback(t.productiveChains);o.details.push(c)}const n=a.filter(c=>c.isExternal);if(n.length>0){const c=await this.generateExternalFeedback(n,e);o.details.push(...c)}const i=await this.generateDependencyFeedback(e);i&&o.warnings.push(...i);const l=this.generateStrategicRecommendations(t,a);return o.recommendations.push(...l),await this.saveFeedback(o),o}catch(o){throw d.error("Erro ao gerar feedback do player:",o),o}}generateGrowthFeedback(e){const t=e.finalGrowth/e.newPIB*100;let a,o=null;t>=15?(a="excellent",o="🏆 **Milagre Econômico** - Crescimento excepcional de mais de 15%"):t>=8?(a="good",o="🥇 **Crescimento Exemplar** - Expansão econômica robusta"):t>=3?a="moderate":t>=0?a="poor":a="negative";const r=F.growth[a];return{message:this.randomChoice(r),achievement:o}}generateInflationFeedback(e){const t=e.totalInflation*100;let a;if(t>=60?a="severe":t>=35?a="high":t>=15?a="moderate":a="low",a==="low")return null;const o=F.inflation[a];return this.randomChoice(o)}generateChainFeedback(e){e.map(a=>a.name).join(", ");let t=this.randomChoice(F.chains);return e.some(a=>a.name.includes("Infraestrutura"))?t="🔗 **Sinergia Infraestrutural** A base sólida potencializou outros setores da economia.":e.some(a=>a.name.includes("P&D"))&&(t="🧬 **Inovação Integrada** Pesquisa & Desenvolvimento revolucionou múltiplos setores."),t}async generateExternalFeedback(e,t){const a=[];for(const o of e){if(!o.targetCountry)continue;const r=await this.getCountryData(o.targetCountry);if(!r)continue;if(this.checkRejectionRisk(o,r).hasRisk){const n=this.randomChoice(F.rejection).replace("{target}",r.Pais||o.targetCountry);a.push(n)}else{const n=this.randomChoice(F.external_actions).replace("{target}",r.Pais||o.targetCountry);a.push(n)}}return a}async generateDependencyFeedback(e){try{const t=await Me.analyzeAllDependencies(e),a=[];if(t.dependencies.length===0)return null;const o=t.dependencies.filter(([,s])=>s.level==="critical"),r=t.dependencies.filter(([,s])=>s.level==="heavy");for(const[s,n]of o){const i=await this.getCountryData(s),l=this.randomChoice(F.dependency.critical).replace("{investor}",i?.Pais||s);a.push(l)}for(const[s,n]of r.slice(0,2)){const i=await this.getCountryData(s),l=this.randomChoice(F.dependency.increased).replace("{investor}",i?.Pais||s);a.push(l)}return a}catch(t){return d.error("Erro ao gerar feedback de dependência:",t),null}}generateStrategicRecommendations(e,t){const a=[],o=e.totalInflation*100,r=t.some(n=>n.isExternal),s=[...new Set(t.map(n=>n.type))];return o>40?a.push("💡 **Sugestão:** Reduza o volume de investimentos no próximo turno para controlar a inflação."):o<5&&a.push("💡 **Oportunidade:** Sua economia pode absorver mais investimentos sem riscos inflacionários."),s.length<=2&&a.push("🎯 **Estratégia:** Diversifique os tipos de investimento para ativar cadeias produtivas."),!r&&e.finalGrowth>0?a.push("🌍 **Diplomacia:** Considere investimentos externos para expandir sua influência internacional."):r&&t.filter(n=>n.isExternal).length>=3&&a.push("🏠 **Foco Interno:** Balance investimentos externos com desenvolvimento interno."),e.productiveChains.length===0&&a.push("🔗 **Sinergia:** Combine diferentes tipos de investimento para ativar bônus de cadeias produtivas."),a.slice(0,3)}checkRejectionRisk(e,t){const a=parseFloat(t.Estabilidade)||0,o=parseFloat(t.PIB)||1,s=(parseFloat(e.value)||0)*1e6/o;return{hasRisk:a<40&&s>.1,riskLevel:s>.2?"high":"medium"}}async saveFeedback(e){try{await p.collection("player_feedback").doc().set({...e,createdAt:new Date}),d.info(`Feedback salvo para país ${e.countryId}`)}catch(t){throw d.error("Erro ao salvar feedback:",t),t}}async getPlayerFeedback(e,t=5){try{return(await p.collection("player_feedback").where("countryId","==",e).orderBy("turn","desc").limit(t).get()).docs.map(o=>({id:o.id,...o.data()}))}catch(a){return d.error("Erro ao buscar feedback do player:",a),[]}}randomChoice(e){return e[Math.floor(Math.random()*e.length)]}getCurrentTurn(){return parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}async getCountryData(e){try{const t=await p.collection("paises").doc(e).get();return t.exists?t.data():null}catch(t){return d.error("Erro ao buscar dados do país:",t),null}}formatFeedbackForDisplay(e){let t=`
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
      `),t+="</div>",t}}const Fe=new De,A={maxInternalActions:10,maxExternalActions:3,actionTypes:{infrastructure:{id:"infrastructure",name:"🏗️ Infraestrutura",multiplier:1.3,description:"Estradas, energia, telecomunicações",bonusCondition:"urbanization > 50",bonusValue:.4,examples:["Construção de rodovias","Expansão da rede elétrica","Fibra óptica nacional"]},research:{id:"research",name:"🔬 Pesquisa & Desenvolvimento",multiplier:1.8,description:"Universidades, inovação científica",bonusCondition:"technology > 60",bonusValue:.5,examples:["Centros de pesquisa","Universidades tecnológicas","Programas de inovação"]},industry:{id:"industry",name:"🏭 Desenvolvimento Industrial",multiplier:1.6,description:"Fábricas, refinarias",bonusValue:.5,penaltyCondition:"stability < 40",penaltyValue:.15,examples:["Complexos industriais","Refinarias de petróleo","Siderúrgicas"]},exploration:{id:"exploration",name:"⛏️ Exploração de Recursos",multiplier:.8,description:"Exploração mineral e de recursos primários. Gera menos crescimento econômico que outras ações, mas adiciona recursos ao estoque do país.",examples:["Exploração de jazidas","Perfuração de poços","Mineração"]},social:{id:"social",name:"🏥 Investimento Social",multiplier:1.1,description:"Saúde, educação, habitação",stabilityBonus:1,examples:["Hospitais públicos","Escolas técnicas","Programas habitacionais"]}},productiveChains:{"infrastructure+industry":{name:"Infraestrutura + Indústria",bonus:.15,effect:"Elimina penalidade de estabilidade se < 50",description:"Infraestrutura potencializa desenvolvimento industrial"},"research+industry":{name:"P&D + Indústria",bonus:.1,effect:"+1 ponto adicional de tecnologia",description:"Inovação acelera crescimento industrial"},"research+social":{name:"P&D + Social",socialBonus:.2,effect:"+1 ponto adicional de tecnologia",description:"Pesquisa melhora políticas sociais"}}};class Ve{constructor(){this.countries=[],this.selectedCountry=null,this.currentBudget=0,this.actions={internal:[],external:[]},this.economicHistory=new Map,this.changes={technology:{},indicators:{}}}async initialize(){try{d.info("Inicializando Sistema Econômico..."),await this.loadCountries(),await this.loadEconomicHistory(),this.setupEventListeners(),d.info("Sistema Econômico inicializado com sucesso")}catch(e){throw d.error("Erro ao inicializar Sistema Econômico:",e),e}}async loadCountries(){try{this.countries=await re(),this.countries.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),d.info(`${this.countries.length} países carregados`)}catch(e){throw d.error("Erro ao carregar países no EconomicSimulator:",e),e}}async loadEconomicHistory(){try{(await p.collection("economic_history").get()).docs.forEach(t=>{const a=t.data(),o=a.countryId;this.economicHistory.has(o)||this.economicHistory.set(o,[]),this.economicHistory.get(o).push({turn:a.turn,totalInvestment:a.totalInvestment,externalInvestments:a.externalInvestments||{},results:a.results})}),d.info("Histórico econômico carregado")}catch(e){d.warn("Erro ao carregar histórico econômico:",e)}}setupEventListeners(){const e=document.getElementById("economic-simulator");e&&e.addEventListener("click",()=>this.showModal())}showModal(){if(!this.selectedCountry){const e=document.getElementById("select-pais")?.value;this.selectedCountry=e||(this.countries.length>0?this.countries[0].id:null)}if(!this.selectedCountry){h("warning","Nenhum país disponível");return}this.createModal()}createModal(){const e=this.getCountryById(this.selectedCountry);if(!e)return;this.currentBudget=this.calculateBudget(e);const t=document.createElement("div");t.className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",t.id="economic-simulator-modal";const a=document.createElement("div");a.className="bg-slate-800 border border-slate-600/70 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col",a.innerHTML=`
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
    `}createActionSlots(e){const t=e==="internal"?A.maxInternalActions:A.maxExternalActions,a=this.actions[e];let o="";for(let r=0;r<a.length;r++)o+=this.createActionSlot(e,r,a[r]);return a.length<t&&(o+=this.createActionSlot(e,a.length,null)),o}createActionSlot(e,t,a=null){const o=e==="external",r=a?.type==="exploration",s=A.actionTypes;return`
      <div class="action-slot border border-slate-600/50 rounded-lg p-4" data-type="${e}" data-index="${t}">
        <div class="grid grid-cols-1 md:grid-cols-${o?"6":"5"} gap-4 items-end">

          <!-- Tipo de Ação -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Tipo de Ação</label>
            <select class="action-type w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              ${Object.values(s).map(n=>`
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
          <div class="resource-type-selector ${r?"":"hidden"}">
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
        <div class="extraction-preview mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg ${r?"":"hidden"}">
          <div class="text-xs text-emerald-300">
            <strong>Extração Estimada:</strong> <span class="extraction-amount">Aguardando dados...</span>
          </div>
        </div>
      </div>
    `}setupModalEventListeners(){const e=document.getElementById("economic-simulator-modal");if(!e)return;e.querySelector("#close-economic-modal").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",a=>{a.target===e&&e.remove()}),e.querySelector("#modal-country-select").addEventListener("change",a=>{this.selectedCountry=a.target.value,this.resetActions(),e.remove(),this.showModal()});const t=e.querySelector("#modal-industrial-policy");t&&t.addEventListener("change",a=>{const o=this.getCountryById(this.selectedCountry);if(o){o.PoliticaIndustrial=a.target.value;try{p.collection("paises").doc(this.selectedCountry).update({PoliticaIndustrial:a.target.value})}catch(r){console.warn("Erro ao salvar PoliticaIndustrial:",r)}}}),e.querySelectorAll(".economic-tab").forEach(a=>{a.addEventListener("click",o=>{this.switchTab(o.target.dataset.tab)})}),e.querySelector("#add-internal-action")?.addEventListener("click",()=>{this.addAction("internal")}),e.querySelector("#add-external-action")?.addEventListener("click",()=>{this.addAction("external")}),e.querySelector("#reset-economic-actions")?.addEventListener("click",()=>{this.resetActions()}),e.querySelector("#apply-economic-actions")?.addEventListener("click",()=>{this.applyEconomicActions()}),this.setupActionFieldListeners()}setupActionFieldListeners(){const e=document.getElementById("economic-simulator-modal");e&&(e.addEventListener("input",t=>{if(t.target.matches(".action-type, .target-country, .action-value, .action-dice, .action-buff, .resource-type")){const a=t.target.closest(".action-slot"),o=a.dataset.type,r=parseInt(a.dataset.index);this.updateActionFromSlot(o,r,a),this.updatePreview(a),this.updateBudgetBar(),this.updateSummary()}}),e.addEventListener("click",t=>{if(t.target.matches(".remove-action")){const a=t.target.closest(".action-slot"),o=a.dataset.type,r=parseInt(a.dataset.index);this.removeAction(o,r)}}),e.addEventListener("change",t=>{t.target.matches(".action-type")&&(this.toggleActionDescription(t.target),this.toggleResourceSelector(t.target))}),e.querySelectorAll(".economy-subtab").forEach(t=>{t.addEventListener("click",a=>{const o=a.target.dataset.subtab;this.switchEconomySubtab(o)})}),e.addEventListener("click",t=>{if(t.target.matches(".tech-increment")){const a=t.target.dataset.field;this.adjustTechnology(a,1)}else if(t.target.matches(".tech-decrement")){const a=t.target.dataset.field;this.adjustTechnology(a,-1)}}),e.addEventListener("input",t=>{if(t.target.matches(".tech-input")){const a=t.target.dataset.field,o=parseInt(t.target.value)||0;this.changes.technology[a]=o,this.updateTechPreview(a),this.updateSummary()}}),e.addEventListener("click",t=>{if(t.target.matches(".indicator-increment")){const a=t.target.dataset.field;this.adjustIndicator(a,1)}else if(t.target.matches(".indicator-decrement")){const a=t.target.dataset.field;this.adjustIndicator(a,-1)}}),e.addEventListener("input",t=>{if(t.target.matches(".indicator-input")){const a=t.target.dataset.field,o=parseFloat(t.target.value)||0;this.changes.indicators[a]=o,this.updateIndicatorPreview(a),this.updateSummary()}}))}calculateBudget(e){return Ce(e)}formatCurrency(e){return se(e)}getCountryById(e){return this.countries.find(t=>t.id===e)}switchTab(e){const t=document.getElementById("economic-simulator-modal");if(!t)return;t.querySelectorAll(".economic-tab").forEach(r=>{r.classList.remove("border-purple-500","text-purple-400","bg-slate-700/30"),r.classList.add("border-transparent","text-slate-400")}),t.querySelectorAll(".economic-tab-content").forEach(r=>{r.classList.add("hidden")});const a=t.querySelector(`[data-tab="${e}"]`),o=t.querySelector(`#economic-tab-${e}`);a&&o&&(a.classList.add("border-purple-500","text-purple-400","bg-slate-700/30"),a.classList.remove("border-transparent","text-slate-400"),o.classList.remove("hidden")),e==="summary"&&this.updateSummary()}addAction(e){const t=e==="internal"?A.maxInternalActions:A.maxExternalActions;if(this.actions[e].length>=t){h("warning",`Máximo de ${t} ações ${e==="internal"?"internas":"externas"} atingido`);return}this.actions[e].push({type:"",value:0,dice:0,buff:0,targetCountry:e==="external"?"":null}),this.recreateActionSlots(e),this.updateTabCounters()}removeAction(e,t){t>=0&&t<this.actions[e].length&&(this.actions[e].splice(t,1),this.recreateActionSlots(e),this.updateTabCounters(),this.updateBudgetBar(),this.updateSummary())}recreateActionSlots(e){const t=document.getElementById(`${e}-actions-container`);t&&(t.innerHTML=this.createActionSlots(e))}updateActionFromSlot(e,t,a){this.actions[e][t]||(this.actions[e][t]={});const o=this.actions[e][t];o.type=a.querySelector(".action-type")?.value||"",o.value=parseFloat(a.querySelector(".action-value")?.value)||0,o.dice=parseInt(a.querySelector(".action-dice")?.value)||0,o.buff=parseFloat(a.querySelector(".action-buff")?.value)||0,o.isExternal=e==="external",e==="external"&&(o.targetCountry=a.querySelector(".target-country")?.value||""),o.type==="exploration"&&(o.resourceType=a.querySelector(".resource-type")?.value||"");const r=a.querySelector(".buff-value");r&&(r.textContent=o.buff),o.type==="exploration"&&this.updateExtractionPreview(a,o)}updatePreview(e){const t=e.dataset.type,a=parseInt(e.dataset.index),o=this.actions[t][a];if(!o||!o.type||!o.value||!o.dice){e.querySelector(".growth-preview").textContent="+0.0%";return}const r=this.getCountryById(this.selectedCountry);if(r)try{let s;if(o.type==="exploration"&&o.resourceType){const c={Combustivel:"CombustivelProducao",Carvao:"CarvaoProducao",Metais:"MetaisProducao"}[o.resourceType],m=parseFloat(r[c])||1,f=A.actionTypes[o.type]?.multiplier||.8;s=(o.value/m*f*100).toFixed(2)}else s=(M.calculateBaseGrowth(o,r).preInflationGrowth*100).toFixed(2);const n=e.querySelector(".growth-preview");n.textContent=`+${s}%`,n.className="growth-preview text-xs text-center px-2 py-1 rounded";const i=parseFloat(s);i>1?n.classList.add("bg-emerald-700","text-emerald-200"):i>0?n.classList.add("bg-blue-700","text-blue-200"):i===0?n.classList.add("bg-yellow-700","text-yellow-200"):n.classList.add("bg-red-700","text-red-200")}catch(s){d.error("Erro no preview:",s),e.querySelector(".growth-preview").textContent="Erro"}}updateBudgetBar(){const e=[...this.actions.internal,...this.actions.external].reduce((n,i)=>n+(parseFloat(i.value)||0),0),t=this.formatCurrency(e*1e6),a=Math.min(e*1e6/this.currentBudget*100,100),o=document.getElementById("budget-used"),r=document.getElementById("budget-bar"),s=document.getElementById("apply-economic-actions");if(o&&(o.textContent=t),r&&(r.style.width=`${a}%`,r.className="h-2 rounded-full transition-all",a>90?r.classList.add("bg-gradient-to-r","from-red-500","to-red-600"):a>70?r.classList.add("bg-gradient-to-r","from-yellow-500","to-orange-500"):r.classList.add("bg-gradient-to-r","from-emerald-500","to-green-500")),s){const n=[...this.actions.internal,...this.actions.external].some(l=>l.type&&l.value>0&&l.dice>0),i=e*1e6>this.currentBudget;s.disabled=!n||i,i?s.textContent="❌ Orçamento Excedido":n?s.textContent="⚡ Aplicar Investimentos":s.textContent="⏳ Configure as Ações"}}updateTabCounters(){const e=document.querySelector('[data-tab="internal"]'),t=document.querySelector('[data-tab="external"]');e&&(e.innerHTML=`🏠 Ações Internas (${this.actions.internal.length}/${A.maxInternalActions})`),t&&(t.innerHTML=`🌍 Ações Externas (${this.actions.external.length}/${A.maxExternalActions})`)}updateSummary(){const e=document.getElementById("economic-summary-content");if(!e)return;const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=[...this.actions.internal,...this.actions.external].filter(n=>n.type&&n.value>0),o=Object.values(this.changes.technology).some(n=>n!==0),r=Object.values(this.changes.indicators).some(n=>n!==0);if(!(a.length>0||o||r)){e.innerHTML=`
        <div class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-4">📊</div>
          <div class="text-lg mb-2">Nenhuma mudança configurada</div>
          <div class="text-sm">Configure ações econômicas, tecnologia, recursos ou indicadores para ver o resumo</div>
        </div>
      `;return}try{let n=null;if(a.length>0){const i={};a.filter(l=>l.isExternal).forEach(l=>{l.targetCountry&&(i[l.targetCountry]=this.getCountryById(l.targetCountry))}),n=M.processAllActions(a,t,i)}e.innerHTML=this.createSummaryHTML(n,t)}catch(n){d.error("Erro ao atualizar resumo:",n),e.innerHTML=`
        <div class="text-center py-12 text-red-400">
          <div class="text-4xl mb-4">❌</div>
          <div class="text-lg mb-2">Erro no cálculo</div>
          <div class="text-sm">Verifique se todas as ações estão configuradas corretamente</div>
        </div>
      `}}createSummaryHTML(e,t){let a='<div class="space-y-6">';if(e){parseFloat(t.PIB);const s=(e.finalGrowth*100).toFixed(2),n=(e.totalGrowth*100).toFixed(2),i=(e.totalInflation*100).toFixed(1);a+=`
        <!-- Resultado Principal -->
        <div class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">💰 Impacto Econômico</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-lg font-bold text-slate-300">${K(parseFloat(t.PIBPerCapita)||0)}</div>
              <div class="text-xs text-slate-400 mt-1">PIB per Capita</div>
            </div>
            
            <div class="text-center">
              <div class="text-lg font-bold text-emerald-400">${K(e.newPIBPerCapita)}</div>
              <div class="text-xs text-slate-400 mt-1">Novo PIB per Capita</div>
            </div>
            
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">+${s}%</div>
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
            ${e.actions.map(l=>{const c=(l.preInflationGrowth*100).toFixed(3),m=A.actionTypes[l.type],g=l.dice>5,f=l.dice===4||l.dice===5;return`
                <div class="flex items-center justify-between p-3 rounded-lg ${g?"bg-emerald-900/20 border border-emerald-500/30":l.dice<=3?"bg-red-900/20 border border-red-500/30":f?"bg-yellow-900/20 border border-yellow-500/30":"bg-slate-700/30 border border-slate-600/30"}">
                  <div class="flex-1">
                    <div class="font-medium text-slate-200">
                      ${m?.name||l.type} 
                      ${l.isExternal?`→ ${this.getCountryById(l.targetCountry)?.Pais||"País"}`:""}
                    </div>
                    <div class="text-sm text-slate-400">
                      ${this.formatCurrency(l.value*1e6)} • Dado: ${l.dice}/12
                      ${l.buff!==0?` • Buff: ${l.buff>0?"+":""}${l.buff}%`:""}
                      ${l.chainBonus?` • Cadeia: +${(l.chainBonus*100).toFixed(0)}%`:""}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold ${g?"text-emerald-400":l.dice<=3?"text-red-400":f?"text-yellow-400":"text-slate-400"}">
                      ${parseFloat(c)>=0?"+":""}${c}%
                    </div>
                    <div class="text-xs text-slate-500">
                      +${K(l.preInflationGrowth*(parseFloat(t.PIBPerCapita)||0))}
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
              ${e.productiveChains.map(l=>`
                <div class="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div>
                    <div class="font-medium text-blue-200">${l.name}</div>
                    <div class="text-sm text-blue-300">${l.description}</div>
                  </div>
                  <div class="text-blue-400 font-semibold">+${(l.bonus*100).toFixed(0)}%</div>
                </div>
              `).join("")}
            </div>
          </div>
        `:""}

      `}const o=Object.values(this.changes.technology).some(s=>s!==0);o&&(a+=`
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">🔬 Mudanças em Tecnologia</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.technology).filter(([s,n])=>n!==0).map(([s,n])=>{const i=parseFloat(t[s])||0,l=Math.max(0,i+n),c={Tecnologia:"Tecnologia Civil",Aeronautica:"Aeronáutica",Marinha:"Marinha",Veiculos:"Veículos",Exercito:"Exército"};return`
                  <div class="flex items-center justify-between p-3 rounded-lg ${n>0?"bg-emerald-900/20 border border-emerald-500/30":"bg-red-900/20 border border-red-500/30"}">
                    <div class="text-slate-200">${c[s]||s}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${i} → ${l}</div>
                      <div class="font-semibold ${n>0?"text-emerald-400":"text-red-400"}">${n>0?"+":""}${n}</div>
                    </div>
                  </div>
                `}).join("")}
          </div>
        </div>
      `);const r=Object.values(this.changes.indicators).some(s=>s!==0);return r&&(a+=`
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">📊 Mudanças em Indicadores</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.indicators).filter(([s,n])=>n!==0).map(([s,n])=>{const i=parseFloat(t[s])||0,l=Math.min(100,Math.max(0,i+n)),c={Estabilidade:"Estabilidade",Burocracia:"Burocracia",Urbanizacao:"Urbanização",IndustrialEfficiency:"Eficiência Industrial"};return`
                  <div class="flex items-center justify-between p-3 rounded-lg ${n>0?"bg-emerald-900/20 border border-emerald-500/30":"bg-red-900/20 border border-red-500/30"}">
                    <div class="text-slate-200">${c[s]||s}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${i}% → ${l}%</div>
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
          ${e?.actions.some(s=>s.isExternal)?"<div>• Ações externas afetarão os países de destino</div>":""}
          ${o?"<div>• Valores de tecnologia serão atualizados</div>":""}
          ${hasResourceChanges?"<div>• Recursos serão modificados</div>":""}
          ${r?"<div>• Indicadores nacionais serão alterados</div>":""}
        </div>
      </div>
    </div>
    `,a}switchEconomySubtab(e){const t=document.getElementById("economic-simulator-modal");t&&(t.querySelectorAll(".economy-subtab").forEach(a=>{a.dataset.subtab===e?(a.classList.remove("bg-slate-700","text-slate-300"),a.classList.add("bg-purple-600","text-white")):(a.classList.remove("bg-purple-600","text-white"),a.classList.add("bg-slate-700","text-slate-300"))}),t.querySelectorAll(".economy-subtab-content").forEach(a=>{a.classList.add("hidden")}),t.querySelector(`#economy-subtab-${e}`)?.classList.remove("hidden"))}adjustTechnology(e,t){this.changes.technology[e]=(this.changes.technology[e]||0)+t;const a=document.querySelector(`.tech-input[data-field="${e}"]`);a&&(a.value=this.changes.technology[e]),this.updateTechPreview(e),this.updateSummary()}updateTechPreview(e){const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=parseFloat(t[e])||0,o=this.changes.technology[e]||0,r=Math.max(0,a+o),s=document.querySelector(`.tech-preview[data-field="${e}"]`);s&&(s.textContent=r)}adjustIndicator(e,t){const a=this.getCountryById(this.selectedCountry);if(!a)return;const o=parseFloat(a[e])||0,s=(this.changes.indicators[e]||0)+t,n=o+s;if(n<0||n>100){h("warning",`${e} deve estar entre 0% e 100%`);return}this.changes.indicators[e]=s;const i=document.querySelector(`.indicator-input[data-field="${e}"]`);i&&(i.value=this.changes.indicators[e]),this.updateIndicatorPreview(e),this.updateSummary()}updateIndicatorPreview(e){const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=parseFloat(t[e])||0,o=this.changes.indicators[e]||0,r=Math.min(100,Math.max(0,a+o)),s=document.querySelector(`.indicator-preview[data-field="${e}"]`);s&&(s.textContent=`${r}%`);const n=s?.closest(".border")?.querySelector(".bg-gradient-to-r");n&&(n.style.width=`${r}%`)}resetActions(){this.actions.internal=[],this.actions.external=[],this.changes={technology:{},indicators:{}},this.recreateActionSlots("internal"),this.recreateActionSlots("external"),this.updateTabCounters(),this.updateBudgetBar(),this.updateSummary()}toggleActionDescription(e){const a=e.closest(".action-slot").querySelector(".action-description"),o=a.querySelector("div");if(e.value){const r=A.actionTypes[e.value];r&&(o.textContent=`${r.description}. Exemplos: ${r.examples.join(", ")}.`,a.classList.remove("hidden"))}else a.classList.add("hidden")}toggleResourceSelector(e){const t=e.closest(".action-slot"),a=t.querySelector(".resource-type-selector"),o=t.querySelector(".extraction-preview");e.value==="exploration"?(a?.classList.remove("hidden"),o?.classList.remove("hidden")):(a?.classList.add("hidden"),o?.classList.add("hidden"))}updateExtractionPreview(e,t){const a=e.querySelector(".extraction-amount");if(!a)return;if(!t.resourceType||!t.value||!t.dice){a.textContent="Aguardando dados...";return}const o=this.getCountryById(this.selectedCountry);if(!o)return;const s={Combustivel:"PotencialCombustivel",Carvao:"PotencialCarvao",Metais:"PotencialMetais"}[t.resourceType],n=parseFloat(o[s])||0,i=t.value/10*(t.dice/12)*(n/10),l=Math.round(i*100)/100,c={Combustivel:"Combustível",Carvao:"Carvão",Metais:"Metais"};a.innerHTML=`<strong>${l.toFixed(2)}</strong> unidades de ${c[t.resourceType]} (Potencial: ${n}/10)`}async applyEconomicActions(){const e=document.getElementById("economic-simulator-modal"),t=document.getElementById("apply-economic-actions");if(!(!e||!t))try{t.disabled=!0,t.textContent="⏳ Aplicando...";const a=this.getCountryById(this.selectedCountry);if(!a)throw new Error("País não encontrado");const o=[...this.actions.internal,...this.actions.external].filter(m=>m.type&&m.value>0),r=Object.values(this.changes.technology).some(m=>m!==0),s=Object.values(this.changes.indicators).some(m=>m!==0);if(!(o.length>0||r||s))throw new Error("Nenhuma mudança configurada");const i={};for(const m of o.filter(g=>g.isExternal))m.targetCountry&&(i[m.targetCountry]=this.getCountryById(m.targetCountry));const l=o.length>0?M.processAllActions(o,a,i):null;await this.saveEconomicResults(l,o,i);try{await Fe.generatePlayerFeedback(this.selectedCountry,l,o),d.info("Feedback narrativo gerado para o player")}catch(m){d.warn("Erro ao gerar feedback narrativo:",m)}let c="Mudanças aplicadas com sucesso!";if(l)c=`Investimentos aplicados! PIB cresceu ${(l.finalGrowth*100).toFixed(2)}%`;else if(r||hasResourceChanges||s){const m=[];r&&m.push("tecnologia"),hasResourceChanges&&m.push("recursos"),s&&m.push("indicadores"),c=`Mudanças em ${m.join(", ")} aplicadas!`}h("success",c),e.remove(),window.carregarTudo&&await window.carregarTudo(),setTimeout(()=>{window.location.pathname.includes("narrador")&&window.location.reload()},1500)}catch(a){d.error("Erro ao aplicar ações econômicas:",a),h("error",`Erro: ${a.message}`)}finally{t&&(t.disabled=!1,t.textContent="⚡ Aplicar Investimentos")}}async saveEconomicResults(e,t,a){const o=p.batch(),r=parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1;try{const s=p.collection("paises").doc(this.selectedCountry),n=this.getCountryById(this.selectedCountry)||{},i={TurnoUltimaAtualizacao:r};e&&(i.PIB=e.newPIB,i.PIBPerCapita=e.newPIBPerCapita,i["geral.PIB"]=e.newPIB,i["geral.PIBPerCapita"]=e.newPIBPerCapita);for(const[y,w]of Object.entries(this.changes.technology))if(w!==0){const L=parseFloat(n[y])||0,S=Math.max(0,L+w);i[y]=S,i[`geral.${y}`]=S}for(const[y,w]of Object.entries(this.changes.indicators))if(w!==0){const L=parseFloat(n[y])||0,S=Math.min(100,Math.max(0,L+w));i[y]=S,i[`geral.${y}`]=S}const l=t.filter(y=>y.type==="exploration"&&y.resourceType&&y.value&&y.dice);for(const y of l){const L={Combustivel:"PotencialCombustivel",Carvao:"PotencialCarvao",Metais:"PotencialMetais"}[y.resourceType],S=parseFloat(n[L])||0,Y=y.value/10*(y.dice/12)*(S/10),U=Math.round(Y*100)/100,H={Combustivel:"CombustivelProducao",Carvao:"CarvaoProducao",Metais:"MetaisProducao"}[y.resourceType],be=parseFloat(n[H])||0;i[H]=be+U,d.log(`[Exploration] ${n.Pais}: Extraiu ${U} unidades de ${y.resourceType} (Potencial: ${S}/10, Dado: ${y.dice}/12)`)}let c=0,m=0,g=0,f=0;const x=n.PoliticaIndustrial||n.Politica||"combustivel";for(const y of t){if(y.type==="industry"){const w=M.computeIndustryResourceConsumption(y.value,n);x==="carvao"?m+=w:c+=w,g+=(parseFloat(y.value)||0)*.5}if(y.type==="exploration"){const w=parseFloat(y.value)||0,L=parseFloat(n.PotencialCarvao||n.Potencial||n.PotencialCarvao||0)||0,S=Math.min(L*.1,w*.1);f+=S}y.type==="research"&&(g+=(parseFloat(y.value)||0)*.2)}const v=parseFloat(n.IndustrialEfficiency)||50,C=t.filter(y=>y.type==="industry").length*.5,I=Math.min(100,v+C+(e.technologyChanges||0)*.2);i.IndustrialEfficiency=I;const q=parseFloat(n.EnergiaCapacidade)||parseFloat(n.EnergiaDisponivel)||0,j=M.computeEnergyPenalty(q,g);if(j<1){const y=(1-j)*100,w=e.newPIB*(1-j)*.1;e.newPIB=Math.max(e.newPIB-w,e.newPIB*.95),e.newPIBPerCapita=e.newPIB/(parseFloat(n.Populacao)||1),d.info(`Penalidade de energia aplicada: ${y.toFixed(1)}% déficit, -${w.toFixed(0)} PIB`)}i.EnergiaCapacidade=q;const W=parseFloat(n.Combustivel)||0,pe=parseFloat(n.CarvaoSaldo||n.Carvao||0),ie=Math.max(0,W-c),he=Math.max(0,pe-m+f);i.Combustivel=ie,i.CarvaoSaldo=he,f>0&&(Z.results.producedCarvao=f);const ve={Graos:n.Graos||0,Combustivel:ie,EnergiaDisponivel:q},J=M.computeConsumerGoodsIndex(n,ve);i.BensDeConsumo=J;const _=parseFloat(n.Estabilidade)||0;if(J>75?(i.Estabilidade=Math.min(100,_+3),i["geral.Estabilidade"]=Math.min(100,_+3)):J<25&&(i.Estabilidade=Math.max(0,_-3),i["geral.Estabilidade"]=Math.max(0,_-3)),e.technologyChanges>0){const y=parseFloat(this.getCountryById(this.selectedCountry).Tecnologia)||0,w=Math.min(100,y+e.technologyChanges);i.Tecnologia=w,i["geral.Tecnologia"]=w}if(e.stabilityChanges>0){const y=parseFloat(this.getCountryById(this.selectedCountry).Estabilidade)||0,w=Math.min(100,y+e.stabilityChanges);i.Estabilidade=w,i["geral.Estabilidade"]=w}o.update(s,i);for(const y of t.filter(w=>w.isExternal))if(y.targetCountry&&a[y.targetCountry]){const w=a[y.targetCountry],S=M.calculateBaseGrowth(y,w).preInflationGrowth*y.value/1e6*.5,Y=p.collection("paises").doc(y.targetCountry),U=parseFloat(w.Populacao)||1,X=parseFloat(w.PIBPerCapita||0)+S/1e6,H=U*X;o.update(Y,{PIB:H,PIBPerCapita:X,TurnoUltimaAtualizacao:r})}const ge=p.collection("economic_history").doc(),Z={countryId:this.selectedCountry,turn:r,timestamp:new Date,totalInvestment:t.reduce((y,w)=>y+(parseFloat(w.value)||0),0),actions:t,results:{totalGrowth:e.totalGrowth,finalGrowth:e.finalGrowth,inflation:e.totalInflation,newPIB:e.newPIB,productiveChains:e.productiveChains},externalInvestments:{}};t.filter(y=>y.isExternal).forEach(y=>{y.targetCountry&&(Z.externalInvestments[y.targetCountry]=parseFloat(y.value)||0)}),o.set(ge,Z);const ye=p.collection("change_history").doc();o.set(ye,{countryId:this.selectedCountry,section:"economia",field:"simulacao_economica",oldValue:{PIB:parseFloat(this.getCountryById(this.selectedCountry).PIB),PIBPerCapita:parseFloat(this.getCountryById(this.selectedCountry).PIBPerCapita)||0},newValue:{PIB:e.newPIB,PIBPerCapita:e.newPIBPerCapita},userName:k.currentUser?.displayName||"Narrador",reason:`Simulação econômica: ${t.length} ações aplicadas`,timestamp:new Date,turn:r}),await o.commit(),d.info("Simulação econômica aplicada com sucesso")}catch(s){throw d.error("Erro ao salvar resultados econômicos:",s),s}}async buildPowerPlant(e,t){try{const a=this.getCountryById(e);if(!a)return h("error","País não encontrado."),{success:!1,message:"País não encontrado."};const o=Ee[t];if(!o)return h("error","Tipo de usina inválido."),{success:!1,message:"Tipo de usina inválido."};if(a.PIB<o.cost)return h("error",`PIB insuficiente para construir ${o.name}. Necessário: ${this.formatCurrency(o.cost)}`),{success:!1,message:"PIB insuficiente."};if(a.Tecnologia<o.tech_requirement)return h("error",`Tecnologia insuficiente para construir ${o.name}. Necessário: ${o.tech_requirement}%`),{success:!1,message:"Tecnologia insuficiente."};if(o.type==="hydro"){if(!a.PotencialHidreletrico||a.PotencialHidreletrico<=0)return h("error",`País não possui potencial hidrelétrico para construir ${o.name}.`),{success:!1,message:"Potencial hidrelétrico insuficiente."};a.PotencialHidreletrico--}if(o.resource_input==="Uranio"){if(!a.Uranio||a.Uranio<=0)return h("error",`País não possui Urânio suficiente para construir ${o.name}.`),{success:!1,message:"Urânio insuficiente."};a.Uranio--}return await p.runTransaction(async r=>{const s=p.collection("paises").doc(e),i=(await r.get(s)).data(),l=i.PIB-o.cost,c=[...i.power_plants||[],{id:t,built_turn:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}],m={PIB:l,power_plants:c,...o.type==="hydro"&&{PotencialHidreletrico:a.PotencialHidreletrico},...o.resource_input==="Uranio"&&{Uranio:a.Uranio}};r.update(s,m)}),a.PIB-=o.cost,a.power_plants.push({id:t,built_turn:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}),h("success",`${o.name} construída com sucesso!`),d.info(`${o.name} construída para ${a.Pais}`,{countryId:e,plantTypeId:t}),{success:!0,message:`${o.name} construída.`}}catch(a){return d.error(`Erro ao construir usina ${t} para ${e}:`,a),h("error",`Erro ao construir usina: ${a.message}`),{success:!1,message:`Erro ao construir usina: ${a.message}`}}}}let ee=null;async function qe(){try{return ee=new Ve,await ee.initialize(),ee}catch(u){throw d.error("Erro ao inicializar simulador econômico:",u),u}}async function je(){try{if(!await T("Confirmar Migração de Dados","Esta ação irá verificar TODOS os países e adicionar os novos campos de economia (Carvão, Energia, etc.) com valores padrão. Execute esta operação APENAS UMA VEZ. Deseja continuar?","Sim, migrar agora","Cancelar")){h("info","Migração cancelada pelo usuário.");return}h("info","Iniciando migração... Isso pode levar um momento.");const e=await p.collection("paises").get(),t=p.batch();let a=0;e.forEach(o=>{const r=o.data(),s=o.ref,n={};r.PotencialCarvao===void 0&&(n.PotencialCarvao=3),r.CarvaoSaldo===void 0&&(n.CarvaoSaldo=0),r.PoliticaIndustrial===void 0&&(n.PoliticaIndustrial="combustivel"),r.Energia===void 0&&(n.Energia={capacidade:100,demanda:100}),r.IndustrialEfficiency===void 0&&(n.IndustrialEfficiency=30),r.BensDeConsumo===void 0&&(n.BensDeConsumo=50),r.PotencialHidreletrico===void 0&&(n.PotencialHidreletrico=2),r.Uranio===void 0&&(n.Uranio=0),r.EnergiaCapacidade===void 0&&(n.EnergiaCapacidade=100),r.power_plants===void 0&&(n.power_plants=[]),Object.keys(n).length>0&&(a++,t.update(s,n))}),a>0?(await t.commit(),h("success",`${a} países foram migrados com sucesso!`)):h("info","Nenhum país precisava de migração. Tudo já está atualizado.")}catch(u){console.error("Erro durante a migração:",u),h("error",`Erro na migração: ${u.message}`)}}function Re(){const u=document.querySelectorAll(".tab-button"),e=document.querySelectorAll(".tab-panel");if(!u.length||!e.length)return;function t(o){u.forEach(n=>{n.classList.remove("border-brand-500","text-brand-300"),n.classList.add("border-transparent","text-slate-400"),n.setAttribute("aria-selected","false")}),e.forEach(n=>{n.classList.add("hidden")});const r=document.querySelector(`[data-tab="${o}"]`),s=document.getElementById(`panel-${o}`);r&&s&&(r.classList.remove("border-transparent","text-slate-400"),r.classList.add("border-brand-500","text-brand-300"),r.setAttribute("aria-selected","true"),s.classList.remove("hidden")),o==="players"?setTimeout(()=>{window.playerManager&&(window.playerManager.loadPlayers(),window.playerManager.loadCountries())},100):o==="gameplay"&&setTimeout(()=>{window.updateQuickStats&&window.updateQuickStats()},100)}u.forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-tab");t(r)})});const a=u[0]?.getAttribute("data-tab");a&&t(a),window.updateTabBadges=function(o){const r=document.getElementById("gameplay-badge"),s=document.getElementById("players-badge");r&&o?.vehiclesPending>0?(r.textContent=o.vehiclesPending,r.classList.remove("hidden")):r&&r.classList.add("hidden"),s&&o?.playersOnline>0?(s.textContent=o.playersOnline,s.classList.remove("hidden")):s&&s.classList.add("hidden")},window.switchTab=t}const N={geral:{label:"Geral",campos:[{key:"PIBPerCapita",label:"PIB per Capita",tipo:"moeda",min:0},{key:"PIB",label:"PIB Total",tipo:"calculado",dependeDe:["PIBPerCapita","Populacao"]},{key:"Populacao",label:"População",tipo:"inteiro",min:0},{key:"Estabilidade",label:"Estabilidade",tipo:"percent",min:0,max:100},{key:"Burocracia",label:"Burocracia",tipo:"percent",min:0,max:100},{key:"Urbanizacao",label:"Urbanização",tipo:"percent",min:0,max:100},{key:"Tecnologia",label:"Tecnologia",tipo:"percent",min:0,max:100},{key:"ModeloPolitico",label:"Modelo Político",tipo:"texto"},{key:"Visibilidade",label:"Visibilidade",tipo:"opcoes",opcoes:["Público","Privado"]}]},exercito:{label:"Exército",campos:[{key:"Infantaria",label:"Infantaria",tipo:"inteiro",min:0},{key:"Artilharia",label:"Artilharia",tipo:"inteiro",min:0}]},aeronautica:{label:"Aeronáutica",campos:[{key:"Caca",label:"Caça",tipo:"inteiro",min:0},{key:"CAS",label:"CAS",tipo:"inteiro",min:0},{key:"Bomber",label:"Bombardeiro",tipo:"inteiro",min:0}]},marinha:{label:"Marinha",campos:[{key:"Fragata",label:"Fragata",tipo:"inteiro",min:0},{key:"Destroyer",label:"Destroyer",tipo:"inteiro",min:0},{key:"Submarino",label:"Submarino",tipo:"inteiro",min:0},{key:"Transporte",label:"Transporte",tipo:"inteiro",min:0}]},inventario:{label:"Inventário de Veículos",campos:[{key:"cavalos",label:"Cavalos",tipo:"inteiro",min:0},{key:"tanquesLeves",label:"Tanques Leves",tipo:"inteiro",min:0},{key:"mbt",label:"MBT",tipo:"inteiro",min:0},{key:"tanquesPesados",label:"Tanques Pesados",tipo:"inteiro",min:0},{key:"caminhoes",label:"Caminhões de Transporte",tipo:"inteiro",min:0},{key:"spg",label:"SPG",tipo:"inteiro",min:0},{key:"sph",label:"SPH",tipo:"inteiro",min:0},{key:"spaa",label:"SPAA",tipo:"inteiro",min:0},{key:"apc",label:"APC",tipo:"inteiro",min:0},{key:"cacaTanques",label:"Caça-Tanques",tipo:"inteiro",min:0},{key:"veiculosEng",label:"Veículos de Engenharia",tipo:"inteiro",min:0},{key:"ifv",label:"IFV",tipo:"inteiro",min:0}]},recursos:{label:"Recursos",campos:[{key:"Graos",label:"Graos (estoque)",tipo:"inteiro",min:0},{key:"Combustivel",label:"Combustível (unidades)",tipo:"inteiro",min:0},{key:"CombustivelSaldo",label:"Saldo de Combustível",tipo:"inteiro"},{key:"Metais",label:"Metais",tipo:"inteiro"},{key:"PotencialCarvao",label:"Potencial de Carvão (Jazidas)",tipo:"inteiro",min:0}]},ocupacao:{label:"Ocupação",campos:[{key:"PopOcupada",label:"População Ocupada",tipo:"inteiro",min:0},{key:"PIBOcupado",label:"PIB Ocupado",tipo:"moeda",min:0}]},arsenal:{label:"Arsenal Especial",campos:[{key:"Nuclear",label:"Bomba Nuclear",tipo:"inteiro",min:0}]}};let P=null,E={paises:[],paisSelecionado:null,secaoSelecionada:"geral",realTimeEnabled:!0,autoSave:!0,listeners:new Map,pendingChanges:new Set};const b={gate:document.getElementById("gate"),adminRoot:document.getElementById("admin-root"),turnoAtual:document.getElementById("turno-atual-admin"),menuSecoes:document.getElementById("menu-secoes"),selectPais:document.getElementById("select-pais"),selectSecao:document.getElementById("select-secao"),formSecao:document.getElementById("form-secao"),listaCampos:document.getElementById("lista-campos-secao"),btnSalvarSecao:document.getElementById("btn-salvar-secao"),btnRecarregar:document.getElementById("btn-recarregar"),btnSalvarTurno:document.getElementById("btn-salvar-turno"),turnoInput:document.getElementById("turno-input"),btnSalvarCatalogo:document.getElementById("btn-salvar-catalogo"),btnCarregarCatalogo:document.getElementById("btn-carregar-catalogo"),btnAdicionarCampo:document.getElementById("btn-adicionar-campo"),logout:document.getElementById("logout-link"),realTimeToggle:document.getElementById("realtime-toggle"),autoSaveToggle:document.getElementById("autosave-toggle"),historyList:document.getElementById("history-list"),historyRefresh:document.getElementById("history-refresh"),exportHistory:document.getElementById("export-history"),playersList:document.getElementById("players-list"),availableCountries:document.getElementById("available-countries"),playerCount:document.getElementById("player-count"),availableCount:document.getElementById("available-count"),refreshPlayers:document.getElementById("refresh-players"),assignRandom:document.getElementById("assign-random"),clearAllAssignments:document.getElementById("clear-all-assignments")};async function Ne(){try{const u=await p.collection("configuracoes").doc("campos").get(),e=u.exists?u.data():{};P=Object.assign({},N,e),Object.keys(N).forEach(t=>{P[t]?(!P[t].campos||P[t].campos.length===0)&&(P[t].campos=N[t].campos):P[t]=N[t]})}catch(u){console.warn("Falha ao carregar catálogo, usando local.",u),P=N}}function ne(){!b.menuSecoes||!P||(b.menuSecoes.innerHTML="",Object.keys(P).forEach(u=>{const e=P[u],t=document.createElement("button");t.type="button",t.className=`w-full text-left rounded-md px-2 py-1.5 text-sm ${E.secaoSelecionada===u?"bg-white/5 border border-slate-600/40":"border border-transparent hover:bg-white/5"}`,t.textContent=e.label||u,t.onclick=()=>{E.secaoSelecionada=u,ne(),Q()},b.menuSecoes.appendChild(t)}),b.selectSecao&&(b.selectSecao.innerHTML=Object.keys(P).map(u=>`<option value="${u}" ${u===E.secaoSelecionada?"selected":""}>${P[u].label||u}</option>`).join("")))}function Oe(){b.selectPais&&(b.selectPais.innerHTML="",E.paises.forEach(u=>{const e=document.createElement("option");e.value=u.id,e.textContent=u.Pais||u.id,b.selectPais.appendChild(e)}),!E.paisSelecionado&&E.paises.length&&(E.paisSelecionado=E.paises[0].id),E.paisSelecionado&&(b.selectPais.value=E.paisSelecionado))}function ze(u,e,t,a=null){const o=document.createElement("div"),r=document.createElement("label");r.className="block text-xs text-slate-400 mb-1",r.textContent=e.label||u;let s;if(e.tipo==="calculado"){if(s=document.createElement("div"),s.className="mt-1 w-full rounded-lg bg-slate-700/50 border border-slate-600 p-2 text-sm text-slate-300 italic",u==="PIB"&&a){const n=parseFloat(a.Populacao)||0,i=parseFloat(a.PIBPerCapita)||0,l=O(n,i);s.textContent=`${se(l)} (calculado)`,s.dataset.calculatedValue=l}else s.textContent="Campo calculado";s.name=u}else e.tipo==="opcoes"&&Array.isArray(e.opcoes)?(s=document.createElement("select"),e.opcoes.forEach(n=>{const i=document.createElement("option");i.value=n,i.textContent=n,t===n&&(i.selected=!0),s.appendChild(i)}),s.name=u,s.className="mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors"):(s=document.createElement("input"),e.tipo==="percent"||e.tipo==="inteiro"||e.tipo==="moeda"?s.type="number":s.type="text",s.value=t??"",e.min!=null&&(s.min=String(e.min)),e.max!=null&&(s.max=String(e.max)),e.tipo==="moeda"?s.step="0.01":e.tipo==="percent"?s.step="0.1":e.tipo==="inteiro"&&(s.step="1"),s.name=u,s.className="mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors");return o.appendChild(r),o.appendChild(s),{wrap:o,input:s,get:()=>e.tipo==="calculado"?Number(s.dataset.calculatedValue||0):e.tipo==="inteiro"||e.tipo==="percent"||e.tipo==="moeda"?Number(s.value||0):s.value??""}}function Q(){if(!P||!b.formSecao)return;const u=E.paises.find(o=>o.id===E.paisSelecionado),e=P[E.secaoSelecionada],t=u&&u[E.secaoSelecionada]||{};b.formSecao.innerHTML="",b.listaCampos&&(b.listaCampos.innerHTML="");const a={};(e.campos||[]).forEach(o=>{const r=ze(o.key,o,t[o.key]??u?.[o.key],u);b.formSecao.appendChild(r.wrap),a[o.key]=r.get}),b.btnSalvarSecao&&(b.btnSalvarSecao.onclick=async()=>{if(u)try{b.btnSalvarSecao.disabled=!0,b.btnSalvarSecao.textContent="Salvando...";const o={};Object.keys(a).forEach(s=>o[s]=a[s]()),E.secaoSelecionada==="geral"&&o.PIBPerCapita&&o.Populacao&&(o.PIB=O(o.Populacao,o.PIBPerCapita));const r={[`${E.secaoSelecionada}`]:o};E.secaoSelecionada==="geral"&&Object.assign(r,o),await p.collection("paises").doc(u.id).update(r),h("success","Seção salva com sucesso")}catch(o){d.error("Erro ao salvar seção:",o),h("error",`Erro ao salvar: ${o.message}`)}finally{b.btnSalvarSecao.disabled=!1,b.btnSalvarSecao.textContent="Salvar Seção"}})}async function _e(u){if(!u){window.location.href="index.html";return}try{const e=await xe(u.uid);if(!e.isNarrator&&!e.isAdmin){b.gate&&b.gate.classList.remove("hidden"),b.adminRoot?.classList.add("hidden");return}b.gate&&b.gate.classList.add("hidden"),b.adminRoot?.classList.remove("hidden"),await Ne(),await B()}catch(e){console.error("Erro no gatekeeper",e),b.gate&&b.gate.classList.remove("hidden"),b.adminRoot?.classList.add("hidden")}}async function B(){const u=await ce();u&&u.turnoAtual&&b.turnoAtual&&(b.turnoAtual.textContent=`#${u.turnoAtual}`),u&&u.turnoAtual&&b.turnoInput&&(b.turnoInput.value=u.turnoAtual),E.paises=await re(),E.paises.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),Oe(),ne(),Q()}k.onAuthStateChanged(_e);b.selectPais&&b.selectPais.addEventListener("change",async u=>{E.paisSelecionado=u.target.value,Q();try{await activateEnergyForSelectedCountry()}catch(e){d.warn("Erro ao ativar EnergyManager após mudança de país:",e)}});b.selectSecao&&b.selectSecao.addEventListener("change",u=>{E.secaoSelecionada=u.target.value,ne(),Q()});b.btnRecarregar&&b.btnRecarregar.addEventListener("click",B);b.btnSalvarTurno&&b.btnSalvarTurno.addEventListener("click",async()=>{const u=Number(b.turnoInput?.value||"");if(Number.isNaN(u)||u<0){alert("Informe um número de turno válido.");return}await fe(u),alert(`Turno atualizado para #${u}`),await B()});b.logout&&b.logout.addEventListener("click",u=>{u.preventDefault(),k.signOut()});document.addEventListener("DOMContentLoaded",()=>{Re();const u=document.getElementById("btn-open-rules-editor"),e=document.getElementById("rules-editor-panel");u&&e&&u.addEventListener("click",()=>{e.classList.toggle("hidden")});const t=document.getElementById("btn-run-migration");t&&t.addEventListener("click",()=>{je()});const a=document.getElementById("btn-process-energy");a&&a.addEventListener("click",async()=>{try{a.disabled=!0,a.textContent="⏳ Processando...";const{processEnergySystemTurn:v}=await $(async()=>{const{processEnergySystemTurn:C}=await import("./energyPenaltyProcessor-DKniJfDm.js");return{processEnergySystemTurn:C}},__vite__mapDeps([2,0,1,3]));await v(),alert("Turno de energia processado com sucesso!"),await B()}catch(v){console.error("Erro ao processar energia:",v),alert("Erro ao processar energia: "+v.message)}finally{a.disabled=!1,a.textContent="⚡ Processar Turno de Energia"}});const o=document.getElementById("btn-assign-resources");o&&o.addEventListener("click",async()=>{try{o.disabled=!0,o.textContent="⏳ Processando...";const{assignResourcePotentials:v}=await $(async()=>{const{assignResourcePotentials:C}=await import("./assign-resource-potentials-Dx5WwkOR.js");return{assignResourcePotentials:C}},__vite__mapDeps([4,0,1]));await v(),await B()}catch(v){console.error("Erro ao atribuir recursos:",v),alert("Erro ao atribuir recursos: "+v.message)}finally{o.disabled=!1,o.textContent="🌍 Atribuir Potenciais de Recursos"}});const r=document.getElementById("btn-resource-report");r&&r.addEventListener("click",async()=>{try{const{generateResourceReport:v}=await $(async()=>{const{generateResourceReport:C}=await import("./assign-resource-potentials-Dx5WwkOR.js");return{generateResourceReport:C}},__vite__mapDeps([4,0,1]));v(),alert("Relatório de recursos gerado no console (F12)")}catch(v){console.error("Erro ao gerar relatório:",v),alert("Erro ao gerar relatório: "+v.message)}});const s=document.getElementById("btn-apply-consumption");s&&s.addEventListener("click",async()=>{try{s.disabled=!0,s.textContent="⏳ Calculando...";const{applyResourceConsumption:v}=await $(async()=>{const{applyResourceConsumption:C}=await import("./apply-resource-consumption-BWw60Pmr.js");return{applyResourceConsumption:C}},__vite__mapDeps([5,0,1,6]));await v(),await B()}catch(v){console.error("Erro ao calcular consumo:",v),alert("Erro ao calcular consumo: "+v.message)}finally{s.disabled=!1,s.textContent="🍽️ Calcular Consumo de Recursos"}});const n=document.getElementById("btn-apply-consumption-all");n&&n.addEventListener("click",async()=>{try{if(!await T("Aplicar Consumo a Todos os Países","Esta ação irá calcular e definir o consumo mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, etc.). Esta operação pode ser executada múltiplas vezes. Continuar?","Sim, aplicar","Cancelar")){h("info","Operação cancelada pelo usuário.");return}n.disabled=!0,n.textContent="⏳ Aplicando a todos os países...";const{applyResourceConsumption:C}=await $(async()=>{const{applyResourceConsumption:I}=await import("./apply-resource-consumption-BWw60Pmr.js");return{applyResourceConsumption:I}},__vite__mapDeps([5,0,1,6]));await C(),h("success","🎉 Consumo aplicado a todos os países! Recarregue o dashboard para ver os novos valores."),await B()}catch(v){console.error("Erro ao aplicar consumo:",v),h("error","Erro ao aplicar consumo: "+v.message)}finally{n.disabled=!1,n.textContent="🚀 APLICAR CONSUMO A TODOS OS PAÍSES"}});const i=document.getElementById("btn-apply-production-all");i&&i.addEventListener("click",async()=>{try{if(!await T("Aplicar Produção a Todos os Países","Esta ação irá calcular e definir a produção mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, geografia, clima). Esta operação pode ser executada múltiplas vezes. Continuar?","Sim, aplicar","Cancelar")){h("info","Operação cancelada pelo usuário.");return}i.disabled=!0,i.textContent="⏳ Aplicando produção a todos os países...";const{applyResourceProduction:C}=await $(async()=>{const{applyResourceProduction:I}=await import("./apply-resource-production-Cz5xKYgG.js");return{applyResourceProduction:I}},__vite__mapDeps([7,0,1,8]));await C(),h("success","🎉 Produção aplicada a todos os países! Recarregue o dashboard para ver os novos valores."),await B()}catch(v){console.error("Erro ao aplicar produção:",v),h("error","Erro ao aplicar produção: "+v.message)}finally{i.disabled=!1,i.textContent="🏭 APLICAR PRODUÇÃO A TODOS OS PAÍSES"}});const l=document.getElementById("btn-simulate-production");l&&l.addEventListener("click",async()=>{try{l.disabled=!0,l.textContent="⏳ Simulando...";const{simulateProductionTurns:v}=await $(async()=>{const{simulateProductionTurns:C}=await import("./apply-resource-production-Cz5xKYgG.js");return{simulateProductionTurns:C}},__vite__mapDeps([7,0,1,8]));await v(6),await B()}catch(v){console.error("Erro ao simular produção:",v),h("error","Erro na simulação: "+v.message)}finally{l.disabled=!1,l.textContent="📊 Simular Produção 6 Turnos"}});const c=document.getElementById("btn-apply-consumer-goods");c&&c.addEventListener("click",async()=>{try{if(!await T("Aplicar Bens de Consumo e Estabilidade","Esta ação irá calcular os bens de consumo para TODOS os países e aplicar os efeitos de estabilidade (+3% até -5%). Esta operação deve ser executada a cada turno. Continuar?","Sim, aplicar","Cancelar")){h("info","Operação cancelada pelo usuário.");return}c.disabled=!0,c.textContent="⏳ Aplicando bens de consumo...";const{applyConsumerGoodsEffects:C}=await $(async()=>{const{applyConsumerGoodsEffects:I}=await import("./apply-consumer-goods-D4ehV5s8.js");return{applyConsumerGoodsEffects:I}},__vite__mapDeps([9,0,1,10]));await C(),h("success","🎉 Bens de consumo e efeitos de estabilidade aplicados! Recarregue o dashboard."),await B()}catch(v){console.error("Erro ao aplicar bens de consumo:",v),h("error","Erro ao aplicar bens de consumo: "+v.message)}finally{c.disabled=!1,c.textContent="🛍️ APLICAR BENS DE CONSUMO E ESTABILIDADE"}});const m=document.getElementById("btn-simulate-consumer-goods");m&&m.addEventListener("click",async()=>{try{m.disabled=!0,m.textContent="⏳ Simulando...";const{simulateConsumerGoodsOverTime:v}=await $(async()=>{const{simulateConsumerGoodsOverTime:C}=await import("./apply-consumer-goods-D4ehV5s8.js");return{simulateConsumerGoodsOverTime:C}},__vite__mapDeps([9,0,1,10]));await v(5),await B()}catch(v){console.error("Erro ao simular bens de consumo:",v),h("error","Erro na simulação: "+v.message)}finally{m.disabled=!1,m.textContent="📈 Simular Estabilidade 5 Turnos"}});const g=document.getElementById("btn-test-turn-processing");g&&g.addEventListener("click",async()=>{try{g.disabled=!0,g.textContent="⏳ Testando...";const{default:v}=await $(async()=>{const{default:I}=await import("./turnProcessor-yiatDfKv.js");return{default:I}},__vite__mapDeps([11,1,0,10,12,13])),C=await v.testTurnProcessing();h("success",`Teste concluído: ${C.length} países analisados. Veja o console (F12) para detalhes.`)}catch(v){console.error("Erro no teste:",v),h("error","Erro no teste: "+v.message)}finally{g.disabled=!1,g.textContent="🧪 Testar Processamento de Turno"}});const f=document.getElementById("btn-reprocess-turn");f&&f.addEventListener("click",async()=>{try{if(!await T("Reprocessar Turno Atual","Esta ação irá forçar o reprocessamento do turno atual, aplicando novamente todos os efeitos de bens de consumo e estabilidade. Use apenas se necessário. Continuar?","Sim, reprocessar","Cancelar")){h("info","Operação cancelada.");return}f.disabled=!0,f.textContent="⏳ Reprocessando...";const I=(await ce()).turnoAtual||1,{default:q}=await $(async()=>{const{default:W}=await import("./turnProcessor-yiatDfKv.js");return{default:W}},__vite__mapDeps([11,1,0,10,12,13])),j=await q.reprocessTurn(I);h("success",`Turno ${I} reprocessado: ${j.processedCount} países atualizados!`),await B()}catch(v){console.error("Erro no reprocessamento:",v),h("error","Erro no reprocessamento: "+v.message)}finally{f.disabled=!1,f.textContent="🔄 Reprocessar Turno Atual"}});const x=document.getElementById("btn-simulate-consumption");x&&x.addEventListener("click",async()=>{try{x.disabled=!0,x.textContent="⏳ Simulando...";const{simulateConsumptionTurns:v}=await $(async()=>{const{simulateConsumptionTurns:C}=await import("./apply-resource-consumption-BWw60Pmr.js");return{simulateConsumptionTurns:C}},__vite__mapDeps([5,0,1,6]));await v(3),alert("Simulação concluída! Veja os resultados no console (F12)")}catch(v){console.error("Erro na simulação:",v),alert("Erro na simulação: "+v.message)}finally{x.disabled=!1,x.textContent="🔮 Simular 3 Turnos"}})});let te=null,ae=null,oe=null,ue=null,me=null;async function Ue(){try{te=new Ae,await te.initialize(),d.info("Sistema de aprovação de veículos inicializado")}catch(u){d.error("Erro ao inicializar sistema de aprovação de veículos:",u)}}async function He(){try{ae=new we,await ae.initialize(),d.info("Sistema de produção naval inicializado")}catch(u){d.error("Erro ao inicializar sistema de produção naval:",u)}}async function Ge(){try{oe=new Pe,await oe.initialize(),d.info("Sistema de inventário inicializado")}catch(u){d.error("Erro ao inicializar sistema de inventário:",u)}}async function Qe(){try{await new Be().initialize(),d.info("Gerenciador de equipamentos genéricos inicializado")}catch(u){d.error("Erro ao inicializar gerenciador de equipamentos genéricos:",u)}}async function We(){try{ue=await qe(),d.info("Sistema econômico inicializado")}catch(u){d.error("Erro ao inicializar sistema econômico:",u)}}async function Je(){try{me=await Te(),d.info("Editor de País Avançado inicializado")}catch(u){d.error("Erro ao inicializar Editor de País Avançado:",u)}}async function Ze(){try{V&&typeof V.loadPlayers=="function"?(await V.loadPlayers(),await V.loadCountries(),V.setupRealTimeListeners?.(),d.info("Player management inicializado")):d.warn("playerManager não disponível para inicialização")}catch(u){d.error("Erro ao inicializar player management:",u)}}async function le(){try{console.log("🔧 Inicializando sistemas do narrador..."),await Promise.all([Ze(),Ue(),He(),Ge(),Qe(),We(),Je()]),window.playerManager=V,window.vehicleApprovalSystem=te,window.navalProductionSystem=ae,window.inventorySystem=oe,window.economicSimulator=ue,window.advancedCountryEditor=me,window.narratorData={getCatalog:()=>P,getCountries:()=>E.paises},console.log("✅ Todos os sistemas do narrador inicializados")}catch(u){console.error("❌ Erro ao inicializar sistemas do narrador:",u)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",le):le();
