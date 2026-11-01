/* Ciclo trigonometrico e graficos: voltas inteiras e radianos (780 graus = 2 voltas + 60), seno e cosseno como projecoes
   desenhando a senoide (mesma escala do circulo: 2 pi r = 427 px), arcos com o mesmo seno (simetria), f(x) = a + b sen(cx)
   e dois ponteiros com velocidades angulares diferentes. Tudo calculado no codigo. */
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js), com opc.esconde: elemento escondido na etapa Resposta */
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
  if (opc.base !== undefined) y = opc.base - h;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 22, y: y + 36, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 22, y: y + 66 + 23 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde && on) opc.esconde.style.opacity = 0;
  };
}
var RESP = {
'W9b31ac9': ['Por isso a resposta é D', '7 344 − 20 · 360 = 144° (2º quadrante) → 180° − 144° = 36°', '36° = 36π ÷ 180 = π/5 rad'],
'Wd0f30e2': ['Por isso a resposta é C', 'π rad = 180° → 0,105 rad = 0,105 · 180 ÷ π graus', '= 18,9 ÷ 3,14 ≈ 6°'],
'ef109583': ['Por isso a resposta é C', 'sen 18° = cos 72° = 0,309. B e C têm alturas iguais e opostas', 'em volta do zero de 270°: xB = 270° − 18° e xC = 270° + 18°', 'xB + xC = 2 · 270° = 540°'],
'We211bd4': ['Por isso a resposta é D', '−1 ≤ sen(πt/2) ≤ 1, qualquer que seja t:', 'máximo: 200 + 120 · 1 = 320 e mínimo: 200 + 120 · (−1) = 80'],
'Pd0bbaff': ['Por isso a resposta é D', 'Em cos(2π · 3f · t), o número que multiplica t ficou 3 vezes maior:', 'o período fica 3 vezes menor e a altura não muda.', 'O gráfico encolhe na horizontal: contração horizontal.'],
'P52ba6c8': ['Por isso a resposta é D', 'Grande: 360° ÷ 60 s = 6°/s; pequeno: 3 · 6 = 18°/s', 'Opostos: diferença de 180° → 18t − 6t = 12t = 180', 't = 15 s']
};
VIS.def['ciclo-trigonometrico-graficos'] = {
  tit: 'Ciclo trigonométrico e os gráficos de seno e cosseno',
  fontes: ['OpenStax, Precalculus 2e, 5.1 Angles (radianos) — https://openstax.org/books/precalculus-2e/pages/5-1-angles', 'OpenStax, Precalculus 2e, 5.2 Unit Circle: Sine and Cosine Functions — https://openstax.org/books/precalculus-2e/pages/5-2-unit-circle-sine-and-cosine-functions', 'OpenStax, Precalculus 2e, 6.1 Graphs of the Sine and Cosine Functions — https://openstax.org/books/precalculus-2e/pages/6-1-graphs-of-the-sine-and-cosine-functions', 'Wikipedia (en), Unit circle — https://en.wikipedia.org/wiki/Unit_circle'],
  tipo: 'anim', dur: 22.4,
  marcas: [[0, 'Radianos'], [4.2, 'sen e cos'], [8.2, 'Mesmo seno'], [13.2, 'a + b·sen'], [18.2, 'Ponteiros']],
  cred: 'Animação feita para o app. A senoide usa a mesma escala do círculo: uma volta (2π raios) ocupa o comprimento da circunferência.',
  nota: 'No ciclo de raio 1, cos θ é a sombra horizontal do ponto e sen θ a vertical; por isso os dois ficam entre −1 e 1. Em f(x) = a + b·sen(cx): a sobe o gráfico, b é a amplitude (máximo a + b, mínimo a − b) e o período é 2π ÷ c.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function at(o, a) { for (var k in a) o.setAttribute(k, typeof a[k] === 'number' ? a[k].toFixed(1) : a[k]); }
    var HALO = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    var SEN = '#b4442f', COS = '#2b6cb0', COR = 'var(--ad-c)', AUX = '#9a7220', ROX = '#8a5a9e';
    var R15 = 'font-size:15px;font-weight:700;fill:', R14 = 'font-size:14px;font-weight:700;fill:';
    svg.setAttribute('viewBox', '0 0 640 350');
    var RAD = Math.PI / 180, R = 68, OX = 86, OY = 120, GX = 192, GW = 2 * Math.PI * R;   /* 2 pi R = 427,3 px */
    function gx(th) { return GX + R * th; } function gy(v) { return OY - R * v; }   /* th em radianos */
    /* circulo */
    var gc = el('g', {});
    el('line', { x1: OX - R - 12, x2: OX + R + 12, y1: OY, y2: OY, style: 'stroke:var(--lapis);stroke-width:1.2' }, gc);
    el('line', { x1: OX, x2: OX, y1: OY - R - 12, y2: OY + R + 12, style: 'stroke:var(--lapis);stroke-width:1.2' }, gc);
    el('circle', { cx: OX, cy: OY, r: R, style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, gc);
    var arcoP = el('path', { style: 'fill:none;stroke:' + AUX + ';stroke-width:4' }, gc);
    var raio = el('line', { x1: OX, y1: OY, style: 'stroke:var(--tinta);stroke-width:2' }, gc);
    var pCos = el('line', { y1: OY, y2: OY, x1: OX, style: 'stroke:' + COS + ';stroke-width:5' }, gc);
    var pSen = el('line', { style: 'stroke:' + SEN + ';stroke-width:5' }, gc);
    var pto = el('circle', { r: 6, style: 'fill:' + COR + ';stroke:var(--folha);stroke-width:2' }, gc);
    var lCos = tx(0, 0, 'cos θ', R14 + COS + ';text-anchor:middle' + HALO, gc), lSen = tx(0, 0, 'sen θ', R14 + SEN + HALO, gc);
    var lAng = tx(OX, OY + R + 20, '', R15 + 'var(--ad-t);text-anchor:middle', gc);
    var simP = [0, 1].map(function () { return el('circle', { r: 6, style: 'fill:' + ROX + ';stroke:var(--folha);stroke-width:2' }, gc); });
    var simL = el('line', { style: 'stroke:' + ROX + ';stroke-width:1.6;stroke-dasharray:5 4' }, gc);
    tx(OX + R + 4, OY - 6, '1', 'font-size:14px;fill:var(--lapis)', gc); tx(OX + 5, OY - R - 4, '1', 'font-size:14px;fill:var(--lapis)', gc);
    /* grafico */
    var gg = el('g', {});
    el('path', { d: 'M' + GX + ' ' + OY + ' H' + (GX + GW + 14) + ' m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, gg);
    el('line', { x1: GX, x2: GX, y1: OY + R + 10, y2: 8, style: 'stroke:var(--tinta);stroke-width:1.5' }, gg);
    var marcasX = el('g', {}, gg);
    [[.5, 'π/2'], [1, 'π'], [1.5, '3π/2'], [2, '2π']].forEach(function (m) { var x = gx(m[0] * Math.PI); el('line', { x1: x, x2: x, y1: OY - 4, y2: OY + 4, style: 'stroke:var(--tinta);stroke-width:1.4' }, marcasX); tx(x, OY + 20, m[1], 'font-size:14px;fill:var(--lapis);text-anchor:middle' + HALO, marcasX); });
    [[1, '1'], [-1, '−1']].forEach(function (m) { el('line', { x1: GX, x2: GX + GW, y1: gy(m[0]), y2: gy(m[0]), style: 'stroke:var(--linha);stroke-width:1;stroke-dasharray:3 4' }, gg); tx(GX - 6, gy(m[0]) + 5, m[1], 'font-size:14px;fill:var(--lapis);text-anchor:end', gg); });
    var ponte = el('line', { style: 'stroke:' + SEN + ';stroke-width:1.2;stroke-dasharray:4 4' }, gg);
    var curva = el('path', { style: 'fill:none;stroke:' + SEN + ';stroke-width:3' }, gg);
    var curvaF = el('path', { style: 'fill:none;stroke:' + COR + ';stroke-width:3' }, gg);
    var hL = el('line', { style: 'stroke:' + ROX + ';stroke-width:1.8' }, gg);
    var hP = [0, 1].map(function () { return el('circle', { r: 5.5, style: 'fill:' + ROX + ';stroke:var(--folha);stroke-width:2' }, gg); });
    var hEixo = el('line', { y1: 10, y2: OY + R + 6, style: 'stroke:' + ROX + ';stroke-width:1.4;stroke-dasharray:6 5' }, gg);
    var hT = [tx(0, 0, '', R14 + ROX + ';text-anchor:middle' + HALO, gg), tx(0, 0, '', R14 + ROX + ';text-anchor:middle' + HALO, gg), tx(0, 0, '', R14 + ROX + ';text-anchor:middle' + HALO, gg)];
    var fMax = el('line', { style: 'stroke:' + COR + ';stroke-width:1.4;stroke-dasharray:5 4' }, gg), fMin = el('line', { style: 'stroke:' + COR + ';stroke-width:1.4;stroke-dasharray:5 4' }, gg), fMed = el('line', { style: 'stroke:var(--lapis);stroke-width:1.2' }, gg);
    var lMax = tx(0, 0, '', R14 + 'var(--ad-t)' + HALO, gg), lMin = tx(0, 0, '', R14 + 'var(--ad-t)' + HALO, gg), lPer = tx(0, 0, '', R14 + 'var(--ad-t);text-anchor:middle' + HALO, gg);
    var perB = el('path', { style: 'fill:none;stroke:var(--ad-t);stroke-width:1.8' }, gg);
    /* etapa 1: regua de voltas (0 a 780 graus) */
    var g1 = el('g', {}), RX0 = 200, RX1 = 612, RY = 120;
    function rx(d) { return RX0 + (RX1 - RX0) * d / 780; }
    el('line', { x1: RX0, x2: RX1, y1: RY, y2: RY, style: 'stroke:var(--tinta);stroke-width:2' }, g1);
    [0, 360, 720, 780].forEach(function (d) { el('line', { x1: rx(d), x2: rx(d), y1: RY - 8, y2: RY + 8, style: 'stroke:var(--tinta);stroke-width:1.6' }, g1); tx(d === 780 ? rx(d) - 8 : rx(d), RY + 26, d + '°', 'font-size:14px;fill:var(--lapis);text-anchor:' + (d === 780 ? 'start' : 'middle'), g1); });
    var rFill = el('line', { y1: RY, y2: RY, x1: RX0, style: 'stroke:' + AUX + ';stroke-width:7' }, g1);
    var rV1 = tx((rx(0) + rx(360)) / 2, RY - 14, '1 volta', R14 + AUX + ';text-anchor:middle', g1), rV2 = tx((rx(360) + rx(720)) / 2, RY - 14, '2 voltas', R14 + AUX + ';text-anchor:middle', g1);
    var rSob = tx(rx(750), RY - 14, '60°', R14 + COR + ';text-anchor:middle', g1);
    var conv = el('g', {}, g1);
    tx(RX0, 56, 'π rad = 180°', 'font-size:17px;font-weight:700;fill:var(--ad-t)', conv);
    tx(RX0 + 140, 56, '1 rad = 180° ÷ π ≈ 57,3°', 'font-size:15px;fill:var(--tinta)', conv);
    /* etapa 5: dois ponteiros */
    var g5 = el('g', {}), DX = 320, DY = 110, DR = 92;
    el('circle', { cx: DX, cy: DY, r: DR, style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, g5);
    for (var m = 0; m < 12; m++) { var a = m * 30 * RAD; el('line', { x1: DX + (DR - 9) * Math.sin(a), y1: DY - (DR - 9) * Math.cos(a), x2: DX + DR * Math.sin(a), y2: DY - DR * Math.cos(a), style: 'stroke:var(--tinta);stroke-width:1.6' }, g5); }
    var difA = el('path', { style: 'fill:color-mix(in srgb,' + AUX + ' 18%,transparent);stroke:' + AUX + ';stroke-width:1.6' }, g5);
    var pt1 = el('line', { x1: DX, y1: DY, style: 'stroke:' + COS + ';stroke-width:5;stroke-linecap:round' }, g5), pt2 = el('line', { x1: DX, y1: DY, style: 'stroke:' + SEN + ';stroke-width:3.5;stroke-linecap:round' }, g5);
    el('circle', { cx: DX, cy: DY, r: 5, style: 'fill:var(--tinta)' }, g5);
    var l5a = tx(DX + DR + 18, DY - 40, 'lento: 30°/s', R14 + COS, g5), l5b = tx(DX + DR + 18, DY - 18, 'rápido: 60°/s', R14 + SEN, g5);
    var l5t = tx(DX + DR + 18, DY + 14, '', R15 + 'var(--tinta)', g5), l5d = tx(DX + DR + 18, DY + 38, '', R15 + AUX, g5);
    /* painel de texto embaixo */
    var painel = el('g', {});
    el('line', { x1: 14, x2: 626, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.2' }, painel);
    var T = tx(14, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3].map(function (k) { return tx(14, 265 + 23 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    var TX = [
      ['1. Voltas e radianos', 'Arco maior que 360°: tire as voltas inteiras. 780° = 2 · 360° + 60°.', 'Radiano: ângulo cujo arco tem o tamanho do raio. Meia volta = π rad = 180°.', 'Graus = rad · 180 ÷ π. Para reduzir ao 1º quadrante um arco do 2º: 180° − θ.', ''],
      ['2. Seno e cosseno são as sombras do ponto', 'No círculo de raio 1, o ponto do ângulo θ tem coordenadas (cos θ; sen θ).', 'Girando, a altura sen θ desenha a senoide: sobe até 1, desce até −1.', 'Por isso −1 ≤ sen θ ≤ 1 e −1 ≤ cos θ ≤ 1. O desenho se repete a cada 2π.', ''],
      ['3. Arcos com o mesmo seno', 'y = 1/2 corta o círculo em 30° e 150°, simétricos em relação ao eixo y.', 'No gráfico ficam simétricos em volta do pico de 90°: somam 2 · 90° = 180°.', 'y = −1/2: 210° e 330°, simétricos em volta de 270°: somam 2 · 270° = 540°.', ''],
      ['4. f(x) = a + b · sen(cx)', 'Exemplo: f(x) = 1 + 0,5 · sen(2x). O c = 2 encolhe: período 2π ÷ 2 = π.', 'O b = 0,5 é a amplitude (o balanço) e o a = 1 sobe o gráfico inteiro.', 'Como −1 ≤ sen ≤ 1: máximo a + b = 1,5 e mínimo a − b = 0,5.', ''],
      ['5. Dois ponteiros com velocidades diferentes', 'Depois de t segundos: posições 30t e 60t graus; a diferença cresce 30° por s.', 'Opostos = diferença de 180°: 30t = 180 → t = 6 s.', 'Juntos de novo quando a diferença chega a 360°.', '']
    ];
    function senoide(F, x0, x1) { var d = ''; for (var th = x0; th <= x1 + 1e-9; th += .03) d += (d ? 'L' : 'M') + gx(th).toFixed(1) + ' ' + gy(F(th)).toFixed(1); return d; }
    function arcoGrau(r, a0, a1, cx, cy) { cx = cx || OX; cy = cy || OY; var x0 = cx + r * Math.cos(a0 * RAD), y0 = cy - r * Math.sin(a0 * RAD), x1 = cx + r * Math.cos(a1 * RAD), y1 = cy - r * Math.sin(a1 * RAD); return 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (((a1 - a0) % 360 + 360) % 360 > 180 ? 1 : 0) + ' 0 ' + x1.toFixed(1) + ' ' + y1.toFixed(1); }
    function ponto(th) {   /* graus */
      var c = Math.cos(th * RAD), s = Math.sin(th * RAD), X = OX + R * c, Y = OY - R * s;
      at(raio, { x2: X, y2: Y }); at(pto, { cx: X, cy: Y }); at(pCos, { x2: X }); at(pSen, { x1: X, x2: X, y1: OY, y2: Y });
      at(lCos, { x: OX + R * c / 2, y: OY + (s >= 0 ? 18 : -8) }); at(lSen, { x: X + (c >= 0 ? 8 : -50), y: OY - R * s / 2 + 5 });
      return [X, Y];
    }
    var _desenha = function (t) {
      var fase = t < 4.2 ? 0 : t < 8.2 ? 1 : t < 13.2 ? 2 : t < 18.2 ? 3 : 4;
      op(gc, fase <= 3 ? 1 : 0); op(g1, fase === 0 ? 1 : 0); op(gg, fase >= 1 && fase <= 3 ? 1 : 0); op(g5, fase === 4 ? 1 : 0);
      var proj = fase === 1; op(pCos, proj ? 1 : 0); op(pSen, proj ? 1 : 0); op(lCos, proj ? 1 : 0); op(lSen, proj ? 1 : 0); op(ponte, proj ? 1 : 0);
      op(curva, fase === 1 || fase === 2 ? 1 : fase === 3 ? .25 : 0); op(curvaF, fase === 3 ? 1 : 0);
      [hL, hEixo, simL].concat(hP, simP, hT).forEach(function (o) { op(o, 0); });
      [fMax, fMin, fMed, lMax, lMin, lPer, perB].forEach(function (o) { op(o, 0); });
      op(arcoP, fase === 0 ? 1 : 0); lAng.textContent = '';
      if (fase === 0) {
        var d = 780 * ease((t - .3) / 2.2), th = d % 360;
        ponto(th); arcoP.setAttribute('d', d > 1 ? (d >= 359.9 ? 'M' + (OX + R + 7) + ' ' + OY + ' A' + (R + 7) + ' ' + (R + 7) + ' 0 1 0 ' + (OX - R - 7) + ' ' + OY + ' A' + (R + 7) + ' ' + (R + 7) + ' 0 1 0 ' + (OX + R + 7) + ' ' + OY + (th > 1 ? ' ' + arcoGrau(R + 7, 0, th).replace(/^M[^A]+/, '') : '') : arcoGrau(R + 7, 0, d)) : 'M0 0');
        lAng.textContent = Math.round(d) + '°' + (d >= 360 ? '  (' + Math.floor(d / 360) + (d >= 720 ? ' voltas' : ' volta') + ' + ' + Math.round(th) + '°)' : '');
        at(rFill, { x2: rx(d) }); op(rV1, d >= 360 ? 1 : 0); op(rV2, d >= 720 ? 1 : 0); op(rSob, d >= 779 ? 1 : 0);
        op(conv, ease((t - 1.6) / .5));
      }
      if (fase === 1) {
        var th1 = 360 * ease((t - 4.4) / 2.6), P = ponto(th1);
        curva.setAttribute('d', th1 > .5 ? senoide(Math.sin, 0, th1 * RAD) : 'M0 0');
        at(ponte, { x1: P[0], y1: P[1], x2: gx(th1 * RAD), y2: P[1] });
        lAng.textContent = 'θ = ' + Math.round(th1) + '°';
      }
      if (fase === 2) {
        ponto(90); op(raio, 0); op(pto, 0);
        curva.setAttribute('d', senoide(Math.sin, 0, 2 * Math.PI));
        var neg = t > 10.7, v = neg ? -.5 : .5, a1 = neg ? 210 : 30, a2 = neg ? 330 : 150, eixo = neg ? 270 : 90;
        var u = ease(((neg ? t - 10.7 : t - 8.3)) / .5);
        at(hL, { x1: OX - R - 8, x2: GX + GW, y1: gy(v), y2: gy(v) }); op(hL, u);
        [a1, a2].forEach(function (a, i) {
          at(simP[i], { cx: OX + R * Math.cos(a * RAD), cy: OY - R * Math.sin(a * RAD) }); op(simP[i], u);
          at(hP[i], { cx: gx(a * RAD), cy: gy(v) }); op(hP[i], u);
          at(hT[i], { x: gx(a * RAD), y: gy(v) + (neg ? 22 : -10) }); hT[i].textContent = a + '°'; op(hT[i], u);
        });
        at(hEixo, { x1: gx(eixo * RAD), x2: gx(eixo * RAD) }); op(hEixo, u);
        at(hT[2], { x: gx(eixo * RAD), y: neg ? gy(-1) + 20 : gy(1) - 8 }); hT[2].textContent = eixo + '°'; op(hT[2], u);
        at(simL, { x1: OX, x2: OX, y1: OY - R - 10, y2: OY + R + 10 }); op(simL, u);
        lAng.textContent = 'sen = ' + (neg ? '−1/2' : '1/2');
      }
      if (fase === 3) {
        ponto(90); op(raio, 0); op(pto, 0);
        curva.setAttribute('d', senoide(Math.sin, 0, 2 * Math.PI));
        var c = lerp(1, 2, ease((t - 13.4) / .9)), b = lerp(1, .5, ease((t - 14.5) / .7)), a0 = lerp(0, 1, ease((t - 15.3) / .7));
        curvaF.setAttribute('d', senoide(function (x) { return a0 + b * Math.sin(c * x); }, 0, 2 * Math.PI));
        var pronto = t > 16;
        at(fMax, { x1: GX, x2: GX + GW, y1: gy(1.5), y2: gy(1.5) }); at(fMin, { x1: GX, x2: GX + GW, y1: gy(.5), y2: gy(.5) }); at(fMed, { x1: GX, x2: GX + GW, y1: gy(1), y2: gy(1) });
        [fMax, fMin, lMax, lMin, lPer, perB].forEach(function (o) { op(o, pronto ? 1 : 0); }); op(fMed, pronto ? .7 : 0);
        at(lMax, { x: GX + GW - 4, y: gy(1.5) - 6 }); lMax.textContent = 'máx. 1,5'; lMax.style.textAnchor = 'end';
        at(lMin, { x: GX + GW - 4, y: gy(.5) + 18 }); lMin.textContent = 'mín. 0,5'; lMin.style.textAnchor = 'end';
        perB.setAttribute('d', 'M' + gx(0) + ' ' + (gy(-1) + 2) + ' v6 H' + gx(Math.PI) + ' v-6');
        at(lPer, { x: gx(Math.PI / 2), y: gy(-1) - 6 }); lPer.textContent = 'período π';
        lAng.textContent = '';
      }
      if (fase === 4) {
        var tau = 6 * ease((t - 18.4) / 2.2), a1 = 30 * tau, a2 = 60 * tau;
        at(pt1, { x2: DX + (DR - 16) * Math.sin(a1 * RAD), y2: DY - (DR - 16) * Math.cos(a1 * RAD) });
        at(pt2, { x2: DX + (DR - 30) * Math.sin(a2 * RAD), y2: DY - (DR - 30) * Math.cos(a2 * RAD) });
        var dif = a2 - a1;
        difA.setAttribute('d', dif > 1 ? 'M' + DX + ' ' + DY + ' L' + (DX + 40 * Math.sin(a1 * RAD)).toFixed(1) + ' ' + (DY - 40 * Math.cos(a1 * RAD)).toFixed(1) + ' A40 40 0 ' + (dif > 180 ? 1 : 0) + ' 1 ' + (DX + 40 * Math.sin(a2 * RAD)).toFixed(1) + ' ' + (DY - 40 * Math.cos(a2 * RAD)).toFixed(1) + ' Z' : 'M0 0');
        l5t.textContent = 't = ' + tau.toFixed(1).replace('.', ',') + ' s';
        l5d.textContent = 'diferença ' + Math.round(dif) + '°' + (dif > 179.5 ? ': opostos' : '');
      }
      var X = TX[fase]; T.textContent = X[0]; for (var n = 0; n < 4; n++) L[n].textContent = X[n + 1];
      painel.style.opacity = 1;
    };
    return fimResposta(VIS.def['ciclo-trigonometrico-graficos'], svg, _desenha, 22.4, RESP, qid, {
      x: 10, w: 620, base: 346, semEsmaecer: true, esconde: painel,
      congela: function (q) { return q === 'W9b31ac9' || q === 'Wd0f30e2' ? 4.1 : q === 'ef109583' ? 13.1 : q === 'P52ba6c8' ? 22.3 : 18.1; }
    });
  }
};
VIS.liga('ciclo-trigonometrico-graficos', ['W9b31ac9', 'Wd0f30e2', 'P52ba6c8', 'ef109583', 'Pd0bbaff', 'We211bd4']);
