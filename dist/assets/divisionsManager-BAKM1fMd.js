const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-BN3MSMQD.js","assets/preload-helper-f85Crcwt.js","assets/utils-DLoRv3re.js"])))=>i.map(i=>d[i]);
import{_ as p}from"./preload-helper-f85Crcwt.js";import{t as w}from"./training_levels-0GuzqOdX.js";import{s as r,a as _}from"./utils-DLoRv3re.js";let x=null,u=null,g=[];async function R(t){try{console.log("🎖️ Inicializando Divisions Manager..."),x=t,await L(),await v(),I(),A(),console.log("✅ Divisions Manager inicializado")}catch(a){console.error("❌ Erro ao inicializar Divisions Manager:",a),r("error","Erro ao carregar divisões: "+a.message)}}async function L(){try{const{checkPlayerCountry:t,getCountryData:a}=await p(async()=>{const{checkPlayerCountry:e,getCountryData:n}=await import("./firebase-BN3MSMQD.js");return{checkPlayerCountry:e,getCountryData:n}},__vite__mapDeps([0,1,2])),o=await t(x.uid);if(!o)throw new Error("Usuário não está vinculado a um país");u=await a(o),u.id=o,console.log(`✅ País carregado: ${u.Pais}`)}catch(t){throw console.error("Erro ao carregar país:",t),t}}async function v(){try{const{collection:t,query:a,where:o,getDocs:e,orderBy:n}=await p(async()=>{const{collection:i,query:l,where:m,getDocs:f,orderBy:b}=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");return{collection:i,query:l,where:m,getDocs:f,orderBy:b}},[]),s=t(window.db,"divisions"),c=a(s,o("countryId","==",u.id),n("updatedAt","desc")),d=await e(c);g=[],d.forEach(i=>{g.push({id:i.id,...i.data()})}),h(g)}catch(t){console.error("Erro ao carregar divisões:",t),r("error","Erro ao carregar divisões: "+t.message)}}function h(t){const a=document.getElementById("divisions-container"),o=document.getElementById("empty-state");if(t.length===0){a.innerHTML="",o.classList.remove("hidden");return}o.classList.add("hidden"),a.innerHTML=t.map(e=>`
    <div class="division-card bg-bg-soft border border-bg-ring rounded-xl p-6 hover:border-brand-500 cursor-pointer" data-division-id="${e.id}">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-slate-100 mb-1">${e.name}</h3>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded ${$(e.trainingLevel)}">
              ${w[e.trainingLevel]?.icon||"🎖️"} ${w[e.trainingLevel]?.name||e.trainingLevel}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="window.editDivision('${e.id}')" class="p-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors" title="Editar">
            ✏️
          </button>
          <button onclick="window.duplicateDivision('${e.id}')" class="p-2 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors" title="Duplicar">
            📋
          </button>
          <button onclick="window.deleteDivision('${e.id}')" class="p-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors" title="Deletar">
            🗑️
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm mb-4">
        <div class="bg-bg rounded p-3">
          <p class="text-slate-500 text-xs">Manpower Total</p>
          <p class="font-bold text-slate-100">${e.calculatedStats?.manpower.total.toLocaleString()||"0"}</p>
        </div>
        <div class="bg-bg rounded p-3">
          <p class="text-slate-500 text-xs">Combat Width</p>
          <p class="font-bold text-slate-100">${e.calculatedStats?.combatStats.combatWidth||"0"}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs mb-4">
        <div><span class="text-slate-500">Soft Attack:</span> <span class="text-red-400 font-bold">${e.calculatedStats?.combatStats.softAttack.toFixed(1)||"0"}</span></div>
        <div><span class="text-slate-500">Hard Attack:</span> <span class="text-orange-400 font-bold">${e.calculatedStats?.combatStats.hardAttack.toFixed(1)||"0"}</span></div>
        <div><span class="text-slate-500">Defense:</span> <span class="text-blue-400 font-bold">${e.calculatedStats?.combatStats.defense.toFixed(1)||"0"}</span></div>
        <div><span class="text-slate-500">Organization:</span> <span class="text-cyan-400 font-bold">${e.calculatedStats?.combatStats.organization.toFixed(1)||"0"}</span></div>
      </div>

      <div class="border-t border-bg-ring pt-3 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span class="font-medium">Combate:</span> ${e.combatUnits?.length||0}/25
          <span class="ml-2 font-medium">Suporte:</span> ${e.supportUnits?.length||0}/5
        </div>
        <div>
          ${e.updatedAt?S(e.updatedAt):"Nova"}
        </div>
      </div>
    </div>
  `).join("")}function $(t){return{conscript:"bg-slate-600 text-slate-200",regular:"bg-blue-600 text-blue-100",elite:"bg-yellow-600 text-yellow-100"}[t]||"bg-slate-600 text-slate-200"}function S(t){if(!t)return"";try{const a=t.toDate?t.toDate():new Date(t),e=new Date-a,n=Math.floor(e/1e3/60/60);if(n<1)return"Agora mesmo";if(n<24)return`${n}h atrás`;const s=Math.floor(n/24);return s<7?`${s}d atrás`:a.toLocaleDateString("pt-BR")}catch{return""}}window.editDivision=function(t){window.location.href=`criador-divisoes.html?id=${t}`};window.duplicateDivision=async function(t){try{const{doc:a,getDoc:o,collection:e,setDoc:n,serverTimestamp:s}=await p(async()=>{const{doc:m,getDoc:f,collection:b,setDoc:D,serverTimestamp:E}=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");return{doc:m,getDoc:f,collection:b,setDoc:D,serverTimestamp:E}},[]),c=a(window.db,"divisions",t),d=await o(c);if(!d.exists()){r("error","Divisão não encontrada");return}const i=d.data(),l=a(e(window.db,"divisions"));await n(l,{...i,id:l.id,name:i.name+" (Cópia)",createdAt:s(),updatedAt:s()}),r("success","✅ Divisão duplicada!"),await v()}catch(a){console.error("Erro ao duplicar divisão:",a),r("error","Erro ao duplicar: "+a.message)}};window.deleteDivision=async function(t){try{if(!await _("Deletar Divisão","Tem certeza que deseja deletar esta divisão? Esta ação não pode ser desfeita.","Sim, deletar","Cancelar"))return;const{doc:o,deleteDoc:e}=await p(async()=>{const{doc:s,deleteDoc:c}=await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");return{doc:s,deleteDoc:c}},[]),n=o(window.db,"divisions",t);await e(n),r("success","✅ Divisão deletada!"),await v()}catch(a){console.error("Erro ao deletar divisão:",a),r("error","Erro ao deletar: "+a.message)}};function y(){const t=document.getElementById("search-input").value.toLowerCase(),a=document.getElementById("filter-training").value;let o=g;t&&(o=o.filter(e=>e.name.toLowerCase().includes(t))),a&&(o=o.filter(e=>e.trainingLevel===a)),h(o)}function I(){document.getElementById("search-input").addEventListener("input",y),document.getElementById("filter-training").addEventListener("change",y),document.getElementById("btn-refresh").addEventListener("click",v)}function A(){const t=document.getElementById("initial-loading");t&&(t.style.opacity="0",setTimeout(()=>t.style.display="none",500))}export{R as initDivisionsManager};
