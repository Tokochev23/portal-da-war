const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-ep1w8F7T.js","assets/preload-helper-f85Crcwt.js","assets/utils-DLoRv3re.js"])))=>i.map(i=>d[i]);
import{_ as m}from"./preload-helper-f85Crcwt.js";import{t as u}from"./training_levels-0GuzqOdX.js";import{s as i,a as b}from"./utils-DLoRv3re.js";let p=null,r=null,c=[];async function L(e){try{console.log("🎖️ Inicializando Divisions Manager..."),p=e,await w(),await d(),h(),D(),console.log("✅ Divisions Manager inicializado")}catch(n){console.error("❌ Erro ao inicializar Divisions Manager:",n),i("error","Erro ao carregar divisões: "+n.message)}}async function w(){try{const{checkPlayerCountry:e,getCountryData:n}=await m(async()=>{const{checkPlayerCountry:t,getCountryData:o}=await import("./firebase-ep1w8F7T.js");return{checkPlayerCountry:t,getCountryData:o}},__vite__mapDeps([0,1,2])),a=await e(p.uid);if(!a)throw new Error("Usuário não está vinculado a um país");r=await n(a),r.id=a,console.log(`✅ País carregado: ${r.Pais}`)}catch(e){throw console.error("Erro ao carregar país:",e),e}}async function d(){try{console.log("Carregando divisões do inventário para o país:",r.id);const n=await window.db.collection("inventory").doc(r.id).get();n.exists?(c=n.data().divisions||[],console.log(`${c.length} divisões carregadas.`)):(c=[],console.log("Nenhum inventário encontrado para o país.")),c.sort((a,t)=>new Date(t.updatedAt)-new Date(a.updatedAt)),v(c)}catch(e){console.error("Erro ao carregar divisões:",e),i("error","Erro ao carregar divisões: "+e.message)}}function v(e){const n=document.getElementById("divisions-container"),a=document.getElementById("empty-state");if(e.length===0){n.innerHTML="",a.classList.remove("hidden");return}a.classList.add("hidden"),n.innerHTML=e.map(t=>`
    <div class="division-card bg-bg-soft border border-bg-ring rounded-xl p-6 hover:border-brand-500 cursor-pointer" data-division-id="${t.id}">
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <h3 class="text-xl font-bold text-slate-100 mb-1">${t.name}</h3>
          <div class="flex items-center gap-2">
            <span class="text-xs px-2 py-1 rounded ${y(t.trainingLevel)}">
              ${u[t.trainingLevel]?.icon||"🎖️"} ${u[t.trainingLevel]?.name||t.trainingLevel}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="window.editDivision('${t.id}')" class="p-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors" title="Editar">
            ✏️
          </button>
          <button onclick="window.duplicateDivision('${t.id}')" class="p-2 bg-cyan-600 hover:bg-cyan-700 rounded text-sm transition-colors" title="Duplicar">
            📋
          </button>
          <button onclick="window.deleteDivision('${t.id}')" class="p-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors" title="Deletar">
            🗑️
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 text-sm mb-4">
        <div class="bg-bg rounded p-3">
          <p class="text-slate-500 text-xs">Manpower Total</p>
          <p class="font-bold text-slate-100">${t.calculatedStats?.manpower.total.toLocaleString()||"0"}</p>
        </div>
        <div class="bg-bg rounded p-3">
          <p class="text-slate-500 text-xs">Combat Width</p>
          <p class="font-bold text-slate-100">${t.calculatedStats?.combatStats.combatWidth||"0"}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs mb-4">
        <div><span class="text-slate-500">Soft Attack:</span> <span class="text-red-400 font-bold">${t.calculatedStats?.combatStats.softAttack.toFixed(1)||"0"}</span></div>
        <div><span class="text-slate-500">Hard Attack:</span> <span class="text-orange-400 font-bold">${t.calculatedStats?.combatStats.hardAttack.toFixed(1)||"0"}</span></div>
        <div><span class="text-slate-500">Defense:</span> <span class="text-blue-400 font-bold">${t.calculatedStats?.combatStats.defense.toFixed(1)||"0"}</span></div>
        <div><span class="text-slate-500">Organization:</span> <span class="text-cyan-400 font-bold">${t.calculatedStats?.combatStats.organization.toFixed(1)||"0"}</span></div>
      </div>

      <div class="border-t border-bg-ring pt-3 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span class="font-medium">Combate:</span> ${t.combatUnits?.length||0}/25
          <span class="ml-2 font-medium">Suporte:</span> ${t.supportUnits?.length||0}/5
        </div>
        <div>
          ${t.updatedAt?x(t.updatedAt):"Nova"}
        </div>
      </div>
    </div>
  `).join("")}function y(e){return{conscript:"bg-slate-600 text-slate-200",regular:"bg-blue-600 text-blue-100",elite:"bg-yellow-600 text-yellow-100"}[e]||"bg-slate-600 text-slate-200"}function x(e){if(!e)return"";try{const n=e.toDate?e.toDate():new Date(e),t=new Date-n,o=Math.floor(t/1e3/60/60);if(o<1)return"Agora mesmo";if(o<24)return`${o}h atrás`;const s=Math.floor(o/24);return s<7?`${s}d atrás`:n.toLocaleDateString("pt-BR")}catch{return""}}window.editDivision=function(e){window.location.href=`criador-divisoes.html?id=${e}`};window.duplicateDivision=async function(e){try{const n=window.db.collection("inventory").doc(r.id),a=await n.get();if(!a.exists)throw new Error("Inventário do país não encontrado.");const t=a.data().divisions||[],o=t.find(f=>f.id===e);if(!o){i("error","Divisão não encontrada para duplicar.");return}const s={...o,id:`div_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,name:o.name+" (Cópia)",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},l=[...t,s];await n.update({divisions:l}),i("success","✅ Divisão duplicada!"),await d()}catch(n){console.error("Erro ao duplicar divisão:",n),i("error","Erro ao duplicar: "+n.message)}};window.deleteDivision=async function(e){try{if(!await b("Deletar Divisão","Tem certeza que deseja deletar esta divisão? Esta ação não pode ser desfeita.","Sim, deletar","Cancelar"))return;const a=window.db.collection("inventory").doc(r.id),t=await a.get();if(!t.exists)throw new Error("Inventário do país não encontrado.");const s=(t.data().divisions||[]).filter(l=>l.id!==e);await a.update({divisions:s}),i("success","✅ Divisão deletada!"),await d()}catch(n){console.error("Erro ao deletar divisão:",n),i("error","Erro ao deletar: "+n.message)}};function g(){const e=document.getElementById("search-input").value.toLowerCase(),n=document.getElementById("filter-training").value;let a=c;e&&(a=a.filter(t=>t.name.toLowerCase().includes(e))),n&&(a=a.filter(t=>t.trainingLevel===n)),v(a)}function h(){document.getElementById("search-input").addEventListener("input",g),document.getElementById("filter-training").addEventListener("change",g),document.getElementById("btn-refresh").addEventListener("click",d)}function D(){const e=document.getElementById("initial-loading");e&&(e.style.opacity="0",setTimeout(()=>e.style.display="none",500))}export{L as initDivisionsManager};
