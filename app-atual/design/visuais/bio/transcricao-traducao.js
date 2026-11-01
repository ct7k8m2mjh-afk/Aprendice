/* Do gene à proteína: transcrição (uma fita-molde), splicing e tradução (códon x anticódon) */
VIS.def['transcricao-traducao'] = {
  tit: 'Do gene à proteína: transcrição, splicing e tradução',
  tipo: 'anim', dur: 14.4,
  marcas: [[0, 'Transcrição'], [4.2, 'Splicing'], [6.6, 'Tradução'], [12, 'Resposta']],
  fontes: ['OpenStax Biology 2e, 15.3 Eukaryotic Transcription — https://openstax.org/books/biology-2e/pages/15-3-eukaryotic-transcription', 'OpenStax Biology 2e, 15.4 RNA Processing in Eukaryotes — https://openstax.org/books/biology-2e/pages/15-4-rna-processing-in-eukaryotes', 'OpenStax Biology 2e, 15.5 Ribosomes and Protein Synthesis — https://openstax.org/books/biology-2e/pages/15-5-ribosomes-and-protein-synthesis'],
  cred: 'Animação feita para o app (esquema fora de escala; gene curto inventado, com um íntron).',
  nota: 'Molde e anticódon, ambos escritos de 3\' para 5\', têm a mesma sequência, só que o DNA usa T onde o RNA usa U. O RNAm é complementar ao molde, nunca idêntico ao DNA, e é copiado de uma fita só. Num gene real o RNAm maduro costuma ser menor que o trecho de DNA: o promotor não é copiado, os íntrons saem e sobram trechos antes do AUG e depois do códon de parada (UAA, UAG ou UGA), que não traz aminoácido. As questões costumam simplificar e tratar todas as bases como copiadas e codificantes.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var e = el('text', { x: x, y: y, style: st || '' }, pai); e.textContent = s; return e; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function seg(t, a, b) { return ease((t - a) / (b - a)); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var PQ = {"P012b0e5": "O molde 3' AGACATATA 5' é transcrito em RNAm 5' UCUGUAUAU 3': alternativa C.", "Wf0d5552": "Transcrição é a formação de um RNA a partir do DNA: alternativa D.", "W7bc30f5": "A RNA-polimerase reconhece a região promotora: alternativa B.", "W591e248": "O DNA (uma de suas fitas) serve de molde para o RNA: alternativa C.", "Wcb67efb": "Só uma fita é copiada: na simplificação da questão, 320 ÷ 2 = 160 nucleotídeos. Alternativa A.", "Wb1871c4": "A incorreta é a E: o RNAm não é idêntico ao DNA; é complementar ao molde e usa U no lugar de T.", "P4f909ea": "Gene maior que o RNAm maduro (os íntrons saem), leitura no ribossomo e, na conta da questão, 369 ÷ 3 = 123 aminoácidos: alternativa B.", "W255a397": "O códon de iniciação é AUG (metionina): alternativa D.", "Wb017961": "Anticódon CUG → códon GAC → molde CTG: alternativa E.", "W2e3cdce": "Anticódons AAG, AAC, AUG, GGA, GCG → códons UUC, UUG, UAC, CCU, CGC: alternativa A."};
    var TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)', LET = 'font-size:14px;font-weight:700;text-anchor:middle;font-family:ui-monospace,Menlo,Consolas,monospace;';
    var COR = { A: '#3f7f4f', U: '#b4442f', T: '#b4442f', G: '#2f62a3', C: '#9a6a12' };
    var PRE = 'CACAUGUUCGUAUCCAGGGCUGGUAAGC', PROM = 'TATAAA';
    var COD = PRE.replace(/U/g, 'T'), CMP = { A: 'T', T: 'A', G: 'C', C: 'G' };
    var X0 = 150, DX = 14, YC = 70, YM = 96, YR = 135;
    function xg(i) { return X0 + (PROM.length + i) * DX; }   /* i = posicao no gene */

    /* ===== cena 1-2: DNA, polimerase ===== */
    var g1 = el('g', {});
    el('rect', { x: X0 - 9, y: YC - 22, width: PROM.length * DX + 4, height: 56, rx: 6, style: 'fill:var(--ad-c);opacity:.14' }, g1);
    tx(X0 - 6, YC - 28, 'promotor', 'font-size:13px;font-weight:700;fill:var(--ad-t)', g1);
    tx(X0 - 22, YC + 5, 'fita codificadora', 'font-size:13px;text-anchor:end;' + LAP, g1);
    tx(X0 - 22, YM + 5, 'fita-molde', 'font-size:13px;font-weight:700;text-anchor:end;fill:var(--ad-t)', g1);
    var e5 = tx(X0 - 12, YC + 5, "5'", 'font-size:13px;text-anchor:middle;' + LAP, g1), e3 = tx(X0 - 12, YM + 5, "3'", 'font-size:13px;text-anchor:middle;' + LAP, g1);
    tx(xg(PRE.length) + 2, YC + 5, "3'", 'font-size:13px;' + LAP, g1); tx(xg(PRE.length) + 2, YM + 5, "5'", 'font-size:13px;' + LAP, g1);
    var pol = el('ellipse', { rx: 34, ry: 36, style: 'fill:#d9b36c;opacity:.42;stroke:#a7812f;stroke-width:1.5' }, g1);
    var polT = tx(0, 22, 'RNA-polimerase', 'font-size:13px;font-weight:700;text-anchor:middle;fill:#86651f', g1);
    var ladoC = [], ladoM = [];
    var SEQC = PROM + COD;
    for (var i = 0; i < SEQC.length; i++) {
      ladoC.push(tx(X0 + i * DX, YC, SEQC[i], LET + 'fill:var(--lapis)', g1));
      ladoM.push(tx(X0 + i * DX, YM, CMP[SEQC[i]], LET + 'fill:' + COR[CMP[SEQC[i]]], g1));
    }
    var tRNA5 = tx(0, YR + 4, "5'", 'font-size:13px;text-anchor:middle;' + LAP);
    var rRNA = tx(X0 - 22, YR + 5, 'RNA', 'font-size:13px;font-weight:700;text-anchor:end;' + TINTA);
    /* textos das cenas 1-2 */
    var g12t = el('g', {});
    var sT = tx(8, 214, '', 'font-size:18px;font-weight:700;' + TINTA, g12t);
    var sL = [0, 1, 2].map(function (k) { return tx(8, 242 + k * 21, '', 'font-size:14.5px;' + TINTA, g12t); });
    var CENA = [
      [0, '1. Transcrição (no núcleo)', ['A RNA-polimerase se liga ao promotor e lê só a fita-molde.', "O RNA cresce de 5' para 3', complementar ao molde:", 'A do molde chama U, T chama A, C chama G, G chama C.']],
      [4.2, '2. Processamento (ainda no núcleo)', ['Os íntrons são cortados e os éxons se unem (splicing):', 'o RNAm maduro fica menor que o gene que o originou.', "Ele ganha capuz 5' e cauda poli-A e sai para o citoplasma."]]
    ];
    /* splicing: rotulos */
    var g2 = el('g', {});
    var rIn = tx((xg(9) + xg(16)) / 2, YR - 52, 'íntron', 'font-size:13px;font-weight:700;text-anchor:middle;' + LAP, g2);
    var rE1 = tx((xg(0) + xg(8)) / 2, YR - 24, 'éxon 1', 'font-size:13px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', g2);
    var rE2 = tx((xg(17) + xg(27)) / 2, YR - 24, 'éxon 2', 'font-size:13px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', g2);

    /* ===== cena 3: traducao ===== */
    var g3 = el('g', {});
    var YL = 250, XT = 150, DT = 18;
    function xm(m) { return XT + m * DT; }
    var sub = el('ellipse', { cy: 262, rx: 74, ry: 19, style: 'fill:#cfc2de;stroke:#8f7aa8;stroke-width:1.5' }, g3);
    var gran = el('ellipse', { cy: 176, rx: 84, ry: 64, style: 'fill:#cfc2de;opacity:.38;stroke:#8f7aa8;stroke-width:1.5' }, g3);
    var sitios = ['E', 'P', 'A'].map(function (s) { return tx(0, 278, s, 'font-size:13px;font-weight:700;text-anchor:middle;fill:#5f4a7a', g3); });
    var rRib = tx(0, 100, 'ribossomo', 'font-size:13px;font-weight:700;text-anchor:middle;fill:#5f4a7a', g3);
    var AA = [['Met', 'AUG', 'UAC', 'TAC'], ['Phe', 'UUC', 'AAG', 'AAG'], ['Gly', 'GGC', 'CCG', 'CCG'], ['Trp', 'UGG', 'ACC', 'ACC']];
    var COR_AA = ['#c77b74', '#7fb08a', '#d9a441', '#8fa7cf'];
    var tr = AA.map(function (a, k) {
      var g = el('g', {}, g3);
      el('path', { d: 'M-17 128 h34 v58 q0 10 -10 14 h-14 q-10 -4 -10 -14 Z', style: 'fill:#efe2c4;stroke:#b99a5a;stroke-width:1.5' }, g);
      for (var j = 0; j < 3; j++) tx((j - 1) * DT, 226, a[2][j], LET + 'fill:' + COR[a[2][j]], g);
      tx(0, 166, 'RNAt', 'font-size:13px;text-anchor:middle;fill:#86651f', g);
      return g;
    });
    var ligas = el('path', { style: 'fill:none;stroke:var(--tinta);stroke-width:3' }, g3);
    var aaG = AA.map(function (a, k) {
      var g = el('g', {}, g3);
      el('circle', { r: 16, style: 'fill:' + COR_AA[k] + ';stroke:#fff;stroke-width:1.5' }, g);
      tx(0, 5, a[0], 'font-size:13px;font-weight:700;text-anchor:middle;fill:#fff', g);
      return g;
    });
    var agua = tx(0, 0, 'H₂O', 'font-size:14px;font-weight:700;fill:#2f62a3', g3);
    var evL = [0, 1, 2, 3].map(function (k) { return tx(8, 120 + k * 20, '', 'font-size:14px;' + (k ? '' : 'font-weight:700;') + TINTA, g3); });
    tx(8, 24, '3. Tradução (no citoplasma)', 'font-size:18px;font-weight:700;' + TINTA, g3);
    /* painel de conversao */
    var CV = [[78, 'fita-molde (DNA)'], [238, 'códon (RNAm)'], [398, 'anticódon (RNAt)'], [552, 'aminoácido']];
    var cvV = CV.map(function (c, i) {
      tx(c[0], 306, c[1], 'font-size:13px;text-anchor:middle;' + LAP, g3);
      if (i) tx(c[0] - 80, 330, '→', 'font-size:16px;text-anchor:middle;' + LAP, g3);
      return tx(c[0], 331, '', 'font-size:16px;font-weight:700;text-anchor:middle;' + TINTA, g3);
    });
    el('line', { x1: 8, x2: 632, y1: 290, y2: 290, style: 'stroke:var(--linha);stroke-width:1' }, g3);

    /* ===== RNA (atravessa as tres cenas) ===== */
    var cap = el('circle', { r: 6, style: 'fill:#7a5c85' });
    var capT = tx(0, 0, 'capuz', 'font-size:13px;text-anchor:middle;fill:#7a5c85');
    var cauda = tx(0, 0, 'AAAAA', LET + 'fill:#7a5c85;text-anchor:start'), caudaT = tx(0, 0, 'cauda poli-A', 'font-size:13px;fill:#7a5c85');
    var m5 = tx(0, 0, "5'", 'font-size:13px;text-anchor:end;' + LAP), m3 = tx(0, 0, "3'", 'font-size:13px;' + LAP);
    var rna = PRE.split('').map(function (b) { return tx(0, 0, b, LET + 'fill:' + COR[b]); });
    var codLin = el('path', { style: 'fill:none;stroke:var(--lapis);stroke-width:1.2' }, g3);

    function xr(i, t) {   /* posicao de cada base do RNA em cada cena */
      var m = i < 9 ? i : i - 8, int = i >= 9 && i <= 16;
      var x = xg(i), y = YR, op = 1;
      if (i >= 17) x -= 8 * DX * seg(t, 5.8, 6.4);
      if (int) { var u = seg(t, 5.0, 5.8); y -= 20 * u; op = 1 - u; }
      var v = seg(t, 6.6, 7.2);
      if (!int) { x = lerp(x, xm(m), v); y = lerp(y, YL, v); }
      return [x, y, op];
    }
    function quebraF(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    var FIMG = document.createElementNS('http://www.w3.org/2000/svg', 'g'), CARD = { x: 8, y: 198, w: 624, n: 82 };
    function cartao(c) {   /* cartao do tamanho do texto */
      while (FIMG.firstChild) FIMG.removeChild(FIMG.firstChild);
      var L = quebraF(PQ[qid] || '', c.n), h = 46 + L.length * 21;
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); [['x', c.x], ['y', c.y], ['width', c.w], ['height', h], ['rx', 12]].forEach(function (a) { r.setAttribute(a[0], a[1]); }); r.setAttribute('style', 'fill:var(--folha,#fff);stroke:var(--ad-c);stroke-width:1.5'); FIMG.appendChild(r);
      [['Por isso a resposta é', 'font-size:16px;font-weight:700;fill:var(--ad-t)']].concat(L.map(function (s) { return [s, 'font-size:15px;fill:var(--tinta)']; })).forEach(function (l, k) { var e = document.createElementNS('http://www.w3.org/2000/svg', 'text'); e.setAttribute('x', c.x + 14); e.setAttribute('y', c.y + 24 + k * 21 + (k ? 4 : 0)); e.setAttribute('style', l[1]); e.textContent = l[0]; FIMG.appendChild(e); });
    }
    var TRAD = { W255a397: 7.7, Wb017961: 8.25, W2e3cdce: 8.25 }, FRZ = TRAD[qid] || (qid === 'P4f909ea' ? 6.4 : 3.0);
    cartao(TRAD[qid] ? { x: 340, y: 8, w: 292, n: 36 } : CARD);
    svg.appendChild(FIMG);
    return function (t0) {
      var fim = PQ[qid] && t0 >= 12, t = fim ? FRZ : Math.min(t0, 11.999); FIMG.style.display = fim ? '' : 'none';
      var c12 = 1 - seg(t, 6.5, 6.9), c3 = seg(t, 6.8, 7.2);
      g1.style.opacity = t < 4.2 ? 1 : 1 - seg(t, 4.2, 4.6);
      g12t.style.opacity = fim ? 0 : c12; g3.style.opacity = c3; g3.style.display = c3 > 0 ? '' : 'none';
      g2.style.opacity = t < 4.4 ? 0 : t < 5.0 ? seg(t, 4.4, 4.7) : c12;
      rIn.style.opacity = 1 - seg(t, 5.0, 5.6);
      rE2.setAttribute('x', ((xg(17) + xg(27)) / 2 - 8 * DX * seg(t, 5.8, 6.4)).toFixed(1));
      /* polimerase */
      var p = t < 0.6 ? -2.5 : lerp(-2.5, PRE.length - .5, cl((t - 0.6) / 3.2));
      var xp = xg(p); pol.setAttribute('cx', xp.toFixed(1)); pol.setAttribute('cy', 102);
      pol.style.opacity = t < 0.5 ? seg(t, 0, 0.5) : 1; polT.setAttribute('x', xp.toFixed(1));
      for (var i = 0; i < SEQC.length; i++) {
        var xi = X0 + i * DX, b = Math.max(0, 1 - Math.abs(xi - xp) / 34) * (t > 0.5 && t < 3.9 ? 1 : 0);
        ladoC[i].setAttribute('y', (YC - 7 * b).toFixed(1)); ladoM[i].setAttribute('y', (YM + 7 * b).toFixed(1));
      }
      /* RNA */
      rna.forEach(function (e, i) {
        var q = xr(i, t), feito = t >= 4 || xg(i) <= xp - 2;
        e.setAttribute('x', q[0].toFixed(1)); e.setAttribute('y', q[1].toFixed(1));
        e.style.opacity = feito ? q[2] : 0;
        var intr = i >= 9 && i <= 16; e.style.fill = intr && t >= 4.3 ? 'var(--lapis)' : COR[PRE[i]];
      });
      var q0 = xr(0, t); tRNA5.setAttribute('x', (q0[0] - 14).toFixed(1)); tRNA5.setAttribute('y', (q0[1] + 4).toFixed(1));
      tRNA5.style.opacity = t > 0.9 && t < 5.7 ? 1 : 0; rRNA.style.opacity = t > 0.9 ? c12 : 0;
      var oc = seg(t, 5.7, 6.2), ql = xr(27, t);
      cap.setAttribute('cx', (q0[0] - 14).toFixed(1)); cap.setAttribute('cy', (q0[1] - 5).toFixed(1)); cap.style.opacity = oc;
      capT.setAttribute('x', (q0[0] - 14).toFixed(1)); capT.setAttribute('y', (q0[1] - 18).toFixed(1)); capT.style.opacity = oc * c12;
      cauda.setAttribute('x', (ql[0] + 9).toFixed(1)); cauda.setAttribute('y', ql[1].toFixed(1)); cauda.style.opacity = oc;
      m5.setAttribute('x', (q0[0] - 24).toFixed(1)); m5.setAttribute('y', (q0[1] + 1).toFixed(1)); m5.style.opacity = c3;
      m3.setAttribute('x', (ql[0] + 60).toFixed(1)); m3.setAttribute('y', (ql[1] + 1).toFixed(1)); m3.style.opacity = c3;
      caudaT.setAttribute('x', (ql[0] + 9).toFixed(1)); caudaT.setAttribute('y', (ql[1] - 20).toFixed(1)); caudaT.style.opacity = oc * c12;
      /* textos 1-2 */
      var c = t < 4.2 ? CENA[0] : CENA[1]; sT.textContent = c[1]; sL.forEach(function (e, k) { e.textContent = c[2][k]; });
      if (c3 <= 0) return;
      /* ===== traducao ===== */
      var xc = function (k) { return xm(4 + 3 * k); };
      var pk = 0;   /* codon no sitio P */
      for (var k = 1; k <= 4; k++) { var s = 7.8 + (k - 1); pk += seg(t, s + .6, s + .95); }
      if (t >= 10.8) pk = 3;
      var xP = xc(0) + 54 * pk, xr0 = xP + 27, ribOp = t < 7.8 ? seg(t, 7.2, 7.6) : 1 - seg(t, 11.5, 11.95);
      sub.setAttribute('cx', xr0.toFixed(1)); gran.setAttribute('cx', xr0.toFixed(1)); sub.style.opacity = ribOp; gran.style.opacity = .38 * ribOp + .0;
      rRib.setAttribute('x', (xr0 + 80).toFixed(1)); rRib.setAttribute('y', 274); rRib.style.textAnchor = 'start'; rRib.style.opacity = ribOp;
      sitios.forEach(function (e, j) { e.setAttribute('x', (xP + (j - 1) * 54).toFixed(1)); e.style.opacity = ribOp; });
      /* codons sublinhados */
      var dl = ''; for (k = 0; k < 5; k++) dl += 'M' + (xc(k) - 24) + ' ' + (YL + 6) + ' h48 ';
      codLin.setAttribute('d', dl);
      /* RNAt: chegada e saida */
      var tOp = [], tY = [];
      for (k = 0; k < 4; k++) {
        var ch = k === 0 ? 7.3 : 7.8 + (k - 1), sai = k < 3 ? 7.8 + k + .6 : 11.2;
        var u = seg(t, ch, ch + .35), w = seg(t, sai, sai + .4);
        tOp[k] = Math.min(u, 1 - w); tY[k] = -70 * (1 - u) - 50 * w;
        tr[k].setAttribute('transform', 'translate(' + (xc(k) - 30 * w).toFixed(1) + ' ' + tY[k].toFixed(1) + ')'); tr[k].style.opacity = tOp[k];
      }
      /* cadeia de aminoacidos */
      var nb = 0, uT = 0;   /* nb = aminoacido mais novo ja ligado a cadeia; uT = progresso da transferencia */
      for (k = 1; k <= 3; k++) { var s2 = 7.8 + (k - 1); if (t >= s2 + .35) { nb = k; uT = seg(t, s2 + .35, s2 + .6); } }
      var sol = seg(t, 11.2, 11.8), lp = '';
      for (var j = 0; j < 4; j++) {
        var x, y, op = 1;
        if (j > nb || (j === nb && nb === 0)) { x = xc(j); y = 112 + tY[j]; op = tOp[j]; if (j === 0 && nb > 0) {} }
        if (j <= nb && nb > 0) {
          var dA = nb - 1 - j, dD = nb - j, xa = xc(nb - 1) - 26 * dA, ya = 112 - 22 * dA, xd = xc(nb) - 26 * dD, yd = 112 - 22 * dD;
          if (j === nb) { xa = xd = xc(nb); ya = yd = 112; }
          x = lerp(xa, xd, uT); y = lerp(ya, yd, uT);
        }
        if (j === 0 && nb === 0) { x = xc(0); y = 112 + tY[0]; op = tOp[0]; }
        if (j <= nb) { x += 60 * sol; y -= 14 * sol; }
        aaG[j].setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); aaG[j].style.opacity = op;
        if (j <= nb && j > 0) lp += 'L' + x.toFixed(1) + ' ' + y.toFixed(1) + ' '; else if (j === 0) lp = 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
      }
      ligas.setAttribute('d', nb > 0 ? lp : 'M0 0'); ligas.style.opacity = nb > 0 ? 1 : 0;
      /* agua e eventos */
      var ag = 0, xa2 = 0, ev = ['', '', '', ''], cc = 0;
      if (t < 7.8) { ev = ['Início:', 'o RNAt da metionina', 'pareia com o AUG', '(sítio P)']; cc = 0; }
      for (k = 1; k <= 3; k++) {
        var s3 = 7.8 + (k - 1);
        if (t >= s3 && t < s3 + 1) {
          cc = k; var fz = t - s3;
          ev = fz < .35 ? ['Chega um RNAt', 'ao sítio A:', 'anticódon ' + AA[k][2], 'pareia com ' + AA[k][1]] : fz < .62 ? ['Ligação peptídica:', 'a cadeia passa', 'ao novo aminoácido', 'e sai H₂O'] : ['Translocação:', 'o ribossomo anda', '1 códon (3 bases);', 'o RNAt vazio sai'];
          if (fz >= .35 && fz < .75) { ag = Math.min(seg(fz, .35, .45), 1 - seg(fz, .65, .75)); xa2 = xc(k) + 34; }
        }
      }
      if (t >= 10.8) { cc = 4; ev = t < 11.2 ? ['Códon UAA:', 'é de parada;', 'nenhum RNAt', 'pareia com ele'] : ['Fim:', 'a proteína', 'Met–Phe–Gly–Trp', 'é liberada']; }
      agua.setAttribute('x', xa2.toFixed(1)); agua.setAttribute('y', 104); agua.style.opacity = ag;
      evL.forEach(function (e, k) { e.textContent = ev[k] || ''; });
      var C4 = cc < 4 ? AA[cc] : ['fim (parada)', 'UAA', '—', 'ATT'];
      cvV[0].textContent = "3' " + C4[3] + " 5'"; cvV[1].textContent = "5' " + C4[1] + " 3'"; cvV[2].textContent = C4[2] === '—' ? 'nenhum' : "3' " + C4[2] + " 5'"; cvV[3].textContent = C4[0];
    };
  }
};
VIS.liga('transcricao-traducao', ['P012b0e5', 'Wf0d5552', 'W7bc30f5', 'W591e248', 'Wcb67efb', 'Wb1871c4', 'P4f909ea', 'W255a397', 'Wb017961', 'W2e3cdce']);
