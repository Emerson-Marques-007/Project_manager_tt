var ABA='painel',ANIM=false,ENTRADA=true,CALM=null,CALDIR='';
var ELSORT='o',ELGRP=true;

var M=null,MT=null,ADV=false,ADVT=null,SELT=null;
var MOVE=false,MSEL=null;
var MAXSUB=5,VEL=300; /* máx. de substituições | ms por minuto de jogo */

/* ---------- formações e estilos ---------- */
var FORM={
 '4-3-3':{ZAG:2,LAT:2,VOL:1,MEI:2,ATA:3},
 '4-4-2':{ZAG:2,LAT:2,VOL:2,MEI:2,ATA:2},
 '4-2-3-1':{ZAG:2,LAT:2,VOL:2,MEI:3,ATA:1},
 '4-2-4':{ZAG:2,LAT:2,VOL:2,MEI:0,ATA:4},
 '3-5-2':{ZAG:3,LAT:2,VOL:1,MEI:2,ATA:2},
 '5-3-2':{ZAG:3,LAT:2,VOL:2,MEI:1,ATA:2},
 '4-5-1':{ZAG:2,LAT:2,VOL:1,MEI:4,ATA:1},
 '3-4-3':{ZAG:3,LAT:2,VOL:0,MEI:2,ATA:3}
};
var FORM_ORD=['4-3-3','4-4-2','4-2-3-1','4-2-4','3-5-2','5-3-2','4-5-1','3-4-3'];
var ESTILO={def:{a:.93,d:1.07,n:'Defensivo'},eq:{a:1,d:1,n:'Equilibrado'},ofe:{a:1.07,d:.94,n:'Ofensivo'}};
/* peso de cada posição no ataque e na defesa (4-3-3 soma 7.9 nos dois) */
var WA={GOL:0,ZAG:.2,LAT:.5,VOL:.6,MEI:1,ATA:1.3};
var WD={GOL:1.5,ZAG:1.3,LAT:.9,VOL:.9,MEI:.4,ATA:.1};
var REFW=7.9;

function porId(arr,id){for(var i=0;i<arr.length;i++)if(arr[i].id===id)return arr[i];return null}
function valorJog(j){return j.o*(.6+.4*j.f/100)}
function topo(el,u,p,n){
 return el.filter(function(j){return j.p===p&&!u[j.id]})
  .sort(function(a,b){return valorJog(b)-valorJog(a)}).slice(0,n)
  .map(function(j){u[j.id]=1;return {p:p,id:j.id}})}
/* monta os 11: GOL, LAT, ZAGs, LAT, VOLs, MEIs, ATAs (essa ordem é usada no campinho) */
function autoEscalar(el,form){
 var c=FORM[form],u={},s=[];
 s=s.concat(topo(el,u,'GOL',1));
 var lat=topo(el,u,'LAT',c.LAT),zag=topo(el,u,'ZAG',c.ZAG);
 if(lat[0])s.push(lat[0]);s=s.concat(zag);if(lat[1])s.push(lat[1]);
 s=s.concat(topo(el,u,'VOL',c.VOL),topo(el,u,'MEI',c.MEI),topo(el,u,'ATA',c.ATA));
 return s}
function novaEsq(el,form){return {form:form,estilo:'eq',slots:autoEscalar(el,form)}}

/* ---------- aba TÁTICA ---------- */
function pTat(c){
 var E=S.esq,on={};E.slots.forEach(function(s){on[s.id]=1});
 var pw=potencia({slots:E.slots,elenco:S.elenco,estilo:E.estilo,meu:true,wi:S.wi}),fm=fisMedia(),selNome='';
 if(SELT){var js=SELT.k==='s'?porId(S.elenco,E.slots[SELT.v].id):porId(S.elenco,SELT.v);if(js)selNome=js.n}
 var cfg='<div class="card"><h2>Formação e estilo</h2><div class="grp" style="margin-top:0">Formação</div><div class="opts">'+FORM_ORD.map(function(f){return '<button class="opt'+(E.form===f?' on':'')+'" data-form="'+f+'">'+f+'</button>'}).join('')+'</div><div class="grp">Estilo de jogo</div><div class="opts">'+Object.keys(ESTILO).map(function(k){return '<button class="opt'+(E.estilo===k?' on':'')+'" data-estilo="'+k+'">'+ESTILO[k].n+'</button>'}).join('')+'</div><p class="hint">Ofensivo: mais ataque e defesa mais frágil. Defensivo: o contrário. Trocar a formação remonta o time automaticamente.</p></div>';
 var campo='<div class="card"><h2>Escalação</h2><div class="selbar'+(selNome?' on':'')+'">'+(selNome?'<b>'+esc(selNome)+'</b> selecionado. Toque em outro jogador para trocar, ou nele de novo para cancelar.':'Toque em qualquer jogador (campo, banco ou fora do jogo) e depois em outro para trocar os dois de lugar.')+'</div>'+campoHTML(E.slots,S.elenco)+'<div class="legend" style="justify-content:center;margin:12px 0 0"><span><i style="background:#3dbb6a"></i>Físico bom</span><span><i style="background:#facc15"></i>Médio</span><span><i style="background:#ef4444"></i>Baixo</span><span><i style="background:#f97316"></i>Fora de posição</span></div></div>';
 var forca='<div class="card"><h2>Força do time</h2>'+bar('Ataque',Math.min(100,pw.atk),'mini',Math.round(pw.atk))+bar('Defesa',Math.min(100,pw.def),'mini',Math.round(pw.def))+bar('Físico dos titulares',fm,'mini',Math.round(fm)+'%')+'<p class="hint">No campo, o número é o overall e o anel mostra o preparo físico de cada jogador.</p></div>';
 var pi=POS.map(function(p){return p[0]}),ordP=function(a,b){return pi.indexOf(a.p)-pi.indexOf(b.p)||b.o-a.o},onB={};
 E.banco.forEach(function(id){onB[id]=1});
 var ban=E.banco.map(function(id){return porId(S.elenco,id)}).filter(Boolean).sort(ordP),
  fora=S.elenco.filter(function(j){return !on[j.id]&&!onB[j.id]}).sort(ordP);
 function linhas(arr,fo){return arr.map(function(j){
  var sel=SELT&&SELT.k==='r'&&SELT.v===j.id,fg=PM.d(j.id)[DD.FG]||0;
  return linhaJog(j,{cls:' clk'+(sel?' sel':''),attr:' data-res="'+j.id+'"',sub:(fo&&fg>=2?'Sem jogar há '+fg+' jogos · ':'')+j.i+' anos · '+(j.min||0)+' min'})}).join('')||'<p class="hint">Ninguém aqui.</p>'}
 var rs='<div class="card"><h2>Banco de reservas <span class="chip" style="margin-left:8px">'+ban.length+'/12</span></h2><div class="scroll">'+linhas(ban,0)+'</div></div>'+ 
  '<div class="card"><h2>Fora do jogo <span class="chip" style="margin-left:8px">'+fora.length+'</span></h2><p class="hint" style="margin-top:-4px">Não entram em campo nem no banco. Ficar muito tempo aqui derruba moral, fase e até overall.</p><div class="scroll">'+linhas(fora,1)+'</div></div>';
 return '<div class="tat-grid"><div>'+cfg+campo+'</div><div>'+forca+PMUI.cardEntro()+rs+'</div></div>'}
