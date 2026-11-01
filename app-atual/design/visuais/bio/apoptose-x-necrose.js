/* Apoptose esculpindo os dedos do embrião; apoptose x necrose */
VIS.def['apoptose-x-necrose'] = {
  tit: 'Apoptose: morte programada que separa os dedos',
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Placa'], [2.5, 'Apoptose'], [5, 'Dedos'], [6.5, '× necrose']],
  cred: 'Animação feita para o app (esquema fora de escala).',
  fontes: ['OpenStax Biology 2e, 9.3 Response to the Signal (apoptose; tecido entre os dedos) — https://openstax.org/books/biology-2e/pages/9-3-response-to-the-signal', 'Apoptosis (Wikipedia, apoio) — https://en.wikipedia.org/wiki/Apoptosis'],
  nota: 'Apoptose é morte programada pelos genes da própria célula: ela encolhe, a cromatina se condensa e se fragmenta, e a célula se parte em corpos apoptóticos que os fagócitos englobam, sem romper e sem inflamação. As enzimas que a desmontam são as caspases; a proteína p53 dispara o programa quando o DNA está danificado sem conserto. Necrose é morte por lesão: a célula incha, se rompe e provoca inflamação.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function quebra(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PQ = {"P9f037b6": "Morte celular programada pelos genes, que elimina as membranas entre os dedos sem inflamação: apoptose. Alternativa D.", "Wc420fe2": "Apoptose é programada, sem inflamação, executada por caspases e disparada por p53 quando o DNA não tem conserto; a sequência é F, V, F, V, V: alternativa D."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)', SK = '#f2c8b4', ST = '#b9806a', MORTE = '#8f2a1e';

    /* ===================== a mao ===================== */
    var gM = el('g', {});
    var OX = 190, OY = -18, SC = .82;   /* coordenadas locais da mao -> tela */
    function tela(p) { return [OX + p[0] * SC, OY + p[1] * SC]; }
    var gH = el('g', { transform: 'translate(' + OX + ' ' + OY + ') scale(' + SC + ')' }, gM);
    /* raios digitais: [x base, y base, angulo, comprimento] */
    var DIG = [[-50, 330, -52, 54], [-33, 282, -13, 84], [-10, 276, -3, 96], [13, 280, 7, 88], [35, 290, 18, 70]], W = 20;
    function dp(d, frac, lado) {
      var r = d[2] * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r);
      return [d[0] + dx * d[3] * frac - dy * lado * W / 2, d[1] + dy * d[3] * frac + dx * lado * W / 2];
    }
    var palma = 'M-48 404 L-50 360 Q-62 300 -44 276 L44 280 Q58 300 50 360 L46 404 Z';
    var gS = el('g', { style: 'fill:' + SK + ';stroke:' + ST + ';stroke-width:5' }, gH), gF = el('g', { style: 'fill:' + SK }, gH);
    var dedos = '';
    DIG.forEach(function (d) { var r = d[2] * Math.PI / 180, ex = d[0] + Math.sin(r) * d[3] / 2, ey = d[1] - Math.cos(r) * d[3] / 2; dedos += '<rect x="-10" y="' + (-d[3] / 2 - 10) + '" width="20" height="' + (d[3] + 20) + '" rx="10" transform="translate(' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ') rotate(' + d[2] + ')"/>'; });
    var memS = [], memF = [];
    [gS, gF].forEach(function (g, gi) {
      el('path', { d: palma }, g);
      var tmp = el('g', {}, g); tmp.innerHTML = dedos;
      for (var k = 0; k < 4; k++) (gi ? memF : memS).push(el('path', {}, g));
    });
    /* placa inicial: contorno liso que passa por fora das pontas de todos os raios */
    var gPl = el('g', {}, gH);
    (function () {
      var P = [[-46, 404], [-56, 372]], ext = 16;
      DIG.forEach(function (d, i) { var r = d[2] * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r); P.push([d[0] + dx * (d[3] + ext), d[1] + dy * (d[3] + ext)]); });
      P.push([56, 330], [48, 404]);
      var dd = 'M' + P[0][0] + ' ' + P[0][1];
      for (var i = 0; i < P.length - 1; i++) {   /* Catmull-Rom -> Bezier */
        var p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
        dd += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0] + ' ' + p2[1];
      }
      el('path', { d: dd + ' Z', style: 'fill:' + SK + ';stroke:' + ST + ';stroke-width:2.5' }, gPl);
    })();
    var raios = DIG.map(function (d) { var r = d[2] * Math.PI / 180, dx = Math.sin(r), dy = -Math.cos(r); return el('line', { x1: d[0] + dx * 6, y1: d[1] + dy * 6, x2: d[0] + dx * (d[3] - 4), y2: d[1] + dy * (d[3] - 4), style: 'stroke:#e2a68c;stroke-width:6;stroke-linecap:round' }, gH); });
    var faixas = [0, 1, 2, 3].map(function () { return el('path', { style: 'fill:#e9a49d;stroke:' + MORTE + ';stroke-width:1.4;stroke-dasharray:3 2' }, gH); });
    var pontos = []; for (var q = 0; q < 24; q++) pontos.push(el('circle', { r: 2.6, style: 'fill:' + MORTE }, gH));
    var rotA = tx(OX, 40, 'apoptose', 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + MORTE, gM);
    var lider = el('path', { style: 'fill:none;stroke:' + MORTE + ';stroke-width:1.4' }, gM);
    var semana = tx(OX, 342, '', 'font-size:14px;font-weight:600;text-anchor:middle;' + LAP, gM);
    /* membrana entre os raios k e k+1 ate a fracao f; curva c (>0 convexa, <0 entalhe) */
    function membrana(k, f, c) {
      var a = DIG[k], b = DIG[k + 1], p0 = dp(a, 0, 1), p1 = dp(b, 0, -1), q0 = dp(a, f, 1), q1 = dp(b, f, -1);
      var mx = (q0[0] + q1[0]) / 2, my = (q0[1] + q1[1]) / 2, nx = mx - 0, ny = my - 330, nn = Math.sqrt(nx * nx + ny * ny);
      var cx = mx + nx / nn * c, cy = my + ny / nn * c;
      return { d: 'M' + p0[0].toFixed(1) + ' ' + (p0[1] + 12).toFixed(1) + ' L' + q0[0].toFixed(1) + ' ' + q0[1].toFixed(1) + ' Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + q1[0].toFixed(1) + ' ' + q1[1].toFixed(1) + ' L' + p1[0].toFixed(1) + ' ' + (p1[1] + 12).toFixed(1) + ' Z', q0: q0, q1: q1, c: [cx, cy] };
    }

    /* ===================== apoptose x necrose ===================== */
    var gC = el('g', {});
    tx(10, 30, 'Apoptose', 'font-size:16px;font-weight:700;fill:#3f6a3f', gC);
    tx(10, 190, 'Necrose', 'font-size:16px;font-weight:700;fill:' + MORTE, gC);
    el('line', { x1: 10, x2: 380, y1: 168, y2: 168, style: 'stroke:var(--linha)' }, gC);
    /* apoptose */
    var AX = 92, AY = 98;
    var fago = el('path', { style: 'fill:#e4eef3;stroke:#6f95a8;stroke-width:2' }, gC), fagoN = el('circle', { r: 10, style: 'fill:#5c7f93' }, gC);
    var bolhas = [0, 1, 2, 3, 4, 5, 6, 7].map(function () { return el('circle', { style: 'fill:#fbe9e4;stroke:#b98a7c;stroke-width:1.5' }, gC); });
    var celA = el('circle', { style: 'fill:#fbe9e4;stroke:#b98a7c;stroke-width:2' }, gC);
    var nucA = el('circle', { style: 'fill:#8e6aa0' }, gC);
    var frags = [0, 1, 2].map(function () { return el('circle', { r: 4, style: 'fill:#4d2f5c' }, gC); });
    var corpos = [0, 1, 2, 3].map(function () { var g = el('g', {}, gC); el('circle', { r: 9, style: 'fill:#fbe9e4;stroke:#b98a7c;stroke-width:1.5' }, g); el('circle', { r: 3, style: 'fill:#4d2f5c' }, g); return g; });
    var capA = [tx(190, 84, '', 'font-size:14px;font-weight:600;' + TINTA, gC), tx(190, 103, '', 'font-size:14px;' + TINTA, gC), tx(190, 122, '', 'font-size:14px;' + TINTA, gC)];
    /* necrose */
    var NX = 92, NY = 262;
    var celN = el('circle', { style: 'fill:#fdf1ec;stroke:#b98a7c;stroke-width:2' }, gC);
    var rompe = el('path', { style: 'fill:none;stroke:#b98a7c;stroke-width:2' }, gC);
    var nucN = el('circle', { style: 'fill:#b59ac2' }, gC);
    var orgN = [0, 1, 2].map(function (i) { return el('ellipse', { style: 'fill:#dcb294' }, gC); });
    var vaza = []; for (q = 0; q < 10; q++) vaza.push(el('circle', { r: 3, style: 'fill:#c98a5c' }, gC));
    var leuco = [0, 1, 2, 3].map(function () { var g = el('g', {}, gC); el('circle', { r: 15, style: 'fill:#eef1f7;stroke:#7c86a8;stroke-width:1.6' }, g); [[-6, -3], [1, 4], [7, -3]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 3.6, style: 'fill:#5a5f9e' }, g); }); return g; });
    var capN = [tx(190, 248, '', 'font-size:14px;font-weight:600;' + TINTA, gC), tx(190, 267, '', 'font-size:14px;' + TINTA, gC), tx(190, 286, '', 'font-size:14px;' + TINTA, gC)];

    /* ===================== painel ===================== */
    var PX = 400;
    var pNome = tx(PX, 40, '', 'font-size:19px;font-weight:700;' + TINTA);
    var pL = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return tx(PX, 68 + i * 20, '', 'font-size:14.5px;' + TINTA); });
    var ETAPAS = [
      [0, '1. A mão é uma placa', 'Na 6ª semana, a mão do embrião é uma placa achatada. Os 5 dedos já estão marcados por dentro (raios digitais), unidos por tecido contínuo.'],
      [2.5, '2. Apoptose entre os raios', 'Genes do próprio embrião mandam as células entre os raios morrerem. Elas encolhem, se partem e são englobadas por fagócitos, sem inflamação.'],
      [5, '3. Dedos livres', 'Na 8ª semana o tecido entre os dedos sumiu. É morte normal e programada, como na renovação do revestimento do intestino e da medula óssea.'],
      [6.5, '4. Apoptose × necrose', 'Na apoptose a célula encolhe e se parte em corpos apoptóticos (caspases; p53 dispara quando o DNA não tem conserto). Na necrose, causada por lesão, ela incha, se rompe e inflama o tecido.'],
      [10.2, 'Por isso a resposta é', PQ[qid] || 'Morte celular programada pelos genes, que esculpe os dedos sem inflamar o tecido, é apoptose, e não necrose.']
    ].map(function (e) { return [e[0], e[1], quebra(e[2], 30)]; });

    return function (t) {
      var mao = t < 6.5, oM = mao ? 1 - seg(t, 6.2, 6.5) : 0, oC = seg(t, 6.5, 6.9);
      gM.style.opacity = oM; gM.style.display = oM > 0 ? '' : 'none'; gC.style.opacity = oC; gC.style.display = oC > 0 ? '' : 'none';
      /* ---- mao: placa -> entalhes -> dedos livres ---- */
      var r = seg(t, 3.2, 5.0), f = lerp(1, .14, r), c = lerp(22, -8, r);
      var bandas = t >= 2.5 && t < 5.2 ? Math.min(seg(t, 2.5, 2.9), 1 - seg(t, 4.8, 5.2)) : 0;
      var dl = '', pi = 0;
      for (var k = 0; k < 4; k++) {
        var m = membrana(k, f, c);
        memS[k].setAttribute('d', m.d); memF[k].setAttribute('d', m.d);
        /* faixa em apoptose: do terco da membrana ate a margem */
        var a = DIG[k], b = DIG[k + 1], z0 = dp(a, .35, 1), z1 = dp(b, .35, -1);
        if (f > .37) {
          faixas[k].setAttribute('d', 'M' + z0[0].toFixed(1) + ' ' + z0[1].toFixed(1) + ' L' + m.q0[0].toFixed(1) + ' ' + m.q0[1].toFixed(1) + ' Q' + m.c[0].toFixed(1) + ' ' + m.c[1].toFixed(1) + ' ' + m.q1[0].toFixed(1) + ' ' + m.q1[1].toFixed(1) + ' L' + z1[0].toFixed(1) + ' ' + z1[1].toFixed(1) + ' Z');
          faixas[k].style.opacity = bandas;
        } else faixas[k].style.opacity = 0;
        for (var j = 0; j < 6; j++) {
          var u = (j % 3 + .5) / 3, v = lerp(.45, f - .05, j < 3 ? .3 : .75);
          var x0 = dp(a, v, 1), x1 = dp(b, v, -1), p = pontos[pi++];
          p.setAttribute('cx', lerp(x0[0], x1[0], u).toFixed(1)); p.setAttribute('cy', (lerp(x0[1], x1[1], u) + 2).toFixed(1));
          p.style.opacity = f > .45 ? bandas : 0;
        }
        var alvo = tela(dp(a, Math.max(.4, f * .8), 1)), alvo2 = tela(dp(b, Math.max(.4, f * .8), -1));
        dl += 'M' + OX + ' 48 L' + ((alvo[0] + alvo2[0]) / 2).toFixed(1) + ' ' + ((alvo[1] + alvo2[1]) / 2).toFixed(1) + ' ';
      }
      var pl = 1 - seg(t, 2.9, 3.5); gPl.style.opacity = pl; gS.style.opacity = 1 - pl; gF.style.opacity = 1 - pl;
      var vis = f > .37 ? bandas : 0; lider.setAttribute('d', dl); lider.style.opacity = vis; rotA.style.opacity = vis;
      semana.textContent = t < 2.5 ? '≈ 6ª semana' : t < 5 ? '≈ 7ª semana' : '≈ 8ª semana';
      /* ---- apoptose x necrose ---- */
      var u2 = cl((t - 6.7) / 3.3);
      var s1 = seg(u2, 0, .3), s2 = seg(u2, .3, .55), s3 = seg(u2, .6, .95);
      var rA = lerp(34, 24, s1);
      celA.setAttribute('cx', AX); celA.setAttribute('cy', AY); celA.setAttribute('r', rA); celA.style.opacity = 1 - s3;
      nucA.setAttribute('cx', AX); nucA.setAttribute('cy', AY); nucA.setAttribute('r', lerp(13, 8, s1)); nucA.style.fill = s1 > .5 ? '#4d2f5c' : '#8e6aa0'; nucA.style.opacity = 1 - s2;
      [[-6, -4], [7, 3], [-1, 9]].forEach(function (d, i) { frags[i].setAttribute('cx', AX + d[0]); frags[i].setAttribute('cy', AY + d[1]); frags[i].style.opacity = s2 * (1 - s3); });
      bolhas.forEach(function (b, i) { var an = i * Math.PI / 4; b.setAttribute('cx', (AX + (rA + 1) * Math.cos(an)).toFixed(1)); b.setAttribute('cy', (AY + (rA + 1) * Math.sin(an)).toFixed(1)); b.setAttribute('r', ((i % 2 ? 6 : 4.5) * s2).toFixed(1)); b.style.opacity = 1 - s3; });
      var fx = lerp(AX - 60, AX + 8, s3);
      fago.setAttribute('d', 'M' + (fx - 52) + ' ' + (AY + 8) + ' Q' + (fx - 58) + ' ' + (AY - 42) + ' ' + (fx - 8) + ' ' + (AY - 46) + ' Q' + (fx + 44) + ' ' + (AY - 50) + ' ' + (fx + 54) + ' ' + (AY - 4) + ' Q' + (fx + 60) + ' ' + (AY + 40) + ' ' + (fx + 14) + ' ' + (AY + 46) + ' Q' + (fx - 30) + ' ' + (AY + 52) + ' ' + (fx - 52) + ' ' + (AY + 8) + ' Z');
      fago.style.opacity = s3; fagoN.setAttribute('cx', fx + 28); fagoN.setAttribute('cy', AY + 20); fagoN.style.opacity = s3;
      [[-14, -12], [8, -16], [-6, 10], [14, 6]].forEach(function (d, i) { corpos[i].setAttribute('transform', 'translate(' + (AX + d[0] * (1 + .4 * s3)).toFixed(1) + ' ' + (AY + d[1] * (1 + .4 * s3)).toFixed(1) + ')'); corpos[i].style.opacity = s3; });
      var CA = u2 < .3 ? ['encolhe', 'a cromatina se condensa', ''] : u2 < .6 ? ['bolhas na membrana', 'o núcleo se fragmenta', ''] : ['corpos apoptóticos', 'englobados por fagócito:', 'sem inflamação'];
      if (u2 <= 0) CA = ['célula normal', '', ''];
      capA.forEach(function (e, i) { e.textContent = CA[i]; });
      var n1 = seg(u2, 0, .35), n2 = seg(u2, .35, .6), n3 = seg(u2, .65, 1), rN = lerp(34, 46, n1);
      celN.setAttribute('cx', NX); celN.setAttribute('cy', NY); celN.setAttribute('r', rN); celN.style.opacity = 1 - n2; celN.style.fill = n2 > 0 ? 'none' : '#fdf1ec';
      var g1 = .25 * n2, arcs = '';
      [[-.5, 1.2], [1.6, 2.9], [3.3, 5.4]].forEach(function (ar) { var a0 = ar[0] + g1, a1 = ar[1] - g1; arcs += 'M' + (NX + rN * Math.cos(a0)).toFixed(1) + ' ' + (NY + rN * Math.sin(a0)).toFixed(1) + ' A' + rN + ' ' + rN + ' 0 0 1 ' + (NX + rN * Math.cos(a1)).toFixed(1) + ' ' + (NY + rN * Math.sin(a1)).toFixed(1) + ' '; });
      rompe.setAttribute('d', arcs); rompe.style.opacity = n2 > 0 ? 1 : 0;
      nucN.setAttribute('cx', NX); nucN.setAttribute('cy', NY); nucN.setAttribute('r', lerp(13, 15, n1)); nucN.style.opacity = 1 - .5 * n2;
      [[-20, -14, 30], [18, 16, -20], [16, -18, 60]].forEach(function (d, i) { var s = lerp(1, 1.8, n1); orgN[i].setAttribute('cx', NX + d[0] * .9); orgN[i].setAttribute('cy', NY + d[1] * .9); orgN[i].setAttribute('rx', 7 * s); orgN[i].setAttribute('ry', 3.2 * s); orgN[i].setAttribute('transform', 'rotate(' + d[2] + ' ' + (NX + d[0] * .9) + ' ' + (NY + d[1] * .9) + ')'); orgN[i].style.opacity = 1 - n2; });
      vaza.forEach(function (v, i) { var an = i * .63 + .2, rr = lerp(rN - 6, rN + 22, n2); v.setAttribute('cx', (NX + rr * Math.cos(an)).toFixed(1)); v.setAttribute('cy', (NY + rr * Math.sin(an)).toFixed(1)); v.style.opacity = n2 * (1 - .5 * n3); });
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (d, i) { var dd = lerp(80, 52, n3); leuco[i].setAttribute('transform', 'translate(' + (NX + d[0] * dd * .9).toFixed(1) + ' ' + (NY + d[1] * dd * .55).toFixed(1) + ')'); leuco[i].style.opacity = n3; });
      var CN = u2 < .35 ? ['incha', 'entra água; organelas incham', ''] : u2 < .65 ? ['a membrana se rompe', 'e o conteúdo vaza', ''] : ['inflamação:', 'chegam leucócitos', ''];
      if (u2 <= 0) CN = ['célula lesada', '', ''];
      capN.forEach(function (e, i) { e.textContent = CN[i]; });
      /* ---- painel ---- */
      var E = ETAPAS[0]; ETAPAS.forEach(function (x) { if (t >= x[0]) E = x; });
      pNome.textContent = E[1]; pL.forEach(function (e, i) { e.textContent = E[2][i] || ''; });
    };
  }
};
VIS.liga('apoptose-x-necrose', ['P9f037b6', 'Wc420fe2']);
