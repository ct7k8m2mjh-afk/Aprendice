/* Espermatogênese x ovogênese, etapa por etapa: células, ploidia, pausas da ovogênese e rendimento */
VIS.def['gametogenese'] = {
  tit: 'Espermatogênese e ovogênese, etapa por etapa',
  tipo: 'anim', dur: 13,
  marcas: [[0, 'Mitoses'], [2.2, 'Crescimento'], [4.4, 'Meiose I'], [6.6, 'Meiose II'], [9.4, 'Rendimento']],
  fontes: ['OpenStax Biology 2e, 43.3 Human Reproductive Anatomy and Gametogenesis — https://openstax.org/books/biology-2e/pages/43-3-human-reproductive-anatomy-and-gametogenesis'],
  cred: 'Animação feita para o app (fora de escala).',
  nota: 'A linha só anda para a direita: uma célula que trava numa etapa não gera nenhuma das seguintes. Na mulher heterozigota Dd, o único óvulo leva D ou d, nunca os dois. No dia a dia se chama de óvulo a célula liberada na ovulação, mas ela é um ovócito II.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg', CUR = svg;
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || CUR).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: 'text-anchor:middle;' + (st || '') }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function quebra(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    svg.setAttribute('viewBox', '0 0 640 450');
    var PQ = {"P042315a": "N, o óvulo, só se forma depois que o espermatozoide fecunda L, o ovócito II: alternativa D.", "P121e03d": "Meiose travada no zigóteno: o sêmen tem as secreções da próstata e das glândulas seminais, mas nenhum espermatozoide. Alternativa A.", "W3549197": "A precursora do gameta feminino é a ovogônia, no começo da linha: alternativa E.", "W6722658": "Espermatogônia → espermatócito I → espermatócito II → espermátide → espermatozoide: alternativa E.", "Wd0ccaee": "100 espermátides → 100 espermatozoides; 100 espermatócitos I → 400: alternativa C.", "W076e1da": "Uma ovogônia Dd forma um só óvulo, que leva D ou d: alternativa E."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)', ADT = 'fill:var(--ad-t)';
    var CX = [68, 188, 308, 428, 556], FY = 16;
    function seta(x1, y1, x2, y2) {
      var a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a);
      el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - 7 * c + 4 * s).toFixed(1) + ' ' + (y2 - 7 * s - 4 * c).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 7 * c - 4 * s).toFixed(1) + ' ' + (y2 - 7 * s + 4 * c).toFixed(1), style: 'fill:none;stroke:var(--lapis);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round' });
    }
    function cel(x, y, r, cor, nuc) {
      el('circle', { cx: x, cy: y, r: r, style: 'fill:' + cor + ';stroke:#b98a7c;stroke-width:1.8' });
      if (nuc !== false) el('circle', { cx: x, cy: y, r: Math.max(3, r * .36), style: 'fill:#9b7aa6' });
    }
    function rot(c, y, nome, pl) { tx(CX[c], y, nome, 'font-size:13.5px;font-weight:600;' + TINTA); if (pl) tx(CX[c], y + 18, pl, 'font-size:14px;font-weight:700;' + ADT); }
    /* faixa que destaca a coluna da etapa atual */
    var faixa = el('rect', { y: 4, width: 118, height: 338, rx: 10, style: 'fill:var(--ad-c);opacity:.09' });
    [['Multiplicação', '(mitoses)'], ['Crescimento', ''], ['Meiose I', ''], ['Meiose II', ''], ['Espermiogênese', '(só muda a forma)']].forEach(function (h, i) {
      tx(CX[i], 18, h[0], 'font-size:14px;font-weight:700;' + TINTA); if (h[1]) tx(CX[i], 34, h[1], 'font-size:13px;' + LAP);
    });
    el('line', { x1: 8, x2: 632, y1: 44, y2: 44, style: 'stroke:var(--linha);stroke-width:1' });
    el('line', { x1: 8, x2: 632, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1' });
    el('line', { x1: 8, x2: 632, y1: 346, y2: 346, style: 'stroke:var(--linha);stroke-width:1' });
    tx(14, 122, 'HOMEM', 'font-size:13px;font-weight:700;letter-spacing:.08em;' + LAP).setAttribute('transform', 'rotate(-90 14 122)');
    tx(14, 282, 'MULHER', 'font-size:13px;font-weight:700;letter-spacing:.08em;' + LAP).setAttribute('transform', 'rotate(-90 14 282)');
    var G = [0, 1, 2, 3, 4].map(function () { return el('g', {}); });
    var CS = '#e8eef8', CO = '#fbe9e4', Y4 = [62, 88, 114, 140];
    /* coluna 0 */
    CUR = G[0];
    var gE0 = el('g', {}); CUR = gE0; cel(CX[0], 101, 15, CS); CUR = G[0]; rot(0, 170, 'espermatogônia', '2n');
    var mit = [0, 1, 2, 3].map(function () { var g = el('g', {}); el('circle', { r: 11, style: 'fill:' + CS + ';stroke:#b98a7c;stroke-width:1.6' }, g); el('circle', { r: 4, style: 'fill:#9b7aa6' }, g); return g; });
    var mitT = tx(CX[0], 52, '', 'font-size:13px;font-weight:600;' + ADT);
    cel(CX[0], 250 + FY, 15, CO); rot(0, 300 + FY, 'ovogônia', '2n');
    /* coluna 1 */
    CUR = G[1];
    seta(CX[0] + 20, 101, CX[1] - 24, 101); cel(CX[1], 101, 19, CS); rot(1, 170, 'espermatócito I', '2n');
    seta(CX[0] + 20, 250 + FY, CX[1] - 31, 250 + FY); cel(CX[1], 250 + FY, 27, CO); rot(1, 300 + FY, 'ovócito I', '2n');
    var trava = tx(CX[1], 52, 'trava aqui → nada à direita', 'font-size:13px;font-weight:700;fill:#b4442f', G[1]);
    /* coluna 2 */
    CUR = G[2];
    seta(CX[1] + 22, 94, CX[2] - 18, 80); seta(CX[1] + 22, 108, CX[2] - 18, 122);
    cel(CX[2], 79, 14, CS); cel(CX[2], 123, 14, CS); rot(2, 170, 'espermatócito II', 'n');
    seta(CX[1] + 31, 250 + FY, CX[2] - 31, 250 + FY);
    var gOv2 = el('g', {}); cel(CX[2] - 4, 250 + FY, 26, CO); CUR = G[2];
    el('path', { d: 'M' + (CX[1] + 26) + ' ' + (236 + FY) + ' Q' + (CX[2] - 30) + ' ' + (206 + FY) + ' ' + (CX[2] + 25) + ' ' + (227 + FY) + ' M' + (CX[2] + 16) + ' ' + (220 + FY) + ' L' + (CX[2] + 25) + ' ' + (227 + FY) + ' L' + (CX[2] + 14) + ' ' + (229 + FY), style: 'fill:none;stroke:var(--lapis);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round' });
    cel(CX[2] + 34, 229 + FY, 7, '#efe3df', false);
    tx(CX[2] + 18, 214 + FY, '1º corpúsculo polar', 'font-size:13px;' + LAP);
    rot(2, 300 + FY, 'ovócito II', 'n');
    var mII = el('g', {}); tx(CX[2] + 46, 316, 'parado na', 'font-size:13px;font-weight:600;text-anchor:start;' + ADT, mII); tx(CX[2] + 46, 332, 'metáfase II', 'font-size:13px;font-weight:600;text-anchor:start;' + ADT, mII);
    /* coluna 3 */
    CUR = G[3];
    seta(CX[2] + 17, 74, CX[3] - 14, 63); seta(CX[2] + 17, 84, CX[3] - 14, 88);
    seta(CX[2] + 17, 118, CX[3] - 14, 114); seta(CX[2] + 17, 128, CX[3] - 14, 139);
    Y4.forEach(function (y) { cel(CX[3], y, 10, CS); }); rot(3, 170, 'espermátides', 'n');
    var gOvulo = el('g', {}, G[3]); CUR = gOvulo;
    el('rect', { x: CX[3] - 40, y: 207 + FY, width: 108, height: 120, rx: 8, style: 'fill:none;stroke:var(--ad-c);stroke-width:1.4;stroke-dasharray:5 4' });
    seta(CX[2] + 26, 254 + FY, CX[3] - 32, 254 + FY);
    cel(CX[3] - 8, 254 + FY, 26, CO); cel(CX[3] + 30, 226 + FY, 6, '#efe3df', false);
    tx(CX[3] + 42, 222 + FY, '2º', 'font-size:13px;text-anchor:start;' + LAP);
    rot(3, 300 + FY, 'óvulo', 'n');
    CUR = G[3];
    var esp = el('g', {}, G[3]);
    el('ellipse', { cx: 0, cy: 0, rx: 6, ry: 4, style: 'fill:#9b7aa6' }, esp); el('path', { d: 'M6 0 q6 -4 12 0 t12 0', style: 'fill:none;stroke:#7a5c85;stroke-width:1.5' }, esp);
    /* coluna 4 */
    CUR = G[4];
    Y4.forEach(function (y) {
      seta(CX[3] + 14, y, CX[4] - 34, y);
      el('ellipse', { cx: CX[4] - 22, cy: y, rx: 8, ry: 5.5, style: 'fill:#9b7aa6;stroke:#7a5c85;stroke-width:1' });
      el('path', { d: 'M' + (CX[4] - 14) + ' ' + y + ' q8 -5 16 0 t16 0 t16 0', style: 'fill:none;stroke:#7a5c85;stroke-width:1.6;stroke-linecap:round' });
    });
    rot(4, 170, 'espermatozoides', 'n'); tx(CX[4], 206, '1 → 4 gametas', 'font-size:14px;font-weight:700;' + ADT);
    el('rect', { x: CX[4] - 52, y: 222 + FY, width: 116, height: 68, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 11%,transparent)' });
    tx(CX[4] + 6, 248 + FY, '1 → 1 gameta', 'font-size:15px;font-weight:700;' + ADT);
    tx(CX[4] + 6, 268 + FY, 'os corpúsculos', 'font-size:13px;' + TINTA); tx(CX[4] + 6, 283 + FY, 'polares degeneram', 'font-size:13px;' + TINTA);
    CUR = svg;
    /* texto da etapa */
    var sT = tx(8, 366, '', 'font-size:15.5px;font-weight:700;text-anchor:start;' + TINTA);
    var sL = [0, 1, 2, 3].map(function (k) { return tx(8, 386 + k * 18, '', 'font-size:14px;text-anchor:start;' + TINTA); });
    var ETAPAS = [
      [0, '1. Multiplicação', 'Espermatogônias e ovogônias (2n) se multiplicam por mitose. Na mulher isso acontece antes do nascimento; no homem, a partir da puberdade e por toda a vida.'],
      [2.2, '2. Crescimento', 'Cada célula cresce: espermatócito I e ovócito I (2n). O ovócito I fica parado na prófase I até a ovulação. Se a meiose trava (ex.: no zigóteno), nada à direita se forma: sem espermatozoides, mas o sêmen ainda leva as secreções das glândulas.'],
      [4.4, '3. Meiose I', 'Separa os homólogos: 2 espermatócitos II (n). Na mulher a divisão é desigual: ovócito II (n) + 1º corpúsculo polar. O ovócito II é liberado na ovulação, parado na metáfase II.'],
      [6.6, '4. Meiose II', 'No homem saem 4 espermátides (n). Na mulher, a meiose II só termina se um espermatozoide entra no ovócito II: é a fecundação que destrava a divisão e forma o óvulo e o 2º corpúsculo polar.'],
      [9.4, '5. Rendimento', 'A espermátide não se divide mais, só muda de forma: 1 espermátide → 1 espermatozoide, 1 espermatócito I → 4. Na mulher, 1 ovogônia → 1 óvulo; os corpúsculos polares degeneram.'],
      [11.2, 'Por isso a resposta é', PQ[qid] || '100 espermátides → 100 espermatozoides e 100 espermatócitos I → 400; meiose travada no zigóteno: sêmen sem espermatozoides; a ovogônia Dd dá um só óvulo, D ou d; o óvulo só se forma após a fecundação do ovócito II; a sequência começa na espermatogônia (e, na mulher, na ovogônia, a precursora).']
    ].map(function (e) { return [e[0], e[1], quebra(e[2], 92)]; });

    return function (t) {
      /* mitoses da espermatogonia: 1 -> 2 -> 4, depois uma segue adiante */
      var m1 = seg(t, .3, .8), m2 = seg(t, .9, 1.4), vol = seg(t, 1.7, 2.1), emMit = t > .25 && t < 2.1;
      gE0.style.opacity = emMit ? 0 : 1;
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (d, i) { var dy = d[0] * 17 * m1 * (1 - vol), dx = d[1] * 15 * m2 * (1 - vol); mit[i].setAttribute('transform', 'translate(' + (CX[0] + dx).toFixed(1) + ' ' + (101 + dy).toFixed(1) + ')'); mit[i].style.opacity = emMit ? (i % 2 === 0 || m2 > 0 ? 1 : 0) : 0; });
      mitT.textContent = t > .3 && t < 2.1 ? (m2 > .5 ? 'mitoses: 1 → 2 → 4' : 'mitose: 1 → 2') : '';
      var col = t < 2.2 ? 0 : t < 4.4 ? 1 : t < 6.6 ? 2 : t < 9.4 ? 3 : 4;
      G.forEach(function (g, i) { var on = i === 0 ? 1 : seg(t, [0, 2.2, 4.4, 6.6, 9.4][i], [0, 2.2, 4.4, 6.6, 9.4][i] + .4); g.style.opacity = on; });
      faixa.setAttribute('x', CX[col] - 59); faixa.style.opacity = t < 11.2 ? .09 : 0;
      trava.style.opacity = t >= 2.9 && t < 4.4 ? 1 : 0;
      mII.style.opacity = t >= 4.9 && t < 8.2 ? 1 : 0;
      /* espermatozoide chega ao ovocito II e entao surge o ovulo */
      var ch = seg(t, 6.9, 8.0);
      esp.setAttribute('transform', 'translate(' + lerp(CX[3] + 60, CX[2] + 18, ch).toFixed(1) + ' ' + (262 + FY) + ')'); esp.style.opacity = t > 6.7 && t < 8.6 ? 1 : 0;
      gOvulo.style.opacity = seg(t, 8.2, 8.7);
      var E = ETAPAS[0]; ETAPAS.forEach(function (x) { if (t >= x[0]) E = x; });
      sT.textContent = E[1]; sL.forEach(function (e, k) { e.textContent = E[2][k] || ''; });
    };
  }
};
VIS.liga('gametogenese', ['P042315a', 'P121e03d', 'W3549197', 'W6722658', 'Wd0ccaee', 'W076e1da']);
