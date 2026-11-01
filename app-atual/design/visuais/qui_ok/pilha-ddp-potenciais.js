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
'P557223c': [
'Por isso a resposta é D',
'O ácido só dissolve o metal com E° abaixo do H₂ (0,00 V): o H⁺ arranca',
'elétrons dele. Mg, Al e Fe estão abaixo e se dissolvem.',
'A platina (+1,20 V) está acima, como o ouro: não reage, falso positivo.'
],
'P6b8f55a': [
'Por isso a resposta é C',
'Menor E° oxida: o manganês (−1,18 V) é o ânodo; o níquel reduz.',
'ddp = E(maior) − E(menor) = −0,23 − (−1,18) = 0,95 V.'
],
'P92a7349': [
'Por isso a resposta é D',
'A maior ddp vem dos extremos da tabela: Mg (−2,36 V) e Cu (+0,34 V),',
'ddp = 0,34 − (−2,36) = 2,70 V. O Mg oxida: ânodo, polo negativo.',
'O Cu reduz: cátodo, polo positivo.'
],
'P994864d': [
'Por isso a resposta é E',
'Deposita metal no prego quando o cátion tem E° maior que o do ferro',
'(−0,409 V): Cu²⁺ (+0,34 V, tubo 1) e Ag⁺ (+0,80 V, tubo 3).',
'Na⁺ (−2,18 V) tem E° menor: não arranca elétrons do ferro (tubo 2).'
],
'Pdf93f05': [
'Por isso a resposta é C',
'Uma pilha Ni | Ag: ddp = 0,80 − (−0,25) = 1,05 V.',
'Em série as ddp se somam: 4 × 1,05 V = 4,20 V,',
'a tensão mínima do equipamento 3.'
],
'Pe423e44': [
'Por isso a resposta é D',
'Os elétrons saem do Fe (ânodo) e chegam ao Ni₂O₃: ali há redução.',
'ddp = E(cátodo) − E(ânodo): 1,35 = X − (−0,88), então X = +0,47 V,',
'maior que −0,88 V, como deve ser no cátodo.'
],
'W4c2af78': [
'Por isso a resposta é D',
'O lítio (−3,05 V) tem o menor E°: oxida no ânodo, Li → Li⁺ + e⁻.',
'ddp = 0,80 − (−3,05) = +3,85 V (subtrair negativo é somar).'
],
'W563238f': [
'Por isso a resposta é E',
'Li (−3,05 V) oxida no ânodo (I é falsa); o I₂ (+0,54 V) reduz no cátodo',
'(III certa) e por isso é o agente oxidante (IV certa).',
'ddp = 0,54 − (−3,05) = +3,59 V, não 2,51 V (II é falsa).'
]
};
VIS.def['pilha-ddp-potenciais'] = {
  tit: 'Pilha: quem oxida, quem reduz e a ddp',
  fontes: ['OpenStax, Chemistry 2e, 17.2 Galvanic Cells — https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells', 'OpenStax, Chemistry 2e, 17.3 Electrode and Cell Potentials — https://openstax.org/books/chemistry-2e/pages/17-3-electrode-and-cell-potentials', 'OpenStax, Chemistry 2e, Appendix L: Standard Electrode (Half-Cell) Potentials — https://openstax.org/books/chemistry-2e/pages/l-standard-electrode-half-cell-potentials'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Daniell'], [3, 'Régua de E°'], [6, 'Em série'], [9, 'Metal e íon'], [12, 'Metal+ácido']],
  cred: 'Animação feita para o app (esquema fora de escala). E° a 25 °C do apêndice L do OpenStax, arredondados para 2 casas; as provas às vezes usam valores um pouco diferentes (ex.: Fe −0,44 V).',
  nota: 'Na pilha, o ânodo é o polo negativo (oxidação, o metal se desgasta) e o cátodo é o polo positivo (redução, metal se deposita). Os elétrons andam pelo fio do ânodo para o cátodo; pela ponte salina andam íons, nunca elétrons.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vf(v, s) { var r = (Math.abs(v) < .005 ? 0 : v).toFixed(2).replace('.', ','); return (v > .005 && s ? '+' : '') + r.replace('-', '−'); }
    var ZN = '#8f969c', CU = '#c26b3a', AZ = '#3d7fc4', EL = '#d4a017', ANI = '#7a4fa0', CAT = '#2e8b57', OX = '#c0392b', RD = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    /* E° (V) a 25 C, OpenStax apendice L */
    var EP = { Li: -3.04, Na: -2.71, Mg: -2.372, Al: -1.662, Mn: -1.185, Zn: -0.7618, Fe: -0.447, Ni: -0.257, H: 0, Cu: 0.337, Ag: 0.7996, Pt: 1.20, Au: 1.498 };
    var ORD = ['Li', 'Na', 'Mg', 'Al', 'Mn', 'Zn', 'Fe', 'Ni', 'H', 'Cu', 'Ag', 'Pt', 'Au'];
    var ddpDan = EP.Cu - EP.Zn;
    var ddpS = qid === 'Pdf93f05' ? 1.05 : ddpDan;   /* Pdf93f05: pilha Ni | Ag com os E° da prova (0,80 e −0,25) */
    /* ======== cena 1: pilha de Daniell ======== */
    var c1 = el('g', {});
    var BL = { x: 50, y: 96, w: 170, h: 96 }, BR = { x: 420, y: 96, w: 170, h: 96 };
    [[BL, 'ZnSO₄(aq)', '#e9eef2'], [BR, 'CuSO₄(aq)', AZ]].forEach(function (b, i) {
      b[0].sol = el('rect', { x: b[0].x + 2, y: b[0].y + 18, width: b[0].w - 4, height: b[0].h - 20, style: 'fill:' + b[2] + ';opacity:' + (i ? .35 : .9) }, c1);
      el('path', { d: 'M' + b[0].x + ' ' + b[0].y + ' V' + (b[0].y + b[0].h) + ' H' + (b[0].x + b[0].w) + ' V' + b[0].y, style: 'fill:none;stroke:var(--tinta);stroke-width:2.2' }, c1);
      tx(b[0].x + b[0].w - 6, b[0].y + b[0].h - 8, b[1], 'font-size:14px;fill:var(--tinta);text-anchor:end', c1);
    });
    /* eletrodos */
    var zn = el('rect', { y: 66, height: 104, style: 'fill:' + ZN + ';stroke:#5d6368;stroke-width:1.2' }, c1);
    var cu = el('rect', { y: 66, height: 104, style: 'fill:' + CU + ';stroke:#8a4521;stroke-width:1.2' }, c1);
    tx(88, 52, 'Zn', 'font-size:16px;font-weight:700;fill:var(--tinta);text-anchor:end', c1);
    tx(88, 70, 'ânodo (−)', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:end', c1);
    tx(552, 52, 'Cu', 'font-size:16px;font-weight:700;fill:var(--tinta)', c1);
    tx(552, 70, 'cátodo (+)', 'font-size:14px;font-weight:700;fill:' + RD, c1);
    /* fio e voltimetro */
    el('path', { d: 'M96 66 V34 H290 M350 34 H544 V66', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, c1);
    el('rect', { x: 290, y: 16, width: 60, height: 36, rx: 6, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2' }, c1);
    var volt = tx(320, 40, '', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', c1);
    var ES = []; for (var k = 0; k < 7; k++) ES.push(el('circle', { r: 4.5, style: 'fill:' + EL + ';stroke:#8a6a00;stroke-width:1' }, c1));
    var eLb = tx(190, 26, 'e⁻ →', 'font-size:15px;font-weight:700;fill:#8a6a00;text-anchor:middle', c1);
    /* ponte salina */
    el('path', { d: 'M212 172 V78 Q212 66 224 66 H416 Q428 66 428 78 V172', style: 'fill:none;stroke:var(--linha);stroke-width:20;stroke-linecap:butt' }, c1);
    el('path', { d: 'M212 172 V78 Q212 66 224 66 H416 Q428 66 428 78 V172', style: 'fill:none;stroke:color-mix(in srgb,var(--tinta) 8%,var(--folha));stroke-width:16;stroke-linecap:butt' }, c1);
    tx(320, 100, 'ponte salina (KNO₃)', 'font-size:14px;fill:var(--lapis);text-anchor:middle', c1);
    var IA = [], IC = []; for (k = 0; k < 1; k++) { IA.push(tx(0, 0, 'NO₃⁻', 'font-size:14px;font-weight:700;fill:' + ANI + ';text-anchor:middle', c1)); IC.push(tx(0, 0, 'K⁺', 'font-size:14px;font-weight:700;fill:' + CAT + ';text-anchor:middle', c1)); }
    /* ions metalicos */
    var ZI = [], CI = [];
    for (k = 0; k < 3; k++) { ZI.push(tx(0, 0, 'Zn²⁺', 'font-size:14px;font-weight:700;fill:#5d6368;text-anchor:middle', c1)); CI.push(tx(0, 0, 'Cu²⁺', 'font-size:14px;font-weight:700;fill:' + AZ + ';text-anchor:middle', c1)); }
    tx(16, 214, 'Zn → Zn²⁺ + 2 e⁻', 'font-size:15px;font-weight:700;fill:' + OX, c1);
    tx(624, 214, 'Cu²⁺ + 2 e⁻ → Cu', 'font-size:15px;font-weight:700;fill:' + RD + ';text-anchor:end', c1);
    /* ======== regua de E (cenas 2-5) ======== */
    var rg = el('g', {});
    function XE(e) { return 30 + (e + 3.2) * 118; }
    tx(16, 20, 'E° de redução (V): quanto maior, mais fácil o íon ganhar e⁻ (reduzir)', 'font-size:14px;fill:var(--lapis)', rg);
    el('line', { x1: XE(-3.2), x2: XE(1.7), y1: 62, y2: 62, style: 'stroke:var(--tinta);stroke-width:2' }, rg);
    el('path', { d: 'M' + XE(1.7) + ' 62 l-9 -5 v10 z', style: 'fill:var(--tinta)' }, rg);
    var RS = {};
    ORD.forEach(function (s, i) {
      var x = XE(EP[s]), g = el('g', {}, rg), rowB = i % 2 === 1;
      el('line', { x1: x, x2: x, y1: 56, y2: 68, style: 'stroke:var(--tinta);stroke-width:1.6' }, g);
      var nm = tx(x, 50, s === 'H' ? 'H₂' : s, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      var vl = tx(x, rowB ? 100 : 84, vf(EP[s], true), 'font-size:14px;fill:var(--lapis);text-anchor:middle', g);
      RS[s] = { g: g, nm: nm, vl: vl, x: x };
    });
    function realca(lista, cor) { ORD.forEach(function (s) { var on = !lista || lista.indexOf(s) >= 0; op(RS[s].g, on ? 1 : .3); RS[s].nm.style.fill = on && cor && cor[s] ? cor[s] : 'var(--tinta)'; }); }
    /* ======== cena 2: ddp como distancia na regua ======== */
    var c2 = el('g', {});
    function chave(a, b, y, cor, txt, pai) {
      var g = el('g', {}, pai), xa = XE(EP[a]), xb = XE(EP[b]);
      el('path', { d: 'M' + xa + ' ' + (y - 10) + ' V' + y + ' H' + xb + ' V' + (y - 10), style: 'fill:none;stroke:' + cor + ';stroke-width:2.2' }, g);
      tx((xa + xb) / 2, y + 20, txt, 'font-size:15px;font-weight:700;fill:' + cor + ';text-anchor:middle', g);
      return g;
    }
    var k1 = chave('Zn', 'Cu', 130, 'var(--ad-t)', 'Zn | Cu: ddp = ' + vf(EP.Cu) + ' − (' + vf(EP.Zn) + ') = ' + vf(ddpDan) + ' V', c2);
    var k2 = chave('Mg', 'Cu', 182, '#2b6cb0', 'Mg | Cu: ' + vf(EP.Cu) + ' − (' + vf(EP.Mg) + ') = ' + vf(EP.Cu - EP.Mg) + ' V', c2);
    /* ======== cena 3: em serie ======== */
    var c3 = el('g', {});
    var SER = [];
    for (k = 0; k < 4; k++) {
      var g3 = el('g', {}, c3), x0 = 40 + 120 * k;
      el('rect', { x: x0, y: 128, width: 84, height: 44, rx: 6, style: 'fill:color-mix(in srgb,' + CU + ' 14%,var(--folha));stroke:var(--tinta);stroke-width:1.8' }, g3);
      el('rect', { x: x0 + 84, y: 142, width: 8, height: 16, style: 'fill:var(--tinta)' }, g3);
      tx(x0 + 10, 156, '−', 'font-size:18px;font-weight:700;fill:' + OX, g3); tx(x0 + 74, 156, '+', 'font-size:18px;font-weight:700;fill:' + RD + ';text-anchor:end', g3);
      tx(x0 + 46, 192, vf(ddpS) + ' V', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3);
      if (k < 3) el('line', { x1: x0 + 92, x2: x0 + 120, y1: 150, y2: 150, style: 'stroke:var(--tinta);stroke-width:2' }, g3);
      SER.push(g3);
    }
    var soma = tx(620, 156, '', 'font-size:16px;font-weight:700;fill:var(--ad-t);text-anchor:end', c3);
    var somaB = tx(620, 192, '', 'font-size:14px;fill:var(--lapis);text-anchor:end', c3);
    /* ======== cena 4: prego de ferro em solucoes ======== */
    var c4 = el('g', {});
    function tubo(x, sol, cor, pai) {
      var g = el('g', {}, pai);
      el('path', { d: 'M' + x + ' 122 V186 a22 22 0 0 0 44 0 V122', style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:var(--tinta);stroke-width:2' }, g);
      var fe = el('rect', { x: x + 17, y: 112, width: 10, height: 90, rx: 3, style: 'fill:#6d6f72' }, g);
      el('rect', { x: x + 12, y: 108, width: 20, height: 6, rx: 2, style: 'fill:#6d6f72' }, g);
      tx(x - 6, 170, sol, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:end', g);
      return { g: g, fe: fe };
    }
    var TB = [tubo(70, 'Cu²⁺', AZ, c4), tubo(196, 'Na⁺', '#bbbbbb', c4), tubo(322, 'Ag⁺', '#cfd6dc', c4)];
    var capa = [el('rect', { x: 70 + 15, y: 126, width: 14, height: 76, rx: 4, style: 'fill:' + CU }, c4), null, el('rect', { x: 322 + 15, y: 126, width: 14, height: 76, rx: 4, style: 'fill:#b9bec4;stroke:#7d848b;stroke-width:1' }, c4)];
    var r4 = [tx(450, 140, 'Cu²⁺ (+0,34) > Fe (−0,45):', 'font-size:14px;font-weight:700;fill:' + CU, c4), tx(450, 158, 'deposita cobre', 'font-size:14px;fill:var(--tinta)', c4),
      tx(450, 182, 'Na⁺ (−2,71) < Fe: nada', 'font-size:14px;font-weight:700;fill:var(--lapis)', c4), tx(450, 206, 'Ag⁺ (+0,80) > Fe: prata', 'font-size:14px;font-weight:700;fill:#6f7880', c4)];
    /* ======== cena 5: metal + acido ======== */
    var c5 = el('g', {});
    var AC = ['Mg', 'Zn', 'Fe', 'Cu', 'Pt', 'Au'].map(function (s, i) {
      var x = 30 + 100 * i, g = el('g', {}, c5);
      el('path', { d: 'M' + x + ' 130 V180 a20 20 0 0 0 40 0 V130', style: 'fill:color-mix(in srgb,#e8d26a 22%,var(--folha));stroke:var(--tinta);stroke-width:2' }, g);
      var pcor = s === 'Cu' ? CU : s === 'Au' ? '#d4a52a' : s === 'Pt' ? '#c9ccd0' : '#8f969c';
      el('rect', { x: x + 10, y: 186, width: 20, height: 10, rx: 3, style: 'fill:' + pcor + ';stroke:var(--tinta);stroke-width:.8' }, g);
      tx(x + 58, 190, s, 'font-size:15px;font-weight:700;fill:' + (EP[s] < 0 ? OX : RD) + ';text-anchor:middle', g);
      var bol = []; if (EP[s] < 0) for (var j = 0; j < 4; j++) bol.push(el('circle', { r: 3.2, style: 'fill:none;stroke:var(--tinta);stroke-width:1.3' }, g));
      return { s: s, x: x, bol: bol };
    });
    var linhaH = el('line', { x1: XE(0), x2: XE(0), y1: 106, y2: 128, style: 'stroke:var(--ad-c);stroke-width:2;stroke-dasharray:5 4' }, c5);
    tx(XE(0) - 6, 122, '← atacados pelo H⁺', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:end', c5);
    tx(XE(0) + 6, 122, 'não reagem →', 'font-size:14px;font-weight:700;fill:' + RD, c5);
    /* ======== painel ======== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Pilha de Daniell: Zn | Zn²⁺ ‖ Cu²⁺ | Cu', 'O zinco oxida e perde massa: ânodo, polo −. O Cu²⁺ ganha os elétrons', 'e vira cobre sobre a placa: cátodo, polo +. Elétrons vão pelo fio (Zn → Cu);', 'na ponte salina andam íons: ânions para o ânodo, cátions para o cátodo.'],
      ['ddp = E°(maior) − E°(menor)', 'O de E° maior reduz (cátodo); o de E° menor oxida (ânodo).', 'A ddp é a distância entre os dois na régua: subtrair um negativo é somar.', 'Quanto mais longe os dois metais, maior a ddp.'],
      ['Pilhas em série: as ddp se somam', 'O polo + de uma liga no polo − da seguinte.', 'Cada pilha empurra os elétrons mais um pouco:', 'ddp total = número de pilhas × ddp de uma.'],
      ['Metal dentro de solução de outro cátion', 'Prego de ferro em Cu²⁺: o Cu²⁺ tem E° maior, arranca elétrons do Fe', 'e vira cobre sobre o prego (o prego fica cobreado; o azul desbota).', 'Com Na⁺ (E° menor que o do Fe) nada acontece.'],
      ['Metal em ácido: compare com o H₂ (0,00 V)', 'Metal com E° negativo é oxidado pelo H⁺ e solta gás H₂.', 'Metal com E° positivo (Cu, Ag, Pt, Au) não é atacado pelo H⁺:', 'é por isso que o H⁺ de um ácido comum não dissolve ouro nem platina.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D;
      op(c1, i === 0 ? 1 : 0); op(rg, i === 0 ? 0 : 1); op(c2, i === 1 ? 1 : 0); op(c3, i === 2 ? 1 : 0); op(c4, i === 3 ? 1 : 0); op(c5, i === 4 ? 1 : 0);
      /* cena 1 */
      var s = ease(u / D);
      var wz = 22 - 9 * s, wc = 14 + 8 * s;
      zn.setAttribute('x', (96 - wz / 2).toFixed(1)); zn.setAttribute('width', wz.toFixed(1));
      cu.setAttribute('x', (544 - wc / 2).toFixed(1)); cu.setAttribute('width', wc.toFixed(1));
      BR.sol.style.opacity = (.35 - .17 * s).toFixed(2);
      volt.textContent = vf(ddpDan) + ' V';
      var path = [[96, 66], [96, 34], [290, 34], [350, 34], [544, 34], [544, 66]], L = [32, 194, 60, 194, 32], tot = 512;
      ES.forEach(function (e, j) {
        var d = ((t * 120 + j * tot / ES.length) % tot), k = 0; while (k < L.length - 1 && d > L[k]) { d -= L[k]; k++; }
        var a = path[k], b = path[k + 1], f = Math.min(1, d / L[k]);
        e.setAttribute('cx', (a[0] + (b[0] - a[0]) * f).toFixed(1)); e.setAttribute('cy', (a[1] + (b[1] - a[1]) * f).toFixed(1)); op(e, k === 2 ? 0 : 1);
      });
      IA.forEach(function (e, j) { var f = ((t * .3 + j / 2) % 1); e.setAttribute('x', (312 - 84 * f).toFixed(1)); e.setAttribute('y', 72); op(e, Math.sin(Math.PI * f)); });
      IC.forEach(function (e, j) { var f = ((t * .3 + j / 2) % 1); e.setAttribute('x', (328 + 84 * f).toFixed(1)); e.setAttribute('y', 72); op(e, Math.sin(Math.PI * f)); });
      ZI.forEach(function (e, j) { var f = ((t * .3 + j / 3) % 1); e.setAttribute('x', (126 + 56 * f).toFixed(1)); e.setAttribute('y', 126 + 18 * j); op(e, Math.sin(Math.PI * f)); });
      CI.forEach(function (e, j) { var f = ((t * .3 + j / 3) % 1); e.setAttribute('x', (456 + 56 * f).toFixed(1)); e.setAttribute('y', 126 + 18 * j); op(e, Math.sin(Math.PI * f)); });
      /* regua: realces */
      if (i === 1) realca(['Zn', 'Cu', 'Mg'], { Zn: OX, Mg: OX, Cu: RD });
      else if (i === 2) { if (qid === 'Pdf93f05') realca(['Ni', 'Ag'], { Ni: OX, Ag: RD }); else realca(['Zn', 'Cu'], { Zn: OX, Cu: RD }); }
      else if (i === 3) realca(['Na', 'Fe', 'Cu', 'Ag'], { Fe: OX, Cu: RD, Ag: RD });
      else if (i === 4) realca(null, { Mg: OX, Zn: OX, Fe: OX, Cu: RD, Pt: RD, Au: RD, Li: OX, Na: OX, Al: OX, Mn: OX, Ni: OX, Ag: RD });
      op(k1, i === 1 ? cl(u / .4) : 0); op(k2, i === 1 ? cl((u - 1.1) / .4) : 0);
      SER.forEach(function (g, j) { op(g, i === 2 ? cl((u - .5 * j) / .3) : 0); });
      var nS = i === 2 ? Math.max(1, Math.min(4, Math.floor(u / .5) + 1)) : 4;
      soma.textContent = 'total: ' + vf(nS * ddpS) + ' V'; somaB.textContent = nS + ' × ' + vf(ddpS) + ' V';
      var s4 = ease((u - .3) / 1.8);
      op(capa[0], i === 3 ? s4 : 0); op(capa[2], i === 3 ? s4 : 0);
      r4.forEach(function (r, j) { op(r, i === 3 ? cl((u - .4 - .4 * j) / .3) : 0); });
      AC.forEach(function (a) { a.bol.forEach(function (b, j) { var f = ((t * .9 + j / 4) % 1); b.setAttribute('cx', a.x + 14 + 4 * j % 12); b.setAttribute('cy', (182 - 48 * f).toFixed(1)); op(b, i === 4 ? Math.sin(Math.PI * f) : 0); }); });
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CG = { 'W563238f': 2 * D - .05, 'P6b8f55a': 2 * D - .05, 'P92a7349': 2 * D - .05, 'Pe423e44': 2 * D - .05, 'W4c2af78': 2 * D - .05, 'Pdf93f05': 3 * D - .05, 'P994864d': 4 * D - .05, 'P557223c': 5 * D - .05 };
    return fimResposta(VIS.def['pilha-ddp-potenciais'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 5 * D - .05; }
    });
  }
};
VIS.liga('pilha-ddp-potenciais', ['P557223c', 'P6b8f55a', 'P92a7349', 'P994864d', 'Pdf93f05', 'Pe423e44', 'W4c2af78', 'W563238f']);
