/* Por que a area total e' maxima, a velocidade minima nos capilares e a pressao so cai (continuidade Q = A x v; resistencia) */
VIS.def['hemodinamica-vasos'] = {
  tit: 'Por que o sangue anda mais devagar nos capilares e a pressão só cai',
  tipo: 'anim', dur: 12.5,
  marcas: [[0, 'Mesmo fluxo'], [2.5, 'Área'], [5, 'Velocidade'], [7.5, 'Pressão'], [10, 'Resposta']],
  cred: 'Animação feita para o app (esquema fora de escala; 8 capilares representam bilhões; curvas qualitativas).',
  fontes: [
    'OpenStax Biology 2e, 40.4 Blood Flow and Blood Pressure Regulation — https://openstax.org/books/biology-2e/pages/40-4-blood-flow-and-blood-pressure-regulation',
    'OpenStax Anatomy and Physiology 2e, 20.2 Blood Flow, Blood Pressure, and Resistance — https://openstax.org/books/anatomy-and-physiology-2e/pages/20-2-blood-flow-blood-pressure-and-resistance'
  ],
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var CAT = ['Aorta', 'Artérias', 'Arteríolas', 'Capilares', 'Vênulas', 'Veias', 'Cavas'];
    var N = [1, 2, 4, 8, 4, 2, 1], ESP = [24, 13, 7, 3, 6, 11, 20];
    var X0 = 166, X1 = 626, CW = (X1 - X0) / 7, YC = 86, H = 118;
    var CVERM = '#d2433b', CAZ = '#4f63a8', CVER = 'var(--ad-c)';
    function cx(i) { return X0 + CW * (i + .5); }
    function ty(c, j) { var n = N[c]; return YC + (n === 1 ? 0 : (j - (n - 1) / 2) * (H / n)); }
    /* destaque da coluna dos capilares */
    el('rect', { x: X0 + CW * 3, y: 18, width: CW, height: 290, rx: 6, style: 'fill:color-mix(in srgb,var(--ad-c) 9%,transparent)' });
    /* vasos: em cada coluna, N tubos; ligacoes entre colunas */
    var gV = el('g', {});
    for (var c = 0; c < 7; c++) {
      for (var j = 0; j < N[c]; j++) {
        var y = ty(c, j), x0 = X0 + CW * c + 8, x1 = X0 + CW * (c + 1) - 8;
        el('line', { x1: x0, x2: x1, y1: y, y2: y, style: 'stroke:#e3a59f;stroke-width:' + ESP[c] + ';stroke-linecap:round' }, gV);
        if (c < 6) {
          var n2 = N[c + 1];
          for (var k = 0; k < n2; k++) {
            var pai = n2 >= N[c] ? Math.floor(k * N[c] / n2) : k;
            if (n2 >= N[c] ? pai !== j : Math.floor(j * n2 / N[c]) !== k) continue;
            el('line', { x1: x1, y1: y, x2: x1 + 16, y2: ty(c + 1, k), style: 'stroke:#e3a59f;stroke-width:' + Math.min(ESP[c], ESP[c + 1]) + ';stroke-linecap:round' }, gV);
          }
        }
      }
      tx({ x: cx(c), y: 170, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:' + (c === 3 ? 700 : 500) + ';fill:var(--tinta)' }, CAT[c]);
    }
    /* grandezas relativas (qualitativas): area total e velocidade = 1/area */
    var AREA = [.03, .045, .07, 1, .15, .09, .055];
    function areaRel(x) { var u = (x - X0) / CW - .5, i = Math.max(0, Math.min(6, Math.floor(u))), f = Math.max(0, Math.min(1, u - i)), i2 = Math.min(6, i + 1); if (u < 0) return AREA[0]; var s = f * f * (3 - 2 * f); return AREA[i] + (AREA[i2] - AREA[i]) * s; }
    function vel(x) { return .03 / areaRel(x); }
    function pres(x) {
      var q = [[X0, .96], [X0 + CW * 2, .88], [X0 + CW * 3, .3], [X0 + CW * 4, .13], [X0 + CW * 5, .08], [X1, .02]];
      for (var k = 1; k < q.length; k++) if (x <= q[k][0]) return q[k - 1][1] + (q[k][1] - q[k - 1][1]) * (x - q[k - 1][0]) / (q[k][0] - q[k - 1][0]);
      return .02;
    }
    /* tempo de percurso (para as gotas andarem com v(x)) */
    var TAB = [], acc = 0;
    for (var x = X0; x <= X1; x++) { TAB.push(acc); acc += 1 / Math.max(.12, vel(x)); }
    var TT = acc;
    function xDe(tau) { var lo = 0, hi = TAB.length - 1; while (hi - lo > 1) { var m = (lo + hi) >> 1; if (TAB[m] < tau) lo = m; else hi = m; } return X0 + lo; }
    function yDe(x, lane) {
      var u = (x - X0) / CW, c = Math.max(0, Math.min(6, Math.floor(u))), f = u - c;
      var yA = ty(c, Math.floor(lane * N[c] / 8));
      var lim = 1 - 16 / CW;
      if (c < 6 && f > lim) { var yB = ty(c + 1, Math.floor(lane * N[c + 1] / 8)); return yA + (yB - yA) * (f - lim) / (1 - lim); }
      return yA;
    }
    var gotas = [];
    for (var i = 0; i < 24; i++) gotas.push(el('circle', { r: 3.4, style: 'fill:#b0302a' }));
    /* grafico */
    var GY0 = 186, GH = 112;
    el('path', { d: 'M' + X0 + ' ' + GY0 + ' V' + (GY0 + GH) + ' H' + X1, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' });
    function curva(f, cor) {
      var d = '';
      for (var x = X0 + 2; x <= X1; x += 2) d += (d ? 'L' : 'M') + x + ' ' + (GY0 + GH - 6 - (GH - 14) * f(x)).toFixed(1) + ' ';
      var p = el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:3;stroke-linecap:round;stroke-linejoin:round' });
      var L = p.getTotalLength ? 0 : 0;
      return p;
    }
    var cA = curva(function (x) { return areaRel(x); }, CVER), cV = curva(function (x) { return Math.min(1, vel(x)); }, CAZ), cP = curva(pres, CVERM);
    var mask = [];
    [cA, cV, cP].forEach(function (p, k) {
      var cp = el('clipPath', { id: 'hemo-clip-' + k }); var r = el('rect', { x: X0, y: GY0 - 10, height: GH + 20, width: 0 }, cp);
      p.setAttribute('clip-path', 'url(#hemo-clip-' + k + ')'); mask.push(r);
    });
    var leg = [tx({ x: 16, y: 214, style: 'font-size:14px;font-weight:700;fill:' + CVER }, 'Área total'), tx({ x: 16, y: 240, style: 'font-size:14px;font-weight:700;fill:' + CAZ }, 'Velocidade'), tx({ x: 16, y: 266, style: 'font-size:14px;font-weight:700;fill:' + CVERM }, 'Pressão')];
    var ponto = el('circle', { r: 6, style: 'stroke:var(--folha);stroke-width:2' });
    var cursor = el('line', { y1: 22, y2: 152, style: 'stroke:var(--tinta);stroke-width:1.5;stroke-dasharray:4 4' });
    var rotP = tx({ 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:' + CVERM });
    /* textos */
    var tit = tx({ x: 16, y: 34, style: 'font-size:17px;font-weight:700;fill:var(--tinta)' });
    var L = []; for (i = 0; i < 6; i++) L.push(tx({ x: 16, y: 58 + i * 18, style: 'font-size:13.5px;fill:var(--tinta)' }));
    var base = tx({ x: 16, y: 332, 'class': 'v-sub forte' });
    var TXT = [
      ['Mesmo fluxo', ['O coração manda', 'o mesmo volume', 'por segundo, e ele', 'passa inteiro por', 'cada nível.', ''], 'Ponto de partida: o volume que passa por segundo (fluxo) é o mesmo em todo nível.'],
      ['Área somada', ['A aorta se divide', 'em ramos mais', 'finos, porém muito', 'mais numerosos.', 'Capilares: bilhões', 'em paralelo.'], 'Somando as aberturas de todos os ramos, a área total é máxima nos capilares.'],
      ['Mais devagar', ['Velocidade =', 'fluxo ÷ área.', 'Área máxima nos', 'capilares: ali a', 'velocidade é', 'mínima.'], 'O sangue lento no capilar dá tempo para as trocas com os tecidos.'],
      ['Atrito', ['O sangue gasta', 'pressão vencendo', 'a resistência. A', 'maior queda é nas', 'arteríolas (vasos', 'de resistência).'], 'A pressão só cai: do ventrículo esquerdo até as veias cavas, perto de zero.'],
      ['Por isso', ['Área: montanha', 'nos capilares.', 'Velocidade: vale', 'nos capilares.', 'Pressão: só cai.', ''], 'Por isso a resposta é A: velocidade = gráfico 3, área = 1 e pressão = 2.']
    ];
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    return function (t) {
      var e = Math.min(4, Math.floor(t / 2.5)), tl = t - e * 2.5;
      tit.textContent = TXT[e][0];
      for (var k = 0; k < 6; k++) L[k].textContent = TXT[e][1][k];
      base.textContent = TXT[e][2];
      /* gotas: andam com a velocidade local (lentas nos capilares) */
      gotas.forEach(function (g, k) {
        var tau = ((t * TT / 5.5 + k * TT / 24) % TT), x = xDe(tau);
        g.setAttribute('cx', x); g.setAttribute('cy', yDe(x, k % 8).toFixed(1));
      });
      /* curvas: cada uma se desenha na sua etapa e fica depois */
      var rev = [e === 1 ? ease(tl / 2) : e > 1 ? 1 : 0, e === 2 ? ease(tl / 2) : e > 2 ? 1 : 0, e === 3 ? ease(tl / 2) : e > 3 ? 1 : 0];
      mask.forEach(function (r, k) { r.setAttribute('width', ((X1 - X0) * rev[k]).toFixed(1)); });
      [cA, cV, cP].forEach(function (p, k) { p.style.opacity = (k === e - 1 || e === 4) ? 1 : .3; });
      leg.forEach(function (l, k) { l.style.opacity = rev[k] > 0 ? 1 : 0; });
      /* marcador da etapa */
      var f = [null, function (x) { return areaRel(x); }, function (x) { return Math.min(1, vel(x)); }, pres][e];
      if (f && tl < 2.2) {
        var xm = X0 + (X1 - X0) * ease(tl / 2);
        ponto.style.display = cursor.style.display = '';
        ponto.setAttribute('cx', xm); ponto.setAttribute('cy', (GY0 + GH - 6 - (GH - 14) * f(xm)).toFixed(1));
        ponto.style.fill = [null, CVER, CAZ, CVERM][e];
        cursor.setAttribute('x1', xm); cursor.setAttribute('x2', xm);
      } else { ponto.style.display = cursor.style.display = 'none'; }
      if (e === 3 && tl < 2.2) { var xp = X0 + (X1 - X0) * ease(tl / 2); rotP.setAttribute('x', Math.max(X0 + 40, Math.min(X1 - 40, xp))); rotP.setAttribute('y', 16); rotP.textContent = 'pressão média ≈ ' + Math.round(100 * pres(xp)) + ' mmHg'; }
      else rotP.textContent = '';
    };
  }
};
VIS.liga('hemodinamica-vasos', ['P6afc021']);
