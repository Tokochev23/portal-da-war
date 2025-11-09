const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-BDV7finj.js","assets/preload-helper-f85Crcwt.js","assets/utils-DLoRv3re.js","assets/worldMap-BFOKH5HR.js","assets/energyPenaltyProcessor-BBwDgQID.js","assets/economicCalculations-BCE1cIKn.js","assets/assign-resource-potentials-Dx9oOHcI.js","assets/apply-resource-consumption-CPH-AAzs.js","assets/resourceConsumptionCalculator-Bk-hb2mA.js","assets/apply-resource-production-yIlvMaj0.js","assets/resourceProductionCalculator-C5abBl5S.js","assets/apply-consumer-goods-C2AjmKuS.js","assets/consumerGoodsCalculator-RQh-OK8I.js","assets/turnProcessor-885tCVLN.js","assets/turnEventsSystem-US8vT2BV.js","assets/espionageOperationsSystem-VZyzbeX4.js","assets/shipyardSystem-B7HEfEsS.js","assets/lawAndExhaustionCalculator-COcnTsA2.js"])))=>i.map(i=>d[i]);
import{_ as T}from"./preload-helper-f85Crcwt.js";/* empty css             */import{db as p,auth as A,getAllCountries as ue,updateTurn as Ce,getGameConfig as ye,checkUserPermissions as Ee}from"./firebase-BDV7finj.js";import{L as m,s as u,a as D}from"./utils-DLoRv3re.js";import{NavalProductionSystem as Pe}from"./navalProduction-DS495_qr.js";import{f as me,c as Z,a as Ie,E as z,b as se,P as Se}from"./economicCalculations-BCE1cIKn.js";import{W as $e}from"./worldMap-BFOKH5HR.js";import{c as Ae}from"./lawAndExhaustionCalculator-COcnTsA2.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";import"./shipyardSystem-B7HEfEsS.js";class Be{constructor(){this.inventories=new Map,this.categories=[{id:"MBT",name:"Main Battle Tank",icon:"🛡️",type:"vehicle"},{id:"Medium Tank",name:"Tanque Médio",icon:"⚙️",type:"vehicle"},{id:"Light Tank",name:"Tanque Leve",icon:"🏃",type:"vehicle"},{id:"IFV",name:"Infantry Fighting Vehicle",icon:"👥",type:"vehicle"},{id:"APC",name:"Armored Personnel Carrier",icon:"🚐",type:"vehicle"},{id:"SPG",name:"Self-Propelled Gun",icon:"💥",type:"vehicle"},{id:"SPH",name:"Self-Propelled Howitzer",icon:"🎯",type:"vehicle"},{id:"SPAA",name:"Self-Propelled Anti-Aircraft",icon:"🎪",type:"vehicle"},{id:"Other",name:"Outros Veículos",icon:"🔧",type:"vehicle"},{id:"Couraçados",name:"Couraçados",icon:"⚓",type:"naval"},{id:"Cruzadores",name:"Cruzadores",icon:"🚢",type:"naval"},{id:"Destróieres",name:"Destróieres",icon:"🛥️",type:"naval"},{id:"Fragatas",name:"Fragatas",icon:"🚤",type:"naval"},{id:"Corvetas",name:"Corvetas",icon:"⛵",type:"naval"},{id:"Submarinos",name:"Submarinos",icon:"🤿",type:"naval"},{id:"Porta-aviões",name:"Porta-aviões",icon:"🛩️",type:"naval"},{id:"Patrulhas",name:"Patrulhas",icon:"🚨",type:"naval"},{id:"Auxiliares",name:"Auxiliares",icon:"🔧",type:"naval"},{id:"Naval - Outros",name:"Outros Navios",icon:"🌊",type:"naval"}],this.selectedCountry=null,this.typeFilter="all",this.componentNames={gasoline_v8_medium:"Motor V8 a Gasolina Médio",diesel_v12_heavy:"Motor V12 Diesel Pesado",gasoline_inline6_light:"Motor I6 a Gasolina Leve",diesel_v8_medium:"Motor V8 Diesel Médio",gasoline_v12_heavy:"Motor V12 a Gasolina Pesado",mbt_medium:"Chassi MBT Médio",light_tank:"Chassi Tanque Leve",heavy_tank:"Chassi Tanque Pesado",spg_chassis:"Chassi SPG",apc_chassis:"Chassi APC",ifv_chassis:"Chassi IFV",standard:"Padrão",advanced:"Avançado",basic:"Básico"}}async initialize(){console.log("📦 Inicializando sistema de inventário..."),this.render(),setInterval(()=>this.refreshCurrentInventory(),6e4)}render(){const e=document.getElementById("inventory-system-anchor");if(!e){console.warn("⚠️ Âncora inventory-system-anchor não encontrada");return}const t=document.getElementById("inventory-system-section");t&&t.remove();const a=document.createElement("div");a.id="inventory-system-section",a.innerHTML=this.getHTML(),e.parentNode.insertBefore(a,e.nextSibling),this.setupEventListeners()}setupEventListeners(){document.addEventListener("click",t=>{if(t.target.matches("[data-load-inventory]")){const a=t.target.dataset.loadInventory;this.loadCountryInventory(a)}if(t.target.id==="refresh-inventory"&&this.refreshCurrentInventory(),t.target.id==="export-inventory"&&this.exportInventory(),t.target.matches("[data-edit-quantity]")){const a=t.target.dataset.editQuantity,o=t.target.dataset.category;this.editVehicleQuantity(o,a)}if(t.target.matches("[data-remove-vehicle]")){const a=t.target.dataset.removeVehicle,o=t.target.dataset.category;this.removeVehicle(o,a)}if(t.target.matches("[data-view-category]")||t.target.closest("[data-view-category]")){const o=(t.target.matches("[data-view-category]")?t.target:t.target.closest("[data-view-category]")).dataset.viewCategory;this.showCategoryModal(o)}if(t.target.matches("[data-view-vehicle-sheet]")){const a=t.target.dataset.viewVehicleSheet,o=t.target.dataset.category;this.showVehicleSheet(o,a)}t.target.matches("[data-filter-type]")&&(this.typeFilter=t.target.dataset.filterType,this.renderInventoryContent())});const e=document.getElementById("inventory-country-select");e&&e.addEventListener("change",t=>{t.target.value?this.loadCountryInventory(t.target.value):(this.selectedCountry=null,this.renderInventoryContent())})}getHTML(){return`
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
        `}async loadCountryInventory(e){try{console.log(`📦 Carregando inventário para ${e}...`),this.selectedCountry=e;const t=await p.collection("inventory").doc(e).get();let a={};t.exists&&(a=t.data()),this.inventories.set(e,a);const o=await p.collection("paises").doc(e).get(),n=o.exists?o.data().Pais:e;this.renderInventoryContent(a,n),console.log(`✅ Inventário de ${n} carregado`)}catch(t){console.error("❌ Erro ao carregar inventário:",t),this.renderInventoryError("Erro ao carregar inventário: "+t.message)}}async refreshCurrentInventory(){this.selectedCountry&&await this.loadCountryInventory(this.selectedCountry)}renderInventoryContent(e={},t=null){const a=document.getElementById("inventory-content");if(!a)return;if(!this.selectedCountry){a.innerHTML=`
                <div class="text-center py-8 text-slate-400">
                    <div class="text-2xl mb-2">📦</div>
                    <div class="text-sm">Selecione um país para visualizar o inventário</div>
                </div>
            `;return}const o=this.calculateTotalVehicles(e),n=this.calculateTotalValue(e),r=this.getFilteredCategories();a.innerHTML=`
            <div class="mb-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-emerald-200">
                        🏠 ${t||this.selectedCountry}
                    </h3>
                    <div class="text-sm text-slate-400">
                        <span class="font-semibold text-emerald-300">${o}</span> unidades • 
                        <span class="font-semibold text-emerald-300">$${n.toLocaleString()}</span> valor total
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
                ${r.map(s=>this.renderCategoryCard(s,e[s.id]||{})).join("")}
            </div>
        `,this.loadCountryOptions()}getFilteredCategories(){return this.typeFilter==="all"?this.categories:this.categories.filter(e=>e.type===this.typeFilter)}renderCategoryCard(e,t){const a=Object.keys(t).length,o=Object.values(t).reduce((r,s)=>r+(s.quantity||0),0),n=Object.values(t).reduce((r,s)=>r+(s.cost||0)*(s.quantity||0),0);return`
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
                        <div class="text-xs text-slate-400">$${n.toLocaleString()}</div>
                        <div class="text-xs text-emerald-300 mt-1">👁️ Ver Detalhes</div>
                    </div>
                </div>
                
                <!-- Quick preview of vehicles -->
                <div class="space-y-1 max-h-20 overflow-hidden">
                    ${Object.keys(t).length===0?`
                        <div class="text-center text-slate-500 text-xs py-2">
                            Nenhum veículo nesta categoria
                        </div>
                    `:Object.entries(t).slice(0,2).map(([r,s])=>`
                        <div class="text-xs text-slate-400 flex justify-between">
                            <span>• ${r}</span>
                            <span>${s.quantity||0}x</span>
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
        `)}calculateTotalVehicles(e){let t=0;for(const a of Object.values(e))for(const o of Object.values(a))t+=o.quantity||0;return t}calculateTotalValue(e){let t=0;for(const a of Object.values(e))for(const o of Object.values(a))t+=(o.cost||0)*(o.quantity||0);return t}async loadCountryOptions(){try{const e=document.getElementById("inventory-country-select");if(!e||e.children.length>1)return;const a=(await p.collection("paises").get()).docs.map(n=>({id:n.id,name:n.data().Pais||n.id})).sort((n,r)=>n.name.localeCompare(r.name)),o=e.value;e.innerHTML='<option value="">Selecione um país...</option>',a.forEach(n=>{const r=document.createElement("option");r.value=n.id,r.textContent=n.name,n.id===o&&(r.selected=!0),e.appendChild(r)})}catch(e){console.error("❌ Erro ao carregar países:",e)}}async editVehicleQuantity(e,t){try{const a=this.inventories.get(this.selectedCountry)||{},o=a[e]?.[t];if(!o){alert("Veículo não encontrado");return}const n=prompt(`Alterar quantidade de "${t}":
Quantidade atual: ${o.quantity||0}`,o.quantity||0);if(n===null)return;const r=parseInt(n);if(isNaN(r)||r<0){alert("Quantidade inválida");return}a[e]||(a[e]={}),a[e][t].quantity=r,await p.collection("inventory").doc(this.selectedCountry).set(a,{merge:!0}),this.renderInventoryContent(a,this.selectedCountry),console.log(`✅ Quantidade de "${t}" atualizada para ${r}`)}catch(a){console.error("❌ Erro ao editar quantidade:",a),alert("Erro ao atualizar quantidade: "+a.message)}}async removeVehicle(e,t){try{if(!confirm(`Remover "${t}" do inventário?`))return;const a=this.inventories.get(this.selectedCountry)||{};a[e]&&a[e][t]&&(delete a[e][t],Object.keys(a[e]).length===0&&delete a[e],await p.collection("inventory").doc(this.selectedCountry).set(a,{merge:!0}),this.renderInventoryContent(a,this.selectedCountry),console.log(`✅ "${t}" removido do inventário`))}catch(a){console.error("❌ Erro ao remover veículo:",a),alert("Erro ao remover veículo: "+a.message)}}async exportInventory(){if(!this.selectedCountry){alert("Selecione um país primeiro");return}try{const e=this.inventories.get(this.selectedCountry)||{},t=JSON.stringify(e,null,2),a=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(a),n=document.createElement("a");n.href=o,n.download=`inventario_${this.selectedCountry}_${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(o),console.log("✅ Inventário exportado")}catch(e){console.error("❌ Erro ao exportar inventário:",e),alert("Erro ao exportar: "+e.message)}}showCategoryModal(e){if(!this.selectedCountry){alert("Selecione um país primeiro");return}const a=(this.inventories.get(this.selectedCountry)||{})[e]||{},o=this.categories.find(d=>d.id===e);if(!o){alert("Categoria não encontrada");return}const n=document.getElementById("category-inventory-modal");n&&n.remove();const r=document.createElement("div");r.id="category-inventory-modal",r.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",r.style.zIndex="9999";const s=Object.keys(a).length,i=Object.values(a).reduce((d,h)=>d+(h.quantity||0),0),l=Object.values(a).reduce((d,h)=>d+(h.cost||0)*(h.quantity||0),0);r.innerHTML=`
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <!-- Header -->
                <div class="flex items-center justify-between p-6 border-b border-slate-700">
                    <div class="flex items-center gap-3">
                        <span class="text-3xl">${o.icon}</span>
                        <div>
                            <h3 class="text-xl font-bold text-slate-100">${o.name}</h3>
                            <p class="text-sm text-slate-400">${this.getCountryDisplayName()} - ${s} modelos • ${i} unidades</p>
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
                            ${Object.entries(a).map(([d,h])=>this.renderVehicleCard(d,h,e)).join("")}
                        </div>
                    `}
                </div>
            </div>
        `,r.addEventListener("click",d=>{d.target===r&&r.remove()}),document.addEventListener("keydown",function d(h){h.key==="Escape"&&(r.remove(),document.removeEventListener("keydown",d))}),document.body.appendChild(r)}renderVehicleCard(e,t,a){const o=(t.cost||0)*(t.quantity||0),n=t.sheetImageUrl||t.sheetHtmlUrl||t.specs,r=t.specs||{},s=t.maintenanceCost||t.costs?.maintenance||0,i=s*(t.quantity||0);return`
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
                            <div>🔧 <strong class="text-yellow-400">Manutenção unit.:</strong> $${s.toLocaleString()}/ano</div>
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
                        ${n?`
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
        `}showVehicleSheet(e,t){if(!this.selectedCountry){alert("Selecione um país primeiro");return}const o=(this.inventories.get(this.selectedCountry)||{})[e]?.[t];if(!o){alert("Dados do veículo não encontrados");return}let n=null,r="none";if(o.sheetImageUrl&&o.sheetImageUrl.startsWith("http")?(n=o.sheetImageUrl,r="image"):o.sheetHtmlUrl&&o.sheetHtmlUrl.startsWith("http")?(n=o.sheetHtmlUrl,r="html"):o.sheetImageUrl&&o.sheetImageUrl.startsWith("data:")&&(n=o.sheetImageUrl,r="data"),!n){this.showBasicVehicleInfo(t,o);return}const s=document.getElementById("vehicle-sheet-modal");s&&s.remove();const i=document.createElement("div");i.id="vehicle-sheet-modal",i.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",i.style.zIndex="10000",i.innerHTML=`
            <div class="bg-slate-800 border border-slate-600 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="flex items-center justify-between p-4 border-b border-slate-600">
                    <div>
                        <h3 class="text-lg font-semibold text-slate-200">🖼️ Ficha Técnica</h3>
                        <p class="text-sm text-slate-400">${t} - ${this.getCountryDisplayName()}</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.open('${n}', '_blank')" 
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
                            <img src="${n}" alt="Ficha do Veículo" 
                                 class="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
                                 style="max-height: 70vh;" />
                        </div>
                    `:r==="html"||r==="data"?`
                        <iframe src="${n}" 
                                style="width: 100%; height: 70vh; border: none; border-radius: 8px;"></iframe>
                    `:`
                        <div class="text-center py-8 text-red-400">
                            Formato de ficha não suportado
                        </div>
                    `}
                </div>
            </div>
        `,i.addEventListener("click",l=>{l.target===i&&i.remove()}),document.addEventListener("keydown",function l(d){d.key==="Escape"&&(i.remove(),document.removeEventListener("keydown",l))}),document.body.appendChild(i)}showBasicVehicleInfo(e,t){const a=document.createElement("div");a.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.style.zIndex="10000",a.innerHTML=`
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
        `,a.addEventListener("click",o=>{o.target===a&&a.remove()}),document.body.appendChild(a)}getCountryDisplayName(){if(!this.selectedCountry)return"País Desconhecido";const e=document.getElementById("inventory-country-select");if(e){const t=e.querySelector(`option[value="${this.selectedCountry}"]`);if(t)return t.textContent}return this.selectedCountry}getReadableComponentName(e){return e?this.componentNames[e]?this.componentNames[e]:e.replace(/_/g," ").replace(/([a-z])([A-Z])/g,"$1 $2").split(" ").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"N/A"}}class ke{constructor(){this.batchQueue=[],this.batchTimer=null,this.batchDelay=500}async recordChange({countryId:e,section:t,field:a,oldValue:o,newValue:n,userId:r=null,userName:s=null,reason:i=null,metadata:l={}}){try{const d=A.currentUser;if(!d&&!r)throw new Error("Usuário não autenticado");const h={countryId:e,section:t,field:a,oldValue:this.sanitizeValue(o),newValue:this.sanitizeValue(n),userId:r||d.uid,userName:s||d.displayName||"Sistema",timestamp:new Date,reason:i,metadata:{userAgent:navigator.userAgent,platform:navigator.platform,...l},changeType:this.getChangeType(o,n),delta:this.calculateDelta(o,n),severity:this.calculateSeverity(t,a,o,n)};return this.batchQueue.push(h),this.scheduleBatchWrite(),m.debug("Mudança registrada:",h),h}catch(d){throw m.error("Erro ao registrar mudança:",d),d}}async recordBatchChanges(e,t=null){try{const a=p.batch(),o=new Date,n=A.currentUser,r=this.generateBatchId();return e.forEach(s=>{const i={...s,batchId:r,userId:n?.uid,userName:n?.displayName||"Sistema",timestamp:o,reason:t,changeType:this.getChangeType(s.oldValue,s.newValue),delta:this.calculateDelta(s.oldValue,s.newValue),severity:this.calculateSeverity(s.section,s.field,s.oldValue,s.newValue)},l=p.collection("changeHistory").doc();a.set(l,i)}),await a.commit(),m.info(`Lote de ${e.length} mudanças registrado com ID: ${r}`),r}catch(a){throw m.error("Erro ao registrar mudanças em lote:",a),a}}async applyRealTimeChange({countryId:e,section:t,field:a,newValue:o,reason:n=null,skipHistory:r=!1}){try{const s=p.collection("paises").doc(e),i=await s.get();if(!i.exists)throw new Error(`País ${e} não encontrado`);const h=(i.data()[t]||{})[a];this.validateChange(t,a,h,o);const w={[`${t}.${a}`]:o,[`${t}.lastModified`]:new Date,[`${t}.lastModifiedBy`]:A.currentUser?.uid};return await s.update(w),r||await this.recordChange({countryId:e,section:t,field:a,oldValue:h,newValue:o,reason:n}),this.broadcastChange({countryId:e,section:t,field:a,oldValue:h,newValue:o,timestamp:new Date}),m.info(`Mudança aplicada em tempo real: ${e}.${t}.${a}`),!0}catch(s){throw m.error("Erro ao aplicar mudança em tempo real:",s),u("error",`Erro ao aplicar mudança: ${s.message}`),s}}async getChangeHistory({countryId:e=null,section:t=null,field:a=null,userId:o=null,startDate:n=null,endDate:r=null,limit:s=50,orderBy:i="timestamp",orderDirection:l="desc"}={}){try{let d=p.collection("changeHistory");e&&(d=d.where("countryId","==",e)),t&&(d=d.where("section","==",t)),a&&(d=d.where("field","==",a)),o&&(d=d.where("userId","==",o)),n&&(d=d.where("timestamp",">=",n)),r&&(d=d.where("timestamp","<=",r)),d=d.orderBy(i,l),s&&(d=d.limit(s));const v=(await d.get()).docs.map(w=>({id:w.id,...w.data(),timestamp:w.data().timestamp.toDate()}));return m.debug(`Histórico recuperado: ${v.length} mudanças`),v}catch(d){throw m.error("Erro ao buscar histórico:",d),d}}async rollbackChange(e,t=null){try{const a=await p.collection("changeHistory").doc(e).get();if(!a.exists)throw new Error("Mudança não encontrada");const o=a.data(),{countryId:n,section:r,field:s,oldValue:i,newValue:l}=o,d=await p.collection("paises").doc(n).get();if(!d.exists)throw new Error("País não existe mais");const v=d.data()[r]?.[s];if(!this.valuesEqual(v,l))throw new Error("O valor foi modificado após esta mudança. Rollback automático não é seguro.");return await this.applyRealTimeChange({countryId:n,section:r,field:s,newValue:i,reason:`ROLLBACK: ${t||"Revertido pelo narrador"}`,skipHistory:!1}),await p.collection("changeHistory").doc(e).update({rolledBack:!0,rollbackTimestamp:new Date,rollbackUserId:A.currentUser?.uid,rollbackReason:t}),u("success","Mudança revertida com sucesso"),m.info(`Rollback executado para mudança: ${e}`),!0}catch(a){throw m.error("Erro no rollback:",a),u("error",`Erro no rollback: ${a.message}`),a}}async rollbackBatch(e,t=null){try{const a=await p.collection("changeHistory").where("batchId","==",e).where("rolledBack","!=",!0).orderBy("timestamp","desc").get();if(a.empty)throw new Error("Nenhuma mudança encontrada para este lote");const o=[];return a.forEach(n=>{o.push(this.rollbackChange(n.id,t))}),await Promise.all(o),u("success",`Lote de ${o.length} mudanças revertido`),!0}catch(a){throw m.error("Erro no rollback do lote:",a),u("error",`Erro no rollback do lote: ${a.message}`),a}}async getHistoryStats(e=null,t=30){try{const a=new Date;a.setDate(a.getDate()-t);let o=p.collection("changeHistory").where("timestamp",">=",a);e&&(o=o.where("countryId","==",e));const r=(await o.get()).docs.map(i=>i.data()),s={totalChanges:r.length,bySection:{},byUser:{},bySeverity:{low:0,medium:0,high:0,critical:0},dailyActivity:{},mostActiveFields:{},rollbackRate:0};return r.forEach(i=>{s.bySection[i.section]||(s.bySection[i.section]=0),s.bySection[i.section]++,s.byUser[i.userName]||(s.byUser[i.userName]=0),s.byUser[i.userName]++,i.severity&&s.bySeverity[i.severity]++;const l=i.timestamp.toDate().toISOString().split("T")[0];s.dailyActivity[l]||(s.dailyActivity[l]=0),s.dailyActivity[l]++;const d=`${i.section}.${i.field}`;s.mostActiveFields[d]||(s.mostActiveFields[d]=0),s.mostActiveFields[d]++,i.rolledBack&&s.rollbackRate++}),s.rollbackRate=s.totalChanges>0?s.rollbackRate/s.totalChanges*100:0,s}catch(a){throw m.error("Erro ao gerar estatísticas:",a),a}}sanitizeValue(e){return e==null?null:typeof e=="object"?JSON.parse(JSON.stringify(e)):e}getChangeType(e,t){return e==null?"create":t==null?"delete":"update"}calculateDelta(e,t){return typeof e=="number"&&typeof t=="number"?{absolute:t-e,percentage:e!==0?(t-e)/e*100:null}:null}calculateSeverity(e,t,a,o){const n=["PIB","Estabilidade","Populacao"],r=["geral","exercito"];if(n.includes(t)){const s=this.calculateDelta(a,o);return s&&Math.abs(s.percentage)>50?"critical":s&&Math.abs(s.percentage)>20?"high":"medium"}return r.includes(e)?"medium":"low"}validateChange(e,t,a,o){if(t==="PIB"&&o<0)throw new Error("PIB não pode ser negativo");if(t==="Estabilidade"&&(o<0||o>100))throw new Error("Estabilidade deve estar entre 0 e 100");if(t==="Populacao"&&o<0)throw new Error("População não pode ser negativa")}valuesEqual(e,t){return e===t?!0:typeof e=="object"&&typeof t=="object"?JSON.stringify(e)===JSON.stringify(t):!1}generateBatchId(){return`batch_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}scheduleBatchWrite(){this.batchTimer&&clearTimeout(this.batchTimer),this.batchTimer=setTimeout(async()=>{if(this.batchQueue.length!==0)try{const e=p.batch(),t=[...this.batchQueue];this.batchQueue=[],t.forEach(a=>{const o=p.collection("changeHistory").doc();e.set(o,a)}),await e.commit(),m.debug(`Lote de ${t.length} mudanças salvo no histórico`)}catch(e){m.error("Erro ao salvar lote no histórico:",e),this.batchQueue.unshift(...this.batchQueue)}},this.batchDelay)}broadcastChange(e){window.dispatchEvent(new CustomEvent("country:changed",{detail:e}))}}const Y=new ke;class Te{constructor(){this.listeners=new Map,this.pendingChanges=new Map,this.isOnline=navigator.onLine,this.setupConnectionHandlers()}async updateField({countryId:e,section:t,field:a,value:o,reason:n=null,broadcast:r=!0,validate:s=!0}){try{if(s&&this.validateFieldValue(t,a,o),!this.isOnline)return this.queueOfflineChange({countryId:e,section:t,field:a,value:o,reason:n});const i=await this.getCurrentFieldValue(e,t,a);return this.valuesEqual(i,o)?(m.debug("Valor não alterado, ignorando update"),!1):(m.info("Salvando diretamente no Firebase (histórico desabilitado)"),await this.saveWithRetry(e,t,a,o),r&&this.broadcastLocalUpdate({countryId:e,section:t,field:a,oldValue:i,newValue:o}),m.debug(`Campo atualizado em tempo real: ${e}.${t}.${a}`),!0)}catch(i){throw m.error("Erro na atualização em tempo real:",i),u("error",`Erro: ${i.message}`),i}}async updateMultipleFields({countryId:e,section:t,fields:a,reason:o=null,broadcast:n=!0}){try{const r=[];for(const[s,i]of Object.entries(a)){const l=await this.getCurrentFieldValue(e,t,s);this.valuesEqual(l,i)||r.push({countryId:e,section:t,field:s,oldValue:l,newValue:i})}return r.length===0?(m.debug("Nenhuma mudança detectada"),!1):(await this.executeDirectUpdate(r),n&&r.forEach(s=>this.broadcastLocalUpdate(s)),u("success",`${r.length} campos atualizados`),!0)}catch(r){throw m.error("Erro na atualização múltipla:",r),u("error",`Erro: ${r.message}`),r}}async applyMassDeltas({countryIds:e,deltas:t,reason:a="Aplicação de deltas em massa"}){try{const o=[];for(const r of e){const s=await p.collection("paises").doc(r).get();if(!s.exists)continue;const i=s.data();for(const[l,d]of Object.entries(t)){const h=i[l]||{};for(const[v,w]of Object.entries(d)){if(w===0||w===null||w===void 0)continue;const C=h[v]||0;let S;if(v==="PIB"&&typeof w=="number")S=C*(1+w/100);else if(typeof C=="number")S=C+w;else{m.warn(`Campo ${v} não suporta delta, ignorando`);continue}S=this.applyFieldLimits(l,v,S),o.push({countryId:r,section:l,field:v,oldValue:C,newValue:S})}}}if(o.length===0)return u("warning","Nenhuma mudança aplicável encontrada"),!1;await this.executeBatchUpdate(o);let n=null;try{n=await Y.recordBatchChanges(o,a)}catch(r){m.warn("Erro ao registrar deltas no histórico:",r.message),n="fallback_"+Date.now()}return o.forEach(r=>this.broadcastLocalUpdate(r)),u("success",`Deltas aplicados: ${o.length} mudanças em ${e.length} países`),m.info(`Deltas em massa aplicados (Batch ID: ${n}):`,o),n}catch(o){throw m.error("Erro na aplicação de deltas em massa:",o),u("error",`Erro nos deltas: ${o.message}`),o}}subscribeToCountryChanges(e,t){const a=p.collection("paises").doc(e).onSnapshot(o=>{o.exists&&t({countryId:e,data:o.data(),timestamp:new Date})},o=>{m.error("Erro no listener de mudanças:",o)});return this.listeners.set(`country_${e}`,a),a}subscribeToHistory(e,t){let a=p.collection("changeHistory");e.countryId&&(a=a.where("countryId","==",e.countryId)),e.section&&(a=a.where("section","==",e.section)),e.userId&&(a=a.where("userId","==",e.userId)),a=a.orderBy("timestamp","desc").limit(e.limit||50);const o=a.onSnapshot(r=>{const s=r.docs.map(i=>({id:i.id,...i.data(),timestamp:i.data().timestamp.toDate()}));t(s)},r=>{m.error("Erro no listener de histórico:",r)}),n=`history_${Date.now()}`;return this.listeners.set(n,o),{unsubscribe:o,listenerId:n}}unsubscribe(e){const t=this.listeners.get(e);return t?(t(),this.listeners.delete(e),!0):!1}unsubscribeAll(){this.listeners.forEach(e=>e()),this.listeners.clear()}async getCurrentFieldValue(e,t,a){const o=await p.collection("paises").doc(e).get();if(!o.exists)throw new Error(`País ${e} não encontrado`);return o.data()[t]?.[a]}async executeTransactionalUpdate(e,t){await p.runTransaction(async a=>{const o=new Map;e.forEach(n=>{o.has(n.countryId)||o.set(n.countryId,{});const r=o.get(n.countryId);r[n.section]||(r[n.section]={}),r[n.section][n.field]=n.newValue}),o.forEach((n,r)=>{const s=p.collection("paises").doc(r),i={};Object.entries(n).forEach(([l,d])=>{Object.entries(d).forEach(([h,v])=>{i[`${l}.${h}`]=v}),i[`${l}.lastModified`]=new Date,i[`${l}.lastModifiedBy`]=A.currentUser?.uid}),a.update(s,i)})});try{await Y.recordBatchChanges(e,t)}catch(a){m.warn("Erro ao registrar no histórico, continuando:",a.message)}}async executeBatchUpdate(e){const t=p.batch(),a=new Map;e.forEach(o=>{a.has(o.countryId)||a.set(o.countryId,{});const n=a.get(o.countryId);n[o.section]||(n[o.section]={}),n[o.section][o.field]=o.newValue}),a.forEach((o,n)=>{const r=p.collection("paises").doc(n),s={};Object.entries(o).forEach(([i,l])=>{Object.entries(l).forEach(([d,h])=>{s[`${i}.${d}`]=h}),s[`${i}.lastModified`]=new Date,s[`${i}.lastModifiedBy`]=A.currentUser?.uid}),t.update(r,s)}),await t.commit()}validateFieldValue(e,t,a){if(t==="PIB"&&a<0)throw new Error("PIB não pode ser negativo");if(t==="Estabilidade"&&(a<0||a>100))throw new Error("Estabilidade deve estar entre 0 e 100");if(t==="Tecnologia"&&(a<0||a>100))throw new Error("Tecnologia deve estar entre 0 e 100");if(t==="Urbanizacao"&&(a<0||a>100))throw new Error("Urbanização deve estar entre 0 e 100");if(t==="Populacao"&&a<0)throw new Error("População não pode ser negativa")}applyFieldLimits(e,t,a){return t==="Estabilidade"||t==="Tecnologia"||t==="Urbanizacao"?Math.max(0,Math.min(100,a)):t==="PIB"||t==="Populacao"?Math.max(0,a):e==="exercito"||e==="aeronautica"||e==="marinha"||e==="veiculos"?Math.max(0,Math.floor(a)):a}valuesEqual(e,t){return e===t?!0:typeof e=="number"&&typeof t=="number"?Math.abs(e-t)<.001:!1}broadcastLocalUpdate(e){window.dispatchEvent(new CustomEvent("realtime:update",{detail:e}))}setupConnectionHandlers(){window.addEventListener("online",()=>{this.isOnline=!0,m.info("Conexão restaurada, sincronizando mudanças offline"),this.syncOfflineChanges()}),window.addEventListener("offline",()=>{this.isOnline=!1,m.warn("Conexão perdida, mudanças serão enfileiradas")})}queueOfflineChange(e){const t=`${e.countryId}.${e.section}.${e.field}`;this.pendingChanges.set(t,{...e,timestamp:new Date}),u("info","Mudança salva localmente (offline)"),m.debug("Mudança enfileirada para sync:",e)}async syncOfflineChanges(){if(this.pendingChanges.size===0)return;const e=Array.from(this.pendingChanges.values());this.pendingChanges.clear();try{for(const t of e)await this.updateField({...t,reason:`Sync offline: ${t.reason||"Mudança feita offline"}`});u("success",`${e.length} mudanças sincronizadas`),m.info(`${e.length} mudanças offline sincronizadas`)}catch(t){m.error("Erro na sincronização offline:",t),e.forEach(a=>{const o=`${a.countryId}.${a.section}.${a.field}`;this.pendingChanges.set(o,a)})}}async executeDirectUpdate(e){for(const t of e)await this.saveWithRetry(t.countryId,t.section,t.field,t.newValue)}async saveWithRetry(e,t,a,o,n=3){for(let r=1;r<=n;r++)try{const s={};s[`${t}.${a}`]=o,s[`${t}.lastModified`]=new Date,s[`${t}.lastModifiedBy`]=A.currentUser?.uid,await p.collection("paises").doc(e).update(s),m.info(`Mudança salva (tentativa ${r}): ${e}.${t}.${a}`);return}catch(s){if((s.message.includes("ERR_BLOCKED_BY_CLIENT")||s.code==="unavailable"||s.code==="deadline-exceeded")&&r<n)m.warn(`Tentativa ${r} falhou (rede), tentando novamente em ${r*1e3}ms...`),await new Promise(l=>setTimeout(l,r*1e3));else throw m.error(`Falha após ${r} tentativas:`,s),this.broadcastLocalUpdate({countryId:e,section:t,field:a,oldValue:null,newValue:o}),u("warning","Conexão instável. A mudança pode não ter sido salva no servidor, mas foi aplicada localmente."),s}}}new Te;class Le{constructor(){this.players=[],this.countries=[],this.listeners=new Map,this.isLoading=!1}async loadPlayers(){if(this.isLoading)return this.players;try{this.isLoading=!0;const t=await p.collection("usuarios").get();return t.empty?(m.warn("Nenhum usuário encontrado na coleção"),this.players=[],this.players):(this.players=t.docs.map(a=>{const o=a.data();return{id:a.id,...o,lastLogin:o.ultimoLogin?.toDate(),createdAt:o.criadoEm?.toDate(),isOnline:o.ultimoLogin?Date.now()-o.ultimoLogin.toDate().getTime()<3e5:!1}}),m.debug(`${this.players.length} jogadores carregados`),this.players)}catch(e){if(m.error("Erro ao carregar jogadores:",e),e.code==="permission-denied")return m.warn("Acesso negado à coleção usuarios, usando dados limitados"),this.players=[],this.players;throw e}finally{this.isLoading=!1}}async loadCountries(){try{const{getAllCountries:e}=await T(async()=>{const{getAllCountries:t}=await import("./firebase-BDV7finj.js");return{getAllCountries:t}},__vite__mapDeps([0,1,2]));return this.countries=await e(),m.debug(`${this.countries.length} países carregados`),this.countries}catch(e){throw m.error("Erro ao carregar países:",e),e}}async assignCountryToPlayer(e,t,a=null){try{const o=this.players.find(s=>s.id===e),n=this.countries.find(s=>s.id===t);if(!o)throw new Error("Jogador não encontrado");if(!n)throw new Error("País não encontrado");if(n.Player&&n.Player!==e){const s=this.players.find(l=>l.id===n.Player);if(!await D("País já Atribuído",`O país ${n.Pais} já está atribuído a ${s?.nome}. Deseja transferir?`,"Transferir","Cancelar"))return!1}await p.runTransaction(async s=>{const i=p.collection("paises").doc(t),l=p.collection("usuarios").doc(e);s.update(i,{Player:e,DataVinculacao:firebase.firestore.Timestamp.now()}),s.update(l,{paisId:t,ultimaAtualizacao:firebase.firestore.Timestamp.now()})}),await Y.recordChange({countryId:t,section:"sistema",field:"Player",oldValue:n.Player||null,newValue:e,reason:a||"Atribuição de país via narrador"}),u("success",`País ${n.Pais} atribuído a ${o.nome}`),m.info(`País ${t} atribuído ao jogador ${e}`);const r=this.countries.findIndex(s=>s.id===t);return r>=0&&(this.countries[r].Player=e,this.countries[r].DataVinculacao=new Date),!0}catch(o){throw m.error("Erro na atribuição:",o),u("error",`Erro: ${o.message}`),o}}async unassignCountry(e,t=null){try{const a=this.countries.find(i=>i.id===e);if(!a)throw new Error("País não encontrado");const o=a.Player;if(!o)return u("info","País já não tem jogador atribuído"),!1;const n=this.players.find(i=>i.id===o);if(!await D("Confirmar Remoção",`Tem certeza que deseja remover ${n?.nome||"jogador"} do país ${a.Pais}?`,"Remover","Cancelar"))return!1;await p.runTransaction(async i=>{const l=p.collection("paises").doc(e),d=p.collection("usuarios").doc(o);i.update(l,{Player:firebase.firestore.FieldValue.delete(),DataVinculacao:firebase.firestore.FieldValue.delete()}),i.update(d,{paisId:firebase.firestore.FieldValue.delete(),ultimaAtualizacao:firebase.firestore.Timestamp.now()})}),await Y.recordChange({countryId:e,section:"sistema",field:"Player",oldValue:o,newValue:null,reason:t||"Remoção de atribuição via narrador"}),u("success",`Atribuição removida: ${a.Pais}`),m.info(`País ${e} desvinculado do jogador ${o}`);const s=this.countries.findIndex(i=>i.id===e);return s>=0&&(delete this.countries[s].Player,delete this.countries[s].DataVinculacao),!0}catch(a){throw m.error("Erro na remoção:",a),u("error",`Erro: ${a.message}`),a}}async assignRandomCountries(e=null){try{const t=this.countries.filter(h=>!h.Player),a=this.players.filter(h=>h.papel!=="admin"&&h.papel!=="narrador"&&!h.paisId);if(t.length===0){u("warning","Nenhum país disponível");return}if(a.length===0){u("warning","Nenhum jogador sem país");return}const o=Math.min(t.length,a.length,e||1/0);if(!await D("Atribuição Aleatória",`Atribuir aleatoriamente ${o} países a jogadores sem país?`,"Sim, Atribuir","Cancelar"))return;const r=this.shuffleArray([...t]),s=this.shuffleArray([...a]),i=[];for(let h=0;h<o;h++)i.push({playerId:s[h].id,countryId:r[h].id,playerName:s[h].nome,countryName:r[h].Pais});const l=[];for(const h of i)try{await this.assignCountryToPlayer(h.playerId,h.countryId,"Atribuição aleatória automática"),l.push({...h,success:!0})}catch(v){l.push({...h,success:!1,error:v.message})}const d=l.filter(h=>h.success).length;return u("success",`Atribuição aleatória concluída: ${d}/${o} sucessos`),l}catch(t){throw m.error("Erro na atribuição aleatória:",t),u("error",`Erro: ${t.message}`),t}}async clearAllAssignments(){try{const e=this.countries.filter(r=>r.Player);if(e.length===0){u("info","Nenhuma atribuição para remover");return}if(!await D("ATENÇÃO: Limpar Todas Atribuições",`Isso removerá TODAS as ${e.length} atribuições de países. Esta ação não pode ser desfeita facilmente.`,"Sim, Limpar Tudo","Cancelar")||!await D("Confirmação Final","Tem ABSOLUTA CERTEZA? Todos os jogadores perderão seus países.","CONFIRMAR LIMPEZA","Cancelar"))return;const o=p.batch(),n=[];e.forEach(r=>{const s=p.collection("paises").doc(r.id);if(o.update(s,{Player:firebase.firestore.FieldValue.delete(),DataVinculacao:firebase.firestore.FieldValue.delete()}),r.Player){const i=p.collection("usuarios").doc(r.Player);o.update(i,{paisId:firebase.firestore.FieldValue.delete(),ultimaAtualizacao:firebase.firestore.Timestamp.now()}),n.push({countryId:r.id,section:"sistema",field:"Player",oldValue:r.Player,newValue:null})}}),await o.commit(),await Y.recordBatchChanges(n,"Limpeza geral de atribuições"),this.countries.forEach(r=>{r.Player&&(delete r.Player,delete r.DataVinculacao)}),u("success",`${e.length} atribuições removidas`),m.info("Todas as atribuições foram removidas")}catch(e){throw m.error("Erro ao limpar atribuições:",e),u("error",`Erro: ${e.message}`),e}}getPlayerAnalytics(){const e=this.players.length,t=this.players.filter(v=>v.paisId).length,a=this.players.filter(v=>v.papel==="admin").length,o=this.players.filter(v=>v.papel==="narrador").length,n=this.countries.length,r=this.countries.filter(v=>v.Player).length,s=new Date,i=new Date(s.getTime()-1440*60*1e3),l=new Date(s.getTime()-10080*60*1e3),d=this.players.filter(v=>v.lastLogin&&v.lastLogin>i).length,h=this.players.filter(v=>v.lastLogin&&v.lastLogin>l).length;return{players:{total:e,active:t,inactive:e-t,admins:a,narrators:o,recentlyActive:d,weeklyActive:h},countries:{total:n,assigned:r,available:n-r,assignmentRate:(r/n*100).toFixed(1)},assignments:this.countries.filter(v=>v.Player).map(v=>{const w=this.players.find(C=>C.id===v.Player);return{countryId:v.id,countryName:v.Pais,playerId:v.Player,playerName:w?.nome||"Desconhecido",assignedAt:v.DataVinculacao}})}}async sendAnnouncement({title:e,message:t,targetPlayers:a="all",priority:o="normal"}){try{let n=[];switch(a){case"all":n=this.players.filter(i=>i.papel!=="admin");break;case"active":n=this.players.filter(i=>i.paisId&&i.papel!=="admin");break;case"inactive":n=this.players.filter(i=>!i.paisId&&i.papel!=="admin");break;default:Array.isArray(a)&&(n=this.players.filter(i=>a.includes(i.id)))}if(n.length===0){u("warning","Nenhum destinatário encontrado");return}const r={title:e,message:t,sender:A.currentUser?.uid,senderName:A.currentUser?.displayName||"Narrador",timestamp:firebase.firestore.Timestamp.now(),priority:o,read:!1},s=p.batch();n.forEach(i=>{const l=p.collection("notifications").doc();s.set(l,{...r,userId:i.id})}),await s.commit(),u("success",`Anúncio enviado para ${n.length} jogadores`),m.info(`Anúncio enviado para ${n.length} jogadores`)}catch(n){throw m.error("Erro ao enviar anúncio:",n),u("error",`Erro: ${n.message}`),n}}shuffleArray(e){const t=[...e];for(let a=t.length-1;a>0;a--){const o=Math.floor(Math.random()*(a+1));[t[a],t[o]]=[t[o],t[a]]}return t}setupRealTimeListeners(){m.info("Real-time listeners desabilitados - usando refresh periódico"),this.refreshInterval=setInterval(async()=>{try{this.isLoading||(await this.loadPlayers(),await this.loadCountries(),this.broadcastUpdate("periodic-refresh"))}catch(e){m.debug("Erro no refresh periódico (normal):",e.message)}},3e4),this.listeners.set("refreshInterval",this.refreshInterval)}broadcastUpdate(e){window.dispatchEvent(new CustomEvent("playerManager:update",{detail:{type:e,data:e==="players"?this.players:this.countries}}))}cleanup(){this.listeners.forEach((e,t)=>{t==="refreshInterval"?clearInterval(e):typeof e=="function"&&e()}),this.listeners.clear()}}const H=new Le;class Me{constructor(){this.pendingVehicles=[],this.approvedVehicles=[],this.rejectedVehicles=[],this.currentFilter="pending",this.currentSort="newest",this.pendingListener=null,this.setupEventListeners()}async initialize(){if(console.log("🚗 Inicializando sistema de aprovação de veículos..."),!window.firebase||!window.firebase.auth){console.error("❌ Firebase não inicializado");return}if(!window.firebase.auth().currentUser){console.log("⚠️ Usuário não logado, aguardando auth state..."),window.firebase.auth().onAuthStateChanged(t=>{t&&(console.log("✅ Usuário logado, inicializando sistema..."),this.loadAndRender())});return}await this.loadAndRender()}async loadAndRender(){await this.loadPendingVehicles(),this.render(),this.setupRealTimeListener(),setInterval(()=>this.refreshData(),3e4)}setupRealTimeListener(){try{console.log("🔄 Configurando listener em tempo real para veículos pendentes..."),this.pendingListener=p.collection("vehicles_pending").onSnapshot(e=>{console.log("🔔 Mudança detectada na coleção vehicles_pending"),e.empty?(console.log("⚠️ Coleção vazia"),this.pendingVehicles=[],this.render()):(console.log(`📊 ${e.size} documentos na coleção`),this.processPendingSnapshot(e))},e=>{console.error("❌ Erro no listener de veículos pendentes:",e),setTimeout(()=>this.refreshData(),5e3)})}catch(e){console.error("❌ Erro ao configurar listener:",e)}}processPendingSnapshot(e){try{const t=this.pendingVehicles.length;this.pendingVehicles=[];for(const o of e.docs)try{const n=o.data();let r=new Date;n.submittedAt&&n.submittedAt.toDate?r=n.submittedAt.toDate():n.submissionDate&&n.submissionDate.toDate&&(r=n.submissionDate.toDate());const s={id:o.id,...n,submissionDate:r};this.pendingVehicles.push(s)}catch(n){console.error("❌ Erro ao processar documento no snapshot:",o.id,n)}const a=this.pendingVehicles.length;if(console.log(`🔔 Atualização em tempo real: ${a} veículos pendentes`),a>t){const o=a-t;console.log(`🆕 ${o} novo(s) veículo(s) recebido(s)!`),this.showNewVehicleNotification(o)}this.currentFilter==="pending"&&this.render()}catch(t){console.error("❌ Erro ao processar snapshot:",t)}}showNewVehicleNotification(e){const t=document.createElement("div");t.className="fixed top-4 right-4 bg-brand-500 text-slate-900 px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce",t.style.zIndex="10000",t.innerHTML=`🆕 ${e} novo(s) veículo(s) para aprovação!`,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},5e3)}destroy(){this.pendingListener&&(console.log("🧹 Removendo listener de veículos pendentes..."),this.pendingListener(),this.pendingListener=null)}setupEventListeners(){document.addEventListener("click",e=>{if(e.target.matches("[data-filter]")&&(this.currentFilter=e.target.dataset.filter,this.render()),e.target.matches("[data-sort]")&&(this.currentSort=e.target.dataset.sort,this.render()),e.target.matches("[data-approve]")){const t=e.target.dataset.approve;this.showApprovalModal(t)}if(e.target.matches("[data-reject]")){const t=e.target.dataset.reject;this.rejectVehicle(t)}if(e.target.matches("[data-view-sheet]")){const t=e.target.dataset.viewSheet;this.viewVehicleSheet(t)}e.target.id==="refresh-vehicles"&&this.refreshData(),e.target.id==="debug-vehicles"&&this.debugSystem(),e.target.id==="force-reload"&&this.forceReload(),e.target.id==="bulk-approve"&&this.bulkApprove(),e.target.id==="bulk-reject"&&this.bulkReject()})}async loadPendingVehicles(){try{console.log("🔍 Buscando veículos pendentes..."),this.pendingVehicles=[];const e=await p.collection("vehicles_pending").get();if(console.log(`📊 Total de documentos encontrados: ${e.size}`),e.empty){console.log("⚠️ Nenhum veículo pendente encontrado");return}for(const t of e.docs)try{const a=t.data();console.log("🔍 Processando documento:",t.id,Object.keys(a));let o=new Date;a.submittedAt&&a.submittedAt.toDate?o=a.submittedAt.toDate():a.submissionDate&&a.submissionDate.toDate&&(o=a.submissionDate.toDate());const n={id:t.id,...a,submissionDate:o};this.pendingVehicles.push(n),console.log("✅ Veículo adicionado:",n.id,n.vehicleData?.name||"Nome não encontrado")}catch(a){console.error("❌ Erro ao processar documento:",t.id,a)}console.log(`📋 ${this.pendingVehicles.length} veículos pendentes carregados com sucesso`)}catch(e){console.error("❌ Erro ao carregar veículos pendentes:",e),console.error("📋 Detalhes do erro:",e.code,e.message),this.pendingVehicles=[]}}async loadApprovedVehicles(){try{console.log("🔄 Carregando veículos aprovados (nova estrutura)...");const e=await p.collection("vehicles_approved").get();this.approvedVehicles=[];for(const t of e.docs){const a=t.id;console.log(`📁 Processando país: ${a}`),(await p.collection("vehicles_approved").doc(a).collection("vehicles").orderBy("approvalDate","desc").limit(20).get()).docs.forEach(n=>{this.approvedVehicles.push({id:n.id,...n.data(),approvalDate:n.data().approvalDate?.toDate()||new Date})})}this.approvedVehicles.sort((t,a)=>(a.approvalDate||0)-(t.approvalDate||0)),this.approvedVehicles=this.approvedVehicles.slice(0,50),console.log(`✅ ${this.approvedVehicles.length} veículos aprovados carregados`)}catch(e){console.error("❌ Erro ao carregar veículos aprovados:",e),this.approvedVehicles=[]}}async loadRejectedVehicles(){try{const e=await p.collection("vehicles_rejected").orderBy("rejectionDate","desc").limit(50).get();this.rejectedVehicles=e.docs.map(t=>({id:t.id,...t.data(),rejectionDate:t.data().rejectionDate?.toDate()||new Date})),console.log(`❌ ${this.rejectedVehicles.length} veículos rejeitados carregados`)}catch(e){console.error("❌ Erro ao carregar veículos rejeitados:",e),this.rejectedVehicles=[]}}async refreshData(){console.log("🔄 Atualizando dados de aprovação..."),this.currentFilter==="pending"?await this.loadPendingVehicles():this.currentFilter==="approved"?await this.loadApprovedVehicles():this.currentFilter==="rejected"&&await this.loadRejectedVehicles(),this.render()}render(){const e=document.getElementById("vehicle-approval-anchor");e&&(e.innerHTML=this.getHTML(),this.updateStats())}getHTML(){const e=this.getFilteredVehicles();return`
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
        `}renderVehicleCard(e){const t={pending:"border-brand-500/30 bg-brand-500/5",approved:"border-emerald-500/30 bg-emerald-500/5",rejected:"border-red-500/30 bg-red-500/5"},a=r=>new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}).format(r),o=e.vehicleData||{},n=o.total_cost||o.totalCost||0;return`
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
                            <div>💰 <strong>Custo unitário:</strong> $${n.toLocaleString()}</div>
                            <div>💰 <strong>Custo total:</strong> $${((n||0)*(e.quantity||1)).toLocaleString()}</div>
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
        `}getFilteredVehicles(){let e=[];switch(this.currentFilter){case"pending":e=[...this.pendingVehicles];break;case"approved":e=[...this.approvedVehicles];break;case"rejected":e=[...this.rejectedVehicles];break}switch(this.currentSort){case"newest":e.sort((t,a)=>(a.submissionDate||a.approvalDate||a.rejectionDate)-(t.submissionDate||t.approvalDate||t.rejectionDate));break;case"oldest":e.sort((t,a)=>(t.submissionDate||t.approvalDate||t.rejectionDate)-(a.submissionDate||a.approvalDate||a.rejectionDate));break;case"country":e.sort((t,a)=>(t.countryName||"").localeCompare(a.countryName||""));break;case"category":e.sort((t,a)=>(t.category||"").localeCompare(a.category||""));break}return e}async showApprovalModal(e){try{const t=this.pendingVehicles.find(C=>C.id===e);if(!t){alert("Veículo não encontrado");return}const a=t.vehicleData||{},o=t.quantity||1,n=a.total_cost||a.totalCost||0,r=document.getElementById("approval-modal");r&&r.remove();const s=document.createElement("div");s.id="approval-modal",s.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",s.style.zIndex="9999";const i=document.createElement("div");i.className="bg-bg border border-emerald-500/50 rounded-2xl max-w-md w-full p-6",i.innerHTML=`
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
                        <div><strong>Custo unitário:</strong> $${n.toLocaleString()}</div>
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
                            <span class="font-semibold">Custo total: $<span id="total-cost" class="text-emerald-300">${(n*o).toLocaleString()}</span></span>
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
            `,s.appendChild(i);const l=i.querySelector("#approval-quantity-slider"),d=i.querySelector("#current-quantity"),h=i.querySelector("#total-cost");l.addEventListener("input",C=>{const S=parseInt(C.target.value);d.textContent=S,h.textContent=(n*S).toLocaleString()});const v=i.querySelector("#confirm-approval"),w=i.querySelector("#cancel-approval");v.addEventListener("click",()=>{const C=parseInt(l.value);s.remove(),this.approveVehicle(e,C)}),w.addEventListener("click",()=>{s.remove()}),s.addEventListener("click",C=>{C.target===s&&s.remove()}),document.addEventListener("keydown",function C(S){S.key==="Escape"&&(s.remove(),document.removeEventListener("keydown",C))}),document.body.appendChild(s),l.focus()}catch(t){console.error("❌ Erro ao mostrar modal de aprovação:",t),alert("Erro ao abrir modal: "+t.message)}}async approveVehicle(e,t=null){try{console.log(`✅ Aprovando veículo ${e}...`);const a=await p.collection("vehicles_pending").doc(e).get();if(!a.exists)throw new Error("Veículo não encontrado");const o=a.data(),n=o.quantity||1,r=t||n;console.log(`📦 Quantidade original: ${n}, aprovada: ${r}`),console.log(`📁 Salvando na nova estrutura: vehicles_approved/${o.countryId}/vehicles/${e}`),await p.collection("vehicles_approved").doc(o.countryId).collection("vehicles").doc(e).set({...o,quantity:r,originalQuantity:n,approvalDate:new Date,status:"approved"}),console.log("✅ Veículo salvo na nova estrutura Firebase"),console.log("🔍 Dados do veículo antes de adicionar ao inventário:",{countryId:o.countryId,category:o.category,vehicleName:o.vehicleData?.name,quantity:r}),await this.addToInventory({...o,quantity:r}),await p.collection("vehicles_pending").doc(e).delete(),await this.refreshData(),console.log(`✅ Veículo ${e} aprovado: ${r}/${n} unidades`)}catch(a){console.error("❌ Erro ao aprovar veículo:",a),alert("Erro ao aprovar veículo: "+a.message)}}async rejectVehicle(e){try{const t=prompt("Motivo da rejeição (opcional):");console.log(`❌ Rejeitando veículo ${e}...`);const a=await p.collection("vehicles_pending").doc(e).get();if(!a.exists)throw new Error("Veículo não encontrado");const o=a.data();await this.deleteVehicleFiles(o),console.log("🗑️ Veículo rejeitado e arquivos deletados:",{vehicleId:e,vehicleName:o.vehicleData?.name,countryName:o.countryName,rejectionReason:t||"Sem motivo especificado",rejectionDate:new Date().toISOString()}),await p.collection("vehicles_pending").doc(e).delete(),await this.refreshData(),console.log(`✅ Veículo ${e} rejeitado e limpo do sistema`)}catch(t){console.error("❌ Erro ao rejeitar veículo:",t),alert("Erro ao rejeitar veículo: "+t.message)}}async deleteVehicleFiles(e){try{if(console.log("🗑️ Iniciando limpeza de arquivos do veículo rejeitado..."),!window.firebase?.storage){console.warn("⚠️ Firebase Storage não disponível, pulando limpeza de arquivos");return}const t=window.firebase.storage(),a=[];e.imageUrl&&a.push({url:e.imageUrl,type:"PNG"}),e.vehicleSheetImageUrl&&e.vehicleSheetImageUrl.startsWith("http")&&a.push({url:e.vehicleSheetImageUrl,type:"PNG/HTML"});for(const o of a)try{await t.refFromURL(o.url).delete(),console.log(`✅ Arquivo ${o.type} deletado:`,o.url)}catch(n){console.warn(`⚠️ Erro ao deletar arquivo ${o.type}:`,n)}console.log(`✅ Limpeza de arquivos concluída. ${a.length} arquivos processados.`)}catch(t){console.error("❌ Erro geral na limpeza de arquivos:",t)}}async addToInventory(e){try{const t=p.collection("inventory").doc(e.countryId),a=await t.get();let o={};a.exists&&(o=a.data());const n=e.category||"Other";o[n]||(o[n]={});const r=e.vehicleData?.name||e.vehicleData?.vehicle_name||"Veículo Sem Nome";if(!o[n][r]){const s={"vehicleData.vehicleData?.total_cost":e.vehicleData?.total_cost,"vehicleData.vehicleData?.totalCost":e.vehicleData?.totalCost,"vehicleData.total_cost":e.total_cost,"vehicleData.totalCost":e.totalCost,"vehicleData.cost":e.cost};console.log("🔍 Custos possíveis para",r,":",s);const i=e.vehicleData?.total_cost||e.vehicleData?.totalCost||e.total_cost||e.totalCost||e.cost||0;console.log("💰 Custo unitário calculado:",i);const l={quantity:0,specs:e.vehicleData||{},cost:i,approvedDate:new Date().toISOString(),approvedBy:"narrator"};(e.imageUrl||e.vehicleSheetImageUrl)&&(l.sheetImageUrl=e.imageUrl||e.vehicleSheetImageUrl),e.vehicleSheetHtmlUrl&&(l.sheetHtmlUrl=e.vehicleSheetHtmlUrl),o[n][r]=l}o[n][r].quantity+=e.quantity||1,await t.set(o,{merge:!0}),console.log(`📦 ${e.quantity||1}x ${r} adicionado ao inventário com ficha de ${e.countryName}`)}catch(t){console.error("❌ Erro ao adicionar ao inventário:",t)}}async viewVehicleSheet(e){try{const a=[...this.pendingVehicles,...this.approvedVehicles,...this.rejectedVehicles].find(n=>n.id===e);if(!a){alert("Veículo não encontrado");return}console.log("🔍 Campos do veículo:",Object.keys(a)),console.log("🔍 imageUrl:",a.imageUrl),console.log("🔍 vehicleSheetImageUrl:",a.vehicleSheetImageUrl?.substring(0,50)+"...");let o=null;if(a.imageUrl&&a.imageUrl.startsWith("http")?(o=a.imageUrl,console.log("✅ Usando imageUrl (Firebase Storage):",o)):a.vehicleSheetImageUrl&&a.vehicleSheetImageUrl.startsWith("http")?(o=a.vehicleSheetImageUrl,console.log("✅ Usando vehicleSheetImageUrl (Firebase Storage):",o)):a.vehicleSheetImageUrl&&a.vehicleSheetImageUrl.startsWith("data:text/html")?(o=a.vehicleSheetImageUrl,console.log("⚠️ Usando HTML fallback")):console.error("❌ Nenhuma URL de imagem encontrada"),!o){alert("Ficha do veículo não encontrada");return}console.log("🖼️ Abrindo ficha em modal para veículo:",e),this.showVehicleSheetModal(a,o)}catch(t){console.error("❌ Erro ao visualizar ficha:",t),alert("Erro ao abrir ficha: "+t.message)}}showVehicleSheetModal(e,t){const a=document.getElementById("vehicle-sheet-modal");a&&a.remove();const o=document.createElement("div");o.id="vehicle-sheet-modal",o.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",o.style.zIndex="9999";const n=document.createElement("div");n.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col";const r=document.createElement("div");r.className="flex items-center justify-between p-4 border-b border-bg-ring/50",r.innerHTML=`
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
        `;const s=document.createElement("div");if(s.className="flex-1 overflow-auto p-4",t.startsWith("data:text/html")){const d=document.createElement("iframe");d.src=t,d.style.cssText="width: 100%; height: 70vh; border: none; border-radius: 8px;",d.onload=()=>{console.log("✅ Ficha carregada no iframe")},d.onerror=()=>{console.error("❌ Erro ao carregar ficha no iframe"),s.innerHTML='<p class="text-red-400">Erro ao carregar ficha</p>'},s.innerHTML="",s.appendChild(d)}else t.startsWith("http")?s.innerHTML=`
                <div class="text-center">
                    <img src="${t}" alt="Ficha do Veículo" class="max-w-full max-h-full mx-auto rounded-lg shadow-lg" 
                         style="max-height: 70vh;" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;">
                </div>
            `:s.innerHTML='<p class="text-red-400">Formato de ficha não suportado</p>';n.appendChild(r),n.appendChild(s),o.appendChild(n);const i=()=>{o.remove()},l=()=>{if(t.startsWith("data:text/html")){const d=decodeURIComponent(t.split(",")[1]),h=window.open("","_blank","width=800,height=600,scrollbars=yes,resizable=yes");h&&(h.document.open(),h.document.write(d),h.document.close(),h.document.title=`Ficha - ${e.vehicleData?.name||"Veículo"}`)}else window.open(t,"_blank")};o.addEventListener("click",d=>{d.target===o&&i()}),r.querySelector("#close-modal").addEventListener("click",i),r.querySelector("#open-in-new-tab").addEventListener("click",l),document.addEventListener("keydown",function d(h){h.key==="Escape"&&(i(),document.removeEventListener("keydown",d))}),document.body.appendChild(o),o.focus()}async bulkApprove(){const e=this.getSelectedVehicles();if(e.length===0){alert("Selecione pelo menos um veículo");return}if(confirm(`Aprovar ${e.length} veículo(s) selecionado(s)?`))for(const t of e)await this.approveVehicle(t)}async bulkReject(){const e=this.getSelectedVehicles();if(e.length===0){alert("Selecione pelo menos um veículo");return}if(prompt("Motivo da rejeição em lote (opcional):"),!!confirm(`Rejeitar ${e.length} veículo(s) selecionado(s)?

Todos os arquivos associados serão removidos para economizar espaço.`)){console.log(`🗑️ Iniciando rejeição em lote de ${e.length} veículos...`);for(const t of e)await this.rejectVehicle(t);console.log(`✅ Rejeição em lote concluída. ${e.length} veículos e arquivos removidos.`)}}getSelectedVehicles(){const e=document.querySelectorAll(".vehicle-select:checked");return Array.from(e).map(t=>t.dataset.vehicleId)}updateStats(){const e=document.getElementById("pending-count");e&&(e.textContent=this.pendingVehicles.length)}async debugSystem(){console.log("🔍 === DEBUG DO SISTEMA DE APROVAÇÃO ===");try{console.log("🔥 Firebase auth:",window.firebase?.auth()),console.log("👤 Current user:",window.firebase?.auth()?.currentUser),console.log("🗃️ Firestore db:",p);const e=p.collection("vehicles_pending");console.log("📁 Pending collection ref:",e);const t=await e.get();if(console.log("📊 Snapshot size:",t.size),console.log("📊 Snapshot empty:",t.empty),!t.empty){t.docs.forEach((o,n)=>{console.log(`📄 Doc ${n+1}:`,o.id,o.data())}),console.log("🔧 FORÇANDO PROCESSAMENTO DOS DOCUMENTOS:");const a=[];for(const o of t.docs)try{const n=o.data();console.log("🔍 Processando no debug:",o.id,Object.keys(n));let r=new Date;n.submittedAt&&n.submittedAt.toDate&&(r=n.submittedAt.toDate());const s={id:o.id,...n,submissionDate:r};a.push(s),console.log("✅ Processado no debug:",s.id,s.vehicleData?.name)}catch(n){console.error("❌ Erro no debug:",n)}console.log("🚀 Total processado no debug:",a.length)}console.log("🧠 Current pending vehicles:",this.pendingVehicles),console.log("🎯 Current filter:",this.currentFilter)}catch(e){console.error("💥 Debug error:",e)}console.log("🔍 === FIM DO DEBUG ===")}async forceReload(){console.log("🔧 === FORCE RELOAD INICIADO ===");try{this.pendingVehicles=[];const e=await p.collection("vehicles_pending").get();console.log("📊 Force reload - documents found:",e.size);for(const t of e.docs){const a=t.data();console.log("🔍 Processing in force reload:",t.id);let o=new Date;a.submittedAt&&a.submittedAt.toDate?o=a.submittedAt.toDate():a.submissionDate&&a.submissionDate.toDate&&(o=a.submissionDate.toDate());const n={id:t.id,...a,submissionDate:o};this.pendingVehicles.push(n),console.log("✅ Added vehicle:",n.id,n.vehicleData?.name)}console.log("🚀 Force reload completed:",this.pendingVehicles.length,"vehicles"),this.render()}catch(e){console.error("❌ Force reload failed:",e)}console.log("🔧 === FORCE RELOAD FIM ===")}}const be={vehicles:{Howitzer:{name:"Howitzer Genérico",description:"Peça de artilharia rebocada",stats:{armor:0,firepower:75,speed:0,reliability:80,cost:5e4},icon:"🎯",year:1954},SPA:{name:"SPA Genérico",description:"Artilharia autopropulsada",stats:{armor:20,firepower:70,speed:30,reliability:75,cost:65e3},icon:"💥",year:1954},Antiaerea:{name:"Antiaérea Genérica",description:"Artilharia antiaérea",stats:{armor:0,firepower:40,speed:0,reliability:80,cost:3e4},icon:"🎪",year:1954},SPAA:{name:"SPAA Genérico",description:"Artilharia Antiaérea Autopropulsada",stats:{armor:15,firepower:35,speed:40,reliability:80,cost:4e4},icon:"🎪",year:1954},APC:{name:"APC Genérico",description:"Transporte de Pessoal Blindado",stats:{armor:15,firepower:10,speed:50,reliability:85,cost:25e3},icon:"🚐",year:1954},IFV:{name:"IFV Genérico",description:"Veículo de Combate de Infantaria",stats:{armor:20,firepower:25,speed:45,reliability:80,cost:35e3},icon:"👥",year:1954},TanqueLeve:{name:"Tanque Leve Genérico",description:"Tanque leve de reconhecimento e apoio",stats:{armor:30,firepower:35,speed:50,reliability:85,cost:4e4},icon:"🛡️",year:1954},MBT:{name:"MBT Genérico",description:"Tanque de Batalha Principal",stats:{armor:50,firepower:50,speed:40,reliability:80,cost:8e4},icon:"🛡️",year:1954},Transporte:{name:"Transporte Genérico",description:"Veículo de transporte de pessoal e suprimentos",stats:{armor:5,firepower:0,speed:60,reliability:90,cost:15e3},icon:"🚚",year:1954},Utilitarios:{name:"Utilitários Genéricos",description:"Veículos utilitários diversos",stats:{armor:5,firepower:0,speed:70,reliability:95,cost:1e4},icon:"🚙",year:1954}},aircraft:{Caca:{name:"Caça Genérico",description:"Caça para superioridade aérea",stats:{speed:900,maneuverability:75,firepower:45,range:1200,cost:25e4},icon:"✈️",year:1954},CAS:{name:"CAS Genérico",description:"Close Air Support - Apoio aéreo aproximado",stats:{speed:600,maneuverability:60,firepower:70,range:800,cost:18e4},icon:"💣",year:1954},Bomber:{name:"Bomber Genérico",description:"Bombardeiro tático",stats:{speed:550,maneuverability:40,firepower:80,range:2500,cost:4e5},icon:"✈️",year:1954},BomberAJato:{name:"Bomber a Jato Genérico",description:"Bombardeiro tático a jato",stats:{speed:850,maneuverability:45,firepower:85,range:3e3,cost:6e5},icon:"✈️",year:1954},BomberEstrategico:{name:"Bomber Estratégico Genérico",description:"Bombardeiro pesado estratégico",stats:{speed:500,maneuverability:30,firepower:100,range:5e3,cost:9e5},icon:"🛫",year:1954},BomberEstrategicoAJato:{name:"Bomber Estratégico a Jato Genérico",description:"Bombardeiro estratégico a jato",stats:{speed:900,maneuverability:35,firepower:105,range:6e3,cost:15e5},icon:"🛫",year:1954},AWAC:{name:"AWAC Genérico",description:"Aeronave de alerta e controle antecipado",stats:{speed:600,maneuverability:40,firepower:0,range:4e3,cost:8e5},icon:"📡",year:1954},HeliTransporte:{name:"Helicóptero de Transporte Genérico",description:"Helicóptero para transporte de tropas",stats:{speed:250,maneuverability:70,firepower:5,range:400,cost:12e4},icon:"🚁",year:1954},HeliAtaque:{name:"Helicóptero de Ataque Genérico",description:"Helicóptero de combate",stats:{speed:280,maneuverability:75,firepower:50,range:500,cost:2e5},icon:"🚁",year:1954},TransporteAereo:{name:"Transporte Aéreo Genérico",description:"Aeronave de transporte de passageiros",stats:{speed:500,maneuverability:35,firepower:0,range:3e3,cost:3e5},icon:"✈️",year:1954},Carga:{name:"Aeronave de Carga Genérica",description:"Aeronave de transporte de carga pesada",stats:{speed:450,maneuverability:30,firepower:0,range:3500,cost:35e4},icon:"✈️",year:1954}},naval:{PAEsquadra:{name:"PA de Esquadra Genérico",description:"Porta-Aviões de Esquadra",stats:{armor:60,firepower:50,speed:32,range:1e4,cost:25e6},icon:"🛩️",year:1954},PAEscolta:{name:"PA de Escolta Genérico",description:"Porta-Aviões de Escolta",stats:{armor:40,firepower:35,speed:28,range:8e3,cost:12e6},icon:"🛩️",year:1954},Encouracado:{name:"Encouraçado Genérico",description:"Navio de batalha pesado",stats:{armor:95,firepower:100,speed:28,range:8e3,cost:2e7},icon:"⚓",year:1954},CruzadorMisseis:{name:"Cruzador de Mísseis Genérico",description:"Cruzador armado com mísseis",stats:{armor:65,firepower:80,speed:32,range:7e3,cost:12e6},icon:"🚢",year:1954},Cruzador:{name:"Cruzador Genérico",description:"Cruzador padrão",stats:{armor:60,firepower:70,speed:32,range:6500,cost:8e6},icon:"🚢",year:1954},Fragata:{name:"Fragata Genérica",description:"Navio de escolta e patrulha",stats:{armor:35,firepower:45,speed:30,range:5e3,cost:4e6},icon:"🚤",year:1954},Destroyer:{name:"Destroyer Genérico",description:"Contratorpedeiro de escolta e ataque",stats:{armor:45,firepower:60,speed:35,range:5500,cost:6e6},icon:"🛥️",year:1954},Submarino:{name:"Submarino Genérico",description:"Submarino convencional diesel-elétrico",stats:{armor:20,firepower:70,speed:22,range:8e3,cost:5e6},icon:"🤿",year:1954},SubmarinoBalístico:{name:"Submarino Balístico Genérico",description:"Submarino com mísseis balísticos",stats:{armor:25,firepower:90,speed:24,range:1e4,cost:3e7},icon:"🚀",year:1954},SubmarinoNuclear:{name:"Submarino Nuclear Genérico",description:"Submarino com propulsão nuclear",stats:{armor:30,firepower:85,speed:32,range:99999,cost:5e7},icon:"☢️",year:1954},TransporteNaval:{name:"Transporte Naval Genérico",description:"Navio de transporte de tropas e carga",stats:{armor:15,firepower:10,speed:20,range:7e3,cost:2e6},icon:"🚢",year:1954},Desembarque:{name:"Navio de Desembarque Genérico",description:"Navio para operações anfíbias",stats:{armor:25,firepower:25,speed:22,range:6e3,cost:35e5},icon:"⚓",year:1954}}};function G(c,e){return be[c]?.[e]||null}class De{constructor(){this.selectedCountry=null,this.selectedType="vehicles",this.countries=[],this.currentInventory={}}async initialize(){console.log("⚙️ Inicializando Gerenciador de Equipamentos Genéricos..."),await this.loadCountries(),this.attachButtonListener()}async loadCountries(){try{const e=await p.collection("paises").orderBy("Pais").get();this.countries=e.docs.map(t=>({id:t.id,...t.data()}))}catch(e){console.error("Erro ao carregar países:",e),this.countries=[]}}attachButtonListener(){const e=document.getElementById("open-generic-equipment-manager");e?(e.addEventListener("click",()=>{this.openModal()}),console.log("✅ Gerenciador de Equipamentos Genéricos pronto (botão conectado)")):(console.warn("⚠️ Botão open-generic-equipment-manager não encontrado, tentando novamente..."),setTimeout(()=>this.attachButtonListener(),500))}openModal(){this.renderModal()}renderModal(){const e=document.getElementById("generic-equipment-modal");e&&e.remove();const t=document.createElement("div");t.id="generic-equipment-modal",t.innerHTML=this.getModalHTML(),document.body.appendChild(t),this.setupEventListeners()}closeModal(){const e=document.getElementById("generic-equipment-modal");e&&e.remove()}getModalHTML(){return`
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
      `}getEquipmentCardsHTML(){const e=be[this.selectedType]||{},t=Object.keys(e);return t.length===0?'<p class="text-slate-400 col-span-full text-center py-8">Nenhum equipamento disponível</p>':t.map(a=>{const o=e[a];return`
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
    `}setupEventListeners(){const e=document.getElementById("close-generic-equipment-modal");e&&e.addEventListener("click",()=>this.closeModal());const t=document.getElementById("generic-equipment-backdrop");t&&t.addEventListener("click",o=>{o.target===t&&this.closeModal()});const a=document.getElementById("generic-country-select");a&&a.addEventListener("change",o=>{this.selectedCountry=o.target.value,this.selectedCountry?this.loadCountryInventory(this.selectedCountry):(this.currentInventory={},this.renderContent())}),document.addEventListener("click",o=>{if(o.target.matches(".generic-type-tab")&&(this.selectedType=o.target.dataset.type,this.renderContent()),o.target.matches(".add-generic-equipment")){const n=o.target.dataset.category,r=o.target.dataset.type,s=document.getElementById(`qty-${n}`),i=parseInt(s?.value||10);i>0&&this.addEquipment(r,n,i)}if(o.target.matches(".edit-generic-qty")){const n=o.target.dataset.itemId;this.editQuantity(n)}if(o.target.matches(".remove-generic-equipment")){const n=o.target.dataset.itemId;this.removeEquipment(n)}o.target.id==="refresh-generic-equipment"&&this.selectedCountry&&this.loadCountryInventory(this.selectedCountry)})}async loadCountryInventory(e){try{const t=await p.collection("paises").doc(e).get();if(!t.exists){this.currentInventory={},this.renderContent();return}const o=t.data().inventario||{};this.currentInventory={},Object.keys(o).forEach(n=>{const r=o[n];if(r>0){let s="vehicles",i=G("vehicles",n);i||(i=G("aircraft",n),s="aircraft"),i||(i=G("naval",n),s="naval"),i&&(this.currentInventory[n]={id:n,category:n,type:s,name:i.name,quantity:r,icon:i.icon})}}),this.renderContent()}catch(t){console.error("Erro ao carregar inventário:",t),alert("Erro ao carregar inventário: "+t.message)}}async addEquipment(e,t,a){if(!this.selectedCountry){alert("Selecione um país primeiro!");return}const o=G(e,t);if(!o){alert("Equipamento não encontrado!");return}try{const n=await p.collection("paises").doc(this.selectedCountry).get();if(!n.exists){alert("País não encontrado!");return}const l=((n.data().inventario||{})[t]||0)+a;await p.collection("paises").doc(this.selectedCountry).update({[`inventario.${t}`]:l}),await this.syncToInventoryCollection(t,o,l),alert(`✅ ${a}x ${o.name} adicionado!
Total agora: ${l}`),await this.loadCountryInventory(this.selectedCountry)}catch(n){console.error("Erro ao adicionar equipamento:",n),alert("Erro ao adicionar equipamento: "+n.message)}}async syncToInventoryCollection(e,t,a){try{const o=p.collection("inventory").doc(this.selectedCountry),n=await o.get();let r={};n.exists&&(r=n.data()),r[e]||(r[e]={});const s=t.name;r[e][s]={quantity:a,specs:t.stats||{},cost:t.stats?.cost||0,icon:t.icon,description:t.description,year:t.year||1954,updatedAt:new Date().toISOString(),approvedBy:"narrator"},await o.set(r,{merge:!0})}catch(o){console.error("Erro ao sincronizar com coleção inventory:",o)}}async editQuantity(e){const t=this.currentInventory[e];if(!t)return;const a=prompt(`Nova quantidade para ${t.name}:`,t.quantity);if(a===null)return;const o=parseInt(a);if(isNaN(o)||o<0){alert("Quantidade inválida!");return}try{if(o===0){await this.removeEquipment(e);return}await p.collection("paises").doc(this.selectedCountry).update({[`inventario.${e}`]:o});const n=G(t.type,e);n&&await this.syncToInventoryCollection(e,n,o),alert(`✅ Quantidade atualizada para ${o}`),await this.loadCountryInventory(this.selectedCountry)}catch(n){console.error("Erro ao atualizar quantidade:",n),alert("Erro ao atualizar: "+n.message)}}async removeEquipment(e){const t=this.currentInventory[e];if(t&&confirm(`Remover ${t.name} do inventário?`))try{await p.collection("paises").doc(this.selectedCountry).update({[`inventario.${e}`]:0});const a=p.collection("inventory").doc(this.selectedCountry),o=await a.get();if(o.exists){const n=o.data(),r=G(t.type,e);if(r&&n[e]){const s=r.name;if(n[e]&&n[e][s]){const i={...n};delete i[e][s],Object.keys(i[e]).length===0&&delete i[e],Object.keys(i).length===0?await a.delete():await a.set(i)}}}alert(`✅ ${t.name} removido do inventário!`),await this.loadCountryInventory(this.selectedCountry)}catch(a){console.error("Erro ao remover equipamento:",a),alert("Erro ao remover: "+a.message)}}renderContent(){const e=document.getElementById("generic-equipment-content");e&&(e.innerHTML=this.getContentHTML())}}class je{constructor(){this.countries=[],this.selectedCountry=null,this.originalData=null,this.fieldGetters=new Map,this.hasUnsavedChanges=!1,this.fieldSchema={"geral-politico":{title:"Geral e Político",fields:[{key:"Pais",label:"Nome do País",type:"text",required:!0},{key:"Player",label:"Jogador (UID)",type:"text"},{key:"ModeloPolitico",label:"Modelo Político",type:"text"},{key:"Populacao",label:"População",type:"number",min:0,step:1e3},{key:"Estabilidade",label:"Estabilidade (%)",type:"number",min:0,max:100,step:.1},{key:"Burocracia",label:"Burocracia (%)",type:"number",min:0,max:100,step:.1},{key:"Urbanizacao",label:"Urbanização (%)",type:"number",min:0,max:100,step:.1},{key:"Visibilidade",label:"Visibilidade",type:"select",options:["Público","Privado"]},{key:"Ativo",label:"País Ativo",type:"checkbox"},{key:"DataCriacao",label:"Data de Criação",type:"readonly",description:"Timestamp automático do Firebase"},{key:"DataVinculacao",label:"Data de Vinculação",type:"readonly",description:"Timestamp de quando jogador foi vinculado"}]},"economia-recursos":{title:"Economia e Recursos",fields:[{key:"PIB",label:"PIB Total",type:"calculated",formula:"PIBPerCapita * Populacao"},{key:"PIBPerCapita",label:"PIB per Capita",type:"number",min:0,step:.01},{key:"IndustrialEfficiency",label:"Eficiência Industrial (%)",type:"number",min:0,max:200,step:.1},{key:"PoliticaIndustrial",label:"Política Industrial",type:"select",options:["combustivel","metais","graos","energia","balanceada"]},{key:"BensDeConsumo",label:"Bens de Consumo (estoque)",type:"number",min:0},{key:"OrcamentoGasto",label:"Orçamento Gasto",type:"number",min:0},{key:"TurnoUltimaAtualizacao",label:"Turno Última Atualização",type:"number",min:0,step:1},{key:"Graos",label:"Grãos (estoque)",type:"number",min:0,step:1},{key:"PotencialAgricola",label:"Potencial Agrícola",type:"number",min:0,step:1},{key:"ProducaoGraos",label:"Produção de Grãos (mensal)",type:"number",min:0,step:1},{key:"ConsumoGraos",label:"Consumo de Grãos (mensal)",type:"number",min:0,step:1},{key:"Combustivel",label:"Combustível (estoque)",type:"number",min:0,step:1},{key:"PotencialCombustivel",label:"Potencial de Combustível",type:"number",min:0,step:1},{key:"ProducaoCombustivel",label:"Produção de Combustível (mensal)",type:"number",min:0,step:1},{key:"ConsumoCombustivel",label:"Consumo de Combustível (mensal)",type:"number",min:0,step:1},{key:"CombustivelSaldo",label:"Saldo de Combustível",type:"number",step:1},{key:"Metais",label:"Metais (estoque)",type:"number",step:1},{key:"PotencialMetais",label:"Potencial de Metais",type:"number",min:0,step:1},{key:"ProducaoMetais",label:"Produção de Metais (mensal)",type:"number",min:0,step:1},{key:"ConsumoMetais",label:"Consumo de Metais (mensal)",type:"number",min:0,step:1},{key:"CarvaoSaldo",label:"Saldo de Carvão",type:"number",step:1},{key:"PotencialCarvao",label:"Potencial de Carvão",type:"number",min:0,step:1},{key:"ProducaoCarvao",label:"Produção de Carvão (mensal)",type:"number",min:0,step:1},{key:"ConsumoCarvao",label:"Consumo de Carvão (mensal)",type:"number",min:0,step:1},{key:"Uranio",label:"Urânio (estoque)",type:"number",min:0,step:1},{key:"PotencialUranio",label:"Potencial de Urânio",type:"number",min:0,step:1},{key:"PotencialHidreletrico",label:"Potencial Hidrelétrico",type:"number",min:0,step:1},{key:"BensDeConsumoCalculado",label:"Bens de Consumo (dados calculados)",type:"readonly",description:"Estrutura com demand, production, satisfactionLevel, stabilityEffect"},{key:"ConsumoCalculado",label:"Consumo (dados calculados)",type:"readonly",description:"Estrutura com climateZone, developmentLevel, multiplier"},{key:"ProducaoCalculada",label:"Produção (dados calculados)",type:"readonly",description:"Estrutura com climateZone, developmentLevel, geographicBonuses"}]},energia:{title:"Energia",fields:[{key:"Energia.capacidade",label:"Capacidade de Energia",type:"number",min:0,step:1},{key:"Energia.demanda",label:"Demanda de Energia",type:"number",min:0,step:1},{key:"ProducaoEnergia",label:"Produção de Energia (mensal)",type:"number",min:0,step:1},{key:"ConsumoEnergia",label:"Consumo de Energia (mensal)",type:"number",min:0,step:1},{key:"Energia",label:"Energia (estrutura completa)",type:"readonly",description:"Estrutura complexa com power_plants - use o dashboard para editar"}]},"militar-defesa":{title:"Militar e Defesa",fields:[{key:"WarPower",label:"WarPower",type:"number",min:0,step:.1},{key:"CounterIntelligence",label:"Contra-Inteligência",type:"number",min:0,max:100,step:.1},{key:"MilitaryBudgetPercent",label:"Orçamento Militar (%)",type:"number",min:0,max:100,step:.1},{key:"MilitaryDistributionAircraft",label:"Distribuição - Aviação (%)",type:"number",min:0,max:100,step:.1},{key:"MilitaryDistributionNaval",label:"Distribuição - Naval (%)",type:"number",min:0,max:100,step:.1},{key:"MilitaryDistributionVehicles",label:"Distribuição - Veículos (%)",type:"number",min:0,max:100,step:.1},{key:"AgencyBudgetSpent",label:"Gasto da Agência de Inteligência",type:"number",min:0},{key:"Exercito",label:"Exército (total simplificado)",type:"number",min:0,step:1},{key:"Aeronautica",label:"Aeronáutica (total simplificado)",type:"number",min:0,step:1},{key:"Marinha",label:"Marinha (total simplificado)",type:"number",min:0,step:1},{key:"Veiculos",label:"Veículos (total simplificado)",type:"number",min:0,step:1},{key:"inventario.Howitzer",label:"🎖️ Howitzer",type:"number",min:0,step:1},{key:"inventario.SPA",label:"🎖️ SPA (Artilharia Autopropulsada)",type:"number",min:0,step:1},{key:"inventario.Antiaerea",label:"🎖️ Antiaérea",type:"number",min:0,step:1},{key:"inventario.SPAA",label:"🎖️ SPAA",type:"number",min:0,step:1},{key:"inventario.APC",label:"🎖️ APC",type:"number",min:0,step:1},{key:"inventario.IFV",label:"🎖️ IFV",type:"number",min:0,step:1},{key:"inventario.TanqueLeve",label:"🎖️ Tanque Leve",type:"number",min:0,step:1},{key:"inventario.MBT",label:"🎖️ MBT",type:"number",min:0,step:1},{key:"inventario.Transporte",label:"🎖️ Transporte",type:"number",min:0,step:1},{key:"inventario.Utilitarios",label:"🎖️ Utilitários",type:"number",min:0,step:1},{key:"inventario.Caca",label:"✈️ Caça",type:"number",min:0,step:1},{key:"inventario.CAS",label:"✈️ CAS",type:"number",min:0,step:1},{key:"inventario.Bomber",label:"✈️ Bomber",type:"number",min:0,step:1},{key:"inventario.BomberAJato",label:"✈️ Bomber a Jato",type:"number",min:0,step:1},{key:"inventario.BomberEstrategico",label:"✈️ Bomber Estratégico",type:"number",min:0,step:1},{key:"inventario.BomberEstrategicoAJato",label:"✈️ Bomber Estratégico a Jato",type:"number",min:0,step:1},{key:"inventario.AWAC",label:"✈️ AWAC",type:"number",min:0,step:1},{key:"inventario.HeliTransporte",label:"🚁 Helicóptero de Transporte",type:"number",min:0,step:1},{key:"inventario.HeliAtaque",label:"🚁 Helicóptero de Ataque",type:"number",min:0,step:1},{key:"inventario.TransporteAereo",label:"✈️ Transporte Aéreo",type:"number",min:0,step:1},{key:"inventario.Carga",label:"✈️ Aeronave de Carga",type:"number",min:0,step:1},{key:"inventario.PAEsquadra",label:"⚓ PA de Esquadra",type:"number",min:0,step:1},{key:"inventario.PAEscolta",label:"⚓ PA de Escolta",type:"number",min:0,step:1},{key:"inventario.Encouracado",label:"⚓ Encouraçado",type:"number",min:0,step:1},{key:"inventario.CruzadorMisseis",label:"⚓ Cruzador de Mísseis",type:"number",min:0,step:1},{key:"inventario.Cruzador",label:"⚓ Cruzador",type:"number",min:0,step:1},{key:"inventario.Fragata",label:"⚓ Fragata",type:"number",min:0,step:1},{key:"inventario.Destroyer",label:"⚓ Destroyer",type:"number",min:0,step:1},{key:"inventario.Submarino",label:"⚓ Submarino",type:"number",min:0,step:1},{key:"inventario.SubmarinoBalístico",label:"⚓ Submarino Balístico",type:"number",min:0,step:1},{key:"inventario.SubmarinoNuclear",label:"⚓ Submarino Nuclear",type:"number",min:0,step:1},{key:"inventario.TransporteNaval",label:"⚓ Transporte Naval",type:"number",min:0,step:1},{key:"inventario.Desembarque",label:"⚓ Navio de Desembarque",type:"number",min:0,step:1},{key:"exercito.Infantaria",label:"👥 Exército: Infantaria",type:"number",min:0,step:1},{key:"exercito.Artilharia",label:"👥 Exército: Artilharia",type:"number",min:0,step:1},{key:"aeronautica.Caca",label:"👥 Aeronáutica: Caça",type:"number",min:0,step:1},{key:"aeronautica.CAS",label:"👥 Aeronáutica: CAS",type:"number",min:0,step:1},{key:"aeronautica.Bomber",label:"👥 Aeronáutica: Bombardeiro",type:"number",min:0,step:1},{key:"marinha.Fragata",label:"👥 Marinha: Fragata",type:"number",min:0,step:1},{key:"marinha.Destroyer",label:"👥 Marinha: Destroyer",type:"number",min:0,step:1},{key:"marinha.Submarino",label:"👥 Marinha: Submarino",type:"number",min:0,step:1},{key:"marinha.Transporte",label:"👥 Marinha: Transporte",type:"number",min:0,step:1},{key:"arsenal.Nuclear",label:"☢️ Arsenal: Bomba Nuclear",type:"number",min:0,step:1}]},tecnologia:{title:"Tecnologia",fields:[{key:"Tecnologia",label:"Tecnologia Militar (%)",type:"number",min:0,max:100,step:.1},{key:"TecnologiaCivil",label:"Tecnologia Civil (%)",type:"number",min:0,max:100,step:.1}]}},this.elements={}}async initialize(){try{this.cacheElements(),this.setupEventListeners(),await this.loadCountries(),m.info("Editor de País Avançado inicializado")}catch(e){m.error("Erro ao inicializar Editor de País Avançado:",e),u("error","Erro ao inicializar o editor")}}cacheElements(){this.elements={selectCountry:document.getElementById("select-pais-avancado"),btnSave:document.getElementById("btn-salvar-pais-avancado"),btnCreate:document.getElementById("btn-criar-pais"),btnDelete:document.getElementById("btn-deletar-pais"),btnSplit:document.getElementById("btn-dividir-pais"),editorLoading:document.getElementById("editor-loading"),sections:{"geral-politico":document.getElementById("section-geral-politico"),"economia-recursos":document.getElementById("section-economia-recursos"),energia:document.getElementById("section-energia"),"militar-defesa":document.getElementById("section-militar-defesa"),tecnologia:document.getElementById("section-tecnologia")}}}setupEventListeners(){this.elements.selectCountry&&this.elements.selectCountry.addEventListener("change",()=>{this.onCountryChanged()}),this.elements.btnSave&&this.elements.btnSave.addEventListener("click",()=>{this.saveAllChanges()}),this.elements.btnCreate&&this.elements.btnCreate.addEventListener("click",()=>{this.createNewCountry()}),this.elements.btnDelete&&this.elements.btnDelete.addEventListener("click",()=>{this.deleteCountry()}),this.elements.btnSplit&&this.elements.btnSplit.addEventListener("click",()=>{this.splitCountry()}),document.addEventListener("input",e=>{e.target.closest("#country-editor-accordion")&&this.markAsChanged()}),window.addEventListener("beforeunload",e=>{if(this.hasUnsavedChanges)return e.preventDefault(),e.returnValue="Você tem alterações não salvas. Deseja realmente sair?",e.returnValue})}async loadCountries(){try{this.countries=await ue(),this.countries.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),this.populateCountryDropdown()}catch(e){m.error("Erro ao carregar países:",e),u("error","Erro ao carregar países")}}populateCountryDropdown(){this.elements.selectCountry&&(this.elements.selectCountry.innerHTML='<option value="">Selecione um país...</option>',this.countries.forEach(e=>{const t=document.createElement("option");t.value=e.id,t.textContent=e.Pais||e.id,this.elements.selectCountry.appendChild(t)}))}async onCountryChanged(){const e=this.elements.selectCountry.value;if(!e){this.clearEditor();return}if(this.hasUnsavedChanges&&!await this.confirmDiscard()){this.elements.selectCountry.value=this.selectedCountry?.id||"";return}await this.loadCountryData(e)}async confirmDiscard(){return new Promise(e=>{const t=window.confirm("Você tem alterações não salvas. Deseja descartá-las e continuar?");e(t)})}async loadCountryData(e){try{this.showLoading(!0);const t=await p.collection("paises").doc(e).get();if(!t.exists){u("error","País não encontrado");return}this.selectedCountry={id:t.id,...t.data()},this.originalData=JSON.parse(JSON.stringify(this.selectedCountry)),this.renderAllSections(),this.showLoading(!1),this.hasUnsavedChanges=!1,this.updateSaveButton(),this.updateActionButtons(),u("success",`País ${this.selectedCountry.Pais} carregado`)}catch(t){m.error("Erro ao carregar dados do país:",t),u("error","Erro ao carregar dados do país"),this.showLoading(!1)}}showLoading(e){this.elements.editorLoading&&(e?(this.elements.editorLoading.style.display="block",Object.values(this.elements.sections).forEach(t=>{t&&(t.innerHTML="")})):this.elements.editorLoading.style.display="none")}clearEditor(){this.selectedCountry=null,this.originalData=null,this.fieldGetters.clear(),this.hasUnsavedChanges=!1,this.updateSaveButton(),this.updateActionButtons(),Object.values(this.elements.sections).forEach(e=>{e&&(e.innerHTML="")}),this.showLoading(!0)}updateActionButtons(){const e=this.selectedCountry!==null;this.elements.btnDelete&&(this.elements.btnDelete.disabled=!e),this.elements.btnSplit&&(this.elements.btnSplit.disabled=!e)}renderAllSections(){this.fieldGetters.clear(),Object.keys(this.fieldSchema).forEach(e=>{this.renderSection(e)})}renderSection(e){const t=this.fieldSchema[e],a=this.elements.sections[e];!a||!t||(a.innerHTML="",t.fields.forEach(o=>{const n=this.createFieldElement(o);n&&(a.appendChild(n.wrapper),n.getter&&this.fieldGetters.set(o.key,n.getter))}))}createFieldElement(e){const t=document.createElement("div");t.className="space-y-1";const a=document.createElement("label");a.className="block text-xs font-medium text-slate-400",a.textContent=e.label,t.appendChild(a);let o,n;const r=this.getNestedValue(this.selectedCountry,e.key);switch(e.type){case"calculated":o=this.createCalculatedField(e,r),n=()=>this.calculateFieldValue(e);break;case"readonly":o=this.createReadOnlyField(e,r),n=()=>r;break;case"select":o=this.createSelectField(e,r),n=()=>o.value;break;case"checkbox":o=this.createCheckboxField(e,r);const s=o.querySelector('input[type="checkbox"]');n=()=>s.checked;break;case"number":o=this.createNumberField(e,r),n=()=>{const i=parseFloat(o.value);return isNaN(i)?0:i};break;case"text":default:o=this.createTextField(e,r),n=()=>o.value||"";break}if(e.description){const s=document.createElement("p");s.className="text-xs text-slate-500 italic mt-1",s.textContent=e.description,t.appendChild(s)}return t.appendChild(o),{wrapper:t,getter:n}}createTextField(e,t){const a=document.createElement("input");return a.type="text",a.value=t??"",a.className="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all",a.dataset.fieldKey=e.key,a}createNumberField(e,t){const a=document.createElement("input");return a.type="number",a.value=t??0,a.className="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all",a.dataset.fieldKey=e.key,e.min!==void 0&&(a.min=e.min),e.max!==void 0&&(a.max=e.max),e.step!==void 0&&(a.step=e.step),a}createSelectField(e,t){const a=document.createElement("select");return a.className="w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/30 transition-all",a.dataset.fieldKey=e.key,(e.options||[]).forEach(o=>{const n=document.createElement("option");n.value=o,n.textContent=o,t===o&&(n.selected=!0),a.appendChild(n)}),a}createCheckboxField(e,t){const a=document.createElement("div");a.className="flex items-center gap-2";const o=document.createElement("input");o.type="checkbox",o.checked=t===!0,o.className="rounded border-bg-ring/70 bg-bg text-brand-500 focus:ring-brand-500/30 focus:ring-offset-0 focus:ring-2 transition-all",o.dataset.fieldKey=e.key;const n=document.createElement("span");return n.className="text-sm text-slate-300",n.textContent=t?"Sim":"Não",o.addEventListener("change",()=>{n.textContent=o.checked?"Sim":"Não"}),a.appendChild(o),a.appendChild(n),a}createCalculatedField(e,t){const a=document.createElement("div");if(a.className="w-full rounded-lg bg-slate-700/50 border border-slate-600 p-2 text-sm text-slate-300 italic",e.key==="PIB"){const o=parseFloat(this.selectedCountry.Populacao)||0,n=parseFloat(this.selectedCountry.PIBPerCapita)||0,r=Z(o,n);a.textContent=`${me(r)} (calculado automaticamente)`,a.dataset.calculatedValue=r}else a.textContent="Campo calculado",a.dataset.calculatedValue=t??0;return a.dataset.fieldKey=e.key,a}createReadOnlyField(e,t){const a=document.createElement("div");a.className="w-full rounded-lg bg-slate-700/30 border border-slate-600/50 p-2 text-sm text-slate-400";let o="Não editável aqui";return typeof t=="object"&&t!==null&&(o=`${Object.keys(t).length} itens (use ferramenta específica)`),a.textContent=o,a.dataset.fieldKey=e.key,a}calculateFieldValue(e){if(e.key==="PIB"){const t=this.fieldGetters.get("Populacao")?.()||0,a=this.fieldGetters.get("PIBPerCapita")?.()||0;return Z(t,a)}return 0}getNestedValue(e,t){const a=t.split(".");let o=e;for(const n of a){if(o==null)return;o=o[n]}return o}setNestedValue(e,t,a){const o=t.split("."),n=o.pop();let r=e;for(const s of o)(!(s in r)||typeof r[s]!="object")&&(r[s]={}),r=r[s];r[n]=a}markAsChanged(){this.hasUnsavedChanges||(this.hasUnsavedChanges=!0,this.updateSaveButton())}updateSaveButton(){this.elements.btnSave&&(this.hasUnsavedChanges&&this.selectedCountry?(this.elements.btnSave.disabled=!1,this.elements.btnSave.classList.add("shadow-lg","shadow-emerald-500/20")):(this.elements.btnSave.disabled=!0,this.elements.btnSave.classList.remove("shadow-lg","shadow-emerald-500/20")))}async saveAllChanges(){if(!this.selectedCountry){u("error","Nenhum país selecionado");return}try{this.elements.btnSave.disabled=!0,this.elements.btnSave.textContent="💾 Salvando...";const e={};this.fieldGetters.forEach((t,a)=>{const o=this.findFieldDefinition(a);if(o&&(o.type==="readonly"||o.type==="calculated"))return;const n=t();n!==void 0&&this.setNestedValue(e,a,n)}),e.PIBPerCapita!==void 0&&e.Populacao!==void 0&&(e.PIB=Z(e.Populacao,e.PIBPerCapita)),this.cleanUndefinedFields(e),await p.collection("paises").doc(this.selectedCountry.id).update(e),Object.assign(this.selectedCountry,e),this.originalData=JSON.parse(JSON.stringify(this.selectedCountry)),this.hasUnsavedChanges=!1,this.updateSaveButton(),u("success",`✅ ${this.selectedCountry.Pais} salvo com sucesso!`),m.info("País atualizado:",this.selectedCountry.id,e)}catch(e){m.error("Erro ao salvar país:",e),u("error",`Erro ao salvar: ${e.message}`)}finally{this.elements.btnSave.disabled=!1,this.elements.btnSave.textContent="💾 Salvar Alterações"}}findFieldDefinition(e){for(const t in this.fieldSchema){const o=this.fieldSchema[t].fields.find(n=>n.key===e);if(o)return o}return null}cleanUndefinedFields(e){Object.keys(e).forEach(t=>{e[t]===void 0?delete e[t]:e[t]!==null&&typeof e[t]=="object"&&!Array.isArray(e[t])&&(this.cleanUndefinedFields(e[t]),Object.keys(e[t]).length===0&&delete e[t])})}async createNewCountry(){const e=prompt("🌍 Nome do novo país:");if(!e||!e.trim())return;const t=`pais_${Date.now()}_${Math.floor(Math.random()*1e3)}`,a={Pais:e.trim(),Ativo:!0,Player:"",ModeloPolitico:"República",Populacao:1e7,PIBPerCapita:100,PIB:1e9,Estabilidade:50,Burocracia:50,Urbanizacao:30,Tecnologia:20,TecnologiaCivil:20,Visibilidade:"Público",IndustrialEfficiency:30,PoliticaIndustrial:"balanceada",Graos:0,Combustivel:50,Metais:0,Carvao:0,Uranio:0,BensDeConsumo:0,PotencialAgricola:5,PotencialCombustivel:2,PotencialMetais:3,PotencialCarvao:3,PotencialUranio:1,PotencialHidreletrico:5,WarPower:0,CounterIntelligence:0,Exercito:0,Aeronautica:0,Marinha:0,Veiculos:0,Energia:{capacidade:100,demanda:100},DataCriacao:new Date};try{await p.collection("paises").doc(t).set(a),u("success",`País "${e}" criado com sucesso!`),await this.loadCountries(),this.elements.selectCountry.value=t,await this.onCountryChanged()}catch(o){m.error("Erro ao criar país:",o),u("error","Erro ao criar país: "+o.message)}}async deleteCountry(){if(!this.selectedCountry){u("warning","Selecione um país primeiro");return}const e=this.selectedCountry.Pais;if(!confirm(`⚠️ ATENÇÃO: Você está prestes a DELETAR o país "${e}".

Esta ação é IRREVERSÍVEL!

Deseja continuar?`))return;if(prompt(`Digite o nome do país "${e}" para confirmar a exclusão:`)!==e){u("warning","Nome não corresponde. Operação cancelada.");return}try{const o=this.selectedCountry.id;await p.collection("paises").doc(o).delete(),u("success",`País "${e}" deletado com sucesso`),this.selectedCountry=null,this.originalData=null,await this.loadCountries(),this.hideEditor()}catch(o){m.error("Erro ao deletar país:",o),u("error","Erro ao deletar país: "+o.message)}}async splitCountry(){if(!this.selectedCountry){u("warning","Selecione um país primeiro");return}const e=this.selectedCountry.Pais,t=parseInt(prompt(`🗺️ Dividir "${e}"

Em quantos países deseja dividir? (2-10):`,"2"));if(!t||t<2||t>10){u("warning","Número inválido. Escolha entre 2 e 10 países.");return}const a=[];let o=0;for(let r=0;r<t;r++){const s=prompt(`Nome do país ${r+1}/${t}:`,`${e} ${r+1}`);if(!s){u("warning","Operação cancelada");return}const i=Math.round((100-o)/(t-r)),l=parseFloat(prompt(`Percentual de recursos para "${s}" (${100-o}% restante):`,i));if(!l||l<=0||l>100-o){u("warning","Percentual inválido");return}a.push({name:s,percent:l/100}),o+=l}const n=a.map(r=>`  • ${r.name}: ${(r.percent*100).toFixed(1)}%`).join(`
`);if(confirm(`Confirma divisão de "${e}"?

${n}`))try{for(const r of a){const s=`pais_${Date.now()}_${Math.floor(Math.random()*1e3)}`,i={...this.selectedCountry,id:s,Pais:r.name,PIB:Math.round(this.selectedCountry.PIB*r.percent),Populacao:Math.round(this.selectedCountry.Populacao*r.percent),Graos:Math.round((this.selectedCountry.Graos||0)*r.percent),Combustivel:Math.round((this.selectedCountry.Combustivel||0)*r.percent),Metais:Math.round((this.selectedCountry.Metais||0)*r.percent),Carvao:Math.round((this.selectedCountry.Carvao||0)*r.percent),Uranio:Math.round((this.selectedCountry.Uranio||0)*r.percent),BensDeConsumo:Math.round((this.selectedCountry.BensDeConsumo||0)*r.percent),Player:null,DataCriacao:new Date};delete i.DataVinculacao,await p.collection("paises").doc(s).set(i)}await p.collection("paises").doc(this.selectedCountry.id).delete(),u("success",`País "${e}" dividido em ${t} países com sucesso!`),await this.loadCountries(),this.selectedCountry=null,this.hideEditor()}catch(r){m.error("Erro ao dividir país:",r),u("error","Erro ao dividir país: "+r.message)}}}let ae=null;async function Fe(){return ae||(ae=new je,await ae.initialize()),ae}const _={dependency:{light:.3,moderate:.5,heavy:.7,critical:.85},historyTurns:5,effects:{growth_bonus:{light:.05,moderate:.1,heavy:.15,critical:.2},crisis_impact:{light:.1,moderate:.2,heavy:.35,critical:.5}}};class Ve{constructor(){this.dependencyCache=new Map,this.lastCacheUpdate=0,this.cacheTimeout=3e5}async analyzeDependency(e,t,a=!1){try{const o=`${e}-${t}`,n=Date.now();if(!a&&this.dependencyCache.has(o)){const i=this.dependencyCache.get(o);if(n-i.timestamp<this.cacheTimeout)return i.data}const r=await this.getEconomicHistory(e),s=this.calculateDependency(r,t);return this.dependencyCache.set(o,{data:s,timestamp:n}),s}catch(o){throw m.error("Erro ao analisar dependência econômica:",o),o}}async getEconomicHistory(e){try{return(await p.collection("economic_history").where("countryId","==",e).orderBy("turn","desc").limit(_.historyTurns).get()).docs.map(a=>({id:a.id,...a.data()}))}catch(t){return m.error("Erro ao buscar histórico econômico:",t),[]}}calculateDependency(e,t){if(!e||e.length<2)return{level:"none",percentage:0,totalExternal:0,fromInvestor:0,turnsAnalyzed:e.length,riskLevel:"low"};let a=0,o=0,n=0;e.forEach(h=>{h.externalInvestments&&Object.entries(h.externalInvestments).forEach(([v,w])=>{const C=parseFloat(w)||0;a+=C,v===t&&(o+=C,n++)})});const r=a>0?o/a:0,s=n/e.length,i=r*(.5+.5*s);let l="none",d="low";return i>=_.dependency.critical?(l="critical",d="critical"):i>=_.dependency.heavy?(l="heavy",d="high"):i>=_.dependency.moderate?(l="moderate",d="medium"):i>=_.dependency.light&&(l="light",d="low"),{level:l,percentage:i,rawPercentage:r,totalExternal:a,fromInvestor:o,turnsAnalyzed:e.length,turnsWithInvestment:n,consistencyFactor:s,riskLevel:d,growthBonus:_.effects.growth_bonus[l]||0,crisisImpact:_.effects.crisis_impact[l]||0}}async analyzeAllDependencies(e){try{const t=await this.getEconomicHistory(e),a=new Map,o=new Set;t.forEach(r=>{r.externalInvestments&&Object.keys(r.externalInvestments).forEach(s=>{o.add(s)})});for(const r of o){const s=this.calculateDependency(t,r);s.level!=="none"&&a.set(r,s)}const n=Array.from(a.entries()).sort((r,s)=>s[1].percentage-r[1].percentage);return{countryId:e,dependencies:n,totalDependencies:a.size,highestDependency:n[0]||null,riskLevel:this.calculateOverallRisk(n)}}catch(t){throw m.error("Erro ao analisar todas as dependências:",t),t}}calculateOverallRisk(e){if(e.length===0)return"none";const t=e.filter(([,n])=>n.level==="critical").length,a=e.filter(([,n])=>n.level==="heavy").length,o=e.filter(([,n])=>n.level==="moderate").length;return t>0?"critical":a>1||a===1&&o>0?"high":a===1||o>1?"medium":"low"}async checkEconomicCrisis(e){try{const t=await p.collection("paises").doc(e).get();if(!t.exists)return!1;const a=t.data(),o=parseFloat(a.PIB)||0,n=parseFloat(a.Estabilidade)||0,r=await this.getEconomicHistory(e);if(r.length<2)return!1;const s=parseFloat(r[1].results?.newPIB||a.PIB),i=(o-s)/s;return{isCrisis:i<-.15||n<25||i<-.05&&n<40,pibChange:i,stability:n,severity:this.calculateCrisisSeverity(i,n)}}catch(t){return m.error("Erro ao verificar crise econômica:",t),!1}}calculateCrisisSeverity(e,t){let a=0;return e<-.3?a+=3:e<-.2?a+=2:e<-.1&&(a+=1),t<20?a+=3:t<35?a+=2:t<50&&(a+=1),a>=5?"severe":a>=3?"moderate":a>=1?"mild":"none"}async applyDependencyCrisisEffects(e){try{const t=await this.checkEconomicCrisis(e);if(!t.isCrisis)return[];const a=[],o=await p.collection("paises").get();for(const n of o.docs){const r=n.id;if(r===e)continue;const s=await this.analyzeDependency(r,e);if(s.level!=="none"){const i=n.data(),l=parseFloat(i.PIB)||0,d=s.crisisImpact*t.severity==="severe"?1.5:1,h=l*d,v=l-h;await p.collection("paises").doc(r).update({PIB:v,TurnoUltimaAtualizacao:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}),a.push({countryId:r,countryName:i.Pais,dependencyLevel:s.level,pibLoss:h,newPIB:v,impact:d*100})}}return a}catch(t){throw m.error("Erro ao aplicar efeitos de crise de dependência:",t),t}}generateDependencyReport(e){const{countryId:t,dependencies:a,riskLevel:o}=e;return{summary:this.generateSummaryText(a,o),recommendations:this.generateRecommendations(a,o),riskMatrix:a.map(([r,s])=>({investor:r,level:s.level,percentage:s.percentage,risk:s.riskLevel,growthBonus:s.growthBonus,crisisImpact:s.crisisImpact}))}}generateSummaryText(e,t){if(e.length===0)return"País mantém independência econômica total. Sem dependências externas significativas.";const a=e.length,o=e.filter(([,s])=>s.level==="critical").length,n=e.filter(([,s])=>s.level==="heavy").length;let r=`País possui ${a} dependência${a>1?"s":""} econômica${a>1?"s":""}.`;return o>0&&(r+=` ${o} crítica${o>1?"s":""}.`),n>0&&(r+=` ${n} pesada${n>1?"s":""}.`),r+=` Risco geral: ${t}.`,r}generateRecommendations(e,t){const a=[];(t==="critical"||t==="high")&&(a.push("Diversificar fontes de investimento externo urgentemente."),a.push("Aumentar investimentos internos para reduzir dependência.")),e.length>3&&a.push("Consolidar parcerias econômicas para reduzir complexidade.");const o=e.filter(([,n])=>n.level==="critical");return o.length>0&&a.push(`Negociar maior autonomia com ${o[0][0]} devido à dependência crítica.`),a.length===0&&a.push("Manter diversificação atual de investimentos externos."),a}clearCache(){this.dependencyCache.clear(),this.lastCacheUpdate=0}}const Ne=new Ve,U={growth:{excellent:["✨ **Crescimento Excepcional!** A economia nacional floresceu sob suas políticas visionárias.","🚀 **Boom Econômico!** Seus investimentos estratégicos criaram um círculo virtuoso de prosperidade.","⭐ **Era Dourada!** O país vivencia seu melhor período econômico em décadas."],good:["✅ **Crescimento Sólido** A diversificação econômica está dando frutos positivos.","📈 **Progresso Sustentável** Suas reformas econômicas mostram resultados consistentes.","💪 **Economia Resiliente** O país demonstra capacidade de crescimento estável."],moderate:["📊 **Crescimento Moderado** A economia mantém trajetória de expansão cautelosa.","⚖️ **Desenvolvimento Equilibrado** O país avança de forma sustentada, sem riscos.","🎯 **Metas Atingidas** Os objetivos econômicos estão sendo cumpridos gradualmente."],poor:["⚠️ **Crescimento Limitado** A economia enfrenta desafios que impedem maior expansão.","🔄 **Ajustes Necessários** É preciso revisar as estratégias de investimento atuais.","📉 **Potencial Não Realizado** O país possui capacidade para crescimento maior."],negative:["🚨 **Recessão Econômica** A economia nacional enfrenta sérias dificuldades.","⛈️ **Crise Econômica** Políticas de emergência são necessárias para estabilização.","🆘 **Situação Crítica** Reformas estruturais urgentes são essenciais para recuperação."]},inflation:{low:["💡 **Gestão Eficiente** Seus investimentos foram bem planejados, com baixa inflação.","🎯 **Precisão Econômica** A estratégia de diversificação evitou pressões inflacionárias.","⚡ **Investimento Inteligente** A alocação equilibrada de recursos maximizou a eficiência."],moderate:["⚠️ **Inflação Controlável** Há sinais de aquecimento econômico que requerem atenção.","🌡️ **Economia Aquecida** O volume de investimentos está criando pressões de preços.","⚖️ **Equilíbrio Delicado** É preciso balancear crescimento com estabilidade de preços."],high:["🔥 **Alta Inflação** O excesso de investimentos está criando desequilíbrios econômicos.","⛔ **Superaquecimento** A economia precisa de políticas de resfriamento urgentes.","📈 **Pressão de Preços** A concentração de gastos está gerando inflação preocupante."],severe:["🚨 **Hiperinflação Ameaça** Os investimentos excessivos criaram uma crise inflacionária.","💥 **Colapso de Preços** A estratégia econômica resultou em instabilidade monetária severa.","🌪️ **Descontrole Inflacionário** Medidas de emergência são necessárias imediatamente."]},chains:["🔗 **Sinergia Perfeita!** A combinação de infraestrutura e indústria potencializou o crescimento.","⚙️ **Engrenagem Eficiente** Pesquisa & Desenvolvimento impulsionou a modernização industrial.","🧬 **DNA de Inovação** A integração entre ciência e políticas sociais criou resultados excepcionais.","🏗️ **Base Sólida** Investimentos em infraestrutura criaram fundações para expansão industrial.","🔬 **Revolução Científica** P&D transformou o panorama tecnológico e social do país."],dependency:{created:["🤝 **Nova Parceria** Sua cooperação com {investor} fortaleceu os laços econômicos.","🌍 **Integração Internacional** Os investimentos externos expandiram horizontes econômicos.","💼 **Diplomacia Econômica** A parceria internacional traz benefícios mútuos."],increased:["📈 **Dependência Crescente** Sua economia está cada vez mais integrada com {investor}.","⚠️ **Atenção Necessária** A dependência de {investor} requer monitoramento cuidadoso.","🔄 **Diversificação Recomendada** Considere expandir parcerias para reduzir riscos."],critical:["🚨 **Dependência Crítica** Sua economia tornou-se vulnerável às crises de {investor}.","⛔ **Risco Elevado** A dependência excessiva de {investor} compromete a autonomia nacional.","🆘 **Alerta Máximo** É urgente diversificar fontes de investimento externo."]},external_actions:["🌐 **Influência Internacional** Seus investimentos em {target} fortalecem sua posição geopolítica.","🤝 **Soft Power** A ajuda econômica a {target} amplia sua influência regional.","💰 **Diplomacia do Dólar** Os investimentos externos são uma ferramenta de política externa eficaz.","🌟 **Liderança Global** Sua capacidade de investir no exterior demonstra força econômica.","⚖️ **Responsabilidade Internacional** Os investimentos externos equilibram desenvolvimento e cooperação."],stability:["🏥 **Bem-Estar Social** Investimentos em saúde e educação fortalecem a coesão nacional.","👥 **Harmonia Social** Políticas sociais reduzem tensões e aumentam a estabilidade.","🛡️ **Resiliência Nacional** A estabilidade política é a base para crescimento sustentado.","🕊️ **Paz Social** Investimentos sociais criam um ambiente favorável ao desenvolvimento."],rejection:["😠 **Resistência Popular** A população de {target} vê seus investimentos como ingerência externa.","🗳️ **Tensão Política** Os investimentos em {target} geraram protestos e instabilidade.","🚫 **Rejeição Nacional** {target} demonstra resistência crescente à sua influência econômica.","⚡ **Conflito Diplomático** Os investimentos externos criaram atritos internacionais."]};class qe{async generatePlayerFeedback(e,t,a){try{const o={countryId:e,turn:this.getCurrentTurn(),timestamp:new Date,mainMessage:"",details:[],warnings:[],achievements:[],recommendations:[]},n=this.generateGrowthFeedback(t);o.mainMessage=n.message,n.achievement&&o.achievements.push(n.achievement);const r=this.generateInflationFeedback(t);if(r&&o.details.push(r),t.productiveChains.length>0){const d=this.generateChainFeedback(t.productiveChains);o.details.push(d)}const s=a.filter(d=>d.isExternal);if(s.length>0){const d=await this.generateExternalFeedback(s,e);o.details.push(...d)}const i=await this.generateDependencyFeedback(e);i&&o.warnings.push(...i);const l=this.generateStrategicRecommendations(t,a);return o.recommendations.push(...l),await this.saveFeedback(o),o}catch(o){throw m.error("Erro ao gerar feedback do player:",o),o}}generateGrowthFeedback(e){const t=e.finalGrowth/e.newPIB*100;let a,o=null;t>=15?(a="excellent",o="🏆 **Milagre Econômico** - Crescimento excepcional de mais de 15%"):t>=8?(a="good",o="🥇 **Crescimento Exemplar** - Expansão econômica robusta"):t>=3?a="moderate":t>=0?a="poor":a="negative";const n=U.growth[a];return{message:this.randomChoice(n),achievement:o}}generateInflationFeedback(e){const t=e.totalInflation*100;let a;if(t>=60?a="severe":t>=35?a="high":t>=15?a="moderate":a="low",a==="low")return null;const o=U.inflation[a];return this.randomChoice(o)}generateChainFeedback(e){e.map(a=>a.name).join(", ");let t=this.randomChoice(U.chains);return e.some(a=>a.name.includes("Infraestrutura"))?t="🔗 **Sinergia Infraestrutural** A base sólida potencializou outros setores da economia.":e.some(a=>a.name.includes("P&D"))&&(t="🧬 **Inovação Integrada** Pesquisa & Desenvolvimento revolucionou múltiplos setores."),t}async generateExternalFeedback(e,t){const a=[];for(const o of e){if(!o.targetCountry)continue;const n=await this.getCountryData(o.targetCountry);if(!n)continue;if(this.checkRejectionRisk(o,n).hasRisk){const s=this.randomChoice(U.rejection).replace("{target}",n.Pais||o.targetCountry);a.push(s)}else{const s=this.randomChoice(U.external_actions).replace("{target}",n.Pais||o.targetCountry);a.push(s)}}return a}async generateDependencyFeedback(e){try{const t=await Ne.analyzeAllDependencies(e),a=[];if(t.dependencies.length===0)return null;const o=t.dependencies.filter(([,r])=>r.level==="critical"),n=t.dependencies.filter(([,r])=>r.level==="heavy");for(const[r,s]of o){const i=await this.getCountryData(r),l=this.randomChoice(U.dependency.critical).replace("{investor}",i?.Pais||r);a.push(l)}for(const[r,s]of n.slice(0,2)){const i=await this.getCountryData(r),l=this.randomChoice(U.dependency.increased).replace("{investor}",i?.Pais||r);a.push(l)}return a}catch(t){return m.error("Erro ao gerar feedback de dependência:",t),null}}generateStrategicRecommendations(e,t){const a=[],o=e.totalInflation*100,n=t.some(s=>s.isExternal),r=[...new Set(t.map(s=>s.type))];return o>40?a.push("💡 **Sugestão:** Reduza o volume de investimentos no próximo turno para controlar a inflação."):o<5&&a.push("💡 **Oportunidade:** Sua economia pode absorver mais investimentos sem riscos inflacionários."),r.length<=2&&a.push("🎯 **Estratégia:** Diversifique os tipos de investimento para ativar cadeias produtivas."),!n&&e.finalGrowth>0?a.push("🌍 **Diplomacia:** Considere investimentos externos para expandir sua influência internacional."):n&&t.filter(s=>s.isExternal).length>=3&&a.push("🏠 **Foco Interno:** Balance investimentos externos com desenvolvimento interno."),e.productiveChains.length===0&&a.push("🔗 **Sinergia:** Combine diferentes tipos de investimento para ativar bônus de cadeias produtivas."),a.slice(0,3)}checkRejectionRisk(e,t){const a=parseFloat(t.Estabilidade)||0,o=parseFloat(t.PIB)||1,r=(parseFloat(e.value)||0)*1e6/o;return{hasRisk:a<40&&r>.1,riskLevel:r>.2?"high":"medium"}}async saveFeedback(e){try{await p.collection("player_feedback").doc().set({...e,createdAt:new Date}),m.info(`Feedback salvo para país ${e.countryId}`)}catch(t){throw m.error("Erro ao salvar feedback:",t),t}}async getPlayerFeedback(e,t=5){try{return(await p.collection("player_feedback").where("countryId","==",e).orderBy("turn","desc").limit(t).get()).docs.map(o=>({id:o.id,...o.data()}))}catch(a){return m.error("Erro ao buscar feedback do player:",a),[]}}randomChoice(e){return e[Math.floor(Math.random()*e.length)]}getCurrentTurn(){return parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}async getCountryData(e){try{const t=await p.collection("paises").doc(e).get();return t.exists?t.data():null}catch(t){return m.error("Erro ao buscar dados do país:",t),null}}formatFeedbackForDisplay(e){let t=`
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
      `),t+="</div>",t}}const Re=new qe,j={maxInternalActions:10,maxExternalActions:3,actionTypes:{infrastructure:{id:"infrastructure",name:"🏗️ Infraestrutura",multiplier:1.3,description:"Estradas, energia, telecomunicações",bonusCondition:"urbanization > 50",bonusValue:.4,examples:["Construção de rodovias","Expansão da rede elétrica","Fibra óptica nacional"]},research:{id:"research",name:"🔬 Pesquisa & Desenvolvimento",multiplier:1.8,description:"Universidades, inovação científica",bonusCondition:"technology > 60",bonusValue:.5,examples:["Centros de pesquisa","Universidades tecnológicas","Programas de inovação"]},industry:{id:"industry",name:"🏭 Desenvolvimento Industrial",multiplier:1.6,description:"Fábricas, refinarias",bonusValue:.5,penaltyCondition:"stability < 40",penaltyValue:.15,examples:["Complexos industriais","Refinarias de petróleo","Siderúrgicas"]},exploration:{id:"exploration",name:"⛏️ Exploração de Recursos",multiplier:.8,description:"Exploração mineral e de recursos primários. Gera menos crescimento econômico que outras ações, mas adiciona recursos ao estoque do país.",examples:["Exploração de jazidas","Perfuração de poços","Mineração"]},social:{id:"social",name:"🏥 Investimento Social",multiplier:1.1,description:"Saúde, educação, habitação",stabilityBonus:1,examples:["Hospitais públicos","Escolas técnicas","Programas habitacionais"]}},productiveChains:{"infrastructure+industry":{name:"Infraestrutura + Indústria",bonus:.15,effect:"Elimina penalidade de estabilidade se < 50",description:"Infraestrutura potencializa desenvolvimento industrial"},"research+industry":{name:"P&D + Indústria",bonus:.1,effect:"+1 ponto adicional de tecnologia",description:"Inovação acelera crescimento industrial"},"research+social":{name:"P&D + Social",socialBonus:.2,effect:"+1 ponto adicional de tecnologia",description:"Pesquisa melhora políticas sociais"}}};class Oe{constructor(){this.countries=[],this.selectedCountry=null,this.currentBudget=0,this.actions={internal:[],external:[]},this.economicHistory=new Map,this.changes={technology:{},indicators:{}}}async initialize(){try{m.info("Inicializando Sistema Econômico..."),await this.loadCountries(),await this.loadEconomicHistory(),this.setupEventListeners(),m.info("Sistema Econômico inicializado com sucesso")}catch(e){throw m.error("Erro ao inicializar Sistema Econômico:",e),e}}async loadCountries(){try{this.countries=await ue(),this.countries.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),m.info(`${this.countries.length} países carregados`)}catch(e){throw m.error("Erro ao carregar países no EconomicSimulator:",e),e}}async loadEconomicHistory(){try{(await p.collection("economic_history").get()).docs.forEach(t=>{const a=t.data(),o=a.countryId;this.economicHistory.has(o)||this.economicHistory.set(o,[]),this.economicHistory.get(o).push({turn:a.turn,totalInvestment:a.totalInvestment,externalInvestments:a.externalInvestments||{},results:a.results})}),m.info("Histórico econômico carregado")}catch(e){m.warn("Erro ao carregar histórico econômico:",e)}}setupEventListeners(){const e=document.getElementById("economic-simulator");e&&e.addEventListener("click",()=>this.showModal())}showModal(){if(!this.selectedCountry){const e=document.getElementById("select-pais")?.value;this.selectedCountry=e||(this.countries.length>0?this.countries[0].id:null)}if(!this.selectedCountry){u("warning","Nenhum país disponível");return}this.createModal()}createModal(){const e=this.getCountryById(this.selectedCountry);if(!e)return;this.currentBudget=this.calculateBudget(e);const t=document.createElement("div");t.className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4",t.id="economic-simulator-modal";const a=document.createElement("div");a.className="bg-slate-800 border border-slate-600/70 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col",a.innerHTML=`
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
              🏠 Investimentos Internos (0/${j.maxInternalActions})
            </button>
            <button class="economy-subtab px-4 py-2 rounded-lg bg-slate-700 text-slate-300 text-sm hover:bg-slate-600" data-subtab="external">
              🌍 Investimentos Externos (0/${j.maxExternalActions})
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
    `}createActionSlots(e){const t=e==="internal"?j.maxInternalActions:j.maxExternalActions,a=this.actions[e];let o="";for(let n=0;n<a.length;n++)o+=this.createActionSlot(e,n,a[n]);return a.length<t&&(o+=this.createActionSlot(e,a.length,null)),o}createActionSlot(e,t,a=null){const o=e==="external",n=a?.type==="exploration",r=j.actionTypes;return`
      <div class="action-slot border border-slate-600/50 rounded-lg p-4" data-type="${e}" data-index="${t}">
        <div class="grid grid-cols-1 md:grid-cols-${o?"6":"5"} gap-4 items-end">

          <!-- Tipo de Ação -->
          <div>
            <label class="block text-xs text-slate-400 mb-1">Tipo de Ação</label>
            <select class="action-type w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200">
              <option value="">Selecione...</option>
              ${Object.values(r).map(s=>`
                <option value="${s.id}" ${a?.type===s.id?"selected":""}>
                  ${s.name}
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
              ${this.countries.filter(s=>s.id!==this.selectedCountry).map(s=>`
                <option value="${s.id}" ${a?.targetCountry===s.id?"selected":""}>
                  ${s.Pais||s.id}
                </option>
              `).join("")}
            </select>
          </div>
          `:""}

          <!-- Tipo de Recurso (apenas para exploration) -->
          <div class="resource-type-selector ${n?"":"hidden"}">
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
        <div class="extraction-preview mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-lg ${n?"":"hidden"}">
          <div class="text-xs text-emerald-300">
            <strong>Extração Estimada:</strong> <span class="extraction-amount">Aguardando dados...</span>
          </div>
        </div>
      </div>
    `}setupModalEventListeners(){const e=document.getElementById("economic-simulator-modal");if(!e)return;e.querySelector("#close-economic-modal").addEventListener("click",()=>{e.remove()}),e.addEventListener("click",a=>{a.target===e&&e.remove()}),e.querySelector("#modal-country-select").addEventListener("change",a=>{this.selectedCountry=a.target.value,this.resetActions(),e.remove(),this.showModal()});const t=e.querySelector("#modal-industrial-policy");t&&t.addEventListener("change",a=>{const o=this.getCountryById(this.selectedCountry);if(o){o.PoliticaIndustrial=a.target.value;try{p.collection("paises").doc(this.selectedCountry).update({PoliticaIndustrial:a.target.value})}catch(n){console.warn("Erro ao salvar PoliticaIndustrial:",n)}}}),e.querySelectorAll(".economic-tab").forEach(a=>{a.addEventListener("click",o=>{this.switchTab(o.target.dataset.tab)})}),e.querySelector("#add-internal-action")?.addEventListener("click",()=>{this.addAction("internal")}),e.querySelector("#add-external-action")?.addEventListener("click",()=>{this.addAction("external")}),e.querySelector("#reset-economic-actions")?.addEventListener("click",()=>{this.resetActions()}),e.querySelector("#apply-economic-actions")?.addEventListener("click",()=>{this.applyEconomicActions()}),this.setupActionFieldListeners()}setupActionFieldListeners(){const e=document.getElementById("economic-simulator-modal");e&&(e.addEventListener("input",t=>{if(t.target.matches(".action-type, .target-country, .action-value, .action-dice, .action-buff, .resource-type")){const a=t.target.closest(".action-slot"),o=a.dataset.type,n=parseInt(a.dataset.index);this.updateActionFromSlot(o,n,a),this.updatePreview(a),this.updateBudgetBar(),this.updateSummary()}}),e.addEventListener("click",t=>{if(t.target.matches(".remove-action")){const a=t.target.closest(".action-slot"),o=a.dataset.type,n=parseInt(a.dataset.index);this.removeAction(o,n)}}),e.addEventListener("change",t=>{t.target.matches(".action-type")&&(this.toggleActionDescription(t.target),this.toggleResourceSelector(t.target))}),e.querySelectorAll(".economy-subtab").forEach(t=>{t.addEventListener("click",a=>{const o=a.target.dataset.subtab;this.switchEconomySubtab(o)})}),e.addEventListener("click",t=>{if(t.target.matches(".tech-increment")){const a=t.target.dataset.field;this.adjustTechnology(a,1)}else if(t.target.matches(".tech-decrement")){const a=t.target.dataset.field;this.adjustTechnology(a,-1)}}),e.addEventListener("input",t=>{if(t.target.matches(".tech-input")){const a=t.target.dataset.field,o=parseInt(t.target.value)||0;this.changes.technology[a]=o,this.updateTechPreview(a),this.updateSummary()}}),e.addEventListener("click",t=>{if(t.target.matches(".indicator-increment")){const a=t.target.dataset.field;this.adjustIndicator(a,1)}else if(t.target.matches(".indicator-decrement")){const a=t.target.dataset.field;this.adjustIndicator(a,-1)}}),e.addEventListener("input",t=>{if(t.target.matches(".indicator-input")){const a=t.target.dataset.field,o=parseFloat(t.target.value)||0;this.changes.indicators[a]=o,this.updateIndicatorPreview(a),this.updateSummary()}}))}calculateBudget(e){return Ie(e)}formatCurrency(e){return me(e)}getCountryById(e){return this.countries.find(t=>t.id===e)}switchTab(e){const t=document.getElementById("economic-simulator-modal");if(!t)return;t.querySelectorAll(".economic-tab").forEach(n=>{n.classList.remove("border-purple-500","text-purple-400","bg-slate-700/30"),n.classList.add("border-transparent","text-slate-400")}),t.querySelectorAll(".economic-tab-content").forEach(n=>{n.classList.add("hidden")});const a=t.querySelector(`[data-tab="${e}"]`),o=t.querySelector(`#economic-tab-${e}`);a&&o&&(a.classList.add("border-purple-500","text-purple-400","bg-slate-700/30"),a.classList.remove("border-transparent","text-slate-400"),o.classList.remove("hidden")),e==="summary"&&this.updateSummary()}addAction(e){const t=e==="internal"?j.maxInternalActions:j.maxExternalActions;if(this.actions[e].length>=t){u("warning",`Máximo de ${t} ações ${e==="internal"?"internas":"externas"} atingido`);return}this.actions[e].push({type:"",value:0,dice:0,buff:0,targetCountry:e==="external"?"":null}),this.recreateActionSlots(e),this.updateTabCounters()}removeAction(e,t){t>=0&&t<this.actions[e].length&&(this.actions[e].splice(t,1),this.recreateActionSlots(e),this.updateTabCounters(),this.updateBudgetBar(),this.updateSummary())}recreateActionSlots(e){const t=document.getElementById(`${e}-actions-container`);t&&(t.innerHTML=this.createActionSlots(e))}updateActionFromSlot(e,t,a){this.actions[e][t]||(this.actions[e][t]={});const o=this.actions[e][t];o.type=a.querySelector(".action-type")?.value||"",o.value=parseFloat(a.querySelector(".action-value")?.value)||0,o.dice=parseInt(a.querySelector(".action-dice")?.value)||0,o.buff=parseFloat(a.querySelector(".action-buff")?.value)||0,o.isExternal=e==="external",e==="external"&&(o.targetCountry=a.querySelector(".target-country")?.value||""),o.type==="exploration"&&(o.resourceType=a.querySelector(".resource-type")?.value||"");const n=a.querySelector(".buff-value");n&&(n.textContent=o.buff),o.type==="exploration"&&this.updateExtractionPreview(a,o)}updatePreview(e){const t=e.dataset.type,a=parseInt(e.dataset.index),o=this.actions[t][a];if(!o||!o.type||!o.value||!o.dice){e.querySelector(".growth-preview").textContent="+0.0%";return}const n=this.getCountryById(this.selectedCountry);if(n)try{let r;if(o.type==="exploration"&&o.resourceType){const d={Combustivel:"CombustivelProducao",Carvao:"CarvaoProducao",Metais:"MetaisProducao"}[o.resourceType],h=parseFloat(n[d])||1,w=j.actionTypes[o.type]?.multiplier||.8;r=(o.value/h*w*100).toFixed(2)}else{const l=z.calculateBaseGrowth(o,n),d=parseFloat(n.PIBPerCapita)||1,h=parseFloat(n.Populacao)||1;r=(l.preInflationGrowth*(o.value*1e6)/(d*h)*100).toFixed(2)}const s=e.querySelector(".growth-preview");s.textContent=`+${r}%`,s.className="growth-preview text-xs text-center px-2 py-1 rounded";const i=parseFloat(r);i>1?s.classList.add("bg-emerald-700","text-emerald-200"):i>0?s.classList.add("bg-blue-700","text-blue-200"):i===0?s.classList.add("bg-yellow-700","text-yellow-200"):s.classList.add("bg-red-700","text-red-200")}catch(r){m.error("Erro no preview:",r),e.querySelector(".growth-preview").textContent="Erro"}}updateBudgetBar(){const e=[...this.actions.internal,...this.actions.external].reduce((s,i)=>s+(parseFloat(i.value)||0),0),t=this.formatCurrency(e*1e6),a=Math.min(e*1e6/this.currentBudget*100,100),o=document.getElementById("budget-used"),n=document.getElementById("budget-bar"),r=document.getElementById("apply-economic-actions");if(o&&(o.textContent=t),n&&(n.style.width=`${a}%`,n.className="h-2 rounded-full transition-all",a>90?n.classList.add("bg-gradient-to-r","from-red-500","to-red-600"):a>70?n.classList.add("bg-gradient-to-r","from-yellow-500","to-orange-500"):n.classList.add("bg-gradient-to-r","from-emerald-500","to-green-500")),r){const s=[...this.actions.internal,...this.actions.external].some(v=>v.type&&v.value>0&&v.dice>0),i=Object.values(this.changes.technology).some(v=>v!==0),l=Object.values(this.changes.indicators).some(v=>v!==0),d=s||i||l,h=e*1e6>this.currentBudget;r.disabled=!d||h,h?r.textContent="❌ Orçamento Excedido":s?r.textContent="⚡ Aplicar Investimentos":i||l?r.textContent="✅ Aplicar Mudanças":r.textContent="⏳ Configure as Ações"}}updateTabCounters(){const e=document.querySelector('[data-tab="internal"]'),t=document.querySelector('[data-tab="external"]');e&&(e.innerHTML=`🏠 Ações Internas (${this.actions.internal.length}/${j.maxInternalActions})`),t&&(t.innerHTML=`🌍 Ações Externas (${this.actions.external.length}/${j.maxExternalActions})`)}updateSummary(){const e=document.getElementById("economic-summary-content");if(!e)return;const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=[...this.actions.internal,...this.actions.external].filter(s=>s.type&&s.value>0),o=Object.values(this.changes.technology).some(s=>s!==0),n=Object.values(this.changes.indicators).some(s=>s!==0);if(!(a.length>0||o||n)){e.innerHTML=`
        <div class="text-center py-12 text-slate-400">
          <div class="text-4xl mb-4">📊</div>
          <div class="text-lg mb-2">Nenhuma mudança configurada</div>
          <div class="text-sm">Configure ações econômicas, tecnologia, recursos ou indicadores para ver o resumo</div>
        </div>
      `;return}try{let s=null;if(a.length>0){const i={};a.filter(l=>l.isExternal).forEach(l=>{l.targetCountry&&(i[l.targetCountry]=this.getCountryById(l.targetCountry))}),s=z.processAllActions(a,t,i)}e.innerHTML=this.createSummaryHTML(s,t)}catch(s){m.error("Erro ao atualizar resumo:",s),e.innerHTML=`
        <div class="text-center py-12 text-red-400">
          <div class="text-4xl mb-4">❌</div>
          <div class="text-lg mb-2">Erro no cálculo</div>
          <div class="text-sm">Verifique se todas as ações estão configuradas corretamente</div>
        </div>
      `}}createSummaryHTML(e,t){let a='<div class="space-y-6">';if(e&&e.newPIB!==void 0&&e.newPIBPerCapita!==void 0){parseFloat(t.PIB);const r=((e.finalGrowth||0)*100).toFixed(2),s=((e.totalGrowth||0)*100).toFixed(2),i=((e.totalInflation||0)*100).toFixed(1);a+=`
        <!-- Resultado Principal -->
        <div class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">💰 Impacto Econômico</h4>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-lg font-bold text-slate-300">${se(parseFloat(t.PIBPerCapita)||0)}</div>
              <div class="text-xs text-slate-400 mt-1">PIB per Capita</div>
            </div>

            <div class="text-center">
              <div class="text-lg font-bold text-emerald-400">${se(e.newPIBPerCapita||0)}</div>
              <div class="text-xs text-slate-400 mt-1">Novo PIB per Capita</div>
            </div>

            <div class="text-center">
              <div class="text-2xl font-bold text-blue-400">+${r}%</div>
              <div class="text-xs text-slate-400 mt-1">Crescimento Real</div>
              <div class="text-xs text-emerald-300">${this.formatCurrency(e.newPIB||0)} PIB</div>
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
                ⚠️ <strong>Alta Inflação:</strong> Sem inflação, o crescimento seria de +${s}%
              </div>
            </div>
          `:""}
        </div>

        <!-- Breakdown por Ação -->
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">📋 Detalhamento por Ação</h4>
          
          <div class="space-y-3">
            ${e.actions.map(l=>{const d=(l.preInflationGrowth*100).toFixed(3),h=j.actionTypes[l.type],v=l.dice>5,w=l.dice===4||l.dice===5;return`
                <div class="flex items-center justify-between p-3 rounded-lg ${v?"bg-emerald-900/20 border border-emerald-500/30":l.dice<=3?"bg-red-900/20 border border-red-500/30":w?"bg-yellow-900/20 border border-yellow-500/30":"bg-slate-700/30 border border-slate-600/30"}">
                  <div class="flex-1">
                    <div class="font-medium text-slate-200">
                      ${h?.name||l.type} 
                      ${l.isExternal?`→ ${this.getCountryById(l.targetCountry)?.Pais||"País"}`:""}
                    </div>
                    <div class="text-sm text-slate-400">
                      ${this.formatCurrency(l.value*1e6)} • Dado: ${l.dice}/12
                      ${l.buff!==0?` • Buff: ${l.buff>0?"+":""}${l.buff}%`:""}
                      ${l.chainBonus?` • Cadeia: +${(l.chainBonus*100).toFixed(0)}%`:""}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold ${v?"text-emerald-400":l.dice<=3?"text-red-400":w?"text-yellow-400":"text-slate-400"}">
                      ${parseFloat(d)>=0?"+":""}${d}%
                    </div>
                    <div class="text-xs text-slate-500">
                      +${se(l.preInflationGrowth*(parseFloat(t.PIBPerCapita)||0))}
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

      `}const o=Object.values(this.changes.technology).some(r=>r!==0);o&&(a+=`
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">🔬 Mudanças em Tecnologia</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.technology).filter(([r,s])=>s!==0).map(([r,s])=>{const i=parseFloat(t[r])||0,l=Math.max(0,i+s),d={Tecnologia:"Tecnologia Civil",Aeronautica:"Aeronáutica",Marinha:"Marinha",Veiculos:"Veículos",Exercito:"Exército"};return`
                  <div class="flex items-center justify-between p-3 rounded-lg ${s>0?"bg-emerald-900/20 border border-emerald-500/30":"bg-red-900/20 border border-red-500/30"}">
                    <div class="text-slate-200">${d[r]||r}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${i} → ${l}</div>
                      <div class="font-semibold ${s>0?"text-emerald-400":"text-red-400"}">${s>0?"+":""}${s}</div>
                    </div>
                  </div>
                `}).join("")}
          </div>
        </div>
      `);const n=Object.values(this.changes.indicators).some(r=>r!==0);return n&&(a+=`
        <div class="border border-slate-600/50 rounded-xl p-6">
          <h4 class="text-lg font-semibold text-slate-200 mb-4">📊 Mudanças em Indicadores</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${Object.entries(this.changes.indicators).filter(([r,s])=>s!==0).map(([r,s])=>{const i=parseFloat(t[r])||0,l=Math.min(100,Math.max(0,i+s)),d={Estabilidade:"Estabilidade",Burocracia:"Burocracia",Urbanizacao:"Urbanização",IndustrialEfficiency:"Eficiência Industrial"};return`
                  <div class="flex items-center justify-between p-3 rounded-lg ${s>0?"bg-emerald-900/20 border border-emerald-500/30":"bg-red-900/20 border border-red-500/30"}">
                    <div class="text-slate-200">${d[r]||r}</div>
                    <div class="text-right">
                      <div class="text-sm text-slate-400">${i}% → ${l}%</div>
                      <div class="font-semibold ${s>0?"text-emerald-400":"text-red-400"}">${s>0?"+":""}${s}%</div>
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
          ${e?.actions?.some(r=>r.isExternal)?"<div>• Ações externas afetarão os países de destino</div>":""}
          ${o?"<div>• Valores de tecnologia serão atualizados</div>":""}
          ${n?"<div>• Indicadores nacionais serão alterados</div>":""}
        </div>
      </div>
    </div>
    `,a}switchEconomySubtab(e){const t=document.getElementById("economic-simulator-modal");t&&(t.querySelectorAll(".economy-subtab").forEach(a=>{a.dataset.subtab===e?(a.classList.remove("bg-slate-700","text-slate-300"),a.classList.add("bg-purple-600","text-white")):(a.classList.remove("bg-purple-600","text-white"),a.classList.add("bg-slate-700","text-slate-300"))}),t.querySelectorAll(".economy-subtab-content").forEach(a=>{a.classList.add("hidden")}),t.querySelector(`#economy-subtab-${e}`)?.classList.remove("hidden"))}adjustTechnology(e,t){this.changes.technology[e]=(this.changes.technology[e]||0)+t;const a=document.querySelector(`.tech-input[data-field="${e}"]`);a&&(a.value=this.changes.technology[e]),this.updateTechPreview(e),this.updateSummary()}updateTechPreview(e){const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=parseFloat(t[e])||0,o=this.changes.technology[e]||0,n=Math.max(0,a+o),r=document.querySelector(`.tech-preview[data-field="${e}"]`);r&&(r.textContent=n)}adjustIndicator(e,t){const a=this.getCountryById(this.selectedCountry);if(!a)return;const o=parseFloat(a[e])||0,r=(this.changes.indicators[e]||0)+t,s=o+r;if(s<0||s>100){u("warning",`${e} deve estar entre 0% e 100%`);return}this.changes.indicators[e]=r;const i=document.querySelector(`.indicator-input[data-field="${e}"]`);i&&(i.value=this.changes.indicators[e]),this.updateIndicatorPreview(e),this.updateSummary()}updateIndicatorPreview(e){const t=this.getCountryById(this.selectedCountry);if(!t)return;const a=parseFloat(t[e])||0,o=this.changes.indicators[e]||0,n=Math.min(100,Math.max(0,a+o)),r=document.querySelector(`.indicator-preview[data-field="${e}"]`);r&&(r.textContent=`${n}%`);const s=r?.closest(".border")?.querySelector(".bg-gradient-to-r");s&&(s.style.width=`${n}%`)}resetActions(){this.actions.internal=[],this.actions.external=[],this.changes={technology:{},indicators:{}},this.recreateActionSlots("internal"),this.recreateActionSlots("external"),this.updateTabCounters(),this.updateBudgetBar(),this.updateSummary()}toggleActionDescription(e){const a=e.closest(".action-slot").querySelector(".action-description"),o=a.querySelector("div");if(e.value){const n=j.actionTypes[e.value];n&&(o.textContent=`${n.description}. Exemplos: ${n.examples.join(", ")}.`,a.classList.remove("hidden"))}else a.classList.add("hidden")}toggleResourceSelector(e){const t=e.closest(".action-slot"),a=t.querySelector(".resource-type-selector"),o=t.querySelector(".extraction-preview");e.value==="exploration"?(a?.classList.remove("hidden"),o?.classList.remove("hidden")):(a?.classList.add("hidden"),o?.classList.add("hidden"))}updateExtractionPreview(e,t){const a=e.querySelector(".extraction-amount");if(!a)return;if(!t.resourceType||!t.value||!t.dice){a.textContent="Aguardando dados...";return}const o=this.getCountryById(this.selectedCountry);if(!o)return;const r={Combustivel:"PotencialCombustivel",Carvao:"PotencialCarvao",Metais:"PotencialMetais"}[t.resourceType],s=parseFloat(o[r])||0,i=t.value/10*(t.dice/12)*(s/10),l=Math.round(i*100)/100,d={Combustivel:"Combustível",Carvao:"Carvão",Metais:"Metais"};a.innerHTML=`<strong>${l.toFixed(2)}</strong> unidades de ${d[t.resourceType]} (Potencial: ${s}/10)`}async applyEconomicActions(){const e=document.getElementById("economic-simulator-modal"),t=document.getElementById("apply-economic-actions");if(!(!e||!t))try{t.disabled=!0,t.textContent="⏳ Aplicando...";const a=this.getCountryById(this.selectedCountry);if(!a)throw new Error("País não encontrado");const o=[...this.actions.internal,...this.actions.external].filter(h=>h.type&&h.value>0),n=Object.values(this.changes.technology).some(h=>h!==0),r=Object.values(this.changes.indicators).some(h=>h!==0);if(!(o.length>0||n||r))throw new Error("Nenhuma mudança configurada");const i={};for(const h of o.filter(v=>v.isExternal))h.targetCountry&&(i[h.targetCountry]=this.getCountryById(h.targetCountry));const l=o.length>0?z.processAllActions(o,a,i):null;await this.saveEconomicResults(l,o,i);try{await Re.generatePlayerFeedback(this.selectedCountry,l,o),m.info("Feedback narrativo gerado para o player")}catch(h){m.warn("Erro ao gerar feedback narrativo:",h)}let d="Mudanças aplicadas com sucesso!";if(l&&l.finalGrowth!==void 0)d=`Investimentos aplicados! PIB cresceu ${((l.finalGrowth||0)*100).toFixed(2)}%`;else if(n||r){const h=[];n&&h.push("tecnologia"),r&&h.push("indicadores"),d=`Mudanças em ${h.join(", ")} aplicadas!`}u("success",d),e.remove(),window.carregarTudo&&await window.carregarTudo(),setTimeout(()=>{window.location.pathname.includes("narrador")&&window.location.reload()},1500)}catch(a){m.error("Erro ao aplicar ações econômicas:",a),u("error",`Erro: ${a.message}`)}finally{t&&(t.disabled=!1,t.textContent="⚡ Aplicar Investimentos")}}async saveEconomicResults(e,t,a){const o=p.batch(),n=parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1;try{const r=p.collection("paises").doc(this.selectedCountry),s=this.getCountryById(this.selectedCountry)||{},i={TurnoUltimaAtualizacao:n};e&&e.newPIB!==void 0&&e.newPIBPerCapita!==void 0&&(i.PIB=e.newPIB,i.PIBPerCapita=e.newPIBPerCapita,i["geral.PIB"]=e.newPIB,i["geral.PIBPerCapita"]=e.newPIBPerCapita);for(const[b,x]of Object.entries(this.changes.technology))if(x!==0){const k=parseFloat(s[b])||0,E=Math.max(0,k+x);i[b]=E,i[`geral.${b}`]=E}const l=t.filter(b=>b.type==="exploration"&&b.resourceType&&b.value&&b.dice);for(const b of l){const k={Combustivel:"PotencialCombustivel",Carvao:"PotencialCarvao",Metais:"PotencialMetais"}[b.resourceType],E=parseFloat(s[k])||0,W=b.value/10*(b.dice/12)*(E/10),ee=Math.round(W*100)/100,te={Combustivel:"CombustivelProducao",Carvao:"CarvaoProducao",Metais:"MetaisProducao"}[b.resourceType],we=parseFloat(s[te])||0;i[te]=we+ee,m.log(`[Exploration] ${s.Pais}: Extraiu ${ee} unidades de ${b.resourceType} (Potencial: ${E}/10, Dado: ${b.dice}/12)`)}let d=0,h=0,v=0,w=0;const C=s.PoliticaIndustrial||s.Politica||"combustivel";for(const b of t){if(b.type==="industry"){const x=z.computeIndustryResourceConsumption(b.value,s);C==="carvao"?h+=x:d+=x,v+=(parseFloat(b.value)||0)*.5}if(b.type==="exploration"){const x=parseFloat(b.value)||0,k=parseFloat(s.PotencialCarvao||s.Potencial||s.PotencialCarvao||0)||0,E=Math.min(k*.1,x*.1);w+=E}b.type==="research"&&(v+=(parseFloat(b.value)||0)*.2)}const S=parseFloat(s.IndustrialEfficiency)||50,q=t.filter(b=>b.type==="industry").length*.5,R=Math.min(100,S+q+(e.technologyChanges||0)*.2);i.IndustrialEfficiency=R;const V=parseFloat(s.EnergiaCapacidade)||parseFloat(s.EnergiaDisponivel)||0,N=z.computeEnergyPenalty(V,v);if(N<1){const b=(1-N)*100,x=e.newPIB*(1-N)*.1;e.newPIB=Math.max(e.newPIB-x,e.newPIB*.95),e.newPIBPerCapita=e.newPIB/(parseFloat(s.Populacao)||1),m.info(`Penalidade de energia aplicada: ${b.toFixed(1)}% déficit, -${x.toFixed(0)} PIB`)}i.EnergiaCapacidade=V;const O=parseFloat(s.Combustivel)||0,g=parseFloat(s.CarvaoSaldo||s.Carvao||0),f=Math.max(0,O-d),$=Math.max(0,g-h+w);i.Combustivel=f,i.CarvaoSaldo=$,w>0&&(historyData.results.producedCarvao=w);const M={Graos:s.Graos||0,Combustivel:f,EnergiaDisponivel:V},B=z.computeConsumerGoodsIndex(s,M);i.BensDeConsumo=B;const I=parseFloat(s.Estabilidade)||0;if(B>75?(i.Estabilidade=Math.min(100,I+3),i["geral.Estabilidade"]=Math.min(100,I+3)):B<25&&(i.Estabilidade=Math.max(0,I-3),i["geral.Estabilidade"]=Math.max(0,I-3)),e&&e.technologyChanges>0){const b=parseFloat(this.getCountryById(this.selectedCountry).Tecnologia)||0,x=Math.min(100,b+e.technologyChanges);i.Tecnologia=x,i["geral.Tecnologia"]=x}if(e&&e.stabilityChanges>0){const b=parseFloat(this.getCountryById(this.selectedCountry).Estabilidade)||0,x=Math.min(100,b+e.stabilityChanges);i.Estabilidade=x,i["geral.Estabilidade"]=x}for(const[b,x]of Object.entries(this.changes.indicators))if(x!==0){const k=parseFloat(s[b])||0,E=Math.min(100,Math.max(0,k+x));i[b]=E,i[`geral.${b}`]=E,m.info(`Mudança manual de ${b}: ${k} → ${E} (delta: ${x})`)}o.update(r,i);for(const b of t.filter(x=>x.isExternal))if(b.targetCountry&&a[b.targetCountry]){const x=a[b.targetCountry],E=z.calculateBaseGrowth(b,x).preInflationGrowth*b.value/1e6*.5,W=p.collection("paises").doc(b.targetCountry),ee=parseFloat(x.Populacao)||1,ne=parseFloat(x.PIBPerCapita||0)+E/1e6,te=ee*ne;o.update(W,{PIB:te,PIBPerCapita:ne,TurnoUltimaAtualizacao:n})}if(e&&e.totalGrowth!==void 0){const b=p.collection("economic_history").doc(),x={countryId:this.selectedCountry,turn:n,timestamp:new Date,totalInvestment:t.reduce((E,W)=>E+(parseFloat(W.value)||0),0),actions:t,results:{totalGrowth:e.totalGrowth||0,finalGrowth:e.finalGrowth||0,inflation:e.totalInflation||0,newPIB:e.newPIB||0,productiveChains:e.productiveChains||[]},externalInvestments:{}};t.filter(E=>E.isExternal).forEach(E=>{E.targetCountry&&(x.externalInvestments[E.targetCountry]=parseFloat(E.value)||0)}),o.set(b,x);const k=p.collection("change_history").doc();o.set(k,{countryId:this.selectedCountry,section:"economia",field:"simulacao_economica",oldValue:{PIB:parseFloat(this.getCountryById(this.selectedCountry).PIB),PIBPerCapita:parseFloat(this.getCountryById(this.selectedCountry).PIBPerCapita)||0},newValue:{PIB:e.newPIB||0,PIBPerCapita:e.newPIBPerCapita||0},userName:A.currentUser?.displayName||"Narrador",reason:`Simulação econômica: ${t.length} ações aplicadas`,timestamp:new Date,turn:n})}await o.commit(),m.info("Simulação econômica aplicada com sucesso")}catch(r){throw m.error("Erro ao salvar resultados econômicos:",r),r}}async buildPowerPlant(e,t){try{const a=this.getCountryById(e);if(!a)return u("error","País não encontrado."),{success:!1,message:"País não encontrado."};const o=Se[t];if(!o)return u("error","Tipo de usina inválido."),{success:!1,message:"Tipo de usina inválido."};if(a.PIB<o.cost)return u("error",`PIB insuficiente para construir ${o.name}. Necessário: ${this.formatCurrency(o.cost)}`),{success:!1,message:"PIB insuficiente."};if(a.Tecnologia<o.tech_requirement)return u("error",`Tecnologia insuficiente para construir ${o.name}. Necessário: ${o.tech_requirement}%`),{success:!1,message:"Tecnologia insuficiente."};if(o.type==="hydro"){if(!a.PotencialHidreletrico||a.PotencialHidreletrico<=0)return u("error",`País não possui potencial hidrelétrico para construir ${o.name}.`),{success:!1,message:"Potencial hidrelétrico insuficiente."};a.PotencialHidreletrico--}if(o.resource_input==="Uranio"){if(!a.Uranio||a.Uranio<=0)return u("error",`País não possui Urânio suficiente para construir ${o.name}.`),{success:!1,message:"Urânio insuficiente."};a.Uranio--}return await p.runTransaction(async n=>{const r=p.collection("paises").doc(e),i=(await n.get(r)).data(),l=i.PIB-o.cost,d=[...i.power_plants||[],{id:t,built_turn:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}],h={PIB:l,power_plants:d,...o.type==="hydro"&&{PotencialHidreletrico:a.PotencialHidreletrico},...o.resource_input==="Uranio"&&{Uranio:a.Uranio}};n.update(r,h)}),a.PIB-=o.cost,a.power_plants.push({id:t,built_turn:parseInt(document.getElementById("turno-atual-admin")?.textContent?.replace("#",""))||1}),u("success",`${o.name} construída com sucesso!`),m.info(`${o.name} construída para ${a.Pais}`,{countryId:e,plantTypeId:t}),{success:!0,message:`${o.name} construída.`}}catch(a){return m.error(`Erro ao construir usina ${t} para ${e}:`,a),u("error",`Erro ao construir usina: ${a.message}`),{success:!1,message:`Erro ao construir usina: ${a.message}`}}}}let ie=null;async function ze(){try{return ie=new Oe,await ie.initialize(),ie}catch(c){throw m.error("Erro ao inicializar simulador econômico:",c),c}}async function _e(){try{if(!await D("Confirmar Migração de Dados","Esta ação irá verificar TODOS os países e adicionar os novos campos de economia (Carvão, Energia, etc.) com valores padrão. Execute esta operação APENAS UMA VEZ. Deseja continuar?","Sim, migrar agora","Cancelar")){u("info","Migração cancelada pelo usuário.");return}u("info","Iniciando migração... Isso pode levar um momento.");const e=await p.collection("paises").get(),t=p.batch();let a=0;e.forEach(o=>{const n=o.data(),r=o.ref,s={};n.PotencialCarvao===void 0&&(s.PotencialCarvao=3),n.CarvaoSaldo===void 0&&(s.CarvaoSaldo=0),n.PoliticaIndustrial===void 0&&(s.PoliticaIndustrial="combustivel"),n.Energia===void 0&&(s.Energia={capacidade:100,demanda:100}),n.IndustrialEfficiency===void 0&&(s.IndustrialEfficiency=30),n.BensDeConsumo===void 0&&(s.BensDeConsumo=50),n.PotencialHidreletrico===void 0&&(s.PotencialHidreletrico=2),n.Uranio===void 0&&(s.Uranio=0),n.EnergiaCapacidade===void 0&&(s.EnergiaCapacidade=100),n.power_plants===void 0&&(s.power_plants=[]),Object.keys(s).length>0&&(a++,t.update(r,s))}),a>0?(await t.commit(),u("success",`${a} países foram migrados com sucesso!`)):u("info","Nenhum país precisava de migração. Tudo já está atualizado.")}catch(c){console.error("Erro durante a migração:",c),u("error",`Erro na migração: ${c.message}`)}}function Ue(){const c=document.querySelectorAll(".tab-button"),e=document.querySelectorAll(".tab-panel");if(!c.length||!e.length)return;function t(o){c.forEach(s=>{s.classList.remove("border-brand-500","text-brand-300"),s.classList.add("border-transparent","text-slate-400"),s.setAttribute("aria-selected","false")}),e.forEach(s=>{s.classList.add("hidden")});const n=document.querySelector(`[data-tab="${o}"]`),r=document.getElementById(`panel-${o}`);n&&r&&(n.classList.remove("border-transparent","text-slate-400"),n.classList.add("border-brand-500","text-brand-300"),n.setAttribute("aria-selected","true"),r.classList.remove("hidden")),o==="players"?setTimeout(()=>{window.playerManager&&(window.playerManager.loadPlayers(),window.playerManager.loadCountries())},100):o==="gameplay"&&setTimeout(()=>{window.updateQuickStats&&window.updateQuickStats()},100)}c.forEach(o=>{o.addEventListener("click",()=>{const n=o.getAttribute("data-tab");t(n)})});const a=c[0]?.getAttribute("data-tab");a&&t(a),window.updateTabBadges=function(o){const n=document.getElementById("gameplay-badge"),r=document.getElementById("players-badge");n&&o?.vehiclesPending>0?(n.textContent=o.vehiclesPending,n.classList.remove("hidden")):n&&n.classList.add("hidden"),r&&o?.playersOnline>0?(r.textContent=o.playersOnline,r.classList.remove("hidden")):r&&r.classList.add("hidden")},window.switchTab=t}class Ge{constructor(e){this.worldMap=e,this.colorPalette=[{name:"Vermelho",color:"#ef4444"},{name:"Azul",color:"#3b82f6"},{name:"Verde",color:"#22c55e"},{name:"Amarelo",color:"#eab308"},{name:"Roxo",color:"#a855f7"},{name:"Rosa",color:"#ec4899"},{name:"Laranja",color:"#f97316"},{name:"Ciano",color:"#06b6d4"},{name:"Vermelho Escuro",color:"#991b1b"},{name:"Azul Escuro",color:"#1e3a8a"},{name:"Verde Escuro",color:"#064e3b"},{name:"Roxo Escuro",color:"#581c87"},{name:"Laranja Escuro",color:"#9a3412"},{name:"Rosa Escuro",color:"#9f1239"},{name:"Vermelho Claro",color:"#fca5a5"},{name:"Azul Claro",color:"#93c5fd"},{name:"Verde Claro",color:"#86efac"},{name:"Amarelo Claro",color:"#fde047"},{name:"Roxo Claro",color:"#d8b4fe"},{name:"Rosa Claro",color:"#fbcfe8"},{name:"Lima",color:"#84cc16"},{name:"Índigo",color:"#6366f1"},{name:"Turquesa",color:"#14b8a6"},{name:"Magenta",color:"#c026d3"},{name:"Âmbar",color:"#f59e0b"},{name:"Esmeralda",color:"#10b981"},{name:"Marrom",color:"#92400e"},{name:"Cinza Escuro",color:"#4b5563"},{name:"Cinza",color:"#6b7280"},{name:"Cinza Claro",color:"#d1d5db"},{name:"Preto",color:"#1f2937"},{name:"Branco",color:"#f9fafb"},{name:"Dourado",color:"#fbbf24"},{name:"Prata",color:"#94a3b8"},{name:"Bronze",color:"#b45309"},{name:"Cobre",color:"#c2410c"}]}render(e){const t=document.getElementById(e);if(!t){console.error("Container de controles não encontrado");return}t.innerHTML=`
            <div class="map-controls bg-slate-900/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-slate-700">
                <!-- Título -->
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-slate-100 mb-1">Controles do Mapa</h3>
                    <p class="text-xs text-slate-400">Clique em uma província para pintá-la</p>
                </div>

                <!-- Seletor de Cor -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-slate-300 mb-2">
                        Cor Selecionada
                    </label>
                    <div class="flex items-center gap-3 mb-3">
                        <div id="current-color-display"
                             class="w-12 h-12 rounded-lg border-2 border-slate-600 shadow-inner"
                             style="background-color: #ef4444;">
                        </div>
                        <input type="color"
                               id="custom-color-picker"
                               value="#ef4444"
                               class="w-16 h-12 rounded-lg border-2 border-slate-600 cursor-pointer">
                        <div class="flex-1">
                            <div id="current-color-hex" class="text-sm font-mono text-slate-300">#ef4444</div>
                            <div id="current-color-name" class="text-xs text-slate-500">Vermelho</div>
                        </div>
                    </div>

                    <!-- Paleta de Cores -->
                    <div class="grid grid-cols-6 gap-2" id="color-palette">
                        ${this.colorPalette.map(a=>`
                            <button class="color-btn w-full aspect-square rounded-lg border-2 border-transparent hover:border-slate-400 hover:scale-110 transition-all shadow-md"
                                    style="background-color: ${a.color}"
                                    data-color="${a.color}"
                                    data-name="${a.name}"
                                    title="${a.name}">
                            </button>
                        `).join("")}
                    </div>
                </div>

                <!-- Ferramentas -->
                <div class="space-y-2">
                    <button id="export-json-btn"
                            class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Exportar JSON
                    </button>

                    <button id="import-json-btn"
                            class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        Importar JSON
                    </button>

                    <button id="reset-map-btn"
                            class="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Resetar Mapa
                    </button>
                </div>

                <!-- Input file escondido para import -->
                <input type="file" id="json-file-input" accept=".json" style="display: none;">

                <!-- Estatísticas -->
                <div class="mt-4 pt-4 border-t border-slate-700">
                    <h4 class="text-xs font-semibold text-slate-400 mb-2">Estatísticas</h4>
                    <div class="space-y-1 text-xs text-slate-500">
                        <div class="flex justify-between">
                            <span>Províncias pintadas:</span>
                            <span id="painted-count" class="text-slate-300 font-mono">0</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Última atualização:</span>
                            <span id="last-update" class="text-slate-300 font-mono">-</span>
                        </div>
                    </div>
                </div>
            </div>
        `,this.setupEventListeners()}setupEventListeners(){const e=document.getElementById("custom-color-picker");e&&e.addEventListener("input",r=>{this.selectColor(r.target.value,"Personalizado")}),document.querySelectorAll(".color-btn").forEach(r=>{r.addEventListener("click",()=>{const s=r.dataset.color,i=r.dataset.name;this.selectColor(s,i)})});const t=document.getElementById("reset-map-btn");t&&t.addEventListener("click",()=>{this.worldMap.resetAllProvinces()});const a=document.getElementById("export-json-btn");a&&a.addEventListener("click",()=>{this.exportJSON()});const o=document.getElementById("import-json-btn"),n=document.getElementById("json-file-input");o&&n&&(o.addEventListener("click",()=>{n.click()}),n.addEventListener("change",async r=>{const s=r.target.files[0];s&&(await this.importJSON(s),n.value="")}))}selectColor(e,t){this.worldMap.setSelectedColor(e);const a=document.getElementById("current-color-display"),o=document.getElementById("current-color-hex"),n=document.getElementById("current-color-name"),r=document.getElementById("custom-color-picker");a&&(a.style.backgroundColor=e),o&&(o.textContent=e),n&&(n.textContent=t),r&&(r.value=e),document.querySelectorAll(".color-btn").forEach(s=>{s.dataset.color===e?s.classList.add("border-white","ring-2","ring-white"):s.classList.remove("border-white","ring-2","ring-white")})}async exportJSON(){try{const{provinceService:e}=await T(async()=>{const{provinceService:r}=await import("./worldMap-BFOKH5HR.js").then(s=>s.p);return{provinceService:r}},__vite__mapDeps([3,0,1,2])),t=await e.exportMapAsJSON();if(!t){alert("Erro ao exportar mapa!");return}const a=new Blob([t],{type:"application/json"}),o=URL.createObjectURL(a),n=document.createElement("a");n.href=o,n.download=`war-mapa-${new Date().toISOString().split("T")[0]}.json`,document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(o),alert("Mapa exportado com sucesso!")}catch(e){console.error("Erro ao exportar mapa:",e),alert("Erro ao exportar mapa: "+e.message)}}async importJSON(e){try{if(!confirm("ATENÇÃO: Importar um mapa vai SUBSTITUIR todas as províncias atuais. Deseja continuar?"))return;const t=await e.text(),{provinceService:a}=await T(async()=>{const{provinceService:r}=await import("./worldMap-BFOKH5HR.js").then(s=>s.p);return{provinceService:r}},__vite__mapDeps([3,0,1,2])),o=firebase.auth().currentUser?.uid,n=await a.importMapFromJSON(t,o);alert(n?"Mapa importado com sucesso! O mapa será atualizado automaticamente.":"Erro ao importar mapa!")}catch(t){console.error("Erro ao importar mapa:",t),alert("Erro ao importar mapa: "+t.message)}}updateStats(e){const t=document.getElementById("painted-count"),a=document.getElementById("last-update");if(t&&(t.textContent=e),a){const o=new Date().toLocaleTimeString("pt-BR");a.textContent=o}}}let X="pending",K=[];async function He(c){console.log("🎖️ Inicializando sistema de aprovação de divisões"),We(),await pe()}function We(){document.getElementById("filter-all-divisions")?.addEventListener("click",()=>J("all")),document.getElementById("filter-pending-divisions")?.addEventListener("click",()=>J("pending")),document.getElementById("filter-approved-divisions")?.addEventListener("click",()=>J("approved")),document.getElementById("filter-rejected-divisions")?.addEventListener("click",()=>J("rejected"))}async function pe(){try{const c=[],e=await p.collection("inventory").get();for(const t of e.docs){const a=t.data(),o=t.id,n=a.divisions||[],r=await p.collection("paises").doc(o).get(),s=r.exists?r.data():null;n.forEach(i=>{c.push({...i,countryId:o,countryName:s?.Pais||o,countryFlag:s?.Flag||"🏳️"})})}K=c,console.log(`✅ ${K.length} divisões carregadas`),Xe(),J(X)}catch(c){console.error("Erro ao carregar divisões:",c),u("error","Erro ao carregar divisões: "+c.message)}}function J(c){X=c,document.querySelectorAll('[id^="filter-"]').forEach(a=>{a.classList.remove("bg-brand-500","text-slate-900","border-brand-500"),a.classList.add("bg-slate-700/50")});const e=document.getElementById(`filter-${c}-divisions`);e&&(e.classList.remove("bg-slate-700/50"),e.classList.add("bg-brand-500","text-slate-900"));let t=K;c!=="all"&&(t=K.filter(a=>(a.approvalStatus||"approved")===c)),Qe(t)}function Qe(c){const e=document.getElementById("divisions-approval-container");if(!e)return;if(c.length===0){e.innerHTML=`
      <div class="text-center py-16 rounded-xl bg-bg-soft border border-bg-ring/70">
        <div class="text-6xl mb-4">📭</div>
        <h3 class="text-xl font-semibold text-slate-200 mb-2">Nenhuma divisão encontrada</h3>
        <p class="text-slate-400">Não há divisões ${X==="all"?"":X==="pending"?"pendentes":X==="approved"?"aprovadas":"rejeitadas"} no momento</p>
      </div>
    `;return}const t=`
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${c.map(a=>Je(a)).join("")}
    </div>
  `;e.innerHTML=t}function Je(c){const e=c.approvalStatus||"approved",t=c.calculatedStats||{},a=t.combatStats||{},o=t.manpower||{total:0};let n="",r="";return e==="pending"?(n='<div class="absolute top-3 right-3 bg-yellow-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">⏳ Pendente</div>',r=`
      <div class="flex gap-2 mt-4">
        <button onclick="window.approveDivision('${c.countryId}', '${c.id}')"
                class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-semibold transition-all">
          ✅ Aprovar
        </button>
        <button onclick="window.rejectDivision('${c.countryId}', '${c.id}')"
                class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-semibold transition-all">
          ❌ Rejeitar
        </button>
      </div>
    `):e==="approved"?n='<div class="absolute top-3 right-3 bg-green-500 text-slate-900 text-xs font-bold px-3 py-1 rounded-full">✅ Aprovada</div>':e==="rejected"&&(n='<div class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">❌ Rejeitada</div>',c.rejectionReason&&(r=`<div class="mt-3 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400"><strong>Motivo:</strong> ${c.rejectionReason}</div>`)),`
    <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-5 relative hover:border-brand-500/50 transition-colors">
      ${n}

      <div class="mb-3">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">${c.countryFlag}</span>
          <span class="text-xs text-slate-500">${c.countryName}</span>
        </div>
        <h3 class="text-lg font-bold text-slate-100">${c.name}</h3>
        <span class="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
          ${c.trainingLevel||"regular"}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-3 text-sm mb-3">
        <div class="bg-slate-800/50 rounded p-2">
          <p class="text-slate-500 text-xs">Manpower</p>
          <p class="font-bold text-slate-100">${o.total?.toLocaleString()||"0"}</p>
        </div>
        <div class="bg-slate-800/50 rounded p-2">
          <p class="text-slate-500 text-xs">Combat Width</p>
          <p class="font-bold text-slate-100">${a.combatWidth||"0"}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs text-slate-400">
        <div><span class="text-slate-500">Soft Attack:</span> <span class="text-red-400 font-semibold">${(a.softAttack||0).toFixed(1)}</span></div>
        <div><span class="text-slate-500">Hard Attack:</span> <span class="text-orange-400 font-semibold">${(a.hardAttack||0).toFixed(1)}</span></div>
        <div><span class="text-slate-500">Defense:</span> <span class="text-blue-400 font-semibold">${(a.defense||0).toFixed(1)}</span></div>
        <div><span class="text-slate-500">Organization:</span> <span class="text-cyan-400 font-semibold">${(a.organization||0).toFixed(1)}</span></div>
      </div>

      ${r}
    </div>
  `}async function Ze(c,e){try{if(!await D("Aprovar Divisão","Deseja aprovar esta divisão?","Aprovar","Cancelar"))return;const a=p.collection("inventory").doc(c),o=await a.get();if(!o.exists)throw new Error("Inventário não encontrado");const r=o.data().divisions||[],s=r.findIndex(i=>i.id===e);if(s===-1)throw new Error("Divisão não encontrada");r[s].approvalStatus="approved",r[s].approvedBy=auth.currentUser.uid,r[s].approvedAt=new Date().toISOString(),delete r[s].rejectedBy,delete r[s].rejectedAt,delete r[s].rejectionReason,await a.update({divisions:r}),u("success","✅ Divisão aprovada com sucesso!"),await pe()}catch(t){console.error("Erro ao aprovar divisão:",t),u("error","Erro ao aprovar: "+t.message)}}async function Ye(c,e){try{const t=prompt("Por que você está rejeitando esta divisão?");if(!t)return;const a=p.collection("inventory").doc(c),o=await a.get();if(!o.exists)throw new Error("Inventário não encontrado");const r=o.data().divisions||[],s=r.findIndex(i=>i.id===e);if(s===-1)throw new Error("Divisão não encontrada");r[s].approvalStatus="rejected",r[s].rejectedBy=auth.currentUser.uid,r[s].rejectedAt=new Date().toISOString(),r[s].rejectionReason=t,delete r[s].approvedBy,delete r[s].approvedAt,await a.update({divisions:r}),u("success","❌ Divisão rejeitada"),await pe()}catch(t){console.error("Erro ao rejeitar divisão:",t),u("error","Erro ao rejeitar: "+t.message)}}function Xe(){const c=K.filter(t=>(t.approvalStatus||"approved")==="pending").length,e=document.getElementById("divisions-approval-badge");e&&(c>0?(e.textContent=c,e.classList.remove("hidden")):e.classList.add("hidden"))}typeof window<"u"&&(window.approveDivision=Ze,window.rejectDivision=Ye);const Q={geral:{label:"Geral",campos:[{key:"PIBPerCapita",label:"PIB per Capita",tipo:"moeda",min:0},{key:"PIB",label:"PIB Total",tipo:"calculado",dependeDe:["PIBPerCapita","Populacao"]},{key:"Populacao",label:"População",tipo:"inteiro",min:0},{key:"Estabilidade",label:"Estabilidade",tipo:"percent",min:0,max:100},{key:"Burocracia",label:"Burocracia",tipo:"percent",min:0,max:100},{key:"Urbanizacao",label:"Urbanização",tipo:"percent",min:0,max:100},{key:"Tecnologia",label:"Tecnologia",tipo:"percent",min:0,max:100},{key:"ModeloPolitico",label:"Modelo Político",tipo:"texto"},{key:"Visibilidade",label:"Visibilidade",tipo:"opcoes",opcoes:["Público","Privado"]}]},exercito:{label:"Exército",campos:[{key:"Infantaria",label:"Infantaria",tipo:"inteiro",min:0},{key:"Artilharia",label:"Artilharia",tipo:"inteiro",min:0}]},aeronautica:{label:"Aeronáutica",campos:[{key:"Caca",label:"Caça",tipo:"inteiro",min:0},{key:"CAS",label:"CAS",tipo:"inteiro",min:0},{key:"Bomber",label:"Bombardeiro",tipo:"inteiro",min:0}]},marinha:{label:"Marinha",campos:[{key:"Fragata",label:"Fragata",tipo:"inteiro",min:0},{key:"Destroyer",label:"Destroyer",tipo:"inteiro",min:0},{key:"Submarino",label:"Submarino",tipo:"inteiro",min:0},{key:"Transporte",label:"Transporte",tipo:"inteiro",min:0}]},inventario:{label:"Inventário de Veículos",campos:[{key:"cavalos",label:"Cavalos",tipo:"inteiro",min:0},{key:"tanquesLeves",label:"Tanques Leves",tipo:"inteiro",min:0},{key:"mbt",label:"MBT",tipo:"inteiro",min:0},{key:"tanquesPesados",label:"Tanques Pesados",tipo:"inteiro",min:0},{key:"caminhoes",label:"Caminhões de Transporte",tipo:"inteiro",min:0},{key:"spg",label:"SPG",tipo:"inteiro",min:0},{key:"sph",label:"SPH",tipo:"inteiro",min:0},{key:"spaa",label:"SPAA",tipo:"inteiro",min:0},{key:"apc",label:"APC",tipo:"inteiro",min:0},{key:"cacaTanques",label:"Caça-Tanques",tipo:"inteiro",min:0},{key:"veiculosEng",label:"Veículos de Engenharia",tipo:"inteiro",min:0},{key:"ifv",label:"IFV",tipo:"inteiro",min:0}]},recursos:{label:"Recursos",campos:[{key:"Graos",label:"Graos (estoque)",tipo:"inteiro",min:0},{key:"Combustivel",label:"Combustível (unidades)",tipo:"inteiro",min:0},{key:"CombustivelSaldo",label:"Saldo de Combustível",tipo:"inteiro"},{key:"Metais",label:"Metais",tipo:"inteiro"},{key:"PotencialCarvao",label:"Potencial de Carvão (Jazidas)",tipo:"inteiro",min:0}]},ocupacao:{label:"Ocupação",campos:[{key:"PopOcupada",label:"População Ocupada",tipo:"inteiro",min:0},{key:"PIBOcupado",label:"PIB Ocupado",tipo:"moeda",min:0}]},arsenal:{label:"Arsenal Especial",campos:[{key:"Nuclear",label:"Bomba Nuclear",tipo:"inteiro",min:0}]}};let L=null,P={paises:[],paisSelecionado:null,secaoSelecionada:"geral",realTimeEnabled:!0,autoSave:!0,listeners:new Map,pendingChanges:new Set};const y={gate:document.getElementById("gate"),adminRoot:document.getElementById("admin-root"),turnoAtual:document.getElementById("turno-atual-admin"),menuSecoes:document.getElementById("menu-secoes"),selectPais:document.getElementById("select-pais"),selectSecao:document.getElementById("select-secao"),formSecao:document.getElementById("form-secao"),listaCampos:document.getElementById("lista-campos-secao"),btnSalvarSecao:document.getElementById("btn-salvar-secao"),btnRecarregar:document.getElementById("btn-recarregar"),btnSalvarTurno:document.getElementById("btn-salvar-turno"),turnoInput:document.getElementById("turno-input"),btnSalvarCatalogo:document.getElementById("btn-salvar-catalogo"),btnCarregarCatalogo:document.getElementById("btn-carregar-catalogo"),btnAdicionarCampo:document.getElementById("btn-adicionar-campo"),logout:document.getElementById("logout-link"),realTimeToggle:document.getElementById("realtime-toggle"),autoSaveToggle:document.getElementById("autosave-toggle"),historyList:document.getElementById("history-list"),historyRefresh:document.getElementById("history-refresh"),exportHistory:document.getElementById("export-history"),playersList:document.getElementById("players-list"),availableCountries:document.getElementById("available-countries"),playerCount:document.getElementById("player-count"),availableCount:document.getElementById("available-count"),refreshPlayers:document.getElementById("refresh-players"),assignRandom:document.getElementById("assign-random"),clearAllAssignments:document.getElementById("clear-all-assignments"),exhaustionCountrySelect:document.getElementById("exhaustion-country-select"),exhaustionValueInput:document.getElementById("exhaustion-value-input"),exhaustionReasonInput:document.getElementById("exhaustion-reason-input"),btnApplyManualExhaustion:document.getElementById("btn-apply-manual-exhaustion"),warCountrySelect:document.getElementById("war-country-select"),warTargetSelect:document.getElementById("war-target-select"),currentWarsDisplay:document.getElementById("current-wars-display"),btnUpdateWarStatus:document.getElementById("btn-update-war-status")};async function Ke(){try{const c=await p.collection("configuracoes").doc("campos").get(),e=c.exists?c.data():{};L=Object.assign({},Q,e),Object.keys(Q).forEach(t=>{L[t]?(!L[t].campos||L[t].campos.length===0)&&(L[t].campos=Q[t].campos):L[t]=Q[t]})}catch(c){console.warn("Falha ao carregar catálogo, usando local.",c),L=Q}}function he(){!y.menuSecoes||!L||(y.menuSecoes.innerHTML="",Object.keys(L).forEach(c=>{const e=L[c],t=document.createElement("button");t.type="button",t.className=`w-full text-left rounded-md px-2 py-1.5 text-sm ${P.secaoSelecionada===c?"bg-white/5 border border-slate-600/40":"border border-transparent hover:bg-white/5"}`,t.textContent=e.label||c,t.onclick=()=>{P.secaoSelecionada=c,he(),re()},y.menuSecoes.appendChild(t)}),y.selectSecao&&(y.selectSecao.innerHTML=Object.keys(L).map(c=>`<option value="${c}" ${c===P.secaoSelecionada?"selected":""}>${L[c].label||c}</option>`).join("")))}function et(){const c=[y.selectPais,y.exhaustionCountrySelect,y.warCountrySelect].filter(Boolean);if(c.length===0)return;const e=P.paises.map(t=>`<option value="${t.id}">${t.Pais||t.id}</option>`).join("");c.forEach(t=>{t.innerHTML=e,t.id==="select-pais"&&P.paisSelecionado&&(t.value=P.paisSelecionado)}),!P.paisSelecionado&&P.paises.length&&(P.paisSelecionado=P.paises[0].id)}function tt(c,e,t,a=null){const o=document.createElement("div"),n=document.createElement("label");n.className="block text-xs text-slate-400 mb-1",n.textContent=e.label||c;let r;if(e.tipo==="calculado"){if(r=document.createElement("div"),r.className="mt-1 w-full rounded-lg bg-slate-700/50 border border-slate-600 p-2 text-sm text-slate-300 italic",c==="PIB"&&a){const s=parseFloat(a.Populacao)||0,i=parseFloat(a.PIBPerCapita)||0,l=Z(s,i);r.textContent=`${me(l)} (calculado)`,r.dataset.calculatedValue=l}else r.textContent="Campo calculado";r.name=c}else e.tipo==="opcoes"&&Array.isArray(e.opcoes)?(r=document.createElement("select"),e.opcoes.forEach(s=>{const i=document.createElement("option");i.value=s,i.textContent=s,t===s&&(i.selected=!0),r.appendChild(i)}),r.name=c,r.className="mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors"):(r=document.createElement("input"),e.tipo==="percent"||e.tipo==="inteiro"||e.tipo==="moeda"?r.type="number":r.type="text",r.value=t??"",e.min!=null&&(r.min=String(e.min)),e.max!=null&&(r.max=String(e.max)),e.tipo==="moeda"?r.step="0.01":e.tipo==="percent"?r.step="0.1":e.tipo==="inteiro"&&(r.step="1"),r.name=c,r.className="mt-1 w-full rounded-lg bg-bg border border-bg-ring/70 p-2 text-sm focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/50 transition-colors");return o.appendChild(n),o.appendChild(r),{wrap:o,input:r,get:()=>e.tipo==="calculado"?Number(r.dataset.calculatedValue||0):e.tipo==="inteiro"||e.tipo==="percent"||e.tipo==="moeda"?Number(r.value||0):r.value??""}}function re(){if(!L||!y.formSecao)return;const c=P.paises.find(o=>o.id===P.paisSelecionado),e=L[P.secaoSelecionada],t=c&&c[P.secaoSelecionada]||{};y.formSecao.innerHTML="",y.listaCampos&&(y.listaCampos.innerHTML="");const a={};(e.campos||[]).forEach(o=>{const n=tt(o.key,o,t[o.key]??c?.[o.key],c);y.formSecao.appendChild(n.wrap),a[o.key]=n.get}),y.btnSalvarSecao&&(y.btnSalvarSecao.onclick=async()=>{if(c)try{y.btnSalvarSecao.disabled=!0,y.btnSalvarSecao.textContent="Salvando...";const o={};Object.keys(a).forEach(r=>o[r]=a[r]()),P.secaoSelecionada==="geral"&&o.PIBPerCapita&&o.Populacao&&(o.PIB=Z(o.Populacao,o.PIBPerCapita));const n={[`${P.secaoSelecionada}`]:o};P.secaoSelecionada==="geral"&&Object.assign(n,o),await p.collection("paises").doc(c.id).update(n),u("success","Seção salva com sucesso")}catch(o){m.error("Erro ao salvar seção:",o),u("error",`Erro ao salvar: ${o.message}`)}finally{y.btnSalvarSecao.disabled=!1,y.btnSalvarSecao.textContent="Salvar Seção"}})}async function at(c){if(!c){window.location.href="index.html";return}try{const e=await Ee(c.uid);if(!e.isNarrator&&!e.isAdmin){y.gate&&y.gate.classList.remove("hidden"),y.adminRoot?.classList.add("hidden");return}y.gate&&y.gate.classList.add("hidden"),y.adminRoot?.classList.remove("hidden"),await Ke(),await F()}catch(e){console.error("Erro no gatekeeper",e),y.gate&&y.gate.classList.remove("hidden"),y.adminRoot?.classList.add("hidden")}}async function F(){const c=await ye();c&&c.turnoAtual&&y.turnoAtual&&(y.turnoAtual.textContent=`#${c.turnoAtual}`),c&&c.turnoAtual&&y.turnoInput&&(y.turnoInput.value=c.turnoAtual),P.paises=await ue(),P.paises.sort((e,t)=>(e.Pais||"").localeCompare(t.Pais||"")),et(),he(),re()}A.onAuthStateChanged(at);y.selectPais&&y.selectPais.addEventListener("change",async c=>{P.paisSelecionado=c.target.value,re();try{await activateEnergyForSelectedCountry()}catch(e){m.warn("Erro ao ativar EnergyManager após mudança de país:",e)}});y.selectSecao&&y.selectSecao.addEventListener("change",c=>{P.secaoSelecionada=c.target.value,he(),re()});y.btnRecarregar&&y.btnRecarregar.addEventListener("click",F);y.btnSalvarTurno&&y.btnSalvarTurno.addEventListener("click",async()=>{const c=Number(y.turnoInput?.value||"");if(Number.isNaN(c)||c<0){alert("Informe um número de turno válido.");return}await Ce(c),alert(`Turno atualizado para #${c}`),await F()});y.logout&&y.logout.addEventListener("click",c=>{c.preventDefault(),A.signOut()});document.addEventListener("DOMContentLoaded",()=>{Ue();const c=document.getElementById("tab-mapa");c&&c.addEventListener("click",async()=>{oe||await dt()});const e=document.getElementById("tab-divisions-approval");let t=!1;e&&e.addEventListener("click",async()=>{t||(t=!0,A.currentUser&&await He())});const a=document.getElementById("btn-open-rules-editor"),o=document.getElementById("rules-editor-panel");a&&o&&a.addEventListener("click",()=>{o.classList.toggle("hidden")});const n=document.getElementById("btn-run-migration");n&&n.addEventListener("click",()=>{_e()});const r=document.getElementById("btn-process-energy");r&&r.addEventListener("click",async()=>{try{r.disabled=!0,r.textContent="⏳ Processando...";const{processEnergySystemTurn:g}=await T(async()=>{const{processEnergySystemTurn:f}=await import("./energyPenaltyProcessor-BBwDgQID.js");return{processEnergySystemTurn:f}},__vite__mapDeps([4,0,1,2,5]));await g(),alert("Turno de energia processado com sucesso!"),await F()}catch(g){console.error("Erro ao processar energia:",g),alert("Erro ao processar energia: "+g.message)}finally{r.disabled=!1,r.textContent="⚡ Processar Turno de Energia"}});const s=document.getElementById("btn-assign-resources");s&&s.addEventListener("click",async()=>{try{s.disabled=!0,s.textContent="⏳ Processando...";const{assignResourcePotentials:g}=await T(async()=>{const{assignResourcePotentials:f}=await import("./assign-resource-potentials-Dx9oOHcI.js");return{assignResourcePotentials:f}},__vite__mapDeps([6,0,1,2]));await g(),await F()}catch(g){console.error("Erro ao atribuir recursos:",g),alert("Erro ao atribuir recursos: "+g.message)}finally{s.disabled=!1,s.textContent="🌍 Atribuir Potenciais de Recursos"}});const i=document.getElementById("btn-resource-report");i&&i.addEventListener("click",async()=>{try{const{generateResourceReport:g}=await T(async()=>{const{generateResourceReport:f}=await import("./assign-resource-potentials-Dx9oOHcI.js");return{generateResourceReport:f}},__vite__mapDeps([6,0,1,2]));g(),alert("Relatório de recursos gerado no console (F12)")}catch(g){console.error("Erro ao gerar relatório:",g),alert("Erro ao gerar relatório: "+g.message)}});const l=document.getElementById("btn-apply-consumption");l&&l.addEventListener("click",async()=>{try{l.disabled=!0,l.textContent="⏳ Calculando...";const{applyResourceConsumption:g}=await T(async()=>{const{applyResourceConsumption:f}=await import("./apply-resource-consumption-CPH-AAzs.js");return{applyResourceConsumption:f}},__vite__mapDeps([7,0,1,2,8]));await g(),await F()}catch(g){console.error("Erro ao calcular consumo:",g),alert("Erro ao calcular consumo: "+g.message)}finally{l.disabled=!1,l.textContent="🍽️ Calcular Consumo de Recursos"}});const d=document.getElementById("btn-apply-consumption-all");d&&d.addEventListener("click",async()=>{try{if(!await D("Aplicar Consumo a Todos os Países","Esta ação irá calcular e definir o consumo mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, etc.). Esta operação pode ser executada múltiplas vezes. Continuar?","Sim, aplicar","Cancelar")){u("info","Operação cancelada pelo usuário.");return}d.disabled=!0,d.textContent="⏳ Aplicando a todos os países...";const{applyResourceConsumption:f}=await T(async()=>{const{applyResourceConsumption:$}=await import("./apply-resource-consumption-CPH-AAzs.js");return{applyResourceConsumption:$}},__vite__mapDeps([7,0,1,2,8]));await f(),u("success","🎉 Consumo aplicado a todos os países! Recarregue o dashboard para ver os novos valores."),await F()}catch(g){console.error("Erro ao aplicar consumo:",g),u("error","Erro ao aplicar consumo: "+g.message)}finally{d.disabled=!1,d.textContent="🚀 APLICAR CONSUMO A TODOS OS PAÍSES"}});const h=document.getElementById("btn-apply-production-all");h&&h.addEventListener("click",async()=>{try{if(!await D("Aplicar Produção a Todos os Países","Esta ação irá calcular e definir a produção mensal de recursos para TODOS os países baseado em suas características (população, PIB, tecnologia, geografia, clima). Esta operação pode ser executada múltiplas vezes. Continuar?","Sim, aplicar","Cancelar")){u("info","Operação cancelada pelo usuário.");return}h.disabled=!0,h.textContent="⏳ Aplicando produção a todos os países...";const{applyResourceProduction:f}=await T(async()=>{const{applyResourceProduction:$}=await import("./apply-resource-production-yIlvMaj0.js");return{applyResourceProduction:$}},__vite__mapDeps([9,0,1,2,10]));await f(),u("success","🎉 Produção aplicada a todos os países! Recarregue o dashboard para ver os novos valores."),await F()}catch(g){console.error("Erro ao aplicar produção:",g),u("error","Erro ao aplicar produção: "+g.message)}finally{h.disabled=!1,h.textContent="🏭 APLICAR PRODUÇÃO A TODOS OS PAÍSES"}});const v=document.getElementById("btn-simulate-production");v&&v.addEventListener("click",async()=>{try{v.disabled=!0,v.textContent="⏳ Simulando...";const{simulateProductionTurns:g}=await T(async()=>{const{simulateProductionTurns:f}=await import("./apply-resource-production-yIlvMaj0.js");return{simulateProductionTurns:f}},__vite__mapDeps([9,0,1,2,10]));await g(6),await F()}catch(g){console.error("Erro ao simular produção:",g),u("error","Erro na simulação: "+g.message)}finally{v.disabled=!1,v.textContent="📊 Simular Produção 6 Turnos"}});const w=document.getElementById("btn-apply-consumer-goods");w&&w.addEventListener("click",async()=>{try{if(!await D("Aplicar Bens de Consumo e Estabilidade","Esta ação irá calcular os bens de consumo para TODOS os países e aplicar os efeitos de estabilidade (+3% até -5%). Esta operação deve ser executada a cada turno. Continuar?","Sim, aplicar","Cancelar")){u("info","Operação cancelada pelo usuário.");return}w.disabled=!0,w.textContent="⏳ Aplicando bens de consumo...";const{applyConsumerGoodsEffects:f}=await T(async()=>{const{applyConsumerGoodsEffects:$}=await import("./apply-consumer-goods-C2AjmKuS.js");return{applyConsumerGoodsEffects:$}},__vite__mapDeps([11,0,1,2,12]));await f(),u("success","🎉 Bens de consumo e efeitos de estabilidade aplicados! Recarregue o dashboard."),await F()}catch(g){console.error("Erro ao aplicar bens de consumo:",g),u("error","Erro ao aplicar bens de consumo: "+g.message)}finally{w.disabled=!1,w.textContent="🛍️ APLICAR BENS DE CONSUMO E ESTABILIDADE"}});const C=document.getElementById("btn-simulate-consumer-goods");C&&C.addEventListener("click",async()=>{try{C.disabled=!0,C.textContent="⏳ Simulando...";const{simulateConsumerGoodsOverTime:g}=await T(async()=>{const{simulateConsumerGoodsOverTime:f}=await import("./apply-consumer-goods-C2AjmKuS.js");return{simulateConsumerGoodsOverTime:f}},__vite__mapDeps([11,0,1,2,12]));await g(5),await F()}catch(g){console.error("Erro ao simular bens de consumo:",g),u("error","Erro na simulação: "+g.message)}finally{C.disabled=!1,C.textContent="📈 Simular Estabilidade 5 Turnos"}});const S=document.getElementById("btn-test-turn-processing");S&&S.addEventListener("click",async()=>{try{S.disabled=!0,S.textContent="⏳ Testando...";const{default:g}=await T(async()=>{const{default:$}=await import("./turnProcessor-885tCVLN.js");return{default:$}},__vite__mapDeps([13,1,0,2,12,14,15,16,17])),f=await g.testTurnProcessing();u("success",`Teste concluído: ${f.length} países analisados. Veja o console (F12) para detalhes.`)}catch(g){console.error("Erro no teste:",g),u("error","Erro no teste: "+g.message)}finally{S.disabled=!1,S.textContent="🧪 Testar Processamento de Turno"}});const q=document.getElementById("btn-reprocess-turn");q&&q.addEventListener("click",async()=>{try{if(!await D("Reprocessar Turno Atual","Esta ação irá forçar o reprocessamento do turno atual, aplicando novamente todos os efeitos de bens de consumo e estabilidade. Use apenas se necessário. Continuar?","Sim, reprocessar","Cancelar")){u("info","Operação cancelada.");return}q.disabled=!0,q.textContent="⏳ Reprocessando...";const $=(await ye()).turnoAtual||1,{default:M}=await T(async()=>{const{default:I}=await import("./turnProcessor-885tCVLN.js");return{default:I}},__vite__mapDeps([13,1,0,2,12,14,15,16,17])),B=await M.reprocessTurn($);u("success",`Turno ${$} reprocessado: ${B.processedCount} países atualizados!`),await F()}catch(g){console.error("Erro no reprocessamento:",g),u("error","Erro no reprocessamento: "+g.message)}finally{q.disabled=!1,q.textContent="🔄 Reprocessar Turno Atual"}});const R=document.getElementById("btn-process-law-transitions");R&&R.addEventListener("click",async()=>{try{R.disabled=!0,R.textContent="🏛️ Processando Leis...",await gt()}catch(g){console.error("Erro ao acionar o processamento de leis:",g),u("error","Erro ao processar leis: "+g.message)}finally{R.disabled=!1,R.textContent="🏛️ Processar Transições de Leis"}});const V=document.getElementById("btn-apply-law-effects");V&&V.addEventListener("click",async()=>{try{V.disabled=!0,V.textContent="⚙️ Aplicando Efeitos...",await pt()}catch(g){console.error("Erro ao acionar a aplicação de efeitos:",g),u("error","Erro ao aplicar efeitos: "+g.message)}finally{V.disabled=!1,V.textContent="⚙️ Aplicar Efeitos das Leis"}});const N=document.getElementById("btn-process-exhaustion");N&&N.addEventListener("click",async()=>{try{N.disabled=!0,N.textContent="📉 Processando Exaustão...",await ht()}catch(g){console.error("Erro ao acionar o processamento de exaustão:",g),u("error","Erro ao processar exaustão: "+g.message)}finally{N.disabled=!1,N.textContent="📉 Processar Exaustão de Guerra"}});const O=document.getElementById("btn-simulate-consumption");O&&O.addEventListener("click",async()=>{try{O.disabled=!0,O.textContent="⏳ Simulando...";const{simulateConsumptionTurns:g}=await T(async()=>{const{simulateConsumptionTurns:f}=await import("./apply-resource-consumption-CPH-AAzs.js");return{simulateConsumptionTurns:f}},__vite__mapDeps([7,0,1,2,8]));await g(3),alert("Simulação concluída! Veja os resultados no console (F12)")}catch(g){console.error("Erro na simulação:",g),alert("Erro na simulação: "+g.message)}finally{O.disabled=!1,O.textContent="📊 Simular Consumo de Recursos"}}),y.btnApplyManualExhaustion&&y.btnApplyManualExhaustion.addEventListener("click",async()=>{const g=y.exhaustionCountrySelect.value,f=parseFloat(y.exhaustionValueInput.value),$=y.exhaustionReasonInput.value.trim();if(!g||isNaN(f)){u("error","Por favor, selecione um país e insira um valor numérico.");return}if($.length<5){u("error","Por favor, insira um motivo com pelo menos 5 caracteres.");return}const M=y.btnApplyManualExhaustion;try{M.disabled=!0,M.textContent="Aplicando...";const B=p.collection("paises").doc(g),I=await B.get();if(!I.exists)throw new Error("País não encontrado no banco de dados.");const b=I.data().warExhaustion||0,x=Math.max(0,Math.min(100,b+f)),k=p.batch();k.update(B,{warExhaustion:x});const E=p.collection("change_log").doc();k.set(E,{type:"MANUAL_EXHAUSTION_CHANGE",countryId:g,countryName:I.data().Pais||g,oldValue:b,newValue:x,changeValue:f,reason:$,narratorId:A.currentUser.uid,narratorName:A.currentUser.displayName||"Narrador",timestamp:new Date}),await k.commit(),u("success",`Exaustão de ${I.data().Pais} ajustada para ${x.toFixed(2)}%`),y.exhaustionValueInput.value="",y.exhaustionReasonInput.value=""}catch(B){console.error("Erro ao aplicar ajuste manual de exaustão:",B),u("error",`Erro: ${B.message}`)}finally{M.disabled=!1,M.textContent="Aplicar Ajuste de Exaustão"}}),y.warCountrySelect&&y.warCountrySelect.addEventListener("change",async()=>{const g=y.warCountrySelect.value;if(g)try{const f=await p.collection("paises").doc(g).get();if(!f.exists)return;const M=f.data().inWarWith||[];if(M.length>0){const I=await Promise.all(M.map(async b=>{const x=await p.collection("paises").doc(b).get();return x.exists?x.data().Pais:b}));y.currentWarsDisplay.textContent=`Em guerra com: ${I.join(", ")}`,y.currentWarsDisplay.className="text-sm text-red-400 mb-2"}else y.currentWarsDisplay.textContent="Este país está em paz",y.currentWarsDisplay.className="text-sm text-green-400 mb-2";const B=P.paises.filter(I=>I.id!==g);y.warTargetSelect.innerHTML=B.map(I=>{const b=M.includes(I.id);return`<option value="${I.id}" ${b?"selected":""}>${I.Pais||I.id}</option>`}).join("")}catch(f){console.error("Erro ao carregar estado de guerra:",f)}}),y.btnUpdateWarStatus&&y.btnUpdateWarStatus.addEventListener("click",async()=>{const g=y.warCountrySelect.value;if(!g){u("error","Selecione um país primeiro");return}try{y.btnUpdateWarStatus.disabled=!0,y.btnUpdateWarStatus.textContent="Atualizando...";const $=Array.from(y.warTargetSelect.selectedOptions).map(I=>I.value);await p.collection("paises").doc(g).update({inWarWith:$});const B=(await p.collection("paises").doc(g).get()).data().Pais||g;await p.collection("change_log").add({type:"WAR_STATUS_CHANGE",countryId:g,countryName:B,newWarStatus:$,narratorId:A.currentUser.uid,narratorName:A.currentUser.displayName||"Narrador",timestamp:new Date}),u("success",`Estado de guerra de ${B} atualizado!`),y.warCountrySelect.dispatchEvent(new Event("change"))}catch(f){console.error("Erro ao atualizar estado de guerra:",f),u("error",`Erro: ${f.message}`)}finally{y.btnUpdateWarStatus.disabled=!1,y.btnUpdateWarStatus.textContent="Atualizar Estado de Guerra"}})});let ce=null,le=null,de=null,fe=null,xe=null;async function ot(){try{ce=new Me,await ce.initialize(),m.info("Sistema de aprovação de veículos inicializado")}catch(c){m.error("Erro ao inicializar sistema de aprovação de veículos:",c)}}async function rt(){try{le=new Pe,await le.initialize(),m.info("Sistema de produção naval inicializado")}catch(c){m.error("Erro ao inicializar sistema de produção naval:",c)}}async function nt(){try{de=new Be,await de.initialize(),m.info("Sistema de inventário inicializado")}catch(c){m.error("Erro ao inicializar sistema de inventário:",c)}}async function st(){try{await new De().initialize(),m.info("Gerenciador de equipamentos genéricos inicializado")}catch(c){m.error("Erro ao inicializar gerenciador de equipamentos genéricos:",c)}}async function it(){try{fe=await ze(),m.info("Sistema econômico inicializado")}catch(c){m.error("Erro ao inicializar sistema econômico:",c)}}async function ct(){try{xe=await Fe(),m.info("Editor de País Avançado inicializado")}catch(c){m.error("Erro ao inicializar Editor de País Avançado:",c)}}async function lt(){try{H&&typeof H.loadPlayers=="function"?(await H.loadPlayers(),await H.loadCountries(),H.setupRealTimeListeners?.(),m.info("Player management inicializado")):m.warn("playerManager não disponível para inicialização")}catch(c){m.error("Erro ao inicializar player management:",c)}}let oe=null,ge=null;async function dt(){try{if(!document.getElementById("world-map")){m.warn("Container do mapa não encontrado");return}oe=new $e("world-map"),await oe.initialize(!0),ge=new Ge(oe),ge.render("map-controls-container");const e=document.getElementById("map-info-text");e&&(e.textContent="Mapa carregado com sucesso!"),m.info("Mapa mundial inicializado")}catch(c){m.error("Erro ao inicializar mapa mundial:",c);const e=document.getElementById("map-info-text");e&&(e.textContent="Erro ao carregar mapa: "+c.message)}}async function ve(){try{console.log("🔧 Inicializando sistemas do narrador..."),await Promise.all([lt(),ot(),rt(),nt(),st(),it(),ct()]),window.playerManager=H,window.vehicleApprovalSystem=ce,window.navalProductionSystem=le,window.inventorySystem=de,window.economicSimulator=fe,window.advancedCountryEditor=xe,window.narratorData={getCatalog:()=>L,getCountries:()=>P.paises},console.log("✅ Todos os sistemas do narrador inicializados")}catch(c){console.error("❌ Erro ao inicializar sistemas do narrador:",c)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ve):ve();async function ut(){console.log("🔧 Iniciando migração de Leis Nacionais..."),u("info","Iniciando migração...");try{const c={mobilizationLaw:"volunteer_only",economicLaw:"civilian_economy",warExhaustion:0,inWarWith:[],lawChange:null},e=await p.collection("paises").get();if(e.empty){u("warning","Nenhum país encontrado");return}let t=0;const a=[];if(e.forEach(n=>{const r=n.data(),s=[];r.mobilizationLaw===void 0&&s.push("mobilizationLaw"),r.economicLaw===void 0&&s.push("economicLaw"),r.warExhaustion===void 0&&s.push("warExhaustion"),r.inWarWith===void 0&&s.push("inWarWith"),r.lawChange===void 0&&s.push("lawChange"),s.length>0&&(t++,a.push({ref:n.ref,missingFields:s}))}),t===0){console.log("✅ Todos os países já estão atualizados"),u("success","Todos os países já possuem os campos necessários");return}console.log(`🚀 Migrando ${t} países...`);const o=p.batch();for(const n of a){const r={};n.missingFields.forEach(s=>{r[s]=c[s]}),o.update(n.ref,r)}await o.commit(),console.log(`✅ Migração concluída: ${t} países atualizados`),u("success",`Migração concluída! ${t} países atualizados`)}catch(c){console.error("❌ Erro na migração:",c),u("error",`Erro na migração: ${c.message}`)}}async function mt(){console.log("⚙️ Configurando leis nacionais no gameConfig..."),u("info","Configurando leis...");try{const c={mobilizationLaws:{disarmed_nation:{level:1,name:"Nação Desarmada",recruitablePopulation:.01,bonuses:{resourceProduction:.15,civilianFactoryEfficiency:.1},penalties:{militaryProductionSpeed:-.5}},volunteer_only:{level:2,name:"Apenas Voluntários",recruitablePopulation:.015,bonuses:{resourceProduction:.05},penalties:{militaryProductionSpeed:-.1}},limited_conscription:{level:3,name:"Conscrição Limitada",recruitablePopulation:.025,bonuses:{},penalties:{}},extensive_conscription:{level:4,name:"Conscrição Extensa",recruitablePopulation:.05,bonuses:{militaryProductionCost:-.05},penalties:{resourceProduction:-.07}},service_by_requirement:{level:5,name:"Serviço por Exigência",recruitablePopulation:.1,bonuses:{militaryProductionCost:-.1},penalties:{resourceProduction:-.14,civilianFactoryEfficiency:-.07}},all_adults_serve:{level:6,name:"Todos os Adultos Servem",recruitablePopulation:.2,bonuses:{militaryProductionCost:-.15},penalties:{resourceProduction:-.35,civilianFactoryEfficiency:-.2,warExhaustionPassiveGain:.1}}},economicLaws:{civilian_economy:{level:1,name:"Economia Civil",bonuses:{civilianFactoryEfficiency:.2},penalties:{militaryCapacity:-.3},consumptionModifiers:{metals:-.25,fuel:-.25,grain:.15}},early_mobilization:{level:2,name:"Mobilização Inicial",bonuses:{civilianFactoryEfficiency:.1},penalties:{militaryCapacity:-.15},consumptionModifiers:{metals:-.1,fuel:-.1,grain:.05}},partial_mobilization:{level:3,name:"Mobilização Parcial",bonuses:{},penalties:{},consumptionModifiers:{}},war_economy:{level:4,name:"Economia de Guerra",bonuses:{militaryCapacity:.2},penalties:{civilianFactoryEfficiency:-.2},consumptionModifiers:{metals:.2,fuel:.2,coal:.2,energy:.2}},total_mobilization:{level:5,name:"Mobilização Total",bonuses:{militaryCapacity:.4},penalties:{civilianFactoryEfficiency:-.4,recruitablePopulation:-.05,warExhaustionPassiveGain:.1},consumptionModifiers:{metals:.35,fuel:.35,coal:.35,energy:.35,grain:-.2}}}};await p.collection("gameConfig").doc("nationalLaws").set(c),console.log("✅ Configuração de leis criada/atualizada com sucesso"),u("success","Configuração de leis criada com sucesso no gameConfig!")}catch(c){console.error("❌ Erro ao configurar leis:",c),u("error",`Erro ao configurar leis: ${c.message}`)}}document.addEventListener("DOMContentLoaded",()=>{const c=document.getElementById("btn-migrate-national-laws"),e=document.getElementById("btn-setup-game-config");c&&c.addEventListener("click",async()=>{if(await D("Migrar Leis Nacionais","Esta ação adicionará os campos de leis nacionais em todos os países que ainda não os possuem. É seguro executar múltiplas vezes. Continuar?"))try{c.disabled=!0,c.textContent="⏳ Migrando...",await ut()}finally{c.disabled=!1,c.textContent="🔧 Migrar Leis Nacionais"}}),e&&e.addEventListener("click",async()=>{if(await D("Configurar Leis no GameConfig","Esta ação criará/atualizará a configuração de leis nacionais no Firestore. Continuar?"))try{e.disabled=!0,e.textContent="⏳ Configurando...",await mt()}finally{e.disabled=!1,e.textContent="⚙️ Configurar Leis no GameConfig"}})});async function pt(){console.log("Calculando e aplicando efeitos de leis nacionais..."),u("info","Calculando efeitos de leis para todos os países...");try{const c=await p.collection("gameConfig").doc("nationalLaws").get();if(!c.exists)throw new Error("Configuração de Leis Nacionais não encontrada.");const e=c.data(),t=await p.collection("paises").get();if(t.empty){u("warning","Nenhum país encontrado.");return}const a=p.batch();let o=0;t.forEach(n=>{const r=n.data(),s=n.ref,i=Ae(r,e);a.update(s,{currentModifiers:i}),o++}),o>0?(await a.commit(),console.log(`✅ Efeitos de leis aplicados a ${o} países.`),u("success",`Efeitos de leis aplicados a ${o} países.`)):u("info","Nenhum país precisou de atualização de efeitos.")}catch(c){console.error("Erro ao aplicar efeitos de leis:",c),u("error",`Erro no processo: ${c.message}`)}}async function ht(){console.log("Processando Exaustão de Guerra..."),u("info","Processando Exaustão de Guerra para todos os países...");try{const c=await p.collection("gameConfig").doc("nationalLaws").get();if(!c.exists)throw new Error("Configuração de Leis Nacionais não encontrada.");const e=c.data(),t=await p.collection("paises").get();if(t.empty){u("warning","Nenhum país encontrado.");return}const a=p.batch();let o=0;t.forEach(n=>{const r=n.data(),s=n.ref,i=e.mobilizationLaws[r.mobilizationLaw],l=e.economicLaws[r.economicLaw],d=r.warExhaustion||0;let h=d;if(r.inWarWith&&r.inWarWith.length>0){let v=0;i&&l&&(v=(i.level+l.level)*.05),i?.penalties?.warExhaustionPassiveGain&&(v+=i.penalties.warExhaustionPassiveGain),l?.penalties?.warExhaustionPassiveGain&&(v+=l.penalties.warExhaustionPassiveGain),h=Math.min(100,d+v)}else h=Math.max(0,d-2);h!==d&&(a.update(s,{warExhaustion:h}),o++)}),o>0?(await a.commit(),console.log(`✅ Exaustão de Guerra processada para ${o} países.`),u("success",`Exaustão de Guerra processada para ${o} países.`)):u("info","Nenhum país precisou de atualização de exaustão.")}catch(c){console.error("Erro ao processar Exaustão de Guerra:",c),u("error",`Erro no processo: ${c.message}`)}}async function gt(){console.log("Iniciando o processamento da transição de leis..."),u("info","Processando transições de leis para todos os países...");try{const c=await p.collection("paises").get();if(c.empty){console.log("Nenhum país para processar."),u("warning","Nenhum país encontrado.");return}const e=p.batch();let t=0;c.forEach(a=>{const o=a.data(),n=a.ref,r=o.Pais||o.Nome||a.id;if(o.lawChange&&o.lawChange.totalTurns>0){const s=o.lawChange.progress+1;let i={};s>=o.lawChange.totalTurns?(console.log(`-> Transição para '${o.lawChange.targetLaw}' concluída em ${r}.`),i.lawChange=null,o.lawChange.type==="mobilization"?i.mobilizationLaw=o.lawChange.targetLaw:o.lawChange.type==="economic"&&(i.economicLaw=o.lawChange.targetLaw)):i["lawChange.progress"]=s,e.update(n,i),t++}}),t>0?(await e.commit(),console.log(`✅ Transição de leis processada para ${t} países.`),u("success",`Transição de leis processada para ${t} países.`)):(console.log("Nenhuma transição de lei ativa para processar."),u("info","Nenhuma transição de lei ativa encontrada."))}catch(c){console.error("Erro ao processar transição de leis:",c),u("error",`Erro no processo: ${c.message}`)}}
