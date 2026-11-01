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
'P0814f1f': [
'Por isso a resposta é C',
'Aquecer favorece o sentido que absorve calor (endotérmico).',
'Em N₂ + O₂ ⇌ 2 NO o ΔH é > 0: o endotérmico é o direto, e o NO aumenta.',
'Pressão: 2 mol de gás = 2 mol, não desloca. Catalisador não desloca.'
],
'P12570ed': [
'Por isso a resposta é D',
'De I para II a T é a mesma e o volume cai de 10 L para 2 L: compressão.',
'Vai para o lado com menos mol de gás: exp. 2 (8 → 7) e exp. 3 (4 → 2).',
'Exp. 1 (2 → 4) vai para a esquerda; exp. 4 (2 = 2) não muda.'
],
'P15247b2': [
'Por isso a resposta é A',
'ΔH < 0, como no exemplo: esfriar (teste 2) favorece a direta → mais CH₄.',
'Adicionar H₂, um reagente (teste 4), também empurra para a direita.',
'Baixar a pressão vai para o lado com mais mol de gás (4): menos CH₄.'
],
'P63f2344': [
'Por isso a resposta é E',
'K caiu muito de 298 K para 700 K: aquecer desfavorece o SO₃.',
'Então a direta é exotérmica e é favorecida pela diminuição da T.',
'3 mol de gás → 2 mol: o SO₃ é favorecido pelo aumento da pressão.'
],
'P70d720f': [
'Por isso a resposta é D',
'2 CO + O₂ ⇌ 2 CO₂ tem 3 → 2 mol de gás e ΔH < 0, como o exemplo.',
'Diminuir o volume (4) desloca para a direita; esfriar (1) também.',
'Catalisador não desloca; mais volume e menos O₂ deslocam para a esquerda.'
],
'W677480a': [
'Por isso a resposta é A',
'Mais SO₂: o sistema gasta o excesso e anda para a direita.',
'Forma mais SO₃ e consome O₂ junto (2 SO₂ reagem com 1 O₂):',
'o SO₃ aumenta e o O₂ diminui.'
],
'W81c2313': [
'Por isso a resposta é B',
'Comprimir só desloca se os lados têm números diferentes de mol de GÁS.',
'Sólidos não contam: em B há 0 mol de gás à esquerda e 1 (CO₂) à direita.',
'Em A, C, D e E os dois lados empatam (2 = 2, 1 = 1, 3 = 3, 3 = 3).'
],
'Wa860c1b': [
'Por isso a resposta é C',
'Adicionar reagente ou produto desloca o equilíbrio, mas o sistema',
'anda até a razão das concentrações voltar ao mesmo K.',
'Com a temperatura constante, o valor de K não muda.'
],
'W6e7ad84': [
'Por isso a resposta é B',
'O equilíbrio chega quando as velocidades direta e inversa ficam iguais.',
'As duas reações continuam; as concentrações ficam constantes,',
'mas não precisam ser iguais nem o reagente acaba.'
],
'W7487764': [
'Por isso a resposta é B',
'Só um sistema fechado mantém equilíbrio: o que sai não volta.',
'Na garrafa fechada, CO₂ dissolvido ⇌ CO₂ gasoso, com as duas',
'velocidades iguais. Café, chama, fervura e feijão perdem matéria.'
],
'Wa8d2ad6': [
'Por isso a resposta é E',
'K = [produtos] ÷ [reagentes], com os expoentes da equação.',
'K grande: muito produto no equilíbrio. Quando o K do exemplo caiu',
'(aquecimento), o SO₃ caiu junto. K só muda com a temperatura.'
],
'P76a011b': [
'Por isso a resposta é B',
'ΔH > 0: dissolver o KNO₃ é endotérmico; o calor sai da água, que esfria.',
'Aquecer favorece o sentido endotérmico, aqui o da dissolução:',
'a solubilidade aumenta com a temperatura.'
],
'W58e5dc8': [
'Por isso a resposta é C',
'O equilíbrio I é como o exemplo: 3 → 2 mol de gás, libera 27 kcal.',
'Baixar a pressão (4) e aquecer (5) levam I para a esquerda: menos NO₂,',
'e sem NO₂ o equilíbrio II forma menos HNO₃.'
],
'Pcca7821': [
'Por isso a resposta é B',
'Mais ácido etanoico (reagente): o equilíbrio anda para a direita',
'e forma mais éster. Catalisador não desloca; aquecer (ΔH < 0) e',
'tirar butan-1-ol deslocam para a esquerda; sem gás, pressão não age.'
],
'W87e64a0': [
'Por isso a resposta é A',
'O H⁺ do limão neutraliza o OH⁻, um produto: é retirar produto.',
'O equilíbrio anda para a direita para repor o OH⁻ e,',
'nesse caminho, consome a metilamina, que é a que tem cheiro.'
],
'P1d39cfc': [
'Por isso a resposta é E',
'NaOH acrescenta OH⁻, produto de CN⁻ + H₂O ⇌ HCN(aq) + OH⁻:',
'o equilíbrio anda para a esquerda e o HCN(aq) diminui.',
'Com menos HCN(aq), escapa menos HCN(g). E o pH sobe.'
]
};
VIS.def['equilibrio-le-chatelier'] = {
  tit: 'Equilíbrio dinâmico e o princípio de Le Chatelier',
  fontes: ['OpenStax, Chemistry 2e, 13.1 Chemical Equilibria — https://openstax.org/books/chemistry-2e/pages/13-1-chemical-equilibria', 'OpenStax, Chemistry 2e, 13.3 Shifting Equilibria: Le Châtelier’s Principle — https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle', 'Wikipedia (en), Le Chatelier\'s principle — https://en.wikipedia.org/wiki/Le_Chatelier%27s_principle'],
  tipo: 'anim', dur: 14,
  marcas: [[0, 'Equilíbrio'], [2.8, '+ reagente'], [5.6, 'Comprimir'], [8.4, 'Aquecer'], [11.2, '− produto']],
  cred: 'Animação feita para o app. Concentrações calculadas com um K de exemplo (o gráfico é qualitativo; o número de moléculas no frasco acompanha a quantidade em mol).',
  nota: 'Catalisador não desloca equilíbrio: acelera a ida e a volta por igual e o sistema só chega mais depressa ao mesmo ponto. Só a temperatura muda o valor de K; concentração e pressão deslocam o equilíbrio, mas ele volta ao mesmo K.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var CS = ['#c98a12', '#c0392b', '#2b6cb0'];   /* SO2, O2, SO3 (cores das curvas) */
    var SA = '#e0b72a', OA = '#d04a3a';            /* atomos: S amarelo, O vermelho */
    svg.setAttribute('viewBox', '0 0 640 370');
    /* ---------- modelo: 2 SO2 + O2 <=> 2 SO3, K de exemplo ---------- */
    var K1 = 4, K2 = K1 / 6, TAU = .42, D = 2.8;
    function solve(c, K) {
      function Q(x) { return Math.pow(c[2] + 2 * x, 2) / (Math.pow(c[0] - 2 * x, 2) * (c[1] - x)); }
      var lo = -c[2] / 2 + 1e-9, hi = Math.min(c[0] / 2, c[1]) - 1e-9;
      for (var i = 0; i < 80; i++) { var m = (lo + hi) / 2; if (Q(m) < K) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    /* cada fase: concentracoes logo apos a perturbacao (c0), volume, K e avanco ate o equilibrio (xi) */
    var F = [], c = [2, 1.2, 0], V = 1;
    function fase(t0, K) { var xi = solve(c, K); F.push({ t0: t0, c0: c.slice(), V: V, K: K, xi: xi }); c = [c[0] - 2 * xi, c[1] - xi, c[2] + 2 * xi]; }
    fase(0, K1);
    c[0] += 1; fase(D, K1);                                   /* + SO2 */
    c = c.map(function (v) { return 2 * v; }); V = .5; fase(2 * D, K1);   /* V/2 */
    fase(3 * D, K2);                                          /* aquece: K menor */
    c[2] *= .3; fase(4 * D, K2);                              /* retira SO3 */
    function emF(f, t) { var u = 1 - Math.exp(-Math.max(0, t - f.t0) / TAU), x = f.xi * u; return [f.c0[0] - 2 * x, f.c0[1] - x, f.c0[2] + 2 * x]; }
    function estado(t) { var i = Math.min(4, Math.max(0, Math.floor(t / D))), f = F[i]; return { i: i, c: emF(f, t), V: f.V, K: f.K }; }
    /* ---------- topo: equacao ---------- */
    tx(16, 24, '2 SO₂(g) + O₂(g) ⇌ 2 SO₃(g)', 'font-size:17px;font-weight:700;fill:var(--tinta)');
    tx(262, 24, 'ΔH < 0 (a direta libera calor)', 'font-size:15px;fill:var(--lapis)');
    /* ---------- frasco com embolo ---------- */
    var BX = 16, BW = 196, BY0 = 56, BY1 = 172, BH = BY1 - BY0;
    el('path', { d: 'M' + BX + ' ' + BY0 + ' V' + BY1 + ' H' + (BX + BW) + ' V' + BY0, style: 'fill:none;stroke:var(--tinta);stroke-width:2.4' });
    var gas = el('rect', { x: BX + 1.5, width: BW - 3, style: 'fill:color-mix(in srgb,var(--ad-c) 6%,var(--folha))' });
    var emb = el('g', {});
    el('rect', { x: BX + 2, y: -7, width: BW - 4, height: 10, rx: 2, style: 'fill:var(--lapis)' }, emb);
    el('rect', { x: BX + BW / 2 - 5, y: -22, width: 10, height: 16, style: 'fill:var(--lapis)' }, emb);
    var fogo = el('g', {});
    for (var k = 0; k < 4; k++) el('path', { d: 'M' + (BX + 40 + 38 * k) + ' ' + (BY1 + 20) + ' q-7 -7 0 -14 q7 7 0 14 Z', style: 'fill:#e07a2a;stroke:#b4442f;stroke-width:1' }, fogo);
    /* moleculas: pool por especie, posicoes fixas pseudoaleatorias */
    var sem = 11; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    var POOL = 22, MOL = [[], [], []];
    function molecula(tipo) {
      var g = el('g', {});
      if (tipo === 0) {        /* SO2 angular, 119 graus */
        var a = 119.5 / 2 * Math.PI / 180;
        el('circle', { cx: (-6 * Math.sin(a)).toFixed(2), cy: (6 * Math.cos(a)).toFixed(2), r: 3.4, style: 'fill:' + OA }, g);
        el('circle', { cx: (6 * Math.sin(a)).toFixed(2), cy: (6 * Math.cos(a)).toFixed(2), r: 3.4, style: 'fill:' + OA }, g);
        el('circle', { cx: 0, cy: 0, r: 4.3, style: 'fill:' + SA + ';stroke:#8a6d10;stroke-width:.8' }, g);
      } else if (tipo === 1) { /* O2 */
        el('circle', { cx: -2.8, cy: 0, r: 3.4, style: 'fill:' + OA }, g);
        el('circle', { cx: 2.8, cy: 0, r: 3.4, style: 'fill:' + OA }, g);
      } else {                 /* SO3 trigonal plana, 120 graus */
        for (var j = 0; j < 3; j++) { var b = j * 2 * Math.PI / 3 - Math.PI / 2; el('circle', { cx: (6.2 * Math.cos(b)).toFixed(2), cy: (6.2 * Math.sin(b)).toFixed(2), r: 3.4, style: 'fill:' + OA }, g); }
        el('circle', { cx: 0, cy: 0, r: 4.3, style: 'fill:' + SA + ';stroke:#8a6d10;stroke-width:.8' }, g);
      }
      return g;
    }
    for (var s = 0; s < 3; s++) for (k = 0; k < POOL; k++) MOL[s].push({ g: molecula(s), u: rnd(), v: rnd(), f: rnd() * 6.28, r: rnd() * 360 });
    /* legenda das moleculas sob o frasco */
    var LG = [['SO₂', 0, BX + 4], ['O₂', 1, BX + 74], ['SO₃', 2, BX + 136]];
    LG.forEach(function (l) { var m = molecula(l[1]); m.setAttribute('transform', 'translate(' + (l[2] + 8) + ' ' + (BY1 + 38) + ')'); tx(l[2] + 20, BY1 + 43, l[0], 'font-size:14px;font-weight:700;fill:' + CS[l[1]]); });
    /* setas de velocidade direta / inversa */
    var VX = 222, vd = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-linecap:round' }), vi = el('path', { style: 'fill:none;stroke:var(--lapis);stroke-linecap:round' });
    var vdh = el('path', { style: 'fill:var(--ad-c)' }), vih = el('path', { style: 'fill:var(--lapis)' });
    tx(VX + 26, 86, 'direta', 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:middle');
    tx(VX + 26, 155, 'inversa', 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle');
    /* ---------- grafico concentracao x tempo ---------- */
    var GX0 = 300, GX1 = 590, GY0 = 192, GY1 = 66, CMAX = 4;
    function gx(t) { return GX0 + (GX1 - GX0) * t / (5 * D); }
    function gy(v) { return GY0 - (GY0 - GY1) * v / CMAX; }
    el('path', { d: 'M' + GX0 + ' ' + (GY1 - 8) + ' V' + GY0 + ' H' + (GX1 + 8), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' });
    tx(GX0 - 8, GY1 - 14, 'concentração', 'font-size:14px;font-weight:600;fill:var(--lapis)');
    tx(GX1 + 8, GY0 + 4, 't', 'font-size:14px;font-style:italic;fill:var(--lapis)');
    var LBL = ['+SO₂', 'V÷2', 'T↑', '−SO₃'];
    LBL.forEach(function (l, i) {
      var x = gx((i + 1) * D);
      el('line', { x1: x, x2: x, y1: GY1 - 4, y2: GY0, style: 'stroke:var(--linha);stroke-width:1.2;stroke-dasharray:4 4' });
      tx(x, GY0 + 18, l, 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle');
    });
    var CUR = CS.map(function (cor) { return el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:2.6;stroke-linejoin:round' }); });
    var CT = ['SO₂', 'O₂', 'SO₃'].map(function (n, i) { return tx(0, 0, n, 'font-size:14px;font-weight:700;fill:' + CS[i]); });
    var ponto = el('line', { style: 'stroke:var(--ad-c);stroke-width:1.5' });
    var kTx = tx(GX0 + 8, GY1 + 2, '', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
    /* ---------- painel de texto ---------- */
    el('line', { x1: 16, x2: 624, y1: 236, y2: 236, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 262, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [288, 312, 336, 360].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Equilíbrio dinâmico (frasco fechado)', 'SO₂ e O₂ formam SO₃ e, ao mesmo tempo, o SO₃ se desfaz.', 'No começo a direta é mais rápida; as duas velocidades vão se igualando.', 'Velocidades iguais: as concentrações param de mudar (mas não ficam iguais).'],
      ['Adicionar reagente: SO₂', 'O sistema gasta o excesso e anda para a direita (→).', 'Forma mais SO₃ e consome O₂ junto (2 SO₂ reagem com 1 O₂).', 'Ao final a razão das concentrações volta ao mesmo K.'],
      ['Comprimir: volume ÷ 2, pressão ↑', 'Na hora, tudo fica 2× mais concentrado. Depois o sistema vai para', 'o lado com menos mol de gás: 3 mol → 2 mol, direita (→).', 'Mesmo número de mol de gás nos dois lados: não desloca. Sólido não conta.'],
      ['Aquecer: temperatura ↑', 'ΔH < 0: a direta libera calor e a inversa absorve calor.', 'Aquecer favorece o sentido que absorve (endotérmico): ←, menos SO₃.', 'Só a temperatura muda K: aqui K diminui. Esfriar faria o contrário.'],
      ['Retirar produto: SO₃', 'Tirou SO₃ (por exemplo, outra reação o consome): o sistema', 'anda para a direita (→) e repõe parte do que saiu.', 'Equilíbrios ligados: se outra reação gasta uma espécie, este anda para repô-la.']
    ];
    function curva(i, tFim) {
      var d = '';
      for (var f = 0; f < 5; f++) {
        var a = F[f].t0, b = Math.min(tFim, a + D); if (b <= a) break;
        for (var t = a; t < b; t += .07) d += (d ? 'L' : 'M') + gx(t).toFixed(1) + ' ' + gy(emF(F[f], t)[i]).toFixed(1) + ' ';
        d += 'L' + gx(b).toFixed(1) + ' ' + gy(emF(F[f], b)[i]).toFixed(1) + ' ';
      }
      return d;
    }
    var _desenha = function (t) {
      var e = estado(t), i = e.i;
      /* frasco */
      var yTop = BY1 - BH * e.V;
      if (i === 2) { var v = 1 - .5 * ease((t - 2 * D) / .35); yTop = BY1 - BH * v; }
      gas.setAttribute('y', yTop.toFixed(1)); gas.setAttribute('height', (BY1 - yTop - 1.5).toFixed(1));
      emb.setAttribute('transform', 'translate(0 ' + yTop.toFixed(1) + ')');
      op(fogo, i >= 3 ? 1 : 0);
      for (var s = 0; s < 3; s++) {
        var n = Math.round(e.c[s] * e.V * 6);
        MOL[s].forEach(function (m, j) {
          var x = BX + 12 + (BW - 24) * ((m.u + .03 * Math.sin(t * 1.3 + m.f)) % 1), y = yTop + 12 + (BY1 - yTop - 24) * ((m.v + .04 * Math.cos(t * 1.1 + m.f) + 1) % 1);
          m.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (m.r + 40 * t).toFixed(0) + ')');
          op(m.g, j < n ? 1 : 0);
        });
      }
      /* velocidades (unidades do exemplo): vd = kd[SO2]^2[O2], vi = ki[SO3]^2 */
      var ki = i >= 3 ? 12 : 1, rd = e.K * ki * e.c[0] * e.c[0] * e.c[1], ri = ki * e.c[2] * e.c[2];
      function w(r) { return Math.max(2, Math.min(14, 2 + 1.9 * Math.sqrt(r))); }
      var wd = w(rd), wi = w(ri);
      vd.setAttribute('d', 'M' + (VX + 2) + ' 104 H' + (VX + 40)); vd.style.strokeWidth = wd.toFixed(1);
      vdh.setAttribute('d', 'M' + (VX + 40) + ' ' + (104 - wd / 2 - 5).toFixed(1) + ' L' + (VX + 54) + ' 104 L' + (VX + 40) + ' ' + (104 + wd / 2 + 5).toFixed(1) + ' Z');
      vi.setAttribute('d', 'M' + (VX + 14) + ' 130 H' + (VX + 52)); vi.style.strokeWidth = wi.toFixed(1);
      vih.setAttribute('d', 'M' + (VX + 14) + ' ' + (130 - wi / 2 - 5).toFixed(1) + ' L' + VX + ' 130 L' + (VX + 14) + ' ' + (130 + wi / 2 + 5).toFixed(1) + ' Z');
      /* grafico */
      var yl = [];
      for (s = 0; s < 3; s++) { CUR[s].setAttribute('d', curva(s, t)); yl.push(gy(e.c[s])); }
      var ord = [0, 1, 2].sort(function (a, b) { return yl[a] - yl[b]; }), last = -99;
      ord.forEach(function (s) { var y = Math.max(yl[s] + 5, last + 16); last = y; CT[s].setAttribute('x', (gx(t) + 6).toFixed(1)); CT[s].setAttribute('y', y.toFixed(1)); op(CT[s], t > .3 ? 1 : 0); });
      ponto.setAttribute('x1', gx(t).toFixed(1)); ponto.setAttribute('x2', gx(t).toFixed(1)); ponto.setAttribute('y1', GY1 - 4); ponto.setAttribute('y2', GY0);
      kTx.textContent = i === 1 && t - D > 1.2 ? 'mesmo K' : i === 3 && t - 3 * D > .6 ? 'K menor' : i === 2 && t - 2 * D > 1.2 ? 'mesmo K' : '';
      kTx.setAttribute('x', (gx(i * D) + 6).toFixed(1));
      /* texto */
      var L = TXT[i]; p0.textContent = L[0]; P.forEach(function (p, j) { p.textContent = L[j + 1] || ''; });
    };
    var CG = { 'W6e7ad84': D - .1, 'W7487764': D - .1, 'W677480a': 2 * D - .1, 'Wa860c1b': 2 * D - .1, 'Pcca7821': 2 * D - .1, 'P1d39cfc': 2 * D - .1, 'P12570ed': 3 * D - .1, 'W81c2313': 3 * D - .1, 'P70d720f': 3 * D - .1 };
    return fimResposta(VIS.def['equilibrio-le-chatelier'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : q === 'W87e64a0' ? 5 * D - .02 : 4 * D - .1; }
    });
  }
};
VIS.liga('equilibrio-le-chatelier', ['P0814f1f', 'P12570ed', 'P15247b2', 'P63f2344', 'P70d720f', 'W677480a', 'W81c2313', 'Wa860c1b', 'W6e7ad84', 'W7487764', 'Wa8d2ad6', 'P76a011b', 'W58e5dc8', 'Pcca7821', 'W87e64a0', 'P1d39cfc']);
