/* Gata tricolor: inativacao aleatoria de um X em cada celula (corpusculo de Barr) gera manchas */
VIS.def['gata-tricolor-inativacao-x'] = {
  tit: 'Gata tricolor: em cada célula, um X é desligado ao acaso',
  tipo: 'anim', dur: 14,
  marcas: [[0, 'Embrião'], [2.5, 'Inativação do X'], [6, 'Manchas'], [12, 'Resposta']],
  fontes: [
    'OpenStax Biology 2e, 13.2 Chromosomal Basis of Inherited Disorders (inativação do X, corpúsculo de Barr) — https://openstax.org/books/biology-2e/pages/13-2-chromosomal-basis-of-inherited-disorders'
  ],
  cred: 'Foto: "Calico Cat On A Cat House", Kafun, CC BY 4.0, via Wikimedia Commons (recortada). Animação feita para o app (esquema fora de escala).',
  nota: 'O macho é XY: tem um só X, com P ou com A, e por isso é preto e branco ou amarelo e branco. Tricolor exige dois X diferentes (XᴾXᴬ). O branco vem de outro gene, que não está no X.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PRE = '#2f2a27', LAR = '#e08a2e';
    /* ---------- foto real com rotulos ---------- */
    var FW = 268, FH = 201, FX = 16, FY = 16, s = FW / 640;
    el('image', { href: 'vis/gata-tricolor-1.webp', x: FX, y: FY, width: FW, height: FH, preserveAspectRatio: 'xMidYMid slice' });
    el('rect', { x: FX, y: FY, width: FW, height: FH, rx: 8, style: 'fill:none;stroke:var(--linha);stroke-width:1' });
    function pino(px, py, lx, ly, txt, ancora) {
      var x = FX + px * s, y = FY + py * s;
      el('line', { x1: x, y1: y, x2: lx, y2: ly, style: 'stroke:#fff;stroke-width:2' });
      el('circle', { cx: x, cy: y, r: 4, style: 'fill:#fff;stroke:#222;stroke-width:1.5' });
      var w = txt.length * 7.6 + 14, rx = ancora === 'end' ? lx - w : lx;
      el('rect', { x: rx, y: ly - 13, width: w, height: 22, rx: 6, style: 'fill:rgba(255,255,255,.9)' });
      tx({ x: rx + 7, y: ly + 3, style: 'font-size:13px;font-weight:700;fill:#1d1d1d' }, txt);
    }
    pino(300, 300, 150, 196, 'preto', 'start');
    pino(190, 200, 92, 40, 'amarelo', 'start');
    pino(440, 268, 278, 196, 'branco', 'end');
    tx({ x: 16, y: 246, 'class': 'v-rot' }, 'Fêmea XᴾXᴬ (heterozigota)');
    tx({ x: 16, y: 268, 'class': 'v-sub' }, 'Manchas pretas: células com Xᴾ ativo.');
    tx({ x: 16, y: 288, 'class': 'v-sub' }, 'Manchas amarelas: células com Xᴬ ativo.');
    tx({ x: 16, y: 316, 'class': 'v-sub forte' }, 'Macho XY: um X só, uma cor só.');
    /* ---------- painel animado ---------- */
    var PX = 304;
    var fase = tx({ x: PX, y: 30, 'class': 'v-fase' }), sub1 = tx({ x: PX, y: 54, 'class': 'v-sub' }), sub2 = tx({ x: PX, y: 73, 'class': 'v-sub' });
    /* tecido: grade de celulas coloridas por clone (Voronoi a partir das 8 celulas iniciais) */
    var TX0 = PX, TY0 = 90, COLS = 20, ROWS = 11, Q = 16;
    var centros = [[350, 128], [420, 118], [500, 132], [580, 120], [358, 210], [438, 222], [512, 206], [584, 218]];
    var ativo = ['P', 'A', 'A', 'P', 'A', 'P', 'P', 'A'];   /* escolha "ao acaso" (fixa para o esquema) */
    var gTec = el('g', {}), tiles = [];
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) {
      var x = TX0 + c * Q + (r % 2 ? Q / 2 : 0), y = TY0 + r * Q;
      if (x + Q > 640) continue;
      var melhor = 0, dm = 1e9;
      centros.forEach(function (p, k) { var j = Math.sin(k * 12.9 + c * 3.1 + r * 7.7) * 9; var d = Math.hypot(x + Q / 2 - p[0], y + Q / 2 - p[1]) + j; if (d < dm) { dm = d; melhor = k; } });
      tiles.push({ e: el('rect', { x: x + .5, y: y + .5, width: Q - 1, height: Q - 1, rx: 3, style: 'fill:' + (ativo[melhor] === 'P' ? PRE : LAR) }, gTec), d: dm, k: melhor });
    }
    /* as 8 celulas do embriao */
    var cels = [];
    centros.forEach(function (p, k) {
      var g = el('g', { transform: 'translate(' + p[0] + ',' + p[1] + ')' });
      var corpo = el('circle', { r: 30, style: 'stroke:#b98a74;stroke-width:2' }, g);
      el('circle', { r: 17, style: 'fill:#f6efe6;stroke:#a78f80;stroke-width:1.5' }, g);
      var xp = el('rect', { x: -9, y: -10, width: 6, height: 20, rx: 3, style: 'fill:' + PRE }, g);
      var xa = el('rect', { x: 3, y: -10, width: 6, height: 20, rx: 3, style: 'fill:' + LAR }, g);
      cels.push({ g: g, corpo: corpo, xp: xp, xa: xa });
    });
    /* legenda */
    var gLeg = el('g', {});
    el('rect', { x: PX, y: 282, width: 6, height: 18, rx: 3, style: 'fill:' + PRE }, gLeg);
    tx({ x: PX + 14, y: 296, style: 'font-size:13px;fill:var(--tinta)' }, 'Xᴾ (alelo preto)', gLeg);
    el('rect', { x: PX + 140, y: 282, width: 6, height: 18, rx: 3, style: 'fill:' + LAR }, gLeg);
    tx({ x: PX + 154, y: 296, style: 'font-size:13px;fill:var(--tinta)' }, 'Xᴬ (alelo amarelo)', gLeg);
    var legBarr = el('g', {}, gLeg);
    el('circle', { cx: PX + 6, cy: 322, r: 6, style: 'fill:#4a3b36' }, legBarr);
    tx({ x: PX + 18, y: 327, style: 'font-size:13px;fill:var(--tinta)' }, 'corpúsculo de Barr: o X inativado, condensado', legBarr);
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    var desenha0 = function (t) {
      var nome, a, b;
      var cresce = ease((t - 6) / 3.2), somem = ease((t - 6) / .8);
      cels.forEach(function (o, k) {
        var u = ease((t - 2.5 - k * .32) / .6);          /* cada celula escolhe num instante diferente */
        var inat = ativo[k] === 'P' ? o.xa : o.xp, at = ativo[k] === 'P' ? o.xp : o.xa;
        /* o X inativado encolhe e vai para a borda do nucleo (corpusculo de Barr) */
        var w = 6 + 6 * u, h = 20 - 8 * u;
        inat.setAttribute('width', w.toFixed(1)); inat.setAttribute('height', h.toFixed(1)); inat.setAttribute('rx', (w / 2).toFixed(1));
        inat.setAttribute('x', ((ativo[k] === 'P' ? 3 : -9) + (ativo[k] === 'P' ? 6 : -6) * u).toFixed(1));
        inat.setAttribute('y', (-10 + 14 * u).toFixed(1));
        inat.style.fill = u > .5 ? '#4a3b36' : (ativo[k] === 'P' ? LAR : PRE);
        at.setAttribute('x', ativo[k] === 'P' ? (-9 + 3 * u).toFixed(1) : (3 - 3 * u).toFixed(1));
        o.corpo.style.fill = u > .5 ? (ativo[k] === 'P' ? 'color-mix(in srgb,' + PRE + ' 55%,#f3e6dc)' : 'color-mix(in srgb,' + LAR + ' 55%,#f3e6dc)') : '#f3e6dc';
        o.g.style.opacity = (1 - somem).toFixed(2);
      });
      var raio = 8 + 120 * cresce;
      tiles.forEach(function (q) { q.e.style.opacity = t < 6 ? 0 : q.d < raio ? 1 : 0; });
      legBarr.style.opacity = t >= 2.5 ? 1 : .25;
      if (t < 2.5) { nome = 'Embrião inicial'; a = 'Cada célula tem os dois X ativos:'; b = 'Xᴾ e Xᴬ.'; }
      else if (t < 6) { nome = 'Inativação do X'; a = 'Em cada célula, um dos X é desligado'; b = 'ao acaso e vira o corpúsculo de Barr.'; }
      else if (t < 9.4) { nome = 'Clones'; a = 'Cada célula passa a escolha às filhas:'; b = 'cada grupo de células forma uma mancha.'; }
      else { nome = 'Pele adulta'; a = 'Manchas pretas e amarelas misturadas.'; b = 'O branco depende de outro gene.'; }
      fase.textContent = nome; sub1.textContent = a; sub2.textContent = b;
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"Pa9e3fbe": {"s": [9.6, 11.9]}}, R = RESP[qid];
    return function (t) {
      if (t < 12 || !R) { desenha0(Math.min(t, 12 - .01)); return; }
      desenha0(R.s[0] + ((t - 12) % (R.s[1] - R.s[0])));
      fase.textContent = 'Resposta E';
      sub1.textContent = 'Há inativação aleatória de um X';
      sub2.textContent = 'em cada célula da pele.';
    };
  }
};
VIS.liga('gata-tricolor-inativacao-x', ['Pa9e3fbe']);
