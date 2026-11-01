/* Controle da glicemia: foto real de ilhota de Langerhans (H&E); apos a refeicao, insulina (celulas beta) faz a
   glicose entrar nas celulas e virar glicogenio no figado e no musculo; em jejum, glucagon (celulas alfa) faz o figado
   quebrar glicogenio e soltar glicose; diabetes tipo 1 e o pancreas artificial (sensor + bomba). */
/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid). */
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
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
  };
}
var RESP = {
'W4ba8af6': [
'Por isso a resposta é B',
'Insulina (células beta) e glucagon (células alfa) são feitos nas ilhotas de',
'Langerhans, a parte endócrina do pâncreas, espalhada entre os ácinos.'
],
'W0333cb3': [
'Por isso a resposta é C',
'Glicogênio é um polímero de glicose guardado no fígado e nos músculos, e quem',
'manda montar esse estoque é a insulina. Glucagon e adrenalina mandam quebrar.'
],
'W4ee89b3': [
'Por isso a resposta é E',
'Glicose do fígado para o sangue (I): glucagon, que manda quebrar o glicogênio.',
'Glicose do sangue para o fígado (II): insulina, que manda montar o estoque.'
],
'Pa927e11': [
'Por isso a resposta é D',
'O aparelho faz o papel do pâncreas, que secreta os hormônios (o fígado só obedece):',
'insulina para baixar a glicemia e glucagon para subir.'
]
};
VIS.def['glicemia-insulina-glucagon'] = {
  tit: 'Glicemia: a insulina guarda, o glucagon solta',
  fontes: ['OpenStax, Biology 2e, 37.3 Regulation of Body Processes (Regulation of Blood Glucose Levels: insulina das células beta, glucagon das células alfa, glicogênio no fígado e no músculo; diabetes tipo 1) — https://openstax.org/books/biology-2e/pages/37-3-regulation-of-body-processes', 'OpenStax, Anatomy and Physiology 2e, 17.9 The Endocrine Pancreas (ilhotas de Langerhans entre os ácinos exócrinos) — https://openstax.org/books/anatomy-and-physiology-2e/pages/17-9-the-endocrine-pancreas', 'Wikipedia (en), Artificial pancreas (sensor de glicose + bomba de insulina, e versões bi-hormonais com glucagon) — https://en.wikipedia.org/wiki/Artificial_pancreas'],
  tipo: 'anim', dur: 11.2,
  marcas: [[0, '1. Ilhotas'], [2.8, '2. Refeição'], [5.6, '3. Jejum'], [8.4, '4. Tipo 1']],
  cred: 'Esquemas feitos para o app (fora de escala). Foto: ilhota de Langerhans no pâncreas humano, coloração hematoxilina-eosina, microscópio óptico; por Polarlys, CC BY 2.5, via Wikimedia Commons ("Langerhanssche Insel.jpg"), recortada.',
  nota: 'A glicemia sobe depois de comer: as células beta das ilhotas liberam insulina, a glicose entra nas células e o fígado e os músculos montam glicogênio (polímero de glicose). No jejum, as células alfa liberam glucagon e o fígado quebra o glicogênio e solta glicose no sangue. No diabetes tipo 1 as células beta são destruídas; o pâncreas artificial (sensor + bomba) faz o papel delas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    function hsh(i, s) { var x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); }
    svg.setAttribute('viewBox', '0 0 640 360');
    var INS = '#2b6cb0', GLU = '#d9822b', GLI = '#c9981f', FIG = '#8a4a3a', MUS = '#b5574a';
    var defs = el('defs', {});
    var cp = el('clipPath', { id: 'gli-cp' }, defs); el('rect', { x: 8, y: 8, width: 296, height: 222, rx: 8 }, cp);
    /* ===== etapa 1: foto ===== */
    var F = el('g', {});
    var im = el('image', { x: 8, y: 8, width: 296, height: 222, 'clip-path': 'url(#gli-cp)', preserveAspectRatio: 'xMidYMid slice' }, F);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'vis/glicemia-insulina-glucagon-1.webp'); im.setAttribute('href', 'vis/glicemia-insulina-glucagon-1.webp');
    var K = 296 / 640;
    function rot(px, py, bx, by, txt, cor, pai) {
      var a = [8 + px * K, 8 + py * K], w = txt.length * 7.3 + 14, g = el('g', {}, pai);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by > a[1] ? by : by + 22, style: 'stroke:#fff;stroke-width:4' }, g);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by > a[1] ? by : by + 22, style: 'stroke:' + cor + ';stroke-width:2' }, g);
      el('circle', { cx: a[0], cy: a[1], r: 9, style: 'fill:none;stroke:#fff;stroke-width:4' }, g);
      el('circle', { cx: a[0], cy: a[1], r: 9, style: 'fill:none;stroke:' + cor + ';stroke-width:2.2' }, g);
      el('rect', { x: bx, y: by, width: w, height: 22, rx: 6, style: 'fill:rgba(255,255,255,.94);stroke:' + cor + ';stroke-width:1.5' }, g);
      tx(bx + 7, by + 16, txt, 'font-size:13px;font-weight:700;fill:' + cor, g);
      return g;
    }
    var mk1 = rot(320, 210, 70, 16, 'ilhota de Langerhans', '#1f5f9e', F);
    var mk2 = rot(596, 420, 40, 198, 'ácino (parte exócrina)', '#6a2a7a', F);
    var fx = el('g', {}, F);
    tx(318, 28, 'Pâncreas ao microscópio', 'font-size:15px;font-weight:700;fill:var(--tinta)', fx);
    tx(318, 46, 'corte corado (H&E)', 'font-size:13px;fill:var(--lapis)', fx);
    tx(318, 80, 'Ilhota: células mais claras,', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', fx);
    tx(318, 97, 'parte endócrina (hormônios)', 'font-size:13.5px;fill:var(--tinta)', fx);
    tx(330, 118, 'células beta → insulina', 'font-size:13.5px;font-weight:700;fill:' + INS, fx);
    tx(330, 137, 'células alfa → glucagon', 'font-size:13.5px;font-weight:700;fill:' + GLU, fx);
    tx(318, 172, 'Ácinos: células mais roxas,', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', fx);
    tx(318, 189, 'parte exócrina: suco pancreático', 'font-size:13.5px;fill:var(--tinta)', fx);
    tx(318, 206, 'que vai para o intestino', 'font-size:13.5px;fill:var(--tinta)', fx);
    /* ===== etapas 2-4: esquema ===== */
    var E = el('g', {});
    /* pancreas / ilhota */
    el('rect', { x: 10, y: 34, width: 132, height: 140, rx: 18, style: 'fill:color-mix(in srgb,#e3b7c3 30%,var(--folha));stroke:#a8607a;stroke-width:2' }, E);
    tx(70, 24, 'ilhota do pâncreas', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', E);
    var BETA = [[40, 70], [62, 62], [84, 70], [50, 92], [74, 92], [96, 88]], ALFA = [[40, 136], [64, 144], [88, 136], [112, 146]];
    var beta = BETA.map(function (p) { return el('circle', { cx: p[0], cy: p[1], r: 10, style: 'fill:color-mix(in srgb,' + INS + ' 22%,var(--folha));stroke:' + INS + ';stroke-width:1.6' }, E); });
    ALFA.forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 10, style: 'fill:color-mix(in srgb,' + GLU + ' 22%,var(--folha));stroke:' + GLU + ';stroke-width:1.6' }, E); });
    tx(116, 72, 'β', 'font-size:16px;font-weight:700;fill:' + INS, E); tx(116, 124, 'α', 'font-size:16px;font-weight:700;fill:' + GLU, E);
    var xs = el('g', {}, E);
    BETA.forEach(function (p) { el('path', { d: 'M' + (p[0] - 7) + ' ' + (p[1] - 7) + ' l14 14 m0 -14 l-14 14', style: 'stroke:#b4442f;stroke-width:2.5' }, xs); });
    /* sangue */
    el('rect', { x: 150, y: 96, width: 326, height: 50, rx: 25, style: 'fill:color-mix(in srgb,#c0392b 14%,var(--folha));stroke:#b0605a;stroke-width:2' }, E);
    tx(166, 162, 'sangue', 'font-size:13.5px;font-weight:700;fill:#8e2a1e', E);
    var gli = []; for (var k = 0; k < 14; k++) gli.push(el('circle', { r: 5, style: 'fill:' + GLI + ';stroke:#8a6a10;stroke-width:1' }, E));
    /* medidor */
    el('rect', { x: 196, y: 24, width: 230, height: 14, rx: 7, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, E);
    el('rect', { x: 196, y: 24, width: 70, height: 14, rx: 7, style: 'fill:color-mix(in srgb,' + GLU + ' 25%,transparent)' }, E);
    el('rect', { x: 266, y: 24, width: 90, height: 14, style: 'fill:color-mix(in srgb,#3f8a52 22%,transparent)' }, E);
    el('rect', { x: 356, y: 24, width: 70, height: 14, rx: 7, style: 'fill:color-mix(in srgb,' + INS + ' 22%,transparent)' }, E);
    tx(190, 36, 'glicemia', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:end', E);
    tx(231, 56, 'baixa', 'font-size:13px;fill:var(--lapis);text-anchor:middle', E); tx(311, 56, 'normal', 'font-size:13px;fill:var(--lapis);text-anchor:middle', E); tx(391, 56, 'alta', 'font-size:13px;fill:var(--lapis);text-anchor:middle', E);
    var ptr = el('path', { d: 'M0 0 l-7 -10 h14 Z', style: 'fill:var(--tinta)' }, E);
    /* figado e musculo */
    el('path', { d: 'M486 30 C540 14 626 20 628 46 C630 84 590 104 540 104 C500 104 482 80 486 30 Z', style: 'fill:color-mix(in srgb,' + FIG + ' 22%,var(--folha));stroke:' + FIG + ';stroke-width:2' }, E);
    tx(600, 13, 'fígado', 'font-size:13.5px;font-weight:700;fill:' + FIG + ';text-anchor:middle', E);
    el('rect', { x: 490, y: 140, width: 136, height: 66, rx: 26, style: 'fill:color-mix(in srgb,' + MUS + ' 22%,var(--folha));stroke:' + MUS + ';stroke-width:2' }, E);
    tx(558, 224, 'músculo', 'font-size:13.5px;font-weight:700;fill:' + MUS + ';text-anchor:middle', E);
    /* glicogenio: arvore de pontos */
    function arvore(cx, cy, pai) {
      var g = el('g', {}, pai), P = [[0, 0], [10, -6], [20, -10], [30, -8], [10, 8], [20, 14], [30, 16], [-10, 4], [-20, 8], [40, -2], [24, 2]], L = [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [0, 7], [7, 8], [3, 9], [2, 10]];
      L.forEach(function (l) { el('line', { x1: cx + P[l[0]][0], y1: cy + P[l[0]][1], x2: cx + P[l[1]][0], y2: cy + P[l[1]][1], style: 'stroke:#8a6a10;stroke-width:1.5' }, g); });
      P.forEach(function (p) { el('circle', { cx: cx + p[0], cy: cy + p[1], r: 3.6, style: 'fill:' + GLI }, g); });
      return g;
    }
    var gF = arvore(536, 62, E), gM = arvore(546, 172, E);
    var lgF = tx(556, 96, 'glicogênio', 'font-size:13px;font-weight:700;fill:#8a6a10;text-anchor:middle', E);
    var aEnt = el('g', {}, E);
    el('path', { d: 'M440 104 C462 92 470 82 484 74 m-9 -1 l9 1 l-4 8', style: 'fill:none;stroke:' + GLI + ';stroke-width:3' }, aEnt);
    el('path', { d: 'M440 140 C462 150 470 158 488 166 m-9 1 l9 -1 l-5 -8', style: 'fill:none;stroke:' + GLI + ';stroke-width:3' }, aEnt);
    tx(400, 80, 'glicose entra', 'font-size:13px;font-weight:700;fill:#8a6a10;text-anchor:end', aEnt);
    var aSai = el('g', {}, E);
    el('path', { d: 'M490 86 C470 96 460 100 446 108 m9 1 l-9 -1 l4 -8', style: 'fill:none;stroke:' + GLI + ';stroke-width:3' }, aSai);
    tx(400, 80, 'glicose sai do fígado', 'font-size:13px;font-weight:700;fill:#8a6a10;text-anchor:end', aSai);
    /* hormonios */
    var hI = [0, 1, 2, 3].map(function () { return el('rect', { width: 9, height: 9, rx: 2, style: 'fill:' + INS }, E); });
    var hG = [0, 1, 2].map(function () { return el('path', { d: 'M0 -6 L6 5 L-6 5 Z', style: 'fill:' + GLU }, E); });
    var hIL = tx(170, 86, 'insulina', 'font-size:13.5px;font-weight:700;fill:' + INS, E);
    var hGL = tx(170, 186, 'glucagon', 'font-size:13.5px;font-weight:700;fill:' + GLU, E);
    /* aparelho (etapa 4) */
    var AP = el('g', {}, E);
    el('rect', { x: 230, y: 168, width: 196, height: 62, rx: 10, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.8' }, AP);
    tx(240, 188, 'sensor mede a glicemia', 'font-size:13px;font-weight:700;fill:var(--tinta)', AP);
    tx(240, 206, 'bomba libera insulina', 'font-size:13px;fill:' + INS, AP);
    tx(240, 221, 'ou glucagon', 'font-size:13px;fill:' + GLU, AP);
    el('path', { d: 'M328 168 V150 m-5 6 l5 -6 l5 6', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, AP);
    var t1L = el('g', {}, E); tx(10, 196, 'tipo 1: células β', 'font-size:13px;font-weight:700;fill:#b4442f', t1L); tx(10, 212, 'destruídas', 'font-size:13px;font-weight:700;fill:#b4442f', t1L);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(T) { P0.textContent = T[0]; P.forEach(function (p, i) { p.textContent = T[i + 1] || ''; }); }
    function nivel(t) {   /* 0 = baixa ... 1 = alta */
      if (t < 2.8) return .5;
      if (t < 5.6) { var u = t - 2.8; return u < .5 ? lerp(.5, .9, u / .5) : u < 1.4 ? .9 : lerp(.9, .5, ease((u - 1.4) / 1.2)); }
      if (t < 8.4) { u = t - 5.6; return u < .5 ? lerp(.5, .12, u / .5) : u < 1.4 ? .12 : lerp(.12, .5, ease((u - 1.4) / 1.2)); }
      u = t - 8.4; return u < 1.2 ? lerp(.5, .85, u / 1.2) : lerp(.85, .5, ease((u - 1.4) / 1.2));
    }
    var _desenha = function (t) {
      var f = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.4 ? 2 : 3, u = t - [0, 2.8, 5.6, 8.4][f];
      op(F, f === 0 ? 1 : 0); op(E, f > 0 ? cl((t - 2.8) / .3) : 0);
      if (f === 0) { op(mk1, cl((t - .4) / .3)); op(mk2, cl((t - 1.0) / .3)); }
      if (f === 0) { painel(['1. Ilhotas de Langerhans', 'O pâncreas é misto: ácinos fazem suco digestivo; as ilhotas, espalhadas', 'entre eles, fazem hormônios: insulina (células beta) e glucagon (células alfa).']); return; }
      var nv = nivel(t);
      ptr.setAttribute('transform', 'translate(' + lerp(200, 422, nv).toFixed(1) + ' 22)');
      var nG = Math.round(2 + 12 * nv);
      gli.forEach(function (c, i) {
        var x = 170 + hsh(i, 1) * 290 + 8 * Math.sin(t * 1.5 + i), y = 106 + hsh(i, 2) * 30;
        c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); op(c, i < nG ? 1 : 0);
      });
      /* insulina: das beta ate figado/musculo (etapa 2; etapa 4 vem do aparelho) */
      hI.forEach(function (r, i) {
        var a = f === 1 ? cl((u - .5 - i * .15) / 1.0) : f === 3 ? cl((u - .9 - i * .15) / 1.0) : 0;
        var x0 = f === 3 ? 328 : 96, y0 = f === 3 ? 150 : 80;
        var x = lerp(x0, i % 2 ? 494 : 490, a), y = lerp(y0, i % 2 ? 160 : 70, a);
        r.setAttribute('x', (x - 4.5).toFixed(1)); r.setAttribute('y', (y - 4.5).toFixed(1));
        op(r, (f === 1 || f === 3) && a > 0 && a < 1 ? 1 : 0);
      });
      op(hIL, f === 1 || f === 3 ? 1 : 0); op(hGL, f === 2 ? 1 : 0);
      hG.forEach(function (p, i) {
        var a = f === 2 ? cl((u - .5 - i * .15) / 1.0) : 0;
        p.setAttribute('transform', 'translate(' + lerp(96, 492, a).toFixed(1) + ' ' + lerp(140, 64, a).toFixed(1) + ')');
        op(p, f === 2 && a > 0 && a < 1 ? 1 : 0);
      });
      /* glicogenio: monta na etapa 2, quebra na 3 */
      var gv = f === 1 ? cl((u - 1.4) / .8) : f === 2 ? 1 - cl((u - 1.4) / .8) : .6;
      op(gF, .25 + .75 * gv); op(gM, f === 2 ? .9 : .25 + .75 * (f === 1 ? gv : .6)); op(lgF, 1);
      op(aEnt, f === 1 ? cl((u - 1.2) / .3) : 0); op(aSai, f === 2 ? cl((u - 1.2) / .3) : 0);
      beta.forEach(function (b) { b.style.opacity = f === 3 ? .35 : 1; });
      op(xs, f === 3 ? cl((u - .2) / .3) : 0); op(t1L, f === 3 ? cl((u - .2) / .3) : 0); op(AP, f === 3 ? cl((u - .6) / .3) : 0);
      if (f === 1) painel(['2. Depois da refeição: insulina', 'A glicemia sobe; as células beta liberam insulina. A glicose entra nas células,', 'e o fígado e os músculos montam glicogênio (polímero de glicose): a glicemia cai.']);
      else if (f === 2) painel(['3. Em jejum: glucagon', 'A glicemia cai; as células alfa liberam glucagon. O fígado quebra o glicogênio', 'e solta glicose no sangue: a glicemia volta a subir. (O músculo guarda o seu.)']);
      else painel(['4. Diabetes tipo 1 e o pâncreas artificial', 'O sistema imune destrói as células beta: falta insulina. O aparelho mede a', 'glicemia e libera o hormônio: faz o papel do pâncreas, não do fígado.']);
    };
    return fimResposta(VIS.def['glicemia-insulina-glucagon'], svg, _desenha, 11.2, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W4ba8af6' ? 2.75 : q === 'W0333cb3' ? 5.55 : q === 'W4ee89b3' ? 8.35 : 11.15; }
    });
  }
};
VIS.liga('glicemia-insulina-glucagon', ['Pa927e11', 'W4ba8af6', 'W4ee89b3', 'W0333cb3']);
