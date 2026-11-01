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
'Wbd8747c': ['Por isso a resposta é A', 'A 20 °C cabem 36 g de NaCl em 100 g de água.', 'Com 30 g ainda cabem mais 6 g: a solução é insaturada.'],
'Wbafeef1': ['Por isso a resposta é B', 'Cabem 30 g em 100 g de água → em 200 g cabem 60 g.', 'Dos 90 g, 60 g dissolvem e 30 g ficam no fundo:', 'solução saturada (com corpo de fundo).'],
'Wf083a58': ['Por isso a resposta é A', 'Cabem 12 g em 100 mL → em 600 mL cabem 72 g.', 'Dos 120 g, 72 g dissolvem e 48 g ficam no fundo:', 'sistema heterogêneo com 48 g de precipitado.'],
'Wabad928': ['Por isso a resposta é D', 'Solução de 250 g com 30 g de ureia → 220 g de água.', '30 g em 220 g = x em 100 g → x = 30 × 100 ÷ 220 ≈ 13,6 g.'],
'P0510093': ['Por isso a resposta é D', 'A 55 °C: 273 g por 100 g de água × 4 (400 g) = 1092 g dissolvidos.', 'A 30 °C cabem 219 × 4 = 876 g → cristalizam 1092 − 876 = 216 g.'],
'Pc1b5ccc': ['Por isso a resposta é D', 'Pelo gráfico (≈ 70 g a 90 °C): 1360 g saturada = 800 g de água + 560 g de sal.', 'A 50 °C cabem ≈ 50 g/100 g → 400 g; cristalizam ≈ 160 g.', '160 g ÷ 53,5 g/mol ≈ 3,0 mol em 1 L → cerca de 3,0 mol/L.'],
'Pe45804a': ['Por isso a resposta é A', 'O choque faz o excesso de sal cristalizar: esse processo libera calor', '(exotérmico) e aquece a mão. Para dissolver de novo é preciso dar', 'calor (endotérmico): por isso a bolsa vai à água quente.']
};
VIS.def['curva-solubilidade'] = {
  tit: 'Curva de solubilidade: quanto cabe e quanto cristaliza',
  fontes: ['OpenStax, Chemistry 2e, 11.3 Solubility (saturada, insaturada, supersaturada; curvas de solubilidade) — https://openstax.org/books/chemistry-2e/pages/11-3-solubility', 'Dados de solubilidade (g por 100 g de água): Wikipedia (en), Solubility table — https://en.wikipedia.org/wiki/Solubility_table', 'Wikipedia (en), Sodium acetate (bolsas térmicas, cristalização exotérmica) — https://en.wikipedia.org/wiki/Sodium_acetate'],
  tipo: 'anim', dur: 21,
  marcas: [[0, 'Cabe ou não'], [5, 'Escala'], [10, 'Resfriar'], [15.5, 'Supersat.']],
  cred: 'Animação feita para o app. Curvas com dados reais (g de soluto por 100 g de água); nas contas, os valores do enunciado.',
  nota: 'O coeficiente de solubilidade diz quanto soluto cabe em 100 g de água naquela temperatura. Abaixo da curva: insaturada; sobre a curva: saturada; o que passa da curva fica no fundo ou cristaliza ao esfriar. Acima da curva sem sólido: supersaturada, instável.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function br(v, n) { return v.toFixed(n).replace('.', ','); }
    function n0(v) { return Math.round(v).toString(); }
    var SOL = '#7d4fa8', AG = '#d6e7f6', VM = '#b4442f', AZ = '#2b6cb0', VD = '#1f8a70', CR = '#e9e2f2';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    /* curvas reais (0 a 100 °C de 10 em 10), Wikipedia Solubility table */
    var KNO3 = [13.3, 20.9, 31.6, 45.8, 63.9, 85.5, 110.0, 138, 169, 202, 246];
    var SAC = [181.9, 190.6, 201.9, 216.7, 235.6, 259.6, 288.8, 323.7, 365.1, 414.9, 476.0];
    var NH4 = [29.4, 33.2, 37.2, 41.4, 45.8, 50.4, 55.3, 60.2, 65.6, 71.2, 77.3];
    var ACE = [[0, 36.2], [10, 40.8], [20, 46.4], [30, 54.6], [40, 65.6], [60, 139], [80, 153], [90, 161], [100, 170]];
    function interp(pts, T) { for (var i = 1; i < pts.length; i++) if (T <= pts[i][0]) return lerp(pts[i - 1][1], pts[i][1], (T - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0])); return pts[pts.length - 1][1]; }
    function dez(a) { return a.map(function (v, i) { return [i * 10, v]; }); }
    function bequer(g, cx, w, yt, yb) { var x0 = cx - w / 2, x1 = cx + w / 2; el('path', { d: 'M' + (x0 - 5) + ' ' + yt + ' L' + x0 + ' ' + (yt + 5) + ' V' + yb + ' H' + x1 + ' V' + yt, style: 'fill:none;stroke:var(--lapis);stroke-width:2' }, g); }
    /* ---------- etapa 1: cabe ou nao (NaCl 20 °C, 36 g/100 g) ---------- */
    var g1 = el('g', {});
    tx(320, 24, 'NaCl em 100 g de água a 20 °C: cabem 36 g', 'font-size:16px;font-weight:700;fill:var(--tinta);' + C, g1);
    var CASO1 = [[30, 'insaturada', 'cabem mais 6 g', VD], [36, 'saturada', 'no limite', AZ], [40, 'saturada', '+ 4 g no fundo', VM]];
    var b1 = CASO1.map(function (c, i) {
      var cx = 110 + i * 210, g = el('g', {}, g1), o = { g: g };
      el('rect', { x: cx - 59, y: 110, width: 118, height: 90, style: 'fill:' + AG }, g);
      o.pts = []; for (var k = 0; k < 9; k++) o.pts.push(el('circle', { cx: cx - 46 + (k * 0.618 % 1) * 92, cy: 120 + ((k * 7) % 9) / 9 * 70, r: 3.6, style: 'fill:' + SOL }, g));
      o.fundo = el('path', { d: 'M' + (cx - 58) + ' 200 q20 -10 40 -6 q20 -8 40 0 q14 -4 36 6 Z', style: 'fill:' + CR + ';stroke:' + SOL + ';stroke-width:1.2' }, g);
      bequer(g, cx, 120, 70, 200);
      tx(cx, 56, c[0] + ' g de NaCl', 'font-size:15px;font-weight:700;fill:var(--tinta);' + C, g);
      o.v = el('g', {}, g);
      tx(cx, 226, c[1], 'font-size:16px;font-weight:700;fill:' + c[3] + ';' + C, o.v);
      tx(cx, 246, c[2], 'font-size:14px;fill:var(--tinta);' + C, o.v);
      return o;
    });
    /* ---------- etapa 2: escala para a massa de agua ---------- */
    var g2 = el('g', {});
    var E2 = {
      Wbafeef1: { S: 30, u: 'g', m: 200, add: 90, sal: 'CuSO₄', T: '30 °C' },
      Wf083a58: { S: 12, u: 'mL', m: 600, add: 120, sal: 'K₂Cr₂O₇', T: '20 °C' },
      Wabad928: { inv: true, sol: 250, res: 30, sal: 'ureia' }
    }[qid] || { S: 30, u: 'g', m: 200, add: 90, sal: 'CuSO₄', T: '30 °C' };
    var KB = 2.2;
    function barra(y, v, cor, rot, val, pai) { var g = el('g', {}, pai); tx(14, y + 19, rot, 'font-size:15px;font-weight:700;fill:var(--tinta)', g); var r = el('rect', { x: 200, y: y, height: 26, rx: 4, width: Math.max(2, v * KB), style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:' + cor + ';stroke-width:1.4' }, g); tx(208 + v * KB, y + 19, val, 'font-size:15px;font-weight:700;fill:' + cor, g); return g; }
    var linhas2 = [];
    if (!E2.inv) {
      var cap = E2.S * E2.m / 100, exc = E2.add - cap;
      tx(14, 26, E2.sal + ' a ' + E2.T + ': cabem ' + E2.S + ' g em 100 ' + E2.u + ' de água', 'font-size:16px;font-weight:700;fill:var(--tinta)', g2);
      linhas2.push(barra(48, E2.S, AZ, '100 ' + E2.u + ' de água', E2.S + ' g', g2));
      linhas2.push(barra(92, cap, AZ, E2.m + ' ' + E2.u + ' de água', E2.S + ' × ' + (E2.m / 100) + ' = ' + n0(cap) + ' g', g2));
      var gA = el('g', {}, g2); tx(14, 155, 'colocados', 'font-size:15px;font-weight:700;fill:var(--tinta)', gA);
      el('rect', { x: 200, y: 136, width: cap * KB, height: 26, rx: 4, style: 'fill:color-mix(in srgb,' + VD + ' 30%,var(--folha));stroke:' + VD + ';stroke-width:1.4' }, gA);
      tx(200 + cap * KB / 2, 155, 'dissolvem ' + n0(cap) + ' g', 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, gA);
      el('rect', { x: 200 + cap * KB, y: 136, width: exc * KB, height: 26, rx: 4, style: 'fill:color-mix(in srgb,' + VM + ' 30%,var(--folha));stroke:' + VM + ';stroke-width:1.4' }, gA);
      tx(200 + (cap + exc / 2) * KB, 155, 'fundo ' + n0(exc) + ' g', 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, gA);
      tx(14, 196, E2.add + ' g colocados − ' + n0(cap) + ' g que cabem = ' + n0(exc) + ' g de corpo de fundo', 'font-size:15px;fill:var(--tinta)', gA);
      tx(14, 222, 'saturada, com corpo de fundo (sistema heterogêneo)', 'font-size:16px;font-weight:700;fill:' + VM, gA);
      linhas2.push(gA);
    } else {
      var ag = E2.sol - E2.res, S = E2.res * 100 / ag;
      tx(14, 26, 'Solução saturada de ' + E2.sal + ': ' + E2.sol + ' g; ao evaporar a água sobram ' + E2.res + ' g', 'font-size:16px;font-weight:700;fill:var(--tinta)', g2);
      var gB2 = el('g', {}, g2);
      tx(14, 70, 'água = ' + E2.sol + ' − ' + E2.res + ' = ' + ag + ' g', 'font-size:17px;fill:var(--tinta)', gB2);
      linhas2.push(gB2);
      linhas2.push(barra(96, E2.res, AZ, ag + ' g de água', E2.res + ' g', g2));
      linhas2.push(barra(140, S, VM, '100 g de água', 'x = ' + E2.res + ' × 100 ÷ ' + ag + ' = ' + br(S, 1) + ' g', g2));
      var gC2 = el('g', {}, g2); tx(14, 206, 'coeficiente de solubilidade ≈ ' + br(S, 1) + ' g por 100 g de água', 'font-size:16px;font-weight:700;fill:' + VM, gC2); linhas2.push(gC2);
    }
    /* ---------- grafico generico (etapas 3 e 4) ---------- */
    function grafico(pai, pts, ymax, ydiv, xmax, cor, nome) {
      var G = { X0: 70, X1: 360, Y0: 236, Y1: 22, ymax: ymax, xmax: xmax };
      G.x = function (T) { return G.X0 + (G.X1 - G.X0) * T / xmax; }; G.y = function (v) { return G.Y0 - (G.Y0 - G.Y1) * v / ymax; };
      el('path', { d: 'M' + G.X0 + ' ' + G.Y1 + ' V' + G.Y0 + ' H' + G.X1, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, pai);
      for (var v = 0; v <= ymax; v += ydiv) { el('line', { x1: G.X0 - 4, x2: G.X1, y1: G.y(v), y2: G.y(v), style: 'stroke:var(--linha);stroke-width:1' }, pai); tx(G.X0 - 8, G.y(v) + 5, v + '', 'font-size:14px;fill:var(--lapis);text-anchor:end', pai); }
      for (var T = 0; T <= xmax; T += 20) tx(G.x(T), G.Y0 + 18, T + '', 'font-size:14px;fill:var(--lapis);' + C, pai);
      tx(G.X1, G.Y0 + 34, '°C', 'font-size:14px;fill:var(--lapis);text-anchor:end', pai);
      tx(14, 14, 'g / 100 g de água', 'font-size:14px;fill:var(--lapis)', pai);
      var d = ''; for (T = 0; T <= xmax; T += 1) { var s = interp(pts, T); if (s > ymax) break; d += (d ? 'L' : 'M') + G.x(T).toFixed(1) + ' ' + G.y(s).toFixed(1) + ' '; }
      el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:3' }, pai);
      G.nome = tx(G.x(xmax * .08), G.y(ymax * .92), nome, 'font-size:15px;font-weight:700;fill:' + cor, pai);
      G.pts = pts; return G;
    }
    /* ---------- etapa 3: resfriar ---------- */
    var g3 = el('g', {});
    var E3 = {
      P0510093: { pts: dez(SAC), ymax: 350, ydiv: 50, xmax: 70, nome: 'sacarose', agua: 400, T1: 55, S1: 273, T2: 30, S2: 219, dado: true },
      Pc1b5ccc: { pts: dez(NH4), ymax: 80, ydiv: 20, xmax: 100, nome: 'NH₄Cl', T1: 90, T2: 50, msol: 1360 }
    }[qid] || { pts: dez(KNO3), ymax: 150, ydiv: 50, xmax: 100, nome: 'KNO₃', agua: 100, T1: 60, S1: 60, T2: 20, unsat: true };
    var G3 = grafico(g3, E3.pts, E3.ymax, E3.ydiv, E3.xmax, AZ, E3.nome);
    if (!E3.dado) { if (!E3.unsat) E3.S1 = interp(E3.pts, E3.T1); E3.S2 = interp(E3.pts, E3.T2); }
    if (E3.msol) E3.agua = E3.msol * 100 / (100 + E3.S1);
    var Tcruza = E3.T1; if (E3.unsat) { for (var T = E3.T1; T >= 0; T -= .05) if (interp(E3.pts, T) <= E3.S1) { Tcruza = T; break; } }
    var dot3 = el('circle', { r: 7, style: 'fill:' + VM + ';stroke:var(--folha);stroke-width:2' }, g3);
    var trilha = el('path', { style: 'fill:none;stroke:' + VM + ';stroke-width:2;stroke-dasharray:5 4' }, g3);
    var crx = el('rect', { width: 10, style: 'fill:' + CR + ';stroke:' + SOL + ';stroke-width:1.4' }, g3);
    var info3 = []; for (var i = 0; i < 6; i++) info3.push(tx(384, 40 + i * 30, '', 'font-size:15px;fill:var(--tinta)', g3));
    var m1 = E3.S1 * E3.agua / 100, m2 = E3.S2 * E3.agua / 100, mc = m1 - m2;
    var L3 = E3.unsat ? [['100 g de água + 60 g de KNO₃', 'v'], ['a 60 °C cabem 110 g: insaturada', 'v'], ['esfriando, toca a curva a ' + n0(Tcruza) + ' °C:', 'b'], ['saturada, começa a cristalizar', 'b'], ['a 20 °C cabem 31,6 g', 'v'], ['→ ' + br(60 - 31.6, 1) + ' g de cristais', 'v']] :
      E3.dado ? [['400 g de água (4 × 100 g)', 'v'], ['55 °C: 273 × 4 = ' + n0(m1) + ' g dissolvidos', 'v'], ['esfria até 30 °C, pela curva', 'v'], ['30 °C: 219 × 4 = ' + n0(m2) + ' g cabem', 'v'], ['cristalizam ' + n0(m1) + ' − ' + n0(m2) + ' = ' + n0(mc) + ' g', 'b'], ['(valores da tabela do enunciado)', 'l']] :
      [['1360 g saturada a 90 °C (' + br(E3.S1, 1) + '/100)', 'v'], ['água ≈ ' + n0(E3.agua) + ' g; sal ≈ ' + n0(m1) + ' g', 'v'], ['50 °C: cabem ' + br(E3.S2, 1) + '/100 → ' + n0(m2) + ' g', 'v'], ['cristalizam ≈ ' + n0(mc) + ' g', 'b'], [n0(mc) + ' ÷ 53,5 ≈ ' + br(mc / 53.5, 1) + ' mol em 1 L', 'b'], ['lendo 70 e 50 no gráfico: 160 g → 3,0 mol/L', 'l']];
    L3.forEach(function (l, i) { info3[i].textContent = l[0]; info3[i].style.fontWeight = l[1] === 'b' ? 700 : 400; info3[i].style.fill = l[1] === 'b' ? VM : l[1] === 'l' ? 'var(--lapis)' : 'var(--tinta)'; if (l[1] === 'l') info3[i].style.fontSize = '14px'; });
    /* ---------- etapa 4: supersaturada (acetato de sodio) ---------- */
    var g4 = el('g', {});
    var G4 = grafico(g4, ACE, 180, 50, 100, '#c98a12', 'acetato de sódio');
    var dot4 = el('circle', { r: 7, style: 'fill:' + VM + ';stroke:var(--folha);stroke-width:2' }, g4);
    var trilha4 = el('path', { style: 'fill:none;stroke:' + VM + ';stroke-width:2;stroke-dasharray:5 4' }, g4);
    var sup = tx(G4.x(26), G4.y(150) - 14, 'supersaturada', 'font-size:15px;font-weight:700;fill:' + VM, g4);
    /* bolsa */
    var BX4 = 500, bol = el('g', {}, g4);
    var bolsa = el('rect', { x: BX4 - 80, y: 40, width: 160, height: 104, rx: 30, style: 'stroke:#9a8a6a;stroke-width:2' }, bol);
    var cristais = el('g', {}, bol); for (i = 0; i < 26; i++) el('path', { d: 'M' + (BX4 - 64 + (i * 0.618 % 1) * 128) + ' ' + (58 + ((i * 7) % 13) / 13 * 70) + ' l6 -4 l6 4 l-6 4 z', style: 'fill:#fff;stroke:#b9a77a;stroke-width:1' }, cristais);
    var disco = el('circle', { cx: BX4 + 40, cy: 92, r: 12, style: 'fill:#c9ccd0;stroke:#7d848b;stroke-width:1.5' }, bol);
    var calor = el('g', {}, bol); for (i = 0; i < 4; i++) el('path', { d: 'M' + (BX4 - 54 + i * 36) + ' 34 q-6 -7 0 -14 q6 -7 0 -14', style: 'fill:none;stroke:' + VM + ';stroke-width:2.2;stroke-linecap:round' }, calor);
    var b1t = tx(BX4, 172, '', 'font-size:15px;font-weight:700;' + C, g4), b2t = tx(BX4, 194, '', 'font-size:14px;fill:var(--tinta);' + C, g4), b3t = tx(BX4, 214, '', 'font-size:14px;fill:var(--tinta);' + C, g4);
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 272, y2: 272, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 298, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 326 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Coeficiente de solubilidade: quanto cabe', 'Abaixo do limite: insaturada (ainda dissolve mais). No limite: saturada.', 'O que passa do limite não dissolve e fica no fundo (corpo de fundo);', 'a solução em cima continua saturada.'],
      ['2. Ajuste para a água que você tem', 'O coeficiente vale para 100 g (ou 100 mL) de água; o resto é regra de três.', 'Compare o que cabe com o que foi colocado:', 'a diferença é o corpo de fundo.'],
      ['3. Esfriar: o que passa da curva cristaliza', 'Na maioria dos sais a solubilidade cai com a temperatura.', 'Esfriando, quando o ponto toca a curva a solução fica saturada;', 'dali para baixo, o excesso sai como cristais.'],
      ['4. Supersaturada: acima da curva, sem sólido', 'Dissolvido a quente e esfriado com cuidado, o excesso continua dissolvido:', 'é instável. Um choque faz cristalizar de uma vez; a cristalização libera', 'calor (exotérmica) e a bolsa esquenta. Dissolver de novo pede calor.']
    ];
    var _desenha = function (t) {
      var f = t < 5 ? 0 : t < 10 ? 1 : t < 15.5 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f === 0) b1.forEach(function (o, i) { var a = cl((t - .4 - i * .9) / .6); op(o.g, .25 + .75 * a); o.pts.forEach(function (p, k) { op(p, k < [7, 9, 9][i] ? a : 0); }); op(o.fundo, i === 2 ? cl((t - 2.6) / .4) : 0); op(o.v, cl((t - 3.2) / .4)); });
      if (f === 1) linhas2.forEach(function (g, i) { op(g, cl((t - 5.4 - i * .9) / .4)); });
      if (f === 2) {
        var u = ease((t - 10.4) / 3.6), T, S;
        if (E3.unsat) { var T0 = E3.T1, Tc = Tcruza, T2 = E3.T2, Tn = lerp(T0, T2, u); T = Tn; S = Tn > Tc ? E3.S1 : interp(E3.pts, Tn); }
        else { T = lerp(E3.T1, E3.T2, u); S = E3.dado ? lerp(E3.S1, E3.S2, (E3.T1 - T) / (E3.T1 - E3.T2)) : interp(E3.pts, T); }
        dot3.setAttribute('cx', G3.x(T).toFixed(1)); dot3.setAttribute('cy', G3.y(S).toFixed(1));
        trilha.setAttribute('d', 'M' + G3.x(T).toFixed(1) + ' ' + G3.y(E3.S1).toFixed(1) + ' V' + G3.y(S).toFixed(1));
        op(trilha, E3.unsat ? (T < Tcruza ? 1 : 0) : 1);
        var hc = 54 * cl((E3.S1 - S) / Math.max(1, E3.S1 - E3.S2));
        crx.setAttribute('x', (G3.x(T) - 5).toFixed(1)); crx.setAttribute('y', (G3.y(E3.S1)).toFixed(1)); crx.setAttribute('height', Math.max(0, G3.y(S) - G3.y(E3.S1)).toFixed(1)); op(crx, 0);
        info3.forEach(function (o, i) { op(o, cl((t - 10.4 - i * .7) / .4)); });
      }
      if (f === 3) {
        var a = ease((t - 15.8) / 1.6), c = ease((t - 18.2) / .8), Tb = lerp(80, 20, a), Sb = 150;
        if (c > 0) { Tb = lerp(20, 50, c); Sb = lerp(150, interp(ACE, 50), c); }
        dot4.setAttribute('cx', G4.x(Tb).toFixed(1)); dot4.setAttribute('cy', G4.y(Sb).toFixed(1));
        trilha4.setAttribute('d', 'M' + G4.x(80) + ' ' + G4.y(150) + ' L' + G4.x(20) + ' ' + G4.y(150) + (c > 0 ? ' L' + G4.x(Tb).toFixed(1) + ' ' + G4.y(Sb).toFixed(1) : ''));
        op(sup, a > .9 && c < .3 ? 1 : 0);
        bolsa.setAttribute('style', 'stroke:#9a8a6a;stroke-width:2;fill:' + (c > .5 ? '#f2ead8' : 'color-mix(in srgb,#f3ecd9 40%,#e8f1f8)'));
        op(cristais, c); op(calor, c > .6 ? 1 : 0); disco.setAttribute('r', t > 17.9 && t < 18.4 ? 9 : 12);
        b1t.textContent = c > .5 ? 'cristaliza: libera calor' : a > .9 ? 'líquida e fria, supersaturada' : 'dissolvido a quente (80 °C)';
        b1t.style.fill = c > .5 ? VM : 'var(--tinta)';
        b2t.textContent = c > .5 ? 'o ponto cai até a curva e' : a > .9 ? 'aperta o disco metálico:' : '150 g / 100 g de água';
        b3t.textContent = c > .5 ? 'a temperatura sobe' : a > .9 ? 'o choque inicia os cristais' : 'esfriando sem cristalizar';
      }
      var T_ = TXT[f]; L0.textContent = T_[0]; Ls.forEach(function (o, i) { o.textContent = T_[i + 1] || ''; });
    };
    var tCruza = 10.4 + 3.6 * 0.5;
    var FR = { Wbd8747c: 4.95, Wbafeef1: 9.95, Wf083a58: 9.95, Wabad928: 9.95, P0510093: 15.45, Pc1b5ccc: 15.45, Pe45804a: 20.95 };
    return fimResposta(VIS.def['curva-solubilidade'], svg, _desenha, 21, RESP, qid, { semEsmaecer: true, y: 278, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 20.95; } });
  }
};
VIS.liga('curva-solubilidade', ['P0510093', 'Pc1b5ccc', 'Pe45804a', 'Wabad928', 'Wbafeef1', 'Wbd8747c', 'Wf083a58']);
