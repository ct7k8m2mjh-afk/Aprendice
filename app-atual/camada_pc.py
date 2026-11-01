# -*- coding: utf-8 -*-
"""Camada PC (27/10): injeta CSS+JS de tela de computador nos 4 sub-apps
(fonte head.html/app.js E o index.html ja construido) e no shell.
Idempotente: rodar de novo substitui o bloco anterior."""
import re, sys

MARCA = {'bio': '#7CC95A', 'qui': '#DC5BC9', 'mat': '#4CC8CB', 'por': '#F4C63D'}
# impeccable/audit 29/10: acento do tema claro com 4,5:1 sobre papel, folha2 e -sv (Mat usa --indigo)
ACENTO_CLARO = {'bio': '--acento:#2B7620', 'qui': '',
                'mat': '--indigo:#0D717A;--d2:#7A6B18', 'por': '--acento:#806600'}

CSS = r"""/* ==== camada PC 27/10: computador (duas colunas, menu no topo, teclado, marca-texto) ==== */
:root{--marca:%MARCA%;--marca-ink:#1C1A17}
header.top{padding-left:16px;padding-right:16px}
.capa p{max-width:75ch}
.btn:not(.sec){background:var(--marca);color:var(--marca-ink)}
.atalhos-pc{display:none}
/* conselho 27/10 — Hadid: o corpo com altura de 1 tela soltava o cabecalho grudento na 2a rolagem */
html,body{height:auto}
html{min-height:100%}
body{min-height:100vh}
#v-questao *{scroll-margin-top:84px}
/* Rams/Ive: mono so para numero e tecla; frase corrida volta para a fonte de interface */
.b-pista,.texto-toggle,.ficha summary,.ficha summary *{font-family:var(--disp)!important;letter-spacing:0!important;text-transform:none!important}
.b-pista{color:var(--tinta)}
#sync{font-family:var(--disp);font-size:12.5px;color:var(--lapis)}
/* Norman: o link "tela cheia de verdade" apontava para tela.html, que nao existe no app unico */
#aviso-tela{display:none}
/* Ingels: a escada que da nome ao app, desenhada ao lado de "Degrau N de M" */
.mini-escada{display:inline-flex;align-items:flex-end;gap:2px;height:16px;margin:0 6px 0 2px;vertical-align:middle}
.mini-escada i{display:block;width:6px;border-radius:2px 2px 1px 1px;background:var(--linha)}
.mini-escada i.ja{background:color-mix(in srgb,var(--marca) 45%,var(--linha))}
.mini-escada i.aqui{background:var(--marca);box-shadow:0 0 0 1px color-mix(in srgb,var(--marca-ink) 25%,transparent)}
#btema svg,#bfull svg{display:block}
/* optimize 29/10: o atributo hidden do print perdia para .print img{display:block}: o texto alternativo
   aparecia (27 px) sob "carregando a questao..." e a caixa saltava duas vezes */
.print img[hidden]{display:none}
/* impeccable/audit 27/10: contraste real e piso de 11 px */
nav.bot button.on{color:var(--tinta)}
.kpi span{font-size:11px!important;letter-spacing:.2px}
.tag{font-size:11px}
.print-lupa,.print-tp,.print-selo{font-size:11px}
.lupa-top{padding:10px 14px}
.lupa-zoom{padding:4px 8px}
.degrau .inf small,.lupa-pe{font-size:12px!important}
/* escada de dicas */
.dica-box{display:grid;gap:8px;margin-top:10px}
.dica-nivel{background:var(--aviso-bg);border-radius:10px;padding:10px 14px}
.dica-nivel b{display:block;font:600 11px/1.4 var(--disp);letter-spacing:.06em;text-transform:uppercase;color:var(--lapis);margin-bottom:3px}
.dica-nivel p{margin:0;font-size:15.5px;line-height:1.55}
.dica-nivel.fim{background:transparent;border:1px dashed var(--linha)}
/* critique 29/10: Confirmar so parece clicavel quando ha letra escolhida */
#q-corpo:not(:has(#bolhas .bolha.sel)) #b-conf{opacity:.55}
/* critique 29/10: o porque do erro dele logo abaixo do veredito */
.sua-topo{margin-top:14px}
.sua-topo .errada.sua{margin-top:0}
/* impeccable/audit 29/10: o acento do tema claro passa 4,5:1 sobre papel, folha2 e o fundo suave (-sv) */
:root[data-theme="light"]{%ACENTO_CLARO%}
@media (prefers-color-scheme:light){:root:not([data-theme="dark"]){%ACENTO_CLARO%}}
.tipo{opacity:1}
.print-pe{color:#6E6A5F}
#v-inicio > p.dica,#i-sub{max-width:68ch}
@media (min-width:760px){header.top{padding-left:30px;padding-right:30px}}
@media (min-width:1100px){
  html:not(.foco) nav.bot{top:0;bottom:auto;left:50%;right:auto;transform:translateX(-50%);
    background:transparent;border-top:0;padding:11px 0;z-index:31;gap:4px}
  html:not(.foco) nav.bot button{flex:none;flex-direction:row;gap:8px;padding:9px 16px;font-size:13px;cursor:pointer}
  html:not(.foco) nav.bot button em{font-size:15px}
  html:not(.foco) .wrap{padding-bottom:48px}
  body:has(#v-questao:not([hidden])) .wrap{max-width:1560px}
  #v-questao .nav2{max-width:none}
  #q-corpo{max-width:none;display:grid;grid-template-columns:minmax(0,900px) minmax(380px,520px);
    grid-template-rows:auto repeat(16,auto) 1fr;column-gap:36px;justify-content:center;align-items:start}
  #q-corpo > *{grid-column:2;min-width:0}
  #q-corpo > .entra2 > *{grid-column:2;min-width:0}
  #q-corpo > .qmeta{grid-column:1 / -1}
  #q-corpo > .entra2{display:contents}
  #q-corpo > .entra2 > .print{grid-column:1;grid-row:2 / -1;align-self:start;position:sticky;top:76px;
    max-height:calc(100vh - 92px);overflow:auto;margin:0}
  .btn-pausa{font-size:15px;padding:6px 12px}
  /* Rams: tres botoes de 1070 px empilhados viram uma linha so; o principal vem primeiro */
  .capa{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:12px}
  .capa > *{grid-column:1 / -1}
  /* critique 29/10: a acao do dia sobe para logo abaixo do titulo; os 6 numeros descem */
  .capa #b-treino{grid-column:1;grid-row:3}
  .capa #b-continuar{grid-column:2;grid-row:3}
  .capa #b-simulado5{grid-column:3;grid-row:3}
  .capa #treino-dica{grid-row:4;grid-column:1 / 3}
  .capa .kpis{grid-row:5;margin-top:14px}
  .capa:has(#b-continuar:not(.sec)) #b-continuar{grid-column:1}
  .capa:has(#b-continuar:not(.sec)) #b-treino{grid-column:2}
  .capa:has(#b-continuar:not(.sec)) #treino-dica{grid-column:2 / 4}
  .capa #b-treino,.capa #b-continuar,.capa #b-simulado5{margin:12px 0 0 !important}
  .atalhos-pc{display:inline;font-family:var(--mono);font-size:11.5px;color:var(--lapis);margin-right:auto;margin-left:18px}
}
/* ==== fim camada PC ==== */"""

