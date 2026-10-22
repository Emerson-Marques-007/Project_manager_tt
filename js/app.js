/* ======= CONFIGURAÇÃO: URL /exec do Apps Script ======= */
(function(){
 var el=document.querySelector("link[rel='icon'][type='image/svg+xml']");if(!el)return;
 var href=el.href;
 document.querySelectorAll("link[rel~='icon'],link[rel='apple-touch-icon']").forEach(function(l){if(l!==el)l.remove()});
 var img=new Image();
 img.onload=function(){
  var c=document.createElement('canvas');c.width=c.height=180;c.getContext('2d').drawImage(img,0,0,180,180);
  var u=c.toDataURL('image/png'),p=document.createElement('link');p.rel='icon';p.type='image/png';p.href=u;document.head.appendChild(p);
  var a=document.createElement('link');a.rel='apple-touch-icon';a.href=u;document.head.appendChild(a)};
 img.src=href;
})();
var API=(window.PM_CONFIG&&window.PM_CONFIG.API)||'';
/* ================================================================== */

var $=function(i){return document.getElementById(i)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var TOKEN=localStorage.getItem('pm_tok'),EMAIL=localStorage.getItem('pm_mail'),SAVE='',SLOTS=[null,null,null],SLOT=0,S=null,SEL=null,RODADAS=14;
var LIGAS=[],CLUBES=[],LIGA_SEL=null,CLUBES_CACHE={},LIGA_REQ=0;

/* Catálogo de eventos carregado de js/eventos.js. */

/* Etiquetas (tags) de contexto: o evento só pode aparecer se TODAS forem verdadeiras.
   "!x" = só aparece se x for falso. Sem etiqueta = evento neutro (sempre possível).
   lid=líder | top=dentro da meta | meio=meio de tabela | z=zona de rebaixamento | baixo=parte de baixo
   seqV=3 vitórias seguidas | seqD=3 jogos sem vencer | rico/pobre=caixa alto/baixo
   torcA/torcB=torcida alta/baixa | moralA/moralB | cans=elenco cansado | fim=reta final
   Formato: [tags, título, texto, [opçãoA, efeito], [opçãoB, efeito]]
   Efeitos: c=caixa (escala com o tamanho do clube) m=moral t=torcida r=reputação f=físico do elenco */
var EVENTOS=window.PM_EVENTOS;

/* eventos que aparecem ANTES de um jogo em casa (na tela de ingressos). pm = multiplicador do público */
var EV_ING=window.PM_EV_ING;

/* ---------- lógica ---------- */
function sg(n){return (n>0?'+':'')+n}
function escalaEv(){return Math.max(1,Math.round(clube(S.cid).c/3000))} /* clubes ricos: valores em € mi maiores */
function descEf(e){var p=[],k=escalaEv();
 if(e.c)p.push('Caixa '+(e.c>0?'+':'')+mil(e.c*k));
 if(e.m)p.push('Moral '+sg(e.m));
 if(e.t)p.push('Torcida '+sg(e.t));
 if(e.r)p.push('Reputação '+sg(e.r));
 if(e.f)p.push('Físico do elenco '+sg(e.f));
 if(e.pm&&e.pm!==1)p.push('Público '+sg(Math.round((e.pm-1)*100))+'%');
 return p.join(' · ')||'Sem efeito imediato'}

function ctx(){
 var o=ordem(),pos=o.indexOf(S.cid)+1,n=S.cl.length,c=clube(S.cid),T={},f=(S.forma&&S.forma[S.cid])||[],jog=S.rod>=4;
 T.lid=jog&&pos===1; T.top=jog&&pos<=c.m; T.z=jog&&pos>n-3; T.baixo=jog&&pos>Math.ceil(n*.65);
 T.meio=jog&&!T.top&&!T.z;
 T.seqV=f.length>=3&&f.slice(-3).every(function(x){return x==='V'});
 T.seqD=f.length>=3&&f.slice(-3).indexOf('V')<0;
 T.rico=S.caixa>=c.c*1.5; T.pobre=S.caixa<c.c*.3;
 T.torcA=S.torc>=70; T.torcB=S.torc<=40; T.moralA=S.moral>=75; T.moralB=S.moral<=40;
 T.cans=fisMedia()<60; T.fim=S.rod>=S.cal.length-6;
 return T}
function okTags(w,T){if(!w)return true;return w.split(' ').every(function(k){return k.charAt(0)==='!'?!T[k.slice(1)]:!!T[k]})}
function sortearEvento(){
 var T=ctx(),rec=S.evRec||[],pool=[],tot=0;
 EVENTOS.forEach(function(e,i){if(rec.indexOf(i)>=0||!okTags(e.w,T))return;var w=e.w?3:1;pool.push([i,w]);tot+=w});
 if(!pool.length){S.evRec=[];return null}
 var r=Math.random()*tot,k;
 for(k=0;k<pool.length;k++){r-=pool[k][1];if(r<=0)break}
 k=Math.min(k,pool.length-1);
 S.evRec=rec.concat([pool[k][0]]).slice(-25);
 return pool[k][0]}

/* ---------- popups obrigatórios (substitui pendencias e aplicar) ---------- */
function pendencias(){
 if(ANIM||M)return;
 if(S.fim)return fimTemp();
 if(S.ev!==null){var e=EVENTOS[S.ev];if(!e){S.ev=null;return}
  modal('⚠ '+e.t,e.x+' Você precisa decidir agora.',e.o.map(function(o){return {l:o.l,d:descEf(o.e),f:function(){aplicar(o.e,o.l)}}}));return}
 if(S.evIng!==null&&S.evIng!==undefined){var g=EV_ING[S.evIng];if(!g){S.evIng=null;return}
  modal('🎟 '+g.t,g.x,g.o.map(function(o){return {l:o.l,d:descEf(o.e),f:function(){aplicarIng(o.e,o.l)}}}))}
}
function efeitos(e){
 S.caixa+=Math.round((e.c||0)*escalaEv());S.moral=lim(S.moral+(e.m||0));S.torc=lim(S.torc+(e.t||0));S.rep=lim(S.rep+(e.r||0));
 if(e.f&&S.elenco)S.elenco.forEach(function(j){j.f=Math.max(0,Math.min(100,j.f+e.f))})}
function aplicar(e,l){efeitos(e);S.ev=null;render();salvar();toast('Decisão tomada: '+l)}
function aplicarIng(e,l){efeitos(e);if(e.pm)S.mod=(S.mod||1)*e.pm;S.evIng=null;render();salvar();toast('Decisão tomada: '+l)}


/* ---------- utilidades ---------- */
function tela(n){
 ['auth','inicio','menu','esc','jogo'].forEach(function(k){$('t-'+k).className='tela'+(k===n?' on':'')});
 document.body.classList.toggle('em-jogo',n==='jogo');document.body.classList.toggle('em-esc',n==='esc');
 $('b-inicio').style.display=(n==='menu'||n==='esc'||n==='jogo')?'inline-block':'none'}
function msg(id,t,ok){var e=$(id);e.textContent=t||'';e.className='msg'+(ok?' ok':'')}
function toast(t){var e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(function(){e.style.display='none'},5000)}
function api(b){
 /* Mantida para compatibilidade com o Apps Script (mundo/dados-base). */
 return fetch(API,{
   method:'POST',
   redirect:'follow',
   headers:{'Content-Type':'text/plain;charset=utf-8'},
   body:JSON.stringify(b)
 }).then(function(r){
   if(!r.ok) throw new Error('O servidor respondeu HTTP '+r.status+'. Confira a implantação do Apps Script.');
   return r.json();
 }).then(function(r){
   if(r.erro) throw new Error(r.erro);
   return r;
 }).catch(function(e){
   if(e instanceof TypeError){
     throw new Error('O navegador não conseguiu ler a resposta do Apps Script. Pode ser bloqueio CORS/redirecionamento; confira a implantação e tente novamente.');
   }
   throw e;
 });
}
/* ---- API Vercel (saves + auth) ---- */
/* Lê o JSON da resposta e, se vier erro, usa a mensagem do servidor (campo 'erro'). */
function lerResposta(r,padrao){
 return r.json().catch(function(){return {}}).then(function(j){
   if(r.status===401&&padrao!=='auth')throw new Error('sessao');
   if(!r.ok||j.ok===false)throw new Error(j.erro||('Erro HTTP '+r.status));
   return j;
 });
}
var SAVE_API='/api/saves';
function apiSaves(body){
 return fetch(SAVE_API,{
   method:'POST',
   headers:{
     'Content-Type':'application/json',
     'Authorization':'Bearer '+TOKEN
   },
   body:JSON.stringify(body)
 }).then(function(r){return lerResposta(r)});
}
function apiAuth(body){
 return fetch('/api/auth',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(body)
 }).then(function(r){return lerResposta(r,'auth')});
}
function apiCatalog(params){
 var base=(window.PM_CONFIG&&window.PM_CONFIG.CATALOG_API)||'/api/catalog';
 var qs=Object.keys(params||{}).map(function(k){return encodeURIComponent(k)+'='+encodeURIComponent(params[k])}).join('&');
 return fetch(base+(qs?(base.indexOf('?')<0?'?':'&')+qs:''),{
   headers:{'Authorization':'Bearer '+TOKEN}
 }).then(function(r){return lerResposta(r)});
}
function sair(){
 var t=TOKEN;localStorage.removeItem('pm_tok');
 var fim=function(){location.reload()};
 if(!t){fim();return}
 /* invalida a sessão também no servidor; recarrega mesmo se a chamada falhar */
 fetch('/api/auth',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+t},body:JSON.stringify({action:'logout'})})
  .catch(function(){}).then(fim)}
