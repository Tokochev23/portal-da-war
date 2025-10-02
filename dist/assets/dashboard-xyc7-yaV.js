const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-DhEDpEFS.js","assets/preload-helper-f85Crcwt.js"])))=>i.map(i=>d[i]);
import{_ as N}from"./preload-helper-f85Crcwt.js";/* empty css             */import{c as $,j as E,k as M,h as Q}from"./firebase-DhEDpEFS.js";import{S as O}from"./shipyardSystem-Df_luGD_.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";function g(e){if(!e)return"US$ 0";const s=parseFloat(e);return s>=1e9?"US$ "+(s/1e9).toFixed(1)+"B":s>=1e6?"US$ "+(s/1e6).toFixed(1)+"M":s>=1e3?"US$ "+(s/1e3).toFixed(1)+"K":"US$ "+s.toLocaleString()}function b(e){const s=parseFloat(e)||0;return s===0?"US$ 0":s>=1e9?`US$ ${(s/1e9).toFixed(1)}bi`:s>=1e6?`US$ ${(s/1e6).toFixed(1)}mi`:s>=1e3?`US$ ${(s/1e3).toFixed(1)}mil`:`US$ ${Math.round(s)}`}function B(e){const s=parseFloat(e.PIB)||0,a=(parseFloat(e.Burocracia)||0)/100,n=(parseFloat(e.Estabilidade)||0)/100;return s*.25*a*(n*1.5)}function G(e){const s=B(e),a=(parseFloat(e.MilitaryBudgetPercent)||30)/100;return s*a}function K(e){const s=(parseFloat(e.MilitaryDistributionVehicles)||40)/100,a=(parseFloat(e.MilitaryDistributionAircraft)||30)/100,n=(parseFloat(e.MilitaryDistributionNaval)||30)/100;return{vehicles:s,aircraft:a,naval:n,maintenancePercent:.15}}function k(e){const s=G(e),a=K(e),n=s*(1-a.maintenancePercent),i=(parseFloat(e.Tecnologia)||0)/100,o=(parseFloat(e.IndustrialEfficiency)||30)/100,t=(parseFloat(e.Marinha)||0)/100,d=(parseFloat(e.Urbanizacao)||0)/100;return n*a.naval*i*o*t*d}async function J(e,s){try{const a=$.currentUser;if(!a)return;const n=await E(a.uid);if(!n)return;const i=await M.collection("inventory").doc(n).get();if(!i.exists)return;const t=i.data()[e]?.[s];if(!t)return;const d=document.getElementById("equipment-details-modal");d&&d.remove();const l=t.quantity||0,r=t.cost||0,c=r*.05*l,x=r*l,h=t.specs||{},u=document.createElement("div");u.id="equipment-details-modal",u.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const m=document.createElement("div");m.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col",m.innerHTML=`
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">🚗 ${s}</h3>
          <p class="text-sm text-slate-400">${e} • ${l} unidades em serviço</p>
        </div>
        <div class="flex items-center gap-2">
          ${t.sheetImageUrl?`
            <button id="view-equipment-sheet" class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors">
              📋 Ver Ficha
            </button>
          `:""}
          <button id="close-equipment-modal" class="text-slate-400 hover:text-slate-200 p-1">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Financial Summary -->
          <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
            <h4 class="font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <span>💰</span>
              Resumo Financeiro
            </h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Custo unitário:</span>
                <span class="text-slate-200">${b(r)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Quantidade:</span>
                <span class="text-slate-200">${l} unidades</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Valor total investido:</span>
                <span class="text-green-400 font-semibold">${b(x)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Custo de manutenção:</span>
                <span class="text-red-400 font-semibold">${b(c)}/mês</span>
              </div>
            </div>
          </div>

          <!-- Technical Specifications -->
          <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
            <h4 class="font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <span>⚙️</span>
              Especificações Técnicas
            </h4>
            <div class="space-y-2 text-sm">
              ${Object.entries(h).map(([p,f])=>{if(typeof f=="object"||p==="components"||p==="total_cost")return"";const y=p.replace(/_/g," ").replace(/\b\w/g,R=>R.toUpperCase());let w=f;return p.includes("cost")||p.includes("price")?w=b(f):p.includes("weight")?w=`${f} tons`:p.includes("speed")?w=`${f} km/h`:p.includes("armor")||p.includes("thickness")?w=`${f}mm`:(p.includes("caliber")||p.includes("gun"))&&(w=`${f}mm`),`
                  <div class="flex justify-between">
                    <span class="text-slate-400">${y}:</span>
                    <span class="text-slate-200">${w}</span>
                  </div>
                `}).join("")}

              ${t.approvedDate?`
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Data de aprovação:</span>
                  <span class="text-slate-200">${new Date(t.approvedDate).toLocaleDateString("pt-BR")}</span>
                </div>
              `:""}
              ${t.approvedBy?`
                <div class="flex justify-between">
                  <span class="text-slate-400">Aprovado por:</span>
                  <span class="text-slate-200">${t.approvedBy}</span>
                </div>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `,u.appendChild(m),u.addEventListener("click",p=>{p.target===u&&u.remove()}),m.querySelector("#close-equipment-modal").addEventListener("click",()=>{u.remove()});const v=m.querySelector("#view-equipment-sheet");v&&t.sheetImageUrl&&v.addEventListener("click",()=>{Y(s,t.sheetImageUrl)}),document.addEventListener("keydown",function p(f){f.key==="Escape"&&(u.remove(),document.removeEventListener("keydown",p))}),document.body.appendChild(u)}catch(a){console.error("Erro ao carregar detalhes do equipamento:",a)}}function Y(e,s){const a=document.getElementById("equipment-sheet-modal");a&&a.remove();const n=document.createElement("div");n.id="equipment-sheet-modal",n.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const i=document.createElement("div");i.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col",i.innerHTML=`
    <div class="flex items-center justify-between p-4 border-b border-bg-ring/50">
      <div>
        <h3 class="text-lg font-semibold text-slate-200">📋 Ficha Técnica</h3>
        <p class="text-sm text-slate-400">${e}</p>
      </div>
      <div class="flex items-center gap-2">
        <button id="open-sheet-new-tab" class="px-3 py-1.5 text-sm rounded-lg border border-blue-500/50 text-blue-200 hover:bg-blue-500/10 transition-colors">
          🔗 Nova Aba
        </button>
        <button id="close-sheet-modal" class="text-slate-400 hover:text-slate-200 p-1">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto p-4">
      <div class="text-center">
        <img src="${s}" alt="Ficha do ${e}"
             class="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
             style="max-height: 70vh;"
             onload="this.style.opacity=1"
             style="opacity:0; transition: opacity 0.3s;">
      </div>
    </div>
  `,n.appendChild(i),n.addEventListener("click",o=>{o.target===n&&n.remove()}),i.querySelector("#close-sheet-modal").addEventListener("click",()=>{n.remove()}),i.querySelector("#open-sheet-new-tab").addEventListener("click",()=>{window.open(s,"_blank")}),document.addEventListener("keydown",function o(t){t.key==="Escape"&&(n.remove(),document.removeEventListener("keydown",o))}),document.body.appendChild(n)}async function W(){try{const e=document.getElementById("naval-content-container");if(!e)return;e.innerHTML='<div class="flex items-center justify-center py-8"><div class="text-slate-400">🔄 Carregando sistema naval...</div></div>';const s=$.currentUser;if(!s)return;const a=await E(s.uid);if(!a)return;const n=new O,i=window.currentCountry;if(!i)throw new Error("Dados do país não encontrados. Recarregue a página.");const[o,t]=await Promise.all([n.getCurrentShipyardLevel(a),M.collection("paises").get().then(d=>{if(d.empty)return 0;let l=0,r=0;return d.forEach(c=>{const x=parseFloat(c.data().PIB);isNaN(x)||(l+=x,r++)}),r>0?l/r:0})]);e.innerHTML=X(n,o,i,a,t)}catch(e){console.error("Erro ao carregar sistema naval:",e);const s=document.getElementById("naval-content-container");s&&(s.innerHTML=`<div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center"><div class="text-6xl mb-4">❌</div><h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3><p class="text-red-400">Erro ao carregar sistema naval: ${e.message}</p></div>`)}}function X(e,s,a,n,i){const o=B(a),t=e.getLevelInfo(s,a,i),d=e.calculateMaintenanceCost(s,o),l=e.canUpgrade(s,a,i,o),r=[];for(let c=1;c<=3;c++)s+c<=e.maxLevel&&r.push(e.getLevelInfo(s+c,a,i));return`
    <div class="space-y-6">
      <!-- Status Current do Estaleiro -->
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">🏭</span>
          Estaleiros - Nível ${s}
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Status Atual -->
          <div class="space-y-4">
            <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
              <h4 class="font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span>📊</span>
                Status Atual
              </h4>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-slate-400">Nível:</span>
                  <span class="text-slate-200 font-semibold">${s}/10</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Descrição:</span>
                  <span class="text-slate-200 text-xs">${t.description}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Bônus paralelo:</span>
                  <span class="text-green-400">+${t.parallelBonus}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Redução tempo:</span>
                  <span class="text-blue-400">-${t.timeReduction}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Projetos simultâneos:</span>
                  <span class="text-purple-400">${t.maxProjects}</span>
                </div>
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Manutenção/mês:</span>
                  <span class="text-red-400">${b(d)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">% do orçamento:</span>
                  <span class="text-red-400">${(t.maintenancePercent*100).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            ${s<e.maxLevel?`
              <!-- Upgrade -->
              <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                <h4 class="font-semibold text-emerald-200 mb-3 flex items-center gap-2">
                  <span>⬆️</span>
                  Upgrade para Nível ${s+1}
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Custo do upgrade:</span>
                    <span class="text-emerald-300 font-semibold">${b(t.upgradeCost)}</span>
                  </div>

                  ${l.canUpgrade?`
                    <button onclick="window.upgradeShipyard('${n}')"
                            class="w-full px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors">
                      ⬆️ Fazer Upgrade
                    </button>
                  `:`
                    <div class="w-full px-4 py-2 bg-slate-700 text-slate-400 text-center rounded-lg text-sm">
                      ${l.reason}
                    </div>
                  `}
                </div>
              </div>
            `:`
              <div class="bg-gold-900/20 border border-yellow-500/30 rounded-lg p-4 text-center">
                <h4 class="font-semibold text-yellow-200 mb-2">👑 Nível Máximo Atingido</h4>
                <p class="text-sm text-yellow-300">Seus estaleiros estão no máximo da tecnologia disponível!</p>
              </div>
            `}
          </div>

          <!-- Próximos Níveis -->
          <div class="space-y-4">
            <h4 class="font-semibold text-slate-200 flex items-center gap-2">
              <span>🔮</span>
              Próximos Níveis
            </h4>

            ${r.map(c=>`
              <div class="bg-slate-800/20 border border-slate-600/30 rounded-lg p-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold text-slate-200">Nível ${c.level}</span>
                  <span class="text-xs text-emerald-300">${b(c.upgradeCost)}</span>
                </div>
                <div class="text-xs text-slate-400 mb-2">${c.description}</div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="text-green-400">+${c.parallelBonus}% paralelo</div>
                  <div class="text-blue-400">-${c.timeReduction}% tempo</div>
                  <div class="text-purple-400">${c.maxProjects} projetos</div>
                  <div class="text-red-400">${(c.maintenancePercent*100).toFixed(1)}% manutenção</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <!-- Impacto na Produção Naval -->
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">⚓</span>
          Impacto na Produção Naval
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${Z(e,s)}
        </div>

        <div class="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h4 class="font-semibold text-blue-200 mb-2">💡 Como Funcionam os Estaleiros:</h4>
          <div class="text-sm text-blue-100 space-y-1">
            <div>• <strong>Produção Paralela:</strong> Mais navios construídos simultaneamente</div>
            <div>• <strong>Redução de Tempo:</strong> Cada navio é construído mais rapidamente</div>
            <div>• <strong>Projetos Simultâneos:</strong> Diferentes tipos de navios ao mesmo tempo</div>
            <div>• <strong>Manutenção:</strong> Custo mensal crescente para manter a infraestrutura</div>
          </div>
        </div>
      </div>

      <!-- Ferramentas Navais -->
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">🔧</span>
          Ferramentas de Construção Naval
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="criador-navios.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="text-xl">🚢</span>
                <div>
                  <div class="font-medium text-slate-200">Criador de Navios</div>
                  <div class="text-xs text-slate-400">Design customizado de embarcações militares</div>
                  <div class="text-xs text-purple-400 mt-1">Tecnologia naval: ${Math.round(a.Marinha||0)}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold text-slate-200">${b(k(a))}/turno</div>
              </div>
            </div>
          </a>

          <div class="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
            <div class="flex items-center gap-3 mb-3">
              <span class="text-xl">📊</span>
              <div>
                <div class="font-medium text-slate-200">Estatísticas de Produção</div>
                <div class="text-xs text-slate-400">Capacidade atual dos estaleiros</div>
              </div>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Capacidade base:</span>
                <span class="text-slate-200">${b(k(a))}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Bônus estaleiro:</span>
                <span class="text-green-400">+${t.parallelBonus}%</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Capacidade efetiva:</span>
                <span class="text-emerald-400 font-semibold">${b(k(a)*(1+t.parallelBonus/100))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Z(e,s){return[{name:"Corveta",baseTime:8,baseParallel:12},{name:"Destroyer",baseTime:18,baseParallel:4},{name:"Cruzador",baseTime:30,baseParallel:2}].map(n=>{const i=e.calculateProductionBonus(s),o=Math.ceil(n.baseTime*(1-i.timeReduction)),t=Math.ceil(n.baseParallel*i.parallelMultiplier),d=Math.ceil(n.baseTime/3),l=Math.ceil(o/3);return`
      <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <h4 class="font-semibold text-slate-200 mb-3">${n.name}</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo base:</span>
            <span class="text-slate-300">${n.baseTime} meses (${d} turnos)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo atual:</span>
            <span class="text-blue-400">${o} meses (${l} turnos)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Paralelo base:</span>
            <span class="text-slate-300">${n.baseParallel}x</span>
          </div>
          <div class="flex justify-between border-t border-slate-600 pt-2">
            <span class="text-slate-400">Paralelo atual:</span>
            <span class="text-green-400 font-semibold">${t}x</span>
          </div>
        </div>
      </div>
    `}).join("")}window.upgradeShipyard=async function(e){try{if(!confirm("Tem certeza que deseja fazer upgrade do estaleiro? O custo será deduzido imediatamente do orçamento."))return;const s=$.currentUser;if(!s){alert("Usuário não autenticado");return}const a=await E(s.uid);if(!a||a!==e){alert("Você não tem permissão para fazer upgrade deste país");return}const n=event.target,i=n.textContent;n.textContent="🔄 Processando...",n.disabled=!0;const t=await new O().upgradeShipyard(e);t.success?(n.textContent="✅ Upgrade Concluído!",n.classList.add("bg-green-600"),alert(`🏭 Estaleiro upgradado para nível ${t.newLevel}!
💰 Custo: ${b(t.cost)}
📈 Novos bônus: +${t.levelInfo.parallelBonus}% paralelo, -${t.levelInfo.timeReduction}% tempo`),setTimeout(()=>{W()},1500)):(n.textContent="❌ Erro",n.classList.add("bg-red-600"),alert("Erro ao fazer upgrade: "+t.error),setTimeout(()=>{n.textContent=i,n.classList.remove("bg-red-600"),n.disabled=!1},3e3))}catch(s){console.error("Erro ao fazer upgrade do estaleiro:",s),alert("Erro ao fazer upgrade: "+s.message),event.target&&(event.target.textContent="❌ Erro",event.target.classList.add("bg-red-600"),setTimeout(()=>{event.target.textContent="⬆️ Fazer Upgrade",event.target.classList.remove("bg-red-600"),event.target.disabled=!1},3e3))}};window.showEquipmentDetails=J;window.updateBudgetDisplay=function(e){document.getElementById("budget-display").textContent=e};window.updateDistributionDisplay=function(e){const s=document.getElementById("vehicles-slider"),a=document.getElementById("aircraft-slider"),n=document.getElementById("naval-slider");let i=parseInt(s.value),o=parseInt(a.value),t=parseInt(n.value);if(e&&i+o+t>100){if(e==="vehicles"){const v=o+t;v>0&&(o=Math.max(10,Math.floor(o*(100-i)/v)),t=Math.max(10,100-i-o))}else if(e==="aircraft"){const v=i+t;v>0&&(i=Math.max(10,Math.floor(i*(100-o)/v)),t=Math.max(10,100-o-i))}else if(e==="naval"){const v=i+o;v>0&&(i=Math.max(10,Math.floor(i*(100-t)/v)),o=Math.max(10,100-t-i))}s.value=i,a.value=o,n.value=t}document.getElementById("vehicles-display").textContent=i,document.getElementById("aircraft-display").textContent=o,document.getElementById("naval-display").textContent=t;const d=i+o+t,l=document.getElementById("total-distribution-display");l.textContent=d+"%",d===100?l.className="text-lg font-bold text-emerald-400":d>100?l.className="text-lg font-bold text-red-400":l.className="text-lg font-bold text-yellow-400";const r=document.getElementById("military-budget-slider"),c=parseFloat(r.value)/100,u=B(window.currentCountry)*c*.85;document.getElementById("vehicles-amount").textContent=b(u*i/100),document.getElementById("aircraft-amount").textContent=b(u*o/100),document.getElementById("naval-amount").textContent=b(u*t/100)};window.saveMilitaryBudget=async function(e){try{const s=parseFloat(document.getElementById("military-budget-slider").value),a=$.currentUser;if(!a)return;const n=await E(a.uid);if(!n)return;const{db:i}=await N(async()=>{const{db:d}=await import("./firebase-DhEDpEFS.js").then(l=>l.o);return{db:d}},__vite__mapDeps([0,1]));await i.collection("paises").doc(n).update({MilitaryBudgetPercent:s});const o=e.target,t=o.textContent;o.textContent="✓ Salvo!",o.classList.add("bg-green-600"),setTimeout(()=>{o.textContent=t,o.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(s){console.error("Erro ao salvar orçamento militar:",s),alert("Erro ao salvar orçamento militar. Tente novamente.")}};window.saveMilitaryDistribution=async function(e){try{const s=parseInt(document.getElementById("vehicles-slider").value),a=parseInt(document.getElementById("aircraft-slider").value),n=parseInt(document.getElementById("naval-slider").value),i=s+a+n;if(i!==100){alert(`A soma das distribuições deve ser exatamente 100%! Atual: ${i}%`);return}const o=$.currentUser;if(!o)return;const t=await E(o.uid);if(!t)return;const{db:d}=await N(async()=>{const{db:c}=await import("./firebase-DhEDpEFS.js").then(x=>x.o);return{db:c}},__vite__mapDeps([0,1]));await d.collection("paises").doc(t).update({MilitaryDistributionVehicles:s,MilitaryDistributionAircraft:a,MilitaryDistributionNaval:n});const l=e.target,r=l.textContent;l.textContent="✓ Salvo!",l.classList.add("bg-green-600"),setTimeout(()=>{l.textContent=r,l.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(s){console.error("Erro ao salvar distribuição militar:",s),alert("Erro ao salvar distribuição militar. Tente novamente.")}};let _=null;async function ee(e,s){const a=document.getElementById("marketplace-content");if(a)try{a.innerHTML=`
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-slate-400">Carregando ofertas...</p>
        </div>
      </div>
    `;const n=document.getElementById("marketplace-search")?.value||"",i=document.getElementById("marketplace-sort")?.value||"date",o=document.getElementById("marketplace-type")?.value||"all",t=parseFloat(document.getElementById("price-min")?.value)||null,d=parseFloat(document.getElementById("price-max")?.value)||null,l=parseInt(document.getElementById("quantity-min")?.value)||null,r=parseInt(document.getElementById("quantity-max")?.value)||null,c=document.getElementById("country-filter")?.value||null,x=parseInt(document.getElementById("time-filter")?.value)||null,h={category:e,type:o,searchTerm:n,current_country_id:s,orderBy:te(i),orderDirection:se(i),limit:50,priceMin:t,priceMax:d,quantityMin:l,quantityMax:r,countryFilter:c,timeFilter:x};let u=[],m={success:!0,offers:[]};if(e==="favorites"){const f=H();if(f.length===0)u=[],m={success:!0,offers:[],totalCount:0};else{const y={...h,category:"all",limit:1e3};m=await _.getOffers(y),m.success&&(u=m.offers.filter(w=>f.includes(w.id)))}}else m=await _.getOffers(h),u=m.offers||[];if(!m.success)throw new Error(m.error);if(u.length===0){const f=await P(s);a.innerHTML=`
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-lg font-medium text-white mb-2">Nenhuma oferta encontrada</h3>
          <p class="text-slate-400 mb-6">Não há ofertas disponíveis para os filtros selecionados</p>
          ${f.hasEmbargoes?`
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 mx-auto max-w-md">
              <div class="flex items-center gap-2 text-red-400 mb-2">
                <span>🚫</span>
                <span class="font-medium">Embargos Ativos</span>
              </div>
              <p class="text-sm text-red-300">
                ${f.totalEmbargoes} país(es) aplicaram embargos contra você,
                limitando ${f.blockedCategories.length>0?"algumas categorias":"todas as trocas"}.
              </p>
              <button onclick="openEmbargoesModal()" class="mt-3 text-xs px-3 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors">
                Ver Embargos
              </button>
            </div>
          `:""}
          <button onclick="document.getElementById('create-offer-btn').click()" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors">
            Criar primeira oferta
          </button>
        </div>
      `;return}const v=await P(s);let p="";v.hasEmbargoes&&(p+=`
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-yellow-400 mb-2">
            <span>⚠️</span>
            <span class="font-medium">Aviso de Embargos</span>
          </div>
          <p class="text-sm text-yellow-300">
            Algumas ofertas podem estar ocultas devido a embargos ativos.
            ${v.totalEmbargoes} país(es) aplicaram restrições comerciais.
          </p>
          <button onclick="openEmbargoesModal()" class="mt-2 text-xs px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors">
            Ver Detalhes
          </button>
        </div>
      `),p+=`
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="offers-grid">
        ${u.map(f=>A(f)).join("")}
      </div>

      <!-- Pagination Controls -->
      <div class="mt-8 border-t border-bg-ring/50 pt-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Results Info -->
          <div class="text-sm text-slate-400">
            Mostrando ${u.length} de ${m.totalCount||u.length} ofertas
          </div>

          <!-- Pagination -->
          <div class="flex items-center gap-2">
            <button id="load-more-btn" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              📦 Carregar Mais
            </button>
            <button id="infinite-scroll-toggle" class="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors" title="Toggle carregamento automático">
              <span id="infinite-scroll-icon">🔄</span>
            </button>
          </div>
        </div>

        <!-- Load More State -->
        <div id="load-more-state" class="hidden mt-4 text-center">
          <div class="inline-flex items-center gap-2 text-slate-400">
            <div class="animate-spin w-4 h-4 border-2 border-brand-400 border-t-transparent rounded-full"></div>
            <span>Carregando mais ofertas...</span>
          </div>
        </div>
      </div>
    `,a.innerHTML=p,ye(u),be(s,e,h)}catch(n){console.error("Erro ao carregar ofertas:",n),a.innerHTML=`
      <div class="text-center py-12 text-red-400">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-medium mb-2">Erro ao carregar ofertas</h3>
        <p class="mb-4">${n.message||"Tente novamente em alguns instantes"}</p>
        <button onclick="auth.currentUser && checkPlayerCountry(auth.currentUser.uid).then(paisId => paisId && loadMarketplaceOffers('${e}', paisId))" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Tentar novamente
        </button>
      </div>
    `}}function te(e){switch(e){case"price-low":case"price-high":return"price_per_unit";case"quantity":return"quantity";case"popularity":return"views";case"expires-soon":return"expires_at";case"date":default:return"created_at"}}function se(e){switch(e){case"price-low":case"expires-soon":return"asc";case"price-high":case"quantity":case"popularity":case"date":default:return"desc"}}async function P(e){try{if(!e)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const s=await M.collection("marketplace_embargoes").where("target_country_id","==",e).where("status","==","active").get(),a=[];if(s.forEach(o=>{a.push(o.data())}),a.length===0)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const n=new Set;let i=!1;return a.forEach(o=>{o.type==="full"?(i=!0,n.add("resources"),n.add("vehicles"),n.add("naval")):o.type==="partial"&&o.categories_blocked&&o.categories_blocked.forEach(t=>{n.add(t)})}),{hasEmbargoes:!0,totalEmbargoes:a.length,blockedCategories:Array.from(n),hasFullEmbargo:i,embargoes:a}}catch(s){return console.error("Erro ao verificar embargos:",s),{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]}}}function A(e){const s=e.expires_at?.toDate?e.expires_at.toDate():new Date(e.expires_at),a=e.quantity*e.price_per_unit,n=Math.max(0,Math.floor((s-new Date)/(1440*60*1e3))),i=e.type==="sell"?{label:"Venda",color:"text-green-400 bg-green-400/20",icon:"💰"}:{label:"Compra",color:"text-blue-400 bg-blue-400/20",icon:"🛒"},o={resources:"🏭",vehicles:"🚗",naval:"🚢"};return`
    <div class="bg-bg-soft border border-bg-ring/70 rounded-xl p-4 hover:border-brand-400/30 transition-colors cursor-pointer" onclick="openOfferDetails('${e.id}')">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${o[e.category]}</span>
          <span class="px-2 py-1 rounded text-xs font-medium ${i.color}">
            ${i.icon} ${i.label}
          </span>
        </div>
        <div class="text-right text-xs text-slate-400">
          <div>${n} dias restantes</div>
          ${e.views?`<div class="mt-1">${e.views} visualizações</div>`:""}
        </div>
      </div>

      <!-- Title and Description -->
      <h3 class="font-semibold text-white mb-2 line-clamp-1">${e.title}</h3>
      <p class="text-sm text-slate-400 mb-3 line-clamp-2">${e.description||"Sem descrição"}</p>

      <!-- Quantity and Price -->
      <div class="space-y-2 mb-3">
        <div class="flex justify-between">
          <span class="text-sm text-slate-300">Quantidade:</span>
          <span class="text-sm font-medium text-white">${e.quantity.toLocaleString()} ${e.unit}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-slate-300">Preço unitário:</span>
          <span class="text-sm font-medium text-brand-400">${b(e.price_per_unit)}</span>
        </div>
        <div class="flex justify-between border-t border-bg-ring/50 pt-2">
          <span class="text-sm font-medium text-slate-300">Valor total:</span>
          <span class="font-semibold text-white">${b(a)}</span>
        </div>
      </div>

      <!-- Country -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">${e.country_flag||"🏳️"}</span>
          <span class="text-sm text-slate-300">${e.country_name}</span>
        </div>
        <div class="flex gap-2">
          <button id="favorite-btn-${e.id}" class="text-xs px-2 py-1 bg-slate-600/20 text-slate-400 rounded hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors" onclick="event.stopPropagation(); toggleFavorite('${e.id}')" title="Adicionar aos favoritos">
            <span id="favorite-icon-${e.id}">⭐</span>
          </button>
          <button class="text-xs px-3 py-1 bg-brand-500/20 text-brand-400 rounded-lg hover:bg-brand-500/30 transition-colors" onclick="event.stopPropagation(); openOfferDetails('${e.id}')">
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  `}async function ae(e){try{const s=$.currentUser;if(!s){alert("Você precisa estar logado para visualizar detalhes");return}const a=await E(s.uid);if(!a){alert("Você precisa estar associado a um país");return}const i=(await Q()).find(y=>y.id===a);if(!i){alert("Dados do país não encontrados");return}const o=document.querySelectorAll('[onclick*="openOfferDetails"]');let t=null;try{const y=await _.getOffers({limit:1e3});y.success&&y.offers&&(t=y.offers.find(w=>w.id===e))}catch(y){console.error("Error finding offer:",y)}if(!t){alert("Oferta não encontrada");return}const d=document.getElementById("offer-details-modal");d&&d.remove();const l=document.createElement("div");l.id="offer-details-modal",l.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";const r=t.player_id===s.uid||t.country_id===a,c=!r&&t.type==="sell"&&t.status==="active",x=!r&&t.type==="buy"&&t.status==="active",h=c||x,u=B(i),m=t.quantity*t.price_per_unit,v=u>=m,p=t.expires_at?.toDate?t.expires_at.toDate():new Date(t.expires_at),f=Math.max(0,Math.ceil((p-new Date)/(1440*60*1e3)));l.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">
                ${t.type==="sell"?"🔥":"💰"}
                ${t.category==="resources"?"🏭":t.category==="vehicles"?"🚗":"🚢"}
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">${t.title}</h2>
                <div class="flex items-center space-x-4 text-sm text-slate-400">
                  <span>${t.country_flag} ${t.country_name}</span>
                  <span>${t.type==="sell"?"Vendendo":"Comprando"}</span>
                  <span>${f} dias restantes</span>
                </div>
              </div>
            </div>
            <button onclick="closeOfferDetailsModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informações da Oferta -->
            <div class="space-y-6">
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📋 Detalhes do Item</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Item:</span>
                    <span class="text-white">${t.item_name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${t.category==="resources"?"Recursos":t.category==="vehicles"?"Veículos":"Naval"}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade:</span>
                    <span class="text-white font-medium">${t.quantity.toLocaleString()} ${t.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço por ${t.unit.slice(0,-1)}:</span>
                    <span class="text-white font-medium">${g(t.price_per_unit)}</span>
                  </div>
                  <div class="flex justify-between border-t border-bg-ring pt-2 mt-3">
                    <span class="text-slate-400">Valor Total:</span>
                    <span class="text-brand-300 font-bold text-lg">${g(t.total_value)}</span>
                  </div>
                </div>
              </div>

              ${t.description?`
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-2">📝 Descrição</h3>
                <p class="text-slate-300 text-sm">${t.description}</p>
              </div>
              `:""}

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">⚙️ Condições</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Mínima:</span>
                    <span class="text-white">${t.min_quantity||1} ${t.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Máxima:</span>
                    <span class="text-white">${t.max_quantity||t.quantity} ${t.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tempo de Entrega:</span>
                    <span class="text-white">${t.delivery_time_days||30} dias</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Criado em:</span>
                    <span class="text-white">${new Date(t.created_at?.seconds*1e3||t.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Visualizações:</span>
                    <span class="text-white">${t.views||0}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Países Interessados:</span>
                    <span class="text-white">${t.interested_countries?.length||0}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações e Compra -->
            <div class="space-y-6">
              ${r?`
                <div class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <div class="text-blue-400">ℹ️</div>
                    <div>
                      <div class="text-blue-300 font-medium">Esta é sua oferta</div>
                      <div class="text-sm text-slate-300 mt-1">Você não pode interagir com suas próprias ofertas.</div>
                    </div>
                  </div>
                </div>
              `:h?`
                <div class="bg-bg/30 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">
                    ${t.type==="sell"?"💰 Comprar Item":"🔥 Vender Item"}
                  </h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade Desejada</label>
                      <div class="flex space-x-2">
                        <input type="number" id="transaction-quantity" min="${t.min_quantity||1}" max="${t.max_quantity||t.quantity}" value="${t.min_quantity||1}" class="flex-1 px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                        <span class="px-3 py-2 text-slate-400 bg-bg/50 border border-bg-ring rounded-lg">${t.unit}</span>
                      </div>
                      <div class="text-xs text-slate-400 mt-1">
                        Mín: ${t.min_quantity||1} | Máx: ${t.max_quantity||t.quantity}
                      </div>
                    </div>

                    <div id="transaction-summary" class="bg-brand-500/10 border border-brand-400/30 rounded-lg p-3">
                      <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                          <span class="text-slate-400">Quantidade:</span>
                          <span class="text-white"><span id="summary-quantity">${t.min_quantity||1}</span> ${t.unit}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-400">Preço unitário:</span>
                          <span class="text-white">${g(t.price_per_unit)}</span>
                        </div>
                        <div class="flex justify-between font-medium border-t border-brand-400/30 pt-1 mt-2">
                          <span class="text-brand-300">Total a pagar:</span>
                          <span class="text-brand-300" id="summary-total">${g((t.min_quantity||1)*t.price_per_unit)}</span>
                        </div>
                      </div>
                    </div>

                    ${t.type==="sell"&&!v?`
                      <div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                        <div class="flex items-start space-x-2">
                          <div class="text-red-400">⚠️</div>
                          <div>
                            <div class="text-red-300 font-medium">Orçamento Insuficiente</div>
                            <div class="text-sm text-slate-300 mt-1">
                              Disponível: ${g(u)}<br>
                              Necessário: ${g(m)}
                            </div>
                          </div>
                        </div>
                      </div>
                    `:""}

                    <div class="flex space-x-2">
                      <button onclick="closeOfferDetailsModal()" class="flex-1 px-4 py-2 text-slate-300 hover:text-white transition-colors border border-bg-ring rounded-lg">
                        Cancelar
                      </button>
                      <button onclick="processTransaction('${t.id}')" id="process-transaction-btn" class="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors ${t.type==="sell"&&!v?"opacity-50 cursor-not-allowed":""}" ${t.type==="sell"&&!v?"disabled":""}>
                        ${t.type==="sell"?"💰 Comprar":"🔥 Vender"}
                      </button>
                    </div>
                  </div>
                </div>
              `:`
                <div class="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <div class="text-amber-400">⚠️</div>
                    <div>
                      <div class="text-amber-300 font-medium">Oferta não disponível</div>
                      <div class="text-sm text-slate-300 mt-1">
                        ${t.status!=="active"?"Esta oferta não está mais ativa.":"Você não pode interagir com esta oferta."}
                      </div>
                    </div>
                  </div>
                </div>
              `}

              ${t.category==="vehicles"||t.category==="naval"?`
              <!-- Especificações do Equipamento -->
              <div class="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-purple-300 font-medium">⚙️ Especificações Técnicas</h3>
                  <button onclick="openEquipmentDetails('${t.item_id}', '${t.category}', '${t.country_id}')" class="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-lg hover:bg-purple-600/30 transition-colors">
                    📋 Ver Ficha Completa
                  </button>
                </div>
                <div id="equipment-specs-${t.id}" class="text-sm text-slate-300 space-y-2">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tipo:</span>
                    <span class="text-white">${t.category==="vehicles"?"🚗 Veículo Terrestre":"🚢 Embarcação Naval"}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Modelo:</span>
                    <span class="text-white">${t.item_name}</span>
                  </div>
                  <div class="text-xs text-slate-500 mt-3 p-2 bg-bg/50 rounded">
                    💡 Clique em "Ver Ficha Completa" para especificações detalhadas, componentes, custos e desempenho
                  </div>
                </div>
              </div>
              `:""}

              <!-- Informações do Vendedor/Comprador -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">🏛️ Informações do País</h3>
                <div class="flex items-center space-x-3 mb-3">
                  <div class="text-2xl">${t.country_flag}</div>
                  <div>
                    <div class="text-white font-medium">${t.country_name}</div>
                    <div class="text-sm text-slate-400">${t.type==="sell"?"Vendedor":"Comprador"}</div>
                  </div>
                </div>
                <div class="text-sm text-slate-400">
                  Este país ${t.type==="sell"?"está oferecendo":"está procurando"} ${t.item_name.toLowerCase()}
                  ${t.type==="sell"?"para venda":"para compra"} no mercado internacional.
                </div>
              </div>

              <!-- Histórico de Preços (placeholder) -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📈 Informações de Mercado</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço Médio de Mercado:</span>
                    <span class="text-white">${g(t.price_per_unit*(.9+Math.random()*.2))}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Esta Oferta:</span>
                    <span class="${t.price_per_unit>t.price_per_unit*1.1?"text-red-300":t.price_per_unit<t.price_per_unit*.9?"text-green-300":"text-yellow-300"}">
                      ${t.price_per_unit>t.price_per_unit*1.1?"📈 Acima":t.price_per_unit<t.price_per_unit*.9?"📉 Abaixo":"📊 Na Média"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(l),ne(t,i,a)}catch(s){console.error("Erro ao abrir detalhes da oferta:",s),alert("Erro ao carregar detalhes da oferta")}}function q(){const e=document.getElementById("offer-details-modal");e&&e.remove()}function ne(e,s,a){const n=document.getElementById("offer-details-modal");if(!n)return;const i=n.querySelector("#transaction-quantity");i&&i.addEventListener("input",()=>{ie(e,i.value)}),n.addEventListener("click",o=>{o.target===n&&q()}),document.addEventListener("keydown",function o(t){t.key==="Escape"&&(q(),document.removeEventListener("keydown",o))})}function ie(e,s){const a=document.getElementById("offer-details-modal");if(!a)return;const n=a.querySelector("#summary-quantity"),i=a.querySelector("#summary-total");if(n&&i){const o=parseInt(s)||1,t=o*e.price_per_unit;n.textContent=o.toLocaleString(),i.textContent=g(t)}}async function oe(e){try{const s=document.getElementById("offer-details-modal"),a=s.querySelector("#transaction-quantity"),n=s.querySelector("#process-transaction-btn"),i=n.textContent;if(!a){alert("Erro: quantidade não especificada");return}const o=parseInt(a.value);if(!o||o<=0){alert("Por favor, especifique uma quantidade válida"),a.focus();return}const t=$.currentUser;if(!t){alert("Você precisa estar logado");return}if(!await E(t.uid)){alert("Você precisa estar associado a um país");return}const r=(await _.getOffers({limit:1e3})).offers?.find(m=>m.id===e);if(!r){alert("Oferta não encontrada");return}if(o<(r.min_quantity||1)){alert(`Quantidade mínima: ${r.min_quantity||1} ${r.unit}`);return}if(o>(r.max_quantity||r.quantity)){alert(`Quantidade máxima: ${r.max_quantity||r.quantity} ${r.unit}`);return}if(o>r.quantity){alert(`Quantidade disponível: ${r.quantity} ${r.unit}`);return}const c=o*r.price_per_unit,h=`
      Confirmar ${r.type==="sell"?"comprar":"vender"}:

      • Item: ${r.item_name}
      • Quantidade: ${o} ${r.unit}
      • Preço unitário: ${g(r.price_per_unit)}
      • Valor total: ${g(c)}
      • País: ${r.country_name}

      Deseja continuar?
    `;if(!confirm(h))return;n.disabled=!0,n.textContent="⏳ Processando...";const u=await _.createTransaction(e,{quantity:o});if(u.success)n.textContent="✅ Sucesso!",n.classList.remove("bg-brand-500","hover:bg-brand-600"),n.classList.add("bg-green-600"),setTimeout(()=>{alert("Transação criada com sucesso! A negociação foi iniciada."),q();const m=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",v=$.currentUser;v&&E(v.uid).then(p=>{p&&ee(m,p)})},1500);else throw new Error(u.error||"Erro desconhecido ao processar transação")}catch(s){console.error("Erro ao processar transação:",s);const a=document.querySelector("#process-transaction-btn");a&&(a.textContent="❌ Erro",a.classList.remove("bg-brand-500","hover:bg-brand-600"),a.classList.add("bg-red-600"),setTimeout(()=>{a.textContent=offer.type==="sell"?"💰 Comprar":"🔥 Vender",a.classList.remove("bg-red-600"),a.classList.add("bg-brand-500","hover:bg-brand-600"),a.disabled=!1},3e3)),alert("Erro ao processar transação: "+s.message)}}async function re(e,s,a){try{console.log("Abrindo detalhes do equipamento:",{itemId:e,category:s,countryId:a});const n=await _.getCountryInventory(a);let i=null,o=null;if(Object.keys(n).forEach(l=>{n[l]&&typeof n[l]=="object"&&Object.keys(n[l]).forEach(r=>{const c=n[l][r];c&&typeof c=="object"&&(`${l}_${r}`.toLowerCase().replace(/\s+/g,"_")===e||r.toLowerCase().includes(e.toLowerCase()))&&(i=c,o=l,i.name=r,i.category=l)})}),!i){alert("Equipamento não encontrado no inventário do país vendedor.");return}const t=document.getElementById("equipment-details-modal");t&&t.remove();const d=document.createElement("div");d.id="equipment-details-modal",d.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4",d.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">${s==="vehicles"?"🚗":"🚢"}</div>
              <div>
                <h2 class="text-xl font-bold text-white">${i.name}</h2>
                <div class="text-sm text-slate-400">Ficha Técnica Completa</div>
              </div>
            </div>
            <button onclick="closeEquipmentDetailsModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Informações Gerais -->
            <div class="space-y-4">
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📋 Informações Gerais</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Nome:</span>
                    <span class="text-white">${i.name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${o}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade no Inventário:</span>
                    <span class="text-white">${i.quantity||0} unidades</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo Total de Produção:</span>
                    <span class="text-white">${g(i.cost||0)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo de Manutenção/Mês:</span>
                    <span class="text-white">${g((i.cost||0)*.05)}</span>
                  </div>
                </div>
              </div>

              ${i.components?`
              <!-- Componentes -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">🔧 Componentes</h3>
                <div class="space-y-3 text-sm">
                  ${Object.entries(i.components).map(([l,r])=>`
                    <div class="bg-bg/50 rounded p-3">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="text-brand-300 font-medium">${l.replace(/_/g," ").toUpperCase()}</div>
                          <div class="text-slate-300">${r.name||"N/A"}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-slate-400 text-xs">Custo</div>
                          <div class="text-white">${g(r.cost||0)}</div>
                        </div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
              `:""}
            </div>

            <!-- Performance e Estatísticas -->
            <div class="space-y-4">
              ${i.stats?`
              <!-- Estatísticas -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-3">
                  ${Object.entries(i.stats).map(([l,r])=>`
                    <div class="flex justify-between items-center">
                      <span class="text-slate-400">${l.replace(/_/g," ")}:</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-white">${typeof r=="number"?r.toLocaleString():r}</span>
                        ${typeof r=="number"&&r>0?`
                          <div class="bg-bg w-16 h-2 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style="width: ${Math.min(100,r/100*100)}%"></div>
                          </div>
                        `:""}
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
              `:""}

              <!-- Informações Operacionais -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">⚡ Informações Operacionais</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Estado Operacional:</span>
                    <span class="text-green-400">✅ Ativo</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Disponível para Venda:</span>
                    <span class="text-white">${Math.floor((i.quantity||0)*.5)} unidades (50% max)</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tempo de Preparação:</span>
                    <span class="text-white">15-30 dias</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Condição:</span>
                    <span class="text-white">Excelente</span>
                  </div>
                </div>
              </div>

              <!-- Notas Técnicas -->
              <div class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <h3 class="text-blue-300 font-medium mb-2">💡 Notas Técnicas</h3>
                <div class="text-sm text-slate-300">
                  <p>Este equipamento foi produzido conforme especificações militares padrão e passou por todos os testes de qualidade necessários.</p>
                  <p class="mt-2">Inclui documentação técnica completa, manuais de operação e suporte técnico básico.</p>
                </div>
              </div>

              <!-- Botão de Fechar -->
              <div class="flex justify-end pt-4">
                <button onclick="closeEquipmentDetailsModal()" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  Fechar Ficha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(d),d.addEventListener("click",l=>{l.target===d&&L()}),document.addEventListener("keydown",function l(r){r.key==="Escape"&&(L(),document.removeEventListener("keydown",l))})}catch(n){console.error("Erro ao abrir detalhes do equipamento:",n),alert("Erro ao carregar detalhes do equipamento")}}function L(){const e=document.getElementById("equipment-details-modal");e&&e.remove()}window.openOfferDetails=ae;window.openEquipmentDetails=re;window.closeEquipmentDetailsModal=L;window.closeOfferDetailsModal=q;window.processTransaction=oe;function le(){const e=document.getElementById("create-offer-modal");e&&e.remove()}window.closeCreateOfferModal=le;function de(){const e=document.getElementById("notifications-modal");e&&e.remove()}let C=[];function ce(e){const s=document.getElementById("notifications-list");if(s){if(e.length===0){s.innerHTML=`
      <div class="text-center py-8 text-slate-400">
        <div class="text-4xl mb-2">📪</div>
        <p>Nenhuma notificação encontrada</p>
      </div>
    `;return}s.innerHTML=e.map(a=>ue(a)).join("")}}function ue(e){const s=!e.read,a=e.created_at?.toDate?e.created_at.toDate():new Date(e.created_at),n=fe(a),i={embargo_applied:"🚫",embargo_lifted:"✅",transaction_created:"💰",transaction_completed:"✅",trade_offer:"📦",diplomatic:"🏛️"},o={embargo_applied:"border-red-400/30 bg-red-400/10",embargo_lifted:"border-green-400/30 bg-green-400/10",transaction_created:"border-blue-400/30 bg-blue-400/10",transaction_completed:"border-green-400/30 bg-green-400/10",trade_offer:"border-yellow-400/30 bg-yellow-400/10",diplomatic:"border-purple-400/30 bg-purple-400/10"},t=i[e.type]||"📬";return`
    <div class="notification-item bg-bg border ${o[e.type]||"border-slate-400/30 bg-slate-400/10"} rounded-lg p-4 ${s?"border-l-4 border-l-brand-400":""}"
         data-type="${e.type}" data-read="${e.read?"true":"false"}">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3 flex-1">
          <div class="text-2xl">${t}</div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="font-medium text-white">${e.title}</h4>
              ${s?'<span class="w-2 h-2 bg-brand-400 rounded-full"></span>':""}
            </div>
            <p class="text-sm text-slate-300 mb-2">${e.message}</p>
            <div class="flex items-center space-x-4 text-xs text-slate-400">
              <span>${n}</span>
              ${e.priority==="high"?'<span class="text-red-400 font-medium">• Alta Prioridade</span>':""}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          ${s?`
            <button onclick="markNotificationAsRead('${e.id}')" class="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded hover:bg-green-600/30 transition-colors">
              Marcar como Lida
            </button>
          `:""}
          <button onclick="deleteNotification('${e.id}')" class="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  `}function S(e){let s=C;e==="unread"?s=C.filter(a=>!a.read):e==="embargo"?s=C.filter(a=>a.type&&a.type.includes("embargo")):e==="transaction"&&(s=C.filter(a=>a.type&&a.type.includes("transaction"))),ce(s)}async function pe(e){try{await M.collection("notifications").doc(e).update({read:!0,read_at:new Date});const s=C.find(n=>n.id===e);s&&(s.read=!0);const a=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";S(a),await D()}catch(s){console.error("Erro ao marcar notificação como lida:",s)}}async function me(){try{const e=$.currentUser;if(!e||!await E(e.uid))return;const a=M.batch();C.forEach(i=>{if(!i.read){const o=M.collection("notifications").doc(i.id);a.update(o,{read:!0,read_at:new Date}),i.read=!0}}),await a.commit();const n=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";S(n),await D()}catch(e){console.error("Erro ao marcar todas as notificações como lidas:",e)}}async function ve(e){try{if(!confirm("Tem certeza que deseja excluir esta notificação?"))return;await M.collection("notifications").doc(e).delete(),C=C.filter(a=>a.id!==e);const s=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";S(s),await D()}catch(s){console.error("Erro ao excluir notificação:",s)}}async function D(){try{const e=$.currentUser;if(!e)return;const s=await E(e.uid);if(!s)return;const n=(await M.collection("notifications").where("target_country_id","==",s).where("read","==",!1).get()).size,i=document.getElementById("notifications-count-badge");i&&(n>0?(i.textContent=n>99?"99+":n.toString(),i.classList.remove("hidden")):i.classList.add("hidden"))}catch(e){console.error("Erro ao atualizar contador de notificações:",e)}}function fe(e){const a=new Date-e,n=Math.floor(a/(1e3*60)),i=Math.floor(a/(1e3*60*60)),o=Math.floor(a/(1e3*60*60*24));return n<1?"Agora há pouco":n<60?`${n} min atrás`:i<24?`${i}h atrás`:o<7?`${o} dias atrás`:e.toLocaleDateString("pt-BR")}window.closeNotificationsModal=de;window.markNotificationAsRead=pe;window.markAllNotificationsAsRead=me;window.deleteNotification=ve;let F=1,I=!1,j=!1,T=null;function be(e,s,a){const n=document.getElementById("load-more-btn"),i=document.getElementById("infinite-scroll-toggle"),o=document.getElementById("infinite-scroll-icon");T={...a,countryId:e,category:s},n&&n.addEventListener("click",()=>{U()}),i&&o&&(i.addEventListener("click",()=>{I=!I,I?(o.textContent="♾️",i.title="Carregamento automático ativado",xe()):(o.textContent="🔄",i.title="Carregamento automático desativado",V()),localStorage.setItem("marketplace-infinite-scroll",I)}),localStorage.getItem("marketplace-infinite-scroll")==="true"&&i.click())}async function U(){if(j||!T)return;j=!0;const e=document.getElementById("load-more-btn"),s=document.getElementById("load-more-state"),a=document.getElementById("offers-grid");e&&(e.disabled=!0),s&&s.classList.remove("hidden");try{F++;const n={...T,limit:20,offset:(F-1)*20},i=await _.getOffers(n);if(i.success&&i.offers.length>0){const o=i.offers.map(l=>A(l)).join("");a&&(a.innerHTML+=o);const t=a?.children.length||0,d=document.querySelector(".text-sm.text-slate-400");d&&(d.textContent=`Mostrando ${t} ofertas`),i.offers.length<20&&e&&(e.textContent="✅ Todas as ofertas carregadas",e.disabled=!0)}else e&&(e.textContent="✅ Todas as ofertas carregadas",e.disabled=!0)}catch(n){console.error("Erro ao carregar mais ofertas:",n),e&&(e.disabled=!1)}finally{j=!1,s&&s.classList.add("hidden")}}function xe(){V(),window.addEventListener("scroll",z)}function V(){window.removeEventListener("scroll",z)}function z(){if(!I||j)return;const e=window.innerHeight+window.scrollY,s=document.documentElement.offsetHeight;if(e>=s-200){const n=document.getElementById("load-more-btn");n&&!n.disabled&&U()}}function H(){try{const e=localStorage.getItem("marketplace-favorites");return e?JSON.parse(e):[]}catch(e){return console.error("Erro ao carregar favoritos:",e),[]}}function ge(e){return H().includes(e)}function ye(e){e.forEach(s=>{const a=document.getElementById(`favorite-btn-${s.id}`),n=document.getElementById(`favorite-icon-${s.id}`);a&&n&&(ge(s.id)?(a.classList.remove("bg-slate-600/20","text-slate-400"),a.classList.add("bg-yellow-500/20","text-yellow-400"),a.title="Remover dos favoritos",n.textContent="🌟"):(a.classList.remove("bg-yellow-500/20","text-yellow-400"),a.classList.add("bg-slate-600/20","text-slate-400"),a.title="Adicionar aos favoritos",n.textContent="⭐"))})}
