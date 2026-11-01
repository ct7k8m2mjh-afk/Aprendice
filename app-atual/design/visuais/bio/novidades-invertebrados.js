/* Novidades do plano do corpo nos invertebrados, na ordem de complexidade usada nos livros do ensino medio:
   porifero -> cnidario -> platelminto -> nematodeo -> anelideo -> artropode.
   Questoes W9d3805e, W6e5a18e, W76ebdba, Wbad6f63, Wf0f72e8. */
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
  'W9d3805e': ['Por isso a resposta é D', 'Esponja não tem simetria; cnidário é radial. Os', 'platelmintos são os primeiros bilaterais com cabeça.'],
  'W6e5a18e': ['Por isso a resposta é B', 'A digestão extracelular, que começa nos cnidários,', 'continua nos grupos seguintes; o cnidócito, não.'],
  'W76ebdba': ['Por isso a resposta é A', 'Triblástico, bilateral, com celoma verdadeiro e', 'corpo em metâmeros: é o anelídeo.'],
  'Wbad6f63': ['Por isso a resposta é D', 'Artrópodes são triblásticos, celomados, protostômios,', 'com exoesqueleto de quitina e simetria BILATERAL.'],
  'Wf0f72e8': ['Por isso a resposta é C', 'Crustáceos: 2 pares de antenas. Insetos, diplópodes', 'e quilópodes: 1 par. Aracnídeos: nenhuma.']
};
VIS.def['novidades-invertebrados'] = {
  tit: 'O que cada grupo de invertebrados trouxe de novo',
  fontes: [
    'OpenStax, Biology 2e, 27.2 Features Used to Classify Animals (simetria, folhetos, celoma, protostômios) — https://openstax.org/books/biology-2e/pages/27-2-features-used-to-classify-animals',
    'OpenStax, Biology 2e, 28.1 Phylum Porifera e 28.2 Phylum Cnidaria (digestão intracelular x cavidade gastrovascular; cnidócitos) — https://openstax.org/books/biology-2e/pages/28-2-phylum-cnidaria',
    'OpenStax, Biology 2e, 28.3 Superphylum Lophotrochozoa (platelmintos: cefalização, acelomados; anelídeos: celoma e metameria) — https://openstax.org/books/biology-2e/pages/28-3-superphylum-lophotrochozoa-flatworms-rotifers-and-nemerteans',
    'OpenStax, Biology 2e, 28.5 Superphylum Ecdysozoa (nematódeos: tubo completo, pseudoceloma; artrópodes: exoesqueleto de quitina, apêndices articulados; crustáceos com dois pares de antenas) — https://openstax.org/books/biology-2e/pages/28-5-superphylum-ecdysozoa-arthropods'
  ],
  tipo: 'anim', dur: 21,
  marcas: [[0, 'Esponja'], [3.5, 'Cnidário'], [7, 'Planária'], [10.5, 'Lombriga'], [14, 'Minhoca'], [17.5, 'Artrópodes']],
  cred: 'Esquemas feitos para o app (fora de escala). A escada segue a ordem de complexidade do corpo usada nos livros do ensino médio; não é uma árvore de parentesco (pelos dados moleculares, nematódeos são mais aparentados aos artrópodes, e platelmintos aos anelídeos).',
  nota: 'Cada degrau mantém o que veio antes e soma uma novidade. O que é exclusivo de um grupo (como o cnidócito) não passa adiante.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    function p(d, st, pai) { return el('path', { d: d, style: st }, pai); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var S = { tit: 'font-size:17px;font-weight:700;fill:var(--tinta)', l: 'font-size:14px;fill:var(--tinta)', b: 'font-size:13.5px;font-weight:700;fill:var(--tinta)', m: 'font-size:13px;fill:var(--lapis)' };
    var ECT = '#d98f6b', END = '#8bb26a', MES = '#c94f6d', TUBO = '#c98a12', NERV = '#2b6cb0', CUT = '#7a5c3a';
    var lbl = function (pai, x, y, s, cor, anc) { return tx(x, y, s, 'font-size:13px;font-weight:700;fill:' + (cor || 'var(--tinta)') + (anc ? ';text-anchor:' + anc : ''), pai); };
    /* ===== escada a esquerda ===== */
    var ESC = [['Poríferos', 'sem tecidos, sem simetria'], ['Cnidários', 'cavidade digestiva, radial'], ['Platelmintos', 'bilateral, cabeça, 3 folhetos'], ['Nematódeos', 'tubo completo: boca e ânus'], ['Anelídeos', 'celoma e metameria'], ['Artrópodes', 'exoesqueleto, patas articuladas']];
    var LAD = ESC.map(function (k, i) {
      var g = el('g', {}), y = 14 + i * 54;
      var bx = el('rect', { x: 8, y: y, width: 196, height: 46, rx: 9, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.4' }, g);
      tx(18, y + 19, (i + 1) + '. ' + k[0], 'font-size:14px;font-weight:700;fill:var(--tinta)', g);
      tx(18, y + 37, k[1], 'font-size:13px;fill:var(--lapis)', g);
      return { g: g, bx: bx };
    });
    el('line', { x1: 214, x2: 214, y1: 14, y2: 336, style: 'stroke:var(--linha);stroke-width:1.2' });
    var tT = tx(226, 268, '', S.tit), t1 = tx(226, 292, '', S.l), t2 = tx(226, 313, '', S.l), t3 = tx(226, 334, '', S.l);
    el('line', { x1: 226, x2: 626, y1: 246, y2: 246, style: 'stroke:var(--linha);stroke-width:1' });
    var P = [];
    /* ---- 0. esponja ---- */
    var g0 = el('g', {}); P.push(g0);
    p('M300 226 C284 180 284 110 302 64 L350 64 C368 110 368 180 352 226 Z', 'fill:#e9d48a;stroke:#a88a2c;stroke-width:2', g0);
    p('M306 70 C294 120 294 180 306 220 M346 70 C358 120 358 180 346 220', 'fill:none;stroke:#a88a2c;stroke-width:1;stroke-dasharray:3 4', g0);
    [[292, 110], [290, 150], [293, 190], [360, 110], [362, 150], [359, 190]].forEach(function (q, i) {
      el('circle', { cx: q[0], cy: q[1], r: 4, style: 'fill:#fff;stroke:#a88a2c;stroke-width:1.2' }, g0);
      var dx = i < 3 ? -1 : 1; p('M' + (q[0] + dx * 24) + ' ' + q[1] + ' h' + (-dx * 14) + ' m' + (dx * 6) + ' -5 l' + (-dx * 6) + ' 5 l' + (dx * 6) + ' 5', 'fill:none;stroke:#2b8fc4;stroke-width:1.8', g0);
    });
    p('M326 62 V30 m-6 8 l6 -8 l6 8', 'fill:none;stroke:#2b8fc4;stroke-width:2.2', g0);
    lbl(g0, 338, 36, 'água sai (ósculo)', '#1f6f99'); lbl(g0, 240, 92, 'poros', '#1f6f99');
    /* coanocito ampliado */
    el('circle', { cx: 486, cy: 150, r: 46, style: 'fill:none;stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, g0);
    p('M362 150 L440 150', 'stroke:var(--lapis);stroke-width:1;stroke-dasharray:4 4', g0);
    el('ellipse', { cx: 486, cy: 166, rx: 20, ry: 16, style: 'fill:#f3e7c0;stroke:#a88a2c;stroke-width:1.6' }, g0);
    p('M474 152 L470 124 M498 152 L502 124', 'stroke:#a88a2c;stroke-width:1.6', g0);
    p('M486 150 C484 136 490 128 486 112', 'fill:none;stroke:#a88a2c;stroke-width:1.6', g0);
    el('circle', { cx: 489, cy: 168, r: 5, style: 'fill:' + TUBO }, g0);
    el('circle', { cx: 489, cy: 168, r: 8.5, style: 'fill:none;stroke:' + TUBO + ';stroke-width:1.4' }, g0);
    lbl(g0, 538, 132, 'coanócito'); tx(538, 150, 'engole a partícula', S.m, g0); tx(538, 166, 'e digere dentro de', S.m, g0); tx(538, 182, 'si: intracelular', S.m, g0);
    /* ---- 1. cnidario ---- */
    var g1 = el('g', {}); P.push(g1);
    p('M262 226 C252 180 252 120 270 92 L282 92 C270 120 270 180 280 214 L324 214 C334 180 334 120 322 92 L334 92 C352 120 352 180 342 226 Z', 'fill:' + ECT + ';stroke:#9c5a3c;stroke-width:1.5', g1);
    p('M282 92 C270 120 270 180 280 214 L324 214 C334 180 334 120 322 92 L314 92 C324 122 324 178 316 204 L288 204 C280 178 280 122 290 92 Z', 'fill:' + END + ';stroke:#5c7f43;stroke-width:1.2', g1);
    p('M270 92 C258 72 250 60 238 52 M280 92 C276 70 272 56 268 40 M324 92 C328 70 332 56 336 40 M334 92 C346 72 354 60 366 52', 'fill:none;stroke:#9c5a3c;stroke-width:5;stroke-linecap:round', g1);
    el('ellipse', { cx: 302, cy: 160, rx: 10, ry: 7, style: 'fill:#b8613b' }, g1);
    var enz = []; for (var i = 0; i < 10; i++) enz.push(el('circle', { r: 2.6, style: 'fill:#4a7a2a' }, g1));
    lbl(g1, 302, 76, 'boca', null, 'middle');
    p('M316 150 H380', 'stroke:var(--lapis);stroke-width:1', g1); lbl(g1, 384, 150, 'cavidade gastrovascular'); tx(384, 166, 'uma só abertura (a boca);', S.m, g1); tx(384, 182, 'enzimas lançadas na cavidade', S.m, g1); tx(384, 198, 'quebram a presa: digestão', S.m, g1); tx(384, 214, 'EXTRACELULAR', 'font-size:13px;font-weight:700;fill:#4a7a2a', g1);
    p('M362 52 L384 46', 'stroke:var(--lapis);stroke-width:1', g1); lbl(g1, 388, 42, 'tentáculos com cnidócitos'); tx(388, 58, '(exclusivos dos cnidários)', S.m, g1);
    /* simetria radial (vista de cima) */
    el('circle', { cx: 580, cy: 100, r: 20, style: 'fill:' + ECT + ';stroke:#9c5a3c;stroke-width:1.4' }, g1);
    for (i = 0; i < 4; i++) { var an = i * Math.PI / 4; p('M' + (580 - 28 * Math.cos(an)).toFixed(1) + ' ' + (100 - 28 * Math.sin(an)).toFixed(1) + ' L' + (580 + 28 * Math.cos(an)).toFixed(1) + ' ' + (100 + 28 * Math.sin(an)).toFixed(1), 'stroke:var(--tinta);stroke-width:1.2;stroke-dasharray:3 3', g1); }
    lbl(g1, 540, 104, 'simetria radial', null, 'end'); tx(540, 120, '(vista de cima)', S.m + ';text-anchor:end', g1);
    /* ---- 2. planaria ---- */
    var g2 = el('g', {}); P.push(g2);
    var corpo = 'M330 40 C346 40 352 52 368 50 C360 62 356 70 356 84 C360 130 360 180 330 226 C300 180 300 130 304 84 C304 70 300 62 292 50 C308 52 314 40 330 40 Z';
    p(corpo, 'fill:#cfc3b3;stroke:#7d6b55;stroke-width:1.8', g2);
    p('M330 120 V170', 'stroke:#7d6b55;stroke-width:6;stroke-linecap:round', g2);
    p('M330 120 V78', 'fill:none;stroke:' + TUBO + ';stroke-width:5', g2);
    p('M330 170 C318 180 316 200 320 214 M330 170 C342 180 344 200 340 214', 'fill:none;stroke:' + TUBO + ';stroke-width:3', g2);
    el('circle', { cx: 321, cy: 64, r: 4, style: 'fill:#222' }, g2); el('circle', { cx: 339, cy: 64, r: 4, style: 'fill:#222' }, g2);
    el('ellipse', { cx: 324, cy: 76, rx: 5, ry: 4, style: 'fill:' + NERV }, g2); el('ellipse', { cx: 336, cy: 76, rx: 5, ry: 4, style: 'fill:' + NERV }, g2);
    p('M322 80 C314 120 314 180 324 216 M338 80 C346 120 346 180 336 216', 'fill:none;stroke:' + NERV + ';stroke-width:1.6', g2);
    p('M330 20 V244', 'stroke:#d0452f;stroke-width:1.6;stroke-dasharray:6 4', g2);
    p('M345 64 H392', 'stroke:var(--lapis);stroke-width:1', g2); lbl(g2, 396, 58, 'cabeça: ocelos + gânglios'); tx(396, 74, 'cerebroides = cefalização', S.m, g2);
    lbl(g2, 396, 120, 'um só plano de simetria:', '#d0452f'); tx(396, 136, 'lado direito = lado esquerdo', S.m, g2); tx(396, 152, '= simetria BILATERAL', 'font-size:13px;font-weight:700;fill:#d0452f', g2);
    p('M335 160 L392 186', 'stroke:var(--lapis);stroke-width:1', g2); lbl(g2, 396, 190, 'faringe: boca, sem ânus'); tx(396, 206, '3 folhetos, sem celoma', S.m, g2); tx(396, 222, '(triblástico acelomado)', S.m, g2);
    /* ---- 3. nematodeo ---- */
    var g3 = el('g', {}); P.push(g3);
    p('M236 96 C236 82 250 78 270 78 L560 82 C590 84 606 92 618 100 C604 104 590 112 560 114 L270 118 C250 118 236 110 236 96 Z', 'fill:#efe2cf;stroke:#9a8466;stroke-width:1.8', g3);
    p('M240 97 L560 99 L590 106', 'fill:none;stroke:' + TUBO + ';stroke-width:5;stroke-linecap:round', g3);
    var com3 = []; for (i = 0; i < 5; i++) com3.push(el('circle', { r: 3.5, style: 'fill:#7a4f0c' }, g3));
    lbl(g3, 236, 66, 'boca'); lbl(g3, 596, 132, 'ânus', null, 'middle');
    p('M590 108 L594 120', 'stroke:var(--lapis);stroke-width:1', g3);
    lbl(g3, 330, 146, 'tubo digestório COMPLETO:', TUBO); tx(330, 162, 'o alimento entra pela boca e sai pelo ânus', S.m, g3);
    /* corte transversal */
    el('circle', { cx: 290, cy: 200, r: 34, style: 'fill:#efe2cf;stroke:#9a8466;stroke-width:2' }, g3);
    el('circle', { cx: 290, cy: 200, r: 27, style: 'fill:#f8f3ea;stroke:#c9b48f;stroke-width:1' }, g3);
    el('circle', { cx: 290, cy: 200, r: 9, style: 'fill:' + TUBO }, g3);
    p('M326 200 H360', 'stroke:var(--lapis);stroke-width:1', g3); lbl(g3, 364, 196, 'corte: cavidade entre parede e'); tx(364, 212, 'intestino, sem forro completo de', S.m, g3); tx(364, 228, 'mesoderme = pseudoceloma', S.m, g3);
    /* ---- 4. anelideo ---- */
    var g4 = el('g', {}); P.push(g4);
    p('M236 70 C236 54 252 50 270 50 L580 50 C600 50 614 58 614 70 C614 82 600 90 580 90 L270 90 C252 90 236 86 236 70 Z', 'fill:#d98a8a;stroke:#9c4a4a;stroke-width:1.8', g4);
    var segd = ''; for (var x = 262; x < 600; x += 16) segd += 'M' + x + ' 52 V88 ';
    p(segd, 'stroke:#9c4a4a;stroke-width:1.2', g4);
    lbl(g4, 236, 40, 'metâmeros: anéis que se repetem por fora e por dentro');
    /* corte longitudinal: septos, celoma, intestino */
    el('rect', { x: 236, y: 112, width: 300, height: 66, rx: 10, style: 'fill:' + MES + ';opacity:.85' }, g4);
    var cel = ''; for (x = 242; x < 530; x += 48) cel += 'M' + (x + 4) + ' 118 h40 v54 h-40 Z ';
    p(cel, 'fill:#f7e1e6;stroke:' + MES + ';stroke-width:1', g4);
    p('M236 145 H536', 'stroke:' + TUBO + ';stroke-width:8', g4);
    p('M508 132 H552', 'stroke:var(--tinta);stroke-width:1', g4); lbl(g4, 556, 136, 'celoma', MES);
    p('M482 168 C500 186 530 172 552 168', 'fill:none;stroke:var(--tinta);stroke-width:1', g4); lbl(g4, 556, 172, 'septo', MES);
    lbl(g4, 236, 202, 'celoma verdadeiro: cavidade toda forrada', MES); tx(236, 220, 'por mesoderme, repetida em cada metâmero', S.m, g4);
    /* ---- 5. artropode: antenas ---- */
    var g5 = el('g', {}); P.push(g5);
    function cabeca(pai, cx, cy, cor) { el('ellipse', { cx: cx, cy: cy, rx: 24, ry: 18, style: 'fill:' + cor + ';stroke:#5a4630;stroke-width:1.6' }, pai); el('circle', { cx: cx - 9, cy: cy - 6, r: 3.5, style: 'fill:#222' }, pai); el('circle', { cx: cx + 9, cy: cy - 6, r: 3.5, style: 'fill:#222' }, pai); }
    /* crustaceo */
    cabeca(g5, 290, 140, '#e48a5a');
    p('M282 124 C270 96 250 80 236 70 M298 124 C310 96 330 80 344 70', 'fill:none;stroke:#b0552b;stroke-width:2.6;stroke-linecap:round', g5);
    p('M286 124 C282 110 276 104 268 98 M294 124 C298 110 304 104 312 98', 'fill:none;stroke:#7a3412;stroke-width:3.4;stroke-linecap:round', g5);
    lbl(g5, 290, 180, 'crustáceo', null, 'middle'); tx(290, 197, '2 pares', 'font-size:15px;font-weight:700;fill:var(--ad-t);text-anchor:middle', g5);
    tx(290, 214, 'antênulas e', S.m + ';text-anchor:middle', g5); tx(290, 228, 'antenas', S.m + ';text-anchor:middle', g5);
    /* inseto */
    cabeca(g5, 440, 140, '#8a6a3c');
    p('M432 124 C424 104 414 92 400 82 M448 124 C456 104 466 92 480 82', 'fill:none;stroke:#5a4630;stroke-width:2.6;stroke-linecap:round', g5);
    lbl(g5, 440, 180, 'inseto', null, 'middle'); tx(440, 197, '1 par', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g5);
    tx(440, 214, '(e diplópode,', S.m + ';text-anchor:middle', g5); tx(440, 228, 'quilópode)', S.m + ';text-anchor:middle', g5);
    /* aracnideo */
    cabeca(g5, 576, 140, '#5d5d5d');
    p('M568 156 l-4 12 M584 156 l4 12', 'stroke:#333;stroke-width:3;stroke-linecap:round', g5);
    lbl(g5, 576, 180, 'aracnídeo', null, 'middle'); tx(576, 197, 'nenhuma', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g5);
    tx(576, 214, 'tem quelíceras', S.m + ';text-anchor:middle', g5);
    lbl(g5, 236, 36, 'Todos: exoesqueleto de quitina, patas articuladas,');
    tx(236, 54, 'triblásticos, celomados, protostômios, simetria bilateral', S.m, g5);

    var TXT = [
      ['Poríferos: o ponto de partida', 'A esponja não tem tecidos verdadeiros nem simetria definida.', 'A água entra pelos poros; cada coanócito captura e digere', 'sua partícula dentro de si: digestão só intracelular.'],
      ['Cnidários: a digestão vai para uma cavidade', 'Água-viva, hidra, coral: simetria radial e uma cavidade com', 'uma só abertura. Enzimas na cavidade = digestão extracelular,', 'que os grupos seguintes mantêm. O cnidócito ficou só neles.'],
      ['Platelmintos: frente, trás e cabeça', 'A planária tem um único plano de simetria (bilateral) e', 'concentra ocelos e gânglios na frente: cefalização. São os', 'primeiros nessa escada com isso. 3 folhetos, sem celoma.'],
      ['Nematódeos: tubo com duas aberturas', 'A lombriga tem boca numa ponta e ânus na outra: tubo', 'digestório completo, o alimento anda num só sentido.', 'A cavidade do corpo é um pseudoceloma.'],
      ['Anelídeos: celoma e metameria', 'Minhoca e sanguessuga: corpo em anéis repetidos', '(metâmeros) e celoma verdadeiro, forrado por mesoderme.', 'Triblásticos e bilaterais, como os grupos depois deles.'],
      ['Artrópodes: armadura e patas articuladas', 'Exoesqueleto de quitina e apêndices articulados. Simetria', 'sempre bilateral. As antenas separam os grupos: crustáceo 2', 'pares; inseto, diplópode e quilópode 1 par; aracnídeo, nenhuma.']
    ];
    var T0 = [0, 3.5, 7, 10.5, 14, 17.5];
    return fimResposta(VIS.def['novidades-invertebrados'], svg, function (t) {
      var k = 0; for (var j = 0; j < 6; j++) if (t >= T0[j]) k = j;
      var u = t - T0[k];
      LAD.forEach(function (L, i) {
        vis(L.g, i <= k ? (i === k ? cl(u / .35) : 1) : .18);
        L.bx.setAttribute('style', i === k ? 'fill:color-mix(in srgb,var(--ad-c) 12%,var(--folha));stroke:var(--ad-c);stroke-width:2.2' : 'fill:var(--folha);stroke:var(--linha);stroke-width:1.4');
      });
      P.forEach(function (g, i) { vis(g, i === k ? cl(u / .35) : 0); });
      tT.textContent = TXT[k][0]; t1.textContent = TXT[k][1]; t2.textContent = TXT[k][2]; t3.textContent = TXT[k][3];
      if (k === 1) enz.forEach(function (e, i) {
        var a = i / 10 * 2 * Math.PI, w = cl((u - .3 - i * .05) / 1.4), rr = 36 - 26 * w;
        e.setAttribute('cx', (302 + rr * .55 * Math.cos(a)).toFixed(1)); e.setAttribute('cy', (160 + rr * Math.sin(a)).toFixed(1)); vis(e, u > .3 ? 1 : 0);
      });
      if (k === 3) com3.forEach(function (c, i) {
        var w = ((u * .5 + i * .2) % 1); c.setAttribute('cx', (248 + 330 * w).toFixed(1)); c.setAttribute('cy', (97 + 2 * w).toFixed(1));
      });
    }, 21, RESP, qid, {
      congela: function (q) { return { W9d3805e: 10.4, W6e5a18e: 6.9, W76ebdba: 17.4, Wbad6f63: 20.9, Wf0f72e8: 20.9 }[q] || 20.9; },
      semEsmaecer: true, x: 214, y: 240, w: 420, h: 106
    });
  }
};
VIS.liga('novidades-invertebrados', ['W9d3805e', 'W6e5a18e', 'W76ebdba', 'Wbad6f63', 'Wf0f72e8']);
