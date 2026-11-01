/* Volume de liquido se conserva: caixa que tomba (nivel recalculado a cada angulo para manter a area da secao),
   cubo afundado (nivel resolvido exatamente), vazao em litros virando queda de nivel e copo inclinado a 45 graus
   (altura media das geratrizes). Tudo em escala, a partir das contas. */
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
'24bd7ff0': [
'Por isso a resposta é A',
'Em pé: 6 × 6 × 10 = 360 cm³ de água. Esse volume não muda ao tombar.',
'Deitado na face 15 × 6, a base nova tem 90 cm²: h = 360 ÷ 90 = 4 cm.'
],
'P7b015a0': [
'Por isso a resposta é B',
'O cubo R (2³ = 8 cm³) empurra 8 cm³ de água para fora de P.',
'Ela cai na moldura entre P e Q, de área 5² − 3² = 16 cm².',
'h = volume ÷ área livre = 8 ÷ 16 = 0,5 cm.'
],
'P2b0c877': [
'Por isso a resposta é B',
'A pedra afundada ocupa o lugar de uma camada de água: o nível sobe 3,5 cm.',
'Volume da pedra = camada cilíndrica = π · 8² · 3,5 = 224π cm³.'
],
'9ae98125': [
'Por isso a resposta é A',
'100 L/min × 150 min = 15 000 L = 15 m³ retirados.',
'Base 4 m × 3 m = 12 m²: o nível desce 15 ÷ 12 = 1,25 m,',
'e a escala, que conta a partir do topo, marca 1,25 m.'
],
'ccb2d05f': [
'Por isso a resposta é C',
'1 mm de chuva sobre 1 m² = 1 L. Laje 8 × 10 = 80 m² com 10 mm: 800 L.',
'Tanque 2 × 2 × 1 = 4 m³ = 4 000 L: 800 ÷ 4 000 = 0,2 = 20%.'
],
'Pd37f2ee': [
'Por isso a resposta é C',
'Copo r = 3, altura 12, eixo a 45°: um lado molha 12; o oposto, 12 − 2 · 3 = 6.',
'Altura média (12 + 6) ÷ 2 = 9: V = π · 3² · 9 = 81π cm³ = 81π mL.'
]
};
VIS.def['volume-liquido-recipiente'] = {
  tit: 'O volume do líquido se conserva: muda a base, muda a altura',
  fontes: [
    'OpenStax, Contemporary Mathematics, 10.7 Volume and Surface Area — https://openstax.org/books/contemporary-mathematics/pages/10-7-volume-and-surface-area',
    'Wikipedia (en), Displacement (fluid) — https://en.wikipedia.org/wiki/Displacement_(fluid)',
    'Wikipedia (en), Precipitation (medida: 1 mm = 1 L/m²) — https://en.wikipedia.org/wiki/Precipitation',
    'Wikipedia (en), Cylinder (volume do cilindro truncado por um plano) — https://en.wikipedia.org/wiki/Cylinder'
  ],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Tombar'], [3, '2. Afundar'], [6, '3. Vazão'], [9, '4. Copo a 45°']],
  cred: 'Animação feita para o app. Vistas de frente em escala; o nível da água é calculado a cada quadro para manter o volume.',
  nota: 'Volume de água = área da base × altura. Se a base muda (tombar), a altura muda e o volume fica. Objeto submerso: o nível sobe (volume do objeto) ÷ (área livre). 1 m³ = 1 000 L e 1 dm³ = 1 L; 1 mm de chuva em 1 m² = 1 L.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function br(v, d) { return v.toFixed(d).replace('.', ','); }
    var TF = 12, AG = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 350');
    /* geometria 2D (y para cima) */
    function area(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; }
    function corta(P, L) {   /* parte do poligono com y <= L */
      var R = [];
      for (var i = 0; i < P.length; i++) {
        var a = P[i], b = P[(i + 1) % P.length], ia = a[1] <= L, ib = b[1] <= L;
        if (ia) R.push(a);
        if (ia !== ib) { var u = (L - a[1]) / (b[1] - a[1]); R.push([a[0] + u * (b[0] - a[0]), L]); }
      }
      return R;
    }
    function nivel(P, A) { var lo = Math.min.apply(null, P.map(function (p) { return p[1]; })), hi = Math.max.apply(null, P.map(function (p) { return p[1]; })); for (var k = 0; k < 50; k++) { var m = (lo + hi) / 2; if (area(corta(P, m)) < A) lo = m; else hi = m; } return (lo + hi) / 2; }
    var OX = 0, OY = 0, S = 1;
    function sp(p) { return [OX + S * p[0], OY - S * p[1]]; }
    function dP(P) { return P.length ? P.map(function (p, i) { var q = sp(p); return (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ') + ' Z' : ''; }
    /* elementos */
    var chao = el('line', { x1: 24, x2: 392, y1: 196, y2: 196, style: 'stroke:var(--lapis);stroke-width:2' });
    var parede = el('line', { y1: 40, y2: 196, style: 'stroke:var(--lapis);stroke-width:2' });
    var agua = el('path', { style: 'fill:color-mix(in srgb,' + AG + ' 30%,var(--folha));stroke:' + AG + ';stroke-width:1.4' });
    var cubo = el('path', { style: 'fill:color-mix(in srgb,#8a5a9e 40%,var(--folha));stroke:#8a5a9e;stroke-width:1.8' });
    var caixa = el('path', { style: 'fill:none;stroke:var(--tinta);stroke-width:2.4;stroke-linejoin:round' });
    var g1 = el('path', { style: 'fill:none;stroke:#c0392b;stroke-width:4' }), g2 = el('path', { style: 'fill:none;stroke:#c98a12;stroke-width:4' }), eixo = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-width:2;stroke-dasharray:6 4' });
    var marcas = el('g', {});
    var labs = []; for (var i = 0; i < 6; i++) labs.push(tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--tinta)'));
    function lab(i, x, y, s, st) { labs[i].setAttribute('x', x.toFixed(1)); labs[i].setAttribute('y', y.toFixed(1)); labs[i].textContent = s; if (st) labs[i].setAttribute('style', st); }
    el('rect', { x: 404, y: 16, width: 226, height: 182, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var K = []; for (i = 0; i < 4; i++) K.push(tx(418, 44 + 30 * i, '', 'font-size:15px;fill:var(--tinta)'));
    var K5 = tx(418, 184, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Tombar: o volume de líquido não muda', 'Caixa fechada 4 × 4 × 10 com água até 6: V = 4 × 4 × 6 = 96.', 'Deitada sobre a face 10 × 4, a base nova tem área 40.', 'Nova altura = volume ÷ nova base = 96 ÷ 40 = 2,4.'],
      ['2. Objeto afundado: o nível sobe V ÷ área livre', 'Tanque de base 8 × 8 = 64 com água até 5. Afunda um cubo de aresta 4.', 'O cubo ocupa 4³ = 64 do espaço: a água sobe 64 ÷ 64 = 1.', 'Se a água transborda para outro espaço, sobe V ÷ (área livre dele).'],
      ['3. Litros viram altura: 1 m³ = 1 000 L', 'Tanque de base 2 m × 2 m perde 50 L/min por 40 min: 2 000 L = 2 m³.', 'Queda do nível = volume ÷ base = 2 m³ ÷ 4 m² = 0,5 m.', 'Chuva: 1 mm sobre 1 m² é 1 m² × 0,001 m = 0,001 m³ = 1 L.'],
      ['4. Copo inclinado a 45°: use a altura média', 'Copo de raio 2 e altura 10; a água vai até a borda mais baixa da boca.', 'Um lado molha 10; o oposto, 10 − 2r · tg 45° = 10 − 4 = 6.', 'V = π r² × (10 + 6) ÷ 2 = π · 4 · 8 = 32π.']
    ];
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3, u, k, W, L, q;
      labs.forEach(function (l) { l.textContent = ''; });
      op(cubo, 0); op(g1, 0); op(g2, 0); op(eixo, 0); op(parede, 0);
      while (marcas.firstChild) marcas.removeChild(marcas.firstChild);
      var KT;
      if (f === 0) {
        S = 15; OX = 214; OY = 196;
        var ph = Math.PI / 2 * ease((t - .6) / 1.6), c = Math.cos(ph), s = Math.sin(ph);
        var R = [[0, 0], [4, 0], [4, 10], [0, 10]].map(function (p) { return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; });
        L = nivel(R, 24); W = corta(R, L);
        caixa.setAttribute('d', dP(R)); agua.setAttribute('d', dP(W));
        if (ph < .01) { q = sp([4, 6]); lab(0, q[0] + 8, q[1] + 5, 'água até 6'); q = sp([2, 0]); lab(1, q[0] - 4, q[1] + 18, '4'); q = sp([0, 5]); lab(2, q[0] - 26, q[1], '10'); }
        if (ph > 1.56) { q = sp([-5, 0]); lab(1, q[0] - 6, q[1] + 18, '10'); q = sp([0, 2.4]); lab(0, q[0] + 8, q[1] + 10, 'h = 2,4'); q = sp([0, 4]); lab(2, q[0] + 8, q[1] - 4, '4'); }
        KT = ['antes: 4 × 4 × 6 = 96', 'depois: (10 × 4) × h', '40 · h = 96', '', ph > 1.56 ? 'h = 2,4' : 'volume = 96'];
      } else if (f === 1) {
        S = 18; OX = 70; OY = 196;
        var b = lerp(6.2, 0, ease((t - 3.4) / 1.8));
        L = (320 - 16 * b) / 48; if (L - b < 0) L = 5; if (L - b > 4) L = 6;
        caixa.setAttribute('d', 'M' + sp([0, 8.6])[0] + ' ' + sp([0, 8.6])[1] + ' L' + sp([0, 0])[0] + ' ' + sp([0, 0])[1] + ' L' + sp([8, 0])[0] + ' ' + sp([8, 0])[1] + ' L' + sp([8, 8.6])[0] + ' ' + sp([8, 8.6])[1]);
        agua.setAttribute('d', dP([[0, 0], [8, 0], [8, L], [0, L]]));
        cubo.setAttribute('d', dP([[2, b], [6, b], [6, b + 4], [2, b + 4]])); op(cubo, 1);
        [5, 6].forEach(function (y) { var a = sp([8, y]); el('line', { x1: a[0] + 4, x2: a[0] + 16, y1: a[1], y2: a[1], style: 'stroke:var(--tinta);stroke-width:1.6' }, marcas); });
        q = sp([8, 5]); lab(0, q[0] + 20, q[1] + 10, '5'); q = sp([8, 6]); lab(1, q[0] + 20, q[1] - 2, b < .05 ? '6' : '');
        q = sp([4, b + 4]); lab(2, q[0] - 22, q[1] - 6, 'cubo 4');
        q = sp([4, 0]); lab(3, q[0] - 30, q[1] + 18, 'base 8 × 8');
        KT = ['cubo: 4³ = 64', 'base livre: 8 × 8 = 64', 'nível: ' + br(L, 2), '', b < .05 ? 'sobe 64 ÷ 64 = 1' : 'nível sobe...'];
      } else if (f === 2) {
        S = 44; OX = 120; OY = 196;
        u = ease((t - 6.3) / 2.2); L = 3 - 0.5 * u;
        caixa.setAttribute('d', dP([[0, 0], [2, 0], [2, 3.6], [0, 3.6]]));
        agua.setAttribute('d', dP([[0, 0], [2, 0], [2, L], [0, L]]));
        for (k = 0; k <= 3; k += .5) { var a = sp([2, k]); el('line', { x1: a[0], x2: a[0] + (k % 1 ? 7 : 12), y1: a[1], y2: a[1], style: 'stroke:var(--tinta);stroke-width:1.4' }, marcas); }
        q = sp([2, 3]); lab(0, q[0] + 16, q[1] + 5, '3 m'); q = sp([2, 2.5]); lab(1, q[0] + 16, q[1] + 5, '2,5 m');
        q = sp([1, 0]); lab(2, q[0] - 26, q[1] + 18, '2 m');
        var tm = Math.round(40 * u); q = sp([2, 1.4]); lab(3, q[0] + 60, q[1], tm + ' min');
        lab(4, q[0] + 60, q[1] + 22, String(50 * tm).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' L saíram');
        KT = ['50 × 40 = 2 000 L', '= 2 m³', 'base: 2 × 2 = 4 m²', '2 ÷ 4 = 0,5', 'nível cai 0,5 m'];
      } else {
        S = 16; OX = 120; OY = 196;
        var a45 = Math.PI / 4 * ease((t - 9.1) / 1), cu = Math.cos(a45), su = Math.sin(a45), uu = [su, cu], nn = [-cu, su];
        /* copo: comeca em pe (eixo vertical) e deita ate 45 graus, apoiado no canto A */
        var A0 = [0, 0], H = 10, r2 = 4;
        function pt(g, d) { return [A0[0] + g * uu[0] + d * nn[0], A0[1] + g * uu[1] + d * nn[1]]; }
        var Rc = [pt(0, 0), pt(H, 0), pt(H, r2), pt(0, r2)];
        var Lb = Rc[1][1];   /* nivel: borda mais baixa da boca */
        caixa.setAttribute('d', dP(Rc)); agua.setAttribute('d', dP(corta(Rc, Lb + 1e-9)));
        var wx = sp(Rc[1])[0]; op(parede, a45 > .78 ? 1 : 0); parede.setAttribute('x1', wx); parede.setAttribute('x2', wx);
        var gmin = H - r2 * (su / cu);   /* comprimento molhado do lado oposto */
        if (a45 > .78) {
          g1.setAttribute('d', 'M' + sp(pt(0, 0)).join(' ') + ' L' + sp(pt(H, 0)).join(' ')); op(g1, 1);
          g2.setAttribute('d', 'M' + sp(pt(0, r2)).join(' ') + ' L' + sp(pt(gmin, r2)).join(' ')); op(g2, 1);
          eixo.setAttribute('d', 'M' + sp(pt(0, r2 / 2)).join(' ') + ' L' + sp(pt((H + gmin) / 2, r2 / 2)).join(' ')); op(eixo, 1);
          q = sp(pt(H / 2, 0)); lab(0, q[0] + 10, q[1] + 14, '10', 'font-size:14px;font-weight:700;fill:#c0392b');
          q = sp(pt(gmin / 2, r2)); lab(1, q[0] - 26, q[1] - 4, '6', 'font-size:14px;font-weight:700;fill:#a06d0c');
          q = sp(pt(H, r2 / 2)); lab(2, wx + 8, q[1] + 30, 'eixo: média 8', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
          q = sp(A0); lab(3, q[0] + 22, q[1] - 6, '45°');
          lab(4, wx + 8, 186, 'parede');
        }
        KT = ['lado maior: 10', 'lado menor: 10 − 4 = 6', 'média: (10 + 6) ÷ 2 = 8', 'V = π · 2² · 8', a45 > .78 ? 'V = 32π' : ''];
      }
      if (f !== 3) labs.forEach(function (l) { l.setAttribute('style', 'font-size:14px;font-weight:700;fill:var(--tinta)'); });
      for (j = 0; j < 4; j++) K[j].textContent = KT[j]; K5.textContent = KT[4];
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
    };
    var CG = { '24bd7ff0': 2.95, 'P7b015a0': 5.95, 'P2b0c877': 5.95, '9ae98125': 8.95, 'ccb2d05f': 8.95, 'Pd37f2ee': 11.95 };
    return fimResposta(VIS.def['volume-liquido-recipiente'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('volume-liquido-recipiente', ['24bd7ff0', 'P7b015a0', 'P2b0c877', '9ae98125', 'ccb2d05f', 'Pd37f2ee']);
