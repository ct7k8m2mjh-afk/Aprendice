/* Tipos de selecao natural sobre uma caracteristica com distribuicao em sino: estabilizadora (extremos eliminados, curva estreita),
   direcional (um extremo favorecido, curva desloca) e disruptiva (os dois extremos favorecidos, dois picos). Lote bio 9. */
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
'W5e8f00f': ['Por isso a resposta é A',
  '1: estabilizadora favorece a média, elimina os extremos.',
  '3: direcional favorece um extremo (insetos resistentes).',
  '4: disruptiva favorece os dois extremos e diversifica.',
  '2: a população muda ao longo das gerações = adaptação.']
};
VIS.def['tipos-de-selecao'] = {
  tit: 'Três jeitos de a seleção mudar a curva de uma população',
  fontes: ['OpenStax, Biology 2e, 19.3 Adaptive Evolution, Stabilizing, Directional and Diversifying Selection (peso ao nascer; mariposas; exemplos e gráficos de distribuição) — https://openstax.org/books/biology-2e/pages/19-3-adaptive-evolution',
    'Wikipedia (en), Disruptive selection — https://en.wikipedia.org/wiki/Disruptive_selection'],
  tipo: 'anim', dur: 13.6,
  marcas: [[0, 'A curva'], [2.6, 'Estabiliza'], [5.8, 'Direcional'], [8.4, 'Disruptiva'], [11, 'Adaptação']],
  cred: 'Animação feita para o app (curvas esquemáticas: eixo horizontal = valor da característica; altura = número de indivíduos).',
  nota: 'A cor vermelha marca quem sobrevive ou se reproduz menos. A curva tracejada é a população antes; a cheia, depois de algumas gerações.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 2.6, 5.8, 8.4, 11], TF = 13.6;
    var COR = ['#2b6cb0', '#a07a10', '#7a4fa0'], RUIM = '#b4442f';
    function N(z, m, s) { return Math.exp(-Math.pow((z - m) / s, 2) / 2); }
    var DEPOIS = [function (z) { return 1.45 * N(z, 0, .62); }, function (z) { return 1.1 * N(z, 1.1, .85); }, function (z) { return .82 * (N(z, -1.5, .6) + N(z, 1.5, .6)); }];
    var RUINS = [[[-3, -1.2], [1.2, 3]], [[-3, -.6]], [[-.7, .7]]];
    var NOME = ['Estabilizadora', 'Direcional', 'Disruptiva'];
    var EX = [['favorece a média', 'ex.: peso ao nascer'], ['favorece um extremo', 'ex.: insetos resistentes'], ['favorece os dois extremos', 'diversifica a população']];
    var P = [0, 1, 2].map(function (i) {
      var x0 = 16 + i * 208, W = 192, Y0 = 222, H = 92, p = { g: el('g', {}) };
      function X(z) { return x0 + 6 + (z + 3) / 6 * (W - 12); }
      p.X = X; p.Y = function (v) { return Y0 - H * v; };
      tx(x0 + W / 2, 24, NOME[i], 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + COR[i], p.g);
      p.ex1 = tx(x0 + W / 2, 44, EX[i][0], 'font-size:13px;font-weight:600;text-anchor:middle;fill:var(--tinta)', p.g);
      p.ex2 = tx(x0 + W / 2, 61, EX[i][1], 'font-size:13px;text-anchor:middle;fill:var(--lapis)', p.g);
      el('line', { x1: x0, x2: x0 + W, y1: Y0, y2: Y0, style: 'stroke:var(--tinta);stroke-width:1.5' }, p.g);
      tx(x0 + 4, Y0 + 18, 'menor', 'font-size:13px;fill:var(--lapis)', p.g); tx(x0 + W - 4, Y0 + 18, 'maior', 'font-size:13px;fill:var(--lapis);text-anchor:end', p.g);
      p.ruim = RUINS[i].map(function (r) {
        var d = 'M' + X(r[0]).toFixed(1) + ' ' + Y0; for (var z = r[0]; z <= r[1] + 1e-9; z += .1) d += ' L' + X(z).toFixed(1) + ' ' + p.Y(N(z, 0, 1)).toFixed(1); d += ' L' + X(r[1]).toFixed(1) + ' ' + Y0 + ' Z';
        return el('path', { d: d, style: 'fill:' + RUIM + ';opacity:.26' }, p.g);
      });
      p.xs = RUINS[i].map(function (r) { var xm = X((r[0] + r[1]) / 2 + (r[0] < -2.9 ? .5 : r[1] > 2.9 ? -.5 : 0)); return el('path', { d: 'M' + (xm - 6) + ' ' + (Y0 - 30) + ' l12 12 m0 -12 l-12 12', style: 'fill:none;stroke:' + RUIM + ';stroke-width:3;stroke-linecap:round' }, p.g); });
      var d0 = ''; for (var z = -3; z <= 3.001; z += .1) d0 += (d0 ? ' L' : 'M') + X(z).toFixed(1) + ' ' + p.Y(N(z, 0, 1)).toFixed(1);
      p.antes = el('path', { d: d0, style: 'fill:none;stroke:var(--lapis);stroke-width:2;stroke-dasharray:6 4' }, p.g);
      p.dep = el('path', { style: 'fill:color-mix(in srgb,' + COR[i] + ' 14%,transparent);stroke:' + COR[i] + ';stroke-width:3' }, p.g);
      p.seta = el('g', {}, p.g);
      if (i === 1) K.seta(p.seta, X(-.4), Y0 - 104, X(1.1), Y0 - 104, COR[i], 2.6);
      if (i === 0) { K.seta(p.seta, X(-2.2), Y0 - 50, X(-1.2), Y0 - 50, COR[i], 2.4); K.seta(p.seta, X(2.2), Y0 - 50, X(1.2), Y0 - 50, COR[i], 2.4); }
      if (i === 2) { K.seta(p.seta, X(-.3), Y0 - 108, X(-1.3), Y0 - 108, COR[i], 2.4); K.seta(p.seta, X(.3), Y0 - 108, X(1.3), Y0 - 108, COR[i], 2.4); }
      p.Y0 = Y0;
      return p;
    });
    var rodape = tx(320, 268, '', 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:middle');
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      P.forEach(function (p, i) {
        var t0 = M[i + 1], u = e === 0 ? 0 : t < t0 ? 0 : ease((t - t0 - .9) / 1.4), ativo = e === i + 1;
        op(p.g, e === 0 || e === 4 || ativo || t >= t0 ? (ativo || e === 4 || e === 0 ? 1 : .55) : .3);
        p.ruim.forEach(function (r) { op(r, t >= t0 && e > 0 ? (ativo ? cl((t - t0 - .2) / .4) : .5) : 0); });
        p.xs.forEach(function (r) { op(r, ativo ? cl((t - t0 - .4) / .3) : 0); });
        op(p.ex1, e === 0 ? 0 : t >= t0 ? 1 : 0); op(p.ex2, e === 0 ? 0 : t >= t0 ? 1 : 0);
        var d = ''; for (var z = -3; z <= 3.001; z += .1) d += (d ? ' L' : 'M') + p.X(z).toFixed(1) + ' ' + p.Y(lerp(N(z, 0, 1), DEPOIS[i](z), u)).toFixed(1);
        p.dep.setAttribute('d', d + ' L' + p.X(3).toFixed(1) + ' ' + p.Y0 + ' L' + p.X(-3).toFixed(1) + ' ' + p.Y0 + ' Z');
        op(p.seta, u > .3 ? 1 : 0);
      });
      rodape.textContent = e === 4 ? 'Nos três casos a curva muda ao longo das gerações: adaptação evolutiva' : '';
      var L;
      if (e === 0) L = ['1. Numa população, a característica varia', 'Tamanho, peso, cor: a maioria tem valor médio e poucos têm valores extremos.', 'A seleção natural muda essa curva conforme quem sobrevive e se reproduz mais.'];
      else if (e === 1) L = ['2. Estabilizadora: os extremos perdem', 'Muito pequenos e muito grandes deixam menos descendentes. A média se mantém', 'e a curva fica mais estreita. Ex.: bebês muito leves ou muito pesados correm mais risco.'];
      else if (e === 2) L = ['3. Direcional: um extremo passa a ganhar', 'Com o ambiente mudado (ex.: uso de inseticida), um fenótipo antes raro ou', 'indiferente é favorecido. A curva inteira se desloca para aquele lado.'];
      else if (e === 3) L = ['4. Disruptiva: os dois extremos ganham', 'Os indivíduos médios levam desvantagem. A curva se divide em dois picos e', 'a população se diversifica (pode ser o início de duas formas distintas).'];
      else L = ['5. Em todos: adaptação evolutiva', 'Não é cada indivíduo que muda: é a composição da população, ao longo', 'de gerações sucessivas, que se ajusta ao ambiente.'];
      painel(L);
    };
    return fimResposta(VIS.def['tipos-de-selecao'], svg, _desenha, TF, RESP, qid, { congela: function () { return 13.5; } });
  }
};
VIS.liga('tipos-de-selecao', ['W5e8f00f']);
