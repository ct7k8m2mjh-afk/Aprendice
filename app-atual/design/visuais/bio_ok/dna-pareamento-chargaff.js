/* DNA: pareamento A=T e G≡C, fitas antiparalelas e complementares, pares x bases, contagem e porcentagens (Chargaff). */
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
'Wac859f9': [
'Por isso a resposta é C',
'No DNA o encaixe é fixo: A com T e G com C (uma base de 2 anéis',
'com uma de 1 anel). Uracila não existe no DNA, e A–G ou T–G',
'não alinham as ligações de hidrogênio.'
],
'W7dae107': [
'Por isso a resposta é A',
'Troque cada base pela parceira: T→A, C→G, A→T, A→T, G→C, T→A.',
'TCAAGT vira AGTTCA. As duas fitas são de DNA, então',
'não entra uracila (U só aparece no RNA).'
],
'Pb570d83': [
'Por isso a resposta é C',
'100 pares = 200 bases. 32 T → 32 A (A = T). Sobram',
'200 − 64 = 136 bases de G e C, metade cada: 68 G e 68 C.',
'Na ordem pedida (C, G, A): 68, 68, 32.'
],
'Waedcbd5': [
'Por isso a resposta é A',
'30% de 240 = 72 A, e A = T → 72 T. A + T = 144 bases.',
'Sobram 240 − 144 = 96 bases de G e C, metade cada:',
'48 guaninas (e 48 citosinas).'
]
};
VIS.def['dna-pareamento-chargaff'] = {
  tit: 'DNA: A com T, G com C, e como contar as bases',
  fontes: ['OpenStax, Biology 2e, 14.2 DNA Structure and Sequencing — https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing', 'Khan Academy, Molecular structure of DNA — https://www.khanacademy.org/science/biology/dna-as-the-genetic-material/structure-of-dna/a/discovery-of-the-structure-of-dna', 'Wikipedia (en), Chargaff\'s rules — https://en.wikipedia.org/wiki/Chargaff%27s_rules'],
  tipo: 'anim', dur: 13.6,
  marcas: [[0, 'Pareamento'], [3.4, 'Complementar'], [6.8, 'Contagem'], [10.2, 'Porcentagens']],
  cred: 'Animação feita para o app (dupla hélice desenhada esticada, como escada; esquema fora de escala).',
  nota: 'Toda adenina tem uma timina na outra fita e toda guanina tem uma citosina. Por isso, na dupla fita, A = T e G = C, e as purinas (A + G) são sempre metade das bases. Atenção à unidade: N pares de bases têm 2N bases.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var COR = { A: '#2b6cb0', T: '#c47a12', G: '#2f855a', C: '#b4442f' };
    var PAR = { A: 'T', T: 'A', G: 'C', C: 'G' };
    var PUR = { A: 1, G: 1 };
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.4, 6.8, 10.2], TF = 13.6;
    var SEQ = 'ATGACTAAGT'.split(''), N = SEQ.length, X0 = 92, DX = 50, YT = 30, YB = 116;
    /* esqueletos */
    el('path', { d: 'M' + (X0 - 24) + ' ' + YT + ' H' + (X0 + DX * (N - 1) + 24), style: 'stroke:#7a6a5a;stroke-width:5;stroke-linecap:round' });
    el('path', { d: 'M' + (X0 - 24) + ' ' + YB + ' H' + (X0 + DX * (N - 1) + 24), style: 'stroke:#7a6a5a;stroke-width:5;stroke-linecap:round' });
    var gS = el('g', {});
    tx(X0 - 32, YT + 5, '5′', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:end', gS);
    tx(X0 + DX * (N - 1) + 32, YT + 5, '3′', 'font-size:15px;font-weight:700;fill:var(--tinta)', gS);
    tx(X0 - 32, YB + 5, '3′', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:end', gS);
    tx(X0 + DX * (N - 1) + 32, YB + 5, '5′', 'font-size:15px;font-weight:700;fill:var(--tinta)', gS);
    var setas = el('g', {});
    el('path', { d: 'M250 16 H390 m-8 -5 l8 5 l-8 5', style: 'fill:none;stroke:var(--ad-c);stroke-width:2' }, setas);
    el('path', { d: 'M390 132 H250 m8 -5 l-8 5 l8 5', style: 'fill:none;stroke:var(--ad-c);stroke-width:2' }, setas);
    tx(400, 20, 'fita molde', 'font-size:13px;font-weight:700;fill:var(--ad-t)', setas);
    tx(400, 137, 'fita complementar (antiparalela)', 'font-size:13px;font-weight:700;fill:var(--ad-t)', setas);
    /* degraus */
    var deg = SEQ.map(function (b, i) {
      var x = X0 + DX * i, c = PAR[b], lt = PUR[b] ? 46 : 30, lb = PUR[c] ? 46 : 30, g = el('g', {}), gb = el('g', {});
      el('rect', { x: x - 15, y: YT, width: 30, height: lt, rx: 5, style: 'fill:color-mix(in srgb,' + COR[b] + ' 22%,var(--folha));stroke:' + COR[b] + ';stroke-width:1.8' }, g);
      tx(x, YT + lt / 2 + 6, b, 'font-size:16px;font-weight:700;fill:' + COR[b] + ';text-anchor:middle', g);
      el('rect', { x: x - 15, y: YB - lb, width: 30, height: lb, rx: 5, style: 'fill:color-mix(in srgb,' + COR[c] + ' 22%,var(--folha));stroke:' + COR[c] + ';stroke-width:1.8' }, gb);
      tx(x, YB - lb / 2 + 6, c, 'font-size:16px;font-weight:700;fill:' + COR[c] + ';text-anchor:middle', gb);
      var nh = b === 'A' || b === 'T' ? 2 : 3, gh = el('g', {});
      for (var k = 0; k < nh; k++) { var hx = x - (nh - 1) * 5 + 10 * k; el('path', { d: 'M' + hx + ' ' + (YT + lt + 1) + ' V' + (YB - lb - 1), style: 'stroke:var(--tinta);stroke-width:1.6;stroke-dasharray:2 2' }, gh); }
      return { g: g, gb: gb, gh: gh };
    });
    /* parte de baixo: legenda, sequencia, contagem, barras */
    var g1 = el('g', {});
    tx(20, 166, 'A = T', 'font-size:17px;font-weight:700;fill:var(--tinta)', g1);
    tx(80, 166, '2 ligações de hidrogênio', 'font-size:14px;fill:var(--tinta)', g1);
    tx(20, 192, 'G ≡ C', 'font-size:17px;font-weight:700;fill:var(--tinta)', g1);
    tx(80, 192, '3 ligações de hidrogênio', 'font-size:14px;fill:var(--tinta)', g1);
    tx(330, 166, 'base de 2 anéis (A, G: maior)', 'font-size:14px;fill:var(--tinta)', g1);
    tx(330, 192, '+ base de 1 anel (T, C: menor)', 'font-size:14px;fill:var(--tinta)', g1);
    var g2 = el('g', {});
    tx(20, 166, 'molde:', 'font-size:14px;font-weight:700;fill:var(--lapis)', g2);
    tx(20, 192, 'complementar:', 'font-size:14px;font-weight:700;fill:var(--lapis)', g2);
    var sq1 = tx(130, 166, '5′ ' + SEQ.join('') + ' 3′', 'font-size:17px;font-weight:700;fill:var(--tinta);letter-spacing:2px', g2);
    var sq2 = tx(130, 192, '', 'font-size:17px;font-weight:700;fill:var(--tinta);letter-spacing:2px', g2);
    tx(430, 180, 'no DNA não há U', 'font-size:14px;font-weight:700;fill:var(--ad-t)', g2);
    var g3 = el('g', {});
    tx(20, 162, '10 pares de bases', 'font-size:15px;font-weight:700;fill:var(--tinta)', g3);
    tx(20, 184, '= 20 bases no total', 'font-size:15px;font-weight:700;fill:var(--ad-t)', g3);
    var cont = { A: 0, T: 0, G: 0, C: 0 };
    SEQ.forEach(function (b) { cont[b]++; cont[PAR[b]]++; });
    var CX4 = { A: 260, T: 330, G: 420, C: 490 };
    var vc = {};
    ['A', 'T', 'G', 'C'].forEach(function (b) { tx(CX4[b], 162, b, 'font-size:16px;font-weight:700;fill:' + COR[b] + ';text-anchor:middle', g3); vc[b] = tx(CX4[b], 186, String(cont[b]), 'font-size:18px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3); });
    tx(295, 174, '=', 'font-size:17px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3);
    tx(455, 174, '=', 'font-size:17px;font-weight:700;fill:var(--tinta);text-anchor:middle', g3);
    tx(260, 205, 'A + G = 10 = metade (50%)', 'font-size:13.5px;fill:var(--lapis)', g3);
    var g4 = el('g', {});
    var PCT = [['A', 30], ['T', 30], ['G', 20], ['C', 20]], xb = 40;
    tx(20, 160, 'se A = 30% das bases:', 'font-size:14px;font-weight:700;fill:var(--tinta)', g4);
    PCT.forEach(function (p) { var w = p[1] * 5.6; el('rect', { x: xb, y: 170, width: w - 2, height: 30, rx: 4, style: 'fill:color-mix(in srgb,' + COR[p[0]] + ' 25%,var(--folha));stroke:' + COR[p[0]] + ';stroke-width:1.6' }, g4); tx(xb + w / 2, 191, p[0] + ' ' + p[1] + '%', 'font-size:14.5px;font-weight:700;fill:' + COR[p[0]] + ';text-anchor:middle', g4); xb += w; });
    tx(220, 160, 'T = 30% · sobram 40% para G + C → 20% cada', 'font-size:14px;fill:var(--tinta)', g4);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. Cada degrau: uma base grande + uma pequena', 'A adenina só encaixa com a timina (2 ligações de hidrogênio)', 'e a guanina só com a citosina (3). Assim todo degrau tem', 'a mesma largura: uma base de 2 anéis e uma de 1 anel.'],
      ['2. Fita complementar e antiparalela', 'Conhecida uma fita, a outra sai pela regra: A↔T e G↔C.', 'As fitas correm em sentidos opostos: uma 5′→3′, a outra 3′→5′.', 'Uracila (U) só aparece no RNA, nunca na dupla fita de DNA.'],
      ['3. Contando: pares × bases', 'Cada par de bases tem 2 bases: 10 pares = 20 bases.', 'Como cada A tem um T em frente, A = T; e G = C.', 'Logo A + G (ou T + C) é sempre metade das bases.'],
      ['4. Das porcentagens para os números', 'Sabendo uma base, sabe-se a parceira (mesma quantidade).', 'O que sobra do total é dividido igualmente entre as outras duas.', 'Depois multiplique a porcentagem pelo total de bases.']
    ];
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3;
      deg.forEach(function (d, i) {
        var v1 = f === 0 ? cl((t - .2 - .22 * i) / .25) : 1;
        var vb = f === 0 ? v1 : f === 1 ? cl((t - T[1] - .5 - .2 * i) / .25) : 1;
        op(d.g, v1); op(d.gb, vb); op(d.gh, vb);
      });
      op(gS, f >= 1 ? 1 : .25); op(setas, f === 1 ? 1 : 0);
      op(g1, f === 0 ? cl((t - 1.6) / .4) : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? cl((t - T[2]) / .4) : 0); op(g4, f === 3 ? cl((t - T[3]) / .4) : 0);
      var n = f === 1 ? Math.max(0, Math.min(N, Math.floor((t - T[1] - .5) / .2) + 1)) : N;
      sq2.textContent = '3′ ' + SEQ.slice(0, n).map(function (b) { return PAR[b]; }).join('') + (n === N ? ' 5′' : '');
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['dna-pareamento-chargaff'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'Wac859f9' ? T[1] - .2 : q === 'W7dae107' ? T[2] - .2 : q === 'Pb570d83' ? T[3] - .2 : TF - .01; }
    });
  }
};
VIS.liga('dna-pareamento-chargaff', ['Pb570d83', 'Wac859f9', 'W7dae107', 'Waedcbd5']);
