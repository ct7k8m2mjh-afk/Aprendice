/* Ciclo celular (G1, S, G2, M) com a quantidade de DNA por célula na mitose e na meiose */
VIS.def['ciclo-celular-quantidade-dna'] = {
  tit: 'Ciclo celular: quando o DNA dobra e quando ele é repartido',
  tipo: 'anim', dur: 12.4,
  marcas: [[0, 'G1'], [2.6, 'S'], [4.6, 'G2'], [5.8, 'Divisão'], [10, 'Resposta']],
  fontes: ['OpenStax Biology 2e, 10.2 The Cell Cycle — https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle', 'OpenStax Biology 2e, 11.1 The Process of Meiosis — https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis'],
  cred: 'Animação feita para o app (esquema fora de escala; célula com 2n = 4).',
  nota: 'C é a quantidade de DNA de um conjunto haploide (n) de cromossomos não duplicados; algumas provas escrevem x no lugar de C. A interfase (G1, S e G2) vem antes e depois de cada mitose. Uma célula que deixa de se dividir, como o neurônio, sai do ciclo a partir de G1 e fica em G0.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 446');
    var PQ = {"P258c1f7": "Na fase 1, a interfase, a célula cresce: alternativa C. Disjunção e permutação de homólogos são eventos só da meiose.", "Wc2eb01c": "A duplicação do DNA acontece na fase S da interfase: alternativa D.", "Wbfd3a72": "O ciclo alterna interfase e mitose: o que vem antes e depois da mitose é a interfase. Alternativa C.", "Wd687b3b": "A duplicação do material genético ocorre na interfase (fase S), não na mitose: alternativa E.", "Wbec1565": "O DNA dobra na fase S, que fica entre G1 e G2: alternativa A.", "W42679ca": "Em G1 a célula tem 2C e em G2 tem 4C: G1 tem metade do DNA de G2. Alternativa E.", "P9478a0b": "A célula A está em 4x (G2) e a B em x (telófase II): alternativa A."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var VERM = '#c0504d', AZUL = '#3d6fb6';

    /* ---------- relogio do ciclo ---------- */
    var CX = 132, CY = 148, R1 = 112, R0 = 84;
    /* fatias: G1, S, G2, M (fração do relógio) e o intervalo de tempo de cada uma */
    var FAT = [['G1', .40, 0, 2.6, '#7fb08a'], ['S', .27, 2.6, 4.6, '#d9a441'], ['G2', .17, 4.6, 5.8, '#8fa7cf'], ['M', .16, 5.8, 8.6, '#c77b74']];
    function pol(a, r) { return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
    var ac = -Math.PI / 2, fatEl = [];
    FAT.forEach(function (f) {
      var a0 = ac, a1 = ac + f[1] * 2 * Math.PI; ac = a1;
      var p0 = pol(a0, R1), p1 = pol(a1, R1), q1 = pol(a1, R0), q0 = pol(a0, R0), lg = f[1] > .5 ? 1 : 0;
      var d = 'M' + p0 + ' A' + R1 + ' ' + R1 + ' 0 ' + lg + ' 1 ' + p1 + ' L' + q1 + ' A' + R0 + ' ' + R0 + ' 0 ' + lg + ' 0 ' + q0 + 'Z';
      var s = el('path', { d: d, style: 'fill:' + f[4] + ';stroke:var(--folha);stroke-width:3' });
      var am = (a0 + a1) / 2, pm = pol(am, (R0 + R1) / 2);
      var lb = tx(pm[0], pm[1] + 6, f[0], 'font-size:17px;font-weight:700;fill:#fff;text-anchor:middle');
      f.a0 = a0; f.a1 = a1; fatEl.push([s, lb]);
    });
    /* rotulo "interfase" acompanhando o arco G1+S+G2 por fora */
    var aI0 = FAT[0].a0, aI1 = FAT[2].a1;
    var dI = ''; for (var q = 0; q <= 60; q++) { var pq = pol(aI0 + .05 + (aI1 - aI0 - .1) * q / 60, R1 + 9); dI += (q ? 'L' : 'M') + pq[0].toFixed(1) + ' ' + pq[1].toFixed(1) + ' '; }
    el('path', { d: dI, style: 'fill:none;stroke:var(--lapis);stroke-width:1.5' });
    var ml = pol(FAT[3].a0 + (FAT[3].a1 - FAT[3].a0) / 2, R1 + 16);
    tx(ml[0] - 4, ml[1] - 2, 'mitose', 'font-size:13px;font-weight:600;text-anchor:end;' + LAP);
    var il = pol(.62, R1 + 22);
    tx(il[0] + 4, il[1] + 10, 'interfase', 'font-size:13px;font-weight:600;' + LAP);
    /* ponteiro */
    var pont = el('path', { style: 'fill:var(--tinta)' });
    fatEl.forEach(function (f) { svg.appendChild(f[1]); });   /* rotulos das fatias por cima do ponteiro */

    /* ---------- celula no centro do relogio ---------- */
    var gCel = el('g', { transform: 'translate(' + CX + ' ' + CY + ') scale(1.38) translate(' + (-CX) + ' ' + (-CY) + ')' });
    var bordas = el('g', {}, gCel), cits = el('g', {}, gCel);
    var celA = el('ellipse', { style: 'fill:none;stroke:#b98a7c;stroke-width:5' }, bordas), celB = el('ellipse', { style: 'fill:none;stroke:#b98a7c;stroke-width:5' }, bordas);
    var citA = el('ellipse', { style: 'fill:#fbeee6' }, cits), citB = el('ellipse', { style: 'fill:#fbeee6' }, cits);
    var nucA = el('circle', { style: 'fill:#efe0f0;stroke:#9b7aa6;stroke-width:1.6' }, gCel), nucB = el('circle', { style: 'fill:#efe0f0;stroke:#9b7aa6;stroke-width:1.6' }, gCel);
    var fuso = el('path', { style: 'fill:none;stroke:#b7a99a;stroke-width:1' }, gCel);
    /* 4 cromossomos (2n = 4): [comprimento, cor, x, y, angulo] na interfase; na metafase empilhados no meio */
    var CR = [[15, VERM, -8, -7, 35, -27], [15, AZUL, 7, 6, -25, 25], [9, VERM, 9, -11, 75, -8], [9, AZUL, -9, 10, 15, 6]];
    var crt = CR.map(function () { return [el('path', { style: 'fill:none;stroke-linecap:round;stroke-linejoin:round' }, gCel), el('path', { style: 'fill:none;stroke-linecap:round;stroke-linejoin:round' }, gCel)]; });
    var cen = CR.map(function (c) { return el('circle', { style: 'fill:' + c[1] + ';stroke:#5b4040;stroke-width:.8' }, gCel); });
    function crom(x, y, ang, L, amp) {   /* caminho de um cromossomo: ondulado (cromatina) a reto (condensado) */
      var a = ang * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a), d = '';
      for (var k = 0; k <= 12; k++) { var u = k / 12 - .5, w = amp * Math.sin(u * Math.PI * 5); d += (k ? 'L' : 'M') + (x + u * L * dx - w * dy).toFixed(1) + ' ' + (y + u * L * dy + w * dx).toFixed(1) + ' '; }
      return d;
    }
    var fNome = tx(CX, 300, '', 'font-size:17px;font-weight:700;text-anchor:middle;' + TINTA);
    var fL1 = tx(CX, 320, '', 'font-size:14px;text-anchor:middle;' + TINTA), fL2 = tx(CX, 338, '', 'font-size:14px;text-anchor:middle;' + TINTA);

    /* ---------- graficos de DNA ---------- */
    var GX0 = 334, XS = [[0, 334], [2.6, 412], [4.6, 482], [5.8, 528], [8.6, 598], [10, 628]];
    function gx(t) { for (var i = 1; i < XS.length; i++) if (t <= XS[i][0]) return lerp(XS[i - 1][1], XS[i][1], (t - XS[i - 1][0]) / (XS[i][0] - XS[i - 1][0])); return 628; }
    function dMit(t) { return t < 2.6 ? 2 : t < 4.6 ? 2 + 2 * (t - 2.6) / 2 : t < 8.25 ? 4 : t < 8.6 ? 4 - 2 * (t - 8.25) / .35 : 2; }
    function dMei(t) { return t < 2.6 ? 2 : t < 4.6 ? 2 + 2 * (t - 2.6) / 2 : t < 6.95 ? 4 : t < 7.2 ? 4 - 2 * (t - 6.95) / .25 : t < 8.25 ? 2 : t < 8.6 ? 2 - (t - 8.25) / .35 : 1; }
    function grafico(base, titulo, f, rot) {
      function gy(v) { return base - 20 * v; }
      tx(GX0 - 34, base - 104, titulo, 'font-size:14px;font-weight:700;' + TINTA);
      el('line', { x1: GX0, x2: 630, y1: base, y2: base, style: 'stroke:var(--lapis);stroke-width:1.5' });
      el('line', { x1: GX0, x2: GX0, y1: base, y2: base - 90, style: 'stroke:var(--lapis);stroke-width:1.5' });
      [[4, '4C'], [2, '2C'], [1, 'C']].forEach(function (n) {
        el('line', { x1: GX0, x2: 630, y1: gy(n[0]), y2: gy(n[0]), style: 'stroke:var(--linha);stroke-width:1;stroke-dasharray:3 4' });
        tx(GX0 - 6, gy(n[0]) + 5, n[1], 'font-size:13px;font-weight:600;text-anchor:end;' + LAP);
      });
      var faixa = el('rect', { y: base - 92, height: 92, style: 'fill:var(--ad-c);opacity:.12' });
      var d = ''; for (var t = 0; t <= 10.001; t += .05) d += (t ? 'L' : 'M') + gx(t).toFixed(1) + ' ' + gy(f(t)).toFixed(1) + ' ';
      el('path', { d: d, style: 'fill:none;stroke:var(--lapis);stroke-width:2;opacity:.3' });
      var linha = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-width:3.5;stroke-linejoin:round' });
      var ponto = el('circle', { r: 5.5, style: 'fill:var(--ad-t)' });
      var val = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
      var labs = rot.map(function (r) { return [tx(r[1], base + 18, r[0], 'font-size:13px;text-anchor:middle'), r]; });
      return function (t) {
        var dd = ''; for (var s = 0; s <= t + 1e-6; s += .05) dd += (s ? 'L' : 'M') + gx(s).toFixed(1) + ' ' + gy(f(s)).toFixed(1) + ' ';
        dd += 'L' + gx(t).toFixed(1) + ' ' + gy(f(t)).toFixed(1);
        linha.setAttribute('d', dd);
        var x = gx(t), v = f(t); ponto.setAttribute('cx', x.toFixed(1)); ponto.setAttribute('cy', gy(v).toFixed(1));
        var vt = v > 3.98 ? '4C' : v > 1.98 && v < 2.02 ? '2C' : v < 1.02 ? 'C' : '';
        val.textContent = vt; val.setAttribute('x', (x > 590 ? x + 4 : x + 9).toFixed(1)); val.setAttribute('y', (gy(v) - (x > 590 ? 16 : 9)).toFixed(1));
        val.style.textAnchor = x > 590 ? 'end' : 'start';
        labs.forEach(function (L) {
          var on = t >= L[1][2] && t < L[1][3];
          L[0].setAttribute('style', 'font-size:13px;text-anchor:middle;font-weight:' + (on ? 700 : 500) + ';fill:' + (on ? 'var(--ad-t)' : 'var(--lapis)'));
          if (on) { faixa.setAttribute('x', L[1][4]); faixa.setAttribute('width', L[1][5] - L[1][4]); }
        });
      };
    }
    var g1 = grafico(132, 'DNA por célula na mitose', dMit, [['G1', 373, 0, 2.6, 334, 412], ['S', 447, 2.6, 4.6, 412, 482], ['G2', 505, 4.6, 5.8, 482, 528], ['mitose', 563, 5.8, 8.6, 528, 598], ['G1', 613, 8.6, 10.01, 598, 628]]);
    var g2 = grafico(300, 'DNA por célula na meiose', dMei, [['G1', 373, 0, 2.6, 334, 412], ['S', 447, 2.6, 4.6, 412, 482], ['G2', 505, 4.6, 5.8, 482, 528], ['M I', 545, 5.8, 7.2, 528, 563], ['M II', 581, 7.2, 8.6, 563, 598], ['fim', 613, 8.6, 10.01, 598, 628]]);
    var nota2 = tx(GX0 - 34, 338, '', 'font-size:13px;' + LAP);

    var TXT = [
      [0, 'G1: crescimento', 'a célula cresce, produz RNA e', 'proteínas e exerce sua função'],
      [2.6, 'S: síntese de DNA', 'cada cromossomo é copiado e', 'passa a ter 2 cromátides-irmãs'],
      [4.6, 'G2: preparo', 'o DNA já está duplicado; a', 'célula se prepara para dividir'],
      [5.8, 'Mitose: prófase', 'os cromossomos condensam e', 'o envoltório do núcleo se desfaz'],
      [6.35, 'Mitose: metáfase', 'cromossomos alinhados no meio,', 'condensação máxima'],
      [6.95, 'Mitose: anáfase', 'as cromátides-irmãs se separam', 'e vão para os polos'],
      [7.7, 'Telófase e citocinese', 'os núcleos se refazem e o', 'citoplasma se divide em dois'],
      [8.6, 'De volta a G1', '2 células-filhas com 2C cada,', 'iguais à célula original']];

    function quebraF(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    var FIMG = document.createElementNS('http://www.w3.org/2000/svg', 'g'), CARD = { x: 8, y: 352, w: 624, n: 82 };
    function cartao(c) {   /* cartao do tamanho do texto */
      while (FIMG.firstChild) FIMG.removeChild(FIMG.firstChild);
      var L = quebraF(PQ[qid] || '', c.n), h = 46 + L.length * 21;
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); [['x', c.x], ['y', c.y], ['width', c.w], ['height', h], ['rx', 12]].forEach(function (a) { r.setAttribute(a[0], a[1]); }); r.setAttribute('style', 'fill:var(--folha,#fff);stroke:var(--ad-c);stroke-width:1.5'); FIMG.appendChild(r);
      [['Por isso a resposta é', 'font-size:16px;font-weight:700;fill:var(--ad-t)']].concat(L.map(function (s) { return [s, 'font-size:15px;fill:var(--tinta)']; })).forEach(function (l, k) { var e = document.createElementNS('http://www.w3.org/2000/svg', 'text'); e.setAttribute('x', c.x + 14); e.setAttribute('y', c.y + 24 + k * 21 + (k ? 4 : 0)); e.setAttribute('style', l[1]); e.textContent = l[0]; FIMG.appendChild(e); });
    }
    cartao(CARD);
    svg.appendChild(FIMG);
    return function (t0) {
      var t = Math.min(t0, 9.999); FIMG.style.display = PQ[qid] && t0 >= 10 ? '' : 'none';
      /* ponteiro */
      var ang = -Math.PI / 2;
      FAT.forEach(function (f, i) {
        if (t >= f[2]) ang = f.a0 + (f.a1 - f.a0) * cl((t - f[2]) / (f[3] - f[2]));
        var on = t >= f[2] && t < f[3] || (i === 0 && t >= 8.6);
        fatEl[i][0].style.opacity = on ? 1 : .45;
      });
      if (t >= 8.6) ang = FAT[0].a0 + (FAT[0].a1 - FAT[0].a0) * .45 * (t - 8.6) / 1.4;
      var pa = pol(ang, R1 + 4), pb = pol(ang - .07, R0 - 8), pc = pol(ang + .07, R0 - 8);
      pont.setAttribute('d', 'M' + pa + ' L' + pb + ' L' + pc + 'Z');

      /* celula */
      var nov = t >= 8.6, k, sOff, sVis, pos;
      var cresce = nov ? lerp(.62, .7, (t - 8.6) / 1.4) : lerp(.72, 1, cl(t / 5.8));
      var rc = 40 * cresce, rn = 21 * cresce;
      var anaf = seg(t, 6.95, 7.7), telo = seg(t, 7.7, 8.6);
      var sep = nov ? 1 : telo;     /* afastamento das duas celulas */
      var ex = nov ? 28 : lerp(0, 28, sep);
      var rxC = nov ? rc : lerp(lerp(rc, rc + 8, anaf), 25, sep), ryC = nov ? rc : lerp(rc, 25, sep);
      [[celA, citA, -1], [celB, citB, 1]].forEach(function (c) {
        [c[0], c[1]].forEach(function (e) { e.setAttribute('cx', CX + c[2] * ex); e.setAttribute('cy', CY); e.setAttribute('rx', rxC.toFixed(1)); e.setAttribute('ry', ryC.toFixed(1)); });
      });
      /* nucleo: some na profase e volta na telofase */
      var nOp = nov ? 1 : t < 5.8 ? 1 : t < 6.3 ? 1 - seg(t, 5.8, 6.3) : t < 7.9 ? 0 : seg(t, 7.9, 8.5);
      var nr = nov ? 15 : t >= 7.7 ? 15 : rn;
      [[nucA, -1], [nucB, 1]].forEach(function (n) { n[0].setAttribute('cx', CX + n[1] * ex); n[0].setAttribute('cy', CY); n[0].setAttribute('r', nr.toFixed(1)); n[0].style.opacity = nOp; });
      /* fuso */
      var fOp = t > 6.1 && t < 7.9 ? Math.min(seg(t, 6.1, 6.4), 1 - seg(t, 7.6, 7.9)) : 0;
      fuso.style.opacity = fOp;
      var pE = CX - rxC + 6, pD = CX + rxC - 6, dF = '';
      /* cromossomos */
      k = t < 5.8 ? 0 : t < 6.35 ? seg(t, 5.8, 6.35) : t < 7.7 ? 1 : 1 - seg(t, 7.8, 8.6);   /* condensacao */
      if (nov) k = 0;
      sVis = nov ? 1 : t < 2.6 ? 0 : seg(t, 2.6, 4.6);
      CR.forEach(function (c, i) {
        var L = c[0] * lerp(1.7, 1, k), amp = 2.6 * (1 - k), sw = lerp(2.2, 4.6, k);
        var ix = c[2] * cresce, iy = c[3] * cresce, ia = c[4];
        var m = seg(t, 5.9, 6.35), cxx = lerp(ix, 0, m), cyy = lerp(iy, c[5], m), ca = lerp(ia, 90, m);
        var s0 = lerp(2.2, 5.4, k), sa = lerp(s0, 56, anaf);
        for (var j = 0; j < 2; j++) {
          var sg = j ? 1 : -1, x, y, a = ca, LL = L, aa = amp, vd = '';
          if (t < 6.95 && !nov) { var pr = (ca + 90) * Math.PI / 180, off = sg * (sVis > 0 ? s0 / 2 : 0); x = cxx + Math.cos(pr) * off; y = cyy + Math.sin(pr) * off; }
          else if (t < 7.7 && !nov) { x = sg * sa / 2; y = c[5]; var vb = 7 * anaf, vd = 'M' + (CX + x - sg * vb).toFixed(1) + ' ' + (CY + y - c[0] / 2).toFixed(1) + ' L' + (CX + x).toFixed(1) + ' ' + (CY + y).toFixed(1) + ' L' + (CX + x - sg * vb).toFixed(1) + ' ' + (CY + y + c[0] / 2).toFixed(1); }
          else { var u = nov ? 1 : telo; x = lerp(sg * 28, sg * 28 + ix * .55, u); y = lerp(c[5], iy * .55, u); a = lerp(90, ia, u); LL = L * lerp(1, .5, u); aa = amp * .6; }
          if (nov) { LL = c[0] * 1.7 * .5 * (cresce / .62); aa = 1.6; }
          var p = crt[i][j];
          p.setAttribute('d', vd || crom(CX + x, CY + y, a, LL, aa)); vd = '';
          p.style.stroke = c[1]; p.style.strokeWidth = sw.toFixed(2);
          p.style.opacity = j === 1 ? sVis : 1;
          if (j === 0 && fOp > 0) dF += 'M' + pE.toFixed(1) + ' ' + CY + ' L' + (CX + (t < 6.95 ? -s0 / 2 : -sa / 2)).toFixed(1) + ' ' + (CY + c[5]).toFixed(1) + ' M' + pD.toFixed(1) + ' ' + CY + ' L' + (CX + (t < 6.95 ? s0 / 2 : sa / 2)).toFixed(1) + ' ' + (CY + c[5]).toFixed(1) + ' ';
        }
      });
      fuso.setAttribute('d', dF || 'M0 0');
      CR.forEach(function (c, i) {   /* centromero une as cromatides-irmas ate a anafase */
        var m = seg(t, 5.9, 6.35), on = !nov && t < 6.95 && sVis > .3;
        cen[i].style.opacity = on ? Math.min(1, sVis) : 0;
        cen[i].setAttribute('cx', (CX + lerp(c[2] * cresce, 0, m)).toFixed(1)); cen[i].setAttribute('cy', (CY + lerp(c[3] * cresce, c[5], m)).toFixed(1));
        cen[i].setAttribute('r', lerp(2.4, 4.4, k).toFixed(2));
      });
      /* textos */
      var cur = TXT[0]; TXT.forEach(function (x) { if (t >= x[0]) cur = x; });
      fNome.textContent = cur[1]; fL1.textContent = cur[2]; fL2.textContent = cur[3];
      g1(t); g2(t);
      nota2.textContent = t >= 8.6 ? 'Meiose: 4 células n, cada uma com C' : t >= 7.2 ? 'Fim da meiose I: 2 células n, ainda com 2C' : t >= 4.6 ? 'De G2 até a anáfase I: 4C' : t >= 2.6 ? 'Na fase S o DNA vai de 2C a 4C' : 'Em G1: 2C';
    };
  }
};
VIS.liga('ciclo-celular-quantidade-dna', ['P258c1f7', 'Wc2eb01c', 'Wbfd3a72', 'Wd687b3b', 'Wbec1565', 'W42679ca', 'P9478a0b']);
