/* DNA recombinante: enzima de restricao corta o gene humano e o plasmidio nas mesmas pontas coesivas,
   a ligase une, a bacteria produz insulina humana; heranca do transgene (bipartição x cabra heterozigota)
   e eletroforese em gel. */
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
'P2233a0c': [
'Por isso a resposta é D',
'Cortar o DNA em pontos específicos é o trabalho das endonucleases de restrição;',
'separar os fragmentos por tamanho num gel, com corrente elétrica, é a eletroforese.'
],
'Pf8e8e8f': [
'Por isso a resposta é C',
'A bactéria recebeu o gene: a sequência de DNA que codifica a insulina.',
'Ela transcreve e traduz essa receita e monta a insulina humana.'
],
'P2d058bf': [
'Por isso a resposta é B',
'Bactéria: o gene é copiado junto com o DNA e cada filha leva uma cópia (100%).',
'Cabra com 1 cópia × macho sem o gene: só metade dos óvulos leva o gene (50%).'
]
};
VIS.def['dna-recombinante-transgenico'] = {
  tit: 'DNA recombinante: cortar, colar e pôr a bactéria para trabalhar',
  fontes: ['OpenStax, Biology 2e, 17.1 Biotechnology (enzimas de restrição, pontas coesivas, DNA ligase, plasmídio recombinante, eletroforese em gel) — https://openstax.org/books/biology-2e/pages/17-1-biotechnology', 'OpenStax, Biology 2e, 12.3 Laws of Inheritance (segregação: heterozigoto forma metade dos gametas com cada alelo) — https://openstax.org/books/biology-2e/pages/12-3-laws-of-inheritance', 'Wikipedia (en), Recombinant DNA — https://en.wikipedia.org/wiki/Recombinant_DNA'],
  tipo: 'anim', dur: 13,
  marcas: [[0, '1. Cortar'], [2.6, '2. Colar'], [5.2, '3. Produzir'], [7.8, '4. Herança'], [10.4, '5. Gel']],
  cred: 'Animação feita para o app (esquema fora de escala; GAATTC é o sítio da enzima EcoRI, usada como exemplo; na prática a bactéria recebe o gene sem íntrons (cDNA), pois ela não faz splicing).',
  nota: 'A mesma enzima de restrição corta o DNA humano e o plasmídio na mesma sequência e deixa pontas coesivas complementares; a ligase une os pedaços. A bactéria com o gene transcreve e traduz a receita e produz a proteína humana. Na bipartição o gene é duplicado com o DNA e passa a todas as filhas; num animal com uma só cópia (heterozigoto) ele vai para metade dos gametas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    function tr(g, x, y, s) { g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' + (s ? ' scale(' + s.toFixed(3) + ')' : '')); }
    svg.setAttribute('viewBox', '0 0 640 360');
    var DNA = '#5f7398', GENE = '#c0392b', ENZ = '#3f8a52', LIG = '#8a5a9e', BAC = '#8fae6a', INS = '#c9981f';
    var S = { lab: 'font-size:13.5px;font-weight:700;fill:var(--tinta)', mini: 'font-size:13px;fill:var(--lapis)', tit: 'font-size:15px;font-weight:700;fill:var(--tinta)' };
    function arco(cx, cy, r, a0, a1) { var p0 = [cx + r * Math.cos(a0), cy + r * Math.sin(a0)], p1 = [cx + r * Math.cos(a1), cy + r * Math.sin(a1)]; return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + ((a1 - a0) > Math.PI ? 1 : 0) + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1); }
    function seta(x1, y1, x2, y2, pai, cor) { var a = Math.atan2(y2 - y1, x2 - x1), c = cor || 'var(--tinta)'; return el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - 8 * Math.cos(a - .5)).toFixed(1) + ' ' + (y2 - 8 * Math.sin(a - .5)).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 8 * Math.cos(a + .5)).toFixed(1) + ' ' + (y2 - 8 * Math.sin(a + .5)).toFixed(1), style: 'fill:none;stroke:' + c + ';stroke-width:2' }, pai); }

    /* ===== cena 1-2: cortar e colar ===== */
    var G1 = el('g', {});
    tx(20, 26, 'DNA humano', S.tit, G1);
    var YD = 70;
    function fita(x1, x2, y, cor, pai) { return el('line', { x1: x1, x2: x2, y1: y, y2: y, style: 'stroke:' + cor + ';stroke-width:5;stroke-linecap:butt' }, pai); }
    var esq = el('g', {}, G1), dir = el('g', {}, G1), frag = el('g', {}, G1);
    fita(20, 120, YD - 6, DNA, esq); fita(20, 132, YD + 6, DNA, esq);
    fita(222, 300, YD - 6, DNA, dir); fita(234, 300, YD + 6, DNA, dir);
    fita(120, 222, YD - 6, GENE, frag); fita(132, 234, YD + 6, GENE, frag);
    var gl = tx(176, YD + 32, 'gene da insulina', 'font-size:13.5px;font-weight:700;fill:' + GENE + ';text-anchor:middle', G1);
    var sit = el('g', {}, G1);
    [120, 222].forEach(function (x) { tx(x + 6, YD - 16, 'GAATTC', 'font-size:13px;font-weight:600;fill:' + ENZ + ';text-anchor:middle', sit); });
    var enz = [120, 222].map(function (x) { var g = el('g', {}, G1); el('path', { d: 'M-14 -16 L14 -16 L6 0 L14 16 L-14 16 L-6 0 Z', style: 'fill:color-mix(in srgb,' + ENZ + ' 25%,var(--folha));stroke:' + ENZ + ';stroke-width:2' }, g); g.__x = x + 6; return g; });
    var enzL = tx(20, 176, 'enzima de restrição: corta só onde lê GAATTC', 'font-size:13.5px;font-weight:700;fill:' + ENZ, G1);
    var enzL2 = tx(20, 194, 'o corte é em degrau: sobram pontas coesivas (AATT)', S.mini, G1);
    /* plasmidio */
    var PX = 500, PY = 112, PR = 56;
    tx(PX, 26, 'plasmídio (DNA circular da bactéria)', S.tit + ';text-anchor:middle', G1);
    var pla = el('path', { style: 'fill:none;stroke:' + DNA + ';stroke-width:8' }, G1);
    var ins = el('path', { style: 'fill:none;stroke:' + GENE + ';stroke-width:8' }, G1);
    var ptxt = tx(PX, 64 - 22, 'GAATTC', 'font-size:13px;font-weight:600;fill:' + ENZ + ';text-anchor:middle', G1);
    var ligs = [0, 1].map(function () { return el('circle', { r: 7, style: 'fill:' + LIG }, G1); });
    var ligL = tx(PX, PY + PR + 34, 'ligase une as pontas', 'font-size:13.5px;font-weight:700;fill:' + LIG + ';text-anchor:middle', G1);
    var recL = tx(PX, PY + 6, 'recombinante', 'font-size:13.5px;font-weight:700;fill:' + GENE + ';text-anchor:middle', G1);
    var mesma = tx(330, 214, 'mesma enzima → pontas que se encaixam', 'font-size:13px;font-weight:600;fill:var(--lapis);text-anchor:middle', G1);

    /* ===== cena 3: bacteria produz ===== */
    var G3 = el('g', {});
    var fl = [['gene humano (DNA)', GENE, 48], ['RNA mensageiro', '#5f86c9', 118], ['insulina humana', INS, 188]];
    var flb = fl.map(function (f, i) {
      var g = el('g', {}, G3);
      el('rect', { x: 24, y: f[2] - 22, width: 196, height: 36, rx: 10, style: 'fill:color-mix(in srgb,' + f[1] + ' 14%,var(--folha));stroke:' + f[1] + ';stroke-width:2' }, g);
      tx(122, f[2] + 1, f[0], 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      return g;
    });
    var fs1 = el('g', {}, G3), fs2 = el('g', {}, G3);
    seta(122, 66, 122, 94, fs1); tx(132, 86, 'transcrição', S.mini, fs1);
    seta(122, 136, 122, 164, fs2); tx(132, 156, 'tradução (ribossomo)', S.mini, fs2);
    var bac = el('g', {}, G3);
    el('rect', { x: 290, y: 40, width: 330, height: 170, rx: 70, style: 'fill:color-mix(in srgb,' + BAC + ' 16%,var(--folha));stroke:' + BAC + ';stroke-width:3' }, bac);
    el('path', { d: 'M340 120 C345 70 400 70 420 100 C440 135 380 170 360 150 C340 130 410 110 430 140 C445 165 400 185 380 175', style: 'fill:none;stroke:' + DNA + ';stroke-width:3' }, bac);
    tx(330, 200, 'cromossomo', S.mini, bac);
    var bp = el('g', {}, G3);
    el('circle', { cx: 0, cy: 0, r: 24, style: 'fill:none;stroke:' + DNA + ';stroke-width:5' }, bp);
    el('path', { d: arco(0, 0, 24, -Math.PI / 2 - .55, -Math.PI / 2 + .55), style: 'fill:none;stroke:' + GENE + ';stroke-width:5' }, bp);
    var bpl = tx(548, 32, 'plasmídio com o gene', 'font-size:13px;font-weight:600;fill:' + GENE + ';text-anchor:middle', G3);
    var insul = [];
    for (var k = 0; k < 9; k++) insul.push(el('path', { d: 'M-7 0 L-3.5 -6 L3.5 -6 L7 0 L3.5 6 L-3.5 6 Z', style: 'fill:' + INS + ';stroke:#8a6a10;stroke-width:1' }, G3));
    var insL = tx(470, 138, 'insulina', 'font-size:13.5px;font-weight:700;fill:#8a6a10', G3);

    /* ===== cena 4: heranca ===== */
    var G4 = el('g', {});
    el('line', { x1: 318, x2: 318, y1: 8, y2: 228, style: 'stroke:var(--linha);stroke-width:1.5' }, G4);
    tx(160, 22, 'Bactéria: bipartição', S.tit + ';text-anchor:middle', G4);
    function bacteria(x, y, pai) {
      var g = el('g', {}, pai); tr(g, x, y);
      el('rect', { x: -52, y: -26, width: 104, height: 52, rx: 26, style: 'fill:color-mix(in srgb,' + BAC + ' 18%,var(--folha));stroke:' + BAC + ';stroke-width:2.5' }, g);
      el('circle', { cx: 0, cy: 0, r: 15, style: 'fill:none;stroke:' + DNA + ';stroke-width:3.5' }, g);
      el('path', { d: arco(0, 0, 15, -Math.PI / 2 - .7, -Math.PI / 2 + .7), style: 'fill:none;stroke:' + GENE + ';stroke-width:4' }, g);
      return g;
    }
    var bm = bacteria(160, 66, G4);
    tx(222, 60, 'gene no', 'font-size:13px;fill:' + GENE, G4); tx(222, 76, 'cromossomo', 'font-size:13px;fill:' + GENE, G4);
    var bf = el('g', {}, G4);
    seta(140, 96, 100, 128, bf); seta(180, 96, 220, 128, bf);
    bacteria(90, 156, bf); bacteria(230, 156, bf);
    tx(160, 210, 'DNA duplicado: cada filha leva o gene', 'font-size:13px;fill:var(--tinta);text-anchor:middle', bf);
    var b100 = tx(160, 230, '100% transgênicas', 'font-size:14px;font-weight:700;fill:' + GENE + ';text-anchor:middle', bf);
    tx(478, 22, 'Cabra com 1 cópia × macho comum', S.tit + ';text-anchor:middle', G4);
    function homologo(x, y, comGene, pai) { var g = el('g', {}, pai); el('rect', { x: x - 5, y: y, width: 10, height: 44, rx: 5, style: 'fill:#b9a68a;stroke:#7d6a50;stroke-width:1.2' }, g); if (comGene) el('rect', { x: x - 5, y: y + 16, width: 10, height: 10, style: 'fill:' + GENE }, g); return g; }
    var mae = el('g', {}, G4); homologo(386, 38, true, mae); homologo(402, 38, false, mae); tx(394, 98, 'cabra', S.lab + ';text-anchor:middle', mae);
    tx(470, 66, '×', 'font-size:22px;fill:var(--tinta);text-anchor:middle', G4);
    var pai = el('g', {}, G4); homologo(546, 38, false, pai); homologo(562, 38, false, pai); tx(554, 98, 'macho', S.lab + ';text-anchor:middle', pai);
    var gam = el('g', {}, G4);
    tx(334, 126, 'óvulos:', S.mini, gam); homologo(400, 110, true, gam); homologo(428, 110, false, gam);
    tx(400, 168, '1/2', 'font-size:13px;font-weight:700;fill:' + GENE + ';text-anchor:middle', gam); tx(428, 168, '1/2', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gam);
    tx(488, 126, 'esperm.:', S.mini, gam); homologo(568, 110, false, gam); tx(568, 168, 'todos', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gam);
    tx(568, 184, 'sem gene', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gam);
    var c50 = tx(478, 214, 'filhote: 1/2 × 1 = 50% transgênico', 'font-size:14px;font-weight:700;fill:' + GENE + ';text-anchor:middle', G4);

    /* ===== cena 5: eletroforese ===== */
    var G5 = el('g', {});
    el('rect', { x: 40, y: 30, width: 260, height: 186, rx: 6, style: 'fill:color-mix(in srgb,#9db4c8 22%,var(--folha));stroke:#7d93a8;stroke-width:1.8' }, G5);
    tx(24, 46, '−', 'font-size:22px;font-weight:700;fill:#1f6fb2;text-anchor:middle', G5);
    tx(24, 214, '+', 'font-size:22px;font-weight:700;fill:#b4442f;text-anchor:middle', G5);
    var LX = [90, 170, 250];
    LX.forEach(function (x) { el('rect', { x: x - 20, y: 38, width: 40, height: 8, rx: 2, style: 'fill:#56677a' }, G5); });
    tx(90, 22, 'tamanhos', 'font-size:13px;fill:var(--lapis);text-anchor:middle', G5); tx(170, 22, 'pessoa 1', 'font-size:13px;fill:var(--lapis);text-anchor:middle', G5); tx(250, 22, 'pessoa 2', 'font-size:13px;fill:var(--lapis);text-anchor:middle', G5);
    /* fragmentos: [faixa, tamanho relativo 0..1 (1 = pequeno, anda mais)] */
    var FR = [[0, .18], [0, .38], [0, .58], [0, .78], [0, .95], [1, .30], [1, .66], [1, .86], [2, .38], [2, .55], [2, .95]];
    var fb = FR.map(function (f) { return el('rect', { x: LX[f[0]] - 18, width: 36, height: 6, rx: 2, style: 'fill:#2f3e63' }, G5); });
    var exp = el('g', {}, G5);
    tx(330, 52, 'O DNA tem carga negativa', S.lab, exp); tx(330, 70, '(fosfatos) e corre para o polo +.', 'font-size:13px;fill:var(--tinta)', exp);
    tx(330, 108, 'O gel é uma malha: o fragmento', 'font-size:13px;fill:var(--tinta)', exp);
    tx(330, 126, 'pequeno passa fácil e vai longe;', 'font-size:13px;fill:var(--tinta)', exp);
    tx(330, 144, 'o grande fica perto do poço.', 'font-size:13px;fill:var(--tinta)', exp);
    tx(330, 182, 'Cada pessoa tem um padrão de', 'font-size:13px;fill:var(--tinta)', exp);
    tx(330, 200, 'faixas: serve para identificá-la.', 'font-size:13px;font-weight:700;fill:var(--tinta)', exp);
    var seta5 = seta(310, 60, 310, 200, G5, '#b4442f');

    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(L) { P0.textContent = L[0]; P.forEach(function (p, i) { p.textContent = L[i + 1] || ''; }); }

    var _desenha = function (t) {
      var fase = t < 2.6 ? 0 : t < 5.2 ? 1 : t < 7.8 ? 2 : t < 10.4 ? 3 : 4;
      op(G1, fase <= 1 ? (t > 5 ? 1 - cl((t - 5) / .2) : 1) : 0);
      op(G3, fase === 2 ? cl((t - 5.2) / .3) : 0);
      op(G4, fase === 3 ? cl((t - 7.8) / .3) : 0);
      op(G5, fase === 4 ? cl((t - 10.4) / .3) : 0);
      if (fase <= 1) {
        /* enzima chega e corta */
        enz.forEach(function (g, i) { var u = ease((t - .2) / .7); tr(g, g.__x, lerp(YD - 70, YD, u)); op(g, t < 1.7 ? cl((t - .2) / .3) : 1 - cl((t - 1.7) / .3)); });
        var corte = ease((t - 1.0) / .7);
        tr(esq, -10 * corte, 0); tr(dir, 10 * corte, 0);
        /* fragmento: desce, depois voa ao plasmidio (2.8-3.8) e some dentro dele */
        var voo = ease((t - 2.8) / 1.0);
        var fx = lerp(0, PX - 177, voo), fy = lerp(28 * corte, PY - PR - YD, voo), fsc = lerp(1, .55, voo);
        frag.setAttribute('transform', 'translate(' + (176 + fx).toFixed(1) + ' ' + (YD + fy).toFixed(1) + ') scale(' + fsc.toFixed(3) + ') translate(-176 ' + (-YD) + ')');
        op(frag, t < 3.8 ? 1 : 1 - cl((t - 3.8) / .2));
        op(gl, t < 2.7 ? cl((t - 1.4) / .3) : 0); gl.setAttribute('y', YD + 32 + 28 * corte);
        op(sit, t < 1.4 ? 1 : 0); op(enzL, t < 2.7 ? cl((t - .4) / .3) : 0); op(enzL2, t < 2.7 ? cl((t - 1.4) / .3) : 0);
        /* plasmidio abre na mesma sequencia */
        var gap = .55 * ease((t - 1.0) / .7);
        var a0 = -Math.PI / 2 + gap, a1 = -Math.PI / 2 - gap + 2 * Math.PI;
        pla.setAttribute('d', gap > .01 ? arco(PX, PY, PR, a0, a0 + (a1 - a0) / 2) + ' ' + arco(PX, PY, PR, a0 + (a1 - a0) / 2, a1).replace('M', 'L') : arco(PX, PY, PR, -Math.PI / 2, Math.PI / 2) + ' ' + arco(PX, PY, PR, Math.PI / 2, 3 * Math.PI / 2 - .001).replace('M', 'L'));
        op(ptxt, t < 1.4 ? 1 : 0);
        var vi = cl((t - 3.7) / .3);
        ins.setAttribute('d', arco(PX, PY, PR, -Math.PI / 2 - .55, -Math.PI / 2 + .55)); op(ins, vi);
        var lg = t > 4.0 ? .5 + .5 * Math.abs(Math.sin((t - 4) * 5)) : 0;
        ligs.forEach(function (c, i) { var a = -Math.PI / 2 + (i ? .55 : -.55); c.setAttribute('cx', (PX + PR * Math.cos(a)).toFixed(1)); c.setAttribute('cy', (PY + PR * Math.sin(a)).toFixed(1)); op(c, t > 4.0 ? lg : 0); });
        op(ligL, cl((t - 4.0) / .3)); op(recL, cl((t - 4.3) / .3)); op(mesma, t > 1.6 && t < 2.7 ? 1 : 0);
      }
      if (fase === 2) {
        var e = ease((t - 5.3) / 1.0);
        tr(bp, lerp(660, 548, e), 100);
        op(bpl, cl((t - 6.1) / .3));
        op(flb[0], cl((t - 5.6) / .3)); op(fs1, cl((t - 6.0) / .3)); op(flb[1], cl((t - 6.2) / .3)); op(fs2, cl((t - 6.6) / .3)); op(flb[2], cl((t - 6.8) / .3));
        var ALV = [[472, 152], [497, 172], [522, 152], [547, 172], [572, 152], [597, 170], [482, 194], [532, 196], [580, 192]];
        insul.forEach(function (p, i) {
          var u = ease((t - 6.5 - i * .07) / .6);
          tr(p, lerp(548, ALV[i][0], u), lerp(100, ALV[i][1], u));
          op(p, t > 6.5 + i * .07 ? 1 : 0);
        });
        op(insL, cl((t - 7.1) / .3));
      }
      if (fase === 3) {
        op(bf, cl((t - 8.4) / .4)); op(gam, cl((t - 8.9) / .4)); op(c50, cl((t - 9.4) / .4));
      }
      if (fase === 4) {
        var m = ease((t - 10.6) / 1.9);
        FR.forEach(function (f, i) { fb[i].setAttribute('y', (46 + m * f[1] * 158).toFixed(1)); });
        op(exp, cl((t - 11.0) / .4));
      }
      if (fase === 0) painel(['1. Cortar: enzima de restrição', 'A enzima de restrição lê uma sequência curta (aqui GAATTC) e corta o DNA ali.', 'A mesma enzima corta o DNA humano e o plasmídio: as pontas ficam iguais.']);
      else if (fase === 1) painel(['2. Colar: DNA ligase', 'As pontas coesivas do gene e do plasmídio se encaixam (pareamento de bases)', 'e a ligase as une: nasce um plasmídio recombinante, com o gene humano.']);
      else if (fase === 2) painel(['3. A bactéria passa a produzir insulina humana', 'Ela recebeu a sequência de DNA que codifica a insulina (o gene).', 'Transcreve em RNAm e traduz no ribossomo: o código genético é praticamente universal.']);
      else if (fase === 3) painel(['4. Quem herda o gene?', 'Bipartição é assexuada: o DNA (com o gene) é duplicado e vai para as duas filhas.', 'Na cabra com 1 cópia, a meiose separa os homólogos: só metade dos óvulos leva o gene.']);
      else painel(['5. Eletroforese em gel', 'Os fragmentos cortados pelas enzimas de restrição são postos nos poços do gel.', 'A corrente elétrica os puxa para o polo +; os menores andam mais. Faixas = tamanhos.']);
    };
    return fimResposta(VIS.def['dna-recombinante-transgenico'], svg, _desenha, 13, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'P2233a0c' ? 12.9 : q === 'Pf8e8e8f' ? 7.7 : 10.3; }
    });
  }
};
VIS.liga('dna-recombinante-transgenico', ['P2233a0c', 'Pf8e8e8f', 'P2d058bf']);
