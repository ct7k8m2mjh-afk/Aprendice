VIS.def['ovo-amniota-anexos'] = {
  tit: 'O ovo amniótico: âmnio, alantoide e por que a vacina usa ovos',
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (corte de ovo de galinha embrionado, esquema fora de escala).',
  fontes: [
    'OpenStax Biology 2e, 29.4 Reptiles: The Amniotic Egg (âmnio, alantoide, cório, saco vitelino) — https://openstax.org/books/biology-2e/pages/29-4-reptiles',
    'CDC, How Influenza (Flu) Vaccines Are Made (vírus injetado em ovos de galinha fecundados, incubado para se replicar, líquido com vírus colhido) — https://www.cdc.gov/flu/vaccine-process/index.html'
  ],
  marcas: [[0, 'Sem âmnio'], [2.4, 'Âmnio'], [4.8, 'Anexos'], [7.2, 'Vacina'], [9.6, 'Por isso']],
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function vis(e, o) { e.style.opacity = (+o).toFixed(2); e.style.display = o > 0.001 ? '' : 'none'; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var S1 = 2.4, S2 = 4.8, S3 = 7.2, S4 = 9.6, ROXO = '#6a3d9a';
    var T = 'font-size:13.5px;fill:var(--tinta)', TB = 'font-size:13.5px;font-weight:700;fill:';
    /* ===== etapa 1: ovo de anfibio ===== */
    var G0 = el('g', {});
    el('rect', { x: 20, y: 236, width: 160, height: 70, rx: 6, style: 'fill:#cfe4f2' }, G0);
    el('path', { d: 'M200 300 H380', style: 'fill:none;stroke:#b89b74;stroke-width:8;stroke-linecap:round' }, G0);
    el('circle', { cx: 100, cy: 262, r: 32, style: 'fill:rgba(220,235,220,.75);stroke:#8fb08f;stroke-width:2' }, G0);
    el('circle', { cx: 100, cy: 262, r: 11, style: 'fill:#4a4a3a' }, G0);
    tx({ x: 100, y: 214, 'text-anchor': 'middle', style: TB + '#2f6f9f' }, 'na água: se desenvolve', G0);
    var gel = el('circle', { cx: 290, style: 'fill:rgba(220,235,220,.75);stroke:#8fb08f;stroke-width:2' }, G0);
    var gem = el('circle', { cx: 290, style: 'fill:#4a4a3a' }, G0);
    tx({ x: 290, y: 214, 'text-anchor': 'middle', style: TB + '#b4442f' }, 'no seco: resseca', G0);
    tx({ x: 20, y: 70, style: TB + 'var(--tinta)' }, 'ovo de anfíbio:', G0);
    tx({ x: 20, y: 88, style: T }, 'só uma camada gelatinosa,', G0);
    tx({ x: 20, y: 106, style: T }, 'sem casca e sem âmnio', G0);
    /* ===== ovo amniotico ===== */
    var G = el('g', {}), E = el('g', { transform: 'translate(200 185) scale(1.1) translate(-300 -180)' }, G);
    el('ellipse', { cx: 300, cy: 180, rx: 150, ry: 122, style: 'fill:#f6f0dc;stroke:#d8c39c;stroke-width:7' }, E);
    for (var i = 0; i < 26; i++) { var a = i / 26 * 2 * Math.PI; el('circle', { cx: (300 + 150 * Math.cos(a)).toFixed(1), cy: (180 + 122 * Math.sin(a)).toFixed(1), r: 1.5, style: 'fill:#a8916a' }, E); }
    var corio = el('ellipse', { cx: 300, cy: 180, rx: 136, ry: 108, style: 'fill:none;stroke:#8e5fa8;stroke-width:2' }, E);
    var gema = el('circle', { cx: 318, cy: 222, r: 62, style: 'fill:#f2b632' }, E);
    var sacoV = el('circle', { cx: 318, cy: 222, r: 66, style: 'fill:none;stroke:#b8392b;stroke-width:2.5' }, E);
    var alan = el('ellipse', { cx: 382, cy: 120, rx: 40, ry: 30, style: 'fill:#e3ebb8;stroke:#7d8f2e;stroke-width:2.2' }, E);
    var acU = []; for (i = 0; i < 9; i++) acU.push(el('circle', { cx: 362 + (i % 3) * 18 + (i > 5 ? 4 : 0), cy: 106 + Math.floor(i / 3) * 13, r: 3, style: 'fill:#f7f5ea;stroke:#b0a46a;stroke-width:1' }, E));
    var talo = el('path', { d: 'M296 134 Q326 152 344 130', style: 'fill:none;stroke:#7d8f2e;stroke-width:3' }, E);
    var amnio = el('ellipse', { cx: 282, cy: 124, rx: 44, ry: 30, style: 'fill:#cfe5f4;stroke:#3d7fb8;stroke-width:2.2' }, E);
    el('path', { d: 'M266 108 C254 112 252 128 262 134 C272 142 292 142 300 132 C306 124 300 114 290 118 C282 122 286 128 280 128 C274 128 276 116 266 108 Z', style: 'fill:#e9a8a0;stroke:#b0605a;stroke-width:1.5' }, E);
    el('circle', { cx: 264, cy: 117, r: 9, style: 'fill:#e9a8a0;stroke:#b0605a;stroke-width:1.5' }, E);
    var vir = []; for (i = 0; i < 26; i++) vir.push(el('circle', { r: 2.8, style: 'fill:' + ROXO }, E));
    var gas = el('g', {}, E);
    el('path', { d: 'M424 72 l-14 14 m0 -9 l0 9 l9 0', style: 'fill:none;stroke:#2f6fa8;stroke-width:2' }, gas);
    el('path', { d: 'M398 70 l14 -14 m-9 0 l9 0 l0 9', style: 'fill:none;stroke:#8a6a4a;stroke-width:2' }, gas);
    /* rotulos do ovo (coordenadas da tela) */
    var HAL = ';paint-order:stroke;stroke:var(--folha);stroke-width:4px;stroke-linejoin:round';
    function rot(x, y, anc, s, cor, alvo) { var g = el('g', {}, G); tx({ x: x, y: y, 'text-anchor': anc, style: TB + cor + HAL }, s, g); if (alvo) el('path', { d: 'M' + (anc === 'end' ? x + 3 : x - 3) + ' ' + (y - 4) + ' L' + alvo[0] + ' ' + alvo[1], style: 'fill:none;stroke:' + cor + ';stroke-width:1.4' }, g); return g; }
    var rAm = rot(108, 70, 'end', 'âmnio', '#2f6fa8', [160, 100]), rEm = rot(108, 168, 'end', 'embrião', '#a2524b', [158, 133]);
    var rAl = rot(282, 70, 'end', 'alantoide', '#6b7c22', [284, 98]), rSv = rot(272, 340, 'start', 'saco vitelino', '#b8392b', [262, 300]);
    var rCl = rot(16, 300, 'start', 'clara', '#8a734a', [112, 214]);
    var rCo = rot(16, 150, 'start', 'cório', '#8e5fa8', [62, 160]);
    var gasT = tx({ x: 338, y: 108, style: 'font-size:13px;font-weight:700;fill:#2f6fa8' + HAL }, 'O₂ e CO₂');
    var seringa = el('g', {});
    el('path', { d: 'M392 6 L300 116', style: 'fill:none;stroke:#7d7d7d;stroke-width:2.5;stroke-linecap:round' }, seringa);
    el('rect', { x: 374, y: 0, width: 28, height: 12, rx: 3, transform: 'rotate(-50 388 6)', style: 'fill:#cfd6dd;stroke:#7d7d7d;stroke-width:1.5' }, seringa);
    var semCel = tx({ x: 220, y: 238, 'text-anchor': 'middle', style: TB + '#7a5a10' + HAL }, 'reserva, sem células');
    var n3 = tx({ x: 128, y: 126, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:var(--tinta)' + HAL }, '3');
    var n4 = tx({ x: 348, y: 112, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:var(--tinta)' + HAL }, '4');
    /* ===== painel ===== */
    var px = 404;
    var fase = tx({ x: px, y: 38, style: 'font-size:18px;font-weight:700;fill:var(--tinta)' });
    var L = [0, 1, 2, 3, 4].map(function (k) { return tx({ x: px, y: 64 + k * 19, style: 'font-size:13.5px;fill:var(--tinta)' }); });
    var TXT = [
      ['O problema da terra', ['o ovo de anfíbio não tem casca', 'nem âmnio: só se desenvolve na', 'água. No seco, perde água e', 'o embrião morre.']],
      ['Âmnio', ['bolsa cheia de líquido em volta', 'do embrião: protege de choques', 'e da perda de água.', '*Foi o que libertou répteis, aves', '*e mamíferos da água']],
      ['Saco vitelino e alantoide', ['saco vitelino: envolve a gema', '(alimento). Alantoide: guarda as', 'excretas (ácido úrico) e, com o', 'cório, troca gases pela casca.']],
      ['Vacina no ovo', ['o vírus é injetado e só se', 'multiplica dentro de células', 'vivas (embrião e membranas).', 'Gema e clara são reserva, sem', 'células: ali ele não se copia.']],
      qid === 'Pe3c9fb6' ? ['Voltando ao âmnio', ['de todos os anexos, o que', 'libertou o embrião da água', 'é o âmnio (bolsa de líquido).', '*Por isso: o âmnio protege de', '*choques e da dessecação → D']] : ['Colheita no alantoide', ['os vírus novos se acumulam no', 'líquido do alantoide (o depósito', 'de excretas), que é colhido.', '*Por isso: replicação no embrião (3),', '*coleta no alantoide (4) → D']]
    ];
    return function (t) {
      var et = t < S1 ? 0 : t < S2 ? 1 : t < S3 ? 2 : t < S4 ? 3 : 4;
      fase.textContent = TXT[et][0];
      L.forEach(function (e, i) { var s = TXT[et][1][i] || '', f = s.charAt(0) === '*'; e.textContent = f ? s.slice(1) : s; e.style.fontWeight = f ? 700 : 400; e.style.fill = f ? 'var(--ad-t)' : 'var(--tinta)'; });
      /* etapa 1 */
      var o0 = t < S1 - .3 ? 1 : 1 - cl((t - S1 + .3) / .3); vis(G0, o0);
      var sec = ease((t - .5) / 1.4); gel.setAttribute('cy', 268 + 14 * sec); gel.setAttribute('r', (32 - 14 * sec).toFixed(1)); gem.setAttribute('cy', 268 + 14 * sec); gem.setAttribute('r', (11 - 3 * sec).toFixed(1));
      gel.style.fill = 'rgba(' + Math.round(220 - 40 * sec) + ',' + Math.round(235 - 60 * sec) + ',' + Math.round(220 - 90 * sec) + ',.8)';
      /* ovo */
      vis(G, t < S1 - .3 ? 0 : cl((t - S1 + .3) / .4));
      var ua = ease((t - S1) / 1.2); amnio.setAttribute('rx', (12 + 32 * ua).toFixed(1)); amnio.setAttribute('ry', (10 + 20 * ua).toFixed(1));
      amnio.style.strokeWidth = et === 1 || (et === 4 && qid === 'Pe3c9fb6') ? 3.5 : 2.2;
      var ul = t < S2 ? 0 : ease((t - S2) / 1.2);
      alan.setAttribute('transform', 'translate(344 130) scale(' + (.05 + .95 * ul).toFixed(2) + ') translate(-344 -130)'); vis(alan, t >= S2 ? 1 : 0); vis(talo, t >= S2 ? 1 : 0);
      acU.forEach(function (c, i) { vis(c, t >= S2 + 1.2 + i * .1 && t < S3 + .6 ? 1 : 0); c.setAttribute('transform', alan.getAttribute('transform')); });
      sacoV.style.strokeWidth = et === 2 ? 4 : 2.5; vis(gas, et === 2 && t > S2 + 1.2 ? 1 : 0); vis(gasT, et === 2 && t > S2 + 1.2 ? 1 : 0);
      vis(rAm, t >= S1 + .6 ? 1 : 0); vis(rEm, t >= S1 + .6 ? 1 : 0); vis(rAl, t >= S2 + .8 ? 1 : 0); vis(rSv, t >= S2 + .2 ? 1 : 0); vis(rCl, t >= S2 + .2 ? 1 : 0); vis(rCo, t >= S2 + .2 ? 1 : 0);
      /* vacina */
      var us = t < S3 ? 0 : t < S3 + .6 ? ease((t - S3) / .6) : t < S4 + 1.2 ? 1 : 1;
      seringa.setAttribute('transform', 'translate(' + (40 * (1 - us)).toFixed(1) + ' ' + (-48 * (1 - us)).toFixed(1) + ')'); var AMN = qid === 'Pe3c9fb6' && t >= S4; vis(seringa, t >= S3 && !AMN ? 1 : 0);
      var nv = t < S3 + .6 ? 0 : t < S4 ? Math.round(2 + 24 * ease((t - S3 - .6) / 2)) : 26;
      vir.forEach(function (v, i) {
        if (i >= nv) { vis(v, 0); return; }
        var x, y;
        if (i % 3 === 0) { var a2 = i * .9; x = 282 + 22 * Math.cos(a2); y = 124 + 14 * Math.sin(a2); }
        else { var a3 = i * 1.3; x = 382 + 38 * Math.cos(a3); y = 120 + 28 * Math.sin(a3); }
        if (t >= S4) { var uu = ease((t - S4) / 1.2), a4 = i * 2.4; x += (382 + 22 * Math.cos(a4) * ((i % 4) / 4) - x) * uu * (i % 3 ? 1 : 0); y += (120 + 16 * Math.sin(a4) * ((i % 4) / 4) - y) * uu * (i % 3 ? 1 : 0); }
        v.setAttribute('cx', x.toFixed(1)); v.setAttribute('cy', y.toFixed(1)); vis(v, AMN ? 0 : 1);
      });
      alan.style.fill = t >= S4 && !AMN ? 'color-mix(in srgb,#b79ad6 ' + Math.round(45 * ease((t - S4) / 1.2)) + '%,#e3ebb8)' : '#e3ebb8';
      vis(semCel, et === 3 && t > S3 + 1 ? 1 : 0); vis(n3, et === 4 && !AMN ? 1 : 0); vis(n4, et === 4 && !AMN ? 1 : 0);
    };
  }
};
VIS.liga('ovo-amniota-anexos', ['P9a43ca6', 'Pe3c9fb6']);
