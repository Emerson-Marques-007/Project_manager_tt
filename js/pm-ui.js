var PMUI={sub:'buscar',ord:'o',dir:-1,f:{nome:'',pos:'',nac:'',imin:'',imax:'',omin:'',omax:'',vmax:'',liga:'',tipo:'',cont:''},nf:null,nid:0,fid:0};
PMUI.carregar=function(){return PM.B?Promise.resolve():api({acao:'mundo'}).then(function(r){PM.init(r)})};
PMUI.css=function(){
 if(document.getElementById('pm-css'))return;var s=document.createElement('style');s.id='pm-css';
 s.textContent=
 '.pmov{position:fixed;inset:0;background:var(--bg);z-index:95;overflow:auto;display:none;padding:14px}.pmov.on{display:block}.pmw{max-width:1000px;margin:0 auto}'+
 '.mkf{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}.mkf label{font-size:12px;color:var(--mut);display:block}.mkf input,.mkf select,.pmw input,.pmw select{width:100%;padding:10px;border-radius:10px;border:1px solid var(--bd);background:var(--bg2);color:var(--tx);font:inherit}'+
 '.mk{display:grid;grid-template-columns:40px 36px minmax(0,1fr) 42px 36px 74px 92px;gap:8px;align-items:center;padding:9px 4px;border-bottom:1px solid var(--bd);cursor:pointer}.mk:hover{background:#ffffff08}.mk .pn b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mk .pn small{color:var(--mut);font-size:11px}'+
 '.mkh{color:var(--mut);font-size:11px;cursor:default}.mkh span{cursor:pointer}.mk .esc{width:30px;height:30px;font-size:9px}.mk img.esc{background:#fff2;padding:2px}'+
 '.st{font-size:11px;font-weight:700;padding:4px 8px;border-radius:99px;text-align:center;white-space:nowrap}.st.verde{background:#3dbb6a33;color:#7ee2a0}.st.amar{background:#facc1526;color:#facc15}.st.verm{background:#ef444426;color:#fca5a5}.st.azul{background:#3b82f633;color:#93c5fd}.st.cinza{background:#ffffff14;color:var(--mut)}'+
 '.seg{display:flex;gap:3px;margin:4px 0}.seg i{flex:1;height:8px;border-radius:4px;background:#0b120e;border:1px solid var(--bd)}.seg i.on{background:var(--c1);border-color:var(--c1)}.seg.r i.on{background:#ef4444;border-color:#ef4444}.seg.y i.on{background:#facc15;border-color:#facc15}'+
 '.fh{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.fh .big{font:400 40px Michroma,sans-serif;line-height:1}.fgrid{display:grid;gap:14px;grid-template-columns:1fr}@media(min-width:800px){.fgrid{grid-template-columns:1fr 1fr}}'+
 '.att{display:grid;grid-template-columns:78px 1fr 30px;gap:8px;align-items:center;font-size:13px;margin:5px 0}.att .bar{height:10px}'+
 '.steps{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}.steps span{flex:1;min-width:80px;text-align:center;font-size:11px;padding:7px 4px;border-radius:99px;background:var(--bg2);border:1px solid var(--bd);color:var(--mut)}.steps span.on{background:var(--c1);color:#03150a;border-color:var(--c1);font-weight:700}.steps span.ok{border-color:var(--c1);color:var(--c1)}'+
 '.negg{display:grid;gap:14px;grid-template-columns:1fr}@media(min-width:800px){.negg{grid-template-columns:1.1fr .9fr}}.row2{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin:8px 0}.row2 label{font-size:13px}'+
 '.tns{display:inline-block;padding:5px 12px;border-radius:99px;font-weight:700;font-size:12px}.tns.t0{background:#3dbb6a33;color:#7ee2a0}.tns.t1{background:#facc1526;color:#facc15}.tns.t2{background:#f9731626;color:#fdba74}.tns.t3{background:#ef444433;color:#fca5a5}'+
 '.bub{padding:9px 12px;border-radius:12px;margin:6px 0;font-size:13px;max-width:92%}.bub.c{background:var(--bg2);border:1px solid var(--bd)}.bub.u{background:#1fa35a33;margin-left:auto}.bub.j{background:#3b82f622}'+
 '.stk{position:sticky;bottom:0;background:var(--bg);padding:10px 0;display:flex;gap:8px}.stk button{flex:1}.jan{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;border-radius:14px;border:1px solid var(--c1);background:linear-gradient(90deg,#1fa35a33,#0e3f2533)}.jan.warn{border-color:var(--warn);background:#facc1518}.jan.off{border-color:var(--bd);background:var(--bg2)}.jan b{font-size:14px}'+
 '.cv{display:grid;grid-template-columns:42px minmax(0,1fr) 62px 64px 86px;gap:8px;align-items:center;padding:9px 2px;border-bottom:1px solid var(--bd)}'+
 '@keyframes pj{0%{box-shadow:0 0 0 0 #3dbb6a88}100%{box-shadow:0 0 0 18px #3dbb6a00}}.jan:not(.off){animation:pj 1.6s ease-out 2}'+
 '@media(max-width:560px){.mk{grid-template-columns:36px 30px minmax(0,1fr) 38px 70px;}.mk .xi,.mk .xa{display:none}.cv{grid-template-columns:38px minmax(0,1fr) 54px 80px}.cv .xc{display:none}}';
 document.head.appendChild(s)};
PMUI.ov=function(n){var id='pm-'+n,e=document.getElementById(id);if(!e){e=document.createElement('div');e.id=id;e.className='pmov';document.body.appendChild(e)}return e};
PMUI.abre=function(n,h){var e=PMUI.ov(n);e.innerHTML=mono('<div class="pmw">'+h+'</div>');e.className='pmov on';return e};
PMUI.fecha=function(n){var e=document.getElementById('pm-'+n);if(e){e.className='pmov';e.innerHTML=''}};
PMUI.fechaTudo=function(){['ficha','neg','ren','bal','ofe'].forEach(PMUI.fecha)};
function pmEscH(s){return esc(s)}
PMUI.clubeObj=function(ci){var c=PM.B.cl[ci];return {n:c[CI.NOME],escudo:c[CI.ESC],f:c[CI.REP],dbid:c[CI.ID]}};
PMUI.crest=function(ci,sz){if(ci<0)return '<div class="esc" style="width:'+(sz||30)+'px;height:'+(sz||30)+'px;background:#243;font-size:9px">LIV</div>';var c=PMUI.clubeObj(ci);return crest(c,sz)};
PMUI.atts=function(id){var b=PM.B.j[id],d=S.W.p[id],df=d[DD.O]-b[JI.O],a=d[DD.I],pen=[Math.max(0,a-29)*.9,0,0,0,0,Math.max(0,a-30)*.8];return [JI.RIT,JI.FIN,JI.PAS,JI.DRI,JI.DEF,JI.FIS].map(function(k,i){return pmC(Math.round(b[k]+df-pen[i]),18,97)})};
PMUI.chip=function(c,t,title){return '<span class="st '+c+'"'+(title?' title="'+esc(title)+'"':'')+'>'+esc(t)+'</span>'};
PMUI.seg=function(l,cor){var h='<div class="seg '+(cor||'')+'">';for(var i=0;i<7;i++)h+='<i'+(i<=l?' class="on"':'')+'></i>';return h+'</div>'};
PMUI.mini=function(id){var l=['F','Fm','M'],v=[PM.faseNivel(id),PM.formaNivel(id),PM.moralNivel(id)];return 'Fase '+PM.nivel[v[0]]+' · Forma '+PM.nivel[v[1]]+' · Moral '+PM.nivel[v[2]]};
PMUI.fav=function(id){S.fav=S.fav||[];var k=S.fav.indexOf(id);if(k>=0)S.fav.splice(k,1);else S.fav.push(id);salvar()};

/* ---------- janela: faixa e avisos ---------- */
PMUI.banner=function(){
 var j=PM.janela();
 if(j.aberta)return '<div class="jan'+(j.rest<=3?' warn':'')+'"><div><b>🏁 Janela de '+esc(j.tipo.toLowerCase())+' ABERTA</b><div class="hint">'+(j.ultimo?'Hoje é o último dia!':j.rest+' dia'+(j.rest!==1?'s':'')+' restantes · fecha em '+PM.dataStr(j.fe))+'</div></div><button class="sec" data-pm="irmercado">Ver o mercado</button></div>';
 return '<div class="jan off"><div><b>Janela fechada</b><div class="hint">Próxima ('+esc((j.proxTipo||'').toLowerCase())+') abre em '+j.diasProx+' dias · '+PM.dataStr(j.prox)+'. Fora da janela, os clubes quase não vendem.</div></div></div>'};
PMUI.eventos=function(ev){
 var imp=false,mod=false,ofs=[],fa=null,fila=null,resp=[],trs=[];
 ev.forEach(function(e){if(e.k==='ofenova')ofs.push(e);else if(e.k==='folhaAnim')fa=e;else if((e.k==='vendeu'||e.k==='vendaFim'||e.k==='chegou')&&e.d)trs.push(e.d)});
 ev.forEach(function(e){
  if(e.k==='abre'){imp=true;mod=true;modal('🏁 Janela de transferências aberta',e.t,[{l:'Ver o mercado',f:function(){ABA='mercado';render()}},{l:'Depois',f:function(){}}])}
  else if(e.k==='ultimo'){imp=true;mod=true;modal('🏁 Último dia da janela!','Hoje é o último dia para contratar. Depois, só na próxima janela.',[{l:'Ir ao mercado',f:function(){ABA='mercado';render()}},{l:'Fechar',f:function(){}}])}
  else if(e.k==='fecha'){imp=true;mod=true;PMUI.balanco()}
  else if(e.k==='atraso'){if(!fa){imp=true;mod=true;modal('⚠ Salários atrasados',e.t,[{l:'Entendi',f:function(){}}])}}
  else if((e.k==='neg'&&e.nid)||(e.k==='ofe'&&e.oid)){imp=true;resp.push(e)}
  else if(e.k==='vendaFim'||((e.k==='vendeu'||e.k==='chegou')&&e.d)){imp=true}
  else if(e.k==='neg'||e.k==='chegou'||e.k==='vendeu'||e.k==='ofe'){imp=true;toast(e.t)}
 });
 if(ofs.length){imp=true;
  if(mod)toast(ofs.length+(ofs.length>1?' propostas novas':' proposta nova')+' no Mercado');
  else if(fa||trs.length)fila=ofs;
  else PMUI.avisoOfertas(ofs)}
 if(resp.length){imp=true;if(mod||fa||trs.length||ofs.length)toast(resp.map(function(x){return x.t}).join(' · '));else PMUI.avisoResp(resp)}
 if(trs.length){imp=true;PMUI.animTransf(trs,fa?function(){PMUI.animFolha(fa.d,fila)}:fila?function(){PMUI.avisoOfertas(fila)}:null)}
 else if(fa){imp=true;PMUI.animFolha(fa.d,fila)}
 return imp};
