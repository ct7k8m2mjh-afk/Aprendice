/* Parabola: raizes e delta, vertice e eixo de simetria, maximo com a < 0, encontro com retas.
   Exemplo unico calculado no codigo: f(x) = x^2 - 2x + c e g(x) = -x^2 + 2x + 3 (escala igual nos dois eixos). */
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
'2812cd36': ['Por isso a resposta é E', 'g(x) = −(x − 1)(x + 3) = −x² − 2x + 3', 'a = −1 < 0: máximo no vértice, xv = −1', 'g(−1) = −1 + 2 + 3 = 4'],
'49fda58b': ['Por isso a resposta é D', 'P: a reta y = x encontra a parábola:', 'x² − 13x + 40 = 0 → x = 5 (antes do topo)', 'V: xv = 7 e f(7) = 9. Subiu 9 − 5 = 4 km'],
'68164d65': ['Por isso a resposta é E', 'xv = (5 − 3k) ÷ (6 − 2k) = 1,3 → k = −7', 'f(x) = 10x² − 26x + 11, a > 0: mínimo', 'f(1,3) = −5,9 → imagem: y ≥ −5,9'],
'8300798f': ['Por isso a resposta é D', 'x² − 2x − 24 = 0: Δ = 100', 'raízes x = −4 e x = 6', 'distância = 6 − (−4) = 10'],
'996afd55': ['Por isso a resposta é E', 'Os pontos saem pela reta: (−1; 11) e (3; 7)', 'g passa por eles: p − q = 7 e 3p + q = 1', 'p = 2 e q = −5 → p + q = −3'],
'E6b68c42': ['Por isso a resposta é B', 'As duas têm a < 0 e vértice em x = 0,5:', 'L(0,5) = 4,25 e L*(0,5) = 5 (milhões)', 'aumento: 0,75 milhão = R$ 750.000,00'],
'Edd97e57': ['Por isso a resposta é D', 'Vértice (4; 12), passa por (0; 6) e (8; 6):', 'y = a(x − 4)² + 12 → a = −0,375', 'em x = 2: y = −1,5 + 12 = 10,5 m'],
'P2672015': ['Por isso a resposta é B', 'y = 2 só toca em (2; 2): é o vértice.', 'c = −6, 2a + b = 4 e b = −4a', 'a = −2 e b = 8 → a + b + c = 0'],
'P3df432d': ['Por isso a resposta é E', 'f(5) = 2 800 e f(6) = 2 000 → b = −1 900', 'a = 100 > 0: mínimo no vértice', 'xv = 1 900 ÷ 200 = 9,5 → R$ 9,50'],
'P4f670c8': ['Por isso a resposta é C', 'A(x) = (10 − x)(200 + 100x), a < 0', 'máximo em xv = −800 ÷ (−200) = 4', 'A(4) = 6 × 600 = R$ 3.600,00'],
'P81ffe98': ['Por isso a resposta é A', 'a < 0: praga máxima no vértice, x = 8', 'f(8) = 80 % → livre: 100 − 80 = 20 %', 'x = 8 é o início de agosto'],
'f00105b5': ['Por isso a resposta é D', 'Há maior valor ⇒ k < 0; xv = 2/k', 'f(2/k) = −4/k − 10 = −9,6', '−4/k = 0,4 → k = −10'],
'P5278660': ['Por isso a resposta é A', 'c + x² = x → x² − x + c = 0', 'há encontro quando Δ = 1 − 4c ≥ 0,', 'isto é, c ≤ 1/4'],
'68e60d23': ['Por isso a resposta é B', 'Eixo y: f(0) = 4 → ponto (0; 4)', 'Eixo x: Δ = 0, raiz dupla x = 3 → (3; 0)', 'distância = √(3² + 4²) = 5']
};
VIS.def['parabola-vertice-raizes'] = {
  tit: 'Parábola: raízes, vértice e encontro com retas',
  fontes: ['OpenStax, College Algebra 2e, 5.1 Quadratic Functions — https://openstax.org/books/college-algebra-2e/pages/5-1-quadratic-functions', 'Wikipedia (pt), Função quadrática — https://pt.wikipedia.org/wiki/Fun%C3%A7%C3%A3o_quadr%C3%A1tica', 'Wikipedia (pt), Equação quadrática — https://pt.wikipedia.org/wiki/Equa%C3%A7%C3%A3o_quadr%C3%A1tica'],
  tipo: 'anim', dur: 25,
  marcas: [[0, 'Raízes e Δ'], [7.5, 'Vértice'], [11, 'Máximo'], [15, 'Reta y = k'], [21.5, 'Reta oblíqua']],
  cred: 'Animação feita para o app. Gráficos calculados pelas fórmulas, com a mesma escala nos dois eixos.',
  nota: 'Vértice: xv = −b ÷ 2a, no meio das raízes; o valor máximo ou mínimo é f(xv). Para achar onde uma reta encontra a parábola, iguale as duas fórmulas: o Δ da equação que sai conta os pontos de encontro.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var HALO = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    var CUR = 'var(--ad-c)', RETA = '#2b6cb0', RAIZ = '#b4442f', VERT = '#9a7220';
    svg.setAttribute('viewBox', '0 0 640 350');
    /* plano: 1 unidade = 27 px nos dois eixos */
    var U = 27, X0 = 112, Y0 = 192, PX0 = 20, PX1 = 258, PY0 = 14, PY1 = 338;
    function px(x) { return X0 + U * x; } function py(y) { return Y0 - U * y; }
    var defs = el('defs', {}); var cp = el('clipPath', { id: 'cp-parab-vr' }, defs); el('rect', { x: PX0, y: PY0, width: PX1 - PX0, height: PY1 - PY0 }, cp);
    for (var i = -3; i <= 5; i++) el('line', { x1: px(i), x2: px(i), y1: PY0, y2: PY1, style: 'stroke:var(--linha);stroke-width:1;opacity:.55' });
    for (var j = -5; j <= 6; j++) el('line', { x1: PX0, x2: PX1, y1: py(j), y2: py(j), style: 'stroke:var(--linha);stroke-width:1;opacity:.55' });
    el('path', { d: 'M' + PX0 + ' ' + Y0 + ' H' + (PX1 + 4) + ' m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    el('path', { d: 'M' + X0 + ' ' + PY1 + ' V' + (PY0 - 2) + ' m-5 8 l5 -8 l5 8', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    tx(PX1 - 2, Y0 + 20, 'x', 'font-size:15px;font-style:italic;fill:var(--tinta)'); tx(X0 + 8, PY0 + 12, 'y', 'font-size:15px;font-style:italic;fill:var(--tinta)');
    [-2, 2, 4].forEach(function (v) { tx(px(v), Y0 + 17, v < 0 ? '−' + (-v) : '' + v, 'font-size:14px;fill:var(--lapis);text-anchor:middle'); });
    [-4, -2, 2, 4, 6].forEach(function (v) { tx(X0 - 6, py(v) + 5, v < 0 ? '−' + (-v) : '' + v, 'font-size:14px;fill:var(--lapis);text-anchor:end'); });
    /* elementos que mudam */
    var gc = el('g', { 'clip-path': 'url(#cp-parab-vr)' });
    var eixoS = el('line', { y1: PY0, y2: PY1, style: 'stroke:' + VERT + ';stroke-width:1.8;stroke-dasharray:6 5' }, gc);
    var reta = el('line', { style: 'stroke:' + RETA + ';stroke-width:2.4' }, gc);
    var curva = el('path', { style: 'fill:none;stroke:' + CUR + ';stroke-width:3' }, gc);
    var simL = el('line', { style: 'stroke:' + VERT + ';stroke-width:1.6;stroke-dasharray:3 4' });
    var dist = el('g', {});
    el('path', { d: 'M' + px(-1) + ' ' + (Y0 + 30) + ' v-6 H' + px(3) + ' v6', style: 'fill:none;stroke:' + RAIZ + ';stroke-width:1.8' }, dist);
    tx(px(1), Y0 + 46, 'distância 4', 'font-size:14px;font-weight:700;fill:' + RAIZ + ';text-anchor:middle' + HALO, dist);
    function ponto(cor) { return el('circle', { r: 5.5, style: 'fill:' + cor + ';stroke:var(--folha);stroke-width:2' }); }
    var r1 = ponto(RAIZ), r2 = ponto(RAIZ), pc = ponto(RETA), s1 = ponto(VERT), s2 = ponto(VERT), pv = ponto(VERT), i1 = ponto(RETA), i2 = ponto(RETA);
    var lR1 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + RAIZ + ';text-anchor:middle' + HALO), lR2 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + RAIZ + ';text-anchor:middle' + HALO);
    var lC = tx(0, 0, '', 'font-size:14px;font-weight:700;text-anchor:end;fill:' + RETA + HALO), lV = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + VERT + ';text-anchor:middle' + HALO);
    var lI1 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + RETA + ';text-anchor:end' + HALO), lI2 = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + RETA + HALO);
    var lReta = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + RETA + HALO);
    /* painel de texto */
    var painel = el('g', {});
    var T = tx(284, 38, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3, 4].map(function (k) { return tx(284, 70 + 25 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    el('line', { x1: 284, x2: 630, y1: 210, y2: 210, style: 'stroke:var(--linha);stroke-width:1.2' }, painel);
    var V1 = tx(284, 240, '', 'font-size:15.5px;font-weight:700;fill:var(--tinta)', painel), V2 = tx(284, 265, '', 'font-size:15px;fill:var(--tinta)', painel);
    function nf(v) { var s = (Math.round(v * 100) / 100).toString().replace('.', ','); return s.charAt(0) === '-' ? '−' + s.slice(1) : s; }
    function pos(o, x, y) { o.setAttribute('cx', px(x).toFixed(1)); o.setAttribute('cy', py(y).toFixed(1)); }
    function lab(o, x, y, dx, dy, s) { o.setAttribute('x', (px(x) + dx).toFixed(1)); o.setAttribute('y', (py(y) + dy).toFixed(1)); o.textContent = s; }
    var TX = [
      ['1. Raízes: onde corta o eixo x', 'Raiz é o x que faz f(x) = 0 (altura zero).', 'Exemplo: f(x) = x² − 2x + c.', 'Δ = b² − 4ac decide quantas raízes há.', 'E f(0) = c: é onde a curva corta o eixo y.', ''],
      ['2. Vértice e eixo de simetria', 'f(x) = x² − 2x − 3 (a = 1, b = −2)', 'xv = −b ÷ 2a = 2 ÷ 2 = 1: meio das raízes', 'yv = f(1) = −4 (o mesmo que −Δ ÷ 4a)', 'Mesma altura, pontos simétricos: f(0) = f(2)', 'Forma do vértice: f(x) = (x − 1)² − 4'],
      ['3. Com a < 0, o vértice é um máximo', 'Trocar o sinal de tudo vira a parábola:', 'g(x) = −x² + 2x + 3 (a = −1, b = 2)', 'xv = −2 ÷ (−2) = 1 e g(1) = −1 + 2 + 3 = 4', 'Lucro, receita, altura: o maior valor', 'fica no vértice.'],
      ['4. Reta horizontal y = k', 'No encontro as duas fórmulas dão o mesmo y:', '−x² + 2x + 3 = k → x² − 2x + (k − 3) = 0', 'O Δ dessa equação conta os encontros:', 'Δ = 4 − 4(k − 3) = 16 − 4k', ''],
      ['5. Reta inclinada: o mesmo método', 'Reta y = x + 1 e a parábola g:', '−x² + 2x + 3 = x + 1 → x² − x − 2 = 0', 'Δ = 1 + 8 = 9 → x = −1 ou x = 2', 'O y sai pela reta: y = 0 e y = 3', '']
    ];
    var _desenha = function (t) {
      var fase = t < 7.5 ? 0 : t < 11 ? 1 : t < 15 ? 2 : t < 21.5 ? 3 : 4;
      /* curva: y = s (x^2 - 2x + c) */
      var c = -3, s = 1, k = null;
      if (fase === 0) c = t < 2.2 ? -3 : t < 2.8 ? lerp(-3, 1, ease((t - 2.2) / .6)) : t < 4.8 ? 1 : lerp(1, 3, ease((t - 4.8) / .5));
      else if (fase === 1) c = lerp(3, -3, ease((t - 7.5) / .5));
      else if (fase === 2) s = lerp(1, -1, ease((t - 11.1) / .9));
      else s = -1;
      if (fase === 3) k = t < 17 ? 0 : t < 17.6 ? lerp(0, 4, ease((t - 17) / .6)) : t < 19.6 ? 4 : lerp(4, 5, ease((t - 19.6) / .4));
      var d = '';
      for (var x = -3.5; x <= 5.5; x += .05) { var y = s * (x * x - 2 * x + c); d += (d ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(Math.max(-9, Math.min(9, y))).toFixed(1); }
      curva.setAttribute('d', d);
      /* fase 1: raizes, delta, f(0) = c */
      var D = 4 - 4 * c, on0 = fase === 0;
      if (on0 && D >= -1e-9) {
        var q = Math.sqrt(Math.max(0, D)) / 2;
        pos(r1, 1 - q, 0); pos(r2, 1 + q, 0); op(r1, 1); op(r2, q > .02 ? 1 : 0);
        lab(lR1, 1 - q, 0, q > .02 ? 0 : 0, -12, q > .02 ? nf(1 - q) : 'x = 1'); lab(lR2, 1 + q, 0, 0, -12, nf(1 + q)); op(lR1, 1); op(lR2, q > .02 ? 1 : 0);
      } else { op(r1, 0); op(r2, 0); op(lR1, 0); op(lR2, 0); }
      op(dist, on0 && Math.abs(c + 3) < .01 ? 1 : 0);
      pos(pc, 0, c * s); op(pc, on0 ? 1 : 0); lab(lC, 0, c, -9, c > 0 ? -8 : 20, '(0; ' + nf(c) + ')'); op(lC, on0 && (c < -2.99 || Math.abs(c - 1) < .01 || c > 2.99) ? 1 : 0);
      /* fase 2: eixo de simetria, pontos simetricos, vertice */
      var on1 = fase === 1 && t > 8.1;
      eixoS.setAttribute('x1', px(1)); eixoS.setAttribute('x2', px(1)); op(eixoS, on1 || fase === 2 ? 1 : 0);
      pos(s1, 0, -3); pos(s2, 2, -3); op(s1, on1 ? 1 : 0); op(s2, on1 ? 1 : 0);
      simL.setAttribute('x1', px(0)); simL.setAttribute('x2', px(2)); simL.setAttribute('y1', py(-3)); simL.setAttribute('y2', py(-3)); op(simL, on1 ? 1 : 0);
      var vy = s * (1 - 2 + (fase >= 1 ? -3 : c));
      pos(pv, 1, vy); op(pv, fase >= 1 && (fase !== 2 || t > 12 || t < 11.1) ? 1 : 0);
      if (fase === 1) { lV.style.textAnchor = 'start'; lab(lV, 1, -4, 10, 20, 'V(1; −4) mínimo'); }
      else { lV.style.textAnchor = 'middle'; lab(lV, 1, 4, 0, -12, fase === 2 ? 'V(1; 4) máximo' : 'V(1; 4)'); }
      op(lV, (on1 || (fase === 2 && t > 12) || fase === 3 && (k === null || k < 3.9)) || fase === 4 ? 1 : 0);
      /* fases 4 e 5: retas */
      if (fase === 3) {
        reta.setAttribute('x1', PX0); reta.setAttribute('x2', PX1); reta.setAttribute('y1', py(k)); reta.setAttribute('y2', py(k)); op(reta, 1);
        lab(lReta, 3.6, k, 0, -8, 'y = ' + nf(k)); op(lReta, 1);
        var Dk = 16 - 4 * k;
        if (Dk >= -1e-9) {
          var h = Math.sqrt(Math.max(0, Dk)) / 2;
          pos(i1, 1 - h, k); pos(i2, 1 + h, k); op(i1, 1); op(i2, h > .02 ? 1 : 0);
        } else { op(i1, 0); op(i2, 0); }
        op(lI1, 0); op(lI2, 0);
      } else if (fase === 4) {
        reta.setAttribute('x1', px(-3.6)); reta.setAttribute('y1', py(-2.6)); reta.setAttribute('x2', px(5.6)); reta.setAttribute('y2', py(6.6));
        var u = ease((t - 21.6) / .8); op(reta, u); lab(lReta, 3.3, 4.3, 8, 4, 'y = x + 1'); op(lReta, u);
        pos(i1, -1, 0); pos(i2, 2, 3); op(i1, t > 22.3 ? 1 : 0); op(i2, t > 22.3 ? 1 : 0);
        lab(lI1, -1, 0, -8, -10, '(−1; 0)'); lab(lI2, 2, 3, 10, 18, '(2; 3)'); op(lI1, t > 22.3 ? 1 : 0); op(lI2, t > 22.3 ? 1 : 0);
      } else { op(reta, 0); op(lReta, 0); op(i1, 0); op(i2, 0); op(lI1, 0); op(lI2, 0); }
      /* textos */
      var X = TX[fase]; T.textContent = X[0]; for (var m = 0; m < 5; m++) L[m].textContent = X[m + 1];
      var a = '', b = '';
      if (fase === 0) {
        if (Math.abs(c + 3) < .01) { a = 'c = −3 → Δ = 16 > 0: duas raízes'; b = 'x = −1 e x = 3, distantes 3 − (−1) = 4'; }
        else if (Math.abs(c - 1) < .01) { a = 'c = 1 → Δ = 0: raiz dupla, x = 1'; b = 'a curva só encosta no eixo x'; }
        else if (Math.abs(c - 3) < .01) { a = 'c = 3 → Δ = −8 < 0: nenhuma raiz'; b = 'a curva não toca o eixo x'; }
        else { a = 'Δ = (−2)² − 4·1·c = 4 − 4c'; b = ''; }
      } else if (fase === 1) { a = 'a > 0: abre para cima, mínimo −4'; b = 'imagem: y ≥ −4'; }
      else if (fase === 2) { a = t > 12 ? 'xv diz ONDE: x = 1' : ''; b = t > 12 ? 'g(xv) diz QUANTO: o máximo é 4' : ''; }
      else if (fase === 3) {
        if (k === 0) { a = 'k = 0 → Δ = 16 > 0: dois pontos'; b = 'x = −1 e x = 3'; }
        else if (k === 4) { a = 'k = 4 → Δ = 0: um ponto só, o vértice'; b = 'a reta só encosta no topo (tangente)'; }
        else if (k === 5) { a = 'k = 5 → Δ = −4 < 0: nenhum ponto'; b = 'a reta passa acima do máximo'; }
      } else { a = t > 22.3 ? 'Encontros: (−1; 0) e (2; 3)' : ''; b = t > 22.3 ? 'cada ponto está na reta e na curva' : ''; }
      V1.textContent = a; V2.textContent = b; painel.style.opacity = 1;
    };
    var G3 = ['2812cd36', 'E6b68c42', 'P4f670c8', 'P81ffe98', 'f00105b5'], G2 = ['68164d65', 'Edd97e57', 'P3df432d'];
    return fimResposta(VIS.def['parabola-vertice-raizes'], svg, _desenha, 25, RESP, qid, {
      x: 276, y: 40, w: 356, semEsmaecer: true, esconde: painel,
      congela: function (q) { return q === '8300798f' ? 1.3 : q === '68e60d23' ? 3.8 : G2.indexOf(q) >= 0 ? 10.5 : G3.indexOf(q) >= 0 ? 14.5 : q === 'P2672015' || q === 'P5278660' ? 18.6 : 24.95; }
    });
  }
};
VIS.liga('parabola-vertice-raizes', ['2812cd36', '49fda58b', '68164d65', '8300798f', '996afd55', 'E6b68c42', 'Edd97e57', 'P2672015', 'P3df432d', 'P4f670c8', 'P81ffe98', 'f00105b5', 'P5278660', '68e60d23']);