function lim(v){return Math.max(0,Math.min(100,Math.round(v*10)/10))}
function tier(r){return r<20?'Desconhecido':r<40?'Promissor':r<60?'Respeitado':r<80?'Prestigiado':'Lendário'}
function fmtK(v){
 v=Number(v)||0;var a=Math.abs(v),s=v<0?'-':'';
 if(a<1000)return s+'€ '+Math.round(a).toLocaleString('pt-BR')+' mil';
 var d=a>=100000?0:a>=10000?1:2;
 return s+'€ '+(a/1000).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d})+' mi'}
function mil(v){return fmtK(v)}
function clube(id){return S.cl[id]}
function modal(tit,txt,ops){
 var h='<h2>'+esc(tit)+'</h2><p>'+esc(txt)+'</p>';
 ops.forEach(function(o,i){h+='<button data-i="'+i+'">'+esc(o.l)+(o.d?'<small>'+chipsEf(o.d)+'</small>':'')+'</button>'});
 $('mbox').innerHTML=mono(h);$('modal').className='on';
 var bs=$('mbox').getElementsByTagName('button');
 for(var i=0;i<bs.length;i++)bs[i].onclick=(function(o){return function(){$('modal').className='';o.f()}})(ops[i]);
}
/* ---------- helpers visuais ---------- */
function grupoPos(p){return p==='GOL'?'g':(p==='ZAG'||p==='LAT')?'d':(p==='VOL'||p==='MEI')?'m':'a'}
function ovCls(o){return o>=80?'ov-s':o>=70?'ov-a':o>=60?'ov-b':'ov-c'}
function corFis(v){return v>=70?'#3dbb6a':v>=45?'#facc15':'#ef4444'}
function corClube(n){var h=0,s=String(n||'');for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%360;return 'hsl('+h+',42%,26%)'}
function crest(c,sz){sz=sz||42;return '<div class="esc" style="width:'+sz+'px;height:'+sz+'px;background:'+corClube(c.n)+';font-size:'+Math.round(sz*.29)+'px;position:relative">'+esc(sigla(c.n))+(c.escudo?'<img src="'+esc(c.escudo)+'" alt="" referrerpolicy="no-referrer" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;border-radius:50%;background:#f4f7f5;padding:2px" onerror="this.remove()">':'')+'</div>'}
function chipsEf(d){return String(d).split(' · ').map(function(p){var c=p.indexOf('+')>=0?'up':p.indexOf('-')>=0?'dn':'';return '<i class="ef '+c+'">'+esc(p)+'</i>'}).join('')}
function linhaJog(j,o){o=o||{};var p=o.pos||j.p;return '<div class="pl'+(o.cls||'')+'"'+(o.attr||'')+'><div class="pp g-'+grupoPos(p)+'">'+p+'</div><div class="pn"><b>'+(o.star?'★ ':'')+esc(j.n)+(o.ic||'')+'</b><small>'+(o.sub||(j.i+' anos'))+'</small></div><div class="ov '+ovCls(j.o)+'" title="Overall">'+j.o+'</div><div title="Preparo físico"><div class="fbar"><i class="'+classeFis(j.f)+'" style="width:'+j.f+'%"></i></div><div class="fl">'+Math.round(j.f)+'%</div></div></div>'}

