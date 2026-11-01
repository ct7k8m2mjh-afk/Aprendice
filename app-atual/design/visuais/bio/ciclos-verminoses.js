VIS.def['ciclos-verminoses'] = {
  tit: 'Verminoses: por onde o verme entra e onde vive o adulto',
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app (esquema fora de escala). Foto do ovo de Schistosoma mansoni (microscópio óptico): CDC, Public Health Image Library nº 4841, domínio público, via Wikimedia Commons.',
  marcas: function (qid) { var N = { E: 'Esquistossomose', L: 'Lombriga e amarelão', T: 'Tênia e prevenção' }, o = ({ P04e21cc: 'LTE', Pbe72ace: 'LTE', Wcb6aa5d: 'ETL', P054601b: 'ETL' })[qid] || 'ELT'; return [[0, N[o[0]]], [4.4, N[o[1]]], [8.2, N[o[2]]]]; },
  nota: 'Caixas tracejadas são fases fora do corpo humano. O que separa as verminoses é a porta de entrada e onde vive o adulto: esquistossomo entra pela pele na água e vive nas veias do intestino; lombriga entra pela boca, como ovo; ancilóstomo (amarelão) entra pela pele a partir do solo; tênia: carne crua com cisticerco dá teníase, e o ovo engolido dá cisticercose.',
  fontes: [
    'CDC DPDx, Schistosomiasis — https://www.cdc.gov/dpdx/schistosomiasis/index.html',
    'CDC DPDx, Ascariasis — https://www.cdc.gov/dpdx/ascariasis/index.html',
    'CDC DPDx, Hookworm (intestinal) — https://www.cdc.gov/dpdx/hookworm/index.html',
    'CDC DPDx, Taeniasis — https://www.cdc.gov/dpdx/taeniasis/index.html'
  ],
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    svg.setAttribute('viewBox', '0 0 640 370');
    var AZ = '#2f6fa8', LA = '#b8642a', DEF = 'color-mix(in srgb,var(--tinta) 55%,transparent)';
    function caixa(pai, x, y, w, h, linhas, tipo, cor) {
      var g = el('g', {}, pai);
      var r = el('rect', { x: x, y: y, width: w, height: h, rx: 9, style: 'fill:' + (tipo === 'e' ? 'color-mix(in srgb,#7fa9c9 12%,var(--folha))' : 'color-mix(in srgb,#d99a8f 12%,var(--folha))') + ';stroke:' + (cor || DEF) + ';stroke-width:1.6' + (tipo === 'e' ? ';stroke-dasharray:6 4' : '') }, g);
      var y0 = y + h / 2 - (linhas.length - 1) * 8.5 + 5;
      linhas.forEach(function (l, i) {
        var forte = l.charAt(0) === '*'; if (forte) l = l.slice(1);
        tx({ x: x + w / 2, y: y0 + i * 17, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:' + (forte ? (cor || 'var(--tinta)') : 'var(--tinta)') + ';font-weight:' + (forte ? 700 : 400) }, l, g);
      });
      return { r: r, cor: cor || DEF, tipo: tipo, cx: x + w / 2, cy: y + h / 2 };
    }
    function seta(pai, d, cor) { return el('path', { d: d, style: 'fill:none;stroke:' + (cor || 'var(--lapis)') + ';stroke-width:2;stroke-linecap:round;stroke-linejoin:round' }, pai); }
    /* ========== ato 1: esquistossomose ========== */
    var A1 = el('g', {});
    tx({ x: 14, y: 26, style: 'font-size:19px;font-weight:700;fill:var(--tinta)' }, 'Esquistossomose (Schistosoma mansoni)', A1);
    var sub1 = tx({ x: 14, y: 49, style: 'font-size:14px;fill:var(--tinta)' }, 'entra pela PELE, na água doce; o adulto vive dentro das veias do intestino', A1);
    var b1 = [
      caixa(A1, 14, 70, 148, 62, ['*PELE: a cercária', 'atravessa a pele', 'na água'], 'h', LA),
      caixa(A1, 178, 70, 148, 62, ['vai pelo sangue até', 'o sistema', 'porta-hepático'], 'h'),
      caixa(A1, 342, 70, 148, 62, ['casal adulto nas', 'veias mesentéricas', '(sistema porta)'], 'h'),
      caixa(A1, 506, 70, 120, 62, ['ovo com espículo', 'fura o vaso e a', 'parede intestinal'], 'h'),
      caixa(A1, 492, 296, 134, 62, ['ovos saem', 'nas fezes e', 'chegam à água'], 'e'),
      caixa(A1, 342, 296, 134, 62, ['na água doce', 'eclode o', 'miracídio'], 'e'),
      caixa(A1, 178, 296, 148, 62, ['caramujo Biomphalaria:', 'multiplicação', 'assexuada'], 'e'),
      caixa(A1, 14, 296, 148, 62, ['cercárias saem', 'do caramujo e', 'nadam na água'], 'e')
    ];
    seta(A1, 'M162 101 h14 m-7 -5 l7 5 l-7 5'); seta(A1, 'M326 101 h14 m-7 -5 l7 5 l-7 5'); seta(A1, 'M490 101 h14 m-7 -5 l7 5 l-7 5');
    seta(A1, 'M566 132 V294 m-5 -7 l5 7 l5 -7'); seta(A1, 'M492 327 h-14 m7 -5 l-7 5 l7 5'); seta(A1, 'M342 327 h-14 m7 -5 l-7 5 l7 5'); seta(A1, 'M178 327 h-14 m7 -5 l-7 5 l7 5');
    seta(A1, 'M88 296 V134 m-5 7 l5 -7 l5 7');
    tx({ x: 98, y: 206, style: 'font-size:13.5px;fill:var(--lapis)' }, 'ser humano:', A1);
    tx({ x: 98, y: 222, style: 'font-size:13.5px;fill:var(--lapis)' }, 'hospedeiro', A1);
    tx({ x: 98, y: 238, style: 'font-size:13.5px;fill:var(--lapis)' }, 'definitivo', A1);
    tx({ x: 98, y: 254, style: 'font-size:13.5px;fill:var(--lapis)' }, '(reprodução', A1);
    tx({ x: 98, y: 270, style: 'font-size:13.5px;fill:var(--lapis)' }, 'sexuada)', A1);
    tx({ x: 252, y: 289, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--lapis)' }, 'hospedeiro intermediário', A1);
    /* foto real do ovo */
    el('image', { href: 'vis/ciclos-verminoses-1.webp', x: 244, y: 146, width: 160, height: 120, preserveAspectRatio: 'xMidYMid slice' }, A1);
    el('rect', { x: 244, y: 146, width: 160, height: 120, rx: 4, style: 'fill:none;stroke:var(--linha);stroke-width:1.5' }, A1);
    var espX = 244 + 160 * 0.195, espY = 146 + 120 * 0.70;   /* posicao do espiculo na foto (ajustada a imagem) */
    tx({ x: 412, y: 176, style: 'font-size:13.5px;font-weight:700;fill:var(--tinta)' }, 'ovo nas fezes', A1);
    tx({ x: 412, y: 193, style: 'font-size:13.5px;fill:var(--tinta)' }, '(foto real, cerca', A1);
    tx({ x: 412, y: 210, style: 'font-size:13.5px;fill:var(--tinta)' }, 'de 0,15 mm)', A1);
    var espT = tx({ x: 412, y: 250, style: 'font-size:13.5px;font-weight:700;fill:' + LA }, 'espículo lateral', A1);
    var espL = seta(A1, '', LA);
    /* ========== ato 2: lombriga e amarelao ========== */
    var A2 = el('g', {});
    tx({ x: 14, y: 26, style: 'font-size:19px;font-weight:700;fill:var(--tinta)' }, 'Lombriga (Ascaris) e amarelão (ancilóstomo)', A2);
    tx({ x: 14, y: 49, style: 'font-size:14px;fill:var(--tinta)' }, 'as larvas dos dois passam pelo pulmão; muda a porta de entrada', A2);
    var b2 = [
      caixa(A2, 40, 72, 150, 62, ['ovo com larva', 'em água ou', 'alimento sujo'], 'e', AZ),
      caixa(A2, 206, 72, 160, 62, ['*BOCA: ovo engolido;', 'a larva eclode no', 'intestino e fura a parede'], 'h', AZ),
      caixa(A2, 40, 160, 150, 62, ['o ovo eclode', 'no solo úmido:', 'larva livre'], 'e', LA),
      caixa(A2, 206, 160, 160, 62, ['*PELE: a larva fura', 'a pele (pé descalço)', 'e cai no sangue'], 'h', LA),
      caixa(A2, 392, 96, 234, 66, ['pelo sangue até o coração e', 'o PULMÃO (a da lombriga', 'passa antes pelo fígado)'], 'h'),
      caixa(A2, 392, 180, 234, 52, ['sobe brônquios e traqueia', 'e é engolida (ciclo de Loss)'], 'h'),
      caixa(A2, 392, 256, 234, 70, ['adulto no intestino delgado', '(o ancilóstomo fica preso à', 'mucosa e suga sangue: anemia)'], 'h'),
      caixa(A2, 206, 264, 160, 52, ['ovos saem', 'nas fezes'], 'e')
    ];
    seta(A2, 'M190 103 h14 m-7 -5 l7 5 l-7 5', AZ); seta(A2, 'M190 191 h14 m-7 -5 l7 5 l-7 5', LA);
    seta(A2, 'M366 103 C380 103 378 124 390 124 m-8 -5 l8 5 l-8 5', AZ); seta(A2, 'M366 191 C380 191 378 140 390 140 m-8 -5 l8 5 l-8 5', LA);
    seta(A2, 'M509 162 V178 m-5 -7 l5 7 l5 -7'); seta(A2, 'M509 232 V254 m-5 -7 l5 7 l5 -7'); seta(A2, 'M392 290 h-24 m7 -5 l-7 5 l7 5');
    seta(A2, 'M206 290 H22 V103 H38 m-7 -5 l7 5 l-7 5'); seta(A2, 'M22 191 H38 m-7 -5 l7 5 l-7 5');
    var bot2 = tx({ x: 30, y: 352, style: 'font-size:13.5px;fill:var(--lapis)' }, 'ovos no solo: o de lombriga amadurece e é engolido; o de ancilóstomo eclode e libera a larva', A2);
    /* ========== ato 3: tenia ========== */
    var A3 = el('g', {}), VM = '#8a3a5a';
    tx({ x: 14, y: 26, style: 'font-size:19px;font-weight:700;fill:var(--tinta)' }, 'Tênia (platelminto): teníase ou cisticercose', A3);
    tx({ x: 14, y: 49, style: 'font-size:14px;fill:var(--tinta)' }, 'o que a pessoa engole decide a doença: a larva (cisticerco) ou o ovo', A3);
    var b3 = [
      caixa(A3, 14, 70, 172, 62, ['come carne crua ou', 'malpassada com', '*cisticerco (larva)'], 'h', VM),
      caixa(A3, 232, 70, 172, 62, ['no intestino vira', 'a tênia adulta:', '*TENÍASE'], 'h', VM),
      caixa(A3, 450, 70, 176, 62, ['anéis (proglotes)', 'cheios de ovos', 'saem nas fezes'], 'e'),
      caixa(A3, 232, 166, 172, 62, ['porco ou boi come', 'os ovos: forma', 'cisticercos no músculo'], 'e'),
      caixa(A3, 450, 166, 176, 62, ['*pessoa engole o OVO', '(T. solium): larvas em', 'músculo, olho, cérebro'], 'h', '#b4442f')
    ];
    seta(A3, 'M186 101 h44 m-7 -5 l7 5 l-7 5', VM); seta(A3, 'M404 101 h44 m-7 -5 l7 5 l-7 5');
    seta(A3, 'M492 132 L392 166 m2 -9 l-2 9 l9 1'); seta(A3, 'M560 132 V164 m-5 -7 l5 7 l5 -7', '#b4442f');
    seta(A3, 'M232 197 H100 V134 m-5 7 l5 -7 l5 7');
    tx({ x: 538, y: 246, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:#b4442f' }, 'CISTICERCOSE', A3);
    el('rect', { x: 14, y: 258, width: 612, height: 108, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 8%,var(--folha));stroke:var(--linha)' }, A3);
    tx({ x: 26, y: 278, style: 'font-size:14px;font-weight:700;fill:var(--ad-t)' }, 'Prevenção, verme por verme', A3);
    tx({ x: 26, y: 296, style: 'font-size:13.5px;fill:var(--tinta)' }, 'esquistossomo: esgoto tratado, combater o caramujo e evitar água com caramujo', A3);
    tx({ x: 26, y: 313, style: 'font-size:13.5px;fill:var(--tinta)' }, 'lombriga: água tratada, alimentos lavados   |   amarelão: andar calçado', A3);
    tx({ x: 26, y: 330, style: 'font-size:13.5px;fill:var(--tinta)' }, 'tênia: carne bem cozida e inspecionada; higiene contra os ovos', A3);
    var line3 = tx({ x: 26, y: 352, style: 'font-size:13.5px;font-weight:700;fill:var(--ad-t)' }, ({ P04e21cc: 'Por isso: ovo com espículo que fura o vaso = esquistossomose (D).', Pbe72ace: 'Por isso: o adulto vive no sistema porta-hepático e os ovos saem nas fezes (B).', Wcb6aa5d: 'Por isso: ovo engolido que passa pelo sangue e pelo pulmão = Ascaris (A).', P054601b: 'Por isso: I, ovo engolido = ascaridíase; II, larva pela pele = ancilostomose (C).', W9a7eec3: 'Por isso só a II está certa: tênia é platelminto e calçado não evita lombriga (B).' })[qid] || 'Por isso: a porta de entrada e o lugar do adulto identificam cada verme.', A3);
    function percorre(lista, u) {
      var n = lista.length, f = u * n, i = Math.min(n - 1, Math.floor(f)), w = f - i, a = lista[i], b = lista[(i + 1) % n];
      var k = w < .55 ? 0 : (w - .55) / .45; k = k * k * (3 - 2 * k);
      return [a.cx + (b.cx - a.cx) * k, a.cy + (b.cy - a.cy) * k, w < .55 ? i : -1];
    }
    function realca(lista, i) { lista.forEach(function (b, j) { b.r.style.strokeWidth = j === i ? 3.4 : 1.6; b.r.style.stroke = j === i ? (b.cor === DEF ? 'var(--tinta)' : b.cor) : b.cor; b.r.style.strokeDasharray = j === i ? 'none' : (b.tipo === 'e' ? '6 4' : 'none'); }); }
    function op(t, a, b) { return t < a || t >= b ? 0 : Math.min(cl((t - a) / .4), b >= 12 ? 1 : cl((b - t) / .4), a === 0 ? 1 : 1); }
    var ORD = (({ P04e21cc: 'LTE', Pbe72ace: 'LTE', Wcb6aa5d: 'ETL', P054601b: 'ETL' })[qid] || 'ELT').split('');
    var SL = [[0, 4.4], [4.4, 8.2], [8.2, 12]];
    var PE = { P04e21cc: 'Por isso: ovo com espículo que fura o vaso = esquistossomose (D).', Pbe72ace: 'Por isso: adulto no sistema porta e ovos nas fezes (B).' }[qid];
    var PL = { Wcb6aa5d: 'Por isso: ovo engolido que passa pelo sangue e pelo pulmão = Ascaris (A).', P054601b: 'Por isso: I, ovo engolido = ascaridíase; II, larva pela pele = ancilostomose (C).' }[qid];
    var SUB1 = sub1.textContent, BOT2 = bot2.textContent;
    if (qid && qid !== 'W9a7eec3') line3.style.display = 'none';
    function fixo(e, txt, por) { e.textContent = por || txt; e.style.fontWeight = por ? 700 : ''; e.style.fill = por ? 'var(--ad-t)' : ''; }
    return function (t) {
      var G = { E: A1, L: A2, T: A3 };
      ORD.forEach(function (a, i) {
        var s0 = SL[i][0], s1 = SL[i][1], o = t < s0 || t >= s1 ? 0 : Math.min(i === 0 ? 1 : cl((t - s0) / .4), i === 2 ? 1 : cl((s1 - t) / .4));
        if (i === 2 && t >= 12) o = 1;
        G[a].style.opacity = o.toFixed(2); G[a].style.display = o > 0 ? '' : 'none';
        if (t < s0 || t >= s1) return;
        var len = s1 - s0, tau = t - s0, u = cl((tau - .2) / (len - .5)), fim = i === 2 && tau > len - 1.8;
        if (a === 'E') {
          var p = percorre(b1, u); realca(b1, p[2]);
          espL.setAttribute('d', 'M408 246 L' + (espX + 6).toFixed(1) + ' ' + (espY + 6).toFixed(1));
          fixo(sub1, SUB1, fim ? PE : null);
        } else if (a === 'L') {
          var A = [b2[0], b2[1], b2[4], b2[5], b2[6], b2[7]], B = [b2[2], b2[3], b2[4], b2[5], b2[6], b2[7]];
          var pa = percorre(A, u), pb = percorre(B, u);
          b2.forEach(function (b) { b.r.style.strokeWidth = 1.6; b.r.style.stroke = b.cor; b.r.style.strokeDasharray = b.tipo === 'e' ? '6 4' : 'none'; });
          [pa[2], pb[2]].forEach(function (k2, k) { if (k2 < 0) return; var bx = (k ? B : A)[k2]; bx.r.style.strokeWidth = 3.4; bx.r.style.strokeDasharray = 'none'; if (bx.cor === DEF) bx.r.style.stroke = 'var(--tinta)'; });
          fixo(bot2, BOT2, fim ? PL : null);
        } else {
          var ordem = [b3[0], b3[1], b3[2], b3[3], b3[4]], q = percorre(ordem, u);
          realca(b3, b3.indexOf(ordem[q[2]]));
        }
      });
    };
  }
};
VIS.liga('ciclos-verminoses', ['P04e21cc', 'Pbe72ace', 'Wcb6aa5d', 'P054601b', 'W9a7eec3']);
