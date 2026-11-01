VIS.def['magnificacao-trofica'] = {
  tit: 'Magnificação trófica: o mercúrio fica mais concentrado a cada nível',
  fontes: ['OpenStax Biology 2e, 46.1 Ecology of Ecosystems (biological magnification) — https://openstax.org/books/biology-2e/pages/46-1-ecology-of-ecosystems', 'Biomagnification (Wikipedia) — https://en.wikipedia.org/wiki/Biomagnification'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (esquema fora de escala; números de partículas ilustrativos: na natureza a concentração pode aumentar milhares de vezes do plâncton ao predador).',
  marcas: [[0, 'Bactérias'], [2.4, 'Fitoplâncton'], [6.6, 'Predador'], [9, 'Topo']],
  nota: 'O metilmercúrio (como o DDT) é lipossolúvel e quase não é eliminado: fica guardado no corpo. Cada consumidor come muitas presas e soma o poluente de todas elas num corpo só, então a concentração sobe a cada nível. Os produtores também se contaminam (são a porta de entrada), e a contaminação sai da água para aves e pessoas que comem peixe.',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var HG = '#8a8f98', MHG = '#c0267a';
    /* agua */
    el('rect', { x: 8, y: 44, width: 624, height: 166, rx: 10, style: 'fill:#d9ecf7' });
    el('path', { d: 'M8 186 Q120 176 180 192 T360 190 T632 188 V210 H8Z', style: 'fill:#b9a27d;opacity:.8' });
    var COL = [[14, 120, 'Sedimento', 'alagado, sem O₂'], [130, 236, 'Fitoplâncton', 'produtor'], [246, 372, 'Peixes', 'pequenos'], [382, 522, 'Peixe', 'predador'], [532, 632, 'Pessoas e', 'aves (fora d’água)']];
    COL.forEach(function (c, i) {
      tx({ x: (c[0] + c[1]) / 2, y: 18, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;' + TXT }, c[2]);
      tx({ x: (c[0] + c[1]) / 2, y: 35, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, c[3]);
      if (i) el('path', { d: 'M' + (c[0] - 8) + ' 116 h6 m-5 -5 l5 5 l-5 5', style: 'fill:none;stroke:var(--lapis);stroke-width:2;stroke-linecap:round;stroke-linejoin:round' });
    });
    el('rect', { x: 532, y: 44, width: 100, height: 150, rx: 10, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' });
    /* bacterias */
    var bac = [[30, 196], [62, 200], [94, 194], [46, 172], [86, 178]].map(function (p, i) { return el('rect', { x: p[0], y: p[1], width: 16, height: 7, rx: 3.5, transform: 'rotate(' + (i * 37 % 60 - 30) + ' ' + (p[0] + 8) + ' ' + (p[1] + 3) + ')', style: 'fill:#5f7d2e' }); });
    var lBac = tx({ x: 67, y: 146, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:#4d6a1f' }, 'bactérias');
    var lBac2 = tx({ x: 67, y: 160, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:#4d6a1f' }, 'anaeróbias');
    /* posicoes */
    var N = 12, P0 = [], P1 = [], P2 = [], P3 = [];
    for (var k = 0; k < N; k++) {
      P0.push([24 + (k % 6) * 17, 76 + Math.floor(k / 6) * 20 + (k % 2) * 6]);
      P1.push([150 + (k % 3) * 32, 62 + Math.floor(k / 3) * 32]);
      var f = Math.floor(k / 3);
      P2.push([288 + (f % 2) * 50 + (k % 3) * 7 - 6, 78 + Math.floor(f / 2) * 58 + (k % 3 === 1 ? -3 : 3)]);
      P3.push([416 + (k % 6) * 8, 112 + Math.floor(k / 6) * 9]);
    }
    var cels = P1.map(function (p) { return el('circle', { cx: p[0], cy: p[1], r: 11, style: 'fill:#9fd48a;stroke:#4c9a3c;stroke-width:1.5' }); });
    function peixe(sc, cor) {
      var g = el('g', {});
      el('path', { d: 'M-17 0 Q-3 -11 14 0 Q-3 11 -17 0 Z M-16 0 L-26 -8 L-26 8 Z', transform: 'scale(' + sc + ')', style: 'fill:' + cor }, g);
      el('circle', { cx: 8 * sc, cy: -2 * sc, r: 1.8 * sc, style: 'fill:#fff' }, g);
      return g;
    }
    var PF = [[292, 78], [342, 78], [292, 136], [342, 136]];
    var peq = PF.map(function () { return peixe(1.25, '#7d9db3'); });
    var grande = peixe(3.1, '#55748b'); grande.setAttribute('transform', 'translate(452 118)');
    var dots = P0.map(function () { return el('circle', { r: 4.2 }); });
    /* topo */
    var gTop = el('g', {});
    tx({ x: 582, y: 84, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;' + TXT }, 'comem peixe', gTop);
    tx({ x: 582, y: 104, 'text-anchor': 'middle', style: 'font-size:13px;' + TXT }, 'e acumulam', gTop);
    tx({ x: 582, y: 122, 'text-anchor': 'middle', style: 'font-size:13px;' + TXT }, 'ainda mais', gTop);
    tx({ x: 582, y: 148, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, '(dano ao sistema', gTop);
    tx({ x: 582, y: 164, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, 'nervoso)', gTop);
    /* barras de concentracao */
    var BY = 298;
    tx({ x: 14, y: 232, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'Mercúrio no');
    tx({ x: 14, y: 249, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'corpo de cada um');
    tx({ x: 14, y: 266, style: 'font-size:13px;' + LAP }, '(esquema)');
    var bars = [[183, 1, '1'], [309, 3, '3'], [452, 12, '12'], [582, 15.5, 'ainda mais']].map(function (b) {
      var r = el('rect', { x: b[0] - 16, width: 32, rx: 3, style: 'fill:' + MHG }), l = tx({ x: b[0], 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:' + MHG }, b[2]);
      return { r: r, l: l, v: b[1] };
    });
    el('line', { x1: 130, x2: 632, y1: BY, y2: BY, style: 'stroke:var(--linha);stroke-width:1.5' });
    var f1 = tx({ x: 14, y: 324, style: 'font-size:15px;font-weight:700;' + TXT }), f2 = tx({ x: 14, y: 344, style: 'font-size:14.5px;' + TXT });
    function mov(a, b, t0, t1, t) { var u = ease((t - t0) / (t1 - t0)); return [lerp(a[0], b[0], u), lerp(a[1], b[1], u)]; }
    return function (t) {
      dots.forEach(function (d, k) {
        var conv = t > .5 + k * .12, p;
        d.style.fill = conv ? MHG : HG;
        if (t < 2.4) p = P0[k];
        else if (t < 4.3) p = mov(P0[k], P1[k], 2.4 + k * .04, 3.4 + k * .04, t);
        else if (t < 6.6) p = mov(P1[k], P2[k], 4.3, 5.4, t);
        else p = mov(P2[k], P3[k], 6.6, 7.8, t);
        d.setAttribute('cx', p[0].toFixed(1)); d.setAttribute('cy', p[1].toFixed(1));
      });
      cels.forEach(function (c, k) {
        var p = t < 4.3 ? P1[k] : mov(P1[k], P2[k], 4.3, 5.4, t);
        c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1));
        c.setAttribute('r', (11 * (t < 4.3 ? 1 : 1 - .7 * ease((t - 4.3) / 1.1))).toFixed(1));
        c.style.opacity = t < 4.3 ? 1 : (1 - ease((t - 4.6) / .8)).toFixed(2);
      });
      peq.forEach(function (g, i) {
        var p = t < 6.6 ? PF[i] : mov(PF[i], [452, 118], 6.6, 7.8, t);
        g.setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
        g.style.opacity = t < 6.6 ? 1 : (1 - ease((t - 7) / .8)).toFixed(2);
        g.style.display = '';
      });
      grande.style.opacity = 1;
      gTop.style.opacity = t > 9 ? 1 : .0;
      var lv = t < 3.4 ? 0 : t < 5.4 ? 1 : t < 7.8 ? 2 : t < 9 ? 3 : 4;
      bars.forEach(function (b, i) {
        var on = lv > i, h = on ? 6 + b.v * 4 : 0;
        b.r.setAttribute('y', (BY - h).toFixed(1)); b.r.setAttribute('height', h.toFixed(1));
        b.l.setAttribute('y', (BY - h - 6).toFixed(1)); b.l.style.opacity = on ? 1 : 0;
      });
      lBac.style.opacity = lBac2.style.opacity = t < 2.4 ? 1 : .5;
      bac.forEach(function (b) { b.style.opacity = t < 2.4 ? 1 : .5; });
      var F;
      if (t < 2.4) F = ['Bactérias anaeróbias transformam o Hg inorgânico (cinza)', 'em metilmercúrio (rosa): lipossolúvel, ele entra nos seres vivos'];
      else if (t < 4.3) F = ['O fitoplâncton absorve o metilmercúrio', 'os produtores também se contaminam: são a porta de entrada'];
      else if (t < 6.6) F = ['Cada peixe pequeno come muitas algas', 'o mercúrio não é eliminado: o de todas as presas fica num corpo só'];
      else if (t < 9) F = ['O predador come vários peixes pequenos', 'soma o mercúrio de todos: concentração ainda maior'];
      else F = ['No topo, a concentração é a mais alta', 'Por isso: é magnificação trófica, como a do DDT, e as bactérias são a porta de entrada'];
      f1.textContent = F[0]; f2.textContent = F[1];
    };
  }
};
VIS.liga('magnificacao-trofica', ['P003f179', 'P5eabc52']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['magnificacao-trofica'], m0 = V.monta, D0 = V.dur, R = {"P003f179": ["E — magnificação trófica", "O DDT, lipossolúvel e pouco eliminado, fica mais", "concentrado a cada nível da cadeia alimentar."], "P5eabc52": ["C", "As bactérias anaeróbias, que degradam a matéria orgânica sem O₂,", "fazem o metilmercúrio, a forma que entra na cadeia."]};
  V.dur = D0 + 2.6; V.marcas = V.marcas.concat([[D0, 'Resposta']]);
  V.monta = function (svg, qid) {
    var d = m0(svg, qid), NS = 'http://www.w3.org/2000/svg', r = R[qid];
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    var g = el('g', { style: 'display:none' });
    el('rect', { x: 0, y: 0, width: 640, height: 360, style: 'fill:var(--folha);opacity:.86' }, g);
    el('rect', { x: 36, y: 92, width: 568, height: 168, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, g);
    var t0 = el('text', { x: 60, y: 128, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, g);
    var t1 = el('text', { x: 60, y: 162, style: 'font-size:23px;font-weight:700;fill:var(--ad-t)' }, g);
    var t2 = el('text', { x: 60, y: 202, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    var t3 = el('text', { x: 60, y: 226, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    t0.textContent = r ? 'Por isso, a resposta é' : 'Resumo';
    if (r) { t1.textContent = r[0]; t2.textContent = r[1]; t3.textContent = r[2] || ''; }
    return function (t) {
      if (t < D0) { g.style.display = 'none'; d(t); return; }
      d(D0 - .35); svg.style.opacity = 1; g.style.display = r ? '' : 'none';
      g.style.opacity = Math.min(1, (t - D0) / .3).toFixed(2);
    };
  };
})();
