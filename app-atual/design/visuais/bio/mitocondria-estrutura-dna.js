/* Mitocondria: foto real de microscopia eletronica (membrana externa lisa, membrana interna com cristas, matriz),
   esquema com DNA circular e ribossomos, origem por endossimbiose e bacterias endossimbiontes que fornecem ATP. */
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
  'Wdf3e5fc': ['Por isso a resposta é E', 'As dobras da membrana interna são as cristas mitocondriais.', 'Tilacoide e estroma são nomes do cloroplasto.'],
  'W0333981': ['Por isso a resposta é B', 'A mitocôndria tem DNA circular e ribossomos parecidos com os das bactérias: herança da bactéria englobada.'],
  'Wc91ff3e': ['Por isso a resposta é A', 'As bactérias internas são a principal fonte de ATP da ameba (mutualismo). Um antibiótico que entre as mata, e a ameba pode morrer: só a IV está certa.']
};
VIS.def['mitocondria-estrutura-dna'] = {
  tit: 'Mitocôndria: duas membranas, cristas e DNA de bactéria',
  fontes: ['OpenStax, Biology 2e, 4.3 Eukaryotic Cells (Mitochondria) — https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells', 'Wikipedia (en), Mitochondrion — https://en.wikipedia.org/wiki/Mitochondrion', 'Wikipedia (en), Symbiogenesis (endossimbiose) — https://en.wikipedia.org/wiki/Symbiogenesis'],
  tipo: 'anim', dur: 18,
  marcas: [[0, 'Foto real'], [3.6, 'Cristas'], [7.2, 'Matriz e DNA'], [10.8, 'Origem'], [14.4, 'Hoje']],
  cred: 'Foto: micrografia eletrônica de transmissão de mitocôndrias em pulmão de mamífero, Louisa Howard (Dartmouth Electron Microscope Facility), domínio público, Wikimedia Commons ("Mitochondria, mammalian lung - TEM.jpg", recortada). Esquemas feitos para o app, fora de escala.',
  nota: 'Evidências de que a mitocôndria veio de uma bactéria: duas membranas (a interna era a da bactéria), DNA próprio circular, ribossomos parecidos com os bacterianos e divisão independente, parecida com a das bactérias.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y, s) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' + (s !== undefined ? ' scale(' + s.toFixed(3) + ')' : '')); }
    function vis(o, b) { o.style.display = b ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var MIT = '#c9772f', EXT = '#8a5a2b', DNA = '#2f6db5', RIB = '#2c3e50', BAC = '#5a8f3c', HOS = '#c08a3e';
    var B = 'font-size:13.5px;font-weight:700;';
    /* ===== foto ===== */
    var gF = el('g', {});
    var PX = 14, PY = 30, PW = 360, PH = 270;
    var cp = el('clipPath', { id: 'mito-clip' }, el('defs', {}, gF)); el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    el('image', { href: 'vis/mitocondria-estrutura-dna-1.webp', x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#mito-clip)' }, gF);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, gF);
    tx(PX, 20, 'Micrografia eletrônica real: duas mitocôndrias', 'font-size:13.5px;font-weight:700;fill:var(--ad-t)', gF);
    tx(PX, PY + PH + 18, 'corte fino de pulmão de mamífero', 'font-size:13px;fill:var(--lapis)', gF);
    var MK = [];
    var legN = 0;
    function marca(n, x, y, cor, rot, w) { var g = el('g', {}, gF); if (rot) { var lg = el('g', {}, g), ly = PY + 196 + 26 * legN++; lg.setAttribute('transform', 'translate(' + (-x) + ' ' + (-y) + ')'); el('rect', { x: PX + 196, y: ly - 11, width: w + 30, height: 22, rx: 11, style: 'fill:rgba(255,255,255,.94)' }, lg); el('circle', { cx: PX + 207, cy: ly, r: 9, style: 'fill:#fff;stroke:' + cor + ';stroke-width:2.5' }, lg); tx(PX + 207, ly + 4.5, n, 'font-size:13px;font-weight:800;text-anchor:middle;fill:#1b1b1b', lg); tx(PX + 222, ly + 5, rot, 'font-size:13px;font-weight:700;fill:#1b1b1b', lg); } el('circle', { r: 12, style: 'fill:#fff;stroke:' + cor + ';stroke-width:3' }, g); tx(0, 5, n, 'font-size:14px;font-weight:800;text-anchor:middle;fill:#1b1b1b', g); mv(g, x, y); MK.push(g); return g; }
    /* fator foto: 640x480 -> 360x270 = 0.5625 */
    var s = .5625;
    marca('1', PX + 42 * s, PY + 213 * s, '#e0a050', 'externa', 74);
    marca('2', PX + 140 * s, PY + 275 * s, '#e0a050', 'interna: cristas', 116);
    marca('3', PX + 130 * s, PY + 360 * s, '#e0a050', 'matriz', 64);
    var anel = el('ellipse', { cx: PX + 143 * s, cy: PY + 300 * s, rx: 128 * s, ry: 128 * s, style: 'fill:none;stroke:#ffd27a;stroke-width:2.5;stroke-dasharray:6 4' }, gF); gF.insertBefore(anel, MK[0]);
    /* ===== esquema da mitocondria ===== */
    var gE = el('g', {});
    var CX = 195, CY = 175;
    el('ellipse', { cx: CX, cy: CY, rx: 170, ry: 92, style: 'fill:color-mix(in srgb,' + MIT + ' 12%,var(--folha));stroke:' + EXT + ';stroke-width:3' }, gE);
    var d = '', n = 9;
    for (var i = 0; i <= 360; i += 2) {
      var a = i * Math.PI / 180, rx = 156, ry = 79;
      var x = CX + rx * Math.cos(a), y = CY + ry * Math.sin(a);
      d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
    }
    el('path', { d: d + 'Z', style: 'fill:color-mix(in srgb,' + MIT + ' 26%,var(--folha));stroke:' + MIT + ';stroke-width:3' }, gE);
    var cris = '';
    for (i = 0; i < n; i++) {
      var cx = CX - 128 + i * 32, top = i % 2 === 0;
      var yb = top ? CY - 79 * Math.sqrt(1 - Math.pow((cx - CX) / 156, 2)) : CY + 79 * Math.sqrt(1 - Math.pow((cx - CX) / 156, 2));
      var len = 52 - Math.abs(cx - CX) / 6, dir = top ? 1 : -1;
      cris += 'M' + (cx - 5) + ' ' + yb.toFixed(1) + ' C' + (cx - 6) + ' ' + (yb + dir * len).toFixed(1) + ' ' + (cx + 6) + ' ' + (yb + dir * len).toFixed(1) + ' ' + (cx + 5) + ' ' + yb.toFixed(1) + ' ';
    }
    el('path', { d: cris, style: 'fill:color-mix(in srgb,' + MIT + ' 12%,var(--folha));stroke:' + MIT + ';stroke-width:3' }, gE);
    var dnaE = el('g', {}, gE);
    [[150, 190], [244, 158]].forEach(function (p) { el('path', { d: 'M' + p[0] + ' ' + p[1] + ' m-12 0 a12 9 0 1 0 24 0 a12 9 0 1 0 -24 0', style: 'fill:none;stroke:' + DNA + ';stroke-width:2.4' }, dnaE); });
    var ribE = el('g', {}, gE); [[120, 160], [178, 206], [210, 150], [266, 196], [140, 214], [296, 170], [96, 196], [230, 210]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 2.6, style: 'fill:' + RIB }, ribE); });
    var lE = el('g', {}, gE);
    function lid(x1, y1, x2, y2) { el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2, style: 'stroke:var(--lapis);stroke-width:1.2' }, lE); }
    lid(60, 76, 70, 112); tx(14, 70, 'membrana externa (lisa)', B + 'fill:' + EXT, lE);
    lid(250, 68, 236, 100); tx(214, 62, 'membrana interna', B + 'fill:' + MIT, lE);
    var lE2 = el('g', {}, gE);
    lid.call(null, 0, 0, 0, 0);
    el('path', { d: 'M150 290 L150 202', style: 'stroke:var(--lapis);stroke-width:1.2' }, lE2); tx(70, 306, 'DNA circular próprio', B + 'fill:' + DNA, lE2);
    el('path', { d: 'M300 290 L268 200', style: 'stroke:var(--lapis);stroke-width:1.2' }, lE2); tx(232, 306, 'ribossomos', B + 'fill:' + RIB, lE2);
    tx(195, 324, 'parecidos com os das bactérias', 'font-size:13px;font-weight:600;text-anchor:middle;fill:var(--lapis)', lE2);
    tx(196, 180, 'matriz', 'font-size:14px;font-weight:700;text-anchor:middle;fill:#7a4a1a', lE2);
    /* ===== endossimbiose ===== */
    var gS = el('g', {});
    el('circle', { cx: 150, cy: 190, r: 135, style: 'fill:color-mix(in srgb,#e9d8b8 30%,var(--folha));stroke:' + HOS + ';stroke-width:3' }, gS);
    el('circle', { cx: 92, cy: 196, r: 40, style: 'fill:color-mix(in srgb,#7d6aa8 14%,var(--folha));stroke:#7d6aa8;stroke-width:2' }, gS);
    tx(92, 201, 'núcleo', 'font-size:13px;font-weight:700;text-anchor:middle;fill:#5d4c88', gS);
    tx(20, 40, 'célula hospedeira (ancestral)', 'font-size:13.5px;font-weight:700;fill:' + HOS, gS);
    var bac = el('g', {}, gS);
    var bacC = el('rect', { x: -34, y: -17, width: 68, height: 34, rx: 17, style: 'fill:color-mix(in srgb,' + BAC + ' 22%,var(--folha));stroke:' + BAC + ';stroke-width:2.6' }, bac);
    el('path', { d: 'M-14 2 m-8 0 a8 6 0 1 0 16 0 a8 6 0 1 0 -16 0', style: 'fill:none;stroke:' + DNA + ';stroke-width:2' }, bac);
    [[10, -6], [18, 5], [4, 8], [-24, -6], [24, -4]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 2.2, style: 'fill:' + RIB }, bac); });
    var crB = el('path', { d: 'M-20 -14 v12 M-6 14 v-12 M8 -14 v12 M22 14 v-12', style: 'stroke:' + MIT + ';stroke-width:2.4' }, bac);
    var envo = el('rect', { x: -41, y: -24, width: 82, height: 48, rx: 24, pathLength: 100, style: 'fill:none;stroke:' + HOS + ';stroke-width:2.6' }, bac);
    var bL1 = tx(0, 0, '', B + 'fill:' + BAC, gS), bL2 = tx(0, 0, '', B + 'fill:' + HOS, gS), bL3 = tx(0, 0, '', B + 'fill:' + MIT, gS);
    /* ===== bacterias endossimbiontes hoje (ameba sem mitocondria) ===== */
    var gH = el('g', {});
    var ameba = el('path', { d: 'M70 190 C60 120 120 80 180 96 C230 70 320 100 318 160 C350 200 320 270 250 272 C200 300 120 290 96 250 C60 240 60 210 70 190 Z', style: 'stroke:' + HOS + ';stroke-width:3' }, gH);
    [[130, 150], [220, 140], [170, 230]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 15, style: 'fill:color-mix(in srgb,#7d6aa8 14%,var(--folha));stroke:#7d6aa8;stroke-width:2' }, gH); });
    tx(14, 40, 'a ameba da questão: sem mitocôndrias, com bactérias', 'font-size:13.5px;font-weight:700;fill:' + HOS, gH);
    var BH = [[110, 200], [160, 120], [260, 190], [210, 250], [280, 130], [130, 250]].map(function (p) {
      var g = el('g', {}, gH); mv(g, p[0], p[1]);
      el('rect', { x: -12, y: -6, width: 24, height: 12, rx: 6, style: 'fill:color-mix(in srgb,' + BAC + ' 30%,var(--folha));stroke:' + BAC + ';stroke-width:2' }, g);
      var at = tx(16, -6, 'ATP', 'font-size:13px;font-weight:800;fill:#9a7220', g); g._at = at; return g;
    });
    var abx = []; for (i = 0; i < 12; i++) abx.push(el('circle', { r: 3.2, style: 'fill:#b4442f' }, gH));
    var hL = tx(195, 318, '', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--tinta)', gH);
    var hL2 = tx(350, 300, '', 'font-size:13.5px;font-weight:700;text-anchor:end;fill:#b4442f', gH);
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · Duas membranas', s: 'Foto real ao microscópio eletrônico. A mitocôndria tem duas membranas: a externa (1) é lisa e contorna a organela; a interna (2) acompanha a externa por dentro e se dobra para o meio.' },
      { tit: '2 · Cristas', s: 'As dobras da membrana interna (2) são as cristas mitocondriais. Elas aumentam a área da membrana interna, onde ficam as proteínas da cadeia respiratória que produzem a maior parte do ATP. Por dentro fica a matriz (3).' },
      { tit: '3 · Matriz: DNA próprio', s: 'Na matriz há DNA próprio, circular como o das bactérias, e ribossomos parecidos com os bacterianos. Com eles a mitocôndria faz parte das próprias proteínas e se divide sozinha, por um processo parecido com o das bactérias.' },
      { tit: '4 · Endossimbiose', s: 'Hipótese aceita: uma célula ancestral englobou uma bactéria aeróbia, que passou a viver dentro dela. A membrana interna é a da bactéria; a externa veio da célula que a envolveu. A bactéria virou mitocôndria.' },
      { tit: '5 · Bactérias no lugar dela', s: 'Na ameba da questão (Pelomyxa), sem mitocôndrias, bactérias internas com metabolismo parecido com o da mitocôndria fornecem a maior parte do ATP; as duas se beneficiam (mutualismo). Um antibiótico que entre na ameba mata as bactérias, e sem ATP suficiente ela pode morrer.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : t < 12.5 ? 3 : 4;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      vis(gF, f <= 1); vis(gE, f === 2); vis(gS, f === 3); vis(gH, f === 4);
      var u = f === 0 ? cl(t / 3) : f === 1 ? cl((t - 3) / 3) : f === 2 ? cl((t - 6) / 3) : f === 3 ? cl((t - 9) / 3.5) : cl((t - 12.5) / 3);
      if (f <= 1) {
        op(MK[0], f === 0 ? cl((u - .15) / .1) : 1); op(MK[1], f === 0 ? cl((u - .4) / .1) : 1); op(MK[2], f === 1 ? cl((u - .5) / .1) : 0);
        op(anel, f === 0 ? cl((u - .1) / .15) * (u < .9 ? 1 : 1) : .0);
      }
      if (f === 2) { op(lE2, cl((u - .15) / .2)); }
      if (f === 3) {
        var a = ease(u / .45), x = lerp(340, 200, a), y = lerp(70, 166, a);
        mv(bac, x, y);
        envo.setAttribute('stroke-dasharray', (100 * ease((u - .3) / .25)).toFixed(1) + ' 100');
        op(crB, cl((u - .75) / .15));
        bacC.style.stroke = u > .75 ? MIT : BAC;
        bL1.textContent = u < .3 ? 'bactéria aeróbia' : u < .75 ? 'interna: da bactéria' : 'vira mitocôndria';
        bL1.setAttribute('x', 200); bL1.setAttribute('y', 212); bL1.style.fill = u < .75 ? BAC : MIT;
        bL1.style.textAnchor = 'middle';
        bL2.textContent = u > .55 ? 'externa: da célula' : ''; bL2.setAttribute('x', 200); bL2.setAttribute('y', 130); bL2.style.textAnchor = 'middle';
        bL3.textContent = u > .8 ? 'DNA circular e ribossomos de bactéria' : ''; bL3.setAttribute('x', 195); bL3.setAttribute('y', 344); bL3.style.textAnchor = 'middle';
        if (u < .3) { bL1.setAttribute('x', x); bL1.setAttribute('y', y - 26); }
      }
      if (f === 4) {
        var k = ease((u - .35) / .25), m = ease((u - .6) / .2), z = ease((u - .8) / .15);
        BH.forEach(function (g, i) { op(g, 1 - .85 * m); op(g._at, (1 - m) * (.5 + .5 * Math.sin(t * 5 + i))); });
        abx.forEach(function (c, i) { var ang = i * .52, r0 = 190, r1 = 30 + (i % 4) * 22; c.setAttribute('cx', (195 + lerp(r0, r1, k) * Math.cos(ang)).toFixed(1)); c.setAttribute('cy', (185 + lerp(r0, r1, k) * Math.sin(ang) * .6).toFixed(1)); op(c, u > .35 ? 1 : 0); });
        ameba.style.fill = 'color-mix(in srgb,' + (z > .5 ? '#9b9b9b' : '#e9d8b8') + ' 30%,var(--folha))';
        hL.textContent = u < .35 ? 'as bactérias fornecem ATP: mutualismo' : u < .8 ? 'antibiótico entra e mata as bactérias' : 'sem ATP suficiente: a ameba pode morrer';
        hL2.textContent = u > .35 ? 'antibiótico' : '';
      }
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 3, 6, 9, 12.5, 15.5], _N = [0.0, 3.6, 7.2, 10.8, 14.4, 18.0];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['mitocondria-estrutura-dna'], svg, _desenha, 18, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'Wdf3e5fc' ? 5.9 : q === 'W0333981' ? 12.4 : 15.4; } }));
  }
};
VIS.liga('mitocondria-estrutura-dna', ['Wdf3e5fc', 'W0333981', 'Wc91ff3e']);
