/* Hematose: difusao de O2 e CO2 entre alveolo e capilar, a favor das pressoes parciais; enfisema */
VIS.def['hematose-alveolo'] = {
  tit: 'Hematose: O₂ e CO₂ atravessam a parede do alvéolo por difusão simples',
  tipo: 'anim', dur: 14.5,
  marcas: [[0, 'Trocas no capilar'], [8.5, 'Enfisema'], [12, 'Resposta']],
  fontes: [
    'OpenStax Anatomy and Physiology 2e, 22.4 Gas Exchange — https://openstax.org/books/anatomy-and-physiology-2e/pages/22-4-gas-exchange',
    'Enfisema pulmonar — Wikipédia — https://pt.wikipedia.org/wiki/Enfisema_pulmonar'
  ],
  cred: 'Animação feita para o app (esquema fora de escala; pressões parciais aproximadas, em repouso).',
  nota: 'Cada gás vai de onde sua pressão parcial é maior para onde é menor. Sem ATP, sem transportador e sem canal: O₂ e CO₂ são pequenos e apolares e atravessam a membrana direto.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var CO = '#d2433b', CC = '#6b7c8f';
    /* ===== fase 1: alveolo e capilar ===== */
    var g1 = el('g', {});
    var XC0 = 16, XC1 = 330, YC0 = 214, YC1 = 250;     /* luz do capilar */
    el('path', { d: 'M40 206 V120 Q40 34 173 34 Q306 34 306 120 V206 Z', style: 'fill:color-mix(in srgb,#9cc6e8 22%,transparent);stroke:#c98a8f;stroke-width:3' }, g1);
    tx({ x: 173, y: 74, 'text-anchor': 'middle', 'class': 'v-rot' }, 'Alvéolo (ar)', g1);
    tx({ x: 173, y: 96, 'text-anchor': 'middle', style: 'font-size:14px;fill:var(--tinta)' }, 'PO₂ ≈ 100 mmHg', g1);
    tx({ x: 173, y: 115, 'text-anchor': 'middle', style: 'font-size:14px;fill:var(--tinta)' }, 'PCO₂ ≈ 40 mmHg', g1);
    el('rect', { x: XC0, y: YC0 - 6, width: XC1 - XC0, height: YC1 - YC0 + 12, rx: 4, style: 'fill:#c98a8f' }, g1);
    el('rect', { x: XC0, y: YC0, width: XC1 - XC0, height: YC1 - YC0, style: 'fill:#f3d9d6' }, g1);
    tx({ x: 316, y: 140, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--lapis)' }, '', g1);
    tx({ x: XC0, y: 274, style: 'font-size:13px;font-weight:700;fill:#5e6fa8' }, 'chega: sangue venoso', g1);
    tx({ x: XC0, y: 292, style: 'font-size:13px;fill:var(--tinta)' }, 'PO₂ 40 · PCO₂ 45', g1);
    tx({ x: XC1, y: 274, 'text-anchor': 'end', style: 'font-size:13px;font-weight:700;fill:' + CO }, 'sai: sangue arterial', g1);
    tx({ x: XC1, y: 292, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--tinta)' }, 'PO₂ ≈ 100 · PCO₂ 40', g1);
    el('path', { d: 'M150 232 H196 m-8 -6 l8 6 l-8 6', style: 'fill:none;stroke:#9a5a60;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.0' }, g1);
    var legenda = el('g', {}, g1);
    tx({ x: 173, y: 320, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'parede do alvéolo + parede do capilar: barreira finíssima', legenda);
    el('path', { d: 'M173 302 V262', style: 'stroke:var(--lapis);stroke-width:1;stroke-dasharray:3 3' }, legenda);
    var rA = tx({ 'class': 'v-sub forte', style: 'fill:var(--ad-t)' }), rB = tx({ 'class': 'v-sub forte', style: 'fill:var(--ad-t)' });
    /* hemacias */
    var hem = [];
    for (var i = 0; i < 6; i++) hem.push(el('ellipse', { rx: 15, ry: 9, cy: (YC0 + YC1) / 2, style: 'stroke:rgba(0,0,0,.25);stroke-width:1' }, g1));
    /* gases */
    var o2 = [], co2 = [];
    for (i = 0; i < 7; i++) { var g = el('g', {}, g1); el('circle', { r: 6, style: 'fill:' + CO }, g); o2.push(g); }
    for (i = 0; i < 6; i++) { g = el('g', {}, g1); el('circle', { r: 6, style: 'fill:' + CC }, g); co2.push(g); }
    /* setas grandes com o nome do gas */
    el('path', { d: 'M62 150 V196 m-8 -10 l8 10 l8 -10', style: 'fill:none;stroke:' + CO + ';stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round' }, g1);
    tx({ x: 52, y: 140, style: 'font-size:15px;font-weight:700;fill:' + CO }, 'O₂', g1);
    el('path', { d: 'M284 196 V150 m-8 10 l8 -10 l8 10', style: 'fill:none;stroke:' + CC + ';stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round' }, g1);
    tx({ x: 272, y: 172, 'text-anchor': 'end', style: 'font-size:15px;font-weight:700;fill:' + CC }, 'CO₂', g1);
    /* ===== graficos (direita) ===== */
    var gG = el('g', {});
    var GX0 = 392, GX1 = 620, faixas = [[54, 'O₂ no sangue', 40, 100, CO], [146, 'CO₂ no sangue', 45, 40, CC], [238, 'N₂ no sangue', 1, 1, 'var(--lapis)']];
    var cursores = [];
    var pts = [];
    faixas.forEach(function (f, k) {
      var y0 = f[0], h = 58;
      cursores.push(el('line', { y1: y0, y2: y0 + h, style: 'stroke:var(--tinta);stroke-width:1.5;stroke-dasharray:4 4' }, gG));
      el('path', { d: 'M' + GX0 + ' ' + (y0 - 2) + ' V' + (y0 + h) + ' H' + GX1, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, gG);
      tx({ x: GX0 + 8, y: y0 - 10, style: 'font-size:14px;font-weight:700;fill:' + f[4] }, f[1], gG);
      var d = '';
      for (var j = 0; j <= 40; j++) { var u = j / 40, v = valor(f, u); d += (j ? 'L' : 'M') + (GX0 + (GX1 - GX0) * u).toFixed(1) + ' ' + yv(f, v).toFixed(1) + ' '; }
      el('path', { d: d, style: 'fill:none;stroke:' + f[4] + ';stroke-width:3;stroke-linecap:round' }, gG);
      if (k < 2) {
        tx({ x: GX0 - 6, y: yv(f, f[2]) + 5, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--tinta)' }, f[2], gG);
        tx({ x: GX0 - 6, y: yv(f, f[3]) + 5, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--tinta)' }, f[3], gG);
      } else tx({ x: GX1, y: y0 - 10, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--lapis)' }, 'não muda', gG);
      pts.push(el('circle', { r: 5, style: 'fill:' + f[4] + ';stroke:var(--folha);stroke-width:2' }, gG));
    });
    tx({ x: GX0, y: 316, style: 'font-size:13px;fill:var(--lapis)' }, 'início do capilar', gG);
    tx({ x: GX1, y: 316, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--lapis)' }, 'fim do capilar', gG);
    tx({ x: GX0 - 36, y: 42, style: 'font-size:13px;fill:var(--lapis)' }, 'mmHg', gG);
    function valor(f, u) { if (f[2] === f[3]) return 1; var e = 1 - Math.exp(-u / .1); return f[2] + (f[3] - f[2]) * e; }
    function yv(f, v) { var y0 = f[0], h = 58; if (f[2] === f[3]) return y0 + h * .55; var lo = Math.min(f[2], f[3]), hi = Math.max(f[2], f[3]); return y0 + h - 8 - (h - 22) * (v - lo) / (hi - lo); }
    /* ===== fase 2: enfisema ===== */
    var g2 = el('g', {});
    function cacho(cx, cy, raios, cor) {
      raios.forEach(function (c) { el('circle', { cx: cx + c[0], cy: cy + c[1], r: c[2], style: 'fill:color-mix(in srgb,#9cc6e8 22%,transparent);stroke:' + cor + ';stroke-width:2.5' }, g2); });
    }
    el('path', { d: 'M96 40 V70 M272 40 V68', style: 'stroke:#c98a8f;stroke-width:10;stroke-linecap:round' }, g2);
    cacho(96, 130, [[0, -42, 18], [-30, -26, 18], [30, -26, 18], [-38, 6, 18], [0, -8, 18], [38, 6, 18], [-20, 36, 18], [20, 36, 18], [0, 66, 18], [-38, 62, 16], [38, 62, 16]], '#c98a8f');
    cacho(262, 130, [[-20, 12, 40], [44, 34, 26], [10, -42, 20]], '#c98a8f');
    tx({ x: 96, y: 238, 'text-anchor': 'middle', 'class': 'v-rot' }, 'Pulmão normal', g2);
    tx({ x: 96, y: 258, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'muitos alvéolos pequenos', g2);
    tx({ x: 262, y: 238, 'text-anchor': 'middle', 'class': 'v-rot' }, 'Enfisema', g2);
    tx({ x: 262, y: 258, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'paredes destruídas:', g2);
    tx({ x: 262, y: 276, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'poucos sacos grandes', g2);
    var px = 372;
    tx({ x: px, y: 64, 'class': 'v-fase' }, 'Enfisema', g2);
    ['As paredes alveolares são o', 'lugar da hematose. Destruídas,', 'sobra bem menos superfície', 'de contato com os capilares.', '', 'Passa menos O₂ para o sangue', 'a cada respiração: falta de ar', 'que piora com a doença.'].forEach(function (s, k) {
      tx({ x: px, y: 96 + k * 21, 'class': 'v-sub' + (k > 4 ? ' forte' : '') }, s, g2);
    });
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    function mix(c1, c2, u) {
      var a = [parseInt(c1.slice(1, 3), 16), parseInt(c1.slice(3, 5), 16), parseInt(c1.slice(5, 7), 16)], b = [parseInt(c2.slice(1, 3), 16), parseInt(c2.slice(3, 5), 16), parseInt(c2.slice(5, 7), 16)];
      return 'rgb(' + a.map(function (v, k) { return Math.round(v + (b[k] - v) * u); }).join(',') + ')';
    }
    var desenha0 = function (t) {
      legenda.style.display = ''; rA.textContent = rB.textContent = '';
      var f2 = ease((t - 8.5) / .5);
      g1.style.opacity = gG.style.opacity = (1 - f2).toFixed(2); g2.style.opacity = f2.toFixed(2);
      g1.style.display = gG.style.display = f2 >= 1 ? 'none' : ''; g2.style.display = f2 <= 0 ? 'none' : '';
      /* hemacias andando da esquerda para a direita; a hemacia 0 e' a "guia" do cursor */
      var L = XC1 - XC0, vel = L / 8;
      var uGuia = Math.min(1, t / 8);
      hem.forEach(function (h, k) {
        var x = XC0 + ((t * vel + k * L / 6) % L);
        var u = (x - XC0) / L, sat = 1 - Math.exp(-u / .1);
        h.setAttribute('cx', x.toFixed(1));
        h.style.fill = mix('#7d3b52', '#d8352c', sat);
        h.style.opacity = x < XC0 + 12 || x > XC1 - 12 ? .0 : 1;
      });
      /* O2: desce do alveolo para o capilar (mais nos primeiros trechos, onde o gradiente e' maior) */
      o2.forEach(function (g, k) {
        var per = 1.8, u = ((t + k * per / 7) % per) / per, x = 70 + k * 14;   /* o O2 entra quase todo no primeiro terco do capilar */
        var y = 150 + (YC0 + 14 - 150) * ease(u);
        g.setAttribute('transform', 'translate(' + x + ',' + y.toFixed(1) + ')');
        g.style.opacity = (u < .1 ? u / .1 : u > .85 ? (1 - u) / .15 : 1).toFixed(2);
      });
      co2.forEach(function (g, k) {
        var per = 2.1, u = ((t + k * per / 6) % per) / per, x = 109 + k * 26;
        var y = YC0 + 16 - (YC0 + 16 - 150) * ease(u);
        g.setAttribute('transform', 'translate(' + x + ',' + y.toFixed(1) + ')');
        g.style.opacity = (u < .1 ? u / .1 : u > .85 ? (1 - u) / .15 : 1).toFixed(2);
      });
      /* cursor nos graficos acompanha um trecho do capilar */
      var xc = GX0 + (GX1 - GX0) * uGuia;
      cursores.forEach(function (c) { c.setAttribute('x1', xc.toFixed(1)); c.setAttribute('x2', xc.toFixed(1)); });
      faixas.forEach(function (f, k) { pts[k].setAttribute('cx', xc.toFixed(1)); pts[k].setAttribute('cy', yv(f, valor(f, uGuia)).toFixed(1)); });
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"Pe83b95f": {"s": [1, 7.9], "e": 0, "a": "Resposta E: difusão simples, a favor", "b": "do gradiente, sem ATP nem proteína."}, "Pba2e96e": {"s": [1, 7.9], "e": 0, "a": "Resposta D: O₂ sobe (3), CO₂ desce (1),", "b": "N₂ constante (2); por difusão."}, "W866f92c": {"s": [1, 7.9], "e": 0, "a": "Resposta C: a hematose acontece", "b": "nos alvéolos."}, "P1e322e7": {"s": [9.2, 11.9], "e": 1, "a": "Resposta C: a função do", "b": "alvéolo é a troca gasosa."}}, R = RESP[qid];
    return function (t) {
      if (t < 12 || !R) { desenha0(Math.min(t, 12 - .01)); return; }
      desenha0(R.s[0] + ((t - 12) % (R.s[1] - R.s[0])));
      legenda.style.display = R.e ? '' : 'none';
      var xr = R.e ? 372 : 16, yr = R.e ? 300 : 322;
      rA.setAttribute('x', xr); rA.setAttribute('y', yr); rB.setAttribute('x', xr); rB.setAttribute('y', yr + 20);
      rA.textContent = R.a; rB.textContent = R.b;
    };
  }
};
VIS.liga('hematose-alveolo', ['Pe83b95f', 'Pba2e96e', 'P1e322e7', 'W866f92c']);
