/* Cecilia (anfibio apodo, Gymnophiona) x minhoca (anelideo): parecem iguais por fora, mas so a cecilia tem cranio
   (e coluna vertebral). Vasos, tubo digestorio e segmentacao os dois tem; cerdas so a minhoca. Questao P433b120. */
/* etapa final "Resposta" (variante lateral): o cartao ocupa a coluna de texto da direita e o desenho da
   esquerda fica inteiro, congelado no quadro que decide a questao. */
function fimLado(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var x = opc.x || 430, w = vb[2] - x - 6, y = opc.y || 14, h = Math.min(vb[3] - y - 10, 91 + 21 * (r.length - 1));
  var c = el('g', {});
  el('rect', { x: x - 4, y: 0, width: vb[2] - x + 4, height: vb[3], style: 'fill:var(--folha)' }, c);
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var m = r[0].match(/^(.*?)\s*(é .*)$/) || [0, r[0], ''];
  el('text', { x: x + 16, y: y + 30, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, c).textContent = m[1];
  el('text', { x: x + 16, y: y + 60, style: 'font-size:24px;font-weight:700;fill:var(--ad-t)' }, c).textContent = m[2];
  r.slice(1).forEach(function (s, i) { el('text', { x: x + 16, y: y + 94 + 21 * i, style: 'font-size:14px;fill:var(--tinta)' }, c).textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    c.style.opacity = on ? Math.min(1, (t - TF) / .3).toFixed(2) : 0; c.style.display = on ? '' : 'none';
  };
}
var RESP = {
  'P433b120': ['Por isso a resposta é A', 'Só a cecília tem crânio:', 'uma caixa de osso em', 'volta do encéfalo.', '', 'Vasos, tubo digestório e', 'segmentação os dois têm;', 'cerdas, só a minhoca.']
};
VIS.def['cecilia-anfibio-apodo'] = {
  tit: 'Cecília: um anfíbio sem patas que parece minhoca',
  fontes: [
    'OpenStax, Biology 2e, 29.1 Chordates (craniados: crânio protegendo o encéfalo; vertebrados com coluna) — https://openstax.org/books/biology-2e/pages/29-1-chordates',
    'OpenStax, Biology 2e, 29.3 Amphibians (Apoda/Gymnophiona: cecílias sem patas, que cavam o solo) — https://openstax.org/books/biology-2e/pages/29-3-amphibians',
    'OpenStax, Biology 2e, 28.3 Lophotrochozoa — Annelida (metameria, cerdas, circulação fechada, gânglios cerebroides) — https://openstax.org/books/biology-2e/pages/28-3-superphylum-lophotrochozoa-flatworms-rotifers-and-nemerteans',
    'Wikipedia (en), Caecilian (crânio compacto e ossificado usado para escavar; anéis da pele) — https://en.wikipedia.org/wiki/Caecilian'
  ],
  tipo: 'anim', dur: 14,
  marcas: [[0, 'A cecília'], [4.5, 'Em comum'], [9.3, 'Só a cecília']],
  cred: 'Foto: "Siphonops annulatus.jpg", Andreas Schlüter, CC BY-SA 2.5, via Wikimedia Commons (recortada). Esquemas internos feitos para o app (fora de escala).',
  nota: 'Para separar vertebrado de anelídeo, procure o que um tem e o outro não: crânio (e coluna) só no vertebrado; cerdas só no anelídeo. Vasos, tubo digestório completo e segmentação existem nos dois.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    function p(d, st, pai) { return el('path', { d: d, style: st }, pai); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TUBO = '#c98a12', SANG = '#c0392b', NERV = '#2b6cb0', OSSO = '#d8c8a2', OSSOs = '#8a7650';
    var TX = 440, tT = tx(TX, 40, '', 'font-size:19px;font-weight:700;fill:var(--tinta)'), tL = [];
    for (var i = 0; i < 10; i++) tL.push(tx(TX, 70 + i * 21, '', 'font-size:14px;fill:var(--tinta)'));
    el('line', { x1: 424, x2: 424, y1: 20, y2: 330, style: 'stroke:var(--linha);stroke-width:1.2' });

    /* ===== 1. foto ===== */
    var PX = 14, PY = 26, PW = 396, PH = 297;
    var G1 = el('g', {});
    var defs = el('defs', {}, G1), cp = el('clipPath', { id: 'cec-clip' }, defs);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    el('image', { href: 'vis/cecilia-anfibio-apodo-1.webp', x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#cec-clip)' }, G1);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, G1);
    tx(PX, PY + PH + 18, 'Siphonops annulatus, uma cecília que vive no Brasil', 'font-size:13px;fill:var(--lapis)', G1);
    var MK = [[250, 34], [470, 232]].map(function (q, i) {
      var g = el('g', { transform: 'translate(' + (PX + q[0] * PW / 640).toFixed(1) + ' ' + (PY + q[1] * PH / 480).toFixed(1) + ')' }, G1);
      el('circle', { r: 12, style: 'fill:#fff;stroke:var(--ad-c);stroke-width:3' }, g);
      tx(0, 5, String(i + 1), 'font-size:14px;font-weight:800;fill:#14532d;text-anchor:middle', g);
      return g;
    });

    /* ===== 2 e 3. esquemas internos ===== */
    var G2 = el('g', {});
    /* minhoca */
    tx(16, 30, 'Minhoca (anelídeo)', 'font-size:14px;font-weight:700;fill:#9c4a4a', G2);
    p('M40 86 C40 64 56 56 80 56 L380 60 C398 60 408 70 408 84 C408 98 398 108 380 108 L80 112 C56 112 40 106 40 86 Z', 'fill:#e8b0a8;stroke:#9c4a4a;stroke-width:1.6', G2);
    var an = ''; for (var x = 70; x < 392; x += 14) an += 'M' + x + ' 58 V110 ';
    p(an, 'stroke:#b57a72;stroke-width:1', G2);
    var mGut = p('M44 86 H404', 'stroke:' + TUBO + ';stroke-width:5', G2);
    var mVaso = p('M60 66 H396', 'stroke:' + SANG + ';stroke-width:2.6', G2);
    var mSeg = p(an, 'stroke:#7a3a32;stroke-width:2', G2);
    var mGang = el('g', {}, G2);
    el('ellipse', { cx: 70, cy: 72, rx: 7, ry: 5, style: 'fill:' + NERV }, mGang);
    p('M70 76 C70 92 76 102 90 104 H396', 'fill:none;stroke:' + NERV + ';stroke-width:1.8', mGang);
    var mCerd = el('g', {}, G2);
    var cd = ''; for (x = 77; x < 392; x += 14) cd += 'M' + x + ' 110 l-3 7 M' + (x + 4) + ' 110 l3 7 ';
    p(cd, 'stroke:#5a2a22;stroke-width:1.4', mCerd);
    /* cecilia */
    tx(16, 164, 'Cecília (anfíbio, vertebrado)', 'font-size:14px;font-weight:700;fill:#33406b', G2);
    p('M28 218 C28 194 46 184 74 184 L380 186 C398 186 408 198 408 214 C408 230 398 240 380 240 L74 248 C46 248 28 240 28 218 Z', 'fill:#8d97b8;stroke:#33406b;stroke-width:1.6', G2);
    var an2 = ''; for (x = 104; x < 396; x += 12) an2 += 'M' + x + ' 186 V246 ';
    p(an2, 'stroke:#c9cfe2;stroke-width:1', G2);
    var cGut = p('M34 226 C60 230 80 230 100 228 H404', 'fill:none;stroke:' + TUBO + ';stroke-width:5', G2);
    var cVaso = p('M100 238 H396', 'stroke:' + SANG + ';stroke-width:2.6', G2);
    var cVert = el('g', {}, G2);
    for (x = 104; x < 396; x += 12) el('rect', { x: x - 5, y: 196, width: 10, height: 12, rx: 2, style: 'fill:' + OSSO + ';stroke:' + OSSOs + ';stroke-width:1' }, cVert);
    var cCran = el('g', {}, G2);
    p('M34 214 C34 196 48 188 70 188 C86 188 96 194 98 204 L98 222 C84 226 54 226 34 222 Z', 'fill:' + OSSO + ';stroke:' + OSSOs + ';stroke-width:2.2', cCran);
    el('ellipse', { cx: 72, cy: 206, rx: 18, ry: 10, style: 'fill:#e8a3b4;stroke:#a85a6e;stroke-width:1.2' }, cCran);
    p('M90 206 H104', 'stroke:#e8a3b4;stroke-width:4', cCran);
    el('circle', { cx: 44, cy: 202, r: 2.5, style: 'fill:#222' }, cCran);
    var dent = ''; for (x = 38; x < 66; x += 6) dent += 'M' + x + ' 222 l2 5 l2 -5 ';
    p(dent, 'fill:#fff;stroke:#555;stroke-width:.8', cCran);
    /* etiquetas */
    var L2 = el('g', {}, G2);
    tx(20, 276, 'Os dois têm: tubo digestório (boca → ânus),', 'font-size:13.5px;font-weight:700;fill:' + TUBO, L2);
    tx(20, 294, 'vasos sanguíneos e corpo em partes que se repetem.', 'font-size:13.5px;font-weight:700;fill:' + SANG, L2);
    var L3 = el('g', {}, G2);
    tx(110, 134, 'gânglios sem caixa; cerdas', 'font-size:13px;font-weight:700;fill:' + NERV, L3);
    p('M100 130 L74 80', 'stroke:var(--tinta);stroke-width:1', L3);
    tx(20, 272, 'CRÂNIO: caixa de osso', 'font-size:14px;font-weight:700;fill:' + OSSOs, L3);
    tx(20, 289, 'em volta do encéfalo', 'font-size:13px;fill:var(--lapis)', L3);
    p('M60 260 L62 226', 'stroke:var(--tinta);stroke-width:1', L3);
    tx(230, 272, 'vértebras: coluna', 'font-size:14px;font-weight:700;fill:' + OSSOs, L3);
    p('M260 260 L250 210', 'stroke:var(--tinta);stroke-width:1', L3);

    var TXT = [
      ['Parece minhoca, mas...', 'A cecília é um anfíbio', 'sem patas (ordem', 'Gymnophiona). Vive', 'enterrada no solo.', '1 anéis na pele, como os', '   de uma minhoca', '2 corpo longo, sem patas', '', 'Por fora engana. A', 'diferença está por dentro.'],
      ['O que os dois têm', 'Os dois têm:', '• tubo digestório completo', '   (boca numa ponta, ânus', '   na outra);', '• sangue em vasos;', '• corpo em partes que se', '   repetem (anéis da minhoca;', '   vértebras e músculos da', '   cecília).', 'Nada disso separa os dois.'],
      ['O que só a cecília tem', 'A cecília tem CRÂNIO: osso', 'em volta do encéfalo (ela', 'usa a cabeça dura para', 'cavar), e coluna de', 'vértebras.', 'A minhoca tem só gânglios', 'nervosos, sem caixa de', 'osso, e tem cerdas, que', 'nenhum vertebrado tem.']
    ];
    var T = [0, 4.5, 9.3];
    return fimLado(VIS.def['cecilia-anfibio-apodo'], svg, function (t) {
      var k = t < 4.5 ? 0 : t < 9.3 ? 1 : 2, u = t - T[k];
      tT.textContent = TXT[k][0];
      tL.forEach(function (e, i) { var s = TXT[k][i + 1] || ''; e.textContent = s; e.style.fontWeight = /^\d |CRÂNIO|Nada disso/.test(s) ? '700' : '400'; });
      vis(G1, k === 0 ? 1 : 0); vis(G2, k > 0 ? 1 : 0);
      if (k === 0) MK.forEach(function (m, i) { vis(m, cl((u - .4 - i * .6) / .3)); });
      var comum = k === 1 ? 1 : .3, so = k === 2 ? 1 : 0;
      [mGut, mVaso, mSeg, cGut, cVaso].forEach(function (e) { vis(e, k === 1 ? cl((u - .2) / .4) : comum); });
      vis(L2, k === 1 ? cl((u - .6) / .4) : 0);
      vis(mGang, k === 2 ? cl((u - .2) / .4) : .25); vis(mCerd, k === 2 ? cl((u - .2) / .4) : .25);
      vis(cCran, k === 2 ? cl((u - .5) / .4) : .25); vis(cVert, k === 2 ? cl((u - .8) / .4) : .25);
      vis(L3, so ? cl((u - 1) / .4) : 0);
    }, 14, RESP, qid, { congela: function () { return 13.9; } });
  }
};
VIS.liga('cecilia-anfibio-apodo', ['P433b120']);
