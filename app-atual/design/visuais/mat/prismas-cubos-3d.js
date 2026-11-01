/* Prismas e blocos em 3D, desenhados por projecao ortogonal (proporcoes reais): volume = area da base x altura
   (base hexagonal fatiada em triangulos), area total pela planificacao da caixa 6 x 3 x 2, diagonal por Pitagoras
   duas vezes (D = 7) e a esfera que contem o bloco (diametro = diagonal). */
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
'226c7ad2': [
'Por isso a resposta é E',
'Volume: x · 3x · 7 = 189 → x = 3. Medidas 3, 9 e 7: faces 27, 21 e 63.',
'Cada face aparece duas vezes: 2 × (27 + 21 + 63) = 222 cm².'
],
'417841e0': [
'Por isso a resposta é E',
'A base octogonal são 8 triângulos de lados 16 e 16 e ângulo 45°:',
'cada um tem ½ · 16 · 16 · sen 45° = 64√2; base = 512√2 cm².',
'V = área da base × altura = 512√2 × 4 = 2 048√2 cm³.'
],
'74127ce2': [
'Por isso a resposta é B',
'Volume ÷ faces dá as arestas: 1 232 ÷ 112 = 11 e 1 232 ÷ 154 = 8; a outra é 14.',
'A maior distância é a diagonal do bloco: D² = 8² + 14² + 11² = 381.',
'D = √381 cm (as alternativas 2√65 e 14 são diagonal de face e aresta).'
],
'7565e0e4': [
'Por isso a resposta é C',
'Base (6 triângulos) ÷ face lateral: (3ℓ²√3 ÷ 2) ÷ (ℓ · 2√3) = 3ℓ ÷ 4 = 6 → ℓ = 8.',
'Área da base = 3 · 64 · √3 ÷ 2 = 96√3 cm².',
'V = área da base × altura = 96√3 × 2√3 = 576 cm³.'
],
'E0110b96': [
'Por isso a resposta é C',
'A base FMAI se corta em dois triângulos: 2 cm² + 3 cm² = 5 cm².',
'Prisma: V = área da base × altura = 5 × 10 = 50 cm³.'
],
'P67c88e6': [
'Por isso a resposta é A',
'A menor esfera que contém o bloco passa pelos 8 vértices:',
'diâmetro = diagonal = √(7² + 4² + 4²) = √81 = 9 cm.'
],
'P76a859d': [
'Por isso a resposta é B',
'Base: triângulo 9, 9, 12. Altura dele: 9² = h² + 6² → h = 3√5; área 18√5 cm².',
'V = área da base × altura do prisma = 18√5 × 6√5 = 108 × 5 = 540 cm³.'
],
'W821d598': [
'Por isso a resposta é B',
'Comprimento × largura × altura de uma caixa é área da base × altura:',
'm × m × m = m³, a unidade de volume (2,5 × 0,5 × 1,3 = 1,625 m³).'
],
'bb65cd86': [
'Por isso a resposta é B',
'Área da base: retângulo 20 × 16 = 320 menos os recortes 24 + 24 + 50 = 222 cm².',
'V = área da base × altura = 222 × 20 = 4 440 cm³.'
],
'c43d72fc': [
'Por isso a resposta é A',
'TS é a diagonal do chão quadrado: 8√2 ≈ 11,31 m (diagonal de face = a√2).',
'Total: 8 + 11,31 + 4 × 4 = 35,31 m, entre 35,1 e 35,4.'
]
};
VIS.def['prismas-cubos-3d'] = {
  tit: 'Prismas e blocos: volume, área total, diagonal e esfera',
  fontes: [
    'OpenStax, Contemporary Mathematics, 10.7 Volume and Surface Area — https://openstax.org/books/contemporary-mathematics/pages/10-7-volume-and-surface-area',
    'Wikipedia (en), Cuboid — https://en.wikipedia.org/wiki/Cuboid',
    'Wikipedia (en), Space diagonal — https://en.wikipedia.org/wiki/Space_diagonal'
  ],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Volume'], [3.2, '2. Área'], [6.4, '3. Diagonal'], [9.2, '4. Esfera']],
  cred: 'Animação feita para o app. Sólidos em projeção ortogonal, desenhados a partir das coordenadas (proporções reais): prisma hexagonal de lado 2 e altura 4; bloco 6 × 3 × 2.',
  nota: 'Prisma: V = área da base × altura (vale para base hexagonal, octogonal, em L...). Área total = soma de todas as faces. Diagonal do bloco a × b × c: D = √(a² + b² + c²); no cubo, diagonal da face a√2 e do cubo a√3. A esfera que passa pelos 8 vértices tem diâmetro D.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var TF = 12;
    svg.setAttribute('viewBox', '0 0 640 350');
    var C1 = 'color-mix(in srgb,var(--ad-c) 30%,var(--folha))', C2 = 'color-mix(in srgb,#c98a12 28%,var(--folha))', C3 = 'color-mix(in srgb,#8a5a9e 24%,var(--folha))', DIAG = '#c0392b';
    /* projecao ortogonal: giro th em torno do eixo vertical, camera inclinada al; V = {th, al, s, cx, cy, o:[x,y,z]} */
    function pr(p, V) {
      var x = p[0] - V.o[0], y = p[1] - V.o[1], z = p[2] - V.o[2], c = Math.cos(V.th), s = Math.sin(V.th);
      var X = x * c + z * s, Z = -x * s + z * c;
      return [V.cx + V.s * X, V.cy - V.s * (y * Math.cos(V.al) - Z * Math.sin(V.al)), Z * Math.cos(V.al) + y * Math.sin(V.al)];
    }
    function vis(n, V) { var Z = -n[0] * Math.sin(V.th) + n[2] * Math.cos(V.th); return n[1] * Math.sin(V.al) + Z * Math.cos(V.al) > 1e-6; }
    function pd(pts, V) { return pts.map(function (p, i) { var q = pr(p, V); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ') + ' Z'; }
    var faces = []; for (var i = 0; i < 10; i++) faces.push(el('path', { style: 'stroke:var(--tinta);stroke-width:1.6;stroke-linejoin:round' }));
    var tracos = []; for (i = 0; i < 18; i++) tracos.push(el('line', { style: 'stroke:var(--tinta);stroke-width:1.4;stroke-dasharray:5 4' }));
    var esf = el('g', {});
    var esfC = el('circle', { style: 'fill:color-mix(in srgb,var(--ad-c) 8%,transparent);stroke:var(--ad-c);stroke-width:2' }, esf);
    var esfE = el('ellipse', { style: 'fill:none;stroke:var(--ad-c);stroke-width:1.3;stroke-dasharray:4 4' }, esf);
    var dg1 = el('path', { style: 'fill:none;stroke:' + DIAG + ';stroke-width:2.6' }), dg2 = el('path', { style: 'fill:none;stroke:' + DIAG + ';stroke-width:3' });
    var tri = el('path', { style: 'fill:color-mix(in srgb,' + DIAG + ' 14%,transparent);stroke:none' });
    var ctro = el('circle', { r: 4, style: 'fill:var(--tinta)' });
    var labs = []; for (i = 0; i < 8; i++) labs.push(tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle'));
    /* caixa da conta */
    el('rect', { x: 404, y: 16, width: 226, height: 182, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var K = []; for (i = 0; i < 5; i++) K.push(tx(418, 44 + 30 * i, '', 'font-size:15px;fill:var(--tinta)'));
    var K5 = tx(418, 184, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Prisma: volume = área da base × altura', 'A base hexagonal se divide em 6 triângulos equiláteros: some as áreas.', 'Empilhe cópias da base até a altura h: V = (área da base) × h.', 'Numa caixa a × b × c a base é a × b: V = a × b × c (m · m · m = m³).'],
      ['2. Área total = soma das 6 faces', 'Abra a caixa 6 × 3 × 2: as faces vêm em 3 pares iguais.', '2 × (6 × 3) + 2 × (6 × 2) + 2 × (3 × 2) = 36 + 24 + 12 = 72.', 'Quem esquece de dobrar um par perde faces inteiras.'],
      ['3. Diagonal do bloco: Pitágoras duas vezes', 'No chão: d² = 6² + 3² = 45 (diagonal da face).', 'Subindo: D² = d² + 2² = 45 + 4 = 49, então D = 7.', 'Direto: D = √(a² + b² + c²). Cubo de aresta a: face a√2, cubo a√3.'],
      ['4. Bloco dentro da esfera: diâmetro = diagonal', 'A esfera que passa pelos 8 vértices tem o centro no centro do bloco.', 'A diagonal do bloco atravessa o centro de um vértice ao oposto:', 'diâmetro = D = 7 e raio = 3,5.']
    ];
    var KT = [
      ['base: 6 triângulos', 'lado 2: cada um √3', 'área da base = 6√3', 'altura h = 4', 'V = 6√3 × 4 = 24√3'],
      ['fundo, tampa: 6 × 3 = 18', 'frente, trás: 6 × 2 = 12', 'laterais: 3 × 2 = 6', 'soma: 18 + 12 + 6 = 36', 'total = 2 × 36 = 72'],
      ['arestas 6, 3 e 2', 'd² = 36 + 9 = 45', 'D² = 45 + 4 = 49', '', 'D = 7'],
      ['diagonal D = 7', 'passa pelo centro', 'diâmetro = 7', 'raio = 3,5', '8 vértices na esfera']
    ];
    function lab(i, p, V, s, dx, dy) { var q = pr(p, V); labs[i].setAttribute('x', (q[0] + (dx || 0)).toFixed(1)); labs[i].setAttribute('y', (q[1] + (dy || 0)).toFixed(1)); labs[i].textContent = s; }
    /* poliedro convexo: faces visiveis cheias, arestas escondidas tracejadas */
    function poli(F, V) {
      var nf = 0, nt = 0, vistas = {};
      F.forEach(function (f) { f.v = vis(f.n, V); });
      F.forEach(function (f) {
        if (!f.v) return;
        var e = faces[nf++]; e.setAttribute('d', pd(f.p, V)); e.style.fill = f.c; op(e, 1);
      });
      /* arestas escondidas: pertencem so a faces invisiveis */
      var A = {};
      F.forEach(function (f) { f.p.forEach(function (p, i) { var q = f.p[(i + 1) % f.p.length], k = [p.join(), q.join()].sort().join('|'); (A[k] = A[k] || { a: p, b: q, v: false }).v = A[k].v || f.v; }); });
      Object.keys(A).forEach(function (k) {
        if (A[k].v || nt >= tracos.length) return;
        var a = pr(A[k].a, V), b = pr(A[k].b, V), e = tracos[nt++];
        e.setAttribute('x1', a[0].toFixed(1)); e.setAttribute('y1', a[1].toFixed(1)); e.setAttribute('x2', b[0].toFixed(1)); e.setAttribute('y2', b[1].toFixed(1)); op(e, .55);
      });
      return [nf, nt];
    }
    function caixa(a, b, c) {
      var v = function (x, y, z) { return [x * a, y * c, z * b]; };
      return [
        { n: [0, -1, 0], c: C1, p: [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)] },
        { n: [0, 1, 0], c: C1, p: [v(0, 1, 0), v(1, 1, 0), v(1, 1, 1), v(0, 1, 1)] },
        { n: [0, 0, -1], c: C2, p: [v(0, 0, 0), v(1, 0, 0), v(1, 1, 0), v(0, 1, 0)] },
        { n: [0, 0, 1], c: C2, p: [v(0, 0, 1), v(1, 0, 1), v(1, 1, 1), v(0, 1, 1)] },
        { n: [-1, 0, 0], c: C3, p: [v(0, 0, 0), v(0, 0, 1), v(0, 1, 1), v(0, 1, 0)] },
        { n: [1, 0, 0], c: C3, p: [v(1, 0, 0), v(1, 0, 1), v(1, 1, 1), v(1, 1, 0)] }
      ];
    }
    function hexP(k, y) { var a = Math.PI / 3 * k; return [2 * Math.cos(a), y, 2 * Math.sin(a)]; }
    var _desenha = function (t) {
      var f = t < 3.2 ? 0 : t < 6.4 ? 1 : t < 9.2 ? 2 : 3, u, V, i, used = [0, 0];
      labs.forEach(function (l) { l.textContent = ''; });
      op(esf, 0); op(dg1, 0); op(dg2, 0); op(tri, 0); op(ctro, 0);
      if (f === 0) {
        V = { th: -0.35 + 0.05 * t, al: 0.5, s: 30, cx: 200, cy: 100, o: [0, 2, 0] };
        var hh = 4 * ease((t - 1.2) / 1.4);
        var F = [];
        for (i = 0; i < 6; i++) {
          var a0 = hexP(i, 0), a1 = hexP(i + 1, 0), b0 = hexP(i, hh), b1 = hexP(i + 1, hh), am = Math.PI / 3 * (i + .5);
          if (hh > .02) F.push({ n: [Math.cos(am), 0, Math.sin(am)], c: C2, p: [a0, a1, b1, b0] });
        }
        var base = [], topo = []; for (i = 0; i < 6; i++) { base.push(hexP(i, 0)); topo.push(hexP(i, hh)); }
        F.push({ n: [0, -1, 0], c: C1, p: base.slice().reverse() });
        if (hh > .02) F.push({ n: [0, 1, 0], c: C1, p: topo });
        else F[F.length - 1].n = [0, 1, 0];
        used = poli(F, V);
        /* triangulos da base (no topo, que e' copia da base) */
        var raios = ''; for (i = 0; i < 6; i++) { var q0 = pr([0, hh, 0], V), q1 = pr(hexP(i, hh), V); raios += 'M' + q0[0].toFixed(1) + ' ' + q0[1].toFixed(1) + ' L' + q1[0].toFixed(1) + ' ' + q1[1].toFixed(1) + ' '; }
        dg1.setAttribute('d', raios); dg1.style.stroke = 'var(--ad-c)'; dg1.style.strokeWidth = '1.6'; op(dg1, cl(t / .6));
        lab(0, [(hexP(1, 0)[0] + hexP(2, 0)[0]) / 2, 0, (hexP(1, 0)[2] + hexP(2, 0)[2]) / 2], V, 'lado 2', 0, 20);
        if (hh > 1) lab(1, hexP(3, hh / 2), V, hh > 3.95 ? 'h = 4' : 'h', -30, 4);
      } else if (f === 1) {
        u = ease((t - 3.8) / 1.8);
        var ph = Math.PI / 2 * u;
        V = { th: -0.32 + 0.08 * u, al: lerp(0.55, 0.98, u), s: lerp(33, 21, u), cx: 200, cy: lerp(120, 92, u), o: [3, lerp(1, 0, u), lerp(1.5, 0, u)] };
        var cs = Math.cos(ph), sn = Math.sin(ph), c2 = Math.cos(2 * ph), s2 = Math.sin(2 * ph);
        var Fn = [
          { c: C1, p: [[0, 0, 0], [6, 0, 0], [6, 0, 3], [0, 0, 3]] },
          { c: C2, p: [[0, 0, 3], [6, 0, 3], [6, 2 * cs, 3 + 2 * sn], [0, 2 * cs, 3 + 2 * sn]] },
          { c: C2, p: [[0, 0, 0], [6, 0, 0], [6, 2 * cs, -2 * sn], [0, 2 * cs, -2 * sn]] },
          { c: C1, p: [[0, 2 * cs, -2 * sn], [6, 2 * cs, -2 * sn], [6, 2 * cs + 3 * s2, -2 * sn + 3 * c2], [0, 2 * cs + 3 * s2, -2 * sn + 3 * c2]] },
          { c: C3, p: [[0, 0, 0], [0, 0, 3], [-2 * sn, 2 * cs, 3], [-2 * sn, 2 * cs, 0]] },
          { c: C3, p: [[6, 0, 0], [6, 0, 3], [6 + 2 * sn, 2 * cs, 3], [6 + 2 * sn, 2 * cs, 0]] }
        ];
        Fn.forEach(function (F1) { F1.z = F1.p.reduce(function (s, p) { return s + pr(p, V)[2]; }, 0) / 4; });
        Fn.sort(function (a, b) { return a.z - b.z; });
        Fn.forEach(function (F1, k) { faces[k].setAttribute('d', pd(F1.p, V)); faces[k].style.fill = F1.c; op(faces[k], 1); });
        used = [6, 0];
        if (u > .97) {
          lab(0, [3, 0, 1.5], V, '6 × 3', 0, 5); lab(1, [3, 0, -1], V, '6 × 2', 0, 5); lab(2, [3, 0, 4], V, '6 × 2', 0, 5);
          lab(3, [3, 0, -3.5], V, '6 × 3', 0, 5); lab(4, [-1, 0, 1.5], V, '3 × 2', 0, 5); lab(5, [7, 0, 1.5], V, '3 × 2', 0, 5);
        } else { lab(0, [3, 0, 3], V, '6', 0, 18); lab(1, [6, 0, 1.5], V, '3', 14, 10); lab(2, [6, 2 * cs, 3 + 2 * sn], V, '', 0, 0); }
      } else {
        V = { th: -0.42 + 0.03 * (t - 6.4), al: 0.5, s: f === 2 ? 34 : 26, cx: 200, cy: f === 2 ? 118 : 104, o: [3, 1, 1.5] };
        used = poli(caixa(6, 3, 2), V);
        lab(0, [3, 0, 3], V, '6', 0, 20); lab(1, [6, 0, 1.5], V, '3', 16, 12); lab(2, [6, 1, 3], V, '2', 14, 4);
        var A0 = pr([0, 0, 0], V), A1 = pr([6, 0, 3], V), A2 = pr([6, 2, 3], V);
        var u1 = ease((t - 6.7) / .9), u2 = ease((t - 7.8) / .9);
        if (f === 3) { u1 = 1; u2 = 1; }
        dg1.style.stroke = DIAG; dg1.style.strokeWidth = '2.6';
        dg1.setAttribute('d', 'M' + A0[0].toFixed(1) + ' ' + A0[1].toFixed(1) + ' L' + lerp(A0[0], A1[0], u1).toFixed(1) + ' ' + lerp(A0[1], A1[1], u1).toFixed(1)); op(dg1, f === 2 ? 1 : .5);
        dg2.setAttribute('d', 'M' + A0[0].toFixed(1) + ' ' + A0[1].toFixed(1) + ' L' + lerp(A0[0], A2[0], u2).toFixed(1) + ' ' + lerp(A0[1], A2[1], u2).toFixed(1)); op(dg2, u2 > 0 ? 1 : 0);
        tri.setAttribute('d', 'M' + A0[0].toFixed(1) + ' ' + A0[1].toFixed(1) + ' L' + A1[0].toFixed(1) + ' ' + A1[1].toFixed(1) + ' L' + A2[0].toFixed(1) + ' ' + A2[1].toFixed(1) + ' Z'); op(tri, f === 2 ? u2 : 0);
        if (f === 2) { if (u1 > .9) lab(3, [3, 0, 1.5], V, 'd = √45', 6, 20); if (u2 > .9) lab(4, [3, 1, 1.5], V, 'D = 7', -6, -14); }
        if (f === 3) {
          var w = ease((t - 9.4) / 1), Cc = pr([3, 1, 1.5], V);
          op(esf, w); esfC.setAttribute('cx', Cc[0].toFixed(1)); esfC.setAttribute('cy', Cc[1].toFixed(1)); esfC.setAttribute('r', (3.5 * V.s).toFixed(1));
          esfE.setAttribute('cx', Cc[0].toFixed(1)); esfE.setAttribute('cy', Cc[1].toFixed(1)); esfE.setAttribute('rx', (3.5 * V.s).toFixed(1)); esfE.setAttribute('ry', (3.5 * V.s * Math.sin(V.al)).toFixed(1));
          op(ctro, 1); ctro.setAttribute('cx', Cc[0].toFixed(1)); ctro.setAttribute('cy', Cc[1].toFixed(1));
          lab(4, [3, 1, 1.5], V, 'D = 7 = diâmetro', 0, -14);
        }
      }
      for (i = used[0]; i < faces.length; i++) op(faces[i], 0);
      for (i = used[1]; i < tracos.length; i++) op(tracos[i], 0);
      var L = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = L[j] || '';
      for (j = 0; j < 4; j++) K[j].textContent = KT[f][j];
      K5.textContent = KT[f][4];
      K[4].textContent = '';
    };
    var CG = { '226c7ad2': 6.2, '417841e0': 2.95, '74127ce2': 9.0, '7565e0e4': 2.95, 'E0110b96': 2.95, 'P67c88e6': 11.9, 'P76a859d': 2.95, 'W821d598': 2.95, 'bb65cd86': 2.95, 'c43d72fc': 7.7 };
    return fimResposta(VIS.def['prismas-cubos-3d'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('prismas-cubos-3d', ['226c7ad2', '417841e0', '74127ce2', '7565e0e4', 'E0110b96', 'P67c88e6', 'P76a859d', 'W821d598', 'bb65cd86', 'c43d72fc']);
