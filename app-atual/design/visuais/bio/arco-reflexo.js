/* Arco reflexo patelar: martelo no tendao -> fuso muscular (receptor) -> neuronio sensitivo (corpo no ganglio
   da raiz dorsal) -> sinapse direta com o neuronio motor no corno ventral da medula -> quadriceps contrai;
   depois o sinal sobe ao encefalo (percepcao) e o encefalo pode frear o reflexo. */
/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid). */
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
  };
}
var RESP = {
'W05081c5': [
'Por isso a resposta é D',
'O arco fecha na medula espinal: ali o neurônio sensitivo passa o sinal ao motor,',
'sem esperar o encéfalo. Por isso a resposta é rápida e involuntária.'
],
'W4ffc13c': [
'Por isso a resposta é A',
'O receptor (fuso muscular) passa a mensagem ao neurônio sensitivo, que a leva',
'à medula. Só depois vêm a sinapse, o neurônio motor e o músculo (efetor).'
],
'W166b4d1': [
'Por isso a resposta é D',
'Segurar o braço na injeção é comando do cérebro, que consegue frear o reflexo;',
'o salto de susto é o arco reflexo fechado na medula, sem decisão consciente.'
],
'W9ceab8b': [
'Por isso a resposta é B',
'Neurônios sensitivos levam o sinal e neurônios motores contraem músculo esquelético:',
'isso é sistema nervoso somático. O autônomo comanda vísceras e glândulas (III errada).'
],
'Wf729321': [
'Por isso a resposta é E',
'No reflexo patelar o sensitivo faz sinapse direto com o motor (monossináptico):',
'o neurônio de associação pode faltar. Sensitivo, sinapse, motor e efetor, nunca.'
]
};
VIS.def['arco-reflexo'] = {
  tit: 'Arco reflexo: a medula responde antes de o encéfalo saber',
  fontes: ['OpenStax, Anatomy and Physiology 2e, 16.4 The Sensory and Motor Exams (reflexo patelar: o fuso muscular é estirado, o sinal entra pela raiz dorsal e faz sinapse direta com o neurônio motor do corno ventral) — https://openstax.org/books/anatomy-and-physiology-2e/pages/16-4-the-sensory-and-motor-exams', 'OpenStax, Biology 2e, 35.4 The Peripheral Nervous System (sistema somático x autônomo) — https://openstax.org/books/biology-2e/pages/35-4-the-peripheral-nervous-system', 'Wikipedia (en), Reflex arc (arcos monossinápticos e polissinápticos; reflexo de retirada com interneurônios) — https://en.wikipedia.org/wiki/Reflex_arc'],
  tipo: 'anim', dur: 10.4,
  marcas: [[0, '1. Receptor'], [2.6, '2. Medula'], [5.2, '3. Músculo'], [7.8, '4. Encéfalo']],
  cred: 'Animação feita para o app (esquema fora de escala; a medula aparece em corte transversal, com a face dorsal para cima; câmera lenta).',
  nota: 'No reflexo patelar o martelo estira o quadríceps; o fuso muscular (receptor) dispara o neurônio sensitivo, cujo corpo fica no gânglio da raiz dorsal. Na medula ele faz sinapse direta com o neurônio motor, que contrai o quadríceps: a perna chuta. Reflexos de retirada (dor) têm neurônios de associação. O sinal também sobe ao encéfalo, que percebe depois e pode frear o reflexo.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    function caminho(pts, u) {
      var L = [], tot = 0, k;
      for (k = 1; k < pts.length; k++) { var d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); L.push(d); tot += d; }
      var s = cl(u) * tot;
      for (k = 0; k < L.length; k++) { if (s <= L[k] || k === L.length - 1) { var w = L[k] ? cl(s / L[k]) : 0; return [lerp(pts[k][0], pts[k + 1][0], w), lerp(pts[k][1], pts[k + 1][1], w)]; } s -= L[k]; }
    }
    function poly(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' '); }
    svg.setAttribute('viewBox', '0 0 640 360');
    var SEN = '#2b6cb0', MOT = '#c0392b', ENC = '#7b4f9a', PUL = '#e8590c', MUS = '#b5574a';
    /* ===== perna ===== */
    var KX = 194, KY = 88;
    el('rect', { x: 14, y: 60, width: 186, height: 44, rx: 20, style: 'fill:#f0d6bf;stroke:#b08a6a;stroke-width:1.8' });
    var musc = el('ellipse', { cx: 104, cy: 66, rx: 74, ry: 11, style: 'fill:' + MUS + ';stroke:#7e3328;stroke-width:1.5' });
    var canela = el('g', {});
    el('rect', { x: KX - 16, y: KY, width: 30, height: 104, rx: 13, style: 'fill:#f0d6bf;stroke:#b08a6a;stroke-width:1.8' }, canela);
    el('ellipse', { cx: KX + 8, cy: KY + 106, rx: 22, ry: 9, style: 'fill:#f0d6bf;stroke:#b08a6a;stroke-width:1.8' }, canela);
    el('path', { d: 'M' + (KX - 6) + ' 70 Q' + (KX + 18) + ' ' + (KY - 6) + ' ' + (KX + 10) + ' ' + (KY + 22), style: 'fill:none;stroke:#e8e0c8;stroke-width:6;stroke-linecap:round' }, canela);
    el('circle', { cx: KX, cy: KY, r: 15, style: 'fill:#f0d6bf;stroke:#b08a6a;stroke-width:1.8' });
    var fuso = el('ellipse', { cx: 118, cy: 66, rx: 12, ry: 4, style: 'fill:#6fa0d8;stroke:' + SEN + ';stroke-width:1.5' });
    var mart = el('g', {});
    el('rect', { x: -14, y: -8, width: 28, height: 16, rx: 4, style: 'fill:#9a9a9a;stroke:#555;stroke-width:1.5' }, mart);
    el('line', { x1: 8, y1: 6, x2: 44, y2: 46, style: 'stroke:#555;stroke-width:4;stroke-linecap:round' }, mart);
    tx(14, 22, 'receptor: fuso muscular', 'font-size:13.5px;font-weight:700;fill:' + SEN);
    el('line', { x1: 80, y1: 27, x2: 114, y2: 60, style: 'stroke:' + SEN + ';stroke-width:1.3' });
    tx(14, 128, 'quadríceps (efetor)', 'font-size:13.5px;font-weight:700;fill:#7e3328');
    /* ===== medula em corte ===== */
    var CX = 480, CY = 120;
    el('ellipse', { cx: CX, cy: CY, rx: 72, ry: 60, style: 'fill:#f3ede2;stroke:#b8a888;stroke-width:2' });
    el('path', { d: 'M480 96 C470 72 446 62 438 74 C430 88 458 104 462 116 C450 130 428 150 438 166 C450 180 470 150 480 140 C490 150 510 180 522 166 C532 150 510 130 498 116 C502 104 530 88 522 74 C514 62 490 72 480 96 Z', style: 'fill:#d5cbdc;stroke:#9a8aa8;stroke-width:1.5' });
    el('circle', { cx: CX, cy: 118, r: 3, style: 'fill:#9a8aa8' });
    tx(CX, 198, 'medula espinal (corte)', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle');
    /* raizes e nervo */
    el('path', { d: 'M440 76 Q416 58 398 62 M386 66 Q366 76 354 96 M438 166 Q404 168 384 148 Q368 128 356 104', style: 'fill:none;stroke:#cdbfa6;stroke-width:12;stroke-linecap:round' });
    el('ellipse', { cx: 392, cy: 63, rx: 15, ry: 11, style: 'fill:#e6dcc6;stroke:#b8a888;stroke-width:1.5' });
    tx(372, 22, 'gânglio da', 'font-size:13px;fill:var(--lapis)'); tx(372, 37, 'raiz dorsal', 'font-size:13px;fill:var(--lapis)');
    /* vias */
    var SP = [[118, 64], [190, 36], [300, 36], [350, 92], [372, 70], [392, 63], [440, 76], [454, 104], [452, 138]];
    var MP = [[458, 152], [438, 166], [404, 166], [380, 140], [358, 104], [300, 50], [200, 50], [150, 68]];
    el('path', { d: poly(SP), style: 'fill:none;stroke:' + SEN + ';stroke-width:3;stroke-linejoin:round' });
    el('path', { d: poly(MP), style: 'fill:none;stroke:' + MOT + ';stroke-width:3;stroke-linejoin:round' });
    el('circle', { cx: 392, cy: 63, r: 6, style: 'fill:' + SEN });
    el('circle', { cx: 458, cy: 154, r: 8, style: 'fill:' + MOT });
    tx(196, 28, 'neurônio sensitivo', 'font-size:13.5px;font-weight:700;fill:' + SEN);
    tx(214, 70, 'neurônio motor', 'font-size:13.5px;font-weight:700;fill:' + MOT);
    var sinG = el('circle', { cx: 453, cy: 145, r: 11, style: 'fill:none;stroke:' + PUL + ';stroke-width:3' });
    var sinL = el('g', {});
    el('line', { x1: 380, y1: 180, x2: 444, y2: 150, style: 'stroke:' + PUL + ';stroke-width:1.5' }, sinL);
    tx(296, 194, 'sinapse direta', 'font-size:13.5px;font-weight:700;fill:' + PUL, sinL);
    tx(296, 210, '(sensitivo → motor)', 'font-size:13px;fill:' + PUL, sinL);
    /* encefalo (etapa 4) */
    var EN = el('g', {});
    el('path', { d: 'M462 92 C470 60 470 40 470 18 m-6 8 l6 -8 l6 8', style: 'fill:none;stroke:' + ENC + ';stroke-width:2.5' }, EN);
    el('path', { d: 'M500 22 C500 50 500 70 498 100 m-6 -8 l6 8 l6 -8', style: 'fill:none;stroke:' + ENC + ';stroke-width:2.5;stroke-dasharray:6 4' }, EN);
    el('rect', { x: 452, y: 0, width: 66, height: 18, rx: 6, style: 'fill:color-mix(in srgb,' + ENC + ' 14%,var(--folha));stroke:' + ENC + ';stroke-width:1.5' }, EN);
    tx(485, 13.5, 'encéfalo', 'font-size:13px;font-weight:700;fill:' + ENC + ';text-anchor:middle', EN);
    tx(560, 40, '↑ percebe', 'font-size:13px;font-weight:700;fill:' + ENC, EN); tx(560, 56, '(depois)', 'font-size:13px;fill:' + ENC, EN);
    tx(560, 86, '↓ pode', 'font-size:13px;font-weight:700;fill:' + ENC, EN); tx(560, 102, 'frear', 'font-size:13px;font-weight:700;fill:' + ENC, EN);
    var INT = el('g', {});
    el('path', { d: 'M452 104 L470 128 L462 148', style: 'fill:none;stroke:#3f7a45;stroke-width:2;stroke-dasharray:4 3' }, INT);
    el('circle', { cx: 470, cy: 128, r: 6, style: 'fill:#3f7a45' }, INT);
    tx(560, 140, 'retirada:', 'font-size:13px;font-weight:700;fill:#3f7a45', INT); tx(560, 156, '+ neurônio', 'font-size:13px;fill:#3f7a45', INT); tx(560, 172, 'de associação', 'font-size:13px;fill:#3f7a45', INT);
    var pS = el('circle', { r: 7, style: 'fill:' + PUL }), pM = el('circle', { r: 7, style: 'fill:' + PUL }), pE = el('circle', { r: 6, style: 'fill:' + ENC });
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(T) { P0.textContent = T[0]; P.forEach(function (p, i) { p.textContent = T[i + 1] || ''; }); }
    var _desenha = function (t) {
      var f = t < 2.6 ? 0 : t < 5.2 ? 1 : t < 7.8 ? 2 : 3;
      /* martelo */
      var bate = t < .25 ? 0 : t < .5 ? (t - .25) / .25 : t < .75 ? 1 - (t - .5) / .25 : 0;
      mart.setAttribute('transform', 'translate(' + lerp(250, KX + 22, bate).toFixed(1) + ' ' + lerp(132, KY + 18, bate).toFixed(1) + ') rotate(' + (-30 + 10 * bate).toFixed(1) + ')');
      op(mart, t < 2.6 ? 1 : 0);
      fuso.style.fill = t > .5 && t < 2.6 ? '#2b6cb0' : '#6fa0d8';
      /* pulso sensitivo 0.8-3.0 */
      var u1 = cl((t - .8) / 2.2); var p = caminho(SP, u1);
      pS.setAttribute('cx', p[0].toFixed(1)); pS.setAttribute('cy', p[1].toFixed(1)); op(pS, t > .8 && t < 3.1 ? 1 : 0);
      var sv = f === 1 ? .5 + .5 * Math.abs(Math.sin((t - 3) * 4)) : f >= 2 ? .35 : 0;
      op(sinG, t > 3.0 ? sv : 0); op(sinL, t > 3.0 ? 1 : 0);
      /* pulso motor 5.3-6.6 */
      var u2 = cl((t - 5.3) / 1.3); p = caminho(MP, u2);
      pM.setAttribute('cx', p[0].toFixed(1)); pM.setAttribute('cy', p[1].toFixed(1)); op(pM, t > 5.3 && t < 6.7 ? 1 : 0);
      /* contracao e chute 6.6-7.6 */
      var k = t < 6.6 ? 0 : t < 7.1 ? ease((t - 6.6) / .5) : t < 9 ? 1 : 1 - ease((t - 9) / .8);
      musc.setAttribute('ry', (11 + 4 * k).toFixed(1)); musc.setAttribute('rx', (74 - 8 * k).toFixed(1));
      musc.style.fill = k > .1 ? '#d0463a' : MUS;
      canela.setAttribute('transform', 'rotate(' + (-40 * k).toFixed(1) + ' ' + KX + ' ' + KY + ')');
      /* encefalo */
      op(EN, f === 3 ? cl((t - 7.9) / .3) : 0); op(INT, f === 3 ? cl((t - 9.0) / .3) : 0);
      var u3 = cl((t - 8.0) / .9); pE.setAttribute('cx', lerp(462, 470, u3).toFixed(1)); pE.setAttribute('cy', lerp(92, 20, u3).toFixed(1)); op(pE, t > 8 && t < 9 ? 1 : 0);
      if (f === 0) painel(['1. Estímulo → receptor → neurônio sensitivo', 'O martelo no tendão estica o quadríceps; o fuso muscular (receptor) dispara.', 'O neurônio sensitivo leva o sinal até a medula (corpo dele no gânglio).']);
      else if (f === 1) painel(['2. Na medula espinal: a decisão', 'O neurônio sensitivo faz sinapse direto com o neurônio motor.', 'O arco fecha aqui: a medula responde sozinha, sem passar pelo encéfalo.']);
      else if (f === 2) painel(['3. Neurônio motor → músculo (efetor)', 'O neurônio motor leva a ordem ao quadríceps, que contrai: a perna chuta.', 'Músculo esquelético: é o sistema nervoso somático, em resposta involuntária.']);
      else painel(['4. O encéfalo só fica sabendo depois', 'O sinal também sobe ao encéfalo, que percebe a batida depois do chute.', 'O encéfalo pode frear o reflexo. Na retirada (dor) há neurônio de associação.']);
    };
    return fimResposta(VIS.def['arco-reflexo'], svg, _desenha, 10.4, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W4ffc13c' ? 2.2 : q === 'W05081c5' ? 5.1 : q === 'W9ceab8b' ? 7.7 : 10.35; }
    });
  }
};
VIS.liga('arco-reflexo', ['W05081c5', 'W4ffc13c', 'W166b4d1', 'W9ceab8b', 'Wf729321']);