JS = r"""/* ==== camada PC 27/10: atalhos de teclado + Continuar em destaque ==== */
(function(){
  if (window.__camadaPC) return; window.__camadaPC = 1;
  function visivel(e){ return !!e && e.offsetParent !== null && !e.disabled; }
  var volta = document.getElementById('q-volta');
  if (volta && !document.querySelector('.atalhos-pc')) {
    var s = document.createElement('span'); s.className = 'atalhos-pc';
    s.textContent = 'teclado: A–E escolhe · Enter confirma/avança · H dica · P pausa';
    volta.insertAdjacentElement('afterend', s);
  }
  document.addEventListener('keydown', function(ev){
    if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat) return;
    var t = ev.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    var vq = document.getElementById('v-questao');
    if (!vq || vq.hidden) return;
    if (document.querySelector('[role="dialog"]:not([hidden])')) return;
    var k = ev.key || '';
    var prox = document.getElementById('b-prox'), conf = document.getElementById('b-conf');
    var i = k.length === 1 ? 'abcde'.indexOf(k.toLowerCase()) : -1;
    if (i < 0 && k.length === 1) i = '12345'.indexOf(k);
    if (i >= 0) {
      if (visivel(prox)) return;                 /* ja respondeu: letras nao mudam nada */
      var b = document.querySelectorAll('#bolhas .bolha')[i];
      if (visivel(b)) { ev.preventDefault(); b.click(); b.focus({preventScroll:true}); }
      return;
    }
    if (k === 'Enter') {
      /* critique 29/10: botao clicado dentro da questao (revisar depois, dica, texto) nao rouba o Enter:
         antes, Enter depois de "revisar depois" DESMARCAVA a revisao e nao confirmava nada */
      var naQuestao = t && t.tagName === 'BUTTON' && t.closest && t.closest('#q-corpo');
      if (t && /^(BUTTON|A|SUMMARY)$/.test(t.tagName) && !naQuestao
          && t.id !== 'b-conf' && t.id !== 'b-prox') return;   /* deixa o Enter nativo dos botoes de fora (voltar, pausa, menu) */
      var alvo = visivel(prox) ? prox : (visivel(conf) ? conf : null);
      if (alvo) { ev.preventDefault(); alvo.click(); }
      return;
    }
    if (k === 'h' || k === 'H') {
      var bdk = document.getElementById('b-dica');
      if (visivel(bdk)) { ev.preventDefault(); bdk.click(); }
      return;
    }
    if (k === 'p' || k === 'P') {
      var pz = document.getElementById('q-pausa');
      if (visivel(pz)) { ev.preventDefault(); pz.click(); }
    }
  });
  /* mini-escada ao lado de "Degrau N de M" (refeita a cada questao desenhada) */
  function miniEscada(){
    var tag = document.querySelector('#q-corpo .qmeta .tag.dif');
    if (!tag) return;
    var viz = tag.nextElementSibling;
    if (viz && viz.classList.contains('mini-escada')) return;
    var m = /Degrau\s+(\d+)\s+de\s+(\d+)/.exec(tag.textContent || '');
    if (!m) return;
    var n = +m[1], tot = +m[2];
    if (tot < 2 || tot > 14 || n < 1 || n > tot) return;
    var s = document.createElement('span'); s.className = 'mini-escada'; s.setAttribute('aria-hidden', 'true');
    for (var i = 1; i <= tot; i++) {
      var d = document.createElement('i');
      d.style.height = (4 + Math.round(12 * i / tot)) + 'px';
      if (i < n) d.className = 'ja'; else if (i === n) d.className = 'aqui';
      s.appendChild(d);
    }
    tag.insertAdjacentElement('afterend', s);
  }
  /* escada de dicas: estrategica -> conceitual -> procedimental -> "agora e com voce" (nunca entrega a letra) */
  /* optimize 29/10 (1/2): um pacote res/ que falhou (rede caiu) nao fica envenenado em PACOTES:
     o proximo pedido tenta de novo, em vez de "nao consegui carregar" ate recarregar a pagina */
  if (typeof carregaRes === 'function' && typeof PACOTES === 'object' && typeof POR === 'object') {
    var _cr = carregaRes;
    carregaRes = function (id) {
      return _cr.apply(this, arguments).catch(function (e) {
        var q = POR[id], p = q && PACOTES[q.sub];
        if (p) p.then(null, function () { if (PACOTES[q.sub] === p) delete PACOTES[q.sub]; });
        throw e;
      });
    };
  }
  /* optimize 29/10 (2/2): enquanto o aluno resolve esta questao, baixa em segundo plano o pacote
     da PROXIMA da lista (treino/simulado). So' depois do pacote atual, e no ocioso. */
  var ocioso = window.requestIdleCallback || function (f) { return setTimeout(f, 300); };
  function preBaixa(q) {
    try {
      var nid = ctx && ctx.lista && ctx.lista[ctx.i + 1], nq = nid && POR[nid];
      if (!nq || RES[nid] || PACOTES[nq.sub]) return;          /* ja na memoria ou a caminho */
      Promise.resolve(carregaRes(q.id)).catch(function () {}).then(function () {
        ocioso(function () { carregaRes(nid).catch(function () {}); }, { timeout: 3000 });
      });
    } catch (e) {}
  }
  if (typeof desenhaQuestao === 'function') {
    var _dq = desenhaQuestao;
    desenhaQuestao = function (q) { window.__qAtual = q; var r = _dq.apply(this, arguments); preBaixa(q); return r; };
  }
  function niveisDica(q, r) {
    /* nunca usa chave, cuidado, armadilha nem resposta: todos podem entregar a conclusao */
    var e = r.essencial || {}, P = r.passos || [], L = [];
    if (e.pede) L.push(['o que a questão pede', e.pede]);
    var pis = r.pista || q.pista;
    if (pis) L.push(['onde olhar primeiro', pis]);
    if (P[0] && P[0].faz && !/\b(alternativas?|letras?)\s+[A-E]\b|\(\s*[A-E]\s*\)/i.test(P[0].faz)) L.push(['por onde começar', 'Comece assim: ' + String(P[0].faz).replace(/\.\s*$/, '') + '. O resto do caminho é seu.']);   /* 30/10: o 1o passo que cita a letra entregava o gabarito */
    L = L.map(function (x, i) { return ['Dica ' + (i + 1) + ' · ' + x[0], x[1]]; });
    /* critique 29/10: o fecho nao conta como dica (antes gastava um clique e o "4 de 4" prometia conteudo) */
    L.push(['Agora é com você', 'Diga para si mesmo qual é o primeiro passo e por quê. Depois marque a alternativa e confirme: a resolução completa abre em seguida.', 'fim']);
    return L;
  }
  function montaDicas() {
    var corpo = document.getElementById('q-corpo'), q = window.__qAtual;
    if (!corpo || !q) return;
    var prox = document.getElementById('b-prox'), bd = document.getElementById('b-dica');
    if (prox && prox.offsetParent !== null) { if (bd) bd.hidden = true; return; }
    if (bd && bd.dataset.q === q.id) return;
    var acoes = corpo.querySelector('.entra2 > .acoes');
    if (!acoes) return;
    ['b-pista', 'pista-box', 'b-dica', 'dica-box'].forEach(function (id) { var x = document.getElementById(id); if (x) x.remove(); });
    bd = document.createElement('button'); bd.type = 'button'; bd.id = 'b-dica'; bd.className = 'b-pista'; bd.dataset.q = q.id;
    var caixa = document.createElement('div'); caixa.id = 'dica-box'; caixa.className = 'dica-box'; caixa.hidden = true;
    caixa.setAttribute('aria-live', 'polite');
    /* critique 29/10: caixa ANTES do botao: a dica nova nasce logo acima do botao que a pediu,
       em vez de empilhar abaixo dele e sair da tela (em 1366x768 a 4a caia em y=745) */
    acoes.insertAdjacentElement('afterend', caixa); caixa.insertAdjacentElement('afterend', bd);
    var niveis = null, vistos = 0;
    function reais() { return niveis ? niveis.filter(function (x) { return x[2] !== 'fim'; }).length : 3; }
    function rotulo() {
      var tot = reais();
      if (niveis && vistos >= tot) { bd.hidden = true; return; }
      bd.textContent = vistos === 0 ? 'não sei por onde começar · dica 1 de ' + tot : 'mais uma dica · ' + (vistos + 1) + ' de ' + tot;
    }
    function poe(n) {
      var d = document.createElement('div'), b = document.createElement('b'), p = document.createElement('p');
      d.className = 'dica-nivel' + (n[2] === 'fim' ? ' fim' : ''); b.textContent = n[0]; p.textContent = n[1];
      d.appendChild(b); d.appendChild(p); caixa.appendChild(d); return d;
    }
    function mostra() {
      if (vistos >= reais()) return;
      var d = poe(niveis[vistos]); vistos++; caixa.hidden = false;
      if (vistos === reais() && niveis[vistos] && niveis[vistos][2] === 'fim') d = poe(niveis[vistos]);
      rotulo();
      (bd.hidden ? d : bd).scrollIntoView({ block: 'nearest', behavior: 'smooth' });   /* o botao, ou o fecho, fica a vista */
    }
    rotulo();
    bd.onclick = function () {
      if (niveis) return mostra();
      bd.disabled = true; bd.textContent = 'carregando a dica…';
      Promise.resolve(typeof carregaRes === 'function' ? carregaRes(q.id) : null)
        .catch(function () { return null; })
        .then(function (r) { niveis = niveisDica(q, r || {}); bd.disabled = false; mostra(); });
    };
  }
  /* critique 29/10: quem errou le PRIMEIRO por que a letra dele nao serve (antes: ~2.600 px abaixo do veredito) */
  function realcaErro() {
    var corpo = document.getElementById('q-corpo');
    if (!corpo || corpo.querySelector('.sua-topo')) return;
    var sua = corpo.querySelector('.resolucao .errada.sua'), ver = corpo.querySelector('.resolucao') && corpo.querySelector('.veredito.v0');
    if (!sua || !ver) return;
    var L = ((sua.querySelector('.L') || {}).textContent || '').trim();
    var tn = ver.childNodes[1];
    if (L && tn && tn.nodeType === 3) tn.textContent = 'Você marcou ' + L + ' · ' + tn.textContent;
    var box = document.createElement('div'); box.className = 'bloco sua-topo';
    var h = document.createElement('h3'); h.textContent = 'Por que a alternativa ' + L + ' não serve';
    box.appendChild(h); box.appendChild(sua);
    ver.insertAdjacentElement('afterend', box);
  }
  function aoDesenhar() { miniEscada(); montaDicas(); realcaErro(); }
  var qc = document.getElementById('q-corpo');
  if (qc && window.MutationObserver) new MutationObserver(aoDesenhar).observe(qc, {childList:true});
  aoDesenhar();
  /* impeccable/audit 29/10: estado das bolhas e da secao atual para leitor de tela; menu do topo
     entra no Tab logo depois do cabecalho, na mesma ordem em que aparece na tela */
  function estadoBolhas(){
    document.querySelectorAll('#bolhas .bolha').forEach(function(b){
      b.setAttribute('aria-pressed', b.classList.contains('sel') ? 'true' : 'false');
    });
  }
  if (qc) { qc.addEventListener('click', estadoBolhas); new MutationObserver(estadoBolhas).observe(qc, {childList:true}); estadoBolhas(); }
  var nb = document.querySelector('nav.bot'), ht = document.querySelector('header.top');
  if (nb && ht) {
    nb.setAttribute('aria-label', 'Seções');
    var ancora = document.getElementById('sair-foco') || ht;
    if (ancora.nextElementSibling !== nb) ancora.insertAdjacentElement('afterend', nb);
    var atual = function(){ nb.querySelectorAll('button').forEach(function(b){
      if (b.classList.contains('on')) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); }); };
    atual(); new MutationObserver(atual).observe(nb, {subtree:true, attributes:true, attributeFilter:['class']});
  }
  /* icone de tema desenhado (o glifo ◐ saia torto conforme a fonte do Windows) */
  var bt = document.getElementById('btema');
  if (bt) bt.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor"/></svg>';
  function promove(){
    var r = document.getElementById('k-resp'), c = document.getElementById('b-continuar'), tr = document.getElementById('b-treino');
    if (!r || !c || !tr) return;
    var n = parseInt((r.textContent || '').replace(/\D/g, ''), 10) || 0;
    if (n > 0) { c.classList.remove('sec'); tr.classList.add('sec'); }
    else { c.classList.add('sec'); tr.classList.remove('sec'); }
  }
  promove();
  var kr = document.getElementById('k-resp');
  if (kr && window.MutationObserver) new MutationObserver(promove).observe(kr, {childList:true, characterData:true, subtree:true});
  /* critique 29/10: escolher a letra apaga o aviso "escolha uma letra primeiro" (antes ele ficava, contradizendo a bolha marcada) */
  document.addEventListener('click', function (ev) {
    if (!ev.target.closest || !ev.target.closest('#bolhas .bolha')) return;
    var c = document.getElementById('b-conf');
    if (c && c.textContent !== 'Confirmar resposta') c.textContent = 'Confirmar resposta';
  }, true);
  /* critique 29/10: questao aberta da lista "Marcadas para revisao" tinha o contexto velho
     ("1 de 7", Proxima seguia a escada antiga, voltar caia na escada). Agora percorre as marcadas e volta ao Progresso. */
  document.addEventListener('click', function (ev) {
    var l = ev.target.closest && ev.target.closest('#revisar [data-id]');
    if (!l) return;
    ev.stopPropagation(); ev.preventDefault();
    var ids = [].map.call(document.querySelectorAll('#revisar [data-id]'), function (x) { return x.dataset.id; });
    ctx = { lista: ids, i: ids.indexOf(l.dataset.id), revisao: true };
    abrirQuestao(l.dataset.id, ctx);
    var v = document.getElementById('q-volta');
    if (v) v.onclick = function () { clearInterval(tTimer); vai('progresso'); };
  }, true);
  if (typeof proxima === 'function') {
    var _px = proxima;
    proxima = function () {
      if (ctx && ctx.revisao && ctx.i >= ctx.lista.length - 1) { ctx = null; return vai('progresso'); }
      var r = _px.apply(this, arguments);
      if (ctx && ctx.revisao) { var v = document.getElementById('q-volta'); if (v) v.onclick = function () { clearInterval(tTimer); vai('progresso'); }; }
      return r;
    };
  }
  /* critique 29/10: "Continuar de onde parei" reabria a ULTIMA questao mesmo ja respondida; agora abre o proximo degrau nao vencido dela */
  var bc = document.getElementById('b-continuar');
  if (bc) bc.addEventListener('click', function (ev) {
    var q = S.ult && POR[S.ult];
    if (!q || !respondida(q.id) || !q.sub) return;          /* nao respondida: comportamento antigo (reabre) */
    var deg = escadaDe(q.sub), prox = deg.filter(function (x) { return !acertou(x.id); })[0];
    if (!prox) return;                                       /* escada vencida: deixa o app escolher a proxima */
    ev.stopImmediatePropagation();
    var lista = deg.map(function (x) { return x.id; });
    subAtual = q.sub; ctx = { lista: lista, i: lista.indexOf(prox.id), origem: q.sub };
    abrirQuestao(prox.id, ctx);
  }, true);
  /* critique 29/10: a prova-alvo vem primeiro: simulados por universidade (Sao Camilo, Fuvest, Unesp) no topo */
  if (typeof SIMS !== 'undefined' && SIMS.splice) {
    var uni = SIMS.filter(function (s) { return /^uni_/.test(s.id); });
    var resto = SIMS.filter(function (s) { return !/^uni_/.test(s.id); });
    SIMS.splice.apply(SIMS, [0, SIMS.length].concat(uni, resto));
  }
})();
/* ==== fim camada PC ==== */"""

