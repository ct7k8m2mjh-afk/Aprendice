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
'Wb9644a0': ['Por isso a resposta é A', 'A temperatura não muda (20 °C = 293 K): transformação isotérmica.', 'P₁V₁ = P₂V₂ → 2 atm · 30 m³ = P₂ · 50 m³ → P₂ = 1,2 atm.'],
'W1a34b6b': ['Por isso a resposta é D', 'Mesma temperatura: P · V constante. A pressão cai 10% (P₂ = 0,9 P₁):', 'V₂ = P₁ · 1 L ÷ 0,9 P₁ ≈ 1,1 L.'],
'Pd656840': ['Por isso a resposta é B', 'Volume constante: P é proporcional a T em kelvin.', '47 °C = 320 K e 147 °C = 420 K → P₂ = P₁ · 420/320 ≈ 1,31 · P₁.'],
'Pff4ddad': ['Por isso a resposta é E', 'Volume constante: P ∝ T (kelvin). 27 °C = 300 K; 177 °C = 450 K.', 'P₂ = 2 × 10⁵ · 450/300 = 3 × 10⁵ Pa: aumento de 50%.'],
'Pefa09b5': ['Por isso a resposta é A', 'P₁V₁/T₁ = P₂V₂/T₂ com T em kelvin (290 K e 300 K):', 'V₂ = 100 · (10/1) · (300/290) ≈ 1034 mm³ ≈ 1 000 mm³.'],
'W9138750': ['Por isso a resposta é D', 'P₁V₁/T₁ = P₂V₂/T₂ com 27 °C = 300 K e −50 °C = 223 K:', 'V₂ = 10 · (1,00/0,25) · (223/300) ≈ 29,7 L.'],
'W261cb24': ['Por isso a resposta é D', '−73 °C = 200 K e 127 °C = 400 K: T absoluta dobra.', 'V₂ = 10 · (1/2) · (400/200) = 10 L: as duas mudanças se anulam.'],
'P1f195dd': ['Por isso a resposta é C', 'C₃H₈(g) + 5 O₂(g) → 3 CO₂(g) + 4 H₂O(l): 6 mol de gás viram 3.', 'A água é líquida e não conta. Mesmos V e T: P ∝ n → P₂ = 0,5 · P₁.'],
'P4d20b38': ['Por isso a resposta é A', 'Com V e T fixos, a pressão é proporcional ao número de mols.', 'P → 60%: restam 0,6 × 120 = 72 mol; foram retirados 120 − 72 = 48 mol.']
};
VIS.def['transformacoes-gasosas-pistao'] = {
  tit: 'Gases: pressão, volume e temperatura',
  fontes: ['OpenStax, Chemistry 2e, 9.2 Relating Pressure, Volume, Amount, and Temperature: The Ideal Gas Law — https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law', 'OpenStax, Chemistry 2e, 9.5 The Kinetic-Molecular Theory — https://openstax.org/books/chemistry-2e/pages/9-5-the-kinetic-molecular-theory', 'Wikipedia (en), Gas laws — https://en.wikipedia.org/wiki/Gas_laws'],
  tipo: 'anim', dur: 21,
  marcas: [[0, 'T constante'], [5, 'V constante'], [10, 'Muda tudo'], [15.5, 'Conta mols']],
  cred: 'Animação feita para o app (esquema; partículas fora de escala). Temperaturas sempre em kelvin: T(K) = t(°C) + 273.',
  nota: 'Para gás ideal, P · V = n · R · T. Com n fixo, P₁V₁/T₁ = P₂V₂/T₂ (T em kelvin). Com V e T fixos, a pressão é proporcional à quantidade de gás: só os mols de gás contam.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function br(v, n) { return v.toFixed(n).replace('.', ','); }
    function tri(u) { u = u - Math.floor(u); return u < .5 ? 2 * u : 2 - 2 * u; }
    var VM = '#b4442f', AZ = '#2b6cb0', VD = '#1f8a70', PA = '#5b6b7a';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    /* ---------- cilindro com pistao (etapas 1 e 2) ---------- */
    var gc = el('g', {});
    var CX0 = 50, CX1 = 210, CB = 236;
    el('path', { d: 'M' + CX0 + ' 26 V' + CB + ' H' + CX1 + ' V26', style: 'fill:none;stroke:var(--tinta);stroke-width:3' }, gc);
    var gasR = el('rect', { x: CX0 + 2, width: CX1 - CX0 - 4, style: 'fill:color-mix(in srgb,' + AZ + ' 8%,var(--folha))' }, gc);
    var pist = el('rect', { x: CX0 + 2, width: CX1 - CX0 - 4, height: 14, style: 'fill:' + PA }, gc);
    var haste = el('rect', { x: (CX0 + CX1) / 2 - 5, width: 10, y: 0, style: 'fill:' + PA }, gc);
    var trava = el('g', {}, gc); el('rect', { x: CX0 - 14, width: 14, height: 8, y: 0, style: 'fill:' + VM }, trava); el('rect', { x: CX1, width: 14, height: 8, y: 0, style: 'fill:' + VM }, trava);
    var chama = el('g', {}, gc); for (var i = 0; i < 4; i++) el('path', { d: 'M' + (CX0 + 24 + i * 36) + ' 262 q-10 -12 0 -24 q2 10 8 10 q4 -8 0 -16 q12 14 2 30 Z', style: 'fill:#e08a2b' }, chama);
    var P = []; for (i = 0; i < 14; i++) P.push({ c: el('circle', { r: 5 }, gc), a: (i * .618) % 1, b: (i * .377 + .2) % 1, vx: .31 + (i % 5) * .07, vy: .27 + (i % 4) * .08 });
    var lP = tx(CX1 + 14, 60, '', 'font-size:16px;font-weight:700;fill:' + VM, gc), lV = tx(CX1 + 14, 84, '', 'font-size:16px;font-weight:700;fill:' + AZ, gc), lT = tx(CX1 + 14, 108, '', 'font-size:16px;font-weight:700;fill:' + VD, gc);
    /* grafico (etapas 1 e 2) */
    var gg = el('g', {}, gc);
    var GX0 = 360, GX1 = 620, GY0 = 220, GY1 = 30;
    el('path', { d: 'M' + GX0 + ' ' + GY1 + ' V' + GY0 + ' H' + GX1, style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, gg);
    var gxl = tx(GX1, GY0 + 22, '', 'font-size:14px;fill:var(--lapis);text-anchor:end', gg), gyl = tx(GX0 - 6, GY1 - 10, 'P', 'font-size:15px;font-weight:700;fill:' + VM, gg);
    var curva = el('path', { style: 'fill:none;stroke:var(--tinta);stroke-width:2.4' }, gg), ext = el('path', { style: 'fill:none;stroke:var(--lapis);stroke-width:1.8;stroke-dasharray:5 5' }, gg);
    var ponto = el('circle', { r: 6.5, style: 'fill:' + VM + ';stroke:var(--folha);stroke-width:2' }, gg);
    var gt1 = tx(GX0 + 12, GY1 + 12, '', 'font-size:16px;font-weight:700;fill:var(--tinta)', gg), gt2 = tx(GX0 + 12, GY1 + 34, '', 'font-size:14px;fill:var(--lapis)', gg);
    var zeroK = tx(GX0, GY0 + 22, '0 K', 'font-size:14px;fill:var(--lapis);' + C, gg);
    /* ---------- etapa 3: bolha/balao ---------- */
    var g3 = el('g', {});
    var V3 = { Pefa09b5: { P1: 10, T1: 17, V1: 100, P2: 1, T2: 27, u: 'mm³', up: true, agua: true, d: 0 },
      W9138750: { P1: 1.00, T1: 27, V1: 10, P2: 0.25, T2: -50, u: 'L', up: true, agua: false, d: 2 },
      W261cb24: { P1: 1, T1: -73, V1: 10, P2: 2, T2: 127, u: 'L', up: false, agua: false, d: 0 } }[qid] || { P1: 10, T1: 17, V1: 100, P2: 1, T2: 27, u: 'mm³', up: true, agua: true, d: 0 };
    V3.K1 = V3.T1 + 273; V3.K2 = V3.T2 + 273; V3.V2 = V3.V1 * (V3.P1 / V3.P2) * (V3.K2 / V3.K1);
    el('rect', { x: 14, y: 14, width: 290, height: 236, rx: 10, style: 'fill:' + (V3.agua ? 'color-mix(in srgb,#5d9ccc 20%,var(--folha))' : 'color-mix(in srgb,#9cc3e4 14%,var(--folha))') + ';stroke:var(--linha);stroke-width:1.2' }, g3);
    var bola = el('circle', { cx: 120, style: 'fill:color-mix(in srgb,#ffffff 55%,transparent);stroke:' + AZ + ';stroke-width:2.2' }, g3);
    var e1 = tx(210, 0, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', g3), e2 = tx(210, 0, '', 'font-size:15px;font-weight:700;fill:var(--tinta)', g3), e3 = tx(210, 0, '', 'font-size:15px;font-weight:700;fill:' + AZ, g3);
    var calc = el('g', {}, g3), QX = 326;
    tx(QX, 46, 'P₁ · V₁ / T₁ = P₂ · V₂ / T₂', 'font-size:19px;font-weight:700;fill:' + VM, calc);
    var VF = function (v) { return br(v, V3.d); };
    [['T₁ = ' + V3.T1 + ' °C = ' + V3.K1 + ' K;  T₂ = ' + V3.T2 + ' °C = ' + V3.K2 + ' K', 15, 'var(--tinta)'],
     ['V₂ = V₁ · (P₁/P₂) · (T₂/T₁)', 16, 'var(--tinta)'],
     ['V₂ = ' + V3.V1 + ' · (' + br(V3.P1, V3.P1 % 1 ? 2 : 0) + '/' + br(V3.P2, V3.P2 % 1 ? 2 : 0) + ') · (' + V3.K2 + '/' + V3.K1 + ')', 16, 'var(--tinta)'],
     ['V₂ ≈ ' + (V3.u === 'mm³' ? Math.round(V3.V2) : br(V3.V2, 1)) + ' ' + V3.u, 19, VM]].forEach(function (l, i) { tx(QX, 92 + i * 34, l[0], 'font-size:' + l[1] + 'px;font-weight:' + (i === 3 ? 700 : 400) + ';fill:' + l[2], calc); });
    tx(QX, 236, 'temperatura sempre em kelvin', 'font-size:14px;fill:var(--lapis)', calc);
    /* ---------- etapa 4: contar mols ---------- */
    var g4 = el('g', {});
    var bert = qid === 'P4d20b38';
    el('rect', { x: 40, y: 40, width: 220, height: 190, rx: 6, style: 'fill:color-mix(in srgb,' + AZ + ' 6%,var(--folha));stroke:var(--tinta);stroke-width:3' }, g4);
    var man = el('g', {}, g4); el('circle', { cx: 150, cy: 22, r: 18, style: 'fill:var(--folha);stroke:var(--tinta);stroke-width:2' }, man);
    var agulha = el('line', { x1: 150, y1: 22, style: 'stroke:' + VM + ';stroke-width:2.6' }, man);
    var pLab = tx(178, 28, '', 'font-size:16px;font-weight:700;fill:' + VM, g4);
    var mols = [], gotas = [];
    if (!bert) {
      for (i = 0; i < 6; i++) mols.push({ g: el('g', {}, g4), i: i });
      mols.forEach(function (m) { m.c = el('circle', { r: 9 }, m.g); m.t = tx(0, 5, '', 'font-size:14px;font-weight:700;' + C, m.g); });
      for (i = 0; i < 4; i++) gotas.push(el('path', { d: 'M0 -9 q7 9 0 14 q-7 -5 0 -14 Z', style: 'fill:#5d9ccc' }, g4));
    } else {
      for (i = 0; i < 10; i++) mols.push({ g: el('g', {}, g4), i: i });
      mols.forEach(function (m) { m.c = el('circle', { r: 7, style: 'fill:' + AZ }, m.g); });
    }
    var faisca = el('path', { d: 'M150 90 l10 22 l-8 0 l12 26 l-22 -30 l9 0 l-9 -18 z', style: 'fill:#f2b632;stroke:#c98a12;stroke-width:1' }, g4);
    var bomba = el('path', { d: 'M260 120 h40 v-14 h26 v40 h-26 v-14 h-40', style: 'fill:color-mix(in srgb,var(--lapis) 25%,var(--folha));stroke:var(--lapis);stroke-width:1.6' }, g4); op(bomba, bert ? 1 : 0);
    var q4 = []; for (i = 0; i < 6; i++) q4.push(tx(350, 60 + i * 30, '', 'font-size:15px;fill:var(--tinta)', g4));
    var L4 = bert ? [['câmara fechada: V e T fixos', 'v'], ['P = n · R · T / V → P ∝ n', 'b'], ['início: 120 mol, pressão P', 'v'], ['bomba tira ar até 0,6 · P', 'v'], ['restam 0,6 × 120 = ' + (0.6 * 120) + ' mol', 'v'], ['retirados: ' + (120 - 0.6 * 120) + ' mol', 'b']] :
      [['C₃H₈(g) + 5 O₂(g) →', 'v'], ['3 CO₂(g) + 4 H₂O(l)', 'v'], ['gás antes: 1 + 5 = 6 mol', 'v'], ['gás depois: 3 mol (água é líquida)', 'v'], ['V e T iguais: P ∝ n', 'b'], ['P₂ = (3/6) · P₁ = 0,5 · P₁', 'b']];
    L4.forEach(function (l, i) { q4[i].textContent = l[0]; q4[i].style.fontWeight = l[1] === 'b' ? 700 : 400; q4[i].style.fill = l[1] === 'b' ? VM : 'var(--tinta)'; });
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 272, y2: 272, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 298, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 326 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Temperatura constante (isotérmica): P · V = constante', 'Puxando o pistão, as mesmas partículas se espalham e batem menos vezes', 'em cada parte da parede: a pressão cai na proporção em que V cresce.', 'Ex.: 2 atm · 30 m³ = 1,2 atm · 50 m³ (gás passado para um tanque maior).'],
      ['2. Volume constante (isovolumétrica): P ∝ T em kelvin', 'Aquecendo, as partículas ficam mais rápidas e batem mais forte e mais vezes.', 'A reta P × T passa pelo zero absoluto (0 K = −273 °C), então use kelvin:', '27 °C = 300 K → 177 °C = 450 K: P × 1,5 (aumento de 50%).'],
      ['3. Mudam P, V e T juntos: equação geral', 'Para a mesma quantidade de gás, P · V / T não muda (T em kelvin).', V3.up ? 'Subindo, a pressão em volta cai muito: o volume cresce bastante;' : 'Pressão dobra (V cairia à metade), temperatura absoluta dobra', V3.up ? 'a temperatura também mexe, mas bem menos.' : '(V dobraria): as duas mudanças se anulam.'],
      bert ? ['4. V e T fixos: a pressão conta as partículas', 'P · V = n · R · T: com V e T fixos, P é proporcional a n.', 'Tirar ar até a pressão cair a 60% é deixar 60% dos mols.', ''] : ['4. V e T fixos: a pressão conta as partículas de gás', 'P · V = n · R · T: com V e T fixos, P é proporcional a n (só gás).', 'Na combustão do propano, 6 moléculas de gás viram 3 de gás', 'e 4 de água líquida, que não empurram as paredes como gás.']
    ];
    function particulas(top, vel, cor, t) {
      P.forEach(function (p) {
        var x = CX0 + 10 + (CX1 - CX0 - 20) * tri(p.a + t * p.vx * vel), y = top + 10 + (CB - top - 20) * tri(p.b + t * p.vy * vel);
        p.c.setAttribute('cx', x.toFixed(1)); p.c.setAttribute('cy', y.toFixed(1)); p.c.setAttribute('style', 'fill:' + cor);
      });
    }
    var _desenha = function (t) {
      var f = t < 5 ? 0 : t < 10 ? 1 : t < 15.5 ? 2 : 3;
      op(gc, f < 2 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f === 0) {
        var u = ease((t - .8) / 3), V = lerp(30, 50, u), Pv = 60 / V, top = CB - V * 3.8;
        gasR.setAttribute('y', top); gasR.setAttribute('height', CB - top);
        pist.setAttribute('y', top - 14); haste.setAttribute('y', 0); haste.setAttribute('height', Math.max(0, top - 14)); op(trava, 0); op(chama, 0);
        particulas(top, 1, AZ, t);
        lP.textContent = 'P = ' + br(Pv, 2) + ' atm'; lV.textContent = 'V = ' + br(V, 1) + ' m³'; lT.textContent = 'T = 293 K (fixa)';
        gxl.textContent = 'V (m³) →'; op(zeroK, 0);
        var vx = function (v) { return GX0 + (GX1 - GX0) * (v - 10) / 50; }, py = function (p) { return GY0 - (GY0 - GY1) * p / 6; };
        var d = ''; for (var v = 11; v <= 60; v += 1) d += (d ? 'L' : 'M') + vx(v).toFixed(1) + ' ' + py(60 / v).toFixed(1) + ' ';
        curva.setAttribute('d', d); ext.setAttribute('d', '');
        ponto.setAttribute('cx', vx(V).toFixed(1)); ponto.setAttribute('cy', py(Pv).toFixed(1));
        gt1.setAttribute('x', GX0 + 70); gt2.setAttribute('x', GX0 + 70);
        gt1.textContent = 'P · V = ' + br(Pv * V, 0) + ' (constante)'; gt2.textContent = 'hipérbole: isoterma';
      }
      if (f === 1) {
        var w = ease((t - 5.8) / 3), TK = lerp(300, 450, w), Pp = 2 * TK / 300, top2 = CB - 40 * 3.8;
        gasR.setAttribute('y', top2); gasR.setAttribute('height', CB - top2);
        pist.setAttribute('y', top2 - 14); haste.setAttribute('height', Math.max(0, top2 - 14)); op(trava, 1);
        trava.childNodes[0].setAttribute('y', top2 - 22); trava.childNodes[1].setAttribute('y', top2 - 22);
        op(chama, cl((t - 5.3) / .4));
        particulas(top2, Math.sqrt(TK / 300), w > .5 ? VM : AZ, t);
        lP.textContent = 'P = ' + br(Pp, 2) + ' × 10⁵ Pa'; lV.textContent = 'V fixo (travado)'; lT.textContent = 'T = ' + Math.round(TK) + ' K = ' + Math.round(TK - 273) + ' °C';
        gxl.textContent = 'T (K) →'; op(zeroK, 1);
        var tx_ = function (T) { return GX0 + (GX1 - GX0) * T / 500; }, py2 = function (p) { return GY0 - (GY0 - GY1) * p / 3.6; };
        curva.setAttribute('d', 'M' + tx_(250).toFixed(1) + ' ' + py2(2 * 250 / 300).toFixed(1) + ' L' + tx_(480).toFixed(1) + ' ' + py2(2 * 480 / 300).toFixed(1));
        ext.setAttribute('d', 'M' + tx_(0) + ' ' + py2(0) + ' L' + tx_(250).toFixed(1) + ' ' + py2(2 * 250 / 300).toFixed(1));
        ponto.setAttribute('cx', tx_(TK).toFixed(1)); ponto.setAttribute('cy', py2(Pp).toFixed(1));
        gt1.setAttribute('x', GX0 + 12); gt2.setAttribute('x', GX0 + 12);
        gt1.textContent = 'P / T = constante'; gt2.textContent = 'reta que passa por 0 K';
      }
      if (f === 2) {
        var u3 = ease((t - 10.6) / 3.2), Pn = lerp(V3.P1, V3.P2, u3), Kn = lerp(V3.K1, V3.K2, u3), Vn = V3.V1 * (V3.P1 / Pn) * (Kn / V3.K1);
        var r = 16 * Math.pow(Vn / V3.V1, 1 / 3), cy = V3.up ? lerp(214, 70, u3) : 130;
        bola.setAttribute('cy', cy.toFixed(1)); bola.setAttribute('r', r.toFixed(1));
        e1.setAttribute('y', (cy - 18).toFixed(1)); e2.setAttribute('y', (cy + 4).toFixed(1)); e3.setAttribute('y', (cy + 26).toFixed(1));
        e1.textContent = 'P = ' + br(Pn, V3.P2 % 1 || V3.P1 % 1 ? 2 : 1) + ' atm'; e2.textContent = 'T = ' + Math.round(Kn) + ' K';
        e3.textContent = 'V = ' + (V3.u === 'mm³' ? Math.round(Vn) : br(Vn, 1)) + ' ' + V3.u;
        op(calc, cl((t - 11.2) / .5));
      }
      if (f === 3) {
        var a = ease((t - 16.4) / 1.6), b = bert ? a : cl((t - 17.8) / .3);
        var Pf = bert ? lerp(1, .6, a) : (b > .5 ? .5 : 1);
        var ang = -150 + 120 * Pf; agulha.setAttribute('x2', (150 + 15 * Math.cos(ang * Math.PI / 180)).toFixed(1)); agulha.setAttribute('y2', (22 + 15 * Math.sin(ang * Math.PI / 180)).toFixed(1));
        pLab.textContent = bert ? (Pf > .99 ? 'P' : br(Pf, 1) + ' · P') : (Pf > .99 ? 'P₁' : '0,5 · P₁');
        mols.forEach(function (m, i) {
          var x = 56 + 188 * tri((i * .618) + t * (.21 + (i % 3) * .05)), y = 62 + 124 * tri((i * .377 + .1) + t * (.17 + (i % 4) * .04));
          if (!bert) {
            var depois = b > .5;
            if (!depois) { m.c.setAttribute('r', i ? 8 : 12); m.c.setAttribute('style', 'fill:' + (i ? '#cc3d33' : '#4a4a4a')); m.t.textContent = i ? 'O₂' : 'C₃H₈'; m.t.setAttribute('style', 'font-size:14px;font-weight:700;' + C + ';fill:' + (i ? '#cc3d33' : 'var(--tinta)')); m.t.setAttribute('y', 26); }
            else { m.c.setAttribute('r', 9); m.c.setAttribute('style', 'fill:#4a4a4a'); m.t.textContent = 'CO₂'; m.t.setAttribute('y', 26); m.t.setAttribute('style', 'font-size:14px;font-weight:700;fill:var(--tinta);' + C); }
            m.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
            op(m.g, depois ? (i < 3 ? 1 : 0) : 1);
          } else {
            m.g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
            op(m.g, i < 6 ? 1 : 1 - cl((a - (i - 6) * .15) * 3));
          }
        });
        gotas.forEach(function (g, i) { g.setAttribute('transform', 'translate(' + (80 + i * 46) + ' 222)'); op(g, b > .5 ? 1 : 0); });
        q4.forEach(function (o, i) { op(o, cl((t - 15.8 - i * .6) / .4)); });
        op(faisca, !bert && t > 17.5 && t < 18.1 ? 1 : 0);
      }
      var T_ = TXT[f]; L0.textContent = T_[0]; Ls.forEach(function (o, i) { o.textContent = T_[i + 1] || ''; });
    };
    var FR = { Wb9644a0: 4.95, W1a34b6b: 4.95, Pd656840: 9.95, Pff4ddad: 9.95, Pefa09b5: 15.45, W9138750: 15.45, W261cb24: 15.45, P1f195dd: 20.95, P4d20b38: 20.95 };
    return fimResposta(VIS.def['transformacoes-gasosas-pistao'], svg, _desenha, 21, RESP, qid, { semEsmaecer: true, y: 278, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 20.95; } });
  }
};
VIS.liga('transformacoes-gasosas-pistao', ['P1f195dd', 'Pd656840', 'Pefa09b5', 'Pff4ddad', 'W1a34b6b', 'W261cb24', 'W9138750', 'Wb9644a0', 'P4d20b38']);
