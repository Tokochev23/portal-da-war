const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/firebase-BN3MSMQD.js","assets/preload-helper-f85Crcwt.js","assets/utils-DLoRv3re.js","assets/renderer-C5IsPkZP.js","assets/resourceConsumptionCalculator-Bk-hb2mA.js","assets/resourceProductionCalculator-C5abBl5S.js","assets/consumerGoodsCalculator-RQh-OK8I.js","assets/espionageOperationsSystem-BGbE2zV3.js"])))=>i.map(i=>d[i]);
import{_ as Ee}from"./preload-helper-f85Crcwt.js";/* empty css             */import{auth as h,checkPlayerCountry as w,db as g,app as St,getAllCountries as Ke}from"./firebase-BN3MSMQD.js";import{a as Lt,s as Te}from"./utils-DLoRv3re.js";import{E as Bt}from"./economicCalculations-Dr0U9Xmg.js";import{C as Dt}from"./consumerGoodsCalculator-RQh-OK8I.js";import{R as Ye}from"./resourceConsumptionCalculator-Bk-hb2mA.js";import{R as Ze}from"./resourceProductionCalculator-C5abBl5S.js";import{S as Xe}from"./shipyardSystem-DnhrZxPe.js";import{g as qe,a as Se,R as At,b as Pt}from"./resourceMapping-BBQTZbLj.js";import{g as Le}from"./renderer-C5IsPkZP.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage-compat.js";import"https://www.gstatic.com/firebasejs/10.12.2/firebase-functions-compat.js";import"./espionageOperationsSystem-BGbE2zV3.js";import"https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";const Nt=()=>{};var Be={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et=function(t){const e=[];let a=0;for(let s=0;s<t.length;s++){let r=t.charCodeAt(s);r<128?e[a++]=r:r<2048?(e[a++]=r>>6|192,e[a++]=r&63|128):(r&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(r=65536+((r&1023)<<10)+(t.charCodeAt(++s)&1023),e[a++]=r>>18|240,e[a++]=r>>12&63|128,e[a++]=r>>6&63|128,e[a++]=r&63|128):(e[a++]=r>>12|224,e[a++]=r>>6&63|128,e[a++]=r&63|128)}return e},jt=function(t){const e=[];let a=0,s=0;for(;a<t.length;){const r=t[a++];if(r<128)e[s++]=String.fromCharCode(r);else if(r>191&&r<224){const o=t[a++];e[s++]=String.fromCharCode((r&31)<<6|o&63)}else if(r>239&&r<365){const o=t[a++],n=t[a++],i=t[a++],l=((r&7)<<18|(o&63)<<12|(n&63)<<6|i&63)-65536;e[s++]=String.fromCharCode(55296+(l>>10)),e[s++]=String.fromCharCode(56320+(l&1023))}else{const o=t[a++],n=t[a++];e[s++]=String.fromCharCode((r&15)<<12|(o&63)<<6|n&63)}}return e.join("")},tt={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const a=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let r=0;r<t.length;r+=3){const o=t[r],n=r+1<t.length,i=n?t[r+1]:0,l=r+2<t.length,c=l?t[r+2]:0,u=o>>2,m=(o&3)<<4|i>>4;let d=(i&15)<<2|c>>6,p=c&63;l||(p=64,n||(d=64)),s.push(a[u],a[m],a[d],a[p])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(et(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):jt(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const a=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let r=0;r<t.length;){const o=a[t.charAt(r++)],i=r<t.length?a[t.charAt(r)]:0;++r;const c=r<t.length?a[t.charAt(r)]:64;++r;const m=r<t.length?a[t.charAt(r)]:64;if(++r,o==null||i==null||c==null||m==null)throw new Ot;const d=o<<2|i>>4;if(s.push(d),c!==64){const p=i<<4&240|c>>2;if(s.push(p),m!==64){const b=c<<6&192|m;s.push(b)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class Ot extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Rt=function(t){const e=et(t);return tt.encodeByteArray(e,!0)},at=function(t){return Rt(t).replace(/\./g,"")},Ft=function(t){try{return tt.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ht(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ut=()=>Ht().__FIREBASE_DEFAULTS__,Vt=()=>{if(typeof process>"u"||typeof Be>"u")return;const t=Be.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},zt=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&Ft(t[1]);return e&&JSON.parse(e)},st=()=>{try{return Nt()||Ut()||Vt()||zt()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Gt=t=>st()?.emulatorHosts?.[t],Qt=t=>{const e=Gt(t);if(!e)return;const a=e.lastIndexOf(":");if(a<=0||a+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(a+1),10);return e[0]==="["?[e.substring(1,a-1),s]:[e.substring(0,a),s]},rt=()=>st()?.config;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,a)=>{this.resolve=e,this.reject=a})}wrapCallback(e){return(a,s)=>{a?this.reject(a):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(a):e(a,s))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _e(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Jt(t){return(await fetch(t,{credentials:"include"})).ok}const R={};function Kt(){const t={prod:[],emulator:[]};for(const e of Object.keys(R))R[e]?t.emulator.push(e):t.prod.push(e);return t}function Yt(t){let e=document.getElementById(t),a=!1;return e||(e=document.createElement("div"),e.setAttribute("id",t),a=!0),{created:a,element:e}}let De=!1;function Zt(t,e){if(typeof window>"u"||typeof document>"u"||!_e(window.location.host)||R[t]===e||R[t]||De)return;R[t]=e;function a(d){return`__firebase__banner__${d}`}const s="__firebase__banner",o=Kt().prod.length>0;function n(){const d=document.getElementById(s);d&&d.remove()}function i(d){d.style.display="flex",d.style.background="#7faaf0",d.style.position="fixed",d.style.bottom="5px",d.style.left="5px",d.style.padding=".5em",d.style.borderRadius="5px",d.style.alignItems="center"}function l(d,p){d.setAttribute("width","24"),d.setAttribute("id",p),d.setAttribute("height","24"),d.setAttribute("viewBox","0 0 24 24"),d.setAttribute("fill","none"),d.style.marginLeft="-6px"}function c(){const d=document.createElement("span");return d.style.cursor="pointer",d.style.marginLeft="16px",d.style.fontSize="24px",d.innerHTML=" &times;",d.onclick=()=>{De=!0,n()},d}function u(d,p){d.setAttribute("id",p),d.innerText="Learn more",d.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",d.setAttribute("target","__blank"),d.style.paddingLeft="5px",d.style.textDecoration="underline"}function m(){const d=Yt(s),p=a("text"),b=document.getElementById(p)||document.createElement("span"),f=a("learnmore"),v=document.getElementById(f)||document.createElement("a"),y=a("preprendIcon"),x=document.getElementById(y)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(d.created){const C=d.element;i(C),u(v,f);const D=c();l(x,y),C.append(x,b,v,D),document.body.appendChild(C)}o?(b.innerText="Preview backend disconnected.",x.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(x.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,b.innerText="Preview backend running in this workspace."),b.setAttribute("id",p)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",m):m()}function Xt(){try{return typeof indexedDB=="object"}catch{return!1}}function ea(){return new Promise((t,e)=>{try{let a=!0;const s="validate-browser-context-for-indexeddb-analytics-module",r=self.indexedDB.open(s);r.onsuccess=()=>{r.result.close(),a||self.indexedDB.deleteDatabase(s),t(!0)},r.onupgradeneeded=()=>{a=!1},r.onerror=()=>{e(r.error?.message||"")}}catch(a){e(a)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ta="FirebaseError";class j extends Error{constructor(e,a,s){super(a),this.code=e,this.customData=s,this.name=ta,Object.setPrototypeOf(this,j.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,nt.prototype.create)}}class nt{constructor(e,a,s){this.service=e,this.serviceName=a,this.errors=s}create(e,...a){const s=a[0]||{},r=`${this.service}/${e}`,o=this.errors[e],n=o?aa(o,s):"Error",i=`${this.serviceName}: ${n} (${r}).`;return new j(r,i,s)}}function aa(t,e){return t.replace(sa,(a,s)=>{const r=e[s];return r!=null?String(r):`<${s}?>`})}const sa=/\{\$([^}]+)}/g;function ue(t,e){if(t===e)return!0;const a=Object.keys(t),s=Object.keys(e);for(const r of a){if(!s.includes(r))return!1;const o=t[r],n=e[r];if(Ae(o)&&Ae(n)){if(!ue(o,n))return!1}else if(o!==n)return!1}for(const r of s)if(!a.includes(r))return!1;return!0}function Ae(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(t){return t&&t._delegate?t._delegate:t}class V{constructor(e,a,s){this.name=e,this.instanceFactory=a,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ra{constructor(e,a){this.name=e,this.container=a,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const a=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(a)){const s=new Wt;if(this.instancesDeferred.set(a,s),this.isInitialized(a)||this.shouldAutoInitialize())try{const r=this.getOrInitializeService({instanceIdentifier:a});r&&s.resolve(r)}catch{}}return this.instancesDeferred.get(a).promise}getImmediate(e){const a=this.normalizeInstanceIdentifier(e?.identifier),s=e?.optional??!1;if(this.isInitialized(a)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:a})}catch(r){if(s)return null;throw r}else{if(s)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(oa(e))try{this.getOrInitializeService({instanceIdentifier:A})}catch{}for(const[a,s]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(a);try{const o=this.getOrInitializeService({instanceIdentifier:r});s.resolve(o)}catch{}}}}clearInstance(e=A){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(a=>"INTERNAL"in a).map(a=>a.INTERNAL.delete()),...e.filter(a=>"_delete"in a).map(a=>a._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=A){return this.instances.has(e)}getOptions(e=A){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:a={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:s,options:a});for(const[o,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(o);s===i&&n.resolve(r)}return r}onInit(e,a){const s=this.normalizeInstanceIdentifier(a),r=this.onInitCallbacks.get(s)??new Set;r.add(e),this.onInitCallbacks.set(s,r);const o=this.instances.get(s);return o&&e(o,s),()=>{r.delete(e)}}invokeOnInitCallbacks(e,a){const s=this.onInitCallbacks.get(a);if(s)for(const r of s)try{r(e,a)}catch{}}getOrInitializeService({instanceIdentifier:e,options:a={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:na(e),options:a}),this.instances.set(e,s),this.instancesOptions.set(e,a),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=A){return this.component?this.component.multipleInstances?e:A:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function na(t){return t===A?void 0:t}function oa(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const a=this.getProvider(e.name);if(a.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);a.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const a=new ra(e,this);return this.providers.set(e,a),a}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var _;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(_||(_={}));const la={debug:_.DEBUG,verbose:_.VERBOSE,info:_.INFO,warn:_.WARN,error:_.ERROR,silent:_.SILENT},ca=_.INFO,da={[_.DEBUG]:"log",[_.VERBOSE]:"log",[_.INFO]:"info",[_.WARN]:"warn",[_.ERROR]:"error"},ua=(t,e,...a)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),r=da[e];if(r)console[r](`[${s}]  ${t.name}:`,...a);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class pa{constructor(e){this.name=e,this._logLevel=ca,this._logHandler=ua,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in _))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?la[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,_.DEBUG,...e),this._logHandler(this,_.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,_.VERBOSE,...e),this._logHandler(this,_.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,_.INFO,...e),this._logHandler(this,_.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,_.WARN,...e),this._logHandler(this,_.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,_.ERROR,...e),this._logHandler(this,_.ERROR,...e)}}const ma=(t,e)=>e.some(a=>t instanceof a);let Pe,Ne;function ba(){return Pe||(Pe=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function ga(){return Ne||(Ne=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ot=new WeakMap,pe=new WeakMap,it=new WeakMap,oe=new WeakMap,$e=new WeakMap;function fa(t){const e=new Promise((a,s)=>{const r=()=>{t.removeEventListener("success",o),t.removeEventListener("error",n)},o=()=>{a(L(t.result)),r()},n=()=>{s(t.error),r()};t.addEventListener("success",o),t.addEventListener("error",n)});return e.then(a=>{a instanceof IDBCursor&&ot.set(a,t)}).catch(()=>{}),$e.set(e,t),e}function va(t){if(pe.has(t))return;const e=new Promise((a,s)=>{const r=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",n),t.removeEventListener("abort",n)},o=()=>{a(),r()},n=()=>{s(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",o),t.addEventListener("error",n),t.addEventListener("abort",n)});pe.set(t,e)}let me={get(t,e,a){if(t instanceof IDBTransaction){if(e==="done")return pe.get(t);if(e==="objectStoreNames")return t.objectStoreNames||it.get(t);if(e==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return L(t[e])},set(t,e,a){return t[e]=a,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function xa(t){me=t(me)}function ha(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...a){const s=t.call(ie(this),e,...a);return it.set(s,e.sort?e.sort():[e]),L(s)}:ga().includes(t)?function(...e){return t.apply(ie(this),e),L(ot.get(this))}:function(...e){return L(t.apply(ie(this),e))}}function ya(t){return typeof t=="function"?ha(t):(t instanceof IDBTransaction&&va(t),ma(t,ba())?new Proxy(t,me):t)}function L(t){if(t instanceof IDBRequest)return fa(t);if(oe.has(t))return oe.get(t);const e=ya(t);return e!==t&&(oe.set(t,e),$e.set(e,t)),e}const ie=t=>$e.get(t);function wa(t,e,{blocked:a,upgrade:s,blocking:r,terminated:o}={}){const n=indexedDB.open(t,e),i=L(n);return s&&n.addEventListener("upgradeneeded",l=>{s(L(n.result),l.oldVersion,l.newVersion,L(n.transaction),l)}),a&&n.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),i.then(l=>{o&&l.addEventListener("close",()=>o()),r&&l.addEventListener("versionchange",c=>r(c.oldVersion,c.newVersion,c))}).catch(()=>{}),i}const Ea=["get","getKey","getAll","getAllKeys","count"],_a=["put","add","delete","clear"],le=new Map;function je(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(le.get(e))return le.get(e);const a=e.replace(/FromIndex$/,""),s=e!==a,r=_a.includes(a);if(!(a in(s?IDBIndex:IDBObjectStore).prototype)||!(r||Ea.includes(a)))return;const o=async function(n,...i){const l=this.transaction(n,r?"readwrite":"readonly");let c=l.store;return s&&(c=c.index(i.shift())),(await Promise.all([c[a](...i),r&&l.done]))[0]};return le.set(e,o),o}xa(t=>({...t,get:(e,a,s)=>je(e,a)||t.get(e,a,s),has:(e,a)=>!!je(e,a)||t.has(e,a)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ca{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(a=>{if($a(a)){const s=a.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(a=>a).join(" ")}}function $a(t){return t.getComponent()?.type==="VERSION"}const be="@firebase/app",Oe="0.14.4";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const q=new pa("@firebase/app"),Ma="@firebase/app-compat",Ia="@firebase/analytics-compat",ka="@firebase/analytics",Ta="@firebase/app-check-compat",qa="@firebase/app-check",Sa="@firebase/auth",La="@firebase/auth-compat",Ba="@firebase/database",Da="@firebase/data-connect",Aa="@firebase/database-compat",Pa="@firebase/functions",Na="@firebase/functions-compat",ja="@firebase/installations",Oa="@firebase/installations-compat",Ra="@firebase/messaging",Fa="@firebase/messaging-compat",Ha="@firebase/performance",Ua="@firebase/performance-compat",Va="@firebase/remote-config",za="@firebase/remote-config-compat",Ga="@firebase/storage",Qa="@firebase/storage-compat",Wa="@firebase/firestore",Ja="@firebase/ai",Ka="@firebase/firestore-compat",Ya="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge="[DEFAULT]",Za={[be]:"fire-core",[Ma]:"fire-core-compat",[ka]:"fire-analytics",[Ia]:"fire-analytics-compat",[qa]:"fire-app-check",[Ta]:"fire-app-check-compat",[Sa]:"fire-auth",[La]:"fire-auth-compat",[Ba]:"fire-rtdb",[Da]:"fire-data-connect",[Aa]:"fire-rtdb-compat",[Pa]:"fire-fn",[Na]:"fire-fn-compat",[ja]:"fire-iid",[Oa]:"fire-iid-compat",[Ra]:"fire-fcm",[Fa]:"fire-fcm-compat",[Ha]:"fire-perf",[Ua]:"fire-perf-compat",[Va]:"fire-rc",[za]:"fire-rc-compat",[Ga]:"fire-gcs",[Qa]:"fire-gcs-compat",[Wa]:"fire-fst",[Ka]:"fire-fst-compat",[Ja]:"fire-vertex","fire-js":"fire-js",[Ya]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W=new Map,Xa=new Map,fe=new Map;function Re(t,e){try{t.container.addComponent(e)}catch(a){q.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,a)}}function J(t){const e=t.name;if(fe.has(e))return q.debug(`There were multiple attempts to register component ${e}.`),!1;fe.set(e,t);for(const a of W.values())Re(a,t);for(const a of Xa.values())Re(a,t);return!0}function es(t,e){const a=t.container.getProvider("heartbeat").getImmediate({optional:!0});return a&&a.triggerHeartbeat(),t.container.getProvider(e)}function ts(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const as={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},B=new nt("app","Firebase",as);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,a,s){this._isDeleted=!1,this._options={...e},this._config={...a},this._name=a.name,this._automaticDataCollectionEnabled=a.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new V("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw B.create("app-deleted",{appName:this._name})}}function rs(t,e={}){let a=t;typeof e!="object"&&(e={name:e});const s={name:ge,automaticDataCollectionEnabled:!0,...e},r=s.name;if(typeof r!="string"||!r)throw B.create("bad-app-name",{appName:String(r)});if(a||(a=rt()),!a)throw B.create("no-options");const o=W.get(r);if(o){if(ue(a,o.options)&&ue(s,o.config))return o;throw B.create("duplicate-app",{appName:r})}const n=new ia(r);for(const l of fe.values())n.addComponent(l);const i=new ss(a,s,n);return W.set(r,i),i}function ns(t=ge){const e=W.get(t);if(!e&&t===ge&&rt())return rs();if(!e)throw B.create("no-app",{appName:t});return e}function F(t,e,a){let s=Za[t]??t;a&&(s+=`-${a}`);const r=s.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const n=[`Unable to register library "${s}" with version "${e}":`];r&&n.push(`library name "${s}" contains illegal characters (whitespace or "/")`),r&&o&&n.push("and"),o&&n.push(`version name "${e}" contains illegal characters (whitespace or "/")`),q.warn(n.join(" "));return}J(new V(`${s}-version`,()=>({library:s,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const os="firebase-heartbeat-database",is=1,z="firebase-heartbeat-store";let ce=null;function lt(){return ce||(ce=wa(os,is,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(z)}catch(a){console.warn(a)}}}}).catch(t=>{throw B.create("idb-open",{originalErrorMessage:t.message})})),ce}async function ls(t){try{const a=(await lt()).transaction(z),s=await a.objectStore(z).get(ct(t));return await a.done,s}catch(e){if(e instanceof j)q.warn(e.message);else{const a=B.create("idb-get",{originalErrorMessage:e?.message});q.warn(a.message)}}}async function Fe(t,e){try{const s=(await lt()).transaction(z,"readwrite");await s.objectStore(z).put(e,ct(t)),await s.done}catch(a){if(a instanceof j)q.warn(a.message);else{const s=B.create("idb-set",{originalErrorMessage:a?.message});q.warn(s.message)}}}function ct(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cs=1024,ds=30;class us{constructor(e){this.container=e,this._heartbeatsCache=null;const a=this.container.getProvider("app").getImmediate();this._storage=new ms(a),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){try{const a=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=He();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(r=>r.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:a}),this._heartbeatsCache.heartbeats.length>ds){const r=bs(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(r,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){q.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=He(),{heartbeatsToSend:a,unsentEntries:s}=ps(this._heartbeatsCache.heartbeats),r=at(JSON.stringify({version:2,heartbeats:a}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(e){return q.warn(e),""}}}function He(){return new Date().toISOString().substring(0,10)}function ps(t,e=cs){const a=[];let s=t.slice();for(const r of t){const o=a.find(n=>n.agent===r.agent);if(o){if(o.dates.push(r.date),Ue(a)>e){o.dates.pop();break}}else if(a.push({agent:r.agent,dates:[r.date]}),Ue(a)>e){a.pop();break}s=s.slice(1)}return{heartbeatsToSend:a,unsentEntries:s}}class ms{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Xt()?ea().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const a=await ls(this.app);return a?.heartbeats?a:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Fe(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const s=await this.read();return Fe(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??s.lastSentHeartbeatDate,heartbeats:[...s.heartbeats,...e.heartbeats]})}else return}}function Ue(t){return at(JSON.stringify({version:2,heartbeats:t})).length}function bs(t){if(t.length===0)return-1;let e=0,a=t[0].date;for(let s=1;s<t.length;s++)t[s].date<a&&(a=t[s].date,e=s);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gs(t){J(new V("platform-logger",e=>new Ca(e),"PRIVATE")),J(new V("heartbeat",e=>new us(e),"PRIVATE")),F(be,Oe,t),F(be,Oe,"esm2020"),F("fire-js","")}gs("");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fs="type.googleapis.com/google.protobuf.Int64Value",vs="type.googleapis.com/google.protobuf.UInt64Value";function dt(t,e){const a={};for(const s in t)t.hasOwnProperty(s)&&(a[s]=e(t[s]));return a}function K(t){if(t==null)return null;if(t instanceof Number&&(t=t.valueOf()),typeof t=="number"&&isFinite(t)||t===!0||t===!1||Object.prototype.toString.call(t)==="[object String]")return t;if(t instanceof Date)return t.toISOString();if(Array.isArray(t))return t.map(e=>K(e));if(typeof t=="function"||typeof t=="object")return dt(t,e=>K(e));throw new Error("Data cannot be encoded in JSON: "+t)}function N(t){if(t==null)return t;if(t["@type"])switch(t["@type"]){case fs:case vs:{const e=Number(t.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+t);return e}default:throw new Error("Data cannot be decoded from JSON: "+t)}return Array.isArray(t)?t.map(e=>N(e)):typeof t=="function"||typeof t=="object"?dt(t,e=>N(e)):t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ve={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class I extends j{constructor(e,a,s){super(`${Me}/${e}`,a||""),this.details=s,Object.setPrototypeOf(this,I.prototype)}}function xs(t){if(t>=200&&t<300)return"ok";switch(t){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function Y(t,e){let a=xs(t),s=a,r;try{const o=e&&e.error;if(o){const n=o.status;if(typeof n=="string"){if(!Ve[n])return new I("internal","internal");a=Ve[n],s=n}const i=o.message;typeof i=="string"&&(s=i),r=o.details,r!==void 0&&(r=N(r))}}catch{}return a==="ok"?null:new I(a,s,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,a,s,r){this.app=e,this.auth=null,this.messaging=null,this.appCheck=null,this.serverAppAppCheckToken=null,ts(e)&&e.settings.appCheckToken&&(this.serverAppAppCheckToken=e.settings.appCheckToken),this.auth=a.getImmediate({optional:!0}),this.messaging=s.getImmediate({optional:!0}),this.auth||a.get().then(o=>this.auth=o,()=>{}),this.messaging||s.get().then(o=>this.messaging=o,()=>{}),this.appCheck||r?.get().then(o=>this.appCheck=o,()=>{})}async getAuthToken(){if(this.auth)try{return(await this.auth.getToken())?.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.serverAppAppCheckToken)return this.serverAppAppCheckToken;if(this.appCheck){const a=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return a.error?null:a.token}return null}async getContext(e){const a=await this.getAuthToken(),s=await this.getMessagingToken(),r=await this.getAppCheckToken(e);return{authToken:a,messagingToken:s,appCheckToken:r}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ve="us-central1",ys=/^data: (.*?)(?:\n|$)/;function ws(t){let e=null;return{promise:new Promise((a,s)=>{e=setTimeout(()=>{s(new I("deadline-exceeded","deadline-exceeded"))},t)}),cancel:()=>{e&&clearTimeout(e)}}}class Es{constructor(e,a,s,r,o=ve,n=(...i)=>fetch(...i)){this.app=e,this.fetchImpl=n,this.emulatorOrigin=null,this.contextProvider=new hs(e,a,s,r),this.cancelAllRequests=new Promise(i=>{this.deleteService=()=>Promise.resolve(i())});try{const i=new URL(o);this.customDomain=i.origin+(i.pathname==="/"?"":i.pathname),this.region=ve}catch{this.customDomain=null,this.region=o}}_delete(){return this.deleteService()}_url(e){const a=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${a}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${a}.cloudfunctions.net/${e}`}}function _s(t,e,a){const s=_e(e);t.emulatorOrigin=`http${s?"s":""}://${e}:${a}`,s&&(Jt(t.emulatorOrigin+"/backends"),Zt("Functions",!0))}function Cs(t,e,a){const s=r=>Ms(t,e,r,{});return s.stream=(r,o)=>ks(t,e,r,o),s}function ut(t){return t.emulatorOrigin&&_e(t.emulatorOrigin)?"include":void 0}async function $s(t,e,a,s,r){a["Content-Type"]="application/json";let o;try{o=await s(t,{method:"POST",body:JSON.stringify(e),headers:a,credentials:ut(r)})}catch{return{status:0,json:null}}let n=null;try{n=await o.json()}catch{}return{status:o.status,json:n}}async function pt(t,e){const a={},s=await t.contextProvider.getContext(e.limitedUseAppCheckTokens);return s.authToken&&(a.Authorization="Bearer "+s.authToken),s.messagingToken&&(a["Firebase-Instance-ID-Token"]=s.messagingToken),s.appCheckToken!==null&&(a["X-Firebase-AppCheck"]=s.appCheckToken),a}function Ms(t,e,a,s){const r=t._url(e);return Is(t,r,a,s)}async function Is(t,e,a,s){a=K(a);const r={data:a},o=await pt(t,s),n=s.timeout||7e4,i=ws(n),l=await Promise.race([$s(e,r,o,t.fetchImpl,t),i.promise,t.cancelAllRequests]);if(i.cancel(),!l)throw new I("cancelled","Firebase Functions instance was deleted.");const c=Y(l.status,l.json);if(c)throw c;if(!l.json)throw new I("internal","Response is not valid JSON object.");let u=l.json.data;if(typeof u>"u"&&(u=l.json.result),typeof u>"u")throw new I("internal","Response is missing data field.");return{data:N(u)}}function ks(t,e,a,s){const r=t._url(e);return Ts(t,r,a,s||{})}async function Ts(t,e,a,s){a=K(a);const r={data:a},o=await pt(t,s);o["Content-Type"]="application/json",o.Accept="text/event-stream";let n;try{n=await t.fetchImpl(e,{method:"POST",body:JSON.stringify(r),headers:o,signal:s?.signal,credentials:ut(t)})}catch(d){if(d instanceof Error&&d.name==="AbortError"){const b=new I("cancelled","Request was cancelled.");return{data:Promise.reject(b),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(b)}}}}}}const p=Y(0,null);return{data:Promise.reject(p),stream:{[Symbol.asyncIterator](){return{next(){return Promise.reject(p)}}}}}}let i,l;const c=new Promise((d,p)=>{i=d,l=p});s?.signal?.addEventListener("abort",()=>{const d=new I("cancelled","Request was cancelled.");l(d)});const u=n.body.getReader(),m=qs(u,i,l,s?.signal);return{stream:{[Symbol.asyncIterator](){const d=m.getReader();return{async next(){const{value:p,done:b}=await d.read();return{value:p,done:b}},async return(){return await d.cancel(),{done:!0,value:void 0}}}}},data:c}}function qs(t,e,a,s){const r=(n,i)=>{const l=n.match(ys);if(!l)return;const c=l[1];try{const u=JSON.parse(c);if("result"in u){e(N(u.result));return}if("message"in u){i.enqueue(N(u.message));return}if("error"in u){const m=Y(0,u);i.error(m),a(m);return}}catch(u){if(u instanceof I){i.error(u),a(u);return}}},o=new TextDecoder;return new ReadableStream({start(n){let i="";return l();async function l(){if(s?.aborted){const c=new I("cancelled","Request was cancelled");return n.error(c),a(c),Promise.resolve()}try{const{value:c,done:u}=await t.read();if(u){i.trim()&&r(i.trim(),n),n.close();return}if(s?.aborted){const d=new I("cancelled","Request was cancelled");n.error(d),a(d),await t.cancel();return}i+=o.decode(c,{stream:!0});const m=i.split(`
`);i=m.pop()||"";for(const d of m)d.trim()&&r(d.trim(),n);return l()}catch(c){const u=c instanceof I?c:Y(0,null);n.error(u),a(u)}}},cancel(){return t.cancel()}})}const ze="@firebase/functions",Ge="0.13.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ss="auth-internal",Ls="app-check-internal",Bs="messaging-internal";function Ds(t){const e=(a,{instanceIdentifier:s})=>{const r=a.getProvider("app").getImmediate(),o=a.getProvider(Ss),n=a.getProvider(Bs),i=a.getProvider(Ls);return new Es(r,o,n,i,s)};J(new V(Me,e,"PUBLIC").setMultipleInstances(!0)),F(ze,Ge,t),F(ze,Ge,"esm2020")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function As(t=ns(),e=ve){const s=es(Ce(t),Me).getImmediate({identifier:e}),r=Qt("functions");return r&&Ps(s,...r),s}function Ps(t,e,a){_s(Ce(t),e,a)}function Ns(t,e,a){return Cs(Ce(t),e)}Ds();class Ie{constructor(){this.collections={offers:"marketplace_offers",transactions:"marketplace_transactions",embargoes:"marketplace_embargoes",orders:"marketplace_orders"}}getOfferSchema(){return{id:"string",type:"string",category:"string",title:"string",description:"string",item_id:"string",item_name:"string",quantity:"number",unit:"string",price_per_unit:"number",total_value:"number",country_id:"string",country_name:"string",country_flag:"string",player_id:"string",status:"string",created_at:"timestamp",updated_at:"timestamp",expires_at:"timestamp",min_quantity:"number",max_quantity:"number",delivery_time_days:"number",views:"number",interested_countries:"array",tech_level_required:"number",diplomatic_status_required:"string"}}getTransactionSchema(){return{id:"string",offer_id:"string",seller_country_id:"string",seller_country_name:"string",seller_player_id:"string",buyer_country_id:"string",buyer_country_name:"string",buyer_player_id:"string",item_id:"string",item_name:"string",quantity:"number",unit:"string",price_per_unit:"number",total_value:"number",status:"string",created_at:"timestamp",confirmed_at:"timestamp",completed_at:"timestamp",delivery_deadline:"timestamp",status_history:"array",delivery_time_days:"number",delivery_status:"string",negotiated_price:"boolean",original_price_per_unit:"number",discount_percent:"number"}}getEmbargoSchema(){return{id:"string",embargo_country_id:"string",embargo_country_name:"string",target_country_id:"string",target_country_name:"string",type:"string",categories_blocked:"array",reason:"string",created_at:"timestamp",expires_at:"timestamp",status:"string",created_by_player_id:"string",notifications_sent:"boolean"}}getOrderSchema(){return{id:"string",country_id:"string",country_name:"string",player_id:"string",type:"string",item_id:"string",item_name:"string",category:"string",quantity:"number",unit:"string",max_price_per_unit:"number",min_price_per_unit:"number",is_recurring:"boolean",recurrence_type:"string",recurrence_interval:"number",max_executions:"number",executions_count:"number",status:"string",created_at:"timestamp",last_execution:"timestamp",next_execution:"timestamp",auto_execute:"boolean",require_confirmation:"boolean",execution_history:"array"}}async createOffer(e){try{const a=h.currentUser;if(!a)throw new Error("Usuário não autenticado");const s=await w(a.uid);if(!s)throw new Error("Jogador não associado a um país");const r=await this.validateOfferData(e,s,a.uid),o={...r,country_id:s,player_id:a.uid,created_at:new Date,updated_at:new Date,expires_at:new Date(Date.now()+r.duration_days*24*60*60*1e3),status:"active",views:0,interested_countries:[]},n=await g.collection(this.collections.offers).add(o);return{success:!0,offerId:n.id,offer:{id:n.id,...o}}}catch(a){return console.error("Erro ao criar oferta:",a),{success:!1,error:a.message}}}async validateOfferData(e,a,s){if(!e.type||!["sell","buy"].includes(e.type))throw new Error("Tipo de oferta inválido");if(!e.category||!["resources","vehicles","naval","aircraft"].includes(e.category))throw new Error("Categoria inválida");if(!e.title||e.title.trim().length<3)throw new Error("Título deve ter pelo menos 3 caracteres");if(!e.quantity||e.quantity<=0)throw new Error("Quantidade deve ser maior que zero");if(!e.price_per_unit||e.price_per_unit<=0)throw new Error("Preço deve ser maior que zero");const r=await g.collection("paises").doc(a).get();if(!r.exists)throw new Error("País não encontrado");const o=r.data();e.type==="sell"?(await this.validateSellOfferAvailability(e,a),await this.validateSellOffer(e,o)):await this.validateBuyOffer(e,o);const n=e.quantity*e.price_per_unit;return{type:e.type,category:e.category,title:e.title.trim(),description:(e.description||"").trim(),item_id:e.item_id,item_name:e.item_name,quantity:e.quantity,unit:e.unit,price_per_unit:e.price_per_unit,total_value:n,country_name:o.Pais,country_flag:o.Flag||"🏳️",delivery_time_days:e.delivery_time_days||30,min_quantity:e.min_quantity||1,max_quantity:e.max_quantity||e.quantity,tech_level_required:e.tech_level_required||0,duration_days:e.duration_days||30}}async validateSellOffer(e,a){if(e.category!=="resources"){if(e.category==="vehicles"||e.category==="naval"||e.category==="aircraft"){const s=await g.collection("inventory").doc(a.id||e.country_id).get();s.exists&&s.data()}}}async validateBuyOffer(e,a){const s=this.calculateCountryBudget(a),r=e.quantity*e.price_per_unit;if(s<r)throw new Error(`Orçamento insuficiente. Necessário: $${r.toLocaleString()}, Disponível: $${s.toLocaleString()}`)}calculateCountryBudget(e){const a=parseFloat(e.PIB)||0,s=(parseFloat(e.Burocracia)||0)/100,r=(parseFloat(e.Estabilidade)||0)/100;return a*.25*s*(r*1.5)}async getOffers(e={}){try{console.info("🔍 Buscando ofertas usando a Cloud Function 'getMarketplaceOffers' (v9)...");const a=As(St),r=await Ns(a,"getMarketplaceOffers")({filters:e});if(r.data&&r.data.success)return console.info(`✅ ${r.data.offers.length} ofertas recebidas do servidor.`),{success:!0,offers:r.data.offers,hasMore:r.data.hasMore,total:r.data.offers.length};throw new Error(r.data.error||"A Cloud Function retornou um erro inesperado.")}catch(a){console.error("Erro ao chamar a Cloud Function 'getMarketplaceOffers':",a);let s=a.message;return a.code==="functions/unauthenticated"?s="Erro de autenticação. Por favor, faça login novamente.":a.code==="functions/internal"&&(s="Ocorreu um erro interno no servidor. Tente novamente mais tarde."),{success:!1,error:s,offers:[]}}}async filterEmbargoedOffers(e,a){if(!a)return e;try{const s=await g.collection(this.collections.embargoes).where("status","==","active").where("target_country_id","==",a).get(),r=[];return s.forEach(o=>{r.push(o.data())}),r.length===0?e:e.filter(o=>{const n=r.find(i=>i.embargo_country_id===o.country_id);return n?n.type==="full"?!1:n.type==="partial"&&n.categories_blocked?!n.categories_blocked.includes(o.category):!0:!0})}catch(s){return console.error("Erro ao verificar embargos:",s),e}}async incrementOfferViews(e){try{const a=g.collection(this.collections.offers).doc(e),s=await a.get();if(s.exists){const r=s.data().views||0;await a.update({views:r+1,updated_at:new Date})}}catch(a){console.error("Erro ao incrementar visualizações:",a)}}async createTransaction(e,a){try{const s=h.currentUser;if(!s)throw new Error("Usuário não autenticado");const r=await w(s.uid);if(!r)throw new Error("Jogador não associado a um país");const o=await g.collection(this.collections.offers).doc(e).get();if(!o.exists)throw new Error("Oferta não encontrada");const n=o.data();if(n.status!=="active")throw new Error("Oferta não está ativa");const i=a.quantity||n.quantity;if(i>n.quantity)throw new Error("Quantidade solicitada excede disponível");if(i<n.min_quantity)throw new Error(`Quantidade mínima: ${n.min_quantity}`);if(i>n.max_quantity)throw new Error(`Quantidade máxima: ${n.max_quantity}`);const c=(await g.collection("paises").doc(r).get()).data(),u=i*n.price_per_unit;if(this.calculateCountryBudget(c)<u)throw new Error("Orçamento insuficiente");const d={offer_id:e,seller_country_id:n.country_id,seller_country_name:n.country_name,seller_player_id:n.player_id,buyer_country_id:r,buyer_country_name:c.Pais,buyer_player_id:s.uid,item_id:n.item_id,item_name:n.item_name,quantity:i,unit:n.unit,price_per_unit:n.price_per_unit,total_value:u,status:"pending",created_at:new Date,delivery_deadline:new Date(Date.now()+n.delivery_time_days*24*60*60*1e3),delivery_time_days:n.delivery_time_days,delivery_status:"pending",status_history:[{status:"pending",timestamp:new Date,note:"Transação criada"}],negotiated_price:!1,original_price_per_unit:n.price_per_unit,discount_percent:0},p=await g.collection(this.collections.transactions).add(d);return await g.collection(this.collections.offers).doc(e).update({quantity:n.quantity-i,updated_at:new Date,status:n.quantity-i===0?"completed":"active"}),await this.transferResources(n,i,n.country_id,r),await p.update({status:"completed",delivery_status:"delivered",completed_at:new Date}),{success:!0,transactionId:p.id,transaction:{id:p.id,...d,status:"completed"}}}catch(s){return console.error("Erro ao criar transação:",s),{success:!1,error:s.message}}}async transferResources(e,a,s,r){try{if(console.log(`🔄 Transferindo: ${a} ${e.unit} de ${e.item_name}`),console.log(`   Vendedor: ${s}`),console.log(`   Comprador: ${r}`),console.log(`   Categoria: ${e.category}`),e.category==="vehicles"||e.category==="naval"||e.category==="aircraft"){await this.transferEquipment(e,a,s,r);return}const o=qe(e.item_id);if(!o){console.warn(`⚠️ Item ${e.item_id} não encontrado no RESOURCE_MAPPING`);return}const i={carvao:"Carvao",combustivel:"Combustivel",metais:"Metais",graos:"Graos"}[o.gameResourceId];if(!i){console.warn(`⚠️ Recurso ${o.gameResourceId} não é transferível`);return}const l=await g.collection("paises").doc(s).get(),c=await g.collection("paises").doc(r).get();if(!l.exists||!c.exists)throw new Error("País não encontrado");const u=l.data(),m=c.data(),d=parseFloat(u[i])||0,p=parseFloat(m[i])||0,b=Math.max(0,d-a),f=p+a;console.log(`   ${i} vendedor: ${d} → ${b}`),console.log(`   ${i} comprador: ${p} → ${f}`),await g.collection("paises").doc(s).update({[i]:b}),await g.collection("paises").doc(r).update({[i]:f}),console.log("✅ Recursos transferidos com sucesso!")}catch(o){throw console.error("❌ Erro ao transferir recursos:",o),o}}async transferEquipment(e,a,s,r){try{console.log(`🚁 Transferindo equipamento: ${e.item_id}`);const o=e.item_id,n=o.split("/"),i=n.length===2,l=i?n[0]:o,c=i?n[1]:null;console.log(`   Estrutura: ${i?"aninhada":"plana"}`),i&&console.log(`   Categoria: ${l}, Item: ${c}`);const u=g.collection("inventory").doc(s),m=g.collection("inventory").doc(r),d=await u.get(),p=await m.get(),b=d.exists?d.data():{},f=p.exists?p.data():{};let v;if(i?v=b[l]?.[c]:v=b[o],!v||v.quantity<a)throw new Error(`Estoque insuficiente do vendedor para ${o}`);console.log(`   Vendedor tem: ${v.quantity} ${o}`),console.log(`   Transferindo: ${a} unidades`);const y=v.quantity-a;i?y<=0?(await u.update({[`${l}.${c}`]:g.FieldValue.delete()}),console.log(`   ✅ Item ${l}/${c} removido do inventário do vendedor`)):(await u.update({[`${l}.${c}.quantity`]:y}),console.log(`   ✅ Vendedor agora tem: ${y} ${l}/${c}`)):y<=0?(await u.update({[o]:g.FieldValue.delete()}),console.log(`   ✅ Item ${o} removido do inventário do vendedor`)):(await u.update({[`${o}.quantity`]:y}),console.log(`   ✅ Vendedor agora tem: ${y} ${o}`));let x;if(i?x=f[l]?.[c]:x=f[o],x){const C=x.quantity+a;i?await m.update({[`${l}.${c}.quantity`]:C}):await m.update({[`${o}.quantity`]:C}),console.log(`   ✅ Comprador agora tem: ${C} ${o}`)}else i?await m.set({[l]:{[c]:{...v,quantity:a}}},{merge:!0}):await m.set({[o]:{...v,quantity:a}},{merge:!0}),console.log(`   ✅ Comprador recebeu: ${a} ${o} (novo item)`);console.log("✅ Equipamento transferido com sucesso!")}catch(o){throw console.error("❌ Erro ao transferir equipamento:",o),o}}async applyEmbargo(e){try{const a=h.currentUser;if(!a)throw new Error("Usuário não autenticado");const s=await w(a.uid);if(!s)throw new Error("Jogador não associado a um país");const o=(await g.collection("paises").doc(s).get()).data(),n=await g.collection("paises").doc(e.target_country_id).get();if(!n.exists)throw new Error("País alvo não encontrado");const i=n.data();if(!(await g.collection(this.collections.embargoes).where("embargo_country_id","==",s).where("target_country_id","==",e.target_country_id).where("status","==","active").get()).empty)throw new Error("Já existe um embargo ativo contra este país");const c={embargo_country_id:s,embargo_country_name:o.Pais,target_country_id:e.target_country_id,target_country_name:i.Pais,type:e.type||"full",categories_blocked:e.categories_blocked||[],reason:e.reason||"Motivos diplomáticos",created_at:new Date,expires_at:e.expires_at||null,status:"active",created_by_player_id:a.uid,notifications_sent:!1},u=await g.collection(this.collections.embargoes).add(c);return await this.sendEmbargoNotification(c,u.id),{success:!0,embargoId:u.id,embargo:{id:u.id,...c}}}catch(a){return console.error("Erro ao aplicar embargo:",a),{success:!1,error:a.message}}}async sendEmbargoNotification(e,a){try{const s={type:"embargo_applied",embargo_id:a,target_country_id:e.target_country_id,target_country_name:e.target_country_name,embargo_country_id:e.embargo_country_id,embargo_country_name:e.embargo_country_name,embargo_type:e.type,categories_blocked:e.categories_blocked||[],reason:e.reason,created_at:new Date,read:!1,expires_at:e.expires_at,title:`🚫 Embargo Aplicado por ${e.embargo_country_name}`,message:this.getEmbargoNotificationMessage(e),priority:"high"};await g.collection("notifications").add(s),await g.collection(this.collections.embargoes).doc(a).update({notifications_sent:!0}),console.log(`Notificação de embargo enviada para ${e.target_country_name}`)}catch(s){console.error("Erro ao enviar notificação de embargo:",s)}}getEmbargoNotificationMessage(e){const a=e.type==="full"?"total":"parcial";let s=`${e.embargo_country_name} aplicou um embargo ${a} contra seu país.`;if(e.type==="partial"&&e.categories_blocked&&e.categories_blocked.length>0){const r={resources:"Recursos",vehicles:"Veículos",naval:"Naval"},o=e.categories_blocked.map(n=>r[n]||n);s+=` Categorias bloqueadas: ${o.join(", ")}.`}else e.type==="full"&&(s+=" Todas as trocas comerciais estão bloqueadas.");if(e.reason&&e.reason!=="Motivos diplomáticos"&&(s+=` Motivo: ${e.reason}`),e.expires_at){const r=new Date(e.expires_at),o=Math.ceil((r-new Date)/(1440*60*1e3));s+=` O embargo expira em ${o} dias.`}else s+=" O embargo é por tempo indefinido.";return s}async getEmbargoNotifications(e,a=10){try{const s=await g.collection("notifications").where("target_country_id","==",e).where("type","==","embargo_applied").orderBy("created_at","desc").limit(a).get(),r=[];return s.forEach(o=>{r.push({id:o.id,...o.data()})}),{success:!0,notifications:r}}catch(s){return console.error("Erro ao buscar notificações:",s),{success:!1,error:s.message,notifications:[]}}}async markNotificationAsRead(e){try{return await g.collection("notifications").doc(e).update({read:!0,read_at:new Date}),{success:!0}}catch(a){return console.error("Erro ao marcar notificação como lida:",a),{success:!1,error:a.message}}}async getCountryInventory(e){try{const a=await g.collection("inventory").doc(e).get();return a.exists?a.data():{}}catch(a){return console.error("Erro ao buscar inventário:",a),{}}}async getCountryData(e){try{const a=await g.collection("paises").doc(e).get();return a.exists?{id:e,...a.data()}:null}catch(a){return console.error("Erro ao buscar dados do país:",a),null}}calculateAvailableResources(e){console.log("🔍 Debug: Dados do país recebidos:",e),console.log("📊 Usando recursos REAIS do dashboard (não calculados)"),console.log("🔍 Recursos reais no país:"),console.log("  - Carvao:",e.Carvao),console.log("  - Combustivel:",e.Combustivel),console.log("  - Metais:",e.Metais),console.log("  - Graos:",e.Graos);const a={Carvao:Math.max(0,Math.floor(parseFloat(e.Carvao)||0)),Combustivel:Math.max(0,Math.floor(parseFloat(e.Combustivel)||0)),Metais:Math.max(0,Math.floor(parseFloat(e.Metais)||0)),Graos:Math.max(0,Math.floor(parseFloat(e.Graos)||0))};return console.log("📦 Recursos REAIS disponíveis para venda (50% do estoque):",a),a}getAvailableEquipment(e){const a=[];return Object.keys(e).forEach(s=>{const r=e[s];!r||typeof r!="object"||(r.quantity!==void 0&&r.quantity>0?a.push({id:s,name:r.name||s,category:r.category||"vehicles",available_quantity:r.quantity,total_quantity:r.quantity,unit_cost:r.cost||0,maintenance_cost:(r.cost||0)*.05||0,type:r.category||"vehicles"}):Object.keys(r).forEach(o=>{const n=r[o];if(n&&typeof n=="object"&&n.quantity>0){const i=`${s}/${o}`;a.push({id:i,name:o,category:n.category||"vehicles",available_quantity:n.quantity,total_quantity:n.quantity,unit_cost:n.cost||0,maintenance_cost:(n.cost||0)*.05||0,type:n.category||"vehicles"})}}))}),a}getEquipmentType(e){return["Couraçados","Cruzadores","Destróieres","Fragatas","Corvetas","Submarinos","Porta-aviões","Patrulhas","Auxiliares","Naval - Outros"].includes(e)?"naval":"vehicles"}async validateSellOfferAvailability(e,a){const s=await this.getCountryData(a);if(!s)throw new Error("Dados do país não encontrados");return e.category==="resources"?this.validateResourceAvailability(e,s):this.validateEquipmentAvailability(e,a)}validateResourceAvailability(e,a){console.log("🔍 Validando disponibilidade de recurso:",e.item_id);const s=qe(e.item_id);if(!s)throw console.error("❌ Tipo de recurso não reconhecido:",e.item_id),new Error(`Tipo de recurso não reconhecido: ${e.item_id}`);console.log("✅ Configuração de mercado encontrada:",s);const r=Se(e.item_id);if(!r)throw new Error(`Não foi possível mapear ${e.item_id} para recurso do jogo`);if(console.log("📊 Recurso do jogo mapeado:",r),!window.ResourceProductionCalculator||!window.ResourceConsumptionCalculator)throw console.error("❌ Calculadores de recursos não encontrados"),new Error("Sistema de cálculo de recursos não está disponível");const o=window.ResourceProductionCalculator.calculateCountryProduction(a),n=window.ResourceConsumptionCalculator.calculateCountryConsumption(a),i=o[r]||0,l=n[r]||0,c=Math.max(0,Math.round(i-l));if(console.log(`📈 Produção de ${r}:`,i),console.log(`📉 Consumo de ${r}:`,l),console.log("💰 Disponível para venda:",c),e.quantity>c)throw new Error(`Quantidade insuficiente. Disponível: ${c.toLocaleString()} ${s.defaultUnit} de ${s.displayName}`);return console.log("✅ Validação de recurso passou!"),{valid:!0,available:c,resourceType:r,marketType:e.item_id,unit:s.defaultUnit}}async validateEquipmentAvailability(e,a){const s=await this.getCountryInventory(a),o=this.getAvailableEquipment(s).find(n=>n.id===e.item_id);if(!o)throw new Error(`Equipamento "${e.item_name}" não encontrado no inventário ou indisponível para venda`);if(e.quantity>o.available_quantity)throw new Error(`Quantidade insuficiente. Disponível para venda: ${o.available_quantity} de ${o.total_quantity} unidades totais`);return{valid:!0,equipment:o,availableQuantity:o.available_quantity,totalQuantity:o.total_quantity}}async createTestOffers(){try{console.log("🧪 Criando ofertas de teste...");const e=[{type:"sell",category:"resources",title:"Aço de Alta Qualidade",description:"Aço especializado para construção naval e industrial",item_id:"steel_high_grade",item_name:"Aço de Alta Qualidade",quantity:5e3,unit:"toneladas",price_per_unit:850,total_value:5e3*850,country_id:"test_country_1",country_name:"Estados Unidos",country_flag:"🇺🇸",player_id:"test_player_1",status:"active",created_at:new Date,updated_at:new Date,expires_at:new Date(Date.now()+10080*60*1e3),delivery_time_days:30,min_quantity:100,max_quantity:5e3,views:23,interested_countries:[]},{type:"buy",category:"vehicles",title:"Tanques MBT Modernos",description:"Procurando tanques de batalha principais para modernização das forças armadas",item_id:"mbt_modern",item_name:"Tanque MBT Moderno",quantity:50,unit:"unidades",price_per_unit:25e5,total_value:50*25e5,country_id:"test_country_2",country_name:"Brasil",country_flag:"🇧🇷",player_id:"test_player_2",status:"active",created_at:new Date(Date.now()-1440*60*1e3),updated_at:new Date(Date.now()-1440*60*1e3),expires_at:new Date(Date.now()+336*60*60*1e3),delivery_time_days:45,min_quantity:5,max_quantity:50,views:45,interested_countries:[]},{type:"sell",category:"naval",title:"Destroyers Classe Fletcher",description:"Destroyers modernizados, prontos para serviço imediato",item_id:"destroyer_fletcher",item_name:"Destroyer Classe Fletcher",quantity:3,unit:"navios",price_per_unit:18e7,total_value:3*18e7,country_id:"test_country_3",country_name:"Reino Unido",country_flag:"🇬🇧",player_id:"test_player_3",status:"active",created_at:new Date(Date.now()-4320*60*1e3),updated_at:new Date(Date.now()-4320*60*1e3),expires_at:new Date(Date.now()+504*60*60*1e3),delivery_time_days:60,min_quantity:1,max_quantity:3,views:67,interested_countries:[]},{type:"sell",category:"resources",title:"Petróleo Refinado",description:"Combustível de alta octanagem para aviação militar",item_id:"oil_aviation",item_name:"Petróleo de Aviação",quantity:1e4,unit:"barris",price_per_unit:120,total_value:1e4*120,country_id:"test_country_4",country_name:"Arábia Saudita",country_flag:"🇸🇦",player_id:"test_player_4",status:"active",created_at:new Date(Date.now()-2880*60*1e3),updated_at:new Date(Date.now()-2880*60*1e3),expires_at:new Date(Date.now()+14400*60*1e3),delivery_time_days:15,min_quantity:500,max_quantity:1e4,views:89,interested_countries:[]},{type:"buy",category:"naval",title:"Submarinos Diesel-Elétricos",description:"Necessitamos de submarinos para patrulha costeira",item_id:"submarine_diesel",item_name:"Submarino Diesel-Elétrico",quantity:2,unit:"submarinos",price_per_unit:45e6,total_value:2*45e6,country_id:"test_country_5",country_name:"Argentina",country_flag:"🇦🇷",player_id:"test_player_5",status:"active",created_at:new Date(Date.now()-5760*60*1e3),updated_at:new Date(Date.now()-5760*60*1e3),expires_at:new Date(Date.now()+720*60*60*1e3),delivery_time_days:90,min_quantity:1,max_quantity:2,views:12,interested_countries:[]}];for(const a of e)await g.collection(this.collections.offers).add(a);return console.log(`✅ ${e.length} ofertas de teste criadas com sucesso!`),{success:!0,count:e.length}}catch(e){return console.error("❌ Erro ao criar ofertas de teste:",e),{success:!1,error:e.message}}}async clearTestOffers(){try{console.log("🗑️ Removendo ofertas de teste...");const e=await g.collection(this.collections.offers).where("player_id",">=","test_player_").where("player_id","<","test_player_z").get(),a=g.batch();return e.docs.forEach(s=>{a.delete(s.ref)}),await a.commit(),console.log(`✅ ${e.docs.length} ofertas de teste removidas!`),{success:!0,count:e.docs.length}}catch(e){return console.error("❌ Erro ao remover ofertas de teste:",e),{success:!1,error:e.message}}}async cancelOffer(e){const a=h.currentUser;if(!a)return{success:!1,error:"Usuário não autenticado."};const s=g.collection(this.collections.offers).doc(e);try{return await g.runTransaction(async r=>{const o=await r.get(s);if(!o.exists)throw new Error("Oferta não encontrada.");const n=o.data();if(n.player_id!==a.uid)throw new Error("Você não tem permissão para cancelar esta oferta.");if(n.type!=="sell")throw new Error("Apenas ofertas de venda podem ser canceladas.");if(n.status!=="active")throw new Error(`A oferta não está mais ativa (status: ${n.status}).`);if(n.category==="resources"){const i=g.collection("paises").doc(n.country_id),l=Se(n.item_id);if(!l)throw new Error(`Mapeamento de recurso inválido para item: ${n.item_id}`);const c=await r.get(i);if(!c.exists)throw new Error("País do vendedor não encontrado.");const m=c.data()[l]||0,d={};d[l]=m+n.quantity,r.update(i,d)}else if(n.category==="vehicles"||n.category==="naval"){const i=g.collection("inventory").doc(n.country_id),l=await r.get(i),c=n.category,u=n.item_name;if(l.exists){const p=(l.data()[c]?.[u]?.quantity||0)+n.quantity,b=`${c}.${u}.quantity`;r.update(i,{[b]:p})}else{const m={[c]:{[u]:{quantity:n.quantity}}};r.set(i,m)}}r.update(s,{status:"cancelled",updated_at:new Date})}),{success:!0}}catch(r){return console.error("Erro ao cancelar oferta:",r),{success:!1,error:r.message}}}}class mt{constructor(e){this.marketplaceSystem=e,this.currentModal=null,this.currentOfferType=null,this.currentCategory=null}async openSelectionModal(){const e=document.createElement("div");e.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",e.id="category-selection-modal",e.innerHTML=`
            <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-2xl w-full">
                <div class="p-6 border-b border-bg-ring/50">
                    <h2 class="text-2xl font-bold text-white">O que deseja vender?</h2>
                    <p class="text-slate-400 mt-1">Escolha a categoria do item que deseja vender no mercado internacional</p>
                </div>

                <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button data-category="resources" class="category-btn group relative p-6 border-2 border-bg-ring rounded-xl hover:border-brand-400 hover:bg-brand-500/10 transition-all">
                        <div class="text-6xl mb-4">📦</div>
                        <h3 class="text-xl font-bold text-white mb-2">Recursos</h3>
                        <p class="text-slate-400 text-sm">Metais, Combustível, Carvão, Alimentos</p>
                    </button>

                    <button data-category="equipment" class="category-btn group relative p-6 border-2 border-bg-ring rounded-xl hover:border-brand-400 hover:bg-brand-500/10 transition-all">
                        <div class="text-6xl mb-4">🚁</div>
                        <h3 class="text-xl font-bold text-white mb-2">Equipamentos</h3>
                        <p class="text-slate-400 text-sm">Veículos, Navios, Aviões</p>
                    </button>
                </div>

                <div class="p-6 border-t border-bg-ring/50 flex justify-end">
                    <button data-action="close" class="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancelar</button>
                </div>
            </div>
        `,document.body.appendChild(e),e.querySelector('[data-action="close"]').addEventListener("click",()=>{e.remove()}),e.querySelector('[data-category="resources"]').addEventListener("click",()=>{e.remove(),this.openCreateOfferModal("sell","resources")}),e.querySelector('[data-category="equipment"]').addEventListener("click",()=>{e.remove(),this.openEquipmentSelectionModal()}),e.addEventListener("click",a=>{a.target===e&&e.remove()})}async openEquipmentSelectionModal(){try{const e=h.currentUser;if(!e)throw new Error("Usuário não autenticado");const a=await w(e.uid);if(!a)throw new Error("Jogador não associado a um país");const s=await this.getCountryInventory(a);if(Object.keys(s).length===0){alert("Seu país não possui equipamentos no inventário para vender.");return}this.renderEquipmentSelectionModal(s,a)}catch(e){console.error("Erro ao abrir seleção de equipamentos:",e),alert(`Erro: ${e.message}`)}}async getCountryInventory(e){console.log("🔍 Buscando inventário para país:",e);const a=await g.collection("inventory").doc(e).get();if(!a.exists)return console.log("❌ Documento de inventário não existe"),{};const s=a.data();console.log("📦 Inventário bruto do Firestore:",s);const r={};for(const[o,n]of Object.entries(s))if(console.log(`🔍 Verificando categoria: ${o}`,n),n&&typeof n=="object"){if(n.quantity!==void 0)n.quantity>0&&(console.log(`✅ Item direto ${o} adicionado`),r[o]=n);else for(const[i,l]of Object.entries(n))if(console.log(`  🔍 Verificando subitem: ${i}`,l),l&&typeof l=="object"&&l.quantity>0){const c=`${o}/${i}`;console.log(`✅ Item ${c} adicionado ao inventário`),r[c]={...l,categoryId:o,itemName:i}}}return console.log("📦 Inventário achatado:",r),r}renderEquipmentSelectionModal(e,a){const s=document.createElement("div");s.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",s.id="equipment-selection-modal";const r={vehicles:{name:"Veículos Terrestres",icon:"🚗",items:[]},naval:{name:"Navios",icon:"🚢",items:[]},aircraft:{name:"Aeronaves",icon:"✈️",items:[]}};for(const[n,i]of Object.entries(e)){let l=i.category||"vehicles";if(i.categoryId){const c=i.categoryId.toLowerCase();c.includes("mbt")||c.includes("tank")||c.includes("vehicle")?l="vehicles":c.includes("ship")||c.includes("destroyer")||c.includes("carrier")||c.includes("naval")?l="naval":(c.includes("aircraft")||c.includes("fighter")||c.includes("bomber"))&&(l="aircraft")}r[l]&&r[l].items.push({itemId:n,...i})}const o=Object.entries(r).filter(([n,i])=>i.items.length>0).map(([n,i])=>`
                <div class="mb-6">
                    <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span class="text-2xl">${i.icon}</span>
                        ${i.name}
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${i.items.map(l=>`
                            <button data-select-equipment="${l.itemId}"
                                class="equipment-card group relative p-4 border-2 border-bg-ring rounded-lg hover:border-brand-400 hover:bg-brand-500/10 transition-all text-left">
                                <div class="flex items-start justify-between mb-2">
                                    <div>
                                        <div class="font-bold text-white">${l.itemName||l.name||l.itemId}</div>
                                        <div class="text-xs text-slate-400">${l.categoryId||l.type||"Equipamento"}</div>
                                    </div>
                                    <div class="text-2xl">${l.icon||"🔧"}</div>
                                </div>
                                <div class="text-sm text-slate-300 mt-2">
                                    <div>Disponível: <span class="text-brand-400 font-semibold">${l.quantity}</span></div>
                                    ${l.cost?`<div class="text-xs text-slate-400 mt-1">Valor base: $${l.cost.toLocaleString()}</div>`:""}
                                </div>
                            </button>
                        `).join("")}
                    </div>
                </div>
            `).join("");s.innerHTML=`
            <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-bg-ring/50 sticky top-0 bg-bg-soft z-10">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-white">Selecione o Equipamento para Vender</h2>
                            <p class="text-slate-400 mt-1">Escolha um equipamento do seu inventário</p>
                        </div>
                        <button data-action="close" class="text-slate-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="p-6">
                    ${o}
                </div>
            </div>
        `,document.body.appendChild(s),s.querySelector('[data-action="close"]').addEventListener("click",()=>{s.remove()}),s.querySelectorAll("[data-select-equipment]").forEach(n=>{n.addEventListener("click",()=>{const i=n.dataset.selectEquipment,l=e[i];s.remove(),this.openEquipmentSellModal(i,l,a)})}),s.addEventListener("click",n=>{n.target===s&&s.remove()})}async openEquipmentSellModal(e,a,s){const r=document.createElement("div");r.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",r.id="equipment-sell-modal";const o=a.cost||1e5,n=Math.round(o*.5),i=Math.round(o*3);r.innerHTML=`
            <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-bg-ring/50 bg-gradient-to-r from-brand-500/10 to-brand-600/10">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
                                <span class="text-3xl">${a.icon||"🚁"}</span>
                                Vender ${a.name||e}
                            </h2>
                            <p class="text-slate-400 mt-1 text-sm">Configure os detalhes da oferta</p>
                        </div>
                        <button data-action="close" class="text-slate-400 hover:text-white transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <form id="equipment-sell-form" class="p-6 space-y-6">
                    <!-- Info do Equipamento -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="text-slate-400">Tipo:</span>
                                <span class="text-white font-semibold ml-2">${a.categoryId||a.type||"Equipamento"}</span>
                            </div>
                            <div>
                                <span class="text-slate-400">Disponível:</span>
                                <span class="text-brand-400 font-semibold ml-2">${a.quantity} unidades</span>
                            </div>
                        </div>
                    </div>

                    <!-- Nome da Oferta -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                            🏷️ Nome do Equipamento na Oferta
                        </label>
                        <input type="text" id="equipment-display-name" name="displayName"
                               value="${a.itemName||a.name||e}" required
                               placeholder="Ex: T-34, Sherman M4, Spitfire Mk V..."
                               class="w-full rounded-lg bg-bg border border-bg-ring p-3 text-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400">
                        <div class="mt-2 text-xs text-slate-400">
                            💡 Personalize o nome do equipamento como ele aparecerá no mercado (ex: "T-34" ao invés de "MBT Genérico")
                        </div>
                    </div>

                    <!-- Quantidade -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                            📊 Quantidade
                        </label>
                        <input type="number" id="equipment-quantity" name="quantity"
                               min="1" max="${a.quantity}" value="1" required
                               class="w-full rounded-lg bg-bg border border-bg-ring p-3 text-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400">
                        <div class="flex justify-between mt-2 text-xs text-slate-400">
                            <span>Mínimo: 1</span>
                            <span>Máximo disponível: ${a.quantity}</span>
                        </div>
                    </div>

                    <!-- Preço -->
                    <div class="bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
                        <label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
                            💰 Preço por Unidade (USD)
                        </label>
                        <input type="number" id="equipment-price" name="price"
                               min="${n}" max="${i}" value="${o}" required
                               class="w-full rounded-lg bg-bg border border-bg-ring p-3 text-white focus:border-brand-400 focus:ring-1 focus:ring-brand-400">
                        <div class="flex gap-2 mt-3">
                            <button type="button" data-price="${n}" class="flex-1 px-3 py-2 rounded-lg bg-bg border border-bg-ring text-xs hover:border-brand-400 transition-colors">
                                Baixo<br>$${n.toLocaleString()}
                            </button>
                            <button type="button" data-price="${o}" class="flex-1 px-3 py-2 rounded-lg bg-bg border border-brand-400 text-xs hover:border-brand-500 transition-colors">
                                Mercado<br>$${o.toLocaleString()}
                            </button>
                            <button type="button" data-price="${i}" class="flex-1 px-3 py-2 rounded-lg bg-bg border border-bg-ring text-xs hover:border-brand-400 transition-colors">
                                Alto<br>$${i.toLocaleString()}
                            </button>
                        </div>
                    </div>

                    <!-- Resumo -->
                    <div class="bg-gradient-to-r from-brand-500/10 to-brand-600/10 rounded-lg p-5 border border-brand-500/30">
                        <div class="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">📋 Resumo da Oferta</div>
                        <div class="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div class="text-2xl font-bold text-white" id="equipment-summary-total">$0</div>
                                <div class="text-xs text-slate-400 mt-1">Valor Total</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-white" id="equipment-summary-price">$0</div>
                                <div class="text-xs text-slate-400 mt-1">Preço Unitário</div>
                            </div>
                            <div>
                                <div class="text-2xl font-bold text-white" id="equipment-summary-quantity">0</div>
                                <div class="text-xs text-slate-400 mt-1">Quantidade</div>
                            </div>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div class="flex gap-3 pt-4 border-t border-bg-ring/50">
                        <button type="button" data-action="close" class="flex-1 px-6 py-3 rounded-lg border border-bg-ring text-slate-300 hover:text-white hover:border-slate-400 transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" id="equipment-submit-btn" class="flex-1 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
                            ✨ Criar Oferta
                        </button>
                    </div>
                </form>
            </div>
        `,document.body.appendChild(r),this.currentModal=r;const l=r.querySelector("#equipment-sell-form"),c=r.querySelector("#equipment-quantity"),u=r.querySelector("#equipment-price"),m=()=>{const d=parseInt(c.value)||0,p=parseInt(u.value)||0,b=d*p;r.querySelector("#equipment-summary-quantity").textContent=d,r.querySelector("#equipment-summary-price").textContent=`$${p.toLocaleString()}`,r.querySelector("#equipment-summary-total").textContent=`$${b.toLocaleString()}`};c.addEventListener("input",m),u.addEventListener("input",m),m(),r.querySelectorAll("[data-price]").forEach(d=>{d.addEventListener("click",()=>{u.value=d.dataset.price,m()})}),r.querySelectorAll('[data-action="close"]').forEach(d=>{d.addEventListener("click",()=>r.remove())}),r.addEventListener("click",d=>{d.target===r&&r.remove()}),l.addEventListener("submit",async d=>{d.preventDefault(),await this.handleEquipmentSellSubmit(e,a,s,l)})}async handleEquipmentSellSubmit(e,a,s,r){const o=r.querySelector("#equipment-submit-btn"),n=o.textContent;try{o.disabled=!0,o.textContent="⏳ Criando oferta...";const i=parseInt(r.quantity.value),l=parseInt(r.price.value),c=r.displayName.value.trim(),m=(await g.collection("paises").doc(s).get()).data();let d=a.category||"vehicles";if(a.categoryId){const f=a.categoryId.toLowerCase();f.includes("mbt")||f.includes("tank")||f.includes("vehicle")?d="vehicles":f.includes("ship")||f.includes("destroyer")||f.includes("carrier")||f.includes("naval")?d="naval":(f.includes("aircraft")||f.includes("fighter")||f.includes("bomber"))&&(d="aircraft")}const p={type:"sell",category:d,item_id:e,item_name:c||a.itemName||a.name||e,quantity:i,unit:"unidade",price_per_unit:l,min_quantity:1,max_quantity:i,delivery_time_days:1,title:`${c} - ${i} unidade(s)`,description:`Venda de ${a.categoryId||a.type||"equipamento"} do inventário`,country_id:s,country_name:m.Pais,player_id:h.currentUser.uid};console.log("📤 Criando oferta de equipamento:",p);const b=await this.marketplaceSystem.createOffer(p);if(b.success)o.textContent="✅ Oferta criada!",o.classList.add("bg-green-600"),setTimeout(()=>{this.closeModal(),window.location.reload()},1500);else throw new Error(b.error||"Erro desconhecido")}catch(i){console.error("❌ Erro ao criar oferta:",i),o.textContent="❌ Erro",o.classList.add("bg-red-600"),alert(`Erro ao criar oferta: ${i.message}`),setTimeout(()=>{o.textContent=n,o.classList.remove("bg-red-600"),o.disabled=!1},3e3)}}async openCreateOfferModal(e,a=null,s=null){this.currentOfferType=e,this.currentCategory=a,e==="sell"&&a==="resources"?this.currentModal=await this.renderResourceSellModal(s):console.warn(e==="sell"&&(a==="vehicles"||a==="naval")?"Modal de venda de equipamento ainda não implementado.":e==="buy"?"Modal de compra ainda não implementado.":"Modal de seleção ainda não implementado."),this.currentModal&&(document.body.appendChild(this.currentModal),this.setupEventListeners())}async renderResourceSellModal(e){const a=document.createElement("div");a.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="resource-sell-modal";const s=await this.getAvailableResources();return a.innerHTML=`
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

<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
${s.map(r=>`
<label class="relative flex items-center p-4 border-2 border-bg-ring rounded-lg cursor-pointer
hover:border-brand-400 hover:bg-brand-500/5 transition-all group">
<input type="radio" name="resource" value="${r.gameResourceId}"
data-market-type="${r.defaultMarketType}"
data-unit="${r.unit}"
data-available="${r.available}"
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
<div class="font-medium text-white">${r.displayName}</div>
<div class="text-xs text-slate-400 mt-0.5">
Disponível: <span class="text-brand-300 font-semibold">
${r.available.toLocaleString()} ${r.unit}
</span>
</div>
</div>

<!-- Badge de disponibilidade -->
<div class="absolute top-2 right-2">
${r.available>1e5?'<span class="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full">Alto estoque</span>':r.available>1e4?'<span class="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">Estoque médio</span>':'<span class="px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full">Estoque baixo</span>'}
</div>
</label>
`).join("")}
</div>

${s.length===0?`
<div class="text-center py-8 text-slate-400">
<div class="text-5xl mb-3">📭</div>
<p class="font-medium">Nenhum recurso disponível para venda</p>
<p class="text-sm mt-1">Você não possui recursos excedentes no momento</p>
</div>
`:""}
</div>

<!-- Tipo de Produto (apenas se recurso tiver múltiplos tipos) -->
<div id="product-type-section" class="hidden bg-bg/30 rounded-lg p-5 border border-bg-ring/50">
<label class="block text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">
🏭 Tipo de Produto
</label>
<div id="product-type-options" class="space-y-2">
<!-- Populado dinamicamente quando recurso for selecionado -->
</div>
<p class="text-xs text-slate-400 mt-2">
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
min="1" step="1" placeholder="0" required
class="w-full px-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
focus:border-brand-400 focus:outline-none transition-colors">
<div id="quantity-unit" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
<!-- Unidade -->
</div>
</div>

<!-- Barra de progresso visual -->
<div class="mt-3">
<div class="flex justify-between text-xs text-slate-400 mb-1">
<span>0</span>
<span id="max-quantity-label">Máximo disponível</span>
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
<button type="button" data-quantity-preset="25"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
25%
</button>
<button type="button" data-quantity-preset="50"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
50%
</button>
<button type="button" data-quantity-preset="75"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
75%
</button>
<button type="button" data-quantity-preset="100"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
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
min="0.01" step="0.01" placeholder="0.00" required
class="w-full pl-8 pr-4 py-3 bg-bg border-2 border-bg-ring rounded-lg text-white text-lg
focus:border-brand-400 focus:outline-none transition-colors">
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
<button type="button" data-price-preset="low"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
Baixo
</button>
<button type="button" data-price-preset="market"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
Mercado
</button>
<button type="button" data-price-preset="high"
class="px-3 py-1 bg-bg-ring hover:bg-brand-500/20 text-slate-300 text-xs rounded-full transition-colors">
Alto
</button>
</div>
</div>
</div>

<!-- Resumo da Transação -->
<div id="transaction-summary" class="bg-gradient-to-br from-brand-500/10 to-brand-600/10
border-2 border-brand-400/30 rounded-lg p-5">
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
<span id="profit-estimate" class="font-semibold">-</span>
</div>
</div>
</div>

<!-- Configurações Avançadas (Colapsável) -->
<details class="bg-bg/30 rounded-lg border border-bg-ring/50">
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
<input type="number" name="min_quantity" min="1" placeholder="1"
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
<button type="submit" id="submit-offer-btn"
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
`,a}async getAvailableResources(){const e=window.currentCountry;if(!e)return[];const a=window.ResourceProductionCalculator.calculateCountryProduction(e),s=window.ResourceConsumptionCalculator.calculateCountryConsumption(e),r=[];return Object.entries(At).forEach(([o,n])=>{const i=a[o]||0,l=s[o]||0,c=i-l;c>0&&r.push({gameResourceId:n.gameResourceId,displayName:n.displayName,unit:n.defaultUnit,available:Math.round(c),defaultMarketType:n.marketTypes[0].id,hasMultipleTypes:n.marketTypes.length>1,types:n.marketTypes})}),r}setupEventListeners(){if(!this.currentModal)return;this.currentModal.querySelectorAll('[data-action="close"]').forEach(r=>{r.addEventListener("click",()=>this.closeModal())}),this.currentModal.querySelectorAll('input[name="resource"]').forEach(r=>{r.addEventListener("change",o=>this.onResourceSelected(o.target))}),this.currentModal.querySelectorAll("[data-quantity-preset]").forEach(r=>{r.addEventListener("click",o=>{const n=parseInt(o.target.dataset.quantityPreset);this.applyQuantityPreset(n)})}),this.currentModal.querySelectorAll("[data-price-preset]").forEach(r=>{r.addEventListener("click",o=>{const n=o.target.dataset.pricePreset;this.applyPricePreset(n)})});const e=this.currentModal.querySelector("#quantity-input"),a=this.currentModal.querySelector("#price-input");e?.addEventListener("input",()=>this.validateAndUpdateSummary()),a?.addEventListener("input",()=>this.validateAndUpdateSummary()),this.currentModal.querySelector("form")?.addEventListener("submit",r=>this.handleSubmit(r))}onResourceSelected(e){const a=e.dataset.marketType,s=e.dataset.unit,r=parseInt(e.dataset.available),o=this.currentModal.querySelector("#quantity-unit");o&&(o.textContent=s);const n=this.currentModal.querySelector("#quantity-input");n&&(n.max=r,n.setAttribute("data-available",r));const i=Pt(a,r);if(i){const l=this.currentModal.querySelector("#price-suggestion"),c=this.currentModal.querySelector("#price-range");l&&c&&(l.classList.remove("hidden"),c.textContent=`${i.min} - ${i.max}`,this.currentModal.setAttribute("data-price-low",i.min),this.currentModal.setAttribute("data-price-market",i.suggested),this.currentModal.setAttribute("data-price-high",i.max));const u=this.currentModal.querySelector("#price-input");u&&!u.value&&(u.value=i.suggested)}this.validateAndUpdateSummary()}applyQuantityPreset(e){const a=this.currentModal.querySelector("#quantity-input"),s=parseInt(a.getAttribute("data-available")||0),r=Math.floor(s*(e/100));a.value=r,this.validateAndUpdateSummary()}applyPricePreset(e){const a=this.currentModal.querySelector("#price-input");let s=0;e==="low"?s=this.currentModal.getAttribute("data-price-low"):e==="market"?s=this.currentModal.getAttribute("data-price-market"):e==="high"&&(s=this.currentModal.getAttribute("data-price-high")),s&&(a.value=s,this.validateAndUpdateSummary())}validateAndUpdateSummary(){const e=this.currentModal.querySelector("#quantity-input"),a=this.currentModal.querySelector("#price-input"),s=parseInt(e?.value||0),r=parseFloat(a?.value||0),o=parseInt(e?.getAttribute("data-available")||0),n=this.currentModal.querySelector("#quantity-feedback"),i=this.currentModal.querySelector("#quantity-progress");if(s>0){const m=Math.min(s/o*100,100);i.style.width=`${m}%`,s>o?(n.className="mt-2 text-sm text-red-400",n.textContent=`❌ Quantidade excede o disponível (${o.toLocaleString()})`,n.classList.remove("hidden")):(n.className="mt-2 text-sm text-green-400",n.textContent=`✅ Válido (${(s/o*100).toFixed(1)}% do estoque)`,n.classList.remove("hidden"))}else i.style.width="0%",n.classList.add("hidden");const l=s*r;this.currentModal.querySelector("#total-value").textContent=`${l.toLocaleString("en-US",{minimumFractionDigits:2})}`,this.currentModal.querySelector("#unit-value").textContent=`${r.toLocaleString("en-US",{minimumFractionDigits:2})}`,this.currentModal.querySelector("#summary-quantity").textContent=s.toLocaleString();const c=parseFloat(this.currentModal.getAttribute("data-price-market")||0),u=this.currentModal.querySelector("#profit-estimate");if(c>0&&r>0){const m=(r-c)/c*100;m>5?(u.className="font-semibold text-green-400",u.textContent=`+${m.toFixed(1)}% acima do mercado`):m<-5?(u.className="font-semibold text-red-400",u.textContent=`${m.toFixed(1)}% abaixo do mercado`):(u.className="font-semibold text-yellow-400",u.textContent="≈ Preço de mercado")}}async handleSubmit(e){e.preventDefault();const a=e.target,s=this.currentModal.querySelector("#submit-offer-btn"),r=s.textContent;try{s.disabled=!0,s.textContent="⏳ Criando oferta...";const o=new FormData(a),n=a.querySelector('input[name="resource"]:checked'),i=n.dataset.marketType,l=n.dataset.unit,c={type:"sell",category:"resources",item_id:i,item_name:n.parentElement.querySelector(".font-medium").textContent,quantity:parseInt(o.get("quantity")),unit:l,price_per_unit:parseFloat(o.get("price_per_unit")),min_quantity:parseInt(o.get("min_quantity"))||1,delivery_time_days:parseInt(o.get("delivery_time_days"))||30,duration_days:parseInt(o.get("duration_days"))||14,title:o.get("custom_title")||null};c.title||(c.title=`${c.item_name} - ${c.quantity.toLocaleString()} ${l}`),console.log("📤 Enviando oferta:",c);const u=await this.marketplaceSystem.createOffer(c);if(u.success)s.textContent="✅ Oferta criada!",s.classList.add("bg-green-600"),setTimeout(()=>{this.closeModal(),window.location.reload()},1500);else throw new Error(u.error||"Erro desconhecido")}catch(o){console.error("❌ Erro ao criar oferta:",o),s.textContent="❌ Erro",s.classList.add("bg-red-600"),alert(`Erro ao criar oferta: ${o.message}`),setTimeout(()=>{s.textContent=r,s.classList.remove("bg-red-600"),s.disabled=!1},3e3)}}closeModal(){this.currentModal&&(this.currentModal.remove(),this.currentModal=null)}}class js{constructor(){this.modal=null,this.country=null,this.lawsConfig=null}openModal(e,a,s){if(this.country=a,this.lawsConfig=s,document.getElementById("law-change-modal"))return;const r=this.renderModal(e);document.body.insertAdjacentHTML("beforeend",r),this.modal=document.getElementById("law-change-modal"),this.setupEventListeners(e)}renderModal(e){const a=this.lawsConfig[e+"Laws"],s=this.country[e+"Law"],r=!!this.country.lawChange;return`
      <div id="law-change-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div class="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/50 rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
          <!-- Header -->
          <div class="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl">
                  ${e==="mobilization"?"🎖️":"💼"}
                </div>
                <div>
                  <h3 class="text-xl font-bold text-slate-100">${e==="mobilization"?"Leis de Conscrição":"Leis Econômicas"}</h3>
                  <p class="text-sm text-slate-400 mt-0.5">${e==="mobilization"?"Defina a política de recrutamento militar do seu país":"Ajuste o foco da economia entre produção civil e militar"}</p>
                </div>
              </div>
              <button data-action="close" class="text-slate-400 hover:text-slate-200 hover:bg-slate-800 p-2 rounded-lg transition-all">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <!-- Laws List -->
          <div class="flex-1 overflow-y-auto p-6 space-y-3">
            ${Object.entries(a).sort(([,l],[,c])=>l.level-c.level).map(([l,c])=>this.renderLawOption(l,c,s,r,e)).join("")}
          </div>
        </div>
      </div>
    `}renderLawOption(e,a,s,r,o){const n=this.lawsConfig[o+"Laws"][s],i=e===s,l=this.calculateTransitionTime(a.level,n.level);let c,u="";return i?(c='<button class="px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-400 text-sm font-medium rounded-lg cursor-not-allowed" disabled>Lei Atual</button>',u='<span class="px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium rounded">ATIVA</span>'):r?c='<button class="px-4 py-2 bg-slate-600/20 border border-slate-500/30 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed" disabled>Mudança em Progresso</button>':c=`<button data-action="adopt" data-law-id="${e}" data-law-type="${o}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">Adotar (${l} turnos)</button>`,`
      <div class="group bg-gradient-to-br from-slate-800/40 to-slate-900/40 border ${i?"border-green-500/50 shadow-lg shadow-green-900/20":"border-slate-700/50 hover:border-slate-600/70"} rounded-xl p-4 transition-all hover:shadow-xl">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700/50 border border-slate-600/50 text-slate-400 text-xs font-bold">
                ${a.level}
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-slate-100 text-base">${a.name}</h4>
              </div>
              ${u}
            </div>
            <div class="text-xs text-slate-400 mt-2 space-y-1">${this.getLawEffects(a)}</div>
          </div>
          <div class="flex items-center">
            ${c}
          </div>
        </div>
      </div>
    `}calculateTransitionTime(e,a){const s=this.country.inWarWith&&this.country.inWarWith.length>0,o=Math.abs(e-a)*2;return s?Math.max(1,o):Math.max(2,o*2)}getLawEffects(e){const a=[];return e.bonuses&&Object.entries(e.bonuses).forEach(([s,r])=>{const o=this.getEffectDisplayName(s);a.push(`
          <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-400">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="font-medium">${o}: +${(r*100).toFixed(0)}%</span>
          </div>
        `)}),e.penalties&&Object.entries(e.penalties).forEach(([s,r])=>{const o=this.getEffectDisplayName(s);a.push(`
          <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span class="font-medium">${o}: ${(r*100).toFixed(0)}%</span>
          </div>
        `)}),e.consumptionModifiers&&Object.entries(e.consumptionModifiers).forEach(([s,r])=>{const o=r>0?"+":"",n=r>0?"red":"green",i=r>0?"M5 15l7-7 7 7":"M19 9l-7 7-7-7";a.push(`
          <div class="inline-flex items-center gap-1.5 px-2 py-1 bg-${n}-500/10 border border-${n}-500/20 rounded text-${n}-400">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${i}" />
            </svg>
            <span class="font-medium">Consumo ${s}: ${o}${(r*100).toFixed(0)}%</span>
          </div>
        `)}),a.length===0?'<div class="text-slate-500 italic">Nenhum efeito especial</div>':`<div class="flex flex-wrap gap-2">${a.join("")}</div>`}getEffectDisplayName(e){return{resourceProduction:"Produção de Recursos",civilianFactoryEfficiency:"Eficiência Civil",militaryProductionSpeed:"Produção Militar",recruitablePopulation:"População Recrutável",militaryProductionCost:"Custo Militar",warExhaustionPassiveGain:"Exaustão de Guerra",militaryCapacity:"Capacidade Militar"}[e]||e}setupEventListeners(e){this.modal.addEventListener("click",a=>{const s=a.target.closest("[data-action]");if(!s)return;const r=s.dataset.action;r==="close"?this.closeModal():r==="adopt"&&this.handleAdopt(s.dataset.lawId,s.dataset.lawType)}),this.modal.addEventListener("click",a=>{a.target.id==="law-change-modal"&&this.closeModal()})}async handleAdopt(e,a){const s=this.lawsConfig[a+"Laws"][e],r=this.lawsConfig[a+"Laws"][this.country[a+"Law"]],o=this.calculateTransitionTime(s.level,r.level);if(!await Lt("Confirmar Mudança de Lei",`Você tem certeza que deseja iniciar a transição para a lei "${s.name}"? O processo levará ${o} turnos e não poderá ser cancelado.`))return;const i={type:a,originLaw:this.country[a+"Law"],targetLaw:e,progress:0,totalTurns:o};try{await g.collection("paises").doc(this.country.id).update({lawChange:i}),Te("success",`Transição para ${s.name} iniciada!`),this.closeModal(),setTimeout(()=>window.location.reload(),500)}catch(l){console.error("Erro ao iniciar mudança de lei:",l),Te("error",`Erro: ${l.message}`)}}closeModal(){this.modal&&(this.modal.remove(),this.modal=null)}}function Os(t){return t<=20?{label:"Anarquia",tone:"bg-rose-500/15 text-rose-300 border-rose-400/30"}:t<=49?{label:"Instável",tone:"bg-amber-500/15 text-amber-300 border-amber-400/30"}:t<=74?{label:"Neutro",tone:"bg-sky-500/15 text-sky-300 border-sky-400/30"}:{label:"Tranquilo",tone:"bg-emerald-500/15 text-emerald-300 border-emerald-400/30"}}function S(t){if(!t||isNaN(t))return"0";const e=parseFloat(t);return e>=1e9?(e/1e9).toFixed(1)+"B":e>=1e6?(e/1e6).toFixed(1)+"M":e>=1e3?(e/1e3).toFixed(0)+"K":Math.round(e).toLocaleString("pt-BR")}function M(t){if(!t)return"US$ 0";const e=parseFloat(t);return e>=1e9?"US$ "+(e/1e9).toFixed(1)+"B":e>=1e6?"US$ "+(e/1e6).toFixed(1)+"M":e>=1e3?"US$ "+(e/1e3).toFixed(1)+"K":"US$ "+e.toLocaleString()}function E(t){const e=parseFloat(t)||0;return e===0?"US$ 0":e>=1e9?`US$ ${(e/1e9).toFixed(1)}bi`:e>=1e6?`US$ ${(e/1e6).toFixed(1)}mi`:e>=1e3?`US$ ${(e/1e3).toFixed(1)}mil`:`US$ ${Math.round(e)}`}function Rs(t){const e=parseFloat(t.WarPower)||0;return Math.round(e)}function G(t){const e=parseFloat(t.PIB)||0,a=(parseFloat(t.Burocracia)||0)/100,s=(parseFloat(t.Estabilidade)||0)/100,r=e*.25*a*(s*1.5),o=parseFloat(t.OrcamentoGasto||0),n=parseFloat(t.AgencyBudgetSpent||0);return Math.max(0,r-o-n)}function bt(t){const e=G(t),a=(parseFloat(t.MilitaryBudgetPercent)||30)/100;return e*a}function gt(t){const e=(parseFloat(t.MilitaryDistributionVehicles)||40)/100,a=(parseFloat(t.MilitaryDistributionAircraft)||30)/100,s=(parseFloat(t.MilitaryDistributionNaval)||30)/100;return{vehicles:e,aircraft:a,naval:s,maintenancePercent:.15}}function Fs(t){const s=(parseFloat(t.MilitaryBudgetPercent)||30)-30;let r=0,o=0;return s>0&&(r=Math.floor(s/2)*-1,o=s*-.5),{stabilityPenalty:r,economicPenalty:o,isOverBudget:s>0}}function de(t){const e=bt(t),a=gt(t),s=e*(1-a.maintenancePercent),r=(parseFloat(t.Tecnologia)||0)/100,o=(parseFloat(t.IndustrialEfficiency)||30)/100,n=(parseFloat(t.Marinha)||0)/100,i=(parseFloat(t.Urbanizacao)||0)/100;return s*a.naval*r*o*n*i}async function Hs(t){let e=null;try{const x=await g.collection("gameConfig").doc("nationalLaws").get();x.exists&&(e=x.data())}catch(x){console.error("Erro ao carregar configuração de leis:",x)}e?.mobilizationLaws&&e?.economicLaws||console.warn("⚠️ Configuração de leis nacionais não encontrada no gameConfig"),Bt.computeEnergyDemandGW(t);const s=Dt.calculateConsumerGoods(t),r=Ye.calculateCountryConsumption(t),o=Ze.calculateCountryProduction(t),n={Carvao:Math.round((o.Carvao||0)-(r.Carvao||0)),Combustivel:Math.round((o.Combustivel||0)-(r.Combustivel||0)),Metais:Math.round((o.Metais||0)-(r.Metais||0)),Graos:Math.round((o.Graos||0)-(r.Graos||0)),Energia:Math.round((o.Energia||0)-(r.Energia||0))},i=Os(parseFloat(t.Estabilidade)||0),l=Rs(t),c=(parseFloat(t.PIB)||0)/(parseFloat(t.Populacao)||1),u=G(t),m=bt(t),d=gt(t),p=1+(t.currentModifiers?.militaryCapacity||0),b=m*d.vehicles*p,f=m*d.aircraft*p,v=m*d.naval*p,y=Fs(t);return`
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <!-- Header -->
      <div class="border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-8 rounded border border-slate-600 overflow-hidden grid place-items-center bg-slate-800">
                ${Le(t.Pais,"w-full h-full")}
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-100">${t.Pais}</h1>
                <p class="text-sm text-slate-400">${t.ModeloPolitico||"Sistema Político"}</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">War Power</div>
                <div class="text-2xl font-bold text-red-400">${S(l)}</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-slate-400 uppercase tracking-wide">PIB per capita</div>
                <div class="text-lg font-semibold text-emerald-400">${M(c)}</div>
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
                    <div class="text-xl font-bold text-slate-100">${E(t.PIB)}</div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-400 uppercase tracking-wide">Orçamento</div>
                    <div class="text-xl font-bold text-emerald-400">${E(u)}</div>
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

              ${Zs(t,e)}

              <!-- Consumer Goods -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🛍️ Bens de Consumo</h3>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-slate-400">Satisfação da População</span>
                  <span class="text-sm font-semibold text-slate-200">${s.level}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-3 mb-3">
                  <div class="h-3 rounded-full transition-all duration-300 ${s.level>=70?"bg-gradient-to-r from-emerald-500 to-green-400":s.level>=50?"bg-gradient-to-r from-yellow-500 to-amber-400":"bg-gradient-to-r from-red-500 to-rose-400"}" style="width: ${Math.min(s.level,100)}%"></div>
                </div>
                <div class="text-xs text-slate-500">
                  Produção: ${S(s.production)} •
                  Demanda: ${S(s.demand)} •
                  Efeito Estabilidade: <span class="${s.metadata.stabilityEffect>0?"text-green-400":s.metadata.stabilityEffect<0?"text-red-400":"text-slate-400"}">${s.metadata.stabilityEffect>0?"+":""}${s.metadata.stabilityEffect}%</span>
                </div>
              </div>

              <!-- Military Budget Control -->
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <h3 class="text-lg font-semibold text-slate-200 mb-4">🏛️ Controle do Orçamento Militar</h3>

                <!-- Total Military Budget Control -->
                <div class="mb-6">
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-sm text-slate-400">Percentual do PIB para Defesa</span>
                    <span class="text-lg font-bold text-emerald-400">${E(m)}</span>
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
                      <span class="text-sm font-bold text-blue-400"><span id="vehicles-display">${Math.round(d.vehicles*100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="vehicles-slider"
                      min="10"
                      max="80"
                      step="5"
                      value="${Math.round(d.vehicles*100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('vehicles')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="vehicles-amount">${E(m*d.vehicles)}</span></div>
                  </div>

                  <!-- Aircraft -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">✈️</span>
                        <span class="text-sm font-medium text-slate-200">Força Aérea</span>
                      </div>
                      <span class="text-sm font-bold text-cyan-400"><span id="aircraft-display">${Math.round(d.aircraft*100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="aircraft-slider"
                      min="10"
                      max="80"
                      step="5"
                      value="${Math.round(d.aircraft*100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('aircraft')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="aircraft-amount">${E(m*d.aircraft)}</span></div>
                  </div>

                  <!-- Naval -->
                  <div class="bg-slate-800/30 rounded-lg p-4">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <span class="text-lg">🚢</span>
                        <span class="text-sm font-medium text-slate-200">Marinha de Guerra</span>
                      </div>
                      <span class="text-sm font-bold text-purple-400"><span id="naval-display">${Math.round(d.naval*100)}</span>%</span>
                    </div>
                    <input
                      type="range"
                      id="naval-slider"
                      min="10"
                      max="80"
                      step="5"
                      value="${Math.round(d.naval*100)}"
                      class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer mb-2"
                      oninput="updateDistributionDisplay('naval')"
                    >
                    <div class="text-xs text-slate-400">Investimento: <span id="naval-amount">${E(m*d.naval)}</span></div>
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
                  ${Object.entries(n).map(([x,C])=>{const D={Carvao:"🪨",Combustivel:"⛽",Metais:"🔩",Graos:"🌾",Energia:"⚡"},se={Carvao:"Carvão",Combustivel:"Combustível",Metais:"Metais",Graos:"Grãos",Energia:"Energia"},P=x==="Energia"?"MW":"";return`
                      <div class="text-center">
                        <div class="text-lg mb-1">${D[x]}</div>
                        <div class="text-xs text-slate-400 mb-1">${se[x]}</div>
                        <div class="text-sm font-bold ${C>=0?"text-emerald-400":"text-red-400"}">
                          ${C>=0?"+":""}${S(C)}${P}
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
                    <span class="text-sm font-semibold text-blue-400">${E(b)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">✈️</span>
                      <span class="text-sm text-slate-300">Aeronaves</span>
                    </div>
                    <span class="text-sm font-semibold text-cyan-400">${E(f)}/turno</span>
                  </div>
                  <div class="flex items-center justify-between rounded-lg border border-white/5 bg-slate-800/30 px-4 py-3">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">🚢</span>
                      <span class="text-sm text-slate-300">Embarcações</span>
                    </div>
                    <span class="text-sm font-semibold text-purple-400">${E(v)}/turno</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Country Info Sidebar -->
            <div class="space-y-6">
              <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                <div class="aspect-[3/2] rounded-lg overflow-hidden mb-4 grid place-items-center bg-slate-800">
                  ${Le(t.Pais,"w-full h-full")}
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
                        <div class="text-sm font-semibold text-slate-200">${E(b)}/turno</div>
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
                        <div class="text-sm font-semibold text-slate-200">${E(f)}/turno</div>
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
                        <div class="text-sm font-semibold text-slate-200">${E(v)}/turno</div>
                      </div>
                    </div>
                  </a>

                  <!-- Division Designer -->
                  <a href="criador-divisoes.html" class="block p-4 bg-slate-800/30 hover:bg-slate-700/50 rounded-lg border border-slate-700/30 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">🎖️</span>
                        <div>
                          <div class="font-medium text-slate-200">Division Designer</div>
                          <div class="text-xs text-slate-400">Crie divisões personalizadas combinando unidades de combate e suporte</div>
                          <div class="text-xs text-green-400 mt-1">Sistema completo • 27 unidades de combate • 23 unidades de suporte</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-xs text-brand-400 font-semibold">✨ NOVO</div>
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
            ${["Carvao","Combustivel","Metais","Graos","Energia"].map(x=>{const C={Carvao:"🪨",Combustivel:"⛽",Metais:"🔩",Graos:"🌾",Energia:"⚡"},D={Carvao:"Carvão",Combustivel:"Combustível",Metais:"Metais",Graos:"Grãos",Energia:"Energia"},se=t[`Potencial${x}`]||(x==="Energia"?"N/A":"3"),P=Math.round(o[x]||0),re=Math.round(r[x]||0),Q=n[x],ne=x==="Energia"?"MW":"unidades";return`
                <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <span class="text-2xl">${C[x]}</span>
                      <div>
                        <h3 class="text-lg font-semibold text-slate-200">${D[x]}</h3>
                        ${x!=="Energia"?`<p class="text-sm text-slate-400">Potencial: ${se}/10</p>`:""}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold ${Q>=0?"text-emerald-400":"text-red-400"}">
                        ${Q>=0?"+":""}${S(Q)}
                      </div>
                      <div class="text-xs text-slate-400">${ne}/mês</div>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Produção</div>
                      <div class="text-lg font-semibold text-cyan-400">${S(P)} ${ne}</div>
                    </div>
                    <div class="bg-slate-800/30 rounded-lg p-3">
                      <div class="text-xs text-slate-400 uppercase tracking-wide">Consumo</div>
                      <div class="text-lg font-semibold text-amber-400">${S(re)} ${ne}</div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-slate-400">Eficiência</span>
                      <span class="text-slate-200">${P>0?Math.round(P/Math.max(re,1)*100):0}%</span>
                    </div>
                    <div class="w-full bg-slate-800 rounded-full h-2">
                      <div class="h-2 rounded-full ${Q>=0?"bg-emerald-500":"bg-red-500"}"
                           style="width: ${Math.min(Math.max(P/Math.max(re,1)*100,0),100)}%"></div>
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
          <div id="aircraft-inventory-container">
            <!-- Aircraft inventory will be loaded here -->
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
  `}function Us(){document.addEventListener("click",t=>{if(t.target.matches(".dashboard-tab")){const e=t.target.dataset.tab;document.querySelectorAll(".dashboard-tab").forEach(a=>{a.classList.remove("active","border-blue-500","text-blue-400"),a.classList.add("border-transparent","text-slate-400")}),t.target.classList.add("active","border-blue-500","text-blue-400"),t.target.classList.remove("border-transparent","text-slate-400"),document.querySelectorAll(".dashboard-tab-content").forEach(a=>{a.classList.add("hidden")}),document.getElementById(`tab-${e}`)?.classList.remove("hidden"),e==="vehicles"&&Vs(),e==="aircraft"&&zs(),e==="naval"&&vt(),e==="market"&&Xs(),e==="intelligence"&&tr()}if(t.target.matches(".inventory-category-card")||t.target.closest(".inventory-category-card")){const a=t.target.closest(".inventory-category-card").dataset.category;Ws(a)}if(t.target.matches(".equipment-item")||t.target.closest(".equipment-item")){const e=t.target.closest(".equipment-item"),a=e.dataset.equipment,s=e.dataset.category;ft(s,a)}})}async function Vs(){try{const t=document.getElementById("vehicles-inventory-container");if(!t)return;t.innerHTML=`
      <div class="flex items-center justify-center py-8">
        <div class="text-slate-400">🔄 Carregando inventário...</div>
      </div>
    `;const e=h.currentUser;if(!e)return;const a=await w(e.uid);if(!a)return;const s=await g.collection("inventory").doc(a).get();if(!s.exists){t.innerHTML=`
        <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Vazio</h3>
          <p class="text-slate-400">Nenhum equipamento aprovado encontrado</p>
        </div>
      `;return}const r=s.data();t.innerHTML=Qs(r)}catch(t){console.error("Erro ao carregar inventário:",t);const e=document.getElementById("vehicles-inventory-container");e&&(e.innerHTML=`
        <div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3>
          <p class="text-red-400">Erro ao carregar inventário: ${t.message}</p>
        </div>
      `)}}async function zs(){try{const t=document.getElementById("aircraft-inventory-container");if(!t)return;t.innerHTML=`
      <div class="flex items-center justify-center py-8">
        <div class="text-slate-400">🔄 Carregando inventário aeronáutico...</div>
      </div>
    `;const e=h.currentUser;if(!e)return;const a=await w(e.uid);if(!a)return;const s=await g.collection("inventory").doc(a).get();if(!s.exists){t.innerHTML=`
        <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">✈️</div>
          <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Aeronáutico Vazio</h3>
          <p class="text-slate-400">Nenhuma aeronave encontrada</p>
        </div>
      `;return}const r=s.data();t.innerHTML=Gs(r)}catch(t){console.error("Erro ao carregar inventário aeronáutico:",t);const e=document.getElementById("aircraft-inventory-container");e&&(e.innerHTML=`
        <div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center">
          <div class="text-6xl mb-4">❌</div>
          <h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3>
          <p class="text-red-400">Erro ao carregar inventário aeronáutico: ${t.message}</p>
        </div>
      `)}}function Gs(t){const e=["Caca","CAS","Bomber","BomberAJato","BomberEstrategico","BomberEstrategicoAJato","AWAC","HeliTransporte","HeliAtaque","TransporteAereo","Carga"],a=Object.keys(t).filter(o=>e.includes(o));if(a.length===0)return`
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 text-center">
        <div class="text-6xl mb-4">✈️</div>
        <h3 class="text-xl font-semibold text-slate-200 mb-2">Inventário Aeronáutico Vazio</h3>
        <p class="text-slate-400">Nenhuma aeronave encontrada</p>
      </div>
    `;const s={Caca:"✈️",CAS:"💣",Bomber:"✈️",BomberAJato:"✈️",BomberEstrategico:"🛫",BomberEstrategicoAJato:"🛫",AWAC:"📡",HeliTransporte:"🚁",HeliAtaque:"🚁",TransporteAereo:"✈️",Carga:"✈️"},r={Caca:"Caças",CAS:"CAS",Bomber:"Bombardeiros",BomberAJato:"Bombardeiros a Jato",BomberEstrategico:"Bombardeiros Estratégicos",BomberEstrategicoAJato:"Bombardeiros Estratégicos a Jato",AWAC:"AWAC",HeliTransporte:"Helicópteros de Transporte",HeliAtaque:"Helicópteros de Ataque",TransporteAereo:"Transporte Aéreo",Carga:"Carga"};return`
    <div class="space-y-6">
      <div class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <span class="text-xl">✈️</span>
          Inventário Aeronáutico
        </h3>
        <p class="text-sm text-slate-400 mb-6">Clique em uma categoria para ver as aeronaves</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${a.map(o=>{const n=t[o],i=Object.keys(n).length,l=Object.values(n).reduce((u,m)=>u+(m.quantity||0),0),c=Object.values(n).reduce((u,m)=>{const d=m.quantity||0,b=(m.cost||0)*.05;return u+b*d},0);return`
              <div class="inventory-category-card bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg p-4 cursor-pointer transition-colors" data-category="${o}">
                <div class="text-center">
                  <div class="text-3xl mb-2">${s[o]||"✈️"}</div>
                  <h4 class="font-semibold text-slate-200 mb-1">${r[o]||o}</h4>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>${i} tipo${i!==1?"s":""}</div>
                    <div>${l} unidade${l!==1?"s":""}</div>
                    <div class="text-red-400">🔧 ${E(c)}/mês</div>
                  </div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    </div>
  `}function Qs(t){const e=Object.keys(t);if(e.length===0)return`
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
          ${e.map(s=>{const r=t[s],o=Object.keys(r).length,n=Object.values(r).reduce((l,c)=>l+(c.quantity||0),0),i=Object.values(r).reduce((l,c)=>{const u=c.quantity||0,d=(c.cost||0)*.05;return l+d*u},0);return`
              <div class="inventory-category-card bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 rounded-lg p-4 cursor-pointer transition-colors" data-category="${s}">
                <div class="text-center">
                  <div class="text-3xl mb-2">${a[s]||"📦"}</div>
                  <h4 class="font-semibold text-slate-200 mb-1">${s}</h4>
                  <div class="text-xs text-slate-400 space-y-1">
                    <div>${o} tipo${o!==1?"s":""}</div>
                    <div>${n} unidade${n!==1?"s":""}</div>
                    <div class="text-red-400">🔧 ${E(i)}/mês</div>
                  </div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    </div>
  `}async function Ws(t){try{const e=h.currentUser;if(!e)return;const a=await w(e.uid);if(!a)return;const s=await g.collection("inventory").doc(a).get();if(!s.exists)return;const o=s.data()[t];if(!o)return;const n=document.getElementById("inventory-details-modal");n&&n.remove();const i=document.createElement("div");i.id="inventory-details-modal",i.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const l=document.createElement("div");l.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col";const c=Object.entries(o),u=c.reduce((d,[p,b])=>d+(b.quantity||0),0),m=c.reduce((d,[p,b])=>{const f=b.quantity||0,y=(b.cost||0)*.05;return d+y*f},0);l.innerHTML=`
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">📦 ${t}</h3>
          <p class="text-sm text-slate-400">${c.length} equipamentos • ${u} unidades • ${E(m)}/mês manutenção</p>
        </div>
        <button id="close-inventory-modal" class="text-slate-400 hover:text-slate-200 p-1">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${c.map(([d,p])=>{const b=p.quantity||0,f=p.cost||0,v=f*.05*b,y=f*b;return`
              <div class="equipment-item bg-slate-800/30 border border-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 cursor-pointer transition-colors"
                   data-equipment="${d}" data-category="${t}">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-slate-200 mb-1">${d}</h4>
                    <div class="text-xs text-slate-400 space-y-1">
                      <div>📦 <strong>Quantidade:</strong> ${b} unidades</div>
                      <div>💰 <strong>Custo unitário:</strong> ${E(f)}</div>
                      <div>💵 <strong>Valor total:</strong> ${E(y)}</div>
                      <div class="text-red-400">🔧 <strong>Manutenção:</strong> ${E(v)}/mês</div>
                      ${p.approvedDate?`<div>📅 <strong>Aprovado em:</strong> ${new Date(p.approvedDate).toLocaleDateString("pt-BR")}</div>`:""}
                    </div>
                  </div>
                </div>

                <div class="flex justify-between items-center">
                  <button class="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors"
                          onclick="showEquipmentDetails('${t}', '${d}')">
                    📋 Ver Ficha
                  </button>
                  <div class="text-xs text-slate-500">Clique para detalhes</div>
                </div>
              </div>
            `}).join("")}
        </div>
      </div>
    `,i.appendChild(l),i.addEventListener("click",d=>{d.target===i&&i.remove()}),l.querySelector("#close-inventory-modal").addEventListener("click",()=>{i.remove()}),document.addEventListener("keydown",function d(p){p.key==="Escape"&&(i.remove(),document.removeEventListener("keydown",d))}),document.body.appendChild(i)}catch(e){console.error("Erro ao carregar detalhes do inventário:",e)}}async function ft(t,e){try{const a=h.currentUser;if(!a)return;const s=await w(a.uid);if(!s)return;const r=await g.collection("inventory").doc(s).get();if(!r.exists)return;const n=r.data()[t]?.[e];if(!n)return;const i=document.getElementById("equipment-details-modal");i&&i.remove();const l=n.quantity||0,c=n.cost||0,u=c*.05*l,m=c*l,d=n.specs||{},p=document.createElement("div");p.id="equipment-details-modal",p.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const b=document.createElement("div");b.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col",b.innerHTML=`
      <div class="flex items-center justify-between p-6 border-b border-bg-ring/50">
        <div>
          <h3 class="text-lg font-semibold text-slate-200">🚗 ${e}</h3>
          <p class="text-sm text-slate-400">${t} • ${l} unidades em serviço</p>
        </div>
        <div class="flex items-center gap-2">
          ${n.sheetImageUrl?`
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
                <span class="text-slate-200">${E(c)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Quantidade:</span>
                <span class="text-slate-200">${l} unidades</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Valor total investido:</span>
                <span class="text-green-400 font-semibold">${E(m)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Custo de manutenção:</span>
                <span class="text-red-400 font-semibold">${E(u)}/mês</span>
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
              ${Object.entries(d).map(([v,y])=>{if(typeof y=="object"||v==="components"||v==="total_cost")return"";const x=v.replace(/_/g," ").replace(/\b\w/g,D=>D.toUpperCase());let C=y;return v.includes("cost")||v.includes("price")?C=E(y):v.includes("weight")?C=`${y} tons`:v.includes("speed")?C=`${y} km/h`:v.includes("armor")||v.includes("thickness")?C=`${y}mm`:(v.includes("caliber")||v.includes("gun"))&&(C=`${y}mm`),`
                  <div class="flex justify-between">
                    <span class="text-slate-400">${x}:</span>
                    <span class="text-slate-200">${C}</span>
                  </div>
                `}).join("")}

              ${n.approvedDate?`
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Data de aprovação:</span>
                  <span class="text-slate-200">${new Date(n.approvedDate).toLocaleDateString("pt-BR")}</span>
                </div>
              `:""}
              ${n.approvedBy?`
                <div class="flex justify-between">
                  <span class="text-slate-400">Aprovado por:</span>
                  <span class="text-slate-200">${n.approvedBy}</span>
                </div>
              `:""}
            </div>
          </div>
        </div>
      </div>
    `,p.appendChild(b),p.addEventListener("click",v=>{v.target===p&&p.remove()}),b.querySelector("#close-equipment-modal").addEventListener("click",()=>{p.remove()});const f=b.querySelector("#view-equipment-sheet");f&&n.sheetImageUrl&&f.addEventListener("click",()=>{Js(e,n.sheetImageUrl)}),document.addEventListener("keydown",function v(y){y.key==="Escape"&&(p.remove(),document.removeEventListener("keydown",v))}),document.body.appendChild(p)}catch(a){console.error("Erro ao carregar detalhes do equipamento:",a)}}function Js(t,e){const a=document.getElementById("equipment-sheet-modal");a&&a.remove();const s=document.createElement("div");s.id="equipment-sheet-modal",s.className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4";const r=document.createElement("div");r.className="bg-bg border border-bg-ring/70 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col",r.innerHTML=`
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
  `,s.appendChild(r),s.addEventListener("click",o=>{o.target===s&&s.remove()}),r.querySelector("#close-sheet-modal").addEventListener("click",()=>{s.remove()}),r.querySelector("#open-sheet-new-tab").addEventListener("click",()=>{window.open(e,"_blank")}),document.addEventListener("keydown",function o(n){n.key==="Escape"&&(s.remove(),document.removeEventListener("keydown",o))}),document.body.appendChild(s)}async function vt(){try{const t=document.getElementById("naval-content-container");if(!t)return;t.innerHTML='<div class="flex items-center justify-center py-8"><div class="text-slate-400">🔄 Carregando sistema naval...</div></div>';const e=h.currentUser;if(!e)return;const a=await w(e.uid);if(!a)return;const s=new Xe,r=window.currentCountry;if(!r)throw new Error("Dados do país não encontrados. Recarregue a página.");const[o,n]=await Promise.all([s.getCurrentShipyardLevel(a),g.collection("paises").get().then(i=>{if(i.empty)return 0;let l=0,c=0;return i.forEach(u=>{const m=parseFloat(u.data().PIB);isNaN(m)||(l+=m,c++)}),c>0?l/c:0})]);t.innerHTML=Ks(s,o,r,a,n)}catch(t){console.error("Erro ao carregar sistema naval:",t);const e=document.getElementById("naval-content-container");e&&(e.innerHTML=`<div class="bg-red-900/50 border border-red-800/50 rounded-xl p-6 text-center"><div class="text-6xl mb-4">❌</div><h3 class="text-xl font-semibold text-red-200 mb-2">Erro</h3><p class="text-red-400">Erro ao carregar sistema naval: ${t.message}</p></div>`)}}function Ks(t,e,a,s,r){const o=G(a),n=t.getLevelInfo(e,a,r),i=t.calculateMaintenanceCost(e,o),l=t.canUpgrade(e,a,r,o),c=[];for(let u=1;u<=3;u++)e+u<=t.maxLevel&&c.push(t.getLevelInfo(e+u,a,r));return`
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
                  <span class="text-slate-200 text-xs">${n.description}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Bônus paralelo:</span>
                  <span class="text-green-400">+${n.parallelBonus}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Redução tempo:</span>
                  <span class="text-blue-400">-${n.timeReduction}%</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Projetos simultâneos:</span>
                  <span class="text-purple-400">${n.maxProjects}</span>
                </div>
                <div class="flex justify-between border-t border-slate-600 pt-2">
                  <span class="text-slate-400">Manutenção/mês:</span>
                  <span class="text-red-400">${E(i)}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">% do orçamento:</span>
                  <span class="text-red-400">${(n.maintenancePercent*100).toFixed(2)}%</span>
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
                    <span class="text-emerald-300 font-semibold">${E(n.upgradeCost)}</span>
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

            ${c.map(u=>`
              <div class="bg-slate-800/20 border border-slate-600/30 rounded-lg p-3">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold text-slate-200">Nível ${u.level}</span>
                  <span class="text-xs text-emerald-300">${E(u.upgradeCost)}</span>
                </div>
                <div class="text-xs text-slate-400 mb-2">${u.description}</div>
                <div class="grid grid-cols-2 gap-2 text-xs">
                  <div class="text-green-400">+${u.parallelBonus}% paralelo</div>
                  <div class="text-blue-400">-${u.timeReduction}% tempo</div>
                  <div class="text-purple-400">${u.maxProjects} projetos</div>
                  <div class="text-red-400">${(u.maintenancePercent*100).toFixed(1)}% manutenção</div>
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
          ${Ys(t,e)}
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
                <div class="text-sm font-semibold text-slate-200">${E(de(a))}/turno</div>
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
                <span class="text-slate-200">${E(de(a))}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Bônus estaleiro:</span>
                <span class="text-green-400">+${n.parallelBonus}%</span>
              </div>
              <div class="flex justify-between border-t border-slate-600 pt-2">
                <span class="text-slate-400">Capacidade efetiva:</span>
                <span class="text-emerald-400 font-semibold">${E(de(a)*(1+n.parallelBonus/100))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `}function Ys(t,e){return[{name:"Corveta",baseTime:8,baseParallel:12},{name:"Destroyer",baseTime:18,baseParallel:4},{name:"Cruzador",baseTime:30,baseParallel:2}].map(s=>{const r=t.calculateProductionBonus(e),o=Math.ceil(s.baseTime*(1-r.timeReduction)),n=Math.ceil(s.baseParallel*r.parallelMultiplier),i=Math.ceil(s.baseTime/3),l=Math.ceil(o/3);return`
      <div class="bg-slate-800/30 border border-slate-700/30 rounded-lg p-4">
        <h4 class="font-semibold text-slate-200 mb-3">${s.name}</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-400">Tempo base:</span>
            <span class="text-slate-300">${s.baseTime} meses (${i} turnos)</span>
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
            <span class="text-green-400 font-semibold">${n}x</span>
          </div>
        </div>
      </div>
    `}).join("")}function Zs(t,e){if(!t||!e||!e.mobilizationLaws||!e.economicLaws)return console.warn("⚠️ Painel de leis não pode ser renderizado: configuração incompleta"),"";const a=t.warExhaustion||0;let s="bg-green-600";a>75?s="bg-red-600":a>40&&(s="bg-yellow-500");const r=e.mobilizationLaws[t.mobilizationLaw]?.name||"Desconhecida",o=e.economicLaws[t.economicLaw]?.name||"Desconhecida";let n="";if(t.lawChange){const{type:i,targetLaw:l,progress:c,totalTurns:u}=t.lawChange,m=e[i+"Laws"][l]?.name||"Desconhecida",d=u-c,p=c/u*100;n=`
      <div id="law-change-progress-panel" class="mt-4">
        <h4 class="text-sm font-semibold text-slate-300 mb-2">Mudança de Lei em Progresso...</h4>
        <div id="law-change-info" class="text-sm text-slate-400 mb-1">Mudando para "${m}". Turnos restantes: ${d}</div>
        <div class="w-full bg-slate-700 rounded-full h-2.5">
          <div id="law-change-progress-bar" class="bg-indigo-500 h-2.5 rounded-full" style="width: ${p}%"></div>
        </div>
      </div>
    `}return`
    <div id="national-laws-panel" class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-slate-200 mb-4">Leis Nacionais e Esforço de Guerra</h3>
      <!-- Exaustão de Guerra -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-1">
          <span class="text-sm font-medium text-slate-300">Exaustão de Guerra</span>
          <span id="war-exhaustion-value" class="text-sm font-bold text-slate-300">${a.toFixed(1)}%</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-2.5">
          <div id="war-exhaustion-bar" class="${s} h-2.5 rounded-full" style="width: ${a}%"></div>
        </div>
      </div>
      <!-- Leis Ativas -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div id="mobilization-law-card" onclick="window.openLawModal('mobilization')" class="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all">
          <h4 class="text-xs text-slate-400">Lei de Conscrição</h4>
          <p id="mobilization-law-display" class="font-semibold text-slate-100">${r}</p>
        </div>
        <div id="economic-law-card" onclick="window.openLawModal('economic')" class="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all">
          <h4 class="text-xs text-slate-400">Lei Econômica</h4>
          <p id="economic-law-display" class="font-semibold text-slate-100">${o}</p>
        </div>
      </div>
      ${n}
    </div>
  `}window.upgradeShipyard=async function(t){try{if(!confirm("Tem certeza que deseja fazer upgrade do estaleiro? O custo será deduzido imediatamente do orçamento."))return;const e=h.currentUser;if(!e){alert("Usuário não autenticado");return}const a=await w(e.uid);if(!a||a!==t){alert("Você não tem permissão para fazer upgrade deste país");return}const s=event.target,r=s.textContent;s.textContent="🔄 Processando...",s.disabled=!0;const n=await new Xe().upgradeShipyard(t);n.success?(s.textContent="✅ Upgrade Concluído!",s.classList.add("bg-green-600"),alert(`🏭 Estaleiro upgradado para nível ${n.newLevel}!
💰 Custo: ${E(n.cost)}
📈 Novos bônus: +${n.levelInfo.parallelBonus}% paralelo, -${n.levelInfo.timeReduction}% tempo`),setTimeout(()=>{vt()},1500)):(s.textContent="❌ Erro",s.classList.add("bg-red-600"),alert("Erro ao fazer upgrade: "+n.error),setTimeout(()=>{s.textContent=r,s.classList.remove("bg-red-600"),s.disabled=!1},3e3))}catch(e){console.error("Erro ao fazer upgrade do estaleiro:",e),alert("Erro ao fazer upgrade: "+e.message),event.target&&(event.target.textContent="❌ Erro",event.target.classList.add("bg-red-600"),setTimeout(()=>{event.target.textContent="⬆️ Fazer Upgrade",event.target.classList.remove("bg-red-600"),event.target.disabled=!1},3e3))}};window.showEquipmentDetails=ft;async function xt(){try{const t=h.currentUser;if(!t)return null;const e=await w(t.uid);if(!e)return null;const a=await g.collection("paises").doc(e).get();if(a.exists){const s={id:a.id,...a.data()};return window.currentCountry=s,s}return null}catch(t){return console.error("Erro ao recarregar país:",t),null}}window.reloadCurrentCountry=xt;async function Qe(){try{await new Promise(o=>{h.onAuthStateChanged(o)});const t=h.currentUser;if(!t){document.getElementById("dashboard-content").innerHTML=`
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa estar logado.</p>
          </div>
        </div>
      `;return}const e=await w(t.uid),a=await Ke(),s=e?a.find(o=>o.id===e):null;if(!s){document.getElementById("dashboard-content").innerHTML=`
        <div class="min-h-screen flex items-center justify-center bg-slate-950">
          <div class="text-center">
            <h2 class="text-2xl font-bold text-slate-200 mb-4">Acesso Negado</h2>
            <p class="text-slate-400">Você precisa ter um país atribuído.</p>
          </div>
        </div>
      `;return}window.currentCountry=s;const r=new js;window.openLawModal=async o=>{const n=await g.collection("gameConfig").doc("nationalLaws").get(),i=n.exists?n.data():null;if(!i){console.error("Configuração de leis não encontrada");return}const l=await xt();r.openModal(o,l,i)},document.getElementById("dashboard-content").innerHTML=await Hs(s),Us()}catch(t){console.error("Erro ao carregar dashboard:",t),document.getElementById("dashboard-content").innerHTML=`
      <div class="min-h-screen flex items-center justify-center bg-slate-950">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-red-400 mb-4">Erro</h2>
          <p class="text-slate-400">Erro ao carregar dashboard: ${t.message}</p>
        </div>
      </div>
    `}}window.ResourceProductionCalculator=Ze;window.ResourceConsumptionCalculator=Ye;window.updateBudgetDisplay=function(t){document.getElementById("budget-display").textContent=t};window.updateDistributionDisplay=function(t){const e=document.getElementById("vehicles-slider"),a=document.getElementById("aircraft-slider"),s=document.getElementById("naval-slider");let r=parseInt(e.value),o=parseInt(a.value),n=parseInt(s.value);if(t&&r+o+n>100){if(t==="vehicles"){const f=o+n;f>0&&(o=Math.max(10,Math.floor(o*(100-r)/f)),n=Math.max(10,100-r-o))}else if(t==="aircraft"){const f=r+n;f>0&&(r=Math.max(10,Math.floor(r*(100-o)/f)),n=Math.max(10,100-o-r))}else if(t==="naval"){const f=r+o;f>0&&(r=Math.max(10,Math.floor(r*(100-n)/f)),o=Math.max(10,100-n-r))}e.value=r,a.value=o,s.value=n}document.getElementById("vehicles-display").textContent=r,document.getElementById("aircraft-display").textContent=o,document.getElementById("naval-display").textContent=n;const i=r+o+n,l=document.getElementById("total-distribution-display");l.textContent=i+"%",i===100?l.className="text-lg font-bold text-emerald-400":i>100?l.className="text-lg font-bold text-red-400":l.className="text-lg font-bold text-yellow-400";const c=document.getElementById("military-budget-slider"),u=parseFloat(c.value)/100,p=G(window.currentCountry)*u*.85;document.getElementById("vehicles-amount").textContent=E(p*r/100),document.getElementById("aircraft-amount").textContent=E(p*o/100),document.getElementById("naval-amount").textContent=E(p*n/100)};window.saveMilitaryBudget=async function(t){try{const e=parseFloat(document.getElementById("military-budget-slider").value),a=h.currentUser;if(!a)return;const s=await w(a.uid);if(!s)return;const{db:r}=await Ee(async()=>{const{db:i}=await import("./firebase-BN3MSMQD.js");return{db:i}},__vite__mapDeps([0,1,2]));await r.collection("paises").doc(s).update({MilitaryBudgetPercent:e});const o=t.target,n=o.textContent;o.textContent="✓ Salvo!",o.classList.add("bg-green-600"),setTimeout(()=>{o.textContent=n,o.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(e){console.error("Erro ao salvar orçamento militar:",e),alert("Erro ao salvar orçamento militar. Tente novamente.")}};window.saveMilitaryDistribution=async function(t){try{const e=parseInt(document.getElementById("vehicles-slider").value),a=parseInt(document.getElementById("aircraft-slider").value),s=parseInt(document.getElementById("naval-slider").value),r=e+a+s;if(r!==100){alert(`A soma das distribuições deve ser exatamente 100%! Atual: ${r}%`);return}const o=h.currentUser;if(!o)return;const n=await w(o.uid);if(!n)return;const{db:i}=await Ee(async()=>{const{db:u}=await import("./firebase-BN3MSMQD.js");return{db:u}},__vite__mapDeps([0,1,2]));await i.collection("paises").doc(n).update({MilitaryDistributionVehicles:e,MilitaryDistributionAircraft:a,MilitaryDistributionNaval:s});const l=t.target,c=l.textContent;l.textContent="✓ Salvo!",l.classList.add("bg-green-600"),setTimeout(()=>{l.textContent=c,l.classList.remove("bg-green-600")},2e3),setTimeout(()=>window.location.reload(),1e3)}catch(e){console.error("Erro ao salvar distribuição militar:",e),alert("Erro ao salvar distribuição militar. Tente novamente.")}};let $=null,H=null;async function Xs(){const t=document.getElementById("marketplace-container");if(t)try{const e=h.currentUser;if(!e){t.innerHTML='<div class="text-center py-8 text-slate-400">Faça login para acessar o mercado internacional</div>';return}const a=await w(e.uid);if(!a){t.innerHTML='<div class="text-center py-8 text-slate-400">Você precisa estar associado a um país</div>';return}$||($=new Ie),H||(H=new mt($)),t.innerHTML=`
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

        <!-- Active Trade Relations Section -->
        <div class="bg-bg-soft rounded-xl border border-bg-ring/70 p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h3 class="text-lg font-semibold text-white">🔄 Relações Comerciais Ativas</h3>
              <p class="text-sm text-slate-400">Transações recorrentes automáticas de recursos</p>
            </div>
            <button id="refresh-trade-relations-btn" class="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm rounded-lg transition-colors">
              🔄 Atualizar
            </button>
          </div>

          <!-- Trade Relations Content -->
          <div id="trade-relations-content" class="space-y-4">
            <div class="flex items-center justify-center py-8">
              <div class="text-center">
                <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p class="text-slate-400">Carregando relações comerciais...</p>
              </div>
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
    `,er(),k("all",a),ae(a),ke(a),te(),Tr()}catch(e){console.error("Erro ao carregar marketplace:",e),t.innerHTML='<div class="text-center py-8 text-red-400">Erro ao carregar marketplace</div>'}}function er(){document.querySelectorAll(".marketplace-category-btn").forEach(u=>{u.addEventListener("click",()=>{document.querySelectorAll(".marketplace-category-btn").forEach(p=>{p.classList.remove("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),p.classList.add("bg-bg/50","text-slate-300","border-bg-ring")}),u.classList.add("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),u.classList.remove("bg-bg/50","text-slate-300","border-bg-ring");const m=u.dataset.category,d=h.currentUser;d&&w(d.uid).then(p=>{p&&(Tt(),k(m,p))})})});const t=document.getElementById("marketplace-search"),e=document.getElementById("marketplace-sort"),a=document.getElementById("marketplace-type");t&&t.addEventListener("input",pr(()=>{const u=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",m=h.currentUser;m&&w(m.uid).then(d=>{d&&k(u,d)})},300)),e&&e.addEventListener("change",()=>{const u=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",m=h.currentUser;m&&w(m.uid).then(d=>{d&&k(u,d)})}),a&&a.addEventListener("change",()=>{const u=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",m=h.currentUser;m&&w(m.uid).then(d=>{d&&k(u,d)})});const s=document.getElementById("create-offer-btn");s&&s.addEventListener("click",dr);const r=document.getElementById("view-notifications-btn");r&&r.addEventListener("click",mr);const o=document.getElementById("view-embargoes-btn");o&&o.addEventListener("click",wt);const n=document.getElementById("create-embargo-btn");n&&n.addEventListener("click",_t);const i=document.getElementById("create-test-offers-btn");i&&i.addEventListener("click",async()=>{i.disabled=!0,i.innerHTML="⏳ Criando...";try{const u=await $.createTestOffers();if(u.success)i.innerHTML="✅ Criado!",i.classList.remove("bg-yellow-600","hover:bg-yellow-700"),i.classList.add("bg-green-600"),setTimeout(()=>{const m=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",d=h.currentUser;d&&w(d.uid).then(p=>{p&&k(m,p)}),setTimeout(()=>{i.innerHTML="🧪 Dados Teste",i.classList.remove("bg-green-600"),i.classList.add("bg-yellow-600","hover:bg-yellow-700"),i.disabled=!1},3e3)},1e3);else throw new Error(u.error)}catch(u){console.error("Erro ao criar ofertas de teste:",u),i.innerHTML="❌ Erro",i.classList.remove("bg-yellow-600","hover:bg-yellow-700"),i.classList.add("bg-red-600"),setTimeout(()=>{i.innerHTML="🧪 Dados Teste",i.classList.remove("bg-red-600"),i.classList.add("bg-yellow-600","hover:bg-yellow-700"),i.disabled=!1},3e3)}});const l=document.getElementById("clear-test-offers-btn");l&&l.addEventListener("click",async()=>{if(confirm("Tem certeza que deseja deletar todas as ofertas de teste? Esta ação não pode ser desfeita.")){l.disabled=!0,l.innerHTML="⏳ Limpando...";try{const u=await $.clearTestOffers();if(u.success)l.innerHTML=`✅ ${u.count||0} removidas!`,l.classList.remove("bg-red-600","hover:bg-red-700"),l.classList.add("bg-green-600"),setTimeout(()=>{const m=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",d=h.currentUser;d&&w(d.uid).then(p=>{p&&k(m,p)}),setTimeout(()=>{l.innerHTML="🗑️ Limpar Teste",l.classList.remove("bg-green-600"),l.classList.add("bg-red-600","hover:bg-red-700"),l.disabled=!1},3e3)},1e3);else throw new Error(u.error)}catch(u){console.error("Erro ao limpar ofertas de teste:",u),l.innerHTML="❌ Erro",setTimeout(()=>{l.innerHTML="🗑️ Limpar Teste",l.disabled=!1},3e3)}}});const c=document.getElementById("refresh-trade-relations-btn");c&&c.addEventListener("click",async()=>{const u=h.currentUser;if(u){const m=await w(u.uid);m&&await ae(m)}}),$r()}async function tr(){const t=document.getElementById("intelligence-dashboard-container");if(t)try{const e=window.currentCountry;if(!e){t.innerHTML=`
        <div class="text-center py-12">
          <span class="text-4xl text-red-400 mb-4 block">❌</span>
          <p class="text-red-300">País não encontrado</p>
        </div>
      `;return}const{renderAgencyDashboard:a}=await Ee(async()=>{const{renderAgencyDashboard:s}=await import("./renderer-C5IsPkZP.js").then(r=>r.d);return{renderAgencyDashboard:s}},__vite__mapDeps([3,2,4,5,6,0,1,7]));a(e,t)}catch(e){console.error("Erro ao carregar agência:",e),t.innerHTML=`
      <div class="text-center py-12">
        <span class="text-4xl text-red-400 mb-4 block">❌</span>
        <p class="text-red-300">Erro ao carregar agência de inteligência</p>
        <p class="text-sm text-slate-400 mt-2">${e.message}</p>
      </div>
    `}}async function k(t,e){const a=document.getElementById("marketplace-content");if(a)try{a.innerHTML=`
      <div class="flex items-center justify-center py-12">
        <div class="text-center">
          <div class="animate-spin w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-slate-400">Carregando ofertas...</p>
        </div>
      </div>
    `;const s=document.getElementById("marketplace-search")?.value||"",r=document.getElementById("marketplace-sort")?.value||"date",o=document.getElementById("marketplace-type")?.value||"all",n=parseFloat(document.getElementById("price-min")?.value)||null,i=parseFloat(document.getElementById("price-max")?.value)||null,l=parseInt(document.getElementById("quantity-min")?.value)||null,c=parseInt(document.getElementById("quantity-max")?.value)||null,u=document.getElementById("country-filter")?.value||null,m=parseInt(document.getElementById("time-filter")?.value)||null,d={category:t,type:o,searchTerm:s,current_country_id:e,orderBy:ar(r),orderDirection:sr(r),limit:50,priceMin:n,priceMax:i,quantityMin:l,quantityMax:c,countryFilter:u,timeFilter:m};let p=[],b={success:!0,offers:[]};if(t==="favorites"){const y=qt();if(y.length===0)p=[],b={success:!0,offers:[],totalCount:0};else{const x={...d,category:"all",limit:1e3};b=await $.getOffers(x),b.success&&(p=b.offers.filter(C=>y.includes(C.id)))}}else b=await $.getOffers(d),p=b.offers||[];if(!b.success)throw new Error(b.error);if(p.length===0){const y=await xe(e);a.innerHTML=`
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <h3 class="text-lg font-medium text-white mb-2">Nenhuma oferta encontrada</h3>
          <p class="text-slate-400 mb-6">Não há ofertas disponíveis para os filtros selecionados</p>
          ${y.hasEmbargoes?`
            <div class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 mx-auto max-w-md">
              <div class="flex items-center gap-2 text-red-400 mb-2">
                <span>🚫</span>
                <span class="font-medium">Embargos Ativos</span>
              </div>
              <p class="text-sm text-red-300">
                ${y.totalEmbargoes} país(es) aplicaram embargos contra você,
                limitando ${y.blockedCategories.length>0?"algumas categorias":"todas as trocas"}.
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
      `;return}const f=await xe(e);let v="";f.hasEmbargoes&&(v+=`
        <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-yellow-400 mb-2">
            <span>⚠️</span>
            <span class="font-medium">Aviso de Embargos</span>
          </div>
          <p class="text-sm text-yellow-300">
            Algumas ofertas podem estar ocultas devido a embargos ativos.
            ${f.totalEmbargoes} país(es) aplicaram restrições comerciais.
          </p>
          <button onclick="openEmbargoesModal()" class="mt-2 text-xs px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded hover:bg-yellow-600/30 transition-colors">
            Ver Detalhes
          </button>
        </div>
      `),v+=`
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" id="offers-grid">
        ${p.map(y=>ht(y,e)).join("")}
      </div>

      <!-- Pagination Controls -->
      <div class="mt-8 border-t border-bg-ring/50 pt-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Results Info -->
          <div class="text-sm text-slate-400">
            Mostrando ${p.length} de ${b.totalCount||p.length} ofertas
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
    `,a.innerHTML=v,Br(p),qr(e,t,d)}catch(s){console.error("Erro ao carregar ofertas:",s),a.innerHTML=`
      <div class="text-center py-12 text-red-400">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-medium mb-2">Erro ao carregar ofertas</h3>
        <p class="mb-4">${s.message||"Tente novamente em alguns instantes"}</p>
        <button onclick="auth.currentUser && checkPlayerCountry(auth.currentUser.uid).then(paisId => paisId && loadMarketplaceOffers('${t}', paisId))" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Tentar novamente
        </button>
      </div>
    `}}window.loadMarketplaceOffers=k;function ar(t){switch(t){case"price-low":case"price-high":return"price_per_unit";case"quantity":return"quantity";case"popularity":return"views";case"expires-soon":return"expires_at";case"date":default:return"created_at"}}function sr(t){switch(t){case"price-low":case"expires-soon":return"asc";case"price-high":case"quantity":case"popularity":case"date":default:return"desc"}}async function xe(t){try{if(!t)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const e=await g.collection("marketplace_embargoes").where("target_country_id","==",t).where("status","==","active").get(),a=[];if(e.forEach(o=>{a.push(o.data())}),a.length===0)return{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]};const s=new Set;let r=!1;return a.forEach(o=>{o.type==="full"?(r=!0,s.add("resources"),s.add("vehicles"),s.add("naval")):o.type==="partial"&&o.categories_blocked&&o.categories_blocked.forEach(n=>{s.add(n)})}),{hasEmbargoes:!0,totalEmbargoes:a.length,blockedCategories:Array.from(s),hasFullEmbargo:r,embargoes:a}}catch(e){return console.error("Erro ao verificar embargos:",e),{hasEmbargoes:!1,totalEmbargoes:0,blockedCategories:[]}}}function ht(t,e){const a=h.currentUser,s=a&&(t.player_id===a.uid||t.country_id===e),r=t.expires_at?.toDate?t.expires_at.toDate():new Date(t.expires_at),o=t.quantity*t.price_per_unit,n=Math.max(0,Math.floor((r-new Date)/(1440*60*1e3))),i=t.type==="sell"?{label:"Venda",color:"text-green-400 bg-green-400/20",icon:"💰"}:{label:"Compra",color:"text-blue-400 bg-blue-400/20",icon:"🛒"},l={resources:"🏭",vehicles:"🚗",naval:"🚢"};return`
    <div id="offer-card-${t.id}" class="bg-bg-soft border border-bg-ring/70 rounded-xl p-4 hover:border-brand-400/30 transition-colors cursor-pointer" onclick="openOfferDetails('${t.id}')">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${l[t.category]}</span>
          <span class="px-2 py-1 rounded text-xs font-medium ${i.color}">
            ${i.icon} ${i.label}
          </span>
        </div>
        <div class="text-right text-xs text-slate-400">
          <div>${n} dias restantes</div>
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
          <span class="text-sm font-medium text-brand-400">${E(t.price_per_unit)}</span>
        </div>
        <div class="flex justify-between border-t border-bg-ring/50 pt-2">
          <span class="text-sm font-medium text-slate-300">Valor total:</span>
          <span class="font-semibold text-white">${E(o)}</span>
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
  `}async function rr(t){if(!t||!confirm("Tem certeza que deseja cancelar esta oferta de venda? Os itens serão restituídos ao seu inventário."))return;const e=document.getElementById(`cancel-offer-btn-${t}`);e&&(e.disabled=!0,e.textContent="Cancelando...");try{$||($=new Ie);const a=await $.cancelOffer(t);if(a.success){const s=document.getElementById(`offer-card-${t}`);s&&(s.style.transition="opacity 0.5s ease",s.style.opacity="0",setTimeout(()=>s.remove(),500)),alert("Oferta cancelada com sucesso!")}else throw new Error(a.error||"Erro desconhecido ao cancelar a oferta.")}catch(a){console.error("Erro ao cancelar oferta:",a),alert(`Não foi possível cancelar a oferta: ${a.message}`),e&&(e.disabled=!1,e.textContent="Cancelar")}}window.cancelOffer=rr;async function nr(t){try{$&&$.incrementOfferViews(t);const e=h.currentUser;if(!e){alert("Você precisa estar logado para visualizar detalhes");return}const a=await w(e.uid);if(!a){alert("Você precisa estar associado a um país");return}const r=(await Ke()).find(x=>x.id===a);if(!r){alert("Dados do país não encontrados");return}const o=document.querySelectorAll('[onclick*="openOfferDetails"]');let n=null;try{const x=await $.getOffers({limit:1e3});x.success&&x.offers&&(n=x.offers.find(C=>C.id===t))}catch(x){console.error("Error finding offer:",x)}if(!n){alert("Oferta não encontrada");return}const i=document.getElementById("offer-details-modal");i&&i.remove();const l=document.createElement("div");l.id="offer-details-modal",l.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4";const c=n.player_id===e.uid||n.country_id===a,u=!c&&n.type==="sell"&&n.status==="active",m=!c&&n.type==="buy"&&n.status==="active",d=u||m,p=G(r),b=n.quantity*n.price_per_unit,f=p>=b,v=n.expires_at?.toDate?n.expires_at.toDate():new Date(n.expires_at),y=Math.max(0,Math.ceil((v-new Date)/(1440*60*1e3)));l.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">
                ${n.type==="sell"?"🔥":"💰"}
                ${n.category==="resources"?"🏭":n.category==="vehicles"?"🚗":"🚢"}
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">${n.title}</h2>
                <div class="flex items-center space-x-4 text-sm text-slate-400">
                  <span>${n.country_flag} ${n.country_name}</span>
                  <span>${n.type==="sell"?"Vendendo":"Comprando"}</span>
                  <span>${y} dias restantes</span>
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
                    <span class="text-white">${n.item_name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${n.category==="resources"?"Recursos":n.category==="vehicles"?"Veículos":"Naval"}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade:</span>
                    <span class="text-white font-medium">${n.quantity.toLocaleString()} ${n.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço por ${n.unit.slice(0,-1)}:</span>
                    <span class="text-white font-medium">${M(n.price_per_unit)}</span>
                  </div>
                  <div class="flex justify-between border-t border-bg-ring pt-2 mt-3">
                    <span class="text-slate-400">Valor Total:</span>
                    <span class="text-brand-300 font-bold text-lg">${M(n.total_value)}</span>
                  </div>
                </div>
              </div>

              ${n.description?`
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-2">📝 Descrição</h3>
                <p class="text-slate-300 text-sm">${n.description}</p>
              </div>
              `:""}

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">⚙️ Condições</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Mínima:</span>
                    <span class="text-white">${n.min_quantity||1} ${n.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade Máxima:</span>
                    <span class="text-white">${n.max_quantity||n.quantity} ${n.unit}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tempo de Entrega:</span>
                    <span class="text-white">${n.delivery_time_days||30} dias</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Criado em:</span>
                    <span class="text-white">${new Date(n.created_at?.seconds*1e3||n.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Visualizações:</span>
                    <span class="text-white">${n.views||0}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Países Interessados:</span>
                    <span class="text-white">${n.interested_countries?.length||0}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ações e Compra -->
            <div class="space-y-6">
              ${c?`
                <div class="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <div class="text-blue-400">ℹ️</div>
                    <div>
                      <div class="text-blue-300 font-medium">Esta é sua oferta</div>
                      <div class="text-sm text-slate-300 mt-1">Você não pode interagir com suas próprias ofertas.</div>
                    </div>
                  </div>
                </div>
              `:d?`
                <div class="bg-bg/30 rounded-lg p-4">
                  <h3 class="text-white font-medium mb-4">
                    ${n.type==="sell"?"💰 Comprar Item":"🔥 Vender Item"}
                  </h3>

                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Quantidade Desejada</label>
                      <div class="flex space-x-2">
                        <input type="number" id="transaction-quantity" min="${n.min_quantity||1}" max="${n.max_quantity||n.quantity}" value="${n.min_quantity||1}" class="flex-1 px-3 py-2 bg-bg border border-bg-ring rounded-lg text-white focus:border-brand-400 focus:outline-none">
                        <span class="px-3 py-2 text-slate-400 bg-bg/50 border border-bg-ring rounded-lg">${n.unit}</span>
                      </div>
                      <div class="text-xs text-slate-400 mt-1">
                        Mín: ${n.min_quantity||1} | Máx: ${n.max_quantity||n.quantity}
                      </div>
                    </div>

                    <div id="transaction-summary" class="bg-brand-500/10 border border-brand-400/30 rounded-lg p-3">
                      <div class="text-sm space-y-1">
                        <div class="flex justify-between">
                          <span class="text-slate-400">Quantidade:</span>
                          <span class="text-white"><span id="summary-quantity">${n.min_quantity||1}</span> ${n.unit}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-400">Preço unitário:</span>
                          <span class="text-white">${M(n.price_per_unit)}</span>
                        </div>
                        <div class="flex justify-between font-medium border-t border-brand-400/30 pt-1 mt-2">
                          <span class="text-brand-300">Total a pagar:</span>
                          <span class="text-brand-300" id="summary-total">${M((n.min_quantity||1)*n.price_per_unit)}</span>
                        </div>
                      </div>
                    </div>

                    ${n.type==="sell"&&!f?`
                      <div class="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
                        <div class="flex items-start space-x-2">
                          <div class="text-red-400">⚠️</div>
                          <div>
                            <div class="text-red-300 font-medium">Orçamento Insuficiente</div>
                            <div class="text-sm text-slate-300 mt-1">
                              Disponível: ${M(p)}<br>
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
                      <button onclick="processTransaction('${n.id}')" id="process-transaction-btn" class="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-medium rounded-lg transition-colors ${n.type==="sell"&&!f?"opacity-50 cursor-not-allowed":""}" ${n.type==="sell"&&!f?"disabled":""}>
                        ${n.type==="sell"?"💰 Comprar":"🔥 Vender"}
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
                        ${n.status!=="active"?"Esta oferta não está mais ativa.":"Você não pode interagir com esta oferta."}
                      </div>
                    </div>
                  </div>
                </div>
              `}

              ${n.category==="vehicles"||n.category==="naval"?`
              <!-- Especificações do Equipamento -->
              <div class="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-purple-300 font-medium">⚙️ Especificações Técnicas</h3>
                  <button onclick="openEquipmentDetails('${n.item_id}', '${n.category}', '${n.country_id}')" class="px-3 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-lg hover:bg-purple-600/30 transition-colors">
                    📋 Ver Ficha Completa
                  </button>
                </div>
                <div id="equipment-specs-${n.id}" class="text-sm text-slate-300 space-y-2">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Tipo:</span>
                    <span class="text-white">${n.category==="vehicles"?"🚗 Veículo Terrestre":"🚢 Embarcação Naval"}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Modelo:</span>
                    <span class="text-white">${n.item_name}</span>
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
                  <div class="text-2xl">${n.country_flag}</div>
                  <div>
                    <div class="text-white font-medium">${n.country_name}</div>
                    <div class="text-sm text-slate-400">${n.type==="sell"?"Vendedor":"Comprador"}</div>
                  </div>
                </div>
                <div class="text-sm text-slate-400">
                  Este país ${n.type==="sell"?"está oferecendo":"está procurando"} ${n.item_name.toLowerCase()}
                  ${n.type==="sell"?"para venda":"para compra"} no mercado internacional.
                </div>
              </div>

              <!-- Histórico de Preços (placeholder) -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📈 Informações de Mercado</h3>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-400">Preço Médio de Mercado:</span>
                    <span class="text-white">${M(n.price_per_unit*(.9+Math.random()*.2))}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Esta Oferta:</span>
                    <span class="${n.price_per_unit>n.price_per_unit*1.1?"text-red-300":n.price_per_unit<n.price_per_unit*.9?"text-green-300":"text-yellow-300"}">
                      ${n.price_per_unit>n.price_per_unit*1.1?"📈 Acima":n.price_per_unit<n.price_per_unit*.9?"📉 Abaixo":"📊 Na Média"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,document.body.appendChild(l),or(n,r,a)}catch(e){console.error("Erro ao abrir detalhes da oferta:",e),alert("Erro ao carregar detalhes da oferta")}}function Z(){const t=document.getElementById("offer-details-modal");t&&t.remove()}function or(t,e,a){const s=document.getElementById("offer-details-modal");if(!s)return;const r=s.querySelector("#transaction-quantity");r&&r.addEventListener("input",()=>{ir(t,r.value)}),s.addEventListener("click",o=>{o.target===s&&Z()}),document.addEventListener("keydown",function o(n){n.key==="Escape"&&(Z(),document.removeEventListener("keydown",o))})}function ir(t,e){const a=document.getElementById("offer-details-modal");if(!a)return;const s=a.querySelector("#summary-quantity"),r=a.querySelector("#summary-total");if(s&&r){const o=parseInt(e)||1,n=o*t.price_per_unit;s.textContent=o.toLocaleString(),r.textContent=M(n)}}async function lr(t){try{const e=document.getElementById("offer-details-modal"),a=e.querySelector("#transaction-quantity"),s=e.querySelector("#process-transaction-btn"),r=s.textContent;if(!a){alert("Erro: quantidade não especificada");return}const o=parseInt(a.value);if(!o||o<=0){alert("Por favor, especifique uma quantidade válida"),a.focus();return}const n=h.currentUser;if(!n){alert("Você precisa estar logado");return}if(!await w(n.uid)){alert("Você precisa estar associado a um país");return}const c=(await $.getOffers({limit:1e3})).offers?.find(b=>b.id===t);if(!c){alert("Oferta não encontrada");return}if(o<(c.min_quantity||1)){alert(`Quantidade mínima: ${c.min_quantity||1} ${c.unit}`);return}if(o>(c.max_quantity||c.quantity)){alert(`Quantidade máxima: ${c.max_quantity||c.quantity} ${c.unit}`);return}if(o>c.quantity){alert(`Quantidade disponível: ${c.quantity} ${c.unit}`);return}const u=o*c.price_per_unit,d=`
      Confirmar ${c.type==="sell"?"comprar":"vender"}:

      • Item: ${c.item_name}
      • Quantidade: ${o} ${c.unit}
      • Preço unitário: ${M(c.price_per_unit)}
      • Valor total: ${M(u)}
      • País: ${c.country_name}

      Deseja continuar?
    `;if(!confirm(d))return;s.disabled=!0,s.textContent="⏳ Processando...";const p=await $.createTransaction(t,{quantity:o});if(p.success)s.textContent="✅ Sucesso!",s.classList.remove("bg-brand-500","hover:bg-brand-600"),s.classList.add("bg-green-600"),setTimeout(()=>{alert("Transação criada com sucesso! A negociação foi iniciada."),Z();const b=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all",f=h.currentUser;f&&w(f.uid).then(v=>{v&&k(b,v)})},1500);else throw new Error(p.error||"Erro desconhecido ao processar transação")}catch(e){console.error("Erro ao processar transação:",e);const a=document.querySelector("#process-transaction-btn");a&&(a.textContent="❌ Erro",a.classList.remove("bg-brand-500","hover:bg-brand-600"),a.classList.add("bg-red-600"),setTimeout(()=>{a.textContent=offer.type==="sell"?"💰 Comprar":"🔥 Vender",a.classList.remove("bg-red-600"),a.classList.add("bg-brand-500","hover:bg-brand-600"),a.disabled=!1},3e3)),alert("Erro ao processar transação: "+e.message)}}async function cr(t,e,a){try{console.log("Abrindo detalhes do equipamento:",{itemId:t,category:e,countryId:a});const s=await $.getCountryInventory(a);let r=null,o=null;if(Object.keys(s).forEach(l=>{s[l]&&typeof s[l]=="object"&&Object.keys(s[l]).forEach(c=>{const u=s[l][c];u&&typeof u=="object"&&(`${l}_${c}`.toLowerCase().replace(/\s+/g,"_")===t||c.toLowerCase().includes(t.toLowerCase()))&&(r=u,o=l,r.name=c,r.category=l)})}),!r){alert("Equipamento não encontrado no inventário do país vendedor.");return}const n=document.getElementById("equipment-details-modal");n&&n.remove();const i=document.createElement("div");i.id="equipment-details-modal",i.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4",i.innerHTML=`
      <div class="bg-bg-soft border border-bg-ring rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-bg-ring/50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">${e==="vehicles"?"🚗":"🚢"}</div>
              <div>
                <h2 class="text-xl font-bold text-white">${r.name}</h2>
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
                    <span class="text-white">${r.name}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Categoria:</span>
                    <span class="text-white">${o}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Quantidade no Inventário:</span>
                    <span class="text-white">${r.quantity||0} unidades</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo Total de Produção:</span>
                    <span class="text-white">${M(r.cost||0)}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-400">Custo de Manutenção/Mês:</span>
                    <span class="text-white">${M((r.cost||0)*.05)}</span>
                  </div>
                </div>
              </div>

              ${r.components?`
              <!-- Componentes -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">🔧 Componentes</h3>
                <div class="space-y-3 text-sm">
                  ${Object.entries(r.components).map(([l,c])=>`
                    <div class="bg-bg/50 rounded p-3">
                      <div class="flex justify-between items-start">
                        <div>
                          <div class="text-brand-300 font-medium">${l.replace(/_/g," ").toUpperCase()}</div>
                          <div class="text-slate-300">${c.name||"N/A"}</div>
                        </div>
                        <div class="text-right">
                          <div class="text-slate-400 text-xs">Custo</div>
                          <div class="text-white">${M(c.cost||0)}</div>
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
              ${r.stats?`
              <!-- Estatísticas -->
              <div class="bg-bg/30 rounded-lg p-4">
                <h3 class="text-white font-medium mb-3">📊 Estatísticas</h3>
                <div class="space-y-3">
                  ${Object.entries(r.stats).map(([l,c])=>`
                    <div class="flex justify-between items-center">
                      <span class="text-slate-400">${l.replace(/_/g," ")}:</span>
                      <div class="flex items-center space-x-2">
                        <span class="text-white">${typeof c=="number"?c.toLocaleString():c}</span>
                        ${typeof c=="number"&&c>0?`
                          <div class="bg-bg w-16 h-2 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style="width: ${Math.min(100,c/100*100)}%"></div>
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
                    <span class="text-white">${Math.floor((r.quantity||0)*.5)} unidades (50% max)</span>
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
    `,document.body.appendChild(i),i.addEventListener("click",l=>{l.target===i&&he()}),document.addEventListener("keydown",function l(c){c.key==="Escape"&&(he(),document.removeEventListener("keydown",l))})}catch(s){console.error("Erro ao abrir detalhes do equipamento:",s),alert("Erro ao carregar detalhes do equipamento")}}function he(){const t=document.getElementById("equipment-details-modal");t&&t.remove()}window.openOfferDetails=nr;window.openEquipmentDetails=cr;window.closeEquipmentDetailsModal=he;window.closeOfferDetailsModal=Z;window.processTransaction=lr;async function dr(){try{const t=h.currentUser;if(!t){alert("Você precisa estar logado para criar ofertas");return}const e=await w(t.uid);if(!e){alert("Você precisa estar associado a um país");return}window.paisId=e,H||($||($=new Ie),H=new mt($)),await H.openSelectionModal()}catch(t){console.error("Erro ao abrir modal de criação:",t),alert("Erro ao abrir formulário de criação de ofertas")}}function ur(){const t=document.getElementById("create-offer-modal"),e=document.getElementById("resource-sell-modal");t&&t.remove(),e&&e.remove()}window.closeCreateOfferModal=ur;function pr(t,e){let a;return function(...r){const o=()=>{clearTimeout(a),t(...r)};clearTimeout(a),a=setTimeout(o,e)}}async function mr(){try{const t=h.currentUser;if(!t)return;const e=await w(t.uid);if(!e)return;const a=document.createElement("div");a.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="notifications-modal",a.innerHTML=`
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
    `,document.body.appendChild(a),br(e),await gr(e)}catch(t){console.error("Erro ao abrir modal de notificações:",t)}}function ye(){const t=document.getElementById("notifications-modal");t&&t.remove()}function br(t){const e=document.getElementById("notifications-modal");if(!e)return;const a=e.querySelectorAll(".notification-filter-btn");a.forEach(s=>{s.addEventListener("click",()=>{a.forEach(o=>{o.classList.remove("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),o.classList.add("bg-bg/50","text-slate-300","border-bg-ring")}),s.classList.add("active","bg-brand-500/20","text-brand-400","border-brand-400/30"),s.classList.remove("bg-bg/50","text-slate-300","border-bg-ring");const r=s.dataset.filter;ee(r)})}),e.addEventListener("click",s=>{s.target===e&&ye()}),document.addEventListener("keydown",function s(r){r.key==="Escape"&&(ye(),document.removeEventListener("keydown",s))})}let T=[];async function gr(t){try{const e=await g.collection("notifications").where("target_country_id","==",t).orderBy("created_at","desc").limit(50).get();T=[],e.forEach(a=>{T.push({id:a.id,...a.data()})}),yt(T)}catch(e){console.error("Erro ao carregar notificações:",e);const a=document.getElementById("notifications-list");a&&(a.innerHTML=`
        <div class="text-center py-8 text-red-400">
          <div class="text-4xl mb-2">❌</div>
          <p>Erro ao carregar notificações</p>
        </div>
      `)}}function yt(t){const e=document.getElementById("notifications-list");if(e){if(t.length===0){e.innerHTML=`
      <div class="text-center py-8 text-slate-400">
        <div class="text-4xl mb-2">📪</div>
        <p>Nenhuma notificação encontrada</p>
      </div>
    `;return}e.innerHTML=t.map(a=>fr(a)).join("")}}function fr(t){const e=!t.read,a=t.created_at?.toDate?t.created_at.toDate():new Date(t.created_at),s=yr(a),r={embargo_applied:"🚫",embargo_lifted:"✅",transaction_created:"💰",transaction_completed:"✅",trade_offer:"📦",diplomatic:"🏛️"},o={embargo_applied:"border-red-400/30 bg-red-400/10",embargo_lifted:"border-green-400/30 bg-green-400/10",transaction_created:"border-blue-400/30 bg-blue-400/10",transaction_completed:"border-green-400/30 bg-green-400/10",trade_offer:"border-yellow-400/30 bg-yellow-400/10",diplomatic:"border-purple-400/30 bg-purple-400/10"},n=r[t.type]||"📬";return`
    <div class="notification-item bg-bg border ${o[t.type]||"border-slate-400/30 bg-slate-400/10"} rounded-lg p-4 ${e?"border-l-4 border-l-brand-400":""}"
         data-type="${t.type}" data-read="${t.read?"true":"false"}">
      <div class="flex items-start justify-between">
        <div class="flex items-start space-x-3 flex-1">
          <div class="text-2xl">${n}</div>
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
  `}function ee(t){let e=T;t==="unread"?e=T.filter(a=>!a.read):t==="embargo"?e=T.filter(a=>a.type&&a.type.includes("embargo")):t==="transaction"&&(e=T.filter(a=>a.type&&a.type.includes("transaction"))),yt(e)}async function vr(t){try{await g.collection("notifications").doc(t).update({read:!0,read_at:new Date});const e=T.find(s=>s.id===t);e&&(e.read=!0);const a=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";ee(a),await te()}catch(e){console.error("Erro ao marcar notificação como lida:",e)}}async function xr(){try{const t=h.currentUser;if(!t||!await w(t.uid))return;const a=g.batch();T.forEach(r=>{if(!r.read){const o=g.collection("notifications").doc(r.id);a.update(o,{read:!0,read_at:new Date}),r.read=!0}}),await a.commit();const s=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";ee(s),await te()}catch(t){console.error("Erro ao marcar todas as notificações como lidas:",t)}}async function hr(t){try{if(!confirm("Tem certeza que deseja excluir esta notificação?"))return;await g.collection("notifications").doc(t).delete(),T=T.filter(a=>a.id!==t);const e=document.querySelector(".notification-filter-btn.active")?.dataset.filter||"all";ee(e),await te()}catch(e){console.error("Erro ao excluir notificação:",e)}}async function te(){try{const t=h.currentUser;if(!t)return;const e=await w(t.uid);if(!e)return;const s=(await g.collection("notifications").where("target_country_id","==",e).where("read","==",!1).get()).size,r=document.getElementById("notifications-count-badge");r&&(s>0?(r.textContent=s>99?"99+":s.toString(),r.classList.remove("hidden")):r.classList.add("hidden"))}catch(t){console.error("Erro ao atualizar contador de notificações:",t)}}function yr(t){const a=new Date-t,s=Math.floor(a/(1e3*60)),r=Math.floor(a/(1e3*60*60)),o=Math.floor(a/(1e3*60*60*24));return s<1?"Agora há pouco":s<60?`${s} min atrás`:r<24?`${r}h atrás`:o<7?`${o} dias atrás`:t.toLocaleDateString("pt-BR")}window.closeNotificationsModal=ye;window.markNotificationAsRead=vr;window.markAllNotificationsAsRead=xr;window.deleteNotification=hr;window.openEmbargoesModal=wt;window.closeEmbargoesModal=wr;window.openCreateEmbargoModal=_t;window.closeCreateEmbargoModal=Ct;window.liftEmbargo=Cr;async function wt(){try{const t=h.currentUser;if(!t)return;const e=await w(t.uid);if(!e)return;const a=document.createElement("div");a.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",a.id="embargoes-modal",a.innerHTML=`
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
    `,document.body.appendChild(a),await Et(e)}catch(t){console.error("Erro ao abrir modal de embargos:",t)}}async function Et(t){try{const e=await g.collection("marketplace_embargoes").where("embargo_country_id","==",t).where("status","==","active").orderBy("created_at","desc").get(),a=await g.collection("marketplace_embargoes").where("target_country_id","==",t).where("status","==","active").orderBy("created_at","desc").get(),s=[],r=[];e.forEach(i=>{s.push({id:i.id,...i.data()})}),a.forEach(i=>{r.push({id:i.id,...i.data()})});const o=document.getElementById("applied-embargoes-list");o&&(s.length===0?o.innerHTML=`
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">🕊️</div>
            <p>Nenhum embargo aplicado</p>
          </div>
        `:o.innerHTML=s.map(i=>We(i,"applied")).join(""));const n=document.getElementById("received-embargoes-list");n&&(r.length===0?n.innerHTML=`
          <div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-2">✅</div>
            <p>Nenhum embargo recebido</p>
          </div>
        `:n.innerHTML=r.map(i=>We(i,"received")).join(""))}catch(e){console.error("Erro ao carregar dados de embargos:",e)}}function We(t,e){const a=t.expires_at&&new Date(t.expires_at.toDate?t.expires_at.toDate():t.expires_at)<new Date(Date.now()+6048e5),s=e==="applied"?t.target_country_name:t.embargo_country_name,r=e==="applied"?"🎯":"⚠️",o=t.type==="full"?{label:"Total",color:"text-red-400 bg-red-400/20"}:{label:"Parcial",color:"text-yellow-400 bg-yellow-400/20"},n=t.created_at?.toDate?t.created_at.toDate():new Date(t.created_at),i=Math.floor((new Date-n)/(1440*60*1e3));return`
    <div class="bg-bg border border-bg-ring/70 rounded-lg p-4 ${a?"border-yellow-400/30":""}">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-lg">${r}</span>
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
            ${t.categories_blocked.map(l=>{const c={resources:"🏭",vehicles:"🚗",naval:"🚢"},u={resources:"Recursos",vehicles:"Veículos",naval:"Naval"};return`<span class="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">${c[l]} ${u[l]}</span>`}).join("")}
          </div>
        </div>
      `:""}

      <div class="flex justify-between text-xs text-slate-500">
        <span>Há ${i} dias</span>
        ${t.expires_at?`
          <span class="${a?"text-yellow-400":""}">
            Expira ${t.expires_at?"em breve":"indefinido"}
          </span>
        `:"<span>Indefinido</span>"}
      </div>
    </div>
  `}function wr(){const t=document.getElementById("embargoes-modal");t&&t.remove()}async function _t(){try{const t=h.currentUser;if(!t)return;const e=await w(t.uid);if(!e)return;const a=await g.collection("paises").get(),s=[];a.forEach(o=>{const n=o.data();o.id!==e&&s.push({id:o.id,name:n.Pais,flag:n.Flag||"🏳️"})});const r=document.createElement("div");r.className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4",r.id="create-embargo-modal",r.innerHTML=`
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
    `,document.body.appendChild(r),Er()}catch(t){console.error("Erro ao abrir modal de criar embargo:",t)}}function Er(){const t=document.querySelectorAll('input[name="embargo-type"]'),e=document.getElementById("categories-section");t.forEach(s=>{s.addEventListener("change",()=>{s.value==="partial"?e.classList.remove("hidden"):e.classList.add("hidden")})});const a=document.getElementById("create-embargo-form");a&&a.addEventListener("submit",_r)}async function _r(t){t.preventDefault();try{const e=new FormData(t.target),a=document.getElementById("target-country").value,s=e.get("embargo-type"),r=document.getElementById("embargo-reason").value,o=document.getElementById("embargo-duration").value;if(!a){alert("Selecione um país alvo");return}let n=[];if(s==="partial"){const d=document.querySelectorAll('input[name="blocked-categories"]:checked');if(n=Array.from(d).map(p=>p.value),n.length===0){alert("Selecione pelo menos uma categoria para embargo parcial");return}}let i=null;o&&(i=new Date(Date.now()+parseInt(o)*24*60*60*1e3));const l={target_country_id:a,type:s,categories_blocked:n,reason:r||"Motivos diplomáticos",expires_at:i},c=t.target.querySelector('button[type="submit"]'),u=c.textContent;c.textContent="Aplicando...",c.disabled=!0;const m=await $.applyEmbargo(l);if(m.success){alert("Embargo aplicado com sucesso!"),Ct();const d=h.currentUser;if(d){const p=await w(d.uid);if(p){const b=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all";k(b,p),ke(p)}}}else throw new Error(m.error)}catch(e){console.error("Erro ao aplicar embargo:",e),alert(`Erro ao aplicar embargo: ${e.message}`);const a=t.target.querySelector('button[type="submit"]');a.textContent="Aplicar Embargo",a.disabled=!1}}function Ct(){const t=document.getElementById("create-embargo-modal");t&&t.remove()}async function Cr(t){try{if(!confirm("Tem certeza que deseja suspender este embargo?"))return;await g.collection("marketplace_embargoes").doc(t).update({status:"lifted",updated_at:new Date}),alert("Embargo suspenso com sucesso!");const e=h.currentUser;if(e){const a=await w(e.uid);if(a){await Et(a);const s=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all";k(s,a),ke(a)}}}catch(e){console.error("Erro ao suspender embargo:",e),alert(`Erro ao suspender embargo: ${e.message}`)}}async function ke(t){try{const e=await xe(t),a=document.getElementById("embargo-status-indicator"),s=document.getElementById("embargo-count-badge");if(!a||!s)return;if(e.hasEmbargoes){const r=e.hasFullEmbargo?"todas as categorias":`${e.blockedCategories.length} categoria(s)`;a.innerHTML=`
        <div class="flex items-center gap-2 text-red-400 text-sm">
          <span class="animate-pulse">⚠️</span>
          <span>${e.totalEmbargoes} embargo(s) ativo(s) bloqueando ${r}</span>
        </div>
      `,s.textContent=e.totalEmbargoes,s.classList.remove("hidden")}else a.innerHTML=`
        <div class="flex items-center gap-2 text-green-400 text-sm">
          <span>✅</span>
          <span>Nenhum embargo ativo</span>
        </div>
      `,s.classList.add("hidden")}catch(e){console.error("Erro ao atualizar indicador de embargo:",e)}}function $r(){const t=document.getElementById("toggle-advanced-filters"),e=document.getElementById("advanced-filters-panel"),a=document.getElementById("advanced-filters-icon");t&&e&&a&&t.addEventListener("click",()=>{e.classList.toggle("hidden"),a.classList.toggle("rotate-180")});const s=document.getElementById("apply-filters-btn"),r=document.getElementById("clear-filters-btn"),o=document.getElementById("save-filters-btn");s&&s.addEventListener("click",$t),r&&r.addEventListener("click",Mr),o&&o.addEventListener("click",Ir),kr()}async function $t(){const t=h.currentUser;if(!t)return;const e=await w(t.uid);if(!e)return;Tt();const a=document.querySelector(".marketplace-category-btn.active")?.dataset.category||"all";await k(a,e)}function Mr(){document.getElementById("marketplace-search").value="",document.getElementById("marketplace-sort").value="date",document.getElementById("marketplace-type").value="all",document.getElementById("price-min").value="",document.getElementById("price-max").value="",document.getElementById("quantity-min").value="",document.getElementById("quantity-max").value="",document.getElementById("country-filter").value="",document.getElementById("time-filter").value="",$t()}function Ir(){const t={search:document.getElementById("marketplace-search").value,sort:document.getElementById("marketplace-sort").value,type:document.getElementById("marketplace-type").value,priceMin:document.getElementById("price-min").value,priceMax:document.getElementById("price-max").value,quantityMin:document.getElementById("quantity-min").value,quantityMax:document.getElementById("quantity-max").value,country:document.getElementById("country-filter").value,timeFilter:document.getElementById("time-filter").value};localStorage.setItem("marketplace-filters",JSON.stringify(t));const e=document.getElementById("save-filters-btn"),a=e.textContent;e.textContent="✅ Salvo!",e.disabled=!0,setTimeout(()=>{e.textContent=a,e.disabled=!1},2e3)}function kr(){try{const t=localStorage.getItem("marketplace-filters");if(!t)return;const e=JSON.parse(t);e.search&&(document.getElementById("marketplace-search").value=e.search),e.sort&&(document.getElementById("marketplace-sort").value=e.sort),e.type&&(document.getElementById("marketplace-type").value=e.type),e.priceMin&&(document.getElementById("price-min").value=e.priceMin),e.priceMax&&(document.getElementById("price-max").value=e.priceMax),e.quantityMin&&(document.getElementById("quantity-min").value=e.quantityMin),e.quantityMax&&(document.getElementById("quantity-max").value=e.quantityMax),e.country&&(document.getElementById("country-filter").value=e.country),e.timeFilter&&(document.getElementById("time-filter").value=e.timeFilter)}catch(t){console.error("Erro ao carregar filtros salvos:",t)}}async function Tr(){try{const t=await g.collection("paises").get(),e=document.getElementById("country-filter");if(!e)return;for(;e.children.length>1;)e.removeChild(e.lastChild);const a=[];t.forEach(s=>{const r=s.data();a.push({id:s.id,name:r.Pais,flag:r.Flag||"🏳️"})}),a.sort((s,r)=>s.name.localeCompare(r.name)),a.forEach(s=>{const r=document.createElement("option");r.value=s.id,r.textContent=`${s.flag} ${s.name}`,e.appendChild(r)})}catch(t){console.error("Erro ao carregar países para filtro:",t)}}let we=1,O=!1,U=!1,X=null;function qr(t,e,a){const s=document.getElementById("load-more-btn"),r=document.getElementById("infinite-scroll-toggle"),o=document.getElementById("infinite-scroll-icon");X={...a,countryId:t,category:e},s&&s.addEventListener("click",()=>{Mt()}),r&&o&&(r.addEventListener("click",()=>{O=!O,O?(o.textContent="♾️",r.title="Carregamento automático ativado",Sr()):(o.textContent="🔄",r.title="Carregamento automático desativado",It()),localStorage.setItem("marketplace-infinite-scroll",O)}),localStorage.getItem("marketplace-infinite-scroll")==="true"&&r.click())}async function Mt(){if(U||!X)return;U=!0;const t=document.getElementById("load-more-btn"),e=document.getElementById("load-more-state"),a=document.getElementById("offers-grid");t&&(t.disabled=!0),e&&e.classList.remove("hidden");try{we++;const s={...X,limit:20,offset:(we-1)*20},r=await $.getOffers(s);if(r.success&&r.offers.length>0){const o=r.offers.map(l=>ht(l)).join("");a&&(a.innerHTML+=o);const n=a?.children.length||0,i=document.querySelector(".text-sm.text-slate-400");i&&(i.textContent=`Mostrando ${n} ofertas`),r.offers.length<20&&t&&(t.textContent="✅ Todas as ofertas carregadas",t.disabled=!0)}else t&&(t.textContent="✅ Todas as ofertas carregadas",t.disabled=!0)}catch(s){console.error("Erro ao carregar mais ofertas:",s),t&&(t.disabled=!1)}finally{U=!1,e&&e.classList.add("hidden")}}function Sr(){It(),window.addEventListener("scroll",kt)}function It(){window.removeEventListener("scroll",kt)}function kt(){if(!O||U)return;const t=window.innerHeight+window.scrollY,e=document.documentElement.offsetHeight;if(t>=e-200){const s=document.getElementById("load-more-btn");s&&!s.disabled&&Mt()}}function Tt(){we=1,U=!1,X=null}function qt(){try{const t=localStorage.getItem("marketplace-favorites");return t?JSON.parse(t):[]}catch(t){return console.error("Erro ao carregar favoritos:",t),[]}}function Lr(t){return qt().includes(t)}function Br(t){t.forEach(e=>{const a=document.getElementById(`favorite-btn-${e.id}`),s=document.getElementById(`favorite-icon-${e.id}`);a&&s&&(Lr(e.id)?(a.classList.remove("bg-slate-600/20","text-slate-400"),a.classList.add("bg-yellow-500/20","text-yellow-400"),a.title="Remover dos favoritos",s.textContent="🌟"):(a.classList.remove("bg-yellow-500/20","text-yellow-400"),a.classList.add("bg-slate-600/20","text-slate-400"),a.title="Adicionar aos favoritos",s.textContent="⭐"))})}async function ae(t){const e=document.getElementById("trade-relations-content");if(e)try{const a=await g.collection("marketplace_transactions").where("seller_country_id","==",t).where("status","==","pending").get(),s=await g.collection("marketplace_transactions").where("buyer_country_id","==",t).where("status","==","pending").get(),r=[],o=[];if(a.forEach(i=>r.push({id:i.id,...i.data()})),s.forEach(i=>o.push({id:i.id,...i.data()})),r.length===0&&o.length===0){e.innerHTML=`
        <div class="text-center py-8 text-slate-400">
          <div class="text-4xl mb-2">🌐</div>
          <p>Nenhuma relação comercial ativa</p>
          <p class="text-xs mt-2">Crie ofertas de recursos para estabelecer comércio automático</p>
        </div>
      `;return}let n='<div class="space-y-4">';r.length>0&&(n+=`
        <div>
          <h4 class="text-sm font-semibold text-brand-400 mb-3">💰 Minhas Vendas Ativas (${r.length})</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${r.map(i=>Je(i,"sell")).join("")}
          </div>
        </div>
      `),o.length>0&&(n+=`
        <div>
          <h4 class="text-sm font-semibold text-blue-400 mb-3">🛒 Minhas Compras Ativas (${o.length})</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${o.map(i=>Je(i,"buy")).join("")}
          </div>
        </div>
      `),n+="</div>",e.innerHTML=n}catch(a){console.error("Erro ao carregar relações comerciais:",a),e.innerHTML=`
      <div class="text-center py-8 text-red-400">
        <div class="text-4xl mb-2">⚠️</div>
        <p>Erro ao carregar relações comerciais</p>
        <p class="text-xs mt-2">${a.message}</p>
      </div>
    `}}function Je(t,e){const a=e==="sell"?"text-brand-400":"text-blue-400",s=e==="sell"?"💰":"🛒",r=e==="sell"?"Vendendo para":"Comprando de",o=e==="sell"?"Venda Recorrente":"Compra Recorrente",n=e==="sell"?t.buyer_country_name:t.seller_country_name;return`
    <div class="bg-bg border border-bg-ring/70 rounded-lg p-4 hover:border-brand-400/30 transition-colors">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="text-2xl">${s}</span>
          <div>
            <h5 class="font-medium text-white">${t.item_name}</h5>
            <p class="text-xs ${a}">${o}</p>
          </div>
        </div>
        <span class="text-green-400 text-xs">🔄 Recorrente</span>
      </div>

      <div class="space-y-2 text-sm">
        <!-- Parceiro Comercial -->
        <div class="bg-bg-soft rounded p-2 border border-bg-ring/30 mb-3">
          <p class="text-xs text-slate-400 mb-1">${r}:</p>
          <p class="text-white font-medium">🇺🇳 ${n}</p>
          <p class="text-xs text-green-400 mt-1">✅ Executando a cada turno</p>
        </div>

        <div class="flex justify-between">
          <span class="text-slate-400">Quantidade:</span>
          <span class="text-white font-medium">${t.quantity.toLocaleString()} ${t.unit}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Preço/unidade:</span>
          <span class="text-white font-medium">$${t.price_per_unit.toLocaleString()}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Valor total/turno:</span>
          <span class="text-brand-400 font-medium">$${t.total_value.toLocaleString()}</span>
        </div>
      </div>

      <div class="mt-4 flex gap-2">
        <button onclick="viewTransactionDetails('${t.id}')" class="flex-1 px-3 py-2 bg-slate-600/20 hover:bg-slate-600/30 text-slate-300 text-xs rounded transition-colors">
          👁️ Ver Detalhes
        </button>
        <button onclick="cancelTransaction('${t.id}')" class="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs rounded transition-colors">
          ❌ Cancelar
        </button>
      </div>
    </div>
  `}async function Dr(t){if(confirm("Tem certeza que deseja cancelar esta transação? Esta ação não pode ser desfeita."))try{await g.collection("marketplace_transactions").doc(t).update({status:"cancelled",updated_at:new Date}),alert("✅ Transação cancelada com sucesso!");const e=h.currentUser;if(e){const a=await w(e.uid);a&&await ae(a)}}catch(e){console.error("Erro ao cancelar transação:",e),alert("❌ Erro ao cancelar: "+e.message)}}async function Ar(t){try{const e=await g.collection("marketplace_transactions").doc(t).get();if(!e.exists){alert("Transação não encontrada");return}const a=e.data();alert(`
📦 Detalhes da Transação

Item: ${a.item_name}
Quantidade: ${a.quantity} ${a.unit}
Preço/unidade: $${a.price_per_unit.toLocaleString()}
Valor Total: $${a.total_value.toLocaleString()}

Vendedor: ${a.seller_country_name}
Comprador: ${a.buyer_country_name}

Status: ${a.status}
Data de criação: ${new Date(a.created_at?.toDate?a.created_at.toDate():a.created_at).toLocaleDateString()}
Prazo de entrega: ${new Date(a.delivery_deadline?.toDate?a.delivery_deadline.toDate():a.delivery_deadline).toLocaleDateString()}
    `.trim())}catch(e){console.error("Erro ao buscar detalhes:",e),alert("❌ Erro ao carregar detalhes: "+e.message)}}window.loadTradeRelations=ae;window.cancelTransaction=Dr;window.viewTransactionDetails=Ar;document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qe):Qe();
