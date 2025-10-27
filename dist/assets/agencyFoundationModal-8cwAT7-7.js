const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/renderer-BoAYsS9x.js","assets/utils-DLoRv3re.js","assets/resourceConsumptionCalculator-Bk-hb2mA.js","assets/resourceProductionCalculator-C5abBl5S.js","assets/consumerGoodsCalculator-RQh-OK8I.js","assets/firebase-ep1w8F7T.js","assets/preload-helper-f85Crcwt.js","assets/shipyardSystem-CBTksbsh.js","assets/espionageOperationsSystem-Cysd5PTP.js"])))=>i.map(i=>d[i]);
import{_ as m}from"./preload-helper-f85Crcwt.js";import{i,A as p}from"./espionageOperationsSystem-Cysd5PTP.js";import{f as d}from"./utils-DLoRv3re.js";import"./firebase-ep1w8F7T.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";import"./shipyardSystem-CBTksbsh.js";class x{constructor(){this.modal=null,this.country=null,this.currentTurn=0,this.selectedBudgetPercent=5,this.selectedFocus="external_espionage",this.createModal()}createModal(){this.modal=document.createElement("div"),this.modal.id="agency-foundation-modal",this.modal.className="hidden fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm",this.modal.innerHTML=`
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <span class="text-4xl">🕵️</span>
            <div>
              <h3 class="text-2xl font-bold text-slate-100">Fundar Agência de Inteligência</h3>
              <p class="text-sm text-slate-400">Crie uma agência de espionagem e contra-espionagem</p>
            </div>
          </div>
          <button id="close-agency-foundation-modal" class="text-slate-400 hover:text-slate-200 text-2xl transition">×</button>
        </div>

        <!-- Nome da Agência -->
        <div class="mb-6">
          <label class="text-sm font-semibold text-slate-200 mb-2 block">Nome da Agência</label>
          <input
            type="text"
            id="agency-name-input"
            placeholder="Ex: CIA, KGB, MI6, ABIN..."
            maxlength="50"
            class="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
          <p class="text-xs text-slate-500 mt-1">Deixe em branco para usar nome padrão</p>
        </div>

        <!-- Orçamento Dedicado -->
        <div class="mb-6">
          <label class="text-sm font-semibold text-slate-200 mb-3 block">Orçamento Anual Dedicado</label>
          <div class="flex items-center gap-4 mb-3">
            <input
              type="range"
              id="agency-budget-slider"
              min="0.5"
              max="15"
              step="0.5"
              value="5"
              class="flex-1 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div class="min-w-[100px] text-right">
              <span id="budget-percent-display" class="text-2xl font-bold text-brand-400">5%</span>
            </div>
          </div>

          <!-- Tier Preview -->
          <div id="tier-preview" class="p-4 rounded-xl border bg-slate-800/50 border-slate-600">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <span id="tier-icon" class="text-2xl">🥇</span>
                <span id="tier-name" class="text-lg font-bold text-slate-100">Poderosa</span>
              </div>
              <span id="tier-power" class="text-sm px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400">Forte</span>
            </div>
            <p id="tier-description" class="text-sm text-slate-400">Operações complexas e eficazes</p>
            <div class="mt-3 grid grid-cols-2 gap-3">
              <div class="text-xs">
                <span class="text-slate-500">Orçamento Anual:</span>
                <span id="agency-budget-display" class="text-slate-200 font-semibold ml-1">US$ 0</span>
              </div>
              <div class="text-xs">
                <span class="text-slate-500">Modificador:</span>
                <span id="tier-modifier" class="text-emerald-400 font-semibold ml-1">+1</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Foco Principal -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-slate-200 mb-3">Foco Principal</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="agency-focus-options">
            <!-- Será preenchido dinamicamente -->
          </div>
        </div>

        <!-- Custo de Fundação -->
        <div class="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xl">💰</span>
              <span class="text-sm font-semibold text-amber-200">Custo de Fundação</span>
            </div>
            <span id="foundation-cost" class="text-xl font-bold text-amber-300">US$ 0</span>
          </div>
          <p class="text-xs text-amber-400 mt-2">Custo único baseado no PIB per capita do país</p>
        </div>

        <!-- Orçamento Nacional Disponível -->
        <div class="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div class="flex items-center justify-between">
            <span class="text-sm text-emerald-300">💵 Orçamento Nacional Disponível</span>
            <span id="national-budget-display" class="text-lg font-bold text-emerald-400">US$ 0</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3">
          <button
            id="cancel-agency-foundation"
            class="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            Cancelar
          </button>
          <button
            id="confirm-agency-foundation"
            class="flex-1 rounded-xl border border-brand-500/30 bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🕵️ Fundar Agência
          </button>
        </div>

        <!-- Resultado (inicialmente oculto) -->
        <div id="foundation-result" class="hidden mt-4 p-4 rounded-xl">
          <div class="flex items-start gap-3">
            <span id="result-icon" class="text-2xl"></span>
            <div class="flex-1">
              <h4 id="result-title" class="font-bold text-lg mb-1"></h4>
              <p id="result-message" class="text-sm"></p>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(this.modal),this.attachEventListeners()}attachEventListeners(){const e=this.modal.querySelector("#close-agency-foundation-modal"),a=this.modal.querySelector("#cancel-agency-foundation");e.addEventListener("click",()=>this.hide()),a.addEventListener("click",()=>this.hide()),this.modal.addEventListener("click",n=>{n.target===this.modal&&this.hide()}),this.modal.querySelector("#agency-budget-slider").addEventListener("input",n=>{this.selectedBudgetPercent=parseFloat(n.target.value),this.updateBudgetDisplay()}),this.modal.querySelector("#confirm-agency-foundation").addEventListener("click",()=>this.confirmFoundation())}show(e,a){this.country=e,this.currentTurn=a,this.renderFocusOptions();const s=i.calculateBudget(e);this.modal.querySelector("#national-budget-display").textContent=d(s),this.updateBudgetDisplay(),this.modal.classList.remove("hidden"),this.modal.querySelector("#foundation-result").classList.add("hidden")}hide(){this.modal.classList.add("hidden")}renderFocusOptions(){const e=this.modal.querySelector("#agency-focus-options"),a=i.getFocuses();e.innerHTML=Object.entries(a).map(([s,t])=>`
      <button
        class="focus-option-btn text-left p-4 rounded-xl border transition ${s===this.selectedFocus?"border-brand-500 bg-brand-500/10":"border-slate-700 bg-slate-800/50 hover:border-slate-600"}"
        data-focus="${s}"
      >
        <div class="flex items-start gap-3">
          <span class="text-3xl">${t.icon}</span>
          <div class="flex-1">
            <h5 class="font-semibold text-slate-100 mb-1">${t.name}</h5>
            <p class="text-xs text-slate-400 mb-2">${t.description}</p>
            <div class="flex flex-wrap gap-1">
              ${Object.entries(t.bonuses).map(([n,o])=>`
                <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  +${o}% ${n}
                </span>
              `).join("")}
            </div>
          </div>
        </div>
      </button>
    `).join(""),e.querySelectorAll(".focus-option-btn").forEach(s=>{s.addEventListener("click",t=>{this.selectedFocus=t.currentTarget.dataset.focus,this.renderFocusOptions()})})}updateBudgetDisplay(){if(!this.country)return;const e=i.calculateBudget(this.country),a=Math.round(e*(this.selectedBudgetPercent/100)),s=i.determineTier(this.selectedBudgetPercent),t=p[s],n=i.calculateFoundationCost(this.country);this.modal.querySelector("#budget-percent-display").textContent=`${this.selectedBudgetPercent}%`,this.modal.querySelector("#tier-icon").textContent=t.icon,this.modal.querySelector("#tier-name").textContent=t.name,this.modal.querySelector("#tier-power").textContent=t.power,this.modal.querySelector("#tier-description").textContent=t.description,this.modal.querySelector("#agency-budget-display").textContent=d(a),this.modal.querySelector("#tier-modifier").textContent=t.modifier>=0?`+${t.modifier}`:t.modifier,this.modal.querySelector("#foundation-cost").textContent=d(n);const o=this.modal.querySelector("#confirm-agency-foundation");o.disabled=n>e}async confirmFoundation(){const e=this.modal.querySelector("#confirm-agency-foundation"),a=this.modal.querySelector("#agency-name-input");e.disabled=!0,e.textContent="⏳ Fundando...";const s=await i.foundAgency(this.country,a.value.trim(),this.selectedBudgetPercent,this.selectedFocus,this.currentTurn);this.showResult(s),e.disabled=!1,e.textContent="🕵️ Fundar Agência"}showResult(e){const a=this.modal.querySelector("#foundation-result"),s=this.modal.querySelector("#result-icon"),t=this.modal.querySelector("#result-title"),n=this.modal.querySelector("#result-message");if(e.success){a.className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30",s.textContent="✅",t.textContent="Agência Fundada com Sucesso!",t.className="font-bold text-lg mb-1 text-green-400";const o=e.tier;n.textContent=`${e.agency.name} foi fundada! Tier: ${o.icon} ${o.name}. Orçamento anual: ${d(e.agency.budget)}. Você pode começar a pesquisar tecnologias de inteligência.`,n.className="text-sm text-green-300",setTimeout(async()=>{if(this.hide(),window.reloadCurrentCountry){await window.reloadCurrentCountry();const l=document.getElementById("intelligence-dashboard-container");if(l){const{renderAgencyDashboard:r}=await m(async()=>{const{renderAgencyDashboard:c}=await import("./renderer-BoAYsS9x.js").then(u=>u.d);return{renderAgencyDashboard:c}},__vite__mapDeps([0,1,2,3,4,5,6,7,8]));r(window.currentCountry,l)}}},2e3)}else a.className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30",s.textContent="❌",t.textContent="Erro",t.className="font-bold text-lg mb-1 text-red-400",n.textContent=e.error||"Ocorreu um erro ao fundar a agência.",n.className="text-sm text-red-300";a.classList.remove("hidden")}}const F=new x;export{F as default};
