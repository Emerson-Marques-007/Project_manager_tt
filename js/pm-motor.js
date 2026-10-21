var PM={cfg:{},B:null,vc:{},by:[],last:{}};
var JI={ID:0,CL:1,NOME:2,NAC:3,IDADE:4,POS:5,POS2:6,PE:7,PF:8,ALT:9,O:10,POT:11,RIT:12,FIN:13,PAS:14,DRI:15,DEF:16,FIS:17,VAL:18,SAL:19,FIM:20,CLAU:21,FID:22,AMB:23,PROF:24,EMO:25,LID:26,LES:27,DEC:28,PERFIL:29,ANOS:30,FORM:31,REAL:32,POSJ:33,PAPEL:34,FAMA:35,PISO:36,ORIG:37,IDOLO:38,VINC:39,AG:40};
var CI={ID:0,LIGA:1,NOME:2,REP:3,TRANSF:4,SAL:5,PERFIL:6,META:7,PREST:8,POSTURA:9,DEP:10,PRES:11,REGRAS:12,RIV:13,GRUPO:14,FORM:15,EST:16,RAZAO:17,REC:18,FBIL:19,FIXA:20,OPEX:21,REPMER:22,TORC:23,ESC:24,LIGANOME:25,PAIS:26};
/* registro dinâmico de cada jogador (vai no save): array para ficar pequeno */
var DD={C:0,O:1,P:2,I:3,S:4,F:5,V:6,FI:7,MO:8,J:9,MN:10,G:11,A:12,AM:13,VM:14,N:15,NS:16,L:17,ST:18,PC:19,EMP:20,CJ:21,CG:22,CA:23,AD:24,H:25,TJ:26,FG:27};
var PMCFG={fama_base_ovr:40,fama_peso_ovr:1.25,fama_peso_gap:.3,fama_peso_rep:.28,piso_fator:.85,piso_idade_inicio:31,piso_idade_passo:3,piso_craque_fama:90,piso_craque_min:84,aceita_alto:85,aceita_baixo:60,ruido_pct:10,paciencia_inicial:100,paciencia_ofensa:35,oferta_ofensiva_limiar:.7,congelar_dias:14,prem_fora_janela_min:1.8,prem_fora_janela_max:3,chance_fora_janela:.08,comissao_agente_padrao:8,rep_mercado_fechar:2,rep_mercado_abandono:-4,rep_mercado_ofensa:-1,rep_mercado_desistir_medico:-6,efeito_overall_min:-15,efeito_overall_max:7,entrosamento_min:-8,entrosamento_max:5,entrosamento_neutro:50,bilheteria_share:.15,custos_op_pct:.38,ffp_folha_receita:.8,progressao_teto_ano:4,aposentadoria_idade:36,clima_aquecido:1.15,clima_frio:.88,tamanho_elenco_alvo:25,mult_mercado:20,mult_lista:1,ofertas_max_abertas:40,pausa_ofertas:1,mult_interesse:1};
function pmC(a,b,c){return Math.max(b,Math.min(c,a))}
function pmR(a,b){return a+Math.floor(Math.random()*(b-a+1))}
function pmG(){var u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function pmPois(l){var L=Math.exp(-l),k=0,p=1;do{k++;p*=Math.random()}while(p>L);return k-1}
function pmSeed(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)|0;var t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296}}
function pmPick(arr){return arr[Math.floor(Math.random()*arr.length)]}
PM.nivel=['Péssimo','Muito ruim','Ruim','Contente','Boa','Ótima','Excelente'];
PM.lvl=function(v){return v<20?0:v<35?1:v<50?2:v<65?3:v<78?4:v<90?5:6};
PM.lvlNota=function(n){return pmC(Math.round((n/10-5)/.5),0,6)};

/* ---------- carga dos dados-base (action 'mundo') ---------- */
PM.init=function(raw){
 var B={cl:[],j:[],vet:{},ag:{},jn:raw.jn||[],liga:{},cIdx:{}};
 PM.cfg={};for(var k in PMCFG)PM.cfg[k]=PMCFG[k];for(k in (raw.cfg||{}))PM.cfg[k]=raw.cfg[k];
 raw.cl.forEach(function(a,i){B.cl.push(a);B.cIdx[a[CI.ID]]=i;(B.liga[a[CI.LIGA]]=B.liga[a[CI.LIGA]]||[]).push(i)});
 raw.jg.forEach(function(a){B.j[a[JI.ID]]=a});
 (raw.vt||[]).forEach(function(v){B.vet[v[0]+'|'+v[1]]=v[2]});
 (raw.ag||[]).forEach(function(a){B.ag[a[0]]=a});
 PM.B=B;return B};
PM.nClubes=function(){return PM.B.cl.length};
PM.clube=function(i){return PM.B.cl[i]};
PM.ligaDe=function(i){return PM.B.cl[i][CI.LIGA]};
PM.W=function(){return S.W};

PM.novoMundo=function(){
 var B=PM.B,W={p:[],c:[],livres:[],L:{},ag:[],cl:[],emp:[],nb:[],news:[],clima:'normal',nid:100001,jan:{aberta:false,ab:0,fe:0}};
 B.j.forEach(function(b,id){if(!b)return;
  W.p[id]=[b[JI.CL],b[JI.O],b[JI.POT],b[JI.IDADE],Math.round(b[JI.SAL]*1000),b[JI.FIM],Math.round(b[JI.VAL]*1000),100,pmC(Math.round(58+(b[JI.PROF]-50)/6+pmG()*4),30,85),0,0,0,0,0,0,65,0,0,0,-1,-1,0,0,0,400,[]]});
 B.cl.forEach(function(c,i){W.c[i]={pr:c[CI.PREST],rm:c[CI.REPMER],cx:Math.round(c[CI.TRANSF]*1000),ct:35,ff:20,xi:[],fo:c[CI.FORM],es:c[CI.EST],t:0}});
 S.W=W;PM.hidratar();return W};
PM.hidratar=function(){
 var W=S.W,B=PM.B;PM.vc={};PM.by=[];
 (W.nb||[]).forEach(function(b){B.j[b[JI.ID]]=b});
 for(var i=0;i<B.cl.length;i++)PM.by[i]=[];
 W.p.forEach(function(d,id){if(d&&d[DD.C]>=0)PM.by[d[DD.C]].push(id)});
 PM.xiCache={}};
PM.base=function(id){return PM.B.j[id]};
PM.d=function(id){return S.W.p[id]};
PM.elencoIds=function(ci){return PM.by[ci]};
PM.moverJog=function(id,para){
 var d=S.W.p[id],de=d[DD.C];
 if(de>=0){var a=PM.by[de],k=a.indexOf(id);if(k>=0)a.splice(k,1)}
 d[DD.C]=para;if(para>=0)PM.by[para].push(id);d[DD.AD]=0;PM.xiCache={};delete PM.vc[id];
 if(S.W.lt)delete S.W.lt[id];
 if(de===S.wi&&S.lista)PM.deslistar(id)};
/* trava: quem se transferiu nesta janela não é negociado de novo até a próxima */
PM.chaveJanela=function(){var j=S.W.jan;return j&&j.aberta?j.ab:0};
PM.marcar=function(id){var k=PM.chaveJanela();if(k)S.W.p[id][DD.TJ]=k};
PM.recente=function(id){var k=PM.chaveJanela(),d=S.W.p[id];return !!k&&!!d&&d[DD.TJ]===k};
PM.view=function(id){
 if(PM.vc[id])return PM.vc[id];
 var b=PM.B.j[id],d=S.W.p[id],v={};
 var def=function(k,g,s){Object.defineProperty(v,k,{get:g,set:s||function(){},enumerable:false,configurable:true})};
 def('id',function(){return id});def('n',function(){return b[JI.NOME]});def('p',function(){return b[JI.POSJ]});
 def('i',function(){return d[DD.I]});
 def('o',function(){return d[DD.O]},function(x){d[DD.O]=x});
 def('f',function(){return d[DD.FI]},function(x){d[DD.FI]=x});
 def('min',function(){return d[DD.MN]},function(x){d[DD.MN]=x});
 return PM.vc[id]=v};
PM.elencoView=function(ci){return PM.by[ci].map(PM.view)};

/* ---------- datas e janelas ---------- */
PM.ano=function(){return new Date(S.d0).getUTCFullYear()};
PM.msHoje=function(){return S.d0+S.hoje*864e5};
PM.dataStr=function(ms){var d=new Date(ms);return ('0'+d.getUTCDate()).slice(-2)+'/'+('0'+(d.getUTCMonth()+1)).slice(-2)+'/'+d.getUTCFullYear()};
PM.janela=function(){
 var ms=PM.msHoje(),js=PM.B.jn,i,a;
 for(i=0;i<js.length;i++){a=js[i];if(ms>=a[2]&&ms<=a[3]+864e5-1){var rest=Math.round((a[3]-ms)/864e5);return {aberta:true,tipo:a[1],temp:a[0],ab:a[2],fe:a[3],rest:rest,ultimo:rest<=0,inicio:ms-a[2]<864e5}}}
 var prox=null;for(i=0;i<js.length;i++)if(js[i][2]>ms){prox=js[i];break}
 return {aberta:false,prox:prox?prox[2]:0,proxTipo:prox?prox[1]:'',diasProx:prox?Math.round((prox[2]-ms)/864e5):0}};
PM.inicioTemporada=function(){ /* dia (hoje) em que a temporada começa: abertura da janela de verão */
 var y=PM.ano(),js=PM.B.jn,i;for(i=0;i<js.length;i++)if(js[i][1]==='Verão'&&new Date(js[i][2]).getUTCFullYear()===y)return Math.round((js[i][2]-S.d0)/864e5);
 return -38};
/* fim do contrato: 30/06 do ano gravado */
PM.mesesRest=function(id){var d=S.W.p[id],fim=Date.UTC(d[DD.F],5,30);return Math.max(0,Math.round((fim-PM.msHoje())/864e5/30.4))};
PM.anosContr=function(id){return pmC(S.W.p[id][DD.F]-PM.ano(),0,6)};

/* ---------- fama, piso, valor, salário ---------- */
PM.fama=function(id){var b=PM.B.j[id],d=S.W.p[id];return pmC(Math.round(b[JI.FAMA]+(d[DD.O]-b[JI.O])*1.2+(d[DD.N]/10-6.4)*1.5),1,99)};
PM.piso=function(id){var c=PM.cfg,d=S.W.p[id],f=PM.fama(id);return Math.max(0,Math.max(f>=c.piso_craque_fama?c.piso_craque_min:0,Math.round(f*c.piso_fator-Math.max(0,d[DD.I]-c.piso_idade_inicio)*c.piso_idade_passo)))};
PM.valor=function(id){ /* € mil */
 var b=PM.B.j[id],d=S.W.p[id],o=d[DD.O],a=d[DD.I];
 var ln=-8.0368+.1427*o-.1165*Math.max(0,a-27)-.09*Math.max(0,a-33)+.0152*Math.max(0,25-a)+.0122*(d[DD.P]-o)+(b[JI.POSJ]==='GOL'?.0014:0)+.0156*PM.anosContr(id);
 var f=pmC(1+(d[DD.N]/10-6.4)*.04,.9,1.12);
 return Math.max(50,Math.round(Math.exp(ln)*1000*f))};
PM.salJusto=function(id){var d=S.W.p[id],b=PM.B.j[id],ag=PM.B.ag[b[JI.AG]],g=ag?ag[3]:50;
 return Math.max(60,Math.round(PM.valor(id)*.254*(1+(PM.fama(id)-50)/250)*(1+(50-d[DD.MO])/300)*(1+g/600)))};
PM.pos6=function(id){return PM.B.j[id][JI.POSJ]};
PM.prestClube=function(ci){return S.W.c[ci].pr};
PM.foreign=function(id,ci){var b=PM.B.j[id],pais=PM.B.cl[ci][CI.PAIS];return b[JI.NAC]!==pais};
PM.papel=function(id){return PM.B.j[id][JI.PAPEL]};

/* ---------- forma, fase, moral ---------- */
PM.faseNivel=function(id){return PM.lvlNota(S.W.p[id][DD.N])};
PM.formaNivel=function(id){return PM.lvl(S.W.p[id][DD.FI])};
PM.moralNivel=function(id){return PM.lvl(S.W.p[id][DD.MO])};
PM.efOv=function(id){
 var c=PM.cfg,d=S.W.p[id],fa=[-5,-3,-1.5,0,1.5,2.5,3],fo=[-6,-4,-2,0,.5,1,1.5],mo=[-4,-3,-1.5,0,1,1.5,2];
 var e=fa[PM.faseNivel(id)]+fo[PM.formaNivel(id)]+mo[PM.moralNivel(id)];
 return d[DD.O]+pmC(e,c.efeito_overall_min,c.efeito_overall_max)};

/* ---------- escalação da IA ---------- */
PM.escalar=function(ci){
 var W=S.W,fo=W.c[ci].fo,need=FORM[fo]||FORM['4-3-3'],ids=PM.by[ci].filter(function(id){return S.W.p[id][DD.L]<=0}),used={},slots=[];
 function topo(p,n){var l=ids.filter(function(id){return !used[id]&&PM.pos6(id)===p}).sort(function(a,b){return PM.efOv(b)*(.55+.45*S.W.p[b][DD.FI]/100)-PM.efOv(a)*(.55+.45*S.W.p[a][DD.FI]/100)}).slice(0,n);l.forEach(function(id){used[id]=1;slots.push({p:p,id:id})});return l.length}
 var out=[];
 topo('GOL',1);
 var lat=ids.filter(function(id){return PM.pos6(id)==='LAT'}).sort(function(a,b){return PM.efOv(b)-PM.efOv(a)}).slice(0,need.LAT);
 var zag=ids.filter(function(id){return PM.pos6(id)==='ZAG'}).sort(function(a,b){return PM.efOv(b)-PM.efOv(a)}).slice(0,need.ZAG);
 var ordem=[];ordem.push(slots[0]);
 if(lat[0])ordem.push({p:'LAT',id:lat[0]});zag.forEach(function(id){ordem.push({p:'ZAG',id:id})});if(lat[1])ordem.push({p:'LAT',id:lat[1]});
 ordem.forEach(function(s){if(s)used[s.id]=1});
 slots=ordem.filter(Boolean);
 ['VOL','MEI','ATA'].forEach(function(p){topo(p,need[p])});
 /* se faltar gente de alguma posição, completa com os melhores restantes */
 var want=11;
 if(slots.length<want){var rest=ids.filter(function(id){return !used[id]&&PM.pos6(id)!=='GOL'}).sort(function(a,b){return PM.efOv(b)-PM.efOv(a)});
  var grp=['ZAG','LAT','VOL','MEI','ATA'],gi=0;
  while(slots.length<want&&rest.length){var id=rest.shift();slots.push({p:PM.pos6(id),id:id});used[id]=1}}
 return slots.slice(0,11)};
