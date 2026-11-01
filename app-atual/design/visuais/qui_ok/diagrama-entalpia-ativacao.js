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
'W8ca03c9': ['Por isso a resposta é A (I, II e IV)', 'Produtos (5) abaixo dos reagentes (20): ΔH = 5 − 20 = −15 kcal/mol,', 'exotérmica, libera calor (I, II e IV certas).', 'III erra: Ea = 30 − 20 = 10 kcal/mol (25 seria a da reação inversa).'],
'W21f57fd': ['Por isso a resposta é D', 'O patamar dos produtos (2 AB) está abaixo do dos reagentes:', 'ΔH = H(produtos) − H(reagentes) < 0. Negativa, exotérmica, liberando calor.'],
'P2447a90': ['Por isso a resposta é E', 'Reagentes em Y, pico em Z, produtos (água) em X.', 'Energia de ativação: do reagente ao pico, |Y − Z|.', 'Calor de reação: do reagente ao produto, |X − Y|.'],
'P6771e98': ['Por isso a resposta é C', 'No sentido inverso o reagente é C + D (5) e o produto A + B (20):', 'ΔH = 20 − 5 = +15 kcal/mol (endotérmica).', 'Ea = pico − reagente = 30 − 5 = 25 kcal/mol.'],
'P4b8697a': ['Por isso a resposta é A', 'Produtos em −10 kJ, reagentes em 20 kJ: ΔH = −10 − 20 = −30 kJ, exotérmica.', 'Ea sem catalisador: 60 − 20 = 40 kJ; com catalisador: 35 − 20 = 15 kJ.', 'O catalisador baixa o pico, mas não muda o ΔH.'],
'P2082757': ['Por isso a resposta é C', 'A faísca dá aos reagentes a energia para subir do patamar deles', 'até o topo da curva: a energia de ativação (a seta 4 do gráfico).', 'As setas que partem do zero medem a energia de um estado.'],
'P84c9235': ['Por isso a resposta é D', 'H₂ + ½ O₂ → H₂O(l): ΔH = −285 − 0 = −285 kJ por mol de água.', '36 g ÷ 18 g/mol = 2 mol → 2 × 285 = 570 kJ liberados.'],
'P96cf3b3': ['Por isso a resposta é E', 'MgO está 601,6 kJ abaixo de Mg + ½ O₂: ΔH < 0, exotérmica.', 'Mg (nox 0) → Mg²⁺ (nox +2): perde 2 elétrons, oxida-se;', 'quem perde elétrons é o redutor.'],
'P90ceb98': ['Por isso a resposta é C', 'C₂H₂ + 5/2 O₂ → 2 CO₂ + H₂O(l)', 'ΔH = [2 × (−393) + (−286)] − [+227 + 0] = −1072 − 227 = −1 299 kJ.']
};
VIS.def['diagrama-entalpia-ativacao'] = {
  tit: 'Diagrama de energia: ΔH e energia de ativação',
  fontes: ['OpenStax, Chemistry 2e, 5.3 Enthalpy — https://openstax.org/books/chemistry-2e/pages/5-3-enthalpy', 'OpenStax, Chemistry 2e, 12.5 Collision Theory (energia de ativação, diagramas de energia) — https://openstax.org/books/chemistry-2e/pages/12-5-collision-theory', 'IUPAC Gold Book, activation energy — https://goldbook.iupac.org/terms/view/A00102', 'Entalpias de formação (CO₂ −393, H₂O(l) −286, C₂H₂ +227, MgO −601,6 kJ/mol): OpenStax, Chemistry 2e, Appendix G'],
  tipo: 'anim', dur: 18,
  marcas: [[0, 'Exotérmica'], [5, 'Inversa'], [9, 'Catalisador'], [13.5, 'ΔH × mols']],
  cred: 'Animação feita para o app (esquema). Valores dos exemplos iguais aos das questões.',
  nota: 'ΔH = H(produtos) − H(reagentes): negativo, exotérmica (libera calor); positivo, endotérmica. Energia de ativação = pico − reagentes, medida a partir de quem está reagindo. Catalisador baixa o pico, não muda o ΔH.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function sg(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v); }
    var VM = '#b4442f', AZ = '#2b6cb0', VD = '#1f8a70', OU = '#c98a12';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    var GX0 = 80, GX1 = 400, GY0 = 236, GY1 = 26;
    function perfil(pai, R, Pk, Pr, emin, emax, cor) {
      var o = {};
      o.y = function (E) { return GY0 - (GY0 - GY1) * (E - emin) / (emax - emin); };
      o.x = function (s) { return GX0 + 20 + (GX1 - GX0 - 30) * s; };
      var N = [[0, R], [.18, R], [.5, Pk], [.82, Pr], [1, Pr]];
      o.E = function (s) { for (var i = 1; i < N.length; i++) if (s <= N[i][0]) { var u = (s - N[i - 1][0]) / (N[i][0] - N[i - 1][0]); return lerp(N[i - 1][1], N[i][1], u * u * (3 - 2 * u)); } return Pr; };
      var d = ''; for (var s = 0; s <= 1.0001; s += .01) d += (d ? 'L' : 'M') + o.x(s).toFixed(1) + ' ' + o.y(o.E(s)).toFixed(1) + ' ';
      o.d = d; o.c = el('path', { d: d, style: 'fill:none;stroke:' + (cor || 'var(--tinta)') + ';stroke-width:3' }, pai);
      return o;
    }
    function eixos(pai, un) {
      el('path', { d: 'M' + GX0 + ' ' + (GY1 - 8) + ' V' + GY0 + ' H' + (GX1 + 6), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, pai);
      tx(14, 16, un, 'font-size:14px;fill:var(--lapis)', pai); tx(GX1, GY0 + 20, 'caminho da reação →', 'font-size:14px;fill:var(--lapis);text-anchor:end', pai);
    }
    function nivel(pai, o, E, lab, cor) { var y = o.y(E); tx(GX0 - 6, y + 5, lab, 'font-size:14px;font-weight:700;text-anchor:end;fill:' + (cor || 'var(--lapis)'), pai); return y; }
    function tracejado(pai, x1, x2, y) { return el('line', { x1: x1, x2: x2, y1: y, y2: y, style: 'stroke:var(--lapis);stroke-width:1.3;stroke-dasharray:4 4' }, pai); }
    function seta(pai, x, y1, y2, cor, rot, ladoEsq) {
      var g = el('g', {}, pai), s = y2 < y1 ? -1 : 1;
      el('path', { d: 'M' + x + ' ' + y1 + ' V' + y2 + ' m-6 ' + (-s * 9) + ' l6 ' + (s * 9) + ' l6 ' + (-s * 9), style: 'fill:none;stroke:' + cor + ';stroke-width:2.6' }, g);
      tx(x + (ladoEsq ? -8 : 8), (y1 + y2) / 2 + 5, rot, 'font-size:15px;font-weight:700;fill:' + cor + (ladoEsq ? ';text-anchor:end' : ''), g);
      return g;
    }
    function rotulo(pai, x, y, s) { return tx(x, y, s, 'font-size:15px;font-weight:700;fill:var(--tinta);' + C, pai); }
    /* ---------- etapa 1: exotermica (20 / 30 / 5 kcal/mol) ---------- */
    var letras = qid === 'P2447a90';
    var g1 = el('g', {}); eixos(g1, letras ? 'energia' : 'kcal/mol');
    var p1 = perfil(g1, 20, 30, 5, 0, 36);
    var yR = nivel(g1, p1, 20, letras ? 'Y' : '20'), yK = nivel(g1, p1, 30, letras ? 'Z' : '30'), yP = nivel(g1, p1, 5, letras ? 'X' : '5');
    rotulo(g1, p1.x(.09), yR + 22, letras ? '2 H₂ + O₂' : 'A + B'); rotulo(g1, p1.x(.92), yP + 22, letras ? '2 H₂O' : 'C + D');
    tx(p1.x(.5), yK - 10, 'complexo ativado', 'font-size:14px;fill:var(--lapis);' + C, g1);
    var t1a = tracejado(g1, p1.x(.18), p1.x(.98), yR), t1b = tracejado(g1, GX0, p1.x(.5), yK);
    var a1 = seta(g1, p1.x(.1), yR, yK + 2, OU, 'Ea', false);
    var d1 = seta(g1, p1.x(.88), yR, yP - 2, VM, 'ΔH', false);
    var bola1 = el('circle', { r: 8, style: 'fill:' + AZ + ';stroke:var(--folha);stroke-width:2' }, g1);
    var info1 = el('g', {}, g1);
    [[letras ? 'ΔH = X − Y' : 'ΔH = 5 − 20 = −15', VM, 700], ['negativo: exotérmica', VM, 700], ['libera calor', VM, 400], [letras ? 'Ea = Z − Y' : 'Ea = 30 − 20 = 10', OU, 700], ['a barreira a vencer', 'var(--tinta)', 400]].forEach(function (l, i) { tx(440, 60 + i * 28, l[0], 'font-size:15px;font-weight:' + l[2] + ';fill:' + l[1], info1); });
    /* ---------- etapa 2: inversa ---------- */
    var g2 = el('g', {}); eixos(g2, 'kcal/mol');
    var p2 = perfil(g2, 20, 30, 5, 0, 36);
    var yR2 = nivel(g2, p2, 20, '20'), yK2 = nivel(g2, p2, 30, '30'), yP2 = nivel(g2, p2, 5, '5');
    rotulo(g2, p2.x(.09), yR2 - 10, 'A + B'); rotulo(g2, p2.x(.92), yP2 + 22, 'C + D');
    tracejado(g2, p2.x(.02), p2.x(.82), yP2); tracejado(g2, p2.x(.5), p2.x(1), yK2);
    var a2 = seta(g2, p2.x(.93), yP2, yK2 + 2, OU, 'Ea', false);
    var d2 = seta(g2, p2.x(.1), yP2, yR2 + 2, VD, 'ΔH', false);
    var bola2 = el('circle', { r: 8, style: 'fill:' + VD + ';stroke:var(--folha);stroke-width:2' }, g2);
    var info2 = el('g', {}, g2);
    [['C + D → A + B', 'var(--tinta)', 700], ['ΔH = 20 − 5 = +15', VD, 700], ['positivo: endotérmica', VD, 700], ['Ea = 30 − 5 = 25', OU, 700], ['(a direta tinha 10)', 'var(--lapis)', 400]].forEach(function (l, i) { tx(440, 60 + i * 28, l[0], 'font-size:15px;font-weight:' + l[2] + ';fill:' + l[1], info2); });
    /* ---------- etapa 3: catalisador e faisca (20 / 60 / 35 / -10 kJ) ---------- */
    var g3 = el('g', {}); eixos(g3, 'kJ');
    var p3 = perfil(g3, 20, 60, -10, -20, 68), p3c = perfil(g3, 20, 35, -10, -20, 68, VD);
    p3c.c.setAttribute('style', 'fill:none;stroke:' + VD + ';stroke-width:3;stroke-dasharray:7 5');
    var gC3 = el('g', {}, g3);
    var yR3 = nivel(g3, p3, 20, '20'), yK3 = nivel(g3, p3, 60, '60'), yC3 = nivel(gC3, p3, 35, '35', VD), yP3 = nivel(g3, p3, -10, '−10');
    rotulo(g3, p3.x(.09), yR3 + 22, 'A + B'); rotulo(g3, p3.x(.92), yP3 + 22, 'C + D');
    tracejado(g3, p3.x(.18), p3.x(.98), yR3); tracejado(g3, p3.x(.02), p3.x(.5), yK3); tracejado(gC3, p3.x(.02), p3.x(.5), yC3);
    var a3 = seta(g3, p3.x(.07), yR3, yK3 + 2, OU, '40', true);
    var a3c = seta(g3, p3.x(.13), yR3, yC3 + 2, VD, '15', false);
    var d3 = seta(g3, p3.x(.88), yR3, yP3 - 2, VM, 'ΔH', false);
    var fa = el('path', { d: 'M0 -16 l6 12 l-4 0 l7 14 l-13 -16 l5 0 l-5 -10 z', style: 'fill:#f2b632;stroke:#c98a12;stroke-width:1' }, g3);
    var info3 = el('g', {}, g3);
    [['faísca: dá a Ea', OU, 700], ['sem catalisador: 60 − 20 = 40', OU, 400], ['catalisador (tracejado):', VD, 700], ['35 − 20 = 15 kJ', VD, 400], ['ΔH = −10 − 20 = −30 kJ', VM, 700], ['igual nos dois caminhos', VM, 400]].forEach(function (l, i) { tx(440, 60 + i * 28, l[0], 'font-size:15px;font-weight:' + l[2] + ';fill:' + l[1], info3); });
    /* ---------- etapa 4: niveis de entalpia e quantidade ---------- */
    var g4 = el('g', {});
    var V4 = qid === 'P90ceb98' ? { un: 'kJ', top: ['C₂H₂(g) + 5/2 O₂(g)', 227], bot: ['2 CO₂(g) + H₂O(l)', 2 * -393 + -286], mid: ['2 C(s) + H₂(g) + 5/2 O₂(g)', 0], linhas: ['ΔH = Hf(produtos) − Hf(reagentes)', '2 × (−393) + (−286) = −1072', '−1072 − (+227) = −1 299 kJ', 'por mol de C₂H₂'] }
      : qid === 'P96cf3b3' ? { un: 'kJ', top: ['Mg(s) + ½ O₂(g)', 0], bot: ['MgO(s)', -601.6], linhas: ['ΔH = −601,6 kJ: exotérmica', 'Mg⁰ → Mg²⁺ + 2 e⁻', 'perde elétrons: oxida-se', 'é o redutor (o O₂ é o oxidante)'] }
      : { un: 'kJ', top: ['H₂(g) + ½ O₂(g)', 0], bot: ['H₂O(l)', -285], linhas: ['ΔH = −285 kJ por mol de H₂O', '36 g ÷ 18 g/mol = 2 mol', '2 × (−285) = −570 kJ', 'liberação de 570 kJ'] };
    var e4min = Math.min(V4.bot[1], 0) * 1.12, e4max = Math.max(V4.top[1], 0) + Math.abs(e4min) * .15;
    function y4(E) { return GY0 - (GY0 - GY1) * (E - e4min) / (e4max - e4min); }
    el('path', { d: 'M' + GX0 + ' ' + (GY1 - 8) + ' V' + GY0, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, g4);
    tx(14, 16, 'entalpia (kJ)', 'font-size:14px;fill:var(--lapis)', g4);
    function lv(E, s, cor, baixo) { var y = y4(E); el('line', { x1: GX0 + 30, x2: GX0 + 230, y1: y, y2: y, style: 'stroke:' + cor + ';stroke-width:3' }, g4); tx(GX0 + 130, baixo ? y + 20 : y - 8, s, 'font-size:15px;font-weight:700;fill:' + cor + ';' + C, g4); tx(GX0 - 6, y + 5, (E > 0 ? '+' : E < 0 ? '−' : '') + String(Math.abs(E)).replace('.', ','), 'font-size:14px;font-weight:700;text-anchor:end;fill:var(--lapis)', g4); }
    lv(V4.top[1], V4.top[0], 'var(--tinta)'); lv(V4.bot[1], V4.bot[0], VM); if (V4.mid) lv(V4.mid[1], V4.mid[0], 'var(--lapis)', true);
    var d4 = seta(g4, GX0 + 250, y4(V4.top[1]), y4(V4.bot[1]) - 2, VM, 'ΔH < 0', false);
    var info4 = el('g', {}, g4);
    V4.linhas.forEach(function (s, i) { tx(400, 70 + i * 30, s, 'font-size:15px;font-weight:' + (i === 2 || i === 3 && qid !== 'P90ceb98' ? 700 : 400) + ';fill:' + (i >= 2 ? VM : 'var(--tinta)'), info4); });
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 272, y2: 272, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 298, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 326 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Ler o diagrama: reagentes, pico, produtos', 'Para reagir, os reagentes sobem até o complexo ativado (Ea) e descem aos produtos.', 'ΔH = H(produtos) − H(reagentes). Produtos mais baixos: ΔH < 0,', 'a reação libera calor (exotérmica).'],
      ['2. A mesma curva lida de trás para frente', 'Na reação inversa, quem reage é C + D. O ΔH troca de sinal (+15)', 'e a Ea é medida a partir de C + D até o mesmo pico: 25.', 'Ea(inversa) = Ea(direta) + |ΔH|.'],
      ['3. A faísca e o catalisador', 'A faísca (como a do airbag) dá a energia de ativação: leva ao pico.', 'O catalisador abre um caminho com pico mais baixo (Ea menor),', 'mas reagentes e produtos ficam onde estavam: ΔH igual.'],
      ['4. ΔH vale por mol, como escrito na equação', 'O valor do diagrama corresponde aos coeficientes da equação.', 'Para outra quantidade, multiplique pela razão dos mols.', 'Por entalpias de formação: ΔH = Σ produtos − Σ reagentes.']
    ];
    var _desenha = function (t) {
      var f = t < 5 ? 0 : t < 9 ? 1 : t < 13.5 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f === 0) {
        var s = ease((t - .4) / 2.8); bola1.setAttribute('cx', p1.x(s).toFixed(1)); bola1.setAttribute('cy', (p1.y(p1.E(s)) - 9).toFixed(1));
        op(a1, cl((t - 1.6) / .4)); op(d1, cl((t - 3) / .4)); op(t1a, cl((t - 3) / .4)); op(t1b, cl((t - 1.6) / .4));
        info1.childNodes.forEach(function (n, i) { op(n, cl((t - (i < 3 ? 3.2 : 1.8) - (i % 3) * .3) / .4)); });
      }
      if (f === 1) {
        var s2 = 1 - ease((t - 5.3) / 2.2); bola2.setAttribute('cx', p2.x(s2).toFixed(1)); bola2.setAttribute('cy', (p2.y(p2.E(s2)) - 9).toFixed(1));
        op(a2, cl((t - 6.2) / .4)); op(d2, cl((t - 7.4) / .4));
        info2.childNodes.forEach(function (n, i) { op(n, cl((t - 5.4 - i * .45) / .4)); });
      }
      if (f === 2) {
        op(p3c.c, cl((t - 11) / .5)); op(gC3, cl((t - 11) / .5)); op(a3, cl((t - 9.8) / .4)); op(a3c, cl((t - 11.4) / .4)); op(d3, cl((t - 12.2) / .4)); op(yC3 ? g3.childNodes[0] : g3, 1);
        fa.setAttribute('transform', 'translate(' + (p3.x(.04)) + ' ' + (yR3 - 4) + ')'); op(fa, t > 9.4 && t < 11 ? 1 : 0);
        info3.childNodes.forEach(function (n, i) { op(n, cl((t - 9.6 - i * .5) / .4)); });
      }
      if (f === 3) { op(d4, cl((t - 14) / .4)); info4.childNodes.forEach(function (n, i) { op(n, cl((t - 14.4 - i * .6) / .4)); }); }
      var T_ = TXT[f]; L0.textContent = T_[0]; Ls.forEach(function (o, i) { o.textContent = T_[i + 1] || ''; });
    };
    var FR = { W8ca03c9: 4.95, W21f57fd: 4.95, P2447a90: 4.95, P6771e98: 8.95, P4b8697a: 13.45, P2082757: 10.55, P84c9235: 17.95, P90ceb98: 17.95, P96cf3b3: 17.95 };
    return fimResposta(VIS.def['diagrama-entalpia-ativacao'], svg, _desenha, 18, RESP, qid, { semEsmaecer: true, y: 278, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 17.95; } });
  }
};
VIS.liga('diagrama-entalpia-ativacao', ['P2447a90', 'P4b8697a', 'P6771e98', 'P84c9235', 'W21f57fd', 'W8ca03c9', 'P2082757', 'P96cf3b3', 'P90ceb98']);
