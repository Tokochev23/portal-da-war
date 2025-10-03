import{j as o,k as ce,l as Q}from"./firebase-COmVF2I9.js";import{R as N}from"./resourceConsumptionCalculator-m-978Loo.js";import{R as S}from"./resourceProductionCalculator-DqTGEJNK.js";import{C as ue}from"./consumerGoodsCalculator-Cxcetyr8.js";const s={countryListContainer:document.getElementById("lista-paises-publicos"),emptyState:document.getElementById("empty-state"),totalCountriesBadge:document.getElementById("total-paises-badge"),totalPlayers:document.getElementById("total-players"),pibMedio:document.getElementById("pib-medio"),estabilidadeMedia:document.getElementById("estabilidade-media"),paisesPublicos:document.getElementById("paises-publicos"),playerCountryName:document.getElementById("player-country-name"),playerCurrentTurn:document.getElementById("player-current-turn"),playerPib:document.getElementById("player-pib"),playerEstabilidade:document.getElementById("player-estabilidade"),playerCombustivel:document.getElementById("player-combustivel"),playerPibDelta:document.getElementById("player-pib-delta"),playerEstabilidadeDelta:document.getElementById("player-estabilidade-delta"),playerCombustivelDelta:document.getElementById("player-combustivel-delta"),playerHistorico:document.getElementById("player-historico"),playerNotifications:document.getElementById("player-notifications"),playerPanel:document.getElementById("player-panel"),userRoleBadge:document.getElementById("user-role-badge"),countryPanelModal:document.getElementById("country-panel-modal"),countryPanelContent:document.getElementById("country-panel-content"),closeCountryPanelBtn:document.getElementById("close-country-panel")};function X(e,t,a){return Math.max(t,Math.min(a,e))}function ee(e){return e<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:e<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:e<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function T(e){const t=(parseFloat(e.PIB)||0)/(parseFloat(e.Populacao)||1),a=X(t,0,2e4)/200,i=Math.round(a*.45+(parseFloat(e.Tecnologia)||0)*.55);return X(i,1,100)}function ae(e){const t=parseFloat(e.PIB)||0,a=(parseFloat(e.Burocracia)||0)/100,i=(parseFloat(e.Estabilidade)||0)/100;return t*.25*a*i*1.5}function L(e){const t=ae(e),a=(parseFloat(e.MilitaryBudgetPercent)||30)/100;return t*a}function z(e){const t=(parseFloat(e.MilitaryDistributionVehicles)||40)/100,a=(parseFloat(e.MilitaryDistributionAircraft)||30)/100,i=(parseFloat(e.MilitaryDistributionNaval)||30)/100;return{vehicles:t,aircraft:a,naval:i,maintenancePercent:.15}}function me(e){const t=L(e),a=z(e);return t*a.vehicles}function pe(e){const t=L(e),a=z(e);return t*a.aircraft}function ve(e){const t=L(e),a=z(e);return t*a.naval}const be={afeganistao:"AF",afghanistan:"AF","africa do sul":"ZA","south africa":"ZA",alemanha:"DE",germany:"DE",argentina:"AR",australia:"AU",austria:"AT",belgica:"BE",belgium:"BE",bolivia:"BO",brasil:"BR",brazil:"BR",canada:"CA",chile:"CL",china:"CN",colombia:"CO","coreia do sul":"KR","south korea":"KR","coreia do norte":"KP","north korea":"KP",cuba:"CU",dinamarca:"DK",denmark:"DK",egito:"EG",egypt:"EG",espanha:"ES",spain:"ES","estados unidos":"US",eua:"US",usa:"US","united states":"US",finlandia:"FI",franca:"FR",france:"FR",grecia:"GR",greece:"GR",holanda:"NL","paises baixos":"NL",netherlands:"NL",hungria:"HU",hungary:"HU",india:"IN",indonesia:"ID",ira:"IR",iran:"IR",iraque:"IQ",iraq:"IQ",irlanda:"IE",ireland:"IE",israel:"IL",italia:"IT",italy:"IT",japao:"JP",japan:"JP",malasia:"MY",malaysia:"MY",marrocos:"MA",morocco:"MA",mexico:"MX",nigeria:"NG",noruega:"NO",norway:"NO","nova zelandia":"NZ","new zealand":"NZ",peru:"PE",polonia:"PL",poland:"PL",portugal:"PT","reino unido":"GB",inglaterra:"GB",uk:"GB","united kingdom":"GB",russia:"RU",urss:"RU","uniao sovietica":"RU",singapura:"SG",singapore:"SG",suecia:"SE",sweden:"SE",suica:"CH",switzerland:"CH",turquia:"TR",turkey:"TR",ucrania:"UA",ukraine:"UA",uruguai:"UY",venezuela:"VE",vietna:"VN",vietnam:"VN",equador:"EC",paraguai:"PY",albania:"AL",argelia:"DZ",algeria:"DZ",andorra:"AD",angola:"AO","antigua e barbuda":"AG","antigua and barbuda":"AG",armenia:"AM",azerbaijao:"AZ",azerbaijan:"AZ",bahamas:"BS",bahrein:"BH",bahrain:"BH",bangladesh:"BD",barbados:"BB",belarus:"BY",bielorrússia:"BY",belize:"BZ",benin:"BJ",butao:"BT",bhutan:"BT","bosnia e herzegovina":"BA","bosnia and herzegovina":"BA",botsuana:"BW",botswana:"BW",brunei:"BN",bulgaria:"BG","burkina faso":"BF",burundi:"BI",camboja:"KH",cambodia:"KH",camarões:"CM",cameroon:"CM","cabo verde":"CV","cape verde":"CV","republica centro-africana":"CF","central african republic":"CF",chade:"TD",chad:"TD",comores:"KM",comoros:"KM",congo:"CG","costa rica":"CR",croacia:"HR",croatia:"HR",chipre:"CY",cyprus:"CY","republica tcheca":"CZ","czech republic":"CZ",tchequia:"CZ","republica dominicana":"DO","dominican republic":"DO","timor-leste":"TL","east timor":"TL","el salvador":"SV","guine equatorial":"GQ","equatorial guinea":"GQ",eritreia:"ER",estonia:"EE",etiopia:"ET",ethiopia:"ET",fiji:"FJ",gabao:"GA",gabon:"GA",gambia:"GM",georgia:"GE",gana:"GH",ghana:"GH",guatemala:"GT",guine:"GN",guinea:"GN","guine-bissau":"GW","guinea-bissau":"GW",guiana:"GY",guyana:"GY",haiti:"HT",honduras:"HN",islandia:"IS",iceland:"IS",jamaica:"JM",jordania:"JO",jordan:"JO",cazaquistao:"KZ",kazakhstan:"KZ",quenia:"KE",kenya:"KE",kiribati:"KI",kuwait:"KW",quirguistao:"KG",kyrgyzstan:"KG",laos:"LA",letonia:"LV",latvia:"LV",libano:"LB",lebanon:"LB",lesoto:"LS",lesotho:"LS",liberia:"LR",libia:"LY",libya:"LY",liechtenstein:"LI",lituania:"LT",lithuania:"LT",luxemburgo:"LU",luxembourg:"LU",madagascar:"MG",malawi:"MW",maldivas:"MV",maldives:"MV",mali:"ML",malta:"MT","ilhas marshall":"MH","marshall islands":"MH",mauritania:"MR",mauricio:"MU",mauritius:"MU",micronesia:"FM",moldova:"MD",monaco:"MC",mongolia:"MN",montenegro:"ME",mocambique:"MZ",mozambique:"MZ",myanmar:"MM",birmania:"MM",namibia:"NA",nauru:"NR",nepal:"NP",nicaragua:"NI",niger:"NE","macedonia do norte":"MK","north macedonia":"MK",oma:"OM",oman:"OM",paquistao:"PK",pakistan:"PK",palau:"PW",panama:"PA","papua-nova guine":"PG","papua new guinea":"PG",filipinas:"PH",philippines:"PH",catar:"QA",qatar:"QA",romenia:"RO",romania:"RO",ruanda:"RW","sao cristovao e nevis":"KN","saint kitts and nevis":"KN","santa lucia":"LC","saint lucia":"LC","sao vicente e granadinas":"VC","saint vincent and the grenadines":"VC",samoa:"WS","san marino":"SM","sao tome e principe":"ST","sao tome and principe":"ST","arabia saudita":"SA","saudi arabia":"SA",senegal:"SN",servia:"RS",serbia:"RS",seicheles:"SC",seychelles:"SC","serra leoa":"SL","sierra leone":"SL",eslovaquia:"SK",slovakia:"SK",eslovenia:"SI",slovenia:"SI","ilhas salomao":"SB","solomon islands":"SB",somalia:"SO","sri lanka":"LK",sudao:"SD",sudan:"SD",suriname:"SR",siria:"SY",syria:"SY",tajiquistao:"TJ",tajikistan:"TJ",tanzania:"TZ",tailandia:"TH",thailand:"TH",togo:"TG",tonga:"TO","trinidad e tobago":"TT","trinidad and tobago":"TT",tunisia:"TN",turcomenistao:"TM",turkmenistan:"TM",tuvalu:"TV",uganda:"UG","emirados arabes unidos":"AE","united arab emirates":"AE",uzbequistao:"UZ",uzbekistan:"UZ",vanuatu:"VU","cidade do vaticano":"VA","vatican city":"VA",vaticano:"VA",iemen:"YE",yemen:"YE",zambia:"ZM",zimbabue:"ZW",zimbabwe:"ZW"};function ge(e){if(!e)return null;const t=(e||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"");return be[t]||null}function xe(e){return(e||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"").replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim()}const E={"africa equatorial francesa":"assets/flags/historical/África Equatorial Francesa_.png","africa ocidental francesa":"assets/flags/historical/África Ocidental Francesa.gif","africa portuguesa":"assets/flags/historical/África Portuguesa.png","alemanha ocidental":"assets/flags/historical/Alemanha Ocidental_.png","alemanha oriental":"assets/flags/historical/Alemanha Oriental.png",andorra:"assets/flags/historical/Andorra.png",bulgaria:"assets/flags/historical/Flag_of_Bulgaria_(1948–1967).svg.png",canada:"assets/flags/historical/Flag_of_Canada_(1921–1957).svg.png",espanha:"assets/flags/historical/Flag_of_Spain_(1945–1977).svg.png",grecia:"assets/flags/historical/State_Flag_of_Greece_(1863-1924_and_1935-1973).svg.png",hungria:"assets/flags/historical/Flag_of_Hungary_(1949-1956).svg.png",iugoslavia:"assets/flags/historical/Flag_of_Yugoslavia_(1946-1992).svg.png",romenia:"assets/flags/historical/Flag_of_Romania_(1952–1965).svg.png","caribe britanico":"assets/flags/historical/Caribe Britânico.png",congo:"assets/flags/historical/Flag_of_the_Congo_Free_State.svg.png","costa do ouro":"assets/flags/historical/Flag_of_the_Gold_Coast_(1877–1957).svg.png",egito:"assets/flags/historical/Flag_of_Egypt_(1952–1958).svg.png",etiopia:"assets/flags/historical/Flag_of_Ethiopia_(1897–1974).svg.png",ira:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iran:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iraque:"assets/flags/historical/Flag_of_Iraq_(1924–1959).svg.png",quenia:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png",kenya:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png","rodesia do sul":"assets/flags/historical/Flag_of_Southern_Rhodesia_(1924–1964).svg.png",siria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png",syria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png","uniao sovietica":"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",urss:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",russia:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png"};function fe(e){if(!e)return null;const t=xe(e);if(E[t])return E[t];for(const[a,i]of Object.entries(E))if(t.includes(a)||a.includes(t))return i;return null}function y(e,t="h-full w-full"){if(!e)return'<span class="text-slate-400 text-xs">🏴</span>';const a=fe(e);if(a)return`<img src="${a}" alt="Bandeira de ${e}" class="${t} object-contain" loading="lazy">`;const i=ge(e);return i?`<img src="${`assets/flags/countries/${i.toLowerCase()}.png`}" alt="Bandeira de ${e}" class="${t} object-contain" loading="lazy">`:(te.add(String(e||"").trim()),'<span class="text-slate-400 text-xs">🏴</span>')}const te=new Set;window.getMissingFlagCountries||(window.getMissingFlagCountries=()=>Array.from(te).sort());function Be(e){if(!s.countryListContainer)return;s.countryListContainer.innerHTML="";const t=e.filter(a=>a.Pais&&a.PIB&&a.Populacao&&a.Estabilidade&&a.Urbanizacao&&a.Tecnologia);if(s.totalCountriesBadge&&(s.totalCountriesBadge.textContent=`${t.length} países`),t.length===0){s.countryListContainer.innerHTML='<div class="col-span-full text-center py-12"><div class="text-slate-400 mb-2">Nenhum país para exibir.</div></div>';return}t.forEach(a=>{const i=a.PIB??a.geral?.PIB??0,n=a.geral?.Populacao??a.Populacao??0,d=a.geral?.Estabilidade??a.Estabilidade??0,c=a.geral?.Tecnologia??a.Tecnologia??0,l=a.geral?.Urbanizacao??a.Urbanizacao??0,r=o(i),m=Number(n).toLocaleString("pt-BR"),u=ee(parseFloat(d)),p={...a,PIB:i,Populacao:n,Tecnologia:c},h=T(p),P=y(a.Pais),C=`
      <button class="country-card-button group relative w-full rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_6px_20px_-12px_rgba(0,0,0,0.6)] hover:border-slate-600/60 hover:bg-slate-900/70 transition-all" data-country-id="${a.id}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-10 grid place-items-center rounded-md ring-1 ring-white/10 bg-slate-800">${P}</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-100">${a.Pais}</div>
              <div class="text-[10px] text-slate-400">PIB pc ${o(a.PIBPerCapita||i/n)}</div>
            </div>
          </div>
          <div class="shrink-0 text-center">
            <div class="grid place-items-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/70 text-[11px] font-bold text-slate-100">${h}</div>
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
            <div class="mt-0.5 font-medium text-slate-100">${m}</div>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between gap-2">
          <div class="truncate text-[11px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${a.ModeloPolitico||"—"}</div>
          <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${u.tone}">${u.label}</span>
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
      </button>`;s.countryListContainer.innerHTML+=C})}function Me(e){if(!s.countryPanelContent||!s.countryPanelModal)return;const t=e.PIB??e.geral?.PIB??0,a=e.geral?.Populacao??e.Populacao??0,i=e.geral?.Estabilidade??e.Estabilidade??0,n=e.geral?.Tecnologia??e.Tecnologia??0,d=e.geral?.Urbanizacao??e.Urbanizacao??0,c={...e,PIB:t,Populacao:a,Tecnologia:n},l=T(c),r=ae({PIB:t,Burocracia:e.Burocracia,Estabilidade:i}),m=me({PIB:t,Veiculos:e.Veiculos}),u=pe({PIB:t,Aeronautica:e.Aeronautica}),p=ve({PIB:t,Marinha:e.Marinha}),h=ee(parseFloat(i)),P=o(t),C=Number(a).toLocaleString("pt-BR"),A=o(e.PIBPerCapita||t/a),F=Math.max(0,Math.min(100,parseFloat(d))),se=`
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight flex items-center gap-2">${`<span class="inline-grid h-8 w-12 place-items-center rounded-md ring-1 ring-white/10 bg-slate-800 overflow-hidden">${y(e.Pais)}</span>`} ${e.Pais}</h2>
          <div class="text-sm text-slate-400">PIB per capita <span class="font-semibold text-slate-200">${A}</span></div>
        </div>
        <div class="text-center">
          <div class="h-12 w-12 grid place-items-center rounded-full border border-white/10 bg-slate-900/60 text-sm font-bold">${l}</div>
          <div class="text-[10px] uppercase text-slate-500 mt-0.5">War Power</div>
        </div>
      </div>

      <div class="text-[12px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${e.ModeloPolitico||"—"}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
            PIB
          </div>
          <div class="mt-1 text-lg font-semibold">${P}</div>
        </div>
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            População
          </div>
          <div class="mt-1 text-lg font-semibold">${C}</div>
          <div class="mt-2 text-[12px] text-slate-400">Densidade urbana</div>
          <div class="mt-1">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
                Urbanização
              </span>
              <span class="text-slate-300">${F}%</span>
            </div>
            <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div class="h-1.5 rounded-full bg-emerald-500" style="width:${F}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Força Militar</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Exército</div>
            <div class="text-sm font-semibold text-slate-100">${e.Exercito||0}</div>
            <div class="text-[9px] text-slate-500">Força terrestre</div>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Burocracia</div>
          <div class="text-sm font-semibold text-slate-100">${e.Burocracia||0}%</div>
        </div>
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Combustível</div>
          <div class="text-sm font-semibold text-slate-100">${e.Combustivel||0}</div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Capacidade de Produção</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Veículos por Turno</div>
            <div class="text-sm font-semibold text-blue-400">${o(m)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Aeronaves por Turno</div>
            <div class="text-sm font-semibold text-cyan-400">${o(u)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Navios por Turno</div>
            <div class="text-sm font-semibold text-indigo-400">${o(p)}</div>
          </div>
        </div>
        
        <h5 class="text-xs font-medium text-slate-300 mt-3 mb-1">Tecnologias Militares</h5>
        <div class="grid grid-cols-3 gap-1">
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Veículos</div>
            <div class="text-xs font-semibold text-slate-100">${e.Veiculos||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Aeronáutica</div>
            <div class="text-xs font-semibold text-slate-100">${e.Aeronautica||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Naval</div>
            <div class="text-xs font-semibold text-slate-100">${e.Marinha||0}%</div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-2">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border ${h.tone}">
          Estabilidade: ${h.label}
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
    </div>`,ie=`
    <div class="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
      <h3 class="text-lg font-semibold">Resumo Estratégico</h3>
      <p class="mt-1 text-[12px] text-slate-400">Visão geral de capacidades e riscos do país no contexto do seu RPG.</p>
      <div class="mt-4 space-y-2">
        ${[["Modelo Político",e.ModeloPolitico||"—"],["PIB total",P],["PIB per capita",A],["Orçamento Nacional",`<span class="text-emerald-400">${o(r)}</span>`],["Prod. Veículos/turno",`<span class="text-blue-400">${o(m)}</span>`],["Prod. Aeronaves/turno",`<span class="text-cyan-400">${o(u)}</span>`],["Prod. Navios/turno",`<span class="text-indigo-400">${o(p)}</span>`],["População",C],["War Power Index",`${l}/100`],["Burocracia",`${e.Burocracia||0}%`],["Combustível",`${e.Combustivel||0}`],["Último Turno",`#${e.TurnoUltimaAtualizacao||0}`]].map(([v,de])=>`
          <div class="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2 text-[13px]">
            <span class="text-slate-400">${v}</span>
            <span class="font-medium text-slate-100">${de}</span>
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
    </div>`,x=N.calculateCountryConsumption(e),f=S.calculateCountryProduction(e),le=ue.calculateConsumerGoods(e),R=Math.round(f.Carvao||0),G=Math.round(x.Carvao||0),w=R-G,H=Math.round(f.Combustivel||0),V=Math.round(x.Combustivel||0),B=H-V,k=Math.round(f.Metais||0),U=Math.round(x.Metais||0),M=k-U,j=Math.round(f.Graos||0),q=Math.round(x.Graos||0),_=j-q,K=Math.round(f.Energia||0),O=Math.round(x.Energia||0),$=K-O,D=Math.round(le.percentage||0),oe=`
    <div id="modal-recursos" class="hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-100">⛏️ Recursos - ${e.Pais||"País"}</h3>
          <button id="close-modal-recursos" class="text-slate-400 hover:text-slate-200 text-2xl">×</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Combustível -->
          <div class="border border-orange-500/30 bg-orange-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">⛽</span>
              <span class="text-sm font-medium text-slate-300">Combustível</span>
            </div>
            <div class="text-3xl font-bold ${B>=0?"text-green-400":"text-red-400"}">${B>=0?"+":""}${formatNumber(B)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-orange-500/30">
              <span class="text-green-400">Prod: ${formatNumber(H)}</span>
              <span class="text-red-400">Cons: ${formatNumber(V)}</span>
            </div>
          </div>

          <!-- Carvão -->
          <div class="border border-slate-500/30 bg-slate-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🪨</span>
              <span class="text-sm font-medium text-slate-300">Carvão</span>
            </div>
            <div class="text-3xl font-bold ${w>=0?"text-green-400":"text-red-400"}">${w>=0?"+":""}${formatNumber(w)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-slate-500/30">
              <span class="text-green-400">Prod: ${formatNumber(R)}</span>
              <span class="text-red-400">Cons: ${formatNumber(G)}</span>
            </div>
          </div>

          <!-- Metais -->
          <div class="border border-gray-500/30 bg-gray-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🔩</span>
              <span class="text-sm font-medium text-slate-300">Metais</span>
            </div>
            <div class="text-3xl font-bold ${M>=0?"text-green-400":"text-red-400"}">${M>=0?"+":""}${formatNumber(M)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-gray-500/30">
              <span class="text-green-400">Prod: ${formatNumber(k)}</span>
              <span class="text-red-400">Cons: ${formatNumber(U)}</span>
            </div>
          </div>

          <!-- Grãos -->
          <div class="border border-amber-500/30 bg-amber-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">🌾</span>
              <span class="text-sm font-medium text-slate-300">Grãos</span>
            </div>
            <div class="text-3xl font-bold ${_>=0?"text-green-400":"text-red-400"}">${_>=0?"+":""}${formatNumber(_)}</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-amber-500/30">
              <span class="text-green-400">Prod: ${formatNumber(j)}</span>
              <span class="text-red-400">Cons: ${formatNumber(q)}</span>
            </div>
          </div>

          <!-- Energia -->
          <div class="border border-yellow-500/30 bg-yellow-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">⚡</span>
              <span class="text-sm font-medium text-slate-300">Energia</span>
            </div>
            <div class="text-3xl font-bold ${$>=0?"text-green-400":"text-red-400"}">${$>=0?"+":""}${formatNumber($)} MW</div>
            <div class="text-xs text-slate-400 mt-1">saldo/turno</div>
            <div class="flex justify-between text-xs mt-2 pt-2 border-t border-yellow-500/30">
              <span class="text-green-400">Prod: ${formatNumber(K)} MW</span>
              <span class="text-red-400">Cons: ${formatNumber(O)} MW</span>
            </div>
          </div>

          <!-- Bens de Consumo -->
          <div class="border border-blue-500/30 bg-blue-500/10 rounded-xl p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-2xl">📦</span>
              <span class="text-sm font-medium text-slate-300">Bens de Consumo</span>
            </div>
            <div class="text-3xl font-bold text-blue-400">${D}%</div>
            <div class="text-xs text-slate-400 mt-1">disponibilidade</div>
            <div class="text-xs mt-2 pt-2 border-t border-blue-500/30 text-slate-400">
              Necessário: 100% | Atual: ${D}%
            </div>
          </div>
        </div>
      </div>
    </div>`,ne=`
    <div id="modal-inventario" class="hidden fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-slate-100">🎖️ Inventário de Guerra - ${e.Pais||"País"}</h3>
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
              <div class="text-2xl font-bold text-green-400">${e.VeiculosEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${e.VeiculosPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${e.Veiculos||0}</span>
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
              <div class="text-2xl font-bold text-blue-400">${e.AeronavesEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${e.AeronavesPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${e.Aeronautica||0}</span>
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
              <div class="text-2xl font-bold text-cyan-400">${e.NaviosEstoque||0}</div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="flex justify-between text-slate-300">
                <span>Capacidade de Produção:</span>
                <span class="font-medium">${e.NaviosPorTurno||0}/turno</span>
              </div>
              <div class="flex justify-between text-slate-300">
                <span>Tecnologia:</span>
                <span class="font-medium">${e.Marinha||0}</span>
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
                <div class="text-2xl font-bold text-red-400">${e.WarPower||0}/100</div>
              </div>
              <div>
                <div class="text-slate-400 text-xs mb-1">Orçamento Militar</div>
                <div class="text-lg font-bold text-slate-100">${o((e.PIB||0)*((e.MilitaryBudgetPercent||0)/100))}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,re=`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${se}
      ${ie}
    </div>
    ${oe}
    ${ne}
  `;s.countryPanelContent.innerHTML=re;const W=document.getElementById("btn-ver-recursos"),Z=document.getElementById("btn-ver-inventario"),b=document.getElementById("modal-recursos"),g=document.getElementById("modal-inventario"),Y=document.getElementById("close-modal-recursos"),J=document.getElementById("close-modal-inventario");W&&b&&W.addEventListener("click",()=>{b.classList.remove("hidden")}),Z&&g&&Z.addEventListener("click",()=>{g.classList.remove("hidden")}),Y&&b&&(Y.addEventListener("click",()=>{b.classList.add("hidden")}),b.addEventListener("click",v=>{v.target===b&&b.classList.add("hidden")})),J&&g&&(J.addEventListener("click",()=>{g.classList.add("hidden")}),g.addEventListener("click",v=>{v.target===g&&g.classList.add("hidden")}));const I=s.countryPanelModal;I.classList.remove("hidden"),requestAnimationFrame(()=>{I.classList.remove("opacity-0");const v=I.querySelector(".transform");v&&v.classList.remove("-translate-y-2")})}function _e(e,t){const{userRoleBadge:a}=s,i=document.querySelector('a[href="narrador.html"]');i&&(i.style.display=e||t?"block":"none"),a&&(t?(a.textContent="Admin",a.className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"):e?(a.textContent="Narrador",a.className="text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20"):(a.textContent="Jogador",a.className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"))}function $e(e){const t=document.createElement("div");t.className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";const a=`
    <div class="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-bg-soft border border-bg-ring/70 p-6 overflow-hidden">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-slate-100">Escolha seu País</h2>
        <p class="text-sm text-slate-400 mt-1">Selecione um país para governar no RPG</p>
      </div>
      <div class="mb-4">
        <input type="text" id="busca-pais" placeholder="Buscar país..." class="w-full rounded-xl bg-bg border border-bg-ring/70 p-3 text-sm">
        <div class="mt-2 text-xs text-slate-400">Mostrando <span id="paises-visiveis">${e.length}</span> países disponíveis</div>
      </div>
      <div class="max-h-96 overflow-y-auto space-y-2">
        ${e.map(i=>{const n=y(i.Pais,"h-6 w-9");return`
            <div class="pais-option rounded-xl border border-bg-ring/70 p-3 cursor-pointer" data-pais-id="${i.id}" data-pais-nome="${i.Pais}">
              <div class="flex items-center gap-3">
                <div class="h-6 w-9 rounded bg-slate-800 grid place-items-center">${n}</div>
                <div class="flex-1">
                  <div class="font-medium text-slate-100">${i.Pais}</div>
                  <div class="text-xs text-slate-400">PIB: ${o(i.PIB||0)} · Pop: ${Number(i.Populacao||0).toLocaleString("pt-BR")} · Tech: ${i.Tecnologia||0}% · Estab: ${i.Estabilidade||0}/100</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">WPI</div>
                  <div class="text-sm font-bold text-slate-200">${T(i)}</div>
                </div>
              </div>
            </div>`}).join("")}
      </div>
      <div class="mt-6 flex gap-3">
        <button id="cancelar-selecao" class="flex-1 rounded-xl border border-bg-ring/70 px-4 py-2.5 text-slate-300">Cancelar</button>
        <button id="confirmar-selecao" class="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-slate-950 font-semibold" disabled>Confirmar Seleção</button>
      </div>
    </div>`;return t.innerHTML=a,document.body.appendChild(t),t}function Ie(e){const t=e.filter(l=>l.Player),a=t.map(l=>parseFloat(String(l.PIB).replace(/[$.]+/g,"").replace(",","."))||0),i=t.map(l=>parseFloat(String(l.Estabilidade).replace(/%/g,""))||0),n=a.length>0?a.reduce((l,r)=>l+r,0)/a.length:0,d=i.length>0?i.reduce((l,r)=>l+r,0)/i.length:0,c=e.filter(l=>{const r=(l.Visibilidade||"").toString().trim().toLowerCase();return r==="público"||r==="publico"||r==="public"}).length;s.totalPlayers&&Q("total-players",t.length),s.pibMedio&&(s.pibMedio.textContent=o(n)),s.estabilidadeMedia&&(s.estabilidadeMedia.textContent=`${Math.round(d)}/100`),s.paisesPublicos&&Q("paises-publicos",c)}function Ee(e,t){if(e&&s.playerPanel){s.playerCountryName&&(s.playerCountryName.textContent=e.Pais||"País do Jogador");const a=document.getElementById("player-flag-container");a&&(a.innerHTML=y(e.Pais,"h-full w-full")),s.playerCurrentTurn&&(s.playerCurrentTurn.textContent=`#${t}`);const i=(parseFloat(e.PIB)||0)/(parseFloat(e.Populacao)||1),n=document.getElementById("player-pib-per-capita");if(n&&(n.textContent=o(i)),s.playerPib){const m=e.PIB||0,u=ce(m);s.playerPib.textContent=u}const d=Number(e.Estabilidade)||0;s.playerEstabilidade&&(s.playerEstabilidade.textContent=`${d}/100`);const c=document.getElementById("player-estabilidade-bar");if(c&&(c.style.width=`${Math.max(0,Math.min(100,d))}%`,d>=75?c.className="h-1.5 rounded-full bg-emerald-400":d>=50?c.className="h-1.5 rounded-full bg-cyan-400":d>=25?c.className="h-1.5 rounded-full bg-yellow-400":c.className="h-1.5 rounded-full bg-red-400"),s.playerCombustivel){const m=N.calculateCountryConsumption(e),u=S.calculateCountryProduction(e),p=Math.round((u.Combustivel||0)-(m.Combustivel||0));s.playerCombustivel.textContent=p}if(s.playerCombustivelDelta){const m=N.calculateCountryConsumption(e),u=S.calculateCountryProduction(e),p=Math.round((u.Combustivel||0)-(m.Combustivel||0));s.playerCombustivelDelta.textContent=p>=0?`+${p}`:`${p}`}s.playerPibDelta&&(s.playerPibDelta.textContent="Sem histórico"),s.playerEstabilidadeDelta&&(s.playerEstabilidadeDelta.textContent="Sem histórico"),s.playerHistorico&&(s.playerHistorico.innerHTML=`
        <div class="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3 mb-2">
          <div class="font-medium">Turno #${t} (atual)</div>
          <div class="text-xs text-slate-400">PIB: ${o(e.PIB)} · Estab: ${d}/100 · Pop: ${Number(e.Populacao||0).toLocaleString("pt-BR")}</div>
        </div>`);const l=e.TurnoUltimaAtualizacao<t;s.playerNotifications&&(l?s.playerNotifications.classList.remove("hidden"):s.playerNotifications.classList.add("hidden")),s.playerPanel.style.display="block";const r=document.getElementById("welcome-content");r&&(r.style.display="none")}else{s.playerCountryName&&(s.playerCountryName.textContent="Carregando..."),s.playerHistorico&&(s.playerHistorico.innerHTML='<div class="text-sm text-slate-400 italic">Nenhum histórico disponível</div>'),s.playerPanel&&(s.playerPanel.style.display="none");const a=document.getElementById("welcome-content");a&&(a.style.display="block")}}export{Be as a,_e as b,$e as c,Ee as f,y as g,Me as r,Ie as u};
