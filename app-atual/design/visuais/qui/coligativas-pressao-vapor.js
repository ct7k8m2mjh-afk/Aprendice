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
'P87dfdda': [
'Por isso a resposta é A',
'Mais partículas dissolvidas, menor a pressão de vapor.',
'Água pura: 0. Glicose 1 mol/L: 1 mol/L. NaF 1 mol/L: Na⁺ + F⁻ = 2 mol/L.',
'PV1 > PV3 > PV2.'
],
'W678bc00': [
'Por isso a resposta é D',
'Partículas: sacarose 0,1 e 0,2; HCl 0,1 → 0,2; HCl 0,2 → 0,4;',
'NaOH 0,1 → 0,2 mol/L. O HCl 0,2 mol/L tem mais partículas',
'e por isso a menor pressão de vapor.'
],
'Pf4273f3': [
'Por isso a resposta é C',
'Glicose 2 mol/L → 2 mol/L de partículas; KCl 1 mol/L → 2 mol/L;',
'Al(NO₃)₃ 1 mol/L → 4 mol/L. Soluções 1 e 2 têm o mesmo número',
'de partículas: mesma temperatura de ebulição (a 3 ferve acima).'
],
'P498924c': [
'Por isso a resposta é A',
'Partículas: III HCl 2,0; IV Na₂SO₄ 1,8; V NaCl 1,6; II H₂SO₄ 1,5;',
'I glicose 0,9 mol/L. Mais partículas, menor a temperatura',
'de congelamento: III < IV < V < II < I.'
],
'W49db80b': [
'Por isso a resposta é A',
'Qualquer soluto dissolvido abaixa a temperatura de congelamento.',
'A água pura congela a 0 °C, acima de todas as soluções:',
'é a primeira a congelar.'
],
'P35627c5': [
'Por isso a resposta é A',
'Ferve quando a pressão de vapor iguala a pressão externa. Com 0,3 atm,',
'o líquido ferve com pressão de vapor de 0,3 atm, mais baixa que 1 atm,',
'numa temperatura mais baixa; e o vapor condensa também a T mais baixa.'
],
'Wde3df6c': [
'Por isso a resposta é C',
'Na fervura só a água vira vapor; o NaCl fica no líquido.',
'A concentração de soluto aumenta, a pressão de vapor cai mais',
'e a temperatura de ebulição continua subindo.'
]
};
VIS.def['coligativas-pressao-vapor'] = {
  tit: 'Mais partículas, menos pressão de vapor',
  fontes: ['OpenStax, Chemistry 2e, 11.4 Colligative Properties (lei de Raoult, Kb = 0,512 e Kf = 1,86 °C·kg/mol para a água) — https://openstax.org/books/chemistry-2e/pages/11-4-colligative-properties', 'OpenStax, Chemistry 2e, 10.3 Phase Transitions (pressão de vapor e ebulição) — https://openstax.org/books/chemistry-2e/pages/10-3-phase-transitions'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Vapor'], [3, 'Partículas'], [6, 'Ebulição'], [9, 'P externa'], [12, 'Fervura']],
  cred: 'Animação feita para o app. Curvas de pressão de vapor da água calculadas no código (Clausius-Clapeyron); o afastamento da curva da solução está exagerado para ficar visível.',
  nota: 'Efeito coligativo depende do número de partículas dissolvidas, não de qual é o soluto: conte íons (NaCl dá 2, CaCl₂ dá 3, Al(NO₃)₃ dá 4) e moléculas (glicose e sacarose dão 1). Para 1 mol de partículas por kg de água: ebulição sobe ≈ 0,51 °C e congelamento desce ≈ 1,86 °C.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vg(v, d) { return v.toFixed(d).replace('.', ','); }
    var AGU = '#2b7bbf', SOL = '#c97a1a', VAP = '#5a9ccf';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    var sem = 9; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    /* ===== cena 1: dois frascos fechados ===== */
    var c1 = el('g', {});
    function frasco(x0, nome, nSol, nVap) {
      var g = el('g', {}, c1), f = { x0: x0, vap: [] };
      el('rect', { x: x0, y: 46, width: 220, height: 150, rx: 8, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2' }, g);
      el('rect', { x: x0 + 2, y: 130, width: 216, height: 64, style: 'fill:color-mix(in srgb,' + AGU + ' 20%,var(--folha))' }, g);
      tx(x0 + 110, 36, nome, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      for (var k = 0; k < 30; k++) el('circle', { cx: x0 + 10 + 200 * rnd(), cy: 136 + 54 * rnd(), r: 3, style: 'fill:' + AGU + ';opacity:.6' }, g);
      for (k = 0; k < nSol; k++) el('circle', { cx: x0 + 14 + (192 / nSol) * (k + .5), cy: 134 + (k % 3) * 20, r: 5.5, style: 'fill:' + SOL }, g);
      for (k = 0; k < nVap; k++) f.vap.push({ c: el('circle', { r: 3.2, style: 'fill:' + VAP }, g), x: x0 + 12 + 196 * rnd(), f: rnd() });
      f.bar = el('rect', { x: x0 + 228, width: 14, style: 'fill:' + VAP }, g);
      return f;
    }
    var FA = frasco(30, 'água pura', 0, 16), FB = frasco(350, 'água + soluto', 9, 10);
    tx(150, 216, 'mais moléculas escapam', 'font-size:14px;fill:var(--tinta);text-anchor:middle', c1);
    tx(470, 216, 'fração de água menor: escapam menos', 'font-size:14px;fill:var(--tinta);text-anchor:middle', c1);
    tx(612, 62, 'Pv', 'font-size:14px;font-weight:700;fill:' + VAP + ';text-anchor:middle', c1); tx(292, 62, 'Pv', 'font-size:14px;font-weight:700;fill:' + VAP + ';text-anchor:middle', c1);
    /* ===== cena 2: contar particulas ===== */
    var c2 = el('g', {});
    var SOLU = [['glicose', 1, 1], ['NaCl', 1, 2], ['CaCl₂', 1, 3], ['Al(NO₃)₃', 1, 4], ['glicose', 2, 1], ['KCl', 1, 2]];
    tx(16, 30, 'mol/L de partículas = concentração × partículas por fórmula', 'font-size:15px;font-weight:700;fill:var(--tinta)', c2);
    var BARS = SOLU.map(function (s, k) {
      var g = el('g', {}, c2), x = 28 + 100 * k, p = s[1] * s[2], h = 30 * p;
      el('rect', { x: x, y: 176 - h, width: 64, height: h, rx: 4, style: 'fill:color-mix(in srgb,' + SOL + ' 30%,var(--folha));stroke:' + SOL + ';stroke-width:1.5' }, g);
      tx(x + 32, 170 - h, p + ' mol/L', 'font-size:14px;font-weight:700;fill:' + SOL + ';text-anchor:middle', g);
      tx(x + 32, 196, s[0], 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      tx(x + 32, 214, s[1] + ' mol/L × ' + s[2], 'font-size:14px;fill:var(--lapis);text-anchor:middle', g);
      return g;
    });
    var igual = el('path', { d: 'M' + (28 + 100 * 4 + 32) + ' 92 V80 H' + (28 + 100 * 5 + 32) + ' V92', style: 'fill:none;stroke:var(--ad-c);stroke-width:2' }, c2);
    var igualT = tx(28 + 100 * 4.5 + 32, 74, 'mesmo efeito', 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:middle', c2);
    /* ===== cenas 3 e 4: curvas de pressao de vapor ===== */
    var c34 = el('g', {});
    var B = 4895, A0 = B / 373.15, FATOR = .8;   /* agua: P = 1 atm a 100 C; solucao: Raoult com fator exagerado */
    function Pv(T, f) { return f * Math.exp(A0 - B / (T + 273.15)); }
    function Teb(P, f) { return B / (A0 - Math.log(P / f)) - 273.15; }
    var TX0 = 40, TX1 = 115, PY1 = 1.3;
    var GX0 = 70, GX1 = 370, GY0 = 200, GY1 = 34;
    function gx(T) { return GX0 + (GX1 - GX0) * (T - TX0) / (TX1 - TX0); }
    function gy(P) { return GY0 - (GY0 - GY1) * P / PY1; }
    el('path', { d: 'M' + GX0 + ' ' + (GY1 - 6) + ' V' + GY0 + ' H' + (GX1 + 8), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, c34);
    tx(GX0 - 6, GY1 - 12, 'pressão de vapor (atm)', 'font-size:14px;font-weight:600;fill:var(--lapis)', c34);
    tx(GX1 + 8, GY0 + 18, 'T (°C)', 'font-size:14px;fill:var(--lapis);text-anchor:end', c34);
    [40, 60, 80, 100].forEach(function (T) { tx(gx(T), GY0 + 18, String(T), 'font-size:14px;fill:var(--tinta);text-anchor:middle', c34); });
    function curva(f) { var d = ''; for (var T = TX0; T <= TX1; T += 1) { var P = Pv(T, f); if (P > PY1) break; d += (d ? 'L' : 'M') + gx(T).toFixed(1) + ' ' + gy(P).toFixed(1) + ' '; } return d; }
    el('path', { d: curva(1), style: 'fill:none;stroke:' + AGU + ';stroke-width:3' }, c34);
    var cSol = el('path', { d: curva(FATOR), style: 'fill:none;stroke:' + SOL + ';stroke-width:3' }, c34);
    var lPA = tx(gx(101) - 46, gy(Pv(101, 1)) - 10, 'água', 'font-size:14px;font-weight:700;fill:' + AGU, c34);
    var lPS = tx(gx(106) + 4, gy(Pv(106, FATOR)) + 16, 'solução', 'font-size:14px;font-weight:700;fill:' + SOL, c34);
    var linP = el('line', { x1: GX0, x2: GX1, style: 'stroke:var(--tinta);stroke-width:1.4;stroke-dasharray:6 4' }, c34);
    var linPT = tx(GX0 + 6, 0, '', 'font-size:14px;font-weight:700;fill:var(--tinta)', c34);
    var vA = el('line', { style: 'stroke:' + AGU + ';stroke-width:1.4;stroke-dasharray:3 3' }, c34), vS = el('line', { style: 'stroke:' + SOL + ';stroke-width:1.4;stroke-dasharray:3 3' }, c34);
    var dA = el('circle', { r: 5.5, style: 'fill:' + AGU }, c34), dS = el('circle', { r: 5.5, style: 'fill:' + SOL }, c34);
    var lado = el('g', {}, c34);
    var L3 = [tx(410, 60, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', lado), tx(410, 84, '', 'font-size:14px;fill:var(--tinta)', lado), tx(410, 106, '', 'font-size:14px;fill:var(--tinta)', lado), tx(410, 136, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', lado), tx(410, 160, '', 'font-size:14px;fill:var(--tinta)', lado), tx(410, 182, '', 'font-size:14px;fill:var(--tinta)', lado)];
    var Kb = 0.512, Kf = 1.86;
    /* ===== cena 5: fervura concentra ===== */
    var c5 = el('g', {});
    el('path', { d: 'M150 70 V196 H330 V70', style: 'fill:none;stroke:var(--tinta);stroke-width:2.2' }, c5);
    var liq = el('rect', { x: 152, width: 176, style: 'fill:color-mix(in srgb,' + AGU + ' 20%,var(--folha))' }, c5);
    var ions = []; for (var k = 0; k < 14; k++) ions.push({ c: el('circle', { r: 5, style: 'fill:' + SOL }, c5), u: rnd(), v: rnd() });
    var vapor = []; for (k = 0; k < 5; k++) vapor.push(el('circle', { r: 3.5, style: 'fill:' + VAP }, c5));
    for (k = 0; k < 3; k++) el('path', { d: 'M' + (200 + 40 * k) + ' 222 q-8 -9 0 -18 q8 9 0 18 Z', style: 'fill:#e07a2a;stroke:#b4442f;stroke-width:1' }, c5);
    el('rect', { x: 296, y: 30, width: 10, height: 150, rx: 5, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.5' }, c5);
    var term = el('rect', { x: 298, width: 6, style: 'fill:#c0392b' }, c5);
    var tT = tx(350, 60, '', 'font-size:16px;font-weight:700;fill:#c0392b', c5), mT = tx(350, 84, '', 'font-size:14px;fill:var(--tinta)', c5), mT2 = tx(350, 106, '', 'font-size:14px;fill:var(--tinta)', c5);
    tx(350, 150, 'sai só vapor de água;', 'font-size:14px;fill:var(--tinta)', c5); tx(350, 170, 'o NaCl fica no líquido', 'font-size:14px;fill:var(--tinta)', c5);
    /* ===== painel ===== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Pressão de vapor: quanto o líquido "escapa"', 'Em frasco fechado, moléculas saem da superfície e formam o vapor.', 'Com soluto não volátil, a fração de moléculas de água diminui: escapam menos', 'moléculas e a pressão de vapor fica menor (tonoscopia).'],
      ['O efeito depende do número de partículas', 'Conte as partículas soltas: molécula conta 1; sal conta os íons.', 'NaCl → Na⁺ + Cl⁻ (2); CaCl₂ (3); Al(NO₃)₃ (4); glicose e sacarose (1).', 'Glicose 2 mol/L e KCl 1 mol/L têm 2 mol/L de partículas: mesmo efeito.'],
      ['Pressão de vapor menor: ferve mais quente, congela mais frio', 'O líquido ferve quando a pressão de vapor chega à pressão externa.', 'A curva da solução fica abaixo: precisa de mais calor para chegar lá.', 'Também congela abaixo de 0 °C (crioscopia): água pura congela primeiro.'],
      ['Pressão externa menor: ferve a temperatura menor', 'Na destilação a vácuo (0,3 atm) basta a pressão de vapor chegar a 0,3 atm:', 'o líquido ferve e o vapor condensa a temperatura mais baixa.', 'Líquido com pressão de vapor maior (etanol) é mais volátil: evapora antes.'],
      ['Durante a fervura a temperatura sobe', 'Só a água evapora; o sal fica. A solução vai ficando mais concentrada,', 'a pressão de vapor cai mais e a temperatura de ebulição sobe.', 'Água pura, ao contrário, ferve a temperatura constante.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D;
      op(c1, i === 0 ? 1 : 0); op(c2, i === 1 ? 1 : 0); op(c34, i === 2 || i === 3 ? 1 : 0); op(c5, i === 4 ? 1 : 0);
      /* frascos */
      [FA, FB].forEach(function (f, j) {
        f.vap.forEach(function (v, k) { var w = (t * .35 + v.f) % 1; v.c.setAttribute('cx', (v.x + 6 * Math.sin(t * 2 + k)).toFixed(1)); v.c.setAttribute('cy', (126 - 74 * Math.abs(Math.sin(Math.PI * w))).toFixed(1)); });
        var h = (j ? 10 : 16) * 7; f.bar.setAttribute('y', 196 - h); f.bar.setAttribute('height', h);
      });
      BARS.forEach(function (b, k) { op(b, cl((u - .2 - .3 * k) / .3)); }); op(igual, cl((u - 2.2) / .3)); op(igualT, cl((u - 2.2) / .3));
      /* curvas */
      var Pext = i === 3 ? 1 - .7 * ease((u - .4) / 1.4) : 1;
      var TA = Teb(Pext, 1), TS = Teb(Pext, FATOR);
      linP.setAttribute('y1', gy(Pext).toFixed(1)); linP.setAttribute('y2', gy(Pext).toFixed(1));
      linPT.setAttribute('y', ((i === 3 && Pext < .7) ? gy(Pext) + 18 : gy(Pext) - 6).toFixed(1)); linPT.setAttribute('x', (i === 3 && Pext < .7) ? GX1 : GX0 + 6); linPT.style.textAnchor = (i === 3 && Pext < .7) ? 'end' : 'start'; linPT.textContent = 'pressão externa = ' + vg(Pext, 1) + ' atm';
      vA.setAttribute('x1', gx(TA).toFixed(1)); vA.setAttribute('x2', gx(TA).toFixed(1)); vA.setAttribute('y1', gy(Pext).toFixed(1)); vA.setAttribute('y2', GY0);
      vS.setAttribute('x1', gx(TS).toFixed(1)); vS.setAttribute('x2', gx(TS).toFixed(1)); vS.setAttribute('y1', gy(Pext).toFixed(1)); vS.setAttribute('y2', GY0);
      dA.setAttribute('cx', gx(TA).toFixed(1)); dA.setAttribute('cy', gy(Pext).toFixed(1)); dS.setAttribute('cx', gx(TS).toFixed(1)); dS.setAttribute('cy', gy(Pext).toFixed(1));
      op(cSol, i === 2 ? 1 : .25); op(lPS, i === 2 ? 1 : .25); op(vS, i === 2 ? 1 : 0); op(dS, i === 2 ? 1 : 0);
      var LL = i === 2 ? ['1 mol de partículas/kg de água:', 'ferve a 100 + ' + vg(Kb, 2) + ' = ' + vg(100 + Kb, 2) + ' °C', 'congela a 0 − ' + vg(Kf, 2) + ' = −' + vg(Kf, 2) + ' °C', '2 mol de partículas/kg:', 'ferve a ' + vg(100 + 2 * Kb, 2) + ' °C', 'congela a −' + vg(2 * Kf, 2) + ' °C']
        : ['Água pura:', 'a 1,0 atm ferve a 100 °C', 'a ' + vg(Pext, 1) + ' atm ferve a ≈ ' + Math.round(TA) + ' °C', 'Ferver = pressão de vapor', 'igual à pressão externa', ''];
      L3.forEach(function (l, k) { l.textContent = LL[k]; });
      /* fervura */
      var s5 = ease((u - .2) / 2.4), vol = 1 - .5 * s5, m = 1 / vol, Te = 100 + Kb * 2 * m;
      var hL = 110 * vol; liq.setAttribute('y', (194 - hL).toFixed(1)); liq.setAttribute('height', hL.toFixed(1));
      ions.forEach(function (o) { o.c.setAttribute('cx', (160 + 160 * o.u).toFixed(1)); o.c.setAttribute('cy', (194 - 8 - (hL - 16) * o.v).toFixed(1)); });
      vapor.forEach(function (v, k) { var w = (t * .6 + k / 5) % 1; v.setAttribute('cx', (180 + 26 * k).toFixed(1)); v.setAttribute('cy', (194 - hL - 50 * w).toFixed(1)); op(v, i === 4 ? Math.sin(Math.PI * w) : 0); });
      var hT = 40 + 60 * s5; term.setAttribute('y', (178 - hT).toFixed(1)); term.setAttribute('height', hT.toFixed(1));
      tT.textContent = 'ferve a ' + vg(Te, 2) + ' °C'; mT.textContent = 'NaCl: ' + vg(m, 2) + ' mol/kg'; mT2.textContent = '(' + vg(2 * m, 2) + ' mol/kg de íons)';
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CG = { 'P87dfdda': D - .05, 'W678bc00': 2 * D - .05, 'Pf4273f3': 2 * D - .05, 'P498924c': 2 * D - .05, 'W49db80b': 3 * D - .05, 'P35627c5': 4 * D - .05, 'Wde3df6c': 5 * D - .05 };
    return fimResposta(VIS.def['coligativas-pressao-vapor'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 5 * D - .05; }
    });
  }
};
VIS.liga('coligativas-pressao-vapor', ['P87dfdda', 'W678bc00', 'Pf4273f3', 'P498924c', 'W49db80b', 'P35627c5', 'Wde3df6c']);
