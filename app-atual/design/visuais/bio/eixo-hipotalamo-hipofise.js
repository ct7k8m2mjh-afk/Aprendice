/* Eixo hipotalamo-hipofise: adeno e neuro-hipofise; ADH e ocitocina descem pelos axonios e ficam na neuro-hipofise;
   hormonios liberadores vao pelo sistema porta a adeno-hipofise, que libera TSH, ACTH, LH/FSH, GH;
   glandulas-alvo (tireoide, cortex adrenal, testiculo) e feedback negativo. */
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
'W8da9966': [
'Por isso a resposta é C',
'A hipófise tem duas porções: adeno-hipófise (glandular) e neuro-hipófise (nervosa).',
'O hipotálamo fica logo acima e a comanda, mas não é parte dela.'
],
'Waf09884': [
'Por isso a resposta é C',
'Ocitocina e vasopressina (ADH) são feitas em neurônios do hipotálamo, descem',
'pelos axônios e ficam guardadas na neuro-hipófise até serem liberadas no sangue.'
],
'W71100bc': [
'Por isso a resposta é B',
'Só o ADH desce pelos axônios e fica armazenado na neuro-hipófise. TRH, GnRH,',
'PIF e GHRH vão pelo sistema porta e agem logo na adeno-hipófise (sem estoque).'
],
'W97497b8': [
'Por isso a resposta é A',
'ACTH, TSH e LH são feitos pela adeno-hipófise e agem em outras glândulas.',
'Glicocorticoides, T3/T4, calcitonina, PTH e adrenalina vêm de outras glândulas.'
],
'W564b0b0': [
'Por isso a resposta é C',
'O LH da adeno-hipófise estimula o testículo, que produz testosterona: ela faz',
'surgir e mantém os caracteres sexuais secundários masculinos.'
]
};
VIS.def['eixo-hipotalamo-hipofise'] = {
  tit: 'Hipotálamo e hipófise: quem fabrica, quem guarda e quem obedece',
  fontes: ['OpenStax, Biology 2e, 37.5 Endocrine Glands (hipotálamo e hipófise; neuro-hipófise armazena ADH e ocitocina feitos no hipotálamo; adeno-hipófise e hormônios tróficos) — https://openstax.org/books/biology-2e/pages/37-5-endocrine-glands', 'OpenStax, Biology 2e, 37.4 Regulation of Hormone Production (feedback negativo: T3/T4 inibem TRH e TSH) — https://openstax.org/books/biology-2e/pages/37-4-regulation-of-hormone-production', 'OpenStax, Anatomy and Physiology 2e, 17.3 The Pituitary Gland and Hypothalamus (sistema porta hipofisário) — https://openstax.org/books/anatomy-and-physiology-2e/pages/17-3-the-pituitary-gland-and-hypothalamus'],
  tipo: 'anim', dur: 13,
  marcas: [[0, '1. Porções'], [2.6, '2. Neuro'], [5.2, '3. Adeno'], [7.8, '4. Alvos'], [10.4, '5. Feedback']],
  cred: 'Animação feita para o app (esquema fora de escala, vista lateral: a frente da cabeça fica à esquerda).',
  nota: 'A neuro-hipófise é tecido nervoso: guarda e libera o ADH e a ocitocina, fabricados por neurônios do hipotálamo. A adeno-hipófise é glandular: recebe os hormônios liberadores do hipotálamo pelo sistema porta e fabrica hormônios tróficos (TSH, ACTH, LH, FSH), que comandam outras glândulas. O hormônio final freia o eixo (feedback negativo).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    function caminho(pts, u) {
      var L = [], tot = 0, k;
      for (k = 1; k < pts.length; k++) { var d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); L.push(d); tot += d; }
      var s = cl(u) * tot;
      for (k = 0; k < L.length; k++) { if (s <= L[k] || k === L.length - 1) { var w = L[k] ? cl(s / L[k]) : 0; return [lerp(pts[k][0], pts[k + 1][0], w), lerp(pts[k][1], pts[k + 1][1], w)]; } s -= L[k]; }
    }
    svg.setAttribute('viewBox', '0 0 640 360');
    var HIP = '#9a7ab0', ADE = '#d98a7a', NEU = '#e9dcc4', SANG = '#c0392b', LIB = '#2b6cb0', TRO = '#c9581e', ADH = '#3f8a52', FB = '#b4442f';
    /* ===== lado esquerdo: hipotalamo e hipofise ===== */
    var hip = el('path', { d: 'M28 22 Q160 -4 292 22 Q300 64 240 74 L176 76 Q150 76 130 74 L70 74 Q20 66 28 22 Z', style: 'fill:color-mix(in srgb,' + HIP + ' 18%,var(--folha));stroke:' + HIP + ';stroke-width:2' });
    tx(162, 54, 'hipotálamo', 'font-size:14px;font-weight:700;fill:#5d3f78;text-anchor:middle');
    el('path', { d: 'M136 74 C138 96 140 110 128 126 M178 74 C176 96 178 110 190 124', style: 'fill:none;stroke:#b8a888;stroke-width:2' });
    var ade = el('ellipse', { cx: 104, cy: 162, rx: 62, ry: 44, style: 'fill:color-mix(in srgb,' + ADE + ' 30%,var(--folha));stroke:#a85a4a;stroke-width:2' });
    var neu = el('ellipse', { cx: 204, cy: 160, rx: 42, ry: 40, style: 'fill:' + NEU + ';stroke:#a8946a;stroke-width:2' });
    var lAde = el('g', {}); tx(104, 222, 'adeno-hipófise', 'font-size:13.5px;font-weight:700;fill:#8a3e30;text-anchor:middle', lAde); tx(104, 236, '(glandular)', 'font-size:13px;fill:#8a3e30;text-anchor:middle', lAde);
    var lNeu = el('g', {}); tx(218, 222, 'neuro-hipófise', 'font-size:13.5px;font-weight:700;fill:#6a5a30;text-anchor:middle', lNeu); tx(218, 236, '(nervosa)', 'font-size:13px;fill:#6a5a30;text-anchor:middle', lNeu);
    /* neuronios do ADH/ocitocina */
    var nADH = el('g', {});
    el('path', { d: 'M226 44 C210 70 182 92 196 140 M206 46 C196 72 176 96 188 146', style: 'fill:none;stroke:' + ADH + ';stroke-width:2.5' }, nADH);
    el('circle', { cx: 226, cy: 42, r: 8, style: 'fill:' + ADH }, nADH); el('circle', { cx: 206, cy: 44, r: 8, style: 'fill:' + ADH }, nADH);
    [[196, 144], [188, 150]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 6, style: 'fill:color-mix(in srgb,' + ADH + ' 40%,var(--folha));stroke:' + ADH + ';stroke-width:1.5' }, nADH); });
    var nLIB = el('g', {});
    el('path', { d: 'M112 46 C118 60 124 72 128 84', style: 'fill:none;stroke:' + LIB + ';stroke-width:2.5' }, nLIB);
    el('circle', { cx: 112, cy: 40, r: 8, style: 'fill:' + LIB }, nLIB);
    /* sistema porta */
    var porta = el('path', { d: 'M120 84 C140 80 140 92 132 100 C124 110 122 118 112 132 C104 144 96 150 90 160 M112 132 C120 146 124 156 116 172', style: 'fill:none;stroke:' + SANG + ';stroke-width:3' });
    var portaL = el('g', {}); tx(4, 112, 'sistema', 'font-size:13px;font-weight:600;fill:' + SANG, portaL); tx(4, 127, 'porta', 'font-size:13px;font-weight:600;fill:' + SANG, portaL);
    el('line', { x1: 50, y1: 116, x2: 118, y2: 116, style: 'stroke:' + SANG + ';stroke-width:1.2' }, portaL);
    var gADH = [0, 1, 2, 3].map(function () { return el('circle', { r: 4, style: 'fill:' + ADH }); });
    var gLIB = [0, 1, 2].map(function () { return el('circle', { r: 4, style: 'fill:' + LIB }); });
    var gTRO = [0, 1, 2, 3].map(function () { return el('circle', { r: 4.5, style: 'fill:' + TRO }); });
    var lb1 = el('g', {}); tx(232, 96, 'ADH e', 'font-size:13px;font-weight:700;fill:' + ADH, lb1); tx(232, 111, 'ocitocina', 'font-size:13px;font-weight:700;fill:' + ADH, lb1);
    var lb2 = el('g', {}); tx(30, 36, 'TRH, CRH,', 'font-size:13px;font-weight:700;fill:' + LIB, lb2); tx(30, 51, 'GnRH...', 'font-size:13px;font-weight:700;fill:' + LIB, lb2);
    /* ===== lado direito ===== */
    el('line', { x1: 312, x2: 312, y1: 8, y2: 232, style: 'stroke:var(--linha);stroke-width:1.5' });
    var D2 = el('g', {});
    tx(326, 30, 'Guardados na neuro-hipófise:', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', D2);
    el('rect', { x: 326, y: 46, width: 300, height: 66, rx: 10, style: 'fill:color-mix(in srgb,' + ADH + ' 10%,var(--folha));stroke:' + ADH + ';stroke-width:1.8' }, D2);
    tx(338, 68, 'ADH (vasopressina) → rim', 'font-size:14px;font-weight:700;fill:var(--tinta)', D2);
    tx(338, 88, 'reabsorve mais água: urina', 'font-size:13.5px;fill:var(--tinta)', D2); tx(338, 105, 'concentrada', 'font-size:13.5px;fill:var(--tinta)', D2);
    el('rect', { x: 326, y: 124, width: 300, height: 66, rx: 10, style: 'fill:color-mix(in srgb,' + ADH + ' 10%,var(--folha));stroke:' + ADH + ';stroke-width:1.8' }, D2);
    tx(338, 146, 'ocitocina → útero e mamas', 'font-size:14px;font-weight:700;fill:var(--tinta)', D2);
    tx(338, 166, 'contrações do parto e', 'font-size:13.5px;fill:var(--tinta)', D2); tx(338, 183, 'saída do leite', 'font-size:13.5px;fill:var(--tinta)', D2);
    tx(326, 214, 'feitos no hipotálamo, não na hipófise', 'font-size:13.5px;font-weight:700;fill:' + ADH, D2);
    var D3 = el('g', {});
    tx(363, 22, 'hipófise', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', D3);
    var D4h = el('g', {}); tx(475, 22, 'glândula-alvo', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', D4h); tx(540, 22, 'produz', 'font-size:14px;font-weight:700;fill:var(--tinta)', D4h);
    var ROWS = [['TSH', 'tireoide', 'T3 e T4'], ['ACTH', 'córtex adrenal', 'cortisol'], ['LH, FSH', 'testículo', 'testosterona'], ['', 'ovário', 'estrógeno']];
    var rows = ROWS.map(function (r, i) {
      var y = 36 + i * 42, g = el('g', {}), a = el('g', {}, g), b = el('g', {}, g);
      if (r[0]) { el('rect', { x: 326, y: y, width: 74, height: 30, rx: 8, style: 'fill:color-mix(in srgb,' + TRO + ' 14%,var(--folha));stroke:' + TRO + ';stroke-width:1.8' }, a); tx(363, y + 20, r[0], 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', a); }
      el('path', { d: 'M' + (r[0] ? 402 : 380) + ' ' + (r[0] ? y + 15 : y - 6) + (r[0] ? ' H418' : ' Q380 ' + (y + 15) + ' 418 ' + (y + 15)) + ' m-6 -5 l6 5 l-6 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, b);
      el('rect', { x: 420, y: y, width: 110, height: 30, rx: 8, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.5' }, b);
      tx(475, y + 20, r[1], 'font-size:13.5px;font-weight:600;fill:var(--tinta);text-anchor:middle', b);
      el('path', { d: 'M532 ' + (y + 15) + ' H544 m-6 -5 l6 5 l-6 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, b);
      var p = tx(548, y + 20, r[2], 'font-size:14px;font-weight:700;fill:' + FB, b);
      return { g: g, a: a, b: b, p: p };
    });
    var gh = tx(326, 214, 'GH e prolactina: agem direto em tecidos', 'font-size:13.5px;fill:var(--lapis)');
    var fb = el('g', {});
    el('path', { d: 'M592 34 C592 6 340 2 262 30', style: 'fill:none;stroke:' + FB + ';stroke-width:2.2;stroke-dasharray:6 4' }, fb);
    el('path', { d: 'M268 22 l-8 9 l11 2', style: 'fill:none;stroke:' + FB + ';stroke-width:2.2' }, fb);
    el('path', { d: 'M300 24 C306 60 304 96 270 102 C220 108 184 112 160 130', style: 'fill:none;stroke:' + FB + ';stroke-width:2.2;stroke-dasharray:6 4' }, fb);
    el('path', { d: 'M162 119 l-3 12 l12 0', style: 'fill:none;stroke:' + FB + ';stroke-width:2.2' }, fb);
    var m1 = el('circle', { cx: 300, cy: 16, r: 9, style: 'fill:' + FB }, fb); tx(300, 20.5, '−', 'font-size:15px;font-weight:700;fill:#fff;text-anchor:middle', fb);
    el('circle', { cx: 252, cy: 104, r: 9, style: 'fill:' + FB }, fb); tx(252, 108.5, '−', 'font-size:15px;font-weight:700;fill:#fff;text-anchor:middle', fb);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 268, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 292 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(T) { P0.textContent = T[0]; P.forEach(function (p, i) { p.textContent = T[i + 1] || ''; }); }
    var CADH = [[[206, 44], [196, 72], [178, 100], [188, 146]], [[226, 42], [210, 70], [190, 96], [196, 140]]];
    var CLIB = [[112, 42], [120, 62], [126, 84], [134, 98], [112, 132], [96, 154]];
    var _desenha = function (t) {
      var f = t < 2.6 ? 0 : t < 5.2 ? 1 : t < 7.8 ? 2 : t < 10.4 ? 3 : 4;
      ade.style.strokeWidth = f === 0 || f === 2 ? 3.5 : 2; neu.style.strokeWidth = f === 0 || f === 1 ? 3.5 : 2;
      op(lAde, 1); op(lNeu, 1);
      op(nADH, f === 1 ? 1 : f === 0 ? .25 : .3); op(lb1, f === 1 ? 1 : 0);
      op(nLIB, f >= 2 ? 1 : f === 0 ? .25 : .3); op(porta, f >= 2 ? 1 : .3); op(portaL, f === 2 ? 1 : 0); op(lb2, f === 2 ? 1 : 0);
      gADH.forEach(function (c, i) {
        var u = ((t - 2.7) / 1.6 - i * .22), p;
        if (u < 1) p = caminho(CADH[i % 2], u); else { var v = cl((u - 1) / .6); p = [lerp(190, 248, v) + (i % 2) * 6, lerp(148, 176, v)]; }
        c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1));
        op(c, f === 1 && u > 0 ? (u > 1.4 ? 1 - cl((u - 1.4) / .2) : 1) : 0);
      });
      gLIB.forEach(function (c, i) {
        var u = (t - 5.3) / 1.4 - i * .25, p = caminho(CLIB, u);
        c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1)); op(c, f === 2 && u > 0 && u < 1 ? 1 : 0);
      });
      gTRO.forEach(function (c, i) {
        var u = cl((t - 6.7 - i * .15) / .9), y = i < 3 ? 36 + i * 42 + 15 : 36 + 2 * 42 + 15;
        var p = caminho([[130, 150], [152, 110], [262, 102], [300, y], [322, y]], u);
        c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1)); op(c, f === 2 && u > 0 && u < 1 ? 1 : 0);
      });
      op(D2, f === 1 ? cl((t - 3.4) / .4) : 0);
      op(D3, f === 2 || f === 3 ? 1 : 0);
      rows.forEach(function (r, i) {
        op(r.g, f >= 2 ? 1 : 0);
        op(r.a, f >= 2 ? cl((t - 6.8 - i * .2) / .3) : 0);
        op(r.b, f >= 3 ? cl((t - 7.9 - i * .35) / .3) : 0);
        r.p.style.fill = f === 4 && i === 0 ? FB : 'var(--tinta)';
      });
      op(D4h, f === 3 ? cl((t - 7.9) / .3) : 0);
      op(gh, f === 3 ? cl((t - 9.4) / .3) : 0);
      op(fb, f === 4 ? cl((t - 10.5) / .4) : 0);
      if (f === 0) painel(['1. A hipófise tem duas porções', 'Adeno-hipófise (frente): tecido glandular, fabrica hormônios.', 'Neuro-hipófise (trás): tecido nervoso. O hipotálamo, acima, é parte do encéfalo.']);
      else if (f === 1) painel(['2. Neuro-hipófise: só guarda e libera', 'Neurônios do hipotálamo fabricam ADH e ocitocina; eles descem pelos axônios', 'e ficam armazenados nas pontas, na neuro-hipófise, até irem para o sangue.']);
      else if (f === 2) painel(['3. Adeno-hipófise: fabrica, sob comando', 'Hormônios liberadores do hipotálamo vão pelo sistema porta e agem na hora,', 'sem estoque. A adeno-hipófise responde liberando TSH, ACTH, LH, FSH e outros.']);
      else if (f === 3) painel(['4. Hormônios tróficos comandam outras glândulas', 'TSH → tireoide (T3, T4); ACTH → córtex adrenal (cortisol);', 'LH e FSH → gônadas: o testículo faz testosterona (caracteres masculinos).']);
      else painel(['5. Feedback negativo', 'Muito T3 e T4 no sangue freiam o hipotálamo (menos TRH) e a adeno-hipófise', '(menos TSH). Pouco T3 e T4 solta o freio. O eixo se autorregula.']);
    };
    return fimResposta(VIS.def['eixo-hipotalamo-hipofise'], svg, _desenha, 13, RESP, qid, {
      semEsmaecer: true, x: 8, y: 246, w: 624, h: 110,
      congela: function (q) { return q === 'W8da9966' ? 2.55 : (q === 'Waf09884' || q === 'W71100bc') ? 5.15 : 10.35; }
    });
  }
};
VIS.liga('eixo-hipotalamo-hipofise', ['W8da9966', 'Waf09884', 'W71100bc', 'W97497b8', 'W564b0b0']);
