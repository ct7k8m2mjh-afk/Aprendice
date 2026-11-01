/* Fotoperiodismo: a planta mede a duracao da NOITE continua. Dia curto = noite longa; dia longo = noite curta;
   neutra = tanto faz. Flash no meio da noite. Os dois tratamentos da questao W91c3028 (Fatec). */
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
  'W91c3028': [
    'Por isso a resposta é D',
    'I só floresce com noite curta (14 h): dia longo. II floresce nas duas: neutra.',
    'III só floresce com noite longa (21 h): dia curto.'
  ]
};
VIS.def['fotoperiodismo'] = {
  tit: 'Fotoperiodismo: a planta mede a noite',
  fontes: [
    'OpenStax, Biology 2e, 30.6 Plant Sensory Systems and Responses (fitocromo; plantas de dia curto, de dia longo e neutras; noite crítica; flash de luz no escuro) — https://openstax.org/books/biology-2e/pages/30-6-plant-sensory-systems-and-responses',
    'Wikipedia (en), Photoperiodism (short-day = long-night plants; night break) — https://en.wikipedia.org/wiki/Photoperiodism',
    'Khan Academy, Plant responses to light (photoperiodism) — https://www.khanacademy.org/science/ap-biology/ecology-ap/responses-to-the-environment/a/photoperiodism'
  ],
  tipo: 'anim', dur: 15.6,
  marcas: [[0, 'A noite'], [3.8, 'Três tipos'], [7.8, 'Flash'], [11.4, 'Os dados']],
  cred: 'Animação feita para o app (esquema). Barras de 24 h: amarelo = luz, azul-escuro = escuro. A noite crítica muda de espécie para espécie; nos passos 1 a 3 ela vale 12 h só como exemplo.',
  nota: 'Os nomes enganam: a planta não mede o dia, mede a noite contínua. Dia curto = precisa de noite MAIOR que a crítica; dia longo = precisa de noite MENOR que a crítica; neutra = floresce de qualquer jeito.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 372');
    var LUZ = '#f2c94c', ESC = '#26365e', FLOR = '#c2457f', VERDE = '#4f8a3c';
    var S = { tit: 'font-size:19px;font-weight:700;fill:var(--tinta)', l: 'font-size:14px;fill:var(--tinta)', b: 'font-size:14px;font-weight:700;fill:var(--tinta)', m: 'font-size:13px;fill:var(--lapis)' };
    /* barra de 24 h: segs = [[horas, 'L'|'E'|'F'], ...] */
    function barra(pai, x, y, w, h) {
      var g = el('g', {}, pai), r = [];
      for (var i = 0; i < 4; i++) r.push(el('rect', { y: y, height: h }, g));
      el('rect', { x: x, y: y, width: w, height: h, rx: 4, style: 'fill:none;stroke:var(--tinta);stroke-width:1.4' }, g);
      return { set: function (segs) {
        var xx = x;
        r.forEach(function (q, i) {
          var s = segs[i];
          if (!s) { q.setAttribute('width', 0); return; }
          var ww = w * s[0] / 24; q.setAttribute('x', xx.toFixed(1)); q.setAttribute('width', ww.toFixed(1));
          q.setAttribute('style', 'fill:' + (s[1] === 'L' ? LUZ : s[1] === 'F' ? '#fff3b0' : ESC));
          xx += ww;
        });
      } };
    }
    function planta(pai, x, y, flor) {
      var g = el('g', { transform: 'translate(' + x + ' ' + y + ')' }, pai);
      el('path', { d: 'M0 0 V-34', style: 'stroke:' + VERDE + ';stroke-width:2.4;fill:none' }, g);
      el('path', { d: 'M0 -10 C-10 -12 -16 -20 -17 -26 C-8 -24 -2 -18 0 -12 Z M0 -16 C10 -18 16 -26 17 -32 C8 -30 2 -24 0 -18 Z', style: 'fill:' + VERDE }, g);
      if (flor) { for (var i = 0; i < 5; i++) { var a = i * 1.2566; el('circle', { cx: (6 * Math.sin(a)).toFixed(1), cy: (-40 - 6 * Math.cos(a)).toFixed(1), r: 5, style: 'fill:' + FLOR }, g); } el('circle', { cx: 0, cy: -40, r: 3, style: 'fill:#f0c94a' }, g); }
      else el('ellipse', { cx: 0, cy: -38, rx: 3.5, ry: 5, style: 'fill:#8fb37a' }, g);
      return g;
    }
    function escala(pai, x, y, w) {
      [0, 6, 12, 18, 24].forEach(function (h) { tx(x + w * h / 24, y, h + ' h', S.m + ';text-anchor:middle', pai); });
    }
    var TX = 440, tT = tx(TX, 40, '', S.tit), tL = [];
    for (var i = 0; i < 9; i++) tL.push(tx(TX, 70 + i * 21, '', S.l));
    el('line', { x1: 424, x2: 424, y1: 20, y2: 350, style: 'stroke:var(--linha);stroke-width:1.2' });

    /* ===== 1. o relogio e a noite ===== */
    var G1 = el('g', {});
    var B1 = barra(G1, 30, 100, 360, 40); escala(G1, 30, 160, 360);
    var n1 = tx(210, 86, '', S.b + ';text-anchor:middle', G1);
    var cr1 = el('path', { style: 'stroke:#d0452f;stroke-width:2.5;stroke-dasharray:5 4;fill:none' }, G1);
    tx(30, 196, 'noite crítica (exemplo: 12 h)', 'font-size:13px;font-weight:700;fill:#d0452f', G1);
    var P1a = el('g', {}, G1), P1b = el('g', {}, G1);
    planta(P1a, 120, 300, true); planta(P1b, 120, 300, false);
    var P1c = el('g', {}, G1), P1d = el('g', {}, G1);
    planta(P1c, 300, 300, true); planta(P1d, 300, 300, false);
    tx(120, 322, 'dia curto', S.b + ';text-anchor:middle', G1); tx(300, 322, 'dia longo', S.b + ';text-anchor:middle', G1);
    var r1a = tx(120, 340, '', S.m + ';text-anchor:middle', G1), r1b = tx(300, 340, '', S.m + ';text-anchor:middle', G1);

    /* ===== 2. tres tipos ===== */
    var G2 = el('g', {});
    var xA = 150, xB = 300, BW = 120;
    var b2a = barra(G2, xA - BW / 2, 50, BW, 22), b2b = barra(G2, xB - BW / 2, 50, BW, 22);
    b2a.set([[8, 'L'], [16, 'E']]); b2b.set([[16, 'L'], [8, 'E']]);
    tx(xA, 40, 'noite longa: 16 h', S.b + ';text-anchor:middle', G2); tx(xB, 40, 'noite curta: 8 h', S.b + ';text-anchor:middle', G2);
    tx(xA, 90, '(maior que a crítica)', S.m + ';text-anchor:middle', G2); tx(xB, 90, '(menor que a crítica)', S.m + ';text-anchor:middle', G2);
    var LIN2 = [['dia curto', true, false], ['dia longo', false, true], ['neutra', true, true]];
    var R2 = LIN2.map(function (k, i) {
      var g = el('g', {}, G2), y = 158 + i * 78;
      el('line', { x1: 14, x2: 410, y1: y + 16, y2: y + 16, style: 'stroke:var(--linha);stroke-width:1' }, g);
      tx(16, y - 8, k[0], S.b, g);
      planta(g, xA, y + 8, k[1]); planta(g, xB, y + 8, k[2]);
      tx(xA + 18, y - 4, k[1] ? 'floresce' : 'não', 'font-size:13px;font-weight:700;fill:' + (k[1] ? FLOR : 'var(--lapis)'), g);
      tx(xB + 18, y - 4, k[2] ? 'floresce' : 'não', 'font-size:13px;font-weight:700;fill:' + (k[2] ? FLOR : 'var(--lapis)'), g);
      return g;
    });

    /* ===== 3. flash no meio da noite ===== */
    var G3 = el('g', {});
    var B3 = barra(G3, 30, 92, 360, 40); escala(G3, 30, 152, 360);
    tx(30, 76, 'dia de 8 h + noite de 16 h, com um flash no meio', S.b, G3);
    var fl3 = tx(270, 182, '', 'font-size:13px;font-weight:700;fill:#b07d00;text-anchor:middle', G3);
    var p3 = el('g', {}, G3);
    planta(p3, 120, 290, false); planta(p3, 300, 290, true);
    tx(120, 312, 'dia curto: não', S.b + ';text-anchor:middle', p3); tx(300, 312, 'dia longo: floresce', S.b + ';text-anchor:middle', p3);
    tx(120, 330, 'nenhum trecho escuro', S.m + ';text-anchor:middle', p3); tx(300, 330, 'só "viu" noites curtas', S.m + ';text-anchor:middle', p3);
    tx(120, 346, 'passou de 12 h', S.m + ';text-anchor:middle', p3);

    /* ===== 4. os dados da questao ===== */
    var G4 = el('g', {});
    var xa = 115, xb = 280, bw = 124;
    var b4a = barra(G4, xa - bw / 2, 46, bw, 22), b4b = barra(G4, xb - bw / 2, 46, bw, 22);
    b4a.set([[3, 'L'], [21, 'E']]); b4b.set([[10, 'L'], [14, 'E']]);
    tx(xa, 36, '3 h luz + 21 h escuro', S.b + ';text-anchor:middle', G4); tx(xb, 36, '10 h luz + 14 h escuro', S.b + ';text-anchor:middle', G4);
    tx(xa, 86, 'noite LONGA', 'font-size:13px;font-weight:700;fill:' + ESC + ';text-anchor:middle', G4); tx(xb, 86, 'noite mais CURTA', 'font-size:13px;font-weight:700;fill:' + ESC + ';text-anchor:middle', G4);
    var D4 = [['I', false, true, 'dia longo'], ['II', true, true, 'neutra'], ['III', true, false, 'dia curto']];
    var R4 = D4.map(function (k, i) {
      var g = el('g', {}, G4), y = 140 + i * 52;
      el('line', { x1: 14, x2: 410, y1: y + 14, y2: y + 14, style: 'stroke:var(--linha);stroke-width:1' }, g);
      tx(22, y - 8, k[0], 'font-size:20px;font-weight:700;fill:var(--tinta)', g);
      planta(g, xa - 20, y + 8, k[1]); planta(g, xb - 20, y + 8, k[2]);
      tx(xa - 2, y - 4, k[1] ? 'floresce' : 'não', 'font-size:13px;font-weight:700;fill:' + (k[1] ? FLOR : 'var(--lapis)'), g);
      tx(xb - 2, y - 4, k[2] ? 'floresce' : 'não', 'font-size:13px;font-weight:700;fill:' + (k[2] ? FLOR : 'var(--lapis)'), g);
      return g;
    });
    var C4 = D4.map(function (k, i) { return tx(408, 140 + i * 52 - 4, k[3], 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:end', G4); });

    var TXT = [
      ['O relógio é a noite', 'A planta detecta luz pelo', 'fitocromo e mede quanto dura', 'o escuro sem interrupção.', '', 'Cada espécie tem uma noite', 'crítica. Passou dela ou não?', 'É isso que decide a floração.'],
      ['Três tipos de planta', 'Dia curto: floresce quando a', 'noite é MAIOR que a crítica.', 'Dia longo: floresce quando a', 'noite é MENOR que a crítica.', 'Neutra: floresce de qualquer', 'jeito; não usa a noite para', 'decidir.'],
      ['A prova: um flash', 'Um flash de luz no meio da', 'noite longa a corta em duas', 'noites curtas.', '', 'A de dia curto deixa de', 'florescer; a de dia longo', 'floresce. Conta a noite', 'contínua, não o dia.'],
      ['Lendo a questão', 'Compare as duas colunas:', 'floresce só com a noite curta', '= dia longo (I);', 'floresce nas duas = neutra (II);', 'floresce só com a noite longa', '= dia curto (III).', 'A noite crítica de I e de III', 'fica entre 14 h e 21 h.']
    ];
    var T = [0, 3.8, 7.8, 11.4, 15.6];
    return fimResposta(VIS.def['fotoperiodismo'], svg, function (t) {
      var k = t < 3.8 ? 0 : t < 7.8 ? 1 : t < 11.4 ? 2 : 3, u = t - T[k];
      tT.textContent = TXT[k][0];
      tL.forEach(function (e, i) { e.textContent = TXT[k][i + 1] || ''; });
      vis(G1, k === 0 ? 1 : 0); vis(G2, k === 1 ? 1 : 0); vis(G3, k === 2 ? 1 : 0); vis(G4, k === 3 ? 1 : 0);
      if (k === 0) {
        var luz = 16 - 8 * ease((u - .3) / 2.2), noite = 24 - luz;
        B1.set([[luz, 'L'], [noite, 'E']]);
        n1.textContent = 'luz ' + luz.toFixed(0) + ' h  ·  escuro ' + noite.toFixed(0) + ' h';
        var xc = 30 + 360 * (24 - 12) / 24;
        cr1.setAttribute('d', 'M' + xc + ' 94 V146');
        var longa = noite > 12.01;
        vis(P1a, longa ? 1 : 0); vis(P1b, longa ? 0 : 1); vis(P1c, longa ? 0 : 1); vis(P1d, longa ? 1 : 0);
        r1a.textContent = longa ? 'noite longa: floresce' : 'noite curta: não';
        r1b.textContent = longa ? 'noite longa: não' : 'noite curta: floresce';
      }
      if (k === 1) R2.forEach(function (g, i) { vis(g, cl((u - .3 - i * .5) / .4)); });
      if (k === 2) {
        var f = u > .9;
        B3.set(f ? [[8, 'L'], [8, 'E'], [.5, 'F'], [7.5, 'E']] : [[8, 'L'], [16, 'E']]);
        fl3.textContent = f ? 'flash: 8 h + 7,5 h de escuro' : '';
        vis(p3, cl((u - 1.3) / .4));
      }
      if (k === 3) { R4.forEach(function (g, i) { vis(g, cl((u - .3 - i * .4) / .4)); }); C4.forEach(function (g, i) { vis(g, cl((u - 1.8 - i * .3) / .3)); }); }
    }, 15.6, RESP, qid, { congela: function () { return 15.4; }, semEsmaecer: true, x: 14, y: 258, w: 612, h: 106 });
  }
};
VIS.liga('fotoperiodismo', ['W91c3028']);
