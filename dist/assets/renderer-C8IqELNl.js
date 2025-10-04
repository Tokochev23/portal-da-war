const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/agencyFoundationModal-DgXwoUyD.js","assets/preload-helper-f85Crcwt.js","assets/espionageOperationsSystem-yA0URGjb.js","assets/firebase-BARDcBiw.js"])))=>i.map(i=>d[i]);
import{h as b,j as g,k as h,l as qe,m as he}from"./firebase-BARDcBiw.js";import{R as Y}from"./resourceConsumptionCalculator-dQu245X_.js";import{R as J}from"./resourceProductionCalculator-b8MxHWSv.js";import{C as ke}from"./consumerGoodsCalculator-Bg6C08yH.js";import{_ as De}from"./preload-helper-f85Crcwt.js";import{i as $,I as je,e as k}from"./espionageOperationsSystem-yA0URGjb.js";import{addDoc as ze,collection as G,doc as ye,getDoc as Ce,updateDoc as He,query as we,where as K,getDocs as Ie}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";const W={basic:{name:"Básica",description:"Orçamento e recursos gerais",costMultiplier:1,successBaseChance:.7,icon:"🔍"},intermediate:{name:"Intermediária",description:"Recursos + tecnologias e capacidades",costMultiplier:2.5,successBaseChance:.5,icon:"🔬"},total:{name:"Total",description:"Acesso completo ao inventário militar",costMultiplier:5,successBaseChance:.3,icon:"🎯"}},Ue=5e4;class Ve{constructor(){this.activeOperations=new Map,this.lastUpdate=null}async hasActiveSpying(t,e,s){try{const i=await b.collection("espionageOperations").where("spyCountryId","==",t).where("targetCountryId","==",e).where("active","==",!0).get();if(i.empty)return null;const n=i.docs[0].data();return n.id=i.docs[0].id,n.validUntilTurn<s?(await this.deactivateOperation(n.id),null):n}catch(i){return console.error("Erro ao verificar espionagem ativa:",i),null}}calculateOperationCost(t,e,s){const i=W[t];if(!i)return 0;let n=Ue*i.costMultiplier*e;const r=.5+(parseFloat(s.WarPower)||50)/100;return Math.round(n*r)}calculateSuccessChance(t,e,s){const i=W[t];if(!i)return 0;let n=i.successBaseChance;const o=(parseFloat(e.Tecnologia)||0)/100;n+=o*.2;const r=(parseFloat(s.CounterIntelligence)||0)/100;n-=r*3;const l=(parseFloat(s.Urbanizacao)||0)/100;return n-=l*.1,Math.max(.05,Math.min(.95,n))}async initiateOperation(t,e,s,i,n){try{if(await this.hasActiveSpying(t.id,e.id,n))return{success:!1,error:"Você já tem uma operação ativa neste país!"};const r=this.calculateOperationCost(s,i,e);if(this.calculateBudget(t)<r)return{success:!1,error:"Orçamento insuficiente para esta operação!"};const c=this.calculateSuccessChance(s,t,e),u=Math.random()<=c,v=(parseFloat(e.CounterIntelligence)||0)/100*.5,f=Math.random()<=v,x={spyCountryId:t.id,spyCountryName:t.Pais,targetCountryId:e.id,targetCountryName:e.Pais,level:s,startTurn:n,validUntilTurn:n+i,duration:i,investment:r,detected:f,succeeded:u,active:u,createdAt:new Date().toISOString()},C=await b.collection("espionageOperations").add(x);return f&&await this.createDetectionNotification(e.id,t.Pais,u),{success:!0,operation:{...x,id:C.id},cost:r,succeeded:u,detected:f,successChance:Math.round(c*100)}}catch(o){return console.error("Erro ao iniciar operação de espionagem:",o),{success:!1,error:"Erro ao processar operação: "+o.message}}}async deactivateOperation(t){try{return await b.collection("espionageOperations").doc(t).update({active:!1,deactivatedAt:new Date().toISOString()}),!0}catch(e){return console.error("Erro ao desativar operação:",e),!1}}async getActiveOperations(t,e){try{const s=await b.collection("espionageOperations").where("spyCountryId","==",t).where("active","==",!0).get(),i=[];for(const n of s.docs){const o=n.data();o.id=n.id,o.validUntilTurn>=e?i.push(o):await this.deactivateOperation(n.id)}return i}catch(s){return console.error("Erro ao buscar operações ativas:",s),[]}}async getSpyingAttempts(t){try{return(await b.collection("espionageOperations").where("targetCountryId","==",t).where("detected","==",!0).get()).docs.map(s=>({id:s.id,...s.data()}))}catch(e){return console.error("Erro ao buscar tentativas de espionagem:",e),[]}}async createDetectionNotification(t,e,s){try{const i={countryId:t,type:"espionage_detected",message:s?`⚠️ Espionagem detectada! ${e} conseguiu acessar informações classificadas.`:`🛡️ Tentativa de espionagem bloqueada! ${e} tentou acessar informações mas foi impedido.`,spyCountry:e,succeeded:s,read:!1,createdAt:new Date().toISOString()};await b.collection("notifications").add(i)}catch(i){console.error("Erro ao criar notificação:",i)}}async updateCounterIntelligence(t,e){try{const s=Math.max(0,Math.min(10,parseFloat(e)||0));return await b.collection("paises").doc(t).update({CounterIntelligence:s}),{success:!0,newValue:s}}catch(s){return console.error("Erro ao atualizar contra-espionagem:",s),{success:!1,error:s.message}}}calculateBudget(t){const e=parseFloat(t.PIB)||0,s=(parseFloat(t.Burocracia)||0)/100,i=(parseFloat(t.Estabilidade)||0)/100;return e*.25*s*i*1.5}async cleanExpiredOperations(t){try{const e=await b.collection("espionageOperations").where("active","==",!0).get();let s=0;for(const i of e.docs)i.data().validUntilTurn<t&&(await this.deactivateOperation(i.id),s++);return console.log(`🧹 ${s} operações de espionagem expiradas foram limpas.`),s}catch(e){return console.error("Erro ao limpar operações expiradas:",e),0}}getLevels(){return W}}const y=new Ve;class Ge{constructor(){this.modal=null,this.targetCountry=null,this.spyCountry=null,this.currentTurn=0,this.selectedLevel="basic",this.selectedDuration=3,this.createModal()}createModal(){this.modal=document.createElement("div"),this.modal.id="espionage-modal",this.modal.className="hidden fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm",this.modal.innerHTML=`
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <span class="text-3xl">🕵️</span>
            <div>
              <h3 class="text-xl font-bold text-slate-100">Operação de Espionagem</h3>
              <p class="text-sm text-slate-400" id="espionage-target-name">Selecione um país</p>
            </div>
          </div>
          <button id="close-espionage-modal" class="text-slate-400 hover:text-slate-200 text-2xl transition">×</button>
        </div>

        <!-- Aviso -->
        <div class="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div class="flex items-start gap-3">
            <span class="text-xl">⚠️</span>
            <div class="text-sm text-amber-200">
              <p class="font-semibold mb-1">Operações de espionagem são arriscadas</p>
              <p class="text-amber-300/90">Países com alta contra-espionagem podem detectar e bloquear suas tentativas. Investimentos maiores não garantem sucesso.</p>
            </div>
          </div>
        </div>

        <!-- Seleção de Nível -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-slate-200 mb-3">Nível de Espionagem</h4>
          <div class="grid grid-cols-1 gap-3" id="espionage-levels">
            <!-- Será preenchido dinamicamente -->
          </div>
        </div>

        <!-- Duração -->
        <div class="mb-6">
          <h4 class="text-sm font-semibold text-slate-200 mb-3">Duração da Operação</h4>
          <div class="flex items-center gap-4">
            <input
              type="range"
              id="espionage-duration"
              min="1"
              max="10"
              value="3"
              class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <span id="duration-display" class="text-lg font-bold text-brand-400 min-w-[80px]">3 turnos</span>
          </div>
          <p class="text-xs text-slate-400 mt-2">Quanto maior a duração, maior o custo total da operação.</p>
        </div>

        <!-- Resumo de Custos e Chances -->
        <div class="mb-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs text-slate-400 mb-1">Custo Total</p>
              <p id="operation-cost" class="text-xl font-bold text-slate-100">US$ 0</p>
            </div>
            <div>
              <p class="text-xs text-slate-400 mb-1">Chance de Sucesso</p>
              <div class="flex items-center gap-2">
                <p id="success-chance" class="text-xl font-bold text-green-400">0%</p>
                <span id="chance-indicator" class="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">-</span>
              </div>
            </div>
          </div>

          <!-- Barra de chance -->
          <div class="mt-3">
            <div class="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
              <div id="chance-bar" class="h-2 rounded-full bg-green-500 transition-all duration-300" style="width: 0%"></div>
            </div>
          </div>

          <!-- Fatores que afetam -->
          <div class="mt-3 text-xs text-slate-400">
            <p class="font-semibold mb-1">Fatores que afetam a chance:</p>
            <ul class="space-y-0.5">
              <li id="factor-spy-tech" class="flex items-center gap-1">
                <span class="text-green-400">+</span> Sua tecnologia
              </li>
              <li id="factor-target-counter" class="flex items-center gap-1">
                <span class="text-red-400">-</span> Contra-espionagem do alvo
              </li>
              <li id="factor-target-urban" class="flex items-center gap-1">
                <span class="text-red-400">-</span> Urbanização do alvo
              </li>
            </ul>
          </div>
        </div>

        <!-- Orçamento Disponível -->
        <div class="mb-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div class="flex items-center justify-between">
            <span class="text-sm text-emerald-300">💰 Orçamento Disponível</span>
            <span id="available-budget" class="text-lg font-bold text-emerald-400">US$ 0</span>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex gap-3">
          <button
            id="cancel-espionage"
            class="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            Cancelar
          </button>
          <button
            id="confirm-espionage"
            class="flex-1 rounded-xl border border-brand-500/30 bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🕵️ Iniciar Operação
          </button>
        </div>

        <!-- Resultado (inicialmente oculto) -->
        <div id="operation-result" class="hidden mt-4 p-4 rounded-xl">
          <div class="flex items-start gap-3">
            <span id="result-icon" class="text-2xl"></span>
            <div class="flex-1">
              <h4 id="result-title" class="font-bold text-lg mb-1"></h4>
              <p id="result-message" class="text-sm"></p>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(this.modal),this.attachEventListeners()}attachEventListeners(){const t=this.modal.querySelector("#close-espionage-modal"),e=this.modal.querySelector("#cancel-espionage");t.addEventListener("click",()=>this.hide()),e.addEventListener("click",()=>this.hide()),this.modal.addEventListener("click",o=>{o.target===this.modal&&this.hide()});const s=this.modal.querySelector("#espionage-duration"),i=this.modal.querySelector("#duration-display");s.addEventListener("input",o=>{this.selectedDuration=parseInt(o.target.value),i.textContent=`${this.selectedDuration} turno${this.selectedDuration>1?"s":""}`,this.updateCostAndChance()}),this.modal.querySelector("#confirm-espionage").addEventListener("click",()=>this.confirmOperation())}async show(t,e,s){this.targetCountry=t,this.spyCountry=e,this.currentTurn=s,this.modal.querySelector("#espionage-target-name").textContent=`Alvo: ${t.Pais}`,this.renderLevels();const i=y.calculateBudget(e);this.modal.querySelector("#available-budget").textContent=g(i),this.updateCostAndChance(),this.modal.classList.remove("hidden"),this.modal.querySelector("#operation-result").classList.add("hidden")}hide(){this.modal.classList.add("hidden")}renderLevels(){const t=this.modal.querySelector("#espionage-levels"),e=y.getLevels();t.innerHTML=Object.entries(e).map(([s,i])=>`
      <button
        class="espionage-level-btn text-left p-4 rounded-xl border transition ${s===this.selectedLevel?"border-brand-500 bg-brand-500/10":"border-slate-700 bg-slate-800/50 hover:border-slate-600"}"
        data-level="${s}"
      >
        <div class="flex items-start gap-3">
          <span class="text-2xl">${i.icon}</span>
          <div class="flex-1">
            <h5 class="font-semibold text-slate-100 mb-1">${i.name}</h5>
            <p class="text-xs text-slate-400">${i.description}</p>
            <div class="mt-2 flex items-center gap-2 text-xs">
              <span class="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                Custo: ${i.costMultiplier}x
              </span>
              <span class="px-2 py-0.5 rounded-full ${i.successBaseChance>=.6?"bg-green-500/20 text-green-400":i.successBaseChance>=.4?"bg-amber-500/20 text-amber-400":"bg-red-500/20 text-red-400"}">
                Base: ${Math.round(i.successBaseChance*100)}%
              </span>
            </div>
          </div>
        </div>
      </button>
    `).join(""),t.querySelectorAll(".espionage-level-btn").forEach(s=>{s.addEventListener("click",i=>{this.selectedLevel=i.currentTarget.dataset.level,this.renderLevels(),this.updateCostAndChance()})})}updateCostAndChance(){if(!this.targetCountry||!this.spyCountry)return;const t=y.calculateOperationCost(this.selectedLevel,this.selectedDuration,this.targetCountry);this.modal.querySelector("#operation-cost").textContent=g(t);const e=y.calculateSuccessChance(this.selectedLevel,this.spyCountry,this.targetCountry),s=Math.round(e*100),i=this.modal.querySelector("#success-chance"),n=this.modal.querySelector("#chance-bar"),o=this.modal.querySelector("#chance-indicator");i.textContent=`${s}%`,n.style.width=`${s}%`,s>=70?(i.className="text-xl font-bold text-green-400",n.className="h-2 rounded-full bg-green-500 transition-all duration-300",o.textContent="Alta",o.className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400"):s>=40?(i.className="text-xl font-bold text-amber-400",n.className="h-2 rounded-full bg-amber-500 transition-all duration-300",o.textContent="Média",o.className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400"):(i.className="text-xl font-bold text-red-400",n.className="h-2 rounded-full bg-red-500 transition-all duration-300",o.textContent="Baixa",o.className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400");const r=y.calculateBudget(this.spyCountry),l=this.modal.querySelector("#confirm-espionage");l.disabled=t>r}async confirmOperation(){const t=this.modal.querySelector("#confirm-espionage");t.disabled=!0,t.textContent="⏳ Processando...";const e=await y.initiateOperation(this.spyCountry,this.targetCountry,this.selectedLevel,this.selectedDuration,this.currentTurn);this.showResult(e),t.disabled=!1,t.textContent="🕵️ Iniciar Operação"}showResult(t){const e=this.modal.querySelector("#operation-result"),s=this.modal.querySelector("#result-icon"),i=this.modal.querySelector("#result-title"),n=this.modal.querySelector("#result-message");if(t.success&&t.succeeded){e.className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30",s.textContent="✅",i.textContent="Operação Bem-Sucedida!",i.className="font-bold text-lg mb-1 text-green-400";let o=`Sua operação de espionagem contra ${this.targetCountry.Pais} foi bem-sucedida! Você terá acesso às informações confidenciais pelos próximos ${this.selectedDuration} turnos.`;t.detected&&(o+=" ⚠️ No entanto, sua operação foi detectada pelo sistema de contra-espionagem deles."),n.textContent=o,n.className="text-sm text-green-300"}else if(t.success&&!t.succeeded){e.className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30",s.textContent="❌",i.textContent="Operação Falhou",i.className="font-bold text-lg mb-1 text-red-400";let o=`Sua tentativa de espionagem contra ${this.targetCountry.Pais} foi bloqueada. `;t.detected?o+="Pior ainda: sua operação foi detectada! Eles sabem que você tentou espiá-los.":o+="Felizmente, não foram detectados agentes seus na operação.",n.textContent=o,n.className="text-sm text-red-300"}else e.className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30",s.textContent="⚠️",i.textContent="Erro",i.className="font-bold text-lg mb-1 text-amber-400",n.textContent=t.error||"Ocorreu um erro ao processar a operação.",n.className="text-sm text-amber-300";e.classList.remove("hidden"),t.success&&setTimeout(()=>{this.hide(),window.location.reload()},5e3)}}const Ke=new Ge;function Pe(a,t){if(!a||!t)return;const e=parseFloat(a.CounterIntelligence)||0,i=y.calculateBudget(a)*(e/100);let n,o,r;e>=6?(n="Alta",o="green",r="🛡️"):e>=3?(n="Média",o="amber",r="🔒"):(n="Baixa",o="red",r="⚠️");const l=`
    <div class="mt-6 p-5 rounded-2xl border border-slate-700 bg-slate-800/40">
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🛡️</span>
          <div>
            <h4 class="text-lg font-bold text-slate-100">Contra-Espionagem</h4>
            <p class="text-xs text-slate-400">Proteja suas informações confidenciais</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-xs text-slate-400">Nível de Proteção</p>
          <div class="flex items-center gap-1 text-${o}-400">
            <span class="text-xl">${r}</span>
            <span class="font-bold text-lg">${n}</span>
          </div>
        </div>
      </div>

      <!-- Barra de investimento -->
      <div class="mb-4">
        <div class="flex items-center justify-between mb-2">
          <label for="counter-intel-slider" class="text-sm font-medium text-slate-300">
            Investimento: <span id="counter-intel-value" class="text-brand-400 font-bold">${e}%</span> do orçamento
          </label>
          <span id="counter-intel-cost" class="text-sm text-slate-400">${g(i)}/turno</span>
        </div>

        <input
          type="range"
          id="counter-intel-slider"
          min="0"
          max="10"
          step="0.5"
          value="${e}"
          class="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
        />

        <div class="flex justify-between text-xs text-slate-500 mt-1">
          <span>0%</span>
          <span>5%</span>
          <span>10%</span>
        </div>
      </div>

      <!-- Info sobre efeitos -->
      <div class="mb-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700">
        <p class="text-xs font-semibold text-slate-300 mb-2">Efeitos do Investimento:</p>
        <ul class="space-y-1.5 text-xs text-slate-400">
          <li class="flex items-start gap-2">
            <span class="text-${o}-400 mt-0.5">●</span>
            <span>Reduz <strong class="text-${o}-400">${Math.round(e*30)}%</strong> a chance de espionagem bem-sucedida</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-${o}-400 mt-0.5">●</span>
            <span>Chance de <strong class="text-${o}-400">${Math.round(e*5)}%</strong> de detectar tentativas de espionagem</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-${o}-400 mt-0.5">●</span>
            <span>Informações vazadas podem ser falsas/desatualizadas</span>
          </li>
        </ul>
      </div>

      <!-- Tentativas detectadas -->
      <div id="detected-attempts-container" class="mb-4">
        <p class="text-xs font-semibold text-slate-300 mb-2">🔍 Tentativas Recentes Detectadas</p>
        <div id="detected-attempts-list" class="space-y-2">
          <!-- Será preenchido dinamicamente -->
        </div>
      </div>

      <!-- Botões -->
      <div class="flex gap-2">
        <button
          id="save-counter-intel"
          class="flex-1 rounded-xl border border-brand-500/30 bg-brand-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-brand-400 transition"
        >
          💾 Salvar Configuração
        </button>
        <button
          id="refresh-attempts"
          class="rounded-xl border border-slate-600 bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-600 transition"
        >
          🔄
        </button>
      </div>

      <!-- Feedback -->
      <div id="counter-intel-feedback" class="hidden mt-3 p-3 rounded-lg">
        <p id="counter-intel-feedback-text" class="text-sm"></p>
      </div>
    </div>
  `;t.innerHTML=l,We(a),Be(a.id)}function We(a){const t=document.getElementById("counter-intel-slider"),e=document.getElementById("counter-intel-value"),s=document.getElementById("counter-intel-cost"),i=document.getElementById("save-counter-intel"),n=document.getElementById("refresh-attempts");!t||!e||!s||!i||(t.addEventListener("input",o=>{const r=parseFloat(o.target.value);e.textContent=`${r}%`;const c=y.calculateBudget(a)*(r/100);s.textContent=`${g(c)}/turno`}),i.addEventListener("click",async()=>{const o=parseFloat(t.value);i.disabled=!0,i.textContent="⏳ Salvando...";const r=await y.updateCounterIntelligence(a.id,o),l=document.getElementById("counter-intel-feedback"),c=document.getElementById("counter-intel-feedback-text");r.success?(l.className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30",c.className="text-sm text-green-300",c.textContent=`✅ Configuração salva! Nível de contra-espionagem: ${r.newValue}%`,a.CounterIntelligence=r.newValue,setTimeout(()=>{const p=document.getElementById("counter-intel-container");p&&Pe(a,p)},2e3)):(l.className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30",c.className="text-sm text-red-300",c.textContent=`❌ Erro ao salvar: ${r.error}`),l.classList.remove("hidden"),i.disabled=!1,i.textContent="💾 Salvar Configuração",setTimeout(()=>{l.classList.add("hidden")},5e3)}),n&&n.addEventListener("click",()=>{Be(a.id)}))}async function Be(a){const t=document.getElementById("detected-attempts-list");if(t){t.innerHTML='<p class="text-xs text-slate-400">⏳ Carregando...</p>';try{const e=await y.getSpyingAttempts(a);if(e.length===0){t.innerHTML=`
        <div class="p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-center">
          <p class="text-xs text-slate-400">✅ Nenhuma tentativa detectada recentemente</p>
        </div>
      `;return}e.sort((i,n)=>new Date(n.createdAt)-new Date(i.createdAt));const s=e.slice(0,5);t.innerHTML=s.map(i=>{const n=!i.succeeded,o=n?"🛡️":"⚠️",r=n?"BLOQUEADO":"SUCESSO",l=n?"green":"red",c=Math.max(0,i.startTurn);return`
        <div class="p-3 rounded-lg bg-slate-900/50 border border-${l}-500/30">
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <span>${o}</span>
              <span class="text-sm font-semibold text-slate-200">${i.spyCountryName}</span>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full bg-${l}-500/20 text-${l}-400 font-medium">
              ${r}
            </span>
          </div>
          <p class="text-xs text-slate-400">
            Nível: ${Ze[i.level]?.name||i.level} •
            Turno ${i.startTurn}
            ${i.active?` • Válido até turno ${i.validUntilTurn}`:""}
          </p>
        </div>
      `}).join("")}catch(e){console.error("Erro ao carregar tentativas:",e),t.innerHTML=`
      <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
        <p class="text-xs text-red-300">❌ Erro ao carregar tentativas</p>
      </div>
    `}}}const Ze={basic:{name:"Básica"},intermediate:{name:"Intermediária"},total:{name:"Total"}},E={tradecraft_basic:{id:"tradecraft_basic",name:"Tradecraft Básico",year:1954,era:1,icon:"🎓",description:"Treinamento formal em técnicas de agente: identidades falsas, contatos seguros, evasão, dead drops",flavorText:"Formação essencial para operações encobertas. Todo agente precisa dominar o básico.",effects:{humintSuccess:10,operativeDetectionReduction:5,fakeIdentitiesPerSemester:1},baseCost:5e8,prerequisites:[],minTechCivil:15,researchTime:1,category:"humint"},sigint_radio:{id:"sigint_radio",name:"Interceptação de Rádio",year:1955,era:1,icon:"📡",description:"Equipamentos para escutar comunicações rádio inimigas e catalogar tráfego",flavorText:"As ondas de rádio carregam segredos. Quem souber ouvir, terá vantagem.",effects:{sigintIntel:15,revealsMovements:!0},baseCost:75e7,prerequisites:["tradecraft_basic"],minTechCivil:20,researchTime:1,category:"sigint"},counter_recon_passive:{id:"counter_recon_passive",name:"Contra-Reconhecimento Passivo",year:1956,era:1,icon:"🛡️",description:"Unidades de contra-espionagem, triagem de suspeitos, segurança em instalações",flavorText:"Vigilância constante. Todo visitante é um suspeito em potencial.",effects:{passiveDetection:20,sabotageReduction:15,detectorsPerProvince:1},baseCost:1e9,prerequisites:["tradecraft_basic"],minTechCivil:20,researchTime:1,category:"counterintel"},crypto_field:{id:"crypto_field",name:"Criptografia de Campo",year:1957,era:1,icon:"🔐",description:"Sistemas de cifra para comunicações (one-time pad limitado, rolos de cifra)",flavorText:"Mensagens que só os destinatários podem ler. A primeira linha de defesa.",effects:{enemyInterceptionReduction:25,secureCommunications:!0},baseCost:85e7,prerequisites:["sigint_radio"],minTechCivil:25,researchTime:1,category:"sigint"},sabotage_industrial:{id:"sabotage_industrial",name:"Sabotagem Industrial",year:1958,era:2,icon:"💣",description:"Técnicas para atacar instalações industriais (incêndios, sabotagem, contaminação)",flavorText:"Destruição silenciosa. Uma fábrica parada vale mais que mil soldados.",effects:{sabotageEnabled:!0,productionReduction:25,sabotageSuccessBase:35,diplomaticRisk:"high"},baseCost:125e7,prerequisites:["tradecraft_basic","sigint_radio"],minTechCivil:30,researchTime:2,category:"covert_ops"},direction_finding:{id:"direction_finding",name:"Direction Finding",year:1959,era:2,icon:"📍",description:"Triangulação de transmissores rádio e localização de estações clandestinas",flavorText:"Toda transmissão deixa rastros. Nós seguimos esses rastros.",effects:{locateTransmissions:30,identificationSpeed:50,captureRadioOperatives:!0},baseCost:18e4,prerequisites:["sigint_radio"],minTechCivil:30,researchTime:1,category:"sigint"},psychological_warfare:{id:"psychological_warfare",name:"Guerra Psicológica",year:1960,era:2,icon:"🎭",description:"Propaganda, emissoras clandestinas, panfletagem, apoio a grupos de oposição",flavorText:"Vencer mentes é mais eficaz que vencer batalhas.",effects:{influenceIdeology:!0,sowDissent:!0,stabilityReduction:[8,15],languageBonus:!0},baseCost:15e8,prerequisites:["tradecraft_basic","crypto_field"],minTechCivil:35,researchTime:2,category:"covert_ops"},forensic_tactical:{id:"forensic_tactical",name:"Forense Tático",year:1961,era:2,icon:"🔬",description:"Investigação para rastrear explosivos, materiais e descobrir autoria de sabotagens",flavorText:"Todo crime deixa evidências. Nós as encontramos.",effects:{identifyAuthors:25,sabotageEffectReduction:50,forensicAnalysis:!0},baseCost:1e9,prerequisites:["counter_recon_passive"],minTechCivil:35,researchTime:1,category:"counterintel"},cryptanalysis:{id:"cryptanalysis",name:"Criptoanálise",year:1962,era:2,icon:"🔓",description:"Quebrar cifras de nível campo (análise estatística, máquinas de apoio)",flavorText:"Nenhum código é inquebrável. Apenas uma questão de tempo e recursos.",effects:{breakCodes:!0,passiveIntel:30,duration:30,requiresMaintenance:!0},baseCost:175e7,prerequisites:["crypto_field","sigint_radio"],minTechCivil:40,researchTime:2,category:"sigint"},recruitment_native:{id:"recruitment_native",name:"Recrutamento de Nativos",year:1963,era:3,icon:"👥",description:"Recrutar agentes locais com aparência e contatos genuínos",flavorText:"O melhor espião é aquele que pertence ao lugar.",effects:{recruitmentSuccess:35,nativeDetectionReduction:15,intelBonus:20},baseCost:22e4,prerequisites:["tradecraft_basic"],minTechCivil:40,researchTime:2,category:"humint"},interrogation_advanced:{id:"interrogation_advanced",name:"Interrogatório Avançado",year:1964,era:3,icon:"🗣️",description:"Métodos formais para extrair informação de operativos capturados",flavorText:"Todo homem tem um ponto de quebra. Nossa função é encontrá-lo.",effects:{intelFromCaptured:50,identifyNetworks:!0,reputationCost:-5},baseCost:18e4,prerequisites:["forensic_tactical"],minTechCivil:40,researchTime:1,category:"counterintel"},wiretap:{id:"wiretap",name:"Escutas Telefônicas",year:1965,era:3,icon:"📞",description:"Interceptação telefônica em grande escala, técnicas para ocultar escutas",flavorText:"Toda ligação é uma confissão esperando para ser gravada.",effects:{wiretapEnabled:!0,internalCommsIntel:35,generatesEvidence:!0,requiresInsiders:!0},baseCost:28e4,prerequisites:["sigint_radio","forensic_tactical"],minTechCivil:45,researchTime:2,category:"sigint"},sabotage_naval:{id:"sabotage_naval",name:"Sabotagem Naval",year:1966,era:3,icon:"⚓",description:"Técnicas contra infraestrutura naval: minas improvisadas, sabotagem em docas",flavorText:"Controlar os mares começa nos portos.",effects:{harborSabotage:!0,supplyReduction:35,portSecurityDependent:!0},baseCost:32e4,prerequisites:["sabotage_industrial","direction_finding"],minTechCivil:50,researchTime:2,category:"covert_ops"},surveillance_electronic:{id:"surveillance_electronic",name:"Vigilância Eletrônica",year:1967,era:3,icon:"📹",description:"Câmeras simples, microfones escondidos, rastreadores mecânicos",flavorText:"Olhos e ouvidos em todo lugar. Nada passa despercebido.",effects:{defensiveOpsBonus:25,detectMeetings:25,plantDevice:!0},baseCost:2e9,prerequisites:["wiretap","forensic_tactical"],minTechCivil:50,researchTime:2,category:"counterintel"},double_agents:{id:"double_agents",name:"Contra-Inteligência Ativa",year:1968,era:4,icon:"🎭",description:"Manipular agentes capturados para alimentar desinformação",flavorText:"O maior trunfo é fazer o inimigo acreditar em suas próprias mentiras.",effects:{turnAgent:!0,feedFalseIntel:!0,enemyPlanningReduction:30,exposureRisk:"high"},baseCost:225e7,prerequisites:["interrogation_advanced","cryptanalysis"],minTechCivil:55,researchTime:3,category:"counterintel"},biometrics_id:{id:"biometrics_id",name:"Sistemas de Identificação",year:1969,era:4,icon:"🆔",description:"Sistema centralizado: fotos, impressões digitais, controle de fronteiras",flavorText:"Conhecer cada rosto, cada impressão digital. Controle total.",effects:{enemyMobilityReduction:35,fakeIdDifficulty:50,borderDetection:25},baseCost:45e4,prerequisites:["surveillance_electronic","recruitment_native"],minTechCivil:60,researchTime:2,category:"counterintel"},crypto_automation:{id:"crypto_automation",name:"Automação Cripto & Fusão de Sinais",year:1970,era:4,icon:"🖥️",description:"Mainframes iniciais, fusão de dados, alertas em tempo real",flavorText:"A era da computação. Processamento que humanos jamais alcançariam.",effects:{decryptionSpeedBonus:40,sigintIntelBonus:20,realTimeAlerts:!0},baseCost:25e8,prerequisites:["cryptanalysis","direction_finding","wiretap","surveillance_electronic"],minTechCivil:65,researchTime:3,category:"sigint"}},L={CRITICAL_FAILURE:{range:[1,3],name:"Falha Crítica",icon:"💥",costLoss:.5,waitTurns:2,message:"Projeto comprometido! Recursos perdidos e pesquisa suspensa."},FAILURE:{range:[4,6],name:"Falha",icon:"❌",costLoss:.25,waitTurns:1,message:"Pesquisa falhou. Recursos parcialmente perdidos."},PARTIAL_SUCCESS:{range:[7,9],name:"Sucesso Parcial",icon:"⚠️",progress:50,waitTurns:0,message:"Progresso parcial (50%). Continue no próximo turno."},TOTAL_SUCCESS:{range:[10,12],name:"Sucesso Total",icon:"✅",unlocked:!0,waitTurns:0,message:"Sucesso! Tecnologia desbloqueada."}};class Ye{constructor(){this.activeResearches=new Map}calculateModifiers(t,e,s){let i=0;const n=parseFloat(s.TecnologiaCivil)||parseFloat(s.Tecnologia)||0;n>60&&(i+=1),n<30&&(i-=2),(t.tier==="powerful"||t.tier==="elite")&&(i+=1);const o=this.getRelatedTechnologies(e.id,t.technologies);o>=2?i+=2:o>=1&&(i+=1);const r=e.category;return(t.focus==="external_espionage"&&(r==="humint"||r==="sigint")||t.focus==="counterintelligence"&&r==="counterintel"||t.focus==="covert_operations"&&r==="covert_ops")&&(i+=1),i}getRelatedTechnologies(t,e){const s=E[t];if(!s)return 0;let i=0;return s.prerequisites.forEach(n=>{e.includes(n)&&i++}),Object.values(E).forEach(n=>{n.category===s.category&&e.includes(n.id)&&n.id!==t&&i++}),i}rollD12(t=0){const e=Math.floor(Math.random()*12)+1,s=e+t;return{baseRoll:e,modifiers:t,finalRoll:Math.max(1,s)}}determineResult(t){const e=t.finalRoll;return e<=3?L.CRITICAL_FAILURE:e<=6?L.FAILURE:e<=9?L.PARTIAL_SUCCESS:L.TOTAL_SUCCESS}checkPrerequisites(t,e){const s=E[t];if(!s)return{valid:!1,missing:[]};const i=s.prerequisites.filter(n=>!e.includes(n));return{valid:i.length===0,missing:i.map(n=>E[n]?.name||n)}}checkTechCivil(t,e){const s=E[t];return s?(parseFloat(e.TecnologiaCivil)||parseFloat(e.Tecnologia)||0)>=s.minTechCivil:!1}async startResearch(t,e,s,i){try{const n=await b.collection("agencies").doc(t).get();if(!n.exists)return{success:!1,error:"Agência não encontrada!"};const o=n.data();if(o.currentResearch&&o.currentResearch.techId)return{success:!1,error:"Já existe uma pesquisa em andamento!"};const r=E[e];if(!r)return{success:!1,error:"Tecnologia não encontrada!"};if(o.technologies&&o.technologies.includes(e))return{success:!1,error:"Esta tecnologia já foi desbloqueada!"};const l=this.checkPrerequisites(e,o.technologies||[]);if(!l.valid)return{success:!1,error:`Pré-requisitos não atendidos: ${l.missing.join(", ")}`};if(!this.checkTechCivil(e,s))return{success:!1,error:`Tecnologia Civil insuficiente! Necessário: ${r.minTechCivil}%`};const c=$.calculateCostByPIB(r.baseCost,s);if(o.budget<c)return{success:!1,error:"Orçamento da agência insuficiente!"};const p={techId:e,techName:r.name,progress:0,startedTurn:i,rollsAttempted:0,cost:c,totalSpent:0};await b.collection("agencies").doc(t).update({currentResearch:p});const u=parseFloat(s.OrcamentoGasto||0);return await b.collection("paises").doc(s.id).update({OrcamentoGasto:u+c}),{success:!0,research:p,tech:r,cost:c,budgetSpent:c}}catch(n){return console.error("Erro ao iniciar pesquisa:",n),{success:!1,error:"Erro ao processar pesquisa: "+n.message}}}async attemptResearch(t,e,s){try{const i=await b.collection("agencies").doc(t).get();if(!i.exists)return{success:!1,error:"Agência não encontrada!"};const n=i.data();if(!n.currentResearch||!n.currentResearch.techId)return{success:!1,error:"Nenhuma pesquisa em andamento!"};const o=n.currentResearch,r=E[o.techId],l=this.calculateModifiers(n,r,e),c=this.rollD12(l),p=this.determineResult(c),u=o.cost*(p.costLoss||0);let m={"currentResearch.rollsAttempted":o.rollsAttempted+1,"currentResearch.totalSpent":o.totalSpent+u};if(p.unlocked)m={technologies:[...n.technologies||[],o.techId],currentResearch:null},r.category==="humint"&&(m.operatives=(n.operatives||0)+5);else if(p.progress){const v=(o.progress||0)+p.progress;v>=100?(m={technologies:[...n.technologies||[],o.techId],currentResearch:null},r.category==="humint"&&(m.operatives=(n.operatives||0)+5)):m["currentResearch.progress"]=v}else p===L.CRITICAL_FAILURE&&(m["currentResearch.progress"]=Math.max(0,(o.progress||0)-25));return await updateDoc(agencyRef,m),{success:!0,roll:c,result:p,cost:u,unlocked:p.unlocked||!1,tech:r}}catch(i){return console.error("Erro ao tentar pesquisa:",i),{success:!1,error:"Erro ao processar tentativa: "+i.message}}}async cancelResearch(t){try{const e=doc(b,"agencies",t);return await b.collection("agencies").doc(t).update({currentResearch:null}),{success:!0}}catch(e){return console.error("Erro ao cancelar pesquisa:",e),{success:!1,error:e.message}}}getAllTechnologies(){return E}getTechnologiesByEra(t){return Object.values(E).filter(e=>e.era===t)}getAvailableTechnologies(t,e){const s=parseFloat(e.TecnologiaCivil)||parseFloat(e.Tecnologia)||0;return Object.values(E).filter(i=>!(t.includes(i.id)||!i.prerequisites.every(o=>t.includes(o))||s<i.minTechCivil))}}const q=new Ye,F={low:{name:"Baixa",icon:"🟢",color:"green",baseCost:1e5},medium:{name:"Média",icon:"🟡",color:"amber",baseCost:2e5},high:{name:"Alta",icon:"🔴",color:"red",baseCost:3e5},critical:{name:"Crítica",icon:"⚫",color:"purple",baseCost:5e5}},Te=["Instalações Militares","Telecomunicações","Infraestrutura Crítica","Governo Central","Indústria de Defesa","Pesquisa e Desenvolvimento","Inteligência Nacional","Fronteiras","Portos e Aeroportos"];class Je{constructor(){this.alerts=new Map}determineSeverity(t){const e=t.phase||1;return e===1?"low":e===2?"medium":e===3?"high":"critical"}determineAffectedSector(){return Te[Math.floor(Math.random()*Te.length)]}async createSecurityAlert(t,e,s,i=20){try{const n=this.determineSeverity(t),o=this.determineAffectedSector(),r={targetCountryId:t.targetCountryId,targetCountryName:t.targetCountryName,spyCountryId:i>=80?t.spyCountryId:null,spyCountryName:i>=80?t.spyCountryName:null,spyAgencyId:i>=100?t.agencyId:null,operationId:t.id||null,detectedTurn:s,severity:n,severityName:F[n].name,sector:o,exposureLevel:i,status:"pending",investigation:{started:!1,startedTurn:null,cost:null,result:null,rollResult:null},revealed:null,createdAt:new Date().toISOString()},l=await ze(G(b,"security_alerts"),r);return{success:!0,alert:{...r,id:l.id}}}catch(n){return console.error("Erro ao criar alerta:",n),{success:!1,error:n.message}}}calculateInvestigationCost(t,e){const i=F[t.severity].baseCost;return $.calculateCostByPIB(i,e)}calculateInvestigationModifiers(t,e,s){let i=0;return t.technologies&&(t.technologies.includes("forensic_tactical")&&(i+=2),t.technologies.includes("surveillance_electronic")&&(i+=2),t.technologies.includes("double_agents")&&(i+=3),t.technologies.includes("biometrics_id")&&(i+=2)),(t.tier==="powerful"||t.tier==="elite")&&(i+=1),t.focus==="counterintelligence"&&(i+=2),(parseFloat(s.TecnologiaCivil)||parseFloat(s.Tecnologia)||0)>60&&(i+=1),(parseFloat(s.Urbanizacao)||0)>70&&(i+=1),(e.severity==="high"||e.severity==="critical")&&(i+=1),i}rollInvestigation(t=0){const e=Math.floor(Math.random()*12)+1,s=e+t;return{baseRoll:e,modifiers:t,finalRoll:Math.max(1,s)}}determineInvestigationResult(t,e,s){const i=t.finalRoll;return i<=3?{success:!1,critical:!0,level:"CRITICAL_FAILURE",message:"Investigação comprometida! Suspeitos alertados e fugiram.",revealed:null,penalty:"Espionagem inimiga acelera (próxima fase em -1 turno)",actions:[]}:i<=6?{success:!1,level:"FAILURE",message:"Investigação não encontrou evidências conclusivas.",revealed:{level:"VAGUE",info:"Possível origem: "+this.getVagueRegion(s)},actions:[]}:i<=9?{success:!0,level:"PARTIAL",message:"Investigação revelou informações parciais.",revealed:{level:"PARTIAL",region:this.getRegion(s),operativesCount:`estimativa: ${s.operativesDeployed-2}-${s.operativesDeployed+2}`,phase:je[s.phase]?.name||"Desconhecida",info:`País suspeito está na região: ${this.getRegion(s)}`},bonus:"+20% detecção contra suspeitos por 3 turnos",actions:["AUMENTAR_VIGILANCIA"]}:{success:!0,level:"COMPLETE",message:"Rede de espionagem identificada e neutralizada!",revealed:{level:"COMPLETE",spyCountry:s.spyCountryName,spyAgency:s.agencyId,operativesCount:s.operativesDeployed,phase:s.phase,coverIdentities:s.coverIdentities,startedTurn:s.startedTurn,info:`${s.spyCountryName} está operando espionagem contra você!`},bonus:"Operativos capturados",actions:["DENUNCIAR_PUBLICAMENTE","CAPTURAR_OPERATIVOS","VIRAR_AGENTES","EXPULSAR_DIPLOMATAS","NEGOCIAR_SECRETO","RETALIACAO_ENCOBERTA"]}}async investigateAlert(t,e,s,i){try{const n=ye(b,"security_alerts",t),o=await Ce(n);if(!o.exists())return{success:!1,error:"Alerta não encontrado!"};const r=o.data();if(r.investigation.started)return{success:!1,error:"Este alerta já está sendo investigado!"};const l=this.calculateInvestigationCost(r,s);if(e.budget<l)return{success:!1,error:"Orçamento da agência insuficiente!"};let c=null;if(r.operationId){const v=await Ce(ye(b,"espionage_operations",r.operationId));v.exists()&&(c=v.data())}const p=this.calculateInvestigationModifiers(e,r,s),u=this.rollInvestigation(p),m=this.determineInvestigationResult(u,r,c);return await He(n,{"investigation.started":!0,"investigation.startedTurn":i,"investigation.cost":l,"investigation.rollResult":u,"investigation.result":m.level,revealed:m.revealed,status:m.success?"resolved":"investigated"}),{success:!0,roll:u,result:m,cost:l}}catch(n){return console.error("Erro ao investigar alerta:",n),{success:!1,error:n.message}}}async getCountryAlerts(t,e="pending"){try{const s=we(G(b,"security_alerts"),K("targetCountryId","==",t),K("status","==",e));return(await Ie(s)).docs.map(n=>({id:n.id,...n.data()}))}catch(s){return console.error("Erro ao buscar alertas:",s),[]}}async getAllCountryAlerts(t){try{const e=we(G(b,"security_alerts"),K("targetCountryId","==",t)),i=(await Ie(e)).docs.map(n=>({id:n.id,...n.data()}));return i.sort((n,o)=>new Date(o.createdAt)-new Date(n.createdAt)),i}catch(e){return console.error("Erro ao buscar todos os alertas:",e),[]}}getVagueRegion(t){const e=["América do Sul","América do Norte","Europa Ocidental","Europa Oriental","Ásia","África","Oriente Médio"];return e[Math.floor(Math.random()*e.length)]}getRegion(t){return this.getVagueRegion(t)}getSeverityLevels(){return F}}const Q=new Je;function Qe(a,t,e){if(!e||!a)return;const s=`
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">🚨</span>
          <div>
            <h4 class="text-lg font-bold text-slate-100">Alertas de Segurança</h4>
            <p class="text-xs text-slate-400">Ameaças detectadas pela contra-espionagem</p>
          </div>
        </div>
        <button id="refresh-alerts-btn" class="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition">
          🔄 Atualizar
        </button>
      </div>

      <!-- Alertas Pendentes -->
      <div id="pending-alerts-container">
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-semibold text-slate-200">⚠️ Alertas Ativos</h5>
          <span id="pending-count-badge" class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">0</span>
        </div>
        <div id="pending-alerts-list" class="space-y-3">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>

      <!-- Alertas Resolvidos -->
      <div id="resolved-alerts-container" class="mt-6">
        <div class="flex items-center justify-between mb-3">
          <h5 class="text-sm font-semibold text-slate-200">📊 Investigações Concluídas</h5>
          <span id="resolved-count-badge" class="px-2 py-0.5 rounded-full bg-slate-600 text-slate-300 text-xs font-bold">0</span>
        </div>
        <div id="resolved-alerts-list" class="space-y-3">
          <!-- Preenchido dinamicamente -->
        </div>
      </div>
    </div>
  `;e.innerHTML=s,X(a,t)}async function X(a,t){const e=document.getElementById("pending-alerts-list"),s=document.getElementById("resolved-alerts-list"),i=document.getElementById("pending-count-badge"),n=document.getElementById("resolved-count-badge");if(!e||!s)return;e.innerHTML='<p class="text-sm text-slate-400">⏳ Carregando alertas...</p>',s.innerHTML='<p class="text-sm text-slate-400">⏳ Carregando...</p>';try{const r=await Q.getAllCountryAlerts(a.id),l=r.filter(u=>u.status==="pending"),c=r.filter(u=>u.status==="resolved"||u.status==="investigated");i.textContent=l.length,n.textContent=c.length,l.length===0?e.innerHTML=`
        <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p class="text-sm text-emerald-300">✅ Nenhuma ameaça ativa detectada</p>
        </div>
      `:(e.innerHTML=l.map(u=>Xe(u,t,a)).join(""),tt(a,t));const p=c.slice(0,5);p.length===0?s.innerHTML=`
        <div class="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <p class="text-sm text-slate-400">Nenhuma investigação concluída ainda</p>
        </div>
      `:s.innerHTML=p.map(u=>et(u)).join("")}catch(r){console.error("Erro ao carregar alertas:",r),e.innerHTML='<p class="text-sm text-red-400">❌ Erro ao carregar alertas</p>'}const o=document.getElementById("refresh-alerts-btn");o&&o.addEventListener("click",()=>X(a,t))}function Xe(a,t,e){const s=F[a.severity],i=Q.calculateInvestigationCost(a,e);return`
    <div class="p-4 rounded-xl border border-${s.color}-500/30 bg-${s.color}-500/10">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">${s.icon}</span>
          <div>
            <h6 class="font-semibold text-slate-100">Espionagem Detectada</h6>
            <p class="text-xs text-slate-400">Turno #${a.detectedTurn}</p>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded-full bg-${s.color}-500/20 text-${s.color}-400 text-xs font-bold">
          ${s.name}
        </span>
      </div>

      <div class="space-y-2 mb-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Setor afetado:</span>
          <span class="text-slate-200 font-medium">${a.sector}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Nível de exposição:</span>
          <span class="text-${s.color}-400 font-medium">${a.exposureLevel}%</span>
        </div>
      </div>

      <p class="text-xs text-slate-400 mb-3 p-2 bg-slate-900/50 rounded">
        Nossa contra-espionagem detectou atividade suspeita que pode indicar operação estrangeira em território nacional.
      </p>

      <div class="flex gap-2">
        <button
          class="investigate-btn flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition"
          data-alert-id="${a.id}"
          data-cost="${i}"
        >
          🔍 Investigar - ${g(i)}
        </button>
        <button class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition">
          Ignorar
        </button>
      </div>
    </div>
  `}function et(a){const t=a.investigation||{},e=t.result;let s="✅",i="Investigação Concluída",n="green";e==="CRITICAL_FAILURE"?(s="💥",i="Falha Crítica",n="red"):e==="FAILURE"?(s="❌",i="Falha",n="red"):e==="PARTIAL"?(s="⚠️",i="Sucesso Parcial",n="amber"):e==="COMPLETE"&&(s="🎯",i="Sucesso Total",n="green");const o=a.revealed||{};return`
    <div class="p-4 rounded-xl border border-${n}-500/30 bg-${n}-500/10">
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xl">${s}</span>
          <div>
            <h6 class="font-semibold text-${n}-300">${i}</h6>
            <p class="text-xs text-slate-400">Turno #${t.startedTurn||a.detectedTurn}</p>
          </div>
        </div>
      </div>

      ${o.level==="COMPLETE"?`
        <div class="mt-3 p-3 rounded-lg bg-slate-900/50 border border-slate-700">
          <p class="text-sm font-semibold text-red-300 mb-2">🚨 ${o.spyCountry} identificado!</p>
          <div class="space-y-1 text-xs text-slate-400">
            <p>• Operativos: ${o.operativesCount}</p>
            <p>• Fase: ${o.phase}</p>
            <p>• Iniciado: Turno #${o.startedTurn}</p>
          </div>
          <div class="mt-3 flex gap-2">
            <button class="flex-1 px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold transition">
              📢 Denunciar
            </button>
            <button class="flex-1 px-3 py-1.5 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold transition">
              🔄 Virar Agentes
            </button>
          </div>
        </div>
      `:o.level==="PARTIAL"?`
        <p class="text-xs text-amber-300 mt-2">${o.info}</p>
      `:`
        <p class="text-xs text-slate-400 mt-2">Investigação inconclusiva</p>
      `}
    </div>
  `}function tt(a,t){document.querySelectorAll(".investigate-btn").forEach(s=>{s.addEventListener("click",async i=>{const n=i.currentTarget.dataset.alertId,o=parseInt(i.currentTarget.dataset.cost);if(confirm(`Investigar esta ameaça custará ${g(o)}. Confirmar?`)){s.disabled=!0,s.textContent="⏳ Investigando...";try{const r=window.appState?.currentTurn||0,l=await Q.investigateAlert(n,t,a,r);l.success?(at(l),setTimeout(()=>{X(a,t)},3e3)):(alert("Erro: "+l.error),s.disabled=!1,s.textContent=`🔍 Investigar - ${g(o)}`)}catch(r){console.error("Erro ao investigar:",r),alert("Erro ao processar investigação"),s.disabled=!1,s.textContent=`🔍 Investigar - ${g(o)}`}}})})}function at(a){const{roll:t,result:e,cost:s}=a;let i=`
🎲 Rolagem: ${t.baseRoll} + ${t.modifiers} = ${t.finalRoll}

${e.message}

Custo: ${g(s)}
  `;e.revealed&&e.revealed.spyCountry&&(i+=`

🚨 PAÍS IDENTIFICADO: ${e.revealed.spyCountry}`),alert(i)}async function st(){try{return(await window.db.collection("paises").get()).docs.map(t=>({id:t.id,...t.data()}))}catch(a){return console.error("Erro ao buscar países:",a),[]}}async function A(a,t){if(!t||!a)return;const e=await $.getAgency(a.id);if(!e){t.innerHTML=`
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">🕵️</span>
        <h3 class="text-2xl font-bold text-slate-100 mb-2">Agência de Inteligência</h3>
        <p class="text-slate-400 mb-6">Você ainda não possui uma agência de inteligência.</p>
        <button id="open-agency-foundation" class="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold transition">
          🕵️ Fundar Agência
        </button>
      </div>
    `;const i=document.getElementById("open-agency-foundation");i&&i.addEventListener("click",()=>{De(()=>import("./agencyFoundationModal-DgXwoUyD.js"),__vite__mapDeps([0,1,2,3])).then(n=>{const o=window.appState?.currentTurn||0;n.default.show(a,o)})});return}const s=`
    <div class="space-y-6">
      <!-- Header da Agência -->
      <div class="p-6 rounded-2xl border border-slate-700 bg-slate-800/40">
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <span class="text-5xl">🕵️</span>
            <div>
              <h3 class="text-2xl font-bold text-slate-100">${e.name}</h3>
              <p class="text-sm text-slate-400">${e.focusName}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-3xl">${$.getTiers()[e.tier].icon}</span>
              <span class="text-xl font-bold text-brand-400">${e.tierName}</span>
            </div>
            <p class="text-xs text-slate-500">Fundada: Turno #${e.foundedTurn}</p>
          </div>
        </div>

        <!-- Status -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition cursor-pointer" id="budget-card">
            <p class="text-xs text-slate-400 mb-1">Orçamento Anual</p>
            <p class="text-lg font-bold text-emerald-400">${g(e.budget)}</p>
            <p class="text-xs text-slate-500">${e.budgetPercent}% do nacional</p>
            <button class="mt-2 text-xs text-brand-400 hover:text-brand-300 font-semibold">✏️ Alterar</button>
          </div>
          <div class="p-3 rounded-lg bg-slate-900/50">
            <p class="text-xs text-slate-400 mb-1">Tecnologias</p>
            <p class="text-lg font-bold text-cyan-400">${(e.technologies||[]).length}</p>
            <p class="text-xs text-slate-500">Desbloqueadas</p>
          </div>
          <div class="p-3 rounded-lg bg-slate-900/50">
            <p class="text-xs text-slate-400 mb-1">Operações Ativas</p>
            <p class="text-lg font-bold text-purple-400" id="active-ops-count">0</p>
            <p class="text-xs text-slate-500">Em andamento</p>
          </div>
          <div class="p-3 rounded-lg bg-slate-900/50">
            <p class="text-xs text-slate-400 mb-1">Operativos</p>
            <p class="text-lg font-bold text-blue-400">${e.operatives||0}</p>
            <p class="text-xs text-slate-500">Disponíveis</p>
          </div>
        </div>
      </div>

      <!-- Tabs de Navegação -->
      <div class="flex gap-2 border-b border-slate-700">
        <button class="agency-tab px-4 py-2 text-sm font-semibold transition border-b-2 border-brand-500 text-brand-400" data-tab="research">
          🔬 Pesquisa
        </button>
        <button class="agency-tab px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition border-b-2 border-transparent" data-tab="operations">
          🌍 Operações
        </button>
        <button class="agency-tab px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 transition border-b-2 border-transparent" data-tab="security">
          🛡️ Segurança
        </button>
      </div>

      <!-- Conteúdo das Tabs -->
      <div id="agency-tab-content">
        <!-- Preenchido dinamicamente -->
      </div>
    </div>
  `;t.innerHTML=s,it(e),Se(e,a),nt(e,a),pt(e,a)}async function it(a){const t=await k.getAgencyOperations(a.id),e=document.getElementById("active-ops-count");e&&(e.textContent=t.length)}function nt(a,t){const e=document.querySelectorAll(".agency-tab");e.forEach(s=>{s.addEventListener("click",i=>{const n=i.currentTarget.dataset.tab;e.forEach(o=>{o.classList.remove("border-brand-500","text-brand-400"),o.classList.add("border-transparent","text-slate-400")}),i.currentTarget.classList.add("border-brand-500","text-brand-400"),i.currentTarget.classList.remove("border-transparent","text-slate-400"),n==="research"?Se(a,t):n==="operations"?Ae(a,t):n==="security"&&lt(a,t)})})}function Se(a,t){const e=document.getElementById("agency-tab-content");if(!e)return;const s=a.currentResearch,i=q.getAvailableTechnologies(a.technologies||[],t);let n="";if(s&&s.techId){const o=q.getAllTechnologies()[s.techId];n=`
      <div class="p-4 rounded-xl border border-brand-500/30 bg-brand-500/10 mb-6">
        <h5 class="font-semibold text-brand-300 mb-2">🔬 Pesquisa em Andamento</h5>
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-lg font-bold text-slate-100">${o.name}</p>
            <p class="text-sm text-slate-400 mb-2">${o.description}</p>
            <div class="flex items-center gap-4 text-sm">
              <span class="text-slate-400">Progresso: <span class="text-brand-400 font-semibold">${s.progress||0}%</span></span>
              <span class="text-slate-400">Tentativas: <span class="text-slate-300">${s.rollsAttempted||0}</span></span>
            </div>
          </div>
          <button id="attempt-research-btn" class="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition">
            🎲 Tentar Pesquisa
          </button>
        </div>
      </div>
    `}e.innerHTML=n+`
    <h5 class="text-sm font-semibold text-slate-200 mb-3">📚 Tecnologias Disponíveis</h5>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      ${i.map(o=>`
        <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
          <div class="flex items-start gap-3 mb-3">
            <span class="text-2xl">${o.icon}</span>
            <div class="flex-1">
              <h6 class="font-semibold text-slate-100">${o.name}</h6>
              <p class="text-xs text-slate-400">${o.year} • ${o.category.toUpperCase()}</p>
            </div>
          </div>
          <p class="text-xs text-slate-400 mb-3">${o.description}</p>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-500">Custo: ${g($.calculateCostByPIB(o.baseCost,t))}</span>
            <button class="start-research-btn px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 text-xs font-semibold transition" data-tech-id="${o.id}">
              Pesquisar
            </button>
          </div>
        </div>
      `).join("")}
    </div>

    ${i.length===0?'<p class="text-sm text-slate-400 text-center py-8">Nenhuma tecnologia disponível no momento. Desbloqueie pré-requisitos!</p>':""}
  `,s&&dt(a,t),ct(a,t)}async function Ae(a,t){const e=document.getElementById("agency-tab-content");if(e){e.innerHTML=`
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-3"></div>
      <p class="text-sm text-slate-400">Carregando operações...</p>
    </div>
  `;try{const s=await k.getAgencyOperations(a.id),i=await st(),n=i.filter(o=>o.id!==t.id);e.innerHTML=`
      <div class="space-y-6">
        <!-- Botão Iniciar Nova Operação -->
        <div class="flex justify-between items-center">
          <div>
            <h5 class="text-lg font-semibold text-slate-200">🌍 Operações Ativas</h5>
            <p class="text-xs text-slate-400">${s.length} operação(ões) em andamento</p>
          </div>
          <button id="start-new-operation-btn" class="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition">
            + Nova Operação
          </button>
        </div>

        <!-- Lista de Operações Ativas -->
        <div id="operations-list" class="space-y-3">
          ${s.length===0?`
            <div class="text-center py-12 border border-dashed border-slate-700 rounded-xl">
              <span class="text-4xl mb-3 block">🕵️</span>
              <p class="text-slate-400">Nenhuma operação ativa</p>
              <p class="text-xs text-slate-500 mt-2">Inicie uma nova operação de infiltração</p>
            </div>
          `:s.map(o=>ot(o,i)).join("")}
        </div>

        <!-- Modal de Nova Operação (oculto) -->
        <div id="new-operation-modal" class="hidden fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4 p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-xl font-bold text-slate-100">🌍 Iniciar Nova Operação</h4>
              <button id="close-operation-modal" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="text-sm font-semibold text-slate-200 mb-2 block">País Alvo</label>
                <select id="target-country-select" class="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100">
                  <option value="">Selecione um país...</option>
                  ${n.map(o=>`
                    <option value="${o.id}">${o.Pais}</option>
                  `).join("")}
                </select>
              </div>

              <div id="target-country-info" class="hidden p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                <!-- Info do país alvo será preenchida -->
              </div>

              <div class="flex gap-3">
                <button id="cancel-operation-btn" class="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
                  Cancelar
                </button>
                <button id="confirm-operation-btn" disabled class="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Iniciar Infiltração
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,rt(a,t,n)}catch(s){console.error("Erro ao carregar operações:",s),e.innerHTML=`
      <div class="text-center py-12">
        <span class="text-4xl text-red-400 mb-4 block">❌</span>
        <p class="text-red-300">Erro ao carregar operações</p>
        <p class="text-sm text-slate-400 mt-2">${s.message}</p>
      </div>
    `}}}function ot(a,t){const e=t.find(r=>r.id===a.targetCountryId),s=k.getPhases(),i=a.phase||1,n=s[i]?.name||"Fase Desconhecida",o=s[i]?.icon||"❓";return`
    <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h6 class="font-semibold text-slate-100">${e?.Pais||"País Desconhecido"}</h6>
          <p class="text-xs text-slate-400">Iniciado: Turno #${a.startedTurn}</p>
        </div>
        <span class="px-2 py-1 rounded text-xs font-semibold ${a.active?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}">
          ${a.active?"Ativa":"Inativa"}
        </span>
      </div>

      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">${o}</span>
        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-200">Fase ${i}/4: ${n}</p>
          <div class="w-full bg-slate-700 rounded-full h-2 mt-1">
            <div class="bg-brand-500 h-2 rounded-full transition-all" style="width: ${i/4*100}%"></div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between text-xs">
        <span class="text-slate-400">Intel: <span class="text-brand-400 font-semibold">${a.intelLevel||0}%</span></span>
        <span class="text-slate-400">Detecção: <span class="${a.detectionRisk>50?"text-red-400":"text-green-400"} font-semibold">${a.detectionRisk||0}%</span></span>
      </div>
    </div>
  `}function rt(a,t,e){const s=document.getElementById("start-new-operation-btn"),i=document.getElementById("new-operation-modal"),n=document.getElementById("close-operation-modal"),o=document.getElementById("cancel-operation-btn"),r=document.getElementById("confirm-operation-btn"),l=document.getElementById("target-country-select"),c=document.getElementById("target-country-info");s?.addEventListener("click",()=>{i?.classList.remove("hidden")}),n?.addEventListener("click",()=>{i?.classList.add("hidden")}),o?.addEventListener("click",()=>{i?.classList.add("hidden")}),i?.addEventListener("click",p=>{p.target===i&&i.classList.add("hidden")}),l?.addEventListener("change",p=>{const u=p.target.value;if(u){const m=e.find(v=>v.id===u);m&&(c.classList.remove("hidden"),c.innerHTML=`
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">${m.Bandeira||"🏴"}</span>
            <div>
              <h6 class="font-semibold text-slate-100">${m.Pais}</h6>
              <p class="text-xs text-slate-400">Counter-Intel: ${m.CounterIntelligence||0}</p>
            </div>
          </div>
          <p class="text-xs text-slate-400">
            A infiltração terá 4 fases progressivas. Cada fase aumenta o nível de intel desbloqueado.
          </p>
        `,r.disabled=!1)}else c.classList.add("hidden"),r.disabled=!0}),r?.addEventListener("click",async()=>{const p=l.value;if(p){r.disabled=!0,r.textContent="⏳ Iniciando...";try{const u=window.appState?.currentTurn||0,m=e.find(f=>f.id===p),v=await k.initiateOperation(a,m,t,4,u);v.success?(alert("Operação iniciada com sucesso!"),i.classList.add("hidden"),Ae(a,t)):(alert("Erro: "+v.error),r.disabled=!1,r.textContent="Iniciar Infiltração")}catch(u){console.error("Erro ao iniciar operação:",u),alert("Erro ao processar operação"),r.disabled=!1,r.textContent="Iniciar Infiltração"}}})}function lt(a,t){const e=document.getElementById("agency-tab-content");if(!e)return;e.innerHTML='<div id="security-alerts-container"></div>';const s=document.getElementById("security-alerts-container");s&&Qe(t,a,s)}function dt(a,t){const e=document.getElementById("attempt-research-btn");e&&e.addEventListener("click",async()=>{e.disabled=!0,e.textContent="🎲 Rolando...";try{const s=window.appState?.currentTurn||0,i=await q.attemptResearch(a.id,t,s);i.success?(ut(i),setTimeout(()=>{const n=document.getElementById("agency-dashboard-container");n&&A(t,n)},2e3)):alert("Erro: "+i.error)}catch(s){console.error("Erro ao tentar pesquisa:",s),alert("Erro ao processar pesquisa")}e.disabled=!1,e.textContent="🎲 Tentar Pesquisa"})}function ct(a,t){document.querySelectorAll(".start-research-btn").forEach(s=>{s.addEventListener("click",async i=>{const n=i.currentTarget.dataset.techId;if(confirm("Iniciar pesquisa desta tecnologia?")){s.disabled=!0,s.textContent="Iniciando...";try{const o=window.appState?.currentTurn||0,r=await q.startResearch(a.id,n,t,o);if(r.success){if(alert(`Pesquisa iniciada: ${r.tech.name}
Custo: ${g(r.cost)}`),window.reloadCurrentCountry){const c=await window.reloadCurrentCountry();c&&(t=c)}const l=document.getElementById("intelligence-dashboard-container");l&&A(t,l)}else alert("Erro: "+r.error)}catch(o){console.error("Erro ao iniciar pesquisa:",o),alert("Erro ao processar")}s.disabled=!1,s.textContent="Pesquisar"}})})}function ut(a){const{roll:t,result:e,tech:s}=a;let i=`
🎲 Rolagem: ${t.baseRoll} + ${t.modifiers} = ${t.finalRoll}

${e.icon} ${e.message}
  `;e.unlocked&&(i+=`

✅ ${s.name} desbloqueada!`),alert(i)}function pt(a,t){const e=document.getElementById("budget-card");e&&e.addEventListener("click",()=>{mt(a,t)})}async function mt(a,t){const e=$.calculateBudget(t),s=a.budgetPercent,i=$.getTiers(),n=`
    <div id="budget-change-modal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-xl font-bold text-slate-100">💰 Alterar Orçamento da Agência</h4>
          <button id="close-budget-modal" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <p class="text-sm text-slate-300 mb-2">Orçamento Nacional Disponível</p>
            <p class="text-2xl font-bold text-emerald-400">${g(e)}</p>
          </div>

          <div>
            <label class="text-sm font-semibold text-slate-200 mb-2 block">Percentual do Orçamento Nacional</label>
            <input
              type="range"
              id="budget-slider"
              min="0.5"
              max="15"
              step="0.5"
              value="${s}"
              class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            >
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>0.5%</span>
              <span>15%</span>
            </div>
          </div>

          <div id="budget-preview" class="p-4 rounded-lg border border-slate-600 bg-slate-800/30">
            <!-- Preenchido dinamicamente -->
          </div>

          <div class="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p class="text-xs text-amber-300">⚠️ Alterar o orçamento pode mudar o tier da agência, afetando suas capacidades.</p>
          </div>

          <div class="flex gap-3">
            <button id="cancel-budget-btn" class="flex-1 px-4 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 transition">
              Cancelar
            </button>
            <button id="confirm-budget-btn" class="flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold transition">
              Confirmar Alteração
            </button>
          </div>
        </div>
      </div>
    </div>
  `,o=document.createElement("div");o.innerHTML=n,document.body.appendChild(o);const r=document.getElementById("budget-change-modal"),l=document.getElementById("budget-slider"),c=document.getElementById("budget-preview"),p=document.getElementById("close-budget-modal"),u=document.getElementById("cancel-budget-btn"),m=document.getElementById("confirm-budget-btn");function v(x){const C=Math.round(e*(x/100)),w=$.calculateTier(x),I=i[w];c.innerHTML=`
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Percentual</span>
          <span class="text-lg font-bold text-brand-400">${x}%</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Novo Orçamento</span>
          <span class="text-lg font-bold text-emerald-400">${g(C)}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Tier</span>
          <span class="text-lg font-bold">${I.icon} ${I.name}</span>
        </div>
        ${w!==a.tier?`
          <div class="pt-2 border-t border-slate-700">
            <p class="text-xs ${w>a.tier?"text-green-400":"text-red-400"}">
              ${w>a.tier?"⬆️ Upgrade":"⬇️ Downgrade"} de tier:
              ${i[a.tier].name} → ${I.name}
            </p>
          </div>
        `:""}
      </div>
    `}v(s),l.addEventListener("input",x=>{v(parseFloat(x.target.value))});const f=()=>{r.remove()};p.addEventListener("click",f),u.addEventListener("click",f),r.addEventListener("click",x=>{x.target===r&&f()}),m.addEventListener("click",async()=>{const x=parseFloat(l.value),C=Math.round(e*(x/100)),w=$.calculateTier(x);m.disabled=!0,m.textContent="⏳ Atualizando...";try{await db.collection("agencies").doc(a.id).update({budgetPercent:x,budget:C,tier:w,tierName:i[w].name,updatedAt:new Date().toISOString()});const I=C-a.budget,S=parseFloat(t.AgencyBudgetSpent||0);if(await db.collection("paises").doc(t.id).update({AgencyBudgetSpent:S+I}),alert(`Orçamento atualizado com sucesso!

Novo orçamento: ${g(C)} (${x}%)`),f(),window.reloadCurrentCountry){const N=await window.reloadCurrentCountry();if(N){const O=document.getElementById("intelligence-dashboard-container");O&&A(N,O)}}}catch(I){console.error("Erro ao atualizar orçamento:",I),alert("Erro ao atualizar orçamento: "+I.message),m.disabled=!1,m.textContent="Confirmar Alteração"}})}const gt={renderAgencyDashboard:A},qt=Object.freeze(Object.defineProperty({__proto__:null,default:gt,renderAgencyDashboard:A},Symbol.toStringTag,{value:"Module"})),d={countryListContainer:document.getElementById("lista-paises-publicos"),emptyState:document.getElementById("empty-state"),totalCountriesBadge:document.getElementById("total-paises-badge"),totalPlayers:document.getElementById("total-players"),pibMedio:document.getElementById("pib-medio"),estabilidadeMedia:document.getElementById("estabilidade-media"),paisesPublicos:document.getElementById("paises-publicos"),playerCountryName:document.getElementById("player-country-name"),playerCurrentTurn:document.getElementById("player-current-turn"),playerPib:document.getElementById("player-pib"),playerEstabilidade:document.getElementById("player-estabilidade"),playerCombustivel:document.getElementById("player-combustivel"),playerPibDelta:document.getElementById("player-pib-delta"),playerEstabilidadeDelta:document.getElementById("player-estabilidade-delta"),playerCombustivelDelta:document.getElementById("player-combustivel-delta"),playerHistorico:document.getElementById("player-historico"),playerNotifications:document.getElementById("player-notifications"),playerPanel:document.getElementById("player-panel"),userRoleBadge:document.getElementById("user-role-badge"),countryPanelModal:document.getElementById("country-panel-modal"),countryPanelContent:document.getElementById("country-panel-content"),closeCountryPanelBtn:document.getElementById("close-country-panel")};function Ee(a,t,e){return Math.max(t,Math.min(e,a))}function _e(a){return a<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:a<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:a<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function ee(a){const t=(parseFloat(a.PIB)||0)/(parseFloat(a.Populacao)||1),e=Ee(t,0,2e4)/200,s=Math.round(e*.45+(parseFloat(a.Tecnologia)||0)*.55);return Ee(s,1,100)}function Me(a){const t=parseFloat(a.PIB)||0,e=(parseFloat(a.Burocracia)||0)/100,s=(parseFloat(a.Estabilidade)||0)/100;return t*.25*e*s*1.5}function te(a){const t=Me(a),e=(parseFloat(a.MilitaryBudgetPercent)||30)/100;return t*e}function ae(a){const t=(parseFloat(a.MilitaryDistributionVehicles)||40)/100,e=(parseFloat(a.MilitaryDistributionAircraft)||30)/100,s=(parseFloat(a.MilitaryDistributionNaval)||30)/100;return{vehicles:t,aircraft:e,naval:s,maintenancePercent:.15}}function vt(a){const t=te(a),e=ae(a);return t*e.vehicles}function bt(a){const t=te(a),e=ae(a);return t*e.aircraft}function xt(a){const t=te(a),e=ae(a);return t*e.naval}const ft={afeganistao:"AF",afghanistan:"AF","africa do sul":"ZA","south africa":"ZA",alemanha:"DE",germany:"DE",argentina:"AR",australia:"AU",austria:"AT",belgica:"BE",belgium:"BE",bolivia:"BO",brasil:"BR",brazil:"BR",canada:"CA",chile:"CL",china:"CN",colombia:"CO","coreia do sul":"KR","south korea":"KR","coreia do norte":"KP","north korea":"KP",cuba:"CU",dinamarca:"DK",denmark:"DK",egito:"EG",egypt:"EG",espanha:"ES",spain:"ES","estados unidos":"US",eua:"US",usa:"US","united states":"US",finlandia:"FI",franca:"FR",france:"FR",grecia:"GR",greece:"GR",holanda:"NL","paises baixos":"NL",netherlands:"NL",hungria:"HU",hungary:"HU",india:"IN",indonesia:"ID",ira:"IR",iran:"IR",iraque:"IQ",iraq:"IQ",irlanda:"IE",ireland:"IE",israel:"IL",italia:"IT",italy:"IT",japao:"JP",japan:"JP",malasia:"MY",malaysia:"MY",marrocos:"MA",morocco:"MA",mexico:"MX",nigeria:"NG",noruega:"NO",norway:"NO","nova zelandia":"NZ","new zealand":"NZ",peru:"PE",polonia:"PL",poland:"PL",portugal:"PT","reino unido":"GB",inglaterra:"GB",uk:"GB","united kingdom":"GB",russia:"RU",urss:"RU","uniao sovietica":"RU",singapura:"SG",singapore:"SG",suecia:"SE",sweden:"SE",suica:"CH",switzerland:"CH",turquia:"TR",turkey:"TR",ucrania:"UA",ukraine:"UA",uruguai:"UY",venezuela:"VE",vietna:"VN",vietnam:"VN",equador:"EC",paraguai:"PY",albania:"AL",argelia:"DZ",algeria:"DZ",andorra:"AD",angola:"AO","antigua e barbuda":"AG","antigua and barbuda":"AG",armenia:"AM",azerbaijao:"AZ",azerbaijan:"AZ",bahamas:"BS",bahrein:"BH",bahrain:"BH",bangladesh:"BD",barbados:"BB",belarus:"BY",bielorrússia:"BY",belize:"BZ",benin:"BJ",butao:"BT",bhutan:"BT","bosnia e herzegovina":"BA","bosnia and herzegovina":"BA",botsuana:"BW",botswana:"BW",brunei:"BN",bulgaria:"BG","burkina faso":"BF",burundi:"BI",camboja:"KH",cambodia:"KH",camarões:"CM",cameroon:"CM","cabo verde":"CV","cape verde":"CV","republica centro-africana":"CF","central african republic":"CF",chade:"TD",chad:"TD",comores:"KM",comoros:"KM",congo:"CG","costa rica":"CR",croacia:"HR",croatia:"HR",chipre:"CY",cyprus:"CY","republica tcheca":"CZ","czech republic":"CZ",tchequia:"CZ","republica dominicana":"DO","dominican republic":"DO","timor-leste":"TL","east timor":"TL","el salvador":"SV","guine equatorial":"GQ","equatorial guinea":"GQ",eritreia:"ER",estonia:"EE",etiopia:"ET",ethiopia:"ET",fiji:"FJ",gabao:"GA",gabon:"GA",gambia:"GM",georgia:"GE",gana:"GH",ghana:"GH",guatemala:"GT",guine:"GN",guinea:"GN","guine-bissau":"GW","guinea-bissau":"GW",guiana:"GY",guyana:"GY",haiti:"HT",honduras:"HN",islandia:"IS",iceland:"IS",jamaica:"JM",jordania:"JO",jordan:"JO",cazaquistao:"KZ",kazakhstan:"KZ",quenia:"KE",kenya:"KE",kiribati:"KI",kuwait:"KW",quirguistao:"KG",kyrgyzstan:"KG",laos:"LA",letonia:"LV",latvia:"LV",libano:"LB",lebanon:"LB",lesoto:"LS",lesotho:"LS",liberia:"LR",libia:"LY",libya:"LY",liechtenstein:"LI",lituania:"LT",lithuania:"LT",luxemburgo:"LU",luxembourg:"LU",madagascar:"MG",malawi:"MW",maldivas:"MV",maldives:"MV",mali:"ML",malta:"MT","ilhas marshall":"MH","marshall islands":"MH",mauritania:"MR",mauricio:"MU",mauritius:"MU",micronesia:"FM",moldova:"MD",monaco:"MC",mongolia:"MN",montenegro:"ME",mocambique:"MZ",mozambique:"MZ",myanmar:"MM",birmania:"MM",namibia:"NA",nauru:"NR",nepal:"NP",nicaragua:"NI",niger:"NE","macedonia do norte":"MK","north macedonia":"MK",oma:"OM",oman:"OM",paquistao:"PK",pakistan:"PK",palau:"PW",panama:"PA","papua-nova guine":"PG","papua new guinea":"PG",filipinas:"PH",philippines:"PH",catar:"QA",qatar:"QA",romenia:"RO",romania:"RO",ruanda:"RW","sao cristovao e nevis":"KN","saint kitts and nevis":"KN","santa lucia":"LC","saint lucia":"LC","sao vicente e granadinas":"VC","saint vincent and the grenadines":"VC",samoa:"WS","san marino":"SM","sao tome e principe":"ST","sao tome and principe":"ST","arabia saudita":"SA","saudi arabia":"SA",senegal:"SN",servia:"RS",serbia:"RS",seicheles:"SC",seychelles:"SC","serra leoa":"SL","sierra leone":"SL",eslovaquia:"SK",slovakia:"SK",eslovenia:"SI",slovenia:"SI","ilhas salomao":"SB","solomon islands":"SB",somalia:"SO","sri lanka":"LK",sudao:"SD",sudan:"SD",suriname:"SR",siria:"SY",syria:"SY",tajiquistao:"TJ",tajikistan:"TJ",tanzania:"TZ",tailandia:"TH",thailand:"TH",togo:"TG",tonga:"TO","trinidad e tobago":"TT","trinidad and tobago":"TT",tunisia:"TN",turcomenistao:"TM",turkmenistan:"TM",tuvalu:"TV",uganda:"UG","emirados arabes unidos":"AE","united arab emirates":"AE",uzbequistao:"UZ",uzbekistan:"UZ",vanuatu:"VU","cidade do vaticano":"VA","vatican city":"VA",vaticano:"VA",iemen:"YE",yemen:"YE",zambia:"ZM",zimbabue:"ZW",zimbabwe:"ZW"};function ht(a){if(!a)return null;const t=(a||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"");return ft[t]||null}function yt(a){return(a||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"").replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim()}const Z={"africa equatorial francesa":"assets/flags/historical/África Equatorial Francesa_.png","africa ocidental francesa":"assets/flags/historical/África Ocidental Francesa.gif","africa portuguesa":"assets/flags/historical/África Portuguesa.png","alemanha ocidental":"assets/flags/historical/Alemanha Ocidental_.png","alemanha oriental":"assets/flags/historical/Alemanha Oriental.png",andorra:"assets/flags/historical/Andorra.png",bulgaria:"assets/flags/historical/Flag_of_Bulgaria_(1948–1967).svg.png",canada:"assets/flags/historical/Flag_of_Canada_(1921–1957).svg.png",espanha:"assets/flags/historical/Flag_of_Spain_(1945–1977).svg.png",grecia:"assets/flags/historical/State_Flag_of_Greece_(1863-1924_and_1935-1973).svg.png",hungria:"assets/flags/historical/Flag_of_Hungary_(1949-1956).svg.png",iugoslavia:"assets/flags/historical/Flag_of_Yugoslavia_(1946-1992).svg.png",romenia:"assets/flags/historical/Flag_of_Romania_(1952–1965).svg.png","caribe britanico":"assets/flags/historical/Caribe Britânico.png",congo:"assets/flags/historical/Flag_of_the_Congo_Free_State.svg.png","costa do ouro":"assets/flags/historical/Flag_of_the_Gold_Coast_(1877–1957).svg.png",egito:"assets/flags/historical/Flag_of_Egypt_(1952–1958).svg.png",etiopia:"assets/flags/historical/Flag_of_Ethiopia_(1897–1974).svg.png",ira:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iran:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iraque:"assets/flags/historical/Flag_of_Iraq_(1924–1959).svg.png",quenia:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png",kenya:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png","rodesia do sul":"assets/flags/historical/Flag_of_Southern_Rhodesia_(1924–1964).svg.png",siria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png",syria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png","uniao sovietica":"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",urss:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",russia:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png"};function Ct(a){if(!a)return null;const t=yt(a);if(Z[t])return Z[t];for(const[e,s]of Object.entries(Z))if(t.includes(e)||e.includes(t))return s;return null}function R(a,t="h-full w-full"){if(!a)return'<span class="text-slate-400 text-xs">🏴</span>';const e=Ct(a);if(e)return`<img src="${e}" alt="Bandeira de ${a}" class="${t} object-contain" loading="lazy">`;const s=ht(a);return s?`<img src="${`assets/flags/countries/${s.toLowerCase()}.png`}" alt="Bandeira de ${a}" class="${t} object-contain" loading="lazy">`:(Le.add(String(a||"").trim()),'<span class="text-slate-400 text-xs">🏴</span>')}const Le=new Set;window.getMissingFlagCountries||(window.getMissingFlagCountries=()=>Array.from(Le).sort());function wt(a){if(!d.countryListContainer)return;d.countryListContainer.innerHTML="";const t=a.filter(e=>e.Pais&&e.PIB&&e.Populacao&&e.Estabilidade&&e.Urbanizacao&&e.Tecnologia);if(d.totalCountriesBadge&&(d.totalCountriesBadge.textContent=`${t.length} países`),t.length===0){d.countryListContainer.innerHTML='<div class="col-span-full text-center py-12"><div class="text-slate-400 mb-2">Nenhum país para exibir.</div></div>';return}t.forEach(e=>{const s=e.PIB??e.geral?.PIB??0,i=e.geral?.Populacao??e.Populacao??0,n=e.geral?.Estabilidade??e.Estabilidade??0,o=e.geral?.Tecnologia??e.Tecnologia??0,r=e.geral?.Urbanizacao??e.Urbanizacao??0,l=g(s),c=Number(i).toLocaleString("pt-BR"),p=_e(parseFloat(n)),u={...e,PIB:s,Populacao:i,Tecnologia:o},m=ee(u),v=R(e.Pais),f=`
      <button class="country-card-button group relative w-full rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_6px_20px_-12px_rgba(0,0,0,0.6)] hover:border-slate-600/60 hover:bg-slate-900/70 transition-all" data-country-id="${e.id}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-10 grid place-items-center rounded-md ring-1 ring-white/10 bg-slate-800">${v}</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-100">${e.Pais}</div>
              <div class="text-[10px] text-slate-400">PIB pc ${g(e.PIBPerCapita||s/i)}</div>
            </div>
          </div>
          <div class="shrink-0 text-center">
            <div class="grid place-items-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/70 text-[11px] font-bold text-slate-100">${m}</div>
            <div class="mt-0.5 text-[9px] uppercase text-slate-500">WPI</div>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="flex items-center gap-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
              PIB
            </div>
            <div class="mt-0.5 font-medium text-slate-100">${l}</div>
          </div>
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="flex items-center gap-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
              Pop.
            </div>
            <div class="mt-0.5 font-medium text-slate-100">${c}</div>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between gap-2">
          <div class="truncate text-[11px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${e.ModeloPolitico||"—"}</div>
          <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${p.tone}">${p.label}</span>
        </div>
        <div class="mt-2">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span class="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
              Urbanização
            </span>
            <span class="text-slate-300">${Math.max(0,Math.min(100,r))}%</span>
          </div>
          <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-1.5 rounded-full bg-emerald-500" style="width: ${Math.max(0,Math.min(100,r))}%"></div>
          </div>
        </div>
      </button>`;d.countryListContainer.innerHTML+=f})}async function It(a){const t=window.appState?.playerCountry,e=window.appState?.currentTurn||0,s=window.appState?.userPermissions||{};if(t&&a.id===t.id)return{level:"owner",bypass:!0};if(s.isAdmin||s.isNarrator)return{level:"total",bypass:!0,reason:"admin"};if(t){const n=await y.hasActiveSpying(t.id,a.id,e);if(n)return{level:n.level,bypass:!1,espionage:n}}return{level:"none",bypass:!1}}function $e(a,t){const e=t.level;return e==="owner"||e==="total"||["nome","bandeira","populacao","pib","pibPerCapita","modeloPolitico","wpi"].includes(a)?!0:e==="basic"?["orcamento","recursos","bensConsumo"].includes(a):e==="intermediate"?["orcamento","recursos","bensConsumo","tecnologia","estabilidade","urbanizacao","capacidadesProducao"].includes(a):!1}async function Tt(a){if(!d.countryPanelContent||!d.countryPanelModal)return;const t=await It(a),e=a.PIB??a.geral?.PIB??0,s=a.geral?.Populacao??a.Populacao??0,i=a.geral?.Estabilidade??a.Estabilidade??0,n=a.geral?.Tecnologia??a.Tecnologia??0,o=a.geral?.Urbanizacao??a.Urbanizacao??0,r={...a,PIB:e,Populacao:s,Tecnologia:n},l=ee(r),c=Me({PIB:e,Burocracia:a.Burocracia,Estabilidade:i}),p=vt({PIB:e,Veiculos:a.Veiculos}),u=bt({PIB:e,Aeronautica:a.Aeronautica}),m=xt({PIB:e,Marinha:a.Marinha}),v=_e(parseFloat(i)),f=g(e),x=Number(s).toLocaleString("pt-BR"),C=g(a.PIBPerCapita||e/s),w=Math.max(0,Math.min(100,parseFloat(o))),I=`<span class="inline-grid h-8 w-12 place-items-center rounded-md ring-1 ring-white/10 bg-slate-800 overflow-hidden">${R(a.Pais)}</span>`;let S="";if(t.bypass&&t.reason==="admin")S=`
      <div class="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 mb-4">
        <div class="flex items-center gap-2 text-yellow-300 text-sm">
          <span class="text-xl">⚠️</span>
          <div>
            <div class="font-semibold">Modo Admin/Narrador Ativo</div>
            <div class="text-xs text-yellow-400">Você está vendo todas as informações. Jogadores normais precisariam de espionagem.</div>
          </div>
        </div>
      </div>`;else if(t.level==="none")S=`
      <div class="rounded-xl border border-red-500/30 bg-red-500/10 p-3 mb-4">
        <div class="flex items-center gap-2 text-red-300 text-sm">
          <span class="text-xl">🔒</span>
          <div>
            <div class="font-semibold">Acesso Restrito</div>
            <div class="text-xs text-red-400">Você não tem espionagem ativa neste país. Apenas informações públicas são visíveis.</div>
          </div>
        </div>
      </div>`;else if(t.espionage){const T={basic:"Básica",intermediate:"Intermediária",total:"Total"};S=`
      <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 mb-4">
        <div class="flex items-center gap-2 text-purple-300 text-sm">
          <span class="text-xl">${{basic:"🔍",intermediate:"🔬",total:"🎯"}[t.level]}</span>
          <div>
            <div class="font-semibold">Espionagem Ativa - Nível ${T[t.level]}</div>
            <div class="text-xs text-purple-400">Válida até turno #${t.espionage.validUntilTurn}</div>
          </div>
        </div>
      </div>`}const N=`
    <div class="space-y-4">
      ${S}
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight flex items-center gap-2">${I} ${a.Pais}</h2>
          <div class="text-sm text-slate-400">PIB per capita <span class="font-semibold text-slate-200">${C}</span></div>
        </div>
        <div class="text-center">
          <div class="h-12 w-12 grid place-items-center rounded-full border border-white/10 bg-slate-900/60 text-sm font-bold">${l}</div>
          <div class="text-[10px] uppercase text-slate-500 mt-0.5">War Power</div>
        </div>
      </div>

      <div class="text-[12px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${a.ModeloPolitico||"—"}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
            PIB
          </div>
          <div class="mt-1 text-lg font-semibold">${f}</div>
        </div>
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            População
          </div>
          <div class="mt-1 text-lg font-semibold">${x}</div>
          <div class="mt-2 text-[12px] text-slate-400">Densidade urbana</div>
          <div class="mt-1">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
                Urbanização
              </span>
              <span class="text-slate-300">${w}%</span>
            </div>
            <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div class="h-1.5 rounded-full bg-emerald-500" style="width:${w}%"></div>
            </div>
          </div>
        </div>
      </div>

      ${$e("inventario",t)?`
      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Força Militar</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Exército</div>
            <div class="text-sm font-semibold text-slate-100">${a.Exercito||0}</div>
            <div class="text-[9px] text-slate-500">Força terrestre</div>
          </div>
        </div>
      </div>
      `:""}

      ${$e("capacidadesProducao",t)?`
      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Burocracia</div>
          <div class="text-sm font-semibold text-slate-100">${a.Burocracia||0}%</div>
        </div>
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Combustível</div>
          <div class="text-sm font-semibold text-slate-100">${a.Combustivel||0}</div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Capacidade de Produção</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Veículos por Turno</div>
            <div class="text-sm font-semibold text-blue-400">${g(p)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Aeronaves por Turno</div>
            <div class="text-sm font-semibold text-cyan-400">${g(u)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Navios por Turno</div>
            <div class="text-sm font-semibold text-indigo-400">${g(m)}</div>
          </div>
        </div>

        <h5 class="text-xs font-medium text-slate-300 mt-3 mb-1">Tecnologias Militares</h5>
        <div class="grid grid-cols-3 gap-1">
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Veículos</div>
            <div class="text-xs font-semibold text-slate-100">${a.Veiculos||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Aeronáutica</div>
            <div class="text-xs font-semibold text-slate-100">${a.Aeronautica||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Naval</div>
            <div class="text-xs font-semibold text-slate-100">${a.Marinha||0}%</div>
          </div>
        </div>
      </div>
      `:""}

      <div class="flex items-center gap-2 mt-2">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border ${v.tone}">
          Estabilidade: ${v.label}
        </span>
        <div class="ml-auto text-[12px] text-slate-400">Índice: <span class="text-slate-200 font-semibold">${i}</span></div>
      </div>

      <div class="space-y-3 mt-2">
        <div>
          <div class="flex items-center justify-between text-[12px] text-slate-400">
            <span>Estabilidade Interna</span>
            <span class="text-slate-200">${i}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-cyan-400" style="width:${Math.max(0,Math.min(100,i))}%"></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between text-[12px] text-slate-400">
            <span>Tecnologia</span>
            <span class="text-slate-200">${n}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-emerald-400" style="width:${Math.max(0,Math.min(100,n))}%"></div>
          </div>
        </div>
      </div>
    </div>`,O=`
    <div class="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
      <h3 class="text-lg font-semibold">Resumo Estratégico</h3>
      <p class="mt-1 text-[12px] text-slate-400">Visão geral de capacidades e riscos do país no contexto do seu RPG.</p>
      <div class="mt-4 space-y-2">
        ${[["Modelo Político",a.ModeloPolitico||"—"],["PIB total",f],["PIB per capita",C],["Orçamento Nacional",`<span class="text-emerald-400">${g(c)}</span>`],["Prod. Veículos/turno",`<span class="text-blue-400">${g(p)}</span>`],["Prod. Aeronaves/turno",`<span class="text-cyan-400">${g(u)}</span>`],["Prod. Navios/turno",`<span class="text-indigo-400">${g(m)}</span>`],["População",x],["War Power Index",`${l}/100`],["Burocracia",`${a.Burocracia||0}%`],["Combustível",`${a.Combustivel||0}`],["Último Turno",`#${a.TurnoUltimaAtualizacao||0}`]].map(([T,fe])=>`
          <div class="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2 text-[13px]">
            <span class="text-slate-400">${T}</span>
            <span class="font-medium text-slate-100">${fe}</span>
          </div>`).join("")}
      </div>
      <div class="mt-3 text-[11px] text-slate-500">
        * O War Power Index pondera tecnologia e renda per capita.<br>
        * Orçamento = PIB × 0,25 × Burocracia × Estabilidade × 1,5<br>
        * Prod. Veículos = PIB × TecnologiaCivil × Urbanização × Veículos × 0,15<br>
        * Prod. Aeronaves = PIB × TecnologiaCivil × Urbanização × Aeronáutica × 0,12<br>
        * Prod. Navios = PIB × TecnologiaCivil × Urbanização × Naval × 0,18
      </div>
      <div class="mt-4 grid grid-cols-2 gap-2">
        <button id="btn-ver-recursos" class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-500/20 transition">
          ⛏️ Ver Recursos
        </button>
        <button id="btn-ver-inventario" class="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 transition">
          🎖️ Ver Inventário
        </button>
      </div>
      <div id="agency-button-container" class="mt-2">
        <!-- Botão de agência será adicionado dinamicamente -->
      </div>
      <div id="espionage-button-container" class="mt-2">
        <!-- Botão de espionagem será adicionado dinamicamente -->
      </div>
      <div id="counter-intel-container" class="mt-2">
        <!-- Painel de contra-espionagem será adicionado dinamicamente -->
      </div>
    </div>`,_=Y.calculateCountryConsumption(a),M=J.calculateCountryProduction(a),Re=ke.calculateConsumerGoods(a),se=Math.round(M.Carvao||0),ie=Math.round(_.Carvao||0),D=se-ie,ne=Math.round(M.Combustivel||0),oe=Math.round(_.Combustivel||0),j=ne-oe,re=Math.round(M.Metais||0),le=Math.round(_.Metais||0),z=re-le,de=Math.round(M.Graos||0),ce=Math.round(_.Graos||0),H=de-ce,ue=Math.round(M.Energia||0),pe=Math.round(_.Energia||0),U=ue-pe,me=Math.round(Re.percentage||0),Ne=`
    <div id="modal-recursos" class="hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-100">⛏️ Recursos - ${a.Pais||"País"}</h3>
          <button id="close-modal-recursos" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Combustível -->
          <div class="border border-orange-500/30 bg-orange-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">⛽</span>
              <span class="text-sm font-medium text-slate-300">Combustível</span>
            </div>
            <div class="text-3xl font-bold ${j>=0?"text-green-400":"text-red-400"}">${j>=0?"+":""}${h(j)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-orange-500/30">
              <span class="text-green-400">Prod: ${h(ne)}</span>
              <span class="text-red-400">Cons: ${h(oe)}</span>
            </div>
          </div>

          <!-- Carvão -->
          <div class="border border-slate-500/30 bg-slate-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🪨</span>
              <span class="text-sm font-medium text-slate-300">Carvão</span>
            </div>
            <div class="text-3xl font-bold ${D>=0?"text-green-400":"text-red-400"}">${D>=0?"+":""}${h(D)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-slate-500/30">
              <span class="text-green-400">Prod: ${h(se)}</span>
              <span class="text-red-400">Cons: ${h(ie)}</span>
            </div>
          </div>

          <!-- Metais -->
          <div class="border border-gray-500/30 bg-gray-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🔩</span>
              <span class="text-sm font-medium text-slate-300">Metais</span>
            </div>
            <div class="text-3xl font-bold ${z>=0?"text-green-400":"text-red-400"}">${z>=0?"+":""}${h(z)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-gray-500/30">
              <span class="text-green-400">Prod: ${h(re)}</span>
              <span class="text-red-400">Cons: ${h(le)}</span>
            </div>
          </div>

          <!-- Grãos -->
          <div class="border border-amber-500/30 bg-amber-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🌾</span>
              <span class="text-sm font-medium text-slate-300">Grãos</span>
            </div>
            <div class="text-3xl font-bold ${H>=0?"text-green-400":"text-red-400"}">${H>=0?"+":""}${h(H)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-amber-500/30">
              <span class="text-green-400">Prod: ${h(de)}</span>
              <span class="text-red-400">Cons: ${h(ce)}</span>
            </div>
          </div>

          <!-- Energia -->
          <div class="border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">⚡</span>
              <span class="text-sm font-medium text-slate-300">Energia</span>
            </div>
            <div class="text-3xl font-bold ${U>=0?"text-green-400":"text-red-400"}">${U>=0?"+":""}${h(U)} MW</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-yellow-500/30">
              <span class="text-green-400">Prod: ${h(ue)} MW</span>
              <span class="text-red-400">Cons: ${h(pe)} MW</span>
            </div>
          </div>

          <!-- Bens de Consumo -->
          <div class="border border-blue-500/30 bg-blue-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">📦</span>
              <span class="text-sm font-medium text-slate-300">Bens de Consumo</span>
            </div>
            <div class="text-3xl font-bold text-blue-400">${me}%</div>
            <div class="text-xs text-slate-400 mt-1">disponibilidade</div>
            <div class="text-xs mt-2 pt-2 border-t border-blue-500/30 text-slate-400">
              Necessário: 100% | Atual: ${me}%
            </div>
          </div>
        </div>
      </div>
    </div>`,Oe=`
    <div id="modal-inventario" class="hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-100">🎖️ Inventário de Guerra - ${a.Pais||"País"}</h3>
          <button id="close-modal-inventario" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
        </div>

        <div class="space-y-4">
          <!-- Veículos -->
          <div class="border border-green-500/30 bg-green-500/10 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🚗</span>
                <span class="text-lg font-semibold text-slate-100">Veículos Terrestres</span>
              </div>
              <div class="text-2xl font-bold text-green-400">${a.VeiculosEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${a.VeiculosPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${a.Veiculos||0}</span>
              </div>
            </div>
          </div>

          <!-- Aeronaves -->
          <div class="border border-blue-500/30 bg-blue-500/10 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">✈️</span>
                <span class="text-lg font-semibold text-slate-100">Aeronaves</span>
              </div>
              <div class="text-2xl font-bold text-blue-400">${a.AeronavesEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${a.AeronavesPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${a.Aeronautica||0}</span>
              </div>
            </div>
          </div>

          <!-- Navios -->
          <div class="border border-cyan-500/30 bg-cyan-500/10 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="text-2xl">🚢</span>
                <span class="text-lg font-semibold text-slate-100">Navios</span>
              </div>
              <div class="text-2xl font-bold text-cyan-400">${a.NaviosEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${a.NaviosPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${a.Marinha||0}</span>
              </div>
            </div>
          </div>

          <!-- Resumo Militar -->
          <div class="border border-red-500/30 bg-red-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-2xl">💪</span>
              <span class="text-lg font-semibold text-slate-100">Capacidade Militar</span>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-slate-400 text-xs mb-1">War Power Index</div>
                <div class="text-2xl font-bold text-red-400">${a.WarPower||0}/100</div>
              </div>
              <div>
                <div class="text-slate-400 text-xs mb-1">Orçamento Militar</div>
                <div class="text-lg font-bold text-slate-100">${g((a.PIB||0)*((a.MilitaryBudgetPercent||0)/100))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,Fe=`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${N}
      ${O}
    </div>
    ${Ne}
    ${Oe}
  `;d.countryPanelContent.innerHTML=Fe;const ge=document.getElementById("btn-ver-recursos"),ve=document.getElementById("btn-ver-inventario"),P=document.getElementById("modal-recursos"),B=document.getElementById("modal-inventario"),be=document.getElementById("close-modal-recursos"),xe=document.getElementById("close-modal-inventario");ge&&P&&ge.addEventListener("click",()=>{P.classList.remove("hidden")}),ve&&B&&ve.addEventListener("click",()=>{B.classList.remove("hidden")}),be&&P&&(be.addEventListener("click",()=>{P.classList.add("hidden")}),P.addEventListener("click",T=>{T.target===P&&P.classList.add("hidden")})),xe&&B&&(xe.addEventListener("click",()=>{B.classList.add("hidden")}),B.addEventListener("click",T=>{T.target===B&&B.classList.add("hidden")}));const V=d.countryPanelModal;V.classList.remove("hidden"),requestAnimationFrame(()=>{V.classList.remove("opacity-0");const T=V.querySelector(".transform");T&&T.classList.remove("-translate-y-2")}),Et(a)}async function Et(a){const t=window.appState?.playerCountry,e=window.appState?.currentTurn||0;console.log("DEBUG: [setupEspionageSystem] País renderizado:",a),console.log("DEBUG: [setupEspionageSystem] País do jogador (appState):",t);const s=document.getElementById("espionage-button-container"),i=document.getElementById("counter-intel-container"),n=document.getElementById("agency-button-container");if(!(!s||!i)){if(t&&a.id===t.id){if(Pe(a,i),s.innerHTML="",n){n.innerHTML=`
        <button id="btn-open-agency" class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/20 transition">
          🕵️ Agência de Inteligência
        </button>
      `;const o=document.getElementById("btn-open-agency");o&&o.addEventListener("click",()=>{$t(a)})}return}if(t&&a.id!==t.id){const o=await y.hasActiveSpying(t.id,a.id,e);if(o){const r=o.validUntilTurn-e;s.innerHTML=`
        <div class="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xl">🕵️</span>
            <span class="text-sm font-semibold text-brand-300">Espionagem Ativa</span>
          </div>
          <p class="text-xs text-brand-400">
            Nível: ${y.getLevels()[o.level]?.name||o.level}
          </p>
          <p class="text-xs text-brand-400">
            Válido por mais ${r} turno${r!==1?"s":""}
          </p>
        </div>
      `}else{s.innerHTML=`
        <button id="btn-spy-country" class="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/20 transition">
          🕵️ ESPIONAR ESTE PAÍS
        </button>
      `;const r=document.getElementById("btn-spy-country");r&&r.addEventListener("click",()=>{Ke.show(a,t,e)})}i.innerHTML=""}else s.innerHTML="",i.innerHTML="",n&&(n.innerHTML="")}}function $t(a){const t=document.createElement("div");t.id="agency-modal",t.className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm",t.innerHTML=`
    <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="text-4xl">🕵️</span>
          <div>
            <h3 class="text-2xl font-bold text-slate-100">Agência de Inteligência</h3>
            <p class="text-sm text-slate-400">${a.Pais}</p>
          </div>
        </div>
        <button id="close-agency-modal" class="text-slate-400 hover:text-slate-200 text-2xl transition">×</button>
      </div>

      <!-- Conteúdo do Dashboard -->
      <div id="agency-dashboard-content">
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p class="text-slate-400">Carregando...</p>
        </div>
      </div>
    </div>
  `,document.body.appendChild(t);const e=document.getElementById("close-agency-modal");e&&e.addEventListener("click",()=>{t.remove()}),t.addEventListener("click",i=>{i.target===t&&t.remove()});const s=document.getElementById("agency-dashboard-content");s&&A(a,s)}function Pt(a,t){const{userRoleBadge:e}=d,s=document.querySelector('a[href="narrador.html"]');s&&(s.style.display=a||t?"block":"none"),e&&(t?(e.textContent="Admin",e.className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"):a?(e.textContent="Narrador",e.className="text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20"):(e.textContent="Jogador",e.className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"))}function Bt(a){const t=document.createElement("div");t.className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";const e=`
    <div class="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-bg-soft border border-bg-ring/70 p-6 overflow-hidden">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-slate-100">Escolha seu País</h2>
        <p class="text-sm text-slate-400 mt-1">Selecione um país para governar no RPG</p>
      </div>
      <div class="mb-4">
        <input type="text" id="busca-pais" placeholder="Buscar país..." class="w-full rounded-xl bg-bg border border-bg-ring/70 p-3 text-sm">
        <div class="mt-2 text-xs text-slate-400">Mostrando <span id="paises-visiveis">${a.length}</span> países disponíveis</div>
      </div>
      <div class="max-h-96 overflow-y-auto space-y-2">
        ${a.map(s=>{const i=R(s.Pais,"h-6 w-9");return`
            <div class="pais-option rounded-xl border border-bg-ring/70 p-3 cursor-pointer" data-pais-id="${s.id}" data-pais-nome="${s.Pais}">
              <div class="flex items-center gap-3">
                <div class="h-6 w-9 rounded bg-slate-800 grid place-items-center">${i}</div>
                <div class="flex-1">
                  <div class="font-medium text-slate-100">${s.Pais}</div>
                  <div class="text-xs text-slate-400">PIB: ${g(s.PIB||0)} · Pop: ${Number(s.Populacao||0).toLocaleString("pt-BR")} · Tech: ${s.Tecnologia||0}% · Estab: ${s.Estabilidade||0}/100</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">WPI</div>
                  <div class="text-sm font-bold text-slate-200">${ee(s)}</div>
                </div>
              </div>
            </div>`}).join("")}
      </div>
      <div class="mt-6 flex gap-3">
        <button id="cancelar-selecao" class="flex-1 rounded-xl border border-bg-ring/70 px-4 py-2.5 text-slate-300">Cancelar</button>
        <button id="confirmar-selecao" class="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-slate-950 font-semibold" disabled>Confirmar Seleção</button>
      </div>
    </div>`;return t.innerHTML=e,document.body.appendChild(t),t}function St(a){const t=a.filter(r=>r.Player),e=t.map(r=>parseFloat(String(r.PIB).replace(/[$.]+/g,"").replace(",","."))||0),s=t.map(r=>parseFloat(String(r.Estabilidade).replace(/%/g,""))||0),i=e.length>0?e.reduce((r,l)=>r+l,0)/e.length:0,n=s.length>0?s.reduce((r,l)=>r+l,0)/s.length:0,o=a.filter(r=>{const l=(r.Visibilidade||"").toString().trim().toLowerCase();return l==="público"||l==="publico"||l==="public"}).length;d.totalPlayers&&he("total-players",t.length),d.pibMedio&&(d.pibMedio.textContent=g(i)),d.estabilidadeMedia&&(d.estabilidadeMedia.textContent=`${Math.round(n)}/100`),d.paisesPublicos&&he("paises-publicos",o)}function At(a,t){if(a&&d.playerPanel){d.playerCountryName&&(d.playerCountryName.textContent=a.Pais||"País do Jogador");const e=document.getElementById("player-flag-container");e&&(e.innerHTML=R(a.Pais,"h-full w-full")),d.playerCurrentTurn&&(d.playerCurrentTurn.textContent=`#${t}`);const s=(parseFloat(a.PIB)||0)/(parseFloat(a.Populacao)||1),i=document.getElementById("player-pib-per-capita");if(i&&(i.textContent=g(s)),d.playerPib){const c=a.PIB||0,p=qe(c);d.playerPib.textContent=p}const n=Number(a.Estabilidade)||0;d.playerEstabilidade&&(d.playerEstabilidade.textContent=`${n}/100`);const o=document.getElementById("player-estabilidade-bar");if(o&&(o.style.width=`${Math.max(0,Math.min(100,n))}%`,n>=75?o.className="h-1.5 rounded-full bg-emerald-400":n>=50?o.className="h-1.5 rounded-full bg-cyan-400":n>=25?o.className="h-1.5 rounded-full bg-yellow-400":o.className="h-1.5 rounded-full bg-red-400"),d.playerCombustivel){const c=Y.calculateCountryConsumption(a),p=J.calculateCountryProduction(a),u=Math.round((p.Combustivel||0)-(c.Combustivel||0));d.playerCombustivel.textContent=u}if(d.playerCombustivelDelta){const c=Y.calculateCountryConsumption(a),p=J.calculateCountryProduction(a),u=Math.round((p.Combustivel||0)-(c.Combustivel||0));d.playerCombustivelDelta.textContent=u>=0?`+${u}`:`${u}`}d.playerPibDelta&&(d.playerPibDelta.textContent="Sem histórico"),d.playerEstabilidadeDelta&&(d.playerEstabilidadeDelta.textContent="Sem histórico"),d.playerHistorico&&(d.playerHistorico.innerHTML=`
        <div class="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3 mb-2">
          <div class="font-medium">Turno #${t} (atual)</div>
          <div class="text-xs text-slate-400">PIB: ${g(a.PIB)} · Estab: ${n}/100 · Pop: ${Number(a.Populacao||0).toLocaleString("pt-BR")}</div>
        </div>`);const r=a.TurnoUltimaAtualizacao<t;d.playerNotifications&&(r?d.playerNotifications.classList.remove("hidden"):d.playerNotifications.classList.add("hidden")),d.playerPanel.style.display="block";const l=document.getElementById("welcome-content");l&&(l.style.display="none")}else{d.playerCountryName&&(d.playerCountryName.textContent="Carregando..."),d.playerHistorico&&(d.playerHistorico.innerHTML='<div class="text-sm text-slate-400 italic">Nenhum histórico disponível</div>'),d.playerPanel&&(d.playerPanel.style.display="none");const e=document.getElementById("welcome-content");e&&(e.style.display="block")}}const kt=Object.freeze(Object.defineProperty({__proto__:null,createCountrySelectionModal:Bt,fillPlayerPanel:At,getFlagHTML:R,renderDetailedCountryPanel:Tt,renderPublicCountries:wt,updateKPIs:St,updateNarratorUI:Pt},Symbol.toStringTag,{value:"Module"}));export{wt as a,Pt as b,Bt as c,qt as d,kt as e,At as f,R as g,Tt as r,St as u};
