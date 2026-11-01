/* Circunferencia: uma volta = 2 pi r (roda rolando, cicloide exata), arco e setor como fracao da volta,
   ponteiros do relogio (6 graus/min e 0,5 grau/min), circulo rolando por dentro de um triangulo 9-12-15
   (o centro descreve o triangulo semelhante 6-8-10) e distancia entre superficies x entre centros. */
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
'2e803be0': ['Por isso a resposta é B', 'O giro de 360° pede um círculo', 'de 1,50 m de borda a borda', '(o diâmetro).', 'raio = 1,50 ÷ 2 = 0,75 m'],
'63634aa7': ['Por isso a resposta é A', '2πr = 68 cm', 'r = 68 ÷ 6,28 ≈ 10,8 cm', 'O mais próximo é 11.'],
'7d50c2b2': ['Por isso a resposta é E', 'Uma volta: 2 · 3,14 · 50 = 314 m', '84 000 m ÷ 314 m = 267,5...', 'Voltas completas: 267'],
'P09ac4ef': ['Por isso a resposta é C', 'Polo → Equador: 90° = 1/4', 'da volta = 10 000 km (2 vezes)', 'No Equador: 45° = 1/8 → 5 000 km', 'Total: 25 000 km'],
'Ped0bb37': ['Por isso a resposta é C', 'Gira em C: 150°, raio 2 → 5π/3', 'Gira em A: 90°, raio 1 → π/2', 'Gira em B: B fica parado (0)', 'Total: 5π/3 + π/2 = 13π/6'],
'E9ee4fbd': ['Por isso a resposta é C', 'A caixa sobe o arco da roda:', 's = θ · r = (12π/5) · 0,30 m', '= 0,72π ≈ 2,26 m'],
'P77b38ad': ['Por isso a resposta é B', '120° é 1/3 do círculo', 'de raio 370 km:', 'π · 370² ÷ 3 ≈ 143 289 km²,', 'entre 140 000 e 150 000 km²'],
'021d9373': ['Por isso a resposta é B', 'Minutos: 54 · 6 = 324°', 'Horas: 30 + 54 · 0,5 = 57°', 'Ângulo: 360° − 267° = 93°', 'Arco: (93 ÷ 360) · 120 = 31 cm'],
'44b8a69e': ['Por isso a resposta é B', 'Raio inscrito:', '(6 + 8 − 10) ÷ 2 = 2', 'k = (2 − 1) ÷ 2 = 1/2', 'Área: 24 · (1/2)² = 6 cm²'],
'P905eecf': ['Por isso a resposta é E', 'C 11 vezes maior → raio 11x', 'A partir do Sol: centro da Terra', 'em y + x; de Júpiter em 5,2y + 11x', 'Diferença: 10x + 4,2y']
};
VIS.def['arcos-setores-rolamento'] = {
  tit: 'Circunferência: volta, arco, setor e rolamento',
  fontes: ['OpenStax, Precalculus 2e, 5.1 Angles (arc length, sector area) — https://openstax.org/books/precalculus-2e/pages/5-1-angles', 'Wikipedia (pt), Circunferência — https://pt.wikipedia.org/wiki/Circunfer%C3%AAncia', 'Wikipedia (pt), Setor circular — https://pt.wikipedia.org/wiki/Setor_circular', 'Wikipedia (en), Clock angle problem — https://en.wikipedia.org/wiki/Clock_angle_problem', 'Wikipedia (en), Cycloid — https://en.wikipedia.org/wiki/Cycloid', 'Wikipedia (en), Incircle and excircles — https://en.wikipedia.org/wiki/Incircle_and_excircles'],
  tipo: 'anim', dur: 24.36,
  marcas: [[0, 'Volta'], [4.2, 'Arco'], [8.4, 'Setor'], [12.32, 'Relógio'], [16.52, 'Rolar dentro'], [20.44, 'Centros']],
  cred: 'Animação feita para o app. Medidas calculadas no código (roda e triângulo em escala; esquema da etapa 6 fora de escala).',
  nota: 'Tudo na circunferência é proporção com a volta inteira: arco = (θ ÷ 360°) · 2πr e setor = (θ ÷ 360°) · πr². Um ponto que gira em torno de um centro anda um arco cujo raio é a distância até esse centro.',
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
    var COR = 'var(--ad-c)', ARC = '#b4442f', AUX = '#2b6cb0', HOR = '#9a7220';
    var R14 = 'font-size:14px;font-weight:700;fill:', R15 = 'font-size:15px;font-weight:700;fill:';
    svg.setAttribute('viewBox', '0 0 640 350');
    var RAD = Math.PI / 180;
    /* ---------- etapa 1: roda rolando ---------- */
    var g1 = el('g', {}), GY = 236, RW = 40, CX0 = 52, VOLTA = 2 * Math.PI * RW;
    el('line', { x1: 12, x2: 350, y1: GY, y2: GY, style: 'stroke:var(--tinta);stroke-width:1.8' }, g1);
    var trilho = el('line', { y1: GY, y2: GY, style: 'stroke:' + ARC + ';stroke-width:5' }, g1);
    var cicl = el('path', { style: 'fill:none;stroke:' + ARC + ';stroke-width:1.5;stroke-dasharray:3 4' }, g1);
    el('line', { x1: CX0, x2: CX0 + VOLTA, y1: GY - RW, y2: GY - RW, style: 'stroke:var(--lapis);stroke-width:1.4;stroke-dasharray:6 5' }, g1);
    var roda = el('g', {}, g1);
    el('circle', { cx: 0, cy: 0, r: RW, style: 'fill:color-mix(in srgb,var(--ad-c) 10%,var(--folha));stroke:' + COR + ';stroke-width:3' }, roda);
    el('line', { x1: -RW, x2: RW, y1: 0, y2: 0, style: 'stroke:' + COR + ';stroke-width:1.4' }, roda);
    el('line', { x1: 0, x2: 0, y1: -RW, y2: RW, style: 'stroke:' + COR + ';stroke-width:1.4' }, roda);
    el('circle', { cx: 0, cy: 0, r: 3.5, style: 'fill:var(--tinta)' }, roda);
    var marca = el('circle', { r: 5.5, style: 'fill:' + ARC + ';stroke:var(--folha);stroke-width:2' }, g1);
    var medidas = el('g', {}, g1);
    el('line', { x1: CX0, x2: CX0, y1: GY - 2 * RW, y2: GY, style: 'stroke:' + AUX + ';stroke-width:2.2' }, medidas);
    el('line', { x1: CX0, x2: CX0 + RW, y1: GY - RW, y2: GY - RW, style: 'stroke:' + HOR + ';stroke-width:2.6' }, medidas);
    tx(CX0 + RW / 2, GY - RW - 8, 'r', 'font-size:15px;font-weight:700;font-style:italic;text-anchor:middle;fill:' + HOR + HALO, medidas);
    tx(CX0 - 8, GY - 2 * RW - 8, 'd = 2r', R14 + AUX + HALO, medidas);
    var l2pr = tx(CX0 + VOLTA / 2, GY + 22, 'uma volta = 2πr', R15 + ARC + ';text-anchor:middle' + HALO, g1);
    tx(CX0 + VOLTA / 2, GY - 2 * RW - 12, 'centro: sempre a r do chão', 'font-size:14px;fill:var(--lapis);text-anchor:middle' + HALO, g1);
    /* ---------- etapas 2 e 3: arco e setor ---------- */
    var g2 = el('g', {}), OX = 172, OY = 182, RC = 124;
    var setor = el('path', { style: 'fill:color-mix(in srgb,var(--ad-c) 22%,var(--folha));stroke:none' }, g2);
    el('circle', { cx: OX, cy: OY, r: RC, style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, g2);
    var oitavos = el('g', {}, g2);
    for (var k = 0; k < 8; k++) el('line', { x1: OX, y1: OY, x2: OX + RC * Math.cos(k * 45 * RAD), y2: OY - RC * Math.sin(k * 45 * RAD), style: 'stroke:var(--linha);stroke-width:1.2' }, oitavos);
    var arco = el('path', { style: 'fill:none;stroke:' + ARC + ';stroke-width:6;stroke-linecap:round' }, g2);
    el('line', { x1: OX, y1: OY, x2: OX + RC, y2: OY, style: 'stroke:' + COR + ';stroke-width:2.6' }, g2);
    var raio = el('line', { x1: OX, y1: OY, style: 'stroke:' + COR + ';stroke-width:2.6' }, g2);
    var angA = el('path', { style: 'fill:none;stroke:' + HOR + ';stroke-width:2' }, g2);
    var pB = el('circle', { r: 6, style: 'fill:' + ARC + ';stroke:var(--folha);stroke-width:2' }, g2);
    el('circle', { cx: OX, cy: OY, r: 3.5, style: 'fill:var(--tinta)' }, g2);
    tx(OX + RC / 2, OY + 20, 'r', 'font-size:15px;font-weight:700;font-style:italic;text-anchor:middle;fill:var(--ad-t)' + HALO, g2);
    var lTh = tx(0, 0, '', R15 + HOR + HALO, g2), lArc = tx(0, 0, '', R15 + ARC + ';text-anchor:middle' + HALO, g2);
    var lSet = tx(OX + 70 * Math.cos(60 * RAD), OY - 70 * Math.sin(60 * RAD) + 5, '', R15 + 'var(--ad-t);text-anchor:middle' + HALO, g2);
    /* ---------- etapa 4: relogio ---------- */
    var g4 = el('g', {});
    el('circle', { cx: OX, cy: OY, r: RC, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2.4' }, g4);
    for (var m = 0; m < 60; m++) { var a = m * 6 * RAD, l = m % 5 ? 6 : 13; el('line', { x1: OX + (RC - l) * Math.sin(a), y1: OY - (RC - l) * Math.cos(a), x2: OX + RC * Math.sin(a), y2: OY - RC * Math.cos(a), style: 'stroke:var(--tinta);stroke-width:' + (m % 5 ? 1 : 2.2) }, g4); }
    for (var hh = 1; hh <= 12; hh++) { var b = hh * 30 * RAD; tx(OX + 98 * Math.sin(b), OY - 98 * Math.cos(b) + 6, '' + hh, 'font-size:16px;font-weight:600;text-anchor:middle;fill:var(--tinta)', g4); }
    var arcR = el('path', { style: 'fill:none;stroke:' + ARC + ';stroke-width:6' }, g4);
    var angR = el('path', { style: 'fill:color-mix(in srgb,' + ARC + ' 18%,transparent);stroke:' + ARC + ';stroke-width:1.6' }, g4);
    var pMin = el('line', { x1: OX, y1: OY, style: 'stroke:var(--tinta);stroke-width:3.5;stroke-linecap:round' }, g4);
    var pHor = el('line', { x1: OX, y1: OY, style: 'stroke:' + HOR + ';stroke-width:6;stroke-linecap:round' }, g4);
    el('circle', { cx: OX, cy: OY, r: 5, style: 'fill:var(--tinta)' }, g4);
    var lHora = tx(OX, OY + RC + 22, '', R15 + 'var(--tinta);text-anchor:middle', g4);
    var l50 = tx(0, 0, '50°', R15 + ARC + ';text-anchor:middle' + HALO, g4);
    /* ---------- etapa 5: circulo rolando por dentro do triangulo 9-12-15 (escala 20 px por unidade) ---------- */
    var g5 = el('g', {}), SX = 56, SY = 304, E = 20;
    function m2s(x, y) { return [SX + E * x, SY - E * y]; }
    var Pp = m2s(0, 0), Qp = m2s(12, 0), Rp = m2s(0, 9);
    el('path', { d: 'M' + Pp + ' L' + Qp + ' L' + Rp + ' Z', style: 'fill:none;stroke:var(--tinta);stroke-width:2.4;stroke-linejoin:round' }, g5);
    el('path', { d: 'M' + (Pp[0] + 12) + ' ' + Pp[1] + ' v-12 h-12', style: 'fill:none;stroke:var(--tinta);stroke-width:1.4' }, g5);
    tx((Pp[0] + Qp[0]) / 2, Pp[1] + 20, '12', 'font-size:14px;fill:var(--lapis);text-anchor:middle', g5);
    tx(Pp[0] - 8, (Pp[1] + Rp[1]) / 2, '9', 'font-size:14px;fill:var(--lapis);text-anchor:end', g5);
    tx((Qp[0] + Rp[0]) / 2 + 12, (Qp[1] + Rp[1]) / 2 - 8, '15', 'font-size:14px;fill:var(--lapis)', g5);
    var CAM = [[1, 1], [9, 1], [1, 7], [1, 1]];   /* vertices do rastro do centro: homotetia de razao 2/3 pelo incentro (3; 3) */
    var LADO = CAM.slice(1).map(function (p, i) { return Math.hypot(p[0] - CAM[i][0], p[1] - CAM[i][1]); }), TOT = LADO.reduce(function (s, v) { return s + v; }, 0);
    var rastro = el('path', { style: 'fill:color-mix(in srgb,' + ARC + ' 10%,transparent);stroke:' + ARC + ';stroke-width:2.6;stroke-linejoin:round' }, g5);
    var bola = el('circle', { r: E, style: 'fill:color-mix(in srgb,var(--ad-c) 14%,var(--folha));stroke:' + COR + ';stroke-width:2.4' }, g5);
    var cen = el('circle', { r: 4, style: 'fill:' + ARC }, g5);
    var rAux = el('line', { style: 'stroke:' + HOR + ';stroke-width:2.2' }, g5), lR = tx(0, 0, 'r', 'font-size:15px;font-weight:700;font-style:italic;fill:' + HOR + HALO, g5);
    var inc = el('g', {}, g5);
    var Ic = m2s(3, 3);
    el('circle', { cx: Ic[0], cy: Ic[1], r: 3 * E, style: 'fill:none;stroke:' + AUX + ';stroke-width:1.6;stroke-dasharray:5 4' }, inc);
    el('line', { x1: Ic[0], y1: Ic[1], x2: Ic[0], y2: Pp[1], style: 'stroke:' + AUX + ';stroke-width:1.6' }, inc);
    tx(Ic[0] + 6, Ic[1] + 34, '3', R14 + AUX + HALO, inc);
    var lTri = tx(m2s(4.4, 2.2)[0], m2s(4.4, 2.2)[1], '6, 8, 10', R14 + ARC + HALO, g5);
    /* ---------- etapa 6: superficies x centros ---------- */
    var g6 = el('g', {}), YC = 166, A_ = 24, B_ = 72, CA = 52, GAP = 100, CB = CA + A_ + GAP + B_;
    el('circle', { cx: CA, cy: YC, r: A_, style: 'fill:color-mix(in srgb,' + AUX + ' 14%,var(--folha));stroke:' + AUX + ';stroke-width:2.2' }, g6);
    el('circle', { cx: CB, cy: YC, r: B_, style: 'fill:color-mix(in srgb,' + HOR + ' 14%,var(--folha));stroke:' + HOR + ';stroke-width:2.2' }, g6);
    el('line', { x1: CA, x2: CB, y1: YC, y2: YC, style: 'stroke:var(--tinta);stroke-width:1.2;stroke-dasharray:4 4' }, g6);
    [CA, CB].forEach(function (x) { el('circle', { cx: x, cy: YC, r: 3.5, style: 'fill:var(--tinta)' }, g6); });
    function chave(x1, x2, y, s, cor, pai) { el('path', { d: 'M' + x1 + ' ' + (y - 6) + ' v6 H' + x2 + ' v-6', style: 'fill:none;stroke:' + cor + ';stroke-width:1.8' }, pai); tx((x1 + x2) / 2, y + 18, s, R14 + cor + ';text-anchor:middle' + HALO, pai); }
    var ch1 = el('g', {}, g6), ch2 = el('g', {}, g6);
    chave(CA, CA + A_, YC + B_ + 18, 'a', AUX, ch1); chave(CA + A_, CA + A_ + GAP, YC + B_ + 18, 'g', ARC, ch1); chave(CA + A_ + GAP, CB, YC + B_ + 18, 'b', HOR, ch1);
    chave(CA, CB, YC + B_ + 62, 'centro a centro = a + g + b', 'var(--tinta)', ch2);
    tx(CA + A_ + GAP / 2, YC - 12, 'superfícies', 'font-size:14px;fill:' + ARC + ';text-anchor:middle', g6);
    el('line', { x1: CA + A_, x2: CA + A_ + GAP, y1: YC - 4, y2: YC - 4, style: 'stroke:' + ARC + ';stroke-width:3' }, g6);
    tx(CB, YC - B_ - 10, 'b = 3a', 'font-size:14px;fill:var(--lapis);text-anchor:middle' + HALO, g6);
    /* ---------- painel de texto ---------- */
    var painel = el('g', {});
    var T = tx(366, 36, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3, 4].map(function (k) { return tx(366, 68 + 25 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    el('line', { x1: 366, x2: 630, y1: 206, y2: 206, style: 'stroke:var(--linha);stroke-width:1.2' }, painel);
    var V1 = tx(366, 236, '', 'font-size:15.5px;font-weight:700;fill:var(--tinta)', painel), V2 = tx(366, 261, '', 'font-size:15px;fill:var(--tinta)', painel);
    var TX = [
      ['1. Uma volta: C = 2πr', 'Raio r: do centro até a borda.', 'Diâmetro d = 2r: de borda a borda.', 'Rolando sem escorregar, uma', 'volta da roda anda 2πr no chão.', 'n voltas: n · 2πr (mesma unidade).'],
      ['2. Arco: fração da volta', 'Um ponto que gira em torno de um', 'centro anda um arco de raio r.', 'arco = (θ ÷ 360°) · 2πr', 'Em radianos: arco = θ · r', '(1 rad abre um arco igual a r)'],
      ['3. Setor: fração da área', 'O setor (fatia) abre o ângulo θ:', 'área = (θ ÷ 360°) · πr²', '120° é 1/3 de 360°:', 'área do setor = πr² ÷ 3', ''],
      ['4. Ponteiros do relógio', 'Minutos: 360° em 60 min = 6°/min.', 'Horas: 30° por hora = 0,5°/min.', 'Às 2h20: minutos em 20 · 6 = 120°;', 'horas em 60 + 20 · 0,5 = 70°.', 'O ponteiro das horas também anda.'],
      ['5. Círculo rolando por dentro', 'Encostado num lado, o centro fica', 'a r dele: anda numa paralela.', 'O rastro é um triângulo semelhante.', 'Raio inscrito de 9-12-15: 3. Com', 'r = 1: k = (3 − 1) ÷ 3 = 2/3.'],
      ['6. Superfície × centro', 'Entre as superfícies: g.', 'Do centro à superfície: o raio.', 'centro a centro = a + g + b', 'C = 2πr: circunferência 3 vezes', 'maior → raio 3 vezes maior.']
    ];
    function arcoPath(cx, cy, r, a0, a1) {   /* angulos em graus, anti-horario a partir do eixo x */
      var x0 = cx + r * Math.cos(a0 * RAD), y0 = cy - r * Math.sin(a0 * RAD), x1 = cx + r * Math.cos(a1 * RAD), y1 = cy - r * Math.sin(a1 * RAD);
      return 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 0 ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
    }
    function relArco(r, m0, m1) {   /* angulos a partir do 12, sentido horario */
      var x0 = OX + r * Math.sin(m0 * RAD), y0 = OY - r * Math.cos(m0 * RAD), x1 = OX + r * Math.sin(m1 * RAD), y1 = OY - r * Math.cos(m1 * RAD);
      return 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (m1 - m0 > 180 ? 1 : 0) + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
    }
    var _desenha = function (t) {
      t = t / 1.4;
      var fase = t < 3 ? 0 : t < 6 ? 1 : t < 8.8 ? 2 : t < 11.8 ? 3 : t < 14.6 ? 4 : 5;
      op(g1, fase === 0 ? 1 : 0); op(g2, fase === 1 || fase === 2 ? 1 : 0); op(g4, fase === 3 ? 1 : 0); op(g5, fase === 4 ? 1 : 0); op(g6, fase === 5 ? 1 : 0);
      var v1 = '', v2 = '';
      if (fase === 0) {
        var s = VOLTA * ease((t - .5) / 1.9), th = s / RW;
        roda.setAttribute('transform', 'translate(' + (CX0 + s).toFixed(1) + ' ' + (GY - RW) + ') rotate(' + (th / RAD).toFixed(1) + ')');
        at(trilho, { x1: CX0, x2: CX0 + s });
        at(marca, { cx: CX0 + RW * th - RW * Math.sin(th), cy: GY - (RW - RW * Math.cos(th)) });
        var d = ''; for (var q = 0; q <= th + 1e-9; q += .05) d += (d ? 'L' : 'M') + (CX0 + RW * q - RW * Math.sin(q)).toFixed(1) + ' ' + (GY - RW + RW * Math.cos(q)).toFixed(1) + ' ';
        cicl.setAttribute('d', d || 'M0 0');
        op(medidas, t < .5 ? 1 : 1 - cl((t - .5) / .3)); op(l2pr, s > VOLTA - .5 ? 1 : 0);
        v1 = s > VOLTA - .5 ? 'O ponto marcado voltou ao chão:' : 'Centro a r do chão o tempo todo:';
        v2 = s > VOLTA - .5 ? 'a roda andou exatamente 2πr.' : 'ele anda numa reta paralela.';
      }
      if (fase === 1 || fase === 2) {
        var ang = fase === 2 ? 120 : t < 4.6 ? 90 * ease((t - 3.2) / .8) : lerp(90, 120, ease((t - 4.6) / .5));
        var bx = OX + RC * Math.cos(ang * RAD), by = OY - RC * Math.sin(ang * RAD);
        at(raio, { x2: bx, y2: by }); at(pB, { cx: bx, cy: by });
        arco.setAttribute('d', ang > .5 ? arcoPath(OX, OY, RC, 0, ang) : 'M0 0');
        angA.setAttribute('d', ang > .5 ? arcoPath(OX, OY, 30, 0, ang) : 'M0 0');
        var mid = ang / 2 * RAD; at(lTh, { x: OX + 38 * Math.cos(mid) + 2, y: OY - 38 * Math.sin(mid) + 4 }); lTh.textContent = ang > 20 ? 'θ' : '';
        at(lArc, { x: OX + (RC + 22) * Math.cos(mid) + 10, y: OY - (RC + 22) * Math.sin(mid) + 4 }); lArc.textContent = ang > 20 ? 'arco' : '';
        setor.setAttribute('d', fase === 2 ? 'M' + OX + ' ' + OY + ' L' + (OX + RC) + ' ' + OY + ' ' + arcoPath(OX, OY, RC, 0, 120).replace(/^M[^A]+/, '') + ' Z' : 'M0 0');
        op(setor, fase === 2 ? ease((t - 6.1) / .6) : 0); op(oitavos, 0);
        lSet.textContent = fase === 2 ? 'πr² ÷ 3' : ''; op(arco, fase === 2 ? .5 : 1);
        if (fase === 1) {
          if (Math.abs(ang - 90) < .01) { v1 = 'θ = 90°: 1/4 da volta'; v2 = 'arco = 2πr ÷ 4'; }
          else if (Math.abs(ang - 120) < .01) { v1 = 'θ = 120°: 1/3 da volta'; v2 = 'arco = 2πr ÷ 3'; }
        } else { v1 = 'Mesma fração para arco e área:'; v2 = '120 ÷ 360 = 1/3 dos dois.'; }
      }
      if (fase === 3) {
        var mm = 20 * ease((t - 9.1) / 1.5), aM = 6 * mm, aH = 60 + .5 * mm;
        at(pMin, { x2: OX + 104 * Math.sin(aM * RAD), y2: OY - 104 * Math.cos(aM * RAD) });
        at(pHor, { x2: OX + 64 * Math.sin(aH * RAD), y2: OY - 64 * Math.cos(aH * RAD) });
        lHora.textContent = '2h' + (Math.round(mm) < 10 ? '0' : '') + Math.round(mm);
        var fim = mm > 19.99;
        angR.setAttribute('d', fim ? 'M' + OX + ' ' + OY + ' L' + (OX + 44 * Math.sin(70 * RAD)).toFixed(1) + ' ' + (OY - 44 * Math.cos(70 * RAD)).toFixed(1) + ' ' + relArco(44, 70, 120).replace(/^M[^A]+/, '') + ' Z' : 'M0 0');
        arcR.setAttribute('d', fim ? relArco(RC, 70, 120) : 'M0 0');
        at(l50, { x: OX + 58 * Math.sin(95 * RAD), y: OY - 58 * Math.cos(95 * RAD) + 5 }); op(l50, fim ? 1 : 0);
        v1 = fim ? 'Entre eles: 120° − 70° = 50°' : ''; v2 = fim ? 'borda: (50 ÷ 360) · 2πr' : '';
      }
      if (fase === 4) {
        var u = TOT * ease((t - 12.1) / 1.9), d5 = 'M' + m2s(1, 1), acc = 0, cx = 1, cy = 1;
        for (var i = 0; i < 3; i++) {
          var f = cl((u - acc) / LADO[i]); if (f <= 0) break;
          cx = lerp(CAM[i][0], CAM[i + 1][0], f); cy = lerp(CAM[i][1], CAM[i + 1][1], f);
          d5 += ' L' + m2s(cx, cy); acc += LADO[i];
        }
        rastro.setAttribute('d', d5 + (u >= TOT - 1e-6 ? ' Z' : ''));
        rastro.style.fillOpacity = u >= TOT - 1e-6 ? 1 : 0;
        var C = m2s(cx, cy); at(bola, { cx: C[0], cy: C[1] }); at(cen, { cx: C[0], cy: C[1] });
        at(rAux, { x1: C[0], y1: C[1], x2: C[0], y2: C[1] + E }); at(lR, { x: C[0] + 6, y: C[1] + 16 });
        var ini = t < 12.1; op(rAux, ini ? 1 : 0); op(lR, ini ? 1 : 0);
        var fim5 = u >= TOT - 1e-6; op(inc, fim5 ? 1 : 0); op(lTri, fim5 ? 1 : 0);
        v1 = fim5 ? 'Rastro: lados 6, 8 e 10' : ''; v2 = fim5 ? 'área: 54 · (2/3)² = 24' : '';
      }
      if (fase === 5) {
        op(ch1, ease((t - 14.8) / .5)); op(ch2, ease((t - 15.6) / .5));
        v1 = ''; v2 = '';
      }
      var X = TX[fase]; T.textContent = X[0]; for (var n = 0; n < 5; n++) L[n].textContent = X[n + 1];
      V1.textContent = v1; V2.textContent = v2; painel.style.opacity = 1;
    };
    return fimResposta(VIS.def['arcos-setores-rolamento'], svg, _desenha, 24.36, RESP, qid, {
      x: 356, y: 40, w: 276, semEsmaecer: true, esconde: painel,
      congela: function (q) {
        return q === '2e803be0' ? 0.42 : ['63634aa7', '7d50c2b2'].indexOf(q) >= 0 ? 4.06 : q === 'P09ac4ef' ? 6.16 : q === 'Ped0bb37' || q === 'E9ee4fbd' ? 8.26
          : q === 'P77b38ad' ? 12.18 : q === '021d9373' ? 16.38 : q === '44b8a69e' ? 20.3 : 24.29;
      }
    });
  }
};
VIS.liga('arcos-setores-rolamento', ['021d9373', '2e803be0', '63634aa7', '7d50c2b2', 'P09ac4ef', 'P77b38ad', 'P905eecf', 'Ped0bb37', '44b8a69e', 'E9ee4fbd']);
