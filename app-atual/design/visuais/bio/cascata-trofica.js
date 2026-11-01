VIS.def['cascata-trofica'] = {
  tit: 'Efeito em cascata: mexer num nível da cadeia mexe em todos os de baixo',
  fontes: ['OpenStax Biology 2e, 46.1 Ecology of Ecosystems — https://openstax.org/books/biology-2e/pages/46-1-ecology-of-ecosystems', 'Trophic cascade (Wikipedia; lontra, ouriço e kelp) — https://en.wikipedia.org/wiki/Trophic_cascade'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (populações esquemáticas). Setas no sentido da energia: de quem é comido para quem come.',
  marcas: [[0, 'Lontra, ouriço e alga'], [6.8, 'Gavião até a planta'], [10.2, 'Onívoro']],
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var SOBE = '#1f7a3a', DESCE = '#b4442f';
    var CO = '#8a5a2b', CU = '#7a4fc0', CA = '#2e8b57';
    function seta(pai, x1, y1, x2, y2, cor) {
      var a = Math.atan2(y2 - y1, x2 - x1), h = 9;
      return el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - h * Math.cos(a - .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a - .45)).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - h * Math.cos(a + .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a + .45)).toFixed(1), style: 'fill:none;stroke:' + (cor || 'var(--lapis)') + ';stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round' }, pai);
    }
    function no(pai, x, y, w, nome, sub, cor) {
      var g = el('g', {}, pai);
      el('rect', { x: x, y: y, width: w, height: 46, rx: 10, style: 'fill:var(--folha);stroke:' + cor + ';stroke-width:2' }, g);
      tx({ x: x + 10, y: y + 20, style: 'font-size:14.5px;font-weight:700;fill:' + cor }, nome, g);
      var s = tx({ x: x + 10, y: y + 38, style: 'font-size:13px;' + LAP }, sub, g);
      return g;
    }
    function marca(pai) { return tx({ style: 'font-size:14px;font-weight:700' }, '', pai); }
    function poe(m, x, y, sinal) { m.setAttribute('x', x); m.setAttribute('y', y); m.textContent = sinal > 0 ? '▲ aumenta' : sinal < 0 ? '▼ diminui' : ''; m.style.fill = sinal > 0 ? SOBE : DESCE; }

    /* ========== cena A: lontra, ouriço, alga ========== */
    var A = el('g', {});
    var NXa = 18, NW = 210;
    no(A, NXa, 26, NW, 'Lontra-marinha', 'carnívora (topo)', CO);
    no(A, NXa, 130, NW, 'Ouriço-do-mar', 'onívoro: inclui algas na dieta', CU);
    no(A, NXa, 234, NW, 'Algas (kelp)', 'produtor', CA);
    seta(A, NXa + 60, 232, NXa + 60, 180); seta(A, NXa + 60, 128, NXa + 60, 76);
    var mL = marca(A), mO = marca(A), mA = marca(A);
    /* grafico */
    var GX0 = 290, GX1 = 624, GY0 = 260, GY1 = 40, TG = 6.6;
    el('line', { x1: GX0, x2: GX0, y1: GY1 - 4, y2: GY0, style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    el('line', { x1: GX0, x2: GX1, y1: GY0, y2: GY0, style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    tx({ x: GX0 + 6, y: GY1 - 10, style: 'font-size:13px;font-weight:600;' + LAP }, 'nº de indivíduos', A);
    tx({ x: GX1, y: GY0 + 18, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'tempo', A);
    function Lo(t) { return lerp(.28, .03, ease((t - 1.2) / 1.2)); }
    function Ou(t) { return t < 2.2 ? .46 : t < 4.5 ? lerp(.46, .97, ease((t - 2.2) / 2.3)) : lerp(.97, 0, ease((t - 4.5) / 1.8)); }
    function Al(t) { return lerp(.74, 0, ease((t - 3.2) / 2.1)); }
    function GX(t) { return GX0 + 4 + (GX1 - GX0 - 8) * t / TG; }
    function GY(v) { return GY0 - 2 - (GY0 - GY1 - 10) * v; }
    function linha(cor) { return el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:3;stroke-linejoin:round' }, A); }
    var cLo = linha(CO), cAl = linha(CA), cOu = linha(CU);
    var rLo = tx({ x: GX(.1), y: GY(.28) - 8, style: 'font-size:13.5px;font-weight:700;fill:' + CO }, '1  lontra', A);
    var rAl = tx({ x: GX(.1), y: GY(.74) - 8, style: 'font-size:13.5px;font-weight:700;fill:' + CA }, '2  alga', A);
    var rOu = tx({ x: GX(.1), y: GY(.46) - 8, style: 'font-size:13.5px;font-weight:700;fill:' + CU }, '3  ouriço', A);
    var fA = tx({ x: 18, y: 314, style: 'font-size:15px;font-weight:700;' + TXT }, '', A);
    var fA2 = tx({ x: 18, y: 334, style: 'font-size:14.5px;' + TXT }, '', A);

    /* ========== cena B: cadeia terrestre + onivoro ========== */
    var B = el('g', {});
    tx({ x: 18, y: 22, style: 'font-size:15px;font-weight:700;' + TXT }, 'O mesmo efeito numa mata: os gaviões aumentam', B);
    var BW = 132, BY = 40, BX = [18, 176, 334, 492];
    var nomes = [['Plantas', 'produtor', CA], ['Gafanhotos', 'consumidor 1º', '#8a7a12'], ['Passarinhos', 'consumidor 2º', CU], ['Gaviões', 'consumidor 3º', CO]];
    nomes.forEach(function (n, i) { no(B, BX[i], BY, BW, n[0], n[1], n[2]); if (i) seta(B, BX[i - 1] + BW + 2, BY + 23, BX[i] - 3, BY + 23); });
    var mB = [marca(B), marca(B), marca(B), marca(B)];
    var fB = tx({ x: 18, y: 134, style: 'font-size:14.5px;' + TXT }, '', B);
    /* onivoro */
    var O = el('g', {}, B);
    el('line', { x1: 18, x2: 622, y1: 150, y2: 150, style: 'stroke:var(--linha);stroke-width:1.5' }, O);
    tx({ x: 18, y: 174, style: 'font-size:15px;font-weight:700;' + TXT }, 'Um mesmo animal pode ocupar mais de um nível', O);
    var SX = 452, SY = 262;
    no(O, SX, SY - 23, 150, 'Sabiá', 'nível depende da presa', CO);
    no(O, 18, 186, 150, 'Frutos e sementes', 'produtor', CA);
    no(O, 18, 244, 150, 'Grilo', 'consumidor 1º', '#8a7a12');
    no(O, 18, 302, 150, 'Louva-a-deus', 'consumidor 2º', CU);
    var ligs = [[168, 209, 'sabiá: consumidor 1º'], [168, 267, 'sabiá: consumidor 2º'], [168, 325, 'sabiá: consumidor 3º']];
    var lg = ligs.map(function (l, i) {
      var g = el('g', {}, O);
      seta(g, l[0] + 4, l[1], SX - 4, SY - 2 + (i - 1) * 12, 'var(--ad-t)');
      tx({ x: 186, y: i === 2 ? l[1] + 17 : l[1] - 9, 'text-anchor': 'start', style: 'font-size:13.5px;font-weight:700;fill:var(--ad-t)' }, l[2], g);
      return g;
    });

    return function (t) {
      var aA = t < 6.6 ? 1 : t < 6.85 ? 1 - (t - 6.6) / .25 : 0;
      var aB = t < 6.8 ? 0 : t < 7.1 ? (t - 6.8) / .3 : t > 11.8 ? 1 - (t - 11.8) / .2 : 1;
      A.style.opacity = aA.toFixed(2); B.style.opacity = aB.toFixed(2);
      A.style.display = aA <= 0 ? 'none' : ''; B.style.display = aB <= 0 ? 'none' : '';
      if (aA > 0) {
        var ta = Math.min(t, TG), k, n = 80;
        [[cLo, Lo], [cAl, Al], [cOu, Ou]].forEach(function (p) {
          var d = ''; for (k = 0; k <= n; k++) { var s = ta * k / n; d += (k ? 'L' : 'M') + GX(s).toFixed(1) + ' ' + GY(p[1](s)).toFixed(1) + ' '; } p[0].setAttribute('d', d);
        });
        
        var sL = ta > 1.2 && ta < 2.6 ? -1 : 0, sO = ta > 2.4 && ta < 4.6 ? 1 : ta > 4.8 ? -1 : 0, sA = ta > 3.3 && ta < 5.6 ? -1 : 0;
        poe(mL, NXa + NW + 10, 54, sL); poe(mO, NXa + NW + 10, 158, sO); poe(mA, NXa + NW + 10, 262, sA);
        mL.setAttribute('x', NXa + 130); mL.setAttribute('y', 20); mO.setAttribute('x', NXa + 130); mO.setAttribute('y', 124); mA.setAttribute('x', NXa + 130); mA.setAttribute('y', 228);
        var F;
        if (ta < 1.2) F = ['Equilíbrio', 'lontras comem ouriços; ouriços comem algas'];
        else if (ta < 2.5) F = ['A população de lontras cai (a menor, a curva 1)', 'ex.: caça; os ouriços deixam de ser comidos'];
        else if (ta < 3.6) F = ['Sem predador, os ouriços se multiplicam (curva 3)', 'mais ouriços comendo, menos algas'];
        else if (ta < 5) F = ['As algas são devoradas (curva 2)', 'o efeito desceu dois níveis a partir da lontra'];
        else F = ['Sem alga, falta comida: os ouriços também caem', 'e zeram pouco depois das algas'];
        fA.textContent = F[0]; fA2.textContent = F[1];
      }
      if (aB > 0) {
        var u = t - 6.8;
        var on = [u > 2.6, u > 1.9, u > 1.2, u > .5], sinais = [-1, 1, -1, 1];
        mB.forEach(function (m, i) { poe(m, BX[i] + 10, BY + 66, on[i] ? sinais[i] : 0); });
        fB.textContent = u < .5 ? '' : u < 1.2 ? 'Mais gaviões caçando...' : u < 1.9 ? '...menos passarinhos sobrevivem...' : u < 2.6 ? '...os gafanhotos, menos comidos, aumentam...' : '...e comem mais: as plantas diminuem.';
        O.style.opacity = u > 3.4 ? cl((u - 3.4) / .3) : 0;
        lg.forEach(function (g, i) { g.style.opacity = u > 3.8 + i * .4 ? 1 : 0; });
      }
    };
  }
};
VIS.liga('cascata-trofica', ['P709aafb', 'Pde6ab4d', 'W62a7167', 'Pfd02be0']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['cascata-trofica'], m0 = V.monta, D0 = V.dur, R = {"Pfd02be0": ["B", "Um animal ocupa dois níveis quando come presas de níveis", "diferentes; na teia da questão, cinco espécies fazem isso."], "P709aafb": ["C — lontras, algas e ouriços", "1 é a lontra (a menor, cai primeiro); 3 é o ouriço, que sobe;", "2 é a alga, devorada pelos ouriços."], "Pde6ab4d": ["B", "Mais gaviões → menos passarinhos → mais gafanhotos", "→ menos plantas."], "W62a7167": ["D — secundário, terciário e primário", "Comendo grilo (1º) é 2º; comendo louva-a-deus (2º) é 3º;", "comendo frutos e sementes (produtor) é 1º."]};
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
