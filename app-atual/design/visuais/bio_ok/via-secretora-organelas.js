/* Via secretora: ribossomos no RER (granular) -> vesicula -> Golgi (glicidios, empacota) -> vesicula de secrecao
   (exocitose) e lisossomo; acrossomo vem do Golgi da espermatide; lisossomo rompido digere a proteina da amostra;
   no fim, a funcao de cada organela. */
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
  'P3938e58': ['Por isso a resposta é A', 'Mayara (digestão de partes gastas) = lisossomo, seta 7. Gustavo (síntese própria) = mitocôndria, seta 4. Lígia (ácidos nucleicos) = núcleo, seta 6.', 'Os outros quatro erraram a organela.'],
  'Wda848b4': ['Por isso a resposta é C', 'Granular = com grânulos: são os ribossomos presos à face externa da membrana do retículo.'],
  'W00f8477': ['Por isso a resposta é C', 'O acrossomo é uma grande vesícula de enzimas formada pela fusão de vesículas do Golgi da espermátide.'],
  'W5689e4d': ['Por isso a resposta é C', 'O lisossomo guarda enzimas digestivas. Rompido, ele as solta, e elas quebram a proteína que se quer isolar.']
};
VIS.def['via-secretora-organelas'] = {
  tit: 'RER, Golgi e vesículas: a linha de produção da célula',
  fontes: ['OpenStax, Biology 2e, 4.4 The Endomembrane System and Proteins — https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins', 'OpenStax, Biology 2e, 4.3 Eukaryotic Cells — https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells', 'Wikipedia (en), Acrosome — https://en.wikipedia.org/wiki/Acrosome'],
  tipo: 'anim', dur: 21.6,
  marcas: [[0, 'RER'], [3.6, 'Golgi'], [7.2, 'Saídas'], [10.8, 'Acrossomo'], [14.4, 'Rompido'], [18, 'Funções']],
  cred: 'Animação feita para o app (esquema de célula animal fora de escala).',
  nota: 'A proteína de exportação nasce em ribossomos presos ao RER, passa ao Golgi (que modifica, junta glicídios e empacota) e sai em vesículas: de secreção (exocitose), lisossomos (enzimas digestivas) e, no espermatozoide, o acrossomo.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    function vis(o, b) { o.style.display = b ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var RE = '#4f7cb0', GOL = '#8a6bb5', LIS = '#b4442f', SEC = '#2f8a7a', MIT = '#c9772f', NUC = '#7d6aa8', ACU = '#3d8f6a';
    var L13 = 'font-size:13px;font-weight:700;';
    /* ===== celula ===== */
    var gC = el('g', {});
    el('rect', { x: 8, y: 26, width: 374, height: 316, rx: 36, style: 'fill:color-mix(in srgb,#e9d8b8 26%,var(--folha));stroke:#c08a3e;stroke-width:3' }, gC);
    var NX = 92, NY = 236;
    el('circle', { cx: NX, cy: NY, r: 50, style: 'fill:color-mix(in srgb,' + NUC + ' 14%,var(--folha));stroke:' + NUC + ';stroke-width:2' }, gC);
    el('circle', { cx: NX + 10, cy: NY + 6, r: 14, style: 'fill:color-mix(in srgb,' + NUC + ' 55%,var(--folha))' }, gC);
    tx(NX - 6, NY - 18, 'núcleo', L13 + 'text-anchor:middle;fill:#5d4c88', gC);
    var reP = [];
    [62, 74, 86].forEach(function (r) {
      var d = ''; for (var a = -72; a <= 34; a += 4) { var q = a * Math.PI / 180; d += (d ? 'L' : 'M') + (NX + r * Math.cos(q)).toFixed(1) + ' ' + (NY + r * Math.sin(q)).toFixed(1) + ' '; }
      reP.push(el('path', { d: d, style: 'fill:none;stroke:' + RE + ';stroke-width:6;stroke-linecap:round;opacity:.6' }, gC));
      for (a = -70; a <= 32; a += 8) { var q2 = a * Math.PI / 180; el('circle', { cx: (NX + (r + 4.6) * Math.cos(q2)).toFixed(1), cy: (NY + (r + 4.6) * Math.sin(q2)).toFixed(1), r: 1.9, style: 'fill:#2c3e50' }, gC); }
    });
    var reL = tx(140, 286, 'RER', L13 + 'fill:' + RE, gC);
    var GX = 250, GY = 168;
    [0, 1, 2, 3].forEach(function (i) { el('path', { d: 'M' + (GX - 32 + i * 2) + ' ' + (GY + 15 - i * 10) + ' Q' + GX + ' ' + (GY + 27 - i * 10) + ' ' + (GX + 32 - i * 2) + ' ' + (GY + 15 - i * 10), style: 'fill:none;stroke:' + GOL + ';stroke-width:5;stroke-linecap:round' }, gC); });
    var goL = tx(GX + 42, GY + 12, 'Golgi', L13 + 'fill:' + GOL, gC);
    var gMi = el('g', {}, gC); mv(gMi, 214, 300);
    el('ellipse', { rx: 24, ry: 12, style: 'fill:color-mix(in srgb,' + MIT + ' 22%,var(--folha));stroke:' + MIT + ';stroke-width:1.8' }, gMi);
    el('path', { d: 'M-16 0 l4 -6 l4 12 l4 -12 l4 12 l4 -12 l4 12 l4 -6', style: 'fill:none;stroke:' + MIT + ';stroke-width:1.2' }, gMi);
    var gCe = el('g', {}, gC); mv(gCe, 330, 92);
    el('rect', { x: -12, y: -5, width: 24, height: 10, rx: 2, style: 'fill:#d8d2c4;stroke:#6b6b6b;stroke-width:1.3' }, gCe);
    el('rect', { x: 14, y: -12, width: 10, height: 24, rx: 2, style: 'fill:#d8d2c4;stroke:#6b6b6b;stroke-width:1.3' }, gCe);
    var gRl = el('g', {}, gC); [[176, 66], [186, 72], [170, 78], [194, 62], [182, 84], [198, 78]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 2.4, style: 'fill:#2c3e50' }, gRl); });
    var gLf = el('g', {}, gC); mv(gLf, 322, 246);
    el('circle', { r: 13, style: 'fill:color-mix(in srgb,' + LIS + ' 18%,var(--folha));stroke:' + LIS + ';stroke-width:2' }, gLf);
    [[-5, -3], [4, 4], [5, -5], [-3, 5]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 1.9, style: 'fill:' + LIS }, gLf); });
    /* vesiculas animadas */
    var vT = el('g', {}, gC); el('circle', { r: 8, style: 'fill:color-mix(in srgb,' + RE + ' 18%,var(--folha));stroke:' + RE + ';stroke-width:2' }, vT);
    var prot = el('path', { d: 'M-4 0 l2 -3 l2 3 l2 -3 l2 3', style: 'fill:none;stroke:#1f3d66;stroke-width:1.6' }, vT);
    var acu = el('path', { d: 'M3 -9 l2.5 -4.3 h5 l2.5 4.3 l-2.5 4.3 h-5 z', style: 'fill:color-mix(in srgb,' + ACU + ' 40%,var(--folha));stroke:' + ACU + ';stroke-width:1.2' }, vT);
    var vS = el('g', {}, gC); el('circle', { r: 9, style: 'fill:color-mix(in srgb,' + SEC + ' 20%,var(--folha));stroke:' + SEC + ';stroke-width:2' }, vS);
    [[-3, -2], [3, 2], [2, -4]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 1.8, style: 'fill:' + SEC }, vS); });
    var sai = el('g', {}, gC); [[-6, 0], [4, -6], [8, 4]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 2.2, style: 'fill:' + SEC }, sai); });
    var vL = el('g', {}, gC); el('circle', { r: 11, style: 'fill:color-mix(in srgb,' + LIS + ' 18%,var(--folha));stroke:' + LIS + ';stroke-width:2' }, vL);
    [[-4, -3], [3, 3], [4, -4]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 1.8, style: 'fill:' + LIS }, vL); });
    var lab1 = tx(0, 0, '', L13 + 'fill:var(--tinta)', gC), lab2 = tx(0, 0, '', L13 + 'fill:var(--tinta)', gC);
    /* lupa do RER (etapa 1) */
    var gZ = el('g', {}, gC), ZX = 282, ZY = 94, ZR = 58;
    el('path', { d: 'M' + (NX + 80) + ' ' + (NY - 52) + ' L' + (ZX - 46) + ' ' + (ZY + 42), style: 'stroke:var(--lapis);stroke-width:1.4;stroke-dasharray:4 3' }, gZ);
    el('circle', { cx: NX + 78, cy: NY - 50, r: 9, style: 'fill:none;stroke:var(--lapis);stroke-width:1.6' }, gZ);
    el('circle', { cx: ZX, cy: ZY, r: ZR, style: 'fill:var(--folha);stroke:var(--lapis);stroke-width:1.6' }, gZ);
    var cpz = el('clipPath', { id: 'vs-zoom' }, el('defs', {}, gZ)); el('circle', { cx: ZX, cy: ZY, r: ZR - 1 }, cpz);
    var gZi = el('g', { 'clip-path': 'url(#vs-zoom)' }, gZ);
    el('rect', { x: ZX - ZR, y: ZY + 12, width: 2 * ZR, height: ZR, style: 'fill:color-mix(in srgb,' + RE + ' 16%,var(--folha))' }, gZi);
    el('line', { x1: ZX - ZR, x2: ZX + ZR, y1: ZY + 12, y2: ZY + 12, style: 'stroke:' + RE + ';stroke-width:4' }, gZi);
    var ribZ = [ZX - 26, ZX + 22].map(function (x) {
      var g = el('g', {}, gZi);
      el('ellipse', { cx: 0, cy: -10, rx: 15, ry: 10, style: 'fill:#5b6b7d' }, g);
      el('ellipse', { cx: 0, cy: -24, rx: 11, ry: 7, style: 'fill:#8796a8' }, g);
      g._x = x; return g;
    });
    var cad = ribZ.map(function () { return el('path', { style: 'fill:none;stroke:#1f3d66;stroke-width:2' }, gZi); });
    tx(ZX, ZY - 38, 'ribossomos', L13 + 'text-anchor:middle;fill:var(--tinta)', gZi);
    var intL = tx(ZX, ZY + 42, 'interior do RER', 'font-size:13px;text-anchor:middle;fill:' + RE, gZi);
    /* funcoes (etapa 6) */
    var gF = el('g', {}, gC);
    function tag(x, y, s, anc, x2, y2, cor) { if (x2 !== undefined) el('path', { d: 'M' + x2 + ' ' + y2 + ' L' + x + ' ' + (y - 4), style: 'stroke:var(--lapis);stroke-width:1.2' }, gF); var t = tx(x, y, s, 'font-size:13px;font-weight:700;text-anchor:' + anc + ';fill:' + cor, gF); return t; }
    tag(186, 50, 'ribossomo: lê o RNAm', 'middle', undefined, undefined, '#2c3e50');
    tag(370, 66, 'centríolo: cílios e flagelos', 'end', undefined, undefined, '#5a5a5a');
    tag(22, 146, 'RER: proteína de exportação', 'start', undefined, undefined, RE);
    tag(266, 214, 'Golgi: glicídios, secreção', 'middle', undefined, undefined, GOL);
    tag(370, 278, 'lisossomo: digestão, autofagia', 'end', undefined, undefined, LIS);
    tag(214, 332, 'mitocôndria: DNA e ribossomos próprios', 'middle', undefined, undefined, MIT);
    tag(NX, 304, 'núcleo: DNA e RNA', 'middle', undefined, undefined, '#5d4c88');
    /* ===== cena acrossomo ===== */
    var gA = el('g', {});
    el('circle', { cx: 130, cy: 190, r: 92, style: 'fill:color-mix(in srgb,#e9d8b8 26%,var(--folha));stroke:#c08a3e;stroke-width:3' }, gA);
    el('circle', { cx: 130, cy: 212, r: 46, style: 'fill:color-mix(in srgb,' + NUC + ' 16%,var(--folha));stroke:' + NUC + ';stroke-width:2' }, gA);
    tx(130, 232, 'núcleo', L13 + 'text-anchor:middle;fill:#5d4c88', gA);
    var gAg = el('g', {}, gA);
    [0, 1, 2].forEach(function (i) { el('path', { d: 'M' + (104 + i * 2) + ' ' + (130 - i * 9) + ' Q130 ' + (140 - i * 9) + ' ' + (156 - i * 2) + ' ' + (130 - i * 9), style: 'fill:none;stroke:' + GOL + ';stroke-width:5;stroke-linecap:round' }, gAg); });
    var agL = tx(166, 106, 'Golgi', L13 + 'fill:' + GOL, gA);
    var vA = [0, 1, 2, 3].map(function () { var c = el('circle', { r: 6, style: 'fill:color-mix(in srgb,' + LIS + ' 18%,var(--folha));stroke:' + LIS + ';stroke-width:1.6' }, gA); return c; });
    var capa = el('path', { d: 'M82.0 189.6 A53 53 0 0 1 178.0 189.6 L171.7 192.6 A46 46 0 0 0 88.3 192.6 Z', style: 'fill:color-mix(in srgb,' + LIS + ' 30%,var(--folha));stroke:' + LIS + ';stroke-width:1.8' }, gA);
    var capL = tx(130, 302, '', L13 + 'text-anchor:middle;fill:' + LIS, gA);
    var gEs = el('g', {}, gA); mv(gEs, 300, 190);
    el('ellipse', { cx: 0, cy: 0, rx: 18, ry: 26, style: 'fill:color-mix(in srgb,' + NUC + ' 16%,var(--folha));stroke:' + NUC + ';stroke-width:2' }, gEs);
    el('path', { d: 'M-16 -10 A18 22 0 0 1 16 -10 A16 15 0 0 0 -16 -10 Z', style: 'fill:color-mix(in srgb,' + LIS + ' 40%,var(--folha));stroke:' + LIS + ';stroke-width:1.8' }, gEs);
    el('rect', { x: -6, y: 26, width: 12, height: 30, rx: 4, style: 'fill:color-mix(in srgb,' + MIT + ' 30%,var(--folha));stroke:' + MIT + ';stroke-width:1.5' }, gEs);
    var flag = el('path', { style: 'fill:none;stroke:#6b6b6b;stroke-width:2' }, gEs);
    tx(26, -26, 'acrossomo', L13 + 'fill:' + LIS, gEs);
    tx(-60, -50, 'espermatozoide', 'font-size:13px;font-weight:600;fill:var(--lapis)', gEs);
    tx(130, 82, 'espermátide', 'font-size:13px;font-weight:600;text-anchor:middle;fill:var(--lapis)', gA);
    /* ===== cena tubo ===== */
    var gB = el('g', {});
    el('path', { d: 'M70 40 V290 A60 34 0 0 0 190 290 V40', style: 'fill:color-mix(in srgb,#dbe9f5 50%,var(--folha));stroke:var(--lapis);stroke-width:2.4' }, gB);
    tx(130, 30, 'células rompidas no tubo', 'font-size:13px;font-weight:600;text-anchor:middle;fill:var(--lapis)', gB);
    var cadeias = [], pos = [[100, 80], [128, 140], [104, 200], [132, 268], [146, 96]];
    pos.forEach(function (p) { var g = el('g', {}, gB); g._p = p; g._seg = [0, 1, 2, 3].map(function (k) { return el('path', { d: 'M' + (k * 12) + ' 0 l3 -5 l3 5 l3 -5 l3 5', style: 'fill:none;stroke:' + RE + ';stroke-width:2.2' }, g); }); cadeias.push(g); });
    var lisT = [[150, 180], [100, 250], [160, 240]].map(function (p) { var g = el('g', {}, gB); mv(g, p[0], p[1]); var c = el('circle', { r: 12, style: 'fill:color-mix(in srgb,' + LIS + ' 18%,var(--folha));stroke:' + LIS + ';stroke-width:2' }, g); g._c = c; g._p = p; return g; });
    var enzT = []; for (var i = 0; i < 15; i++) enzT.push(el('circle', { r: 3, style: 'fill:' + LIS }, gB));
    var bL1 = tx(206, 120, 'proteína que se', L13 + 'fill:' + RE, gB), bL1b = tx(206, 136, 'quer isolar', L13 + 'fill:' + RE, gB);
    var bL2 = tx(206, 230, 'lisossomo', L13 + 'fill:' + LIS, gB), bL2b = tx(206, 246, '', L13 + 'fill:' + LIS, gB);
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · Retículo granular (RER)', s: 'Proteínas que vão sair da célula nascem em ribossomos que se prendem à face externa do retículo e empurram a cadeia para dentro dele. Esses ribossomos são os grânulos que dão o nome: retículo granular (ou rugoso).' },
      { tit: '2 · Golgi', s: 'Uma vesícula leva a proteína do RER ao complexo golgiense. Ali ela é modificada, ganha glicídios (hexágono) e é separada e empacotada em novas vesículas, conforme o destino.' },
      { tit: '3 · Saídas do Golgi', s: 'Vesícula de secreção: funde-se à membrana e solta o conteúdo (exocitose). Lisossomo: bolsa de enzimas digestivas que fica na célula e digere o que chega a ele.' },
      { tit: '4 · Acrossomo', s: 'Na espermátide, o Golgi junta suas vesículas cheias de enzimas numa só, que se achata sobre a ponta do núcleo: é o acrossomo. As enzimas dele abrem caminho até o ovócito na fecundação.' },
      { tit: '5 · Lisossomo rompido', s: 'Num tubo com células rompidas, os lisossomos que se abrem soltam suas enzimas digestivas. Elas não escolhem: cortam as proteínas da amostra, inclusive a que se quer isolar.' },
      { tit: '6 · Quem faz o quê', s: 'Ribossomo lê o RNAm; RER faz proteína de exportação; Golgi junta glicídios e prepara a secreção; lisossomo digere (até partes velhas da célula); mitocôndria tem DNA e ribossomos próprios; núcleo faz DNA e RNA; centríolo forma cílios e flagelos.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.6 ? 2 : t < 11.4 ? 3 : t < 14.2 ? 4 : 5;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      vis(gC, f <= 2 || f === 5); vis(gA, f === 3); vis(gB, f === 4);
      var u = f === 0 ? cl(t / 2.8) : f === 1 ? cl((t - 2.8) / 2.8) : f === 2 ? cl((t - 5.6) / 3) : f === 3 ? cl((t - 8.6) / 2.8) : f === 4 ? cl((t - 11.4) / 2.8) : cl((t - 14.2) / 2.8);
      reP.forEach(function (p) { p.style.opacity = f === 0 ? .9 : .6; });
      /* etapa 1: lupa */
      op(gZ, f === 0 ? cl(u / .12) : 0); vis(gZ, f === 0);
      ribZ.forEach(function (g, k) {
        var a = ease((u - .1 - k * .15) / .25);
        mv(g, g._x, lerp(ZY - 40, ZY + 12, a));
        var n = Math.max(0, Math.floor(10 * cl((u - .35 - k * .12) / .45))), d = 'M' + g._x + ' ' + (ZY + 12);
        for (var i = 0; i < n; i++) d += ' l' + (i % 2 ? 4 : -4) + ' 4';
        cad[k].setAttribute('d', d);
      });
      op(intL, 1 - cl((u - .3) / .1));
      op(gCe, f === 0 ? 0 : 1);
      /* etapa 2: vesicula RER -> Golgi */
      if (f === 1) {
        var a1 = ease(u / .4), a2 = ease((u - .45) / .45);
        var x = u < .45 ? lerp(NX + 82, GX, a1) : GX, y = u < .45 ? lerp(NY - 30, GY + 30, a1) : lerp(GY + 30, GY - 22, a2);
        mv(vT, x, y); op(vT, 1); op(acu, u > .7 ? cl((u - .7) / .1) : 0);
      } else op(vT, 0);
      /* etapa 3: secrecao e lisossomo */
      if (f === 2) {
        var s1 = ease(u / .45); mv(vS, lerp(GX + 10, 300, s1), lerp(GY - 22, 36, s1)); op(vS, u < .5 ? 1 : 1 - cl((u - .5) / .1));
        mv(sai, 300, lerp(30, 10, ease((u - .5) / .3))); op(sai, u > .5 ? 1 : 0);
        var s2 = ease((u - .35) / .45); mv(vL, lerp(GX + 20, 322, s2), lerp(GY - 10, 246, s2)); op(vL, u > .35 && u < .8 ? 1 : 0);
      } else { op(vS, 0); op(sai, 0); op(vL, 0); }
      op(gLf, f === 2 ? (u >= .8 ? 1 : 0) : 1);
      lab1.textContent = f === 1 ? (u < .45 ? 'vesícula' : 'ganha glicídio') : f === 2 ? 'vesícula de secreção' : f === 0 ? '' : '';
      lab2.textContent = f === 2 && u > .8 ? 'lisossomo' : '';
      if (f === 1) { lab1.setAttribute('x', GX); lab1.setAttribute('y', GY - 44); lab1.style.textAnchor = 'middle'; }
      if (f === 2) { lab1.setAttribute('x', 256); lab1.setAttribute('y', 112); lab1.style.textAnchor = 'middle'; lab2.setAttribute('x', 322); lab2.setAttribute('y', 224); lab2.style.textAnchor = 'middle'; }
      op(lab1, f === 1 || f === 2 ? 1 : 0);
      /* etapa 6 */
      op(gF, f === 5 ? cl(u / .2) : 0); vis(gF, f === 5);
      op(reL, f === 5 ? 0 : 1); op(goL, f === 5 ? 0 : 1);
      /* acrossomo */
      if (f === 3) {
        vA.forEach(function (c, i) {
          var s = ease((u - i * .08) / .4), x0 = 118 + i * 9, y0 = 140;
          c.setAttribute('cx', lerp(x0, 106 + i * 16, s).toFixed(1)); c.setAttribute('cy', lerp(y0, 166, s).toFixed(1)); op(c, u < .55 ? 1 : 1 - cl((u - .55) / .1));
        });
        op(capa, cl((u - .5) / .15)); capL.textContent = u > .6 ? 'acrossomo (vesícula do Golgi)' : '';
        op(gEs, cl((u - .65) / .2));
        var d = 'M0 56'; for (var k = 1; k <= 12; k++) d += ' L' + (7 * Math.sin(k * .9 + t * 6)).toFixed(1) + ' ' + (56 + k * 7);
        flag.setAttribute('d', d);
      }
      /* tubo */
      if (f === 4) {
        var rb = ease((u - .2) / .2);
        lisT.forEach(function (g) { g._c.setAttribute('stroke-dasharray', rb > 0 ? (40 - 30 * rb).toFixed(1) + ' ' + (10 + 30 * rb).toFixed(1) : 'none'); op(g, 1 - .6 * rb); });
        enzT.forEach(function (c, i) {
          var L = lisT[i % 3]._p, ang = Math.floor(i / 3) * 1.26 + (i % 3) * .5, dist = 5 + 40 * ease((u - .25 - (i % 5) * .03) / .5);
          c.setAttribute('cx', Math.max(76, Math.min(184, L[0] + dist * Math.cos(ang))).toFixed(1)); c.setAttribute('cy', Math.max(48, Math.min(300, L[1] + dist * Math.sin(ang) * .9)).toFixed(1)); op(c, 1);
        });
        var cut = ease((u - .5) / .35);
        cadeias.forEach(function (g, gi) { g._seg.forEach(function (s, k) { mv(s, (k - 1.5) * 8 * cut, (k % 2 ? 8 : -8) * cut); }); mv(g, g._p[0] - 14, g._p[1]); });
        bL2b.textContent = u > .25 ? 'rompido: solta enzimas' : '';
        bL1.textContent = u > .6 ? 'proteína cortada' : 'proteína que se'; bL1b.textContent = u > .6 ? 'em pedaços' : 'quer isolar';
      }
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 2.8, 5.6, 8.6, 11.4, 14.2, 17], _N = [0.0, 3.6, 7.2, 10.8, 14.4, 18.0, 21.6];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['via-secretora-organelas'], svg, _desenha, 21.6, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'Wda848b4' ? 2.6 : q === 'W00f8477' ? 11.2 : q === 'W5689e4d' ? 14.0 : 16.9; } }));
  }
};
VIS.liga('via-secretora-organelas', ['P3938e58', 'Wda848b4', 'W00f8477', 'W5689e4d']);