/* ---------- ícones SVG de traço único ---------- */
var ICO={
 home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v12h14V9"/><path d="M10 21v-6h4v6"/>',
 pitch:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 5v14"/><circle cx="12" cy="12" r="2.8"/><path d="M3 9.5h2.5v5H3M21 9.5h-2.5v5H21"/>',
 trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 clipboard:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h6"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M15 9.2a3.6 3.6 0 1 0 0 5.6"/><path d="M7.5 11h6M7.5 13h6"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 stadium:'<ellipse cx="12" cy="8" rx="9" ry="4"/><path d="M3 8v8c0 2.2 4 4 9 4s9-1.8 9-4V8"/>',
 plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
 clock:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2h5"/>',
 play:'<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>',
 pause:'<rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>',
 ball:'<circle cx="12" cy="12" r="9"/><path d="m12 8.2 3.6 2.6-1.4 4.2H9.8l-1.4-4.2z"/><path d="M12 3v5.2M15.6 10.8 20.6 9M14.2 15l3 4.2M9.8 15l-3 4.2M8.4 10.8 3.4 9"/>',
 alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
 ticket:'<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
 swap:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
 flag:'<path d="M4 22V4"/><path d="M4 4h13l-2 4 2 4H4"/>',
 'chev-l':'<path d="m15 18-6-6 6-6"/>',
 'chev-r':'<path d="m9 18 6-6-6-6"/>'
};
function ico(n){return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">'+ICO[n]+'</svg>'}
/* emoji -> ícone. Para trocar um ícone no futuro, mexa só aqui. */
var EMO={'🏠':'home','⚙':'pitch','🏆':'trophy','👥':'users','📅':'calendar','📋':'clipboard',
 '💰':'coin','🪙':'coin','💪':'bolt','🎯':'target','🏟':'stadium','✈':'plane','⏱':'clock',
 '▶':'play','⏸':'pause','⚽':'ball','⚠':'alert','🎟':'ticket','🔁':'swap','🏁':'flag'};
var EMO_RE=new RegExp('('+Object.keys(EMO).join('|')+')\uFE0F?','g');
function mono(h){
 return String(h).replace(EMO_RE,function(m,k){return ico(EMO[k])}).replace(/🟨\uFE0F?/g,'<i class="ycard"></i>')}

/* ---------- transições ---------- */
/* Executa fn (que redesenha a tela) com animação suave. entrada=true faz os
   cards entrarem em sequência (usado ao trocar de aba). */
function transicao(fn,entrada){
 var run=function(){ENTRADA=!!entrada;fn()};
 var red=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(!red&&document.startViewTransition){document.startViewTransition(run);return}
 run()}
/* estilo das transições do navegador (injetado por aqui para o Blogger não reclamar) */
(function(){
 var s=document.createElement('style');
 s.textContent='::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation-duration:.45s;animation-timing-function:cubic-bezier(.3,.7,.2,1)}'+
  '::view-transition-group(root),::view-transition-old(root),::view-transition-new(root){animation-duration:.2s;animation-timing-function:ease-out}';
 document.head.appendChild(s)})();

/* ---------- login ---------- */
function busy(b,v){b.disabled=v}
$('b-env').onclick=function(){
 var em=$('email').value.trim().toLowerCase();msg('m-auth','');
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)){msg('m-auth','Digite um e-mail completo, ex.: nome@gmail.com');return}
 busy(this,true);var b=this;
 apiAuth({action:'send',email:em}).then(function(){EMAIL=em;$('emx').textContent=em;$('p1').style.display='none';$('p2').style.display='block';msg('m-auth','Código enviado! Veja também o spam.',true)})
 .catch(function(e){msg('m-auth',e.message)}).then(function(){busy(b,false)})};