SHELL_CSS = r"""/* ==== camada PC 27/10: marca-texto do caderno + cabecalho numa linha no computador ==== */
.tit{font-family:var(--body)!important;font-weight:700}
:root{--bio-mt:#7CC95A;--qui-mt:#DC5BC9;--mat-mt:#4CC8CB;--por-mt:#F4C63D}
.aba[data-m="bio"]{--mt:var(--bio-mt)} .aba[data-m="qui"]{--mt:var(--qui-mt)}
.aba[data-m="mat"]{--mt:var(--mat-mt)} .aba[data-m="por"]{--mt:var(--por-mt)}
.aba .pt{background:var(--mt)}
.aba:hover{border-color:var(--mt)}
.aba[aria-selected="true"]{color:#1C1A17;background:var(--mt);border-color:var(--mt)}
.aba[aria-selected="true"] .pt{background:#1C1A17}
.aba:focus-visible{outline-color:var(--mt)}
@media (min-width:900px){
  header{display:flex;align-items:center;gap:18px;padding-top:8px;padding-bottom:8px}
  .tit{margin:0;flex:none}
  nav{flex:1;max-width:820px;margin-left:auto}
  .aba{flex-direction:row;justify-content:center;gap:8px;padding:8px 10px}
}
/* ==== fim camada PC ==== */"""

