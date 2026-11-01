/* Cromossomo: duplicacao (cromatides-irmas), homologos (pai x mae, mesmos genes, alelos podem diferir),
   condensacao maxima na metafase, cariotipo humano real (22 pares de autossomos + XY) e tetrade na meiose I. */
function quebra(s, n) { var p = s.split(' '), L = [], a = ''; p.forEach(function (w) { if (a && (a + ' ' + w).length > n) { L.push(a); a = w; } else a = a ? a + ' ' + w : w; }); if (a) L.push(a); return L; }
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js): congela o quadro que decide a questao aberta.
   Aqui o cartao ocupa o lugar do painel de texto (opc.esconde) e o desenho fica visivel ao lado. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var L = []; r.slice(1).forEach(function (s) { L = L.concat(opc.quebra ? quebra(s, opc.quebra) : [s]); });
  var lh = 22, w = opc.w || 520, h = 78 + lh * (L.length - 1), x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 16, y: y + 31, style: 'font-size:17px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  L.forEach(function (s, i) { var t = el('text', { x: x + 16, y: y + 58 + lh * i, style: 'font-size:14.5px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde) opc.esconde.style.opacity = on ? 0 : 1;
  };
}
var RESP = {
  'P4de2843': ['Por isso a resposta é C', 'Os pares 1 a 22 são os autossomos; X e Y são os sexuais. Livros de mesmo número são homólogos (não cromátides-irmãs) e podem ter alelos diferentes.'],
  'W5af8b58': ['Por isso a resposta é A', 'O retrato do número, tamanho e forma dos cromossomos da espécie é o cariótipo.', 'Cromátide e centrômero são partes de um cromossomo.'],
  'Wc4b81b5': ['Por isso a resposta é E', 'A condensação cresce na prófase e chega ao máximo na metáfase: é a fase usada para montar o cariótipo.'],
  'W5058122': ['Por isso a resposta é D', 'Cada tétrade é um par de homólogos (4 cromátides). 16 tétrades = 16 pares: n = 16 e 2n = 32.']
};
VIS.def['cromossomo-cromatides-homologos'] = {
  tit: 'Cromátides-irmãs, homólogos e cariótipo',
  fontes: ['OpenStax, Biology 2e, 10.1 Cell Division — https://openstax.org/books/biology-2e/pages/10-1-cell-division', 'OpenStax, Biology 2e, 11.1 The Process of Meiosis — https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis', 'OpenStax, Biology 2e, 13.2 Chromosomal Basis of Inherited Disorders (cariótipo) — https://openstax.org/books/biology-2e/pages/13-2-chromosomal-basis-of-inherited-disorders', 'Wikipedia (en), Karyotype — https://en.wikipedia.org/wiki/Karyotype'],
  tipo: 'anim', dur: 16,
  marcas: [[0, 'Duplicação'], [3, 'Homólogos'], [6, 'Condensação'], [9, 'Cariótipo'], [12.5, 'Tétrade']],
  cred: 'Foto: cariótipo humano masculino com bandas G, cortesia do National Human Genome Research Institute (NHGRI), domínio público, Wikimedia Commons ("NHGRI human male karyotype.png"; números acrescentados para o app). Esquemas feitos para o app, fora de escala.',
  nota: 'Cromátides-irmãs são as duas cópias idênticas de um mesmo cromossomo, unidas pelo centrômero. Homólogos são dois cromossomos diferentes do mesmo par, um do pai e outro da mãe: mesmos genes, alelos que podem diferir.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    function vis(o, b) { o.style.display = b ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PAI = '#2f6db5', MAE = '#c0392b', CEN = '#3b3b3b';
    var B = 'font-size:13.5px;font-weight:700;', N = 'font-size:13px;';
    function crom(pai, x, yT, yB, cy, w, cor) {
      var h = w / 2, p = 'M' + (x - h) + ' ' + (yT + h) + ' A' + h + ' ' + h + ' 0 0 1 ' + (x + h) + ' ' + (yT + h) + ' L' + (x + h) + ' ' + (cy - 5) + ' Q' + (x + h * .3) + ' ' + cy + ' ' + (x + h) + ' ' + (cy + 5) + ' L' + (x + h) + ' ' + (yB - h) + ' A' + h + ' ' + h + ' 0 0 1 ' + (x - h) + ' ' + (yB - h) + ' L' + (x - h) + ' ' + (cy + 5) + ' Q' + (x - h * .3) + ' ' + cy + ' ' + (x - h) + ' ' + (cy - 5) + ' Z';
      return el('path', { d: p, style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:' + cor + ';stroke-width:2' }, pai);
    }
    function banda(pai, x, y, w, cor) { el('rect', { x: x - w / 2, y: y - 3, width: w, height: 6, style: 'fill:' + cor }, pai); }
    /* ===== 1 duplicacao ===== */
    var g1 = el('g', {});
    crom(g1, 90, 90, 260, 150, 16, PAI); banda(g1, 90, 210, 16, '#1f3d66');
    tx(90, 288, '1 cromossomo', B + 'text-anchor:middle;fill:var(--tinta)', g1); tx(90, 305, '= 1 molécula de DNA', N + 'text-anchor:middle;fill:var(--lapis)', g1);
    var seta1 = el('g', {}, g1); el('path', { d: 'M130 175 H200 m-8 -6 l8 6 l-8 6', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, seta1);
    tx(165, 162, 'duplica', N + 'font-weight:700;text-anchor:middle;fill:var(--tinta)', seta1); tx(165, 196, '(fase S)', N + 'text-anchor:middle;fill:var(--lapis)', seta1);
    var dup = el('g', {}, g1);
    var cA = el('g', {}, dup); crom(cA, 0, 90, 260, 150, 16, PAI); banda(cA, 0, 210, 16, '#1f3d66');
    var cB = el('g', {}, dup); crom(cB, 0, 90, 260, 150, 16, PAI); banda(cB, 0, 210, 16, '#1f3d66');
    var cen1 = el('circle', { r: 5, style: 'fill:' + CEN }, dup);
    var l1 = el('g', {}, g1);
    tx(272, 60, 'cromátides-irmãs', B + 'text-anchor:middle;fill:' + PAI, l1); tx(272, 78, '2 cópias idênticas', N + 'text-anchor:middle;fill:var(--lapis)', l1);
    el('path', { d: 'M286 152 L330 236', style: 'stroke:var(--lapis);stroke-width:1.2' }, l1); tx(300, 252, 'centrômero', B + 'fill:' + CEN, l1);
    tx(272, 305, '1 cromossomo duplicado', N + 'text-anchor:middle;fill:var(--lapis)', l1);
    /* ===== 2 homologos ===== */
    var g2 = el('g', {});
    [[110, PAI, 'do pai', 'A', 'B'], [250, MAE, 'da mãe', 'a', 'B']].forEach(function (h) {
      [-8, 8].forEach(function (dx) { crom(g2, h[0] + dx, 80, 270, 140, 15, h[1]); banda(g2, h[0] + dx, 190, 15, '#333'); banda(g2, h[0] + dx, 238, 15, '#333'); });
      el('circle', { cx: h[0], cy: 140, r: 5, style: 'fill:' + CEN }, g2);
      tx(h[0], 66, h[2], B + 'text-anchor:middle;fill:' + h[1], g2);
      tx(h[0] + 22, 195, h[3], 'font-size:15px;font-weight:800;fill:' + h[1], g2); tx(h[0] + 22, 243, h[4], 'font-size:15px;font-weight:800;fill:' + h[1], g2);
    });
    el('path', { d: 'M150 190 H210 M150 238 H210', style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:3 3' }, g2);
    tx(180, 300, 'mesmos genes nos mesmos lugares (locos),', B + 'text-anchor:middle;fill:var(--tinta)', g2);
    tx(180, 318, 'mas os alelos podem ser diferentes (A e a)', B + 'text-anchor:middle;fill:var(--tinta)', g2);
    tx(180, 30, 'um par de homólogos', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', g2);
    /* ===== 3 condensacao na mitose ===== */
    var g3 = el('g', {});
    var FX = [44, 116, 188, 260, 332], FN = ['intérfase', 'prófase', 'metáfase', 'anáfase', 'telófase'], FC = [.1, .55, 1, .9, .35];
    var cx3 = FX.map(function (x, i) { var g = el('g', {}, g3); return g; });
    el('path', { d: 'M28 118 c6 -10 10 10 16 0 s10 10 16 0 s10 10 16 -2 M30 132 c6 10 10 -10 16 0 s10 -10 16 0 s10 -10 14 2 M34 146 c8 -8 12 8 20 0 s12 8 20 -2', style: 'fill:none;stroke:' + PAI + ';stroke-width:1.6' }, cx3[0]);
    [-5, 5].forEach(function (dx) { crom(cx3[1], 116 + dx, 92, 172, 130, 8, PAI); });
    [-6, 6].forEach(function (dx) { crom(cx3[2], 188 + dx, 106, 156, 128, 12, PAI); }); el('circle', { cx: 188, cy: 128, r: 4, style: 'fill:' + CEN }, cx3[2]);
    el('line', { x1: 160, x2: 216, y1: 128, y2: 128, style: 'stroke:var(--lapis);stroke-width:1;stroke-dasharray:3 3' }, cx3[2]);
    crom(cx3[3], 260, 88, 124, 100, 11, PAI); crom(cx3[3], 260, 140, 176, 164, 11, PAI);
    el('path', { d: 'M318 112 c5 -8 9 8 14 0 s9 8 14 0 M320 132 c4 6 8 -8 12 0 s8 6 12 -2 M322 150 c6 -6 10 6 16 0', style: 'fill:none;stroke:' + PAI + ';stroke-width:3' }, cx3[4]);
    var nm3 = FN.map(function (s, i) { return tx(FX[i], 76, s, N + 'font-weight:700;text-anchor:middle;fill:var(--tinta)', g3); });
    var caixa = el('rect', { y: 58, width: 66, height: 128, rx: 10, style: 'fill:none;stroke:var(--ad-c);stroke-width:2.5' }, g3);
    tx(20, 214, 'grau de condensação', N + 'font-weight:700;fill:var(--lapis)', g3);
    el('path', { d: 'M28 304 H360 M28 304 V222', style: 'fill:none;stroke:var(--tinta);stroke-width:1.4' }, g3);
    var dC = ''; FX.forEach(function (x, i) { dC += (i ? ' L' : 'M') + x + ' ' + (300 - 70 * FC[i]); });
    var curva3 = el('path', { d: dC, style: 'fill:none;stroke:' + PAI + ';stroke-width:3' }, g3);
    var pto = el('circle', { r: 6, style: 'fill:var(--ad-c);stroke:var(--folha);stroke-width:2' }, g3);
    var pico = tx(188, 222, 'máximo', B + 'text-anchor:middle;fill:var(--ad-t)', g3);
    /* ===== 4 cariotipo (foto) ===== */
    var g4 = el('g', {});
    var PX = 14, PY = 36, PW = 360, PH = 270;
    var cp = el('clipPath', { id: 'kario-clip' }, el('defs', {}, g4)); el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:#fff' }, g4);
    el('image', { href: 'vis/cromossomo-cromatides-homologos-1.webp', x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#kario-clip)' }, g4);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, g4);
    tx(PX, 24, 'Cariótipo humano real (homem), em metáfase', B + 'fill:var(--ad-t)', g4);
    function K(x, y) { return [PX + (x + 29) * .269, PY + y * .269]; }
    var NUMS = el('g', {}, g4), sx = [];
    [[245, [1, 100], [2, 270], [3, 460], [4, 900], [5, 1090]], [480, [6, 100], [7, 280], [8, 460], [9, 630], [10, 815], [11, 1000], [12, 1190]], [722, [13, 95], [14, 285], [15, 455], [16, 815], [17, 1000], [18, 1190]], [948, [19, 280], [20, 455], [21, 815], [22, 1000]]].forEach(function (r) {
      r.slice(1).forEach(function (c) { var p = K(c[1], r[0]); tx(p[0], p[1], String(c[0]), 'font-size:13px;font-weight:800;text-anchor:middle;fill:#14532d', NUMS); });
    });
    var pxy = K(1190, 948); var gXY = el('g', {}, g4);
    tx(pxy[0], pxy[1], 'X  Y', 'font-size:13px;font-weight:800;text-anchor:middle;fill:#b4442f', gXY);
    var bx = K(1130, 800); el('rect', { x: bx[0], y: bx[1], width: 34, height: 52, rx: 6, style: 'fill:none;stroke:#b4442f;stroke-width:2' }, gXY);
    var leg4 = tx(PX, PY + PH + 18, '', N + 'font-weight:700;fill:var(--tinta)', g4);
    /* ===== 5 tetrade ===== */
    var g5 = el('g', {});
    var tP = el('g', {}, g5), tM = el('g', {}, g5);
    [-7, 7].forEach(function (dx) { crom(tP, dx, 0, 170, 60, 13, PAI); }); el('circle', { cx: 0, cy: 60, r: 4.5, style: 'fill:' + CEN }, tP);
    [-7, 7].forEach(function (dx) { crom(tM, dx, 0, 170, 60, 13, MAE); }); el('circle', { cx: 0, cy: 60, r: 4.5, style: 'fill:' + CEN }, tM);
    var chave = el('g', {}, g5);
    el('path', { d: 'M60 262 v8 h96 v-8 M108 270 v10', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, chave);
    tx(108, 298, '1 tétrade (bivalente)', B + 'text-anchor:middle;fill:var(--tinta)', chave);
    tx(108, 316, '= 1 par de homólogos', N + 'text-anchor:middle;fill:var(--lapis)', chave);
    tx(108, 333, '= 4 cromátides', N + 'text-anchor:middle;fill:var(--lapis)', chave);
    tx(108, 52, 'prófase I: os homólogos se pareiam', N + 'font-weight:700;text-anchor:middle;fill:var(--tinta)', g5);
    var cnt = el('g', {}, g5);
    el('rect', { x: 214, y: 108, width: 162, height: 132, rx: 12, style: 'fill:color-mix(in srgb,var(--ad-c) 8%,var(--folha));stroke:var(--ad-c);stroke-width:1.5' }, cnt);
    var c1 = tx(228, 136, '16 tétrades', 'font-size:15px;font-weight:700;fill:var(--tinta)', cnt), c2 = tx(228, 162, '= 16 pares', 'font-size:15px;font-weight:700;fill:var(--tinta)', cnt), c3 = tx(228, 188, 'n = 16', 'font-size:15px;font-weight:700;fill:var(--tinta)', cnt), c4 = tx(228, 220, '2n = 32', 'font-size:20px;font-weight:800;fill:var(--ad-t)', cnt);
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · Cromátides-irmãs', s: 'Antes de dividir, a célula copia o DNA (fase S). Cada cromossomo passa a ter duas cromátides-irmãs, cópias idênticas, presas pelo centrômero. Continua sendo um cromossomo só.' },
      { tit: '2 · Homólogos', s: 'Homólogos são dois cromossomos do mesmo par: um veio do pai, o outro da mãe. Têm o mesmo tamanho e os mesmos genes nos mesmos locais, mas os alelos podem diferir (A num, a no outro).' },
      { tit: '3 · Condensação', s: 'Na intérfase o DNA fica solto, como fio. Na prófase ele começa a se enrolar; na metáfase atinge o máximo de condensação, e os cromossomos ficam curtos, grossos e separados: é a melhor hora para fotografá-los.' },
      { tit: '4 · Cariótipo', s: 'Cariótipo é o retrato do conjunto de cromossomos da espécie: número, tamanho e forma, em pares. No ser humano: 22 pares de autossomos (1 a 22), iguais nos dois sexos, e 1 par sexual (XX ou XY). Esta célula é de um homem: 46, XY.' },
      { tit: '5 · Tétrade na meiose I', s: 'Na prófase I cada cromossomo encontra o seu homólogo. O par emparelhado tem 2 cromossomos e 4 cromátides: é a tétrade (ou bivalente). Contar tétrades é contar pares.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : t < 12.5 ? 3 : 4;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      vis(g1, f === 0); vis(g2, f === 1); vis(g3, f === 2); vis(g4, f === 3); vis(g5, f === 4);
      var u = f === 0 ? cl(t / 3) : f === 1 ? cl((t - 3) / 3) : f === 2 ? cl((t - 6) / 3) : f === 3 ? cl((t - 9) / 3.5) : cl((t - 12.5) / 3.5);
      if (f === 0) {
        var d = ease((u - .25) / .35);
        op(seta1, cl((u - .1) / .15)); mv(dup, 272, 0); mv(cA, -8 * d, 0); mv(cB, 8 * d, 0); op(dup, cl((u - .15) / .1)); op(cB, d); op(cen1, d); cen1.setAttribute('cx', 0); cen1.setAttribute('cy', 150);
        op(l1, cl((u - .65) / .15));
      }
      if (f === 1) op(g2, cl(u / .15));
      if (f === 2) {
        var k = Math.min(4, Math.floor(u * 5));
        caixa.setAttribute('x', FX[k] - 33);
        cx3.forEach(function (g, i) { op(g, i === k ? 1 : .35); });
        nm3.forEach(function (n, i) { n.style.fill = i === k ? 'var(--ad-t)' : 'var(--tinta)'; });
        var xx = lerp(FX[0], FX[4], cl(u * 1.25 - .125)), seg = Math.min(3, Math.floor((xx - FX[0]) / 72)), w = (xx - FX[seg]) / 72;
        pto.setAttribute('cx', FX[k]); pto.setAttribute('cy', 300 - 70 * FC[k]);
        op(pico, k >= 2 ? 1 : 0);
      }
      if (f === 3) {
        op(NUMS, cl((u - .1) / .2)); op(gXY, cl((u - .4) / .2));
        leg4.textContent = u < .4 ? '1 a 22: autossomos (22 pares)' : '1 a 22: autossomos; X e Y: sexuais';
      }
      if (f === 4) {
        var pr = ease(u / .35);
        mv(tP, lerp(40, 92, pr), 80); mv(tM, lerp(176, 124, pr), 80);
        op(chave, cl((u - .35) / .1));
        op(c1, cl((u - .45) / .08)); op(c2, cl((u - .55) / .08)); op(c3, cl((u - .65) / .08)); op(c4, cl((u - .75) / .08));
      }
    };
    return fimResposta(VIS.def['cromossomo-cromatides-homologos'], svg, _desenha, 16, RESP, qid, { x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'Wc4b81b5' ? 7.5 : q === 'W5058122' ? 15.9 : 12.4; } });
  }
};
VIS.liga('cromossomo-cromatides-homologos', ['P4de2843', 'W5af8b58', 'Wc4b81b5', 'W5058122']);
