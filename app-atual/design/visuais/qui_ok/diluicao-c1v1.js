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
'Wad79c0a': ['Por isso a resposta é B', 'Na diluição só entra solvente: as partículas de soluto são as mesmas.', 'A massa (e a quantidade em mol) do soluto fica constante;', 'volume e massa de solvente aumentam, a concentração diminui.'],
'Pe0c25dd': ['Por isso a resposta é A', 'De 0,5 mol/L para 0,1 mol/L a concentração tem de cair 5 vezes:', 'basta acrescentar água até o volume ficar 5 vezes maior (diluição).'],
'P6364cfb': ['Por isso a resposta é D', '25 mol/L · V₁ = 0,5 mol/L · 100 mL → V₁ = 2 mL = 2,0 × 10⁻³ L.', 'Pipeta 2 mL do estoque e completa com água até 100 mL.'],
'Paadc010': ['Por isso a resposta é E', 'Estoque: 10 g/100 mL = 100 g/L. 100 g/L · 10 mL = C₂ · 1000 mL → 1 g/L.', 'Em mol: 1 g/L ÷ 250 g/mol = 4 × 10⁻³ mol/L.'],
'Pdfba335': ['Por isso a resposta é B', 'Ampola: 5 mg/mL · 10 mL = 50 mg de nitroglicerina.', 'Em 500 mL: 50 mg/500 mL = 0,1 mg/mL = 0,1 g/L.'],
'W78fcc7c': ['Por isso a resposta é B', '0,25 mol/L · V₁ = 0,060 mol/L · 50 mL → V₁ = 12 mL.', 'Aspira 12 mL da ampola e completa até 50 mL.'],
'W9bd6ffe': ['Por isso a resposta é B', '60 g/L · V₁ = 40 g/L · 750 mL → V₁ = 500 mL.', 'Os 500 mL recebem água até 750 mL.'],
'P02b17d4': ['Por isso a resposta é A', '100 mL a 1 mol/L têm 0,1 mol ≈ 6 × 10²² moléculas.', 'Cada CH divide por 100: em 11CH sobram cerca de 6 moléculas nos', '100 mL; em 12CH, 0,06: em média, nenhuma molécula.']
};
VIS.def['diluicao-c1v1'] = {
  tit: 'Diluir: mais solvente, o mesmo soluto',
  fontes: ['OpenStax, Chemistry 2e, 3.3 Molarity (diluição, C₁V₁ = C₂V₂) — https://openstax.org/books/chemistry-2e/pages/3-3-molarity', 'Khan Academy, Dilution — https://www.khanacademy.org/science/chemistry/states-of-matter-and-intermolecular-forces/mixtures-and-solutions/a/molarity', 'Constante de Avogadro 6,022 × 10²³ mol⁻¹: IUPAC Gold Book, Avogadro constant — https://goldbook.iupac.org/terms/view/A00543'],
  tipo: 'anim', dur: 16,
  marcas: [[0, 'Diluir'], [5, 'A conta'], [10, 'Série CH']],
  cred: 'Animação feita para o app (esquema; cada ponto representa muitas partículas de soluto).',
  nota: 'Na diluição a quantidade de soluto (massa ou mol) não muda; só aumenta o volume. Por isso C₁ · V₁ = C₂ · V₂, com as mesmas unidades dos dois lados.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function br(v, n) { return v.toFixed(n).replace('.', ','); }
    var SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    function sci(v, d) { var e = Math.floor(Math.log10(Math.abs(v)) + 1e-9), m = v / Math.pow(10, e); if (Math.abs(m - 10) < 1e-9) { m = 1; e++; } return br(m, d) + ' × 10' + String(e).split('').map(function (c) { return SUP[c]; }).join(''); }
    function num(v) { var s = (Math.round(v * 1000) / 1000).toString().replace('.', ','); return s; }
    var SOL = '#7d4fa8', AG = '#d6e7f6', VM = '#b4442f', AZ = '#2b6cb0', VD = '#1f8a70';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    /* ---------- etapa 1: bequer ---------- */
    var g1 = el('g', {});
    var BX = 150, BW = 150, BY0 = 40, BY1 = 236;
    var liq1 = el('rect', { x: BX - BW / 2 + 1, width: BW - 2, style: 'fill:' + AG }, g1);
    el('path', { d: 'M' + (BX - BW / 2 - 6) + ' ' + BY0 + ' L' + (BX - BW / 2) + ' ' + (BY0 + 6) + ' V' + BY1 + ' H' + (BX + BW / 2) + ' V' + BY0, style: 'fill:none;stroke:var(--lapis);stroke-width:2.2' }, g1);
    var nv = el('text', { x: BX + BW / 2 + 10, style: 'font-size:14px;font-weight:700;fill:' + AZ }, g1);
    var jato = el('rect', { x: BX - 3, width: 6, y: 20, style: 'fill:' + AG }, g1);
    var torn = el('path', { d: 'M' + (BX - 18) + ' 8 h36 v8 h-14 v6 h-8 v-6 h-14 z', style: 'fill:#8a96a0' }, g1);
    var PART = []; for (var i = 0; i < 10; i++) PART.push({ c: el('circle', { r: 6, style: 'fill:' + SOL }, g1), rx: (i * 0.618034 + .1) % 1, ry: ((i * 7) % 10) / 10 + .05 });
    var V1 = 100, V2 = 500, n = 0.05;
    var pain = el('g', {}, g1), PX = 350;
    var t1 = tx(PX, 64, '', 'font-size:16px;fill:var(--tinta)', pain), t2 = tx(PX, 98, '', 'font-size:16px;fill:var(--tinta)', pain), t3 = tx(PX, 132, '', 'font-size:16px;font-weight:700;fill:var(--tinta)', pain);
    var t4 = tx(PX, 180, 'C₁ · V₁ = C₂ · V₂', 'font-size:20px;font-weight:700;fill:' + VM, pain);
    var t5 = tx(PX, 206, '0,5 · 100 = 0,1 · 500 = 50 (mmol)', 'font-size:15px;fill:var(--tinta)', pain);
    /* ---------- etapa 2: a conta ---------- */
    var g2 = el('g', {});
    var CASOS = {
      P6364cfb: { u: 'mol/L', C1: 25, C2: 0.5, V2: 100, ach: 'V1', fim: ['V₁ = 2 mL = 2,0 × 10⁻³ L'] },
      W78fcc7c: { u: 'mol/L', C1: 0.25, C2: 0.06, V2: 50, ach: 'V1', fim: ['V₁ = 12 mL'] },
      W9bd6ffe: { u: 'g/L', C1: 60, C2: 40, V2: 750, ach: 'V1', fim: ['V₁ = 500 mL'] },
      Paadc010: { u: 'g/L', C1: 100, V1: 10, V2: 1000, ach: 'C2', fim: ['C₂ = 1 g/L', '1 g/L ÷ 250 g/mol = 4 × 10⁻³ mol/L'] },
      Pdfba335: { u: 'mg/mL', C1: 5, V1: 10, V2: 500, ach: 'C2', fim: ['C₂ = 0,1 mg/mL = 0,1 g/L'] }
    };
    var K = CASOS[qid] || { u: 'mol/L', C1: 2, C2: 0.5, V2: 100, ach: 'V1', fim: ['V₁ = 25 mL'] };
    if (K.ach === 'V1') K.V1 = K.C2 * K.V2 / K.C1; else K.C2 = K.C1 * K.V1 / K.V2;
    /* frasco estoque, pipeta, balao */
    el('path', { d: 'M54 92 h40 v18 q28 10 28 40 v80 q0 6 -6 6 h-84 q-6 0 -6 -6 v-80 q0 -30 28 -40 z', style: 'fill:color-mix(in srgb,' + SOL + ' 28%,var(--folha));stroke:var(--lapis);stroke-width:2' }, g2);
    tx(74, 176, 'estoque', 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, g2);
    tx(74, 196, 'C₁ = ' + num(K.C1), 'font-size:14px;fill:var(--tinta);' + C, g2);
    tx(74, 214, K.u, 'font-size:14px;fill:var(--tinta);' + C, g2);
    var pip = el('g', {}, g2);
    el('rect', { x: -4, y: 0, width: 8, height: 90, rx: 3, style: 'fill:color-mix(in srgb,' + SOL + ' 20%,var(--folha));stroke:var(--lapis);stroke-width:1.6' }, pip);
    tx(-10, 40, 'V₁ = ' + num(K.V1) + ' mL', 'font-size:14px;font-weight:700;text-anchor:end;fill:' + SOL, pip);
    var bal = el('g', {}, g2), BLX = 236;
    var fd = 'M' + (BLX - 7) + ' 50 V148 A46 46 0 1 0 ' + (BLX + 7) + ' 148 V50';
    var uid = 'd' + Math.random().toString(36).slice(2, 8), defs = el('defs', {});
    var cp = el('clipPath', { id: uid }, defs); el('path', { d: fd + ' Z' }, cp);
    var bIn = el('g', { 'clip-path': 'url(#' + uid + ')' }, bal);
    var balLiq = el('rect', { x: BLX - 50, width: 100, style: 'fill:' + SOL }, bIn);
    el('path', { d: fd, style: 'fill:none;stroke:var(--lapis);stroke-width:2' }, bal);
    el('line', { x1: BLX - 12, x2: BLX + 12, y1: 78, y2: 78, style: 'stroke:' + VM + ';stroke-width:2' }, bal);
    tx(BLX + 16, 82, 'V₂ = ' + num(K.V2) + ' mL', 'font-size:14px;font-weight:700;fill:' + VM, bal);
    var agT = tx(BLX, 34, '+ água até o traço', 'font-size:14px;font-weight:700;fill:' + AZ + ';' + C, bal);
    var EQ = el('g', {}, g2), EX = 360;
    var eqs = [tx(EX, 70, 'C₁ · V₁ = C₂ · V₂', 'font-size:20px;font-weight:700;fill:' + VM, EQ),
      tx(EX, 108, (K.ach === 'V1' ? num(K.C1) + ' · V₁ = ' + num(K.C2) + ' · ' + num(K.V2) : num(K.C1) + ' · ' + num(K.V1) + ' = C₂ · ' + num(K.V2)), 'font-size:17px;fill:var(--tinta)', EQ),
      tx(EX, 132, '(' + K.u + ' e mL dos dois lados)', 'font-size:14px;fill:var(--lapis)', EQ)];
    K.fim.forEach(function (s, i) { eqs.push(tx(EX, 172 + i * 28, s, 'font-size:17px;font-weight:700;fill:var(--tinta)', EQ)); });
    /* ---------- etapa 3: diluicoes centesimais ---------- */
    var g3 = el('g', {});
    var NA = 6.022e23, N0 = 0.1 * NA;   /* 100 mL a 1 mol/L */
    for (i = 0; i < 4; i++) {
      var x = 40 + i * 70; el('path', { d: 'M' + (x - 22) + ' 40 V96 H' + (x + 22) + ' V40', style: 'fill:none;stroke:var(--lapis);stroke-width:1.8' }, g3);
      el('rect', { x: x - 21, y: 56, width: 42, height: 39, style: 'fill:color-mix(in srgb,' + SOL + ' ' + Math.round(60 / Math.pow(3, i)) + '%,' + AG + ')' }, g3);
      tx(x, 116, i + 'CH', 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, g3);
      if (i < 3) el('path', { d: 'M' + (x + 24) + ' 50 q22 -16 44 0 m-8 -6 l8 6 l-9 3', style: 'fill:none;stroke:var(--lapis);stroke-width:1.6' }, g3);
    }
    tx(320, 46, '1 parte + 99 de solvente:', 'font-size:15px;font-weight:700;fill:var(--tinta)', g3);
    tx(320, 68, 'a concentração cai 100 vezes', 'font-size:15px;fill:var(--tinta)', g3);
    tx(320, 96, 'moléculas em 100 mL:', 'font-size:15px;fill:var(--lapis)', g3);
    var cont = tx(320, 128, '', 'font-size:24px;font-weight:700;fill:' + SOL + ';font-variant-numeric:tabular-nums', g3);
    var contCH = tx(320, 156, '', 'font-size:16px;font-weight:700;fill:var(--tinta)', g3);
    /* barra log */
    var LX0 = 40, LX1 = 600, LY = 210;
    el('line', { x1: LX0, x2: LX1, y1: LY, y2: LY, style: 'stroke:var(--linha);stroke-width:10;stroke-linecap:round' }, g3);
    var barra = el('line', { x1: LX0, y1: LY, y2: LY, style: 'stroke:' + SOL + ';stroke-width:10;stroke-linecap:round' }, g3);
    for (i = 0; i <= 12; i++) { var xx = LX0 + (LX1 - LX0) * i / 12; tx(xx, LY + 30, i + '', 'font-size:14px;fill:var(--lapis);' + C, g3); }
    tx(LX0, LY - 14, 'diluições (CH):', 'font-size:14px;fill:var(--lapis)', g3);
    var marca = el('circle', { r: 9, cy: LY, style: 'fill:var(--folha);stroke:' + SOL + ';stroke-width:3' }, g3);
    var um = tx(LX1, LY - 14, '', 'font-size:14px;font-weight:700;fill:' + VM + ';text-anchor:end', g3);
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 272, y2: 272, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 298, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 326 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Diluir é só acrescentar solvente', 'As mesmas partículas de soluto passam a ocupar um volume maior.', 'A quantidade de soluto (mol ou massa) não muda; a concentração cai', 'na mesma proporção em que o volume cresce (×5 no volume, ÷5 na C).'],
      ['2. A conta: C₁ · V₁ = C₂ · V₂', 'C · V é a quantidade de soluto, que é a mesma antes e depois.', 'Retira-se V₁ do estoque e completa-se com água até V₂.', 'Use a mesma unidade de volume dos dois lados.'],
      ['3. Diluir de novo e de novo', 'Cada diluição centesimal (CH) divide por 100 o número de moléculas.', 'Começando com 0,1 mol (6 × 10²² moléculas), depois de n diluições', 'sobram 6 × 10²² ÷ 100ⁿ. Quando o resultado fica abaixo de 1, acabou.']
    ];
    var _desenha = function (t) {
      var f = t < 5 ? 0 : t < 10 ? 1 : 2;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0);
      if (f === 0) {
        var u = ease((t - 1) / 2.4), V = lerp(V1, V2, u), h = 34 * V / 100, top = BY1 - h;
        liq1.setAttribute('y', top.toFixed(1)); liq1.setAttribute('height', h.toFixed(1));
        nv.setAttribute('y', (top + 5).toFixed(1)); nv.textContent = Math.round(V) + ' mL';
        jato.setAttribute('height', t > 1 && t < 3.4 ? (top - 20).toFixed(1) : 0);
        PART.forEach(function (p) { p.c.setAttribute('cx', (BX - BW / 2 + 14 + p.rx * (BW - 28)).toFixed(1)); p.c.setAttribute('cy', (top + 10 + p.ry * (h - 20)).toFixed(1)); });
        t1.textContent = 'soluto: ' + br(n, 2) + ' mol (10 pontos) — não muda';
        t2.textContent = 'volume: ' + Math.round(V) + ' mL';
        t3.textContent = 'C = ' + br(n / (V / 1000), 2) + ' mol/L';
        op(t4, cl((t - 3.6) / .4)); op(t5, cl((t - 3.8) / .4));
      }
      if (f === 1) {
        var a = ease((t - 5.4) / 1.4), b = ease((t - 6.8) / 1.6);
        pip.setAttribute('transform', 'translate(' + lerp(74, BLX, a).toFixed(1) + ' ' + lerp(14, 4, a).toFixed(1) + ')'); op(pip, 1 - cl((t - 7) / .4));
        var nivel = b > 0 ? lerp(226, 78, b) : 236 - 10 * a;
        balLiq.setAttribute('y', nivel.toFixed(1)); balLiq.setAttribute('height', (240 - nivel).toFixed(1));
        balLiq.setAttribute('style', 'fill:' + (b > 0 ? 'color-mix(in srgb,' + SOL + ' ' + Math.round(lerp(80, 28, b)) + '%,' + AG + ')' : SOL));
        op(agT, b > 0 && b < 1 ? 1 : 0);
        eqs.forEach(function (e, i) { op(e, cl((t - 6 - i * .6) / .4)); });
      }
      if (f === 2) {
        var k = Math.min(12, Math.floor((t - 10.4) / 0.42) + 0); if (k < 0) k = 0;
        var N = N0 / Math.pow(100, k);
        cont.textContent = N >= 100 ? sci(N, 1) : br(N, N < 1 ? 2 : 0);
        contCH.textContent = k + 'CH' + (N < 1 ? ': menos de 1 molécula' : '');
        contCH.style.fill = N < 1 ? VM : 'var(--tinta)';
        var xk = LX0 + (LX1 - LX0) * k / 12; barra.setAttribute('x2', xk.toFixed(1)); marca.setAttribute('cx', xk.toFixed(1));
        um.textContent = k >= 12 ? '12CH: em média, nenhuma' : ''; 
      }
      var T = TXT[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    var FR = { Wad79c0a: 4.95, Pe0c25dd: 4.95, P6364cfb: 9.95, Paadc010: 9.95, Pdfba335: 9.95, W78fcc7c: 9.95, W9bd6ffe: 9.95, P02b17d4: 15.95 };
    return fimResposta(VIS.def['diluicao-c1v1'], svg, _desenha, 16, RESP, qid, { semEsmaecer: true, y: 278, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 15.95; } });
  }
};
VIS.liga('diluicao-c1v1', ['P6364cfb', 'Paadc010', 'Pdfba335', 'Pe0c25dd', 'W78fcc7c', 'W9bd6ffe', 'Wad79c0a', 'P02b17d4']);