PM.xi=function(ci){return PM.xiCache[ci]||(PM.xiCache[ci]=PM.escalar(ci))};

/* ---------- entrosamento ---------- */
PM.LANG={Espanha:'es',Argentina:'es',Uruguai:'es',México:'es',Colômbia:'es',Chile:'es',Venezuela:'es',Equador:'es',Paraguai:'es',Peru:'es',Portugal:'pt',Brasil:'pt',Inglaterra:'en','Estados Unidos':'en',Escócia:'en',Irlanda:'en',Canadá:'en',Alemanha:'de',Áustria:'de',Suíça:'de',França:'fr',Bélgica:'fr',Senegal:'fr','Costa do Marfim':'fr',Marrocos:'ar','Arábia Saudita':'ar',Egito:'ar',Argélia:'ar',Itália:'it','Países Baixos':'nl'};
PM.entro=function(ci,slots,form,estilo){
 var W=S.W,c=W.c[ci],al=[],i,ids=slots.map(function(s){return s.id});
 var ad=0,adS={d:0,m:0,a:0},nS={d:0,m:0,a:0};
 slots.forEach(function(s){var b=PM.B.j[s.id],pj=b[JI.POSJ],p2=b[JI.POS2],g2=p2?({LE:'LAT',LD:'LAT',MC:'MEI',PE:'ATA',PD:'ATA'}[p2]||p2):'',v;
  if(pj===s.p)v=1;else if(g2===s.p)v=.85;else if(s.p==='GOL'||pj==='GOL')v=.1;else if((pj==='ZAG'&&s.p==='LAT')||(pj==='LAT'&&s.p==='ZAG')||(pj==='VOL'&&s.p==='MEI')||(pj==='MEI'&&(s.p==='VOL'||s.p==='ATA'))||(pj==='ATA'&&s.p==='MEI'))v=.6;else v=.35;
  if(v<1)al.push(b[JI.NOME]+' fora de posição');
  ad+=v;var k=(s.p==='GOL'||s.p==='ZAG'||s.p==='LAT')?'d':s.p==='ATA'?'a':'m';adS[k]+=v;nS[k]++});
 ad/=Math.max(1,slots.length);
 var roles={};slots.forEach(function(s){var r=PM.papel(s.id);roles[r]=(roles[r]||0)+1});
 function cnt(l){return l.reduce(function(a,r){return a+(roles[r]||0)},0)}
 var latOf=cnt(['Lateral ofensivo']),cob=cnt(['Volante destruidor','Volante equilibrado','Zagueiro de marcação','Lateral defensivo']),cri=cnt(['Armador','Meia armador','Meia atacante','Volante construtor','Meia equilibrado','Meia box-to-box']);
 var fin=slots.filter(function(s){return s.p==='ATA'}).length?cnt(['Ponta finalizador','Atacante finalizador','Centroavante de referência','Atacante móvel','Meia atacante']):1;
 var eq=1;
 if(latOf>=2&&cob<3){eq-=.3;al.push('Dois laterais ofensivos sem cobertura: defesa exposta')}
 if(cri<1){eq-=.25;al.push('Sem criador de jogo no meio')}
 if(fin<1){eq-=.2;al.push('Sem finalizador no ataque')}
 if(cob<2){eq-=.15;al.push('Pouca proteção à defesa')}
 if((roles['Centroavante de referência']||0)>=2){eq-=.1;al.push('Dois centroavantes de referência disputam o mesmo papel')}
 eq=pmC(eq,0,1);
 var prev=c.xi||[],inter=0;ids.forEach(function(id){if(prev.indexOf(id)>=0)inter++});
 var ctt=c.ct,ff=(c.fo===form)?c.ff:15;
 var lg={},maxl=0,lid=0,stars=0,starsA=0,novos=0,mo=0,fi=0;
 slots.forEach(function(s){var b=PM.B.j[s.id],d=S.W.p[s.id],l=PM.LANG[b[JI.NAC]]||b[JI.NAC];lg[l]=(lg[l]||0)+1;maxl=Math.max(maxl,lg[l]);lid=Math.max(lid,b[JI.LID]);
  if(PM.fama(s.id)>=85){stars++;if(s.p==='ATA')starsA++}
  if(d[DD.AD]<45)novos++;mo+=d[DD.MO];fi+=d[DD.FI]});
 var afin=.5*pmC((maxl-2)/6,0,1)+.5*lid/100;
 var ego=(stars>=6?(stars-5)*3:0)+(starsA>=4?(starsA-3)*4:0);if(ego)al.push('Estrelas demais disputando protagonismo');
 var nov=Math.min(15,novos*2.5);if(novos>=3)al.push(novos+' reforços ainda em adaptação');
 var cond=pmC(.9+.2*(mo/11/100)+.1*(fi/11/100),.8,1.1);
 var tot=pmC((100*(.28*ad+.24*eq+.24*ctt/100+.10*ff/100+.14*afin)-ego-nov)*cond,0,100);
 var cf=PM.cfg,n=cf.entrosamento_neutro,mod=tot>=n?cf.entrosamento_max*(tot-n)/(100-n):cf.entrosamento_min*(n-tot)/n;
 function sec(k){return pmC(Math.round(tot+((adS[k]/Math.max(1,nS[k]))-ad)*40),0,100)}
 return {t:Math.round(tot),mod:mod,d:sec('d'),m:sec('m'),a:sec('a'),al:al,ad:ad,eq:eq,ct:ctt,ff:ff}};
PM.atualizaEntro=function(ci,slots,form){
 var c=S.W.c[ci],ids=slots.map(function(s){return s.id}),prev=c.xi||[],it=0;
 ids.forEach(function(id){if(prev.indexOf(id)>=0)it++});var ov=prev.length?it/11:1;
 c.ct=pmC(ov>=.82?c.ct+6*(1-c.ct/130):c.ct-(1-ov)*28,0,100);
 c.ff=(c.fo===form)?Math.min(100,c.ff+5):15;c.fo=form;c.xi=ids};

/* ---------- força do time (igual à sua potencia(), com overall efetivo) ---------- */
PM.forcaIA=function(ci){
 var slots=PM.xi(ci),c=S.W.c[ci],A=0,D=0,en=PM.entro(ci,slots,c.fo,c.es),st={def:{a:.93,d:1.07},eq:{a:1,d:1},ofe:{a:1.07,d:.94}}[c.es]||{a:1,d:1};
 slots.forEach(function(s){var d=S.W.p[s.id],e=PM.efOv(s.id)*(.55+.45*d[DD.FI]/100)*(PM.pos6(s.id)===s.p?1:.82);A+=e*WA[s.p];D+=e*WD[s.p]});
 return {atk:A/REFW*st.a+en.mod,def:D/REFW*st.d+en.mod,en:en}};

/* ---------- simulação estatística de uma partida (IA x IA) ---------- */
PM.pesoGol={ATA:5,MEI:3,VOL:1,LAT:1.2,ZAG:.8,GOL:0};
function pmEsc(arr,fn){var tot=0,w=arr.map(function(x){var v=Math.max(.01,fn(x));tot+=v;return v}),r=Math.random()*tot,k;for(k=0;k<arr.length;k++){r-=w[k];if(r<=0)break}return arr[Math.min(k,arr.length-1)]}
PM.simPartida=function(hi,ai,opt){
 opt=opt||{};
 var fh=PM.forcaIA(hi),fa=PM.forcaIA(ai);
 var gh=pmPois(1.35*1.1*Math.pow(fh.atk/fa.def,1.6)),ga=pmPois(1.35/1.1*Math.pow(fa.atk/fh.def,1.6));
 PM.regPartida(hi,gh,ga);PM.regPartida(ai,ga,gh);
 var ca=S.W.c;
 PM.atualizaEntro(hi,PM.xi(hi),ca[hi].fo);PM.atualizaEntro(ai,PM.xi(ai),ca[ai].fo);
 return [gh,ga]};
/* distribui gols, assistências, cartões, minutos, notas e lesões dentro de um clube */
PM.regPartida=function(ci,gf,gs,ext){
 var W=S.W,sl=PM.xi(ci),starters=sl.map(function(s){return s.id}),bench=PM.by[ci].filter(function(id){return starters.indexOf(id)<0&&W.p[id][DD.L]<=0}).sort(function(a,b){return PM.efOv(b)-PM.efOv(a)});
 var nsub=Math.min(bench.length,pmR(2,4)),mins={},i,out;
 starters.forEach(function(id){mins[id]=90});
 var cand=starters.filter(function(id){return PM.pos6(id)!=='GOL'}).sort(function(a,b){return W.p[a][DD.FI]-W.p[b][DD.FI]}).slice(0,nsub);
 cand.forEach(function(id,k){var m=pmR(55,85);mins[id]=m;var sub=bench[k];if(sub!==undefined)mins[sub]=90-m});
 var onP=Object.keys(mins).map(Number);
 var gols={},ass={},am={},vm={};
 for(i=0;i<gf;i++){var e=pmEsc(onP,function(id){return (PM.pesoGol[PM.pos6(id)]||0)*(PM.efOv(id)/70)*(mins[id]/90)});gols[e]=(gols[e]||0)+1;
  if(Math.random()<.7){var a=pmEsc(onP.filter(function(x){return x!==e}),function(id){return ((PM.pesoGol[PM.pos6(id)]||0)+.5)*(PM.efOv(id)/70)});ass[a]=(ass[a]||0)+1}}
 var ncards=pmPois(1.5);for(i=0;i<ncards;i++){var c=pmEsc(onP,function(id){return 130-PM.B.j[id][JI.EMO]});am[c]=1}
 if(Math.random()<.05){var r=pmEsc(onP,function(id){return 130-PM.B.j[id][JI.EMO]});vm[r]=1}
 var res=gf>gs?.35:gf<gs?-.3:0,avg=0;onP.forEach(function(id){avg+=W.p[id][DD.O]});avg/=onP.length;
 onP.forEach(function(id){
  var d=W.p[id],g=gols[id]||0,a=ass[id]||0,p=PM.pos6(id),mn=mins[id];
  var nota=6+.9*g+.5*a+res+((gs===0&&(p==='GOL'||p==='ZAG'||p==='LAT'))?.4:0)+(p==='GOL'?-.12*gs:0)-(vm[id]?1.2:0)+(d[DD.O]-avg)/40+pmG()*.55;
  nota=pmC(nota,3.5,10);
  d[DD.J]++;d[DD.MN]+=mn;d[DD.G]+=g;d[DD.A]+=a;d[DD.AM]+=am[id]?1:0;d[DD.VM]+=vm[id]?1:0;d[DD.CJ]++;d[DD.CG]+=g;d[DD.CA]+=a;
  d[DD.NS]+=Math.round(nota*10);d[DD.N]=Math.round(d[DD.N]*.7+nota*10*.3);
  d[DD.FI]=Math.max(5,d[DD.FI]-12*mn/90*(1+(PM.B.j[id][JI.LES]>70?.1:0)));
  var pi=.0009*(1+PM.B.j[id][JI.LES]/80)*(d[DD.FI]<50?1.8:1)*(mn/90);
  if(Math.random()<pi)d[DD.L]=pmPick([7,10,14,21,30,45,70,110]);
  if(ext)ext(id,nota,g,a)});
 /* moral do grupo */
 var dm=gf>gs?1.2:gf<gs?-1.5:0;
 PM.by[ci].forEach(function(id){var d=W.p[id],x=mins[id]?dm:dm-(PM.efOv(id)>=avg+2?.8:0);d[DD.MO]=pmC(d[DD.MO]+x,5,100)});
 return {gols:gols,ass:ass,mins:mins}};

/* ---------- ligas do mundo (todas as ligas, menos a do usuário que usa o seu calendário) ---------- */
PM.gerarDias=function(n,fim){var g=[7,7,7,7,4,4,3,5,6,3],d=[0];for(var i=1;i<n;i++)d.push(d[i-1]+g[pmR(0,g.length-1)]);var f=fim/d[n-1];return d.map(function(x){return Math.round(x*f)})};
PM.circulo=function(ids){var n=ids.length,a=ids.slice(),r=[],i,j,m,h,v;for(i=0;i<n-1;i++){m=[];for(j=0;j<n/2;j++){h=a[j];v=a[n-1-j];m.push(i%2?[v,h]:[h,v])}r.push(m);a.splice(1,0,a.pop())}return r.concat(r.map(function(x){return x.map(function(p){return [p[1],p[0]]})}))};
PM.novaTemporadaMundo=function(ligaUser,fimDias){
 var W=S.W,B=PM.B;W.L={};
 Object.keys(B.liga).forEach(function(lid){if(lid===ligaUser)return;
  var ids=B.liga[lid].slice(),n=ids.length%2?ids.concat([-1]):ids,cal=PM.circulo(n).map(function(r){return r.filter(function(p){return p[0]>=0&&p[1]>=0})}),tab={};
  ids.forEach(function(i){tab[i]=[0,0,0,0,0,0,0]});
  W.L[lid]={cal:cal,dias:PM.gerarDias(cal.length,fimDias),rod:0,tab:tab}})};
PM.tabAdd=function(tab,h,a,gh,ga){var th=tab[h],ta=tab[a];th[1]++;ta[1]++;th[5]+=gh;th[6]+=ga;ta[5]+=ga;ta[6]+=gh;
 if(gh>ga){th[0]+=3;th[2]++;ta[4]++}else if(gh<ga){ta[0]+=3;ta[2]++;th[4]++}else{th[0]++;ta[0]++;th[3]++;ta[3]++}};
/* chamado todo dia: joga as rodadas das outras ligas marcadas para o dia (dia relativo ao início do calendário do usuário) */
PM.jogarMundoDia=function(diaRel){
 var W=S.W;PM.xiCache={};Object.keys(W.L).forEach(function(lid){var L=W.L[lid];
  while(L.rod<L.cal.length&&L.dias[L.rod]<=diaRel){L.cal[L.rod].forEach(function(p){var r=PM.simPartida(p[0],p[1]);PM.tabAdd(L.tab,p[0],p[1],r[0],r[1])});L.rod++}})};
PM.ordemLiga=function(lid){var L=S.W.L[lid];return Object.keys(L.tab).map(Number).sort(function(a,b){var x=L.tab[a],y=L.tab[b];return y[0]-x[0]||(y[5]-y[6])-(x[5]-x[6])||y[5]-x[5]})};

/* arredonda números antes de salvar (deixa o save bem menor) */
PM.compactar=function(){S.W.p.forEach(function(d){if(!d)return;d[DD.FI]=Math.round(d[DD.FI]*10)/10;d[DD.MO]=Math.round(d[DD.MO]*10)/10;d[DD.V]=Math.round(d[DD.V]);d[DD.S]=Math.round(d[DD.S])});
 S.W.c.forEach(function(c){c.pr=Math.round(c.pr*10)/10;c.ct=Math.round(c.ct*10)/10;c.cx=Math.round(c.cx)});S.fin.conf=Math.round(S.fin.conf*10)/10;S.repMer=Math.round(S.repMer*10)/10};
