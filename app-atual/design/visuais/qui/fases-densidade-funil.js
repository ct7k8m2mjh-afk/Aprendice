/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid).
   R[qid] = ['Por isso a resposta é X', 'linha', ...]. Sem entrada para o qid, o visual fica como era. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var n = r.length - 1, w = opc.w || 560, h = opc.h || 62 + 22 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  if (opc.base) { h = Math.max(h, opc.hmin || 0); y = vb[3] - h - 4; }
  if (y + h > vb[3] - 3) y = vb[3] - h - 3;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 20, y: y + 33, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 20, y: y + 61 + 22 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;   /* quadro congelado na etapa Resposta */
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .16 : 1; c.style.opacity = on ? 1 : 0;
    (opc.oculta || []).forEach(function (o) { o.style.visibility = on ? 'hidden' : 'visible'; });
  };
}
var RESP = {
'P3d4d047': ['Por isso a resposta é C', 'A (1 fase): o ácido acético (2) tem OH e se mistura com a água.', 'B: ciclo-hexano (3) é apolar, não se mistura e, com 0,78 g/mL, fica em cima.', 'C: clorofórmio (1) não se mistura e, com 1,48 g/mL, afunda. Ordem: 2, 3 e 1.'],
'Pee9ac0d': ['Por isso a resposta é E', 'Semelhante dissolve semelhante: o que é apolar não se mistura com', 'a água, como o ciclo-hexano. Resinas apolares ou pouco polares', 'formam uma camada que a água não molha nem atravessa.'],
'P9449f8f': ['Por isso a resposta é C', 'Fase 1 (em cima, 0,78 g/cm³): álcool isopropílico, O–H ··· O: ligação de H.', 'Fase 2 (embaixo, 1,2 g/cm³): água com Na⁺ e Cl⁻ dissolvidos:', 'cada íon é cercado por moléculas de água → interação íon-dipolo.'],
'P054feae': ['Por isso a resposta é A', 'Situação 1: álcool isopropílico + água ferve a 80,4 °C constante,', 'como se fosse pura: mistura azeotrópica.', 'Situação 3: duas fases líquidas → decantação no funil de separação.']
};
VIS.def['fases-densidade-funil'] = {
  tit: 'Misturar ou não, quem fica em cima e como separar',
  fontes: ['OpenStax, Chemistry 2e, 11.3 Solubility (miscibilidade de líquidos) — https://openstax.org/books/chemistry-2e/pages/11-3-solubility', 'OpenStax, Chemistry 2e, 10.1 Intermolecular Forces (íon-dipolo e ligação de hidrogênio) — https://openstax.org/books/chemistry-2e/pages/10-1-intermolecular-forces', 'Wikipedia (en), Separatory funnel — https://en.wikipedia.org/wiki/Separatory_funnel', 'Wikipedia (en), Azeotrope (azeótropo água–álcool isopropílico, 80,4 °C) — https://en.wikipedia.org/wiki/Azeotrope', 'Densidades: Wikipedia (en), Chloroform (1,48 g/mL), Acetic acid (1,05 g/mL), Cyclohexane (0,78 g/mL), Isopropyl alcohol (0,79 g/mL)'],
  tipo: 'anim', dur: 22,
  marcas: [[0, 'Mistura?'], [5.5, 'Duas fases'], [11, 'Azeótropo'], [16.5, 'Funil']],
  cred: 'Animação feita para o app (esquema; curvas de aquecimento sem escala de tempo).',
  nota: 'Líquidos de polaridade parecida se misturam (uma fase). Se não se misturam, formam camadas e o menos denso fica em cima. Duas fases líquidas se separam por decantação no funil de separação; uma mistura azeotrópica ferve a temperatura constante e não se separa por destilação simples.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var AG = '#c6dcf2', AGs = '#6f9cc8', VD = '#1f8a70', VM = '#b4442f', AZ = '#2b6cb0', OX = '#cc3d33';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    var uid = 'f' + Math.random().toString(36).slice(2, 8), defs = el('defs', {});
    /* bequer: interior x0..x1, fundo yb */
    function bequer(g, cx, w, yt, yb) {
      var x0 = cx - w / 2, x1 = cx + w / 2;
      return el('path', { d: 'M' + (x0 - 6) + ' ' + yt + ' L' + x0 + ' ' + (yt + 6) + ' V' + (yb - 6) + ' Q' + x0 + ' ' + yb + ' ' + (x0 + 6) + ' ' + yb + ' H' + (x1 - 6) + ' Q' + x1 + ' ' + yb + ' ' + x1 + ' ' + (yb - 6) + ' V' + yt, style: 'fill:none;stroke:var(--lapis);stroke-width:2.2;stroke-linejoin:round' }, g);
    }
    /* ---------- etapa 1: tres bequeres ---------- */
    var g1 = el('g', {});
    var B = [
      { cx: 108, nome: 'ácido acético', num: '2', d: '1,05 g/mL', cor: '#d6e6ee', tipo: 'mis', v1: '1 fase: se mistura', v2: 'tem OH (ligação de H)' },
      { cx: 320, nome: 'ciclo-hexano', num: '3', d: '0,78 g/mL', cor: '#f2df9c', tipo: 'cima', v1: '2 fases: em cima', v2: 'apolar, menos denso' },
      { cx: 532, nome: 'clorofórmio', num: '1', d: '1,48 g/mL', cor: '#e8bfd0', tipo: 'baixo', v1: '2 fases: embaixo', v2: 'pouco polar, mais denso' }
    ];
    var BW = 110, BT = 70, BB = 200;
    B.forEach(function (b, i) {
      var x0 = b.cx - BW / 2;
      tx(b.cx, 24, b.nome + ' (' + b.num + ')', 'font-size:16px;font-weight:700;fill:var(--tinta);' + C, g1);
      tx(b.cx, 44, 'densidade ' + b.d, 'font-size:14px;fill:var(--lapis);' + C, g1);
      b.ag = el('rect', { x: x0 + 1, width: BW - 2, style: 'fill:' + AG }, g1);
      b.li = el('rect', { x: x0 + 1, width: BW - 2, style: 'fill:' + b.cor }, g1);
      b.jato = el('rect', { x: b.cx - 3, width: 6, style: 'fill:' + b.cor }, g1);
      bequer(g1, b.cx, BW, BT, BB);
      b.lab1 = tx(b.cx, 0, 'H₂O', 'font-size:14px;font-weight:700;fill:' + AGs + ';' + C, g1);
      b.lab2 = tx(b.cx, 0, '', 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, g1);
      b.ver = el('g', {}, g1);
      tx(b.cx, 226, b.v1, 'font-size:15px;font-weight:700;' + C + ';fill:' + (b.tipo === 'mis' ? VD : AZ), b.ver);
      tx(b.cx, 246, b.v2, 'font-size:14px;fill:var(--tinta);' + C, b.ver);
    });
    tx(108, 64, 'A', 'font-size:15px;font-weight:700;fill:var(--lapis);' + C, g1); tx(320, 64, 'B', 'font-size:15px;font-weight:700;fill:var(--lapis);' + C, g1); tx(532, 64, 'C', 'font-size:15px;font-weight:700;fill:var(--lapis);' + C, g1);
    /* ---------- etapa 2: fases e forcas ---------- */
    var g2 = el('g', {});
    var X2 = 112, W2 = 130, T2 = 50, Bt2 = 220, YI = 136;
    el('rect', { x: X2 - W2 / 2 + 1, y: 78, width: W2 - 2, height: YI - 78, style: 'fill:#f1e4b8' }, g2);
    el('rect', { x: X2 - W2 / 2 + 1, y: YI, width: W2 - 2, height: Bt2 - YI - 1, style: 'fill:' + AG }, g2);
    for (var i = 0; i < 9; i++) el('circle', { cx: X2 - 50 + i * 12.5, cy: Bt2 - 7 - (i % 2) * 4, r: 4.5, style: 'fill:#fff;stroke:#9aa7b3;stroke-width:1' }, g2);
    bequer(g2, X2, W2, T2, Bt2);
    tx(X2, 30, 'situação 3', 'font-size:15px;font-weight:700;fill:var(--lapis);' + C, g2);
    tx(X2, 104, 'fase 1', 'font-size:15px;font-weight:700;fill:var(--tinta);' + C, g2); tx(X2, 122, '0,78 g/cm³', 'font-size:14px;fill:var(--tinta);' + C, g2);
    tx(X2, 168, 'fase 2', 'font-size:15px;font-weight:700;fill:var(--tinta);' + C, g2); tx(X2, 186, '1,2 g/cm³', 'font-size:14px;fill:var(--tinta);' + C, g2);
    tx(X2, 242, 'NaCl que sobrou', 'font-size:14px;fill:var(--lapis);' + C, g2);
    var z1 = el('g', {}, g2), z2 = el('g', {}, g2);
    el('path', { d: 'M' + (X2 + W2 / 2) + ' 104 L292 70', style: 'fill:none;stroke:var(--linha);stroke-width:1.4;stroke-dasharray:4 4' }, z1);
    el('rect', { x: 292, y: 12, width: 336, height: 112, rx: 12, style: 'fill:color-mix(in srgb,#f1e4b8 30%,var(--folha));stroke:#c7a64a;stroke-width:1.5' }, z1);
    tx(304, 34, 'fase 1: álcool isopropílico', 'font-size:15px;font-weight:700;fill:var(--tinta)', z1);
    tx(320, 66, '(CH₃)₂CH–O–H', 'font-size:16px;fill:var(--tinta)', z1);
    el('line', { x1: 438, y1: 61, x2: 476, y2: 61, style: 'stroke:' + AZ + ';stroke-width:3;stroke-dasharray:3 5;stroke-linecap:round' }, z1);
    tx(482, 66, 'O–CH(CH₃)₂', 'font-size:16px;fill:var(--tinta)', z1);
    tx(486, 88, '|', 'font-size:14px;fill:var(--tinta)', z1); tx(483, 106, 'H', 'font-size:16px;fill:var(--tinta)', z1);
    tx(304, 112, 'ligação de hidrogênio', 'font-size:15px;font-weight:700;fill:' + AZ, z1);
    el('path', { d: 'M' + (X2 + W2 / 2) + ' 168 L292 190', style: 'fill:none;stroke:var(--linha);stroke-width:1.4;stroke-dasharray:4 4' }, z2);
    el('rect', { x: 292, y: 136, width: 336, height: 120, rx: 12, style: 'fill:color-mix(in srgb,' + AG + ' 35%,var(--folha));stroke:' + AGs + ';stroke-width:1.5' }, z2);
    tx(304, 158, 'fase 2: água + Na⁺ + Cl⁻', 'font-size:15px;font-weight:700;fill:var(--tinta)', z2);
    function ion(cx, cy, s, cor, pos, pai) {
      [0, 90, 180, 270].forEach(function (a) {
        var r = a * Math.PI / 180, ox = cx + Math.cos(r) * 30, oy = cy + Math.sin(r) * 30;
        var o1 = pos ? 1 : -1;   /* pos: O voltado para o ion; neg: H voltados */
        var hx = Math.cos(r), hy = Math.sin(r), px = -hy, py = hx;
        if (pos) { [-1, 1].forEach(function (k) { el('circle', { cx: ox + hx * 9 + px * 8 * k, cy: oy + hy * 9 + py * 8 * k, r: 5, style: 'fill:#f2f2f2;stroke:#777;stroke-width:1' }, pai); }); el('circle', { cx: ox, cy: oy, r: 8, style: 'fill:' + OX }, pai); }
        else { var qx = cx + Math.cos(r) * 38, qy = cy + Math.sin(r) * 38; el('circle', { cx: qx + hx * 6 + px * 9, cy: qy + hy * 6 + py * 9, r: 5, style: 'fill:#f2f2f2;stroke:#777;stroke-width:1' }, pai); el('circle', { cx: qx, cy: qy, r: 8, style: 'fill:' + OX }, pai); el('circle', { cx: cx + Math.cos(r) * 26, cy: cy + Math.sin(r) * 26, r: 5, style: 'fill:#f2f2f2;stroke:#777;stroke-width:1' }, pai); }
      });
      el('circle', { cx: cx, cy: cy, r: 13, style: 'fill:' + cor }, pai);
      tx(cx, cy + 5, s, 'font-size:14px;font-weight:700;fill:#fff;' + C, pai);
    }
    ion(370, 206, 'Na⁺', '#7a5ab0', true, z2);
    ion(476, 206, 'Cl⁻', VD, false, z2);
    tx(612, 196, 'íon-', 'font-size:15px;font-weight:700;fill:' + VM + ';text-anchor:end', z2);
    tx(612, 214, 'dipolo', 'font-size:15px;font-weight:700;fill:' + VM + ';text-anchor:end', z2);
    /* ---------- etapa 3: curvas de aquecimento ---------- */
    var g3 = el('g', {});
    var GX0 = 70, GX1 = 600, GY0 = 236, GY1 = 20, TMIN = 20, TMAX = 110;
    function gy(T) { return GY0 - (GY0 - GY1) * (T - TMIN) / (TMAX - TMIN); }
    el('path', { d: 'M' + GX0 + ' ' + GY1 + ' V' + GY0 + ' H' + GX1, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, g3);
    tx(GX1, GY0 + 20, 'tempo de aquecimento →', 'font-size:14px;fill:var(--lapis);text-anchor:end', g3);
    [40, 60, 80, 100].forEach(function (T) { el('line', { x1: GX0 - 4, x2: GX1, y1: gy(T), y2: gy(T), style: 'stroke:var(--linha);stroke-width:1' }, g3); tx(GX0 - 8, gy(T) + 5, T + '', 'font-size:14px;fill:var(--lapis);text-anchor:end', g3); });
    tx(14, 16, '°C', 'font-size:14px;fill:var(--lapis)', g3);
    function curva(Tb, T2, x1, x2) { /* sobe ate Tb em x1, ferve ate x2 subindo ate T2, vapor depois */
      return function (x) { return x < x1 ? 25 + (Tb - 25) * (x - GX0) / (x1 - GX0) : x < x2 ? Tb + (T2 - Tb) * (x - x1) / (x2 - x1) : T2 + (x - x2) * .12; };
    }
    var CV = [
      { f: curva(100, 100, 250, 470), c: AZ, n: 'água pura: patamar a 100 °C' },
      { f: curva(84, 95, 222, 460), c: '#8a8a8a', n: 'mistura comum: sobe enquanto ferve' },
      { f: curva(80.4, 80.4, 212, 450), c: VM, n: 'azeotrópica (isopropílico + água): 80,4 °C' }
    ];
    var lab3 = el('g', {}, g3);
    CV.forEach(function (c, i) { c.p = el('path', { style: 'fill:none;stroke:' + c.c + ';stroke-width:3' }, g3); c.t = el('g', {}, g3);
      el('line', { x1: 250, x2: 278, y1: 164 + i * 24, y2: 164 + i * 24, style: 'stroke:' + c.c + ';stroke-width:3' }, c.t); tx(286, 169 + i * 24, c.n, 'font-size:14px;font-weight:700;fill:' + c.c, c.t); });
    el('rect', { x: 206, y: gy(80.4) - 10, width: 250, height: 20, rx: 10, style: 'fill:none;stroke:' + VM + ';stroke-width:1.6;stroke-dasharray:4 3' }, lab3);
    /* ---------- etapa 4: funil de separacao ---------- */
    var g4 = el('g', {});
    var FX = 150, fun = 'M' + (FX - 12) + ' 14 H' + (FX + 12) + ' V26 C' + (FX + 92) + ' 52 ' + (FX + 92) + ' 110 ' + (FX + 6) + ' 152 V168 H' + (FX - 6) + ' V152 C' + (FX - 92) + ' 110 ' + (FX - 92) + ' 52 ' + (FX - 12) + ' 26 Z';
    var cp = el('clipPath', { id: uid + 'c' }, defs); el('path', { d: fun }, cp);
    var liq = el('g', { 'clip-path': 'url(#' + uid + 'c)' }, g4);
    var cima = el('rect', { x: FX - 100, width: 200, style: 'fill:#f1e4b8' }, liq);
    var baixo = el('rect', { x: FX - 100, width: 200, style: 'fill:' + AG }, liq);
    el('path', { d: fun, style: 'fill:none;stroke:var(--lapis);stroke-width:2.2;stroke-linejoin:round' }, g4);
    el('rect', { x: FX - 15, y: 6, width: 30, height: 10, rx: 3, style: 'fill:#8a8a8a' }, g4);
    el('path', { d: 'M' + (FX - 4) + ' 176 V204', style: 'stroke:var(--lapis);stroke-width:2.2' }, g4); el('path', { d: 'M' + (FX + 4) + ' 176 V204', style: 'stroke:var(--lapis);stroke-width:2.2' }, g4);
    el('rect', { x: FX - 9, y: 166, width: 18, height: 12, rx: 3, style: 'fill:#5f6b75' }, g4);
    var torn = el('rect', { x: FX - 26, y: 169, width: 52, height: 6, rx: 3, style: 'fill:#5f6b75' }, g4);
    var jato = el('rect', { x: FX - 2.5, y: 204, width: 5, style: 'fill:' + AG }, g4);
    var BX = FX, BQ = el('g', {}, g4);
    var bqL = el('rect', { x: BX - 47, width: 94, style: 'fill:' + AG }, BQ);
    bequer(BQ, BX, 96, 210, 262);
    var tCima = tx(FX + 108, 92, 'álcool (0,78)', 'font-size:15px;font-weight:700;fill:#9a7b1c', g4);
    var tBaixo = tx(FX + 108, 152, 'solução salina (1,2)', 'font-size:15px;font-weight:700;fill:' + AGs, g4);
    var tT = tx(FX + 34, 178, 'torneira', 'font-size:14px;fill:var(--lapis)', g4);
    var f1 = tx(400, 200, '', 'font-size:15px;font-weight:700;fill:' + VD, g4);
    var f2 = tx(400, 220, '', 'font-size:14px;fill:var(--tinta)', g4);
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 268, y2: 268, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 294, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 322 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Junta com água: mistura ou não?', 'Semelhante dissolve semelhante. Quem tem OH (ácido acético) faz ligação de H', 'com a água: uma fase só. Apolar ou pouco polar não se mistura: duas fases,', 'e a densidade decide: menor que 1 g/mL boia, maior afunda.'],
      ['2. Em cada fase, a força mais forte', 'Em cima, o menos denso: álcool, que faz ligação de hidrogênio (O–H ··· O).', 'Embaixo, a água salgada: cada íon fica cercado de água virada para ele,', 'O para o Na⁺ e H para o Cl⁻. É a interação íon-dipolo.'],
      ['3. Ferver a temperatura constante', 'Substância pura ferve num patamar fixo; mistura comum ferve subindo.', 'A mistura azeotrópica (álcool isopropílico + água) também ferve fixo, a 80,4 °C:', 'o vapor sai com a mesma composição, e a destilação simples não separa.'],
      ['4. Funil de separação (decantação)', 'Duas fases líquidas: abre-se a torneira e sai primeiro a de baixo,', 'a mais densa. Quando a divisa chega à torneira, fecha-se.', 'A fase de cima fica no funil. É assim que se separa a situação 3.']
    ];
    var _desenha = function (t) {
      var f = t < 5.5 ? 0 : t < 11 ? 1 : t < 16.5 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f === 0) {
        var p = ease((t - .4) / 1.6), s = ease((t - 2.2) / 1.2);
        B.forEach(function (b) {
          var hA = 56, hL = 40 * p, top = BB - hA - hL, x0 = b.cx - BW / 2;
          b.jato.setAttribute('y', 0); b.jato.setAttribute('height', 0);
          if (t > .4 && t < 2.1) { b.jato.setAttribute('y', 52); b.jato.setAttribute('height', (top - 52).toFixed(1)); }
          if (b.tipo === 'mis') {
            b.ag.setAttribute('y', (BB - hA).toFixed(1)); b.ag.setAttribute('height', hA - 1);
            b.li.setAttribute('y', top.toFixed(1)); b.li.setAttribute('height', Math.max(0, hL + hA * s - 1).toFixed(1)); op(b.li, 1);
            b.lab1.setAttribute('y', BB - 22); op(b.lab1, 1 - s); b.lab2.textContent = 'água + ácido'; b.lab2.setAttribute('y', BB - 40); op(b.lab2, s);
          } else if (b.tipo === 'cima') {
            b.ag.setAttribute('y', (BB - hA).toFixed(1)); b.ag.setAttribute('height', hA - 1);
            b.li.setAttribute('y', top.toFixed(1)); b.li.setAttribute('height', Math.max(hL, 0).toFixed(1));
            b.lab1.setAttribute('y', BB - 22); op(b.lab1, 1); b.lab2.textContent = 'ciclo-hexano'; b.lab2.setAttribute('y', (top + 24).toFixed(1)); op(b.lab2, s);
          } else {
            var yAg = lerp(BB - hA, BB - hA - 40 * p, s);   /* agua sobe quando o cloroformio afunda */
            b.ag.setAttribute('y', (lerp(BB - hA - hL, BB - hA - 40, s)).toFixed(1)); b.ag.setAttribute('height', hA);
            b.li.setAttribute('y', lerp(top, BB - 40, s).toFixed(1)); b.li.setAttribute('height', Math.max(0, 40 * p - 1).toFixed(1));
            if (s < .02) { b.ag.setAttribute('y', BB - hA); b.li.setAttribute('y', top.toFixed(1)); }
            b.lab1.setAttribute('y', (s > .5 ? BB - 62 : BB - 22)); op(b.lab1, 1); b.lab2.textContent = 'clorofórmio'; b.lab2.setAttribute('y', BB - 14); op(b.lab2, s);
          }
          op(b.ver, cl((t - 3.4) / .5));
        });
      }
      if (f === 1) { op(z1, cl((t - 6.2) / .5)); op(z2, cl((t - 7.6) / .5)); }
      if (f === 2) {
        var xm = GX0 + (GX1 - GX0) * ease((t - 11.3) / 3);
        CV.forEach(function (c) { var d = ''; for (var x = GX0; x <= xm; x += 4) d += (d ? 'L' : 'M') + x + ' ' + gy(c.f(x)).toFixed(1) + ' '; c.p.setAttribute('d', d); op(c.t, cl((t - 13.6) / .5)); });
        op(lab3, cl((t - 14.4) / .5));
      }
      if (f === 3) {
        var a = ease((t - 17.4) / 2.6), aberto = t > 17.2 && t < 20.1;
        var yI = lerp(110, 165, a), hTop = 42;
        cima.setAttribute('y', (yI - hTop - (a * 12)).toFixed(1)); cima.setAttribute('height', (hTop + a * 12).toFixed(1));
        baixo.setAttribute('y', yI.toFixed(1)); baixo.setAttribute('height', Math.max(0, 175 - yI).toFixed(1));
        tCima.setAttribute('y', (yI - 16).toFixed(1)); tBaixo.setAttribute('y', (yI + 24).toFixed(1)); op(tBaixo, 1 - cl((a - .7) / .3));
        torn.setAttribute('transform', aberto ? 'rotate(90 ' + FX + ' 172)' : '');
        var hb = 3 + 30 * a;
        jato.setAttribute('height', aberto ? (262 - hb - 204).toFixed(1) : 0); bqL.setAttribute('y', (262 - hb).toFixed(1)); bqL.setAttribute('height', hb.toFixed(1));
        f1.textContent = a < .99 ? 'torneira aberta: sai a fase de baixo' : 'divisa na torneira: fecha';
        f2.textContent = a < .99 ? '(a mais densa, a solução salina)' : 'o álcool (fase de cima) fica no funil';
      }
      var T = TXT[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    var FR = { P3d4d047: 5.45, Pee9ac0d: 5.45, P9449f8f: 10.95, P054feae: 21.95 };
    return fimResposta(VIS.def['fases-densidade-funil'], svg, _desenha, 22, RESP, qid, { semEsmaecer: true, y: 274, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 21.95; } });
  }
};
VIS.liga('fases-densidade-funil', ['P3d4d047', 'P9449f8f', 'Pee9ac0d', 'P054feae']);
