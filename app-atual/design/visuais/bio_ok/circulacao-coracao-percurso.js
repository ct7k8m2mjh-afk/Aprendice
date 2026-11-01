/* Percurso do sangue: coracao de 4 cavidades, pequena e grande circulacao; comunicacao interventricular */
VIS.def['circulacao-coracao-percurso'] = {
  tit: 'O caminho do sangue: coração, pulmões e corpo',
  tipo: 'anim', dur: 15.5,
  marcas: [[0, 'Pequena circulação'], [4.5, 'Grande circulação'], [9, 'Septo com furo'], [13, 'Resposta']],
  fontes: [
    'OpenStax Biology 2e, 40.3 Mammalian Heart and Blood Vessels — https://openstax.org/books/biology-2e/pages/40-3-mammalian-heart-and-blood-vessels',
    'OpenStax Biology 2e, 40.1 Overview of the Circulatory System — https://openstax.org/books/biology-2e/pages/40-1-overview-of-the-circulatory-system'
  ],
  cred: 'Animação feita para o app (esquema fora de escala; coração visto de frente: o lado direito do paciente fica à esquerda do desenho).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var VERM = '#d2433b', AZ = '#4f63a8', ROXO = '#8a4f8c', MUS = '#efc4bc', MUSs = '#b5655c';
    /* vasos (faixas largas e claras; o sangue anda por cima) */
    function vaso(d, cor) { el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:14;stroke-linejoin:round;opacity:.28' }); }
    vaso('M140 222 H96 V60 H112', AZ);            /* arteria pulmonar */
    vaso('M298 60 H314 V150 H280', VERM);          /* veias pulmonares */
    vaso('M280 222 H370 V298 H298', VERM);         /* aorta */
    vaso('M112 298 H40 V150 H130', AZ);            /* veias cavas */
    /* caixas: pulmoes e corpo */
    el('rect', { x: 112, y: 16, width: 186, height: 56, rx: 10, style: 'fill:color-mix(in srgb,#9cc6e8 25%,transparent);stroke:var(--linha);stroke-width:1.5' });
    tx({ x: 205, y: 38, 'text-anchor': 'middle', 'class': 'v-rot' }, 'Pulmões (hematose)');
    el('rect', { x: 112, y: 284, width: 186, height: 56, rx: 10, style: 'fill:color-mix(in srgb,var(--tinta) 6%,transparent);stroke:var(--linha);stroke-width:1.5' });
    tx({ x: 205, y: 328, 'text-anchor': 'middle', 'class': 'v-rot' }, 'Corpo (tecidos)');
    /* coracao: 4 cavidades */
    el('rect', { x: 128, y: 126, width: 154, height: 126, rx: 26, style: 'fill:' + MUS + ';stroke:' + MUSs + ';stroke-width:2' });
    var cav = {
      AD: el('rect', { x: 136, y: 132, width: 62, height: 40, rx: 12 }), AE: el('rect', { x: 212, y: 132, width: 62, height: 40, rx: 12 }),
      VD: el('rect', { x: 138, y: 182, width: 58, height: 58, rx: 14 }), VE: el('rect', { x: 216, y: 184, width: 52, height: 54, rx: 14 })
    };
    for (var k in cav) cav[k].style.cssText = 'fill:#fbeeea;stroke:' + MUSs + ';stroke-width:1.5';
    var furo = el('rect', { x: 196, y: 204, width: 20, height: 16, rx: 3, style: 'fill:#fbeeea' });
    [['AD', 146, 166], ['AE', 264, 166], ['VD', 146, 234], ['VE', 260, 232]].forEach(function (r) {
      tx({ x: r[1], y: r[2], 'text-anchor': r[0][1] === 'D' ? 'start' : 'end', style: 'font-size:13px;font-weight:700;fill:#5b2a24' }, r[0]);
    });
    var furoT = tx({ x: 205, y: 270, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:' + ROXO }, 'furo no septo');
    /* nomes dos vasos (verticais, ao lado das faixas) */
    function vert(x, y, s, cor) { tx({ x: x, y: y, transform: 'rotate(-90 ' + x + ' ' + y + ')', 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:' + cor }, s); }
    vert(24, 226, 'veias cavas', AZ); vert(116, 132, 'artéria pulmonar', AZ);
    vert(330, 98, 'veias pulmonares', VERM); vert(390, 262, 'artéria aorta', VERM);
    /* trajeto com tempos (s) */
    var W = [[167, 152, 0], [167, 211, 1], [140, 222, 1.35], [96, 222, 1.6], [96, 60, 2.15], [112, 60, 2.3], [298, 60, 3.5], [314, 60, 3.6], [314, 150, 4.0], [243, 152, 4.5],
      [243, 211, 5.5], [280, 222, 5.8], [370, 222, 6.05], [370, 298, 6.5], [298, 298, 6.65], [112, 298, 7.8], [40, 298, 7.95], [40, 150, 8.5], [130, 150, 8.75], [167, 152, 9]];
    function pos(tc) {
      tc = ((tc % 9) + 9) % 9;
      for (var i = 1; i < W.length; i++) if (tc <= W[i][2]) { var a = W[i - 1], b = W[i], u = (tc - a[2]) / (b[2] - a[2]); return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, tc]; }
      return [W[0][0], W[0][1], 0];
    }
    function cor(tc) {   /* 0..1: 0 venoso, 1 arterial */
      if (tc < 2.3) return 0; if (tc < 3.5) return (tc - 2.3) / 1.2; if (tc < 6.65) return 1; if (tc < 7.8) return 1 - (tc - 6.65) / 1.15; return 0;
    }
    function mix(u) { var a = [79, 99, 168], b = [210, 67, 59]; return 'rgb(' + a.map(function (v, k) { return Math.round(v + (b[k] - v) * u); }).join(',') + ')'; }
    var N = 22, gotas = [];
    for (var i = 0; i < N; i++) gotas.push(el('circle', { r: 5 }));
    var guia = el('circle', { r: 9, style: 'stroke:var(--tinta);stroke-width:3' });
    /* gotas que atravessam o furo (fase CIV) */
    var shunt = [];
    for (i = 0; i < 4; i++) shunt.push(el('circle', { r: 5, style: 'fill:' + VERM }));
    /* painel */
    var PX = 418;
    var fase = tx({ x: PX, y: 40, 'class': 'v-fase' });
    var L = []; for (i = 0; i < 6; i++) L.push(tx({ x: PX, y: 68 + i * 20, 'class': 'v-sub' }));
    var rod = [tx({ x: PX, y: 270, 'class': 'v-sub forte' }), tx({ x: PX, y: 290, 'class': 'v-sub forte' }), tx({ x: PX, y: 310, 'class': 'v-sub forte' }), tx({ x: PX, y: 330, 'class': 'v-sub forte' })];
    var ETAPAS = [[0.5, 'Átrio direito', ['recebe das veias cavas', 'o sangue venoso (pobre', 'em O₂) que volta do corpo']],
      [1.35, 'Ventrículo direito', ['bombeia o sangue venoso', 'para a artéria pulmonar']],
      [2.3, 'Artéria pulmonar', ['leva sangue VENOSO', '(artéria = sai do coração,', 'não importa o tipo de sangue)']],
      [3.5, 'Pulmões', ['hematose: entra O₂, sai CO₂;', 'o sangue vira arterial']],
      [4.15, 'Veias pulmonares', ['trazem sangue ARTERIAL', '(rico em O₂) ao coração']],
      [5.0, 'Átrio esquerdo', ['recebe o sangue arterial', 'que veio dos pulmões']],
      [5.8, 'Ventrículo esquerdo', ['parede mais grossa:', 'bombeia com força o sangue', 'arterial para a aorta']],
      [6.65, 'Artéria aorta', ['distribui o sangue arterial', 'para todo o corpo']],
      [7.8, 'Corpo', ['os tecidos tiram O₂ e', 'devolvem CO₂: o sangue', 'vira venoso']],
      [9.01, 'Veias cavas', ['devolvem o sangue venoso', 'ao átrio direito']]];
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    var desenha0 = function (t) {
      var civ = t >= 9, tc = t % 9;
      var tl = civ ? t - 9 : 0;
      gotas.forEach(function (g, k) {
        var p = pos(tc + k * 9 / N);
        g.setAttribute('cx', p[0].toFixed(1)); g.setAttribute('cy', p[1].toFixed(1));
        var c = cor(p[2]);
        /* com CIV, o sangue do ventriculo direito recebe sangue arterial e fica misturado */
        if (civ && p[2] > .7 && p[2] < 2.3) g.style.fill = ROXO; else g.style.fill = mix(c);
      });
      var pg = pos(tc);
      guia.setAttribute('cx', pg[0].toFixed(1)); guia.setAttribute('cy', pg[1].toFixed(1));
      guia.style.fill = civ && pg[2] > .7 && pg[2] < 2.3 ? ROXO : mix(cor(pg[2]));
      guia.style.opacity = civ ? 0 : 1;
      furo.style.display = furoT.style.display = civ ? '' : 'none';
      cav.VD.style.fill = civ ? 'color-mix(in srgb,' + ROXO + ' 30%,#fbeeea)' : '#fbeeea';
      shunt.forEach(function (g, k) {
        var u = ((tl * .8 + k / 4) % 1);
        g.setAttribute('cx', (240 - 76 * u).toFixed(1)); g.setAttribute('cy', (212 + 3 * Math.sin(u * 6 + k)).toFixed(1));
        g.style.opacity = civ ? (u < .15 ? u / .15 : u > .85 ? (1 - u) / .15 : 1).toFixed(2) : 0;
      });
      var nome, l, r;
      if (!civ) {
        var e = ETAPAS[ETAPAS.length - 1];
        for (var k = 0; k < ETAPAS.length; k++) if (tc < ETAPAS[k][0]) { e = ETAPAS[k]; break; }
        nome = e[1]; l = e[2].concat(['', '', '']);
        r = tc < 4.5 ? ['Pequena circulação:', 'VD → pulmões → AE'] : ['Grande circulação:', 'VE → corpo → AD'];
        r.push('', '');
      } else {
        nome = 'Septo com furo';
        l = ['Comunicação interventricular', '(CIV): um furo no septo entre', 'os ventrículos. Em geral o sangue', 'passa do VE (pressão maior)', 'para o VD.', ''];
        r = ['Os sangues se misturam.', 'Se parte do venoso passar', 'ao VE (furo grande), a aorta', 'leva menos O₂ aos tecidos.'];
      }
      fase.textContent = nome;
      for (k = 0; k < 6; k++) L[k].textContent = l[k] || '';
      for (k = 0; k < 4; k++) rod[k].textContent = r[k] || '';
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"P5e0c59e": {"s": [9.2, 12.9], "L": ["Resposta B: o furo no septo", "mistura o sangue arterial", "e o venoso e prejudica a", "oxigenação dos tecidos."]}, "Wcabc838": {"s": [0.1, 8.9], "L": ["Resposta E: quatro", "cavidades: dois átrios", "(AD, AE) e dois", "ventrículos (VD, VE)."]}, "Wc3c03e1": {"s": [0.1, 8.9], "L": ["Resposta D: o ventrículo", "esquerdo bombeia o sangue", "pela aorta para o corpo.", ""]}, "W2780677": {"s": [0.1, 8.9], "L": ["Resposta D: pelas veias", "pulmonares chega o sangue", "rico em O₂; ele sai para", "os tecidos pela aorta."]}, "W5c75f6f": {"s": [0.1, 8.9], "L": ["Resposta B: a pequena", "circulação (VD → pulmões", "→ AE) oxigena o sangue,", "que depois vai ao corpo."]}}, R = RESP[qid];
    return function (t) {
      if (t < 13 || !R) { desenha0(Math.min(t, 13 - .01)); return; }
      desenha0(R.s[0] + ((t - 13) % (R.s[1] - R.s[0])));
      fase.textContent = 'Resposta';
      for (var k = 0; k < 6; k++) L[k].textContent = R.L[k] || '';
      rod.forEach(function (r) { r.textContent = ''; });
    };
  }
};
VIS.liga('circulacao-coracao-percurso', ['P5e0c59e', 'Wcabc838', 'Wc3c03e1', 'W2780677', 'W5c75f6f']);