/* =====================================================================
   PM MOTOR - PARTE 2  (finanças, contratos, negociação, IA de mercado, fim de temporada)
   Cole logo DEPOIS da parte 1. Usa também fmtK() do seu código.
   ===================================================================== */
PM.me=function(){return S.wi};
PM.meuNome=function(){return PM.B.cl[S.wi][CI.NOME]};
PM.log=function(t){var w=S.W;w.news.unshift({d:PM.msHoje(),t:t});if(w.news.length>40)w.news.pop()};
PM.iniciarSave=function(){
 S.fin={div:0,mes:0,conf:100,hist:[]};S.repMer=PM.B.cl[S.wi][CI.REPMER];S.neg=[];S.ofe=[];S.parc=[];S.bon=[];S.prom={};S.pendOp=[];S.bal=null;S.nid=1;S.cnt={ab:0,fe:0};
 S.W.cx=S.W.cx||0};

/* ---------- finanças (caixa em € mil) ---------- */
PM.folhaMes=function(){return PM.by[S.wi].reduce(function(a,id){return a+S.W.p[id][DD.S]},0)/12};
PM.folhaAno=function(){return PM.by[S.wi].reduce(function(a,id){return a+S.W.p[id][DD.S]},0)};
PM.receitaAno=function(){return PM.B.cl[S.wi][CI.REC]*1000};
PM.receber=function(v,t){ /* receita: abate primeiro a dívida salarial */
 var f=S.fin;if(f.div>0&&v>0){var p=Math.min(f.div,v);f.div-=p;v-=p;if(p>0)PM.log('Receita de '+fmtK(p)+' usada para quitar salários atrasados');if(f.div<=0){f.div=0;f.mes=0}}
 S.caixa+=v};
PM.moralCap=function(){return S.fin.conf>=100?100:Math.round(40+.6*S.fin.conf)};
PM.mensal=function(){
 var c=PM.B.cl[S.wi],f=S.fin,ev=[],fix=c[CI.FIXA],opx=c[CI.OPEX],fol=Math.round(PM.folhaMes());
 var cxAntes=S.caixa,divAnt=f.div;S.caixa+=fix-opx;
 /* parcelas e bônus vencidos */
 var h=PM.msHoje();S.parc=S.parc.filter(function(p){if(p.dia<=h){if(p.v>0)PM.receber(p.v);else S.caixa+=p.v;ev.push({k:'parc',t:(p.v>0?'Recebido ':'Pago ')+fmtK(Math.abs(p.v))+': '+p.t});return false}return true});
 var devido=fol+f.div,pago=Math.min(Math.max(0,S.caixa),devido);
 var novoAtraso=devido-pago;
 S.caixa-=pago;
 if(novoAtraso>0){
  f.mes++;var sev=Math.min(3,novoAtraso/Math.max(1,fol)),mediana=PM.by[S.wi].map(function(id){return S.W.p[id][DD.S]}).sort(function(a,b){return a-b})[Math.floor(PM.by[S.wi].length/2)];
  PM.by[S.wi].forEach(function(id){var d=S.W.p[id],b=PM.B.j[id],k=1;if(d[DD.S]<=mediana)k*=1.3;if(b[JI.FID]>=80||b[JI.PROF]>=80)k*=.6;
   d[DD.MO]=pmC(d[DD.MO]-Math.min(22,6*sev*k)*(1+.5*(f.mes-1)),5,100)});
  f.conf=pmC(f.conf-(12*Math.min(1,sev)+8*f.mes),0,100);S.torc=pmC(S.torc-1,0,100);
  f.div=novoAtraso;
  ev.push({k:'atraso',t:'Salários atrasados: '+fmtK(novoAtraso)+' em aberto ('+f.mes+(f.mes>1?' meses seguidos':' mês')+'). Moral e confiança da diretoria caíram.'});
 }else{
  f.div=0;f.mes=0;f.conf=Math.min(100,f.conf+2);
  ev.push({k:'folha',t:'Folha de '+fmtK(fol)+' paga. Receita fixa '+fmtK(fix)+', custos '+fmtK(opx)+'.'});
 }
 f.hist.push([h,fol,pago,f.div]);if(f.hist.length>24)f.hist.shift();
 PM.by[S.wi].forEach(function(id){var d=S.W.p[id];d[DD.MO]=Math.min(d[DD.MO],PM.moralCap())});
 ev.push({k:'folhaAnim',d:{antes:cxAntes,fix:fix,opx:opx,fol:fol,divAnt:divAnt,pago:pago,atraso:novoAtraso,depois:S.caixa,mes:f.mes,conf:Math.round(f.conf)}});
 return ev};
PM.pagarAgora=function(v,t){S.caixa-=v;S.fin.hist};
PM.ffpOk=function(extraSal){return (PM.folhaAno()+extraSal)<=PM.cfg.ffp_folha_receita*PM.receitaAno()};

/* ---------- elegibilidade (regras, vetos, prestígio) ---------- */
PM.regrasClube=function(ci){var r=PM.B.cl[ci][CI.REGRAS];return r?String(r).split(';'):[]};
PM.elegivel=function(id,ci){
 var b=PM.B.j[id],d=S.W.p[id],B=PM.B,rg=PM.regrasClube(ci),i,r;
 if(B.vet[id+'|'+ci]===0)return {ok:false,m:'O jogador jamais jogaria neste clube (rivalidade/identidade)'};
 for(i=0;i<rg.length;i++){r=rg[i].split(':');
  if(r[0]==='BASCO_ESTRITO'&&b[JI.ORIG]!=='País Basco')return {ok:false,m:'Política do clube: só contrata jogadores do País Basco'};
  if(r[0]==='BASCO_PREF'&&b[JI.ORIG]!=='País Basco'&&b[JI.NAC]!=='Espanha')return {ok:false,m:'Política do clube: prefere jogadores bascos ou espanhóis'};
  if((r[0]==='LIM_ESTRANGEIROS'||r[0]==='LIM_INTERNACIONAIS')&&PM.foreign(id,ci)){var n=PM.by[ci].filter(function(x){return PM.foreign(x,ci)}).length;if(n>=Number(r[1]))return {ok:false,m:'Limite de '+r[1]+' '+(r[0]==='LIM_ESTRANGEIROS'?'estrangeiros':'jogadores internacionais')+' atingido'}}}
 var piso=PM.piso(id),pr=S.W.c[ci].pr,fm=PM.fama(id);
 if(fm>=PM.cfg.piso_craque_fama&&pr<PM.cfg.piso_craque_min)return {ok:false,m:'Craque de topo não aceita um clube deste patamar'};
 if(piso-pr>12)return {ok:false,m:'O jogador não aceitaria um clube de prestígio tão menor'};
 return {ok:true,m:''}};
PM.interesse=function(id,ci){ /* qualitativo, para a ficha */
 var e=PM.elegivel(id,ci);if(!e.ok)return 'Nenhum';var df=S.W.c[ci].pr-PM.piso(id);return df>=8?'Alto':df>=0?'Médio':'Baixo'};

/* ---------- preço pedido pelo clube vendedor ---------- */
PM.precoPedido=function(id,de,para,o){
 o=o||{};var c=PM.B.cl[de],b=PM.B.j[id],d=S.W.p[id],W=S.W,cfg=PM.cfg,m=1,rs=pmSeed((o.seed||0)+id*7);
 m*={Vendedor:.92,Neutro:1.08,Intransigente:1.28}[c[CI.POSTURA]]||1;
 var ltp=S.W.lt&&S.W.lt[id];if(ltp===1)m*=.85;else if(ltp===2)m*=.9;
 var mr=PM.mesesRest(id);if(mr<=6)m*=.35+.65*mr/6*0.5;else if(mr<=12)m*=.6+.4*(mr-6)/6;
 if(d[DD.I]>=34)m*=.7;else if(d[DD.I]>=32)m*=.88;
 if(b[JI.FORM]==='Sim'&&b[JI.FID]>=85&&b[JI.CL]===de)m*=1.3;
 if(PM.B.cl[de][CI.RIV].split(';').indexOf(PM.B.cl[para][CI.ID])>=0)m*=1.5;
 if(c[CI.PRES]==='Pão-duro')m*=1.05;else if(c[CI.PRES]==='Emotivo'&&b[JI.FORM]==='Sim')m*=1.15;
 m*=({aquecido:cfg.clima_aquecido,frio:cfg.clima_frio}[W.clima])||1;
 var rm=para===S.wi?S.repMer:W.c[para].rm;if(rm<50)m*=1+(50-rm)/200;else m*=1-(rm-50)/600;
 var dep=c[CI.DEP];m*=1-.15*pmC(dep,0,100)/100;
 var top=PM.by[de].slice().sort(function(a,b2){return S.W.p[b2][DD.O]-S.W.p[a][DD.O]}).slice(0,3);if(top.indexOf(id)>=0)m*=1.15;
 m=Math.min(m,2.0);var jj=PM.janela();if(!jj.aberta)m*=(o.fj||2.2);else if(jj.ultimo&&dep>=40)m*=.93;
 m*=1+(rs()*2-1)*cfg.ruido_pct/100;
 return Math.round(PM.valor(id)*m)};
PM.intocavel=function(id,de){
 if(S.W.lt&&S.W.lt[id])return false; /* listado nunca é intocável */
 var c=PM.B.cl[de],b=PM.B.j[id],d=S.W.p[id],top=PM.by[de].slice().sort(function(a,b2){return S.W.p[b2][DD.O]-S.W.p[a][DD.O]})[0];
 if(c[CI.POSTURA]==='Intransigente'&&top===id&&S.W.c[de].pr>=85)return true;
 if(b[JI.FORM]==='Sim'&&b[JI.FID]>=92&&b[JI.CL]===de&&c[CI.POSTURA]!=='Vendedor')return true;
 return false};

/* ---------- valor de uma oferta em € mil, comparável ao preço pedido ---------- */
PM.valorOferta=function(of,ask){
 var v=of.valor||0,pa=of.parc||1,i;
 v*=1-.025*(pa-1);
 (of.bonus||[]).forEach(function(b){v+=.5*b.valor});
 v+=(of.rev||0)/100*.3*ask;
 if(of.rec)v+=.04*ask;
 var tr=0;(of.troca||[]).forEach(function(id){var d=S.W.p[id],u=PM.valor(id)*(d[DD.I]<=30?1:.7)*(PM.mesesRest(id)<=6?.6:1);tr+=u});
 v+=Math.min(tr,.7*ask+ (of.valor||0)*0);
 if(of.emp){var e=of.emp;v=(e.taxa||0)+(e.t==='obrig'?.85*(e.valorOpc||0):e.t==='opcao'?.12*(e.valorOpc||0):0)+tr*0;v+=Math.min(tr,.5*ask)}
 return Math.round(v)};
PM.nota=function(vo,ask,rod,seed){
 var cfg=PM.cfg,ratio=vo/Math.max(1,ask),hu=(pmSeed(seed+rod*13)()*2-1)*3;
 return pmC(Math.round(60+(ratio-.85)*(25/.15)+hu),0,100)};
PM.tensao=function(p){return p>=70?['Calma',0]:p>=45?['Atenção',1]:p>=20?['Tensa',2]:['Quase rompendo',3]};

/* ---------- negociações do usuário ---------- */
PM.neg={};
PM.negPorJog=function(jid){return S.neg.filter(function(n){return n.j===jid&&['aberta','jogador','medico','espera','congelada'].indexOf(n.est)>=0})[0]};
PM.neg.abrir=function(jid){
 var d=S.W.p[jid],me=S.wi;if(PM.negPorJog(jid))return {ok:false,m:'Você já está negociando por este jogador.'};
 if(d[DD.C]===me)return {ok:false,m:'O jogador já é do seu clube.'};
 var el=PM.elegivel(jid,me);if(!el.ok)return {ok:false,m:el.m};
 if(PM.recente(jid))return {ok:false,m:'Este jogador já se transferiu nesta janela e não pode ser negociado de novo agora.'};
 var n={id:S.nid++,j:jid,de:d[DD.C],est:'aberta',fase:'clube',pac:PM.cfg.paciencia_inicial,rod:0,seed:pmR(1,1e9),ask:0,fj:1,msgs:[],pend:null,of:null,ct:null,jog:null,dia:S.hoje,livre:d[DD.C]===-1,ate:0};
 var jn=PM.janela();S.cnt.ab++;
 if(n.livre){n.fase='jogador';n.msgs.push({q:'c',t:'Jogador sem clube: pode ser contratado a qualquer momento. Faça a proposta de contrato.'});S.neg.push(n);return {ok:true,n:n}}
 if(PM.intocavel(jid,n.de)){n.est='recusada';n.msgs.push({q:'c',t:PM.B.j[jid][JI.NOME]+' não está à venda.'});S.neg.push(n);return {ok:true,n:n}}
 if(!jn.aberta){
  var c=PM.B.cl[n.de],ch=PM.cfg.chance_fora_janela*(S.W.lt&&S.W.lt[jid]?4:1)*({Vendedor:2,Neutro:1,Intransigente:.3}[c[CI.POSTURA]]||1)*(.5+c[CI.DEP]/50);
  if(Math.random()>ch){n.est='recusada';n.msgs.push({q:'c',t:'Estamos fora da janela de transferências. Não negociamos agora.'});S.neg.push(n);return {ok:true,n:n}}
  n.fj=PM.cfg.prem_fora_janela_min+Math.random()*(PM.cfg.prem_fora_janela_max-PM.cfg.prem_fora_janela_min);
  n.msgs.push({q:'c',t:'Fora da janela não costumamos negociar, mas ouvimos. Vai custar caro.'})}
 else n.msgs.push({q:'c',t:'Estamos dispostos a conversar. Envie sua proposta.'});
 n.ask=PM.precoPedido(jid,n.de,me,{seed:n.seed,fj:n.fj});
 S.neg.push(n);return {ok:true,n:n}};
PM.neg.upfront=function(of){var up=(of.valor||0)/(of.parc||1);if(of.emp)up=of.emp.taxa||0;return Math.round(up)};
PM.neg.oferta=function(n,of){
 if(n.est!=='aberta'||n.fase!=='clube'||n.pend)return {ok:false,m:'Não é possível enviar proposta agora.'};
 if(!of.valor&&!of.emp&&!(of.troca&&of.troca.length))return {ok:false,m:'Informe um valor, uma troca ou um empréstimo.'};
 if(S.caixa<PM.neg.upfront(of))return {ok:false,m:'Caixa insuficiente para o pagamento inicial.'};
 for(var i=0;i<(of.troca||[]).length;i++)if(PM.by[S.wi].indexOf(of.troca[i])<0)return {ok:false,m:'Jogador de troca inválido.'};
 if((of.troca||[]).length>3)return {ok:false,m:'No máximo 3 jogadores na troca.'};
 n.of=of;n.rod++;n.pend={dia:S.hoje+pmR(1,3),t:'clube'};
 n.msgs.push({q:'u',t:PM.neg.resumo(of)});return {ok:true}};
