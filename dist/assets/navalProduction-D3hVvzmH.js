import{_ as g}from"./preload-helper-f85Crcwt.js";import{auth as E,db as l}from"./firebase-ep1w8F7T.js";import{s as b}from"./utils-DLoRv3re.js";import{S as P}from"./shipyardSystem-CBTksbsh.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";async function L(){if(!window.NAVAL_COMPONENTS)try{const h=await g(()=>import("./hulls-CFhq2zY8.js"),[]),e=await g(()=>import("./naval_guns-RPDYGynX.js"),[]),t=await g(()=>import("./naval_missiles-1gme3iwB.js"),[]),o=await g(()=>import("./secondary_weapons-B2--kRuu.js"),[]),r=await g(()=>import("./propulsion-Ds8gNL2e.js"),[]),a=await g(()=>import("./electronics-CC3zpcSk.js"),[]),s=await g(()=>import("./armor-DmFYxSll.js"),[]);window.NAVAL_COMPONENTS={hulls:h.hulls||h.default,naval_guns:e.naval_guns||e.default,naval_missiles:t.naval_missiles||t.default,secondary_weapons:o.secondary_weapons||o.default,propulsion:r.propulsion||r.default,electronics:a.electronics||a.default,armor:s.armor||s.default},console.log("📦 Componentes navais carregados para sistema de produção")}catch(h){console.error("❌ Erro ao carregar componentes navais:",h)}}class H{constructor(){this.pendingOrders=[],this.approvedOrders=[],this.completedOrders=[],this.inProductionOrders=[],this.currentFilter="pending",this.currentSort="newest",this.shipyardSystem=new P}async initialize(){try{console.log("🚢 Inicializando sistema de produção naval..."),await L(),await this.loadPendingOrders(),await this.loadApprovedOrders(),await this.loadInProductionOrders(),this.setupEventListeners(),this.render(),console.log("✅ Sistema de produção naval inicializado")}catch(e){console.error("❌ Erro ao inicializar sistema de produção naval:",e)}}setupEventListeners(){document.addEventListener("click",e=>{if(e.target.matches("[data-approve-production]")){const t=e.target.dataset.approveProduction;this.showApprovalModal(t)}if(e.target.matches("[data-reject-production]")){const t=e.target.dataset.rejectProduction;this.rejectOrder(t)}if(e.target.matches("[data-filter-production]")){const t=e.target.dataset.filterProduction;this.currentFilter=t,this.render()}if(e.target.matches("[data-sort-production]")){const t=e.target.dataset.sortProduction;this.currentSort=t,this.render()}if(e.target.matches("[data-view-naval-sheet]")){const t=e.target.dataset.viewNavalSheet;this.viewNavalSheet(t)}}),setInterval(()=>{this.refreshData()},3e4)}async loadPendingOrders(){try{const e=await l.collection("naval_orders_pending").orderBy("submissionDate","desc").get();this.pendingOrders=e.docs.map(t=>({id:t.id,...t.data(),submissionDate:t.data().submissionDate?.toDate()||new Date})),console.log(`📋 ${this.pendingOrders.length} ordens pendentes carregadas`)}catch(e){console.error("❌ Erro ao carregar ordens pendentes:",e),this.pendingOrders=[]}}async loadApprovedOrders(){try{console.log("🔄 Carregando ordens navais aprovadas (nova estrutura)...");const e=await l.collection("naval_orders_approved").get();this.approvedOrders=[];for(const t of e.docs){const o=t.id;console.log(`📁 Processando país naval: ${o}`),(await l.collection("naval_orders_approved").doc(o).collection("ships").orderBy("approvalDate","desc").limit(20).get()).docs.forEach(a=>{this.approvedOrders.push({id:a.id,...a.data(),approvalDate:a.data().approvalDate?.toDate()||new Date})})}this.approvedOrders.sort((t,o)=>(o.approvalDate||0)-(t.approvalDate||0)),this.approvedOrders=this.approvedOrders.slice(0,50),console.log(`✅ ${this.approvedOrders.length} ordens aprovadas carregadas`)}catch(e){console.error("❌ Erro ao carregar ordens aprovadas:",e),this.approvedOrders=[]}}async loadInProductionOrders(){try{const e=await l.collection("naval_orders_production").orderBy("productionStartDate","desc").get();this.inProductionOrders=e.docs.map(t=>{const o=t.data();return{id:t.id,...o,productionStartDate:o.productionStartDate?.toDate()||new Date,estimatedCompletion:o.estimatedCompletion?.toDate()||new Date}}),console.log(`🏭 ${this.inProductionOrders.length} ordens em produção carregadas`)}catch(e){console.error("❌ Erro ao carregar ordens em produção:",e),this.inProductionOrders=[]}}async refreshData(){await Promise.all([this.loadPendingOrders(),this.loadApprovedOrders(),this.loadInProductionOrders()]),this.render()}render(){console.log("🎨 Tentando renderizar sistema de produção naval...");const e=document.getElementById("naval-production-anchor");if(!e){console.error("❌ Âncora naval-production-anchor não encontrada no DOM"),console.log("🔍 Elementos disponíveis com ID:",Array.from(document.querySelectorAll("[id]")).map(r=>r.id)),setTimeout(()=>{console.log("🔄 Tentando novamente após delay..."),this.render()},1e3);return}console.log("✅ Âncora encontrada, renderizando interface..."),console.log("📊 Dados: pendentes="+this.pendingOrders.length+", aprovadas="+this.approvedOrders.length+", produção="+this.inProductionOrders.length);const t=document.getElementById("naval-production-system");t&&t.remove();const o=`
            <div id="naval-production-system" class="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl font-bold text-slate-100 flex items-center space-x-2">
                            <span>🏭</span>
                            <span>Sistema de Produção Naval</span>
                        </h2>
                        <p class="text-xs text-slate-400 mt-1">Gerenciar pedidos de construção naval e cronograma de produção</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                    <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-amber-300">${this.pendingOrders.length}</div>
                        <div class="text-xs text-amber-200">Aguardando Aprovação</div>
                    </div>
                    <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-blue-300">${this.approvedOrders.length}</div>
                        <div class="text-xs text-blue-200">Aprovados</div>
                    </div>
                    <div class="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-orange-300">${this.inProductionOrders.length}</div>
                        <div class="text-xs text-orange-200">Em Produção</div>
                    </div>
                    <div class="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-green-300">${this.completedOrders.length}</div>
                        <div class="text-xs text-green-200">Concluídos</div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 mb-4">
                    <button data-filter-production="pending" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter==="pending"?"bg-amber-500 text-slate-900 font-semibold":"border border-amber-500/30 text-amber-200 hover:bg-amber-500/10"}">
                        Pendentes (${this.pendingOrders.length})
                    </button>
                    <button data-filter-production="approved" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter==="approved"?"bg-blue-500 text-slate-900 font-semibold":"border border-blue-500/30 text-blue-200 hover:bg-blue-500/10"}">
                        Aprovados (${this.approvedOrders.length})
                    </button>
                    <button data-filter-production="production" class="px-3 py-1.5 text-sm rounded-lg transition-colors ${this.currentFilter==="production"?"bg-orange-500 text-slate-900 font-semibold":"border border-orange-500/30 text-orange-200 hover:bg-orange-500/10"}">
                        Em Produção (${this.inProductionOrders.length})
                    </button>
                </div>

                <div id="orders-list" class="space-y-3">
                    ${this.renderOrdersList()}
                </div>
            </div>
        `;e.insertAdjacentHTML("afterend",o)}renderOrdersList(){let e=[];switch(this.currentFilter){case"pending":e=[...this.pendingOrders];break;case"approved":e=[...this.approvedOrders];break;case"production":e=[...this.inProductionOrders];break;default:e=[...this.pendingOrders]}return e.length===0?'<div class="text-center py-8 text-slate-400">Nenhuma ordem encontrada</div>':(this.currentSort==="newest"?e.sort((t,o)=>(o.submissionDate||o.approvalDate||o.productionStartDate)-(t.submissionDate||t.approvalDate||t.productionStartDate)):this.currentSort==="oldest"&&e.sort((t,o)=>(t.submissionDate||t.approvalDate||t.productionStartDate)-(o.submissionDate||o.approvalDate||o.productionStartDate)),e.map(t=>this.renderOrderCard(t)).join(""))}renderOrderCard(e){const t={pending:"border-amber-500/30 bg-amber-500/5",approved:"border-blue-500/30 bg-blue-500/5",production:"border-orange-500/30 bg-orange-500/5",completed:"border-green-500/30 bg-green-500/5"},r=window.NAVAL_COMPONENTS?.hulls[e.design.hull]?.name||"Navio Desconhecido";let a="";(e.status==="production"||e.status==="approved")&&(a=this.renderProductionTimeline(e));const s=this.renderActionButtons(e);return`
            <div class="border rounded-lg p-4 ${t[e.status]||t.pending}">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <h3 class="text-sm font-semibold text-slate-100">${e.design.name||r}</h3>
                            <span class="px-2 py-1 text-xs rounded-full ${this.getStatusBadge(e.status)}">${this.getStatusLabel(e.status)}</span>
                        </div>
                        <div class="text-xs text-slate-400 space-y-1">
                            {/* TODO: UI for Production Line Bonus can be added here, using order.initialLineBonus */}
                            <div>👤 <strong>Jogador:</strong> ${e.userName||"Desconhecido"}</div>
                            <div>🏠 <strong>País:</strong> ${e.countryName||"Desconhecido"}</div>
                            <div>🚢 <strong>Tipo:</strong> ${r}</div>
                            <div>📦 <strong>Quantidade:</strong> ${e.quantity}x</div>
                            <div>💰 <strong>Custo unitário:</strong> $${Math.round((e.totalCost||0)/(e.quantity||1)).toLocaleString()}</div>
                            <div>💰 <strong>Custo total:</strong> $${(e.totalCost||0).toLocaleString()}</div>
                            ${e.submissionDate?`<div>📅 <strong>Solicitado:</strong> ${e.submissionDate.toLocaleDateString("pt-BR")} às ${e.submissionDate.toLocaleTimeString("pt-BR")}</div>`:""}
                        </div>
                    </div>
                    
                    <div class="flex flex-col gap-2 min-w-32">
                        ${e.sheetImageUrl||e.sheetHtmlUrl?`
                            <button data-view-naval-sheet="${e.id}" class="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                                🖼️ Ver Ficha
                            </button>
                        `:""}
                        
                        ${this.currentFilter==="pending"?s:""}
                    </div>
                </div>

                ${a}
            </div>
        `}renderProductionTimeline(e){if(!e.productionSchedule)return"";const t=e.productionSchedule,o=window.gameConfig?.currentTurn||1;let r='<div class="mt-3 p-3 bg-slate-900/50 rounded-lg"><h4 class="text-sm font-semibold text-slate-200 mb-2">📅 Cronograma de Produção</h4><div class="space-y-2 text-xs">';return t.batches.forEach((a,s)=>{const n=o>a.completionTurn,c=o===a.completionTurn;o<a.completionTurn;let p="⏳",d="text-slate-400";n?(p="✅",d="text-green-300"):c&&(p="🔄",d="text-orange-300"),r+=`
                <div class="flex justify-between items-center ${d}">
                    <span>${p} Lote ${s+1}: ${a.quantity}x ${e.design.name}</span>
                    <span>Turno ${a.completionTurn}</span>
                </div>
            `}),r+="</div></div>",r}renderActionButtons(e){return e.status==="pending"?`
                <div class="flex gap-2 mt-3">
                    <button data-approve-production="${e.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition-colors">
                        ✅ Aprovar
                    </button>
                    <button data-reject-production="${e.id}" class="flex-1 px-3 py-1.5 text-xs rounded-lg bg-red-500 text-slate-900 font-semibold hover:bg-red-400 transition-colors">
                        ❌ Rejeitar
                    </button>
                </div>
            `:""}getStatusBadge(e){const t={pending:"bg-amber-500/20 text-amber-200",approved:"bg-blue-500/20 text-blue-200",production:"bg-orange-500/20 text-orange-200",completed:"bg-green-500/20 text-green-200"};return t[e]||t.pending}getStatusLabel(e){return{pending:"Pendente",approved:"Aprovado",production:"Em Produção",completed:"Concluído"}[e]||"Desconhecido"}async showApprovalModal(e){try{const t=this.pendingOrders.find(i=>i.id===e);if(!t)throw new Error("Ordem não encontrada");const o=window.NAVAL_COMPONENTS?.hulls[t.design.hull];if(!o)throw new Error("Dados do casco não encontrados para este tipo de navio");let r=o.production;if(!r){console.warn(`⚠️ Dados de produção não encontrados para ${o.name}, usando dados padrão`);const i=o.displacement||2e3;r={build_time_months:Math.max(6,Math.ceil(i/300)),workers_required:Math.max(800,Math.ceil(i*.8)),materials_steel_tons:Math.ceil(i*.7),materials_specialty_tons:Math.ceil(i*.05),shipyard_type:i>5e3?"heavy":i>2e3?"medium":"light",max_parallel:Math.max(1,Math.ceil(12/Math.sqrt(i/1e3))),complexity_rating:Math.min(10,Math.max(1,Math.ceil(i/1e3)))}}const a=document.createElement("div");a.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="production-approval-modal";const s=t.quantity,n=r.build_time_months,c=Math.ceil(n/3);a.innerHTML=`
                <style>
                    #production-quantity-slider {
                        background: linear-gradient(to right, #10b981 0%, #10b981 100%, #334155 100%, #334155 100%);
                        border-radius: 5px;
                        height: 10px;
                        outline: none;
                        appearance: none;
                    }
                    
                    #production-quantity-slider::-webkit-slider-track {
                        background: transparent;
                    }
                    
                    #production-quantity-slider::-webkit-slider-thumb {
                        appearance: none;
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #064e3b;
                        box-shadow: 0 0 0 1px #10b981;
                    }
                    
                    #production-quantity-slider::-webkit-slider-thumb:hover {
                        background: #059669;
                        box-shadow: 0 0 0 2px #10b981;
                    }
                    
                    #production-quantity-slider::-moz-range-track {
                        background: linear-gradient(to right, #10b981 0%, #10b981 100%, #334155 100%, #334155 100%);
                        height: 10px;
                        border-radius: 5px;
                        border: none;
                    }
                    
                    #production-quantity-slider::-moz-range-thumb {
                        height: 20px;
                        width: 20px;
                        border-radius: 50%;
                        background: #10b981;
                        cursor: pointer;
                        border: 2px solid #064e3b;
                    }
                </style>
                
                <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-lg w-full p-6">
                    <h3 class="text-lg font-semibold text-emerald-200 mb-4">✅ Aprovar Ordem de Produção</h3>
                    
                    <div class="space-y-4 mb-6">
                        <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                            <h4 class="font-semibold text-slate-200 mb-2">${t.design.name}</h4>
                            <div class="text-sm text-slate-400 space-y-1">
                                <div><span class="text-slate-300">Tipo:</span> ${o.name}</div>
                                <div><span class="text-slate-300">País:</span> ${t.countryName}</div>
                                <div><span class="text-slate-300">Solicitado:</span> ${s}x</div>
                                <div><span class="text-slate-300">Tempo:</span> ${n} meses por unidade</div>
                                <div><span class="text-slate-300">Custo unitário:</span> <span class="text-green-300">$${(t.totalCost/s).toLocaleString()}</span></div>
                            </div>
                        </div>

                        <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                            <label class="block text-sm font-semibold text-emerald-200 mb-3">
                                🎲 Quantidade a Aprovar (com base no resultado do dado):
                            </label>
                            <div class="space-y-3">
                                <input type="range" 
                                       id="production-quantity-slider" 
                                       min="1" 
                                       max="${s}" 
                                       value="${s}"
                                       class="w-full h-2 cursor-pointer">
                                <div class="flex justify-between text-xs text-slate-400">
                                    <span>1</span>
                                    <span id="production-current-quantity" class="text-emerald-300 font-semibold text-lg">${s}</span>
                                    <span>${s}</span>
                                </div>
                                <div class="text-center text-sm text-slate-300 bg-slate-800/50 rounded-lg p-2">
                                    <span class="font-semibold">Custo total aprovado: $<span id="production-total-cost" class="text-emerald-300">${t.totalCost.toLocaleString()}</span></span>
                                </div>
                            </div>
                        </div>

                        <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                            <label class="block text-sm font-semibold text-blue-200 mb-2">📅 Cronograma de Produção:</label>
                            <div class="bg-slate-900/50 rounded-lg p-3 text-xs" id="production-timeline">
                                <!-- Timeline will be generated here -->
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button id="confirm-production-approval" class="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
                            ✅ Aprovar Produção
                        </button>
                        <button id="cancel-production-approval" class="flex-1 px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                            ❌ Cancelar
                        </button>
                    </div>
                </div>
            `,document.body.appendChild(a);const p=a.querySelector("#production-quantity-slider"),d=a.querySelector("#production-current-quantity"),x=a.querySelector("#production-total-cost"),w=a.querySelector("#production-timeline"),f=t.totalCost/s,v=async i=>{const m=await l.collection("paises").doc(t.paisId).get(),O=(((m.exists()?m.data():{}).productionLines||{naval:{}}).naval||{})[t.design.name];let y=O?O.efficiency||0:-.1;const _=await this.calculateProductionSchedule(r,i,t.paisId,{initialBonus:y,bonusPerShip:.05,maxBonus:.4});w.innerHTML=this.renderSchedulePreview(_,t.design.name)};p.addEventListener("input",i=>{const u=parseInt(i.target.value);d.textContent=u,x.textContent=(f*u).toLocaleString(),v(u);const m=(u-1)/(s-1)*100;p.style.background=`linear-gradient(to right, #10b981 0%, #10b981 ${m}%, #334155 ${m}%, #334155 100%)`}),v(s),a.querySelector("#confirm-production-approval").addEventListener("click",()=>{const i=parseInt(p.value);a.remove(),this.approveOrder(e,i)}),a.querySelector("#cancel-production-approval").addEventListener("click",()=>{a.remove()}),a.addEventListener("click",i=>{i.target===a&&a.remove()})}catch(t){console.error("❌ Erro ao mostrar modal de aprovação:",t),b("error","Erro ao abrir modal: "+t.message)}}async calculateProductionSchedule(e,t,o,r){const{initialBonus:a,bonusPerShip:s,maxBonus:n}=r;let c=e.production||e;const p=await this.shipyardSystem.getCurrentShipyardLevel(o),d=this.shipyardSystem.calculateProductionBonus(p),x=Math.ceil((c.max_parallel||1)*d.parallelMultiplier),w=window.gameConfig?.currentTurn||1,f=Array(x).fill(w),v=[];let i=0;for(;i<t;){const u=Math.min(...f),m=f.indexOf(u),S=Math.min(n,a+i*s),$=this.shipyardSystem.applyShipyardBonusToProduction(c,p,S),O=Math.ceil($.build_time_months/3),y=u+O;f[m]=y;let _=v.find(T=>T.completionTurn===y);_?_.quantity++:v.push({quantity:1,startTurn:u,completionTurn:y,buildTimeMonths:$.build_time_months,appliedBonus:S}),i++}return v.sort((u,m)=>u.completionTurn-m.completionTurn),{totalQuantity:t,estimatedTurns:Math.max(...v.map(u=>u.completionTurn))-w,batches:v}}renderSchedulePreview(e,t){let o='<div class="text-slate-300 font-medium mb-2">Cronograma previsto:</div>';return e.batches.forEach((r,a)=>{o+=`
                <div class="flex justify-between py-1">
                    <span>Lote ${a+1}: ${r.quantity}x ${t}</span>
                    <span class="text-orange-300">Turno ${r.completionTurn}</span>
                </div>
            `}),o+=`<div class="border-t border-slate-600 mt-2 pt-2 font-medium">Total: ${e.totalQuantity} navios em ${e.estimatedTurns} turnos</div>`,o}async approveOrder(e,t){try{console.log(`✅ Aprovando ordem ${e} com ${t} unidades...`);const o=await l.collection("naval_orders_pending").doc(e).get();if(!o.exists)throw new Error("Ordem não encontrada");const r=o.data(),a=window.NAVAL_COMPONENTS?.hulls[r.design.hull],s=await this.calculateProductionSchedule(a,t,r.paisId);await l.collection("naval_orders_approved").doc(r.paisId).collection("ships").doc(e).set({...r,approvedQuantity:t,originalQuantity:r.quantity,approvalDate:new Date,status:"approved",productionSchedule:s}),await l.collection("naval_orders_production").doc(e).set({...r,approvedQuantity:t,approvalDate:new Date,productionStartDate:new Date,status:"production",productionSchedule:s}),await this.addNavalToInventory({...r,quantity:t}),await l.collection("naval_orders_pending").doc(e).delete(),await this.refreshData(),b("success",`Ordem aprovada! Produção de ${t} navios iniciada.`),console.log(`✅ Ordem ${e} aprovada e iniciada produção`)}catch(o){console.error("❌ Erro ao aprovar ordem:",o),b("error","Erro ao aprovar ordem: "+o.message)}}async rejectOrder(e){try{const t=prompt("Motivo da rejeição (opcional):");console.log(`❌ Rejeitando ordem ${e}...`);const o=await l.collection("naval_orders_pending").doc(e).get();if(!o.exists)throw new Error("Ordem não encontrada");const r=o.data();await this.deleteNavalOrderFiles(r),console.log("🗑️ Ordem naval rejeitada e arquivos deletados:",{orderId:e,designName:r.design?.name,countryName:r.countryName,rejectionReason:t||"Sem motivo especificado",rejectionDate:new Date().toISOString()}),await l.collection("naval_orders_pending").doc(e).delete(),await this.refreshData(),b("success","Ordem rejeitada e arquivos removidos para economizar espaço."),console.log(`✅ Ordem ${e} rejeitada e limpa do sistema`)}catch(t){console.error("❌ Erro ao rejeitar ordem:",t),b("error","Erro ao rejeitar ordem: "+t.message)}}async deleteNavalOrderFiles(e){try{if(console.log("🗑️ Iniciando limpeza de arquivos da ordem naval rejeitada..."),!window.firebase?.storage){console.warn("⚠️ Firebase Storage não disponível, pulando limpeza de arquivos");return}const t=window.firebase.storage(),o=[];e.sheetImageUrl&&o.push({url:e.sheetImageUrl,type:"PNG"}),e.sheetHtmlUrl&&o.push({url:e.sheetHtmlUrl,type:"HTML"});for(const r of o)try{await t.refFromURL(r.url).delete(),console.log(`✅ Arquivo ${r.type} deletado:`,r.url)}catch(a){console.warn(`⚠️ Erro ao deletar arquivo ${r.type}:`,a)}console.log(`✅ Limpeza de arquivos concluída. ${o.length} arquivos processados.`)}catch(t){console.error("❌ Erro geral na limpeza de arquivos:",t)}}async viewNavalSheet(e){try{const o=[...this.pendingOrders,...this.approvedOrders,...this.inProductionOrders].find(a=>a.id===e);if(!o){alert("Ordem não encontrada");return}console.log("🔍 Campos da ordem naval:",Object.keys(o)),console.log("🔍 sheetImageUrl:",o.sheetImageUrl),console.log("🔍 sheetHtmlUrl:",o.sheetHtmlUrl);let r=null;if(o.sheetImageUrl&&o.sheetImageUrl.startsWith("http")?(r=o.sheetImageUrl,console.log("✅ Usando sheetImageUrl (PNG):",r)):o.sheetHtmlUrl&&o.sheetHtmlUrl.startsWith("http")?(r=o.sheetHtmlUrl,console.log("✅ Usando sheetHtmlUrl (HTML):",r)):console.error("❌ Nenhuma URL de ficha naval encontrada"),!r){alert("Ficha do navio não encontrada");return}console.log("🖼️ Abrindo ficha naval em modal para ordem:",e),this.showNavalSheetModal(o,r)}catch(t){console.error("❌ Erro ao visualizar ficha naval:",t),alert("Erro ao abrir ficha: "+t.message)}}showNavalSheetModal(e,t){const o=document.getElementById("naval-sheet-modal");o&&o.remove();const r=document.createElement("div");r.id="naval-sheet-modal",r.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",r.style.zIndex="9999";const a=document.createElement("div");a.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col";const s=document.createElement("div");s.className="flex items-center justify-between p-4 border-b border-bg-ring/50",s.innerHTML=`
            <div>
                <h3 class="text-lg font-semibold text-slate-200">⚓ Ficha Técnica Naval</h3>
                <p class="text-sm text-slate-400">${e.design?.name||"Navio"} - ${e.countryName}</p>
            </div>
            <div class="flex items-center gap-2">
                <button id="open-naval-sheet-new-tab" class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
                    🔗 Nova Aba
                </button>
                <button id="close-naval-modal" class="text-slate-400 hover:text-slate-200 p-1">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        `;const n=document.createElement("div");if(n.className="flex-1 overflow-auto p-4",t.includes(".png")||t.includes(".jpg")||t.includes(".jpeg"))n.innerHTML=`
                <div class="text-center">
                    <img src="${t}" alt="Ficha do Navio" class="max-w-full max-h-full mx-auto rounded-lg shadow-lg" 
                         style="max-height: 70vh;" onload="this.style.opacity=1" style="opacity:0; transition: opacity 0.3s;"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display: none;" class="text-red-400">Erro ao carregar imagem da ficha naval</div>
                </div>
            `;else if(t.includes(".html")){const d=document.createElement("iframe");d.src=t,d.style.cssText="width: 100%; height: 70vh; border: none; border-radius: 8px;",d.onload=()=>{console.log("✅ Ficha naval HTML carregada no iframe")},d.onerror=()=>{console.error("❌ Erro ao carregar ficha naval HTML no iframe"),n.innerHTML='<p class="text-red-400">Erro ao carregar ficha naval</p>'},n.innerHTML="",n.appendChild(d)}else n.innerHTML='<p class="text-red-400">Formato de ficha naval não suportado</p>';a.appendChild(s),a.appendChild(n),r.appendChild(a);const c=()=>{r.remove()},p=()=>{window.open(t,"_blank","width=1200,height=800,scrollbars=yes,resizable=yes")};r.addEventListener("click",d=>{d.target===r&&c()}),s.querySelector("#close-naval-modal").addEventListener("click",c),s.querySelector("#open-naval-sheet-new-tab").addEventListener("click",p),document.addEventListener("keydown",function d(x){x.key==="Escape"&&(c(),document.removeEventListener("keydown",d))}),document.body.appendChild(r),r.focus()}async addNavalToInventory(e){try{const t=l.collection("inventory").doc(e.paisId),o=await t.get();let r={};o.exists&&(r=o.data());const a=window.NAVAL_COMPONENTS?.hulls[e.design.hull],s=this.getNavalCategory(a);r[s]||(r[s]={});const n=e.design.name||a?.name||"Navio Desconhecido";if(!r[s][n]){const c={quantity:0,specs:{hull:a?.name||"Desconhecido",displacement:a?.displacement||0,max_speed:a?.max_speed||0,crew:a?.crew||0,range:a?.range||0,main_guns:e.design.main_guns?.length||0,missiles:e.design.missiles?.length||0,aa_guns:e.design.aa_guns?.length||0},cost:e.totalCost/e.quantity,approvedDate:new Date().toISOString(),approvedBy:"narrator"};e.sheetImageUrl&&(c.sheetImageUrl=e.sheetImageUrl),e.sheetHtmlUrl&&(c.sheetHtmlUrl=e.sheetHtmlUrl),r[s][n]=c}r[s][n].quantity+=e.quantity||1,await t.set(r,{merge:!0}),console.log(`🚢 ${e.quantity||1}x ${n} adicionado ao inventário naval de ${e.countryName}`)}catch(t){console.error("❌ Erro ao adicionar navio ao inventário:",t)}}getNavalCategory(e){if(!e)return"Naval - Outros";const t=e.role?.toLowerCase()||e.type?.toLowerCase()||"";return t.includes("destroyer")?"Destróieres":t.includes("cruiser")?"Cruzadores":t.includes("battleship")||t.includes("dreadnought")?"Couraçados":t.includes("carrier")||t.includes("cv")?"Porta-aviões":t.includes("submarine")||t.includes("sub")?"Submarinos":t.includes("frigate")?"Fragatas":t.includes("corvette")?"Corvetas":t.includes("patrol")?"Patrulhas":t.includes("transport")||t.includes("auxiliary")?"Auxiliares":"Naval - Outros"}}async function U(h){try{if(!E.currentUser)throw new Error("Usuário não autenticado");const e=E.currentUser,t=await l.collection("usuarios").doc(e.uid).get();if(!t.exists||!t.data().paisId)throw new Error("País não vinculado ao usuário");const o=t.data().paisId,r=await l.collection("paises").doc(o).get(),a=r.exists?r.data():{},s={...h,userId:e.uid,userName:e.displayName||e.email,paisId:o,countryName:a.Pais||"Desconhecido",submissionDate:new Date,status:"pending"},n=await l.collection("naval_orders_pending").add(s);return console.log("✅ Ordem de produção naval submetida:",n.id),b("success",`Ordem de produção submetida para aprovação! ID: ${n.id.substring(0,8)}`),{success:!0,id:n.id}}catch(e){return console.error("❌ Erro ao submeter ordem:",e),b("error","Erro ao submeter ordem: "+e.message),{success:!1,error:e.message}}}export{H as NavalProductionSystem,U as submitNavalOrderForApproval};
