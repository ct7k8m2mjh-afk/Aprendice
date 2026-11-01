VIS.def['eutrofizacao-oxigenio-dbo'] = {
  tit: 'Esgoto no rio: a DBO dispara no despejo e o oxigênio some logo depois',
  fontes: ['OpenStax Biology 2e, 46.3 Biogeochemical Cycles (eutrofização e zonas mortas) — https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles', 'Demanda bioquímica de oxigênio (Wikipédia) — https://pt.wikipedia.org/wiki/Demanda_bioqu%C3%ADmica_de_oxig%C3%AAnio', 'Maré vermelha (Wikipédia) — https://pt.wikipedia.org/wiki/Mar%C3%A9_vermelha'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (esquema fora de escala; curvas ilustrativas de oxigênio dissolvido e DBO ao longo do rio).',
  marcas: [[0, 'Rio limpo'], [2, 'Despejo'], [3.6, 'Decomposição'], [6.2, 'Recuperação'], [8.6, 'Maré vermelha']],
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var COD = '#1f6fb2', CDBO = '#8a5a2b';
    function peixe(pai) {
      var g = el('g', {}, pai);
      el('path', { d: 'M-17 0 Q-3 -11 14 0 Q-3 11 -17 0 Z M-16 0 L-26 -8 L-26 8 Z', style: 'fill:currentColor' }, g);
      el('circle', { cx: 8, cy: -2, r: 2, style: 'fill:#fff' }, g);
      return g;
    }
    /* ===== cena A: rio + grafico ===== */
    var A = el('g', {});
    var XO = 170, X0 = 20, X1 = 620, RY0 = 64, RY1 = 118;
    el('path', { d: 'M' + X0 + ' ' + (RY0 - 10) + ' H' + X1 + ' V' + (RY0) + ' H' + X0 + 'Z', style: 'fill:#b9a27d' }, A);
    var agua = el('rect', { x: X0, y: RY0, width: X1 - X0, height: RY1 - RY0, style: 'fill:#9cc9e8' }, A);
    var turva = el('path', { style: 'fill:#8f8a4e;opacity:0' }, A);
    el('path', { d: 'M' + X0 + ' ' + RY1 + ' H' + X1 + ' V' + (RY1 + 8) + ' H' + X0 + 'Z', style: 'fill:#b9a27d' }, A);
    tx({ x: X1 - 6, y: RY1 - 8, 'text-anchor': 'end', style: 'font-size:13px;font-weight:600;fill:#1d4f78' }, 'o rio corre →', A);
    /* cano */
    el('rect', { x: XO - 7, y: 22, width: 14, height: 34, style: 'fill:#7b7b7b;stroke:#555;stroke-width:1' }, A);
    tx({ x: XO + 14, y: 22, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'esgoto: matéria orgânica', A);
    tx({ x: XO + 14, y: 39, style: 'font-size:13px;' + LAP }, 'e nutrientes (N e P)', A);
    var jato = el('path', { d: 'M' + XO + ' 56 Q' + (XO + 4) + ' 70 ' + (XO + 14) + ' 80', style: 'fill:none;stroke:#6e5a33;stroke-width:6;stroke-linecap:round' }, A);
    /* algas e peixes */
    var algas = [], s = 3;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var i = 0; i < 46; i++) { var ax = XO + 30 + rnd() * 300; algas.push({ e: el('circle', { cx: ax.toFixed(1), cy: (RY0 + 3 + rnd() * 7).toFixed(1), r: 2.5 + rnd() * 2, style: 'fill:#3f8f3a' }, A), x: ax }); }
    var PX = [56, 120, 236, 312, 392, 478, 548], peixes = PX.map(function (x, i) { var g = peixe(A); g.style.color = '#4f6f87'; return { g: g, x: x, y: 82 + (i % 3) * 13 }; });
    /* grafico */
    var GY0 = 300, GY1 = 160;
    function GY(v) { return GY0 - (GY0 - GY1) * v / 14; }
    el('line', { x1: X0, x2: X0, y1: GY1 - 4, y2: GY0, style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    el('line', { x1: X0, x2: X1, y1: GY0, y2: GY0, style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    tx({ x: X1, y: GY0 + 17, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'distância ao longo do rio →', A);
    tx({ x: X0 + 6, y: GY1 + 2, style: 'font-size:13px;' + LAP }, 'mg/L', A);
    el('line', { x1: X0, x2: X1, y1: GY(5), y2: GY(5), style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:5 4' }, A);
    tx({ x: X0 + 6, y: GY(5) - 5, style: 'font-size:13px;' + LAP }, '5 mg/L', A);
    el('line', { x1: XO, x2: XO, y1: RY1 + 8, y2: GY0, style: 'stroke:#6e5a33;stroke-width:1.2;stroke-dasharray:3 4;opacity:.7' }, A);
    var zona = el('rect', { y: GY1 - 4, height: GY0 - GY1 + 4, style: 'fill:var(--ad-c);opacity:0' }, A);
    var cOD = el('path', { style: 'fill:none;stroke:' + COD + ';stroke-width:3.2;stroke-linejoin:round' }, A);
    var cDBO = el('path', { style: 'fill:none;stroke:' + CDBO + ';stroke-width:3.2;stroke-linejoin:round;stroke-dasharray:9 5' }, A);
    var lOD = tx({ style: 'font-size:13.5px;font-weight:700;fill:' + COD }, 'OD', A);
    var lDBO = tx({ style: 'font-size:13.5px;font-weight:700;fill:' + CDBO }, 'DBO', A);
    var lAl = tx({ x: XO + 40, y: 142, style: 'font-size:13.5px;font-weight:700;fill:#2f7a2b' }, 'algas proliferam com os nutrientes', A);
    var ann = tx({ style: 'font-size:13.5px;font-weight:700;' + TXT }, '', A);
    var f1 = tx({ x: X0, y: 326, style: 'font-size:15px;font-weight:700;' + TXT }, '', A), f2 = tx({ x: X0, y: 345, style: 'font-size:14.5px;' + TXT }, '', A);
    function DBO(x, u) { return 2 + (x < XO ? 0 : u * 10.5 * Math.exp(-(x - XO) / 95)); }
    function OD(x, u) { var d = x < XO ? 0 : (x - XO) / 120; return 8.2 - u * 7.2 * d * Math.exp(1 - d); }

    /* ===== cena B: mare vermelha ===== */
    var B = el('g', {});
    tx({ x: 20, y: 30, style: 'font-size:20px;font-weight:700;' + TXT }, 'No mar: maré vermelha', B);
    el('rect', { x: 20, y: 52, width: 290, height: 200, rx: 12, style: 'fill:#9cc9e8' }, B);
    var mancha = el('rect', { x: 20, y: 52, width: 290, height: 200, rx: 12, style: 'fill:#b0413e;opacity:0' }, B);
    var dino = [];
    for (i = 0; i < 60; i++) { var dx = 34 + rnd() * 262, dy = 66 + rnd() * 172; var g = el('g', { transform: 'translate(' + dx.toFixed(1) + ' ' + dy.toFixed(1) + ')' }, B); el('ellipse', { rx: 4.5, ry: 3.6, style: 'fill:#8f1d22' }, g); el('line', { x1: -4.5, x2: 4.5, y1: 0, y2: 0, style: 'stroke:#f6d2c9;stroke-width:1' }, g); dino.push(g); }
    var pm = [[90, 120], [210, 170], [150, 214]].map(function (p) { var g = peixe(B); g.style.color = '#4f6f87'; return { g: g, x: p[0], y: p[1] }; });
    var BL = [];
    for (i = 0; i < 9; i++) BL.push(tx({ x: 330, y: 70 + i * 21, style: 'font-size:14.5px;' + TXT }, '', B));
    var BT = [['excesso de nutrientes (esgoto,', 0], ['adubo) faz proliferar algas', 0], ['microscópicas, os dinoflagelados', 0], ['', 0], ['algumas espécies liberam toxinas', 0], ['que matam peixes e intoxicam', 0], ['pessoas; as algas não ganham nada', 0], ['', 0], ['prejudica sem se beneficiar: amensalismo', 1]];

    return function (t) {
      var aA = t < 8.4 ? 1 : t < 8.65 ? 1 - (t - 8.4) / .25 : 0;
      var aB = t < 8.6 ? 0 : t < 8.9 ? (t - 8.6) / .3 : t > 11.8 ? 1 - (t - 11.8) / .2 : 1;
      A.style.opacity = aA.toFixed(2); B.style.opacity = aB.toFixed(2);
      A.style.display = aA <= 0 ? 'none' : ''; B.style.display = aB <= 0 ? 'none' : '';
      if (aA > 0) {
        var u = ease((t - 2) / 1.4), k, n = 120, dO = '', dD = '';
        for (k = 0; k <= n; k++) { var x = X0 + 2 + (X1 - X0 - 4) * k / n; dO += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + GY(OD(x, u)).toFixed(1) + ' '; dD += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + GY(DBO(x, u)).toFixed(1) + ' '; }
        cOD.setAttribute('d', dO); cDBO.setAttribute('d', dD);
        lOD.setAttribute('x', 40); lOD.setAttribute('y', GY(8.2) - 8);
        lDBO.setAttribute('x', XO + 10); lDBO.setAttribute('y', GY(DBO(XO + 10, u)) - 8 + (u < .2 ? 0 : 0));
        if (u < .2) { lDBO.setAttribute('x', 40); lDBO.setAttribute('y', GY(2) - 8); }
        jato.style.opacity = u > 0 ? 1 : 0;
        turva.setAttribute('d', 'M' + XO + ' ' + RY0 + ' L' + X1 + ' ' + RY0 + ' L' + X1 + ' ' + RY1 + ' L' + XO + ' ' + RY1 + 'Z');
        turva.style.opacity = (.0 + .25 * u).toFixed(2);
        var bloom = ease((t - 3.4) / 1.4) * (1 - .6 * ease((t - 6.6) / 1.2));
        lAl.style.opacity = bloom > .4 && t < 6.6 ? 1 : 0;
        algas.forEach(function (a, i) { a.e.style.opacity = (i / algas.length < bloom ? 1 : 0); });
        peixes.forEach(function (p) {
          var od = OD(p.x, u), morto = od < 3 && t > 3.8, y = morto ? RY0 + 4 : p.y, xx = p.x + (morto ? 0 : 6 * Math.sin(t * 2 + p.x));
          p.g.setAttribute('transform', 'translate(' + xx.toFixed(1) + ' ' + y + ')' + (morto ? ' rotate(180)' : ''));
          p.g.style.color = morto ? '#9a9a9a' : '#4f6f87';
        });
        var Z = null, F;
        if (t < 2) F = ['Rio limpo: muito oxigênio dissolvido (OD), pouca DBO', 'DBO = O₂ que os microrganismos gastam decompondo matéria orgânica'];
        else if (t < 3.6) { F = ['Despejo de esgoto', 'chega muita matéria orgânica: a DBO dispara bem no ponto de despejo']; Z = [XO - 20, XO + 40]; }
        else if (t < 6.2) { F = ['Decomposição ativa, a jusante', 'bactérias aeróbias decompõem tudo (e as algas que morrem) e gastam o O₂: peixes morrem']; Z = [XO + 50, XO + 210]; }
        else { F = ['Recuperação, mais adiante', 'a matéria orgânica acaba (DBO baixa) e o O₂ volta, vindo do ar e da fotossíntese']; Z = [XO + 260, X1]; }
        f1.textContent = F[0]; f2.textContent = F[1];
        if (Z) { zona.setAttribute('x', Z[0]); zona.setAttribute('width', Z[1] - Z[0]); zona.style.opacity = .1; } else zona.style.opacity = 0;
        if (t >= 2.6 && t < 3.6) { ann.textContent = 'DBO máxima: despejo'; ann.setAttribute('x', XO + 40); ann.setAttribute('y', GY(12) + 4); }
        else if (t >= 3.6 && t < 6.2) { ann.textContent = 'OD mínimo'; ann.setAttribute('x', XO + 130); ann.setAttribute('y', GY(1) - 10); }
        else ann.textContent = '';
        if (f2.getComputedTextLength && f2.getComputedTextLength() > 600) f2.style.fontSize = '13.5px'; else f2.style.fontSize = '14.5px';
      }
      if (aB > 0) {
        var v = ease((t - 8.8) / 1.4);
        mancha.style.opacity = (.45 * v).toFixed(2);
        dino.forEach(function (d, i) { d.style.opacity = i / dino.length < .15 + .85 * v ? 1 : 0; });
        pm.forEach(function (p) { var morto = v > .7; p.g.setAttribute('transform', 'translate(' + p.x + ' ' + (morto ? 66 : p.y) + ')' + (morto ? ' rotate(180)' : '')); p.g.style.color = morto ? '#9a9a9a' : '#4f6f87'; });
        BL.forEach(function (l, i) { l.textContent = BT[i][0]; l.style.fontWeight = BT[i][1] ? '700' : '400'; l.style.opacity = t > 9 + i * .12 ? 1 : 0; });
      }
    };
  }
};
VIS.liga('eutrofizacao-oxigenio-dbo', ['W3b2a03f', 'W845df46', 'P715b848']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['eutrofizacao-oxigenio-dbo'], m0 = V.monta, D0 = V.dur, R = {"W3b2a03f": ["A — grande mortandade de peixes", "A decomposição aeróbia de tanta matéria orgânica consome", "o oxigênio dissolvido, e os peixes morrem."], "W845df46": ["A — ponto 1", "A DBO é máxima no despejo, onde há mais matéria orgânica;", "o OD mínimo só aparece mais adiante (ponto 3)."], "P715b848": ["C — algas, excesso de nutrientes, amensalismo", "Dinoflagelados proliferam com nutrientes e liberam toxinas", "que prejudicam outros seres sem benefício para eles."]};
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