$('b-val').onclick=function(){
 msg('m-auth','');busy(this,true);var b=this;
 apiAuth({action:'verify',email:EMAIL,code:$('cod').value.trim()}).then(function(r){TOKEN=r.token;localStorage.setItem('pm_tok',TOKEN);localStorage.setItem('pm_mail',EMAIL);entrar(true)})
 .catch(function(e){msg('m-auth',e.message)}).then(function(){busy(b,false)})};
$('b-volta').onclick=function(){$('p2').style.display='none';$('p1').style.display='block';msg('m-auth','')};
$('sair').onclick=sair;

function entrar(comSave){
 $('quem').textContent=EMAIL||'';$('sair').style.display='inline-block';
 $('p1').style.display='none';$('p2').style.display='none';msg('m-auth','Entrando na sua conta…',true);
 var tentar=function(n){
  var p=apiSaves({action:'list'}).then(function(r){SLOTS=normSlots(r.slots)}); /* sempre lista os slots, inclusive após login novo */
  p.then(function(){return PMUI.carregar()}).then(function(){msg('m-auth','');inicio()}).catch(function(e){
   if(e.message==='sessao'){sair();return}
   if(n<3){msg('m-auth','Conexão lenta, tentando de novo…',true);setTimeout(function(){tentar(n+1)},1500*(n+1));return}
   msg('m-auth','Não foi possível entrar agora: '+e.message);
   var b=document.createElement('button');b.textContent='Tentar de novo';b.className='full';b.onclick=function(){b.remove();entrar()};$('m-auth').parentNode.appendChild(b)})};
 tentar(0)}

/* ---------- menu / nova carreira: slots ---------- */
function normSlots(a){var s=[null,null,null];(a||[]).forEach(function(x){var k=Number(x&&x.slot);if(k>=1&&k<=3)s[k-1]=x.meta||{}});return s}
function estrelas(rep){var n=Math.max(1,Math.min(5,Math.round((Number(rep)||50)/20))),h='';for(var i=0;i<5;i++)h+='<i'+(i<n?' class="on"':'')+'>★</i>';return h}
function escudoGrande(m,sz){
 return '<div class="sl-esc'+(m.escudo?'':' sem')+'" style="width:'+sz+'px;height:'+sz+'px">'+
  (m.escudo?'<img src="'+esc(m.escudo)+'" alt="" referrerpolicy="no-referrer" loading="lazy" onerror="this.parentNode.className=\'sl-esc sem\';this.remove()">':'')+
  '<span style="background:'+corClube(m.clube)+'">'+esc(sigla(m.clube))+'</span></div>'}
function cartaoSlot(i){
 var m=SLOTS[i],n=i+1;
 if(!m)return '<div class="slotw"><div class="slot vazio"><div class="slot-top"><span class="slot-n">SLOT '+n+'</span>Vazio</div><div class="slot-mais">+</div><div class="slot-nome">Slot livre</div><p class="hint">Comece uma nova carreira aqui.</p></div>'+
  '<div class="stack"><button class="full" data-nova="'+i+'">Nova carreira</button></div></div>';
 var rod=(m.rod!=null?m.rod:'–')+'/'+(m.total||'–'),pos=m.pos?m.pos+'º':'–';
 return '<div class="slotw"><div class="slot">'+
  '<div class="slot-top"><span class="slot-n">SLOT '+n+'</span>'+esc(m.pais||'Carreira')+'</div>'+
  '<div class="slot-nome">'+esc(m.clube||'Clube')+'</div>'+
  escudoGrande(m,116)+
  '<div class="slot-stars">'+estrelas(m.rep)+'</div>'+
  '<div class="slot-stats"><div><small>TEMPORADA</small><b>'+(m.temp||1)+'</b></div><div><small>RODADA</small><b>'+rod+'</b></div><div><small>POSIÇÃO</small><b>'+pos+'</b></div></div>'+
  '<div class="slot-info"><span>Técnico <b>'+esc(m.tec||'—')+'</b></span><span>Caixa <b>'+fmtK(m.caixa||0)+'</b></span></div>'+
  '<div class="slot-liga">'+(m.ligaLogo?'<img src="'+esc(m.ligaLogo)+'" alt="" referrerpolicy="no-referrer" onerror="this.remove()">':'')+'<span>'+esc(m.liga||'')+'</span></div>'+
  '</div><div class="stack"><button class="full" data-cont="'+i+'">Continuar carreira</button>'+
  '<button class="sec full danger" data-apagar="'+i+'">Apagar carreira</button></div></div>'}
