VIS.def['desenvolvimento-embrionario-folhetos'] = {
  tit: 'Do zigoto ao tubo neural: clivagem, blástula, gástrula e nêurula',
  fontes: ['OpenStax Biology 2e, 43.6 Fertilization and Early Embryonic Development — https://openstax.org/books/biology-2e/pages/43-6-fertilization-and-early-embryonic-development', 'OpenStax Biology 2e, 43.7 Organogenesis and Vertebrate Axis Formation — https://openstax.org/books/biology-2e/pages/43-7-organogenesis-and-vertebrate-axis-formation'],
  tipo: 'anim', dur: 12,
  cred: 'Animação feita para o app: embrião de cordado em corte (modelo do anfioxo), esquema fora de escala. Cores dos folhetos: ectoderme azul, mesoderme vermelha, endoderme amarela.',
  marcas: [[0, 'Zigoto a mórula'], [3.4, 'Blástula'], [5, 'Gástrula'], [7.6, 'Nêurula']],
  nota: 'Os folhetos só existem a partir da gástrula; na blástula há uma camada única, ainda indiferenciada. O sistema nervoso central vem da ectoderme: a placa neural, sobre a notocorda, dobra-se e fecha-se no tubo neural, que forma o encéfalo e a medula espinal.',
  monta: function (svg) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var TXT = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';
    var CEL = 'fill:#f3dcc0;stroke:#b98d62;stroke-width:1.5', ECT = '#4a8fd1', NEU = '#2c5f9e', MES = '#d9534f', END = '#e3b82f', CAV = '#dbeaf5';
    var CX = 156, CY = 178;
    /* ---------- estagios iniciais: celulas ---------- */
    var gCel = el('g', {});
    var cels = [];
    for (var i = 0; i < 19; i++) cels.push(el('circle', { style: CEL }, gCel));
    var nuc = el('circle', { cx: CX, cy: CY, r: 12, style: 'fill:#b98d62;opacity:.7' }, gCel);
    function hexpack(n, r, raio) {   /* posicoes compactas */
      var p = [[0, 0]], anel = 1;
      while (p.length < n) { for (var k = 0; k < 6 * anel && p.length < n; k++) { var a = 2 * Math.PI * k / (6 * anel) + anel * .3; p.push([Math.cos(a) * raio * anel, Math.sin(a) * raio * anel]); } anel++; }
      return p;
    }
    var LAYOUT = {
      1: [[[0, 0]], 70], 2: [[[-36, 0], [36, 0]], 36], 4: [[[-33, -33], [33, -33], [-33, 33], [33, 33]], 33],
      8: [[[-28, -28], [28, -28], [-28, 28], [28, 28], [0, -22], [22, 0], [0, 22], [-22, 0]], 25], 16: [hexpack(19, 30, 30), 17]
    };
    /* ---------- blastula e gastrula ---------- */
    var gB = el('g', {});
    var R = 86, RC = R - 11;
    var cav = el('circle', { cx: CX, cy: CY, r: R - 18, style: 'fill:' + CAV }, gB);
    var arq = el('path', { style: 'fill:#fff6d6' }, gB);
    var pEct = el('path', { style: 'fill:none;stroke-width:22;stroke-linecap:round' }, gB);
    var pEnd = el('path', { style: 'fill:none;stroke-width:20;stroke-linecap:round' }, gB);
    var mE = el('path', { style: 'fill:none;stroke:' + MES + ';stroke-width:12;stroke-linecap:round' }, gB);
    var mD = el('path', { style: 'fill:none;stroke:' + MES + ';stroke-width:12;stroke-linecap:round' }, gB);
    var divs = el('g', {}, gB);
    var dRad = el('path', { style: 'fill:none;stroke:#b98d62;stroke-width:1.2' }, divs);
    el('circle', { cx: CX, cy: CY, r: R, style: 'fill:none;stroke:#b98d62;stroke-width:1.5' }, divs);
    el('circle', { cx: CX, cy: CY, r: R - 22, style: 'fill:none;stroke:#b98d62;stroke-width:1.5' }, divs);
    var rotB = el('g', {}, gB);
    function rot(pai, x, y, xa, ya, s, cor, anc) {
      var g = el('g', {}, pai);
      el('line', { x1: xa, y1: ya, x2: x + (anc === 'end' ? 4 : -4), y2: y - 5, style: 'stroke:var(--lapis);stroke-width:1.2' }, g);
      tx({ x: x, y: y, 'text-anchor': anc || 'start', style: 'font-size:13.5px;font-weight:700;fill:' + (cor || 'var(--tinta)') }, s, g);
      return g;
    }
    var rBlast = rot(rotB, 268, 92, CX + 58, CY - 56, 'camada única', null);
    tx({ x: 268, y: 109, style: 'font-size:13.5px;font-weight:700;' + TXT }, 'de células', rBlast);
    var rCav = tx({ x: CX, y: CY + 5, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:#2a5d86' }, 'blastocele', gB);
    var rCav2 = tx({ x: CX, y: CY + 22, 'text-anchor': 'middle', style: 'font-size:13px;fill:#2a5d86' }, '(líquido)', gB);
    var rEct = rot(rotB, 268, 70, CX + 56, CY - 58, 'ectoderme', ECT);
    var rMes = rot(rotB, 268, 140, CX + 56, CY - 20, 'mesoderme', MES);
    var rEnd = rot(rotB, 268, 196, CX + 30, CY + 10, 'endoderme', '#b48a00');
    var rArq = rot(rotB, 268, 250, CX + 6, CY + 40, 'arquêntero', '#8a6a00');
    var rBp = tx({ x: CX, y: CY + R + 30, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;' + TXT }, 'blastóporo', gB);
    function arco(r, a0, a1) {   /* graus, y para baixo */
      var p0 = [CX + r * Math.cos(a0 * Math.PI / 180), CY + r * Math.sin(a0 * Math.PI / 180)], p1 = [CX + r * Math.cos(a1 * Math.PI / 180), CY + r * Math.sin(a1 * Math.PI / 180)];
      var grande = Math.abs(a1 - a0) > 180 ? 1 : 0;
      return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + grande + ' 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
    }
    /* ---------- neurula ---------- */
    var gN = el('g', {});
    var NX = 180, YE = 128, LP = 124, rt = LP / (2 * Math.PI);
    var gut = el('ellipse', { cx: NX, cy: 284, rx: 58, ry: 24, style: 'fill:#fff6d6;stroke:' + END + ';stroke-width:12' }, gN);
    var som = [el('rect', { x: NX - 128, y: 150, width: 66, height: 64, rx: 18, style: 'fill:#f2b8b6;stroke:' + MES + ';stroke-width:3' }, gN),
      el('rect', { x: NX + 62, y: 150, width: 66, height: 64, rx: 18, style: 'fill:#f2b8b6;stroke:' + MES + ';stroke-width:3' }, gN)];
    var noto = el('circle', { cx: NX, r: 14, style: 'fill:#f6cfc4;stroke:#c0605a;stroke-width:3' }, gN);
    var epiE = el('path', { style: 'fill:none;stroke:' + ECT + ';stroke-width:10;stroke-linecap:round' }, gN);
    var epiD = el('path', { style: 'fill:none;stroke:' + ECT + ';stroke-width:10;stroke-linecap:round' }, gN);
    var placa = el('path', { style: 'fill:none;stroke:' + NEU + ';stroke-width:14;stroke-linecap:round' }, gN);
    var nRot = el('g', {}, gN);
    tx({ x: 14, y: 106, style: 'font-size:13.5px;font-weight:700;fill:' + ECT }, 'ectoderme (dará a epiderme)', nRot);
    var lNeu = tx({ x: 300, y: 106, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:' + NEU }, '', nRot);
    var lNeuL = el('line', { style: 'stroke:var(--lapis);stroke-width:1.2' }, nRot);
    var lNo = tx({ x: 14, y: 250, style: 'font-size:13.5px;font-weight:700;fill:#c0605a' }, 'notocorda', nRot);
    var lNoL = el('polyline', { style: 'fill:none;stroke:var(--lapis);stroke-width:1.2' }, nRot);
    tx({ x: NX + 128, y: 232, 'text-anchor': 'end', style: 'font-size:13.5px;font-weight:700;fill:' + MES }, 'mesoderme', nRot);
    tx({ x: NX + 128, y: 247, 'text-anchor': 'end', style: 'font-size:13px;fill:' + MES }, '(somitos)', nRot);
    tx({ x: NX, y: 334, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:#b48a00' }, 'endoderme (intestino primitivo)', nRot);
    tx({ x: 14, y: 30, style: 'font-size:13px;' + LAP }, 'corte transversal da região dorsal', gN);
    /* ---------- painel ---------- */
    var PX = 392;
    var fase = tx({ x: PX, y: 64, style: 'font-size:23px;font-weight:700;' + TXT });
    var L = [];
    for (i = 0; i < 7; i++) L.push(tx({ x: PX, y: 94 + i * 21, style: 'font-size:14.5px;' + TXT }));

    return function (t) {
      var F, k;
      var inicial = t < 3.4, blas = t >= 3.4 && t < 7.6, neur = t >= 7.6;
      gCel.style.display = inicial ? '' : 'none'; gB.style.display = blas ? '' : 'none'; gN.style.display = neur ? '' : 'none';
      if (inicial) {
        var n = t < 1 ? 1 : t < 1.5 ? 2 : t < 2 ? 4 : t < 2.4 ? 8 : 16, Lay = LAYOUT[n];
        cels.forEach(function (c, i) {
          if (i < Lay[0].length) { c.style.display = ''; c.setAttribute('cx', CX + Lay[0][i][0]); c.setAttribute('cy', CY + Lay[0][i][1]); c.setAttribute('r', Lay[1]); }
          else c.style.display = 'none';
        });
        nuc.style.display = n === 1 ? '' : 'none';
        if (n === 1) F = ['Zigoto', 'uma célula só: o óvulo fecundado'];
        else if (n < 16) F = ['Clivagem', 'mitoses seguidas: 2, 4, 8 células...', 'o número de células dobra, mas', 'o embrião não cresce: as células', 'ficam cada vez menores'];
        else F = ['Mórula', 'bola maciça de células,', 'sem cavidade por dentro', '(lembra uma amora)'];
      }
      if (blas) {
        var u = ease((t - 5.15) / 1.7), cor = u > .25;
        var al = lerp(62, 30, u) * Math.PI / 180;
        var a0 = 90 + lerp(62, 30, u), a1 = 90 - lerp(62, 30, u) + 360;
        pEct.setAttribute('d', arco(RC, a0, a1));
        pEct.style.stroke = cor ? ECT : '#f3dcc0';
        /* placa vegetal: arco -> U invaginado */
        var xr = CX + RC * Math.sin(al), xl = CX - RC * Math.sin(al), yl = CY + RC * Math.cos(al);
        var kk = 4 / 3 * Math.tan(al / 2) * RC;
        var arcC1 = [xr - kk * Math.cos(al), yl + kk * Math.sin(al)], arcC2 = [xl + kk * Math.cos(al), yl + kk * Math.sin(al)];
        var uC1 = [xr + 4, CY - RC * .9], uC2 = [xl - 4, CY - RC * .9];
        var c1 = [lerp(arcC1[0], uC1[0], u), lerp(arcC1[1], uC1[1], u)], c2 = [lerp(arcC2[0], uC2[0], u), lerp(arcC2[1], uC2[1], u)];
        var dEnd = 'M' + xr.toFixed(1) + ' ' + yl.toFixed(1) + ' C' + c1[0].toFixed(1) + ' ' + c1[1].toFixed(1) + ' ' + c2[0].toFixed(1) + ' ' + c2[1].toFixed(1) + ' ' + xl.toFixed(1) + ' ' + yl.toFixed(1);
        pEnd.setAttribute('d', dEnd); pEnd.style.stroke = cor ? END : '#f3dcc0';
        arq.setAttribute('d', dEnd + 'Z'); arq.style.opacity = u > .4 ? 1 : 0;
        /* contorno das celulas na blastula */
        if (u < .25) {
          var d = '';
          for (k = 0; k < 26; k++) { var a = k / 26 * 2 * Math.PI; d += 'M' + (CX + (R - 22) * Math.cos(a)).toFixed(1) + ' ' + (CY + (R - 22) * Math.sin(a)).toFixed(1) + ' L' + (CX + R * Math.cos(a)).toFixed(1) + ' ' + (CY + R * Math.sin(a)).toFixed(1) + ' '; }
          dRad.setAttribute('d', d);
          divs.style.opacity = (1 - u * 4).toFixed(2);
        } else divs.style.opacity = 0;
        var m = cl((u - .55) / .3);
        mE.setAttribute('d', arco(RC - 21, 150, lerp(150, 235, m))); mD.setAttribute('d', arco(RC - 21, 30, lerp(30, -55, m) + (m > 0 ? 0 : 0)));
        mD.setAttribute('d', 'M0 0'); mE.setAttribute('d', 'M0 0');
        if (m > 0) { mE.setAttribute('d', arco(RC - 22, 240 - 72 * m, 240)); mD.setAttribute('d', arco(RC - 22, 300, 300 + 72 * m)); }
        mE.style.opacity = mD.style.opacity = m > 0 ? 1 : 0;
        var gast = t >= 5;
        rBlast.style.display = gast && u >= .1 ? 'none' : ''; rCav.style.display = rCav2.style.display = u > .3 ? 'none' : '';
        rEct.style.opacity = u > .3 ? 1 : 0; rMes.style.opacity = m > .6 ? 1 : 0; rEnd.style.opacity = u > .6 ? 1 : 0;
        rArq.style.opacity = u > .8 ? 1 : 0; rBp.style.opacity = u > .6 ? 1 : 0;
        
        if (!gast || u < .1) F = ['Blástula', 'esfera oca: uma camada única', 'de células em volta de uma', 'cavidade com líquido, a blastocele', '', 'ainda não há folhetos'];
        else F = ['Gástrula', 'células entram pelo blastóporo', '(invaginação) e surgem os', 'três folhetos germinativos:', 'ectoderme por fora, endoderme', 'forrando o arquêntero e a', 'mesoderme entre os dois'];
      }
      if (neur) {
        var v = ease((t - 8.6) / 2.1), kap = Math.max(1e-4, v * 2 * Math.PI / LP), yM = YE + v * (2 * rt + 18);
        var pts = [], N = 40;
        for (k = 0; k <= N; k++) { var s = -LP / 2 + LP * k / N, ph = kap * s; pts.push([NX + Math.sin(ph) / kap, yM - (1 - Math.cos(ph)) / kap]); }
        var dp = '';
        pts.forEach(function (p, i) { dp += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' '; });
        placa.setAttribute('d', dp + (v > .985 ? 'Z' : ''));
        var tl = pts[0], tr = pts[N];
        if (v > .985) { epiE.setAttribute('d', 'M' + (NX - 168) + ' ' + YE + ' H' + NX); epiD.setAttribute('d', 'M' + NX + ' ' + YE + ' H' + (NX + 168)); }
        else {
          epiE.setAttribute('d', 'M' + (NX - 168) + ' ' + YE + ' L' + (NX - LP / 2 - 30) + ' ' + YE + ' Q' + (tl[0] - 8).toFixed(1) + ' ' + YE + ' ' + (tl[0] - 1).toFixed(1) + ' ' + (tl[1] - 4).toFixed(1));
          epiD.setAttribute('d', 'M' + (NX + 168) + ' ' + YE + ' L' + (NX + LP / 2 + 30) + ' ' + YE + ' Q' + (tr[0] + 8).toFixed(1) + ' ' + YE + ' ' + (tr[0] + 1).toFixed(1) + ' ' + (tr[1] - 4).toFixed(1));
        }
        var ny = yM + 26; noto.setAttribute('cy', ny.toFixed(1));
        lNoL.setAttribute('points', '80,245 ' + (NX - 26) + ',245 ' + (NX - 10) + ',' + (ny + 11).toFixed(1));
        var alvo = v > .985 ? [NX + rt + 7, yM - rt] : [NX + 30, yM - 6];
        lNeu.textContent = v < .05 ? 'placa neural' : v < .985 ? 'goteira neural' : 'tubo neural';
        lNeuL.setAttribute('x1', 300); lNeuL.setAttribute('y1', 112); lNeuL.setAttribute('x2', alvo[0].toFixed(1)); lNeuL.setAttribute('y2', alvo[1].toFixed(1));
        F = v < .05 ? ['Nêurula', 'a notocorda induz a ectoderme', 'dorsal, logo acima dela, a', 'engrossar: é a placa neural'] :
          v < .985 ? ['Nêurula', 'as bordas da placa sobem e', 'ela se dobra em goteira'] :
          ['Nêurula', 'a goteira se fecha no tubo', 'neural, coberto pela epiderme', '', 'Por isso: tubo neural vem da', 'ectoderme e forma encéfalo e', 'medula (sistema nervoso central)'];
      }
      fase.textContent = F[0];
      for (k = 0; k < 7; k++) { L[k].textContent = F[k + 1] || ''; L[k].style.fontWeight = (neur && k >= 3 && F.length > 5) ? '700' : '400'; }
    };
  }
};
VIS.liga('desenvolvimento-embrionario-folhetos', ['P8f63f9c', 'Wef381bf', 'W58e3629']);

/* etapa final: "Por isso a resposta é..." da questão aberta */
(function () {
  var V = VIS.def['desenvolvimento-embrionario-folhetos'], m0 = V.monta, D0 = V.dur, R = {"P8f63f9c": ["E", "X é o tubo neural: vem da ectoderme dorsal e origina", "o encéfalo e a medula, o sistema nervoso central."], "Wef381bf": ["E — blástula", "Uma camada única de células em volta de uma cavidade", "com líquido (a blastocele) é a blástula."], "W58e3629": ["E — ectoderma na fase de gástrula", "O tecido nervoso vem da ectoderme, e os folhetos só", "existem a partir da gástrula."]};
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
