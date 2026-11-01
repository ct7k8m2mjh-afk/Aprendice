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
'W5b5567d': ['Por isso a resposta é D', 'Papel: vira CO₂ e H₂O, gases que vão embora → A fica mais leve e sobe.', 'Palha de aço: o ferro prende o O₂ do ar num óxido sólido que fica', 'no prato → A fica mais pesado e desce.'],
'W3456911': ['Por isso a resposta é C', 'Exp. 1: AgCl sólido e NaNO₃ dissolvido ficam no béquer: F₁ = I.', 'Exp. 2: o CO₂ formado é gás e sai pela boca aberta: F₂ < I.'],
'Pd96ae3d': ['Por isso a resposta é D', 'Sumiram 200 − 156 = 44 kg dos sólidos: é o CO₂ (1 mol = 44).', '44 kg de CO₂ vêm de 106 kg de Na₂CO₃ (1 : 1 em mol).', 'SiO₂ = 200 − 106 = 94 kg → 94/200 = 47%.'],
'P845fd22': ['Por isso a resposta é C', 'O ganho de 1,20 g é O₂ do ar: 1,20/32 = 0,0375 mol de O₂.', 'Pela equação (½ O₂ por aldeído), oxidaram 2 × 0,0375 = 0,075 mol.', 'Havia 19,80/132 = 0,15 mol → 0,075/0,15 = 50%.']
};
VIS.def['conservacao-massa-sistema-aberto'] = {
  tit: 'A massa se conserva: o que muda é o que entra ou sai',
  fontes: ['OpenStax, Chemistry 2e, 4.1 Writing and Balancing Chemical Equations (lei da conservação da massa) — https://openstax.org/books/chemistry-2e/pages/4-1-writing-and-balancing-chemical-equations', 'OpenStax, Chemistry 2e, 4.3 Reaction Stoichiometry — https://openstax.org/books/chemistry-2e/pages/4-3-reaction-stoichiometry', 'Wikipedia (en), Conservation of mass — https://en.wikipedia.org/wiki/Conservation_of_mass'],
  tipo: 'anim', dur: 20,
  marcas: [[0, 'Papel'], [5, 'Palha de aço'], [10, 'Béquer'], [15, 'Contas']],
  cred: 'Animação feita para o app (esquema; inclinação da balança exagerada; o óxido da palha de aço aparece como Fe₂O₃, simplificado — forma-se principalmente Fe₃O₄). Massas molares: Na 23, C 12, O 16, Si 28 g/mol.',
  nota: 'Num sistema fechado a massa total não muda (Lavoisier). Num sistema aberto a balança acusa o que entrou (O₂ do ar preso num sólido) ou o que saiu (gás que escapa). A diferença de massa mede esse gás e permite fazer as contas.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function br(v, n) { return v.toFixed(n).replace('.', ','); }
    var VM = '#b4442f', AZ = '#2b6cb0', VD = '#1f8a70', FO = '#e08a2b';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    /* ---------- balanca de pratos (etapas 1 e 2) ---------- */
    var gB = el('g', {});
    var PX = 320, PY = 70, BL = 170;
    el('path', { d: 'M' + PX + ' ' + PY + ' L' + (PX - 26) + ' 250 H' + (PX + 26) + ' Z', style: 'fill:color-mix(in srgb,var(--lapis) 18%,var(--folha));stroke:var(--lapis);stroke-width:1.6' }, gB);
    var viga = el('line', { style: 'stroke:var(--tinta);stroke-width:5;stroke-linecap:round' }, gB);
    el('circle', { cx: PX, cy: PY, r: 6, style: 'fill:var(--tinta)' }, gB);
    var ponteiro = el('line', { style: 'stroke:' + VM + ';stroke-width:2.4' }, gB);
    function prato(lab) {
      var g = el('g', {}, gB);
      el('path', { d: 'M0 0 L-44 92 M0 0 L44 92', style: 'stroke:var(--lapis);stroke-width:1.4' }, g);
      el('path', { d: 'M-58 92 H58 Q50 108 0 108 Q-50 108 -58 92 Z', style: 'fill:color-mix(in srgb,var(--lapis) 22%,var(--folha));stroke:var(--lapis);stroke-width:1.6' }, g);
      tx(0, 132, lab, 'font-size:16px;font-weight:700;fill:var(--tinta);' + C, g);
      return g;
    }
    var pA = prato('A'), pB = prato('B');
    function papel(pai) { return el('path', { d: 'M-30 92 L-24 74 L22 70 L30 88 Z', style: 'fill:#f3efe2;stroke:#a89f84;stroke-width:1.4' }, pai); }
    function palha(pai, cor) { var d = 'M-30 90'; for (var i = 0; i < 14; i++) d += ' q' + (6 + (i % 3) * 3) + ' ' + (-18 + (i % 4) * 4) + ' ' + (10 - (i % 2) * 6) + ' ' + (i % 2 ? 4 : -2); return el('path', { d: d + ' L30 90', style: 'fill:none;stroke:' + cor + ';stroke-width:2;stroke-linejoin:round' }, pai); }
    var aPap = papel(pA), bPap = papel(pB), cinza = el('path', { d: 'M-16 92 q8 -6 16 -2 q8 -5 14 2 Z', style: 'fill:#6d6d6d' }, pA);
    var aPal = palha(pA, '#8a8f96'), bPal = palha(pB, '#8a8f96'), oxi = palha(pA, '#8b3a1e');
    var chama = el('path', { d: 'M-10 70 q-8 -16 4 -32 q2 12 8 14 q4 -10 2 -20 q16 14 6 38 Z', style: 'fill:' + FO + ';opacity:.85' }, pA);
    var gas = []; for (var i = 0; i < 4; i++) gas.push(tx(0, 0, i % 2 ? 'H₂O' : 'CO₂', 'font-size:14px;font-weight:700;fill:' + VM + ';' + C, gB));
    var oxs = []; for (i = 0; i < 4; i++) oxs.push(tx(0, 0, 'O₂', 'font-size:14px;font-weight:700;fill:' + AZ + ';' + C, gB));
    var eqB = tx(PX, 290 - 20, '', 'font-size:15px;font-weight:700;fill:var(--tinta);' + C, gB);
    var resB = tx(PX, 24, '', 'font-size:16px;font-weight:700;' + C, gB);
    eqB.setAttribute('y', 262);
    /* ---------- etapa 3: balancas digitais ---------- */
    var g3 = el('g', {});
    function digital(cx, titulo, sub) {
      var g = el('g', {}, g3), o = { g: g };
      tx(cx, 22, titulo, 'font-size:16px;font-weight:700;fill:var(--tinta);' + C, g);
      tx(cx, 42, sub, 'font-size:14px;fill:var(--lapis);' + C, g);
      el('path', { d: 'M' + (cx - 46) + ' 86 V176 Q' + (cx - 46) + ' 184 ' + (cx - 38) + ' 184 H' + (cx + 38) + ' Q' + (cx + 46) + ' 184 ' + (cx + 46) + ' 176 V86', style: 'fill:none;stroke:var(--lapis);stroke-width:2.2' }, g);
      o.liq = el('rect', { x: cx - 45, y: 128, width: 90, height: 55, style: 'fill:#dceaf6' }, g);
      o.pre = el('rect', { x: cx - 45, y: 176, width: 90, height: 7, style: 'fill:#fbfbfb;stroke:#777;stroke-width:1' }, g);
      el('rect', { x: cx - 100, y: 186, width: 200, height: 12, rx: 3, style: 'fill:#9aa3ab' }, g);
      el('rect', { x: cx - 92, y: 198, width: 184, height: 48, rx: 8, style: 'fill:#4b545c' }, g);
      el('rect', { x: cx - 62, y: 206, width: 124, height: 32, rx: 4, style: 'fill:#d9e8d0' }, g);
      o.vis = tx(cx + 54, 229, '', 'font-size:20px;font-weight:700;fill:#1e2a1a;text-anchor:end;font-variant-numeric:tabular-nums', g);
      o.res = tx(cx, 74, '', 'font-size:16px;font-weight:700;' + C, g);
      return o;
    }
    var E1 = digital(160, 'Exp. 1: AgNO₃ + NaCl', 'produtos: AgCl(s) + NaNO₃(aq)'), E2 = digital(480, 'Exp. 2: HCl + Na₂CO₃', 'produtos: NaCl(aq) + H₂O + CO₂(g)');
    var bol = []; for (i = 0; i < 6; i++) bol.push(el('circle', { r: 4, style: 'fill:none;stroke:' + VM + ';stroke-width:1.6' }, g3));
    var co2 = []; for (i = 0; i < 3; i++) co2.push(tx(0, 0, 'CO₂', 'font-size:14px;font-weight:700;fill:' + VM + ';' + C, g3));
    var I0 = 250, mNa2CO3 = 5.30, mCO2 = mNa2CO3 / 106 * 44;   /* 0,05 mol -> 2,20 g */
    /* ---------- etapa 4: contas ---------- */
    var g4 = el('g', {});
    var cin = qid === 'P845fd22';
    var KX = 1.9;   /* px por kg (ou por 0,1 g) */
    function barra(y, partes, rot, pai) {
      var x = 120, g = el('g', {}, pai);
      tx(108, y + 21, rot, 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:end', g);
      partes.forEach(function (p) { var w = p[0] * p[3]; el('rect', { x: x, y: y, width: w, height: 30, style: 'fill:color-mix(in srgb,' + p[2] + ' 22%,var(--folha));stroke:' + p[2] + ';stroke-width:1.4' }, g); tx(x + w / 2, y + 20, p[1], 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, g); x += w; });
      return { g: g, x: x };
    }
    var b1, b2, sai, cont;
    if (!cin) {
      var mC = 200 - 156, nC = mC / 44, mCarb = nC * 106, mSi = 200 - mCarb, mSil = nC * 122, mSiR = mSi - nC * 60;
      tx(14, 26, 'Na₂CO₃(s) + SiO₂(s) → Na₂SiO₃(s) + CO₂(g)', 'font-size:16px;font-weight:700;fill:var(--tinta)', g4);
      b1 = barra(48, [[mCarb, 'Na₂CO₃ ' + mCarb + ' kg', '#c98a12', KX], [mSi, 'SiO₂ ' + mSi + ' kg', AZ, KX]], 'antes: 200 kg', g4);
      b2 = barra(112, [[mSil, 'Na₂SiO₃ ' + mSil + ' kg', VD, KX], [mSiR, 'SiO₂ ' + mSiR, AZ, KX]], 'depois: 156 kg', g4);
      sai = el('g', {}, g4);
      el('rect', { x: b2.x + 6, y: 112, width: mC * KX, height: 30, rx: 4, style: 'fill:none;stroke:' + VM + ';stroke-width:1.6;stroke-dasharray:5 4' }, sai);
      tx(b2.x + 6 + mC * KX / 2, 132, 'CO₂ ' + mC, 'font-size:14px;font-weight:700;fill:' + VM + ';' + C, sai);
      el('path', { d: 'M' + (b2.x + 6 + mC * KX / 2) + ' 108 v-12 m-5 5 l5 -5 l5 5', style: 'fill:none;stroke:' + VM + ';stroke-width:1.8' }, sai);
      cont = el('g', {}, g4);
      ['1 Na₂CO₃ (106) → 1 CO₂ (44): saíram ' + mC + ' kg de CO₂ → havia ' + mCarb + ' kg de Na₂CO₃', 'SiO₂ = 200 − ' + mCarb + ' = ' + mSi + ' kg → ' + mSi + '/200 = ' + Math.round(mSi / 200 * 100) + '% da mistura'].forEach(function (s, i) { tx(14, 182 + i * 26, s, 'font-size:15px;' + (i ? 'font-weight:700;fill:' + VM : 'fill:var(--tinta)'), cont); });
    } else {
      var m0 = 19.80, dm = 1.20, n0 = m0 / 132, nO2 = dm / 32, nOx = 2 * nO2, pct = nOx / n0 * 100;
      tx(14, 26, 'cinamaldeído + ½ O₂(g) → ácido cinâmico (nada sai do frasco)', 'font-size:16px;font-weight:700;fill:var(--tinta)', g4);
      b1 = barra(48, [[m0 * 10, br(m0, 2) + ' g', '#c98a12', 1.2]], 'antes', g4);
      b2 = barra(112, [[m0 * 10, br(m0, 2) + ' g', '#c98a12', 1.2], [dm * 10, '', AZ, 1.2]], 'depois', g4);
      sai = el('g', {}, g4);
      tx(b2.x + 8, 132, '+ ' + br(dm, 2) + ' g de O do ar', 'font-size:15px;font-weight:700;fill:' + AZ, sai);
      cont = el('g', {}, g4);
      ['O₂ que entrou: ' + br(dm, 2) + ' ÷ 32 = ' + br(nO2, 4) + ' mol', 'aldeído oxidado: 2 × ' + br(nO2, 4) + ' = ' + br(nOx, 3) + ' mol (½ O₂ por molécula)', 'havia ' + br(m0, 2) + ' ÷ 132 = ' + br(n0, 2) + ' mol → ' + br(nOx, 3) + ' ÷ ' + br(n0, 2) + ' = ' + Math.round(pct) + '%'].forEach(function (s, i) { tx(14, 176 + i * 26, s, 'font-size:15px;' + (i === 2 ? 'font-weight:700;fill:' + VM : 'fill:var(--tinta)'), cont); });
    }
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 272, y2: 272, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 298, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 326 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Queimar papel num prato aberto', 'A celulose (C, H, O) reage com O₂ e vira CO₂ e H₂O, que são gases', 'e vão embora. Sobra um pouco de cinza: o prato A fica mais leve e sobe.', 'A massa não sumiu: saiu do prato junto com os gases.'],
      ['2. Queimar palha de aço', 'O ferro reage com o O₂ do ar e forma óxido de ferro, um sólido', 'que fica no prato: 4 Fe(s) + 3 O₂(g) → 2 Fe₂O₃(s).', 'Entrou a massa do oxigênio: o prato A fica mais pesado e desce.'],
      ['3. Béquer aberto em cima da balança', 'Sem gás nos produtos, nada sai: a massa final é igual à inicial.', 'Com CO₂ nos produtos, o gás escapa e a balança marca menos.', 'Em frasco fechado a massa não mudaria nos dois casos.'],
      cin ? ['4. A diferença de massa é o gás que entrou', 'Nada evaporou; o frasco só ganhou o O₂ do ar, preso no produto.', 'Massa → mol de O₂ → mol de aldeído oxidado (½ O₂ cada).', 'Compare com os mol de aldeído que havia no começo.'] : ['4. A diferença de massa é o gás que saiu', 'No reator, só o CO₂ é gás: 200 − 156 = 44 kg de CO₂ saíram.', 'A proporção da equação liga o gás ao reagente que o formou.', 'O resto da mistura inicial era SiO₂.']
    ];
    function poseB(th) {
      var r = th * Math.PI / 180, ax = PX - BL * Math.cos(r), ay = PY - BL * Math.sin(r), bx = PX + BL * Math.cos(r), by = PY + BL * Math.sin(r);
      viga.setAttribute('x1', ax.toFixed(1)); viga.setAttribute('y1', ay.toFixed(1)); viga.setAttribute('x2', bx.toFixed(1)); viga.setAttribute('y2', by.toFixed(1));
      pA.setAttribute('transform', 'translate(' + ax.toFixed(1) + ' ' + ay.toFixed(1) + ')'); pB.setAttribute('transform', 'translate(' + bx.toFixed(1) + ' ' + by.toFixed(1) + ')');
      ponteiro.setAttribute('x1', PX); ponteiro.setAttribute('y1', PY); ponteiro.setAttribute('x2', (PX - 40 * Math.sin(r)).toFixed(1)); ponteiro.setAttribute('y2', (PY + 40 * Math.cos(r)).toFixed(1));
      return [ax, ay];
    }
    var _desenha = function (t) {
      var f = t < 5 ? 0 : t < 10 ? 1 : t < 15 ? 2 : 3;
      op(gB, f < 2 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f < 2) {
        var lt = t - f * 5, q = ease((lt - .8) / 2.2), th = f === 0 ? 9 * ease((lt - 2.4) / 1.4) : -9 * ease((lt - 2.4) / 1.4);   /* th > 0: prato A sobe */
        var a = poseB(th);
        op(aPap, f === 0 ? 1 - q : 0); op(bPap, f === 0 ? 1 : 0); op(cinza, f === 0 ? q : 0);
        op(aPal, f === 1 ? 1 - q : 0); op(bPal, f === 1 ? 1 : 0); op(oxi, f === 1 ? q : 0);
        op(chama, lt > .6 && lt < 3.2 ? .85 : 0);
        gas.forEach(function (g, i) { var w = ((lt - .8) * .5 + i / gas.length) % 1; g.setAttribute('x', (a[0] - 42 + i * 28).toFixed(1)); g.setAttribute('y', (a[1] + 56 - 80 * w).toFixed(1)); op(g, f === 0 && lt > .8 && lt < 3.6 ? Math.sin(Math.PI * w) : 0); });
        oxs.forEach(function (g, i) { var w = ((lt - .8) * .5 + i / oxs.length) % 1; g.setAttribute('x', (a[0] - 90 + 60 * w).toFixed(1)); g.setAttribute('y', (a[1] + 10 + i * 14 + 30 * w).toFixed(1)); op(g, f === 1 && lt > .8 && lt < 3.4 ? Math.sin(Math.PI * w) : 0); });
        eqB.textContent = f === 0 ? 'papel + O₂ → CO₂(g) + H₂O(g) + cinza' : '4 Fe(s) + 3 O₂(g) → 2 Fe₂O₃(s)';
        resB.textContent = f === 0 ? 'A sobe: perdeu os gases' : 'A desce: ganhou o oxigênio';
        resB.style.fill = f === 0 ? VM : AZ; op(resB, cl((lt - 3.4) / .4)); op(eqB, cl((lt - 1) / .4));
      }
      if (f === 2) {
        var u = ease((t - 10.8) / 2.6);
        E1.vis.textContent = br(I0, 2) + ' g'; E2.vis.textContent = br(I0 - mCO2 * u, 2) + ' g';
        op(E1.pre, u); E1.pre.setAttribute('y', 183 - 8 * u); E1.pre.setAttribute('height', 8 * u);
        E1.res.textContent = 'F₁ = I'; E1.res.style.fill = VD; E2.res.textContent = 'F₂ < I'; E2.res.style.fill = VM;
        op(E1.res, cl((t - 13.4) / .4)); op(E2.res, cl((t - 13.4) / .4));
        bol.forEach(function (b, i) { var w = ((t - 10.8) * .9 + i / bol.length) % 1; b.setAttribute('cx', 452 + (i * 23) % 56); b.setAttribute('cy', (178 - 48 * w).toFixed(1)); op(b, t > 10.8 && t < 13.6 ? Math.sin(Math.PI * w) : 0); });
        co2.forEach(function (c, i) { var w = ((t - 11) * .5 + i / co2.length) % 1; c.setAttribute('x', 460 + i * 22); c.setAttribute('y', (120 - 60 * w).toFixed(1)); op(c, t > 11 && t < 13.8 ? Math.sin(Math.PI * w) : 0); });
      }
      if (f === 3) { op(b1.g, cl((t - 15.2) / .4)); op(b2.g, cl((t - 15.9) / .4)); op(sai, cl((t - 16.6) / .4)); op(cont, cl((t - 17.4) / .5)); }
      var T = TXT[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    var FR = { W5b5567d: 9.95, W3456911: 14.95, Pd96ae3d: 19.95, P845fd22: 19.95 };
    return fimResposta(VIS.def['conservacao-massa-sistema-aberto'], svg, _desenha, 20, RESP, qid, { semEsmaecer: true, y: 278, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 19.95; } });
  }
};
VIS.liga('conservacao-massa-sistema-aberto', ['W3456911', 'W5b5567d', 'P845fd22', 'Pd96ae3d']);
