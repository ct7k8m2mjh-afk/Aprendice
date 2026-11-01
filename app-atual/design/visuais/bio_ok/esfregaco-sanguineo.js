/* Do esfregaco ao hemograma: o que cada elemento do sangue faz e o que muda quando ele sobe ou cai */
VIS.def['esfregaco-sanguineo'] = {
  tit: 'Lendo um hemograma: cada célula do sangue, sua função e o que acontece quando ela muda',
  tipo: 'anim', dur: 15,
  marcas: [[0, 'No sangue'], [2.5, 'Hemácia'], [5, 'Altitude'], [7.5, 'Leucócito'], [10, 'Plaqueta'], [12.5, 'A ficha']],
  cred: 'Foto do esfregaço (Wright): Echinaceapallida, CC BY-SA 4.0, via Wikimedia Commons (Blood-neutrophil2). Animação feita para o app (esquema fora de escala).',
  fontes: [
    'OpenStax Biology 2e, 40.2 Components of the Blood — https://openstax.org/books/biology-2e/pages/40-2-components-of-the-blood',
    'OpenStax Anatomy and Physiology 2e, 18.3 Erythrocytes (EPO, altitude, anemia, policitemia) — https://openstax.org/books/anatomy-and-physiology-2e/pages/18-3-erythrocytes',
    'OpenStax Anatomy and Physiology 2e, 18.4 Leukocytes and Platelets (HIV, leucemia, trombocitopenia) — https://openstax.org/books/anatomy-and-physiology-2e/pages/18-4-leukocytes-and-platelets'
  ],
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var VERM = '#c8463d', ROXO = '#6b3fa0', O2 = '#ff6b5e', AZ = '#4f63a8';
    function hem(pai, r) { var g = el('g', {}, pai); el('circle', { r: r, style: 'fill:' + VERM + ';stroke:#8e2a23;stroke-width:1.2' }, g); el('circle', { r: r * .42, style: 'fill:#dc7168' }, g); return g; }
    function leuc(pai, r, anormal) {
      var g = el('g', {}, pai); el('circle', { r: r, style: 'fill:#efe3f2;stroke:#9c7fb0;stroke-width:1.2' }, g);
      if (anormal) el('circle', { r: r * .72, style: 'fill:' + ROXO }, g);
      else [[-.35, -.2], [.3, -.25], [0, .32]].forEach(function (p) { el('circle', { cx: p[0] * r, cy: p[1] * r, r: r * .3, style: 'fill:' + ROXO }, g); });
      return g;
    }
    function plaq(pai) { var g = el('g', {}, pai); el('ellipse', { rx: 4, ry: 2.6, style: 'fill:#8a5bb5' }, g); return g; }
    function caixa(pai, x, y, w, h, t1, t2) {
      el('rect', { x: x, y: y, width: w, height: h, rx: 10, style: 'fill:color-mix(in srgb,var(--tinta) 6%,transparent);stroke:var(--linha);stroke-width:1.5' }, pai);
      tx({ x: x + w / 2, y: y + (t2 ? 22 : 28), 'text-anchor': 'middle', 'class': 'v-rot' }, t1, pai);
      if (t2) tx({ x: x + w / 2, y: y + 40, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, t2, pai);
    }
    function poe(g, x, y) { g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')'); }
    function seta(pai, x1, y1, x2, y2) { var a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a); el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - 9 * c + 6 * s) + ' ' + (y2 - 9 * s - 6 * c) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - 9 * c - 6 * s) + ' ' + (y2 - 9 * s + 6 * c), style: 'fill:none;stroke:var(--tinta);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round' }, pai); }
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    var G = [];
    /* ---------- 1. o que ha no sangue (foto real) ---------- */
    var g1 = el('g', {}); G.push(g1);
    var FX = 20, FY = 34, FW = 340, s = FW / 640;
    el('image', { href: 'vis/esfregaco-sanguineo-1.webp', x: FX, y: FY, width: FW, height: 255 }, g1);
    function pino(px, py, lx, ly, t, anc) {
      var x = FX + px * s, y = FY + py * s;
      el('line', { x1: x, y1: y, x2: lx, y2: ly, style: 'stroke:#fff;stroke-width:2.2' }, g1);
      el('circle', { cx: x, cy: y, r: 4, style: 'fill:#fff;stroke:#222;stroke-width:1.5' }, g1);
      var w = t.length * 7.4 + 14, rx = anc === 'end' ? lx - w : lx;
      el('rect', { x: rx, y: ly - 13, width: w, height: 22, rx: 6, style: 'fill:rgba(255,255,255,.92)' }, g1);
      tx({ x: rx + 7, y: ly + 3, style: 'font-size:13px;font-weight:700;fill:#1d1d1d' }, t, g1);
    }
    pino(304, 288, 200, 262, 'leucócito: tem núcleo', 'start');
    pino(280, 152, 250, 56, 'plaqueta', 'start');
    pino(148, 246, 30, 70, 'hemácia: sem núcleo', 'start');
    tx({ x: FX, y: 312, 'class': 'v-sub' }, 'Esfregaço corado, microscópio óptico', g1);
    /* ---------- 2. hemacia leva O2 (normal x anemia) ---------- */
    var g2 = el('g', {}); G.push(g2);
    caixa(g2, 20, 120, 84, 66, 'Pulmão', 'pega O₂');
    caixa(g2, 290, 120, 84, 66, 'Músculo', 'usa O₂');
    el('rect', { x: 104, y: 140, width: 186, height: 26, style: 'fill:#f3d9d6;stroke:#c98a8f;stroke-width:1.5' }, g2);
    var h2 = []; for (var i = 0; i < 6; i++) { var gg = el('g', {}, g2); hem(gg, 10); el('circle', { cx: 0, cy: -10, r: 4, style: 'fill:' + O2 }, gg); h2.push(gg); }
    tx({ x: 20, y: 222, 'class': 'v-lab' }, 'O₂ que chega ao músculo', g2);
    el('rect', { x: 20, y: 232, width: 300, height: 16, rx: 8, 'class': 'v-trilho' }, g2);
    var bar2 = el('rect', { x: 20, y: 232, height: 16, rx: 8, style: 'fill:' + O2 }, g2);
    var t2a = tx({ x: 20, y: 284, 'class': 'v-rot' }, '', g2), t2b = tx({ x: 20, y: 304, 'class': 'v-sub' }, '', g2);
    var t2top = tx({ x: 20, y: 100, 'class': 'v-rot' }, '', g2);
    /* ---------- 3. altitude: menos O2 -> EPO -> medula -> mais hemacias ---------- */
    var g3 = el('g', {}); G.push(g3);
    caixa(g3, 16, 40, 104, 62, 'Ar da altitude', 'menos O₂');
    caixa(g3, 140, 40, 104, 62, 'Rim', 'libera EPO');
    caixa(g3, 264, 40, 104, 62, 'Medula óssea', 'faz hemácias');
    seta(g3, 121, 71, 138, 71); seta(g3, 245, 71, 262, 71);
    el('rect', { x: 20, y: 150, width: 348, height: 60, rx: 8, style: 'fill:#f3d9d6;stroke:#c98a8f;stroke-width:1.5' }, g3);
    var h3 = []; for (i = 0; i < 12; i++) { gg = hem(g3, 10); poe(gg, 40 + (i % 12) * 28, 180 + (i % 2 ? 10 : -10)); h3.push(gg); }
    var t3a = tx({ x: 20, y: 140, 'class': 'v-lab' }, '', g3);
    var t3b = tx({ x: 20, y: 244, 'class': 'v-rot' }, '', g3), t3c = tx({ x: 20, y: 264, 'class': 'v-sub' }, '', g3), t3d = tx({ x: 20, y: 284, 'class': 'v-sub' }, '', g3);
    /* ---------- 4. leucocitos: HIV x leucemia ---------- */
    var g4 = el('g', {}); G.push(g4);
    var gHIV = el('g', {}, g4), gLeu = el('g', {}, g4);
    tx({ x: 20, y: 40, 'class': 'v-rot' }, 'HIV: o vírus destrói linfócitos T (CD4)', gHIV);
    var linf = []; for (i = 0; i < 8; i++) { gg = leuc(gHIV, 13, true); poe(gg, 44 + i * 42, 90); linf.push(gg); }
    var vir = []; for (i = 0; i < 8; i++) { gg = el('g', {}, gHIV); el('circle', { r: 6, style: 'fill:none;stroke:#2e8b57;stroke-width:2.5' }, gg); for (var j = 0; j < 6; j++) { var a = j * Math.PI / 3; el('line', { x1: 6 * Math.cos(a), y1: 6 * Math.sin(a), x2: 10 * Math.cos(a), y2: 10 * Math.sin(a), style: 'stroke:#2e8b57;stroke-width:2' }, gg); } vir.push(gg); }
    var tH = tx({ x: 20, y: 140, 'class': 'v-sub forte' }, '', gHIV);
    tx({ x: 20, y: 190, 'class': 'v-rot' }, 'Leucemia: medula lotada de leucócitos anormais', gLeu);
    el('rect', { x: 20, y: 204, width: 348, height: 86, rx: 10, style: 'fill:#f6efe6;stroke:#c9a98a;stroke-width:1.5' }, gLeu);
    var med = []; for (i = 0; i < 24; i++) { gg = (i % 3 === 2) ? hem(gLeu, 9) : leuc(gLeu, 10, true); poe(gg, 38 + (i % 12) * 28, 230 + Math.floor(i / 12) * 34); med.push({ g: gg, h: i % 3 === 2 }); }
    var tL = tx({ x: 20, y: 316, 'class': 'v-sub forte' }, '', gLeu);
    /* ---------- 5. plaqueta tampa o vaso ---------- */
    var g5 = el('g', {}); G.push(g5);
    el('path', { d: 'M20 120 H170 M200 120 H368 M20 210 H368', style: 'fill:none;stroke:#b5655c;stroke-width:8;stroke-linecap:round' }, g5);
    el('rect', { x: 20, y: 124, width: 348, height: 82, style: 'fill:#f3d9d6' }, g5);
    tx({ x: 214, y: 104, style: 'font-size:13px;font-weight:700;fill:var(--tinta)' }, '← corte na parede do vaso', g5);
    var pl5 = []; for (i = 0; i < 10; i++) { gg = plaq(g5); pl5.push(gg); }
    var hem5 = []; for (i = 0; i < 5; i++) { gg = hem(g5, 8); hem5.push(gg); }
    var tampa = tx({ x: 185, y: 240, 'text-anchor': 'middle', 'class': 'v-rot' }, '', g5);
    var t5b = tx({ x: 20, y: 284, 'class': 'v-sub forte' }, '', g5), t5c = tx({ x: 20, y: 304, 'class': 'v-sub' }, '', g5);
    /* ---------- 6. a ficha ---------- */
    var g6 = el('g', {}); G.push(g6);
    var linhas = [['Hemácias', '↓', 'anemia: palidez, cansaço'], ['', '↑', 'altitude (EPO) ou doping'], ['Leucócitos', '↓', 'HIV: imunidade baixa'], ['', '↑↑', 'leucemia (e hemácias ↓)'], ['Plaquetas', '↓', 'sangramentos']];
    tx({ x: 20, y: 34, 'class': 'v-lab' }, 'Fora da faixa de referência', g6);
    linhas.forEach(function (l, k) {
      var y = 66 + k * 46;
      el('rect', { x: 16, y: y - 24, width: 356, height: 38, rx: 8, style: 'fill:color-mix(in srgb,var(--tinta) ' + (k % 2 ? 3 : 6) + '%,transparent)' }, g6);
      tx({ x: 26, y: y, 'class': 'v-rot' }, l[0], g6);
      tx({ x: 122, y: y + 1, style: 'font-size:18px;font-weight:700;fill:' + (l[1] === '↓' ? AZ : VERM) }, l[1], g6);
      tx({ x: 156, y: y, 'class': 'v-sub' }, l[2], g6);
    });
    /* ---------- painel ---------- */
    var PX = 396;
    var fase = tx({ x: PX, y: 40, 'class': 'v-fase' });
    var L = []; for (i = 0; i < 8; i++) L.push(tx({ x: PX, y: 70 + i * 21, 'class': 'v-sub' + (i >= 6 ? ' forte' : '') }));
    var TXT = [
      ['O que há no sangue', ['Hemácias: muitíssimas,', 'sem núcleo, levam O₂.', 'Leucócitos: com núcleo', '(só eles têm DNA nuclear),', 'defendem o corpo.', 'Plaquetas: fragmentos sem', 'núcleo; coagulação.', '']],
      ['Hemácia leva O₂', ['Cada hemácia, cheia de', 'hemoglobina, leva O₂ do', 'pulmão aos tecidos.', 'Hemácias baixas (anemia):', 'chega menos O₂ ao músculo.', '', 'Palidez e cansaço.', '']],
      ['Altitude', ['Ar com menos O₂: o rim', 'sente e libera EPO; a medula', 'faz mais hemácias. Em', 'semanas, hemácias ↑.', 'Mais hemácias = mais O₂', 'e mais ATP no músculo.', 'Por isso é vantagem', '(doping) no esporte.']],
      ['Leucócito defende', ['HIV: linfócitos T CD4 caem;', 'leucócitos ↓ e infecções.', '', 'Leucemia: câncer de', 'leucócitos. Eles enchem', 'a medula e sobra pouco', 'espaço para hemácias:', 'leucócitos ↑↑, hemácias ↓.']],
      ['Plaqueta tampa', ['No corte, plaquetas grudam', 'e formam um tampão; depois', 'vem o coágulo.', 'Plaquetas baixas: o tampão', 'não se forma e o sangue', 'continua saindo (nariz,', 'gengiva, manchas roxas).', '']],
      ['Lendo a ficha', ['Ache o número fora da', 'faixa e ligue à função', 'que ele faz.', '', '', 'Por isso: só o leucócito tem DNA;', 'hemácias ↑ = mais O₂ (doping);', 'plaquetas ↓ = sangramento.']]
    ];
    var desenha0 = function (t) {
      var e = Math.min(5, Math.floor(t / 2.5)), tl = t - e * 2.5;
      G.forEach(function (g, k) { g.style.display = k === e ? '' : 'none'; });
      fase.textContent = TXT[e][0];
      for (var k = 0; k < 8; k++) L[k].textContent = TXT[e][1][k] || '';
      if (e === 1) {
        var an = tl >= 1.25, n = an ? 2 : 6;
        h2.forEach(function (g, k) {
          var x = 104 + ((tl * 70 + k * 31) % 186);
          if (an) x = 104 + ((tl * 70 + k * 93) % 186);
          poe(g, x, 153); g.style.display = k < n ? '' : 'none';
          g.lastChild.style.opacity = x > 270 ? 0 : 1;
        });
        bar2.setAttribute('width', an ? 90 : 300);
        t2top.textContent = an ? 'Anemia: poucas hemácias' : 'Normal';
        t2a.textContent = an ? 'Menos hemácias, menos O₂ entregue' : 'Hemácias em número normal';
        t2b.textContent = an ? 'o músculo produz menos energia' : 'o músculo recebe O₂ suficiente';
      } else if (e === 2) {
        var u = ease((tl - .6) / 1.4), n3 = Math.round(6 + 6 * u);
        h3.forEach(function (g, k) { g.style.display = k < n3 ? '' : 'none'; });
        t3a.textContent = 'Sangue (mesmo volume)';
        t3b.textContent = 'Hemácias: ' + (u > .5 ? 'acima do normal' : 'normais');
        t3c.textContent = u > .5 ? 'hematócrito alto: mais hemoglobina,' : 'ao chegar à altitude';
        t3d.textContent = u > .5 ? 'mais O₂ transportado' : '';
      } else if (e === 3) {
        var fim = ease((tl - .2) / 1.6);
        linf.forEach(function (g, k) { g.style.opacity = k < 3 ? 1 : (1 - fim).toFixed(2); });
        vir.forEach(function (g, k) { poe(g, 44 + k * 42 + 12, 90 - 14 - 40 * (1 - Math.min(1, tl / .8))); g.style.display = k < 3 ? 'none' : ''; g.style.opacity = (1 - fim * .6).toFixed(2); });
        tH.textContent = fim > .5 ? 'Leucócitos ↓: imunidade baixa' : '';
        var enche = ease((tl - .5) / 1.5);
        med.forEach(function (m, k) { if (m.h) m.g.style.opacity = (1 - enche * .85).toFixed(2); });
        tL.textContent = enche > .5 ? 'Leucócitos ↑↑ e hemácias ↓ (anemia)' : '';
      } else if (e === 4) {
        var poucas = tl >= 1.5, tt = poucas ? tl - 1.5 : tl, np = poucas ? 2 : 10;
        pl5.forEach(function (g, k) {
          var x0 = 30 + k * 30, y0 = 150 + (k % 3) * 18, alvo = [178 + (k % 5) * 6 - 12, 124 + Math.floor(k / 5) * 7];
          var u = ease((tt - k * .03) / .5);
          poe(g, x0 + (alvo[0] - x0) * u, y0 + (alvo[1] - y0) * u);
          g.style.display = k < np ? '' : 'none';
        });
        hem5.forEach(function (g, k) {
          var u = ((tt * .9 + k / 5) % 1);
          poe(g, 185 + 6 * Math.sin(k * 2), 126 - 70 * u);
          g.style.display = poucas || tt < .4 ? '' : 'none';
          g.style.opacity = (1 - u).toFixed(2);
        });
        tampa.textContent = poucas ? 'poucas plaquetas: o sangue continua saindo' : (tt > .55 ? 'tampão de plaquetas: o sangramento para' : '');
        tampa.style.fill = poucas ? VERM : 'var(--ad-t)';
        t5b.textContent = poucas ? 'Plaquetas baixas = sangramento' : 'Plaquetas normais';
        t5c.textContent = poucas ? '(ex.: sangramento nasal que não para)' : 'fecham o corte em minutos';
      }
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"P57b8f55": {"e": 0, "L": ["Resposta B:", "só os leucócitos têm", "núcleo com DNA.", ""]}, "Pc1f1b79": {"e": 5, "L": ["Resposta C (2, 3 e 1):", "A: leucócitos ↓ = HIV;", "B: plaquetas ↓ = sangra;", "C: hemácias ↓ = pálido."]}, "Pc82dfe1": {"e": 5, "L": ["Resposta A:", "1 = Rogério (hemácias ↑,", "altitude); 2 = Marcelo", "(leucemia); 3 = Fábio."]}, "Wa83cf48": {"e": 5, "L": ["Resposta A:", "sangramento nasal =", "plaquetas ↓ (coagulação).", ""]}, "W83dd2c4": {"e": 2, "L": ["Resposta D:", "hemácias ↑ = mais O₂", "e mais energia aeróbia.", ""]}}, R = RESP[qid];
    return function (t) {
      if (t < 12.5 || !R) { desenha0(t); return; }
      /* cena que decide esta questao: 0 = foto (nucleo), 2 = altitude, 5 = ficha */
      desenha0(R.e === 5 ? t : R.e === 2 ? 7 + ((t - 12.5) % .45) : (t - 12.5) % 2.4);
      fase.textContent = 'Resposta';
      for (var k = 0; k < 4; k++) L[4 + k].textContent = R.L[k];
    };
  }
};
VIS.liga('esfregaco-sanguineo', ['P57b8f55', 'Pc1f1b79', 'Pc82dfe1', 'Wa83cf48', 'W83dd2c4']);
