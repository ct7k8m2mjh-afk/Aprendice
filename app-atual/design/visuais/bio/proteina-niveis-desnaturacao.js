/* Proteina: estrutura primaria, secundaria, terciaria, quaternaria e desnaturacao (perde a forma 3D, mantem a sequencia). */
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
'Webf7c27': [
'Por isso a resposta é D',
'O gene de cada pessoa dita a ordem dos aminoácidos (estrutura primária).',
'Essa ordem define como a cadeia dobra, e a forma define a função:',
'por isso a E erra ao dizer que a forma não interfere na função.'
],
'Wd7c0316': [
'Por isso a resposta é A (a incorreta)',
'Cadeia de aminoácidos é peptídeo (curta) ou polipeptídeo (longa).',
'Polinucleotídeo é cadeia de nucleotídeos: o DNA ou o RNA.',
'As outras frases são verdadeiras.'
]
};
VIS.def['proteina-niveis-desnaturacao'] = {
  tit: 'Proteína: quatro níveis de forma e a desnaturação',
  fontes: ['OpenStax, Biology 2e, 3.4 Proteins — https://openstax.org/books/biology-2e/pages/3-4-proteins', 'Khan Academy, Orders of protein structure — https://www.khanacademy.org/science/biology/macromolecules/proteins-and-amino-acids/a/orders-of-protein-structure', 'Wikipedia (en), Denaturation (biochemistry) — https://en.wikipedia.org/wiki/Denaturation_(biochemistry)'],
  tipo: 'anim', dur: 15.4,
  marcas: [[0, 'Primária'], [3.2, 'Secundária'], [6.4, 'Terciária'], [9.6, 'Quaternária'], [12.4, 'Desnaturação']],
  cred: 'Animação feita para o app (esquema fora de escala; cada bolinha é um aminoácido, numerado na ordem da cadeia).',
  nota: 'Quem decide a forma é a sequência de aminoácidos, que vem do gene. A desnaturação (calor, pH, solventes) rompe as interações fracas que seguram a forma 3D, mas não quebra as ligações peptídicas: a sequência continua a mesma, e a proteína perde a função porque perdeu a forma.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var PEP = '#c47a12', HB = '#2b6cb0';
    var TIP = ['#8a8a8a', '#2b6cb0', '#b4442f', '#c9a227'];   /* apolar, polar, com carga, cisteina */
    var SEQ = [3, 1, 0, 1, 2, 1, 0, 0, 3, 1, 2, 0, 2, 1];
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.2, 6.4, 9.6, 12.4], TF = 15.4;
    var N = 14;
    var LIN = [], FOL = [[262, 70], [292, 58], [322, 62], [350, 74], [362, 102], [340, 122], [310, 116], [284, 104], [262, 124], [270, 152], [300, 160], [330, 152], [358, 150], [384, 130]];
    var DEN = [[110, 92], [140, 106], [166, 88], [196, 100], [222, 122], [252, 114], [278, 92], [308, 98], [332, 122], [360, 130], [386, 110], [416, 102], [444, 120], [472, 110]];
    for (var i = 0; i < N; i++) LIN.push([96 + 34 * i, 112]);

    /* ---------- primaria: gene -> RNAm -> sequencia ---------- */
    var gP = el('g', {});
    [['gene (DNA)', 150], ['RNAm', 320], ['ordem dos aminoácidos', 490]].forEach(function (k, i) {
      tx(k[1], 44, k[0], 'font-size:14px;font-weight:700;fill:' + (i === 2 ? 'var(--tinta)' : '#8a5a9e') + ';text-anchor:middle', gP);
    });
    el('path', { d: 'M200 40 H272 m-7 -5 l7 5 l-7 5 M360 40 H400 m-7 -5 l7 5 l-7 5', style: 'fill:none;stroke:var(--lapis);stroke-width:1.6' }, gP);
    tx(236, 64, 'transcrição', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gP); tx(380, 64, 'tradução', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gP);
    el('path', { d: 'M215 114 V150', style: 'stroke:' + PEP + ';stroke-width:1.2' }, gP);
    tx(215, 166, 'ligação peptídica', 'font-size:13px;font-weight:700;fill:#8a560b;text-anchor:middle', gP);
    tx(330, 166, 'poucos aminoácidos: peptídeo', 'font-size:13.5px;fill:var(--tinta)', gP);
    tx(330, 184, 'muitos: polipeptídeo (proteína)', 'font-size:13.5px;fill:var(--tinta)', gP);
    tx(96, 146, 'N-terminal', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gP);
    tx(538, 140, 'C-terminal', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gP);

    /* ---------- secundaria: alfa-helice e folha beta ---------- */
    var gS = el('g', {});
    var dh = '', k;
    for (k = 0; k <= 160; k += 2) { var a = k / 160 * 5 * 2 * Math.PI; dh += (k ? 'L' : 'M') + (80 + k + 12 * Math.sin(a)).toFixed(1) + ' ' + (110 + 34 * Math.cos(a)).toFixed(1) + ' '; }
    el('path', { d: dh, style: 'fill:none;stroke:#b4442f;stroke-width:4;stroke-linecap:round' }, gS);
    for (k = 0; k < 4; k++) el('path', { d: 'M' + (96 + 32 * k) + ' 80 L' + (128 + 32 * k) + ' 140', style: 'stroke:' + HB + ';stroke-width:1.6;stroke-dasharray:3 3' }, gS);
    tx(160, 40, 'α-hélice', 'font-size:16px;font-weight:700;fill:#b4442f;text-anchor:middle', gS);
    tx(160, 176, 'a cadeia enrola', 'font-size:13.5px;fill:var(--tinta);text-anchor:middle', gS);
    [0, 1, 2].forEach(function (j) {
      var y = 72 + 38 * j, d = 'M370 ' + y; for (var x = 380; x <= 540; x += 20) d += ' L' + x + ' ' + (y + ((x / 20) % 2 ? 6 : -6));
      el('path', { d: d, style: 'fill:none;stroke:#2f855a;stroke-width:4;stroke-linejoin:round' }, gS);
      el('path', { d: 'M540 ' + (y - 9) + ' L556 ' + y + ' L540 ' + (y + 9) + ' Z', style: 'fill:#2f855a' }, gS);
      if (j < 2) for (var x2 = 390; x2 <= 530; x2 += 40) el('path', { d: 'M' + x2 + ' ' + (y + 8) + ' V' + (y + 30), style: 'stroke:' + HB + ';stroke-width:1.6;stroke-dasharray:3 3' }, gS);
    });
    tx(462, 40, 'folha β', 'font-size:16px;font-weight:700;fill:#2f855a;text-anchor:middle', gS);
    tx(462, 176, 'trechos lado a lado', 'font-size:13.5px;fill:var(--tinta);text-anchor:middle', gS);
    el('path', { d: 'M262 196 H290', style: 'stroke:' + HB + ';stroke-width:1.8;stroke-dasharray:3 3' }, gS);
    tx(298, 201, 'ligação de hidrogênio', 'font-size:13.5px;font-weight:700;fill:' + HB, gS);

    /* ---------- cadeia de bolinhas (primaria, terciaria, desnaturacao) ---------- */
    var gC = el('g', {});
    var lig = [], bol = [];
    for (i = 1; i < N; i++) lig.push(el('line', { style: 'stroke:' + PEP + ';stroke-width:3.5;stroke-linecap:round' }, gC));
    for (i = 0; i < N; i++) {
      var b = el('g', {}, gC);
      el('circle', { r: 12.5, style: 'fill:color-mix(in srgb,' + TIP[SEQ[i]] + ' 22%,var(--folha));stroke:' + TIP[SEQ[i]] + ';stroke-width:2' }, b);
      tx(0, 4.6, String(i + 1), 'font-size:13px;font-weight:700;fill:var(--tinta);text-anchor:middle', b);
      bol.push(b);
    }
    /* interacoes da terciaria */
    var gT = el('g', {});
    el('path', { d: 'M252 80 Q238 97 252 114', style: 'fill:none;stroke:#c9a227;stroke-width:3;stroke-dasharray:5 3' }, gT);
    el('path', { d: 'M304 172 Q332 192 356 162', style: 'fill:none;stroke:#b4442f;stroke-width:2.5;stroke-dasharray:4 3' }, gT);
    el('path', { d: 'M298 47 Q322 26 346 62', style: 'fill:none;stroke:' + HB + ';stroke-width:2;stroke-dasharray:3 3' }, gT);
    tx(30, 70, 'ponte S–S', 'font-size:13.5px;font-weight:700;fill:#9a7a12', gT);
    tx(30, 88, '(entre cisteínas)', 'font-size:13px;fill:#9a7a12', gT);
    el('path', { d: 'M138 76 L238 96', style: 'stroke:#c9a227;stroke-width:1' }, gT);
    tx(30, 140, 'apolares', 'font-size:13.5px;font-weight:700;fill:#6b6b6b', gT);
    tx(30, 158, 'no interior', 'font-size:13px;fill:#6b6b6b', gT);
    el('path', { d: 'M108 136 L272 108', style: 'stroke:#6b6b6b;stroke-width:1' }, gT);
    tx(430, 50, 'ligação de hidrogênio', 'font-size:13.5px;font-weight:700;fill:' + HB, gT);
    el('path', { d: 'M428 46 L336 40', style: 'stroke:' + HB + ';stroke-width:1' }, gT);
    tx(430, 186, 'atração entre cargas', 'font-size:13.5px;font-weight:700;fill:#b4442f', gT);
    el('path', { d: 'M428 182 L346 180', style: 'stroke:#b4442f;stroke-width:1' }, gT);
    /* ---------- quaternaria ---------- */
    var gQ = el('g', {});
    var SUB = [[220, 64, '#b4442f', 'α'], [380, 64, '#2b6cb0', 'β'], [220, 150, '#2b6cb0', 'β'], [380, 150, '#b4442f', 'α']];
    SUB.forEach(function (s) {
      var d = ''; FOL.forEach(function (p, j) { d += (j ? 'L' : 'M') + (s[0] + (p[0] - 323) * .62).toFixed(1) + ' ' + (s[1] + (p[1] - 110) * .62).toFixed(1) + ' '; });
      el('ellipse', { cx: s[0], cy: s[1], rx: 66, ry: 40, style: 'fill:color-mix(in srgb,' + s[2] + ' 13%,var(--folha));stroke:' + s[2] + ';stroke-width:1.8' }, gQ);
      el('path', { d: d, style: 'fill:none;stroke:' + s[2] + ';stroke-width:3;stroke-linejoin:round' }, gQ);
      tx(s[0] + (s[0] < 300 ? -78 : 78), s[1] + 6, s[3], 'font-size:18px;font-weight:700;fill:' + s[2] + ';text-anchor:middle', gQ);
    });
    SUB.forEach(function (s) { el('circle', { cx: s[0] + 30, cy: s[1] - 14, r: 6, style: 'fill:#9a2d22' }, gQ); });
    tx(476, 152, '1 heme por cadeia', 'font-size:14px;font-weight:700;fill:#9a2d22', gQ);
    tx(476, 96, 'hemoglobina:', 'font-size:14px;font-weight:700;fill:var(--tinta)', gQ);
    tx(476, 114, '4 cadeias', 'font-size:14px;fill:var(--tinta)', gQ);
    tx(476, 132, '(2 α + 2 β)', 'font-size:14px;fill:var(--tinta)', gQ);

    /* ---------- desnaturacao ---------- */
    var gD = el('g', {});
    for (k = 0; k < 4; k++) el('path', { d: 'M' + (520 + 16 * k) + ' 186 q-6 -10 0 -20 q6 -10 0 -20 q-6 -10 0 -20', style: 'fill:none;stroke:#c0392b;stroke-width:2' }, gD);
    tx(548, 60, 'calor', 'font-size:14px;font-weight:700;fill:#c0392b;text-anchor:middle', gD);
    tx(548, 78, 'ou pH', 'font-size:14px;font-weight:700;fill:#c0392b;text-anchor:middle', gD);
    tx(110, 170, 'sequência 1 → 14 igual: as ligações peptídicas ficam', 'font-size:14px;font-weight:700;fill:#8a560b', gD);
    tx(110, 192, 'a forma 3D se desfaz: a proteína perde a função', 'font-size:14px;font-weight:700;fill:#c0392b', gD);

    /* ---------- painel ---------- */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. Primária: a ordem dos aminoácidos', 'É a sequência da cadeia, unida por ligações peptídicas.', 'Quem dita essa ordem é o gene de cada indivíduo (DNA → RNAm → proteína).', 'Cadeia curta: peptídeo; longa: polipeptídeo. Nucleotídeo é outra coisa.'],
      ['2. Secundária: hélices e folhas', 'Trechos da cadeia se enrolam (α-hélice) ou ficam lado a lado (folha β).', 'Quem segura são ligações de hidrogênio entre os átomos do esqueleto', '(o C=O de um aminoácido e o N–H de outro).'],
      ['3. Terciária: a forma 3D da cadeia', 'A cadeia inteira dobra conforme seus radicais: apolares para dentro,', 'atração entre cargas, ligações de H e pontes S–S entre cisteínas.', 'Essa forma cria, por exemplo, o sítio ativo de uma enzima.'],
      ['4. Quaternária: várias cadeias juntas', 'Algumas proteínas têm mais de uma cadeia. A hemoglobina tem 4:', '2 cadeias α e 2 cadeias β, cada uma com seu grupo heme.', 'Trocar um só aminoácido da β muda a forma (anemia falciforme).'],
      ['5. Desnaturação: perde a forma, não a sequência', 'Calor, pH extremo ou solventes rompem as interações fracas da forma 3D.', 'As ligações peptídicas não se rompem: a ordem 1 → 14 é a mesma.', 'Sem a forma, a proteína para de funcionar (a clara do ovo cozida).']
    ];
    function pos(i, t) {
      if (t < T[2]) return LIN[i];
      if (t < T[3]) { var u = ease((t - T[2] - .2) / 1.3); return [lerp(LIN[i][0], FOL[i][0], u), lerp(LIN[i][1], FOL[i][1], u)]; }
      var v = ease((t - T[4] - .2) / 1.0); return [lerp(FOL[i][0], DEN[i][0], v), lerp(FOL[i][1], DEN[i][1], v)];
    }
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : t < T[4] ? 3 : 4;
      var ent = cl((t - T[f]) / .4);
      op(gP, f === 0 ? ent : 0); op(gS, f === 1 ? ent : 0); op(gQ, f === 3 ? ent : 0);
      op(gC, f === 0 || f === 2 || f === 4 ? ent : 0);
      op(gT, f === 2 ? cl((t - T[2] - 1.6) / .5) : 0);
      op(gD, f === 4 ? cl((t - T[4] - 1.3) / .4) : 0);
      var p = []; for (var i = 0; i < N; i++) { p.push(pos(i, t)); bol[i].setAttribute('transform', 'translate(' + p[i][0].toFixed(1) + ' ' + p[i][1].toFixed(1) + ')'); }
      lig.forEach(function (l, i) { l.setAttribute('x1', p[i][0].toFixed(1)); l.setAttribute('y1', p[i][1].toFixed(1)); l.setAttribute('x2', p[i + 1][0].toFixed(1)); l.setAttribute('y2', p[i + 1][1].toFixed(1)); });
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['proteina-niveis-desnaturacao'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return T[1] - .2; }
    });
  }
};
VIS.liga('proteina-niveis-desnaturacao', ['Webf7c27', 'Wd7c0316']);