function inicio(){tela('inicio')}
$('i-novo').onclick=function(){
 var livre=-1,k;for(k=0;k<3;k++)if(!SLOTS[k]){livre=k;break}
 if(livre<0){menu();msg('m-menu','Todos os slots estão ocupados. Apague uma carreira para começar um novo jogo.');return}
 SLOT=livre+1;novaTela()};
$('i-carregar').onclick=function(){menu()};
$('i-sair').onclick=sair;
$('b-menu-inicio').onclick=inicio;
$('b-inicio').onclick=function(){
 if(S&&$('t-jogo').className.indexOf('on')>=0){pausar();clearTimeout(SALVT);salvarJa()}
 inicio()};

function menu(){
 tela('menu');msg('m-menu','');
 var el=$('slots');el.innerHTML=[0,1,2].map(cartaoSlot).join('');
 var q,i;
 q=el.querySelectorAll('[data-cont]');for(i=0;i<q.length;i++)q[i].onclick=function(){continuarSlot(+this.getAttribute('data-cont'))};
 q=el.querySelectorAll('[data-apagar]');for(i=0;i<q.length;i++)q[i].onclick=function(){apagarSlot(+this.getAttribute('data-apagar'))};
 q=el.querySelectorAll('[data-nova]');for(i=0;i<q.length;i++)q[i].onclick=function(){SLOT=+this.getAttribute('data-nova')+1;novaTela()};
}
function continuarSlot(i){
 msg('m-menu','Carregando carreira…',true);
 apiSaves({action:'load',slot:i+1}).then(function(r){
  if(!r.json)throw new Error('Esse slot está vazio.');
  SLOT=i+1;msg('m-menu','');abrirSave(r.json);
 }).catch(function(e){if(e.message==='sessao'){sair();return}msg('m-menu',e.message)})}
function apagarSlot(i){
 var m=SLOTS[i];
 if(!confirm('Apagar a carreira '+(m&&m.clube?'do '+m.clube:'deste slot')+'? Isso não pode ser desfeito.'))return;
 msg('m-menu','Apagando…',true);
 apiSaves({action:'delete',slot:i+1}).then(function(){SLOTS[i]=null;menu();msg('m-menu','Carreira apagada.',true)})
 .catch(function(e){if(e.message==='sessao'){sair();return}msg('m-menu',e.message)})}
function abrirSave(json){
 S=JSON.parse(json);
 if(!S.cl||!S.cl.length)throw new Error('Save inválido.');
 RODADAS=S.cal&&S.cal.length?S.cal.length:2*(S.cl.length-1);
 if(!S.ligaNome)S.ligaNome='Carreira antiga';
 S.cl.forEach(function(c){if(c.salario===undefined)c.salario=0;if(c.elenco===undefined)c.elenco=0;if(c.divida===undefined)c.divida=0;if(!c.metaTxt)c.metaTxt='Top '+(c.m||Math.ceil(S.cl.length/2));if(!c.liga)c.liga=S.ligaNome});
 migrar();tela('jogo');render()}
function metaSave(){
 var c=clube(S.cid),o=ordem();
 return {tec:S.tec,clube:c.n,escudo:c.escudo||'',pais:S.pais||c.pais||'',liga:S.ligaNome||c.liga||'',ligaLogo:S.ligaLogo||'',
  temp:S.temp,rod:S.rod,total:S.cal?S.cal.length:RODADAS,pos:o.indexOf(S.cid)+1,n:S.cl.length,caixa:Math.round(S.caixa),rep:c.f}}
$('b-voltamenu').onclick=function(){inicio()};
$('b-voltaligas').onclick=function(){
 LIGA_REQ++;LIGA_SEL=null;SEL=null;$('box-clubes').style.display='none';$('box-ligas').style.display='block';detVazio();msg('m-esc','');window.scrollTo(0,0);
};

