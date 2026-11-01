VIS.def['ciclo-viral-hiv-coronavirus'] = {
  tit: 'Como um vírus se multiplica: HIV (retrovírus) e coronavírus lado a lado',
  tipo: 'anim', dur: 12, cred: 'Animação feita para o app (esquema fora de escala e simplificado: no coronavírus a montagem ocorre em membranas internas e a saída é por vesículas).',
  fontes: ['OpenStax Biology 2e, 21.2 Virus Infections and Hosts (receptor específico; transcrição reversa e integração nos retrovírus; brotamento levando membrana) — https://openstax.org/books/biology-2e/pages/21-2-virus-infections-and-hosts'],
  marcas: [[0, 'Encaixe'], [1.8, 'Entrada'], [3.2, 'Genoma'], [5.6, 'Cópias'], [7.8, 'Proteínas'], [10.2, 'Saída']],
  nota: 'O vírus traz só a informação (o genoma) e poucas enzimas; ribossomos, RNA transportadores, energia e matéria-prima são da célula. Só o retrovírus faz DNA a partir de RNA (transcriptase reversa, o alvo do Truvada na PrEP); o coronavírus fica o tempo todo no RNA, no citoplasma.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(e, v) { e.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var S1 = 1.8, S2 = 3.2, S3 = 5.6, S4 = 7.8, S5 = 10.2;
    var RNA = '#c0392b', DNA = '#2f6fa8', RIB = '#6f5b94', PROT = '#d08a3a';
    var LAB = 'font-size:13.5px;fill:var(--tinta)', LABF = 'font-size:13.5px;font-weight:700;fill:';
    function onda(x0, y0, len, frac) { var d = 'M' + x0 + ' ' + y0, n = Math.max(1, Math.round(len * frac / 3)); for (var i = 1; i <= n; i++) { var x = x0 + i * 3; d += ' L' + x + ' ' + (y0 + 3.5 * Math.sin(x / 4)).toFixed(1); } return d; }
    function celula(x, nome) {
      el('rect', { x: x, y: 80, width: 288, height: 212, rx: 34, style: 'fill:color-mix(in srgb,#f0c9b4 22%,var(--folha));stroke:#c98f74;stroke-width:3.5' });
      tx({ x: x, y: 18, style: 'font-size:14.5px;font-weight:700;fill:var(--tinta)' }, nome);
    }
    function virus(tipo) {
      var g = el('g', {});
      for (var k = 0; k < 10; k++) {
        var a = k * Math.PI / 5;
        if (tipo === 'hiv') { el('line', { x1: 15 * Math.cos(a), y1: 15 * Math.sin(a), x2: 20 * Math.cos(a), y2: 20 * Math.sin(a), style: 'stroke:#8a6a2f;stroke-width:1.5' }, g); el('circle', { cx: 21.5 * Math.cos(a), cy: 21.5 * Math.sin(a), r: 2.6, style: 'fill:#3f8f6b' }, g); }
        else { el('line', { x1: 15 * Math.cos(a), y1: 15 * Math.sin(a), x2: 21 * Math.cos(a), y2: 21 * Math.sin(a), style: 'stroke:#a0522d;stroke-width:2' }, g); el('ellipse', { cx: 22.5 * Math.cos(a), cy: 22.5 * Math.sin(a), rx: 3.4, ry: 2.4, transform: 'rotate(' + (a * 180 / Math.PI) + ' ' + (22.5 * Math.cos(a)) + ' ' + (22.5 * Math.sin(a)) + ')', style: 'fill:#a0522d' }, g); }
      }
      el('circle', { r: 15, style: 'fill:' + (tipo === 'hiv' ? '#f2dfb4;stroke:#a37a3a' : '#efdccf;stroke:#a0522d') + ';stroke-width:1.8' }, g);
      if (tipo === 'hiv') el('path', { d: 'M-5 -8 L5 -8 L8 8 L-8 8 Z', style: 'fill:#e0b96a;stroke:#a37a3a;stroke-width:1' }, g);
      el('path', { d: 'M-6 -2 q3 -4 6 0 q3 4 6 0', style: 'fill:none;stroke:' + RNA + ';stroke-width:1.8' }, g);
      return g;
    }
    function receptor(x, nome) {
      el('path', { d: 'M' + x + ' 80 V66 M' + x + ' 68 l-7 -9 M' + x + ' 68 l7 -9', style: 'fill:none;stroke:#3d6fa8;stroke-width:3.5;stroke-linecap:round' });
      tx({ x: x - 30, y: 72, 'text-anchor': 'end', style: LABF + '#3d6fa8' }, nome);
    }
    function ribo(pai) { var g = el('g', {}, pai); el('ellipse', { cx: 0, cy: -5, rx: 8, ry: 5, style: 'fill:' + RIB }, g); el('ellipse', { cx: 0, cy: 4, rx: 11, ry: 6.5, style: 'fill:' + RIB }, g); return g; }
    function contas(pai, n) { var a = []; for (var i = 0; i < n; i++) a.push(el('circle', { r: 3, style: 'fill:' + PROT }, pai)); return a; }
    /* ===== HIV ===== */
    celula(16, 'HIV (retrovírus) no linfócito T CD4');
    var nuc = el('circle', { cx: 104, cy: 224, r: 52, style: 'fill:color-mix(in srgb,#9db7d6 25%,var(--folha));stroke:#7d97b8;stroke-width:2' });
    tx({ x: 104, y: 192, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--lapis)' }, 'núcleo');
    el('path', { d: 'M62 228 H146 M62 234 H146', style: 'stroke:#7d97b8;stroke-width:2.2' });
    tx({ x: 104, y: 254, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'cromossomo');
    var ins = el('path', { d: 'M90 228 H118 M90 234 H118', style: 'stroke:' + DNA + ';stroke-width:3.4' });
    receptor(204, 'CD4');
    var vH = virus('hiv');
    var rnaH = el('path', { style: 'fill:none;stroke:' + RNA + ';stroke-width:2.4' });
    var dnaH = el('path', { style: 'fill:none;stroke:' + DNA + ';stroke-width:2.4' });
    var dnaHT = tx({ style: LABF + DNA }, 'DNA'), rnaHT = tx({ style: LABF + RNA }, 'RNA');
    var rt = el('circle', { r: 6.5, style: 'fill:' + PROT + ';stroke:#8a5a1f;stroke-width:1.5' });
    var rtT1 = tx({ x: 140, y: 104, style: LABF + '#8a5a1f' }, 'transcriptase reversa'), rtT2 = tx({ x: 140, y: 120, style: LABF + '#b4442f' }, 'alvo do Truvada (PrEP)');
    var intT = tx({ x: 162, y: 214, style: LABF + DNA }, 'integrase');
    var mH = [0, 1, 2].map(function () { return el('path', { style: 'fill:none;stroke:' + RNA + ';stroke-width:2' }); });
    var gRH = el('g', {}), rH = [ribo(gRH), ribo(gRH)], cH = [contas(gRH, 6), contas(gRH, 6)];
    var ribHT = tx({ x: 166, y: 282, style: LAB }, 'ribossomos da célula');
    var nHc = el('g', {}); el('path', { d: 'M-5 -8 L5 -8 L8 8 L-8 8 Z', style: 'fill:#e0b96a;stroke:#a37a3a;stroke-width:1.2' }, nHc); el('path', { d: 'M-4 0 q2 -3 4 0 q2 3 4 0', style: 'fill:none;stroke:' + RNA + ';stroke-width:1.6' }, nHc);
    var nH = virus('hiv'), nHm = el('circle', { r: 24, style: 'fill:none;stroke:#c98f74;stroke-width:3' });
    /* ===== coronavirus ===== */
    celula(336, 'Coronavírus (vírus de RNA)');
    el('circle', { cx: 576, cy: 238, r: 38, style: 'fill:color-mix(in srgb,#9db7d6 15%,var(--folha));stroke:#b5c2d2;stroke-width:2' });
    tx({ x: 576, y: 236, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--lapis)' }, 'núcleo');
    tx({ x: 576, y: 252, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'não usado');
    receptor(480, 'ACE2');
    var vC = virus('cor');
    var rnaC = el('path', { style: 'fill:none;stroke:' + RNA + ';stroke-width:2.4' });
    var rnaCT = tx({ style: LABF + RNA }, 'RNA');
    var gRC = el('g', {}), rC = [ribo(gRC), ribo(gRC)], cC = [contas(gRC, 7), contas(gRC, 7)];
    var cT1 = tx({ x: 352, y: 104, style: LABF + RIB }), cT2 = tx({ x: 352, y: 120, style: LABF + RIB });
    var cop = [0, 1, 2].map(function () { return el('path', { style: 'fill:none;stroke:' + RNA + ';stroke-width:2.2' }); });
    var rdrp = el('circle', { r: 6.5, style: 'fill:#4f9a7a;stroke:#2e6b52;stroke-width:1.5' });
    var rdT = tx({ x: 352, y: 286, style: LABF + '#2e6b52' });
    var gRC2 = el('g', {}), rC2 = [ribo(gRC2), ribo(gRC2)], cC2 = [contas(gRC2, 6), contas(gRC2, 6)];
    var nC = virus('cor');
    /* legendas por etapa */
    var hl1 = tx({ x: 16, y: 316, style: LAB }), hl2 = tx({ x: 16, y: 334, style: LAB });
    var cl1 = tx({ x: 336, y: 316, style: LAB }), cl2 = tx({ x: 336, y: 334, style: LAB });
    function mover(g, x, y, s) { g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + (s || 1) + ')'); }
    function cadeia(arr, x, y, n) { arr.forEach(function (c, i) { c.setAttribute('cx', x + 6 + i * 6.5); c.setAttribute('cy', y - 12 - i * 2); c.style.opacity = i < n ? 1 : 0; }); }
    return function (t) {
      /* --- entrada (igual nos dois) --- */
      var ue = ease(t / S1), ui = ease((t - S1) / (S2 - S1) * 1.3);
      [[vH, 204], [vC, 480]].forEach(function (p) {
        var y = 44 + 18 * ue + 46 * ui; mover(p[0], p[1], y, 1 - .35 * ui); op(p[0], t < S2 ? 1 - ease((t - S2 + .5) / .5) : 0);
      });
      var lib = cl((t - S2 + .6) / .6);   /* RNA liberado */
      /* --- HIV --- */
      var urt = cl((t - S2) / (S3 - S2 - .3));
      rnaH.setAttribute('d', onda(150, 136, 100, t < S2 - .6 ? 0 : t < S3 ? Math.max(.05, lib) : 1)); op(rnaH, t < S2 - .6 ? 0 : t < S3 + .6 ? 1 : 1 - cl((t - S3 - .6) / .5));
      op(rnaHT, t >= S2 && t < S3 + .6); rnaHT.setAttribute('x', 256); rnaHT.setAttribute('y', 141);
      var dx = 150, dy = 156, ui2 = ease((t - S3) / 1.1);
      if (t >= S3) { dx = 150 + (90 - 150) * ui2; dy = 156 + (231 - 156) * ui2; }
      var dlen = t < S3 ? 100 * urt : 100 - 72 * ui2;
      dnaH.setAttribute('d', 'M' + dx.toFixed(1) + ' ' + (dy - 3).toFixed(1) + ' h' + dlen.toFixed(1) + ' M' + dx.toFixed(1) + ' ' + (dy + 3).toFixed(1) + ' h' + dlen.toFixed(1));
      op(dnaH, t >= S2 && t < S3 + 1.1 ? 1 : 0); op(dnaHT, t >= S2 + .4 && t < S3); dnaHT.setAttribute('x', 256); dnaHT.setAttribute('y', 161);
      rt.setAttribute('cx', (150 + 100 * urt).toFixed(1)); rt.setAttribute('cy', 146); op(rt, t >= S2 && t < S3 ? 1 : 0);
      op(rtT1, t >= S2 && t < S3); op(rtT2, t >= S2 && t < S3);
      op(ins, t >= S3 + 1.0 ? 1 : 0); op(intT, t >= S3 + .6 && t < S4 + .4);
      mH.forEach(function (m, k) {
        var u = cl((t - S3 - 1.2 - k * .3) / .8), x0 = 150 + 30 * u, y0 = 222 - 10 * k + 20 * u;
        m.setAttribute('d', onda(x0, y0 + 10, 34, cl(u * 2))); op(m, t >= S3 + 1.2 + k * .3 && t < S5 + .4 ? 1 : 0);
      });
      var ut = cl((t - S4) / (S5 - S4 - .4));
      op(gRH, t >= S4 - .3 ? 1 : 0); op(ribHT, t >= S4 - .3 && t < S5 + .8);
      rH.forEach(function (r, k) { var x = 200 + 18 * k + 30 * ut, y = 242 + 18 * k; mover(r, x, y); cadeia(cH[k], x, y, Math.round(6 * cl(ut * 1.2 - k * .15))); });
      var ub = ease((t - S5) / 1.4);
      var aparece = t >= S4 + 1.2 ? Math.min(1, (t - S4 - 1.2) / .6) : 0;
      mover(nH, 64 - 14 * ub, 104 - 44 * ub, .6 + .4 * ub); op(nH, ub > .5 ? aparece : 0);
      mover(nHc, 64 - 14 * ub, 104 - 44 * ub, 1); op(nHc, ub > .5 ? 0 : aparece);
      nHm.setAttribute('cx', (64 - 14 * ub).toFixed(1)); nHm.setAttribute('cy', (104 - 44 * ub).toFixed(1)); op(nHm, ub > .5 ? 1 : 0);
      /* --- coronavirus --- */
      rnaC.setAttribute('d', onda(396, 140, 120, t < S2 - .6 ? 0 : Math.max(.05, lib))); op(rnaC, t >= S2 - .6 ? 1 : 0);
      op(rnaCT, t >= S2); rnaCT.setAttribute('x', 522); rnaCT.setAttribute('y', 146);
      var ur = cl((t - S2) / (S3 - S2 - .2));
      op(gRC, t >= S2 && t < S4 ? 1 : t >= S4 && t < S4 + .4 ? 1 - (t - S4) / .4 : 0);
      rC.forEach(function (r, k) { var x = 404 + 96 * cl(ur * 1.15 - k * .35), y = 144; mover(r, x, y); cadeia(cC[k], x, y, Math.round(7 * cl(ur * 1.15 - k * .35))); op(r, ur * 1.15 - k * .35 > 0 ? 1 : 0); });
      var uc = cl((t - S3) / (S4 - S3 - .2));
      cop.forEach(function (c, k) { var u = cl(uc * 1.6 - k * .3); c.setAttribute('d', onda(396, 172 + 20 * k, 120, u)); op(c, t >= S3 && u > 0 ? 1 : 0); });
      var kk = Math.min(2, Math.floor(uc * 1.6 / .55)), uu = cl(uc * 1.6 - kk * .3);
      rdrp.setAttribute('cx', (396 + 120 * uu).toFixed(1)); rdrp.setAttribute('cy', 166 + 20 * kk); op(rdrp, t >= S3 && t < S4 ? 1 : 0);
      rdT.textContent = t >= S3 && t < S4 ? 'RNA-polimerase viral: RNA → RNA' : '';
      var ut2 = cl((t - S4) / (S5 - S4 - .4));
      op(gRC2, t >= S4 ? 1 : 0);
      rC2.forEach(function (r, k) { var x = 404 + 40 * k + 30 * ut2, y = 262 - 6 * k; mover(r, x, y); cadeia(cC2[k], x, y, Math.round(6 * cl(ut2 * 1.2 - k * .15))); });
      mover(nC, 590 + 16 * ub, 104 - 44 * ub, .6 + .4 * ub); op(nC, t >= S4 + 1.2 ? Math.min(1, (t - S4 - 1.2) / .6) : 0);
      cT1.textContent = t >= S2 && t < S3 ? 'o próprio RNA serve de RNAm:' : t >= S4 && t < S5 + .8 ? '' : '';
      cT2.textContent = t >= S2 && t < S3 ? 'ribossomos da célula o traduzem' : '';
      if (t >= S4 && t < S5 + .8) { rdT.textContent = 'ribossomos e RNAt da célula'; rdT.style.fill = RIB; } else rdT.style.fill = '#2e6b52';
      /* --- legendas por etapa --- */
      var H, C;
      if (t < S1) { H = ['a proteína do envelope (gp120) encaixa', 'no receptor CD4: só células com CD4 servem']; C = ['a espícula S encaixa no receptor ACE2', '(chave e fechadura)']; }
      else if (t < S2) { H = ['o envelope se funde à membrana e o', 'RNA entra com as enzimas do vírus']; C = ['o vírus entra e libera o RNA', 'no citoplasma']; }
      else if (t < S3) { H = ['a transcriptase reversa faz DNA a', 'partir do RNA, no citosol']; C = ['não há transcriptase reversa: o RNA', 'vai direto para os ribossomos']; }
      else if (t < S4) { H = ['a integrase encaixa o DNA no cromossomo;', 'a célula transcreve esse DNA em RNA']; C = ['a RNA-polimerase feita pelo vírus copia', 'o RNA, tudo no citoplasma']; }
      else if (t < S5) { H = ['ribossomos e RNAt da célula fazem', 'as proteínas do vírus']; C = ['ribossomos e RNAt da célula fazem', 'as proteínas do vírus']; }
      else { H = ['novos vírus saem levando um pedaço', 'da membrana da célula (envelope)']; C = ['novos vírus saem da célula,', 'prontos para infectar outras']; }
      var PR = { Pd79452b: ['Por isso a resposta é D: no HIV, a transcriptase reversa', 'faz DNA a partir do RNA viral, no citosol.'], Pcabc2a2: ['Por isso a resposta é B: o Truvada bloqueia a transcriptase', 'reversa, e a célula não produz DNA viral.'], P0e7cc5c: ['Por isso a resposta é B: o coronavírus faz suas proteínas', 'com os ribossomos e os RNA transportadores da célula.'], Pb5912cb: ['Por isso a resposta é A: o vírus só entra se a proteína do', 'envelope ou capsídeo encaixar no receptor da célula.'], Pad87be3: ['Por isso a resposta é E: o vírus traz só a informação;', 'a célula é induzida a fabricar as cópias dele.'] }[qid];
      if (PR && t >= 10.6) { H = PR; C = ['', '']; }
      hl1.style.fontWeight = PR && t >= 10.6 ? 700 : ''; hl1.style.fill = PR && t >= 10.6 ? 'var(--ad-t)' : '';
      hl1.textContent = H[0]; hl2.textContent = H[1]; cl1.textContent = C[0]; cl2.textContent = C[1];
    };
  }
};
VIS.liga('ciclo-viral-hiv-coronavirus', ['Pd79452b', 'Pcabc2a2', 'P0e7cc5c', 'Pb5912cb', 'Pad87be3']);
