/* Coloracao H&E em etapas: hematoxilina (+) gruda nos fosfatos (-) dos acidos nucleicos (nucleo roxo, basofilo);
   eosina (-) gruda nas proteinas (+) do citoplasma (rosa); a lamina real; a resposta (Santa Casa 2024, P0dcd967). */
VIS.def['coloracao-he-basofilia'] = {
  tit: 'Coloração H&E: por que o núcleo fica roxo',
  fontes: ['Wikipedia (en), Basophilic (corante básico catiônico liga-se aos fosfatos do DNA no núcleo e aos ribossomos; eosina, aniônica, cora estruturas com cargas positivas) — https://en.wikipedia.org/wiki/Basophilic', 'Wikipedia (en), H&E stain (hematoxilina cora o núcleo de azul-arroxeado; eosina cora citoplasma e matriz de rosa) — https://en.wikipedia.org/wiki/H%26E_stain'],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Corante básico'], [2.6, '2. Quem é ácido?'], [5.6, '3. Eosina'], [8.6, '4. Na lâmina']],
  cred: 'Animação feita para o app (esquema fora de escala). Foto da etapa 4: epitélio do esôfago corado por H&E (estratificado pavimentoso não queratinizado, o mesmo tipo da mucosa da bochecha), recortada e ampliada. Samir (en.wikipedia), CC BY-SA 3.0, via Wikimedia Commons ("Tinción hematoxilina-eosina.jpg").',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mix(c1, c2, u) { var a = [1, 3, 5].map(function (i) { return parseInt(c1.substr(i, 2), 16); }), b = [1, 3, 5].map(function (i) { return parseInt(c2.substr(i, 2), 16); }); return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * u); }).join(',') + ')'; }
    var S = { fase: 'font-size:21px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14px;fill:var(--tinta)', mini: 'font-size:13px;fill:var(--lapis)' };
    var ROXO = '#5b3a8c', ROSA = '#c2416e';
    svg.setAttribute('viewBox', '0 0 640 330');
    var sem = 3; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    /* ---------- celula da bochecha (esquema) ---------- */
    var gC = el('g', {});
    var CX = 196, CY = 196;
    var cit = el('path', { d: 'M70 190 L104 112 L214 96 L312 128 L338 214 L282 286 L150 294 L84 258 Z', style: 'stroke:#9a8f9e;stroke-width:2' }, gC);
    var nuc = el('ellipse', { cx: CX, cy: CY, rx: 40, ry: 30, style: 'stroke:#6f6478;stroke-width:2' }, gC);
    var nucl = el('circle', { cx: CX + 10, cy: CY - 6, r: 8 }, gC);
    var tN = tx(CX, CY + 52, 'núcleo', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', gC);
    var tC = tx(268, 268, 'citoplasma', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', gC);
    tx(72, 316, 'célula da mucosa da bochecha (esquema)', S.mini, gC);
    /* corantes */
    function ion(cor, sinal, pai) { var g = el('g', {}, pai); el('circle', { r: 8, style: 'fill:' + cor }, g); tx(0, 4.5, sinal, 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g); return g; }
    var hem = [], eos = [];
    for (var i = 0; i < 9; i++) { var a = rnd() * 2 * Math.PI, r = Math.sqrt(rnd()); hem.push({ g: ion(ROXO, '+', gC), x0: 14 + rnd() * 30, y0: 60 + rnd() * 220, x1: CX + 30 * r * Math.cos(a), y1: CY + 21 * r * Math.sin(a), d: rnd() * .5 }); }
    for (i = 0; i < 10; i++) { var px = 100 + rnd() * 220, py = 120 + rnd() * 160; if (Math.hypot((px - CX) / 52, (py - CY) / 42) < 1 || (px > 220 && px < 318 && py > 250 && py < 282) || (px > 160 && px < 232 && py > 236 && py < 262)) { i--; continue; }   /* longe do nucleo e dos rotulos */ if (eos.some(function (o) { return Math.hypot(o.x1 - px, o.y1 - py) < 24; })) { i--; continue; } eos.push({ g: ion(ROSA, '−', gC), x0: 14 + rnd() * 30, y0: 60 + rnd() * 220, x1: px, y1: py, d: rnd() * .5 }); }
    /* lupa: DNA com fosfatos (-) e proteina com cargas (+) */
    var gD = el('g', {});
    el('rect', { x: 360, y: 186, width: 268, height: 116, rx: 12, style: 'fill:var(--folha);stroke:' + ROXO + ';stroke-width:1.6' }, gD);
    tx(372, 206, 'zoom: DNA (no núcleo)', 'font-size:13px;font-weight:700;fill:' + ROXO, gD);
    el('path', { d: 'M376 262 H612', style: 'stroke:var(--tinta);stroke-width:2.2' }, gD);
    var dnaIon = [];
    for (i = 0; i < 5; i++) {
      var x = 396 + i * 48;
      el('circle', { cx: x, cy: 262, r: 10, style: 'fill:#e9e2f3;stroke:' + ROXO + ';stroke-width:1.5' }, gD);
      tx(x, 267, '−', 'font-size:15px;font-weight:700;fill:' + ROXO + ';text-anchor:middle', gD);
      var lig = el('line', { x1: x, x2: x, y1: 239, y2: 252, style: 'stroke:' + ROXO + ';stroke-width:2.2' }, gD);
      dnaIon.push({ g: ion(ROXO, '+', gD), lig: lig, x: x });
    }
    tx(372, 294, 'fosfato (−) atrai a hematoxilina (+)', 'font-size:13px;fill:var(--tinta)', gD);
    var lD = el('path', { d: 'M236 186 L360 230', style: 'stroke:' + ROXO + ';stroke-width:1.2;stroke-dasharray:4 4' });
    var gP = el('g', {});
    el('rect', { x: 360, y: 186, width: 268, height: 116, rx: 12, style: 'fill:var(--folha);stroke:' + ROSA + ';stroke-width:1.6' }, gP);
    tx(372, 206, 'zoom: proteína (no citoplasma)', 'font-size:13px;font-weight:700;fill:' + ROSA, gP);
    el('path', { d: 'M376 262 q16 -14 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0', style: 'fill:none;stroke:var(--tinta);stroke-width:2.2' }, gP);
    var protIon = [];
    for (i = 0; i < 4; i++) {
      var xx = 408 + i * 64;
      el('circle', { cx: xx, cy: 262, r: 10, style: 'fill:#fbe3ea;stroke:' + ROSA + ';stroke-width:1.5' }, gP);
      tx(xx, 267, '+', 'font-size:15px;font-weight:700;fill:' + ROSA + ';text-anchor:middle', gP);
      var lg = el('line', { x1: xx, x2: xx, y1: 239, y2: 252, style: 'stroke:' + ROSA + ';stroke-width:2.2' }, gP);
      protIon.push({ g: ion(ROSA, '−', gP), lig: lg, x: xx });
    }
    tx(372, 294, 'cargas (+) atraem a eosina (−)', 'font-size:13px;fill:var(--tinta)', gP);
    var lP = el('path', { d: 'M300 220 L360 236', style: 'stroke:' + ROSA + ';stroke-width:1.2;stroke-dasharray:4 4' });
    /* ---------- etapa 4: lamina real com rotulos ---------- */
    var gF = el('g', {});
    var IX = 8, IY = 14, K = .6;
    var defs = el('defs', {}, gF), cp = el('clipPath', { id: 'he-clip2' }, defs); el('rect', { x: IX, y: IY, width: 384, height: 288, rx: 10 }, cp);
    var im = el('image', { x: IX, y: IY, width: 384, height: 288, 'clip-path': 'url(#he-clip2)', preserveAspectRatio: 'xMidYMid slice' }, gF);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'vis/coloracao-he-basofilia-1.webp'); im.setAttribute('href', 'vis/coloracao-he-basofilia-1.webp');
    function rot(alvo, bx, by, l1, l2, cor) {
      var a = [IX + alvo[0] * K, IY + alvo[1] * K], w = Math.max(l1.length, l2.length) * 7.4 + 16;
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:#fff;stroke-width:3.5' }, gF);
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:' + cor + ';stroke-width:2' }, gF);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by + (by > a[1] ? 0 : 40), style: 'stroke:#fff;stroke-width:4' }, gF);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by + (by > a[1] ? 0 : 40), style: 'stroke:' + cor + ';stroke-width:2' }, gF);
      el('rect', { x: bx, y: by, width: w, height: 40, rx: 7, style: 'fill:rgba(255,255,255,.93);stroke:' + cor + ';stroke-width:1.5' }, gF);
      tx(bx + 8, by + 17, l1, 'font-size:13.5px;font-weight:700;fill:' + cor, gF);
      tx(bx + 8, by + 34, l2, 'font-size:13px;fill:#333', gF);
    }
    rot([327, 107], 18, 86, 'núcleo', 'roxo: hematoxilina', ROXO);
    rot([396, 287], 236, 236, 'citoplasma', 'rosa: eosina', ROSA);
    rot([180, 318], 24, 236, 'núcleo', 'roxo: hematoxilina', ROXO);
    /* painel */
    var px = 404;
    var fase = tx(px, 34, '', S.fase), L = [0, 1, 2, 3, 4, 5].map(function (i) { return tx(px, 60 + i * 19, '', S.sub); });
    var resp = tx(px, 214, '', 'font-size:15px;font-weight:700;fill:' + ROXO), resp2 = tx(px, 234, '', 'font-size:15px;font-weight:700;fill:' + ROXO);
    return function (t) {
      var e = t < 2.6 ? 0 : t < 5.6 ? 1 : t < 8.6 ? 2 : 3;
      op(gC, e < 3 ? 1 : 0); op(gF, e === 3 ? 1 : 0); op(gD, e === 1 ? 1 : 0); op(lD, e === 1 ? 1 : 0); op(gP, e === 2 ? 1 : 0); op(lP, e === 2 ? 1 : 0);
      var un = e === 0 ? 0 : ease((t - 3.4) / 1.6), uc = e < 2 ? 0 : ease((t - 6.4) / 1.6);
      if (e === 3) { un = 1; uc = 1; }
      nuc.style.fill = mix('#e4e1e6', '#6a4a9c', un); nucl.style.fill = mix('#d6d2da', '#3d2466', un);
      cit.style.fill = mix('#f1eff2', '#f0b3c4', uc);
      /* hematoxilina: entra (etapa 1) e gruda no nucleo (etapa 2) */
      hem.forEach(function (h) {
        var w = ease((t - .3 - h.d) / 1.8), g = ease((t - 2.8 - h.d) / 1.4);
        var x = e === 0 ? lerp(h.x0, h.x0 + 60, w) : lerp(h.x0 + 60, h.x1, g), y = e === 0 ? h.y0 : lerp(h.y0, h.y1, g);
        h.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); op(h.g, e === 0 ? w : e === 1 ? 1 : .0);
      });
      eos.forEach(function (h) {
        var g = ease((t - 5.8 - h.d) / 1.5);
        h.g.setAttribute('transform', 'translate(' + lerp(h.x0, h.x1, g).toFixed(1) + ' ' + lerp(h.y0, h.y1, g).toFixed(1) + ')'); op(h.g, e === 2 ? cl((t - 5.7) / .3) : 0);
      });
      dnaIon.forEach(function (d, i) { var g = ease((t - 3 - i * .25) / .8); d.g.setAttribute('transform', 'translate(' + d.x + ' ' + lerp(200, 230, g).toFixed(1) + ')'); op(d.g, g > 0 ? 1 : 0); op(d.lig, g >= 1 ? 1 : 0); });
      protIon.forEach(function (d, i) { var g = ease((t - 6 - i * .3) / .8); d.g.setAttribute('transform', 'translate(' + d.x + ' ' + lerp(200, 230, g).toFixed(1) + ')'); op(d.g, g > 0 ? 1 : 0); op(d.lig, g >= 1 ? 1 : 0); });
      op(tC, 1);
      var P;
      if (e === 0) P = ['1. Corante básico', ['A hematoxilina age como corante', 'básico: tem carga positiva (+).', 'Cargas opostas se atraem: ela vai', 'grudar no que for ácido (−).', '', '']];
      else if (e === 1) P = ['2. Quem é ácido?', ['DNA e RNA são ácidos nucleicos:', 'cada fosfato tem carga (−). Eles', 'se concentram no núcleo (cromatina', 'e nucléolo). A hematoxilina gruda', 'ali: o núcleo fica azul-arroxeado.', 'Por isso ele é chamado basófilo.']];
      else if (e === 2) P = ['3. Eosina', ['A eosina é um corante ácido (−).', 'Gruda nas cargas (+) das proteínas', 'do citoplasma (e do colágeno):', 'o citoplasma fica rosa,', 'acidófilo.', '']];
      else P = ['4. Na lâmina real', ['Núcleos roxos, citoplasma rosa.', 'Citoesqueleto e retículo liso são', 'proteína e membrana, sem fosfatos', 'de ácido nucleico concentrados.', '', '']];
      fase.textContent = P[0]; L.forEach(function (x, i) { x.textContent = P[1][i]; });
      resp.textContent = e === 3 ? 'Por isso a resposta é B:' : ''; resp2.textContent = e === 3 ? 'o núcleo.' : '';
    };
  }
};
VIS.liga('coloracao-he-basofilia', ['P0dcd967']);
