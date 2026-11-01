/* Exponencial e logaritmo: multiplica x soma, base < 1 decai, log como inversa (espelho em y = x),
   log tira o x do expoente, e log de uma exponencial vira reta. Curvas calculadas pelas formulas, mesma escala nos eixos. */
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js), com opc.esconde: elemento escondido na etapa Resposta */
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
    if (opc.esconde && on) opc.esconde.style.opacity = 0;
  };
}
var RESP = {
'5210190a': ['Por isso a resposta é D', 'Dobrar a cada década: multiplica por 2.', 'Crescer 1 % ao ano: multiplica por 1,01.', 'Fator fixo nos dois: os dois são exponenciais.'],
'759e079b': ['Por isso a resposta é E', 'O gráfico corta o eixo y em x = 0:', 'f(0) = k · 2³ = 8k = 24', 'k = 24 ÷ 8 = 3'],
'P8b13820': ['Por isso a resposta é C', 'f(0) = t · u⁰ = t = 3 (3 insetos no início)', '3 · u⁷ = 18 000 → u⁷ = 6 000', 'u = g(7) ≈ 3,47 → t + u ≈ 6,47'],
'9a609adb': ['Por isso a resposta é D', 'y > 0 sempre: 3º e 4º quadrantes saem.', 'Bases diferentes: um único encontro.', '3^(x + 66) = 3^(4x) → x = 22 > 0: 1º quadrante'],
'faccb8b7': ['Por isso a resposta é D', '2015 (t = 5): 4⁰ = 1 → C = 17 − 7 = 10', '2017 (t = 7): expoente −1, e 4⁻¹ = 1/4', 'V = 10 + 7/4 = 11,75 → R$ 117.500,00'],
'E8d8cdbe': ['Por isso a resposta é C', 'Perder 15 % por hora: fator 0,85.', '5 horas: 200 · 0,85⁵, e 0,85⁵ ≈ 0,44 (gráfico)', '200 · 0,44 = 88 mg'],
'Pe2cefb7': ['Por isso a resposta é E', 'D(16; 4): k⁴ = 16 → k = 2', 'A: log₂ x = 1 → (2; 1); C: log₂ x = 3 → (8; 3)', 'AC = √(6² + 2²) = √40 = 2√10 cm'],
'Pffe3912': ['Por isso a resposta é C', 'Assíntota x = 1 → P(1; 0); log₂ 1 = 0 → Q(2; 0)', 'xM = 1,5 → yM = log₂ 0,5', '2⁻¹ = 0,5 → yM = −1'],
'4f16a337': ['Por isso a resposta é B', 'Dobrar: e^(0,006 t) = 2', 'ln dos dois lados: 0,006 t = ln 2 ≈ 0,69', 't = 0,69 ÷ 0,006 = 115 anos'],
'7f7a4b26': ['Por isso a resposta é A', 'log 13 − log 4 = log (13 ÷ 4) = log 3,25', 'no gráfico de log(x + 1): x + 1 = 3,25 → x = 2,25', 'f(2,25) ≈ 0,5'],
'865aa9f8': ['Por isso a resposta é C', '1,1ⁿ = 2 → n · log 1,1 = log 2', 'n = 0,30 ÷ 0,04 = 7,5: passa do dobro no 8º ano', '2014 + 8 = 2022'],
'E9e1ea7b': ['Por isso a resposta é B', 'log y = log 5 + 3x · log 2: é a reta r', 'inclinação 3 log 2 = log 8; MD = 1 → DE = log 8', 'área = (1 · log 8) ÷ 2 = log √8']
};
VIS.def['exponencial-log-graficos'] = {
  tit: 'Exponencial e logaritmo: gráficos e propriedades',
  fontes: ['OpenStax, College Algebra 2e, 6.2 Graphs of Exponential Functions — https://openstax.org/books/college-algebra-2e/pages/6-2-graphs-of-exponential-functions', 'OpenStax, College Algebra 2e, 6.4 Graphs of Logarithmic Functions — https://openstax.org/books/college-algebra-2e/pages/6-4-graphs-of-logarithmic-functions', 'OpenStax, College Algebra 2e, 6.7 Exponential and Logarithmic Models — https://openstax.org/books/college-algebra-2e/pages/6-7-exponential-and-logarithmic-models', 'Wikipedia (pt), Logaritmo — https://pt.wikipedia.org/wiki/Logaritmo'],
  tipo: 'anim', dur: 16.2,
  marcas: [[0, 'Multiplica'], [3.2, 'Decai'], [6.4, 'Log: inversa'], [9.8, 'Expoente'], [13, 'Vira reta']],
  cred: 'Animação feita para o app. Curvas calculadas pelas fórmulas, com a mesma escala nos dois eixos.',
  nota: 'Exponencial multiplica pelo mesmo fator a cada passo (crescer p % é multiplicar por 1 + p/100; perder p %, por 1 − p/100) e nunca fica negativa. O logaritmo é a inversa: log_b x é o expoente que leva b até x, e serve para tirar a incógnita do expoente.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var HALO = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    var EXP = 'var(--ad-c)', DEC = '#8a5a9e', LIN = '#9a7220', LOG = '#2b6cb0', AUX = '#b4442f';
    svg.setAttribute('viewBox', '0 0 640 350');
    var U = 28, X0 = 110, Y0 = 244, PX0 = 18, PX1 = 252, PY0 = 12, PY1 = 338;
    function px(x) { return X0 + U * x; } function py(y) { return Y0 - U * y; }
    var defs = el('defs', {}); var cp = el('clipPath', { id: 'cp-explog' }, defs); el('rect', { x: PX0, y: PY0, width: PX1 - PX0, height: PY1 - PY0 }, cp);
    for (var i = -3; i <= 5; i++) el('line', { x1: px(i), x2: px(i), y1: PY0, y2: PY1, style: 'stroke:var(--linha);stroke-width:1;opacity:.55' });
    for (var j = -3; j <= 8; j++) el('line', { x1: PX0, x2: PX1, y1: py(j), y2: py(j), style: 'stroke:var(--linha);stroke-width:1;opacity:.55' });
    el('path', { d: 'M' + PX0 + ' ' + Y0 + ' H' + (PX1 + 4) + ' m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    el('path', { d: 'M' + X0 + ' ' + PY1 + ' V' + (PY0 - 2) + ' m-5 8 l5 -8 l5 8', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    tx(PX1 - 4, Y0 + 20, 'x', 'font-size:15px;font-style:italic;fill:var(--tinta)');
    var lEy = tx(X0 + 8, PY0 + 12, 'y', 'font-size:15px;font-style:italic;fill:var(--tinta)' + HALO);
    [-2, 2, 4].forEach(function (v) { tx(px(v), Y0 + 17, v < 0 ? '−' + (-v) : '' + v, 'font-size:14px;fill:var(--lapis);text-anchor:middle' + HALO); });
    [-2, 2, 4, 6, 8].forEach(function (v) { tx(X0 - 6, py(v) + 5, v < 0 ? '−' + (-v) : '' + v, 'font-size:14px;fill:var(--lapis);text-anchor:end' + HALO); });
    var gc = el('g', { 'clip-path': 'url(#cp-explog)' });
    var cYX = el('line', { x1: px(-3.5), y1: py(-3.5), x2: px(8.5), y2: py(8.5), style: 'stroke:var(--lapis);stroke-width:1.6;stroke-dasharray:6 5' }, gc);
    var cLin = el('path', { style: 'fill:none;stroke:' + LIN + ';stroke-width:2.2;stroke-dasharray:7 4' }, gc);
    var cExp = el('path', { style: 'fill:none;stroke:' + EXP + ';stroke-width:3' }, gc);
    var cDec = el('path', { style: 'fill:none;stroke:' + DEC + ';stroke-width:3' }, gc);
    var cLog = el('path', { style: 'fill:none;stroke:' + LOG + ';stroke-width:3' }, gc);
    var hLin = el('line', { style: 'stroke:' + AUX + ';stroke-width:2' }, gc);
    var vLin = el('line', { style: 'stroke:' + AUX + ';stroke-width:1.6;stroke-dasharray:4 4' }, gc);
    var cRet = el('path', { style: 'fill:none;stroke:' + EXP + ';stroke-width:3' }, gc);
    var tri = el('path', { style: 'fill:none;stroke:' + AUX + ';stroke-width:2' }, gc);
    var assX = el('line', { x1: PX0, x2: PX1, y1: Y0, y2: Y0, style: 'stroke:' + DEC + ';stroke-width:4;opacity:.35' }, gc);
    function ponto(cor) { return el('circle', { r: 5, style: 'fill:' + cor + ';stroke:var(--folha);stroke-width:2' }); }
    function rot(cor, anc) { return tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + cor + (anc ? ';text-anchor:' + anc : '') + HALO); }
    var pE = [0, 1, 2, 3].map(function () { return ponto(EXP); }), pL = [2, 3].map(function () { return ponto(LIN); });
    var rE = [1, 2, 3].map(function () { return rot(EXP, 'end'); }), rL = [2, 3].map(function () { return rot(LIN); });
    var pG = [0, 1, 2].map(function () { return ponto(LOG); }), rG = [0, 1, 2].map(function () { return rot(LOG); });
    var pM = ponto(LOG), rM = rot(LOG);
    var p01 = ponto(AUX), r01 = rot(AUX);
    var nE = rot(EXP), nD = rot(DEC), nL = rot(LIN), nG = rot(LOG), nX = rot('var(--lapis)'), nH = rot(AUX), nR = rot(EXP), nT1 = rot(AUX, 'middle'), nT2 = rot(AUX), nI = rot(AUX);
    var pI = ponto(AUX), nR2 = rot(EXP);
    /* painel */
    var painel = el('g', {});
    var T = tx(266, 38, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3, 4].map(function (k) { return tx(266, 70 + 25 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    el('line', { x1: 266, x2: 630, y1: 210, y2: 210, style: 'stroke:var(--linha);stroke-width:1.2' }, painel);
    var V1 = tx(266, 240, '', 'font-size:15.5px;font-weight:700;fill:var(--tinta)', painel), V2 = tx(266, 265, '', 'font-size:15px;fill:var(--tinta)', painel);
    function caminho(F, a, b, st) { var d = ''; for (var x = a; x <= b + 1e-9; x += (st || .04)) { var y = F(x); if (!isFinite(y)) continue; d += (d ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(Math.max(-8, Math.min(14, y))).toFixed(1); } return d; }
    function pos(o, x, y) { o.setAttribute('cx', px(x).toFixed(1)); o.setAttribute('cy', py(y).toFixed(1)); }
    function lab(o, x, y, dx, dy, s) { o.setAttribute('x', (px(x) + dx).toFixed(1)); o.setAttribute('y', (py(y) + dy).toFixed(1)); o.textContent = s; }
    var LG2 = Math.log(2) / Math.LN10, LG3 = Math.log(3) / Math.LN10, LG15 = Math.log(1.5) / Math.LN10, XI = LG2 / LG15;
    var TX = [
      ['1. Exponencial: multiplica pelo mesmo fator', 'y = 2ˣ: cada passo de 1 em x MULTIPLICA y por 2.', 'Reta y = x + 1: cada passo SOMA 1 (linear).', 'f(x) = A · bˣ → f(0) = A · b⁰ = A · 1 = A:', 'A é o valor inicial, onde a curva corta o eixo y.', 'Crescer 1 % ao ano também é exponencial (× 1,01).'],
      ['2. Base entre 0 e 1: a curva decai', 'y = (1/2)ˣ = 2⁻ˣ: cada passo divide por 2.', 'Perder 15 % por hora: fator 1 − 0,15 = 0,85.', 'Expoente negativo é inverso: 2⁻¹ = 1/2, 4⁻¹ = 1/4.', 'Expoente zero: b⁰ = 1, para qualquer base.', 'bˣ > 0 sempre: a curva nunca toca o eixo x.'],
      ['3. Logaritmo: a inversa da exponencial', 'log₂ x responde: 2 elevado a quanto dá x?', 'Espelhe y = 2ˣ na reta y = x: (1; 2) vira (2; 1),', '(2; 4) vira (4; 2) e (0; 1) vira (1; 0).', 'log₂ 1 = 0: a curva corta o eixo x em x = 1.', ''],
      ['4. O log tira o x do expoente', 'log bⁿ = n · log b. Exemplo: 1,5ˣ = 2', 'x · log 1,5 = log 2', 'x = log 2 ÷ log 1,5 ≈ 0,301 ÷ 0,176 ≈ 1,71', 'Também: log(a · b) = log a + log b', 'e log(a ÷ b) = log a − log b.'],
      ['5. Com log, a exponencial vira reta', 'y = 2 · 3ˣ → log y = log 2 + x · log 3', 'No plano (x; log y) isso é uma reta:', 'corta o eixo vertical em log 2 ≈ 0,30', 'e sobe log 3 ≈ 0,48 a cada 1 em x.', '']
    ];
    var VX = [['f(0) = 2⁰ = 1: corta o eixo y em 1', 'acréscimos 1, 2, 4...: crescem (não é reta)'], ['2ˣ e (1/2)ˣ se cruzam num ponto só, (0; 1);', 'bases diferentes dão um único encontro'], ['Só existe para x > 0: o eixo y é assíntota.', 'log₂(x − 1) anda 1: assíntota x = 1'], ['Com ln (base e): eᵏᵗ = 2 → k · t = ln 2', ''], ['Inclinação = log da base.', '3 passos em x: sobe 3 · log 3 = log 27 ≈ 1,43']];
    var _desenha = function (t) {
      var fase = t < 3.2 ? 0 : t < 6.4 ? 1 : t < 9.8 ? 2 : t < 13 ? 3 : 4;
      /* 1: 2^x e reta y = x + 1 */
      var sx = fase === 0 ? lerp(-3.4, 3.1, ease((t - .1) / 1.6)) : 3.1;
      cExp.setAttribute('d', caminho(function (x) { return Math.pow(2, x); }, -3.4, sx));
      cLin.setAttribute('d', caminho(function (x) { return x + 1; }, -3.4, sx));
      op(cExp, fase <= 2 ? (fase === 2 ? .8 : 1) : 0); op(cLin, fase === 0 ? 1 : 0); op(nL, fase === 0 && t > 1.7 ? 1 : 0); lab(nL, 0.4, -1.6, 0, 0, 'y = x + 1');
      op(nE, fase <= 2 && t > 1.7 ? 1 : 0); lab(nE, 2.35, 6.6, -4, 0, 'y = 2ˣ'); nE.style.textAnchor = 'end';
      pE.forEach(function (p, k) { pos(p, k, Math.pow(2, k)); op(p, fase === 0 && sx >= k ? 1 : fase === 2 && k < 3 ? 1 : 0); });
      rE.forEach(function (r, k) { lab(r, k + 1, Math.pow(2, k + 1), -8, -4, '× 2'); op(r, fase === 0 && sx >= k + 1 ? 1 : 0); });
      pL.forEach(function (p, k) { pos(p, k + 2, k + 3); op(p, fase === 0 && sx >= k + 2 ? 1 : 0); });
      rL.forEach(function (r, k) { lab(r, k + 2, k + 3, 8, 16, '+ 1'); op(r, fase === 0 && sx >= k + 2 ? 1 : 0); });
      /* 2: (1/2)^x, assintota y = 0, encontro unico */
      var u2 = fase === 1 ? ease((t - 3.4) / 1.2) : 0;
      cDec.setAttribute('d', caminho(function (x) { return Math.pow(.5, x); }, -3.4, lerp(-3.4, 5.4, u2)));
      op(cDec, fase === 1 ? 1 : 0); op(nD, fase === 1 ? u2 : 0); lab(nD, -2.3, 6.6, 6, 0, 'y = (1/2)ˣ');
      op(assX, fase === 1 && t > 4.6 ? 1 : 0);
      pos(p01, 0, 1); op(p01, fase <= 1 ? (fase === 0 ? (t > .8 ? 1 : 0) : 1) : 0); lab(r01, 0, 1, 8, -8, '(0; 1)'); op(r01, fase <= 1 && t > .8 ? 1 : 0);
      /* 3: espelho em y = x */
      var u3 = fase === 2 ? ease((t - 7) / 1.4) : 0;
      op(cYX, fase === 2 ? 1 : 0); op(nX, fase === 2 ? 1 : 0); lab(nX, 4.3, 4.3, -4, -10, 'y = x'); nX.style.textAnchor = 'end';
      var d = ''; for (var s = -3.5; s <= 3.15; s += .04) { var a = Math.pow(2, s), X = lerp(s, a, u3), Y = lerp(a, s, u3); d += (d ? 'L' : 'M') + px(X).toFixed(1) + ' ' + py(Y).toFixed(1); }
      cLog.setAttribute('d', d); op(cLog, fase === 2 && t > 6.9 ? 1 : 0);
      pG.forEach(function (p, k) { pos(p, Math.pow(2, k), k); op(p, fase === 2 && u3 > .99 ? 1 : 0); });
      rG.forEach(function (r, k) { lab(r, Math.pow(2, k), k, 6, 18, '(' + Math.pow(2, k) + '; ' + k + ')'); op(r, fase === 2 && u3 > .99 ? 1 : 0); });
      pos(pM, .5, -1); lab(rM, .5, -1, 8, 18, '(0,5; −1)'); op(pM, fase === 2 && u3 > .99 ? 1 : 0); op(rM, fase === 2 && u3 > .99 ? 1 : 0);
      op(nG, fase === 2 && u3 > .99 ? 1 : 0); lab(nG, 0.4, -2.5, 4, 0, 'log₂ x');
      /* 4: 1,5^x = 2 */
      var on4 = fase === 3, u4 = ease((t - 10) / .8);
      if (on4) { cExp.setAttribute('d', caminho(function (x) { return Math.pow(1.5, x); }, -3.4, 5.4)); op(cExp, u4); }
      hLin.setAttribute('x1', PX0); hLin.setAttribute('x2', PX1); hLin.setAttribute('y1', py(2)); hLin.setAttribute('y2', py(2)); op(hLin, on4 ? u4 : 0);
      vLin.setAttribute('x1', px(XI)); vLin.setAttribute('x2', px(XI)); vLin.setAttribute('y1', py(2)); vLin.setAttribute('y2', Y0); op(vLin, on4 && t > 11 ? 1 : 0);
      pos(pI, XI, 2); op(pI, on4 && t > 11 ? 1 : 0); lab(nI, XI, 0, 6, 18, 'x ≈ 1,71'); op(nI, on4 && t > 11 ? 1 : 0);
      lab(nH, -2.9, 2, 0, -8, 'y = 2'); op(nH, on4 ? u4 : 0);
      lab(nR, 2.6, Math.pow(1.5, 2.6) + .3, -6, 0, on4 ? 'y = 1,5ˣ' : 'log y = log 2 + x · log 3'); nR.style.textAnchor = on4 ? 'end' : 'start';
      /* 5: reta log y */
      var on5 = fase === 4, u5 = ease((t - 13.2) / 1);
      cRet.setAttribute('d', caminho(function (x) { return LG2 + LG3 * x; }, -3.4, lerp(-3.4, 5.4, u5))); op(cRet, on5 ? 1 : 0);
      tri.setAttribute('d', 'M' + px(0) + ' ' + py(LG2) + ' H' + px(3) + ' V' + py(LG2 + 3 * LG3)); op(tri, on5 && t > 14.4 ? 1 : 0);
      lab(nT1, 1.5, LG2, 0, 18, '3'); op(nT1, on5 && t > 14.4 ? 1 : 0);
      lab(nT2, 3, LG2 + 1.5 * LG3, 6, 5, '≈ 1,43'); op(nT2, on5 && t > 14.4 ? 1 : 0);
      if (on5) { lab(nR, 0.25, 6.3, 0, 0, 'log y ='); nR.style.textAnchor = 'start'; lab(nR2, 0.25, 5.55, 0, 0, 'log 2 + x · log 3'); }
      op(nR2, on5 ? u5 : 0);
      op(nR, (on4 ? u4 : 0) || (on5 ? u5 : 0));
      lEy.textContent = on5 ? 'log y' : 'y';
      var Xt = TX[fase]; T.textContent = Xt[0]; for (var m = 0; m < 5; m++) L[m].textContent = Xt[m + 1];
      V1.textContent = VX[fase][0]; V2.textContent = VX[fase][1]; painel.style.opacity = 1;
    };
    var G1 = ['5210190a', '759e079b', 'P8b13820'], G2 = ['9a609adb', 'faccb8b7', 'E8d8cdbe'], G3 = ['Pe2cefb7', 'Pffe3912', '7f7a4b26'];
    return fimResposta(VIS.def['exponencial-log-graficos'], svg, _desenha, 16.2, RESP, qid, {
      x: 258, y: 40, w: 374, semEsmaecer: true, esconde: painel,
      congela: function (q) { return G1.indexOf(q) >= 0 ? 3.0 : G2.indexOf(q) >= 0 ? 6.2 : G3.indexOf(q) >= 0 ? 9.6 : q === 'E9e1ea7b' ? 16.1 : 12.8; }
    });
  }
};
VIS.liga('exponencial-log-graficos', ['5210190a', '759e079b', '9a609adb', 'P8b13820', 'faccb8b7', '4f16a337', 'E8d8cdbe', 'E9e1ea7b', 'Pe2cefb7', 'Pffe3912', '7f7a4b26', '865aa9f8']);
