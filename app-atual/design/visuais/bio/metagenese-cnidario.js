/* Metagenese do cnidario (polipo e medusa sao diploides; so os gametas sao haploides) x partenogenese da abelha
   (zangao haploide). Usa a notacao da questao P269f729 (Santa Casa 2025): X = numero diploide, X/2 = haploide. */
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
  'P269f729': [
    'Por isso a resposta é A: X, X e X/2',
    'Pólipo e medusa são fases do corpo do cnidário: diploides (X).',
    'O zangão vem de óvulo não fecundado: haploide (X/2).'
  ]
};
VIS.def['metagenese-cnidario'] = {
  tit: 'Metagênese: pólipo e medusa são diploides; o zangão é haploide',
  fontes: [
    'OpenStax, Biology 2e, 28.2 Phylum Cnidaria (pólipo e medusa; brotamento; medusa forma gametas; larva plânula) — https://openstax.org/books/biology-2e/pages/28-2-phylum-cnidaria',
    'Wikipedia (en), Cnidaria — Life cycle (medusa e pólipo diploides; plânula) — https://en.wikipedia.org/wiki/Cnidaria',
    'Wikipedia (en), Haplodiploidy (zangão de óvulo não fecundado, haploide; fêmeas diploides) — https://en.wikipedia.org/wiki/Haplodiploidy'
  ],
  tipo: 'anim', dur: 12.4,
  marcas: [[0, '1. X = 2n'], [2.6, '2. Medusa'], [5.4, '3. Meiose'], [8.6, '4. Abelha']],
  cred: 'Esquema feito para o app (fora de escala), ciclo típico de um hidrozoário como a Obélia. X = número de cromossomos da célula diploide, como no enunciado.',
  nota: 'Na metagênese o que alterna é o modo de reproduzir (pólipo assexuado, medusa sexuada), não a ploidia: as duas formas são diploides e só os gametas são haploides. Já o zangão é o próprio óvulo não fecundado que se desenvolveu.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var DIP = '#2b6cb0', HAP = '#c26a12', CNI = '#d98fb0', CNIs = '#9c4a72';
    var S = { tit: 'font-size:17px;font-weight:700;fill:var(--tinta)', l: 'font-size:14.5px;fill:var(--tinta)', b: 'font-size:14px;font-weight:700;fill:var(--tinta)', m: 'font-size:13px;fill:var(--lapis)' };
    function chip(pai, x, y, hap) {
      var g = el('g', {}, pai), w = hap ? 44 : 30;
      el('rect', { x: x - w / 2, y: y - 12, width: w, height: 22, rx: 11, style: 'fill:' + (hap ? HAP : DIP) }, g);
      tx(x, y + 4, hap ? 'X/2' : 'X', 'font-size:14px;font-weight:700;fill:#fff;text-anchor:middle', g);
      return g;
    }
    function seta(pai, d, cor) { return el('path', { d: d, style: 'fill:none;stroke:' + (cor || 'var(--tinta)') + ';stroke-width:2;stroke-linecap:round;stroke-linejoin:round' }, pai); }
    /* ===== ciclo do cnidario ===== */
    var GC = el('g', {});
    tx(14, 22, 'Cnidário com metagênese', S.b, GC);
    /* polipo */
    var Pp = el('g', {}, GC);
    el('path', { d: 'M40 214 H92', style: 'stroke:#8a7a62;stroke-width:4' }, Pp);
    el('path', { d: 'M58 212 C56 190 52 170 54 150 L78 150 C80 170 76 190 74 212 Z', style: 'fill:' + CNI + ';stroke:' + CNIs + ';stroke-width:1.6' }, Pp);
    seta(Pp, 'M56 151 C48 140 44 132 40 124 M61 150 C58 138 58 130 56 120 M71 150 C74 138 74 130 76 120 M76 151 C84 140 88 132 92 124', CNIs);
    tx(66, 240, 'pólipo', S.b + ';text-anchor:middle', Pp);
    var cP = chip(GC, 106, 178, false);
    /* broto de medusa no polipo */
    var broto = el('ellipse', { cx: 82, cy: 176, rx: 7, ry: 5, style: 'fill:' + CNI + ';stroke:' + CNIs + ';stroke-width:1.2' }, GC);
    /* medusa */
    var Md = el('g', {}, GC);
    el('path', { d: 'M138 72 C138 40 202 40 202 72 C194 68 186 74 178 70 C170 74 162 68 154 72 C148 68 142 74 138 72 Z', style: 'fill:' + CNI + ';stroke:' + CNIs + ';stroke-width:1.6' }, Md);
    seta(Md, 'M146 73 C144 86 150 94 146 106 M160 73 C158 88 164 96 160 110 M180 73 C182 88 176 96 180 110 M194 73 C196 86 190 94 194 106', CNIs);
    tx(170, 128, 'medusa', S.b + ';text-anchor:middle', Md);
    var cM = chip(GC, 224, 56, false);
    /* gametas */
    var Gm = el('g', {}, GC);
    el('circle', { cx: 278, cy: 128, r: 11, style: 'fill:#f6e3b8;stroke:' + HAP + ';stroke-width:1.6' }, Gm);
    el('circle', { cx: 306, cy: 128, r: 4, style: 'fill:' + HAP }, Gm); seta(Gm, 'M310 128 C316 122 320 134 326 128', HAP);
    tx(298, 156, 'gametas', S.b + ';text-anchor:middle', Gm);
    var cG = chip(GC, 298, 104, true);
    /* zigoto e planula */
    var Zg = el('g', {}, GC);
    el('circle', { cx: 290, cy: 214, r: 12, style: 'fill:#f6e3b8;stroke:' + DIP + ';stroke-width:1.8' }, Zg);
    tx(290, 244, 'zigoto', S.b + ';text-anchor:middle', Zg);
    var cZ = chip(GC, 322, 212, false);
    var Pl = el('g', {}, GC);
    el('ellipse', { cx: 186, cy: 214, rx: 20, ry: 10, style: 'fill:#efc6d7;stroke:' + CNIs + ';stroke-width:1.4' }, Pl);
    var cil = ''; for (var i = 0; i < 14; i++) { var a = i / 14 * 2 * Math.PI; cil += 'M' + (186 + 20 * Math.cos(a)).toFixed(1) + ' ' + (214 + 10 * Math.sin(a)).toFixed(1) + ' l' + (4 * Math.cos(a)).toFixed(1) + ' ' + (4 * Math.sin(a)).toFixed(1) + ' '; }
    seta(Pl, cil, CNIs);
    tx(186, 244, 'larva plânula', S.b + ';text-anchor:middle', Pl);
    var cL = chip(GC, 186, 190, false);
    /* setas do ciclo */
    var A1 = el('g', {}, GC); seta(A1, 'M92 134 C100 100 116 80 132 74 m-10 -3 l10 3 l-7 8'); tx(14, 96, 'brota', S.m, A1); tx(14, 112, '(mitose)', S.m, A1);
    var A2 = el('g', {}, GC); seta(A2, 'M206 84 C236 90 258 100 268 112 m-2 -10 l2 10 l-10 -2'); tx(236, 84, 'meiose', 'font-size:13px;font-weight:700;fill:' + HAP, A2);
    var A3 = el('g', {}, GC); seta(A3, 'M296 162 V196 m-6 -8 l6 8 l6 -8'); tx(288, 184, 'fecundação', S.m + ';text-anchor:end', A3);
    var A4 = el('g', {}, GC); seta(A4, 'M274 216 H214 m8 -6 l-8 6 l8 6'); tx(244, 206, 'mitoses', S.m + ';text-anchor:middle', A4);
    var A5 = el('g', {}, GC); seta(A5, 'M164 216 C130 222 104 222 92 212 m3 -9 l-3 9 l9 1'); tx(128, 207, 'fixa-se', S.m + ';text-anchor:middle', A5);

    /* ===== abelha ===== */
    var GA = el('g', {});
    el('line', { x1: 346, x2: 346, y1: 14, y2: 250, style: 'stroke:var(--linha);stroke-width:1.2' }, GA);
    tx(360, 22, 'Abelha (partenogênese)', S.b, GA);
    function abelha(pai, x, y, s, rainha) {
      var g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')' }, pai);
      el('ellipse', { cx: -6, cy: -12, rx: 11, ry: 6, transform: 'rotate(-25 -6 -12)', style: 'fill:#e9f1f7;stroke:#9fb3c2;stroke-width:1' }, g);
      el('ellipse', { cx: 6, cy: -12, rx: 11, ry: 6, transform: 'rotate(25 6 -12)', style: 'fill:#e9f1f7;stroke:#9fb3c2;stroke-width:1' }, g);
      el('circle', { cx: -16, cy: 0, r: 6, style: 'fill:#3b2f22' }, g);
      el('ellipse', { cx: -4, cy: 0, rx: 8, ry: 7, style: 'fill:#6b4a1f' }, g);
      var L = rainha ? 22 : 15;
      el('ellipse', { cx: 4 + L / 1.4, cy: 1, rx: L, ry: 8, style: 'fill:#e0a526;stroke:#3b2f22;stroke-width:1' }, g);
      for (var k = 0; k < 3; k++) el('rect', { x: 8 + k * L * .45, y: -6, width: 4, height: 14, rx: 2, style: 'fill:#3b2f22' }, g);
      return g;
    }
    abelha(GA, 430, 62, 1.15, true); tx(500, 60, 'rainha', S.b, GA); var cR = chip(GA, 500 + 72, 55, false);
    var B1 = el('g', {}, GA);
    seta(B1, 'M470 78 V102 m-6 -8 l6 8 l6 -8'); tx(480, 96, 'meiose', 'font-size:13px;font-weight:700;fill:' + HAP, B1);
    el('circle', { cx: 470, cy: 118, r: 10, style: 'fill:#f6e3b8;stroke:' + HAP + ';stroke-width:1.6' }, B1);
    tx(486, 123, 'óvulo', S.b, B1); chip(B1, 552, 118, true);
    var B2 = el('g', {}, GA);
    seta(B2, 'M460 130 C440 150 420 160 410 170 m2 -10 l-2 10 l10 -2');
    tx(358, 150, 'fecundado', S.m, B2);
    abelha(B2, 395, 194, .95, false); tx(400, 224, 'fêmea', S.b + ';text-anchor:middle', B2); tx(400, 240, 'operária ou rainha', S.m + ';text-anchor:middle', B2); chip(B2, 446, 184, false);
    var B3 = el('g', {}, GA);
    seta(B3, 'M480 130 C500 150 520 160 530 170 m-10 -2 l10 2 l-2 -10');
    tx(520, 150, 'não fecundado', S.m, B3);
    abelha(B3, 540, 194, .95, false); tx(550, 224, 'zangão', 'font-size:15px;font-weight:700;fill:' + HAP + ';text-anchor:middle', B3); tx(550, 240, 'partenogênese', S.m + ';text-anchor:middle', B3); var cZa = chip(B3, 598, 184, true);

    /* texto de baixo */
    el('line', { x1: 14, x2: 626, y1: 262, y2: 262, style: 'stroke:var(--linha);stroke-width:1.2' });
    var tT = tx(14, 288, '', S.tit), t1 = tx(14, 312, '', S.l), t2 = tx(14, 334, '', S.l);
    /* legenda fixa */
    var LG = el('g', {});
    chip(LG, 380, 288, false); tx(400, 293, '= diploide (o "2n")', S.l, LG);
    chip(LG, 386, 322, true); tx(414, 327, '= haploide (o "n")', S.l, LG);

    var TXT = [
      ['Primeiro, a letra X', 'O enunciado chama de X o número', 'da célula diploide. Então X/2 é o gameta.'],
      ['Pólipo → medusa', 'O pólipo forma medusas por brotamento,', 'que é mitose: a medusa também tem X.'],
      ['Só aqui entra a meiose', 'A medusa faz meiose e forma gametas (X/2).', 'Zigoto, plânula e novo pólipo: X de novo.'],
      ['E o zangão?', 'Óvulo fecundado vira fêmea (X). O óvulo não', 'fecundado se desenvolve sozinho: zangão X/2.']
    ];
    var T = [0, 2.6, 5.4, 8.6];
    return fimResposta(VIS.def['metagenese-cnidario'], svg, function (t) {
      var k = t < 2.6 ? 0 : t < 5.4 ? 1 : t < 8.6 ? 2 : 3, u = t - T[k];
      tT.textContent = TXT[k][0]; t1.textContent = TXT[k][1]; t2.textContent = TXT[k][2];
      vis(LG, k === 0 ? 1 : 0);
      t1.setAttribute('x', 14); t2.setAttribute('x', 14);
      var on = function (e, v) { vis(e, v); };
      on(cP, k === 0 ? cl(u / .5) : 1);
      on(broto, k === 1 ? cl((u - .2) / .4) : k > 1 ? 1 : 0);
      on(A1, k >= 1 ? (k === 1 ? cl((u - .4) / .4) : 1) : 0);
      on(Md, k >= 1 ? (k === 1 ? cl((u - .8) / .4) : 1) : .12);
      on(cM, k >= 1 ? (k === 1 ? cl((u - 1.3) / .4) : 1) : 0);
      on(A2, k >= 2 ? (k === 2 ? cl((u - .1) / .4) : 1) : 0);
      on(Gm, k >= 2 ? (k === 2 ? cl((u - .4) / .4) : 1) : .12);
      on(cG, k >= 2 ? (k === 2 ? cl((u - .7) / .4) : 1) : 0);
      on(A3, k >= 2 ? (k === 2 ? cl((u - 1.1) / .4) : 1) : 0);
      on(Zg, k >= 2 ? (k === 2 ? cl((u - 1.4) / .4) : 1) : .12); on(cZ, k >= 2 ? (k === 2 ? cl((u - 1.6) / .4) : 1) : 0);
      on(A4, k >= 2 ? (k === 2 ? cl((u - 1.9) / .4) : 1) : 0);
      on(Pl, k >= 2 ? (k === 2 ? cl((u - 2.1) / .4) : 1) : .12); on(cL, k >= 2 ? (k === 2 ? cl((u - 2.3) / .4) : 1) : 0);
      on(A5, k >= 2 ? (k === 2 ? cl((u - 2.6) / .4) : 1) : 0);
      on(GA, k === 3 ? 1 : 0);
      if (k === 3) { vis(B1, cl((u - .3) / .4)); vis(B2, cl((u - 1) / .4)); vis(B3, cl((u - 1.7) / .4)); }
    }, 12.4, RESP, qid, { congela: function () { return 12.3; }, semEsmaecer: true, x: 14, y: 251, w: 612, h: 97 });
  }
};
VIS.liga('metagenese-cnidario', ['P269f729']);
