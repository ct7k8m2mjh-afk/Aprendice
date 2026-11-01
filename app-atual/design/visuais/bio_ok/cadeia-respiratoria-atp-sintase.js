/* Cadeia respiratoria: complexos proteicos, eletrons de NADH/FADH2, bombeamento de H+, O2 aceptor final e ATP sintase. */
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
'Wc2ff30c': [
'Por isso a resposta é C',
'Os complexos I a IV, os citocromos e a ATP sintase são proteínas',
'encaixadas na membrana interna. Ferro e cobre só funcionam presos',
'a elas; açúcares e gorduras são o combustível, não a cadeia.'
],
'W12223ba': [
'Por isso a resposta é E',
'A respiração inteira rende cerca de 30 a 32 ATP por glicose.',
'Glicólise (2) e Krebs (2) fazem 4 ATP direto, sem o gradiente de H⁺.',
'Sobram 30 − 4 = 26 a 32 − 4 = 28 ATP: os da fosforilação oxidativa.'
],
'Wd006ac0': [
'Por isso a resposta é D (a incorreta)',
'Na respiração aeróbia quem recebe os elétrons no fim da cadeia é',
'o O₂, que vira água. Nitrogênio não é o aceptor final.',
'(Bactérias desnitrificantes usam nitrato, mas é respiração anaeróbia.)'
]
};
VIS.def['cadeia-respiratoria-atp-sintase'] = {
  tit: 'Cadeia respiratória e ATP sintase',
  fontes: ['OpenStax, Biology 2e, 7.4 Oxidative Phosphorylation — https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation', 'Khan Academy, Oxidative phosphorylation — https://www.khanacademy.org/science/biology/cellular-respiration-and-fermentation/oxidative-phosphorylation/a/oxidative-phosphorylation-etc', 'Wikipedia (en), Electron transport chain — https://en.wikipedia.org/wiki/Electron_transport_chain'],
  tipo: 'anim', dur: 13.2,
  marcas: [[0, 'Proteínas'], [3.2, 'Elétrons'], [6.6, 'H⁺ e O₂'], [9.8, 'ATP sintase']],
  cred: 'Animação feita para o app (esquema fora de escala; Q = ubiquinona, c = citocromo c). Rendimento pela contagem atual: cerca de 30 a 32 ATP por glicose na respiração toda.',
  nota: 'A cadeia não fabrica ATP diretamente: a energia dos elétrons é usada para bombear H⁺ para o espaço intermembranas, e é a volta desses H⁺ pela ATP sintase (quimiosmose) que junta ADP + Pᵢ. Sem O₂ no fim da fila, os elétrons param e a fosforilação oxidativa também.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var PRO = '#4f74b3', PRF = '#dfe8f6', ELE = '#d4a017', HH = '#b4442f', SIN = '#c47a12', MEM = '#e9c9b6';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.2, 6.6, 9.8], TF = 13.2;
    /* regioes */
    el('rect', { x: 0, y: 0, width: 640, height: 94, style: 'fill:color-mix(in srgb,#f4d9cb 45%,var(--folha))' });
    el('rect', { x: 0, y: 146, width: 640, height: 66, style: 'fill:color-mix(in srgb,#fbeee5 60%,var(--folha))' });
    tx(14, 22, 'espaço intermembranas', 'font-size:13.5px;font-weight:700;fill:#a0583d');
    tx(626, 204, 'matriz', 'font-size:13.5px;font-weight:700;fill:#a0583d;text-anchor:end');
    /* bicamada */
    el('rect', { x: 0, y: 98, width: 640, height: 44, style: 'fill:' + MEM });
    for (var x = 4; x < 640; x += 10) { el('circle', { cx: x, cy: 99, r: 4, style: 'fill:#c98f72' }); el('circle', { cx: x, cy: 141, r: 4, style: 'fill:#c98f72' }); }
    tx(626, 125, 'membrana interna', 'font-size:13px;font-weight:700;fill:#8e4a2e;text-anchor:end');
    /* complexos */
    function cx(x, y, w, h, rot) { el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:' + PRF + ';stroke:' + PRO + ';stroke-width:2' }); tx(x + w / 2, y + h / 2 + 6, rot, 'font-size:17px;font-weight:700;fill:#2c4a80;text-anchor:middle'); }
    cx(58, 78, 64, 96, 'I'); cx(140, 118, 44, 56, 'II'); cx(226, 82, 64, 86, 'III'); cx(336, 82, 60, 86, 'IV');
    el('circle', { cx: 204, cy: 120, r: 11, style: 'fill:#f2e2a6;stroke:#a88a1c;stroke-width:1.8' }); tx(204, 125, 'Q', 'font-size:13px;font-weight:700;fill:#6d5a10;text-anchor:middle');
    el('circle', { cx: 313, cy: 80, r: 11, style: 'fill:#f6d0c4;stroke:#a0583d;stroke-width:1.8' }); tx(313, 85, 'c', 'font-size:14px;font-weight:700;fill:#7a3f28;text-anchor:middle');
    /* ATP sintase */
    var gS = el('g', {});
    el('rect', { x: 452, y: 92, width: 50, height: 56, rx: 10, style: 'fill:#f3dcb4;stroke:' + SIN + ';stroke-width:2' }, gS);
    el('rect', { x: 472, y: 148, width: 10, height: 16, style: 'fill:#f3dcb4;stroke:' + SIN + ';stroke-width:1.6' }, gS);
    el('circle', { cx: 477, cy: 182, r: 22, style: 'fill:#f3dcb4;stroke:' + SIN + ';stroke-width:2' }, gS);
    var rotor = el('path', { d: 'M-12 0 H12 M0 -12 V12', style: 'stroke:' + SIN + ';stroke-width:3;stroke-linecap:round' }, gS);
    tx(510, 88, 'ATP sintase', 'font-size:13.5px;font-weight:700;fill:#8a560b', gS);
    /* rotulos de proteina (etapa 1) */
    var gP = el('g', {});
    tx(226, 46, 'todos são proteínas', 'font-size:14px;font-weight:700;fill:#2c4a80;text-anchor:middle', gP);
    tx(226, 62, '(citocromos têm heme com Fe)', 'font-size:13px;fill:#2c4a80;text-anchor:middle', gP);
    el('path', { d: 'M150 68 L100 78 M226 68 L250 82 M300 68 L352 82 M180 68 L168 116', style: 'stroke:#2c4a80;stroke-width:1.2' }, gP);
    /* NADH / FADH2 */
    var gN = el('g', {});
    tx(40, 196, 'NADH → NAD⁺', 'font-size:13.5px;font-weight:700;fill:#2b6cb0', gN);
    tx(128, 196, '', '', gN);
    var fad = tx(148, 196, 'FADH₂ → FAD', 'font-size:13.5px;font-weight:700;fill:#8a5a9e', gN);
    /* eletrons */
    var CAM = [[90, 170], [90, 128], [204, 120], [258, 125], [313, 80], [366, 125], [366, 168]];
    var CAM2 = [[164, 170], [162, 146], [204, 120]];
    var ele = [0, 1, 2].map(function () { return el('circle', { r: 5.5, style: 'fill:' + ELE + ';stroke:#8a6a0f;stroke-width:1' }); });
    var ele2 = el('circle', { r: 5.5, style: 'fill:' + ELE + ';stroke:#8a6a0f;stroke-width:1' });
    function aoLongo(C, u) { var n = C.length - 1, s = u * n, i = Math.min(n - 1, Math.floor(s)), v = s - i; return [lerp(C[i][0], C[i + 1][0], v), lerp(C[i][1], C[i + 1][1], v)]; }
    var eL = tx(232, 196, 'e⁻', 'font-size:14px;font-weight:700;fill:#8a6a0f');
    /* H+ bombeados */
    var HP = [];
    var FONTE = [90, 258, 366];
    for (var k = 0; k < 12; k++) HP.push(tx(0, 0, 'H⁺', 'font-size:13.5px;font-weight:700;fill:' + HH + ';text-anchor:middle'));
    var DEST = [[40, 50], [76, 40], [112, 52], [150, 42], [186, 54], [222, 42], [294, 50], [330, 40], [404, 46], [430, 36], [252, 62], [196, 68]];
    var o2 = tx(254, 196, '½ O₂ + 2 H⁺ + 2 e⁻ → H₂O', 'font-size:13.5px;font-weight:700;fill:#2b6cb0');
    var ace = tx(366, 64, '', 'font-size:13px;font-weight:700;fill:#2b6cb0;text-anchor:middle');
    /* volta do H+ pela sintase e ATP */
    var HV = [0, 1, 2].map(function () { return tx(0, 0, 'H⁺', 'font-size:13.5px;font-weight:700;fill:' + HH + ';text-anchor:middle'); });
    var atp = tx(508, 186, 'ADP + Pᵢ → ATP', 'font-size:14px;font-weight:700;fill:#8a560b');
    var atpC = [0, 1, 2].map(function () { return tx(0, 0, 'ATP', 'font-size:13px;font-weight:700;fill:#8a560b;text-anchor:middle'); });
    var cont = tx(626, 22, '', 'font-size:14px;font-weight:700;fill:#8a560b;text-anchor:end');
    var cont2 = tx(626, 40, '', 'font-size:13px;fill:#8a560b;text-anchor:end');
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. Quem faz a cadeia: proteínas', 'Na membrana interna da mitocôndria (cristas) ficam os complexos I a IV', 'e a ATP sintase: todos são proteínas. Os citocromos são proteínas', 'com heme; o ferro do heme recebe e passa o elétron.'],
      ['2. Os elétrons descem de proteína em proteína', 'NADH entrega elétrons ao complexo I; FADH₂, ao complexo II.', 'Eles passam por Q, III, citocromo c e IV, sempre para quem', 'tem mais afinidade por elétrons, liberando energia aos poucos.'],
      ['3. H⁺ bombeado e O₂ no fim da fila', 'Com essa energia, I, III e IV bombeiam H⁺ da matriz para o espaço', 'intermembranas. No complexo IV, o O₂ é o aceptor final: recebe os', 'elétrons e H⁺ e vira água. Sem O₂, a cadeia para.'],
      ['4. ATP sintase: a volta do H⁺ faz ATP', 'O H⁺ acumulado volta para a matriz pela ATP sintase, que gira e junta', 'ADP + Pᵢ (quimiosmose). Assim saem cerca de 26 a 28 ATP por glicose:', 'quase todo o ATP da respiração (30 a 32 no total).']
    ];
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3;
      op(gP, f === 0 ? cl(t / .4) : 0);
      op(gN, f >= 1 ? 1 : .0); op(eL, 0); eL.setAttribute('x', 268); eL.setAttribute('y', 150);
      /* eletrons percorrendo */
      ele.forEach(function (e, i) {
        var w = ((t - T[1]) / 2.4 - i / 3) % 1; if (w < 0) w += 1;
        var p = aoLongo(CAM, w); e.setAttribute('cx', p[0].toFixed(1)); e.setAttribute('cy', p[1].toFixed(1));
        op(e, f >= 1 && f < 3 && t > T[1] + i * .8 ? 1 : 0);
      });
      var w2 = ((t - T[1] - .4) / 1.4) % 1; if (w2 < 0) w2 += 1; var q = aoLongo(CAM2, w2);
      ele2.setAttribute('cx', q[0].toFixed(1)); ele2.setAttribute('cy', q[1].toFixed(1)); op(ele2, f >= 1 && f < 3 && t > T[1] + .4 ? 1 : 0);
      /* H+ bombeados (acumulam) */
      HP.forEach(function (h, k) {
        var t0 = T[2] + .2 + k * .22, u = ease((t - t0) / .6), src = FONTE[k % 3];
        h.setAttribute('x', lerp(src, DEST[k][0], u).toFixed(1)); h.setAttribute('y', lerp(160, DEST[k][1], u).toFixed(1));
        op(h, f >= 2 && t > t0 ? 1 : 0);
      });
      op(o2, f === 2 && t > T[2] + 1.2 ? 1 : 0);
      ace.textContent = f === 2 && t > T[2] + 1.2 ? '' : '';
      /* volta do H+ pela sintase */
      HV.forEach(function (h, i) {
        var w = ((t - T[3]) / 1.2 - i / 3) % 1; if (w < 0) w += 1;
        h.setAttribute('x', 477); h.setAttribute('y', lerp(62, 168, w).toFixed(1)); op(h, f === 3 ? (w < .9 ? 1 : 0) : 0);
      });
      rotor.setAttribute('transform', 'translate(477 182) rotate(' + (f === 3 ? (t - T[3]) * 240 : 0).toFixed(1) + ')');
      op(atp, f === 3 ? 1 : 0);
      atpC.forEach(function (a, i) { var w = ((t - T[3] - .4) / 1.5 - i / 3) % 1; if (w < 0) w += 1; a.setAttribute('x', (540 + 28 * i).toFixed(0)); a.setAttribute('y', lerp(168, 150, w).toFixed(1)); op(a, 0); });
      var k = f === 3 ? cl((t - T[3] - .3) / 2.6) : 0;
      cont.textContent = f === 3 ? (k < 1 ? 'ATP por glicose: ' + Math.round(26 * k) : 'ATP por glicose: 26 a 28') : '';
      cont2.textContent = f === 3 && k >= 1 ? '(30 a 32 no total − 4 diretos)' : '';
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['cadeia-respiratoria-atp-sintase'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'Wc2ff30c' ? T[1] - .2 : q === 'Wd006ac0' ? T[3] - .2 : TF - .01; }
    });
  }
};
VIS.liga('cadeia-respiratoria-atp-sintase', ['Wc2ff30c', 'W12223ba', 'Wd006ac0']);
