/* Ventilacao pulmonar: musculos -> volume do torax -> pressao no pulmao -> fluxo de ar (movido de visuais/bio.js). */
/* etapa final "Resposta": congela o desenho no ultimo quadro e mostra o porque da questao aberta (qid).
   R[qid] = ['Por isso a resposta é X', 'linha', ...]. Sem entrada para o qid, o visual fica como era. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 2.8); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var n = r.length - 1, w = opc.w || 520, h = opc.h || 66 + 23 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 22, y: y + 36, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 22, y: y + 66 + 23 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;   /* quadro congelado na etapa Resposta */
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
  };
}
var RESP = {
'W7698f38': [
'Por isso a resposta é B',
'Na inspiração: contração do',
'diafragma, contração dos',
'intercostais e diminuição',
'da pressão interna.'
],
'Wc0a1990': [
'Por isso a resposta é D',
'I, II e IV estão certas.',
'A III inverte a expiração:',
'o volume diminui e a',
'pressão interna sobe.'
],
'We47e9f6': [
'Por isso a resposta é A',
'O diafragma desce, o volume',
'aumenta: a pressão no pulmão',
'diminui e facilita a',
'entrada de ar.'
]
};
VIS.def['ventilacao'] = {
  tit: 'Inspiração e expiração: volume do tórax e pressão dentro do pulmão',
  tipo: 'anim', dur: 9, cred: 'Animação feita para o app (esquema fora de escala).',
  fontes: ['OpenStax, Biology 2e, 39.3 Breathing — https://openstax.org/books/biology-2e/pages/39-3-breathing'],
  marcas: [[0, 'Inspiração'], [3.8, 'Expiração (mais longa)']],
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var cx = 200;
    /* estruturas */
    var gCost = el('g', {}), pulE = el('path', { 'class': 'v-pul' }), pulD = el('path', { 'class': 'v-pul' });
    var traq = el('path', { 'class': 'v-traq', d: 'M191 18 V92 L160 112 M209 18 V92 L240 112 M191 92 h18' });
    var diaf = el('path', { 'class': 'v-diaf' });
    var costelas = [];
    for (var i = 0; i < 5; i++) costelas.push([el('path', { 'class': 'v-cost' }, gCost), el('path', { 'class': 'v-cost' }, gCost)]);
    var esterno = el('rect', { 'class': 'v-est', x: cx - 4, y: 122, width: 8, height: 92, rx: 4 });
    /* ar */
    var seta = el('path', { 'class': 'v-ar' }), setaT = el('text', { 'class': 'v-art', x: cx + 26, y: 30 });
    /* rotulos dos musculos */
    var rDia = el('text', { 'class': 'v-rot', x: cx, y: 322, 'text-anchor': 'middle' }), rInt = el('text', { 'class': 'v-rot', x: 4, y: 40 }), rInt2 = el('text', { 'class': 'v-mini', x: 4, y: 58 });
    /* painel */
    var px = 392;
    var fase = el('text', { 'class': 'v-fase', x: px, y: 44 });
    var fase2 = el('text', { 'class': 'v-sub', x: px, y: 68 }), fase3 = el('text', { 'class': 'v-sub', x: px, y: 87 });
    el('text', { 'class': 'v-lab', x: px, y: 124 }).textContent = 'Volume do tórax';
    el('rect', { 'class': 'v-trilho', x: px, y: 134, width: 230, height: 14, rx: 7 });
    var vol = el('rect', { 'class': 'v-vol', x: px, y: 134, height: 14, rx: 7 });
    el('text', { 'class': 'v-lab', x: px, y: 186 }).textContent = 'Pressão dentro do pulmão';
    el('line', { 'class': 'v-atm', x1: px + 160, x2: px + 240, y1: 228, y2: 228 });
    el('text', { 'class': 'v-mini', x: px, y: 232 }).textContent = '- - - atmosférica (não muda)';
    var pin = el('circle', { 'class': 'v-pin', cx: px + 190, r: 9 }), pinL = el('line', { 'class': 'v-pinl', x1: px + 190, x2: px + 190, y1: 228 });
    var pTxt = el('text', { 'class': 'v-sub', x: px, y: 290 }), pTxt2 = el('text', { 'class': 'v-sub', x: px, y: 309 }), pTxt3 = el('text', { 'class': 'v-sub forte', x: px, y: 328 });
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    function domo(x, ap, base) { var u = (x - cx) / 104; return base - (base - ap) * (1 - u * u); }   /* cupula do diafragma */
    function pulmao(lado, v, ap, base) {   /* lado -1 esquerda do desenho, +1 direita */
      var abre = 7 * v, topo = 98 - 2 * v, ext = cx + lado * (96 + abre), med = cx + lado * 20, pts = [];
      var x0 = cx + lado * 26, x1 = cx + lado * (92 + abre);
      for (var k = 0; k <= 8; k++) { var x = x0 + (x1 - x0) * k / 8; pts.push([x, domo(x, ap, base) - 4]); }
      var d = 'M' + (cx + lado * 30) + ' ' + (topo + 16) + ' Q' + (cx + lado * 52) + ' ' + (topo - 6) + ' ' + (cx + lado * 70) + ' ' + (topo + 6) +
        ' Q' + ext + ' ' + (topo + 46) + ' ' + x1 + ' ' + (pts[8][1]) + ' ';
      for (k = 8; k >= 0; k--) d += 'L' + pts[k][0].toFixed(1) + ' ' + pts[k][1].toFixed(1) + ' ';
      return d + 'Q' + med + ' ' + (topo + 90) + ' ' + (cx + lado * 30) + ' ' + (topo + 16) + 'Z';
    }
    var _desenha = function (t) {
      var v, fl, nome, sub;
      var TI = 3, TP = 3.8, TE = 8.3;
      if (t < TI) { var u = t / TI; v = ease(u); fl = -Math.sin(Math.PI * u); nome = '1. Inspiração'; sub = ['diafragma e intercostais', 'externos se contraem']; }
      else if (t < TP) { v = 1; fl = 0; nome = '2. Fim da inspiração'; sub = ['pressões iguais:', 'o ar para']; }
      else if (t < TE) { var w = (t - TP) / (TE - TP); v = 1 - ease(w); fl = Math.sin(Math.PI * w); nome = '3. Expiração'; sub = ['os músculos relaxam e o pulmão,', 'elástico, se retrai (repouso)']; }
      else { v = 0; fl = 0; nome = '4. Fim da expiração'; sub = ['pressões iguais:', 'o ar para']; }
      var base = 262 + 4 * v, ap = 196 + 40 * v;   /* contraido: a cupula desce e achata */
      diaf.setAttribute('d', (function () { var d = ''; for (var k = 0; k <= 20; k++) { var x = cx - 104 + 208 * k / 20; d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + domo(x, ap, base).toFixed(1) + ' '; } return d; })());
      diaf.setAttribute('class', 'v-diaf' + (t < TI ? ' ativo' : ''));
      pulE.setAttribute('d', pulmao(-1, v, ap, base)); pulD.setAttribute('d', pulmao(1, v, ap, base));
      costelas.forEach(function (par, i) {
        var y = 112 + i * 30 - 10 * v * (1 - i * .12), larg = 92 + i * 8 + 8 * v, caida = 20 + i * 3 - 8 * v;
        par[0].setAttribute('d', 'M' + (cx - 6) + ' ' + y + ' Q' + (cx - larg * .7) + ' ' + (y - 8) + ' ' + (cx - larg) + ' ' + (y + caida));
        par[1].setAttribute('d', 'M' + (cx + 6) + ' ' + y + ' Q' + (cx + larg * .7) + ' ' + (y - 8) + ' ' + (cx + larg) + ' ' + (y + caida));
      });
      gCost.setAttribute('class', t < TI ? 'ativo' : '');
      esterno.setAttribute('y', 122 - 8 * v);
      var a = Math.abs(fl);
      seta.setAttribute('d', fl < 0 ? 'M' + cx + ' 4 V58 m-9 -12 l9 12 l9 -12' : 'M' + cx + ' 58 V4 m-9 12 l9 -12 l9 12');
      seta.style.opacity = a < .05 ? 0 : (.25 + .75 * a).toFixed(2);
      setaT.textContent = a < .05 ? '' : fl < 0 ? 'ar entra' : 'ar sai';
      rDia.textContent = t < TI ? 'Diafragma contrai: desce e achata' : t < TP ? 'Diafragma contraído (abaixado)' : t < TE ? 'Diafragma relaxa: volta a subir' : 'Diafragma relaxado (em cúpula)';
      rInt2.textContent = t < TI ? '(intercostais externos)' : t >= TP && t < TE ? '(intercostais relaxam)' : ''; rInt.textContent = t < TI ? 'Costelas sobem' : t < TP ? '' : t < TE ? 'Costelas descem' : '';
      fase.textContent = nome; fase2.textContent = sub[0]; fase3.textContent = sub[1];
      vol.setAttribute('width', (230 * (.3 + .6 * v)).toFixed(1));
      var py = 228 - 30 * fl; pin.setAttribute('cy', py.toFixed(1)); pinL.setAttribute('y2', py.toFixed(1));
      pin.setAttribute('class', 'v-pin' + (fl < -.05 ? ' baixo' : fl > .05 ? ' alto' : ''));
      var L = fl < -.05 ? ['Volume aumentou, a pressão', 'interna caiu e ficou MENOR', 'que a atmosférica: o ar entra'] : fl > .05 ? ['Volume diminuiu, a pressão', 'interna subiu e ficou MAIOR', 'que a atmosférica: o ar sai'] : ['Pressão interna igual à', 'atmosférica: sem diferença,', 'o ar não se move'];
      pTxt.textContent = L[0]; pTxt2.textContent = L[1]; pTxt3.textContent = L[2];
    };
    return fimResposta(VIS.def['ventilacao'], svg, _desenha, 9, RESP, qid, { x: 376, y: 96, w: 258, semEsmaecer: true, marca: 'Resposta', congela: function (q) { return q === 'Wc0a1990' ? 6 : 2; } });
  }
};
VIS.liga('ventilacao', ['W7698f38', 'Wc0a1990', 'We47e9f6']);