PMUI.tk=0;
PMUI.animTransf=function(lista,depois){
 ANIM=true;var a=$('anim'),i=0;
 var nomeC=function(ci){return ci>=0?esc(PM.B.cl[ci][CI.NOME]):'Sem clube'};
 function mostra(){
  var d=lista[i],b=PM.B.j[d.jid],p=S.W.p[d.jid],ok=d.ok,compra=!!d.compra,de=compra?d.de:S.wi,para=compra?S.wi:d.para,k,coins='',delta=d.depois-d.antes,tk=++PMUI.tk;
  if(ok&&!compra)for(k=0;k<18;k++)coins+='<span class="coin" style="left:'+ri(4,92)+'%;animation-delay:'+(2+Math.random()*1.4).toFixed(2)+'s">🪙</span>';
  var tag=!ok?'Negociação fracassou':compra?'Reforço contratado':d.emp?'Empréstimo concluído':'Venda concluída';
  var msg=!ok?esc(d.motivo):compra?'É o novo reforço do seu clube.':(d.emp?'Foi emprestado ao ':'Agora joga no ')+nomeC(para)+'.'+(d.parc?' Pagamento em '+d.parc+' parcelas.':'')+(d.troca?' O clube também envia '+d.troca+' jogador'+(d.troca>1?'es':'')+' na troca.':'');
  var h=coins+'<div class="tr-box '+(ok?'ok':'fail')+'"><span class="tr-tag">'+tag+'</span><div class="tr-nome">'+esc(b[JI.NOME])+'</div>'+
   '<div class="tr-sub"><span class="pp g-'+grupoPos(b[JI.POSJ])+'">'+b[JI.POSJ]+'</span>'+p[DD.I]+' anos · OVR '+p[DD.O]+'</div>'+
   '<div class="tr-rota"><div class="tr-club">'+PMUI.crest(de,56)+'<b>'+nomeC(de)+'</b></div><div class="tr-trilho"><i class="tr-bola"></i></div><div class="tr-club tr-dest">'+PMUI.crest(para,56)+'<b>'+nomeC(para)+'</b></div></div>'+
   '<div class="tr-msg">'+msg+'</div>'+
   (ok?'<div class="tr-grid"><div><small>'+(compra?'Investimento':d.emp?'Taxa recebida':'Valor da venda')+'</small><b id="tr-v">'+fmtK(0)+'</b></div><div><small>Caixa do clube</small><b id="tr-n">'+fmtK(d.antes)+'</b><em class="'+(delta>=0?'up':'dn')+'">'+(delta>=0?'+ ':'− ')+fmtK(Math.abs(delta))+'</em></div></div>'
    :'<div class="tr-grid one"><div><small>Caixa do clube</small><b>'+fmtK(d.antes)+'</b><em>Sem alteração</em></div></div>')+
   '<button class="full" id="tr-ok">'+(i<lista.length-1?'Próxima':'Continuar')+'</button></div>';
  a.innerHTML=mono(h);a.className='on';
  if(ok){var t0=null,dl=2100,dur=1500;
   var passo=function(ts){if(tk!==PMUI.tk)return;if(!t0)t0=ts;var q=Math.max(0,Math.min(1,(ts-t0-dl)/dur)),e=1-Math.pow(1-q,3),x=$('tr-v'),y=$('tr-n');if(!x||!y)return;x.textContent=fmtK((d.valor||0)*e);y.textContent=fmtK(d.antes+delta*e);if(q<1)requestAnimationFrame(passo)};
   requestAnimationFrame(passo)}
  $('tr-ok').onclick=function(){i++;if(i<lista.length)mostra();else{PMUI.tk++;a.className='';a.innerHTML='';ANIM=false;PM.sync();render();if(depois)depois()}}}
 mostra()};
 PMUI.balanco=function(){
 var b=S.bal;if(!b)return;
 var nm=function(l){return l.map(function(id){return PM.B.j[id][JI.NOME]}).join(', ')||'ninguém'};
 modal('Balanço da janela de '+b.tipo.toLowerCase(),'Nota '+b.nota+' · Gastos '+fmtK(b.gasto)+' · Vendas '+fmtK(b.receita)+' · Saldo '+fmtK(b.liq)+' · Idade média do elenco '+b.idade+'. Chegaram: '+nm(b.comp)+'. Saíram: '+nm(b.vend)+'.',[{l:'Fechar',f:function(){}}])};

/* ---------- painel e tática (cards extras) ---------- */
PMUI.painelExtra=function(){
 var f=S.fin,fol=Math.round(PM.folhaMes());
 return PMUI.banner()+'<div class="tiles">'+
  tile('💰','Folha mensal',fmtK(fol),'Receita fixa '+fmtK(PM.B.cl[S.wi][CI.FIXA]),'')+
  tile('⚠','Salários em atraso',fmtK(f.div),f.div>0?f.mes+' mês(es) seguidos':'Em dia',f.div>0?'bad':'ok')+
  tile('🎯','Confiança da diretoria',Math.round(f.conf)+'/100','Teto de moral '+PM.moralCap(),f.conf<60?'bad':'')+
  tile('🔁','Reputação no mercado',Math.round(S.repMer)+'/100','Clima: '+S.W.clima,S.repMer<40?'bad':'')+'</div>'};
PMUI.cardEntro=function(){
 var E=S.esq,en=PM.entro(S.wi,E.slots,E.form,E.estilo);
 return '<div class="card"><h2>Entrosamento</h2>'+bar('Time',en.t,'rep',en.t+'/100')+bar('Defesa',en.d,'mini',en.d)+bar('Meio',en.m,'mini',en.m)+bar('Ataque',en.a,'mini',en.a)+
  '<p class="hint">Efeito na força do time: '+(en.mod>=0?'+':'')+en.mod.toFixed(1)+' pontos. Sobe jogando junto, com jogadores nas funções certas, moral e físico bons.</p>'+
  (en.al.length?'<div class="chips">'+en.al.slice(0,5).map(function(a){return '<span class="chip warn">'+esc(a)+'</span>'}).join('')+'</div>':'<div class="chips"><span class="chip good">Time bem encaixado</span></div>')+'</div>'};

/* ---------- aba MERCADO ---------- */
PMUI.buscar=function(){
 var f=PMUI.f,B=PM.B,me=S.wi,out=[],nome=f.nome.toLowerCase(),nac=f.nac.toLowerCase();
 B.j.forEach(function(b,id){if(!b)return;var d=S.W.p[id],c=d[DD.C];if(c===-2||c===me)return;
  if(f.tipo==='lt'&&!(S.W.lt&&S.W.lt[id]===1))return;if(f.tipo==='le'&&!(S.W.lt&&S.W.lt[id]===2))return;if(f.tipo==='livres'&&c!==-1)return;if(f.tipo==='comprar'&&c<0)return;if(f.tipo==='pre'&&!(c>=0&&PM.mesesRest(id)<=6))return;
  if(nome&&b[JI.NOME].toLowerCase().indexOf(nome)<0)return;if(f.pos&&b[JI.POSJ]!==f.pos)return;if(nac&&b[JI.NAC].toLowerCase().indexOf(nac)<0)return;
  var o=d[DD.O],a=d[DD.I];if(f.omin&&o<+f.omin)return;if(f.omax&&o>+f.omax)return;if(f.imin&&a<+f.imin)return;if(f.imax&&a>+f.imax)return;
  if(f.liga&&(c<0||B.cl[c][CI.LIGA]!==f.liga))return;if(f.cont&&PM.mesesRest(id)>+f.cont)return;
  if(f.vmax&&PM.valor(id)/1000>+f.vmax)return;out.push(id)});
 var key={o:function(i){return S.W.p[i][DD.O]},i:function(i){return S.W.p[i][DD.I]},v:function(i){return PM.valor(i)},n:function(i){return PM.B.j[i][JI.NOME]}}[PMUI.ord];
 out.sort(function(x,y){var a=key(x),b=key(y);return (a>b?1:a<b?-1:0)*PMUI.dir});return out};
PMUI.status=function(id){var d=S.W.p[id],me=S.wi,c=d[DD.C];
 if(c===-1)return ['azul','Livre'];if(PM.negPorJog(id))return ['cinza','Em negociação'];
 if(PM.recente(id))return ['cinza','Contratado agora'];
 var el=PM.elegivel(id,me);if(!el.ok)return ['verm','Indisponível',el.m];if(PM.intocavel(id,c))return ['verm','Intocável'];
 if(!PM.janela().aberta)return ['amar','Fora da janela'];
 var lt=S.W.lt&&S.W.lt[id];if(lt===1)return ['verde','Lista de transf.'];if(lt===2)return ['azul','Lista de empr.'];
 if(PM.mesesRest(id)<=6)return ['azul','Pré-contrato'];return ['verde','Disponível']};
PMUI.linha=function(id,extra){
 var b=PM.B.j[id],d=S.W.p[id],st=PMUI.status(id),j=PM.view(id);
 return '<div class="mk" data-ficha="'+id+'"><div class="pp g-'+grupoPos(b[JI.POSJ])+'" style="border-radius:8px;text-align:center;font-size:11px;font-weight:700;padding:5px 0">'+b[JI.POSJ]+'</div>'+PMUI.crest(d[DD.C],30)+
  '<div class="pn"><b>'+esc(b[JI.NOME])+'</b><small>'+(d[DD.C]>=0?esc(PM.B.cl[d[DD.C]][CI.NOME]):'Sem clube')+' · '+esc(b[JI.NAC])+(extra?' · '+extra:'')+'</small></div>'+
  '<div class="ov '+ovCls(d[DD.O])+'" style="text-align:center;font-weight:800;border-radius:8px;padding:5px 0">'+d[DD.O]+'</div><div class="xi" style="text-align:center">'+d[DD.I]+'</div><div class="xa" style="text-align:right;font-size:13px">'+fmtK(PM.valor(id))+'</div>'+
  PMUI.chip(st[0],st[1],st[2])+'</div>'};
PMUI.pMercado=function(){
var subs=[['buscar','Buscar'],['neg','Negociações ('+S.neg.filter(function(n){return ['aberta','jogador','medico','espera','congelada'].indexOf(n.est)>=0}).length+')'],['ofe','Ofertas ('+S.ofe.filter(function(o){return o.est==='aberta'}).length+')'],['lt','Transferências ('+PM.lista().t.length+')'],['le','Empréstimos ('+PM.lista().e.length+')'],['fav','★ Desejos'],['news','Notícias']];
 var h=PMUI.banner()+'<div class="opts">'+subs.map(function(s){return '<button class="opt'+(PMUI.sub===s[0]?' on':'')+'" data-pm="sub" data-v="'+s[0]+'">'+s[1]+'</button>'}).join('')+'</div>';
 if(PMUI.sub==='buscar'){
  var f=PMUI.f,ligas=Object.keys(PM.B.liga).map(function(l){return [l,PM.B.cl[PM.B.liga[l][0]][CI.LIGANOME]]});
  var inp=function(k,l,t,ph){return '<div><label>'+l+'</label><input data-f="'+k+'" type="'+(t||'text')+'" value="'+esc(f[k])+'" placeholder="'+(ph||'')+'"></div>'};
  h+='<div class="card"><h2>Buscar jogadores</h2><div class="mkf">'+inp('nome','Nome')+
   '<div><label>Posição</label><select data-f="pos"><option value="">Qualquer</option>'+POS.map(function(p){return '<option value="'+p[0]+'"'+(f.pos===p[0]?' selected':'')+'>'+POSNOME[p[0]]+'</option>'}).join('')+'</select></div>'+inp('nac','Nacionalidade')+
   '<div><label>Liga</label><select data-f="liga"><option value="">Todas</option>'+ligas.map(function(l){return '<option value="'+l[0]+'"'+(f.liga===l[0]?' selected':'')+'>'+esc(l[1])+'</option>'}).join('')+'</select></div>'+
   '<div><label>Tipo</label><select data-f="tipo">'+[['','Todos'],['comprar','Comprar'],['lt','Lista de transferências'],['le','Lista de empréstimo'],['livres','Agentes livres'],['pre','Pré-contrato (≤6 meses)']].map(function(t){return '<option value="'+t[0]+'"'+(f.tipo===t[0]?' selected':'')+'>'+t[1]+'</option>'}).join('')+'</select></div>'+
   inp('imin','Idade mín.','number')+inp('imax','Idade máx.','number')+inp('omin','Overall mín.','number')+inp('omax','Overall máx.','number')+inp('vmax','Valor máx. (€ mi)','number')+inp('cont','Contrato até (meses)','number')+'</div>'+
   '<div class="mctl" style="margin-top:10px"><button data-pm="busca">Buscar</button><button class="sec" data-pm="limpa">Limpar</button></div></div>';
  var r=PMUI.res||[];
  h+='<div class="card"><h2>Resultados ('+r.length+')</h2><div class="mk mkh"><span></span><span></span><span data-pm="ord" data-v="n">Nome</span><span data-pm="ord" data-v="o">OVR</span><span class="xi" data-pm="ord" data-v="i">Idade</span><span class="xa" data-pm="ord" data-v="v">Valor</span><span>Status</span></div>'+
   r.slice(0,60).map(function(id){return PMUI.linha(id)}).join('')+(r.length>60?'<p class="hint">Mostrando 60 de '+r.length+'. Refine os filtros.</p>':'')+(r.length?'':'<p class="hint">Use os filtros e toque em Buscar.</p>')+'</div>';
 }else if(PMUI.sub==='neg'){
  var ns=S.neg.slice().reverse();h+='<div class="card"><h2>Negociações</h2>'+(ns.length?ns.map(function(n){var b=PM.B.j[n.j],t=PM.tensao(n.pac);
   return '<div class="mk" style="grid-template-columns:minmax(0,1fr) auto auto" data-neg="'+n.id+'"><div class="pn"><b>'+esc(b[JI.NOME])+'</b><small>'+(n.livre?'Agente livre':esc(PM.B.cl[n.de][CI.NOME]))+' · '+({clube:'Proposta ao clube',jogador:'Acordo com o jogador',medico:'Exame médico'}[n.fase]||'')+(n.pend?' · aguardando resposta':'')+'</small></div>'+(n.est==='aberta'||n.est==='jogador'?'<span class="tns t'+t[1]+'">'+t[0]+'</span>':'<span></span>')+PMUI.chip(({aberta:'verde',jogador:'verde',medico:'azul',espera:'amar',congelada:'cinza',concluida:'verde',recusada:'verm',encerrada:'cinza'})[n.est]||'cinza',({aberta:'Em andamento',jogador:'Em andamento',medico:'Em andamento',espera:'Aguarda janela',congelada:'Congelada',concluida:'Concluída',recusada:'Recusada',encerrada:'Encerrada'})[n.est]||n.est)+'</div>'}).join(''):'<p class="hint">Nenhuma negociação. Busque um jogador e toque em Negociar.</p>')+'</div>';
 }else if(PMUI.sub==='ofe'){h+=PMUI.pOfertas();
 }else if(PMUI.sub==='lt'||PMUI.sub==='le'){h+=PMUI.pLista(PMUI.sub);
 }else if(PMUI.sub==='ofe-antigo'){
  var os=S.ofe.filter(function(o){return o.est==='aberta'||o.est==='espera'});
  h+='<div class="card"><h2>Ofertas recebidas</h2>'+(os.length?os.map(function(o){var b=PM.B.j[o.j];return '<div class="prox"><div><b>'+esc(PM.B.cl[o.de][CI.NOME])+' quer '+esc(b[JI.NOME])+'</b><small>Oferta '+fmtK(o.v)+' · valor de mercado '+fmtK(PM.valor(o.j))+(o.est==='espera'?' · aceita, sai na próxima janela':' · expira em '+Math.max(0,o.exp-S.hoje)+' dias')+'</small></div>'+(o.est==='aberta'?'<div class="mctl"><button data-pm="ofe" data-v="aceitar" data-id="'+o.id+'">Aceitar</button><button class="sec" data-pm="ofe" data-v="contra" data-id="'+o.id+'">+10%</button><button class="sec" data-pm="ofe" data-v="recusar" data-id="'+o.id+'">Recusar</button></div>':'')+'</div>'}).join(''):'<p class="hint">Nenhuma oferta no momento. Elas aparecem durante as janelas.</p>')+'</div>';
 }else if(PMUI.sub==='fav'){
  var fv=(S.fav||[]).filter(function(id){return S.W.p[id]&&S.W.p[id][DD.C]!==-2});h+='<div class="card"><h2>Lista de desejos</h2>'+(fv.length?fv.map(function(id){return PMUI.linha(id)}).join(''):'<p class="hint">Toque na estrela na ficha do jogador para acompanhar.</p>')+'</div>';
 }else{
  h+='<div class="card"><h2>Notícias do mercado</h2>'+(S.W.news.length?S.W.news.slice(0,25).map(function(n){return '<div class="res">'+PM.dataStr(n.d)+' · '+esc(n.t)+'</div>'}).join(''):'<p class="hint">Sem notícias ainda.</p>')+'</div>';
 }
 return h};

