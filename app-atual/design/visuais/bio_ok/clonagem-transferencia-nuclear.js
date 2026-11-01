/* Clonagem por transferência nuclear: o procedimento passo a passo e de onde vem cada DNA */
VIS.def['clonagem-transferencia-nuclear'] = {
  tit: 'Clonagem por transferência nuclear: de onde vem cada DNA',
  tipo: 'anim', dur: 13,
  marcas: [[0, 'Núcleo'], [2.4, 'Óvulo'], [4.8, 'Embrião'], [7.4, 'Gestação'], [9.6, 'DNA do clone']],
  fontes: ['OpenStax Biology 2e, 17.1 Biotechnology (clonagem reprodutiva) — https://openstax.org/books/biology-2e/pages/17-1-biotechnology', 'Wilmut I. e cols., Viable offspring derived from fetal and adult mammalian cells, Nature 385:810 (1997) — https://doi.org/10.1038/385810a0'],
  cred: 'Animação feita para o app (esquema fora de escala).',
  nota: 'É o método da ovelha Dolly. Editar genes no núcleo do doador antes da transferência muda o clone e a prole dele, porque as edições passam a estar em todas as células, inclusive nas que formam gametas; o óvulo e a fêmea que gesta não alteram as características nucleares.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function quebra(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PQ = {"Peaaa72a": "Os núcleos são de lobo moderno editado e as edições passam à prole: ela se parece com lobos modernos modificados. Alternativa D.", "Wa10791c": "100% dos genes nucleares de Booger, 100% dos mitocondriais da doadora do óvulo e nada da fêmea que gestou: alternativa A.", "P12f78fa": "Os clones têm o genoma do doador e, com ele, a mesma suscetibilidade a doenças: alternativa C."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)', NUC = '#e08a2e', MIT = '#4f9a5c', CIT = '#fbeee6', MID = 'text-anchor:middle;';
    function mitos(pai, cx, cy, r, op) {
      [[-.55, -.3, 20], [.45, -.5, -30], [.55, .35, 15], [-.35, .55, -20], [.05, .72, 0], [-.7, .2, 60]].forEach(function (m) {
        el('ellipse', { cx: cx + m[0] * r, cy: cy + m[1] * r, rx: 6, ry: 3, transform: 'rotate(' + m[2] + ' ' + (cx + m[0] * r) + ' ' + (cy + m[1] * r) + ')', style: 'fill:' + MIT + ';opacity:' + (op || 1) }, pai);
      });
    }
    var gP = el('g', {});   /* procedimento */
    /* doador */
    var DX = 70, DY = 70;
    el('circle', { cx: DX, cy: DY, r: 32, style: 'fill:' + CIT + ';stroke:#b98a7c;stroke-width:2' }, gP); mitos(gP, DX, DY, 24, .3);
    tx(DX, 122, 'célula do doador', 'font-size:13.5px;font-weight:700;' + MID + 'fill:' + NUC, gP);
    tx(DX, 139, '(ex.: da orelha)', 'font-size:13px;' + MID + LAP, gP);
    /* ovulo da doadora */
    var OX = 70, OY = 236;
    var gO = el('g', {}, gP); el('circle', { cx: OX, cy: OY, r: 38, style: 'fill:' + CIT + ';stroke:#b98a7c;stroke-width:2' }, gO); mitos(gO, OX, OY, 30);
    var gOl = el('g', {}, gP); tx(OX, 294, 'óvulo da doadora', 'font-size:13.5px;font-weight:700;' + MID + 'fill:' + MIT, gOl);
    tx(OX, 311, '(mitocôndrias ficam)', 'font-size:13px;' + MID + LAP, gOl);
    var nucO = el('circle', { r: 11, style: 'fill:#9b7aa6' }, gP);
    var pip = el('path', { style: 'fill:none;stroke:#7f8a96;stroke-width:3;stroke-linecap:round' }, gP);
    /* celula reconstruida -> embriao */
    var RX = 230, RY = 150;
    var gR = el('g', {}, gP);
    var recon = el('circle', { cx: RX, cy: RY, r: 38, style: 'fill:' + CIT + ';stroke:#b98a7c;stroke-width:2' }, gR); mitos(gR, RX, RY, 30);
    var rTxt = tx(RX, RY + 60, '', 'font-size:13.5px;font-weight:600;' + MID + TINTA, gP);
    var choque = el('path', { d: 'M' + (RX + 46) + ' ' + (RY - 40) + ' l-10 16 l10 0 l-12 18', style: 'fill:none;stroke:#e0a526;stroke-width:3;stroke-linejoin:round' }, gP);
    var emb = [[-11, -11], [11, -11], [-11, 11], [11, 11]].map(function (d) { var g = el('g', {}, gP); el('circle', { r: 12, style: 'fill:' + CIT + ';stroke:#b98a7c;stroke-width:1.5' }, g); el('circle', { r: 5, style: 'fill:' + NUC }, g); return [g, d]; });
    var nucD = el('circle', { r: 13, style: 'fill:' + NUC }, gP);   /* nucleo do doador que viaja */
    /* utero */
    var UX = 300, UY = 286, gU = el('g', {}, gP);
    el('path', { d: 'M' + (UX - 44) + ' ' + (UY - 22) + ' Q' + UX + ' ' + (UY - 40) + ' ' + (UX + 44) + ' ' + (UY - 22) + ' Q' + (UX + 46) + ' ' + (UY + 14) + ' ' + (UX + 14) + ' ' + (UY + 28) + ' L' + (UX + 9) + ' ' + (UY + 44) + ' h-18 L' + (UX - 14) + ' ' + (UY + 28) + ' Q' + (UX - 46) + ' ' + (UY + 14) + ' ' + (UX - 44) + ' ' + (UY - 22) + 'Z', style: 'fill:#f2c6c6;stroke:#c98585;stroke-width:2' }, gU);
    tx(UX - 56, UY - 4, 'fêmea que', 'font-size:13.5px;font-weight:700;text-anchor:end;fill:#b4545a', gU);
    tx(UX - 56, UY + 13, 'gesta', 'font-size:13.5px;font-weight:700;text-anchor:end;fill:#b4545a', gU);
    emb.forEach(function (e) { gP.appendChild(e[0]); });   /* embriao por cima do utero */
    /* contabilidade */
    var gK = el('g', {});
    tx(16, 34, 'DNA do clone', 'font-size:17px;font-weight:700;' + TINTA, gK);
    var barras = [['DNA do núcleo', NUC, 1, '100% do doador do núcleo'], ['DNA das mitocôndrias', MIT, 1, '100% da doadora do óvulo'], ['da fêmea que gestou', '#b4545a', 0, 'nenhum gene']].map(function (r, i) {
      var y = 66 + i * 64;
      tx(16, y, r[0], 'font-size:14px;font-weight:600;' + TINTA, gK);
      el('rect', { x: 16, y: y + 8, width: 250, height: 14, rx: 7, style: 'fill:color-mix(in srgb,var(--tinta) 9%,transparent)' }, gK);
      var b = el('rect', { x: 16, y: y + 8, height: 14, rx: 7, style: 'fill:' + r[1] }, gK);
      tx(16, y + 40, r[3], 'font-size:14px;font-weight:700;fill:' + r[1], gK);
      return [b, r[2]];
    });
    [60, 120, 180].forEach(function (x) { el('circle', { cx: x, cy: 274, r: 20, style: 'fill:' + CIT + ';stroke:#b98a7c;stroke-width:2' }, gK); el('circle', { cx: x, cy: 274, r: 9, style: 'fill:' + NUC }, gK); });
    tx(16, 316, 'clones do mesmo doador: mesmo DNA', 'font-size:14px;font-weight:600;' + TINTA, gK);
    tx(16, 334, 'nuclear, sem variabilidade entre si', 'font-size:14px;' + TINTA, gK);

    /* painel */
    var PX = 410;
    var pNome = tx(PX, 36, '', 'font-size:18px;font-weight:700;' + TINTA);
    var pL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (k) { return tx(PX, 64 + k * 20, '', 'font-size:14.5px;' + TINTA); });
    var ETAPAS = [
      [0, '1. O núcleo do doador', 'Tira-se uma célula comum do corpo do doador e aproveita-se só o núcleo, com todo o DNA nuclear (e com as edições gênicas, se houver).'],
      [2.4, '2. Um óvulo sem núcleo', 'Uma pipeta retira o núcleo do óvulo de outra fêmea. Ficam o citoplasma e as mitocôndrias, que têm DNA próprio (mtDNA) dessa doadora.'],
      [4.8, '3. Fusão e embrião', 'O núcleo do doador entra no óvulo sem núcleo; um estímulo elétrico ativa a célula, que começa a se dividir por mitose e vira um embrião.'],
      [7.4, '4. Barriga de aluguel', 'O embrião é implantado no útero de uma terceira fêmea. Ela abriga e nutre, mas não passa nenhum gene ao clone.'],
      [9.6, '5. A conta do DNA', 'DNA nuclear: 100% do doador. DNA mitocondrial: 100% da doadora do óvulo. Da fêmea que gestou: nada. Clones do mesmo doador têm o mesmo DNA nuclear.'],
      [11.6, 'Por isso a resposta é', PQ[qid] || '100% dos genes nucleares do doador e 100% dos mitocondriais da doadora do óvulo; a mesma suscetibilidade a doenças do doador; e a prole parecida com o animal do núcleo (lobo moderno editado).']
    ].map(function (e) { return [e[0], e[1], quebra(e[2], 30)]; });

    return function (t) {
      var proc = 1 - seg(t, 9.4, 9.8), cont = seg(t, 9.6, 10);
      gP.style.opacity = proc; gP.style.display = proc > 0 ? '' : 'none'; gK.style.opacity = cont; gK.style.display = cont > 0 ? '' : 'none';
      /* 1: nucleo do doador sai da celula (ate 2.4) e espera; 3: entra no ovulo reconstruido */
      var s1 = seg(t, .6, 1.8), s3 = seg(t, 5.0, 5.8);
      var nx = lerp(lerp(DX, 150, s1), RX, s3), ny = lerp(lerp(DY, 70, s1), RY, s3);
      nucD.setAttribute('cx', nx.toFixed(1)); nucD.setAttribute('cy', ny.toFixed(1));
      var div = seg(t, 6.4, 7.0); nucD.style.opacity = 1 - div;
      /* 2: pipeta retira o nucleo do ovulo */
      var p0 = seg(t, 2.6, 3.2), p1 = seg(t, 3.3, 4.3);
      var px = lerp(170, OX + 4, p0) + lerp(0, 90, p1), py = OY;
      pip.setAttribute('d', 'M' + px.toFixed(1) + ' ' + py + ' H' + (px + 90).toFixed(1)); pip.style.opacity = t > 2.5 && t < 4.6 ? 1 : 0;
      nucO.setAttribute('cx', (p1 > 0 ? px - 2 : OX).toFixed(1)); nucO.setAttribute('cy', OY); nucO.style.opacity = t < 4.3 ? 1 : 1 - seg(t, 4.3, 4.6);
      /* o ovulo vazio vira a celula reconstruida no centro */
      gR.style.opacity = 0; var mv = seg(t, 4.8, 5.3); gO.setAttribute('transform', 'translate(' + ((RX - OX) * mv).toFixed(1) + ' ' + ((RY - OY) * mv).toFixed(1) + ')'); gO.style.opacity = 1 - div; gOl.style.opacity = 1 - mv;
      choque.style.opacity = t > 5.9 && t < 6.5 ? 1 : 0;
      /* embriao: 4 celulas, depois vai para o utero */
      var im = seg(t, 7.5, 8.6);
      emb.forEach(function (e) { var x = lerp(RX, UX, im) + e[1][0] * lerp(1, .6, im), y = lerp(RY, UY - 8, im) + e[1][1] * lerp(1, .6, im); e[0].setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + lerp(1, .6, im).toFixed(2) + ')'); e[0].style.opacity = div; });
      gU.style.opacity = seg(t, 7.3, 7.7);
      rTxt.textContent = t >= 4.8 && t < 7.4 ? (t < 6.4 ? 'óvulo sem núcleo + núcleo do doador' : 'embrião (mitoses)') : '';
      /* barras */
      barras.forEach(function (b, i) { b[0].setAttribute('width', (250 * b[1] * seg(t, 10 + i * .4, 10.6 + i * .4)).toFixed(1)); });
      var E = ETAPAS[0]; ETAPAS.forEach(function (x) { if (t >= x[0]) E = x; });
      pNome.textContent = E[1]; pL.forEach(function (e, k) { e.textContent = E[2][k] || ''; });
    };
  }
};
VIS.liga('clonagem-transferencia-nuclear', ['Peaaa72a', 'Wa10791c', 'P12f78fa']);
