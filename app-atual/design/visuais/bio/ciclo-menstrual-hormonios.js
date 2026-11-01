VIS.def['ciclo-menstrual-hormonios'] = {
  tit: 'Ciclo menstrual: hormônios, ovário e endométrio no mesmo calendário',
  fontes: ['OpenStax Biology 2e, 43.4 Hormonal Control of Human Reproduction — https://openstax.org/books/biology-2e/pages/43-4-hormonal-control-of-human-reproduction', 'OpenStax Biology 2e, 43.5 Human Pregnancy and Birth — https://openstax.org/books/biology-2e/pages/43-5-human-pregnancy-and-birth'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (curvas esquemáticas de um ciclo de 28 dias; cada hormônio na sua própria escala).',
  marcas: [[0, 'Ciclo de 28 dias, sem gravidez'], [7.8, 'Se houver gravidez']],
  nota: 'Hipófise: FSH e LH. Ovário: o folículo faz estrógeno; depois da ovulação, o corpo lúteo faz progesterona. Sem gravidez, o corpo lúteo regride, a progesterona cai e o endométrio descama. Com gravidez, o hCG do embrião (depois da placenta) mantém o corpo lúteo; no parto a placenta sai e progesterona e estrógeno despencam.',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function g(d, m, sl, sr) { var s = d < m ? sl : (sr || sl); return Math.exp(-(d - m) * (d - m) / (2 * s * s)); }
    svg.setAttribute('viewBox', '0 0 640 356');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var CF = '#2f7fbf', CL = '#7a4fc0', CE = '#d0661b', CP = '#2e8b57', CH = '#b8304f';
    /* curvas (0..1, escala propria de cada hormonio) */
    function FSH(d) { return .16 + .26 * g(d, 3, 2.6) + .3 * g(d, 13.6, .9) + .2 * g(d, 28.6, 2.2) - .05 * g(d, 21, 4); }
    function LH(d) { return .1 + .82 * g(d, 13.7, .75, .6) + .03 * g(d, 21, 4); }
    function EST(d) { return .1 + .78 * g(d, 12.7, 2.7, 1.1) + .36 * g(d, 21.5, 2.8); }
    function PROG(d) { return .04 + .86 * g(d, 21.5, 3.1, 2.8); }
    function END(d) {   /* espessura do endometrio 0..1 */
      if (d < 5) return .55 - .4 * ease(d / 5);
      if (d < 14) return .15 + .45 * ease((d - 5) / 9);
      if (d < 22) return .6 + .4 * ease((d - 14) / 8);
      return 1;
    }
    var XL = 112, XR = 622, W = XR - XL;
    function X(d) { return XL + d / 28 * W; }

    /* ======== cena A ======== */
    var A = el('g', {});
    /* faixas das fases */
    el('rect', { x: X(0), y: 8, width: X(14) - X(0), height: 20, rx: 4, style: 'fill:color-mix(in srgb,var(--tinta) 6%,transparent)' }, A);
    el('rect', { x: X(14), y: 8, width: X(28) - X(14), height: 20, rx: 4, style: 'fill:color-mix(in srgb,var(--ad-c) 12%,transparent)' }, A);
    tx({ x: X(7), y: 23, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;' + LAP }, 'fase folicular', A);
    tx({ x: X(21), y: 23, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;' + LAP }, 'fase lútea', A);
    /* paineis */
    var P = [[36, 104, 'Hipófise'], [112, 180, 'Ovário:'], [188, 238, 'Ovário'], [246, 296, 'Útero:']];
    P.forEach(function (p) {
      el('line', { x1: XL, x2: XR, y1: p[1], y2: p[1], style: 'stroke:var(--linha);stroke-width:1.2' }, A);
      tx({ x: 8, y: (p[0] + p[1]) / 2 + 1, style: 'font-size:14px;font-weight:700;' + TXT }, p[2], A);
    });
    tx({ x: 8, y: 92, style: 'font-size:13px;' + LAP }, '(FSH e LH)', A);
    tx({ x: 8, y: 163, style: 'font-size:13px;' + LAP }, 'hormônios', A);
    tx({ x: 8, y: 230, style: 'font-size:13px;' + LAP }, '(folículos)', A);
    tx({ x: 8, y: 288, style: 'font-size:13px;' + LAP }, 'endométrio', A);
    /* eixo dos dias */
    [1, 7, 14, 21, 28].forEach(function (d) {
      tx({ x: X(d - .5), y: 314, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, 'dia ' + d, A);
    });
    el('line', { x1: X(13.5), x2: X(13.5), y1: 32, y2: 298, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, A);
    function curva(f, y0, y1, cor) { return el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:3;stroke-linejoin:round;stroke-linecap:round' }, A); }
    var cF = curva(), cL = curva(), cE = curva(), cP = curva();
    cF.style.stroke = CF; cL.style.stroke = CL; cE.style.stroke = CE; cP.style.stroke = CP;
    var rot = [
      tx({ x: X(3.2), y: 64, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:' + CF }, 'FSH', A),
      tx({ x: X(14.6), y: 46, style: 'font-size:13.5px;font-weight:700;fill:' + CL }, 'pico de LH', A),
      tx({ x: X(9.2), y: 132, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:700;fill:' + CE }, 'estrógeno', A),
      tx({ x: X(21.5), y: 120, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:' + CP }, 'progesterona', A)
    ];
    var rotD = [4.5, 14.2, 11, 21];
    /* ovario */
    var OY = 214;
    var fol = el('circle', { cy: OY, style: 'fill:#f6d9c4;stroke:#c98e6a;stroke-width:1.5' }, A);
    var antro = el('circle', { cy: OY, style: 'fill:#fff7ec;stroke:#e2b896;stroke-width:1' }, A);
    var ovo = el('circle', { r: 4.5, style: 'fill:#e9a07a;stroke:#a85f3c;stroke-width:1' }, A);
    var cLut = el('circle', { cy: OY, style: 'fill:#f2c94c;stroke:#c39a1b;stroke-width:1.5' }, A);
    var oT = tx({ y: OY + 5, style: 'font-size:13.5px;font-weight:600;' + TXT }, '', A);
    /* endometrio */
    var EY = 294;
    var endo = el('path', { style: 'fill:#e8a7a6;stroke:#b8615f;stroke-width:1.2' }, A);
    var sang = el('path', { style: 'fill:#a3212a;opacity:.85' }, A);
    var eT = tx({ style: 'font-size:13px;font-weight:600;' + TXT }, '', A);
    /* cursor */
    var cur = el('line', { y1: 32, y2: 298, style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    var curT = tx({ y: 330, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;' + TXT }, '', A);
    var st = tx({ x: 8, y: 346, style: 'font-size:14.5px;font-weight:600;' + TXT }, '', A);
    function caminho(f, d1, y0, y1) {
      var s = '', n = Math.max(2, Math.round(d1 * 6));
      for (var k = 0; k <= n; k++) { var d = d1 * k / n; s += (k ? 'L' : 'M') + X(d).toFixed(1) + ' ' + (y0 - (y0 - y1) * f(d)).toFixed(1) + ' '; }
      return s;
    }

    /* ======== cena B: gestacao ======== */
    var B = el('g', {});
    var GX0 = 70, GX1 = 600, GY0 = 268, GY1 = 54;
    function GX(w) { return GX0 + w / 44 * (GX1 - GX0); }
    tx({ x: 8, y: 26, style: 'font-size:20px;font-weight:700;' + TXT }, 'Se houver gravidez', B);
    el('line', { x1: GX0, x2: GX0, y1: GY1 - 6, y2: GY0, style: 'stroke:var(--tinta);stroke-width:1.5' }, B);
    el('line', { x1: GX0, x2: GX1, y1: GY0, y2: GY0, style: 'stroke:var(--tinta);stroke-width:1.5' }, B);
    tx({ x: GX0 - 8, y: GY0 - 92, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'nível', B);
    tx({ x: GX0 - 8, y: GY0 - 76, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'no', B);
    tx({ x: GX0 - 8, y: GY0 - 60, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'sangue', B);
    [0, 10, 20, 30, 40].forEach(function (w) { tx({ x: GX(w), y: GY0 + 18, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, w, B); });
    tx({ x: GX(20), y: GY0 + 36, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, 'semanas de gestação', B);
    el('line', { x1: GX(40), x2: GX(40), y1: GY1 + 8, y2: GY0, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, B);
    tx({ x: GX(40) - 6, y: GY1 + 4, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:700;' + TXT }, 'parto', B);
    function hCG(w) { var v = .95 * g(w, 10, 2.8, 4.5) + .17 * ease((w - 12) / 8); return w <= 40 ? v : v * Math.exp(-(w - 40) * 3); }
    function gP(w) { var b = .1 + .8 * Math.pow(cl(w / 40), 1.3); return w <= 40 ? b : .03 + (.9 - .03) * Math.exp(-(w - 40) * 4.5); }
    function gE(w) { var b = .03 + .9 * Math.pow(cl(w / 40), 2.1); return w <= 40 ? b : .02 + (.93 - .02) * Math.exp(-(w - 40) * 4.5); }
    function gc(cor) { return el('path', { style: 'fill:none;stroke:' + cor + ';stroke-width:3;stroke-linejoin:round' }, B); }
    var bH = gc(CH), bP = gc(CP), bE = gc(CE);
    function gpath(f, w1) { var s = '', n = Math.round(w1 * 4) + 2; for (var k = 0; k <= n; k++) { var w = w1 * k / n; s += (k ? 'L' : 'M') + GX(w).toFixed(1) + ' ' + (GY0 - (GY0 - GY1) * .92 * f(w)).toFixed(1) + ' '; } return s; }
    var aH = el('g', {}, B);
    tx({ x: GX(14.2), y: GY0 - (GY0 - GY1) * .92 * .95 + 4, style: 'font-size:13.5px;font-weight:700;fill:' + CH }, 'hCG: mantém o corpo lúteo', aH);
    tx({ x: GX(14.2), y: GY0 - (GY0 - GY1) * .92 * .95 + 21, style: 'font-size:13px;' + TXT }, '(feito pelo embrião, depois pela placenta)', aH);
    var aP = el('g', {}, B);
    tx({ x: GX(30), y: GY0 - (GY0 - GY1) * .92 * gP(30) - 12, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:700;fill:' + CP }, 'progesterona', aP);
    var aE = el('g', {}, B);
    tx({ x: GX(31.5), y: GY0 - (GY0 - GY1) * .92 * gE(31.5) + 22, 'text-anchor': 'start', style: 'font-size:13.5px;font-weight:700;fill:' + CE }, 'estrógeno', aE);
    var aQ = el('g', {}, B);
    tx({ x: GX(40) + 8, y: GY0 - 120, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'a placenta', aQ);
    tx({ x: GX(40) + 8, y: GY0 - 103, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'sai: queda', aQ);
    tx({ x: GX(40) + 8, y: GY0 - 86, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'brusca', aQ);
    var bT = tx({ x: 8, y: 330, style: 'font-size:14.5px;font-weight:600;' + TXT }, '', B);
    var bT2 = tx({ x: 8, y: 348, style: 'font-size:14px;' + LAP }, '', B);

    var TA = 7.6, TB = 7.8;
    return function (t) {
      var aA = t < TA ? 1 : t < TA + .25 ? 1 - (t - TA) / .25 : 0;
      var aB = t < TB ? 0 : t < TB + .3 ? (t - TB) / .3 : t > 11.8 ? 1 - (t - 11.8) / .2 : 1;
      A.style.opacity = aA.toFixed(2); B.style.opacity = aB.toFixed(2);
      A.style.display = aA <= 0 ? 'none' : ''; B.style.display = aB <= 0 ? 'none' : '';
      if (aA > 0) {
        var d = 28 * cl((Math.min(t, TA) - .15) / 6.9);
        d = Math.max(d, .05);
        cF.setAttribute('d', caminho(FSH, d, 102, 40)); cL.setAttribute('d', caminho(LH, d, 102, 40));
        cE.setAttribute('d', caminho(EST, d, 178, 116)); cP.setAttribute('d', caminho(PROG, d, 178, 116));
        rot.forEach(function (r, i) { r.style.opacity = d > rotD[i] ? 1 : 0; });
        cur.setAttribute('x1', X(d).toFixed(1)); cur.setAttribute('x2', X(d).toFixed(1));
        var dia = Math.min(28, Math.floor(d) + 1);
        curT.setAttribute('x', Math.min(X(28) - 20, Math.max(X(0) + 20, X(d))).toFixed(1)); curT.textContent = 'dia ' + dia;
        /* ovario */
        var cx = X(d) + 0, rf = 0, ra = 0, rl = 0, ox = -99, oy = OY, lbl = '';
        cx = Math.min(Math.max(cx, X(0) + 26), X(28) - 26);
        if (d < 13.5) { rf = 6 + 14 * ease(d / 13); ra = d > 6 ? (rf - 5) * ease((d - 6) / 7) : 0; lbl = d < 6 ? 'folículos começam a crescer' : 'folículo cresce e faz estrógeno'; ox = cx + rf * .45; }
        else if (d < 15) { var u = (d - 13.5) / 1.5; rf = 20 * (1 - .4 * u); ra = rf - 5; ox = cx + 22 + 26 * u; oy = OY - 17 * u; lbl = 'ovulação: o ovócito sai'; }
        else if (d < 24) { rl = 13 + 5 * ease((d - 15) / 4); lbl = 'corpo lúteo: faz progesterona'; }
        else { rl = 18 - 9 * ease((d - 24) / 4); lbl = 'sem gravidez, o corpo lúteo regride'; }
        fol.setAttribute('cx', cx); fol.setAttribute('r', rf); antro.setAttribute('cx', cx + rf * .12); antro.setAttribute('r', Math.max(0, ra));
        ovo.setAttribute('cx', d < 13.5 ? cx + rf * .5 - 1 : ox); ovo.setAttribute('cy', oy); ovo.style.opacity = rf > 0 && d < 15 ? 1 : 0;
        cLut.setAttribute('cx', cx); cLut.setAttribute('r', rl); cLut.style.opacity = d >= 24 ? (1 - .6 * ease((d - 24) / 4)).toFixed(2) : 1;
        var right = X(d) < X(17);
        oT.textContent = lbl; oT.setAttribute('text-anchor', right ? 'start' : 'end'); oT.setAttribute('x', (right ? cx + 30 : cx - 30).toFixed(1));
        /* endometrio */
        var s = '', n = Math.max(2, Math.round(d * 5)), k, base = EY;
        for (k = 0; k <= n; k++) { var dd = d * k / n; s += (k ? 'L' : 'M') + X(dd).toFixed(1) + ' ' + (base - 34 * END(dd)).toFixed(1) + ' '; }
        endo.setAttribute('d', s + 'L' + X(d).toFixed(1) + ' ' + base + ' L' + X(0) + ' ' + base + 'Z');
        var dm = Math.min(d, 5), sm = '';
        for (k = 0; k <= 20; k++) { var d2 = dm * k / 20; sm += (k ? 'L' : 'M') + X(d2).toFixed(1) + ' ' + (base - 34 * END(d2) * .5).toFixed(1) + ' '; }
        sang.setAttribute('d', sm + 'L' + X(dm).toFixed(1) + ' ' + base + ' L' + X(0) + ' ' + base + 'Z');
        var et = d < 5 ? ['menstruação', 1] : d < 14 ? ['fase proliferativa: engrossa', 5.3] : ['fase secretora: espesso e irrigado', 14.3];
        eT.textContent = et[0]; eT.setAttribute('y', 254);
        var esq = X(d) - 8 - eT.getComputedTextLength() > XL;
        eT.setAttribute('text-anchor', esq ? 'end' : 'start'); eT.setAttribute('x', (esq ? X(d) - 8 : X(d) + 8).toFixed(1));
        var S;
        if (d < 5) S = 'Dias 1 a 5: menstruação. O FSH da hipófise sobe e estimula os folículos';
        else if (d < 12) S = 'O folículo cresce e produz cada vez mais estrógeno: o endométrio engrossa';
        else if (d < 15.2) S = 'Estrógeno alto dispara o pico de LH: ovulação por volta do dia 14';
        else if (d < 24) S = 'O corpo lúteo produz progesterona (e estrógeno): endométrio pronto';
        else S = 'Sem gravidez, o corpo lúteo regride: a progesterona cai e vem a menstruação';
        st.textContent = S;
      }
      if (aB > 0) {
        var w = 44 * ease((t - TB - .1) / 3.1);
        w = Math.max(w, .1);
        bH.setAttribute('d', gpath(hCG, w)); bP.setAttribute('d', gpath(gP, w)); bE.setAttribute('d', gpath(gE, w));
        aH.style.opacity = w > 12 ? 1 : 0; aP.style.opacity = w > 31 ? 1 : 0; aE.style.opacity = w > 32 ? 1 : 0; aQ.style.opacity = w > 40.5 ? 1 : 0;
        if (w < 14) { bT.textContent = 'O embrião faz hCG: o corpo lúteo não regride e a progesterona fica alta'; bT2.textContent = 'sem queda de progesterona, o endométrio não descama: não há menstruação'; }
        else if (w < 40) { bT.textContent = 'Por volta do 3º mês, a placenta assume a produção'; bT2.textContent = 'progesterona e estrógeno sobem até o fim; FSH e LH ficam baixos'; }
        else { bT.textContent = 'No parto a placenta é eliminada: progesterona e estrógeno despencam'; bT2.textContent = 'é essa queda que libera a lactação, e não o contrário'; }
      }
    };
  }
};
VIS.liga('ciclo-menstrual-hormonios', ['Pb99b11c', 'P87790c5', 'W45270d0', 'Wa783396', 'Pbfd00a7']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['ciclo-menstrual-hormonios'], m0 = V.monta, D0 = V.dur, R = {"Pb99b11c": ["E", "O FSH da hipófise sobe primeiro e estimula o folículo, que", "então produz estrógeno: a curva do estrógeno vem depois."], "P87790c5": ["C — 3/set, 20/ago e 30/ago", "Dia 1 = 17/ago. X: progesterona alta, fase lútea (dia 18);", "Y: FSH alto, começo do ciclo (dia 4); Z: pico de LH (dia 14)."], "W45270d0": ["C — por volta do 14º dia", "Num ciclo de 28 dias, o pico de LH do meio do ciclo", "dispara a ovulação por volta do dia 14."], "Wa783396": ["A", "O hCG do embrião e da placenta em formação mantém o corpo", "lúteo: a progesterona fica alta e não há menstruação."], "Pbfd00a7": ["D", "H1 e H2 são progesterona e estrógeno, que sobem a gestação toda", "e despencam porque a placenta, a fonte deles, é eliminada."]};
  V.dur = D0 + 2.6; V.marcas = V.marcas.concat([[D0, 'Resposta']]);
  V.monta = function (svg, qid) {
    var d = m0(svg, qid), NS = 'http://www.w3.org/2000/svg', r = R[qid];
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    var g = el('g', { style: 'display:none' });
    el('rect', { x: 0, y: 0, width: 640, height: 360, style: 'fill:var(--folha);opacity:.86' }, g);
    el('rect', { x: 36, y: 92, width: 568, height: 168, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, g);
    var t0 = el('text', { x: 60, y: 128, style: 'font-size:15px;font-weight:600;fill:var(--lapis)' }, g);
    var t1 = el('text', { x: 60, y: 162, style: 'font-size:23px;font-weight:700;fill:var(--ad-t)' }, g);
    var t2 = el('text', { x: 60, y: 202, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    var t3 = el('text', { x: 60, y: 226, style: 'font-size:15.5px;fill:var(--tinta)' }, g);
    t0.textContent = r ? 'Por isso, a resposta é' : 'Resumo';
    if (r) { t1.textContent = r[0]; t2.textContent = r[1]; t3.textContent = r[2] || ''; }
    return function (t) {
      if (t < D0) { g.style.display = 'none'; d(t); return; }
      d(D0 - .35); svg.style.opacity = 1; g.style.display = r ? '' : 'none';
      g.style.opacity = Math.min(1, (t - D0) / .3).toFixed(2);
    };
  };
})();
