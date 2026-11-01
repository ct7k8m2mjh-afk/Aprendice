VIS.def['ciclos-vida-plantas'] = {
  tit: 'Dentro da cápsula do musgo: a meiose forma os esporos',
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (esquema fora de escala; só 2 pares de cromossomos desenhados). Foto do musgo: "capsules de sporogones", Arn, CC BY-SA 4.0, via Wikimedia Commons.',
  fontes: [
    'OpenStax Biology 2e, 25.1 Early Plant Life — https://openstax.org/books/biology-2e/pages/25-1-early-plant-life',
    'OpenStax Biology 2e, 25.3 Bryophytes — https://openstax.org/books/biology-2e/pages/25-3-bryophytes',
    'OpenStax Biology 2e, 11.1 The Process of Meiosis — https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis',
    'OpenStax Biology 2e, 32.2 Pollination and Fertilization — https://openstax.org/books/biology-2e/pages/32-2-pollination-and-fertilization'
  ],
  marcas: function (qid) { var m = [[0, 'Cápsula'], [1.8, 'Célula-mãe'], [3.4, 'Meiose I'], [5.2, 'Meiose II'], [7, 'Por que meiose']]; if (qid === 'Pbc2830b' || !qid) { m[4][1] = 'Esporo'; m.push([9, 'Milho']); } return m; },
  nota: 'Em planta, meiose forma ESPOROS e mitose forma GAMETAS. Mitose só copia: tudo o que nasce de um esporo AB (o gametófito e seus gametas) é AB.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var S1 = 1.8, S2 = 3.4, S3 = 5.2, S4 = 7, S5 = (qid === 'Pbc2830b' || !qid) ? 9 : 12;
    var VERM = '#c0392b', AZUL = '#2f6fbf', MARR = '#8a5a2b', VD = '#2f6f3e';
    var T = 'font-size:13.5px;fill:var(--tinta)', TB = 'font-size:13.5px;font-weight:700;fill:';
    /* ===== etapa 1: foto + capsula ===== */
    var G1 = el('g', {});
    el('image', { href: 'vis/ciclos-vida-plantas-1.webp', x: 14, y: 70, width: 168, height: 126, preserveAspectRatio: 'xMidYMid slice' }, G1);
    el('rect', { x: 14, y: 70, width: 168, height: 126, rx: 4, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, G1);
    var capF = [14 + 168 * .79, 70 + 126 * .575];
    el('circle', { cx: capF[0], cy: capF[1], r: 10, style: 'fill:none;stroke:#fff;stroke-width:2.5' }, G1);
    el('path', { d: 'M' + (capF[0] + 9) + ' ' + (capF[1] - 5) + ' L262 66 M' + (capF[0] + 9) + ' ' + (capF[1] + 5) + ' L262 314', style: 'fill:none;stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, G1);
    tx({ x: 14, y: 218, style: TB + VERM }, 'cápsula + haste:', G1);
    tx({ x: 14, y: 235, style: T }, 'esporófito (2n)', G1);
    tx({ x: 14, y: 262, style: TB + VD }, 'musgo verde:', G1);
    tx({ x: 14, y: 279, style: T }, 'gametófito (n)', G1);
    /* capsula (esporangio) */
    var cap = el('ellipse', { style: 'fill:#f1e3c4;stroke:' + MARR + ';stroke-width:3' });
    var capT = tx({ 'text-anchor': 'middle', style: TB + MARR });
    var tec = []; for (var i = 0; i < 10; i++) tec.push(el('circle', { r: 11, style: 'fill:#f7eedb;stroke:#c9a97a;stroke-width:1.2' }));
    /* celulas */
    var cel = [0, 1, 2, 3].map(function () { return el('circle', { style: 'fill:#fbf6ea;stroke:#7a6a4a;stroke-width:2' }); });
    var eqL = el('line', { style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' });
    /* cromossomos: [cor, longo?, letra] cada um com 2 cromatides */
    var CR = [[VERM, 1, 'A'], [AZUL, 1, 'a'], [VERM, 0, 'B'], [AZUL, 0, 'b']].map(function (c) {
      return { cor: c[0], L: c[1] ? 44 : 24, let: c[2], k: [0, 1].map(function () { return el('rect', { width: 7, rx: 3.5, style: 'fill:' + c[0] }); }), t: tx({ style: TB + c[0] }, c[2]), cen: el('circle', { r: 3.2, style: 'fill:#4a3a2a' }) };
    });
    var espT = [0, 1, 2, 3].map(function () { return tx({ 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }); });
    var nT = [0, 1, 2, 3].map(function () { return tx({ 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }); });
    /* ===== etapa 5: esporo -> musgo -> gametas ===== */
    var G5 = el('g', {});
    function seta(g, x1, x2, y, cor, rot) { el('path', { d: 'M' + x1 + ' ' + y + ' H' + x2 + ' m-9 -6 l9 6 l-9 6', style: 'fill:none;stroke:' + cor + ';stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round' }, g); tx({ x: (x1 + x2) / 2, y: y - 12, 'text-anchor': 'middle', style: TB + cor }, rot, g); }
    el('circle', { cx: 52, cy: 200, r: 22, style: 'fill:#fbf6ea;stroke:' + MARR + ';stroke-width:3.5' }, G5);
    tx({ x: 52, y: 205, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }, 'AB', G5);
    tx({ x: 52, y: 246, 'text-anchor': 'middle', style: TB + MARR }, 'esporo n', G5);
    seta(G5, 82, 140, 200, 'var(--lapis)', 'mitoses');
    var musgo = el('g', {}, G5);
    el('path', { d: 'M196 290 V140', style: 'fill:none;stroke:#4f7a2c;stroke-width:4;stroke-linecap:round' }, musgo);
    for (i = 0; i < 9; i++) { var yy = 280 - i * 16, s = i % 2 ? 1 : -1; el('path', { d: 'M196 ' + yy + ' q' + (s * 14) + ' -4 ' + (s * 24) + ' -14 q' + (s * -10) + ' 2 ' + (s * -24) + ' 6 Z', style: 'fill:#6fae4a;stroke:#3f6f28;stroke-width:1' }, musgo); }
    tx({ x: 196, y: 312, 'text-anchor': 'middle', style: TB + VD }, 'gametófito n', G5);
    tx({ x: 196, y: 329, 'text-anchor': 'middle', style: T }, 'todo AB', G5);
    seta(G5, 232, 288, 200, VERM, 'mitose');
    el('ellipse', { cx: 322, cy: 168, rx: 9, ry: 5, style: 'fill:' + AZUL }, G5); el('path', { d: 'M313 168 q-8 -6 -14 2 M313 168 q-8 6 -14 -2', style: 'fill:none;stroke:' + AZUL + ';stroke-width:1.5' }, G5);
    el('circle', { cx: 322, cy: 228, r: 15, style: 'fill:#f3d7c9;stroke:' + VERM + ';stroke-width:2' }, G5);
    tx({ x: 345, y: 173, style: TB + 'var(--tinta)' }, 'AB', G5); tx({ x: 345, y: 233, style: TB + 'var(--tinta)' }, 'AB', G5);
    tx({ x: 322, y: 268, 'text-anchor': 'middle', style: T }, 'gametas', G5);
    /* ===== etapa 6: milho, dupla fecundacao ===== */
    var G6 = el('g', {});
    el('ellipse', { cx: 96, cy: 186, rx: 62, ry: 116, style: 'fill:#fbf1e2;stroke:#b58b5a;stroke-width:2' }, G6);
    tx({ x: 96, y: 60, 'text-anchor': 'middle', style: T }, 'saco embrionário', G6);
    var pol1 = el('circle', { r: 8, style: 'fill:#e0b54a;stroke:#9a7420;stroke-width:1.5' }, G6), pol2 = el('circle', { r: 8, style: 'fill:#e0b54a;stroke:#9a7420;stroke-width:1.5' }, G6);
    var cen = el('circle', { cx: 96, cy: 170, r: 15, style: 'fill:#e0b54a;stroke:#9a7420;stroke-width:2' }, G6);
    var oos = el('circle', { cx: 96, cy: 262, r: 15, style: 'fill:#f3d7c9;stroke:' + VERM + ';stroke-width:2' }, G6);
    el('path', { d: 'M96 346 V300', style: 'fill:none;stroke:#7a9a3a;stroke-width:6;stroke-linecap:round' }, G6);
    tx({ x: 104, y: 338, style: 'font-size:13px;fill:var(--lapis)' }, 'tubo polínico', G6);
    var sp1 = el('circle', { r: 5, style: 'fill:' + AZUL }, G6), sp2 = el('circle', { r: 5, style: 'fill:' + AZUL }, G6);
    var cenT = tx({ x: 120, y: 152, style: TB + '#9a7420' }, '', G6), oosT = tx({ x: 120, y: 254, style: TB + VERM }, '', G6);
    var cenT2 = tx({ x: 120, y: 168, style: T }, '', G6), oosT2 = tx({ x: 120, y: 270, style: T }, '', G6);
    var kern = el('g', { transform: 'translate(228 92) scale(.6)' }, G6);
    el('path', { d: 'M150 50 C214 50 250 96 250 150 C250 214 214 280 168 300 C150 306 132 300 118 290 C82 262 56 210 56 150 C56 92 92 50 150 50 Z', style: 'fill:#f4c542;stroke:#b8862a;stroke-width:5' }, kern);
    el('path', { d: 'M104 282 C88 250 86 210 104 186 C120 166 146 176 150 204 C154 236 146 270 130 294 Z', style: 'fill:#f7ecc8;stroke:#c9a75a;stroke-width:3' }, kern);
    var kA = tx({ x: 302, y: 162, 'text-anchor': 'middle', style: 'font-size:18px;font-weight:700;fill:#7a5a10' }, 'A', G6);
    var kB = tx({ x: 300, y: 252, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:#7a5a10' }, 'B', G6);
    var kT = [kA, kB, tx({ x: 268, y: 296, style: TB + '#9a6a10' }, 'A: endosperma 3n', G6), tx({ x: 268, y: 312, style: T }, '(reserva de amido)', G6), tx({ x: 268, y: 332, style: TB + '#7a6a2a' }, 'B: embrião 2n', G6)];
    /* ===== painel ===== */
    var px = 404;
    var fase = tx({ x: px, y: 38, style: 'font-size:18px;font-weight:700;fill:var(--tinta)' });
    var L = [0, 1, 2, 3, 4, 5, 6].map(function (k) { return tx({ x: px, y: 64 + k * 19, style: 'font-size:14px;fill:var(--tinta)' }); });
    el('rect', { x: px, y: 268, width: 226, height: 64, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 10%,var(--folha));stroke:var(--ad-c);stroke-width:1.5' });
    tx({ x: px + 12, y: 292, style: 'font-size:14px;font-weight:700;fill:var(--ad-t)' }, 'Em planta:');
    tx({ x: px + 12, y: 311, style: 'font-size:14px;fill:var(--tinta)' }, 'meiose forma ESPOROS;');
    tx({ x: px + 12, y: 326, style: 'font-size:14px;fill:var(--tinta)' }, 'mitose forma GAMETAS');
    var TXT = [
      ['A cápsula é o esporófito', ['a cápsula na ponta da haste', 'é o esporófito (2n): nasceu', 'do zigoto e vive preso ao', 'musgo verde, o gametófito (n)']],
      ['Célula-mãe do esporo (2n)', ['dentro da cápsula (o esporângio)', 'há células 2n: 2 pares de', 'homólogos (vermelho: A, B;', 'azul: a, b), já duplicados']],
      ['Meiose I', ['os homólogos de cada par se', 'separam: ficam 2 células n,', 'com cromossomos ainda', 'duplicados']],
      ['Meiose II', ['as cromátides-irmãs se', 'separam: saem 4 esporos n,', 'cada um com parede. De uma', 'célula AaBb pode sair AB']],
      ['Por que meiose?', ['o esporo tem de ser n: ele', 'cresce por mitoses e vira o', 'musgo n, que faz gametas por', 'mitose (cópias: tudo AB)'].concat(qid === 'W6b3eafc' ? ['*Por isso: o gametófito', '*(na samambaia, o prótalo)', '*é AB, como o esporo (B)'] : qid === 'Pbc2830b' ? [] : ['*Por isso: esporos, por meiose (A)'])],
      ['No milho: dupla fecundação', ['1 núcleo espermático + oosfera', '= zigoto 2n (embrião); o outro', '+ 2 núcleos polares = 3n'].concat(qid === 'Pbc2830b' ? ['*Por isso: A (reserva de amido)', '*é o endosperma (A)'] : ['a reserva A (amido) é o', 'endosperma'])]
    ];
    function cromatide(r, x, y, L2) { r.setAttribute('x', (x - 3.5).toFixed(1)); r.setAttribute('y', (y - L2 / 2).toFixed(1)); r.setAttribute('height', L2); }
    return function (t) {
      var et = t < S1 ? 0 : t < S2 ? 1 : t < S3 ? 2 : t < S4 ? 3 : (t < S5 || S5 >= 12) ? 4 : 5;
      fase.textContent = TXT[et][0];
      L.forEach(function (e, k) { var s = TXT[et][1][k] || '', f = s.charAt(0) === '*'; e.textContent = f ? s.slice(1) : s; e.style.fontWeight = f ? 700 : 400; e.style.fill = f ? 'var(--ad-t)' : 'var(--tinta)'; });
      /* capsula: pequena (etapa 1) -> grande */
      var uc = ease((t - S1 + .4) / .6), mo = t < S4 ? 1 : 1 - cl((t - S4) / .4);
      vis(G1, 1 - uc);
      cap.setAttribute('cx', lerp(300, 200, uc)); cap.setAttribute('cy', 190); cap.setAttribute('rx', lerp(62, 186, uc)); cap.setAttribute('ry', lerp(124, 152, uc)); vis(cap, mo);
      capT.setAttribute('x', lerp(300, 200, uc)); capT.setAttribute('y', lerp(56, 74, uc)); capT.textContent = uc < .5 ? 'cápsula (2n)' : 'dentro da cápsula (esporângio)'; vis(capT, t >= S3 + .6 ? 0 : mo);
      tec.forEach(function (c, k) { var a = k / 10 * 6.283; c.setAttribute('cx', (300 + 34 * Math.cos(a) * (k % 2 ? .5 : 1)).toFixed(1)); c.setAttribute('cy', (200 + 80 * Math.sin(a) * (k % 2 ? .5 : 1)).toFixed(1)); vis(c, 1 - uc); });
      /* celulas e cromossomos */
      var showCells = t >= S1 - .2 && t < S4 + .4, oc = t < S1 ? cl((t - S1 + .2) / .4) : mo;
      var u1 = ease((t - S2 - .7) / 1.1), u2 = ease((t - S3 - .7) / 1.1);
      var C = [];
      if (t < S3) { C = [[200 - 70 * u1, 190, 66 - 10 * u1], [200 + 70 * u1, 190, 66 - 10 * u1]]; if (u1 <= 0) C = [[200, 190, 66]]; }
      else C = [[130, 190 - 70 * u2, 56 - 12 * u2], [130, 190 + 70 * u2, 56 - 12 * u2], [270, 190 - 70 * u2, 56 - 12 * u2], [270, 190 + 70 * u2, 56 - 12 * u2]];
      cel.forEach(function (c, k) {
        if (!showCells || k >= C.length) { vis(c, 0); return; }
        c.setAttribute('cx', C[k][0].toFixed(1)); c.setAttribute('cy', C[k][1].toFixed(1)); c.setAttribute('r', C[k][2].toFixed(1));
        c.style.stroke = t >= S4 - .6 ? MARR : '#7a6a4a'; c.style.strokeWidth = t >= S4 - .6 ? 3.5 : 2; vis(c, oc);
      });
      var mEq = t >= S2 && t < S2 + 1.0 ? 1 : 0;
      eqL.setAttribute('x1', 200); eqL.setAttribute('x2', 200); eqL.setAttribute('y1', 132); eqL.setAttribute('y2', 248); vis(eqL, mEq * oc);
      /* posicoes dos cromossomos */
      var ua = ease((t - S2) / .6);
      CR.forEach(function (c, i) {
        var longo = c.L > 30, ver = c.cor === VERM, P = [];
        /* etapa 2: lado a lado na celula-mae */
        var x2 = [166, 186, 214, 234][i], y2 = longo ? 176 : 206;
        /* metafase I: vermelho a esquerda do equador, azul a direita */
        var xm = ver ? 186 : 206, ym = longo ? 172 : 214;
        /* fim da meiose I */
        var xf = (ver ? 130 : 270) + (longo ? -10 : 10), yf = longo ? 176 : 200;
        for (var k = 0; k < 2; k++) {
          var x = lerp(x2, xm, ua) + k * 8 - 4, y = lerp(y2, ym, ua);
          if (t >= S2 + .7) { x = lerp(xm, xf, u1) + k * 8 - 4; y = lerp(ym, yf, u1); }
          if (t >= S3) {
            var xs = (ver ? 130 : 270) + (longo ? -9 : 9), ys = 190, ua2 = ease((t - S3) / .6);
            x = lerp(xf + k * 8 - 4, xs + k * 8 - 4, ua2); y = lerp(yf, ys, ua2);
            if (t >= S3 + .7) { x = lerp(xs + k * 8 - 4, xs, u2); y = lerp(ys, ys + (k ? 70 : -70), u2); }
          }
          P.push([x, y]);
          cromatide(c.k[k], x, y, c.L); vis(c.k[k], showCells ? oc : 0);
        }
        var dd = Math.hypot(P[0][0] - P[1][0], P[0][1] - P[1][1]);
        c.cen.setAttribute('cx', ((P[0][0] + P[1][0]) / 2).toFixed(1)); c.cen.setAttribute('cy', ((P[0][1] + P[1][1]) / 2).toFixed(1)); vis(c.cen, showCells && dd < 10 ? oc : 0);
        c.t.setAttribute('x', (P[0][0] - (ver ? 16 : -12)).toFixed(1)); c.t.setAttribute('y', (P[0][1] + 5).toFixed(1));
        vis(c.t, t < S3 + .7 && showCells ? oc : 0);
      });
      var spX = [[130, 120], [130, 260], [270, 120], [270, 260]], spS = ['AB', 'AB', 'ab', 'ab'];
      espT.forEach(function (e, k) { e.setAttribute('x', spX[k][0] + 64); e.setAttribute('y', spX[k][1] + 6); e.textContent = spS[k]; vis(e, t >= S3 + 1.6 && t < S4 + .4 ? oc : 0); });
      nT.forEach(function (e, k) { e.setAttribute('x', spX[k][0]); e.setAttribute('y', spX[k][1] + 62); e.textContent = 'esporo n'; vis(e, 0); });
      /* etapa 5 */
      vis(G5, t >= S4 + .2 && (t < S5 || S5 >= 12) ? Math.min(cl((t - S4 - .2) / .4), S5 >= 12 ? 1 : cl((S5 - t) / .3)) : 0);
      musgo.setAttribute('transform', 'translate(196 290) scale(1 ' + (.15 + .85 * ease((t - S4 - .4) / .9)).toFixed(2) + ') translate(-196 -290)');
      /* etapa 6 */
      var o6 = t >= S5 && S5 < 12 ? cl((t - S5) / .3) : 0; vis(G6, o6);
      var uf = ease((t - S5 - .3) / 1.1), fus = t >= S5 + 1.5;
      sp1.setAttribute('cx', 96); sp1.setAttribute('cy', lerp(300, 262, uf).toFixed(1)); vis(sp1, o6 * (fus ? 0 : 1));
      sp2.setAttribute('cx', (96 + 26 * Math.sin(uf * Math.PI)).toFixed(1)); sp2.setAttribute('cy', lerp(300, 170, uf).toFixed(1)); vis(sp2, o6 * (fus ? 0 : 1));
      pol1.setAttribute('cx', fus ? 96 : 86); pol1.setAttribute('cy', 170); pol2.setAttribute('cx', fus ? 96 : 106); pol2.setAttribute('cy', 170);
      vis(pol1, o6 * (fus ? 0 : 1)); vis(pol2, o6 * (fus ? 0 : 1)); vis(cen, o6 * (fus ? 1 : 0));
      cenT.textContent = fus ? 'célula 3n' : '2 núcleos polares'; cenT2.textContent = fus ? '→ endosperma' : '(n + n)';
      oosT.textContent = fus ? 'zigoto 2n' : 'oosfera (n)'; oosT2.textContent = fus ? '→ embrião' : '';
      var ok = cl((t - S5 - 1.7) / .4); vis(kern, o6 * ok); kT.forEach(function (e) { vis(e, o6 * ok); });
    };
  }
};
VIS.liga('ciclos-vida-plantas', ['Pc682321', 'W6b3eafc', 'Pbc2830b']);