function num(v){var n=Number(v);return isFinite(n)?n:0}
function formatMi(v){return fmtK(num(v)*1000)}
function alvoMeta(meta,total,rep){
 var s=String(meta||'').toLowerCase();
 if(s.indexOf('título')>=0||s.indexOf('disputar títulos')>=0)return Math.max(2,Math.ceil(total*.2));
 if(s.indexOf('continental')>=0)return Math.max(4,Math.ceil(total*.25));
 if(s.indexOf('metade superior')>=0)return Math.ceil(total/2);
 if(s.indexOf('permanência')>=0||s.indexOf('permanencia')>=0)return Math.max(1,total-3);
 return rep>=85?Math.max(3,Math.ceil(total*.25)):Math.ceil(total/2);
}
function adaptarClube(raw,index,total){
 var rep=Math.max(35,Math.min(99,num(raw.reputacao)||50));
 return {
  id:index,dbid:String(raw.id||''),ligaId:String(raw.ligaId||''),liga:String(raw.liga||''),pais:String(raw.pais||''),
  temporada:String(raw.temporada||''),n:String(raw.nome||'Clube'),s:sigla(raw.nome),
  cor:'#214f35',f:rep,c:Math.max(0,num(raw.orcamentoTransferencias))*1000*2.5,
  salario:Math.max(0,num(raw.orcamentoSalarial)),elenco:Math.max(0,num(raw.valorElenco)),
  divida:Math.max(0,num(raw.divida)),rep:rep,t:Math.max(25,Math.min(100,Math.round(rep*.88+8))),
  metaTxt:String(raw.meta||'Meta da diretoria a definir'),
  perfil:String(raw.perfilFinanceiro||''),
  m:alvoMeta(raw.meta,total,rep),
  escudoBusca:'',logoLigaBusca:'',escudo:String(raw.escudo||'')
 };
}
function carregarCatalogo(){
 msg('m-esc','Carregando ligas…',true);
 /* só as ligas que têm clubes; os clubes de cada liga são buscados (paginados) ao escolher a liga */
 return apiCatalog({entity:'leagues',comClubes:1,limit:500}).then(function(r){
  LIGAS=Array.isArray(r.leagues)?r.leagues:[];
  if(!LIGAS.length)throw new Error('Nenhuma liga com clubes encontrada. Importe o catálogo e vincule os clubes às ligas (npm run link:clubes-ligas).');
  desenharLigas();msg('m-esc','',true);
 }).catch(function(e){
  if(e.message==='sessao'){sair();throw e}
  msg('m-esc','Não foi possível carregar os dados do catálogo: '+e.message);throw e});
}
function novaTela(){
 tela('esc');SEL=null;LIGA_SEL=null;CLUBES=[];detVazio();$('b-ini').disabled=true;$('tec-ini').textContent=iniciais($('tec').value);
 $('box-clubes').style.display='none';$('box-ligas').style.display='block';msg('m-esc','');
 carregarCatalogo().catch(function(){});
}
function detVazio(){$('det').innerHTML='<h2>Informações do clube</h2><p class="det-vazio">Escolha uma liga e um clube para ver orçamento, elenco e a meta da diretoria.</p>'}
function iniciais(n){var p=String(n||'').trim().split(/\s+/).filter(Boolean);return p.length?(p[0][0]+(p.length>1?p[p.length-1][0]:'')).toUpperCase():''}
$('tec').addEventListener('input',function(){$('tec-ini').textContent=iniciais(this.value)});
$('b-ini').onclick=function(){iniciar()};
function desenharLigas(){
 var el=$('ligas');
 el.innerHTML=LIGAS.map(function(l){
  var marca=sigla(l.nome);
  return '<button type="button" class="league-card" data-liga="'+esc(l.id)+'">'+
   '<span class="league-mark" style="position:relative">'+esc(marca)+(l.logo?'<img src="'+esc(l.logo)+'" alt="" referrerpolicy="no-referrer" style="position:absolute;inset:0;margin:auto;width:46px;height:46px;object-fit:contain;background:#143c25" onerror="this.remove()">':'')+'</span><span><b>'+esc(l.nome)+'</b>'+
   '<small>'+(l.pais?esc(l.pais)+' · ':'')+Number(l.quantidade||0)+' clubes</small></span></button>';
 }).join('');
 var bs=el.querySelectorAll('[data-liga]');
 for(var i=0;i<bs.length;i++)bs[i].onclick=function(){selecionarLiga(this.getAttribute('data-liga'))};
 var pad=LIGAS.filter(function(l){return /brasil/i.test(l.nome+' '+(l.pais||''))})[0]||LIGAS[0];
 if(pad)selecionarLiga(pad.id);
}
/* Busca todos os clubes da liga em páginas de 100 (máx. 500) e guarda em cache. */
function buscarClubesLiga(id){
 if(CLUBES_CACHE[id])return Promise.resolve(CLUBES_CACHE[id]);
 var todos=[],limite=100;
 var pagina=function(offset){
  return apiCatalog({entity:'clubs',leagueId:id,limit:limite,offset:offset}).then(function(r){
   var lista=Array.isArray(r.clubs)?r.clubs:[];
   todos=todos.concat(lista);
   if(lista.length===limite&&todos.length<(r.total||0)&&todos.length<500)return pagina(offset+limite);
   return todos;
  });
 };
 return pagina(0).then(function(t){CLUBES_CACHE[id]=t;return t});
}
function selecionarLiga(id){
 LIGA_SEL=LIGAS.filter(function(l){return String(l.id)===String(id)})[0];
 if(!LIGA_SEL){msg('m-esc','Não foi possível encontrar essa liga.');return}
 var req=++LIGA_REQ,liga=LIGA_SEL;
 SEL=null;CLUBES=[];detVazio();$('b-ini').disabled=true;
 var lc=$('ligas').children;for(var j=0;j<lc.length;j++)lc[j].className='league-card'+(lc[j].getAttribute('data-liga')===String(liga.id)?' sel':'');
 msg('m-esc','Carregando clubes de '+liga.nome+'…',true);
 buscarClubesLiga(liga.id).then(function(raw){
  if(req!==LIGA_REQ)return; /* o usuário já escolheu outra liga */
  if(!raw.length){$('box-clubes').style.display='none';msg('m-esc','Não há clubes cadastrados para esta liga.');return}
  CLUBES=raw.map(function(c,i){return adaptarClube(c,i,raw.length)});
  $('box-clubes').style.display='block';
  $('titulo-clubes').textContent='Escolher clube';
  $('subtitulo-liga').textContent=[liga.nome,liga.pais,liga.temporada?'Temporada '+liga.temporada:'',CLUBES.length+' clubes'].filter(Boolean).join(' · ');
  $('link-logo-liga').innerHTML=liga.logoBusca?'<a class="extlink" href="'+esc(liga.logoBusca)+'" target="_blank" rel="noopener">Consultar logos da liga ↗</a>':'';
  $('clubes').innerHTML=CLUBES.map(function(c){
   var link=c.escudoBusca?'<a class="extlink" href="'+esc(c.escudoBusca)+'" target="_blank" rel="noopener">Ver opções de escudo ↗</a>':'';
   return '<div class="club" role="button" tabindex="0" data-id="'+c.id+'">'+crest(c,42)+
    '<div class="clubmeta"><b>'+esc(c.n)+'</b><span>Reputação '+c.f+'/100</span>'+link+'</div></div>';
  }).join('');
  var cs=$('clubes').children;
  for(var i=0;i<cs.length;i++){
   cs[i].onclick=function(){escolher(+this.getAttribute('data-id'))};
   cs[i].onkeydown=function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();escolher(+this.getAttribute('data-id'))}};
  }
  msg('m-esc','');
 }).catch(function(e){
  if(req!==LIGA_REQ)return;
  if(e.message==='sessao'){sair();return}
  msg('m-esc','Não foi possível carregar os clubes: '+e.message);
 });
}
function escolher(id){
 SEL=id;var c=CLUBES[id],cs=$('clubes').children;
 for(var i=0;i<cs.length;i++)cs[i].className='club'+(i===id?' sel':'');
 var d=$('det');$('b-ini').disabled=false;
 d.innerHTML='<h2>Informações do clube</h2>'+
 '<div class="det-head">'+crest(c,60)+'<div><b>'+esc(c.n)+'</b><small>'+esc(c.liga)+' · '+esc(c.pais)+' · '+esc(c.temporada)+'</small></div></div>'+
 '<div class="detail-grid">'+
 '<div><small>Orçamento de transferências</small><b>'+formatMi(c.c/1000)+'</b></div>'+
 '<div><small>Orçamento salarial anual</small><b>'+formatMi(c.salario)+'</b></div>'+
 '<div><small>Valor estimado do elenco</small><b>'+formatMi(c.elenco)+'</b></div>'+
 '<div><small>Dívida estimada</small><b>'+formatMi(c.divida)+'</b></div>'+
 '</div>'+
 '<div class="det-rep"><small>Reputação</small><b>'+c.f+'/100</b><div class="bar"><i style="width:'+c.f+'%"></i></div></div>'+
 '<div class="det-meta"><small>Meta da diretoria</small><b>'+esc(c.metaTxt)+'</b></div>'+
 '<p class="det-nota">Os valores financeiros são estimativas de gameplay conforme a guia Parâmetros da planilha, não dados contábeis auditados.</p>'+
 (c.escudoBusca?'<p><a class="extlink" href="'+esc(c.escudoBusca)+'" target="_blank" rel="noopener">Consultar escudo do clube ↗</a></p>':'');
 if(window.innerWidth<1000)d.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function cal(ids){var n=ids.length,a=ids.slice(),r=[],i,j,m,h,v;
 for(i=0;i<n-1;i++){m=[];for(j=0;j<n/2;j++){h=a[j];v=a[n-1-j];m.push(i%2?[v,h]:[h,v])}r.push(m);a.splice(1,0,a.pop())}
 return r.concat(r.map(function(x){return x.map(function(p){return [p[1],p[0]]})}))}
/* Motor principal mantido neste arquivo porque compartilha estado e funções internas. */

function render(){
 prepararIngresso();if(S.esq&&S.esq.slots&&S.elenco)ajustaBanco();
 var c=clube(S.cid),o=ordem(),pos=o.indexOf(S.cid)+1;
 var tabs=[['painel','🏠 Painel'],['tat','⚙ Tática'],['class','🏆 Classificação'],['elenco','👥 Elenco'],['mercado','🔁 Mercado'],['contratos','💰 Contratos'],['cal','📅 Calendário'],['hist','📋 Resultados']];
 var fn={painel:pPainel,tat:pTat,class:pClass,elenco:pElenco,mercado:PMUI.pMercado,contratos:PMUI.pContratos,cal:pCal,hist:pHist};
 var h='<div class="card"><div class="hdrclub">'+crest(c,46)+'<div><h2>'+esc(c.n)+'</h2>'+
  '<span>'+esc(S.ligaNome||c.liga||'Liga nacional')+' · Técnico '+esc(S.tec)+' · Temporada '+S.temp+' · Rodada '+Math.min(S.rod+1,RODADAS)+'/'+RODADAS+'</span></div></div></div>'+
  '<aside class="side"><div class="side-logo">'+LOGO_HTML+'</div><div class="tabs">'+tabs.map(function(t){return '<button class="tab'+(ABA===t[0]?' on':'')+'" data-aba="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</div></aside>'+
  '<div class="pane pane-'+ABA+(ENTRADA?' pane-in':'')+'">'+fn[ABA](c,o,pos)+'</div>';
 $('dash').innerHTML=mono(h);ENTRADA=false;
 var ts=$('dash').querySelectorAll('[data-aba]');
 for(var i=0;i<ts.length;i++)ts[i].onclick=function(){
  var a=this.getAttribute('data-aba');if(a===ABA)return;
  pausar();ABA=a;SELT=null;CALM=null;MSEL=null;MOVE=false;
  transicao(function(){render();window.scrollTo(0,0)},true)};
 if($('b-sim'))$('b-sim').onclick=simular;
 if($('b-adv'))$('b-adv').onclick=avancar;
 if($('b-pause'))$('b-pause').onclick=pausar;
 if($('b-tabcompleta'))$('b-tabcompleta').onclick=function(){
  ABA='class';CALM=null;transicao(function(){render();window.scrollTo(0,0)},true)};
 bindTat();bindCal();bindElenco();PMUI.bind();
 if($('tk'))$('tk').oninput=function(){S.preco=+this.value;atualizaIng()};
 pendencias()}

function iniciar(){
 var tec=$('tec').value.trim();
 if(tec.length<2){msg('m-esc','Digite o nome do treinador.');window.scrollTo(0,0);return}
 if(SEL===null||!CLUBES[SEL]){msg('m-esc','Escolha um clube antes de continuar.');return}
 var c=CLUBES[SEL];
 S={tec:tec,cid:SEL,ligaId:c.ligaId,ligaNome:c.liga,ligaLogo:(LIGA_SEL&&LIGA_SEL.logo)||'',pais:c.pais,temporadaBase:c.temporada,
  temp:1,caixa:c.c,rep:lim(30+(c.f-50)/2),moral:70,torc:c.t,
  cl:JSON.parse(JSON.stringify(CLUBES)),ult:[],hist:[],ev:null,fim:false};
 S.evRec=[];S.cl.forEach(function(x){x.wi=PM.B.cIdx[x.dbid]});S.wi=S.cl[S.cid].wi;
 PM.novoMundo();PM.iniciarSave();PM.sync();S.esq=novaEsq(S.elenco,'4-3-3');
 zerar();tela('jogo');render();salvar();
 var ev0=[];PM.transicoes(ev0);PMUI.eventos(ev0);
}

function fimTemp(){
 var o=ordem(),pos=o.indexOf(S.cid)+1,c=clube(S.cid),ok=pos<=c.m,dr=ok?8:-6;
 var bonus=pos===1?500:pos<=3?200:0;
 modal('Fim da temporada '+S.temp,'Você terminou em '+pos+'º lugar. Meta cadastrada: '+(c.metaTxt||('Top '+c.m))+'. Para o cálculo do jogo, a meta equivale a Top '+c.m+'. '+(ok?'Meta cumprida!':'Meta não cumprida.')+' Reputação '+(dr>0?'+':'')+dr+(bonus?' · Premiação '+mil(bonus):'')+'.',
  [{l:'Iniciar próxima temporada',f:function(){
   var ordW=ordem().map(function(i){return S.cl[i].wi}),out=PM.fimTemporada(pos,S.ligaId,{user:ordW});
   S.hist.push({t:S.temp,pos:pos});S.rep=lim(S.rep+dr);PM.receber(bonus);S.temp++;S.fim=false;S.ult=[];
   S.cl.forEach(function(x){x.f=Math.max(40,Math.min(90,x.f+Math.round(Math.random()*4-2)))});
   zerar();PM.sync();if(S.esq.slots.length<11)S.esq=novaEsq(S.elenco,S.esq.form);render();salvar();PMUI.resumoTemp(out)}}]);
}


var SALVT=null;
function salvarJa(){
 if(!S||!SLOT)return;if(S.W)PM.compactar();var e=S.elenco;S.elenco=undefined;var j=JSON.stringify(S);S.elenco=e;
 var meta=metaSave();SLOTS[SLOT-1]=meta;
 var corpo={action:'save',slot:SLOT,json:j,meta:meta};
 var tentar=function(n){
  apiSaves(corpo).catch(function(err){
   if(err.message==='sessao'){sair();return}
   if(n<2){setTimeout(function(){tentar(n+1)},2000*(n+1));return}
   toast('Não foi possível salvar: '+err.message)})};
 tentar(0)}
function salvar(){clearTimeout(SALVT);SALVT=setTimeout(salvarJa,1500)}

/* ---------- início ---------- */
if(TOKEN){entrar()}