function campoHTML(slots,elenco){
 var L={GOL:[],DEF:[],VOL:[],MEI:[],ATA:[]},Y={GOL:90,DEF:72,VOL:55,MEI:38,ATA:15};
 slots.forEach(function(s,i){L[(s.p==='ZAG'||s.p==='LAT')?'DEF':s.p].push(i)});
 var h='<div class="campo"><div class="cl-mid"></div><div class="cl-circ"></div><div class="cl-ga"></div><div class="cl-gb"></div>';
 Object.keys(L).forEach(function(k){L[k].forEach(function(i,n){
  var s=slots[i],j=porId(elenco,s.id),x=(n+1)/(L[k].length+1)*100;
  var sel=SELT&&SELT.k==='s'&&SELT.v===i,fp=j.p!==s.p;
  h+='<div class="pj g-'+grupoPos(s.p)+(sel?' sel':'')+(fp?' fp':'')+'" style="left:'+x+'%;top:'+Y[k]+'%;view-transition-name:jg'+j.id+'" data-slot="'+i+'"><div class="pc" style="--p:'+Math.round(j.f)+';--fc:'+corFis(j.f)+'"><b>'+j.o+'</b></div><small>'+esc(j.n.split(' ').slice(-1)[0])+'</small><em>'+s.p+(fp?' · '+j.p:'')+'</em></div>'})});
 return h+'</div>'}
function clicarTat(k,v){
 var a=SELT,E=S.esq,sl=E.slots;
 if(!a){SELT={k:k,v:v};transicao(render);return}
 if(a.k===k&&a.v===v){SELT=null;transicao(render);return}
 var ida=a.k==='s'?sl[a.v].id:a.v,idb=k==='s'?sl[v].id:v,A=grpJog(ida),B=grpJog(idb);
 if(A[0]!=='s'&&B[0]===A[0]){SELT={k:k,v:v};transicao(render);return} /* mesmo grupo (banco/fora): só muda a seleção */
 if(A[0]==='s'&&B[0]==='s'){var t=sl[A[1]].id;sl[A[1]].id=sl[B[1]].id;sl[B[1]].id=t}
 else if(A[0]==='s'){sl[A[1]].id=idb;if(B[0]==='b')E.banco[B[1]]=ida}   /* titular <-> banco/fora */
 else if(B[0]==='s'){sl[B[1]].id=ida;if(A[0]==='b')E.banco[A[1]]=idb}
 else{if(A[0]==='b')E.banco[A[1]]=idb;else E.banco[B[1]]=ida}          /* banco <-> fora */
 SELT=null;salvar();transicao(render)}
function bindTat(){
 var q=$('dash').querySelectorAll('[data-form],[data-estilo],[data-slot],[data-res]');
 for(var i=0;i<q.length;i++)q[i].onclick=function(){
  var f=this.getAttribute('data-form'),e=this.getAttribute('data-estilo'),s=this.getAttribute('data-slot'),r=this.getAttribute('data-res');
  if(f){S.esq.form=f;S.esq.slots=autoEscalar(S.elenco,f);SELT=null;salvar();transicao(render)}
  else if(e){S.esq.estilo=e;salvar();transicao(render)}
  else if(s!==null)clicarTat('s',+s);
  else if(r!==null)clicarTat('r',+r)}}

/* ---------- mini classificação do painel ---------- */
function miniTab(o,pos,n){
 var i0=Math.max(0,Math.min(pos-3,n-5));
 var h='<div class="card"><h2>Classificação</h2><table class="cls"><tr><th>#</th><th>Clube</th><th>Pts</th><th>J</th><th>SG</th></tr>';
 o.slice(i0,i0+5).forEach(function(id,k){
  var t=S.tab[id],x=clube(id);
  h+='<tr class="'+(id===S.cid?'eu':'')+'"><td><span class="pos">'+(i0+k+1)+'</span></td><td class="nm">'+esc(x.n)+'</td><td class="pts">'+t.p+'</td><td>'+t.j+'</td><td>'+sg(t.gp-t.gc)+'</td></tr>'});
 return h+'</table><button class="sec full" id="b-tabcompleta" style="margin-top:10px">Ver tabela completa</button></div>'}

/* ---------- calendário: Avançar / Pausar ---------- */
function calDados(){
 var d=new Date(S.d0+S.hoje*864e5),f=S.dias[S.rod]-S.hoje,ini=S.rod>0?S.dias[S.rod-1]:PM.inicioTemporada(),tot=Math.max(1,S.dias[S.rod]-ini);
 return {m:d.toLocaleDateString('pt-BR',{month:'short',timeZone:'UTC'}).replace('.','')+' '+d.getUTCFullYear(),d:d.getUTCDate(),
  w:d.toLocaleDateString('pt-BR',{weekday:'long',timeZone:'UTC'}),f:f,
  t:f>0?f+' dia'+(f>1?'s':'')+' para o jogo':'Dia de jogo!',
  h:ADV?'Os dias estão passando… clique em Pausar para gerenciar o time.':f>0?'Avance o calendário até a próxima partida.':'Ajuste escalação e tática e vá para a partida.',
  p:Math.max(0,Math.min(100,Math.round((S.hoje-ini)/tot*100)))}}
function calHTML(){
 var c=calDados();
 return '<div class="calpg'+(c.f<=0?' dj':'')+'" id="cal-pg"><small id="cal-m">'+c.m+'</small><b id="cal-d">'+c.d+'</b><em id="cal-w">'+c.w+'</em></div>'+
  '<div class="calinfo"><b id="cal-t">'+c.t+'</b><div class="hint" id="cal-h">'+c.h+'</div><div class="calbar"><i id="cal-b" style="width:'+c.p+'%"></i></div></div>'}
function atualizaCal(){
 var b=$('cal-d');if(!b){var e=$('calbox');if(e)e.innerHTML=calHTML();return}
 var c=calDados();
 $('cal-m').textContent=c.m;$('cal-w').textContent=c.w;$('cal-t').textContent=c.t;$('cal-h').textContent=c.h;$('cal-b').style.width=c.p+'%';
 $('cal-pg').className='calpg'+(c.f<=0?' dj':'');
 b.textContent=c.d;b.classList.remove('tick');void b.offsetWidth;b.classList.add('tick')}
function avancar(){
 if(ADV||M||S.ev!==null||S.fim||ANIM||(S.evIng!==null&&S.evIng!==undefined))return;
 if(S.hoje>=S.dias[S.rod])return;
 ADV=true;render();ADVT=setInterval(passoDia,380)}
function passoDia(){
 S.hoje++;
 var ev=PM.dia();
 atualizaCal();
 var pausa=PMUI.eventos(ev);
 if(S.hoje>=S.dias[S.rod]){pararAv();render();toast('Dia de jogo! Confira a escalação.');salvar();return}
 if(pausa){pararAv();render();salvar()}}
