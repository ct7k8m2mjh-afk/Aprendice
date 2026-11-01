/* Cilindro e cone: a folha que enrola (largura = 2 pi r, curvatura calculada em 3D), o rolo que pinta 2 pi r x largura
   por volta, o cone que cabe 3 vezes no cilindro de mesma base e altura, e o efeito de dividir raio ou altura por 2. */
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
'3a7ec1ed': [
'Por isso a resposta é B',
'Lateral do cilindro (raio 2r): 2π · 2r · h = 72π → r · h = 18.',
'Cilindro = 6 cones: π(2r)²h = 6 · ⅓ · πr² · 18 → 4h = 36 → h = 9.',
'Então r = 18 ÷ 9 = 2 cm.'
],
'927c29a6': [
'Por isso a resposta é A',
'A volta do cilindro é o lado de 27 cm mais o vão da fita: 27 + 4 = 31 = 2πr.',
'r = 31 ÷ 6,2 = 5 cm, e a altura é 20: V = 3,1 · 5² · 20 = 1 550 cm³.'
],
'E082a568': [
'Por isso a resposta é B',
'Uma volta do rolo pinta 2π · 3 × 10 = 18,84 × 10 = 188,4 cm².',
'Faixa: 30 cm × 314 cm = 9 420 cm². Voltas: 9 420 ÷ 188,4 = 50.'
],
'P36962e9': [
'Por isso a resposta é B',
'h = V ÷ (πr²): quanto maior o raio, menor a altura. Use d = 8, r = 4.',
'h = 350 ÷ (3,14 · 16) = 350 ÷ 50,24 ≈ 6,96 ≈ 7 cm.'
],
'P9ebbb09': [
'Por isso a resposta é D',
'Metade da altura: V₁ = V ÷ 2. Metade do raio: V₂ = V ÷ 4. Logo V = V₁ + 2V₂.',
'Área lateral 2πrh: A₁ = A ÷ 2 e A₂ = A ÷ 2. Logo A = A₁ + A₂.'
],
'Pf440dfb': [
'Por isso a resposta é A',
'Mesma cilindrada e mesma altura: 3 · πR²h = 4 · πr²h → R² ÷ r² = 4 ÷ 3.',
'R ÷ r = √(4 ÷ 3) ≈ 1,155: o raio aumenta cerca de 15,5%.'
]
};
VIS.def['cilindro-cone-planificacao'] = {
  tit: 'Cilindro e cone: a volta 2πr, a área lateral e o volume',
  fontes: [
    'OpenStax, Contemporary Mathematics, 10.7 Volume and Surface Area — https://openstax.org/books/contemporary-mathematics/pages/10-7-volume-and-surface-area',
    'Wikipedia (en), Cylinder — https://en.wikipedia.org/wiki/Cylinder',
    'Wikipedia (en), Cone — https://en.wikipedia.org/wiki/Cone'
  ],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Folha'], [3, '2. Rolo'], [6, '3. Cone = ⅓'], [9, '4. Raio × h']],
  cred: 'Animação feita para o app. Folha enrolada calculada em 3D (projeção ortogonal) e sólidos em escala.',
  nota: 'Cilindro de raio r e altura h: área lateral 2πr · h (a folha aberta é um retângulo de largura 2πr) e volume πr²h. Cone de mesma base e altura: volume ⅓πr²h. O raio entra ao quadrado no volume: dividir r por 2 divide o volume por 4.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var TF = 12, AG = '#2b6cb0', TINTA = 'color-mix(in srgb,#c98a12 34%,var(--folha))';
    svg.setAttribute('viewBox', '0 0 640 350');
    var AL = 0.42, SA = Math.sin(AL), CA = Math.cos(AL);
    function pr(x, y, z, o) { return [o[0] + o[2] * x, o[1] - o[2] * (y * CA - z * SA)]; }   /* z positivo = para frente */
    var G = el('g', {});   /* desenho da etapa, refeito a cada quadro */
    function lim() { while (G.firstChild) G.removeChild(G.firstChild); }
    function pth(d, st) { return el('path', { d: d, style: st }, G); }
    function lb(x, y, s, st) { return tx(x, y, s, st || 'font-size:14px;font-weight:700;fill:var(--tinta)', G); }
    function elip(cx, cy, rx, ry, st) { return el('ellipse', { cx: cx.toFixed(1), cy: cy.toFixed(1), rx: rx.toFixed(1), ry: Math.max(.1, ry).toFixed(1), style: st }, G); }
    /* cilindro em pe, centro da base em (cx, cy), raio r e altura h em pixels */
    function cil(cx, cy, r, h, st, nivel) {
      var ry = r * SA, hh = h * CA;
      if (nivel !== undefined && nivel > 0) {
        var hn = hh * nivel;
        pth('M' + (cx - r) + ' ' + cy + ' V' + (cy - hn) + ' A' + r + ' ' + ry + ' 0 0 0 ' + (cx + r) + ' ' + (cy - hn) + ' V' + cy + ' A' + r + ' ' + ry + ' 0 0 1 ' + (cx - r) + ' ' + cy + ' Z', 'fill:color-mix(in srgb,' + AG + ' 30%,var(--folha));stroke:none');
        elip(cx, cy - hn, r, ry, 'fill:color-mix(in srgb,' + AG + ' 40%,var(--folha));stroke:' + AG + ';stroke-width:1.2');
      }
      pth('M' + (cx - r) + ' ' + cy + ' V' + (cy - hh) + ' M' + (cx + r) + ' ' + cy + ' V' + (cy - hh) + ' M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + ry + ' 0 0 0 ' + (cx + r) + ' ' + cy, 'fill:none;' + st);
      pth('M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + ry + ' 0 0 1 ' + (cx + r) + ' ' + cy, 'fill:none;' + st + ';stroke-dasharray:5 4;opacity:.6');
      elip(cx, cy - hh, r, ry, 'fill:none;' + st);
    }
    var LN = 'fill:none;stroke:var(--tinta);stroke-width:2';
    el('rect', { x: 404, y: 16, width: 226, height: 182, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var K = []; for (var i = 0; i < 4; i++) K.push(tx(418, 44 + 30 * i, '', 'font-size:15px;fill:var(--tinta)'));
    var K5 = tx(418, 184, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. A folha enrolada vira a lateral do cilindro', 'Uma folha de largura W e altura h é enrolada até as bordas se tocarem.', 'A largura dá exatamente uma volta na base: W = 2πr.', 'Área lateral = área da folha = 2πr · h. Volume = πr² · h.'],
      ['2. Rolo de pintura: cada volta pinta 2πr × largura', 'Rolo de raio 1 e largura 3: numa volta ele avança 2π · 1 ≈ 6,28.', 'E pinta um retângulo 6,28 × 3 ≈ 18,8: é a área lateral do rolo.', 'Número de voltas = área a pintar ÷ área de uma volta.'],
      ['3. Cone de mesma base e altura = ⅓ do cilindro', 'Encha o cone e despeje no cilindro: são 3 cones para enchê-lo.', 'Cilindro: V = πr²h. Cone: V = ⅓ · πr²h.', 'Para comparar, escreva os dois volumes e cancele π, r² ou h.'],
      ['4. Raio e altura não pesam igual', 'Altura pela metade: volume ÷ 2. Raio pela metade: volume ÷ 4 (r²).', 'Área lateral 2πrh: metade do r ou metade do h dão A ÷ 2.', 'Mesmo volume com outro raio: iguale πR²h = πr²h · k e cancele.']
    ];
    var KT = [
      ['raio r = 1,5', 'W = 2π · 1,5 = 3π', 'altura h = 4', 'lateral = 3π · 4', '= 12π ≈ 37,7'],
      ['raio 1, largura 3', 'avanço por volta: 2π', 'área por volta:', '2π · 1 · 3 = 6π', '≈ 18,8 por volta'],
      ['V cilindro = πr²h', 'V cone = ⅓πr²h', 'cilindro ÷ cone', '', '= 3'],
      ['C: r e h → V', 'C₁: r e h/2 → V/2', 'C₂: r/2 e h → V/4', 'lateral: A, A/2, A/2', 'V = V₁ + 2V₂']
    ];
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3, u, k, s, q;
      lim();
      if (f === 0) {
        var r = 1.5, H = 4, W = 2 * Math.PI * r, o = [190, 176, 24];
        u = ease((t - .7) / 1.8); var ka = u / r;
        function pt(sv, y) { var x = ka < 1e-5 ? sv : Math.sin(ka * sv) / ka, z = ka < 1e-5 ? 0 : -(1 - Math.cos(ka * sv)) / ka; return pr(x, y, z, o); }
        var top = '', bot = '', quads = '', xs = [];
        for (k = 0; k <= 72; k++) { s = -W / 2 + W * k / 72; var a = pt(s, H), b = pt(s, 0); xs.push([a, b]); top += (k ? 'L' : 'M') + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' '; bot += (k ? 'L' : 'M') + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + ' '; }
        for (k = 0; k < 72; k++) { var A1 = xs[k][0], A2 = xs[k + 1][0], B1 = xs[k][1], B2 = xs[k + 1][1]; quads += 'M' + A1[0].toFixed(1) + ' ' + A1[1].toFixed(1) + ' L' + A2[0].toFixed(1) + ' ' + A2[1].toFixed(1) + ' L' + B2[0].toFixed(1) + ' ' + B2[1].toFixed(1) + ' L' + B1[0].toFixed(1) + ' ' + B1[1].toFixed(1) + ' Z '; }
        pth(quads, 'fill:' + TINTA + ';fill-rule:nonzero;stroke:none;opacity:.8');
        pth(top, LN); pth(bot, LN);
        /* contorno lateral: os pontos mais a esquerda e mais a direita da curva */
        var mn = xs[0], mx = xs[0]; xs.forEach(function (p) { if (p[1][0] < mn[1][0]) mn = p; if (p[1][0] > mx[1][0]) mx = p; });
        pth('M' + mn[0].join(' ') + ' L' + mn[1].join(' ') + ' M' + mx[0].join(' ') + ' L' + mx[1].join(' '), LN);
        var e1 = pt(-W / 2, 0), e2 = pt(-W / 2, H), e3 = pt(W / 2, 0), e4 = pt(W / 2, H);
        pth('M' + e1.join(' ') + ' L' + e2.join(' ') + ' M' + e3.join(' ') + ' L' + e4.join(' '), 'fill:none;stroke:#c0392b;stroke-width:2.4');
        if (u < .05) { lb(o[0] - 34, o[1] + 22, 'W = 2πr'); lb(e3[0] + 8, (e3[1] + e4[1]) / 2, 'h'); }
        if (u > .97) {
          var cc = pr(0, H, -r, o), rr = pr(r, H, -r, o);
          pth('M' + cc.join(' ') + ' L' + rr.join(' '), 'fill:none;stroke:var(--ad-c);stroke-width:2.2');
          lb((cc[0] + rr[0]) / 2 - 4, cc[1] - 6, 'r');
          var pp = pr(r, H / 2, -r, o); lb(pp[0] + 8, pp[1], 'h');
          lb(o[0] - 60, o[1] + 22, 'contorno = W = 2πr');
        }
      } else if (f === 1) {
        var R = 24, Lg = 72, x0 = 34, yS = 120, per = 2 * Math.PI * R;
        u = ease((t - 3.3) / 2.4); var xc = x0 + R + u * 2 * per;
        pth('M' + x0 + ' ' + (yS - Lg / 2) + ' H' + (x0 + 2 * R + 2 * per) + ' V' + (yS + Lg / 2) + ' H' + x0 + ' Z', 'fill:none;stroke:var(--linha);stroke-width:1.5;stroke-dasharray:5 4');
        pth('M' + (x0 + R) + ' ' + (yS - Lg / 2) + ' H' + xc.toFixed(1) + ' V' + (yS + Lg / 2) + ' H' + (x0 + R) + ' Z', 'fill:' + TINTA + ';stroke:none');
        for (k = 0; k <= 2; k++) { var xv = x0 + R + k * per; pth('M' + xv.toFixed(1) + ' ' + (yS - Lg / 2 - 8) + ' V' + (yS + Lg / 2 + 8), 'fill:none;stroke:var(--tinta);stroke-width:1.4'); }
        lb(x0 + R + per / 2 - 34, yS + Lg / 2 + 24, '1.ª volta'); if (u > .5) lb(x0 + R + 1.5 * per - 34, yS + Lg / 2 + 24, '2.ª volta');
        lb(x0 + R + per / 2 - 18, yS - Lg / 2 - 14, '2πr');
        /* rolo visto de cima e, acima dele, de lado com um raio que gira */
        pth('M' + (xc - R).toFixed(1) + ' ' + (yS - Lg / 2) + ' h' + 2 * R + ' v' + Lg + ' h' + (-2 * R) + ' Z', 'fill:color-mix(in srgb,var(--ad-c) 28%,var(--folha));stroke:var(--tinta);stroke-width:2');
        lb(xc - 34, yS + Lg / 2 + 44, 'largura 3', 'font-size:14px;font-weight:700;fill:var(--lapis)');
        var cy = yS - Lg / 2 - 54, ang = u * 2 * 2 * Math.PI;
        el('circle', { cx: xc.toFixed(1), cy: cy, r: R, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2' }, G);
        pth('M' + xc.toFixed(1) + ' ' + cy + ' l' + (R * Math.sin(ang)).toFixed(1) + ' ' + (R * Math.cos(ang)).toFixed(1), 'fill:none;stroke:#c0392b;stroke-width:2.4');
        lb(xc - R - 46, cy + 5, 'r = 1', 'font-size:14px;font-weight:700;fill:var(--lapis)');
      } else if (f === 2) {
        var rp = 40, hp = 120;
        u = (t - 6.2) / 2.4;
        var frac = cl(u * 3 - Math.floor(u * 3)), cheios = u >= 1 ? 3 : Math.floor(cl(u) * 3);
        var nivel = (cheios + (u < 1 && u > 0 ? ease(cl((frac - .45) / .5)) : 0)) / 3;
        cil(270, 176, rp, hp, 'stroke:var(--tinta);stroke-width:2', Math.min(1, nivel));
        /* cone: mesma base e altura */
        var cx = 100, cy = 176, ry = rp * SA, hh = hp * CA, cheio = u >= 1 ? 0 : 1 - ease(cl((frac - .45) / .5));
        if (cheio > .02) pth('M' + (cx - rp) + ' ' + cy + ' L' + cx + ' ' + (cy - hh) + ' L' + (cx + rp) + ' ' + cy + ' A' + rp + ' ' + ry + ' 0 0 1 ' + (cx - rp) + ' ' + cy + ' Z', 'fill:color-mix(in srgb,' + AG + ' 30%,var(--folha));stroke:none;opacity:' + cheio.toFixed(2));
        pth('M' + (cx - rp) + ' ' + cy + ' L' + cx + ' ' + (cy - hh) + ' L' + (cx + rp) + ' ' + cy + ' A' + rp + ' ' + ry + ' 0 0 1 ' + (cx - rp) + ' ' + cy, LN);
        pth('M' + (cx - rp) + ' ' + cy + ' A' + rp + ' ' + ry + ' 0 0 0 ' + (cx + rp) + ' ' + cy, LN + ';stroke-dasharray:5 4;opacity:.6');
        lb(cx - 18, cy + 30, 'cone'); lb(250, cy + 30, 'cilindro');
        if (u > 0 && u < 1) { pth('M' + (cx + rp + 10) + ' ' + (cy - hh * .7) + ' Q 185 ' + (cy - hh - 30) + ' 248 ' + (cy - hh - 14) + ' m-9 -5 l9 5 l-8 6', 'fill:none;stroke:' + AG + ';stroke-width:2;opacity:' + (1 - cheio).toFixed(2)); }
        for (k = 1; k <= 3; k++) { var yk = 176 - hh * k / 3; pth('M' + (270 + rp + 4) + ' ' + yk.toFixed(1) + ' h10', 'fill:none;stroke:var(--tinta);stroke-width:1.4'); if (cheios >= k) lb(270 + rp + 18, yk + 5, k + (k > 1 ? ' cones' : ' cone')); }
      } else {
        var Rb = 30, Hb = 120;
        u = ease((t - 9.2) / 1.2);
        cil(90, 176, Rb, Hb, 'stroke:var(--tinta);stroke-width:2', 1);
        var n0 = G.childNodes.length;
        cil(200, 176, Rb, Hb / 2, 'stroke:var(--tinta);stroke-width:2', 1);
        cil(310, 176, Rb / 2, Hb, 'stroke:var(--tinta);stroke-width:2', 1);
        for (k = n0; k < G.childNodes.length; k++) { var nd = G.childNodes[k]; nd.style.opacity = ((/dasharray/.test(nd.getAttribute('style')) ? .6 : 1) * u).toFixed(2); }
        lb(78, 200, 'C: V');
        if (u > .9) { lb(176, 200, 'C₁: V/2'); lb(286, 200, 'C₂: V/4'); lb(152, 108, 'h/2', 'font-size:14px;font-weight:700;fill:var(--lapis)'); lb(290, 52, 'r/2', 'font-size:14px;font-weight:700;fill:var(--lapis)'); }
        lb(126, 120, 'h', 'font-size:14px;font-weight:700;fill:var(--lapis)'); lb(98, 52, 'r', 'font-size:14px;font-weight:700;fill:var(--lapis)');
        pth('M90 ' + (176 - Hb * CA) + ' h' + Rb, 'fill:none;stroke:var(--ad-c);stroke-width:2');
        if (u > .9) pth('M310 ' + (176 - Hb * CA) + ' h' + Rb / 2, 'fill:none;stroke:var(--ad-c);stroke-width:2');
      }
      for (j = 0; j < 4; j++) K[j].textContent = KT[f][j]; K5.textContent = KT[f][4];
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
    };
    var CG = { '3a7ec1ed': 8.95, '927c29a6': 2.95, 'E082a568': 5.95, 'P36962e9': 11.95, 'P9ebbb09': 11.95, 'Pf440dfb': 11.95 };
    return fimResposta(VIS.def['cilindro-cone-planificacao'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('cilindro-cone-planificacao', ['3a7ec1ed', '927c29a6', 'E082a568', 'P36962e9', 'P9ebbb09', 'Pf440dfb']);