SHELL_JS = r"""/* ==== camada PC 29/10: shell (teclado e tema) ==== */
(function(){
  if (window.__camadaPCShell) return; window.__camadaPCShell = 1;
  var palco = document.getElementById('palco'), abas = [].slice.call(document.querySelectorAll('.aba'));
  function ativo(){ return palco.querySelector('iframe.quadro:not([hidden])'); }
  /* 1) A–E, 1–5, Enter, H e P digitados com o foco no cabecalho (ex.: logo depois de trocar de
        materia) chegam ao app da materia em vez de se perderem no shell */
  document.addEventListener('keydown', function(ev){
    if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat) return;
    var k = ev.key || '';
    if (!/^[a-eA-E1-5hHpP]$/.test(k) && k !== 'Enter') return;
    if (k === 'Enter' && ev.target && ev.target.closest && ev.target.closest('button,a,summary')) return;
    var f = ativo(); if (!f) return;
    try {
      var w = f.contentWindow; w.focus();
      w.document.dispatchEvent(new w.KeyboardEvent('keydown', {key:k, bubbles:true, cancelable:true}));
      ev.preventDefault();
    } catch (e) {}
  });
  /* 2) abas: setas/Home/End trocam de materia; so a aba ativa fica no Tab (padrao WAI-ARIA tabs) */
  function roving(){ abas.forEach(function(a){ a.tabIndex = a.getAttribute('aria-selected') === 'true' ? 0 : -1; }); }
  abas.forEach(function(a){ new MutationObserver(roving).observe(a, {attributes:true, attributeFilter:['aria-selected']}); });
  roving();
  document.getElementById('abas').addEventListener('keydown', function(ev){
    var i = abas.indexOf(document.activeElement); if (i < 0) return;
    var j = {ArrowRight:i+1, ArrowLeft:i-1, Home:0, End:abas.length-1}[ev.key];
    if (j == null) return;
    j = (j + abas.length) % abas.length; ev.preventDefault(); abas[j].focus(); abas[j].click();
  });
  /* 3) um tema so: o cabecalho acompanha o app aberto e as outras materias seguem a mesma escolha */
  var sincronizando = false;
  function efetivo(d){ var t = d.documentElement.getAttribute('data-theme');
    return t || (d.defaultView.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
  function aplica(origem){
    if (sincronizando) return; sincronizando = true;
    try {
      var tema = efetivo(origem.contentDocument);
      document.documentElement.setAttribute('data-theme', tema);
      [].forEach.call(palco.querySelectorAll('iframe.quadro'), function(f){
        if (f === origem) return;
        var d = f.contentDocument, b = d && d.getElementById('btema');
        if (b && d.readyState === 'complete' && efetivo(d) !== tema) b.click();   /* usa o botao do proprio app: ele salva a escolha */
      });
    } catch (e) {}
    sincronizando = false;
  }
  function liga(f){
    if (f.__tema) return;
    var vai = function(){
      try {
        f.__tema = 1;
        new MutationObserver(function(){ aplica(f); }).observe(f.contentDocument.documentElement, {attributes:true, attributeFilter:['data-theme']});
        var quer = document.documentElement.getAttribute('data-theme');
        var b = f.contentDocument.getElementById('btema');
        if (quer && b && efetivo(f.contentDocument) !== quer) { sincronizando = true; b.click(); sincronizando = false; }
        if (!f.hidden) aplica(f);
      } catch (e) {}
    };
    if (f.contentDocument && f.contentDocument.readyState === 'complete' && f.contentDocument.getElementById('btema')) vai();
    else f.addEventListener('load', vai);
  }
  [].forEach.call(palco.querySelectorAll('iframe'), liga);
  new MutationObserver(function(ms){ ms.forEach(function(m){ [].forEach.call(m.addedNodes, function(n){ if (n.tagName === 'IFRAME') liga(n); }); }); })
    .observe(palco, {childList:true});
})();
/* ==== fim camada PC ==== */"""
ABRE_SHJ = '/* ==== camada PC 29/10: shell'