PM.neg.resumo=function(of){
 var p=[];if(of.emp){p.push('Empréstimo ('+({simples:'simples',opcao:'com opção de compra',obrig:'com obrigação de compra'}[of.emp.t])+') taxa '+fmtK(of.emp.taxa||0)+(of.emp.valorOpc?', compra por '+fmtK(of.emp.valorOpc):''))}
 else if(of.valor)p.push(fmtK(of.valor)+(of.parc>1?' em '+of.parc+' parcelas':''));
 if(of.troca&&of.troca.length)p.push('troca: '+of.troca.map(function(id){return PM.B.j[id][JI.NOME]}).join(', '));
 if(of.bonus&&of.bonus.length)p.push('bônus: '+of.bonus.map(function(b){return fmtK(b.valor)+' por '+b.alvo+' '+({jogos:'jogos',gols:'gols',titulo:'título'}[b.t])}).join('; '));
 if(of.rev)p.push(of.rev+'% de revenda');if(of.rec)p.push('opção de recompra '+fmtK(of.rec.valor)+' até '+of.rec.ate);
 return 'Proposta: '+p.join(' · ')};
PM.neg.resolver=function(n,ev){
  var of=n.of,cfg=PM.cfg,ask=n.ask,vo=PM.valorOferta(of,ask),jn=PM.janela();
 /* empréstimo é comparado com o preço de um empréstimo, não com o preço da compra (antes quase nunca era aceito) */
 if(of.emp){var ee=of.emp,ltn=S.W.lt&&S.W.lt[n.j];ask=Math.max(1,Math.round(n.ask*(.10+(ee.t==='obrig'?.85:ee.t==='opcao'?.12:0))*(ltn===2?.8:1)))}
 var ratio=vo/Math.max(1,ask),sc=PM.nota(vo,ask,n.rod,n.seed);
 n.pend=null;
 if(!PM.negValida(n)){return}
 if(sc>=cfg.aceita_alto){n.fase='jogador';n.pac=Math.min(100,n.pac+5);n.msgs.push({q:'c',t:pmPick(['Fechado. Temos acordo pelo clube. Agora falta convencer o jogador.','Aceitamos os termos. Podem seguir para a conversa com o atleta.'])});ev.push({k:'neg',t:PM.B.cl[n.de][CI.NOME]+' aceitou sua proposta por '+PM.B.j[n.j][JI.NOME]});return}
 if(sc>=cfg.aceita_baixo){var alvo=Math.round(ask*(1+(pmSeed(n.seed+n.rod)()*.06-.03)));n.pac-=8;n.ct=alvo;
  n.msgs.push({q:'c',t:pmPick(['Estamos perto, mas só fechamos em torno de ','Falta pouco. Precisamos de algo perto de ','Podemos conversar se chegar a '])+fmtK(alvo)+'.'});ev.push({k:'neg',t:PM.B.cl[n.de][CI.NOME]+' fez uma contraproposta'});}
 else{var of_=ratio<cfg.oferta_ofensiva_limiar;n.pac-=of_?cfg.paciencia_ofensa:15;n.ct=Math.round(ask);
  if(of_){S.repMer=pmC(S.repMer+cfg.rep_mercado_ofensa,0,100);n.msgs.push({q:'c',t:pmPick(['Isso é um desrespeito. Não vamos perder tempo com propostas assim.','Esse valor ofende o clube e o jogador.'])})}
  else n.msgs.push({q:'c',t:pmPick(['Muito abaixo do que esperamos.','Não é suficiente. Precisa melhorar bastante.'])});
  ev.push({k:'neg',t:PM.B.cl[n.de][CI.NOME]+' recusou sua proposta'})}
 if(n.pac<=0){n.est='congelada';n.ate=S.hoje+cfg.congelar_dias;n.msgs.push({q:'c',t:'Encerramos a conversa por ora. Voltem mais tarde.'});S.repMer=pmC(S.repMer+cfg.rep_mercado_abandono/2,0,100)}};
PM.negValida=function(n){
 var d=S.W.p[n.j];
 if(n.pre){if(d[DD.C]<0&&n.est!=='concluida'){n.est='encerrada';n.msgs.push({q:'c',t:'O jogador já deixou o clube.'});return false}return true}
 if(!n.livre&&d[DD.C]!==n.de){n.est='encerrada';n.msgs.push({q:'c',t:(d[DD.C]>=0?'O jogador foi negociado com '+PM.B.cl[d[DD.C]][CI.NOME]+'.':'O jogador deixou o clube.')});return false}
 if(n.livre&&d[DD.C]!==-1){n.est='encerrada';n.msgs.push({q:'c',t:'O jogador assinou com '+(d[DD.C]>=0?PM.B.cl[d[DD.C]][CI.NOME]:'outro clube')+'.'});return false}
 return true};
PM.neg.encerrar=function(n){
 if(n.fase!=='clube'&&n.fase!=='livre'&&n.est!=='concluida'){S.repMer=pmC(S.repMer+PM.cfg.rep_mercado_abandono,0,100)}
 n.est='encerrada';n.pend=null};
/* ---- fase do jogador ---- */
PM.neg.demanda=function(jid){
 var d=S.W.p[jid],sj=PM.salJusto(jid),b=PM.B.j[jid],ag=PM.B.ag[b[JI.AG]];
 var com=ag?ag[2]:PM.cfg.comissao_agente_padrao;
 return {sal:Math.round(sj*(d[DD.C]===-1?.9:1.1)),anos:d[DD.I]>=32?2:d[DD.I]<=22?5:3,luvas:Math.round(sj*(.2+(ag?ag[3]:50)/200)),com:com}};
PM.neg.propJogador=function(n,pr){
 if(n.fase!=='jogador'||n.est==='congelada'||n.pend)return {ok:false,m:'Não é possível propor agora.'};
 var me=S.wi,tot=pr.luvas+(n.of&&!n.livre?PM.neg.upfront(n.of):0);
 if(S.caixa<tot)return {ok:false,m:'Caixa insuficiente para luvas e pagamento inicial.'};
 if(!PM.ffpOk(pr.sal))return {ok:false,m:'Fair play financeiro: a folha passaria de '+Math.round(PM.cfg.ffp_folha_receita*100)+'% da receita.'};
 n.jog=pr;n.pend={dia:S.hoje+pmR(1,2),t:'jogador'};n.msgs.push({q:'u',t:'Contrato: '+fmtK(pr.sal)+'/ano por '+pr.anos+' anos, luvas '+fmtK(pr.luvas)+', papel: '+pr.papel});return {ok:true}};
PM.neg.avaliaJogador=function(n,pr){
 var jid=n.j,b=PM.B.j[jid],d=S.W.p[jid],me=S.wi,B=PM.B,dem=PM.neg.demanda(jid),pr_=S.W.c[me].pr;
 if(B.vet[jid+'|'+me]===0)return {s:0,m:'Jamais vestiria essa camisa.'};
 var piso=PM.piso(jid),comp=0,sj=PM.salJusto(jid);
 if(B.cl[me][CI.PAIS]==='Arábia Saudita'||B.cl[me][CI.GRUPO]==='PIF (Arábia)')comp=Math.min(20,Math.max(0,(pr.sal/sj-1)*40));else comp=Math.min(10,Math.max(0,(pr.sal/sj-1)*20));
 var s=55+(pr.sal/dem.sal-1)*110+((pr_-(piso-comp))*1.1)+(b[JI.FID]<50?6:0)+(d[DD.MO]-50)*.1;
 s+=({titular:0,rotacao:-4,reserva:-14}[pr.papel]||0)*-1*0; /* papel prometido */
 var rank=PM.by[me].filter(function(x){return S.W.p[x][DD.O]>d[DD.O]&&PM.pos6(x)===PM.pos6(jid)}).length;
 if(pr.papel==='titular'&&rank>=2)s-=10;if(pr.papel==='reserva')s+=6;
 if(B.vet[jid+'|'+me]===1)s-=25;
 if(d[DD.C]>=0&&B.cl[d[DD.C]][CI.RIV].split(';').indexOf(B.cl[me][CI.ID])>=0&&b[JI.FORM]==='Sim')s-=20;
 s+=(b[JI.AMB]-50)*.12*((pr_-S.W.c[d[DD.C]>=0?d[DD.C]:me].pr)/10);
 s-=Math.max(0,(pr.anos-dem.anos))*2;
 s+=(pmSeed(n.seed+77)()*2-1)*5;
 var m=s>=60?'Aceito. Quero jogar aqui.':s>=45?'Estou perto, mas quero mais salário ou um papel melhor.':'Não vejo um projeto que me interesse.';
 return {s:Math.round(s),m:m}};
PM.neg.resolverJogador=function(n,ev){
 n.pend=null;if(!PM.negValida(n))return;var r=PM.neg.avaliaJogador(n,n.jog);
 if(r.s>=60){n.msgs.push({q:'j',t:r.m});n.fase='medico';n.pend={dia:S.hoje+pmR(1,2),t:'medico'};ev.push({k:'neg',t:PM.B.j[n.j][JI.NOME]+' aceitou os termos. Exame médico marcado.'})}
 else{n.pac-=10;n.msgs.push({q:'j',t:r.m});ev.push({k:'neg',t:PM.B.j[n.j][JI.NOME]+' recusou o contrato'});if(n.pac<=0){n.est='congelada';n.ate=S.hoje+PM.cfg.congelar_dias}}};
PM.neg.medico=function(n,ev){
 n.pend=null;if(!PM.negValida(n))return;var b=PM.B.j[n.j],d=S.W.p[n.j];
 var p=.015+b[JI.LES]/1500+Math.max(0,d[DD.I]-30)*.004+(d[DD.L]>0?.4:0);
 if(Math.random()<p){n.est='encerrada';n.msgs.push({q:'c',t:'O exame médico reprovou o jogador. Negócio cancelado.'});ev.push({k:'neg',t:'Exame médico reprovou '+b[JI.NOME]});return}
 var jn=PM.janela();
 if(n.livre||jn.aberta)PM.neg.efetivar(n,ev);
 else{n.est='espera';n.msgs.push({q:'c',t:'Acordo fechado. O jogador se apresenta na abertura da próxima janela.'});ev.push({k:'neg',t:'Acordo com '+b[JI.NOME]+' fechado. Ele chega na próxima janela.'})}};
PM.neg.efetivar=function(n,ev){
 var jid=n.j,me=S.wi,of=n.of||{},pr=n.jog,d=S.W.p[jid],b=PM.B.j[jid],de=d[DD.C],h=PM.msHoje(),W=S.W,jn=PM.janela();
 if(!PM.negValida(n)&&n.est!=='espera')return;
 var up=n.livre?0:PM.neg.upfront(of);
 if(S.caixa<up+pr.luvas){n.est='encerrada';n.msgs.push({q:'c',t:'Faltou caixa na hora de pagar: negócio cancelado.'});return}
 var cx0=S.caixa;S.caixa-=up+pr.luvas;
 if(n.pre){S.pre=S.pre||{};S.pre[jid]={ci:me,sal:pr.sal,anos:pr.anos};d[DD.PC]=me;d[DD.ST]=2;n.est='concluida';n.msgs.push({q:'c',t:b[JI.NOME]+' assinou o pré-contrato e se apresenta quando o contrato dele terminar.'});ev.push({k:'chegou',t:'Pré-contrato assinado com '+b[JI.NOME]});PM.log(PM.meuNome()+' acerta pré-contrato com '+b[JI.NOME]);return}
 var tipo=of.emp?'emp':'compra';
 if(!n.livre){
  var total=PM.valorOferta(of,n.ask);
  W.c[de].cx+=up;
  if(!of.emp){
   (of.troca||[]).forEach(function(id){PM.moverJog(id,de);PM.marcar(id);S.W.p[id][DD.AD]=0});
   if(of.parc>1){var pa=Math.round(of.valor/of.parc);for(var i=1;i<of.parc;i++)S.parc.push({dia:h+i*365*864e5,v:-pa,t:'parcela '+(i+1)+'/'+of.parc+' por '+b[JI.NOME]})}
   (of.bonus||[]).forEach(function(bn){S.bon.push({jid:jid,t:bn.t,alvo:bn.alvo,valor:bn.valor,ate:PM.ano()+1,dir:-1,com:de})});
   if(of.rev||of.rec){var cl=W.cl[jid]=W.cl[jid]||{rev:[],rec:null};if(of.rev)cl.rev.push([de,of.rev]);if(of.rec)cl.rec=[de,of.rec.valor,of.rec.ate]}
   PM.pagaRevenda(jid,total,me);
  }else{
   W.emp.push({jid:jid,orig:de,dest:me,fim:PM.ano()+1,t:of.emp.t,taxa:of.emp.taxa,valor:of.emp.valorOpc||0,cond:of.emp.cond||0});d[DD.EMP]=de}
 }
 PM.moverJog(jid,me);PM.marcar(jid);d[DD.C]=me;
 if(of.emp){d[DD.EMP]=de}else{d[DD.S]=pr.sal;d[DD.F]=PM.ano()+pr.anos;d[DD.EMP]=-1}
 d[DD.ST]=0;d[DD.MO]=pmC(d[DD.MO]+8,5,100);
 if(pr.papel&&pr.papel!=='rotacao')S.prom[jid]={p:pr.papel,j:S.cnt.fe,f:0};
 S.repMer=pmC(S.repMer+PM.cfg.rep_mercado_fechar,0,100);S.cnt.fe++;
 if(!S.W.jan.comp)S.W.jan.comp=[];S.W.jan.comp.push({id:jid,v:up+pr.luvas,o:d[DD.O]});S.W.jan.gasto=(S.W.jan.gasto||0)+up+pr.luvas;
 /* reação da torcida */
 var f=PM.fama(jid);if(f>=85)S.torc=pmC(S.torc+3,0,100);
 if(de>=0&&PM.B.cl[de][CI.RIV].indexOf(PM.B.cl[me][CI.ID])>=0)S.torc=pmC(S.torc-4,0,100);
 n.est='concluida';n.msgs.push({q:'c',t:b[JI.NOME]+' é o novo reforço do seu clube!'});
 ev.push({k:'chegou',id:jid,t:b[JI.NOME]+' foi apresentado como reforço!',d:{ok:true,compra:true,jid:jid,de:de,valor:up+pr.luvas,antes:cx0,depois:S.caixa}});
 PM.log(PM.meuNome()+' contrata '+b[JI.NOME]+(de>=0?' ('+PM.B.cl[de][CI.NOME]+')':' (livre)'));
 PM.xiCache={};PM.sync()};
