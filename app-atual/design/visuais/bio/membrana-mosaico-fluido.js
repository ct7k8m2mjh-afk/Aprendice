/* Membrana plasmatica no modelo do mosaico fluido: bicamada de fosfolipidios, proteinas integrais e perifericas,
   colesterol e glicocalice (carboidratos ligados a proteinas e lipidios) so na face externa. */
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
  'Wfc3e455': ['Por isso a resposta é B', 'O fundo contínuo é a bicamada de fosfolipídios; as proteínas é que ficam inseridas nela.', 'Em E os mesmos termos estão invertidos.'],
  'W928eada': ['Por isso a resposta é D', 'O glicocálice é a camada de carboidratos (açúcares) da face externa.', 'Proteína e lipídio são só a âncora dessas cadeias.']
};
VIS.def['membrana-mosaico-fluido'] = {
  tit: 'Membrana plasmática: o mosaico fluido',
  fontes: ['OpenStax, Biology 2e, 5.1 Components and Structure — https://openstax.org/books/biology-2e/pages/5-1-components-and-structure', 'Wikipedia (en), Glycocalyx — https://en.wikipedia.org/wiki/Glycocalyx'],
  tipo: 'anim', dur: 11.6,
  marcas: [[0, 'Bicamada'], [3, 'Proteínas'], [6, 'Colesterol'], [8.6, 'Glicocálice']],
  cred: 'Animação feita para o app (esquema fora de escala).',
  nota: 'Base: duas camadas de fosfolipídios (cabeças polares para a água, caudas apolares no meio). Peças inseridas: proteínas. Colesterol entre os fosfolipídios (célula animal). Glicocálice: açúcares ligados a proteínas e lipídios, só do lado de fora.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PROT = '#5f86b3', ACU = '#3d8f6a', COL = '#b5651d';
    var MT = 150, MB = 222, MID = 186;
    tx(10, 26, 'meio externo (água)', 'font-size:13px;font-weight:600;fill:var(--lapis)');
    tx(10, 342, 'citosol (água)', 'font-size:13px;font-weight:600;fill:var(--lapis)');
    /* glicocalice (atras) */
    var gA = el('g', {});
    function cadeia(x0, y0, n, ramo) {
      var d = 'M' + x0 + ' ' + y0, pts = [];
      for (var i = 1; i <= n; i++) { var x = x0 + (i % 2 ? 4 : -4), y = y0 - 15 * i; d += ' L' + x + ' ' + y; pts.push([x, y]); }
      if (ramo) { var b = pts[1]; d += ' M' + b[0] + ' ' + b[1] + ' L' + (b[0] + 15) + ' ' + (b[1] - 10) + ' L' + (b[0] + 22) + ' ' + (b[1] - 24); pts.push([b[0] + 15, b[1] - 10], [b[0] + 22, b[1] - 24]); }
      el('path', { d: d, style: 'fill:none;stroke:' + ACU + ';stroke-width:1.6' }, gA);
      pts.forEach(function (p) { el('path', { d: 'M' + (p[0] - 6) + ' ' + p[1] + ' l3 -5.2 h6 l3 5.2 l-3 5.2 h-6 z', style: 'fill:color-mix(in srgb,' + ACU + ' 35%,var(--folha));stroke:' + ACU + ';stroke-width:1.3' }, gA); });
    }
    cadeia(130, 128, 4, true); cadeia(268, 128, 3, true); cadeia(52, MT, 3, false); cadeia(345, MT, 4, false);
    var lA = el('g', {});
    tx(140, 54, 'glicoproteína', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:' + ACU, lA);
    tx(268, 52, 'glicoproteína', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:' + ACU, lA);
    tx(52, 92, 'glicolipídio', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:' + ACU, lA);
    tx(350, 76, 'glicolipídio', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:' + ACU, lA);
    /* fosfolipidios */
    var FL = [];
    function livre(x) { return !(x > 100 && x < 160) && !(x > 244 && x < 292); }
    var colX = [80, 210, 318];
    for (var x = 14, i = 0; x <= 382; x += 13, i++) {
      [[MT + 6, 1], [MB - 6, -1]].forEach(function (p, k) {
        var g = el('g', {}); g._i = i + k * 50; g._vaga = !livre(x);
        el('path', { d: 'M-2.5 ' + (5 * p[1]) + ' C-3.5 ' + (16 * p[1]) + ' -1 ' + (22 * p[1]) + ' -2.5 ' + (30 * p[1]) + ' M2.5 ' + (5 * p[1]) + ' C3.5 ' + (14 * p[1]) + ' 0.5 ' + (22 * p[1]) + ' 2.5 ' + (30 * p[1]), style: 'stroke:#c4ab7a;stroke-width:1.6;fill:none' }, g);
        el('circle', { r: 6, style: 'fill:#ecc77d;stroke:#b8892e;stroke-width:1.1' }, g);
        g._x = x; g._y = p[0]; FL.push(g);
      });
    }
    /* destaque de um fosfolipidio (etapa 1) */
    var gD = el('g', {});
    var dx = 14 + 13 * 2;
    el('circle', { cx: dx, cy: MT + 6, r: 9, style: 'fill:none;stroke:var(--ad-c);stroke-width:2.2' }, gD);
    el('rect', { x: dx - 7, y: MT + 12, width: 14, height: 30, rx: 5, style: 'fill:none;stroke:var(--ad-c);stroke-width:2;stroke-dasharray:3 2' }, gD);
    el('path', { d: 'M' + (dx + 8) + ' ' + (MT - 2) + ' L' + (dx + 40) + ' 112', style: 'stroke:var(--ad-c);stroke-width:1.5' }, gD);
    tx(dx + 44, 108, 'cabeça polar (com fosfato):', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', gD);
    tx(dx + 44, 125, 'atrai água, fica para fora', 'font-size:13.5px;fill:var(--tinta)', gD);
    el('path', { d: 'M' + (dx + 7) + ' ' + (MT + 30) + ' L' + (dx + 40) + ' 258', style: 'stroke:var(--ad-c);stroke-width:1.5' }, gD);
    tx(dx + 44, 262, '2 caudas apolares (ácidos graxos):', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', gD);
    tx(dx + 44, 279, 'fogem da água, ficam no meio', 'font-size:13.5px;fill:var(--tinta)', gD);
    /* proteinas */
    var gP1 = el('g', {}); el('path', { d: 'M104 ' + (MT - 18) + ' C100 160 100 210 106 ' + (MB + 16) + ' L150 ' + (MB + 18) + ' C158 205 156 165 152 ' + (MT - 20) + ' Z', style: 'fill:color-mix(in srgb,' + PROT + ' 32%,var(--folha));stroke:' + PROT + ';stroke-width:1.8' }, gP1);
    var gP2 = el('g', {}); el('path', { d: 'M248 ' + (MT - 16) + ' C242 170 244 205 250 ' + (MB + 14) + ' L286 ' + (MB + 14) + ' C292 200 292 168 288 ' + (MT - 16) + ' Z', style: 'fill:color-mix(in srgb,' + PROT + ' 32%,var(--folha));stroke:' + PROT + ';stroke-width:1.8' }, gP2);
    var gP3 = el('g', {}); el('ellipse', { cx: 196, cy: MB + 16, rx: 26, ry: 12, style: 'fill:color-mix(in srgb,#7a6bb0 30%,var(--folha));stroke:#7a6bb0;stroke-width:1.8' }, gP3);
    var lP = el('g', {});
    tx(162, 142, 'integral', 'font-size:13.5px;font-weight:700;fill:' + PROT, lP);
    tx(296, 142, 'integral', 'font-size:13.5px;font-weight:700;fill:' + PROT, lP);
    tx(196, 262, 'periférica', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:#6a5aa0', lP);
    var setaF = el('g', {});
    el('path', { d: 'M300 300 h70 m-7 -5 l7 5 l-7 5 M300 300 h-70 m7 -5 l-7 5 l7 5', style: 'fill:none;stroke:var(--lapis);stroke-width:1.6' }, setaF);
    tx(300, 290, 'tudo desliza de lado', 'font-size:13px;font-weight:600;text-anchor:middle;fill:var(--lapis)', setaF);
    /* colesterol */
    var gC = el('g', {});
    colX.forEach(function (cx) {
      [[MT + 10, 1], [MB - 10, -1]].forEach(function (p) {
        el('rect', { x: cx - 3.5, y: p[1] > 0 ? p[0] + 3 : p[0] - 25, width: 7, height: 22, rx: 3, style: 'fill:' + COL }, gC);
        el('circle', { cx: cx, cy: p[0] - 1 * p[1], r: 3, style: 'fill:#f0d2a8;stroke:' + COL + ';stroke-width:1.2' }, gC);
      });
    });
    var lC = el('g', {}); el('path', { d: 'M318 ' + (MB - 2) + ' L330 254', style: 'stroke:' + COL + ';stroke-width:1.5' }, lC);
    tx(332, 266, 'colesterol', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:' + COL, lC);
    var bAc = el('g', {});
    el('path', { d: 'M384 ' + (MT - 4) + ' V44', style: 'stroke:' + ACU + ';stroke-width:2;fill:none' }, bAc);
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 9; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · Bicamada de fosfolipídios', s: 'Cada fosfolipídio tem uma cabeça polar, que atrai água, e duas caudas apolares, que fogem dela. Na água eles se arrumam sozinhos em duas camadas: cabeças para fora, caudas escondidas no meio.' },
      { tit: '2 · Proteínas inseridas', s: 'As proteínas ficam mergulhadas na bicamada: as integrais a atravessam; as periféricas ficam presas a uma das faces. Fosfolipídios e proteínas se deslocam de lado: é um mosaico fluido.' },
      { tit: '3 · Colesterol', s: 'Na célula animal, moléculas de colesterol ficam entre os fosfolipídios, nas duas camadas, e ajudam a regular a fluidez da membrana.' },
      { tit: '4 · Glicocálice', s: 'Cadeias de carboidrato (açúcares, os hexágonos) presas a proteínas (glicoproteínas) e a lipídios (glicolipídios), só na face externa. Essa camada de açúcar é o glicocálice: reconhecimento entre células.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 8.6 ? 2 : 3;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      var flu = f >= 1 ? 1 : 0;
      FL.forEach(function (g) { mv(g, g._x + flu * 2.2 * Math.sin(t * 2.4 + g._i * 1.7), g._y); if (g._vaga) op(g, 1 - cl((t - 2.9) / .3)); });
      var ap = cl((t - 3) / .6);
      [gP1, gP2, gP3].forEach(function (g, k) { mv(g, flu * 4 * Math.sin(t * 1.1 + k * 2), 0); op(g, ap); });
      op(gD, f === 0 ? cl(t / .4) : 0);
      op(lP, f === 1 || f === 2 ? ap : 0);
      op(setaF, f === 1 ? ap : 0);
      op(gC, f >= 2 ? cl((t - 6) / .5) : 0); op(lC, f === 2 ? cl((t - 6) / .5) : 0);
      var aa = f === 3 ? cl((t - 8.6) / .6) : 0;
      op(gA, aa); op(lA, aa); op(bAc, 0);
      mv(gA, flu * 4 * Math.sin(t * 1.1) * 0, 0);
    };
    return fimResposta(VIS.def['membrana-mosaico-fluido'], svg, _desenha, 11.6, RESP, qid, { x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'Wfc3e455' ? 5.4 : 11.5; } });
  }
};
VIS.liga('membrana-mosaico-fluido', ['Wfc3e455', 'W928eada']);
