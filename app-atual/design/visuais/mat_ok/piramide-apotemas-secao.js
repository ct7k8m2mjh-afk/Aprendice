/* Piramide quadrangular regular (base 6, altura 4) em projecao ortogonal: o triangulo retangulo h, m, g (3-4-5),
   o volume 1/3 da base x altura (a piramide cabe 3 vezes no prisma), o corte paralelo a base (semelhanca:
   comprimentos x k, areas x k2, volumes x k3) e o solido de revolucao (triangulo girando em torno de um cateto). */
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
'ec975163': [
'Por isso a resposta é C',
'Sem folga na caixa: altura h = 80 e lado 40, então m = 20.',
'Apótema da pirâmide: g² = 80² + 20² = 6 800 → g = 20√17.',
'Área lateral = 4 faces · (40 · 20√17 ÷ 2) = 1 600√17 cm².'
],
'Pbb7757e': [
'Por isso a resposta é E',
'864 = ⅓ · a² · 18 → a² = 144, a = 12; do centro ao meio do lado, m = 6.',
'Rampa = apótema: g² = 18² + 6² = 360 → g ≈ 18,97 m.',
'Trilha no chão 12 + 12 + 12 + 6 = 42; total ≈ 42 + 18,97 ≈ 61 m.'
],
'P37188ab': [
'Por isso a resposta é B',
'Líquido em forma de pirâmide: V = ⅓ · 4² · 6 = 32 cm³.',
'No cubo ele ocupa ⅔: ⅔ · x³ = 32 → x³ = 48 = 8 · 6 → x = 2∛6 cm.'
],
'ab40744f': [
'Por isso a resposta é E',
'Triedro trirretângulo em D: VD é a altura e MED é retângulo em D.',
'DE² = 6² − 4² = 20 → DE = 2√5; área da base = 4 · 2√5 ÷ 2 = 4√5.',
'V = ⅓ · 4√5 · h = 6√5 → h = 18 ÷ 4 = 4,5.'
],
'5e043739': [
'Por isso a resposta é E',
'Cone: ⅓ · π(a/2)² · h = πa²h ÷ 12. Prisma: a² · H. Cone = prisma ÷ 6:',
'πa²h ÷ 12 = a²H ÷ 6 → πh = 2H → 3,1h = 2(h + 5,5) → h = 10.',
'Altura do prisma: H = 10 + 5,5 = 15,5 cm.'
],
'E4bb3dab': [
'Por isso a resposta é A',
'Prisma = BCDL: AB · BC · h = ⅓ · (AB · BC ÷ 2) · CL → CL = 6h e LG = 5h.',
'GJKL é cópia reduzida de BCDL na razão LG ÷ LC = 5/6.',
'Volume × (5/6)³: V(GJKL) = 125/216 do prisma.'
],
'P1635e2a': [
'Por isso a resposta é A',
'Corte pelo eixo: triângulo de base 8 e altura 10; a meia-largura cai de 4 a 0.',
'Na altura h sobra 4 · (10 − h) ÷ 10, que precisa ser ≥ 1 (o raio).',
'0,4 · (10 − h) ≥ 1 → h ≤ 7,5 m.'
],
'W3dcb36e': [
'Por isso a resposta é E',
'A sombrinha é o que um segmento inclinado, preso no topo do cabo,',
'desenha ao girar em torno dele: a superfície lateral de um cone.'
]
};
VIS.def['piramide-apotemas-secao'] = {
  tit: 'Pirâmide: altura e apótemas, volume ⅓, cortes e revolução',
  fontes: [
    'Wikipedia (en), Square pyramid — https://en.wikipedia.org/wiki/Square_pyramid',
    'OpenStax, Calculus Volume 1, 6.2 Determining Volumes by Slicing — https://openstax.org/books/calculus-volume-1/pages/6-2-determining-volumes-by-slicing',
    'Wikipedia (en), Cone (sólido de revolução) — https://en.wikipedia.org/wiki/Cone'
  ],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. h, m e g'], [3, '2. Volume ⅓'], [6, '3. Corte'], [9, '4. Revolução']],
  cred: 'Animação feita para o app. Pirâmide de base 6 × 6 e altura 4 em projeção ortogonal, desenhada a partir das coordenadas (proporções reais).',
  nota: 'Pirâmide regular: g² = h² + m² (h = altura, m = apótema da base, g = apótema da pirâmide, a altura de cada face). Volume = ⅓ · área da base · altura. Corte paralelo à base a uma fração k do vértice: comprimentos × k, áreas × k², volumes × k³.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    var TF = 12, AG = '#2b6cb0', VERM = '#c0392b';
    var CF = 'color-mix(in srgb,#c98a12 26%,var(--folha))', CB = 'color-mix(in srgb,var(--ad-c) 22%,var(--folha))';
    svg.setAttribute('viewBox', '0 0 640 350');
    function pr(p, V) {
      var x = p[0], y = p[1], z = p[2], c = Math.cos(V.th), s = Math.sin(V.th);
      var X = x * c + z * s, Z = -x * s + z * c;
      return [V.cx + V.s * X, V.cy - V.s * (y * Math.cos(V.al) - Z * Math.sin(V.al))];
    }
    function vis(n, V) { var Z = -n[0] * Math.sin(V.th) + n[2] * Math.cos(V.th); return n[1] * Math.sin(V.al) + Z * Math.cos(V.al) > 1e-6; }
    function d(pts, V, fecha) { return pts.map(function (p, i) { var q = pr(p, V); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ') + (fecha === false ? '' : ' Z'); }
    var G = el('g', {});
    function lim() { while (G.firstChild) G.removeChild(G.firstChild); }
    function pth(dd, st) { return el('path', { d: dd, style: st }, G); }
    function lb(x, y, s, st) { var e = tx(x.toFixed ? x.toFixed(1) : x, y.toFixed ? y.toFixed(1) : y, s, st || 'font-size:14px;font-weight:700;fill:var(--tinta)', G); e.style.paintOrder = 'stroke'; e.style.stroke = 'var(--folha)'; e.style.strokeWidth = '4px'; e.style.strokeLinejoin = 'round'; return e; }
    /* poliedro convexo: faces visiveis cheias; arestas so de faces escondidas, tracejadas */
    function poli(F, V, op) {
      op = op === undefined ? 1 : op;
      F.forEach(function (f) { f.v = vis(f.n, V); });
      F.forEach(function (f) { if (f.v) pth(d(f.p, V), 'fill:' + f.c + ';stroke:var(--tinta);stroke-width:1.7;stroke-linejoin:round;opacity:' + op); });
      var A = {};
      F.forEach(function (f) { f.p.forEach(function (p, i) { var q = f.p[(i + 1) % f.p.length], k = [p.join(), q.join()].sort().join('|'); (A[k] = A[k] || { a: p, b: q, v: false }).v = A[k].v || f.v; }); });
      Object.keys(A).forEach(function (k) { if (!A[k].v) pth(d([A[k].a, A[k].b], V, false), 'fill:none;stroke:var(--tinta);stroke-width:1.3;stroke-dasharray:5 4;opacity:' + (.55 * op)); });
    }
    function piramide(a, h, y0, c) {   /* base quadrada de lado a na altura y0, vertice em y0 + h */
      var b = a / 2, V0 = [0, y0 + h, 0], m = Math.hypot(b, h);
      var B = [[-b, y0, -b], [b, y0, -b], [b, y0, b], [-b, y0, b]];
      var F = [{ n: [0, -1, 0], c: CB, p: B.slice().reverse() }];
      [[0, 0, -1], [1, 0, 0], [0, 0, 1], [-1, 0, 0]].forEach(function (dd, i) { F.push({ n: [dd[0] * h / m, b / m, dd[2] * h / m], c: c || CF, p: [B[i], B[(i + 1) % 4], V0] }); });
      return F;
    }
    function caixa(a, h) {
      var b = a / 2, v = function (x, y, z) { return [x * b, y * h, z * b]; };
      return [
        { n: [0, -1, 0], p: [v(-1, 0, -1), v(1, 0, -1), v(1, 0, 1), v(-1, 0, 1)] }, { n: [0, 1, 0], p: [v(-1, 1, -1), v(1, 1, -1), v(1, 1, 1), v(-1, 1, 1)] },
        { n: [0, 0, -1], p: [v(-1, 0, -1), v(1, 0, -1), v(1, 1, -1), v(-1, 1, -1)] }, { n: [0, 0, 1], p: [v(-1, 0, 1), v(1, 0, 1), v(1, 1, 1), v(-1, 1, 1)] },
        { n: [-1, 0, 0], p: [v(-1, 0, -1), v(-1, 0, 1), v(-1, 1, 1), v(-1, 1, -1)] }, { n: [1, 0, 0], p: [v(1, 0, -1), v(1, 0, 1), v(1, 1, 1), v(1, 1, -1)] }
      ];
    }
    el('rect', { x: 404, y: 16, width: 226, height: 182, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var K = []; for (var i = 0; i < 4; i++) K.push(tx(418, 44 + 30 * i, '', 'font-size:15px;fill:var(--tinta)'));
    var K5 = tx(418, 184, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. O triângulo retângulo escondido na pirâmide', 'Altura h: do vértice ao centro da base. Apótema da base m: do centro ao meio', 'de um lado. Apótema da pirâmide g: altura de uma face. Os três formam', 'um triângulo retângulo: g² = h² + m². Aqui: 5² = 4² + 3².'],
      ['2. Volume = ⅓ · área da base · altura', 'Pirâmide e prisma com a mesma base e a mesma altura:', 'a pirâmide cheia, despejada 3 vezes, enche o prisma.', 'Prisma 6 · 6 · 4 = 144; pirâmide = 144 ÷ 3 = 48.'],
      ['3. Corte paralelo à base: uma cópia reduzida', 'O corte na metade da altura deixa em cima uma pirâmide semelhante, k = ½.', 'Lados × k = 3; área da seção × k² = 36 ÷ 4 = 9;', 'volume × k³ = 48 ÷ 8 = 6. Em corte vertical, a largura cai em linha reta.'],
      ['4. Girar uma figura em torno de um eixo', 'Um triângulo retângulo girando em torno de um cateto gera um cone:', 'a hipotenusa varre a superfície lateral e o outro cateto, o raio da base.', 'Retângulo em torno de um lado: cilindro. Semicírculo: esfera.']
    ];
    var KT = [
      ['base 6: m = 3', 'altura h = 4', 'g² = 4² + 3² = 25', 'face: 6 · 5 ÷ 2 = 15', 'g = 5'],
      ['prisma: 6 · 6 · 4 = 144', 'pirâmide:', '⅓ · 36 · 4', '', '= 48'],
      ['k = ½', 'lado 6 → 3', 'seção: 36 → 9 (k²)', 'volume: 48 → 6 (k³)', 'k, k², k³'],
      ['cateto no eixo: altura', 'outro cateto: raio', 'hipotenusa: geratriz', '', 'triângulo → cone']
    ];
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3, u, V, q, q2, q3, k;
      lim();
      if (f === 0) {
        V = { th: -0.5 + 0.06 * t, al: 0.42, s: 25, cx: 196, cy: 150 };
        poli(piramide(6, 4, 0), V);
        u = ease((t - .5) / 1.2);
        var O = [0, 0, 0], T = [0, 4, 0], M = [3, 0, 0];
        pth(d([O, T, M], V), 'fill:color-mix(in srgb,' + VERM + ' 18%,transparent);stroke:none;opacity:' + u);
        pth(d([O, T], V, false), 'fill:none;stroke:' + VERM + ';stroke-width:2.6;stroke-dasharray:6 3;opacity:' + u);
        pth(d([O, M], V, false), 'fill:none;stroke:var(--ad-c);stroke-width:2.6;opacity:' + u);
        pth(d([T, M], V, false), 'fill:none;stroke:#8a5a9e;stroke-width:3;opacity:' + u);
        q = pr(O, V); pth('M' + (q[0] - 4) + ' ' + (q[1] - 4) + ' h8 v8 h-8 Z', 'fill:var(--tinta);opacity:' + u);
        if (u > .9) {
          q = pr([0, 2, 0], V); lb(q[0] - 46, q[1], 'h = 4', 'font-size:14px;font-weight:700;fill:' + VERM);
          q = pr([1.5, 0, 0], V); lb(q[0] - 14, q[1] - 8, 'm = 3', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
          q = pr([1.5, 2, 0], V); lb(q[0] + 10, q[1] - 2, 'g = 5', 'font-size:14px;font-weight:700;fill:#8a5a9e');
          q = pr([0, 0, 3], V); lb(q[0] - 30, q[1] + 18, 'lado 6');
        }
      } else if (f === 1) {
        V = { th: -0.5, al: 0.42, s: 17, cx: 0, cy: 156 };
        u = (t - 3.3) / 2.4; var cheios = u >= 1 ? 3 : Math.floor(cl(u) * 3), fr = cl(u * 3 - Math.floor(u * 3)), ent = u > 0 && u < 1 ? ease(cl((fr - .45) / .5)) : 0;
        /* piramide cheia a esquerda */
        V.cx = 98; poli(piramide(6, 4, 0, u >= 1 ? CF : 'color-mix(in srgb,' + AG + ' ' + Math.round(34 * (1 - ent)) + '%,var(--folha))'), V);
        /* prisma a direita, com a agua subindo um terco por piramide */
        V.cx = 290; var lv = 4 * (cheios + ent) / 3;
        if (lv > .01) caixa(6, lv).forEach(function (F1) { if (vis(F1.n, V)) pth(d(F1.p, V), 'fill:color-mix(in srgb,' + AG + ' 30%,var(--folha));stroke:' + AG + ';stroke-width:1;opacity:.95'); });
        var CX = caixa(6, 4); CX.forEach(function (F1) { F1.c = 'none'; }); poli(CX, V);
        for (k = 1; k <= 3; k++) { q = pr([3, 4 * k / 3, -3], V); pth('M' + (q[0] + 4) + ' ' + q[1].toFixed(1) + ' h10', 'fill:none;stroke:var(--tinta);stroke-width:1.4'); if (cheios >= k) lb(q[0] + 18, q[1] + 5, String(k)); }
        lb(70, 204, 'pirâmide'); lb(266, 204, 'prisma');
        if (u > 0 && u < 1) pth('M150 ' + 96 + ' Q 196 50 236 76 m-9 -6 l9 6 l-9 5', 'fill:none;stroke:' + AG + ';stroke-width:2;opacity:' + ent.toFixed(2));
      } else if (f === 2) {
        V = { th: -0.5, al: 0.42, s: 25, cx: 196, cy: 152 };
        u = ease((t - 6.3) / 1.8); var yc = lerp(3.98, 2, u), kk = (4 - yc) / 4;
        poli(piramide(6, 4, 0), V, .45);
        poli(piramide(6 * kk, 4 - yc, yc, 'color-mix(in srgb,var(--ad-c) 30%,var(--folha))'), V);
        var b = 3 * kk; pth(d([[-b, yc, -b], [b, yc, -b], [b, yc, b], [-b, yc, b]], V), 'fill:color-mix(in srgb,var(--ad-c) 45%,var(--folha));stroke:var(--ad-c);stroke-width:2');
        if (u > .95) { q = pr([0, yc, b], V); lb(q[0] - 8, q[1] + 20, '3', 'font-size:14px;font-weight:700;fill:var(--ad-t)'); q = pr([0, 0, 3], V); lb(q[0] - 8, q[1] + 20, '6'); q = pr([-3, 2, 3], V); lb(q[0] - 70, q[1], 'meia altura', 'font-size:14px;font-weight:700;fill:var(--lapis)'); }
      } else {
        u = ease((t - 9.2) / 2.2); var ang = 2 * Math.PI * u, cx = 200, by = 176, Hh = 128, Rr = 80, ry = Rr * 0.3;
        pth('M' + cx + ' ' + (by - Hh - 18) + ' V' + (by + 18), 'fill:none;stroke:var(--tinta);stroke-width:1.6;stroke-dasharray:7 4');
        lb(cx + 8, by - Hh - 6, 'eixo');
        /* rastro: o cone ja varrido */
        if (u > .02) {
          var pts = []; for (k = 0; k <= 48; k++) { var a = ang * k / 48; pts.push((cx + Rr * Math.cos(a)).toFixed(1) + ' ' + (by + ry * Math.sin(a)).toFixed(1)); }
          var cone = 'M' + cx + ' ' + (by - Hh) + ' L' + pts.join(' L') + ' Z';
          pth(cone, 'fill:color-mix(in srgb,#c98a12 24%,var(--folha));stroke:none;opacity:.9');
          pth('M' + pts.join(' L'), 'fill:none;stroke:var(--tinta);stroke-width:1.6');
          if (u > .98) pth('M' + (cx - Rr) + ' ' + by + ' L' + cx + ' ' + (by - Hh) + ' L' + (cx + Rr) + ' ' + by, 'fill:none;stroke:var(--tinta);stroke-width:2');
        }
        /* o triangulo girando: largura aparente r cos(ang) */
        var xr = cx + Rr * Math.cos(ang), yr = by + ry * Math.sin(ang);
        pth('M' + cx + ' ' + by + ' L' + cx + ' ' + (by - Hh) + ' L' + xr.toFixed(1) + ' ' + yr.toFixed(1) + ' Z', 'fill:color-mix(in srgb,' + VERM + ' 22%,transparent);stroke:' + VERM + ';stroke-width:2.4');
        lb(cx - 16, by - Hh / 2, 'h', 'font-size:14px;font-weight:700;fill:var(--lapis)');
        if (u < .05) { lb(cx + Rr / 2 - 4, by + 18, 'r'); lb(cx + Rr / 2 + 8, by - Hh / 2, 'g'); }
      }
      for (j = 0; j < 4; j++) K[j].textContent = KT[f][j]; K5.textContent = KT[f][4];
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
    };
    var CG = { 'ec975163': 2.95, 'Pbb7757e': 2.95, 'P37188ab': 5.95, 'ab40744f': 5.95, '5e043739': 5.95, 'E4bb3dab': 8.95, 'P1635e2a': 8.95, 'W3dcb36e': 11.95 };
    return fimResposta(VIS.def['piramide-apotemas-secao'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('piramide-apotemas-secao', ['ec975163', 'Pbb7757e', 'P37188ab', 'ab40744f', '5e043739', 'E4bb3dab', 'P1635e2a', 'W3dcb36e']);