function pararAv(){clearInterval(ADVT);ADV=false}
function pausar(){if(!ADV)return;pararAv();render();salvar()}

/* ---------- partida ao vivo ---------- */
function potencia(t){
 var A=0,D=0;
 t.slots.forEach(function(s){var j=porId(t.elenco,s.id);if(!j)return;
  var e=PM.efOv(j.id)*(.55+.45*j.f/100)*(j.p===s.p?1:.82);A+=e*WA[s.p];D+=e*WD[s.p]});
 var st=ESTILO[t.estilo],en=PM.entro(t.wi,t.slots,t.meu?S.esq.form:PM.W().c[t.wi].fo,t.estilo);
 return {atk:A/REFW*st.a+en.mod,def:D/REFW*st.d+en.mod,en:en}}
function criarTime(id,nome,elenco,slots,estilo,meu){
 return {id:id,nome:nome,elenco:elenco,estilo:estilo,meu:meu,subs:0,gols:{},am:{},saiu:{},
  slots:slots.map(function(s){return {p:s.p,id:s.id}})}}
function noCampo(t){return t.slots.map(function(s){return porId(t.elenco,s.id)})}
function banco(t){
 var on={};t.slots.forEach(function(s){on[s.id]=1});
 return t.elenco.filter(function(j){return !on[j.id]&&!t.saiu[j.id]&&(!t.ban||t.ban.indexOf(j.id)>=0)})}
function lg(txt){M.log.unshift(M.min+'’ '+txt)}
function escolhe(t,pesos){
 var l=noCampo(t),tot=0,w=l.map(function(j){var x=(pesos[j.p]||0)*(j.o/70);tot+=x;return x});
 var r=Math.random()*tot,k;for(k=0;k<l.length;k++){r-=w[k];if(r<=0)break}
 return l[Math.min(k,l.length-1)]}
function trocar(t,outId,inId){
 var i,o=porId(t.elenco,outId),n=porId(t.elenco,inId);
 for(i=0;i<t.slots.length;i++)if(t.slots[i].id===outId)break;
 if(i>=t.slots.length||!n)return;
 t.slots[i].id=inId;t.saiu[outId]=1;t.subs++;
 lg('🔁 '+t.nome+': sai '+o.n+', entra '+n.n)}
function iaSubs(t){
 if(t.subs>=MAXSUB||[55,60,65,70,75,80,85].indexOf(M.min)<0||Math.random()<.3)return;
 var c=noCampo(t).filter(function(j){return j.p!=='GOL'}).sort(function(a,b){return a.f-b.f})[0];
 if(!c)return;
 var b=banco(t).filter(function(j){return j.p===c.p}).sort(function(a,b){return valorJog(b)-valorJog(a)})[0]||
  banco(t).filter(function(j){return j.p!=='GOL'}).sort(function(a,b){return valorJog(b)-valorJog(a)})[0];
 if(b)trocar(t,c.id,b.id)}

function iniciarPartida(){
 var m=jogoMeu(),casa=m[0]===S.cid,adv=clube(casa?m[1]:m[0]),imp=0,e=null,preco=0;
 if(casa){imp=importancia(m);preco=S.preco||sugerido(imp);e=estimar(preco,imp,S.mod)}
 var oe=PM.elencoView(adv.wi);
 var meu=criarTime(S.cid,clube(S.cid).n,S.elenco,S.esq.slots,S.esq.estilo,true);meu.wi=S.wi;
 var opp=criarTime(adv.id,adv.n,oe,PM.escalar(adv.wi),PM.W().c[adv.wi].es||'eq',false);opp.wi=adv.wi;
 meu.titIni=meu.slots.map(function(s){return s.id});opp.titIni=opp.slots.map(function(s){return s.id});
ajustaBanco();meu.ban=S.esq.banco.slice();
 M={H:casa?meu:opp,A:casa?opp:meu,meu:meu,opp:opp,casa:casa,min:0,gh:0,ga:0,fimMin:90+ri(1,4),
  pausado:false,fim:false,ht:false,skip:false,log:[],selOut:null,selIn:null,est:e,preco:preco,adv:adv.n,oppWi:adv.wi};
 lg('▶ Bola rolando!');
 $('partida').className='on';
 rodar()}
function rodar(){M.pausado=false;M.selOut=null;M.selIn=null;clearInterval(MT);MT=setInterval(minuto,VEL);renderPartida()}
function pausarP(){if(!M||M.fim)return;clearInterval(MT);M.pausado=true;renderPartida()}
function pularP(){
 if(M.fim)return;clearInterval(MT);M.skip=true;M.pausado=false;
 while(!M.fim)minuto();
 M.skip=false;renderPartida()}

function minuto(){
 M.min++;
 var H=M.H,A=M.A;
 [H,A].forEach(function(t){noCampo(t).forEach(function(j){
  j.f=Math.max(5,j.f-(j.p==='GOL'?.1:.24)); /* cansaço por minuto em campo */
  if(t.meu)j.min=(j.min||0)+1})});
 var ph=potencia(H),pa=potencia(A);
 var lh=1.35*1.1*Math.pow(ph.atk/pa.def,1.6)/90,la=1.35/1.1*Math.pow(pa.atk/ph.def,1.6)/90;
 if(Math.random()<lh)golo(H);
 if(Math.random()<la)golo(A);
 lance(H,A);
 iaSubs(M.opp);if(M.skip)iaSubs(M.meu);
 if(M.min===45&&!M.ht&&!M.skip){M.ht=true;lg('⏸ Intervalo');pausarP();return}
 if(M.min>=M.fimMin){clearInterval(MT);M.fim=true;M.pausado=false;lg('🏁 Fim de jogo!')}
 if(!M.skip)renderPartida()}
function golo(t){
 var j=escolhe(t,{ATA:5,MEI:3,VOL:1,LAT:1.2,ZAG:.8,GOL:0});
 t.gols[j.id]=(t.gols[j.id]||0)+1;
 if(t===M.H)M.gh++;else M.ga++;
 lg('⚽ GOL! '+j.n+' ('+t.nome+')  '+M.gh+' x '+M.ga)}
function lance(H,A){
 var r=Math.random(),t=Math.random()<.5?H:A;
 if(r<.06){
  var j=escolhe(t,{ATA:5,MEI:3,VOL:1,LAT:1,ZAG:.5,GOL:0}),f=[' finaliza e o goleiro defende',' chuta de longe e a bola passa perto',' cabeceia para fora',' bate na trave!'];
  lg(j.n+f[ri(0,f.length-1)]+' ('+t.nome+')')}
 else if(r<.085){
  var c=noCampo(t).filter(function(j){return !t.am[j.id]});
  if(c.length){var p=c[ri(0,c.length-1)];t.am[p.id]=1;lg('🟨 '+p.n+' ('+t.nome+') leva cartão amarelo')}}}

