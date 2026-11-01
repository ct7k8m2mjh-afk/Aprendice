VIS.def['biomas-brasileiros-fotos'] = {
  tit: 'Biomas brasileiros: como reconhecer cada um pela paisagem',
  fontes: ['Biomas do Brasil (Wikipédia) — https://pt.wikipedia.org/wiki/Biomas_do_Brasil', 'Cerrado (Wikipédia) — https://pt.wikipedia.org/wiki/Cerrado', 'Vereda (Wikipédia) — https://pt.wikipedia.org/wiki/Vereda', 'Igapó (Wikipédia) — https://pt.wikipedia.org/wiki/Igap%C3%B3', 'Arenização (Wikipédia) — https://pt.wikipedia.org/wiki/Arenização'],
  tipo: 'anim', dur: 24.8,
  cred: 'Fotos reais do Wikimedia Commons (recortadas; a 2 com saturação reduzida): 1 "Igapó ilha do Severino Urucurituba Amazonas - panoramio (4).jpg", James Martins, CC BY 3.0; 2 "Atlantic forest.JPG", Leonardo Brito, CC BY 3.0; 3 "Grande Sertão Veredas.jpg", Vanda Viveiros de Castro, CC BY-SA 4.0; 4 "Árvore comumente encontrada no cerrado.JPG", Marcus V. Bellizzi, CC BY-SA 3.0; 5 "Caatinga - Sítio Gravatá dos Velez, Queimadas - PB .2.jpg", Trigueiro Martins, CC BY-SA 4.0; 6 "Tuiuiú no Pantanal.JPG", Ezio J. Rocha, CC BY-SA 4.0; 7 "Pampa - Copia.jpg", Gabriel Marcusso, CC BY-SA 4.0; 8 "Areal em São Francisco de Assis, RS, Brasil.jpg", Carmem Lucas Vieira, CC BY-SA 4.0. Desenhos (perfil do rio, gema) feitos para o app, fora de escala.',
  marcas: [[0, 'Amazônia'], [5.6, 'Cerrado'], [11.2, 'Caatinga'], [16.8, 'Pampa'], [22.4, 'Tabela']],
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 356');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var PX = 14, PY = 40, PW = 300, PH = 225, RX = 332, ST = 2.8;
    /* ---- fotos ---- */
    var gF = el('g', {});
    var defs = el('defs', {}, gF), cp = el('clipPath', { id: 'bioma-clip' }, defs);
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    var fotos = [];
    for (var i = 1; i <= 8; i++) fotos.push(el('image', { href: 'vis/biomas-brasileiros-fotos-' + i + '.webp', x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#bioma-clip)' }, gF));
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, gF);
    var nomeF = tx({ x: PX, y: 28, style: 'font-size:13.5px;font-weight:700;fill:var(--ad-t)' }, '', gF);
    var legF = tx({ x: PX, y: PY + PH + 18, style: 'font-size:13px;' + LAP }, '', gF);
    /* marcas numeradas sobre a foto */
    var MK = [];
    for (i = 0; i < 2; i++) {
      var g = el('g', {}, gF);
      el('circle', { r: 12, style: 'fill:#fff;stroke:var(--ad-c);stroke-width:3' }, g);
      tx({ y: 5, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:800;fill:#14532d' }, String(i + 1), g);
      MK.push(g);
    }
    /* ---- texto ---- */
    var tit = tx({ x: RX, y: 52, style: 'font-size:22px;font-weight:700;' + TXT }, '', gF);
    var L = [];
    for (i = 0; i < 5; i++) L.push(tx({ x: RX, y: 80 + i * 20, style: 'font-size:14px;' + TXT }, '', gF));
    /* ---- desenho 1: perfil do rio (terra firme, varzea, igapo) ---- */
    var gR = el('g', {}, gF);
    var chao = 'M332 200 H420 C440 200 445 236 465 236 H520 C540 236 545 270 560 270 H585 C595 270 598 304 610 304 H632 V334 H332 Z';
    var agua = el('rect', { x: 332, width: 300, style: 'fill:#7fb8de;opacity:.75' }, gR);
    el('path', { d: chao, style: 'fill:#a98c63' }, gR);
    function arv(x, y, h) { el('line', { x1: x, x2: x, y1: y, y2: y - h, style: 'stroke:#5b4630;stroke-width:2' }, gR); el('circle', { cx: x, cy: y - h, r: h * .32, style: 'fill:#3f7f3a' }, gR); }
    [345, 365, 385, 405].forEach(function (x) { arv(x, 200, 30); });
    [475, 495, 512].forEach(function (x) { arv(x, 236, 28); });
    [566, 580].forEach(function (x) { arv(x, 270, 26); });
    var nivT = tx({ x: 630, style: 'font-size:13px;font-weight:700;fill:#1d5f8f', 'text-anchor': 'end' }, '', gR);
    tx({ x: 376, y: 348, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;' + TXT }, 'terra firme', gR);
    tx({ x: 493, y: 348, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;' + TXT }, 'várzea', gR);
    tx({ x: 574, y: 348, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:700;' + TXT }, 'igapó', gR);
    /* ---- desenho 2: gema apical com pelos ---- */
    var gG = el('g', {}, gF);
    el('path', { d: 'M360 330 Q400 300 440 262', style: 'fill:none;stroke:#6b4f33;stroke-width:7;stroke-linecap:round' }, gG);
    el('path', { d: 'M436 266 Q430 236 452 214 Q470 232 462 262 Z', style: 'fill:#8aa35a;stroke:#5a6e33;stroke-width:1.5' }, gG);
    var pelos = el('path', { style: 'fill:none;stroke:#cfc6b0;stroke-width:1.4;stroke-linecap:round' }, gG);
    var dp = '';
    for (i = 0; i < 46; i++) {
      var a = i / 46, x0 = 436 + 26 * a, y0 = 264 - 50 * Math.sin(Math.PI * a) * (a < .5 ? 1 : .96), ang = -Math.PI / 2 + (a - .5) * 2.6 + (i % 3 - 1) * .25;
      dp += 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' l' + (8 * Math.cos(ang)).toFixed(1) + ' ' + (8 * Math.sin(ang)).toFixed(1) + ' ';
    }
    pelos.setAttribute('d', dp);
    tx({ x: 482, y: 226, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'gema apical', gG);
    tx({ x: 482, y: 244, style: 'font-size:13px;' + TXT }, 'pelos densos: isolam', gG);
    tx({ x: 482, y: 261, style: 'font-size:13px;' + TXT }, 'do calor do fogo e', gG);
    tx({ x: 482, y: 278, style: 'font-size:13px;' + TXT }, 'reduzem a perda', gG);
    tx({ x: 482, y: 295, style: 'font-size:13px;' + TXT }, 'de água', gG);
    el('line', { x1: 466, y1: 230, x2: 478, y2: 224, style: 'stroke:var(--lapis);stroke-width:1.2' }, gG);
    /* ---- tabela final ---- */
    var gT = el('g', {});
    tx({ x: 14, y: 30, style: 'font-size:20px;font-weight:700;' + TXT }, 'Resumo: porte da vegetação × chuva × clima', gT);
    var CX = [14, 150, 336, 496], H = ['Bioma', 'Porte', 'Chuva', 'Clima'];
    H.forEach(function (h, k) { tx({ x: CX[k], y: 62, style: 'font-size:13.5px;font-weight:700;' + LAP }, h, gT); });
    el('line', { x1: 14, x2: 626, y1: 70, y2: 70, style: 'stroke:var(--linha);stroke-width:1.5' }, gT);
    var LIN = [['Amazônia', 'arbóreo (floresta alta)', 'grande', 'equatorial'], ['Mata Atlântica', 'arbóreo', 'moderada a grande', 'tropical, subtropical'], ['Cerrado', 'árvore, arbusto e capim', 'moderada, com seca', 'tropical'], ['Caatinga', 'arbustivo, espinhos', 'pouca e irregular', 'semiárido'], ['Pantanal', 'campo e mata alagáveis', 'moderada, cheia anual', 'tropical'], ['Pampa', 'herbáceo (campo)', 'moderada', 'subtropical/temperado']];
    var rows = LIN.map(function (r, k) {
      var g = el('g', {}, gT), y = 96 + k * 38;
      r.forEach(function (c, j) { tx({ x: CX[j], y: y, style: 'font-size:14px;' + (j ? '' : 'font-weight:700;') + TXT }, c, g); });
      el('line', { x1: 14, x2: 626, y1: y + 14, y2: y + 14, style: 'stroke:var(--linha);stroke-width:1' }, g);
      return g;
    });
    /* ---- etapas ---- */
    var E = [
      { f: 0, n: 'Foto 1 · Amazônia (AM)', leg: 'igapó à beira de rio', t: 'Amazônia', l: ['floresta equatorial: alta e densa,', 'quente e chuvosa o ano todo', '1 igapó: mata alagada quase sempre', 'a cheia dos rios define 3 matas:'], m: [[150, 125]] },
      { f: 1, n: 'Foto 2 · Mata Atlântica (PE)', leg: 'interior da mata', t: 'Mata Atlântica', l: ['floresta da costa, úmida pela chuva', 'que vem do oceano; restam fragmentos', '1 sub-bosque denso, plantas de sombra', '2 árvores altas e muitas camadas'], m: [[232, 105], [60, 45]] },
      { f: 2, n: 'Foto 3 · Cerrado (MG)', leg: 'vereda no Grande Sertão Veredas', t: 'Cerrado', l: ['savana do Brasil central, tropical,', 'com estação seca bem marcada', '1 buriti: só cresce em solo encharcado', '2 em volta: capim, arbustos e árvores', 'mosaico de 3 portes, não só capim'], m: [[204, 110], [90, 190]] },
      { f: 3, n: 'Foto 4 · Cerrado (SP)', leg: 'árvore tortuosa do cerrado', t: 'Cerrado: fogo e seca', l: ['1 casca grossa e fendida, como', 'cortiça: isola do calor do fogo', 'raízes profundas alcançam a água', 'folhas duras; gemas com pelos:'], m: [[132, 96]] },
      { f: 4, n: 'Foto 5 · Caatinga (PB)', leg: 'caatinga na estação seca', t: 'Caatinga', l: ['semiárido: pouca chuva, irregular', '1 na seca perde as folhas', '   (caducifólia): economiza água', 'arbustos e árvores baixas, espinhos;', 'cactos guardam água'], m: [[150, 85]] },
      { f: 5, n: 'Foto 6 · Pantanal (MS)', leg: 'área alagada com aguapés', t: 'Pantanal', l: ['planície que alaga todo ano:', 'os rios transbordam na cheia', '1 tuiuiú, a ave símbolo', '2 aguapé, planta aquática flutuante', 'jacaré, piranha; gado no campo'], m: [[186, 44], [96, 150]] },
      { f: 6, n: 'Foto 7 · Pampa (RS)', leg: 'campo nativo em Bagé', t: 'Pampa', l: ['extremo sul (RS): subtropical, com', 'inverno frio (a tabela diz temperado)', '1 campo: capins e ervas,', '   sem floresta contínua', 'chuva moderada, bem distribuída'], m: [[160, 150]] },
      { f: 7, n: 'Foto 8 · Pampa (RS)', leg: 'areal em São Francisco de Assis', t: 'Pampa: arenização', l: ['1 areal: areia exposta no campo', 'sem a cobertura de capim, vento e', 'chuva espalham a areia do solo', 'não é desertificação: ali chove', 'bastante (o clima não é seco)'], m: [[150, 92]] }
    ];
    return function (t) {
      var tab = t >= 8 * ST;
      gF.style.display = tab ? 'none' : ''; gT.style.display = tab ? '' : 'none';
      if (tab) { rows.forEach(function (r, k) { r.style.opacity = cl((t - 8 * ST - .15 - k * .22) / .25).toFixed(2); }); return; }
      var k = Math.min(7, Math.floor(t / ST)), u = (t - k * ST) / ST, e = E[k];
      fotos.forEach(function (f, i) { f.style.opacity = i === e.f ? 1 : 0; });
      nomeF.textContent = e.n; legF.textContent = e.leg;
      tit.textContent = e.t;
      L.forEach(function (l, i) { l.textContent = e.l[i] || ''; l.style.fontWeight = /^\d /.test(e.l[i] || '') ? '700' : '400'; });
      MK.forEach(function (m, i) {
        var p = e.m[i];
        if (!p) { m.style.display = 'none'; return; }
        m.style.display = ''; m.style.opacity = cl((u - .12 - i * .15) / .1).toFixed(2);
        m.setAttribute('transform', 'translate(' + (PX + p[0]) + ' ' + (PY + p[1]) + ')');
      });
      gR.style.display = k === 0 ? '' : 'none'; gG.style.display = k === 3 ? '' : 'none';
      if (k === 0) {
        var c = .5 - .5 * Math.cos(Math.PI * 2 * cl((u - .2) / .8)), nv = 257 - 38 * c;
        agua.setAttribute('y', nv.toFixed(1)); agua.setAttribute('height', (334 - nv).toFixed(1));
        nivT.setAttribute('y', (nv - 5).toFixed(1)); nivT.textContent = c > .5 ? 'cheia' : 'seca';
      }
      if (k === 3) gG.style.opacity = cl((u - .2) / .2).toFixed(2);
    };
  }
};
VIS.liga('biomas-brasileiros-fotos', ['P9e970f3', 'P2f55a19', 'P1ab4a91', 'Pcb6e094', 'Pe9cd4ec', 'Wd24b850']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['biomas-brasileiros-fotos'], m0 = V.monta, D0 = V.dur, R = {
    'P9e970f3': ['D', 'I Mata Atlântica, II Pampas, III Amazônia, IV Cerrado:', 'II é o único herbáceo e temperado; IV tem os três portes.'],
    'P2f55a19': ['D — Pampa', 'Campo nativo + areais (arenização) no Rio Grande do Sul', '= Pampa.'],
    'P1ab4a91': ['C', 'Buriti/vereda = Cerrado, com pouca área sob proteção integral', '(B erra: o Cerrado não é só herbáceo).'],
    'Pcb6e094': ['E — Pantanal', 'Planície alagada + tuiuiú + aguapé + gado', '= Pantanal.'],
    'Pe9cd4ec': ['E — Amazônico', 'Terra firme, várzea e igapó dependem da cheia dos', 'grandes rios: são matas da Amazônia.'],
    'Wd24b850': ['D', 'Gemas apicais com pelos densos protegem do calor', 'do fogo e da perda de água na seca.']
  };
  V.dur = D0 + 2.6; V.marcas = V.marcas.concat([[D0, 'Resposta']]);
  V.monta = function (svg, qid) {
    var d = m0(svg, qid), NS = 'http://www.w3.org/2000/svg', r = R[qid];
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    var g = el('g', { style: 'display:none' });
    el('rect', { x: 0, y: 0, width: 640, height: 360, style: 'fill:var(--folha);opacity:.86' }, g);
    el('rect', { x: 36, y: 92, width: 568, height: 168, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, g);
    var t0 = el('text', { x: 60, y: 128, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, g);
    var t1 = el('text', { x: 60, y: 162, style: 'font-size:23px;font-weight:700;fill:var(--ad-t)' }, g);
    var t2 = el('text', { x: 60, y: 202, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    var t3 = el('text', { x: 60, y: 226, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    t0.textContent = 'Por isso, a resposta é';
    if (r) { t1.textContent = r[0]; t2.textContent = r[1]; t3.textContent = r[2] || ''; }
    return function (t) {
      if (t < D0) { g.style.display = 'none'; d(t); return; }
      d(D0 - .35); g.style.display = r ? '' : 'none';
      g.style.opacity = Math.min(1, (t - D0) / .3).toFixed(2);
    };
  };
})();
