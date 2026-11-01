/* Mutações: inserção (frameshift), substituição, base alterada (hipoxantina) e translocação, uma por vez */
VIS.def['mutacoes-genicas-cromossomicas'] = {
  tit: 'Quatro tipos de mutação e o que cada um faz',
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Inserção'], [3.5, 'Substituição'], [7, 'Base alterada'], [10.5, 'Translocação']],
  fontes: ['OpenStax Biology 2e, 14.6 DNA Repair (mutações) — https://openstax.org/books/biology-2e/pages/14-6-dna-repair', 'OpenStax Biology 2e, 13.2 Chromosomal Basis of Inherited Disorders (translocação) — https://openstax.org/books/biology-2e/pages/13-2-chromosomal-basis-of-inherited-disorders'],
  cred: 'Animação feita para o app. Códons da β-globina humana (posições 5 a 7) na anemia falciforme; demais sequências ilustrativas.',
  nota: 'Inserir um par de bases no DNA acrescenta uma base no RNAm: a leitura de 3 em 3 se desloca e todos os aminoácidos daquele ponto em diante podem mudar (às vezes surge um códon de parada antes do tempo). Na substituição, só um códon muda.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function quebra(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PQ = {"Pcb53e1e": "O par extra desloca o quadro de leitura: a proteína sai com sequência de aminoácidos diferente. Alternativa B.", "P468912c": "A hipoxantina parece guanina e pareia com C: o par passa a ser H–C em vez de A–T. Alternativa D.", "Wfb0dbd8": "Anemia falciforme: alteração em um códon do gene da hemoglobina. Alternativa A.", "Wa746886": "Troca mútua de pedaços entre cromossomos não homólogos: translocação. Alternativa C."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)', MONO = 'font-family:ui-monospace,Menlo,Consolas,monospace;', ERRO = '#b4442f', MID = 'text-anchor:middle;';
    var CEN = [0, 1, 2, 3].map(function () { return el('g', {}); });
    /* caixa de codon com 3 letras e aminoacido */
    function codon(pai, x, y) {
      var g = el('g', {}, pai);
      var r = el('rect', { x: x, y: y, width: 54, height: 28, rx: 6, style: 'stroke-width:1.3' }, g);
      var l = [0, 1, 2].map(function (j) { return tx(x + 11 + j * 16, y + 20, '', 'font-size:16px;font-weight:700;' + MID + MONO, g); });
      var a = tx(x + 27, y + 48, '', 'font-size:14px;' + MID, g);
      return function (s, aa, mud, dest) {
        r.style.fill = mud ? 'color-mix(in srgb,' + ERRO + ' 14%,transparent)' : 'color-mix(in srgb,var(--tinta) 6%,transparent)';
        r.style.stroke = mud ? ERRO : 'var(--linha)';
        l.forEach(function (e, j) { e.textContent = s[j] || ''; e.style.fill = dest === j ? ERRO : 'var(--tinta)'; });
        a.textContent = aa; a.style.fill = mud ? ERRO : 'var(--tinta)'; a.style.fontWeight = mud ? 700 : 500;
      };
    }

    /* ===== 1. insercao ===== */
    var g1 = CEN[0];
    tx(16, 40, 'RNAm normal', 'font-size:14px;' + LAP, g1);
    var N1 = [0, 1, 2, 3, 4].map(function (i) { return codon(g1, 16 + i * 74, 50); });
    [['AUG', 'Met'], ['GCA', 'Ala'], ['UUC', 'Phe'], ['GGA', 'Gly'], ['CUU', 'Leu']].forEach(function (c, i) { N1[i](c[0], c[1], 0); });
    tx(16, 160, 'mutante', 'font-size:14px;' + LAP, g1);
    var M1 = [0, 1, 2, 3, 4].map(function (i) { return codon(g1, 16 + i * 74, 170); });
    var gIns = tx(0, 0, 'G', 'font-size:18px;font-weight:700;' + MID + MONO + 'fill:' + ERRO, g1);
    var r1 = tx(16, 270, '', 'font-size:15px;font-weight:700;fill:' + ERRO, g1);
    /* ===== 2. substituicao ===== */
    var g2 = CEN[1];
    tx(16, 40, 'DNA (fita codificadora)', 'font-size:14px;' + LAP, g2);
    var D2 = [0, 1, 2].map(function (i) { return codon(g2, 16 + i * 74, 50); });
    tx(16, 140, 'RNAm', 'font-size:14px;' + LAP, g2);
    var R2 = [0, 1, 2].map(function (i) { return codon(g2, 16 + i * 74, 150); });
    tx(16, 260, 'β-globina, códons 5 a 7', 'font-size:13px;' + LAP, g2);
    var disco = el('g', {}, g2); el('ellipse', { cx: 330, cy: 226, rx: 40, ry: 34, style: 'fill:#c9463d;stroke:#8f2a24;stroke-width:1.5' }, disco); el('ellipse', { cx: 330, cy: 226, rx: 18, ry: 15, style: 'fill:#e07a70' }, disco);
    var hem = el('path', { d: 'M286 244 Q330 170 374 244 Q330 206 286 244 Z', style: 'fill:#c9463d;stroke:#8f2a24;stroke-width:1.5' }, g2);
    var hemT = tx(330, 290, '', 'font-size:14px;font-weight:600;' + MID + TINTA, g2);
    /* ===== 3. base alterada ===== */
    var g3 = CEN[2];
    function par(x, y, a, b, nl, ca, cb, pai) {
      var g = el('g', {}, pai);
      el('rect', { x: x, y: y, width: 34, height: 30, rx: 6, style: 'fill:' + ca }, g); tx(x + 17, y + 21, a, 'font-size:17px;font-weight:700;' + MID + 'fill:#fff', g);
      for (var i = 0; i < nl; i++) { var yy = y + 15 + (i - (nl - 1) / 2) * 7; el('line', { x1: x + 37, x2: x + 51, y1: yy, y2: yy, style: 'stroke:var(--lapis);stroke-width:1.6;stroke-dasharray:3 2' }, g); }
      el('rect', { x: x + 54, y: y, width: 26, height: 30, rx: 6, style: 'fill:' + cb }, g); tx(x + 67, y + 21, b, 'font-size:17px;font-weight:700;' + MID + 'fill:#fff', g);
      return g;
    }
    var P3 = [par(20, 60, 'A', 'T', 2, '#3f7f4f', '#b4442f', g3), par(220, 60, 'H', 'T', 2, '#7a5c85', '#b4442f', g3), par(220, 190, 'H', 'C', 2, '#7a5c85', '#9a6a12', g3), par(20, 190, 'G', 'C', 3, '#2f62a3', '#9a6a12', g3)];
    var S3 = [];
    [[110, 75, 210, 75, 'HNO₂: A vira H', 160, 65, 'middle'], [260, 98, 260, 184, '1ª replicação:', 272, 136, 'start', 'H chama C'], [212, 205, 110, 205, '2ª replicação:', 160, 195, 'middle', 'C chama G']].forEach(function (s) {
      var g = el('g', {}, g3);
      el('path', { d: 'M' + s[0] + ' ' + s[1] + ' L' + s[2] + ' ' + s[3], style: 'fill:none;stroke:var(--lapis);stroke-width:1.8;stroke-dasharray:5 4' }, g);
      var a = Math.atan2(s[3] - s[1], s[2] - s[0]), c = Math.cos(a), sn = Math.sin(a);
      el('path', { d: 'M' + (s[2] - 9 * c + 5 * sn).toFixed(1) + ' ' + (s[3] - 9 * sn - 5 * c).toFixed(1) + ' L' + s[2] + ' ' + s[3] + ' L' + (s[2] - 9 * c - 5 * sn).toFixed(1) + ' ' + (s[3] - 9 * sn + 5 * c).toFixed(1), style: 'fill:none;stroke:var(--lapis);stroke-width:1.8' }, g);
      tx(s[5], s[6], s[4], 'font-size:13.5px;text-anchor:' + s[7] + ';' + LAP, g); if (s[8]) tx(s[7] === 'start' ? s[5] : s[5], s[7] === 'start' ? s[6] + 18 : s[6] + 38, s[8], 'font-size:13.5px;text-anchor:' + s[7] + ';' + LAP, g);
      S3.push(g);
    });
    tx(60, 120, 'original', 'font-size:13px;' + MID + LAP, P3[0]); tx(310, 80, 'H parece G', 'font-size:13px;' + LAP, P3[1]);
    tx(60, 250, 'par trocado', 'font-size:13.5px;font-weight:700;' + MID + 'fill:' + ERRO, P3[3]);
    /* ===== 4. translocacao ===== */
    var g4 = CEN[3], AZ = '#3d6fb6', LJ = '#d9a441';
    tx(86, 40, 'cromossomo 1', 'font-size:13px;' + MID + LAP, g4); tx(176, 40, 'cromossomo 2', 'font-size:13px;' + MID + LAP, g4);
    tx(131, 236, 'NÃO homólogos', 'font-size:14px;font-weight:700;' + MID + TINTA, g4);
    var c1a = el('rect', { x: 78, y: 54, width: 16, height: 120, rx: 8, style: 'fill:' + AZ }, g4);
    var c2a = el('rect', { x: 168, y: 70, width: 16, height: 80, rx: 8, style: 'fill:' + LJ }, g4);
    var p1 = el('rect', { width: 16, height: 56, rx: 8, style: 'fill:' + AZ }, g4);   /* ponta do 1 */
    var p2 = el('rect', { width: 16, height: 44, rx: 8, style: 'fill:' + LJ }, g4);   /* ponta do 2 */
    var cruz = tx(270, 150, '', 'font-size:14px;' + LAP, g4);

    /* ===== painel ===== */
    var PX = 410;
    var pNome = tx(PX, 36, '', 'font-size:18px;font-weight:700;' + TINTA);
    var pL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (k) { return tx(PX, 64 + k * 20, '', 'font-size:14.5px;' + TINTA); });
    var ETAPAS = [
      [0, '1. Inserção de 1 base', 'O ribossomo lê o RNAm de 3 em 3 bases, sem pausa. Uma base a mais (um par a mais no DNA) desloca o quadro de leitura: todas as trincas seguintes mudam, e a proteína sai com outra sequência.'],
      [3.5, '2. Substituição', 'Na anemia falciforme, uma base do códon 6 da β-globina troca: GAG vira GTG no DNA e GUG no RNAm. Só UM aminoácido muda (Glu → Val), e a hemácia pode ficar em forma de foice.'],
      [7, '3. Base alterada', 'O ácido nitroso (dos nitritos) transforma a adenina em hipoxantina (H), de forma parecida com a da guanina. Na 1ª replicação, H pareia com C; na 2ª, o C chama G: o par A–T virou G–C.'],
      [10.5, '4. Translocação', 'Dois cromossomos NÃO homólogos trocam pedaços entre si: é uma alteração estrutural. O crossing-over também troca pedaços, mas entre homólogos, e não é aberração.'],
      [13.4, 'Por isso a resposta é', PQ[qid] || 'Inserção: aminoácidos diferentes. Anemia falciforme: alteração em um códon. Hipoxantina: parecida com a guanina, pareia com C. Troca entre não homólogos: translocação.']
    ].map(function (e) { return [e[0], e[1], quebra(e[2], 30)]; });

    return function (t) {
      var cena = t < 3.5 ? 0 : t < 7 ? 1 : t < 10.5 ? 2 : 3;
      CEN.forEach(function (g, i) { var on = i === cena; g.style.display = on ? '' : 'none'; });
      /* 1 */
      var ins = seg(t, .6, 1.2), re = cl((t - 1.3) / 1.4);
      var NOR = [['AUG', 'Met'], ['GCA', 'Ala'], ['UUC', 'Phe'], ['GGA', 'Gly'], ['CUU', 'Leu']], MUT = [['AUG', 'Met'], ['GGC', 'Gly'], ['AUU', 'Ile'], ['CGG', 'Arg'], ['ACU', 'Thr']];
      M1.forEach(function (f, i) { var m = i > 0 && re * 4 >= i; f(m ? MUT[i][0] : NOR[i][0], m ? MUT[i][1] : NOR[i][1], m ? 1 : 0, m && i === 1 ? 0 : -1); });
      gIns.setAttribute('x', 16 + 64); gIns.setAttribute('y', lerp(140, 190, ins)); gIns.style.opacity = t > .4 && re * 4 < 1 ? 1 : 0;
      r1.textContent = re >= 1 ? 'Daí em diante, todas as trincas mudam.' : '';
      /* 2 */
      var tr = seg(t, 4.4, 5.0);
      [['CCT', 'Pro'], [tr > .5 ? 'GTG' : 'GAG', tr > .5 ? 'Val' : 'Glu'], ['GAG', 'Glu']].forEach(function (c, i) { D2[i](c[0], '', i === 1 && tr > .5, i === 1 && tr > .5 ? 1 : -1); });
      [['CCU', 'Pro'], [tr > .5 ? 'GUG' : 'GAG', tr > .5 ? 'Val' : 'Glu'], ['GAG', 'Glu']].forEach(function (c, i) { R2[i](c[0], c[1], i === 1 && tr > .5, i === 1 && tr > .5 ? 1 : -1); });
      var fo = seg(t, 5.2, 6.2), cx = 330, cy = 230;
      /* disco bicôncavo (vista de frente) -> foice */
      var d = 'M' + (cx - 40) + ' ' + (cy + lerp(0, 10, fo)) + ' Q' + cx + ' ' + (cy - lerp(36, 46, fo)) + ' ' + (cx + 40) + ' ' + (cy + lerp(0, 10, fo)) + ' Q' + cx + ' ' + (cy + lerp(36, -6, fo)) + ' ' + (cx - 40) + ' ' + (cy + lerp(0, 10, fo)) + 'Z';
      disco.style.opacity = 1 - fo; hem.style.opacity = fo; hemT.textContent = fo > .5 ? 'hemácia em foice' : 'hemácia normal';
      /* 3 */
      [7.2, 7.8, 8.6, 9.4].forEach(function (s, i) { P3[i].style.opacity = seg(t, s, s + .4); });
      [7.6, 8.3, 9.1].forEach(function (s, i) { S3[i].style.opacity = seg(t, s, s + .3); });
      /* 4: as pontas se soltam e trocam de lugar */
      var u = seg(t, 11.3, 12.6), lev = Math.sin(Math.PI * u) * 26;
      var x1 = lerp(78, 168, u), x2 = lerp(168, 78, u);
      p1.setAttribute('x', x1.toFixed(1)); p1.setAttribute('y', (lerp(156, 142, u) - lev).toFixed(1));
      p2.setAttribute('x', x2.toFixed(1)); p2.setAttribute('y', (lerp(142, 156, u) - lev).toFixed(1));
      c1a.setAttribute('height', 110); c2a.setAttribute('height', 80);
      cruz.textContent = '';
      var E = ETAPAS[0]; ETAPAS.forEach(function (x) { if (t >= x[0]) E = x; });
      pNome.textContent = E[1]; pL.forEach(function (e, k) { e.textContent = E[2][k] || ''; });
    };
  }
};
VIS.liga('mutacoes-genicas-cromossomicas', ['Pcb53e1e', 'P468912c', 'Wfb0dbd8', 'Wa746886']);
