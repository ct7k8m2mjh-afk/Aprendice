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
'P2e8e8c0': [
'Por isso a resposta é B',
'O OH do THC está preso a um carbono do anel aromático: fenol.',
'O outro oxigênio fica entre dois carbonos, sem C=O ao lado: éter.',
'Não há OH em carbono saturado (álcool) nem C=O (éster).'
],
'Pb089f1e': [
'Por isso a resposta é D',
'Além dos OH no anel (fenol), a fenolftaleína tem C(=O)–O–C',
'fechado num anel de cinco: é um éster cíclico (lactona).'
],
'W764f7ec': [
'Por isso a resposta é B',
'CO₂H = C(=O)–OH: ácido carboxílico. OCH₃ no anel: O entre dois',
'carbonos, sem C=O ao lado: éter. Os Cl são haleto (sem oxigênio).'
],
'P1584df6': [
'Por isso a resposta é A',
'Os OH estão em carbonos saturados (o anel não é aromático): álcool.',
'O O do anel fica entre dois carbonos: éter. O NH₂ sem C=O: amina.',
'Não há C=O: nada de éster, amida, cetona ou aldeído.'
],
'P5079713': [
'Por isso a resposta é B',
'C(=O)–O–CH₃: éster. N com dois CH₃ e o anel, sem C=O: amina.',
'N ligado direto a um C=O: amida.'
],
'P561437c': [
'Por isso a resposta é C',
'O N do ibandronato está ligado só a carbonos (CH₃ e duas cadeias),',
'sem C=O ao lado e sem tripla C≡N: é amina (terciária).'
],
'P9e72547': [
'Por isso a resposta é E',
'R–CH(NH₂)–COOH: o NH₂ preso a carbono saturado, sem C=O vizinho,',
'é amina; C(=O)–OH é ácido carboxílico. X é um aminoácido.'
],
'Pb30a68b': [
'Por isso a resposta é C',
'I marca só o C=O: o grupo é carbonila (a função ali seria amida).',
'II é um N do anel ligado só a carbonos, sem C=O ao lado:',
'a prova o classifica como amina.'
],
'W7a0216e': [
'Por isso a resposta é E',
'C(=O)–O–CH₃: éster. NH ligado ao C=O: amida. NH₂ sem C=O: amina.',
'C(=O)–OH: ácido carboxílico. Não há éter, cetona nem aldeído.'
]
};
VIS.def['funcoes-organicas-reconhecimento'] = {
  tit: 'Reconhecer funções orgânicas: olhe os vizinhos',
  fontes: ['OpenStax, Chemistry 2e, 20.2 Alcohols and Ethers — https://openstax.org/books/chemistry-2e/pages/20-2-alcohols-and-ethers', 'OpenStax, Chemistry 2e, 20.3 Aldehydes, Ketones, Carboxylic Acids, and Esters — https://openstax.org/books/chemistry-2e/pages/20-3-aldehydes-ketones-carboxylic-acids-and-esters', 'OpenStax, Chemistry 2e, 20.4 Amines and Amides — https://openstax.org/books/chemistry-2e/pages/20-4-amines-and-amides', 'IUPAC Gold Book, phenols; lactones; amides — https://goldbook.iupac.org/terms/view/P04539'],
  tipo: 'anim', dur: 16,
  marcas: [[0, 'OH'], [3.2, 'O e C=O'], [6.4, 'Nitrogênio'], [9.6, 'Regras'], [12.8, 'Fármacos']],
  cred: 'Animação feita para o app. Fórmulas de linhas com ângulos de 120° e anéis regulares; cada ponta ou vértice sem letra é um carbono.',
  nota: 'A função é decidida pelos vizinhos do heteroátomo: o mesmo OH é álcool num carbono saturado e fenol num anel aromático; o mesmo O entre carbonos é éter sem C=O ao lado e éster com C=O; o mesmo N é amina sem C=O e amida com C=O.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var L = 30, R3 = Math.PI / 180;
    var COR = { alc: '#2b6cb0', fen: '#7a4fa0', eno: '#2e8b57', ete: '#c97a1a', est: '#c0392b', aci: '#b03a7a', cet: '#5a6f2a', ami: '#1f7a8c', amd: '#8a5a1a', hal: '#6d737a' };
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3.2;
    function P(p, ang, l) { return [p[0] + (l || L) * Math.cos(ang * R3), p[1] + (l || L) * Math.sin(ang * R3)]; }
    /* desenha molecula: A = [[x,y,'rotulo'], ...], B = [[i,j,ordem,centroDoAnel?], ...] */
    function mol(pai, A, B) {
      var g = el('g', {}, pai);
      B.forEach(function (b) {
        var a = A[b[0]], c = A[b[1]], dx = c[0] - a[0], dy = c[1] - a[1], d = Math.sqrt(dx * dx + dy * dy), ux = dx / d, uy = dy / d;
        var s0 = a[2] ? 9 : 0, s1 = c[2] ? 9 : 0, x1 = a[0] + ux * s0, y1 = a[1] + uy * s0, x2 = c[0] - ux * s1, y2 = c[1] - uy * s1;
        var st = 'stroke:var(--tinta);stroke-width:1.8;stroke-linecap:round';
        if (b[2] === 2 && b[3]) {   /* dupla dentro do anel: linha interna mais curta */
          el('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: st }, g);
          var nx = -uy, ny = ux, mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2; if ((b[3][0] - mx) * nx + (b[3][1] - my) * ny < 0) { nx = -nx; ny = -ny; }
          el('line', { x1: x1 + nx * 4.5 + ux * 4, y1: y1 + ny * 4.5 + uy * 4, x2: x2 + nx * 4.5 - ux * 4, y2: y2 + ny * 4.5 - uy * 4, style: st }, g);
        } else if (b[2] === 2) {
          el('line', { x1: x1 - uy * 2.6, y1: y1 + ux * 2.6, x2: x2 - uy * 2.6, y2: y2 + ux * 2.6, style: st }, g);
          el('line', { x1: x1 + uy * 2.6, y1: y1 - ux * 2.6, x2: x2 + uy * 2.6, y2: y2 - ux * 2.6, style: st }, g);
        } else el('line', { x1: x1, y1: y1, x2: x2, y2: y2, style: st }, g);
      });
      A.forEach(function (a) { if (a[2]) tx(a[0] + (a[3] || 0), a[1] + 5, a[2], 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g); });
      return g;
    }
    function halo(pai, pts, cor) { var g = el('g', {}, pai); pts.forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 14, style: 'fill:' + cor + ';opacity:.22' }, g); }); return g; }
    function hexa(c, r, ang0) { var v = []; for (var k = 0; k < 6; k++) v.push(P(c, ang0 + 60 * k, r)); return v; }
    function rotulo(pai, x, y, s, cor, s2) { var g = el('g', {}, pai); tx(x, y, s, 'font-size:15px;font-weight:700;fill:' + cor + ';text-anchor:middle', g); if (s2) tx(x, y + 18, s2, 'font-size:14px;fill:var(--tinta);text-anchor:middle', g); return g; }
    /* ===== cena 1: OH ===== */
    var c1 = el('g', {});
    tx(16, 26, 'O–H: quem segura o OH decide', 'font-size:15px;font-weight:700;fill:var(--tinta)', c1);
    var a0 = [70, 120], a1 = P(a0, -30), a2 = P(a1, 30);
    a2.push('OH', 6);
    mol(c1, [a0, a1, a2], [[0, 1, 1], [1, 2, 1]]); halo(c1, [[a2[0], a2[1]]], COR.alc);
    rotulo(c1, 96, 176, 'álcool', COR.alc, 'OH em C saturado');
    var hc = [320, 134], hv = hexa(hc, L, -90), ho = P(hv[0], -90); ho.push('OH');
    mol(c1, hv.concat([ho]), [[0, 1, 2, hc], [1, 2, 1], [2, 3, 2, hc], [3, 4, 1], [4, 5, 2, hc], [5, 0, 1], [0, 6, 1]]); halo(c1, [[ho[0], ho[1]]], COR.fen);
    rotulo(c1, 320, 190, 'fenol', COR.fen, 'OH em C do anel aromático');
    var e0 = [500, 120], e1 = P(e0, -30), e2 = P(e1, 30); e2.push('OH', 6);
    mol(c1, [e0, e1, e2], [[0, 1, 2], [1, 2, 1]]); halo(c1, [[e2[0], e2[1]]], COR.eno);
    rotulo(c1, 526, 176, 'enol', COR.eno, 'OH em C da dupla C=C');
    /* ===== cena 2: O entre carbonos e C=O ===== */
    var c2 = el('g', {});
    tx(16, 26, 'Oxigênio entre carbonos e carbonila (C=O)', 'font-size:15px;font-weight:700;fill:var(--tinta)', c2);
    function zig(x, y, n, up) { var p = [[x, y]]; for (var k = 1; k < n; k++) p.push(P(p[k - 1], (k % 2 ? -30 : 30) * (up ? 1 : -1))); return p; }
    /* eter: C-O-C */
    var t1 = zig(40, 110, 3, true); t1[1].push('O');
    mol(c2, t1, [[0, 1, 1], [1, 2, 1]]); halo(c2, [[t1[1][0], t1[1][1]]], COR.ete); rotulo(c2, 62, 176, 'éter', COR.ete, 'C–O–C');
    /* ester: C-C(=O)-O-C */
    var t2 = zig(140, 110, 4, true), o2 = P(t2[1], -90); t2[2].push('O'); o2.push('O');
    mol(c2, t2.concat([o2]), [[0, 1, 1], [1, 2, 1], [2, 3, 1], [1, 4, 2]]); halo(c2, [[t2[1][0], t2[1][1]], [t2[2][0], t2[2][1]], [o2[0], o2[1]]], COR.est); rotulo(c2, 180, 176, 'éster', COR.est, 'C(=O)–O–C');
    /* lactona: anel de 5 com O e C=O */
    var lc = [300, 116], lv = []; for (var k = 0; k < 5; k++) lv.push(P(lc, -90 + 72 * k, L / (2 * Math.sin(36 * R3))));
    lv[0].push('O'); var lo = P(lv[1], -90 + 72, L); lo.push('O');
    mol(c2, lv.concat([lo]), [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 4, 1], [4, 0, 1], [1, 5, 2]]); halo(c2, [[lv[0][0], lv[0][1]], [lv[1][0], lv[1][1]], [lo[0], lo[1]]], COR.est); rotulo(c2, 300, 176, 'lactona', COR.est, 'éster em anel');
    /* acido carboxilico: C-C(=O)-OH */
    var t4 = zig(395, 110, 3, true), o4 = P(t4[1], -90); t4[2].push('OH', 6); o4.push('O');
    mol(c2, t4.concat([o4]), [[0, 1, 1], [1, 2, 1], [1, 3, 2]]); halo(c2, [[t4[1][0], t4[1][1]], [t4[2][0], t4[2][1]], [o4[0], o4[1]]], COR.aci); rotulo(c2, 420, 176, 'ác. carboxílico', COR.aci, 'C(=O)–OH');
    /* cetona: C-C(=O)-C */
    var t5 = zig(530, 110, 3, true), o5 = P(t5[1], -90); o5.push('O');
    mol(c2, t5.concat([o5]), [[0, 1, 1], [1, 2, 1], [1, 3, 2]]); halo(c2, [[t5[1][0], t5[1][1]], [o5[0], o5[1]]], COR.cet); rotulo(c2, 562, 176, 'cetona', COR.cet, 'C(=O) entre 2 C');
    tx(16, 214, 'aldeído: C(=O)–H na ponta da cadeia', 'font-size:14px;fill:var(--lapis)', c2);
    /* ===== cena 3: nitrogenio e halogenio ===== */
    var c3 = el('g', {});
    tx(16, 26, 'Nitrogênio: tem C=O ao lado ou não?', 'font-size:15px;font-weight:700;fill:var(--tinta)', c3);
    var n1 = zig(40, 110, 3, true); n1[2].push('NH₂', 8);
    mol(c3, n1, [[0, 1, 1], [1, 2, 1]]); halo(c3, [[n1[2][0], n1[2][1]]], COR.ami); rotulo(c3, 70, 176, 'amina', COR.ami, 'N só com C e H');
    var n2 = zig(150, 110, 3, true), on2 = P(n2[1], -90); n2[2].push('NH₂', 8); on2.push('O');
    mol(c3, n2.concat([on2]), [[0, 1, 1], [1, 2, 1], [1, 3, 2]]); halo(c3, [[n2[1][0], n2[1][1]], [n2[2][0], n2[2][1]], [on2[0], on2[1]]], COR.amd); rotulo(c3, 180, 176, 'amida', COR.amd, 'N ligado ao C=O');
    var pc = [350, 120], pv = hexa(pc, L, -90); pv[3].push('N');
    mol(c3, pv, [[0, 1, 2, pc], [1, 2, 1], [2, 3, 2, pc], [3, 4, 1], [4, 5, 2, pc], [5, 0, 1]]); halo(c3, [[pv[3][0], pv[3][1]]], COR.ami);
    rotulo(c3, 350, 176, 'N no anel (piridina)', COR.ami, 'sem C=O: as provas'); tx(350, 212, 'tratam como amina', 'font-size:14px;fill:var(--tinta);text-anchor:middle', c3);
    var h1 = zig(500, 110, 3, true); h1[2].push('Cl', 4);
    mol(c3, h1, [[0, 1, 1], [1, 2, 1]]); halo(c3, [[h1[2][0], h1[2][1]]], COR.hal); rotulo(c3, 530, 176, 'haleto', COR.hal, 'C–F, Cl, Br ou I');
    /* ===== cena 4: regras ===== */
    var c4 = el('g', {});
    var REG = [['C–OH (C saturado)', 'álcool', COR.alc], ['OH no anel aromático', 'fenol', COR.fen], ['OH no C da dupla C=C', 'enol', COR.eno], ['C–O–C, sem C=O ao lado', 'éter', COR.ete], ['C(=O)–O–C', 'éster (em anel: lactona)', COR.est],
      ['C(=O)–OH', 'ácido carboxílico', COR.aci], ['C(=O) entre 2 C  |  C(=O)–H', 'cetona  |  aldeído', COR.cet], ['N com C/H, sem C=O', 'amina', COR.ami], ['N–C(=O)', 'amida', COR.amd]];
    var RG = REG.map(function (r, k) { var g = el('g', {}, c4), y = 30 + 21 * k; tx(16, y, r[0], 'font-size:15px;font-weight:700;fill:var(--tinta)', g); tx(300, y, '→', 'font-size:15px;fill:var(--lapis)', g); tx(326, y, r[1], 'font-size:15px;font-weight:700;fill:' + r[2], g); return g; });
    tx(16, 216, 'Primeiro procure C=O; depois olhe quem está dos dois lados.', 'font-size:14px;fill:var(--lapis)', c4);
    /* ===== cena 5: farmacos ===== */
    var c5 = el('g', {});
    /* paracetamol: HO-anel-NH-C(=O)-CH3, para */
    var qc = [110, 104], qv = hexa(qc, L, 0), qo = P(qv[3], 180); qo.push('HO', -4);
    var qn = P(qv[0], 0); qn.push('N'); var qh = P(qn, 60); qh.push('H');
    var qcc = P(qn, -60), qco = P(qcc, 240), qme = P(qcc, 0); qco.push('O');
    mol(c5, qv.concat([qo, qn, qcc, qco, qme, qh]), [[0, 1, 1], [1, 2, 2, qc], [2, 3, 1], [3, 4, 2, qc], [4, 5, 1], [5, 0, 2, qc], [3, 6, 1], [0, 7, 1], [7, 8, 1], [8, 9, 2], [8, 10, 1], [7, 11, 1]]);
    var hp1 = halo(c5, [[qo[0], qo[1]]], COR.fen), hp2 = halo(c5, [[qn[0], qn[1]], [qcc[0], qcc[1]], [qco[0], qco[1]]], COR.amd);
    tx(110, 30, 'paracetamol', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', c5);
    var tp1 = tx(40, 160, 'fenol', 'font-size:15px;font-weight:700;fill:' + COR.fen + ';text-anchor:middle', c5), tp2 = tx(200, 160, 'amida', 'font-size:15px;font-weight:700;fill:' + COR.amd + ';text-anchor:middle', c5);
    /* AAS: anel com COOH e O-C(=O)-CH3 em orto */
    var sc = [430, 130], sv = hexa(sc, L, 0);
    var sca = P(sv[5], 300), sao = P(sca, 240), sah = P(sca, 0); sao.push('O'); sah.push('OH', 6);
    var seo = P(sv[0], 0), sec = P(seo, 60), seO = P(sec, 0), sem = P(sec, 120); seo.push('O'); seO.push('O');
    mol(c5, sv.concat([sca, sao, sah, seo, sec, seO, sem]), [[0, 1, 2, sc], [1, 2, 1], [2, 3, 2, sc], [3, 4, 1], [4, 5, 2, sc], [5, 0, 1], [5, 6, 1], [6, 7, 2], [6, 8, 1], [0, 9, 1], [9, 10, 1], [10, 11, 2], [10, 12, 1]]);
    var hs1 = halo(c5, [[sca[0], sca[1]], [sao[0], sao[1]], [sah[0], sah[1]]], COR.aci), hs2 = halo(c5, [[seo[0], seo[1]], [sec[0], sec[1]], [seO[0], seO[1]]], COR.est);
    tx(430, 30, 'ácido acetilsalicílico (AAS)', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', c5);
    var ts1 = tx(sah[0] + 22, sah[1] + 5, 'ácido carboxílico', 'font-size:15px;font-weight:700;fill:' + COR.aci, c5), ts2 = tx(seO[0] + 18, seO[1] + 5, 'éster', 'font-size:15px;font-weight:700;fill:' + COR.est, c5);
    /* ===== painel ===== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), PP = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['O mesmo OH, três funções', 'Fórmula de linhas: cada ponta ou vértice sem letra é um carbono.', 'OH num carbono só de ligações simples: álcool. OH preso ao anel', 'aromático (benzênico): fenol. OH num carbono da dupla C=C: enol.'],
      ['Oxigênio entre carbonos: tem C=O do lado?', 'Sem C=O: éter. Com C=O: éster (e, se o éster fecha um anel, lactona).', 'C=O com OH no mesmo carbono: ácido carboxílico.', 'C=O entre dois carbonos: cetona; C=O na ponta, com H: aldeído.'],
      ['Nitrogênio: amina ou amida?', 'N ligado só a carbonos e hidrogênios: amina.', 'N preso ao carbono de um C=O: amida. Um N no anel aromático,', 'sem C=O, é tratado como amina nas provas. C–halogênio: haleto.'],
      ['Regra prática', 'Ache cada heteroátomo (O, N, halogênio) e olhe os vizinhos.', 'Um mesmo trecho pode ter duas leituras: no C=O ligado a N, o grupo', 'é carbonila e a função é amida. Leia o que o enunciado pede.'],
      ['Em fármacos reais', 'Paracetamol: OH no anel (fenol) e NH–C(=O) (amida).', 'AAS: C(=O)–OH (ácido carboxílico) e anel–O–C(=O)–CH₃ (éster).', 'O O do éster está entre dois carbonos, mas tem C=O ao lado: não é éter.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D;
      [c1, c2, c3, c4, c5].forEach(function (c, j) { op(c, i === j ? 1 : 0); });
      RG.forEach(function (g, k) { op(g, i === 3 ? cl((u - .1 - .18 * k) / .25) : 1); });
      [hp1, tp1, hs1, ts1].forEach(function (g) { op(g, i === 4 ? cl((u - .4) / .4) : 1); });
      [hp2, tp2, hs2, ts2].forEach(function (g) { op(g, i === 4 ? cl((u - 1.3) / .4) : 1); });
      var Lx = TXT[i]; p0.textContent = Lx[0]; PP.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CG = { 'P2e8e8c0': 4 * D - .05, 'Pb089f1e': 2 * D - .05, 'W764f7ec': 2 * D - .05, 'P1584df6': 4 * D - .05, 'P5079713': 4 * D - .05, 'P561437c': 3 * D - .05, 'P9e72547': 4 * D - .05, 'Pb30a68b': 3 * D - .05, 'W7a0216e': 4 * D - .05 };
    return fimResposta(VIS.def['funcoes-organicas-reconhecimento'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 5 * D - .05; }
    });
  }
};
VIS.liga('funcoes-organicas-reconhecimento', ['P2e8e8c0', 'Pb089f1e', 'W764f7ec', 'P1584df6', 'P5079713', 'P561437c', 'P9e72547', 'Pb30a68b', 'W7a0216e']);
