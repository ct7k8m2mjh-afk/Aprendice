/* Circunferencia no plano cartesiano, em escala (1 unidade = 20 px): completar quadrados (centro e raio),
   reta x circunferencia pela distancia d do centro (externa, tangente, secante e a corda), duas circunferencias
   (d entre centros x soma dos raios) e regiao dada por desigualdades (disco e semiplano, com ponto-teste). */
/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid).
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
  if (opc.base) { h = Math.max(h, vb[3] - 226); y = vb[3] - h - 4; }
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
'134fdcda': [
'Por isso a resposta é A',
'Centro (4, 0), r = √21. Distância à reta x + 2y + 1 = 0: |4 + 0 + 1| ÷ √5 = √5.',
'(corda ÷ 2)² + (√5)² = 21 → (corda ÷ 2)² = 16 → corda ÷ 2 = 4 → corda = 8.'
],
'8d8b7fea': [
'Por isso a resposta é C',
'O cliente está no círculo de raio 5 e numa paralela a 1 km da avenida (a 4 km).',
'Paralela a 3 km do centro: d < r, secante, 2 pontos. A 5 km: d = r, tangente, 1.',
'Total: 2 + 1 = 3 pontos.'
],
'P8da6610': [
'Por isso a resposta é A',
'Centro da praça Q = (4, 4); P = (8, 4). Centro do prédio a 10 de Q: (14, 4).',
'Raio = distância do centro a P = 14 − 8 = 6: (x − 14)² + (y − 4)² = 36.'
],
'Paeea58a': [
'Por isso a resposta é C',
'Disco: x² + y² ≤ 1. Reta por (−1, 0) e (0, 1): y = x + 1, ou y − x = 1.',
'Teste a origem, fora da parte pintada: 0 − 0 = 0 < 1. Então a parte pintada',
'é o outro lado: x² + y² ≤ 1 e y − x ≥ 1.'
],
'Pc458dc9': [
'Por isso a resposta é E',
'Completando quadrados: (x − 2)² + y² = 1 e x² + (y − 2)² = 1.',
'Centros (2, 0) e (0, 2): d = √8 ≈ 2,83 > 1 + 1 = 2.',
'Centros distintos e circunferências externas: não se interceptam.'
],
'Pdc0b730': [
'Por isso a resposta é D',
'Equidistante dos eixos: y = x ou y = −x. Circunferência (x − 1)² + (y − 3)² = 8.',
'y = x: Δ = 12 > 0, secante: 2 pontos (x = 2 ± √3, 1.º quadrante).',
'y = −x: Δ = 0, tangente: 1 ponto, (−1, 1), no 2.º quadrante. Total: 3.'
],
'W0402f77': [
'Por isso a resposta é B',
'Centro = ponto médio de A(4, 0) e B(0, 6): (2, 3). r² = (√52 ÷ 2)² = 13.',
'(x − 2)² + (y − 3)² = 13 → x² − 4x + 4 + y² − 6y + 9 = 13',
'→ x² + y² − 4x − 6y = 0.'
]
};
VIS.def['circunferencia-posicoes'] = {
  tit: 'Circunferência: centro e raio, retas, outra circunferência e regiões',
  fontes: [
    'Wikipedia (en), Circle (equação (x − a)² + (y − b)² = r²) — https://en.wikipedia.org/wiki/Circle',
    'Khan Academy, Completing the square to write equation in standard form of a circle — https://www.khanacademy.org/math/geometry/xff63fac4:hs-geo-conic-sections/hs-geo-circle-expanded-equation/v/completing-the-square-to-write-equation-in-standard-form-of-a-circle',
    'Wikipedia (en), Distance from a point to a line — https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line'
  ],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Centro'], [3, '2. Reta: d × r'], [6, '3. Duas circ.'], [9, '4. Região']],
  cred: 'Animação feita para o app. Plano cartesiano em escala (cada quadradinho = 1 unidade); pontos e distâncias calculados pelas equações.',
  nota: 'Forma reduzida: (x − a)² + (y − b)² = r², centro (a, b) e raio r. Reta ax + by + c = 0: d = |a·x₀ + b·y₀ + c| ÷ √(a² + b²); d > r externa, d = r tangente, d < r secante, com (corda ÷ 2)² + d² = r². Duas circunferências: compare a distância entre os centros com r₁ + r₂.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function br(v, d) { return v.toFixed(d).replace('.', ','); }
    var TF = 12, U = 24, OX = 40, OY = 190, RET = '#c0392b', C2 = '#8a5a9e';
    function X(x) { return OX + U * x; } function Y(y) { return OY - U * y; }
    svg.setAttribute('viewBox', '0 0 640 350');
    /* malha: x de -2 a 16, y de -1 a 8 */
    for (var gx = -1; gx <= 14; gx++) el('line', { x1: X(gx), x2: X(gx), y1: Y(-0.6), y2: Y(7.8), style: 'stroke:var(--linha);stroke-width:1' });
    for (var gy = 0; gy <= 7; gy++) el('line', { x1: X(-1.4), x2: X(14.5), y1: Y(gy), y2: Y(gy), style: 'stroke:var(--linha);stroke-width:1' });
    el('path', { d: 'M' + X(-1.4) + ' ' + Y(0) + ' H' + X(14.5) + ' M' + X(0) + ' ' + Y(-0.6) + ' V' + Y(7.8), style: 'fill:none;stroke:var(--lapis);stroke-width:1.5' });
    tx(X(14.5) - 12, Y(0) - 6, 'x', 'font-size:14px;font-weight:700;fill:var(--lapis)'); tx(X(0) + 6, Y(7.8) + 12, 'y', 'font-size:14px;font-weight:700;fill:var(--lapis)');
    [2, 4, 6, 8, 10, 12].forEach(function (v) { tx(X(v), Y(0) + 16, String(v), 'font-size:14px;fill:var(--lapis);text-anchor:middle'); });
    [2, 4, 6].forEach(function (v) { tx(X(0) - 6, Y(v) + 5, String(v), 'font-size:14px;fill:var(--lapis);text-anchor:end'); });
    var defs = el('defs', {}), cp = el('clipPath', { id: 'cp-circ-pos' }, defs); el('rect', { x: 0, y: 0, width: 394, height: 207 }, cp);
    var G = el('g', { 'clip-path': 'url(#cp-circ-pos)' });
    function lim() { while (G.firstChild) G.removeChild(G.firstChild); }
    function pth(d, st) { return el('path', { d: d, style: st }, G); }
    function lb(x, y, s, st) { return tx(x.toFixed(1), y.toFixed(1), s, st || 'font-size:14px;font-weight:700;fill:var(--tinta)', G); }
    function circ(cx, cy, r, st, ate) {
      ate = ate === undefined ? 1 : ate;
      if (ate >= .999) return el('circle', { cx: X(cx), cy: Y(cy), r: U * r, style: st }, G);
      var a1 = 2 * Math.PI * ate, p0 = [X(cx + r), Y(cy)], p1 = [X(cx + r * Math.cos(a1)), Y(cy + r * Math.sin(a1))];
      return pth('M' + p0[0] + ' ' + p0[1] + ' A' + U * r + ' ' + U * r + ' 0 ' + (a1 > Math.PI ? 1 : 0) + ' 0 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1), st);
    }
    function ponto(x, y, c) { el('circle', { cx: X(x).toFixed(1), cy: Y(y).toFixed(1), r: 4.5, style: 'fill:' + (c || 'var(--tinta)') }, G); }
    function seg(a, b, st) { pth('M' + X(a[0]).toFixed(1) + ' ' + Y(a[1]).toFixed(1) + ' L' + X(b[0]).toFixed(1) + ' ' + Y(b[1]).toFixed(1), st); }
    var CC = 'fill:color-mix(in srgb,var(--ad-c) 10%,transparent);stroke:var(--ad-c);stroke-width:2.6';
    el('rect', { x: 404, y: 16, width: 226, height: 182, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var K = []; for (var i = 0; i < 4; i++) K.push(tx(418, 44 + 30 * i, '', 'font-size:15px;fill:var(--tinta)'));
    var K5 = tx(418, 184, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Completar quadrados: centro e raio', 'x² + y² − 8x − 6y + 16 = 0 → (x² − 8x + 16) + (y² − 6y + 9) = −16 + 16 + 9', '(x − 4)² + (y − 3)² = 9: centro (4, 3) e raio √9 = 3.', 'Forma reduzida: (x − a)² + (y − b)² = r² tem centro (a, b) e raio r.'],
      ['2. Reta e circunferência: compare d com r', 'd = distância do centro à reta = |a·x₀ + b·y₀ + c| ÷ √(a² + b²).', 'd > r: não toca. d = r: tangente (1 ponto). d < r: secante (2 pontos).', 'Corda: (corda ÷ 2)² + d² = r². Reta x + 2y − 5 = 0: d = √5, corda 4.'],
      ['3. Duas circunferências: distância entre os centros', 'r₁ = 3 e r₂ = 2. Compare d (entre os centros) com r₁ + r₂ = 5:', 'd > 5: externas, sem ponto comum. d = 5: tangentes por fora.', 'd < 5 (e maior que r₁ − r₂ = 1): secantes, 2 pontos comuns.'],
      ['4. Região: cada desigualdade escolhe um lado', '(x − 4)² + (y − 3)² ≤ 9 é o disco: dentro e na borda.', 'y − x ≥ 0 é um lado da reta y = x. Para saber qual, teste um ponto:', '(2, 5): 5 − 2 = 3 ≥ 0 e (2 − 4)² + (5 − 3)² = 8 ≤ 9. Ele está na região.']
    ];
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3, u, KT, k;
      lim();
      var hi = 'font-size:15px;font-weight:700;fill:var(--ad-t)', no = 'font-size:15px;fill:var(--tinta)';
      K.forEach(function (x) { x.setAttribute('style', no); });
      if (f === 0) {
        ponto(4, 3); lb(X(4) + 6, Y(3) + 18, '(4, 3)');
        u = ease((t - .5) / 1.5); circ(4, 3, 3, CC, u);
        if (u > .98) { seg([4, 3], [7, 3], 'fill:none;stroke:' + RET + ';stroke-width:2.4'); lb(X(5.5) - 4, Y(3) - 6, 'r = 3', 'font-size:14px;font-weight:700;fill:' + RET); }
        KT = ['−8x: some (8 ÷ 2)² = 16', '−6y: some (6 ÷ 2)² = 9', 'centro (4, 3)', 'raio √9 = 3', '(x − 4)² + (y − 3)² = 9'];
      } else if (f === 1) {
        circ(4, 3, 3, CC); ponto(4, 3);
        var dd = t < 3.4 ? 4.6 : t < 4.4 ? lerp(4.6, 3, ease((t - 3.4) / .9)) : t < 4.8 ? 3 : lerp(3, Math.sqrt(5), ease((t - 4.8) / .7));
        var nx = 1 / Math.sqrt(5), ny = 2 / Math.sqrt(5), Fx = 4 - dd * nx, Fy = 3 - dd * ny, ux = 2 / Math.sqrt(5), uy = -1 / Math.sqrt(5);
        seg([Fx - 8 * ux, Fy - 8 * uy], [Fx + 8 * ux, Fy + 8 * uy], 'fill:none;stroke:' + RET + ';stroke-width:2.6');
        seg([4, 3], [Fx, Fy], 'fill:none;stroke:var(--tinta);stroke-width:1.8;stroke-dasharray:5 3');
        lb(X((4 + Fx) / 2) + 8, Y((3 + Fy) / 2), 'd', 'font-size:15px;font-weight:700;fill:var(--tinta)');
        var est = dd > 3.001 ? 0 : dd > 2.999 ? 1 : 2;
        if (est === 1) ponto(Fx, Fy, RET);
        if (est === 2) {
          var hc = Math.sqrt(9 - dd * dd), A = [Fx + hc * ux, Fy + hc * uy], B = [Fx - hc * ux, Fy - hc * uy];
          ponto(A[0], A[1], RET); ponto(B[0], B[1], RET);
          if (dd < 2.25) {
            pth('M' + X(4) + ' ' + Y(3) + ' L' + X(Fx).toFixed(1) + ' ' + Y(Fy).toFixed(1) + ' L' + X(A[0]).toFixed(1) + ' ' + Y(A[1]).toFixed(1) + ' Z', 'fill:color-mix(in srgb,#c98a12 26%,transparent);stroke:#c98a12;stroke-width:1.6');
            seg([Fx, Fy], A, 'fill:none;stroke:#c98a12;stroke-width:4');
            lb(X(6.4), Y(0.7), '← meia corda 2', 'font-size:15px;font-weight:700;fill:#a06d0c');
            lb(X((4 + A[0]) / 2) + 10, Y((3 + A[1]) / 2) - 6, 'r = 3', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
          }
        }
        KT = ['d > r: 0 pontos (Δ < 0)', 'd = r: 1 ponto (Δ = 0)', 'd < r: 2 pontos (Δ > 0)', '', 'd = ' + (dd < 2.25 ? '√5 ≈ 2,24' : br(dd, 2)) + (est === 0 ? ' > 3' : est === 1 ? ' = 3' : ' < 3')];
        K[est].setAttribute('style', hi);
      } else if (f === 2) {
        circ(4, 3, 3, CC); ponto(4, 3);
        var D = t < 6.9 ? 7 : t < 7.5 ? lerp(7, 5, ease((t - 6.9) / .6)) : t < 7.9 ? 5 : lerp(5, 4, ease((t - 7.9) / .6));
        circ(4 + D, 3, 2, 'fill:color-mix(in srgb,' + C2 + ' 10%,transparent);stroke:' + C2 + ';stroke-width:2.6'); ponto(4 + D, 3);
        seg([4, 3], [4 + D, 3], 'fill:none;stroke:var(--tinta);stroke-width:1.6;stroke-dasharray:5 3');
        lb(X(4 + D / 2) - 4, Y(3) - 14, 'd = ' + br(D, D % 1 ? 1 : 0));
        var e2 = D > 5.001 ? 0 : D > 4.999 ? 1 : 2;
        if (e2 === 1) ponto(7, 3, RET);
        if (e2 === 2) { var a = (D * D + 9 - 4) / (2 * D), h = Math.sqrt(9 - a * a); ponto(4 + a, 3 + h, RET); ponto(4 + a, 3 - h, RET); }
        lb(X(4) - 30, Y(6.4), 'r₁ = 3', 'font-size:14px;font-weight:700;fill:var(--ad-t)'); lb(X(4 + D) - 18, Y(5.4), 'r₂ = 2', 'font-size:14px;font-weight:700;fill:' + C2);
        KT = ['d > 5: externas, 0', 'd = 5: tangentes, 1', '1 < d < 5: secantes, 2', 'd < 1: uma dentro da outra', 'r₁ + r₂ = 5'];
        K[e2].setAttribute('style', hi);
      } else {
        /* disco cortado pelo semiplano y - x >= 0 (Sutherland-Hodgman) */
        var poly = []; for (k = 0; k < 120; k++) { var an = 2 * Math.PI * k / 120; poly.push([4 + 3 * Math.cos(an), 3 + 3 * Math.sin(an)]); }
        var R = []; for (k = 0; k < poly.length; k++) { var p = poly[k], q = poly[(k + 1) % poly.length], ip = p[1] - p[0] >= 0, iq = q[1] - q[0] >= 0; if (ip) R.push(p); if (ip !== iq) { var s = (p[1] - p[0]) / ((p[1] - p[0]) - (q[1] - q[0])); R.push([p[0] + s * (q[0] - p[0]), p[1] + s * (q[1] - p[1])]); } }
        u = ease((t - 9.3) / .8);
        pth(R.map(function (p, i) { return (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); }).join(' ') + ' Z', 'fill:color-mix(in srgb,var(--ad-c) 34%,transparent);stroke:none;opacity:' + u.toFixed(2));
        circ(4, 3, 3, 'fill:none;stroke:var(--ad-c);stroke-width:2.6');
        seg([-1.5, -1.5], [8, 8], 'fill:none;stroke:' + RET + ';stroke-width:2.4');
        lb(X(7.6) + 6, Y(7.6) + 14, 'y = x', 'font-size:14px;font-weight:700;fill:' + RET);
        if (t > 10) { ponto(2, 5, '#c98a12'); lb(X(2) - 46, Y(5) - 6, '(2, 5)', 'font-size:14px;font-weight:700;fill:#a06d0c'); }
        KT = ['disco: (x−4)² + (y−3)² ≤ 9', 'semiplano: y − x ≥ 0', 'teste (2, 5):', '3 ≥ 0 e 8 ≤ 9: dentro', 'região = os dois'];
      }
      for (j = 0; j < 4; j++) K[j].textContent = KT[j]; K5.textContent = KT[4];
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
    };
    var CG = { '134fdcda': 5.95, '8d8b7fea': 5.95, 'Pdc0b730': 5.95, 'P8da6610': 2.95, 'W0402f77': 2.95, 'Pc458dc9': 6.6, 'Paeea58a': 11.95 };
    return fimResposta(VIS.def['circunferencia-posicoes'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('circunferencia-posicoes', ['134fdcda', '8d8b7fea', 'P8da6610', 'Paeea58a', 'Pc458dc9', 'Pdc0b730', 'W0402f77']);
