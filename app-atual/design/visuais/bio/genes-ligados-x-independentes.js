/* Segregação independente (genes em cromossomos diferentes) x genes ligados (mesmo cromossomo, sem permuta) */
VIS.def['genes-ligados-x-independentes'] = {
  tit: 'Genes em cromossomos diferentes × genes no mesmo cromossomo',
  tipo: 'anim', dur: 11.4,
  marcas: [[0, '1º jeito de alinhar'], [2.6, '2º jeito'], [5, 'Resultado'], [9, 'Resposta']],
  fontes: ['OpenStax Biology 2e, 12.3 Laws of Inheritance — https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance', 'OpenStax Biology 2e, 13.1 Chromosomal Theory and Genetic Linkage — https://openstax.org/books/biology-2e/pages/13-1-chromosomal-theory-and-genetic-linkage'],
  cred: 'Animação feita para o app (metáfase I e anáfase I da meiose, esquema fora de escala, sem permutação).',
  nota: 'Número máximo de tipos de gameta = 2 elevado ao número de pares heterozigotos que se separam de forma independente. Genes ligados no mesmo par contam como um só; pares homozigotos (dd, FF) não criam tipos novos. Ex.: AaddFF forma só AdF e adF. A 1ª lei (cada gameta leva um alelo de cada gene) vale nos dois casos.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 446');
    var PQ = {"Pc072608": "A 1ª lei vale nas duas espécies; a 2ª só na espécie 2, com os genes em cromossomos diferentes. Alternativa E.", "P35eeb54": "3 pares de homólogos independentes: 2³ = 8 gametas; aBDe usa o bloco aB que existe. Alternativa B.", "Wcd0d823": "Com R e P em cromossomos diferentes, RrPp forma RP, Rp, rP e rp: alternativa A.", "W4854a77": "AaddFF: só o par Aa varia, então os gametas são AdF e adF. Alternativa D."};
    var VERM = '#c0504d', AZUL = '#3d6fb6', TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var PL = 135;   /* placa equatorial */
    /* cromossomo duplicado com rotulos de alelos: locos = [[dy, letra]] */
    function crom(h, cor, locos) {
      var g = el('g', {});
      el('rect', { x: -7, y: -h / 2, width: 6, height: h, rx: 3, style: 'fill:' + cor }, g);
      el('rect', { x: 1, y: -h / 2, width: 6, height: h, rx: 3, style: 'fill:' + cor }, g);
      el('circle', { cx: 0, cy: 0, r: 5, style: 'fill:' + cor + ';stroke:#4a3434;stroke-width:1' }, g);   /* centromero une as cromatides-irmas */
      var lt = locos.map(function (l) {
        el('line', { x1: -9, x2: 9, y1: l[0], y2: l[0], style: 'stroke:#fff;stroke-width:2' }, g);
        return tx(0, l[0] + 5, l[1], 'font-size:15px;font-weight:700;text-anchor:middle;' + TINTA, g);
      });
      return [g, lt];
    }
    function cel(cy, titulo) {
      tx(8, cy - 70, titulo, 'font-size:14.5px;font-weight:700;' + TINTA);
      el('ellipse', { cx: PL, cy: cy, rx: 118, ry: 56, style: 'fill:#fbeee6;stroke:#b98a7c;stroke-width:2' });
      el('line', { x1: PL, x2: PL, y1: cy - 50, y2: cy + 50, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' });
    }
    /* ---------- trilha 1: cromossomos diferentes ---------- */
    var Y1 = 94, Y2 = 262;
    cel(Y1, 'Genes em cromossomos diferentes (RrPp)');
    var R = crom(46, VERM, [[-12, 'R']]), r = crom(46, AZUL, [[-12, 'r']]), P = crom(28, VERM, [[-7, 'P']]), p = crom(28, AZUL, [[-7, 'p']]);
    /* ---------- trilha 2: mesmo cromossomo ---------- */
    cel(Y2, 'Genes no mesmo cromossomo (sem permuta)');
    var RP = crom(70, VERM, [[-16, 'R'], [16, 'P']]), rp = crom(70, AZUL, [[-16, 'r'], [16, 'p']]);
    el('line', { x1: 8, x2: 632, y1: 176, y2: 176, style: 'stroke:var(--linha);stroke-width:1' });
    /* rotulos de alelos ficam ao lado do cromossomo: desloca o texto */
    [R, r, P, p, RP, rp].forEach(function (c, i) { var lado = (i === 1 || i === 3 || i === 5) ? 1 : -1; c[1].forEach(function (e) { e.setAttribute('x', lado * 20); }); });

    /* ---------- gametas ---------- */
    function chips(y, lista) {
      return lista.map(function (s, i) {
        var g = el('g', {});
        el('rect', { x: 300 + i * 66, y: y, width: 56, height: 30, rx: 15, style: 'fill:color-mix(in srgb,var(--ad-c) 16%,transparent);stroke:var(--ad-c);stroke-width:1.2' }, g);
        tx(328 + i * 66, y + 21, s, 'font-size:16px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', g);
        return g;
      });
    }
    tx(310, 36, 'gametas formados', 'font-size:13px;' + LAP); tx(310, 204, 'gametas formados', 'font-size:13px;' + LAP);
    var c1 = chips(46, ['RP', 'rp', 'Rp', 'rP']), c2 = chips(214, ['RP', 'rp']);
    var c2b = tx(436, 235, '', 'font-size:13.5px;' + LAP);
    var conc1 = [tx(300, 104, '', 'font-size:14.5px;font-weight:700;' + TINTA), tx(300, 124, '', 'font-size:14px;' + TINTA), tx(300, 144, '', 'font-size:14px;' + TINTA)];
    var conc2 = [tx(300, 272, '', 'font-size:14.5px;font-weight:700;' + TINTA), tx(300, 292, '', 'font-size:14px;' + TINTA), tx(300, 312, '', 'font-size:14px;' + TINTA)];
    var etapa = tx(PL, 172, '', 'font-size:13px;text-anchor:middle;' + LAP);

    function pos(c, x, y) { c[0].setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
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
      var t = Math.min(t0, 8.999); FIMG.style.display = PQ[qid] && t0 >= 9 ? '' : 'none';
      /* duas rodadas: alinhamento 1 (0-2.6) e alinhamento 2 (2.6-5); depois fica no 2 separado */
      var rod2 = t >= 2.6, sep = rod2 ? seg(t, 3.4, 4.6) : seg(t, 1.0, 2.2), trocaS = seg(t, 2.6, 3.3), troca = trocaS < .5 ? 0 : 1, fade = rod2 && trocaS < 1 ? Math.abs(Math.cos(Math.PI * trocaS)) : 1;
      var xe = lerp(PL - 13, 66, sep), xd = lerp(PL + 13, 204, sep);
      pos(R, xe, Y1 - 17); pos(r, xd, Y1 - 17);
      /* par P: no 2º alinhamento, P vai para a direita */
      var pe = rod2 ? lerp(PL - 13, PL + 13, troca) : PL - 13, pd = rod2 ? lerp(PL + 13, PL - 13, troca) : PL + 13;
      if (rod2) { pe = lerp(pe, 204, sep); pd = lerp(pd, 66, sep); } else { pe = lerp(pe, 66, sep); pd = lerp(pd, 204, sep); }
      pos(P, pe, Y1 + 25); pos(p, pd, Y1 + 25); P[0].style.opacity = fade; p[0].style.opacity = fade;
      /* trilha 2: o par inteiro gira, mas R continua junto de P */
      var e2 = rod2 ? lerp(PL - 13, PL + 13, troca) : PL - 13, d2 = rod2 ? lerp(PL + 13, PL - 13, troca) : PL + 13;
      if (rod2) { e2 = lerp(e2, 204, sep); d2 = lerp(d2, 66, sep); } else { e2 = lerp(e2, 66, sep); d2 = lerp(d2, 204, sep); }
      pos(RP, e2, Y2); pos(rp, d2, Y2); RP[0].style.opacity = fade; rp[0].style.opacity = fade;
      /* rotulos dos alelos sempre do lado de fora */
      [[R, xe < xd], [r, xd > xe], [P, pe < pd], [p, pd > pe], [RP, e2 < d2], [rp, d2 > e2]].forEach(function (c, i) {
        var esq = i % 2 === 0 ? c[1] : !c[1]; if (sep > .5) esq = !esq;   /* separados: rotulo do lado de dentro da celula */ c[0][1].forEach(function (e) { e.setAttribute('x', esq ? -20 : 20); });
      });
      etapa.textContent = (t < 1 || (t >= 2.6 && t < 3.5)) ? 'metáfase I: os pares se alinham' : t < 5 ? 'anáfase I: os homólogos se separam' : '';
      /* chips */
      var a1 = seg(t, 2.1, 2.5), a2 = seg(t, 4.5, 4.9);
      c1[0].style.opacity = a1; c1[1].style.opacity = a1; c1[2].style.opacity = a2; c1[3].style.opacity = a2;
      c2[0].style.opacity = a1; c2[1].style.opacity = a1;
      c2b.textContent = t >= 4.5 ? '← de novo RP e rp' : ''; c2b.style.opacity = a2;
      var f = seg(t, 5, 5.4);
      var L1 = t >= 5 ? ['4 tipos, 1:1:1:1 (25% cada)', 'cada par se alinha sem depender', 'do outro: 2 × 2 = 2² = 4'] : ['', '', ''];
      var L2 = t >= 5 ? ['só 2 tipos (sem permuta)', 'R e P viajam juntos no mesmo', 'cromossomo: Rp e rP não surgem'] : ['', '', ''];
      conc1.forEach(function (e, i) { e.textContent = L1[i]; e.style.opacity = f; });
      conc2.forEach(function (e, i) { e.textContent = L2[i]; e.style.opacity = f; });
    };
  }
};
VIS.liga('genes-ligados-x-independentes', ['Pc072608', 'P35eeb54', 'Wcd0d823', 'W4854a77']);
