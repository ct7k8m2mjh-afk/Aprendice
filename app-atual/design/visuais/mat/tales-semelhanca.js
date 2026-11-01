/* Tales e semelhanca: feixe de paralelas cortado por duas transversais (segmentos 6 e 9 / 5 e 7,5, desenhados em escala),
   paralela a um lado do triangulo (k = 0,4), sombras sob o mesmo sol (AA, k = 4) e quadrado no canto reto (x = 4).
   Todas as coordenadas calculadas no codigo. */
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
'W0e86d45': ['Por isso a resposta é A', 'Ruas paralelas cortando as alamedas:', 'trechos correspondentes na mesma', 'razão: 20 ÷ x = 24 ÷ 30', '24x = 600 → x = 25 m'],
'W1f4a211': ['Por isso a resposta é C', 'DE ∥ BC: AD ÷ AB = AE ÷ AC', '10 ÷ AB = 20 ÷ 50', 'AB = 500 ÷ 20 = 25 cm', '(é o lado inteiro, não o pedaço DB)'],
'5ad3dbbe': ['Por isso a resposta é D', 'BI ∥ EF: ABI é semelhante a AEF.', 'AB é 1 dos 4 pedaços iguais de AE:', 'k = 1/4', 'BI = 12 ÷ 4 = 3 cm'],
'W69b5dd2': ['Por isso a resposta é D', 'Mesma inclinação: triângulos', 'semelhantes. 0,8 ÷ 3,2 = 2,2 ÷ L', 'L = 7,04 ÷ 0,8 = 8,8 m', 'Falta andar: 8,8 − 3,2 = 5,6 m'],
'Wbeafe0b': ['Por isso a resposta é D', 'Mesmo sol: altura ÷ sombra = 7,2 ÷ 11,2', 'Sombra do pássaro de baixo:', '11,2 − 4,2 = 7 → altura 4,5 m', 'Entre eles: 7,2 − 4,5 = 2,7 m'],
'Wbc19c08': ['Por isso a resposta é A', 'Mesmo sol, mesmos ângulos:', 'altura ÷ sombra igual nos dois.', 'x ÷ 15 = 5 ÷ 3', '3x = 75 → x = 25 m'],
'3ed4f15e': ['Por isso a resposta é E', 'Raio BC ⊥ r. A distância x do centro', 'de b até r dá um triângulo semelhante', '(AA, ângulo A comum): x ÷ 10 = 30 ÷ 50', 'x = 6 → meia corda √(10² − 6²) = 8', 'PQ = 2 · 8 = 16 cm'],
'P30923db': ['Por isso a resposta é B', 'Mesmo θ nos 4 triângulos: semelhantes,', 'cateto ÷ cateto = (7/10) ÷ (2/5) = 7/4', 'Dando a volta: PA = 189/640', 'AB = 1 − 189/640 − 2/5 = 39/128'],
'Pa56de09': ['Por isso a resposta é C', 'O triângulo de cima é semelhante', 'ao grande: (12 − x) ÷ 12 = x ÷ 35', '420 = 47x → x ≈ 8,94 cm', 'mais perto de 9,0 cm']
};
VIS.def['tales-semelhanca'] = {
  tit: 'Tales e semelhança: as medidas andam na mesma razão',
  fontes: ['Wikipedia (pt), Teorema de Tales — https://pt.wikipedia.org/wiki/Teorema_de_Tales', 'Wikipedia (en), Intercept theorem — https://en.wikipedia.org/wiki/Intercept_theorem', 'Wikipedia (en), Similarity (geometry) — https://en.wikipedia.org/wiki/Similarity_(geometry)', 'OpenStax, Precalculus 2e, 5.4 Right Triangle Trigonometry (sombras e alturas) — https://openstax.org/books/precalculus-2e/pages/5-4-right-triangle-trigonometry'],
  tipo: 'anim', dur: 17.92,
  marcas: [[0, 'Paralelas'], [4.48, 'No triângulo'], [9.24, 'Mesmo sol'], [13.72, 'Quadrado']],
  cred: 'Animação feita para o app. Figuras desenhadas em escala a partir das medidas do exemplo.',
  nota: 'Paralelas cortando duas retas dividem as duas na mesma razão (Tales). Dois ângulos iguais bastam para dois triângulos serem semelhantes (AA): todos os lados correspondentes ficam multiplicados pelo mesmo k.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function at(o, a) { for (var k in a) o.setAttribute(k, typeof a[k] === 'number' ? a[k].toFixed(1) : a[k]); }
    var HALO = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    var C1 = '#b4442f', C2 = '#2b6cb0', PAR = 'var(--lapis)', COR = 'var(--ad-c)', SOL = '#c98a12';
    var R15 = 'font-size:15px;font-weight:700;fill:';
    svg.setAttribute('viewBox', '0 0 640 350');
    /* ---------- etapa 1: feixe de paralelas ---------- */
    var g1 = el('g', {}), O = [24, 196], XP = [90, 160, 265], M1 = -0.75, M2 = 0.2916667;   /* cos = 0,8 e cos = 0,96 */
    function y1(x) { return O[1] + M1 * (x - O[0]); } function y2(x) { return O[1] + M2 * (x - O[0]); }
    XP.forEach(function (x, i) { el('line', { x1: x, x2: x, y1: 6, y2: 300, style: 'stroke:' + PAR + ';stroke-width:2' }, g1); tx(x, 320, ['r', 's', 't'][i], 'font-size:15px;font-style:italic;font-weight:700;text-anchor:middle;fill:var(--lapis)', g1); });
    tx(XP[2] + 8, 300, 'r ∥ s ∥ t', 'font-size:14px;fill:var(--lapis)', g1);
    el('line', { x1: O[0], y1: O[1], x2: 282, y2: y1(282), style: 'stroke:var(--tinta);stroke-width:2' }, g1);
    el('line', { x1: O[0], y1: O[1], x2: 320, y2: y2(320), style: 'stroke:var(--tinta);stroke-width:2' }, g1);
    var sg = [[XP[0], XP[1], y1, C1, '6', -1], [XP[1], XP[2], y1, C2, '9', -1], [XP[0], XP[1], y2, C1, '5', 1], [XP[1], XP[2], y2, C2, '7,5', 1]].map(function (s) {
      var g = el('g', {}, g1);
      el('line', { x1: s[0], y1: s[2](s[0]), x2: s[1], y2: s[2](s[1]), style: 'stroke:' + s[3] + ';stroke-width:6;stroke-linecap:round' }, g);
      var mx = (s[0] + s[1]) / 2, my = s[2](mx);
      tx(mx + (s[5] < 0 ? -8 : 0), my + (s[5] < 0 ? -10 : 24), s[4], 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + s[3] + HALO, g);
      return g;
    });
    /* ---------- etapa 2: paralela a um lado (AB = 10, AC = 15, BC = 12; escala 20 px) ---------- */
    var g2 = el('g', {}), E = 20, Bp = [44, 300], Cp = [44 + 12 * E, 300], Ax = 19 / 24, Ay = Math.sqrt(100 - Ax * Ax), Ap = [44 + Ax * E, 300 - Ay * E];
    el('path', { d: 'M' + Ap + ' L' + Bp + ' L' + Cp + ' Z', style: 'fill:none;stroke:var(--tinta);stroke-width:2.2;stroke-linejoin:round' }, g2);
    var tri2 = el('path', { style: 'fill:color-mix(in srgb,var(--ad-c) 16%,transparent);stroke:none' }, g2);
    var DE = el('line', { style: 'stroke:' + COR + ';stroke-width:3' }, g2);
    var AD = el('line', { style: 'stroke:' + C1 + ';stroke-width:5;stroke-linecap:round' }, g2), AE = el('line', { style: 'stroke:' + C2 + ';stroke-width:5;stroke-linecap:round' }, g2);
    [['A', Ap, -6, -10], ['B', Bp, -16, 6], ['C', Cp, 8, 6]].forEach(function (v) { tx(v[1][0] + v[2], v[1][1] + v[3], v[0], R15 + 'var(--tinta)', g2); });
    var lD = tx(0, 0, 'D', R15 + 'var(--tinta);text-anchor:end' + HALO, g2), lE = tx(0, 0, 'E', R15 + 'var(--tinta)' + HALO, g2);
    var med2 = el('g', {}, g2);
    function rotSeg(P, Q, s, cor, dx, dy, pai) { tx((P[0] + Q[0]) / 2 + dx, (P[1] + Q[1]) / 2 + dy, s, 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + cor + HALO, pai); }
    var K2 = 0.4, Dk = [lerp(Ap[0], Bp[0], K2), lerp(Ap[1], Bp[1], K2)], Ek = [lerp(Ap[0], Cp[0], K2), lerp(Ap[1], Cp[1], K2)];
    rotSeg(Ap, Dk, 'AD = 4', C1, -32, 8, med2); rotSeg(Dk, Bp, 'DB = 6', 'var(--lapis)', 34, 4, med2);
    rotSeg(Ap, Ek, 'AE = 6', C2, 30, -2, med2); rotSeg(Ek, Cp, 'EC = 9', 'var(--lapis)', 30, -2, med2);
    rotSeg(Dk, Ek, 'DE = 4,8', 'var(--ad-t)', 0, 20, med2); rotSeg(Bp, Cp, 'BC = 12', 'var(--tinta)', 0, 22, med2);
    /* ---------- etapa 3: sombras sob o mesmo sol (escala 16 px por metro) ---------- */
    var g3 = el('g', {}), GY = 300, S = 16, XPR = 314, XPO = 82;
    el('line', { x1: 8, x2: 330, y1: GY, y2: GY, style: 'stroke:var(--tinta);stroke-width:1.8' }, g3);
    for (var k = 0; k < 4; k++) { var x0 = 40 + 80 * k; el('line', { x1: x0 + 60, y1: 20, x2: x0 - 30, y2: 80, style: 'stroke:' + SOL + ';stroke-width:1.6;stroke-dasharray:6 5' }, g3); }
    tx(14, 24, 'raios de sol paralelos', 'font-size:14px;fill:' + SOL + HALO, g3);
    el('rect', { x: XPR - 4, y: GY - 8 * S, width: 8, height: 8 * S, style: 'fill:var(--lapis)' }, g3);
    el('rect', { x: XPO - 2, y: GY - 2 * S, width: 4, height: 2 * S, style: 'fill:var(--tinta)' }, g3);
    el('path', { d: 'M' + XPR + ' ' + (GY - 8 * S) + ' L' + (XPR - 12 * S) + ' ' + GY, style: 'stroke:' + SOL + ';stroke-width:2' }, g3);
    el('path', { d: 'M' + XPO + ' ' + (GY - 2 * S) + ' L' + (XPO - 3 * S) + ' ' + GY, style: 'stroke:' + SOL + ';stroke-width:2' }, g3);
    el('line', { x1: XPR - 12 * S, x2: XPR, y1: GY, y2: GY, style: 'stroke:var(--tinta);stroke-width:6;opacity:.35' }, g3);
    el('line', { x1: XPO - 3 * S, x2: XPO, y1: GY, y2: GY, style: 'stroke:var(--tinta);stroke-width:6;opacity:.35' }, g3);
    tx(XPO, GY - 2 * S - 10, 'poste 2 m', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--tinta)' + HALO, g3);
    tx(XPO - 1.5 * S, GY + 20, '3 m', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g3);
    tx(XPR - 6 * S, GY + 20, 'sombra 12 m', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g3);
    var lPr = tx(XPR - 8, GY - 4 * S, 'h = ?', R15 + 'var(--tinta);text-anchor:end' + HALO, g3);
    var copia = el('path', { style: 'fill:color-mix(in srgb,' + C1 + ' 22%,transparent);stroke:' + C1 + ';stroke-width:2.2;stroke-linejoin:round' }, g3);
    var lK = tx(0, 0, '', R15 + C1 + HALO, g3);
    /* ---------- etapa 4: quadrado no canto reto (catetos 6 e 12; escala 20 px) ---------- */
    var g4 = el('g', {}), P0 = [54, 300], H = 6, B = 12;
    function q2s(x, y) { return [P0[0] + E * x, P0[1] - E * y]; }
    el('path', { d: 'M' + q2s(0, 0) + ' L' + q2s(B, 0) + ' L' + q2s(0, H) + ' Z', style: 'fill:none;stroke:var(--tinta);stroke-width:2.2;stroke-linejoin:round' }, g4);
    var quad = el('path', { style: 'fill:color-mix(in srgb,var(--ad-c) 20%,transparent);stroke:' + COR + ';stroke-width:2.6' }, g4);
    var triS = el('path', { style: 'fill:color-mix(in srgb,' + C1 + ' 20%,transparent);stroke:' + C1 + ';stroke-width:2.4;stroke-linejoin:round' }, g4);
    tx(q2s(B / 2, 0)[0], P0[1] + 22, '12', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g4);
    tx(P0[0] - 10, q2s(0, H / 2)[1] + 5, '6', 'font-size:15px;font-weight:700;text-anchor:end;fill:var(--tinta)', g4);
    var lx4 = tx(0, 0, 'x', 'font-size:16px;font-weight:700;font-style:italic;text-anchor:middle;fill:var(--ad-t)' + HALO, g4);
    var l6x = tx(0, 0, '6 − x', R15 + C1 + ';text-anchor:end' + HALO, g4);
    /* ---------- painel ---------- */
    var painel = el('g', {});
    var T = tx(350, 36, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', painel);
    var L = [0, 1, 2, 3, 4].map(function (k) { return tx(350, 68 + 25 * k, '', 'font-size:15px;fill:var(--tinta)', painel); });
    el('line', { x1: 350, x2: 630, y1: 206, y2: 206, style: 'stroke:var(--linha);stroke-width:1.2' }, painel);
    var V1 = tx(350, 236, '', 'font-size:15.5px;font-weight:700;fill:var(--tinta)', painel), V2 = tx(350, 261, '', 'font-size:15px;fill:var(--tinta)', painel);
    var TX = [
      ['1. Teorema de Tales', 'Retas paralelas (r, s, t) cortam duas', 'transversais. Os trechos entre as', 'mesmas paralelas se correspondem', '(mesma cor) e ficam na mesma razão:', ''],
      ['2. Paralela a um lado do triângulo', 'DE ∥ BC corta AB e AC na mesma', 'razão e cria ADE, semelhante a ABC:', 'AD ÷ AB = AE ÷ AC = DE ÷ BC = k', 'Compare pedaço com INTEIRO,', 'sempre a partir do vértice A.'],
      ['3. Dois ângulos iguais: semelhantes', 'Mesmo sol, mesmo instante: os raios', 'são paralelos, os ângulos são iguais', '(caso AA). Então altura ÷ sombra é', 'a mesma: 2 ÷ 3 = h ÷ 12.', 'O triângulo pequeno ampliado 4 vezes.'],
      ['4. Quadrado no canto reto', 'Quadrado de lado x encaixado no', 'ângulo reto. Em cima sobra um', 'triângulo com os mesmos ângulos:', 'semelhante ao grande.', '(6 − x) ÷ 6 = x ÷ 12']
    ];
    var VX = [['6 ÷ 9 = 5 ÷ 7,5 (= 2/3)', 'Tales vale para qualquer feixe de paralelas.'], ['', ''], ['h = 4 · 2 = 8 m', 'k = 12 ÷ 3 = 4 vale para todos os lados'], ['72 − 12x = 6x → x = 4', '']];
    var _desenha = function (t) {
      t = t / 1.4;
      var fase = t < 3.2 ? 0 : t < 6.6 ? 1 : t < 9.8 ? 2 : 3;
      op(g1, fase === 0 ? 1 : 0); op(g2, fase === 1 ? 1 : 0); op(g3, fase === 2 ? 1 : 0); op(g4, fase === 3 ? 1 : 0);
      var v1 = VX[fase][0], v2 = VX[fase][1];
      if (fase === 0) { op(sg[0], ease((t - .4) / .4)); op(sg[2], ease((t - .9) / .4)); op(sg[1], ease((t - 1.4) / .4)); op(sg[3], ease((t - 1.9) / .4)); if (t < 2.3) { v1 = ''; v2 = ''; } }
      if (fase === 1) {
        var k = t < 4.6 ? lerp(.12, .7, ease((t - 3.4) / 1.2)) : lerp(.7, K2, ease((t - 4.6) / .6));
        var D = [lerp(Ap[0], Bp[0], k), lerp(Ap[1], Bp[1], k)], Ee = [lerp(Ap[0], Cp[0], k), lerp(Ap[1], Cp[1], k)];
        at(DE, { x1: D[0], y1: D[1], x2: Ee[0], y2: Ee[1] }); at(AD, { x1: Ap[0], y1: Ap[1], x2: D[0], y2: D[1] }); at(AE, { x1: Ap[0], y1: Ap[1], x2: Ee[0], y2: Ee[1] });
        tri2.setAttribute('d', 'M' + Ap + ' L' + D + ' L' + Ee + ' Z');
        at(lD, { x: D[0] - 6, y: D[1] + 5 }); at(lE, { x: Ee[0] + 7, y: Ee[1] + 5 });
        var fixo = t > 5.25; op(med2, fixo ? 1 : 0);
        v1 = fixo ? 'k = 4 ÷ 10 = 6 ÷ 15 = 4,8 ÷ 12 = 0,4' : 'k = AD ÷ AB = ' + k.toFixed(2).replace('.', ',');
        v2 = fixo ? 'DE ∥ BC garante a mesma razão nos três.' : 'a razão é a mesma nos dois lados';
      }
      if (fase === 2) {
        var u = ease((t - 7.2) / 1.2), sc = lerp(1, 4, u);
        var ox = lerp(XPO, XPR, u), b0 = lerp(XPO - 3 * S, XPR - 12 * S, u);
        copia.setAttribute('d', 'M' + ox.toFixed(1) + ' ' + GY + ' L' + ox.toFixed(1) + ' ' + (GY - 2 * S * sc).toFixed(1) + ' L' + (ox - 3 * S * sc).toFixed(1) + ' ' + GY + ' Z');
        op(copia, t > 6.9 ? 1 : 0);
        at(lK, { x: ox - 1.5 * S * sc - 14, y: GY - S * sc - 8 }); lK.textContent = u > .99 ? '× 4' : '';
        lPr.textContent = u > .99 ? 'h = 8 m' : 'h = ?';
        if (u < .99) { v1 = ''; v2 = ''; }
      }
      if (fase === 3) {
        var x = 4 * ease((t - 10.1) / 1.3);
        quad.setAttribute('d', 'M' + q2s(0, 0) + ' L' + q2s(x, 0) + ' L' + q2s(x, x) + ' L' + q2s(0, x) + ' Z');
        var ok = x > 3.99;
        triS.setAttribute('d', 'M' + q2s(0, 4) + ' L' + q2s(4, 4) + ' L' + q2s(0, H) + ' Z'); op(triS, ok ? 1 : 0);
        at(lx4, { x: q2s(x / 2, 0)[0], y: P0[1] - 8 }); op(lx4, x > .5 ? 1 : 0);
        at(l6x, { x: P0[0] - 8, y: q2s(0, 5)[1] + 5 }); op(l6x, ok ? 1 : 0);
        if (!ok) { v1 = ''; }
      }
      var X = TX[fase]; T.textContent = X[0]; for (var m = 0; m < 5; m++) L[m].textContent = X[m + 1];
      V1.textContent = v1; V2.textContent = v2; painel.style.opacity = 1;
    };
    return fimResposta(VIS.def['tales-semelhanca'], svg, _desenha, 17.92, RESP, qid, {
      x: 340, y: 30, w: 292, semEsmaecer: true, esconde: painel,
      congela: function (q) { return q === 'W0e86d45' ? 4.34 : q === 'W1f4a211' || q === '5ad3dbbe' || q === '3ed4f15e' ? 9.1 : q === 'Pa56de09' ? 17.78 : 13.58; }
    });
  }
};
VIS.liga('tales-semelhanca', ['W0e86d45', 'W1f4a211', 'W69b5dd2', 'Wbeafe0b', '3ed4f15e', '5ad3dbbe', 'P30923db', 'Pa56de09', 'Wbc19c08']);
