/* Quimica: aminoacido (amino, carboxila, carbono alfa, R), radicais (apolar x polar x com carga),
   ligacao peptidica glicina + alanina -> Gli-Ala + H2O e a hidrolise que devolve os aminoacidos.
   Adaptado do visual da Biologia (mesmo vid), com a etapa da hidrolise no lugar do ribossomo. */
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
'P143705b': ['Por isso a resposta é B',
'Sai o OH da carboxila de um aminoácido e um H do amino do outro:',
'formam H₂O, e o N se liga ao C da carboxila (ligação peptídica).'],
'P36f6bce': ['Por isso a resposta é E',
'A ligação peptídica é a C(=O)–N que une dois resíduos (seta 1).',
'N–Cα e Cα–C ficam dentro de um resíduo, e a seta 4 marca o C=O.'],
'P9b49bc8': ['Por isso a resposta é A',
'Gli-Ala: H₂N–CH₂–CO–NH–CH(CH₃)–COOH (glicina com o NH₂ livre).',
'Quebrar a ligação peptídica com água, ácido ou base e calor é hidrólise.'],
'P0b76d36': ['Por isso a resposta é B',
'Alanina (CH₃) é apolar: não é R1 nem R2. A enzima do citosol (R2) faz',
'ligação de hidrogênio: precisa de H preso a O, e só a serina tem.',
'O antígeno de fora (R1) atrai o polo do COO⁻: é o aspartato.']
};
VIS.def['aminoacido-ligacao-peptidica'] = {
  tit: 'Aminoácido, ligação peptídica e hidrólise',
  fontes: ['OpenStax, Biology 2e, 3.4 Proteins — https://openstax.org/books/biology-2e/pages/3-4-proteins', 'Khan Academy, Introduction to proteins and amino acids — https://www.khanacademy.org/science/biology/macromolecules/proteins-and-amino-acids/a/introduction-to-proteins-and-amino-acids', 'Wikipedia (en), Peptide bond (formação por condensação e hidrólise) — https://en.wikipedia.org/wiki/Peptide_bond', 'OpenStax, Chemistry 2e, 20.4 Amines and Amides (ligação amida) — https://openstax.org/books/chemistry-2e/pages/20-4-amines-and-amides'],
  tipo: 'anim', dur: 14,
  marcas: [[0, 'Aminoácido'], [3.4, 'Radicais'], [7, 'Peptídica'], [10.6, 'Hidrólise']],
  cred: 'Animação feita para o app (fórmulas estruturais planas, esquema fora de escala). Em água, amino e carboxila livres ficam ionizados (NH₃⁺ e COO⁻).',
  nota: 'A ligação peptídica (amida, C(=O)–N) se forma por condensação: sai o OH da carboxila de um aminoácido e um H do amino do outro, como H₂O. A hidrólise (água, com ácido ou base e calor) faz o caminho inverso e devolve os aminoácidos. O radical R decide como cada aminoácido interage.',
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
    var lab1 = tx(150, 24, 'glicina (R = H)', 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle', g3);
    var lab2 = tx(440, 24, 'alanina (R = CH₃)', 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle', g3);
    var labD = tx(300, 24, 'dipeptídeo Gli-Ala', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3);
    /* aminoacido 1 (fixo) */
    tx(50, 116, 'H₂N', AT, g3);
    el('path', { d: 'M74 110 H106 M134 110 H176 M120 96 V74 M120 124 V144 M186 96 V72 M194 96 V72', style: LIG, }, g3);
    tx(120, 116, 'C', AT, g3); tx(120, 68, 'H', AT, g3); tx(190, 66, 'O', AT, g3); tx(190, 116, 'C', AT, g3);
    tx(120, 166, 'H', 'font-size:18px;font-weight:700;fill:' + RAD + ';text-anchor:middle', g3);
    var bOH = el('path', { d: 'M204 110 H226', style: LIG }, g3);
    /* aminoacido 2 (desliza para a esquerda) */
    var a2 = el('g', {}, g3);
    tx(350, 116, 'N', AT, a2); tx(350, 68, 'H', AT, a2);
    el('path', { d: 'M350 96 V74 M364 110 H406 M434 110 H476 M420 96 V74 M420 124 V144 M486 96 V72 M494 96 V72 M504 110 H530', style: LIG }, a2);
    tx(420, 116, 'C', AT, a2); tx(420, 68, 'H', AT, a2); tx(490, 116, 'C', AT, a2); tx(490, 66, 'O', AT, a2); tx(552, 116, 'OH', AT, a2);
    tx(420, 166, 'CH₃', 'font-size:18px;font-weight:700;fill:' + RAD + ';text-anchor:middle', a2);
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
    tx(230, 184, 'C(=O)–NH', 'font-size:13px;fill:#8a560b;text-anchor:middle', pepL);
    el('path', { d: 'M226 150 L226 120', style: 'stroke:' + PEP + ';stroke-width:1.4' }, pepL);

    var dentro = tx(300, 206, '', 'font-size:14px;fill:var(--lapis);text-anchor:middle', g3);
    var hid = el('g', {}, g3);
    tx(560, 140, 'entra 1 água', 'font-size:13px;font-weight:600;fill:var(--lapis);text-anchor:middle', hid);
    /* ---------- painel de texto ---------- */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. A peça da proteína: o aminoácido', 'Todo aminoácido tem um carbono α preso a um grupo amino (NH₂),', 'a uma carboxila (COOH), a um H e a um radical, o R.', 'Os 20 aminoácidos das proteínas diferem só no radical R.'],
      ['2. O radical decide o comportamento', 'Radical apolar (CH₃) quase não interage com a água; o polar interage.', 'Ligação de hidrogênio pede um H preso a O, N ou F: o OH da serina tem.', 'O COO⁻ do aspartato tem carga: atrai polos, mas não tem H para doar.'],
      ['3. Ligação peptídica: sai uma água', 'A carboxila da glicina perde OH; o amino da alanina perde um H.', 'Os dois saem juntos como H₂O, e o C fica preso ao N: C(=O)–N(H).', 'Essa ligação (uma amida) une dois resíduos: Gli-Ala.'],
      ['4. Hidrólise: a água desfaz a ligação', 'Aquecido em ácido ou base forte, o peptídeo recebe H₂O: o OH volta ao C', 'da carbonila e o H volta ao N. Saem os aminoácidos de origem (Gli + Ala).', 'Desnaturação só desfaz a forma da proteína: não quebra essa ligação.']
    ];

    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(g1, f === 0 ? cl(t / .4) : 0); op(g2, f === 1 ? cl((t - T1) / .4) : 0); op(g3, f >= 2 ? cl((t - T2) / .4) : 0);
      /* etapa 2: pisca o destaque do OH da serina */
      op(hl, f === 1 && t > T1 + 1.2 ? 1 : 0);
      /* etapa 3 */
      var u = f < 3 ? ease((t - (T2 + .8)) / 1.2) : 1 - ease((t - (T3 + .8)) / 1.4), dx = -90 * u;
      a2.setAttribute('transform', 'translate(' + dx.toFixed(1) + ' 0)');
      function curva(x0, y0, s) { var x1 = 552, y1 = 196, xc = (x0 + x1) / 2, yc = 236; var m = 1 - s; return [m * m * x0 + 2 * m * s * xc + s * s * x1, m * m * y0 + 2 * m * s * yc + s * s * y1]; }
      var pO = curva(248, 116, u), pH = curva(310, 116, u);
      sOH.setAttribute('x', (pO[0] - 14 * u).toFixed(1)); sOH.setAttribute('y', pO[1].toFixed(1));
      sH.setAttribute('x', (pH[0] + 14 * u).toFixed(1)); sH.setAttribute('y', pH[1].toFixed(1));
      var junta = u >= 1;
      op(sOH, junta ? 0 : 1); op(sH, junta ? 0 : 1); op(agua, junta ? 1 : 0); op(aguaL, junta ? 1 : 0);
      op(cOH, u < .05 && t > T2 + .4 ? 1 : 0); op(cH, u < .05 && t > T2 + .4 ? 1 : 0);
      op(bOH, u < .02 ? 1 : 0); op(bH, u < .02 ? 1 : 0);
      var pv = f < 3 ? cl((t - (T2 + 2.1)) / .4) : u >= 1 ? 1 : 0; op(pep, pv); op(pepL, pv);
      dentro.textContent = f === 2 && t > T2 + 2.6 ? 'N–Cα e Cα–C ficam dentro de cada aminoácido; a peptídica une dois.' : f === 3 && u <= 0 ? 'hidrólise: voltam a glicina e a alanina' : '';
      op(hid, f === 3 && u > 0 && u < 1 ? 1 : 0);
      op(lab1, 1 - u); op(lab2, 1 - u); op(labD, f < 3 ? pv : u);
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j] || '';
    };
    return fimResposta(VIS.def['aminoacido-ligacao-peptidica'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'P0b76d36' ? T2 - .3 : q === 'P143705b' || q === 'P36f6bce' ? T3 - .3 : TF - .01; }
    });
  }
};
VIS.liga('aminoacido-ligacao-peptidica', ['P143705b', 'P36f6bce', 'P9b49bc8', 'P0b76d36']);
