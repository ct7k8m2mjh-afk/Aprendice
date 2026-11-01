/* Ciclo de Krebs: acetil-CoA + oxaloacetato = citrato; 2 CO2, 3 NADH, 1 FADH2 e 1 GTP por volta; duas voltas por glicose. */
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
'Wcadfffb': [
'Por isso a resposta é A',
'O acetil (2 C) se junta ao oxaloacetato (4 C) e forma o citrato (6 C),',
'o 1º composto da volta: por isso "ciclo do ácido cítrico".'
],
'W2b40243': [
'Por isso a resposta é A',
'Em cada volta: 2 CO₂ (saem tantos C quanto o acetil trouxe), 3 NADH,',
'1 FADH₂ e 1 GTP. O oxaloacetato volta igual e o ciclo recomeça.'
],
'W8134bcc': [
'Por isso a resposta é B',
'Cada volta faz 1 GTP (≈ 1 ATP); uma glicose dá 2 acetil-CoA → 2 voltas = 2 ATP.',
'NADH e FADH₂ só viram ATP depois, na cadeia respiratória.'
]
};
VIS.def['ciclo-de-krebs-balanco'] = {
  tit: 'Ciclo de Krebs: o que entra e o que sai em cada volta',
  fontes: ['OpenStax, Biology 2e, 7.3 Oxidation of Pyruvate and the Citric Acid Cycle — https://openstax.org/books/biology-2e/pages/7-3-oxidation-of-pyruvate-and-the-citric-acid-cycle', 'Khan Academy, The citric acid cycle — https://www.khanacademy.org/science/biology/cellular-respiration-and-fermentation/pyruvate-oxidation-and-the-citric-acid-cycle/a/the-citric-acid-cycle', 'Wikipedia (en), Citric acid cycle — https://en.wikipedia.org/wiki/Citric_acid_cycle'],
  tipo: 'anim', dur: 13.6,
  marcas: [[0, 'Entrada'], [3, 'Saem 2 CO₂'], [6.6, 'Volta ao início'], [10.2, 'Balanço']],
  cred: 'Animação feita para o app (esquema; números de carbonos entre parênteses). Em algumas células a etapa do succinil-CoA forma ATP direto em vez de GTP.',
  nota: 'O ciclo acontece na matriz da mitocôndria. O que ele mais produz são transportadores de elétrons (NADH e FADH₂), que vão alimentar a cadeia respiratória; ATP direto é só 1 (via GTP) por volta.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    var CO2 = '#6b6b6b', NAD = '#2b6cb0', FAD = '#8a5a9e', GTP = '#2f855a', ACE = '#c47a12', KRE = '#a0583d';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3, 6.6, 10.2], TF = 13.6;
    var CX = 215, CY = 116, RX = 118, RY = 70;
    function pt(a, k) { k = k || 1; return [CX + RX * k * Math.cos(a), CY + RY * k * Math.sin(a)]; }
    var D = Math.PI / 180;
    var NOS = [['citrato', 6], ['isocitrato', 6], ['α-cetoglutarato', 5], ['succinil-CoA', 4], ['succinato', 4], ['fumarato', 4], ['malato', 4], ['oxaloacetato', 4]];
    var ANG = NOS.map(function (n, i) { return (-90 + 45 * i) * D; });
    /* aro do ciclo com setas */
    var dE = ''; for (var a = 0; a <= 360; a += 4) { var p = pt(a * D); dE += (a ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' '; }
    el('path', { d: dE, style: 'fill:none;stroke:color-mix(in srgb,' + KRE + ' 45%,var(--folha));stroke-width:3' });
    ANG.forEach(function (a) { var m = a + 22.5 * D, p = pt(m), tg = Math.atan2(RY * Math.cos(m), -RX * Math.sin(m)) * 180 / Math.PI; el('path', { d: 'M-6 -5 L4 0 L-6 5 Z', transform: 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + tg.toFixed(1) + ')', style: 'fill:' + KRE }); });
    /* nos: ponto no aro + rotulo de fora */
    var LAB = [[0, -16, 'middle', 1], [12, -20, 'start', 2], [10, -4, 'start', 2], [10, 14, 'start', 2], [0, 22, 'middle', 1], [-10, 14, 'end', 2], [-10, -4, 'end', 2], [-10, -20, 'end', 2]];
    var noG = NOS.map(function (n, i) {
      var p = pt(ANG[i]), g = el('g', {}), L = LAB[i];
      el('circle', { cx: p[0], cy: p[1], r: 6, style: 'fill:var(--folha);stroke:' + KRE + ';stroke-width:2.2' }, g);
      if (L[3] === 1) tx(p[0] + L[0], p[1] + L[1] + (L[1] > 0 ? 0 : 0), n[0] + ' (' + n[1] + ' C)', 'font-size:14px;font-weight:700;fill:#7a3f28;text-anchor:' + L[2], g);
      else { tx(p[0] + L[0], p[1] + L[1], n[0], 'font-size:14px;font-weight:700;fill:#7a3f28;text-anchor:' + L[2], g); tx(p[0] + L[0], p[1] + L[1] + 16, '(' + n[1] + ' C)', 'font-size:13px;fill:#7a3f28;text-anchor:' + L[2], g); }
      return g;
    });
    /* acetil-CoA entrando */
    var ace = el('g', {});
    el('rect', { x: -62, y: -13, width: 124, height: 26, rx: 13, style: 'fill:color-mix(in srgb,' + ACE + ' 20%,var(--folha));stroke:' + ACE + ';stroke-width:1.8' }, ace);
    tx(0, 5, 'acetil-CoA (2 C)', 'font-size:13.5px;font-weight:700;fill:#8a560b;text-anchor:middle', ace);
    var coa = tx(40, 70, 'sai a CoA', 'font-size:13px;fill:var(--lapis)');
    /* centro: contador de carbonos */
    var cC = tx(CX, CY - 4, '', 'font-size:24px;font-weight:700;fill:var(--tinta);text-anchor:middle');
    var cL = tx(CX, CY + 15, '', 'font-size:13.5px;fill:var(--lapis);text-anchor:middle');
    var bola = el('circle', { r: 8, style: 'fill:' + ACE + ';stroke:var(--folha);stroke-width:2' });
    /* produtos: [etapa (indice do no de saida), rotulo, cor, k (raio relativo), deslocamento em graus] */
    var PR = [[1, 'CO₂', CO2, 1.32, 0], [1, 'NADH', NAD, .7, 0], [2, 'CO₂', CO2, 1.3, 0], [2, 'NADH', NAD, .7, 0], [3, 'GTP', GTP, .62, 0], [4, 'FADH₂', FAD, .62, 0], [6, 'NADH', NAD, .7, 0]];
    var TP = [3.9, 4.0, 5.4, 5.5, 7.3, 8.1, 9.6];
    var prod = PR.map(function (r) {
      var g = el('g', {}), w = r[1].length * 8.5 + 16, m = ANG[r[0]] + (22.5 + r[4]) * D, p = pt(m, r[3]);
      el('rect', { x: -w / 2, y: -12, width: w, height: 24, rx: 12, style: 'fill:color-mix(in srgb,' + r[2] + ' 16%,var(--folha));stroke:' + r[2] + ';stroke-width:1.6' }, g);
      tx(0, 5, r[1], 'font-size:13.5px;font-weight:700;fill:' + r[2] + ';text-anchor:middle', g);
      mv(g, p[0], p[1]); return g;
    });
    /* balanco */
    el('rect', { x: 470, y: 10, width: 158, height: 196, rx: 12, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' });
    tx(553, 34, '1 volta', 'font-size:13.5px;font-weight:700;fill:var(--lapis);text-anchor:middle');
    var h2 = tx(604, 34, '× 2', 'font-size:13.5px;font-weight:700;fill:var(--ad-t);text-anchor:middle');
    var h3 = tx(604, 50, 'glicose', 'font-size:13px;fill:var(--ad-t);text-anchor:middle');
    var LIN = [['CO₂', CO2, 2], ['NADH', NAD, 3], ['FADH₂', FAD, 1], ['GTP≈ATP', GTP, 1]];
    var v1 = [], v2 = [];
    LIN.forEach(function (r, i) {
      var y = 82 + 32 * i;
      tx(480, y, r[0], 'font-size:14.5px;font-weight:700;fill:' + r[1]);
      v1.push(tx(553, y, '', 'font-size:18px;font-weight:700;fill:' + r[1] + ';text-anchor:middle'));
      v2.push(tx(604, y, '', 'font-size:18px;font-weight:700;fill:' + r[1] + ';text-anchor:middle'));
    });
    var bx2 = el('rect', { x: 582, y: 60, width: 44, height: 136, rx: 8, style: 'fill:none;stroke:var(--ad-c);stroke-width:2' });
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. Entrada: acetil (2 C) + oxaloacetato (4 C) = citrato (6 C)', 'O acetil-CoA vem do piruvato. Seu grupo de 2 carbonos se junta', 'ao oxaloacetato (4 C) e forma o citrato (6 C), na matriz da mitocôndria.', 'O citrato é o primeiro composto: daí "ciclo do ácido cítrico".'],
      ['2. Duas descarboxilações: 6 C → 5 C → 4 C', 'Saem 2 CO₂, um de cada vez: tantos carbonos quanto o acetil trouxe.', 'Em cada uma dessas duas etapas, H vai para o NAD⁺ e forma NADH.', 'No succinil-CoA sobram 4 carbonos.'],
      ['3. De volta ao oxaloacetato', 'Succinil-CoA → succinato: forma 1 GTP (equivale a 1 ATP).', 'Succinato → fumarato: 1 FADH₂. Malato → oxaloacetato: mais 1 NADH.', 'O oxaloacetato (4 C) se refaz e recebe o próximo acetil.'],
      ['4. Balanço: por volta e por glicose', 'Por volta: 2 CO₂, 3 NADH, 1 FADH₂ e 1 GTP (≈ 1 ATP).', 'Cada glicose gera 2 piruvatos → 2 acetil-CoA → 2 voltas: dobre tudo.', 'Por glicose: 4 CO₂, 6 NADH, 2 FADH₂ e 2 ATP.']
    ];
    /* posicao da bolinha no ciclo: indice fracionario do no */
    function noPos(s) { var a = (-90 + 45 * s) * D; return pt(a); }
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3;
      /* acetil entra e encontra o oxaloacetato no citrato */
      var ua = ease((t - .3) / 1.6), pA = [lerp(66, 100, ua), lerp(16, 18, ua)];
      mv(ace, pA[0], pA[1]); op(ace, f === 0 && ua < 1 ? 1 : f === 0 ? 1 - cl((t - 1.9) / .4) : 0);
      op(coa, f === 0 && t > 1.9 && t < 2.9 ? 1 : 0); coa.setAttribute('x', 172); coa.setAttribute('y', 14);
      var s;
      if (f === 0) s = 7 + ease((t - .3) / 1.8);   /* oxaloacetato -> citrato */
      else if (f === 1) s = 8 + 3 * ease((t - T[1] - .2) / 3.2);   /* citrato -> succinil-CoA */
      else if (f === 2) s = 11 + 4 * ease((t - T[2] - .2) / 3.2);  /* -> oxaloacetato */
      else s = 15;
      var pb = noPos(s % 8); bola.setAttribute('cx', pb[0].toFixed(1)); bola.setAttribute('cy', pb[1].toFixed(1)); op(bola, f < 3 ? 1 : 0);
      var no = Math.round(s) % 8;
      noG.forEach(function (g, i) { op(g, f === 3 ? 1 : i === no ? 1 : .5); });
      var nc = f === 0 ? (s < 7.95 ? '4 C' : '6 C') : NOS[no][1] + ' C';
      cC.textContent = f === 3 ? '2 voltas' : nc;
      cL.textContent = f === 0 ? (s < 7.95 ? 'oxaloacetato' : '2 + 4 carbonos') : f === 3 ? 'por glicose' : NOS[no][0];
      var nfeitos = 0;
      prod.forEach(function (g, i) { var on = f === 3 || (f >= 1 && t > TP[i]); op(g, on ? 1 : 0); if (on) nfeitos++; });
      /* contagem da volta */
      var cont = [0, 0, 0, 0];
      PR.forEach(function (r, i) { if (f === 3 || (f >= 1 && t > TP[i])) { var k = r[1] === 'CO₂' ? 0 : r[1] === 'NADH' ? 1 : r[1] === 'FADH₂' ? 2 : 3; cont[k]++; } });
      v1.forEach(function (v, i) { v.textContent = f >= 1 ? String(cont[i]) : ''; });
      var u2 = f === 3 ? cl((t - T[3] - .6) / .4) : 0;
      v2.forEach(function (v, i) { v.textContent = String(LIN[i][2] * 2); op(v, u2); });
      op(h2, f === 3 ? 1 : .35); op(h3, f === 3 ? 1 : .35); op(bx2, u2);
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['ciclo-de-krebs-balanco'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'Wcadfffb' ? T[1] - .15 : TF - .01; }
    });
  }
};
VIS.liga('ciclo-de-krebs-balanco', ['Wcadfffb', 'W2b40243', 'W8134bcc']);
