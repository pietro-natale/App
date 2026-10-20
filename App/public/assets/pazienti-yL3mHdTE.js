import"./modulepreload-polyfill-B5Qt9EMX.js";import{a as w,t as U,B as Vt,b as F,c as ht,p as ge,F as pa,d as nt,e as ve,i as fe,s as he,f as be,l as ta,g as ye,S as $e,h as we,j as Se,k as Le}from"./stile-zONvCFoU.js";import{T as aa,W as _a,a as Ma,U as za,S as St}from"./recapiti-Cq6GENb5.js";const K=()=>!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform()),G=t=>window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins[t]||null,st=()=>window.Capacitor&&window.Capacitor.getPlatform?window.Capacitor.getPlatform():"android";function Ee(t){if(!t||typeof t!="string")return;const a=t.indexOf("#");if(a>=0){location.hash=t.slice(a);return}const e=t.replace(/^\/pazienti(\.html)?\/?/,"/");e.startsWith("/")&&e.length>1&&!e.includes(".html")&&(location.hash="#"+e)}let ma=!1,qa=!1;async function Ca(){const t=G("PushNotifications");if(!(!t||!t.removeAllDeliveredNotifications)&&!(st()==="ios"&&!qa))try{await t.removeAllDeliveredNotifications()}catch{}}async function Da(t){const a=G("PushNotifications");if(a){if(!ma&&(ma=!0,a.addListener("registration",async e=>{qa=!0,Ca();try{await w.dispositivoPush({piattaforma:st(),token:e.value,versione:t&&t.versione||""}),localStorage.setItem("push-nativo-token",e.value)}catch{}}),a.addListener("registrationError",e=>console.warn("notifiche native:",e&&e.error)),a.addListener("pushNotificationActionPerformed",e=>{Ee(e&&e.notification&&e.notification.data&&e.notification.data.apri)}),st()==="android"&&a.createChannel))try{await a.createChannel({id:"promemoria",name:"Promemoria dello studio",description:"Appuntamenti, diario e messaggi dello studio",importance:5,visibility:1,vibration:!0})}catch{}await a.register()}}async function Na(){const t=G("PushNotifications");if(!t)return"impossibile";try{const a=await t.checkPermissions();return a.receive==="granted"?localStorage.getItem("push-nativo-token")?"attive":"spente":a.receive==="denied"?"negate":"spente"}catch{return"impossibile"}}async function Pa(t){const a=G("PushNotifications");if(!a)return"impossibile";let e=await a.checkPermissions();return(e.receive==="prompt"||e.receive==="prompt-with-rationale")&&(e=await a.requestPermissions()),e.receive!=="granted"?e.receive==="denied"?"negate":"spente":(await Da(t),"attive")}async function Ie(){const t=localStorage.getItem("push-nativo-token");if(t){try{await w.dispositivoPush({token:t},!0)}catch{}localStorage.removeItem("push-nativo-token")}const a=G("PushNotifications");if(a&&a.unregister)try{await a.unregister()}catch{}return"spente"}async function Ae(t){if(!K())return;document.documentElement.classList.add("app-nativa","app-"+st()),Ba()&&document.documentElement.classList.add("stampa-nativa"),window.__vibra=ze;try{const i=G("PushNotifications");i&&(await i.checkPermissions()).receive==="granted"&&await Da(t)}catch(i){console.warn("notifiche native non disponibili:",i&&i.message)}const a=G("StatusBar");if(a)try{await a.setStyle({style:"LIGHT"})}catch{}const e=G("App");e&&e.addListener&&(e.addListener("appStateChange",async i=>{if(!(!i||!i.isActive)){try{await w.svuotaCoda()}catch{}await Ca();try{window.dispatchEvent(new CustomEvent("app-in-primo-piano"))}catch{}}}),e.addListener("backButton",({canGoBack:i})=>{const n=document.querySelector("#altro-velo:not([hidden])");if(n){n.hidden=!0;return}const l=document.querySelector(".foto-velo");if(l){l.click();return}const o=location.hash.replace(/^#/,"")||"/";if(o==="/"||o==="/oggi"){e.exitApp&&e.exitApp();return}if(t&&typeof t.indietro=="function"){t.indietro();return}i?history.back():e.exitApp&&e.exitApp()}))}async function ea(t){const a=!!(t&&t.soloQui),e=G("Documento");if(e&&st()==="android")try{await e.pulisci()}catch{}const i=G("WatchPonte");let n=null;if(i){if(!a)try{n=await i.stato()}catch{}try{await i.rimuovi()}catch{}}window.__orologioToken="";const l=localStorage.getItem(Mt)||n&&n.token||"";if(!a&&(l||n&&n.supportato!==!1&&n.abbinato!==!1))try{await w.orologio({token:l,piattaforma:st()==="ios"?"apple":"wear"},!0)}catch{}localStorage.removeItem(Mt);const o=localStorage.getItem("push-nativo-token");if(o){if(!a)try{await w.dispositivoPush({token:o},!0)}catch{}localStorage.removeItem("push-nativo-token")}}const Mt="orologio-token";async function ke(){const t=G("WatchPonte");if(!t)return;const a=U.leggi();if(!a||window.__orologioToken===a||window.__orologioDopo&&Date.now()<window.__orologioDopo)return;window.__orologioToken=a;let e=null;try{e=await t.stato()}catch{}if(e&&e.supportato===!1)return;if(e&&e.abbinato===!1&&e.attivo!==!1){window.__orologioToken="",window.__orologioDopo=Date.now()+5*6e4;return}const i=sessionStorage.getItem("nome")||"",n=localStorage.getItem(Mt)||e&&e.token||"";let l=null,o=!1;try{l=await w.orologio({attuale:n,piattaforma:st()==="ios"?"apple":"wear"})}catch(s){o=/Richiesta non riconosciuta/i.test(String(s&&s.message||""))}if(!l||!l.token){if(U.leggi()!==a){window.__orologioToken="";return}if(o){try{await t.aggiorna({token:a,api:Vt,nome:i})}catch{window.__orologioToken=""}return}window.__orologioToken="",window.__orologioDopo=Date.now()+5*6e4;return}localStorage.setItem(Mt,l.token);try{await t.aggiorna({token:l.token,api:Vt,nome:i})}catch{window.__orologioToken=""}}async function xa({titolo:t,testo:a}){const e=G("Share");if(e)try{return await e.share({title:t,text:a,dialogTitle:t}),!0}catch{return!1}if(navigator.share)try{return await navigator.share({title:t,text:a}),!0}catch{return!1}try{return await navigator.clipboard.writeText(a),await F("Testo copiato: incollalo dove vuoi."),!0}catch{return await ht("Copia il testo:",{valore:a,righe:4,ok:"Fatto"}),!1}}async function Ha(t){const a=G("Browser");if(a&&a.open)try{await a.open({url:t});return}catch{}window.open(t,"_blank")}async function Te({url:t,nome:a,mime:e}){const i=G("Documento");if(K()&&i&&i.apri){const n=await i.apri({url:t,nome:String(a||"Documento"),mime:String(e||"")});return!(n&&n.aperto===!1)}return await Ha(t),!0}function Ba(){return K()&&!!G("Stampa")}async function _e(t){const a=G("Stampa");if(!K()||!a||!a.stampa)return!1;try{await a.stampa({nome:String(t||"Stampa")})}catch(e){await F("Stampa non riuscita"+(e&&e.message?": "+e.message:"."))}return!0}let ga=!1;function Me(){if(ga||!K())return;ga=!0;const t=G("SplashScreen");if(!(!t||!t.hide))try{const a=t.hide();a&&a.catch&&a.catch(()=>{})}catch{}}async function ze(t){const a=G("Haptics");if(a)try{t==="ok"?await a.notification({type:"SUCCESS"}):await a.impact({style:"LIGHT"})}catch{}}const qe="Accesso riservato ai pazienti",Oa="L’accesso è riservato ai pazienti dello Studio Tramontano che hanno già fatto la prima visita e sono stati abilitati dallo studio. Le credenziali le consegna lo studio.",Ce="Non hai ancora fatto la prima visita? Prenotala: dopo la visita lo studio ti abilita all’accesso.",De="Buongiorno, vorrei prenotare una prima visita.",Ne="https://wa.me/"+_a+"?text="+encodeURIComponent(De),Pe="https://wa.me/"+_a+"?text="+encodeURIComponent("Buongiorno, vorrei prenotare un controllo."),xe="tel:+"+Ma;function He(){return`<section class="riservato" aria-labelledby="riservato-tit">
    <h2 id="riservato-tit">${qe}</h2>
    <p>${Oa}</p>
    <p class="riservato-invito">${Ce}</p>
    <div class="riservato-azioni">
      <a class="riservato-btn principale" href="${Ne}" target="_blank" rel="noopener">Prenota la prima visita</a>
      <a class="riservato-btn" href="${xe}">Chiama ${aa}</a>
    </div>
  </section>`}const J=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),ia=t=>{const a=String(t??"").trim();return a&&a.charAt(0).toUpperCase()+a.slice(1)},ja=t=>Math.round(Number(t)||0).toLocaleString("it-IT")+" kcal";function Ra(t){const a=t instanceof Date?t:new Date(String(t||"").slice(0,10)+"T12:00:00");return isNaN(a)?"":a.toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"})}let gt=null,zt=null,Fa=0;const Be=96/25.4,Oe=271*Be*.92,va=["f-grande","f-medio","","f-piccolo"];function je(t){const a=()=>va.forEach(i=>{i&&t.classList.remove(i)});t.classList.add("f-misura");let e=null;for(const i of va)if(a(),i&&t.classList.add(i),t.getBoundingClientRect().height<=Oe){e=i;break}e===null&&a(),t.classList.remove("f-misura")}function oa(){const t=document.getElementById("area-stampa");t&&t.remove(),document.body.classList.remove("in-stampa")}function na(){gt!=null&&(document.title=gt,gt=null)}function Ut({titolo:t,sottotitolo:a="",contenuto:e="",classe:i="",nomeFile:n="",adatta:l=!1,soloComponi:o=!1}){oa();let s="";try{s=(sessionStorage.getItem("nome")||"").trim()}catch{}const c=document.createElement("div");if(c.id="area-stampa",c.className="foglio"+(i?" "+i:""),c.setAttribute("aria-hidden","true"),c.innerHTML=`
    <header class="f-testa">
      <div class="f-titoli"><h1>${J(t)}</h1>${a?`<p>${J(a)}</p>`:""}</div>
      <div class="f-studio"><b>Studio Dott.ssa Doris Tramontano</b><span>Biologa nutrizionista · ${J(aa)}</span><span class="f-per">${J((s?"Per "+s+" · ":"")+Ra(new Date))}</span></div>
    </header>
    <div class="f-corpo">${e}</div>`,document.body.appendChild(c),l)try{je(c)}catch{}if(document.body.classList.add("in-stampa"),n&&(gt==null&&(gt=document.title),document.title=n),Fa=Date.now(),!o){if(Ba()){_e(n||t).finally(na);return}window.print()}}function kt(t){zt=typeof t=="function"?t:null,oa()}window.addEventListener("beforeprint",()=>{if(!(document.getElementById("area-stampa")&&Date.now()-Fa<5e3)&&zt)try{zt(!0)}catch{}});window.addEventListener("afterprint",na);window.addEventListener("hashchange",()=>{oa(),na(),zt=null});function Re({reparti:t,periodo:a,piano:e,conPresi:i,nonRiconosciuti:n}){const l=(t||[]).flatMap(f=>f.voci||[]),o=l.filter(f=>f.preso).length,s=l.length-o,c=f=>`<li class="f-voce${f.preso?" f-presa":""}"><span class="f-box"></span><span class="f-nome">${J(ia(f.alimento))}</span><span class="f-riempi"></span><span class="f-qta">${J(f.qb?"q.b.":f.acquisto||"")}</span></li>`,d=(t||[]).map(f=>{const S=(f.voci||[]).filter(I=>i||!I.preso);return S.length?S.length<=10?`<section class="f-reparto"><h2>${J(f.nome)}</h2><ul class="f-voci">${S.map(c).join("")}</ul></section>`:`<section class="f-reparto f-lungo"><div class="f-reparto-inizio"><h2>${J(f.nome)}</h2><ul class="f-voci">${c(S[0])}</ul></div><ul class="f-voci">${S.slice(1).map(c).join("")}</ul></section>`:""}).join(""),p=(t||[]).reduce((f,S)=>f+(S.voci||[]).filter(I=>i||!I.preso).length,0),m=`<section class="f-reparto f-altro"><h2>Da aggiungere</h2><ul class="f-voci">${'<li class="f-voce"><span class="f-box"></span><span class="f-riga"></span></li>'.repeat(4)}</ul></section>`,g=`
    <p class="f-conta"><b>${s}</b> da prendere${o?` · ${o} già nel carrello${i?" (barrati)":""}`:""}</p>
    ${d?`<div class="f-spesa${p>30?" f-tre":""}">${d}${m}</div>`:'<p class="f-vuoto">Nessun alimento da prendere.</p>'}
    ${(n||[]).length?`<p class="f-nota"><b>Da controllare sul piano:</b> ${n.map(J).join(" · ")}</p>`:""}`;return{titolo:"Lista della spesa",sottotitolo:[a,e].filter(Boolean).join(" — "),contenuto:g,classe:"f-foglio-spesa",nomeFile:"Lista della spesa"+(a?" - "+a:""),adatta:!0}}const lt=[{k:"colazione",et:"Colazione",sub:"",forte:!1},{k:"spuntino_m",et:"Spuntino",sub:"del mattino",forte:!1},{k:"pranzo",et:"Pranzo",sub:"",forte:!0},{k:"spuntino_p",et:"Spuntino",sub:"del pomeriggio",forte:!1},{k:"cena",et:"Cena",sub:"",forte:!0}],Fe=["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"],N=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Ga(t,a,e){const i=Math.max(1,Number(e)||1),n=p=>new Date(String(p||"").slice(0,10)+"T12:00:00"),l=n(t),o=n(a);if(i===1||isNaN(l)||isNaN(o)||o<l)return 1;const s=p=>{const m=new Date(p);return m.setDate(m.getDate()-(m.getDay()+6)%7),m},c=s(l);return c<l&&c.setDate(c.getDate()+7),o<c?1:Math.round((s(o)-c)/6048e5)%i+1}function vt(t,a,e){if(!Array.isArray(t)||!t.length)return 0;const i=e?new Date(e):new Date,n=Fe[i.getDay()],l=`${i.getFullYear()}-${String(i.getMonth()+1).padStart(2,"0")}-${String(i.getDate()).padStart(2,"0")}`,o=Math.max(...t.map(p=>Number(p.settimana)||1)),s=a?Ga(a,l,o):1,c=p=>String(p.label||"").toLowerCase().includes(n);let d=t.findIndex(p=>c(p)&&(Number(p.settimana)||1)===s);return d<0&&(d=t.findIndex(c)),d<0?0:d}function sa(t){if(!t||t.libero)return 0;const a=t.pasti||{};return lt.reduce((e,i)=>e+(Number((a[i.k]||{}).kcal)||0),0)}const et=t=>String(t??"").toLowerCase().replace(/[’`]/g,"'").replace(/\s+/g," ").trim();function yt(t){if(!t||!Array.isArray(t.alternative_alimenti)||!String(t.testo||"").trim())return[];const a=et(t.testo);return t.alternative_alimenti.filter(e=>e&&String(e.testo||"").trim()&&Array.isArray(e.alt)&&a.includes(et(e.testo))).map(e=>({testo:String(e.nome||e.testo).trim(),alt:e.alt.map(i=>String(i&&i.testo||"").trim()).filter(Boolean)})).filter(e=>e.alt.length)}const Va=t=>(t||[]).some(a=>a&&!a.libero&&lt.some(e=>yt((a.pasti||{})[e.k]).length)),Ge={colazione:"a colazione",spuntino_m:"allo spuntino del mattino",pranzo:"a pranzo",spuntino_p:"allo spuntino del pomeriggio",cena:"a cena"},Ve=t=>t.length<2?t.join(""):t.slice(0,-1).join(", ")+" e "+t[t.length-1];function Ua(t){const a=la(t),e=new Map;(t||[]).forEach((l,o)=>{if(!(!l||l.libero))for(const s of lt)for(const c of yt((l.pasti||{})[s.k])){const d=et(c.testo)+"|"+c.alt.map(et).join("|");let p=e.get(d);p||(p={testo:c.testo,alt:c.alt,slot:new Set,giorni:[]},e.set(d,p)),p.slot.add(s.k);const m=String(l.label||"Giorno "+(o+1)).toLowerCase()+(a&&l.settimana?" ("+l.settimana+"ª sett.)":"");p.giorni.includes(m)||p.giorni.push(m)}});const i=[...e.values()],n=new Map;return i.forEach(l=>n.set(et(l.testo),(n.get(et(l.testo))||0)+1)),i.map(l=>{let o=Ve(lt.filter(s=>l.slot.has(s.k)).map(s=>Ge[s.k]));return n.get(et(l.testo))>1&&(o+=" · "+(l.giorni.length>8?l.giorni.slice(0,8).join(", ")+"…":l.giorni.join(", "))),{testo:l.testo,alt:l.alt,quando:o}})}function Ue(t){const a=yt(t);return a.length?`<details class="lb-alt"><summary>Alternative <small>per ${a.length===1?"1 alimento":a.length+" alimenti"}</small></summary>
    <div class="lb-alt-lista">${a.map(e=>`<div class="lb-alt-cibo"><div class="lb-alt-da">Al posto di <b>${N(e.testo)}</b>:</div>
      <div class="lb-alt-chips">${e.alt.map(i=>`<span class="lb-alt-chip">${N(i)}</span>`).join("")}</div></div>`).join("")}</div></details>`:""}function We(t){const e=Ua(t).map(i=>`<div class="lb-alt-gruppo"><div class="lb-alt-da"><b>${N(ia(i.testo))}</b> <small>${N(i.quando)}</small></div>
    <div class="lb-alt-chips">${i.alt.map(n=>`<span class="lb-alt-chip">${N(n)}</span>`).join("")}</div></div>`).join("");return`<article class="lb-pagina lb-alt-pagina"><header class="lb-testa"><h2>Tutte le alternative</h2><button class="lb-btn lb-alt-chiudi" type="button" aria-label="Torna al giorno">×</button></header>
    <div class="lb-azioni"><button class="lb-mini" type="button" data-az="stampa-alt">🖶 Stampa</button></div>
    <p class="lb-alt-nota">La dottoressa ha indicato con cosa puoi sostituire alcuni alimenti del piano: al posto dell’alimento scegli una delle sue alternative, nella quantità scritta.</p>${e?'<div class="lb-alt-colonne">'+e+"</div>":'<div class="lb-vuota">Il piano non ha alternative.</div>'}</article>`}function Xe(t,a,e){if(!t)return'<div class="lb-vuota">Pagina non disponibile.</div>';const i=sa(t);if(t.libero)return`<article class="lb-pagina">
      <header class="lb-testa">
        <h2>${N(t.label||"Giorno")}</h2>
        <div class="lb-azioni"><button class="lb-mini lb-icona" type="button" data-az="condividi" title="Condividi questa giornata" aria-label="Condividi">↗</button><button class="lb-mini lb-icona" type="button" data-az="stampa" title="Stampa" aria-label="Stampa">🖶</button></div>
      </header>
      <div class="lb-libero">
        <div class="lb-libero-em">Giorno libero</div>
        <p>Nessun pasto pianificato. Segui le indicazioni generali della dottoressa.</p>
      </div>
    </article>`;const n=t.pasti||{};let l="";for(const o of lt){const s=n[o.k]||{};s.testo&&(l+=`<section class="lb-pasto${o.forte?" lb-forte":""}" data-slot="${o.k}">
      <div class="lb-pasto-et">${N(o.et)}${o.sub?` <small>${N(o.sub)}</small>`:""}
        ${s.kcal?`<span class="lb-kcal">${Math.round(s.kcal)} kcal</span>`:""}</div>
      <div class="lb-pasto-txt">${N(s.testo)}</div>
      ${s.ricetta&&s.ricetta!==s.testo?`<details class="lb-ricetta"><summary>Come si prepara</summary><div>${N(s.ricetta).replace(/\n/g,"<br>")}</div></details>`:""}
      ${Ue(s)}
    </section>`)}return l||(l='<div class="lb-vuota">Nessun pasto indicato per questa giornata.</div>'),`<article class="lb-pagina">
    <header class="lb-testa">
      <h2>${N(t.label||"Giorno")}</h2>
      ${i?`<span class="lb-tot">${Math.round(i)} kcal</span>`:""}
      <div class="lb-azioni"><button class="lb-mini lb-icona" type="button" data-az="condividi" title="Condividi questa giornata" aria-label="Condividi">↗</button><button class="lb-mini lb-icona" type="button" data-az="stampa" title="Stampa" aria-label="Stampa">🖶</button></div>
    </header>
    ${l}
  </article>`}const Qe=(t,a,e)=>`${t&&t.label||"Giorno "+(a+1)}${e&&t&&t.settimana?" · "+t.settimana+"ª settimana":""}`,Wt=t=>Number((t||{}).settimana)||1,la=t=>new Set((t||[]).map(Wt)).size>1,Ye={spuntino_m:"Spuntino mattina",spuntino_p:"Spuntino pomeriggio"};function Je(t,a,e){const i=(t.pasti||{})[a.k]||{};if(!i.testo)return"";const n=i.kcal?Math.round(i.kcal)+" kcal":"";if(e){const o=Ye[a.k]||a.et;return`<div class="f-pasto${a.forte?" f-forte":""}"><div class="f-pasto-et"><b>${N(o)}</b></div><div class="f-pasto-corpo"><p class="f-pasto-txt">${N(i.testo)}</p></div><div class="f-pasto-kcal">${n}</div></div>`}const l=yt(i);return`<div class="f-pasto${a.forte?" f-forte":""}">
    <div class="f-pasto-et"><b>${N(a.et)}</b>${a.sub?`<span>${N(a.sub)}</span>`:""}${n?`<span>${n}</span>`:""}</div>
    <div class="f-pasto-corpo">
      <p class="f-pasto-txt">${N(i.testo)}</p>
      ${i.ricetta&&i.ricetta!==i.testo?`<p class="f-ricetta"><b>Come si prepara.</b> ${N(i.ricetta).replace(/\n/g,"<br>")}</p>`:""}
      ${l.length?`<div class="f-alt"><b>Alternative</b><ul>${l.map(o=>`<li><span class="f-alt-da">${N(o.testo)}</span> → ${o.alt.map(N).join(" · ")}</li>`).join("")}</ul></div>`:""}
    </div>
  </div>`}function Wa(t,a){if(!t)return"";if(t.libero)return'<p class="f-libero"><b>Giorno libero.</b> Nessun pasto pianificato: segui le indicazioni generali della dottoressa.</p>';const e=lt.map(i=>Je(t,i,a)).join("");return e?`<div class="f-pasti">${e}</div>`:'<p class="f-libero">Nessun pasto indicato per questa giornata.</p>'}const Xa=t=>[t.nome||"Piano alimentare",t.data?"del "+Ra(t.data):""].filter(Boolean).join(" ");function Ze(t,a,e={}){const i=t[a],n=sa(i),l=Qe(i,a,la(t));return{titolo:l,sottotitolo:[e.nome||"Piano alimentare",n?ja(n)+" nella giornata":""].filter(Boolean).join(" — "),contenuto:Wa(i,!1),classe:"f-foglio-giorno",nomeFile:"Dieta - "+l.replace(" · "," "),adatta:!0}}function fa(t,a,e={}){const i=la(t),n=(a&&a.length?a:[...new Set(t.map(Wt))]).slice().sort((s,c)=>s-c),l=n.map(s=>{const c=t.map((d,p)=>[d,p]).filter(([d])=>Wt(d)===s).map(([d,p])=>{const m=sa(d);return`<section class="f-giorno"><h2><span>${N(d&&d.label||"Giorno "+(p+1))}</span>${m?`<small>${ja(m)}</small>`:""}</h2>${Wa(d,!0)}</section>`}).join("");return`<div class="f-settimana">${i&&n.length>1?`<h2 class="f-sett-t">${s}ª settimana</h2>`:""}${c}</div>`}).join("");return{titolo:n.length>1?"Piano alimentare":i?`Piano alimentare · ${n[0]}ª settimana`:"Piano alimentare della settimana",sottotitolo:Xa(e),contenuto:`${Va(t)?'<p class="f-sotto">Pranzo e cena in evidenza. Le alternative degli alimenti sono nella stampa «Le alternative».</p>':""}<div class="f-compatto">${l}</div>`,classe:"f-foglio-settimane",nomeFile:"Dieta - "+(n.length>1?"piano completo":i?n[0]+"a settimana":"settimana")}}function Ke(t,a={}){const e=Ua(t).map(i=>`<div class="f-alt-blocco"><p><b>${N(ia(i.testo))}</b> <small>${N(i.quando)}</small></p><p class="f-alt-con">→ ${i.alt.map(N).join(" · ")}</p></div>`).join("");return{titolo:"Le alternative degli alimenti",sottotitolo:Xa(a),contenuto:`<p class="f-alt-intro">Al posto dell’alimento indicato si può usare una delle sue alternative, nella quantità scritta.</p>${e?`<div class="f-alt-colonne">${e}</div>`:'<p class="f-vuoto">Il piano non ha alternative.</p>'}`,classe:"f-foglio-alternative",nomeFile:"Dieta - alternative",adatta:!0}}function ti(t,a,e){const i=e||{},n=a&&Array.isArray(a.giorni)?a.giorni:[],l=n.length;let o=vt(n,i.inizio,i.oggi);try{for(let v=localStorage.length-1;v>=0;v--){const $=localStorage.key(v);$&&$.startsWith("lb-alt:")&&localStorage.removeItem($)}}catch{}t.innerHTML=`
    <div class="lb">
      <div class="lb-corpo" id="lbCorpo"></div>
      <div class="lb-sett" id="lbSett" role="tablist" aria-label="Settimana"></div>
      <nav class="lb-nav">
        <button class="lb-btn" id="lbPrec" aria-label="Giorno precedente">&lsaquo;</button>
        <div class="lb-giorni" id="lbGiorni" role="tablist" aria-label="Giorno"></div>
        <button class="lb-btn" id="lbSucc" aria-label="Giorno successivo">&rsaquo;</button>
      </nav>
    </div>`;const s=t.querySelector("#lbCorpo"),c=vt(n,i.inizio,i.oggi),d=v=>Number((n[v]||{}).settimana)||1,p=[...new Set(n.map((v,$)=>d($)))].sort((v,$)=>v-$),m=v=>String(v&&v.label||"").trim().slice(0,3),g=v=>String(v&&v.label||"").toLowerCase().replace(/[^a-zà-ù]/g,"").slice(0,3);function f(v,$){const M=g(n[$]),z=n.findIndex((C,R)=>d(R)===v&&g(C)===M);return z>=0?z:n.findIndex((C,R)=>d(R)===v)}const S=t.querySelector("#lbSett"),I=t.querySelector("#lbGiorni");function _(){const v=d(o);S.hidden=p.length<2,S.innerHTML=p.map($=>`<button role="tab" aria-selected="${$===v}" class="lb-sett-b${$===v?" attivo":""}"
      data-sett="${$}">${$}ª settimana${$===d(c)?" <small>oggi</small>":""}</button>`).join(""),I.innerHTML=n.map(($,M)=>d(M)!==v?"":`<button role="tab" aria-selected="${M===o}" class="lb-giorno${M===o?" attivo":""}${M===c?" oggi":""}${$.libero?" libero":""}"
        data-i="${M}" title="${N($.label||"")}">${N(m($))}</button>`).join(""),S.querySelectorAll("[data-sett]").forEach($=>$.addEventListener("click",()=>u(f(Number($.dataset.sett),o)))),I.querySelectorAll("[data-i]").forEach($=>$.addEventListener("click",()=>u(Number($.dataset.i))))}const T=Va(n),D=ge(a),x={nome:i.nome||"",data:i.data||""};function k(v){if(v==="alternative")return Ke(n,x);const $=v==="settimana"?fa(n,[d(o)],x):v==="piano"?fa(n,p,x):Ze(n,o,x);return D&&($.contenuto+=`<p class="f-fonti">${N(pa)}</p>`),$}const L=(v,$)=>Ut({...k(v),soloComponi:!!$});function P(v){const $=s.querySelector(".lb-stampa-menu");if($){$.remove(),v.setAttribute("aria-expanded","false");return}const M=d(o),z=document.createElement("div");z.className="lb-stampa-menu",z.setAttribute("role","group"),z.setAttribute("aria-label","Cosa stampare"),z.innerHTML=`<span>Cosa vuoi stampare?</span>
      <button class="lb-mini" type="button" data-st="giorno">Questo giorno</button>
      <button class="lb-mini" type="button" data-st="settimana">${p.length>1?"La "+M+"ª settimana":"Tutta la settimana"}</button>
      ${p.length>1?'<button class="lb-mini" type="button" data-st="piano">Tutto il piano</button>':""}
      ${T?'<button class="lb-mini" type="button" data-st="alternative">Le alternative</button>':""}`,(v.closest(".lb-testa")||v.closest(".lb-azioni")).insertAdjacentElement("afterend",z),v.setAttribute("aria-expanded","true"),z.querySelectorAll("[data-st]").forEach(C=>C.addEventListener("click",()=>{z.remove(),v.setAttribute("aria-expanded","false"),L(C.dataset.st)}))}function H(){s.innerHTML=We(n),s.scrollTop=0;const v=s.querySelector(".lb-alt-chiudi");v&&v.addEventListener("click",()=>u(o));const $=s.querySelector('[data-az="stampa-alt"]');$&&$.addEventListener("click",()=>L("alternative")),kt(M=>L("alternative",M))}function V(v,$){const M=[`${v.label||"Giorno "+($+1)}${v.settimana?" · "+v.settimana+"ª settimana":""}`];for(const z of lt){const C=(v.pasti||{})[z.k]||{};if(C.testo){M.push(`${z.et}${z.sub?" "+z.sub:""}: ${C.testo}${C.kcal?" ("+Math.round(C.kcal)+" kcal)":""}`);for(const R of yt(C))M.push(`   al posto di ${R.testo}: ${R.alt.join(" oppure ")}`)}}return M.join(`
`)}async function r(){const v=V(n[o],o);await xa({titolo:"La mia dieta",testo:v})}function u(v){o=Math.max(0,Math.min(l-1,v)),s.innerHTML=Xe(n[o]);const $=s.querySelector('[data-az="condividi"]');$&&$.addEventListener("click",r);const M=s.querySelector('[data-az="stampa"]');if(M&&(M.setAttribute("aria-expanded","false"),M.addEventListener("click",()=>P(M))),kt(z=>L("giorno",z)),T){const z=s.querySelector(".lb-pagina");z&&z.insertAdjacentHTML("beforeend",'<button class="lb-alt-tutte" type="button">Tutte le alternative del piano</button>');const C=s.querySelector(".lb-alt-tutte");C&&C.addEventListener("click",H)}if(D){const z=s.querySelector(".lb-pagina");z&&z.insertAdjacentHTML("beforeend",`<p class="lb-fonti">${N(pa)}</p>`)}_(),t.querySelector("#lbPrec").disabled=o===0,t.querySelector("#lbSucc").disabled=o===l-1,s.scrollTop=0,typeof i.onPagina=="function"&&i.onPagina(o,n[o],o===c)}t.querySelector("#lbPrec").addEventListener("click",()=>u(o-1)),t.querySelector("#lbSucc").addEventListener("click",()=>u(o+1));const E=v=>{v.key==="ArrowLeft"&&u(o-1),v.key==="ArrowRight"&&u(o+1)};document.addEventListener("keydown",E);let y=null;return s.addEventListener("touchstart",v=>{y=v.touches[0].clientX},{passive:!0}),s.addEventListener("touchend",v=>{if(y===null)return;const $=v.changedTouches[0].clientX-y;Math.abs($)>60&&u(o+($<0?1:-1)),y=null},{passive:!0}),u(o),{vaiA:u,oggi:()=>u(vt(n,i.inizio,i.oggi)),corrente:()=>o,distruggi:()=>{document.removeEventListener("keydown",E),kt(null)}}}const ha=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Qa=t=>`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${t}</svg>`,ai=Qa('<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>'),ei=Qa('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>');function ii(){try{return K()||window.matchMedia("(pointer: coarse)").matches}catch{return!1}}function oi(){try{if(window.Capacitor&&window.Capacitor.getPlatform&&window.Capacitor.getPlatform()==="ios")return!0;const t=navigator.userAgent||"";return/iPhone|iPad|iPod/.test(t)?!0:/Macintosh/.test(t)&&(navigator.maxTouchPoints||0)>1}catch{return!1}}function ba(t,a){return new Promise(e=>{document.querySelectorAll("input.campo-foto").forEach(s=>s.remove());const i=document.createElement("input");i.className="campo-foto",i.type="file",i.accept="image/*",t&&i.setAttribute("capture","environment");let n=null;try{a&&a.isConnected&&(n=a.getBoundingClientRect())}catch{n=null}i.style.cssText=n&&n.width&&n.height?`position:fixed;left:${Math.round(n.left)}px;top:${Math.round(n.top)}px;width:${Math.round(n.width)}px;height:${Math.round(n.height)}px;opacity:0;pointer-events:none;z-index:-1`:"position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0",document.body.appendChild(i);let l=!1;const o=s=>{l||(l=!0,i.remove(),e(s||null))};i.addEventListener("change",()=>o(i.files&&i.files[0])),i.addEventListener("cancel",()=>o(null)),i.click()})}function ni({titolo:t="Foto",vicino:a=null}={}){return!ii()||oi()?ba(!1,a):new Promise(e=>{const i=document.createElement("div");i.className="foto-velo",i.innerHTML=`<div class="foto-pannello" role="dialog" aria-modal="true" aria-label="${ha(t)}">
      <div class="altro-maniglia"></div>
      <p class="foto-tit">${ha(t)}</p>
      <button type="button" class="foto-scelta" data-fonte="fotocamera">${ai}<span>Scatta una foto</span></button>
      <button type="button" class="foto-scelta" data-fonte="galleria">${ei}<span>Scegli dalla galleria</span></button>
      <button type="button" class="foto-annulla">Annulla</button>
    </div>`;const n=()=>{i.remove(),document.removeEventListener("keydown",l)},l=s=>{s.key==="Escape"&&(n(),e(null))};i.addEventListener("click",s=>{if(s.target===i||s.target.closest(".foto-annulla")){n(),e(null);return}const c=s.target.closest("[data-fonte]");c&&(n(),ba(c.dataset.fonte==="fotocamera",a).then(e))}),document.addEventListener("keydown",l),document.body.appendChild(i);const o=i.querySelector("[data-fonte]");o&&o.focus({preventScroll:!0})})}const si=[["colazione","Colazione"],["spuntino_m","Spuntino"],["pranzo","Pranzo"],["spuntino_p","Merenda"],["cena","Cena"]],ya=[["gonfiore","Gonfiore"],["dolore_addominale","Dolore addominale"],["bruciore","Bruciore o reflusso"],["nausea","Nausea"],["stitichezza","Stitichezza"],["diarrea","Diarrea"],["mal_di_testa","Mal di testa"],["stanchezza","Stanchezza"],["fame_nervosa","Fame nervosa"]],$a=["","lieve","medio","forte"],xt=[["fuori_casa","Pasto fuori casa"],["festa","Festa o evento"],["viaggio","Viaggio"],["fuori_pasto","Fuori pasto"],["altro","Altro"]],li=["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"],O=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Ya=t=>{const a=new Date(t);return a.setMinutes(a.getMinutes()-a.getTimezoneOffset()),a.toISOString().slice(0,10)},Lt=(t,a)=>{const e=new Date(t+"T12:00:00");return e.setDate(e.getDate()+a),Ya(e)};function Et(t){const a=String(t||"").toLowerCase();return li.findIndex(e=>a.includes(e))}async function ri(t,{piano:a,idPiano:e,inizio:i,data:n,ridisegna:l,vociP:o}){const s=a&&a.giorni||[],c=vt(s,i,new Date(n+"T12:00:00")),d=s[c]||{pasti:{}};let p=[];try{p=(await(o||w.diario(n,n))).voci||[]}catch{}const m=r=>p.find(u=>u.pasto===r&&(!u.data||u.data===n))||{},g=m("giorno"),f={};for(const r of g.sintomi||[])f[r.c]=r.i;const S=Ya(new Date),I=n===S?"Oggi":n===Lt(S,-1)?"Ieri":"",_=new Date(n+"T12:00:00").toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"}),T=r=>{const u=m(r);if(u.scambio_con!=null&&s[u.scambio_con])return{testo:((s[u.scambio_con].pasti||{})[r]||{}).testo,ricetta:((s[u.scambio_con].pasti||{})[r]||{}).ricetta,daGiorno:s[u.scambio_con].label};const E=(d.pasti||{})[r]||{};return{testo:E.testo,ricetta:E.ricetta,daGiorno:null}};t.innerHTML=`
    <div class="dia-testa">
      <button class="dia-freccia" data-vai="-1" aria-label="Giorno prima">‹</button>
      <div class="dia-data">
        <b>${O(I||_)}</b>
        ${I?`<span>${O(_)}</span>`:""}
        ${d.label?`<span class="dia-piano">${O(d.label)}${d.settimana?" · "+d.settimana+"ª settimana":""} del tuo piano</span>`:""}
      </div>
      <button class="dia-freccia" data-vai="1" aria-label="Giorno dopo" ${n>=S?"disabled":""}>›</button>
    </div>

    ${si.map(([r,u])=>{const E=T(r);if(!E.testo)return"";const y=m(r);return`<section class="dia-pasto${y.esito?" dia-"+y.esito:""}" data-k="${r}">
        <h3>${u}${E.daGiorno?`<em>scambiato con ${O(E.daGiorno)}</em>`:""}</h3>
        <p class="dia-testo">${O(E.testo)}</p>
        <div class="dia-esito" role="group" aria-label="Com'è andato ${u.toLowerCase()}">
          <button class="dia-b dia-b-fatto" data-esito="fatto" aria-pressed="${y.esito==="fatto"}">✓ Fatto</button>
          <button class="dia-b dia-b-saltato" data-esito="saltato" aria-pressed="${y.esito==="saltato"}">Saltato</button>
        </div>
        <div class="dia-azioni">
          <button class="dia-link" data-scambia>Scambia con un altro giorno</button>
          ${E.ricetta?'<button class="dia-link" data-ricetta>Ricetta</button>':""}
          <button class="dia-link" data-sgarro>${y.sgarro?"Modifica lo sgarro":"Aggiungi uno sgarro"}</button>
        </div>
        ${E.ricetta?`<div class="dia-ricetta" hidden><p>${O(E.ricetta)}</p></div>`:""}
        ${y.sgarro?`<p class="dia-sgarro"><b>Sgarro:</b> ${O(y.sgarro)}</p>`:""}
        <div class="dia-scelta" hidden></div>
      <div class="dia-extra">
          <details class="dia-nota-pasto"${y.nota?" open":""}><summary>✎ Nota</summary><textarea class="dia-nota-txt" data-k="${r}" rows="2" maxlength="400" placeholder="es. meno olio, mangiato fuori…">${O(y.nota||"")}</textarea></details>
          <div class="dia-foto" data-k="${r}">${y.foto_url?wa(y.foto_url,r):Ht(r)}</div>
        </div>
      </section>`}).join("")}

    <section class="dia-eccezioni">
      <h3>Eccezioni della giornata</h3>
      <p class="piccolo">Una cena fuori, una festa, un viaggio: segnalo qui, così la dottoressa sa perché la giornata è andata diversamente.</p>
      ${(g.eccezioni||[]).map((r,u)=>`<div class="dia-ecc">
          <span><b>${O((xt.find(E=>E[0]===r.t)||[,r.t])[1])}</b>${r.d?" — "+O(r.d):""}</span>
          <button class="dia-link" data-togli-ecc="${u}">togli</button></div>`).join("")}
      <div class="dia-chip">${xt.map(([r,u])=>`<button class="chip" data-ecc="${r}">+ ${O(u)}</button>`).join("")}</div>
    </section>

    <section class="dia-sintomi">
      <h3>Come ti sei sentita/o?</h3>
      <p class="piccolo">Tocca un sintomo per segnarlo; toccalo ancora per dire quanto era forte.
        Serve a capire, insieme alla dottoressa, cosa lo ha provocato.</p>
      <div class="dia-chip">
        ${ya.map(([r,u])=>{const E=f[r]||0;return`<button class="chip${E?" chip-"+E:""}" data-sintomo="${r}" aria-pressed="${E>0}">
            ${O(u)}${E?`<small>${$a[E]}</small>`:""}</button>`}).join("")}
      </div>
      <label for="dia-nota" class="piccolo">Una nota, se vuoi (quando è successo, cosa avevi mangiato fuori piano…)</label>
      <textarea id="dia-nota" rows="2" maxlength="400">${O(g.nota||"")}</textarea>
    </section>`;const D=async r=>{try{await w.segnaDiario({data:n,id_piano:e,...r})}catch(u){await F(u.message)}};t.querySelectorAll("[data-vai]").forEach(r=>r.addEventListener("click",()=>l(Lt(n,Number(r.dataset.vai)))));const x={};let k=Promise.resolve();t.querySelectorAll(".dia-pasto").forEach(r=>{const u=r.dataset.k;r.querySelectorAll("[data-esito]").forEach(y=>y.addEventListener("click",async()=>{const $=(u in x?x[u]:m(u).esito)===y.dataset.esito?null:y.dataset.esito;window.__vibra&&window.__vibra($==="fatto"?"ok":"leggera"),x[u]=$,r.classList.remove("dia-fatto","dia-saltato"),$&&r.classList.add("dia-"+$),r.querySelectorAll("[data-esito]").forEach(z=>z.setAttribute("aria-pressed",String(z.dataset.esito===$)));const M=k.then(()=>D({pasto:u,esito:$}));k=M,await M,k===M&&l(n)}));const E=r.querySelector("[data-ricetta]");E&&E.addEventListener("click",()=>{const y=r.querySelector(".dia-ricetta");y.hidden=!y.hidden}),r.querySelector("[data-sgarro]").addEventListener("click",async()=>{const y=await ht(`Cosa hai mangiato in più, o al posto del pasto?
(Lascia vuoto per togliere lo sgarro.)`,{valore:m(u).sgarro||"",righe:2,ok:"Salva"});y!==null&&(await D({pasto:u,sgarro:y}),l(n))}),r.querySelector("[data-scambia]").addEventListener("click",()=>{const y=r.querySelector(".dia-scelta");if(!y.hidden){y.hidden=!0;return}const v=Number(d.settimana)||1,$=s.map((C,R)=>({x:C,j:R})).filter(({x:C,j:R})=>R!==c&&(Number(C.settimana)||1)===v&&!C.libero&&((C.pasti||{})[u]||{}).testo);if(!$.length){y.innerHTML='<p class="piccolo">Nessun altro giorno di questa settimana ha questo pasto.</p>',y.hidden=!1;return}const M=m(u).scambio_con!=null;y.innerHTML=`<p class="piccolo">Il pasto scelto va a oggi, e quello di oggi va a quel giorno: la settimana resta la stessa.</p>
        ${$.map(({x:C,j:R})=>`<button class="dia-opzione" data-j="${R}"><b>${O(C.label)}</b>
          <span>${O(((C.pasti||{})[u]||{}).testo)}</span></button>`).join("")}
        ${M?'<button class="dia-link" data-annulla>Torna al pasto previsto</button>':""}`,y.hidden=!1,y.querySelectorAll("[data-j]").forEach(C=>C.addEventListener("click",async()=>{const R=Number(C.dataset.j);await D({pasto:u,scambio_con:R});const dt=Et(d.label),Pt=Et(s[R].label);if(dt>=0&&Pt>=0){const me=Lt(n,Pt-dt);try{await w.segnaDiario({data:me,id_piano:e,pasto:u,scambio_con:c})}catch{}}l(n)}));const z=y.querySelector("[data-annulla]");z&&z.addEventListener("click",async()=>{const C=m(u).scambio_con;await D({pasto:u,scambio_con:null});const R=Et(d.label),dt=Et((s[C]||{}).label);if(R>=0&&dt>=0)try{await w.segnaDiario({data:Lt(n,dt-R),id_piano:e,pasto:u,scambio_con:null})}catch{}l(n)})})}),t.querySelectorAll("[data-sintomo]").forEach(r=>r.addEventListener("click",async()=>{const u=r.dataset.sintomo;f[u]=((f[u]||0)+1)%4;const E=Object.entries(f).filter(([,v])=>v>0).map(([v,$])=>({c:v,i:$}));await D({pasto:"giorno",sintomi:E});const y=f[u];r.className="chip"+(y?" chip-"+y:""),r.setAttribute("aria-pressed",String(y>0)),r.innerHTML=O((ya.find(v=>v[0]===u)||[,u])[1])+(y?`<small>${$a[y]}</small>`:"")}));const L=(g.eccezioni||[]).slice();t.querySelectorAll("[data-ecc]").forEach(r=>r.addEventListener("click",async()=>{const u=(xt.find(y=>y[0]===r.dataset.ecc)||[,""])[1],E=await ht(u+": vuoi aggiungere due parole? (facoltativo)",{valore:"",ok:"Aggiungi"});E!==null&&(L.push({t:r.dataset.ecc,d:E}),await D({pasto:"giorno",eccezioni:L}),l(n))})),t.querySelectorAll("[data-togli-ecc]").forEach(r=>r.addEventListener("click",async()=>{L.splice(Number(r.dataset.togliEcc),1),await D({pasto:"giorno",eccezioni:L}),l(n)})),t.querySelectorAll(".dia-nota-txt").forEach(r=>{let u=null;r.addEventListener("input",()=>{clearTimeout(u),u=setTimeout(()=>D({pasto:r.dataset.k,nota:r.value}),900)})});function P(r,u){const E=r.querySelector("[data-foto]");E&&E.addEventListener("click",async()=>{const v=await ni({titolo:"Foto del pasto",vicino:E});if(v){r.innerHTML='<span class="dia-foto-wait">Carico la foto…</span>';try{const $=await ci(v),M=await w.fotoDiario({data:n,pasto:u,base64:$});r.innerHTML=M.foto_url?wa(M.foto_url,u):'<span class="dia-foto-wait">Foto salvata</span>'}catch($){r.innerHTML=`<span class="dia-foto-err">${O($.message||"Foto non caricata")}</span>`+Ht(u,"Riprova")}P(r,u)}});const y=r.querySelector(".dia-foto-x");y&&y.addEventListener("click",async()=>{if(await nt("Rimuovere la foto?",{ok:"Rimuovi",pericolo:!0}))try{await w.fotoDiario({data:n,pasto:u,rimuovi:!0}),r.innerHTML=Ht(u),P(r,u)}catch(v){await F(v.message)}})}t.querySelectorAll(".dia-foto").forEach(r=>P(r,r.dataset.k));const H=t.querySelector("#dia-nota");let V=null;H.addEventListener("input",()=>{clearTimeout(V),V=setTimeout(()=>D({pasto:"giorno",nota:H.value}),900)})}const wa=(t,a)=>`<img src="${O(t)}" alt="Foto del pasto" class="dia-foto-img"><button class="dia-foto-x" type="button" data-k="${a}" aria-label="Rimuovi la foto">×</button>`,Ht=(t,a="Foto")=>`<button type="button" class="dia-foto-btn" data-foto="${t}">📷 ${O(a)}</button>`;function ci(t,a=1280,e=.82){return new Promise((i,n)=>{const l=new Image,o=URL.createObjectURL(t);l.onload=()=>{try{const s=Math.min(1,a/Math.max(l.width,l.height)),c=document.createElement("canvas");c.width=Math.round(l.width*s),c.height=Math.round(l.height*s),c.getContext("2d").drawImage(l,0,0,c.width,c.height),URL.revokeObjectURL(o),i(c.toDataURL("image/jpeg",e).split(",")[1])}catch(s){n(s)}},l.onerror=()=>{URL.revokeObjectURL(o),n(new Error("Immagine non leggibile"))},l.src=o})}const ra="app-invito",di=10,ui=3;let j=null;window.addEventListener("beforeinstallprompt",t=>{t.preventDefault(),j=t;const a=document.querySelector(".invito-app a.inv-si");if(a&&$t()!=="ios"){const e=document.createElement("button");e.className="inv-si",e.dataset.installa="",e.textContent="Installa",a.replaceWith(e),Za(document)}});window.addEventListener("appinstalled",()=>{j=null;try{localStorage.setItem(ra,JSON.stringify({installata:!0}))}catch{}});const Ja=()=>!!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());function bt(){return Ja()||window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===!0}function $t(){const t=navigator.userAgent||"";return/iPhone|iPad|iPod/.test(t)||/Macintosh/.test(t)&&navigator.maxTouchPoints>1?"ios":/Android/.test(t)?"android":"computer"}function ca(){try{return JSON.parse(localStorage.getItem(ra)||"{}")}catch{return{}}}function Dt(t){try{localStorage.setItem(ra,JSON.stringify(t))}catch{}}function pi(){if(bt())return!1;const t=ca();return!(t.installata||(t.rifiuti||0)>=ui||t.ultimo&&Date.now()-t.ultimo<di*864e5)}function Sa(){const t=ca();Dt({...t,rifiuti:(t.rifiuti||0)+1,ultimo:Date.now()})}function mi(){if(!pi())return"";const t=$t();return`<div class="invito-app" role="region" aria-label="Suggerimento">
    <img class="inv-icona" src="/app-pazienti-192.png" alt="" aria-hidden="true">
    <span class="inv-testo">${t==="computer"?"<b>Salvala tra i preferiti</b> per ritrovarla con un clic.":"<b>Mettila sulla schermata Home</b>: la apri con un tocco."}</span>
    ${t==="android"&&j?'<button class="inv-si" data-installa>Installa</button>':'<a class="inv-si" href="#/installa">Come si fa</a>'}
    <button class="inv-no" data-rimanda aria-label="Non ora" title="Non ora">×</button>
  </div>`}function Za(t){const e=(t||document).querySelector(".invito-app");if(!e)return;const i=e.querySelector("[data-rimanda]");i&&!i.dataset.collegato&&(i.dataset.collegato="1",i.addEventListener("click",()=>{Sa(),e.remove()}));const n=e.querySelector("[data-installa]");n&&!n.dataset.collegato&&(n.dataset.collegato="1"),n&&n.dataset.collegato==="1"&&!n.dataset.pronto&&(n.dataset.pronto="1",n.addEventListener("click",async()=>{if(!j){location.hash="#/installa";return}j.prompt();const{outcome:l}=await j.userChoice;j=null,l==="accepted"?(Dt({installata:!0}),e.remove()):(Sa(),e.remove())}))}function gi(){const t=$t(),a=`<section class="blocco inst-passi">
      <h3>Su iPhone e iPad</h3>
      <ol>
        <li>Apri questa pagina con <b>Safari</b>.</li>
        <li>Tocca il pulsante <b>Condividi</b> <span class="inst-ic" aria-hidden="true">⬆︎</span>
          (il quadrato con la freccia verso l’alto, in basso al centro).</li>
        <li>Scorri e tocca <b>Aggiungi alla schermata Home</b>, poi <b>Aggiungi</b>.</li>
      </ol>
      <p class="avviso">La prima volta che apri l’app ti chiederà di <b>accedere di nuovo</b>:
        su iPhone l’app tiene i suoi dati separati da Safari. È normale, succede solo la prima volta.</p>
    </section>`,e=`<section class="blocco inst-passi">
      <h3>Su Android</h3>
      <ol>
        <li>Apri questa pagina con <b>Chrome</b>.</li>
        <li>Tocca il menu <b>⋮</b> in alto a destra.</li>
        <li>Tocca <b>Installa app</b> oppure <b>Aggiungi a schermata Home</b>.</li>
      </ol>
      ${j?'<button class="btn-primario" data-installa-pagina>Installa adesso</button>':""}
    </section>`,i=`<section class="blocco inst-passi">
      <h3>Sul computer</h3>
      <p>Premi <b>${/Mac/.test(navigator.platform||navigator.userAgent)?"⌘ + D":"Ctrl + D"}</b>
        per salvarla tra i preferiti. Con Chrome o Edge puoi anche installarla come app
        dall’icona nella barra dell’indirizzo.</p>
    </section>`,n=t==="ios"?[a,e,i]:t==="android"?[e,a,i]:[i,a,e];return`<h2 class="titolo-sezione">Tienila sempre a portata di mano</h2>
    ${bt()?'<div class="avviso">Stai già usando l’app installata: è tutto a posto.</div>':""}
    ${n.join("")}`}function vi(t){const a=(t||document).querySelector("[data-installa-pagina]");a&&a.addEventListener("click",async()=>{if(!j)return;j.prompt();const{outcome:e}=await j.userChoice;j=null,e==="accepted"&&Dt({installata:!0}),a.remove()})}function fi(){"serviceWorker"in navigator&&(Ja()||navigator.serviceWorker.register("/sw-pazienti.js",{scope:"/pazienti"}).catch(()=>{}))}const Ka="app-benvenuto";function hi(){if(bt())return!1;try{return!localStorage.getItem(Ka)&&!ca().installata}catch{return!1}}function bi(){try{localStorage.setItem(Ka,String(Date.now()))}catch{}}function yi(){const t=$t(),a=t==="ios"?`<ol><li>Tocca <b>Condividi</b> <span class="inst-ic" aria-hidden="true">⬆︎</span>, in basso al centro.</li>
         <li>Scorri e tocca <b>Aggiungi alla schermata Home</b>.</li><li>Tocca <b>Aggiungi</b>.</li></ol>
       <p class="piccolo">Poi aprila dall’icona: la prima volta ti chiederà di accedere di nuovo, è normale.</p>`:t==="android"?j?"":"<ol><li>Tocca il menu <b>⋮</b> in alto a destra.</li><li>Tocca <b>Installa app</b>.</li></ol>":`<p>Premi <b>${/Mac/.test(navigator.platform||navigator.userAgent)?"⌘ + D":"Ctrl + D"}</b> per salvarla tra i preferiti.</p>`;return`<section class="benvenuto-app">
      <img src="/app-pazienti-192.png" alt="" class="bv-icona">
      <h2>${t==="computer"?"Tienila a portata di mano":"Mettila tra le tue app"}</h2>
      <p class="bv-perche">Dieta, diario, spesa e appuntamenti, sempre con un tocco: senza cercare il link ogni volta.</p>
      ${a}
      ${t==="android"&&j?'<button class="btn-primario bv-si" data-bv-installa>Installa adesso</button>':""}
      <button class="bv-dopo" data-bv-dopo>${t==="android"&&j?"Lo farò dopo":"Fatto, andiamo avanti"}</button>
    </section>`}function $i(t,a){const e=t||document,i=()=>{bi(),a()},n=e.querySelector("[data-bv-dopo]");n&&n.addEventListener("click",i);const l=e.querySelector("[data-bv-installa]");l&&l.addEventListener("click",async()=>{if(!j)return i();j.prompt();const{outcome:o}=await j.userChoice;j=null,o==="accepted"&&Dt({installata:!0}),i()})}const ut=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),It=["#2f6b57","#b0473a","#8a6d3b","#3b6b8a","#6b3b8a","#8a3b6b"];function Bt(t,a){const e=a||{},i=44,n=12,l=14,o=30,s=e.larghezza||320,c=e.altezza||190,d=t.flatMap(L=>L.punti).filter(L=>L&&L.valore!=null);if(d.length<2)return'<div class="gr-vuoto">Servono almeno due misurazioni per vedere l’andamento.</div>';const p=[...new Set(d.map(L=>L.data))].sort(),m=d.map(L=>Number(L.valore));let g=Math.min(...m),f=Math.max(...m);g===f&&(g-=1,f+=1);const S=(f-g)*.12;g-=S,f+=S;const I=L=>i+p.indexOf(L)/Math.max(1,p.length-1)*(s-i-n),_=L=>l+(1-(Number(L)-g)/(f-g))*(c-l-o);let T="";for(let L=0;L<=3;L++){const P=g+(f-g)*(L/3),H=_(P);T+=`<line x1="${i}" y1="${H}" x2="${s-n}" y2="${H}" class="gr-griglia"/><text x="${i-6}" y="${H+3}" class="gr-asse" text-anchor="end">${Math.round(P)}</text>`}const D=L=>{const P=String(L).slice(0,10).split("-");return P[2]+"/"+P[1]+"/"+P[0].slice(2)};T+=`<text x="${i}" y="${c-8}" class="gr-asse">${ut(D(p[0]))}</text><text x="${s-n}" y="${c-8}" class="gr-asse" text-anchor="end">${ut(D(p[p.length-1]))}</text>`;let x="";t.forEach((L,P)=>{const H=(L.punti||[]).filter(u=>u&&u.valore!=null);if(H.length<2)return;const V=It[P%It.length],r=H.map((u,E)=>(E?"L":"M")+I(u.data).toFixed(1)+" "+_(u.valore).toFixed(1)).join(" ");x+=`<path d="${r}" fill="none" stroke="${V}" stroke-width="2.2"
      stroke-linejoin="round" stroke-linecap="round"/>`,x+=H.map(u=>`<circle cx="${I(u.data).toFixed(1)}" cy="${_(u.valore).toFixed(1)}" r="3" fill="${V}"><title>${ut(D(u.data))}: ${ut(u.valore)}</title></circle>`).join("")});const k=t.filter(L=>(L.punti||[]).length>=2).map((L,P)=>`<span class="gr-voce"><i style="background:${It[P%It.length]}"></i>${ut(L.nome)}</span>`).join("");return`<div class="gr">
    <svg viewBox="0 0 ${s} ${c}" class="gr-svg" role="img" aria-label="Andamento nel tempo">
      ${T}${x}
    </svg>
    <div class="gr-legenda">${k}</div>
  </div>`}function Y(t,a,e,i){const n=(t||[]).filter(o=>o&&o.data&&o[a]!=null&&o[a]!=="").map(o=>({data:String(o.data).slice(0,10),valore:Number(o[a])})).filter(o=>Number.isFinite(o.valore)).sort((o,s)=>o.data<s.data?-1:1),l=parseInt(i,10);return{nome:e,punti:l>0&&n.length>l?n.slice(-l):n}}const h=document.getElementById("app"),b=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Z=t=>{if(!t)return"";const a=new Date(String(t).slice(0,10)+"T12:00:00");return isNaN(a)?"":a.toLocaleDateString("it-IT",{day:"numeric",month:"long",year:"numeric"})},at=t=>{if(!t)return"";const a=new Date(String(t).slice(0,10)+"T12:00:00");if(isNaN(a))return"";const e=i=>i.charAt(0).toUpperCase()+i.slice(1);return`${e(a.toLocaleDateString("it-IT",{weekday:"long"}))} ${a.getDate()} ${e(a.toLocaleDateString("it-IT",{month:"long"}))} ${a.getFullYear()}`},te=t=>`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`,qt=()=>te(new Date);function wi(t=new Date){const a=t.getHours();return a>=5&&a<12?"Buongiorno":a>=12&&a<18?"Buon pomeriggio":"Buonasera"}const it=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");let ot=null;function q(t,a){return`<div class="avviso ${a||""}">${b(t)}</div>`}function Q(){const t='<div class="centro"><div class="spinner"></div></div>';h.innerHTML=U.leggi()?A(t,Si(location.hash.replace(/^#/,"")||"/")):t}function Si(t){return t==="/"||t==="/oggi"?"oggi":t==="/diete"||t.startsWith("/dieta/")||t==="/ricette"?"diete":t==="/chiedi"||t==="/attesa"?"appuntamenti":t==="/installa"?"anagrafica":t.replace(/^\//,"").split("/")[0]}function Li(){h.innerHTML=`
    <div class="accesso">
      <div class="marchio">
        <h1>Studio Dott.ssa Tramontano</h1>
        <p>Area riservata ai pazienti</p>
      </div>
      <form class="scheda" id="frm">
        <label for="id">Il tuo identificativo</label>
        <input id="id" name="id" placeholder="nome.cognome" autocomplete="username"
               autocapitalize="none" spellcheck="false" required>
        <label for="pw">Password</label>
        <input id="pw" name="pw" type="password" placeholder="XXXX-XXXX-XXXX"
               autocomplete="current-password" required>
        <div id="esito"></div>
        <button type="submit" class="btn-primario" id="entra">Entra</button>
        <p class="aiuto">Le credenziali ti sono state inviate dallo studio.
        Se non le trovi o non funzionano, <a href="tel:+${Ma}">chiama la segreteria dello studio (${b(aa)})</a>.</p>
        <p class="aiuto"><a href="${za}" target="_blank" rel="noopener" data-esterno>Informativa sulla privacy</a></p>
      </form>
      ${He()}
    </div>`,document.getElementById("frm").addEventListener("submit",async a=>{a.preventDefault();const e=document.getElementById("entra"),i=document.getElementById("esito");e.disabled=!0,e.textContent="Attendi…",i.innerHTML="";try{const n=await w.accesso(document.getElementById("id").value,document.getElementById("pw").value);U.scrivi(n.token),sessionStorage.setItem("nome",n.paziente.nome||""),location.hash="#/oggi"}catch(n){if(/percorso|riattiva/i.test(n.message)){sessionStorage.setItem("motivo-blocco",n.message),location.hash="#/servizio-scaduto";return}i.innerHTML=q(n.message,"errore"),e.disabled=!1,e.textContent="Entra"}})}function ae(t){return hi()?(h.innerHTML=A(yi(),t),$i(h,()=>ct()),!0):!1}async function Xt(){if(ae("diete"))return;Q();let t=[];try{t=(await w.mieDiete()).diete||[]}catch(S){h.innerHTML=A(q(S.message,"errore"),"diete");return}if(!t.length){h.innerHTML=A(`<div class="vuoto">
      <p>Non ci sono ancora piani alimentari nella tua area.</p>
      <p class="piccolo">Compariranno qui appena la dottoressa li pubblica.</p>
    </div>`,"diete");return}const a=[];for(const S of t){const _=String(S.created_at||"").slice(0,10)+"|"+(S.tipo_dieta||"");a.some(T=>T.chiave===_)||a.push({chiave:_,...S})}const e=a[0],i=a.slice(1),n=qt(),l=(S,I)=>{const _=new Date(S+"T12:00:00");return _.setDate(_.getDate()+I),`${_.getFullYear()}-${String(_.getMonth()+1).padStart(2,"0")}-${String(_.getDate()).padStart(2,"0")}`},o=e.prima_apertura?String(e.prima_apertura).slice(0,10):"",s=o?Math.round((new Date(n+"T12:00:00")-new Date(o+"T12:00:00"))/864e5):null,c=Number(e.settimane)||0,d=o?s<0?`Inizia fra ${-s} ${s===-1?"giorno":"giorni"}.`:c>1?`Oggi sei nella ${Ga(o,n,c)}ª settimana del piano.`:"":"Parte dal giorno in cui apri la dieta, oppure scegli tu il giorno.";h.innerHTML=A(`
    ${mi()}
    <!-- scorciatoie verso cio' che si usa ogni giorno accanto alla dieta -->
    <div class="scorciatoie">
      <a href="#/diario" class="scorciatoia"><b>Segna la tua giornata</b><span>Pasti fatti, sgarri, come ti senti</span></a>
      <a href="#/ricette" class="scorciatoia"><b>Le ricette del piano</b><span>Tutte in un posto</span></a>
      <a href="#/appunti" class="scorciatoia"><b>Scrivi allo studio</b><span>Un appunto o una domanda per la dottoressa</span></a>
    </div>
    ${sessionStorage.getItem("avviso-password")!=="no"?`
      <div class="invito">
        <b>Ti consigliamo di cambiare la password.</b>
        Quella che hai ricevuto è provvisoria e resta scritta nel messaggio.
        <span class="invito-azioni">
          <a href="#/anagrafica">Cambiala ora</a>
          <button id="chiudi-invito">Non ora</button>
        </span>
      </div>`:""}
    <section class="blocco">
      <h2>Il tuo piano attuale</h2>
      <button class="carta carta-corrente" data-dieta="${e.id}">
        <div class="carta-tit">${b(e.tipo_dieta||"Piano alimentare")}</div>
        <div class="carta-sub">Del ${b(Z(e.created_at))}${e.settimane?" · "+e.settimane+" settimane":""}${e.kcal_target?" · "+e.kcal_target+" kcal":""}</div>
        <div class="carta-azione">Apri e sfoglia ›</div>
      </button>
      <div class="inizio-dieta">
        <div class="inizio-testo">
          <span>Inizio della dieta</span>
          <b>${o?b(at(o)):"Non ancora iniziata"}</b>
          ${d?`<small>${b(d)}</small>`:""}
        </div>
        <button class="lb-mini" type="button" id="inizio-cambia">${o?"Cambia":"Imposta"}</button>
      </div>
      <form class="inizio-modulo" id="inizio-modulo" hidden>
        <label for="inizio-data">Da che giorno segui (o ricominci) questa dieta?</label>
        <input type="date" id="inizio-data" value="${o||n}" min="${l(n,-365)}" max="${l(n,30)}" required>
        <p class="piccolo">Le settimane del piano si contano da questo giorno. Per rifare la dieta da capo,
        scegli il giorno da cui riparti.</p>
        <div class="inizio-azioni">
          <button type="submit" class="btn-primario">Salva</button>
          <button type="button" class="btn-secondario" id="inizio-annulla">Annulla</button>
        </div>
        <div id="inizio-esito"></div>
      </form>
    </section>
    ${i.length?`<details class="blocco piani-prec" id="piani-prec"${sessionStorage.getItem("piani-prec-aperti")==="1"?" open":""}>
      <summary><h2>Piani precedenti <span class="conteggio">${i.length}</span></h2></summary>
      <p class="piccolo">Restano consultabili, ma segui quello attuale qui sopra.</p>
      ${i.map(S=>`<button class="carta carta-archivio" data-dieta="${S.id}">
        <div class="carta-tit">${b(S.tipo_dieta||"Piano alimentare")}</div>
        <div class="carta-sub">Del ${b(Z(S.created_at))}${S.settimane?" · "+S.settimane+" settimane":""}</div>
      </button>`).join("")}
    </details>`:""}`,"diete"),h.querySelectorAll("[data-dieta]").forEach(S=>S.addEventListener("click",()=>{location.hash="#/dieta/"+S.dataset.dieta}));const p=document.getElementById("piani-prec");p&&p.addEventListener("toggle",()=>sessionStorage.setItem("piani-prec-aperti",p.open?"1":"0"));const m=document.getElementById("inizio-cambia"),g=document.getElementById("inizio-modulo");m&&g&&(m.addEventListener("click",()=>{g.hidden=!1,m.hidden=!0,document.getElementById("inizio-data").focus()}),document.getElementById("inizio-annulla").addEventListener("click",()=>{g.hidden=!0,m.hidden=!1}),g.addEventListener("submit",async S=>{S.preventDefault();const I=document.getElementById("inizio-data").value,_=document.getElementById("inizio-esito");if(!I){_.innerHTML=q("Scegli un giorno.","errore");return}const T=g.querySelector('[type="submit"]');T.disabled=!0,T.textContent="Salvo…",_.innerHTML="";try{await w.inizioDieta(e.id,I),await Xt()}catch(D){_.innerHTML=q(D.message,"errore"),T.disabled=!1,T.textContent="Salva"}}));const f=document.getElementById("chiudi-invito");f&&f.addEventListener("click",()=>{sessionStorage.setItem("avviso-password","no"),Xt()}),Za(h)}async function Ei(t){Q();let a;try{a=await w.miaDieta(t)}catch(i){h.innerHTML=A(q(i.message,"errore"),"diete");return}if(a.corrente,h.innerHTML=`
    <div class="schermo-pieno">
      <header class="barra-libro">
        <button class="btn-indietro" id="indietro" aria-label="Torna indietro">‹</button>
        <div class="barra-tit">
          <strong>${b(a.tipo_dieta||"Piano alimentare")}</strong>
          <small>del ${b(Z(a.created_at))}</small>
        </div>
        <button class="btn-oggi" id="oggi">Oggi</button>
      </header>
      <div class="barra-offline" id="barra-offline" hidden></div>
      <div class="libro-host" id="libro"></div>
    </div>`,document.getElementById("indietro").addEventListener("click",da),!a.piano||!Array.isArray(a.piano.giorni)||!a.piano.giorni.length){document.getElementById("libro").innerHTML=q("Questo piano non contiene giornate da mostrare.","");return}ot&&ot.distruggi();const e=document.getElementById("oggi");ot=ti(document.getElementById("libro"),a.piano,{inizio:a.prima_apertura||a.created_at,nome:a.tipo_dieta||"Piano alimentare",data:a.created_at,onPagina:(i,n,l)=>e.classList.toggle("lontano",!l)}),e.addEventListener("click",()=>ot.oggi())}function Ii(t){try{const a=ta("/api/mie/diete"),e=a&&a.dati&&a.dati.diete||[];return e.length?(t||(i=>i[0]))(e).id:null}catch{return null}}function ee(t,a){const e=a||(l=>l[0]);let i=null;try{const l=ta("/api/mie/diete"),o=l&&l.dati&&l.dati.diete||[];i=o.length?e(o).id:null}catch{}const n=i!=null?w.miaDieta(i).catch(()=>null):null;return t.then(async l=>{const o=l&&l.diete||[];if(!o.length)return null;const s=e(o).id;if(n&&String(s)===String(i)){const c=await n;if(c)return c}return w.miaDieta(s).catch(()=>null)})}let La=0,Ea=Promise.resolve();async function Ai(){const t=document.getElementById("app");if(ae("oggi"))return;const a=++La,e=qt(),i=new Date;i.setDate(i.getDate()-6);const n=te(i),l=new Map,o=k=>{const L=ta(k);return L&&L.dati?L.dati:null},s=o("/api/mie/diete"),c=s&&Array.isArray(s.diete)?s.diete[0]:null,d=c?o("/api/mie/dieta?id="+encodeURIComponent(c.id)):null,p=o(`/api/mie/diario?da=${n}&a=${e}&foto=0`),m=!!(s&&Array.isArray(s.diete)&&p&&Array.isArray(p.voci)&&(!c||d));m?Ia(t,{dati:o("/api/mie/dati")||{},diete:s,app:o("/api/mie/appuntamenti")||{},sett:p,dieta:d},{oggi:e,provvisoria:!0,locali:l}):t.innerHTML=A('<div class="vuoto"><p>Un attimo…</p></div>',"oggi");const g=w.mieDiete().catch(()=>({})),f=ee(g),[S,I,_,T,D]=await Promise.all([w.mieiDati().catch(()=>({})),g,w.mieiAppuntamenti().catch(()=>({})),w.diario(n,e,!0).catch(()=>({})),f]);if(a!==La||!["/","/oggi"].includes(wt()))return;const x=Array.isArray(I.diete)&&Array.isArray(T.voci)&&(!I.diete.length||!!D);m&&!x||Ia(t,{dati:S,diete:I,app:_,sett:T,dieta:D},{oggi:e,provvisoria:!1,locali:l})}function Ia(t,a,{oggi:e,provvisoria:i,locali:n}){let l=null,o=null,s=null;const c=a.dati&&a.dati.dati||{},d=a.diete&&a.diete.diete||[],p=(a.sett&&a.sett.voci||[]).map(k=>({...k}));for(const[k,L]of n){let P=p.find(H=>H.data===e&&H.pasto===k);P||(P={data:e,pasto:k},p.push(P)),P.esito=L}const m=p.filter(k=>k.data===e),g=(a.app&&a.app.appuntamenti||[]).filter(k=>k.data>=e).sort((k,L)=>(k.data+(k.inizio_min||0)).localeCompare(L.data+(L.inizio_min||0)))[0]||null;if(d.length&&a.dieta){const k=a.dieta;l=k.piano,o=k.prima_apertura||k.created_at,s=d[0].id}const f=c&&(c.nome||c.cliente&&c.cliente.nome)||"";f&&!sessionStorage.getItem("nome")&&sessionStorage.setItem("nome",f);const S=k=>(m.find(L=>L.pasto===k)||{}).esito||null;let I="";if(l&&Array.isArray(l.giorni)&&l.giorni.length){const k=vt(l.giorni,o),L=l.giorni[k]||{},H=[["colazione","Colazione"],["spuntino_m","Spuntino"],["pranzo","Pranzo"],["spuntino_p","Merenda"],["cena","Cena"]].map(([r,u])=>{const E=(L.pasti||{})[r]||{};if(!E.testo)return"";const y=S(r);return`<div class="oggi-pasto ${y?"oggi-"+y:""}" data-esito="${y||""}"><button type="button" class="oggi-pasto-b" data-segna="${r}" data-nome="${b(u)}" aria-pressed="${y==="fatto"}" aria-label="${b(oe(u,y))}"><span class="oggi-pasto-st" aria-hidden="true">${ie[y]||""}</span></button><div class="oggi-pasto-corpo"><b>${b(u)}</b>${E.kcal?` <small>${Math.round(E.kcal)} kcal</small>`:""}<div class="oggi-pasto-txt">${b(E.testo)}</div></div></div>`}).join(""),V=H&&!m.some(r=>r.pasto!=="giorno"&&r.esito);I=L.libero?'<div class="oggi-libero">Oggi è un <b>giorno libero</b> del piano.</div>':H?(V?'<p class="oggi-suggerimento" id="oggi-suggerimento">Tocca il cerchio quando hai fatto un pasto.</p>':"")+H:'<div class="vuoto"><p>Nessun pasto indicato per oggi.</p></div>',I=`<section class="blocco oggi-giorno"><div class="oggi-testa"><h2>${b(L.label||"Oggi")}</h2><a href="#/dieta/${b(s)}" class="oggi-link">Apri il giorno ›</a></div>${I}
      <div class="oggi-azioni"><a href="#/diario" class="oggi-btn">Apri il diario</a><a href="#/spesa" class="oggi-btn secondario">Lista della spesa</a></div></section>`}else I='<section class="blocco"><div class="vuoto"><p>Non hai ancora un piano alimentare attivo.</p></div></section>';const _=ne(p),T=g?`<section class="blocco oggi-app"><h2>Prossimo appuntamento</h2><div class="oggi-app-corpo"><div class="oggi-app-data"><b>${b(Mi(g.data))}</b><span>${b(zi(g.inizio_min))}</span></div><a href="#/appuntamenti" class="oggi-link">Dettagli ›</a></div></section>`:'<section class="blocco oggi-app"><h2>Appuntamenti</h2><div class="oggi-app-corpo"><span class="piccolo">Nessun appuntamento in programma.</span><a href="#/appuntamenti" class="oggi-link">Chiedi un appuntamento ›</a></div></section>',D=t.querySelector(".oggi-colonne")?t.querySelector(".contenuto"):null,x=D?D.scrollTop:0;if(t.innerHTML=A(`<div id="invito-notifiche"></div><div class="oggi-colonne" data-fresca="${i?"0":"1"}">${I}<div class="oggi-lato">${_}${T}</div></div>`,"oggi"),x){const k=t.querySelector(".contenuto");k&&(k.scrollTop=x)}Ti(t,{data:e,idPiano:s,settimana:p,locali:n}),i||_i(document.getElementById("invito-notifiche"))}const ie={fatto:"✓",saltato:"✕"};function oe(t,a){return a==="fatto"?`${t}: fatto. Tocca per togliere il segno`:a==="saltato"?`${t}: saltato. Tocca per togliere il segno`:`${t}: segna come fatto`}function ki(t,a){t.classList.remove("oggi-fatto","oggi-saltato"),a&&t.classList.add("oggi-"+a),t.dataset.esito=a||"";const e=t.querySelector("[data-segna]");e&&(e.setAttribute("aria-pressed",String(a==="fatto")),e.setAttribute("aria-label",oe(e.dataset.nome||"",a)),e.querySelector(".oggi-pasto-st").textContent=ie[a]||"")}function ne(t){const a=t.filter(c=>c.esito==="fatto").length,e=t.filter(c=>c.esito).length,i=new Set(t.filter(c=>c.pasto!=="giorno"&&c.esito).map(c=>c.data)).size,n=e?Math.round(a/e*100):null,l=26,o=2*Math.PI*l;return`<section class="blocco oggi-sett"><h2>La tua settimana</h2><div class="oggi-sett-corpo">${n==null?"":`<svg viewBox="0 0 64 64" class="oggi-anello"><circle cx="32" cy="32" r="${l}" fill="none" stroke="#e9e4da" stroke-width="7"/><circle cx="32" cy="32" r="${l}" fill="none" stroke="#2F6B57" stroke-width="7" stroke-linecap="round" stroke-dasharray="${(o*n/100).toFixed(1)} ${o.toFixed(1)}" transform="rotate(-90 32 32)"/><text x="32" y="36" text-anchor="middle" class="oggi-anello-t">${n}%</text></svg>`}<div class="oggi-sett-txt">${n==null?"Nessun pasto segnato negli ultimi 7 giorni: il diario è il modo più semplice per far vedere alla dottoressa come va.":`<b>${a}</b> pasti seguiti su <b>${e}</b> segnati, in ${i} giorn${i===1?"o":"i"}.${n>=80?" Ottimo ritmo.":n>=60?" Si può fare ancora meglio.":" Ogni pasto segnato aiuta."}`}</div></div></section>`}function Ti(t,{data:a,idPiano:e,settimana:i,locali:n}){t.querySelectorAll("[data-segna]").forEach(l=>l.addEventListener("click",()=>{const o=l.dataset.segna,s=l.closest(".oggi-pasto");if(!s)return;const c=s.dataset.esito?null:"fatto";window.__vibra&&window.__vibra(c==="fatto"?"ok":"leggera"),ki(s,c),n&&n.set(o,c);const d=t.querySelector("#oggi-suggerimento");d&&d.remove();let p=i.find(f=>f.data===a&&f.pasto===o);p||(p={data:a,pasto:o},i.push(p)),p.esito=c;const m=t.querySelector(".oggi-sett");m&&(m.outerHTML=ne(i));const g={data:a,id_piano:e,pasto:o,esito:c};Ea=Ea.then(async()=>{try{const f=await w.segnaDiario(g);f&&f.inCoda||Le("/api/mie/diario","POST",g)}catch(f){await F(f.message||"Non sono riuscito a segnare il pasto."),["/","/oggi"].includes(wt())&&ct()}})}))}async function _i(t){!t||!K()||localStorage.getItem("notifiche-invito")!=="no"&&await Na()==="spente"&&(t.innerHTML=`<div class="invito-notifiche"><div><b>Vuoi ricevere gli avvisi dello studio?</b><span>Appuntamento confermato, risposta della dottoressa, nuova dieta pronta.</span></div>
    <div class="inv-n-azioni"><button class="btn-primario" id="inv-n-si" type="button">Attiva</button><button class="inv-no" id="inv-n-no" type="button">Non ora</button></div></div>`,t.querySelector("#inv-n-si").addEventListener("click",async()=>{var a;try{await Pa({versione:((a=document.querySelector('meta[name="app-versione"]'))==null?void 0:a.content)||""})}catch{}localStorage.setItem("notifiche-invito","no"),t.innerHTML=""}),t.querySelector("#inv-n-no").addEventListener("click",()=>{localStorage.setItem("notifiche-invito","no"),t.innerHTML=""}))}function Mi(t){try{const[a,e,i]=String(t).slice(0,10).split("-");return new Date(+a,+e-1,+i).toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long"})}catch{return t}}function zi(t){if(t==null)return"";const a=Math.floor(t/60),e=t%60;return`${a}:${String(e).padStart(2,"0")}`}async function Qt(){Q();let t=[],a=[];try{t=(await w.mieiDocumenti()).documenti||[],a=(await w.mieFatture()).fatture||[]}catch(o){h.innerHTML=A(q(o.message,"errore"),"documenti");return}const e={dieta:"Piano alimentare",fattura:"Fattura",analisi:"Analisi",documento:"Documento"};h.innerHTML=A(`
    <section class="blocco">
      <h2>Carica un documento</h2>
      <p class="piccolo">Analisi, referti o altro da mostrare alla dottoressa.
      PDF o foto, fino a 10 MB.</p>
      <label class="carica">
        <input type="file" id="file" accept="application/pdf,image/jpeg,image/png,image/heic,image/webp" hidden>
        <span id="carica-et">Scegli un file dal dispositivo</span>
      </label>
      <div id="carica-esito"></div>
    </section>
    ${a.length?`<section class="blocco">
      <h2>Le tue fatture</h2>
      ${a.map(o=>`<div class="riga-doc">
        <div class="doc-icona">€</div>
        <div class="doc-testo">
          <div class="doc-tit">Fattura n. ${b(o.numero)}</div>
          <div class="doc-sub">${b(Z(o.data))}${o.totale!=null?" · "+Number(o.totale).toFixed(2).replace(".",",")+" €":""}</div>
        </div>
      </div>`).join("")}
      <p class="piccolo">Per una copia della fattura contatta lo studio.</p>
    </section>`:""}
    ${t.length?`<section class="blocco">
      <h2>I tuoi documenti</h2>
      ${t.map(o=>`<div class="riga-doc">
        <div class="doc-icona">${o.categoria==="fattura"?"€":o.categoria==="analisi"?"⚕":"☰"}</div>
        <div class="doc-testo">
          <div class="doc-tit">${b(o.titolo)}</div>
          <div class="doc-sub">${b(e[o.categoria]||"Documento")} · ${b(Z(o.creato_il))}${o.caricato_da==="paziente"?" · caricato da te":""}</div>
        </div>
        <div class="doc-azioni">
          <button class="mini" data-apri="${b(o.id)}">Apri</button>
          ${o.caricato_da==="paziente"?`<button class="mini mini-no" data-canc="${b(o.id)}">×</button>`:""}
        </div>
      </div>`).join("")}
    </section>`:`<div class="vuoto">
      <p>Non ci sono ancora documenti nella tua area.</p>
      <p class="piccolo">Qui troverai fatture e referti condivisi con lo studio.</p>
    </div>`}`,"documenti"),h.querySelectorAll("[data-apri]").forEach(o=>o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Apro…";try{const s=await w.linkDocumento(o.dataset.apri);await Te({url:s.url,nome:s.titolo,mime:s.mime})}catch(s){await F(s.message||"Documento non aperto.")}o.disabled=!1,o.textContent="Apri"})),h.querySelectorAll("[data-canc]").forEach(o=>o.addEventListener("click",async()=>{if(await nt("Vuoi rimuovere questo documento?",{ok:"Rimuovi",pericolo:!0}))try{await w.eliminaDocumento(o.dataset.canc),await Qt()}catch(s){await F(s.message)}}));const i=document.getElementById("file"),n=document.getElementById("carica-et"),l=document.getElementById("carica-esito");i.addEventListener("change",async()=>{const o=i.files&&i.files[0];if(o){if(o.size>10*1024*1024){l.innerHTML=q("Il file supera 10 MB. Riducilo o invialo allo studio.","errore");return}n.textContent="Carico…",l.innerHTML="";try{const s=await new Promise((c,d)=>{const p=new FileReader;p.onload=()=>c(String(p.result).split(",")[1]),p.onerror=()=>d(new Error("Lettura del file non riuscita.")),p.readAsDataURL(o)});await w.caricaDocumento({titolo:o.name,categoria:"analisi",mime:o.type,contenuto:s}),await Qt()}catch(s){n.textContent="Scegli un file dal dispositivo",l.innerHTML=q(s.message,"errore")}}})}async function se(){Q();let t={appuntamenti:[],richieste:[]};try{t=await w.mieiAppuntamenti()}catch(o){h.innerHTML=A(q(o.message,"errore"),"appuntamenti");return}const a=o=>(o.control_count||0)*10+(o.prima_count||0)*30,e=(t.richieste||[]).filter(o=>o.stato==="in_attesa"),i=Date.now()-30*864e5,n=(t.richieste||[]).filter(o=>o.stato==="rifiutata"&&new Date(o.decisa_il||o.creata_il||0).getTime()>i);h.innerHTML=A(`
    ${t.appuntamenti.length?`<section class="blocco">
      <h2>I tuoi prossimi appuntamenti</h2>
      ${t.appuntamenti.map(o=>`<div class="carta carta-app">
        <div class="carta-tit">${b(at(o.data))}</div>
        <div class="carta-sub">Ore ${it(o.inizio_min)} · ${a(o)} minuti</div>
      </div>`).join("")}
    </section>`:'<div class="vuoto"><p>Non hai appuntamenti in programma.</p></div>'}

    ${e.length?`<section class="blocco">
      <h2>Richieste in attesa</h2>
      <p class="piccolo">Lo studio ti confermerà al più presto.</p>
      ${e.map(o=>`<div class="carta carta-attesa">
        <div class="carta-tit">${b(at(o.data))} · ore ${it(o.inizio_min)}</div>
          <div class="carta-sub">In attesa di conferma${o.data_alt?` · riserva: ${b(at(o.data_alt))} alle ${it(o.inizio_min_alt)}`:""}</div>
        <button class="link-ritira" data-ritira="${b(o.id)}">Ritira la richiesta</button>
      </div>`).join("")}
      </section>`:""}

      ${n.length?`<section class="blocco">
        <h2>Richieste non accolte</h2>
        ${n.map(o=>`<div class="carta carta-rifiutata">
          <div class="carta-tit">${b(at(o.data))} · ore ${it(o.inizio_min)}</div>
          <div class="carta-sub">Lo studio non ha potuto accoglierla${o.motivo?": <b>"+b(o.motivo)+"</b>":"."}</div>
        </div>`).join("")}
        <p class="piccolo">Puoi chiedere un altro orario qui sotto.</p>
      </section>`:""}

      <section class="blocco">
        <button class="btn-primario" id="chiedi">Chiedi un appuntamento</button>
      <p class="piccolo">Scegli giorno e ora fra quelli liberi: la richiesta viene
      confermata dallo studio.</p>
    </section>`,"appuntamenti");const l=document.getElementById("chiedi");l&&l.addEventListener("click",()=>{location.hash="#/chiedi"}),h.querySelectorAll("[data-ritira]").forEach(o=>o.addEventListener("click",async()=>{if(await nt("Vuoi ritirare questa richiesta?",{ok:"Ritira"}))try{await w.ritiraRichiesta(o.dataset.ritira),await se()}catch(s){await F(s.message)}}))}async function qi(){let t="controllo",a=[],e=null,i=null,n=!1,l="";async function o(){h.innerHTML=A('<div class="centro"><div class="spinner"></div></div>',"appuntamenti");try{a=(await w.disponibilita(t)).giorni||[]}catch(c){h.innerHTML=A(q(c.message,"errore"),"appuntamenti");return}s()}function s(){h.innerHTML=A(`
      <section class="blocco">
        <h2>Chiedi un appuntamento</h2>
        <p class="piccolo">Scegli fra gli orari liberi. La richiesta viene confermata
        dallo studio: riceverai un messaggio appena è fissata.</p>
        <div class="scelta-tipo">
          <button class="pillola ${t==="controllo"?"attiva":""}" data-tipo="controllo">Controllo <small>10 min</small></button>
          <button class="pillola ${t==="prima"?"attiva":""}" data-tipo="prima">Prima visita <small>30 min</small></button>
        </div>
      </section>
      ${a.length?a.map(g=>`
        <section class="blocco">
          <h2>${b(at(g.data))}</h2>
          <div class="orari">${g.orari.map(f=>`<button class="ora ${e&&e.data===g.data&&e.ora===f?"scelta":""}"
               data-data="${g.data}" data-ora="${f}">${it(f)}</button>`).join("")}</div>
        </section>`).join(""):`<div class="vuoto">
          <p>Non ci sono orari liberi nei prossimi giorni.</p>
          <p class="piccolo">Puoi metterti in lista d’attesa: lo studio ti contatterà
          appena si libera un posto, senza che tu debba ricontrollare ogni giorno.</p>
          <a href="#/attesa" class="collega-attesa">Mettiti in lista d’attesa</a>
        </div>`}
    <p class="piccolo" style="text-align:center;margin-top:16px">
      Nessun orario ti va bene? <a href="#/attesa">Mettiti in lista d’attesa</a>
      e ti avvisiamo appena si libera un posto.</p>
      ${e?`<section class="blocco barra-conferma">
        <div class="riepilogo">Hai scelto <b>${b(at(e.data))}</b> alle <b>${it(e.ora)}</b></div>
        <label for="note-ric" class="nota-ric-et">Nota per lo studio <span>(facoltativa: la leggono la segreteria e la dottoressa)</span></label>
        <textarea id="note-ric" rows="3" maxlength="300" placeholder="Es.: preferirei di pomeriggio, oppure: vorrei parlare dei risultati delle analisi">${b(l)}</textarea>
          ${i?`<div class="riepilogo riserva-riep">Orario di riserva: <b>${b(at(i.data))}</b> alle <b>${it(i.ora)}</b>
            <button class="link-ritira" id="togli-riserva">Togli</button></div>`:`<button class="btn-secondario" id="aggiungi-riserva">${n?"Tocca un altro orario libero qui sopra…":"+ Aggiungi un orario di riserva (facoltativo)"}</button>`}
        <button class="btn-primario" id="invia">Invia la richiesta</button>
        <p class="piccolo">Non è ancora un appuntamento fissato: lo studio deve confermarlo.</p>
      </section>`:""}`,"appuntamenti");const c=()=>{const g=document.getElementById("note-ric");g&&(l=g.value)};h.querySelectorAll("[data-tipo]").forEach(g=>g.addEventListener("click",()=>{t=g.dataset.tipo,e=null,i=null,n=!1,o()})),h.querySelectorAll("[data-ora]").forEach(g=>{i&&g.dataset.data===i.data&&Number(g.dataset.ora)===i.ora&&g.classList.add("riserva-scelta")});const d=document.getElementById("aggiungi-riserva");d&&d.addEventListener("click",()=>{c(),n=!0,s()});const p=document.getElementById("togli-riserva");p&&p.addEventListener("click",()=>{c(),i=null,s()}),h.querySelectorAll("[data-ora]").forEach(g=>g.addEventListener("click",()=>{c();const f={data:g.dataset.data,ora:Number(g.dataset.ora)};if(n&&e){n=!1,(f.data!==e.data||f.ora!==e.ora)&&(i=f),s();const I=document.querySelector(".barra-conferma");I&&I.scrollIntoView({behavior:"smooth",block:"center"});return}e=f,i&&i.data===e.data&&i.ora===e.ora&&(i=null),s();const S=document.querySelector(".barra-conferma");S&&S.scrollIntoView({behavior:"smooth",block:"center"})}));const m=document.getElementById("invia");m&&m.addEventListener("click",async()=>{m.disabled=!0,m.textContent="Invio…";try{await w.chiediAppuntamento({data:e.data,inizio_min:e.ora,tipo:t,note:(document.getElementById("note-ric")||{}).value||"",...i?{data_alt:i.data,inizio_min_alt:i.ora}:{}}),l="",i=null,Ri("/appuntamenti")}catch(g){m.disabled=!1,m.textContent="Invia la richiesta",await F(g.message),o()}})}await o()}let W=12;async function le(){Q();let t={circonferenze:[],pliche:[]};try{t=await w.mieMisure()}catch(n){h.innerHTML=A(q(n.message,"errore"),"progressi");return}const a=t.circonferenze||[],e=t.pliche||[];if(!a.length&&!e.length){h.innerHTML=A(`<div class="vuoto">
      <p>Non ci sono ancora misurazioni registrate.</p>
      <p class="piccolo">Compariranno qui dopo le prime rilevazioni in studio.</p>
    </div>`,"progressi");return}const i=(n,l,o)=>{const s=Y(n,l,o).punti;if(s.length<2)return"";const c=s[0],d=s[s.length-1],p=d.valore-c.valore,m=p>0?"+":"";return`<div class="conf">
      <span>${b(o)}</span>
      <b>${d.valore} cm</b>
      <i class="${p<0?"giu":p>0?"su":""}">${m}${p.toFixed(1)} dall’inizio</i>
    </div>`};h.innerHTML=A(`
    <div class="scelta-tipo" style="margin-bottom:14px">
      ${[[12,"Ultime 12"],[24,"Ultime 24"],[0,"Tutto"]].map(([n,l])=>`<button class="pillola ${W===n?"attiva":""}" data-punti="${n}">${l}</button>`).join("")}
    </div>
    ${a.length?`<section class="blocco">
      <h2>Circonferenze principali</h2>
      ${Bt([Y(a,"vita","Vita",W),Y(a,"addome","Addome",W),Y(a,"fianchi","Fianchi",W)],{larghezza:340,altezza:200})}
      <div class="confronti">
        ${i(a,"vita","Vita")}${i(a,"addome","Addome")}${i(a,"fianchi","Fianchi")}
      </div>
    </section>

    <section class="blocco">
      <h2>Altre circonferenze</h2>
      ${Bt([Y(a,"torace","Torace",W),Y(a,"coscia_dx","Coscia",W),Y(a,"braccio_dx","Braccio",W)],{larghezza:340,altezza:180})}
    </section>`:""}

    ${e.length?`<section class="blocco">
      <h2>Pliche</h2>
      ${Bt([Y(e,"addome","Addome",W),Y(e,"tricipide_dx","Tricipite",W),Y(e,"sotto_scapolare","Sottoscapolare",W)],{larghezza:340,altezza:180})}
    </section>`:""}

    <p class="piccolo" style="text-align:center">Ultima rilevazione:
      ${b(Z((a[a.length-1]||e[e.length-1]||{}).data))}</p>`,"progressi"),h.querySelectorAll("[data-punti]").forEach(n=>n.addEventListener("click",()=>{W=Number(n.dataset.punti),le()}))}function Ci(){const t=sessionStorage.getItem("motivo-blocco")||"",a=!!U.leggi();h.innerHTML=`
    <div class="accesso">
      <div class="marchio">
        <h1>Studio Dott.ssa Tramontano</h1>
        <p>Area riservata</p>
      </div>
      <div class="scheda" style="text-align:center">
        <div style="font-size:34px;margin-bottom:10px">⏱</div>
        <p style="line-height:1.55">${b(t||"L’accesso all’area riservata è riservato ai pazienti in corso di percorso.")}</p>
        <p class="piccolo" style="margin-top:12px">${b(Oa)}</p>
        <a class="btn-primario riservato-controllo" href="${Pe}" target="_blank" rel="noopener">Prenota un controllo</a>
        <button class="btn-secondario" id="esci2" style="margin-top:10px">${a?"Esci":"Torna all’accesso"}</button>
      </div>
    </div>`,document.getElementById("esci2").addEventListener("click",async()=>{if(a){try{await ea()}catch{}try{await w.esci()}catch{}}U.togli(),sessionStorage.clear(),location.hash="#/accesso"})}let tt=0,B="oggi",rt=!1,Ot=null,jt="",Rt=0,pt=0,Ft=null;async function mt({tieni:t=!1}={}){typeof B=="number"&&jt&&jt!==qt()&&(B="oggi",t=!1),Q();let a=[],e=null,i=null;if(t&&Ft)a=Ft;else{i=Ii(),i!=null&&(e=w.spesa(i,tt,B).catch(()=>null));try{a=(await w.mieDiete()).diete||[]}catch(r){h.innerHTML=A(q(r.message,"errore"),"spesa");return}Ft=a}if(!a.length){h.innerHTML=A('<div class="vuoto"><p>Non hai ancora un piano alimentare.</p></div>',"spesa");return}const n=a[0];let l=e&&String(n.id)===String(i)?await e:null;if(!l)try{l=await w.spesa(n.id,tt,B)}catch(r){h.innerHTML=A(q(r.message,"errore"),"spesa");return}if(B==="oggi")if(l.giornoScelto!=null)B=l.giornoScelto,Ot=l.giornoScelto,jt=qt();else return B=null,mt();const o=l.reparti||[],s=o.reduce((r,u)=>r+u.voci.length,0),c=o.reduce((r,u)=>r+u.voci.filter(E=>E.preso).length,0),d=s-c,p=l.settimane||[],m=(l.giorni||[]).filter(r=>!r.libero),f=["Domenica","Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato"][new Date().getDay()].toLowerCase(),S=`
    <div class="scelta-tipo" style="margin-bottom:10px">
      ${m.length?`<button class="pillola ${B!==null?"attiva":""}"
        data-giorni="1">Un giorno</button>`:""}
      ${p.map(r=>`<button class="pillola ${B===null&&tt===r?"attiva":""}"
        data-sett="${r}">Settimana ${r}</button>`).join("")}
      <button class="pillola ${B===null&&tt===0?"attiva":""}"
        data-sett="0">Tutto</button>
    </div>
    ${B!==null&&m.length?`<div class="giorni-riga">
      ${m.map(r=>`<button class="pillola-g ${B===r.i?"attiva":""}"
        data-g="${r.i}">${b(r.label)}${r.settimana?`<small>${r.settimana}ª sett.</small>`:""}
        ${(Ot!=null?r.i===Ot:String(r.label||"").toLowerCase().includes(f))?"<i>oggi</i>":""}</button>`).join("")}
    </div>`:""}`,I=r=>`
    <label class="spesa-voce ${r.preso?"presa":""}">
      <input type="checkbox" data-al="${b(r.alimento)}" ${r.preso?"checked":""}>
      <span class="spesa-nome">${b(r.alimento)}</span>
      <span class="spesa-qta">${b(r.qb?"q.b.":r.acquisto||"")}</span>
    </label>`;h.innerHTML=A(`
    ${l.avviso?`<div class="avviso">${b(l.avviso)}</div>`:""}
    ${S}
    ${s?`<div class="spesa-testa">
      <div class="spesa-azioni"><button class="lb-mini" type="button" id="spesa-condividi">↗ Condividi</button><button class="lb-mini" type="button" id="spesa-stampa">🖶 Stampa</button></div>
      <div class="spesa-conta"><b>${d}</b> da prendere${c?` · ${c} nel carrello`:""}</div>
      <div class="spesa-barra"><i style="width:${s?Math.round(c/s*100):0}%"></i></div>
    </div>`:""}

    ${(()=>{const r=o.map(u=>{const E=rt?u.voci:u.voci.filter(y=>!y.preso);return E.length?`<section class="blocco">
        <h2>${b(u.nome)}</h2>
        <div class="spesa-lista">${E.map(I).join("")}</div>
      </section>`:""}).join("");return r?`<div class="spesa-reparti">${r}</div>`:`<div class="vuoto">
      <p>${c?"Hai preso tutto!":"Nessun alimento in questa lista."}</p>
      ${c?'<p class="piccolo">Buona spesa finita.</p>':""}
    </div>`})()}

    ${c?`<button class="btn-secondario" id="mostra-presi">
      ${rt?"Nascondi ciò che ho preso":"Mostra anche ciò che ho preso ("+c+")"}
    </button>`:""}

    ${(l.nonRiconosciuti||[]).length?`<section class="blocco">
      <h2>Da controllare</h2>
      <p class="piccolo">Questi non sono stati riconosciuti automaticamente: guarda il piano
      per le quantità esatte.</p>
      <div class="piccolo">${l.nonRiconosciuti.map(b).join(" · ")}</div>
    </section>`:""}`,"spesa"),h.querySelectorAll("[data-sett]").forEach(r=>r.addEventListener("click",()=>{tt=Number(r.dataset.sett),B=null,mt()}));const _=h.querySelector("[data-giorni]");_&&_.addEventListener("click",()=>{B="oggi",mt()});const T=h.querySelector(".giorni-riga"),D=()=>h.querySelector(".contenuto");if(t){const r=D();r&&(r.scrollTop=pt),pt&&window.scrollY!==pt&&(!r||r.scrollTop===0)&&window.scrollTo(0,pt)}if(T){const r=()=>{const u=T.querySelector(".pillola-g.attiva");return u&&(T.scrollLeft+=u.getBoundingClientRect().left-T.getBoundingClientRect().left),Rt=T.scrollLeft,T.scrollLeft};if(t)T.scrollLeft=Rt;else{const u=r();document.fonts&&document.fonts.status!=="loaded"&&document.fonts.ready.then(()=>{T.isConnected&&T.scrollLeft===u&&r()}).catch(()=>{})}T.addEventListener("scroll",()=>{Rt=T.scrollLeft},{passive:!0})}const x=()=>{if(!h.querySelector(".spinner")){const r=D();pt=r&&r.scrollTop?r.scrollTop:window.scrollY}return mt({tieni:!0})};h.querySelectorAll("[data-g]").forEach(r=>r.addEventListener("click",()=>{B=Number(r.dataset.g),x()}));const k=document.getElementById("mostra-presi");k&&k.addEventListener("click",()=>{rt=!rt,x()});const L=()=>o.map(r=>r.nome.toUpperCase()+`
`+r.voci.filter(u=>!u.preso).map(u=>"• "+u.alimento+(u.qb?" q.b.":u.acquisto?" — "+u.acquisto:"")).join(`
`)).join(`

`),P=h.querySelector("#spesa-condividi");P&&P.addEventListener("click",()=>xa({titolo:"Lista della spesa",testo:`Lista della spesa

`+L()}));const H=()=>{const r=new Map([...h.querySelectorAll(".spesa-voce input")].map(y=>[y.dataset.al,y.checked])),u=B!==null?(l.giorni||[]).find(y=>y.i===B):null,E=u?u.label+(u.settimana&&p.length>1?`, ${u.settimana}ª settimana`:""):tt?`Settimana ${tt}`:"Tutto il piano";return Re({reparti:o.map(y=>({nome:y.nome,voci:y.voci.map(v=>({...v,preso:r.has(v.alimento)?r.get(v.alimento):!!v.preso}))})),periodo:E,piano:n.tipo_dieta||"",conPresi:rt,nonRiconosciuti:l.nonRiconosciuti||[]})};kt(r=>Ut({...H(),soloComponi:r}));const V=h.querySelector("#spesa-stampa");V&&V.addEventListener("click",()=>Ut(H())),h.querySelectorAll(".spesa-voce input").forEach(r=>r.addEventListener("change",async()=>{const u=r.closest(".spesa-voce");u.classList.toggle("presa",r.checked);try{await w.spuntaSpesa({piano:n.id,settimana:B!==null?-(B+1):tt,alimento:r.dataset.al,preso:r.checked}),!rt&&r.checked?(u.classList.add("sparisce"),setTimeout(x,260)):x()}catch(E){r.checked=!r.checked,u.classList.toggle("presa",r.checked),await F("Non sono riuscito a registrarlo: "+E.message)}}))}async function Tt(){Q();let t=[];try{t=(await w.appunti()).appunti||[]}catch(s){h.innerHTML=A(q(s.message,"errore"),"appunti");return}const a=t.filter(s=>!s.inviato),e=t.filter(s=>s.inviato),i=s=>Z(String(s||"").slice(0,10));h.innerHTML=A(`
    <section class="blocco">
      <h2>Scrivi un appunto</h2>
      <div class="scheda-chiara">
        <textarea id="ap-testo" rows="4" placeholder="Come ti senti, una domanda per la dottoressa, un promemoria…"></textarea>
        <div class="ap-azioni">
          <button class="btn-primario" id="ap-salva">Salva per me</button>
          <button class="btn-secondario" id="ap-invia">Salva e invia allo studio</button>
        </div>
        <div id="ap-esito"></div>
        <p class="piccolo" style="margin-top:8px">Gli appunti che salvi per te
        <b>non vengono letti da nessuno</b>. Solo quelli che scegli di inviare
        arrivano allo studio.</p>
      </div>
    </section>

    ${a.length?`<section class="blocco">
      <h2>I tuoi appunti</h2>
      ${a.map(s=>`<div class="ap-voce">
        <div class="ap-testo">${b(s.testo)}</div>
        <div class="ap-piede">
          <span>${b(i(s.creato_il))}</span>
          <span class="ap-cmd">
            <button class="mini" data-invia="${b(s.id)}">Invia allo studio</button>
            <button class="mini mini-no" data-canc="${b(s.id)}">×</button>
          </span>
        </div>
      </div>`).join("")}
    </section>`:""}

    ${e.length?`<section class="blocco">
      <h2>Inviati allo studio</h2>
      ${e.map(s=>`<div class="ap-voce inviato">
        <div class="ap-testo">${b(s.testo)}</div>
        <div class="ap-piede">
          <span>${b(i(s.inviato_il||s.creato_il))} · ${s.letto?"letto dallo studio":"in attesa di lettura"}</span>
          <span class="ap-cmd">
            <button class="mini mini-no" data-canc="${b(s.id)}" data-letto="${s.letto||s.risposta?"1":"0"}" aria-label="Elimina">×</button>
          </span>
        </div>
        ${s.risposta?`<div class="ap-risposta">
          <b>Risposta dello studio</b>
          <div>${b(s.risposta)}</div>
        </div>`:""}
      </div>`).join("")}
    </section>`:""}

    ${t.length?"":`<div class="vuoto">
      <p>Non hai ancora scritto nulla.</p>
      <p class="piccolo">Usa questo spazio per i tuoi promemoria, o per segnalare
      qualcosa alla dottoressa.</p>
    </div>`}`,"appunti");const n=document.getElementById("ap-testo"),l=document.getElementById("ap-esito"),o=async s=>{const c=n.value.trim();if(!c){l.innerHTML=q("Scrivi qualcosa prima di salvare.","errore");return}if(!(s&&!await nt(`Inviare questo appunto allo studio?

Finché lo studio non l’ha letto potrai ancora eliminarlo.`,{ok:"Invia"})))try{await w.nuovoAppunto({testo:c,inviato:s}),n.value="",await Tt()}catch(d){l.innerHTML=q(d.message,"errore")}};document.getElementById("ap-salva").addEventListener("click",()=>o(!1)),document.getElementById("ap-invia").addEventListener("click",()=>o(!0)),h.querySelectorAll("[data-invia]").forEach(s=>s.addEventListener("click",async()=>{if(await nt(`Inviare questo appunto allo studio?

Finché lo studio non l’ha letto potrai ancora eliminarlo.`,{ok:"Invia"}))try{await w.modificaAppunto({id:s.dataset.invia,inviato:!0}),await Tt()}catch(c){await F(c.message)}})),h.querySelectorAll("[data-canc]").forEach(s=>s.addEventListener("click",async()=>{const d=!!s.closest(".ap-voce.inviato")?s.dataset.letto==="1"?`Togliere questo appunto dalla tua lista?

Lo studio l’ha già letto e lo conserva nella tua scheda.`:`Eliminare questo appunto?

Lo studio non l’ha ancora letto: non lo riceverà.`:"Eliminare questo appunto?";if(await nt(d,{ok:"Elimina",pericolo:!0})){s.disabled=!0;try{await w.eliminaAppunto(s.dataset.canc),await Tt()}catch(p){s.disabled=!1,await F(p.message)}}}))}async function Yt(){Q();let t=[];try{t=(await w.mieAttese()).attese||[]}catch(s){h.innerHTML=A(q(s.message,"errore"),"appuntamenti");return}const a=t[0]||null,e={mattina:"solo la mattina",pomeriggio:"solo il pomeriggio",tutte:"qualsiasi orario"};h.innerHTML=A(`
    ${a?`<section class="blocco">
      <h2>Sei in lista d’attesa</h2>
      <div class="scheda-chiara">
        <div class="dato"><span>Tipo di visita</span><b>${a.tipo==="prima"?"Prima visita":"Controllo"}</b></div>
        <div class="dato"><span>Preferenza</span><b>${b(e[a.fascia]||"qualsiasi orario")}</b></div>
        ${a.entro?`<div class="dato"><span>Non oltre il</span><b>${b(Z(a.entro))}</b></div>`:""}
        ${a.note?`<div class="dato"><span>Nota</span><b>${b(a.note)}</b></div>`:""}
      </div>
      <p class="piccolo" style="margin-top:10px">Lo studio ti contatterà appena
      si libera un posto compatibile con le tue preferenze.</p>
      <button class="btn-secondario" id="att-esci" style="margin-top:12px">Togliti dalla lista</button>
    </section>`:`<section class="blocco">
      <h2>Mettiti in lista d’attesa</h2>
      <p class="piccolo">Se non trovi un orario che ti va bene, lascia qui le tue
      preferenze: verrai contattato appena si libera un posto.</p>
      <div class="scheda-chiara">
        <label>Tipo di visita</label>
        <div class="scelta-tipo">
          <button class="pillola attiva" data-t="controllo">Controllo</button>
          <button class="pillola" data-t="prima">Prima visita</button>
        </div>

        <label style="margin-top:14px">Quando ti farebbe comodo</label>
        <div class="scelta-tipo">
          <button class="pillola attiva" data-f="tutte">Indifferente</button>
          <button class="pillola" data-f="mattina">Mattina</button>
          <button class="pillola" data-f="pomeriggio">Pomeriggio</button>
        </div>

        <label for="att-entro" style="margin-top:14px">Non oltre il (facoltativo)</label>
        <input id="att-entro" type="date" min="${new Date().toISOString().slice(0,10)}">

        <label for="att-note" style="margin-top:12px">Note per lo studio (facoltative)</label>
        <textarea id="att-note" rows="2" placeholder="es. preferirei il giovedì, oppure dopo le 17"></textarea>

        <div id="att-esito"></div>
        <button class="btn-primario" id="att-ok" style="margin-top:12px">Mettimi in lista</button>
      </div>
    </section>`}`,"appuntamenti");const i=document.getElementById("att-esci");i&&i.addEventListener("click",async()=>{if(await nt("Vuoi toglierti dalla lista d’attesa?",{ok:"Togli"}))try{await w.togliAttesa(a.id),await Yt()}catch(s){await F(s.message)}});let n="controllo",l="tutte";h.querySelectorAll("[data-t]").forEach(s=>s.addEventListener("click",()=>{n=s.dataset.t,h.querySelectorAll("[data-t]").forEach(c=>c.classList.toggle("attiva",c===s))})),h.querySelectorAll("[data-f]").forEach(s=>s.addEventListener("click",()=>{l=s.dataset.f,h.querySelectorAll("[data-f]").forEach(c=>c.classList.toggle("attiva",c===s))}));const o=document.getElementById("att-ok");o&&o.addEventListener("click",async()=>{o.disabled=!0,o.textContent="Attendi…";try{await w.iscriviAttesa({tipo:n,fascia:l,entro:document.getElementById("att-entro").value||null,note:document.getElementById("att-note").value}),await Yt()}catch(s){document.getElementById("att-esito").innerHTML=q(s.message,"errore"),o.disabled=!1,o.textContent="Mettimi in lista"}})}async function Di(){Q();const t=new Date;t.setMinutes(t.getMinutes()-t.getTimezoneOffset());const a=t.toISOString().slice(0,10),e=w.diario(a,a).catch(()=>({})),i=g=>[...g].sort((f,S)=>String(S.created_at||"").localeCompare(String(f.created_at||"")))[0],n=w.mieDiete(),l=ee(n.catch(()=>({})),i);let o=[];try{o=(await n).diete||[]}catch(g){h.innerHTML=A(q(g.message,"errore"),"diario");return}if(!o.length){h.innerHTML=A('<div class="vuoto"><p>Il diario si attiva quando lo studio ti consegna il primo piano.</p></div>',"diario");return}const s=i(o);let c=await l;if(!c)try{c=await w.miaDieta(s.id)}catch(g){h.innerHTML=A(q(g.message,"errore"),"diario");return}h.innerHTML=A('<div id="diario-box" class="diario"></div>',"diario");const d=document.getElementById("diario-box");let p=e;const m=g=>{const f=g===a?p:null;return p=null,ri(d,{piano:c.piano,idPiano:s.id,inizio:c.prima_apertura||c.created_at,data:g,ridisegna:m,vociP:f})};await m(a)}async function Ni(){h.innerHTML=A('<h2 class="titolo-sezione">I tuoi allenamenti</h2><div id="all-box" class="allenamenti"><div class="piccolo">Carico…</div></div>',"allenamenti"),await be(document.getElementById("all-box"))}async function Pi(){Q();let t=[];try{t=(await w.ricette()).ricette||[]}catch(e){h.innerHTML=A(q(e.message,"errore"),"diete");return}const a={colazione:"Colazione",spuntino_m:"Spuntino",pranzo:"Pranzo",spuntino_p:"Merenda",cena:"Cena"};h.innerHTML=A(`
    <h2 class="titolo-sezione">Le ricette del tuo piano</h2>
    ${t.length?t.map(e=>`<article class="ricetta">
        <p class="ricetta-quando">${b(a[e.pasto]||"")} · ${b(e.giorni.join(", "))}</p>
        <h3>${b(e.piatto)}</h3>
        <p class="ricetta-testo">${b(e.ricetta)}</p>
      </article>`).join(""):'<div class="vuoto"><p>Nel tuo piano attuale non ci sono ricette.</p><p class="piccolo">Quando la dottoressa ne aggiunge una a un pasto, la trovi qui.</p></div>'}
  `,"diete")}async function Jt(t){if(!t)return;if(K())return Zt(t);const a=await ye();t.innerHTML=`<h2>Notifiche</h2><p class="piccolo">${$e[a]}</p>`+(a==="spente"?'<button class="btn-primario" id="not-attiva">Attiva le notifiche</button>':a==="attive"?'<button class="btn-secondario" id="not-spegni">Disattiva su questo telefono</button>':a==="installa"?'<a class="btn-secondario" href="#/installa" style="display:inline-block;text-decoration:none">Come si installa</a>':"");const e=t.querySelector("#not-attiva"),i=t.querySelector("#not-spegni");e&&e.addEventListener("click",async()=>{e.disabled=!0;try{await we(Vt,n=>w.iscriviPush(n))}catch(n){await F(n.message)}Jt(t)}),i&&i.addEventListener("click",async()=>{await Se(n=>w.cancellaPush(n)),Jt(t)})}async function Zt(t){const a=await Na(),e={attive:"Le notifiche sono attive su questo telefono (e sull’Apple Watch abbinato, se c’è).",spente:"Attivale per sapere subito quando la dottoressa conferma un appuntamento, risponde a un messaggio o pubblica la nuova dieta.",negate:"Le notifiche sono bloccate: vanno riattivate dalle impostazioni del telefono, alla voce di questa app.",impossibile:"Le notifiche non sono disponibili su questo dispositivo."};t.innerHTML=`<h2>Notifiche</h2><p class="piccolo">${e[a]||""}</p>`+(a==="spente"?'<button class="btn-primario" id="not-attiva">Attiva le notifiche</button>':a==="attive"?'<button class="btn-secondario" id="not-spegni">Disattiva su questo telefono</button>':"");const i=t.querySelector("#not-attiva"),n=t.querySelector("#not-spegni");i&&i.addEventListener("click",async()=>{var l;i.disabled=!0;try{await Pa({versione:((l=document.querySelector('meta[name="app-versione"]'))==null?void 0:l.content)||""})}catch(o){await F(o.message)}setTimeout(()=>Zt(t),800)}),n&&n.addEventListener("click",async()=>{await Ie(),Zt(t)})}async function re(){Q();let t={},a=null;try{const d=await w.mieiDati();t=d.dati||{},a=d.proposta}catch(d){h.innerHTML=A(q(d.message,"errore"),"anagrafica");return}const e=d=>b(d||"—");h.innerHTML=A(`
    <section class="blocco">
      <h2>I tuoi dati</h2>
      <div class="scheda-chiara">
        <div class="dato"><span>Cognome e nome</span><b>${e([t.cognome,t.nome].filter(Boolean).join(" "))}</b></div>
        <div class="dato"><span>Data di nascita</span><b>${e(Z(t.data_nascita))}</b></div>
        <p class="piccolo" style="margin:8px 0 0">Per correggere questi dati contatta lo studio.</p>
      </div>
    </section>

    <section class="blocco">
      <h2>I tuoi recapiti</h2>
      ${a?`<div class="avviso">Hai già proposto una correzione: lo studio la
        applicherà al più presto. Inviandone un'altra sostituirai questa.</div>`:""}
      <div class="scheda-chiara">
        <label for="an-tel">Telefono</label>
        <input id="an-tel" type="tel" value="${b(t.telefono||"")}" placeholder="es. 333 1234567">
        <label for="an-mail">E-mail</label>
        <input id="an-mail" type="email" value="${b(t.email||"")}" placeholder="nome@esempio.it">
        <label for="an-citta">Città</label>
        <input id="an-citta" value="${b(t.citta||"")}">
        <div id="an-esito"></div>
        <button class="btn-primario" id="an-salva">Proponi la correzione</button>
        <p class="piccolo" style="margin-top:10px">La correzione viene applicata dallo studio:
        fino ad allora restano validi i recapiti attuali.</p>
      </div>
    </section>

    <section class="blocco">
      <h2>Quando preferisci venire</h2>
      <p class="piccolo">Chiedendo un appuntamento vedrai prima gli orari che
      ti vanno bene. Puoi sempre scegliere di vedere tutti gli altri.</p>
      <div class="scheda-chiara">
        <label>Giorni della settimana</label>
        <div class="giorni-scelta" id="pf-giorni"></div>

        <label style="margin-top:14px">Momento della giornata</label>
        <div class="scelta-tipo" id="pf-fascia">
          <button class="pillola" data-pf="tutte">Indifferente</button>
          <button class="pillola" data-pf="mattina">Mattina</button>
          <button class="pillola" data-pf="pomeriggio">Pomeriggio</button>
        </div>

        <label style="margin-top:14px">Oppure una fascia precisa (facoltativa)</label>
        <div class="fascia-riga">
          <input id="pf-dalle" type="time" step="600">
          <span>—</span>
          <input id="pf-alle" type="time" step="600">
          <button class="mini" id="pf-azzera">Azzera</button>
        </div>

        <div id="pf-esito"></div>
        <button class="btn-primario" id="pf-salva" style="margin-top:12px">Salva le preferenze</button>
      </div>
    </section>

    <section class="blocco">
      <h2>${bt()?"L’app sul telefono":"Tienila a portata di mano"}</h2>
      ${bt()?'<p class="piccolo">Stai usando l’area pazienti come app: è tutto a posto.</p>':`<p class="piccolo">${$t()==="computer"?"Salvala tra i preferiti del browser.":"Mettila sulla schermata Home e aprila con un tocco, come un’app."}</p>
           <a class="btn-secondario" href="#/installa" style="display:inline-block;text-decoration:none">Mostrami come</a>`}
    </section>

    <section class="blocco" id="blocco-notifiche"></section>

    <section class="blocco blocco-account">
      <h2>Il tuo account</h2>
      <p class="piccolo">Puoi chiudere l’accesso online quando vuoi: l’app smette di funzionare su tutti i tuoi dispositivi, e diario, foto dei pasti, allenamenti, appunti non inviati e notifiche vengono eliminati. La tua cartella clinica resta allo studio, che la conserva come previsto dalla legge.</p>
      <p class="piccolo"><a href="${za}" target="_blank" rel="noopener" data-esterno>Informativa sulla privacy</a>: quali dati tratta lo studio, perché e come esercitare i tuoi diritti.</p>
      <button class="lb-mini pericolo" type="button" id="acc-cancella">Cancella il mio account</button>
    </section>

    <section class="blocco">
      <h2>Seguici</h2>
      <p class="piccolo">Ricette, consigli e novità dello studio.</p>
      <div class="social-riga">
        <a href="${St.instagram}" target="_blank" rel="noopener">Instagram</a>
        <a href="${St.facebook}" target="_blank" rel="noopener">Facebook</a>
        <a href="${St.youtube}" target="_blank" rel="noopener">YouTube</a>
        <a href="${St.threads}" target="_blank" rel="noopener">Threads</a>
      </div>
    </section>

    <section class="blocco">
      <h2>Password</h2>
      <p class="piccolo">Quella che ti è stata inviata resta scritta nel messaggio
      che hai ricevuto. Cambiarla è una buona idea.</p>
      <div class="scheda-chiara">
        <label for="pw-vecchia">Password attuale</label>
        <input id="pw-vecchia" type="password" autocomplete="current-password">
        <label for="pw-nuova">Nuova password</label>
        <input id="pw-nuova" type="password" autocomplete="new-password" placeholder="almeno 8 caratteri">
        <label for="pw-ripeti">Ripeti la nuova password</label>
        <input id="pw-ripeti" type="password" autocomplete="new-password">
        <div id="pw-esito"></div>
        <button class="btn-primario" id="pw-salva">Cambia password</button>
        <p class="piccolo" style="margin-top:10px">Dopo il cambio dovrai rientrare
        con la nuova password, anche sugli altri dispositivi.</p>
      </div>
    </section>`,"anagrafica");const i=h.querySelector("#acc-cancella");i&&i.addEventListener("click",async()=>{const d=await ht("Per cancellare l’account scrivi CANCELLA. L’operazione chiude l’accesso online ed elimina diario, foto, allenamenti, appunti non inviati e notifiche.",{ok:"Cancella account",segnaposto:"CANCELLA"});if(d===null||d.trim()!=="CANCELLA")return;const p=await ht("Per sicurezza scrivi la tua password attuale.",{ok:"Conferma",segreto:!0});if(!(p===null||!p.trim()))try{await w.cancellaAccount(p.trim());try{await ea({soloQui:!0})}catch{}U.togli();try{sessionStorage.clear()}catch{}await F("Account cancellato. Grazie di aver usato l’area riservata."),location.href=location.pathname}catch(m){await F(m.message)}});const n=[["1","Lun"],["2","Mar"],["3","Mer"],["4","Gio"],["5","Ven"],["6","Sab"],["0","Dom"]];let l=new Set,o="tutte";try{const d=(await w.preferenze()).preferenze||{};l=new Set(String(d.pref_giorni||"").split(",").filter(Boolean)),o=d.pref_fascia||"tutte";const p=m=>m==null?"":String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");document.getElementById("pf-dalle").value=p(d.pref_dalle),document.getElementById("pf-alle").value=p(d.pref_alle)}catch{}const s=()=>{document.getElementById("pf-giorni").innerHTML=n.map(([d,p])=>`<button class="giorno-b ${l.has(d)?"attivo":""}" data-g="${d}">${p}</button>`).join(""),document.querySelectorAll("#pf-giorni [data-g]").forEach(d=>d.addEventListener("click",()=>{const p=d.dataset.g;l.has(p)?l.delete(p):l.add(p),s()}))};s();const c=()=>{document.querySelectorAll("#pf-fascia [data-pf]").forEach(d=>d.classList.toggle("attiva",d.dataset.pf===o))};document.querySelectorAll("#pf-fascia [data-pf]").forEach(d=>d.addEventListener("click",()=>{o=d.dataset.pf,c()})),c(),document.getElementById("pf-azzera").addEventListener("click",()=>{document.getElementById("pf-dalle").value="",document.getElementById("pf-alle").value=""}),document.getElementById("pf-salva").addEventListener("click",async d=>{const p=d.currentTarget,m=g=>{if(!g)return null;const[f,S]=g.split(":");return+f*60+ +S};p.disabled=!0,p.textContent="Salvo…";try{await w.salvaPreferenze({giorni:[...l],fascia:o,dalle:m(document.getElementById("pf-dalle").value),alle:m(document.getElementById("pf-alle").value)}),document.getElementById("pf-esito").innerHTML=q("Preferenze salvate.","")}catch(g){document.getElementById("pf-esito").innerHTML=q(g.message,"errore")}p.disabled=!1,p.textContent="Salva le preferenze"}),document.getElementById("an-salva").addEventListener("click",async d=>{const p=d.currentTarget,m=document.getElementById("an-esito");m.innerHTML="",p.disabled=!0,p.textContent="Invio…";try{await w.proponiDati({telefono:document.getElementById("an-tel").value,email:document.getElementById("an-mail").value,citta:document.getElementById("an-citta").value}),await re()}catch(g){m.innerHTML=q(g.message,"errore"),p.disabled=!1,p.textContent="Proponi la correzione"}}),document.getElementById("pw-salva").addEventListener("click",async d=>{const p=d.currentTarget,m=document.getElementById("pw-esito"),g=document.getElementById("pw-vecchia").value,f=document.getElementById("pw-nuova").value,S=document.getElementById("pw-ripeti").value;if(m.innerHTML="",f.length<8){m.innerHTML=q("La nuova password deve avere almeno 8 caratteri.","errore");return}if(f!==S){m.innerHTML=q("Le due password non coincidono.","errore");return}p.disabled=!0,p.textContent="Attendi…";try{await w.cambiaPassword(g,f),U.togli(),sessionStorage.clear(),await F("Password cambiata. Rientra con quella nuova."),location.hash="#/accesso"}catch(I){m.innerHTML=q(I.message,"errore"),p.disabled=!1,p.textContent="Cambia password"}}),Jt(document.getElementById("blocco-notifiche"))}const X=t=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${t}</svg>`,Gt={oggi:X('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>'),altro:X('<circle cx="12" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>'),diete:X('<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>'),diario:X('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),allenamenti:X('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),appunti:X('<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'),spesa:X('<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>'),progressi:X('<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'),documenti:X('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),appuntamenti:X('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),anagrafica:X('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>')},ft=[["oggi","Oggi"],["diete","Dieta"],["diario","Diario"],["spesa","Spesa"],["appuntamenti","Appuntamenti"],["allenamenti","Allenamenti"],["appunti","Appunti"],["progressi","Progressi"],["documenti","Documenti"],["anagrafica","Anagrafica"]],Kt=5;document.addEventListener("click",t=>{const a=document.getElementById("altro-velo");if(!a)return;t.target===a&&(a.hidden=!0),t.target.closest("#menu-altro")&&(t.preventDefault(),a.hidden=!a.hidden)});const xi={"/":"Oggi",...Object.fromEntries(ft.map(([t,a])=>["/"+t,a])),"/ricette":"Ricette","/chiedi":"Chiedi appuntamento","/attesa":"Lista d’attesa","/installa":"Installa l’app"},Hi=t=>xi[t]||(t.startsWith("/dieta/")?"Il tuo piano":"Indietro"),Bi={"/ricette":"/diete","/chiedi":"/appuntamenti","/attesa":"/appuntamenti","/installa":"/anagrafica"},Oi=new Set(["/accesso","/servizio-scaduto","/altro"]),wt=()=>location.hash.replace(/^#/,"")||"/",ji=t=>t==="/"||ft.slice(0,Kt).some(([a])=>t==="/"+a);let Aa=null,_t;function ce(){const t=wt(),a=history.state&&history.state.prec;return a&&a!==t&&!Oi.has(a)?{via:a,cronologia:!0}:{via:Bi[t]||(t.startsWith("/dieta/")?"/diete":"/oggi"),cronologia:!1}}function da(){const t=ce();t.cronologia?history.back():Ct(t.via)}function Ri(t){history.state&&history.state.prec===t?history.back():Ct(t)}function Ct(t){t!==wt()&&(_t=history.state&&history.state.prec||null,location.replace("#"+t))}function Fi(t){const a=history.state;if(!a||typeof a!="object"||!("prec"in a)){const e=_t!==void 0?_t:Aa;try{history.replaceState({...a&&typeof a=="object"?a:{},prec:e||null},"")}catch{}}_t=void 0,Aa=t}const Gi='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';document.addEventListener("click",t=>{t.target.closest("#torna")&&(t.preventDefault(),da())});function A(t,a){const e=sessionStorage.getItem("nome")||"",i=([l,o])=>`<a href="#/${l}" data-voce="${l}" class="${a===l?"attivo":""}"${a===l?' aria-current="page"':""}><span class="menu-ic" aria-hidden="true">${Gt[l]}</span><span class="menu-t">${o}</span></a>`,n=ji(wt())?null:Hi(ce().via);return`
    <header class="testata${n?" con-torna":""}">
      ${n?`<button class="btn-torna" id="torna" type="button" aria-label="Indietro: ${b(n)}">${Gi}<span>${b(n)}</span></button>`:`<div>
        <div class="testata-studio">Studio Dott.ssa Tramontano</div>
        ${e?`<div class="testata-nome">${wi()}, ${b(e)}</div>`:""}
      </div>`}
      <button class="btn-esci" id="esci">Esci</button>
    </header>
    <main class="contenuto"><div class="barra-offline" id="barra-offline" hidden></div>${t}</main>
    <nav class="menu" aria-label="Sezioni" data-attiva="${b(a||"")}">
      ${ft.slice(0,Kt).map(i).join("")}
      <span class="menu-sep" aria-hidden="true"></span>
      ${ft.slice(Kt).map(i).join("")}
      <a href="#/altro" id="menu-altro"><span class="menu-ic" aria-hidden="true">${Gt.altro}</span><span class="menu-t">Altro</span></a>
    </nav>
    <div class="altro-velo" id="altro-velo" hidden><div class="altro-pannello" role="dialog" aria-label="Altre sezioni">
      <div class="altro-maniglia"></div>
      ${ft.map(([l,o])=>`<a href="#/${l}" data-voce="${l}" class="altro-voce ${a===l?"attivo":""}" hidden><span class="menu-ic" aria-hidden="true">${Gt[l]}</span><span>${o}</span></a>`).join("")}
    </div></div>`}const Vi=12,Ui=48,Wi=5;function ua(){const t=h.querySelector(":scope > nav.menu");if(document.documentElement.classList.toggle("con-guscio",!!t),!t||!t.clientWidth)return;const a=[...t.querySelectorAll("a[data-voce]")],e=t.querySelector("#menu-altro"),i=t.dataset.attiva||"";a.forEach(s=>{s.hidden=!1}),e.hidden=!1;let n=a.length,l=!1;if(!window.matchMedia("(min-width: 768px)").matches){const s=getComputedStyle(t),c=t.clientWidth-(parseFloat(s.paddingLeft)||0)-(parseFloat(s.paddingRight)||0),d=document.createElement("span");d.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font-weight:600",a[0].appendChild(d);const p=_=>(d.textContent=_.querySelector(".menu-t").textContent,Math.max(Ui,Math.ceil(d.getBoundingClientRect().width)+Vi)),m=a.map(p),g=p(e);d.remove();const f=window.matchMedia("(min-width: 600px)").matches?a.length:Math.min(Wi,a.length);let S=m.reduce((_,T)=>_+T,0);if(S>c||f<a.length)for(S=g,n=0;n<f&&S+m[n]<=c;)S+=m[n],n++;const I=m.slice(0,n).concat(n<a.length?[g]:[]);l=I.length*Math.max(...I)<=c}t.classList.toggle("menu-uguali",l),a.forEach((s,c)=>{s.hidden=c>=n}),e.hidden=n>=a.length;const o=new Set(a.slice(n).map(s=>s.dataset.voce));h.querySelectorAll("#altro-velo [data-voce]").forEach(s=>{s.hidden=!o.has(s.dataset.voce)}),e.classList.toggle("attivo",o.has(i)),o.has(i)?e.setAttribute("aria-current","page"):e.removeAttribute("aria-current")}new MutationObserver(ua).observe(h,{childList:!0});const de=new MutationObserver(()=>{h.firstElementChild&&(de.disconnect(),requestAnimationFrame(()=>Me()))});de.observe(h,{childList:!0});let ka=0;window.addEventListener("resize",()=>{cancelAnimationFrame(ka),ka=requestAnimationFrame(ua)});document.fonts&&document.fonts.ready&&document.fonts.ready.then(ua).catch(()=>{});window.addEventListener("statusTap",()=>{const t=document.querySelector(".contenuto, .lb-corpo");t&&t.scrollTo&&t.scrollTo({top:0,behavior:"smooth"})});let At=0,Ta=0;function Nt(){window.innerWidth!==Ta&&(Ta=window.innerWidth,At=window.innerHeight),At=Math.max(At,window.innerHeight);const t=document.activeElement,a=!!t&&t.matches('textarea, select, [contenteditable="true"], input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=file]):not([type=range])');document.documentElement.classList.toggle("tastiera",a&&window.innerHeight<At-150)}window.addEventListener("resize",Nt);document.addEventListener("focusin",()=>setTimeout(Nt,250));document.addEventListener("focusout",()=>setTimeout(Nt,250));Nt();let ue=0;async function ct(){var e;ue=Date.now(),ot&&(ot.distruggi(),ot=null);const t=location.hash.replace(/^#/,"")||"/";if(!U.leggi()&&t!=="/accesso"&&t!=="/servizio-scaduto"){location.hash="#/accesso";return}if(U.leggi()&&t!=="/accesso"&&!window.__nativoAvviato&&(window.__nativoAvviato=!0,Ae({versione:((e=document.querySelector('meta[name="app-versione"]'))==null?void 0:e.content)||"",indietro:da}).catch(()=>{})),U.leggi()&&t!=="/accesso"&&ke().catch(()=>{}),t!=="/altro"&&Fi(t),t==="/accesso"){Li();return}if(t==="/servizio-scaduto"){Ci();return}if(t==="/altro"){Ct(sessionStorage.getItem("via-prec")||"/oggi"),setTimeout(()=>{const i=document.getElementById("altro-velo");i&&(i.hidden=!1)},60);return}if(sessionStorage.setItem("via-prec",t),t==="/"||t==="/oggi")await Ai();else if(t==="/diete")await Xt();else if(t.startsWith("/dieta/"))await Ei(t.slice(7));else if(t==="/attesa")await Yt();else if(t==="/appunti")await Tt();else if(t==="/spesa")await mt();else if(t==="/diario")await Di();else if(t==="/ricette")await Pi();else if(t==="/allenamenti")await Ni();else if(t==="/installa")h.innerHTML=A(gi(),"anagrafica"),vi(h);else if(t==="/progressi")await le();else if(t==="/documenti")await Qt();else if(t==="/appuntamenti")await se();else if(t==="/chiedi")await qi();else if(t==="/anagrafica")await re();else{Ct("/oggi");return}pe();const a=document.querySelector(".menu a.attivo:not([hidden])");a&&a.scrollIntoView&&a.scrollIntoView({inline:"center",block:"nearest"})}document.addEventListener("click",t=>{const a=t.target.closest("a[data-esterno]");!a||!K()||(t.preventDefault(),Ha(a.href))});document.addEventListener("click",async t=>{const a=t.target.closest("#esci");if(!(!a||a.disabled)){a.disabled=!0;try{await ea(),await w.esci()}catch{}U.togli(),sessionStorage.clear(),location.hash="#/accesso"}});function pe(){const t=document.getElementById("barra-offline");if(!t)return;const a=fe(),e=he;if(!e.offline&&!a){t.hidden=!0;return}t.hidden=!1,t.textContent=e.offline?"Sei senza connessione: vedi gli ultimi dati scaricati."+(a?` ${a} modific${a===1?"a":"he"} in attesa: partir${a===1?"à":"anno"} da sol${a===1?"a":"e"} quando torna la rete.`:""):`Invio delle modifiche in corso (${a})…`}window.addEventListener("offline-stato",pe);window.addEventListener("app-in-primo-piano",()=>{Date.now()-ue>5*6e4&&!document.querySelector("textarea:focus, input:focus")&&ct()});ve(async()=>{try{await w.svuotaCoda()}catch{}ct()});fi();window.addEventListener("hashchange",ct);ct();
