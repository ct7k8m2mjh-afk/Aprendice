VIS.def['transporte-xilema-floema'] = {
  tit: 'Xilema e floema: a água é puxada para cima; o açúcar sai da folha',
  tipo: 'anim', dur: 12, cred: 'Animação feita para o app (esquema fora de escala).',
  fontes: ['OpenStax Biology 2e, 30.5 Transport of Water and Solutes in Plants (coesão-tensão; floema da fonte ao dreno) — https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants'],
  marcas: [[0, 'Xilema: coesão-tensão'], [4.6, 'Floema'], [8.6, 'Quem suga o quê']],
  nota: 'Xilema (lenho): seiva bruta, água e sais, da raiz para cima, puxada pela transpiração. Floema (líber): seiva elaborada, açúcar feito na folha, levado aos órgãos que consomem ou guardam. Pulgão e planta holoparasita (sem clorofila) sugam o floema; a hemiparasita, que faz fotossíntese, suga o xilema.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 4.6, T2 = 8.6, AZ = '#2f6fbf', LJ = '#d0802a';
    var TB = 'font-size:13.5px;font-weight:700;fill:', T = 'font-size:13.5px;fill:var(--tinta)';
    /* solo e raizes */
    el('rect', { x: 14, y: 290, width: 360, height: 56, style: 'fill:#e8dcc4' });
    el('path', { d: 'M172 290 C160 312 130 322 104 336 M172 290 C176 314 172 330 176 344 M172 290 C190 310 222 318 246 334', style: 'fill:none;stroke:#8a6a44;stroke-width:5;stroke-linecap:round' });
    /* copa */
    [[120, 92, 70, 44], [228, 92, 70, 44], [174, 60, 80, 48], [174, 110, 90, 40]].forEach(function (c) { el('ellipse', { cx: c[0], cy: c[1], rx: c[2], ry: c[3], style: 'fill:#a9cf8a;stroke:#6f9a52;stroke-width:1.5' }); });
    /* tronco */
    el('path', { d: 'M156 290 L160 128 L188 128 L192 290 Z', style: 'fill:#b08a62;stroke:#7d5a3a;stroke-width:2' });
    /* folhas destacadas */
    var FOL = [[86, 70], [262, 70], [174, 30]];
    FOL.forEach(function (f) { el('path', { d: 'M' + (f[0] - 20) + ' ' + f[1] + ' Q' + f[0] + ' ' + (f[1] - 14) + ' ' + (f[0] + 20) + ' ' + f[1] + ' Q' + f[0] + ' ' + (f[1] + 14) + ' ' + (f[0] - 20) + ' ' + f[1] + 'Z', style: 'fill:#5f9a3e;stroke:#3f6f28;stroke-width:1.5' }); });
    /* vasos */
    var XIL = [[176, 344], [172, 290], [168, 128], [210, 96], [262, 70]], XIL2 = [[168, 128], [128, 96], [86, 70]], XIL3 = [[168, 128], [172, 80], [174, 30]];
    var FLO = [[86, 70], [130, 100], [184, 130], [186, 290], [104, 336]], FLO2 = [[186, 200], [230, 168], [244, 176]];
    function poli(p) { return 'M' + p.map(function (q) { return q[0] + ' ' + q[1]; }).join(' L'); }
    [XIL, XIL2, XIL3].forEach(function (p) { el('path', { d: poli(p), style: 'fill:none;stroke:' + AZ + ';stroke-width:5;stroke-linejoin:round;opacity:.55' }); });
    [FLO, FLO2].forEach(function (p) { el('path', { d: poli(p), style: 'fill:none;stroke:' + LJ + ';stroke-width:5;stroke-linejoin:round;opacity:.55' }); });
    /* fruto */
    el('circle', { cx: 252, cy: 184, r: 12, style: 'fill:#d9534f;stroke:#9b2f2b;stroke-width:1.5' });
    function comp(p) { var L = 0, s = [0]; for (var i = 1; i < p.length; i++) { L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); s.push(L); } return { p: p, s: s, L: L }; }
    function ponto(c, d) { d = Math.max(0, Math.min(c.L, d)); for (var i = 1; i < c.p.length; i++) if (d <= c.s[i]) { var u = (d - c.s[i - 1]) / (c.s[i] - c.s[i - 1]); return [c.p[i - 1][0] + (c.p[i][0] - c.p[i - 1][0]) * u, c.p[i - 1][1] + (c.p[i][1] - c.p[i - 1][1]) * u]; } return c.p[c.p.length - 1]; }
    var CX1 = comp(XIL), CX2 = comp(XIL2.slice()), CX3 = comp(XIL3), CF1 = comp(FLO), CF2 = comp(FLO2);
    function gotas(n, cor, r) { var a = []; for (var i = 0; i < n; i++) a.push(el('circle', { r: r, style: 'fill:' + cor + ';stroke:#fff;stroke-width:1' })); return a; }
    var gx = gotas(18, AZ, 3.6), gx2 = gotas(6, AZ, 3.6), gx3 = gotas(6, AZ, 3.6), gf = gotas(14, LJ, 3.8), gf2 = gotas(4, LJ, 3.8);
    var vap = FOL.map(function () { return el('path', { style: 'fill:none;stroke:#7fa9d6;stroke-width:2.2;stroke-linecap:round' }); });
    /* pulgao */
    var pul = el('g', {});
    el('ellipse', { cx: 214, cy: 236, rx: 13, ry: 8, style: 'fill:#7aa35a;stroke:#4d6f35;stroke-width:1.5' }, pul);
    el('circle', { cx: 202, cy: 232, r: 5, style: 'fill:#7aa35a;stroke:#4d6f35;stroke-width:1.5' }, pul);
    el('path', { d: 'M208 243 l-4 8 M214 244 l0 9 M220 243 l4 8 M206 229 l-6 -8', style: 'fill:none;stroke:#4d6f35;stroke-width:1.5' }, pul);
    el('path', { d: 'M199 236 L187 240', style: 'fill:none;stroke:#3a2a1a;stroke-width:2' }, pul);
    /* rotulos na arvore */
    var rX = tx({ x: 22, y: 220, style: TB + AZ }), rX2 = tx({ x: 22, y: 236, style: T });
    var rF = tx({ x: 22, y: 160, style: TB + LJ }), rF2 = tx({ x: 22, y: 176, style: T });
    var rT = tx({ x: 290, y: 30, style: TB + '#4f7fae' }), rR = tx({ x: 262, y: 322, style: T });
    var rP = tx({ x: 232, y: 262, style: TB + '#4d6f35' }), rP2 = tx({ x: 232, y: 278, style: T });
    /* painel */
    var px = 404;
    var fase = tx({ x: px, y: 30, style: 'font-size:19px;font-weight:700;fill:var(--tinta)' });
    var s = [0, 1, 2, 3].map(function (k) { return tx({ 'class': 'v-sub', x: px, y: 54 + k * 19 }); });
    /* zoom 1: coluna de agua */
    var Z1 = el('g', {});
    el('rect', { x: 404, y: 140, width: 226, height: 200, rx: 10, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, Z1);
    tx({ x: 414, y: 160, style: TB + 'var(--tinta)' }, 'dentro de um vaso do xilema', Z1);
    el('path', { d: 'M440 172 V332 M494 172 V332', style: 'fill:none;stroke:#8a6a44;stroke-width:4' }, Z1);
    var cop = el('clipPath', { id: 'txf-clip' }, Z1); el('rect', { x: 442, y: 172, width: 50, height: 160 }, cop);
    var colG = el('g', { 'clip-path': 'url(#txf-clip)' }, Z1), MOL = [];
    for (var i = 0; i < 9; i++) {
      var g = el('g', {}, colG), xo = i % 2 ? 474 : 460;
      el('circle', { cx: xo, cy: 0, r: 7, style: 'fill:#d9534f' }, g); el('circle', { cx: xo - 8, cy: 6, r: 4, style: 'fill:#f2f2f2;stroke:#999;stroke-width:.8' }, g); el('circle', { cx: xo + 8, cy: 6, r: 4, style: 'fill:#f2f2f2;stroke:#999;stroke-width:.8' }, g);
      el('path', { d: 'M' + (xo + (i % 2 ? -8 : 8)) + ' 10 L' + (i % 2 ? 460 : 474) + ' 20', style: 'fill:none;stroke:' + AZ + ';stroke-width:1.6;stroke-dasharray:3 2' }, g);
      MOL.push(g);
    }
    el('path', { d: 'M424 300 v-90 m-6 8 l6 -8 l6 8', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, Z1);
    tx({ x: 502, y: 200, style: TB + AZ }, 'coesão:', Z1);
    tx({ x: 502, y: 216, style: T }, 'moléculas unidas', Z1);
    tx({ x: 502, y: 232, style: T }, 'por pontes de H', Z1);
    tx({ x: 502, y: 262, style: TB + '#8a6a44' }, 'adesão:', Z1);
    tx({ x: 502, y: 278, style: T }, 'água presa', Z1);
    tx({ x: 502, y: 294, style: T }, 'à parede do vaso', Z1);
    tx({ x: 502, y: 324, style: T }, 'o fio sobe inteiro', Z1);
    /* zoom 2: corte do caule */
    var Z2 = el('g', {}), ZX = 470, ZY = 244;
    el('rect', { x: 404, y: 140, width: 226, height: 200, rx: 10, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, Z2);
    tx({ x: 414, y: 160, style: TB + 'var(--tinta)' }, 'corte do caule', Z2);
    el('circle', { cx: ZX, cy: ZY, r: 66, style: 'fill:#b08a62;stroke:#7d5a3a;stroke-width:2' }, Z2);
    el('circle', { cx: ZX, cy: ZY, r: 56, style: 'fill:#f3c98f;stroke:' + LJ + ';stroke-width:2' }, Z2);
    el('circle', { cx: ZX, cy: ZY, r: 42, style: 'fill:#b9d3ee;stroke:' + AZ + ';stroke-width:2' }, Z2);
    el('circle', { cx: ZX, cy: ZY, r: 18, style: 'fill:#efe6d6;stroke:#c9b79a;stroke-width:1.5' }, Z2);
    el('path', { d: 'M' + (ZX + 38) + ' ' + (ZY - 30) + ' L' + (ZX + 80) + ' ' + (ZY - 62), style: 'fill:none;stroke:#3a2a1a;stroke-width:2.5' }, Z2);
    el('ellipse', { cx: ZX + 90, cy: ZY - 70, rx: 12, ry: 7, transform: 'rotate(-38 ' + (ZX + 90) + ' ' + (ZY - 70) + ')', style: 'fill:#7aa35a;stroke:#4d6f35;stroke-width:1.5' }, Z2);
    tx({ x: 546, y: 226, style: TB + LJ }, 'floema', Z2); tx({ x: 546, y: 242, style: T }, '(perto da', Z2); tx({ x: 546, y: 258, style: T }, 'casca)', Z2);
    tx({ x: 546, y: 290, style: TB + AZ }, 'xilema', Z2); tx({ x: 546, y: 306, style: T }, '(mais dentro)', Z2);
    el('path', { d: 'M544 222 L' + (ZX + 50) + ' ' + (ZY - 12) + ' M544 286 L' + (ZX + 30) + ' ' + (ZY + 14), style: 'fill:none;stroke:var(--lapis);stroke-width:1.2' }, Z2);
    tx({ x: 414, y: 332, style: T }, 'estilete do pulgão: no floema', Z2);
    function correr(arr, c, vel, t, off) { arr.forEach(function (g, i) { var d = ((t * vel + i * c.L / arr.length + (off || 0)) % c.L + c.L) % c.L, p = ponto(c, d); g.setAttribute('cx', p[0].toFixed(1)); g.setAttribute('cy', p[1].toFixed(1)); }); }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0 ? '' : 'none'; }
    return function (t) {
      var vx = t < T1 ? 34 : 10;
      var tt = t < T1 ? t : T1 + (t - T1) * 10 / 34;
      correr(gx, CX1, 34, tt); correr(gx2, CX2, 34, tt); correr(gx3, CX3, 34, tt);
      var XV = (qid === 'P196ae41' || qid === 'W74e178f') && t >= 10.4;
      [gx, gx2, gx3].forEach(function (a) { a.forEach(function (g) { g.style.opacity = t < T1 || XV ? 1 : .35; }); });
      var tf = Math.max(0, t - T1);
      correr(gf, CF1, 30, tf); correr(gf2, CF2, 30, tf);
      [gf, gf2].forEach(function (a) { a.forEach(function (g) { g.style.opacity = t < T1 ? 0 : t < T2 ? 1 : .55; }); });
      vap.forEach(function (v, k) {
        var f = FOL[k], u = (t * .9 + k * .33) % 1, dx = k === 0 ? -1 : k === 1 ? 1 : 0, dy = k === 2 ? -1 : -.6;
        var x0 = f[0] + dx * (16 + 16 * u), y0 = f[1] + dy * (8 + 16 * u);
        v.setAttribute('d', 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' q' + (3 * (dx || 1)).toFixed(1) + ' -5 ' + (6 * dx).toFixed(1) + ' ' + (-8).toFixed(1));
        v.style.opacity = t < T1 || XV ? (1 - u).toFixed(2) : (.4 * (1 - u)).toFixed(2);
      });
      MOL.forEach(function (g, i) { var y = 340 - ((i * 20 + tt * 18) % 180); g.setAttribute('transform', 'translate(0 ' + y.toFixed(1) + ')'); });
      vis(Z1, t < T1 || XV ? 1 : 0); vis(Z2, t >= T1 && !XV ? 1 : 0);
      vis(pul, t >= T2 && !XV ? ease((t - T2) / .5) : 0);
      rX.textContent = 'xilema'; rX2.textContent = 'seiva bruta sobe';
      rF.textContent = t >= T1 ? 'floema' : ''; rF2.textContent = t >= T1 ? 'açúcar sai da folha' : '';
      rT.textContent = t < T1 || XV ? 'transpiração' : '';
      rR.textContent = t < T1 || XV ? 'água e sais entram' : '';
      rP.textContent = t >= T2 && !XV ? 'pulgão' : ''; rP2.textContent = t >= T2 && !XV ? 'suga o floema' : '';
      var nome, L;
      if (t < T1) { nome = 'Coesão-tensão'; L = ['a água evapora pelos estômatos', '(transpiração) e puxa de cima', 'uma coluna contínua de água:', 'é tensão, não bomba na raiz']; }
      else if (t < T2) { nome = 'Floema'; L = ['o açúcar feito na folha vai', 'para onde é consumido ou', 'guardado: raízes, frutos,', 'sementes (seiva elaborada)']; }
      else { nome = 'Quem suga o quê'; L = ['pulgão: estilete no floema,', 'líquido doce; holoparasita', '(sem clorofila): floema;', 'hemiparasita: xilema']; }
      var PR = { P196ae41: ['a transpiração nas folhas', 'puxa a coluna de água', '(coesão-tensão).', 'Por isso a resposta é C.'], W74e178f: ['xilema conduz água e sais', '(seiva bruta); quem absorve', 'é a raiz.', 'Por isso a resposta é C.'], W8e2b1a5: ['adulto: açúcar no floema;', 'plântula: reserva nos', 'cotilédones.', 'Por isso a resposta é E.'], W0b26329: ['holoparasita, sem clorofila,', 'suga seiva elaborada do', 'floema.', 'Por isso a resposta é E.'] }[qid];
      if (PR && t >= 10.4) { nome = 'Por isso'; L = PR; }
      fase.textContent = nome; s.forEach(function (e, k) { e.textContent = L[k]; var p = /^Por isso/.test(L[k]); e.style.fontWeight = p ? 700 : ''; e.style.fill = p ? 'var(--ad-t)' : ''; });
    };
  }
};
VIS.liga('transporte-xilema-floema', ['P196ae41', 'W74e178f', 'W8e2b1a5', 'W0b26329']);