def troca_bloco(txt, novo, abre, fecha='/* ==== fim camada PC ==== */'):
    """substitui bloco entre marcadores; devolve (txt, achou)"""
    a = txt.find(abre)
    if a < 0: return txt, False
    b = txt.find(fecha, a)
    assert b > a, 'marcador de fim ausente'
    return txt[:a] + novo + txt[b + len(fecha):], True

ABRE_CSS = '/* ==== camada PC 27/10: computador'
ABRE_JS = '/* ==== camada PC 27/10: atalhos'
ABRE_SH = '/* ==== camada PC 27/10: marca-texto'

for sub, cor in MARCA.items():
    css = CSS.replace('%MARCA%', cor).replace('%ACENTO_CLARO%', ACENTO_CLARO[sub])
    # --- fonte head.html
    p = f'{sub}/head.html'; t = open(p, encoding='utf-8').read()
    t, ok = troca_bloco(t, css, ABRE_CSS)
    if not ok: t = t.rstrip('\n') + '\n<style id="camada-pc">\n' + css + '\n</style>\n'
    open(p, 'w', encoding='utf-8').write(t)
    # --- fonte app.js
    p = f'{sub}/app.js'; t = open(p, encoding='utf-8').read()
    t, ok = troca_bloco(t, JS, ABRE_JS)
    if not ok: t = t.rstrip('\n') + '\n\n' + JS + '\n'
    open(p, 'w', encoding='utf-8').write(t)
    # --- construido index.html
    p = f'{sub}/index.html'; t = open(p, encoding='utf-8').read()
    t, okc = troca_bloco(t, css, ABRE_CSS)
    if not okc:
        dados = t.find('<script id="dados"')
        ult = t.rfind('</style>', 0, dados)
        assert dados > 0 and ult > 0, f'{sub}: ponto de injecao do CSS nao achado'
        ult += len('</style>')
        t = t[:ult] + '\n<style id="camada-pc">\n' + css + '\n</style>' + t[ult:]
    t, okj = troca_bloco(t, JS, ABRE_JS)
    if not okj:
        t = t.rstrip('\n') + '\n<script id="camada-pc-js">\n' + JS + '\n</script>\n'
    open(p, 'w', encoding='utf-8').write(t)
    print(f'{sub}: css {"trocado" if okc else "inserido"}, js {"trocado" if okj else "inserido"}')

