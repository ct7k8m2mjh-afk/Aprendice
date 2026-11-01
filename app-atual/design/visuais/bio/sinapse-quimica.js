/* Sinapse quimica: o caminho do sinal dentro do neuronio (dendrito -> corpo -> axonio -> terminal),
   depois o zoom na sinapse: Ca2+ entra, vesiculas liberam neurotransmissor na fenda, receptores
   pos-sinapticos, recaptacao pelo neuronio pre-sinaptico e o bloqueio da recaptacao (antidepressivo). */
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
'W2a9a354': [
'Por isso a resposta é C',
'A conexão entre neurônios é a sinapse: não há contato direto, e o sinal atravessa',
'a fenda levado pelo neurotransmissor até os receptores da célula seguinte.'
],
'W71ad1bc': [
'Por isso a resposta é B',
'O espaço entre o fim do axônio e a célula seguinte, onde o neurotransmissor é',
'lançado, é a fenda da sinapse. Ele fica entre duas células, não dentro de uma.'
],
'Wa4fec60': [
'Por isso a resposta é D',
'O sinal passa de um neurônio a outro pela sinapse: o terminal libera o',
'neurotransmissor, que atravessa a fenda e excita a célula seguinte.'
],
'W7230921': [
'Por isso a resposta é B',
'Neurotransmissor chega aos dendritos (I) → impulso nos dendritos (IV) →',
'corpo celular (V) → axônio (III) → terminal libera neurotransmissor (II).'
],
'Webe4b62': [
'Por isso a resposta é B',
'Bloqueando a transmissão na sinapse (anestésicos gerais), o sinal da dor não',
'chega ao encéfalo. Os locais (lidocaína) bloqueiam canais de Na⁺ do axônio.'
],
'W49306de': [
'Por isso a resposta é C',
'O neurotransmissor age nos receptores da membrana pós-sináptica e depois é',
'recaptado pelo neurônio pré-sináptico; o antidepressivo bloqueia essa volta.'
]
};
VIS.def['sinapse-quimica'] = {
  tit: 'Sinapse química: o sinal atravessa a fenda como neurotransmissor',
  fontes: ['OpenStax, Biology 2e, 35.2 How Neurons Communicate (Synaptic Transmission: Ca²⁺ entra no terminal, vesículas liberam o neurotransmissor na fenda, receptores pós-sinápticos, remoção por enzima ou recaptação) — https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate', 'OpenStax, Anatomy and Physiology 2e, 12.5 Communication Between Neurons — https://openstax.org/books/anatomy-and-physiology-2e/pages/12-5-communication-between-neurons', 'Wikipedia (en), Selective serotonin reuptake inhibitor — https://en.wikipedia.org/wiki/Selective_serotonin_reuptake_inhibitor'],
  tipo: 'anim', dur: 11.2,
  marcas: [[0, '1. O caminho'], [2.8, '2. Liberação'], [5.6, '3. Receptor'], [8.4, '4. Recaptar']],
  cred: 'Animação feita para o app (esquema fora de escala; a fenda sináptica real tem cerca de 20 nanômetros).',
  nota: 'Dentro do neurônio o sinal é elétrico e vai sempre do dendrito ao corpo celular e ao axônio. No terminal ele vira químico: a entrada de Ca²⁺ faz as vesículas liberarem o neurotransmissor, que atravessa a fenda e se liga aos receptores da célula seguinte. Depois o neurotransmissor é degradado por enzimas ou recaptado pelo neurônio que o liberou.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    svg.setAttribute('viewBox', '0 0 640 360');
    var NEU = '#e9c6b5', NEUs = '#b98a74', NT = '#7a55c8', CA = '#c9981f', NA = '#e0862a', SIN = '#e8590c';
    /* ===== etapa 1: tres neuronios em cadeia ===== */
    var E1 = el('g', {});
    var Y = 118;
    el('path', { d: 'M0 ' + Y + ' H62', style: 'stroke:' + NEUs + ';stroke-width:6' }, E1);
    el('circle', { cx: 68, cy: Y, r: 9, style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:2' }, E1);
    el('path', { d: 'M150 ' + Y + ' L96 ' + (Y - 40) + ' M150 ' + Y + ' L90 ' + Y + ' M150 ' + Y + ' L98 ' + (Y + 40) + ' M118 ' + (Y - 21) + ' l-12 -18 M114 ' + (Y + 22) + ' l-14 14', style: 'fill:none;stroke:' + NEUs + ';stroke-width:4;stroke-linecap:round' }, E1);
    el('circle', { cx: 170, cy: Y, r: 26, style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:2' }, E1);
    el('circle', { cx: 170, cy: Y, r: 8, style: 'fill:#9a6a8a' }, E1);
    el('path', { d: 'M196 ' + Y + ' H470', style: 'stroke:' + NEUs + ';stroke-width:6' }, E1);
    el('path', { d: 'M470 ' + Y + ' L494 ' + (Y - 18) + ' M470 ' + Y + ' L498 ' + Y + ' M470 ' + Y + ' L494 ' + (Y + 18), style: 'fill:none;stroke:' + NEUs + ';stroke-width:4' }, E1);
    [[498, Y - 20], [503, Y], [498, Y + 20]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 7, style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:2' }, E1); });
    el('path', { d: 'M640 ' + Y + ' L600 ' + Y + ' L524 ' + (Y - 26) + ' M600 ' + Y + ' L522 ' + Y + ' M600 ' + Y + ' L524 ' + (Y + 26), style: 'fill:none;stroke:' + NEUs + ';stroke-width:4;stroke-linecap:round' }, E1);
    el('circle', { cx: 628, cy: Y, r: 22, style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:2' }, E1);
    tx(4, Y + 34, 'neurônio', 'font-size:13px;fill:var(--lapis)', E1); tx(4, Y + 50, 'anterior', 'font-size:13px;fill:var(--lapis)', E1);
    tx(560, Y + 60, 'próximo', 'font-size:13px;fill:var(--lapis)', E1); tx(560, Y + 76, 'neurônio', 'font-size:13px;fill:var(--lapis)', E1);
    var EV = [
      [1, 14, 30, 'neurotransmissor', 'chega aos dendritos'],
      [2, 60, 200, 'o impulso corre', 'nos dendritos'],
      [3, 200, 30, 'chega ao corpo', 'celular'],
      [4, 290, 178, 'corre pelo', 'axônio'],
      [5, 400, 30, 'terminal libera', 'neurotransmissor']
    ].map(function (e) {
      var g = el('g', {}, E1);
      el('circle', { cx: e[1] + 9, cy: e[2] - 5, r: 10, style: 'fill:var(--ad-c)' }, g);
      tx(e[1] + 9, e[2], e[0], 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', g);
      tx(e[1] + 24, e[2], e[3], 'font-size:13.5px;font-weight:700;fill:var(--tinta)', g);
      tx(e[1] + 24, e[2] + 17, e[4], 'font-size:13.5px;fill:var(--tinta)', g);
      return g;
    });
    var ntA = [0, 1, 2].map(function () { return el('circle', { r: 3.5, style: 'fill:' + NT }, E1); });
    var ntB = [0, 1, 2].map(function () { return el('circle', { r: 3.5, style: 'fill:' + NT }, E1); });
    var imp = el('circle', { r: 9, style: 'fill:' + SIN + ';opacity:.85' }, E1);
    /* ===== etapas 2-4: zoom na sinapse ===== */
    var Z = el('g', {});
    var MB = 112, MP = 158;   /* membrana pre (baixo do terminal) e pos (topo do dendrito) */
    el('path', { d: 'M120 -2 V' + (MB - 40) + ' Q120 ' + MB + ' 160 ' + MB + ' H480 Q520 ' + MB + ' 520 ' + (MB - 40) + ' V-2 Z', style: 'fill:' + NEU + ';stroke:' + NEUs + ';stroke-width:3' }, Z);
    el('path', { d: 'M70 234 V' + (MP + 20) + ' Q70 ' + MP + ' 100 ' + MP + ' H540 Q570 ' + MP + ' 570 ' + (MP + 20) + ' V234 Z', style: 'fill:color-mix(in srgb,' + NEU + ' 70%,var(--folha));stroke:' + NEUs + ';stroke-width:3' }, Z);
    tx(130, 22, 'terminal do axônio (célula pré-sináptica)', 'font-size:14px;font-weight:700;fill:#7a4a36', Z);
    tx(320, 229, 'dendrito da célula seguinte (pós-sináptica)', 'font-size:14px;font-weight:700;fill:#7a4a36;text-anchor:middle', Z);
    el('path', { d: 'M96 136 H124 m-7 -5 l7 5 l-7 5', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, Z);
    tx(10, 132, 'fenda', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', Z); tx(10, 148, 'sináptica', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', Z);
    /* canais de Ca2+ */
    [176, 226].forEach(function (x) { el('rect', { x: x - 9, y: MB - 7, width: 6, height: 14, rx: 2, style: 'fill:#d8b25a;stroke:#8a6a10' }, Z); el('rect', { x: x + 3, y: MB - 7, width: 6, height: 14, rx: 2, style: 'fill:#d8b25a;stroke:#8a6a10' }, Z); });
    var caL = tx(130, 88, 'canal de Ca²⁺', 'font-size:13px;font-weight:600;fill:#8a6a10', Z);
    var cas = [0, 1, 2, 3].map(function () { return el('circle', { r: 4.5, style: 'fill:' + CA + ';stroke:#8a6a10;stroke-width:1' }, Z); });
    /* transportador de recaptacao */
    var TRX = 470;
    el('path', { d: 'M' + (TRX - 12) + ' ' + (MB + 6) + ' V' + (MB - 10) + ' H' + (TRX - 4) + ' V' + (MB + 6) + ' M' + (TRX + 4) + ' ' + (MB + 6) + ' V' + (MB - 10) + ' H' + (TRX + 12) + ' V' + (MB + 6), style: 'fill:#9fc7a0;stroke:#3f7a45;stroke-width:1.5' }, Z);
    var trL = tx(528, MB - 14, 'transportador', 'font-size:13px;font-weight:600;fill:#3f7a45', Z);
    var trL2 = tx(528, MB + 1, '(recaptação)', 'font-size:13px;fill:#3f7a45', Z);
    var bloq = el('g', {}, Z);
    el('path', { d: 'M' + TRX + ' ' + (MB + 2) + ' l9 12 l-9 12 l-9 -12 Z', style: 'fill:#3a3a3a' }, bloq);
    tx(TRX + 14, MB + 32, 'antidepressivo', 'font-size:13px;font-weight:700;fill:#3a3a3a', bloq);
    /* receptores */
    var RX = [250, 310, 370, 430];
    RX.forEach(function (x) { el('path', { d: 'M' + (x - 11) + ' ' + (MP + 8) + ' V' + (MP - 6) + ' H' + (x - 5) + ' V' + (MP + 2) + ' H' + (x + 5) + ' V' + (MP - 6) + ' H' + (x + 11) + ' V' + (MP + 8), style: 'fill:#a9c0e3;stroke:#3f63a0;stroke-width:1.5' }, Z); });
    var recL = tx(452, MP + 36, 'receptores', 'font-size:13px;font-weight:600;fill:#3f63a0', Z);
    var nas = RX.map(function () { return el('path', { d: '', style: 'fill:none;stroke:' + NA + ';stroke-width:2.5' }, Z); });
    var naL = tx(250, MP + 50, 'Na⁺ entra: começa um novo impulso', 'font-size:13.5px;font-weight:700;fill:#b4560a', Z);
    /* vesiculas */
    var VES = [[214, 56], [262, 40], [318, 64], [378, 46], [436, 62]];
    var ves = VES.map(function (v) { var g = el('g', {}, Z); var c = el('circle', { r: 15, style: 'fill:color-mix(in srgb,' + NT + ' 12%,var(--folha));stroke:' + NT + ';stroke-width:2' }, g); g.__c = c; return g; });
    var vesL = tx(128, 46, 'vesículas', 'font-size:13px;font-weight:600;fill:' + NT, Z);
    /* neurotransmissores: 16 pontos (4 em cada vesicula liberada, as vesiculas 1 e 3 liberam) */
    var NTS = [];
    for (var k = 0; k < 16; k++) NTS.push(el('circle', { r: 4, style: 'fill:' + NT }, Z));
    var ntL = tx(536, 140, 'neurotransmissor', 'font-size:13px;font-weight:600;fill:' + NT, Z);
    var impZ = el('path', { d: 'M500 -2 V30', style: 'stroke:' + SIN + ';stroke-width:5;stroke-linecap:round' }, Z);
    var impL = tx(492, 44, 'impulso chega', 'font-size:13px;font-weight:700;fill:' + SIN + ';text-anchor:end', Z);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(L) { P0.textContent = L[0]; P.forEach(function (p, i) { p.textContent = L[i + 1] || ''; }); }
    function hsh(i, s) { var x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); }
    function setc(c, x, y) { c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); }
    var _desenha = function (t) {
      var f = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.4 ? 2 : 3;
      op(E1, f === 0 ? 1 : 0); op(Z, f > 0 ? cl((t - 2.8) / .3) : 0);
      if (f === 0) {
        var u = t;
        EV.forEach(function (e, i) { op(e, cl((u - [0.1, 0.6, 1.0, 1.4, 2.1][i]) / .25)); });
        ntA.forEach(function (c, i) { var v = cl((u - i * .08) / .45); setc(c, lerp(76, 98, v), Y - 8 + i * 8); op(c, u < .7 ? 1 : 0); });
        var x, y;
        if (u < .5) { x = 96; y = Y; } else if (u < 1.0) { x = lerp(100, 150, (u - .5) / .5); y = Y; } else if (u < 1.3) { x = lerp(150, 194, (u - 1.0) / .3); y = Y; } else if (u < 2.1) { x = lerp(196, 470, (u - 1.3) / .8); y = Y; } else { x = 496; y = Y; }
        setc(imp, x, y); op(imp, u > .45 && u < 2.2 ? 1 : 0);
        ntB.forEach(function (c, i) { var v = cl((u - 2.15 - i * .08) / .4); setc(c, lerp(510, 524, v), Y - 10 + i * 10); op(c, u > 2.15 ? 1 : 0); });
      } else {
        var uz = t - 2.8;
        /* impulso e Ca2+ */
        impZ.setAttribute('d', 'M500 -2 V' + lerp(-2, 34, ease(uz / .4)).toFixed(1)); op(impZ, f === 1 && uz < 1.6 ? 1 : 0); op(impL, f === 1 && uz < 1.6 ? 1 : 0);
        cas.forEach(function (c, i) { var x0 = [170, 182, 220, 232][i], v = ease((uz - .4 - i * .08) / .7); setc(c, x0, lerp(MB + 26, MB - 12, v)); op(c, f === 1 ? cl((uz - .2) / .2) * (1 - cl((uz - 1.9) / .4)) : 0); });
        op(caL, f === 1 ? 1 : .55);
        /* vesiculas: 1 e 3 descem e se fundem (1.0-1.8 dentro da etapa 2) */
        ves.forEach(function (g, i) {
          var desce = (i === 1 || i === 3) ? ease((uz - 1.0) / .7) : 0;
          var funde = (i === 1 || i === 3) ? cl((uz - 1.7) / .3) : 0;
          var x = VES[i][0], y = lerp(VES[i][1], MB - 14, desce);
          g.setAttribute('transform', 'translate(' + x + ' ' + y.toFixed(1) + ') scale(' + (1 - .5 * funde).toFixed(2) + ')');
          op(g, 1 - .85 * funde);
        });
        op(vesL, f === 1 ? 1 : .6);
        /* neurotransmissores */
        NTS.forEach(function (c, k) {
          var vi = k < 8 ? 1 : 3, base = VES[vi], j = k % 8;
          var px0 = base[0] + (j % 4 - 1.5) * 6, py0 = (j < 4 ? -4 : 4);
          var dentro = [px0, lerp(VES[vi][1], MB - 14, ease((uz - 1.0) / .7)) + py0];
          var fenda = [lerp(200, 440, hsh(k, 1)), lerp(MB + 10, MP - 12, hsh(k, 2))];
          var rec = k < 4 ? [RX[k], MP - 2] : k >= 8 && k < 12 ? null : null;
          var p;
          if (uz < 1.8) p = dentro;
          else if (uz < 2.8) { var v = ease((uz - 1.8) / 1.0); p = [lerp(base[0], fenda[0], v), lerp(MB + 2, fenda[1], v)]; }
          else p = fenda;
          /* etapa 3: 4 deles se ligam aos receptores */
          var alvoR = (k === 0 || k === 5 || k === 9 || k === 14) ? RX[[0, 5, 9, 14].indexOf(k)] : null;
          if (uz >= 2.8 && alvoR !== null) { var v2 = ease((uz - 3.0) / .9); p = [lerp(fenda[0], alvoR, v2), lerp(fenda[1], MP - 3, v2)]; }
          /* os que nao se ligam vagueiam um pouco */
          if (uz >= 2.8 && alvoR === null) p = [p[0] + 6 * Math.sin(uz * 2 + k), p[1] + 3 * Math.cos(uz * 2.3 + k)];
          /* etapa 4a (5.6-7.0): todos voltam pelo transportador */
          if (uz >= 5.6 && uz < 7.2) { var v3 = ease((uz - 5.7 - (k % 4) * .12) / .9); p = [lerp(p[0], TRX, v3), lerp(p[1], MB - 4 - 30 * cl((v3 - .8) / .2), v3)]; }
          var vis = uz >= 1.8 || (uz < 1.8 && uz > 1.0) ? 1 : 0;
          if (uz < 1.0) vis = 0;
          if (uz >= 5.6 && uz < 7.2) vis = 1 - cl((uz - 6.5 - (k % 4) * .12) / .3);
          /* etapa 4b (7.2+): nova liberacao com o transportador bloqueado: ficam na fenda */
          if (uz >= 7.2) { var a = cl((uz - 7.25) / .5); p = [lerp(200, 450, hsh(k, 5)) + 5 * Math.sin(uz * 2 + k), lerp(MB + 10, MP - 12, hsh(k, 6)) + 3 * Math.cos(uz * 2 + k)]; vis = a; }
          setc(c, p[0], p[1]); op(c, vis);
        });
        op(ntL, uz > 1.9 && f < 3 ? 1 : 0);
        op(recL, f >= 2 ? 1 : .5);
        var na = f === 2 ? cl((t - 6.7) / .3) : 0;
        nas.forEach(function (pth, i) { pth.setAttribute('d', 'M' + RX[i] + ' ' + (MP + 10) + ' v' + (14 * na).toFixed(1) + ' m-5 -6 l5 6 l5 -6'); op(pth, na); });
        op(naL, na);
        op(trL, f === 3 ? 1 : .55); op(trL2, f === 3 ? 1 : .55);
        op(bloq, f === 3 ? cl((t - 9.9) / .3) : 0);
      }
      if (f === 0) painel(['1. O caminho do sinal', 'O neurotransmissor do neurônio anterior chega aos dendritos; o impulso corre', 'pelos dendritos, passa pelo corpo celular, segue no axônio e chega ao terminal.']);
      else if (f === 1) painel(['2. No terminal: Ca²⁺ e vesículas', 'O impulso abre canais de Ca²⁺. O Ca²⁺ entra e as vesículas se fundem à', 'membrana: o neurotransmissor é lançado na fenda. Não há contato entre as células.']);
      else if (f === 2) painel(['3. O neurotransmissor atravessa a fenda', 'Ele se liga a receptores da membrana pós-sináptica: canais abrem, Na⁺ entra', 'e começa um novo impulso. Se essa passagem é bloqueada, o sinal para aqui.']);
      else if (t < 9.9) painel(['4. Fim do sinal: recaptação', 'O neurotransmissor solta do receptor e volta ao neurônio que o liberou', 'pelo transportador (ou é degradado por enzimas). A fenda fica limpa.']);
      else painel(['4. Antidepressivo bloqueia a recaptação', 'Alguns antidepressivos travam o transportador da serotonina:', 'ela fica mais tempo na fenda, agindo nos receptores.']);
    };
    return fimResposta(VIS.def['sinapse-quimica'], svg, _desenha, 11.2, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W7230921' ? 2.75 : q === 'W49306de' ? 11.15 : 7.6; }
    });
  }
};
VIS.liga('sinapse-quimica', ['W2a9a354', 'W71ad1bc', 'Wa4fec60', 'W7230921', 'Webe4b62', 'W49306de']);
