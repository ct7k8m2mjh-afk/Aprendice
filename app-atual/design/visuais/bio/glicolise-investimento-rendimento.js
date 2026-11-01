/* Glicolise: investimento de 2 ATP, quebra em duas moleculas de 3 C, compensacao com 4 ATP e 2 NADH, saldo. */
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
'Wf2cf7ab': [
'Por isso a resposta é B',
'A glicose tem 6 carbonos e cada ácido pirúvico (piruvato) tem 3:',
'a molécula é partida ao meio, então saem 2 piruvatos (6 = 2 × 3).'
],
'W603cd81': [
'Por isso a resposta é D',
'Investimento: 2 ATP gastos (um fosfato em cada ponta da glicose).',
'Compensação: cada metade de 3 C faz 2 ATP; são 2 metades → 4 ATP.',
'O saldo 2 (4 − 2) é outra conta: não vai na segunda lacuna.'
],
'Wcf2472d': [
'Por isso a resposta é A',
'A glicólise quebra a glicose em piruvato (ácido pirúvico), no citosol,',
'em quase todos os seres vivos, com saldo de só 2 ATP. 38 ATP era a conta',
'antiga da respiração inteira, e o lactato vem do piruvato, não o contrário.'
]
};
VIS.def['glicolise-investimento-rendimento'] = {
  tit: 'Glicólise: gasta 2 ATP, faz 4 ATP e 2 NADH',
  fontes: ['OpenStax, Biology 2e, 7.2 Glycolysis — https://openstax.org/books/biology-2e/pages/7-2-glycolysis', 'Khan Academy, Steps of glycolysis — https://www.khanacademy.org/science/biology/cellular-respiration-and-fermentation/glycolysis/a/steps-of-glycolysis', 'Wikipedia (en), Glycolysis — https://en.wikipedia.org/wiki/Glycolysis'],
  tipo: 'anim', dur: 13.4,
  marcas: [[0, 'Investimento'], [3.4, 'Quebra'], [6.2, 'Compensação'], [10, 'Saldo']],
  cred: 'Animação feita para o app (esquema: cada bolinha é um carbono; as 10 reações aparecem agrupadas).',
  nota: 'A glicólise acontece no citosol, não usa O₂ e tem 10 reações, cada uma catalisada por uma enzima. Ela gasta 2 ATP para ativar a glicose, parte a molécula em duas de 3 carbonos e, em cada metade, faz 1 NADH e 2 ATP: total de 4 ATP feitos e saldo de 2 ATP por glicose.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    var CAR = '#4a4a4a', FOS = '#c47a12', NAD = '#2b6cb0', PIR = '#d26a3a';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.4, 6.2, 10], TF = 13.4;
    function chip(s, cor, pai) { var g = el('g', {}, pai); el('rect', { x: -27, y: -12, width: 54, height: 24, rx: 12, style: 'fill:color-mix(in srgb,' + cor + ' 18%,var(--folha));stroke:' + cor + ';stroke-width:1.5' }, g); var t = tx(0, 5, s, 'font-size:13.5px;font-weight:700;fill:' + cor + ';text-anchor:middle', g); g.t = t; return g; }
    function fosf(pai) { var g = el('g', {}, pai); el('circle', { r: 11, style: 'fill:color-mix(in srgb,' + FOS + ' 25%,var(--folha));stroke:' + FOS + ';stroke-width:1.8' }, g); tx(0, 5, 'P', 'font-size:13px;font-weight:700;fill:#8a560b;text-anchor:middle', g); return g; }
    /* ---------- livro-caixa ---------- */
    el('rect', { x: 466, y: 12, width: 162, height: 192, rx: 12, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' });
    tx(547, 36, 'por glicose', 'font-size:14px;font-weight:700;fill:var(--lapis);text-anchor:middle');
    var ROT = [['ATP gastos', 72, '#b4442f'], ['ATP feitos', 102, '#2f855a'], ['NADH feitos', 132, NAD]];
    var val = ROT.map(function (r) { tx(480, r[1], r[0], 'font-size:14.5px;fill:var(--tinta)'); return tx(614, r[1], '0', 'font-size:18px;font-weight:700;fill:' + r[2] + ';text-anchor:end'); });
    el('line', { x1: 480, x2: 614, y1: 148, y2: 148, style: 'stroke:var(--linha);stroke-width:1.5' });
    tx(480, 176, 'saldo', 'font-size:15px;font-weight:700;fill:var(--tinta)');
    var sal = tx(614, 176, '', 'font-size:18px;font-weight:700;fill:var(--tinta);text-anchor:end');
    var salC = tx(547, 196, '', 'font-size:13px;fill:var(--lapis);text-anchor:middle');
    /* ---------- carbonos ---------- */
    var ligs = [0, 1, 2, 3, 4].map(function () { return el('line', { style: 'stroke:' + CAR + ';stroke-width:2' }); });
    var C = [], i;
    for (i = 0; i < 6; i++) { var g = el('g', {}); el('circle', { r: 12, style: 'fill:color-mix(in srgb,' + CAR + ' 14%,var(--folha));stroke:' + CAR + ';stroke-width:1.8' }, g); tx(0, 5, 'C', 'font-size:13px;font-weight:700;fill:' + CAR + ';text-anchor:middle', g); C.push(g); }
    var pD = fosf(), pE = fosf(), pD2 = fosf(), pE2 = fosf();
    var nome = tx(230, 40, '', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle');
    var a1 = chip('ATP', FOS), a2 = chip('ATP', FOS);
    var nadh = [chip('NADH', NAD), chip('NADH', NAD)];
    var prod = [0, 1, 2, 3].map(function () { return chip('ATP', '#2f855a'); });
    var pir = [tx(114, 160, 'piruvato (3 C)', 'font-size:14px;font-weight:700;fill:' + PIR + ';text-anchor:middle'), tx(346, 160, 'piruvato (3 C)', 'font-size:14px;font-weight:700;fill:' + PIR + ';text-anchor:middle')];
    var loc = tx(14, 26, 'no citosol · sem O₂ · 10 reações, cada uma com sua enzima', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
    /* ---------- painel ---------- */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. Fase de investimento: gasta 2 ATP', 'Um ATP põe um fosfato numa ponta da glicose (glicose-6-fosfato);', 'outro ATP põe um fosfato na outra ponta (frutose-1,6-bifosfato).', 'A molécula fica ativada e presa dentro da célula.'],
      ['2. A molécula de 6 C é partida ao meio', 'A frutose-1,6-bifosfato se quebra em duas moléculas de 3 carbonos,', 'cada uma com um fosfato (as duas seguem como gliceraldeído-3-fosfato).', 'Daqui em diante, tudo acontece duas vezes.'],
      ['3. Fase de compensação: 2 NADH e 4 ATP', 'Cada metade é oxidada: cede H ao NAD⁺ (vira NADH) e ganha um fosfato.', 'Depois entrega os dois fosfatos ao ADP: 2 ATP por metade.', 'Duas metades: 2 NADH e 4 ATP. Cada metade vira um piruvato.'],
      ['4. Saldo da glicólise', 'Gastou 2 ATP, fez 4 ATP: saldo de 2 ATP e 2 NADH por glicose.', 'Glicose (6 C) → 2 piruvatos (3 C cada). Tudo no citosol, sem O₂,', 'em quase todos os seres vivos (plantas inclusive).']
    ];
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3;
      /* posicoes dos carbonos: cadeia unica -> duas metades */
      var us = ease((t - T[1] - .5) / 1.4), X = [], Y = [];
      for (var i = 0; i < 6; i++) {
        var x0 = 155 + 30 * i, x1 = i < 3 ? 84 + 30 * i : 316 + 30 * (i - 3);
        X.push(lerp(x0, x1, us)); Y.push(lerp(80, 122, us)); mv(C[i], X[i], Y[i]);
      }
      ligs.forEach(function (l, i) { l.setAttribute('x1', X[i].toFixed(1)); l.setAttribute('y1', Y[i].toFixed(1)); l.setAttribute('x2', X[i + 1].toFixed(1)); l.setAttribute('y2', Y[i + 1].toFixed(1)); op(l, i === 2 ? 1 - cl((t - T[1] - .2) / .3) : 1); });
      /* investimento: ATP 1 -> ponta direita; ATP 2 -> ponta esquerda */
      var u1 = ease((t - .3) / 1), u2 = ease((t - 1.6) / 1);
      mv(a1, lerp(60, 331, u1), lerp(160, 112, u1)); a1.t.textContent = u1 >= 1 ? 'ADP' : 'ATP'; op(a1, f === 0 && t < 2.6 ? 1 : 0);
      mv(a2, lerp(60, 129, u2), lerp(160, 112, u2)); a2.t.textContent = u2 >= 1 ? 'ADP' : 'ATP'; op(a2, f === 0 && t > 1.5 && t < 3.3 ? 1 : 0);
      /* fosfatos das pontas */
      var dir = [X[5] + 26, Y[5]], esq = [X[0] - 26, Y[0]];
      mv(pD, dir[0], dir[1]); mv(pE, esq[0], esq[1]);
      var fimP = ease((t - T[2] - 2.2) / .8);   /* fosfatos viram ATP na compensacao */
      op(pD, t > 1.3 ? (f < 2 ? 1 : 1 - fimP) : 0); op(pE, t > 2.6 ? (f < 2 ? 1 : 1 - fimP) : 0);
      /* segundo fosfato (Pi) de cada metade na compensacao */
      mv(pD2, X[3] - 26, Y[3]); mv(pE2, X[2] + 26, Y[2]);
      var p2 = f === 2 ? cl((t - T[2] - 1.1) / .3) * (1 - fimP) : 0; op(pD2, p2); op(pE2, p2);
      nome.textContent = t < 1.3 ? 'glicose (6 C)' : t < 2.6 ? 'glicose-6-fosfato' : t < T[1] + .5 ? 'frutose-1,6-bifosfato' : f === 1 ? '2 × gliceraldeído-3-fosfato (3 C)' : f === 2 && fimP < 1 ? 'cada metade é oxidada' : '2 piruvatos';
      nome.setAttribute('y', f === 0 || t < T[1] + .5 ? 40 : 60);
      /* NADH */
      nadh.forEach(function (n, k) { var u = ease((t - T[2] - .3) / .8), cx = k ? 340 : 120; mv(n, cx, lerp(Y[0], 88, u)); op(n, f >= 2 ? cl((t - T[2] - .3) / .3) : 0); });
      /* ATP produzidos: saem dos fosfatos para baixo */
      var orig = [[X[0] - 26, 0], [X[2] + 26, 0], [X[3] - 26, 0], [X[5] + 26, 0]];
      prod.forEach(function (c, k) { var u = ease((t - T[2] - 2.2) / .9); mv(c, lerp(orig[k][0], orig[k][0] + (k % 2 ? 6 : -6), u), lerp(122, 184, u)); op(c, f >= 2 && t > T[2] + 2.2 ? 1 : 0); });
      pir.forEach(function (p) { p.setAttribute('y', 154); op(p, f >= 2 ? cl((t - T[2] - 3.2) / .4) : 0); });
      op(loc, f === 3 ? cl((t - T[3] - .4) / .4) : 0);
      /* livro-caixa */
      val[0].textContent = String((t > 1.3 ? 1 : 0) + (t > 2.6 ? 1 : 0));
      val[1].textContent = f >= 2 && t > T[2] + 2.6 ? '4' : '0';
      val[2].textContent = f >= 2 && t > T[2] + .8 ? '2' : '0';
      sal.textContent = f === 3 ? '2 ATP' : ''; salC.textContent = f === 3 ? '4 − 2 = 2 · e 2 NADH' : '';
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['glicolise-investimento-rendimento'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return TF - .01; }
    });
  }
};
VIS.liga('glicolise-investimento-rendimento', ['Wf2cf7ab', 'W603cd81', 'Wcf2472d']);
