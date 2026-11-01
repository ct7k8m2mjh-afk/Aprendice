/* Diferenciação: mesmo genoma, genes diferentes ligados; fator de transcrição e RNA-polimerase */
VIS.def['expressao-genica-diferencial'] = {
  tit: 'Mesmos genes em todas as células; o que muda é quais estão ligados',
  tipo: 'anim', dur: 13.4,
  marcas: [[0, 'Mesmo genoma'], [2.8, 'Genes ligados'], [6.2, 'Como um gene liga'], [11, 'Resposta']],
  fontes: ['OpenStax Biology 2e, 16.1 Regulation of Gene Expression — https://openstax.org/books/biology-2e/pages/16-1-regulation-of-gene-expression', 'OpenStax Biology 2e, 16.4 Eukaryotic Transcription Gene Regulation — https://openstax.org/books/biology-2e/pages/16-4-eukaryotic-transcription-gene-regulation'],
  cred: 'Animação feita para o app (esquema fora de escala; só 4 genes representados).',
  nota: 'As células especializadas vêm de mitoses e têm os mesmos genes da célula-tronco. O que as diferencia é a expressão gênica: cada tipo usa um conjunto de genes, e por isso fabrica RNAs e proteínas diferentes.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 446');
    var PQ = {"Pb9e81f8": "Células vindas da mesma célula-tronco têm os mesmos genes; muda só quais estão ligados. Alternativa A.", "Pbd4716c": "A diferenciação acontece porque genes diferentes são ativados e inativados em cada tipo de célula: alternativa B.", "P5e6ece7": "Sem os fatores de transcrição, a RNA-polimerase não inicia a transcrição: menos RNA. Alternativa E."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var GENES = [['globina', '#c0504d'], ['miosina', '#b5746a'], ['sinapsina', '#7a5c9e'], ['hexocinase', '#4f8f5c']];
    var FAT = '#e0a526';

    /* ===== cena 1 ===== */
    var g1 = el('g', {});
    el('ellipse', { cx: 320, cy: 66, rx: 178, ry: 52, style: 'fill:#fbeee6;stroke:#b98a7c;stroke-width:2' }, g1);
    tx(320, 34, 'célula-tronco: o genoma completo', 'font-size:14px;font-weight:700;text-anchor:middle;' + TINTA, g1);
    GENES.forEach(function (g, i) {
      var x = 166 + i * 80;
      el('rect', { x: x - 2, y: 50, width: 74, height: 30, rx: 6, style: 'fill:color-mix(in srgb,' + g[1] + ' 16%,#fff);stroke:' + g[1] + ';stroke-width:1.5' }, g1);
      tx(x + 35, 70, g[0], 'font-size:13px;font-weight:700;text-anchor:middle;fill:' + g[1], g1);
    });
    var FIL = [[112, 'neurônio', [2, 3]], [320, 'precursor da hemácia', [0, 3]], [528, 'célula muscular', [1, 3]]];
    var gF = el('g', {}, g1), cels = [];
    FIL.forEach(function (f, c) {
      var g = el('g', {}, gF);
      el('path', { d: 'M' + (320 + (f[0] - 320) * .3) + ' 120 L' + f[0] + ' 178', style: 'fill:none;stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:4 4' }, g);
      el('ellipse', { cx: f[0], cy: 228, rx: 94, ry: 46, style: 'fill:#fbeee6;stroke:#b98a7c;stroke-width:2' }, g);
      tx(f[0], 296, f[1], 'font-size:14px;font-weight:700;text-anchor:middle;' + TINTA, g);
      var liga = tx(f[0], 316, '', 'font-size:13.5px;text-anchor:middle;' + TINTA, g);
      var bx = GENES.map(function (ge, i) {
        var x = f[0] - 76 + i * 38;
        var r = el('rect', { x: x, y: 218, width: 34, height: 20, rx: 4, style: 'stroke:' + ge[1] + ';stroke-width:1.5' }, g);
        var fa = el('path', { d: 'M' + (x - 2) + ' 216 l8 -10 h8 l4 10 Z', style: 'fill:' + FAT }, g);
        var m = [0, 1].map(function (k) { return el('path', { d: 'M' + (x + 10 + k * 12) + ' 212 q4 -5 0 -10 t0 -10', style: 'fill:none;stroke:' + ge[1] + ';stroke-width:2;stroke-linecap:round' }, g); });
        return [r, fa, m];
      });
      cels.push([g, bx, liga]);
    });
    var t1 = tx(320, 342, '', 'font-size:14px;text-anchor:middle;' + LAP, g1);

    /* ===== cena 2 ===== */
    var g2 = el('g', {});
    tx(8, 24, 'Como um gene é ligado', 'font-size:18px;font-weight:700;' + TINTA, g2);
    function fileira(y, titulo) {
      tx(8, y - 44, titulo, 'font-size:14px;font-weight:700;' + TINTA, g2);
      el('line', { x1: 40, x2: 610, y1: y - 3, y2: y - 3, style: 'stroke:#8a8f99;stroke-width:3' }, g2);
      el('line', { x1: 40, x2: 610, y1: y + 3, y2: y + 3, style: 'stroke:#8a8f99;stroke-width:3' }, g2);
      el('rect', { x: 80, y: y - 9, width: 90, height: 18, rx: 4, style: 'fill:color-mix(in srgb,var(--ad-c) 30%,#fff);stroke:var(--ad-c)' }, g2);
      tx(125, y + 26, 'promotor', 'font-size:13px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', g2);
      el('rect', { x: 180, y: y - 9, width: 400, height: 18, rx: 4, style: 'fill:color-mix(in srgb,#7a5c9e 18%,#fff);stroke:#7a5c9e' }, g2);
      tx(578, y + 26, 'gene', 'font-size:13px;font-weight:700;text-anchor:end;fill:#7a5c9e', g2);
    }
    fileira(110, 'Com o fator de transcrição');
    fileira(262, 'Sem o fator de transcrição');
    var fat = el('path', { style: 'fill:' + FAT + ';stroke:#a87a12;stroke-width:1.2' }, g2);
    var fatT = tx(0, 0, 'fator de transcrição', 'font-size:13px;font-weight:700;fill:#8a6410', g2);
    var pol1 = el('ellipse', { rx: 36, ry: 22, style: 'fill:#d9b36c;opacity:.8;stroke:#a7812f;stroke-width:1.5' }, g2);
    var pol2 = el('ellipse', { rx: 36, ry: 22, style: 'fill:#d9b36c;opacity:.8;stroke:#a7812f;stroke-width:1.5' }, g2);
    var polT = tx(0, 0, 'RNA-polimerase', 'font-size:13px;font-weight:700;text-anchor:middle;fill:#86651f', g2);
    var rna = el('path', { style: 'fill:none;stroke:#b4442f;stroke-width:3;stroke-linecap:round' }, g2);
    var rnaT = tx(0, 0, 'RNAm', 'font-size:13px;font-weight:700;fill:#b4442f', g2);
    var r1 = tx(8, 182, '', 'font-size:14px;' + TINTA, g2), r2 = tx(8, 334, '', 'font-size:14px;' + TINTA, g2);

    function quebraF(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    var FIMG = document.createElementNS('http://www.w3.org/2000/svg', 'g'), CARD = { x: 8, y: 354, w: 624, n: 82 };
    function cartao(c) {   /* cartao do tamanho do texto */
      while (FIMG.firstChild) FIMG.removeChild(FIMG.firstChild);
      var L = quebraF(PQ[qid] || '', c.n), h = 46 + L.length * 21;
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); [['x', c.x], ['y', c.y], ['width', c.w], ['height', h], ['rx', 12]].forEach(function (a) { r.setAttribute(a[0], a[1]); }); r.setAttribute('style', 'fill:var(--folha,#fff);stroke:var(--ad-c);stroke-width:1.5'); FIMG.appendChild(r);
      [['Por isso a resposta é', 'font-size:16px;font-weight:700;fill:var(--ad-t)']].concat(L.map(function (s) { return [s, 'font-size:15px;fill:var(--tinta)']; })).forEach(function (l, k) { var e = document.createElementNS('http://www.w3.org/2000/svg', 'text'); e.setAttribute('x', c.x + 14); e.setAttribute('y', c.y + 24 + k * 21 + (k ? 4 : 0)); e.setAttribute('style', l[1]); e.textContent = l[0]; FIMG.appendChild(e); });
    }
    var FRZ = { Pb9e81f8: 5.8, Pbd4716c: 5.8 }[qid] || 10.6;
    cartao(CARD);
    svg.appendChild(FIMG);
    return function (t0) {
      var fim = PQ[qid] && t0 >= 11, t = fim ? FRZ : Math.min(t0, 10.999); FIMG.style.display = fim ? '' : 'none';
      var c1 = 1 - seg(t, 6.0, 6.4), c2 = seg(t, 6.2, 6.6);
      g1.style.opacity = c1; g2.style.opacity = c2; g2.style.display = c2 > 0 ? '' : 'none'; g1.style.display = c1 > 0 ? '' : 'none';
      /* cena 1 */
      gF.style.opacity = seg(t, 1.0, 1.8);
      var lig = seg(t, 3.4, 3.9), chega = seg(t, 2.8, 3.4);
      cels.forEach(function (c, ci) {
        var on = FIL[ci][2];
        c[1].forEach(function (b, i) {
          var ativo = on.indexOf(i) >= 0, cor = GENES[i][1];
          b[0].style.fill = ativo ? 'color-mix(in srgb,' + cor + ' ' + Math.round(15 + 70 * lig) + '%,#fff)' : 'color-mix(in srgb,' + cor + ' 10%,#fff)';
          b[0].style.opacity = ativo ? 1 : lerp(1, .45, lig);
          b[1].style.opacity = ativo ? chega : 0;
          b[1].setAttribute('transform', 'translate(0 ' + (-24 * (1 - chega)).toFixed(1) + ')');
          b[2].forEach(function (m, k) { var f = ((t - 4 - k * .5) % 1.2 + 1.2) % 1.2; m.style.opacity = ativo && t > 4 ? Math.min(1, f * 3) * (1 - f / 1.2) : 0; m.setAttribute('transform', 'translate(0 ' + (-8 * f).toFixed(1) + ')'); });
        });
        c[2].textContent = t >= 3.4 ? 'ligados: ' + on.map(function (i) { return GENES[i][0]; }).join(' e ') : '';
      });
      t1.textContent = t < 1 ? 'A célula-tronco se divide por mitose...' : t < 2.8 ? 'cada célula-filha recebe uma cópia do MESMO genoma' : 'fatores de transcrição (amarelos) ligam genes diferentes em cada tipo';
      /* cena 2: fileira de cima */
      var f1 = seg(t, 6.6, 7.3), p1 = seg(t, 7.3, 8.0), anda = cl((t - 8.1) / 2.3);
      var fx = 112, fy = lerp(40, 92, f1);
      fat.setAttribute('d', 'M' + (fx - 20) + ' ' + (fy + 8) + ' l8 -16 h24 l8 16 Z');
      fatT.setAttribute('x', fx + 26); fatT.setAttribute('y', fy - 4); fatT.style.opacity = f1 > 0 ? 1 : 0;
      fatT.textContent = 'fator de transcrição';
      var px = t < 8.1 ? lerp(470, 222, p1) : lerp(222, 520, anda), py = 110;
      pol1.setAttribute('cx', px.toFixed(1)); pol1.setAttribute('cy', py.toFixed(1)); pol1.style.opacity = t < 7.3 ? 0 : Math.min(1, p1 * 3);
      polT.setAttribute('x', px.toFixed(1)); polT.setAttribute('y', (py - 28).toFixed(1)); polT.style.opacity = t < 7.3 ? 0 : Math.min(1, p1 * 3);
      if (t > 8.1) {
        var d = 'M190 130'; for (var x = 190; x <= px - 20; x += 10) d += ' L' + x + ' ' + (130 + 4 * Math.sin((x - 190) / 8)).toFixed(1);
        rna.setAttribute('d', d); rnaT.setAttribute('x', 190); rnaT.setAttribute('y', 152); rna.style.opacity = 1; rnaT.style.opacity = 1;
      } else { rna.style.opacity = 0; rnaT.style.opacity = 0; }
      r1.textContent = t < 7.3 ? 'O fator de transcrição se liga ao promotor...' : t < 8.1 ? '...e permite que a RNA-polimerase se encaixe.' : 'A RNA-polimerase transcreve o gene: muito RNAm.';
      /* fileira de baixo: polimerase passa sem se fixar */
      var w = cl((t - 7.3) / 3.4), qx = 360 + 90 * Math.sin(w * Math.PI * 2), qy = 214 + 6 * Math.sin(w * Math.PI * 4);
      pol2.setAttribute('cx', qx.toFixed(1)); pol2.setAttribute('cy', qy.toFixed(1)); pol2.style.opacity = t < 7.3 ? 0 : .8;
      r2.textContent = t < 7.3 ? '' : 'Sem o fator, a RNA-polimerase não se fixa: pouco ou nenhum RNA.';
    };
  }
};
VIS.liga('expressao-genica-diferencial', ['Pb9e81f8', 'Pbd4716c', 'P5e6ece7']);
