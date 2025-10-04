const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/agencyFoundationModal-D2ZeUHmt.js","assets/preload-helper-f85Crcwt.js","assets/espionageOperationsSystem-yA0URGjb.js","assets/firebase-BARDcBiw.js"])))=>i.map(i=>d[i]);
import{h as b,j as g,k as h,l as Ne,m as be}from"./firebase-BARDcBiw.js";import{R as W}from"./resourceConsumptionCalculator-dQu245X_.js";import{R as Z}from"./resourceProductionCalculator-b8MxHWSv.js";import{C as Oe}from"./consumerGoodsCalculator-Bg6C08yH.js";import{_ as qe}from"./preload-helper-f85Crcwt.js";import{i as T,I as Fe,e as O}from"./espionageOperationsSystem-yA0URGjb.js";import{addDoc as ke,collection as U,doc as xe,getDoc as fe,updateDoc as De,query as he,where as V,getDocs as ye}from"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";const G={basic:{name:"Básica",description:"Orçamento e recursos gerais",costMultiplier:1,successBaseChance:.7,icon:"🔍"},intermediate:{name:"Intermediária",description:"Recursos + tecnologias e capacidades",costMultiplier:2.5,successBaseChance:.5,icon:"🔬"},total:{name:"Total",description:"Acesso completo ao inventário militar",costMultiplier:5,successBaseChance:.3,icon:"🎯"}},je=5e4;class ze{constructor(){this.activeOperations=new Map,this.lastUpdate=null}async hasActiveSpying(t,e,a){try{const i=await b.collection("espionageOperations").where("spyCountryId","==",t).where("targetCountryId","==",e).where("active","==",!0).get();if(i.empty)return null;const n=i.docs[0].data();return n.id=i.docs[0].id,n.validUntilTurn<a?(await this.deactivateOperation(n.id),null):n}catch(i){return console.error("Erro ao verificar espionagem ativa:",i),null}}calculateOperationCost(t,e,a){const i=G[t];if(!i)return 0;let n=je*i.costMultiplier*e;const r=.5+(parseFloat(a.WarPower)||50)/100;return Math.round(n*r)}calculateSuccessChance(t,e,a){const i=G[t];if(!i)return 0;let n=i.successBaseChance;const o=(parseFloat(e.Tecnologia)||0)/100;n+=o*.2;const r=(parseFloat(a.CounterIntelligence)||0)/100;n-=r*3;const l=(parseFloat(a.Urbanizacao)||0)/100;return n-=l*.1,Math.max(.05,Math.min(.95,n))}async initiateOperation(t,e,a,i,n){try{if(await this.hasActiveSpying(t.id,e.id,n))return{success:!1,error:"Você já tem uma operação ativa neste país!"};const r=this.calculateOperationCost(a,i,e);if(this.calculateBudget(t)<r)return{success:!1,error:"Orçamento insuficiente para esta operação!"};const c=this.calculateSuccessChance(a,t,e),u=Math.random()<=c,v=(parseFloat(e.CounterIntelligence)||0)/100*.5,f=Math.random()<=v,x={spyCountryId:t.id,spyCountryName:t.Pais,targetCountryId:e.id,targetCountryName:e.Pais,level:a,startTurn:n,validUntilTurn:n+i,duration:i,investment:r,detected:f,succeeded:u,active:u,createdAt:new Date().toISOString()},C=await b.collection("espionageOperations").add(x);return f&&await this.createDetectionNotification(e.id,t.Pais,u),{success:!0,operation:{...x,id:C.id},cost:r,succeeded:u,detected:f,successChance:Math.round(c*100)}}catch(o){return console.error("Erro ao iniciar operação de espionagem:",o),{success:!1,error:"Erro ao processar operação: "+o.message}}}async deactivateOperation(t){try{return await b.collection("espionageOperations").doc(t).update({active:!1,deactivatedAt:new Date().toISOString()}),!0}catch(e){return console.error("Erro ao desativar operação:",e),!1}}async getActiveOperations(t,e){try{const a=await b.collection("espionageOperations").where("spyCountryId","==",t).where("active","==",!0).get(),i=[];for(const n of a.docs){const o=n.data();o.id=n.id,o.validUntilTurn>=e?i.push(o):await this.deactivateOperation(n.id)}return i}catch(a){return console.error("Erro ao buscar operações ativas:",a),[]}}async getSpyingAttempts(t){try{return(await b.collection("espionageOperations").where("targetCountryId","==",t).where("detected","==",!0).get()).docs.map(a=>({id:a.id,...a.data()}))}catch(e){return console.error("Erro ao buscar tentativas de espionagem:",e),[]}}async createDetectionNotification(t,e,a){try{const i={countryId:t,type:"espionage_detected",message:a?`⚠️ Espionagem detectada! ${e} conseguiu acessar informações classificadas.`:`🛡️ Tentativa de espionagem bloqueada! ${e} tentou acessar informações mas foi impedido.`,spyCountry:e,succeeded:a,read:!1,createdAt:new Date().toISOString()};await b.collection("notifications").add(i)}catch(i){console.error("Erro ao criar notificação:",i)}}async updateCounterIntelligence(t,e){try{const a=Math.max(0,Math.min(10,parseFloat(e)||0));return await b.collection("paises").doc(t).update({CounterIntelligence:a}),{success:!0,newValue:a}}catch(a){return console.error("Erro ao atualizar contra-espionagem:",a),{success:!1,error:a.message}}}calculateBudget(t){const e=parseFloat(t.PIB)||0,a=(parseFloat(t.Burocracia)||0)/100,i=(parseFloat(t.Estabilidade)||0)/100;return e*.25*a*i*1.5}async cleanExpiredOperations(t){try{const e=await b.collection("espionageOperations").where("active","==",!0).get();let a=0;for(const i of e.docs)i.data().validUntilTurn<t&&(await this.deactivateOperation(i.id),a++);return console.log(`🧹 ${a} operações de espionagem expiradas foram limpas.`),a}catch(e){return console.error("Erro ao limpar operações expiradas:",e),0}}getLevels(){return G}}const y=new ze;class He{constructor(){this.modal=null,this.targetCountry=null,this.spyCountry=null,this.currentTurn=0,this.selectedLevel="basic",this.selectedDuration=3,this.createModal()}createModal(){this.modal=document.createElement("div"),this.modal.id="espionage-modal",this.modal.className="hidden fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm",this.modal.innerHTML=`
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
    `,document.body.appendChild(this.modal),this.attachEventListeners()}attachEventListeners(){const t=this.modal.querySelector("#close-espionage-modal"),e=this.modal.querySelector("#cancel-espionage");t.addEventListener("click",()=>this.hide()),e.addEventListener("click",()=>this.hide()),this.modal.addEventListener("click",o=>{o.target===this.modal&&this.hide()});const a=this.modal.querySelector("#espionage-duration"),i=this.modal.querySelector("#duration-display");a.addEventListener("input",o=>{this.selectedDuration=parseInt(o.target.value),i.textContent=`${this.selectedDuration} turno${this.selectedDuration>1?"s":""}`,this.updateCostAndChance()}),this.modal.querySelector("#confirm-espionage").addEventListener("click",()=>this.confirmOperation())}async show(t,e,a){this.targetCountry=t,this.spyCountry=e,this.currentTurn=a,this.modal.querySelector("#espionage-target-name").textContent=`Alvo: ${t.Pais}`,this.renderLevels();const i=y.calculateBudget(e);this.modal.querySelector("#available-budget").textContent=g(i),this.updateCostAndChance(),this.modal.classList.remove("hidden"),this.modal.querySelector("#operation-result").classList.add("hidden")}hide(){this.modal.classList.add("hidden")}renderLevels(){const t=this.modal.querySelector("#espionage-levels"),e=y.getLevels();t.innerHTML=Object.entries(e).map(([a,i])=>`
      <button
        class="espionage-level-btn text-left p-4 rounded-xl border transition ${a===this.selectedLevel?"border-brand-500 bg-brand-500/10":"border-slate-700 bg-slate-800/50 hover:border-slate-600"}"
        data-level="${a}"
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
    `).join(""),t.querySelectorAll(".espionage-level-btn").forEach(a=>{a.addEventListener("click",i=>{this.selectedLevel=i.currentTarget.dataset.level,this.renderLevels(),this.updateCostAndChance()})})}updateCostAndChance(){if(!this.targetCountry||!this.spyCountry)return;const t=y.calculateOperationCost(this.selectedLevel,this.selectedDuration,this.targetCountry);this.modal.querySelector("#operation-cost").textContent=g(t);const e=y.calculateSuccessChance(this.selectedLevel,this.spyCountry,this.targetCountry),a=Math.round(e*100),i=this.modal.querySelector("#success-chance"),n=this.modal.querySelector("#chance-bar"),o=this.modal.querySelector("#chance-indicator");i.textContent=`${a}%`,n.style.width=`${a}%`,a>=70?(i.className="text-xl font-bold text-green-400",n.className="h-2 rounded-full bg-green-500 transition-all duration-300",o.textContent="Alta",o.className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400"):a>=40?(i.className="text-xl font-bold text-amber-400",n.className="h-2 rounded-full bg-amber-500 transition-all duration-300",o.textContent="Média",o.className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400"):(i.className="text-xl font-bold text-red-400",n.className="h-2 rounded-full bg-red-500 transition-all duration-300",o.textContent="Baixa",o.className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400");const r=y.calculateBudget(this.spyCountry),l=this.modal.querySelector("#confirm-espionage");l.disabled=t>r}async confirmOperation(){const t=this.modal.querySelector("#confirm-espionage");t.disabled=!0,t.textContent="⏳ Processando...";const e=await y.initiateOperation(this.spyCountry,this.targetCountry,this.selectedLevel,this.selectedDuration,this.currentTurn);this.showResult(e),t.disabled=!1,t.textContent="🕵️ Iniciar Operação"}showResult(t){const e=this.modal.querySelector("#operation-result"),a=this.modal.querySelector("#result-icon"),i=this.modal.querySelector("#result-title"),n=this.modal.querySelector("#result-message");if(t.success&&t.succeeded){e.className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30",a.textContent="✅",i.textContent="Operação Bem-Sucedida!",i.className="font-bold text-lg mb-1 text-green-400";let o=`Sua operação de espionagem contra ${this.targetCountry.Pais} foi bem-sucedida! Você terá acesso às informações confidenciais pelos próximos ${this.selectedDuration} turnos.`;t.detected&&(o+=" ⚠️ No entanto, sua operação foi detectada pelo sistema de contra-espionagem deles."),n.textContent=o,n.className="text-sm text-green-300"}else if(t.success&&!t.succeeded){e.className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30",a.textContent="❌",i.textContent="Operação Falhou",i.className="font-bold text-lg mb-1 text-red-400";let o=`Sua tentativa de espionagem contra ${this.targetCountry.Pais} foi bloqueada. `;t.detected?o+="Pior ainda: sua operação foi detectada! Eles sabem que você tentou espiá-los.":o+="Felizmente, não foram detectados agentes seus na operação.",n.textContent=o,n.className="text-sm text-red-300"}else e.className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30",a.textContent="⚠️",i.textContent="Erro",i.className="font-bold text-lg mb-1 text-amber-400",n.textContent=t.error||"Ocorreu um erro ao processar a operação.",n.className="text-sm text-amber-300";e.classList.remove("hidden"),t.success&&setTimeout(()=>{this.hide(),window.location.reload()},5e3)}}const Ue=new He;function Ie(s,t){if(!s||!t)return;const e=parseFloat(s.CounterIntelligence)||0,i=y.calculateBudget(s)*(e/100);let n,o,r;e>=6?(n="Alta",o="green",r="🛡️"):e>=3?(n="Média",o="amber",r="🔒"):(n="Baixa",o="red",r="⚠️");const l=`
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
  `;t.innerHTML=l,Ve(s),Te(s.id)}function Ve(s){const t=document.getElementById("counter-intel-slider"),e=document.getElementById("counter-intel-value"),a=document.getElementById("counter-intel-cost"),i=document.getElementById("save-counter-intel"),n=document.getElementById("refresh-attempts");!t||!e||!a||!i||(t.addEventListener("input",o=>{const r=parseFloat(o.target.value);e.textContent=`${r}%`;const c=y.calculateBudget(s)*(r/100);a.textContent=`${g(c)}/turno`}),i.addEventListener("click",async()=>{const o=parseFloat(t.value);i.disabled=!0,i.textContent="⏳ Salvando...";const r=await y.updateCounterIntelligence(s.id,o),l=document.getElementById("counter-intel-feedback"),c=document.getElementById("counter-intel-feedback-text");r.success?(l.className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30",c.className="text-sm text-green-300",c.textContent=`✅ Configuração salva! Nível de contra-espionagem: ${r.newValue}%`,s.CounterIntelligence=r.newValue,setTimeout(()=>{const p=document.getElementById("counter-intel-container");p&&Ie(s,p)},2e3)):(l.className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30",c.className="text-sm text-red-300",c.textContent=`❌ Erro ao salvar: ${r.error}`),l.classList.remove("hidden"),i.disabled=!1,i.textContent="💾 Salvar Configuração",setTimeout(()=>{l.classList.add("hidden")},5e3)}),n&&n.addEventListener("click",()=>{Te(s.id)}))}async function Te(s){const t=document.getElementById("detected-attempts-list");if(t){t.innerHTML='<p class="text-xs text-slate-400">⏳ Carregando...</p>';try{const e=await y.getSpyingAttempts(s);if(e.length===0){t.innerHTML=`
        <div class="p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-center">
          <p class="text-xs text-slate-400">✅ Nenhuma tentativa detectada recentemente</p>
        </div>
      `;return}e.sort((i,n)=>new Date(n.createdAt)-new Date(i.createdAt));const a=e.slice(0,5);t.innerHTML=a.map(i=>{const n=!i.succeeded,o=n?"🛡️":"⚠️",r=n?"BLOQUEADO":"SUCESSO",l=n?"green":"red",c=Math.max(0,i.startTurn);return`
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
            Nível: ${Ge[i.level]?.name||i.level} •
            Turno ${i.startTurn}
            ${i.active?` • Válido até turno ${i.validUntilTurn}`:""}
          </p>
        </div>
      `}).join("")}catch(e){console.error("Erro ao carregar tentativas:",e),t.innerHTML=`
      <div class="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
        <p class="text-xs text-red-300">❌ Erro ao carregar tentativas</p>
      </div>
    `}}}const Ge={basic:{name:"Básica"},intermediate:{name:"Intermediária"},total:{name:"Total"}},I={tradecraft_basic:{id:"tradecraft_basic",name:"Tradecraft Básico",year:1954,era:1,icon:"🎓",description:"Treinamento formal em técnicas de agente: identidades falsas, contatos seguros, evasão, dead drops",flavorText:"Formação essencial para operações encobertas. Todo agente precisa dominar o básico.",effects:{humintSuccess:10,operativeDetectionReduction:5,fakeIdentitiesPerSemester:1},baseCost:5e8,prerequisites:[],minTechCivil:15,researchTime:1,category:"humint"},sigint_radio:{id:"sigint_radio",name:"Interceptação de Rádio",year:1955,era:1,icon:"📡",description:"Equipamentos para escutar comunicações rádio inimigas e catalogar tráfego",flavorText:"As ondas de rádio carregam segredos. Quem souber ouvir, terá vantagem.",effects:{sigintIntel:15,revealsMovements:!0},baseCost:75e7,prerequisites:["tradecraft_basic"],minTechCivil:20,researchTime:1,category:"sigint"},counter_recon_passive:{id:"counter_recon_passive",name:"Contra-Reconhecimento Passivo",year:1956,era:1,icon:"🛡️",description:"Unidades de contra-espionagem, triagem de suspeitos, segurança em instalações",flavorText:"Vigilância constante. Todo visitante é um suspeito em potencial.",effects:{passiveDetection:20,sabotageReduction:15,detectorsPerProvince:1},baseCost:1e9,prerequisites:["tradecraft_basic"],minTechCivil:20,researchTime:1,category:"counterintel"},crypto_field:{id:"crypto_field",name:"Criptografia de Campo",year:1957,era:1,icon:"🔐",description:"Sistemas de cifra para comunicações (one-time pad limitado, rolos de cifra)",flavorText:"Mensagens que só os destinatários podem ler. A primeira linha de defesa.",effects:{enemyInterceptionReduction:25,secureCommunications:!0},baseCost:85e7,prerequisites:["sigint_radio"],minTechCivil:25,researchTime:1,category:"sigint"},sabotage_industrial:{id:"sabotage_industrial",name:"Sabotagem Industrial",year:1958,era:2,icon:"💣",description:"Técnicas para atacar instalações industriais (incêndios, sabotagem, contaminação)",flavorText:"Destruição silenciosa. Uma fábrica parada vale mais que mil soldados.",effects:{sabotageEnabled:!0,productionReduction:25,sabotageSuccessBase:35,diplomaticRisk:"high"},baseCost:125e7,prerequisites:["tradecraft_basic","sigint_radio"],minTechCivil:30,researchTime:2,category:"covert_ops"},direction_finding:{id:"direction_finding",name:"Direction Finding",year:1959,era:2,icon:"📍",description:"Triangulação de transmissores rádio e localização de estações clandestinas",flavorText:"Toda transmissão deixa rastros. Nós seguimos esses rastros.",effects:{locateTransmissions:30,identificationSpeed:50,captureRadioOperatives:!0},baseCost:18e4,prerequisites:["sigint_radio"],minTechCivil:30,researchTime:1,category:"sigint"},psychological_warfare:{id:"psychological_warfare",name:"Guerra Psicológica",year:1960,era:2,icon:"🎭",description:"Propaganda, emissoras clandestinas, panfletagem, apoio a grupos de oposição",flavorText:"Vencer mentes é mais eficaz que vencer batalhas.",effects:{influenceIdeology:!0,sowDissent:!0,stabilityReduction:[8,15],languageBonus:!0},baseCost:15e8,prerequisites:["tradecraft_basic","crypto_field"],minTechCivil:35,researchTime:2,category:"covert_ops"},forensic_tactical:{id:"forensic_tactical",name:"Forense Tático",year:1961,era:2,icon:"🔬",description:"Investigação para rastrear explosivos, materiais e descobrir autoria de sabotagens",flavorText:"Todo crime deixa evidências. Nós as encontramos.",effects:{identifyAuthors:25,sabotageEffectReduction:50,forensicAnalysis:!0},baseCost:1e9,prerequisites:["counter_recon_passive"],minTechCivil:35,researchTime:1,category:"counterintel"},cryptanalysis:{id:"cryptanalysis",name:"Criptoanálise",year:1962,era:2,icon:"🔓",description:"Quebrar cifras de nível campo (análise estatística, máquinas de apoio)",flavorText:"Nenhum código é inquebrável. Apenas uma questão de tempo e recursos.",effects:{breakCodes:!0,passiveIntel:30,duration:30,requiresMaintenance:!0},baseCost:175e7,prerequisites:["crypto_field","sigint_radio"],minTechCivil:40,researchTime:2,category:"sigint"},recruitment_native:{id:"recruitment_native",name:"Recrutamento de Nativos",year:1963,era:3,icon:"👥",description:"Recrutar agentes locais com aparência e contatos genuínos",flavorText:"O melhor espião é aquele que pertence ao lugar.",effects:{recruitmentSuccess:35,nativeDetectionReduction:15,intelBonus:20},baseCost:22e4,prerequisites:["tradecraft_basic"],minTechCivil:40,researchTime:2,category:"humint"},interrogation_advanced:{id:"interrogation_advanced",name:"Interrogatório Avançado",year:1964,era:3,icon:"🗣️",description:"Métodos formais para extrair informação de operativos capturados",flavorText:"Todo homem tem um ponto de quebra. Nossa função é encontrá-lo.",effects:{intelFromCaptured:50,identifyNetworks:!0,reputationCost:-5},baseCost:18e4,prerequisites:["forensic_tactical"],minTechCivil:40,researchTime:1,category:"counterintel"},wiretap:{id:"wiretap",name:"Escutas Telefônicas",year:1965,era:3,icon:"📞",description:"Interceptação telefônica em grande escala, técnicas para ocultar escutas",flavorText:"Toda ligação é uma confissão esperando para ser gravada.",effects:{wiretapEnabled:!0,internalCommsIntel:35,generatesEvidence:!0,requiresInsiders:!0},baseCost:28e4,prerequisites:["sigint_radio","forensic_tactical"],minTechCivil:45,researchTime:2,category:"sigint"},sabotage_naval:{id:"sabotage_naval",name:"Sabotagem Naval",year:1966,era:3,icon:"⚓",description:"Técnicas contra infraestrutura naval: minas improvisadas, sabotagem em docas",flavorText:"Controlar os mares começa nos portos.",effects:{harborSabotage:!0,supplyReduction:35,portSecurityDependent:!0},baseCost:32e4,prerequisites:["sabotage_industrial","direction_finding"],minTechCivil:50,researchTime:2,category:"covert_ops"},surveillance_electronic:{id:"surveillance_electronic",name:"Vigilância Eletrônica",year:1967,era:3,icon:"📹",description:"Câmeras simples, microfones escondidos, rastreadores mecânicos",flavorText:"Olhos e ouvidos em todo lugar. Nada passa despercebido.",effects:{defensiveOpsBonus:25,detectMeetings:25,plantDevice:!0},baseCost:2e9,prerequisites:["wiretap","forensic_tactical"],minTechCivil:50,researchTime:2,category:"counterintel"},double_agents:{id:"double_agents",name:"Contra-Inteligência Ativa",year:1968,era:4,icon:"🎭",description:"Manipular agentes capturados para alimentar desinformação",flavorText:"O maior trunfo é fazer o inimigo acreditar em suas próprias mentiras.",effects:{turnAgent:!0,feedFalseIntel:!0,enemyPlanningReduction:30,exposureRisk:"high"},baseCost:225e7,prerequisites:["interrogation_advanced","cryptanalysis"],minTechCivil:55,researchTime:3,category:"counterintel"},biometrics_id:{id:"biometrics_id",name:"Sistemas de Identificação",year:1969,era:4,icon:"🆔",description:"Sistema centralizado: fotos, impressões digitais, controle de fronteiras",flavorText:"Conhecer cada rosto, cada impressão digital. Controle total.",effects:{enemyMobilityReduction:35,fakeIdDifficulty:50,borderDetection:25},baseCost:45e4,prerequisites:["surveillance_electronic","recruitment_native"],minTechCivil:60,researchTime:2,category:"counterintel"},crypto_automation:{id:"crypto_automation",name:"Automação Cripto & Fusão de Sinais",year:1970,era:4,icon:"🖥️",description:"Mainframes iniciais, fusão de dados, alertas em tempo real",flavorText:"A era da computação. Processamento que humanos jamais alcançariam.",effects:{decryptionSpeedBonus:40,sigintIntelBonus:20,realTimeAlerts:!0},baseCost:25e8,prerequisites:["cryptanalysis","direction_finding","wiretap","surveillance_electronic"],minTechCivil:65,researchTime:3,category:"sigint"}},M={CRITICAL_FAILURE:{range:[1,3],name:"Falha Crítica",icon:"💥",costLoss:.5,waitTurns:2,message:"Projeto comprometido! Recursos perdidos e pesquisa suspensa."},FAILURE:{range:[4,6],name:"Falha",icon:"❌",costLoss:.25,waitTurns:1,message:"Pesquisa falhou. Recursos parcialmente perdidos."},PARTIAL_SUCCESS:{range:[7,9],name:"Sucesso Parcial",icon:"⚠️",progress:50,waitTurns:0,message:"Progresso parcial (50%). Continue no próximo turno."},TOTAL_SUCCESS:{range:[10,12],name:"Sucesso Total",icon:"✅",unlocked:!0,waitTurns:0,message:"Sucesso! Tecnologia desbloqueada."}};class Ke{constructor(){this.activeResearches=new Map}calculateModifiers(t,e,a){let i=0;const n=parseFloat(a.TecnologiaCivil)||parseFloat(a.Tecnologia)||0;n>60&&(i+=1),n<30&&(i-=2),(t.tier==="powerful"||t.tier==="elite")&&(i+=1);const o=this.getRelatedTechnologies(e.id,t.technologies);o>=2?i+=2:o>=1&&(i+=1);const r=e.category;return(t.focus==="external_espionage"&&(r==="humint"||r==="sigint")||t.focus==="counterintelligence"&&r==="counterintel"||t.focus==="covert_operations"&&r==="covert_ops")&&(i+=1),i}getRelatedTechnologies(t,e){const a=I[t];if(!a)return 0;let i=0;return a.prerequisites.forEach(n=>{e.includes(n)&&i++}),Object.values(I).forEach(n=>{n.category===a.category&&e.includes(n.id)&&n.id!==t&&i++}),i}rollD12(t=0){const e=Math.floor(Math.random()*12)+1,a=e+t;return{baseRoll:e,modifiers:t,finalRoll:Math.max(1,a)}}determineResult(t){const e=t.finalRoll;return e<=3?M.CRITICAL_FAILURE:e<=6?M.FAILURE:e<=9?M.PARTIAL_SUCCESS:M.TOTAL_SUCCESS}checkPrerequisites(t,e){const a=I[t];if(!a)return{valid:!1,missing:[]};const i=a.prerequisites.filter(n=>!e.includes(n));return{valid:i.length===0,missing:i.map(n=>I[n]?.name||n)}}checkTechCivil(t,e){const a=I[t];return a?(parseFloat(e.TecnologiaCivil)||parseFloat(e.Tecnologia)||0)>=a.minTechCivil:!1}async startResearch(t,e,a,i){try{const n=await b.collection("agencies").doc(t).get();if(!n.exists)return{success:!1,error:"Agência não encontrada!"};const o=n.data();if(o.currentResearch&&o.currentResearch.techId)return{success:!1,error:"Já existe uma pesquisa em andamento!"};const r=I[e];if(!r)return{success:!1,error:"Tecnologia não encontrada!"};if(o.technologies&&o.technologies.includes(e))return{success:!1,error:"Esta tecnologia já foi desbloqueada!"};const l=this.checkPrerequisites(e,o.technologies||[]);if(!l.valid)return{success:!1,error:`Pré-requisitos não atendidos: ${l.missing.join(", ")}`};if(!this.checkTechCivil(e,a))return{success:!1,error:`Tecnologia Civil insuficiente! Necessário: ${r.minTechCivil}%`};const c=T.calculateCostByPIB(r.baseCost,a);if(o.budget<c)return{success:!1,error:"Orçamento da agência insuficiente!"};const p={techId:e,techName:r.name,progress:0,startedTurn:i,rollsAttempted:0,cost:c,totalSpent:0};await b.collection("agencies").doc(t).update({currentResearch:p});const u=parseFloat(a.OrcamentoGasto||0);return await b.collection("paises").doc(a.id).update({OrcamentoGasto:u+c}),{success:!0,research:p,tech:r,cost:c,budgetSpent:c}}catch(n){return console.error("Erro ao iniciar pesquisa:",n),{success:!1,error:"Erro ao processar pesquisa: "+n.message}}}async attemptResearch(t,e,a){try{const i=await b.collection("agencies").doc(t).get();if(!i.exists)return{success:!1,error:"Agência não encontrada!"};const n=i.data();if(!n.currentResearch||!n.currentResearch.techId)return{success:!1,error:"Nenhuma pesquisa em andamento!"};const o=n.currentResearch,r=I[o.techId],l=this.calculateModifiers(n,r,e),c=this.rollD12(l),p=this.determineResult(c),u=o.cost*(p.costLoss||0);let m={"currentResearch.rollsAttempted":o.rollsAttempted+1,"currentResearch.totalSpent":o.totalSpent+u};if(p.unlocked)m={technologies:[...n.technologies||[],o.techId],currentResearch:null},r.category==="humint"&&(m.operatives=(n.operatives||0)+5);else if(p.progress){const v=(o.progress||0)+p.progress;v>=100?(m={technologies:[...n.technologies||[],o.techId],currentResearch:null},r.category==="humint"&&(m.operatives=(n.operatives||0)+5)):m["currentResearch.progress"]=v}else p===M.CRITICAL_FAILURE&&(m["currentResearch.progress"]=Math.max(0,(o.progress||0)-25));return await updateDoc(agencyRef,m),{success:!0,roll:c,result:p,cost:u,unlocked:p.unlocked||!1,tech:r}}catch(i){return console.error("Erro ao tentar pesquisa:",i),{success:!1,error:"Erro ao processar tentativa: "+i.message}}}async cancelResearch(t){try{const e=doc(b,"agencies",t);return await b.collection("agencies").doc(t).update({currentResearch:null}),{success:!0}}catch(e){return console.error("Erro ao cancelar pesquisa:",e),{success:!1,error:e.message}}}getAllTechnologies(){return I}getTechnologiesByEra(t){return Object.values(I).filter(e=>e.era===t)}getAvailableTechnologies(t,e){const a=parseFloat(e.TecnologiaCivil)||parseFloat(e.Tecnologia)||0;return Object.values(I).filter(i=>!(t.includes(i.id)||!i.prerequisites.every(o=>t.includes(o))||a<i.minTechCivil))}}const N=new Ke,R={low:{name:"Baixa",icon:"🟢",color:"green",baseCost:1e5},medium:{name:"Média",icon:"🟡",color:"amber",baseCost:2e5},high:{name:"Alta",icon:"🔴",color:"red",baseCost:3e5},critical:{name:"Crítica",icon:"⚫",color:"purple",baseCost:5e5}},Ce=["Instalações Militares","Telecomunicações","Infraestrutura Crítica","Governo Central","Indústria de Defesa","Pesquisa e Desenvolvimento","Inteligência Nacional","Fronteiras","Portos e Aeroportos"];class We{constructor(){this.alerts=new Map}determineSeverity(t){const e=t.phase||1;return e===1?"low":e===2?"medium":e===3?"high":"critical"}determineAffectedSector(){return Ce[Math.floor(Math.random()*Ce.length)]}async createSecurityAlert(t,e,a,i=20){try{const n=this.determineSeverity(t),o=this.determineAffectedSector(),r={targetCountryId:t.targetCountryId,targetCountryName:t.targetCountryName,spyCountryId:i>=80?t.spyCountryId:null,spyCountryName:i>=80?t.spyCountryName:null,spyAgencyId:i>=100?t.agencyId:null,operationId:t.id||null,detectedTurn:a,severity:n,severityName:R[n].name,sector:o,exposureLevel:i,status:"pending",investigation:{started:!1,startedTurn:null,cost:null,result:null,rollResult:null},revealed:null,createdAt:new Date().toISOString()},l=await ke(U(b,"security_alerts"),r);return{success:!0,alert:{...r,id:l.id}}}catch(n){return console.error("Erro ao criar alerta:",n),{success:!1,error:n.message}}}calculateInvestigationCost(t,e){const i=R[t.severity].baseCost;return T.calculateCostByPIB(i,e)}calculateInvestigationModifiers(t,e,a){let i=0;return t.technologies&&(t.technologies.includes("forensic_tactical")&&(i+=2),t.technologies.includes("surveillance_electronic")&&(i+=2),t.technologies.includes("double_agents")&&(i+=3),t.technologies.includes("biometrics_id")&&(i+=2)),(t.tier==="powerful"||t.tier==="elite")&&(i+=1),t.focus==="counterintelligence"&&(i+=2),(parseFloat(a.TecnologiaCivil)||parseFloat(a.Tecnologia)||0)>60&&(i+=1),(parseFloat(a.Urbanizacao)||0)>70&&(i+=1),(e.severity==="high"||e.severity==="critical")&&(i+=1),i}rollInvestigation(t=0){const e=Math.floor(Math.random()*12)+1,a=e+t;return{baseRoll:e,modifiers:t,finalRoll:Math.max(1,a)}}determineInvestigationResult(t,e,a){const i=t.finalRoll;return i<=3?{success:!1,critical:!0,level:"CRITICAL_FAILURE",message:"Investigação comprometida! Suspeitos alertados e fugiram.",revealed:null,penalty:"Espionagem inimiga acelera (próxima fase em -1 turno)",actions:[]}:i<=6?{success:!1,level:"FAILURE",message:"Investigação não encontrou evidências conclusivas.",revealed:{level:"VAGUE",info:"Possível origem: "+this.getVagueRegion(a)},actions:[]}:i<=9?{success:!0,level:"PARTIAL",message:"Investigação revelou informações parciais.",revealed:{level:"PARTIAL",region:this.getRegion(a),operativesCount:`estimativa: ${a.operativesDeployed-2}-${a.operativesDeployed+2}`,phase:Fe[a.phase]?.name||"Desconhecida",info:`País suspeito está na região: ${this.getRegion(a)}`},bonus:"+20% detecção contra suspeitos por 3 turnos",actions:["AUMENTAR_VIGILANCIA"]}:{success:!0,level:"COMPLETE",message:"Rede de espionagem identificada e neutralizada!",revealed:{level:"COMPLETE",spyCountry:a.spyCountryName,spyAgency:a.agencyId,operativesCount:a.operativesDeployed,phase:a.phase,coverIdentities:a.coverIdentities,startedTurn:a.startedTurn,info:`${a.spyCountryName} está operando espionagem contra você!`},bonus:"Operativos capturados",actions:["DENUNCIAR_PUBLICAMENTE","CAPTURAR_OPERATIVOS","VIRAR_AGENTES","EXPULSAR_DIPLOMATAS","NEGOCIAR_SECRETO","RETALIACAO_ENCOBERTA"]}}async investigateAlert(t,e,a,i){try{const n=xe(b,"security_alerts",t),o=await fe(n);if(!o.exists())return{success:!1,error:"Alerta não encontrado!"};const r=o.data();if(r.investigation.started)return{success:!1,error:"Este alerta já está sendo investigado!"};const l=this.calculateInvestigationCost(r,a);if(e.budget<l)return{success:!1,error:"Orçamento da agência insuficiente!"};let c=null;if(r.operationId){const v=await fe(xe(b,"espionage_operations",r.operationId));v.exists()&&(c=v.data())}const p=this.calculateInvestigationModifiers(e,r,a),u=this.rollInvestigation(p),m=this.determineInvestigationResult(u,r,c);return await De(n,{"investigation.started":!0,"investigation.startedTurn":i,"investigation.cost":l,"investigation.rollResult":u,"investigation.result":m.level,revealed:m.revealed,status:m.success?"resolved":"investigated"}),{success:!0,roll:u,result:m,cost:l}}catch(n){return console.error("Erro ao investigar alerta:",n),{success:!1,error:n.message}}}async getCountryAlerts(t,e="pending"){try{const a=he(U(b,"security_alerts"),V("targetCountryId","==",t),V("status","==",e));return(await ye(a)).docs.map(n=>({id:n.id,...n.data()}))}catch(a){return console.error("Erro ao buscar alertas:",a),[]}}async getAllCountryAlerts(t){try{const e=he(U(b,"security_alerts"),V("targetCountryId","==",t)),i=(await ye(e)).docs.map(n=>({id:n.id,...n.data()}));return i.sort((n,o)=>new Date(o.createdAt)-new Date(n.createdAt)),i}catch(e){return console.error("Erro ao buscar todos os alertas:",e),[]}}getVagueRegion(t){const e=["América do Sul","América do Norte","Europa Ocidental","Europa Oriental","Ásia","África","Oriente Médio"];return e[Math.floor(Math.random()*e.length)]}getRegion(t){return this.getVagueRegion(t)}getSeverityLevels(){return R}}const Y=new We;function Ze(s,t,e){if(!e||!s)return;const a=`
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
  `;e.innerHTML=a,J(s,t)}async function J(s,t){const e=document.getElementById("pending-alerts-list"),a=document.getElementById("resolved-alerts-list"),i=document.getElementById("pending-count-badge"),n=document.getElementById("resolved-count-badge");if(!e||!a)return;e.innerHTML='<p class="text-sm text-slate-400">⏳ Carregando alertas...</p>',a.innerHTML='<p class="text-sm text-slate-400">⏳ Carregando...</p>';try{const r=await Y.getAllCountryAlerts(s.id),l=r.filter(u=>u.status==="pending"),c=r.filter(u=>u.status==="resolved"||u.status==="investigated");i.textContent=l.length,n.textContent=c.length,l.length===0?e.innerHTML=`
        <div class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center">
          <p class="text-sm text-emerald-300">✅ Nenhuma ameaça ativa detectada</p>
        </div>
      `:(e.innerHTML=l.map(u=>Ye(u,t,s)).join(""),Qe(s,t));const p=c.slice(0,5);p.length===0?a.innerHTML=`
        <div class="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <p class="text-sm text-slate-400">Nenhuma investigação concluída ainda</p>
        </div>
      `:a.innerHTML=p.map(u=>Je(u)).join("")}catch(r){console.error("Erro ao carregar alertas:",r),e.innerHTML='<p class="text-sm text-red-400">❌ Erro ao carregar alertas</p>'}const o=document.getElementById("refresh-alerts-btn");o&&o.addEventListener("click",()=>J(s,t))}function Ye(s,t,e){const a=R[s.severity],i=Y.calculateInvestigationCost(s,e);return`
    <div class="p-4 rounded-xl border border-${a.color}-500/30 bg-${a.color}-500/10">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">${a.icon}</span>
          <div>
            <h6 class="font-semibold text-slate-100">Espionagem Detectada</h6>
            <p class="text-xs text-slate-400">Turno #${s.detectedTurn}</p>
          </div>
        </div>
        <span class="px-2 py-0.5 rounded-full bg-${a.color}-500/20 text-${a.color}-400 text-xs font-bold">
          ${a.name}
        </span>
      </div>

      <div class="space-y-2 mb-3">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Setor afetado:</span>
          <span class="text-slate-200 font-medium">${s.sector}</span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-400">Nível de exposição:</span>
          <span class="text-${a.color}-400 font-medium">${s.exposureLevel}%</span>
        </div>
      </div>

      <p class="text-xs text-slate-400 mb-3 p-2 bg-slate-900/50 rounded">
        Nossa contra-espionagem detectou atividade suspeita que pode indicar operação estrangeira em território nacional.
      </p>

      <div class="flex gap-2">
        <button
          class="investigate-btn flex-1 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition"
          data-alert-id="${s.id}"
          data-cost="${i}"
        >
          🔍 Investigar - ${g(i)}
        </button>
        <button class="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition">
          Ignorar
        </button>
      </div>
    </div>
  `}function Je(s){const t=s.investigation||{},e=t.result;let a="✅",i="Investigação Concluída",n="green";e==="CRITICAL_FAILURE"?(a="💥",i="Falha Crítica",n="red"):e==="FAILURE"?(a="❌",i="Falha",n="red"):e==="PARTIAL"?(a="⚠️",i="Sucesso Parcial",n="amber"):e==="COMPLETE"&&(a="🎯",i="Sucesso Total",n="green");const o=s.revealed||{};return`
    <div class="p-4 rounded-xl border border-${n}-500/30 bg-${n}-500/10">
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <span class="text-xl">${a}</span>
          <div>
            <h6 class="font-semibold text-${n}-300">${i}</h6>
            <p class="text-xs text-slate-400">Turno #${t.startedTurn||s.detectedTurn}</p>
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
  `}function Qe(s,t){document.querySelectorAll(".investigate-btn").forEach(a=>{a.addEventListener("click",async i=>{const n=i.currentTarget.dataset.alertId,o=parseInt(i.currentTarget.dataset.cost);if(confirm(`Investigar esta ameaça custará ${g(o)}. Confirmar?`)){a.disabled=!0,a.textContent="⏳ Investigando...";try{const r=window.appState?.currentTurn||0,l=await Y.investigateAlert(n,t,s,r);l.success?(Xe(l),setTimeout(()=>{J(s,t)},3e3)):(alert("Erro: "+l.error),a.disabled=!1,a.textContent=`🔍 Investigar - ${g(o)}`)}catch(r){console.error("Erro ao investigar:",r),alert("Erro ao processar investigação"),a.disabled=!1,a.textContent=`🔍 Investigar - ${g(o)}`}}})})}function Xe(s){const{roll:t,result:e,cost:a}=s;let i=`
🎲 Rolagem: ${t.baseRoll} + ${t.modifiers} = ${t.finalRoll}

${e.message}

Custo: ${g(a)}
  `;e.revealed&&e.revealed.spyCountry&&(i+=`

🚨 PAÍS IDENTIFICADO: ${e.revealed.spyCountry}`),alert(i)}async function et(){try{return(await window.db.collection("paises").get()).docs.map(t=>({id:t.id,...t.data()}))}catch(s){return console.error("Erro ao buscar países:",s),[]}}async function A(s,t){if(!t||!s)return;const e=await T.getAgency(s.id);if(!e){t.innerHTML=`
      <div class="text-center py-12">
        <span class="text-6xl mb-4 block">🕵️</span>
        <h3 class="text-2xl font-bold text-slate-100 mb-2">Agência de Inteligência</h3>
        <p class="text-slate-400 mb-6">Você ainda não possui uma agência de inteligência.</p>
        <button id="open-agency-foundation" class="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold transition">
          🕵️ Fundar Agência
        </button>
      </div>
    `;const i=document.getElementById("open-agency-foundation");i&&i.addEventListener("click",()=>{qe(()=>import("./agencyFoundationModal-D2ZeUHmt.js"),__vite__mapDeps([0,1,2,3])).then(n=>{const o=window.appState?.currentTurn||0;n.default.show(s,o)})});return}const a=`
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
              <span class="text-3xl">${T.getTiers()[e.tier].icon}</span>
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
  `;t.innerHTML=a,tt(e),Ee(e,s),at(e,s),dt(e,s)}async function tt(s){const t=await O.getAgencyOperations(s.id),e=document.getElementById("active-ops-count");e&&(e.textContent=t.length)}function at(s,t){const e=document.querySelectorAll(".agency-tab");e.forEach(a=>{a.addEventListener("click",i=>{const n=i.currentTarget.dataset.tab;e.forEach(o=>{o.classList.remove("border-brand-500","text-brand-400"),o.classList.add("border-transparent","text-slate-400")}),i.currentTarget.classList.add("border-brand-500","text-brand-400"),i.currentTarget.classList.remove("border-transparent","text-slate-400"),n==="research"?Ee(s,t):n==="operations"?$e(s,t):n==="security"&&nt(s,t)})})}function Ee(s,t){const e=document.getElementById("agency-tab-content");if(!e)return;const a=s.currentResearch,i=N.getAvailableTechnologies(s.technologies||[],t);let n="";if(a&&a.techId){const o=N.getAllTechnologies()[a.techId];n=`
      <div class="p-4 rounded-xl border border-brand-500/30 bg-brand-500/10 mb-6">
        <h5 class="font-semibold text-brand-300 mb-2">🔬 Pesquisa em Andamento</h5>
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-lg font-bold text-slate-100">${o.name}</p>
            <p class="text-sm text-slate-400 mb-2">${o.description}</p>
            <div class="flex items-center gap-4 text-sm">
              <span class="text-slate-400">Progresso: <span class="text-brand-400 font-semibold">${a.progress||0}%</span></span>
              <span class="text-slate-400">Tentativas: <span class="text-slate-300">${a.rollsAttempted||0}</span></span>
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
            <span class="text-sm text-slate-500">Custo: ${g(T.calculateCostByPIB(o.baseCost,t))}</span>
            <button class="start-research-btn px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 text-xs font-semibold transition" data-tech-id="${o.id}">
              Pesquisar
            </button>
          </div>
        </div>
      `).join("")}
    </div>

    ${i.length===0?'<p class="text-sm text-slate-400 text-center py-8">Nenhuma tecnologia disponível no momento. Desbloqueie pré-requisitos!</p>':""}
  `,a&&ot(s,t),rt(s,t)}async function $e(s,t){const e=document.getElementById("agency-tab-content");if(e){e.innerHTML=`
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-3"></div>
      <p class="text-sm text-slate-400">Carregando operações...</p>
    </div>
  `;try{const a=await O.getAgencyOperations(s.id),i=await et(),n=i.filter(o=>o.id!==t.id);e.innerHTML=`
      <div class="space-y-6">
        <!-- Botão Iniciar Nova Operação -->
        <div class="flex justify-between items-center">
          <div>
            <h5 class="text-lg font-semibold text-slate-200">🌍 Operações Ativas</h5>
            <p class="text-xs text-slate-400">${a.length} operação(ões) em andamento</p>
          </div>
          <button id="start-new-operation-btn" class="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-slate-950 font-semibold text-sm transition">
            + Nova Operação
          </button>
        </div>

        <!-- Lista de Operações Ativas -->
        <div id="operations-list" class="space-y-3">
          ${a.length===0?`
            <div class="text-center py-12 border border-dashed border-slate-700 rounded-xl">
              <span class="text-4xl mb-3 block">🕵️</span>
              <p class="text-slate-400">Nenhuma operação ativa</p>
              <p class="text-xs text-slate-500 mt-2">Inicie uma nova operação de infiltração</p>
            </div>
          `:a.map(o=>st(o,i)).join("")}
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
    `,it(s,t,n)}catch(a){console.error("Erro ao carregar operações:",a),e.innerHTML=`
      <div class="text-center py-12">
        <span class="text-4xl text-red-400 mb-4 block">❌</span>
        <p class="text-red-300">Erro ao carregar operações</p>
        <p class="text-sm text-slate-400 mt-2">${a.message}</p>
      </div>
    `}}}function st(s,t){const e=t.find(r=>r.id===s.targetCountryId),a=O.getPhases(),i=s.phase||1,n=a[i]?.name||"Fase Desconhecida",o=a[i]?.icon||"❓";return`
    <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
      <div class="flex items-start justify-between mb-3">
        <div class="flex-1">
          <h6 class="font-semibold text-slate-100">${e?.Pais||"País Desconhecido"}</h6>
          <p class="text-xs text-slate-400">Iniciado: Turno #${s.startedTurn}</p>
        </div>
        <span class="px-2 py-1 rounded text-xs font-semibold ${s.active?"bg-green-500/20 text-green-400":"bg-red-500/20 text-red-400"}">
          ${s.active?"Ativa":"Inativa"}
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
        <span class="text-slate-400">Intel: <span class="text-brand-400 font-semibold">${s.intelLevel||0}%</span></span>
        <span class="text-slate-400">Detecção: <span class="${s.detectionRisk>50?"text-red-400":"text-green-400"} font-semibold">${s.detectionRisk||0}%</span></span>
      </div>
    </div>
  `}function it(s,t,e){const a=document.getElementById("start-new-operation-btn"),i=document.getElementById("new-operation-modal"),n=document.getElementById("close-operation-modal"),o=document.getElementById("cancel-operation-btn"),r=document.getElementById("confirm-operation-btn"),l=document.getElementById("target-country-select"),c=document.getElementById("target-country-info");a?.addEventListener("click",()=>{i?.classList.remove("hidden")}),n?.addEventListener("click",()=>{i?.classList.add("hidden")}),o?.addEventListener("click",()=>{i?.classList.add("hidden")}),i?.addEventListener("click",p=>{p.target===i&&i.classList.add("hidden")}),l?.addEventListener("change",p=>{const u=p.target.value;if(u){const m=e.find(v=>v.id===u);m&&(c.classList.remove("hidden"),c.innerHTML=`
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
        `,r.disabled=!1)}else c.classList.add("hidden"),r.disabled=!0}),r?.addEventListener("click",async()=>{const p=l.value;if(p){r.disabled=!0,r.textContent="⏳ Iniciando...";try{const u=window.appState?.currentTurn||0,m=e.find(f=>f.id===p),v=await O.initiateOperation(s,m,t,4,u);v.success?(alert("Operação iniciada com sucesso!"),i.classList.add("hidden"),$e(s,t)):(alert("Erro: "+v.error),r.disabled=!1,r.textContent="Iniciar Infiltração")}catch(u){console.error("Erro ao iniciar operação:",u),alert("Erro ao processar operação"),r.disabled=!1,r.textContent="Iniciar Infiltração"}}})}function nt(s,t){const e=document.getElementById("agency-tab-content");if(!e)return;e.innerHTML='<div id="security-alerts-container"></div>';const a=document.getElementById("security-alerts-container");a&&Ze(t,s,a)}function ot(s,t){const e=document.getElementById("attempt-research-btn");e&&e.addEventListener("click",async()=>{e.disabled=!0,e.textContent="🎲 Rolando...";try{const a=window.appState?.currentTurn||0,i=await N.attemptResearch(s.id,t,a);i.success?(lt(i),setTimeout(()=>{const n=document.getElementById("agency-dashboard-container");n&&A(t,n)},2e3)):alert("Erro: "+i.error)}catch(a){console.error("Erro ao tentar pesquisa:",a),alert("Erro ao processar pesquisa")}e.disabled=!1,e.textContent="🎲 Tentar Pesquisa"})}function rt(s,t){document.querySelectorAll(".start-research-btn").forEach(a=>{a.addEventListener("click",async i=>{const n=i.currentTarget.dataset.techId;if(confirm("Iniciar pesquisa desta tecnologia?")){a.disabled=!0,a.textContent="Iniciando...";try{const o=window.appState?.currentTurn||0,r=await N.startResearch(s.id,n,t,o);if(r.success){if(alert(`Pesquisa iniciada: ${r.tech.name}
Custo: ${g(r.cost)}`),window.reloadCurrentCountry){const c=await window.reloadCurrentCountry();c&&(t=c)}const l=document.getElementById("intelligence-dashboard-container");l&&A(t,l)}else alert("Erro: "+r.error)}catch(o){console.error("Erro ao iniciar pesquisa:",o),alert("Erro ao processar")}a.disabled=!1,a.textContent="Pesquisar"}})})}function lt(s){const{roll:t,result:e,tech:a}=s;let i=`
🎲 Rolagem: ${t.baseRoll} + ${t.modifiers} = ${t.finalRoll}

${e.icon} ${e.message}
  `;e.unlocked&&(i+=`

✅ ${a.name} desbloqueada!`),alert(i)}function dt(s,t){const e=document.getElementById("budget-card");e&&e.addEventListener("click",()=>{ct(s,t)})}async function ct(s,t){const e=T.calculateBudget(t),a=s.budgetPercent,i=T.getTiers(),n=`
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
              value="${a}"
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
  `,o=document.createElement("div");o.innerHTML=n,document.body.appendChild(o);const r=document.getElementById("budget-change-modal"),l=document.getElementById("budget-slider"),c=document.getElementById("budget-preview"),p=document.getElementById("close-budget-modal"),u=document.getElementById("cancel-budget-btn"),m=document.getElementById("confirm-budget-btn");function v(x){const C=Math.round(e*(x/100)),E=T.calculateTier(x),w=i[E];c.innerHTML=`
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
          <span class="text-lg font-bold">${w.icon} ${w.name}</span>
        </div>
        ${E!==s.tier?`
          <div class="pt-2 border-t border-slate-700">
            <p class="text-xs ${E>s.tier?"text-green-400":"text-red-400"}">
              ${E>s.tier?"⬆️ Upgrade":"⬇️ Downgrade"} de tier:
              ${i[s.tier].name} → ${w.name}
            </p>
          </div>
        `:""}
      </div>
    `}v(a),l.addEventListener("input",x=>{v(parseFloat(x.target.value))});const f=()=>{r.remove()};p.addEventListener("click",f),u.addEventListener("click",f),r.addEventListener("click",x=>{x.target===r&&f()}),m.addEventListener("click",async()=>{const x=parseFloat(l.value),C=Math.round(e*(x/100)),E=T.calculateTier(x);m.disabled=!0,m.textContent="⏳ Atualizando...";try{await db.collection("agencies").doc(s.id).update({budgetPercent:x,budget:C,tier:E,tierName:i[E].name,updatedAt:new Date().toISOString()});const w=C-s.budget,q=parseFloat(t.AgencyBudgetSpent||0);if(await db.collection("paises").doc(t.id).update({AgencyBudgetSpent:q+w}),alert(`Orçamento atualizado com sucesso!

Novo orçamento: ${g(C)} (${x}%)`),f(),window.reloadCurrentCountry){const $=await window.reloadCurrentCountry();if($){const P=document.getElementById("intelligence-dashboard-container");P&&A($,P)}}}catch(w){console.error("Erro ao atualizar orçamento:",w),alert("Erro ao atualizar orçamento: "+w.message),m.disabled=!1,m.textContent="Confirmar Alteração"}})}const ut={renderAgencyDashboard:A},Rt=Object.freeze(Object.defineProperty({__proto__:null,default:ut,renderAgencyDashboard:A},Symbol.toStringTag,{value:"Module"})),d={countryListContainer:document.getElementById("lista-paises-publicos"),emptyState:document.getElementById("empty-state"),totalCountriesBadge:document.getElementById("total-paises-badge"),totalPlayers:document.getElementById("total-players"),pibMedio:document.getElementById("pib-medio"),estabilidadeMedia:document.getElementById("estabilidade-media"),paisesPublicos:document.getElementById("paises-publicos"),playerCountryName:document.getElementById("player-country-name"),playerCurrentTurn:document.getElementById("player-current-turn"),playerPib:document.getElementById("player-pib"),playerEstabilidade:document.getElementById("player-estabilidade"),playerCombustivel:document.getElementById("player-combustivel"),playerPibDelta:document.getElementById("player-pib-delta"),playerEstabilidadeDelta:document.getElementById("player-estabilidade-delta"),playerCombustivelDelta:document.getElementById("player-combustivel-delta"),playerHistorico:document.getElementById("player-historico"),playerNotifications:document.getElementById("player-notifications"),playerPanel:document.getElementById("player-panel"),userRoleBadge:document.getElementById("user-role-badge"),countryPanelModal:document.getElementById("country-panel-modal"),countryPanelContent:document.getElementById("country-panel-content"),closeCountryPanelBtn:document.getElementById("close-country-panel")};function we(s,t,e){return Math.max(t,Math.min(e,s))}function Pe(s){return s<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:s<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:s<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function Q(s){const t=(parseFloat(s.PIB)||0)/(parseFloat(s.Populacao)||1),e=we(t,0,2e4)/200,a=Math.round(e*.45+(parseFloat(s.Tecnologia)||0)*.55);return we(a,1,100)}function Be(s){const t=parseFloat(s.PIB)||0,e=(parseFloat(s.Burocracia)||0)/100,a=(parseFloat(s.Estabilidade)||0)/100;return t*.25*e*a*1.5}function X(s){const t=Be(s),e=(parseFloat(s.MilitaryBudgetPercent)||30)/100;return t*e}function ee(s){const t=(parseFloat(s.MilitaryDistributionVehicles)||40)/100,e=(parseFloat(s.MilitaryDistributionAircraft)||30)/100,a=(parseFloat(s.MilitaryDistributionNaval)||30)/100;return{vehicles:t,aircraft:e,naval:a,maintenancePercent:.15}}function pt(s){const t=X(s),e=ee(s);return t*e.vehicles}function mt(s){const t=X(s),e=ee(s);return t*e.aircraft}function gt(s){const t=X(s),e=ee(s);return t*e.naval}const vt={afeganistao:"AF",afghanistan:"AF","africa do sul":"ZA","south africa":"ZA",alemanha:"DE",germany:"DE",argentina:"AR",australia:"AU",austria:"AT",belgica:"BE",belgium:"BE",bolivia:"BO",brasil:"BR",brazil:"BR",canada:"CA",chile:"CL",china:"CN",colombia:"CO","coreia do sul":"KR","south korea":"KR","coreia do norte":"KP","north korea":"KP",cuba:"CU",dinamarca:"DK",denmark:"DK",egito:"EG",egypt:"EG",espanha:"ES",spain:"ES","estados unidos":"US",eua:"US",usa:"US","united states":"US",finlandia:"FI",franca:"FR",france:"FR",grecia:"GR",greece:"GR",holanda:"NL","paises baixos":"NL",netherlands:"NL",hungria:"HU",hungary:"HU",india:"IN",indonesia:"ID",ira:"IR",iran:"IR",iraque:"IQ",iraq:"IQ",irlanda:"IE",ireland:"IE",israel:"IL",italia:"IT",italy:"IT",japao:"JP",japan:"JP",malasia:"MY",malaysia:"MY",marrocos:"MA",morocco:"MA",mexico:"MX",nigeria:"NG",noruega:"NO",norway:"NO","nova zelandia":"NZ","new zealand":"NZ",peru:"PE",polonia:"PL",poland:"PL",portugal:"PT","reino unido":"GB",inglaterra:"GB",uk:"GB","united kingdom":"GB",russia:"RU",urss:"RU","uniao sovietica":"RU",singapura:"SG",singapore:"SG",suecia:"SE",sweden:"SE",suica:"CH",switzerland:"CH",turquia:"TR",turkey:"TR",ucrania:"UA",ukraine:"UA",uruguai:"UY",venezuela:"VE",vietna:"VN",vietnam:"VN",equador:"EC",paraguai:"PY",albania:"AL",argelia:"DZ",algeria:"DZ",andorra:"AD",angola:"AO","antigua e barbuda":"AG","antigua and barbuda":"AG",armenia:"AM",azerbaijao:"AZ",azerbaijan:"AZ",bahamas:"BS",bahrein:"BH",bahrain:"BH",bangladesh:"BD",barbados:"BB",belarus:"BY",bielorrússia:"BY",belize:"BZ",benin:"BJ",butao:"BT",bhutan:"BT","bosnia e herzegovina":"BA","bosnia and herzegovina":"BA",botsuana:"BW",botswana:"BW",brunei:"BN",bulgaria:"BG","burkina faso":"BF",burundi:"BI",camboja:"KH",cambodia:"KH",camarões:"CM",cameroon:"CM","cabo verde":"CV","cape verde":"CV","republica centro-africana":"CF","central african republic":"CF",chade:"TD",chad:"TD",comores:"KM",comoros:"KM",congo:"CG","costa rica":"CR",croacia:"HR",croatia:"HR",chipre:"CY",cyprus:"CY","republica tcheca":"CZ","czech republic":"CZ",tchequia:"CZ","republica dominicana":"DO","dominican republic":"DO","timor-leste":"TL","east timor":"TL","el salvador":"SV","guine equatorial":"GQ","equatorial guinea":"GQ",eritreia:"ER",estonia:"EE",etiopia:"ET",ethiopia:"ET",fiji:"FJ",gabao:"GA",gabon:"GA",gambia:"GM",georgia:"GE",gana:"GH",ghana:"GH",guatemala:"GT",guine:"GN",guinea:"GN","guine-bissau":"GW","guinea-bissau":"GW",guiana:"GY",guyana:"GY",haiti:"HT",honduras:"HN",islandia:"IS",iceland:"IS",jamaica:"JM",jordania:"JO",jordan:"JO",cazaquistao:"KZ",kazakhstan:"KZ",quenia:"KE",kenya:"KE",kiribati:"KI",kuwait:"KW",quirguistao:"KG",kyrgyzstan:"KG",laos:"LA",letonia:"LV",latvia:"LV",libano:"LB",lebanon:"LB",lesoto:"LS",lesotho:"LS",liberia:"LR",libia:"LY",libya:"LY",liechtenstein:"LI",lituania:"LT",lithuania:"LT",luxemburgo:"LU",luxembourg:"LU",madagascar:"MG",malawi:"MW",maldivas:"MV",maldives:"MV",mali:"ML",malta:"MT","ilhas marshall":"MH","marshall islands":"MH",mauritania:"MR",mauricio:"MU",mauritius:"MU",micronesia:"FM",moldova:"MD",monaco:"MC",mongolia:"MN",montenegro:"ME",mocambique:"MZ",mozambique:"MZ",myanmar:"MM",birmania:"MM",namibia:"NA",nauru:"NR",nepal:"NP",nicaragua:"NI",niger:"NE","macedonia do norte":"MK","north macedonia":"MK",oma:"OM",oman:"OM",paquistao:"PK",pakistan:"PK",palau:"PW",panama:"PA","papua-nova guine":"PG","papua new guinea":"PG",filipinas:"PH",philippines:"PH",catar:"QA",qatar:"QA",romenia:"RO",romania:"RO",ruanda:"RW","sao cristovao e nevis":"KN","saint kitts and nevis":"KN","santa lucia":"LC","saint lucia":"LC","sao vicente e granadinas":"VC","saint vincent and the grenadines":"VC",samoa:"WS","san marino":"SM","sao tome e principe":"ST","sao tome and principe":"ST","arabia saudita":"SA","saudi arabia":"SA",senegal:"SN",servia:"RS",serbia:"RS",seicheles:"SC",seychelles:"SC","serra leoa":"SL","sierra leone":"SL",eslovaquia:"SK",slovakia:"SK",eslovenia:"SI",slovenia:"SI","ilhas salomao":"SB","solomon islands":"SB",somalia:"SO","sri lanka":"LK",sudao:"SD",sudan:"SD",suriname:"SR",siria:"SY",syria:"SY",tajiquistao:"TJ",tajikistan:"TJ",tanzania:"TZ",tailandia:"TH",thailand:"TH",togo:"TG",tonga:"TO","trinidad e tobago":"TT","trinidad and tobago":"TT",tunisia:"TN",turcomenistao:"TM",turkmenistan:"TM",tuvalu:"TV",uganda:"UG","emirados arabes unidos":"AE","united arab emirates":"AE",uzbequistao:"UZ",uzbekistan:"UZ",vanuatu:"VU","cidade do vaticano":"VA","vatican city":"VA",vaticano:"VA",iemen:"YE",yemen:"YE",zambia:"ZM",zimbabue:"ZW",zimbabwe:"ZW"};function bt(s){if(!s)return null;const t=(s||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"");return vt[t]||null}function xt(s){return(s||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"").replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim()}const K={"africa equatorial francesa":"assets/flags/historical/África Equatorial Francesa_.png","africa ocidental francesa":"assets/flags/historical/África Ocidental Francesa.gif","africa portuguesa":"assets/flags/historical/África Portuguesa.png","alemanha ocidental":"assets/flags/historical/Alemanha Ocidental_.png","alemanha oriental":"assets/flags/historical/Alemanha Oriental.png",andorra:"assets/flags/historical/Andorra.png",bulgaria:"assets/flags/historical/Flag_of_Bulgaria_(1948–1967).svg.png",canada:"assets/flags/historical/Flag_of_Canada_(1921–1957).svg.png",espanha:"assets/flags/historical/Flag_of_Spain_(1945–1977).svg.png",grecia:"assets/flags/historical/State_Flag_of_Greece_(1863-1924_and_1935-1973).svg.png",hungria:"assets/flags/historical/Flag_of_Hungary_(1949-1956).svg.png",iugoslavia:"assets/flags/historical/Flag_of_Yugoslavia_(1946-1992).svg.png",romenia:"assets/flags/historical/Flag_of_Romania_(1952–1965).svg.png","caribe britanico":"assets/flags/historical/Caribe Britânico.png",congo:"assets/flags/historical/Flag_of_the_Congo_Free_State.svg.png","costa do ouro":"assets/flags/historical/Flag_of_the_Gold_Coast_(1877–1957).svg.png",egito:"assets/flags/historical/Flag_of_Egypt_(1952–1958).svg.png",etiopia:"assets/flags/historical/Flag_of_Ethiopia_(1897–1974).svg.png",ira:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iran:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iraque:"assets/flags/historical/Flag_of_Iraq_(1924–1959).svg.png",quenia:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png",kenya:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png","rodesia do sul":"assets/flags/historical/Flag_of_Southern_Rhodesia_(1924–1964).svg.png",siria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png",syria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png","uniao sovietica":"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",urss:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",russia:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png"};function ft(s){if(!s)return null;const t=xt(s);if(K[t])return K[t];for(const[e,a]of Object.entries(K))if(t.includes(e)||e.includes(t))return a;return null}function L(s,t="h-full w-full"){if(!s)return'<span class="text-slate-400 text-xs">🏴</span>';const e=ft(s);if(e)return`<img src="${e}" alt="Bandeira de ${s}" class="${t} object-contain" loading="lazy">`;const a=bt(s);return a?`<img src="${`assets/flags/countries/${a.toLowerCase()}.png`}" alt="Bandeira de ${s}" class="${t} object-contain" loading="lazy">`:(Se.add(String(s||"").trim()),'<span class="text-slate-400 text-xs">🏴</span>')}const Se=new Set;window.getMissingFlagCountries||(window.getMissingFlagCountries=()=>Array.from(Se).sort());function ht(s){if(!d.countryListContainer)return;d.countryListContainer.innerHTML="";const t=s.filter(e=>e.Pais&&e.PIB&&e.Populacao&&e.Estabilidade&&e.Urbanizacao&&e.Tecnologia);if(d.totalCountriesBadge&&(d.totalCountriesBadge.textContent=`${t.length} países`),t.length===0){d.countryListContainer.innerHTML='<div class="col-span-full text-center py-12"><div class="text-slate-400 mb-2">Nenhum país para exibir.</div></div>';return}t.forEach(e=>{const a=e.PIB??e.geral?.PIB??0,i=e.geral?.Populacao??e.Populacao??0,n=e.geral?.Estabilidade??e.Estabilidade??0,o=e.geral?.Tecnologia??e.Tecnologia??0,r=e.geral?.Urbanizacao??e.Urbanizacao??0,l=g(a),c=Number(i).toLocaleString("pt-BR"),p=Pe(parseFloat(n)),u={...e,PIB:a,Populacao:i,Tecnologia:o},m=Q(u),v=L(e.Pais),f=`
      <button class="country-card-button group relative w-full rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_6px_20px_-12px_rgba(0,0,0,0.6)] hover:border-slate-600/60 hover:bg-slate-900/70 transition-all" data-country-id="${e.id}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-10 grid place-items-center rounded-md ring-1 ring-white/10 bg-slate-800">${v}</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-100">${e.Pais}</div>
              <div class="text-[10px] text-slate-400">PIB pc ${g(e.PIBPerCapita||a/i)}</div>
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
      </button>`;d.countryListContainer.innerHTML+=f})}function yt(s){if(!d.countryPanelContent||!d.countryPanelModal)return;const t=s.PIB??s.geral?.PIB??0,e=s.geral?.Populacao??s.Populacao??0,a=s.geral?.Estabilidade??s.Estabilidade??0,i=s.geral?.Tecnologia??s.Tecnologia??0,n=s.geral?.Urbanizacao??s.Urbanizacao??0,o={...s,PIB:t,Populacao:e,Tecnologia:i},r=Q(o),l=Be({PIB:t,Burocracia:s.Burocracia,Estabilidade:a}),c=pt({PIB:t,Veiculos:s.Veiculos}),p=mt({PIB:t,Aeronautica:s.Aeronautica}),u=gt({PIB:t,Marinha:s.Marinha}),m=Pe(parseFloat(a)),v=g(t),f=Number(e).toLocaleString("pt-BR"),x=g(s.PIBPerCapita||t/e),C=Math.max(0,Math.min(100,parseFloat(n))),w=`
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight flex items-center gap-2">${`<span class="inline-grid h-8 w-12 place-items-center rounded-md ring-1 ring-white/10 bg-slate-800 overflow-hidden">${L(s.Pais)}</span>`} ${s.Pais}</h2>
          <div class="text-sm text-slate-400">PIB per capita <span class="font-semibold text-slate-200">${x}</span></div>
        </div>
        <div class="text-center">
          <div class="h-12 w-12 grid place-items-center rounded-full border border-white/10 bg-slate-900/60 text-sm font-bold">${r}</div>
          <div class="text-[10px] uppercase text-slate-500 mt-0.5">War Power</div>
        </div>
      </div>

      <div class="text-[12px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${s.ModeloPolitico||"—"}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
            PIB
          </div>
          <div class="mt-1 text-lg font-semibold">${v}</div>
        </div>
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            População
          </div>
          <div class="mt-1 text-lg font-semibold">${f}</div>
          <div class="mt-2 text-[12px] text-slate-400">Densidade urbana</div>
          <div class="mt-1">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
                Urbanização
              </span>
              <span class="text-slate-300">${C}%</span>
            </div>
            <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div class="h-1.5 rounded-full bg-emerald-500" style="width:${C}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Força Militar</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Exército</div>
            <div class="text-sm font-semibold text-slate-100">${s.Exercito||0}</div>
            <div class="text-[9px] text-slate-500">Força terrestre</div>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Burocracia</div>
          <div class="text-sm font-semibold text-slate-100">${s.Burocracia||0}%</div>
        </div>
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Combustível</div>
          <div class="text-sm font-semibold text-slate-100">${s.Combustivel||0}</div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Capacidade de Produção</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Veículos por Turno</div>
            <div class="text-sm font-semibold text-blue-400">${g(c)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Aeronaves por Turno</div>
            <div class="text-sm font-semibold text-cyan-400">${g(p)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Navios por Turno</div>
            <div class="text-sm font-semibold text-indigo-400">${g(u)}</div>
          </div>
        </div>
        
        <h5 class="text-xs font-medium text-slate-300 mt-3 mb-1">Tecnologias Militares</h5>
        <div class="grid grid-cols-3 gap-1">
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Veículos</div>
            <div class="text-xs font-semibold text-slate-100">${s.Veiculos||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Aeronáutica</div>
            <div class="text-xs font-semibold text-slate-100">${s.Aeronautica||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Naval</div>
            <div class="text-xs font-semibold text-slate-100">${s.Marinha||0}%</div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-2">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border ${m.tone}">
          Estabilidade: ${m.label}
        </span>
        <div class="ml-auto text-[12px] text-slate-400">Índice: <span class="text-slate-200 font-semibold">${a}</span></div>
      </div>

      <div class="space-y-3 mt-2">
        <div>
          <div class="flex items-center justify-between text-[12px] text-slate-400">
            <span>Estabilidade Interna</span>
            <span class="text-slate-200">${a}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-cyan-400" style="width:${Math.max(0,Math.min(100,a))}%"></div>
          </div>
        </div>
        <div>
          <div class="flex items-center justify-between text-[12px] text-slate-400">
            <span>Tecnologia</span>
            <span class="text-slate-200">${i}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-emerald-400" style="width:${Math.max(0,Math.min(100,i))}%"></div>
          </div>
        </div>
      </div>
    </div>`,q=`
    <div class="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
      <h3 class="text-lg font-semibold">Resumo Estratégico</h3>
      <p class="mt-1 text-[12px] text-slate-400">Visão geral de capacidades e riscos do país no contexto do seu RPG.</p>
      <div class="mt-4 space-y-2">
        ${[["Modelo Político",s.ModeloPolitico||"—"],["PIB total",v],["PIB per capita",x],["Orçamento Nacional",`<span class="text-emerald-400">${g(l)}</span>`],["Prod. Veículos/turno",`<span class="text-blue-400">${g(c)}</span>`],["Prod. Aeronaves/turno",`<span class="text-cyan-400">${g(p)}</span>`],["Prod. Navios/turno",`<span class="text-indigo-400">${g(u)}</span>`],["População",f],["War Power Index",`${r}/100`],["Burocracia",`${s.Burocracia||0}%`],["Combustível",`${s.Combustivel||0}`],["Último Turno",`#${s.TurnoUltimaAtualizacao||0}`]].map(([B,Re])=>`
          <div class="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2 text-[13px]">
            <span class="text-slate-400">${B}</span>
            <span class="font-medium text-slate-100">${Re}</span>
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
    </div>`,$=W.calculateCountryConsumption(s),P=Z.calculateCountryProduction(s),_e=Oe.calculateConsumerGoods(s),te=Math.round(P.Carvao||0),ae=Math.round($.Carvao||0),F=te-ae,se=Math.round(P.Combustivel||0),ie=Math.round($.Combustivel||0),k=se-ie,ne=Math.round(P.Metais||0),oe=Math.round($.Metais||0),D=ne-oe,re=Math.round(P.Graos||0),le=Math.round($.Graos||0),j=re-le,de=Math.round(P.Energia||0),ce=Math.round($.Energia||0),z=de-ce,ue=Math.round(_e.percentage||0),Ae=`
    <div id="modal-recursos" class="hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-100">⛏️ Recursos - ${s.Pais||"País"}</h3>
          <button id="close-modal-recursos" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Combustível -->
          <div class="border border-orange-500/30 bg-orange-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">⛽</span>
              <span class="text-sm font-medium text-slate-300">Combustível</span>
            </div>
            <div class="text-3xl font-bold ${k>=0?"text-green-400":"text-red-400"}">${k>=0?"+":""}${h(k)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-orange-500/30">
              <span class="text-green-400">Prod: ${h(se)}</span>
              <span class="text-red-400">Cons: ${h(ie)}</span>
            </div>
          </div>

          <!-- Carvão -->
          <div class="border border-slate-500/30 bg-slate-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🪨</span>
              <span class="text-sm font-medium text-slate-300">Carvão</span>
            </div>
            <div class="text-3xl font-bold ${F>=0?"text-green-400":"text-red-400"}">${F>=0?"+":""}${h(F)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-slate-500/30">
              <span class="text-green-400">Prod: ${h(te)}</span>
              <span class="text-red-400">Cons: ${h(ae)}</span>
            </div>
          </div>

          <!-- Metais -->
          <div class="border border-gray-500/30 bg-gray-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🔩</span>
              <span class="text-sm font-medium text-slate-300">Metais</span>
            </div>
            <div class="text-3xl font-bold ${D>=0?"text-green-400":"text-red-400"}">${D>=0?"+":""}${h(D)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-gray-500/30">
              <span class="text-green-400">Prod: ${h(ne)}</span>
              <span class="text-red-400">Cons: ${h(oe)}</span>
            </div>
          </div>

          <!-- Grãos -->
          <div class="border border-amber-500/30 bg-amber-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🌾</span>
              <span class="text-sm font-medium text-slate-300">Grãos</span>
            </div>
            <div class="text-3xl font-bold ${j>=0?"text-green-400":"text-red-400"}">${j>=0?"+":""}${h(j)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-amber-500/30">
              <span class="text-green-400">Prod: ${h(re)}</span>
              <span class="text-red-400">Cons: ${h(le)}</span>
            </div>
          </div>

          <!-- Energia -->
          <div class="border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">⚡</span>
              <span class="text-sm font-medium text-slate-300">Energia</span>
            </div>
            <div class="text-3xl font-bold ${z>=0?"text-green-400":"text-red-400"}">${z>=0?"+":""}${h(z)} MW</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-yellow-500/30">
              <span class="text-green-400">Prod: ${h(de)} MW</span>
              <span class="text-red-400">Cons: ${h(ce)} MW</span>
            </div>
          </div>

          <!-- Bens de Consumo -->
          <div class="border border-blue-500/30 bg-blue-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">📦</span>
              <span class="text-sm font-medium text-slate-300">Bens de Consumo</span>
            </div>
            <div class="text-3xl font-bold text-blue-400">${ue}%</div>
            <div class="text-xs text-slate-400 mt-1">disponibilidade</div>
            <div class="text-xs mt-2 pt-2 border-t border-blue-500/30 text-slate-400">
              Necessário: 100% | Atual: ${ue}%
            </div>
          </div>
        </div>
      </div>
    </div>`,Me=`
    <div id="modal-inventario" class="hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-100">🎖️ Inventário de Guerra - ${s.Pais||"País"}</h3>
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
              <div class="text-2xl font-bold text-green-400">${s.VeiculosEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${s.VeiculosPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${s.Veiculos||0}</span>
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
              <div class="text-2xl font-bold text-blue-400">${s.AeronavesEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${s.AeronavesPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${s.Aeronautica||0}</span>
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
              <div class="text-2xl font-bold text-cyan-400">${s.NaviosEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${s.NaviosPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${s.Marinha||0}</span>
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
                <div class="text-2xl font-bold text-red-400">${s.WarPower||0}/100</div>
              </div>
              <div>
                <div class="text-slate-400 text-xs mb-1">Orçamento Militar</div>
                <div class="text-lg font-bold text-slate-100">${g((s.PIB||0)*((s.MilitaryBudgetPercent||0)/100))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,Le=`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${w}
      ${q}
    </div>
    ${Ae}
    ${Me}
  `;d.countryPanelContent.innerHTML=Le;const pe=document.getElementById("btn-ver-recursos"),me=document.getElementById("btn-ver-inventario"),S=document.getElementById("modal-recursos"),_=document.getElementById("modal-inventario"),ge=document.getElementById("close-modal-recursos"),ve=document.getElementById("close-modal-inventario");pe&&S&&pe.addEventListener("click",()=>{S.classList.remove("hidden")}),me&&_&&me.addEventListener("click",()=>{_.classList.remove("hidden")}),ge&&S&&(ge.addEventListener("click",()=>{S.classList.add("hidden")}),S.addEventListener("click",B=>{B.target===S&&S.classList.add("hidden")})),ve&&_&&(ve.addEventListener("click",()=>{_.classList.add("hidden")}),_.addEventListener("click",B=>{B.target===_&&_.classList.add("hidden")}));const H=d.countryPanelModal;H.classList.remove("hidden"),requestAnimationFrame(()=>{H.classList.remove("opacity-0");const B=H.querySelector(".transform");B&&B.classList.remove("-translate-y-2")}),Ct(s)}async function Ct(s){const t=window.appState?.playerCountry,e=window.appState?.currentTurn||0;console.log("DEBUG: [setupEspionageSystem] País renderizado:",s),console.log("DEBUG: [setupEspionageSystem] País do jogador (appState):",t);const a=document.getElementById("espionage-button-container"),i=document.getElementById("counter-intel-container"),n=document.getElementById("agency-button-container");if(!(!a||!i)){if(t&&s.id===t.id){if(Ie(s,i),a.innerHTML="",n){n.innerHTML=`
        <button id="btn-open-agency" class="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/20 transition">
          🕵️ Agência de Inteligência
        </button>
      `;const o=document.getElementById("btn-open-agency");o&&o.addEventListener("click",()=>{wt(s)})}return}if(t&&s.id!==t.id){const o=await y.hasActiveSpying(t.id,s.id,e);if(o){const r=o.validUntilTurn-e;a.innerHTML=`
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
      `}else{a.innerHTML=`
        <button id="btn-spy-country" class="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm text-purple-300 hover:bg-purple-500/20 transition">
          🕵️ ESPIONAR ESTE PAÍS
        </button>
      `;const r=document.getElementById("btn-spy-country");r&&r.addEventListener("click",()=>{Ue.show(s,t,e)})}i.innerHTML=""}else a.innerHTML="",i.innerHTML="",n&&(n.innerHTML="")}}function wt(s){const t=document.createElement("div");t.id="agency-modal",t.className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm",t.innerHTML=`
    <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto m-4 p-6">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="text-4xl">🕵️</span>
          <div>
            <h3 class="text-2xl font-bold text-slate-100">Agência de Inteligência</h3>
            <p class="text-sm text-slate-400">${s.Pais}</p>
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
  `,document.body.appendChild(t);const e=document.getElementById("close-agency-modal");e&&e.addEventListener("click",()=>{t.remove()}),t.addEventListener("click",i=>{i.target===t&&t.remove()});const a=document.getElementById("agency-dashboard-content");a&&A(s,a)}function It(s,t){const{userRoleBadge:e}=d,a=document.querySelector('a[href="narrador.html"]');a&&(a.style.display=s||t?"block":"none"),e&&(t?(e.textContent="Admin",e.className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"):s?(e.textContent="Narrador",e.className="text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20"):(e.textContent="Jogador",e.className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"))}function Tt(s){const t=document.createElement("div");t.className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";const e=`
    <div class="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-bg-soft border border-bg-ring/70 p-6 overflow-hidden">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-slate-100">Escolha seu País</h2>
        <p class="text-sm text-slate-400 mt-1">Selecione um país para governar no RPG</p>
      </div>
      <div class="mb-4">
        <input type="text" id="busca-pais" placeholder="Buscar país..." class="w-full rounded-xl bg-bg border border-bg-ring/70 p-3 text-sm">
        <div class="mt-2 text-xs text-slate-400">Mostrando <span id="paises-visiveis">${s.length}</span> países disponíveis</div>
      </div>
      <div class="max-h-96 overflow-y-auto space-y-2">
        ${s.map(a=>{const i=L(a.Pais,"h-6 w-9");return`
            <div class="pais-option rounded-xl border border-bg-ring/70 p-3 cursor-pointer" data-pais-id="${a.id}" data-pais-nome="${a.Pais}">
              <div class="flex items-center gap-3">
                <div class="h-6 w-9 rounded bg-slate-800 grid place-items-center">${i}</div>
                <div class="flex-1">
                  <div class="font-medium text-slate-100">${a.Pais}</div>
                  <div class="text-xs text-slate-400">PIB: ${g(a.PIB||0)} · Pop: ${Number(a.Populacao||0).toLocaleString("pt-BR")} · Tech: ${a.Tecnologia||0}% · Estab: ${a.Estabilidade||0}/100</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">WPI</div>
                  <div class="text-sm font-bold text-slate-200">${Q(a)}</div>
                </div>
              </div>
            </div>`}).join("")}
      </div>
      <div class="mt-6 flex gap-3">
        <button id="cancelar-selecao" class="flex-1 rounded-xl border border-bg-ring/70 px-4 py-2.5 text-slate-300">Cancelar</button>
        <button id="confirmar-selecao" class="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-slate-950 font-semibold" disabled>Confirmar Seleção</button>
      </div>
    </div>`;return t.innerHTML=e,document.body.appendChild(t),t}function Et(s){const t=s.filter(r=>r.Player),e=t.map(r=>parseFloat(String(r.PIB).replace(/[$.]+/g,"").replace(",","."))||0),a=t.map(r=>parseFloat(String(r.Estabilidade).replace(/%/g,""))||0),i=e.length>0?e.reduce((r,l)=>r+l,0)/e.length:0,n=a.length>0?a.reduce((r,l)=>r+l,0)/a.length:0,o=s.filter(r=>{const l=(r.Visibilidade||"").toString().trim().toLowerCase();return l==="público"||l==="publico"||l==="public"}).length;d.totalPlayers&&be("total-players",t.length),d.pibMedio&&(d.pibMedio.textContent=g(i)),d.estabilidadeMedia&&(d.estabilidadeMedia.textContent=`${Math.round(n)}/100`),d.paisesPublicos&&be("paises-publicos",o)}function $t(s,t){if(s&&d.playerPanel){d.playerCountryName&&(d.playerCountryName.textContent=s.Pais||"País do Jogador");const e=document.getElementById("player-flag-container");e&&(e.innerHTML=L(s.Pais,"h-full w-full")),d.playerCurrentTurn&&(d.playerCurrentTurn.textContent=`#${t}`);const a=(parseFloat(s.PIB)||0)/(parseFloat(s.Populacao)||1),i=document.getElementById("player-pib-per-capita");if(i&&(i.textContent=g(a)),d.playerPib){const c=s.PIB||0,p=Ne(c);d.playerPib.textContent=p}const n=Number(s.Estabilidade)||0;d.playerEstabilidade&&(d.playerEstabilidade.textContent=`${n}/100`);const o=document.getElementById("player-estabilidade-bar");if(o&&(o.style.width=`${Math.max(0,Math.min(100,n))}%`,n>=75?o.className="h-1.5 rounded-full bg-emerald-400":n>=50?o.className="h-1.5 rounded-full bg-cyan-400":n>=25?o.className="h-1.5 rounded-full bg-yellow-400":o.className="h-1.5 rounded-full bg-red-400"),d.playerCombustivel){const c=W.calculateCountryConsumption(s),p=Z.calculateCountryProduction(s),u=Math.round((p.Combustivel||0)-(c.Combustivel||0));d.playerCombustivel.textContent=u}if(d.playerCombustivelDelta){const c=W.calculateCountryConsumption(s),p=Z.calculateCountryProduction(s),u=Math.round((p.Combustivel||0)-(c.Combustivel||0));d.playerCombustivelDelta.textContent=u>=0?`+${u}`:`${u}`}d.playerPibDelta&&(d.playerPibDelta.textContent="Sem histórico"),d.playerEstabilidadeDelta&&(d.playerEstabilidadeDelta.textContent="Sem histórico"),d.playerHistorico&&(d.playerHistorico.innerHTML=`
        <div class="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3 mb-2">
          <div class="font-medium">Turno #${t} (atual)</div>
          <div class="text-xs text-slate-400">PIB: ${g(s.PIB)} · Estab: ${n}/100 · Pop: ${Number(s.Populacao||0).toLocaleString("pt-BR")}</div>
        </div>`);const r=s.TurnoUltimaAtualizacao<t;d.playerNotifications&&(r?d.playerNotifications.classList.remove("hidden"):d.playerNotifications.classList.add("hidden")),d.playerPanel.style.display="block";const l=document.getElementById("welcome-content");l&&(l.style.display="none")}else{d.playerCountryName&&(d.playerCountryName.textContent="Carregando..."),d.playerHistorico&&(d.playerHistorico.innerHTML='<div class="text-sm text-slate-400 italic">Nenhum histórico disponível</div>'),d.playerPanel&&(d.playerPanel.style.display="none");const e=document.getElementById("welcome-content");e&&(e.style.display="block")}}const Nt=Object.freeze(Object.defineProperty({__proto__:null,createCountrySelectionModal:Tt,fillPlayerPanel:$t,getFlagHTML:L,renderDetailedCountryPanel:yt,renderPublicCountries:ht,updateKPIs:Et,updateNarratorUI:It},Symbol.toStringTag,{value:"Module"}));export{ht as a,It as b,Tt as c,Rt as d,Nt as e,$t as f,L as g,yt as r,Et as u};
