const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/recurringOrdersSystem-BpJp6SUZ.js","assets/firebase-BARDcBiw.js","assets/preload-helper-f85Crcwt.js","assets/resourceMapping-CNM62YsJ.js","assets/renderer-BVNBaHoK.js","assets/resourceConsumptionCalculator-dQu245X_.js","assets/resourceProductionCalculator-b8MxHWSv.js","assets/consumerGoodsCalculator-Bg6C08yH.js","assets/espionageOperationsSystem-yA0URGjb.js"])))=>i.map(i=>d[i]);
import{_ as A}from"./preload-helper-f85Crcwt.js";/* empty css             */import{a as y,f as h,h as g,g as X}from"./firebase-BARDcBiw.js";import{E as fe}from"./economicCalculations-CFI81dyR.js";import{C as xe}from"./consumerGoodsCalculator-Bg6C08yH.js";import{R as Z}from"./resourceConsumptionCalculator-dQu245X_.js";import{R as ee}from"./resourceProductionCalculator-b8MxHWSv.js";import{S as te}from"./shipyardSystem-3T5A70zK.js";import{g as ae,a as G,R as J,b as ye}from"./resourceMapping-CNM62YsJ.js";import{g as K}from"./renderer-BVNBaHoK.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";import"./espionageOperationsSystem-yA0URGjb.js";class Q{constructor(){this.collections={offers:"marketplace_offers",transactions:"marketplace_transactions",embargoes:"marketplace_embargoes",orders:"marketplace_orders"}}getOfferSchema(){return{id:"string",type:"string",category:"string",title:"string",description:"string",item_id:"string",item_name:"string",quantity:"number",unit:"string",price_per_unit:"number",total_value:"number",country_id:"string",country_name:"string",country_flag:"string",player_id:"string",status:"string",created_at:"timestamp",updated_at:"timestamp",expires_at:"timestamp",min_quantity:"number",max_quantity:"number",delivery_time_days:"number",views:"number",interested_countries:"array",tech_level_required:"number",diplomatic_status_required:"string"}}getTransactionSchema(){return{id:"string",offer_id:"string",seller_country_id:"string",seller_country_name:"string",seller_player_id:"string",buyer_country_id:"string",buyer_country_name:"string",buyer_player_id:"string",item_id:"string",item_name:"string",quantity:"number",unit:"string",price_per_unit:"number",total_value:"number",status:"string",created_at:"timestamp",confirmed_at:"timestamp",completed_at:"timestamp",delivery_deadline:"timestamp",status_history:"array",delivery_time_days:"number",delivery_status:"string",negotiated_price:"boolean",original_price_per_unit:"number",discount_percent:"number"}}getEmbargoSchema(){return{id:"string",embargo_country_id:"string",embargo_country_name:"string",target_country_id:"string",target_country_name:"string",type:"string",categories_blocked:"array",reason:"string",created_at:"timestamp",expires_at:"timestamp",status:"string",created_by_player_id:"string",notifications_sent:"boolean"}}getOrderSchema(){return{id:"string",country_id:"string",country_name:"string",player_id:"string",type:"string",item_id:"string",item_name:"string",category:"string",quantity:"number",unit:"string",max_price_per_unit:"number",min_price_per_unit:"number",is_recurring:"boolean",recurrence_type:"string",recurrence_interval:"number",max_executions:"number",executions_count:"number",status:"string",created_at:"timestamp",last_execution:"timestamp",next_execution:"timestamp",auto_execute:"boolean",require_confirmation:"boolean",execution_history:"array"}}async createOffer(e){try{const a=y.currentUser;if(!a)throw new Error("Usuário não autenticado");const s=await h(a.uid);if(!s)throw new Error("Jogador não associado a um país");const o=await this.validateOfferData(e,s,a.uid),i={...o,country_id:s,player_id:a.uid,created_at:new Date,updated_at:new Date,expires_at:new Date(Date.now()+o.duration_days*24*60*60*1e3),status:"active",views:0,interested_countries:[]},r=await g.collection(this.collections.offers).add(i);return{success:!0,offerId:r.id,offer:{id:r.id,...i}}}catch(a){return console.error("Erro ao criar oferta:",a),{success:!1,error:a.message}}}async validateOfferData(e,a,s){if(!e.type||!["sell","buy"].includes(e.type))throw new Error("Tipo de oferta inválido");if(!e.category||!["resources","vehicles","naval"].includes(e.category))throw new Error("Categoria inválida");if(!e.title||e.title.trim().length<3)throw new Error("Título deve ter pelo menos 3 caracteres");if(!e.quantity||e.quantity<=0)throw new Error("Quantidade deve ser maior que zero");if(!e.price_per_unit||e.price_per_unit<=0)throw new Error("Preço deve ser maior que zero");const o=await g.collection("paises").doc(a).get();if(!o.exists)throw new Error("País não encontrado");const i=o.data();e.type==="sell"?(await this.validateSellOfferAvailability(e,a),await this.validateSellOffer(e,i)):await this.validateBuyOffer(e,i);const r=e.quantity*e.price_per_unit;return{type:e.type,category:e.category,title:e.title.trim(),description:(e.description||"").trim(),item_id:e.item_id,item_name:e.item_name,quantity:e.quantity,unit:e.unit,price_per_unit:e.price_per_unit,total_value:r,country_name:i.Pais,country_flag:i.Flag||"🏳️",delivery_time_days:e.delivery_time_days||30,min_quantity:e.min_quantity||1,max_quantity:e.max_quantity||e.quantity,tech_level_required:e.tech_level_required||0,duration_days:e.duration_days||30}}async validateSellOffer(e,a){if(e.category!=="resources"){if(e.category==="vehicles"||e.category==="naval"){const s=await g.collection("inventory").doc(a.id||e.country_id).get();s.exists&&s.data()}}}async validateBuyOffer(e,a){const s=this.calculateCountryBudget(a),o=e.quantity*e.price_per_unit;if(s<o)throw new Error(`Orçamento insuficiente. Necessário: $${o.toLocaleString()}, Disponível: $${s.toLocaleString()}`)}calculateCountryBudget(e){const a=parseFloat(e.PIB)||0,s=(parseFloat(e.Burocracia)||0)/100,o=(parseFloat(e.Estabilidade)||0)/100;return a*.25*s*(o*1.5)}async getOffers(e={}){try{const a=g.collection(this.collections.offers);let s=[],o;try{console.info("🔍 Buscando ofertas usando filtragem client-side (sem índices)"),o=await a.get()}catch(l){console.warn("Falha ao buscar todos os documentos, tentando listagem:",l);try{const c=(await a.listDocuments()).slice(0,100).map(p=>p.get()),u=await Promise.all(c);o={docs:u.filter(p=>p.exists),size:u.filter(p=>p.exists).length,empty:u.filter(p=>p.exists).length===0,forEach:function(p){this.docs.forEach(p)}}}catch(n){console.warn("Listagem de documentos falhou, retornando resultados vazios:",n),o={docs:[],size:0,empty:!0,forEach:function(){}}}}o.forEach(l=>{const n=l.data();if(n.status!=="active")return;const c=n.expires_at?.toDate?n.expires_at.toDate():new Date(n.expires_at);c&&c<=new Date||s.push({id:l.id,...n})});let i=s;if(e.category&&e.category!=="all"&&(i=i.filter(l=>l.category===e.category)),e.type&&e.type!=="all"&&(i=i.filter(l=>l.type===e.type)),e.seller_id&&(i=i.filter(l=>l.seller_id===e.seller_id)),e.buyer_id&&(i=i.filter(l=>l.buyer_id===e.buyer_id)),e.searchTerm){const l=e.searchTerm.toLowerCase();i=i.filter(n=>n.title&&n.title.toLowerCase().includes(l)||n.description&&n.description.toLowerCase().includes(l)||n.item_name&&n.item_name.toLowerCase().includes(l)||n.country_name&&n.country_name.toLowerCase().includes(l))}e.priceMin!==null&&e.priceMin!==void 0&&(i=i.filter(l=>l.price_per_unit>=e.priceMin)),e.priceMax!==null&&e.priceMax!==void 0&&(i=i.filter(l=>l.price_per_unit<=e.priceMax)),e.quantityMin!==null&&e.quantityMin!==void 0&&(i=i.filter(l=>l.quantity>=e.quantityMin)),e.quantityMax!==null&&e.quantityMax!==void 0&&(i=i.filter(l=>l.quantity<=e.quantityMax));const r=e.orderBy||"created_at",d=e.orderDirection||"desc";if(i.sort((l,n)=>{let c=l[r],u=n[r];return r.includes("_at")&&c&&u&&(c=c.toDate?c.toDate():new Date(c),u=u.toDate?u.toDate():new Date(u)),typeof c=="string"&&!isNaN(c)&&(c=parseFloat(c)),typeof u=="string"&&!isNaN(u)&&(u=parseFloat(u)),d==="desc"?u>c?1:u<c?-1:0:c>u?1:c<u?-1:0}),e.countryFilter&&(i=i.filter(l=>l.country_id===e.countryFilter)),e.timeFilter!==null&&e.timeFilter!==void 0){const l=new Date,n=new Date(l.getTime()+e.timeFilter*24*60*60*1e3);i=i.filter(c=>(c.expires_at?.toDate?c.expires_at.toDate():new Date(c.expires_at))<=n)}return i=await this.filterEmbargoedOffers(i,e.current_country_id),e.limit&&i.length>e.limit&&(i=i.slice(0,e.limit)),console.info(`✅ Ofertas filtradas: ${i.length} encontradas usando filtragem client-side`),{success:!0,offers:i,total:i.length,totalCount:i.length}}catch(a){return console.error("Erro ao buscar ofertas:",a),{success:!1,error:a.message,offers:[]}}}async filterEmbargoedOffers(e,a){if(!a)return e;try{const s=await g.collection(this.collections.embargoes).where("status","==","active").where("target_country_id","==",a).get(),o=[];return s.forEach(i=>{o.push(i.data())}),o.length===0?e:e.filter(i=>{const r=o.find(d=>d.embargo_country_id===i.country_id);return r?r.type==="full"?!1:r.type==="partial"&&r.categories_blocked?!r.categories_blocked.includes(i.category):!0:!0})}catch(s){return console.error("Erro ao verificar embargos:",s),e}}async incrementOfferViews(e){try{const a=g.collection(this.collections.offers).doc(e),s=await a.get();if(s.exists){const o=s.data().views||0;await a.update({views:o+1,updated_at:new Date})}}catch(a){console.error("Erro ao incrementar visualizações:",a)}}async createTransaction(e,a){try{const s=y.currentUser;if(!s)throw new Error("Usuário não autenticado");const o=await h(s.uid);if(!o)throw new Error("Jogador não associado a um país");const i=await g.collection(this.collections.offers).doc(e).get();if(!i.exists)throw new Error("Oferta não encontrada");const r=i.data();if(r.status!=="active")throw new Error("Oferta não está ativa");const d=a.quantity||r.quantity;if(d>r.quantity)throw new Error("Quantidade solicitada excede disponível");if(d<r.min_quantity)throw new Error(`Quantidade mínima: ${r.min_quantity}`);if(d>r.max_quantity)throw new Error(`Quantidade máxima: ${r.max_quantity}`);const n=(await g.collection("paises").doc(o).get()).data(),c=d*r.price_per_unit;if(this.calculateCountryBudget(n)<c)throw new Error("Orçamento insuficiente");const p={offer_id:e,seller_country_id:r.country_id,seller_country_name:r.country_name,seller_player_id:r.player_id,buyer_country_id:o,buyer_country_name:n.Pais,buyer_player_id:s.uid,item_id:r.item_id,item_name:r.item_name,quantity:d,unit:r.unit,price_per_unit:r.price_per_unit,total_value:c,status:"pending",created_at:new Date,delivery_deadline:new Date(Date.now()+r.delivery_time_days*24*60*60*1e3),delivery_time_days:r.delivery_time_days,delivery_status:"pending",status_history:[{status:"pending",timestamp:new Date,note:"Transação criada"}],negotiated_price:!1,original_price_per_unit:r.price_per_unit,discount_percent:0},m=await g.collection(this.collections.transactions).add(p);return await g.collection(this.collections.offers).doc(e).update({quantity:r.quantity-d,updated_at:new Date,status:r.quantity-d===0?"completed":"active"}),{success:!0,transactionId:m.id,transaction:{id:m.id,...p}}}catch(s){return console.error("Erro ao criar transação:",s),{success:!1,error:s.message}}}async applyEmbargo(e){try{const a=y.currentUser;if(!a)throw new Error("Usuário não autenticado");const s=await h(a.uid);if(!s)throw new Error("Jogador não associado a um país");const i=(await g.collection("paises").doc(s).get()).data(),r=await g.collection("paises").doc(e.target_country_id).get();if(!r.exists)throw new Error("País alvo não encontrado");const d=r.data();if(!(await g.collection(this.collections.embargoes).where("embargo_country_id","==",s).where("target_country_id","==",e.target_country_id).where("status","==","active").get()).empty)throw new Error("Já existe um embargo ativo contra este país");const n={embargo_country_id:s,embargo_country_name:i.Pais,target_country_id:e.target_country_id,target_country_name:d.Pais,type:e.type||"full",categories_blocked:e.categories_blocked||[],reason:e.reason||"Motivos diplomáticos",created_at:new Date,expires_at:e.expires_at||null,status:"active",created_by_player_id:a.uid,notifications_sent:!1},c=await g.collection(this.collections.embargoes).add(n);return await this.sendEmbargoNotification(n,c.id),{success:!0,embargoId:c.id,embargo:{id:c.id,...n}}}catch(a){return console.error("Erro ao aplicar embargo:",a),{success:!1,error:a.message}}}async sendEmbargoNotification(e,a){try{const s={type:"embargo_applied",embargo_id:a,target_country_id:e.target_country_id,target_country_name:e.target_country_name,embargo_country_id:e.embargo_country_id,embargo_country_name:e.embargo_country_name,embargo_type:e.type,categories_blocked:e.categories_blocked||[],reason:e.reason,created_at:new Date,read:!1,expires_at:e.expires_at,title:`🚫 Embargo Aplicado por ${e.embargo_country_name}`,message:this.getEmbargoNotificationMessage(e),priority:"high"};await g.collection("notifications").add(s),await g.collection(this.collections.embargoes).doc(a).update({notifications_sent:!0}),console.log(`Notificação de embargo enviada para ${e.target_country_name}`)}catch(s){console.error("Erro ao enviar notificação de embargo:",s)}}getEmbargoNotificationMessage(e){const a=e.type==="full"?"total":"parcial";let s=`${e.embargo_country_name} aplicou um embargo ${a} contra seu país.`;if(e.type==="partial"&&e.categories_blocked&&e.categories_blocked.length>0){const o={resources:"Recursos",vehicles:"Veículos",naval:"Naval"},i=e.categories_blocked.map(r=>o[r]||r);s+=` Categorias bloqueadas: ${i.join(", ")}.`}else e.type==="full"&&(s+=" Todas as trocas comerciais estão bloqueadas.");if(e.reason&&e.reason!=="Motivos diplomáticos"&&(s+=` Motivo: ${e.reason}`),e.expires_at){const o=new Date(e.expires_at),i=Math.ceil((o-new Date)/(1440*60*1e3));s+=` O embargo expira em ${i} dias.`}else s+=" O embargo é por tempo indefinido.";return s}async getEmbargoNotifications(e,a=10){try{const s=await g.collection("notifications").where("target_country_id","==",e).where("type","==","embargo_applied").orderBy("created_at","desc").limit(a).get(),o=[];return s.forEach(i=>{o.push({id:i.id,...i.data()})}),{success:!0,notifications:o}}catch(s){return console.error("Erro ao buscar notificações:",s),{success:!1,error:s.message,notifications:[]}}}async markNotificationAsRead(e){try{return await g.collection("notifications").doc(e).update({read:!0,read_at:new Date}),{success:!0}}catch(a){return console.error("Erro ao marcar notificação como lida:",a),{success:!1,error:a.message}}}async getCountryInventory(e){try{const a=await g.collection("inventory").doc(e).get();return a.exists?a.data():{}}catch(a){return console.error("Erro ao buscar inventário:",a),{}}}async getCountryData(e){try{const a=await g.collection("paises").doc(e).get();return a.exists?{id:e,...a.data()}:null}catch(a){return console.error("Erro ao buscar dados do país:",a),null}}calculateAvailableResources(e){console.log("🔍 Debug: Dados do país recebidos:",e),console.log("📊 Usando recursos REAIS do dashboard (não calculados)"),console.log("🔍 Recursos reais no país:"),console.log("  - Carvao:",e.Carvao),console.log("  - Combustivel:",e.Combustivel),console.log("  - Metais:",e.Metais),console.log("  - Graos:",e.Graos);const a={Carvao:Math.max(0,Math.floor((parseFloat(e.Carvao)||0)*.5)),Combustivel:Math.max(0,Math.floor((parseFloat(e.Combustivel)||0)*.5)),Metais:Math.max(0,Math.floor((parseFloat(e.Metais)||0)*.5)),Graos:Math.max(0,Math.floor((parseFloat(e.Graos)||0)*.5))};return console.log("📦 Recursos REAIS disponíveis para venda (50% do estoque):",a),a}getAvailableEquipment(e){const a=[];return Object.keys(e).forEach(s=>{typeof e[s]=="object"&&e[s]!==null&&Object.keys(e[s]).forEach(o=>{const i=e[s][o];if(i&&typeof i=="object"&&i.quantity>0){const r=Math.floor(i.quantity*.5);r>0&&a.push({id:`${s}_${o}`.toLowerCase().replace(/\s+/g,"_"),name:o,category:s,available_quantity:r,total_quantity:i.quantity,unit_cost:i.cost||0,maintenance_cost:(i.cost||0)*.05||0,type:this.getEquipmentType(s)})}})}),a}getEquipmentType(e){return["Couraçados","Cruzadores","Destróieres","Fragatas","Corvetas","Submarinos","Porta-aviões","Patrulhas","Auxiliares","Naval - Outros"].includes(e)?"naval":"vehicles"}async validateSellOfferAvailability(e,a){const s=await this.getCountryData(a);if(!s)throw new Error("Dados do país não encontrados");return e.category==="resources"?this.validateResourceAvailability(e,s):this.validateEquipmentAvailability(e,a)}validateResourceAvailability(e,a){console.log("🔍 Validando disponibilidade de recurso:",e.item_id);const s=ae(e.item_id);if(!s)throw console.error("❌ Tipo de recurso não reconhecido:",e.item_id),new Error(`Tipo de recurso não reconhecido: ${e.item_id}`);console.log("✅ Configuração de mercado encontrada:",s);const o=G(e.item_id);if(!o)throw new Error(`Não foi possível mapear ${e.item_id} para recurso do jogo`);if(console.log("📊 Recurso do jogo mapeado:",o),!window.ResourceProductionCalculator||!window.ResourceConsumptionCalculator)throw console.error("❌ Calculadores de recursos não encontrados"),new Error("Sistema de cálculo de recursos não está disponível");const i=window.ResourceProductionCalculator.calculateCountryProduction(a),r=window.ResourceConsumptionCalculator.calculateCountryConsumption(a),d=i[o]||0,l=r[o]||0,n=Math.max(0,Math.round(d-l));if(console.log(`📈 Produção de ${o}:`,d),console.log(`📉 Consumo de ${o}:`,l),console.log("💰 Disponível para venda:",n),e.quantity>n)throw new Error(`Quantidade insuficiente. Disponível: ${n.toLocaleString()} ${s.defaultUnit} de ${s.displayName}`);return console.log("✅ Validação de recurso passou!"),{valid:!0,available:n,resourceType:o,marketType:e.item_id,unit:s.defaultUnit}}async validateEquipmentAvailability(e,a){const s=await this.getCountryInventory(a),i=this.getAvailableEquipment(s).find(r=>r.id===e.item_id);if(!i)throw new Error(`Equipamento "${e.item_name}" não encontrado no inventário ou indisponível para venda`);if(e.quantity>i.available_quantity)throw new Error(`Quantidade insuficiente. Disponível para venda: ${i.available_quantity} de ${i.total_quantity} unidades totais`);return{valid:!0,equipment:i,availableQuantity:i.available_quantity,totalQuantity:i.total_quantity}}async createTestOffers(){try{console.log("🧪 Criando ofertas de teste...");const e=[{type:"sell",category:"resources",title:"Aço de Alta Qualidade",description:"Aço especializado para construção naval e industrial",item_id:"steel_high_grade",item_name:"Aço de Alta Qualidade",quantity:5e3,unit:"toneladas",price_per_unit:850,total_value:5e3*850,country_id:"test_country_1",country_name:"Estados Unidos",country_flag:"🇺🇸",player_id:"test_player_1",status:"active",created_at:new Date,updated_at:new Date,expires_at:new Date(Date.now()+10080*60*1e3),delivery_time_days:30,min_quantity:100,max_quantity:5e3,views:23,interested_countries:[]},{type:"buy",category:"vehicles",title:"Tanques MBT Modernos",description:"Procurando tanques de batalha principais para modernização das forças armadas",item_id:"mbt_modern",item_name:"Tanque MBT Moderno",quantity:50,unit:"unidades",price_per_unit:25e5,total_value:50*25e5,country_id:"test_country_2",country_name:"Brasil",country_flag:"🇧🇷",player_id:"test_player_2",status:"active",created_at:new Date(Date.now()-1440*60*1e3),updated_at:new Date(Date.now()-1440*60*1e3),expires_at:new Date(Date.now()+336*60*60*1e3),delivery_time_days:45,min_quantity:5,max_quantity:50,views:45,interested_countries:[]},{type:"sell",category:"naval",title:"Destroyers Classe Fletcher",description:"Destroyers modernizados, prontos para serviço imediato",item_id:"destroyer_fletcher",item_name:"Destroyer Classe Fletcher",quantity:3,unit:"navios",price_per_unit:18e7,total_value:3*18e7,country_id:"test_country_3",country_name:"Reino Unido",country_flag:"🇬🇧",player_id:"test_player_3",status:"active",created_at:new Date(Date.now()-4320*60*1e3),updated_at:new Date(Date.now()-4320*60*1e3),expires_at:new Date(Date.now()+504*60*60*1e3),delivery_time_days:60,min_quantity:1,max_quantity:3,views:67,interested_countries:[]},{type:"sell",category:"resources",title:"Petróleo Refinado",description:"Combustível de alta octanagem para aviação militar",item_id:"oil_aviation",item_name:"Petróleo de Aviação",quantity:1e4,unit:"barris",price_per_unit:120,total_value:1e4*120,country_id:"test_country_4",country_name:"Arábia Saudita",country_flag:"🇸🇦",player_id:"test_player_4",status:"active",created_at:new Date(Date.now()-2880*60*1e3),updated_at:new Date(Date.now()-2880*60*1e3),expires_at:new Date(Date.now()+14400*60*1e3),delivery_time_days:15,min_quantity:500,max_quantity:1e4,views:89,interested_countries:[]},{type:"buy",category:"naval",title:"Submarinos Diesel-Elétricos",description:"Necessitamos de submarinos para patrulha costeira",item_id:"submarine_diesel",item_name:"Submarino Diesel-Elétrico",quantity:2,unit:"submarinos",price_per_unit:45e6,total_value:2*45e6,country_id:"test_country_5",country_name:"Argentina",country_flag:"🇦🇷",player_id:"test_player_5",status:"active",created_at:new Date(Date.now()-5760*60*1e3),updated_at:new Date(Date.now()-5760*60*1e3),expires_at:new Date(Date.now()+720*60*60*1e3),delivery_time_days:90,min_quantity:1,max_quantity:2,views:12,interested_countries:[]}];for(const a of e)await g.collection(this.collections.offers).add(a);return console.log(`✅ ${e.length} ofertas de teste criadas com sucesso!`),{success:!0,count:e.length}}catch(e){return console.error("❌ Erro ao criar ofertas de teste:",e),{success:!1,error:e.message}}}async clearTestOffers(){try{console.log("🗑️ Removendo ofertas de teste...");const e=await g.collection(this.collections.offers).where("player_id",">=","test_player_").where("player_id","<","test_player_z").get(),a=g.batch();return e.docs.forEach(s=>{a.delete(s.ref)}),await a.commit(),console.log(`✅ ${e.docs.length} ofertas de teste removidas!`),{success:!0,count:e.docs.length}}catch(e){return console.error("❌ Erro ao remover ofertas de teste:",e),{success:!1,error:e.message}}}async cancelOffer(e){const a=y.currentUser;if(!a)return{success:!1,error:"Usuário não autenticado."};const s=g.collection(this.collections.offers).doc(e);try{return await g.runTransaction(async o=>{const i=await o.get(s);if(!i.exists)throw new Error("Oferta não encontrada.");const r=i.data();if(r.player_id!==a.uid)throw new Error("Você não tem permissão para cancelar esta oferta.");if(r.type!=="sell")throw new Error("Apenas ofertas de venda podem ser canceladas.");if(r.status!=="active")throw new Error(`A oferta não está mais ativa (status: ${r.status}).`);if(r.category==="resources"){const d=g.collection("paises").doc(r.country_id),l=G(r.item_id);if(!l)throw new Error(`Mapeamento de recurso inválido para item: ${r.item_id}`);const n=await o.get(d);if(!n.exists)throw new Error("País do vendedor não encontrado.");const u=n.data()[l]||0,p={};p[l]=u+r.quantity,o.update(d,p)}else if(r.category==="vehicles"||r.category==="naval"){const d=g.collection("inventory").doc(r.country_id),l=await o.get(d),n=r.category,c=r.item_name;if(l.exists){const m=(l.data()[n]?.[c]?.quantity||0)+r.quantity,b=`${n}.${c}.quantity`;o.update(d,{[b]:m})}else{const u={[n]:{[c]:{quantity:r.quantity}}};o.set(d,u)}}o.update(s,{status:"cancelled",updated_at:new Date})}),{success:!0}}catch(o){return console.error("Erro ao cancelar oferta:",o),{success:!1,error:o.message}}}}class se{constructor(e){this.marketplaceSystem=e,this.currentModal=null,this.currentOfferType=null,this.currentCategory=null,this.selectedResource=null,this.selectedMarketType=null}async openResourceSellModal(){this.currentOfferType="sell",this.currentCategory="resources",this.currentModal=await this.renderResourceSellModal(),document.body.appendChild(this.currentModal),this.setupEventListeners()}async renderResourceSellModal(){const e=document.createElement("div");e.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",e.id="resource-sell-modal";const a=await this.getAvailableResources();return e.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

        <!-- Header -->
        <div class="p-6 border-b border-bg-ring/50 bg-gradient-to-r from-brand-500/10 to-brand-600/10">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                <span class="text-3xl">🔥</span>
                Vender Recursos
              </h2>
              <p class="text-slate-400 mt-1 text-sm">
                Venda seus recursos excedentes no mercado internacional
              </p>
            </div>
            <button data-action="close" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <form id="resource-sell-form" class="p-6 space-y-6">

          <!-- Seleção de Recurso -->
          <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
            <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
              📦 Recurso para Vender
            </label>

            ${a.length>0?`
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${a.map(s=>`
                  <label class="relative flex items-center p-4 border-2 border-bg-ring rounded-lg cursor-pointer
                                hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
                    <input type="radio" name="resource" value="${s.gameResourceId}"
                           data-market-type="${s.defaultMarketType}"
                           data-unit="${s.unit}"
                           data-available="${s.available}"
                           data-has-multiple="${s.hasMultipleTypes}"
                           class="peer sr-only" required>

                    <!-- Checkbox visual -->
                    <div class="w-5 h-5 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center
                                peer-checked:border-brand-400 peer-checked:bg-brand-400">
                      <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6"/>
                      </svg>
                    </div>

                    <!-- Info do recurso -->
                    <div class="flex-1">
                      <div class="font-medium text-white">${s.displayName}</div>
                      <div class="text-xs text-slate-400 mt-0.5">
                        Excedente: <span class="text-brand-300 font-semibold">
                          ${s.available.toLocaleString()} ${s.unit}
                        </span>
                      </div>
                    </div>

                    <!-- Badge de disponibilidade -->
                    <div class="absolute top-2 right-2">
                      ${s.available>1e5?'<span class="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full font-semibold">Alto</span>':s.available>1e4?'<span class="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full font-semibold">Médio</span>':'<span class="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full font-semibold">Baixo</span>'}
                    </div>
                  </label>
                `).join("")}
              </div>
            `:`
              <div class="text-center py-8 text-slate-400">
                <div class="text-5xl mb-3">📭</div>
                <p class="font-medium">Nenhum recurso disponível para venda</p>
                <p class="text-sm mt-1">Você não possui recursos excedentes no momento</p>
              </div>
            `}
          </div>

          <!-- Tipo de Produto (apenas se recurso tiver múltiplos tipos) -->
          <div id="product-type-section" class="hidden bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
            <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
              🏭 Tipo de Produto
            </label>
            <div id="product-type-options" class="space-y-2">
              <!-- Populado dinamicamente quando recurso for selecionado -->
            </div>
            <p class="text-xs text-slate-400 mt-3">
              💡 Produtos de maior qualidade têm preços mais altos no mercado
            </p>
          </div>

          <!-- Quantidade e Preço -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <!-- Quantidade -->
            <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
              <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                📊 Quantidade
              </label>

              <div class="relative">
                <input type="number" name="quantity" id="quantity-input"
                       min="1" step="1" placeholder="0" required disabled
                       class="w-full px-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
                              focus:border-brand-400 focus:outline-none transition-colors disabled:opacity-50">
                <div id="quantity-unit" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  <!-- Unidade -->
                </div>
              </div>

              <!-- Barra de progresso visual -->
              <div class="mt-3">
                <div class="flex justify-between text-xs text-slate-400 mb-1">
                  <span>0</span>
                  <span id="max-quantity-label">Selecione um recurso</span>
                </div>
                <div class="h-2 bg-bg-ring rounded-full overflow-hidden">
                  <div id="quantity-progress" class="h-full bg-gradient-to-r from-brand-400 to-brand-500
                                                      transition-all duration-300" style="width: 0%"></div>
                </div>
              </div>

              <!-- Feedback de validação -->
              <div id="quantity-feedback" class="mt-2 text-sm hidden">
                <!-- Mensagens dinâmicas -->
              </div>

              <!-- Sugestões rápidas -->
              <div class="mt-3 flex flex-wrap gap-2">
                <button type="button" data-quantity-preset="25" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  25%
                </button>
                <button type="button" data-quantity-preset="50" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  50%
                </button>
                <button type="button" data-quantity-preset="75" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  75%
                </button>
                <button type="button" data-quantity-preset="100" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Tudo
                </button>
              </div>
            </div>

            <!-- Preço -->
            <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
              <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                💰 Preço por Unidade (USD)
              </label>

              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                <input type="number" name="price_per_unit" id="price-input"
                       min="0.01" step="0.01" placeholder="0.00" required disabled
                       class="w-full pl-8 pr-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
                              focus:border-brand-400 focus:outline-none transition-colors disabled:opacity-50">
              </div>

              <!-- Sugestão de preço -->
              <div id="price-suggestion" class="mt-3 bg-blue-500/10 border border-blue-400/30 rounded-lg p-3 hidden">
                <div class="flex items-start gap-2">
                  <span class="text-blue-400">💡</span>
                  <div class="flex-1">
                    <div class="text-xs font-semibold text-blue-300 mb-1">Preço Sugerido</div>
                    <div class="flex items-center gap-2 text-sm">
                      <span class="text-slate-400">Faixa:</span>
                      <span class="text-white font-mono" id="price-range">$0 - $0</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Sugestões rápidas de preço -->
              <div class="mt-3 flex flex-wrap gap-2">
                <button type="button" data-price-preset="low" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Baixo
                </button>
                <button type="button" data-price-preset="market" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Mercado
                </button>
                <button type="button" data-price-preset="high" disabled
                        class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Alto
                </button>
              </div>
            </div>
          </div>

          <!-- Resumo da Transação -->
          <div id="transaction-summary" class="bg-gradient-to-br from-brand-500/10 to-brand-600/10
                                                border-2 border-brand-400/30 rounded-lg p-5 hidden">
            <h3 class="text-brand-300 font-bold mb-3 flex items-center gap-2">
              <span>📊</span>
              Resumo da Oferta
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-bg/50 rounded-lg p-3">
                <div class="text-xs text-slate-400 mb-1">Valor Total</div>
                <div id="total-value" class="text-2xl font-bold text-white">$0</div>
              </div>

              <div class="bg-bg/50 rounded-lg p-3">
                <div class="text-xs text-slate-400 mb-1">Valor por Unidade</div>
                <div id="unit-value" class="text-xl font-semibold text-white">$0</div>
              </div>

              <div class="bg-bg/50 rounded-lg p-3">
                <div class="text-xs text-slate-400 mb-1">Quantidade</div>
                <div id="summary-quantity" class="text-xl font-semibold text-white">0</div>
              </div>
            </div>

            <!-- Estimativa de lucro -->
            <div class="mt-4 pt-4 border-t border-brand-400/20">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-300">Comparado ao preço de mercado:</span>
                <span id="profit-estimate" class="font-semibold text-slate-400">-</span>
              </div>
            </div>
          </div>

          <!-- Tipo de Ordem -->
          <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
            <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
              🔄 Tipo de Ordem
            </label>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="relative flex items-start p-4 border-2 border-bg-ring rounded-lg cursor-pointer
                            hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
                <input type="radio" name="order_type" value="one_time" class="peer sr-only" checked>

                <div class="w-5 h-5 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center mt-0.5
                            peer-checked:border-brand-400 peer-checked:bg-brand-400">
                  <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6"/>
                  </svg>
                </div>

                <div>
                  <div class="font-medium text-white">Venda Única</div>
                  <div class="text-xs text-slate-400 mt-1">
                    Oferta fica disponível até alguém comprar completamente
                  </div>
                </div>
              </label>

              <label class="relative flex items-start p-4 border-2 border-bg-ring rounded-lg cursor-pointer
                            hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
                <input type="radio" name="order_type" value="recurring" class="peer sr-only">

                <div class="w-5 h-5 rounded-full border-2 border-slate-500 mr-3 flex items-center justify-center mt-0.5
                            peer-checked:border-brand-400 peer-checked:bg-brand-400">
                  <svg class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6"/>
                  </svg>
                </div>

                <div>
                  <div class="font-medium text-white flex items-center gap-2">
                    Ordem Recorrente
                    <span class="text-xs px-2 py-0.5 bg-brand-500/20 text-brand-300 rounded-full">Automático</span>
                  </div>
                  <div class="text-xs text-slate-400 mt-1">
                    Vende automaticamente a cada turno até você cancelar
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Configurações de Ordem Recorrente (aparece apenas se selecionado) -->
          <div id="recurring-config" class="bg-blue-500/5 border border-blue-400/20 rounded-lg p-5 hidden">
            <div class="flex items-start gap-3 mb-4">
              <span class="text-2xl">🔄</span>
              <div>
                <h4 class="text-white font-semibold mb-1">Configurações de Ordem Recorrente</h4>
                <p class="text-sm text-slate-400">
                  A cada turno, o sistema tentará vender automaticamente esta quantidade para compradores que correspondam ao seu preço.
                </p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    💰 Preço Mínimo Aceito
                  </label>
                  <div class="relative">
                    <div class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</div>
                    <input type="number" name="min_price_sell" id="min-price-sell" min="0.01" step="0.01" placeholder="0.00"
                           class="w-full pl-8 pr-4 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                  focus:border-brand-400 focus:outline-none">
                  </div>
                  <p class="text-xs text-slate-400 mt-1">
                    Não vender abaixo deste preço (deixe vazio = 80% do preço base)
                  </p>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    📦 Reserva de Estoque
                  </label>
                  <input type="number" name="min_stock_reserve" id="min-stock-reserve" min="0" placeholder="0"
                         class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                focus:border-brand-400 focus:outline-none">
                  <p class="text-xs text-slate-400 mt-1">
                    Sempre manter pelo menos esta quantidade em estoque
                  </p>
                </div>
              </div>

              <div class="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
                <div class="flex items-start gap-2">
                  <span class="text-yellow-400 text-lg">⚠️</span>
                  <div class="text-xs text-yellow-200">
                    <strong>Ordem recorrente:</strong> A cada turno, se você tiver excedente suficiente e houver compradores com preço compatível,
                    a venda será executada automaticamente. O dinheiro será creditado no seu orçamento e os recursos deduzidos.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Configurações Avançadas (Colapsável) -->
          <details class="bg-bg/30 rounded-lg border border-bg-ring/50" id="one-time-settings">
            <summary class="p-4 cursor-pointer hover:bg-bg/50 transition-colors">
              <span class="text-sm font-semibold text-slate-300 uppercase tracking-wide">
                ⚙️ Configurações Avançadas (Opcional)
              </span>
            </summary>

            <div class="p-5 pt-0 space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Quantidade Mínima por Pedido
                  </label>
                  <input type="number" name="min_quantity" min="1" placeholder="1" value="1"
                         class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                focus:border-brand-400 focus:outline-none">
                  <p class="text-xs text-slate-400 mt-1">
                    Compradores devem comprar pelo menos esta quantidade
                  </p>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Tempo de Entrega (dias)
                  </label>
                  <select name="delivery_time_days"
                          class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                 focus:border-brand-400 focus:outline-none">
                    <option value="15">15 dias (Express)</option>
                    <option value="30" selected>30 dias (Padrão)</option>
                    <option value="45">45 dias</option>
                    <option value="60">60 dias</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Duração da Oferta
                  </label>
                  <select name="duration_days"
                          class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                 focus:border-brand-400 focus:outline-none">
                    <option value="7">7 dias</option>
                    <option value="14" selected>14 dias</option>
                    <option value="21">21 dias</option>
                    <option value="30">30 dias</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-slate-300 mb-2">
                    Título Personalizado (Opcional)
                  </label>
                  <input type="text" name="custom_title" maxlength="100" placeholder="Auto-gerado"
                         class="w-full px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white
                                focus:border-brand-400 focus:outline-none">
                  <p class="text-xs text-slate-400 mt-1">
                    Deixe em branco para título automático
                  </p>
                </div>
              </div>
            </div>
          </details>

          <!-- Botões de Ação -->
          <div class="flex items-center gap-3 pt-4">
            <button type="submit" id="submit-offer-btn" disabled
                    class="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              🚀 Criar Oferta
            </button>

            <button type="button" data-action="close"
                    class="px-6 py-3 bg-bg-ring hover:bg-bg text-slate-300 font-semibold rounded-lg
                           transition-colors">
              Cancelar
            </button>
          </div>

        </form>
      </div>
    `,e}async getAvailableResources(){const e=window.currentCountry;if(!e)return console.error("❌ window.currentCountry não encontrado"),[];if(!window.ResourceProductionCalculator||!window.ResourceConsumptionCalculator)return console.error("❌ Calculadores de recursos não encontrados"),[];const a=window.ResourceProductionCalculator.calculateCountryProduction(e),s=window.ResourceConsumptionCalculator.calculateCountryConsumption(e),o=[];return Object.entries(J).forEach(([i,r])=>{const d=a[i]||0,l=s[i]||0,n=d-l;n>0&&o.push({gameResourceId:r.gameResourceId,displayName:r.displayName,unit:r.defaultUnit,available:Math.round(n),defaultMarketType:r.marketTypes[0].id,hasMultipleTypes:r.marketTypes.length>1,types:r.marketTypes})}),o}setupEventListeners(){if(!this.currentModal)return;this.currentModal.querySelectorAll('[data-action="close"]').forEach(o=>{o.addEventListener("click",()=>this.closeModal())}),this.currentModal.querySelectorAll('input[name="resource"]').forEach(o=>{o.addEventListener("change",i=>this.onResourceSelected(i.target))}),this.currentModal.querySelectorAll('input[name="order_type"]').forEach(o=>{o.addEventListener("change",i=>this.onOrderTypeChanged(i.target.value))}),this.currentModal.querySelectorAll("[data-quantity-preset]").forEach(o=>{o.addEventListener("click",i=>{const r=parseInt(i.target.dataset.quantityPreset);this.applyQuantityPreset(r)})}),this.currentModal.querySelectorAll("[data-price-preset]").forEach(o=>{o.addEventListener("click",i=>{const r=i.target.dataset.pricePreset;this.applyPricePreset(r)})});const e=this.currentModal.querySelector("#quantity-input"),a=this.currentModal.querySelector("#price-input");e?.addEventListener("input",()=>this.validateAndUpdateSummary()),a?.addEventListener("input",()=>this.validateAndUpdateSummary()),this.currentModal.querySelector("form")?.addEventListener("submit",o=>this.handleSubmit(o))}onResourceSelected(e){const a=e.dataset.marketType,s=e.dataset.unit,o=parseInt(e.dataset.available),i=e.dataset.hasMultiple==="true";this.selectedResource=e.value,this.selectedMarketType=a;const r=this.currentModal.querySelector("#quantity-unit");r&&(r.textContent=s);const d=this.currentModal.querySelector("#quantity-input");d&&(d.max=o,d.setAttribute("data-available",o),d.disabled=!1),this.currentModal.querySelectorAll("[data-quantity-preset]").forEach(u=>{u.disabled=!1});const l=this.currentModal.querySelector("#max-quantity-label");if(l&&(l.textContent=`Máximo: ${o.toLocaleString()}`),i)this.showProductTypeSelection(e.value);else{const u=this.currentModal.querySelector("#product-type-section");u&&u.classList.add("hidden"),this.applyPriceSuggestion(a,o)}const n=this.currentModal.querySelector("#price-input");n&&(n.disabled=!1),this.currentModal.querySelectorAll("[data-price-preset]").forEach(u=>{u.disabled=!1});const c=this.currentModal.querySelector("#submit-offer-btn");c&&(c.disabled=!1),this.validateAndUpdateSummary()}showProductTypeSelection(e){const a=this.currentModal.querySelector("#product-type-section"),s=this.currentModal.querySelector("#product-type-options");if(!a||!s)return;const o=Object.values(J).find(r=>r.gameResourceId===e);if(!o)return;s.innerHTML=o.marketTypes.map((r,d)=>`
      <label class="flex items-start p-3 border-2 border-bg-ring rounded-lg cursor-pointer
                    hover:border-brand-400 hover:bg-brand-500/5 transition-all">
        <input type="radio" name="product_type" value="${r.id}"
               data-base-price="${r.basePrice}"
               class="mt-1 text-brand-500 focus:ring-brand-400"
               ${d===0?"checked":""} required>
        <div class="ml-3 flex-1">
          <div class="font-medium text-white">${r.name}</div>
          <div class="text-xs text-slate-400 mt-0.5">${r.description}</div>
          <div class="text-xs text-brand-300 mt-1 font-semibold">
            Preço base: $${r.basePrice.toLocaleString()} / ${o.defaultUnit}
          </div>
        </div>
      </label>
    `).join(""),s.querySelectorAll('input[name="product_type"]').forEach(r=>{r.addEventListener("change",d=>{this.selectedMarketType=d.target.value;const l=parseInt(this.currentModal.querySelector("#quantity-input").getAttribute("data-available"));this.applyPriceSuggestion(d.target.value,l),this.validateAndUpdateSummary()})}),a.classList.remove("hidden");const i=parseInt(this.currentModal.querySelector("#quantity-input").getAttribute("data-available"));this.applyPriceSuggestion(o.marketTypes[0].id,i)}applyPriceSuggestion(e,a){const s=ye(e,a);if(!s)return;const o=this.currentModal.querySelector("#price-suggestion"),i=this.currentModal.querySelector("#price-range");o&&i&&(o.classList.remove("hidden"),i.textContent=`$${s.min.toLocaleString()} - $${s.max.toLocaleString()}`,this.currentModal.setAttribute("data-price-low",s.min),this.currentModal.setAttribute("data-price-market",s.suggested),this.currentModal.setAttribute("data-price-high",s.max));const r=this.currentModal.querySelector("#price-input");r&&!r.value&&(r.value=s.suggested,this.validateAndUpdateSummary())}applyQuantityPreset(e){const a=this.currentModal.querySelector("#quantity-input"),s=parseInt(a.getAttribute("data-available")||0),o=Math.floor(s*(e/100));a.value=o,this.validateAndUpdateSummary()}applyPricePreset(e){const a=this.currentModal.querySelector("#price-input");let s=0;e==="low"?s=this.currentModal.getAttribute("data-price-low"):e==="market"?s=this.currentModal.getAttribute("data-price-market"):e==="high"&&(s=this.currentModal.getAttribute("data-price-high")),s&&(a.value=s,this.validateAndUpdateSummary())}validateAndUpdateSummary(){const e=this.currentModal.querySelector("#quantity-input"),a=this.currentModal.querySelector("#price-input"),s=parseInt(e?.value||0),o=parseFloat(a?.value||0),i=parseInt(e?.getAttribute("data-available")||0),r=this.currentModal.querySelector("#quantity-feedback"),d=this.currentModal.querySelector("#quantity-progress"),l=this.currentModal.querySelector("#transaction-summary");if(s>0){const n=Math.min(s/i*100,100);d.style.width=`${n}%`,s>i?(r.className="mt-2 text-sm text-red-400",r.textContent=`❌ Quantidade excede o disponível (${i.toLocaleString()})`,r.classList.remove("hidden")):(r.className="mt-2 text-sm text-green-400",r.textContent=`✅ Válido (${(s/i*100).toFixed(1)}% do estoque)`,r.classList.remove("hidden"))}else d.style.width="0%",r.classList.add("hidden");if(s>0&&o>0){l?.classList.remove("hidden");const n=s*o,c=this.currentModal.querySelector("#total-value"),u=this.currentModal.querySelector("#unit-value"),p=this.currentModal.querySelector("#summary-quantity");c&&(c.textContent=`$${n.toLocaleString("en-US",{minimumFractionDigits:2})}`),u&&(u.textContent=`$${o.toLocaleString("en-US",{minimumFractionDigits:2})}`),p&&(p.textContent=s.toLocaleString());const m=parseFloat(this.currentModal.getAttribute("data-price-market")||0),b=this.currentModal.querySelector("#profit-estimate");if(m>0&&o>0){const v=(o-m)/m*100;v>5?(b.className="font-semibold text-green-400",b.textContent=`+${v.toFixed(1)}% acima do mercado`):v<-5?(b.className="font-semibold text-red-400",b.textContent=`${v.toFixed(1)}% abaixo do mercado`):(b.className="font-semibold text-yellow-400",b.textContent="≈ Preço de mercado")}}else l?.classList.add("hidden")}onOrderTypeChanged(e){const a=this.currentModal.querySelector("#recurring-config"),s=this.currentModal.querySelector("#one-time-settings");e==="recurring"?(a?.classList.remove("hidden"),s?.classList.add("hidden")):(a?.classList.add("hidden"),s?.classList.remove("hidden"))}async handleSubmit(e){e.preventDefault();const a=e.target,s=this.currentModal.querySelector("#submit-offer-btn"),o=s.textContent;try{s.disabled=!0,s.textContent="⏳ Criando oferta...";const i=new FormData(a),r=a.querySelector('input[name="resource"]:checked');if(!r)throw new Error("Selecione um recurso");const d=r.dataset.unit,l=this.selectedMarketType,n=ae(l);if(!n)throw new Error("Configuração de mercado não encontrada");i.get("order_type")==="recurring"?await this.handleRecurringOrderSubmit(i,l,n,d):await this.handleOneTimeOfferSubmit(i,l,n,d),this.closeModal()}catch(i){console.error("❌ Erro ao criar oferta:",i),alert(i.message||"Erro ao criar oferta"),s.disabled=!1,s.textContent=o}}async handleOneTimeOfferSubmit(e,a,s,o){const i={type:"sell",category:"resources",item_id:a,item_name:s.name,quantity:parseInt(e.get("quantity")),unit:o,price_per_unit:parseFloat(e.get("price_per_unit")),min_quantity:parseInt(e.get("min_quantity"))||1,delivery_time_days:parseInt(e.get("delivery_time_days"))||30,duration_days:parseInt(e.get("duration_days"))||14,title:e.get("custom_title")||null};i.title||(i.title=`${i.item_name} - ${i.quantity.toLocaleString()} ${o}`),console.log("📤 Enviando oferta:",i);const r=await this.marketplaceSystem.createOffer(i);if(r.success)alert("✅ Oferta criada com sucesso!"),typeof window.loadMarketplaceOffers=="function"?window.loadMarketplaceOffers("all",window.paisId):window.location.reload();else throw new Error(r.error||"Erro desconhecido")}async handleRecurringOrderSubmit(e,a,s,o){if(!window.recurringOrdersSystem){const{RecurringOrdersSystem:d}=await A(async()=>{const{RecurringOrdersSystem:l}=await import("./recurringOrdersSystem-BpJp6SUZ.js");return{RecurringOrdersSystem:l}},__vite__mapDeps([0,1,2,3]));window.recurringOrdersSystem=new d}const i={country_id:window.paisId,order_type:"sell",item_id:a,quantity:parseInt(e.get("quantity")),price_per_unit:parseFloat(e.get("price_per_unit")),min_stock_reserve:parseFloat(e.get("min_stock_reserve")||0),min_price_sell:parseFloat(e.get("min_price_sell"))||null};console.log("📤 Criando ordem recorrente:",i);const r=await window.recurringOrdersSystem.createRecurringOrder(i);if(r.success)alert("✅ Ordem recorrente criada! A cada turno, o sistema tentará vender automaticamente este recurso."),window.location.reload();else throw new Error(r.error||"Erro ao criar ordem recorrente")}closeModal(){this.currentModal&&(this.currentModal.remove(),this.currentModal=null,this.selectedResource=null,this.selectedMarketType=null)}}function he(t){return t<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:t<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:t<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function k(t){if(!t||isNaN(t))return"0";const e=parseFloat(t);return e>=1e9?(e/1e9).toFixed(1)+"B":e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(0)+"K":Math.round(e).toLocaleString("pt-BR")}function M(t){if(!t)return"US$ 0";const e=parseFloat(t);return e>=1e9?"US$ "+(e/1e9).toFixed(1)+"B":e>=1e6?"US$ "+(e/1e6).toFixed(1)+"M":e>=1e3?"US$ "+(e/1e3).toFixed(1)+"K":"US$ "+e.toLocaleString()}function x(t){const e=parseFloat(t)||0;return e===0?"US$ 0":e>=1e9?`US$ ${(e/1e9).toFixed(1)}bi`:e>=1e6?`US$ ${(e/1e6).toFixed(1)}mi`:e>=1e3?`US$ ${(e/1e3).toFixed(1)}mil`:`US$ ${Math.round(e)}`}function we(t){const e=parseFloat(t.WarPower)||0;return Math.round(e)}function S(t){const e=parseFloat(t.PIB)||0,a=(parseFloat(t.Burocracia)||0)/100,s=(parseFloat(t.Estabilidade)||0)/100,o=e*.25*a*(s*1.5),i=parseFloat(t.OrcamentoGasto||0),r=parseFloat(t.AgencyBudgetSpent||0);return Math.max(0,o-i-r)}function re(t){const e=S(t),a=(parseFloat(t.MilitaryBudgetPercent)||30)/100;return e*a}function oe(t){const e=(parseFloat(t.MilitaryDistributionVehicles)||40)/100,a=(parseFloat(t.MilitaryDistributionAircraft)||30)/100,s=(parseFloat(t.MilitaryDistributionNaval)||30)/100;return{vehicles:e,aircraft:a,naval:s,maintenancePercent:.15}}function _e(t){const s=(parseFloat(t.MilitaryBudgetPercent)||30)-30;let o=0,i=0;return s>0&&(o=Math.floor(s/2)*-1,i=s*-.5),{stabilityPenalty:o,economicPenalty:i,isOverBudget:s>0}}function R(t){const e=re(t),a=oe(t),s=e*(1-a.maintenancePercent),o=(parseFloat(t.Tecnologia)||0)/100,i=(parseFloat(t.IndustrialEfficiency)||30)/100,r=(parseFloat(t.Marinha)||0)/100,d=(parseFloat(t.Urbanizacao)||0)/100;return s*a.naval*o*i*r*d}function Ee(t){fe.computeEnergyDemandGW(t);const e=xe.calculateConsumerGoods(t),a=Z.calculateCountryConsumption(t),s=ee.calculateCountryProduction(t),o={Carvao:Math.round((s.Carvao||0)-(a.Carvao||0)),Combustivel:Math.round((s.Combustivel||0)-(a.Combustivel||0)),Metais:Math.round((s.Metais||0)-(a.Metais||0)),Graos:Math.round((s.Graos||0)-(a.Graos||0)),Energia:Math.round((s.Energia||0)-(a.Energia||0))},i=he(parseFloat(t.Estabilidade)||0),r=we(t),d=(parseFloat(t.PIB)||0)/(parseFloat(t.Populacao)||1),l=S(t),n=re(t),c=oe(t),u=n*c.vehicles,p=n*c.aircraft,m=n*c.naval,b=_e(t);return`
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <!-- Header -->
      <div class="border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 rounded border border-slate-600 overflow-hidden grid place-items-center bg-slate-800">
                ${K(t.Pais,"w-full h-full")}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-100">${t.Pais}</h1>
                <p class="text-sm text-slate-400">${t.ModeloPolitico||"Sistema Político"}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">War Power</div>
                <div class="text-2xl font-bold text-red-400">${k(r)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">PIB per capita</div>
                <div class="text-lg font-semibold text-emerald-400">${M(d)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">Estabilidade</div>
                <div class="text-lg font-semibold text-slate-200">${Math.round(t.Estabilidade||0)}%</div>
              </div>
              <div class="px-3 py-1 rounded-lg border ${i.tone}">
                <span class="text-sm font-medium">${i.label}</span>
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
            <button class="dashboard-tab border-b-2 border-transparent py-4 px-1 text-sm font-medium text-slate-400 hover:text-slate-300" data-tab="intelligence">
              🕵️ Inteligência
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
                    <div class="text-xl font-bold text-slate-100">${x(t.PIB)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Orçamento</div>
                    <div class="text-xl font-bold text-emerald-400">${x(l)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">População</div>
                    <div class="text-xl font-bold text-slate-100">${k(t.Populacao)}</div>
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
                  Produção: ${k(e.production)} •
                  Demanda: ${k(e.demand)} •
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
                    <span class="text-lg font-bold text-emerald-400">${x(n)}</span>
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

                  ${b.isOverBudget?`
                    <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                      <div class="text-xs text-red-400">
                        ⚠️ <strong>Gastos militares excessivos!</strong><br>
                        Penalidade de estabilidade: ${b.stabilityPenalty}%<br>
                        Impacto econômico: ${b.economicPenalty}% no crescimento
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
                    <div class="text-xs text-slate-400">Investimento: <span id="vehicles-amount">${x(n*c.vehicles)}</span></div>
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
                    <div class="text-xs text-slate-400">Investimento: <span id="aircraft-amount">${x(n*c.aircraft)}</span></div>
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
                    <div class="text-xs text-slate-400">Investimento: <span id="naval-amount">${x(n*c.naval)}</span></div>
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
                  ${Object.entries(o).map(([v,f])=>{const w={Carvao:"🪨",Combustivel:"⛽",Metais:"🔩",Graos:"🌾",Energia:"⚡"},$={Carvao:"Carvão",Combustivel:"Combustível",Metais:"Metais",Graos:"Grãos",Energia:"Energia"},E=v==="Energia"?"MW":"";return`
                      <div class="text-center">
                        <div class="text-lg mb-1">${w[v]}</div>
                        <div class="text-xs text-slate-400 mb-1">${$[v]}</div>
                        <div class="text-sm font-bold ${f>=0?"text-emerald-400":"text-red-400"}">
                          ${f>=0?"+":""}${k(f)}${E}
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
                    <span class="text-sm font-semibold text-blue-400">${x(u)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">✈️</span>
                      <span class="text-sm text-slate-300">Aeronaves</span>
                    </div>
                    <span class="text-sm font-semibold text-cyan-400">${x(p)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🚢</span>
                      <span class="text-sm text-slate-300">Embarcações</span>
                    </div>
                    <span class="text-sm font-semibold text-purple-400">${x(m)}/turno</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Country Info Sidebar -->
            <div class="space-y-6">
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <div class="aspect-[3/2] rounded-lg overflow-hidden mb-4 grid place-items-center bg-slate-800">
                  ${K(t.Pais,"w-full h-full")}
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
                        <div class="text-sm font-semibold text-slate-200">${x(u)}/turno</div>
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
                        <div class="text-sm font-semibold text-slate-200">${x(p)}/turno</div>
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
                        <div class="text-sm font-semibold text-slate-200">${x(m)}/turno</div>
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
            ${["Carvao","Combustivel","Metais","Graos","Energia"].map(v=>{const f={Carvao:"🪨",Combustivel:"⛽",Metais:"🔩",Graos:"🌾",Energia:"⚡"},w={Carvao:"Carvão",Combustivel:"Combustível",Metais:"Metais",Graos:"Grãos",Energia:"Energia"},$=t[`Potencial${v}`]||(v==="Energia"?"N/A":"3"),E=Math.round(s[v]||0),I=Math.round(a[v]||0),D=o[v],N=v==="Energia"?"MW":"unidades";return`
                <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">${f[v]}</span>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-200">${w[v]}</h3>
                        ${v!=="Energia"?`<p class="text-sm text-slate-400">Potencial: ${$}/10</p>`:""}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold ${D>=0?"text-emerald-400":"text-red-400"}">
                        ${D>=0?"+":""}${k(D)}
                      </div>
                      <div class="text-xs text-slate-400">${N}/mês</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Produção</div>
                      <div class="text-lg font-semibold text-cyan-400">${k(E)} ${N}</div>
                    </div>
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Consumo</div>
                      <div class="text-lg font-semibold text-amber-400">${k(I)} ${N}</div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-400">Eficiência</span>
                      <span class="text-slate-200">${E>0?Math.round(E/Math.max(I,1)*100):0}%</span>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-2">
                      <div class="h-2 rounded-full ${D>=0?"bg-emerald-500":"bg-red-500"}"
                           style="width: ${Math.min(Math.max(E/Math.max(I,1)*100,0),100)}%"></div>
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

        <!-- Intelligence Tab -->
        <div id="tab-intelligence" class="dashboard-tab-content hidden">
          <div id="intelligence-dashboard-container">
            <div class="text-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <p class="text-slate-400">Carregando agência de inteligência...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  `}function $e(){document.addEventListener("click",t=>{if(t.target.matches(".dashboard-tab")){const e=t.target.dataset.tab;document.querySelectorAll(".dashboard-tab").forEach(a=>{a.classList.remove("active","border-blue-500","text-blue-400"),a.classList.add("border-transparent","text-slate-400")}),t.target.classList.add("active","border-blue-500","text-blue-400"),t.target.classList.remove("border-transparent","text-slate-400"),document.querySelectorAll(".dashboard-tab-content").forEach(a=>{a.classList.add("hidden")}),document.getElementById(`tab-${e}`)?.classList.remove("hidden"),e==="vehicles"&&Me(),e==="naval"&&ne(),e==="market"&&Le(),e==="intelligence"&&De()}if(t.target.matches(".inventory-category-card")||t.target.closest(".inventory-category-card")){const a=t.target.closest(".inventory-category-card").dataset.category;qe(a)}if(t.target.matches(".equipment-item")||t.target.closest(".equipment-item")){const e=t.target.closest(".equipment-item"),a=e.dataset.equipment,s=e.dataset.category;ie(s,a)}})}async function Me(){try{const t=document.getElementById("vehicles-inventory-container");if(!t)return;t.innerHTML=`
      <div class="flex items-center justify-center py-8">
        <div class="text-slate-400">🔄 Carregando inventário...</div>
      </div>
    `;const e=y.currentUser;if(!e)return;const a=await h(e.uid);if(!a)return;const s=await g.collection("inventory").doc(a).get();if(!s.exists){t.innerHTML=`
        <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Vazio</h3>
          <p class="text-slate-400">Nenhum equipamento aprovado encontrado</p>
        </div>
      `;return}const o=s.data();t.innerHTML=Ce(o)}catch(t){console.error("Erro ao carregar inventário:",t);const e=document.getElementById("vehicles-inventory-container");e&&(e.innerHTML=`
        <div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3>
          <p class="text-red-400">Erro ao carregar inventário: ${t.message}</p>
        </div>
      `)}}function Ce(t){const e=Object.keys(t);if(e.length===0)return`
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
          ${e.map(s=>{const o=t[s],i=Object.keys(o).length,r=Object.values(o).reduce((l,n)=>l+(n.quantity||0),0),d=Object.values(o).reduce((l,n)=>{const c=n.quantity||0,p=(n.cost||0)*.05;return l+p*c},0);return`
              <div class="inventory-category-card bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg p-4 cursor-pointer transition-colors" data-category="${s}">
                <div class="text-center">
                  <div class="text-3xl mb-2">${a[s]||"📦"}</div>
                  <h4 class="font-semibold text-slate-200 mb-1">${s}</h4>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>${i} tipo${i!==1?"s":""}</div>
                    <div>${r} unidade${r!==1?"s":""}</div>
                    <div class="text-red-400">🔧 ${x(d)}/mês</div>
                  </div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    </div>
  `}async function qe(t){try{const e=y.currentUser;if(!e)return;const a=await h(e.uid);if(!a)return;const s=await g.collection("inventory").doc(a).get();if(!s.exists)return;const i=s.data()[t];if(!i)return;const r=document.getElementById("inventory-details-modal");r&&r.remove();const d=document.createElement("div");d.id="inventory-details-modal",d.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const l=document.createElement("div");l.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col";const n=Object.entries(i),c=n.reduce((p,[m,b])=>p+(b.quantity||0),0),u=n.reduce((p,[m,b])=>{const v=b.quantity||0,w=(b.cost||0)*.05;return p+w*v},0);l.innerHTML=`
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">📦 ${t}</h3>
          <p class="text-sm text-slate-400">${n.length} equipamentos • ${c} unidades • ${x(u)}/mês manutenção</p>
        </div>
        <button id="close-inventory-modal" class="text-slate-400 hover:text-slate-200 p-1">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${n.map(([p,m])=>{const b=m.quantity||0,v=m.cost||0,f=v*.05*b,w=v*b;return`
              <div class="equipment-item bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 cursor-pointer transition-colors"
                   data-equipment="${p}" data-category="${t}">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-slate-200 mb-1">${p}</h4>
                    <div class="text-xs text-slate-400 space-y-1">
                      <div>📦 <strong>Quantidade:</strong> ${b} unidades</div>
                      <div>💰 <strong>Custo unitário:</strong> ${x(v)}</div>
                      <div>💵 <strong>Valor total:</strong> ${x(w)}</div>
                      <div class="text-red-400">🔧 <strong>Manutenção:</strong> ${x(f)}/mês</div>
                      ${m.approvedDate?`<div>📅 <strong>Aprovado em:</strong> ${new Date(m.approvedDate).toLocaleDateString("pt-BR")}</div>`:""}
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <button class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
                          onclick="showEquipmentDetails('${t}', '${p}')">
                    📋 Ver Ficha
                  </button>
                  <div class="text-xs text-slate-500">Clique para detalhes</div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,d.appendChild(l),d.addEventListener("click",p=>{p.target===d&&d.remove()}),l.querySelector("#close-inventory-modal").addEventListener("click",()=>{d.remove()}),document.addEventListener("keydown",function p(m){m.key==="Escape"&&(d.remove(),document.removeEventListener("keydown",p))}),document.body.appendChild(d)}catch(e){console.error("Erro ao carregar detalhes do inventário:",e)}}async function ie(t,e){try{const a=y.currentUser;if(!a)return;const s=await h(a.uid);if(!s)return;const o=await g.collection("inventory").doc(s).get();if(!o.exists)return;const r=o.data()[t]?.[e];if(!r)return;const d=document.getElementById("equipment-details-modal");d&&d.remove();const l=r.quantity||0,n=r.cost||0,c=n*.05*l,u=n*l,p=r.specs||{},m=document.createElement("div");m.id="equipment-details-modal",m.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const b=document.createElement("div");b.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col",b.innerHTML=`
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
                <span class="text-slate-200">${x(n)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Quantidade:</span>
                <span class="text-slate-200">${l} unidades</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Valor total investido:</span>
                <span class="text-green-400 font-semibold">${x(u)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Custo de manutenção:</span>
                <span class="text-red-400 font-semibold">${x(c)}/mês</span>
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
              ${Object.entries(p).map(([f,w])=>{if(typeof w=="object"||f==="components"||f==="total_cost")return"";const $=f.replace(/_/g," ").replace(/\b\w/g,I=>I.toUpperCase());let E=w;return f.includes("cost")||f.includes("price")?E=x(w):f.includes("weight")?E=`${w} tons`:f.includes("speed")?E=`${w} km/h`:f.includes("armor")||f.includes("thickness")?E=`${w}mm`:(f.includes("caliber")||f.includes("gun"))&&(E=`${w}mm`),`
                  <div class="flex justify-between">
                    <span class="text-slate-400">${$}:</span>
                    <span class="text-slate-200">${E}</span>
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
    `,m.appendChild(b),m.addEventListener("click",f=>{f.target===m&&m.remove()}),b.querySelector("#close-equipment-modal").addEventListener("click",()=>{m.remove()});const v=b.querySelector("#view-equipment-sheet");v&&r.sheetImageUrl&&v.addEventListener("click",()=>{ke(e,r.sheetImageUrl)}),document.addEventListener("keydown",function f(w){w.key==="Escape"&&(m.remove(),document.removeEventListener("keydown",f))}),document.body.appendChild(m)}catch(a){console.error("Erro ao carregar detalhes do equipamento:",a)}}function ke(t,e){const a=document.getElementById("equipment-sheet-modal");a&&a.remove();const s=document.createElement("div");s.id="equipment-sheet-modal",s.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const o=document.createElement("div");o.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col",o.innerHTML=`
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
  `,s.appendChild(o),s.addEventListener("click",i=>{i.target===s&&s.remove()}),o.querySelector("#close-sheet-modal").addEventListener("click",()=>{s.remove()}),o.querySelector("#open-sheet-new-tab").addEventListener("click",()=>{window.open(e,"_blank")}),document.addEventListener("keydown",function i(r){r.key==="Escape"&&(s.remove(),document.removeEventListener("keydown",i))}),document.body.appendChild(s)}async function ne(){try{const t=document.getElementById("naval-content-container");if(!t)return;t.innerHTML='<div class="flex items-center justify-center py-8"><div class="text-slate-400">🔄 Carregando sistema naval...</div></div>';const e=y.currentUser;if(!e)return;const a=await h(e.uid);if(!a)return;const s=new te,o=window.currentCountry;if(!o)throw new Error("Dados do país não encontrados. Recarregue a página.");const[i,r]=await Promise.all([s.getCurrentShipyardLevel(a),g.collection("paises").get().then(d=>{if(d.empty)return 0;let l=0,n=0;return d.forEach(c=>{const u=parseFloat(c.data().PIB);isNaN(u)||(l+=u,n++)}),n>0?l/n:0})]);t.innerHTML=Ie(s,i,o,a,r)}catch(t){console.error("Erro ao carregar sistema naval:",t);const e=document.getElementById("naval-content-container");e&&(e.innerHTML=`<div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center"><div class="text-6xl mb-4">❌</div><h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3><p class="text-red-400">Erro ao carregar sistema naval: ${t.message}</p></div>`)}}function Ie(t,e,a,s,o){const i=S(a),r=t.getLevelInfo(e,a,o),d=t.calculateMaintenanceCost(e,i),l=t.canUpgrade(e,a,o,i),n=[];for(let c=1;c<=3;c++)e+c<=t.maxLevel&&n.push(t.getLevelInfo(e+c,a,o));return`
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
                  <span class="text-red-400">${x(d)}</span>
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
                    <span class="text-emerald-300 font-semibold">${x(r.upgradeCost)}</span>
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
                  <span class="text-xs text-emerald-300">${x(c.upgradeCost)}</span>
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
          ${Te(t,e)}
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
                <div class="text-sm font-semibold text-slate-200">${x(R(a))}/turno</div>
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
                <span class="text-slate-200">${x(R(a))}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Bônus estaleiro:</span>
                <span class="text-green-400">+${r.parallelBonus}%</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Capacidade efetiva:</span>
                <span class="text-emerald-400 font-semibold">${x(R(a)*(1+r.parallelBonus/100))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Te(t,e){return[{name:"Corveta",baseTime:8,baseParallel:12},{name:"Destroyer",baseTime:18,baseParallel:4},{name:"Cruzador",baseTime:30,baseParallel:2}].map(s=>{const o=t.calculateProductionBonus(e),i=Math.ceil(s.baseTime*(1-o.timeReduction)),r=Math.ceil(s.baseParallel*o.parallelMultiplier),d=Math.ceil(s.baseTime/3),l=Math.ceil(i/3);return`
      <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <h4 class="font-semibold text-slate-200 mb-3">${s.name}</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo base:</span>
            <span class="text-slate-300">${s.baseTime} meses (${d} turnos)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo atual:</span>
            <span class="text-blue-400">${i} meses (${l} turnos)</span>
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
    `}).join("")}window.upgradeShipyard=async function(t){try{if(!confirm("Tem certeza que deseja fazer upgrade do estaleiro? O custo será deduzido imediatamente do orçamento."))return;const e=y.currentUser;if(!e){alert("Usuário não autenticado");return}const a=await h(e.uid);if(!a||a!==t){alert("Você não tem permissão para fazer upgrade deste país");return}const s=event.target,o=s.textContent;s.textContent="🔄 Processando...",s.disabled=!0;const r=await new te().upgradeShipyard(t);r.success?(s.textContent="✅ Upgrade Concluído!",s.classList.add("bg-green-600"),alert(`🏭 Estaleiro upgradado para nível ${r.newLevel}!
💰 Custo: ${x(r.cost)}
📈 Novos bônus: +${r.levelInfo.parallelBonus}% paralelo, -${r.levelInfo.timeReduction}% tempo`),setTimeout(()=>{ne()},1500)):(s.textContent="❌ Erro",s.classList.add("bg-red-600"),alert("Erro ao fazer upgrade: "+r.error),setTimeout(()=>{s.textContent=o,s.classList.remove("bg-red-600"),s.disabled=!1},3e3))}catch(e){console.error("Erro ao fazer upgrade do estaleiro:",e),alert("Erro ao fazer upgrade: "+e.message),event.target&&(event.target.textContent="❌ Erro",event.target.classList.add("bg-red-600"),setTimeout(()=>{event.target.textContent="⬆️ Fazer Upgrade",event.target.classList.remove("bg-red-600"),event.target.disabled=!1},3e3))}};window.showEquipmentDetails=ie;async function Be(){try{const t=y.currentUser;if(!t)return null;const e=await h(t.uid);if(!e)return null;const a=await g.collection("paises").doc(e).get();if(a.exists){const s={id:a.id,...a.data()};return window.currentCountry=s,s}return null}catch(t){return console.error("Erro ao recarregar país:",t),null}}window.reloadCurrentCountry=Be;async function W(){try{await new Promise(o=>{y.onAuthStateChanged(o)});const t=y.currentUser;if(!t){document.getElementById("dashboard-content").innerHTML=`
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa estar logado.</p>
          </div>
        </div>
      `;return}const e=await h(t.uid),a=await X(),s=e?a.find(o=>o.id===e):null;if(!s){document.getElementById("dashboard-content").innerHTML=`
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa ter um país atribuído.</p>
          </div>
        </div>
      `;return}window.currentCountry=s,document.getElementById("dashboard-content").innerHTML=Ee(s),$e()}catch(t){console.error("Erro ao carregar dashboard:",t),document.getElementById("dashboard-content").innerHTML=`
      <div class="min-h-screen flex items-center justify-center bg-slate-950">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p class="text-slate-400">Erro ao carregar dashboard: ${t.message}</p>
        </div>
      </div>
    `}}window.ResourceProductionCalculator=ee;window.ResourceConsumptionCalculator=Z;window.updateBudgetDisplay=function(t){document.getElementById("budget-display").textContent=t};window.updateDistributionDisplay=function(t){const e=document.getElementById("vehicles-slider"),a=document.getElementById("aircraft-slider"),s=document.getElementById("naval-slider");let o=parseInt(e.value),i=parseInt(a.value),r=parseInt(s.value);if(t&&o+i+r>100){if(t==="vehicles"){const v=i+r;v>0&&(i=Math.max(10,Math.floor(i*(100-o)/v)),r=Math.max(10,100-o-i))}else if(t==="aircraft"){const v=o+r;v>0&&(o=Math.max(10,Math.floor(o*(100-i)/v)),r=Math.max(10,100-i-o))}else if(t==="naval"){const v=o+i;v>0&&(o=Math.max(10,Math.floor(o*(100-r)/v)),i=Math.max(10,100-r-o))}e.value=o,a.value=i,s.value=r}document.getElementById("vehicles-display").textContent=o,document.getElementById("aircraft-display").textContent=i,document.getElementById("naval-display").textContent=r;const d=o+i+r,l=document.getElementById("total-distribution-display");l.textContent=d+"%",d===100?l.className="text-lg font-bold text-emerald-400":d>100?l.className="text-lg font-bold text-red-400":l.className="text-lg font-bold text-yellow-400";const n=document.getElementById("military-budget-slider"),c=parseFloat(n.value)/100,m=S(window.currentCountry)*c*.85;document.getElementById("vehicles-amount").textContent=x(m*o/100),document.getElementById("aircraft-amount").textContent=x(m*i/100),document.getElementById("naval-amount").textContent=x(m*r/100)};window.saveMilitaryBudget=async function(t){try{const e=parseFloat(document.getElementById("military-budget-slider").value),a=y.currentUser;if(!a)return;const s=await h(a.uid);if(!s)return;const{db:o}=await A(async()=>{const{db:d}=await import("./firebase-BARDcBiw.js").then(l=>l.p);return{db:d}},__vite__mapDeps([1,2]));await o.collection("paises").doc(s).update({MilitaryBudgetPercent:e});const i=t.target,r=i.textContent;i.textContent="✓ Salvo!",i.classList.add("bg-green-600"),setTimeout(()=>{i.textContent=r,i.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(e){console.error("Erro ao salvar orçamento militar:",e),alert("Erro ao salvar orçamento militar. Tente novamente.")}};window.saveMilitaryDistribution=async function(t){try{const e=parseInt(document.getElementById("vehicles-slider").value),a=parseInt(document.getElementById("aircraft-slider").value),s=parseInt(document.getElementById("naval-slider").value),o=e+a+s;if(o!==100){alert(`A soma das distribuições deve ser exatamente 100%! Atual: ${o}%`);return}const i=y.currentUser;if(!i)return;const r=await h(i.uid);if(!r)return;const{db:d}=await A(async()=>{const{db:c}=await import("./firebase-BARDcBiw.js").then(u=>u.p);return{db:c}},__vite__mapDeps([1,2]));await d.collection("paises").doc(r).update({MilitaryDistributionVehicles:e,MilitaryDistributionAircraft:a,MilitaryDistributionNaval:s});const l=t.target,n=l.textContent;l.textContent="✓ Salvo!",l.classList.add("bg-green-600"),setTimeout(()=>{l.textContent=n,l.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(e){console.error("Erro ao salvar distribuição militar:",e),alert("Erro ao salvar distribuição militar. Tente novamente.")}};let _=null,B=null;async function Le(){const t=document.getElementById("marketplace-container");if(t)try{const e=y.currentUser;if(!e){t.innerHTML='<div class="text-center py-8 text-slate-400">Faça login para acessar o mercado internacional</div>';return}const a=await h(e.uid);if(!a){t.innerHTML='<div class="text-center py-8 text-slate-400">Você precisa estar associado a um país</div>';return}_||(_=new Q),B||(B=new se(_)),t.innerHTML=`
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
    `,Se(),C("all",a),ce(a),F(),ct()}catch(e){console.error("Erro ao carregar marketplace:",e),t.innerHTML='<div class="text-center py-8 text-red-400">Erro ao carregar marketplace</div>'}}function Se(){document.querySelectorAll(".marketplace-category-btn").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".marketplace-category-btn").forEach(p=>{p.classList.remove("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),p.classList.add("bg-bg/50","text-slate-300","border-bg-ring")}),n.classList.add("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),n.classList.remove("bg-bg/50","text-slate-300","border-bg-ring");const c=n.dataset.category,u=y.currentUser;u&&h(u.uid).then(p=>{p&&(ve(),C(c,p))})})});const t=document.getElementById("marketplace-search"),e=document.getElementById("marketplace-sort"),a=document.getElementById("marketplace-type");t&&t.addEventListener("input",ze(()=>{const n=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",c=y.currentUser;c&&h(c.uid).then(u=>{u&&C(n,u)})},300)),e&&e.addEventListener("change",()=>{const n=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",c=y.currentUser;c&&h(c.uid).then(u=>{u&&C(n,u)})}),a&&a.addEventListener("change",()=>{const n=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",c=y.currentUser;c&&h(c.uid).then(u=>{u&&C(n,u)})});const s=document.getElementById("create-offer-btn");s&&s.addEventListener("click",Ve);const o=document.getElementById("view-notifications-btn");o&&o.addEventListener("click",Qe);const i=document.getElementById("view-embargoes-btn");i&&i.addEventListener("click",et);const r=document.getElementById("create-embargo-btn");r&&r.addEventListener("click",at);const d=document.getElementById("create-test-offers-btn");d&&d.addEventListener("click",async()=>{d.disabled=!0,d.innerHTML="⏳ Criando...";try{const n=await _.createTestOffers();if(n.success)d.innerHTML="✅ Criado!",d.classList.remove("bg-yellow-600","hover:bg-yellow-700"),d.classList.add("bg-green-600"),setTimeout(()=>{const c=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",u=y.currentUser;u&&h(u.uid).then(p=>{p&&C(c,p)}),setTimeout(()=>{d.innerHTML="🧪 Dados Teste",d.classList.remove("bg-green-600"),d.classList.add("bg-yellow-600","hover:bg-yellow-700"),d.disabled=!1},3e3)},1e3);else throw new Error(n.error)}catch(n){console.error("Erro ao criar ofertas de teste:",n),d.innerHTML="❌ Erro",d.classList.remove("bg-yellow-600","hover:bg-yellow-700"),d.classList.add("bg-red-600"),setTimeout(()=>{d.innerHTML="🧪 Dados Teste",d.classList.remove("bg-red-600"),d.classList.add("bg-yellow-600","hover:bg-yellow-700"),d.disabled=!1},3e3)}});const l=document.getElementById("clear-test-offers-btn");l&&l.addEventListener("click",async()=>{if(confirm("Tem certeza que deseja deletar todas as ofertas de teste? Esta ação não pode ser desfeita.")){l.disabled=!0,l.innerHTML="⏳ Limpando...";try{const n=await _.clearTestOffers();if(n.success)l.innerHTML=`✅ ${n.count||0} removidas!`,l.classList.remove("bg-red-600","hover:bg-red-700"),l.classList.add("bg-green-600"),setTimeout(()=>{const c=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",u=y.currentUser;u&&h(u.uid).then(p=>{p&&C(c,p)}),setTimeout(()=>{l.innerHTML="🗑️ Limpar Teste",l.classList.remove("bg-green-600"),l.classList.add("bg-red-600","hover:bg-red-700"),l.disabled=!1},3e3)},1e3);else throw new Error(n.error)}catch(n){console.error("Erro ao limpar ofertas de teste:",n),l.innerHTML="❌ Erro",setTimeout(()=>{l.innerHTML="🗑️ Limpar Teste",l.disabled=!1},3e3)}}}),it()}async function De(){const t=document.getElementById("intelligence-dashboard-container");if(t)try{const e=window.currentCountry;if(!e){t.innerHTML=`
        <div class="text-center py-12">
          <span class="text-4xl text-red-400 mb-4 block">❌</span>
          <p class="text-red-300">País não encontrado</p>
        </div>
      `;return}const{renderAgencyDashboard:a}=await A(async()=>{const{renderAgencyDashboard:s}=await import("./renderer-BVNBaHoK.js").then(o=>o.d);return{renderAgencyDashboard:s}},__vite__mapDeps([4,1,2,5,6,7,8]));a(e,t)}catch(e){console.error("Erro ao carregar agência:",e),t.innerHTML=`
      <div class="text-center py-12">
        <span class="text-4xl text-red-400 mb-4 block">❌</span>
        <p class="text-red-300">Erro ao carregar agência de inteligência</p>
        <p class="text-sm text-slate-400 mt-2">${e.message}</p>
      </div>
    `}}async function C(t,e){const a=document.getElementById("marketplace-content");if(a)try{a.innerHTML=`
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-slate-400">Carregando ofertas...</p>
        </div>
      </div>
    `;const s=document.getElementById("marketplace-search")?.value||"",o=document.getElementById("marketplace-sort")?.value||"date",i=document.getElementById("marketplace-type")?.value||"all",r=parseFloat(document.getElementById("price-min")?.value)||null,d=parseFloat(document.getElementById("price-max")?.value)||null,l=parseInt(document.getElementById("quantity-min")?.value)||null,n=parseInt(document.getElementById("quantity-max")?.value)||null,c=document.getElementById("country-filter")?.value||null,u=parseInt(document.getElementById("time-filter")?.value)||null,p={category:t,type:i,searchTerm:s,current_country_id:e,orderBy:Pe(o),orderDirection:je(o),limit:50,priceMin:r,priceMax:d,quantityMin:l,quantityMax:n,countryFilter:c,timeFilter:u};let m=[],b={success:!0,offers:[]};if(t==="favorites"){const w=ge();if(w.length===0)m=[],b={success:!0,offers:[],totalCount:0};else{const $={...p,category:"all",limit:1e3};b=await _.getOffers($),b.success&&(m=b.offers.filter(E=>w.includes(E.id)))}}else b=await _.getOffers(p),m=b.offers||[];if(!b.success)throw new Error(b.error);if(m.length===0){const w=await U(e);a.innerHTML=`
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-lg font-medium text-white mb-2">Nenhuma oferta encontrada</h3>
          <p class="text-slate-400 mb-6">Não há ofertas disponíveis para os filtros selecionados</p>
          ${w.hasEmbargoes?`
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 mx-auto max-w-md">
              <div class="flex items-center gap-2 text-red-400 mb-2">
                <span>🚫</span>
                <span class="font-medium">Embargos Ativos</span>
              </div>
              <p class="text-sm text-red-300">
                ${w.totalEmbargoes} país(es) aplicaram embargos contra você,
                limitando ${w.blockedCategories.length>0?"algumas categorias":"todas as trocas"}.
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
      `;return}const v=await U(e);let f="";v.hasEmbargoes&&(f+=`
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-yellow-400 mb-2">
            <span>⚠️</span>
            <span class="font-medium">Aviso de Embargos</span>
          </div>
          <p class="text-sm text-yellow-300">
            Algumas ofertas podem estar ocultas devido a embargos ativos.
            ${v.totalEmbargoes} país(es) aplicaram restrições comerciais.
          </p>
          <button onclick="openEmbargoesModal()" class="mt-2 text-xs px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors">
            Ver Detalhes
          </button>
        </div>
      `),f+=`
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="offers-grid">
        ${m.map(w=>le(w,e)).join("")}
      </div>

      <!-- Pagination Controls -->
      <div class="mt-8 border-t border-bg-ring/50 pt-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Results Info -->
          <div class="text-sm text-slate-400">
            Mostrando ${m.length} de ${b.totalCount||m.length} ofertas
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
    `,a.innerHTML=f,bt(m),ut(e,t,p)}catch(s){console.error("Erro ao carregar ofertas:",s),a.innerHTML=`
      <div class="text-center py-12 text-red-400">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-medium mb-2">Erro ao carregar ofertas</h3>
        <p class="mb-4">${s.message||"Tente novamente em alguns instantes"}</p>
        <button onclick="auth.currentUser && checkPlayerCountry(auth.currentUser.uid).then(paisId => paisId && loadMarketplaceOffers('${t}', paisId))" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Tentar novamente
        </button>
      </div>
    `}}window.loadMarketplaceOffers=C;function Pe(t){switch(t){case"price-low":case"price-high":return"price_per_unit";case"quantity":return"quantity";case"popularity":return"views";case"expires-soon":return"expires_at";case"date":default:return"created_at"}}function je(t){switch(t){case"price-low":case"expires-soon":return"asc";case"price-high":case"quantity":case"popularity":case"date":default:return"desc"}}async function U(t){try{if(!t)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const e=await g.collection("marketplace_embargoes").where("target_country_id","==",t).where("status","==","active").get(),a=[];if(e.forEach(i=>{a.push(i.data())}),a.length===0)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const s=new Set;let o=!1;return a.forEach(i=>{i.type==="full"?(o=!0,s.add("resources"),s.add("vehicles"),s.add("naval")):i.type==="partial"&&i.categories_blocked&&i.categories_blocked.forEach(r=>{s.add(r)})}),{hasEmbargoes:!0,totalEmbargoes:a.length,blockedCategories:Array.from(s),hasFullEmbargo:o,embargoes:a}}catch(e){return console.error("Erro ao verificar embargos:",e),{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]}}}function le(t,e){const a=y.currentUser,s=a&&(t.player_id===a.uid||t.country_id===e),o=t.expires_at?.toDate?t.expires_at.toDate():new Date(t.expires_at),i=t.quantity*t.price_per_unit,r=Math.max(0,Math.floor((o-new Date)/(1440*60*1e3))),d=t.type==="sell"?{label:"Venda",color:"text-green-400 bg-green-400/20",icon:"💰"}:{label:"Compra",color:"text-blue-400 bg-blue-400/20",icon:"🛒"},l={resources:"🏭",vehicles:"🚗",naval:"🚢"};return`
    <div id="offer-card-${t.id}" class="bg-bg-soft border border-bg-ring/70 rounded-xl p-4 hover:border-brand-400/30 transition-colors cursor-pointer" onclick="openOfferDetails('${t.id}')">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${l[t.category]}</span>
          <span class="px-2 py-1 rounded text-xs font-medium ${d.color}">
            ${d.icon} ${d.label}
          </span>
        </div>
        <div class="text-right text-xs text-slate-400">
          <div>${r} dias restantes</div>
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
          <span class="text-sm font-medium text-brand-400">${x(t.price_per_unit)}</span>
        </div>
        <div class="flex justify-between border-t border-bg-ring/50 pt-2">
          <span class="text-sm font-medium text-slate-300">Valor total:</span>
          <span class="font-semibold text-white">${x(i)}</span>
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
          ${s&&t.type==="sell"?`
          <button id="cancel-offer-btn-${t.id}" class="text-xs px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors" onclick="event.stopPropagation(); cancelOffer('${t.id}')">
            Cancelar
          </button>
          `:`
          <button class="text-xs px-3 py-1 bg-brand-500/20 text-brand-400 rounded-lg hover:bg-brand-500/30 transition-colors" onclick="event.stopPropagation(); openOfferDetails('${t.id}')">
            Ver detalhes
          </button>
          `}
        </div>
      </div>
    </div>
  `}async function Ae(t){if(!t||!confirm("Tem certeza que deseja cancelar esta oferta de venda? Os itens serão restituídos ao seu inventário."))return;const e=document.getElementById(`cancel-offer-btn-${t}`);e&&(e.disabled=!0,e.textContent="Cancelando...");try{_||(_=new Q);const a=await _.cancelOffer(t);if(a.success){const s=document.getElementById(`offer-card-${t}`);s&&(s.style.transition="opacity 0.5s ease",s.style.opacity="0",setTimeout(()=>s.remove(),500)),alert("Oferta cancelada com sucesso!")}else throw new Error(a.error||"Erro desconhecido ao cancelar a oferta.")}catch(a){console.error("Erro ao cancelar oferta:",a),alert(`Não foi possível cancelar a oferta: ${a.message}`),e&&(e.disabled=!1,e.textContent="Cancelar")}}window.cancelOffer=Ae;async function Oe(t){try{_&&_.incrementOfferViews(t);const e=y.currentUser;if(!e){alert("Você precisa estar logado para visualizar detalhes");return}const a=await h(e.uid);if(!a){alert("Você precisa estar associado a um país");return}const o=(await X()).find($=>$.id===a);if(!o){alert("Dados do país não encontrados");return}const i=document.querySelectorAll('[onclick*="openOfferDetails"]');let r=null;try{const $=await _.getOffers({limit:1e3});$.success&&$.offers&&(r=$.offers.find(E=>E.id===t))}catch($){console.error("Error finding offer:",$)}if(!r){alert("Oferta não encontrada");return}const d=document.getElementById("offer-details-modal");d&&d.remove();const l=document.createElement("div");l.id="offer-details-modal",l.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";const n=r.player_id===e.uid||r.country_id===a,c=!n&&r.type==="sell"&&r.status==="active",u=!n&&r.type==="buy"&&r.status==="active",p=c||u,m=S(o),b=r.quantity*r.price_per_unit,v=m>=b,f=r.expires_at?.toDate?r.expires_at.toDate():new Date(r.expires_at),w=Math.max(0,Math.ceil((f-new Date)/(1440*60*1e3)));l.innerHTML=`
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
                  <span>${w} dias restantes</span>
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
                    <span class="text-white font-medium">${M(r.price_per_unit)}</span>
                  </div>
                  <div class="flex justify-between border-t border-bg-ring pt-2 mt-3">
                    <span class="text-slate-400">Valor Total:</span>
                    <span class="text-brand-300 font-bold text-lg">${M(r.total_value)}</span>
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
              `:p?`
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
                          <span class="text-white">${M(r.price_per_unit)}</span>
                        </div>
                        <div class="flex justify-between font-medium border-t border-brand-400/30 pt-1 mt-2">
                          <span class="text-brand-300">Total a pagar:</span>
                          <span class="text-brand-300" id="summary-total">${M((r.min_quantity||1)*r.price_per_unit)}</span>
                        </div>
                      </div>
                    </div>

                    ${r.type==="sell"&&!v?`
                      <div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                        <div class="flex items-start space-x-2">
                          <div class="text-red-400">⚠️</div>
                          <div>
                            <div class="text-red-300 font-medium">Orçamento Insuficiente</div>
                            <div class="text-sm text-slate-300 mt-1">
                              Disponível: ${M(m)}<br>
                              Necessário: ${M(b)}
                            </div>
                          </div>
                        </div>
                      </div>
                    `:""}

                    <div class="flex space-x-2">
                      <button onclick="closeOfferDetailsModal()" class="flex-1 px-4 py-2 text-slate-300 hover:text-white transition-colors border border-bg-ring rounded-lg">
                        Cancelar
                      </button>
                      <button onclick="processTransaction('${r.id}')" id="process-transaction-btn" class="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors ${r.type==="sell"&&!v?"opacity-50 cursor-not-allowed":""}" ${r.type==="sell"&&!v?"disabled":""}>
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
                    <span class="text-white">${M(r.price_per_unit*(.9+Math.random()*.2))}</span>
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
    `,document.body.appendChild(l),Fe(r,o,a)}catch(e){console.error("Erro ao abrir detalhes da oferta:",e),alert("Erro ao carregar detalhes da oferta")}}function P(){const t=document.getElementById("offer-details-modal");t&&t.remove()}function Fe(t,e,a){const s=document.getElementById("offer-details-modal");if(!s)return;const o=s.querySelector("#transaction-quantity");o&&o.addEventListener("input",()=>{Ne(t,o.value)}),s.addEventListener("click",i=>{i.target===s&&P()}),document.addEventListener("keydown",function i(r){r.key==="Escape"&&(P(),document.removeEventListener("keydown",i))})}function Ne(t,e){const a=document.getElementById("offer-details-modal");if(!a)return;const s=a.querySelector("#summary-quantity"),o=a.querySelector("#summary-total");if(s&&o){const i=parseInt(e)||1,r=i*t.price_per_unit;s.textContent=i.toLocaleString(),o.textContent=M(r)}}async function Re(t){try{const e=document.getElementById("offer-details-modal"),a=e.querySelector("#transaction-quantity"),s=e.querySelector("#process-transaction-btn"),o=s.textContent;if(!a){alert("Erro: quantidade não especificada");return}const i=parseInt(a.value);if(!i||i<=0){alert("Por favor, especifique uma quantidade válida"),a.focus();return}const r=y.currentUser;if(!r){alert("Você precisa estar logado");return}if(!await h(r.uid)){alert("Você precisa estar associado a um país");return}const n=(await _.getOffers({limit:1e3})).offers?.find(b=>b.id===t);if(!n){alert("Oferta não encontrada");return}if(i<(n.min_quantity||1)){alert(`Quantidade mínima: ${n.min_quantity||1} ${n.unit}`);return}if(i>(n.max_quantity||n.quantity)){alert(`Quantidade máxima: ${n.max_quantity||n.quantity} ${n.unit}`);return}if(i>n.quantity){alert(`Quantidade disponível: ${n.quantity} ${n.unit}`);return}const c=i*n.price_per_unit,p=`
      Confirmar ${n.type==="sell"?"comprar":"vender"}:

      • Item: ${n.item_name}
      • Quantidade: ${i} ${n.unit}
      • Preço unitário: ${M(n.price_per_unit)}
      • Valor total: ${M(c)}
      • País: ${n.country_name}

      Deseja continuar?
    `;if(!confirm(p))return;s.disabled=!0,s.textContent="⏳ Processando...";const m=await _.createTransaction(t,{quantity:i});if(m.success)s.textContent="✅ Sucesso!",s.classList.remove("bg-brand-500","hover:bg-brand-600"),s.classList.add("bg-green-600"),setTimeout(()=>{alert("Transação criada com sucesso! A negociação foi iniciada."),P();const b=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",v=y.currentUser;v&&h(v.uid).then(f=>{f&&C(b,f)})},1500);else throw new Error(m.error||"Erro desconhecido ao processar transação")}catch(e){console.error("Erro ao processar transação:",e);const a=document.querySelector("#process-transaction-btn");a&&(a.textContent="❌ Erro",a.classList.remove("bg-brand-500","hover:bg-brand-600"),a.classList.add("bg-red-600"),setTimeout(()=>{a.textContent=offer.type==="sell"?"💰 Comprar":"🔥 Vender",a.classList.remove("bg-red-600"),a.classList.add("bg-brand-500","hover:bg-brand-600"),a.disabled=!1},3e3)),alert("Erro ao processar transação: "+e.message)}}async function Ue(t,e,a){try{console.log("Abrindo detalhes do equipamento:",{itemId:t,category:e,countryId:a});const s=await _.getCountryInventory(a);let o=null,i=null;if(Object.keys(s).forEach(l=>{s[l]&&typeof s[l]=="object"&&Object.keys(s[l]).forEach(n=>{const c=s[l][n];c&&typeof c=="object"&&(`${l}_${n}`.toLowerCase().replace(/\s+/g,"_")===t||n.toLowerCase().includes(t.toLowerCase()))&&(o=c,i=l,o.name=n,o.category=l)})}),!o){alert("Equipamento não encontrado no inventário do país vendedor.");return}const r=document.getElementById("equipment-details-modal");r&&r.remove();const d=document.createElement("div");d.id="equipment-details-modal",d.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4",d.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">${e==="vehicles"?"🚗":"🚢"}</div>
              <div>
                <h2 class="text-xl font-bold text-white">${o.name}</h2>
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
                    <span class="text-white">${o.name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${i}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade no Inventário:</span>
                    <span class="text-white">${o.quantity||0} unidades</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo Total de Produção:</span>
                    <span class="text-white">${M(o.cost||0)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo de Manutenção/Mês:</span>
                    <span class="text-white">${M((o.cost||0)*.05)}</span>
                  </div>
                </div>
              </div>

              ${o.components?`
              <!-- Componentes -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">🔧 Componentes</h3>
                <div class="space-y-3 text-sm">
                  ${Object.entries(o.components).map(([l,n])=>`
                    <div class="bg-bg/50 rounded p-3">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="text-brand-300 font-medium">${l.replace(/_/g," ").toUpperCase()}</div>
                          <div class="text-slate-300">${n.name||"N/A"}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-slate-400 text-xs">Custo</div>
                          <div class="text-white">${M(n.cost||0)}</div>
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
              ${o.stats?`
              <!-- Estatísticas -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-3">
                  ${Object.entries(o.stats).map(([l,n])=>`
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
                    <span class="text-white">${Math.floor((o.quantity||0)*.5)} unidades (50% max)</span>
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
    `,document.body.appendChild(d),d.addEventListener("click",l=>{l.target===d&&V()}),document.addEventListener("keydown",function l(n){n.key==="Escape"&&(V(),document.removeEventListener("keydown",l))})}catch(s){console.error("Erro ao abrir detalhes do equipamento:",s),alert("Erro ao carregar detalhes do equipamento")}}function V(){const t=document.getElementById("equipment-details-modal");t&&t.remove()}window.openOfferDetails=Oe;window.openEquipmentDetails=Ue;window.closeEquipmentDetailsModal=V;window.closeOfferDetailsModal=P;window.processTransaction=Re;async function Ve(){try{const t=y.currentUser;if(!t){alert("Você precisa estar logado para criar ofertas");return}const e=await h(t.uid);if(!e){alert("Você precisa estar associado a um país");return}window.paisId=e,B||(_||(_=new Q),B=new se(_)),await B.openResourceSellModal()}catch(t){console.error("Erro ao abrir modal de criação:",t),alert("Erro ao abrir formulário de criação de ofertas")}}function He(){const t=document.getElementById("create-offer-modal"),e=document.getElementById("resource-sell-modal");t&&t.remove(),e&&e.remove()}window.closeCreateOfferModal=He;function ze(t,e){let a;return function(...o){const i=()=>{clearTimeout(a),t(...o)};clearTimeout(a),a=setTimeout(i,e)}}async function Qe(){try{const t=y.currentUser;if(!t)return;const e=await h(t.uid);if(!e)return;const a=document.createElement("div");a.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="notifications-modal",a.innerHTML=`
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
    `,document.body.appendChild(a),Ge(e),await Je(e)}catch(t){console.error("Erro ao abrir modal de notificações:",t)}}function H(){const t=document.getElementById("notifications-modal");t&&t.remove()}function Ge(t){const e=document.getElementById("notifications-modal");if(!e)return;const a=e.querySelectorAll(".notification-filter-btn");a.forEach(s=>{s.addEventListener("click",()=>{a.forEach(i=>{i.classList.remove("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),i.classList.add("bg-bg/50","text-slate-300","border-bg-ring")}),s.classList.add("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),s.classList.remove("bg-bg/50","text-slate-300","border-bg-ring");const o=s.dataset.filter;O(o)})}),e.addEventListener("click",s=>{s.target===e&&H()}),document.addEventListener("keydown",function s(o){o.key==="Escape"&&(H(),document.removeEventListener("keydown",s))})}let q=[];async function Je(t){try{const e=await g.collection("notifications").where("target_country_id","==",t).orderBy("created_at","desc").limit(50).get();q=[],e.forEach(a=>{q.push({id:a.id,...a.data()})}),de(q)}catch(e){console.error("Erro ao carregar notificações:",e);const a=document.getElementById("notifications-list");a&&(a.innerHTML=`
        <div class="text-center py-8 text-red-400">
          <div class="text-4xl mb-2">❌</div>
          <p>Erro ao carregar notificações</p>
        </div>
      `)}}function de(t){const e=document.getElementById("notifications-list");if(e){if(t.length===0){e.innerHTML=`
      <div class="text-center py-8 text-slate-400">
        <div class="text-4xl mb-2">📪</div>
        <p>Nenhuma notificação encontrada</p>
      </div>
    `;return}e.innerHTML=t.map(a=>Ke(a)).join("")}}function Ke(t){const e=!t.read,a=t.created_at?.toDate?t.created_at.toDate():new Date(t.created_at),s=Ze(a),o={embargo_applied:"🚫",embargo_lifted:"✅",transaction_created:"💰",transaction_completed:"✅",trade_offer:"📦",diplomatic:"🏛️"},i={embargo_applied:"border-red-400/30 bg-red-400/10",embargo_lifted:"border-green-400/30 bg-green-400/10",transaction_created:"border-blue-400/30 bg-blue-400/10",transaction_completed:"border-green-400/30 bg-green-400/10",trade_offer:"border-yellow-400/30 bg-yellow-400/10",diplomatic:"border-purple-400/30 bg-purple-400/10"},r=o[t.type]||"📬";return`
    <div class="notification-item bg-bg border ${i[t.type]||"border-slate-400/30 bg-slate-400/10"} rounded-lg p-4 ${e?"border-l-4 border-l-brand-400":""}"
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
  `}function O(t){let e=q;t==="unread"?e=q.filter(a=>!a.read):t==="embargo"?e=q.filter(a=>a.type&&a.type.includes("embargo")):t==="transaction"&&(e=q.filter(a=>a.type&&a.type.includes("transaction"))),de(e)}async function We(t){try{await g.collection("notifications").doc(t).update({read:!0,read_at:new Date});const e=q.find(s=>s.id===t);e&&(e.read=!0);const a=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";O(a),await F()}catch(e){console.error("Erro ao marcar notificação como lida:",e)}}async function Ye(){try{const t=y.currentUser;if(!t||!await h(t.uid))return;const a=g.batch();q.forEach(o=>{if(!o.read){const i=g.collection("notifications").doc(o.id);a.update(i,{read:!0,read_at:new Date}),o.read=!0}}),await a.commit();const s=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";O(s),await F()}catch(t){console.error("Erro ao marcar todas as notificações como lidas:",t)}}async function Xe(t){try{if(!confirm("Tem certeza que deseja excluir esta notificação?"))return;await g.collection("notifications").doc(t).delete(),q=q.filter(a=>a.id!==t);const e=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";O(e),await F()}catch(e){console.error("Erro ao excluir notificação:",e)}}async function F(){try{const t=y.currentUser;if(!t)return;const e=await h(t.uid);if(!e)return;const s=(await g.collection("notifications").where("target_country_id","==",e).where("read","==",!1).get()).size,o=document.getElementById("notifications-count-badge");o&&(s>0?(o.textContent=s>99?"99+":s.toString(),o.classList.remove("hidden")):o.classList.add("hidden"))}catch(t){console.error("Erro ao atualizar contador de notificações:",t)}}function Ze(t){const a=new Date-t,s=Math.floor(a/(1e3*60)),o=Math.floor(a/(1e3*60*60)),i=Math.floor(a/(1e3*60*60*24));return s<1?"Agora há pouco":s<60?`${s} min atrás`:o<24?`${o}h atrás`:i<7?`${i} dias atrás`:t.toLocaleDateString("pt-BR")}window.closeNotificationsModal=H;window.markNotificationAsRead=We;window.markAllNotificationsAsRead=Ye;window.deleteNotification=Xe;async function et(){try{const t=y.currentUser;if(!t)return;const e=await h(t.uid);if(!e)return;const a=document.createElement("div");a.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="embargoes-modal",a.innerHTML=`
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
    `,document.body.appendChild(a),await tt(e)}catch(t){console.error("Erro ao abrir modal de embargos:",t)}}async function tt(t){try{const e=await g.collection("marketplace_embargoes").where("embargo_country_id","==",t).where("status","==","active").orderBy("created_at","desc").get(),a=await g.collection("marketplace_embargoes").where("target_country_id","==",t).where("status","==","active").orderBy("created_at","desc").get(),s=[],o=[];e.forEach(d=>{s.push({id:d.id,...d.data()})}),a.forEach(d=>{o.push({id:d.id,...d.data()})});const i=document.getElementById("applied-embargoes-list");i&&(s.length===0?i.innerHTML=`
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">🕊️</div>
            <p>Nenhum embargo aplicado</p>
          </div>
        `:i.innerHTML=s.map(d=>Y(d,"applied")).join(""));const r=document.getElementById("received-embargoes-list");r&&(o.length===0?r.innerHTML=`
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">✅</div>
            <p>Nenhum embargo recebido</p>
          </div>
        `:r.innerHTML=o.map(d=>Y(d,"received")).join(""))}catch(e){console.error("Erro ao carregar dados de embargos:",e)}}function Y(t,e){const a=t.expires_at&&new Date(t.expires_at.toDate?t.expires_at.toDate():t.expires_at)<new Date(Date.now()+6048e5),s=e==="applied"?t.target_country_name:t.embargo_country_name,o=e==="applied"?"🎯":"⚠️",i=t.type==="full"?{label:"Total",color:"text-red-400 bg-red-400/20"}:{label:"Parcial",color:"text-yellow-400 bg-yellow-400/20"},r=t.created_at?.toDate?t.created_at.toDate():new Date(t.created_at),d=Math.floor((new Date-r)/(1440*60*1e3));return`
    <div class="bg-bg border border-bg-ring/70 rounded-lg p-4 ${a?"border-yellow-400/30":""}">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${o}</span>
          <div>
            <h4 class="font-medium text-white">${s}</h4>
            <span class="px-2 py-1 rounded text-xs font-medium ${i.color}">
              ${i.label}
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
  `}async function at(){try{const t=y.currentUser;if(!t)return;const e=await h(t.uid);if(!e)return;const a=await g.collection("paises").get(),s=[];a.forEach(i=>{const r=i.data();i.id!==e&&s.push({id:i.id,name:r.Pais,flag:r.Flag||"🏳️"})});const o=document.createElement("div");o.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",o.id="create-embargo-modal",o.innerHTML=`
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
              ${s.map(i=>`
                <option value="${i.id}">${i.flag} ${i.name}</option>
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
    `,document.body.appendChild(o),st()}catch(t){console.error("Erro ao abrir modal de criar embargo:",t)}}function st(){const t=document.querySelectorAll('input[name="embargo-type"]'),e=document.getElementById("categories-section");t.forEach(s=>{s.addEventListener("change",()=>{s.value==="partial"?e.classList.remove("hidden"):e.classList.add("hidden")})});const a=document.getElementById("create-embargo-form");a&&a.addEventListener("submit",rt)}async function rt(t){t.preventDefault();try{const e=new FormData(t.target),a=document.getElementById("target-country").value,s=e.get("embargo-type"),o=document.getElementById("embargo-reason").value,i=document.getElementById("embargo-duration").value;if(!a){alert("Selecione um país alvo");return}let r=[];if(s==="partial"){const p=document.querySelectorAll('input[name="blocked-categories"]:checked');if(r=Array.from(p).map(m=>m.value),r.length===0){alert("Selecione pelo menos uma categoria para embargo parcial");return}}let d=null;i&&(d=new Date(Date.now()+parseInt(i)*24*60*60*1e3));const l={target_country_id:a,type:s,categories_blocked:r,reason:o||"Motivos diplomáticos",expires_at:d},n=t.target.querySelector('button[type="submit"]'),c=n.textContent;n.textContent="Aplicando...",n.disabled=!0;const u=await _.applyEmbargo(l);if(u.success){alert("Embargo aplicado com sucesso!"),ot();const p=y.currentUser;if(p){const m=await h(p.uid);if(m){const b=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all";C(b,m),ce(m)}}}else throw new Error(u.error)}catch(e){console.error("Erro ao aplicar embargo:",e),alert(`Erro ao aplicar embargo: ${e.message}`);const a=t.target.querySelector('button[type="submit"]');a.textContent="Aplicar Embargo",a.disabled=!1}}function ot(){const t=document.getElementById("create-embargo-modal");t&&t.remove()}async function ce(t){try{const e=await U(t),a=document.getElementById("embargo-status-indicator"),s=document.getElementById("embargo-count-badge");if(!a||!s)return;if(e.hasEmbargoes){const o=e.hasFullEmbargo?"todas as categorias":`${e.blockedCategories.length} categoria(s)`;a.innerHTML=`
        <div class="flex items-center gap-2 text-red-400 text-sm">
          <span class="animate-pulse">⚠️</span>
          <span>${e.totalEmbargoes} embargo(s) ativo(s) bloqueando ${o}</span>
        </div>
      `,s.textContent=e.totalEmbargoes,s.classList.remove("hidden")}else a.innerHTML=`
        <div class="flex items-center gap-2 text-green-400 text-sm">
          <span>✅</span>
          <span>Nenhum embargo ativo</span>
        </div>
      `,s.classList.add("hidden")}catch(e){console.error("Erro ao atualizar indicador de embargo:",e)}}function it(){const t=document.getElementById("toggle-advanced-filters"),e=document.getElementById("advanced-filters-panel"),a=document.getElementById("advanced-filters-icon");t&&e&&a&&t.addEventListener("click",()=>{e.classList.toggle("hidden"),a.classList.toggle("rotate-180")});const s=document.getElementById("apply-filters-btn"),o=document.getElementById("clear-filters-btn"),i=document.getElementById("save-filters-btn");s&&s.addEventListener("click",ue),o&&o.addEventListener("click",nt),i&&i.addEventListener("click",lt),dt()}async function ue(){const t=y.currentUser;if(!t)return;const e=await h(t.uid);if(!e)return;ve();const a=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all";await C(a,e)}function nt(){document.getElementById("marketplace-search").value="",document.getElementById("marketplace-sort").value="date",document.getElementById("marketplace-type").value="all",document.getElementById("price-min").value="",document.getElementById("price-max").value="",document.getElementById("quantity-min").value="",document.getElementById("quantity-max").value="",document.getElementById("country-filter").value="",document.getElementById("time-filter").value="",ue()}function lt(){const t={search:document.getElementById("marketplace-search").value,sort:document.getElementById("marketplace-sort").value,type:document.getElementById("marketplace-type").value,priceMin:document.getElementById("price-min").value,priceMax:document.getElementById("price-max").value,quantityMin:document.getElementById("quantity-min").value,quantityMax:document.getElementById("quantity-max").value,country:document.getElementById("country-filter").value,timeFilter:document.getElementById("time-filter").value};localStorage.setItem("marketplace-filters",JSON.stringify(t));const e=document.getElementById("save-filters-btn"),a=e.textContent;e.textContent="✅ Salvo!",e.disabled=!0,setTimeout(()=>{e.textContent=a,e.disabled=!1},2e3)}function dt(){try{const t=localStorage.getItem("marketplace-filters");if(!t)return;const e=JSON.parse(t);e.search&&(document.getElementById("marketplace-search").value=e.search),e.sort&&(document.getElementById("marketplace-sort").value=e.sort),e.type&&(document.getElementById("marketplace-type").value=e.type),e.priceMin&&(document.getElementById("price-min").value=e.priceMin),e.priceMax&&(document.getElementById("price-max").value=e.priceMax),e.quantityMin&&(document.getElementById("quantity-min").value=e.quantityMin),e.quantityMax&&(document.getElementById("quantity-max").value=e.quantityMax),e.country&&(document.getElementById("country-filter").value=e.country),e.timeFilter&&(document.getElementById("time-filter").value=e.timeFilter)}catch(t){console.error("Erro ao carregar filtros salvos:",t)}}async function ct(){try{const t=await g.collection("paises").get(),e=document.getElementById("country-filter");if(!e)return;for(;e.children.length>1;)e.removeChild(e.lastChild);const a=[];t.forEach(s=>{const o=s.data();a.push({id:s.id,name:o.Pais,flag:o.Flag||"🏳️"})}),a.sort((s,o)=>s.name.localeCompare(o.name)),a.forEach(s=>{const o=document.createElement("option");o.value=s.id,o.textContent=`${s.flag} ${s.name}`,e.appendChild(o)})}catch(t){console.error("Erro ao carregar países para filtro:",t)}}let z=1,T=!1,L=!1,j=null;function ut(t,e,a){const s=document.getElementById("load-more-btn"),o=document.getElementById("infinite-scroll-toggle"),i=document.getElementById("infinite-scroll-icon");j={...a,countryId:t,category:e},s&&s.addEventListener("click",()=>{pe()}),o&&i&&(o.addEventListener("click",()=>{T=!T,T?(i.textContent="♾️",o.title="Carregamento automático ativado",pt()):(i.textContent="🔄",o.title="Carregamento automático desativado",me()),localStorage.setItem("marketplace-infinite-scroll",T)}),localStorage.getItem("marketplace-infinite-scroll")==="true"&&o.click())}async function pe(){if(L||!j)return;L=!0;const t=document.getElementById("load-more-btn"),e=document.getElementById("load-more-state"),a=document.getElementById("offers-grid");t&&(t.disabled=!0),e&&e.classList.remove("hidden");try{z++;const s={...j,limit:20,offset:(z-1)*20},o=await _.getOffers(s);if(o.success&&o.offers.length>0){const i=o.offers.map(l=>le(l)).join("");a&&(a.innerHTML+=i);const r=a?.children.length||0,d=document.querySelector(".text-sm.text-slate-400");d&&(d.textContent=`Mostrando ${r} ofertas`),o.offers.length<20&&t&&(t.textContent="✅ Todas as ofertas carregadas",t.disabled=!0)}else t&&(t.textContent="✅ Todas as ofertas carregadas",t.disabled=!0)}catch(s){console.error("Erro ao carregar mais ofertas:",s),t&&(t.disabled=!1)}finally{L=!1,e&&e.classList.add("hidden")}}function pt(){me(),window.addEventListener("scroll",be)}function me(){window.removeEventListener("scroll",be)}function be(){if(!T||L)return;const t=window.innerHeight+window.scrollY,e=document.documentElement.offsetHeight;if(t>=e-200){const s=document.getElementById("load-more-btn");s&&!s.disabled&&pe()}}function ve(){z=1,L=!1,j=null}function ge(){try{const t=localStorage.getItem("marketplace-favorites");return t?JSON.parse(t):[]}catch(t){return console.error("Erro ao carregar favoritos:",t),[]}}function mt(t){return ge().includes(t)}function bt(t){t.forEach(e=>{const a=document.getElementById(`favorite-btn-${e.id}`),s=document.getElementById(`favorite-icon-${e.id}`);a&&s&&(mt(e.id)?(a.classList.remove("bg-slate-600/20","text-slate-400"),a.classList.add("bg-yellow-500/20","text-yellow-400"),a.title="Remover dos favoritos",s.textContent="🌟"):(a.classList.remove("bg-yellow-500/20","text-yellow-400"),a.classList.add("bg-slate-600/20","text-slate-400"),a.title="Adicionar aos favoritos",s.textContent="⭐"))})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",W):W();
