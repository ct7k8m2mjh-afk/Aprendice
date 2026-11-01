/* Meiose I e II (2n = 4) com pareamento, crossing-over e separação de homólogos x cromátides */
VIS.def['meiose-fases'] = {
  tit: 'Meiose: primeiro se separam os homólogos, depois as cromátides-irmãs',
  tipo: 'anim', dur: 14.4,
  marcas: [[0, 'Prófase I'], [5, 'Anáfase I'], [7.2, 'Meiose II'], [10.6, 'Fim'], [12, 'Resposta']],
  fontes: ['OpenStax Biology 2e, 11.1 The Process of Meiosis — https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis'],
  cred: 'Animação feita para o app (esquema fora de escala; célula com 2n = 4; vermelho = cromossomo de origem paterna, azul = materna).',
  nota: 'Para reconhecer a fase: se migram cromossomos ainda duplicados (com duas cromátides), é anáfase I; se migram cromátides já separadas, é anáfase II ou mitose. Na anáfase I vai para cada polo metade do número 2n.',
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
    var PQ = {"P0a240e7": "4 cromossomos ainda duplicados indo para cada polo, em 2n = 8: anáfase I. Alternativa D.", "P1f6aed6": "As figuras mostram meiose; na planta ela ocorre nos esporângios, como a antera da flor. Alternativa E.", "W8013f87": "No fim da meiose surgem 4 células haploides (n): alternativa A.", "W8a118de": "O crossing-over acontece no paquíteno da prófase I: alternativa C.", "W40d9a57": "Parado na metáfase II, o ovócito ainda não separou as cromátides-irmãs: alternativa A.", "P831b9bb": "X e Y são homólogos e se separam na meiose I do pai; todo óvulo leva X. Alternativa A."};
    var VERM = '#c0504d', AZUL = '#3d6fb6', TINTA = 'fill:var(--tinta)', LAP = 'fill:var(--lapis)';

    /* ---------- celulas (contorno unido: bordas embaixo, citoplasma por cima) ---------- */
    var gB = el('g', {}), gC = el('g', {});
    var cel = [0, 1, 2, 3].map(function () { return [el('ellipse', { style: 'fill:none;stroke:#b98a7c;stroke-width:6' }, gB), el('ellipse', { style: 'fill:#fbeee6' }, gC)]; });
    var envI = el('circle', { cx: 200, cy: 178, r: 118, style: 'fill:#f3e6f1;stroke:#9b7aa6;stroke-width:1.6;stroke-dasharray:5 4' });
    var nucF = [0, 1, 2, 3].map(function () { return el('ellipse', { rx: 58, ry: 40, style: 'fill:#f3e6f1;stroke:#9b7aa6;stroke-width:1.6' }); });
    var fuso = el('path', { style: 'fill:none;stroke:#a89a8b;stroke-width:1.1' });
    var placa = el('line', { style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' });

    /* ---------- cromossomos: [comprimento, cor, quadros-chave {t: [x, y, ang, sep]}] ---------- */
    function K(a) { return a; }
    var CR = [
      [58, VERM, K([[0, 148, 112, -25, 9], [1.2, 148, 112, -25, 9], [2.3, 191, 130, 0, 9], [4.4, 190, 130, 0, 9], [5.0, 190, 130, 0, 9], [6.4, 92, 130, 0, 9], [7.2, 92, 130, 0, 9], [8.0, 75, 178, 90, 9], [8.2, 75, 178, 90, 9], [9.6, 75, 178, 90, 142]])],
      [58, AZUL, K([[0, 262, 214, 25, 9], [1.2, 262, 214, 25, 9], [2.3, 209, 130, 0, 9], [4.4, 210, 130, 0, 9], [5.0, 210, 130, 0, 9], [6.4, 308, 130, 0, 9], [7.2, 308, 130, 0, 9], [8.0, 265, 178, 90, 9], [8.2, 265, 178, 90, 9], [9.6, 265, 178, 90, 142]])],
      [32, VERM, K([[0, 266, 112, 40, 9], [1.2, 266, 112, 40, 9], [2.3, 209, 236, 0, 9], [4.4, 210, 236, 0, 9], [5.0, 210, 236, 0, 9], [6.4, 308, 236, 0, 9], [7.2, 308, 236, 0, 9], [8.0, 333, 178, 90, 9], [8.2, 333, 178, 90, 9], [9.6, 333, 178, 90, 142]])],
      [32, AZUL, K([[0, 138, 238, -35, 9], [1.2, 138, 238, -35, 9], [2.3, 191, 236, 0, 9], [4.4, 190, 236, 0, 9], [5.0, 190, 236, 0, 9], [6.4, 92, 236, 0, 9], [7.2, 92, 236, 0, 9], [8.0, 143, 178, 90, 9], [8.2, 143, 178, 90, 9], [9.6, 143, 178, 90, 142]])]
    ];
    function pos(k, t) {
      if (t <= k[0][0]) return k[0].slice(1);
      for (var i = 1; i < k.length; i++) if (t <= k[i][0]) { var u = ease((t - k[i - 1][0]) / (k[i][0] - k[i - 1][0])); return [1, 2, 3, 4].map(function (j) { return lerp(k[i - 1][j], k[i][j], u); }); }
      return k[k.length - 1].slice(1);
    }
    /* ponta trocada no crossing-over: cromossomo 0 (cromatide 1) recebe azul; cromossomo 1 (cromatide 0) recebe vermelho */
    var TROCA = { '0-1': AZUL, '1-0': VERM };
    var G = CR.map(function (c, i) {
      var g = el('g', {});
      var ct = [0, 1].map(function (j) {
        var gg = el('g', {}, g);
        el('rect', { x: -4, y: -c[0] / 2, width: 8, height: c[0], rx: 4, style: 'fill:' + c[1] }, gg);
        var ponta = TROCA[i + '-' + j] ? el('path', { d: 'M-4 ' + (c[0] * .12) + ' H4 V' + (c[0] / 2 - 4) + ' A4 4 0 0 1 -4 ' + (c[0] / 2 - 4) + 'Z', style: 'fill:' + TROCA[i + '-' + j] }, gg) : null;
        return [gg, ponta];
      });
      var cen = el('circle', { r: 5, style: 'fill:' + c[1] + ';stroke:#4a3434;stroke-width:1' }, g);   /* centromero */
      return [g, ct, cen];
    });
    /* rotulos no desenho */
    var rCO = tx(226, 160, 'crossing-over', 'font-size:14px;font-weight:700;fill:var(--ad-t)');
    var rCOl = el('path', { d: 'M224 156 L204 144', style: 'fill:none;stroke:var(--ad-t);stroke-width:1.6' });
    var rBiv = tx(226, 240, 'bivalente', 'font-size:14px;font-weight:600;' + TINTA), rBiv2 = tx(226, 257, '(tétrade)', 'font-size:13px;' + LAP);
    var rPol = tx(200, 345, '', 'font-size:14px;font-weight:600;text-anchor:middle;' + TINTA);

    /* ---------- painel ---------- */
    var PX = 420;
    var pNome = tx(PX, 38, '', 'font-size:22px;font-weight:700;' + TINTA);
    var pL = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return tx(PX, 66 + i * 19, '', 'font-size:14.5px;' + TINTA); });
    el('rect', { x: PX - 8, y: 246, width: 226, height: 98, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 9%,transparent)' });
    var iCel = tx(PX, 270, '', 'font-size:14px;' + TINTA), iPl = tx(PX, 292, '', 'font-size:14px;' + TINTA), iCr = tx(PX, 314, '', 'font-size:14px;' + TINTA), iN = tx(PX, 336, 'Neste esquema: 2n = 4, n = 2', 'font-size:13px;' + LAP);
    var FASES = [
      [0, 'Prófase I', 'Leptóteno: os cromossomos, já duplicados na fase S, se condensam.'],
      [1.2, 'Prófase I', 'Zigóteno: cada cromossomo emparelha com o seu homólogo (sinapse). Cada par forma um bivalente, ou tétrade: 4 cromátides. Nº de bivalentes = n = 2.'],
      [2.4, 'Prófase I', 'Paquíteno: crossing-over. Cromátides NÃO irmãs dos homólogos trocam pedaços. No diplóteno os cruzamentos (quiasmas) ficam visíveis.'],
      [3.9, 'Metáfase I', 'Os bivalentes se alinham no meio da célula, cada homólogo voltado para um polo.'],
      [5.0, 'Anáfase I', 'Os HOMÓLOGOS se separam e migram ainda DUPLICADOS: 2 por polo aqui (em 2n = 8 seriam 4). No homem, é aqui que X e Y se separam.'],
      [6.4, 'Telófase I', 'Duas células n, com os cromossomos ainda duplicados (2 cromátides cada).'],
      [7.2, 'Prófase II', 'Sem nova duplicação do DNA, os cromossomos (ainda duplicados) se preparam para a 2ª divisão.'],
      [8.0, 'Metáfase II', 'Cromossomos alinhados no meio, cromátides ainda unidas. O ovócito II fica parado nesta fase até a fecundação.'],
      [8.2, 'Anáfase II', 'As CROMÁTIDES-IRMÃS se separam: cada uma passa a ser um cromossomo simples.'],
      [9.6, 'Telófase II', 'Quatro células n, com cromossomos simples e geneticamente diferentes entre si.'],
      [10.6, 'Resultado', '4 células n. Nos animais são gametas; nas plantas, esporos, formados na antera e no óvulo da flor.']
    ].map(function (f) { return [f[0], f[1], quebra(f[2], 29)]; });

    function quebraF(s, n) { var w = s.split(' '), L = [], c = ''; w.forEach(function (p) { if ((c + ' ' + p).trim().length > n) { L.push(c); c = p; } else c = (c + ' ' + p).trim(); }); if (c) L.push(c); return L; }
    var FIMG = document.createElementNS('http://www.w3.org/2000/svg', 'g'), CARD = { x: 410, y: 10, w: 226, n: 26 };
    function cartao(c) {   /* cartao do tamanho do texto */
      while (FIMG.firstChild) FIMG.removeChild(FIMG.firstChild);
      var L = quebraF(PQ[qid] || '', c.n), h = 46 + L.length * 21;
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect'); [['x', c.x], ['y', c.y], ['width', c.w], ['height', h], ['rx', 12]].forEach(function (a) { r.setAttribute(a[0], a[1]); }); r.setAttribute('style', 'fill:var(--folha,#fff);stroke:var(--ad-c);stroke-width:1.5'); FIMG.appendChild(r);
      [['Por isso a resposta é', 'font-size:16px;font-weight:700;fill:var(--ad-t)']].concat(L.map(function (s) { return [s, 'font-size:15px;fill:var(--tinta)']; })).forEach(function (l, k) { var e = document.createElementNS('http://www.w3.org/2000/svg', 'text'); e.setAttribute('x', c.x + 14); e.setAttribute('y', c.y + 24 + k * 21 + (k ? 4 : 0)); e.setAttribute('style', l[1]); e.textContent = l[0]; FIMG.appendChild(e); });
    }
    var FRZ = { P0a240e7: 6.0, P831b9bb: 6.0, W40d9a57: 8.1, W8a118de: 3.55 }[qid] || 11.999;
    cartao(CARD);
    svg.appendChild(FIMG);
    return function (t0) {
      var fim = PQ[qid] && t0 >= 12, t = fim ? FRZ : Math.min(t0, 11.999); FIMG.style.display = fim ? '' : 'none';
      /* celulas */
      var s1 = seg(t, 6.4, 7.2), s2 = seg(t, 9.6, 10.6);
      cel.forEach(function (c, i) {
        var lado = i < 2 ? -1 : 1, cima = i % 2 ? 1 : -1;
        var x = lerp(200, 200 + lado * 95, s1), rx = lerp(182, 93, s1), y = lerp(178, 178 + cima * 70, s2), ry = lerp(lerp(147, 142, s1), 67, s2);
        c.forEach(function (e) { e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); e.setAttribute('rx', rx.toFixed(1)); e.setAttribute('ry', ry.toFixed(1)); });
        nucF[i].setAttribute('cx', x.toFixed(1)); nucF[i].setAttribute('cy', y.toFixed(1)); nucF[i].style.opacity = seg(t, 10.1, 10.8);
      });
      envI.style.opacity = 1 - seg(t, 3.6, 4.2);
      /* cromossomos */
      var P = CR.map(function (c) { return pos(c[2], t); });
      var co = seg(t, 2.7, 3.6);
      G.forEach(function (g, i) {
        var p = P[i];
        g[0].setAttribute('transform', 'translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + p[2].toFixed(1) + ')');
        g[1].forEach(function (ct, j) {
          ct[0].setAttribute('transform', 'translate(' + ((j ? 1 : -1) * p[3] / 2).toFixed(1) + ' 0)');
          if (ct[1]) ct[1].style.opacity = co;
        });
        g[2].style.opacity = p[3] < 12 ? 1 : 0;
      });
      /* fuso e placa */
      var d = '', fI = t > 3.9 && t < 6.6 ? Math.min(seg(t, 3.9, 4.4), 1 - seg(t, 6.2, 6.6)) : 0, fII = t > 7.4 && t < 10 ? Math.min(seg(t, 7.4, 8), 1 - seg(t, 9.6, 10)) : 0;
      if (fI > 0) P.forEach(function (p, i) { var pl = i === 0 || i === 3 ? 30 : 370; d += 'M' + pl + ' 178 L' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' '; });
      if (fII > 0) P.forEach(function (p) { var cx = p[0] < 200 ? 105 : 295; [-1, 1].forEach(function (s) { d += 'M' + cx + ' ' + (178 + s * 128) + ' L' + p[0].toFixed(1) + ' ' + (p[1] + s * p[3] / 2).toFixed(1) + ' '; }); });
      fuso.setAttribute('d', d || 'M0 0'); fuso.style.opacity = Math.max(fI, fII);
      var plI = t > 4 && t < 5.2 ? Math.min(seg(t, 4, 4.4), 1 - seg(t, 5, 5.2)) : 0, plII = t > 7.8 && t < 8.4 ? Math.min(seg(t, 7.8, 8), 1 - seg(t, 8.2, 8.4)) : 0;
      if (plI > 0) { placa.setAttribute('x1', 200); placa.setAttribute('x2', 200); placa.setAttribute('y1', 70); placa.setAttribute('y2', 290); placa.style.opacity = plI; }
      else if (plII > 0) { placa.setAttribute('x1', 30); placa.setAttribute('x2', 370); placa.setAttribute('y1', 178); placa.setAttribute('y2', 178); placa.style.opacity = plII; }
      else placa.style.opacity = 0;
      /* rotulos no desenho */
      var oCO = t > 2.5 && t < 4.4 ? Math.min(seg(t, 2.5, 2.9), 1 - seg(t, 4.0, 4.4)) : 0;
      rCO.style.opacity = oCO; rCOl.style.opacity = oCO;
      var oB = t > 2.0 && t < 4.4 ? Math.min(seg(t, 2.0, 2.4), 1 - seg(t, 4.0, 4.4)) : 0;
      rBiv.style.opacity = oB; rBiv2.style.opacity = oB;
      rPol.textContent = t >= 5.2 && t < 6.6 ? 'cada polo recebe 2 cromossomos DUPLICADOS' : t >= 8.4 && t < 9.8 ? 'cada polo recebe 2 cromossomos SIMPLES' : '';
      /* painel */
      var f = FASES[0]; FASES.forEach(function (x) { if (t >= x[0]) f = x; });
      pNome.textContent = f[1];
      pL.forEach(function (e, i) { var s = f[2][i] || ''; e.textContent = s; e.style.fontWeight = /[A-ZÁÉ]{4,}/.test(s) ? 700 : 400; });
      if (fim && FIMG.firstChild && true) { pNome.textContent = ''; pL.forEach(function (e) { e.textContent = ''; }); }   /* o cartao substitui o texto do painel */
      var nc = t < 7.0 ? 1 : t < 10.4 ? 2 : 4;
      iCel.textContent = 'Células: ' + nc;
      iPl.textContent = 'Cada célula: ' + (t < 7.0 ? '2n (com pares)' : 'n (um de cada par)');
      iCr.textContent = 'Cromossomos: ' + (t < 8.4 ? 'duplicados' : 'simples');
    };
  }
};
VIS.liga('meiose-fases', ['P0a240e7', 'P1f6aed6', 'W8013f87', 'W8a118de', 'W40d9a57', 'P831b9bb']);
