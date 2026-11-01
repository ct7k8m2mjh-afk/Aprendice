/* Quadro de Punnett no monoibridismo: BB x Bb (100%), Bb x Bb (3:1), Bb x bb (1:1, cruzamento-teste)
   e a inferencia "pais iguais com filho diferente -> pais heterozigotos, traco dos pais dominante". */
/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid). */
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
'W8f1fadc': [
'Por isso a resposta é E',
'O pai BB só forma gametas B: todo filhote recebe pelo menos um B (BB ou Bb).',
'Como B domina b, 100% dos filhotes nascem pretos; bb é impossível aqui.'
],
'Wdeae1b4': [
'Por isso a resposta é C',
'Pais polidáctilos com filho normal: a polidactilia é dominante e os pais são Pp.',
'Normal (pp) = 1/4; ser menina = 1/2 (sorteio à parte). 1/4 × 1/2 = 1/8.'
],
'Wb39cd7e': [
'Por isso a resposta é B',
'Branco × branco teve filhote preto: aqui o preto é o recessivo (aa, casa clara).',
'Macho Aa e fêmea branca Aa; fêmea preta aa. Aa × aa dá 1 : 1 (3 e 3), como na etapa 3.'
],
'W46abd93': [
'Por isso a resposta é E',
'Pais AA ou aa só teriam filhos iguais a eles. O filho diferente é aa e recebeu',
'um a de cada pai, que mostram o fenótipo dominante: os dois pais são Aa.'
]
};
VIS.def['punnett-monoibridismo'] = {
  tit: 'Quadro de Punnett: um alelo de cada pai em cada filho',
  fontes: ['OpenStax, Biology 2e, 12.2 Characteristics and Traits (quadro de Punnett, dominante e recessivo, cruzamento-teste 1 : 1) — https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits', 'OpenStax, Biology 2e, 12.3 Laws of Inheritance (segregação: cada gameta leva um alelo; regra do produto) — https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance', 'Wikipedia (en), Punnett square — https://en.wikipedia.org/wiki/Punnett_square'],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. BB × Bb'], [3, '2. Bb × Bb'], [6, '3. Bb × bb'], [9, '4. Dedução']],
  cred: 'Animação feita para o app (esquema; nas etapas 1 a 3, B = pelo preto, dominante, e b = branco, recessivo).',
  nota: 'Cada gameta leva um só alelo do par; o quadro cruza todos os gametas de um pai com todos os do outro, e cada casa tem a mesma chance. Quando pais com o mesmo fenótipo têm um filho diferente, o fenótipo do filho é o recessivo e os dois pais são heterozigotos.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 360');
    var ESC = '#3a3a3a', CLA = '#ffffff', DESTAQUE = '#d9822b';
    function dom(g) { return /[A-Z]/.test(g); }
    function ord(a, b) { return (a === a.toUpperCase() ? a + b : b + a); }
    /* pais */
    var pA = el('g', {}), pB = el('g', {});
    var pAc = el('circle', { cx: 216, cy: 20, r: 10, style: 'stroke:var(--tinta);stroke-width:1.8' }, pA);
    var pAt = tx(234, 25, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', pA);
    var pBc = el('circle', { cx: 30, cy: 148, r: 10, style: 'stroke:var(--tinta);stroke-width:1.8' }, pB);
    var pBt = tx(46, 153, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', pB);
    tx(22, 176, 'gametas →', 'font-size:13px;fill:var(--lapis)', pB);
    var gTop = tx(216, 47, 'gametas ↓', 'font-size:13px;fill:var(--lapis)');
    /* quadro */
    var GX = 186, GY = 76, C = 72;
    var hT = [0, 1].map(function (i) { var g = el('g', {}); el('circle', { cx: GX + C * i + C / 2, cy: 62, r: 12, style: 'fill:color-mix(in srgb,var(--ad-c) 14%,var(--folha));stroke:var(--ad-c);stroke-width:1.6' }, g); var t = tx(GX + C * i + C / 2, 67.5, '', 'font-size:15px;font-weight:700;fill:var(--ad-t);text-anchor:middle', g); return { g: g, t: t }; });
    var hL = [0, 1].map(function (i) { var g = el('g', {}); el('circle', { cx: GX - 18, cy: GY + C * i + C / 2, r: 12, style: 'fill:color-mix(in srgb,var(--ad-c) 14%,var(--folha));stroke:var(--ad-c);stroke-width:1.6' }, g); var t = tx(GX - 18, GY + C * i + C / 2 + 5.5, '', 'font-size:15px;font-weight:700;fill:var(--ad-t);text-anchor:middle', g); return { g: g, t: t }; });
    var cel = [];
    for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
      var g = el('g', {});
      var r = el('rect', { x: GX + C * j + 3, y: GY + C * i + 3, width: C - 6, height: C - 6, rx: 8, style: 'stroke:var(--tinta);stroke-width:1.5' }, g);
      var t = tx(GX + C * j + C / 2, GY + C * i + C / 2 + 7, '', 'font-size:19px;font-weight:700;text-anchor:middle', g);
      cel.push({ g: g, r: r, t: t, i: i, j: j });
    }
    el('rect', { x: GX, y: GY, width: 2 * C, height: 2 * C, rx: 4, style: 'fill:none;stroke:var(--linha);stroke-width:1.2' });
    var anel = el('rect', { width: C + 2, height: C + 2, rx: 10, style: 'fill:none;stroke:' + DESTAQUE + ';stroke-width:4' });
    /* resultado */
    var RX = 380;
    var rT = tx(RX, 30, 'Filhos (cada casa = 1/4)', 'font-size:14.5px;font-weight:700;fill:var(--tinta)');
    var rL = [0, 1, 2].map(function (k) { return tx(RX, 58 + 22 * k, '', 'font-size:14.5px;fill:var(--tinta)'); });
    var barE = el('rect', { x: RX, y: 136, height: 28, style: 'fill:' + ESC });
    var barC = el('rect', { y: 136, height: 28, style: 'fill:' + CLA + ';stroke:var(--tinta);stroke-width:1.2' });
    el('rect', { x: RX, y: 136, width: 240, height: 28, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' });
    var bE = tx(RX, 184, '', 'font-size:14px;font-weight:700;fill:var(--tinta)');
    var bC = tx(RX + 240, 184, '', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:end');
    var conc = tx(RX, 214, '', 'font-size:14.5px;font-weight:700;fill:var(--ad-t)');
    /* etapa 4: heredograma */
    var H = el('g', {});
    tx(20, 24, 'Heredograma', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', H);
    el('rect', { x: 26, y: 54, width: 28, height: 28, style: 'fill:' + ESC + ';stroke:var(--tinta);stroke-width:2' }, H);
    el('circle', { cx: 124, cy: 68, r: 14, style: 'fill:' + ESC + ';stroke:var(--tinta);stroke-width:2' }, H);
    el('path', { d: 'M54 68 H110 M82 68 V112 H82', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, H);
    el('rect', { x: 68, y: 114, width: 28, height: 28, style: 'fill:' + CLA + ';stroke:var(--tinta);stroke-width:2' }, H);
    var hg = el('g', {}, H);
    tx(40, 102, 'Aa', 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:middle', hg);
    tx(124, 102, 'Aa', 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:middle', hg);
    tx(82, 162, 'aa', 'font-size:14px;font-weight:700;fill:' + DESTAQUE + ';text-anchor:middle', hg);
    tx(20, 196, 'pais: mesmo fenótipo', 'font-size:13px;fill:var(--lapis)', H);
    tx(20, 214, 'filho: fenótipo diferente', 'font-size:13px;fill:var(--lapis)', H);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(L) { P0.textContent = L[0]; P.forEach(function (p, i) { p.textContent = L[i + 1] || ''; }); }
    var CRUZ = [
      { a: 'BB', b: 'Bb', res: [['BB', '2/4 = 1/2', 'preto'], ['Bb', '2/4 = 1/2', 'preto']], fe: 1, le: '100% pretos', lc: '', conc: 'nenhum bb: 100% pretos' },
      { a: 'Bb', b: 'Bb', res: [['BB', '1/4', 'preto'], ['Bb', '2/4', 'preto'], ['bb', '1/4', 'branco']], fe: .75, le: '3/4 pretos', lc: '1/4 brancos', conc: '3 : 1' },
      { a: 'Bb', b: 'bb', res: [['Bb', '2/4 = 1/2', 'preto'], ['bb', '2/4 = 1/2', 'branco']], fe: .5, le: '1/2 pretos', lc: '1/2 brancos', conc: '1 : 1 → o pai preto é Bb' },
      { a: 'Aa', b: 'Aa', res: [['AA', '1/4', 'dominante'], ['Aa', '2/4', 'dominante'], ['aa', '1/4', 'o diferente']], fe: .75, le: '3/4 como os pais', lc: '1/4 aa', conc: 'só Aa × Aa gera o aa' }
    ];
    var TXT = [
      ['1. BB × Bb: cada gameta leva um só alelo', 'BB só forma gametas B; Bb forma metade B e metade b. O quadro cruza todos.', 'Todo filhote recebe pelo menos um B, que domina o b: 100% pretos.'],
      ['2. Bb × Bb', 'Os dois formam gametas B e b (1/2 cada): saem 1/4 BB, 2/4 Bb e 1/4 bb.', '3/4 pretos e 1/4 brancos: o branco só aparece com dois b (bb).'],
      ['3. Bb × bb: cruzamento-teste', 'O bb só manda b; o resultado depende do gameta do outro pai (B ou b).', 'Metade pretos, metade brancos (1 : 1): o pai preto é heterozigoto.'],
      ['4. Pais iguais, filho diferente', 'Pais AA ou aa só teriam filhos iguais a eles. Então os dois são Aa:', 'o traço dos pais é o dominante e o filho diferente é o aa (1/4).']
    ];
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3, t0 = [0, 3, 6, 9][f], u = t - t0, X = CRUZ[f];
      var ga = [X.a[0], X.a[1]], gb = [X.b[0], X.b[1]];
      pAc.style.fill = dom(X.a) ? ESC : CLA; pBc.style.fill = dom(X.b) ? ESC : CLA;
      pAt.textContent = f < 3 ? 'pai 1: ' + X.a + (dom(X.a) ? ' (preto)' : ' (branco)') : 'pai Aa × mãe Aa';
      pBt.textContent = 'pai 2: ' + X.b + (dom(X.b) ? ' (preto)' : ' (branco)');
      op(pA, cl(u / .3)); op(pB, cl(u / .3)); op(gTop, cl((u - .3) / .3));
      hT.forEach(function (h, k) { h.t.textContent = ga[k]; op(h.g, cl((u - .4 - k * .15) / .3)); });
      hL.forEach(function (h, k) { h.t.textContent = gb[k]; op(h.g, cl((u - .4 - k * .15) / .3)); });
      cel.forEach(function (c, k) {
        var gt = ord(ga[c.j], gb[c.i]), on = cl((u - .9 - k * .22) / .25);
        c.t.textContent = gt; var d = dom(gt);
        c.r.style.fill = d ? ESC : CLA; c.t.style.fill = d ? '#fff' : 'var(--tinta)';
        op(c.g, on);
      });
      var alvo = -1; cel.forEach(function (c, k) { if (f === 3 && !dom(c.t.textContent)) alvo = k; });
      if (alvo >= 0) { anel.setAttribute('x', GX + C * cel[alvo].j + 2); anel.setAttribute('y', GY + C * cel[alvo].i + 2); }
      op(anel, alvo >= 0 ? cl((u - 2.1) / .3) : 0);
      op(rT, cl((u - 1.6) / .3));
      rL.forEach(function (l, k) { var r = X.res[k]; l.textContent = r ? r[0] + '  ' + r[1] + '  (' + r[2] + ')' : ''; op(l, cl((u - 1.7 - k * .15) / .3)); });
      var bw = 240 * X.fe * cl((u - 2.0) / .5);
      barE.setAttribute('width', bw.toFixed(1)); barC.setAttribute('x', (RX + bw).toFixed(1)); barC.setAttribute('width', Math.max(0, 240 * (1 - X.fe) * cl((u - 2.0) / .5)).toFixed(1));
      bE.textContent = X.le; bC.textContent = X.lc; op(bE, cl((u - 2.2) / .3)); op(bC, cl((u - 2.2) / .3));
      conc.textContent = X.conc; op(conc, cl((u - 2.3) / .3));
      op(H, f === 3 ? cl(u / .3) : 0); H.style.display = f === 3 ? '' : 'none';
      op(hg, cl((u - 1.2) / .3));
      pB.style.display = f === 3 ? 'none' : '';
      painel(TXT[f]);
    };
    return fimResposta(VIS.def['punnett-monoibridismo'], svg, _desenha, 12, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W8f1fadc' ? 2.95 : 11.95; }
    });
  }
};
VIS.liga('punnett-monoibridismo', ['W8f1fadc', 'Wdeae1b4', 'Wb39cd7e', 'W46abd93']);
