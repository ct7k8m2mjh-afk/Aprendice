/* Gordura -> hidrolise -> acido graxo saturado x insaturado -> LDL x HDL -> resposta (Unesp 2024, P1ac68cb). */
VIS.def['acido-graxo-saturado-insaturado'] = {
  tit: 'Da gordura ao HDL: saturado × insaturado',
  fontes: ['OpenStax, Biology 2e, 3.3 Lipids (triglicerídeo, ligação éster, saturado × insaturado, dobra cis) — https://openstax.org/books/biology-2e/pages/3-3-lipids', 'Wikipedia (en), High-density lipoprotein (HDL leva colesterol de volta ao fígado; saturados elevam o LDL; insaturados ajudam o HDL) — https://en.wikipedia.org/wiki/High-density_lipoprotein'],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Hidrólise'], [3, '2. Procure a C=C'], [6.2, '3. LDL × HDL'], [9.4, '4. Resposta']],
  cred: 'Animação feita para o app (esquema fora de escala). As cadeias são as da questão: CH₃–(CH₂)₈–COOH (X) e CH₃–CH₂–CH=CH–(CH₂)₅–COOH (Y), esta desenhada cis, a forma comum nos alimentos.',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var S = { fase: 'font-size:21px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14px;fill:var(--tinta)', mini: 'font-size:13px;fill:var(--lapis)', at: 'font-size:13.5px;font-weight:700;fill:#b4442f' };
    var SAT = '#8a6d3b', INS = '#2f8a5b', VERM = '#b4442f', LDLc = '#d08a12', HDLc = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 350');
    var LIG = 'fill:none;stroke:var(--tinta);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round';
    /* cadeia em bastao a partir do C1 (carboxila, direita) para a esquerda, angulos de 120 graus;
       no cis os giros nas duas pontas da dupla tem o mesmo sentido */
    function cadeia(x0, y0, n, L, dupla, cima, pai, estilo) {
      var pts = [[x0, y0]], h = cima ? 150 : 210, sg = cima ? -1 : 1;
      for (var k = 0; k < n - 1; k++) {
        if (k > 0) { if (dupla === null || k !== dupla + 2) sg = -sg; h += sg * 60; }
        var r = h * Math.PI / 180, p = pts[pts.length - 1]; pts.push([p[0] + L * Math.cos(r), p[1] - L * Math.sin(r)]);
      }
      el('path', { d: 'M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L'), style: estilo || LIG }, pai);
      var dup = null;
      if (dupla !== null) {
        var a = pts[dupla + 1], b = pts[dupla + 2], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy), ox = -dy / m * 5, oy = dx / m * 5;
        var c6 = pts[dupla], c9 = pts[dupla + 3], mx = (c6[0] + c9[0]) / 2 - (a[0] + b[0]) / 2, my = (c6[1] + c9[1]) / 2 - (a[1] + b[1]) / 2;
        if (ox * mx + oy * my < 0) { ox = -ox; oy = -oy; }   /* segundo traco do lado de dentro da dobra */
        dup = el('path', { d: 'M' + (a[0] + ox + dx * .15).toFixed(1) + ' ' + (a[1] + oy + dy * .15).toFixed(1) + ' L' + (b[0] + ox - dx * .15).toFixed(1) + ' ' + (b[1] + oy - dy * .15).toFixed(1), style: estilo || LIG }, pai);
      }
      return { pts: pts, dup: dup };
    }
    function carboxila(x, y, cadeiaSobe, pai) {
      if (!cadeiaSobe) {   /* C2 a 210 graus: =O a 90, OH a 330 */
        el('path', { d: 'M' + x + ' ' + y + ' L' + x + ' ' + (y - 22) + ' M' + (x + 5) + ' ' + (y - 3) + ' L' + (x + 5) + ' ' + (y - 19), style: LIG }, pai);
        el('path', { d: 'M' + x + ' ' + y + ' L' + (x + 17) + ' ' + (y + 10), style: LIG }, pai);
        tx(x - 5, y - 26, 'O', S.at, pai); tx(x + 19, y + 16, 'OH', S.at, pai);
      } else {             /* C2 a 150 graus: =O a 30, OH a 270 */
        el('path', { d: 'M' + x + ' ' + y + ' L' + (x + 19) + ' ' + (y - 11) + ' M' + (x - 2.5) + ' ' + (y - 4) + ' L' + (x + 14) + ' ' + (y - 13.5), style: LIG }, pai);
        el('path', { d: 'M' + x + ' ' + y + ' L' + x + ' ' + (y + 18), style: LIG }, pai);
        tx(x + 21, y - 10, 'O', S.at, pai); tx(x - 7, y + 33, 'OH', S.at, pai);
      }
    }
    /* ================= etapa 1: hidrolise ================= */
    var g1 = el('g', {});
    tx(20, 40, 'Triglicerídeo (gordura): glicerol + 3 ácidos graxos', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', g1);
    el('rect', { x: 34, y: 78, width: 18, height: 188, rx: 6, style: 'fill:#e9d9a6;stroke:#a68b3c;stroke-width:1.6' }, g1);
    tx(43, 290, 'glicerol', 'font-size:13px;font-weight:700;fill:#8a6d1f;text-anchor:middle', g1);
    var caudas = [], esteres = [], aguas = [], ohs = [], hoocs = [];
    [104, 172, 240].forEach(function (y, i) {
      var c = el('g', {}, g1);
      el('path', { d: 'M0 0 H30 l14 -9 l14 9 l14 -9 l14 9 l14 -9 l14 9 l14 -9 l14 9 l14 -9 l14 9 l14 -9 l14 9 l14 -9 l14 9', style: LIG }, c);
      caudas.push(c);
      esteres.push(el('circle', { cx: 70, cy: y, r: 6, style: 'fill:' + VERM }, g1));
      var w = el('g', {}, g1); tx(0, 0, 'H₂O', 'font-size:14px;font-weight:700;fill:#2b7bbf', w); aguas.push(w);
      ohs.push(tx(56, y + 5, 'OH', 'font-size:13px;font-weight:700;fill:' + VERM, g1));
      hoocs.push(tx(0, 0, 'HOOC', 'font-size:13px;font-weight:700;fill:' + VERM, g1));
      c.__y = y;
    });
    var est = tx(76, 62, 'ligação éster', 'font-size:13px;font-weight:700;fill:' + VERM, g1);
    /* ================= etapa 2: procure a C=C ================= */
    var g2 = el('g', {});
    tx(20, 40, 'Gordura X libera', S.mini, g2); tx(134, 40, 'CH₃–(CH₂)₈–COOH', 'font-size:14px;font-weight:700;fill:var(--tinta)', g2);
    var mx = cadeia(300, 92, 10, 26, null, false, g2); carboxila(300, 92, false, g2);
    var sx = tx(20, 132, 'só ligações simples: SATURADO', 'font-size:14px;font-weight:700;fill:' + SAT, g2), sx2 = tx(20, 150, 'cadeia reta, empacota: sólida', S.sub, g2);
    tx(20, 186, 'Gordura Y libera', S.mini, g2); tx(134, 186, 'CH₃–CH₂–CH=CH–(CH₂)₅–COOH', 'font-size:14px;font-weight:700;fill:var(--tinta)', g2);
    var my = cadeia(300, 252, 10, 26, 5, true, g2); carboxila(300, 252, true, g2);
    var a6 = my.pts[6], b7 = my.pts[7];
    var ccT = tx((a6[0] + b7[0]) / 2 - 6, (a6[1] + b7[1]) / 2 + 17, 'C=C', 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + INS, g2);
    var sy = tx(20, 300, 'tem C=C: INSATURADO', 'font-size:14px;font-weight:700;fill:' + INS, g2), sy2 = tx(20, 318, 'a dupla cis dobra a cadeia: líquida', S.sub, g2);
    var lupa = el('circle', { r: 13, style: 'fill:none;stroke:var(--tinta);stroke-width:2;opacity:.7' }, g2);
    /* ================= etapa 3: LDL x HDL ================= */
    var g3 = el('g', {});
    el('path', { d: 'M18 120 Q30 92 78 96 Q122 100 128 140 Q132 186 92 200 Q46 212 26 186 Q8 160 18 120 Z', style: 'fill:#b5624a;stroke:#7d3b2a;stroke-width:2' }, g3);
    tx(72, 156, 'fígado', 'font-size:14px;font-weight:700;fill:#fff;text-anchor:middle', g3);
    /* arteria */
    el('rect', { x: 170, y: 104, width: 220, height: 20, style: 'fill:#e7a3a0;stroke:#b5605c;stroke-width:1.5' }, g3);
    el('rect', { x: 170, y: 124, width: 220, height: 64, style: 'fill:#fbe9e7' }, g3);
    el('rect', { x: 170, y: 188, width: 220, height: 20, style: 'fill:#e7a3a0;stroke:#b5605c;stroke-width:1.5' }, g3);
    tx(280, 96, 'artéria', 'font-size:13px;font-weight:700;fill:#9a4a46;text-anchor:middle', g3);
    var placa = el('path', { style: 'fill:#f2cf6b;stroke:#b8902a;stroke-width:1.5' }, g3);
    var plT = tx(320, 232, 'placa de colesterol', 'font-size:13px;font-weight:700;fill:#8d6a12;text-anchor:middle', g3);
    el('path', { d: 'M126 172 H166 m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:' + LDLc + ';stroke-width:2' }, g3);
    el('path', { d: 'M166 140 H128 m8 -5 l-8 5 l8 5', style: 'fill:none;stroke:' + HDLc + ';stroke-width:2' }, g3);
    var ldl = [0, 1, 2].map(function () { var g = el('g', {}, g3); el('circle', { r: 15.5, style: 'fill:' + LDLc }, g); tx(0, 4.5, 'LDL', 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g); return g; });
    var hdl = [0, 1].map(function () { var g = el('g', {}, g3); el('circle', { r: 15.5, style: 'fill:' + HDLc }, g); tx(0, 4.5, 'HDL', 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g); return g; });
    tx(20, 246, 'LDL: leva colesterol do fígado', 'font-size:13.5px;font-weight:700;fill:' + LDLc, g3); tx(20, 264, 'para os tecidos; em excesso, deposita na artéria', S.sub, g3);
    tx(20, 292, 'HDL: recolhe o excesso de colesterol', 'font-size:13.5px;font-weight:700;fill:' + HDLc, g3); tx(20, 310, 'e o leva de volta ao fígado', S.sub, g3);
    /* ================= etapa 4: resposta ================= */
    var g4 = el('g', {});
    [['Gordura Y', 'tem a C=C', '#555'], ['ácidos graxos', 'INSATURADOS', INS], ['ajudam a', 'manter o HDL', HDLc]].forEach(function (c, i) {
      var x = 22 + i * 124;
      el('rect', { x: x, y: 120, width: 108, height: 66, rx: 10, style: 'fill:color-mix(in srgb,' + c[2] + ' 12%,var(--folha));stroke:' + c[2] + ';stroke-width:1.8' }, g4);
      tx(x + 54, 147, c[0], 'font-size:14px;fill:var(--tinta);text-anchor:middle', g4); tx(x + 54, 168, c[1], 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + c[2], g4);
      if (i < 2) el('path', { d: 'M' + (x + 110) + ' 153 h12 m-6 -5 l6 5 l-6 5', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, g4);
    });
    tx(22, 232, 'X só tem ligações simples: é saturada.', S.sub, g4);
    tx(22, 252, 'LDL é o que entrega colesterol e forma placa;', S.sub, g4);
    tx(22, 272, 'o texto descreve quem RETIRA: é o HDL.', S.sub, g4);
    /* painel */
    var px = 404;
    var fase = tx(px, 40, '', S.fase), L = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return tx(px, 68 + i * 19, '', S.sub); });
    var resp = tx(px, 220, '', 'font-size:15px;font-weight:700;fill:' + INS), resp2 = tx(px, 240, '', 'font-size:15px;font-weight:700;fill:' + INS);
    return function (t) {
      var e = t < 3 ? 0 : t < 6.2 ? 1 : t < 9.4 ? 2 : 3;
      op(g1, e === 0 ? 1 : 0); op(g2, e === 1 ? 1 : 0); op(g3, e === 2 ? 1 : 0); op(g4, e === 3 ? 1 : 0);
      var P;
      if (e === 0) {
        var ua = ease((t - .3) / 1.1), ub = ease((t - 1.4) / 1.2);
        caudas.forEach(function (c, i) {
          var y = c.__y, x = 70 + 60 * ub; c.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y + ')');
          op(esteres[i], 1 - ub);
          aguas[i].setAttribute('transform', 'translate(' + lerp(150, 60, ua).toFixed(1) + ' ' + (y - 16 - 10 * (1 - ua)).toFixed(1) + ')'); op(aguas[i], ua * (1 - ub));
          op(ohs[i], ub); hoocs[i].setAttribute('x', (x - 39).toFixed(1)); hoocs[i].setAttribute('y', y + 5); op(hoocs[i], ub);
        });
        op(est, 1 - ub);
        P = ['1. Hidrólise', ['A lipase usa água para quebrar as', '3 ligações éster da gordura.', 'Saem glicerol e 3 ácidos graxos.', 'São eles que a questão compara', '(as fórmulas de X e de Y).', '', '']];
      } else if (e === 1) {
        var u = cl((t - 3.2) / 2.6), lado = u < .5, uu = lado ? u / .5 : (u - .5) / .5, pts = lado ? mx.pts : my.pts, k = Math.min(9, Math.floor(uu * 10)), p = pts[9 - k];
        lupa.setAttribute('cx', p[0].toFixed(1)); lupa.setAttribute('cy', p[1].toFixed(1)); op(lupa, u < 1 ? 1 : 0);
                var acesa = (!lado && 9 - k <= 7) || u >= 1;
        [my.dup].forEach(function (d) { d.style.stroke = acesa ? INS : 'var(--tinta)'; d.style.strokeWidth = acesa ? 3.2 : 2.2; });
        op(ccT, acesa ? 1 : 0); op(sx, lado && uu < .95 ? .25 : 1); op(sx2, lado && uu < .95 ? .25 : 1); op(sy, acesa ? 1 : .25); op(sy2, acesa ? 1 : .25);
        P = ['2. Procure a C=C', ['Saturado: entre os carbonos só há', 'ligações simples (cadeia reta).', 'Insaturado: tem ao menos uma', 'dupla C=C. A dupla cis dobra a', 'cadeia, que não empacota bem.', 'X é saturado; Y é insaturado.', '']];
      } else if (e === 2) {
        var v = (t - 6.2) / 3.2;
        ldl.forEach(function (g, i) {
          var w = cl((v - i * .25) / .4), x = lerp(176, 268 + 30 * i, w), y = 172;
          g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); op(g, w > 0 && w < .9 ? 1 : w < 1 ? (1 - w) * 10 : 0);   /* ao chegar, o colesterol vai para a placa */
        });
        hdl.forEach(function (g, i) {
          var w = cl((v - .5 - i * .22) / .4), x = lerp(300, 176, w), y = 140;
          g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); op(g, w > 0 && w < 1 ? 1 : 0);
        });
        var h = 10 + 10 * cl(v * 1.6);
        placa.setAttribute('d', 'M262 188 Q300 ' + (188 - h * 1.6).toFixed(1) + ' 338 188 Z');
        P = ['3. LDL × HDL', ['O colesterol viaja no sangue em', 'lipoproteínas. O LDL leva; o HDL', 'traz de volta ao fígado.', 'Dieta rica em saturados tende a', 'elevar o LDL; os insaturados', 'ajudam a manter o HDL.', '']];
      } else {
        P = ['4. Juntando', ['A gordura Y libera insaturados,', 'que ajudam a manter o HDL, a', 'lipoproteína que retira o excesso', 'de colesterol do sangue.', '', '', '']];
      }
      fase.textContent = P[0]; L.forEach(function (x, i) { x.textContent = P[1][i]; });
      resp.textContent = e === 3 ? 'Por isso a resposta é E:' : ''; resp2.textContent = e === 3 ? 'Y, insaturados, HDL.' : '';
    };
  }
};
VIS.liga('acido-graxo-saturado-insaturado', ['P1ac68cb']);
