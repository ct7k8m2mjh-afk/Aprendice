/* Bafometro: dicromato (Cr +6, laranja) oxida o etanol a etanal e vira Cr3+ (verde); Nox, eletrons,
   balanceamento (x = 3, y = 7) calculados no codigo; agente oxidante e sua cor. Fotos reais do Commons. */
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
'Pf8f018d': ['Por isso a resposta é B',
'O Cr ganha 6 e⁻ por K₂Cr₂O₇ e cada etanol perde 2: x = 3; o H fecha y = 7.',
'x + y = 10. O oxidante é o dicromato (ele se reduz): amarelo-alaranjado.']
};
VIS.def['bafometro-dicromato'] = {
  tit: 'Bafômetro: o dicromato laranja vira Cr³⁺ verde',
  fontes: ['OpenStax, Chemistry 2e, 4.2 Classifying Chemical Reactions (oxirredução, número de oxidação) — https://openstax.org/books/chemistry-2e/pages/4-2-classifying-chemical-reactions', 'OpenStax, Chemistry 2e, 4.1 Writing and Balancing Chemical Equations — https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations', 'Wikipedia (en), Breathalyzer (dicromato laranja reduzido a Cr³⁺ verde pelo etanol) — https://en.wikipedia.org/wiki/Breathalyzer', 'Wikipedia (en), Potassium dichromate — https://en.wikipedia.org/wiki/Potassium_dichromate'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Cr +6'], [3.5, 'Etanol'], [7, 'Cr +3'], [12, 'Oxidante']],
  cred: 'Fotos (recortadas), Wikimedia Commons: “Potassium dichromate solutions” e “Chromium(III) chloride solutions”, Leiem, CC BY-SA 4.0. O Cr³⁺ formado no bafômetro (sulfato de crômio(III)) também deixa a solução verde.',
  nota: 'No bafômetro químico, o etanol do sopro reduz o dicromato (Cr +6, laranja) a Cr³⁺ (Cr +3, verde) e vira etanal. Quem sofre redução é o agente oxidante: o dicromato. O balanceamento sai igualando os elétrons: 6 ganhos pelos dois Cr = 3 etanóis × 2.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 3.5, T2 = 7, T3 = 12, TF = 15;
    var LAR = '#d9771a', VER = '#2f8a5b', RED = '#2b6cb0', OXI = '#c0392b';
    function sinal(n) { return (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n); }
    /* Nox calculado: soma zero em composto neutro */
    var noxCrVI = (0 - (2 * 1 + 7 * -2)) / 2;          /* K2Cr2O7 */
    var noxCrIII = (0 - 3 * -2) / 2;                   /* Cr2(SO4)3, sulfato = -2 */
    var eCr = 2 * (noxCrVI - noxCrIII);                /* eletrons ganhos por K2Cr2O7 */
    var noxC_et = -2 * 1 + 1 + 0, noxC_al = -1 * 1 + 2 + 0;   /* C do CH2OH e do CHO: H vale -1 cada, O +1 por ligacao */
    var eEt = noxC_al - noxC_et, x = eCr / eEt;
    /* balanceamento: S fixa H2SO4, H fixa a agua */
    var nS = 1 + 3, hEsq = 2 * nS + 6 * x, y = (hEsq - 4 * x) / 2;
    var oEsq = 7 + 4 * nS + x, oDir = x + 4 + 12 + y;
    /* ===== fotos ===== */
    var FW = 236, FH = 177, FX = 14, FY = 20;
    var f1 = el('g', {}), f2 = el('g', {});
    el('image', { href: 'vis/bafometro-dicromato-1.webp', x: FX, y: FY, width: FW, height: FH, preserveAspectRatio: 'xMidYMid slice' }, f1);
    el('image', { href: 'vis/bafometro-dicromato-2.webp', x: FX, y: FY, width: FW, height: FH, preserveAspectRatio: 'xMidYMid slice' }, f2);
    [f1, f2].forEach(function (g) { el('rect', { x: FX, y: FY, width: FW, height: FH, rx: 6, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, g); });
    var leg1 = tx(FX, FY + FH + 18, 'K₂Cr₂O₇ em água, diluído → concentrado: amarelo a laranja', 'font-size:14px;fill:var(--lapis)', f1);
    var leg2 = tx(FX, FY + FH + 18, 'Cr³⁺ (cloreto de crômio(III)): verde', 'font-size:14px;fill:var(--lapis)', f2);
    /* ===== lado direito: contas ===== */
    var R = 272, S = 'font-size:16px;font-weight:700;fill:var(--tinta)', M = 'font-size:15px;fill:var(--tinta)';
    var e1 = el('g', {});
    tx(R, 40, 'K₂Cr₂O₇ (dicromato): laranja', 'font-size:16px;font-weight:700;fill:' + LAR, e1);
    tx(R, 74, '2·(+1) + 2·Cr + 7·(−2) = 0', M, e1);
    tx(R, 102, 'Cr = ' + sinal(noxCrVI), 'font-size:20px;font-weight:700;fill:' + LAR, e1);
    tx(R, 140, 'o K vale +1 e o O vale −2;', 'font-size:14px;fill:var(--lapis)', e1);
    tx(R, 160, 'a soma num composto neutro é zero', 'font-size:14px;fill:var(--lapis)', e1);
    var e2 = el('g', {});
    tx(R, 36, 'Etanol → etanal (o redutor)', 'font-size:16px;font-weight:700;fill:' + RED, e2);
    tx(R, 74, 'CH₃–CH₂–OH', 'font-size:18px;font-weight:700;fill:var(--tinta)', e2);
    tx(R + 160, 74, '→   CH₃–CHO', 'font-size:18px;font-weight:700;fill:var(--tinta)', e2);
    tx(R, 104, 'C do CH₂OH: ' + sinal(noxC_et), 'font-size:16px;font-weight:700;fill:' + RED, e2);
    tx(R + 176, 104, 'C do CHO: ' + sinal(noxC_al), 'font-size:16px;font-weight:700;fill:' + RED, e2);
    tx(R, 140, 'o Nox do C sobe ' + eEt + ': cada etanol perde ' + eEt + ' e⁻', M, e2);
    tx(R, 162, '(oxidação: perdeu 2 H, ganhou C=O)', 'font-size:14px;fill:var(--lapis)', e2);
    var e3 = el('g', {});
    tx(R, 32, 'Cr³⁺ (sulfato de crômio(III)): verde', 'font-size:16px;font-weight:700;fill:' + VER, e3);
    tx(R, 60, '2·Cr + 3·(−2) = 0  →  Cr = ' + sinal(noxCrIII), M, e3);
    tx(R, 88, 'cada Cr ganha ' + (noxCrVI - noxCrIII) + ' e⁻: 2 Cr = ' + eCr + ' e⁻', M, e3);
    tx(R, 114, eCr + ' e⁻ ÷ ' + eEt + ' e⁻ por etanol = ' + x + ' etanóis: x = ' + x, 'font-size:15px;font-weight:700;fill:var(--tinta)', e3);
    tx(R, 142, 'S: ' + nS + ' H₂SO₄ · H: ' + hEsq + ' = ' + 4 * x + ' + 2y → y = ' + y, M, e3);
    tx(R, 168, 'O confere: ' + oEsq + ' = ' + oDir, 'font-size:14px;fill:var(--lapis)', e3);
    tx(R, 196, 'x + y = ' + x + ' + ' + y + ' = ' + (x + y), 'font-size:19px;font-weight:700;fill:' + OXI, e3);
    var e4 = el('g', {});
    var C4 = [[LAR, 'K₂Cr₂O₇', 'amarelo-alaranjado', 'se reduz (+6 → +3)', 'agente OXIDANTE'], ['#cfd6dc', 'C₂H₅OH', 'incolor', 'se oxida (−1 → +1)', 'agente redutor'], [VER, 'Cr₂(SO₄)₃', 'verde', 'produto', '']];
    C4.forEach(function (c, i) {
      var y0 = 26 + i * 62;
      el('rect', { x: R, y: y0, width: 36, height: 44, rx: 6, style: 'fill:' + c[0] + ';stroke:var(--linha)' }, e4);
      tx(R + 48, y0 + 18, c[1] + ' · ' + c[2], 'font-size:15px;font-weight:700;fill:var(--tinta)', e4);
      tx(R + 48, y0 + 38, c[3] + (c[4] ? ': ' : ''), 'font-size:15px;fill:var(--tinta)', e4);
      if (c[4]) tx(R + 48 + (c[3].length + 2) * 7.6, y0 + 38, c[4], 'font-size:15px;font-weight:700;fill:' + (i ? RED : OXI), e4);
    });
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 222, y2: 222, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 246, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 271 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. O reagente: dicromato, Cr com Nox +6', 'A solução ácida de dicromato de potássio é amarelo-alaranjada.', 'Pela soma zero dos Nox, cada Cr do K₂Cr₂O₇ está em +6.', ''],
      ['2. O etanol do sopro perde elétrons', 'O carbono do CH₂OH vai de −1 a +1 ao virar o CHO do etanal:', 'cada etanol perde 2 elétrons. Ele se oxida: é o agente redutor.', ''],
      ['3. O crômio ganha elétrons e fica verde', 'O Cr vai de +6 a +3 (Cr³⁺, verde): ganha 3 e⁻; os dois Cr, 6 e⁻.', 'Elétrons ganhos = perdidos: 6 = 3 × 2, então x = 3. Depois S, H e O', 'fecham o resto: K₂Cr₂O₇ + 4 H₂SO₄ + 3 C₂H₅OH → 3 C₂H₄O + … + 7 H₂O.'],
      ['4. Quem é o agente oxidante?', 'Agente oxidante é quem sofre redução: o dicromato (Cr +6 → +3).', 'A cor dele é a do reagente, amarelo-alaranjada. O verde é do produto,', 'e o etanol incolor é o redutor.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(f1, f < 2 || f === 3 ? 1 : 0); op(f2, f === 2 ? 1 : 0);
      op(e1, f === 0 ? cl(t / .4) : 0); op(e2, f === 1 ? cl((t - T1) / .4) : 0); op(e3, f === 2 ? cl((t - T2) / .4) : 0); op(e4, f === 3 ? cl((t - T3) / .4) : 0);
      var L = TXT[f];
      for (var k = 0; k < 4; k++) P[k].textContent = L[k] || '';
    };
    return fimResposta(VIS.def['bafometro-dicromato'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function () { return TF - .01; }
    });
  }
};
VIS.liga('bafometro-dicromato', ['Pf8f018d']);
