/* Nucleotideo (fosfato + pentose + base), cadeia, ribose x desoxirribose e tabela DNA x RNA. */
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
'W7b75885': [
'Por isso a resposta é C',
'A peça que se repete no DNA e no RNA é o nucleotídeo (fosfato +',
'pentose + base). DNA e RNA são os polímeros prontos;',
'base nitrogenada e ribose são só partes de um nucleotídeo.'
],
'Wa875e17': [
'Por isso a resposta é E',
'O fosfato é igual nos dois. Mudam a pentose (ribose no RNA,',
'desoxirribose no DNA) e uma base: timina só no DNA,',
'uracila só no RNA. A, G e C aparecem nos dois.'
],
'W4f72fef': [
'Por isso a resposta é D',
'DNA: desoxirribose, timina como base exclusiva e dupla hélice.',
'RNA: ribose, uracila e fita simples. Adenina e citosina são',
'dos dois, então não servem como base exclusiva.'
]
};
VIS.def['nucleotideo-dna-rna'] = {
  tit: 'Nucleotídeo e as diferenças entre DNA e RNA',
  fontes: ['OpenStax, Biology 2e, 3.5 Nucleic Acids — https://openstax.org/books/biology-2e/pages/3-5-nucleic-acids', 'Khan Academy, Nucleic acids — https://www.khanacademy.org/science/biology/macromolecules/nucleic-acids/a/nucleic-acids', 'Wikipedia (en), Deoxyribose — https://en.wikipedia.org/wiki/Deoxyribose'],
  tipo: 'anim', dur: 14,
  marcas: [[0, 'Nucleotídeo'], [3.4, 'Cadeia'], [6.8, 'Pentose'], [10.4, 'DNA × RNA']],
  cred: 'Animação feita para o app (esquema simplificado; anel da pentose sem todos os H).',
  nota: 'Os três componentes do nucleotídeo existem nos dois ácidos nucleicos; o fosfato é o mesmo. As diferenças são a pentose (ribose tem OH no carbono 2′, a desoxirribose tem só H), a quarta base (T no DNA, U no RNA) e a estrutura (DNA em dupla hélice, RNA geralmente em fita simples).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    var FOS = '#c47a12', PEN = '#2f855a', BAS = '#2b6cb0', DNA = '#2b6cb0', RNA = '#b4442f';
    var BCOR = { A: '#2b6cb0', G: '#2f855a', C: '#8a5a9e', T: '#c47a12', U: '#b4442f' };
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.4, 6.8, 10.4], TF = 14;
    function pent(cx, cy, r, pai) { var d = ''; for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / 5; d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1) + ' '; } return el('path', { d: d + 'Z', style: 'fill:color-mix(in srgb,' + PEN + ' 18%,var(--folha));stroke:' + PEN + ';stroke-width:2' }, pai); }

    /* ---------- etapa 1: as tres partes ---------- */
    var g1 = el('g', {});
    var pF = el('g', {}, g1); el('circle', { cx: 0, cy: 0, r: 23, style: 'fill:color-mix(in srgb,' + FOS + ' 20%,var(--folha));stroke:' + FOS + ';stroke-width:2' }, pF); tx(0, 6, 'P', 'font-size:18px;font-weight:700;fill:#8a560b;text-anchor:middle', pF);
    var pP = el('g', {}, g1); pent(0, 0, 32, pP); tx(0, 6, '5 C', 'font-size:14px;font-weight:700;fill:#22633f;text-anchor:middle', pP);
    var pB = el('g', {}, g1); el('rect', { x: -42, y: -22, width: 84, height: 44, rx: 8, style: 'fill:color-mix(in srgb,' + BAS + ' 16%,var(--folha));stroke:' + BAS + ';stroke-width:2' }, pB); tx(0, 6, 'base', 'font-size:15px;font-weight:700;fill:' + BAS + ';text-anchor:middle', pB);
    var l1 = el('path', { d: 'M233 112 H262', style: 'stroke:var(--tinta);stroke-width:2' }, g1);
    var l2 = el('path', { d: 'M332 112 H372', style: 'stroke:var(--tinta);stroke-width:2' }, g1);
    var r1 = el('g', {}, g1);
    tx(210, 160, 'fosfato', 'font-size:14px;font-weight:700;fill:#8a560b;text-anchor:middle', r1);
    tx(300, 160, 'pentose', 'font-size:14px;font-weight:700;fill:#22633f;text-anchor:middle', r1);
    tx(300, 177, '(açúcar de 5 C)', 'font-size:13px;fill:#22633f;text-anchor:middle', r1);
    tx(414, 160, 'base nitrogenada', 'font-size:14px;font-weight:700;fill:' + BAS + ';text-anchor:middle', r1);
    tx(414, 177, 'A, G, C, T ou U', 'font-size:13px;fill:' + BAS + ';text-anchor:middle', r1);
    var br = el('g', {}, g1);
    el('path', { d: 'M180 64 V54 H460 V64', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' }, br);
    tx(320, 42, 'nucleotídeo = a peça (monômero)', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', br);

    /* ---------- etapa 2: cadeia ---------- */
    var g2 = el('g', {});
    var SEQ = ['A', 'C', 'G', 'T'], nuc = [];
    SEQ.forEach(function (b, i) {
      var x0 = 70 + 122 * i, g = el('g', {}, g2);
      if (i) el('path', { d: 'M' + (x0 - 122 + 82) + ' 88 L' + (x0 - 20) + ' 72', style: 'stroke:var(--tinta);stroke-width:2' }, g);
      el('circle', { cx: x0, cy: 70, r: 19, style: 'fill:color-mix(in srgb,' + FOS + ' 20%,var(--folha));stroke:' + FOS + ';stroke-width:2' }, g);
      tx(x0, 76, 'P', 'font-size:16px;font-weight:700;fill:#8a560b;text-anchor:middle', g);
      el('path', { d: 'M' + (x0 + 19) + ' 74 L' + (x0 + 36) + ' 82', style: 'stroke:var(--tinta);stroke-width:2' }, g);
      pent(x0 + 58, 92, 24, g);
      el('path', { d: 'M' + (x0 + 58) + ' 116 V134', style: 'stroke:var(--tinta);stroke-width:2' }, g);
      el('rect', { x: x0 + 38, y: 134, width: 40, height: 34, rx: 7, style: 'fill:color-mix(in srgb,' + BCOR[b] + ' 16%,var(--folha));stroke:' + BCOR[b] + ';stroke-width:2' }, g);
      tx(x0 + 58, 157, b, 'font-size:17px;font-weight:700;fill:' + BCOR[b] + ';text-anchor:middle', g);
      nuc.push(g);
    });
    var cx1 = el('rect', { x: 44, y: 44, width: 104, height: 132, rx: 10, style: 'fill:none;stroke:var(--ad-c);stroke-width:2;stroke-dasharray:5 4' }, g2);
    var cx1t = tx(96, 196, '1 nucleotídeo', 'font-size:13.5px;font-weight:700;fill:var(--ad-t);text-anchor:middle', g2);
    var esq = tx(330, 34, 'esqueleto fosfato–açúcar', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g2);
    var esq2 = el('path', { d: 'M250 40 H410', style: 'stroke:var(--lapis);stroke-width:1' }, g2);
    var pol = tx(372, 200, 'polinucleotídeo = ácido nucleico (DNA ou RNA)', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g2);

    /* ---------- etapa 3: ribose x desoxirribose ---------- */
    var g3 = el('g', {});
    function anel(cx, cy, nome, cor, c2, pai) {
      var g = el('g', {}, pai);
      tx(cx, 30, nome, 'font-size:16px;font-weight:700;fill:' + cor + ';text-anchor:middle', g);
      var V = [[cx, cy - 36], [cx + 36, cy - 10], [cx + 22, cy + 30], [cx - 22, cy + 30], [cx - 36, cy - 10]];
      var d = ''; V.forEach(function (v, i) { d += (i ? 'L' : 'M') + v[0] + ' ' + v[1] + ' '; });
      el('path', { d: d + 'Z', style: 'fill:color-mix(in srgb,' + PEN + ' 12%,var(--folha));stroke:' + PEN + ';stroke-width:2.2' }, g);
      el('circle', { cx: V[0][0], cy: V[0][1], r: 11, style: 'fill:var(--folha)' }, g);
      tx(V[0][0], V[0][1] + 6, 'O', 'font-size:16px;font-weight:700;fill:#b4442f;text-anchor:middle', g);
      [['1′', V[1], 10, -4], ['2′', V[2], 10, 4], ['3′', V[3], -22, 4], ['4′', V[4], -22, -4]].forEach(function (k) { tx(k[1][0] + k[2], k[1][1] + k[3], k[0], 'font-size:13px;font-weight:600;fill:var(--lapis)', g); });
      el('path', { d: 'M' + V[1][0] + ' ' + V[1][1] + ' H' + (cx + 62), style: 'stroke:var(--tinta);stroke-width:1.8' }, g);
      tx(cx + 66, cy - 5, 'base', 'font-size:14px;font-weight:700;fill:' + BAS, g);
      el('path', { d: 'M' + V[4][0] + ' ' + V[4][1] + ' L' + (cx - 54) + ' ' + (cy - 36), style: 'stroke:var(--tinta);stroke-width:1.8' }, g);
      tx(cx - 58, cy - 42, '5′ CH₂–P', 'font-size:14px;font-weight:600;fill:var(--tinta);text-anchor:middle', g);
      el('path', { d: 'M' + V[3][0] + ' ' + V[3][1] + ' V' + (cy + 50) + ' M' + V[2][0] + ' ' + V[2][1] + ' V' + (cy + 50), style: 'stroke:var(--tinta);stroke-width:1.8' }, g);
      tx(V[3][0], cy + 68, 'OH', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      el('circle', { cx: V[2][0], cy: cy + 63, r: 17, style: 'fill:color-mix(in srgb,' + cor + ' 14%,var(--folha));stroke:' + cor + ';stroke-width:2' }, g);
      tx(V[2][0], cy + 68, c2, 'font-size:15px;font-weight:700;fill:' + cor + ';text-anchor:middle', g);
      return g;
    }
    anel(190, 104, 'ribose (RNA)', RNA, 'OH', g3);
    anel(470, 104, 'desoxirribose (DNA)', DNA, 'H', g3);
    tx(320, 200, 'a única diferença está no carbono 2′', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3);

    /* ---------- etapa 4: tabela DNA x RNA ---------- */
    var g4 = el('g', {});
    var CX = [300, 510];
    tx(CX[0], 26, 'DNA', 'font-size:17px;font-weight:700;fill:' + DNA + ';text-anchor:middle', g4);
    tx(CX[1], 26, 'RNA', 'font-size:17px;font-weight:700;fill:' + RNA + ';text-anchor:middle', g4);
    var LIN = [['fosfato', 'igual', 'igual', 0], ['pentose', 'desoxirribose', 'ribose', 1], ['bases', 'A, G, C + T', 'A, G, C + U', 1], ['estrutura', 'dupla hélice', 'fita simples', 1]];
    var linG = LIN.map(function (r, i) {
      var y = 58 + 30 * i, g = el('g', {}, g4);
      el('rect', { x: 20, y: y - 20, width: 600, height: 28, rx: 6, style: 'fill:' + (r[3] ? 'color-mix(in srgb,var(--ad-c) 9%,var(--folha))' : 'transparent') }, g);
      tx(32, y, r[0], 'font-size:14.5px;font-weight:700;fill:var(--tinta)', g);
      tx(CX[0], y, r[1], 'font-size:14.5px;' + (r[3] ? 'font-weight:700;fill:' + DNA : 'fill:var(--lapis)') + ';text-anchor:middle', g);
      tx(CX[1], y, r[2], 'font-size:14.5px;' + (r[3] ? 'font-weight:700;fill:' + RNA : 'fill:var(--lapis)') + ';text-anchor:middle', g);
      return g;
    });
    tx(32, 186, 'o nucleotídeo difere em:', 'font-size:13.5px;fill:var(--lapis)', g4);
    tx(32, 203, 'pentose e base', 'font-size:13.5px;font-weight:700;fill:var(--ad-t)', g4);
    var dh = el('g', {}, g4), sh = el('g', {}, g4);
    var d1 = '', d2 = '', d3 = '', x;
    for (x = 0; x <= 150; x += 3) { d1 += (x ? 'L' : 'M') + (CX[0] - 75 + x) + ' ' + (180 + 13 * Math.sin(x / 150 * 2 * Math.PI)).toFixed(1) + ' '; d2 += (x ? 'L' : 'M') + (CX[0] - 75 + x) + ' ' + (180 - 13 * Math.sin(x / 150 * 2 * Math.PI)).toFixed(1) + ' '; d3 += (x ? 'L' : 'M') + (CX[1] - 75 + x) + ' ' + (176 + 10 * Math.sin(x / 150 * 2 * Math.PI)).toFixed(1) + ' '; }
    for (x = 8; x < 150; x += 14) { var s = 13 * Math.sin(x / 150 * 2 * Math.PI); el('path', { d: 'M' + (CX[0] - 75 + x) + ' ' + (180 + s).toFixed(1) + ' V' + (180 - s).toFixed(1), style: 'stroke:var(--lapis);stroke-width:1.6' }, dh); var s2 = 10 * Math.sin(x / 150 * 2 * Math.PI); el('path', { d: 'M' + (CX[1] - 75 + x) + ' ' + (176 + s2).toFixed(1) + ' v14', style: 'stroke:var(--lapis);stroke-width:1.6' }, sh); }
    el('path', { d: d1, style: 'fill:none;stroke:' + DNA + ';stroke-width:3' }, dh); el('path', { d: d2, style: 'fill:none;stroke:' + DNA + ';stroke-width:3' }, dh);
    el('path', { d: d3, style: 'fill:none;stroke:' + RNA + ';stroke-width:3' }, sh);

    /* ---------- painel ---------- */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. A peça: o nucleotídeo', 'Cada nucleotídeo tem três partes: um fosfato, uma pentose', '(açúcar de 5 carbonos) e uma base nitrogenada.', 'Ele é o monômero dos ácidos nucleicos.'],
      ['2. Muitos nucleotídeos = ácido nucleico', 'O fosfato de um nucleotídeo se liga à pentose do seguinte e forma', 'o esqueleto fosfato–açúcar; as bases ficam para o lado.', 'A cadeia (polinucleotídeo) é o DNA ou o RNA.'],
      ['3. A pentose muda: ribose × desoxirribose', 'Na ribose, o carbono 2′ tem OH; na desoxirribose, só H.', '"Desoxi" quer dizer "sem um oxigênio": é o que dá nome', 'ao ácido desoxirribonucleico (DNA).'],
      ['4. DNA × RNA: o que muda e o que fica', 'O fosfato é igual. Muda a pentose e uma base: T só no DNA, U só no RNA', '(A, G e C estão nos dois). O DNA é uma dupla hélice;', 'o RNA costuma ser uma fita simples.']
    ];
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3;
      var ent = cl((t - T[f]) / .4);
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? ent : 0); op(g3, f === 2 ? ent : 0); op(g4, f === 3 ? ent : 0);
      var u = ease((t - .2) / 1.4);
      mv(pF, lerp(110, 210, u), 112); mv(pP, 300, lerp(40, 112, u)); mv(pB, lerp(560, 414, u), 112);
      op(l1, cl((t - 1.6) / .3)); op(l2, cl((t - 1.6) / .3)); op(r1, cl((t - 1.2) / .4)); op(br, cl((t - 1.9) / .4));
      nuc.forEach(function (g, i) { op(g, f === 1 ? cl((t - T[1] - .3 * i) / .3) : 0); });
      op(cx1, cl((t - T[1] - 1.4) / .4)); op(cx1t, cl((t - T[1] - 1.4) / .4));
      op(esq, cl((t - T[1] - 1.8) / .4)); op(esq2, cl((t - T[1] - 1.8) / .4)); op(pol, cl((t - T[1] - 2.2) / .4));
      linG.forEach(function (g, i) { op(g, f === 3 ? cl((t - T[3] - .4 * i) / .4) : 0); });
      op(dh, cl((t - T[3] - 1.4) / .4)); op(sh, cl((t - T[3] - 1.4) / .4));
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['nucleotideo-dna-rna'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'W7b75885' ? T[2] - .2 : TF - .01; }
    });
  }
};
VIS.liga('nucleotideo-dna-rna', ['W7b75885', 'Wa875e17', 'W4f72fef']);