function colTime(t){
 var clk=t.meu&&M.pausado&&!M.fim;
 var h='<div class="card"><h2>'+esc(t.nome)+'</h2><div class="chips"><span class="chip">'+ESTILO[t.estilo].n+'</span><span class="chip">Subs '+t.subs+'/'+MAXSUB+'</span></div>';
 t.slots.forEach(function(s){var j=porId(t.elenco,s.id),ic='',g;for(g=0;g<(t.gols[j.id]||0);g++)ic+=' ⚽';if(t.am[j.id])ic+=' 🟨';h+=linhaJog(j,{pos:s.p,ic:ic,cls:(clk?' clk':'')+(t.meu&&M.selOut===j.id?' sel':''),attr:clk?' data-out="'+j.id+'"':'',sub:j.i+' anos'+(j.p!==s.p?' · fora de posição':'')})});
 if(t.meu){h+='<div class="grp">Reservas</div>';banco(t).sort(function(a,b){return b.o-a.o}).forEach(function(j){h+=linhaJog(j,{cls:(clk?' clk':'')+(M.selIn===j.id?' sel':''),attr:clk?' data-in="'+j.id+'"':''})})}
 return h+'</div>'}
function renderPartida(){
 var H=M.H,A=M.A,h='<div class="mwrap">';
 h+='<div class="chips"><span class="chip">'+esc(clube(S.cid).n)+'</span><span class="chip">Rodada '+(S.rod+1)+'/'+RODADAS+'</span><span class="chip">Caixa '+mil(S.caixa)+'</span></div>';
 h+='<div class="placar"><b>'+esc(H.nome)+'</b><div><div class="big">'+M.gh+' x '+M.ga+'</div><small>'+(M.fim?'Encerrado':M.min+'’')+'</small></div><b>'+esc(A.nome)+'</b><span class="mprog" style="width:'+(M.fim?100:Math.min(100,Math.round(M.min/M.fimMin*100)))+'%"></span></div>';
 h+='<div class="card"><div class="mctl">';
 if(M.fim)h+='<button class="full" id="m-fim">Concluir partida</button>';
 else{
  h+='<button id="m-pause">'+(M.pausado?'▶ Continuar':'⏸ Pausar / Substituir')+'</button><button class="sec" id="m-skip">Pular</button>'+
   '<span class="hint">Substituições: '+M.meu.subs+'/'+MAXSUB+'</span>'}
 h+='</div>';
 if(M.pausado&&!M.fim){
  h+='<div class="grp">Estilo de jogo</div><div class="opts">'+Object.keys(ESTILO).map(function(k){return '<button class="opt'+(M.meu.estilo===k?' on':'')+'" data-mest="'+k+'">'+ESTILO[k].n+'</button>'}).join('')+'</div>'+
   '<p class="hint">Toque em um titular seu e depois em um reserva para substituir.</p>'}
 h+='</div><div class="mteams">'+colTime(H)+colTime(A)+'</div>';
 h+='<div class="card mlog"><h2>Lances</h2>'+M.log.map(function(x){var c=x.indexOf('⚽')>=0?'ev-gol':x.indexOf('🟨')>=0?'ev-card':x.indexOf('🔁')>=0?'ev-sub':'';return '<div class="'+c+'">'+esc(x)+'</div>'}).join('')+'</div></div>';
 var p=$('partida');p.innerHTML=mono(h);
 var b;
 if(b=$('m-pause'))b.onclick=function(){M.pausado?rodar():pausarP()};
 if(b=$('m-skip'))b.onclick=pularP;
 if(b=$('m-fim'))b.onclick=fecharPartida;
 var q,i;
 q=p.querySelectorAll('[data-mest]');for(i=0;i<q.length;i++)q[i].onclick=function(){M.meu.estilo=this.getAttribute('data-mest');renderPartida()};
 q=p.querySelectorAll('[data-out]');for(i=0;i<q.length;i++)q[i].onclick=function(){M.selOut=+this.getAttribute('data-out');subTentar()};
 q=p.querySelectorAll('[data-in]');for(i=0;i<q.length;i++)q[i].onclick=function(){M.selIn=+this.getAttribute('data-in');subTentar()}}
function subTentar(){
 if(M.selOut!==null&&M.selIn!==null){
  if(M.meu.subs>=MAXSUB)toast('Limite de substituições atingido.');
  else trocar(M.meu,M.selOut,M.selIn);
  M.selOut=null;M.selIn=null}
 renderPartida()}
function fecharPartida(){
 var mg=M.casa?M.gh:M.ga,tg=M.casa?M.ga:M.gh;
 var r={casa:M.casa,h:M.H.nome,a:M.A.nome,gh:M.gh,ga:M.ga,adv:M.adv,res:mg>tg?'V':mg<tg?'D':'E'};
 $('partida').className='';$('partida').innerHTML='';
 PM.aposPartida(M);concluirRodada(r);M=null}

