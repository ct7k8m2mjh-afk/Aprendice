/* Citoesqueleto: corte real de cilio (axonema 9+2), esquema do batimento por dineina, centriolo 9x3,
   os tres tipos de filamento e a ciclose (miosina andando sobre actina). */
function quebra(s, n) { var p = s.split(' '), L = [], a = ''; p.forEach(function (w) { if (a && (a + ' ' + w).length > n) { L.push(a); a = w; } else a = a ? a + ' ' + w : w; }); if (a) L.push(a); return L; }
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js): congela o quadro que decide a questao aberta.
   Aqui o cartao ocupa o lugar do painel de texto (opc.esconde) e o desenho fica visivel ao lado. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var L = []; r.slice(1).forEach(function (s) { L = L.concat(opc.quebra ? quebra(s, opc.quebra) : [s]); });
  var lh = 22, w = opc.w || 520, h = 78 + lh * (L.length - 1), x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 16, y: y + 31, style: 'font-size:17px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  L.forEach(function (s, i) { var t = el('text', { x: x + 16, y: y + 58 + lh * i, style: 'font-size:14.5px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde) opc.esconde.style.opacity = on ? 0 : 1;
  };
}
var RESP = {
  'W6218c9f': ['Por isso a resposta é E', 'No centro de cílios e flagelos fica o axonema: 9 pares de microtúbulos em volta de 2 centrais.', 'Actina e miosina não formam o eixo deles.'],
  'W47b84cb': ['Por isso a resposta é B', 'A ciclose é a corrente de citosol e organelas movida pela miosina andando sobre filamentos de actina, que são citoesqueleto.', 'A é discutível hoje (bactérias têm proteínas parecidas), mas B é certa sem dúvida.'],
  'W74366ed': ['Por isso a resposta é E', 'O centríolo é feito de 9 trincas de microtúbulos, e microtúbulo é citoesqueleto. Dizer que não tem é o erro.']
};
VIS.def['axonema-9-2-citoesqueleto'] = {
  tit: 'Microtúbulos, actina e o movimento dentro da célula',
  fontes: ['OpenStax, Biology 2e, 4.5 The Cytoskeleton — https://openstax.org/books/biology-2e/pages/4-5-the-cytoskeleton', 'Wikipedia (en), Axoneme — https://en.wikipedia.org/wiki/Axoneme', 'Wikipedia (en), Centriole — https://en.wikipedia.org/wiki/Centriole', 'Wikipedia (en), Cytoplasmic streaming — https://en.wikipedia.org/wiki/Cytoplasmic_streaming'],
  tipo: 'anim', dur: 18,
  marcas: [[0, 'Foto real'], [3.6, 'Axonema 9+2'], [7.2, 'Centríolo'], [10.8, 'Filamentos'], [14.4, 'Ciclose']],
  cred: 'Foto: micrografia eletrônica de transmissão de cílios cortados transversalmente, região bronquiolar de pulmão de mamífero, Louisa Howard e Michael Binder (Dartmouth Electron Microscope Facility), domínio público, Wikimedia Commons ("Bronchiolar area cilia cross-sections 2.jpg", recortada). Esquemas feitos para o app, fora de escala.',
  nota: 'Microtúbulos (tubulina) formam cílios, flagelos, centríolos e o fuso. Microfilamentos (actina), com a miosina, fazem contração, ciclose e movimento ameboide. Filamentos intermediários dão resistência.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    function vis(o, b) { o.style.display = b ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var MT = '#2f7a6a', ACT = '#c0392b', MIO = '#7b4fa8', INT = '#8a6d3b', DIN = '#d9822b';
    var B = 'font-size:13.5px;font-weight:700;', N = 'font-size:13px;';
    /* ===== 1 foto ===== */
    var g1 = el('g', {});
    var PX = 14, PY = 30, PW = 360, PH = 270, s = .5625;
    var cp = el('clipPath', { id: 'axo-clip' }, el('defs', {}, g1)); el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    el('image', { href: 'vis/axonema-9-2-citoesqueleto-1.webp', x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#axo-clip)' }, g1);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, g1);
    tx(PX, 20, 'Micrografia eletrônica real: cílio cortado ao meio', B + 'fill:var(--ad-t)', g1);
    tx(PX, PY + PH + 18, 'cílios do pulmão de mamífero', N + 'fill:var(--lapis)', g1);
    var MK = [];
    function marca(n, x, y, rot, w, esq) { var g = el('g', {}, g1); el('rect', { x: esq ? -w - 4 : 4, y: -11, width: w, height: 22, rx: 11, style: 'fill:rgba(255,255,255,.92)' }, g); tx(esq ? -w + 10 : 18, 5, rot, 'font-size:13px;font-weight:700;fill:#1b1b1b', g); el('circle', { r: 12, style: 'fill:#fff;stroke:' + MT + ';stroke-width:3' }, g); tx(0, 5, n, 'font-size:14px;font-weight:800;text-anchor:middle;fill:#1b1b1b', g); mv(g, x, y); MK.push(g); return g; }
    var anelF = el('circle', { cx: PX + 335 * s, cy: PY + 290 * s, r: 160 * s, style: 'fill:none;stroke:#3ec7a8;stroke-width:3;stroke-dasharray:7 5' }, g1);
    marca('1', PX + 350 * s, PY + 72 * s, '1 de 9 pares', 96, false);
    marca('2', PX + 330 * s, PY + 372 * s, 'par central', 88, true);
    /* ===== 2 esquema 9+2 + batimento ===== */
    var g2 = el('g', {});
    var AX = 128, AY = 172;
    function anel(pai, cx, cy, trinca) {
      el('circle', { cx: cx, cy: cy, r: 104, style: 'fill:color-mix(in srgb,#e9d8b8 26%,var(--folha));stroke:#c08a3e;stroke-width:3' }, pai);
      for (var i = 0; i < 9; i++) {
        var a = (-90 + 40 * i) * Math.PI / 180, R = 76, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
        var tg = [-Math.sin(a), Math.cos(a)], rd = [Math.cos(a), Math.sin(a)];
        var n = trinca ? 3 : 2;
        for (var k = 0; k < n; k++) {
          var off = (k - (n - 1) / 2) * 15, px = x + tg[0] * off + (trinca ? rd[0] * (k - 1) * 5 : 0), py = y + tg[1] * off + (trinca ? rd[1] * (k - 1) * 5 : 0);
          el('circle', { cx: px.toFixed(1), cy: py.toFixed(1), r: 8, style: 'fill:color-mix(in srgb,' + MT + ' 22%,var(--folha));stroke:' + MT + ';stroke-width:2.4' }, pai);
        }
        if (!trinca) {
          var hx = x - tg[0] * 14 - rd[0] * 2, hy = y - tg[1] * 14 - rd[1] * 2;
          el('path', { d: 'M' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ' l' + (-tg[0] * 12 + rd[0] * 4).toFixed(1) + ' ' + (-tg[1] * 12 + rd[1] * 4).toFixed(1) + ' M' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ' l' + (-tg[0] * 12 - rd[0] * 6).toFixed(1) + ' ' + (-tg[1] * 12 - rd[1] * 6).toFixed(1), style: 'stroke:' + DIN + ';stroke-width:2.4;stroke-linecap:round' }, pai);
          el('line', { x1: (x - rd[0] * 10).toFixed(1), y1: (y - rd[1] * 10).toFixed(1), x2: (cx + rd[0] * 32).toFixed(1), y2: (cy + rd[1] * 32).toFixed(1), style: 'stroke:var(--linha);stroke-width:1.5' }, pai);
        }
      }
      if (!trinca) { [-11, 11].forEach(function (dx) { el('circle', { cx: cx + dx, cy: cy, r: 8, style: 'fill:color-mix(in srgb,' + MT + ' 22%,var(--folha));stroke:' + MT + ';stroke-width:2.4' }, pai); }); }
    }
    anel(g2, AX, AY, false);
    tx(AX, 52, 'axonema: 9 pares + 2 centrais', B + 'text-anchor:middle;fill:' + MT, g2);
    var l2 = el('g', {}, g2);
    el('path', { d: 'M' + (AX + 66) + ' ' + (AY - 94) + ' L' + (AX + 56) + ' ' + (AY - 66), style: 'stroke:var(--lapis);stroke-width:1.2' }, l2);
    tx(AX + 40, AY - 98, 'dineína (gasta ATP)', B + 'fill:' + DIN, l2);
    tx(AX, AY + 132, 'cada círculo = 1 microtúbulo', N + 'text-anchor:middle;fill:var(--lapis)', l2);
    var cil = el('path', { style: 'fill:none;stroke:color-mix(in srgb,' + MT + ' 35%,var(--folha));stroke-width:16;stroke-linecap:round' }, g2);
    var cilI = el('path', { style: 'fill:none;stroke:' + MT + ';stroke-width:2' }, g2);
    el('rect', { x: 270, y: 300, width: 96, height: 16, rx: 3, style: 'fill:color-mix(in srgb,#e9d8b8 40%,var(--folha));stroke:#c08a3e;stroke-width:2' }, g2);
    tx(318, 336, 'batimento do cílio', N + 'font-weight:700;text-anchor:middle;fill:var(--tinta)', g2);
    /* ===== 3 centriolo ===== */
    var g3 = el('g', {});
    anel(g3, AX, AY, true);
    tx(AX, 52, 'centríolo: 9 trincas, sem par central', B + 'text-anchor:middle;fill:' + MT, g3);
    tx(AX, AY + 132, '27 microtúbulos = citoesqueleto', N + 'font-weight:700;text-anchor:middle;fill:var(--tinta)', g3);
    var par = el('g', {}, g3); mv(par, 316, 150);
    el('rect', { x: -38, y: -14, width: 56, height: 28, rx: 4, style: 'fill:color-mix(in srgb,' + MT + ' 18%,var(--folha));stroke:' + MT + ';stroke-width:2' }, par);
    el('rect', { x: 22, y: -44, width: 28, height: 56, rx: 4, style: 'fill:color-mix(in srgb,' + MT + ' 18%,var(--folha));stroke:' + MT + ';stroke-width:2' }, par);
    [-30, -20, -10, 0, 10].forEach(function (x) { el('line', { x1: x, x2: x, y1: -14, y2: 14, style: 'stroke:' + MT + ';stroke-width:1' }, par); });
    tx(316, 196, 'par de centríolos', N + 'font-weight:700;text-anchor:middle;fill:var(--tinta)', g3);
    tx(316, 214, '(perpendiculares)', N + 'text-anchor:middle;fill:var(--lapis)', g3);
    var fuso = el('g', {}, g3);
    tx(316, 262, 'organizam o fuso', B + 'text-anchor:middle;fill:' + MT, fuso); tx(316, 280, 'e formam a base', N + 'text-anchor:middle;fill:var(--tinta)', fuso); tx(316, 297, 'de cílios e flagelos', N + 'text-anchor:middle;fill:var(--tinta)', fuso);
    /* ===== 4 filamentos ===== */
    var g4 = el('g', {});
    function linha(y, nome, sub, cor, uso1, uso2) {
      var g = el('g', {}, g4);
      tx(14, y - 26, nome, 'font-size:15px;font-weight:700;fill:' + cor, g); tx(14, y - 8, sub, N + 'fill:var(--lapis)', g);
      tx(196, y - 26, uso1, N + 'fill:var(--tinta)', g); tx(196, y - 8, uso2, N + 'fill:var(--tinta)', g);
      return g;
    }
    var f1 = linha(66, 'microtúbulo', 'tubo oco de tubulina', MT, 'cílios, flagelos,', 'centríolos e fuso');
    for (var i = 0; i < 13; i++) { el('circle', { cx: 24 + i * 12, cy: 84, r: 5.5, style: 'fill:color-mix(in srgb,' + MT + ' ' + (i % 2 ? 30 : 60) + '%,var(--folha));stroke:' + MT + ';stroke-width:1' }, f1); el('circle', { cx: 30 + i * 12, cy: 94, r: 5.5, style: 'fill:color-mix(in srgb,' + MT + ' ' + (i % 2 ? 60 : 30) + '%,var(--folha));stroke:' + MT + ';stroke-width:1' }, f1); }
    var f2 = linha(160, 'microfilamento', 'actina (com miosina)', ACT, 'contração, ciclose,', 'movimento ameboide, forma');
    for (i = 0; i < 18; i++) el('circle', { cx: 22 + i * 9, cy: 172 + 4 * Math.sin(i * 1.2), r: 4.2, style: 'fill:color-mix(in srgb,' + ACT + ' ' + (i % 2 ? 25 : 55) + '%,var(--folha));stroke:' + ACT + ';stroke-width:1' }, f2);
    var f3 = linha(250, 'filamento intermediário', 'proteínas fibrosas em corda', INT, 'resistência a tração;', 'ex.: queratina');
    el('path', { d: 'M20 266 c20 -8 30 8 50 0 s30 8 50 0 s30 8 50 0', style: 'fill:none;stroke:' + INT + ';stroke-width:3' }, f3);
    el('path', { d: 'M20 272 c20 -8 30 8 50 0 s30 8 50 0 s30 8 50 0', style: 'fill:none;stroke:' + INT + ';stroke-width:3' }, f3);
    var fl = [f1, f2, f3];
    /* ===== 5 ciclose ===== */
    var g5 = el('g', {});
    el('rect', { x: 30, y: 50, width: 330, height: 250, rx: 14, style: 'fill:color-mix(in srgb,#7d8f3a 28%,var(--folha));stroke:#7d8f3a;stroke-width:2' }, g5);
    el('rect', { x: 40, y: 60, width: 310, height: 230, rx: 10, style: 'fill:color-mix(in srgb,#e9d8b8 30%,var(--folha));stroke:#c08a3e;stroke-width:2.5' }, g5);
    el('rect', { x: 84, y: 102, width: 222, height: 146, rx: 30, style: 'fill:color-mix(in srgb,#6fa8d6 28%,var(--folha));stroke:#6fa8d6;stroke-width:2' }, g5);
    tx(195, 180, 'vacúolo', N + 'font-weight:700;text-anchor:middle;fill:#2c6aa0', g5);
    var trilho = 'M62 82 H328 V268 H62 Z';
    el('path', { d: trilho, style: 'fill:none;stroke:' + ACT + ';stroke-width:2;stroke-dasharray:5 3' }, g5);
    var CLs = []; for (i = 0; i < 9; i++) { var c = el('g', {}, g5); el('ellipse', { rx: 11, ry: 6, style: 'fill:#3f8f3a;stroke:#24631f;stroke-width:1' }, c); el('circle', { cx: 0, cy: 8, r: 3.2, style: 'fill:' + MIO }, c); CLs.push(c); }
    tx(195, 44, 'célula vegetal vista de cima', N + 'font-weight:600;text-anchor:middle;fill:var(--lapis)', g5);
    tx(36, 322, 'trilho tracejado = actina;', B + 'fill:' + ACT, g5); tx(214, 322, 'ponto roxo = miosina', B + 'fill:' + MIO, g5);
    function perim(p) { p = ((p % 1) + 1) % 1; var L = [266, 186, 266, 186], tot = 904, d = p * tot; if (d < 266) return [62 + d, 82, 0]; d -= 266; if (d < 186) return [328, 82 + d, 90]; d -= 186; if (d < 266) return [328 - d, 268, 0]; d -= 266; return [62, 268 - d, 90]; }
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · O que há dentro do cílio', s: 'Foto real de um cílio cortado ao meio. Dentro dele há um anel de 9 pares (duplas) de microtúbulos (1) em volta de 2 microtúbulos centrais (2). Nada de actina ou miosina no eixo.' },
      { tit: '2 · Axonema 9 + 2', s: 'Esse eixo, igual em cílios e flagelos, é o axonema. Braços de dineína (laranja) gastam ATP e fazem um par deslizar sobre o vizinho; como os pares estão presos entre si, o deslizamento vira dobra: o cílio bate.' },
      { tit: '3 · Centríolo', s: 'O centríolo também é feito de microtúbulos: 9 trincas, sem par central. Ele organiza o fuso que move os cromossomos na divisão e, na base do cílio, vira o corpúsculo basal.' },
      { tit: '4 · Três tipos de filamento', s: 'O citoesqueleto tem três tipos de filamento. Microtúbulos: cílio, flagelo, centríolo, fuso. Microfilamentos de actina: com a miosina, contraem, movem organelas e formam pseudópodes. Intermediários: resistência.' },
      { tit: '5 · Ciclose', s: 'Na ciclose, o citosol e as organelas (aqui, cloroplastos) circulam sem parar dentro da célula. Quem move é a miosina, presa às organelas, andando sobre filamentos de actina: é citoesqueleto em ação.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : t < 12 ? 3 : 4;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      vis(g1, f === 0); vis(g2, f === 1); vis(g3, f === 2); vis(g4, f === 3); vis(g5, f === 4);
      var u = f === 0 ? cl(t / 3) : f === 1 ? cl((t - 3) / 3) : f === 2 ? cl((t - 6) / 3) : f === 3 ? cl((t - 9) / 3) : cl((t - 12) / 3);
      if (f === 0) { op(anelF, cl((u - .1) / .15)); op(MK[0], cl((u - .3) / .1)); op(MK[1], cl((u - .5) / .1)); }
      if (f === 1) {
        var b = 40 * Math.sin(t * 3.2), d = 'M318 300 C318 230 ' + (318 + b * .4).toFixed(1) + ' 170 ' + (318 + b).toFixed(1) + ' 112';
        cil.setAttribute('d', d); cilI.setAttribute('d', d);
        op(l2, cl((u - .2) / .15));
      }
      if (f === 2) op(fuso, cl((u - .4) / .15));
      if (f === 3) fl.forEach(function (g, i) { op(g, cl((u - i * .22) / .12)); });
      if (f === 4) CLs.forEach(function (c, i) { var p = perim(i / 9 + (t - 12) * .07); mv(c, p[0], p[1]); c.firstChild.setAttribute('transform', 'rotate(' + p[2] + ')'); });
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 3, 6, 9, 12, 15], _N = [0.0, 3.6, 7.2, 10.8, 14.4, 18.0];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['axonema-9-2-citoesqueleto'], svg, _desenha, 18, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'W6218c9f' ? 5.9 : q === 'W74366ed' ? 8.9 : 14.9; } }));
  }
};
VIS.liga('axonema-9-2-citoesqueleto', ['W6218c9f', 'W47b84cb', 'W74366ed']);
