VIS.def['hardy-weinberg-quadrado'] = {
  tit: 'Hardy-Weinberg como a área de um quadrado de lado p + q = 1',
  tipo: 'anim', dur: 12, cred: 'Animação feita para o app. Arraste a linha do tempo para mudar q.',
  marcas: function (qid) { if (qid === 'Pb7c0d58') return [[0, 'Contar alelos'], [3.4, 'q = 0,4'], [5.8, 'q = 0,3'], [7.8, 'q = 0,8'], [9.8, 'q = 0,4']]; if (qid === 'Pf6d4ecb' || qid === 'Wa5bd1d5' || qid === 'W08a8c64') return [[0, 'Contar alelos'], [3.4, 'q = 0,4'], [6.6, 'q = 0,8'], [9.4, 'q = 0,3']]; return [[0, 'Contar alelos'], [3.4, 'q = 0,4'], [6.6, 'q = 0,3'], [9.4, 'q = 0,8']]; },
  fontes: ['OpenStax Biology 2e, 19.1 Population Evolution (Hardy-Weinberg; frequência alélica contando 2 alelos por indivíduo) — https://openstax.org/books/biology-2e/pages/19-1-population-evolution'],
  nota: 'Cada lado do quadrado é um sorteio de alelo (um vem do pai, outro da mãe). As áreas são as frequências dos genótipos: p², 2pq (dois retângulos) e q². Para contar indivíduos, multiplique a frequência pelo tamanho da população. Em equilíbrio, p e q não mudam de uma geração para a outra.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function f2(v) { return v.toFixed(2).replace('.', ','); }
    function f1(v) { return (Math.round(v * 10) / 10).toFixed(1).replace('.', ','); }
    function mil(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function ease(u) { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var X0 = 52, Y0 = 52, S = 262;
    var CAA = '#2f6f62', CAa = '#7fb3a6', Caa = '#e3efe9';
    var rAA = el('rect', { style: 'fill:' + CAA }), rAa1 = el('rect', { style: 'fill:' + CAa }), rAa2 = el('rect', { style: 'fill:' + CAa }), raa = el('rect', { style: 'fill:' + Caa });
    el('rect', { x: X0, y: Y0, width: S, height: S, style: 'fill:none;stroke:var(--tinta);stroke-width:2' });
    var lv = el('line', { y1: Y0 - 8, y2: Y0 + S, style: 'stroke:var(--folha);stroke-width:2' }), lh = el('line', { x1: X0 - 8, x2: X0 + S, style: 'stroke:var(--folha);stroke-width:2' });
    /* eixos: alelos do pai (em cima) e da mae (na esquerda) */
    tx({ x: X0 + S / 2, y: 18, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--lapis)' }, 'alelo vindo de um genitor');
    tx({ x: 16, y: Y0 + S / 2, 'text-anchor': 'middle', transform: 'rotate(-90 16 ' + (Y0 + S / 2) + ')', style: 'font-size:13.5px;fill:var(--lapis)' }, 'alelo vindo do outro');
    var tp = tx({ y: 40, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:var(--tinta)' }), tq = tx({ y: 40, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:var(--tinta)' });
    var lp = tx({ x: 36, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:var(--tinta)' }), lq = tx({ x: 36, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:var(--tinta)' });
    /* rotulos nas areas */
    function rot(cor) { return [tx({ 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + cor }), tx({ 'text-anchor': 'middle', style: 'font-size:13.5px;fill:' + cor })]; }
    var tAA = rot('#fff'), tAa1 = rot('#123b33'), tAa2 = rot('#123b33'), taa = rot('#123b33');
    /* painel */
    var px = 340;
    var big = tx({ x: px, y: 40, style: 'font-size:22px;font-weight:700;fill:var(--tinta)' }), big2 = tx({ x: px + 150, y: 40, style: 'font-size:22px;font-weight:700;fill:var(--tinta)' });
    tx({ x: px, y: 62, style: 'font-size:14px;fill:var(--lapis)' }, 'frequências dos alelos (p + q = 1)');
    tx({ x: px, y: 96, style: 'font-size:13.5px;font-weight:600;fill:var(--lapis)' }, 'genótipo');
    tx({ x: px + 150, y: 96, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:600;fill:var(--lapis)' }, 'frequência');
    var hN = tx({ x: 626, y: 96, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:600;fill:var(--lapis)' });
    el('line', { x1: px, x2: 626, y1: 104, y2: 104, style: 'stroke:var(--linha);stroke-width:1.5' });
    var linhas = [['AA', 'p²', CAA], ['Aa', '2pq', CAa], ['aa', 'q²', Caa]].map(function (g, i) {
      var y = 128 + i * 26;
      el('rect', { x: px, y: y - 13, width: 14, height: 14, rx: 3, style: 'fill:' + g[2] + ';stroke:#2f6f62;stroke-width:1' });
      tx({ x: px + 22, y: y, style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }, g[0]);
      tx({ x: px + 52, y: y, style: 'font-size:14px;fill:var(--lapis)' }, g[1]);
      return [tx({ x: px + 150, y: y, 'text-anchor': 'end', style: 'font-size:15px;fill:var(--tinta)' }), tx({ x: 626, y: y, 'text-anchor': 'end', style: 'font-size:15px;font-weight:600;fill:var(--tinta)' })];
    });
    el('line', { x1: px, x2: 626, y1: 192, y2: 192, style: 'stroke:var(--linha);stroke-width:1.5' });
    tx({ x: px, y: 218, style: 'font-size:14.5px;font-weight:700;fill:var(--tinta)' }, 'Fenótipo dominante (AA + Aa)');
    var dom = tx({ x: px, y: 238, style: 'font-size:14.5px;fill:var(--tinta)' });
    tx({ x: px, y: 272, style: 'font-size:14.5px;font-weight:700;fill:var(--tinta)' }, 'Fenótipo recessivo (só aa)');
    var rec = tx({ x: px, y: 292, style: 'font-size:14.5px;fill:var(--tinta)' });
    var rec2 = tx({ x: px, y: 312, style: 'font-size:14.5px;fill:var(--ad-t);font-weight:600' });
    var pis = tx({ x: px, y: 340, style: 'font-size:14px;fill:var(--ad-t);font-weight:700' });
    /* contorno do fenotipo dominante (forma de L) */
    var Ld = el('path', { style: 'fill:none;stroke:#b4442f;stroke-width:3;stroke-dasharray:7 5;stroke-linejoin:round' });
    var LdT = tx({ style: 'font-size:13.5px;font-weight:700;fill:#b4442f' }, 'dominante');
    /* q ao longo do tempo: patamares 0,3 / 0,4 / 0,8 */
    var K = qid === 'Pb7c0d58' ? [[0, .4, 10000], [5.6, .4, 10000], [6.0, .3, 1000], [7.6, .3, 1000], [8.0, .8, 8000], [9.6, .8, 8000], [10.0, .4, 10000], [12, .4, 10000]]
      : (qid === 'Pf6d4ecb' || qid === 'Wa5bd1d5' || qid === 'W08a8c64') ? [[0, .4, 10000], [6.4, .4, 10000], [7.0, .8, 8000], [9.0, .8, 8000], [9.6, .3, qid === 'W08a8c64' ? 10000 : 1000], [12, .3, qid === 'W08a8c64' ? 10000 : 1000]]
      : [[0, .4, 10000], [6.4, .4, 10000], [7.0, .3, 1000], [9.0, .3, 1000], [9.6, .8, 8000], [12, .8, 8000]];
    function estado(t) {
      for (var i = 0; i < K.length - 1; i++) if (t <= K[i + 1][0]) { var u = ease((t - K[i][0]) / (K[i + 1][0] - K[i][0])); return [K[i][1] + (K[i + 1][1] - K[i][1]) * u, u < .5 ? K[i][2] : K[i + 1][2]]; }
      return [K[K.length - 1][1], K[K.length - 1][2]];
    }
    function place(r, x, y, w, h) { r.setAttribute('x', x.toFixed(1)); r.setAttribute('y', y.toFixed(1)); r.setAttribute('width', Math.max(0, w).toFixed(1)); r.setAttribute('height', Math.max(0, h).toFixed(1)); }
    function lab(par, a, b, cx, cy, w, h) {
      var ok = w > 40 && h > 40, cheio = w > 76;
      par[0].textContent = ok ? a : ''; par[1].textContent = ok ? (cheio ? b : b.split('= ')[1]) : '';
      par[0].setAttribute('x', cx.toFixed(1)); par[1].setAttribute('x', cx.toFixed(1)); par[0].setAttribute('y', (cy - 2).toFixed(1)); par[1].setAttribute('y', (cy + 16).toFixed(1));
    }
    /* tudo o que existe ate aqui = quadrado; vira um grupo */
    var GQ = document.createElementNS(NS, 'g');
    while (svg.firstChild) GQ.appendChild(svg.firstChild);
    svg.appendChild(GQ);
    /* etapa 0: de individuos a alelos (5.000 AA, 2.000 Aa, 3.000 aa) */
    var G0 = el('g', {});
    tx({ x: 20, y: 34, style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }, '10.000 peixes, cada um com 2 alelos', G0);
    tx({ x: 20, y: 52, style: 'font-size:13.5px;fill:var(--lapis)' }, '(cada bolinha = 1.000 alelos)', G0);
    var ROWS = [['5.000 AA', 10, 0, 92], ['2.000 Aa', 2, 2, 152], ['3.000 aa', 0, 6, 212]], BOL = [];
    ROWS.forEach(function (r) {
      tx({ x: 20, y: r[3] + 5, style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }, r[0], G0);
      tx({ x: 102, y: r[3] + 5, style: 'font-size:15px;fill:var(--lapis)' }, '→', G0);
      for (var k = 0; k < r[1] + r[2]; k++) BOL.push({ A: k < r[1], x0: 128 + k * 19, y0: r[3], c: el('circle', { r: 7.5, style: 'stroke:#2f6f62;stroke-width:1.2;fill:' + (k < r[1] ? CAA : Caa) }, G0) });
    });
    tx({ x: 20, y: 262, style: 'font-size:14px;font-weight:700;fill:var(--tinta)' }, 'juntando tudo:', G0);
    var nA = 0, na = 0;
    BOL.forEach(function (b) { if (b.A) { b.x1 = 128 + nA * 19; b.y1 = 290; nA++; } else { b.x1 = 128 + na * 19; b.y1 = 318; na++; } });
    var tA = tx({ x: 20, y: 295, style: 'font-size:14px;font-weight:700;fill:#2f6f62' }, '12.000 A', G0), ta = tx({ x: 20, y: 323, style: 'font-size:14px;font-weight:700;fill:#6a9a8e' }, '8.000 a', G0);
    var P0 = el('g', {});
    tx({ x: 400, y: 38, style: 'font-size:18px;font-weight:700;fill:var(--tinta)' }, 'De indivíduos a alelos', P0);
    var p0L = ['AA dá 2 alelos A; Aa dá 1 A', 'e 1 a; aa dá 2 alelos a.', '10.000 peixes = 20.000 alelos', 'A: 2 × 5.000 + 2.000 = 12.000', '*p = 12.000 ÷ 20.000 = 0,6', '*q = 1 − 0,6 = 0,4', 'com cruzamento ao acaso, a', 'prole segue p², 2pq e q²'].map(function (l, k) {
      var f = l.charAt(0) === '*'; return tx({ x: 400, y: 66 + k * 20, style: 'font-size:14px;' + (f ? 'font-weight:700;fill:var(--ad-t)' : 'fill:var(--tinta)') }, f ? l.slice(1) : l, P0);
    });
    return function (t) {
      var o0 = t < 3.0 ? 1 : 1 - Math.min(1, (t - 3.0) / .4); G0.style.opacity = P0.style.opacity = o0.toFixed(2); G0.style.display = P0.style.display = o0 > 0 ? '' : 'none';
      GQ.style.opacity = (1 - o0).toFixed(2); GQ.style.display = o0 < 1 ? '' : 'none';
      var um = ease((t - 1.2) / 1.2); BOL.forEach(function (b) { b.c.setAttribute('cx', (b.x0 + (b.x1 - b.x0) * um).toFixed(1)); b.c.setAttribute('cy', (b.y0 + (b.y1 - b.y0) * um).toFixed(1)); });
      tA.style.opacity = ta.style.opacity = um.toFixed(2);
      var e = estado(t), q = e[0], N = e[1], p = 1 - q, xs = X0 + S * p, ys = Y0 + S * p;
      var PQ = { Pb7c0d58: [.4, 'Por isso: nadadeira longa = 0,84 (E)'], Pf6d4ecb: [.3, 'Por isso: Aa = 2pq = 0,42 (C)'], Wa5bd1d5: [.3, 'Por isso: 0,42 × 1.000 = 420 (B)'], W08a8c64: [.3, 'Por isso: AA = 0,49 × 10.000 = 4.900 (B)'], W8cd4de4: [.8, 'Por isso: 0,36 × 8.000 = 2.880 (B)'] }[qid];
      pis.textContent = PQ && Math.abs(q - PQ[0]) < .005 ? PQ[1] : '';
      place(rAA, X0, Y0, S * p, S * p); place(rAa1, xs, Y0, S * q, S * p); place(rAa2, X0, ys, S * p, S * q); place(raa, xs, ys, S * q, S * q);
      lv.setAttribute('x1', xs.toFixed(1)); lv.setAttribute('x2', xs.toFixed(1)); lh.setAttribute('y1', ys.toFixed(1)); lh.setAttribute('y2', ys.toFixed(1));
      tp.setAttribute('x', (X0 + S * p / 2).toFixed(1)); tp.textContent = S * p > 70 ? 'A: p = ' + f2(p) : 'p';
      tq.setAttribute('x', (xs + S * q / 2).toFixed(1)); tq.textContent = S * q > 70 ? 'a: q = ' + f2(q) : 'q';
      lp.setAttribute('y', (Y0 + S * p / 2 + 5).toFixed(1)); lp.textContent = 'p';
      lq.setAttribute('y', (ys + S * q / 2 + 5).toFixed(1)); lq.textContent = 'q';
      lab(tAA, 'AA', 'p² = ' + f2(p * p), X0 + S * p / 2, Y0 + S * p / 2, S * p, S * p);
      lab(tAa1, 'Aa', 'pq = ' + f2(p * q), xs + S * q / 2, Y0 + S * p / 2, S * q, S * p);
      lab(tAa2, 'Aa', 'pq = ' + f2(p * q), X0 + S * p / 2, ys + S * q / 2, S * p, S * q);
      lab(taa, 'aa', 'q² = ' + f2(q * q), xs + S * q / 2, ys + S * q / 2, S * q, S * q);
      /* contorno L */
      Ld.setAttribute('d', 'M' + X0 + ' ' + Y0 + ' H' + (X0 + S) + ' V' + ys.toFixed(1) + ' H' + xs.toFixed(1) + ' V' + (Y0 + S) + ' H' + X0 + ' Z');
      LdT.setAttribute('x', X0); LdT.setAttribute('y', Y0 + S + 22); LdT.textContent = 'tracejado: fenótipo dominante = p² + 2pq';
      big.textContent = 'p = ' + f2(p); big2.textContent = 'q = ' + f2(q);
      hN.textContent = Math.abs(q - .4) < .05 ? 'na prole de 10.000' : 'em ' + mil(N) + ' indivíduos';
      var fr = [p * p, 2 * p * q, q * q];
      linhas.forEach(function (l, i) { l[0].textContent = f2(fr[i]); l[1].textContent = mil(fr[i] * N); });
      dom.textContent = 'p² + 2pq = ' + f2(fr[0]) + ' + ' + f2(fr[1]) + ' = ' + f2(fr[0] + fr[1]) + '  (' + mil((fr[0] + fr[1]) * N) + ')';
      rec.textContent = 'q² = ' + f2(fr[2]) + '  (' + mil(fr[2] * N) + ')';
      rec2.textContent = 'partindo dele: q = √' + f2(fr[2]) + ' = ' + f2(q);
    };
  }
};
VIS.liga('hardy-weinberg-quadrado', ['Pf6d4ecb', 'Pb7c0d58', 'Wa5bd1d5', 'W08a8c64', 'W8cd4de4']);
