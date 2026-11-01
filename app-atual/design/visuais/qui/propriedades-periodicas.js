/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid).
   R[qid] = ['Por isso a resposta é X', 'linha', ...]. Sem entrada para o qid, o visual fica como era. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var n = r.length - 1, w = opc.w || 560, h = opc.h || 62 + 22 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  if (opc.base) { h = Math.max(h, opc.hmin || 0); y = vb[3] - h - 4; }
  if (y + h > vb[3] - 3) y = vb[3] - h - 3;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 20, y: y + 33, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 20, y: y + 61 + 22 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;   /* quadro congelado na etapa Resposta */
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .16 : 1; c.style.opacity = on ? 1 : 0;
    (opc.oculta || []).forEach(function (o) { o.style.visibility = on ? 'hidden' : 'visible'; });
  };
}
var RESP = {
'Wd135a0d': [
'Por isso a resposta é A',
'No 2º período o raio cai de B para O: a carga nuclear cresce (+5 → +8)',
'e os elétrons ficam na mesma camada, cada vez mais puxados.',
'Ordem do raio: O < N < C < B. A carga nuclear efetiva é maior no O.'
],
'P0d022d4': [
'Por isso a resposta é B',
'Na⁺ (22,99 u; 102 pm) é mais pesado e maior que Li⁺ (6,94 u; 76 pm).',
'Mais pesado: menos energia por grama. Maior: cabem menos íons',
'entre as camadas. A densidade de energia da bateria de Na é menor.'
],
'Wb2cd87f': [
'Por isso a resposta é C',
'Ânion ganha elétrons e cresce; quanto mais elétrons a mais',
'(maior a carga negativa), maior o raio: O < O⁻ < O²⁻.',
'Cátion é sempre menor que o átomo; isoeletrônicos diferem (Na⁺ > Mg²⁺).'
],
'W50e87d5': [
'Por isso a resposta é B (I, II e IV)',
'I: O atrai e⁻ (libera energia); O⁻ já é negativo e repele o novo e⁻.',
'II: tirar e⁻ do O neutro custa mais do que do O²⁻, que tem e⁻ sobrando.',
'III é falsa: o ânion O⁻ é maior que o átomo O.',
'IV: no gráfico, N (1402) > O (1314); o O tem mais afinidade eletrônica.'
],
'Wc66d563': [
'Por isso a resposta é A',
'Os picos do gráfico são He, Ne e Ar: camada de valência completa,',
'é muito difícil arrancar um elétron (energia de ionização alta)',
'e eles quase não aceitam elétron novo (afinidade eletrônica baixa).'
],
'P2449554': [
'Por isso a resposta é B',
'No 4º período a eletronegatividade cresce para a direita: Br (2,96)',
'é o maior dos quatro. A densidade é máxima no meio do período,',
'nos metais de transição: Co 8,9 g/cm³ (K 0,86; As 5,7; Br 3,1).'
],
'P36a3164': [
'Por isso a resposta é D',
'Menos reativa = ainda menos polar = menor diferença de eletronegatividade.',
'C–H: 0,35 (no gráfico da questão, 0,4). P–H: 0,01 (no gráfico, 0).',
'As outras (C–N, C–F, S–O, P–Cl) têm diferença maior que a de C–H.'
],
'P887dfa9': [
'Por isso a resposta é C',
'Ligação iônica exige grande diferença de eletronegatividade.',
'Cl (Z = 17, 3,16) e La (Z = 57, 1,10): diferença 2,06 (no gráfico, ≈ 1,9), a maior.',
'17 e 35 (Cl e Br) são vizinhos de família: diferença de só 0,20.'
]
};
VIS.def['propriedades-periodicas'] = {
  tit: 'Raio, energia de ionização e eletronegatividade',
  fontes: ['OpenStax, Chemistry 2e, 6.5 Periodic Variations in Element Properties — https://openstax.org/books/chemistry-2e/pages/6-5-periodic-variations-in-element-properties', 'OpenStax, Chemistry 2e, 7.2 Covalent Bonding (eletronegatividade de Pauling) — https://openstax.org/books/chemistry-2e/pages/7-2-covalent-bonding', 'Wikipedia (en), Covalent radius (Cordero et al., 2008) e Ionic radius (Shannon, 1976) — https://en.wikipedia.org/wiki/Covalent_radius', 'Wikipedia (en), Ionization energies of the elements (data page) — https://en.wikipedia.org/wiki/Ionization_energies_of_the_elements_(data_page)', 'Wikipedia (en), Electronegativities of the elements (data page) — https://en.wikipedia.org/wiki/Electronegativities_of_the_elements_(data_page)'],
  tipo: 'anim', dur: 19,
  marcas: [[0, 'Raio'], [4.5, 'Íons'], [9.5, 'Ionização'], [14, 'Eletroneg.']],
  cred: 'Animação feita para o app. Raios: covalente (Cordero, 2008) e iônico (Shannon, 1976), em pm, círculos na mesma escala. 1ª energia de ionização em kJ/mol; eletronegatividade na escala de Pauling.',
  nota: 'No período, a carga nuclear cresce e a camada é a mesma: o raio diminui e a energia de ionização e a eletronegatividade aumentam. Na família, cada período acrescenta uma camada: o raio aumenta. Cátion é menor que o átomo; ânion é maior.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function br(v, n) { return v.toFixed(n).replace('.', ','); }
    var AZ = '#2b6cb0', VM = '#b4442f', VD = '#1f8a70';
    var ST = { c: 'font-size:14px;fill:var(--tinta);text-anchor:middle', cb: 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', l: 'font-size:14px;fill:var(--lapis);text-anchor:middle' };
    svg.setAttribute('viewBox', '0 0 640 400');
    var K = 0.36;   /* px por pm */
    /* ---------- etapa 1: raio no 2o periodo ---------- */
    var g1 = el('g', {});
    var P2 = [['Li', 3, 128], ['Be', 4, 96], ['B', 5, 84], ['C', 6, 76], ['N', 7, 71], ['O', 8, 66], ['F', 9, 57]];
    var x = 64;
    P2.forEach(function (a, i) {
      var r = a[2] * K; if (i) x += r; a.x = x; a.r = r;
      a.c = el('circle', { cx: x, cy: 118, r: r, style: 'fill:color-mix(in srgb,' + AZ + ' ' + (12 + i * 4) + '%,var(--folha));stroke:' + AZ + ';stroke-width:1.6' }, g1);
      tx(x, 124, a[0], ST.cb, g1);
      tx(x, 52, '+' + a[1], 'font-size:14px;font-weight:700;fill:' + VM + ';text-anchor:middle', g1);
      tx(x, 186, a[2] + '', ST.c, g1);
      x += r + 18;
    });
    tx(14, 52, 'núcleo', 'font-size:14px;fill:' + VM, g1);
    tx(14, 186, 'pm', ST.l + ';text-anchor:start', g1);
    el('path', { d: 'M64 212 H560 m-10 -6 l10 6 l-10 6', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, g1);
    tx(312, 234, 'mesma camada, mais prótons puxando: o raio diminui', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g1);
    /* ---------- etapa 2: ions ---------- */
    var g2 = el('g', {});
    var IONS = [
      { s: 'Li', si: 'Li⁺', ra: 128, ri: 76, m: '6,94 u', d: 'perde 1 e⁻' },
      { s: 'Na', si: 'Na⁺', ra: 166, ri: 102, m: '22,99 u', d: 'perde 1 e⁻' },
      { s: 'Mg', si: 'Mg²⁺', ra: 141, ri: 72, m: '24,31 u', d: 'perde 2 e⁻' },
      { s: 'O', si: 'O²⁻', ra: 66, ri: 140, m: '16,00 u', d: 'ganha 2 e⁻' }
    ];
    var xs = [80, 228, 380, 532];
    IONS.forEach(function (o, i) {
      var cx = xs[i], cy = 116;
      o.cx = cx;
      o.fant = el('circle', { cx: cx, cy: cy, r: o.ra * K, style: 'fill:none;stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:5 4' }, g2);
      o.c = el('circle', { cx: cx, cy: cy, style: 'stroke-width:1.8' }, g2);
      o.t = tx(cx, cy + 6, '', ST.cb, g2);
      o.n = tx(cx, 196, '', ST.c, g2);
      o.dd = tx(cx, 218, '', 'font-size:14px;font-weight:700;text-anchor:middle', g2);
      tx(cx, 240, o.m, ST.l, g2);
    });
    tx(14, 34, 'átomo (tracejado) → íon', 'font-size:14px;fill:var(--lapis)', g2);
    /* ---------- etapa 3: 1a energia de ionizacao ---------- */
    var g3 = el('g', {});
    var EI = [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590];
    var SIM = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
    var GX0 = 92, GX1 = 610, GY0 = 222, GY1 = 34;
    function gx(z) { return GX0 + (GX1 - GX0) * (z - 1) / 19; }
    function gy(v) { return GY0 - (GY0 - GY1) * v / 2500; }
    el('path', { d: 'M' + GX0 + ' ' + GY1 + ' V' + GY0 + ' H' + GX1, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, g3);
    [0, 1000, 2000].forEach(function (v) { el('line', { x1: GX0 - 4, x2: GX1, y1: gy(v), y2: gy(v), style: 'stroke:var(--linha);stroke-width:1' }, g3); tx(GX0 - 8, gy(v) + 5, v + '', 'font-size:14px;fill:var(--lapis);text-anchor:end', g3); });
    tx(14, 22, 'kJ/mol', 'font-size:14px;fill:var(--lapis)', g3);
    tx(GX1, GY0 + 20, 'número atômico →', 'font-size:14px;fill:var(--lapis);text-anchor:end', g3);
    var curvaEI = el('path', { style: 'fill:none;stroke:' + AZ + ';stroke-width:2.6;stroke-linejoin:round' }, g3);
    var pts = EI.map(function (v, i) { return el('circle', { cx: gx(i + 1), cy: gy(v), r: 3.6, style: 'fill:' + AZ }, g3); });
    var rot3 = [];
    [[2, 'He', -10], [10, 'Ne', -10], [18, 'Ar', -10], [3, 'Li', 20], [11, 'Na', 20], [19, 'K', 20]].forEach(function (a) {
      var o = tx(gx(a[0]), gy(EI[a[0] - 1]) + a[2], a[1], 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + (a[2] < 0 ? VM : AZ), g3); rot3.push([o, a[0]]);
    });
    var no = el('g', {}, g3);
    el('circle', { cx: gx(7), cy: gy(1402), r: 8, style: 'fill:none;stroke:' + VD + ';stroke-width:2' }, no);
    el('circle', { cx: gx(8), cy: gy(1314), r: 8, style: 'fill:none;stroke:' + VD + ';stroke-width:2' }, no);
    tx(gx(7) - 4, gy(1402) - 14, 'N 1402', 'font-size:14px;font-weight:700;fill:' + VD + ';text-anchor:end', no);
    tx(gx(8) + 8, gy(1314) + 24, 'O 1314', 'font-size:14px;font-weight:700;fill:' + VD, no);
    /* ---------- etapa 4: eletronegatividade ---------- */
    var g4 = el('g', {});
    var EN = { H: 2.20, Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.90, P: 2.19, S: 2.58, Cl: 3.16, K: 0.82, Ca: 1.00, Sc: 1.36, Ti: 1.54, V: 1.63, Cr: 1.66, Mn: 1.55, Fe: 1.83, Co: 1.88, Ni: 1.91, Cu: 1.90, Zn: 1.65, Ga: 1.81, Ge: 2.01, As: 2.18, Se: 2.55, Br: 2.96, Kr: 3.00, La: 1.10 };
    var TAB = [['H', 1, 1], ['He', 1, 18], ['Li', 2, 1], ['Be', 2, 2], ['B', 2, 13], ['C', 2, 14], ['N', 2, 15], ['O', 2, 16], ['F', 2, 17], ['Ne', 2, 18],
      ['Na', 3, 1], ['Mg', 3, 2], ['Al', 3, 13], ['Si', 3, 14], ['P', 3, 15], ['S', 3, 16], ['Cl', 3, 17], ['Ar', 3, 18]];
    ['K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'].forEach(function (s, i) { TAB.push([s, 4, i + 1]); });
    TAB.push(['La', 6, 3]);
    var CW = 23, CH = 26, TX0 = 12, TY0 = 26;
    var cel = {};
    TAB.forEach(function (a) {
      var v = EN[a[0]], yy = TY0 + (a[1] === 6 ? 4.6 : a[1] - 1) * (CH + 2), xx = TX0 + (a[2] - 1) * CW;
      var p = v === undefined ? 0 : Math.round(8 + 80 * (v - 0.8) / 3.2);
      var r = el('rect', { x: xx, y: yy, width: CW - 2, height: CH, rx: 3, style: 'fill:' + (v === undefined ? 'color-mix(in srgb,var(--linha) 60%,var(--folha))' : 'color-mix(in srgb,' + AZ + ' ' + p + '%,var(--folha))') }, g4);
      tx(xx + (CW - 2) / 2, yy + 18, a[0], 'font-size:' + (a[0].length > 1 ? 13.5 : 14) + 'px;font-weight:600;text-anchor:middle;fill:' + (p > 50 ? '#fff' : 'var(--tinta)'), g4);
      cel[a[0]] = { x: xx, y: yy };
    });
    tx(TX0 + 3 * CW + 6, TY0 + 4.6 * (CH + 2) + 18, '← La: período 6, Z = 57', 'font-size:14px;fill:var(--lapis)', g4);
    el('path', { d: 'M220 214 L392 150 m-12 -1 l12 1 l-8 9', style: 'fill:none;stroke:' + VM + ';stroke-width:2.4' }, g4);
    tx(14, 240, 'cresce para cima e para a direita (gases nobres à parte)', 'font-size:14px;font-weight:700;fill:' + VM, g4);
    var dest = el('g', {}, g4);
    ['K', 'Co', 'As', 'Br'].forEach(function (s) { var c = cel[s]; el('rect', { x: c.x - 1.5, y: c.y - 1.5, width: CW + 1, height: CH + 3, rx: 4, style: 'fill:none;stroke:' + VM + ';stroke-width:2.2' }, dest); });
    /* diferencas */
    var DX = 438;
    tx(DX, 26, 'diferença de', 'font-size:14px;font-weight:700;fill:var(--tinta)', g4);
    tx(DX, 44, 'eletronegatividade', 'font-size:14px;font-weight:700;fill:var(--tinta)', g4);
    var PARES = qid === 'P36a3164' ? [['P', 'H'], ['C', 'H'], ['C', 'N'], ['P', 'Cl']] : [['P', 'H'], ['C', 'H'], ['Cl', 'Br'], ['Cl', 'La']];
    var barras = PARES.map(function (p, i) {
      var d = Math.abs(EN[p[0]] - EN[p[1]]), y = 62 + i * 38, w = d * 45;
      var gg = el('g', {}, g4);
      tx(DX, y + 15, p[0] + '–' + p[1], 'font-size:14px;font-weight:700;fill:var(--tinta)', gg);
      el('rect', { x: DX + 50, y: y + 2, width: Math.max(w, 2), height: 18, rx: 3, style: 'fill:' + (d > 1.7 ? VM : AZ) }, gg);
      tx(DX + 56 + Math.max(w, 2), y + 16, br(d, 2), 'font-size:14px;font-weight:700;fill:' + (d > 1.7 ? VM : AZ), gg);
      return gg;
    });
    tx(DX, 236, 'acima de ~1,7: iônica', 'font-size:14px;fill:' + VM, g4);
    tx(DX, 216, 'perto de 0: apolar', 'font-size:14px;fill:' + AZ, g4);
    /* ---------- painel de texto ---------- */
    el('line', { x1: 14, x2: 626, y1: 252, y2: 252, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 280, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2, 3].map(function (i) { return tx(18, 307 + 23 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Raio no período: diminui para a direita', 'De Li a F todos têm 2 camadas, mas a carga do núcleo sobe de +3 a +9.', 'Mais carga, mesma camada: os elétrons são mais puxados (carga nuclear', 'efetiva maior) e o átomo encolhe. Descendo a família, ganha camadas e cresce.'],
      ['2. Íons: cátion encolhe, ânion incha', 'Perdendo elétrons sobram prótons puxando menos elétrons: cátion menor.', 'Ganhando elétrons, eles se repelem: ânion maior (O < O⁻ < O²⁻).', 'Na⁺ e Mg²⁺ têm 10 e⁻ cada; o Mg²⁺ tem 2 prótons a mais e é menor.'],
      ['3. 1ª energia de ionização × número atômico', 'Energia para arrancar o elétron mais externo. Cresce no período', 'e despenca ao abrir camada nova (Li, Na, K). Picos: gases nobres.', 'N > O: o 4º elétron p do O fica emparelhado e sai mais fácil.'],
      ['4. Eletronegatividade (Pauling)', 'Força com que o átomo puxa o par da ligação: F é o maior (3,98).', 'A diferença entre os dois átomos diz o tipo de ligação:', 'perto de 0, covalente apolar; grande (cerca de 1,7 ou mais), iônica.']
    ];
    var _desenha = function (t) {
      var f = t < 4.5 ? 0 : t < 9.5 ? 1 : t < 14 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f === 0) P2.forEach(function (a, i) { op(a.c, cl((t - 0.2 - i * .45) / .4)); });
      if (f === 1) IONS.forEach(function (o, i) {
        var u = ease((t - 5.4 - i * .6) / .8), r = lerp(o.ra, o.ri, u) * K, an = o.ri > o.ra;
        var cor = an ? VD : VM;
        o.c.setAttribute('r', r.toFixed(1));
        o.c.setAttribute('style', 'stroke-width:1.8;fill:color-mix(in srgb,' + (u > .5 ? cor : AZ) + ' 16%,var(--folha));stroke:' + (u > .5 ? cor : AZ));
        o.t.textContent = u > .5 ? o.si : o.s; op(o.fant, u > .05 ? 1 : 0);
        o.n.textContent = u > .5 ? o.ra + ' → ' + o.ri + ' pm' : o.ra + ' pm';
        o.dd.textContent = u > .5 ? o.d : ''; o.dd.style.fill = cor;
      });
      if (f === 2) {
        var zMax = 1 + 19 * ease((t - 9.7) / 2.6), d = '';
        for (var z = 1; z <= zMax + 1e-6; z++) d += (d ? 'L' : 'M') + gx(z).toFixed(1) + ' ' + gy(EI[z - 1]).toFixed(1) + ' ';
        var zi = Math.floor(zMax), fr = zMax - zi;
        if (zi < 20 && fr > 0) d += 'L' + lerp(gx(zi), gx(zi + 1), fr).toFixed(1) + ' ' + lerp(gy(EI[zi - 1]), gy(EI[zi]), fr).toFixed(1);
        curvaEI.setAttribute('d', d);
        pts.forEach(function (p, i) { op(p, i + 1 <= zMax + 1e-6 ? 1 : 0); });
        rot3.forEach(function (r) { op(r[0], r[1] <= zMax + 1e-6 ? 1 : 0); });
        op(no, cl((t - 12.5) / .5));
      }
      if (f === 3) { barras.forEach(function (b, i) { op(b, cl((t - 15 - i * .5) / .4)); }); op(dest, qid === 'P2449554' ? cl((t - 17) / .4) : 0); }
      var T = TXT[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    return fimResposta(VIS.def['propriedades-periodicas'], svg, _desenha, 19, RESP, qid, { semEsmaecer: true, y: 258, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6,
      congela: function (q) { return q === 'Wd135a0d' ? 4.4 : ['P0d022d4', 'Wb2cd87f'].indexOf(q) >= 0 ? 9.4 : ['W50e87d5', 'Wc66d563'].indexOf(q) >= 0 ? 13.9 : 18.95; } });
  }
};
VIS.liga('propriedades-periodicas', ['P0d022d4', 'P2449554', 'P36a3164', 'W50e87d5', 'Wb2cd87f', 'Wc66d563', 'Wd135a0d', 'P887dfa9']);