/* ---------- ficha do jogador ---------- */
PMUI.ficha=function(id){
 PMUI.fid=id;var b=PM.B.j[id],d=S.W.p[id],me=S.wi,c=d[DD.C],own=c===me,at=PMUI.atts(id),nm=['Ritmo','Finalização','Passe','Drible','Defesa','Físico'];
 var nota=d[DD.J]?(d[DD.NS]/10/d[DD.J]).toFixed(1):'—',g90=d[DD.MN]?(d[DD.G]/(d[DD.MN]/90)).toFixed(2):'0.00',st=PMUI.status(id);
 var potTxt=own?d[DD.P]:'~'+pmC(d[DD.P]+Math.round(pmSeed(id+S.temp)()*6-3),d[DD.O],99);
 var hist=(d[DD.H]||[]).map(function(x){return x[0]+': '+x[1]+' / '+fmtK(x[2]*1000)}).join(' · ')||'sem histórico ainda';
 var h='<div class="picker-head"><h2>Ficha do jogador</h2><button class="sec" data-pm="fechar">✕ Fechar</button></div>'+
 '<div class="card"><div class="fh">'+PMUI.crest(c,52)+'<div style="flex:1;min-width:150px"><h2 style="margin:0;border:0">'+esc(b[JI.NOME])+'</h2><div class="hint">'+(c>=0?esc(PM.B.cl[c][CI.NOME]):'Sem clube')+' · '+esc(b[JI.NAC])+' · '+d[DD.I]+' anos · '+b[JI.ALT]+' cm · pé '+esc(String(b[JI.PE]).toLowerCase())+'</div><div class="chips"><span class="chip">'+b[JI.POS]+(b[JI.POS2]?' / '+b[JI.POS2]:'')+'</span><span class="chip">'+esc(b[JI.PAPEL])+'</span>'+PMUI.chip(st[0],st[1],st[2])+'</div></div><div style="text-align:center"><div class="big '+ovCls(d[DD.O])+'" style="padding:8px 14px;border-radius:12px">'+d[DD.O]+'</div><div class="hint">POT '+potTxt+'</div></div></div></div>'+
 '<div class="fgrid"><div class="card"><h2>Atributos</h2>'+at.map(function(v,i){return '<div class="att"><span>'+nm[i]+'</span><div class="bar mini"><i style="width:'+v+'%;background:'+corFis(v)+'"></i></div><b>'+v+'</b></div>'}).join('')+'</div>'+
 '<div class="card"><h2>Fase, forma e moral</h2><div class="lab"><span>Fase</span><b>'+PM.nivel[PM.faseNivel(id)]+'</b></div>'+PMUI.seg(PM.faseNivel(id))+'<div class="lab"><span>Forma física</span><b>'+PM.nivel[PM.formaNivel(id)]+' ('+Math.round(d[DD.FI])+'%)</b></div>'+PMUI.seg(PM.formaNivel(id),PM.formaNivel(id)<3?'r':'')+'<div class="lab"><span>Moral</span><b>'+PM.nivel[PM.moralNivel(id)]+'</b></div>'+PMUI.seg(PM.moralNivel(id),PM.moralNivel(id)<3?'r':'')+
  (d[DD.L]>0?'<div class="chips"><span class="chip bad">Lesionado: '+d[DD.L]+' dias</span></div>':'')+'<p class="hint">Overall efetivo hoje: <b>'+Math.round(PM.efOv(id)*10)/10+'</b></p></div></div>'+
 '<div class="fgrid"><div class="card"><h2>Estatísticas</h2><div class="sum"><div><small>Jogos</small><b>'+d[DD.J]+'</b></div><div><small>Minutos</small><b>'+d[DD.MN]+'</b></div><div><small>Gols</small><b>'+d[DD.G]+'</b></div><div><small>Assist.</small><b>'+d[DD.A]+'</b></div><div><small>Amarelos</small><b>'+d[DD.AM]+'</b></div><div><small>Vermelhos</small><b>'+d[DD.VM]+'</b></div><div><small>Nota média</small><b>'+nota+'</b></div><div><small>Gols/90</small><b>'+g90+'</b></div></div><p class="hint">No jogo: '+d[DD.CJ]+' jogos · '+d[DD.CG]+' gols · '+d[DD.CA]+' assistências.</p></div>'+
 '<div class="card"><h2>Contrato e valor</h2><div class="kv"><div><small>Valor de mercado</small><b>'+fmtK(PM.valor(id))+'</b></div><div><small>Salário/ano</small><b>'+fmtK(d[DD.S])+'</b></div><div><small>Contrato até</small><b>'+d[DD.F]+'</b></div><div><small>Restam</small><b>'+PM.mesesRest(id)+' meses</b></div></div>'+
  (own?'':'<div class="chips"><span class="chip">Interesse no seu clube: '+PM.interesse(id,me)+'</span></div>')+'<p class="hint">Histórico: '+esc(hist)+'</p></div></div>'+
 '<div class="stk">'+(own?'<button data-pm="renovar" data-id="'+id+'">Renovar contrato</button><button class="sec" data-pm="listar" data-v="t" data-id="'+id+'">'+(PM.listaUser(id)===1?'✓ Na lista de transf.':'Lista de transferências')+'</button><button class="sec" data-pm="listar" data-v="e" data-id="'+id+'">'+(PM.listaUser(id)===2?'✓ Na lista de empr.':'Lista de empréstimo')+'</button>':(c===-1?'<button data-pm="negociar" data-id="'+id+'">Negociar contrato</button>':'<button data-pm="negociar" data-id="'+id+'">Negociar</button>'+(PM.mesesRest(id)<=6?'<button class="sec" data-pm="pre" data-id="'+id+'">Pré-contrato</button>':'')))+(own?'':'<button class="sec" data-pm="favorito" data-id="'+id+'">'+((S.fav||[]).indexOf(id)>=0?'★ Na lista':'☆ Lista')+'</button>')+'</div>';
 PMUI.abre('ficha',h)};

/* ---------- tela de negociação ---------- */
PMUI.nfDef=function(n){
 var ask=n.ask||PM.valor(n.j);return {tipo:(S.W.lt&&S.W.lt[n.j]===2)?'emp':'compra',valor:Math.round((n.ct||ask*.95)/10)*10,parc:1,troca:[],bT:'',bA:10,bV:0,rev:0,rec:false,recV:Math.round(ask*1.3),recA:PM.ano()+3,empT:'simples',taxa:Math.round(ask*.1),opc:Math.round(ask*.9),cond:20,sal:0,anos:3,luvas:0,papel:'titular'}};
PMUI.ofDeForm=function(){
 var f=PMUI.nf,of={};
 if(f.tipo==='emp')of.emp={t:f.empT,taxa:+f.taxa||0,valorOpc:f.empT==='simples'?0:+f.opc||0,cond:+f.cond||0};
 else{of.valor=+f.valor||0;of.parc=+f.parc||1;of.troca=f.troca.slice();of.rev=+f.rev||0;if(f.bT&&+f.bV>0)of.bonus=[{t:f.bT,alvo:+f.bA||1,valor:+f.bV}];if(f.rec)of.rec={valor:+f.recV||0,ate:+f.recA||PM.ano()+3}}
 return of};

/* ===== componentes das telas de negociação ===== */
PMUI.rf=null;
PMUI.ctx=function(){return {nf:PMUI.nf,of:PMUI.of?PMUI.of.f:null,rn:PMUI.rf}};
PMUI.rw=function(l,v,c){return '<div class="rs-r'+(c?' '+c:'')+'"><span>'+l+'</span><b>'+v+'</b></div>'};
PMUI.mny=function(c,k,lab,sub,step,ref){
 var v=+PMUI.ctx()[c][k]||0,x=String(+(v/1000).toFixed(3));
 return '<div class="mny"><div class="mny-l">'+lab+(sub?'<small>'+sub+'</small>':'')+'</div><div class="mny-c">'+
  '<button type="button" class="mny-b" data-mb="'+c+':'+k+':-1:'+step+'" aria-label="Diminuir">−</button>'+
  '<div class="mny-v"><span>€</span><input type="number" min="0" step="0.01" inputmode="decimal" data-mi="'+c+':'+k+'" value="'+x+'"><em>mi</em></div>'+
  '<button type="button" class="mny-b" data-mb="'+c+':'+k+':1:'+step+'" aria-label="Aumentar">+</button></div>'+
  (ref?'<div class="mny-h">'+ref+'</div>':'')+'</div>'};
PMUI.cnt=function(c,k,lab,sub,step){
 var v=+PMUI.ctx()[c][k]||0;
 return '<div class="mny"><div class="mny-l">'+lab+(sub?'<small>'+sub+'</small>':'')+'</div><div class="mny-c"><button type="button" class="mny-b" data-nb="'+c+':'+k+':-1:'+step+'">−</button><div class="mny-v"><b class="mny-n">'+v+'</b></div><button type="button" class="mny-b" data-nb="'+c+':'+k+':1:'+step+'">+</button></div></div>'};
