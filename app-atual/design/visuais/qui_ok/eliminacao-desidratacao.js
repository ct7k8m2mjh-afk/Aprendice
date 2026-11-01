/* Eliminacao: desidratacao intramolecular (eteno, 170 C) x intermolecular (eter, 140 C) do etanol,
   o H+ como catalisador e a eliminacao de haleto pela regra de Saytzeff. */
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
'Pa444a65': ['Por isso a resposta é B',
'O etanol perde H₂O de dentro da própria molécula (desidratação',
'intramolecular) e vira eteno, C₂H₄, o monômero do polietileno.'],
'P00842f8': ['Por isso a resposta é D',
'Uma só molécula de etanol perde a água: desidratação intramolecular.',
'O H⁺ entra na etapa 1 e volta igual na etapa 2: é o catalisador.'],
'W4b4a008': ['Por isso a resposta é D',
'Sai o Br do C3 e o H do C2, o vizinho com menos H: a dupla fica entre C2',
'e C3, com 3 C ligados a ela. Produto principal: 2-metilpent-2-eno.']
};
VIS.def['eliminacao-desidratacao'] = {
  tit: 'Eliminação: a molécula perde água (ou HBr) e ganha uma dupla',
  fontes: ['OpenStax, Organic Chemistry (McMurry), 17.6 Reactions of Alcohols (desidratação catalisada por ácido) — https://openstax.org/books/organic-chemistry/pages/17-6-reactions-of-alcohols', 'OpenStax, Organic Chemistry (McMurry), 11.7 Elimination Reactions: Zaitsev’s Rule — https://openstax.org/books/organic-chemistry/pages/11-7-elimination-reactions-zaitsevs-rule', 'Wikipedia (en), Diethyl ether (etanol + H₂SO₄ a 140 °C) — https://en.wikipedia.org/wiki/Diethyl_ether', 'Wikipedia (en), Ethylene (desidratação do etanol; polietileno verde) — https://en.wikipedia.org/wiki/Ethylene'],
  tipo: 'anim', dur: 15.5,
  marcas: [[0, '170 °C'], [4, '140 °C'], [8, 'H⁺'], [11.5, 'Haleto']],
  cred: 'Animação feita para o app (fórmulas estruturais planas; temperaturas típicas de laboratório com H₂SO₄ concentrado).',
  nota: 'Desidratação intramolecular: uma molécula de álcool perde H₂O e vira alceno. Intermolecular: duas moléculas perdem uma H₂O e formam um éter. Na eliminação de um haleto, o H sai do carbono vizinho que tem menos hidrogênios, e a dupla fica no ponto mais ramificado (regra de Saytzeff).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 4, T2 = 8, T3 = 11.5, TF = 15.5;
    var AGUA = '#2b6cb0', SAI = '#c0392b', OK = '#2f8a5b', ROX = '#8a5a9e';
    var LG = 'stroke:var(--tinta);stroke-width:2.2;fill:none;stroke-linecap:round';
    var AT = 'font-size:17px;font-weight:700;text-anchor:middle;fill:var(--tinta)';
    function larg(s) { var n = 0; for (var i = 0; i < s.length; i++) n += '₀₁₂₃₄₅₆₇₈₉⁺'.indexOf(s[i]) >= 0 ? .55 : s[i] === ' ' ? .4 : 1; return n * 10.6; }
    function seta(pai, x0, x1, y, rot) {
      el('path', { d: 'M' + x0 + ' ' + y + ' H' + x1 + ' m-9 -6 l9 6 l-9 6', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, pai);
      if (rot) tx((x0 + x1) / 2, y - 9, rot, 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', pai);
    }
    /* cadeia condensada: tokens em linha, ligacao simples ou dupla com o anterior, grupos em cima/embaixo */
    function cadeia(pai, x0, y, toks, gap) {
      gap = gap || 20; var x = x0, out = [];
      toks.forEach(function (k, i) {
        var w = larg(k.l);
        if (i) {
          var b = k.b === undefined ? 1 : k.b;
          if (b === 1) el('path', { d: 'M' + (x + 3) + ' ' + y + ' h' + (gap - 6), style: LG }, pai);
          if (b === 2) el('path', { d: 'M' + (x + 3) + ' ' + (y - 3.5) + ' h' + (gap - 6) + ' M' + (x + 3) + ' ' + (y + 3.5) + ' h' + (gap - 6), style: LG.replace('var(--tinta)', k.cb || 'var(--tinta)') + (k.cb ? ';stroke-width:2.8' : '') }, pai);
          x += gap;
        }
        var cx = x + w / 2;
        tx(cx, y + 6, k.l, AT.replace('var(--tinta)', k.c || 'var(--tinta)'), pai);
        (k.s || []).forEach(function (s) {
          el('path', { d: 'M' + cx + ' ' + (y + s.d * 12) + ' V' + (y + s.d * 30), style: LG }, pai);
          tx(cx, y + s.d * 42 + 6, s.l, AT.replace('var(--tinta)', s.c || 'var(--tinta)'), pai);
        });
        if (k.n) tx(cx, y - 18 - (k.s && k.s.some(function (s) { return s.d < 0; }) ? 34 : 0), k.n, 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', pai);
        out.push({ x: cx, w: w }); x += w;
      });
      out.fim = x; return out;
    }
    /* ===== etapa 1: intramolecular ===== */
    var g1 = el('g', {});
    tx(20, 26, 'H₂SO₄ concentrado, ~170 °C', 'font-size:15px;font-weight:700;fill:var(--lapis)', g1);
    var C2 = [120, 104], C1 = [190, 104], O = [254, 104], HO = [302, 104];
    /* H fixos (posicoes inicial -> final em 120 graus) */
    var HF = [
      { c: C2, a: [120, 60], b: [C2[0] - 26, C2[1] - 44] },
      { c: C2, a: [72, 104], b: [C2[0] - 26, C2[1] + 44] },
      { c: C1, a: [190, 60], b: [C1[0] + 26, C1[1] - 44] },
      { c: C1, a: [190, 148], b: [C1[0] + 26, C1[1] + 44] }
    ].map(function (h) { h.l = el('path', { style: LG }, g1); h.t = tx(0, 0, 'H', AT, g1); return h; });
    tx(C2[0], C2[1] + 6, 'C', AT, g1); tx(C1[0], C1[1] + 6, 'C', AT, g1);
    var lCC = el('path', { d: 'M' + (C2[0] + 11) + ' 104 H' + (C1[0] - 11), style: LG }, g1);
    var lCC2 = el('path', { d: 'M' + (C2[0] + 11) + ' 111 H' + (C1[0] - 11), style: LG.replace('var(--tinta)', OK) + ';stroke-width:2.8' }, g1);
    /* o que sai: H de baixo do C2 e o OH do C1 */
    var hs = el('g', {}, g1), lHs = el('path', { d: 'M120 115 V136', style: LG }, g1); tx(0, 6, 'H', AT.replace('var(--tinta)', SAI), hs);
    var oh = el('g', {}, g1), lCO = el('path', { d: 'M201 104 H243', style: LG }, g1);
    tx(0, 6, 'O', AT.replace('var(--tinta)', SAI), oh); el('path', { d: 'M11 0 H37', style: LG }, oh); tx(48, 6, 'H', AT.replace('var(--tinta)', SAI), oh);
    var cerca = el('path', { d: 'M100 136 C100 176 140 176 140 136 L140 120 C150 116 236 120 238 92 C240 78 316 78 320 104 C322 128 240 126 236 116 C200 120 140 120 140 130', style: 'display:none' }, g1);
    var circH = el('circle', { cx: 120, cy: 148, r: 15, style: 'fill:none;stroke:' + SAI + ';stroke-width:2;stroke-dasharray:4 3' }, g1);
    var circOH = el('ellipse', { cx: 278, cy: 104, rx: 40, ry: 17, style: 'fill:none;stroke:' + SAI + ';stroke-width:2;stroke-dasharray:4 3' }, g1);
    var agua1 = tx(560, 170, 'H₂O', 'font-size:20px;font-weight:700;text-anchor:middle;fill:' + AGUA, g1);
    var nome1 = el('g', {}, g1);
    tx(155, 196, 'eteno (C₂H₄)', 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + OK, nome1);
    tx(500, 196, '1 etanol → 1 eteno + 1 água', 'font-size:14px;text-anchor:middle;fill:var(--lapis)', nome1);
    /* ===== etapa 2: intermolecular ===== */
    var g2 = el('g', {});
    tx(20, 26, 'H₂SO₄ concentrado, ~140 °C', 'font-size:15px;font-weight:700;fill:var(--lapis)', g2);
    var y2 = 92;
    var A = tx(0, y2 + 6, 'CH₃–CH₂–O', AT.replace('text-anchor:middle', 'text-anchor:end'), g2);
    var Ah = tx(0, y2 + 6, '–H', AT.replace('text-anchor:middle', 'text-anchor:start').replace('var(--tinta)', SAI), g2);
    var Bho = tx(0, y2 + 6, 'H–O', AT.replace('text-anchor:middle', 'text-anchor:end').replace('var(--tinta)', SAI), g2);
    var B = tx(0, y2 + 6, '–CH₂–CH₃', AT.replace('text-anchor:middle', 'text-anchor:start'), g2);
    var mais2 = tx(320, y2 + 6, '+', AT, g2);
    var agua2 = tx(470, 170, 'H₂O', 'font-size:20px;font-weight:700;text-anchor:middle;fill:' + AGUA, g2);
    var nome2 = el('g', {}, g2);
    tx(250, 140, 'etoxietano (éter dietílico)', 'font-size:16px;font-weight:700;text-anchor:middle;fill:' + OK, nome2);
    tx(250, 196, '2 etanol → 1 éter + 1 água', 'font-size:14px;text-anchor:middle;fill:var(--lapis)', nome2);
    var lab2 = el('g', {}, g2);
    tx(140, y2 - 26, 'etanol', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', lab2);
    tx(470, y2 - 26, 'etanol', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', lab2);
    /* ===== etapa 3: H+ catalisador ===== */
    var g3 = el('g', {});
    var E = [
      { y: 44, r: 'etapa 1', s: [['C₂H₅OH', 0], [' + ', 0], ['H⁺', 1], ['  →  ', 0], ['C₂H₅OH₂⁺', 2]] },
      { y: 100, r: 'etapa 2', s: [['C₂H₅OH₂⁺', 2], ['  →  ', 0], ['C₂H₄ + H₂O', 0], [' + ', 0], ['H⁺', 1]] },
      { y: 170, r: 'global', s: [['C₂H₅OH', 0], ['  →  ', 0], ['C₂H₄ + H₂O', 0]] }
    ];
    var marcaH = [], marcaI = [], pecas = [];
    E.forEach(function (e) {
      tx(20, e.y + 6, e.r, 'font-size:14px;font-weight:700;fill:var(--lapis)', g3);
      e.s.forEach(function (p) {
        var sep = p[0].trim() === '+' || p[0].trim() === '→', o = { e: e, sep: sep, k: p[1] };
        o.t = tx(0, e.y + 6, p[0].trim(), 'font-size:18px;font-weight:700;' + (sep ? 'text-anchor:middle;' : '') + 'fill:' + (p[1] === 1 ? OK : p[1] === 2 ? ROX : 'var(--tinta)'), g3);
        if (p[1]) { o.r = el('rect', { y: e.y - 15, height: 30, rx: 8, style: 'fill:none;stroke-width:2.2;stroke:' + (p[1] === 1 ? OK : ROX) }, g3); (p[1] === 1 ? marcaH : marcaI).push(o.r); }
        pecas.push(o);
      });
    });
    /* posicoes medidas no primeiro quadro (o svg ja esta na pagina) */
    var medido = false;
    function arruma() {
      var x = {}, ok = true;
      pecas.forEach(function (o) {
        var X = x[o.e.y] || 100, w;
        try { w = o.sep ? 44 : o.t.getComputedTextLength(); } catch (err) { w = 0; }
        if (!o.sep && !w) { ok = false; w = 11 * o.t.textContent.length; }
        o.t.setAttribute('x', (o.sep ? X + 22 : X).toFixed(1));
        if (o.r) { o.r.setAttribute('x', (X - 6).toFixed(1)); o.r.setAttribute('width', (w + 12).toFixed(1)); }
        x[o.e.y] = X + w + (o.sep ? 0 : 0);
      });
      return ok;
    }
    el('line', { x1: 20, x2: 620, y1: 136, y2: 136, style: 'stroke:var(--linha);stroke-width:1.2' }, g3);
    var nH = tx(430, 54, 'H⁺: entra e volta igual', 'font-size:15px;font-weight:700;fill:' + OK, g3);
    var nH2 = tx(430, 74, '→ catalisador', 'font-size:15px;font-weight:700;fill:' + OK, g3);
    var nI = tx(430, 110, 'C₂H₅OH₂⁺: nasce e some', 'font-size:15px;font-weight:700;fill:' + ROX, g3);
    var nI2 = tx(430, 130, '→ intermediário', 'font-size:15px;font-weight:700;fill:' + ROX, g3);
    var nG = tx(330, 202, 'na global não aparece o H⁺: ele não é gasto', 'font-size:14px;text-anchor:middle;fill:var(--lapis)', g3);
    /* ===== etapa 4: haleto, Saytzeff ===== */
    var g4 = el('g', {});
    tx(20, 22, '3-bromo-2-metilpentano + NaOH', 'font-size:15px;font-weight:700;fill:var(--lapis)', g4);
    var ch = cadeia(g4, 120, 66, [{ l: 'CH₃', n: 'C1' }, { l: 'CH', n: 'C2', c: OK, s: [{ l: 'CH₃', d: 1 }] }, { l: 'CH', n: 'C3', s: [{ l: 'Br', d: 1, c: SAI }] }, { l: 'CH₂', n: 'C4' }, { l: 'CH₃', n: 'C5' }]);
    tx(420, 50, 'vizinhos do C3 (o do Br):', 'font-size:14px;font-weight:700;fill:var(--lapis)', g4);
    tx(420, 72, 'C2 tem 1 H', 'font-size:15px;font-weight:700;fill:' + OK, g4);
    tx(420, 94, 'C4 tem 2 H', 'font-size:15px;font-weight:700;fill:var(--lapis)', g4);
    var pa = el('g', {}, g4), pb = el('g', {}, g4);
    el('path', { d: 'M170 122 L128 142 m3 -8 l-3 8 l9 0', style: 'fill:none;stroke:' + OK + ';stroke-width:2' }, pa);
    var pA = cadeia(pa, 20, 178, [{ l: 'CH₃' }, { l: 'C', s: [{ l: 'CH₃', d: -1 }] }, { l: 'CH', b: 2, cb: OK }, { l: 'CH₂' }, { l: 'CH₃' }], 16);
    tx(20, 210, 'principal: 2-metilpent-2-eno', 'font-size:14px;font-weight:700;fill:' + OK, pa);
    el('path', { d: 'M290 122 L392 142 m-9 1 l9 -1 l-5 -7', style: 'fill:none;stroke:var(--lapis);stroke-width:2' }, pb);
    var pB = cadeia(pb, 360, 178, [{ l: 'CH₃' }, { l: 'CH', s: [{ l: 'CH₃', d: -1 }] }, { l: 'CH' }, { l: 'CH', b: 2, cb: 'var(--lapis)' }, { l: 'CH₃' }], 16);
    tx(360, 210, 'menos formado: 4-metilpent-2-eno', 'font-size:14px;fill:var(--lapis)', pb);
    var dA = tx(200, 148, '', 'font-size:14px;font-weight:700;fill:' + OK, pa), dB = tx(500, 148, '', 'font-size:14px;fill:var(--lapis)', pb);
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 218, y2: 218, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 242, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 267 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Intramolecular: a água sai de UMA molécula', 'O etanol perde o OH de um carbono e um H do carbono vizinho.', 'Os dois saem juntos como H₂O, e entre os carbonos nasce a dupla:', 'eteno (C₂H₄). Do etanol da cana sai o eteno do “plástico verde”.'],
      ['2. Intermolecular: a água sai de DUAS moléculas', 'A temperatura menor, o H do OH de um etanol e o OH do outro saem', 'como H₂O. Os dois pedaços se unem pelo oxigênio: um éter,', 'o etoxietano, C₂H₅–O–C₂H₅.'],
      ['3. O H⁺ do ácido é catalisador', 'Etapa 1: o H⁺ se prende ao O do etanol. Etapa 2: sai a água, forma-se', 'o eteno e o H⁺ é devolvido. Consumido e devolvido igual: catalisador.', 'O C₂H₅OH₂⁺ nasce numa etapa e some na outra: intermediário.'],
      ['4. Haletos: o H sai do vizinho com menos H', 'Com NaOH, o haleto perde HBr: o Br de um C e um H de um C vizinho.', 'O H sai do vizinho menos hidrogenado (regra de Saytzeff): a dupla', 'fica no ponto mais ramificado, alceno mais substituído e mais estável.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      /* etapa 1 */
      var u = ease((t - 1) / 1.3), v = ease((t - 2.2) / .8);
      op(circH, t > .4 && u < .05 ? 1 : 0); op(circOH, t > .4 && u < .05 ? 1 : 0);
      op(lHs, u < .03 ? 1 : 0); op(lCO, u < .03 ? 1 : 0);
      hs.setAttribute('transform', 'translate(' + lerp(120, 543, u).toFixed(1) + ' ' + lerp(148, 166, u).toFixed(1) + ')');
      oh.setAttribute('transform', 'translate(' + lerp(254, 560, u).toFixed(1) + ' ' + lerp(104, 166, u).toFixed(1) + ')');
      op(hs, u < 1 ? 1 : 0); op(oh, u < 1 ? 1 : 0); op(agua1, u >= 1 ? 1 : 0);
      op(lCC2, v); op(nome1, v);
      var dx = lerp(0, 38, v);
      HF.forEach(function (h) {
        var x = lerp(h.a[0], h.b[0], v), y = lerp(h.a[1], h.b[1], v), cx = h.c[0], cy = h.c[1], ux = x - cx, uy = y - cy, m = Math.hypot(ux, uy);
        h.t.setAttribute('x', x.toFixed(1)); h.t.setAttribute('y', (y + 6).toFixed(1));
        h.l.setAttribute('d', 'M' + (cx + ux / m * 11).toFixed(1) + ' ' + (cy + uy / m * 11).toFixed(1) + ' L' + (x - ux / m * 10).toFixed(1) + ' ' + (y - uy / m * 10).toFixed(1));
      });
      /* etapa 2 */
      var u2 = ease((t - T1 - 1) / 1.3), v2 = ease((t - T1 - 2.3) / .8);
      var xa = 210, xb = 430;
      A.setAttribute('x', lerp(xa, 250, v2).toFixed(1));
      Ah.setAttribute('x', lerp(xa + 1, 455, u2).toFixed(1)); Ah.setAttribute('y', lerp(y2 + 6, 176, u2).toFixed(1));
      Bho.setAttribute('x', lerp(xb, 470, u2).toFixed(1)); Bho.setAttribute('y', lerp(y2 + 6, 176, u2).toFixed(1));
      B.setAttribute('x', lerp(xb + 1, 251, v2).toFixed(1));
      op(Ah, u2 < 1 ? 1 : 0); op(Bho, u2 < 1 ? 1 : 0); op(agua2, u2 >= 1 ? 1 : 0); op(mais2, 1 - u2); op(lab2, 1 - u2); op(nome2, v2);
      /* etapa 3 */
      if (!medido) medido = arruma();
      var p3 = t - T2;
      marcaH.forEach(function (r, i) { op(r, p3 > .6 + i * .9 ? 1 : 0); }); op(nH, p3 > 1.5 ? 1 : 0); op(nH2, p3 > 1.5 ? 1 : 0);
      marcaI.forEach(function (r) { op(r, p3 > 2.2 ? 1 : 0); }); op(nI, p3 > 2.2 ? 1 : 0); op(nI2, p3 > 2.2 ? 1 : 0); op(nG, p3 > 2.8 ? 1 : 0);
      /* etapa 4 */
      var p4 = t - T3;
      op(pa, p4 > .9 ? 1 : 0); op(pb, p4 > 1.8 ? 1 : 0);
      dA.textContent = p4 > 2.6 ? '3 C presos à dupla' : ''; dB.textContent = p4 > 2.6 ? '2 C presos à dupla' : '';
      var L = TXT[f];
      for (var k = 0; k < 4; k++) P[k].textContent = L[k] || '';
    };
    return fimResposta(VIS.def['eliminacao-desidratacao'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'Pa444a65' ? T1 - .01 : q === 'P00842f8' ? T3 - .01 : TF - .01; }
    });
  }
};
VIS.liga('eliminacao-desidratacao', ['Pa444a65', 'P00842f8', 'W4b4a008']);
