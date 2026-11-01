/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid).
   R[qid] = ['Por isso a resposta é X', 'linha', ...]. Sem entrada para o qid, o visual fica como era. */
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
  if (opc.base) { h = Math.max(h, vb[3] - 226); y = vb[3] - h - 4; }
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 22, y: y + 36, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 22, y: y + 66 + 23 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;   /* quadro congelado na etapa Resposta */
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
  };
}
var RESP = {
'P6ea1150': [
'Por isso a resposta é B',
'A ferrugem anda mais rápido em meio ácido: o H⁺ também tira elétrons',
'do ferro. A água dissolve a camada de NaOH (muito solúvel) e o OH⁻',
'neutraliza o H⁺ (H⁺ + OH⁻ → H₂O): sem ácido, a oxidação fica lenta.'
],
'We0f5bb3': [
'Por isso a resposta é A',
'Ligado ao metal protegido, o de sacrifício precisa ser mais fácil',
'de oxidar (E° de redução menor): ele vira o ânodo e é consumido,',
'e o metal protegido só recebe elétrons.'
],
'W63884ef': [
'Por isso a resposta é A',
'Só o zinco (−0,76 V) tem E° menor que o ferro (−0,44 V):',
'ele oxida no lugar do tanque. Cd, Ni, Cu e Hg têm E° maior que o Fe',
'e deixariam o ferro como ânodo.'
],
'W9ac2d4c': [
'Por isso a resposta é D',
'Agora o protegido é o alumínio (−1,67 V): só o Mg (−2,38 V) fica abaixo.',
'Mg → Mg²⁺ + 2 e⁻ (×3) e Al³⁺ + 3 e⁻ → Al (×2), 6 e⁻ de cada lado:',
'3 Mg + 2 Al³⁺ → 3 Mg²⁺ + 2 Al.'
],
'W0734f1b': [
'Por isso a resposta é E',
'Galvanizar é cobrir o ferro com zinco, redutor mais forte:',
'E° do Zn (−0,76 V) é menor que o do Fe (−0,44 V). Cd, Co, Cu e Ni',
'têm E° maior que o do ferro e não o protegeriam.'
],
'W26b4c2c': [
'Por isso a resposta é C',
'O alumínio (−1,66 V) oxida e fura: é o ânodo. No aço inerte o O₂',
'se reduz: cátodo, polo positivo. ddp = 0,40 − (−1,66) = +2,06 V.'
]
};
VIS.def['corrosao-metal-sacrificio'] = {
  tit: 'Corrosão e metal de sacrifício',
  fontes: ['OpenStax, Chemistry 2e, 17.6 Corrosion (gota d’água, ferrugem, ânodo de sacrifício, galvanização) — https://openstax.org/books/chemistry-2e/pages/17-6-corrosion', 'OpenStax, Chemistry 2e, Appendix L: Standard Electrode (Half-Cell) Potentials — https://openstax.org/books/chemistry-2e/pages/l-standard-electrode-half-cell-potentials', 'Wikipedia (en), Galvanic anode — https://en.wikipedia.org/wiki/Galvanic_anode'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Ferrugem'], [3, 'Sacrifício'], [6, 'Galvanização'], [9, 'Panela'], [12, 'Foto']],
  cred: 'Foto: "2022-01-18 sacrificial galvanic anode.jpg", Springnuts, CC BY-SA 4.0, via Wikimedia Commons (redimensionada). Animação feita para o app (esquema fora de escala). E° a 25 °C do apêndice L do OpenStax, com 2 casas; as provas usam valores um pouco diferentes (Fe −0,44 V).',
  nota: 'Corrosão é oxidação: o metal perde elétrons. Dois metais em contato num meio úmido formam uma pilha, e quem tem o menor E° de redução vira ânodo e é corroído. O metal de sacrifício usa isso a favor: ele é corroído no lugar do metal que se quer proteger.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vf(v) { return (v > 0 ? '+' : '') + v.toFixed(2).replace('.', ',').replace('-', '−'); }
    var FE = '#8a9097', ZN = '#b9c3cc', FER = '#a0522d', AG = '#cfe5f5', OX = '#c0392b', RD = '#2b6cb0', EL = '#d4a017';
    var EP = { Mg: -2.372, Al: -1.662, Zn: -0.7618, Fe: -0.447, Sn: -0.1375, Cu: 0.337, O2: 0.401 };
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    function eletrons(n) { var a = []; for (var k = 0; k < n; k++) a.push(el('circle', { r: 4, style: 'fill:' + EL + ';stroke:#8a6a00;stroke-width:1' })); return a; }
    /* ===== cena 1: gota sobre o ferro ===== */
    var c1 = el('g', {});
    el('rect', { x: 40, y: 150, width: 560, height: 40, style: 'fill:' + FE + ';stroke:#5d6368;stroke-width:1.5' }, c1);
    tx(588, 182, 'ferro', 'font-size:15px;font-weight:700;fill:#fff;text-anchor:end', c1);
    el('path', { d: 'M150 150 C190 72 450 72 490 150 Z', style: 'fill:' + AG + ';stroke:#5a9ccf;stroke-width:1.5' }, c1);
    tx(320, 84, 'gota de água (com O₂ dissolvido)', 'font-size:14px;fill:#2b5f8a;text-anchor:middle', c1);
    var poco = el('path', { style: 'fill:' + AG + ';stroke:#5d6368;stroke-width:1.2' }, c1);
    var anel = [el('path', { d: 'M160 150 q8 -10 30 -16', style: 'fill:none;stroke:' + FER + ';stroke-width:6;stroke-linecap:round' }, c1), el('path', { d: 'M480 150 q-8 -10 -30 -16', style: 'fill:none;stroke:' + FER + ';stroke-width:6;stroke-linecap:round' }, c1)];
    var fe2 = [tx(0, 0, 'Fe²⁺', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:middle', c1), tx(0, 0, 'Fe²⁺', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:middle', c1)];
    var e1 = eletrons(4); e1.forEach(function (e) { c1.appendChild(e); });
    tx(320, 210, 'ânodo: Fe → Fe²⁺ + 2 e⁻', 'font-size:15px;font-weight:700;fill:' + OX + ';text-anchor:middle', c1);
    tx(16, 64, 'borda da gota (mais O₂): cátodo', 'font-size:14px;font-weight:700;fill:' + RD, c1);
    tx(16, 82, 'O₂ + 2 H₂O + 4 e⁻ → 4 OH⁻', 'font-size:15px;font-weight:700;fill:' + RD, c1);
    var ac1 = tx(624, 64, 'em meio ácido o H⁺ também', 'font-size:14px;fill:var(--tinta);text-anchor:end', c1), ac2 = tx(624, 82, 'tira e⁻: 2 H⁺ + 2 e⁻ → H₂', 'font-size:14px;fill:var(--tinta);text-anchor:end', c1);
    var fr = tx(170, 128, 'ferrugem', 'font-size:14px;font-weight:700;fill:' + FER + ';text-anchor:end', c1);
    /* ===== cena 2: metal de sacrificio ===== */
    var c2 = el('g', {});
    el('rect', { x: 16, y: 110, width: 380, height: 100, rx: 6, style: 'fill:#d9c7a7;opacity:.55' }, c2);
    tx(24, 204, 'solo úmido', 'font-size:14px;fill:#6d5a3a', c2);
    el('rect', { x: 40, y: 64, width: 190, height: 112, rx: 30, style: 'fill:' + FE + ';stroke:#5d6368;stroke-width:1.5' }, c2);
    tx(135, 124, 'tanque de aço', 'font-size:15px;font-weight:700;fill:#fff;text-anchor:middle', c2);
    tx(135, 142, '(Fe) intacto', 'font-size:14px;fill:#fff;text-anchor:middle', c2);
    el('path', { d: 'M230 100 H330 V146', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, c2);
    var zn = el('rect', { y: 146, rx: 4, style: 'fill:' + ZN + ';stroke:#7d8a96;stroke-width:1.5' }, c2);
    tx(330, 136, 'Zn ou Mg', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:start;', c2).setAttribute('x', 340);
    var zn2 = [tx(0, 0, 'Zn²⁺', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:middle', c2), tx(0, 0, 'Zn²⁺', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:middle', c2)];
    var e2 = eletrons(4); e2.forEach(function (e) { c2.appendChild(e); });
    tx(280, 92, '← e⁻', 'font-size:14px;font-weight:700;fill:#8a6a00;text-anchor:middle', c2);
    /* mini regua vertical */
    var RG = ['Cu', 'Fe', 'Zn', 'Al', 'Mg'];
    var REF = qid === 'W9ac2d4c' ? 'Al' : 'Fe';
    function YE(e) { return 50 - (e - 0.4) * 56; }
    el('line', { x1: 470, x2: 470, y1: YE(0.45), y2: YE(-2.45), style: 'stroke:var(--tinta);stroke-width:2' }, c2);
    tx(470, 36, 'E° (V)', 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle', c2);
    var RGt = {};
    RG.forEach(function (s) { var y = YE(EP[s]); el('line', { x1: 464, x2: 476, y1: y, y2: y, style: 'stroke:var(--tinta);stroke-width:1.6' }, c2); RGt[s] = tx(484, y + 5, s + '  ' + vf(EP[s]), 'font-size:14px;font-weight:700;fill:var(--tinta)', c2); });
    var chave = el('path', { d: 'M580 ' + (YE(EP[REF]) + 8) + ' h8 V' + (YE(EP.Mg) + 2) + ' h-8', style: 'fill:none;stroke:' + OX + ';stroke-width:2' }, c2);
    var chT = [tx(596, YE(REF === 'Al' ? -2.05 : -1.5), 'abaixo', 'font-size:14px;font-weight:700;fill:' + OX, c2), tx(596, YE(REF === 'Al' ? -2.05 : -1.5) + 17, 'do ' + REF, 'font-size:14px;font-weight:700;fill:' + OX, c2)];
    /* ===== cena 3: galvanizacao ===== */
    var c3 = el('g', {});
    function chapa(x, cob, corCob, nome, pai) {
      var g = el('g', {}, pai);
      el('rect', { x: x, y: 112, width: 260, height: 40, style: 'fill:' + FE + ';stroke:#5d6368;stroke-width:1.2' }, g);
      el('rect', { x: x, y: 100, width: 110, height: 12, style: 'fill:' + corCob }, g); el('rect', { x: x + 150, y: 100, width: 110, height: 12, style: 'fill:' + corCob }, g);
      el('path', { d: 'M' + (x + 110) + ' 100 V114 H' + (x + 150) + ' V100', style: 'fill:' + AG + ';stroke:#5a9ccf;stroke-width:1' }, g);
      tx(x + 130, 88, 'risco', 'font-size:14px;fill:var(--lapis);text-anchor:middle', g);
      tx(x, 52, nome, 'font-size:15px;font-weight:700;fill:var(--tinta)', g);
      tx(x + 252, 140, 'Fe', 'font-size:14px;font-weight:700;fill:#fff;text-anchor:end', g);
      tx(x + 8, 96, cob, 'font-size:14px;font-weight:700;fill:var(--tinta)', g);
      return g;
    }
    chapa(30, 'Zn', ZN, 'Ferro galvanizado (zinco)', c3); chapa(350, 'Sn', '#d7d3c8', 'Folha de flandres (estanho)', c3);
    var g3a = tx(160, 176, '', 'font-size:14px;font-weight:700;fill:' + RD + ';text-anchor:middle', c3), g3b = tx(160, 196, '', 'font-size:14px;fill:var(--tinta);text-anchor:middle', c3);
    var g3c = tx(480, 176, '', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:middle', c3), g3d = tx(480, 196, '', 'font-size:14px;fill:var(--tinta);text-anchor:middle', c3);
    var gasta = el('rect', { x: 30, y: 100, height: 12, style: 'fill:var(--folha)' }, c3), gastb = el('rect', { y: 100, height: 12, style: 'fill:var(--folha)' }, c3);
    var furo = el('path', { style: 'fill:' + FER + ';stroke:' + FER + ';stroke-width:1' }, c3);
    /* ===== cena 4: pilha acidental ===== */
    var c4 = el('g', {});
    el('path', { d: 'M150 96 L176 196 H464 L490 96', style: 'fill:#c9ccd0;stroke:#6d737a;stroke-width:2' }, c4);
    el('path', { d: 'M160 110 L180 186 H460 L480 110 Z', style: 'fill:#b8432f;opacity:.85' }, c4);
    tx(320, 160, 'molho (eletrólito)', 'font-size:14px;font-weight:700;fill:#fff;text-anchor:middle', c4);
    var folha = el('path', { d: 'M136 92 H504', style: 'fill:none;stroke:#aab2ba;stroke-width:5' }, c4);
    var furos = [0, 1, 2].map(function (k) { return el('circle', { cx: 230 + 90 * k, cy: 92, style: 'fill:var(--folha)' }, c4); });
    tx(136, 80, 'folha de alumínio: ânodo (−)', 'font-size:14px;font-weight:700;fill:' + OX, c4);
    tx(16, 140, 'aço inox:', 'font-size:14px;font-weight:700;fill:' + RD, c4); tx(16, 158, 'cátodo (+)', 'font-size:14px;font-weight:700;fill:' + RD, c4); tx(16, 176, 'inerte: o O₂', 'font-size:14px;fill:var(--tinta)', c4); tx(16, 194, 'se reduz', 'font-size:14px;fill:var(--tinta)', c4);
    tx(624, 140, 'Al → Al³⁺ + 3 e⁻', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:end', c4);
    tx(624, 168, 'ddp = ' + vf(EP.O2) + ' − (' + vf(EP.Al) + ')', 'font-size:14px;fill:var(--tinta);text-anchor:end', c4);
    tx(624, 188, '= ' + vf(EP.O2 - EP.Al) + ' V', 'font-size:15px;font-weight:700;fill:var(--ad-t);text-anchor:end', c4);
    var e4 = eletrons(3); e4.forEach(function (e) { c4.appendChild(e); });
    /* ===== cena 5: foto real ===== */
    var c5 = el('g', {});
    var defs = el('defs', {}), cp = el('clipPath', { id: 'cs-cp' }, defs);
    el('rect', { x: 16, y: 24, width: 256, height: 192, rx: 10 }, cp);
    var im = el('image', { x: 16, y: 24, width: 256, height: 192, 'clip-path': 'url(#cs-cp)', preserveAspectRatio: 'xMidYMid slice' }, c5);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'vis/corrosao-metal-sacrificio-1.webp'); im.setAttribute('href', 'vis/corrosao-metal-sacrificio-1.webp');
    el('rect', { x: 16, y: 24, width: 256, height: 192, rx: 10, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, c5);
    [[96, 100, '1'], [250, 120, '2']].forEach(function (m) { el('circle', { cx: m[0], cy: m[1], r: 12, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.5' }, c5); tx(m[0], m[1] + 5, m[2], 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', c5); });
    tx(292, 52, 'Eixo da hélice de um barco', 'font-size:16px;font-weight:700;fill:var(--tinta)', c5);
    [['1', 'ânodo de sacrifício (em geral zinco),', 'preso ao eixo: corroído, poroso, gasto'], ['2', 'eixo metálico: preservado, porque', 'o ânodo se oxida no lugar dele']].forEach(function (l, k) {
      var y = 90 + 62 * k; el('circle', { cx: 302, cy: y - 5, r: 10, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.4' }, c5); tx(302, y, l[0], 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', c5);
      tx(320, y, l[1], 'font-size:15px;fill:var(--tinta)', c5); tx(320, y + 20, l[2], 'font-size:15px;fill:var(--tinta)', c5);
    });
    tx(292, 210, 'Quando o bloco acaba, troca-se por um novo.', 'font-size:14px;fill:var(--lapis)', c5);
    /* ===== painel ===== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Ferrugem é uma pilha dentro da gota', 'No meio da gota o ferro se oxida e cava um buraco (ânodo).', 'Os elétrons andam pelo metal até a borda, onde o O₂ os recebe (cátodo).', 'Fe²⁺ + OH⁻ + O₂ formam a ferrugem. Ar seco não enferruja; ácido acelera.'],
      ['Metal de sacrifício (proteção catódica)', 'Liga-se ao ferro um metal de E° de redução MENOR (Zn, Mg).', 'Ele vira o ânodo: se oxida e é gasto, e manda elétrons para o ferro.', 'O ferro vira cátodo e não se oxida. Troca-se o bloco quando acabar.'],
      ['Galvanização: cobrir o ferro com zinco', 'Mesmo riscado, o zinco (E° menor que o do Fe) continua se oxidando', 'no lugar do ferro. Com estanho (E° maior que o do Fe) é o contrário:', 'no risco, o ferro vira ânodo e enferruja mais depressa.'],
      ['Pilha acidental: panela de aço, papel-alumínio e molho', 'Dois metais diferentes ligados por um eletrólito formam uma pilha.', 'O alumínio, de E° bem menor, é o ânodo e fica furado.', 'O aço não reage: nele o O₂ do molho recebe os elétrons (cátodo).'],
      ['Na vida real: ânodos de sacrifício em barcos', 'Na água, o bloco de metal mais oxidável preso ao eixo vira o ânodo.', 'Ele vai sendo consumido (fica poroso e perde volume)', 'enquanto o eixo, que virou cátodo, fica protegido.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D, s = ease((u - .2) / 2.4);
      op(c1, i === 0 ? 1 : 0); op(c2, i === 1 ? 1 : 0); op(c3, i === 2 ? 1 : 0); op(c4, i === 3 ? 1 : 0); op(c5, i === 4 ? 1 : 0);
      /* cena 1 */
      var pd = 4 + 12 * s; poco.setAttribute('d', 'M' + (320 - 26) + ' 150 Q320 ' + (150 + 2 * pd).toFixed(1) + ' ' + (320 + 26) + ' 150 Z');
      anel.forEach(function (a) { op(a, s); }); op(fr, s);
      fe2.forEach(function (f, j) { var w = (t * .5 + j / 2) % 1; f.setAttribute('x', 320 + (j ? 24 : -24) * w); f.setAttribute('y', (146 - 40 * w).toFixed(1)); op(f, i === 0 ? Math.sin(Math.PI * w) : 0); });
      e1.forEach(function (e, j) { var w = (t * .45 + j / 4) % 1, dir = j % 2 ? 1 : -1; e.setAttribute('cx', (320 + dir * 150 * w).toFixed(1)); e.setAttribute('cy', 160); op(e, Math.sin(Math.PI * w)); });
      /* cena 2 */
      var zw = 36 - 18 * s; zn.setAttribute('x', (330 - zw / 2).toFixed(1)); zn.setAttribute('width', zw.toFixed(1)); zn.setAttribute('height', (44 - 14 * s).toFixed(1));
      zn2.forEach(function (f, j) { var w = (t * .5 + j / 2) % 1; f.setAttribute('x', (330 + (j ? 1 : -1) * (20 + 30 * w)).toFixed(1)); f.setAttribute('y', (186 + 6 * w).toFixed(1)); op(f, Math.sin(Math.PI * w)); });
      var p2 = [[330, 146], [330, 100], [230, 100]], L2 = [46, 100], T2 = 146;
      e2.forEach(function (e, j) { var d = (t * 60 + j * T2 / 4) % T2, k = d > L2[0] ? 1 : 0; d -= k ? L2[0] : 0; var a = p2[k], b = p2[k + 1], f = d / L2[k]; e.setAttribute('cx', (a[0] + (b[0] - a[0]) * f).toFixed(1)); e.setAttribute('cy', (a[1] + (b[1] - a[1]) * f).toFixed(1)); });
      RG.forEach(function (sy) { RGt[sy].style.fill = sy === REF ? 'var(--tinta)' : EP[sy] < EP[REF] ? OX : 'var(--lapis)'; });
      op(chave, cl((u - 1) / .4)); chT.forEach(function (c) { op(c, cl((u - 1) / .4)); });
      /* cena 3 */
      gasta.setAttribute('width', (70 * s).toFixed(1)); gasta.setAttribute('x', (110 - 70 * s).toFixed(1));
      gastb.setAttribute('x', 30 + 150); gastb.setAttribute('width', (70 * s).toFixed(1));
      furo.setAttribute('d', 'M' + (350 + 112) + ' 112 Q' + (350 + 130) + ' ' + (112 + 22 * s).toFixed(1) + ' ' + (350 + 148) + ' 112 Z');
      g3a.textContent = s > .2 ? 'o zinco é que se gasta' : ''; g3b.textContent = s > .2 ? 'Zn ' + vf(EP.Zn) + ' < Fe ' + vf(EP.Fe) + ': ferro protegido' : '';
      g3c.textContent = s > .2 ? 'o ferro enferruja no risco' : ''; g3d.textContent = s > .2 ? 'Sn ' + vf(EP.Sn) + ' > Fe ' + vf(EP.Fe) + ': Fe é o ânodo' : '';
      /* cena 4 */
      furos.forEach(function (f, j) { f.setAttribute('r', (Math.max(0, s * 1.2 - .2 * j) * 7).toFixed(1)); });
      e4.forEach(function (e, j) { var w = (t * .5 + j / 3) % 1; e.setAttribute('cx', (151 + 22 * w).toFixed(1)); e.setAttribute('cy', (98 + 84 * w).toFixed(1)); op(e, Math.sin(Math.PI * w)); });
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CG = { 'P6ea1150': D - .05, 'We0f5bb3': 2 * D - .05, 'W63884ef': 2 * D - .05, 'W9ac2d4c': 2 * D - .05, 'W0734f1b': 3 * D - .05, 'W26b4c2c': 4 * D - .05 };
    return fimResposta(VIS.def['corrosao-metal-sacrificio'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 4 * D - .05; }
    });
  }
};
VIS.liga('corrosao-metal-sacrificio', ['P6ea1150', 'We0f5bb3', 'W63884ef', 'W9ac2d4c', 'W0734f1b', 'W26b4c2c']);