/* ---------- utilidades ---------- */
function ri(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function sigla(nome){
 var p=String(nome||'CLUBE').split(/[\s&-]+/).filter(Boolean);
 if(p.length===1)return p[0].slice(0,3).toUpperCase();
 return p.slice(0,3).map(function(w){return w.charAt(0)}).join('').toUpperCase()}
function eurFull(v){return fmtK(v)}
function dataR(r){return new Date(S.d0+S.dias[r]*864e5)}
function fmtData(d){return d.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short',timeZone:'UTC'})}
function jogoMeu(){return (S.cal[S.rod]||[]).filter(function(p){return p[0]===S.cid||p[1]===S.cid})[0]}
function jogoDaRodada(r){return (S.cal[r]||[]).filter(function(p){return p[0]===S.cid||p[1]===S.cid})[0]}

/* ---------- elenco e preparo físico ---------- */
var NOMES=['Lucas','Mateus','Rafael','Bruno','Diego','Thiago','Gabriel','Felipe','André','Caio','Vitor','Enzo','Pedro','Hugo','Marcos','Leandro','Rodrigo','Daniel','Samuel','Igor','Murilo','Otávio','Kevin','Nathan'];
var SOBRENOMES=['Silva','Santos','Costa','Almeida','Rocha','Ferreira','Lima','Moreira','Barros','Teixeira','Duarte','Nunes','Ribeiro','Campos','Pires','Araújo','Mendes','Cardoso','Souza','Freitas','Martins','Lopes','Vieira','Dias'];
var POS=[['GOL',3],['ZAG',4],['LAT',4],['VOL',3],['MEI',4],['ATA',5]];
var TIT={GOL:1,ZAG:2,LAT:2,VOL:1,MEI:2,ATA:3}; /* 4-3-3 */
var POSNOME={GOL:'Goleiros',ZAG:'Zagueiros',LAT:'Laterais',VOL:'Volantes',MEI:'Meias',ATA:'Atacantes'};
function gerarElenco(f){
 var e=[],usados={};
 POS.forEach(function(p){for(var i=0;i<p[1];i++){
  var n;do{n=NOMES[ri(0,NOMES.length-1)]+' '+SOBRENOMES[ri(0,SOBRENOMES.length-1)]}while(usados[n]);usados[n]=1;
  var tit=i<TIT[p[0]];
  e.push({n:n,p:p[0],i:ri(18,36),o:Math.max(40,Math.min(95,Math.round(f+(tit?ri(-6,8):ri(-16,0))))),f:100})}});
 e.forEach(function(j,i){j.id=i;j.min=0});
 return e}
function titulares(){
 return S.esq.slots.map(function(s){return porId(S.elenco,s.id)}).filter(Boolean)}
function fisMedia(){
 if(!S.elenco||!S.elenco.length)return 80;
 var t=titulares();return t.reduce(function(s,j){return s+j.f},0)/t.length}
function classeFis(v){return v>=70?'f-ok':v>=45?'f-mid':'f-low'}
function forca(c){return c.id===S.cid?c.f+(S.moral-50)/8+(fisMedia()-80)/6:c.f}

/* ---------- calendário ---------- */
function gerarDias(n){var g=[7,7,7,7,4,4,3,5,6,3],d=[0];for(var i=1;i<n;i++)d.push(d[i-1]+g[ri(0,g.length-1)]);return d}
function iniciarDatas(){
 S.dias=gerarDias(S.cal.length);
 var ano=(parseInt(S.temporadaBase,10)||2026)+(S.temp||1)-1;
 S.d0=Date.UTC(ano,7,8)}
function descanso(gap){return gap<=3?['Descanso curto','bad']:gap<=5?['Descanso moderado','warn']:['Descanso tranquilo','good']}

function zerar(){
 var t={},f={};
 S.cl.forEach(function(c){t[c.id]={p:0,j:0,v:0,e:0,d:0,gp:0,gc:0};f[c.id]=[]});
 S.tab=t;S.forma=f;S.cal=cal(S.cl.map(function(c){return c.id}));S.rod=0;RODADAS=S.cal.length;
 S.jogos=[];S.preco=0;S.mod=1;S.evIng=null;S.ingOk=false;
 iniciarDatas();
 S.hoje=PM.inicioTemporada();
 if(S.W)PM.novaTemporadaMundo(S.ligaId,S.dias[S.dias.length-1])}

/* compatibilidade com saves antigos (chame antes de abrir o jogo) */
function migrar(){
 S.cl.forEach(function(x){if(x.dbid)x.wi=PM.B.cIdx[x.dbid]});
 if(S.wi===undefined)S.wi=S.cl[S.cid].wi;
 if(!S.W){PM.novoMundo();PM.iniciarSave();S.esq=null}else PM.hidratar();
 if(!Object.keys(S.W.L).length)PM.novaTemporadaMundo(S.ligaId,S.dias[S.dias.length-1]);
 PM.sync();
 if(!S.dias||S.dias.length!==S.cal.length)iniciarDatas();
 if(!S.forma){S.forma={};S.cl.forEach(function(c){S.forma[c.id]=[]})}
 if(!S.jogos)S.jogos=[];
 if(S.evIng===undefined){S.evIng=null;S.ingOk=false;S.mod=1;S.preco=0}
 if(!S.evRec)S.evRec=[];
 S.elenco.forEach(function(j,i){if(j.id===undefined)j.id=i;if(j.min===undefined)j.min=0});
 if(!S.esq||!S.esq.slots||S.esq.slots.length!==11||S.esq.slots.some(function(s){return !porId(S.elenco,s.id)}))S.esq=novaEsq(S.elenco,'4-3-3');
 if(S.hoje===undefined)S.hoje=(S.rod>0&&S.dias[S.rod-1]!==undefined)?S.dias[S.rod-1]:-6}

/* ---------- ingressos ---------- */
function capacidade(c){return Math.round(8000+(c.rep||c.f)*500)}
function precoRef(c){return Math.round(15+(c.rep||c.f)*.6)}
function importancia(m){
 var adv=clube(m[0]===S.cid?m[1]:m[0]),o=ordem(),n=S.cl.length,pa=o.indexOf(adv.id)+1,pm=o.indexOf(S.cid)+1;
 var i=.25+.35*(adv.f/100)+.2*(S.rod/S.cal.length);
 if(S.rod>=Math.floor(S.cal.length/2)&&pa<=3&&pm<=3)i+=.25;
 if(S.rod>=S.cal.length-5&&(pm<=2||pm>n-4))i+=.15;
 return Math.max(.2,Math.min(1,i))}
function rotuloImp(i){return i<.45?'Jogo comum':i<.7?'Jogo importante':'Jogo decisivo'}
function sugerido(imp){return Math.round(precoRef(clube(S.cid))*(.8+.6*imp))}
function estimar(preco,imp,mult){
 var c=clube(S.cid),cap=capacidade(c),ref=precoRef(c)*(.8+.6*imp);
 var base=cap*(.45+.55*imp)*(.6+S.torc/250);
 var el=(1.6-1.1*imp)+Math.max(0,preco/ref-1)*.5; /* preço muito acima do justo derruba o público */
 var pub=Math.min(cap,Math.round(base*Math.pow(ref/preco,el)*(mult||1)));
 return {pub:pub,cap:cap,renda:Math.round(pub*preco/1000)}}
function prepararIngresso(){
 if(S.fim||S.ev!==null||S.ingOk||(S.evIng!==null&&S.evIng!==undefined))return;
 var m=jogoMeu();if(!m)return;
 S.ingOk=true;
 if(m[0]===S.cid&&Math.random()<.3)S.evIng=Math.floor(Math.random()*EV_ING.length)}
function atualizaIng(){
 var m=jogoMeu();if(!m||!$('tk'))return;
 var imp=importancia(m),e=estimar(S.preco,imp,S.mod);
 $('tk-p').textContent='€ '+S.preco;
 $('tk-pub').textContent=e.pub.toLocaleString('pt-BR');
 $('tk-oc').textContent=Math.round(e.pub/e.cap*100)+'%';
 $('tk-r').textContent=eurFull(e.renda)}

/* ---------- simulação ---------- */
function pushForma(id,r){var a=S.forma[id];a.push(r);if(a.length>5)a.shift()}
function simular(){
 if(S.esq.slots.length<11)S.esq=novaEsq(S.elenco,S.esq.form);
 if(S.esq.slots.length<11){toast('Você precisa de 11 jogadores. Contrate reforços no Mercado.');return}
 if(S.ev!==null||(S.evIng!==null&&S.evIng!==undefined)||S.fim||ANIM||M||ADV)return;
 if(S.hoje<S.dias[S.rod]){toast('Use "Avançar" até o dia do jogo.');return}
 iniciarPartida()}

function concluirRodada(r){
 var jogos=S.cal[S.rod],meu=jogoMeu(),est=M.est,preco=M.preco,renda=est?est.renda:0;
 PM.xiCache={};
 jogos.forEach(function(j){
  var h=clube(j[0]),a=clube(j[1]),gh,ga;
  if(j===meu){gh=r.gh;ga=r.ga}
  else{var rs=PM.simPartida(h.wi,a.wi);gh=rs[0];ga=rs[1]}
  var th=S.tab[h.id],ta=S.tab[a.id];
  th.j++;ta.j++;th.gp+=gh;th.gc+=ga;ta.gp+=ga;ta.gc+=gh;
  var rh,ra;
  if(gh>ga){th.v++;th.p+=3;ta.d++;rh='V';ra='D'}else if(gh<ga){ta.v++;ta.p+=3;th.d++;rh='D';ra='V'}else{th.e++;ta.e++;th.p++;ta.p++;rh='E';ra='E'}
  pushForma(h.id,rh);pushForma(a.id,ra)});
 var c=clube(S.cid);
 renda=Math.round(renda*PM.B.cl[S.wi][CI.FBIL]);if(est)est.renda=renda;PM.receber(renda);
 if(est){var ref=precoRef(c);if(preco>ref*1.8)S.torc=lim(S.torc-1.5);else if(preco<ref*.7)S.torc=lim(S.torc+1)}
 if(r.res==='V'){S.rep=lim(S.rep+1.5);S.moral=lim(S.moral+4);S.torc=lim(S.torc+1)}
 else if(r.res==='D'){S.rep=lim(S.rep-1.5);S.moral=lim(S.moral-4);S.torc=lim(S.torc-1.5)}
 S.jogos.unshift({r:S.rod+1,d:S.dias[S.rod],h:r.h,a:r.a,gh:r.gh,ga:r.ga,casa:r.casa,res:r.res,
  pub:est?est.pub:0,preco:est?preco:0,renda:renda});
 /* o cansaço agora é aplicado minuto a minuto na partida e a recuperação é diária no calendário */
 S.rod++;S.preco=0;S.mod=1;S.ingOk=false;
 if(S.rod>=S.cal.length)S.fim=true;
 else if(Math.random()<0.45)S.ev=sortearEvento();
 render();salvar();
 if(est)animar(est,preco,r.adv)}

/* ---------- animação da bilheteria ---------- */
function animar(est,preco,adv){
 ANIM=true;
 var a=$('anim'),coins='';
 for(var i=0;i<16;i++)coins+='<span class="coin" style="left:'+ri(4,92)+'%;animation-delay:'+(Math.random()*1.2).toFixed(2)+'s">🪙</span>';
 a.innerHTML=coins+'<div class="anim-box"><small>Bilheteria · contra '+esc(adv)+'</small><div class="anim-num" id="an-n">€ 0</div>'+
  '<div class="anim-sub">'+est.pub.toLocaleString('pt-BR')+' torcedores · ingresso a € '+preco+' · '+Math.round(est.pub/est.cap*100)+'% de ocupação</div>'+
  '<button class="full" id="an-ok">Guardar no caixa</button></div>';
 a.innerHTML=mono(a.innerHTML);a.className='on';
 var t0=null,dur=1800,alvo=est.renda;
 function passo(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur);$('an-n')&&($('an-n').textContent='+ '+eurFull(alvo*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(passo)}
 requestAnimationFrame(passo);
 $('an-ok').onclick=function(){a.className='';a.innerHTML='';ANIM=false;render()}}

/* ---------- telas ---------- */
function tile(ico,lab,val,sub,cls){return '<div class="tile '+(cls||'')+'"><small>'+ico+' '+lab+'</small><b>'+val+'</b>'+(sub?'<em>'+sub+'</em>':'')+'</div>'}
function dots(arr){return '<span class="dots">'+(arr||[]).map(function(x){return '<span class="dot '+x+'">'+x+'</span>'}).join('')+'</span>'}

function pPainel(c,o,pos){
 var meu=jogoMeu(),n=S.cl.length,ok=pos<=c.m,fm=Math.round(fisMedia());
 var h=PMUI.painelExtra()+'<div class="tiles">'+
  tile('💰','Caixa',mil(S.caixa),'',S.caixa<0?'bad':'')+
  tile('🏆','Posição',pos+'º de '+n,ok?'✔ Dentro da meta (Top '+c.m+')':'✖ Meta: Top '+c.m,ok?'ok':'bad')+
  tile('💪','Preparo físico',fm+'%','Média dos titulares',fm<50?'bad':fm>=75?'ok':'')+
  tile('🎯','Meta da diretoria',esc(c.metaTxt||('Top '+c.m)),'')+
  '</div>';
 h+='<div class="card"><h2>Moral e torcida</h2>'+bar('Reputação · '+tier(S.rep),S.rep,'rep',Math.round(S.rep)+'/100')+bar('Moral do elenco',S.moral,'mini',Math.round(S.moral)+'/100')+bar('Torcida',S.torc,'mini',Math.round(S.torc)+'/100')+
  '<div class="chips"><span class="chip">Forma recente: '+(S.forma[S.cid].length?dots(S.forma[S.cid]):'sem jogos')+'</span></div></div>';
  h+=miniTab(o,pos,n);
 if(meu){
  var casa=meu[0]===S.cid,adv=clube(casa?meu[1]:meu[0]),pa=o.indexOf(adv.id)+1;
  var gap=S.rod>0?S.dias[S.rod]-S.dias[S.rod-1]:null,ds=gap!==null?descanso(gap):null;
  h+='<div class="card wide"><h2>Próximo jogo · Rodada '+(S.rod+1)+'/'+RODADAS+'</h2>'+
   '<div class="vs"><div class="vt">'+crest(clube(meu[0]),48)+'<b>'+esc(clube(meu[0]).n)+'</b></div><span>x</span><div class="vt">'+crest(clube(meu[1]),48)+'<b>'+esc(clube(meu[1]).n)+'</b></div></div>'+
   '<div class="chips"><span class="chip">📅 '+fmtData(dataR(S.rod))+'</span>'+
   '<span class="chip">'+(casa?'🏟 Em casa':'✈ Fora de casa')+'</span>'+
   '<span class="chip">Adversário: '+pa+'º lugar · força '+adv.f+'</span>'+
   (ds?'<span class="chip '+ds[1]+'">⏱ '+gap+' dias desde o último jogo · '+ds[0]+'</span>':'')+'</div>';
  if(casa){
   var imp=importancia(meu);if(!S.preco)S.preco=sugerido(imp);
   var e=estimar(S.preco,imp,S.mod);
   h+='<div class="sub">Ingressos</div><div class="chips"><span class="chip '+(imp>=.7?'warn':'')+'">'+rotuloImp(imp)+'</span>'+
    (S.mod&&S.mod!==1?'<span class="chip">Evento: público '+sg(Math.round((S.mod-1)*100))+'%</span>':'')+'</div>'+
    '<div class="price" id="tk-p">€ '+S.preco+'</div><input type="range" id="tk" min="5" max="250" step="1" value="'+S.preco+'">'+
    '<div class="kv"><div><small>Público estimado</small><b id="tk-pub">'+e.pub.toLocaleString('pt-BR')+'</b></div>'+
    '<div><small>Ocupação</small><b id="tk-oc">'+Math.round(e.pub/e.cap*100)+'%</b></div>'+
    '<div><small>Renda estimada</small><b id="tk-r">'+eurFull(e.renda)+'</b></div></div>'+
    '<p class="hint">Dica: em jogos comuns, ingresso caro esvazia o estádio. Em jogos decisivos, a torcida paga mais. Preço exagerado irrita a torcida.</p>';
  }else h+='<p class="hint">Jogo fora de casa: sem renda de bilheteria.</p>';
  h+='<div class="calcard" id="calbox">'+calHTML()+'</div>';
   var pronto=S.hoje>=S.dias[S.rod],bl=(S.ev!==null||S.fim||ANIM)?' disabled':'';
   if(pronto)h+='<button class="full" id="b-sim"'+bl+'>⚽ Ir para a partida</button></div>';
   else h+='<div class="mctl"><button id="b-adv"'+(bl||(ADV?' disabled':''))+'>▶ Avançar</button><button class="sec" id="b-pause"'+(ADV?'':' disabled')+'>⏸ Pausar</button></div></div>';
 }
 var u=S.jogos[0];
 if(u)h+='<div class="card wide"><h2>Último resultado</h2>'+cartaoJogo(u)+'</div>';
 return h}

function cartaoJogo(j){
 var nome={V:'Vitória',E:'Empate',D:'Derrota'}[j.res];
 return '<div class="mt '+j.res+'"><div class="mtd">'+fmtData(new Date(S.d0+j.d*864e5))+'<br>Rodada '+j.r+'</div>'+
  '<div class="mtc"><b>'+esc(j.h)+'</b><span class="sc">'+j.gh+' x '+j.ga+'</span><b>'+esc(j.a)+'</b>'+
  '<small>'+(j.casa?'🏟 Em casa':'✈ Fora')+(j.pub?' · Público '+j.pub.toLocaleString('pt-BR')+' · Ingresso € '+j.preco+' · Renda '+eurFull(j.renda):'')+'</small></div>'+
  '<span class="badge '+j.res+'">'+nome+'</span></div>'}

function pClass(c,o,pos){
 var n=S.cl.length,ok=pos<=c.m;
 var h='<div class="card"><h2>Classificação</h2>'+
  '<div class="chips"><span class="chip '+(ok?'good':'bad')+'">Você está em '+pos+'º · '+(ok?'dentro da meta':'fora da meta (Top '+c.m+')')+'</span></div>'+
  '<div class="legend"><span><i style="background:#1fa35a"></i>Zona da meta (Top '+c.m+')</span><span><i style="background:#b91c1c"></i>Zona de risco (3 últimos)</span><span><i style="background:#3dbb6a55"></i>Seu clube</span></div>'+
  '<div class="cls-wrap"><table class="cls"><tr><th>#</th><th>Clube</th><th>Pts</th><th>J</th><th class="hm">V</th><th class="hm">E</th><th class="hm">D</th><th>SG</th><th class="hm">Forma</th></tr>'+
  o.map(function(id,i){
   var t=S.tab[id],x=clube(id),z=(i+1<=c.m)?'z-top':(n>=10&&i+1>n-3)?'z-down':'',sgl=t.gp-t.gc;
   return '<tr class="'+z+(id===S.cid?' eu':'')+'"><td><span class="pos">'+(i+1)+'</span></td><td class="nm">'+esc(x.n)+'</td><td class="pts">'+t.p+'</td><td>'+t.j+'</td><td class="hm">'+t.v+'</td><td class="hm">'+t.e+'</td><td class="hm">'+t.d+'</td><td>'+sg(sgl)+'</td><td class="hm">'+dots(S.forma[id])+'</td></tr>'}).join('')+
  '</table></div></div>';
 return h}

function ajustaBanco(){
 var E=S.esq,on={},ids={},b=[];
 E.slots.forEach(function(s){on[s.id]=1});S.elenco.forEach(function(j){ids[j.id]=1});
 (E.banco||[]).forEach(function(id){if(ids[id]&&!on[id]&&b.indexOf(id)<0)b.push(id)});
 b=b.slice(0,12);
 if(b.length<12){
  var rest=S.elenco.filter(function(j){return !on[j.id]&&b.indexOf(j.id)<0}).sort(function(x,y){return valorJog(y)-valorJog(x)});
  if(!b.some(function(id){var j=porId(S.elenco,id);return j&&j.p==='GOL'})){var g=rest.filter(function(j){return j.p==='GOL'})[0];if(g){b.push(g.id);rest.splice(rest.indexOf(g),1)}}
  while(b.length<12&&rest.length)b.push(rest.shift().id)}
 E.banco=b}
function grpJog(id){var E=S.esq,i;for(i=0;i<E.slots.length;i++)if(E.slots[i].id===id)return ['s',i];i=E.banco.indexOf(id);return i>=0?['b',i]:['f',-1]}
function bindElenco(){
 var q=$('dash').querySelectorAll('[data-esort],[data-egrp]');
 for(var i=0;i<q.length;i++)q[i].onclick=function(){
  var s=this.getAttribute('data-esort');if(s)ELSORT=s;else ELGRP=!ELGRP;
  transicao(render)}}
function pElenco(c){
 var E=S.esq,fm=Math.round(fisMedia()),onS={},onB={},tit=titulares();
 E.slots.forEach(function(s){onS[s.id]=1});E.banco.forEach(function(id){onB[id]=1});
 var pi=POS.map(function(p){return p[0]});
 var crit={
  o:function(a,b){return b.o-a.o},
  i:function(a,b){return a.i-b.i},
  f:function(a,b){return b.f-a.f},
  m:function(a,b){return (b.min||0)-(a.min||0)},
  mo:function(a,b){return PM.d(b.id)[DD.MO]-PM.d(a.id)[DD.MO]},
  n:function(a,b){return a.n.localeCompare(b.n)}};
 var cmp=crit[ELSORT]||crit.o;
 function lin(j){
  var st=onS[j.id]?'Titular':onB[j.id]?'Banco':'Fora do jogo';
  return linhaJog(j,{star:!!onS[j.id],cls:' clk',attr:' data-ficha="'+j.id+'"',sub:st+' · '+j.i+' anos · '+(j.min||0)+' min · '+PMUI.mini(j.id)})}
 var ops=[['o','Overall'],['i','Idade'],['f','Físico'],['mo','Moral'],['m','Minutos'],['n','Nome']];
 var h='<div class="card"><h2>Elenco</h2><div class="chips"><span class="chip '+(fm<50?'bad':fm<70?'warn':'good')+'">Preparo físico dos titulares: '+fm+'%</span><span class="chip">'+S.elenco.length+' jogadores</span><span class="chip">★ titular ('+E.form+')</span></div>'+ 
  (fm<60?'<p class="hint" style="color:var(--warn)">Elenco cansado: o time rende menos.</p>':'')+
  '<div class="grp" style="margin-top:6px">Ordenar por</div><div class="opts">'+ops.map(function(o){return '<button class="opt'+(ELSORT===o[0]?' on':'')+'" data-esort="'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div>'+ 
  '<div class="opts"><button class="opt'+(ELGRP?' on':'')+'" data-egrp="1">Agrupar por posição</button></div>'+ 
  '<p class="hint">Para mudar titulares, banco e fora do jogo, use a aba Tática.</p></div>';
 if(ELGRP){
  h+='<div class="card">';
  POS.forEach(function(p){
   var l=S.elenco.filter(function(j){return j.p===p[0]}).sort(cmp);
   h+='<div class="grp">'+POSNOME[p[0]]+' ('+l.length+')</div>'+l.map(lin).join('')});
  h+='</div>'}
 else h+='<div class="card">'+S.elenco.slice().sort(cmp).map(lin).join('')+'</div>';
 return h}
function pCal(c){
 var n=S.cal.length,h='<div class="card"><h2>Próximos jogos</h2>';
 for(var r=S.rod;r<Math.min(n,S.rod+5);r++){
  var m=jogoDaRodada(r),casa=m[0]===S.cid,adv=clube(casa?m[1]:m[0]),gap=r>0?S.dias[r]-S.dias[r-1]:null,ds=gap!==null?descanso(gap):null;
  h+='<div class="prox"><div><b>'+(casa?'🏟 ':'✈ ')+esc(adv.n)+'</b><small>Rodada '+(r+1)+' · '+fmtData(dataR(r))+'</small></div>'+
   (ds?'<span class="chip '+ds[1]+'">'+gap+' dias · '+ds[0]+'</span>':'<span class="chip">Estreia</span>')+'</div>'}
 h+='<p class="hint">Quanto menor o intervalo entre jogos, menos o elenco se recupera e mais cansados os titulares ficam.</p></div>';

 /* ---- calendário: um mês por vez ---- */
 var res={};S.jogos.forEach(function(j){res[j.r-1]=j.res});
 var mapa={};for(var q=0;q<n;q++){var d=dataR(q);mapa[d.getUTCFullYear()+'-'+d.getUTCMonth()+'-'+d.getUTCDate()]=q}
 var ini=dataR(0),fim=dataR(n-1);
 var minM=ini.getUTCFullYear()*12+ini.getUTCMonth(),maxM=fim.getUTCFullYear()*12+fim.getUTCMonth();
 var hj=new Date(S.d0+S.hoje*864e5),atualM=Math.max(minM,Math.min(maxM,hj.getUTCFullYear()*12+hj.getUTCMonth()));
 if(CALM===null)CALM=atualM;
 CALM=Math.max(minM,Math.min(maxM,CALM));
 var y=Math.floor(CALM/12),mo=CALM%12,dow=new Date(Date.UTC(y,mo,1)).getUTCDay(),dias=new Date(Date.UTC(y,mo+1,0)).getUTCDate();
 var cel='',jm=0,b,dd;
 for(b=0;b<dow;b++)cel+='<div></div>';
 for(dd=1;dd<=dias;dd++){
  var k=mapa[y+'-'+mo+'-'+dd];
  if(k===undefined){cel+='<div class="cd">'+dd+'</div>';continue}
  jm++;
  var mm=jogoDaRodada(k),ca=mm[0]===S.cid,ad=clube(ca?mm[1]:mm[0]);
  cel+='<div class="cd j '+(res[k]||'')+(k===S.rod?' next':'')+'">'+dd+'<i>'+(ca?'🏟 ':'✈ ')+esc(sigla(ad.n))+'</i></div>'}
 var nm=new Date(Date.UTC(y,mo,1)).toLocaleDateString('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'});
 nm=nm.charAt(0).toUpperCase()+nm.slice(1);
 h+='<div class="card"><h2>Calendário da temporada</h2><div id="calwrap">'+
  '<div class="calnav"><button class="sec calarr" id="cal-prev" aria-label="Mês anterior"'+(CALM<=minM?' disabled':'')+'>'+ico('chev-l')+'</button>'+
  '<div class="calttl"><b>'+nm+'</b><small>'+jm+(jm===1?' jogo':' jogos')+' neste mês</small></div>'+
  '<button class="sec calarr" id="cal-next" aria-label="Próximo mês"'+(CALM>=maxM?' disabled':'')+'>'+ico('chev-r')+'</button></div>'+
  '<div class="mes'+(CALDIR?' mes-'+CALDIR:'')+'"><div class="cg">'+['D','S','T','Q','Q','S','S'].map(function(x){return '<b>'+x+'</b>'}).join('')+cel+'</div></div>'+
  '<div class="legend" style="justify-content:center;margin:10px 0 0"><span><i style="background:#3dbb6a"></i>Vitória</span><span><i style="background:#facc15"></i>Empate</span><span><i style="background:#ef4444"></i>Derrota</span><span><i style="background:#fff"></i>Próximo jogo</span></div>'+
  (CALM!==atualM?'<div style="text-align:center;margin-top:8px"><button class="lnk" id="cal-hoje">Voltar ao mês atual</button></div>':'')+
  '</div></div>';
 CALDIR='';
 return h}

function bindCal(){
 var p=$('cal-prev'),nx=$('cal-next'),t=$('cal-hoje'),w=$('calwrap');
 if(!p)return;
 function ir(d){CALM+=d;CALDIR=d>0?'n':'p';render()}
 p.onclick=function(){ir(-1)};
 nx.onclick=function(){ir(1)};
 if(t)t.onclick=function(){CALM=null;CALDIR='';render()};
 if(w){var x0=null;
  w.ontouchstart=function(e){x0=e.touches[0].clientX};
  w.ontouchend=function(e){
   if(x0===null)return;
   var dx=e.changedTouches[0].clientX-x0;x0=null;
   if(Math.abs(dx)>50){var bt=dx<0?nx:p;if(!bt.disabled)bt.click()}}}}


function pHist(c){
 var J=S.jogos,v=0,e=0,d=0,gp=0,gc=0,bil=0;
 J.forEach(function(j){if(j.res==='V')v++;else if(j.res==='E')e++;else d++;gp+=j.casa?j.gh:j.ga;gc+=j.casa?j.ga:j.gh;bil+=j.renda||0});
 var apr=J.length?Math.round((v*3+e)/(J.length*3)*100):0;
 var h='<div class="card"><h2>Resultados da temporada '+S.temp+'</h2>'+
  '<div class="sum"><div><small>Jogos</small><b>'+J.length+'</b></div><div><small>V-E-D</small><b>'+v+'-'+e+'-'+d+'</b></div><div><small>Gols (pró x contra)</small><b>'+gp+' x '+gc+'</b></div><div><small>Aproveitamento</small><b>'+apr+'%</b></div><div><small>Bilheteria total</small><b>'+eurFull(bil)+'</b></div></div>';
 h+=J.length?J.map(cartaoJogo).join(''):'<p class="hint">Nenhuma partida disputada ainda.</p>';
 h+='</div>';
 if(S.hist&&S.hist.length)h+='<div class="card"><h2>Temporadas anteriores</h2>'+S.hist.map(function(x){return '<div class="res">Temporada '+x.t+': '+x.pos+'º lugar</div>'}).join('')+'</div>';
 return h}

function bar(l,v,cls,ex){return '<div class="lab"><span>'+l+'</span><b>'+(ex||Math.round(v))+'</b></div><div class="bar '+cls+'"><i style="width:'+v+'%"></i></div>'}
function pois(l){var L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random()}while(p>L);return k-1}
function ordem(){return S.cl.map(function(c){return c.id}).sort(function(a,b){var x=S.tab[a],y=S.tab[b];return y.p-x.p||(y.gp-y.gc)-(x.gp-x.gc)||y.gp-x.gp})}

var LOGO_HTML=document.querySelector('.top .logo').outerHTML;