PM.pagaRevenda=function(jid,preco,pagador){
 var cl=S.W.cl[jid];if(!cl)return;
 cl.rev.forEach(function(r){var v=Math.round(preco*r[1]/100);if(r[0]===S.wi)PM.receber(v);else if(pagador===S.wi)S.caixa-=v;else S.W.c[r[0]].cx+=v})};
/* ---------- ticks diários das negociações ---------- */
PM.tickNeg=function(ev){
 S.neg.forEach(function(n){
  if(n.est==='congelada'&&S.hoje>=n.ate){n.est=n.livre?'jogador':'aberta';n.pac=40;n.msgs.push({q:'c',t:'Podemos voltar a conversar.'});if(!n.livre&&n.est==='aberta'&&n.fase!=='clube')n.est='aberta'}
  if(n.pend&&S.hoje>=n.pend.dia){
   var l0=ev.length;
   if(n.pend.t==='clube')PM.neg.resolver(n,ev);else if(n.pend.t==='jogador')PM.neg.resolverJogador(n,ev);else if(n.pend.t==='medico')PM.neg.medico(n,ev);
   for(var q=l0;q<ev.length;q++)if(ev[q].k==='neg')ev[q].nid=n.id}
  if(n.est==='aberta'||n.est==='jogador'||n.est==='medico'){if(!n.livre&&S.W.p[n.j][DD.C]!==n.de&&n.est!=='concluida')PM.negValida(n)}});
 S.neg=S.neg.filter(function(n){return n.est!=='concluida'||S.hoje-n.dia<60})};
PM.efetivarEspera=function(ev){S.neg.forEach(function(n){if(n.est==='espera')PM.neg.efetivar(n,ev)});S.ofe.forEach(function(o){if(o.est==='espera')PM.ofertas.efetivar(o,ev)})};

/* ---------- ofertas recebidas (a IA quer seus jogadores) ---------- */
PM.ofertas={};
/* ---------- listas do usuário ---------- */
PM.lista=function(){return S.lista||(S.lista={t:[],e:[]})};
PM.listaUser=function(id){var L=PM.lista();return L.t.indexOf(id)>=0?1:L.e.indexOf(id)>=0?2:0};
PM.deslistar=function(id){var L=PM.lista();L.t=L.t.filter(function(x){return x!==id});L.e=L.e.filter(function(x){return x!==id})};
PM.listar=function(id,tipo){
 var d=S.W.p[id];
 if(!d||d[DD.C]!==S.wi)return {ok:false,m:'O jogador não é do seu clube.'};
 if(d[DD.EMP]>=0)return {ok:false,m:'Jogador emprestado ao seu clube não pode ser listado.'};
 if(PM.recente(id))return {ok:false,m:'Jogador contratado nesta janela: não pode ser negociado agora.'};
 var L=PM.lista();PM.deslistar(id);(tipo==='e'?L.e:L.t).push(id);
 return {ok:true,m:PM.B.j[id][JI.NOME]+' entrou na lista de '+(tipo==='e'?'empréstimo':'transferências')+'. Deve atrair mais propostas.'}};

/* ---------- propostas recebidas ---------- */
PM.ofertas.normal=function(o){ /* converte propostas de saves antigos */
 if(o.of)return o;
 o.t='compra';o.of={valor:o.v,parc:1,troca:[],rev:0};o.max=Math.round(o.v*1.15);o.pac=100;o.rod=0;o.seed=o.id||1;o.msgs=[];o.pend=null;o.lst=0;return o};
PM.compradorPara=function(jid,loan){ /* clube que procura o jogador: precisa ter relevância, caixa, vaga e passar nas regras */
 var W=S.W,val=PM.valor(jid),n=PM.B.cl.length,piso=PM.piso(jid),k,ci;
 for(k=0;k<14;k++){ci=pmR(0,n-1);
  if(ci===S.wi||PM.by[ci].length>=29)continue;
  if(W.c[ci].pr<piso-6)continue;
  if(W.c[ci].cx<val*(loan?.15:.7))continue;
  if(!PM.elegivel(jid,ci).ok)continue;
  return ci}
 return -1};
PM.ofertas.gerar=function(buyer,jid,opt,ev){
 opt=opt||{};var W=S.W,d=W.p[jid],cfg=PM.cfg;
 if(!d||d[DD.C]!==S.wi||d[DD.EMP]>=0||PM.recente(jid))return false;
 var abertas=0,dup=false;
 S.ofe.forEach(function(x){if(x.est==='aberta'){abertas++;if(x.j===jid)dup=true}if(x.est==='fechando'&&x.j===jid)dup=true});
 if(dup||abertas>=(cfg.ofertas_max_abertas||40))return false;
 var lt=PM.listaUser(jid),loan=opt.t==='emp'||(lt===2&&Math.random()<.9),val=PM.valor(jid),cx=W.c[buyer].cx,bn=lt?1.1:1;
 var o={id:S.nid++,j:jid,de:buyer,t:loan?'emp':'compra',est:'aberta',dia:S.hoje,exp:S.hoje+10,pac:100,rod:0,seed:pmR(1,1e9),msgs:[],pend:null,cp:null,lst:lt,of:null,max:0,v:0};
 if(loan){
  var tp=pmPick(['simples','simples','opcao','obrig']),taxa=Math.round(val*(.05+Math.random()*.05)),opc=tp==='simples'?0:Math.round(val*(1+Math.random()*.2));
  if(cx<taxa)return false;
  o.of={emp:{t:tp,taxa:taxa,valorOpc:opc,cond:20}};o.v=taxa;
  o.max=Math.round(PM.valorOferta(o.of,val)*(1.2+Math.random()*.3)*bn);
 }else{
  var v=Math.round(val*(.8+Math.random()*.45)*bn);
  if(v>cx)return false;
  o.of={valor:v,parc:1,troca:[],rev:0};o.v=v;
  o.max=Math.min(Math.round(cx*.98),Math.max(Math.round(v*1.03),Math.round(val*(1.05+Math.random()*.3)*bn)));
  o.max=Math.max(o.max,v);
 }
 o.msgs.push({q:'c',t:'Temos interesse no jogador. '+PM.neg.resumo(o.of)});
 S.ofe.push(o);
 if(ev&&cfg.pausa_ofertas!==0)ev.push({k:'ofenova',id:o.id,t:PM.B.cl[buyer][CI.NOME]+(loan?' quer o empréstimo de ':' fez proposta por ')+PM.B.j[jid][JI.NOME]});
 return true};
/* chamada todo dia da janela: jogadores listados pelo usuário atraem propostas extras */
PM.mercadoUser=function(jn,ev){
 var L=PM.lista(),tot=Math.max(1,Math.round((jn.fe-jn.ab)/864e5)+1),dia=Math.round((PM.msHoje()-jn.ab)/864e5),pg=pmC(dia/tot,0,1);
 var p=Math.min(.6,(.12+.2*pg)*(PM.cfg.mult_lista||1));
 L.t.concat(L.e).forEach(function(id){
  if(Math.random()>p)return;
  var loan=L.e.indexOf(id)>=0,ci=PM.compradorPara(id,loan);
  if(ci>=0)PM.ofertas.gerar(ci,id,{t:loan?'emp':'compra'},ev)})};
/* interesse espontâneo: jogadores NÃO listados também recebem propostas */
PM.mercadoInteresse=function(jn,ev){
 var L=PM.lista(),tot=Math.max(1,Math.round((jn.fe-jn.ab)/864e5)+1),
  dia=Math.round((PM.msHoje()-jn.ab)/864e5),pg=pmC(dia/tot,0,1),peso=.5+1.5*pg*pg;
 PM.by[S.wi].slice().forEach(function(id){
  if(L.t.indexOf(id)>=0||L.e.indexOf(id)>=0)return;   /* listados já são tratados em mercadoUser */
  var d=S.W.p[id];
  if(d[DD.EMP]>=0||PM.recente(id))return;
  var f=PM.fama(id),m=PM.mesesRest(id);
  var p=.012*peso*pmC((f-35)/40,.15,2.2)
   *(m<=12?1.5:1)                                         /* contrato acabando atrai mais */
   *(d[DD.I]<=23&&d[DD.P]-d[DD.O]>=8?1.4:1)               /* promessa atrai mais */
   *(PM.cfg.mult_interesse||1);
  if(Math.random()>p)return;
  var ci=PM.compradorPara(id,false);
  if(ci>=0)PM.ofertas.gerar(ci,id,{t:Math.random()<.12?'emp':'compra'},ev)})};
PM.ofertas.responder=function(o,acao){
 var ev=[];PM.ofertas.normal(o);
 if(o.est!=='aberta')return ev;
 if(acao==='recusar'){o.est='recusada';o.pend=null;return ev}
 if(acao==='aceitar')return PM.ofertas.fechar(o,ev);
 return ev};
PM.ofertas.valida=function(o){
 var d=S.W.p[o.j];
 if(d[DD.C]!==S.wi||d[DD.EMP]>=0){o.est='encerrada';o.pend=null;o.msgs.push({q:'c',t:'O jogador não está mais disponível.'});return false}
 return true};
PM.ofertas.fechar=function(o,ev){
 if(!PM.ofertas.valida(o))return ev;
 o.est='fechando';o.pend={dia:S.hoje+pmR(2,5),t:'venda'};
 o.msgs.push({q:'c',t:'Combinado! Estamos finalizando a papelada e o exame médico do jogador.'});
 S.ofe.forEach(function(x){if(x!==o&&x.j===o.j&&x.est==='aberta'){x.est='encerrada';x.pend=null}});
 ev.push({k:'ofe',t:'Proposta aceita. A confirmação chega em alguns dias: avance o calendário.'});
 return ev};
PM.ofertas.concluirVenda=function(o,ev){
 PM.ofertas.normal(o);o.pend=null;
 var W=S.W,jid=o.j,d=W.p[jid],b=PM.B.j[jid],nm=PM.B.cl[o.de][CI.NOME],cx0=S.caixa,motivo='',
  vl=o.of.emp?(o.of.emp.taxa||0):(o.of.valor||0),
  rj=.04+(b[JI.FID]-50)/700+(PM.B.vet[jid+'|'+o.de]===1?.25:0),
  pmed=.01+b[JI.LES]/2000+Math.max(0,d[DD.I]-30)*.004+(d[DD.L]>0?.3:0);
 if(d[DD.C]!==S.wi||d[DD.EMP]>=0)motivo='O jogador não está mais disponível.';
 else if(W.c[o.de].cx<PM.neg.upfront(o.of))motivo=nm+' não conseguiu levantar o dinheiro do pagamento inicial.';
 else if(!PM.elegivel(jid,o.de).ok)motivo='O jogador não aceitou se mudar para o '+nm+'.';
 else if(Math.random()<Math.max(0,rj))motivo=b[JI.NOME]+' recusou as condições pessoais oferecidas pelo '+nm+'.';
 else if(Math.random()<pmed)motivo='O exame médico reprovou o jogador e o '+nm+' desistiu do negócio.';
 if(motivo){
  o.est='falhou';o.msgs.push({q:'c',t:motivo});
  ev.push({k:'vendaFim',t:'Negociação por '+b[JI.NOME]+' fracassou',d:{ok:false,jid:jid,para:o.de,motivo:motivo,valor:vl,antes:cx0,depois:cx0}});return}
 if(!PM.janela().aberta){o.est='espera';ev.push({k:'ofe',t:'Acordo por '+b[JI.NOME]+' fechado. Ele se transfere na próxima janela.'});return}
 PM.ofertas.efetivar(o,ev)};
PM.ofertas.contra=function(o,of){
 PM.ofertas.normal(o);
 if(o.est!=='aberta'||o.pend)return {ok:false,m:'Não é possível enviar uma contraproposta agora.'};
 if(o.t==='emp'){if(!of.emp)return {ok:false,m:'Informe os termos do empréstimo.'}}
 else{
  if(!(of.valor>0)&&!(of.troca&&of.troca.length))return {ok:false,m:'Informe um valor.'};
  if((of.troca||[]).length>2)return {ok:false,m:'No máximo 2 jogadores na troca.'}}
 for(var i=0;i<(of.troca||[]).length;i++)if(PM.by[o.de].indexOf(of.troca[i])<0)return {ok:false,m:'Jogador de troca inválido.'};
 o.cp=of;o.rod++;o.pend={dia:S.hoje+pmR(1,2)};o.exp=Math.max(o.exp,S.hoje+8);
 o.msgs.push({q:'u',t:PM.neg.resumo(of).replace('Proposta:','Sua contraproposta:')});
 return {ok:true}};
PM.ofertas.resolver=function(o,ev){
 var W=S.W,cfg=PM.cfg,cp=o.cp,val=PM.valor(o.j),nm=PM.B.cl[o.de][CI.NOME],jn=PM.B.j[o.j][JI.NOME];
 o.pend=null;
 if(!cp||!PM.ofertas.valida(o))return;
 if(W.c[o.de].cx<PM.neg.upfront(cp)){
  o.pac-=10;o.msgs.push({q:'c',t:'Não temos caixa para esse pagamento à vista. Reduza o valor inicial.'});
 }else{
  var vo=PM.valorOferta(cp,val),r=vo/Math.max(1,o.max),hu=(pmSeed(o.seed+o.rod*13)()*2-1)*.03;
  if(r<=1+hu){
   o.of=cp;o.cp=null;o.msgs.push({q:'c',t:pmPick(['Fechado! Aceitamos os seus termos.','Temos acordo. Vamos fechar.'])});
   ev.push({k:'ofe',t:nm+' aceitou sua contraproposta por '+jn});
   PM.ofertas.fechar(o,ev);return}
  if(r<=1.15){
   var alvo=Math.round(o.max*.97),nova;
   if(o.t==='emp'){var e=cp.emp,extra=(e.t==='obrig'?.85:e.t==='opcao'?.12:0)*(e.valorOpc||0);nova={emp:{t:e.t,taxa:Math.max(0,Math.round(alvo-extra)),valorOpc:e.valorOpc||0,cond:e.cond||20}}}
   else nova={valor:alvo,parc:1,troca:[],rev:0};
   o.of=nova;o.v=o.t==='emp'?nova.emp.taxa:nova.valor;o.pac-=8;
   o.msgs.push({q:'c',t:'Chegamos perto. Podemos fechar nestes termos: '+PM.neg.resumo(nova).replace('Proposta: ','')+'.'});
   ev.push({k:'ofe',t:nm+' fez uma nova proposta por '+jn});
  }else{
   var ofensiva=r>1.5;o.pac-=ofensiva?cfg.paciencia_ofensa:15;
   o.msgs.push({q:'c',t:ofensiva?'Esse pedido está fora da realidade.':'Está acima do que podemos pagar.'});
   ev.push({k:'ofe',t:nm+' recusou sua contraproposta por '+jn});
  }
 }
 if(o.pac<=0){o.est='recusada';o.msgs.push({q:'c',t:'Encerramos a conversa. Desistimos do jogador.'})}};
