import"./preload-helper-f85Crcwt.js";/* empty css             */import{L as v,f as m,a as Me,b as ae,V as Ie,c as x,s as le,d as g,e as de,r as ce,g as ue,u as Se,h as Ae,i as ke,j as Te,k as oe,v as _e}from"./firebase-DSEPx490.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";class $e{constructor(){this.focusableElements=[],this.currentFocusIndex=-1,this.skipLinks=[],this.announcements=new Set,this.init()}init(){this.createSkipLinks(),this.setupKeyboardNavigation(),this.setupFocusManagement(),this.setupLiveRegions(),this.setupAnnouncements(),this.setupColorContrastMode(),this.setupReducedMotion(),v.info("Sistema de acessibilidade inicializado")}createSkipLinks(){const e=document.createElement("div");e.className="skip-links sr-only-focusable",e.innerHTML=`
            <a href="#main-content" class="skip-link">Pular para conteúdo principal</a>
            <a href="#navigation" class="skip-link">Pular para navegação</a>
            <a href="#countries-list" class="skip-link">Pular para lista de países</a>
            <a href="#player-panel" class="skip-link">Pular para painel do jogador</a>
        `,document.body.insertBefore(e,document.body.firstChild),this.addSkipLinksStyles()}addSkipLinksStyles(){const e=document.createElement("style");e.textContent=`
            .skip-links {
                position: absolute;
                top: -40px;
                left: 6px;
                z-index: 1000;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #ffb400;
                color: #0b1020;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                font-size: 14px;
                transition: top 0.3s ease;
            }
            
            .skip-link:focus {
                top: 6px;
            }
            
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
            
            .sr-only-focusable:focus,
            .sr-only-focusable:active {
                position: static !important;
                width: auto !important;
                height: auto !important;
                padding: inherit !important;
                margin: inherit !important;
                overflow: visible !important;
                clip: auto !important;
                white-space: inherit !important;
            }
            
            /* Focus indicators melhorados */
            *:focus {
                outline: 2px solid #ffb400;
                outline-offset: 2px;
                border-radius: 4px;
            }
            
            button:focus,
            .country-card-button:focus {
                outline: 2px solid #ffb400;
                outline-offset: 2px;
                box-shadow: 0 0 0 4px rgba(255, 180, 0, 0.2);
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .kpi-card,
                .country-card-button,
                .player-panel {
                    border: 2px solid #ffffff;
                    background: #000000;
                    color: #ffffff;
                }
                
                .text-slate-400 {
                    color: #ffffff !important;
                }
                
                .bg-slate-900\\/60 {
                    background: #000000 !important;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                *,
                *::before,
                *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            }
        `,document.head.appendChild(e)}setupKeyboardNavigation(){document.addEventListener("keydown",e=>{switch(e.key){case"Tab":this.handleTabNavigation(e);break;case"Escape":this.handleEscape(e);break;case"Enter":case" ":this.handleActivation(e);break;case"ArrowDown":case"ArrowUp":case"ArrowLeft":case"ArrowRight":this.handleArrowNavigation(e);break;case"Home":case"End":this.handleHomeEnd(e);break}})}handleTabNavigation(e){if(this.updateFocusableElements(),this.focusableElements.length===0)return;const a=this.focusableElements.indexOf(document.activeElement);if(e.shiftKey){const o=a<=0?this.focusableElements.length-1:a-1;this.focusableElements[o]?.focus()}else{const o=a>=this.focusableElements.length-1?0:a+1;this.focusableElements[o]?.focus()}}handleEscape(e){document.querySelectorAll('[role="dialog"]:not(.hidden)').forEach(i=>{i.classList.add("hidden");const s=i.getAttribute("data-trigger-element");s&&document.getElementById(s)?.focus()}),document.querySelectorAll('[aria-selected="true"]').forEach(i=>i.setAttribute("aria-selected","false"))}handleActivation(e){const a=e.target;a.getAttribute("role")==="button"&&a.tagName!=="BUTTON"&&(e.preventDefault(),a.click())}handleArrowNavigation(e){const a=e.target,o=a.closest('[role="grid"], [role="listbox"], [role="tablist"]');if(!o)return;e.preventDefault();const i=Array.from(o.querySelectorAll('[role="gridcell"], [role="option"], [role="tab"]')),s=i.indexOf(a);let n;switch(e.key){case"ArrowDown":n=Math.min(s+1,i.length-1);break;case"ArrowUp":n=Math.max(s-1,0);break;case"ArrowRight":n=Math.min(s+1,i.length-1);break;case"ArrowLeft":n=Math.max(s-1,0);break}n!==void 0&&i[n]&&(i[n].focus(),i.forEach((r,l)=>{r.setAttribute("aria-selected",l===n?"true":"false")}))}handleHomeEnd(e){const o=e.target.closest('[role="grid"], [role="listbox"]');if(!o)return;e.preventDefault();const i=Array.from(o.querySelectorAll('[role="gridcell"], [role="option"]'));e.key==="Home"&&i[0]?i[0].focus():e.key==="End"&&i[i.length-1]&&i[i.length-1].focus()}setupFocusManagement(){document.addEventListener("focusin",e=>{this.announceFocusContext(e.target)})}updateFocusableElements(){const e=`
            button:not([disabled]):not(.hidden),
            [href]:not([disabled]):not(.hidden),
            input:not([disabled]):not(.hidden),
            select:not([disabled]):not(.hidden),
            textarea:not([disabled]):not(.hidden),
            [tabindex]:not([tabindex="-1"]):not([disabled]):not(.hidden),
            [role="button"]:not([disabled]):not(.hidden),
            [role="link"]:not([disabled]):not(.hidden)
        `;this.focusableElements=Array.from(document.querySelectorAll(e)).filter(a=>{const o=getComputedStyle(a);return o.display!=="none"&&o.visibility!=="hidden"})}announceFocusContext(e){let a="";const o=e.closest(".country-card-button");if(o){const n=o.querySelector(".text-sm.font-semibold")?.textContent,r=o.querySelector('[class*="font-bold"]')?.textContent;a=`País: ${n}, Índice de poder: ${r}`}e.closest(".player-panel")&&(a="Painel do jogador");const s=e.closest('[role="dialog"]');s&&(a=`Modal: ${s.querySelector("h1, h2, h3")?.textContent||"Diálogo aberto"}`),a&&this.announce(a)}setupLiveRegions(){[{id:"live-polite",level:"polite"},{id:"live-assertive",level:"assertive"},{id:"live-status",level:"polite"}].forEach(a=>{if(!document.getElementById(a.id)){const o=document.createElement("div");o.id=a.id,o.className="sr-only",o.setAttribute("aria-live",a.level),o.setAttribute("aria-atomic","true"),document.body.appendChild(o)}})}setupAnnouncements(){const e=window.showNotification;e&&(window.showNotification=(a,o,i)=>(this.announce(`${a}: ${o}`,a==="error"?"assertive":"polite"),e(a,o,i)))}announce(e,a="polite"){const o=a==="assertive"?"live-assertive":"live-polite",i=document.getElementById(o);!i||this.announcements.has(e)||(this.announcements.add(e),i.textContent="",setTimeout(()=>{i.textContent=e,setTimeout(()=>{i.textContent="",this.announcements.delete(e)},5e3)},100),v.debug(`Anúncio (${a}): ${e}`))}setupColorContrastMode(){const e=window.matchMedia("(prefers-contrast: high)");this.applyContrastMode(e.matches),e.addEventListener("change",a=>{this.applyContrastMode(a.matches)}),this.createContrastToggle()}createContrastToggle(){const e=document.createElement("button");e.id="contrast-toggle",e.className="fixed top-4 left-4 z-50 px-3 py-2 bg-slate-900 text-white border border-slate-600 rounded-lg sr-only-focusable",e.innerHTML=`
            <span class="sr-only">Alternar modo alto contraste</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a4 4 0 004-4V5z" />
            </svg>
        `,e.addEventListener("click",()=>{const a=document.body.classList.toggle("high-contrast-mode");this.announce(`Modo alto contraste ${a?"ativado":"desativado"}`),localStorage.setItem("highContrastMode",a)}),document.body.appendChild(e),localStorage.getItem("highContrastMode")==="true"&&document.body.classList.add("high-contrast-mode")}applyContrastMode(e){document.body.classList.toggle("system-high-contrast",e),e&&this.announce("Modo alto contraste do sistema detectado")}setupReducedMotion(){const e=window.matchMedia("(prefers-reduced-motion: reduce)");this.applyMotionPreference(e.matches),e.addEventListener("change",a=>{this.applyMotionPreference(a.matches)})}applyMotionPreference(e){document.body.classList.toggle("reduce-motion",e),e&&(window.DOMUtils&&(DOMUtils.animateCounter,DOMUtils.animateCounter=(a,o,i={})=>{const s=typeof a=="string"?document.getElementById(a):a;s&&(s.textContent=o.toLocaleString(i.locale||"pt-BR"),i.onComplete?.())}),this.announce("Animações reduzidas ativadas"))}improveSemantics(){if(!(document.querySelector("main")||document.querySelector("#main-content"))){const s=document.querySelector(".mx-auto.max-w-7xl")||document.body;s&&!s.querySelector("main")&&(s.setAttribute("role","main"),s.id="main-content")}const a=document.querySelector("nav");a&&!a.id&&(a.id="navigation",a.setAttribute("aria-label","Navegação principal"));const o=document.getElementById("lista-paises-publicos");o&&(o.setAttribute("role","grid"),o.setAttribute("aria-label","Lista de países disponíveis"),o.id="countries-list",o.querySelectorAll(".country-card-button").forEach((n,r)=>{n.setAttribute("role","gridcell"),n.setAttribute("aria-rowindex",Math.floor(r/4)+1),n.setAttribute("aria-colindex",r%4+1);const l=n.querySelector(".text-sm.font-semibold")?.textContent;l&&n.setAttribute("aria-label",`Selecionar país ${l}`)})),document.querySelectorAll("input, select, textarea").forEach(s=>{if(!s.getAttribute("aria-label")&&!s.id){const n=s.parentElement.querySelector("label");if(n){const r=`input-${Math.random().toString(36).substr(2,9)}`;s.id=r,n.setAttribute("for",r)}else{const r=s.getAttribute("placeholder");r&&s.setAttribute("aria-label",r)}}s.hasAttribute("required")&&s.setAttribute("aria-required","true")})}runAccessibilityCheck(){const e=[];document.querySelectorAll("img:not([alt])").forEach(s=>{e.push(`Imagem sem texto alternativo: ${s.src}`)}),document.querySelectorAll("*").forEach(s=>{const n=getComputedStyle(s),r=n.color,l=n.backgroundColor;r&&l&&r!=="rgba(0, 0, 0, 0)"&&l!=="rgba(0, 0, 0, 0)"&&v.debug("Elemento com cores definidas:",{color:r,background:l})}),document.querySelectorAll("button:not([aria-label]):not([title])").forEach(s=>{s.textContent.trim()||e.push(`Botão sem label: ${s.outerHTML.substring(0,50)}...`)});const o=Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));let i=0;return o.forEach(s=>{const n=parseInt(s.tagName.charAt(1));n>i+1&&e.push(`Heading level skip: ${s.tagName} after h${i}`),i=n}),e.length>0?v.warn("Issues de acessibilidade encontrados:",e):v.info("Nenhum issue crítico de acessibilidade encontrado"),e}}const F=new $e,Ne={announce:(t,e)=>F.announce(t,e),focus:t=>{typeof t=="string"&&(t=document.getElementById(t)||document.querySelector(t)),t?.focus()},check:()=>F.runAccessibilityCheck(),improveSemantics:()=>F.improveSemantics()};document.addEventListener("DOMContentLoaded",()=>{F.improveSemantics(),v.info("Sistema de acessibilidade totalmente carregado")});const d={countryListContainer:document.getElementById("lista-paises-publicos"),emptyState:document.getElementById("empty-state"),totalCountriesBadge:document.getElementById("total-paises-badge"),totalPlayers:document.getElementById("total-players"),pibMedio:document.getElementById("pib-medio"),estabilidadeMedia:document.getElementById("estabilidade-media"),paisesPublicos:document.getElementById("paises-publicos"),playerCountryName:document.getElementById("player-country-name"),playerCurrentTurn:document.getElementById("player-current-turn"),playerPib:document.getElementById("player-pib"),playerEstabilidade:document.getElementById("player-estabilidade"),playerCombustivel:document.getElementById("player-combustivel"),playerPibDelta:document.getElementById("player-pib-delta"),playerEstabilidadeDelta:document.getElementById("player-estabilidade-delta"),playerCombustivelDelta:document.getElementById("player-combustivel-delta"),playerHistorico:document.getElementById("player-historico"),playerNotifications:document.getElementById("player-notifications"),playerPanel:document.getElementById("player-panel"),narratorTools:document.getElementById("narrator-tools"),userRoleBadge:document.getElementById("user-role-badge"),countryPanelModal:document.getElementById("country-panel-modal"),countryPanelContent:document.getElementById("country-panel-content"),closeCountryPanelBtn:document.getElementById("close-country-panel")};function ie(t,e,a){return Math.max(e,Math.min(a,t))}function me(t){return t<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:t<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:t<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function Z(t){const e=(parseFloat(t.PIB)||0)/(parseFloat(t.Populacao)||1),a=ie(e,0,2e4)/200,o=Math.round(a*.45+(parseFloat(t.Tecnologia)||0)*.55);return ie(o,1,100)}function ge(t){const e=parseFloat(t.PIB)||0,a=(parseFloat(t.Burocracia)||0)/100,o=(parseFloat(t.Estabilidade)||0)/100;return e*.25*a*o*1.5}function J(t){const e=ge(t),a=(parseFloat(t.MilitaryBudgetPercent)||30)/100;return e*a}function Q(t){const e=(parseFloat(t.MilitaryDistributionVehicles)||40)/100,a=(parseFloat(t.MilitaryDistributionAircraft)||30)/100,o=(parseFloat(t.MilitaryDistributionNaval)||30)/100;return{vehicles:e,aircraft:a,naval:o,maintenancePercent:.15}}function ze(t){const e=J(t),a=Q(t);return e*a.vehicles}function Fe(t){const e=J(t),a=Q(t);return e*a.aircraft}function Re(t){const e=J(t),a=Q(t);return e*a.naval}const qe={afeganistao:"AF",afghanistan:"AF","africa do sul":"ZA","south africa":"ZA",alemanha:"DE",germany:"DE",argentina:"AR",australia:"AU",austria:"AT",belgica:"BE",belgium:"BE",bolivia:"BO",brasil:"BR",brazil:"BR",canada:"CA",chile:"CL",china:"CN",colombia:"CO","coreia do sul":"KR","south korea":"KR","coreia do norte":"KP","north korea":"KP",cuba:"CU",dinamarca:"DK",denmark:"DK",egito:"EG",egypt:"EG",espanha:"ES",spain:"ES","estados unidos":"US",eua:"US",usa:"US","united states":"US",finlandia:"FI",franca:"FR",france:"FR",grecia:"GR",greece:"GR",holanda:"NL","paises baixos":"NL",netherlands:"NL",hungria:"HU",hungary:"HU",india:"IN",indonesia:"ID",ira:"IR",iran:"IR",iraque:"IQ",iraq:"IQ",irlanda:"IE",ireland:"IE",israel:"IL",italia:"IT",italy:"IT",japao:"JP",japan:"JP",malasia:"MY",malaysia:"MY",marrocos:"MA",morocco:"MA",mexico:"MX",nigeria:"NG",noruega:"NO",norway:"NO","nova zelandia":"NZ","new zealand":"NZ",peru:"PE",polonia:"PL",poland:"PL",portugal:"PT","reino unido":"GB",inglaterra:"GB",uk:"GB","united kingdom":"GB",russia:"RU",urss:"RU","uniao sovietica":"RU",singapura:"SG",singapore:"SG",suecia:"SE",sweden:"SE",suica:"CH",switzerland:"CH",turquia:"TR",turkey:"TR",ucrania:"UA",ukraine:"UA",uruguai:"UY",venezuela:"VE",vietna:"VN",vietnam:"VN",equador:"EC",paraguai:"PY",albania:"AL",argelia:"DZ",algeria:"DZ",andorra:"AD",angola:"AO","antigua e barbuda":"AG","antigua and barbuda":"AG",armenia:"AM",azerbaijao:"AZ",azerbaijan:"AZ",bahamas:"BS",bahrein:"BH",bahrain:"BH",bangladesh:"BD",barbados:"BB",belarus:"BY",bielorrússia:"BY",belize:"BZ",benin:"BJ",butao:"BT",bhutan:"BT","bosnia e herzegovina":"BA","bosnia and herzegovina":"BA",botsuana:"BW",botswana:"BW",brunei:"BN",bulgaria:"BG","burkina faso":"BF",burundi:"BI",camboja:"KH",cambodia:"KH",camarões:"CM",cameroon:"CM","cabo verde":"CV","cape verde":"CV","republica centro-africana":"CF","central african republic":"CF",chade:"TD",chad:"TD",comores:"KM",comoros:"KM",congo:"CG","costa rica":"CR",croacia:"HR",croatia:"HR",chipre:"CY",cyprus:"CY","republica tcheca":"CZ","czech republic":"CZ",tchequia:"CZ","republica dominicana":"DO","dominican republic":"DO","timor-leste":"TL","east timor":"TL","el salvador":"SV","guine equatorial":"GQ","equatorial guinea":"GQ",eritreia:"ER",estonia:"EE",etiopia:"ET",ethiopia:"ET",fiji:"FJ",gabao:"GA",gabon:"GA",gambia:"GM",georgia:"GE",gana:"GH",ghana:"GH",guatemala:"GT",guine:"GN",guinea:"GN","guine-bissau":"GW","guinea-bissau":"GW",guiana:"GY",guyana:"GY",haiti:"HT",honduras:"HN",islandia:"IS",iceland:"IS",jamaica:"JM",jordania:"JO",jordan:"JO",cazaquistao:"KZ",kazakhstan:"KZ",quenia:"KE",kenya:"KE",kiribati:"KI",kuwait:"KW",quirguistao:"KG",kyrgyzstan:"KG",laos:"LA",letonia:"LV",latvia:"LV",libano:"LB",lebanon:"LB",lesoto:"LS",lesotho:"LS",liberia:"LR",libia:"LY",libya:"LY",liechtenstein:"LI",lituania:"LT",lithuania:"LT",luxemburgo:"LU",luxembourg:"LU",madagascar:"MG",malawi:"MW",maldivas:"MV",maldives:"MV",mali:"ML",malta:"MT","ilhas marshall":"MH","marshall islands":"MH",mauritania:"MR",mauricio:"MU",mauritius:"MU",micronesia:"FM",moldova:"MD",monaco:"MC",mongolia:"MN",montenegro:"ME",mocambique:"MZ",mozambique:"MZ",myanmar:"MM",birmania:"MM",namibia:"NA",nauru:"NR",nepal:"NP",nicaragua:"NI",niger:"NE","macedonia do norte":"MK","north macedonia":"MK",oma:"OM",oman:"OM",paquistao:"PK",pakistan:"PK",palau:"PW",panama:"PA","papua-nova guine":"PG","papua new guinea":"PG",filipinas:"PH",philippines:"PH",catar:"QA",qatar:"QA",romenia:"RO",romania:"RO",ruanda:"RW","sao cristovao e nevis":"KN","saint kitts and nevis":"KN","santa lucia":"LC","saint lucia":"LC","sao vicente e granadinas":"VC","saint vincent and the grenadines":"VC",samoa:"WS","san marino":"SM","sao tome e principe":"ST","sao tome and principe":"ST","arabia saudita":"SA","saudi arabia":"SA",senegal:"SN",servia:"RS",serbia:"RS",seicheles:"SC",seychelles:"SC","serra leoa":"SL","sierra leone":"SL",eslovaquia:"SK",slovakia:"SK",eslovenia:"SI",slovenia:"SI","ilhas salomao":"SB","solomon islands":"SB",somalia:"SO","sri lanka":"LK",sudao:"SD",sudan:"SD",suriname:"SR",siria:"SY",syria:"SY",tajiquistao:"TJ",tajikistan:"TJ",tanzania:"TZ",tailandia:"TH",thailand:"TH",togo:"TG",tonga:"TO","trinidad e tobago":"TT","trinidad and tobago":"TT",tunisia:"TN",turcomenistao:"TM",turkmenistan:"TM",tuvalu:"TV",uganda:"UG","emirados arabes unidos":"AE","united arab emirates":"AE",uzbequistao:"UZ",uzbekistan:"UZ",vanuatu:"VU","cidade do vaticano":"VA","vatican city":"VA",vaticano:"VA",iemen:"YE",yemen:"YE",zambia:"ZM",zimbabue:"ZW",zimbabwe:"ZW"};function Ue(t){if(!t)return null;const e=(t||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"");return qe[e]||null}function He(t){return(t||"").toLowerCase().normalize("NFD").replace(new RegExp("\\p{Diacritic}","gu"),"").replace(/[^\w\s]/g,"").replace(/\s+/g," ").trim()}const K={"africa equatorial francesa":"assets/flags/historical/África Equatorial Francesa_.png","africa ocidental francesa":"assets/flags/historical/África Ocidental Francesa.gif","africa portuguesa":"assets/flags/historical/África Portuguesa.png","alemanha ocidental":"assets/flags/historical/Alemanha Ocidental_.png","alemanha oriental":"assets/flags/historical/Alemanha Oriental.png",andorra:"assets/flags/historical/Andorra.png",bulgaria:"assets/flags/historical/Flag_of_Bulgaria_(1948–1967).svg.png",canada:"assets/flags/historical/Flag_of_Canada_(1921–1957).svg.png",espanha:"assets/flags/historical/Flag_of_Spain_(1945–1977).svg.png",grecia:"assets/flags/historical/State_Flag_of_Greece_(1863-1924_and_1935-1973).svg.png",hungria:"assets/flags/historical/Flag_of_Hungary_(1949-1956).svg.png",iugoslavia:"assets/flags/historical/Flag_of_Yugoslavia_(1946-1992).svg.png",romenia:"assets/flags/historical/Flag_of_Romania_(1952–1965).svg.png","caribe britanico":"assets/flags/historical/Caribe Britânico.png",congo:"assets/flags/historical/Flag_of_the_Congo_Free_State.svg.png","costa do ouro":"assets/flags/historical/Flag_of_the_Gold_Coast_(1877–1957).svg.png",egito:"assets/flags/historical/Flag_of_Egypt_(1952–1958).svg.png",etiopia:"assets/flags/historical/Flag_of_Ethiopia_(1897–1974).svg.png",ira:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iran:"assets/flags/historical/State_flag_of_the_Imperial_State_of_Iran_(with_standardized_lion_and_sun).svg.png",iraque:"assets/flags/historical/Flag_of_Iraq_(1924–1959).svg.png",quenia:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png",kenya:"assets/flags/historical/Flag_of_Kenya_(1921–1963).svg.png","rodesia do sul":"assets/flags/historical/Flag_of_Southern_Rhodesia_(1924–1964).svg.png",siria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png",syria:"assets/flags/historical/Flag_of_the_United_Arab_Republic_(1958–1971),_Flag_of_Syria_(1980–2024).svg.png","uniao sovietica":"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",urss:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png",russia:"assets/flags/historical/Flag_of_the_Soviet_Union_(1936_–_1955).svg.png"};function De(t){if(!t)return null;const e=He(t);if(K[e])return K[e];for(const[a,o]of Object.entries(K))if(e.includes(a)||a.includes(e))return o;return null}function G(t,e="h-full w-full"){if(!t)return'<span class="text-slate-400 text-xs">🏴</span>';const a=De(t);if(a)return`<img src="${a}" alt="Bandeira de ${t}" class="${e} object-contain" loading="lazy">`;const o=Ue(t);return o?`<img src="${`assets/flags/countries/${o.toLowerCase()}.png`}" alt="Bandeira de ${t}" class="${e} object-contain" loading="lazy">`:(pe.add(String(t||"").trim()),'<span class="text-slate-400 text-xs">🏴</span>')}const pe=new Set;window.getMissingFlagCountries||(window.getMissingFlagCountries=()=>Array.from(pe).sort());function Ge(t){if(!d.countryListContainer)return;d.countryListContainer.innerHTML="";const e=t.filter(a=>a.Pais&&a.PIB&&a.Populacao&&a.Estabilidade&&a.Urbanizacao&&a.Tecnologia);if(d.totalCountriesBadge&&(d.totalCountriesBadge.textContent=`${e.length} países`),e.length===0){d.countryListContainer.innerHTML='<div class="col-span-full text-center py-12"><div class="text-slate-400 mb-2">Nenhum país para exibir.</div></div>';return}e.forEach(a=>{const o=a.PIB??a.geral?.PIB??0,i=a.geral?.Populacao??a.Populacao??0,s=a.geral?.Estabilidade??a.Estabilidade??0,n=a.geral?.Tecnologia??a.Tecnologia??0,r=a.geral?.Urbanizacao??a.Urbanizacao??0,l=m(o),b=Number(i).toLocaleString("pt-BR"),y=me(parseFloat(s)),C={...a,PIB:o,Populacao:i,Tecnologia:n},A=Z(C),L=G(a.Pais),$=`
      <button class="country-card-button group relative w-full rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 text-left shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_6px_20px_-12px_rgba(0,0,0,0.6)] hover:border-slate-600/60 hover:bg-slate-900/70 transition-all" data-country-id="${a.id}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="h-7 w-10 grid place-items-center rounded-md ring-1 ring-white/10 bg-slate-800">${L}</div>
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-slate-100">${a.Pais}</div>
              <div class="text-[10px] text-slate-400">PIB pc ${m(a.PIBPerCapita||o/i)}</div>
            </div>
          </div>
          <div class="shrink-0 text-center">
            <div class="grid place-items-center h-8 w-8 rounded-full border border-white/10 bg-slate-900/70 text-[11px] font-bold text-slate-100">${A}</div>
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
            <div class="mt-0.5 font-medium text-slate-100">${b}</div>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between gap-2">
          <div class="truncate text-[11px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${a.ModeloPolitico||"—"}</div>
          <span class="inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${y.tone}">${y.label}</span>
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
      </button>`;d.countryListContainer.innerHTML+=$})}function he(t){if(!d.countryPanelContent||!d.countryPanelModal)return;const e=t.PIB??t.geral?.PIB??0,a=t.geral?.Populacao??t.Populacao??0,o=t.geral?.Estabilidade??t.Estabilidade??0,i=t.geral?.Tecnologia??t.Tecnologia??0,s=t.geral?.Urbanizacao??t.Urbanizacao??0,n={...t,PIB:e,Populacao:a,Tecnologia:i},r=Z(n),l=ge({PIB:e,Burocracia:t.Burocracia,Estabilidade:o}),b=ze({PIB:e,Veiculos:t.Veiculos}),y=Fe({PIB:e,Aeronautica:t.Aeronautica}),C=Re({PIB:e,Marinha:t.Marinha}),A=me(parseFloat(o)),L=m(e),$=Number(a).toLocaleString("pt-BR"),ee=m(t.PIBPerCapita||e/a),te=Math.max(0,Math.min(100,parseFloat(s))),Ce=`
    <div class="space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-2xl font-extrabold tracking-tight flex items-center gap-2">${`<span class="inline-grid h-8 w-12 place-items-center rounded-md ring-1 ring-white/10 bg-slate-800 overflow-hidden">${G(t.Pais)}</span>`} ${t.Pais}</h2>
          <div class="text-sm text-slate-400">PIB per capita <span class="font-semibold text-slate-200">${ee}</span></div>
        </div>
        <div class="text-center">
          <div class="h-12 w-12 grid place-items-center rounded-full border border-white/10 bg-slate-900/60 text-sm font-bold">${r}</div>
          <div class="text-[10px] uppercase text-slate-500 mt-0.5">War Power</div>
        </div>
      </div>

      <div class="text-[12px] text-slate-300"><span class="text-slate-400">Modelo:</span> ${t.ModeloPolitico||"—"}</div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2v18H3V3zm4 8h2v10H7V11zm4-4h2v14h-2V7zm4 6h2v8h-2v-8zm4-10h2v18h-2V3z"/></svg>
            PIB
          </div>
          <div class="mt-1 text-lg font-semibold">${L}</div>
        </div>
        <div class="rounded-xl border border-white/5 bg-slate-900/50 p-3">
          <div class="flex items-center gap-2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/></svg>
            População
          </div>
          <div class="mt-1 text-lg font-semibold">${$}</div>
          <div class="mt-2 text-[12px] text-slate-400">Densidade urbana</div>
          <div class="mt-1">
            <div class="flex items-center justify-between text-[11px] text-slate-400">
              <span class="inline-flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h12v2H4v-2zm0 5h8v2H4v-2z"/></svg>
                Urbanização
              </span>
              <span class="text-slate-300">${te}%</span>
            </div>
            <div class="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div class="h-1.5 rounded-full bg-emerald-500" style="width:${te}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Força Militar</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Exército</div>
            <div class="text-sm font-semibold text-slate-100">${t.Exercito||0}</div>
            <div class="text-[9px] text-slate-500">Força terrestre</div>
          </div>
        </div>
      </div>

      <div class="mt-4 grid grid-cols-2 gap-2">
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Burocracia</div>
          <div class="text-sm font-semibold text-slate-100">${t.Burocracia||0}%</div>
        </div>
        <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
          <div class="text-[10px] text-slate-400">Combustível</div>
          <div class="text-sm font-semibold text-slate-100">${t.Combustivel||0}</div>
        </div>
      </div>

      <div class="mt-4">
        <h4 class="text-sm font-medium text-slate-200 mb-2">Capacidade de Produção</h4>
        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Veículos por Turno</div>
            <div class="text-sm font-semibold text-blue-400">${m(b)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Aeronaves por Turno</div>
            <div class="text-sm font-semibold text-cyan-400">${m(y)}</div>
          </div>
          <div class="rounded-lg border border-white/5 bg-slate-900/50 p-2">
            <div class="text-[10px] text-slate-400">Navios por Turno</div>
            <div class="text-sm font-semibold text-indigo-400">${m(C)}</div>
          </div>
        </div>
        
        <h5 class="text-xs font-medium text-slate-300 mt-3 mb-1">Tecnologias Militares</h5>
        <div class="grid grid-cols-3 gap-1">
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Veículos</div>
            <div class="text-xs font-semibold text-slate-100">${t.Veiculos||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Aeronáutica</div>
            <div class="text-xs font-semibold text-slate-100">${t.Aeronautica||0}%</div>
          </div>
          <div class="rounded border border-white/5 bg-slate-900/30 p-1.5">
            <div class="text-[9px] text-slate-500">Naval</div>
            <div class="text-xs font-semibold text-slate-100">${t.Marinha||0}%</div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 mt-2">
        <span class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] border ${A.tone}">
          Estabilidade: ${A.label}
        </span>
        <div class="ml-auto text-[12px] text-slate-400">Índice: <span class="text-slate-200 font-semibold">${o}</span></div>
      </div>

      <div class="space-y-3 mt-2">
        <div>
          <div class="flex items-center justify-between text-[12px] text-slate-400">
            <span>Estabilidade Interna</span>
            <span class="text-slate-200">${o}%</span>
          </div>
          <div class="mt-1 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-2 rounded-full bg-cyan-400" style="width:${Math.max(0,Math.min(100,o))}%"></div>
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
    </div>`,Le=`
    <div class="rounded-2xl border border-white/10 bg-slate-900/30 p-4">
      <h3 class="text-lg font-semibold">Resumo Estratégico</h3>
      <p class="mt-1 text-[12px] text-slate-400">Visão geral de capacidades e riscos do país no contexto do seu RPG.</p>
      <div class="mt-4 space-y-2">
        ${[["Modelo Político",t.ModeloPolitico||"—"],["PIB total",L],["PIB per capita",ee],["Orçamento Nacional",`<span class="text-emerald-400">${m(l)}</span>`],["Prod. Veículos/turno",`<span class="text-blue-400">${m(b)}</span>`],["Prod. Aeronaves/turno",`<span class="text-cyan-400">${m(y)}</span>`],["Prod. Navios/turno",`<span class="text-indigo-400">${m(C)}</span>`],["População",$],["War Power Index",`${r}/100`],["Burocracia",`${t.Burocracia||0}%`],["Combustível",`${t.Combustivel||0}`],["Último Turno",`#${t.TurnoUltimaAtualizacao||0}`]].map(([N,Be])=>`
          <div class="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/40 px-3 py-2 text-[13px]">
            <span class="text-slate-400">${N}</span>
            <span class="font-medium text-slate-100">${Be}</span>
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
    </div>`,Pe=`
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${Ce}
      ${Le}
    </div>`;d.countryPanelContent.innerHTML=Pe;const j=d.countryPanelModal;j.classList.remove("hidden"),requestAnimationFrame(()=>{j.classList.remove("opacity-0");const N=j.querySelector(".transform");N&&N.classList.remove("-translate-y-2")})}function se(t,e){const{narratorTools:a,userRoleBadge:o}=d;a&&(a.style.display=t||e?"block":"none");const i=document.querySelector('a[href="narrador.html"]');i&&(i.style.display=t||e?"block":"none"),o&&(e?(o.textContent="Admin",o.className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20"):t?(o.textContent="Narrador",o.className="text-xs px-2 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20"):(o.textContent="Jogador",o.className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"))}function Ve(t){const e=document.createElement("div");e.className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";const a=`
    <div class="w-full max-w-2xl max-h-[80vh] rounded-2xl bg-bg-soft border border-bg-ring/70 p-6 overflow-hidden">
      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-slate-100">Escolha seu País</h2>
        <p class="text-sm text-slate-400 mt-1">Selecione um país para governar no RPG</p>
      </div>
      <div class="mb-4">
        <input type="text" id="busca-pais" placeholder="Buscar país..." class="w-full rounded-xl bg-bg border border-bg-ring/70 p-3 text-sm">
        <div class="mt-2 text-xs text-slate-400">Mostrando <span id="paises-visiveis">${t.length}</span> países disponíveis</div>
      </div>
      <div class="max-h-96 overflow-y-auto space-y-2">
        ${t.map(o=>{const i=G(o.Pais,"h-6 w-9");return`
            <div class="pais-option rounded-xl border border-bg-ring/70 p-3 cursor-pointer" data-pais-id="${o.id}" data-pais-nome="${o.Pais}">
              <div class="flex items-center gap-3">
                <div class="h-6 w-9 rounded bg-slate-800 grid place-items-center">${i}</div>
                <div class="flex-1">
                  <div class="font-medium text-slate-100">${o.Pais}</div>
                  <div class="text-xs text-slate-400">PIB: ${m(o.PIB||0)} · Pop: ${Number(o.Populacao||0).toLocaleString("pt-BR")} · Tech: ${o.Tecnologia||0}% · Estab: ${o.Estabilidade||0}/100</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-slate-400">WPI</div>
                  <div class="text-sm font-bold text-slate-200">${Z(o)}</div>
                </div>
              </div>
            </div>`}).join("")}
      </div>
      <div class="mt-6 flex gap-3">
        <button id="cancelar-selecao" class="flex-1 rounded-xl border border-bg-ring/70 px-4 py-2.5 text-slate-300">Cancelar</button>
        <button id="confirmar-selecao" class="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-slate-950 font-semibold" disabled>Confirmar Seleção</button>
      </div>
    </div>`;return e.innerHTML=a,document.body.appendChild(e),e}function Y(t){const e=t.filter(r=>r.Player),a=e.map(r=>parseFloat(String(r.PIB).replace(/[$.]+/g,"").replace(",","."))||0),o=e.map(r=>parseFloat(String(r.Estabilidade).replace(/%/g,""))||0),i=a.length>0?a.reduce((r,l)=>r+l,0)/a.length:0,s=o.length>0?o.reduce((r,l)=>r+l,0)/o.length:0,n=t.filter(r=>{const l=(r.Visibilidade||"").toString().trim().toLowerCase();return l==="público"||l==="publico"||l==="public"}).length;d.totalPlayers&&ae("total-players",e.length),d.pibMedio&&(d.pibMedio.textContent=m(i)),d.estabilidadeMedia&&(d.estabilidadeMedia.textContent=`${Math.round(s)}/100`),d.paisesPublicos&&ae("paises-publicos",n)}function W(t,e){if(t&&d.playerPanel){d.playerCountryName&&(d.playerCountryName.textContent=t.Pais||"País do Jogador");const a=document.getElementById("player-flag-container");a&&(a.innerHTML=G(t.Pais,"h-full w-full")),d.playerCurrentTurn&&(d.playerCurrentTurn.textContent=`#${e}`);const o=(parseFloat(t.PIB)||0)/(parseFloat(t.Populacao)||1),i=document.getElementById("player-pib-per-capita");if(i&&(i.textContent=m(o)),d.playerPib){const l=t.PIB||0,b=Me(l);d.playerPib.textContent=b}const s=Number(t.Estabilidade)||0;d.playerEstabilidade&&(d.playerEstabilidade.textContent=`${s}/100`);const n=document.getElementById("player-estabilidade-bar");n&&(n.style.width=`${Math.max(0,Math.min(100,s))}%`,s>=75?n.className="h-1.5 rounded-full bg-emerald-400":s>=50?n.className="h-1.5 rounded-full bg-cyan-400":s>=25?n.className="h-1.5 rounded-full bg-yellow-400":n.className="h-1.5 rounded-full bg-red-400"),d.playerCombustivel&&(d.playerCombustivel.textContent=t.Combustivel||"50"),d.playerPibDelta&&(d.playerPibDelta.textContent="Sem histórico"),d.playerEstabilidadeDelta&&(d.playerEstabilidadeDelta.textContent="Sem histórico"),d.playerHistorico&&(d.playerHistorico.innerHTML=`
        <div class="text-sm text-slate-300 border-l-2 border-emerald-500/30 pl-3 mb-2">
          <div class="font-medium">Turno #${e} (atual)</div>
          <div class="text-xs text-slate-400">PIB: ${m(t.PIB)} · Estab: ${s}/100 · Pop: ${Number(t.Populacao||0).toLocaleString("pt-BR")}</div>
        </div>`);const r=t.TurnoUltimaAtualizacao<e;d.playerNotifications&&(r?d.playerNotifications.classList.remove("hidden"):d.playerNotifications.classList.add("hidden")),d.playerPanel.style.display="block"}else d.playerCountryName&&(d.playerCountryName.textContent="Carregando..."),d.playerHistorico&&(d.playerHistorico.innerHTML='<div class="text-sm text-slate-400 italic">Nenhum histórico disponível</div>'),d.playerPanel&&(d.playerPanel.style.display="none")}class Oe{constructor(){this.isMobile=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent),this.isTablet=/iPad|Android.*Tablet/i.test(navigator.userAgent),this.hasTouch="ontouchstart"in window,this.viewportWidth=window.innerWidth,this.searchResults=[],this.currentSearchTerm="",this.searchIndex=null,(this.isMobile||this.hasTouch)&&this.init()}init(){v.info("🔧 Inicializando otimizações mobile"),this.setupMobileViewport(),this.addMobileClasses(),this.createSearchBar(),this.setupTouchGestures(),this.createMobileMenu(),this.setupMobilePanels(),this.createQuickActions(),this.optimizeForMobile(),v.info("✅ Otimizações mobile ativadas")}setupMobileViewport(){let e=document.querySelector('meta[name="viewport"]');e||(e=document.createElement("meta"),e.name="viewport",e.content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes",document.head.appendChild(e));const a=document.createElement("style");a.textContent=`
            .no-zoom { touch-action: manipulation; }
            button, .country-card-button { touch-action: manipulation; }
        `,document.head.appendChild(a)}addMobileClasses(){document.body.classList.add(this.isMobile?"is-mobile":"is-desktop",this.isTablet?"is-tablet":"is-phone",this.hasTouch?"has-touch":"no-touch")}setupTouchGestures(){let e=0,a=0,o=!1;document.addEventListener("touchstart",i=>{window.scrollY===0&&(e=i.touches[0].clientY,o=!1)},{passive:!0}),document.addEventListener("touchmove",i=>{window.scrollY===0&&e>0&&(a=i.touches[0].clientY,a-e>60&&!o&&(o=!0,this.showPullToRefresh(),navigator.vibrate&&navigator.vibrate(30)))},{passive:!0}),document.addEventListener("touchend",()=>{o&&this.triggerRefresh(),this.hidePullToRefresh(),e=0,o=!1},{passive:!0}),this.setupSwipeGestures(),this.setupLongPress()}setupSwipeGestures(){let e=0,a=0,o=null;document.addEventListener("touchstart",i=>{const s=i.target.closest(".country-card-button");s&&(e=i.touches[0].clientX,a=i.touches[0].clientY,o=s)},{passive:!0}),document.addEventListener("touchmove",i=>{if(!o)return;const s=e-i.touches[0].clientX,n=a-i.touches[0].clientY;Math.abs(s)>Math.abs(n)&&Math.abs(s)>50&&(i.preventDefault(),this.showCardSwipeActions(o,s>0?"left":"right"))}),document.addEventListener("touchend",()=>{o&&(this.hideCardSwipeActions(o),o=null)},{passive:!0})}setupLongPress(){let e;document.addEventListener("touchstart",a=>{const o=a.target.closest(".country-card-button");o&&(e=setTimeout(()=>{this.showCardContextMenu(o,a.touches[0].clientX,a.touches[0].clientY),navigator.vibrate&&navigator.vibrate(50)},500))},{passive:!0}),document.addEventListener("touchend",()=>clearTimeout(e),{passive:!0}),document.addEventListener("touchmove",()=>clearTimeout(e),{passive:!0})}showPullToRefresh(){let e=document.getElementById("pull-refresh-indicator");e||(e=document.createElement("div"),e.id="pull-refresh-indicator",e.className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-brand-500 text-slate-950 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all",e.innerHTML='<div class="animate-spin h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full"></div><span class="text-sm font-medium">Puxe para atualizar</span>',document.body.appendChild(e)),e.style.transform="translate(-50%, 0)"}hidePullToRefresh(){const e=document.getElementById("pull-refresh-indicator");e&&(e.style.transform="translate(-50%, -100%)",setTimeout(()=>e.remove(),300))}triggerRefresh(){window.loadSiteData&&window.loadSiteData();const e=document.getElementById("pull-refresh-indicator");e&&(e.innerHTML='<svg class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg><span class="text-sm font-medium">Atualizado!</span>',e.className=e.className.replace("bg-brand-500","bg-emerald-500")),Ne.announce("Lista de países atualizada"),v.info("📱 Pull-to-refresh executado")}showCardSwipeActions(e,a){if(!e.querySelector(".swipe-indicator")){const o=document.createElement("div");o.className="swipe-indicator absolute inset-y-0 right-2 flex items-center text-brand-400 opacity-50",o.innerHTML=a==="left"?"👁️ Ver detalhes":"⭐ Favoritar",e.style.position="relative",e.appendChild(o)}}hideCardSwipeActions(e){const a=e.querySelector(".swipe-indicator");a&&a.remove()}showCardContextMenu(e,a,o){const i=e.querySelector(".text-sm.font-semibold")?.textContent,s=e.dataset.countryId,n=document.createElement("div");n.className="fixed z-50 bg-bg-soft border border-bg-ring/70 rounded-xl shadow-xl p-2 min-w-48",n.style.left=`${Math.min(a,window.innerWidth-200)}px`,n.style.top=`${Math.min(o,window.innerHeight-150)}px`,n.innerHTML=`
            <div class="text-sm font-medium text-slate-200 px-3 py-2 border-b border-bg-ring/50">${Ie.sanitizeInput(i||"País")}</div>
            <button class="context-menu-item" data-action="view">...</button>
            ...
        `,n.querySelectorAll(".context-menu-item").forEach(l=>l.addEventListener("click",()=>{this.handleContextAction(l.dataset.action,s,i),n.remove()}));const r=l=>{n.contains(l.target)||(n.remove(),document.removeEventListener("touchstart",r))};document.addEventListener("touchstart",r),document.body.appendChild(n)}handleContextAction(e,a,o){}createMobileMenu(){}showMobileMenu(){}addMobileMenuStyles(){}setupMobilePanels(){}convertToSlideUp(e,a){}showSlideUpPanel(e,a){}setupSwipeToClose(e,a){}createQuickActions(){}openQuickActions(e){}closeQuickActions(e){}optimizeForMobile(){}addShowMoreButton(e,a){}debounceScrollEvents(){}toggleFavorite(e,a){}shareCountry(e,a){}addToCompare(e,a){}showFavorites(){}updateFavoriteIndicators(){}createSearchBar(){}setupSearchFunctionality(){}performSearch(e){}createSearchIndex(e){}fuzzySearch(e,a){}fuzzyMatch(e,a){}getRegion(e){}}document.addEventListener("DOMContentLoaded",()=>{const t=new Oe;window.__MOBILE_OPTIMIZATIONS__=t});const R=document.getElementById("auth-button"),P=document.getElementById("main-login-btn"),je=document.getElementById("hero-blurb"),z=document.getElementById("hero-facebook-btn");function ne(){return je||(document.querySelector("h1.text-4xl")?document.querySelector("h1.text-4xl").parentElement:null)}const E=document.getElementById("turn-post-button"),X=document.getElementById("filtro-visibilidade"),fe=document.getElementById("refresh-paises"),be=document.getElementById("search-country-input"),re=document.getElementById("turno-editor");document.getElementById("last-sync");const q=document.getElementById("lista-paises-publicos"),p=document.getElementById("country-panel-modal"),ve=document.getElementById("close-country-panel"),w=document.getElementById("auth-modal"),B=document.getElementById("login-tab"),M=document.getElementById("register-tab"),k=document.getElementById("login-form"),T=document.getElementById("register-form"),xe=document.getElementById("google-login-btn"),ye=document.getElementById("close-auth-modal"),U=document.getElementById("auth-error-message"),H=document.getElementById("auth-success-message");let c={allCountries:[],gameConfig:{},isDataLoaded:!1},S="login";function V(t="login"){S=t,_(),w.classList.remove("hidden"),f()}function h(){w.classList.add("hidden"),f(),Ke()}function _(){const t=S==="login";t?(B.classList.add("bg-brand-500","text-slate-950"),B.classList.remove("text-slate-300","hover:text-slate-100"),M.classList.remove("bg-brand-500","text-slate-950"),M.classList.add("text-slate-300","hover:text-slate-100")):(M.classList.add("bg-brand-500","text-slate-950"),M.classList.remove("text-slate-300","hover:text-slate-100"),B.classList.remove("bg-brand-500","text-slate-950"),B.classList.add("text-slate-300","hover:text-slate-100")),t?(k.classList.remove("hidden"),T.classList.add("hidden"),document.getElementById("auth-modal-title").textContent="Entrar no Portal",document.getElementById("auth-modal-subtitle").textContent="Acesse sua conta"):(k.classList.add("hidden"),T.classList.remove("hidden"),document.getElementById("auth-modal-title").textContent="Criar Conta",document.getElementById("auth-modal-subtitle").textContent="Registre-se para começar")}function f(){U.classList.add("hidden"),H.classList.add("hidden")}function u(t){U.textContent=t,U.classList.remove("hidden"),H.classList.add("hidden")}function Ee(t){H.textContent=t,H.classList.remove("hidden"),U.classList.add("hidden")}function Ke(){k.reset(),T.reset()}async function O(){console.log("Carregando dados do site...");try{if(document.querySelectorAll(".loading-shimmer").forEach(t=>t.style.display="inline"),c.allCountries=await Ae(),c.gameConfig=await ke(),console.log("Países carregados:",c.allCountries.length),console.log("Config do jogo:",c.gameConfig),c.allCountries.length>0){Y(c.allCountries),I();const t=document.getElementById("turno-atual");t&&c.gameConfig&&c.gameConfig.turnoAtual&&(t.textContent=`#${c.gameConfig.turnoAtual}`),document.querySelectorAll(".loading-shimmer").forEach(e=>e.style.display="none"),c.isDataLoaded=!0,Qe()}else console.warn("Nenhum país encontrado no Firestore"),g("warning","Nenhum país encontrado. Verifique a configuração do Firestore.")}catch(t){console.error("Erro ao carregar dados:",t),g("error","Erro ao carregar dados do servidor.")}We(),x.currentUser&&E&&c.gameConfig&&c.gameConfig.turnoAtual&&(E.textContent=`Ver turno #${c.gameConfig.turnoAtual} (Facebook)`)}function I(){const t=X.value,e=be.value.toLowerCase();let a=[];t==="todos"?a=c.allCountries:t==="publicos"?a=c.allCountries.filter(o=>o.Visibilidade&&o.Visibilidade.toLowerCase()==="público"):t==="privados"?a=c.allCountries.filter(o=>o.Visibilidade&&o.Visibilidade.toLowerCase()==="privado"):t==="com-jogadores"?a=c.allCountries.filter(o=>o.Player):t==="sem-jogadores"&&(a=c.allCountries.filter(o=>!o.Player)),e&&(a=a.filter(o=>o.Pais&&o.Pais.toLowerCase().includes(e))),console.log(`Renderizando ${a.length} países (filtro: ${t}, busca: ${e})`),Ge(a),Ye()}R.addEventListener("click",()=>{console.log("Botão auth clicado"),x.currentUser?(console.log("Fazendo logout"),x.signOut()):(console.log("Abrindo modal de login"),V("login"))});P.addEventListener("click",()=>{console.log("Botão main login clicado"),V("login")});B.addEventListener("click",()=>{S="login",_(),f()});M.addEventListener("click",()=>{S="register",_(),f()});ye.addEventListener("click",h);ve.addEventListener("click",()=>{p.classList.add("hidden")});xe.addEventListener("click",async()=>{console.log("Tentando login com Google"),f();try{const t=await le();console.log("Resultado do login Google:",t),t.success?(h(),g("success",`Bem-vindo, ${t.user.displayName}!`)):(console.error("Erro no login Google:",t.error),u(t.error?t.error.message:"Erro no login com Google."))}catch(t){console.error("Erro inesperado no login Google:",t),u("Erro inesperado no login com Google.")}});k.addEventListener("submit",async t=>{t.preventDefault(),console.log("Submetendo form de login"),f();const e=document.getElementById("login-email").value,a=document.getElementById("login-password").value;console.log("Tentando login com email:",e);try{const o=await de(e,a);console.log("Resultado do login:",o),o.success?(h(),g("success","Login realizado com sucesso!")):(console.error("Erro no login:",o.error),u(o.error?o.error.message:"Erro no login."))}catch(o){console.error("Erro inesperado no login:",o),u("Erro inesperado no login.")}});T.addEventListener("submit",async t=>{t.preventDefault(),console.log("Submetendo form de registro"),f();const e=document.getElementById("register-name").value,a=document.getElementById("register-email").value,o=document.getElementById("register-password").value,i=document.getElementById("register-confirm-password").value;if(o!==i){u("As senhas não coincidem.");return}if(o.length<6){u("A senha deve ter pelo menos 6 caracteres.");return}console.log("Tentando registro com email:",a);try{const s=await ce(a,o,e);console.log("Resultado do registro:",s),s.success?(Ee("Conta criada com sucesso! Redirecionando..."),setTimeout(()=>{h(),g("success",`Bem-vindo ao WAR, ${e}!`)},1500)):(console.error("Erro no registro:",s.error),u(s.error?s.error.message:"Erro no registro."))}catch(s){console.error("Erro inesperado no registro:",s),u("Erro inesperado no registro.")}});w.addEventListener("click",t=>{t.target===w&&h()});p.addEventListener("click",t=>{t.target===p&&p.classList.add("hidden")});q&&q.addEventListener("click",t=>{const e=t.target.closest(".country-card-button");if(!e)return;t.preventDefault();const a=e.dataset.countryId,o=c.allCountries.find(i=>i.id===a);o&&he(o)});document.addEventListener("keydown",t=>{t.key==="Escape"&&(w.classList.contains("hidden")||h(),p.classList.contains("hidden")||p.classList.add("hidden"))});X.addEventListener("change",I);be.addEventListener("input",I);fe.addEventListener("click",O);function Ye(){const t=document.querySelectorAll(".country-card-button");t.forEach(e=>{e.addEventListener("click",a=>{a.preventDefault();const o=e.dataset.countryId,i=c.allCountries.find(s=>s.id===o);i&&(console.log("País clicado:",i.Pais),g("info",`Você clicou em ${i.Pais}`))})}),console.log(`Event listeners adicionados para ${t.length} países`)}function We(){const t=new Date,e=document.getElementById("last-sync");e&&(e.textContent=t.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}))}async function Ze(t){if(console.log("Mudança de estado de autenticação:",t?"Logado":"Deslogado"),t){R.querySelector(".btn-text").textContent="Sair";const e=ne();e&&e.classList.add("hidden"),E&&E.classList.remove("hidden"),P&&P.classList.add("hidden"),z&&z.classList.add("hidden"),console.log("Usuário logado:",t.displayName||t.email);try{const a=await ue(t.uid);console.log("Permissões do usuário:",a),se(a.isNarrator,a.isAdmin);const o=await Te(t.uid);if(console.log("País do jogador:",o),o){const i=c.allCountries.find(s=>s.id===o);i&&(localStorage.setItem("loggedCountry",i.id),console.log("País salvo no localStorage (main):",i.id),W(i,c.gameConfig.turnoAtual))}else{const i=c.allCountries.filter(s=>!s.Player);if(i.length>0){const s=Ve(i);Je(s,t.uid)}else g("warning","Não há países disponíveis para seleção no momento.")}}catch(a){console.error("Erro ao processar login do usuário:",a),g("error","Erro ao carregar dados do usuário.")}}else{R.querySelector(".btn-text").textContent="Entrar",se(!1,!1),W(null),we();const e=ne();e&&e.classList.remove("hidden"),E&&E.classList.add("hidden"),P&&P.classList.remove("hidden"),z&&z.classList.remove("hidden")}}function Je(t,e){let a=null;const o=t.querySelectorAll(".pais-option"),i=t.querySelector("#confirmar-selecao"),s=t.querySelector("#cancelar-selecao"),n=t.querySelector("#busca-pais"),r=t.querySelector("#paises-visiveis");o.forEach(l=>{l.addEventListener("click",()=>{o.forEach(b=>b.classList.remove("border-brand-500","bg-brand-500/10")),l.classList.add("border-brand-500","bg-brand-500/10"),a={id:l.dataset.paisId,name:l.dataset.paisNome},i.disabled=!1})}),n&&r&&n.addEventListener("input",l=>{const b=l.target.value.toLowerCase();let y=0;o.forEach(C=>{const L=C.dataset.paisNome.toLowerCase().includes(b);C.style.display=L?"block":"none",L&&y++}),r.textContent=y}),i&&i.addEventListener("click",async()=>{if(a){i.textContent="Vinculando...",i.disabled=!0;try{await _e(e,a.id),t.remove(),g("success",`Você agora governa ${a.name}!`),O()}catch(l){g("error","Erro ao vincular país. Tente novamente."),console.error("Erro ao vincular país:",l)}finally{i.textContent="Confirmar Seleção",i.disabled=!1}}}),s&&s.addEventListener("click",()=>{t.remove()})}R.addEventListener("click",()=>{console.log("Botão auth clicado"),x.currentUser?(console.log("Fazendo logout"),x.signOut()):(console.log("Abrindo modal de login"),V("login"))});P.addEventListener("click",()=>{console.log("Botão main login clicado"),V("login")});B.addEventListener("click",()=>{S="login",_(),f()});M.addEventListener("click",()=>{S="register",_(),f()});ye.addEventListener("click",h);ve.addEventListener("click",()=>{p.classList.add("hidden")});xe.addEventListener("click",async()=>{console.log("Tentando login com Google"),f();try{const t=await le();console.log("Resultado do login Google:",t),t.success?(h(),g("success",`Bem-vindo, ${t.user.displayName}!`)):(console.error("Erro no login Google:",t.error),u(t.error?t.error.message:"Erro no login com Google."))}catch(t){console.error("Erro inesperado no login Google:",t),u("Erro inesperado no login com Google.")}});k.addEventListener("submit",async t=>{t.preventDefault(),console.log("Submetendo form de login"),f();const e=document.getElementById("login-email").value,a=document.getElementById("login-password").value;console.log("Tentando login com email:",e);try{const o=await de(e,a);console.log("Resultado do login:",o),o.success?(h(),g("success","Login realizado com sucesso!")):(console.error("Erro no login:",o.error),u(o.error?o.error.message:"Erro no login."))}catch(o){console.error("Erro inesperado no login:",o),u("Erro inesperado no login.")}});T.addEventListener("submit",async t=>{t.preventDefault(),console.log("Submetendo form de registro"),f();const e=document.getElementById("register-name").value,a=document.getElementById("register-email").value,o=document.getElementById("register-password").value,i=document.getElementById("register-confirm-password").value;if(o!==i){u("As senhas não coincidem.");return}if(o.length<6){u("A senha deve ter pelo menos 6 caracteres.");return}console.log("Tentando registro com email:",a);try{const s=await ce(a,o,e);console.log("Resultado do registro:",s),s.success?(Ee("Conta criada com sucesso! Redirecionando..."),setTimeout(()=>{h(),g("success",`Bem-vindo ao WAR, ${e}!`)},1500)):(console.error("Erro no registro:",s.error),u(s.error?s.error.message:"Erro no registro."))}catch(s){console.error("Erro inesperado no registro:",s),u("Erro inesperado no registro.")}});w.addEventListener("click",t=>{t.target===w&&h()});p.addEventListener("click",t=>{t.target===p&&p.classList.add("hidden")});q&&q.addEventListener("click",t=>{const e=t.target.closest(".country-card-button");if(!e)return;t.preventDefault();const a=e.dataset.countryId,o=c.allCountries.find(i=>i.id===a);o&&he(o)});document.addEventListener("keydown",t=>{t.key==="Escape"&&(w.classList.contains("hidden")||h(),p.classList.contains("hidden")||p.classList.add("hidden"))});X.addEventListener("change",I);fe.addEventListener("click",O);re&&re.addEventListener("change",async t=>{const e=t.target.value;if(x.currentUser&&(await ue(x.currentUser.uid)).isNarrator)if(await Se(e)){g("success",`Turno atualizado para #${e}`),c.gameConfig.turnoAtual=e;const i=c.allCountries.find(s=>s.Player===x.currentUser.uid);i&&localStorage.setItem("loggedCountry",i.id),W(i,e)}else g("error","Erro ao salvar turno.")});x.onAuthStateChanged(Ze);let D=new Map;function Qe(){console.log("Configurando sincronização em tempo real...");const t=oe.collection("paises").onSnapshot(a=>{console.log("Mudanças detectadas na coleção de países"),a.docChanges().forEach(o=>{const i={id:o.doc.id,...o.doc.data()},s=c.allCountries.findIndex(n=>n.id===o.doc.id);o.type==="added"&&s===-1?(c.allCountries.push(i),console.log(`País adicionado: ${i.Pais}`)):o.type==="modified"&&s!==-1?(c.allCountries[s]=i,console.log(`País atualizado: ${i.Pais}`)):o.type==="removed"&&s!==-1&&(c.allCountries.splice(s,1),console.log(`País removido: ${i.Pais}`))}),c.isDataLoaded&&(Y(c.allCountries),I(),console.log("Interface atualizada automaticamente"))},a=>{console.error("Erro no listener de países:",a)});D.set("countries",t),window.addEventListener("realtime:update",a=>{console.log("Evento realtime:update recebido:",a.detail);const{countryId:o,section:i,field:s,newValue:n}=a.detail,r=c.allCountries.findIndex(l=>l.id===o);if(r!==-1){const l=c.allCountries[r];l[i]||(l[i]={}),l[i][s]=n,i==="geral"&&(l[s]=n),console.log(`Campo ${s} do país ${l.Pais} atualizado via broadcast:`,n),Y(c.allCountries),I()}});const e=oe.collection("configuracoes").doc("jogo").onSnapshot(a=>{if(a.exists){const o=a.data();if(c.gameConfig.turnoAtual!==o.turnoAtual){console.log(`Turno atualizado: ${c.gameConfig.turnoAtual} → ${o.turnoAtual}`),c.gameConfig=o;const i=document.getElementById("turno-atual");i&&(i.textContent=`#${o.turnoAtual}`),E&&(E.textContent=`Ver turno #${o.turnoAtual} (Facebook)`)}}},a=>{console.error("Erro no listener de configuração:",a)});D.set("config",e),console.log("Sincronização em tempo real ativada ✅")}function we(){console.log("Removendo listeners de tempo real..."),D.forEach(t=>t()),D.clear()}window.addEventListener("beforeunload",()=>{we()});document.addEventListener("DOMContentLoaded",()=>{console.log("DOM carregado, iniciando aplicação"),O()});
