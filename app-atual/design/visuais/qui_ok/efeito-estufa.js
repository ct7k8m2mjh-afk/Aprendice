/* Efeito estufa: onda curta do Sol entra, a superficie devolve infravermelho que CO2/CH4/H2O retem;
   curva do CO2 desde 1750 (Law Dome + Mauna Loa) e o balanco de carbono fossil x etanol. */
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
'Pa46ca0c': ['Por isso a resposta é A',
'Entra onda curta (visível, UV) e a Terra devolve onda longa (infravermelho),',
'que o CO₂ retém. Derrubar floresta nativa aumenta o CO₂ do ar.'],
'P9d9ac02': ['Por isso a resposta é E',
'O CO₂ ficou perto de 280 ppm por séculos e subiu desde a Revolução Industrial',
'até cerca de 420 ppm em 2022 (+50 %): o efeito estufa se intensificou.'],
'Pab1f01a': ['Por isso a resposta é C',
'Mais CO₂ no ar retém mais infravermelho: é o aumento da taxa de CO₂',
'(queima de combustíveis fósseis) que intensifica o efeito estufa.'],
'P0c9f173': ['Por isso a resposta é E',
'O CO₂ tirado do ar para fazer o CH₄ volta na queima (1 C entra, 1 C sai):',
'saldo zero, como o etanol, cuja cana retirou do ar o CO₂ que a queima devolve.']
};
VIS.def['efeito-estufa'] = {
  tit: 'Efeito estufa: a luz entra, o infravermelho fica',
  fontes: ['OpenStax, Chemistry 2e, 6.1 Electromagnetic Energy (comprimento de onda) — https://openstax.org/books/chemistry-2e/pages/6-1-electromagnetic-energy', 'Wikipedia (en), Greenhouse effect (Sol emite onda curta; Terra emite infravermelho; N₂ e O₂ não absorvem IR) — https://en.wikipedia.org/wiki/Greenhouse_effect', 'NOAA Global Monitoring Laboratory, Mauna Loa CO₂ annual mean data (1960–2022) — https://gml.noaa.gov/ccgg/trends/data.html', 'Wikipedia (en), Carbon dioxide in Earth’s atmosphere (cerca de 280 ppm antes de 1750; testemunhos de gelo de Law Dome) — https://en.wikipedia.org/wiki/Carbon_dioxide_in_Earth%27s_atmosphere'],
  tipo: 'anim', dur: 14.5,
  marcas: [[0, 'Onda curta'], [3.5, 'Onda longa'], [7.5, 'CO₂ no ar'], [11, 'Balanço']],
  cred: 'Animação feita para o app (esquema fora de escala). CO₂: médias anuais de Mauna Loa (NOAA) desde 1960 e testemunhos de gelo antes disso, valores arredondados.',
  nota: 'Os gases estufa deixam passar a luz do Sol (onda curta) e absorvem o infravermelho (onda longa) que a superfície emite, devolvendo parte dele para baixo. Mais CO₂ no ar, mais calor retido. Combustível fóssil põe no ar carbono que estava enterrado; o etanol devolve o CO₂ que a cana tirou do ar.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 3.5, T2 = 7.5, T3 = 11, TF = 14.5;
    var SOL = '#e0a21b', IR = '#c0392b', GAS = '#5a6b7d', OK = '#2f8a5b', FOS = '#6b4f3a';
    /* onda senoidal de (x0,y0) a (x1,y1), comprimento de onda L, amplitude A, com ponta de seta */
    function onda(pai, x0, y0, x1, y1, L, A, cor, w) {
      var dx = x1 - x0, dy = y1 - y0, m = Math.hypot(dx, dy), ux = dx / m, uy = dy / m, nx = -uy, ny = ux, d = '';
      for (var s = 0; s <= m - 10; s += 2) { var a = A * Math.sin(2 * Math.PI * s / L); d += (d ? 'L' : 'M') + (x0 + ux * s + nx * a).toFixed(1) + ' ' + (y0 + uy * s + ny * a).toFixed(1) + ' '; }
      var g = el('g', {}, pai);
      var p = el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:' + (w || 2.4) + ';stroke-linecap:round' }, g);
      var ang = Math.atan2(dy, dx);
      el('path', { d: 'M' + (x1 - 11 * Math.cos(ang - .45)).toFixed(1) + ' ' + (y1 - 11 * Math.sin(ang - .45)).toFixed(1) + ' L' + x1 + ' ' + y1 + ' L' + (x1 - 11 * Math.cos(ang + .45)).toFixed(1) + ' ' + (y1 - 11 * Math.sin(ang + .45)).toFixed(1), style: 'fill:none;stroke:' + cor + ';stroke-width:' + (w || 2.4) + ';stroke-linejoin:round' }, g);
      g.len = m; return g;
    }
    function revela(g, u) { op(g, u > 0 ? 1 : 0); var c = g.firstChild; var L = g.len * 1.6; c.style.strokeDasharray = L.toFixed(0); c.style.strokeDashoffset = (L * (1 - cl(u))).toFixed(0); op(g.lastChild, u >= 1 ? 1 : 0); }
    /* ===== cena: Sol, atmosfera, superficie ===== */
    var cena = el('g', {});
    el('rect', { x: 0, y: 62, width: 640, height: 66, style: 'fill:color-mix(in srgb,#6aa7d8 16%,var(--folha))' }, cena);
    tx(630, 80, 'atmosfera', 'font-size:14px;font-weight:700;fill:#3f78a8;text-anchor:end', cena);
    var chao = el('rect', { x: 0, y: 178, width: 640, height: 32, style: 'fill:#8fae6e' }, cena);
    tx(630, 199, 'superfície', 'font-size:14px;font-weight:700;fill:#fff;text-anchor:end', cena);
    el('circle', { cx: 52, cy: 32, r: 22, style: 'fill:' + SOL }, cena);
    tx(84, 24, 'Sol', 'font-size:14px;font-weight:700;fill:#9a6d0a', cena);
    var curtas = [[96, 40, 200, 172], [120, 30, 290, 172], [150, 22, 380, 172]].map(function (c) { return onda(cena, c[0], c[1], c[2], c[3], 11, 4, SOL, 2.4); });
    var lCurta = tx(260, 50, 'onda curta (visível, UV): atravessa', 'font-size:14px;font-weight:700;fill:#9a6d0a', cena);
    /* gases */
    var GS = [{ x: 330, l: 'CO₂' }, { x: 440, l: 'CH₄' }, { x: 550, l: 'H₂O' }, { x: 172, l: 'N₂' }, { x: 240, l: 'O₂' }];
    var gas = GS.map(function (q, i) {
      var g = el('g', {}, cena), y = 100, est = i < 3;
      g.c = el('rect', { x: q.x - 22, y: y - 13, width: 44, height: 26, rx: 13, style: 'fill:' + (est ? GAS : '#b9c3cc') + ';stroke:var(--folha);stroke-width:1.5' }, g);
      tx(q.x, y + 5, q.l, 'font-size:14px;font-weight:700;text-anchor:middle;fill:#fff', g);
      g.x = q.x; return g;
    });
    var nN = tx(206, 148, 'não absorvem IR', 'font-size:14px;fill:var(--lapis);text-anchor:middle', cena);
    var sobe = [330, 440, 550].map(function (x) { return onda(cena, x - 30, 176, x - 6, 116, 26, 6, IR, 2.6); });
    var volta = [330, 440, 550].map(function (x) { return onda(cena, x + 8, 116, x + 30, 172, 26, 6, IR, 2.2); });
    var fuga = [330, 440].map(function (x) { return onda(cena, x + 4, 86, x + 26, 40, 26, 6, IR, 2.2); });
    var passa = onda(cena, 112, 176, 122, 48, 26, 6, IR, 2.2);
    var lLonga = tx(150, 30, 'infravermelho (onda longa) sobe', 'font-size:14px;font-weight:700;fill:' + IR, cena);
    var lRe = tx(630, 30, 'reemitido para todo lado', 'font-size:14px;font-weight:700;text-anchor:end;fill:' + IR, cena);
    /* ===== grafico de CO2 ===== */
    var g3 = el('g', {});
    var DADOS = [[1750, 277], [1800, 283], [1850, 285], [1900, 296], [1950, 311], [1960, 317], [1970, 326], [1980, 339], [1990, 354], [2000, 370], [2010, 390], [2022, 419]];
    var X0 = 70, X1 = 600, Y0 = 186, Y1 = 26, A0 = 1750, A1 = 2022, P0 = 260, P1 = 430;
    function gx(a) { return X0 + (X1 - X0) * (a - A0) / (A1 - A0); }
    function gy(p) { return Y0 + (Y1 - Y0) * (p - P0) / (P1 - P0); }
    el('path', { d: 'M' + X0 + ' ' + (Y1 - 6) + ' V' + Y0 + ' H' + (X1 + 10), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, g3);
    [280, 350, 420].forEach(function (p) { el('line', { x1: X0, x2: X1, y1: gy(p), y2: gy(p), style: 'stroke:var(--linha);stroke-width:1' }, g3); tx(X0 - 8, gy(p) + 5, p, 'font-size:14px;fill:var(--lapis);text-anchor:end', g3); });
    tx(14, 16, 'CO₂ (ppm)', 'font-size:14px;font-weight:700;fill:var(--lapis)', g3);
    [1750, 1800, 1850, 1900, 1950, 2000].forEach(function (a) { tx(gx(a), Y0 + 20, a, 'font-size:14px;fill:var(--lapis);text-anchor:middle', g3); });
    var curva = el('path', { style: 'fill:none;stroke:' + IR + ';stroke-width:3;stroke-linejoin:round' }, g3);
    var pto = el('circle', { r: 5, style: 'fill:' + IR }, g3);
    el('line', { x1: gx(1780), x2: gx(1780), y1: Y1 + 26, y2: Y0, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, g3);
    tx(gx(1780) + 6, Y1 + 40, 'Revolução Industrial', 'font-size:14px;fill:var(--lapis)', g3);
    var a280 = tx(gx(1752), gy(280) - 10, '≈ 280 ppm', 'font-size:15px;font-weight:700;fill:var(--tinta)', g3);
    var a420 = tx(gx(2022) - 30, gy(419) + 4, '≈ 420 ppm (2022)', 'font-size:15px;font-weight:700;fill:' + IR + ';text-anchor:end', g3);
    var aum = Math.round((420 - 280) / 280 * 100);
    var aT = tx(gx(1800), gy(372), '+' + aum + ' % em relação a 280 ppm', 'font-size:15px;font-weight:700;fill:' + IR, g3);
    /* ===== balanco ===== */
    var g4 = el('g', {});
    function seta(pai, d, cor) { return el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round' }, pai); }
    var b1 = el('g', {}, g4), b2 = el('g', {}, g4);
    tx(160, 22, 'combustível fóssil', 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + FOS, b1);
    el('rect', { x: 40, y: 34, width: 240, height: 34, rx: 8, style: 'fill:color-mix(in srgb,#6aa7d8 16%,var(--folha))' }, b1);
    tx(160, 57, 'ar: CO₂ aumenta', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + IR, b1);
    el('rect', { x: 40, y: 150, width: 240, height: 46, rx: 8, style: 'fill:color-mix(in srgb,' + FOS + ' 22%,var(--folha))' }, b1);
    tx(160, 170, 'carbono enterrado há', 'font-size:14px;text-anchor:middle;fill:var(--tinta)', b1);
    tx(160, 188, 'milhões de anos', 'font-size:14px;text-anchor:middle;fill:var(--tinta)', b1);
    var s1 = seta(b1, 'M160 146 V74 m-7 9 l7 -9 l7 9', IR);
    tx(172, 116, 'queima → CO₂', 'font-size:14px;font-weight:700;fill:' + IR, b1);
    tx(480, 22, 'etanol (cana)', 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + OK, b2);
    el('rect', { x: 360, y: 34, width: 240, height: 34, rx: 8, style: 'fill:color-mix(in srgb,#6aa7d8 16%,var(--folha))' }, b2);
    tx(480, 57, 'ar: saldo ≈ zero', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + OK, b2);
    el('rect', { x: 360, y: 150, width: 240, height: 46, rx: 8, style: 'fill:color-mix(in srgb,' + OK + ' 16%,var(--folha))' }, b2);
    tx(480, 178, 'cana → etanol', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--tinta)', b2);
    var s2 = seta(b2, 'M430 74 V146 m-7 -9 l7 9 l7 -9', OK), s3 = seta(b2, 'M530 146 V74 m-7 9 l7 -9 l7 9', IR);
    tx(422, 104, 'fotossíntese', 'font-size:14px;font-weight:700;fill:' + OK + ';text-anchor:end', b2);
    tx(422, 122, 'tira CO₂', 'font-size:14px;font-weight:700;fill:' + OK + ';text-anchor:end', b2);
    tx(540, 104, 'queima', 'font-size:14px;font-weight:700;fill:' + IR, b2);
    tx(540, 122, 'devolve', 'font-size:14px;font-weight:700;fill:' + IR, b2);
    el('line', { x1: 320, x2: 320, y1: 10, y2: 206, style: 'stroke:var(--linha);stroke-width:1.5' }, g4);
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 222, y2: 222, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 246, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 271 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. A luz do Sol entra (onda curta)', 'O Sol, muito quente, emite onda curta (visível, UV e IV próximo):', 'comprimentos de onda curtos, que atravessam quase toda a atmosfera.', 'A superfície absorve essa energia e se aquece.'],
      ['2. A Terra devolve infravermelho (onda longa)', 'A superfície, bem mais fria, emite infravermelho. CO₂, CH₄ e H₂O absorvem', 'essa onda longa e a reemitem para todo lado, parte de volta para baixo:', 'o calor demora a sair. N₂ e O₂ deixam o infravermelho passar.'],
      ['3. Mais CO₂, mais calor retido', 'O CO₂ ficou perto de 280 ppm por séculos e disparou com a queima de', 'carvão, petróleo e gás e com o desmatamento: cerca de 420 ppm em 2022.', 'Isso intensifica o efeito estufa e o aquecimento global.'],
      ['4. De onde veio o carbono que se queima?', 'Combustível fóssil solta carbono que estava enterrado: o CO₂ do ar aumenta.', 'O etanol devolve o CO₂ que a cana tirou do ar na fotossíntese: saldo', 'perto de zero no ciclo. O mesmo vale para CH₄ feito com CO₂ do ar.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(cena, f < 2 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      curtas.forEach(function (g, i) { revela(g, (t - .3 - .35 * i) / 1.3); op(g, f === 0 ? (t > .3 + .35 * i ? 1 : 0) : .2); });
      op(lCurta, f === 0 ? cl((t - 1) / .4) : 0);
      var aq = f === 0 ? cl((t - 1.8) / 1.2) : 1;
      chao.style.fill = 'color-mix(in srgb,#c8743a ' + Math.round(45 * aq) + '%,#8fae6e)';
      var s = t - T1;
      sobe.forEach(function (g, i) { revela(g, f === 1 ? (s - .2 - .25 * i) / .9 : 0); });
      gas.forEach(function (g, i) { var on = f === 1 && i < 3 && s > 1.1 + .25 * i; g.c.style.stroke = on ? IR : 'var(--folha)'; g.c.style.strokeWidth = on ? 3 : 1.5; });
      volta.forEach(function (g, i) { revela(g, f === 1 ? (s - 1.5 - .25 * i) / .8 : 0); });
      fuga.forEach(function (g, i) { revela(g, f === 1 ? (s - 1.6 - .25 * i) / .7 : 0); });
      revela(passa, f === 1 ? (s - .4) / 1.3 : 0);
      op(lLonga, f === 1 ? cl((s - .6) / .4) : 0); op(lRe, f === 1 ? cl((s - 2.2) / .4) : 0); op(nN, f === 1 ? cl((s - 1.5) / .4) : 0);
      gas.forEach(function (g, i) { op(g, f === 1 ? 1 : 0); });
      /* grafico */
      var ag = lerp(A0, A1, ease((t - T2 - .3) / 2.4)), d = '', last = DADOS[0];
      for (var k = 0; k < DADOS.length; k++) {
        var p = DADOS[k];
        if (p[0] <= ag) { d += (d ? 'L' : 'M') + gx(p[0]).toFixed(1) + ' ' + gy(p[1]).toFixed(1) + ' '; last = p; }
        else { var q = DADOS[k - 1], v = (ag - q[0]) / (p[0] - q[0]); last = [ag, lerp(q[1], p[1], v)]; d += 'L' + gx(ag).toFixed(1) + ' ' + gy(last[1]).toFixed(1); break; }
      }
      curva.setAttribute('d', d); pto.setAttribute('cx', gx(last[0]).toFixed(1)); pto.setAttribute('cy', gy(last[1]).toFixed(1));
      op(a280, cl((t - T2 - .4) / .4)); op(a420, ag >= A1 ? 1 : 0); op(aT, cl((t - T2 - 3) / .4));
      /* balanco */
      op(b1, cl((t - T3) / .4)); op(b2, cl((t - T3 - 1.2) / .4));
      var L = TXT[f];
      for (var j2 = 0; j2 < 4; j2++) P[j2].textContent = L[j2] || '';
    };
    return fimResposta(VIS.def['efeito-estufa'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'Pa46ca0c' ? T2 - .01 : q === 'P0c9f173' ? TF - .01 : T3 - .01; }
    });
  }
};
VIS.liga('efeito-estufa', ['Pa46ca0c', 'P9d9ac02', 'Pab1f01a', 'P0c9f173']);