PM.ofertas.efetivar=function(o,ev){
 PM.ofertas.normal(o);
 var W=S.W,jid=o.j,d=W.p[jid],b=PM.B.j[jid],of=o.of,h=PM.msHoje(),nm=PM.B.cl[o.de][CI.NOME],jnm=b[JI.NOME],rec;
 if(d[DD.C]!==S.wi||d[DD.EMP]>=0){o.est='encerrada';return}
 var up=PM.neg.upfront(of),cx0=S.caixa;
 if(W.c[o.de].cx<up){o.est='encerrada';ev.push({k:'ofe',t:nm+' desistiu: faltou caixa para pagar por '+jnm});return}
 var val=PM.valor(jid),total=PM.valorOferta(of,val);
 PM.receber(up);W.c[o.de].cx-=up;
 if(of.emp){
  W.emp.push({jid:jid,orig:S.wi,dest:o.de,fim:PM.ano()+1,t:of.emp.t,taxa:of.emp.taxa||0,valor:of.emp.valorOpc||0,cond:of.emp.cond||0});
  PM.moverJog(jid,o.de);d[DD.EMP]=S.wi;rec=up;
 }else{
  PM.pagaRevenda(jid,of.valor||total,o.de);
  if(of.parc>1){var pa=Math.round(of.valor/of.parc);for(var i=1;i<of.parc;i++)S.parc.push({dia:h+i*365*864e5,v:pa,t:'parcela '+(i+1)+'/'+of.parc+' pela venda de '+jnm})}
  (of.bonus||[]).forEach(function(bn){S.bon.push({jid:jid,t:bn.t,alvo:bn.alvo,valor:bn.valor,ate:PM.ano()+1,dir:1,com:o.de})});
  (of.troca||[]).forEach(function(id){if(W.p[id][DD.C]===o.de){PM.moverJog(id,S.wi);PM.marcar(id)}});
  if(b[JI.FORM]==='Sim'&&b[JI.FID]>=85){S.torc=pmC(S.torc-5,0,100);PM.by[S.wi].forEach(function(x){W.p[x][DD.MO]=pmC(W.p[x][DD.MO]-3,5,100)})}
  PM.moverJog(jid,o.de);d[DD.S]=PM.salJusto(jid);d[DD.F]=PM.ano()+pmR(2,4);
  if(of.rev){var cl=W.cl[jid]=W.cl[jid]||{rev:[],rec:null};cl.rev.push([S.wi,of.rev])}
  rec=of.valor||total;
 }
 PM.marcar(jid);
 W.jan.receita=(W.jan.receita||0)+rec;(W.jan.vend=W.jan.vend||[]).push({id:jid,v:rec});
 o.est='concluida';o.pend=null;
 S.ofe.forEach(function(x){if(x!==o&&x.j===jid&&x.est==='aberta')x.est='encerrada'});
 ev.push({k:'vendeu',t:jnm+(of.emp?' emprestado ao ':' vendido para ')+nm+' por '+fmtK(rec),
  d:{ok:true,jid:jid,para:o.de,valor:rec,emp:!!of.emp,antes:cx0,depois:S.caixa,parc:(of.parc>1?of.parc:0),troca:(of.troca||[]).length}});
 PM.log(PM.meuNome()+(of.emp?' empresta ':' vende ')+jnm+' ao '+nm);
 PM.xiCache={};PM.sync()};
PM.alvosClube=function(ci,qtd){
 var W=S.W,need={GOL:3,ZAG:4,LAT:4,VOL:3,MEI:4,ATA:6},cnt=PM.contagemPos(ci),cx=W.c[ci].cx,pos=Object.keys(need),media={},por={},res=[],seen={},i;
 pos.forEach(function(p){
  var a=PM.by[ci].filter(function(id){return PM.pos6(id)===p}).map(function(id){return S.W.p[id][DD.O]});
  media[p]=a.length?a.reduce(function(x,y){return x+y},0)/a.length:55;por[p]=[]});
 /* a lista de candidatos é montada uma vez por clube (filtros baratos primeiro) */
 PM.B.cl.forEach(function(c,cj){if(cj===ci)return;PM.by[cj].forEach(function(id){
  var d=S.W.p[id],p=PM.pos6(id),o=d[DD.O];
  if(o<=media[p]+1||o>=media[p]+9||d[DD.EMP]>=0)return;
  var v=PM.valor(id);if(v>cx*.9||v<cx*.02)return;
  if(!PM.elegivel(id,ci).ok)return;
  por[p].push(id);if(W.lt&&W.lt[id])por[p].push(id)})});
 var pesos=pos.map(function(p){return 1+Math.max(0,need[p]-cnt[p])*2}),tot=pesos.reduce(function(a,b){return a+b},0);
 for(i=0;i<qtd*3&&res.length<qtd;i++){
  var r=Math.random()*tot,k=0;for(;k<pos.length-1;k++){r-=pesos[k];if(r<=0)break}
  var l=por[pos[k]];if(!l.length)continue;
  var t=l[Math.floor(Math.random()*l.length)];if(seen[t])continue;seen[t]=1;res.push(t)}
 return res};
/* ---------- listas de transferência/empréstimo dos clubes da IA (W.lt[id]: 1=venda, 2=empréstimo) ---------- */
PM.listarIA=function(){
 var W=S.W;W.lt={};
 PM.B.cl.forEach(function(c,ci){
  if(ci===S.wi)return;var ids=PM.by[ci];if(ids.length<=22)return;
  var ord=ids.slice().sort(function(a,b){return W.p[b][DD.O]-W.p[a][DD.O]});
  var cand=ord.filter(function(id,k){var d=W.p[id];
   if(d[DD.EMP]>=0||d[DD.L]>45||PM.intocavel(id,ci))return false;
   return k>=16||(d[DD.I]>=32&&PM.mesesRest(id)<=12)});
  var n=Math.min(pmR(2,5),cand.length),i;
  for(i=0;i<n;i++){
   var k=pmR(0,cand.length-1),id=cand.splice(k,1)[0],d=W.p[id];
   var emp=(d[DD.I]<=24&&Math.random()<.7)||Math.random()<.12;
   W.lt[id]=emp?2:1}})};
PM.emprestarIA=function(jid,de,para,ev){
 var W=S.W,d=W.p[jid],val=PM.valor(jid),taxa=Math.round(val*(.05+Math.random()*.05)),tp=Math.random()<.3?'opcao':'simples',
  opc=tp==='opcao'?Math.round(val*(1+Math.random()*.25)):0;
 if(W.c[para].cx<taxa)return false;
 W.c[para].cx-=taxa;W.c[de].cx+=taxa;
 W.emp.push({jid:jid,orig:de,dest:para,fim:PM.ano()+1,t:tp,taxa:taxa,valor:opc,cond:0});
 PM.moverJog(jid,para);d[DD.EMP]=de;PM.marcar(jid);return true};
/* jogadores listados se mexem mais, mas as regras (prestígio, vetos, caixa, elenco) continuam valendo */
PM.mercadoLista=function(jn,ev){
 var W=S.W;if(!W.lt)return;
 var tot=Math.max(1,Math.round((jn.fe-jn.ab)/864e5)+1),dia=Math.round((PM.msHoje()-jn.ab)/864e5),pg=pmC(dia/tot,0,1),p=.04*(.4+1.2*pg);
 Object.keys(W.lt).forEach(function(k){
  var jid=+k,tp=W.lt[k],d=W.p[jid];if(!d||Math.random()>p)return;
  var de=d[DD.C];if(de<0||de===S.wi||PM.recente(jid)||d[DD.EMP]>=0||PM.by[de].length<=20)return;
  var piso=PM.piso(jid),n=PM.B.cl.length,t,ci;
  for(t=0;t<10;t++){ci=pmR(0,n-1);
   if(ci===de||ci===S.wi||PM.by[ci].length>=29)continue;
   if(W.c[ci].pr<piso-4)continue;
   if(!PM.elegivel(jid,ci).ok)continue;
   if(tp===2){if(PM.emprestarIA(jid,de,ci,ev))break;continue}
   var ask=PM.precoPedido(jid,de,ci,{seed:0}),vo=ask*(.9+Math.random()*.2);
   if(W.c[ci].cx<vo||PM.nota(vo,ask,0,jid)<PM.cfg.aceita_baixo)continue;
   PM.transferirIA(jid,de,ci,Math.round(vo),ev);break}})};
PM.abrirJanela=function(jn,ev){
 var W=S.W,qtd=Math.max(4,Math.round(4*(PM.cfg.mult_mercado||1)));
 W.jan={aberta:true,ab:jn.ab,fe:jn.fe,tipo:jn.tipo,ult:false,gasto:0,receita:0,comp:[],vend:[],dias:0};
 if(jn.tipo==='Verão'){var r=Math.random();W.clima=r<.25?'aquecido':r<.5?'frio':'normal'}
 PM.listarIA();
 W.ag=[];PM.B.cl.forEach(function(c,ci){if(ci===S.wi)W.ag[ci]=[];else W.ag[ci]=PM.alvosClube(ci,qtd)});
 W.jan.alvoDia=0;PM.efetivarEspera(ev);
 ev.push({k:'abre',t:'A janela de '+jn.tipo.toLowerCase()+' está aberta! Você pode contratar até '+PM.dataStr(jn.fe)+'.'});
 PM.log('Abre a janela de transferências de '+jn.tipo.toLowerCase())};
PM.mercadoIA=function(jn,ev){
 var W=S.W,cfg=PM.cfg,mult=cfg.mult_mercado||1,
  tot=Math.max(1,Math.round((jn.fe-jn.ab)/864e5)+1),dia=Math.round((PM.msHoje()-jn.ab)/864e5),pg=pmC(dia/tot,0,1);
 var peso=.4+2.6*Math.pow(pg,3),n=Math.round(PM.B.cl.length*.045*peso*mult*(W.clima==='aquecido'?1.2:W.clima==='frio'?.8:1)),k;
 for(k=0;k<n;k++){
  var ci=pmR(0,PM.B.cl.length-1);if(ci===S.wi)continue;var al=W.ag[ci];if(!al||!al.length)continue;
  var jid=al.shift(),d=S.W.p[jid],de=d[DD.C];if(de<0||de===ci)continue;
  if(PM.recente(jid)||d[DD.EMP]>=0)continue; /* quem acabou de se transferir ou está emprestado não se mexe */
  if(de===S.wi){if(PM.valor(jid)<=W.c[ci].cx)PM.ofertas.gerar(ci,jid,null,ev);continue}
  var ask=PM.precoPedido(jid,de,ci,{seed:0}),vo=ask*(.85+Math.random()*.3);
  if(PM.intocavel(jid,de))continue;
  if(W.c[ci].cx<vo||PM.by[de].length<=20||PM.by[ci].length>=29)continue;
  if(PM.nota(vo,ask,0,jid)<PM.cfg.aceita_baixo+10)continue;
  PM.transferirIA(jid,de,ci,Math.round(vo),ev)}
 PM.mercadoLista(jn,ev);PM.mercadoUser(jn,ev);PM.mercadoInteresse(jn,ev)};
PM.transferirIA=function(jid,de,para,preco,ev){
 var d=S.W.p[jid],W=S.W;W.c[para].cx-=preco;W.c[de].cx+=preco;PM.pagaRevenda(jid,preco,para);
 PM.moverJog(jid,para);PM.marcar(jid);d[DD.S]=PM.salJusto(jid);d[DD.F]=PM.ano()+pmR(2,4);d[DD.EMP]=-1;d[DD.ST]=0;
 if(preco>=PM.cfg.aceita_alto*1000){ev.push({k:'news',t:PM.B.cl[para][CI.NOME]+' contrata '+PM.B.j[jid][JI.NOME]+' ('+PM.B.cl[de][CI.NOME]+') por '+fmtK(preco)});PM.log(PM.B.cl[para][CI.NOME]+' contrata '+PM.B.j[jid][JI.NOME]+' por '+fmtK(preco))}
 S.neg.forEach(function(n){if(n.j===jid)PM.negValida(n)})};
PM.fecharJanela=function(ev){
 var W=S.W,j=W.jan;W.jan.aberta=false;W.lt={};W.ag=[];
 S.neg.forEach(function(n){if(['aberta','jogador','medico','congelada'].indexOf(n.est)>=0&&n.est!=='espera'&&!n.livre){n.est='encerrada';n.msgs.push({q:'c',t:'A janela fechou. Negociação encerrada.'})}});
 var ab=S.cnt.ab,fe=S.cnt.fe,cfg=PM.cfg;
 if(ab>=8&&fe===0)S.repMer=pmC(S.repMer-5,0,100);else if(ab>fe*3+6)S.repMer=pmC(S.repMer-2,0,100);
 S.cnt={ab:0,fe:0};
 /* IA equilibra elencos: >27 manda os piores para clubes com <22 (sem custo); <22 assina agentes livres ou promessas */
 var i;for(i=0;i<PM.B.cl.length;i++){if(PM.by[i].length>27){var ex=PM.by[i].slice().sort(function(a,b){return W.p[a][DD.O]-W.p[b][DD.O]}).slice(0,PM.by[i].length-27);ex.forEach(function(id){var t=PM.B.cl.map(function(c,x){return x}).filter(function(x){return PM.by[x].length<24&&x!==S.wi}).sort(function(a,b){return Math.abs(W.c[a].pr-W.c[i].pr)-Math.abs(W.c[b].pr-W.c[i].pr)})[0];if(t!==undefined&&i!==S.wi)PM.moverJog(id,t);else if(i!==S.wi)W.p[id][DD.C]=-1,PM.by[i].splice(PM.by[i].indexOf(id),1),W.livres.push(id)})}}
 PM.completarElencos();
 /* balanço da janela */
 var ent=(j.comp||[]),sai=(j.vend||[]),idade=PM.by[S.wi].reduce(function(a,id){return a+W.p[id][DD.I]},0)/Math.max(1,PM.by[S.wi].length);
 var sc=ent.reduce(function(a,x){return a+x.o},0)/Math.max(1,ent.length),liq=(j.receita||0)-(j.gasto||0);
 var nota=ent.length||sai.length?(sc>=78?'A':sc>=72?'B':sc>=66?'C':'D'):'—';
 S.bal={tipo:j.tipo,gasto:j.gasto||0,receita:j.receita||0,liq:liq,comp:ent.map(function(x){return x.id}),vend:sai.map(function(x){return x.id}),idade:Math.round(idade*10)/10,nota:nota};
 ev.push({k:'fecha',t:'A janela de '+j.tipo.toLowerCase()+' fechou.'})};
