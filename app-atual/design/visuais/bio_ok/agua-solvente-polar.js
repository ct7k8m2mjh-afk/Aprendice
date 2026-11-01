/* Agua: molecula polar (104,5 graus, delta- no O, delta+ nos H), pontes de hidrogenio e dissolucao do NaCl
   (O voltado para o Na+, H voltados para o Cl-): a agua e o solvente. */
function quebra(s, n) { var p = s.split(' '), L = [], a = ''; p.forEach(function (w) { if (a && (a + ' ' + w).length > n) { L.push(a); a = w; } else a = a ? a + ' ' + w : w; }); if (a) L.push(a); return L; }
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js): congela o quadro que decide a questao aberta.
   Aqui o cartao ocupa o lugar do painel de texto (opc.esconde) e o desenho fica visivel ao lado. */
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
  var L = []; r.slice(1).forEach(function (s) { L = L.concat(opc.quebra ? quebra(s, opc.quebra) : [s]); });
  var lh = 22, w = opc.w || 520, h = 78 + lh * (L.length - 1), x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 16, y: y + 31, style: 'font-size:17px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  L.forEach(function (s, i) { var t = el('text', { x: x + 16, y: y + 58 + lh * i, style: 'font-size:14.5px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde) opc.esconde.style.opacity = on ? 0 : 1;
  };
}
var RESP = {
  'W446431c': ['Por isso a resposta é D', 'Polar, a água cerca e separa íons e moléculas polares: ela dissolve, é o solvente. Dissolvidos nela, os reagentes se encontram e reagem.', 'Plasma (E) é verdade, mas não explica.']
};
VIS.def['agua-solvente-polar'] = {
  tit: 'Por que a água dissolve tanta coisa',
  fontes: ['OpenStax, Biology 2e, 2.2 Water — https://openstax.org/books/biology-2e/pages/2-2-water', 'Wikipedia (en), Properties of water — https://en.wikipedia.org/wiki/Properties_of_water'],
  tipo: 'anim', dur: 14.4,
  marcas: [[0, 'Polaridade'], [3.6, 'Pontes de H'], [7.2, 'Sal na água'], [10.8, 'Solvente']],
  cred: 'Animação feita para o app (esquema fora de escala; δ = carga parcial).',
  nota: 'O oxigênio puxa os elétrons da ligação: fica com carga parcial negativa (δ−) e os hidrogênios com carga parcial positiva (δ+). Por isso a água atrai íons e moléculas polares e os mantém separados: é o solvente das reações da célula.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vis(o, b) { o.style.display = b ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var O = '#d64541', H = '#e9e9e9', NA = '#8e6bbf', CL = '#3f9a5a';
    var B = 'font-size:13.5px;font-weight:700;', N = 'font-size:13px;';
    var A = 52.25 * Math.PI / 180;
    function agua(pai, s) {
      var g = el('g', {}, pai);
      [-1, 1].forEach(function (k) { el('circle', { cx: (Math.sin(k * A) * 15 * s).toFixed(1), cy: (Math.cos(k * A) * 15 * s).toFixed(1), r: 6 * s, style: 'fill:' + H + ';stroke:#8a8a8a;stroke-width:' + (1.2 * s).toFixed(1) }, g); });
      el('circle', { r: 9 * s, style: 'fill:' + O + ';stroke:#9e2b22;stroke-width:' + (1.2 * s).toFixed(1) }, g);
      return g;
    }
    function pos(g, x, y, ang) { g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ')'); }
    /* ===== 1 molecula ===== */
    var g1 = el('g', {});
    var OX = 190, OY = 100, LB = 100, hx = LB * Math.sin(A), hy = LB * Math.cos(A);
    el('path', { d: 'M' + (OX - hx).toFixed(1) + ' ' + (OY + hy).toFixed(1) + ' L' + OX + ' ' + OY + ' L' + (OX + hx).toFixed(1) + ' ' + (OY + hy).toFixed(1), style: 'fill:none;stroke:#9a9a9a;stroke-width:7;stroke-linecap:round' }, g1);
    [-1, 1].forEach(function (k) { el('circle', { cx: (OX + k * hx).toFixed(1), cy: (OY + hy).toFixed(1), r: 22, style: 'fill:' + H + ';stroke:#8a8a8a;stroke-width:1.6' }, g1); tx(OX + k * hx, OY + hy + 5, 'H', 'font-size:14px;font-weight:800;text-anchor:middle;fill:#444', g1); });
    el('circle', { cx: OX, cy: OY, r: 32, style: 'fill:' + O + ';stroke:#9e2b22;stroke-width:1.6' }, g1); tx(OX, OY + 6, 'O', 'font-size:16px;font-weight:800;text-anchor:middle;fill:#fff', g1);
    el('path', { d: 'M' + (OX - 52 * Math.sin(A)).toFixed(1) + ' ' + (OY + 52 * Math.cos(A)).toFixed(1) + ' A52 52 0 0 0 ' + (OX + 52 * Math.sin(A)).toFixed(1) + ' ' + (OY + 52 * Math.cos(A)).toFixed(1), style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, g1);
    tx(OX, OY + 82, '104,5°', 'font-size:15px;font-weight:800;text-anchor:middle;fill:var(--tinta)', g1);
    var dl = el('g', {}, g1);
    tx(190, 54, 'δ−', 'font-size:20px;font-weight:800;text-anchor:middle;fill:' + O, dl);
    tx(110, 202, 'δ+', 'font-size:20px;font-weight:800;text-anchor:middle;fill:#5a5a5a', dl);
    tx(270, 202, 'δ+', 'font-size:20px;font-weight:800;text-anchor:middle;fill:#5a5a5a', dl);
    tx(230, 94, 'O puxa os elétrons', B + 'fill:' + O, dl);
    tx(190, 262, 'H₂O: angular, com um lado δ− e outro δ+', B + 'text-anchor:middle;fill:var(--tinta)', dl);
    tx(190, 282, 'por isso é polar', N + 'text-anchor:middle;fill:var(--lapis)', dl);
    /* ===== 2 pontes de H ===== */
    var g2 = el('g', {});
    var P2 = [[110, 110, 20], [200, 90, -140], [270, 160, 160], [180, 190, -30], [90, 220, 110], [270, 260, 40]];
    var W2 = P2.map(function (p) { var w = agua(g2, 1.8); pos(w, p[0], p[1], p[2]); return w; });
    var hb = el('path', { d: 'M126 128 L184 102 M213 106 L254 148 M170 208 L106 222 M192 205 L247 255', style: 'fill:none;stroke:#2f6db5;stroke-width:2;stroke-dasharray:4 3' }, g2);
    tx(190, 318, 'tracejado = ponte de hidrogênio (δ+ de uma, δ− de outra)', B + 'text-anchor:middle;fill:#2f6db5', g2);
    /* ===== 3 e 4 sal ===== */
    var g3 = el('g', {});
    var ions = [];
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var na = (r + c) % 2 === 0, x = 40 + c * 28, y = 110 + r * 28;
      var g = el('g', {}, g3); el('circle', { r: na ? 8 : 12, style: 'fill:' + (na ? NA : CL) }, g); tx(0, 4.5, na ? '+' : '−', 'font-size:13px;font-weight:800;text-anchor:middle;fill:#fff', g);
      g._x = x; g._y = y; g._na = na; g.setAttribute('transform', 'translate(' + x + ' ' + y + ')'); ions.push(g);
    }
    tx(82, 96, 'cristal de NaCl', B + 'text-anchor:middle;fill:var(--tinta)', g3);
    var iNa = ions[7], iCl = ions[11];
    var hNa = [0, 1, 2, 3, 4].map(function () { return agua(g3, 1.35); }), hCl = [0, 1, 2, 3, 4].map(function () { return agua(g3, 1.35); });
    var soltas = [[346, 212, 30], [60, 40, -60], [352, 292, 120], [60, 290, 200], [100, 248, 10]].map(function (p) { var w = agua(g3, 1.5); pos(w, p[0], p[1], p[2]); return w; });
    var la = tx(0, 0, '', B + 'fill:' + NA, g3), lb = tx(0, 0, '', B + 'fill:' + CL, g3);
    var l4 = el('g', {}, g3);
    el('rect', { x: 150, y: 16, width: 230, height: 50, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 8%,var(--folha));stroke:var(--ad-c);stroke-width:1.5' }, l4);
    tx(162, 37, 'água = solvente (dissolve)', 'font-size:14px;font-weight:700;fill:var(--ad-t)', l4);
    tx(162, 56, 'sal = soluto (é dissolvido)', 'font-size:14px;font-weight:700;fill:var(--tinta)', l4);
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · Molécula polar', s: 'Na água, o oxigênio atrai mais os elétrons das ligações. Ele fica com carga parcial negativa (δ−) e os hidrogênios, com carga parcial positiva (δ+). Como a molécula é angular (104,5°), as cargas não se anulam.' },
      { tit: '2 · Pontes de hidrogênio', s: 'O lado δ+ de uma molécula atrai o lado δ− da vizinha: são as pontes de hidrogênio. Elas explicam a coesão e o alto calor específico da água.' },
      { tit: '3 · Dissolvendo o sal', s: 'Na água, cada íon do cristal é atraído pelas moléculas de água: o Na⁺ pelo lado δ− (oxigênio), o Cl⁻ pelo lado δ+ (hidrogênios). Cercados de água, os íons se soltam e ficam separados.' },
      { tit: '4 · A água é o solvente', s: 'Quem dissolve é o solvente; o que é dissolvido é o soluto. Por ser polar, a água dissolve íons, açúcares e muitas proteínas. Dissolvidas, as moléculas se movem, se encontram e reagem: é na água que o metabolismo acontece.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 3 ? 0 : t < 5.5 ? 1 : t < 8.5 ? 2 : 3;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      vis(g1, f === 0); vis(g2, f === 1); vis(g3, f >= 2);
      if (f === 0) op(dl, cl((t - .5) / .4));
      if (f === 1) { W2.forEach(function (w, i) { var p = P2[i]; pos(w, p[0] + 2 * Math.sin(t * 3 + i), p[1] + 2 * Math.cos(t * 2.5 + i), p[2]); }); op(hb, cl((t - 3.4) / .4)); }
      if (f >= 2) {
        var u = f === 2 ? cl((t - 5.5) / 3) : 1, s = ease((u - .15) / .6);
        var nx = lerp(iNa._x, 236, s), ny = lerp(iNa._y, 114, s), cx = lerp(iCl._x, 236, s), cy = lerp(iCl._y, 246, s);
        iNa.setAttribute('transform', 'translate(' + nx.toFixed(1) + ' ' + ny.toFixed(1) + ')'); iCl.setAttribute('transform', 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')');
        hNa.forEach(function (w, i) { var a = i * 72 * Math.PI / 180 + .4, R = lerp(70, 31, ease((u - .05 - i * .04) / .45)); pos(w, nx + R * Math.cos(a), ny + R * Math.sin(a), 90 - i * 72 - .4 * 57.3 - 90 + 180 + 90 + 90); w.setAttribute('transform', 'translate(' + (nx + R * Math.cos(a)).toFixed(1) + ' ' + (ny + R * Math.sin(a)).toFixed(1) + ') rotate(' + ((a * 57.3) - 90).toFixed(1) + ')'); op(w, cl((u - i * .04) / .15)); });
        hCl.forEach(function (w, i) { var a = i * 72 * Math.PI / 180 + 1, R = lerp(74, 37, ease((u - .05 - i * .04) / .45)); w.setAttribute('transform', 'translate(' + (cx + R * Math.cos(a)).toFixed(1) + ' ' + (cy + R * Math.sin(a)).toFixed(1) + ') rotate(' + ((a * 57.3) + 90).toFixed(1) + ')'); op(w, cl((u - i * .04) / .15)); });
        soltas.forEach(function (w, i) { op(w, f === 2 ? .8 : .8); });
        la.textContent = u > .55 ? 'Na⁺ cercado pelos O (δ−)' : ''; la.setAttribute('x', 236); la.setAttribute('y', 178); la.style.textAnchor = 'middle';
        lb.textContent = u > .55 ? 'Cl⁻ cercado pelos H (δ+)' : ''; lb.setAttribute('x', 236); lb.setAttribute('y', 318); lb.style.textAnchor = 'middle';
        op(l4, f === 3 ? cl((t - 8.6) / .4) : 0);
      }
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 3, 5.5, 8.5, 11], _N = [0.0, 3.6, 7.2, 10.8, 14.4];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['agua-solvente-polar'], svg, _desenha, 14.4, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function () { return 10.9; } }));
  }
};
VIS.liga('agua-solvente-polar', ['W446431c']);
