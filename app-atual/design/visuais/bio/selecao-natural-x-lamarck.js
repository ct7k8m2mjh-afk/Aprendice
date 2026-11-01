/* Lamarck (o individuo muda em vida por uso/necessidade e passaria a mudanca) x Darwin / teoria sintetica (variacao previa por
   mutacao e recombinacao -> o ambiente seleciona -> a frequencia sobe ao longo das geracoes). Exemplo: camuflagem do bicho-pau. Lote bio 9. */
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
'Pa84f259': ['Por isso a resposta é E',
  'A luz depende de alelos (luciferase é proteína). Quem já',
  'tinha esses alelos deixou mais descendentes: seleção natural',
  'sobre variação prévia. Necessidade não cria característica.'],
'Paf0ad5e': ['Por isso a resposta é E',
  'Mutação e recombinação geram a variabilidade ao acaso; o',
  'ambiente seleciona as variantes vantajosas; geração após',
  'geração, a população fica adaptada.'],
'P5612164': ['Por isso a resposta é E',
  'Os bichos-pau um pouco mais parecidos com gravetos eram',
  'menos comidos e deixavam mais filhos: a camuflagem foi',
  'selecionada ao longo das gerações, não adquirida em vida.'],
'W4418da9': ['Por isso a resposta é D',
  'Necessidade, falta de uso e atrofia passada aos filhos:',
  'é a explicação de Lamarck (uso e desuso + herança dos',
  'caracteres adquiridos), o lamarckismo.'],