PM.completarElencos=function(){
 var W=S.W,B=PM.B;
 B.cl.forEach(function(c,ci){if(ci===S.wi)return;
  var n=PM.by[ci].length;while(n<25){
   var need=PM.contagemPos(ci),want={GOL:3,ZAG:4,LAT:4,VOL:3,MEI:4,ATA:6},p=Object.keys(want).sort(function(a,b){return (want[b]-need[b])-(want[a]-need[a])})[0];
   var l=W.livres.filter(function(id){return PM.pos6(id)===p&&W.p[id][DD.C]===-1&&W.p[id][DD.O]<=W.c[ci].pr+5}).sort(function(a,b){return W.p[b][DD.O]-W.p[a][DD.O]});
   if(l.length){var id=l[0];W.livres.splice(W.livres.indexOf(id),1);PM.moverJog(id,ci);W.p[id][DD.S]=Math.round(PM.salJusto(id)*.9);W.p[id][DD.F]=PM.ano()+pmR(1,3)}
   else PM.regen(ci,p);
   n=PM.by[ci].length}})};

/* ---------- agentes livres ---------- */
PM.livresLista=function(){return S.W.livres.filter(function(id){return S.W.p[id][DD.C]===-1})};
PM.livresDia=function(ev){
 var W=S.W,jn=PM.janela(),pr=jn.aberta?.12:.02;
 PM.livresLista().forEach(function(id){
  var d=W.p[id];d[DD.S]=Math.max(40,Math.round(d[DD.S]*.998));
  if(Math.random()>pr*(d[DD.O]>=75?3:d[DD.O]>=65?1.5:.5))return;
  var cand=PM.B.cl.map(function(c,x){return x}).filter(function(x){return x!==S.wi&&PM.by[x].length<27&&PM.elegivel(id,x).ok&&W.c[x].pr>=PM.piso(id)-4&&W.c[x].pr<=PM.piso(id)+26});
  if(!cand.length)return;var ci=pmPick(cand);W.livres.splice(W.livres.indexOf(id),1);PM.moverJog(id,ci);PM.marcar(id);d[DD.F]=PM.ano()+pmR(1,3);d[DD.S]=Math.round(PM.salJusto(id)*.95);
  if(PM.fama(id)>=75)ev.push({k:'news',t:PM.B.cl[ci][CI.NOME]+' contrata o agente livre '+PM.B.j[id][JI.NOME]});});
};

/* ---------- renovações e pré-contrato ---------- */
PM.renov={};
PM.renov.pedido=function(id){var dem=PM.neg.demanda(id),d=S.W.p[id];return {sal:Math.max(Math.round(dem.sal*.98),Math.round(d[DD.S]*.95)),anos:dem.anos,luvas:Math.round(dem.luvas*.5)}};
PM.renov.tentar=function(id,pr){
 var d=S.W.p[id],b=PM.B.j[id],dem=PM.renov.pedido(id);if(d[DD.ST]===1&&d[DD.AD]<30)return {ok:false,m:'O jogador não quer conversar sobre renovação agora.'};
 if(S.caixa<pr.luvas)return {ok:false,m:'Caixa insuficiente para as luvas.'};
 if(!PM.ffpOk(pr.sal-d[DD.S]))return {ok:false,m:'Fair play financeiro: folha acima do limite.'};
 var s=55+(pr.sal/dem.sal-1)*110+b[JI.FID]*.25-12.5+(d[DD.MO]-50)*.3+(b[JI.FORM]==='Sim'?6:0);
 var tr=S.W.c[S.wi].pr-PM.piso(id);s+=Math.min(8,tr*.3)+(b[JI.AMB]>75&&tr<0?tr:0);
 s+=(pmSeed(id+S.nid)()*2-1)*6;s-=Math.max(0,pr.anos-dem.anos)*2;
 if(s>=60){S.caixa-=pr.luvas;d[DD.S]=pr.sal;d[DD.F]=PM.ano()+Math.max(1,pr.anos)+(PM.msHoje()>Date.UTC(PM.ano()+1,5,30)?0:0);d[DD.ST]=0;d[DD.MO]=pmC(d[DD.MO]+6,5,100);PM.sync();return {ok:true,m:b[JI.NOME]+' renovou até '+d[DD.F]+'.'}}
 d[DD.ST]=1;d[DD.AD]=0;return {ok:false,m:s>=45?'Quase lá: o jogador quer mais salário.':'O jogador recusou. Ele pode esperar o contrato acabar e sair de graça.'}};
PM.preContrato=function(id,ci,sal){var d=S.W.p[id];d[DD.PC]=ci;d[DD.ST]=2;d[DD.S]=sal};
PM.preAbertos=function(){ /* jogadores de outros clubes que o usuário pode assinar de graça (<=6 meses) */
 var out=[];S.W.p.forEach(function(d,id){if(!d||d[DD.C]<0||d[DD.C]===S.wi||d[DD.PC]>=0&&d[DD.PC]!==undefined&&d[DD.ST]===2)return;if(PM.mesesRest(id)<=6&&d[DD.EMP]<0)out.push(id)});return out};
PM.preAssinar=function(id){
 var me=S.wi,d=S.W.p[id],b=PM.B.j[id],el=PM.elegivel(id,me);if(!el.ok)return {ok:false,m:el.m};
 var pr=PM.neg.demanda(id);if(!PM.ffpOk(pr.sal))return {ok:false,m:'Fair play financeiro: folha acima do limite.'};
 var n={id:S.nid++,j:id,de:d[DD.C],est:'jogador',fase:'jogador',pac:100,rod:0,seed:pmR(1,1e9),ask:0,fj:1,msgs:[{q:'c',t:'Pré-contrato: o jogador pode assinar de graça e se apresenta quando o contrato dele acabar.'}],pend:null,of:null,ct:null,jog:null,dia:S.hoje,livre:true,pre:true};
 S.neg.push(n);return {ok:true,n:n}};

/* ---------- geração de jovens (reposição do mundo) ---------- */
PM.NOMES={ENG1:[['Jack','Oliver','Harry','Leo','Noah','Tom'],['Smith','Walker','Evans','Clarke','Hughes','Moore']],ESP1:[['Pablo','Hugo','Iker','Marc','Álvaro','Adrián'],['García','Ruiz','Ortega','Molina','Navarro','Vidal']],ITA1:[['Luca','Matteo','Andrea','Marco','Lorenzo','Davide'],['Rossi','Ferrari','Greco','Conti','Bruno','Gallo']],GER1:[['Lukas','Jonas','Felix','Leon','Finn','Max'],['Müller','Schneider','Fischer','Weber','Hoffmann','Keller']],FRA1:[['Lucas','Hugo','Théo','Nathan','Enzo','Tom'],['Martin','Bernard','Dubois','Moreau','Girard','Roux']],BRA1:[['Gabriel','Matheus','João','Pedro','Davi','Enzo'],['Silva','Santos','Oliveira','Souza','Lima','Pereira']],POR1:[['João','Tiago','Rúben','Diogo','Rafael','André'],['Ferreira','Pereira','Costa','Rodrigues','Martins','Sousa']],NED1:[['Daan','Sem','Lars','Thijs','Bram','Jesse'],['de Jong','Bakker','Visser','Smit','Mulder','Bos']],USA1:[['Ethan','Mason','Logan','Tyler','Caleb','Ryan'],['Johnson','Miller','Davis','Wilson','Taylor','Brown']],KSA1:[['Abdullah','Faisal','Salem','Nawaf','Turki','Saud'],['Al-Qahtani','Al-Harbi','Al-Otaibi','Al-Ghamdi','Al-Zahrani','Al-Shehri']]};
PM.MED={ATA:[64,68,56,63,33,66],GOL:[25,18,40,22,64,53],LD:[66,40,58,59,63,65],LE:[67,40,59,59,63,65],MC:[60,57,69,64,57,67],MEI:[64,64,71,70,40,54],PD:[73,64,62,72,36,59],PE:[72,64,62,72,36,58],VOL:[55,46,63,58,67,69],ZAG:[55,30,55,47,71,69]};
PM.papelDe=function(p,a){var N=a[0],O=a[1],P=a[2],Q=a[3],R=a[4],Sx=a[5];
 if(p==='GOL')return 'Goleiro';if(p==='ZAG')return P>=58?'Zagueiro construtor':'Zagueiro de marcação';
 if(p==='LE'||p==='LD')return Q>=R?'Lateral ofensivo':R>=Q+8?'Lateral defensivo':'Lateral equilibrado';
 if(p==='VOL')return P>=R?'Volante construtor':R>=P+6?'Volante destruidor':'Volante equilibrado';
 if(p==='MC')return P-R>=14?'Meia armador':P-R<=6?'Meia box-to-box':'Meia equilibrado';
 if(p==='MEI')return O>=P-4?'Meia atacante':'Armador';
 if(p==='PE'||p==='PD')return O>=Q-4?'Ponta finalizador':'Ponta driblador';
 return Sx>=Q+4?'Centroavante de referência':N>=Sx?'Atacante móvel':'Atacante finalizador'};
PM.regen=function(ci,pos6){
 var W=S.W,c=PM.B.cl[ci],lid=c[CI.LIGA],nm=PM.NOMES[lid]||PM.NOMES.ENG1,id=W.nid++,
  p10=({GOL:['GOL'],ZAG:['ZAG'],LAT:['LE','LD'],VOL:['VOL'],MEI:['MC','MEI'],ATA:['PE','PD','ATA']}[pos6||pmPick(['ZAG','LAT','VOL','MEI','ATA'])]),pos=pmPick(p10),
  o=pmC(Math.round(44+W.c[ci].pr*.2+pmG()*4),38,70),pot=pmC(o+pmR(3,22),o,92),med=PM.MED[pos];
 var att=med.map(function(m){return pmC(Math.round(m+(o-65)+pmG()*3),18,97)}),pj={GOL:'GOL',ZAG:'ZAG',LE:'LAT',LD:'LAT',VOL:'VOL',MC:'MEI',MEI:'MEI',PE:'ATA',PD:'ATA',ATA:'ATA'}[pos];
 var idade=pmR(16,19),fama=pmC(Math.round((o-40)*1.25+(pot-o)*.3+W.c[ci].pr*.28),1,99);
 var sal=Math.max(60,Math.round(Math.exp(-8.0368+.1427*o)*254*1.0)),
  b=[id,ci,pmPick(nm[0])+' '+pmPick(nm[1]),c[CI.PAIS],idade,pos,'',pmPick(['Direito','Direito','Esquerdo']),pmR(2,4),pmR(168,194),o,pot,att[0],att[1],att[2],att[3],att[4],att[5],sal/254*1000/1000,sal/1000,PM.ano()+pmR(2,4),sal/1000*8,pmR(40,90),pmR(40,90),pmR(40,90),pmR(40,90),pmR(25,60),pmR(15,50),pmR(40,90),'Promessa',0,'Sim','Não',pj,PM.papelDe(pos,att),fama,0,'','','',  'AG'+('0'+pmR(1,30)).slice(-2)];
 W.nb.push(b);PM.B.j[id]=b;
 W.p[id]=[ci,o,pot,idade,sal,PM.ano()+pmR(2,4),0,100,62,0,0,0,0,0,0,65,0,0,0,-1,-1,0,0,0,0,[]];
 W.p[id][DD.V]=PM.valor(id);PM.by[ci].push(id);return id};

/* ---------- rotina diária (chamada a cada dia do calendário) ---------- */
PM.sync=function(){ /* recria S.elenco como visão viva do elenco do usuário */
 S.elenco=PM.elencoView(S.wi);
 if(S.esq&&S.esq.slots){S.esq.slots=S.esq.slots.filter(function(s){return PM.by[S.wi].indexOf(s.id)>=0});}
};
PM.transicoes=function(ev){
 var jn=PM.janela(),W=S.W,was=W.jan&&W.jan.aberta;
 if(jn.aberta&&!was)PM.abrirJanela(jn,ev);
 else if(jn.aberta&&jn.ultimo&&!W.jan.ult){W.jan.ult=true;ev.push({k:'ultimo',t:'Hoje é o último dia da janela de transferências!'})}
 else if(!jn.aberta&&was)PM.fecharJanela(ev)};
PM.dia=function(){
 var ev=[],W=S.W,i,user=S.wi,cap=PM.moralCap();
 W.p.forEach(function(d,id){if(!d||d[DD.C]<-1)return;
  d[DD.FI]=Math.min(100,d[DD.FI]+(d[DD.L]>0?1.5:3.5));if(d[DD.L]>0)d[DD.L]--;d[DD.AD]++;
  d[DD.MO]=d[DD.MO]+(62-d[DD.MO])*.012;if(d[DD.C]===user&&d[DD.MO]>cap)d[DD.MO]=cap});
 PM.transicoes(ev);
 var dt=new Date(PM.msHoje());if(dt.getUTCDate()===1&&S.hoje>PM.inicioTemporada()+1){PM.mensal().forEach(function(e){ev.push(e)})}
 var jn=PM.janela();if(jn.aberta)PM.mercadoIA(jn,ev);
 if(jn.aberta&&Math.random()<.3){var tp=PM.by[pmR(0,PM.B.cl.length-1)];var rid=tp&&tp.length?pmPick(tp):0;if(rid&&PM.fama(rid)>=70){var rc=pmR(0,PM.B.cl.length-1);if(rc!==S.W.p[rid][DD.C])PM.log('Rumor: '+PM.B.j[rid][JI.NOME]+' ('+PM.B.cl[S.W.p[rid][DD.C]][CI.NOME]+') interessa ao '+PM.B.cl[rc][CI.NOME]+(Math.random()<.5?'' :' (sem confirmação)'))}}
 PM.livresDia(ev);PM.tickNeg(ev);
 S.ofe.forEach(function(o){PM.ofertas.normal(o);
if(o.est==='fechando'){if(!o.pend||S.hoje>=o.pend.dia)PM.ofertas.concluirVenda(o,ev);return}
  if(o.est!=='aberta')return;
  if(S.W.p[o.j][DD.C]!==S.wi){o.est='encerrada';o.pend=null;return}
  if(o.pend&&S.hoje>=o.pend.dia){var l1=ev.length;PM.ofertas.resolver(o,ev);for(var q2=l1;q2<ev.length;q2++)if(ev[q2].k==='ofe')ev[q2].oid=o.id}
  if(o.est==='aberta'&&!o.pend&&S.hoje>=o.exp)o.est='expirada'});S.ofe=S.ofe.filter(function(o){return o.est==='aberta'||o.est==='espera'||o.est==='fechando'||S.hoje-o.dia<30});
 if(S.fin.conf<100&&dt.getUTCDay()===1&&S.fin.mes===0)S.fin.conf=Math.min(100,S.fin.conf+1);
 PM.jogarMundoDia(S.hoje);
 return ev};

