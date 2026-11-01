/* Transformacoes de graficos a partir de f(x) = (x - 1)^2 - 1: f(x) + k, f(x - h), -f(x), 2f(x), f(2x);
   e o sinal do produto f.g lido no grafico. Curvas calculadas pela formula, mesma escala nos dois eixos. */
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
'P5a9dff7': ['Por isso a resposta é D', 'g: metade da largura de f, mesma altura', '→ g(x) = f(2x).', 'n: é m 1 unidade à esquerda, espelhada', 'no eixo x → n(x) = −m(x + 1).'],
'b3b7d1ec': ['Por isso a resposta é C', 'Produto < 0: sinais opostos no gráfico.', '−4 ≤ x < −1: f > 0 e g < 0', '0 < x < 3: f < 0 e g > 0', 'Os zeros −1, 0 e 3 ficam de fora.']
};
VIS.def['transformacoes-graficos'] = {
  tit: 'Como cada mudança na fórmula mexe no gráfico',
  fontes: ['OpenStax, College Algebra 2e, 3.5 Transformation of Functions — https://openstax.org/books/college-algebra-2e/pages/3-5-transformation-of-functions', 'Wikipedia (en), Graph of a function — https://en.wikipedia.org/wiki/Graph_of_a_function'],
  tipo: 'anim', dur: 16.4,
  marcas: [[0, 'f(x) + k'], [2.8, 'f(x − h)'], [5.6, '−f e 2f'], [8.6, 'f(2x)'], [11.4, 'Sinal de f·g']],
  cred: 'Animação feita para o app. Curvas calculadas pelas fórmulas, com a mesma escala nos dois eixos.',
  nota: 'Mexer fora da função muda as alturas (sobe, espelha no eixo x, estica na vertical). Mexer junto do x muda a posição e a largura, sempre ao contrário do que parece: x − 2 anda para a direita, 2x encolhe a largura pela metade.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var HALO = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    var CUR = 'var(--ad-c)', BASE = 'var(--lapis)', ESP = '#8a5a9e', G = '#2b6cb0', NEG = '#b4442f';
    svg.setAttribute('viewBox', '0 0 640 350');
    var U = 38, X0 = 119, Y0 = 177, PX0 = 20, PX1 = 290, PY0 = 14, PY1 = 336;
    function px(x) { return X0 + U * x; } function py(y) { return Y0 - U * y; }
    var defs = el('defs', {}); var cp = el('clipPath', { id: 'cp-transf-gr' }, defs); el('rect', { x: PX0, y: PY0, width: PX1 - PX0, height: PY1 - PY0 }, cp);
    var faixas = el('g', {});
    var fx1 = el('rect', { y: PY0, height: PY1 - PY0, style: 'fill:' + NEG + ';opacity:.12' }, faixas), fx2 = el('rect', { y: PY0, height: PY1 - PY0, style: 'fill:' + NEG + ';opacity:.12' }, faixas);
    for (var i = -2; i <= 4; i++) el('line', { x1: px(i), x2: px(i), y1: PY0, y2: PY1, style: 'stroke:var(--linha);stroke-width:1;opacity:.55' });
    for (var j = -4; j <= 4; j++) el('line', { x1: PX0, x2: PX1, y1: py(j), y2: py(j), style: 'stroke:var(--linha);stroke-width:1;opacity:.55' });
    el('path', { d: 'M' + PX0 + ' ' + Y0 + ' H' + (PX1 + 4) + ' m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    el('path', { d: 'M' + X0 + ' ' + PY1 + ' V' + (PY0 - 2) + ' m-5 8 l5 -8 l5 8', style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    tx(PX1 - 4, Y0 + 20, 'x', 'font-size:15px;font-style:italic;fill:var(--tinta)'); tx(X0 + 8, PY0 + 12, 'y', 'font-size:15px;font-style:italic;fill:var(--tinta)');
    [-2, -1, 1, 2, 3, 4].forEach(function (v) { tx(px(v), Y0 + 17, v < 0 ? '−' + (-v) : '' + v, 'font-size:14px;fill:var(--lapis);text-anchor:middle' + HALO); });
    [-3, -2, -1, 1, 2, 3].forEach(function (v) { tx(X0 - 6, py(v) + 5, v < 0 ? '−' + (-v) : '' + v, 'font-size:14px;fill:var(--lapis);text-anchor:end' + HALO); });
    var gc = el('g', { 'clip-path': 'url(#cp-transf-gr)' });
    var cBase = el('path', { style: 'fill:none;stroke:' + BASE + ';stroke-width:2;stroke-dasharray:6 5' }, gc);
    var cEsp = el('path', { style: 'fill:none;stroke:' + ESP + ';stroke-width:2.6' }, gc);
    var cMain = el('path', { style: 'fill:none;stroke:' + CUR + ';stroke-width:3' }, gc);
    var cG = el('path', { style: 'fill:none;stroke:' + G + ';stroke-width:3' }, gc);
    var bandas = el('g', {});
    var b1 = el('line', { y1: Y0, y2: Y0, style: 'stroke:' + NEG + ';stroke-width:6' }, bandas), b2 = el('line', { y1: Y0, y2: Y0, style: 'stroke:' + NEG + ';stroke-width:6' }, bandas);
    function ponto(cor) { return el('circle', { r: 5.5, style: 'fill:' + cor + ';stroke:var(--folha);stroke-width:2' }); }
    var P = [ponto(CUR), ponto(CUR), ponto(CUR)];   /* raizes 0 e 2, vertice (1; -1) de f, transformados */
    var lBase = tx(0, 0, 'f(x)', 'font-size:14px;font-weight:700;fill:' + BASE + HALO), lMain = tx(0, 0, '', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--ad-t)' + HALO);
    var lEsp = tx(0, 0, '−f(x)', 'font-size:15px;font-weight:700;fill:' + ESP + HALO), lF = tx(0, 0, 'f', 'font-size:16px;font-weight:700;font-style:italic;fill:var(--ad-t)' + HALO), lG = tx(0, 0, 'g', 'font-size:16px;font-weight:700;font-style:italic;fill:' + G + HALO);
    var lV = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--ad-t)' + HALO);
    /* painel */
    var painel = el('g', {});
    var T = tx(304, 38, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3, 4].map(function (k) { return tx(304, 70 + 25 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    var quadro = el('g', {}, painel);
    var CX = [372, 438, 504, 570], CW = 64;
    tx(304, 168, 'x', 'font-size:14px;font-style:italic;fill:var(--lapis)', quadro);
    ['x < −2', '−2 a 1', '1 a 2', 'x > 2'].forEach(function (s, k) { tx(CX[k], 168, s, 'font-size:14px;fill:var(--lapis);text-anchor:middle', quadro); });
    var linhas = [['f', '+', '−', '−', '+', 'var(--ad-t)'], ['g', '−', '−', '+', '+', G], ['f · g', '−', '+', '−', '+', 'var(--tinta)']];
    linhas.forEach(function (ln, r) {
      var y = 196 + 28 * r;
      el('line', { x1: 304, x2: 604, y1: y - 20, y2: y - 20, style: 'stroke:var(--linha);stroke-width:1' }, quadro);
      tx(304, y, ln[0], 'font-size:15px;font-weight:700;font-style:italic;fill:' + ln[5], quadro);
      for (var k = 0; k < 4; k++) {
        if (r === 2 && ln[k + 1] === '−') el('rect', { x: CX[k] - CW / 2 + 3, y: y - 18, width: CW - 6, height: 24, rx: 6, style: 'fill:' + NEG + ';opacity:.16' }, quadro);
        tx(CX[k], y, ln[k + 1], 'font-size:17px;font-weight:700;text-anchor:middle;fill:' + (r === 2 && ln[k + 1] === '−' ? NEG : 'var(--tinta)'), quadro);
      }
    });
    var res = tx(304, 300, 'f · g < 0 para x < −2 ou 1 < x < 2', 'font-size:15.5px;font-weight:700;fill:' + NEG, quadro);
    var res2 = tx(304, 324, '(x = −2, 1 e 2 dão produto zero: fora)', 'font-size:15px;fill:var(--tinta)', quadro);
    function f(x) { return (x - 1) * (x - 1) - 1; }
    function caminho(F) { var d = ''; for (var x = -2.8; x <= 4.8; x += .04) { var y = F(x); d += (d ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(Math.max(-6, Math.min(6, y))).toFixed(1); } return d; }
    cBase.setAttribute('d', caminho(f));
    var TX = [
      ['1. f(x) + k: sobe ou desce', 'Base (tracejada): f(x) = (x − 1)² − 1.', 'Somar 2 FORA da função soma 2 em cada y:', 'o gráfico inteiro sobe 2.', 'Vértice: de (1; −1) para (1; 1).', 'f(x) − 2 desceria 2.'],
      ['2. f(x − h): anda para o lado', 'Mexer DENTRO do parêntese muda o x.', 'f(x − 2) faz em x = 3 o que f fazia', 'em x = 1: o gráfico anda 2 para a DIREITA.', 'Raízes 0 e 2 viram 2 e 4.', 'f(x + 2) andaria 2 para a esquerda.'],
      ['3. −f(x) e 2·f(x): mudam as alturas', '−f(x): cada y troca de sinal, a curva', 'espelha no eixo x (vértice vai a (1; 1)).', '2·f(x): cada y dobra, a curva estica na', 'vertical (vértice vai a (1; −2)).', 'Nos dois casos as raízes 0 e 2 não mudam.'],
      ['4. f(2x): muda a largura', 'f(2x) faz em x = 1 o que f fazia em x = 2:', 'tudo acontece na metade do x.', 'Raízes 0 e 2 viram 0 e 1; vértice (0,5; −1).', 'A altura não muda, só a largura cai à metade.', 'f(x/2) faria o contrário: largura dobra.'],
      ['5. Sinal do produto f · g', 'f(x) = (x² − 4) ÷ 2 e g(x) = x − 1.', 'f · g < 0 quando os sinais são opostos:', 'uma curva acima do eixo x, a outra abaixo.', '', '']
    ];
    var _desenha = function (t) {
      var fase = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.6 ? 2 : t < 11.4 ? 3 : 4;
      var A = 1, B = 1, h = 0, k = 0;
      if (fase === 0) k = 2 * ease((t - .7) / 1);
      else if (fase === 1) h = 2 * ease((t - 3.3) / 1);
      else if (fase === 2) A = t < 7.2 ? lerp(1, -1, ease((t - 5.9) / .8)) : lerp(1, 2, ease((t - 7.3) / .7));
      else if (fase === 3) B = lerp(1, 2, ease((t - 9.1) / 1));
      function Tf(x) { return A * f(B * (x - h)) + k; }
      var on = fase < 4;
      op(cBase, on ? 1 : 0); op(lBase, on ? 1 : 0); op(cMain, on ? 1 : 0); op(lMain, on ? 1 : 0);
      if (on) {
        cMain.setAttribute('d', caminho(Tf));
        [[0, 0], [2, 0], [1, -1]].forEach(function (p, m) { var X = p[0] / B + h, Y = A * p[1] + k; P[m].setAttribute('cx', px(X).toFixed(1)); P[m].setAttribute('cy', py(Y).toFixed(1)); op(P[m], 1); });
        lBase.setAttribute('x', px(-1.75)); lBase.setAttribute('y', py(3.2));
        var nome = fase === 0 ? (k > 1.99 ? 'f(x) + 2' : '') : fase === 1 ? (h > 1.99 ? 'f(x − 2)' : '') : fase === 2 ? (t > 6.7 && t < 7.25 ? '−f(x)' : t > 8 ? '2·f(x)' : '') : (B > 1.99 ? 'f(2x)' : '');
        lMain.textContent = nome;
        var LP = fase === 0 ? [3.3, 3] : fase === 1 ? [2, 3.3] : fase === 3 ? [2.4, 3.3] : t < 7.25 ? [3.3, -2.4] : [3.4, 2.6];
        lMain.setAttribute('x', px(LP[0])); lMain.setAttribute('y', py(LP[1]) + 5);
        var vx = 1 / B + h, vy = -A + k;
        lV.textContent = '(' + (vx === .5 ? '0,5' : Math.round(vx)) + '; ' + (Math.round(vy) < 0 ? '−' + (-Math.round(vy)) : Math.round(vy)) + ')';
        lV.setAttribute('x', px(vx) + 9); lV.setAttribute('y', py(vy) + (vy < 0 ? 18 : -10));
        op(lV, (fase === 0 && k > 1.99) || (fase === 1 && h > 1.99) || (fase === 2 && ((t > 6.7 && t < 7.25) || t > 8)) || (fase === 3 && B > 1.99) ? 1 : 0);
      } else { P.forEach(function (p) { op(p, 0); }); op(lV, 0); }
      /* -f fica marcado durante a parte do 2f */
      var esp = fase === 2 && t > 7.25;
      op(cEsp, esp ? 1 : 0); op(lEsp, esp ? 1 : 0);
      if (esp) { cEsp.setAttribute('d', caminho(function (x) { return -f(x); })); lEsp.setAttribute('x', px(2.75) + 8); lEsp.setAttribute('y', py(-f(2.75)) + 5); }
      /* fase 5: f e g, faixas onde f.g < 0 */
      var on5 = fase === 4, u5 = ease((t - 11.5) / .6), u6 = ease((t - 12.4) / .6);
      if (on5) {
        cMain.setAttribute('d', caminho(function (x) { return (x * x - 4) / 2; })); op(cMain, u5);
        cG.setAttribute('d', caminho(function (x) { return x - 1; })); op(cG, u5);
        lF.setAttribute('x', px(3) + 6); lF.setAttribute('y', py(2.5)); lG.setAttribute('x', px(3.6) + 6); lG.setAttribute('y', py(2.6) + 18);
        op(lF, u5); op(lG, u5);
      } else { op(cG, 0); op(lF, 0); op(lG, 0); }
      fx1.setAttribute('x', PX0); fx1.setAttribute('width', px(-2) - PX0); fx2.setAttribute('x', px(1)); fx2.setAttribute('width', px(2) - px(1));
      b1.setAttribute('x1', PX0); b1.setAttribute('x2', px(-2)); b2.setAttribute('x1', px(1)); b2.setAttribute('x2', px(2));
      op(faixas, on5 ? u6 : 0); op(bandas, on5 ? u6 : 0);
      var X = TX[fase]; T.textContent = X[0]; for (var m = 0; m < 5; m++) L[m].textContent = X[m + 1];
      op(quadro, on5 ? u6 : 0); painel.style.opacity = 1;
    };
    return fimResposta(VIS.def['transformacoes-graficos'], svg, _desenha, 16.4, RESP, qid, {
      x: 296, y: 60, w: 336, semEsmaecer: true, esconde: painel,
      congela: function (q) { return q === 'P5a9dff7' ? 11.2 : 16.35; }
    });
  }
};
VIS.liga('transformacoes-graficos', ['P5a9dff7', 'b3b7d1ec']);
