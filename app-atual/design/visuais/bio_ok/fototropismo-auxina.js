VIS.def['fototropismo-auxina'] = {
  tit: 'Fototropismo: auxina no lado sombreado, curvatura para a luz',
  tipo: 'anim', dur: 11, cred: 'Animação feita para o app (coleóptilo de gramínea em esquema, fora de escala; poucas células desenhadas).',
  fontes: ['OpenStax Biology 2e, 30.6 Plant Sensory Systems and Responses (fototropinas, luz azul, IAA no lado sombreado) — https://openstax.org/books/biology-2e/pages/30-6-plant-sensory-systems-and-responses', 'Wikipedia (en), Phototropism (fototropinas: receptores de luz azul; auxina vai para o lado sombreado; células desse lado se alongam) — https://en.wikipedia.org/wiki/Phototropism'],
  marcas: [[0, 'Luz lateral'], [2, 'Auxina migra'], [4.6, 'Alongamento'], [8.6, 'Curvatura']],
  nota: 'As fototropinas absorvem luz azul (comprimento de onda curto e frequência alta, perto da ponta violeta do visível). Elas fazem a auxina se acumular no lado sombreado, onde as células se alongam (distensão celular, não divisão) mais que as do lado iluminado.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 2, T2 = 4.6, T3 = 8.6, NS_ = 7, W = 40, H0 = 33, BX = 150, BY = 322, AZ = '#2f6fd0';
    /* solo */
    el('rect', { x: 40, y: BY, width: 260, height: 14, rx: 4, style: 'fill:#b89b74' });
    /* luz */
    var raios = [];
    for (var i = 0; i < 5; i++) raios.push(el('path', { style: 'fill:none;stroke:' + AZ + ';stroke-width:3;stroke-linecap:round;stroke-linejoin:round' }));
    var luzT = tx({ x: 380, y: 226, 'text-anchor': 'end', style: 'font-size:14.5px;font-weight:700;fill:' + AZ }, 'luz azul de um lado só');
    var sombT = tx({ x: 20, y: 120, style: 'font-size:13.5px;font-weight:600;fill:var(--lapis)' }, 'lado');
    var sombT2 = tx({ x: 20, y: 136, style: 'font-size:13.5px;font-weight:600;fill:var(--lapis)' }, 'sombreado');
    var ilumT = tx({ style: 'font-size:13.5px;font-weight:600;fill:' + AZ }, 'lado iluminado');
    /* celulas */
    var cel = [];
    for (i = 0; i < NS_; i++) cel.push([el('path', { style: 'fill:#cfe6b0;stroke:#5f8a3a;stroke-width:1.5' }), el('path', { style: 'fill:#cfe6b0;stroke:#5f8a3a;stroke-width:1.5' })]);
    var ponta = el('path', { style: 'fill:#cfe6b0;stroke:#5f8a3a;stroke-width:1.5' });
    var foto = el('path', { style: 'fill:none;stroke:' + AZ + ';stroke-width:5;stroke-linecap:round' });
    var fotoT = tx({ style: 'font-size:13.5px;font-weight:700;fill:' + AZ }, 'fototropinas');
    var aux = []; for (i = 0; i < 16; i++) aux.push(el('circle', { r: 3.6, style: 'fill:#d0532f;stroke:#fff;stroke-width:1' }));
    var auxT = tx({ style: 'font-size:13.5px;font-weight:700;fill:#b4442f' }, 'auxina');
    var alT1 = tx({ style: 'font-size:13.5px;font-weight:600;fill:var(--tinta)' }), alT2 = tx({ style: 'font-size:13.5px;font-weight:600;fill:var(--tinta)' });
    /* painel */
    var px = 402;
    var fase = tx({ x: px, y: 110, style: 'font-size:19px;font-weight:700;fill:var(--tinta)' });
    var s = [0, 1, 2, 3].map(function (k) { return tx({ 'class': 'v-sub', x: px, y: 134 + k * 19 }); });
    /* espectro */
    var gd = el('defs', {}), lg = el('linearGradient', { id: 'fta-esp', x1: 0, x2: 1, y1: 0, y2: 0 }, gd);
    [['0', '#7a3fc0'], ['.18', '#2f6fd0'], ['.36', '#2aa6a0'], ['.5', '#58b03a'], ['.62', '#e5d22c'], ['.78', '#ef8a22'], ['1', '#d23a2a']].forEach(function (c) { el('stop', { offset: c[0], 'stop-color': c[1] }, lg); });
    var ex = px, ew = 222, ey = 262;
    el('rect', { x: ex, y: ey, width: ew, height: 14, rx: 3, style: 'fill:url(#fta-esp)' });
    [400, 500, 600, 700].forEach(function (n) { var x = ex + ew * (n - 400) / 300; el('line', { x1: x, x2: x, y1: ey + 14, y2: ey + 19, style: 'stroke:var(--lapis);stroke-width:1.2' }); tx({ x: x, y: ey + 33, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, String(n)); });
    tx({ x: ex, y: ey + 50, style: 'font-size:13px;fill:var(--lapis)' }, 'comprimento de onda (nm)');
    el('path', { d: 'M' + (ex + ew * 30 / 300) + ' ' + (ey - 6) + ' v-6 H' + (ex + ew * 90 / 300) + ' v6', style: 'fill:none;stroke:' + AZ + ';stroke-width:2' });
    tx({ x: ex, y: ey - 18, style: 'font-size:13.5px;font-weight:700;fill:' + AZ }, 'azul: onda curta, frequência alta');
    function P(x, y) { return x.toFixed(1) + ' ' + y.toFixed(1); }
    return function (t) {
      /* luz */
      var ul = ease(t / .8);
      raios.forEach(function (r, k) { var y = 92 + k * 26, x1 = 380, x2 = 380 - 70 * ul; r.setAttribute('d', 'M' + x1 + ' ' + y + ' H' + x2.toFixed(1) + ' m9 -6 l-9 6 l9 6'); r.style.opacity = ul.toFixed(2); });
      /* geometria do coleoptilo */
      var g = ease((t - T2) / (T3 - T2 - .4));
      var pts = [], th = 0, cx = BX, cy = BY;
      for (var i = 0; i < NS_; i++) {
        var zona = i >= 2 ? 1 : .25;   /* a curvatura ocorre na regiao de alongamento, abaixo do apice */
        var Ls = H0 * (1 + .3 * g * zona), Ri = H0 * (1 + .07 * g * zona);
        var dth = (Ls - Ri) / W, len = (Ls + Ri) / 2;
        var nx = Math.cos(th), ny = Math.sin(th);   /* normal para a direita */
        var BL = [cx - nx * W / 2, cy - ny * W / 2], BR = [cx + nx * W / 2, cy + ny * W / 2];
        var thm = th + dth / 2; cx += len * Math.sin(thm); cy -= len * Math.cos(thm); th += dth;
        nx = Math.cos(th); ny = Math.sin(th);
        var TL = [cx - nx * W / 2, cy - ny * W / 2], TR = [cx + nx * W / 2, cy + ny * W / 2], TC = [cx, cy], BC = [(BL[0] + BR[0]) / 2, (BL[1] + BR[1]) / 2];
        pts.push({ BL: BL, BR: BR, TL: TL, TR: TR, TC: TC, BC: BC, th: th });
        cel[i][0].setAttribute('d', 'M' + P(BL[0], BL[1]) + ' L' + P(BC[0], BC[1]) + ' L' + P(TC[0], TC[1]) + ' L' + P(TL[0], TL[1]) + 'Z');
        cel[i][1].setAttribute('d', 'M' + P(BC[0], BC[1]) + ' L' + P(BR[0], BR[1]) + ' L' + P(TR[0], TR[1]) + ' L' + P(TC[0], TC[1]) + 'Z');
        var aux2 = cl((t - T1 - .6) / 1.6) * zona;
        cel[i][0].style.fill = 'color-mix(in srgb,#e9a07f ' + Math.round(55 * aux2) + '%,#cfe6b0)';
      }
      var top = pts[NS_ - 1], dx = Math.sin(top.th), dy = -Math.cos(top.th), R = W / 2;
      ponta.setAttribute('d', 'M' + P(top.TL[0], top.TL[1]) + ' A' + R + ' ' + (R * 1.25) + ' ' + (top.th * 180 / Math.PI).toFixed(1) + ' 0 1 ' + P(top.TR[0], top.TR[1]) + ' Z');
      var tipX = top.TC[0] + dx * R * 1.25, tipY = top.TC[1] + dy * R * 1.25;
      /* fototropinas: lado iluminado do apice */
      var nx2 = Math.cos(top.th), ny2 = Math.sin(top.th), fx = top.TC[0] + nx2 * R * .78 + dx * 12, fy = top.TC[1] + ny2 * R * .78 + dy * 12;
      foto.setAttribute('d', 'M' + P(fx - dx * 9, fy - dy * 9) + ' L' + P(fx + dx * 9, fy + dy * 9)); foto.style.opacity = cl((t - .6) / .5) * (t < T2 + .6 ? 1 : .5);
      fotoT.setAttribute('x', (fx + 16).toFixed(1)); fotoT.setAttribute('y', (fy - 16).toFixed(1)); fotoT.style.opacity = t > .8 && t < T2 + .6 ? 1 : 0;
      ilumT.setAttribute('x', 208); ilumT.setAttribute('y', 290);
      /* auxina */
      function noTecido(seg, f, lat) { var q = pts[seg], ax = q.BL[0] + (q.BR[0] - q.BL[0]) * lat, ay = q.BL[1] + (q.BR[1] - q.BL[1]) * lat, bx = q.TL[0] + (q.TR[0] - q.TL[0]) * lat, by = q.TL[1] + (q.TR[1] - q.TL[1]) * lat; return [ax + (bx - ax) * f, ay + (by - ay) * f]; }
      aux.forEach(function (a, k) {
        var nasc = .4 + (k % 8) * .12, u = cl((t - T1 - (k % 8) * .12) / 1.7);
        var alvoSeg = 2 + (k % 5), alvoF = ((k * 7) % 10) / 10 * .8 + .1;
        var latIni = .3 + ((k * 3) % 5) * .1, p;
        if (t < nasc) { a.style.opacity = 0; return; }
        if (u < .3) { var v = u / .3; p = noTecido(NS_ - 1, .7 - .1 * (k % 3), latIni + (.18 - latIni) * ease(v)); }
        else {
          var w = ease((u - .3) / .7), segF = (NS_ - 1 + .65) + (alvoSeg + alvoF - (NS_ - 1 + .65)) * w, si = Math.max(0, Math.min(NS_ - 1, Math.floor(segF)));
          p = noTecido(si, segF - si, .18 + .06 * (k % 2));
        }
        a.setAttribute('cx', p[0].toFixed(1)); a.setAttribute('cy', p[1].toFixed(1)); a.style.opacity = cl((t - nasc) / .3);
      });
      var ap = noTecido(NS_ - 1, .9, 0);
      auxT.setAttribute('x', (ap[0] - 70).toFixed(1)); auxT.setAttribute('y', (ap[1] - 10).toFixed(1)); auxT.style.opacity = t > T1 && t < T2 + .4 ? 1 : 0;
      var am = noTecido(3, .5, 0);
      alT1.setAttribute('x', 20); alT1.setAttribute('y', (am[1] + 46).toFixed(1)); alT2.setAttribute('x', 20); alT2.setAttribute('y', (am[1] + 62).toFixed(1));
      alT1.textContent = t >= T2 ? 'células se' : ''; alT2.textContent = t >= T2 ? 'alongam mais' : '';
      var nome, L;
      if (t < T1) { nome = 'Luz de um lado só'; L = ['as fototropinas do ápice', 'absorvem a luz azul', 'que chega pela direita', '']; }
      else if (t < T2) { nome = 'Auxina vai para a sombra'; L = ['a auxina, feita no ápice,', 'é transportada para o lado', 'sombreado e desce pelo', 'caule']; }
      else if (t < T3) { nome = 'Alongamento desigual'; L = ['no lado sombreado, com mais', 'auxina, as células se', 'alongam (distensão) mais', 'que no lado iluminado']; }
      else { nome = 'Curva para a luz'; L = ['o lado que cresce mais', 'empurra o caule para o', 'lado oposto: fototropismo', 'positivo']; }
      var PR = { P99abd6f: ['luz azul: onda curta, alta', 'frequência; a auxina vai', 'para o lado sombreado.', 'Por isso a resposta é A.'], Wcf1f8e0: ['a auxina distende (alonga)', 'as células do lado não', 'iluminado.', 'Por isso a resposta é A.'] }[qid];
      if (PR && t >= 9.6) { nome = 'Por isso'; L = PR; }
      fase.textContent = nome; s.forEach(function (e, k) { e.textContent = L[k]; var p = /^Por isso/.test(L[k]); e.style.fontWeight = p ? 700 : ''; e.style.fill = p ? 'var(--ad-t)' : ''; });
    };
  }
};
VIS.liga('fototropismo-auxina', ['P99abd6f', 'Wcf1f8e0']);
