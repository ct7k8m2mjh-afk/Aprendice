VIS.def['cladograma-leitura'] = {
  tit: 'Como ler um cladograma: novidades nos ramos e barras no tempo',
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app. Datas dos hominíneos aproximadas (Smithsonian Human Origins); escala do último milhão de anos ampliada.',
  fontes: [
    'OpenStax Biology 2e, 20.2 Determining Evolutionary Relationships (caracteres derivados compartilhados) — https://openstax.org/books/biology-2e/pages/20-2-determining-evolutionary-relationships',
    'Smithsonian Human Origins: A. afarensis, H. habilis, H. erectus, H. neanderthalensis, H. sapiens — https://humanorigins.si.edu/evidence/human-fossils/species',
    'Wikipedia, Homo antecessor (1,2 a 0,8 milhão de anos) — https://en.wikipedia.org/wiki/Homo_antecessor'
  ],
  marcas: [[0, 'Como ler'], [2, 'Novidade'], [4, 'Empilhar'], [7, 'Tempo'], [10, 'Por isso']],
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var C = '#b4442f', VD = '#2f7a4a', CINZA = 'color-mix(in srgb,var(--tinta) 30%,transparent)';
    var S1 = 2, S2 = 4, S3 = 7, S4 = 10;
    /* ===== cladograma ===== */
    var G1 = el('g', {});
    var R0 = [40, 330], NO = [291, 93];
    el('path', { d: 'M' + R0 + ' L' + NO, style: 'fill:none;stroke:var(--tinta);stroke-width:2.6;stroke-linecap:round' }, G1);
    var TIP = [['estrela-do-mar', 30, [171.7, 205.7]], ['tainha', 88, [201.5, 177.5]], ['sapo', 146, [231.3, 149.3]], ['tamanduá', 204, [261.2, 121.2]], ['crocodilo', 262, NO], ['tico-tico', 320, NO]];
    TIP.forEach(function (p, k) {
      p.ln = el('path', { d: 'M' + p[2] + ' L' + p[1] + ' 64', style: 'fill:none;stroke-width:2.6;stroke-linecap:round' }, G1);
      if (k === 0) { p.tx = tx({ x: p[1], y: 40, 'text-anchor': 'middle', style: 'font-size:13.5px' }, 'estrela-', G1); p.tx2 = tx({ x: p[1], y: 56, 'text-anchor': 'middle', style: 'font-size:13.5px' }, 'do-mar', G1); }
      else p.tx = tx({ x: p[1], y: k === 3 ? 40 : 56, 'text-anchor': 'middle', style: 'font-size:13.5px' }, p[0], G1);
    });
    function mid(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
    var aB = Math.atan2(NO[1] - R0[1], NO[0] - R0[0]) + Math.PI / 2;
    var NOV = [
      { p: mid(TIP[0][2], TIP[1][2]), n: 'I  notocorda', dono: [1, 2, 3, 4, 5], ang: aB },
      { p: mid(TIP[1][2], TIP[2][2]), n: 'II  pulmões', dono: [2, 3, 4, 5], ang: aB },
      { p: mid(TIP[2][2], TIP[3][2]), n: 'III  âmnio', dono: [3, 4, 5], ang: aB },
      { p: [232, 92], n: 'IV  pelo', dono: [3], ang: Math.atan2(64 - 121, 204 - 261) + Math.PI / 2, esq: 1 },
      { p: mid(TIP[3][2], NO), n: 'V  ovo com casca', dono: [4, 5], ang: aB }
    ];
    NOV.forEach(function (m) {
      var x = m.p[0], y = m.p[1];
      m.g = el('g', {}, G1);
      el('path', { d: 'M' + (x - 8 * Math.cos(m.ang)) + ' ' + (y - 8 * Math.sin(m.ang)) + ' L' + (x + 8 * Math.cos(m.ang)) + ' ' + (y + 8 * Math.sin(m.ang)), style: 'fill:none;stroke:' + C + ';stroke-width:4;stroke-linecap:round' }, m.g);
      tx(m.esq ? { x: x - 10, y: y + 2, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:700;fill:' + C } : { x: x + 12, y: y + 18, style: 'font-size:13.5px;font-weight:700;fill:' + C }, m.n, m.g);
    });
    var base = el('g', {}, G1);
    el('path', { d: 'M' + (110 - 8 * Math.cos(aB)) + ' ' + (272 - 8 * Math.sin(aB)) + ' l' + (16 * Math.cos(aB)) + ' ' + (16 * Math.sin(aB)), style: 'fill:none;stroke:var(--lapis);stroke-width:4;stroke-linecap:round' }, base);
    tx({ x: 122, y: 290, style: 'font-size:13.5px;font-weight:700;fill:var(--lapis)' }, 'deuterostomia (todos)', base);
    /* explicacao: no e ponta */
    var exp = el('g', {}, G1);
    el('circle', { cx: 201.5, cy: 177.5, r: 7, style: 'fill:none;stroke:' + VD + ';stroke-width:2.5' }, exp);
    el('path', { d: 'M195 180 L106 198', style: 'fill:none;stroke:' + VD + ';stroke-width:1.5' }, exp);
    tx({ x: 100, y: 196, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:700;fill:' + VD }, 'nó =', exp);
    tx({ x: 100, y: 212, 'text-anchor': 'end', style: 'font-size:13.5px;fill:' + VD }, 'ancestral', exp);
    tx({ x: 100, y: 228, 'text-anchor': 'end', style: 'font-size:13.5px;fill:' + VD }, 'comum', exp);
    el('path', { d: 'M338 76 L326 66', style: 'fill:none;stroke:' + VD + ';stroke-width:1.5' }, exp);
    tx({ x: 334, y: 92, style: 'font-size:13.5px;font-weight:700;fill:' + VD }, 'ponta =', exp);
    tx({ x: 334, y: 108, style: 'font-size:13.5px;fill:' + VD }, 'grupo', exp);
    tx({ x: 334, y: 124, style: 'font-size:13.5px;fill:' + VD }, 'de hoje', exp);
    /* ===== hominineos no tempo ===== */
    var G2 = el('g', {});
    var X0 = 40, XB = 170, X1 = 370;
    function ax(ma) { return ma >= 1 ? X0 + (XB - X0) * (4 - ma) / 3 : XB + (X1 - XB) * (1 - ma); }
    var linha = el('line', { y1: 34, y2: 304, style: 'stroke:' + VD + ';stroke-width:2.5' }, G2);
    var linhaT = tx({ y: 26, style: 'font-size:13.5px;font-weight:700;fill:' + VD + ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round' }, '', G2);
    var BAR = [[3.85, 2.95, 'A. afarensis', 62], [2.4, 1.4, 'H. habilis', 104], [1.89, .11, 'H. erectus', 146], [1.2, .8, 'H. antecessor', 188], [.4, .04, 'H. neanderthalensis', 230], [.3, 0, 'H. sapiens', 272]].map(function (b, k) {
      var o = { a: b[0], b: b[1] };
      o.r = el('rect', { x: ax(b[0]), y: b[3], width: Math.max(4, ax(b[1]) - ax(b[0])), height: 13, rx: 3 }, G2);
      var dir = ax(b[0]) + (k === 4 ? 130 : 95) > 384;
      o.t = tx({ x: dir ? ax(b[1]) : ax(b[0]), y: b[3] - 5, 'text-anchor': dir ? 'end' : 'start', style: 'font-size:13.5px;font-style:italic;paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round' }, b[2], G2);
      return o;
    });
    el('line', { x1: X0, x2: X1, y1: 304, y2: 304, style: 'stroke:var(--lapis);stroke-width:1.5' }, G2);
    [4, 3, 2, 1, .5, 0].forEach(function (m) { el('line', { x1: ax(m), x2: ax(m), y1: 304, y2: 309, style: 'stroke:var(--lapis);stroke-width:1.5' }, G2); tx({ x: ax(m), y: 324, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, String(m).replace('.', ','), G2); });
    el('path', { d: 'M' + (XB - 4) + ' 310 l5 -12 M' + (XB + 1) + ' 310 l5 -12', style: 'fill:none;stroke:var(--lapis);stroke-width:1.5' }, G2);
    tx({ x: X1, y: 342, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--lapis)' }, 'milhões de anos atrás', G2);
    /* ===== painel ===== */
    var px = 404;
    var fase = tx({ x: px, y: 38, style: 'font-size:18px;font-weight:700;fill:var(--tinta)' });
    var L = [0, 1, 2, 3, 4, 5].map(function (k) { return tx({ x: px, y: 64 + k * 19, style: 'font-size:13.5px;fill:var(--tinta)' }); });
    var TXT = {
      ler: ['Como ler um cladograma', ['pontas = grupos de hoje;', 'cada bifurcação (nó) é um', 'ancestral comum. Lê-se da', 'base (mais antiga) para as', 'pontas.']],
      noto: ['Uma novidade num ramo', ['a notocorda surgiu neste ramo:', 'todos os grupos ACIMA dela a', 'herdaram. A estrela-do-mar', 'saiu antes: não tem notocorda.']],
      pul: ['Pulmões', ['acima da tainha: sapo, tamanduá,', 'crocodilo e tico-tico têm', 'pulmões; a tainha (peixe)', 'fica de fora.']],
      amn: ['Âmnio', ['o ovo com âmnio veio depois:', 'tamanduá, crocodilo e tico-tico;', 'o sapo fica de fora.']],
      fim: ['Pelo e ovo com casca', ['marca num ramo de uma ponta só', 'vale para aquele grupo: pelo,', 'só no tamanduá. Ovo com casca:', 'crocodilo e tico-tico.']],
      tempo: ['Árvore no tempo', ['cada barra = época em que a', 'espécie viveu. A linha verde', 'varre o tempo e acende quem', 'vivia naquele instante.']],
      fecho: ['Por isso', qid === 'P23b5e48' ? ['cada marca vale para quem está', 'acima dela, na ordem:', '*I notocorda, II pulmão,', '*III âmnio, IV pelo,', '*V ovo com casca: resposta A'] : ['há 60 mil anos acendem juntos', 'as barras de', '*H. sapiens e H. neanderthalensis:', '*foram contemporâneos.', '*A resposta é D.']]
    };
    return function (t) {
      var k = t < S1 ? 'ler' : t < S2 ? 'noto' : t < S2 + 1 ? 'pul' : t < S2 + 2 ? 'amn' : t < S3 ? 'fim' : t < S4 ? 'tempo' : 'fecho';
      fase.textContent = TXT[k][0];
      L.forEach(function (e, i) { var s = TXT[k][1][i] || '', f = s.charAt(0) === '*'; e.textContent = f ? s.slice(1) : s; e.style.fontWeight = f ? 700 : 400; e.style.fill = f ? 'var(--ad-t)' : 'var(--tinta)'; });
      var o1 = t < S3 ? 1 : 1 - cl((t - S3) / .4), o2 = t < S3 ? 0 : cl((t - S3) / .4);
      if (qid === 'P23b5e48' && t >= S4) { o2 = 1 - cl((t - S4) / .4); o1 = 1 - o2; }
      vis(G1, o1); vis(G2, o2);
      var nv = t < S1 ? 0 : t < S2 ? 1 : t < S2 + 1 ? 2 : t < S2 + 2 ? 3 : 5;
      NOV.forEach(function (m, i) { vis(m.g, i < nv ? 1 : 0); });
      vis(exp, t < S1 ? 1 : 0); vis(base, 1);
      var donos = nv === 0 ? [0, 1, 2, 3, 4, 5] : nv === 5 ? [3, 4, 5] : NOV[nv - 1].dono;
      TIP.forEach(function (p, i) {
        var tem = donos.indexOf(i) >= 0, cor = nv === 0 ? 'var(--tinta)' : tem ? VD : CINZA;
        if (nv === 5) cor = (i === 3 || i === 4 || i === 5) ? VD : CINZA;
        if (k === 'fecho') { cor = 'var(--tinta)'; tem = false; }
        p.ln.style.stroke = cor; p.tx.style.fill = cor; p.tx.style.fontWeight = tem && nv ? 700 : 400;
        if (p.tx2) { p.tx2.style.fill = cor; p.tx2.style.fontWeight = p.tx.style.fontWeight; }
      });
      /* tempo */
      var m = t < S3 + .4 ? 4 : t < S4 ? 4 - 3.94 * cl((t - S3 - .4) / 2.6) : .06;
      var xl = ax(m); linha.setAttribute('x1', xl.toFixed(1)); linha.setAttribute('x2', xl.toFixed(1));
      linhaT.setAttribute('x', Math.min(xl, 300).toFixed(1)); linhaT.style.textAnchor = 'start';
      linhaT.textContent = m >= 1 ? 'há ' + m.toFixed(1).replace('.', ',') + ' milhões de anos' : 'há ' + Math.round(m * 1000) + ' mil anos';
      BAR.forEach(function (b) { var viva = m <= b.a && m >= b.b; b.r.style.fill = viva ? VD : 'color-mix(in srgb,var(--tinta) 22%,transparent)'; b.t.style.fill = viva ? VD : 'var(--lapis)'; b.t.style.fontWeight = viva ? 700 : 400; });
    };
  }
};
VIS.liga('cladograma-leitura', ['P23b5e48', 'P10a1825']);