/* ---------- depois de uma partida do usuário ---------- */
PM.ritmo=function(jogou){
 var W=S.W,ban=(S.esq&&S.esq.banco)||[];
 PM.by[S.wi].forEach(function(id){
  var d=W.p[id],fg=d[DD.FG]||0,b=PM.B.j[id];
  if(jogou[id]){d[DD.FG]=Math.max(0,fg-3);return}
  if(ban.indexOf(id)>=0){d[DD.FG]=Math.max(0,fg-1);return}
  fg++;d[DD.FG]=fg;
  if(fg>=3)d[DD.MO]=pmC(d[DD.MO]-Math.min(4,1+.4*(fg-3))*(b[JI.AMB]>70?1.25:1),5,100);
  if(fg>=2)d[DD.N]=Math.max(40,d[DD.N]-Math.min(5,fg-1));
  if(fg===5)PM.log(b[JI.NOME]+' reclama de estar fora dos planos do treinador');
  if(fg%8===0&&d[DD.O]>40)d[DD.O]--})};
 PM.aposPartida=function(M){
 var W=S.W,casa=M.casa,gf=casa?M.gh:M.ga,gs=casa?M.ga:M.gh,me=S.wi;
 [['meu',M.meu,me,gf,gs],['opp',M.opp,M.oppWi,gs,gf]].forEach(function(x){
  var t=x[1],ci=x[2],a=x[3],b=x[4];if(ci===undefined||ci===null)return;
  var gols=t.gols||{},ass={},ids=t.slots.map(function(s){return s.id}).concat(Object.keys(t.saiu||{}).map(Number)),mins={};
  ids.forEach(function(id){mins[id]=(t.saiu&&t.saiu[id])?60:90});
  PM.by[ci].forEach(function(id){if(ids.indexOf(id)<0)delete mins[id]});
  /* os que entraram valem 30 min */
  var starters=(t.titIni||[]);t.slots.forEach(function(s){if(starters.length&&starters.indexOf(s.id)<0)mins[s.id]=30});
  Object.keys(gols).forEach(function(id){for(var k=0;k<gols[id];k++)if(Math.random()<.7){var cand=Object.keys(mins).map(Number).filter(function(z){return z!==+id});if(cand.length){var a2=pmEsc(cand,function(z){return ((PM.pesoGol[PM.pos6(z)]||0)+.5)*(PM.efOv(z)/70)});ass[a2]=(ass[a2]||0)+1}}});
  var res=a>b?.35:a<b?-.3:0,avg=0,n=0;Object.keys(mins).forEach(function(id){avg+=W.p[id][DD.O];n++});avg/=Math.max(1,n);
  Object.keys(mins).forEach(function(id){id=+id;var d=W.p[id],g=gols[id]||0,as=ass[id]||0,p=PM.pos6(id),mn=mins[id];
   var nota=pmC(6+.9*g+.5*as+res+((b===0&&(p==='GOL'||p==='ZAG'||p==='LAT'))?.4:0)+(p==='GOL'?-.12*b:0)+(d[DD.O]-avg)/40+pmG()*.55-(t.am&&t.am[id]?.1:0),3.5,10);
   d[DD.J]++;if(x[0]==='opp')d[DD.MN]+=mn;d[DD.G]+=g;d[DD.A]+=as;d[DD.AM]+=(t.am&&t.am[id])?1:0;d[DD.CJ]++;d[DD.CG]+=g;d[DD.CA]+=as;d[DD.NS]+=Math.round(nota*10);d[DD.N]=Math.round(d[DD.N]*.7+nota*10*.3);
   if(Math.random()<.0009*(1+PM.B.j[id][JI.LES]/80)*(d[DD.FI]<50?1.8:1)*(mn/90))d[DD.L]=pmPick([7,10,14,21,30,45,70,110])});
  var dm=a>b?1.2:a<b?-1.5:0;PM.by[ci].forEach(function(id){var d=W.p[id],u=mins[id]!==undefined;d[DD.MO]=pmC(d[DD.MO]+(u?dm:dm-(PM.efOv(id)>=avg+2?.8:0)),5,100)})});
 var jogou={};(M.meu.titIni||[]).concat(M.meu.slots.map(function(s){return s.id}),Object.keys(M.meu.saiu||{}).map(Number)).forEach(function(id){jogou[id]=1});PM.ritmo(jogou);
  /* promessas de papel */
 Object.keys(S.prom).forEach(function(k){var pr=S.prom[k],jid=+k;if(PM.by[me].indexOf(jid)<0){delete S.prom[k];return}
  var tit=S.esq.slots.some(function(s){return s.id===jid});
  if(pr.p==='titular'){pr.f=tit?0:pr.f+1;if(pr.f>=3&&!pr.q){pr.q=1;W.p[jid][DD.MO]=pmC(W.p[jid][DD.MO]-12,5,100);PM.log(PM.B.j[jid][JI.NOME]+' reclama: prometeram que ele seria titular')}else if(tit)pr.q=0}});
 /* entrosamento do usuário e moral média do grupo */
 PM.atualizaEntro(me,S.esq.slots,S.esq.form);
 S.moral=Math.round(PM.by[me].reduce(function(a,id){return a+W.p[id][DD.MO]},0)/Math.max(1,PM.by[me].length));
 PM.xiCache={}};

/* ---------- fim de temporada: contratos, evolução, aposentadoria, bônus, empréstimos, prestígio ---------- */
PM.fimTemporada=function(posUser,ligaUser,tabLigas){
 var W=S.W,B=PM.B,ano=PM.ano(),out={saem:[],chegam:[],aposent:[],prog:[],bon:[],emp:[],evol:[],mens:[]},i,me=S.wi;
 /* meses que o calendário pula (mar a jun): folha e receitas */
 for(i=0;i<4;i++)PM.mensal().forEach(function(e){if(e.k==='atraso')out.mens.push(e.t)});
 /* 1) bônus por metas */
 S.bon=S.bon.filter(function(b){
  var d=S.W.p[b.jid],ok=b.t==='jogos'?d[DD.J]>=b.alvo:b.t==='gols'?d[DD.G]>=b.alvo:false;
  if(ok){if(b.dir<0){S.caixa-=b.valor;out.bon.push('Bônus pago: '+fmtK(b.valor)+' por '+PM.B.j[b.jid][JI.NOME])}else{PM.receber(b.valor);out.bon.push('Bônus recebido: '+fmtK(b.valor))}return false}
  return b.ate>ano});
 /* 2) empréstimos */
 W.emp=W.emp.filter(function(e){
  var d=S.W.p[e.jid],nm=PM.B.j[e.jid][JI.NOME];
  if(e.fim>ano+1)return true;
  var compra=false;
  if(e.t==='obrig')compra=(d[DD.J]>=e.cond);else if(e.t==='opcao'){if(e.dest===me){S.pendOp.push({jid:e.jid,orig:e.orig,valor:e.valor});d[DD.EMP]=-1;return false}compra=Math.random()<.6&&d[DD.N]>=66}
  if(compra){var v=e.valor;if(e.dest===me){S.caixa-=v;out.emp.push(nm+': compra obrigatória de '+fmtK(v)+' ativada')}else if(e.orig===me){PM.receber(v);out.emp.push(nm+' comprado por '+fmtK(v))}else{W.c[e.dest].cx-=v;W.c[e.orig].cx+=v}d[DD.EMP]=-1;d[DD.F]=ano+pmR(2,4)}
  else{PM.moverJog(e.jid,e.orig);d[DD.EMP]=-1;if(e.dest===me)out.emp.push(nm+' volta ao '+PM.B.cl[e.orig][CI.NOME])}
  return false});
 /* 3) recompra */
 Object.keys(W.cl).forEach(function(k){var c=W.cl[k],jid=+k;if(!c.rec)return;var d=S.W.p[jid];
  if(c.rec[2]<ano){c.rec=null;return}
  if(d[DD.C]!==c.rec[0]&&PM.valor(jid)>c.rec[1]*1.4&&c.rec[0]!==me&&Math.random()<.5){var v=c.rec[1];if(d[DD.C]===me){PM.receber(v);out.emp.push(PM.B.j[jid][JI.NOME]+': recompra exercida por '+PM.B.cl[c.rec[0]][CI.NOME]+' ('+fmtK(v)+')')}PM.moverJog(jid,c.rec[0]);c.rec=null}});
 /* 4) idade, evolução e valor */
 W.p.forEach(function(d,id){if(!d||d[DD.C]<-1)return;var b=PM.B.j[id];
  d[DD.I]++;var a=d[DD.I],o=d[DD.O],pot=d[DD.P],min=d[DD.MN],nm=d[DD.J]?d[DD.NS]/10/d[DD.J]:6.2;
  var dl;if(a<=23)dl=(pot-o)*.2+(min>1200?.6:min>400?0:-.8)+(nm-6.4)*1.1;else if(a<=29)dl=(pot-o)*.05+(nm-6.5)*.6;else dl=-(.4+(a-29)*.35)+(nm-6.5)*.3;
  dl+=pmG()*1.1;if(d[DD.L]>60)dl-=1;var cap=PM.cfg.progressao_teto_ano+(a<=21&&Math.random()<.03?2:0);
  dl=pmC(Math.round(dl),-6,cap);var no=pmC(o+dl,35,Math.max(pot,o)+(a<=21?1:0));if(a>=33)no=Math.min(no,o);
  d[DD.O]=no;if(a<=24&&pot<no)d[DD.P]=no;d[DD.P]=Math.max(no,pmC(Math.round(pot+(a<=23?pmG()*1.2:-1)),no,95));
  if(d[DD.C]===me&&dl!==0)out.evol.push([id,dl]);
  d[DD.H].push([ano,no,Math.round(d[DD.V]/1000*10)/10]);if(d[DD.H].length>4)d[DD.H].shift();
  d[DD.J]=0;d[DD.MN]=0;d[DD.FG]=0;d[DD.G]=0;d[DD.A]=0;d[DD.AM]=0;d[DD.VM]=0;d[DD.NS]=0;d[DD.N]=65;d[DD.FI]=100;d[DD.L]=0});
 /* 5) aposentadorias */
 W.p.forEach(function(d,id){if(!d||d[DD.C]<-1)return;var a=d[DD.I];
  if(a>=PM.cfg.aposentadoria_idade&&Math.random()<(a-PM.cfg.aposentadoria_idade+1)*.22+(d[DD.O]<65?.2:0)){
   if(d[DD.C]===me)out.aposent.push(id);PM.moverJog(id,-1);d[DD.C]=-2;var k=W.livres.indexOf(id);if(k>=0)W.livres.splice(k,1)}});
 /* 6) contratos que acabam em 30/06 do próximo ano de calendário */
 var fimAno=ano+1;
 W.p.forEach(function(d,id){if(!d||d[DD.C]<0||d[DD.F]>fimAno)return;if(d[DD.EMP]>=0)return;var ci=d[DD.C];
  if(d[DD.PC]>=0&&d[DD.ST]===2){var pc=d[DD.PC],pp=S.pre&&S.pre[id];PM.moverJog(id,pc);d[DD.F]=fimAno+(pp?pp.anos:pmR(2,4));if(pp)d[DD.S]=pp.sal;if(S.pre)delete S.pre[id];d[DD.ST]=0;d[DD.PC]=-1;if(pc===me)out.chegam.push(id);if(ci===me)out.saem.push(id);return}
  if(ci===me){W.p[id][DD.ST]=W.p[id][DD.ST];out.saem.push(id);PM.moverJog(id,-1);W.livres.push(id);d[DD.F]=fimAno+1;return}
  var top=PM.by[ci].slice().sort(function(a,b){return W.p[b][DD.O]-W.p[a][DD.O]}).indexOf(id)<16,b=PM.B.j[id];
  var renova=Math.random()<(top?.78:.3)&&Math.random()<(.45+b[JI.FID]/200+(W.c[ci].pr>=PM.piso(id)?.15:-.1));
  if(renova){d[DD.F]=fimAno+pmR(2,4);d[DD.S]=Math.round(PM.salJusto(id)*1.0)}
  else{var dest=-1;if(d[DD.O]>=72&&Math.random()<.6){var cs=PM.B.cl.map(function(c,x){return x}).filter(function(x){return x!==ci&&x!==me&&PM.by[x].length<27&&PM.elegivel(id,x).ok&&W.c[x].pr>=PM.piso(id)-4});if(cs.length)dest=pmPick(cs)}
   if(dest>=0){PM.moverJog(id,dest);d[DD.F]=fimAno+pmR(2,4);d[DD.S]=Math.round(PM.salJusto(id)*1.05);if(PM.fama(id)>=80)PM.log(b[JI.NOME]+' deixa o '+PM.B.cl[ci][CI.NOME]+' de graça e assina com o '+PM.B.cl[dest][CI.NOME])}
   else{PM.moverJog(id,-1);W.livres.push(id);d[DD.F]=fimAno+1;if(PM.fama(id)>=80)PM.log(b[JI.NOME]+' deixa o '+PM.B.cl[ci][CI.NOME]+' de graça')}}});
 W.livres=W.livres.filter(function(id){return W.p[id][DD.C]===-1});
 /* pré-contratos ficam sem efeito ao virar a temporada */
 /* 7) prestígio dos clubes pela posição final */
 Object.keys(B.liga).forEach(function(lid){
  var ord=lid===ligaUser?tabLigas.user:PM.ordemLiga(lid),n=ord.length;
  ord.forEach(function(ci,k){var c=W.c[ci],base=Math.round(c.pr);var delta=k===0?2.5:k<3?1.2:k<n*.4?.4:k<n*.7?-.2:k<n-3?-.7:-1.4;
   var alvo=PM.B.cl[ci][CI.REP]+(k===0?3:0);c.pr=pmC(c.pr+delta+(alvo-c.pr)*.04,25,99);if(k===0)c.t++;c.cx+=Math.round(PM.B.cl[ci][CI.REC]*1000*.05*(.5+(n-k)/n))})});
 /* 8) categorias de base e livres sem clube */
 W.livres.forEach(function(id){var d=W.p[id];if(d[DD.C]!==-1)return;if((d[DD.I]>=32&&Math.random()<.4)||(d[DD.O]<52&&Math.random()<.35)){d[DD.C]=-2}});
 W.livres=W.livres.filter(function(id){return W.p[id][DD.C]===-1});
 B.cl.forEach(function(c,ci){var l=PM.by[ci];
  if(ci===me){out.base=PM.regen(ci);return}
  PM.regen(ci);l=PM.by[ci];
  while(l.length>26){var w=l.slice().sort(function(a,b){return (W.p[a][DD.O]+(W.p[a][DD.I]>=31?-3:0))-(W.p[b][DD.O]+(W.p[b][DD.I]>=31?-3:0))})[0];PM.moverJog(w,-1);W.p[w][DD.F]=fimAno+1;W.livres.push(w)}});
 PM.completarElencos();
 W.p.forEach(function(d,id){if(d&&d[DD.C]>=-1)d[DD.V]=PM.valor(id)});
 PM.by.forEach(function(l,ci){var a=l.length;});
 PM.xiCache={};return out};
