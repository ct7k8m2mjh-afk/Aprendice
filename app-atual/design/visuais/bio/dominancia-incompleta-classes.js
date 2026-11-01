/* Dominancia incompleta (1:2:1, 3 fenotipos) x dominancia completa (3:1, 2 fenotipos) e o numero
   de classes fenotipicas da F2 com dois genes independentes (3 x 2 = 6). Questao Pe07eea7 (Santa Casa). */
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
  'Pe07eea7': [
    'Por isso a resposta é D',
    'Raiz (dominância incompleta): 3 fenótipos. Flor (completa): 2.',
    'Genes independentes: 3 × 2 = 6 classes fenotípicas em F2.'
  ]
};
VIS.def['dominancia-incompleta-classes'] = {
  tit: 'Dominância incompleta: 3 fenótipos; completa: 2; juntos, 3 × 2 = 6',
  fontes: [
    'OpenStax, Biology 2e, 12.2 Characteristics and Traits (dominância incompleta 1:2:1; segregação independente) — https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits',
    'OpenStax, Biology 2e, 12.3 Laws of Inheritance (cruzamento di-híbrido, regra do produto) — https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance',
    'Khan Academy, Variations on Mendel\'s laws (incomplete dominance) — https://www.khanacademy.org/science/ap-biology/heredity/non-mendelian-genetics/a/variations-on-mendels-laws-overview'
  ],
  tipo: 'anim', dur: 18.6,
  marcas: [[0, 'Pais e F1'], [3.6, 'Raiz'], [7.6, 'Flor'], [11.6, 'Juntando'], [15.4, 'Erros']],
  cred: 'Animação feita para o app (esquema). Alelos como no enunciado: L e R (forma da raiz, dominância incompleta); P e p (cor da flor, P dominante).',
  nota: 'Conte um gene de cada vez: na dominância incompleta cada genótipo tem aparência própria (3 fenótipos); na completa o heterozigoto fica igual ao dominante (2 fenótipos). Genes independentes: multiplique.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var RAB = '#c23b5f', ROXO = '#7a4fa8', FOL = '#4f8a3c';
    var S = { tit: 'font-size:19px;font-weight:700;fill:var(--tinta)', l: 'font-size:14px;fill:var(--tinta)', b: 'font-size:14px;font-weight:700;fill:var(--tinta)', g: 'font-size:15px;font-weight:700;fill:var(--tinta)', m: 'font-size:13px;fill:var(--lapis)' };
    /* rabanete: forma 'L' (longo), 'O' (oval), 'R' (redondo); (cx, cy) = topo da raiz */
    function rabanete(pai, cx, cy, f, s) {
      var g = el('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + s + ')' }, pai);
      el('path', { d: 'M0 2 C-4 -14 -16 -26 -20 -36 C-10 -34 -3 -22 0 -6 Z', style: 'fill:' + FOL }, g);
      el('path', { d: 'M0 2 C4 -14 16 -26 20 -36 C10 -34 3 -22 0 -6 Z', style: 'fill:' + FOL }, g);
      var d;
      if (f === 'L') d = 'M-9 0 C-11 22 -6 48 0 66 C6 48 11 22 9 0 Z';
      else if (f === 'O') d = 'M0 0 C-17 0 -19 18 -15 30 C-11 40 -5 44 0 46 C5 44 11 40 15 30 C19 18 17 0 0 0 Z';
      else d = 'M0 0 C-19 0 -21 14 -20 20 C-19 30 -10 36 0 36 C10 36 19 30 20 20 C21 14 19 0 0 0 Z';
      el('path', { d: d, style: 'fill:' + RAB + ';stroke:#8e2342;stroke-width:1.3' }, g);
      var tip = f === 'L' ? 66 : f === 'O' ? 46 : 36;
      el('path', { d: 'M0 ' + (tip - 2) + ' L0 ' + (tip + 12), style: 'stroke:#d8c7b5;stroke-width:1.6;fill:none' }, g);
      return g;
    }
    function flor(pai, cx, cy, roxa, s) {
      var g = el('g', { transform: 'translate(' + cx + ' ' + cy + ') scale(' + s + ')' }, pai);
      for (var i = 0; i < 5; i++) {
        var a = i * 72 * Math.PI / 180;
        el('ellipse', { cx: (8 * Math.sin(a)).toFixed(2), cy: (-8 * Math.cos(a)).toFixed(2), rx: 6, ry: 8, transform: 'rotate(' + (i * 72) + ' ' + (8 * Math.sin(a)).toFixed(2) + ' ' + (-8 * Math.cos(a)).toFixed(2) + ')', style: roxa ? 'fill:' + ROXO + ';stroke:#523077;stroke-width:1' : 'fill:#fbfaf6;stroke:#9b9483;stroke-width:1.2' }, g);
      }
      el('circle', { r: 3.6, style: 'fill:#e3b23c' }, g);
      return g;
    }
    /* texto da direita */
    var TX = 438, tT = tx(TX, 40, '', S.tit), tL = [];
    for (var i = 0; i < 9; i++) tL.push(tx(TX, 70 + i * 21, '', S.l));
    el('line', { x1: 424, x2: 424, y1: 20, y2: 330, style: 'stroke:var(--linha);stroke-width:1.2' });

    /* ===== etapa 1: pais e F1 ===== */
    var G1 = el('g', {});
    rabanete(G1, 78, 66, 'R', 1.15); flor(G1, 128, 52, true, 1.1);
    tx(103, 148, 'RR PP', S.g + ';text-anchor:middle', G1); tx(103, 166, 'redondo, roxa', S.m + ';text-anchor:middle', G1);
    tx(103, 184, 'pura', S.m + ';text-anchor:middle', G1);
    tx(205, 100, '×', 'font-size:30px;fill:var(--lapis);text-anchor:middle', G1);
    rabanete(G1, 282, 56, 'L', 1.15); flor(G1, 332, 52, false, 1.1);
    tx(307, 148, 'LL pp', S.g + ';text-anchor:middle', G1); tx(307, 166, 'longo, branca', S.m + ';text-anchor:middle', G1);
    tx(307, 184, 'pura', S.m + ';text-anchor:middle', G1);
    var a1 = el('path', { d: 'M205 128 V214 m-7 -9 l7 9 l7 -9', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, G1);
    tx(216, 176, 'F1', S.b, G1);
    var F1 = el('g', {}, G1);
    rabanete(F1, 180, 250, 'O', 1.1); flor(F1, 228, 246, true, 1.1);
    tx(258, 270, 'LR Pp', S.g, F1); tx(258, 289, 'oval, roxa', S.m, F1);

    /* ===== quadro 2x2 generico ===== */
    function quadro(pai, x0, y0, gam, cel) {
      var W = 74, H = 60;
      tx(x0 + W / 2, y0 - 10, gam[0], S.g + ';text-anchor:middle', pai); tx(x0 + W * 1.5, y0 - 10, gam[1], S.g + ';text-anchor:middle', pai);
      tx(x0 - 14, y0 + H / 2 + 5, gam[0], S.g + ';text-anchor:middle', pai); tx(x0 - 14, y0 + H * 1.5 + 5, gam[1], S.g + ';text-anchor:middle', pai);
      var cs = [];
      for (var r = 0; r < 2; r++) for (var c = 0; c < 2; c++) {
        var g = el('g', {}, pai);
        el('rect', { x: x0 + c * W, y: y0 + r * H, width: W, height: H, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, g);
        cel(g, x0 + c * W, y0 + r * H, W, H, r, c);
        cs.push(g);
      }
      return cs;
    }
    /* ===== etapa 2: gene da raiz ===== */
    var G2 = el('g', {});
    tx(30, 42, 'F1 × F1:  LR × LR', S.b, G2);
    var GEN = [['LL', 'LR'], ['LR', 'RR']];
    var c2 = quadro(G2, 60, 84, ['L', 'R'], function (g, x, y, W, H, r, c) {
      var gt = GEN[r][c], f = gt === 'LL' ? 'L' : gt === 'RR' ? 'R' : 'O';
      rabanete(g, x + 20, y + 19, f, f === 'L' ? .5 : .62);
      tx(x + 36, y + 36, gt, S.b, g);
    });
    tx(60, 226, 'gametas de cada F1: L ou R', S.m, G2);
    var res2 = [['L', '1 LL', 'longo', 250], ['O', '2 LR', 'oval', 310], ['R', '1 RR', 'redondo', 372]];
    var R2g = res2.map(function (k) { var g = el('g', {}, G2); rabanete(g, k[3], 96, k[0], .8); tx(k[3], 172, k[1], S.b + ';text-anchor:middle', g); tx(k[3], 190, k[2], S.m + ';text-anchor:middle', g); return g; });
    var R2t = tx(310, 226, '3 fenótipos', 'font-size:16px;font-weight:700;fill:' + RAB + ';text-anchor:middle', G2);
    var R2u = tx(310, 246, '1 : 2 : 1', S.m + ';text-anchor:middle', G2);

    /* ===== etapa 3: gene da flor ===== */
    var G3 = el('g', {});
    tx(30, 42, 'F1 × F1:  Pp × Pp', S.b, G3);
    var GF = [['PP', 'Pp'], ['Pp', 'pp']];
    var c3 = quadro(G3, 60, 84, ['P', 'p'], function (g, x, y, W, H, r, c) {
      var gt = GF[r][c]; flor(g, x + 20, y + 30, gt !== 'pp', .9); tx(x + 36, y + 36, gt, S.b, g);
    });
    tx(60, 226, 'gametas de cada F1: P ou p', S.m, G3);
    var R3g = [[true, '3 roxas', 'PP ou Pp', 270], [false, '1 branca', 'pp', 360]].map(function (k) {
      var g = el('g', {}, G3); flor(g, k[3], 120, k[0], 1.4); tx(k[3], 172, k[1], S.b + ';text-anchor:middle', g); tx(k[3], 190, k[2], S.m + ';text-anchor:middle', g); return g;
    });
    var R3t = tx(315, 226, '2 fenótipos', 'font-size:16px;font-weight:700;fill:' + ROXO + ';text-anchor:middle', G3);
    var R3u = tx(315, 246, '3 : 1', S.m + ';text-anchor:middle', G3);

    /* ===== etapa 4: grade 3 x 2 ===== */
    var G4 = el('g', {});
    var gx = 92, gy = 70, CW = 106, CH = 64;
    var col = [['L', 'longo', '1/4'], ['O', 'oval', '2/4'], ['R', 'redondo', '1/4']], lin = [[true, 'roxa', '3/4'], [false, 'branca', '1/4']];
    col.forEach(function (k, i) { tx(gx + CW * i + CW / 2, gy - 28, k[1], S.b + ';text-anchor:middle', G4); tx(gx + CW * i + CW / 2, gy - 10, k[2], S.m + ';text-anchor:middle', G4); });
    lin.forEach(function (k, j) { tx(gx - 10, gy + CH * j + 30, k[1], S.b + ';text-anchor:end', G4); tx(gx - 10, gy + CH * j + 48, k[2], S.m + ';text-anchor:end', G4); });
    var FR = [['3/16', '6/16', '3/16'], ['1/16', '2/16', '1/16']], cel4 = [];
    for (var j = 0; j < 2; j++) for (i = 0; i < 3; i++) {
      var g = el('g', {}, G4), x = gx + CW * i, y = gy + CH * j;
      el('rect', { x: x, y: y, width: CW, height: CH, style: 'fill:color-mix(in srgb,var(--ad-c) 7%,var(--folha));stroke:var(--linha);stroke-width:1.5' }, g);
      rabanete(g, x + 24, y + 18, col[i][0], col[i][0] === 'L' ? .5 : .6); flor(g, x + 46, y + 22, lin[j][0], .75);
      tx(x + 64, y + 40, FR[j][i], S.b, g);
      var nm = tx(x + 6, y + CH - 6, '', 'font-size:13px;font-weight:700;fill:var(--ad-t)', g); nm.textContent = String(j * 3 + i + 1);
      cel4.push(g);
    }
    var tot = tx(gx + CW * 1.5, gy + CH * 2 + 32, 'soma: 16/16', S.m + ';text-anchor:middle', G4);
    var big = tx(gx + CW * 1.5, gy + CH * 2 + 62, '3 formas × 2 cores = 6 classes', 'font-size:18px;font-weight:700;fill:var(--ad-t);text-anchor:middle', G4);

    /* ===== etapa 5: armadilhas ===== */
    var G5 = el('g', {});
    var ARM = [
      ['6', 'raiz incompleta (3) × flor completa (2)', 'é este o caso', true],
      ['4', 'se as duas fossem de dominância completa', '2 × 2 (o clássico 9:3:3:1)', false],
      ['9', 'se as duas fossem de dominância incompleta', '3 × 3 (= nº de genótipos)', false],
      ['16', 'casas do quadro de gametas (4 × 4)', 'não são classes de fenótipo', false]
    ];
    var A5 = ARM.map(function (k, i) {
      var g = el('g', {}, G5), y = 36 + i * 74;
      el('rect', { x: 18, y: y, width: 392, height: 62, rx: 10, style: 'fill:' + (k[3] ? 'color-mix(in srgb,var(--ad-c) 14%,var(--folha))' : 'var(--folha)') + ';stroke:' + (k[3] ? 'var(--ad-c)' : 'var(--linha)') + ';stroke-width:' + (k[3] ? 2 : 1.4) }, g);
      tx(60, y + 41, k[0], 'font-size:26px;font-weight:700;text-anchor:middle;fill:' + (k[3] ? 'var(--ad-t)' : 'var(--lapis)'), g);
      tx(100, y + 26, k[1], S.b, g); tx(100, y + 46, k[2], S.m, g);
      return g;
    });

    var TXT = [
      ['Pais puros e F1', 'Cada pai puro só faz um tipo', 'de gameta: RP e Lp.', 'Toda a F1 é LR Pp.', '', 'Raiz oval: o heterozigoto', 'LR tem aparência própria,', 'entre longo e redondo:', 'dominância incompleta.'],
      ['Gene da raiz', 'LR × LR dá 1 LL : 2 LR : 1 RR.', '', 'Na dominância incompleta cada', 'genótipo tem a sua aparência:', 'longo, oval e redondo.', '', '3 genótipos = 3 fenótipos.'],
      ['Gene da flor', 'Pp × Pp dá 1 PP : 2 Pp : 1 pp.', '', 'Na dominância completa o Pp', 'fica igual ao PP: roxo.', 'Só o pp é branco.', '', '3 genótipos, mas só 2 fenótipos.'],
      ['Juntando os dois', 'Os genes segregam de forma', 'independente: qualquer forma', 'pode vir com qualquer cor.', '', 'Classes = 3 × 2 = 6.', 'Proporção: 3 : 6 : 3 : 1 : 2 : 1', '(em dezesseis avos).'],
      ['Onde a prova engana', 'As outras alternativas são', 'contas de outros casos.', '', 'Conte as aparências de cada', 'gene e multiplique: só', 'o 6 serve para este cruzamento.']
    ];
    var T = [0, 3.6, 7.6, 11.6, 15.4, 18.6];
    return fimResposta(VIS.def['dominancia-incompleta-classes'], svg, function (t) {
      var k = t < 3.6 ? 0 : t < 7.6 ? 1 : t < 11.6 ? 2 : t < 15.4 ? 3 : 4, u = t - T[k];
      tT.textContent = TXT[k][0];
      tL.forEach(function (e, i) { var s = TXT[k][i + 1] || ''; e.textContent = s; e.style.fontWeight = /= 6|3 × 2|só 2|= 3 fen/.test(s) ? '700' : '400'; });
      vis(G1, k === 0 ? 1 : 0); vis(F1, cl((u - .9) / .5)); vis(a1, cl((u - .4) / .5));
      vis(G2, k === 1 ? 1 : 0); vis(G3, k === 2 ? 1 : 0); vis(G4, k === 3 ? 1 : 0); vis(G5, k === 4 ? 1 : 0);
      if (k === 1) {
        c2.forEach(function (c, i) { vis(c, cl((u - .2 - i * .3) / .3)); });
        R2g.forEach(function (c, i) { vis(c, cl((u - 1.6 - i * .2) / .3)); }); vis(R2t, cl((u - 2.3) / .3)); vis(R2u, cl((u - 2.3) / .3));
      }
      if (k === 2) {
        c3.forEach(function (c, i) { vis(c, cl((u - .2 - i * .3) / .3)); });
        R3g.forEach(function (c, i) { vis(c, cl((u - 1.6 - i * .25) / .3)); }); vis(R3t, cl((u - 2.3) / .3)); vis(R3u, cl((u - 2.3) / .3));
      }
      if (k === 3) { cel4.forEach(function (c, i) { vis(c, cl((u - .2 - i * .25) / .25)); }); vis(tot, cl((u - 1.8) / .3)); vis(big, cl((u - 2.1) / .3)); }
      if (k === 4) A5.forEach(function (c, i) { vis(c, cl((u - .1 - i * .3) / .3)); });
    }, 18.6, RESP, qid, { congela: function () { return 15.2; }, semEsmaecer: true, x: 14, y: 240, w: 612, h: 104 });
  }
};
VIS.liga('dominancia-incompleta-classes', ['Pe07eea7']);
