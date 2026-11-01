/* Esfera terrestre em projecao ortogonal: o paralelo na latitude phi tem raio R cos phi (corte pelo eixo em
   verdadeira grandeza), o arco sobre o paralelo e' a fracao delta-lambda/360 da volta 2 pi R cos phi (vista de cima),
   e a semiesfera: area curva 2 pi R2 e volume 2/3 pi R3. */
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
'34d15a77': [
'Por isso a resposta é B',
'Paralelo 60° N: r = 6 400 · cos 60° = 3 200 km; volta = 2 · 3 · 3 200 = 19 200 km.',
'De M a N são 15° + 15° = 30° de longitude: 30 ÷ 360 = 1/12 da volta.',
'Arco = 19 200 ÷ 12 = 1 600 km.'
],
'77b2e057': [
'Por isso a resposta é C',
'Paralelo 30° N: r = 6 300 · cos 30° = 3 150√3 km.',
'45° L e 15° O ficam em lados opostos de Greenwich: 45° + 15° = 60° = 1/6.',
'Arco = (1/6) · 2π · 3 150√3 = 1 050π√3 km.'
],
'49fc5bf1': [
'Por isso a resposta é A',
'Diâmetro 46 · 2,5 cm = 115 cm = 1,15 m → R = 0,575 m.',
'Cúpula = metade da superfície da esfera: 2πR² = 2 · 3 · 0,575² ≈ 1,98 m²,',
'entre 1,5 e 2,5 m².'
],
'Pf582060': [
'Por isso a resposta é D',
'Buracos: 1 + 2 + 3 + 4 + 5 + 6 = 21 semiesferas de raio 6 cm.',
'Cada uma: ⅔πr³ = ⅔ · 3 · 216 = 432 cm³. Total: 21 · 432 = 9 072 cm³.'
]
};
VIS.def['esfera-paralelos-latitude'] = {
  tit: 'Esfera: o paralelo encolhe com a latitude; a semiesfera é metade',
  fontes: [
    'Wikipedia (en), Circle of latitude — https://en.wikipedia.org/wiki/Circle_of_latitude',
    'Wikipedia (en), Sphere (área 4πr² e volume 4/3 πr³) — https://en.wikipedia.org/wiki/Sphere',
    'OpenStax, Contemporary Mathematics, 10.7 Volume and Surface Area — https://openstax.org/books/contemporary-mathematics/pages/10-7-volume-and-surface-area'
  ],
  tipo: 'anim', dur: 9.6,
  marcas: [[0, '1. r = R·cos φ'], [3.2, '2. Arco'], [6.4, '3. Semiesfera']],
  cred: 'Animação feita para o app. Globo em projeção ortogonal; o corte pelo eixo e a vista de cima do paralelo estão em verdadeira grandeza.',
  nota: 'Paralelo de latitude φ: raio r = R · cos φ. Arco entre duas longitudes sobre esse paralelo = (Δλ ÷ 360°) · 2πR · cos φ; longitudes de lados opostos de Greenwich (L e O) se somam. Esfera: área 4πR², volume ⁴⁄₃πR³; semiesfera: área curva 2πR², volume ⅔πR³.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    var TF = 9.6, D2R = Math.PI / 180, PAR = '#c0392b', ARC = '#c98a12';
    svg.setAttribute('viewBox', '0 0 640 350');
    var G = el('g', {});
    function lim() { while (G.firstChild) G.removeChild(G.firstChild); }
    function pth(d, st) { return el('path', { d: d, style: st }, G); }
    function lb(x, y, s, st) { return tx(x.toFixed(1), y.toFixed(1), s, st || 'font-size:14px;font-weight:700;fill:var(--tinta)', G); }
    /* globo: centro (CX, CY), raio RP px, camera elevada AL */
    var CX = 112, CY = 112, RP = 84, AL = 0.32, sA = Math.sin(AL), cA = Math.cos(AL);
    function gp(lat, lon) { var x = Math.cos(lat) * Math.sin(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(lon); return { x: CX + RP * x, y: CY - RP * (y * cA - z * sA), v: y * sA + z * cA >= 0 }; }
    function curva(fn, a0, a1, n, stV, stE) {   /* desenha a curva, cheia onde visivel e tracejada atras */
      var segV = '', segE = '', pv = null;
      for (var k = 0; k <= n; k++) { var p = fn(a0 + (a1 - a0) * k / n), s = p.x.toFixed(1) + ' ' + p.y.toFixed(1); if (pv) { if (p.v && pv.v) segV += 'M' + pv.s + ' L' + s + ' '; else segE += 'M' + pv.s + ' L' + s + ' '; } p.s = s; pv = p; }
      if (segE && stE) pth(segE, stE); if (segV) pth(segV, stV);
    }
    function globo() {
      el('circle', { cx: CX, cy: CY, r: RP, style: 'fill:color-mix(in srgb,var(--ad-c) 9%,var(--folha));stroke:var(--tinta);stroke-width:2' }, G);
      curva(function (a) { return gp(0, a); }, -Math.PI, Math.PI, 90, 'fill:none;stroke:var(--lapis);stroke-width:1.5', 'fill:none;stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4;opacity:.6');
      var n = gp(Math.PI / 2, 0), s = gp(-Math.PI / 2, 0);
      pth('M' + n.x + ' ' + (n.y - 12) + ' L' + s.x + ' ' + (s.y + 12), 'fill:none;stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:6 4');
      lb(n.x + 6, n.y - 4, 'N', 'font-size:14px;font-weight:700;fill:var(--lapis)');
      var e = gp(0, 0); lb(e.x - 64, e.y + 17, 'equador', 'font-size:14px;font-weight:600;fill:var(--lapis)');
    }
    el('rect', { x: 404, y: 16, width: 226, height: 182, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var K = []; for (var i = 0; i < 4; i++) K.push(tx(418, 44 + 30 * i, '', 'font-size:15px;fill:var(--tinta)'));
    var K5 = tx(418, 184, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. O raio do paralelo é R · cos φ', 'Corte a Terra pelo eixo: o ponto na latitude φ fica a R do centro.', 'A distância dele até o eixo é o cateto vizinho a φ: r = R · cos φ.', 'Equador: r = R. Quanto mais perto do polo, menor o paralelo.'],
      ['2. Arco no paralelo: fração da volta', 'Visto de cima, o paralelo é um círculo de raio r = R · cos φ.', 'De 20° O a 70° L são 20° + 70° = 90° de longitude: ¼ da volta.', 'Arco = (Δλ ÷ 360°) · 2πR · cos φ. Aqui: ¼ · 2πR · cos 45°.'],
      ['3. Semiesfera: metade da área e do volume', 'Esfera de raio R: área 4πR² e volume ⁴⁄₃πR³.', 'Cortada ao meio, a cúpula tem área curva 2πR² (sem o disco)', 'e a meia bola tem volume ⅔πR³.']
    ];
    var _desenha = function (t) {
      var f = t < 3.2 ? 0 : t < 6.4 ? 1 : 2, u, k, q, phi;
      lim();
      var KT;
      if (f < 2) {
        globo();
        phi = f === 0 ? 45 * ease((t - .4) / 1.6) * D2R : 45 * D2R;
        curva(function (a) { return gp(phi, a); }, -Math.PI, Math.PI, 90, 'fill:none;stroke:' + PAR + ';stroke-width:2.6', 'fill:none;stroke:' + PAR + ';stroke-width:1.6;stroke-dasharray:4 4;opacity:.7');
        var pl = gp(phi, Math.PI / 2); if (phi > 8 * D2R) lb(pl.x + 8, pl.y, 'φ = ' + Math.round(phi / D2R) + '°', 'font-size:14px;font-weight:700;fill:' + PAR);
        if (f === 0) {
          /* corte pelo eixo, em verdadeira grandeza */
          var ox = 300, oy = 168, R = 92, px = ox + R * Math.cos(phi), py = oy - R * Math.sin(phi);
          pth('M' + (ox - R) + ' ' + oy + ' A' + R + ' ' + R + ' 0 0 1 ' + (ox + R) + ' ' + oy, 'fill:color-mix(in srgb,var(--ad-c) 9%,var(--folha));stroke:var(--tinta);stroke-width:2');
          pth('M' + (ox - R - 6) + ' ' + oy + ' H' + (ox + R + 6) + ' M' + ox + ' ' + (oy + 4) + ' V' + (oy - R - 10), 'fill:none;stroke:var(--lapis);stroke-width:1.3;stroke-dasharray:5 4');
          pth('M' + ox + ' ' + oy + ' L' + px.toFixed(1) + ' ' + py.toFixed(1), 'fill:none;stroke:var(--tinta);stroke-width:2.2');
          pth('M' + ox + ' ' + py.toFixed(1) + ' L' + px.toFixed(1) + ' ' + py.toFixed(1), 'fill:none;stroke:' + PAR + ';stroke-width:3');
          pth('M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' L' + px.toFixed(1) + ' ' + oy, 'fill:none;stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:3 3');
          var ra = 26; pth('M' + (ox + ra) + ' ' + oy + ' A' + ra + ' ' + ra + ' 0 0 0 ' + (ox + ra * Math.cos(phi)).toFixed(1) + ' ' + (oy - ra * Math.sin(phi)).toFixed(1), 'fill:none;stroke:var(--ad-c);stroke-width:2');
          if (phi > 10 * D2R) lb(ox + 30, oy - 6, 'φ', 'font-size:15px;font-weight:700;fill:var(--ad-t)');
          lb(ox + R * .5 * Math.cos(phi) - 26, oy - R * .5 * Math.sin(phi) - 4, 'R');
          if (phi > 12 * D2R) lb((ox + px) / 2 - 10, py - 8, 'r', 'font-size:15px;font-weight:700;fill:' + PAR);
          lb(ox - 40, oy + 22, 'corte pelo eixo', 'font-size:14px;font-weight:600;fill:var(--lapis)');
          var cf = Math.cos(phi).toFixed(2).replace('.', ',');
          KT = ['latitude φ = ' + Math.round(phi / D2R) + '°', 'cos φ = ' + cf, 'r = R · cos φ', 'equador: φ = 0, r = R', 'r = ' + cf + ' · R'];
        } else {
          /* dois pontos: 20 O e 70 L; Greenwich no meridiano de frente */
          u = ease((t - 3.5) / 1.6);
          curva(function (a) { return gp(a, 0); }, -Math.PI / 2, Math.PI / 2, 40, 'fill:none;stroke:var(--lapis);stroke-width:1.3', null);
          var g0 = gp(-20 * D2R, 0); lb(g0.x + 5, g0.y + 4, 'Greenwich', 'font-size:14px;font-weight:600;fill:var(--lapis)');
          var l1 = -20 * D2R, l2 = l1 + 90 * D2R * u;
          curva(function (a) { return gp(phi, a); }, l1, l2, 40, 'fill:none;stroke:' + ARC + ';stroke-width:5', 'fill:none;stroke:' + ARC + ';stroke-width:3;stroke-dasharray:4 3');
          var A = gp(phi, -20 * D2R), B = gp(phi, 70 * D2R);
          el('circle', { cx: A.x, cy: A.y, r: 5, style: 'fill:var(--tinta)' }, G); lb(A.x - 46, A.y - 8, '20° O');
          if (u > .98) { el('circle', { cx: B.x, cy: B.y, r: 5, style: 'fill:var(--tinta)' }, G); lb(B.x - 18, B.y + 22, '70° L'); }
          /* vista de cima do paralelo, verdadeira grandeza */
          var ox = 300, oy = 112, r = 92 * Math.cos(phi), a0 = 90 + 20, a1 = a0 - 90 * u;   /* angulo SVG = 90 - longitude: leste para a direita, como no globo */
          el('circle', { cx: ox, cy: oy, r: r.toFixed(1), style: 'fill:none;stroke:' + PAR + ';stroke-width:2.2' }, G);
          var p0 = [ox + r * Math.cos(a0 * D2R), oy + r * Math.sin(a0 * D2R)], p1 = [ox + r * Math.cos(a1 * D2R), oy + r * Math.sin(a1 * D2R)];
          pth('M' + ox + ' ' + oy + ' L' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 0 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' Z', 'fill:color-mix(in srgb,' + ARC + ' 24%,transparent);stroke:none');
          pth('M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 0 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1), 'fill:none;stroke:' + ARC + ';stroke-width:5');
          pth('M' + ox + ' ' + oy + ' L' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' M' + ox + ' ' + oy + ' L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1), 'fill:none;stroke:var(--tinta);stroke-width:1.6');
          el('circle', { cx: ox, cy: oy, r: 3, style: 'fill:var(--tinta)' }, G);
          if (u > .9) lb(ox + .5 * r * Math.cos(65 * D2R) - 10, oy + .5 * r * Math.sin(65 * D2R) + 5, '90°', 'font-size:14px;font-weight:700;fill:#a06d0c');
          lb(ox - r * .55 - 18, oy + 22, 'r', 'font-size:15px;font-weight:700;fill:' + PAR);
          pth('M' + ox + ' ' + oy + ' L' + (ox - r) .toFixed(1) + ' ' + oy, 'fill:none;stroke:' + PAR + ';stroke-width:1.4;stroke-dasharray:3 3');
          lb(ox - 52, oy - r - 12, 'visto de cima', 'font-size:14px;font-weight:600;fill:var(--lapis)');
          KT = ['Δλ = 20° + 70° = 90°', '90° ÷ 360° = ¼', 'volta = 2πR · cos 45°', '', 'arco = ¼ · 2πR · cos 45°'];
        }
      } else {
        u = ease((t - 6.7) / 1.2);
        var lift = 34 * u, ry = RP * sA, cx = 200, cy = 128, Rr = RP;
        /* metade de baixo */
        pth('M' + (cx - Rr) + ' ' + cy + ' A' + Rr + ' ' + Rr + ' 0 0 0 ' + (cx + Rr) + ' ' + cy + ' A' + Rr + ' ' + ry.toFixed(1) + ' 0 0 0 ' + (cx - Rr) + ' ' + cy + ' Z', 'fill:color-mix(in srgb,var(--ad-c) 14%,var(--folha));stroke:var(--tinta);stroke-width:2');
        el('ellipse', { cx: cx, cy: cy, rx: Rr, ry: ry.toFixed(1), style: 'fill:color-mix(in srgb,var(--ad-c) 26%,var(--folha));stroke:var(--tinta);stroke-width:1.6' }, G);
        /* cupula levantada */
        var cy2 = cy - lift;
        pth('M' + (cx - Rr) + ' ' + cy2.toFixed(1) + ' A' + Rr + ' ' + Rr + ' 0 0 1 ' + (cx + Rr) + ' ' + cy2.toFixed(1) + ' A' + Rr + ' ' + ry.toFixed(1) + ' 0 0 1 ' + (cx - Rr) + ' ' + cy2.toFixed(1) + ' Z', 'fill:color-mix(in srgb,' + ARC + ' 26%,var(--folha));stroke:var(--tinta);stroke-width:2');
        pth('M' + (cx - Rr) + ' ' + cy2.toFixed(1) + ' A' + Rr + ' ' + ry.toFixed(1) + ' 0 0 0 ' + (cx + Rr) + ' ' + cy2.toFixed(1), 'fill:none;stroke:var(--tinta);stroke-width:1.2;stroke-dasharray:4 4;opacity:' + (.6 * u).toFixed(2));
        pth('M' + cx + ' ' + cy + ' L' + (cx + Rr) + ' ' + cy, 'fill:none;stroke:var(--ad-c);stroke-width:2.2'); lb(cx + Rr / 2 - 4, cy - 6, 'R', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
        if (u > .9) { lb(cx + Rr + 10, cy2 - 40, 'cúpula: 2πR²'); lb(cx + Rr + 10, cy + 40, 'meia bola: ⅔πR³'); }
        KT = ['esfera: área 4πR²', 'esfera: volume ⁴⁄₃πR³', 'cúpula: 4πR² ÷ 2', 'meia bola: ⁴⁄₃πR³ ÷ 2', '2πR² e ⅔πR³'];
      }
      for (j = 0; j < 4; j++) K[j].textContent = KT[j]; K5.textContent = KT[4];
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
    };
    var CG = { '34d15a77': 6.35, '77b2e057': 6.35, '49fc5bf1': 9.55, 'Pf582060': 9.55 };
    return fimResposta(VIS.def['esfera-paralelos-latitude'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('esfera-paralelos-latitude', ['34d15a77', '77b2e057', '49fc5bf1', 'Pf582060']);
