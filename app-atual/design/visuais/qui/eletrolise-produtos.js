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
'W83dc27f': [
'Por isso a resposta é D',
'Na eletrólise o ânodo fica no polo positivo da fonte: atrai os ânions,',
'que entregam elétrons a ele (oxidação). O cátodo é negativo e',
'reduz os cátions. A energia elétrica vira química, não o contrário.'
],
'W5b2ee6b': [
'Por isso a resposta é E',
'Ígnea: Ba no cátodo e Cl₂ no ânodo. Aquosa: o Ba²⁺ perde para a água',
'(sai H₂ no cátodo), mas o Cl⁻ ganha da água no ânodo (sai Cl₂).',
'Comum às duas: Cl₂ nos ânodos.'
],
'P5cd9dda': [
'Por isso a resposta é B',
'No cátodo a água ganha elétrons: 2 H₂O + 2 e⁻ → H₂ + 2 OH⁻.',
'Tensão mínima = 0,40 − (−0,83) = 1,23 V, sem multiplicar os E°',
'pelo número de elétrons.'
],
'Pc6e102f': [
'Por isso a resposta é E',
'No ânodo o OH⁻ (ou a água) perde elétrons e sai O₂.',
'Tensão mínima = 0,40 − (−0,83) = 1,23 V.'
],
'P68ade81': [
'Por isso a resposta é B',
'O O₂ sai da água no ânodo: o O vai de −2 a 0, é oxidação.',
'Cada O perde 2 e⁻ e o O₂ tem 2 átomos: 2 H₂O → O₂ + 4 H⁺ + 4 e⁻.',
'Doação de 4 mol de elétrons por mol de O₂.'
],
'P155cb65': [
'Por isso a resposta é B',
'1 Al₂O₃ tem 3 O²⁻; 2 O²⁻ → 1 O₂, então 3 O²⁻ dão 1,5 O₂,',
'e C + O₂ → CO₂ dá 1,5 mol de CO₂ por mol de alumina.',
'No polo negativo (cátodo de aço): Al³⁺ + 3 e⁻ → Al, redução.'
],
'Pb19b943': [
'Por isso a resposta é A',
'O anel de aço está no polo negativo: cátodo, Cr³⁺ + 3 e⁻ → Cr.',
'A platina (inerte) é o ânodo: o Cl⁻ ganha da água e sai Cl₂.'
],
'P039098d': [
'Por isso a resposta é D',
'Leucoíndigo → índigo + 2 e⁻ perde elétrons: oxidação, no ânodo.',
't = 19 300 s; Q = 0,1 × 19 300 = 1 930 C; 1 930 ÷ 96 500 = 0,02 mol e⁻.',
'2 e⁻ por índigo: 0,02 ÷ 2 = 0,01 mol de índigo.'
]
};
VIS.def['eletrolise-produtos'] = {
  tit: 'Eletrólise: o que sai em cada eletrodo',
  fontes: ['OpenStax, Chemistry 2e, 17.7 Electrolysis — https://openstax.org/books/chemistry-2e/pages/17-7-electrolysis', 'OpenStax, Chemistry 2e, Appendix L (E° de 2 H₂O/H₂ = −0,83 V e O₂/OH⁻ = +0,40 V) — https://openstax.org/books/chemistry-2e/pages/l-standard-electrode-half-cell-potentials', 'Wikipedia (en), Hall–Héroult process — https://en.wikipedia.org/wiki/Hall%E2%80%93H%C3%A9roult_process'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Ígnea NaCl'], [3, 'Aquosa NaCl'], [6, 'Água'], [9, 'Alumina'], [12, 'Cromação']],
  cred: 'Animação feita para o app (esquema fora de escala). Na cuba de alumínio real, o cátodo é o fundo da cuba e o alumínio líquido se junta ali.',
  nota: 'Ânodo é sempre oxidação e cátodo é sempre redução. O que muda da pilha para a eletrólise é o sinal: na eletrólise a fonte força a reação, o ânodo é o polo + e o cátodo é o polo −. Ordem prática em solução aquosa: no cátodo, cátions de metais alcalinos, alcalinoterrosos e Al³⁺ perdem para a água (sai H₂); no ânodo, ânions oxigenados e F⁻ perdem para a água (sai O₂), enquanto Cl⁻, Br⁻ e I⁻ descarregam.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vf(v) { return v.toFixed(2).replace('.', ',').replace('-', '−'); }
    var OX = '#c0392b', RD = '#2b6cb0', EL = '#d4a017';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    var E_O2 = 0.40, E_H2 = -0.83, VMIN = E_O2 - E_H2;
    var nO2 = 3 / 2, nCO2 = nO2 * 1;   /* 1 Al2O3 -> 3 O2- -> 3/2 O2 -> 3/2 CO2 */
    /* cuba */
    var XA = 236, XC = 404, Y0 = 96, Y1 = 196;
    var sol = el('rect', { x: 162, y: Y0 + 14, width: 316, height: Y1 - Y0 - 16 });
    el('path', { d: 'M160 ' + Y0 + ' V' + Y1 + ' H480 V' + Y0, style: 'fill:none;stroke:var(--tinta);stroke-width:2.2' });
    var eA = el('rect', { y: 70, height: 116, rx: 2 }), eC = el('rect', { x: XC - 7, y: 70, width: 14, height: 116, rx: 2 });
    var dep = el('rect', { y: 104, rx: 2 });          /* metal depositado no catodo */
    var poca = el('path', { style: 'fill:#b9bec4;stroke:#7d848b;stroke-width:1' });   /* aluminio liquido */
    /* fonte */
    el('path', { d: 'M' + XA + ' 70 V36 H300 M340 36 H' + XC + ' V70', style: 'fill:none;stroke:var(--tinta);stroke-width:2' });
    el('line', { x1: 304, x2: 304, y1: 22, y2: 50, style: 'stroke:var(--tinta);stroke-width:2.4' });
    el('line', { x1: 316, x2: 316, y1: 28, y2: 44, style: 'stroke:var(--tinta);stroke-width:5' });
    el('line', { x1: 326, x2: 326, y1: 22, y2: 50, style: 'stroke:var(--tinta);stroke-width:2.4' });
    el('line', { x1: 336, x2: 336, y1: 28, y2: 44, style: 'stroke:var(--tinta);stroke-width:5' });
    tx(296, 22, '+', 'font-size:16px;font-weight:700;fill:' + OX + ';text-anchor:end'); tx(346, 22, '−', 'font-size:16px;font-weight:700;fill:' + RD);
    var fonteT = tx(320, 64, '', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle');
    var ES = []; for (var k = 0; k < 6; k++) ES.push(el('circle', { r: 4.2, style: 'fill:' + EL + ';stroke:#8a6a00;stroke-width:1' }));
    /* rotulos laterais */
    tx(16, 112, 'ânodo (+)', 'font-size:15px;font-weight:700;fill:' + OX); tx(16, 130, 'oxidação', 'font-size:14px;fill:' + OX);
    tx(624, 112, 'cátodo (−)', 'font-size:15px;font-weight:700;fill:' + RD + ';text-anchor:end'); tx(624, 130, 'redução', 'font-size:14px;fill:' + RD + ';text-anchor:end');
    var matA = tx(16, 152, '', 'font-size:14px;fill:var(--lapis)'), matC = tx(624, 152, '', 'font-size:14px;fill:var(--lapis);text-anchor:end');
    var prA = tx(16, 178, '', 'font-size:15px;font-weight:700;fill:' + OX), prC = tx(624, 178, '', 'font-size:15px;font-weight:700;fill:' + RD + ';text-anchor:end');
    var eqA = tx(16, 216, '', 'font-size:15px;font-weight:700;fill:' + OX), eqC = tx(624, 216, '', 'font-size:15px;font-weight:700;fill:' + RD + ';text-anchor:end');
    var solT = tx(320, 90, '', 'font-size:14px;fill:var(--tinta);text-anchor:middle');
    /* ions */
    var CAT = [], ANI = [];
    for (k = 0; k < 2; k++) { CAT.push(tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + RD + ';text-anchor:middle')); ANI.push(tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + OX + ';text-anchor:middle')); }
    var risco = el('path', { style: 'fill:none;stroke:var(--tinta);stroke-width:2' });
    /* bolhas */
    var BA = [], BC = []; for (k = 0; k < 6; k++) { BA.push(el('circle', { style: 'fill:none;stroke:var(--tinta);stroke-width:1.3' })); BC.push(el('circle', { style: 'fill:none;stroke:var(--tinta);stroke-width:1.3' })); }
    /* cenas */
    var CEN = [
      { sol: '#f3e3c3', solT: 'NaCl fundido', fonte: '', mA: 'grafite', mC: 'ferro', cat: 'Na⁺', ani: 'Cl⁻', pA: 'Cl₂(g)', pC: 'Na (metal)', eA: '2 Cl⁻ → Cl₂ + 2 e⁻', eC: 'Na⁺ + e⁻ → Na', bA: 1, bC: 0, dep: '#c9c9c0' },
      { sol: '#d8e9f5', solT: 'NaCl(aq)', fonte: '', mA: 'grafite', mC: 'ferro', cat: 'Na⁺', ani: 'Cl⁻', pA: 'Cl₂(g)', pC: 'H₂(g)', eA: '2 Cl⁻ → Cl₂ + 2 e⁻', eC: '2 H₂O + 2 e⁻ → H₂ + 2 OH⁻', bA: 1, bC: 1, risco: 1 },
      { sol: '#d8e9f5', solT: 'água + KOH', fonte: '≥ ' + vf(VMIN) + ' V', mA: 'aço ou Pt', mC: 'aço ou Pt', cat: 'K⁺', ani: 'OH⁻', pA: 'O₂(g): 1 volume', pC: 'H₂(g): 2 volumes', eA: '4 OH⁻ → O₂ + 2 H₂O + 4 e⁻', eC: '4 H₂O + 4 e⁻ → 2 H₂ + 4 OH⁻', bA: 1, bC: 2 },
      { sol: '#f1d9b5', solT: 'Al₂O₃ fundida', fonte: '', mA: 'grafite', mC: 'aço', cat: 'Al³⁺', ani: 'O²⁻', pA: 'CO₂(g)', pC: 'Al (líquido)', eA: '2 O²⁻ → O₂ + 4 e⁻;  C + O₂ → CO₂', eC: 'Al³⁺ + 3 e⁻ → Al', bA: 1, bC: 0, poca: 1 },
      { sol: '#cfe3cf', solT: 'CrCl₃(aq)', fonte: '', mA: 'platina', mC: 'anel de aço', cat: 'Cr³⁺', ani: 'Cl⁻', pA: 'Cl₂(g)', pC: 'cromo no anel', eA: '2 Cl⁻ → Cl₂ + 2 e⁻', eC: 'Cr³⁺ + 3 e⁻ → Cr', bA: 1, bC: 0, dep: '#9fb3c4' }
    ];
    var nota = tx(320, 236, '', 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:middle');
    /* painel */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['A fonte força a reação (eletrólise ígnea do NaCl)', 'A fonte tira elétrons do ânodo (+) e empurra para o cátodo (−).', 'Cátions vão ao cátodo e ganham e⁻ (redução); ânions vão ao ânodo', 'e perdem e⁻ (oxidação). Energia elétrica vira energia química.'],
      ['Em água, a água também disputa', 'Cátodo: Na⁺ (alcalinos, alcalinoterrosos, Al³⁺) perde para a água: sai H₂.', 'Cátions como Cu²⁺, Ag⁺, Ni²⁺ ganham da água e depositam metal.', 'Ânodo: Cl⁻ ganha da água e sai Cl₂; SO₄²⁻, NO₃⁻ e F⁻ perdem: sai O₂.'],
      ['Eletrólise da água: H₂ no cátodo, O₂ no ânodo', 'O sal só deixa a água conduzir. O O vai de −2 (H₂O) a 0 (O₂):', 'é oxidação, com 4 e⁻ por O₂. Saem 2 volumes de H₂ para 1 de O₂.', 'Tensão mínima: ' + vf(E_O2) + ' − (' + vf(E_H2) + ') = ' + vf(VMIN) + ' V.'],
      ['Alumínio: eletrólise ígnea da alumina', 'No cátodo (−): Al³⁺ + 3 e⁻ → Al, redução. No ânodo de grafite (+):', 'o O²⁻ vira O₂, que queima o grafite: sai CO₂ e o ânodo é gasto.', '1 Al₂O₃ → 3 O²⁻ → ' + String(nO2).replace('.', ',') + ' O₂ → ' + String(nCO2).replace('.', ',') + ' CO₂.'],
      ['Galvanoplastia: a peça vai no cátodo', 'Para cromar, o anel de aço fica no polo −: Cr³⁺ + 3 e⁻ → Cr.', 'No ânodo inerte (platina) o Cl⁻ se oxida a Cl₂.', 'Quantidade: Q = i · t; mol de e⁻ = Q ÷ 96 500 C/mol.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D, c = CEN[i], s = ease((u - .3) / 2.2);
      sol.style.fill = c.sol; solT.textContent = c.solT; fonteT.textContent = c.fonte;
      var wA = i === 3 ? 18 - 7 * s : 14;
      eA.setAttribute('x', (XA - wA / 2).toFixed(1)); eA.setAttribute('width', wA.toFixed(1));
      eA.style.fill = c.mA === 'grafite' ? '#3d3d3d' : '#c9ccd0'; eA.style.stroke = '#5d6368';
      eC.style.fill = c.mC === 'grafite' ? '#3d3d3d' : '#8f969c';
      if (c.dep) { var dw = 6 * s; dep.setAttribute('x', (XC - 7 - dw).toFixed(1)); dep.setAttribute('width', (14 + 2 * dw).toFixed(1)); dep.setAttribute('height', 82); dep.style.fill = c.dep; op(dep, s > 0 ? 1 : 0); } else op(dep, 0);
      if (c.poca) { var ph = 14 * s; poca.setAttribute('d', 'M' + (XC - 70) + ' ' + Y1 + ' V' + (Y1 - ph).toFixed(1) + ' H' + (XC + 74) + ' V' + Y1 + ' Z'); op(poca, s > 0 ? 1 : 0); } else op(poca, 0);
      matA.textContent = c.mA; matC.textContent = c.mC; prA.textContent = c.pA; prC.textContent = c.pC; eqA.textContent = c.eA; eqC.textContent = c.eC;
      /* eletrons: do anodo para a fonte, da fonte para o catodo */
      var path = [[XA, 70], [XA, 36], [300, 36], [340, 36], [XC, 36], [XC, 70]], L = [34, 64, 40, 64, 34], tot = 236;
      ES.forEach(function (e, j) {
        var d = ((t * 70 + j * tot / ES.length) % tot), k = 0; while (k < L.length - 1 && d > L[k]) { d -= L[k]; k++; }
        var a = path[k], b = path[k + 1], f = Math.min(1, d / L[k]);
        e.setAttribute('cx', (a[0] + (b[0] - a[0]) * f).toFixed(1)); e.setAttribute('cy', (a[1] + (b[1] - a[1]) * f).toFixed(1)); op(e, k === 2 ? 0 : 1);
      });
      /* ions migrando */
      CAT.forEach(function (o, j) { var f = (t * .32 + j / 2) % 1; o.textContent = c.cat; o.setAttribute('x', (262 + (XC - 26 - 262) * f).toFixed(1)); o.setAttribute('y', 128 + 32 * j); op(o, Math.sin(Math.PI * f)); });
      ANI.forEach(function (o, j) { var f = (t * .32 + j / 2 + .25) % 1; o.textContent = c.ani; o.setAttribute('x', (378 - (378 - XA - 26) * f).toFixed(1)); o.setAttribute('y', 144 + 32 * j); op(o, Math.sin(Math.PI * f)); });
      risco.setAttribute('d', c.risco ? 'M' + (XC - 46) + ' 110 l26 0' : ''); op(risco, 0);
      /* bolhas */
      function bol(arr, x, n, on) { arr.forEach(function (b, j) { var f = (t * .8 + j / arr.length) % 1, vis = on && j < n * 3; b.setAttribute('cx', (x + (j % 2 ? 11 : -11) + 2 * Math.sin(6 * f + j)).toFixed(1)); b.setAttribute('cy', (178 - 64 * f).toFixed(1)); b.setAttribute('r', (2.5 + 1.5 * f).toFixed(1)); op(b, vis ? Math.sin(Math.PI * f) : 0); }); }
      bol(BA, XA, c.bA, true); bol(BC, XC, c.bC, c.bC > 0);
      nota.textContent = '';
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CG = { 'W83dc27f': D - .05, 'W5b2ee6b': 2 * D - .05, 'P5cd9dda': 3 * D - .05, 'Pc6e102f': 3 * D - .05, 'P68ade81': 3 * D - .05, 'P155cb65': 4 * D - .05, 'Pb19b943': 5 * D - .05, 'P039098d': 5 * D - .05 };
    return fimResposta(VIS.def['eletrolise-produtos'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 5 * D - .05; }
    });
  }
};
VIS.liga('eletrolise-produtos', ['W83dc27f', 'W5b2ee6b', 'P5cd9dda', 'Pc6e102f', 'P68ade81', 'P155cb65', 'Pb19b943', 'P039098d']);
