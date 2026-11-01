/* Replicacao semiconservativa: helicase abre a dupla helice, nucleotideos pareiam com cada molde,
   DNA-polimerase liga; cada filha = 1 fita antiga + 1 nova. Depois, os tubos de Meselson-Stahl. */
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
'Wbee01fd': [
'Por isso a resposta é E',
'Cada molécula filha sai com 1 fita antiga (azul) + 1 fita nova (laranja):',
'metade da molécula original é conservada. Isso é a replicação semiconservativa.'
],
'Wf1dfe13': [
'Por isso a resposta é B',
'Primeiro rompem as ligações entre as bases (I); depois os nucleotídeos',
'pareiam com o molde (III); só então a DNA-polimerase os liga (II).'
],
'W9af49cf': [
'Por isso a resposta é C',
'1ª geração: só a faixa intermediária (¹⁵N + ¹⁴N); 2ª: intermediária + leve.',
'Cada filha tem 1 fita parental + 1 recém-sintetizada: semiconservativa.'
]
};
VIS.def['replicacao-semiconservativa'] = {
  tit: 'Replicação do DNA: cada molécula filha guarda uma fita antiga',
  fontes: ['OpenStax, Biology 2e, 14.3 Basics of DNA Replication (modelos conservativo, semiconservativo e dispersivo; experimento de Meselson e Stahl) — https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication', 'OpenStax, Biology 2e, 14.4 DNA Replication in Prokaryotes (helicase rompe as ligações de hidrogênio; DNA-polimerase liga os nucleotídeos pareados ao molde) — https://openstax.org/books/biology-2e/pages/14-4-dna-replication-in-prokaryotes', 'Wikipedia (en), Meselson–Stahl experiment — https://en.wikipedia.org/wiki/Meselson%E2%80%93Stahl_experiment'],
  tipo: 'anim', dur: 11.8,
  marcas: [[0, '1. Abrir'], [2.8, '2. Parear'], [5.2, '3. Ligar'], [7.8, '4. Tubos']],
  cred: 'Animação feita para o app (esquema fora de escala; a dupla hélice foi desenhada reta e a abertura mostrada de uma vez, sem os detalhes da forquilha).',
  nota: 'Na replicação a helicase separa as fitas rompendo as ligações de hidrogênio entre as bases; cada fita serve de molde, os nucleotídeos livres pareiam (A com T, C com G) e a DNA-polimerase os liga. Cada molécula filha tem uma fita antiga e uma nova: replicação semiconservativa, confirmada por Meselson e Stahl em 1958.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 360');
    var VELHA = '#2f4f7f', NOVA = '#d9822b', HEL = '#3f8a52', POL = '#8a5a9e';
    var COR = { A: '#5a9e6f', T: '#c75b4a', C: '#5f86c9', G: '#c9981f' }, PAR = { A: 'T', T: 'A', C: 'G', G: 'C' };
    var SEQ = 'ATGCCATGACTG'.split(''), N = SEQ.length, X0 = 44, DX = 42;
    function xb(i) { return X0 + i * DX; }
    /* ===== cena A: a forquilha ===== */
    var A = el('g', {});
    var chips = [['1', 'ruptura das ligações H'], ['2', 'pareamento'], ['3', 'ligação (polimerase)']].map(function (c, i) {
      var g = el('g', {}, A), x = 14 + i * 206;
      var r = el('rect', { x: x, y: 6, width: 196, height: 26, rx: 13, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, g);
      el('circle', { cx: x + 15, cy: 19, r: 9, style: 'fill:var(--ad-c)' }, g);
      tx(x + 15, 23.5, c[0], 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g);
      tx(x + 30, 24, c[1], 'font-size:13.5px;font-weight:600;fill:var(--tinta)', g);
      return { g: g, r: r };
    });
    /* fechado: T em 112, B em 152; aberto: T em 58, B em 206 */
    var TC = 112, BC = 152, TA = 58, BA = 206;
    function o(x, t) { var hx = lerp(-10, 720, cl(t / 2.6)); return ease(cl((hx - x) / 70)); }
    var bbT = el('path', { style: 'fill:none;stroke:' + VELHA + ';stroke-width:5;stroke-linecap:round' }, A);
    var bbB = el('path', { style: 'fill:none;stroke:' + VELHA + ';stroke-width:5;stroke-linecap:round' }, A);
    var nvT = el('path', { style: 'fill:none;stroke:' + NOVA + ';stroke-width:5;stroke-linecap:round' }, A);
    var nvB = el('path', { style: 'fill:none;stroke:' + NOVA + ';stroke-width:5;stroke-linecap:round' }, A);
    function base(L, pai) {
      var g = el('g', {}, pai);
      el('rect', { x: -10, y: 0, width: 20, height: 18, rx: 3, style: 'fill:' + COR[L] }, g);
      tx(0, 13.5, L, 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g);
      return g;
    }
    var bT = [], bB = [], hb = [], nT = [], nB = [];
    SEQ.forEach(function (L, i) {
      hb.push(el('line', { x1: xb(i) - 4, x2: xb(i) - 4, y1: 130, y2: 134, style: 'stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:2 2' }, A));
      bT.push(base(L, A)); bB.push(base(PAR[L], A));
      nT.push(base(PAR[L], A)); nB.push(base(L, A));
    });
    var hel = el('g', {}, A);
    el('ellipse', { cx: 0, cy: 0, rx: 15, ry: 30, style: 'fill:color-mix(in srgb,' + HEL + ' 30%,var(--folha));stroke:' + HEL + ';stroke-width:2.5' }, hel);
    var helL = tx(0, 0, 'helicase', 'font-size:13px;font-weight:700;fill:' + HEL + ';text-anchor:middle', A);
    var pol1 = el('rect', { width: 34, height: 26, rx: 12, style: 'fill:color-mix(in srgb,' + POL + ' 30%,var(--folha));stroke:' + POL + ';stroke-width:2.2' }, A);
    var pol2 = el('rect', { width: 34, height: 26, rx: 12, style: 'fill:color-mix(in srgb,' + POL + ' 30%,var(--folha));stroke:' + POL + ';stroke-width:2.2' }, A);
    var polL = tx(530, 134, 'DNA-polimerase', 'font-size:13px;font-weight:700;fill:' + POL, A);
    var m1 = el('g', {}, A); tx(538, 70, 'molécula 1', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', m1); tx(538, 87, 'antiga + nova', 'font-size:13px;fill:var(--lapis)', m1);
    var m2 = el('g', {}, A); tx(538, 186, 'molécula 2', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', m2); tx(538, 203, 'nova + antiga', 'font-size:13px;fill:var(--lapis)', m2);
    var leg = el('g', {}, A);
    el('line', { x1: 16, x2: 40, y1: 226, y2: 226, style: 'stroke:' + VELHA + ';stroke-width:5;stroke-linecap:round' }, leg);
    tx(48, 230.5, 'fita antiga (molde)', 'font-size:13px;fill:var(--tinta)', leg);
    el('line', { x1: 196, x2: 220, y1: 226, y2: 226, style: 'stroke:' + NOVA + ';stroke-width:5;stroke-linecap:round' }, leg);
    tx(228, 230.5, 'fita nova', 'font-size:13px;fill:var(--tinta)', leg);
    tx(330, 230.5, 'pares: A–T e C–G', 'font-size:13px;fill:var(--lapis)', leg);
    /* ===== cena B: tubos ===== */
    var B = el('g', {});
    var YL = 104, YI = 140, YP = 176, BAND = '#4b4b86';
    var tubos = [['geração 0', 'só ¹⁵N'], ['1ª geração', 'em ¹⁴N'], ['2ª geração', 'em ¹⁴N']].map(function (l, i) {
      var cx = 62 + i * 84, g = el('g', {}, B);
      tx(cx, 22, l[0], 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      tx(cx, 38, l[1], 'font-size:13px;fill:var(--lapis);text-anchor:middle', g);
      el('path', { d: 'M' + (cx - 22) + ' 48 V196 a22 22 0 0 0 44 0 V48', style: 'fill:color-mix(in srgb,var(--lapis) 8%,var(--folha));stroke:var(--tinta);stroke-width:1.8' }, g);
      return { g: g, cx: cx };
    });
    function banda(cx, y) { return el('rect', { x: cx - 17, y: y - 4, width: 34, height: 8, rx: 4, style: 'fill:' + BAND }, B); }
    var bd0 = banda(tubos[0].cx, YP), bd1 = banda(tubos[1].cx, YI), bd2a = banda(tubos[2].cx, YI), bd2b = banda(tubos[2].cx, YL);
    function mol(x, y, c1, c2, pai) { el('line', { x1: x, x2: x + 26, y1: y - 4, y2: y - 4, style: 'stroke:' + c1 + ';stroke-width:4;stroke-linecap:round' }, pai); el('line', { x1: x, x2: x + 26, y1: y + 4, y2: y + 4, style: 'stroke:' + c2 + ';stroke-width:4;stroke-linecap:round' }, pai); }
    var lg = el('g', {}, B);
    [[YL, NOVA, NOVA, 'leve', '¹⁴N / ¹⁴N'], [YI, VELHA, NOVA, 'intermediária', '¹⁵N / ¹⁴N'], [YP, VELHA, VELHA, 'pesada', '¹⁵N / ¹⁵N']].forEach(function (r) {
      el('line', { x1: 252, x2: 278, y1: r[0], y2: r[0], style: 'stroke:var(--linha);stroke-width:1.2;stroke-dasharray:3 3' }, lg);
      mol(284, r[0], r[1], r[2], lg);
      tx(318, r[0] - 2, r[3], 'font-size:13.5px;font-weight:700;fill:var(--tinta)', lg);
      tx(318, r[0] + 14, r[4], 'font-size:13px;fill:var(--lapis)', lg);
    });
    tx(262, 216, 'azul = fita com ¹⁵N (antiga)', 'font-size:13px;fill:var(--lapis)', lg);
    var cmp = el('g', {}, B);
    el('rect', { x: 456, y: 8, width: 176, height: 220, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5;stroke-dasharray:5 4' }, cmp);
    tx(544, 30, 'Se fosse conservativa', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', cmp);
    tx(544, 47, '(1ª geração)', 'font-size:13px;fill:var(--lapis);text-anchor:middle', cmp);
    el('path', { d: 'M482 58 V178 a18 18 0 0 0 36 0 V58', style: 'fill:color-mix(in srgb,var(--lapis) 8%,var(--folha));stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:4 3' }, cmp);
    el('rect', { x: 486, y: YL - 4, width: 28, height: 8, rx: 4, style: 'fill:none;stroke:' + BAND + ';stroke-width:2;stroke-dasharray:3 2' }, cmp);
    el('rect', { x: 486, y: YP - 4, width: 28, height: 8, rx: 4, style: 'fill:none;stroke:' + BAND + ';stroke-width:2;stroke-dasharray:3 2' }, cmp);
    tx(528, YL + 5, '2 faixas:', 'font-size:13px;fill:var(--tinta)', cmp);
    tx(528, YL + 21, 'leve e', 'font-size:13px;fill:var(--tinta)', cmp);
    tx(528, YL + 37, 'pesada', 'font-size:13px;fill:var(--tinta)', cmp);
    tx(544, 214, 'não foi o que se viu', 'font-size:13px;font-weight:700;fill:#b4442f;text-anchor:middle', cmp);
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(L) { P0.textContent = L[0]; P.forEach(function (p, i) { p.textContent = L[i + 1] || ''; }); }
    function tr(g, x, y) { g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    var _desenha = function (t) {
      var fase = t < 2.8 ? 0 : t < 5.2 ? 1 : t < 7.8 ? 2 : 3;
      var aA = t < 7.8 ? 1 : 1 - cl((t - 7.8) / .4), aB = cl((t - 8) / .4);
      op(A, aA); op(B, aB); A.style.display = aA <= 0 ? 'none' : ''; B.style.display = aB <= 0 ? 'none' : '';
      chips.forEach(function (c, i) {
        var on = fase >= i && fase < 3;
        c.r.setAttribute('style', 'fill:' + (on ? 'color-mix(in srgb,var(--ad-c) 16%,var(--folha))' : 'var(--folha)') + ';stroke:' + (fase === i ? 'var(--ad-c)' : 'var(--linha)') + ';stroke-width:' + (fase === i ? 2.4 : 1.5));
        op(c.g, on ? 1 : .35);
      });
      /* esqueletos antigos */
      var dT = '', dB = '';
      for (var x = X0 - 18; x <= xb(N - 1) + 18; x += 6) {
        var u = o(x, t);
        dT += (dT ? 'L' : 'M') + x + ' ' + lerp(TC, TA, u).toFixed(1) + ' ';
        dB += (dB ? 'L' : 'M') + x + ' ' + lerp(BC, BA, u).toFixed(1) + ' ';
      }
      bbT.setAttribute('d', dT); bbB.setAttribute('d', dB);
      SEQ.forEach(function (L, i) {
        var x = xb(i), u = o(x, t), yT = lerp(TC, TA, u), yB = lerp(BC, BA, u);
        tr(bT[i], x, yT); tr(bB[i], x, yB - 18);
        op(hb[i], 1 - cl(u * 4));
        /* pareamento: nucleotideo livre chega */
        var a = cl((t - 2.95 - i * .13) / .55), e = ease(a);
        var vy = (i % 2 ? 1 : -1);
        tr(nT[i], x + (1 - e) * 26 * vy, TA + 20 + (1 - e) * 26);
        tr(nB[i], x - (1 - e) * 26 * vy, BA - 38 - (1 - e) * 26);
        op(nT[i], t < 2.95 + i * .13 ? 0 : cl(a * 2)); op(nB[i], t < 2.95 + i * .13 ? 0 : cl(a * 2));
      });
      /* polimerase liga: fita de cima da esquerda para a direita, a de baixo no sentido oposto (fitas antiparalelas) */
      var p = cl((t - 5.3) / 2.1), xa = X0 - 18, xz = xb(N - 1) + 18;
      var x1 = lerp(xa, xz, p), x2 = lerp(xz, xa, p);
      nvT.setAttribute('d', p > 0 ? 'M' + xa + ' ' + (TA + 40) + ' H' + x1.toFixed(1) : '');
      nvB.setAttribute('d', p > 0 ? 'M' + xz + ' ' + (BA - 40) + ' H' + x2.toFixed(1) : '');
      pol1.setAttribute('x', (x1 - 17).toFixed(1)); pol1.setAttribute('y', TA + 27);
      pol2.setAttribute('x', (x2 - 17).toFixed(1)); pol2.setAttribute('y', BA - 53);
      var pv = t > 5.25 && p < 1 ? 1 : 0; op(pol1, pv); op(pol2, pv); op(polL, t > 5.25 && t < 7.6 ? 1 : 0);
      polL.setAttribute('x', 538); polL.setAttribute('y', 132);
      op(m1, cl((t - 7.3) / .3)); op(m2, cl((t - 7.3) / .3));
      var hx = lerp(-10, 720, cl(t / 2.6));
      tr(hel, hx, (TC + BC) / 2 - 2); op(hel, hx > 20 && hx < 560 ? 1 : 0);
      helL.setAttribute('x', Math.min(hx, 520).toFixed(1)); helL.setAttribute('y', (TC + BC) / 2 - 40); op(helL, hx > 20 && hx < 560 ? 1 : 0);
      /* tubos */
      op(tubos[0].g, cl((t - 8) / .3)); op(bd0, cl((t - 8.3) / .3));
      op(tubos[1].g, cl((t - 8.8) / .3)); op(bd1, cl((t - 9.1) / .3));
      op(tubos[2].g, cl((t - 9.6) / .3)); op(bd2a, cl((t - 9.9) / .3)); op(bd2b, cl((t - 9.9) / .3));
      op(lg, cl((t - 8.3) / .3)); op(cmp, cl((t - 10.4) / .4));
      if (fase === 0) painel(['1. A dupla hélice se abre', 'A helicase rompe as ligações de hidrogênio entre as bases pareadas.', 'As duas fitas se separam e cada uma passa a servir de molde.']);
      else if (fase === 1) painel(['2. Pareamento', 'Nucleotídeos livres encaixam em cada molde: A com T, C com G.', 'Primeiro o encaixe: é ele que faz a fita nova copiar o molde certo.']);
      else if (fase === 2) painel(['3. Ligação: DNA-polimerase', 'A DNA-polimerase liga cada nucleotídeo novo ao anterior.', 'Resultado: 2 moléculas, cada uma com 1 fita antiga + 1 nova (semiconservativa).']);
      else painel(['4. Experimento de Meselson e Stahl (1958)', 'DNA todo com ¹⁵N (pesado) passa a ser copiado em meio com ¹⁴N (leve).', 'Na centrífuga o DNA faz faixas pela densidade: pesado embaixo, leve em cima.', '1ª geração: só intermediária; 2ª: intermediária + leve. Só a semiconservativa explica.']);
      if (fase === 3) { P0.textContent = '4. Meselson e Stahl (1958): bactérias com ¹⁵N passam a ¹⁴N'; P[0].textContent = 'Centrifugado, o DNA forma faixas pela densidade: pesado embaixo, leve em cima.'; P[1].textContent = '1ª geração: uma faixa só, intermediária. 2ª: intermediária + leve.'; P[2].textContent = 'Conservativa daria 2 faixas já na 1ª; dispersiva nunca daria a faixa leve.'; }
    };
    return fimResposta(VIS.def['replicacao-semiconservativa'], svg, _desenha, 11.8, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W9af49cf' ? 11.7 : 7.7; }
    });
  }
};
VIS.liga('replicacao-semiconservativa', ['Wbee01fd', 'Wf1dfe13', 'W9af49cf']);
