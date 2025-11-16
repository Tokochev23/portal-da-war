const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/navalProduction-BqKRwiuq.js","assets/preload-helper-f85Crcwt.js","assets/firebase-DaxaZSOr.js","assets/utils-DLoRv3re.js","assets/shipyardSystem-DYaoVOt1.js"])))=>i.map(i=>d[i]);
import{_ as A}from"./preload-helper-f85Crcwt.js";import"./templateLoader-ClBXDqzG.js";import"./firebase-DaxaZSOr.js";import{hulls as $}from"./hulls-CFhq2zY8.js";import{auxiliary_systems as O,boilers as M,propulsion_systems as E}from"./propulsion-Ds8gNL2e.js";import{ammunition_types as P,fire_control_systems as T,gun_mounts as L,naval_guns as V}from"./naval_guns-RPDYGynX.js";import{missile_magazines as j,guidance_systems as k,missile_launchers as q,naval_missiles as D}from"./naval_missiles-1gme3iwB.js";import{searchlights as H,countermeasures as R,depth_charges as I,torpedo_tubes as B,aa_guns as z}from"./secondary_weapons-B2--kRuu.js";import{data_processing as W,navigation_systems as G,electronic_warfare as U,communication_systems as F,sonar_systems as K,radar_systems as J}from"./electronics-CC3zpcSk.js";import{armor_schemes as Q,armor_zones as Y,armor_materials as Z}from"./armor-DmFYxSll.js";import"./utils-DLoRv3re.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";class X{static getHullMultipliers(){return{corvette:{electronics:.4,armor:.6,weapons:.7,cost:.5,weight:.3},destroyer:{electronics:.7,armor:.8,weapons:.8,cost:.8,weight:.6},frigate:{electronics:.6,armor:.7,weapons:.75,cost:.7,weight:.5},escort:{electronics:.5,armor:.6,weapons:.7,cost:.6,weight:.4},cruiser:{electronics:1,armor:1,weapons:1,cost:1,weight:1},battleship:{electronics:1.8,armor:2.2,weapons:2.5,cost:2,weight:2.8},carrier:{electronics:1.5,armor:1.2,weapons:.9,cost:1.3,weight:1.1},submarine:{electronics:.8,armor:.3,weapons:.6,cost:.9,weight:.4}}}static getHullRole(e){return e&&e.role||"cruiser"}static applyHullScaling(e,t,a){const s=this.getHullMultipliers(),i=this.getHullRole(a),l=(s[i]||s.cruiser)[t]||1;return Math.round(e*l)}static getSelectedHull(e){const t=e?.hull;return t&&window.NAVAL_COMPONENTS?.hulls?.[t]?window.NAVAL_COMPONENTS.hulls[t]:null}static getSelectedPropulsion(e){const t=e?.propulsion;return t&&window.NAVAL_COMPONENTS?.propulsion_systems?.[t]?window.NAVAL_COMPONENTS.propulsion_systems[t]:null}static getSelectedMainGuns(e){const t=Array.isArray(e?.main_guns)?e.main_guns:[],a=window.NAVAL_COMPONENTS?.naval_guns||{};return t.map(s=>{const i=a[s.type];return i?{...i,mount:s.mount,quantity:s.quantity||1}:null}).filter(Boolean)}static calculateCosts(e){const t=this.getSelectedHull(e),a=this.getSelectedPropulsion(e);if(!t)return this.getDefaultCosts();try{const s=this.calculateCostBreakdown(e,t,a);let i=Object.values(s).reduce((c,d)=>c+d,0);const n=this.calculateMaintenanceCost(e,t,a),l=this.calculateOperationalCost(e,t,a);if(window.currentUserCountry?.currentModifiers){const c=window.currentUserCountry.currentModifiers;if(typeof c.militaryProductionCost=="number"){const d=1+c.militaryProductionCost;i*=d,console.log(`🏛️ Lei Nacional: Custo de produção ${c.militaryProductionCost>0?"+":""}${(c.militaryProductionCost*100).toFixed(0)}%`)}}const o=i+n*10+l*10;return{production:i,maintenance:n,operational:l,total_ownership:o,breakdown:s,efficiency_metrics:this.calculateCostEfficiency(e,i)}}catch(s){return console.error("🚨 Error in naval cost calculation:",s),this.getDefaultCosts()}}static calculateCostBreakdown(e,t,a){let s=t.cost_base||0;t.tech_level>60?s*=1.3:t.tech_level>50&&(s*=1.15),t.role==="battleship"?s*=1.2:t.role==="carrier"?s*=1.4:t.role==="submarine"&&(s*=1.1);let i=0;a&&(i=a.cost||0,a.type==="nuclear"&&(i*=1.8),a.type==="combined"&&(i*=1.3));const n=this.getSelectedMainGuns(e);let l=0;n.forEach(u=>{let p=u.cost||0;p=this.applyHullScaling(p,"weapons",t);const w={single_mount:1,twin_mount:1.8,triple_mount:2.4,quad_mount:2.8}[u.mount]||1;p*=w,u.caliber>=203?p*=1.4:u.caliber>=127&&(p*=1.2),l+=p*u.quantity});let o=0;e.secondary_weapons&&Array.isArray(e.secondary_weapons)&&(o=e.secondary_weapons.length*28e4,t.aa_slots>20&&(o*=1.5));let c=0;e.missiles&&Array.isArray(e.missiles)&&e.missiles.forEach(u=>{if(u.type&&window.NAVAL_COMPONENTS?.naval_missiles[u.type]){const p=window.NAVAL_COMPONENTS.naval_missiles[u.type];let m=p.cost_per_launcher||0;const w=p.missiles_per_launcher||0,b=p.cost_per_missile||0;m+=w*b,p.tech_level>=65?m*=1.8:p.tech_level>=55&&(m*=1.4),c+=m*(u.quantity||1)}});let d=0;e.aa_guns&&Array.isArray(e.aa_guns)&&e.aa_guns.forEach(u=>{if(u.type&&window.NAVAL_COMPONENTS?.aa_guns[u.type]){const p=window.NAVAL_COMPONENTS.aa_guns[u.type];let m=p.cost||0;m=this.applyHullScaling(m,"weapons",t),p.type==="automatic_aa"&&(m*=1.5),d+=m*(u.quantity||1)}}),e.torpedo_tubes&&Array.isArray(e.torpedo_tubes)&&e.torpedo_tubes.forEach(u=>{if(u.type&&window.NAVAL_COMPONENTS?.torpedo_tubes[u.type]){const p=window.NAVAL_COMPONENTS.torpedo_tubes[u.type];let m=p.cost||0;p.type==="acoustic_torpedo"&&(m*=2),d+=m*(u.quantity||1)}}),e.depth_charges&&Array.isArray(e.depth_charges)&&e.depth_charges.forEach(u=>{if(u.type&&window.NAVAL_COMPONENTS?.depth_charges[u.type]){const p=window.NAVAL_COMPONENTS.depth_charges[u.type];let m=p.cost||0;p.sonar_integrated&&(m*=1.4),d+=m*(u.quantity||1)}}),e.countermeasures&&Array.isArray(e.countermeasures)&&e.countermeasures.forEach(u=>{if(u.type&&window.NAVAL_COMPONENTS?.countermeasures[u.type]){const p=window.NAVAL_COMPONENTS.countermeasures[u.type];d+=(p.cost||0)*(u.quantity||1)}}),e.searchlights&&Array.isArray(e.searchlights)&&e.searchlights.forEach(u=>{if(u.type&&window.NAVAL_COMPONENTS?.searchlights[u.type]){const p=window.NAVAL_COMPONENTS.searchlights[u.type];d+=(p.cost||0)*(u.quantity||1)}});let h=0;e.electronics&&Array.isArray(e.electronics)&&e.electronics.forEach(u=>{if(u.category&&u.type&&window.NAVAL_COMPONENTS?.[u.category]?.[u.type]){const p=window.NAVAL_COMPONENTS[u.category][u.type];let m=p.cost||0;m=this.applyHullScaling(m,"electronics",t),p.tech_level>=65?m*=1.8:p.tech_level>=55&&(m*=1.4),u.category==="electronic_warfare"?m*=1.5:u.category==="data_processing"&&(m*=1.3),h+=m*(u.quantity||1)}});let v=0;if(e.armor&&window.NAVAL_COMPONENTS?.armor_zones){const u=t.role||"destroyer";Object.entries(e.armor.custom_zones||{}).forEach(([p,m])=>{const w=window.NAVAL_COMPONENTS.armor_zones[p],b=window.NAVAL_COMPONENTS.armor_materials[m];if(w&&b){const C=w.area_sqm_base[u]||w.area_sqm_base.destroyer;let f=b.cost_per_sqm*C;f=this.applyHullScaling(f,"armor",t),b.tech_level>=60?f*=2:b.tech_level>=45&&(f*=1.5),w.importance==="critical"&&(f*=1.2),v+=f}})}else t.role==="battleship"?v=s*.35:t.role==="cruiser"?v=s*.25:t.role==="carrier"?v=s*.15:t.role==="destroyer"&&(v=s*.08);const N=(s+i+l+o+c+d+h+v)*.18;return{hull:Math.round(s),propulsion:Math.round(i),armament:Math.round(l),secondary:Math.round(o),missiles:Math.round(c),secondary_systems:Math.round(d),electronics:Math.round(h),armor:Math.round(v),integration:Math.round(N)}}static calculateMaintenanceCost(e,t,a){let s=0;const n={destroyer:.04,frigate:.035,cruiser:.05,battleship:.06,carrier:.08,submarine:.07}[t.role]||.045;if(s+=(t.cost_base||0)*n,a){let o=(a.cost||0)*.08;const c=2-(a.reliability||.9);o*=c,a.type==="nuclear"&&(o*=2.5),s+=o}const l=t.crew||100;return s+=l*800,t.tech_level>60?s*=1.3:t.tech_level<40&&(s*=1.1),Math.round(s)}static calculateOperationalCost(e,t,a){let s=0;if(a&&a.type!=="nuclear"){const S=2e3*(a.fuel_consumption||200)*.25;s+=S}else a&&a.type==="nuclear"&&(s+=15e4);const i=t.crew||100;s+=i*3600*1.8;const o=this.getSelectedMainGuns(e);let c=0;return o.forEach(d=>{const h=d.caliber>=356?50:d.caliber>=203?150:300,v=d.caliber>=356?2500:d.caliber>=203?800:450;c+=h*v*d.quantity}),s+=c,s+=(t.displacement||1e3)*15,Math.round(s)}static calculateCostEfficiency(e,t){let a={};try{a=window.navalPerformanceCalculator.calculateShipPerformance(e)}catch(n){console.error("Naval cost system failed to get performance data:",n),a={error:!0}}if(!a||a.error)return{cost_per_ton:0,bang_for_buck:0};const s=a.totalDisplacement||1,i=(a.maxSpeed||0)*2+(a.mainArmament||0)*10+(a.aaRating||0)*.5+(a.range||0)/100+(a.seaworthiness||0)*.8;return{cost_per_ton:Math.round(t/s),bang_for_buck:s>0?Math.round(i*1e3/(t/1e6)):0}}static getDefaultCosts(){return{production:0,maintenance:0,operational:0,total_ownership:0,breakdown:{},efficiency_metrics:{cost_per_ton:0,bang_for_buck:0}}}static renderCostDisplay(e){const t=this.calculateCosts(e||window.currentShip||{}),a=Number(e?.quantity||window.currentShip?.quantity||1)||1,s=o=>isNaN(o)?"0":(o/1e6).toFixed(1),i=o=>isNaN(o)?"0":(o/1e3).toFixed(0);let n='<h3 class="text-xl font-semibold text-slate-100 mb-4">💰 Análise de Custos Naval</h3>';return n+=`
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="p-4 rounded-lg bg-blue-900/20 border border-blue-500/30">
                    <div class="text-blue-300 text-sm font-medium">Custo de Produção</div>
                    <div class="text-blue-100 text-2xl font-bold">$${s(t.production)}M</div>
                </div>
                <div class="p-4 rounded-lg bg-cyan-900/20 border border-cyan-500/30">
                    <div class="text-cyan-300 text-sm font-medium">Manutenção Anual</div>
                    <div class="text-cyan-100 text-2xl font-bold">$${i(t.maintenance)}K</div>
                </div>
                <div class="p-4 rounded-lg bg-teal-900/20 border border-teal-500/30">
                    <div class="text-teal-300 text-sm font-medium">Custo Operacional Anual</div>
                    <div class="text-teal-100 text-2xl font-bold">$${i(t.operational)}K</div>
                </div>
            </div>
        `,n+=`
            <div class="p-4 rounded-lg bg-naval-900/20 border border-naval-500/30 mb-6">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-naval-300 font-medium">Custo Total de Propriedade (10 anos)</span>
                    <span class="text-naval-100 font-bold text-lg">$${s(t.total_ownership)}M</span>
                </div>
                <div class="text-xs text-naval-300/70">
                    Construção ($${s(t.production)}M) + Manutenção ($${s(t.maintenance*10)}M) + Operação ($${s(t.operational*10)}M)
                </div>
            </div>
        `,a>1&&(n+=`
                <div class="p-4 rounded-lg bg-indigo-900/20 border border-indigo-500/30 mb-4">
                    <div class="flex items-center justify-between">
                        <span class="text-indigo-300 font-medium">Custo Total da Frota (${a} navios)</span>
                        <span class="text-indigo-100 font-bold text-lg">$${(t.production*a/1e6).toFixed(1)}M</span>
                    </div>
                </div>
            `),n+='<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">',n+='<div><h4 class="text-slate-200 font-medium mb-3">📊 Breakdown de Produção</h4><div class="space-y-2">',Object.entries(t.breakdown).sort((o,c)=>c[1]-o[1]).forEach(([o,c])=>{if(c>0){const d=t.production>0?(c/t.production*100).toFixed(1):"0.0";n+=`
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-slate-300">${this.formatComponentName(o)}</span>
                            <span class="font-medium text-slate-100">$${s(c)}M (${d}%)</span>
                        </div>
                        <div class="h-2 bg-slate-700 rounded-full"><div class="h-2 bg-naval-500 rounded-full" style="width: ${d}%"></div></div>
                    </div>
                `}}),n+="</div></div>",n+='<div><h4 class="text-slate-200 font-medium mb-3">📈 Métricas de Eficiência</h4><div class="space-y-3">',n+=`<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Custo por Tonelada</span><span class="text-slate-100 font-semibold">$${(t.efficiency_metrics.cost_per_ton||0).toLocaleString()}</span></div>`,n+=`<div class="flex justify-between items-center p-3 rounded-lg bg-slate-800/40"><span class="text-slate-400">Eficiência Naval</span><span class="text-slate-100 font-semibold">${(t.efficiency_metrics.bang_for_buck||0).toLocaleString()} pts/$M</span></div>`,n+="</div></div>",n+="</div>",n}static formatComponentName(e){return{hull:"Casco",propulsion:"Propulsão",armament:"Artilharia Principal",secondary:"Armamento Secundário",electronics:"Eletrônicos",armor:"Blindagem",integration:"Integração e Testes"}[e]||e}}window.NavalCostSystem=X;class _{constructor(){this.constants={water_density:1025,water_resistance_factor:.15,speed_power_factor:3,displacement_speed_factor:.85,fuel_efficiency_base:.75,crew_efficiency_factor:.92}}static getHullMultipliers(){return window.NavalCostSystem?.getHullMultipliers()||{corvette:{electronics:.4,armor:.6,weapons:.7,cost:.5,weight:.3},destroyer:{electronics:.7,armor:.8,weapons:.8,cost:.8,weight:.6},frigate:{electronics:.6,armor:.7,weapons:.75,cost:.7,weight:.5},escort:{electronics:.5,armor:.6,weapons:.7,cost:.6,weight:.4},cruiser:{electronics:1,armor:1,weapons:1,cost:1,weight:1},battleship:{electronics:1.8,armor:2.2,weapons:2.5,cost:2,weight:2.8},carrier:{electronics:1.5,armor:1.2,weapons:.9,cost:1.3,weight:1.1},submarine:{electronics:.8,armor:.3,weapons:.6,cost:.9,weight:.4}}}static applyHullScaling(e,t,a){const s=this.getHullMultipliers(),i=a?.role||"cruiser",l=(s[i]||s.cruiser)[t]||1;return e*l}calculateShipPerformance(e){try{if(!e||!e.hull)return this.getDefaultPerformance();const t=window.NAVAL_COMPONENTS?.hulls[e.hull],a=e.propulsion?window.NAVAL_COMPONENTS?.propulsion_systems[e.propulsion]:null;if(!t)return console.error("Hull not found:",e.hull),this.getDefaultPerformance();const s={totalDisplacement:this.calculateTotalDisplacement(t,e),maxSpeed:this.calculateMaxSpeed(t,a),cruiseSpeed:this.calculateCruiseSpeed(t,a),mainArmament:this.calculateMainArmamentCount(e),secondaryArmament:this.calculateSecondaryArmamentCount(e),aaRating:this.calculateAAEffectiveness(e),range:this.calculateRange(t,a),fuelCapacity:this.calculateFuelCapacity(t),endurance:this.calculateEndurance(t,a),seaworthiness:this.calculateSeaworthiness(t,e),maneuverability:this.calculateManeuverability(t,a),stability:this.calculateStability(t,e),radarSignature:this.calculateRadarSignature(t,e),sonarSignature:this.calculateSonarSignature(t,a),crewSize:this.calculateCrewRequirements(t,e),maintenanceRating:this.calculateMaintenanceRequirements(e)};return console.log("✅ Naval performance calculated:",s),s}catch(t){return console.error("❌ Error calculating naval performance:",t),this.getDefaultPerformance()}}calculateTotalDisplacement(e,t){let a=e.displacement||0;if(t.propulsion&&window.NAVAL_COMPONENTS?.propulsion_systems[t.propulsion]){const s=window.NAVAL_COMPONENTS.propulsion_systems[t.propulsion];a+=s.weight||0}return a+=this.calculateArmamentWeight(t),a+=this.calculateArmorWeight(t),a+=this.calculateElectronicsWeight(t),a+=(e.displacement||0)*.25,Math.round(a)}calculateMaxSpeed(e,t){let a=e.max_speed||0;if(!t)return a;const s=(t.power_hp||0)/(e.displacement||1),i=Math.min(1.5,Math.max(.7,s/30));return Math.round(a*i*10)/10}calculateCruiseSpeed(e,t){const a=this.calculateMaxSpeed(e,t);return Math.round(a*.65*10)/10}calculateMainArmamentCount(e){let t=0;return e.main_guns&&Array.isArray(e.main_guns)&&e.main_guns.forEach(a=>{if(a.type&&window.NAVAL_COMPONENTS?.naval_guns[a.type]){window.NAVAL_COMPONENTS.naval_guns[a.type];const s=window.NAVAL_COMPONENTS?.gun_mounts[a.mount]||window.NAVAL_COMPONENTS?.gun_mounts.single_mount;t+=(a.quantity||1)*(s.guns_per_mount||1)}}),t}calculateSecondaryArmamentCount(e){let t=0;return e.secondary_weapons&&Array.isArray(e.secondary_weapons)&&(t=e.secondary_weapons.length),t}calculateAAEffectiveness(e){let t=0;const a=window.NAVAL_COMPONENTS?.hulls[e.hull];return a?(t+=(a.aa_slots||0)*5,e.secondary_weapons&&e.secondary_weapons.forEach(s=>{s.type==="aa_gun"&&(t+=15)}),e.electronics&&e.electronics.forEach(s=>{(s.includes("radar")||s.includes("fire_control"))&&(t*=1.3)}),Math.round(t)):0}calculateRange(e,t){let a=5e3;if(!t)return a;const i=1/(t.fuel_consumption||100)*1e3,n=Math.sqrt((e.displacement||1e3)/1e3);return Math.round(a*i*n)}calculateFuelCapacity(e){const t=e.displacement||0;let a=.15;return e.role==="destroyer"||e.role==="escort"?a=.2:e.role==="cruiser"?a=.18:e.role==="battleship"?a=.12:e.role==="carrier"&&(a=.22),Math.round(t*a)}calculateEndurance(e,t){const a=this.calculateFuelCapacity(e),s=t?(t.fuel_consumption||100)*.6*24:2400;return Math.round(a/s)}calculateSeaworthiness(e,t){let a=70;const s=e.displacement||0;return a+=Math.min(25,s/1e3),e.role==="battleship"||e.role==="cruiser"?a+=10:e.role==="destroyer"&&(a-=5),Math.min(100,Math.max(0,Math.round(a)))}calculateManeuverability(e,t){let a=50;const s=e.displacement||1e3;return a+=Math.max(-20,60-s/500),t&&(t.type==="gas_turbine"?a+=15:t.type==="diesel"?a+=5:t.type==="nuclear"&&(a+=10)),Math.min(100,Math.max(0,Math.round(a)))}calculateStability(e,t){let a=75;const s=e.displacement||1e3;a+=Math.min(15,s/2e3);const n=this.calculateArmamentWeight(t)/(s*.02);return a-=Math.min(20,n),Math.min(100,Math.max(0,Math.round(a)))}calculateRadarSignature(e,t){let a=Math.sqrt(e.displacement||1e3);return t.electronics&&(a+=t.electronics.length*10),a+=this.calculateMainArmamentCount(t)*5,Math.round(a)}calculateSonarSignature(e,t){let a=50;if(t)switch(t.type){case"diesel":a+=20;break;case"steam_turbine":a+=10;break;case"gas_turbine":a+=25;break;case"nuclear":a-=10;break;case"diesel_electric":a-=20;break}const s=this.calculateMaxSpeed(e,t);return a+=Math.max(0,s-25)*2,Math.max(0,Math.round(a))}calculateCrewRequirements(e,t){let a=e.crew||100;return a+=this.calculateMainArmamentCount(t)*8,a+=this.calculateSecondaryArmamentCount(t)*4,t.electronics&&(a+=t.electronics.length*5),Math.round(a)}calculateMaintenanceRequirements(e){let t=50;const a=window.NAVAL_COMPONENTS?.hulls[e.hull],s=e.propulsion?window.NAVAL_COMPONENTS?.propulsion_systems[e.propulsion]:null;return a&&a.tech_level<40?t+=20:a&&a.tech_level>60&&(t+=10),s&&(t+=Math.round((1-(s.reliability||.9))*50)),Math.min(100,Math.max(0,Math.round(t)))}calculateArmamentWeight(e){let t=0;const a=window.NAVAL_COMPONENTS?.hulls[e.hull];return e.main_guns&&Array.isArray(e.main_guns)&&e.main_guns.forEach(s=>{if(s.type&&window.NAVAL_COMPONENTS?.naval_guns[s.type]){let n=window.NAVAL_COMPONENTS.naval_guns[s.type].weight_tons||0;n=_.applyHullScaling(n,"weight",a),t+=n*(s.quantity||1)}}),e.secondary_weapons&&(t+=e.secondary_weapons.length*2),e.missiles&&Array.isArray(e.missiles)&&e.missiles.forEach(s=>{if(s.type&&window.NAVAL_COMPONENTS?.naval_missiles[s.type]){const i=window.NAVAL_COMPONENTS.naval_missiles[s.type],n=i.launcher_weight_tons||0,l=(i.launch_weight_kg||0)*(i.missiles_per_launcher||0)/1e3;t+=(n+l)*(s.quantity||1)}}),e.aa_guns&&Array.isArray(e.aa_guns)&&e.aa_guns.forEach(s=>{if(s.type&&window.NAVAL_COMPONENTS?.aa_guns[s.type]){let n=window.NAVAL_COMPONENTS.aa_guns[s.type].weight_tons||0;n=_.applyHullScaling(n,"weight",a),t+=n*(s.quantity||1)}}),e.torpedo_tubes&&Array.isArray(e.torpedo_tubes)&&e.torpedo_tubes.forEach(s=>{if(s.type&&window.NAVAL_COMPONENTS?.torpedo_tubes[s.type]){const i=window.NAVAL_COMPONENTS.torpedo_tubes[s.type];t+=(i.weight_tons||0)*(s.quantity||1)}}),e.depth_charges&&Array.isArray(e.depth_charges)&&e.depth_charges.forEach(s=>{if(s.type&&window.NAVAL_COMPONENTS?.depth_charges[s.type]){const i=window.NAVAL_COMPONENTS.depth_charges[s.type];t+=(i.launcher_weight_tons||0)*(s.quantity||1)}}),e.countermeasures&&Array.isArray(e.countermeasures)&&e.countermeasures.forEach(s=>{if(s.type&&window.NAVAL_COMPONENTS?.countermeasures[s.type]){const i=window.NAVAL_COMPONENTS.countermeasures[s.type];t+=(i.weight_tons||0)*(s.quantity||1)}}),e.searchlights&&Array.isArray(e.searchlights)&&e.searchlights.forEach(s=>{if(s.type&&window.NAVAL_COMPONENTS?.searchlights[s.type]){const i=window.NAVAL_COMPONENTS.searchlights[s.type];t+=(i.weight_tons||0)*(s.quantity||1)}}),t}calculateArmorWeight(e){if(!e.armor||!window.NAVAL_COMPONENTS?.armor_zones)return 0;let t=0;const s=(e.hull?window.NAVAL_COMPONENTS?.hulls[e.hull]:null)?.role||"destroyer";return Object.entries(e.armor.custom_zones||{}).forEach(([i,n])=>{const l=window.NAVAL_COMPONENTS.armor_zones[i],o=window.NAVAL_COMPONENTS.armor_materials[n];if(l&&o){const c=l.area_sqm_base[s]||l.area_sqm_base.destroyer,d=o.weight_per_sqm_kg*c*l.weight_multiplier/1e3;t+=d}}),t}calculateElectronicsWeight(e){let t=0;const a=window.NAVAL_COMPONENTS?.hulls[e.hull];return e.electronics&&Array.isArray(e.electronics)&&e.electronics.forEach(s=>{if(s.category&&s.type&&window.NAVAL_COMPONENTS?.[s.category]?.[s.type]){let n=window.NAVAL_COMPONENTS[s.category][s.type].weight_tons||0;n=_.applyHullScaling(n,"weight",a),t+=n*(s.quantity||1)}}),t}getDefaultPerformance(){return{totalDisplacement:0,maxSpeed:0,cruiseSpeed:0,mainArmament:0,secondaryArmament:0,aaRating:0,range:0,fuelCapacity:0,endurance:0,seaworthiness:0,maneuverability:0,stability:0,radarSignature:0,sonarSignature:0,crewSize:0,maintenanceRating:0}}renderPerformanceDisplay(e){const t=this.calculateShipPerformance(e);let a='<div class="grid grid-cols-2 gap-4">';return a+=`
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-slate-400">Velocidade Máxima:</span>
                    <span class="text-naval-300 font-semibold">${t.maxSpeed} nós</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Vel. Cruzeiro:</span>
                    <span class="text-slate-300">${t.cruiseSpeed} nós</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Autonomia:</span>
                    <span class="text-slate-300">${t.range} mn</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Resistência:</span>
                    <span class="text-slate-300">${t.endurance} dias</span>
                </div>
            </div>
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="text-slate-400">Navegabilidade:</span>
                    <span class="text-green-300">${t.seaworthiness}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Manobrabilidade:</span>
                    <span class="text-blue-300">${t.maneuverability}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Estabilidade:</span>
                    <span class="text-cyan-300">${t.stability}%</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-slate-400">Tripulação:</span>
                    <span class="text-slate-300">${t.crewSize}</span>
                </div>
            </div>
        `,a+="</div>",a}}window.navalPerformanceCalculator=new _;window.calculateShipPerformance=function(r){return window.navalPerformanceCalculator.calculateShipPerformance(r)};window.NavalPerformanceSystem={renderPerformanceDisplay:function(r){return window.navalPerformanceCalculator.renderPerformanceDisplay(r)}};class g{static getScaledValue(e,t,a=""){if(!window.currentShip?.hull||!window.NavalCostSystem)return`${e}${a}`;const s=window.NAVAL_COMPONENTS?.hulls[window.currentShip.hull];if(!s)return`${e}${a}`;const i=window.NavalCostSystem.applyHullScaling(e,t,s),n=i-e;return n===0?`${i}${a}`:n>0?`<span class="text-red-300">${i}${a}</span> <span class="text-xs text-red-400">(+${n}${a})</span>`:`<span class="text-green-300">${i}${a}</span> <span class="text-xs text-green-400">(${n}${a})</span>`}static getScaledCostDisplay(e){return this.getScaledValue(e,"cost","")}static getScaledWeightDisplay(e){return this.getScaledValue(e,"weight","t")}static isComponentCompatible(e,t){return!e.suitable_ships||!t||e.suitable_ships.includes(t.id)||e.suitable_ships.includes(t.role)?!0:e.suitable_hulls?e.suitable_hulls.includes(t.role)||e.suitable_hulls.includes(t.id):!1}static filterComponentsByHull(e){if(!window.currentShip?.hull)return e;const t=window.NAVAL_COMPONENTS?.hulls[window.currentShip.hull];if(!t)return e;const a={};return Object.entries(e).forEach(([s,i])=>{this.isComponentCompatible(i,t)&&(a[s]=i)}),a}static loadHullTab(){const e=document.getElementById("tab-content");if(!e)return;let t=`
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🚢 Seleção de Casco</h3>
                    <p class="text-slate-400">Escolha o tipo de navio que define as características básicas da embarcação</p>
                </div>
        `;if(!window.NAVAL_COMPONENTS?.hulls){t+='<div class="text-center text-red-400">❌ Componentes navais não carregados</div>',e.innerHTML=t+"</div>";return}const a={};Object.entries(window.NAVAL_COMPONENTS.hulls).forEach(([i,n])=>{a[n.role]||(a[n.role]=[]),a[n.role].push({id:i,...n})});const s={corvette:"Corvetas",escort:"Escolta e Patrulha",cruiser:"Cruzadores",battleship:"Encouraçados",carrier:"Porta-Aviões",submarine:"Submarinos"};Object.entries(a).forEach(([i,n])=>{t+=`
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4 flex items-center space-x-2">
                        <span>${this.getRoleIcon(i)}</span>
                        <span>${s[i]||i}</span>
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,n.forEach(l=>{const o=window.currentShip?.hull===l.id;t+=`
                    <div class="${o?"hull-card selected border-naval-400 ring-1 ring-naval-400/50 bg-naval-900/20":"hull-card border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50"} border rounded-xl p-4 cursor-pointer transition-all duration-200" 
                         onclick="selectHull('${l.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${l.name}</h5>
                                <div class="text-xs text-slate-400">${l.year_introduced} • Tech Level ${l.tech_level}</div>
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-naval-300 font-semibold">${Math.round(l.displacement).toLocaleString()}t</div>
                                <div class="text-slate-400">${l.max_speed} nós</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${l.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Tripulação: <span class="text-slate-200">${l.crew}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(l.cost_base/1e6)}M</span></div>
                        </div>
                        
                        <div class="grid grid-cols-4 gap-1 text-xs mb-3">
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Princ.</div>
                                <div class="text-slate-100 font-semibold">${l.main_armament_slots||0}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Sec.</div>
                                <div class="text-slate-100 font-semibold">${l.secondary_armament_slots||0}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">AA</div>
                                <div class="text-slate-100 font-semibold">${l.aa_slots||0}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Torp.</div>
                                <div class="text-slate-100 font-semibold">${l.torpedo_tubes||0}</div>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${l.advantages.map(d=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${d}</span>`).join("")}
                        </div>
                        
                        ${o?'<div class="text-center text-naval-300 text-xs font-semibold">✓ SELECIONADO</div>':""}
                    </div>
                `}),t+="</div></div>"}),t+="</div>",e.innerHTML=t}static loadPropulsionTab(){const e=document.getElementById("tab-content");if(!e)return;let t=`
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">⚙️ Sistema de Propulsão</h3>
                    <p class="text-slate-400">Configure o sistema de propulsão que determinará velocidade, autonomia e custos operacionais</p>
                </div>
        `;if(!window.NAVAL_COMPONENTS?.propulsion_systems){t+='<div class="text-center text-red-400">❌ Sistemas de propulsão não carregados</div>',e.innerHTML=t+"</div>";return}const a=this.filterComponentsByHull(window.NAVAL_COMPONENTS.propulsion_systems);if(Object.keys(a).length===0){const n=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null;t+=`<div class="text-center text-amber-400">⚠️ Nenhum sistema de propulsão compatível com ${n?.name||"casco atual"}</div>`,e.innerHTML=t+"</div>";return}const s={};Object.entries(a).forEach(([n,l])=>{s[l.type]||(s[l.type]=[]),s[l.type].push({id:n,...l})});const i={steam_turbine:"Turbinas a Vapor",diesel:"Motores Diesel",diesel_electric:"Diesel-Elétrico",nuclear:"Propulsão Nuclear",gas_turbine:"Turbinas a Gás",combined:"Sistemas Combinados"};Object.entries(s).forEach(([n,l])=>{t+=`
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4 flex items-center space-x-2">
                        <span>${this.getPropulsionIcon(n)}</span>
                        <span>${i[n]||n}</span>
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,l.forEach(o=>{const c=window.currentShip?.propulsion===o.id;t+=`
                    <div class="${c?"border-naval-400 ring-1 ring-naval-400/50 bg-naval-900/20":"border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50"} border rounded-xl p-4 cursor-pointer transition-all duration-200"
                         onclick="selectPropulsion('${o.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${o.name}</h5>
                                <div class="text-xs text-slate-400">${o.year_introduced} • Tech Level ${o.tech_level}</div>
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${Math.round(o.power_hp/1e3)}k HP</div>
                                <div class="text-slate-400">${Math.round(o.reliability*100)}% conf.</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${o.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${o.weight}t</span></div>
                            <div class="text-slate-400">Consumo: <span class="text-yellow-300">${o.fuel_consumption} gal/h</span></div>
                            <div class="text-slate-400 col-span-2">Custo: <span class="text-green-300">$${Math.round(o.cost/1e6)}M</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${o.advantages.map(h=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${h}</span>`).join("")}
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${o.disadvantages.map(h=>`<span class="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded">${h}</span>`).join("")}
                        </div>
                        
                        ${c?'<div class="text-center text-naval-300 text-xs font-semibold">✓ SELECIONADO</div>':""}
                    </div>
                `}),t+="</div></div>"}),t+="</div>",e.innerHTML=t}static loadArmorTab(){const e=document.getElementById("tab-content");if(!e)return;let t=`
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🛡️ Sistema de Blindagem</h3>
                    <p class="text-slate-400">Configure a proteção do navio contra diferentes tipos de ameaças</p>
                </div>
        `;if(!window.NAVAL_COMPONENTS?.armor_schemes){t+='<div class="text-center text-red-400">❌ Sistema de blindagem não carregado</div>',e.innerHTML=t+"</div>";return}t+=`
            <div class="bg-slate-800/40 rounded-xl p-6 mb-6">
                <h4 class="text-lg font-semibold text-slate-100 mb-4">📋 Esquema de Blindagem</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        `,Object.entries(window.NAVAL_COMPONENTS.armor_schemes).forEach(([a,s])=>{const n=(window.currentShip?.armor?.scheme||"unarmored")===a,l=n?"border-naval-400 ring-1 ring-naval-400/50 bg-naval-900/20":"border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50",o=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,c=!s.suitable_ships||!o||s.suitable_ships.includes(o.role);t+=`
                <div class="border rounded-xl p-4 cursor-pointer transition-all duration-200 ${l} ${c?"":"opacity-60"}" 
                     ${c?`onclick="selectArmorScheme('${a}')"`:""}>
                    <div class="mb-3">
                        <h5 class="font-semibold text-slate-100 text-sm mb-1">${s.name}</h5>
                        ${c?"":'<div class="text-xs text-red-400 mb-2">Incompatível com casco atual</div>'}
                    </div>
                    
                    <p class="text-xs text-slate-300 mb-3">${s.description}</p>
                    
                    <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div class="text-slate-400">Peso: <span class="text-yellow-300">${Math.round((s.weight_modifier-1)*100)}%</span></div>
                        <div class="text-slate-400">Custo: <span class="text-green-300">${Math.round((s.cost_modifier-1)*100)}%</span></div>
                    </div>
                    
                    ${n?'<div class="text-xs text-naval-300 font-medium">✓ Selecionado</div>':""}
                </div>
            `}),t+="</div></div>",t+=`
            <div class="bg-slate-800/40 rounded-xl p-6 mb-6">
                <h4 class="text-lg font-semibold text-slate-100 mb-4">⚙️ Configuração Individual por Zona</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        `,window.NAVAL_COMPONENTS?.armor_zones&&Object.entries(window.NAVAL_COMPONENTS.armor_zones).forEach(([a,s])=>{const i=window.currentShip?.armor?.custom_zones?.[a]||"no_armor",l=(window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null)?.role||"destroyer";t+=`
                    <div class="bg-slate-900/50 rounded-lg p-4">
                        <h5 class="text-md font-semibold text-slate-100 mb-2">${s.name}</h5>
                        <p class="text-xs text-slate-400 mb-3">${s.description}</p>
                        
                        <div class="text-xs text-slate-500 mb-3">
                            Área: ${s.area_sqm_base[l]||s.area_sqm_base.destroyer}m² • 
                            Importância: ${s.importance==="critical"?"🔴 Crítica":s.importance==="high"?"🟡 Alta":"🟢 Média"}
                        </div>
                        
                        <select onchange="updateArmorZone('${a}', this.value)" 
                                class="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-slate-100 text-sm">
                `,Object.entries(window.NAVAL_COMPONENTS.armor_materials).forEach(([c,d])=>{(s.suitable_materials.includes(c)||c==="no_armor"||c==="structural_steel")&&(t+=`<option value="${c}" ${i===c?"selected":""}>${d.name} (${d.thickness_mm}mm)</option>`)}),t+=`
                        </select>
                        
                        <div class="mt-2 text-xs">
                `;const o=window.NAVAL_COMPONENTS.armor_materials[i];if(o&&o.thickness_mm>0){const c=s.area_sqm_base[l]||s.area_sqm_base.destroyer,d=o.weight_per_sqm_kg*c*s.weight_multiplier/1e3,h=o.cost_per_sqm*c;t+=`
                        <div class="flex justify-between">
                            <span class="text-slate-400">Proteção:</span>
                            <span class="text-blue-300">${o.protection_rating.toFixed(1)}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Peso:</span>
                            <span class="text-yellow-300">${Math.round(d)}t</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Custo:</span>
                            <span class="text-green-300">$${Math.round(h/1e3)}K</span>
                        </div>
                    `}t+=`
                        </div>
                    </div>
                `}),t+="</div></div>",t+=`
            <div class="bg-slate-800/40 rounded-xl p-6">
                <h4 class="text-lg font-semibold text-slate-100 mb-4">📊 Resumo de Blindagem</h4>
                <div id="armor-summary">
                    ${this.renderArmorSummary()}
                </div>
            </div>
        `,t+="</div>",e.innerHTML=t}static loadMainGunsTab(){const e=document.getElementById("tab-content");if(!e)return;let t=`
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🎯 Artilharia Principal</h3>
                    <p class="text-slate-400">Configure os canhões principais que definem o poder de fogo do navio</p>
                </div>
        `;if(!window.NAVAL_COMPONENTS?.naval_guns){t+='<div class="text-center text-red-400">❌ Sistemas de artilharia não carregados</div>',e.innerHTML=t+"</div>";return}const a={small:[],medium:[],large:[]},s=this.filterComponentsByHull(window.NAVAL_COMPONENTS.naval_guns);Object.entries(s).forEach(([n,l])=>{const o={id:n,...l};l.caliber<127?a.small.push(o):l.caliber<=203?a.medium.push(o):a.large.push(o)});const i={small:"Canhões Leves (76-120mm)",medium:"Canhões Médios (127-203mm)",large:"Canhões Pesados (356mm+)"};Object.entries(a).forEach(([n,l])=>{l.length!==0&&(t+=`
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4">${i[n]}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,l.forEach(o=>{t+=`
                    <div class="border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 border rounded-xl p-4 cursor-pointer transition-all duration-200"
                         onclick="addMainGun('${o.id}')">
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${o.name}</h5>
                                <div class="text-xs text-slate-400">${o.year_introduced} • Tech Level ${o.tech_level}</div>
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${o.caliber}mm/${o.barrel_length}</div>
                                <div class="text-slate-400">${o.rate_of_fire} rpm</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${o.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${o.weight_tons}t</span></div>
                            <div class="text-slate-400">Alcance: <span class="text-yellow-300">${Math.round(o.max_range_yards*.9144/1e3)}km</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-slate-200">${o.crew}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(o.cost/1e3)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${o.ammunition_types.map(c=>`<span class="text-xs px-2 py-1 bg-orange-900/30 text-orange-300 rounded">${c}</span>`).join("")}
                        </div>
                        
                        <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                            Adicionar Torre
                        </button>
                    </div>
                `}),t+="</div></div>")}),window.currentShip?.main_guns&&Array.isArray(window.currentShip.main_guns)&&window.currentShip.main_guns.length>0&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🎯 Configuração Atual</h4>
                    <div id="current-main-guns" class="space-y-2">
                        ${this.renderCurrentMainGuns()}
                    </div>
                </div>
            `),t+="</div>",e.innerHTML=t}static loadSecondaryTab(){const e=document.getElementById("tab-content");if(!e)return;let t=`
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">🚀 Armamento Secundário & Mísseis</h3>
                    <p class="text-slate-400">Configure sistemas AA, mísseis e armamento de apoio da era 1954</p>
                </div>
        `;if(!window.NAVAL_COMPONENTS?.naval_missiles){t+='<div class="text-center text-red-400">❌ Sistemas de mísseis não carregados</div>',e.innerHTML=t+"</div>";return}const a={};Object.entries(window.NAVAL_COMPONENTS.naval_missiles).forEach(([i,n])=>{a[n.type]||(a[n.type]=[]),a[n.type].push({id:i,...n})});const s={surface_to_air:"🛡️ Mísseis SAM (Defesa Aérea)",cruise_missile:"🌊 Mísseis de Cruzeiro",anti_ship:"🎯 Mísseis Anti-Navio",anti_submarine:"🐟 Foguetes ASW"};Object.entries(a).forEach(([i,n])=>{t+=`
                <div class="mb-8">
                    <h4 class="text-xl font-semibold text-naval-300 mb-4">${s[i]||i}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,n.forEach(l=>{const o=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,c=!l.suitable_ships||!o||l.suitable_ships.includes(window.currentShip.hull);t+=`
                    <div class="${`border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${c?"":"opacity-60"}`}" ${c?`onclick="addMissileSystem('${l.id}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${l.name}</h5>
                                <div class="text-xs text-slate-400">${l.year_introduced} • Tech Level ${l.tech_level}</div>
                                ${c?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${l.range_km}km</div>
                                <div class="text-slate-400">${Math.round(l.reliability*100)}% conf.</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${l.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso Lançador: <span class="text-slate-200">${l.launcher_weight_tons}t</span></div>
                            <div class="text-slate-400">Ogiva: <span class="text-yellow-300">${l.warhead_kg}kg</span></div>
                            <div class="text-slate-400">Custo Sistema: <span class="text-green-300">$${Math.round(l.cost_per_launcher/1e6)}M</span></div>
                            <div class="text-slate-400">Míssel: <span class="text-green-300">$${Math.round(l.cost_per_missile/1e3)}K</span></div>
                        </div>
                        
                        <div class="grid grid-cols-3 gap-1 text-xs mb-3">
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Mísseis</div>
                                <div class="text-slate-100 font-semibold">${l.missiles_per_launcher||"N/A"}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Tripulação</div>
                                <div class="text-slate-100 font-semibold">${l.crew_required||"N/A"}</div>
                            </div>
                            <div class="text-center p-1 bg-slate-700/30 rounded">
                                <div class="text-slate-400">Energia</div>
                                <div class="text-slate-100 font-semibold">${l.power_consumption_kw||0}kW</div>
                            </div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${l.advantages.slice(0,2).map(v=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${v}</span>`).join("")}
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${l.disadvantages.slice(0,2).map(v=>`<span class="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded">${v}</span>`).join("")}
                        </div>
                        
                        ${c?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div></div>"}),window.currentShip?.missiles&&Array.isArray(window.currentShip.missiles)&&window.currentShip.missiles.length>0&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🚀 Sistemas de Mísseis Instalados</h4>
                    <div id="current-missiles" class="space-y-2">
                        ${this.renderCurrentMissiles()}
                    </div>
                </div>
            `),window.NAVAL_COMPONENTS?.aa_guns&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🔫 Artilharia Antiaérea</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,Object.entries(window.NAVAL_COMPONENTS.aa_guns).forEach(([i,n])=>{const l=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,o=!n.suitable_ships||!l||n.suitable_ships.includes(window.currentShip.hull);t+=`
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${o?"":"opacity-60"}" ${o?`onclick="addAAGun('${i}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${n.name}</h5>
                                <div class="text-xs text-slate-400">${n.year_introduced} • ${n.caliber}mm</div>
                                ${o?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${n.rate_of_fire} TPM</div>
                                <div class="text-slate-400">${Math.round((n.max_range_yards||n.effective_range_aa)*.9144)}m</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${n.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${n.weight_tons}t</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-yellow-300">${n.crew}</span></div>
                            <div class="text-slate-400">Tipo: <span class="text-blue-300">${n.type.replace("_"," ")}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(n.cost/1e3)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${n.advantages.slice(0,2).map(d=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${d}</span>`).join("")}
                        </div>
                        
                        ${o?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Canhão AA
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div>",window.currentShip?.aa_guns&&Array.isArray(window.currentShip.aa_guns)&&window.currentShip.aa_guns.length>0&&(t+=`
                    <div class="mt-6">
                        <h5 class="text-md font-semibold text-slate-100 mb-3">🔫 Canhões AA Instalados</h5>
                        <div id="current-aa-guns" class="space-y-2">
                            ${this.renderCurrentAAGuns()}
                        </div>
                    </div>
                `),t+="</div>"),window.NAVAL_COMPONENTS?.torpedo_tubes&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🚀 Tubos de Torpedo</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            `,Object.entries(window.NAVAL_COMPONENTS.torpedo_tubes).forEach(([i,n])=>{const l=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,o=!n.suitable_ships||!l||n.suitable_ships.includes(window.currentShip.hull);t+=`
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${o?"":"opacity-60"}" ${o?`onclick="addTorpedoTube('${i}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${n.name}</h5>
                                <div class="text-xs text-slate-400">${n.year_introduced} • ${n.caliber}mm</div>
                                ${o?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${n.tubes_per_mount||1} tubos</div>
                                <div class="text-slate-400">${n.reload_time_minutes||"N/A"} min recarga</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${n.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${n.weight_tons}t</span></div>
                            <div class="text-slate-400">Arco: <span class="text-yellow-300">${n.training_arc||360}°</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(n.cost/1e3)}K</span></div>
                            <div class="text-slate-400">Tipos: <span class="text-blue-300">${(n.torpedo_types||[]).length}</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${n.advantages.slice(0,2).map(d=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${d}</span>`).join("")}
                        </div>
                        
                        ${o?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div>",window.currentShip?.torpedo_tubes&&Array.isArray(window.currentShip.torpedo_tubes)&&window.currentShip.torpedo_tubes.length>0&&(t+=`
                    <div class="mt-6">
                        <h5 class="text-md font-semibold text-slate-100 mb-3">🚀 Torpedos Instalados</h5>
                        <div id="current-torpedo-tubes" class="space-y-2">
                            ${this.renderCurrentTorpedos()}
                        </div>
                    </div>
                `),t+="</div>"),window.NAVAL_COMPONENTS?.depth_charges&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🐟 Sistemas Anti-Submarino</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            `,Object.entries(window.NAVAL_COMPONENTS.depth_charges).forEach(([i,n])=>{const l=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,o=!n.suitable_ships||!l||n.suitable_ships.includes(window.currentShip.hull);t+=`
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${o?"":"opacity-60"}" ${o?`onclick="addDepthCharge('${i}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1">${n.name}</h5>
                                <div class="text-xs text-slate-400">${n.year_introduced} • ${n.type}</div>
                                ${o?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${n.warhead_kg}kg</div>
                                <div class="text-slate-400">${n.range_yards||n.max_depth}${n.range_yards?"y":"m"}</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${n.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso Sist.: <span class="text-slate-200">${n.launcher_weight_tons}t</span></div>
                            <div class="text-slate-400">Capacidade: <span class="text-yellow-300">${n.capacity||n.projectiles}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(n.cost/1e3)}K</span></div>
                            <div class="text-slate-400">Método: <span class="text-blue-300">${(n.launch_method||n.pattern_type||"standard").replace("_"," ")}</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${n.advantages.slice(0,2).map(d=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${d}</span>`).join("")}
                        </div>
                        
                        ${o?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema ASW
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div>",window.currentShip?.depth_charges&&Array.isArray(window.currentShip.depth_charges)&&window.currentShip.depth_charges.length>0&&(t+=`
                    <div class="mt-6">
                        <h5 class="text-md font-semibold text-slate-100 mb-3">🐟 Sistemas ASW Instalados</h5>
                        <div id="current-depth-charges" class="space-y-2">
                            ${this.renderCurrentDepthCharges()}
                        </div>
                    </div>
                `),t+="</div>"),t+="</div>",e.innerHTML=t}static loadElectronicsTab(){const e=document.getElementById("tab-content");if(!e)return;let t=`
            <div class="space-y-6">
                <div class="text-center mb-6">
                    <h3 class="text-2xl font-bold text-slate-100 mb-2">📡 Sistemas Eletrônicos</h3>
                    <p class="text-slate-400">Configure radar, sonar, comunicações e sistemas de guerra eletrônica da era 1954</p>
                </div>
        `;window.NAVAL_COMPONENTS?.radar_systems&&(t+=`
                <div class="border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">📡 Sistemas de Radar</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,Object.entries(window.NAVAL_COMPONENTS.radar_systems).forEach(([a,s])=>{const i=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,n=!s.suitable_ships||!i||s.suitable_ships.includes(window.currentShip.hull),l=n?"":"opacity-60",o={air_search:"🔍",surface_search:"🌊",fire_control:"🎯",navigation:"🧭"};t+=`
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${l}" ${n?`onclick="addElectronicsSystem('radar_systems', '${a}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${o[s.type]||"📡"}</span>
                                    <span>${s.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${s.year_introduced} • Banda ${s.frequency_band}</div>
                                ${n?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${s.max_range_miles}mi</div>
                                <div class="text-slate-400">${Math.round(s.reliability*100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${s.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: ${this.getScaledWeightDisplay(s.weight_tons)}</div>
                            <div class="text-slate-400">Energia: <span class="text-yellow-300">${s.power_consumption_kw}kW</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${s.crew_required}</span></div>
                            <div class="text-slate-400">Custo: $${this.getScaledCostDisplay(Math.round(s.cost/1e3))}K</div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${s.advantages.slice(0,2).map(c=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${c}</span>`).join("")}
                        </div>
                        
                        ${n?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Radar
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div></div>"),window.NAVAL_COMPONENTS?.sonar_systems&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">🔊 Sistemas de Sonar</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,Object.entries(window.NAVAL_COMPONENTS.sonar_systems).forEach(([a,s])=>{const i=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,n=!s.suitable_ships||!i||s.suitable_ships.includes(window.currentShip.hull),l=n?"":"opacity-60",o={hull_mounted:"🚢",variable_depth:"🎣",towed_array:"📡"};t+=`
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${l}" ${n?`onclick="addElectronicsSystem('sonar_systems', '${a}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${o[s.type]||"🔊"}</span>
                                    <span>${s.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${s.year_introduced} • ${s.frequency_khz}kHz</div>
                                ${n?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${Math.round(s.max_range_yards*.9144)}m</div>
                                <div class="text-slate-400">${Math.round(s.reliability*100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${s.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: ${this.getScaledWeightDisplay(s.weight_tons)}</div>
                            <div class="text-slate-400">Energia: <span class="text-yellow-300">${s.power_consumption_kw}kW</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${s.crew_required}</span></div>
                            <div class="text-slate-400">Custo: $${this.getScaledCostDisplay(Math.round(s.cost/1e3))}K</div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${s.advantages.slice(0,2).map(c=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${c}</span>`).join("")}
                        </div>
                        
                        ${n?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sonar
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div></div>"),window.NAVAL_COMPONENTS?.communication_systems&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">📻 Sistemas de Comunicação</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,Object.entries(window.NAVAL_COMPONENTS.communication_systems).forEach(([a,s])=>{const i=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,n=!s.suitable_ships||!i||s.suitable_ships.includes(window.currentShip.hull),l=n?"":"opacity-60",o={hf_radio:"📻",secure_radio:"🔐",vhf_tactical:"📡"};t+=`
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${l}" ${n?`onclick="addElectronicsSystem('communication_systems', '${a}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${o[s.type]||"📻"}</span>
                                    <span>${s.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${s.year_introduced} • ${s.frequency_range.replace("_"," ")}</div>
                                ${n?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${s.max_range_miles}mi</div>
                                <div class="text-slate-400">${Math.round(s.reliability*100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${s.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${s.weight_tons}t</span></div>
                            <div class="text-slate-400">Potência: <span class="text-yellow-300">${s.power_output_watts}W</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${s.crew_required}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(s.cost/1e3)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${s.advantages.slice(0,2).map(c=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${c}</span>`).join("")}
                        </div>
                        
                        ${s.encryption_capable?'<div class="text-xs text-green-400 mb-2">🔐 Criptografia disponível</div>':""}
                        
                        ${n?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Comunicação
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div></div>"),window.NAVAL_COMPONENTS?.electronic_warfare&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">⚡ Guerra Eletrônica</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            `,Object.entries(window.NAVAL_COMPONENTS.electronic_warfare).forEach(([a,s])=>{const i=window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null,n=!s.suitable_ships||!i||s.suitable_ships.includes(window.currentShip.hull),l=n?"":"opacity-60",o={radar_warning:"⚠️",active_jammer:"📡",chaff_dispenser:"💨"};t+=`
                    <div class="border border-slate-700/50 bg-slate-800/40 hover:border-naval-500/50 hover:bg-slate-700/50 rounded-xl p-4 cursor-pointer transition-all duration-200 ${l}" ${n?`onclick="addElectronicsSystem('electronic_warfare', '${a}')"`:""}>
                        <div class="flex items-start justify-between mb-3">
                            <div>
                                <h5 class="font-semibold text-slate-100 text-sm mb-1 flex items-center space-x-2">
                                    <span>${o[s.type]||"⚡"}</span>
                                    <span>${s.name}</span>
                                </h5>
                                <div class="text-xs text-slate-400">${s.year_introduced} • ${s.type.replace("_"," ")}</div>
                                ${n?"":'<div class="text-xs text-red-400 mt-1">Incompatível com casco atual</div>'}
                            </div>
                            <div class="text-right text-xs">
                                <div class="text-orange-300 font-semibold">${s.detection_range_miles||s.effectiveness_duration_minutes||"N/A"}</div>
                                <div class="text-slate-400">${Math.round(s.reliability*100)}%</div>
                            </div>
                        </div>
                        
                        <p class="text-xs text-slate-300 mb-3">${s.description}</p>
                        
                        <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                            <div class="text-slate-400">Peso: <span class="text-slate-200">${s.weight_tons}t</span></div>
                            <div class="text-slate-400">Energia: <span class="text-yellow-300">${s.power_consumption_kw||0}kW</span></div>
                            <div class="text-slate-400">Tripulação: <span class="text-blue-300">${s.crew_required||0}</span></div>
                            <div class="text-slate-400">Custo: <span class="text-green-300">$${Math.round(s.cost/1e3)}K</span></div>
                        </div>
                        
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${s.advantages.slice(0,2).map(c=>`<span class="text-xs px-2 py-1 bg-green-900/30 text-green-300 rounded">${c}</span>`).join("")}
                        </div>
                        
                        ${n?`
                            <button class="w-full mt-2 px-3 py-1 bg-naval-600 hover:bg-naval-700 text-white text-xs rounded font-medium transition-colors">
                                Instalar Sistema EW
                            </button>
                        `:`
                            <div class="w-full mt-2 px-3 py-1 bg-slate-600 text-slate-400 text-xs rounded text-center">
                                Incompatível
                            </div>
                        `}
                    </div>
                `}),t+="</div></div>"),window.currentShip?.electronics&&Array.isArray(window.currentShip.electronics)&&window.currentShip.electronics.length>0&&(t+=`
                <div class="mt-8 border-t border-slate-700/50 pt-6">
                    <h4 class="text-lg font-semibold text-slate-100 mb-4">💻 Sistemas Eletrônicos Instalados</h4>
                    <div id="current-electronics" class="space-y-2">
                        ${this.renderCurrentElectronics()}
                    </div>
                </div>
            `),t+="</div>",e.innerHTML=t}static renderCurrentMainGuns(){if(!window.currentShip?.main_guns||!Array.isArray(window.currentShip.main_guns))return'<p class="text-slate-400 text-sm">Nenhum canhão principal configurado</p>';let e="";return window.currentShip.main_guns.forEach((t,a)=>{const s=window.NAVAL_COMPONENTS?.naval_guns[t.type];s&&(e+=`
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100">${s.name}</div>
                            <div class="text-xs text-slate-400">
                                ${t.quantity||1}x ${t.mount||"single_mount"} • 
                                ${s.caliber}mm/${s.barrel_length}
                            </div>
                        </div>
                        <button onclick="removeMainGun(${a})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `)}),e}static renderCurrentMissiles(){if(!window.currentShip?.missiles||!Array.isArray(window.currentShip.missiles))return'<p class="text-slate-400 text-sm">Nenhum sistema de míssil instalado</p>';let e="";return window.currentShip.missiles.forEach((t,a)=>{const s=window.NAVAL_COMPONENTS?.naval_missiles[t.type];s&&(e+=`
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>${{surface_to_air:"🛡️",cruise_missile:"🌊",anti_ship:"🎯",anti_submarine:"🐟"}[s.type]||"🚀"}</span>
                                <span>${s.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${t.quantity||1}x Sistema • 
                                Alcance: ${s.range_km}km • 
                                ${s.missiles_per_launcher||"N/A"} mísseis
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${s.launcher_weight_tons}t • 
                                Custo: $${Math.round(s.cost_per_launcher/1e6)}M
                            </div>
                        </div>
                        <button onclick="removeMissileSystem(${a})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `)}),e}static renderCurrentAAGuns(){if(!window.currentShip?.aa_guns||!Array.isArray(window.currentShip.aa_guns))return'<p class="text-slate-400 text-sm">Nenhum canhão AA instalado</p>';let e="";return window.currentShip.aa_guns.forEach((t,a)=>{const s=window.NAVAL_COMPONENTS?.aa_guns[t.type];s&&(e+=`
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>🔫</span>
                                <span>${s.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${t.quantity||1}x ${s.type.replace("_"," ")} • 
                                ${s.caliber}mm • ${s.rate_of_fire} TPM
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${s.weight_tons}t • Custo: $${Math.round(s.cost/1e3)}K
                            </div>
                        </div>
                        <button onclick="removeAAGun(${a})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `)}),e}static renderCurrentTorpedos(){if(!window.currentShip?.torpedo_tubes||!Array.isArray(window.currentShip.torpedo_tubes))return'<p class="text-slate-400 text-sm">Nenhum sistema de torpedo instalado</p>';let e="";return window.currentShip.torpedo_tubes.forEach((t,a)=>{const s=window.NAVAL_COMPONENTS?.torpedo_tubes[t.type];s&&(e+=`
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>🚀</span>
                                <span>${s.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${t.quantity||1}x Sistema • 
                                ${s.tubes_per_mount||1} tubos • 
                                ${s.caliber}mm
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${s.weight_tons}t • 
                                Recarga: ${s.reload_time_minutes}min
                            </div>
                        </div>
                        <button onclick="removeTorpedoTube(${a})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `)}),e}static renderCurrentDepthCharges(){if(!window.currentShip?.depth_charges||!Array.isArray(window.currentShip.depth_charges))return'<p class="text-slate-400 text-sm">Nenhum sistema ASW instalado</p>';let e="";return window.currentShip.depth_charges.forEach((t,a)=>{const s=window.NAVAL_COMPONENTS?.depth_charges[t.type];s&&(e+=`
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>🐟</span>
                                <span>${s.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${t.quantity||1}x Sistema • 
                                ${s.warhead_kg}kg ogiva • 
                                ${s.capacity||s.projectiles} munições
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${s.launcher_weight_tons}t • 
                                Alcance: ${s.range_yards||s.max_depth}${s.range_yards?"y":"m"}
                            </div>
                        </div>
                        <button onclick="removeDepthCharge(${a})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `)}),e}static renderCurrentElectronics(){if(!window.currentShip?.electronics||!Array.isArray(window.currentShip.electronics))return'<p class="text-slate-400 text-sm">Nenhum sistema eletrônico instalado</p>';let e="";return window.currentShip.electronics.forEach((t,a)=>{const i=window.NAVAL_COMPONENTS?.[t.category]?.[t.type];i&&(e+=`
                    <div class="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                        <div>
                            <div class="font-medium text-slate-100 flex items-center space-x-2">
                                <span>${{radar_systems:"📡",sonar_systems:"🔊",communication_systems:"📻",electronic_warfare:"⚡",navigation_systems:"🧭",data_processing:"💻"}[t.category]||"💻"}</span>
                                <span>${i.name}</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                ${t.quantity||1}x ${i.type.replace(/_/g," ")} • 
                                ${i.year_introduced} • ${Math.round(i.reliability*100)}%
                            </div>
                            <div class="text-xs text-slate-500 mt-1">
                                Peso: ${i.weight_tons}t • 
                                Energia: ${i.power_consumption_kw||0}kW • 
                                Custo: $${Math.round(i.cost/1e3)}K
                            </div>
                        </div>
                        <button onclick="removeElectronicsSystem(${a})" 
                                class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded hover:bg-red-900/20">
                            ✕
                        </button>
                    </div>
                `)}),e}static renderArmorSummary(){if(!window.currentShip?.armor||!window.NAVAL_COMPONENTS)return'<p class="text-slate-400 text-sm">Dados de blindagem indisponíveis</p>';let e=0,t=0,a='<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';const i=(window.currentShip?.hull?window.NAVAL_COMPONENTS.hulls[window.currentShip.hull]:null)?.role||"destroyer";return Object.entries(window.currentShip.armor.custom_zones).forEach(([n,l])=>{const o=window.NAVAL_COMPONENTS.armor_zones[n],c=window.NAVAL_COMPONENTS.armor_materials[l];if(o&&c){const d=o.area_sqm_base[i]||o.area_sqm_base.destroyer,h=c.weight_per_sqm_kg*d*o.weight_multiplier/1e3,v=c.cost_per_sqm*d;e+=h,t+=v}}),a+='<div class="space-y-2">',Object.entries(window.currentShip.armor.custom_zones).forEach(([n,l])=>{const o=window.NAVAL_COMPONENTS.armor_zones[n],c=window.NAVAL_COMPONENTS.armor_materials[l];if(o&&c){const d=c.protection_rating>=2?"🛡️":c.protection_rating>=1?"🔰":c.protection_rating>=.5?"🟢":"🔘";a+=`
                    <div class="flex justify-between items-center text-sm">
                        <div class="flex items-center space-x-2">
                            <span>${d}</span>
                            <span class="text-slate-300">${o.name}</span>
                        </div>
                        <div class="text-slate-400">
                            ${c.thickness_mm}mm • ${c.protection_rating.toFixed(1)}
                        </div>
                    </div>
                `}}),a+="</div>",a+=`
            <div class="space-y-3">
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-100 mb-2">💰 Totais</div>
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between">
                            <span class="text-slate-400">Peso Total:</span>
                            <span class="text-yellow-300">${Math.round(e)}t</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Custo Total:</span>
                            <span class="text-green-300">$${Math.round(t/1e6)}M</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="text-sm font-medium text-slate-100 mb-2">🎯 Proteção vs Ameaças</div>
                    <div class="space-y-1 text-xs">
                        ${this.calculateThreatProtection()}
                    </div>
                </div>
            </div>
        `,a+="</div>",a}static calculateThreatProtection(){if(!window.currentShip?.armor)return"";const e=window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.belt],t=window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.deck];window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.turrets],window.NAVAL_COMPONENTS.armor_materials[window.currentShip.armor.custom_zones.magazines];let a="";return[{name:"127mm HE",rating:e?.protection_rating||0,threshold:.3,icon:"💥"},{name:"203mm AP",rating:e?.protection_rating||0,threshold:1,icon:"🔫"},{name:"406mm AP",rating:e?.protection_rating||0,threshold:2,icon:"⚓"},{name:"Bombas",rating:t?.protection_rating||0,threshold:.5,icon:"✈️"},{name:"Mísseis",rating:Math.max(e?.protection_rating||0,t?.protection_rating||0),threshold:.8,icon:"🚀"},{name:"Torpedos",rating:e?.protection_rating||0,threshold:1.5,icon:"🐟"}].forEach(i=>{const n=Math.min(100,i.rating/i.threshold*100),l=n>=80?"text-green-300":n>=50?"text-yellow-300":n>=25?"text-orange-300":"text-red-300",o="█".repeat(Math.floor(n/10))+"░".repeat(10-Math.floor(n/10));a+=`
                <div class="flex justify-between items-center">
                    <span class="text-slate-400 flex items-center space-x-1">
                        <span>${i.icon}</span>
                        <span>${i.name}:</span>
                    </span>
                    <span class="${l} font-mono text-xs">${o} ${Math.round(n)}%</span>
                </div>
            `}),a}static getRoleIcon(e){return{escort:"🚤",cruiser:"🚢",battleship:"⚓",carrier:"✈️",submarine:"🐟"}[e]||"🚢"}static getPropulsionIcon(e){return{steam_turbine:"💨",diesel:"🔧",diesel_electric:"⚡",nuclear:"⚛️",gas_turbine:"🌪️",combined:"⚙️"}[e]||"⚙️"}}window.selectPropulsion=function(r){if(!window.NAVAL_COMPONENTS?.propulsion_systems[r]){console.error("Propulsion system not found:",r);return}window.currentShip.propulsion=r,console.log("Selected propulsion:",r),document.querySelectorAll('[onclick*="selectPropulsion"]').forEach(t=>{t.classList.remove("border-naval-400","ring-1","ring-naval-400/50","bg-naval-900/20"),t.classList.add("border-slate-700/50","bg-slate-800/40")});const e=document.querySelector(`[onclick="selectPropulsion('${r}')"]`);e&&(e.classList.add("border-naval-400","ring-1","ring-naval-400/50","bg-naval-900/20"),e.classList.remove("border-slate-700/50","bg-slate-800/40")),updateShipCalculations()};window.addMainGun=function(r){if(!window.NAVAL_COMPONENTS?.naval_guns[r]){console.error("Naval gun not found:",r);return}window.currentShip.main_guns||(window.currentShip.main_guns=[]),window.currentShip.main_guns.push({type:r,mount:"single_mount",quantity:1}),console.log("Added main gun:",r),updateShipCalculations();const e=document.getElementById("current-main-guns");e&&(e.innerHTML=g.renderCurrentMainGuns())};window.removeMainGun=function(r){if(window.currentShip.main_guns&&Array.isArray(window.currentShip.main_guns)){window.currentShip.main_guns.splice(r,1),console.log("Removed main gun at index:",r),updateShipCalculations();const e=document.getElementById("current-main-guns");e&&(e.innerHTML=g.renderCurrentMainGuns())}};window.addMissileSystem=function(r){if(!window.NAVAL_COMPONENTS?.naval_missiles[r]){console.error("Missile system not found:",r);return}window.currentShip.missiles||(window.currentShip.missiles=[]),window.currentShip.missiles.push({type:r,quantity:1}),console.log("Added missile system:",r),updateShipCalculations();const e=document.getElementById("current-missiles");e&&(e.innerHTML=g.renderCurrentMissiles())};window.removeMissileSystem=function(r){if(window.currentShip.missiles&&Array.isArray(window.currentShip.missiles)){window.currentShip.missiles.splice(r,1),console.log("Removed missile system at index:",r),updateShipCalculations();const e=document.getElementById("current-missiles");e&&(e.innerHTML=g.renderCurrentMissiles())}};window.addAAGun=function(r){if(!window.NAVAL_COMPONENTS?.aa_guns[r]){console.error("AA gun not found:",r);return}window.currentShip.aa_guns||(window.currentShip.aa_guns=[]),window.currentShip.aa_guns.push({type:r,quantity:1}),console.log("Added AA gun:",r),updateShipCalculations();const e=document.getElementById("current-aa-guns");e&&(e.innerHTML=g.renderCurrentAAGuns())};window.removeAAGun=function(r){if(window.currentShip.aa_guns&&Array.isArray(window.currentShip.aa_guns)){window.currentShip.aa_guns.splice(r,1),console.log("Removed AA gun at index:",r),updateShipCalculations();const e=document.getElementById("current-aa-guns");e&&(e.innerHTML=g.renderCurrentAAGuns())}};window.addTorpedoTube=function(r){if(!window.NAVAL_COMPONENTS?.torpedo_tubes[r]){console.error("Torpedo tube not found:",r);return}window.currentShip.torpedo_tubes||(window.currentShip.torpedo_tubes=[]),window.currentShip.torpedo_tubes.push({type:r,quantity:1}),console.log("Added torpedo tube:",r),updateShipCalculations();const e=document.getElementById("current-torpedo-tubes");e&&(e.innerHTML=g.renderCurrentTorpedos())};window.removeTorpedoTube=function(r){if(window.currentShip.torpedo_tubes&&Array.isArray(window.currentShip.torpedo_tubes)){window.currentShip.torpedo_tubes.splice(r,1),console.log("Removed torpedo tube at index:",r),updateShipCalculations();const e=document.getElementById("current-torpedo-tubes");e&&(e.innerHTML=g.renderCurrentTorpedos())}};window.addDepthCharge=function(r){if(!window.NAVAL_COMPONENTS?.depth_charges[r]){console.error("ASW system not found:",r);return}window.currentShip.depth_charges||(window.currentShip.depth_charges=[]),window.currentShip.depth_charges.push({type:r,quantity:1}),console.log("Added ASW system:",r),updateShipCalculations();const e=document.getElementById("current-depth-charges");e&&(e.innerHTML=g.renderCurrentDepthCharges())};window.removeDepthCharge=function(r){if(window.currentShip.depth_charges&&Array.isArray(window.currentShip.depth_charges)){window.currentShip.depth_charges.splice(r,1),console.log("Removed ASW system at index:",r),updateShipCalculations();const e=document.getElementById("current-depth-charges");e&&(e.innerHTML=g.renderCurrentDepthCharges())}};window.addElectronicsSystem=function(r,e){if(!window.NAVAL_COMPONENTS?.[r]?.[e]){console.error("Electronics system not found:",r,e);return}window.currentShip.electronics||(window.currentShip.electronics=[]),window.currentShip.electronics.push({category:r,type:e,quantity:1}),console.log("Added electronics system:",r,e),updateShipCalculations();const t=document.getElementById("current-electronics");t&&(t.innerHTML=g.renderCurrentElectronics())};window.removeElectronicsSystem=function(r){if(window.currentShip.electronics&&Array.isArray(window.currentShip.electronics)){window.currentShip.electronics.splice(r,1),console.log("Removed electronics system at index:",r),updateShipCalculations();const e=document.getElementById("current-electronics");e&&(e.innerHTML=g.renderCurrentElectronics())}};window.selectArmorScheme=function(r){if(!window.NAVAL_COMPONENTS?.armor_schemes[r]){console.error("Armor scheme not found:",r);return}const e=window.NAVAL_COMPONENTS.armor_schemes[r];window.currentShip.armor.scheme=r,Object.entries(e.zones).forEach(([t,a])=>{window.currentShip.armor.custom_zones[t]=a}),console.log("Selected armor scheme:",r),updateShipCalculations(),window.navalCreatorApp&&window.navalCreatorApp.currentTab==="armor"&&window.navalTabLoaders.loadArmorTab()};window.updateArmorZone=function(r,e){if(!window.NAVAL_COMPONENTS?.armor_materials[e]){console.error("Armor material not found:",e);return}window.currentShip.armor.custom_zones[r]=e,window.currentShip.armor.scheme="custom",console.log("Updated armor zone:",r,"to",e),updateShipCalculations();const t=document.getElementById("armor-summary");t&&(t.innerHTML=g.renderArmorSummary())};window.navalTabLoaders=g;const x={hulls:$,propulsion_systems:E,boilers:M,auxiliary_systems:O,naval_guns:V,gun_mounts:L,fire_control_systems:T,ammunition_types:P,naval_missiles:D,missile_launchers:q,guidance_systems:k,missile_magazines:j,aa_guns:z,torpedo_tubes:B,depth_charges:I,countermeasures:R,searchlights:H,radar_systems:J,sonar_systems:K,communication_systems:F,electronic_warfare:U,navigation_systems:G,data_processing:W,armor_materials:Z,armor_zones:Y,armor_schemes:Q};window.NAVAL_COMPONENTS=x;window.currentShip={name:"Novo Navio",hull:null,propulsion:null,armor:{scheme:"unarmored",custom_zones:{belt:"no_armor",deck:"structural_steel",turrets:"no_armor",conning_tower:"structural_steel",barbettes:"no_armor",magazines:"light_armor"}},main_guns:[],secondary_weapons:[],missiles:[],aa_guns:[],torpedo_tubes:[],depth_charges:[],countermeasures:[],searchlights:[],electronics:[],quantity:1};window.loadNavalComponents=async function(){try{return console.log("📦 Loading naval components for War 1954..."),x&&Object.keys(x.hulls||{}).length>0?(console.log(`✅ Loaded ${Object.keys(x.hulls).length} hull types`),console.log(`✅ Loaded ${Object.keys(x.propulsion_systems).length} propulsion systems`),console.log(`✅ Loaded ${Object.keys(x.naval_guns).length} naval guns`),!0):(console.error("❌ Naval components not properly loaded"),!1)}catch(r){return console.error("❌ Error loading naval components:",r),!1}};class ee{constructor(){this.initialized=!1,this.performanceCalculator=null,this.costSystem=null}async initialize(){try{if(console.log("🚢 Initializing Naval Creator System..."),!await window.loadNavalComponents())throw new Error("Failed to load naval components");return this.initializeSystems(),this.initialized=!0,console.log("✅ Naval Creator System initialized successfully"),!0}catch(e){return console.error("❌ Naval Creator initialization failed:",e),!1}}initializeSystems(){window.navalPerformanceCalculator&&(this.performanceCalculator=window.navalPerformanceCalculator,console.log("✅ Naval Performance Calculator connected")),window.NavalCostSystem&&(this.costSystem=window.NavalCostSystem,console.log("✅ Naval Cost System connected"))}calculateShipPerformance(e=window.currentShip){return this.performanceCalculator?this.performanceCalculator.calculateShipPerformance(e):(console.warn("⚠️ Performance calculator not available"),{error:"Performance calculator not loaded"})}calculateShipCosts(e=window.currentShip){return this.costSystem?this.costSystem.calculateCosts(e):(console.warn("⚠️ Cost system not available"),{error:"Cost system not loaded"})}validateShipConfiguration(e=window.currentShip){const t=[],a=e.hull?x.hulls[e.hull]:null;if(!a)return t.push("Nenhum casco selecionado"),t;if(e.main_guns&&e.main_guns.length>(a.main_armament_slots||0)&&t.push(`Muito armamento principal: ${e.main_guns.length} > ${a.main_armament_slots} slots disponíveis`),e.secondary_weapons&&e.secondary_weapons.length>(a.secondary_armament_slots||0)&&t.push(`Muitas armas secundárias: ${e.secondary_weapons.length} > ${a.secondary_armament_slots} slots disponíveis`),e.propulsion){const i=x.propulsion_systems[e.propulsion];i&&i.suitable_hulls&&!i.suitable_hulls.includes(a.role)&&t.push(`Sistema de propulsão ${i.name} pode não ser adequado para ${a.role}`)}const s=1954;if(a.year_introduced>s&&t.push(`Casco ${a.name} é muito avançado para ${s}`),e.propulsion){const i=x.propulsion_systems[e.propulsion];i&&i.year_introduced>s&&t.push(`Sistema de propulsão ${i.name} é muito avançado para ${s}`)}return t}exportShipDesign(e=window.currentShip){const t={version:"1.0",created:new Date().toISOString(),ship:{...e},performance:this.calculateShipPerformance(e),costs:this.calculateShipCosts(e)};return JSON.stringify(t,null,2)}importShipDesign(e){try{const t=JSON.parse(e);return t.ship?(window.currentShip={...t.ship},!0):!1}catch(t){return console.error("Error importing ship design:",t),!1}}saveDesignToStorage(e){const t=this.exportShipDesign(),a=JSON.parse(localStorage.getItem("navalDesigns")||"{}");a[e]=t,localStorage.setItem("navalDesigns",JSON.stringify(a))}loadDesignFromStorage(e){const t=JSON.parse(localStorage.getItem("navalDesigns")||"{}");return t[e]?this.importShipDesign(t[e]):!1}getSavedDesigns(){return Object.keys(JSON.parse(localStorage.getItem("navalDesigns")||"{}"))}}window.navalCreator=new ee;window.updateShipDisplays=function(r){const e=document.getElementById("total-displacement-display"),t=document.getElementById("max-speed-display"),a=document.getElementById("main-armament-display");document.getElementById("total-cost-display"),e&&r.totalDisplacement&&(e.textContent=Math.round(r.totalDisplacement).toLocaleString()+" t"),t&&r.maxSpeed&&(t.textContent=Math.round(r.maxSpeed)+" nós"),a&&r.mainArmament!==void 0&&(a.textContent=r.mainArmament+" canhões")};window.updateShipName=function(r){window.currentShip.name=r;const e=document.getElementById("ship-name-display");e&&(e.textContent=r)};window.resetShipDesign=function(){window.currentShip={name:"Novo Navio",hull:null,propulsion:null,armor:{scheme:"unarmored",custom_zones:{belt:"no_armor",deck:"structural_steel",turrets:"no_armor",conning_tower:"structural_steel",barbettes:"no_armor",magazines:"light_armor",torpedo_defense:"no_armor"}},main_guns:[],secondary_weapons:[],missiles:[],aa_guns:[],torpedo_tubes:[],depth_charges:[],countermeasures:[],searchlights:[],electronics:[],quantity:1},window.navalCreatorApp&&(window.navalCreatorApp.loadTabContent(window.navalCreatorApp.currentTab),typeof window.updateShipCalculations=="function"&&window.updateShipCalculations())};window.showShipSummaryModal=function(){console.log("🚢 Showing ship summary modal");const r=window.currentShip,e=window.navalCreator.calculateShipPerformance(r),t=window.navalCreator.calculateShipCosts(r),a=window.navalCreator.validateShipConfiguration(r);let s=`
        <div id="ship-summary-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onclick="closeShipSummaryModal()">
            <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto p-6" onclick="event.stopPropagation()">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-slate-100 flex items-center space-x-2">
                        <span>⚓</span>
                        <span>Ficha Completa do Navio</span>
                    </h2>
                    <button onclick="closeShipSummaryModal()" class="text-slate-400 hover:text-slate-200 text-xl">&times;</button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-4">
                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <h3 class="text-lg font-semibold text-naval-300 mb-3">📋 Informações Básicas</h3>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Nome:</span>
                                    <span class="text-slate-100">${r.name}</span>
                                </div>
                                ${r.hull?`
                                    <div class="flex justify-between">
                                        <span class="text-slate-400">Classe:</span>
                                        <span class="text-slate-100">${x.hulls[r.hull].name}</span>
                                    </div>
                                `:""}
                                <div class="flex justify-between">
                                    <span class="text-slate-400">Ano:</span>
                                    <span class="text-slate-100">1954</span>
                                </div>
                            </div>
                        </div>

                        ${e&&!e.error?`
                            <div class="bg-slate-900/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-blue-300 mb-3">📊 Performance</h3>
                                ${window.NavalPerformanceSystem?window.NavalPerformanceSystem.renderPerformanceDisplay(r):'<p class="text-slate-400">Performance data not available</p>'}
                            </div>
                        `:""}
                    </div>

                    <div class="space-y-4">
                        ${t&&!t.error?`
                            <div class="bg-slate-900/50 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-green-300 mb-3">💰 Análise de Custos</h3>
                                ${window.NavalCostSystem?window.NavalCostSystem.renderCostDisplay(r):'<p class="text-slate-400">Cost data not available</p>'}
                            </div>
                        `:""}

                        ${a.length>0?`
                            <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
                                <h3 class="text-lg font-semibold text-amber-300 mb-3">⚠️ Avisos</h3>
                                <div class="space-y-1 text-sm">
                                    ${a.map(n=>`<div class="text-amber-200">• ${n}</div>`).join("")}
                                </div>
                            </div>
                        `:""}
                    </div>
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                    <button onclick="exportShipDesign()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                        📄 Exportar Design
                    </button>
                    <button onclick="closeShipSummaryModal()" class="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    `;const i=document.getElementById("ship-summary-modal");i&&i.remove(),document.body.insertAdjacentHTML("beforeend",s)};window.closeShipSummaryModal=function(){const r=document.getElementById("ship-summary-modal");r&&r.remove()};window.exportShipDesign=function(){const r=window.navalCreator.exportShipDesign(),e=new Blob([r],{type:"application/json"}),t=URL.createObjectURL(e),a=document.createElement("a");a.href=t,a.download=`${window.currentShip.name.replace(/[^a-z0-9]/gi,"_")}_naval_design.json`,a.click(),URL.revokeObjectURL(t)};window.submitNavalProductionOrder=async function(){try{if(!window.currentShip?.hull){alert("Selecione um casco antes de solicitar produção!");return}const r=window.currentShip,e=window.navalCreator.calculateShipPerformance(r),t=window.navalCreator.calculateShipCosts(r),a=window.navalCreator.validateShipConfiguration(r);if(a.some(s=>s.includes("Nenhum casco"))){alert("Configure o navio antes de solicitar produção!");return}showProductionRequestModal(r,e,t,a)}catch(r){console.error("❌ Erro ao solicitar produção:",r),alert("Erro ao solicitar produção: "+r.message)}};window.showProductionRequestModal=function(r,e,t,a){const s=window.NAVAL_COMPONENTS?.hulls[r.hull];if(!s){alert("Dados do casco não encontrados!");return}const i=document.createElement("div");i.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4",i.id="production-request-modal";const n=t?.production||s.cost_base,l=s.production?.build_time_months||24;i.innerHTML=`
        <div class="bg-slate-800 border border-slate-600 rounded-xl max-w-lg w-full p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-green-300">🏭 Solicitar Produção Naval</h3>
                <button onclick="closeProductionRequestModal()" class="text-slate-400 hover:text-slate-200 text-xl">&times;</button>
            </div>
            
            <div class="space-y-4 mb-6">
                <div class="bg-slate-900/50 rounded-lg p-4">
                    <h4 class="font-semibold text-slate-200 mb-2">${r.name}</h4>
                    <div class="text-sm text-slate-400 space-y-1">
                        <div>Tipo: <span class="text-slate-200">${s.name}</span></div>
                        <div>Deslocamento: <span class="text-slate-200">${e.totalDisplacement?.toLocaleString()||"?"} t</span></div>
                        <div>Velocidade: <span class="text-slate-200">${e.maxSpeed||"?"} nós</span></div>
                        <div>Custo unitário: <span class="text-green-300">$${n.toLocaleString()}</span></div>
                        <div>Tempo de construção: <span class="text-orange-300">${l} meses</span></div>
                    </div>
                </div>

                ${a.length>0?`
                    <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                        <h5 class="text-amber-300 font-semibold text-sm mb-2">⚠️ Avisos de Design:</h5>
                        <div class="text-xs text-amber-200 space-y-1">
                            ${a.map(d=>`<div>• ${d}</div>`).join("")}
                        </div>
                    </div>
                `:""}

                <div>
                    <label class="block text-sm font-medium text-slate-200 mb-2">Quantidade a solicitar:</label>
                    <input type="number" 
                           id="production-quantity-input" 
                           min="1" 
                           max="50" 
                           value="1"
                           class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:border-green-500 focus:outline-none">
                    <div class="text-xs text-slate-400 mt-1">Máximo: 50 unidades por pedido</div>
                </div>

                <div class="bg-slate-900/50 rounded-lg p-3">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-slate-400">Custo total estimado:</span>
                        <span id="total-production-cost" class="text-green-300 font-semibold">$${n.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-3">
                <button onclick="confirmProductionOrder()" class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                    🏭 Enviar Solicitação
                </button>
                <button onclick="closeProductionRequestModal()" class="flex-1 px-4 py-2 border border-slate-500 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors">
                    ❌ Cancelar
                </button>
            </div>
        </div>
    `,document.body.appendChild(i);const o=i.querySelector("#production-quantity-input"),c=i.querySelector("#total-production-cost");o.addEventListener("input",d=>{const h=parseInt(d.target.value)||1,v=n*h;c.textContent=`$${v.toLocaleString()}`})};window.closeProductionRequestModal=function(){const r=document.getElementById("production-request-modal");r&&r.remove()};window.confirmProductionOrder=async function(){try{const r=document.getElementById("production-quantity-input"),e=parseInt(r.value)||1;if(e<1||e>50){alert("Quantidade deve estar entre 1 e 50");return}const t=window.currentShip,a=window.navalCreator.calculateShipPerformance(t),s=window.navalCreator.calculateShipCosts(t),i={design:{...t},performance:a,costs:s,quantity:e,totalCost:(s?.production||window.NAVAL_COMPONENTS.hulls[t.hull].cost_base)*e,submissionDate:new Date};closeProductionRequestModal(),showShipSummaryModal(),setTimeout(async()=>{try{const n=await te(i);i.sheetImageUrl=n.pngUrl,i.sheetHtmlUrl=n.htmlUrl;const{submitNavalOrderForApproval:l}=await A(async()=>{const{submitNavalOrderForApproval:c}=await import("./navalProduction-BqKRwiuq.js");return{submitNavalOrderForApproval:c}},__vite__mapDeps([0,1,2,3,4])),o=await l(i);if(o.success){closeShipSummaryModal();const c=window.NAVAL_COMPONENTS.hulls[t.hull],d=Math.ceil((c.production?.build_time_months||24)/3);alert(`✅ Solicitação enviada com sucesso!

ID: ${o.id.substring(0,8)}
Quantidade: ${e}x ${t.name}
Tempo estimado: ${d} turnos

Ficha do navio capturada para análise do narrador.`)}}catch(n){console.error("❌ Erro ao capturar ficha:",n),alert("Aviso: Pedido será enviado sem imagem da ficha.");const{submitNavalOrderForApproval:l}=await A(async()=>{const{submitNavalOrderForApproval:c}=await import("./navalProduction-BqKRwiuq.js");return{submitNavalOrderForApproval:c}},__vite__mapDeps([0,1,2,3,4]));(await l(i)).success&&(closeShipSummaryModal(),alert("✅ Solicitação enviada (sem imagem da ficha)"))}},500)}catch(r){console.error("❌ Erro ao confirmar pedido:",r),alert("Erro ao confirmar pedido: "+r.message)}};async function te(r){try{console.log("🚀 === INICIANDO CAPTURA DE FICHA NAVAL ==="),console.log("📋 Dados da submissão:",r);const e=document.querySelector("#ship-summary-modal .bg-slate-800");if(console.log("🎯 Elemento da ficha encontrado:",!!e),!e)throw new Error("Elemento da ficha naval não encontrado");if(console.log("🖼️ html2canvas disponível:",typeof html2canvas<"u"),typeof html2canvas>"u")return console.log("⚠️ html2canvas não disponível, usando método alternativo"),{pngUrl:null,htmlUrl:await y(r)};if(console.log("🔥 Firebase disponível:",!!window.firebase),console.log("☁️ Storage disponível:",!!window.firebase?.storage),!window.firebase?.storage)return console.error("❌ Firebase Storage não disponível!"),{pngUrl:null,htmlUrl:await y(r)};const t={backgroundColor:"#1e293b",width:1200,height:Math.max(e.scrollHeight,800),useCORS:!0,scale:2,logging:!1};console.log("🖼️ Capturando imagem da ficha naval...");const a=await html2canvas(e,t);console.log("✅ Canvas capturado:",a.width+"x"+a.height),console.log("💾 Convertendo para arquivo...");const s=await new Promise(l=>{a.toBlob(l,"image/png",.9)});if(console.log("✅ Blob criado:",s?.size,"bytes"),!s)throw new Error("Falha ao criar blob da imagem");console.log("☁️ Fazendo upload para Firebase Storage...");const i=await se(s,r);console.log("✅ Imagem PNG da ficha naval enviada:",i);const n=await y(r);return{pngUrl:i,htmlUrl:n}}catch(e){console.error("💥 Erro ao capturar ficha naval PNG:",e);try{return console.log("🔄 Tentando método alternativo (HTML apenas)..."),{pngUrl:null,htmlUrl:await y(r)}}catch(t){return console.error("💥 Erro no fallback:",t),{pngUrl:null,htmlUrl:null}}}}async function se(r,e){const t=window.firebase.storage(),a=new Date().toISOString().replace(/[:.]/g,"-"),s=`naval-sheets/${e.design.name}_${a}.png`;console.log("📁 Nome do arquivo:",s);const i=t.ref().child(s);console.log("📤 Iniciando upload...");const n=await i.put(r);console.log("✅ Upload concluído:",n.totalBytes,"bytes");const l=await n.ref.getDownloadURL();return console.log("🔗 URL de download obtida:",l),l}async function y(r){try{const e=ae(r),t=new Blob([e],{type:"text/html"}),a=window.firebase.storage(),s=new Date().toISOString().replace(/[:.]/g,"-"),i=`naval-sheets/${r.design.name}_${s}.html`,o=await(await a.ref().child(i).put(t)).ref.getDownloadURL();return console.log("📄 HTML da ficha naval salvo:",o),o}catch(e){return console.error("❌ Erro ao salvar HTML da ficha naval:",e),null}}function ae(r){const{design:e,performance:t,costs:a}=r,s=window.NAVAL_COMPONENTS?.hulls[e.hull];return`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ficha Naval - ${e.name}</title>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; background: #1e293b; color: #e2e8f0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .section { background: #334155; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
            .title { color: #3b82f6; font-size: 24px; margin-bottom: 20px; }
            .subtitle { color: #10b981; font-size: 18px; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .stat { display: flex; justify-content: space-between; margin: 4px 0; }
            .stat-label { color: #94a3b8; }
            .stat-value { color: #e2e8f0; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1 class="title">⚓ ${e.name}</h1>
            
            <div class="section">
                <h2 class="subtitle">📋 Informações Básicas</h2>
                <div class="stat">
                    <span class="stat-label">Classe:</span>
                    <span class="stat-value">${s?.name||"Desconhecido"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Deslocamento:</span>
                    <span class="stat-value">${t?.totalDisplacement||"N/A"} t</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Velocidade Máxima:</span>
                    <span class="stat-value">${t?.maxSpeed||"N/A"} nós</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Tripulação:</span>
                    <span class="stat-value">${t?.crewSize||"N/A"}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">💰 Custos</h2>
                <div class="stat">
                    <span class="stat-label">Custo de Produção:</span>
                    <span class="stat-value">$${a?.production?.toLocaleString()||"N/A"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Custo Total:</span>
                    <span class="stat-value">$${a?.total_ownership?.toLocaleString()||"N/A"}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">⚔️ Armamento</h2>
                <div class="stat">
                    <span class="stat-label">Armas Principais:</span>
                    <span class="stat-value">${e.main_guns?.length||0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Mísseis:</span>
                    <span class="stat-value">${e.missiles?.length||0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Armamento AA:</span>
                    <span class="stat-value">${e.aa_guns?.length||0}</span>
                </div>
            </div>
            
            <div class="section">
                <h2 class="subtitle">📊 Performance</h2>
                <div class="stat">
                    <span class="stat-label">Rating AA:</span>
                    <span class="stat-value">${t?.aaRating||"N/A"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Manobrabilidade:</span>
                    <span class="stat-value">${t?.maneuverability||"N/A"}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">Estabilidade:</span>
                    <span class="stat-value">${t?.stability||"N/A"}</span>
                </div>
            </div>
            
            <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 32px;">
                Ficha gerada automaticamente pelo Sistema Naval WAR 1954<br>
                ${new Date().toLocaleString("pt-BR")}
            </p>
        </div>
    </body>
    </html>
    `}document.addEventListener("DOMContentLoaded",async()=>{console.log("🚢 Starting Naval Creator initialization..."),await window.navalCreator.initialize()});console.log("✅ Naval Creator main system loaded");
