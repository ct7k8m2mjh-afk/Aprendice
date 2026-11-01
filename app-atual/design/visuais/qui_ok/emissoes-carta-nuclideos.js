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
'P0b75911': [
'Por isso a resposta é E',
'Br-90 → Kr-90 → Rb-90 → Sr-90: A fica em 90 e Z sobe 1 a cada passo',
'(35 → 36 → 37 → 38). A igual e Z + 1 é a marca da emissão β⁻.',
'Alfa derrubaria A em 4; gama não mudaria Z.'
],
'W58108d5': [
'Por isso a resposta é A',
'A partícula β⁻ tem A = 0 e carga −1: o núcleo filho fica com',
'o mesmo A e com Z + 1 (um nêutron virou próton).'
],
'P5d37d40': [
'Por isso a resposta é A',
'Ho tem Z = 67. Emitindo β⁻: A continua 166 e Z vai a 68.',
'Z = 68 é o érbio: ¹⁶⁶Er. A gama não muda A nem Z.'
],
'W84243a6': [
'Por isso a resposta é B',
'216 → 212 com Z 84 → 82: α. 212 → 212 com Z 82 → 83: β.',
'212 → 212 com Z 83 → 84: β. 212 → 208 com Z 84 → 82: α.',
'Sequência: α, β, β, α.'
],
'Pf19bb09': [
'Por isso a resposta é B',
'Cada α é um núcleo de hélio. De ²³⁸U a ²³⁴U a massa cai 4: 1 α',
'(as 2 β não mudam A). De ²³⁴U a ²³⁰Th também cai 4: 1 α.',
'Os dois trechos geram a mesma quantidade de He.'
],
'P751e98b': [
'Por isso a resposta é D',
'Nêutrons do ²⁴¹Am: 241 − 95 = 146.',
'Massa: 241 = 4 + A → A = 237. Carga: 95 = 2 + Z → Z = 93: netúnio, Np.'
],
'P8cfe01d': [
'Por isso a resposta é A',
'α + X → ²¹¹At + 2 n: massa 4 + A = 211 + 2 → A = 209;',
'carga 2 + Z = 85 → Z = 83: bismuto. At é halogênio (At⁻) e o',
'alcalino forma M⁺: fórmula MAt.'
],
'P57884d2': [
'Por isso a resposta é C',
'²³⁵U + n → ¹⁴¹Ba + X + 3 n. Massa: 236 = 141 + A + 3 → A = 92.',
'Carga: 92 + 0 = 56 + Z + 0 → Z = 36 (criptônio).'
],
'P2e73e70': [
'Por isso a resposta é E',
'X + ⁴He → ⁷Li + γ. Massa: A + 4 = 7 → A = 3. Carga: Z + 2 = 3 → Z = 1.',
'Nêutrons = 3 − 1 = 2. X é o trítio: 1 próton e 2 nêutrons.'
],
'W09d53a1': [
'Por isso a resposta é E',
'Mg-24 + X → Na-24 + H-1: A de X = 1 e Z de X = 0: nêutron.',
'Na-24 → Mg-24 + a: A de a = 0 e carga de a = −1: partícula β.'
],
'P32f4d6d': [
'Por isso a resposta é D',
'¹H + ¹H → ²H + partícula: massa 2 = 2 + 0; carga 2 = 1 + 1.',
'Partícula com A = 0 e carga +1 é o pósitron (β⁺).',
'Fusão é entre núcleos: não se forma molécula nenhuma.'
],
'Pd3d723d': [
'Por isso a resposta é C',
'Co-60 (27) → Ni-60 (28): A = 0, carga −1: elétron (β⁻).',
'U-238 (92) → Th-234 (90): A = 4, carga +2: partícula α.',
'F-18 (9) → O-18 (8): A = 0, carga +1: pósitron (β⁺).'
]
};
VIS.def['emissoes-carta-nuclideos'] = {
  tit: 'Emissões α, β e γ: o que muda no núcleo',
  fontes: ['OpenStax, Chemistry 2e, 21.2 Nuclear Equations — https://openstax.org/books/chemistry-2e/pages/21-2-nuclear-equations', 'OpenStax, Chemistry 2e, 21.3 Radioactive Decay (série do urânio-238, penetração) — https://openstax.org/books/chemistry-2e/pages/21-3-radioactive-decay', 'OpenStax, Chemistry 2e, 21.4 Transmutation and Nuclear Energy (fissão e fusão) — https://openstax.org/books/chemistry-2e/pages/21-4-transmutation-and-nuclear-energy'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Série U-238'], [3, 'Balanço'], [6, 'Fissão/fusão'], [9, 'β⁻, β⁺ e γ'], [12, 'Penetração']],
  cred: 'Animação feita para o app (esquema fora de escala). As contas de A e Z são feitas no código.',
  nota: 'Em toda equação nuclear a soma dos números de massa (A) e a soma das cargas (Z) são iguais dos dois lados. α = núcleo de hélio (A 4, Z 2); β⁻ = elétron (A 0, carga −1); β⁺ = pósitron (A 0, carga +1); γ = energia (A 0, carga 0); nêutron (A 1, carga 0).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function sg(n) { return n < 0 ? '−' + (-n) : String(n); }
    var CA = '#c0392b', CB = '#2b6cb0', CP = '#8a4fb0', CG = '#2e8b57';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    /* nuclideo com A em cima e Z embaixo, a esquerda do simbolo */
    function nuc(x, y, A, Z, S, cor, pai) {
      var g = el('g', {}, pai), w = Math.max(String(A).length, sg(Z).length) * 8.4;
      tx(x + w, y - 10, String(A), 'font-size:14px;fill:' + cor + ';text-anchor:end', g);
      tx(x + w, y + 8, sg(Z), 'font-size:14px;fill:' + cor + ';text-anchor:end', g);
      tx(x + w + 2, y + 6, S, 'font-size:22px;font-weight:700;fill:' + cor, g);
      return { g: g, w: w + 2 + S.length * 15 };
    }
    /* linha de equacao: tokens [A, Z, S, cor] ou texto */
    function equacao(x, y, toks, pai) {
      var g = el('g', {}, pai), pos = [];
      toks.forEach(function (t) {
        if (typeof t === 'string') { var s = tx(x + 8, y + 6, t, 'font-size:20px;font-weight:700;fill:var(--tinta)', g); pos.push(x); x += 18 + t.length * 12; }
        else { var n = nuc(x, y, t[0], t[1], t[2], t[3] || 'var(--tinta)', g); pos.push(x + n.w / 2); x += n.w + 4; }
      });
      return { g: g, pos: pos, fim: x };
    }
    /* ===== cena 1: serie do U-238 numa grade Z x A ===== */
    var c1 = el('g', {});
    function GX(z) { return 330 + (z - 88) * 70; }
    function GY(a) { return 46 + (238 - a) / 4 * 50; }
    for (var z = 88; z <= 92; z++) { el('line', { x1: GX(z), x2: GX(z), y1: GY(240), y2: GY(224), style: 'stroke:var(--linha);stroke-width:1' }, c1); tx(GX(z), 220, 'Z ' + z, 'font-size:14px;fill:var(--lapis);text-anchor:middle', c1); }
    [238, 234, 230, 226].forEach(function (a) { el('line', { x1: GX(87.6), x2: GX(92.4), y1: GY(a), y2: GY(a), style: 'stroke:var(--linha);stroke-width:1' }, c1); tx(GX(87.6) - 6, GY(a) + 5, 'A ' + a, 'font-size:14px;fill:var(--lapis);text-anchor:end', c1); });
    var SER = [[92, 238, 'U'], [90, 234, 'Th'], [91, 234, 'Pa'], [92, 234, 'U'], [90, 230, 'Th'], [88, 226, 'Ra']];
    var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    function sup(n) { return String(n).split('').map(function (c) { return SUP[c]; }).join(''); }
    var NO = SER.map(function (s) { var g = el('g', {}, c1); el('rect', { x: GX(s[0]) - 24, y: GY(s[1]) - 13, width: 48, height: 26, rx: 13, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:1.6' }, g); tx(GX(s[0]), GY(s[1]) + 5, sup(s[1]) + s[2], 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g); return g; });
    var SET = [];
    for (var k = 1; k < SER.length; k++) {
      var a = SER[k - 1], b = SER[k], alfa = b[1] === a[1] - 4, cor = alfa ? CA : CB;
      var x1 = GX(a[0]), y1 = GY(a[1]), x2 = GX(b[0]), y2 = GY(b[1]), ang = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(ang), s = Math.sin(ang);
      var g = el('g', {}, c1);
      var r0 = Math.abs(c) > .9 ? 25 : 22; el('path', { d: 'M' + (x1 + r0 * c).toFixed(1) + ' ' + (y1 + r0 * s).toFixed(1) + ' L' + (x2 - r0 * c).toFixed(1) + ' ' + (y2 - r0 * s).toFixed(1) + ' l' + (-8 * c + 5 * s).toFixed(1) + ' ' + (-8 * s - 5 * c).toFixed(1) + ' m' + (8 * c - 5 * s).toFixed(1) + ' ' + (8 * s + 5 * c).toFixed(1) + ' l' + (-8 * c - 5 * s).toFixed(1) + ' ' + (-8 * s + 5 * c).toFixed(1), style: 'fill:none;stroke:' + cor + ';stroke-width:2.4' }, g);
      tx((x1 + x2) / 2 + (alfa ? (k === 1 ? -6 : 8) : 0), (y1 + y2) / 2 + (alfa ? (k === 1 ? -10 : 20) : -10), alfa ? 'α' : 'β⁻', 'font-size:16px;font-weight:700;fill:' + cor + ';text-anchor:middle', g);
      SET.push(g);
    }
    tx(16, 40, 'Regras (conservação de A e Z):', 'font-size:15px;font-weight:700;fill:var(--tinta)', c1);
    tx(16, 66, 'α = ⁴₂He:  A − 4,  Z − 2', 'font-size:16px;font-weight:700;fill:' + CA, c1);
    tx(16, 92, 'β⁻ = ⁰₋₁e:  A igual,  Z + 1', 'font-size:16px;font-weight:700;fill:' + CB, c1);
    var cont1 = tx(16, 138, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', c1), cont2 = tx(16, 160, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', c1);
    tx(16, 196, 'cada α vira um átomo de hélio', 'font-size:14px;fill:var(--lapis)', c1);
    /* ===== cena 2: balanco (americio) ===== */
    var c2 = el('g', {});
    var Am = { A: 241, Z: 95 }, al = { A: 4, Z: 2 }, X = { A: Am.A - al.A, Z: Am.Z - al.Z };
    var e2 = equacao(150, 70, [[Am.A, Am.Z, 'Am'], '→', [al.A, al.Z, 'α', CA], '+', [X.A, X.Z, 'Np', CB]], c2);
    var b2 = [tx(16, 122, 'massa:  ' + Am.A + ' = ' + al.A + ' + A   →   A = ' + X.A, 'font-size:16px;fill:var(--tinta)', c2),
      tx(16, 150, 'carga:   ' + Am.Z + ' = ' + al.Z + ' + Z   →   Z = ' + X.Z + '  (netúnio, Np)', 'font-size:16px;fill:var(--tinta)', c2),
      tx(16, 178, 'nêutrons do Am = A − Z = ' + Am.A + ' − ' + Am.Z + ' = ' + (Am.A - Am.Z), 'font-size:16px;fill:var(--tinta)', c2),
      tx(16, 206, 'o Z diz qual é o elemento; o A diz qual isótopo', 'font-size:14px;fill:var(--lapis)', c2)];
    /* ===== cena 3: fissao e fusao ===== */
    var c3 = el('g', {});
    var U = { A: 235, Z: 92 }, Ba = { A: 141, Z: 56 }, nn = 3, Kr = { A: U.A + 1 - Ba.A - nn, Z: U.Z - Ba.Z };
    tx(16, 34, 'Fissão', 'font-size:15px;font-weight:700;fill:var(--ad-t)', c3);
    equacao(16, 66, [[U.A, U.Z, 'U'], '+', [1, 0, 'n'], '→', [Ba.A, Ba.Z, 'Ba'], '+', [Kr.A, Kr.Z, 'Kr', CB], '+', '3', [1, 0, 'n']], c3);
    var f3a = tx(16, 104, 'massa: ' + (U.A + 1) + ' = ' + Ba.A + ' + A + 3   →   A = ' + Kr.A + ';   carga: ' + U.Z + ' = ' + Ba.Z + ' + Z   →   Z = ' + Kr.Z, 'font-size:15px;fill:var(--tinta)', c3);
    var Li = { A: 7, Z: 3 }, He = { A: 4, Z: 2 }, T = { A: Li.A - He.A, Z: Li.Z - He.Z };
    tx(16, 140, 'Fusão', 'font-size:15px;font-weight:700;fill:var(--ad-t)', c3);
    equacao(16, 172, [[T.A, T.Z, 'H', CB], '+', [He.A, He.Z, 'He'], '→', [Li.A, Li.Z, 'Li'], '+', [0, 0, 'γ', CG]], c3);
    var f3b = tx(16, 210, 'X: A = ' + Li.A + ' − ' + He.A + ' = ' + T.A + ', Z = ' + Li.Z + ' − ' + He.Z + ' = ' + T.Z + ' → trítio (' + T.Z + ' próton, ' + (T.A - T.Z) + ' nêutrons)', 'font-size:15px;fill:var(--tinta)', c3);
    /* ===== cena 4: beta-, beta+ e gama ===== */
    var c4 = el('g', {});
    tx(16, 34, 'Dentro do núcleo:', 'font-size:15px;font-weight:700;fill:var(--tinta)', c4);
    equacao(16, 70, [[1, 0, 'n'], '→', [1, 1, 'p'], '+', [0, -1, 'e', CB]], c4); tx(300, 76, 'β⁻: Z + 1, A igual (ex.: ⁶⁰Co → ⁶⁰Ni)', 'font-size:15px;font-weight:700;fill:' + CB, c4);
    equacao(16, 124, [[1, 1, 'p'], '→', [1, 0, 'n'], '+', [0, '+1', 'e', CP]], c4); tx(300, 130, 'β⁺ (pósitron): Z − 1, A igual', 'font-size:15px;font-weight:700;fill:' + CP, c4);
    tx(300, 150, 'ex.: ¹⁸F → ¹⁸O + β⁺;  no Sol: ¹H + ¹H → ²H + β⁺', 'font-size:14px;fill:var(--tinta)', c4);
    tx(16, 192, 'γ: só energia (A 0, carga 0). Não muda A nem Z;', 'font-size:15px;font-weight:700;fill:' + CG, c4);
    tx(16, 212, 'sai junto com α ou β quando o núcleo filho perde o excesso de energia.', 'font-size:14px;fill:var(--tinta)', c4);
    /* ===== cena 5: penetracao e campo eletrico ===== */
    var c5 = el('g', {});
    tx(16, 34, 'Poder de penetração', 'font-size:15px;font-weight:700;fill:var(--tinta)', c5);
    var BAR = [[130, 'papel', '#e8e2d0', 6], [196, 'alumínio', '#b9c3cc', 10], [266, 'chumbo', '#6d737a', 22]];
    BAR.forEach(function (b) { el('rect', { x: b[0], y: 50, width: b[3], height: 150, style: 'fill:' + b[2] + ';stroke:var(--tinta);stroke-width:1' }, c5); tx(b[0] + b[3] / 2, 216, b[1], 'font-size:14px;fill:var(--tinta);text-anchor:middle', c5); });
    var RAI = [[CA, 'α', 130, 80], [CB, 'β', 196, 125], [CG, 'γ', 330, 170]];
    var RL = RAI.map(function (r) { var g = el('g', {}, c5); var ln = el('line', { x1: 40, y1: r[3], y2: r[3], style: 'stroke:' + r[0] + ';stroke-width:3' }, g); tx(24, r[3] + 5, r[1], 'font-size:17px;font-weight:700;fill:' + r[0] + ';text-anchor:middle', g); return { ln: ln, fim: r[2], g: g, gama: r[1] === 'γ' }; });
    tx(380, 34, 'Entre placas carregadas', 'font-size:15px;font-weight:700;fill:var(--tinta)', c5);
    el('rect', { x: 430, y: 46, width: 180, height: 8, style: 'fill:' + CB }, c5); tx(620, 56, '+', 'font-size:18px;font-weight:700;fill:' + CB, c5);
    el('rect', { x: 430, y: 196, width: 180, height: 8, style: 'fill:' + CA }, c5); tx(620, 206, '−', 'font-size:18px;font-weight:700;fill:' + CA, c5);
    var CAMP = [[CA, 'α', 26], [CB, 'β', -62], [CG, 'γ', 0]].map(function (r) { var g = el('g', {}, c5), p = el('path', { style: 'fill:none;stroke:' + r[0] + ';stroke-width:3' }, g), t = tx(0, 0, r[1], 'font-size:16px;font-weight:700;fill:' + r[0], g); return { p: p, t: t, d: r[2] }; });
    tx(384, 130, 'fonte', 'font-size:14px;fill:var(--lapis)', c5);
    /* ===== painel ===== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Série do urânio-238: cada passo é α ou β', 'α tira 2 prótons e 2 nêutrons: desce 4 em A e 2 em Z.', 'β⁻ não muda A e sobe 1 em Z (um nêutron vira próton).', 'Contar α: diferença de massa ÷ 4. As β acertam o Z depois.'],
      ['Balanço: A e Z se conservam', 'Some os números de massa de cada lado: têm de ser iguais.', 'Faça o mesmo com as cargas (Z). O que faltar é a partícula ou o núcleo.', 'Nêutrons = A − Z. Com o Z, a tabela periódica dá o elemento.'],
      ['O mesmo balanço vale para fissão e fusão', 'Fissão: um núcleo grande, atingido por nêutron, parte-se em dois', 'e solta nêutrons (conte todos!). Fusão: núcleos leves se juntam.', 'Em ambas, a soma de A e a soma de Z fecham dos dois lados.'],
      ['β⁻, β⁺ e γ', 'β⁻: um nêutron vira próton e sai um elétron: Z + 1.', 'β⁺: um próton vira nêutron e sai um pósitron (A 0, carga +1): Z − 1.', 'γ é energia: não muda A nem Z.'],
      ['Penetração e desvio', 'α é barrada por uma folha de papel; β, por alguns mm de alumínio;', 'γ atravessa e só é reduzida por chumbo ou concreto espessos.', 'No campo elétrico: α (+) vai para a placa −; β (−) desvia mais, para a +; γ segue reta.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D;
      [c1, c2, c3, c4, c5].forEach(function (c, j) { op(c, i === j ? 1 : 0); });
      var nS = i === 0 ? Math.min(5, Math.floor(cl((u - .2) / 2.2) * 5 + .001)) : 5;
      NO.forEach(function (n, j) { op(n, j <= nS ? 1 : .2); }); SET.forEach(function (s, j) { op(s, j < nS ? 1 : 0); });
      cont1.textContent = nS >= 3 ? '²³⁸U → ²³⁴U: 1 α + 2 β⁻' : ''; cont2.textContent = nS >= 4 ? '²³⁴U → ²³⁰Th: 1 α' : '';
      b2.forEach(function (b, j) { op(b, i === 1 ? cl((u - .3 - .55 * j) / .3) : 0); });
      op(f3a, i === 2 ? cl((u - .6) / .3) : 0); op(f3b, i === 2 ? cl((u - 1.6) / .3) : 0);
      RL.forEach(function (r, j) { var x2 = 40 + (r.fim - 40) * ease((u - .2 - .2 * j) / 1.2); r.ln.setAttribute('x2', x2.toFixed(1)); if (r.gama) r.ln.style.strokeWidth = (3 - 1.6 * cl((x2 - 270) / 40)).toFixed(1); });
      CAMP.forEach(function (c, j) {
        var f = ease((u - .3) / 1.6), x0 = 420, y0 = 125, L = 190 * f, d = '';
        for (var s = 0; s <= 1.0001; s += .1) { var xx = x0 + L * s, yy = y0 + c.d * Math.pow(s * f, 2); d += (d ? 'L' : 'M') + xx.toFixed(1) + ' ' + yy.toFixed(1) + ' '; }
        c.p.setAttribute('d', d); c.t.setAttribute('x', (x0 + L + 4).toFixed(1)); c.t.setAttribute('y', (y0 + c.d * f * f + 5).toFixed(1)); op(c.t, f > .9 ? 1 : 0);
      });
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CGq = { 'P0b75911': D - .05, 'W58108d5': D - .05, 'P5d37d40': D - .05, 'W84243a6': D - .05, 'Pf19bb09': D - .05, 'P751e98b': 2 * D - .05, 'P8cfe01d': 2 * D - .05, 'W09d53a1': 2 * D - .05, 'P57884d2': 3 * D - .05, 'P2e73e70': 3 * D - .05, 'P32f4d6d': 4 * D - .05, 'Pd3d723d': 4 * D - .05 };
    return fimResposta(VIS.def['emissoes-carta-nuclideos'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CGq[q] !== undefined ? CGq[q] : 5 * D - .05; }
    });
  }
};
VIS.liga('emissoes-carta-nuclideos', ['P0b75911', 'W58108d5', 'P5d37d40', 'W84243a6', 'Pf19bb09', 'P751e98b', 'P8cfe01d', 'W09d53a1', 'P57884d2', 'P2e73e70', 'P32f4d6d', 'Pd3d723d']);
