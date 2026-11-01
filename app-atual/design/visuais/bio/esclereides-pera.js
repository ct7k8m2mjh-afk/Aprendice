/* Esclerenquima: as celulas petreas (esclereides) da pera, em fotos reais de microscopio, e a comparacao com
   parenquima e colenquima. Questoes W13ea32c (UFSM, pera) e W5e9a89f (fibras e esclereides). */
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
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 22, y: y + 36, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 22, y: y + 66 + 23 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
  };
}
var RESP = {
  'W13ea32c': ['Por isso a resposta é B', 'Os grãos da pera são esclereides: células mortas, de parede grossa', 'com lignina. Esclereide é uma célula do esclerênquima.'],
  'W5e9a89f': ['Por isso a resposta é C', 'Fibras (longas) e esclereides (curtas) são as duas formas de célula', 'do esclerênquima: mortas, com parede lignificada.']
};
VIS.def['esclereides-pera'] = {
  tit: 'Os grãos da pera: esclereides do esclerênquima',
  fontes: [
    'OpenStax, Biology 2e, 30.2 Stems (parênquima, colênquima e esclerênquima; fibras e esclereides; lignina) — https://openstax.org/books/biology-2e/pages/30-2-stems',
    'Wikipedia (en), Sclereid (células pétreas da pera, parede secundária lignificada com pontoações) — https://en.wikipedia.org/wiki/Sclereid',
    'Wikipedia (en), Ground tissue (colênquima vivo sem lignina; esclerênquima morto na maturidade) — https://en.wikipedia.org/wiki/Ground_tissue'
  ],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'A polpa'], [4.2, 'De perto'], [8.4, 'Os tecidos']],
  cred: 'Fotos reais de microscópio óptico, recortadas: "Sclereids in Pyrus pear (36452689110).jpg" (100×) e "Stone cells in Pyrus pear (36452689990).jpg" (400×), Berkshire Community College Bioscience Image Library, domínio público (CC0), via Wikimedia Commons. Esquema do passo 3 feito para o app, fora de escala.',
  nota: 'Esclerênquima = células mortas na maturidade, com parede secundária grossa e lignificada. Tem duas formas de célula: fibras (longas) e esclereides (curtas, como as células pétreas da pera).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PX = 14, PY = 26, PW = 300, PH = 225, K = PW / 640, RX = 332;
    var LIG = '#a3214f', CEL = '#3f9a7a';
    var gF = el('g', {});
    var defs = el('defs', {}, gF), cp = el('clipPath', { id: 'escl-clip' }, defs);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    var fotos = [1, 2].map(function (i) { return el('image', { href: 'vis/esclereides-pera-' + i + '.webp', x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#escl-clip)' }, gF); });
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, gF);
    var cap = tx(PX, PY + PH + 18, '', 'font-size:13px;fill:var(--lapis)', gF);
    var MK = [0, 1, 2].map(function (i) {
      var g = el('g', {}, gF);
      el('circle', { r: 12, style: 'fill:#fff;stroke:var(--ad-c);stroke-width:3' }, g);
      tx(0, 5, String(i + 1), 'font-size:14px;font-weight:800;fill:#14532d;text-anchor:middle', g);
      return g;
    });
    var tit = tx(RX, 44, '', 'font-size:20px;font-weight:700;fill:var(--tinta)', gF);
    var L = []; for (var i = 0; i < 7; i++) L.push(tx(RX, 72 + i * 20, '', 'font-size:14px;fill:var(--tinta)', gF));
    var E = [
      { f: 0, cap: 'polpa da pera, 100×', t: 'Os grãos da pera', l: ['Corte fino da polpa ao microscópio.', '1 manchas vermelhas: grupos de', '   esclereides, as células pétreas.', '   São os grãos que você sente.', '2 em volta, em verde: parênquima,', '   células vivas de parede fina', '   (a parte macia da polpa).'], m: [[197, 123], [440, 196]] },
      { f: 1, cap: 'esclereides da pera, 400×', t: 'Uma esclereide de perto', l: ['1 parede secundária muito grossa,', '   impregnada de lignina: dura.', '2 o espaço interno quase sumiu:', '   não há citoplasma, a célula', '   está MORTA. Sobrou a parede.', '3 parênquima: parede fina, viva', 'Esclereide = esclerênquima.'], m: [[188, 228], [147, 176], [470, 76]] }
    ];
    /* ===== passo 3: os tecidos de sustentacao (esquema) ===== */
    var g3 = el('g', {});
    function celula(pai, cx, cy, pts, parede, cor, viva) {
      var d = 'M' + pts.map(function (q) { return (cx + q[0]) + ' ' + (cy + q[1]); }).join(' L') + ' Z';
      el('path', { d: d, style: 'fill:' + (viva ? '#f3f7ec' : '#f7eef1') + ';stroke:' + cor + ';stroke-width:' + parede + ';stroke-linejoin:round' }, pai);
      if (viva) el('circle', { cx: cx + 6, cy: cy - 4, r: 7, style: 'fill:#9c7ab8;stroke:#6b4f8a;stroke-width:1' }, pai);
    }
    var hex = [[-34, -20], [0, -38], [34, -20], [34, 20], [0, 38], [-34, 20]];
    var C3 = [];
    var c1 = el('g', { transform: 'translate(0 -16)' }, g3); celula(c1, 86, 96, hex, 2, CEL, true);
    tx(86, 166, 'parênquima', 'font-size:14.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', c1); tx(86, 184, 'viva, parede fina', 'font-size:13px;fill:var(--lapis);text-anchor:middle', c1); tx(86, 200, 'preenche, armazena', 'font-size:13px;fill:var(--lapis);text-anchor:middle', c1);
    C3.push(c1);
    var c2 = el('g', { transform: 'translate(0 -16)' }, g3); celula(c2, 236, 96, hex, 2, CEL, true);
    hex.forEach(function (q) { el('circle', { cx: 236 + q[0] * .93, cy: 96 + q[1] * .93, r: 8, style: 'fill:' + CEL + ';opacity:.85' }, c2); });
    tx(236, 166, 'colênquima', 'font-size:14.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', c2); tx(236, 184, 'viva, cantos grossos', 'font-size:13px;fill:var(--lapis);text-anchor:middle', c2); tx(236, 200, 'sem lignina: flexível', 'font-size:13px;fill:var(--lapis);text-anchor:middle', c2);
    C3.push(c2);
    var c3 = el('g', { transform: 'translate(0 -16)' }, g3);
    el('path', { d: 'M396 40 C406 70 408 120 396 152 C384 120 386 70 396 40 Z', style: 'fill:#f7eef1;stroke:' + LIG + ';stroke-width:9;stroke-linejoin:round' }, c3);
    el('path', { d: 'M396 66 V126', style: 'stroke:#e9d3da;stroke-width:2' }, c3);
    el('path', { d: 'M420 40 C430 70 432 120 420 152 C408 120 410 70 420 40 Z', style: 'fill:#f7eef1;stroke:' + LIG + ';stroke-width:9;stroke-linejoin:round' }, c3);
    el('path', { d: 'M420 66 V126', style: 'stroke:#e9d3da;stroke-width:2' }, c3);
    tx(408, 184, 'fibra', 'font-size:14.5px;font-weight:700;fill:' + LIG + ';text-anchor:middle', c3); tx(408, 200, 'longa, pontas finas', 'font-size:13px;fill:var(--lapis);text-anchor:middle', c3);
    C3.push(c3);
    var c4 = el('g', { transform: 'translate(0 -16)' }, g3);
    el('path', { d: 'M520 96 L540 64 L576 66 L590 100 L570 132 L534 128 Z', style: 'fill:' + LIG + ';opacity:.92;stroke:#6e1534;stroke-width:1.5;stroke-linejoin:round' }, c4);
    el('circle', { cx: 556, cy: 98, r: 6, style: 'fill:#f7eef1' }, c4);
    var pt = ''; [[540, 64], [576, 66], [590, 100], [570, 132], [534, 128], [520, 96], [558, 65], [583, 83], [580, 116], [552, 130], [527, 112], [530, 80]].forEach(function (q) { pt += 'M556 98 L' + (556 + (q[0] - 556) * .9).toFixed(1) + ' ' + (98 + (q[1] - 98) * .9).toFixed(1) + ' '; });
    el('path', { d: pt, style: 'stroke:#f2d5df;stroke-width:1.3' }, c4);
    tx(556, 184, 'esclereide', 'font-size:14.5px;font-weight:700;fill:' + LIG + ';text-anchor:middle', c4); tx(556, 200, 'curta: célula pétrea', 'font-size:13px;fill:var(--lapis);text-anchor:middle', c4);
    C3.push(c4);
    var br = el('g', {}, g3);
    el('path', { d: 'M366 198 V204 H600 V198', style: 'fill:none;stroke:' + LIG + ';stroke-width:2' }, br);
    tx(483, 222, 'ESCLERÊNQUIMA', 'font-size:15px;font-weight:700;fill:' + LIG + ';text-anchor:middle', br);
    tx(483, 238, 'mortas, parede com lignina', 'font-size:13px;fill:var(--lapis);text-anchor:middle', br);
    var br2 = el('g', {}, g3);
    el('path', { d: 'M46 198 V204 H276 V198', style: 'fill:none;stroke:' + CEL + ';stroke-width:2' }, br2);
    tx(161, 222, 'células vivas', 'font-size:15px;font-weight:700;fill:#2b7a5e;text-anchor:middle', br2);
    tx(161, 238, 'parede sem lignina', 'font-size:13px;fill:var(--lapis);text-anchor:middle', br2);
    tx(14, 22, 'Sustentação e preenchimento na planta (esquema)', 'font-size:14px;font-weight:700;fill:var(--tinta)', g3);
    var b1 = tx(14, 290, 'Colênquima é vivo e flexível. Esclerênquima é morto e rígido, por', 'font-size:14px;fill:var(--tinta)', g3);
    var b2 = tx(14, 311, 'causa da lignina, e tem duas formas de célula: fibras e esclereides.', 'font-size:14px;fill:var(--tinta)', g3);

    var T = [0, 4.2, 8.4];
    return fimResposta(VIS.def['esclereides-pera'], svg, function (t) {
      var k = t < 4.2 ? 0 : t < 8.4 ? 1 : 2, u = t - T[k];
      vis(gF, k < 2 ? 1 : 0); vis(g3, k === 2 ? 1 : 0);
      if (k < 2) {
        var e = E[k];
        fotos.forEach(function (f, i) { f.style.opacity = i === e.f ? 1 : 0; });
        cap.textContent = e.cap; tit.textContent = e.t;
        L.forEach(function (l, i) { var s = e.l[i] || ''; l.textContent = s; l.style.fontWeight = /^\d |= escl/.test(s) ? '700' : '400'; });
        MK.forEach(function (m, i) {
          var p = e.m[i];
          if (!p) { vis(m, 0); return; }
          vis(m, cl((u - .2 - i * .5) / .25));
          m.setAttribute('transform', 'translate(' + (PX + p[0] * K).toFixed(1) + ' ' + (PY + p[1] * K).toFixed(1) + ')');
        });
      } else {
        C3.forEach(function (c, i) { vis(c, cl((u - .1 - i * .35) / .3)); });
        vis(br2, cl((u - 1.2) / .3)); vis(br, cl((u - 1.6) / .3));
      }
    }, 12, RESP, qid, { congela: function (q) { return q === 'W13ea32c' ? 8.2 : 11.9; }, semEsmaecer: true, x: 14, y: 250, w: 612, h: 98 });
  }
};
VIS.liga('esclereides-pera', ['W13ea32c', 'W5e9a89f']);
