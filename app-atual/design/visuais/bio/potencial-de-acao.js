VIS.def['potencial-de-acao'] = {
  tit: 'Potencial de ação: íons atravessando a membrana e o impulso correndo pelo axônio',
  fontes: ['OpenStax Biology 2e, 35.2 How Neurons Communicate — https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (esquema fora de escala; câmera lenta: o potencial de ação real dura cerca de 2 milissegundos).',
  marcas: [[0, 'Repouso'], [1.6, 'Na⁺ entra, K⁺ sai'], [4.8, 'Bomba (ATP)'], [7.2, 'Com e sem mielina']],
  nota: 'Repouso: fora positivo, dentro negativo (−70 mV), com Na⁺ concentrado fora e K⁺ dentro graças à bomba de Na⁺/K⁺. O estímulo abre canais de Na⁺: o Na⁺ entra e o interior fica positivo (despolarização). Depois o K⁺ sai e a membrana volta a ficar negativa por dentro (repolarização). A mielina deixa a membrana exposta só nos nódulos de Ranvier: o impulso salta de nódulo em nódulo e fica muito mais rápido.',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var NA = '#e0862a', KK = '#7a55c8', NAt = '#c46a10', KKt = '#7a55c8';
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';

    /* ================= cena A: membrana + grafico ================= */
    var A = el('g', {});
    var MY = 142, MH = 28;   /* membrana */
    var XNA = 108, XK = 198, XB = 288;
    /* rotulos das regioes */
    var rFora = tx({ x: 20, y: 24, style: 'font-size:14px;font-weight:600;' + LAP }, '', A);
    var tf1 = el('tspan', {}, rFora); tf1.textContent = 'MEIO EXTERNO: muito ';
    var tf2 = el('tspan', { style: 'fill:' + NAt + ';font-weight:700' }, rFora); tf2.textContent = 'Na⁺';
    var rDen = tx({ x: 20, y: 300, style: 'font-size:14px;font-weight:600;' + LAP }, '', A);
    var td1 = el('tspan', {}, rDen); td1.textContent = 'CITOPLASMA: muito ';
    var td2 = el('tspan', { style: 'fill:' + KKt + ';font-weight:700' }, rDen); td2.textContent = 'K⁺';
    /* rotulos das proteinas */
    var lNa = tx({ x: XNA, y: 48, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;' + TXT }, 'canal de Na⁺', A);
    var lK = tx({ x: XK, y: 48, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;' + TXT }, 'canal de K⁺', A);
    var lB = tx({ x: XB, y: 48, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;' + TXT }, 'bomba', A);
    var lB2 = tx({ x: XB, y: 64, 'text-anchor': 'middle', style: 'font-size:13px;' + LAP }, 'Na⁺/K⁺ (ATP)', A);
    /* membrana: bicamada */
    el('rect', { x: 14, y: MY, width: 318, height: MH, rx: 4, style: 'fill:#f2dfb8;stroke:#c8ad78;stroke-width:1.5' }, A);
    el('line', { x1: 14, x2: 332, y1: MY + MH / 2, y2: MY + MH / 2, style: 'stroke:#c8ad78;stroke-width:1;stroke-dasharray:3 4' }, A);
    /* canais: duas metades que se afastam */
    function canal(x, cor) {
      var e = el('rect', { y: MY - 6, width: 13, height: MH + 12, rx: 5, style: 'fill:' + cor + ';stroke:rgba(0,0,0,.25);stroke-width:1' }, A);
      var d = el('rect', { y: MY - 6, width: 13, height: MH + 12, rx: 5, style: 'fill:' + cor + ';stroke:rgba(0,0,0,.25);stroke-width:1' }, A);
      return function (ab) { var g = 1 + 9 * ab; e.setAttribute('x', (x - g / 2 - 13).toFixed(1)); d.setAttribute('x', (x + g / 2).toFixed(1)); };
    }
    var cNa = canal(XNA, '#f0b77a'), cK = canal(XK, '#b9a3e3');
    el('rect', { x: XB - 17, y: MY - 8, width: 34, height: MH + 16, rx: 9, style: 'fill:#a9c9a0;stroke:rgba(0,0,0,.25);stroke-width:1' }, A);
    var bombaSeta = el('path', { d: '', style: 'fill:none;stroke:#2f6b33;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round' }, A);
    /* cargas nas faces */
    var cargasF = [], cargasD = [];
    [34, 58, 140, 164, 230, 254].forEach(function (x) {
      cargasF.push(tx({ x: x, y: MY - 7, 'text-anchor': 'middle', style: 'font-size:17px;font-weight:700' }, '+', A));
      cargasD.push(tx({ x: x, y: MY + MH + 19, 'text-anchor': 'middle', style: 'font-size:17px;font-weight:700' }, '−', A));
    });
    /* ions fixos */
    function ion(x, y, cor) { return el('circle', { cx: x, cy: y, r: 6.5, style: 'fill:' + cor + ';stroke:rgba(0,0,0,.3);stroke-width:1' }, A); }
    [[30, 84], [56, 104], [40, 122], [150, 82], [168, 110], [140, 124], [236, 86], [252, 112], [318, 92], [72, 78]].forEach(function (p) { ion(p[0], p[1], NA); });
    [[226, 122], [310, 120]].forEach(function (p) { ion(p[0], p[1], KK); });
    [[30, 206], [58, 232], [40, 262], [150, 214], [168, 248], [138, 272], [236, 214], [250, 262], [316, 250], [74, 276]].forEach(function (p) { ion(p[0], p[1], KK); });
    [[62, 206], [178, 272]].forEach(function (p) { ion(p[0], p[1], NA); });
    /* ions que se movem: 3 Na+ entram pelo canal, 2 K+ saem; a bomba devolve */
    var naM = [], kM = [];
    var naFora = [[XNA - 9, 96], [XNA + 9, 112], [XNA, 80]], naDentro = [[XNA - 12, 214], [XNA + 12, 232], [XNA - 2, 258]];
    var kDentro = [[XK - 10, 222], [XK + 10, 246]], kFora = [[XK - 10, 100], [XK + 8, 118]];
    for (var i = 0; i < 3; i++) naM.push(ion(0, 0, NA));
    for (i = 0; i < 2; i++) kM.push(ion(0, 0, KK));
    function caminho(pts, u) {   /* posicao ao longo de uma poligonal, u 0..1 */
      var L = [], tot = 0, k;
      for (k = 1; k < pts.length; k++) { var d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); L.push(d); tot += d; }
      var s = cl(u) * tot;
      for (k = 0; k < L.length; k++) { if (s <= L[k] || k === L.length - 1) { var w = L[k] ? cl(s / L[k]) : 0; return [lerp(pts[k][0], pts[k + 1][0], w), lerp(pts[k][1], pts[k + 1][1], w)]; } s -= L[k]; }
    }
    /* painel de fase */
    var PX = 360;
    var fase = tx({ x: PX, y: 30, style: 'font-size:22px;font-weight:700;' + TXT }, '', A);
    var f2 = tx({ x: PX, y: 52, style: 'font-size:14.5px;' + TXT }, '', A), f3 = tx({ x: PX, y: 71, style: 'font-size:14.5px;' + TXT }, '', A), f4 = tx({ x: PX, y: 90, style: 'font-size:14.5px;' + TXT }, '', A);
    /* grafico mV x tempo */
    var GX0 = 404, GX1 = 624, GY = function (v) { return 302 - (v + 90) * 1.38; };
    el('line', { x1: GX0, x2: GX0, y1: GY(45), y2: GY(-90), style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    el('line', { x1: GX0, x2: GX1, y1: GY(-90), y2: GY(-90), style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    tx({ x: GX1, y: GY(-90) + 18, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'tempo', A);
    tx({ x: GX0 - 8, y: GY(45) - 8, style: 'font-size:13px;font-weight:600;' + LAP }, 'mV (dentro em relação a fora)', A);
    [[30, '+30'], [0, '0'], [-70, '−70']].forEach(function (p) {
      tx({ x: GX0 - 6, y: GY(p[0]) + 5, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, p[1], A);
      el('line', { x1: GX0 - 3, x2: GX0, y1: GY(p[0]), y2: GY(p[0]), style: 'stroke:var(--tinta);stroke-width:1.5' }, A);
    });
    el('line', { x1: GX0, x2: GX1, y1: GY(0), y2: GY(0), style: 'stroke:var(--linha);stroke-width:1' }, A);
    el('line', { x1: GX0, x2: GX1, y1: GY(-55), y2: GY(-55), style: 'stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:5 4' }, A);
    tx({ x: GX1, y: GY(-55) - 6, 'text-anchor': 'end', style: 'font-size:13px;' + LAP }, 'limiar −55', A);
    var curva = el('path', { d: '', style: 'fill:none;stroke:var(--ad-c);stroke-width:3;stroke-linejoin:round;stroke-linecap:round' }, A);
    var pt = el('circle', { r: 5.5, style: 'fill:var(--ad-t)' }, A);
    var anot = tx({ 'text-anchor': 'start', style: 'font-size:13.5px;font-weight:700;fill:var(--ad-t)' }, '', A);

    function V(t) {
      if (t < 1.4) return -70;
      if (t < 1.9) return lerp(-70, -55, ease((t - 1.4) / .5));
      if (t < 2.5) return lerp(-55, 30, ease((t - 1.9) / .6));
      if (t < 3.4) return lerp(30, -70, ease((t - 2.5) / .9));
      if (t < 3.9) return lerp(-70, -80, ease((t - 3.4) / .5));
      if (t < 4.8) return lerp(-80, -70, ease((t - 3.9) / .9));
      return -70;
    }
    var TG = 6.2;   /* tempo da cena A mostrado no grafico */
    function gx(t) { return GX0 + 6 + (GX1 - GX0 - 10) * t / TG; }

    /* ================= cena B: conducao ================= */
    var B = el('g', {});
    tx({ x: 20, y: 30, style: 'font-size:22px;font-weight:700;' + TXT }, 'O impulso correndo pelo axônio', B);
    var sub = tx({ x: 20, y: 52, style: 'font-size:14.5px;font-weight:600;' + TXT }, '', B);
    var Y1 = 134, Y2 = 268, AX0 = 30, AX1 = 612;
    tx({ x: AX0, y: 86, style: 'font-size:15px;font-weight:700;' + TXT }, 'Com mielina: condução saltatória (rápida)', B);
    el('rect', { x: AX0, y: Y1 - 9, width: AX1 - AX0, height: 18, rx: 9, style: 'fill:#e9c6b5;stroke:#b98a74;stroke-width:1.5' }, B);
    var NOS = [AX0 + 7], passo = 94, larg = 80;
    for (var k = 0; k < 6; k++) {
      var x0 = AX0 + 14 + k * passo;
      el('rect', { x: x0, y: Y1 - 19, width: larg, height: 38, rx: 16, style: 'fill:#f6f0de;stroke:#cdbb8c;stroke-width:1.5' }, B);
      NOS.push(x0 + larg + 7);
    }
    var glow1 = [];
    NOS.forEach(function (x) { glow1.push(el('circle', { cx: x, cy: Y1, r: 11, style: 'fill:#e8590c;opacity:0' }, B)); });
    var salto = el('path', { d: '', style: 'fill:none;stroke:#e8590c;stroke-width:2.5;stroke-dasharray:5 4;opacity:0' }, B);
    /* rotulos do axonio 1 */
    var xm = AX0 + 14 + passo + larg / 2;
    el('line', { x1: xm, x2: xm, y1: Y1 + 20, y2: Y1 + 36, style: 'stroke:var(--lapis);stroke-width:1.2' }, B);
    tx({ x: xm, y: Y1 + 52, 'text-anchor': 'middle', style: 'font-size:13.5px;' + TXT }, 'bainha de mielina (isolante)', B);
    var xn = NOS[3];
    el('line', { x1: xn, x2: xn, y1: Y1 + 12, y2: Y1 + 36, style: 'stroke:var(--lapis);stroke-width:1.2' }, B);
    tx({ x: xn + 4, y: Y1 + 52, 'text-anchor': 'start', style: 'font-size:13.5px;' + TXT }, 'nódulo de Ranvier: só aqui o', B);
    tx({ x: xn + 4, y: Y1 + 69, 'text-anchor': 'start', style: 'font-size:13.5px;' + TXT }, 'potencial de ação é refeito', B);
    var fim1 = tx({ x: AX1, y: Y1 - 28, 'text-anchor': 'end', style: 'font-size:14px;font-weight:700;fill:#c2470a' }, '', B);

    tx({ x: AX0, y: Y2 - 34, style: 'font-size:15px;font-weight:700;' + TXT }, 'Sem mielina (como na esclerose múltipla): condução contínua, lenta', B);
    el('rect', { x: AX0, y: Y2 - 9, width: AX1 - AX0, height: 18, rx: 9, style: 'fill:#e9c6b5;stroke:#b98a74;stroke-width:1.5' }, B);
    var onda2 = el('rect', { y: Y2 - 12, height: 24, rx: 12, style: 'fill:#e8590c;opacity:.85' }, B);
    var rastro2 = el('rect', { x: AX0, y: Y2 - 9, height: 18, rx: 9, style: 'fill:#e8590c;opacity:.18' }, B);
    tx({ x: AX0, y: Y2 + 36, style: 'font-size:13.5px;' + TXT }, 'toda a membrana fica exposta e o potencial de ação é refeito ponto a ponto', B);
    var fim2 = tx({ x: AX1, y: Y2 + 62, 'text-anchor': 'end', style: 'font-size:14px;font-weight:700;fill:#c2470a' }, '', B);

    var TB = 7.2;
    return function (t) {
      var aA = t < 7 ? 1 : t < 7.4 ? 1 - (t - 7) / .4 : t > 11.7 ? 0 : 0;
      var aB = t < 7.2 ? 0 : t < 7.6 ? (t - 7.2) / .4 : t > 11.75 ? 1 - (t - 11.75) / .25 : 1;
      A.style.opacity = aA.toFixed(2); B.style.opacity = aB.toFixed(2);
      A.style.display = aA <= 0 ? 'none' : ''; B.style.display = aB <= 0 ? 'none' : '';
      if (aA > 0) {
        var tA = Math.min(t, 7);
        var v = V(tA);
        var abNa = tA > 1.85 && tA < 2.6 ? Math.min(1, (tA - 1.85) / .12, (2.6 - tA) / .12) : 0;
        var abK = tA > 2.45 && tA < 4.3 ? Math.min(1, (tA - 2.45) / .15, (4.3 - tA) / .2) : 0;
        cNa(cl(abNa)); cK(cl(abK));
        lNa.style.fontWeight = abNa > 0 ? '800' : '600'; lK.style.fontWeight = abK > 0 ? '800' : '600';
        /* cargas: invertem quando o interior fica positivo */
        var inv = v > 0;
        cargasF.forEach(function (c) { c.textContent = inv ? '−' : '+'; c.style.fill = inv ? '#1f6fb2' : '#b4442f'; });
        cargasD.forEach(function (c) { c.textContent = inv ? '+' : '−'; c.style.fill = inv ? '#b4442f' : '#1f6fb2'; });
        /* bomba: setas quando trabalha */
        var bomba = (tA < 1.4) || (tA > 4.9);
        bombaSeta.setAttribute('d', bomba ? 'M' + (XB - 7) + ' ' + (MY + MH + 2) + ' V' + (MY - 4) + ' m-5 6 l5 -6 l5 6 M' + (XB + 7) + ' ' + (MY - 4) + ' V' + (MY + MH + 2) + ' m-5 -6 l5 6 l5 -6' : '');
        lB.style.fontWeight = tA > 4.9 ? '800' : '600';
        /* Na+ que entra (1.9-2.6) e volta pela bomba (5.0-6.6) */
        naM.forEach(function (c, i) {
          var p, d0 = 1.9 + i * .14, r0 = 5.0 + i * .45;
          if (tA < r0) p = caminho([naFora[i], [XNA, 92], [XNA, MY + MH / 2], [XNA, 198], naDentro[i]], (tA - d0) / .45);
          else p = caminho([naDentro[i], [XB - 6, 200], [XB - 6, MY + MH / 2], [XB - 6, 100], naFora[i]], (tA - r0) / 1.0);
          c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1));
        });
        kM.forEach(function (c, i) {
          var p, d0 = 2.6 + i * .3, r0 = 5.3 + i * .5;
          if (tA < r0) p = caminho([kDentro[i], [XK, 205], [XK, MY + MH / 2], [XK, 128], kFora[i]], (tA - d0) / .6);
          else p = caminho([kFora[i], [XB + 6, 110], [XB + 6, MY + MH / 2], [XB + 6, 200], kDentro[i]], (tA - r0) / 1.0);
          c.setAttribute('cx', p[0].toFixed(1)); c.setAttribute('cy', p[1].toFixed(1));
        });
        /* textos */
        var F;
        if (tA < 1.4) F = ['Repouso: −70 mV', 'fora +, dentro −; a bomba de Na⁺/K⁺', 'mantém Na⁺ fora e K⁺ dentro'];
        else if (tA < 1.9) F = ['Estímulo', 'a membrana perde um pouco da carga', 'e chega ao limiar (−55 mV)'];
        else if (tA < 2.55) F = ['Despolarização', 'canais de Na⁺ abrem: o Na⁺ entra', 'e o interior fica positivo'];
        else if (tA < 3.4) F = ['Repolarização', 'canais de Na⁺ fecham e os de K⁺', 'abrem: o K⁺ sai, dentro volta a −'];
        else if (tA < 4.8) F = ['Hiperpolarização', 'o K⁺ continua saindo: abaixo de −70;', 'depois os canais de K⁺ fecham'];
        else F = ['Bomba de Na⁺/K⁺', 'o −70 mV já voltou pelos canais;', 'a bomba (ATP) repõe os gradientes:', '3 Na⁺ para fora, 2 K⁺ para dentro'];
        fase.textContent = F[0]; f2.textContent = F[1]; f3.textContent = F[2]; f4.textContent = F[3] || '';
        /* grafico */
        var d = '', n = Math.max(1, Math.round(tA / TG * 120));
        for (var s = 0; s <= n; s++) { var ts = Math.min(tA, TG) * s / n; d += (s ? 'L' : 'M') + gx(ts).toFixed(1) + ' ' + GY(V(ts)).toFixed(1) + ' '; }
        curva.setAttribute('d', d);
        var tp = Math.min(tA, TG);
        pt.setAttribute('cx', gx(tp).toFixed(1)); pt.setAttribute('cy', GY(V(tp)).toFixed(1));
        var an = '';
        if (tA >= 2.35 && tA < 2.9) { an = 'pico +30'; anot.setAttribute('x', (gx(2.5) + 10).toFixed(1)); anot.setAttribute('y', (GY(30) + 4).toFixed(1)); }
        else if (tA >= 3.7 && tA < 4.5) { an = 'hiperpolarização →'; anot.setAttribute('x', (GX0 + 8).toFixed(1)); anot.setAttribute('y', (GY(-80) + 5).toFixed(1)); }
        anot.textContent = an;
      }
      if (aB > 0) {
        var u = Math.max(0, t - TB);   /* 0..4.8 */
        /* axonio 1: salta de no em no, 0.55 s por no */
        var dt = .5, kk = Math.floor(u / dt), fr = (u - kk * dt) / dt;
        glow1.forEach(function (g, i) {
          var o = 0;
          if (i === kk && i < NOS.length) o = 1 - .5 * fr;
          else if (i === NOS.length - 1 && kk >= NOS.length) o = .6;
          else if (i === kk - 1) o = .25 * (1 - fr);
          g.style.opacity = o.toFixed(2);
        });
        if (kk < NOS.length - 1) {
          var xa = NOS[kk], xb = NOS[kk + 1], xc = lerp(xa, xb, ease(fr * 1.6));
          salto.setAttribute('d', 'M' + xa + ' ' + (Y1 - 22) + ' Q' + ((xa + xb) / 2) + ' ' + (Y1 - 46) + ' ' + xb + ' ' + (Y1 - 22));
          salto.style.opacity = (.85 * (1 - fr)).toFixed(2);
          fim1.textContent = '';
        } else { salto.style.opacity = 0; fim1.textContent = 'chegou ao fim do axônio'; }
        /* axonio 2: avanco continuo, bem mais lento */
        var x2 = AX0 + 8 + 30 * u;
        onda2.setAttribute('x', (x2 - 14).toFixed(1)); onda2.setAttribute('width', 28);
        rastro2.setAttribute('width', Math.max(0, x2 - AX0).toFixed(1));
        fim2.textContent = u > 3.1 ? 'no mesmo tempo, avançou bem menos' : '';
        sub.textContent = u > 3.1 ? 'Por isso, perder a mielina (esclerose múltipla) deixa o impulso mais lento' : 'os dois partem juntos; o desenho mostra o mesmo intervalo de tempo';
      }
    };
  }
};
VIS.liga('potencial-de-acao', ['Waa25e3d', 'Wfc51d05', 'Wc7d3e7c', 'Wbc12c6f']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['potencial-de-acao'], m0 = V.monta, D0 = V.dur, R = {"Waa25e3d": ["E — sódio", "O estímulo abre canais de Na⁺; como há muito Na⁺ fora,", "ele entra rápido e despolariza a membrana. O K⁺ só sai depois."], "Wfc51d05": ["A", "No repouso a bomba põe Na⁺ para fora e traz K⁺ para dentro", "(3 Na⁺ saem, 2 K⁺ entram, com gasto de ATP): mantém os gradientes."], "Wc7d3e7c": ["E (a frase incorreta)", "Depois do impulso a membrana volta a ter fora positivo e", "dentro negativo; as duas faces nunca ficam positivas."], "Wbc12c6f": ["C", "Sem mielina não há saltos entre nódulos de Ranvier: o potencial", "de ação é refeito ponto a ponto e a condução fica mais lenta."]};
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
