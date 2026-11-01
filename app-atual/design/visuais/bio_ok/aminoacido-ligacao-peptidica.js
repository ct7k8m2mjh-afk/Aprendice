/* Aminoacido: estrutura geral, radicais (apolar x polar x com carga), ligacao peptidica com saida de agua
   e a cadeia montada no ribossomo (traducao). */
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
'P5be1302': [
'Por isso a resposta é B',
'Alanina (CH₃) é apolar: não é R1 nem R2. A enzima do citosol (R2) faz',
'ligação de hidrogênio: precisa de H preso a O, e só a serina tem.',
'O antígeno de fora (R1) atrai o polo do COO⁻: é o aspartato.'
],
'Wce12a85': [
'Por isso a resposta é B',
'A proteína é a cadeia de aminoácidos unidos um a um por ligações',
'peptídicas: um polímero cuja unidade (monômero) é o aminoácido.'
],
'Wc8e9163': [
'Por isso a resposta é D',
'Carboxila de um aminoácido + amino do seguinte, com saída de H₂O:',
'essa ligação tem nome próprio, ligação peptídica. Ela é covalente,',
'mas "covalente" é só a família; o nome pedido é peptídica.'
],
'P6366dc2': [
'Por isso a resposta é B',
'Ligação peptídica só se forma entre aminoácidos, e quem a faz',
'na célula é o ribossomo, durante a tradução do RNA mensageiro.'
]
};
VIS.def['aminoacido-ligacao-peptidica'] = {
  tit: 'Aminoácido, radical R e ligação peptídica',
  fontes: ['OpenStax, Biology 2e, 3.4 Proteins — https://openstax.org/books/biology-2e/pages/3-4-proteins', 'OpenStax, Biology 2e, 15.5 Ribosomes and Protein Synthesis — https://openstax.org/books/biology-2e/pages/15-5-ribosomes-and-protein-synthesis', 'Khan Academy, Introduction to proteins and amino acids — https://www.khanacademy.org/science/biology/macromolecules/proteins-and-amino-acids/a/introduction-to-proteins-and-amino-acids', 'Wikipedia (en), Peptide bond — https://en.wikipedia.org/wiki/Peptide_bond'],
  tipo: 'anim', dur: 14,
  marcas: [[0, 'Aminoácido'], [3.4, 'Radicais'], [7, 'Ligação peptídica'], [10.6, 'Cadeia']],
  cred: 'Animação feita para o app (fórmulas simplificadas; esquema fora de escala). No pH da célula, amino e carboxila livres ficam ionizados (NH₃⁺ e COO⁻).',
  nota: 'Toda proteína é uma sequência de aminoácidos presos por ligações peptídicas, montada no ribossomo. O que muda de um aminoácido para outro é só o radical R, e é ele que decide se aquele trecho da proteína fica perto da água, faz ligação de hidrogênio ou atrai cargas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var AMI = '#2b6cb0', CAR = '#b4442f', RAD = '#2f855a', PEP = '#c47a12', APO = '#6b6b6b';
    var AT = 'font-size:19px;font-weight:700;fill:var(--tinta);text-anchor:middle';
    var LIG = 'stroke:var(--tinta);stroke-width:2;fill:none';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 3.4, T2 = 7, T3 = 10.6, TF = 14;

    /* ---------- etapa 1: um aminoacido grande ---------- */
    var g1 = el('g', {});
    el('rect', { x: 172, y: 84, width: 72, height: 38, rx: 9, style: 'fill:color-mix(in srgb,' + AMI + ' 12%,var(--folha));stroke:' + AMI + ';stroke-width:1.8' }, g1);
    el('rect', { x: 362, y: 30, width: 134, height: 92, rx: 10, style: 'fill:color-mix(in srgb,' + CAR + ' 10%,var(--folha));stroke:' + CAR + ';stroke-width:1.8' }, g1);
    el('circle', { cx: 300, cy: 172, r: 21, style: 'fill:color-mix(in srgb,' + RAD + ' 14%,var(--folha));stroke:' + RAD + ';stroke-width:1.8' }, g1);
    tx(208, 110, 'H₂N', AT, g1);
    el('path', { d: 'M246 104 H284 M316 104 H364 M300 116 V150 M300 92 V64 M376 90 V62 M384 90 V62 M396 104 H436', style: LIG }, g1);
    tx(300, 110, 'C', AT, g1); tx(380, 110, 'C', AT, g1); tx(300, 58, 'H', AT, g1); tx(380, 56, 'O', AT, g1); tx(464, 110, 'OH', AT, g1);
    tx(300, 179, 'R', 'font-size:19px;font-weight:700;fill:' + RAD + ';text-anchor:middle', g1);
    tx(208, 144, 'grupo amino', 'font-size:14px;font-weight:700;fill:' + AMI + ';text-anchor:middle', g1);
    tx(504, 60, 'carboxila', 'font-size:14px;font-weight:700;fill:' + CAR, g1);
    tx(504, 78, '(ácido)', 'font-size:13px;fill:' + CAR, g1);
    tx(262, 40, 'carbono α', 'font-size:13px;font-weight:600;fill:var(--lapis);text-anchor:end', g1);
    el('path', { d: 'M266 36 L292 94', style: 'stroke:var(--lapis);stroke-width:1' }, g1);
    tx(332, 170, 'radical R: a única parte', 'font-size:14px;font-weight:700;fill:' + RAD, g1);
    tx(332, 188, 'que muda entre os 20 aminoácidos', 'font-size:13px;fill:' + RAD, g1);

    /* ---------- etapa 2: tres radicais ---------- */
    var g2 = el('g', {});
    var CARDS = [
      { x: 12, nome: 'Alanina', r: 'CH₃', cor: APO, l: ['apolar', 'quase não interage', 'com a água'] },
      { x: 222, nome: 'Serina', r: 'CH₂–OH', cor: AMI, l: ['polar', 'H preso a O: faz', 'ligação de hidrogênio'] },
      { x: 432, nome: 'Aspartato', r: 'CH₂–COO⁻', cor: CAR, l: ['polar, com carga (−)', 'atrai polos e íons;', 'não tem H para doar'] }
    ];
    CARDS.forEach(function (k) {
      var cx = k.x + 98;
      el('rect', { x: k.x, y: 8, width: 196, height: 196, rx: 12, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, g2);
      tx(cx, 32, k.nome, 'font-size:16px;font-weight:700;fill:var(--tinta);text-anchor:middle', g2);
      tx(cx - 14, 66, 'H₂N–', 'font-size:15px;fill:var(--lapis);text-anchor:end', g2);
      tx(cx, 66, 'CH', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g2);
      tx(cx + 14, 66, '–COOH', 'font-size:15px;fill:var(--lapis)', g2);
      el('path', { d: 'M' + cx + ' 72 V88', style: 'stroke:var(--tinta);stroke-width:1.8' }, g2);
      el('rect', { x: cx - 52, y: 90, width: 104, height: 28, rx: 8, style: 'fill:color-mix(in srgb,' + k.cor + ' 14%,var(--folha));stroke:' + k.cor + ';stroke-width:1.6' }, g2);
      tx(cx, 110, k.r, 'font-size:16px;font-weight:700;fill:' + k.cor + ';text-anchor:middle', g2);
      k.l.forEach(function (s, i) { tx(cx, 144 + 19 * i, s, (i ? 'font-size:13.5px;fill:var(--tinta)' : 'font-size:14px;font-weight:700;fill:' + k.cor) + ';text-anchor:middle', g2); });
    });
    /* destaque do H ligado a O na serina */
    var hl = el('circle', { cx: 365, cy: 104, r: 15, style: 'fill:none;stroke:' + AMI + ';stroke-width:2;stroke-dasharray:4 3' }, g2);

    /* ---------- etapa 3: condensacao ---------- */
    var g3 = el('g', {});
    var lab1 = tx(150, 24, 'aminoácido 1', 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle', g3);
    var lab2 = tx(440, 24, 'aminoácido 2', 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle', g3);
    var labD = tx(300, 24, 'dipeptídeo', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3);
    /* aminoacido 1 (fixo) */
    tx(50, 116, 'H₂N', AT, g3);
    el('path', { d: 'M74 110 H106 M134 110 H176 M120 96 V74 M120 124 V144 M186 96 V72 M194 96 V72', style: LIG, }, g3);
    tx(120, 116, 'C', AT, g3); tx(120, 68, 'H', AT, g3); tx(190, 66, 'O', AT, g3); tx(190, 116, 'C', AT, g3);
    tx(120, 166, 'R₁', 'font-size:18px;font-weight:700;fill:' + RAD + ';text-anchor:middle', g3);
    var bOH = el('path', { d: 'M204 110 H226', style: LIG }, g3);
    /* aminoacido 2 (desliza para a esquerda) */
    var a2 = el('g', {}, g3);
    tx(350, 116, 'N', AT, a2); tx(350, 68, 'H', AT, a2);
    el('path', { d: 'M350 96 V74 M364 110 H406 M434 110 H476 M420 96 V74 M420 124 V144 M486 96 V72 M494 96 V72 M504 110 H530', style: LIG }, a2);
    tx(420, 116, 'C', AT, a2); tx(420, 68, 'H', AT, a2); tx(490, 116, 'C', AT, a2); tx(490, 66, 'O', AT, a2); tx(552, 116, 'OH', AT, a2);
    tx(420, 166, 'R₂', 'font-size:18px;font-weight:700;fill:' + RAD + ';text-anchor:middle', a2);
    var bH = el('path', { d: 'M320 110 H338', style: LIG }, a2);
    /* atomos que saem */
    var sOH = tx(0, 0, 'OH', 'font-size:19px;font-weight:700;fill:' + CAR + ';text-anchor:middle', g3);
    var sH = tx(0, 0, 'H', 'font-size:19px;font-weight:700;fill:' + AMI + ';text-anchor:middle', g3);
    var cOH = el('ellipse', { cx: 248, cy: 110, rx: 24, ry: 17, style: 'fill:none;stroke:' + CAR + ';stroke-width:1.8;stroke-dasharray:4 3' }, g3);
    var cH = el('ellipse', { cx: 310, cy: 110, rx: 16, ry: 17, style: 'fill:none;stroke:' + AMI + ';stroke-width:1.8;stroke-dasharray:4 3' }, g3);
    var agua = tx(560, 190, 'H₂O', 'font-size:20px;font-weight:700;fill:#2b6cb0;text-anchor:middle', g3);
    var aguaL = tx(560, 168, 'sai 1 água', 'font-size:13px;font-weight:600;fill:var(--lapis);text-anchor:middle', g3);
    var pep = el('path', { d: 'M204 110 H246', style: 'stroke:' + PEP + ';stroke-width:5;stroke-linecap:round' }, g3);
    var pepL = el('g', {}, g3);
    el('rect', { x: 166, y: 150, width: 128, height: 40, rx: 8, style: 'fill:color-mix(in srgb,' + PEP + ' 14%,var(--folha));stroke:' + PEP + ';stroke-width:1.6' }, pepL);
    tx(230, 168, 'ligação peptídica', 'font-size:13.5px;font-weight:700;fill:#8a560b;text-anchor:middle', pepL);
    tx(230, 184, 'C(O)–N(H)', 'font-size:13px;fill:#8a560b;text-anchor:middle', pepL);
    el('path', { d: 'M226 150 L226 120', style: 'stroke:' + PEP + ';stroke-width:1.4' }, pepL);

    /* ---------- etapa 4: cadeia no ribossomo ---------- */
    var g4 = el('g', {});
    el('path', { d: 'M40 182 H624', style: 'stroke:#8a5a9e;stroke-width:3' }, g4);
    tx(40, 202, 'RNA mensageiro', 'font-size:13px;font-weight:700;fill:#8a5a9e', g4);
    for (var k = 0; k < 18; k++) el('path', { d: 'M' + (60 + 32 * k) + ' 182 v8', style: 'stroke:#8a5a9e;stroke-width:1.6' }, g4);
    var ribo = el('g', {}, g4);
    el('ellipse', { cx: 0, cy: 112, rx: 48, ry: 40, style: 'fill:color-mix(in srgb,#8c7ab0 16%,transparent);stroke:#8c7ab0;stroke-width:2' }, ribo);
    el('ellipse', { cx: 0, cy: 176, rx: 44, ry: 17, style: 'fill:color-mix(in srgb,#8c7ab0 16%,transparent);stroke:#8c7ab0;stroke-width:2' }, ribo);
    tx(52, 82, 'ribossomo', 'font-size:13px;font-weight:700;fill:#6b5a92', ribo);
    var NB = 6, BX0 = 92, BDX = 76, BY = 118;
    var lig = [], bead = [], h2o = [];
    for (var i = 0; i < NB; i++) {
      if (i) lig.push(el('path', { d: 'M' + (BX0 + BDX * (i - 1) + 19) + ' ' + BY + ' H' + (BX0 + BDX * i - 19), style: 'stroke:' + PEP + ';stroke-width:4;stroke-linecap:round' }, g4));
      var b = el('g', {}, g4);
      el('circle', { cx: BX0 + BDX * i, cy: BY, r: 19, style: 'fill:color-mix(in srgb,' + RAD + ' 18%,var(--folha));stroke:' + RAD + ';stroke-width:1.8' }, b);
      tx(BX0 + BDX * i, BY + 5, 'aa' + (i + 1), 'font-size:13px;font-weight:700;fill:#22633f;text-anchor:middle', b);
      bead.push(b);
      if (i) h2o.push(tx(BX0 + BDX * i - BDX / 2, 0, 'H₂O', 'font-size:13px;font-weight:700;fill:#2b6cb0;text-anchor:middle', g4));
    }
    var cont = tx(20, 30, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', g4);
    var cont2 = tx(20, 50, '', 'font-size:14px;fill:var(--lapis)', g4);

    /* ---------- painel de texto ---------- */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. A peça da proteína: o aminoácido', 'Todo aminoácido tem um carbono α preso a um grupo amino (NH₂),', 'a uma carboxila (COOH), a um H e a um radical, o R.', 'Os 20 aminoácidos das proteínas diferem só no radical R.'],
      ['2. O radical decide o comportamento', 'Radical apolar (CH₃) quase não interage com a água; o polar interage.', 'Ligação de hidrogênio pede um H preso a O, N ou F: o OH da serina tem.', 'O COO⁻ do aspartato tem carga: atrai polos, mas não tem H para doar.'],
      ['3. Ligação peptídica: sai uma água', 'A carboxila de um aminoácido perde OH; o amino do seguinte perde H.', 'Os dois saem juntos como H₂O, e o C fica preso ao N: C(O)–N(H).', 'É uma ligação covalente, e o nome próprio dela é ligação peptídica.'],
      ['4. Repetindo a ligação, nasce a proteína', 'No ribossomo, durante a tradução do RNAm, os aminoácidos são unidos um a um.', 'Cada ligação libera 1 H₂O: n aminoácidos formam n − 1 ligações.', 'A cadeia é um polipeptídeo: proteína é um polímero de aminoácidos.']
    ];

    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(g1, f === 0 ? cl(t / .4) : 0); op(g2, f === 1 ? cl((t - T1) / .4) : 0); op(g3, f === 2 ? cl((t - T2) / .4) : 0); op(g4, f === 3 ? cl((t - T3) / .4) : 0);
      /* etapa 2: pisca o destaque do OH da serina */
      op(hl, f === 1 && t > T1 + 1.2 ? 1 : 0);
      /* etapa 3 */
      var u = ease((t - (T2 + .8)) / 1.2), dx = -90 * u;
      a2.setAttribute('transform', 'translate(' + dx.toFixed(1) + ' 0)');
      function curva(x0, y0, s) { var x1 = 552, y1 = 196, xc = (x0 + x1) / 2, yc = 236; var m = 1 - s; return [m * m * x0 + 2 * m * s * xc + s * s * x1, m * m * y0 + 2 * m * s * yc + s * s * y1]; }
      var pO = curva(248, 116, u), pH = curva(310, 116, u);
      sOH.setAttribute('x', (pO[0] - 14 * u).toFixed(1)); sOH.setAttribute('y', pO[1].toFixed(1));
      sH.setAttribute('x', (pH[0] + 14 * u).toFixed(1)); sH.setAttribute('y', pH[1].toFixed(1));
      var junta = u >= 1;
      op(sOH, junta ? 0 : 1); op(sH, junta ? 0 : 1); op(agua, junta ? 1 : 0); op(aguaL, junta ? 1 : 0);
      op(cOH, u < .05 && t > T2 + .4 ? 1 : 0); op(cH, u < .05 && t > T2 + .4 ? 1 : 0);
      op(bOH, u < .02 ? 1 : 0); op(bH, u < .02 ? 1 : 0);
      var pv = cl((t - (T2 + 2.1)) / .4); op(pep, pv); op(pepL, pv);
      op(lab1, 1 - u); op(lab2, 1 - u); op(labD, pv);
      /* etapa 4 */
      var tt = t - T3, n = Math.min(NB, 1 + Math.floor(tt / .45));
      if (f < 3) n = 1;
      bead.forEach(function (b, i) { op(b, i < n ? 1 : 0); });
      lig.forEach(function (l, i) { op(l, i + 1 < n ? 1 : 0); });
      h2o.forEach(function (w, i) { var t0 = (i + 1) * .45, v = cl((tt - t0) / .9); w.setAttribute('y', (BY - 28 - 24 * v).toFixed(1)); op(w, f === 3 && tt > t0 && v < 1 ? 1 - v : 0); });
      ribo.setAttribute('transform', 'translate(' + (BX0 + BDX * (n - 1) + 6) + ' 0)');
      cont.textContent = n + (n === 1 ? ' aminoácido · ' : ' aminoácidos · ') + (n - 1) + (n - 1 === 1 ? ' ligação peptídica' : ' ligações peptídicas');
      cont2.textContent = (n - 1) + (n - 1 === 1 ? ' molécula' : ' moléculas') + ' de água liberadas';
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j] || '';
    };
    return fimResposta(VIS.def['aminoacido-ligacao-peptidica'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'P5be1302' ? T2 - .3 : q === 'Wc8e9163' ? T3 - .3 : TF - .01; }
    });
  }
};
VIS.liga('aminoacido-ligacao-peptidica', ['P5be1302', 'Wce12a85', 'Wc8e9163', 'P6366dc2']);
