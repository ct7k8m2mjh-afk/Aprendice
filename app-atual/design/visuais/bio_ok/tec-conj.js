/* O que faz um tecido ser conjuntivo (celulas afastadas numa matriz extracelular abundante, origem no mesenquima)
   e como, mudando a matriz, saem os especializados; contraste com o epitelio. Questao W3414d13 (Urca). */
VIS.def['tec-conj'] = {
  tit: 'O que faz um tecido ser conjuntivo',
  fontes: ['OpenStax, Biology 2e, 33.2 Animal Primary Tissues (matriz = células + substância fundamental + fibras; cartilagem, osso, sangue de matriz líquida, adiposo; epitélio de células unidas) — https://openstax.org/books/biology-2e/pages/33-2-animal-primary-tissues', 'Wikipedia (en), Connective tissue (origem no mesênquima, derivado da mesoderme; fibras e substância fundamental) — https://en.wikipedia.org/wiki/Connective_tissue'],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. A receita'], [2.6, '2. Sangue'], [4.8, '3. Cartilagem e osso'], [7.6, '4. Adiposo'], [9.6, '5. Resposta']],
  cred: 'Esquema da etapa 1 feito para o app (fora de escala). Fotos de microscópio óptico, recortadas (cartilagem, adiposo e sangue corados; o osso é lâmina desgastada, sem corante): Berkshire Community College Bioscience Image Library, domínio público (CC0), via Wikimedia Commons: "Connective Tissue Adipose (41066513704).jpg", "Connective Tissue Hyaline Cartilage (26989336187).jpg", "Connective Tissue Compact Bone (41068141944).jpg" e "Connective Tissue Human Blood Leukocyte Survey (39982279720).jpg".',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var S = { fase: 'font-size:20px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14px;fill:var(--tinta)', lab: 'font-size:13px;font-weight:700;fill:var(--tinta)', mini: 'font-size:13px;fill:var(--lapis)' };
    var CON = '#8a5a2b', EPI = '#b4442f';
    svg.setAttribute('viewBox', '0 0 640 320');
    var defs = el('defs', {}), nclip = 0;
    function foto(src, x, y, w, h, pai) {
      var id = 'tc-cp-' + (++nclip), cp = el('clipPath', { id: id }, defs); el('rect', { x: x, y: y, width: w, height: h, rx: 8 }, cp);
      var im = el('image', { x: x, y: y, width: w, height: h, 'clip-path': 'url(#' + id + ')', preserveAspectRatio: 'xMidYMid slice' }, pai);
      im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src); im.setAttribute('href', src);
    }
    /* rotulo: circulo no alvo (coordenadas da foto 640x480), caixa clara e linha */
    function rot(pai, ox, oy, k, alvo, bx, by, l1, l2, cor) {
      var a = [ox + alvo[0] * k, oy + alvo[1] * k], w = Math.max(l1.length, (l2 || '').length) * 7.3 + 16, h = l2 ? 40 : 24;
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by + (by > a[1] ? 0 : h), style: 'stroke:#fff;stroke-width:4' }, pai);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by + (by > a[1] ? 0 : h), style: 'stroke:' + cor + ';stroke-width:2' }, pai);
      el('circle', { cx: a[0], cy: a[1], r: 9, style: 'fill:none;stroke:#fff;stroke-width:3.5' }, pai);
      el('circle', { cx: a[0], cy: a[1], r: 9, style: 'fill:none;stroke:' + cor + ';stroke-width:2' }, pai);
      el('rect', { x: bx, y: by, width: w, height: h, rx: 7, style: 'fill:rgba(255,255,255,.94);stroke:' + cor + ';stroke-width:1.5' }, pai);
      tx(bx + 8, by + 17, l1, 'font-size:13.5px;font-weight:700;fill:' + cor, pai);
      if (l2) tx(bx + 8, by + 34, l2, 'font-size:13px;fill:#333', pai);
    }
    var sem = 11; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    /* ========== etapa 1: a receita (esquema) ========== */
    var g1 = el('g', {});
    el('rect', { x: 8, y: 30, width: 186, height: 200, rx: 10, style: 'fill:#f7efdf;stroke:' + CON + ';stroke-width:1.5' }, g1);
    tx(101, 20, 'Conjuntivo', 'font-size:15px;font-weight:700;fill:' + CON + ';text-anchor:middle', g1);
    for (var i = 0; i < 9; i++) {   /* fibras colagenas (grossas, rosadas) e elasticas (finas, escuras) */
      var y0 = 44 + i * 21, d = 'M14 ' + y0;
      for (var k = 1; k <= 6; k++) d += ' Q' + (14 + k * 30 - 15) + ' ' + (y0 + (k % 2 ? -9 : 9) + rnd() * 6) + ' ' + (14 + k * 30) + ' ' + (y0 + rnd() * 10 - 5);
      el('path', { d: d, style: 'fill:none;stroke:' + (i % 3 ? '#e2a6a0' : '#5a4a5e') + ';stroke-width:' + (i % 3 ? 3.2 : 1.2) + ';opacity:.85' }, g1);
    }
    [[50, 70], [140, 92], [76, 150], [160, 176], [44, 206]].forEach(function (p) {   /* fibroblastos fusiformes, afastados */
      el('path', { d: 'M' + (p[0] - 22) + ' ' + p[1] + ' Q' + p[0] + ' ' + (p[1] - 9) + ' ' + (p[0] + 22) + ' ' + p[1] + ' Q' + p[0] + ' ' + (p[1] + 9) + ' ' + (p[0] - 22) + ' ' + p[1] + ' Z', style: 'fill:#c9a0c8;stroke:#7b4f7a;stroke-width:1.4' }, g1);
      el('ellipse', { cx: p[0], cy: p[1], rx: 7, ry: 4, style: 'fill:#5b3a7c' }, g1);
    });
    tx(14, 250, 'células afastadas (fibroblastos)', S.mini, g1);
    tx(14, 268, 'matriz: fibras + substância', S.mini, g1); tx(14, 284, 'fundamental entre elas', S.mini, g1);
    el('rect', { x: 206, y: 30, width: 186, height: 200, rx: 10, style: 'fill:#f6eaee;stroke:' + EPI + ';stroke-width:1.5' }, g1);
    tx(299, 20, 'Epitélio', 'font-size:15px;font-weight:700;fill:' + EPI + ';text-anchor:middle', g1);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 6; c++) {
      var x = 212 + c * 29.5 + (r % 2 ? 0 : 0), y = 40 + r * 34;
      el('rect', { x: x, y: y, width: 29.5, height: 34, style: 'fill:#efb7c6;stroke:#9c3c5a;stroke-width:1.4' }, g1);
      el('circle', { cx: x + 14.7, cy: y + 17, r: 6, style: 'fill:#5b3a7c' }, g1);
    }
    el('line', { x1: 212, x2: 389, y1: 178, y2: 178, style: 'stroke:#9c3c5a;stroke-width:3' }, g1);
    /* faixa de conjuntivo de apoio sob o epitelio: algumas fibras e um fibroblasto */
    ['M214 194 q20 -6 40 0 t40 0 t40 0 t40 0 t10 0', 'M214 212 q20 6 40 0 t40 0 t40 0 t40 0 t10 0'].forEach(function (d, i) { el('path', { d: d, style: 'fill:none;stroke:' + (i ? '#5a4a5e' : '#e2a6a0') + ';stroke-width:' + (i ? 1.2 : 3) }, g1); });
    el('path', { d: 'M318 203 Q336 195 354 203 Q336 211 318 203 Z', style: 'fill:#c9a0c8;stroke:#7b4f7a;stroke-width:1.3' }, g1); el('ellipse', { cx: 336, cy: 203, rx: 5, ry: 3, style: 'fill:#5b3a7c' }, g1);
    tx(212, 250, 'células coladas, quase sem', S.mini, g1); tx(212, 268, 'matriz; embaixo da linha já', S.mini, g1); tx(212, 284, 'é conjuntivo de apoio', S.mini, g1);
    /* ========== etapa 2: sangue ========== */
    var g2 = el('g', {}); var K = .6, OX = 8, OY = 14;
    foto('vis/tc-sangue.webp', OX, OY, 384, 288, g2);
    rot(g2, OX, OY, K, [400, 310], 210, 236, 'plasma', 'matriz líquida', CON);
    rot(g2, OX, OY, K, [348, 100], 214, 26, 'leucócito', '', '#5b3a7c');
    rot(g2, OX, OY, K, [60, 380], 18, 26, 'hemácia', '', EPI);
    /* ========== etapa 3: cartilagem e osso ========== */
    var g3 = el('g', {}), k3 = 188 / 640;
    foto('vis/tc-cartilagem.webp', 8, 30, 188, 141, g3); foto('vis/tc-osso.webp', 204, 30, 188, 141, g3);
    tx(8, 20, 'Cartilagem', 'font-size:15px;font-weight:700;fill:' + CON, g3); tx(204, 20, 'Osso', 'font-size:15px;font-weight:700;fill:' + CON, g3);
    el('circle', { cx: 8 + 459 * k3, cy: 30 + 141 * k3, r: 8, style: 'fill:none;stroke:#fff;stroke-width:3' }, g3);
    el('circle', { cx: 8 + 459 * k3, cy: 30 + 141 * k3, r: 8, style: 'fill:none;stroke:#1f4f8a;stroke-width:2' }, g3);
    el('circle', { cx: 204 + 127 * k3, cy: 30 + 240 * k3, r: 11, style: 'fill:none;stroke:#fff;stroke-width:3' }, g3);
    el('circle', { cx: 204 + 127 * k3, cy: 30 + 240 * k3, r: 11, style: 'fill:none;stroke:#1f4f8a;stroke-width:2' }, g3);
    tx(8, 192, 'condrócitos em lacunas;', S.sub, g3); tx(8, 210, 'matriz firme, sem vasos', S.sub, g3);
    tx(204, 192, 'matriz com cálcio, em anéis', S.sub, g3); tx(204, 210, 'ao redor do canal de Havers', S.sub, g3);
    tx(8, 232, 'círculo azul: um condrócito', S.mini, g3); tx(204, 232, 'círculo azul: canal de Havers', S.mini, g3);
    /* ========== etapa 4: adiposo ========== */
    var g4 = el('g', {});
    foto('vis/tc-adiposo.webp', OX, OY, 384, 288, g4);
    rot(g4, OX, OY, K, [240, 120], 120, 40, 'adipócito', 'gota de gordura (dissolveu)', CON);
    rot(g4, OX, OY, K, [352, 390], 196, 262, 'núcleo', 'empurrado para a borda', '#5b3a7c');
    /* ========== etapa 5: resposta ========== */
    var g5 = el('g', {});
    [['vis/tc-adiposo.webp', 'adiposo'], ['vis/tc-cartilagem.webp', 'cartilaginoso'], ['vis/tc-osso.webp', 'ósseo'], ['vis/tc-sangue.webp', 'sanguíneo']].forEach(function (f, i) {
      var x = 8 + (i % 2) * 196, y = 14 + Math.floor(i / 2) * 146;
      foto(f[0], x, y, 188, 136, g5);
      el('rect', { x: x + 6, y: y + 104, width: f[1].length * 8 + 16, height: 24, rx: 6, style: 'fill:rgba(255,255,255,.94);stroke:' + CON + ';stroke-width:1.4' }, g5);
      tx(x + 14, y + 121, f[1], 'font-size:13.5px;font-weight:700;fill:' + CON, g5);
    });
    /* painel */
    var px = 404;
    var fase = tx(px, 34, '', S.fase), L = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return tx(px, 60 + i * 19, '', S.sub); });
    var nao = el('g', {});
    tx(px, 192, 'Não são conjuntivos:', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', nao);
    ['musculatura (tecido muscular)', 'epiderme, glândulas exócrinas', 'revestimento das mucosas'].forEach(function (s, i) {
      var t = tx(px, 210 + i * 16, s, 'font-size:13px;fill:var(--lapis)', nao); t.style.textDecoration = 'line-through';
    });
    var resp = tx(px, 270, '', 'font-size:15px;font-weight:700;fill:' + CON), resp2 = tx(px, 288, '', 'font-size:14px;font-weight:700;fill:' + CON), resp3 = tx(px, 305, '', 'font-size:14px;font-weight:700;fill:' + CON);
    return function (t) {
      var e = t < 2.6 ? 0 : t < 4.8 ? 1 : t < 7.6 ? 2 : t < 9.6 ? 3 : 4;
      [g1, g2, g3, g4, g5].forEach(function (g, i) { op(g, i === e ? 1 : 0); });
      op(nao, e === 4 ? 1 : 0);
      var P;
      if (e === 0) P = ['1. A receita', ['Conjuntivo = células afastadas', 'numa matriz extracelular farta:', 'fibras (colágeno, elásticas) +', 'substância fundamental.', 'Todos vêm do mesênquima.', 'No epitélio é o contrário:', 'células coladas, quase sem matriz.']];
      else if (e === 1) P = ['2. Matriz líquida', ['No sangue a matriz é líquida:', 'o plasma. As células (hemácias,', 'leucócitos) ficam soltas nele,', 'separadas umas das outras.', 'Por isso o sangue é conjuntivo.', '', '']];
      else if (e === 2) P = ['3. Matriz firme e mineral', ['Na cartilagem a matriz é firme', 'e sem vasos; as células ficam em', 'lacunas. No osso a matriz recebe', 'sais de cálcio e endurece.', 'Mudou a matriz, seguem', 'conjuntivos.', '']];
      else if (e === 3) P = ['4. A exceção: adiposo', ['Células grandes cheias de', 'gordura, quase sem matriz entre', 'elas. Mesmo assim é conjuntivo:', 'vem do mesênquima, e cada', 'adipócito é envolvido por fibras', 'reticulares: há pouca matriz,', 'mas há.']];
      else P = ['5. Juntando', ['Quatro conjuntivos especializados,', 'cada um com sua matriz:', 'gordura, firme, mineral, líquida.', '', '', '', '']];
      fase.textContent = P[0]; L.forEach(function (x, i) { x.textContent = P[1][i]; });
      resp.textContent = e === 4 ? 'Por isso a resposta é B:' : ''; resp2.textContent = e === 4 ? 'adiposo, cartilaginoso,' : ''; resp3.textContent = e === 4 ? 'ósseo e sanguíneo.' : '';
    };
  }
};
VIS.liga('tec-conj', ['W3414d13']);
