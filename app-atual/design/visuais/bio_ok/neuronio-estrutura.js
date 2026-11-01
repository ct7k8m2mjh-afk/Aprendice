/* Neuronio: foto real de neuronio motor da medula (esfregaco) com marcadores, esquema rotulado
   (dendritos, corpo celular, nucleo, axonio, bainha de mielina, nodulos de Ranvier, terminais),
   sentido do impulso e a diferenca entre neuronio (conduz) e glia (apoio). */
/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid). */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 2.8); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var n = r.length - 1, w = opc.w || 520, h = opc.h || 66 + 23 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 22, y: y + 36, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 22, y: y + 66 + 23 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
  };
}
var RESP = {
'W6cc3f0e': [
'Por isso a resposta é D',
'Ramos curtos = dendritos (1); parte larga = corpo celular (2), com o núcleo (3);',
'fio longo = axônio (6), coberto pela bainha de mielina (4) com vãos: nódulos (5).'
],
'We34d174': [
'Por isso a resposta é D',
'Só a membrana do neurônio conduz o impulso. Astrócito, oligodendrócito, micróglia',
'e célula de Schwann são glia: sustentam, fazem a mielina (isolam) ou defendem.'
]
};
VIS.def['neuronio-estrutura'] = {
  tit: 'Neurônio: as partes e quem conduz o impulso',
  fontes: ['OpenStax, Biology 2e, 35.1 Neurons and Glial Cells (dendritos, corpo celular, axônio, bainha de mielina, nódulos de Ranvier, terminais; astrócitos, oligodendrócitos, células de Schwann, micróglia) — https://openstax.org/books/biology-2e/pages/35-1-neurons-and-glial-cells', 'OpenStax, Anatomy and Physiology 2e, 12.2 Nervous Tissue — https://openstax.org/books/anatomy-and-physiology-2e/pages/12-2-nervous-tissue'],
  tipo: 'anim', dur: 11.4,
  marcas: [[0, '1. Foto real'], [3, '2. As partes'], [6, '3. Sentido'], [8.6, '4. Glia']],
  cred: 'Esquemas feitos para o app (fora de escala). Foto: neurônio motor da medula espinal, esfregaço, microscópio óptico; Berkshire Community College Bioscience Image Library, domínio público (CC0), via Wikimedia Commons ("Nervous Tissue Spinal Cord Motor Neuron (41850850452).jpg"), recortada.',
  nota: 'O neurônio recebe sinais pelos dendritos, integra no corpo celular (onde fica o núcleo) e envia o impulso pelo axônio até os terminais. A bainha de mielina é feita por células da glia (célula de Schwann no sistema nervoso periférico, oligodendrócito no central) e é interrompida nos nódulos de Ranvier. A glia sustenta, isola e defende; quem conduz o impulso é o neurônio.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    svg.setAttribute('viewBox', '0 0 640 360');
    var NEU = '#e9c6b5', NEUs = '#b98a74', MIE = '#f6f0de', MIEs = '#c9b47e', SIN = '#e8590c', COR = '#7b4f9a';
    var defs = el('defs', {});
    var cp = el('clipPath', { id: 'neu-cp' }, defs); el('rect', { x: 8, y: 8, width: 296, height: 222, rx: 8 }, cp);
    /* ===== etapa 1: foto ===== */
    var F = el('g', {});
    var im = el('image', { x: 8, y: 8, width: 296, height: 222, 'clip-path': 'url(#neu-cp)', preserveAspectRatio: 'xMidYMid slice' }, F);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'vis/neuronio-estrutura-1.webp'); im.setAttribute('href', 'vis/neuronio-estrutura-1.webp');
    var K = 296 / 640;
    function rot(px, py, bx, by, txt, cor, pai) {
      var a = [8 + px * K, 8 + py * K], w = txt.length * 7.3 + 14, g = el('g', {}, pai);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by > a[1] ? by : by + 22, style: 'stroke:#fff;stroke-width:4' }, g);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by > a[1] ? by : by + 22, style: 'stroke:' + cor + ';stroke-width:2' }, g);
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:#fff;stroke-width:4' }, g);
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:' + cor + ';stroke-width:2.2' }, g);
      el('rect', { x: bx, y: by, width: w, height: 22, rx: 6, style: 'fill:rgba(255,255,255,.94);stroke:' + cor + ';stroke-width:1.5' }, g);
      tx(bx + 7, by + 16, txt, 'font-size:13px;font-weight:700;fill:' + cor, g);
      return g;
    }
    var m1 = rot(320, 272, 168, 196, 'corpo celular', '#7a2e6a', F);
    var m2 = rot(405, 212, 190, 16, 'prolongamento', '#1f5f9e', F);
    var m3 = rot(119, 118, 16, 16, 'núcleo de glia', '#2e6b3a', F);
    var fx = el('g', {}, F);
    tx(320, 30, 'Neurônio motor da medula', 'font-size:15px;font-weight:700;fill:var(--tinta)', fx);
    tx(320, 48, 'esfregaço, microscópio óptico', 'font-size:13px;fill:var(--lapis)', fx);
    tx(320, 82, 'corpo celular: a parte larga', 'font-size:13.5px;fill:var(--tinta)', fx);
    tx(320, 100, '(o núcleo fica dentro dele)', 'font-size:13.5px;fill:var(--tinta)', fx);
    tx(320, 128, 'prolongamentos: dendritos', 'font-size:13.5px;fill:var(--tinta)', fx);
    tx(320, 146, '(vários) e um axônio', 'font-size:13.5px;fill:var(--tinta)', fx);
    tx(320, 174, 'pontos escuros pequenos: núcleos', 'font-size:13.5px;fill:var(--tinta)', fx);
    tx(320, 192, 'das células da glia, em volta', 'font-size:13.5px;fill:var(--tinta)', fx);
    /* ===== etapas 2-3: esquema ===== */
    var E = el('g', {});
    var BX = 130, BY = 118;
    el('path', { d: 'M' + BX + ' ' + BY + ' L52 58 M78 79 L58 40 M' + BX + ' ' + BY + ' L34 112 M62 115 L40 92 M' + BX + ' ' + BY + ' L48 184 M76 161 L54 204 M' + BX + ' ' + BY + ' L110 46 M' + BX + ' ' + BY + ' L100 196', style: 'fill:none;stroke:' + NEUs + ';stroke-width:4.5;stroke-linecap:round' }, E);
    el('path', { d: 'M' + (BX - 30) + ' ' + BY + ' C' + (BX - 30) + ' ' + (BY - 32) + ' ' + (BX + 20) + ' ' + (BY - 40) + ' ' + (BX + 34) + ' ' + (BY - 6) + ' L' + (BX + 48) + ' ' + (BY - 4) + ' L' + (BX + 48) + ' ' + (BY + 4) + ' L' + (BX + 34) + ' ' + (BY + 6) + ' C' + (BX + 20) + ' ' + (BY + 40) + ' ' + (BX - 30) + ' ' + (BY + 32) + ' ' + (BX - 30) + ' ' + BY + ' Z', style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:2' }, E);
    el('circle', { cx: BX - 2, cy: BY, r: 13, style: 'fill:#c9a0c8;stroke:' + COR + ';stroke-width:2' }, E);
    el('circle', { cx: BX - 2, cy: BY, r: 3.5, style: 'fill:' + COR }, E);
    var AX0 = BX + 48, AX1 = 560;
    el('line', { x1: AX0, x2: AX1, y1: BY, y2: BY, style: 'stroke:' + NEUs + ';stroke-width:7' }, E);
    var NOS = [];
    for (var k = 0; k < 5; k++) { var x0 = 200 + k * 70; el('rect', { x: x0, y: BY - 14, width: 58, height: 28, rx: 13, style: 'fill:' + MIE + ';stroke:' + MIEs + ';stroke-width:1.8' }, E); NOS.push(x0 + 64); }
    el('path', { d: 'M' + AX1 + ' ' + BY + ' L596 86 M' + AX1 + ' ' + BY + ' L606 ' + BY + ' M' + AX1 + ' ' + BY + ' L596 150', style: 'fill:none;stroke:' + NEUs + ';stroke-width:4' }, E);
    [[600, 82], [611, BY], [600, 154]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 8, style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:2' }, E); });
    function leg(x1, y1, x2, y2, l1, l2, anc, pai) {
      var g = el('g', {}, pai || E);
      el('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:var(--tinta);stroke-width:1.3' }, g);
      el('circle', { cx: x1, cy: y1, r: 2.5, style: 'fill:var(--tinta)' }, g);
      var dy = y2 < y1 ? -6 : 16;
      tx(x2, y2 + dy, l1, 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:' + (anc || 'middle'), g);
      if (l2) tx(x2, y2 + dy + 16, l2, 'font-size:13px;fill:var(--lapis);text-anchor:' + (anc || 'middle'), g);
      return g;
    }
    var L = [
      leg(56, 62, 40, 30, 'dendritos', '', 'start'),
      leg(BX + 20, BY + 26, BX + 30, 212, 'corpo celular', '', 'middle'),
      leg(BX - 2, BY - 10, 170, 40, 'núcleo', '', 'start'),
      leg(229, BY - 14, 258, 62, 'bainha de mielina', '', 'start'),
      leg(NOS[1], BY - 4, 430, 62, 'nódulo de Ranvier', '', 'start'),
      leg(380, BY + 4, 380, 176, 'axônio', 'fio longo, um só', 'middle'),
      leg(606, 150, 560, 200, 'terminais', '', 'middle')
    ];
    var imp = el('circle', { r: 9, style: 'fill:' + SIN + ';opacity:.9' }, E);
    var setas = el('g', {}, E);
    tx(14, 226, 'entra pelos dendritos', 'font-size:13.5px;font-weight:700;fill:' + SIN, setas);
    tx(626, 226, 'sai pelos terminais', 'font-size:13.5px;font-weight:700;fill:' + SIN + ';text-anchor:end', setas);
    el('path', { d: 'M200 222 H440 m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:' + SIN + ';stroke-width:2.5' }, setas);
    /* ===== etapa 4: glia ===== */
    var G = el('g', {});
    var CX = 130, CY = 120;
    el('circle', { cx: CX, cy: CY, r: 80, style: 'fill:color-mix(in srgb,#9fc7a0 35%,var(--folha));stroke:#3f7a45;stroke-width:2' }, G);
    el('ellipse', { cx: CX, cy: CY - 74, rx: 20, ry: 6, style: 'fill:#5b8a5e' }, G);
    for (k = 6; k >= 0; k--) el('circle', { cx: CX, cy: CY, r: 24 + k * 6, style: 'fill:' + (k % 2 ? MIE : '#efe3c4') + ';stroke:' + MIEs + ';stroke-width:1.2' }, G);
    el('circle', { cx: CX, cy: CY, r: 22, style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:2' }, G);
    tx(CX, CY + 5, 'axônio', 'font-size:13px;font-weight:700;fill:#7a4a36;text-anchor:middle', G);
    tx(CX + 92, CY - 70, 'célula de Schwann', 'font-size:13.5px;font-weight:700;fill:#2e6b3a', G);
    tx(CX + 92, CY - 54, '(glia), com o núcleo', 'font-size:13px;fill:#2e6b3a', G);
    tx(CX + 92, CY + 4, 'voltas de membrana', 'font-size:13px;fill:var(--tinta)', G);
    tx(CX + 92, CY + 20, '= bainha de mielina', 'font-size:13px;font-weight:700;fill:var(--tinta)', G);
    tx(CX, 222, 'axônio em corte transversal', 'font-size:13px;fill:var(--lapis);text-anchor:middle', G);
    var LX = 372;
    tx(LX, 28, 'Neurônio: conduz o impulso', 'font-size:14.5px;font-weight:700;fill:var(--ad-t)', G);
    tx(LX, 46, 'pela própria membrana', 'font-size:13.5px;fill:var(--tinta)', G);
    tx(LX, 80, 'Glia: apoio (não conduz impulso)', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', G);
    [['célula de Schwann:', 'mielina no SNP'], ['oligodendrócito:', 'mielina no SNC'], ['astrócito:', 'sustenta e nutre'], ['micróglia:', 'defesa (fagocita)']].forEach(function (r, i) {
      tx(LX, 106 + i * 26, r[0], 'font-size:13.5px;font-weight:700;fill:var(--tinta)', G);
      tx(LX + 130, 106 + i * 26, r[1], 'font-size:13.5px;fill:var(--tinta)', G);
    });
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(T) { P0.textContent = T[0]; P.forEach(function (p, i) { p.textContent = T[i + 1] || ''; }); }
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 6 ? 1 : t < 8.6 ? 2 : 3;
      op(F, f === 0 ? 1 : 0); op(E, f === 1 || f === 2 ? cl((t - 3) / .3) : 0); op(G, f === 3 ? cl((t - 8.6) / .3) : 0);
      if (f === 0) { op(m1, cl((t - .4) / .3)); op(m2, cl((t - 1.0) / .3)); op(m3, cl((t - 1.6) / .3)); }
      L.forEach(function (l, i) { op(l, f === 1 ? cl((t - 3.2 - i * .3) / .3) : 0); });
      /* impulso: dendrito -> corpo -> axonio (saltando de nodulo em nodulo) -> terminais */
      if (f === 2) {
        var u = t - 6, x, y = BY;
        if (u < .5) { x = lerp(44, BX - 20, u / .5); y = lerp(108, BY, u / .5); }
        else if (u < .8) x = lerp(BX - 20, AX0, (u - .5) / .3);
        else if (u < 2.0) { var pts = [AX0, 196].concat(NOS.slice(0, 4)).concat([AX1]); var s = (u - .8) / 1.2 * (pts.length - 1), i0 = Math.min(pts.length - 2, Math.floor(s)); x = lerp(pts[i0], pts[i0 + 1], s - i0 < .25 ? (s - i0) * 4 : 1); }
        else x = lerp(AX1, 606, cl((u - 2.0) / .3));
        imp.setAttribute('cx', x.toFixed(1)); imp.setAttribute('cy', y.toFixed(1)); op(imp, 1); op(setas, cl((u - .2) / .3));
      } else { op(imp, 0); op(setas, 0); }
      if (f === 0) painel(['1. Um neurônio de verdade', 'Neurônio motor da medula: corpo celular largo e vários prolongamentos.', 'Os pontinhos escuros em volta são núcleos de células da glia, bem menores.']);
      else if (f === 1) painel(['2. As partes do neurônio', 'Dendritos: ramos curtos que recebem. Corpo celular: parte larga, com o núcleo.', 'Axônio: um fio longo, com bainha de mielina em gomos e vãos (nódulos de Ranvier).']);
      else if (f === 2) painel(['3. O sentido do impulso', 'Entra pelos dendritos, passa pelo corpo celular e sai pelo axônio.', 'Com mielina, o impulso salta de nódulo em nódulo até os terminais.']);
      else painel(['4. Quem conduz e quem ajuda', 'A mielina é feita por voltas de membrana de células da glia: ela isola, não conduz.', 'Só a membrana do neurônio propaga o impulso; a glia sustenta, isola e defende.']);
    };
    return fimResposta(VIS.def['neuronio-estrutura'], svg, _desenha, 11.4, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W6cc3f0e' ? 5.95 : 11.35; }
    });
  }
};
VIS.liga('neuronio-estrutura', ['W6cc3f0e', 'We34d174']);
