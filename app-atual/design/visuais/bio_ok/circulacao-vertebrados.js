/* Coracao dos vertebrados: o sangue venoso se mistura (ou nao) com o arterial antes da aorta */
VIS.def['circulacao-vertebrados'] = {
  tit: 'Coração dos vertebrados: onde o sangue arterial e o venoso se misturam',
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Peixe'], [2.6, 'Anfíbio'], [6, 'Ave e mamífero'], [9.2, 'Resposta']],
  cred: 'Animação feita para o app (esquema fora de escala; barras de O₂ qualitativas).',
  fontes: [
    'OpenStax Biology 2e, 40.1 Overview of the Circulatory System (circulação nos vertebrados) — https://openstax.org/books/biology-2e/pages/40-1-overview-of-the-circulatory-system'
  ],
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var VERM = '#d2433b', AZ = '#4f63a8', ROXO = '#8a4f8c', MUS = '#efc4bc', MUSs = '#b5655c';
    function cav(pai, x, y, w, h, nome) {
      el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:#fbeeea;stroke:' + MUSs + ';stroke-width:2' }, pai);
      var topo = nome === 'V único' || nome === 'VD' || nome === 'VE';
      tx({ x: nome === 'V único' ? x + w / 2 : x + 8, y: topo ? y + 22 : y + h - 9, 'text-anchor': nome === 'V único' ? 'middle' : 'start', style: 'font-size:13px;font-weight:700;fill:#5b2a24' }, nome, pai);
    }
    function vaso(pai, d, cor) { el('path', { d: d, style: 'fill:none;stroke:' + cor + ';stroke-width:12;stroke-linejoin:round;opacity:.25' }, pai); }
    function rot(pai, x, y, s, cor, anc) { tx({ x: x, y: y, 'text-anchor': anc || 'start', style: 'font-size:13px;font-weight:600;fill:' + cor }, s, pai); }
    /* ---------- peixe ---------- */
    var gP = el('g', {});
    vaso(gP, 'M60 260 V120 H130', AZ); vaso(gP, 'M210 195 H300 V60', AZ); vaso(gP, 'M300 60 H340 V260 H220', VERM); vaso(gP, 'M220 260 H60', AZ);
    el('rect', { x: 120, y: 80, width: 100, height: 160, rx: 22, style: 'fill:' + MUS + ';stroke:' + MUSs + ';stroke-width:2' }, gP);
    cav(gP, 130, 92, 80, 60, 'átrio'); cav(gP, 130, 162, 80, 66, 'ventrículo');
    el('rect', { x: 276, y: 38, width: 88, height: 40, rx: 10, style: 'fill:color-mix(in srgb,#9cc6e8 30%,transparent);stroke:var(--linha);stroke-width:1.5' }, gP);
    tx({ x: 320, y: 26, 'text-anchor': 'middle', 'class': 'v-rot' }, 'Brânquias (pega O₂)', gP);
    el('rect', { x: 140, y: 270, width: 140, height: 40, rx: 10, style: 'fill:color-mix(in srgb,var(--tinta) 6%,transparent);stroke:var(--linha);stroke-width:1.5' }, gP);
    tx({ x: 210, y: 295, 'text-anchor': 'middle', 'class': 'v-rot' }, 'Corpo', gP);
    /* ---------- coracao de 2 atrios (anfibio e ave) ---------- */
    function coracao(quatro) {
      var g = el('g', {});
      vaso(g, 'M20 120 H130', AZ); vaso(g, 'M366 120 H262', VERM);
      vaso(g, 'M150 240 V300 H20', quatro ? AZ : ROXO); vaso(g, 'M244 240 V300 H366', quatro ? VERM : ROXO);
      el('rect', { x: 118, y: 80, width: 158, height: 176, rx: 26, style: 'fill:' + MUS + ';stroke:' + MUSs + ';stroke-width:2' }, g);
      cav(g, 126, 90, 68, 58, 'AD'); cav(g, 200, 90, 68, 58, 'AE');
      if (quatro) { cav(g, 126, 156, 68, 92, 'VD'); cav(g, 200, 156, 68, 92, 'VE'); }
      else cav(g, 126, 156, 142, 92, 'V único');
      rot(g, 20, 108, 'veias cavas', AZ); rot(g, 20, 140, '(do corpo)', 'var(--lapis)');
      rot(g, 366, 108, 'veia pulmonar', VERM, 'end'); rot(g, 366, 140, '(do pulmão)', 'var(--lapis)', 'end');
      rot(g, 20, 322, '→ pulmão', quatro ? AZ : ROXO); rot(g, 366, 322, 'aorta → corpo', quatro ? VERM : ROXO, 'end');
      return g;
    }
    var gA = coracao(false), gM = coracao(true);
    /* ---------- resposta: barras X e Y ---------- */
    var gR = el('g', {});
    function barras(x, nome, sub, aorta) {
      tx({ x: x + 70, y: 50, 'text-anchor': 'middle', style: 'font-size:17px;font-weight:700;fill:var(--tinta)' }, nome, gR);
      tx({ x: x + 70, y: 70, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, sub, gR);
      el('line', { x1: x, x2: x + 140, y1: 260, y2: 260, style: 'stroke:var(--tinta);stroke-width:1.5' }, gR);
      [[x + 32, 100, 'v. pulmonar'], [x + 108, aorta, 'aorta']].forEach(function (b) {
        var h = 150 * b[1] / 100;
        el('rect', { x: b[0] - 20, y: 260 - h, width: 40, height: h, rx: 3, style: 'fill:' + (b[1] > 99 ? VERM : ROXO) }, gR);
        tx({ x: b[0], y: 280, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--tinta)' }, b[2], gR);
      });
      tx({ x: x + 70, y: 306, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:' + (aorta > 99 ? 'var(--ad-t)' : ROXO) }, aorta > 99 ? 'iguais' : 'aorta com menos O₂', gR);
    }
    barras(24, 'X', 'O₂ no sangue', 100); barras(208, 'Y', 'O₂ no sangue', 62);
    /* ---------- particulas ---------- */
    var P = [];
    for (var i = 0; i < 18; i++) P.push(el('circle', { r: 5, style: 'stroke:var(--folha);stroke-width:1' }));
    function ao(pts, u) {   /* ponto ao longo de uma poligonal, u em [0,1] */
      var L = 0, seg = [];
      for (var k = 1; k < pts.length; k++) { var d = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); seg.push(d); L += d; }
      var alvo = u * L;
      for (k = 0; k < seg.length; k++) { if (alvo <= seg[k]) { var f = alvo / seg[k]; return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f]; } alvo -= seg[k]; }
      return pts[pts.length - 1];
    }
    var PEIXE = [[60, 260], [60, 120], [170, 120], [170, 195], [210, 195], [300, 195], [300, 60], [340, 60], [340, 260], [60, 260]];
    var AZ_IN = [[20, 120], [160, 120], [160, 200]], VM_IN = [[366, 120], [234, 120], [234, 200]];
    var A_PULM = [[160, 200], [150, 240], [150, 300], [20, 300]], A_AORT = [[234, 200], [244, 240], [244, 300], [366, 300]];
    /* painel */
    var PX = 396;
    var tit = tx({ x: PX, y: 40, 'class': 'v-fase' });
    var L = []; for (i = 0; i < 7; i++) L.push(tx({ x: PX, y: 68 + i * 21, 'class': 'v-sub' }));
    var gB = el('g', {});
    tx({ x: PX, y: 210, 'class': 'v-lab' }, 'O₂ no sangue', gB);
    el('line', { x1: PX, x2: PX + 220, y1: 316, y2: 316, style: 'stroke:var(--tinta);stroke-width:1.5' }, gB);
    var bPul = el('rect', { x: PX + 30, width: 50, rx: 3, style: 'fill:' + VERM }, gB), bAor = el('rect', { x: PX + 130, width: 50, rx: 3 }, gB);
    tx({ x: PX + 55, y: 336, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--tinta)' }, 'v. pulmonar', gB);
    tx({ x: PX + 155, y: 336, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--tinta)' }, 'aorta', gB);
    var TXT = [
      ['Peixe', ['Coração com 1 átrio e', '1 ventrículo: só passa', 'sangue venoso por ele.', 'O O₂ entra nas brânquias.', 'Circulação simples:', 'não há o que misturar.']],
      ['Anfíbio', ['2 átrios, 1 ventrículo.', 'O venoso (AD) e o arterial', '(AE) caem no MESMO', 'ventrículo e se misturam.', 'A aorta sai com menos O₂', 'que a veia pulmonar.']],
      ['Ave e mamífero', ['4 cavidades: o septo', 'separa VD e VE por inteiro.', 'O venoso nunca encontra o', 'arterial: a aorta tem o', 'mesmo O₂ da veia pulmonar.', '(Réptil: septo incompleto,', 'exceto crocodilos: 4 cavidades.)']],
      ['Por isso', ['X: aorta = veia pulmonar,', 'sem mistura: ave (pardal).', 'Y: aorta com menos O₂,', 'mistura no ventrículo:', 'anfíbio (sapo).', 'Por isso a resposta é B.']]
    ];
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    return function (t) {
      var e = t < 2.6 ? 0 : t < 6 ? 1 : t < 9.2 ? 2 : 3, tl = t - [0, 2.6, 6, 9.2][e];
      gP.style.display = e === 0 ? '' : 'none'; gA.style.display = e === 1 ? '' : 'none'; gM.style.display = e === 2 ? '' : 'none'; gR.style.display = e === 3 ? '' : 'none';
      tit.textContent = TXT[e][0];
      for (var k = 0; k < 7; k++) L[k].textContent = TXT[e][1][k] || '';
      P.forEach(function (p, k) {
        if (e === 3) { p.style.display = 'none'; return; }
        p.style.display = '';
        var u = (t * .32 + k / 18) % 1, q, cor;
        if (e === 0) {
          q = ao(PEIXE, u);
          cor = u > .55 && u < .9 ? VERM : AZ;   /* oxigena nas branquias, volta venoso do corpo */
        } else {
          var venoso = k % 2 === 0, troca = e === 1 && k % 6 < 2;   /* no anfibio, parte de cada sangue sai pelo outro vaso */
          var entra = venoso ? AZ_IN : VM_IN, sai = venoso ? (troca ? A_AORT : A_PULM) : (troca ? A_PULM : A_AORT);
          var meio = e === 1 ? [[197 + 30 * Math.sin(k * 1.7), 205 + 18 * Math.cos(k)]] : [];
          q = ao(entra.concat(meio, sai), u);
          cor = venoso ? AZ : VERM;
        }
        p.setAttribute('cx', q[0].toFixed(1)); p.setAttribute('cy', q[1].toFixed(1)); p.style.fill = cor;
      });
      gB.style.display = e === 1 || e === 2 ? '' : 'none';
      var hA = e === 1 ? 62 : 100, cresce = ease(tl / 1.5);
      bPul.setAttribute('height', (100 * cresce).toFixed(1)); bPul.setAttribute('y', (316 - 100 * cresce).toFixed(1));
      bAor.setAttribute('height', (hA * cresce).toFixed(1)); bAor.setAttribute('y', (316 - hA * cresce).toFixed(1));
      bAor.style.fill = e === 1 ? ROXO : VERM;
    };
  }
};
VIS.liga('circulacao-vertebrados', ['P5989d59']);