PMUI.sgm=function(c,k,opts){
 var cur=PMUI.ctx()[c][k];
 return '<div class="sgm">'+opts.map(function(o){return '<button type="button" class="'+(String(cur)===String(o[0])?'on':'')+'" data-sg="'+c+':'+k+':'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div>'};
PMUI.tgl=function(c,k,lab,sub){
 var on=PMUI.ctx()[c][k];
 return '<button type="button" class="tgl'+(on?' on':'')+'" data-tg="'+c+':'+k+'"><span>'+lab+(sub?'<small>'+sub+'</small>':'')+'</span><i></i></button>'};
PMUI.quick=function(c,k,arr){
 return '<div class="mny-q">'+arr.map(function(a){return '<button type="button" class="sec" data-mq="'+c+':'+k+':'+Math.round(a[1])+'">'+a[0]+'</button>'}).join('')+'</div>'};
PMUI.troca=function(c,k,ids,max){
 var sel=PMUI.ctx()[c][k],tot=sel.reduce(function(a,id){return a+PM.valor(id)},0);
 return '<div class="tpk-hd"><span>'+sel.length+' de '+max+' selecionados</span><b>'+(sel.length?fmtK(tot):'—')+'</b></div><div class="tpk-grid">'+ids.map(function(id){
  var b=PM.B.j[id],d=S.W.p[id],on=sel.indexOf(id)>=0,off=!on&&sel.length>=max;
  return '<button type="button" class="tpk'+(on?' on':'')+(off?' off':'')+'" data-tp="'+c+':'+k+':'+max+':'+id+'"><span class="pp g-'+grupoPos(b[JI.POSJ])+'">'+b[JI.POSJ]+'</span><span class="tpk-n"><b>'+esc(b[JI.NOME])+'</b><small>OVR '+d[DD.O]+' · '+d[DD.I]+' anos · '+fmtK(PM.valor(id))+'</small></span><span class="tpk-c"></span></button>'}).join('')+'</div>'};
PMUI.bindForm=function(e,redo){
 var F=PMUI.ctx(),q,i,pp=function(s){var p=s.split(':');return [F[p[0]],p[1],p]};
 q=e.querySelectorAll('[data-mb]');for(i=0;i<q.length;i++)q[i].onclick=function(){var g=pp(this.getAttribute('data-mb'));g[0][g[1]]=Math.max(0,Math.round((+g[0][g[1]]||0)+(+g[2][2])*(+g[2][3])));redo()};
 q=e.querySelectorAll('[data-nb]');for(i=0;i<q.length;i++)q[i].onclick=function(){var g=pp(this.getAttribute('data-nb'));g[0][g[1]]=Math.max(1,(+g[0][g[1]]||0)+(+g[2][2])*(+g[2][3]));redo()};
 q=e.querySelectorAll('[data-mi]');for(i=0;i<q.length;i++)q[i].onchange=function(){var g=pp(this.getAttribute('data-mi'));g[0][g[1]]=Math.max(0,Math.round((+this.value||0)*1000));redo()};
 q=e.querySelectorAll('[data-mq]');for(i=0;i<q.length;i++)q[i].onclick=function(){var g=pp(this.getAttribute('data-mq'));g[0][g[1]]=+g[2][2];redo()};
 q=e.querySelectorAll('[data-sg]');for(i=0;i<q.length;i++)q[i].onclick=function(){var g=pp(this.getAttribute('data-sg')),v=g[2][2];g[0][g[1]]=(v===''||isNaN(v))?v:+v;redo()};
 q=e.querySelectorAll('[data-tg]');for(i=0;i<q.length;i++)q[i].onclick=function(){var g=pp(this.getAttribute('data-tg'));g[0][g[1]]=!g[0][g[1]];redo()};
 q=e.querySelectorAll('[data-tp]');for(i=0;i<q.length;i++)q[i].onclick=function(){
  var p=this.getAttribute('data-tp').split(':'),f=F[p[0]],id=+p[3],k=f[p[1]].indexOf(id);
  if(k>=0)f[p[1]].splice(k,1);else{if(f[p[1]].length>=+p[2]){toast('No máximo '+p[2]+' jogadores na troca');return}f[p[1]].push(id)}
  redo()}};

PMUI.jogHdr=function(id){
 var b=PM.B.j[id],d=S.W.p[id],c=d[DD.C];
 return '<div class="card ph">'+PMUI.crest(c,46)+'<div style="flex:1;min-width:150px"><b style="font-size:17px">'+esc(b[JI.NOME])+'</b><div class="hint" style="margin:2px 0 0">'+(c>=0?esc(PM.B.cl[c][CI.NOME]):'Sem clube')+' · '+d[DD.I]+' anos · contrato até '+d[DD.F]+'</div></div>'+
  '<span class="pp g-'+grupoPos(b[JI.POSJ])+'">'+b[JI.POSJ]+'</span><div class="ov '+ovCls(d[DD.O])+'" style="text-align:center;font-weight:800;border-radius:8px;padding:6px 10px">'+d[DD.O]+'</div>'+
  '<div style="text-align:right"><small style="color:var(--mut);display:block;font-size:11px">Valor de mercado</small><b>'+fmtK(PM.valor(id))+'</b></div></div>'};
PMUI.totais=function(of){
 var cash=of.emp?(of.emp.taxa||0):(of.valor||0),trade=(of.troca||[]).reduce(function(a,id){return a+PM.valor(id)},0),up=PM.neg.upfront(of);
 return {cash:cash,trade:trade,total:cash+trade,up:up,fut:of.emp?0:Math.max(0,cash-up),
  bonus:(of.bonus||[]).reduce(function(a,x){return a+x.valor},0),opc:(of.emp&&of.emp.t!=='simples')?(of.emp.valorOpc||0):0}};
PMUI.resumoOferta=function(of,dir,titulo){
 var t=PMUI.totais(of),pay=dir<0,ntr=(of.troca||[]).length,sub=[],r='';
 if(t.cash)sub.push(fmtK(t.cash)+(of.emp?' de taxa':' em dinheiro'));
 if(ntr)sub.push(ntr+(ntr>1?' jogadores':' jogador')+' ('+fmtK(t.trade)+')');
 r+='<div class="card rs"><h2>'+titulo+'</h2><div class="rs-big"><small>'+(pay?'Você está oferecendo':'Você vai receber')+'</small><b>'+fmtK(t.total)+'</b><em>'+(sub.join(' + ')||'Defina um valor')+'</em></div>';
 r+=PMUI.rw(of.emp?'Taxa de empréstimo':'Dinheiro',fmtK(t.cash));
 if(ntr){r+=PMUI.rw(pay?'Saem do seu clube':'Chegam ao seu clube',fmtK(t.trade));
  r+='<div class="rs-n">'+of.troca.map(function(id){var b=PM.B.j[id];return '<div><span class="pp g-'+grupoPos(b[JI.POSJ])+'">'+b[JI.POSJ]+'</span>'+esc(b[JI.NOME])+'</div>'}).join('')+'</div>'}
 if(of.emp&&t.opc)r+=PMUI.rw(of.emp.t==='obrig'?'Compra obrigatória depois':'Opção de compra',fmtK(t.opc));
 if(!of.emp&&of.parc>1)r+=PMUI.rw('Parcelamento',of.parc+'x de '+fmtK(Math.round(of.valor/of.parc)));
 if(t.bonus)r+=PMUI.rw('Bônus por metas (se atingidos)',fmtK(t.bonus));
 if(of.rev)r+=PMUI.rw('Revenda para o vendedor',of.rev+'%');
 if(of.rec)r+=PMUI.rw('Recompra do vendedor',fmtK(of.rec.valor)+' até '+of.rec.ate);
 r+='<div class="rs-sep"></div>'+PMUI.rw(pay?'Pago agora':'Recebido agora',fmtK(t.up),pay?'neg':'pos');
 if(t.fut)r+=PMUI.rw(pay?'Pagamentos futuros':'Recebimentos futuros',fmtK(t.fut));
 var cx=S.caixa+(pay?-t.up:t.up);
 r+=PMUI.rw('Seu caixa depois',fmtK(cx),'tot'+(cx<0?' neg':''));
 if(pay&&cx<0)r+='<div class="rs-w">Caixa insuficiente para o pagamento inicial.</div>';
 return r+'</div>'};
PMUI.resumoContrato=function(f,id,up,atual){
 var sal=+f.sal||0,anos=+f.anos||1,lu=+f.luvas||0,tot=sal*anos+lu,fol=Math.round(PM.folhaMes()),ren=atual!==undefined,
  nova=fol+Math.round((sal-(ren?atual:0))/12),pc=Math.round((PM.folhaAno()+sal-(ren?atual:0))/PM.receitaAno()*100),lim=Math.round(PM.cfg.ffp_folha_receita*100),cx=S.caixa-lu-(up||0);
 var r='<div class="card rs"><h2>Resumo do contrato</h2><div class="rs-big"><small>Custo total do contrato</small><b>'+fmtK(tot)+'</b><em>'+fmtK(sal)+' por ano × '+anos+(anos>1?' anos':' ano')+' + '+fmtK(lu)+' de luvas</em></div>';
 r+=PMUI.rw('Salário anual',fmtK(sal));
 if(ren&&atual)r+=PMUI.rw('Variação sobre o atual',(sal>=atual?'+':'')+Math.round((sal/atual-1)*100)+'%',sal>atual?'neg':'');
 r+=PMUI.rw('Duração',anos+(anos>1?' anos':' ano'))+PMUI.rw('Luvas (pagas agora)',fmtK(lu),lu?'neg':'');
 if(up)r+=PMUI.rw('Transferência ao clube (paga agora)',fmtK(up),'neg');
 r+='<div class="rs-sep"></div>'+PMUI.rw('Folha mensal',fmtK(fol)+' → '+fmtK(nova))+PMUI.rw('Folha / receita',pc+'% (limite '+lim+'%)',pc>lim?'neg':'')+PMUI.rw('Caixa depois dos pagamentos',fmtK(cx),'tot'+(cx<0?' neg':''));
 if(pc>lim)r+='<div class="rs-w">Fair play financeiro: a folha passaria do limite.</div>';
 if(cx<0)r+='<div class="rs-w">Caixa insuficiente.</div>';
 return r+'</div>'};
PMUI.chat=function(n,t){
 var ativo=n.est==='aberta'||n.est==='jogador';
 return '<div class="card"><h2>'+(n.livre?'Agente livre':'Conversa com o clube')+'</h2><div class="fh">'+PMUI.crest(n.livre?-1:n.de,40)+'<div style="flex:1"><b>'+(n.livre?'Sem clube':esc(PM.B.cl[n.de][CI.NOME]))+'</b><div class="hint" style="margin:0">'+(ativo?'Clima da conversa':'Estado: '+n.est)+'</div></div>'+(ativo?'<span class="tns t'+t[1]+'">'+t[0]+'</span>':'')+'</div>'+
  (n.pend?'<p class="hint">Proposta enviada. A resposta chega em ~'+Math.max(0,n.pend.dia-S.hoje)+' dia(s): avance o calendário.</p>':'')+
  '<div style="max-height:240px;overflow:auto">'+n.msgs.slice(-8).map(function(m){return '<div class="bub '+m.q+'">'+esc(m.t)+'</div>'}).join('')+'</div></div>'+
  ((ativo||n.est==='congelada')?'<button class="sec full danger" data-pm="encerrar">Encerrar negociação</button>':'')};

/* ===== negociação do usuário (clube + jogador) ===== */
PMUI.neg=function(nid){
 var n=S.neg.filter(function(x){return x.id===nid})[0];if(!n)return;PMUI.nid=nid;
 if(!PMUI.nf||PMUI.nf.nid!==nid){PMUI.nf=PMUI.nfDef(n);PMUI.nf.nid=nid}
 var f=PMUI.nf,t=PM.tensao(n.pac),mv=PM.valor(n.j);
 if(n.fase!=='clube'&&!f.jInit){var d0=PM.neg.demanda(n.j);f.sal=d0.sal;f.anos=d0.anos;f.luvas=d0.luvas;f.jInit=1}
 var etapas=[['clube','Proposta ao clube'],['jogador','Acordo com o jogador'],['medico','Exame médico'],['fim','Registro']];if(n.livre)etapas.shift();
 var ordem={clube:0,jogador:1,medico:2},cur=(n.est==='concluida'||n.est==='espera')?3:(ordem[n.fase]||0),off=n.livre?1:0,ativo=(n.est==='aberta'||n.est==='jogador')&&!n.pend;
 var h='<div class="picker-head"><h2>Negociação</h2><button class="sec" data-pm="fechar">← Voltar</button></div><div class="steps">'+etapas.map(function(e,i){var k=i+off;return '<span class="'+(k===cur?'on':k<cur?'ok':'')+'">'+e[1]+'</span>'}).join('')+'</div>'+PMUI.jogHdr(n.j)+'<div class="negg"><div>',right='';
 if(n.fase==='clube'){
  var of=PMUI.ofDeForm(),tt=PMUI.totais(of),stp=Math.max(10,Math.round((n.ask||mv)*.04/10)*10),cl=esc(PM.B.cl[n.de][CI.NOME]);
  h+='<div class="card"><h2>Tipo de negócio</h2>'+PMUI.sgm('nf','tipo',[['compra','Compra definitiva'],['emp','Empréstimo']])+'</div>';
  if(f.tipo==='compra'){
   h+='<div class="card"><h2>Dinheiro</h2>'+PMUI.mny('nf','valor','Quanto você paga em dinheiro','Pago ao '+cl,stp,'Valor de mercado: '+fmtK(mv))+PMUI.quick('nf','valor',[['80% do valor',mv*.8],['Valor de mercado',mv],['120% do valor',mv*1.2]])+
    '<div class="grp">Como pagar</div>'+PMUI.sgm('nf','parc',[[1,'À vista'],[2,'2 anos'],[3,'3 anos'],[4,'4 anos'],[5,'5 anos']])+
    '<p class="hint">'+(f.parc>1?'Primeira parcela agora: '+fmtK(tt.up)+'. Depois, '+(f.parc-1)+' parcela(s) anuais de '+fmtK(Math.round(f.valor/f.parc))+'.':'Pagamento único na assinatura.')+'</p></div>'+
    '<div class="card"><h2>Jogadores na troca <small class="opc">opcional</small></h2><p class="hint" style="margin-top:-6px">Os jogadores escolhidos saem do seu clube e entram no valor da proposta.</p>'+
    PMUI.troca('nf','troca',PM.by[S.wi].slice().sort(function(a,c){return S.W.p[c][DD.O]-S.W.p[a][DD.O]}),3)+'</div>'+
    '<div class="card">'+PMUI.tgl('nf','ex','Cláusulas extras','Bônus por metas, revenda e recompra');
   if(f.ex){
    h+='<div class="grp">Bônus por metas</div>'+PMUI.sgm('nf','bT',[['','Nenhum'],['jogos','Por jogos'],['gols','Por gols']]);
    if(f.bT)h+=PMUI.mny('nf','bV','Valor do bônus','Pago ao clube se o jogador atingir a meta no 1º ano',25)+PMUI.cnt('nf','bA','Meta de '+(f.bT==='jogos'?'jogos':'gols'),'Quantidade para liberar o bônus',f.bT==='jogos'?5:1);
    h+='<div class="grp">Revenda para o clube vendedor</div>'+PMUI.sgm('nf','rev',[[0,'Nenhuma'],[5,'5%'],[10,'10%'],[15,'15%'],[20,'20%']])+
     '<div class="grp">Recompra</div>'+PMUI.tgl('nf','rec','Dar opção de recompra ao vendedor');
    if(f.rec)h+=PMUI.mny('nf','recV','Valor da recompra','',stp)+PMUI.cnt('nf','recA','Válida até o ano','',1)}
   h+='</div>';
  }else{
   h+='<div class="card"><h2>Termos do empréstimo</h2>'+PMUI.sgm('nf','empT',[['simples','Simples'],['opcao','Com opção de compra'],['obrig','Com obrigação']])+
    PMUI.mny('nf','taxa','Taxa de empréstimo','Paga agora ao '+cl,stp)+
    (f.empT!=='simples'?PMUI.mny('nf','opc','Valor da compra definitiva','Pago depois, se a compra acontecer',stp):'')+
    (f.empT==='obrig'?PMUI.cnt('nf','cond','Compra obrigatória após','Número de jogos do atleta',5):'')+'</div>'}
  if(ativo)h+='<div class="stk stk2"><div class="stk-t"><small>'+(f.tipo==='emp'?'Taxa de empréstimo':'Você oferece')+'</small><b>'+fmtK(tt.total)+'</b></div><button data-pm="oferta">Enviar proposta</button></div>';
  right=PMUI.resumoOferta(of,-1,'Resumo da oferta');
 }else if(n.fase==='jogador'){
  var dm=PM.neg.demanda(n.j),stp2=Math.max(10,Math.round(dm.sal*.03/10)*10),up=(n.of&&!n.livre)?PM.neg.upfront(n.of):0;
  h+='<div class="card"><h2>Salário</h2>'+PMUI.mny('nf','sal','Salário por ano','Pago ao jogador',stp2,'Referência do agente: '+fmtK(dm.sal)+'/ano · comissão de '+dm.com+'%')+PMUI.quick('nf','sal',[['Referência do agente',dm.sal]])+'</div>'+
   '<div class="card"><h2>Duração</h2>'+PMUI.sgm('nf','anos',[[1,'1 ano'],[2,'2 anos'],[3,'3 anos'],[4,'4 anos'],[5,'5 anos']])+'</div>'+
   '<div class="card"><h2>Luvas</h2>'+PMUI.mny('nf','luvas','Luvas (bônus de assinatura)','Pagas uma única vez, na assinatura',25,'Referência: '+fmtK(dm.luvas))+'</div>'+
   '<div class="card"><h2>Papel prometido</h2>'+PMUI.sgm('nf','papel',[['titular','Titular'],['rotacao','Rotação'],['reserva','Reserva']])+'<p class="hint">Prometer titularidade ajuda a convencer, mas se ele não jogar a moral cai.</p></div>';
  if(ativo)h+='<div class="stk stk2"><div class="stk-t"><small>Custo total do contrato</small><b>'+fmtK((+f.sal||0)*(+f.anos||1)+(+f.luvas||0))+'</b></div><button data-pm="contrato">Enviar contrato</button></div>';
  right=PMUI.resumoContrato(f,n.j,up);
 }else{
  h+='<div class="card"><h2>'+(n.est==='concluida'?'Negócio concluído':n.est==='espera'?'Aguardando a próxima janela':n.fase==='medico'?'Exame médico':'Situação')+'</h2><p class="hint">'+(n.est==='espera'?'O acordo está fechado. O jogador se apresenta na abertura da próxima janela.':n.pend?'Aguarde: a resposta chega com o passar dos dias.':'')+'</p></div>'}
 h+='</div><div class="rs-st">'+right+PMUI.chat(n,t)+'</div></div>';
 PMUI.bindForm(PMUI.abre('neg',h),function(){PMUI.neg(PMUI.nid)})};

/* ===== contraproposta a uma oferta recebida ===== */
PMUI.ofDetalhe=function(oid){
 var o=S.ofe.filter(function(x){return x.id===oid})[0];if(!o)return;
 PM.ofertas.normal(o);PMUI.oid=oid;
 if(!PMUI.of||PMUI.of.id!==oid)PMUI.of={id:oid,f:PMUI.ofDef(o)};
 var f=PMUI.of.f,val=PM.valor(o.j),t=PM.tensao(o.pac),ativo=o.est==='aberta'&&!o.pend,nome=esc(PM.B.cl[o.de][CI.NOME]),emp=o.t==='emp',cp=PMUI.mkOf(f,o),tt=PMUI.totais(cp),stp=Math.max(10,Math.round(val*.04/10)*10);
 var h='<div class="picker-head"><h2>Proposta recebida</h2><button class="sec" data-pm="fechar">← Voltar</button></div>'+PMUI.jogHdr(o.j)+'<div class="negg"><div>';
 h+='<div class="card"><h2>Sua contraproposta</h2><p class="hint" style="margin-top:-6px">Defina o que você quer receber do '+nome+'.</p>';
 if(emp){
  h+=PMUI.sgm('of','empT',[['simples','Simples'],['opcao','Com opção de compra'],['obrig','Com obrigação']])+PMUI.mny('of','taxa','Taxa de empréstimo','Paga a você pelo '+nome,stp)+
   (f.empT!=='simples'?PMUI.mny('of','opc','Valor da compra definitiva','',stp):'')+(f.empT==='obrig'?PMUI.cnt('of','cond','Compra obrigatória após','Número de jogos do atleta',5):'');
 }else{
  h+=PMUI.mny('of','valor','Valor que você pede','Em dinheiro, pago pelo '+nome,stp,'Valor de mercado: '+fmtK(val)+' · proposta atual: '+fmtK(o.of.valor||0))+
   PMUI.quick('of','valor',[['Proposta atual',o.of.valor||0],['Valor de mercado',val],['120% do valor',val*1.2]])+
   '<div class="grp">Como receber</div>'+PMUI.sgm('of','parc',[[1,'À vista'],[2,'2 anos'],[3,'3 anos'],[4,'4 anos'],[5,'5 anos']]);
 }
 h+='</div>';
 if(!emp){
  h+='<div class="card"><h2>Jogadores que você quer receber <small class="opc">opcional</small></h2>'+PMUI.troca('of','troca',PM.by[o.de].slice().sort(function(a,c){return S.W.p[c][DD.O]-S.W.p[a][DD.O]}).slice(0,16),2)+'</div>'+
   '<div class="card">'+PMUI.tgl('of','ex','Cláusulas extras','Bônus por metas e % de revenda');
  if(f.ex){
   h+='<div class="grp">Bônus por metas</div>'+PMUI.sgm('of','bT',[['','Nenhum'],['jogos','Por jogos'],['gols','Por gols']]);
   if(f.bT)h+=PMUI.mny('of','bV','Valor do bônus','Pago a você se a meta for atingida',25)+PMUI.cnt('of','bA','Meta de '+(f.bT==='jogos'?'jogos':'gols'),'',f.bT==='jogos'?5:1);
   h+='<div class="grp">Revenda para o seu clube</div>'+PMUI.sgm('of','rev',[[0,'Nenhuma'],[5,'5%'],[10,'10%'],[15,'15%'],[20,'20%']])}
  h+='</div>'}
 if(ativo)h+='<div class="stk stk2"><div class="stk-t"><small>Você pede</small><b>'+fmtK(tt.total)+'</b></div><button data-pm="ofcontra">Enviar contraproposta</button></div>';
 h+='</div><div class="rs-st">'+PMUI.resumoOferta(o.of,1,'Proposta atual do '+nome)+
  (ativo?'<div class="mctl" style="margin-bottom:14px"><button data-pm="ofaceitar">Aceitar a proposta atual</button><button class="sec danger" data-pm="ofrecusar">Recusar</button></div>':'')+
  PMUI.resumoOferta(cp,1,'Sua contraproposta')+
  '<div class="card"><h2>Conversa</h2><div class="fh">'+PMUI.crest(o.de,40)+'<div style="flex:1"><b>'+nome+'</b><div class="hint" style="margin:0">'+(o.est==='aberta'?'Clima da conversa':'Estado: '+o.est)+'</div></div>'+(o.est==='aberta'?'<span class="tns t'+t[1]+'">'+t[0]+'</span>':'')+'</div>'+
  (o.pend?'<p class="hint">Aguardando resposta: chega em '+Math.max(0,o.pend.dia-S.hoje)+' dia(s).</p>':'')+
  '<div style="max-height:220px;overflow:auto">'+(o.msgs.length?o.msgs.slice(-8).map(function(m){return '<div class="bub '+m.q+'">'+esc(m.t)+'</div>'}).join(''):'<p class="hint">Sem mensagens ainda.</p>')+'</div></div></div></div>';
 PMUI.bindForm(PMUI.abre('ofe',h),function(){PMUI.ofDetalhe(PMUI.oid)})};

/* ===== renovação ===== */
PMUI.renovar=function(id){
 var d=S.W.p[id],p=PM.renov.pedido(id);
 if(!PMUI.rf||PMUI.rf.id!==id)PMUI.rf={id:id,sal:p.sal,anos:p.anos,luvas:p.luvas};
 var f=PMUI.rf,stp=Math.max(10,Math.round(p.sal*.03/10)*10);
 var h='<div class="picker-head"><h2>Renovar contrato</h2><button class="sec" data-pm="fechar">← Voltar</button></div>'+PMUI.jogHdr(id)+'<div class="negg"><div>'+
  '<div class="card"><h2>Salário</h2><div class="chips"><span class="chip">Atual: '+fmtK(d[DD.S])+'/ano</span><span class="chip">Termina em '+d[DD.F]+' ('+PM.mesesRest(id)+' meses)</span></div>'+
  PMUI.mny('rn','sal','Novo salário por ano','Pago ao jogador',stp,'Pedido do jogador: '+fmtK(p.sal))+PMUI.quick('rn','sal',[['Manter o atual',d[DD.S]],['Pedido do jogador',p.sal]])+'</div>'+
  '<div class="card"><h2>Duração</h2>'+PMUI.sgm('rn','anos',[[1,'1 ano'],[2,'2 anos'],[3,'3 anos'],[4,'4 anos'],[5,'5 anos']])+'</div>'+
  '<div class="card"><h2>Luvas</h2>'+PMUI.mny('rn','luvas','Luvas de renovação','Pagas uma única vez',25,'Referência: '+fmtK(p.luvas))+'</div>'+
  '<div class="stk stk2"><div class="stk-t"><small>Custo total do contrato</small><b>'+fmtK((+f.sal||0)*(+f.anos||1)+(+f.luvas||0))+'</b></div><button data-pm="renTentar" data-id="'+id+'">Propor renovação</button></div></div>'+
  '<div class="rs-st">'+PMUI.resumoContrato(f,id,0,d[DD.S])+'<div class="card"><p class="hint" style="margin:0">Se o jogador recusar, ele pode esperar o contrato acabar e sair de graça.</p></div></div></div>';
 PMUI.bindForm(PMUI.abre('ren',h),function(){PMUI.renovar(id)})};
PMUI.click=function(ev){
 var t=ev.target.closest?ev.target.closest('[data-pm],[data-ficha],[data-neg]'):null;if(!t)return;
 var a=t.getAttribute('data-pm'),v=t.getAttribute('data-v'),id=+t.getAttribute('data-id');
 if(a&&PMUI.click2(a,v,id,t))return;
 if(t.hasAttribute('data-ficha')&&!a){PMUI.ficha(+t.getAttribute('data-ficha'));return}
 if(t.hasAttribute('data-neg')&&!a){PMUI.neg(+t.getAttribute('data-neg'));return}
 var f=PMUI.nf,n=S.neg.filter(function(x){return x.id===PMUI.nid})[0],r;
 if(a==='irmercado'){ABA='mercado';render()}
 else if(a==='sub'){PMUI.sub=v;render()}
 else if(a==='busca'){PMUI.res=PMUI.buscar();render()}
 else if(a==='limpa'){for(var k in PMUI.f)PMUI.f[k]='';PMUI.res=[];render()}
 else if(a==='ord'){if(PMUI.ord===v)PMUI.dir*=-1;else{PMUI.ord=v;PMUI.dir=v==='n'?1:-1}PMUI.res=PMUI.buscar();render()}
 else if(a==='fechar'){PMUI.fechaTudo();render()}
 else if(a==='favorito'){PMUI.fav(id);PMUI.ficha(id)}
 else if(a==='negociar'){r=PM.neg.abrir(id);if(!r.ok){toast(r.m);return}salvar();PMUI.nf=null;PMUI.neg(r.n.id)}
 else if(a==='pre'){r=PM.preAssinar(id);if(!r.ok){toast(r.m);return}PMUI.nf=null;PMUI.neg(r.n.id)}
 else if(a==='nf'){f[t.getAttribute('data-k')]=v;PMUI.neg(PMUI.nid)}
 else if(a==='valor'){f.valor=Math.max(0,Math.round(f.valor+(+v)*n.ask*.05));PMUI.neg(PMUI.nid)}
 else if(a==='oferta'){r=PM.neg.oferta(n,PMUI.ofDeForm());if(!r.ok){toast(r.m);PMUI.neg(PMUI.nid)}else{salvar();PMUI.fechaTudo();render();toast('Proposta enviada. Avance o calendário no Painel para receber a resposta do clube.')}}
 else if(a==='contrato'){r=PM.neg.propJogador(n,{sal:+f.sal,anos:+f.anos,luvas:+f.luvas,papel:f.papel});if(!r.ok){toast(r.m);PMUI.neg(PMUI.nid)}else{salvar();PMUI.fechaTudo();render();toast('Proposta de contrato enviada. Avance o calendário para receber a resposta.')}}
 else if(a==='encerrar'){if(confirm('Encerrar esta negociação? Abandonar uma negociação adiantada prejudica sua reputação no mercado.')){PM.neg.encerrar(n);salvar();PMUI.fechaTudo();render()}}
 else if(a==='passar'){PMUI.fechaTudo();ABA='painel';render();avancar()}
 else if(a==='ofe'){var o=S.ofe.filter(function(x){return x.id===id})[0];var ev2=PM.ofertas.responder(o,v);ev2.forEach(function(e){toast(e.t)});salvar();render()}
 else if(a==='renovar'){PMUI.renovar(id)}
 else if(a==='renTentar'){var pr={sal:+PMUI.rf.sal,anos:+PMUI.rf.anos,luvas:+PMUI.rf.luvas};r=PM.renov.tentar(id,pr);toast(r.m);if(r.ok){PMUI.rf=null;salvar();PMUI.fecha('ren');PMUI.fecha('ficha');render()}else PMUI.renovar(id)}
 else if(a==='exOp'){var op=S.pendOp.filter(function(x){return x.jid===id})[0];if(S.caixa>=op.valor){S.caixa-=op.valor;PM.moverJog(id,S.wi);S.W.p[id][DD.F]=PM.ano()+3;S.pendOp=S.pendOp.filter(function(x){return x!==op});PM.sync();salvar();toast('Opção exercida')}else toast('Caixa insuficiente');render()}
 else if(a==='liberaOp'){var op2=S.pendOp.filter(function(x){return x.jid===id})[0];PM.moverJog(id,op2.orig);S.pendOp=S.pendOp.filter(function(x){return x!==op2});salvar();render()}
 else if(a==='preAss'){r=PM.preAssinar(id);if(!r.ok){toast(r.m);return}PMUI.nf=null;PMUI.neg(r.n.id)}
};

/* ---------- aba CONTRATOS ---------- */
PMUI.pContratos=function(){
 var ids=PM.by[S.wi].slice().sort(function(a,b){return PM.mesesRest(a)-PM.mesesRest(b)});
 var f=S.fin,fol=PM.folhaAno(),rec=PM.receitaAno();
 var h=PMUI.banner()+'<div class="tiles">'+tile('💰','Folha anual',fmtK(fol),Math.round(fol/rec*100)+'% da receita (limite '+Math.round(PM.cfg.ffp_folha_receita*100)+'%)',fol/rec>PM.cfg.ffp_folha_receita?'bad':'')+tile('⚠','Dívida salarial',fmtK(f.div),f.div?f.mes+' mês(es)':'Em dia',f.div?'bad':'ok')+tile('🎯','Confiança',Math.round(f.conf)+'/100','Teto de moral '+PM.moralCap(),'')+'</div>';
 if(S.pendOp.length)h+='<div class="card"><h2>Opções de compra pendentes</h2>'+S.pendOp.map(function(o){return '<div class="prox"><div><b>'+esc(PM.B.j[o.jid][JI.NOME])+'</b><small>Comprar por '+fmtK(o.valor)+'</small></div><div class="mctl"><button data-pm="exOp" data-id="'+o.jid+'">Exercer</button><button class="sec" data-pm="liberaOp" data-id="'+o.jid+'">Devolver</button></div></div>'}).join('')+'</div>';
 h+='<div class="card"><h2>Contratos do elenco</h2>'+ids.map(function(id){var b=PM.B.j[id],d=S.W.p[id],m=PM.mesesRest(id),c=m<=6?'bad':m<=12?'warn':m<=18?'':'good',alt=d[DD.ST]===1?' · recusou renovar':d[DD.ST]===2?' · pré-contrato':d[DD.EMP]>=0?' · emprestado':'';
  return '<div class="cv" data-ficha="'+id+'" style="cursor:pointer"><div class="pp g-'+grupoPos(b[JI.POSJ])+'" style="border-radius:8px;text-align:center;font-size:11px;font-weight:700;padding:5px 0">'+b[JI.POSJ]+'</div><div class="pn"><b style="display:block;font-size:14px">'+esc(b[JI.NOME])+'</b><small style="color:var(--mut)">'+d[DD.I]+' anos · OVR '+d[DD.O]+alt+'</small></div><div class="xc" style="text-align:right;font-size:13px">'+fmtK(d[DD.S])+'</div><div style="text-align:center;font-size:13px">até '+d[DD.F]+'</div><span class="chip '+c+'" style="text-align:center">'+m+' meses</span></div>'}).join('')+'</div>';
 var pre=PM.preAbertos().sort(function(a,b){return S.W.p[b][DD.O]-S.W.p[a][DD.O]}).slice(0,15);
 h+='<div class="card"><h2>Pré-contratos disponíveis (≤ 6 meses)</h2><p class="hint">Jogadores de outros clubes que podem assinar de graça e chegam ao fim do contrato deles.</p>'+pre.map(function(id){return PMUI.linha(id,PM.mesesRest(id)+' meses')}).join('')+'</div>';
 return h};
PMUI.bind=function(){var d=$('dash');if(d&&!d.pmb){d.pmb=1;d.addEventListener('click',PMUI.click);d.addEventListener('change',function(e){var k=e.target.getAttribute&&e.target.getAttribute('data-f');if(k){PMUI.f[k]=e.target.value}})}
 ['ficha','neg','ren','ofe'].forEach(function(n){var o=PMUI.ov(n);if(!o.pmb){o.pmb=1;o.addEventListener('click',PMUI.click)}});
 if(document.getElementById('pm-ficha').className.indexOf('on')>=0&&PMUI.fid){}};
PMUI.resumoTemp=function(o){
 var nm=function(l){return l.map(function(id){return PM.B.j[id][JI.NOME]}).join(', ')};var p=[];
 if(o.saem.length)p.push('Saíram (fim de contrato): '+nm(o.saem)+'.');if(o.chegam.length)p.push('Chegaram por pré-contrato: '+nm(o.chegam)+'.');
 if(o.aposent.length)p.push('Aposentados: '+nm(o.aposent)+'.');if(o.base)p.push('Subiu da base: '+PM.B.j[o.base][JI.NOME]+' ('+PM.d(o.base)[DD.I]+' anos, OVR '+PM.d(o.base)[DD.O]+').');
 var up=o.evol.filter(function(x){return x[1]>0}).sort(function(a,b){return b[1]-a[1]}).slice(0,3).map(function(x){return PM.B.j[x[0]][JI.NOME]+' +'+x[1]}),dn=o.evol.filter(function(x){return x[1]<0}).sort(function(a,b){return a[1]-b[1]}).slice(0,3).map(function(x){return PM.B.j[x[0]][JI.NOME]+' '+x[1]});
 if(up.length)p.push('Evoluíram: '+up.join(', ')+'.');if(dn.length)p.push('Perderam overall: '+dn.join(', ')+'.');
 o.bon.concat(o.emp).concat(o.mens).forEach(function(x){p.push(x)});
 modal('Virada de temporada',p.join(' ')||'Sem mudanças no elenco.',[{l:'Continuar',f:function(){}}])};
/* ---------- aba Mercado: propostas recebidas ---------- */
PMUI.pOfertas=function(){
 var os=S.ofe.filter(function(o){return o.est==='aberta'||o.est==='espera'||o.est==='fechando'});
 os.forEach(PM.ofertas.normal);
 var h='<div class="card"><h2>Ofertas recebidas</h2>';
 if(!os.length)return h+'<p class="hint">Nenhuma oferta no momento. Elas chegam durante as janelas; coloque jogadores nas listas para atrair mais propostas.</p></div>';
 os.slice().reverse().forEach(function(o){
  var b=PM.B.j[o.j];
  h+='<div class="prox"><div><b>'+esc(PM.B.cl[o.de][CI.NOME])+(o.t==='emp'?' quer o empréstimo de ':' quer ')+esc(b[JI.NOME])+(o.lst?' <span class="chip good">Na sua lista</span>':'')+'</b><small>'+esc(PM.neg.resumo(o.of).replace('Proposta: ',''))+' · valor de mercado '+fmtK(PM.valor(o.j))+
   (o.est==='fechando'?' · acordo aceito, resposta em '+Math.max(0,o.pend.dia-S.hoje)+' dia(s)':o.est==='espera'?' · acordo fechado, sai na próxima janela':o.pend?' · aguardando resposta ('+Math.max(0,o.pend.dia-S.hoje)+' dia(s))':' · expira em '+Math.max(0,o.exp-S.hoje)+' dias')+'</small></div>'+
   (o.est==='aberta'?'<div class="mctl"><button data-pm="ofver" data-id="'+o.id+'">Negociar</button>'+(o.pend?'':'<button class="sec" data-pm="ofe" data-v="aceitar" data-id="'+o.id+'">Aceitar</button><button class="sec" data-pm="ofe" data-v="recusar" data-id="'+o.id+'">Recusar</button>')+'</div>':'')+'</div>'});
 return h+'</div>'};

/* ---------- aba Mercado: minhas listas (transferência e empréstimo) ---------- */
PMUI.linhaMeu=function(id,btn){
 var b=PM.B.j[id],d=S.W.p[id],n=S.ofe.filter(function(o){return o.j===id&&o.est==='aberta'}).length;
 return '<div class="mk" style="grid-template-columns:40px minmax(0,1fr) 42px 80px auto" data-ficha="'+id+'"><div class="pp g-'+grupoPos(b[JI.POSJ])+'" style="border-radius:8px;text-align:center;font-size:11px;font-weight:700;padding:5px 0">'+b[JI.POSJ]+'</div><div class="pn"><b>'+esc(b[JI.NOME])+'</b><small>'+d[DD.I]+' anos · contrato até '+d[DD.F]+(n?' · '+n+' proposta(s)':'')+'</small></div><div class="ov '+ovCls(d[DD.O])+'" style="text-align:center;font-weight:800;border-radius:8px;padding:5px 0">'+d[DD.O]+'</div><div style="text-align:right;font-size:13px">'+fmtK(PM.valor(id))+'</div>'+btn+'</div>'};
PMUI.pLista=function(sub){
 var k=(sub==='lt'||sub==='t')?'t':'e';
 var L=PM.lista(),meu=PM.by[S.wi],lst=(k==='t'?L.t:L.e).filter(function(id){return meu.indexOf(id)>=0}),tit=k==='t'?'Lista de transferências':'Lista de empréstimo';
 var h='<div class="card"><h2>'+tit+' ('+lst.length+')</h2><p class="hint">'+(k==='t'?'Jogadores listados atraem mais propostas de compra e o clube comprador aceita pagar mais.':'Jogadores listados atraem propostas de empréstimo (bom para reservas e jovens que precisam de minutos).')+' As propostas chegam durante as janelas, na aba Ofertas.</p>';
 h+=lst.length?lst.map(function(id){return PMUI.linhaMeu(id,'<button class="sec" data-pm="deslistar" data-id="'+id+'">Remover</button>')}).join(''):'<p class="hint">Nenhum jogador nesta lista.</p>';
 h+='</div>';
 var outros=meu.filter(function(id){var d=S.W.p[id];return lst.indexOf(id)<0&&d[DD.EMP]<0&&!PM.recente(id)}).sort(function(a,b){return S.W.p[b][DD.O]-S.W.p[a][DD.O]});
 h+='<div class="card"><h2>Adicionar jogador à lista</h2>'+(outros.length?outros.map(function(id){return PMUI.linhaMeu(id,'<button data-pm="listar" data-v="'+k+'" data-id="'+id+'">Listar</button>')}).join(''):'<p class="hint">Nenhum jogador disponível.</p>')+'</div>';
 return h};

/* ---------- tela de negociação de uma proposta recebida ---------- */
PMUI.oid=0;PMUI.of=null;
PMUI.ofDef=function(o){
 var of=o.of,val=PM.valor(o.j);
 if(o.t==='emp'){var e=of.emp;return {valor:0,parc:1,troca:[],bT:'',bA:10,bV:0,rev:0,empT:e.t,taxa:Math.round(e.taxa*1.15),opc:e.valorOpc||Math.round(val),cond:e.cond||20}}
 return {valor:Math.round((of.valor||val)*1.12/10)*10,parc:1,troca:[],bT:'',bA:10,bV:0,rev:0,empT:'simples',taxa:0,opc:0,cond:20}};
PMUI.mkOf=function(f,o){
 if(o.t==='emp')return {emp:{t:f.empT,taxa:+f.taxa||0,valorOpc:f.empT==='simples'?0:+f.opc||0,cond:+f.cond||0}};
 var of={valor:+f.valor||0,parc:+f.parc||1,troca:f.troca.slice(),rev:+f.rev||0};
 if(f.bT&&+f.bV>0)of.bonus=[{t:f.bT,alvo:+f.bA||1,valor:+f.bV}];
 return of};
PMUI.getOf=function(){return S.ofe.filter(function(x){return x.id===PMUI.oid})[0]};

PMUI.refresca=function(id){render();var f=document.getElementById('pm-ficha');if(f&&f.className.indexOf('on')>=0&&PMUI.fid===id)PMUI.ficha(id)};

/* ações novas dos botões (chamado de dentro de PMUI.click; devolve true se tratou) */
PMUI.click2=function(a,v,id,t){
 var r,o,ev2;
 if(a==='listar'){
  var atual=PM.listaUser(id);
  if((v==='t'&&atual===1)||(v==='e'&&atual===2)){PM.deslistar(id);toast('Jogador removido da lista.')}
  else{r=PM.listar(id,v);toast(r.m);if(!r.ok)return true}
  salvar();PMUI.refresca(id);return true}
 if(a==='deslistar'){PM.deslistar(id);salvar();toast('Jogador removido da lista.');render();return true}
 if(a==='ofver'){PMUI.ofDetalhe(id);return true}
 if(a==='ofvalor'){o=PMUI.getOf();if(!o)return true;PMUI.of.f.valor=Math.max(0,Math.round(PMUI.of.f.valor+(+v)*PM.valor(o.j)*.05));PMUI.ofDetalhe(PMUI.oid);return true}
 if(a==='ofcontra'){o=PMUI.getOf();if(!o)return true;r=PM.ofertas.contra(o,PMUI.mkOf(PMUI.of.f,o));if(!r.ok){toast(r.m);PMUI.ofDetalhe(PMUI.oid)}else{salvar();PMUI.fecha('ofe');render();toast('Contraproposta enviada. Avance o calendário para receber a resposta.')}return true}
 if(a==='ofaceitar'||a==='ofrecusar'){o=PMUI.getOf();if(!o)return true;ev2=PM.ofertas.responder(o,a==='ofaceitar'?'aceitar':'recusar');ev2.forEach(function(e){toast(e.t)});salvar();PMUI.fecha('ofe');render();return true}
 if(a==='ofpassar'){PMUI.fechaTudo();ABA='painel';render();avancar();return true}
 return false};

/* ---------- avisos de proposta nova (pausam o calendário) ---------- */
PMUI.avisoOfertas=function(ofs){
 var go=function(id){ABA='mercado';PMUI.sub='ofe';render();if(id)PMUI.ofDetalhe(id)};
 if(ofs.length===1){modal('🔁 Nova proposta',ofs[0].t+'.',[{l:'Ver proposta',f:function(){go(ofs[0].id)}},{l:'Fechar',f:function(){}}]);return}
 var lista=ofs.slice(0,3).map(function(x){return x.t}).join(' · ')+(ofs.length>3?' · e mais '+(ofs.length-3)+'.':'.');
 modal('🔁 Novas propostas','Você recebeu '+ofs.length+' propostas novas: '+lista,[{l:'Ver propostas',f:function(){go(0)}},{l:'Fechar',f:function(){}}])};

/* resposta de clube/jogador a uma proposta enviada por você (pausa o calendário) */
PMUI.avisoResp=function(l){
 var go=function(x){ABA='mercado';PMUI.sub=x.nid?'neg':'ofe';render();if(x.nid)PMUI.neg(x.nid);else PMUI.ofDetalhe(x.oid)};
 if(l.length===1)modal('🔁 Resposta recebida',l[0].t+'.',[{l:l[0].nid?'Abrir negociação':'Ver proposta',f:function(){go(l[0])}},{l:'Depois',f:function(){}}]);
 else modal('🔁 Respostas recebidas',l.slice(0,3).map(function(x){return x.t}).join(' · ')+(l.length>3?' · e mais '+(l.length-3)+'.':'.'),[{l:'Ver negociações',f:function(){go(l[0])}},{l:'Depois',f:function(){}}])};

/* ---------- animação da folha salarial (dia 1 de cada mês) ---------- */
PMUI.animFolha=function(d,fila){
 ANIM=true;
 var a=$('anim'),dev=d.atraso>0,k=0,i,coins='',
  mes=new Date(PM.msHoje()).toLocaleDateString('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'}),
  outros=Math.round(d.depois-(d.antes+d.fix-d.opx-d.pago));
 mes=mes.charAt(0).toUpperCase()+mes.slice(1);
 for(i=0;i<14;i++)coins+='<span class="coin" style="left:'+ri(4,92)+'%;animation-delay:'+(Math.random()*1.6+.8).toFixed(2)+'s">🪙</span>';
 var row=function(l,v,c){k++;return '<div class="fol-row '+(c||'')+'" style="animation-delay:'+(k*.45).toFixed(2)+'s"><span>'+l+'</span><b>'+v+'</b></div>'};
 var rows=row('Caixa anterior',fmtK(d.antes))+row('Receita fixa (TV + comercial)','+ '+fmtK(d.fix),'up')+row('Custos operacionais','− '+fmtK(d.opx),'dn');
 if(outros)rows+=row('Parcelas e outros',(outros>0?'+ ':'− ')+fmtK(Math.abs(outros)),outros>0?'up':'dn');
 rows+=row('Folha salarial'+(d.divAnt>0?' (com atrasados)':''),'− '+fmtK(d.pago),'dn');
 if(dev)rows+=row('Salários em atraso',fmtK(d.atraso),'dn');
 var st=dev?
  '<div class="fol-st bad" style="animation-delay:'+((k+2)*.45+1.2).toFixed(2)+'s">⚠ Salários atrasados: '+fmtK(d.atraso)+' em aberto ('+d.mes+(d.mes>1?' meses seguidos':' mês')+')<div class="fol-warn">Isso afeta o desempenho do time: a moral do elenco cai, a confiança da diretoria diminui e os jogadores rendem menos em campo. Gere receita (vendas, bilheteria) para quitar a dívida.</div></div>':
  '<div class="fol-st ok" style="animation-delay:'+((k+2)*.45+1.2).toFixed(2)+'s">✔ Salários em dia</div>';
 a.innerHTML=mono(coins+'<div class="fol-box'+(dev?' dev':'')+'"><small>Folha de pagamento · '+esc(mes)+'</small><div style="margin-top:10px">'+rows+'</div><div class="fol-tot"><small>Caixa atual</small><div class="anim-num" id="fol-n" style="'+(dev||d.depois<0?'color:var(--bad)':'')+'">'+fmtK(d.antes)+'</div></div>'+st+'<button class="full" id="fol-ok" style="margin-top:14px">Continuar</button></div>');
 a.className='on';
 var t0=null,delay=(k+1)*450,dur=1600;
 function passo(ts){if(!t0)t0=ts;var p=Math.max(0,Math.min(1,(ts-t0-delay)/dur)),e=1-Math.pow(1-p,3),el=$('fol-n');if(!el)return;el.textContent=fmtK(d.antes+(d.depois-d.antes)*e);if(p<1)requestAnimationFrame(passo)}
 requestAnimationFrame(passo);
 $('fol-ok').onclick=function(){a.className='';a.innerHTML='';ANIM=false;render();if(fila)PMUI.avisoOfertas(fila)}};
PMUI.css2=function(){
 if(document.getElementById('pm-css2'))return;var s=document.createElement('style');s.id='pm-css2';
 s.textContent=
 '.fol-box{position:relative;background:var(--card);border:2px solid var(--c1);border-radius:18px;padding:22px 20px;max-width:440px;width:100%;box-shadow:0 20px 60px #000;animation:pop .25s;z-index:2}'+
 '.fol-box.dev{border-color:var(--bad)}.fol-box>small{color:var(--mut);text-transform:uppercase;font-size:11px}'+
 '.fol-row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--bd);font-size:14px;animation:fadeIn .4s ease-out both}'+
 '.fol-row.up b{color:var(--c1)}.fol-row.dn b{color:var(--bad)}'+
 '.fol-tot{text-align:center;margin-top:14px}.fol-tot small{color:var(--mut);font-size:11px;text-transform:uppercase}'+
 '.fol-st{padding:10px 12px;border-radius:12px;margin-top:12px;font-weight:700;font-size:13px;animation:fadeIn .5s ease-out both}'+
 '.fol-st.ok{background:#3dbb6a26;color:#7ee2a0}.fol-st.bad{background:#ef444426;color:#fca5a5}'+
 '.fol-warn{font-weight:400;font-size:12px;color:var(--tx);margin-top:6px}';
 document.head.appendChild(s)};

PMUI.css3=function(){
 if(document.getElementById('pm-css3'))return;var s=document.createElement('style');s.id='pm-css3';
 s.textContent=[
 /* valores */
 ".mny{display:grid;gap:8px;margin:4px 0 14px}.mny-l{font-weight:600;font-size:14px}.mny-l small{display:block;color:var(--mut);font-weight:400;font-size:12px;margin-top:2px}",
 ".mny-c{display:grid;grid-template-columns:52px 1fr 52px;gap:8px}.mny-b{padding:0;font-size:24px;min-height:54px;background:var(--bg2);color:var(--tx);border:1px solid var(--bd)}",
 ".mny-v{display:flex;align-items:center;justify-content:center;gap:6px;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:0 10px;min-width:0}.mny-v:focus-within{border-color:var(--c1)}",
 ".pmw .mny-v input{border:0;background:transparent;padding:12px 0;margin:0;width:100%;min-width:0;text-align:center;font:800 24px Inter,Arial,sans-serif;color:var(--c1);-moz-appearance:textfield}.pmw .mny-v input:focus{outline:none}",
 ".mny-v input::-webkit-inner-spin-button,.mny-v input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.mny-v span,.mny-v em{color:var(--mut);font-style:normal;font-weight:700}.mny-n{font:800 24px Inter,Arial,sans-serif;color:var(--c1)}",
 ".mny-h{font-size:12px;color:var(--mut)}.mny-q{display:flex;gap:6px;flex-wrap:wrap;margin:-4px 0 10px}.mny-q button{min-height:34px;padding:6px 12px;font-size:12px}",
 ".opc{font:400 11px Inter,Arial,sans-serif;color:var(--mut);margin-left:8px}",
 /* botões de escolha e toggle */
 ".sgm{display:flex;gap:6px;flex-wrap:wrap}.sgm button{flex:1;min-width:64px;min-height:44px;background:var(--bg2);color:var(--tx);border:1px solid var(--bd);text-transform:none;font-weight:600;font-size:13px}",
 ".sgm button.on{background:linear-gradient(180deg,#52c277,#1fa35a);color:#03150a;border-color:transparent}",
 ".tgl{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;text-align:left;background:var(--bg2);color:var(--tx);border:1px solid var(--bd);text-transform:none;font-weight:600}",
 ".tgl small{display:block;color:var(--mut);font-weight:400;font-size:12px}.tgl i{width:44px;height:26px;border-radius:99px;background:#0b120e;border:1px solid var(--bd);position:relative;flex:none;transition:background .2s,border-color .2s}",
 ".tgl i::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:var(--mut);transition:transform .2s,background .2s}.tgl.on i{background:#1fa35a55;border-color:var(--c1)}.tgl.on i::after{transform:translateX(18px);background:var(--c1)}",
 /* troca de jogadores */
 ".tpk-hd{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--mut);margin:0 0 8px}.tpk-hd b{color:var(--c1)}",
 ".tpk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;max-height:360px;overflow:auto;padding:2px}",
 ".tpk{display:flex;align-items:center;gap:10px;text-align:left;text-transform:none;background:var(--bg2);color:var(--tx);border:2px solid var(--bd);border-radius:12px;padding:8px 10px;min-height:58px;font-weight:400;transition:border-color .15s,background .15s}",
 ".tpk.on{border-color:var(--c1);background:#3dbb6a1f}.tpk.off{opacity:.4}.tpk-n{flex:1;min-width:0}.tpk-n b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tpk-n small{color:var(--mut);font-size:11px}",
 ".tpk-c{width:22px;height:22px;border-radius:50%;border:2px solid var(--bd);flex:none;position:relative}.tpk.on .tpk-c{background:var(--c1);border-color:var(--c1)}",
 ".tpk.on .tpk-c::after{content:'';position:absolute;left:6px;top:2px;width:5px;height:10px;border:solid #03150a;border-width:0 2px 2px 0;transform:rotate(45deg)}",
 ".ph{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.ph .pp,.tpk .pp,.rs-n .pp,.tr-sub .pp{border-radius:7px;text-align:center;font-size:11px;font-weight:700;padding:5px 8px;min-width:42px;display:inline-block}",
 /* resumo */
 ".rs{border-color:var(--c1);background:linear-gradient(160deg,#10301f,#101512 65%)}.rs-big{text-align:center;padding:4px 0 14px;border-bottom:1px dashed #74d99a44;margin-bottom:8px}",
 ".rs-big small{display:block;color:var(--mut);font-size:12px}.rs-big b{display:block;font:800 32px/1.15 Inter,Arial,sans-serif;color:var(--c1);margin:4px 0}.rs-big em{font-style:normal;font-size:12px;color:var(--mut)}",
 ".rs-r{display:flex;justify-content:space-between;gap:10px;padding:8px 0;font-size:14px;border-bottom:1px solid #ffffff0d}.rs-r span{color:var(--mut)}.rs-r b{text-align:right}",
 ".rs-r.tot{border-bottom:0;font-weight:700;margin-top:4px;font-size:15px}.rs-r.tot span{color:var(--tx)}.rs-r.neg b{color:var(--bad)}.rs-r.pos b{color:var(--c1)}",
 ".rs-sep{height:1px;background:#74d99a33;margin:6px 0}.rs-n{font-size:12px;color:var(--mut);padding:2px 0 8px;display:grid;gap:4px}.rs-n .pp{padding:2px 6px;min-width:0;margin-right:6px}",
 ".rs-w{margin-top:8px;padding:8px 10px;border-radius:10px;background:#ef444422;color:#fca5a5;font-size:12px}",
 ".rs-st{display:grid;gap:14px;align-content:start}.rs-st>.card{margin:0}@media(min-width:800px){.rs-st{position:sticky;top:8px}}",
 ".stk2{align-items:center;gap:12px;border-top:1px solid var(--bd)}.stk2 .stk-t{flex:1}.stk2 .stk-t small{display:block;color:var(--mut);font-size:11px}.stk2 .stk-t b{font:800 20px Inter,Arial,sans-serif;color:var(--c1)}.stk2 button{flex:1.2}",
 /* animação de transferência */
 ".tr-box{position:relative;overflow:hidden;background:var(--card);border:2px solid var(--c1);border-radius:22px;padding:24px 20px 20px;max-width:440px;width:100%;text-align:center;box-shadow:0 24px 70px #000;animation:pop .3s;z-index:2}",
 ".tr-box.fail{border-color:var(--bad)}.tr-box::before{content:'';position:absolute;inset:0;background:radial-gradient(120% 55% at 50% 0%,#3dbb6a40,transparent 70%)}.tr-box.fail::before{background:radial-gradient(120% 55% at 50% 0%,#ef444440,transparent 70%)}.tr-box>*{position:relative}",
 ".tr-tag{display:inline-block;font:700 11px Inter,Arial,sans-serif;letter-spacing:.6px;text-transform:uppercase;padding:5px 14px;border-radius:99px;background:#3dbb6a26;color:#7ee2a0;animation:fadeIn .4s both}.fail .tr-tag{background:#ef444426;color:#fca5a5}",
 ".tr-nome{font:800 24px/1.2 Inter,Arial,sans-serif;margin:14px 0 6px;animation:trUp .5s .1s both}.tr-sub{color:var(--mut);font-size:13px;display:flex;gap:8px;justify-content:center;align-items:center;animation:trUp .5s .2s both}",
 ".tr-rota{display:grid;grid-template-columns:1fr 84px 1fr;align-items:center;gap:6px;margin:22px 0 12px}.tr-club{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px;min-width:0;animation:trUp .5s .3s both}.tr-club b{font-weight:600;overflow-wrap:anywhere}",
 ".tr-trilho{position:relative;height:4px;border-radius:99px;background:#ffffff1f}.tr-trilho::after{content:'';position:absolute;left:0;top:0;bottom:0;width:0;border-radius:99px;background:var(--c1);animation:trFill 1.3s .8s ease-in-out forwards}",
 ".fail .tr-trilho::after{background:var(--bad);animation:trFail 1.6s .8s ease-in-out forwards}",
 ".tr-bola{position:absolute;top:50%;left:0;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:var(--c1);box-shadow:0 0 0 5px #3dbb6a44;z-index:1;animation:trMove 1.3s .8s ease-in-out forwards}",
 ".fail .tr-bola{background:var(--bad);box-shadow:0 0 0 5px #ef444444;animation:trBack 1.6s .8s ease-in-out forwards}",
 ".ok .tr-dest .esc{animation:trPop .6s 2.05s both}.fail .tr-dest{animation:trUp .5s .3s both,trShake .5s 1.7s}",
 ".tr-msg{font-size:13px;margin:6px 0 14px;animation:fadeIn .5s 1.2s both}.tr-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;animation:fadeIn .5s 1.9s both}.tr-grid.one{grid-template-columns:1fr}",
 ".tr-grid>div{background:var(--bg2);border-radius:12px;padding:10px}.tr-grid small{display:block;color:var(--mut);font-size:11px}.tr-grid b{display:block;font:800 18px Inter,Arial,sans-serif}.tr-grid em{display:block;font-style:normal;font-size:12px;font-weight:700;color:var(--mut)}.tr-grid em.up{color:var(--c1)}.tr-grid em.dn{color:var(--bad)}",
 "@keyframes trUp{from{opacity:0;transform:translateY(12px)}}@keyframes trFill{to{width:100%}}@keyframes trFail{0%{width:0}55%{width:55%}100%{width:0}}",
 "@keyframes trMove{to{left:100%}}@keyframes trBack{0%{left:0}55%{left:55%}100%{left:0}}@keyframes trPop{40%{transform:scale(1.25);box-shadow:0 0 0 10px #3dbb6a55}}@keyframes trShake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}",
 /* calendário do painel (verde, fluido) */
 ".calcard{background:linear-gradient(135deg,#143c25,#0e1a13 70%);border:1px solid #74d99a33;gap:18px}",
 ".calpg{width:92px;border-radius:16px;background:linear-gradient(180deg,#52c277,#1fa35a);color:#03150a;box-shadow:0 8px 22px #0007,inset 0 1px 0 #ffffff55;animation:none;overflow:hidden}",
 ".calpg small{background:#0b140f66;color:#eafff0;padding:5px 0;font-weight:700;letter-spacing:.5px}.calpg b{font:800 40px/1 Inter,Arial,sans-serif;padding:10px 0 2px}.calpg b.tick{animation:calTick .45s cubic-bezier(.2,.8,.2,1)}",
 ".calpg em{color:#04301a;padding-bottom:8px;font-weight:600}.calpg.dj{outline:0;box-shadow:0 0 0 3px #eafff0,0 0 24px #3dbb6a88;animation:calPulse 1.6s ease-in-out infinite}",
 "@keyframes calTick{0%{transform:translateY(-55%);opacity:0;filter:blur(3px)}100%{transform:none;opacity:1;filter:none}}@keyframes calPulse{50%{box-shadow:0 0 0 3px #eafff0,0 0 34px #3dbb6acc}}",
 ".calinfo{flex:1;min-width:0}.calinfo>b{font-size:17px}.calbar{height:8px;border-radius:99px;background:#0b120e;margin-top:10px;overflow:hidden;border:1px solid var(--bd)}",
 ".calbar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#1fa35a,#7ee2a0);transition:width .38s linear}"
 ].join('\n');
 document.head.appendChild(s)};
 PMUI.css();PMUI.css2();PMUI.css3();

