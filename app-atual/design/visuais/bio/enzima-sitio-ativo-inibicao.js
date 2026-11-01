/* Enzima: sitio ativo reconhece o substrato pela forma; inibidor competitivo de forma parecida ocupa a vaga. */
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
'W46018a1': [
'Por isso a resposta é B',
'Só entra no sítio ativo a molécula de forma complementar a ele.',
'O inibidor imita a forma espacial do substrato, ocupa a vaga',
'e o substrato fica de fora: a reação não acontece.'
],
'Wb791992': [
'Por isso a resposta é B',
'A enzima reconhece o substrato pelo encaixe das formas: só a molécula',
'de forma tridimensional complementar entra no sítio ativo.',
'Temperatura e minerais são iguais para todas as moléculas do meio.'
]
};
VIS.def['enzima-sitio-ativo-inibicao'] = {
  tit: 'Sítio ativo: encaixe pela forma e inibição competitiva',
  fontes: ['OpenStax, Biology 2e, 6.5 Enzymes — https://openstax.org/books/biology-2e/pages/6-5-enzymes', 'Khan Academy, Enzyme regulation (competitive inhibition) — https://www.khanacademy.org/science/biology/energy-and-enzymes/enzyme-regulation/a/enzyme-regulation', 'Wikipedia (en), Competitive inhibition — https://en.wikipedia.org/wiki/Competitive_inhibition'],
  tipo: 'anim', dur: 13.8,
  marcas: [[0, 'Encaixe'], [3.6, 'Reação'], [7, 'Inibidor'], [10.6, 'Competição']],
  cred: 'Animação feita para o app (formas simplificadas; esquema fora de escala). No modelo do encaixe induzido o sítio ativo ainda se ajusta um pouco ao substrato.',
  nota: 'A enzima não escolhe pelo que a molécula faz, e sim pela forma: o sítio ativo só acomoda quem tem formato e cargas complementares. Um inibidor competitivo copia essa forma e disputa a vaga com o substrato; a enzima continua inteira (não é desnaturação).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y, r) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' + (r ? ' rotate(' + r.toFixed(1) + ')' : '')); }
    function caminho(t, t0, t1, a, b) { var u = ease((t - t0) / (t1 - t0)); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }
    var ENZ = '#2f855a', SUB = '#d26a3a', INI = '#8a5a9e', OUT = '#7a7a7a';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.6, 7, 10.6], TF = 13.8, SEAT = [320, 120];
    /* enzima com o sitio ativo (bolso em V) */
    el('path', { d: 'M170 110 H290 V120 L320 146 L350 120 V110 H470 C520 110 540 140 526 172 C512 200 420 202 320 202 C220 202 128 200 114 172 C100 140 120 110 170 110 Z', style: 'fill:color-mix(in srgb,' + ENZ + ' 16%,var(--folha));stroke:' + ENZ + ';stroke-width:2.4' });
    tx(320, 182, 'enzima', 'font-size:16px;font-weight:700;fill:#22633f;text-anchor:middle');
    var siti = el('g', {});
    tx(150, 150, 'sítio ativo', 'font-size:14px;font-weight:700;fill:#22633f', siti);
    el('path', { d: 'M222 146 L300 132', style: 'stroke:#22633f;stroke-width:1.2' }, siti);
    /* moleculas */
    var dS = 'M-30 -20 H30 V0 L0 26 L-30 0 Z';
    function mol(d, cor, rot, pai) { var g = el('g', {}, pai); el('path', { d: d, style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:' + cor + ';stroke-width:2;stroke-linejoin:round' }, g); if (rot) tx(0, -3, rot, 'font-size:13px;font-weight:700;fill:' + cor + ';text-anchor:middle', g); return g; }
    var quad = mol('M-24 -22 H24 V22 H-24 Z', OUT, '');
    var subs = mol(dS, SUB, 'S');
    var p1 = mol('M-30 -20 H0 V26 L-30 0 Z', SUB, ''), p2 = mol('M0 -20 H30 V0 L0 26 Z', SUB, '');
    var inib = mol('M-30 -4 V0 L0 26 L30 0 V-4 L14 -24 H-14 Z', INI, 'I');
    var extra = [0, 1, 2].map(function () { return mol(dS, SUB, 'S'); });
    /* rotulos moveis */
    var rQ = tx(0, 0, 'forma errada: não encaixa', 'font-size:13.5px;font-weight:700;fill:#5e5e5e;text-anchor:middle');
    var rS = tx(0, 0, 'substrato: forma complementar', 'font-size:13.5px;font-weight:700;fill:#a34a22;text-anchor:middle');
    var rC = tx(320, 74, 'complexo enzima-substrato', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle');
    var rP = tx(320, 40, 'produtos', 'font-size:14px;font-weight:700;fill:#a34a22;text-anchor:middle');
    var rL = tx(575, 80, 'enzima livre,', 'font-size:13.5px;font-weight:700;fill:#22633f;text-anchor:middle');
    var rL2 = tx(575, 97, 'pronta de novo', 'font-size:13.5px;fill:#22633f;text-anchor:middle');
    var rI = tx(150, 70, 'inibidor: imita a forma', 'font-size:13.5px;font-weight:700;fill:' + INI + ';text-anchor:middle');
    var rI2 = tx(150, 87, 'do substrato e ocupa a vaga', 'font-size:13.5px;fill:' + INI + ';text-anchor:middle');
    var rB = tx(500, 30, 'substrato sem vaga:', 'font-size:13.5px;font-weight:700;fill:#a34a22;text-anchor:middle');
    var rB2 = tx(500, 47, 'nenhum produto', 'font-size:13.5px;fill:#a34a22;text-anchor:middle');
    var rM = tx(320, 30, 'muito substrato: ele volta a ganhar a vaga', 'font-size:14px;font-weight:700;fill:#a34a22;text-anchor:middle');
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. O sítio ativo reconhece pela forma', 'A enzima é uma proteína com um bolso de forma definida: o sítio ativo.', 'Só entra a molécula de forma (e cargas) complementar: o substrato.', 'Uma molécula de outro formato bate na borda e não se aloja.'],
      ['2. Complexo enzima-substrato → produtos', 'Encaixado, o substrato é transformado (aqui, partido em dois).', 'Os produtos saem e a enzima volta igual ao que era:', 'ela não é gasta e pode repetir a reação muitas vezes.'],
      ['3. Inibidor competitivo: forma parecida', 'Uma molécula com a forma espacial parecida com a do substrato entra', 'no sítio ativo, mas não reage. Enquanto ela ocupa a vaga,', 'o substrato não encaixa e nenhum produto se forma.'],
      ['4. Competição pela mesma vaga', 'O inibidor competitivo entra e sai; com muito mais substrato no meio,', 'é o substrato que ocupa a vaga mais vezes e a reação volta.', 'Repare: a enzima continua inteira; não houve desnaturação.']
    ];
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3, p;
      /* quadrado (forma errada): vem, bate e volta */
      if (t < 1.2) p = caminho(t, 0, 1.2, [150, 40], [318, 86]); else p = caminho(t, 1.2, 1.9, [318, 86], [190, 52]);
      mv(quad, p[0], p[1], 0); op(quad, f === 0 ? 1 : 0);
      rQ.setAttribute('x', 160); rQ.setAttribute('y', 98); op(rQ, f === 0 && t > 1.3 ? 1 : 0);
      /* substrato: entra, forma complexo, parte */
      var vs = true;
      if (f === 0) { p = caminho(t, 1.4, 3, [500, 40], SEAT); }
      else if (f === 1) { p = SEAT; vs = t < 4.8; }
      else if (f === 2) { p = caminho(t, 8.2, 9.2, [520, 36], [400, 70]); }
      else { p = caminho(t, 11.8, 12.6, [400, 70], SEAT); }
      mv(subs, p[0], p[1]); op(subs, vs && (f !== 2 || t > 8.2) ? 1 : 0);
      rS.setAttribute('x', 500); rS.setAttribute('y', 40); op(rS, f === 0 && t > 2.2 ? 1 : 0);
      op(rC, f === 1 && t < 4.9 ? 1 : 0);
      var u = ease((t - 4.8) / 1.3);
      mv(p1, lerp(SEAT[0], 196, u), lerp(SEAT[1], 52, u), -40 * u); mv(p2, lerp(SEAT[0], 444, u), lerp(SEAT[1], 52, u), 40 * u);
      op(p1, f === 1 && t >= 4.8 ? 1 : 0); op(p2, f === 1 && t >= 4.8 ? 1 : 0);
      op(rP, f === 1 && t > 5.6 ? 1 : 0); op(rL, f === 1 && t > 5.9 ? 1 : 0); op(rL2, f === 1 && t > 5.9 ? 1 : 0);
      /* inibidor */
      if (f === 2) p = caminho(t, 7.1, 8.2, [150, 30], SEAT);
      else p = caminho(t, 11.2, 11.9, SEAT, [130, 40]);
      mv(inib, p[0], p[1]); op(inib, f >= 2 ? 1 : 0);
      op(rI, f === 2 && t > 8 ? 1 : 0); op(rI2, f === 2 && t > 8 ? 1 : 0);
      op(rB, f === 2 && t > 9.2 ? 1 : 0); op(rB2, f === 2 && t > 9.2 ? 1 : 0);
      /* muito substrato na competicao */
      var EX = [[470, 60], [540, 92], [560, 36]];
      extra.forEach(function (e, i) { var q = caminho(t, 10.6, 11.2, [EX[i][0] + 80, EX[i][1]], EX[i]); mv(e, q[0], q[1], (i - 1) * 12); op(e, f === 3 ? 1 : 0); });
      op(rM, f === 3 && t > 12.6 ? 1 : 0);
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['enzima-sitio-ativo-inibicao'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'W46018a1' ? T[3] - .2 : T[1] - .2; }
    });
  }
};
VIS.liga('enzima-sitio-ativo-inibicao', ['W46018a1', 'Wb791992']);
