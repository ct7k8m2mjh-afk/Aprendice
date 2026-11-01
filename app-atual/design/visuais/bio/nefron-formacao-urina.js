/* Nefron: filtracao, reabsorcao, alca de Henle, ducto coletor e ADH */
VIS.def['nefron-formacao-urina'] = {
  tit: 'O néfron formando a urina: filtração, reabsorção e o papel do ADH',
  tipo: 'anim', dur: 15.5,
  marcas: [[0, 'Filtração'], [3, 'Reabsorção'], [6, 'Alça'], [8.5, 'Com ADH'], [10.8, 'Sem ADH'], [13, 'Resposta']],
  fontes: [
    'OpenStax Anatomy and Physiology 2e, 25.5 Physiology of Urine Formation — https://openstax.org/books/anatomy-and-physiology-2e/pages/25-5-physiology-of-urine-formation',
    'OpenStax Anatomy and Physiology 2e, 25.6 Tubular Reabsorption (ADH) — https://openstax.org/books/anatomy-and-physiology-2e/pages/25-6-tubular-reabsorption'
  ],
  cred: 'Animação feita para o app (esquema fora de escala; os capilares em volta do túbulo foram omitidos).',
  nota: 'O néfron é a unidade funcional do rim: filtra, reabsorve e secreta. Tudo o que está pequeno e dissolvido no plasma, ingerido ou injetado, passa no filtro e pode aparecer na urina.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var AGUA = '#3f8fd6', SOL = '#d98a00', VERM = '#c8463d';
    /* cortex x medula */
    el('line', { x1: 16, x2: 380, y1: 166, y2: 166, style: 'stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:6 5' });
    tx({ x: 16, y: 158, style: 'font-size:13px;fill:var(--lapis)' }, 'córtex');
    tx({ x: 16, y: 184, style: 'font-size:13px;fill:var(--lapis)' }, 'medula');
    /* trajeto do tubulo (linha central), com os trechos */
    var P = [];
    function add(x, y) { P.push([x, y]); }
    for (var i = 0; i <= 30; i++) { var u = i / 30; add(96 + 96 * u, 96 + 11 * Math.sin(u * Math.PI * 4)); }          /* proximal (0..30) */
    add(200, 112); for (i = 1; i <= 10; i++) add(200, 112 + 17 * i);                                                    /* descendente */
    for (i = 1; i <= 6; i++) { var a = Math.PI - Math.PI * i / 6; add(215 + 15 * Math.cos(a), 282 + 15 * Math.sin(a)); }  /* curva */
    for (i = 1; i <= 10; i++) add(230, 282 - 17 * i);                                                                  /* ascendente */
    for (i = 0; i <= 20; i++) { u = i / 20; add(236 + 80 * u, 104 - 9 * Math.sin(u * Math.PI * 3)); }                /* distal */
    add(332, 104); for (i = 1; i <= 12; i++) add(332, 104 + 19 * i);                                                    /* coletor */
    var dP = P.map(function (p, k) { return (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    el('path', { d: dP, style: 'fill:none;stroke:#c9a94a;stroke-width:16;stroke-linejoin:round;stroke-linecap:round' });
    el('path', { d: dP, style: 'fill:none;stroke:#fbf1c9;stroke-width:11;stroke-linejoin:round;stroke-linecap:round' });
    var kDes = 31, kAsc = 48, kDis = 58, kCol = 79, kFim = P.length - 1;
    /* capsula de Bowman e glomerulo */
    el('path', { d: 'M43.8 80 A28 28 0 1 1 43.8 112', style: 'fill:#fbf1c9;stroke:#c9a94a;stroke-width:4' });
    el('path', { d: 'M16 78 Q36 82 54 90 M54 102 Q36 110 16 114', style: 'fill:none;stroke:' + VERM + ';stroke-width:6;stroke-linecap:round' });
    var glom = el('g', {});
    [[60, 90], [72, 88], [68, 100], [58, 102], [80, 98], [70, 110], [80, 109]].forEach(function (c) { el('circle', { cx: c[0], cy: c[1], r: 6, style: 'fill:none;stroke:' + VERM + ';stroke-width:2.5' }, glom); });
    tx({ x: 16, y: 62, style: 'font-size:13px;fill:' + VERM }, 'arteríolas');
    tx({ x: 16, y: 142, style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, 'glomérulo + cápsula');
    tx({ x: 120, y: 66, style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, 'túbulo proximal');
    tx({ x: 244, y: 74, style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, 'túbulo distal');
    tx({ x: 112, y: 250, style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, 'alça de');
    tx({ x: 112, y: 267, style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, 'Henle');
    tx({ x: 352, y: 210, transform: 'rotate(90 352 210)', 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, 'ducto coletor');
    var urinaT = tx({ x: 332, y: 346, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, 'urina ↓');
    /* fluxo do filtrado */
    var gotas = [];
    for (i = 0; i < 26; i++) gotas.push(el('circle', { r: 3.2, style: 'fill:' + SOL }));
    function ponto(s) {   /* s em [0,1) ao longo do trajeto */
      var f = s * kFim, k = Math.floor(f), u = f - k, a = P[k], b = P[Math.min(kFim, k + 1)];
      return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    }
    /* setas de saida (reabsorcao) e de entrada (filtracao), com gotinhas andando */
    var SET = [
      { f: 0, x1: 70, y1: 92, x2: 84, y2: 76, cor: SOL }, { f: 0, x1: 72, y1: 100, x2: 90, y2: 112, cor: SOL }, { f: 0, x1: 66, y1: 96, x2: 56, y2: 120, cor: SOL },                                   /* filtracao: do sangue para a capsula */
      { f: 1, x1: 120, y1: 104, x2: 120, y2: 140, cor: AGUA }, { f: 1, x1: 150, y1: 104, x2: 150, y2: 140, cor: SOL }, { f: 1, x1: 176, y1: 104, x2: 176, y2: 140, cor: AGUA },
      { f: 2, x1: 196, y1: 200, x2: 170, y2: 200, cor: AGUA }, { f: 2, x1: 196, y1: 240, x2: 170, y2: 240, cor: AGUA }, { f: 2, x1: 234, y1: 200, x2: 262, y2: 200, cor: SOL }, { f: 2, x1: 234, y1: 240, x2: 262, y2: 240, cor: SOL },
      { f: 3, x1: 326, y1: 170, x2: 296, y2: 170, cor: AGUA }, { f: 3, x1: 326, y1: 220, x2: 296, y2: 220, cor: AGUA }, { f: 3, x1: 326, y1: 270, x2: 296, y2: 270, cor: AGUA }
    ];
    SET.forEach(function (s) {
      s.g = el('g', {});
      el('path', { d: 'M' + s.x1 + ' ' + s.y1 + ' L' + s.x2 + ' ' + s.y2, style: 'fill:none;stroke:' + s.cor + ';stroke-width:2.5;stroke-linecap:round;stroke-dasharray:4 4' }, s.g);
      s.b = el('circle', { r: 4.5, style: 'fill:' + s.cor }, s.g);
    });
    var rotSet = [tx({ x: 112, y: 158, style: 'font-size:13px;fill:var(--tinta)' }, ''), tx({ x: 264, y: 222, style: 'font-size:13px;fill:var(--tinta)' }, ''), tx({ x: 292, y: 196, 'text-anchor': 'end', style: 'font-size:13px;font-weight:700;fill:' + AGUA }, '')];
    /* painel */
    var PX = 400;
    var fase = tx({ x: PX, y: 36, 'class': 'v-fase' });
    var L = []; for (i = 0; i < 7; i++) L.push(tx({ x: PX, y: 62 + i * 20, 'class': 'v-sub' }));
    /* copo de urina (fases do ADH) */
    var gCopo = el('g', {});
    el('path', { d: 'M' + (PX + 4) + ' 222 L' + (PX + 12) + ' 330 H' + (PX + 68) + ' L' + (PX + 76) + ' 222', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, gCopo);
    var liq = el('path', {}, gCopo);
    var copoT1 = tx({ x: PX + 90, y: 280, 'class': 'v-rot' }, '', gCopo), copoT2 = tx({ x: PX + 90, y: 300, style: 'font-size:13px;fill:var(--lapis)' }, '', gCopo);
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    var desenha0 = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 8.5 ? 2 : 3, semADH = t >= 10.8;
      gotas.forEach(function (g, k) {
        var s = ((t * .055 + k / 26) % 1), p = ponto(s);
        g.setAttribute('cx', p[0].toFixed(1)); g.setAttribute('cy', p[1].toFixed(1));
        g.style.fill = s * kFim > kCol ? (semADH ? '#e9d675' : '#c98a00') : SOL;
      });
      SET.forEach(function (s) {
        var on = s.f === f && !(s.f === 3 && semADH);
        s.g.style.opacity = on ? 1 : s.f === f ? .12 : 0;
        var u = (t * 1.1 + s.x1 * .01) % 1;
        s.b.setAttribute('cx', (s.x1 + (s.x2 - s.x1) * u).toFixed(1)); s.b.setAttribute('cy', (s.y1 + (s.y2 - s.y1) * u).toFixed(1));
        s.b.style.opacity = on ? 1 : 0;
      });
      rotSet[0].textContent = f === 1 ? 'volta ao sangue' : '';
      rotSet[1].textContent = f === 2 ? 'sal sai' : ''; rotSet[1].setAttribute('y', 260);
      rotSet[2].textContent = f === 3 ? (semADH ? 'água fica' : 'água sai') : '';
      var nome, l;
      if (f === 0) { nome = 'Filtração'; l = ['No glomérulo, a pressão do', 'sangue empurra o plasma para', 'a cápsula: água, glicose, sais,', 'ureia e drogas (ingeridas ou', 'injetadas) passam.', 'Células e proteínas grandes', 'ficam no sangue.']; }
      else if (f === 1) { nome = 'Túbulo proximal'; l = ['Reabsorve a maior parte:', 'toda a glicose e aminoácidos,', 'muito sódio e água.', 'Células com muitas', 'microvilosidades (mais área) e', 'muitas mitocôndrias (muito ATP', 'para o transporte ativo).']; }
      else if (f === 2) { nome = 'Alça de Henle'; l = ['Desce: sai água.', 'Sobe: sai sal, a água não.', 'Isso deixa a medula salgada,', 'o que permite concentrar a', 'urina no ducto coletor.', 'Alça longa (deserto): urina', 'mais concentrada.']; }
      else if (!semADH) { nome = 'Com ADH'; l = ['Pouca água (calor, suor):', 'a hipófise libera ADH e a', 'água sai do ducto coletor.', 'Túbulo distal: muitas', 'mitocôndrias (bombeia íons).', 'Ducto coletor: poucas', 'mitocôndrias; a água passa com ADH.']; }
      else { nome = 'Sem ADH'; l = ['Sem o hormônio, o ducto', 'coletor fica impermeável à', 'água: ela segue na urina.', '', '', '', '']; }
      fase.textContent = nome;
      for (var k = 0; k < 7; k++) L[k].textContent = l[k];
      gCopo.style.display = f === 3 ? '' : 'none';
      var nivel = semADH ? 92 : 30, topo = 330 - nivel, larg = 4 + 8 * (1 - (topo - 222) / 108);
      liq.setAttribute('d', 'M' + (PX + 12 - 8 * (1 - (topo - 222) / 108) + 8) + ' ' + topo + ' L' + (PX + 13) + ' 329 H' + (PX + 67) + ' L' + (PX + 68 + 8 * (1 - (topo - 222) / 108) - 8) + ' ' + topo + ' Z');
      liq.style.fill = semADH ? '#f2e7a6' : '#d9a41e';
      copoT1.textContent = semADH ? 'muita urina,' : 'pouca urina,';
      copoT2.textContent = semADH ? 'diluída (clara)' : 'concentrada (escura)';
      urinaT.style.opacity = 1;
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"Pa62a9f0": {"s": [3.2, 5.9], "L": ["Resposta C (1, 3 e 2):", "proximal = célula 1, mais", "microvilosidades; distal =", "célula 3, muitas", "mitocôndrias; coletor =", "célula 2, quase lisa.", ""]}, "P58c5a85": {"s": [0.2, 2.9], "L": ["Resposta D: ingerida", "(absorvida no intestino)", "ou injetada, a droga", "fica no plasma e é", "filtrada no glomérulo.", "", ""]}, "W64c528e": {"s": [0.2, 2.9], "L": ["Resposta B: o néfron", "filtra, reabsorve e", "secreta: é a unidade", "funcional do rim.", "", "", ""]}, "Wfaceeb1": {"s": [8.6, 10.7], "L": ["Resposta C: no calor,", "perde-se água no suor;", "com ADH o rim devolve", "mais água ao sangue:", "urina concentrada.", "", ""]}, "W295fc4d": {"s": [10.9, 12.9], "L": ["Resposta B: sem ADH a", "água não volta ao", "sangue: muita urina,", "diluída.", "", "", ""]}}, R = RESP[qid];
    return function (t) {
      if (t < 13 || !R) { desenha0(Math.min(t, 13 - .01)); return; }
      desenha0(R.s[0] + ((t - 13) % (R.s[1] - R.s[0])));
      fase.textContent = 'Resposta';
      for (var k = 0; k < 7; k++) L[k].textContent = R.L[k];
    };
  }
};
VIS.liga('nefron-formacao-urina', ['Pa62a9f0', 'P58c5a85', 'W64c528e', 'Wfaceeb1', 'W295fc4d']);