'W205104d': ['Por isso a resposta é C',
  'Nas duas teorias a adaptação vem da relação do ser vivo',
  'com o ambiente. Muda o mecanismo: em Lamarck o ambiente',
  'muda o indivíduo; em Darwin ele seleciona variantes.']
};
VIS.def['selecao-natural-x-lamarck'] = {
  tit: 'Lamarck × Darwin: muda o indivíduo ou muda a população?',
  fontes: ['OpenStax, Biology 2e, 18.1 Understanding Evolution (Lamarck: herança de caracteres adquiridos; Darwin e Wallace: seleção natural sobre variação hereditária, sobrevivência e reprodução diferenciais) — https://openstax.org/books/biology-2e/pages/18-1-understanding-evolution',
    'OpenStax, Biology 2e, 19.3 Adaptive Evolution (seleção natural muda as frequências alélicas da população) — https://openstax.org/books/biology-2e/pages/19-3-adaptive-evolution',
    'Wikipedia (pt), Teoria sintética da evolução (mutação e recombinação geram variabilidade; seleção natural) — https://pt.wikipedia.org/wiki/Teoria_sint%C3%A9tica_da_evolu%C3%A7%C3%A3o'],
  tipo: 'anim', dur: 13.6,
  marcas: [[0, '1. Lamarck'], [3.2, '2. Variação'], [5.8, '3. Seleção'], [8.4, '4. Gerações'], [11, '5. Em comum']],
  cred: 'Animação feita para o app (esquema; o bicho-pau representa qualquer característica hereditária, como a camuflagem ou a bioluminescência).',
  nota: 'Darwin e a teoria sintética: a variação existe antes e surge ao acaso (mutação e recombinação); o ambiente só escolhe entre o que já existe. Quem muda é a população, ao longo das gerações, e não o indivíduo durante a vida.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 3.2, 5.8, 8.4, 11], TF = 13.6;
    var LAM = '#a0522d', DAR = '#2b6cb0';
    function mix(p) { var a = [106, 168, 79], b = [122, 92, 56]; return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * p); }).join(',') + ')'; }
    function inseto(pai) {
      var g = el('g', {}, pai), pernas = [];
      for (var k = 0; k < 6; k++) pernas.push(el('path', { style: 'fill:none;stroke-width:1.6;stroke-linecap:round' }, g));
      var corpo = el('line', { style: 'stroke-linecap:round' }, g), ant = el('path', { style: 'fill:none;stroke-width:1.2' }, g);
      g.set = function (x, y, p, s) {
        s = s || 1; var L = (26 + 20 * p) * s, w = (9 - 5 * p) * s, c = mix(p);
        corpo.setAttribute('x1', (x - L / 2).toFixed(1)); corpo.setAttribute('x2', (x + L / 2).toFixed(1)); corpo.setAttribute('y1', y); corpo.setAttribute('y2', y);
        corpo.style.stroke = c; corpo.style.strokeWidth = w.toFixed(1);
        pernas.forEach(function (pe, k) { var xb = x + (k % 3 - 1) * L * .25, sg = k % 3 - 1, lp = 13 * s; pe.setAttribute('d', 'M' + xb.toFixed(1) + ' ' + y + ' l' + (sg * 5 - 2).toFixed(1) + ' ' + (-5 * s).toFixed(1) + ' l' + (sg * 4 - 1).toFixed(1) + ' ' + (lp + 5 * s).toFixed(1)); pe.style.opacity = k < 3 ? .55 : 1; pe.style.stroke = c; });
        ant.setAttribute('d', 'M' + (x + L / 2).toFixed(1) + ' ' + y + ' l' + (14 * s).toFixed(1) + ' ' + (-8 * s).toFixed(1) + ' M' + (x + L / 2).toFixed(1) + ' ' + y + ' l' + (16 * s).toFixed(1) + ' ' + (-2 * s).toFixed(1)); ant.style.stroke = c;
      };
      return g;
    }
    function galho(pai, x1, x2, y) { el('path', { d: 'M' + x1 + ' ' + y + ' L' + x2 + ' ' + (y - 3), style: 'fill:none;stroke:#8a6a44;stroke-width:5;stroke-linecap:round' }, pai); }
    /* ===== linha Lamarck ===== */
    var LA = el('g', {});
    tx(16, 30, 'Lamarck', 'font-size:16px;font-weight:700;fill:' + LAM, LA);
    tx(16, 48, '(1809)', 'font-size:13px;fill:var(--lapis)', LA);
    galho(LA, 150, 360, 92); galho(LA, 420, 626, 92);
    var iL = inseto(LA), iF = inseto(LA);
    var lamT1 = tx(255, 30, 'muda durante a vida', 'font-size:13.5px;font-weight:700;fill:' + LAM + ';text-anchor:middle', LA);
    var lamT1b = tx(255, 47, '(esforço, uso e desuso)', 'font-size:13px;fill:' + LAM + ';text-anchor:middle', LA);
    var lamA = el('g', {}, LA); K.seta(lamA, 352, 70, 432, 70, LAM, 2.4);
    tx(392, 64, 'passaria', 'font-size:13px;font-weight:600;fill:' + LAM + ';text-anchor:middle', lamA);
    var lamT2 = tx(523, 30, 'filho já nasce mudado', 'font-size:13.5px;font-weight:700;fill:' + LAM + ';text-anchor:middle', LA);
    var lamX = tx(523, 47, 'não acontece: o adquirido não é herdado', 'font-size:13px;font-weight:600;fill:#b4442f;text-anchor:middle', LA);
    el('line', { x1: 14, x2: 626, y1: 118, y2: 118, style: 'stroke:var(--linha);stroke-width:1.5' });
    /* ===== linha Darwin ===== */
    var DA = el('g', {});
    tx(16, 146, 'Darwin', 'font-size:16px;font-weight:700;fill:' + DAR, DA);
    tx(16, 164, 'e teoria sintética', 'font-size:13px;fill:var(--lapis)', DA);
    galho(DA, 140, 626, 230);
    var XS = [170, 228, 286, 344, 402, 460, 518, 576];
    var G1 = [.15, .55, .35, .8, .1, .65, .3, .9], G2 = [.55, .8, .35, .9, .65, .6, .85, .3], G3 = [.8, .9, .85, .65, .95, .8, .55, .9];
    var pop = XS.map(function () { return inseto(DA); });
    var xis = XS.map(function (x) { return el('path', { d: 'M' + (x - 14) + ' ' + (216 - 14) + ' l28 28 m0 -28 l-28 28', style: 'fill:none;stroke:#b4442f;stroke-width:3.5;stroke-linecap:round' }, DA); });
    var darT = tx(380, 150, '', 'font-size:14px;font-weight:700;fill:' + DAR + ';text-anchor:middle', DA);
    var darT2 = tx(380, 168, '', 'font-size:13px;fill:var(--tinta);text-anchor:middle', DA);
    var gerT = tx(140, 268, '', 'font-size:13.5px;font-weight:700;fill:' + DAR, DA);
    /* barra de frequencia */
    var FB = el('g', {}, DA);
    tx(470, 268, 'camuflados:', 'font-size:13.5px;font-weight:600;fill:var(--tinta);text-anchor:end', FB);
    el('rect', { x: 478, y: 256, width: 148, height: 14, rx: 7, style: 'fill:color-mix(in srgb,var(--tinta) 9%,transparent)' }, FB);
    var fbar = el('rect', { x: 478, y: 256, height: 14, rx: 7, style: 'fill:' + DAR }, FB);
    /* ambiente: ponto em comum */
    var AMB = el('g', {});
    el('rect', { x: 14, y: 182, width: 112, height: 56, rx: 10, style: 'fill:color-mix(in srgb,#2f7a34 12%,var(--folha));stroke:#2f7a34;stroke-width:2' }, AMB);
    tx(70, 205, 'ambiente', 'font-size:14px;font-weight:700;fill:#2f7a34;text-anchor:middle', AMB);
    tx(70, 223, 'nos dois', 'font-size:13px;fill:#2f7a34;text-anchor:middle', AMB);
    el('rect', { x: 14, y: 58, width: 112, height: 50, rx: 10, style: 'fill:color-mix(in srgb,#2f7a34 12%,var(--folha));stroke:#2f7a34;stroke-width:2' }, AMB);
    tx(70, 80, 'ambiente', 'font-size:14px;font-weight:700;fill:#2f7a34;text-anchor:middle', AMB);
    tx(70, 97, 'nos dois', 'font-size:13px;fill:#2f7a34;text-anchor:middle', AMB);
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(LA, e === 0 || e === 4 ? 1 : .28); op(DA, e === 0 ? .28 : 1); op(AMB, e === 4 ? cl((t - 11.2) / .4) : 0);
      /* Lamarck: o individuo muda e o filho "herda" */
      var u = e === 0 ? ease((t - .3) / 1.6) : 1;
      iL.set(255, 78, lerp(.15, .85, u), 1.6); iF.set(523, 78, .85, 1.6);
      op(iF, e === 0 ? cl((t - 2) / .4) : 1); op(lamA, e === 0 ? cl((t - 1.9) / .3) : 1); op(lamT2, e === 0 ? cl((t - 2) / .4) : 1);
      op(lamX, e === 4 || (e === 0 && t > 2.5) ? 1 : 0);
      /* Darwin: variacao, selecao, geracoes */
      var P, vivo = XS.map(function () { return 1; }), xa = XS.map(function () { return 0; });
      if (e <= 2) {
        P = G1;
        if (e === 2) G1.forEach(function (p, i) { if (p < .5) { var v = cl((t - 6.2 - i * .12) / .5); xa[i] = v; vivo[i] = 1 - .85 * cl((t - 7.2) / .6); } });
      } else if (e === 3) { P = t < 9.7 ? G2 : G3; }
      else P = G3;
      pop.forEach(function (g, i) { g.set(XS[i], 214, P[i], 1.05); op(g, vivo[i] * (e === 3 ? cl(((t - 8.4) % 1.3) / .3) : 1)); });
      xis.forEach(function (x, i) { op(x, xa[i] * (e === 2 ? 1 - cl((t - 7.6) / .4) : 0)); });
      var fr = e <= 2 ? 3 / 8 : e === 3 ? (t < 9.7 ? 5 / 8 : 7 / 8) : 7 / 8;   /* camuflado = p >= .6 */
      fbar.setAttribute('width', (148 * fr).toFixed(1));
      if (e <= 1) { darT.textContent = 'a variação já existe antes'; darT2.textContent = 'mutação e recombinação, ao acaso'; gerT.textContent = 'geração 1'; }
      else if (e === 2) { darT.textContent = 'o ambiente seleciona'; darT2.textContent = 'aves veem e comem os mais visíveis'; gerT.textContent = 'geração 1'; }
      else if (e === 3) { darT.textContent = 'quem sobra deixa mais filhos'; darT2.textContent = 'filhos herdam a forma dos pais'; gerT.textContent = t < 9.7 ? 'geração 2' : 'geração 3'; }
      else { darT.textContent = 'a população mudou'; darT2.textContent = 'cada inseto não mudou em vida'; gerT.textContent = 'geração 3'; }
      var L;
      if (e === 0) L = ['1. Lamarck: o indivíduo muda e passa a mudança', 'Por necessidade, o uso desenvolve e o desuso atrofia (uso e desuso), e o que', 'foi adquirido em vida passaria aos filhos. Hoje sabemos que isso não ocorre.'];
      else if (e === 1) L = ['2. Darwin: a variação existe antes', 'Numa população já há bichos-pau mais e menos parecidos com gravetos, ao acaso.', 'Darwin não sabia de onde vinha; a teoria sintética: mutação e recombinação.'];
      else if (e === 2) L = ['3. O ambiente seleciona', 'Aves acham e comem mais os insetos visíveis. Os mais camuflados sobrevivem', 'mais e chegam a se reproduzir: sobrevivência e reprodução diferenciais.'];
      else if (e === 3) L = ['4. Geração após geração, a frequência sobe', 'Os filhos herdam a forma dos pais que sobreviveram. A proporção (frequência', 'dos alelos) de camuflados cresce na população: isso é adaptação.'];
      else L = ['5. O ponto em comum: interação com o ambiente', 'Nas duas teorias a adaptação vem da relação com o ambiente. Muda o como:', 'em Lamarck o ambiente molda o indivíduo; em Darwin, escolhe entre variantes.'];
      painel(L);
    };
    return fimResposta(VIS.def['selecao-natural-x-lamarck'], svg, _desenha, TF, RESP, qid, { y: { Pa84f259: 4, Paf0ad5e: 4, P5612164: 4, W4418da9: 216 }[qid], congela: function (q) {
      return { Pa84f259: 10.9, Paf0ad5e: 10.9, P5612164: 10.9, W4418da9: 3.1, W205104d: 13.5 }[q] || TF - .001; } });
  }
};
VIS.liga('selecao-natural-x-lamarck', ['Pa84f259', 'Paf0ad5e', 'P5612164', 'W4418da9', 'W205104d']);