# --- Norman: "marcar" nao dizia para que; agora diz (fonte app.js e index.html construido)
ROTULOS = [("'☆ marcar'", "'☆ revisar depois'"), ("'★ marcada'", "'★ na revisão'"),
           # critique 29/10: PC com teclado, nao celular; e o nome do botao mudou e o vazio nao acompanhou
           ("'Toque numa letra primeiro'", "'Escolha uma letra primeiro (A–E)'"),
           ('Use o botão "marcar para revisão" dentro de uma questão.', 'Use o botão "☆ revisar depois" dentro de uma questão.'),
           ("'Tem certeza? Toque de novo para apagar'", "'Tem certeza? Clique de novo para apagar'")]
for sub in MARCA:
    for p in (f'{sub}/app.js', f'{sub}/index.html'):
        t = open(p, encoding='utf-8').read(); n = 0
        for a, b in ROTULOS:
            n += t.count(a); t = t.replace(a, b)
        open(p, 'w', encoding='utf-8').write(t)
        print(f'{p}: rotulos trocados {n}')

# --- shell: desde 29/10 o shell e' gerado por design/gera_design.py (nao injetar aqui)
if False:
    # --- shell
    p = 'index.html'; t = open(p, encoding='utf-8').read()
    t, ok = troca_bloco(t, SHELL_CSS, ABRE_SH)
    if not ok:
        i = t.find('</style>'); assert i > 0
        t = t[:i] + SHELL_CSS + '\n' + t[i:]
    t, okj = troca_bloco(t, SHELL_JS, ABRE_SHJ)
    if not okj:
        i = t.rfind('</body>'); assert i > 0
        t = t[:i] + '<script id="camada-pc-shell">\n' + SHELL_JS + '\n</script>\n' + t[i:]
    open(p, 'w', encoding='utf-8').write(t)
    print('shell:', 'trocado' if ok else 'inserido')
    