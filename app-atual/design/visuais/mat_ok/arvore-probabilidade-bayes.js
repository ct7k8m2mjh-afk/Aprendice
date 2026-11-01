/* Arvore de probabilidades em contagens (10 000 pessoas; prevalencia 4%, sensibilidade 90%, especificidade 95%),
   probabilidade condicional olhando so os positivos (Bayes) e a regra dos caminhos: multiplica ao longo do galho,
   soma caminhos que nao se sobrepoem (urna 3 vermelhas + 2 azuis, sem reposicao). */
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
'E4e0d261': [
'Por isso a resposta é C',
'Em 1 000 geladeiras: A 400, B 200, C 400. Defeituosas: 4, 2 e 20, total 26.',
'O universo encolhe para as 26 defeituosas: P(B | defeito) = 2 ÷ 26 = 1/13.'
],
'Eaeeca7d': [
'Por isso a resposta é C',
'Galho coroa (viciado): ½ · ¼ · ¼ = 1/32 = 4/128.',
'Galho cara (honesto): ½ · ⅛ · ⅛ = 1/128. "Saiu 1 duas vezes": 5/128.',
'Só nesse universo: P(coroa | 1 e 1) = 4 ÷ 5 = 4/5.'
],
'P40630c1': [
'Por isso a resposta é A',
'Em 1 000 mensagens: 100 maliciosas → 95 alertas; 900 normais → 27 alertas falsos.',
'Só entre os 122 alertas: 95 ÷ 122 ≈ 0,78 = 78%.'
],
'e7cbdda3': [
'Por isso a resposta é E',
'Em 10 000: 200 infectados → 180 positivos; 9 800 sadios → 294 falsos positivos.',
'Só entre os 474 positivos: 180 ÷ 474 ≈ 0,38 = 38%.'
],
'P228b516': [
'Por isso a resposta é E',
'Caminhos até F: A→C→F = 0,2 · 0,6 = 0,12; A→B→C→F = 0,8 · 0,1 · 0,6 = 0,048;',
'A→B→D→F = 0,8 · 0,9 · 0,3 = 0,216. Somando: 0,12 + 0,048 + 0,216 = 0,384.'
],
'Pe92b4a2': [
'Por isso a resposta é B',
'Time 1 até a final: 0,6 · 0,5 = 0,30. Time 5: 0,25. Time 7: 0,45 · 0,5 = 0,225.',
'5 ou 7 são caminhos que não se sobrepõem: 0,25 + 0,225 = 0,475.',
'Lados independentes multiplicam: 0,30 · 0,475 = 0,1425 = 14,25%.'
],
'a2b339b5': [
'Por isso a resposta é B',
'Sem reposição, a 2.ª retirada é entre 14 bolas. Mesma cor = PP, BB ou VV:',
'6/15 · 5/14 + 5/15 · 4/14 + 4/15 · 3/14 = (30 + 20 + 12) ÷ 210',
'= 62/210 ≈ 29,5%, entre 25% e 35%.'
]
};
VIS.def['arvore-probabilidade-bayes'] = {
  tit: 'Árvore de probabilidades e probabilidade condicional',
  fontes: [
    'OpenStax, Introductory Statistics 2e, 3.5 Tree and Venn Diagrams — https://openstax.org/books/introductory-statistics-2e/pages/3-5-tree-and-venn-diagrams',
    'Wikipedia (en), Positive and negative predictive values — https://en.wikipedia.org/wiki/Positive_and_negative_predictive_values',
    "Wikipedia (en), Bayes' theorem — https://en.wikipedia.org/wiki/Bayes%27_theorem"
  ],
  tipo: 'anim', dur: 10.5,
  marcas: [[0, '1. Contagens'], [3.5, '2. Positivos'], [7, '3. Caminhos']],
  cred: 'Animação feita para o app. Exemplo de teste: prevalência 4%, sensibilidade 90%, especificidade 95%; urna com 3 vermelhas e 2 azuis.',
  nota: 'P(A | B) = P(A e B) ÷ P(B): olhe só os casos em que B aconteceu. Ao longo de um caminho da árvore as probabilidades se multiplicam; caminhos diferentes que levam ao mesmo resultado (e não se sobrepõem) se somam.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    var TF = 10.5, POS = '#c0392b', VP = '#c0392b', FP = '#c98a12', VER = '#b4442f', AZU = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 350');
    var G = el('g', {});
    function lim() { while (G.firstChild) G.removeChild(G.firstChild); }
    function lb(x, y, s, st) { return tx(x, y, s, st || 'font-size:14px;font-weight:700;fill:var(--tinta)', G); }
    function no(x, y, w, s, cor, op, forte) {
      var g = el('g', { style: 'opacity:' + op.toFixed(2) }, G);
      el('rect', { x: x - w / 2, y: y - 14, width: w, height: 28, rx: 8, style: 'fill:color-mix(in srgb,' + (cor || 'var(--lapis)') + ' ' + (forte ? 30 : 12) + '%,var(--folha));stroke:' + (cor || 'var(--lapis)') + ';stroke-width:' + (forte ? 2.4 : 1.4) }, g);
      tx(x, y + 5, s, 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
    }
    function ramo(x1, y1, x2, y2, s, op, cor, larg) {
      var g = el('g', { style: 'opacity:' + op.toFixed(2) }, G);
      el('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:' + (cor || 'var(--lapis)') + ';stroke-width:' + (larg || 1.6) }, g);
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      tx(mx - 4, my + (y2 < y1 ? -6 : 16), s, 'font-size:14px;font-weight:600;fill:var(--lapis);text-anchor:end', g);
    }
    el('rect', { x: 404, y: 16, width: 226, height: 182, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var K = []; for (var i = 0; i < 4; i++) K.push(tx(418, 44 + 30 * i, '', 'font-size:15px;fill:var(--tinta)'));
    var K5 = tx(418, 184, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Troque porcentagens por pessoas', 'Imagine 10 000 pessoas. 4% doentes: 400; sadias: 9 600.', 'O teste acusa 90% dos doentes (360) e, por engano, 5% dos sadios (480).', 'Cada galho multiplica: 10 000 · 0,04 · 0,90 = 360.'],
      ['2. Deu positivo? Olhe só os positivos', 'O universo encolhe para os 360 + 480 = 840 positivos.', 'P(doente | positivo) = 360 ÷ 840 = 3/7 ≈ 43%.', 'Doença rara: mesmo com bom teste, muitos positivos são falsos.'],
      ['3. Caminhos: multiplique ao longo, some entre eles', 'Urna com 3 vermelhas e 2 azuis; tiro 2 bolas sem repor (a 2.ª é entre 4).', 'Duas vermelhas: 3/5 · 2/4 = 6/20. Duas azuis: 2/5 · 1/4 = 2/20.', 'Mesma cor = VV ou AA, que não se sobrepõem: 6/20 + 2/20 = 8/20 = 0,4.']
    ];
    var _desenha = function (t) {
      var f = t < 3.5 ? 0 : t < 7 ? 1 : 2, KT;
      lim();
      if (f < 2) {
        var a1 = f ? 1 : ease((t - .3) / .8), a2 = f ? 1 : ease((t - 1.3) / .9), foco = f === 1 ? ease((t - 3.7) / .6) : 0;
        var R = [34, 104], D = [150, 54], S = [150, 154], L = [[292, 22], [292, 78], [292, 128], [292, 184]];
        ramo(R[0] + 30, R[1], D[0] - 50, D[1], '4%', a1); ramo(R[0] + 30, R[1], S[0] - 50, S[1], '96%', a1);
        ramo(D[0] + 50, D[1], L[0][0] - 46, L[0][1], '90%', a2, foco ? VP : null, foco ? 2.6 : 1.6); ramo(D[0] + 50, D[1], L[1][0] - 46, L[1][1], '10%', a2 * (1 - .65 * foco));
        ramo(S[0] + 50, S[1], L[2][0] - 46, L[2][1], '5%', a2, foco ? FP : null, foco ? 2.6 : 1.6); ramo(S[0] + 50, S[1], L[3][0] - 46, L[3][1], '95%', a2 * (1 - .65 * foco));
        no(R[0], R[1], 60, '10 000', null, 1);
        no(D[0], D[1], 100, 'doentes 400', null, a1); no(S[0], S[1], 100, 'sadios 9 600', null, a1);
        no(L[0][0], L[0][1], 92, '+ 360', VP, a2, foco > .5); no(L[1][0], L[1][1], 92, '− 40', null, a2 * (1 - .65 * foco));
        no(L[2][0], L[2][1], 92, '+ 480', FP, a2, foco > .5); no(L[3][0], L[3][1], 92, '− 9 120', null, a2 * (1 - .65 * foco));
        if (foco > .5) { lb(L[0][0] + 52, L[0][1] + 5, 'doentes', 'font-size:14px;font-weight:700;fill:' + VP); lb(L[2][0] + 52, L[2][1] + 5, 'sadios', 'font-size:14px;font-weight:700;fill:#a06d0c'); }
        KT = f === 0 ? ['doentes: 4% de 10 000 = 400', 'sadios: 9 600', 'positivos doentes: 360', 'positivos sadios: 480', '840 positivos'] :
          ['positivos: 360 + 480 = 840', 'doentes entre eles: 360', 'P = 360 ÷ 840', '', '= 3/7 ≈ 43%'];
      } else {
        var b1 = ease((t - 7.2) / .7), b2 = ease((t - 8) / .8), hl = ease((t - 9) / .5);
        var R2 = [30, 104], V = [150, 54], A = [150, 154], F = [[292, 22], [292, 80], [292, 128], [292, 186]];
        ramo(R2[0] + 22, R2[1], V[0] - 34, V[1], '3/5', b1, hl ? VER : null, hl ? 2.6 : 1.6); ramo(R2[0] + 22, R2[1], A[0] - 34, A[1], '2/5', b1, hl ? AZU : null, hl ? 2.6 : 1.6);
        ramo(V[0] + 34, V[1], F[0][0] - 40, F[0][1], '2/4', b2, hl ? VER : null, hl ? 2.6 : 1.6); ramo(V[0] + 34, V[1], F[1][0] - 40, F[1][1], '2/4', b2 * (1 - .6 * hl));
        ramo(A[0] + 34, A[1], F[2][0] - 40, F[2][1], '3/4', b2 * (1 - .6 * hl)); ramo(A[0] + 34, A[1], F[3][0] - 40, F[3][1], '1/4', b2, hl ? AZU : null, hl ? 2.6 : 1.6);
        no(R2[0], R2[1], 44, 'urna', null, 1);
        no(V[0], V[1], 68, '1.ª V', VER, b1); no(A[0], A[1], 68, '1.ª A', AZU, b1);
        no(F[0][0], F[0][1], 80, 'V V', VER, b2, hl > .5); no(F[1][0], F[1][1], 80, 'V A', null, b2 * (1 - .6 * hl));
        no(F[2][0], F[2][1], 80, 'A V', null, b2 * (1 - .6 * hl)); no(F[3][0], F[3][1], 80, 'A A', AZU, b2, hl > .5);
        if (hl > .5) { lb(F[0][0] + 46, F[0][1] + 5, '= 6/20', 'font-size:14px;font-weight:700;fill:' + VER); lb(F[3][0] + 46, F[3][1] + 5, '= 2/20', 'font-size:14px;font-weight:700;fill:' + AZU); }
        KT = ['ao longo: multiplica', 'VV: 3/5 · 2/4 = 6/20', 'AA: 2/5 · 1/4 = 2/20', 'entre caminhos: soma', 'P = 8/20 = 0,4'];
      }
      for (j = 0; j < 4; j++) K[j].textContent = KT[j]; K5.textContent = KT[4];
      var Lt = TXT[f]; for (j = 0; j < 5; j++) P[j].textContent = Lt[j] || '';
    };
    var CG = { 'E4e0d261': 6.95, 'Eaeeca7d': 6.95, 'P40630c1': 6.95, 'e7cbdda3': 6.95, 'P228b516': 10.45, 'Pe92b4a2': 10.45, 'a2b339b5': 10.45 };
    return fimResposta(VIS.def['arvore-probabilidade-bayes'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] || TF - .01; }
    });
  }
};
VIS.liga('arvore-probabilidade-bayes', ['E4e0d261', 'Eaeeca7d', 'P40630c1', 'e7cbdda3', 'P228b516', 'Pe92b4a2', 'a2b339b5']);
