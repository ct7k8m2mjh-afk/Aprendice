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
'P694024d': ['Por isso a resposta é D', 'O etanol tem H ligado a O (O–H) e pares livres no O, como a água:', 'um doa o H e o outro recebe, nos dois sentidos. São ligações de', 'hidrogênio, e por isso o etanol se mistura à água em qualquer proporção.'],
'P969080f': ['Por isso a resposta é C', 'Os grupos O–H da vitamina C têm H ligado a O (doador) e O com', 'pares livres (receptor). Com a água formam ligações de hidrogênio.'],
'Pc5a19d7': ['Por isso a resposta é A', 'Só o álcool isopropílico (3) tem H ligado a O: é o único doador.', 'O nitrometano (2) recebe nos oxigênios do NO₂. Doador + receptor = 2 e 3.', 'Acetonitrila, nitrometano e tolueno têm todo H preso a carbono.'],
'W86336f0': ['Por isso a resposta é B', 'Só o etanol, CH₃CH₂O–H, tem H preso a O. Nas outras fórmulas todo H', 'está em CH₃ ou CH₂ (preso a C) e não faz ligação de hidrogênio.'],
'Wb2c5499': ['Por isso a resposta é D', 'HF: H ligado a F, que está na lista F, O, N → ligação de hidrogênio.', 'HCl: polar, mas o Cl não está na lista → só dipolo-dipolo.'],
'Pf8747c6': ['Por isso a resposta é E', 'Dos cinco hidretos, só o NH₃ tem H ligado a N, F ou O: ligação de', 'hidrogênio. Por isso ferve a −33 °C, acima de H₂S (−60), AsH₃ (−62),', 'HCl (−85) e PH₃ (−88). É a amônia dos frigoríficos.'],
'Wde968ea': ['Por isso a resposta é D (II, III e IV)', 'I é falsa: ferver separa moléculas; a O–H de dentro fica inteira.', 'II: atração entre moléculas mais forte → ferve mais quente.', 'III: mais pressão externa e IV: soluto dissolvido também elevam a', 'temperatura de ebulição (a pressão de vapor precisa subir mais).'],
'Pbedb3f4': ['Por isso a resposta é B', 'Etapa 1 (25–250 °C): a água sai inteira, só se desfaz a ligação de', 'hidrogênio que a prendia aos OH. Etapa 2 (250–550 °C): dois OH viram', 'uma ponte O e uma H₂O nova; para isso a ligação covalente O–H se rompe.']
};
VIS.def['forcas-intermoleculares-ligacao-h'] = {
  tit: 'Forças entre moléculas e ligação de hidrogênio',
  fontes: ['OpenStax, Chemistry 2e, 10.1 Intermolecular Forces — https://openstax.org/books/chemistry-2e/pages/10-1-intermolecular-forces', 'IUPAC Gold Book, hydrogen bond — https://goldbook.iupac.org/terms/view/H02899', 'Wikipedia (en), Hydrogen bond — https://en.wikipedia.org/wiki/Hydrogen_bond', 'Temperaturas de ebulição: Wikipedia (en), páginas de cada hidreto (Methane, Ammonia, Water, Hydrogen fluoride, Phosphine, Arsine etc.)'],
  tipo: 'anim', dur: 20,
  marcas: [[0, 'Ligação de H'], [5, 'Quem faz'], [10, 'Ebulição'], [15, 'Inter×intra']],
  cred: 'Animação feita para o app (esquema; pontilhado = ligação de hidrogênio, traço cheio = ligação covalente). Temperaturas de ebulição a 1 atm.',
  nota: 'Ligação de hidrogênio exige um H preso a F, O ou N (doador) e um F, O ou N com par livre em outra molécula (receptor). Ferver ou desidratar água de cristalização rompe só atrações entre moléculas; romper ligação covalente pede muito mais energia.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var OX = '#cc3d33', HB = '#2b6cb0', VD = '#1f8a70', VM = '#b4442f', CI = '#7a7a7a';
    var A = 'font-size:16px;font-weight:700;text-anchor:middle;fill:var(--tinta)';
    svg.setAttribute('viewBox', '0 0 640 410');
    function lig(x1, y1, x2, y2, pai) { return el('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:var(--tinta);stroke-width:2' }, pai); }
    function ponte(x1, y1, x2, y2, pai) { return el('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: 'stroke:' + HB + ';stroke-width:3;stroke-dasharray:3 5;stroke-linecap:round' }, pai); }
    function agua(g, ox, oy, h1, h2) {   /* O e dois H (vetores relativos) */
      lig(ox + h1[0] * .45, oy + h1[1] * .45, ox + h1[0] * .78, oy + h1[1] * .78, g); lig(ox + h2[0] * .45, oy + h2[1] * .45, ox + h2[0] * .78, oy + h2[1] * .78, g);
      tx(ox, oy + 6, 'O', A + ';fill:' + OX, g); tx(ox + h1[0], oy + h1[1] + 6, 'H', A, g); tx(ox + h2[0], oy + h2[1] + 6, 'H', A, g);
    }
    /* ---------- etapa 1: etanol + agua ---------- */
    var g1 = el('g', {});
    var et = el('g', {}, g1);
    tx(62, 106, 'H₃C', A, et); lig(84, 100, 112, 100, et); tx(136, 106, 'CH₂', A, et); lig(160, 100, 188, 100, et);
    tx(202, 106, 'O', A + ';fill:' + OX, et); lig(214, 100, 240, 100, et); tx(252, 106, 'H', A, et);
    tx(202, 80, 'δ−', 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + OX, et); tx(252, 80, 'δ+', 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + HB, et);
    tx(150, 62, 'etanol', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--lapis)', et);
    var wA = el('g', {}, g1); agua(wA, 352, 100, [28, -30], [28, 30]);
    tx(352, 80, 'δ−', 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + OX, wA);
    tx(400, 104, 'água', 'font-size:15px;font-weight:700;fill:var(--lapis)', wA);
    var hb1 = ponte(264, 100, 338, 100, g1);
    var wB = el('g', {}, g1); agua(wB, 202, 196, [0, -40], [-34, 22]);
    tx(232, 206, 'água', 'font-size:15px;font-weight:700;fill:var(--lapis)', wB);
    var hb2 = ponte(202, 112, 202, 146, g1);
    var lg1 = el('g', {}, g1);
    tx(280, 46, 'H do etanol → O da água', 'font-size:14px;font-weight:700;fill:' + HB, lg1);
    var lg2 = el('g', {}, g1);
    tx(212, 134, 'H da água → O do etanol', 'font-size:14px;font-weight:700;fill:' + HB, lg2);
    var leg = el('g', {}, g1);
    el('rect', { x: 452, y: 112, width: 176, height: 92, rx: 10, style: 'fill:color-mix(in srgb,' + HB + ' 7%,var(--folha));stroke:' + HB + ';stroke-width:1.4' }, leg);
    tx(464, 134, 'doador: H preso', 'font-size:14px;font-weight:700;fill:var(--tinta)', leg);
    tx(464, 152, 'a F, O ou N', 'font-size:14px;fill:var(--tinta)', leg);
    tx(464, 176, 'receptor: F, O ou N', 'font-size:14px;font-weight:700;fill:var(--tinta)', leg);
    tx(464, 194, 'com par livre', 'font-size:14px;fill:var(--tinta)', leg);
    var esc = el('g', {}, g1);
    el('path', { d: 'M20 240 H620 m-10 -6 l10 6 l-10 6', style: 'fill:none;stroke:var(--lapis);stroke-width:1.6' }, esc);
    [['dipolo induzido', 20], ['dipolo-dipolo', 175], ['ligação de H', 318], ['íon-dipolo', 460]].forEach(function (a, i) { tx(a[1], 258, a[0], 'font-size:14px;font-weight:700;fill:' + (i === 2 ? HB : 'var(--lapis)'), esc); });
    tx(20, 230, 'mais fraca', 'font-size:14px;fill:var(--lapis)', esc); tx(600, 230, 'mais forte', 'font-size:14px;fill:var(--lapis);text-anchor:end', esc);
    /* ---------- etapa 2: quem faz ---------- */
    var g2 = el('g', {});
    var TL = [
      ['HF', 'H–F ··· H–F', true, 'sim: H preso a F', ''],
      ['HCl', 'H–Cl   H–Cl', false, 'não: Cl fora de F, O, N', 'só dipolo-dipolo'],
      ['etanol', 'CH₃CH₂O–H ··· O', true, 'sim: H preso a O', ''],
      ['éter etílico', 'CH₃CH₂–O–CH₂CH₃', false, 'não entre si:', 'todo H está preso a C'],
      ['álcool isopropílico', '+ nitrometano', true, 'sim: o O–H do álcool doa,', 'o O do NO₂ recebe'],
      ['vitamina C + água', 'R–O–H ··· OH₂', true, 'sim: os grupos O–H', 'fazem ligação de H']
    ];
    var tiles = TL.map(function (a, i) {
      var x = 12 + (i % 3) * 206, y = 10 + Math.floor(i / 3) * 124, g = el('g', {}, g2), c = a[2] ? VD : VM;
      el('rect', { x: x, y: y, width: 198, height: 114, rx: 10, style: 'fill:color-mix(in srgb,' + c + ' 7%,var(--folha));stroke:' + c + ';stroke-width:1.5' }, g);
      tx(x + 12, y + 26, a[0], 'font-size:16px;font-weight:700;fill:var(--tinta)', g);
      tx(x + 12, y + 52, a[1], 'font-size:15px;fill:var(--tinta)', g);
      if (a[2]) el('path', { d: 'M' + (x + 12) + ' ' + (y + 77) + ' l5 6 l10 -12', style: 'fill:none;stroke:' + c + ';stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round' }, g);
      else el('path', { d: 'M' + (x + 13) + ' ' + (y + 70) + ' l11 11 m0 -11 l-11 11', style: 'fill:none;stroke:' + c + ';stroke-width:2.6;stroke-linecap:round' }, g);
      tx(x + 32, y + 82, a[3], 'font-size:14px;font-weight:700;fill:' + c, g);
      tx(x + 32, y + 102, a[4], 'font-size:14px;fill:var(--tinta)', g);
      return g;
    });
    /* ---------- etapa 3: ebulicao dos hidretos ---------- */
    var g3 = el('g', {});
    var SER = [
      { n: 'grupo 16', c: OX, v: [100, -60.3, -41.3, -2.0], f: ['H₂O', 'H₂S', 'H₂Se', 'H₂Te'] },
      { n: 'grupo 17', c: VD, v: [19.5, -85.1, -66.8, -35.4], f: ['HF', 'HCl', 'HBr', 'HI'] },
      { n: 'grupo 15', c: HB, v: [-33.3, -87.7, -62.5, -17.0], f: ['NH₃', 'PH₃', 'AsH₃', 'SbH₃'] },
      { n: 'grupo 14', c: CI, v: [-161.5, -111.9, -88.5, -52.0], f: ['CH₄', 'SiH₄', 'GeH₄', 'SnH₄'] }
    ];
    var X0 = 196, X1 = 470, Y0 = 236, Y1 = 22, VMIN = -180, VMAX = 110;
    function px(i) { return X0 + (X1 - X0) * i / 3; }
    function py(v) { return Y0 - (Y0 - Y1) * (v - VMIN) / (VMAX - VMIN); }
    [-150, -100, -50, 0, 50, 100].forEach(function (v) { el('line', { x1: X0 - 6, x2: X1 + 10, y1: py(v), y2: py(v), style: 'stroke:var(--linha);stroke-width:' + (v === 0 ? 1.6 : 1) }, g3); tx(X1 + 16, py(v) + 5, v + '', 'font-size:14px;fill:var(--lapis)', g3); });
    tx(X1 + 16, 14, '°C', 'font-size:14px;fill:var(--lapis)', g3);
    ['2º', '3º', '4º', '5º'].forEach(function (s, i) { tx(px(i), Y0 + 20, s, 'font-size:14px;fill:var(--lapis);text-anchor:middle', g3); });
    tx(X1 + 60, Y0 + 20, 'período', 'font-size:14px;fill:var(--lapis);text-anchor:middle', g3);
    SER.forEach(function (s) {
      s.p = el('path', { style: 'fill:none;stroke:' + s.c + ';stroke-width:2.6' }, g3);
      s.pts = s.v.map(function (v, i) { return el('circle', { cx: px(i), cy: py(v), r: 4.2, style: 'fill:' + s.c }, g3); });
      s.lab = tx(X0 - 12, py(s.v[0]) + 5, s.f[0] + '  ' + (s.v[0] > 0 ? '' : '−') + Math.abs(Math.round(s.v[0])) + ' °C', 'font-size:15px;font-weight:700;text-anchor:end;fill:' + s.c, g3);
    });
    var dest3 = el('g', {}, g3);
    [[2, 1], [2, 2], [3, 0]].forEach(function () {});
    var cmp = [['NH₃', -33.3, 0, HB], ['H₂S', -60.3, 1, OX], ['AsH₃', -62.5, 2, HB], ['HCl', -85.1, 1, VD], ['PH₃', -87.7, 1, HB]];
    var cbx = el('g', {}, dest3);
    el('rect', { x: 524, y: 96, width: 104, height: 128, rx: 8, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.2' }, cbx);
    cmp.forEach(function (c, i) { tx(534, 118 + i * 23, c[0], 'font-size:14px;font-weight:700;fill:' + c[3], cbx); tx(620, 118 + i * 23, (c[1] < 0 ? '−' : '') + Math.abs(Math.round(c[1])), 'font-size:14px;fill:var(--tinta);text-anchor:end', cbx); });
    tx(576, 88, 'ebulição', 'font-size:14px;fill:var(--lapis);text-anchor:middle', cbx);
    var ring = el('circle', { cx: px(0), cy: py(-33.3), r: 9, style: 'fill:none;stroke:' + HB + ';stroke-width:2.2' }, dest3);
    /* ---------- etapa 4: inter x intra ---------- */
    var g4 = el('g', {});
    tx(150, 22, 'ferver a água', 'font-size:16px;font-weight:700;fill:var(--tinta);text-anchor:middle', g4);
    tx(476, 22, 'desidratar um óxido hidratado', 'font-size:16px;font-weight:700;fill:var(--tinta);text-anchor:middle', g4);
    el('line', { x1: 300, x2: 300, y1: 10, y2: 256, style: 'stroke:var(--linha);stroke-width:1.2;stroke-dasharray:4 5' }, g4);
    /* agua fervendo: 3 moleculas */
    var W = [[90, 140, -1], [150, 108, 0], [210, 140, 1]];
    var wm = W.map(function (w) { var g = el('g', {}, g4); agua(g, 0, 0, [-24, 22], [24, 22]); return g; });
    var hbW = [el('line', { style: 'stroke:' + HB + ';stroke-width:3;stroke-dasharray:3 5;stroke-linecap:round' }, g4), el('line', { style: 'stroke:' + HB + ';stroke-width:3;stroke-dasharray:3 5;stroke-linecap:round' }, g4)];
    var calor = el('g', {}, g4);
    for (var i = 0; i < 4; i++) el('path', { d: 'M' + (96 + i * 36) + ' 254 q-6 -6 0 -12 q6 -6 0 -12', style: 'fill:none;stroke:' + VM + ';stroke-width:2;stroke-linecap:round' }, calor);
    var tW1 = tx(150, 198, 'rompe: ligações de H', 'font-size:14px;font-weight:700;fill:' + HB + ';text-anchor:middle', g4);
    var tW2 = tx(150, 220, 'O–H de cada molécula: inteira', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g4);
    /* oxido hidratado */
    var MX = [366, 436, 516, 586], MY = 238;
    el('line', { x1: 336, x2: 616, y1: MY, y2: MY, style: 'stroke:var(--tinta);stroke-width:2' }, g4);
    MX.forEach(function (x) { el('circle', { cx: x, cy: MY, r: 13, style: 'fill:color-mix(in srgb,#5b6b7a 22%,var(--folha));stroke:#5b6b7a;stroke-width:1.4' }, g4); tx(x, MY + 5, 'M', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--tinta)', g4); });
    var OH = MX.map(function (x) {
      var g = el('g', {}, g4), o = {};
      o.lM = lig(x, MY - 13, x, MY - 30, g); o.O = tx(x, MY - 36, 'O', A + ';fill:' + OX, g); o.lH = lig(x, MY - 54, x, MY - 64, g); o.H = tx(x, MY - 68, 'H', A, g); o.g = g; return o;
    });
    var aguas = MX.map(function (x) { var g = el('g', {}, g4); agua(g, 0, 0, [-20, -20], [20, -20]); return g; });
    var hbO = MX.map(function (x) { return ponte(x, MY - 86, x, MY - 104, g4); });
    var ponteO = [0, 1].map(function (k) {
      var x = (MX[2 * k] + MX[2 * k + 1]) / 2, g = el('g', {}, g4);
      lig(MX[2 * k] + 10, MY - 10, x - 8, MY - 30, g); lig(MX[2 * k + 1] - 10, MY - 10, x + 8, MY - 30, g); tx(x, MY - 34, 'O', A + ';fill:' + OX, g); return g;
    });
    var novas = [0, 1].map(function (k) { var g = el('g', {}, g4); agua(g, 0, 0, [-20, -20], [20, -20]); return g; });
    var e1 = tx(476, 52, '', 'font-size:14px;font-weight:700;text-anchor:middle', g4);
    var e2 = tx(476, 70, '', 'font-size:14px;text-anchor:middle;fill:var(--tinta)', g4);
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 268, y2: 268, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 294, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 322 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Ligação de hidrogênio: doador + receptor', 'O H preso ao O fica bem positivo (δ+) e é atraído pelo par livre', 'do O de outra molécula (δ−). Etanol e água fazem isso nos dois sentidos.', 'É a mais forte das atrações entre moléculas neutras.'],
      ['2. Quem faz e quem não faz', 'Procure um H preso diretamente a F, O ou N. H preso a C não serve:', 'C e H puxam elétrons com força parecida. Numa mistura basta', 'uma substância doar e a outra receber.'],
      ['3. Temperatura de ebulição dos hidretos', 'Descendo o grupo, a molécula fica maior e ferve mais quente.', 'H₂O, HF e NH₃ fogem da tendência: ligação de hidrogênio.', 'Mais atração entre moléculas, mais energia para separá-las.'],
      ['4. Romper entre moléculas × dentro da molécula', 'Ferver e tirar a água presa só rompe atrações entre moléculas.', 'Formar água nova a partir de dois O–H rompe ligação covalente:', 'por isso a segunda etapa pede bem mais calor (250–550 °C).']
    ];
    var _desenha = function (t) {
      var f = t < 5 ? 0 : t < 10 ? 1 : t < 15 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f === 0) {
        var a = ease((t - .3) / 1.2); wA.setAttribute('transform', 'translate(' + lerp(90, 0, a).toFixed(1) + ' 0)'); op(wA, a);
        op(hb1, cl((t - 1.5) / .4)); op(lg1, cl((t - 1.7) / .4));
        var b = ease((t - 2.2) / 1.1); wB.setAttribute('transform', 'translate(0 ' + lerp(60, 0, b).toFixed(1) + ')'); op(wB, b);
        op(hb2, cl((t - 3.3) / .4)); op(lg2, cl((t - 3.4) / .4)); op(leg, cl((t - 1.9) / .5)); op(esc, cl((t - 3.8) / .5));
      }
      if (f === 1) tiles.forEach(function (g, i) { op(g, cl((t - 5.2 - i * .55) / .4)); });
      if (f === 2) {
        var k = 3 * ease((t - 10.3) / 2.2);
        SER.forEach(function (s) {
          var d = 'M' + px(0) + ' ' + py(s.v[0]);
          for (var i = 1; i <= 3; i++) { var w = cl(k - (i - 1)); if (w <= 0) break; d += ' L' + lerp(px(i - 1), px(i), w).toFixed(1) + ' ' + lerp(py(s.v[i - 1]), py(s.v[i]), w).toFixed(1); }
          s.p.setAttribute('d', d); s.pts.forEach(function (p, i) { op(p, i <= k + .01 ? 1 : 0); });
        });
        op(dest3, cl((t - 12.8) / .5));
      }
      if (f === 3) {
        var u = ease((t - 15.6) / 1.4);   /* agua: afasta */
        var pos = W.map(function (w) { return [w[0] + w[2] * 34 * u, w[1] - 52 * u - (w[2] === 0 ? 8 * u : 0)]; });
        wm.forEach(function (g, i) { g.setAttribute('transform', 'translate(' + pos[i][0].toFixed(1) + ' ' + pos[i][1].toFixed(1) + ')'); });
        /* ligacoes de H: H de baixo do meio (dx +-24, dy 22) para o O dos lados */
        [[1, 0, -24], [1, 2, 24]].forEach(function (c, j) {
          var p = pos[c[0]], q = pos[c[1]]; var l = hbW[j];
          l.setAttribute('x1', (p[0] + c[2] * 1.15).toFixed(1)); l.setAttribute('y1', (p[1] + 26).toFixed(1)); l.setAttribute('x2', (q[0] - c[2] * .2).toFixed(1)); l.setAttribute('y2', (q[1] - 10).toFixed(1));
          op(l, 1 - cl(u * 2.5));
        });
        op(calor, cl((t - 15.2) / .4)); op(tW1, cl((t - 16.6) / .4)); op(tW2, cl((t - 17.2) / .4));
        /* oxido: etapa 1 (16-17.6) aguas saem; etapa 2 (17.8-19.2) pontes */
        var a1 = ease((t - 15.8) / 1.6), a2 = ease((t - 17.8) / 1.4);
        aguas.forEach(function (g, i) { g.setAttribute('transform', 'translate(' + (MX[i] + (i % 2 ? 10 : -10) * a1).toFixed(1) + ' ' + (MY - 118 - 36 * a1).toFixed(1) + ')'); op(g, 1 - cl(a1 * 1.6)); });
        hbO.forEach(function (l) { op(l, 1 - cl(a1 * 3)); });
        OH.forEach(function (o) { op(o.g, 1 - a2); });
        ponteO.forEach(function (g) { op(g, a2); });
        novas.forEach(function (g, k) { var x = (MX[2 * k] + MX[2 * k + 1]) / 2; g.setAttribute('transform', 'translate(' + x + ' ' + (MY - 66 - 46 * cl((t - 18.4) / 1.2)).toFixed(1) + ')'); op(g, a2 * (1 - cl((t - 19.2) / .7) * .6)); });
        e1.textContent = 'etapa 1 (25–250 °C): rompe ligação de H'; e1.style.fill = HB;
        e2.textContent = 'etapa 2 (250–550 °C): rompe O–H covalente'; e2.style.fill = VM; e2.style.fontWeight = 700;
        op(e1, cl((t - 15.5) / .4)); op(e2, cl((t - 17.8) / .4));
      }
      var T = TXT[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    var FR = { P694024d: 4.95, P969080f: 9.95, Pc5a19d7: 9.95, W86336f0: 9.95, Wb2c5499: 9.95, Pf8747c6: 14.95, Wde968ea: 19.95, Pbedb3f4: 19.95 };
    return fimResposta(VIS.def['forcas-intermoleculares-ligacao-h'], svg, _desenha, 20, RESP, qid, { semEsmaecer: true, y: 274, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 19.95; } });
  }
};
VIS.liga('forcas-intermoleculares-ligacao-h', ['P694024d', 'P969080f', 'Pc5a19d7', 'W86336f0', 'Wb2c5499', 'Pf8747c6', 'Wde968ea', 'Pbedb3f4']);
