/* Linkage: permuta (crossing-over) entre dois genes ligados e distancia em cM */
VIS.def['permuta-distancia-genica'] = {
  tit: 'Permuta entre genes ligados: gametas recombinantes e distância no cromossomo',
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Pareamento'], [2.6, 'Permuta'], [5.4, 'Gametas'], [8, 'Distância'], [13, 'Resposta']],
  fontes: [
    'OpenStax Biology 2e, 13.1 Chromosomal Theory and Genetic Linkage — https://openstax.org/books/biology-2e/pages/13-1-chromosomal-theory-and-genetic-linkage'
  ],
  cred: 'Animação feita para o app (esquema fora de escala).',
  nota: 'A permuta entre A e B não acontece em toda meiose; quanto mais longe um gene do outro, mais vezes ela cai entre eles. Por isso a % de recombinantes (soma dos dois tipos novos) mede a distância.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var AZ = '#4f74b3', AZt = '#ffffff', LA = '#e3a64f', LAt = '#3b2603';
    var X0 = 24, XC = 138, X1 = 250, XA = 72, XB = 204, H = 22;
    /* 4 cromatides: cada uma = segmento esquerdo (gene A/a) + direito (gene B/b) */
    var gCrom = el('g', {});
    var crom = [];
    var cores = [[AZ, AZ], [AZ, AZ], [LA, LA], [LA, LA]];
    var letras = [['A', 'B'], ['A', 'B'], ['a', 'b'], ['a', 'b']];
    for (var i = 0; i < 4; i++) {
      var c = { gE: el('g', {}, gCrom), gD: el('g', {}, gCrom) };
      el('rect', { x: X0, y: 0, width: XC - X0, height: H, rx: 10, style: 'fill:' + cores[i][0] }, c.gE);
      tx({ x: XA, y: 16, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + (i < 2 ? AZt : LAt) }, letras[i][0], c.gE);
      el('rect', { x: XC, y: 0, width: X1 - XC, height: H, rx: 10, style: 'fill:' + cores[i][1] }, c.gD);
      tx({ x: XB, y: 16, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + (i < 2 ? AZt : LAt) }, letras[i][1], c.gD);
      crom.push(c);
    }
    /* centromeros (unem as cromatides-irmas) */
    var cen1 = el('rect', { x: 34, width: 12, rx: 6, style: 'fill:#2f4d80' }, gCrom), cen2 = el('rect', { x: 34, width: 12, rx: 6, style: 'fill:#b07a2a' }, gCrom);
    var quiasma = el('path', { style: 'fill:none;stroke:var(--tinta);stroke-width:3;stroke-linecap:round' });
    var quiT = tx({ x: XC, 'text-anchor': 'middle', 'class': 'v-rot' });
    var rotHom1 = tx({ x: X0, 'class': 'v-lab' }), rotHom2 = tx({ x: X0, 'class': 'v-lab' });
    /* rotulos dos gametas */
    var rotG = [];
    for (i = 0; i < 4; i++) rotG.push([tx({ x: 262, style: 'font-size:16px;font-weight:700;fill:var(--tinta)' }), tx({ x: 262, style: 'font-size:13px;fill:var(--lapis)' })]);
    /* mapa (fase 4) */
    var gMapa = el('g', {});
    var mapa1 = el('rect', { x: X0, y: 80, width: 226, height: H, rx: 10, style: 'fill:' + AZ }, gMapa);
    var mapa2 = el('rect', { x: X0, y: 108, width: 226, height: H, rx: 10, style: 'fill:' + LA }, gMapa);
    var mA1 = tx({ x: 50, y: 96, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + AZt }, 'A', gMapa);
    var mA2 = tx({ x: 50, y: 124, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + LAt }, 'a', gMapa);
    var mB1 = tx({ y: 96, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + AZt }, 'B', gMapa);
    var mB2 = tx({ y: 124, 'text-anchor': 'middle', style: 'font-size:15px;font-weight:700;fill:' + LAt }, 'b', gMapa);
    var regua = el('path', { style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, gMapa);
    var reguaT = tx({ y: 64, 'text-anchor': 'middle', 'class': 'v-rot' }, '', gMapa);
    var esq = [];
    esq.push(tx({ x: X0, y: 160, 'class': 'v-sub' }, 'Arranjo cis (AB/ab): os dois', gMapa));
    esq.push(tx({ x: X0, y: 179, 'class': 'v-sub' }, 'dominantes no mesmo cromossomo.', gMapa));
    esq.push(tx({ x: X0, y: 218, 'class': 'v-sub forte' }, 'Se fosse trans (Ab/aB):', gMapa));
    esq.push(tx({ x: X0, y: 237, 'class': 'v-sub' }, 'Ab e aB seriam os parentais,', gMapa));
    esq.push(tx({ x: X0, y: 256, 'class': 'v-sub' }, 'AB e ab os recombinantes.', gMapa));
    tx({ x: X0, y: 295, 'class': 'v-sub' }, 'Máximo possível: 50% de', gMapa);
    tx({ x: X0, y: 314, 'class': 'v-sub' }, 'recombinantes.', gMapa);
    /* painel */
    var px = 372;
    var fase = tx({ x: px, y: 42, 'class': 'v-fase' });
    var L = [];
    for (i = 0; i < 5; i++) L.push(tx({ x: px, y: 70 + i * 20, 'class': 'v-sub' }));
    /* barras de gametas */
    var gBar = el('g', {});
    var tBar = tx({ x: px, y: 160, 'class': 'v-lab' }, '', gBar);
    tx({ x: px, y: 186, style: 'font-size:13px;font-weight:600;fill:var(--lapis)' }, 'PARENTAIS (mais frequentes)', gBar);
    tx({ x: px, y: 252, style: 'font-size:13px;font-weight:600;fill:var(--ad-t)' }, 'RECOMBINANTES (combinações novas)', gBar);
    var nomes = ['AB', 'ab', 'Ab', 'aB'], barras = [], nomeT = [];
    for (i = 0; i < 4; i++) {
      var y = [193, 217, 259, 283][i];
      nomeT.push(tx({ x: px, y: y + 15, style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }, nomes[i], gBar));
      el('rect', { x: px + 34, y: y, width: 226, height: 18, rx: 4, 'class': 'v-trilho' }, gBar);
      barras.push([el('rect', { x: px + 34, y: y, height: 18, rx: 4, style: 'fill:' + (i < 2 ? 'var(--lapis)' : 'var(--ad-c)') }, gBar), tx({ y: y + 14, style: 'font-size:14px;font-weight:600;fill:var(--tinta)' }, '', gBar)]);
    }
    var tRec = tx({ x: px, y: 330, 'class': 'v-sub forte' }, '', gBar);
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    function lin(a, b, u) { return a + (b - a) * u; }
    function fmt(v) { return (Math.round(v * 10) / 10).toString().replace('.', ','); }
    var desenha0 = function (t) {
      /* ---- cromatides (fases 1-3) ---- */
      var par = ease(t / 1.8);                       /* homologos se aproximam */
      var troca = ease((t - 3.6) / 1.6);             /* segmentos direitos trocam de lugar */
      var sep = ease((t - 5.4) / 1.4);               /* os 4 gametas se separam */
      var some = ease((t - 7.8) / 0.6);              /* sai para o mapa */
      var y0 = [lin(76, 100, par), lin(100, 124, par), lin(198, 152, par), lin(222, 176, par)];
      var yF = [64, 124, 184, 244];
      var y = y0.map(function (v, k) { return lin(v, yF[k], sep); });
      /* troca: o segmento direito da cromatide 2 vai para a linha 3 e vice-versa */
      var yD = y.slice();
      yD[1] = lin(y[1], y[2], troca); yD[2] = lin(y[2], y[1], troca);
      if (sep > 0) { yD[1] = y[1]; yD[2] = y[2]; }
      var transito = troca > 0 && troca < 1 && sep === 0;
      crom[1].gD.style.opacity = crom[2].gD.style.opacity = transito ? .7 : 1;   /* segmentos cruzando: semitransparentes */
      crom[1].gD.lastChild.style.opacity = crom[2].gD.lastChild.style.opacity = transito ? 0 : 1;   /* letras somem enquanto cruzam */
      for (var k = 0; k < 4; k++) {
        crom[k].gE.setAttribute('transform', 'translate(0,' + y[k].toFixed(1) + ')');
        crom[k].gD.setAttribute('transform', 'translate(0,' + yD[k].toFixed(1) + ')');
      }
      /* depois da troca, o segmento direito da cromatide 2 e' laranja (b) e o da 3 e' azul (B) */
      if (troca >= 1 || sep > 0) {
        crom[1].gD.setAttribute('transform', 'translate(0,' + y[2].toFixed(1) + ')');
        crom[2].gD.setAttribute('transform', 'translate(0,' + y[1].toFixed(1) + ')');
      }
      var juntos = sep < .05;
      cen1.setAttribute('y', (y[0] + 2).toFixed(1)); cen1.setAttribute('height', (y[1] - y[0] + H - 4).toFixed(1));
      cen2.setAttribute('y', (y[2] + 2).toFixed(1)); cen2.setAttribute('height', (y[3] - y[2] + H - 4).toFixed(1));
      cen1.style.opacity = cen2.style.opacity = juntos ? 1 : 0;
      gCrom.style.opacity = (1 - some).toFixed(2);
      rotHom1.setAttribute('y', (y[0] - 10).toFixed(1)); rotHom2.setAttribute('y', (y[3] + H + 20).toFixed(1));
      rotHom1.textContent = t < 5.4 ? 'cromossomo com A e B (cromátides-irmãs)' : '';
      rotHom2.textContent = t < 5.4 ? 'homólogo com a e b' : '';
      /* quiasma */
      var q = t >= 2.6 && t < 5.4 ? Math.min(1, (t - 2.6) / .5) : 0;
      var ym = (y[1] + y[2] + H) / 2;
      quiasma.setAttribute('d', 'M' + (XC - 12) + ' ' + (ym - 14) + ' L' + (XC + 12) + ' ' + (ym + 14) + ' M' + (XC + 12) + ' ' + (ym - 14) + ' L' + (XC - 12) + ' ' + (ym + 14));
      quiasma.style.opacity = (q * (1 - troca * .6)).toFixed(2);
      quiT.setAttribute('y', (y[0] - 34).toFixed(1)); quiT.textContent = q > 0 ? 'permuta entre A e B' : '';
      quiT.style.opacity = q.toFixed(2);
      /* rotulos dos gametas */
      var gam = [['AB', 'parental'], ['Ab', 'recombinante'], ['aB', 'recombinante'], ['ab', 'parental']];
      for (k = 0; k < 4; k++) {
        rotG[k][0].setAttribute('y', (yF[k] + 14).toFixed(1)); rotG[k][1].setAttribute('y', (yF[k] + 30).toFixed(1));
        rotG[k][0].textContent = gam[k][0]; rotG[k][1].textContent = gam[k][1];
        rotG[k][0].style.opacity = rotG[k][1].style.opacity = (sep * (1 - some)).toFixed(2);
        rotG[k][0].style.fill = k === 1 || k === 2 ? 'var(--ad-t)' : 'var(--tinta)';
      }
      /* ---- mapa + barras (fase 4) ---- */
      gMapa.style.opacity = gBar.style.opacity = some.toFixed(2);
      var d;
      if (t < 9.6) d = 3; else if (t < 11.2) d = lin(3, 8, ease((t - 9.6) / .5)); else d = lin(8, 16, ease((t - 11.2) / .5));
      if (t < 8) d = 3;
      var xb = 50 + 10 * d;
      mB1.setAttribute('x', xb); mB2.setAttribute('x', xb);
      regua.setAttribute('d', 'M50 70 V76 M50 72 H' + xb + ' M' + xb + ' 70 V76');
      reguaT.setAttribute('x', ((50 + xb) / 2).toFixed(1)); reguaT.setAttribute('x', Math.max(80, (50 + xb) / 2).toFixed(1));
      reguaT.textContent = fmt(d) + ' cM';
      var pp = (100 - d) / 2, rr = d / 2, vals = [pp, pp, rr, rr];
      for (k = 0; k < 4; k++) {
        var w = 3.6 * vals[k];
        barras[k][0].setAttribute('width', w.toFixed(1));
        barras[k][1].setAttribute('x', (px + 34 + w + 6).toFixed(1)); barras[k][1].textContent = fmt(vals[k]) + '%';
      }
      tBar.textContent = 'Gametas de AB/ab (em muitas meioses)';
      var exato = Math.abs(d - Math.round(d)) < .01;
      tRec.textContent = exato ? 'Recombinantes: ' + fmt(rr) + ' + ' + fmt(rr) + ' = ' + fmt(d) + '% → ' + fmt(d) + ' cM' : '';
      reguaT.textContent = exato ? fmt(d) + ' cM' : '';
      /* ---- texto do painel ---- */
      var nome, s;
      if (t < 2.6) { nome = 'Meiose I'; s = ['Os homólogos se pareiam.', 'Cada um já está duplicado:', 'duas cromátides-irmãs.', 'Genes A e B no mesmo', 'cromossomo: estão ligados.']; }
      else if (t < 5.4) { nome = 'Permuta'; s = ['Duas cromátides não irmãs', 'se quebram entre A e B', 'e trocam os pedaços.', 'Só essas duas mudam;', 'as outras duas, não.']; }
      else if (t < 8) { nome = 'Quatro gametas'; s = ['Desta meiose saem 2 gametas', 'parentais (AB, ab), iguais', 'aos cromossomos originais,', 'e 2 recombinantes (Ab, aB),', 'combinações novas.']; }
      else { nome = 'Distância'; s = ['1% de recombinantes = 1 cM', '(= 1 UR = 1 morganídeo).', 'Genes mais distantes:', 'mais permutas entre eles.', '']; }
      fase.textContent = nome;
      for (k = 0; k < 5; k++) L[k].textContent = s[k];
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var ESQ0 = esq.map(function (x) { return x.textContent; });
    var RESP = {"P9dc2eb5": {"s": [12, 12.99], "L": ["Resposta A: os parentais", "(42% cada) são Gm e gM:", "arranjo trans. Recombinantes:", "8 + 8 = 16% → 16 UR.", ""], "g": ["G", "m", "g", "M"], "n": ["Gm", "gM", "GM", "gm"], "tb": "Gametas de Gm/gM (trans)", "e": ["Arranjo trans (Gm/gM): cada", "cromossomo com um dominante.", "Se fosse cis (GM/gm):", "GM e gm seriam os parentais,", "Gm e gM os recombinantes."]}, "P5c11987": {"s": [10.4, 11.1], "L": ["Resposta E: pai AB/ab, 8 UR:", "Ab e aB = 4% cada; a mãe só", "manda AB. AABb e AaBB = 4%", "cada: os menos prováveis.", ""], "g": ["A", "B", "a", "b"], "n": ["AB", "ab", "Ab", "aB"], "tb": "Gametas do pai AB/ab (cis)", "e": ["Arranjo cis (AB/ab): os dois", "dominantes no mesmo cromossomo.", "Se fosse trans (Ab/aB):", "Ab e aB seriam os parentais,", "AB e ab os recombinantes."]}, "W75da917": {"s": [8.3, 9.5], "L": ["Resposta D: recombinantes", "Br + bR = 1,5% + 1,5% = 3%", "→ 3 morganídeos.", "", ""], "g": ["B", "R", "b", "r"], "n": ["BR", "br", "Br", "bR"], "tb": "Gametas de BR/br (cis)", "e": ["Arranjo cis (BR/br): os dois", "dominantes no mesmo cromossomo.", "Se fosse trans (Br/bR):", "Br e bR seriam os parentais,", "BR e br os recombinantes."]}}, R = RESP[qid];
    return function (t) {
      mA1.textContent = 'A'; mB1.textContent = 'B'; mA2.textContent = 'a'; mB2.textContent = 'b';
      nomeT.forEach(function (n, k) { n.textContent = nomes[k]; });
      ESQ0.forEach(function (x, k) { esq[k].textContent = x; });
      if (t < 13 || !R) { desenha0(Math.min(t, 13 - .01)); return; }
      desenha0(R.s[0] + ((t - 13) % (R.s[1] - R.s[0])));
      fase.textContent = 'Resposta';
      for (var k = 0; k < 5; k++) L[k].textContent = R.L[k];
      mA1.textContent = R.g[0]; mB1.textContent = R.g[1]; mA2.textContent = R.g[2]; mB2.textContent = R.g[3];
      nomeT.forEach(function (n, k) { n.textContent = R.n[k]; });
      tBar.textContent = R.tb;
      R.e.forEach(function (x, k) { esq[k].textContent = x; });
    };
  }
};
VIS.liga('permuta-distancia-genica', ['P9dc2eb5', 'P5c11987', 'W75da917']);
