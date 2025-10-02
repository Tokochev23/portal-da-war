import{j as n,k as N,l as M}from"./firebase-COmVF2I9.js";const s={countryListContainer:document.getElementById("lista-paises-publicos"),emptyState:document.getElementById("empty-state"),totalCountriesBadge:document.getElementById("total-paises-badge"),totalPlayers:document.getElementById("total-players"),pibMedio:document.getElementById("pib-medio"),estabilidadeMedia:document.getElementById("estabilidade-media"),paisesPublicos:document.getElementById("paises-publicos"),playerCountryName:document.getElementById("player-country-name"),playerCurrentTurn:document.getElementById("player-current-turn"),playerPib:document.getElementById("player-pib"),playerEstabilidade:document.getElementById("player-estabilidade"),playerCombustivel:document.getElementById("player-combustivel"),playerPibDelta:document.getElementById("player-pib-delta"),playerEstabilidadeDelta:document.getElementById("player-estabilidade-delta"),playerCombustivelDelta:document.getElementById("player-combustivel-delta"),playerHistorico:document.getElementById("player-historico"),playerNotifications:document.getElementById("player-notifications"),playerPanel:document.getElementById("player-panel"),narratorTools:document.getElementById("narrator-tools"),userRoleBadge:document.getElementById("user-role-badge"),countryPanelModal:document.getElementById("country-panel-modal"),countryPanelContent:document.getElementById("country-panel-content"),closeCountryPanelBtn:document.getElementById("close-country-panel")};function I(a,t,e){return Math.max(t,Math.min(e,a))}function E(a){return a<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:a<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:a<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function y(a){const t=(parseFloat(a.PIB)||0)/(parseFloat(a.Populacao)||1),e=I(t,0,2e4)/200,i=Math.round(e*.45+(parseFloat(a.Tecnologia)||0)*.55);return I(i,1,100)}function $(a){const t=parseFloat(a.PIB)||0,e=(parseFloat(a.Burocracia)||0)/100,i=(parseFloat(a.Estabilidade)||0)/100;return t*.25*e*i*1.5}function _(a){const t=$(a),e=(parseFloat(a.MilitaryBudgetPercent)||30)/100;return t*e}function w(a){const t=(parseFloat(a.MilitaryDistributionVehicles)||40)/100,e=(parseFloat(a.MilitaryDistributionAircraft)||30)/100,i=(parseFloat(a.MilitaryDistributionNaval)||30)/100;return{vehicles:t,aircraft:e,naval:i,maintenancePercent:.15}}function A(a){const t=_(a),e=w(a);return t*e.vehicles}function H(a){const t=_(a),e=w(a);return t*e.aircraft}function R(a){const t=_(a),e=w(a);return t*e.naval}const U={afeganistao:"AF",afghanistan:"AF","africa do sul":"ZA","south africa":"ZA",alemanha:"DE",germany:"DE",argentina:"AR",australia:"AU",austria:"AT",belgica:"BE",belgium:"BE",bolivia:"BO",brasil:"BR",brazil:"BR",canada:"CA",chile:"CL",china:"CN",colombia:"CO","coreia do sul":"KR","south korea":"KR","coreia do norte":"KP","north korea":"KP",cuba:"CU",dinamarca:"DK",denmark:"DK",egito:"EG",egypt:"EG",espanha:"ES",spain:"ES","estados unidos":"US",eua:"US",usa:"US","united states":"US",finlandia:"FI",franca:"FR",france:"FR",grecia:"GR",greece:"GR",holanda:"NL","paises baixos":"NL",netherlands:"NL",hungria:"HU",hungary:"HU",india:"IN",indonesia:"ID",ira:"IR",iran:"IR",iraque:"IQ",iraq:"IQ",irlanda:"IE",ireland:"IE",israel:"IL",italia:"IT",italy:"IT",japao:"JP",japan:"JP",malasia:"MY",malaysia:"MY",marrocos:"MA",morocco:"MA",mexico:"MX",nigeria:"NG",noruega:"NO",norway:"NO","nova zelandia":"NZ","new zealand":"NZ",peru:"PE",polonia:"PL",poland:"PL",portugal:"PT","reino unido":"GB",inglaterra:"GB",uk:"GB","united kingdom":"GB",russia:"RU",urss:"RU","uniao sovietica":"RU",singapura:"SG",singapore:"SG",suecia:"SE",sweden:"SE",suica:"CH",switzerland:"CH",turquia:"TR",turkey:"TR",ucrania:"UA",ukraine:"UA",uruguai:"UY",venezuela:"VE",vietna:"VN",vietnam:"VN",equador:"EC",paraguai:"PY",albania:"AL",argelia:"DZ",algeria:"DZ",andorra:"AD",angola:"AO","antigua e barbuda":"AG","antigua and barbuda":"AG",armenia:"AM",azerbaijao:"AZ",azerbaijan:"AZ",bahamas:"BS",bahrein:"BH",bahrain:"BH",bangladesh:"BD",barbados:"BB",belarus:"BY",bielorrússia:"BY",belize:"BZ",benin:"BJ",butao:"BT",bhutan:"BT","bosnia e herzegovina":"BA","bosnia and herzegovina":"BA",botsuana:"BW",botswana:"BW",brunei:"BN",bulgaria:"BG","burkina faso":"BF",burundi:"BI",camboja:"KH",cambodia:"KH",camarões:"CM",cameroon:"CM","cabo verde":"CV","cape verde":"CV","republica centro-africana":"CF","central african republic":"CF",chade:"TD",chad:"TD",comores:"KM",comoros:"KM",congo:"CG","costa rica":"CR",croacia:"HR",croatia:"HR",chipre:"CY",cyprus:"CY","republica tcheca":"CZ","czech republic":"CZ",tchequia:"CZ","republica dominicana":"DO","dominican republic":"DO","timor-leste":"TL","east timor":"TL","el salvador":"SV","guine equatorial":"GQ","equatorial guinea":"GQ",eritreia:"ER",estonia:"EE",etiopia:"ET",ethiopia:"ET",fiji:"FJ",gabao:"GA",gabon:"GA",gambia:"GM",georgia:"GE",gana:"GH",ghana:"GH",guatemala:"GT",guine:"GN",guinea:"GN","guine-bissau":"GW","guinea-bissau":"GW",guiana:"GY",guyana:"GY",haiti:"HT",honduras:"HN",islandia:"IS",iceland:"IS",jamaica:"JM",jordania:"JO",jordan:"JO",cazaquistao:"KZ",kazakhstan:"KZ",quenia:"KE",kenya:"KE",kiribati:"KI",kuwait:"KW",quirguistao:"KG",kyrgyzstan:"KG",laos:"LA",letonia:"LV",latvia:"LV",libano:"LB",lebanon:"LB",lesoto:"LS",lesotho:"LS",liberia:"LR",libia:"LY",libya:"LY",liechtenstein:"LI",lituania:"LT",lithuania:"LT",luxemburgo:"LU",luxembourg:"LU",madagascar:"MG",malawi:"MW",maldivas:"MV",maldives:"MV",mali:"ML",malta:"MT","ilhas marshall":"MH","marshall islands":"MH",mauritania:"MR",mauricio:"MU",mauritius:"MU",micronesia:"FM",moldova:"MD",monaco:"MC",mongolia:"MN",montenegro:"ME",mocambique:"MZ",mozambique:"MZ",myanmar:"MM",birmania:"MM",namibia:"NA",nauru:"NR",nepal:"NP",nicaragua:"NI",niger:"NE","macedonia do norte":"MK","north macedonia":"MK",oma:"OM",oman:"OM",paquistao:"PK",pakistan:"PK",palau:"PW",panama:"PA","papua-nova guine":"PG","papua new guinea":"PG",filipinas:"PH",philippines:"PH",catar:"QA",qatar:"QA",romenia:"RO",romania:"RO",ruanda:"RW","sao cristovao e nevis":"KN","saint kitts and nevis":"KN","santa lucia":"LC","saint lucia":"LC","sao vicente e granadinas":"VC","saint vincent and the grenadines":"VC",samoa:"WS","san marino":"SM","sao tome e principe":"ST","sao tome and principe":"ST","arabia saudita":"SA","saudi arabia":"SA",senegal:"SN",servia:"RS",serbia:"RS",seicheles:"SC",seychelles:"SC","serra leoa":"SL","sierra leone":"SL",eslovaquia:"SK",slovakia:"SK",eslovenia:"SI",slovenia:"SI","ilhas salomao":"SB","solomon islands":"SB",somalia:"SO","sri lanka":"LK",sudao:"SD",sudan:"SD",suriname:"SR",siria:"SY",syria:"SY",tajiquistao:"TJ",tajikistan:"TJ",tanzania:"TZ",tailandia:"TH",thailand:"TH",togo:"TG",tonga:"TO","trinidad e tobago":"TT","trinidad and tobago":"TT",tunisia:"TN",turcomenistao:"TM",turkmenistan:"TM",tuvalu:"TV",uganda:"UG","emirados arabes unidos":"AE","united arab emirates":"AE",uzbequistao:"UZ",uzbekistan:"UZ",vanuatu:"VU","cidade do vaticano":"VA","vatican city":"VA",vaticano:"VA",iemen:"YE",yemen:"YE",zambia:"ZM",zimbabue:"ZW",zimbabwe:"ZW"};function G(a){if(!a)return null;const t=(a||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"");return U[t]||null}function V(a){return(a||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"").replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim()}const P={"africa equatorial francesa":"assets/flags/historical/África Equatorial Francesa_.png","africa ocidental francesa":"assets/flags/historical/África Ocidental Francesa.gif","africa portuguesa":"assets/flags/historical/África Portuguesa.png","alemanha ocidental":"assets/flags/historical/Alemanha Ocidental_.png","alemanha oriental":"assets/flags/historical/Alemanha Oriental.png",andorra:"assets/flags/historical/Andorra.png",bulgaria:"assets/flags/historical/Flag_of_Bulgaria_(1948–1967).svg.png",canada:"assets/flags/historical/Flag_of_Canada_(1921–1957).svg.png",espanha:"assets/flags/historical/Flag_of_Spain_(1945–1977).svg.png",grecia:"assets/flags/historical/State_Flag_of_Greece_(1863-1924_and_1935-1973).svg.png",hungria:"assets/flags/historical/Flag_of_Hungary_(1949-1956).svg.png",iugoslavia:"assets/flags/historical/Flag_of_Yugoslavia_(1946-1992).svg.png",romenia:"assets/flags/historical/Flag_of_Romania_(1952–1965).svg.png","caribe britanico":"assets/flags/historical/Caribe Britânico.png",congo:"assets/flags/historical/Flag_of_the_Congo_Free_State.svg.png","costa do ouro":"assets/flags/historical/Flag_of_the_Gold_Coast_(1877–1957).svg.png",egito:"assets/flags/historical/Flag_of_Egypt_(1952–1958).svg.png",etiopia:"assets/flags/historical/Flag_of_Ethiopia_(1897–1974).svg.png",ira:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iran:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iraque:"assets/flags/historical/Flag_of_Iraq_(1924–1959).svg.png",quenia:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png",kenya:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png","rodesia do sul":"assets/flags/historical/Flag_of_Southern_Rhodesia_(1924–1964).svg.png",siria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png",syria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png","uniao sovietica":"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",urss:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",russia:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png"};function k(a){if(!a)return null;const t=V(a);if(P[t])return P[t];for(const[e,i]of Object.entries(P))if(t.includes(e)||e.includes(t))return i;return null}function f(a,t="h-full w-full"){if(!a)return'<span class="text-slate-400 text-xs">🏴</span>';const e=k(a);if(e)return`<img src="${e}" alt="Bandeira de ${a}" class="${t} object-contain" loading="lazy">`;const i=G(a);return i?`<img src="${`assets/flags/countries/${i.toLowerCase()}.png`}" alt="Bandeira de ${a}" class="${t} object-contain" loading="lazy">`:(T.add(String(a||"").trim()),'<span class="text-slate-400 text-xs">🏴</span>')}const T=new Set;window.getMissingFlagCountries||(window.getMissingFlagCountries=()=>Array.from(T).sort());function q(a){if(!s.countryListContainer)return;s.countryListContainer.innerHTML="";const t=a.filter(e=>e.Pais&&e.PIB&&e.Populacao&&e.Estabilidade&&e.Urbanizacao&&e.Tecnologia);if(s.totalCountriesBadge&&(s.totalCountriesBadge.textContent=`${t.length} países`),t.length===0){s.countryListContainer.innerHTML='<div class="col-span-full text-center py-12"><div class="text-slate-400 mb-2">Nenhum país para exibir.</div></div>';return}t.forEach(e=>{const i=e.PIB??e.geral?.PIB??0,o=e.geral?.Populacao??e.Populacao??0,d=e.geral?.Estabilidade??e.Estabilidade??0,c=e.geral?.Tecnologia??e.Tecnologia??0,l=e.geral?.Urbanizacao??e.Urbanizacao??0,r=n(i),u=Number(o).toLocaleString("pt-BR"),p=E(parseFloat(d)),g={...e,PIB:i,Populacao:o,Tecnologia:c},b=y(g),m=f(e.Pais),v=`
      <button class="country-card-button group relative w-full rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_6px_20px_-12px_rgba(0,0,0,0.6)] hover:border-slate-600/60 hover:bg-slate-900/70 transition-all" data-country-id="${e.id}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-10 grid place-items-center rounded-md ring-1 ring-white/10 bg-slate-800">${m}</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-100">${e.Pais}</div>
              <div class="text-[10px] text-slate-400">PIB pc ${n(e.PIBPerCapita||i/o)}</div>
            </div>
          </div>
          <div class="shrink-0 text-center">
            <div class="grid place-items-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/70 text-[11px] font-bold text-slate-100">${b}</div>
            <div class="mt-0.5 text-[9px] uppercase text-slate-500">WPI</div>
          </div>
        </div>
        <div class="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="flex items-center gap-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
              PIB
            </div>
            <div class="mt-0.5 font-medium text-slate-100">${r}</div>
          </div>
          <div class="rounded-md border border-white/5 bg-slate-900/50 px-2 py-1">
            <div class="flex items-center gap-1 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
              Pop.
            </div>
            <div class="mt-0.5 font-medium text-slate-100">${u}</div>
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
            <span class="text-slate-300">${Math.max(0,Math.min(100,l))}%</span>
          </div>
          <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-1.5 rounded-full bg-emerald-500" style="width: ${Math.max(0,Math.min(100,l))}%"></div>
          </div>
        </div>
      </button>`;s.countryListContainer.innerHTML+=v})}function j(a){if(!s.countryPanelContent||!s.countryPanelModal)return;const t=a.PIB??a.geral?.PIB??0,e=a.geral?.Populacao??a.Populacao??0,i=a.geral?.Estabilidade??a.Estabilidade??0,o=a.geral?.Tecnologia??a.Tecnologia??0,d=a.geral?.Urbanizacao??a.Urbanizacao??0,c={...a,PIB:t,Populacao:e,Tecnologia:o},l=y(c),r=$({PIB:t,Burocracia:a.Burocracia,Estabilidade:i}),u=A({PIB:t,Veiculos:a.Veiculos}),p=H({PIB:t,Aeronautica:a.Aeronautica}),g=R({PIB:t,Marinha:a.Marinha}),b=E(parseFloat(i)),m=n(t),v=Number(e).toLocaleString("pt-BR"),C=n(a.PIBPerCapita||t/e),B=Math.max(0,Math.min(100,parseFloat(d))),S=`
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight flex items-center gap-2">${`<span class="inline-grid h-8 w-12 place-items-center rounded-md ring-1 ring-white/10 bg-slate-800 overflow-hidden">${f(a.Pais)}</span>`} ${a.Pais}</h2>
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
          <div class="mt-1 text-lg font-semibold">${m}</div>
        </div>
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            População
          </div>
          <div class="mt-1 text-lg font-semibold">${v}</div>
          <div class="mt-2 text-[12px] text-slate-400">Densidade urbana</div>
          <div class="mt-1">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
                Urbanização
              </span>
              <span class="text-slate-300">${B}%</span>
            </div>
            <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div class="h-1.5 rounded-full bg-emerald-500" style="width:${B}%"></div>
            </div>
          </div>
        </div>
      </div>

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
            <div class="text-sm font-semibold text-blue-400">${n(u)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Aeronaves por Turno</div>
            <div class="text-sm font-semibold text-cyan-400">${n(p)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Navios por Turno</div>
            <div class="text-sm font-semibold text-indigo-400">${n(g)}</div>
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

      <div class="flex items-center gap-2 mt-2">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border ${b.tone}">
          Estabilidade: ${b.label}
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
            <span class="text-slate-200">${o}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-emerald-400" style="width:${Math.max(0,Math.min(100,o))}%"></div>
          </div>
        </div>
      </div>
    </div>`,F=`
    <div class="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
      <h3 class="text-lg font-semibold">Resumo Estratégico</h3>
      <p class="mt-1 text-[12px] text-slate-400">Visão geral de capacidades e riscos do país no contexto do seu RPG.</p>
      <div class="mt-4 space-y-2">
        ${[["Modelo Político",a.ModeloPolitico||"—"],["PIB total",m],["PIB per capita",C],["Orçamento Nacional",`<span class="text-emerald-400">${n(r)}</span>`],["Prod. Veículos/turno",`<span class="text-blue-400">${n(u)}</span>`],["Prod. Aeronaves/turno",`<span class="text-cyan-400">${n(p)}</span>`],["Prod. Navios/turno",`<span class="text-indigo-400">${n(g)}</span>`],["População",v],["War Power Index",`${l}/100`],["Burocracia",`${a.Burocracia||0}%`],["Combustível",`${a.Combustivel||0}`],["Último Turno",`#${a.TurnoUltimaAtualizacao||0}`]].map(([x,L])=>`
          <div class="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2 text-[13px]">
            <span class="text-slate-400">${x}</span>
            <span class="font-medium text-slate-100">${L}</span>
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
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Ver Exército</button>
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Diplomacia</button>
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Indústria</button>
        <button class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition">Relatórios</button>
      </div>
    </div>`,z=`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${S}
      ${F}
    </div>`;s.countryPanelContent.innerHTML=z;const h=s.countryPanelModal;h.classList.remove("hidden"),requestAnimationFrame(()=>{h.classList.remove("opacity-0");const x=h.querySelector(".transform");x&&x.classList.remove("-translate-y-2")})}function D(a,t){const{narratorTools:e,userRoleBadge:i}=s;e&&(e.style.display=a||t?"block":"none");const o=document.querySelector('a[href="narrador.html"]');o&&(o.style.display=a||t?"block":"none"),i&&(t?(i.textContent="Admin",i.className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"):a?(i.textContent="Narrador",i.className="text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20"):(i.textContent="Jogador",i.className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"))}function Z(a){const t=document.createElement("div");t.className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";const e=`
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
        ${a.map(i=>{const o=f(i.Pais,"h-6 w-9");return`
            <div class="pais-option rounded-xl border border-bg-ring/70 p-3 cursor-pointer" data-pais-id="${i.id}" data-pais-nome="${i.Pais}">
              <div class="flex items-center gap-3">
                <div class="h-6 w-9 rounded bg-slate-800 grid place-items-center">${o}</div>
                <div class="flex-1">
                  <div class="font-medium text-slate-100">${i.Pais}</div>
                  <div class="text-xs text-slate-400">PIB: ${n(i.PIB||0)} · Pop: ${Number(i.Populacao||0).toLocaleString("pt-BR")} · Tech: ${i.Tecnologia||0}% · Estab: ${i.Estabilidade||0}/100</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">WPI</div>
                  <div class="text-sm font-bold text-slate-200">${y(i)}</div>
                </div>
              </div>
            </div>`}).join("")}
      </div>
      <div class="mt-6 flex gap-3">
        <button id="cancelar-selecao" class="flex-1 rounded-xl border border-bg-ring/70 px-4 py-2.5 text-slate-300">Cancelar</button>
        <button id="confirmar-selecao" class="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-slate-950 font-semibold" disabled>Confirmar Seleção</button>
      </div>
    </div>`;return t.innerHTML=e,document.body.appendChild(t),t}function W(a){const t=a.filter(l=>l.Player),e=t.map(l=>parseFloat(String(l.PIB).replace(/[$.]+/g,"").replace(",","."))||0),i=t.map(l=>parseFloat(String(l.Estabilidade).replace(/%/g,""))||0),o=e.length>0?e.reduce((l,r)=>l+r,0)/e.length:0,d=i.length>0?i.reduce((l,r)=>l+r,0)/i.length:0,c=a.filter(l=>{const r=(l.Visibilidade||"").toString().trim().toLowerCase();return r==="público"||r==="publico"||r==="public"}).length;s.totalPlayers&&M("total-players",t.length),s.pibMedio&&(s.pibMedio.textContent=n(o)),s.estabilidadeMedia&&(s.estabilidadeMedia.textContent=`${Math.round(d)}/100`),s.paisesPublicos&&M("paises-publicos",c)}function Y(a,t){if(a&&s.playerPanel){s.playerCountryName&&(s.playerCountryName.textContent=a.Pais||"País do Jogador");const e=document.getElementById("player-flag-container");e&&(e.innerHTML=f(a.Pais,"h-full w-full")),s.playerCurrentTurn&&(s.playerCurrentTurn.textContent=`#${t}`);const i=(parseFloat(a.PIB)||0)/(parseFloat(a.Populacao)||1),o=document.getElementById("player-pib-per-capita");if(o&&(o.textContent=n(i)),s.playerPib){const r=a.PIB||0,u=N(r);s.playerPib.textContent=u}const d=Number(a.Estabilidade)||0;s.playerEstabilidade&&(s.playerEstabilidade.textContent=`${d}/100`);const c=document.getElementById("player-estabilidade-bar");c&&(c.style.width=`${Math.max(0,Math.min(100,d))}%`,d>=75?c.className="h-1.5 rounded-full bg-emerald-400":d>=50?c.className="h-1.5 rounded-full bg-cyan-400":d>=25?c.className="h-1.5 rounded-full bg-yellow-400":c.className="h-1.5 rounded-full bg-red-400"),s.playerCombustivel&&(s.playerCombustivel.textContent=a.Combustivel||"50"),s.playerPibDelta&&(s.playerPibDelta.textContent="Sem histórico"),s.playerEstabilidadeDelta&&(s.playerEstabilidadeDelta.textContent="Sem histórico"),s.playerHistorico&&(s.playerHistorico.innerHTML=`
        <div class="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3 mb-2">
          <div class="font-medium">Turno #${t} (atual)</div>
          <div class="text-xs text-slate-400">PIB: ${n(a.PIB)} · Estab: ${d}/100 · Pop: ${Number(a.Populacao||0).toLocaleString("pt-BR")}</div>
        </div>`);const l=a.TurnoUltimaAtualizacao<t;s.playerNotifications&&(l?s.playerNotifications.classList.remove("hidden"):s.playerNotifications.classList.add("hidden")),s.playerPanel.style.display="block"}else s.playerCountryName&&(s.playerCountryName.textContent="Carregando..."),s.playerHistorico&&(s.playerHistorico.innerHTML='<div class="text-sm text-slate-400 italic">Nenhum histórico disponível</div>'),s.playerPanel&&(s.playerPanel.style.display="none")}export{q as a,D as b,Z as c,Y as f,f as g,j as r,W as u};
