/* Ciclo do nitrogenio: fixacao (Rhizobium nos nodulos; vida livre no solo), nitrosacao (Nitrosomonas), nitratacao (Nitrobacter),
   absorcao de nitrato pela raiz (o C entra como CO2 na fotossintese), amonificacao e desnitrificacao. Lote bio 9. */
/* etapa final "Resposta": congela o desenho no quadro que decide a questao aberta (qid) e mostra o porque.
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
  var n = r.length - 1, w = opc.w || 540, h = opc.h || 66 + 23 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
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
/* utilitarios de desenho */
function kit(svg) {
  var NS = 'http://www.w3.org/2000/svg', K = {};
  K.el = function (n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; };
  K.tx = function (x, y, s, st, pai) { var t = K.el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s || ''; return t; };
  K.cl = function (u) { return u < 0 ? 0 : u > 1 ? 1 : u; };
  K.ease = function (u) { u = K.cl(u); return u * u * (3 - 2 * u); };
  K.lerp = function (a, b, u) { return a + (b - a) * u; };
  K.op = function (o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0.001 ? 'none' : ''; };
  K.seta = function (pai, x1, y1, x2, y2, cor, w, extra) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 9;
    return K.el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - h * Math.cos(a - .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a - .45)).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - h * Math.cos(a + .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a + .45)).toFixed(1), style: 'fill:none;stroke:' + (cor || 'var(--lapis)') + ';stroke-width:' + (w || 2.2) + ';stroke-linecap:round;stroke-linejoin:round' + (extra || '') }, pai);
  };
  /* painel de texto embaixo: titulo + ate 2 linhas */
  K.painel = function (y0) {
    y0 = y0 || 282;
    K.el('line', { x1: 14, x2: 626, y1: y0, y2: y0, style: 'stroke:var(--linha);stroke-width:1.5' });
    var a = K.tx(16, y0 + 22, '', 'font-size:16.5px;font-weight:700;fill:var(--ad-t)');
    var b = K.tx(16, y0 + 43, '', 'font-size:14.5px;fill:var(--tinta)');
    var c = K.tx(16, y0 + 63, '', 'font-size:14.5px;fill:var(--tinta)');
    return function (L) { a.textContent = L[0]; b.textContent = L[1] || ''; c.textContent = L[2] || ''; };
  };
  K.etapa = function (t, M) { var i = 0; for (var k = 0; k < M.length; k++) if (t >= M[k]) i = k; return i; };
  return K;
}
var RESP = {
'Pa6cb65b': ['Por isso a resposta é E',
  'Fixação nos nódulos (Rhizobium), fixação no solo (vida livre),',
  'nitrosação (Nitrosomonas), nitratação (Nitrobacter) e',
  'desnitrificação: os cinco processos são feitos por bactérias.'],
'W030d180': ['Por isso a resposta é D',
  'O carbono entra pelas folhas, como CO₂, na fotossíntese.',
  'O nitrogênio entra pela raiz, como nitrato (NO₃⁻) do solo:',
  'a planta não consegue usar o N₂ do ar.'],
'Wa3cb711': ['Por isso a resposta é C (a incorreta)',
  'A equação II (NH₃ → HNO₂, o nitrito) é a nitrosação, feita',
  'por bactérias do solo (Nitrosomonas): é uma etapa do ciclo',
  'do nitrogênio, não um processo de animais.']
};
VIS.def['ciclo-nitrogenio'] = {
  tit: 'Ciclo do nitrogênio: quem transforma o N₂ em nitrato são bactérias',
  fontes: ['OpenStax, Biology 2e, 46.3 Biogeochemical Cycles, The Nitrogen Cycle (Rhizobium, Azotobacter, cianobactérias; amonificação; Nitrosomonas; desnitrificação por Pseudomonas e Clostridium) — https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles',
    'Wikipedia (en), Nitrogen cycle (nitrificação em duas etapas, Nitrosomonas e Nitrobacter; desnitrificação em condição anaeróbia; plantas absorvem nitrato e amônio) — https://en.wikipedia.org/wiki/Nitrogen_cycle',
    'Wikipedia (pt), Ciclo do nitrogênio — https://pt.wikipedia.org/wiki/Ciclo_do_nitrog%C3%AAnio'],
  tipo: 'anim', dur: 14,
  marcas: [[0, '1. N₂ no ar'], [2.8, '2. Fixação'], [5.6, '3. Nitrato'], [8.6, '4. Planta'], [11.4, '5. N₂ volta']],
  cred: 'Animação feita para o app (esquema fora de escala). Números 1 a 5 na ordem usada pela figura da Fatec: fixação nos nódulos, fixação no solo, nitrosação, nitratação e desnitrificação.',
  nota: 'A planta absorve nitrogênio pela raiz como nitrato (NO₃⁻) e também amônio (NH₄⁺); o carbono entra pelas folhas como CO₂. O N₂ do ar só entra nos seres vivos pelas bactérias fixadoras.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 2.8, 5.6, 8.6, 11.4], TF = 14;
    var BAC = '#7a4fa0', PL = '#3f8a3a', SOLO = '#8a6a44';
    /* ceu e solo */
    el('rect', { x: 0, y: 0, width: 640, height: 140, style: 'fill:color-mix(in srgb,#8fc0e8 16%,var(--folha))' });
    el('rect', { x: 0, y: 140, width: 640, height: 136, style: 'fill:color-mix(in srgb,#b08a5a 16%,var(--folha))' });
    el('line', { x1: 0, x2: 640, y1: 140, y2: 140, style: 'stroke:#8a6a44;stroke-width:2' });
    tx(14, 160, 'solo', 'font-size:13px;font-weight:600;fill:' + SOLO);
    /* caixas de compostos */
    function caixa(x, y, w, l1, l2, cor) {
      var g = el('g', {});
      el('rect', { x: x, y: y, width: w, height: 42, rx: 9, style: 'fill:var(--folha);stroke:' + cor + ';stroke-width:2' }, g);
      tx(x + w / 2, y + 19, l1, 'font-size:15px;font-weight:700;fill:' + cor + ';text-anchor:middle', g);
      tx(x + w / 2, y + 35, l2, 'font-size:13px;fill:var(--lapis);text-anchor:middle', g);
      return g;
    }
    var N2 = caixa(16, 12, 176, 'N₂  (N≡N)', '78% do ar', '#2b6cb0');
    var NH = caixa(16, 226, 132, 'NH₃ / NH₄⁺', 'amônia / amônio', '#a05a1a');
    var NO2 = caixa(244, 226, 112, 'NO₂⁻', 'nitrito', '#a07a10');
    var NO3 = caixa(456, 226, 112, 'NO₃⁻', 'nitrato', '#2f7a34');
    /* planta leguminosa */
    var P = el('g', {});
    el('path', { d: 'M330 140 C328 112 334 86 330 56', style: 'fill:none;stroke:' + PL + ';stroke-width:4;stroke-linecap:round' }, P);
    [[312, 66, -30], [350, 78, 30], [314, 100, -25], [348, 112, 25], [330, 50, 0]].forEach(function (f) {
      el('ellipse', { cx: f[0], cy: f[1], rx: 16, ry: 8, transform: 'rotate(' + f[2] + ' ' + f[0] + ' ' + f[1] + ')', style: 'fill:color-mix(in srgb,' + PL + ' 55%,var(--folha));stroke:' + PL + ';stroke-width:1.5' }, P);
    });
    ['M330 140 C326 160 318 178 300 200', 'M330 140 C334 162 344 180 360 196', 'M330 140 C330 165 331 185 330 206'].forEach(function (d) {
      el('path', { d: d, style: 'fill:none;stroke:#8a6a44;stroke-width:2.4;stroke-linecap:round' }, P);
    });
    [[312, 186], [322, 168], [346, 178], [355, 190]].forEach(function (c) { el('circle', { cx: c[0], cy: c[1], r: 5.5, style: 'fill:#e3a1a8;stroke:#b0606a;stroke-width:1.4' }, P); });
    var nodT = tx(372, 178, 'nódulos', 'font-size:13px;font-weight:700;fill:#b0606a', P);
    /* numero em circulo */
    function num(pai, x, y, n, cor) { el('circle', { cx: x, cy: y, r: 11, style: 'fill:' + cor }, pai); tx(x, y + 5, n, 'font-size:14px;font-weight:700;fill:#fff;text-anchor:middle', pai); }
    /* setas do ciclo */
    var S = {};
    S[1] = el('g', {}); K.seta(S[1], 170, 58, 306, 180, BAC, 2.6); num(S[1], 217, 100, '1', BAC);
    tx(198, 100, 'fixação nos nódulos', 'font-size:13px;font-weight:700;fill:' + BAC + ';text-anchor:end', S[1]); tx(198, 116, 'Rhizobium', 'font-size:13px;font-style:italic;fill:' + BAC + ';text-anchor:end', S[1]);
    S[2] = el('g', {}); K.seta(S[2], 56, 58, 56, 222, BAC, 2.6); num(S[2], 56, 150, '2', BAC);
    tx(74, 182, 'fixação no solo', 'font-size:13px;font-weight:700;fill:' + BAC, S[2]); tx(74, 198, 'bactérias livres', 'font-size:13px;fill:' + BAC, S[2]);
    S[3] = el('g', {}); K.seta(S[3], 150, 247, 240, 247, BAC, 2.6); num(S[3], 195, 247, '3', BAC);
    tx(195, 270, 'Nitrosomonas', 'font-size:13px;font-style:italic;font-weight:600;fill:' + BAC + ';text-anchor:middle', S[3]);
    S[4] = el('g', {}); K.seta(S[4], 358, 247, 452, 247, BAC, 2.6); num(S[4], 405, 247, '4', BAC);
    tx(405, 270, 'Nitrobacter', 'font-size:13px;font-style:italic;font-weight:600;fill:' + BAC + ';text-anchor:middle', S[4]);
    S[5] = el('g', {});
    el('path', { d: 'M570 236 H604 V34 H196', style: 'fill:none;stroke:' + BAC + ';stroke-width:2.6;stroke-linejoin:round' }, S[5]);
    K.seta(S[5], 206, 34, 196, 34, BAC, 2.6); num(S[5], 604, 150, '5', BAC);
    tx(592, 190, 'desnitrificação', 'font-size:13px;font-weight:700;fill:' + BAC + ';text-anchor:end', S[5]);
    tx(592, 206, 'bactérias sem O₂', 'font-size:13px;fill:' + BAC + ';text-anchor:end', S[5]);
    /* absorcao, CO2, amonificacao */
    var AB = el('g', {});
    K.seta(AB, 470, 224, 364, 200, PL, 2.6);
    tx(430, 202, 'absorção', 'font-size:13px;font-weight:700;fill:' + PL, AB);
    var CO = el('g', {});
    K.seta(CO, 444, 76, 366, 76, '#555', 2.6);
    tx(452, 72, 'CO₂ do ar', 'font-size:14px;font-weight:700;fill:var(--tinta)', CO);
    tx(452, 90, 'fotossíntese', 'font-size:13px;fill:var(--tinta)', CO);
    var AM = el('g', {});
    el('rect', { x: 166, y: 148, width: 116, height: 40, rx: 8, style: 'fill:var(--folha);stroke:' + SOLO + ';stroke-width:1.6;stroke-dasharray:5 3' }, AM);
    tx(224, 165, 'restos, excretas', 'font-size:13px;font-weight:600;fill:' + SOLO + ';text-anchor:middle', AM);
    tx(224, 181, '(proteína)', 'font-size:13px;fill:' + SOLO + ';text-anchor:middle', AM);
    K.seta(AM, 186, 190, 140, 224, SOLO, 2.2);
    tx(176, 214, 'amonificação', 'font-size:13px;font-weight:600;fill:' + SOLO, AM);
    /* equacao da nitrosacao */
    var EQ = el('g', {});
    el('rect', { x: 384, y: 54, width: 210, height: 56, rx: 9, style: 'fill:var(--folha);stroke:' + BAC + ';stroke-width:1.8' }, EQ);
    tx(489, 76, '2 NH₃ + 3 O₂ → 2 HNO₂ + 2 H₂O', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', EQ);
    tx(489, 98, 'oxidação libera energia', 'font-size:13px;fill:' + BAC + ';text-anchor:middle', EQ);
    var pt = el('circle', { r: 6, style: 'fill:' + BAC });
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(N2, e === 0 || e === 1 || e === 4 ? 1 : .45);
      op(S[1], e === 1 ? cl((t - 2.9) / .4) : e === 4 ? 1 : e > 1 ? .3 : 0);
      op(S[2], e === 1 ? cl((t - 3.6) / .4) : e === 4 ? 1 : e > 1 ? .3 : 0);
      op(NH, e >= 1 ? (e === 1 || e === 2 || e === 3 ? 1 : .6) : .35);
      op(S[3], e === 2 ? cl((t - 5.7) / .4) : e === 4 ? 1 : e > 2 ? .3 : 0);
      op(S[4], e === 2 ? cl((t - 6.6) / .4) : e === 4 ? 1 : e > 2 ? .3 : 0);
      op(NO2, e >= 2 ? (e === 2 ? 1 : .6) : .35);
      op(NO3, e >= 2 ? (e === 2 || e === 3 || e === 4 ? 1 : .6) : .35);
      op(EQ, e === 2 ? cl((t - 6.2) / .4) : 0);
      op(AB, e === 3 ? 1 : e === 4 ? .3 : 0); op(CO, e === 3 ? cl((t - 9.4) / .4) : 0); op(AM, e === 3 ? cl((t - 10.2) / .4) : 0);
      op(P, e === 0 || e === 1 || e === 3 ? 1 : .55); op(nodT, e === 1 || e === 4 ? 1 : 0);
      op(S[5], e === 4 ? 1 : 0);
      /* ponto que percorre o processo da etapa */
      var u, x, y, on = 1;
      if (e === 1) { u = ((t - 2.8) % 1.4) / 1.4; x = lerp(170, 306, u); y = lerp(58, 180, u); }
      else if (e === 2) { u = cl((t - 5.6) / 2.6); x = u < .5 ? lerp(150, 240, u * 2) : lerp(358, 452, u * 2 - 1); y = 247; }
      else if (e === 3) { u = ((t - 8.6) % 1.4) / 1.4; x = lerp(470, 364, u); y = lerp(224, 200, u); }
      else if (e === 4) { u = cl((t - 11.4) / 1.4); var d = u * 470; if (d < 236) { x = 570 + Math.min(d, 34); y = 236 - Math.max(0, d - 34); } else { x = 604 - (d - 236); y = 34; } }
      else on = 0;
      if (on) { pt.setAttribute('cx', x.toFixed(1)); pt.setAttribute('cy', y.toFixed(1)); }
      op(pt, on);
      var L;
      if (e === 0) L = ['1. Muito N₂ no ar, mas planta e animal não usam', 'O ar tem 78% de N₂. A ligação tripla N≡N é forte demais: nem planta nem', 'animal conseguem quebrá-la. Entre os seres vivos, só certas bactérias conseguem.'];
      else if (e === 1) L = ['2. Fixação: bactérias transformam N₂ em amônia', 'Processo 1: Rhizobium, nos nódulos das raízes de leguminosas (feijão, soja).', 'Processo 2: bactérias de vida livre no solo (ex.: Azotobacter) e cianobactérias.'];
      else if (e === 2) L = ['3. Nitrificação: amônia → nitrito → nitrato', 'Nitrosomonas oxida NH₃ a nitrito (3) e Nitrobacter, nitrito a nitrato (4).', 'Usam a energia dessa oxidação para fazer matéria orgânica: quimiossíntese.'];
      else if (e === 3) L = ['4. A raiz absorve nitrato; o carbono vem do CO₂', 'Com o nitrato (e o amônio) a planta faz proteínas; o C entra pelas folhas como', 'CO₂, na fotossíntese. Restos e excretas viram amônia de novo (decompositores).'];
      else L = ['5. Desnitrificação devolve N₂ ao ar', 'Bactérias de solo pobre em O₂ (ex.: Pseudomonas) transformam nitrato em N₂.', 'Nos processos 1 a 5, quem trabalha é sempre bactéria.'];
      painel(L);
    };
    return fimResposta(VIS.def['ciclo-nitrogenio'], svg, _desenha, TF, RESP, qid, { congela: function (q) {
      return { Pa6cb65b: 13.9, W030d180: 11.3, Wa3cb711: 8.4 }[q] || TF - .001; } });
  }
};
VIS.liga('ciclo-nitrogenio', ['Pa6cb65b', 'W030d180', 'Wa3cb711']);
