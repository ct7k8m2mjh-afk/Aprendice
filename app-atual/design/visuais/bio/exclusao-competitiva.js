/* Exclusao competitiva (Gause): Paramecium aurelia e P. caudatum, mesmo alimento. Separadas, cada uma cresce em S;
   juntas, competicao interespecifica e P. caudatum e eliminada. Lote bio 9. */
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
'W091e8dd': ['Por isso a resposta é B',
  'Mesmo nicho = mesmo alimento e espaço. Como são espécies',
  'diferentes, a disputa é uma competição interespecífica.'],
'W8101a7f': ['Por isso a resposta é C',
  'Com o mesmo nicho, a espécie um pouco mais eficiente fica',
  'com o recurso e cresce; a outra cai até ser eliminada',
  '(princípio da exclusão competitiva, de Gause).']
};
VIS.def['exclusao-competitiva'] = {
  tit: 'Mesmo nicho, mesmo lugar: uma espécie elimina a outra',
  fontes: ['OpenStax, Biology 2e, 45.6 Community Ecology, Competitive Exclusion Principle (P. aurelia e P. caudatum: separadas crescem bem; juntas, P. aurelia vence e P. caudatum é extinta) — https://openstax.org/books/biology-2e/pages/45-6-community-ecology',
    'Wikipedia (en), Competitive exclusion principle (Gause, 1934) — https://en.wikipedia.org/wiki/Competitive_exclusion_principle'],
  tipo: 'anim', dur: 12,
  marcas: [[0, '1. Nicho'], [2.8, '2. Separadas'], [6, '3. Juntas'], [9, '4. Exclusão']],
  cred: 'Animação feita para o app (curvas esquemáticas no formato dos experimentos de Gause; densidades relativas).',
  nota: 'Nicho é o modo de vida da espécie: o que come, onde vive, quando age. Se duas espécies ocupam o mesmo nicho no mesmo lugar, não convivem por muito tempo; elas só coexistem se dividirem o recurso (nichos diferentes).',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 2.8, 6, 9], TF = 12;
    var AU = '#2b6cb0', CA = '#c4562a';
    function param(pai, x, y, s, cor) {
      var g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')' }, pai);
      for (var k = 0; k < 14; k++) { var a = k / 14 * Math.PI * 2, cx = 26 * Math.cos(a), cy = 10 * Math.sin(a); el('line', { x1: cx, y1: cy, x2: cx * 1.18, y2: cy * 1.4, style: 'stroke:' + cor + ';stroke-width:1.2' }, g); }
      el('path', { d: 'M-26 0 C-26 -12 14 -13 26 -4 C30 0 28 7 20 9 C8 12 -26 12 -26 0 Z', style: 'fill:color-mix(in srgb,' + cor + ' 22%,var(--folha));stroke:' + cor + ';stroke-width:2' }, g);
      el('ellipse', { cx: 0, cy: 1, rx: 7, ry: 4, style: 'fill:' + cor + ';opacity:.6' }, g);
      return g;
    }
    /* cena 1: as duas especies e o alimento */
    var I = el('g', {});
    param(I, 150, 70, 1.2, AU); tx(150, 108, 'Paramecium aurelia', 'font-size:14px;font-weight:700;font-style:italic;fill:' + AU + ';text-anchor:middle', I); tx(150, 126, 'menor', 'font-size:13px;fill:var(--lapis);text-anchor:middle', I);
    param(I, 490, 70, 1.7, CA); tx(490, 108, 'Paramecium caudatum', 'font-size:14px;font-weight:700;font-style:italic;fill:' + CA + ';text-anchor:middle', I); tx(490, 126, 'maior', 'font-size:13px;fill:var(--lapis);text-anchor:middle', I);
    el('rect', { x: 230, y: 150, width: 180, height: 90, rx: 12, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.6' }, I);
    var sem = 3; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    for (var k = 0; k < 26; k++) { var bx = 244 + rnd() * 148, by = 162 + rnd() * 46; el('rect', { x: bx - 4, y: by - 1.75, width: 8, height: 3.5, rx: 1.7, transform: 'rotate(' + (rnd() * 180).toFixed(0) + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1) + ')', style: 'fill:#7a8a3a' }, I); }
    tx(320, 232, 'o mesmo alimento (bactérias)', 'font-size:13px;font-weight:600;fill:var(--tinta);text-anchor:middle', I);
    K.seta(I, 170, 136, 232, 172, AU, 2.4); K.seta(I, 470, 136, 408, 172, CA, 2.4);
    /* graficos */
    var G = el('g', {});
    function eixo(x0, tit) {
      tx(x0 + 125, 24, tit, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', G);
      el('path', { d: 'M' + x0 + ' 40 V240 H' + (x0 + 254), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, G);
      tx(x0 + 254, 260, 'dias →', 'font-size:13px;fill:var(--lapis);text-anchor:end', G);
    }
    var XA = 46, XB = 360, W = 250, Y0 = 238, H = 180;
    eixo(XA, 'Separadas (cada uma num tubo)'); eixo(XB, 'Juntas (no mesmo tubo)');
    tx(XA - 8, 52, 'nº', 'font-size:13px;fill:var(--lapis);text-anchor:end', G);
    function lg(x, K0, r, x0) { return K0 / (1 + Math.exp(-r * (x - x0))); }
    var F = {
      sA: function (x) { return lg(x, .95, .75, 5.5); }, sC: function (x) { return lg(x, .6, .7, 6); },
      jA: function (x) { return lg(x, .9, .55, 7.5); },
      jC: function (x) { return lg(x, .42, .8, 5) * Math.exp(-Math.pow(Math.max(0, x - 6), 1.6) / 9); } };
    function curva(cor, dash) { return el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:3.2;stroke-linejoin:round' + (dash ? ';stroke-dasharray:' + dash : '') }, G); }
    var c = { sA: curva(AU), sC: curva(CA), jA: curva(AU), jC: curva(CA) };
    var r = {
      sA: tx(XA + W - 4, Y0 - H * .95 - 8, 'P. aurelia', 'font-size:13.5px;font-weight:700;font-style:italic;text-anchor:end;fill:' + AU, G),
      sC: tx(XA + W - 4, Y0 - H * .6 + 20, 'P. caudatum', 'font-size:13.5px;font-weight:700;font-style:italic;text-anchor:end;fill:' + CA, G),
      jA: tx(XB + W - 4, Y0 - H * .9 + 36, 'P. aurelia', 'font-size:13.5px;font-weight:700;font-style:italic;text-anchor:end;fill:' + AU, G),
      jC: tx(XB + 150, Y0 - H * .3 - 8, 'P. caudatum', 'font-size:13.5px;font-weight:700;font-style:italic;fill:' + CA, G) };
    var morte = tx(XB + W - 4, Y0 - 26, 'eliminada', 'font-size:13.5px;font-weight:700;text-anchor:end;fill:#b4442f', G);
    var comp = tx(XB + 30, 60, '', 'font-size:13.5px;font-weight:700;fill:var(--ad-t)', G);
    function d(f, x0, ate) { var p = ''; for (var k = 0; k <= 64; k++) { var x = ate * k / 64; p += (k ? 'L' : 'M') + (x0 + W * x / 16).toFixed(1) + ' ' + (Y0 - H * f(x)).toFixed(1) + ' '; } return p; }
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(I, e === 0 ? 1 : 0); op(G, e >= 1 ? cl((t - 2.8) / .3) : 0);
      var ds = e === 1 ? 16 * ease((t - 3) / 2.6) : 16, dj = e === 2 ? 9 * ease((t - 6.1) / 2.6) : e === 3 ? lerp(9, 16, ease((t - 9) / 2)) : 0;
      c.sA.setAttribute('d', d(F.sA, XA, Math.max(ds, .01))); c.sC.setAttribute('d', d(F.sC, XA, Math.max(ds, .01)));
      c.jA.setAttribute('d', d(F.jA, XB, Math.max(dj, .01))); c.jC.setAttribute('d', d(F.jC, XB, Math.max(dj, .01)));
      op(r.sA, ds > 12 ? 1 : 0); op(r.sC, ds > 12 ? 1 : 0); op(c.jA, dj > 0 ? 1 : 0); op(c.jC, dj > 0 ? 1 : 0);
      op(r.jA, dj > 12 ? 1 : 0); op(r.jC, dj > 6 ? 1 : 0); op(morte, dj > 15 ? 1 : 0);
      comp.textContent = e === 2 ? 'disputam o mesmo alimento' : e === 3 ? 'exclusão competitiva' : '';
      [c.sA, c.sC, r.sA, r.sC].forEach(function (o) { o.style.opacity = e >= 2 ? .35 : (o === r.sA || o === r.sC) ? (ds > 12 ? 1 : 0) : 1; });
      var L;
      if (e === 0) L = ['1. Duas espécies, o mesmo nicho', 'Gause criou dois protozoários do mesmo gênero que comem o mesmo alimento', '(bactérias). Mesmo nicho = buscam exatamente o mesmo recurso.'];
      else if (e === 1) L = ['2. Separadas: cada uma cresce em S', 'Em tubos separados, cada população cresce e se estabiliza no limite', 'que o alimento permite. As duas vão bem sozinhas.'];
      else if (e === 2) L = ['3. Juntas: competição interespecífica', 'No mesmo tubo, o alimento que uma come falta para a outra. Espécies', 'diferentes disputando o mesmo recurso = competição interespecífica.'];
      else L = ['4. Uma vence; a outra é eliminada', 'P. aurelia aproveita um pouco melhor o alimento e cresce; P. caudatum cai', 'até sumir do tubo. Não há metade para cada uma: há exclusão.'];
      painel(L);
    };
    return fimResposta(VIS.def['exclusao-competitiva'], svg, _desenha, TF, RESP, qid, { y: qid === 'W8101a7f' ? 4 : undefined, congela: function (q) {
      return { W091e8dd: 8.9 }[q] || TF - .001; } });
  }
};
VIS.liga('exclusao-competitiva', ['W091e8dd', 'W8101a7f']);
