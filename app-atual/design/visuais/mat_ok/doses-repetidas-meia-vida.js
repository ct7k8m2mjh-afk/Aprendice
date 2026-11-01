/* Doses repetidas com meia-vida: cada dose decai pela metade a cada meia-vida, contando a propria idade;
   a quantidade no sangue e a soma das sobras. Exemplo: 400 mg a cada 6 h, meia-vida 3 h, leitura em t = 15 h.
   Curvas calculadas por q(t) = 400 . 2^(-(t - td)/3). */
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js), com opc.esconde: elemento escondido na etapa Resposta */
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
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 22, y: y + 36, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 22, y: y + 66 + 23 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde && on) opc.esconde.style.opacity = 0;
  };
}
var RESP = {
'db122a84': ['Por isso a resposta é B', 'Na hora 14 as doses (0 h, 6 h e 12 h) têm 14 h, 8 h e 2 h de corpo:', '7, 4 e 1 meias-vidas → 800 ÷ 2⁷ + 800 ÷ 2⁴ + 800 ÷ 2', '= 6,25 + 50 + 400 = 456,25 mg']
};
VIS.def['doses-repetidas-meia-vida'] = {
  tit: 'Doses repetidas: cada dose cai pela metade no seu tempo',
  fontes: ['OpenStax, College Algebra 2e, 6.7 Exponential and Logarithmic Models (half-life) — https://openstax.org/books/college-algebra-2e/pages/6-7-exponential-and-logarithmic-models', 'Wikipedia (en), Biological half-life — https://en.wikipedia.org/wiki/Biological_half-life', 'Wikipedia (pt), Meia-vida — https://pt.wikipedia.org/wiki/Meia-vida'],
  tipo: 'anim', dur: 12.6,
  marcas: [[0, 'Uma dose'], [3.2, 'Novas doses'], [6.4, 'Idades'], [9.6, 'Soma']],
  cred: 'Animação feita para o app. Exemplo: 400 mg a cada 6 h, meia-vida de 3 h; curvas calculadas pela fórmula.',
  nota: 'Depois de n meias-vidas sobra a dose ÷ 2ⁿ. Com várias doses, cada uma conta o tempo desde que foi tomada, e a quantidade no sangue é a soma do que sobrou de cada uma (o gráfico em dente de serra).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var HALO = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    var COR = ['#c98a12', '#8a5a9e', '#2b6cb0'], TOT = 'var(--ad-c)';
    svg.setAttribute('viewBox', '0 0 640 350');
    var GX0 = 72, GX1 = 612, GY0 = 196, GY1 = 24, TMAX = 18, QMAX = 600;
    function px(t) { return GX0 + (GX1 - GX0) * t / TMAX; } function py(q) { return GY0 - (GY0 - GY1) * q / QMAX; }
    for (var q = 100; q <= 600; q += 100) { el('line', { x1: GX0, x2: GX1, y1: py(q), y2: py(q), style: 'stroke:var(--linha);stroke-width:1;opacity:.6' }); tx(GX0 - 8, py(q) + 5, '' + q, 'font-size:14px;fill:var(--lapis);text-anchor:end'); }
    for (var h = 3; h <= 18; h += 3) { el('line', { x1: px(h), x2: px(h), y1: GY0, y2: GY1, style: 'stroke:var(--linha);stroke-width:1;opacity:.6' }); tx(px(h), GY0 + 18, h + ' h', 'font-size:14px;fill:var(--lapis);text-anchor:middle'); }
    tx(GX0, GY0 + 18, '0', 'font-size:14px;fill:var(--lapis);text-anchor:middle');
    el('path', { d: 'M' + GX0 + ' ' + (GY1 - 6) + ' V' + GY0 + ' H' + (GX1 + 6), style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    tx(14, 20, 'mg', 'font-size:14px;font-weight:700;fill:var(--lapis)');
    var TD = [0, 6, 12], D = 400, MV = 3;
    function qd(i, t) { return t < TD[i] ? 0 : D * Math.pow(2, -(t - TD[i]) / MV); }
    function tot(t) { return qd(0, t) + qd(1, t) + qd(2, t); }
    var cd = TD.map(function (td, i) { return el('path', { style: 'fill:none;stroke:' + COR[i] + ';stroke-width:2.2' + (i === 0 ? '' : ';stroke-dasharray:7 4') }); });
    var ct = el('path', { style: 'fill:none;stroke:' + TOT + ';stroke-width:3.4;stroke-linejoin:round' });
    /* marcas da primeira dose: 400, 200, 100, 50 */
    var mh = [0, 3, 6, 9].map(function (t, k) {
      var g = el('g', {}); var v = D / Math.pow(2, k);
      el('circle', { cx: px(t), cy: py(v), r: 5, style: 'fill:' + COR[0] + ';stroke:var(--folha);stroke-width:2' }, g);
      tx(px(t) + 8, py(v) - 8, (v === 400 ? '400' : v) + (k ? ' (÷ 2)' : ''), 'font-size:14px;font-weight:700;fill:' + COR[0] + HALO, g);
      return g;
    });
    var saltos = el('g', {});
    [[6, '100 + 400 = 500'], [12, '25 + 100 + 400 = 525']].forEach(function (s) { tx(px(s[0]) - 8, py(tot(s[0])) + 5, s[1], 'font-size:14px;font-weight:700;text-anchor:end;fill:var(--ad-t)' + HALO, saltos); });
    /* leitura em t = 15 */
    var TL = 15, ler = el('g', {});
    el('line', { x1: px(TL), x2: px(TL), y1: GY0, y2: GY1 + 4, style: 'stroke:var(--tinta);stroke-width:1.6;stroke-dasharray:4 4' }, ler);
    var pts = TD.map(function (td, i) { return el('circle', { cx: px(TL), cy: py(qd(i, TL)), r: 5.5, style: 'fill:' + COR[i] + ';stroke:var(--folha);stroke-width:2' }, ler); });
    var idades = [['dose 1: 15 h', 12.5], ['dose 2: 9 h', 50], ['dose 3: 3 h', 200]].map(function (s, i) { return tx(px(TL) + (i === 0 ? -10 : 10), py(qd(i, TL)) + (i === 0 ? -7 : 5), s[0], 'font-size:14px;font-weight:700;fill:' + COR[i] + (i === 0 ? ';text-anchor:end' : '') + HALO, ler); });
    var pT = el('circle', { cx: px(TL), cy: py(tot(TL)), r: 6.5, style: 'fill:' + TOT + ';stroke:var(--folha);stroke-width:2' });
    var lT = tx(px(TL) - 10, py(tot(TL)) - 10, 'total 262,5 mg', 'font-size:15px;font-weight:700;fill:var(--ad-t);text-anchor:end' + HALO);
    var lD = TD.map(function (td, i) { var tl = td + 2.6; return tx(px(tl), py(qd(i, tl)) + (i === 0 ? -8 : 20), 'dose ' + (i + 1), 'font-size:14px;font-weight:700;fill:' + COR[i] + HALO); });
    /* painel de texto embaixo */
    var painel = el('g', {});
    el('line', { x1: 20, x2: 620, y1: 222, y2: 222, style: 'stroke:var(--linha);stroke-width:1.2' }, painel);
    var T = tx(20, 246, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3].map(function (k) { return tx(20, 271 + 23 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    var TX = [
      ['1. Uma dose: metade a cada meia-vida', 'A cada 3 h (a meia-vida) o corpo elimina metade do que havia:', '400 → 200 → 100 → 50 mg. Depois de n meias-vidas sobra 400 ÷ 2ⁿ.', 'Não cai sempre a mesma quantidade: cai sempre a mesma FRAÇÃO.'],
      ['2. Doses a cada 6 h: a nova dose se soma', 'Cada dose tem a sua curva (cores). O que há no sangue é a soma (curva grossa).', 'Em 6 h: sobram 100 mg da dose 1, mais 400 da dose 2 = 500 mg.', 'Em 12 h: 25 + 100 + 400 = 525 mg. O gráfico vira um dente de serra.'],
      ['3. Na hora 15, cada dose tem a sua idade', 'Dose 1 (tomada em 0 h): 15 h no corpo = 5 meias-vidas.', 'Dose 2 (em 6 h): 9 h = 3 meias-vidas. Dose 3 (em 12 h): 3 h = 1 meia-vida.', 'Não use o mesmo tempo para todas as doses.'],
      ['4. Some o que sobrou de cada uma', 'Dose 1: 400 ÷ 2⁵ = 12,5 mg;  dose 2: 400 ÷ 2³ = 50 mg;', 'dose 3: 400 ÷ 2¹ = 200 mg.', 'Total na hora 15: 12,5 + 50 + 200 = 262,5 mg']
    ];
    function curva(F, t0, t1) { var d = ''; for (var s = t0; s <= t1 + 1e-9; s += .05) d += (d ? 'L' : 'M') + px(s).toFixed(1) + ' ' + py(F(s)).toFixed(1); return d; }
    function serra(t1) {   /* total com saltos verticais nas doses */
      var d = 'M' + px(0) + ' ' + py(0), a = 0;
      TD.forEach(function (td, i) {
        if (td > t1) return;
        var fim = Math.min(t1, i < 2 ? TD[i + 1] : TMAX);
        d += ' L' + px(td).toFixed(1) + ' ' + py(tot(td)).toFixed(1);
        for (var s = td + .05; s < fim; s += .05) d += ' L' + px(s).toFixed(1) + ' ' + py(tot(s)).toFixed(1);
        d += ' L' + px(fim).toFixed(1) + ' ' + py(tot(fim - 1e-6)).toFixed(1);
      });
      return d;
    }
    var _desenha = function (t) {
      var fase = t < 3.2 ? 0 : t < 6.4 ? 1 : t < 9.6 ? 2 : 3;
      var s0 = fase === 0 ? lerp(0, 18, ease((t - .2) / 2.6)) : 18;
      cd[0].setAttribute('d', curva(function (s) { return qd(0, s); }, 0, Math.max(.05, s0)));
      mh.forEach(function (g, k) { op(g, fase === 0 && s0 >= 3 * k ? 1 : 0); });
      var s1 = fase === 1 ? lerp(0, 18, ease((t - 3.4) / 2.4)) : fase > 1 ? 18 : 0;
      [1, 2].forEach(function (i) { cd[i].setAttribute('d', s1 > TD[i] ? curva(function (s) { return qd(i, s); }, TD[i], s1) : ''); });
      ct.setAttribute('d', s1 > 0 ? serra(s1) : ''); op(ct, fase >= 1 ? 1 : 0);
      op(saltos, fase === 1 && s1 > 12.5 ? 1 : 0);
      lD.forEach(function (l, i) { op(l, (i === 0 && fase === 1) || (i > 0 && fase === 1 && s1 > TD[i]) ? 1 : 0); });
      op(cd[0], fase >= 2 ? .9 : 1);
      var u = ease((t - 6.6) / .6);
      op(ler, fase >= 2 ? u : 0);
      op(pT, fase === 3 ? ease((t - 9.8) / .5) : 0); op(lT, fase === 3 ? ease((t - 9.8) / .5) : 0);
      var X = TX[fase]; T.textContent = X[0]; for (var m = 0; m < 4; m++) L[m].textContent = X[m + 1];
      painel.style.opacity = 1;
    };
    return fimResposta(VIS.def['doses-repetidas-meia-vida'], svg, _desenha, 12.6, RESP, qid, {
      x: 14, y: 220, w: 612, h: 128, semEsmaecer: true, esconde: painel,
      congela: function () { return 12.55; }
    });
  }
};
VIS.liga('doses-repetidas-meia-vida', ['db122a84']);
