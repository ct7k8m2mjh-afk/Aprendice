/* Mitose (2n = 4): interfase/fase S, profase, metafase, anafase, telofase e citocinese, contagem de cromossomos e cromatides; foto real de raiz de cebola. */
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
'W6b9ebb1': [
'Por isso a resposta é A',
'O DNA duplica uma vez e a célula se divide uma vez: cada',
'cromátide-irmã vai para um lado. Saem 2 células-filhas com',
'os mesmos 4 cromossomos da célula-mãe (2n = 4).'
],
'Wa8b7390': [
'Por isso a resposta é D',
'A divisão do citoplasma é a citocinese (cito = citoplasma).',
'Cariocinese é a divisão do núcleo; prófase e telófase são',
'fases dela, e o fragmoplasto é estrutura das células vegetais.'
],
'W1bca089': [
'Por isso a resposta é E',
'Primeiro o DNA duplica na fase S (III); na anáfase o centrômero',
'se divide e separa as cromátides (II); por fim, na citocinese,',
'o citoplasma se divide (I). Ordem: III, II, I.'
],
'W8fb2bed': [
'Por isso a resposta é A',
'Na metáfase da mitose os 4 cromossomos se alinham um a um, sem',
'parear homólogos, e cada um ainda tem 2 cromátides-irmãs',
'unidas pelo centrômero (a duplicação foi na fase S).'
]
};
VIS.def['mitose-fases'] = {
  tit: 'Mitose passo a passo (2n = 4)',
  fontes: ['OpenStax, Biology 2e, 10.2 The Cell Cycle — https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle', 'Khan Academy, Phases of mitosis — https://www.khanacademy.org/science/biology/cellular-molecular-biology/mitosis/a/phases-of-mitosis', 'Wikipedia (en), Mitosis — https://en.wikipedia.org/wiki/Mitosis'],
  tipo: 'anim', dur: 16.2,
  marcas: [[0, 'Interfase'], [2.6, 'Prófase'], [5.2, 'Metáfase'], [7.8, 'Anáfase'], [10.4, 'Telófase'], [13.2, 'Na lâmina']],
  cred: 'Animação feita para o app (esquema fora de escala; vermelho e azul = cromossomos de origem materna e paterna). Foto: ponta de raiz de cebola, 400×, John Alan Elson, CC BY-SA 4.0, Wikimedia Commons (recortada).',
  nota: 'Uma duplicação (fase S) e uma divisão: por isso a mitose mantém o número de cromossomos. Conte cromossomos pelos centrômeros: na metáfase são 4 com 2 cromátides cada; na anáfase cada cromátide vira um cromossomo e há 8 na célula, 4 indo para cada polo.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var VER = '#c0392b', AZU = '#2b6cb0', CEL = '#6f9b78', FUS = '#9a8f70';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 2.6, 5.2, 7.8, 10.4, 13.2], TF = 16.2;
    var CX = 222, CY = 116;
    /* celula: duas elipses (contorno da uniao) */
    var gCel = el('g', {});
    var eA = el('ellipse', { style: 'fill:none;stroke:' + CEL + ';stroke-width:5' }, gCel), eB = el('ellipse', { style: 'fill:none;stroke:' + CEL + ';stroke-width:5' }, gCel);
    var fA = el('ellipse', { style: 'fill:color-mix(in srgb,#9fc9a8 16%,var(--folha))' }, gCel), fB = el('ellipse', { style: 'fill:color-mix(in srgb,#9fc9a8 16%,var(--folha))' }, gCel);
    /* nucleos */
    var nuc = el('circle', { cx: CX, cy: CY, r: 62, style: 'fill:color-mix(in srgb,#8c7ab0 10%,var(--folha));stroke:#8c7ab0;stroke-width:2' });
    var nF = [el('circle', { r: 44, style: 'fill:color-mix(in srgb,#8c7ab0 10%,transparent);stroke:#8c7ab0;stroke-width:2' }), el('circle', { r: 44, style: 'fill:color-mix(in srgb,#8c7ab0 10%,transparent);stroke:#8c7ab0;stroke-width:2' })];
    /* fuso */
    var fuso = el('g', {});
    var polos = [el('circle', { r: 6, style: 'fill:' + FUS }), el('circle', { r: 6, style: 'fill:' + FUS })];
    var fib = []; for (var i = 0; i < 8; i++) fib.push(el('line', { style: 'stroke:' + FUS + ';stroke-width:1.2' }, fuso));
    /* cromossomos: 4 (L vermelho, L azul, C vermelho, C azul), cada um com 2 cromatides */
    var CR = [{ c: VER, L: 38 }, { c: AZU, L: 38 }, { c: VER, L: 24 }, { c: AZU, L: 24 }];
    var INT = [[190, 92], [252, 100], [204, 140], [246, 138]];   /* posicao na interfase */
    var MET = [59, 107, 148, 182];   /* y do centromero na placa */
    var crom = CR.map(function (k) {
      var g = el('g', {}); k.g = g;
      k.a = el('rect', { rx: 4, style: 'fill:' + k.c }, g);
      k.b = el('rect', { rx: 4, style: 'fill:' + k.c }, g);
      k.cen = el('circle', { r: 3.6, style: 'fill:#3a2a1a' }, g);
      return k;
    });
    /* pecas separadas na anafase: a cromatide b vira cromossomo independente */
    CR.forEach(function (k) { k.b2 = el('rect', { rx: 4, style: 'fill:' + k.c }); k.cen2 = el('circle', { r: 3.6, style: 'fill:#3a2a1a' }); });
    var rotPlaca = tx(CX, 16, 'placa equatorial', 'font-size:13.5px;font-weight:700;fill:var(--lapis);text-anchor:middle');
    var placa = el('line', { x1: CX, x2: CX, y1: 32, y2: 200, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' });
    var furo = tx(CX, 206, 'citocinese', 'font-size:13.5px;font-weight:700;fill:#4f7a58;text-anchor:middle');
    var filhas = [tx(118, 186, '2n = 4', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle'), tx(326, 186, '2n = 4', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle')];
    /* foto real */
    var gF = el('g', {});
    el('image', { href: 'vis/mitose-fases-1.webp', x: 14, y: 8, width: 264, height: 198, preserveAspectRatio: 'xMidYMid slice' }, gF);
    el('rect', { x: 14, y: 8, width: 264, height: 198, style: 'fill:none;stroke:var(--linha);stroke-width:1' }, gF);
    var MK = [[72, 88, '1'], [165, 97, '2'], [66, 142, '3']];
    var mkG = MK.map(function (m) { var g = el('g', {}, gF); el('circle', { cx: m[0], cy: m[1], r: 18, style: 'fill:none;stroke:#fff;stroke-width:2.5' }, g); el('circle', { cx: m[0] + 20, cy: m[1] - 14, r: 10, style: 'fill:var(--ad-c)' }, g); tx(m[0] + 20, m[1] - 9.5, m[2], 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g); return g; });
    var LEG = [['1', 'prófase: cromossomos', 'condensados no núcleo'], ['2', 'anáfase: dois grupos de', 'cromossomos se afastando'], ['3', 'interfase: núcleo inteiro,', 'cromatina solta']];
    var legG = LEG.map(function (l, i) { var g = el('g', {}, gF), y = 30 + 58 * i; el('circle', { cx: 300, cy: y - 5, r: 10, style: 'fill:var(--ad-c)' }, g); tx(300, y - .5, l[0], 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g); tx(318, y, l[1], 'font-size:14px;font-weight:700;fill:var(--tinta)', g); tx(318, y + 18, l[2], 'font-size:13.5px;fill:var(--tinta)', g); return g; });
    /* contador e ordem dos eventos */
    var gK = el('g', {});
    el('rect', { x: 440, y: 8, width: 188, height: 198, rx: 12, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' }, gK);
    tx(452, 34, 'cromossomos', 'font-size:14px;fill:var(--tinta)', gK); var vC = tx(614, 34, '', 'font-size:18px;font-weight:700;fill:var(--tinta);text-anchor:end', gK);
    tx(452, 60, 'cromátides', 'font-size:14px;fill:var(--tinta)', gK); var vT = tx(614, 60, '', 'font-size:18px;font-weight:700;fill:var(--tinta);text-anchor:end', gK);
    var vS = tx(534, 82, '', 'font-size:13px;fill:var(--lapis);text-anchor:middle', gK);
    el('line', { x1: 452, x2: 616, y1: 94, y2: 94, style: 'stroke:var(--linha);stroke-width:1.5' }, gK);
    tx(452, 114, 'ordem dos eventos', 'font-size:13.5px;font-weight:700;fill:var(--lapis)', gK);
    var EV = [['DNA duplica', '(fase S)'], ['centrômero divide', '(anáfase)'], ['citoplasma divide', '(citocinese)']];
    var evG = EV.map(function (e, i) { var g = el('g', {}, gK), y = 136 + 24 * i; e.b = el('circle', { cx: 460, cy: y - 5, r: 7, style: 'fill:var(--ad-c)' }, g); tx(460, y - 1, String(i + 1), 'font-size:11px;font-weight:700;fill:#fff;text-anchor:middle', g); tx(473, y, e[0], 'font-size:13.5px;font-weight:700;fill:var(--tinta)', g); return g; });
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['0. Interfase: o DNA se duplica (fase S)', 'Antes da mitose, cada um dos 4 cromossomos é copiado.', 'Cada cópia é uma cromátide-irmã, presa à outra pelo centrômero:', 'continuam 4 cromossomos, agora com 8 cromátides.'],
      ['1. Prófase: os cromossomos condensam', 'A cromatina se enrola e os cromossomos ficam visíveis.', 'O envoltório nuclear (carioteca) se desfaz e o fuso', 'se forma entre os dois polos.'],
      ['2. Metáfase: todos alinhados na placa', 'Condensação máxima: é a melhor fase para contar cromossomos.', 'Cada cromossomo se alinha sozinho (na mitose homólogos não', 'formam pares): 4 cromossomos, cada um com 2 cromátides.'],
      ['3. Anáfase: as cromátides-irmãs se separam', 'O centrômero se divide e as fibras do fuso puxam cada cromátide', 'para um polo. Cada cromátide agora é um cromossomo:', '8 na célula, 4 indo para cada lado.'],
      ['4. Telófase e citocinese', 'Os núcleos se refazem em cada polo e o citoplasma se divide', '(citocinese). Saem 2 células-filhas idênticas, cada uma com', '4 cromossomos (2n = 4), como a célula-mãe.'],
      ['5. Na lâmina real (ponta de raiz de cebola)', 'A raiz cresce por mitose: na mesma lâmina há células em fases', 'diferentes. A maioria está em interfase; as que estão dividindo', 'mostram cromossomos condensados em vez de núcleo liso.']
    ];
    function capsula(r, cx, cy, L) { r.setAttribute('x', (cx - 4).toFixed(1)); r.setAttribute('y', (cy - L / 2).toFixed(1)); r.setAttribute('width', 8); r.setAttribute('height', L.toFixed(1)); }
    var _desenha = function (t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : t < T[4] ? 3 : t < T[5] ? 4 : 5;
      var foto = f === 5;
      op(gF, foto ? cl((t - T[5]) / .4) : 0);
      [gCel, nuc, fuso, rotPlaca, placa, furo].forEach(function (o) { o.style.display = foto ? 'none' : ''; });
      crom.forEach(function (k) { k.g.style.display = foto ? 'none' : ''; k.b2.style.display = foto ? 'none' : ''; k.cen2.style.display = foto ? 'none' : ''; });
      nF.forEach(function (n) { n.style.display = foto ? 'none' : ''; }); polos.forEach(function (p) { p.style.display = foto ? 'none' : ''; });
      filhas.forEach(function (n) { n.style.display = foto ? 'none' : ''; });
      /* celula */
      var uc = f === 4 ? ease((t - T[4] - .8) / 1.6) : f > 4 ? 1 : 0;
      var cA = lerp(CX, 118, uc), cB = lerp(CX, 326, uc), rx = lerp(200, 102, uc), ry = lerp(88, 74, uc);
      [eA, fA].forEach(function (e) { e.setAttribute('cx', cA); e.setAttribute('cy', CY); e.setAttribute('rx', rx); e.setAttribute('ry', ry); });
      [eB, fB].forEach(function (e) { e.setAttribute('cx', cB); e.setAttribute('cy', CY); e.setAttribute('rx', rx); e.setAttribute('ry', ry); });
      op(furo, f === 4 && uc > .3 ? 1 : 0);
      /* nucleo inicial e nucleos filhos */
      var nv = f === 0 ? 1 : f === 1 ? 1 - cl((t - T[1] - .6) / 1.2) : 0;
      op(nuc, nv); nuc.style.strokeDasharray = f === 1 ? '6 5' : 'none';
      nF[0].setAttribute('cx', 118); nF[1].setAttribute('cx', 326); nF.forEach(function (n) { n.setAttribute('cy', CY - 4); op(n, f === 4 ? cl((t - T[4] - .4) / .8) : 0); });
      /* fuso */
      var pv = f === 1 ? ease((t - T[1] - .4) / 1.4) : f >= 2 && f <= 3 ? 1 : f === 4 ? 1 - cl((t - T[4]) / .6) : 0;
      var P0 = [lerp(CX - 20, 40, pv), CY], P1 = [lerp(CX + 20, 404, pv), CY];
      polos[0].setAttribute('cx', P0[0]); polos[0].setAttribute('cy', P0[1]); polos[1].setAttribute('cx', P1[0]); polos[1].setAttribute('cy', P1[1]);
      op(polos[0], f >= 1 && f <= 4 ? pv : 0); op(polos[1], f >= 1 && f <= 4 ? pv : 0);
      op(rotPlaca, f === 2 ? 1 : 0); op(placa, f === 2 ? 1 : 0);
      /* cromossomos */
      var um = f === 1 ? ease((t - T[1] - .4) / 2) : 0, ua = f === 3 ? ease((t - T[3] - .4) / 1.8) : f >= 4 ? 1 : 0, ug = f === 2 ? ease((t - T[2]) / 1.4) : f > 2 ? 1 : 0;
      var dup = f === 0 ? ease((t - .9) / 1.1) : 1;
      crom.forEach(function (k, i) {
        var esp = lerp(2.5, 8, f === 0 ? 0 : f === 1 ? um : 1);   /* espessura: fina (cromatina) -> grossa */
        var L = lerp(k.L * 1.5, k.L, f === 0 ? 0 : f === 1 ? um : 1);
        var px = lerp(INT[i][0], CX, ug), py = lerp(INT[i][1], MET[i], ug);
        var sep = 5 * dup;
        /* cromatide a (fica do lado esquerdo) */
        var xa = lerp(px - sep, 118 + (i - 1.5) * 14, ua);
        var xb = lerp(px + sep, 326 + (i - 1.5) * 14, ua);
        var ya = lerp(py, CY - 4, ua);
        [k.a, k.b, k.b2].forEach(function (r) { r.setAttribute('rx', esp / 2); });
        k.a.setAttribute('x', (xa - esp / 2).toFixed(1)); k.a.setAttribute('y', (ya - L / 2).toFixed(1)); k.a.setAttribute('width', esp); k.a.setAttribute('height', L.toFixed(1));
        var juntos = f < 3 || ua === 0;
        k.b.setAttribute('x', (px + sep - esp / 2).toFixed(1)); k.b.setAttribute('y', (py - L / 2).toFixed(1)); k.b.setAttribute('width', esp); k.b.setAttribute('height', L.toFixed(1));
        op(k.b, juntos ? (f === 0 ? dup : 1) : 0);
        k.b2.setAttribute('x', (xb - esp / 2).toFixed(1)); k.b2.setAttribute('y', (ya - L / 2).toFixed(1)); k.b2.setAttribute('width', esp); k.b2.setAttribute('height', L.toFixed(1));
        op(k.b2, juntos ? 0 : 1);
        k.cen.setAttribute('cx', juntos ? px : xa); k.cen.setAttribute('cy', ya); op(k.cen, f === 0 ? dup : 1);
        k.cen2.setAttribute('cx', xb); k.cen2.setAttribute('cy', ya); op(k.cen2, juntos ? 0 : 1);
        /* fibras do fuso ate os centromeros */
        var fa = fib[2 * i], fb = fib[2 * i + 1];
        fa.setAttribute('x1', P0[0]); fa.setAttribute('y1', P0[1]); fa.setAttribute('x2', juntos ? px - sep : xa); fa.setAttribute('y2', ya);
        fb.setAttribute('x1', P1[0]); fb.setAttribute('y1', P1[1]); fb.setAttribute('x2', juntos ? px + sep : xb); fb.setAttribute('y2', ya);
      });
      op(fuso, f === 1 ? um * .9 : f === 2 || f === 3 ? .9 : f === 4 ? 1 - cl((t - T[4]) / .6) : 0);
      filhas.forEach(function (n) { op(n, f === 4 && uc > .9 ? 1 : 0); });
      /* contador */
      var nCr, nCt, sub;
      if (f === 0) { nCr = '4'; nCt = dup < .5 ? '4' : '8'; sub = dup < .5 ? 'antes da fase S' : 'depois da fase S'; }
      else if (f <= 2) { nCr = '4'; nCt = '8'; sub = 'cada um com 2 cromátides'; }
      else if (f === 3) { nCr = ua > 0 ? '8' : '4'; nCt = '8'; sub = ua > 0 ? '4 indo para cada polo' : 'cada um com 2 cromátides'; }
      else { nCr = '4 + 4'; nCt = '4 + 4'; sub = 'cada filha: 2n = 4'; }
      vC.textContent = nCr; vT.textContent = nCt; vS.textContent = sub;
      op(gK, foto ? 0 : 1);
      var feito = [t > 1.5, f >= 3 && ua > 0, f >= 4 && uc > .3];
      evG.forEach(function (g, i) { op(g, feito[i] ? 1 : .3); });
      mkG.forEach(function (g, i) { op(g, foto ? cl((t - T[5] - .4 - .5 * i) / .3) : 0); });
      legG.forEach(function (g, i) { op(g, foto ? cl((t - T[5] - .4 - .5 * i) / .3) : 0); });
      var L = TXT[f];
      for (var j = 0; j < 4; j++) P[j].textContent = L[j];
    };
    return fimResposta(VIS.def['mitose-fases'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'W8fb2bed' ? T[3] - .2 : T[5] - .2; }
    });
  }
};
VIS.liga('mitose-fases', ['W6b9ebb1', 'Wa8b7390', 'W1bca089', 'W8fb2bed']);
