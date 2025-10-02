const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-COmVF2I9.js","assets/preload-helper-f85Crcwt.js"])))=>i.map(i=>d[i]);
import{_ as ie}from"./preload-helper-f85Crcwt.js";/* empty css             */import{a as _,f as E,h,g as te}from"./firebase-COmVF2I9.js";import{E as Ee}from"./economicCalculations-B3VHt63F.js";import{C as Ce}from"./consumerGoodsCalculator-Cxcetyr8.js";import{R as ne}from"./resourceConsumptionCalculator-m-978Loo.js";import{R as le}from"./resourceProductionCalculator-DqTGEJNK.js";import{S as de}from"./shipyardSystem-D1VpDWbG.js";import{g as se}from"./renderer-BtQJoiIH.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";class $e{constructor(){this.collections={offers:"marketplace_offers",transactions:"marketplace_transactions",embargoes:"marketplace_embargoes",orders:"marketplace_orders"}}getOfferSchema(){return{id:"string",type:"string",category:"string",title:"string",description:"string",item_id:"string",item_name:"string",quantity:"number",unit:"string",price_per_unit:"number",total_value:"number",country_id:"string",country_name:"string",country_flag:"string",player_id:"string",status:"string",created_at:"timestamp",updated_at:"timestamp",expires_at:"timestamp",min_quantity:"number",max_quantity:"number",delivery_time_days:"number",views:"number",interested_countries:"array",tech_level_required:"number",diplomatic_status_required:"string"}}getTransactionSchema(){return{id:"string",offer_id:"string",seller_country_id:"string",seller_country_name:"string",seller_player_id:"string",buyer_country_id:"string",buyer_country_name:"string",buyer_player_id:"string",item_id:"string",item_name:"string",quantity:"number",unit:"string",price_per_unit:"number",total_value:"number",status:"string",created_at:"timestamp",confirmed_at:"timestamp",completed_at:"timestamp",delivery_deadline:"timestamp",status_history:"array",delivery_time_days:"number",delivery_status:"string",negotiated_price:"boolean",original_price_per_unit:"number",discount_percent:"number"}}getEmbargoSchema(){return{id:"string",embargo_country_id:"string",embargo_country_name:"string",target_country_id:"string",target_country_name:"string",type:"string",categories_blocked:"array",reason:"string",created_at:"timestamp",expires_at:"timestamp",status:"string",created_by_player_id:"string",notifications_sent:"boolean"}}getOrderSchema(){return{id:"string",country_id:"string",country_name:"string",player_id:"string",type:"string",item_id:"string",item_name:"string",category:"string",quantity:"number",unit:"string",max_price_per_unit:"number",min_price_per_unit:"number",is_recurring:"boolean",recurrence_type:"string",recurrence_interval:"number",max_executions:"number",executions_count:"number",status:"string",created_at:"timestamp",last_execution:"timestamp",next_execution:"timestamp",auto_execute:"boolean",require_confirmation:"boolean",execution_history:"array"}}async createOffer(e){try{const a=_.currentUser;if(!a)throw new Error("Usuário não autenticado");const s=await E(a.uid);if(!s)throw new Error("Jogador não associado a um país");const i=await this.validateOfferData(e,s,a.uid),o={...i,country_id:s,player_id:a.uid,created_at:new Date,updated_at:new Date,expires_at:new Date(Date.now()+i.duration_days*24*60*60*1e3),status:"active",views:0,interested_countries:[]},r=await h.collection(this.collections.offers).add(o);return{success:!0,offerId:r.id,offer:{id:r.id,...o}}}catch(a){return console.error("Erro ao criar oferta:",a),{success:!1,error:a.message}}}async validateOfferData(e,a,s){if(!e.type||!["sell","buy"].includes(e.type))throw new Error("Tipo de oferta inválido");if(!e.category||!["resources","vehicles","naval"].includes(e.category))throw new Error("Categoria inválida");if(!e.title||e.title.trim().length<3)throw new Error("Título deve ter pelo menos 3 caracteres");if(!e.quantity||e.quantity<=0)throw new Error("Quantidade deve ser maior que zero");if(!e.price_per_unit||e.price_per_unit<=0)throw new Error("Preço deve ser maior que zero");const i=await h.collection("paises").doc(a).get();if(!i.exists)throw new Error("País não encontrado");const o=i.data();e.type==="sell"?(await this.validateSellOfferAvailability(e,a),await this.validateSellOffer(e,o)):await this.validateBuyOffer(e,o);const r=e.quantity*e.price_per_unit;return{type:e.type,category:e.category,title:e.title.trim(),description:(e.description||"").trim(),item_id:e.item_id,item_name:e.item_name,quantity:e.quantity,unit:e.unit,price_per_unit:e.price_per_unit,total_value:r,country_name:o.Pais,country_flag:o.Flag||"🏳️",delivery_time_days:e.delivery_time_days||30,min_quantity:e.min_quantity||1,max_quantity:e.max_quantity||e.quantity,tech_level_required:e.tech_level_required||0,duration_days:e.duration_days||30}}async validateSellOffer(e,a){if(e.category!=="resources"){if(e.category==="vehicles"||e.category==="naval"){const s=await h.collection("inventory").doc(a.id||e.country_id).get();s.exists&&s.data()}}}async validateBuyOffer(e,a){const s=this.calculateCountryBudget(a),i=e.quantity*e.price_per_unit;if(s<i)throw new Error(`Orçamento insuficiente. Necessário: $${i.toLocaleString()}, Disponível: $${s.toLocaleString()}`)}calculateCountryBudget(e){const a=parseFloat(e.PIB)||0,s=(parseFloat(e.Burocracia)||0)/100,i=(parseFloat(e.Estabilidade)||0)/100;return a*.25*s*(i*1.5)}async getOffers(e={}){try{const a=h.collection(this.collections.offers);let s=[],i;try{console.info("🔍 Buscando ofertas usando filtragem client-side (sem índices)"),i=await a.get()}catch(l){console.warn("Falha ao buscar todos os documentos, tentando listagem:",l);try{const c=(await a.listDocuments()).slice(0,100).map(b=>b.get()),m=await Promise.all(c);i={docs:m.filter(b=>b.exists),size:m.filter(b=>b.exists).length,empty:m.filter(b=>b.exists).length===0,forEach:function(b){this.docs.forEach(b)}}}catch(n){console.warn("Listagem de documentos falhou, retornando resultados vazios:",n),i={docs:[],size:0,empty:!0,forEach:function(){}}}}i.forEach(l=>{const n=l.data();if(n.status!=="active")return;const c=n.expires_at?.toDate?n.expires_at.toDate():new Date(n.expires_at);c&&c<=new Date||s.push({id:l.id,...n})});let o=s;if(e.category&&e.category!=="all"&&(o=o.filter(l=>l.category===e.category)),e.type&&e.type!=="all"&&(o=o.filter(l=>l.type===e.type)),e.seller_id&&(o=o.filter(l=>l.seller_id===e.seller_id)),e.buyer_id&&(o=o.filter(l=>l.buyer_id===e.buyer_id)),e.searchTerm){const l=e.searchTerm.toLowerCase();o=o.filter(n=>n.title&&n.title.toLowerCase().includes(l)||n.description&&n.description.toLowerCase().includes(l)||n.item_name&&n.item_name.toLowerCase().includes(l)||n.country_name&&n.country_name.toLowerCase().includes(l))}e.priceMin!==null&&e.priceMin!==void 0&&(o=o.filter(l=>l.price_per_unit>=e.priceMin)),e.priceMax!==null&&e.priceMax!==void 0&&(o=o.filter(l=>l.price_per_unit<=e.priceMax)),e.quantityMin!==null&&e.quantityMin!==void 0&&(o=o.filter(l=>l.quantity>=e.quantityMin)),e.quantityMax!==null&&e.quantityMax!==void 0&&(o=o.filter(l=>l.quantity<=e.quantityMax));const r=e.orderBy||"created_at",d=e.orderDirection||"desc";if(o.sort((l,n)=>{let c=l[r],m=n[r];return r.includes("_at")&&c&&m&&(c=c.toDate?c.toDate():new Date(c),m=m.toDate?m.toDate():new Date(m)),typeof c=="string"&&!isNaN(c)&&(c=parseFloat(c)),typeof m=="string"&&!isNaN(m)&&(m=parseFloat(m)),d==="desc"?m>c?1:m<c?-1:0:c>m?1:c<m?-1:0}),e.countryFilter&&(o=o.filter(l=>l.country_id===e.countryFilter)),e.timeFilter!==null&&e.timeFilter!==void 0){const l=new Date,n=new Date(l.getTime()+e.timeFilter*24*60*60*1e3);o=o.filter(c=>(c.expires_at?.toDate?c.expires_at.toDate():new Date(c.expires_at))<=n)}return o=await this.filterEmbargoedOffers(o,e.current_country_id),e.limit&&o.length>e.limit&&(o=o.slice(0,e.limit)),console.info(`✅ Ofertas filtradas: ${o.length} encontradas usando filtragem client-side`),{success:!0,offers:o,total:o.length,totalCount:o.length}}catch(a){return console.error("Erro ao buscar ofertas:",a),{success:!1,error:a.message,offers:[]}}}async filterEmbargoedOffers(e,a){if(!a)return e;try{const s=await h.collection(this.collections.embargoes).where("status","==","active").where("target_country_id","==",a).get(),i=[];return s.forEach(o=>{i.push(o.data())}),i.length===0?e:e.filter(o=>{const r=i.find(d=>d.embargo_country_id===o.country_id);return r?r.type==="full"?!1:r.type==="partial"&&r.categories_blocked?!r.categories_blocked.includes(o.category):!0:!0})}catch(s){return console.error("Erro ao verificar embargos:",s),e}}async incrementOfferViews(e){try{const a=h.collection(this.collections.offers).doc(e),s=await a.get();if(s.exists){const i=s.data().views||0;await a.update({views:i+1,updated_at:new Date})}}catch(a){console.error("Erro ao incrementar visualizações:",a)}}async createTransaction(e,a){try{const s=_.currentUser;if(!s)throw new Error("Usuário não autenticado");const i=await E(s.uid);if(!i)throw new Error("Jogador não associado a um país");const o=await h.collection(this.collections.offers).doc(e).get();if(!o.exists)throw new Error("Oferta não encontrada");const r=o.data();if(r.status!=="active")throw new Error("Oferta não está ativa");const d=a.quantity||r.quantity;if(d>r.quantity)throw new Error("Quantidade solicitada excede disponível");if(d<r.min_quantity)throw new Error(`Quantidade mínima: ${r.min_quantity}`);if(d>r.max_quantity)throw new Error(`Quantidade máxima: ${r.max_quantity}`);const n=(await h.collection("paises").doc(i).get()).data(),c=d*r.price_per_unit;if(this.calculateCountryBudget(n)<c)throw new Error("Orçamento insuficiente");const b={offer_id:e,seller_country_id:r.country_id,seller_country_name:r.country_name,seller_player_id:r.player_id,buyer_country_id:i,buyer_country_name:n.Pais,buyer_player_id:s.uid,item_id:r.item_id,item_name:r.item_name,quantity:d,unit:r.unit,price_per_unit:r.price_per_unit,total_value:c,status:"pending",created_at:new Date,delivery_deadline:new Date(Date.now()+r.delivery_time_days*24*60*60*1e3),delivery_time_days:r.delivery_time_days,delivery_status:"pending",status_history:[{status:"pending",timestamp:new Date,note:"Transação criada"}],negotiated_price:!1,original_price_per_unit:r.price_per_unit,discount_percent:0},v=await h.collection(this.collections.transactions).add(b);return await h.collection(this.collections.offers).doc(e).update({quantity:r.quantity-d,updated_at:new Date,status:r.quantity-d===0?"completed":"active"}),{success:!0,transactionId:v.id,transaction:{id:v.id,...b}}}catch(s){return console.error("Erro ao criar transação:",s),{success:!1,error:s.message}}}async applyEmbargo(e){try{const a=_.currentUser;if(!a)throw new Error("Usuário não autenticado");const s=await E(a.uid);if(!s)throw new Error("Jogador não associado a um país");const o=(await h.collection("paises").doc(s).get()).data(),r=await h.collection("paises").doc(e.target_country_id).get();if(!r.exists)throw new Error("País alvo não encontrado");const d=r.data();if(!(await h.collection(this.collections.embargoes).where("embargo_country_id","==",s).where("target_country_id","==",e.target_country_id).where("status","==","active").get()).empty)throw new Error("Já existe um embargo ativo contra este país");const n={embargo_country_id:s,embargo_country_name:o.Pais,target_country_id:e.target_country_id,target_country_name:d.Pais,type:e.type||"full",categories_blocked:e.categories_blocked||[],reason:e.reason||"Motivos diplomáticos",created_at:new Date,expires_at:e.expires_at||null,status:"active",created_by_player_id:a.uid,notifications_sent:!1},c=await h.collection(this.collections.embargoes).add(n);return await this.sendEmbargoNotification(n,c.id),{success:!0,embargoId:c.id,embargo:{id:c.id,...n}}}catch(a){return console.error("Erro ao aplicar embargo:",a),{success:!1,error:a.message}}}async sendEmbargoNotification(e,a){try{const s={type:"embargo_applied",embargo_id:a,target_country_id:e.target_country_id,target_country_name:e.target_country_name,embargo_country_id:e.embargo_country_id,embargo_country_name:e.embargo_country_name,embargo_type:e.type,categories_blocked:e.categories_blocked||[],reason:e.reason,created_at:new Date,read:!1,expires_at:e.expires_at,title:`🚫 Embargo Aplicado por ${e.embargo_country_name}`,message:this.getEmbargoNotificationMessage(e),priority:"high"};await h.collection("notifications").add(s),await h.collection(this.collections.embargoes).doc(a).update({notifications_sent:!0}),console.log(`Notificação de embargo enviada para ${e.target_country_name}`)}catch(s){console.error("Erro ao enviar notificação de embargo:",s)}}getEmbargoNotificationMessage(e){const a=e.type==="full"?"total":"parcial";let s=`${e.embargo_country_name} aplicou um embargo ${a} contra seu país.`;if(e.type==="partial"&&e.categories_blocked&&e.categories_blocked.length>0){const i={resources:"Recursos",vehicles:"Veículos",naval:"Naval"},o=e.categories_blocked.map(r=>i[r]||r);s+=` Categorias bloqueadas: ${o.join(", ")}.`}else e.type==="full"&&(s+=" Todas as trocas comerciais estão bloqueadas.");if(e.reason&&e.reason!=="Motivos diplomáticos"&&(s+=` Motivo: ${e.reason}`),e.expires_at){const i=new Date(e.expires_at),o=Math.ceil((i-new Date)/(1440*60*1e3));s+=` O embargo expira em ${o} dias.`}else s+=" O embargo é por tempo indefinido.";return s}async getEmbargoNotifications(e,a=10){try{const s=await h.collection("notifications").where("target_country_id","==",e).where("type","==","embargo_applied").orderBy("created_at","desc").limit(a).get(),i=[];return s.forEach(o=>{i.push({id:o.id,...o.data()})}),{success:!0,notifications:i}}catch(s){return console.error("Erro ao buscar notificações:",s),{success:!1,error:s.message,notifications:[]}}}async markNotificationAsRead(e){try{return await h.collection("notifications").doc(e).update({read:!0,read_at:new Date}),{success:!0}}catch(a){return console.error("Erro ao marcar notificação como lida:",a),{success:!1,error:a.message}}}async getCountryInventory(e){try{const a=await h.collection("inventory").doc(e).get();return a.exists?a.data():{}}catch(a){return console.error("Erro ao buscar inventário:",a),{}}}async getCountryData(e){try{const a=await h.collection("paises").doc(e).get();return a.exists?{id:e,...a.data()}:null}catch(a){return console.error("Erro ao buscar dados do país:",a),null}}calculateAvailableResources(e){console.log("🔍 Debug: Dados do país recebidos:",e),console.log("📊 Usando recursos REAIS do dashboard (não calculados)"),console.log("🔍 Recursos reais no país:"),console.log("  - Carvao:",e.Carvao),console.log("  - Combustivel:",e.Combustivel),console.log("  - Metais:",e.Metais),console.log("  - Graos:",e.Graos);const a={Carvao:Math.max(0,Math.floor((parseFloat(e.Carvao)||0)*.5)),Combustivel:Math.max(0,Math.floor((parseFloat(e.Combustivel)||0)*.5)),Metais:Math.max(0,Math.floor((parseFloat(e.Metais)||0)*.5)),Graos:Math.max(0,Math.floor((parseFloat(e.Graos)||0)*.5))};return console.log("📦 Recursos REAIS disponíveis para venda (50% do estoque):",a),a}getAvailableEquipment(e){const a=[];return Object.keys(e).forEach(s=>{typeof e[s]=="object"&&e[s]!==null&&Object.keys(e[s]).forEach(i=>{const o=e[s][i];if(o&&typeof o=="object"&&o.quantity>0){const r=Math.floor(o.quantity*.5);r>0&&a.push({id:`${s}_${i}`.toLowerCase().replace(/\s+/g,"_"),name:i,category:s,available_quantity:r,total_quantity:o.quantity,unit_cost:o.cost||0,maintenance_cost:(o.cost||0)*.05||0,type:this.getEquipmentType(s)})}})}),a}getEquipmentType(e){return["Couraçados","Cruzadores","Destróieres","Fragatas","Corvetas","Submarinos","Porta-aviões","Patrulhas","Auxiliares","Naval - Outros"].includes(e)?"naval":"vehicles"}async validateSellOfferAvailability(e,a){const s=await this.getCountryData(a);if(!s)throw new Error("Dados do país não encontrados");return e.category==="resources"?this.validateResourceAvailability(e,s):this.validateEquipmentAvailability(e,a)}validateResourceAvailability(e,a){const s=this.calculateAvailableResources(a),o={steel_high_grade:"Metais",steel_standard:"Metais",oil_crude:"Combustivel",oil_aviation:"Combustivel",aluminum:"Metais",copper:"Metais",rare_metals:"Metais",coal:"Carvao",food:"Graos"}[e.item_id];if(!o)throw new Error("Tipo de recurso não reconhecido");const r=s[o]||0;if(e.quantity>r)throw new Error(`Quantidade insuficiente. Disponível para venda: ${r.toLocaleString()} unidades de ${o}`);return{valid:!0,available:r,resourceType:o}}async validateEquipmentAvailability(e,a){const s=await this.getCountryInventory(a),o=this.getAvailableEquipment(s).find(r=>r.id===e.item_id);if(!o)throw new Error(`Equipamento "${e.item_name}" não encontrado no inventário ou indisponível para venda`);if(e.quantity>o.available_quantity)throw new Error(`Quantidade insuficiente. Disponível para venda: ${o.available_quantity} de ${o.total_quantity} unidades totais`);return{valid:!0,equipment:o,availableQuantity:o.available_quantity,totalQuantity:o.total_quantity}}async createTestOffers(){try{console.log("🧪 Criando ofertas de teste...");const e=[{type:"sell",category:"resources",title:"Aço de Alta Qualidade",description:"Aço especializado para construção naval e industrial",item_id:"steel_high_grade",item_name:"Aço de Alta Qualidade",quantity:5e3,unit:"toneladas",price_per_unit:850,total_value:5e3*850,country_id:"test_country_1",country_name:"Estados Unidos",country_flag:"🇺🇸",player_id:"test_player_1",status:"active",created_at:new Date,updated_at:new Date,expires_at:new Date(Date.now()+10080*60*1e3),delivery_time_days:30,min_quantity:100,max_quantity:5e3,views:23,interested_countries:[]},{type:"buy",category:"vehicles",title:"Tanques MBT Modernos",description:"Procurando tanques de batalha principais para modernização das forças armadas",item_id:"mbt_modern",item_name:"Tanque MBT Moderno",quantity:50,unit:"unidades",price_per_unit:25e5,total_value:50*25e5,country_id:"test_country_2",country_name:"Brasil",country_flag:"🇧🇷",player_id:"test_player_2",status:"active",created_at:new Date(Date.now()-1440*60*1e3),updated_at:new Date(Date.now()-1440*60*1e3),expires_at:new Date(Date.now()+336*60*60*1e3),delivery_time_days:45,min_quantity:5,max_quantity:50,views:45,interested_countries:[]},{type:"sell",category:"naval",title:"Destroyers Classe Fletcher",description:"Destroyers modernizados, prontos para serviço imediato",item_id:"destroyer_fletcher",item_name:"Destroyer Classe Fletcher",quantity:3,unit:"navios",price_per_unit:18e7,total_value:3*18e7,country_id:"test_country_3",country_name:"Reino Unido",country_flag:"🇬🇧",player_id:"test_player_3",status:"active",created_at:new Date(Date.now()-4320*60*1e3),updated_at:new Date(Date.now()-4320*60*1e3),expires_at:new Date(Date.now()+504*60*60*1e3),delivery_time_days:60,min_quantity:1,max_quantity:3,views:67,interested_countries:[]},{type:"sell",category:"resources",title:"Petróleo Refinado",description:"Combustível de alta octanagem para aviação militar",item_id:"oil_aviation",item_name:"Petróleo de Aviação",quantity:1e4,unit:"barris",price_per_unit:120,total_value:1e4*120,country_id:"test_country_4",country_name:"Arábia Saudita",country_flag:"🇸🇦",player_id:"test_player_4",status:"active",created_at:new Date(Date.now()-2880*60*1e3),updated_at:new Date(Date.now()-2880*60*1e3),expires_at:new Date(Date.now()+14400*60*1e3),delivery_time_days:15,min_quantity:500,max_quantity:1e4,views:89,interested_countries:[]},{type:"buy",category:"naval",title:"Submarinos Diesel-Elétricos",description:"Necessitamos de submarinos para patrulha costeira",item_id:"submarine_diesel",item_name:"Submarino Diesel-Elétrico",quantity:2,unit:"submarinos",price_per_unit:45e6,total_value:2*45e6,country_id:"test_country_5",country_name:"Argentina",country_flag:"🇦🇷",player_id:"test_player_5",status:"active",created_at:new Date(Date.now()-5760*60*1e3),updated_at:new Date(Date.now()-5760*60*1e3),expires_at:new Date(Date.now()+720*60*60*1e3),delivery_time_days:90,min_quantity:1,max_quantity:2,views:12,interested_countries:[]}];for(const a of e)await h.collection(this.collections.offers).add(a);return console.log(`✅ ${e.length} ofertas de teste criadas com sucesso!`),{success:!0,count:e.length}}catch(e){return console.error("❌ Erro ao criar ofertas de teste:",e),{success:!1,error:e.message}}}async clearTestOffers(){try{console.log("🗑️ Removendo ofertas de teste...");const e=await h.collection(this.collections.offers).where("player_id",">=","test_player_").where("player_id","<","test_player_z").get(),a=h.batch();return e.docs.forEach(s=>{a.delete(s.ref)}),await a.commit(),console.log(`✅ ${e.docs.length} ofertas de teste removidas!`),{success:!0,count:e.docs.length}}catch(e){return console.error("❌ Erro ao remover ofertas de teste:",e),{success:!1,error:e.message}}}}function Me(t){return t<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:t<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:t<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function S(t){if(!t||isNaN(t))return"0";const e=parseFloat(t);return e>=1e9?(e/1e9).toFixed(1)+"B":e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(0)+"K":Math.round(e).toLocaleString("pt-BR")}function C(t){if(!t)return"US$ 0";const e=parseFloat(t);return e>=1e9?"US$ "+(e/1e9).toFixed(1)+"B":e>=1e6?"US$ "+(e/1e6).toFixed(1)+"M":e>=1e3?"US$ "+(e/1e3).toFixed(1)+"K":"US$ "+e.toLocaleString()}function w(t){const e=parseFloat(t)||0;return e===0?"US$ 0":e>=1e9?`US$ ${(e/1e9).toFixed(1)}bi`:e>=1e6?`US$ ${(e/1e6).toFixed(1)}mi`:e>=1e3?`US$ ${(e/1e3).toFixed(1)}mil`:`US$ ${Math.round(e)}`}function qe(t){const e=parseFloat(t.WarPower)||0;return Math.round(e)}function O(t){const e=parseFloat(t.PIB)||0,a=(parseFloat(t.Burocracia)||0)/100,s=(parseFloat(t.Estabilidade)||0)/100;return e*.25*a*(s*1.5)}function ce(t){const e=O(t),a=(parseFloat(t.MilitaryBudgetPercent)||30)/100;return e*a}function ue(t){const e=(parseFloat(t.MilitaryDistributionVehicles)||40)/100,a=(parseFloat(t.MilitaryDistributionAircraft)||30)/100,s=(parseFloat(t.MilitaryDistributionNaval)||30)/100;return{vehicles:e,aircraft:a,naval:s,maintenancePercent:.15}}function ke(t){const s=(parseFloat(t.MilitaryBudgetPercent)||30)-30;let i=0,o=0;return s>0&&(i=Math.floor(s/2)*-1,o=s*-.5),{stabilityPenalty:i,economicPenalty:o,isOverBudget:s>0}}function K(t){const e=ce(t),a=ue(t),s=e*(1-a.maintenancePercent),i=(parseFloat(t.Tecnologia)||0)/100,o=(parseFloat(t.IndustrialEfficiency)||30)/100,r=(parseFloat(t.Marinha)||0)/100,d=(parseFloat(t.Urbanizacao)||0)/100;return s*a.naval*i*o*r*d}function Ie(t){Ee.computeEnergyDemandGW(t);const e=Ce.calculateConsumerGoods(t),a=ne.calculateCountryConsumption(t),s=le.calculateCountryProduction(t),i={Carvao:Math.round((s.Carvao||0)-(a.Carvao||0)),Combustivel:Math.round((s.Combustivel||0)-(a.Combustivel||0)),Metais:Math.round((s.Metais||0)-(a.Metais||0)),Graos:Math.round((s.Graos||0)-(a.Graos||0)),Energia:Math.round((s.Energia||0)-(a.Energia||0))},o=Me(parseFloat(t.Estabilidade)||0),r=qe(t),d=(parseFloat(t.PIB)||0)/(parseFloat(t.Populacao)||1),l=O(t),n=ce(t),c=ue(t),m=n*c.vehicles,b=n*c.aircraft,v=n*c.naval,y=ke(t);return`
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <!-- Header -->
      <div class="border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 rounded border border-slate-600 overflow-hidden grid place-items-center bg-slate-800">
                ${se(t.Pais,"w-full h-full")}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-100">${t.Pais}</h1>
                <p class="text-sm text-slate-400">${t.ModeloPolitico||"Sistema Político"}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">War Power</div>
                <div class="text-2xl font-bold text-red-400">${S(r)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">PIB per capita</div>
                <div class="text-lg font-semibold text-emerald-400">${C(d)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">Estabilidade</div>
                <div class="text-lg font-semibold text-slate-200">${Math.round(t.Estabilidade||0)}%</div>
              </div>
              <div class="px-3 py-1 rounded-lg border ${o.tone}">
                <span class="text-sm font-medium">${o.label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="max-w-7xl mx-auto px-6">
        <div class="border-b border-slate-800/50">
          <nav class="flex space-x-8" aria-label="Tabs">
            <button class="dashboard-tab active border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-400" data-tab="overview">
              📊 Visão Geral
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="resources">
              ⛏️ Recursos
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="vehicles">
              🚗 Veículos
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="aircraft">
              ✈️ Aeronáutica
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="naval">
              🚢 Marinha
            </button>
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="market">
              🌍 Mercado Internacional
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Contents -->
      <div class="max-w-7xl mx-auto px-6 py-6">

        <!-- Overview Tab -->
        <div id="tab-overview" class="dashboard-tab-content">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <!-- Economic Overview -->
            <div class="lg:col-span-2 space-y-6">
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">💰 Economia</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">PIB Total</div>
                    <div class="text-xl font-bold text-slate-100">${w(t.PIB)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Orçamento</div>
                    <div class="text-xl font-bold text-emerald-400">${w(l)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">População</div>
                    <div class="text-xl font-bold text-slate-100">${S(t.Populacao)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Tecnologia</div>
                    <div class="text-xl font-bold text-blue-400">${Math.round(t.Tecnologia||0)}</div>
                  </div>
                </div>
              </div>

              <!-- Consumer Goods -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🛍️ Bens de Consumo</h3>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-slate-400">Satisfação da População</span>
                  <span class="text-sm font-semibold text-slate-200">${e.level}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-3 mb-3">
                  <div class="h-3 rounded-full transition-all duration-300 ${e.level>=70?"bg-gradient-to-r from-emerald-500 to-green-400":e.level>=50?"bg-gradient-to-r from-yellow-500 to-amber-400":"bg-gradient-to-r from-red-500 to-rose-400"}" style="width: ${Math.min(e.level,100)}%"></div>
                </div>
                <div class="text-xs text-slate-500">
                  Produção: ${S(e.production)} •
                  Demanda: ${S(e.demand)} •
                  Efeito Estabilidade: <span class="${e.metadata.stabilityEffect>0?"text-green-400":e.metadata.stabilityEffect<0?"text-red-400":"text-slate-400"}">${e.metadata.stabilityEffect>0?"+":""}${e.metadata.stabilityEffect}%</span>
                </div>
              </div>

              <!-- Military Budget Control -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🏛️ Controle do Orçamento Militar</h3>

                <!-- Total Military Budget Control -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-slate-400">Percentual do PIB para Defesa</span>
                    <span class="text-lg font-bold text-emerald-400">${w(n)}</span>
                  </div>

                  <div class="mb-3">
                    <label class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-slate-300">Orçamento Militar: <span id="budget-display">${parseFloat(t.MilitaryBudgetPercent)||30}</span>%</span></span>
                      <button onclick="saveMilitaryBudget(event)" class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors">Salvar</button>
                    </label>
                    <input
                      type="range"
                      id="military-budget-slider"
                      min="20"
                      max="50"
                      step="1"
                      value="${parseFloat(t.MilitaryBudgetPercent)||30}"
                      class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      oninput="updateBudgetDisplay(this.value)"
                    >
                    <div class="flex justify-between text-xs text-slate-500 mt-1">
                      <span>20% (Mínimo)</span>
                      <span>50% (Máximo)</span>
                    </div>
                  </div>

                  ${y.isOverBudget?`
                    <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                      <div class="text-xs text-red-400">
                        ⚠️ <strong>Gastos militares excessivos!</strong><br>
                        Penalidade de estabilidade: ${y.stabilityPenalty}%<br>
                        Impacto econômico: ${y.economicPenalty}% no crescimento
                      </div>
                    </div>
                  `:""}
                </div>

                <!-- Military Distribution Control -->
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-semibold text-slate-300">Distribuição do Orçamento Militar</h4>
                    <button onclick="saveMilitaryDistribution(event)" class="text-xs bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg transition-colors">Salvar Distribuição</button>
                  </div>

                  <!-- Total Display -->
                  <div class="bg-slate-700/30 rounded-lg p-3 text-center">
                    <div class="text-xs text-slate-400 mb-1">Total Alocado</div>
                    <div class="text-lg font-bold" id="total-distribution-display">100%</div>
                  </div>

                  <!-- Vehicles -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">🚗</span>
                        <span class="text-sm font-medium text-slate-200">Veículos Terrestres</span>
                      </div>
                      <span class="text-sm font-bold text-blue-400"><span id="vehicles-display">${Math.round(c.vehicles*100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="vehicles-slider"
                      min="10"
                      max="80"
                      step="5"
                      value="${Math.round(c.vehicles*100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('vehicles')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="vehicles-amount">${w(n*c.vehicles)}</span></div>
                  </div>

                  <!-- Aircraft -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">✈️</span>
                        <span class="text-sm font-medium text-slate-200">Força Aérea</span>
                      </div>
                      <span class="text-sm font-bold text-cyan-400"><span id="aircraft-display">${Math.round(c.aircraft*100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="aircraft-slider"
                      min="10"
                      max="80"
                      step="5"
                      value="${Math.round(c.aircraft*100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('aircraft')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="aircraft-amount">${w(n*c.aircraft)}</span></div>
                  </div>

                  <!-- Naval -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">🚢</span>
                        <span class="text-sm font-medium text-slate-200">Marinha de Guerra</span>
                      </div>
                      <span class="text-sm font-bold text-purple-400"><span id="naval-display">${Math.round(c.naval*100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="naval-slider"
                      min="10"
                      max="80"
                      step="5"
                      value="${Math.round(c.naval*100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('naval')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="naval-amount">${w(n*c.naval)}</span></div>
                  </div>


                  <div class="text-xs text-slate-500 bg-slate-800/20 rounded p-2">
                    💡 <strong>Dica:</strong> Ajuste a distribuição conforme sua estratégia militar. Mais investimento em uma área = maior capacidade de produção nessa área.
                  </div>
                </div>
              </div>

              <!-- Resource Summary -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">📈 Balanço de Recursos</h3>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                  ${Object.entries(i).map(([x,u])=>{const p={Carvao:"🪨",Combustivel:"⛽",Metais:"🔩",Graos:"🌾",Energia:"⚡"},f={Carvao:"Carvão",Combustivel:"Combustível",Metais:"Metais",Graos:"Grãos",Energia:"Energia"},g=x==="Energia"?"MW":"";return`
                      <div class="text-center">
                        <div class="text-lg mb-1">${p[x]}</div>
                        <div class="text-xs text-slate-400 mb-1">${f[x]}</div>
                        <div class="text-sm font-bold ${u>=0?"text-emerald-400":"text-red-400"}">
                          ${u>=0?"+":""}${S(u)}${g}
                        </div>
                      </div>
                    `}).join("")}
                </div>
              </div>

              <!-- Production Capacities -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🏭 Capacidades de Produção</h3>
                <div class="space-y-3">
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🚗</span>
                      <span class="text-sm text-slate-300">Veículos Terrestres</span>
                    </div>
                    <span class="text-sm font-semibold text-blue-400">${w(m)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">✈️</span>
                      <span class="text-sm text-slate-300">Aeronaves</span>
                    </div>
                    <span class="text-sm font-semibold text-cyan-400">${w(b)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🚢</span>
                      <span class="text-sm text-slate-300">Embarcações</span>
                    </div>
                    <span class="text-sm font-semibold text-purple-400">${w(v)}/turno</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Country Info Sidebar -->
            <div class="space-y-6">
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <div class="aspect-[3/2] rounded-lg overflow-hidden mb-4 grid place-items-center bg-slate-800">
                  ${se(t.Pais,"w-full h-full")}
                </div>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-400">Urbanização</span>
                    <span class="text-sm font-medium text-slate-200">${Math.round(t.Urbanizacao||0)}%</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-400">Burocracia</span>
                    <span class="text-sm font-medium text-slate-200">${Math.round(t.Burocracia||0)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-slate-400">Eficiência Industrial</span>
                    <span class="text-sm font-medium text-slate-200">${Math.round(t.IndustrialEfficiency||0)}%</span>
                  </div>
                </div>
              </div>

              <!-- Ferramentas de Design -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span class="text-xl">🛠️</span>
                  Ferramentas de Design
                </h3>
                <p class="text-sm text-slate-400 mb-6">Crie veículos, aeronaves e navios customizados para seu exército</p>

                <div class="space-y-4">
                  <a href="criador-veiculos-refatorado.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">🚗</span>
                        <div>
                          <div class="font-medium text-slate-200">Criador de Veículos</div>
                          <div class="text-xs text-slate-400">Tanques principais, veículos blindados, SPGs e caça-tanques personalizados</div>
                          <div class="text-xs text-blue-400 mt-1">Tecnologia disponível: ${Math.round(t.Veiculos||0)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">${w(m)}/turno</div>
                      </div>
                    </div>
                  </a>

                  <a href="criador-aeronaves.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">✈️</span>
                        <div>
                          <div class="font-medium text-slate-200">Criador de Aeronaves</div>
                          <div class="text-xs text-slate-400">Caças, bombardeiros e aeronaves de apoio próximo (em desenvolvimento)</div>
                          <div class="text-xs text-cyan-400 mt-1">Tecnologia disponível: ${Math.round(t.Aeronautica||0)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">${w(b)}/turno</div>
                      </div>
                    </div>
                  </a>

                  <a href="criador-navios.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">🚢</span>
                        <div>
                          <div class="font-medium text-slate-200">Criador de Navios</div>
                          <div class="text-xs text-slate-400">Destroyers, cruzadores e navios de transporte personalizados (em desenvolvimento)</div>
                          <div class="text-xs text-purple-400 mt-1">Tecnologia disponível: ${Math.round(t.Marinha||0)}</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-slate-200">${w(v)}/turno</div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resources Tab -->
        <div id="tab-resources" class="dashboard-tab-content hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            ${["Carvao","Combustivel","Metais","Graos","Energia"].map(x=>{const u={Carvao:"🪨",Combustivel:"⛽",Metais:"🔩",Graos:"🌾",Energia:"⚡"},p={Carvao:"Carvão",Combustivel:"Combustível",Metais:"Metais",Graos:"Grãos",Energia:"Energia"},f=t[`Potencial${x}`]||(x==="Energia"?"N/A":"3"),g=Math.round(s[x]||0),q=Math.round(a[x]||0),k=i[x],$=x==="Energia"?"MW":"unidades";return`
                <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">${u[x]}</span>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-200">${p[x]}</h3>
                        ${x!=="Energia"?`<p class="text-sm text-slate-400">Potencial: ${f}/10</p>`:""}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold ${k>=0?"text-emerald-400":"text-red-400"}">
                        ${k>=0?"+":""}${S(k)}
                      </div>
                      <div class="text-xs text-slate-400">${$}/mês</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Produção</div>
                      <div class="text-lg font-semibold text-cyan-400">${S(g)} ${$}</div>
                    </div>
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Consumo</div>
                      <div class="text-lg font-semibold text-amber-400">${S(q)} ${$}</div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-400">Eficiência</span>
                      <span class="text-slate-200">${g>0?Math.round(g/Math.max(q,1)*100):0}%</span>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-2">
                      <div class="h-2 rounded-full ${k>=0?"bg-emerald-500":"bg-red-500"}"
                           style="width: ${Math.min(Math.max(g/Math.max(q,1)*100,0),100)}%"></div>
                    </div>
                  </div>
                </div>
              `}).join("")}
          </div>
        </div>

        <!-- Vehicles Tab -->
        <div id="tab-vehicles" class="dashboard-tab-content hidden">
          <div id="vehicles-inventory-container">
            <!-- Inventory will be loaded here -->
          </div>
        </div>

        <!-- Aircraft Tab -->
        <div id="tab-aircraft" class="dashboard-tab-content hidden">
          <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
            <div class="text-6xl mb-4">✈️</div>
            <h3 class="text-xl font-semibold text-slate-200 mb-2">Sistema Aeronáutico</h3>
            <p class="text-slate-400 mb-4">Gerencie sua força aérea</p>
            <div class="text-sm text-slate-500">Em desenvolvimento...</div>
          </div>
        </div>

        <!-- Naval Tab -->
        <div id="tab-naval" class="dashboard-tab-content hidden">
          <div id="naval-content-container">
            <!-- Naval content will be loaded here -->
          </div>
        </div>

        <!-- Market Tab -->
        <div id="tab-market" class="dashboard-tab-content hidden">
          <div id="marketplace-container">
            <!-- Marketplace content will be loaded here -->
          </div>
        </div>

      </div>
    </div>
  `}function Be(){document.addEventListener("click",t=>{if(t.target.matches(".dashboard-tab")){const e=t.target.dataset.tab;document.querySelectorAll(".dashboard-tab").forEach(a=>{a.classList.remove("active","border-blue-500","text-blue-400"),a.classList.add("border-transparent","text-slate-400")}),t.target.classList.add("active","border-blue-500","text-blue-400"),t.target.classList.remove("border-transparent","text-slate-400"),document.querySelectorAll(".dashboard-tab-content").forEach(a=>{a.classList.add("hidden")}),document.getElementById(`tab-${e}`)?.classList.remove("hidden"),e==="vehicles"&&Le(),e==="naval"&&pe(),e==="market"&&Fe()}if(t.target.matches(".inventory-category-card")||t.target.closest(".inventory-category-card")){const a=t.target.closest(".inventory-category-card").dataset.category;De(a)}if(t.target.matches(".equipment-item")||t.target.closest(".equipment-item")){const e=t.target.closest(".equipment-item"),a=e.dataset.equipment,s=e.dataset.category;me(s,a)}})}async function Le(){try{const t=document.getElementById("vehicles-inventory-container");if(!t)return;t.innerHTML=`
      <div class="flex items-center justify-center py-8">
        <div class="text-slate-400">🔄 Carregando inventário...</div>
      </div>
    `;const e=_.currentUser;if(!e)return;const a=await E(e.uid);if(!a)return;const s=await h.collection("inventory").doc(a).get();if(!s.exists){t.innerHTML=`
        <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Vazio</h3>
          <p class="text-slate-400">Nenhum equipamento aprovado encontrado</p>
        </div>
      `;return}const i=s.data();t.innerHTML=Te(i)}catch(t){console.error("Erro ao carregar inventário:",t);const e=document.getElementById("vehicles-inventory-container");e&&(e.innerHTML=`
        <div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3>
          <p class="text-red-400">Erro ao carregar inventário: ${t.message}</p>
        </div>
      `)}}function Te(t){const e=Object.keys(t);if(e.length===0)return`
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Vazio</h3>
        <p class="text-slate-400">Nenhum equipamento aprovado encontrado</p>
      </div>
    `;const a={MBT:"🚗","Light Tank":"🚙","Heavy Tank":"🚛",SPG:"🎯",SPH:"💥",SPAA:"🚀",APC:"🚌",IFV:"🚐","Tank Destroyer":"🔫",Engineering:"🔧",Other:"📦"};return`
    <div class="space-y-6">
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">📦</span>
          Inventário de Equipamentos
        </h3>
        <p class="text-sm text-slate-400 mb-6">Clique em uma categoria para ver os equipamentos aprovados</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${e.map(s=>{const i=t[s],o=Object.keys(i).length,r=Object.values(i).reduce((l,n)=>l+(n.quantity||0),0),d=Object.values(i).reduce((l,n)=>{const c=n.quantity||0,b=(n.cost||0)*.05;return l+b*c},0);return`
              <div class="inventory-category-card bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg p-4 cursor-pointer transition-colors" data-category="${s}">
                <div class="text-center">
                  <div class="text-3xl mb-2">${a[s]||"📦"}</div>
                  <h4 class="font-semibold text-slate-200 mb-1">${s}</h4>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>${o} tipo${o!==1?"s":""}</div>
                    <div>${r} unidade${r!==1?"s":""}</div>
                    <div class="text-red-400">🔧 ${w(d)}/mês</div>
                  </div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    </div>
  `}async function De(t){try{const e=_.currentUser;if(!e)return;const a=await E(e.uid);if(!a)return;const s=await h.collection("inventory").doc(a).get();if(!s.exists)return;const o=s.data()[t];if(!o)return;const r=document.getElementById("inventory-details-modal");r&&r.remove();const d=document.createElement("div");d.id="inventory-details-modal",d.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const l=document.createElement("div");l.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col";const n=Object.entries(o),c=n.reduce((b,[v,y])=>b+(y.quantity||0),0),m=n.reduce((b,[v,y])=>{const x=y.quantity||0,p=(y.cost||0)*.05;return b+p*x},0);l.innerHTML=`
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">📦 ${t}</h3>
          <p class="text-sm text-slate-400">${n.length} equipamentos • ${c} unidades • ${w(m)}/mês manutenção</p>
        </div>
        <button id="close-inventory-modal" class="text-slate-400 hover:text-slate-200 p-1">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${n.map(([b,v])=>{const y=v.quantity||0,x=v.cost||0,u=x*.05*y,p=x*y;return`
              <div class="equipment-item bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 cursor-pointer transition-colors"
                   data-equipment="${b}" data-category="${t}">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-slate-200 mb-1">${b}</h4>
                    <div class="text-xs text-slate-400 space-y-1">
                      <div>📦 <strong>Quantidade:</strong> ${y} unidades</div>
                      <div>💰 <strong>Custo unitário:</strong> ${w(x)}</div>
                      <div>💵 <strong>Valor total:</strong> ${w(p)}</div>
                      <div class="text-red-400">🔧 <strong>Manutenção:</strong> ${w(u)}/mês</div>
                      ${v.approvedDate?`<div>📅 <strong>Aprovado em:</strong> ${new Date(v.approvedDate).toLocaleDateString("pt-BR")}</div>`:""}
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <button class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
                          onclick="showEquipmentDetails('${t}', '${b}')">
                    📋 Ver Ficha
                  </button>
                  <div class="text-xs text-slate-500">Clique para detalhes</div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,d.appendChild(l),d.addEventListener("click",b=>{b.target===d&&d.remove()}),l.querySelector("#close-inventory-modal").addEventListener("click",()=>{d.remove()}),document.addEventListener("keydown",function b(v){v.key==="Escape"&&(d.remove(),document.removeEventListener("keydown",b))}),document.body.appendChild(d)}catch(e){console.error("Erro ao carregar detalhes do inventário:",e)}}async function me(t,e){try{const a=_.currentUser;if(!a)return;const s=await E(a.uid);if(!s)return;const i=await h.collection("inventory").doc(s).get();if(!i.exists)return;const r=i.data()[t]?.[e];if(!r)return;const d=document.getElementById("equipment-details-modal");d&&d.remove();const l=r.quantity||0,n=r.cost||0,c=n*.05*l,m=n*l,b=r.specs||{},v=document.createElement("div");v.id="equipment-details-modal",v.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const y=document.createElement("div");y.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col",y.innerHTML=`
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">🚗 ${e}</h3>
          <p class="text-sm text-slate-400">${t} • ${l} unidades em serviço</p>
        </div>
        <div class="flex items-center gap-2">
          ${r.sheetImageUrl?`
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
                <span class="text-slate-200">${w(n)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Quantidade:</span>
                <span class="text-slate-200">${l} unidades</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Valor total investido:</span>
                <span class="text-green-400 font-semibold">${w(m)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Custo de manutenção:</span>
                <span class="text-red-400 font-semibold">${w(c)}/mês</span>
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
              ${Object.entries(b).map(([u,p])=>{if(typeof p=="object"||u==="components"||u==="total_cost")return"";const f=u.replace(/_/g," ").replace(/\b\w/g,q=>q.toUpperCase());let g=p;return u.includes("cost")||u.includes("price")?g=w(p):u.includes("weight")?g=`${p} tons`:u.includes("speed")?g=`${p} km/h`:u.includes("armor")||u.includes("thickness")?g=`${p}mm`:(u.includes("caliber")||u.includes("gun"))&&(g=`${p}mm`),`
                  <div class="flex justify-between">
                    <span class="text-slate-400">${f}:</span>
                    <span class="text-slate-200">${g}</span>
                  </div>
                `}).join("")}

              ${r.approvedDate?`
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Data de aprovação:</span>
                  <span class="text-slate-200">${new Date(r.approvedDate).toLocaleDateString("pt-BR")}</span>
                </div>
              `:""}
              ${r.approvedBy?`
                <div class="flex justify-between">
                  <span class="text-slate-400">Aprovado por:</span>
                  <span class="text-slate-200">${r.approvedBy}</span>
                </div>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `,v.appendChild(y),v.addEventListener("click",u=>{u.target===v&&v.remove()}),y.querySelector("#close-equipment-modal").addEventListener("click",()=>{v.remove()});const x=y.querySelector("#view-equipment-sheet");x&&r.sheetImageUrl&&x.addEventListener("click",()=>{Se(e,r.sheetImageUrl)}),document.addEventListener("keydown",function u(p){p.key==="Escape"&&(v.remove(),document.removeEventListener("keydown",u))}),document.body.appendChild(v)}catch(a){console.error("Erro ao carregar detalhes do equipamento:",a)}}function Se(t,e){const a=document.getElementById("equipment-sheet-modal");a&&a.remove();const s=document.createElement("div");s.id="equipment-sheet-modal",s.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const i=document.createElement("div");i.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col",i.innerHTML=`
    <div class="flex items-center justify-between p-4 border-b border-bg-ring/50">
      <div>
        <h3 class="text-lg font-semibold text-slate-200">📋 Ficha Técnica</h3>
        <p class="text-sm text-slate-400">${t}</p>
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
        <img src="${e}" alt="Ficha do ${t}"
             class="max-w-full max-h-full mx-auto rounded-lg shadow-lg"
             style="max-height: 70vh;"
             onload="this.style.opacity=1"
             style="opacity:0; transition: opacity 0.3s;">
      </div>
    </div>
  `,s.appendChild(i),s.addEventListener("click",o=>{o.target===s&&s.remove()}),i.querySelector("#close-sheet-modal").addEventListener("click",()=>{s.remove()}),i.querySelector("#open-sheet-new-tab").addEventListener("click",()=>{window.open(e,"_blank")}),document.addEventListener("keydown",function o(r){r.key==="Escape"&&(s.remove(),document.removeEventListener("keydown",o))}),document.body.appendChild(s)}async function pe(){try{const t=document.getElementById("naval-content-container");if(!t)return;t.innerHTML='<div class="flex items-center justify-center py-8"><div class="text-slate-400">🔄 Carregando sistema naval...</div></div>';const e=_.currentUser;if(!e)return;const a=await E(e.uid);if(!a)return;const s=new de,i=window.currentCountry;if(!i)throw new Error("Dados do país não encontrados. Recarregue a página.");const[o,r]=await Promise.all([s.getCurrentShipyardLevel(a),h.collection("paises").get().then(d=>{if(d.empty)return 0;let l=0,n=0;return d.forEach(c=>{const m=parseFloat(c.data().PIB);isNaN(m)||(l+=m,n++)}),n>0?l/n:0})]);t.innerHTML=je(s,o,i,a,r)}catch(t){console.error("Erro ao carregar sistema naval:",t);const e=document.getElementById("naval-content-container");e&&(e.innerHTML=`<div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center"><div class="text-6xl mb-4">❌</div><h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3><p class="text-red-400">Erro ao carregar sistema naval: ${t.message}</p></div>`)}}function je(t,e,a,s,i){const o=O(a),r=t.getLevelInfo(e,a,i),d=t.calculateMaintenanceCost(e,o),l=t.canUpgrade(e,a,i,o),n=[];for(let c=1;c<=3;c++)e+c<=t.maxLevel&&n.push(t.getLevelInfo(e+c,a,i));return`
    <div class="space-y-6">
      <!-- Status Current do Estaleiro -->
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">🏭</span>
          Estaleiros - Nível ${e}
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
                  <span class="text-slate-200 font-semibold">${e}/10</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Descrição:</span>
                  <span class="text-slate-200 text-xs">${r.description}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Bônus paralelo:</span>
                  <span class="text-green-400">+${r.parallelBonus}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Redução tempo:</span>
                  <span class="text-blue-400">-${r.timeReduction}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Projetos simultâneos:</span>
                  <span class="text-purple-400">${r.maxProjects}</span>
                </div>
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Manutenção/mês:</span>
                  <span class="text-red-400">${w(d)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">% do orçamento:</span>
                  <span class="text-red-400">${(r.maintenancePercent*100).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            ${e<t.maxLevel?`
              <!-- Upgrade -->
              <div class="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                <h4 class="font-semibold text-emerald-200 mb-3 flex items-center gap-2">
                  <span>⬆️</span>
                  Upgrade para Nível ${e+1}
                </h4>
                <div class="space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Custo do upgrade:</span>
                    <span class="text-emerald-300 font-semibold">${w(r.upgradeCost)}</span>
                  </div>

                  ${l.canUpgrade?`
                    <button onclick="window.upgradeShipyard('${s}')"
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

            ${n.map(c=>`
              <div class="bg-slate-800/20 border border-slate-600/30 rounded-lg p-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold text-slate-200">Nível ${c.level}</span>
                  <span class="text-xs text-emerald-300">${w(c.upgradeCost)}</span>
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
          ${Pe(t,e)}
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
                <div class="text-sm font-semibold text-slate-200">${w(K(a))}/turno</div>
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
                <span class="text-slate-200">${w(K(a))}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Bônus estaleiro:</span>
                <span class="text-green-400">+${r.parallelBonus}%</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Capacidade efetiva:</span>
                <span class="text-emerald-400 font-semibold">${w(K(a)*(1+r.parallelBonus/100))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Pe(t,e){return[{name:"Corveta",baseTime:8,baseParallel:12},{name:"Destroyer",baseTime:18,baseParallel:4},{name:"Cruzador",baseTime:30,baseParallel:2}].map(s=>{const i=t.calculateProductionBonus(e),o=Math.ceil(s.baseTime*(1-i.timeReduction)),r=Math.ceil(s.baseParallel*i.parallelMultiplier),d=Math.ceil(s.baseTime/3),l=Math.ceil(o/3);return`
      <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <h4 class="font-semibold text-slate-200 mb-3">${s.name}</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo base:</span>
            <span class="text-slate-300">${s.baseTime} meses (${d} turnos)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo atual:</span>
            <span class="text-blue-400">${o} meses (${l} turnos)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Paralelo base:</span>
            <span class="text-slate-300">${s.baseParallel}x</span>
          </div>
          <div class="flex justify-between border-t border-slate-600 pt-2">
            <span class="text-slate-400">Paralelo atual:</span>
            <span class="text-green-400 font-semibold">${r}x</span>
          </div>
        </div>
      </div>
    `}).join("")}window.upgradeShipyard=async function(t){try{if(!confirm("Tem certeza que deseja fazer upgrade do estaleiro? O custo será deduzido imediatamente do orçamento."))return;const e=_.currentUser;if(!e){alert("Usuário não autenticado");return}const a=await E(e.uid);if(!a||a!==t){alert("Você não tem permissão para fazer upgrade deste país");return}const s=event.target,i=s.textContent;s.textContent="🔄 Processando...",s.disabled=!0;const r=await new de().upgradeShipyard(t);r.success?(s.textContent="✅ Upgrade Concluído!",s.classList.add("bg-green-600"),alert(`🏭 Estaleiro upgradado para nível ${r.newLevel}!
💰 Custo: ${w(r.cost)}
📈 Novos bônus: +${r.levelInfo.parallelBonus}% paralelo, -${r.levelInfo.timeReduction}% tempo`),setTimeout(()=>{pe()},1500)):(s.textContent="❌ Erro",s.classList.add("bg-red-600"),alert("Erro ao fazer upgrade: "+r.error),setTimeout(()=>{s.textContent=i,s.classList.remove("bg-red-600"),s.disabled=!1},3e3))}catch(e){console.error("Erro ao fazer upgrade do estaleiro:",e),alert("Erro ao fazer upgrade: "+e.message),event.target&&(event.target.textContent="❌ Erro",event.target.classList.add("bg-red-600"),setTimeout(()=>{event.target.textContent="⬆️ Fazer Upgrade",event.target.classList.remove("bg-red-600"),event.target.disabled=!1},3e3))}};window.showEquipmentDetails=me;async function re(){try{await new Promise(i=>{_.onAuthStateChanged(i)});const t=_.currentUser;if(!t){document.getElementById("dashboard-content").innerHTML=`
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa estar logado.</p>
          </div>
        </div>
      `;return}const e=await E(t.uid),a=await te(),s=e?a.find(i=>i.id===e):null;if(!s){document.getElementById("dashboard-content").innerHTML=`
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa ter um país atribuído.</p>
          </div>
        </div>
      `;return}window.currentCountry=s,document.getElementById("dashboard-content").innerHTML=Ie(s),Be()}catch(t){console.error("Erro ao carregar dashboard:",t),document.getElementById("dashboard-content").innerHTML=`
      <div class="min-h-screen flex items-center justify-center bg-slate-950">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p class="text-slate-400">Erro ao carregar dashboard: ${t.message}</p>
        </div>
      </div>
    `}}window.updateBudgetDisplay=function(t){document.getElementById("budget-display").textContent=t};window.updateDistributionDisplay=function(t){const e=document.getElementById("vehicles-slider"),a=document.getElementById("aircraft-slider"),s=document.getElementById("naval-slider");let i=parseInt(e.value),o=parseInt(a.value),r=parseInt(s.value);if(t&&i+o+r>100){if(t==="vehicles"){const x=o+r;x>0&&(o=Math.max(10,Math.floor(o*(100-i)/x)),r=Math.max(10,100-i-o))}else if(t==="aircraft"){const x=i+r;x>0&&(i=Math.max(10,Math.floor(i*(100-o)/x)),r=Math.max(10,100-o-i))}else if(t==="naval"){const x=i+o;x>0&&(i=Math.max(10,Math.floor(i*(100-r)/x)),o=Math.max(10,100-r-i))}e.value=i,a.value=o,s.value=r}document.getElementById("vehicles-display").textContent=i,document.getElementById("aircraft-display").textContent=o,document.getElementById("naval-display").textContent=r;const d=i+o+r,l=document.getElementById("total-distribution-display");l.textContent=d+"%",d===100?l.className="text-lg font-bold text-emerald-400":d>100?l.className="text-lg font-bold text-red-400":l.className="text-lg font-bold text-yellow-400";const n=document.getElementById("military-budget-slider"),c=parseFloat(n.value)/100,v=O(window.currentCountry)*c*.85;document.getElementById("vehicles-amount").textContent=w(v*i/100),document.getElementById("aircraft-amount").textContent=w(v*o/100),document.getElementById("naval-amount").textContent=w(v*r/100)};window.saveMilitaryBudget=async function(t){try{const e=parseFloat(document.getElementById("military-budget-slider").value),a=_.currentUser;if(!a)return;const s=await E(a.uid);if(!s)return;const{db:i}=await ie(async()=>{const{db:d}=await import("./firebase-COmVF2I9.js").then(l=>l.o);return{db:d}},__vite__mapDeps([0,1]));await i.collection("paises").doc(s).update({MilitaryBudgetPercent:e});const o=t.target,r=o.textContent;o.textContent="✓ Salvo!",o.classList.add("bg-green-600"),setTimeout(()=>{o.textContent=r,o.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(e){console.error("Erro ao salvar orçamento militar:",e),alert("Erro ao salvar orçamento militar. Tente novamente.")}};window.saveMilitaryDistribution=async function(t){try{const e=parseInt(document.getElementById("vehicles-slider").value),a=parseInt(document.getElementById("aircraft-slider").value),s=parseInt(document.getElementById("naval-slider").value),i=e+a+s;if(i!==100){alert(`A soma das distribuições deve ser exatamente 100%! Atual: ${i}%`);return}const o=_.currentUser;if(!o)return;const r=await E(o.uid);if(!r)return;const{db:d}=await ie(async()=>{const{db:c}=await import("./firebase-COmVF2I9.js").then(m=>m.o);return{db:c}},__vite__mapDeps([0,1]));await d.collection("paises").doc(r).update({MilitaryDistributionVehicles:e,MilitaryDistributionAircraft:a,MilitaryDistributionNaval:s});const l=t.target,n=l.textContent;l.textContent="✓ Salvo!",l.classList.add("bg-green-600"),setTimeout(()=>{l.textContent=n,l.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(e){console.error("Erro ao salvar distribuição militar:",e),alert("Erro ao salvar distribuição militar. Tente novamente.")}};let M=null;async function Fe(){const t=document.getElementById("marketplace-container");if(t)try{const e=_.currentUser;if(!e){t.innerHTML='<div class="text-center py-8 text-slate-400">Faça login para acessar o mercado internacional</div>';return}const a=await E(e.uid);if(!a){t.innerHTML='<div class="text-center py-8 text-slate-400">Você precisa estar associado a um país</div>';return}M||(M=new $e),t.innerHTML=`
      <div class="space-y-6">
        <!-- Header -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-white">🌍 Mercado Internacional</h2>
              <p class="text-sm text-slate-400 mt-1">Compre e venda recursos, veículos e equipamentos navais</p>
            </div>
            <div class="flex gap-2">
              <button id="create-test-offers-btn" class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors">
                🧪 Dados Teste
              </button>
              <button id="clear-test-offers-btn" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
                🗑️ Limpar Teste
              </button>
              <button id="create-offer-btn" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors">
                + Criar Oferta
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation Categories -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-4">
          <div class="flex flex-wrap gap-2">
            <button class="marketplace-category-btn active px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-brand-500/20 text-brand-400 border border-brand-400/30" data-category="all">
              Todos
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="resources">
              🏭 Recursos
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="vehicles">
              🚗 Veículos
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="naval">
              🚢 Naval
            </button>
            <button class="marketplace-category-btn px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-category="favorites">
              ⭐ Favoritos
            </button>
          </div>
        </div>

        <!-- Advanced Filters and Search -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-4">
          <!-- Basic Filters Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">🔍 Buscar</label>
              <div class="relative">
                <input type="text" id="marketplace-search" placeholder="Buscar por nome, descrição, país..."
                       class="w-full px-3 py-2 pr-10 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none">
                <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg class="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">📊 Ordenar por</label>
              <select id="marketplace-sort" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                <option value="date">🕒 Mais recente</option>
                <option value="price-low">💰 Menor preço</option>
                <option value="price-high">💎 Maior preço</option>
                <option value="quantity">📦 Maior quantidade</option>
                <option value="popularity">👁️ Mais visualizado</option>
                <option value="expires-soon">⏰ Expira em breve</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">🎯 Tipo</label>
              <select id="marketplace-type" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                <option value="all">Todos</option>
                <option value="sell">💰 Vendas</option>
                <option value="buy">🛒 Compras</option>
              </select>
            </div>
          </div>

          <!-- Advanced Filters Toggle -->
          <div class="border-t border-bg-ring/50 pt-4">
            <button id="toggle-advanced-filters" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <span>⚙️ Filtros Avançados</span>
              <svg id="advanced-filters-icon" class="h-4 w-4 transform transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- Advanced Filters Panel -->
            <div id="advanced-filters-panel" class="hidden mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <!-- Price Range -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">💵 Faixa de Preço</label>
                <div class="space-y-2">
                  <input type="number" id="price-min" placeholder="Preço mínimo" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                  <input type="number" id="price-max" placeholder="Preço máximo" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                </div>
              </div>

              <!-- Quantity Range -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">📦 Quantidade</label>
                <div class="space-y-2">
                  <input type="number" id="quantity-min" placeholder="Qtd. mínima" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                  <input type="number" id="quantity-max" placeholder="Qtd. máxima" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none text-sm">
                </div>
              </div>

              <!-- Country Filter -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">🌍 País</label>
                <select id="country-filter" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none text-sm">
                  <option value="">Todos os países</option>
                </select>
              </div>

              <!-- Time Filter -->
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">⏱️ Tempo Restante</label>
                <select id="time-filter" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none text-sm">
                  <option value="">Qualquer tempo</option>
                  <option value="1">Menos de 1 dia</option>
                  <option value="3">Menos de 3 dias</option>
                  <option value="7">Menos de 1 semana</option>
                  <option value="30">Menos de 1 mês</option>
                </select>
              </div>
            </div>

            <!-- Filter Actions -->
            <div class="mt-4 flex gap-2">
              <button id="apply-filters-btn" class="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black text-sm font-medium rounded-lg transition-colors">
                Aplicar Filtros
              </button>
              <button id="clear-filters-btn" class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors">
                Limpar
              </button>
              <button id="save-filters-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
                💾 Salvar Filtros
              </button>
            </div>
          </div>
        </div>

        <!-- Embargo Management Section -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">🚫 Embargos Diplomáticos</h3>
              <p class="text-sm text-slate-400">Gerencie bloqueios comerciais com outros países</p>
              <div id="embargo-status-indicator" class="mt-2"></div>
            </div>
            <div class="flex gap-2">
              <button id="view-notifications-btn" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors relative">
                📢 Notificações
                <span id="notifications-count-badge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"></span>
              </button>
              <button id="view-embargoes-btn" class="px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors relative">
                Ver Embargos
                <span id="embargo-count-badge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"></span>
              </button>
              <button id="create-embargo-btn" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors">
                Aplicar Embargo
              </button>
            </div>
          </div>
        </div>

        <!-- Marketplace Content -->
        <div id="marketplace-content" class="min-h-[400px]">
          <!-- Content will be loaded here -->
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p class="text-slate-400">Carregando ofertas...</p>
            </div>
          </div>
        </div>
      </div>
    `,Ae(),B("all",a),ge(a),G(),pt()}catch(e){console.error("Erro ao carregar marketplace:",e),t.innerHTML='<div class="text-center py-8 text-red-400">Erro ao carregar marketplace</div>'}}function Ae(){document.querySelectorAll(".marketplace-category-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".marketplace-category-btn").forEach(b=>{b.classList.remove("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),b.classList.add("bg-bg/50","text-slate-300","border-bg-ring")}),n.classList.add("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),n.classList.remove("bg-bg/50","text-slate-300","border-bg-ring");const c=n.dataset.category,m=_.currentUser;m&&E(m.uid).then(b=>{b&&(we(),B(c,b))})})});const t=document.getElementById("marketplace-search"),e=document.getElementById("marketplace-sort"),a=document.getElementById("marketplace-type");t&&t.addEventListener("input",Je(()=>{const n=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",c=_.currentUser;c&&E(c.uid).then(m=>{m&&B(n,m)})},300)),e&&e.addEventListener("change",()=>{const n=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",c=_.currentUser;c&&E(c.uid).then(m=>{m&&B(n,m)})}),a&&a.addEventListener("change",()=>{const n=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",c=_.currentUser;c&&E(c.uid).then(m=>{m&&B(n,m)})});const s=document.getElementById("create-offer-btn");s&&s.addEventListener("click",Qe);const i=document.getElementById("view-notifications-btn");i&&i.addEventListener("click",We);const o=document.getElementById("view-embargoes-btn");o&&o.addEventListener("click",st);const r=document.getElementById("create-embargo-btn");r&&r.addEventListener("click",ot);const d=document.getElementById("create-test-offers-btn");d&&d.addEventListener("click",async()=>{d.disabled=!0,d.innerHTML="⏳ Criando...";try{const n=await M.createTestOffers();if(n.success)d.innerHTML="✅ Criado!",d.classList.remove("bg-yellow-600","hover:bg-yellow-700"),d.classList.add("bg-green-600"),setTimeout(()=>{const c=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",m=_.currentUser;m&&E(m.uid).then(b=>{b&&B(c,b)}),setTimeout(()=>{d.innerHTML="🧪 Dados Teste",d.classList.remove("bg-green-600"),d.classList.add("bg-yellow-600","hover:bg-yellow-700"),d.disabled=!1},3e3)},1e3);else throw new Error(n.error)}catch(n){console.error("Erro ao criar ofertas de teste:",n),d.innerHTML="❌ Erro",d.classList.remove("bg-yellow-600","hover:bg-yellow-700"),d.classList.add("bg-red-600"),setTimeout(()=>{d.innerHTML="🧪 Dados Teste",d.classList.remove("bg-red-600"),d.classList.add("bg-yellow-600","hover:bg-yellow-700"),d.disabled=!1},3e3)}});const l=document.getElementById("clear-test-offers-btn");l&&l.addEventListener("click",async()=>{if(confirm("Tem certeza que deseja deletar todas as ofertas de teste? Esta ação não pode ser desfeita.")){l.disabled=!0,l.innerHTML="⏳ Limpando...";try{const n=await M.clearTestOffers();if(n.success)l.innerHTML=`✅ ${n.count||0} removidas!`,l.classList.remove("bg-red-600","hover:bg-red-700"),l.classList.add("bg-green-600"),setTimeout(()=>{const c=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",m=_.currentUser;m&&E(m.uid).then(b=>{b&&B(c,b)}),setTimeout(()=>{l.innerHTML="🗑️ Limpar Teste",l.classList.remove("bg-green-600"),l.classList.add("bg-red-600","hover:bg-red-700"),l.disabled=!1},3e3)},1e3);else throw new Error(n.error)}catch(n){console.error("Erro ao limpar ofertas de teste:",n),l.innerHTML="❌ Erro",setTimeout(()=>{l.innerHTML="🗑️ Limpar Teste",l.disabled=!1},3e3)}}}),dt()}async function B(t,e){const a=document.getElementById("marketplace-content");if(a)try{a.innerHTML=`
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-slate-400">Carregando ofertas...</p>
        </div>
      </div>
    `;const s=document.getElementById("marketplace-search")?.value||"",i=document.getElementById("marketplace-sort")?.value||"date",o=document.getElementById("marketplace-type")?.value||"all",r=parseFloat(document.getElementById("price-min")?.value)||null,d=parseFloat(document.getElementById("price-max")?.value)||null,l=parseInt(document.getElementById("quantity-min")?.value)||null,n=parseInt(document.getElementById("quantity-max")?.value)||null,c=document.getElementById("country-filter")?.value||null,m=parseInt(document.getElementById("time-filter")?.value)||null,b={category:t,type:o,searchTerm:s,current_country_id:e,orderBy:Oe(i),orderDirection:Ne(i),limit:50,priceMin:r,priceMax:d,quantityMin:l,quantityMax:n,countryFilter:c,timeFilter:m};let v=[],y={success:!0,offers:[]};if(t==="favorites"){const p=_e();if(p.length===0)v=[],y={success:!0,offers:[],totalCount:0};else{const f={...b,category:"all",limit:1e3};y=await M.getOffers(f),y.success&&(v=y.offers.filter(g=>p.includes(g.id)))}}else y=await M.getOffers(b),v=y.offers||[];if(!y.success)throw new Error(y.error);if(v.length===0){const p=await Y(e);a.innerHTML=`
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-lg font-medium text-white mb-2">Nenhuma oferta encontrada</h3>
          <p class="text-slate-400 mb-6">Não há ofertas disponíveis para os filtros selecionados</p>
          ${p.hasEmbargoes?`
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 mx-auto max-w-md">
              <div class="flex items-center gap-2 text-red-400 mb-2">
                <span>🚫</span>
                <span class="font-medium">Embargos Ativos</span>
              </div>
              <p class="text-sm text-red-300">
                ${p.totalEmbargoes} país(es) aplicaram embargos contra você,
                limitando ${p.blockedCategories.length>0?"algumas categorias":"todas as trocas"}.
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
      `;return}const x=await Y(e);let u="";x.hasEmbargoes&&(u+=`
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-yellow-400 mb-2">
            <span>⚠️</span>
            <span class="font-medium">Aviso de Embargos</span>
          </div>
          <p class="text-sm text-yellow-300">
            Algumas ofertas podem estar ocultas devido a embargos ativos.
            ${x.totalEmbargoes} país(es) aplicaram restrições comerciais.
          </p>
          <button onclick="openEmbargoesModal()" class="mt-2 text-xs px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors">
            Ver Detalhes
          </button>
        </div>
      `),u+=`
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="offers-grid">
        ${v.map(p=>be(p)).join("")}
      </div>

      <!-- Pagination Controls -->
      <div class="mt-8 border-t border-bg-ring/50 pt-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Results Info -->
          <div class="text-sm text-slate-400">
            Mostrando ${v.length} de ${y.totalCount||v.length} ofertas
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
    `,a.innerHTML=u,ft(v),bt(e,t,b)}catch(s){console.error("Erro ao carregar ofertas:",s),a.innerHTML=`
      <div class="text-center py-12 text-red-400">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-medium mb-2">Erro ao carregar ofertas</h3>
        <p class="mb-4">${s.message||"Tente novamente em alguns instantes"}</p>
        <button onclick="auth.currentUser && checkPlayerCountry(auth.currentUser.uid).then(paisId => paisId && loadMarketplaceOffers('${t}', paisId))" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Tentar novamente
        </button>
      </div>
    `}}function Oe(t){switch(t){case"price-low":case"price-high":return"price_per_unit";case"quantity":return"quantity";case"popularity":return"views";case"expires-soon":return"expires_at";case"date":default:return"created_at"}}function Ne(t){switch(t){case"price-low":case"expires-soon":return"asc";case"price-high":case"quantity":case"popularity":case"date":default:return"desc"}}async function Y(t){try{if(!t)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const e=await h.collection("marketplace_embargoes").where("target_country_id","==",t).where("status","==","active").get(),a=[];if(e.forEach(o=>{a.push(o.data())}),a.length===0)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const s=new Set;let i=!1;return a.forEach(o=>{o.type==="full"?(i=!0,s.add("resources"),s.add("vehicles"),s.add("naval")):o.type==="partial"&&o.categories_blocked&&o.categories_blocked.forEach(r=>{s.add(r)})}),{hasEmbargoes:!0,totalEmbargoes:a.length,blockedCategories:Array.from(s),hasFullEmbargo:i,embargoes:a}}catch(e){return console.error("Erro ao verificar embargos:",e),{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]}}}function be(t){const e=t.expires_at?.toDate?t.expires_at.toDate():new Date(t.expires_at),a=t.quantity*t.price_per_unit,s=Math.max(0,Math.floor((e-new Date)/(1440*60*1e3))),i=t.type==="sell"?{label:"Venda",color:"text-green-400 bg-green-400/20",icon:"💰"}:{label:"Compra",color:"text-blue-400 bg-blue-400/20",icon:"🛒"},o={resources:"🏭",vehicles:"🚗",naval:"🚢"};return`
    <div class="bg-bg-soft border border-bg-ring/70 rounded-xl p-4 hover:border-brand-400/30 transition-colors cursor-pointer" onclick="openOfferDetails('${t.id}')">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${o[t.category]}</span>
          <span class="px-2 py-1 rounded text-xs font-medium ${i.color}">
            ${i.icon} ${i.label}
          </span>
        </div>
        <div class="text-right text-xs text-slate-400">
          <div>${s} dias restantes</div>
          ${t.views?`<div class="mt-1">${t.views} visualizações</div>`:""}
        </div>
      </div>

      <!-- Title and Description -->
      <h3 class="font-semibold text-white mb-2 line-clamp-1">${t.title}</h3>
      <p class="text-sm text-slate-400 mb-3 line-clamp-2">${t.description||"Sem descrição"}</p>

      <!-- Quantity and Price -->
      <div class="space-y-2 mb-3">
        <div class="flex justify-between">
          <span class="text-sm text-slate-300">Quantidade:</span>
          <span class="text-sm font-medium text-white">${t.quantity.toLocaleString()} ${t.unit}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-sm text-slate-300">Preço unitário:</span>
          <span class="text-sm font-medium text-brand-400">${w(t.price_per_unit)}</span>
        </div>
        <div class="flex justify-between border-t border-bg-ring/50 pt-2">
          <span class="text-sm font-medium text-slate-300">Valor total:</span>
          <span class="font-semibold text-white">${w(a)}</span>
        </div>
      </div>

      <!-- Country -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-lg">${t.country_flag||"🏳️"}</span>
          <span class="text-sm text-slate-300">${t.country_name}</span>
        </div>
        <div class="flex gap-2">
          <button id="favorite-btn-${t.id}" class="text-xs px-2 py-1 bg-slate-600/20 text-slate-400 rounded hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors" onclick="event.stopPropagation(); toggleFavorite('${t.id}')" title="Adicionar aos favoritos">
            <span id="favorite-icon-${t.id}">⭐</span>
          </button>
          <button class="text-xs px-3 py-1 bg-brand-500/20 text-brand-400 rounded-lg hover:bg-brand-500/30 transition-colors" onclick="event.stopPropagation(); openOfferDetails('${t.id}')">
            Ver detalhes
          </button>
        </div>
      </div>
    </div>
  `}async function Re(t){try{M&&M.incrementOfferViews(t);const e=_.currentUser;if(!e){alert("Você precisa estar logado para visualizar detalhes");return}const a=await E(e.uid);if(!a){alert("Você precisa estar associado a um país");return}const i=(await te()).find(f=>f.id===a);if(!i){alert("Dados do país não encontrados");return}const o=document.querySelectorAll('[onclick*="openOfferDetails"]');let r=null;try{const f=await M.getOffers({limit:1e3});f.success&&f.offers&&(r=f.offers.find(g=>g.id===t))}catch(f){console.error("Error finding offer:",f)}if(!r){alert("Oferta não encontrada");return}const d=document.getElementById("offer-details-modal");d&&d.remove();const l=document.createElement("div");l.id="offer-details-modal",l.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";const n=r.player_id===e.uid||r.country_id===a,c=!n&&r.type==="sell"&&r.status==="active",m=!n&&r.type==="buy"&&r.status==="active",b=c||m,v=O(i),y=r.quantity*r.price_per_unit,x=v>=y,u=r.expires_at?.toDate?r.expires_at.toDate():new Date(r.expires_at),p=Math.max(0,Math.ceil((u-new Date)/(1440*60*1e3)));l.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">
                ${r.type==="sell"?"🔥":"💰"}
                ${r.category==="resources"?"🏭":r.category==="vehicles"?"🚗":"🚢"}
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">${r.title}</h2>
                <div class="flex items-center space-x-4 text-sm text-slate-400">
                  <span>${r.country_flag} ${r.country_name}</span>
                  <span>${r.type==="sell"?"Vendendo":"Comprando"}</span>
                  <span>${p} dias restantes</span>
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
                    <span class="text-white">${r.item_name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${r.category==="resources"?"Recursos":r.category==="vehicles"?"Veículos":"Naval"}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade:</span>
                    <span class="text-white font-medium">${r.quantity.toLocaleString()} ${r.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço por ${r.unit.slice(0,-1)}:</span>
                    <span class="text-white font-medium">${C(r.price_per_unit)}</span>
                  </div>
                  <div class="flex justify-between border-t border-bg-ring pt-2 mt-3">
                    <span class="text-slate-400">Valor Total:</span>
                    <span class="text-brand-300 font-bold text-lg">${C(r.total_value)}</span>
                  </div>
                </div>
              </div>

              ${r.description?`
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-2">📝 Descrição</h3>
                <p class="text-slate-300 text-sm">${r.description}</p>
              </div>
              `:""}

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">⚙️ Condições</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Mínima:</span>
                    <span class="text-white">${r.min_quantity||1} ${r.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Máxima:</span>
                    <span class="text-white">${r.max_quantity||r.quantity} ${r.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tempo de Entrega:</span>
                    <span class="text-white">${r.delivery_time_days||30} dias</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Criado em:</span>
                    <span class="text-white">${new Date(r.created_at?.seconds*1e3||r.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Visualizações:</span>
                    <span class="text-white">${r.views||0}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Países Interessados:</span>
                    <span class="text-white">${r.interested_countries?.length||0}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações e Compra -->
            <div class="space-y-6">
              ${n?`
                <div class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <div class="text-blue-400">ℹ️</div>
                    <div>
                      <div class="text-blue-300 font-medium">Esta é sua oferta</div>
                      <div class="text-sm text-slate-300 mt-1">Você não pode interagir com suas próprias ofertas.</div>
                    </div>
                  </div>
                </div>
              `:b?`
                <div class="bg-bg/30 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">
                    ${r.type==="sell"?"💰 Comprar Item":"🔥 Vender Item"}
                  </h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade Desejada</label>
                      <div class="flex space-x-2">
                        <input type="number" id="transaction-quantity" min="${r.min_quantity||1}" max="${r.max_quantity||r.quantity}" value="${r.min_quantity||1}" class="flex-1 px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                        <span class="px-3 py-2 text-slate-400 bg-bg/50 border border-bg-ring rounded-lg">${r.unit}</span>
                      </div>
                      <div class="text-xs text-slate-400 mt-1">
                        Mín: ${r.min_quantity||1} | Máx: ${r.max_quantity||r.quantity}
                      </div>
                    </div>

                    <div id="transaction-summary" class="bg-brand-500/10 border border-brand-400/30 rounded-lg p-3">
                      <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                          <span class="text-slate-400">Quantidade:</span>
                          <span class="text-white"><span id="summary-quantity">${r.min_quantity||1}</span> ${r.unit}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-400">Preço unitário:</span>
                          <span class="text-white">${C(r.price_per_unit)}</span>
                        </div>
                        <div class="flex justify-between font-medium border-t border-brand-400/30 pt-1 mt-2">
                          <span class="text-brand-300">Total a pagar:</span>
                          <span class="text-brand-300" id="summary-total">${C((r.min_quantity||1)*r.price_per_unit)}</span>
                        </div>
                      </div>
                    </div>

                    ${r.type==="sell"&&!x?`
                      <div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                        <div class="flex items-start space-x-2">
                          <div class="text-red-400">⚠️</div>
                          <div>
                            <div class="text-red-300 font-medium">Orçamento Insuficiente</div>
                            <div class="text-sm text-slate-300 mt-1">
                              Disponível: ${C(v)}<br>
                              Necessário: ${C(y)}
                            </div>
                          </div>
                        </div>
                      </div>
                    `:""}

                    <div class="flex space-x-2">
                      <button onclick="closeOfferDetailsModal()" class="flex-1 px-4 py-2 text-slate-300 hover:text-white transition-colors border border-bg-ring rounded-lg">
                        Cancelar
                      </button>
                      <button onclick="processTransaction('${r.id}')" id="process-transaction-btn" class="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors ${r.type==="sell"&&!x?"opacity-50 cursor-not-allowed":""}" ${r.type==="sell"&&!x?"disabled":""}>
                        ${r.type==="sell"?"💰 Comprar":"🔥 Vender"}
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
                        ${r.status!=="active"?"Esta oferta não está mais ativa.":"Você não pode interagir com esta oferta."}
                      </div>
                    </div>
                  </div>
                </div>
              `}

              ${r.category==="vehicles"||r.category==="naval"?`
              <!-- Especificações do Equipamento -->
              <div class="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-purple-300 font-medium">⚙️ Especificações Técnicas</h3>
                  <button onclick="openEquipmentDetails('${r.item_id}', '${r.category}', '${r.country_id}')" class="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-lg hover:bg-purple-600/30 transition-colors">
                    📋 Ver Ficha Completa
                  </button>
                </div>
                <div id="equipment-specs-${r.id}" class="text-sm text-slate-300 space-y-2">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tipo:</span>
                    <span class="text-white">${r.category==="vehicles"?"🚗 Veículo Terrestre":"🚢 Embarcação Naval"}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Modelo:</span>
                    <span class="text-white">${r.item_name}</span>
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
                  <div class="text-2xl">${r.country_flag}</div>
                  <div>
                    <div class="text-white font-medium">${r.country_name}</div>
                    <div class="text-sm text-slate-400">${r.type==="sell"?"Vendedor":"Comprador"}</div>
                  </div>
                </div>
                <div class="text-sm text-slate-400">
                  Este país ${r.type==="sell"?"está oferecendo":"está procurando"} ${r.item_name.toLowerCase()}
                  ${r.type==="sell"?"para venda":"para compra"} no mercado internacional.
                </div>
              </div>

              <!-- Histórico de Preços (placeholder) -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📈 Informações de Mercado</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço Médio de Mercado:</span>
                    <span class="text-white">${C(r.price_per_unit*(.9+Math.random()*.2))}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Esta Oferta:</span>
                    <span class="${r.price_per_unit>r.price_per_unit*1.1?"text-red-300":r.price_per_unit<r.price_per_unit*.9?"text-green-300":"text-yellow-300"}">
                      ${r.price_per_unit>r.price_per_unit*1.1?"📈 Acima":r.price_per_unit<r.price_per_unit*.9?"📉 Abaixo":"📊 Na Média"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(l),Ve(r,i,a)}catch(e){console.error("Erro ao abrir detalhes da oferta:",e),alert("Erro ao carregar detalhes da oferta")}}function U(){const t=document.getElementById("offer-details-modal");t&&t.remove()}function Ve(t,e,a){const s=document.getElementById("offer-details-modal");if(!s)return;const i=s.querySelector("#transaction-quantity");i&&i.addEventListener("input",()=>{He(t,i.value)}),s.addEventListener("click",o=>{o.target===s&&U()}),document.addEventListener("keydown",function o(r){r.key==="Escape"&&(U(),document.removeEventListener("keydown",o))})}function He(t,e){const a=document.getElementById("offer-details-modal");if(!a)return;const s=a.querySelector("#summary-quantity"),i=a.querySelector("#summary-total");if(s&&i){const o=parseInt(e)||1,r=o*t.price_per_unit;s.textContent=o.toLocaleString(),i.textContent=C(r)}}async function Ue(t){try{const e=document.getElementById("offer-details-modal"),a=e.querySelector("#transaction-quantity"),s=e.querySelector("#process-transaction-btn"),i=s.textContent;if(!a){alert("Erro: quantidade não especificada");return}const o=parseInt(a.value);if(!o||o<=0){alert("Por favor, especifique uma quantidade válida"),a.focus();return}const r=_.currentUser;if(!r){alert("Você precisa estar logado");return}if(!await E(r.uid)){alert("Você precisa estar associado a um país");return}const n=(await M.getOffers({limit:1e3})).offers?.find(y=>y.id===t);if(!n){alert("Oferta não encontrada");return}if(o<(n.min_quantity||1)){alert(`Quantidade mínima: ${n.min_quantity||1} ${n.unit}`);return}if(o>(n.max_quantity||n.quantity)){alert(`Quantidade máxima: ${n.max_quantity||n.quantity} ${n.unit}`);return}if(o>n.quantity){alert(`Quantidade disponível: ${n.quantity} ${n.unit}`);return}const c=o*n.price_per_unit,b=`
      Confirmar ${n.type==="sell"?"comprar":"vender"}:

      • Item: ${n.item_name}
      • Quantidade: ${o} ${n.unit}
      • Preço unitário: ${C(n.price_per_unit)}
      • Valor total: ${C(c)}
      • País: ${n.country_name}

      Deseja continuar?
    `;if(!confirm(b))return;s.disabled=!0,s.textContent="⏳ Processando...";const v=await M.createTransaction(t,{quantity:o});if(v.success)s.textContent="✅ Sucesso!",s.classList.remove("bg-brand-500","hover:bg-brand-600"),s.classList.add("bg-green-600"),setTimeout(()=>{alert("Transação criada com sucesso! A negociação foi iniciada."),U();const y=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",x=_.currentUser;x&&E(x.uid).then(u=>{u&&B(y,u)})},1500);else throw new Error(v.error||"Erro desconhecido ao processar transação")}catch(e){console.error("Erro ao processar transação:",e);const a=document.querySelector("#process-transaction-btn");a&&(a.textContent="❌ Erro",a.classList.remove("bg-brand-500","hover:bg-brand-600"),a.classList.add("bg-red-600"),setTimeout(()=>{a.textContent=offer.type==="sell"?"💰 Comprar":"🔥 Vender",a.classList.remove("bg-red-600"),a.classList.add("bg-brand-500","hover:bg-brand-600"),a.disabled=!1},3e3)),alert("Erro ao processar transação: "+e.message)}}async function ze(t,e,a){try{console.log("Abrindo detalhes do equipamento:",{itemId:t,category:e,countryId:a});const s=await M.getCountryInventory(a);let i=null,o=null;if(Object.keys(s).forEach(l=>{s[l]&&typeof s[l]=="object"&&Object.keys(s[l]).forEach(n=>{const c=s[l][n];c&&typeof c=="object"&&(`${l}_${n}`.toLowerCase().replace(/\s+/g,"_")===t||n.toLowerCase().includes(t.toLowerCase()))&&(i=c,o=l,i.name=n,i.category=l)})}),!i){alert("Equipamento não encontrado no inventário do país vendedor.");return}const r=document.getElementById("equipment-details-modal");r&&r.remove();const d=document.createElement("div");d.id="equipment-details-modal",d.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4",d.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">${e==="vehicles"?"🚗":"🚢"}</div>
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
                    <span class="text-white">${C(i.cost||0)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo de Manutenção/Mês:</span>
                    <span class="text-white">${C((i.cost||0)*.05)}</span>
                  </div>
                </div>
              </div>

              ${i.components?`
              <!-- Componentes -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">🔧 Componentes</h3>
                <div class="space-y-3 text-sm">
                  ${Object.entries(i.components).map(([l,n])=>`
                    <div class="bg-bg/50 rounded p-3">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="text-brand-300 font-medium">${l.replace(/_/g," ").toUpperCase()}</div>
                          <div class="text-slate-300">${n.name||"N/A"}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-slate-400 text-xs">Custo</div>
                          <div class="text-white">${C(n.cost||0)}</div>
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
                  ${Object.entries(i.stats).map(([l,n])=>`
                    <div class="flex justify-between items-center">
                      <span class="text-slate-400">${l.replace(/_/g," ")}:</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-white">${typeof n=="number"?n.toLocaleString():n}</span>
                        ${typeof n=="number"&&n>0?`
                          <div class="bg-bg w-16 h-2 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style="width: ${Math.min(100,n/100*100)}%"></div>
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
    `,document.body.appendChild(d),d.addEventListener("click",l=>{l.target===d&&X()}),document.addEventListener("keydown",function l(n){n.key==="Escape"&&(X(),document.removeEventListener("keydown",l))})}catch(s){console.error("Erro ao abrir detalhes do equipamento:",s),alert("Erro ao carregar detalhes do equipamento")}}function X(){const t=document.getElementById("equipment-details-modal");t&&t.remove()}window.openOfferDetails=Re;window.openEquipmentDetails=ze;window.closeEquipmentDetailsModal=X;window.closeOfferDetailsModal=U;window.processTransaction=Ue;async function Qe(){try{const t=_.currentUser;if(!t){alert("Você precisa estar logado para criar ofertas");return}const e=await E(t.uid);if(!e){alert("Você precisa estar associado a um país");return}const s=(await te()).find(r=>r.id===e);if(!s){alert("Dados do país não encontrados");return}const i=document.getElementById("create-offer-modal");i&&i.remove();const o=document.createElement("div");o.id="create-offer-modal",o.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",o.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">📝 Criar Nova Oferta</h2>
            <button onclick="closeCreateOfferModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form id="create-offer-form" class="p-6 space-y-6">
          <!-- Tipo da Oferta -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de Oferta</label>
            <div class="grid grid-cols-2 gap-4">
              <label class="flex items-center space-x-3 p-4 border border-bg-ring rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                <input type="radio" name="offer-type" value="sell" class="text-brand-500 focus:ring-brand-400" required>
                <div>
                  <div class="text-white font-medium">🔥 Vender</div>
                  <div class="text-slate-400 text-sm">Ofertar seus recursos/equipamentos</div>
                </div>
              </label>
              <label class="flex items-center space-x-3 p-4 border border-bg-ring rounded-lg cursor-pointer hover:border-brand-400 transition-colors">
                <input type="radio" name="offer-type" value="buy" class="text-brand-500 focus:ring-brand-400" required>
                <div>
                  <div class="text-white font-medium">💰 Comprar</div>
                  <div class="text-slate-400 text-sm">Buscar recursos/equipamentos</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Categoria -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
            <select id="offer-category" name="category" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
              <option value="">Selecione uma categoria</option>
              <option value="resources">🏭 Recursos (Aço, Petróleo, Eletrônicos)</option>
              <option value="vehicles">🚗 Veículos (Tanques, Artilharia)</option>
              <option value="naval">🚢 Naval (Navios, Submarinos)</option>
            </select>
          </div>

          <!-- Item Específico -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Item</label>
            <select id="offer-item" name="item_id" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required disabled>
              <option value="">Selecione primeiro uma categoria</option>
            </select>
          </div>

          <!-- Título e Descrição -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Título da Oferta</label>
              <input type="text" id="offer-title" name="title" placeholder="Ex: Aço de Alta Qualidade" maxlength="100" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Duração (dias)</label>
              <select name="duration_days" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
                <option value="7">7 dias</option>
                <option value="14" selected>14 dias</option>
                <option value="21">21 dias</option>
                <option value="30">30 dias</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Descrição</label>
            <textarea id="offer-description" name="description" rows="3" placeholder="Descreva o item, qualidade, condições especiais..." maxlength="500" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none resize-none"></textarea>
          </div>

          <!-- Quantidade e Preço -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade</label>
              <input type="number" id="offer-quantity" name="quantity" min="1" placeholder="0" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Unidade</label>
              <select id="offer-unit" name="unit" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
                <option value="toneladas">Toneladas</option>
                <option value="unidades">Unidades</option>
                <option value="barris">Barris</option>
                <option value="navios">Navios</option>
                <option value="submarinos">Submarinos</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Preço por Unidade (USD)</label>
              <input type="number" id="offer-price" name="price_per_unit" min="0.01" step="0.01" placeholder="0.00" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none" required>
            </div>
          </div>

          <!-- Configurações Avançadas -->
          <div class="bg-bg/30 rounded-lg p-4 space-y-4">
            <h3 class="text-white font-medium">⚙️ Configurações Avançadas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade Mínima por Pedido</label>
                <input type="number" name="min_quantity" min="1" placeholder="1" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Tempo de Entrega (dias)</label>
                <input type="number" name="delivery_time_days" min="1" value="30" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              </div>
            </div>
          </div>

          <!-- Resumo -->
          <!-- Informações do Item Selecionado -->
          <div id="item-info" class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 hidden">
            <h3 class="text-blue-300 font-medium mb-2">📋 Informações do Item</h3>
            <div id="item-info-content" class="text-sm text-slate-300 space-y-1">
              <!-- Content will be populated by JavaScript -->
            </div>
          </div>

          <!-- Resumo da Oferta -->
          <div id="offer-summary" class="bg-brand-500/10 border border-brand-400/30 rounded-lg p-4 hidden">
            <h3 class="text-brand-300 font-medium mb-2">📊 Resumo da Oferta</h3>
            <div id="offer-summary-content" class="text-sm text-slate-300 space-y-1">
              <!-- Content will be populated by JavaScript -->
            </div>
          </div>

          <!-- Budget Warning for Buy Offers -->
          <div id="budget-warning" class="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4 hidden">
            <div class="flex items-start space-x-2">
              <div class="text-amber-400">⚠️</div>
              <div>
                <div class="text-amber-300 font-medium">Atenção: Orçamento</div>
                <div class="text-sm text-slate-300 mt-1">
                  Orçamento disponível: <span class="font-medium">${C(O(s))}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end space-x-4 pt-4">
            <button type="button" onclick="closeCreateOfferModal()" class="px-4 py-2 text-slate-300 hover:text-white transition-colors">
              Cancelar
            </button>
            <button type="submit" id="submit-offer-btn" class="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors">
              Criar Oferta
            </button>
          </div>
        </form>
      </div>
    `,document.body.appendChild(o),Ge(s,e),setTimeout(()=>{const r=o.querySelector('input[type="radio"]');r&&r.focus()},100)}catch(t){console.error("Erro ao abrir modal de criação:",t),alert("Erro ao abrir formulário de criação de ofertas")}}function H(){const t=document.getElementById("create-offer-modal");t&&t.remove()}function Ge(t,e){const a=document.getElementById("create-offer-modal");if(!a)return;let s={resources:[],vehicles:[],naval:[]};async function i(){try{const u=a.querySelectorAll('input[name="offer-type"]');let p=null;u.forEach(g=>{g.checked&&(p=g.value)}),console.log("🔍 Tipo de oferta selecionado:",p),p==="sell"?(console.log("📦 Carregando itens do inventário real para VENDA"),await o()):p==="buy"?(console.log("🛒 Carregando todos os tipos de itens para COMPRA"),r()):(console.log("⚠️ Nenhum tipo selecionado, usando VENDA como padrão"),await o());const f=l.value;f&&d(f)}catch(u){console.error("Erro ao carregar itens disponíveis:",u)}}async function o(){if(M)try{console.log("🔍 Carregando itens do inventário para país:",e);const u=window.currentCountry;if(!u){console.error("❌ Dados do país não encontrados no window.currentCountry");return}const p=ne.calculateCountryConsumption(u),f=le.calculateCountryProduction(u),g={Carvao:Math.round((f.Carvao||0)-(p.Carvao||0)),Combustivel:Math.round((f.Combustivel||0)-(p.Combustivel||0)),Metais:Math.round((f.Metais||0)-(p.Metais||0)),Graos:Math.round((f.Graos||0)-(p.Graos||0))};s.resources=[],Object.entries(g).forEach(([$,I])=>{I>0&&s.resources.push({id:$.toLowerCase(),name:`${$} (Excedente: ${I.toLocaleString()})`,unit:$==="Combustivel"?"barris":"toneladas",available:I})}),console.log("✅ Recursos excedentes carregados para venda:",s.resources);const q=await M.getCountryInventory(e),k=M.getAvailableEquipment(q);s.vehicles=k.filter($=>$.type==="vehicles"),s.naval=k.filter($=>$.type==="naval")}catch(u){console.error("Erro ao carregar itens do inventário:",u)}}function r(){s={resources:[{id:"steel_high_grade",name:"Aço de Alta Qualidade",unit:"toneladas"},{id:"steel_standard",name:"Aço Padrão",unit:"toneladas"},{id:"oil_crude",name:"Petróleo Bruto",unit:"barris"},{id:"oil_aviation",name:"Petróleo de Aviação",unit:"barris"},{id:"aluminum",name:"Alumínio",unit:"toneladas"},{id:"copper",name:"Cobre",unit:"toneladas"},{id:"rare_metals",name:"Metais Raros",unit:"toneladas"},{id:"coal",name:"Carvão",unit:"toneladas"},{id:"food",name:"Alimentos",unit:"toneladas"}],vehicles:[{id:"mbt_modern",name:"Tanque MBT Moderno",unit:"unidades"},{id:"mbt_standard",name:"Tanque MBT Padrão",unit:"unidades"},{id:"light_tank",name:"Tanque Leve",unit:"unidades"},{id:"heavy_tank",name:"Tanque Pesado",unit:"unidades"},{id:"artillery_howitzer",name:"Artilharia Howitzer",unit:"unidades"},{id:"artillery_rocket",name:"Artilharia de Foguetes",unit:"unidades"},{id:"apc_standard",name:"Transporte Blindado",unit:"unidades"},{id:"ifv_modern",name:"Veículo de Combate",unit:"unidades"}],naval:[{id:"destroyer_standard",name:"Destroyer Padrão",unit:"navios"},{id:"destroyer_fletcher",name:"Destroyer Classe Fletcher",unit:"navios"},{id:"cruiser_heavy",name:"Cruzador Pesado",unit:"navios"},{id:"cruiser_light",name:"Cruzador Leve",unit:"navios"},{id:"submarine_diesel",name:"Submarino Diesel-Elétrico",unit:"submarinos"},{id:"submarine_nuclear",name:"Submarino Nuclear",unit:"submarinos"},{id:"corvette_patrol",name:"Corveta de Patrulha",unit:"navios"},{id:"frigate_escort",name:"Fragata de Escolta",unit:"navios"}]}}function d(u){if(console.log(`🎯 Populando itens para categoria: ${u}`),console.log("📋 availableItems atual:",s),n.innerHTML='<option value="">Selecione um item</option>',u&&s[u]){n.disabled=!1;const p=s[u];if(console.log(`📦 Itens encontrados para ${u}:`,p),p.length===0){const f=document.createElement("option");f.value="",f.textContent="Nenhum item disponível para venda",f.disabled=!0,n.appendChild(f),n.disabled=!0}else p.forEach(f=>{console.log(`➕ Adicionando item: ${f.name} (${f.id})`);const g=document.createElement("option");g.value=f.id,g.textContent=f.name,g.dataset.unit=f.unit,g.dataset.available=f.available_quantity||f.available||"",g.dataset.cost=f.unit_cost||"",g.dataset.maintenance=f.maintenance_cost||"",n.appendChild(g)})}else console.log(`❌ Categoria ${u} não encontrada ou sem itens`),n.disabled=!0;y()}i();const l=a.querySelector("#offer-category"),n=a.querySelector("#offer-item"),c=a.querySelector("#offer-unit");l.addEventListener("change",()=>{const u=l.value;d(u)}),a.querySelectorAll('input[name="offer-type"]').forEach(u=>{u.addEventListener("change",()=>{i()})}),n.addEventListener("change",()=>{const u=n.querySelector("option:checked");u&&u.dataset.unit&&(c.value=u.dataset.unit),y()}),a.querySelectorAll("input, select, textarea").forEach(u=>{u.addEventListener("input",y),u.addEventListener("change",y)});const v=a.querySelector("#create-offer-form");v.addEventListener("submit",async u=>{u.preventDefault();const p=a.querySelector("#submit-offer-btn"),f=p.textContent;try{p.disabled=!0,p.textContent="⏳ Criando...";const g=new FormData(v),q={type:g.get("offer-type"),category:g.get("category"),item_id:g.get("item_id"),item_name:n.querySelector("option:checked")?.textContent||"",title:g.get("title"),description:g.get("description"),quantity:parseInt(g.get("quantity")),unit:g.get("unit"),price_per_unit:parseFloat(g.get("price_per_unit")),min_quantity:parseInt(g.get("min_quantity"))||1,delivery_time_days:parseInt(g.get("delivery_time_days"))||30,duration_days:parseInt(g.get("duration_days"))};if(!q.type||!q.category||!q.item_id||!q.title||!q.quantity||!q.price_per_unit)throw new Error("Preencha todos os campos obrigatórios");const k=await M.createOffer(q);if(k.success)p.textContent="✅ Criado!",p.classList.remove("bg-brand-500","hover:bg-brand-600"),p.classList.add("bg-green-600"),setTimeout(()=>{alert("Oferta criada com sucesso!"),H();const $=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",I=_.currentUser;I&&E(I.uid).then(j=>{j&&B($,j)})},1e3);else throw new Error(k.error||"Erro desconhecido ao criar oferta")}catch(g){console.error("Erro ao criar oferta:",g),p.textContent="❌ Erro",p.classList.remove("bg-brand-500","hover:bg-brand-600"),p.classList.add("bg-red-600"),alert("Erro ao criar oferta: "+g.message),setTimeout(()=>{p.textContent=f,p.classList.remove("bg-red-600"),p.classList.add("bg-brand-500","hover:bg-brand-600"),p.disabled=!1},3e3)}});function y(){const u=a.querySelector("#offer-summary"),p=a.querySelector("#offer-summary-content"),f=a.querySelector("#budget-warning"),g=a.querySelector("#item-info"),q=a.querySelector("#item-info-content"),k=new FormData(v),$=k.get("offer-type"),I=parseInt(k.get("quantity"))||0,j=parseFloat(k.get("price_per_unit"))||0,J=I*j,P=n.querySelector("option:checked");if(P&&P.value){const W=P.textContent,F=P.dataset.available,A=P.dataset.cost,D=P.dataset.maintenance;let T=`<div><strong>Item selecionado:</strong> ${W}</div>`;if($==="sell"&&F&&(T+=`<div class="text-green-400"><strong>Disponível para venda:</strong> ${parseInt(F).toLocaleString()} unidades</div>`),A&&parseFloat(A)>0&&(T+=`<div><strong>Custo de produção:</strong> ${C(parseFloat(A))} por unidade</div>`),D&&parseFloat(D)>0&&(T+=`<div><strong>Custo de manutenção:</strong> ${C(parseFloat(D))} por unidade/mês</div>`),$==="sell"&&F&&I>0){const V=parseInt(F);I>V&&(T+=`<div class="text-red-400 mt-2"><strong>⚠️ Quantidade excede o disponível!</strong><br>Máximo vendível: ${V.toLocaleString()}</div>`)}q.innerHTML=T,g.classList.remove("hidden")}else g.classList.add("hidden");if(I>0&&j>0){u.classList.remove("hidden");const W=P?.textContent||"Item",F=k.get("unit")||"unidades";let A=`
        <div><strong>Tipo:</strong> ${$==="sell"?"🔥 Venda":"💰 Compra"}</div>
        <div><strong>Item:</strong> ${W}</div>
        <div><strong>Quantidade:</strong> ${I.toLocaleString()} ${F}</div>
        <div><strong>Preço por ${F.slice(0,-1)}:</strong> ${C(j)}</div>
        <div class="font-medium text-brand-300"><strong>Valor Total:</strong> ${C(J)}</div>
      `;if($==="sell"&&cost&&parseFloat(cost)>0){const D=parseFloat(cost),T=j-D,V=T*I,ae=T>0?"text-green-400":"text-red-400";A+=`<div class="${ae}"><strong>Lucro por unidade:</strong> ${C(T)}</div>`,A+=`<div class="${ae}"><strong>Lucro total:</strong> ${C(V)}</div>`}if(p.innerHTML=A,$==="buy"){const D=O(t);J>D?(f.classList.remove("hidden"),f.querySelector(".text-sm").innerHTML=`
            Orçamento disponível: <span class="font-medium">${C(D)}</span><br>
            <span class="text-red-300">⚠️ Valor da oferta (${C(J)}) excede o orçamento disponível!</span>
          `):f.classList.add("hidden")}else f.classList.add("hidden")}else u.classList.add("hidden"),f.classList.add("hidden")}a.addEventListener("click",u=>{u.target===a&&H()}),document.addEventListener("keydown",function u(p){p.key==="Escape"&&(H(),document.removeEventListener("keydown",u))}),document.body.appendChild(a);const x=a.querySelector('input[name="offer-type"][value="sell"]');x&&(x.checked=!0,console.log('✅ Radio "Vender" selecionado por padrão')),console.log("🚀 Carregando itens iniciais para modo VENDA"),i()}window.closeCreateOfferModal=H;function Je(t,e){let a;return function(...i){const o=()=>{clearTimeout(a),t(...i)};clearTimeout(a),a=setTimeout(o,e)}}async function We(){try{const t=_.currentUser;if(!t)return;const e=await E(t.uid);if(!e)return;const a=document.createElement("div");a.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="notifications-modal",a.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">📢 Notificações Diplomáticas</h2>
            <div class="flex items-center space-x-2">
              <button onclick="markAllNotificationsAsRead()" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
                Marcar Todas como Lidas
              </button>
              <button onclick="closeNotificationsModal()" class="text-slate-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="space-y-4">
            <!-- Filter tabs -->
            <div class="flex flex-wrap gap-2 mb-4">
              <button class="notification-filter-btn active px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-brand-500/20 text-brand-400 border border-brand-400/30" data-filter="all">
                Todas
              </button>
              <button class="notification-filter-btn px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-filter="unread">
                Não Lidas
              </button>
              <button class="notification-filter-btn px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-filter="embargo">
                Embargos
              </button>
              <button class="notification-filter-btn px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-bg/50 text-slate-300 border border-bg-ring hover:bg-bg-ring/50" data-filter="transaction">
                Transações
              </button>
            </div>

            <!-- Notifications list -->
            <div id="notifications-list" class="space-y-3">
              <div class="flex items-center justify-center py-8">
                <div class="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(a),Ke(e),await Ye(e)}catch(t){console.error("Erro ao abrir modal de notificações:",t)}}function Z(){const t=document.getElementById("notifications-modal");t&&t.remove()}function Ke(t){const e=document.getElementById("notifications-modal");if(!e)return;const a=e.querySelectorAll(".notification-filter-btn");a.forEach(s=>{s.addEventListener("click",()=>{a.forEach(o=>{o.classList.remove("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),o.classList.add("bg-bg/50","text-slate-300","border-bg-ring")}),s.classList.add("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),s.classList.remove("bg-bg/50","text-slate-300","border-bg-ring");const i=s.dataset.filter;Q(i)})}),e.addEventListener("click",s=>{s.target===e&&Z()}),document.addEventListener("keydown",function s(i){i.key==="Escape"&&(Z(),document.removeEventListener("keydown",s))})}let L=[];async function Ye(t){try{const e=await h.collection("notifications").where("target_country_id","==",t).orderBy("created_at","desc").limit(50).get();L=[],e.forEach(a=>{L.push({id:a.id,...a.data()})}),ve(L)}catch(e){console.error("Erro ao carregar notificações:",e);const a=document.getElementById("notifications-list");a&&(a.innerHTML=`
        <div class="text-center py-8 text-red-400">
          <div class="text-4xl mb-2">❌</div>
          <p>Erro ao carregar notificações</p>
        </div>
      `)}}function ve(t){const e=document.getElementById("notifications-list");if(e){if(t.length===0){e.innerHTML=`
      <div class="text-center py-8 text-slate-400">
        <div class="text-4xl mb-2">📪</div>
        <p>Nenhuma notificação encontrada</p>
      </div>
    `;return}e.innerHTML=t.map(a=>Xe(a)).join("")}}function Xe(t){const e=!t.read,a=t.created_at?.toDate?t.created_at.toDate():new Date(t.created_at),s=at(a),i={embargo_applied:"🚫",embargo_lifted:"✅",transaction_created:"💰",transaction_completed:"✅",trade_offer:"📦",diplomatic:"🏛️"},o={embargo_applied:"border-red-400/30 bg-red-400/10",embargo_lifted:"border-green-400/30 bg-green-400/10",transaction_created:"border-blue-400/30 bg-blue-400/10",transaction_completed:"border-green-400/30 bg-green-400/10",trade_offer:"border-yellow-400/30 bg-yellow-400/10",diplomatic:"border-purple-400/30 bg-purple-400/10"},r=i[t.type]||"📬";return`
    <div class="notification-item bg-bg border ${o[t.type]||"border-slate-400/30 bg-slate-400/10"} rounded-lg p-4 ${e?"border-l-4 border-l-brand-400":""}"
         data-type="${t.type}" data-read="${t.read?"true":"false"}">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3 flex-1">
          <div class="text-2xl">${r}</div>
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-1">
              <h4 class="font-medium text-white">${t.title}</h4>
              ${e?'<span class="w-2 h-2 bg-brand-400 rounded-full"></span>':""}
            </div>
            <p class="text-sm text-slate-300 mb-2">${t.message}</p>
            <div class="flex items-center space-x-4 text-xs text-slate-400">
              <span>${s}</span>
              ${t.priority==="high"?'<span class="text-red-400 font-medium">• Alta Prioridade</span>':""}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          ${e?`
            <button onclick="markNotificationAsRead('${t.id}')" class="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded hover:bg-green-600/30 transition-colors">
              Marcar como Lida
            </button>
          `:""}
          <button onclick="deleteNotification('${t.id}')" class="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded hover:bg-red-600/30 transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  `}function Q(t){let e=L;t==="unread"?e=L.filter(a=>!a.read):t==="embargo"?e=L.filter(a=>a.type&&a.type.includes("embargo")):t==="transaction"&&(e=L.filter(a=>a.type&&a.type.includes("transaction"))),ve(e)}async function Ze(t){try{await h.collection("notifications").doc(t).update({read:!0,read_at:new Date});const e=L.find(s=>s.id===t);e&&(e.read=!0);const a=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";Q(a),await G()}catch(e){console.error("Erro ao marcar notificação como lida:",e)}}async function et(){try{const t=_.currentUser;if(!t||!await E(t.uid))return;const a=h.batch();L.forEach(i=>{if(!i.read){const o=h.collection("notifications").doc(i.id);a.update(o,{read:!0,read_at:new Date}),i.read=!0}}),await a.commit();const s=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";Q(s),await G()}catch(t){console.error("Erro ao marcar todas as notificações como lidas:",t)}}async function tt(t){try{if(!confirm("Tem certeza que deseja excluir esta notificação?"))return;await h.collection("notifications").doc(t).delete(),L=L.filter(a=>a.id!==t);const e=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";Q(e),await G()}catch(e){console.error("Erro ao excluir notificação:",e)}}async function G(){try{const t=_.currentUser;if(!t)return;const e=await E(t.uid);if(!e)return;const s=(await h.collection("notifications").where("target_country_id","==",e).where("read","==",!1).get()).size,i=document.getElementById("notifications-count-badge");i&&(s>0?(i.textContent=s>99?"99+":s.toString(),i.classList.remove("hidden")):i.classList.add("hidden"))}catch(t){console.error("Erro ao atualizar contador de notificações:",t)}}function at(t){const a=new Date-t,s=Math.floor(a/(1e3*60)),i=Math.floor(a/(1e3*60*60)),o=Math.floor(a/(1e3*60*60*24));return s<1?"Agora há pouco":s<60?`${s} min atrás`:i<24?`${i}h atrás`:o<7?`${o} dias atrás`:t.toLocaleDateString("pt-BR")}window.closeNotificationsModal=Z;window.markNotificationAsRead=Ze;window.markAllNotificationsAsRead=et;window.deleteNotification=tt;async function st(){try{const t=_.currentUser;if(!t)return;const e=await E(t.uid);if(!e)return;const a=document.createElement("div");a.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="embargoes-modal",a.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">🚫 Embargos Diplomáticos</h2>
            <button onclick="closeEmbargoesModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Embargos Aplicados -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Embargos que você aplicou</h3>
              <div id="applied-embargoes-list" class="space-y-3">
                <div class="flex items-center justify-center py-8">
                  <div class="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full"></div>
                </div>
              </div>
            </div>

            <!-- Embargos Recebidos -->
            <div>
              <h3 class="text-lg font-semibold text-white mb-4">Embargos contra você</h3>
              <div id="received-embargoes-list" class="space-y-3">
                <div class="flex items-center justify-center py-8">
                  <div class="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(a),await rt(e)}catch(t){console.error("Erro ao abrir modal de embargos:",t)}}async function rt(t){try{const e=await h.collection("marketplace_embargoes").where("embargo_country_id","==",t).where("status","==","active").orderBy("created_at","desc").get(),a=await h.collection("marketplace_embargoes").where("target_country_id","==",t).where("status","==","active").orderBy("created_at","desc").get(),s=[],i=[];e.forEach(d=>{s.push({id:d.id,...d.data()})}),a.forEach(d=>{i.push({id:d.id,...d.data()})});const o=document.getElementById("applied-embargoes-list");o&&(s.length===0?o.innerHTML=`
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">🕊️</div>
            <p>Nenhum embargo aplicado</p>
          </div>
        `:o.innerHTML=s.map(d=>oe(d,"applied")).join(""));const r=document.getElementById("received-embargoes-list");r&&(i.length===0?r.innerHTML=`
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">✅</div>
            <p>Nenhum embargo recebido</p>
          </div>
        `:r.innerHTML=i.map(d=>oe(d,"received")).join(""))}catch(e){console.error("Erro ao carregar dados de embargos:",e)}}function oe(t,e){const a=t.expires_at&&new Date(t.expires_at.toDate?t.expires_at.toDate():t.expires_at)<new Date(Date.now()+6048e5),s=e==="applied"?t.target_country_name:t.embargo_country_name,i=e==="applied"?"🎯":"⚠️",o=t.type==="full"?{label:"Total",color:"text-red-400 bg-red-400/20"}:{label:"Parcial",color:"text-yellow-400 bg-yellow-400/20"},r=t.created_at?.toDate?t.created_at.toDate():new Date(t.created_at),d=Math.floor((new Date-r)/(1440*60*1e3));return`
    <div class="bg-bg border border-bg-ring/70 rounded-lg p-4 ${a?"border-yellow-400/30":""}">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${i}</span>
          <div>
            <h4 class="font-medium text-white">${s}</h4>
            <span class="px-2 py-1 rounded text-xs font-medium ${o.color}">
              ${o.label}
            </span>
          </div>
        </div>
        ${e==="applied"?`
          <button onclick="liftEmbargo('${t.id}')" class="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors">
            Suspender
          </button>
        `:""}
      </div>

      <p class="text-sm text-slate-400 mb-2">${t.reason||"Sem motivo especificado"}</p>

      ${t.type==="partial"&&t.categories_blocked?`
        <div class="mb-2">
          <span class="text-xs text-slate-500">Categorias bloqueadas:</span>
          <div class="flex gap-1 mt-1">
            ${t.categories_blocked.map(l=>{const n={resources:"🏭",vehicles:"🚗",naval:"🚢"},c={resources:"Recursos",vehicles:"Veículos",naval:"Naval"};return`<span class="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">${n[l]} ${c[l]}</span>`}).join("")}
          </div>
        </div>
      `:""}

      <div class="flex justify-between text-xs text-slate-500">
        <span>Há ${d} dias</span>
        ${t.expires_at?`
          <span class="${a?"text-yellow-400":""}">
            Expira ${t.expires_at?"em breve":"indefinido"}
          </span>
        `:"<span>Indefinido</span>"}
      </div>
    </div>
  `}async function ot(){try{const t=_.currentUser;if(!t)return;const e=await E(t.uid);if(!e)return;const a=await h.collection("paises").get(),s=[];a.forEach(o=>{const r=o.data();o.id!==e&&s.push({id:o.id,name:r.Pais,flag:r.Flag||"🏳️"})});const i=document.createElement("div");i.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",i.id="create-embargo-modal",i.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-md w-full">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">🚫 Aplicar Embargo</h2>
            <button onclick="closeCreateEmbargoModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form id="create-embargo-form" class="p-6 space-y-4">
          <!-- Target Country -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">País alvo</label>
            <select id="target-country" required class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              <option value="">Selecione um país</option>
              ${s.map(o=>`
                <option value="${o.id}">${o.flag} ${o.name}</option>
              `).join("")}
            </select>
          </div>

          <!-- Embargo Type -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Tipo de embargo</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="radio" name="embargo-type" value="full" checked class="mr-2 text-brand-400">
                <span class="text-white">Total - Bloqueia todas as categorias</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="embargo-type" value="partial" class="mr-2 text-brand-400">
                <span class="text-white">Parcial - Bloqueia categorias específicas</span>
              </label>
            </div>
          </div>

          <!-- Categories (for partial embargo) -->
          <div id="categories-section" class="hidden">
            <label class="block text-sm font-medium text-slate-300 mb-2">Categorias bloqueadas</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input type="checkbox" name="blocked-categories" value="resources" class="mr-2 text-brand-400">
                <span class="text-white">🏭 Recursos</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" name="blocked-categories" value="vehicles" class="mr-2 text-brand-400">
                <span class="text-white">🚗 Veículos</span>
              </label>
              <label class="flex items-center">
                <input type="checkbox" name="blocked-categories" value="naval" class="mr-2 text-brand-400">
                <span class="text-white">🚢 Naval</span>
              </label>
            </div>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Motivo</label>
            <textarea id="embargo-reason" placeholder="Descreva o motivo do embargo..." class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white placeholder-slate-400 focus:border-brand-400 focus:outline-none resize-none" rows="3"></textarea>
          </div>

          <!-- Duration -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Duração</label>
            <select id="embargo-duration" class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
              <option value="">Indefinido</option>
              <option value="7">7 dias</option>
              <option value="14">14 dias</option>
              <option value="30">30 dias</option>
              <option value="90">90 dias</option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="button" onclick="closeCreateEmbargoModal()" class="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
              Cancelar
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
              Aplicar Embargo
            </button>
          </div>
        </form>
      </div>
    `,document.body.appendChild(i),it()}catch(t){console.error("Erro ao abrir modal de criar embargo:",t)}}function it(){const t=document.querySelectorAll('input[name="embargo-type"]'),e=document.getElementById("categories-section");t.forEach(s=>{s.addEventListener("change",()=>{s.value==="partial"?e.classList.remove("hidden"):e.classList.add("hidden")})});const a=document.getElementById("create-embargo-form");a&&a.addEventListener("submit",nt)}async function nt(t){t.preventDefault();try{const e=new FormData(t.target),a=document.getElementById("target-country").value,s=e.get("embargo-type"),i=document.getElementById("embargo-reason").value,o=document.getElementById("embargo-duration").value;if(!a){alert("Selecione um país alvo");return}let r=[];if(s==="partial"){const b=document.querySelectorAll('input[name="blocked-categories"]:checked');if(r=Array.from(b).map(v=>v.value),r.length===0){alert("Selecione pelo menos uma categoria para embargo parcial");return}}let d=null;o&&(d=new Date(Date.now()+parseInt(o)*24*60*60*1e3));const l={target_country_id:a,type:s,categories_blocked:r,reason:i||"Motivos diplomáticos",expires_at:d},n=t.target.querySelector('button[type="submit"]'),c=n.textContent;n.textContent="Aplicando...",n.disabled=!0;const m=await M.applyEmbargo(l);if(m.success){alert("Embargo aplicado com sucesso!"),lt();const b=_.currentUser;if(b){const v=await E(b.uid);if(v){const y=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all";B(y,v),ge(v)}}}else throw new Error(m.error)}catch(e){console.error("Erro ao aplicar embargo:",e),alert(`Erro ao aplicar embargo: ${e.message}`);const a=t.target.querySelector('button[type="submit"]');a.textContent="Aplicar Embargo",a.disabled=!1}}function lt(){const t=document.getElementById("create-embargo-modal");t&&t.remove()}async function ge(t){try{const e=await Y(t),a=document.getElementById("embargo-status-indicator"),s=document.getElementById("embargo-count-badge");if(!a||!s)return;if(e.hasEmbargoes){const i=e.hasFullEmbargo?"todas as categorias":`${e.blockedCategories.length} categoria(s)`;a.innerHTML=`
        <div class="flex items-center gap-2 text-red-400 text-sm">
          <span class="animate-pulse">⚠️</span>
          <span>${e.totalEmbargoes} embargo(s) ativo(s) bloqueando ${i}</span>
        </div>
      `,s.textContent=e.totalEmbargoes,s.classList.remove("hidden")}else a.innerHTML=`
        <div class="flex items-center gap-2 text-green-400 text-sm">
          <span>✅</span>
          <span>Nenhum embargo ativo</span>
        </div>
      `,s.classList.add("hidden")}catch(e){console.error("Erro ao atualizar indicador de embargo:",e)}}function dt(){const t=document.getElementById("toggle-advanced-filters"),e=document.getElementById("advanced-filters-panel"),a=document.getElementById("advanced-filters-icon");t&&e&&a&&t.addEventListener("click",()=>{e.classList.toggle("hidden"),a.classList.toggle("rotate-180")});const s=document.getElementById("apply-filters-btn"),i=document.getElementById("clear-filters-btn"),o=document.getElementById("save-filters-btn");s&&s.addEventListener("click",fe),i&&i.addEventListener("click",ct),o&&o.addEventListener("click",ut),mt()}async function fe(){const t=_.currentUser;if(!t)return;const e=await E(t.uid);if(!e)return;we();const a=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all";await B(a,e)}function ct(){document.getElementById("marketplace-search").value="",document.getElementById("marketplace-sort").value="date",document.getElementById("marketplace-type").value="all",document.getElementById("price-min").value="",document.getElementById("price-max").value="",document.getElementById("quantity-min").value="",document.getElementById("quantity-max").value="",document.getElementById("country-filter").value="",document.getElementById("time-filter").value="",fe()}function ut(){const t={search:document.getElementById("marketplace-search").value,sort:document.getElementById("marketplace-sort").value,type:document.getElementById("marketplace-type").value,priceMin:document.getElementById("price-min").value,priceMax:document.getElementById("price-max").value,quantityMin:document.getElementById("quantity-min").value,quantityMax:document.getElementById("quantity-max").value,country:document.getElementById("country-filter").value,timeFilter:document.getElementById("time-filter").value};localStorage.setItem("marketplace-filters",JSON.stringify(t));const e=document.getElementById("save-filters-btn"),a=e.textContent;e.textContent="✅ Salvo!",e.disabled=!0,setTimeout(()=>{e.textContent=a,e.disabled=!1},2e3)}function mt(){try{const t=localStorage.getItem("marketplace-filters");if(!t)return;const e=JSON.parse(t);e.search&&(document.getElementById("marketplace-search").value=e.search),e.sort&&(document.getElementById("marketplace-sort").value=e.sort),e.type&&(document.getElementById("marketplace-type").value=e.type),e.priceMin&&(document.getElementById("price-min").value=e.priceMin),e.priceMax&&(document.getElementById("price-max").value=e.priceMax),e.quantityMin&&(document.getElementById("quantity-min").value=e.quantityMin),e.quantityMax&&(document.getElementById("quantity-max").value=e.quantityMax),e.country&&(document.getElementById("country-filter").value=e.country),e.timeFilter&&(document.getElementById("time-filter").value=e.timeFilter)}catch(t){console.error("Erro ao carregar filtros salvos:",t)}}async function pt(){try{const t=await h.collection("paises").get(),e=document.getElementById("country-filter");if(!e)return;for(;e.children.length>1;)e.removeChild(e.lastChild);const a=[];t.forEach(s=>{const i=s.data();a.push({id:s.id,name:i.Pais,flag:i.Flag||"🏳️"})}),a.sort((s,i)=>s.name.localeCompare(i.name)),a.forEach(s=>{const i=document.createElement("option");i.value=s.id,i.textContent=`${s.flag} ${s.name}`,e.appendChild(i)})}catch(t){console.error("Erro ao carregar países para filtro:",t)}}let ee=1,N=!1,R=!1,z=null;function bt(t,e,a){const s=document.getElementById("load-more-btn"),i=document.getElementById("infinite-scroll-toggle"),o=document.getElementById("infinite-scroll-icon");z={...a,countryId:t,category:e},s&&s.addEventListener("click",()=>{xe()}),i&&o&&(i.addEventListener("click",()=>{N=!N,N?(o.textContent="♾️",i.title="Carregamento automático ativado",vt()):(o.textContent="🔄",i.title="Carregamento automático desativado",ye()),localStorage.setItem("marketplace-infinite-scroll",N)}),localStorage.getItem("marketplace-infinite-scroll")==="true"&&i.click())}async function xe(){if(R||!z)return;R=!0;const t=document.getElementById("load-more-btn"),e=document.getElementById("load-more-state"),a=document.getElementById("offers-grid");t&&(t.disabled=!0),e&&e.classList.remove("hidden");try{ee++;const s={...z,limit:20,offset:(ee-1)*20},i=await M.getOffers(s);if(i.success&&i.offers.length>0){const o=i.offers.map(l=>be(l)).join("");a&&(a.innerHTML+=o);const r=a?.children.length||0,d=document.querySelector(".text-sm.text-slate-400");d&&(d.textContent=`Mostrando ${r} ofertas`),i.offers.length<20&&t&&(t.textContent="✅ Todas as ofertas carregadas",t.disabled=!0)}else t&&(t.textContent="✅ Todas as ofertas carregadas",t.disabled=!0)}catch(s){console.error("Erro ao carregar mais ofertas:",s),t&&(t.disabled=!1)}finally{R=!1,e&&e.classList.add("hidden")}}function vt(){ye(),window.addEventListener("scroll",he)}function ye(){window.removeEventListener("scroll",he)}function he(){if(!N||R)return;const t=window.innerHeight+window.scrollY,e=document.documentElement.offsetHeight;if(t>=e-200){const s=document.getElementById("load-more-btn");s&&!s.disabled&&xe()}}function we(){ee=1,R=!1,z=null}function _e(){try{const t=localStorage.getItem("marketplace-favorites");return t?JSON.parse(t):[]}catch(t){return console.error("Erro ao carregar favoritos:",t),[]}}function gt(t){return _e().includes(t)}function ft(t){t.forEach(e=>{const a=document.getElementById(`favorite-btn-${e.id}`),s=document.getElementById(`favorite-icon-${e.id}`);a&&s&&(gt(e.id)?(a.classList.remove("bg-slate-600/20","text-slate-400"),a.classList.add("bg-yellow-500/20","text-yellow-400"),a.title="Remover dos favoritos",s.textContent="🌟"):(a.classList.remove("bg-yellow-500/20","text-yellow-400"),a.classList.add("bg-slate-600/20","text-slate-400"),a.title="Adicionar aos favoritos",s.textContent="⭐"))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",re):re();
