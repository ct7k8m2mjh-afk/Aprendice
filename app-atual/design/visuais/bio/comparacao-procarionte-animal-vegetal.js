/* Celula procarionte x animal x vegetal: o que cada uma tem, o que e comum as tres e de que substancia
   e feita cada estrutura da celula vegetal (parede = glicidio, membrana = lipidio, vacuolo = agua, nucleo = acido nucleico). */
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
  'P01b637e': ['Por isso a resposta é A', 'I parede = glicídio (celulose); II membrana = lipídio; III vacúolo = água; IV núcleo = ácido nucleico.'],
  'P1d4683f': ['Por isso a resposta é D', 'A bactéria não tem núcleo nem organelas com membrana, mas toda célula tem ribossomos e fabrica as próprias enzimas.'],
  'P417a109': ['Por isso a resposta é D', 'Animal e protozoário não têm parede; vírus nem é célula. A parede da planta é de celulose, um carboidrato: não é o alvo lipídico do antibiótico.'],
  'Wa200844': ['Por isso a resposta é E', 'A célula de planta com flores tem mitocôndrias, ribossomos, Golgi e plastos, mas não tem centríolos.'],
  'W9694e52': ['Por isso a resposta é E', 'DNA e os três RNAs (m, t, r) existem em procariontes e eucariontes e fazem a síntese de proteínas nos ribossomos.'],
  'Wef82444': ['Por isso a resposta é E', 'A bactéria tem membrana, ribossomos, parede e DNA. Falta a carioteca: o DNA fica solto no nucleoide.']
};
VIS.def['comparacao-procarionte-animal-vegetal'] = {
  tit: 'Procarionte, célula animal e célula vegetal',
  fontes: ['OpenStax, Biology 2e, 4.2 Prokaryotic Cells — https://openstax.org/books/biology-2e/pages/4-2-prokaryotic-cells', 'OpenStax, Biology 2e, 4.3 Eukaryotic Cells — https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells', 'Wikipedia (en), Centriole (ausente em plantas com flores) — https://en.wikipedia.org/wiki/Centriole'],
  tipo: 'anim', dur: 18,
  marcas: [[0, 'Procarionte'], [3.6, 'Animal'], [7.2, 'Vegetal'], [10.8, 'Em comum'], [14.4, 'Química']],
  cred: 'Animação feita para o app (esquemas fora de escala: a bactéria é, na verdade, muito menor que as outras duas).',
  nota: 'Toda célula tem membrana plasmática, citoplasma, ribossomos, DNA, RNA e enzimas. Só a eucarionte tem carioteca e organelas com membrana; parede existe em bactéria (peptidoglicano), fungo (quitina), alga e planta (celulose), e nunca em célula animal.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vis(o, b) { o.style.display = b ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var CIT = 'color-mix(in srgb,#e9d8b8 30%,var(--folha))', MEM = '#c08a3e', PAR = '#7d8f3a', DNA = '#2f6db5', NUC = '#7d6aa8', MIT = '#c9772f', RIB = '#2c3e50', CLO = '#3f8f3a', LIS = '#b4442f', RE = '#4f7cb0', GOL = '#8a6bb5', VAC = '#6fa8d6';
    var B = 'font-size:13.5px;font-weight:700;', N = 'font-size:13px;';
    function rib(pai, pts) { pts.forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 2.2, style: 'fill:' + RIB }, pai); }); }
    function mito(pai, x, y, r) { var g = el('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + (r || 0) + ')' }, pai); el('ellipse', { rx: 20, ry: 10, style: 'fill:color-mix(in srgb,' + MIT + ' 22%,var(--folha));stroke:' + MIT + ';stroke-width:1.8' }, g); el('path', { d: 'M-13 0 l3.2 -5 l3.2 10 l3.2 -10 l3.2 10 l3.2 -10 l3.2 10 l3.2 -5', style: 'fill:none;stroke:' + MIT + ';stroke-width:1.1' }, g); return g; }
    function lider(pai, x1, y1, x2, y2) { el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2, style: 'stroke:var(--lapis);stroke-width:1.2' }, pai); }
    var titC = tx(10, 24, '', 'font-size:15px;font-weight:700;fill:var(--ad-t)');
    /* ===== procarionte ===== */
    var gP = el('g', {});
    el('rect', { x: 64, y: 118, width: 262, height: 134, rx: 67, style: 'fill:color-mix(in srgb,' + PAR + ' 26%,var(--folha));stroke:' + PAR + ';stroke-width:2' }, gP);
    el('rect', { x: 74, y: 128, width: 242, height: 114, rx: 57, style: 'fill:' + CIT + ';stroke:' + MEM + ';stroke-width:3' }, gP);
    el('path', { d: 'M326 185 c12 -14 22 14 34 0 s22 14 30 0', style: 'fill:none;stroke:#6b6b6b;stroke-width:2.2' }, gP);
    var dnaP = el('path', { d: 'M160 170 C150 150 200 145 210 165 C222 188 180 200 172 186 C164 172 238 160 236 190 C234 214 176 212 166 200 C154 186 170 176 160 170 Z', style: 'fill:none;stroke:' + DNA + ';stroke-width:2.6' }, gP);
    el('circle', { cx: 270, cy: 200, r: 9, style: 'fill:none;stroke:' + DNA + ';stroke-width:2' }, gP);
    var ribP = el('g', {}, gP); rib(ribP, [[105, 175], [115, 200], [125, 160], [130, 215], [250, 150], [262, 168], [285, 172], [248, 225], [292, 214], [110, 222], [140, 140], [228, 140]]);
    var lP = el('g', {});
    lider(lP, 92, 100, 110, 122); tx(30, 96, 'parede (peptidoglicano)', B + 'fill:' + PAR, lP);
    lider(lP, 262, 100, 262, 146); tx(232, 96, 'ribossomos (70S)', B + 'fill:' + RIB, lP);
    lider(lP, 84, 268, 100, 238); tx(14, 284, 'membrana plasmática', B + 'fill:' + MEM, lP);
    lider(lP, 210, 270, 200, 206); tx(170, 286, 'nucleoide: DNA solto,', B + 'fill:' + DNA, lP); tx(170, 302, 'sem carioteca', B + 'fill:' + DNA, lP);
    lider(lP, 300, 218, 280, 206); tx(304, 232, 'plasmídeo', N + 'font-weight:600;fill:' + DNA, lP);
    tx(195, 334, 'sem organelas com membrana', 'font-size:13.5px;font-weight:600;text-anchor:middle;fill:var(--lapis)', lP);
    /* ===== animal ===== */
    var gA = el('g', {});
    el('path', { d: 'M70 180 C66 118 140 86 210 92 C290 98 330 140 326 190 C322 250 262 286 190 282 C116 278 74 240 70 180 Z', style: 'fill:' + CIT + ';stroke:' + MEM + ';stroke-width:3' }, gA);
    el('circle', { cx: 140, cy: 186, r: 40, style: 'fill:color-mix(in srgb,' + NUC + ' 14%,var(--folha));stroke:' + NUC + ';stroke-width:3' }, gA);
    el('circle', { cx: 148, cy: 192, r: 12, style: 'fill:color-mix(in srgb,' + NUC + ' 55%,var(--folha))' }, gA);
    [52, 62].forEach(function (r) { var d = ''; for (var a = -60; a <= 40; a += 5) { var q = a * Math.PI / 180; d += (d ? 'L' : 'M') + (140 + r * Math.cos(q)).toFixed(1) + ' ' + (186 + r * Math.sin(q)).toFixed(1) + ' '; } el('path', { d: d, style: 'fill:none;stroke:' + RE + ';stroke-width:5;stroke-linecap:round;opacity:.6' }, gA); });
    [0, 1, 2].forEach(function (i) { el('path', { d: 'M' + (232 + i * 2) + ' ' + (150 - i * 9) + ' Q252 ' + (160 - i * 9) + ' ' + (272 - i * 2) + ' ' + (150 - i * 9), style: 'fill:none;stroke:' + GOL + ';stroke-width:4.5;stroke-linecap:round' }, gA); });
    mito(gA, 262, 236, -15); mito(gA, 150, 254, 10);
    el('circle', { cx: 296, cy: 190, r: 11, style: 'fill:color-mix(in srgb,' + LIS + ' 18%,var(--folha));stroke:' + LIS + ';stroke-width:2' }, gA);
    var gCe = el('g', { transform: 'translate(222 196)' }, gA);
    el('rect', { x: -10, y: -4, width: 20, height: 8, rx: 2, style: 'fill:#d8d2c4;stroke:#6b6b6b;stroke-width:1.3' }, gCe); el('rect', { x: 12, y: -10, width: 8, height: 20, rx: 2, style: 'fill:#d8d2c4;stroke:#6b6b6b;stroke-width:1.3' }, gCe);
    rib(gA, [[200, 120], [210, 132], [190, 140], [300, 160], [290, 228], [222, 262], [100, 140], [96, 230]]);
    var lA = el('g', {});
    lider(lA, 130, 90, 136, 148); tx(60, 84, 'núcleo com carioteca', B + 'fill:' + NUC, lA);
    lider(lA, 258, 96, 252, 136); tx(232, 84, 'complexo golgiense', B + 'fill:' + GOL, lA);
    lider(lA, 330, 196, 308, 192); tx(334, 200, 'lisossomo', N + 'font-weight:700;fill:' + LIS, lA);
    lider(lA, 232, 304, 226, 206); tx(196, 318, 'centríolos', B + 'fill:#5a5a5a', lA);
    lider(lA, 290, 276, 270, 244); tx(270, 292, 'mitocôndria', B + 'fill:' + MIT, lA);
    lider(lA, 76, 278, 84, 236); tx(18, 296, 'só membrana:', B + 'fill:' + MEM, lA); tx(18, 312, 'sem parede', B + 'fill:' + MEM, lA);
    /* ===== vegetal ===== */
    var gV = el('g', {});
    el('rect', { x: 62, y: 84, width: 266, height: 204, rx: 10, style: 'fill:color-mix(in srgb,' + PAR + ' 30%,var(--folha));stroke:' + PAR + ';stroke-width:2' }, gV);
    el('rect', { x: 73, y: 95, width: 244, height: 182, rx: 6, style: 'fill:' + CIT + ';stroke:' + MEM + ';stroke-width:3' }, gV);
    el('rect', { x: 92, y: 112, width: 170, height: 148, rx: 26, style: 'fill:color-mix(in srgb,' + VAC + ' 30%,var(--folha));stroke:' + VAC + ';stroke-width:2' }, gV);
    el('circle', { cx: 290, cy: 176, r: 22, style: 'fill:color-mix(in srgb,' + NUC + ' 14%,var(--folha));stroke:' + NUC + ';stroke-width:3' }, gV);
    el('circle', { cx: 294, cy: 180, r: 7, style: 'fill:color-mix(in srgb,' + NUC + ' 55%,var(--folha))' }, gV);
    [[110, 104, 0], [180, 102, 0], [300, 120, 90], [300, 240, 90], [150, 270, 0], [230, 270, 0], [82, 200, 90]].forEach(function (c) {
      var g = el('g', { transform: 'translate(' + c[0] + ' ' + c[1] + ') rotate(' + c[2] + ')' }, gV);
      el('ellipse', { rx: 13, ry: 6, style: 'fill:' + CLO + ';stroke:#24631f;stroke-width:1' }, g);
      el('path', { d: 'M-7 -2 h14 M-7 2 h14', style: 'stroke:#a8d59a;stroke-width:1.2' }, g);
    });
    mito(gV, 272, 266, 0);
    [0, 1, 2].forEach(function (i) { el('path', { d: 'M276 ' + (206 + i * 7) + ' Q290 ' + (213 + i * 7) + ' 304 ' + (206 + i * 7), style: 'fill:none;stroke:' + GOL + ';stroke-width:3.5;stroke-linecap:round' }, gV); });
    rib(gV, [[84, 120], [86, 260], [310, 196], [280, 104], [270, 210]]);
    var lV = el('g', {});
    lider(lV, 68, 64, 70, 88); tx(14, 58, 'parede de celulose', B + 'fill:' + PAR, lV);
    lider(lV, 178, 168, 178, 168); tx(177, 182, 'vacúolo central', B + 'text-anchor:middle;fill:#2c6aa0', lV);
    lider(lV, 224, 64, 200, 98); tx(190, 58, 'cloroplastos', B + 'fill:' + CLO, lV);
    lider(lV, 348, 150, 306, 166); tx(334, 140, 'núcleo', B + 'fill:' + NUC, lV);
    lider(lV, 346, 224, 306, 214); tx(334, 240, 'Golgi', B + 'fill:' + GOL, lV);
    tx(195, 314, 'sem centríolos (plantas com flores)', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:#5a5a5a', lV);
    /* numeros I-IV (quimica) */
    var lQ = el('g', {});
    function num(x, y, s, x2, y2) { lider(lQ, x, y, x2, y2); var g = el('g', { transform: 'translate(' + x + ' ' + y + ')' }, lQ); el('circle', { r: 12, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, g); tx(0, 5, s, 'font-size:13px;font-weight:800;text-anchor:middle;fill:var(--ad-t)', g); }
    num(40, 70, 'I', 64, 92); num(40, 312, 'II', 74, 272); num(178, 186, 'III', 178, 186); num(356, 108, 'IV', 306, 168);
    var qT = [tx(14, 30, '', ''), tx(14, 30, '', '')];
    /* ===== em comum ===== */
    var lE = el('g', {});
    tx(70, 66, 'procarionte', B + 'text-anchor:middle;fill:var(--tinta)', lE); tx(195, 66, 'animal', B + 'text-anchor:middle;fill:var(--tinta)', lE); tx(320, 66, 'vegetal', B + 'text-anchor:middle;fill:var(--tinta)', lE);
    tx(70, 172, 'sem carioteca', N + 'text-anchor:middle;fill:var(--lapis)', lE); tx(195, 172, 'sem parede', N + 'text-anchor:middle;fill:var(--lapis)', lE); tx(320, 172, 'sem centríolo', N + 'text-anchor:middle;fill:var(--lapis)', lE);
    el('rect', { x: 14, y: 196, width: 362, height: 140, rx: 12, style: 'fill:color-mix(in srgb,var(--ad-c) 8%,var(--folha));stroke:var(--ad-c);stroke-width:1.5' }, lE);
    tx(30, 222, 'Nas três, sem exceção:', 'font-size:15px;font-weight:700;fill:var(--ad-t)', lE);
    ['membrana plasmática e citoplasma', 'ribossomos: fazem as proteínas', 'DNA e RNA (mensageiro, transportador', 'e ribossômico)', 'enzimas feitas pela própria célula'].forEach(function (s, i) { tx(i === 3 ? 52 : 44, 248 + 19 * i, (i === 3 ? '' : '· ') + s, 'font-size:14px;fill:var(--tinta)', lE); });
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { c: 'Procarionte (bactéria)', tit: '1 · Procarionte', s: 'Não tem carioteca: o DNA, circular, fica solto numa região chamada nucleoide. Não tem organelas com membrana. Tem membrana plasmática, ribossomos (70S, menores) e, por fora, parede de peptidoglicano.' },
      { c: 'Célula animal (eucarionte)', tit: '2 · Célula animal', s: 'Núcleo com carioteca e organelas com membrana: retículo, Golgi, mitocôndrias, lisossomos. Tem centríolos. Por fora da membrana não há parede.' },
      { c: 'Célula vegetal (eucarionte)', tit: '3 · Célula vegetal', s: 'Tem as organelas da animal (mitocôndria, Golgi, ribossomos) e mais: parede de celulose, vacúolo central cheio de água e cloroplastos (plastos). As plantas com flores não têm centríolos.' },
      { c: 'O que as três têm', tit: '4 · Em comum', s: 'Toda célula viva, até a bactéria, tem membrana, ribossomos, DNA e RNA, e fabrica as próprias enzimas. Núcleo com carioteca e organelas com membrana são só dos eucariontes.' },
      { c: 'Célula vegetal: de que é feita cada parte', tit: '5 · Química das partes', s: 'Parede = glicídio (celulose; na bactéria, peptidoglicano; no fungo, quitina). Membrana = lipídio e proteína. Vacúolo = água. Núcleo = ácido nucleico (DNA).' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var QL = [['I parede: glicídio', PAR, 58, 74], ['II membrana: lipídio', MEM, 58, 316], ['III vacúolo: água', '#2c6aa0', 0, 0], ['IV núcleo: ácido nucleico', NUC, 0, 0]];
    var qx = [tx(58, 74, 'glicídio (celulose)', B + 'fill:' + PAR, lQ), tx(58, 316, 'lipídio + proteína', B + 'fill:' + MEM, lQ), tx(178, 214, 'água', B + 'text-anchor:middle;fill:#2c6aa0', lQ), tx(384, 74, 'ácido nucleico', B + 'text-anchor:end;fill:' + NUC, lQ)];
    function pos(g, cx, cy, s) { g.setAttribute('transform', 'translate(' + (cx - 195 * s).toFixed(1) + ' ' + (cy - 185 * s).toFixed(1) + ') scale(' + s + ')'); }
    var _desenha = function (t) {
      var f = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.4 ? 2 : t < 11.2 ? 3 : 4;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      titC.textContent = f === 3 ? '' : E[f].c;
      vis(gP, f === 0 || f === 3); vis(gA, f === 1 || f === 3); vis(gV, f === 2 || f === 3 || f === 4);
      if (f === 3) { pos(gP, 64, 118, .36); pos(gA, 195, 118, .36); pos(gV, 320, 118, .36); }
      else { pos(gP, 195, 185, 1); pos(gA, 195, 185, 1); pos(gV, 195, 185, 1); }
      vis(lP, f === 0); vis(lA, f === 1); vis(lV, f === 2); vis(lE, f === 3); vis(lQ, f === 4);
      var t0 = [0, 2.8, 5.6, 8.4, 11.2][f], a = cl((t - t0) / .4);
      [lP, lA, lV, lE, lQ].forEach(function (g) { op(g, a); });
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 2.8, 5.6, 8.4, 11.2, 14], _N = [0.0, 3.6, 7.2, 10.8, 14.4, 18.0];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['comparacao-procarionte-animal-vegetal'], svg, _desenha, 18, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'Wef82444' ? 2.7 : q === 'Wa200844' ? 8.3 : q === 'P1d4683f' || q === 'W9694e52' ? 11.1 : 13.9; } }));
  }
};
VIS.liga('comparacao-procarionte-animal-vegetal', ['P01b637e', 'P1d4683f', 'P417a109', 'Wa200844', 'W9694e52', 'Wef82444']);
