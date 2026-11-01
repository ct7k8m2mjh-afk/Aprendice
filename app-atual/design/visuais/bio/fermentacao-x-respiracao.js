/* Destinos do piruvato: respiracao aerobia (com O2) x fermentacao alcoolica e latica (sem O2),
   com o grafico de ATP por glicose de uma levedura quando o O2 acaba (Einstein 2020, Pa1cc3b0). */
/* etapa final "Resposta": congela o desenho no ultimo quadro e mostra o porque da questao aberta (qid).
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
'Pa1cc3b0': [
'Por isso a resposta é D',
'Depois da seta o ATP por glicose despenca: o O₂ acabou.',
'A levedura fermenta: 2 etanol, 2 CO₂ e 2 ATP por glicose.'
],
'P2dfaa24': [
'Por isso a resposta é A',
'A levedura faz fermentação alcoólica: o açúcar vira etanol',
'e CO₂, e é o gás que faz a massa do pão crescer.'
],
'We2f3aab': [
'Por isso a resposta é C',
'Sem O₂ suficiente a fibra muscular faz fermentação',
'lática e acumula ácido lático.'
],
'W1bbbf76': [
'Por isso a resposta é D',
'A fermentação alcoólica acontece no citoplasma,',
'não gasta O₂ e libera CO₂.'
],
'Waa22ab5': [
'Por isso a resposta é C',
'Bactérias láticas acidificam o leite, e o ácido lático',
'coagula a proteína (é assim que se faz o iogurte).'
],
'W555a78a': [
'Por isso a resposta é A',
'II erra (há vias sem O₂) e VI inverte os rendimentos',
'(fermentação: 2 ATP; respiração: muito mais).',
'Corretas: I, III, IV e V.'
],
'Pae997be': [
'Por isso a resposta é C',
'Sem O₂ suficiente o músculo forma lactato, e o pH cai.',
'Quem inerva a fibra é o neurônio motor, que cria',
'novas terminações do axônio.'
]
};
VIS.def['fermentacao-x-respiracao'] = {
  tit: 'Com O₂ a célula respira; sem O₂ ela fermenta',
  fontes: ['OpenStax, Biology 2e, 7.2 Glycolysis — https://openstax.org/books/biology-2e/pages/7-2-glycolysis', 'OpenStax, Biology 2e, 7.5 Metabolism without Oxygen — https://openstax.org/books/biology-2e/pages/7-5-metabolism-without-oxygen', 'Wikipedia (en), Cellular respiration — https://en.wikipedia.org/wiki/Cellular_respiration'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Glicólise'], [2.5, 'Com O₂'], [5, 'Sem O₂: alcoólica'], [8.5, 'Lática']],
  cred: 'Animação feita para o app (esquema; valores por molécula de glicose). Saldo da respiração aeróbia pela contagem atual: cerca de 30 a 32 ATP.',
  nota: 'Toda fermentação acontece no citosol, sem O₂, e rende só os 2 ATP da glicólise: a etapa depois do piruvato não faz ATP, serve para devolver o NAD⁺ à glicólise. A alcoólica (levedura) solta CO₂; a lática (músculo, bactérias do iogurte) não solta CO₂ e acidifica o meio.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    var S = { sub: 'font-size:14px;fill:var(--tinta)', forte: 'font-size:14.5px;font-weight:700;fill:var(--tinta)', lab: 'font-size:13px;font-weight:600;fill:var(--lapis)', mini: 'font-size:13px;fill:var(--lapis)' };
    var GLI = '#c98a12', AER = '#2b6cb0', ALC = '#8a5a9e', LAT = '#b4442f', ATP = '#9a7220';
    svg.setAttribute('viewBox', '0 0 640 350');
    /* glicose -> piruvato */
    var cx = 92;
    var bG = el('rect', { x: cx - 58, y: 22, width: 116, height: 34, rx: 9, style: 'fill:color-mix(in srgb,' + GLI + ' 16%,var(--folha));stroke:' + GLI + ';stroke-width:1.8' });
    tx(cx, 44, 'glicose', S.forte + ';text-anchor:middle');
    var aG = el('path', { d: 'M' + cx + ' 58 V98 m-6 -8 l6 8 l6 -8', style: 'fill:none;stroke:var(--tinta);stroke-width:2' });
    tx(cx + 10, 74, 'glicólise', 'font-size:13px;font-weight:700;fill:var(--tinta)'); tx(cx + 10, 90, 'no citosol', S.mini);
    var bP = el('rect', { x: cx - 58, y: 102, width: 116, height: 34, rx: 9, style: 'fill:color-mix(in srgb,#d26a3a 16%,var(--folha));stroke:#d26a3a;stroke-width:1.8' });
    tx(cx, 124, '2 piruvato', S.forte + ';text-anchor:middle');
    var chips = el('g', {});
    el('rect', { x: cx - 58, y: 144, width: 54, height: 22, rx: 11, style: 'fill:color-mix(in srgb,' + ATP + ' 18%,var(--folha))' }, chips);
    tx(cx - 31, 160, '2 ATP', 'font-size:13px;font-weight:700;fill:' + ATP + ';text-anchor:middle', chips);
    el('rect', { x: cx + 2, y: 144, width: 56, height: 22, rx: 11, style: 'fill:color-mix(in srgb,var(--tinta) 9%,transparent)' }, chips);
    tx(cx + 30, 160, '2 NADH', 'font-size:13px;font-weight:700;fill:var(--tinta);text-anchor:middle', chips);
    var glP = el('path', { d: 'M0 -9 L8 0 L0 9 L-8 0 Z', style: 'fill:' + GLI });
    /* tres destinos */
    var R = [
      { y: 18, cor: AER, t1: 'Com O₂: respiração aeróbia', t2: 'na mitocôndria → 6 CO₂ + 6 H₂O', t3: 'cerca de 30 a 32 ATP por glicose' },
      { y: 92, cor: ALC, t1: 'Sem O₂: fermentação alcoólica', t2: 'levedura, no citosol → 2 etanol + 2 CO₂', t3: 'só 2 ATP · o CO₂ faz o pão crescer' },
      { y: 166, cor: LAT, t1: 'Sem O₂: fermentação lática', t2: 'músculo, bactérias do iogurte → 2 lactato', t3: 'só 2 ATP · sem CO₂ · o pH cai' }
    ];
    var BX = 262, BW = 364, BH = 64;
    R.forEach(function (r) {
      r.lig = el('path', { d: 'M' + (cx + 60) + ' 119 C' + (cx + 110) + ' 119 ' + (BX - 50) + ' ' + (r.y + BH / 2) + ' ' + (BX - 4) + ' ' + (r.y + BH / 2) + ' m-8 -6 l8 6 l-8 6', style: 'fill:none;stroke:' + r.cor + ';stroke-width:2.4' });
      r.g = el('g', {});
      r.box = el('rect', { x: BX, y: r.y, width: BW, height: BH, rx: 10, style: 'fill:color-mix(in srgb,' + r.cor + ' 11%,var(--folha));stroke:' + r.cor + ';stroke-width:1.8' }, r.g);
      tx(BX + 12, r.y + 20, r.t1, 'font-size:14.5px;font-weight:700;fill:' + r.cor, r.g);
      tx(BX + 12, r.y + 39, r.t2, S.sub, r.g); tx(BX + 12, r.y + 57, r.t3, S.sub, r.g);
    });
    var bolhas = [0, 1, 2, 3].map(function () { return el('circle', { r: 4, style: 'fill:none;stroke:' + ALC + ';stroke-width:1.5' }); });
    var dot = el('circle', { r: 6, style: 'fill:#d26a3a' });
    /* grafico ATP/glicose da levedura */
    var gx0 = 76, gx1 = 330, gyA = 266, gyB = 324;
    el('line', { x1: 14, x2: 626, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.5' });
    tx(14, 262, 'ATP por', S.lab); tx(14, 277, 'glicose', S.lab);
    el('path', { d: 'M' + gx0 + ' 252 V' + (gyB + 12) + ' H' + (gx1 + 8), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' });
    tx(gx1 + 12, gyB + 16, 'tempo', S.mini);
    var XD = 190;
    function gy(x) { return x < XD ? gyA : x < XD + 26 ? lerp(gyA, gyB, (x - XD) / 26) : gyB; }
    var curva = el('path', { style: 'fill:none;stroke:' + ALC + ';stroke-width:3' });
    var gm = el('circle', { r: 6, style: 'fill:' + ALC + ';stroke:var(--folha);stroke-width:2' });
    tx(gx0 + 8, gyA - 8, 'respira: ~30', 'font-size:13px;font-weight:700;fill:' + AER);
    var fT = tx(XD + 34, gyB - 8, 'fermenta: 2', 'font-size:13px;font-weight:700;fill:' + ALC);
    var o2 = el('g', {});
    el('path', { d: 'M' + (XD + 4) + ' 250 v12 m-5 -6 l5 6 l5 -6', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, o2);
    tx(XD + 14, 260, 'O₂ acaba', 'font-size:13px;font-weight:700;fill:var(--tinta)', o2);
    var g1 = tx(392, 266, '', S.forte), g2 = tx(392, 285, '', S.sub), g3 = tx(392, 303, '', S.sub), g4 = tx(392, 321, '', S.sub), g5 = tx(392, 339, '', S.sub);
    function op(o, v) { o.style.opacity = v.toFixed(2); }
    var _desenha = function (t) {
      var fase = t < 2.5 ? 0 : t < 5 ? 1 : t < 8.5 ? 2 : 3;
      /* glicose descendo */
      var u = cl(t / 2.2); glP.setAttribute('transform', 'translate(' + cx + ' ' + lerp(60, 98, ease(u)).toFixed(1) + ')'); op(glP, t < 2.3 ? 1 - cl((u - .85) / .15) : 0);
      op(chips, cl((t - 1.6) / .5));
      R.forEach(function (r, i) { var on = fase === i + 1; op(r.g, fase === 0 ? .35 : on ? 1 : .3); op(r.lig, fase === 0 ? .2 : on ? 1 : .15); });
      /* piruvato viajando ate o destino ativo */
      if (fase > 0) {
        var r = R[fase - 1], t0 = [2.5, 5, 8.5][fase - 1], v = ease(cl((t - t0) / 1.2));
        var p0 = [cx + 60, 119], p1 = [cx + 110, 119], p2 = [BX - 50, r.y + BH / 2], p3 = [BX - 4, r.y + BH / 2];
        function bz(a, b, c, d, s) { var m = 1 - s; return m * m * m * a + 3 * m * m * s * b + 3 * m * s * s * c + s * s * s * d; }
        dot.setAttribute('cx', bz(p0[0], p1[0], p2[0], p3[0], v).toFixed(1)); dot.setAttribute('cy', bz(p0[1], p1[1], p2[1], p3[1], v).toFixed(1)); op(dot, v < 1 ? 1 : 0);
      } else op(dot, 0);
      /* bolhas de CO2 na alcoolica */
      bolhas.forEach(function (b, i) {
        var w = ((t - 6.2) / 1.1 - i * .25) % 1; if (w < 0) w += 1;
        b.setAttribute('cx', BX + BW - 60 + 12 * i); b.setAttribute('cy', (R[1].y + BH - 6 - 52 * w).toFixed(1));
        op(b, fase === 2 && t > 6.2 ? Math.sin(Math.PI * w) : 0);
      });
      /* grafico: acompanha a levedura (fases 1 e 2) */
      var xg = fase < 1 ? gx0 : fase === 1 ? lerp(gx0, XD - 6, (t - 2.5) / 2.5) : fase === 2 ? lerp(XD - 6, gx1, ease((t - 5) / 3.2)) : gx1;
      var d = ''; for (var x = gx0; x <= xg; x += 3) d += (d ? 'L' : 'M') + x + ' ' + gy(x).toFixed(1) + ' ';
      curva.setAttribute('d', d + (d ? 'L' : 'M') + xg.toFixed(1) + ' ' + gy(xg).toFixed(1));
      gm.setAttribute('cx', xg.toFixed(1)); gm.setAttribute('cy', gy(xg).toFixed(1));
      op(o2, xg > XD - 8 ? 1 : 0); op(fT, xg > XD + 30 ? 1 : 0);
      var L;
      if (fase === 0) L = ['Primeiro, sempre: glicólise', 'Com ou sem O₂, a glicose vira', '2 piruvato no citosol, com', 'saldo de 2 ATP (4 feitos − 2 gastos).'];
      else if (fase === 1) L = ['Levedura com O₂', 'O piruvato entra na mitocôndria', 'e a célula tira muito ATP de', 'cada glicose: a linha fica alta.'];
      else if (fase === 2) L = ['O O₂ acabou no tubo', 'A levedura passa a fermentar:', 'etanol + CO₂ e só 2 ATP por', 'glicose. A linha despenca.'];
      else L = ['Fermentação lática', 'Músculo sem O₂ suficiente: o', 'piruvato vira lactato e o pH cai.', 'Bactérias do iogurte fazem o mesmo:', 'o ácido lático coagula a proteína do leite.'];
      g1.textContent = L[0]; g2.textContent = L[1]; g3.textContent = L[2]; g4.textContent = L[3]; g5.textContent = L[4] || '';
      op(curva, fase === 3 ? .35 : 1); op(gm, fase === 3 ? .35 : 1);
    };
    return fimResposta(VIS.def['fermentacao-x-respiracao'], svg, _desenha, 12, RESP, qid, { congela: function (q) { return ['Pa1cc3b0', 'P2dfaa24', 'W1bbbf76'].indexOf(q) >= 0 ? 8.3 : 11.99; } });
  }
};
VIS.liga('fermentacao-x-respiracao', ['Pa1cc3b0', 'P2dfaa24', 'We2f3aab', 'W1bbbf76', 'Waa22ab5', 'W555a78a', 'Pae997be']);
