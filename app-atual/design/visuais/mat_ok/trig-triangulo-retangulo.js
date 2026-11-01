/* Trigonometria no triangulo retangulo: nomear os lados a partir do angulo, sen/cos/tg (3-4-5 e o semelhante 1,5-2-2,5),
   cena do teodolito (tg com a altura do aparelho somada), triangulos notaveis 45-45-90 e 30-60-90 com a tabela,
   e a altura comum a dois triangulos retangulos (BD = h / tg B, DC = h / tg C). Coordenadas calculadas no codigo, em escala. */
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
'P806a6ef': ['Por isso a resposta é D', 'β está no triângulo retângulo FBE:', 'oposto a β: FB = 9 − 4 = 5', 'adjacente: BE = √(15² − 9²) = 12', 'tg β = 5 ÷ 12'],
'63d469d5': ['Por isso a resposta é C', 'altura = raio · sen α (oposto ÷ hip.)', 'sen α = 0,6 e cos α = 8 ÷ 10 = 0,8', 'sen 2α = 2 · 0,6 · 0,8 = 0,96', 'altura = 10 · 0,96 = 9,6 m'],
'7d72a06e': ['Por isso a resposta é A', 'sen θ = largura ÷ comprimento', '= 1,5 ÷ 2,5 = 0,6', 'Na coluna dos senos: 0,60 → 37°'],
'E5fc57a2': ['Por isso a resposta é A', 'Para α: B é oposto, A é adjacente.', 'tg α = B ÷ A → A · tg α = B = 2', 'S3: 2 · tg (π/4) = 2 · 1 = 2'],
'P9702414': ['Por isso a resposta é B', 'tg α = 17,5 ÷ 30 ≈ 0,583: entre', 'tg 30° e tg 31° → 30° < α < 31°', 'Pilar: h ÷ 22 = 17,5 ÷ 30', 'h = 385 ÷ 30 = 77/6'],
'Pb0bae23': ['Por isso a resposta é C', 'sen β = oposto ÷ hipotenusa:', '10 ÷ 29 ≈ 0,345 → entre 20° e 21°', '10 ÷ 45 ≈ 0,222 → entre 12° e 13°', 'Diferença: entre 7° e 9°'],
'ddea88c2': ['Por isso a resposta é E', 'Catetos 12 e 5 → hip. √169 = 13', 'cos CDN = adjacente ÷ hipotenusa', '= 12 ÷ 13 ≈ 0,92'],
'11b1e878': ['Por isso a resposta é A', 'tg 60° = oposto ÷ adjacente:', 'BT = 1,5 ÷ 1,73 ≈ 0,87 m', 'reflexão: TC = 2,7 ÷ 1,73 ≈ 1,56 m', 'BC ≈ 2,43 m → mais perto de 2,42'],
'70cc1a1b': ['Por isso a resposta é C', 'tg 60° = h ÷ 4√3', 'h = 4√3 · √3 = 12 m', 'Some o estilingue: 12 + 2 = 14 m', 't = 14 ÷ 2 = 7 s'],
'P5355fb8': ['Por isso a resposta é E', 'A: 40 · tg 7° = 4,88 → o chão de A', 'fica 4,88 − 1,6 = 3,28 m abaixo de M', 'B: 1,6 + 40 · tg 5° − 3,60 = 1,48 m', 'acima de M. Soma: 4,76 ≈ 4,80 m'],
'W8e1567d': ['Por isso a resposta é D', 'tg 30° = x ÷ 13√3', 'x = 13√3 · √3/3 = 13 m', 'Some o teodolito: 13 + 1,65 = 14,65 m'],
'8577a6e0': ['Por isso a resposta é A', 'Ângulos de 45°: hip. = cateto · √2', 'ND = d√2 e NU = (10 − d)√2 ÷ 2', 'perímetro = 2d√2 + (10 − d)√2', '= 10√2 + d√2'],
'W781715b': ['Por isso a resposta é E', 'A rampa é a hipotenusa (36 m) e', 'a altura é o lado oposto aos 30°:', 'sen 30° = h ÷ 36 = 1/2 → h = 18 m'],
'ce1ec442': ['Por isso a resposta é E', 'Pisos somados: cateto adjacente.', 'cos 60° = soma ÷ 900 cm = 1/2', 'soma = 450 cm → 450 ÷ 18 = 25'],
'f9551064': ['Por isso a resposta é E', 'tg 60° = BF ÷ 6 → BF = 6√3', 'CF = 6√3 − 6; ECF ~ ABF:', 'CE = 6 · CF ÷ BF = 6 − 2√3', '= 2(3 − √3) cm'],
'95784e8a': ['Por isso a resposta é A', 'Cantos: DE = 5k, BE = 4k, FC = 7k', 'AH = 10k → BH = 8k e CH = 14k', '35k² − 20k² = 960 → k = 8', 'ADG: (88 · 40) ÷ 2 = 1 760 cm²'],
'E519a497': ['Por isso a resposta é D', 'A altura AD é cateto dos dois:', 'BD = AD ÷ n e DC = AD ÷ m', 'AD ÷ n + AD ÷ m = ℓ', 'AD = ℓ · m · n ÷ (m + n)']
};
VIS.def['trig-triangulo-retangulo'] = {
  tit: 'Seno, cosseno e tangente no triângulo retângulo',
  fontes: ['OpenStax, Precalculus 2e, 5.4 Right Triangle Trigonometry — https://openstax.org/books/precalculus-2e/pages/5-4-right-triangle-trigonometry', 'Wikipedia (pt), Trigonometria — https://pt.wikipedia.org/wiki/Trigonometria', 'Wikipedia (en), Exact trigonometric values — https://en.wikipedia.org/wiki/Exact_trigonometric_values'],
  tipo: 'anim', dur: 15.4,
  marcas: [[0, 'Lados'], [3, 'sen, cos, tg'], [6.2, 'Altura (tg)'], [9.4, 'Notáveis'], [12.4, 'Altura comum']],
  cred: 'Animação feita para o app. Triângulos desenhados em escala.',
  nota: 'Antes de escolher a razão, nomeie os lados a partir do ângulo: hipotenusa (de frente para o 90°), oposto (de frente para o ângulo) e adjacente (encostado nele). sen = oposto ÷ hipotenusa, cos = adjacente ÷ hipotenusa, tg = oposto ÷ adjacente.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var HALO = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    var HIP = '#8a5a9e', OPO = '#b4442f', ADJ = '#2b6cb0', ANG = '#9a7220', COR = 'var(--ad-c)';
    var R15 = 'font-size:15px;font-weight:700;fill:', R14 = 'font-size:14px;font-weight:700;fill:';
    svg.setAttribute('viewBox', '0 0 640 350');
    var RAD = Math.PI / 180;
    function arcAng(cx, cy, r, a0, a1) { var x0 = cx + r * Math.cos(a0 * RAD), y0 = cy - r * Math.sin(a0 * RAD), x1 = cx + r * Math.cos(a1 * RAD), y1 = cy - r * Math.sin(a1 * RAD); return 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 0 0 ' + x1.toFixed(1) + ' ' + y1.toFixed(1); }
    function seg(p, q, cor, w, pai) { return el('line', { x1: p[0], y1: p[1], x2: q[0], y2: q[1], style: 'stroke:' + cor + ';stroke-width:' + (w || 3) + ';stroke-linecap:round' }, pai); }
    function reto(p, dx, dy, pai) { el('path', { d: 'M' + (p[0] + dx) + ' ' + p[1] + ' V' + (p[1] + dy) + ' H' + p[0], style: 'fill:none;stroke:var(--tinta);stroke-width:1.4' }, pai); }
    /* ---------- etapas 1 e 2: triangulo 3-4-5 (60 px por unidade) ---------- */
    var g12 = el('g', {}), A = [40, 290], C = [280, 290], B = [280, 110];
    var sAC = seg(A, C, ADJ, 4, g12), sBC = seg(B, C, OPO, 4, g12), sAB = seg(A, B, HIP, 4, g12);
    reto(C, -14, -14, g12);
    var angA = el('path', { d: arcAng(A[0], A[1], 42, 0, Math.atan2(3, 4) / RAD), style: 'fill:none;stroke:' + ANG + ';stroke-width:2.4' }, g12);
    var angB = el('path', { d: arcAng(B[0], B[1], 38, 180 + Math.atan2(3, 4) / RAD, 270), style: 'fill:none;stroke:' + ANG + ';stroke-width:2.4' }, g12);
    angB.setAttribute('d', 'M' + B[0] + ' ' + (B[1] + 38) + ' A38 38 0 0 1 ' + (B[0] - 38 * 0.8).toFixed(1) + ' ' + (B[1] + 38 * 0.6).toFixed(1));
    var lA = tx(A[0] + 50, A[1] - 8, 'α', 'font-size:17px;font-weight:700;fill:' + ANG + HALO, g12), lB = tx(B[0] - 20, B[1] + 56, 'β', 'font-size:17px;font-weight:700;fill:' + ANG + HALO, g12);
    tx(A[0] - 6, A[1] + 20, 'A', R15 + 'var(--tinta)', g12); tx(C[0] + 6, C[1] + 20, 'C', R15 + 'var(--tinta)', g12); tx(B[0] + 8, B[1] + 4, 'B', R15 + 'var(--tinta)', g12);
    var nHip = tx(140, 186, 'hipotenusa', R15 + HIP + ';text-anchor:middle' + HALO, g12);
    var nAC = tx(160, 312, '', R15 + ADJ + ';text-anchor:middle', g12), nBC = tx(290, 206, '', R15 + OPO + HALO, g12);
    var num = el('g', {}, g12);
    tx(130, 168, '5', 'font-size:16px;font-weight:700;fill:' + HIP + HALO, num); tx(160, 334, '4', 'font-size:16px;font-weight:700;fill:' + ADJ, num); tx(292, 228, '3', 'font-size:16px;font-weight:700;fill:' + OPO + HALO, num);
    var peq = el('g', {}, g12), A2 = A, C2 = [A[0] + 120, A[1]], B2 = [A[0] + 120, A[1] - 90];
    el('path', { d: 'M' + A2 + ' L' + C2 + ' L' + B2 + ' Z', style: 'fill:color-mix(in srgb,var(--ad-c) 18%,transparent);stroke:' + COR + ';stroke-width:2.4;stroke-linejoin:round' }, peq);
    tx(C2[0] + 6, C2[1] - 36, '1,5', R14 + COR + HALO, peq); tx(A2[0] + 92, A2[1] + 18, '2', R14 + COR + ';text-anchor:middle' + HALO, peq); tx(A2[0] + 52, A2[1] - 52, '2,5', R14 + COR + ';text-anchor:end' + HALO, peq);
    /* ---------- etapa 3: teodolito e predio (10 px por metro; tg alfa = 0,75) ---------- */
    var g3 = el('g', {}), GY = 302, OLHO = [52, GY - 15], XB = 252, TOPO = [XB, GY - 165];
    el('line', { x1: 10, x2: 336, y1: GY, y2: GY, style: 'stroke:var(--tinta);stroke-width:1.8' }, g3);
    el('rect', { x: XB, y: TOPO[1], width: 56, height: GY - TOPO[1], style: 'fill:color-mix(in srgb,var(--lapis) 22%,var(--folha));stroke:var(--lapis);stroke-width:1.6' }, g3);
    el('path', { d: 'M' + (OLHO[0] - 8) + ' ' + GY + ' L' + OLHO[0] + ' ' + (OLHO[1] + 4) + ' L' + (OLHO[0] + 8) + ' ' + GY + ' M' + OLHO[0] + ' ' + (OLHO[1] + 4) + ' V' + GY, style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, g3);
    el('rect', { x: OLHO[0] - 7, y: OLHO[1] - 5, width: 14, height: 9, rx: 2, style: 'fill:var(--tinta)' }, g3);
    var hor = el('line', { x1: OLHO[0], y1: OLHO[1], x2: XB, y2: OLHO[1], style: 'stroke:' + ADJ + ';stroke-width:3;stroke-dasharray:8 5' }, g3);
    var vis = el('line', { x1: OLHO[0], y1: OLHO[1], x2: TOPO[0], y2: TOPO[1], style: 'stroke:' + HIP + ';stroke-width:2.4' }, g3);
    var alt = seg([XB, OLHO[1]], TOPO, OPO, 5, g3);
    el('path', { d: arcAng(OLHO[0], OLHO[1], 44, 0, Math.atan2(3, 4) / RAD), style: 'fill:none;stroke:' + ANG + ';stroke-width:2.2' }, g3);
    tx(OLHO[0] + 50, OLHO[1] - 8, 'α', 'font-size:17px;font-weight:700;fill:' + ANG + HALO, g3);
    tx((OLHO[0] + XB) / 2, OLHO[1] + 20, '20 m (adjacente)', R14 + ADJ + ';text-anchor:middle' + HALO, g3);
    var lX = tx(XB - 8, (OLHO[1] + TOPO[1]) / 2, 'x (oposto)', R14 + OPO + ';text-anchor:end' + HALO, g3);
    el('path', { d: 'M' + (XB + 64) + ' ' + OLHO[1] + ' h6 V' + GY + ' h-6', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, g3);
    tx(XB + 67, GY + 18, '1,5 m', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle' + HALO, g3);
    var tot3 = tx(XB + 28, TOPO[1] - 10, 'altura = 15 + 1,5', R14 + 'var(--ad-t);text-anchor:middle' + HALO, g3);
    /* ---------- etapa 4: triangulos notaveis (80 px por unidade) ---------- */
    var g4 = el('g', {}), U = 100, P45 = [22, 290], P30 = [150, 290];
    var q1 = [P45[0] + U, P45[1]], q2 = [P45[0], P45[1] - U];
    el('path', { d: 'M' + P45 + ' L' + q1 + ' L' + q2 + ' Z', style: 'fill:color-mix(in srgb,var(--ad-c) 12%,transparent);stroke:var(--tinta);stroke-width:2.2;stroke-linejoin:round' }, g4);
    reto(P45, 12, -12, g4);
    tx(P45[0] + U / 2, P45[1] + 20, '1', R15 + ADJ + ';text-anchor:middle', g4); tx(P45[0] - 8, P45[1] - U / 2 + 5, '1', R15 + OPO + ';text-anchor:end', g4);
    tx(P45[0] + U / 2 + 10, P45[1] - U / 2 - 6, '√2', R15 + HIP + HALO, g4);
    tx(q1[0] - 40, q1[1] - 8, '45°', R14 + ANG + HALO, g4); tx(q2[0] + 6, q2[1] + 32, '45°', R14 + ANG + HALO, g4);
    var r3 = Math.sqrt(3), w1 = [P30[0] + U * r3, P30[1]], w2 = [P30[0], P30[1] - U];
    el('path', { d: 'M' + P30 + ' L' + w1 + ' L' + w2 + ' Z', style: 'fill:color-mix(in srgb,var(--ad-c) 12%,transparent);stroke:var(--tinta);stroke-width:2.2;stroke-linejoin:round' }, g4);
    reto(P30, 12, -12, g4);
    tx(P30[0] + U * r3 / 2, P30[1] + 20, '√3', R15 + ADJ + ';text-anchor:middle', g4); tx(P30[0] - 8, P30[1] - U / 2 + 5, '1', R15 + OPO + ';text-anchor:end', g4);
    tx(P30[0] + U * r3 / 2 + 8, P30[1] - U / 2 - 8, '2', R15 + HIP + HALO, g4);
    tx(w1[0] - 54, w1[1] - 8, '30°', R14 + ANG + HALO, g4); tx(w2[0] + 6, w2[1] + 34, '60°', R14 + ANG + HALO, g4);
    tx(22, 334, 'metade do quadrado', 'font-size:14px;fill:var(--lapis)', g4); tx(170, 334, 'metade do equilátero', 'font-size:14px;fill:var(--lapis)', g4);
    /* ---------- etapa 5: altura comum (22 px por unidade; tg B = 0,75 e tg C = 1,5) ---------- */
    var g5 = el('g', {}), E = 22, B5 = [30, 292], D5 = [30 + 8 * E, 292], C5 = [30 + 12 * E, 292], A5 = [30 + 8 * E, 292 - 6 * E];
    el('path', { d: 'M' + A5 + ' L' + B5 + ' L' + C5 + ' Z', style: 'fill:none;stroke:var(--tinta);stroke-width:2.2;stroke-linejoin:round' }, g5);
    var hgt = seg(A5, D5, OPO, 4, g5); reto(D5, 12, -12, g5);
    seg(B5, D5, ADJ, 4, g5); seg(D5, C5, '#2f855a', 4, g5);
    el('path', { d: arcAng(B5[0], B5[1], 40, 0, Math.atan2(6, 8) / RAD), style: 'fill:none;stroke:' + ANG + ';stroke-width:2.2' }, g5);
    el('path', { d: 'M' + (C5[0] - 34) + ' ' + C5[1] + ' A34 34 0 0 1 ' + (C5[0] - 34 * Math.cos(Math.atan2(6, 4))).toFixed(1) + ' ' + (C5[1] - 34 * Math.sin(Math.atan2(6, 4))).toFixed(1), style: 'fill:none;stroke:' + ANG + ';stroke-width:2.2' }, g5);
    tx(B5[0] - 4, B5[1] + 20, 'B', R15 + 'var(--tinta)', g5); tx(C5[0] - 2, C5[1] + 20, 'C', R15 + 'var(--tinta)', g5); tx(D5[0] - 4, D5[1] + 20, 'D', R15 + 'var(--tinta)', g5); tx(A5[0] - 4, A5[1] - 8, 'A', R15 + 'var(--tinta)', g5);
    tx(A5[0] - 8, (A5[1] + D5[1]) / 2, 'h = 6', R15 + OPO + ';text-anchor:end' + HALO, g5);
    var b5 = tx((B5[0] + D5[0]) / 2, B5[1] - 10, 'BD = h ÷ tg B', R14 + ADJ + ';text-anchor:middle' + HALO, g5);
    var c5 = tx((D5[0] + C5[0]) / 2, B5[1] + 36, 'DC = h ÷ tg C', R14 + '#2f855a;text-anchor:middle' + HALO, g5);
    /* ---------- painel ---------- */
    var painel = el('g', {});
    var T = tx(350, 36, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3, 4].map(function (k) { return tx(350, 68 + 25 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    var tab = el('g', {}, painel);
    var CXT = [400, 466, 532, 598];
    [['', '30°', '45°', '60°'], ['sen', '1/2', '√2/2', '√3/2'], ['cos', '√3/2', '√2/2', '1/2'], ['tg', '√3/3', '1', '√3']].forEach(function (ln, r) {
      ln.forEach(function (s, k) { tx(k ? CXT[k] : 350, 120 + 26 * r, s, (r === 0 || k === 0 ? 'font-size:15px;font-weight:700;fill:var(--ad-t)' : 'font-size:15.5px;fill:var(--tinta)') + (k ? ';text-anchor:middle' : ''), tab); });
      if (r) el('line', { x1: 350, x2: 625, y1: 101 + 26 * r, y2: 101 + 26 * r, style: 'stroke:var(--linha);stroke-width:1' }, tab);
    });
    el('line', { x1: 350, x2: 630, y1: 206, y2: 206, style: 'stroke:var(--linha);stroke-width:1.2' }, painel);
    var V1 = tx(350, 236, '', 'font-size:15.5px;font-weight:700;fill:var(--tinta)', painel), V2 = tx(350, 261, '', 'font-size:15px;fill:var(--tinta)', painel);
    var TX = [
      ['1. Nomeie os lados pelo ângulo', 'Hipotenusa: de frente para o 90°,', 'o maior lado.', 'Oposto: de frente para o ângulo.', 'Adjacente: encostado no ângulo', '(e que não é a hipotenusa).'],
      ['2. As três razões', 'sen α = oposto ÷ hipotenusa = 3/5', 'cos α = adjacente ÷ hipotenusa = 4/5', 'tg α = oposto ÷ adjacente = 3/4', 'O triângulo menor tem o mesmo α:', '1,5 ÷ 2,5 = 3 ÷ 5 = 0,6'],
      ['3. Altura com a tangente', 'Tenho o adjacente (20 m) e quero', 'o oposto (x): a razão é a tg.', 'tg α = x ÷ 20 → x = 20 · 0,75 = 15 m', 'A visada sai do aparelho, não do chão:', 'some a altura dele (1,5 m).'],
      ['4. Ângulos notáveis', 'Valores que saem dos dois triângulos:', '', '', '', ''],
      ['5. Altura comum a dois triângulos', 'A altura AD é cateto dos dois', 'triângulos retângulos ao mesmo tempo:', 'tg B = h ÷ BD e tg C = h ÷ DC.', 'Escreva BD e DC em função de h e use', 'BD + DC = BC.']
    ];
    var _desenha = function (t) {
      var fase = t < 3 ? 0 : t < 6.2 ? 1 : t < 9.4 ? 2 : t < 12.4 ? 3 : 4;
      op(g12, fase <= 1 ? 1 : 0); op(g3, fase === 2 ? 1 : 0); op(g4, fase === 3 ? 1 : 0); op(g5, fase === 4 ? 1 : 0);
      var v1 = '', v2 = '';
      if (fase <= 1) {
        var emB = fase === 0 && t > 1.7;   /* na fase 1 o angulo de referencia e alfa */
        sAC.style.stroke = emB ? OPO : ADJ; sBC.style.stroke = emB ? ADJ : OPO;
        op(angA, emB ? .25 : 1); op(lA, emB ? .25 : 1); op(angB, emB ? 1 : .25); op(lB, emB ? 1 : .25);
        nAC.textContent = fase === 0 ? (emB ? 'oposto a β' : 'adjacente a α') : ''; nAC.style.fill = emB ? OPO : ADJ;
        nBC.textContent = fase === 0 ? (emB ? 'adjacente a β' : 'oposto a α') : ''; nBC.style.fill = emB ? ADJ : OPO;
        op(nHip, fase === 0 ? 1 : 0); op(num, fase === 1 ? 1 : 0); op(peq, fase === 1 ? ease((t - 4.4) / .6) : 0);
        if (fase === 0) { v1 = emB ? 'Trocou o ângulo, trocaram os nomes:' : 'Para o ângulo α:'; v2 = emB ? 'o oposto a β é o adjacente a α.' : 'oposto = BC, adjacente = AC.'; }
        else { v1 = 'A razão só depende do ângulo,'; v2 = 'não do tamanho do triângulo.'; }
      }
      if (fase === 2) {
        op(alt, ease((t - 6.8) / .6)); op(lX, ease((t - 6.8) / .6)); op(tot3, ease((t - 7.8) / .6));
        v1 = t > 7.8 ? 'Altura do prédio: 15 + 1,5 = 16,5 m' : ''; v2 = t > 7.8 ? '(só x é a tg; o aparelho soma depois)' : '';
      }
      if (fase === 3) { v1 = 'tg = sen ÷ cos; sen 30° = cos 60°.'; v2 = 'Hipotenusa do de 45°: cateto · √2'; }
      if (fase === 4) {
        op(b5, ease((t - 12.8) / .5)); op(c5, ease((t - 13.3) / .5));
        v1 = t > 13.8 ? 'Exemplo: h = 6, tg B = 0,75, tg C = 1,5' : ''; v2 = t > 13.8 ? 'BD = 8, DC = 4 → BC = 12' : '';
      }
      var X = TX[fase]; T.textContent = X[0]; for (var m = 0; m < 5; m++) L[m].textContent = X[m + 1];
      op(tab, fase === 3 ? 1 : 0);
      V1.textContent = v1; V2.textContent = v2; painel.style.opacity = 1;
    };
    var S2 = ['63d469d5', '7d72a06e', 'E5fc57a2', 'P9702414', 'Pb0bae23', 'ddea88c2'], S3 = ['11b1e878', '70cc1a1b', 'P5355fb8', 'W8e1567d'], S4 = ['8577a6e0', 'W781715b', 'ce1ec442', 'f9551064'];
    return fimResposta(VIS.def['trig-triangulo-retangulo'], svg, _desenha, 15.4, RESP, qid, {
      x: 340, y: 30, w: 292, semEsmaecer: true, esconde: painel,
      congela: function (q) { return q === 'P806a6ef' ? 1.2 : S2.indexOf(q) >= 0 ? 6.1 : S3.indexOf(q) >= 0 ? 9.3 : S4.indexOf(q) >= 0 ? 12.3 : 15.3; }
    });
  }
};
VIS.liga('trig-triangulo-retangulo', ['11b1e878', '63d469d5', '70cc1a1b', '7d72a06e', '8577a6e0', '95784e8a', 'E519a497', 'E5fc57a2', 'P5355fb8', 'P806a6ef', 'P9702414', 'Pb0bae23', 'W781715b', 'W8e1567d', 'ce1ec442', 'ddea88c2', 'f9551064']);
