/* Sistema ABO: aglutinogenios (antigenos da hemacia), aglutininas (anticorpos do plasma) e aglutinacao */
VIS.def['abo-aglutinacao'] = {
  tit: 'Sistema ABO: quando o anticorpo do plasma encontra o antígeno da hemácia, ela aglutina',
  tipo: 'anim', dur: 18,
  marcas: [[0, 'anti-A + hemácias A'], [5, 'anti-A + hemácias B'], [10, 'Transfusão'], [15, 'Resposta']],
  fontes: [
    'OpenStax Anatomy and Physiology 2e, 18.6 Blood Typing — https://openstax.org/books/anatomy-and-physiology-2e/pages/18-6-blood-typing'
  ],
  cred: 'Animação feita para o app (esquema fora de escala; os antígenos e anticorpos são símbolos).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    svg.setAttribute('viewBox', '0 0 640 350');
    var CA = '#f2c230', CB = '#5aa9e6', VERM = '#c0392b', OK = 'var(--ad-t)';
    /* hemacia com antigenos: tipo 'A', 'B', 'AB' ou 'O' */
    function hemacia(pai, r, tipo) {
      var g = el('g', {}, pai);
      el('circle', { r: r, style: 'fill:#c8463d;stroke:#8e2a23;stroke-width:1.5' }, g);
      el('circle', { r: r * .45, style: 'fill:#d9675d' }, g);
      var n = 8;
      for (var k = 0; k < n; k++) {
        var a = k * 2 * Math.PI / n + .2, x = (r + 3) * Math.cos(a), y = (r + 3) * Math.sin(a);
        var qual = tipo === 'AB' ? (k % 2 ? 'B' : 'A') : tipo;
        if (qual === 'A') el('path', { d: 'M' + (x + 4.5 * Math.cos(a)) + ' ' + (y + 4.5 * Math.sin(a)) + ' L' + (x + 4 * Math.cos(a + 2.1)) + ' ' + (y + 4 * Math.sin(a + 2.1)) + ' L' + (x + 4 * Math.cos(a - 2.1)) + ' ' + (y + 4 * Math.sin(a - 2.1)) + 'Z', style: 'fill:' + CA + ';stroke:#8a6a00;stroke-width:.8' }, g);
        else if (qual === 'B') el('circle', { cx: x, cy: y, r: 3.4, style: 'fill:' + CB + ';stroke:#1f5f93;stroke-width:.8' }, g);
      }
      return g;
    }
    /* anticorpo em Y */
    function anti(pai, cor, esc) {
      return el('path', { d: 'M0 9 V0 L-6 -7 M0 0 L6 -7', transform: 'scale(' + (esc || 1) + ')', style: 'fill:none;stroke:' + cor + ';stroke-width:3;stroke-linecap:round;stroke-linejoin:round' }, pai);
    }
    function poe(g, x, y, rot) { g.setAttribute('transform', 'translate(' + x.toFixed(1) + ',' + y.toFixed(1) + ')' + (rot ? ' rotate(' + rot.toFixed(0) + ')' : '')); }
    /* ---------- tabela de referencia (esquerda) ---------- */
    tx({ x: 16, y: 26, 'class': 'v-lab' }, 'Hemácias (aglutinogênios)');
    var cols = [['A', 46], ['B', 118], ['AB', 190], ['O', 262]];
    var colG = [];
    cols.forEach(function (c) {
      var g = el('g', {});
      el('rect', { x: c[1] - 33, y: 36, width: 66, height: 80, rx: 10, style: 'fill:transparent' }, g);
      el('rect', { x: c[1] - 33, y: 144, width: 66, height: 74, rx: 10, style: 'fill:transparent' }, g);
      tx({ x: c[1], y: 56, 'text-anchor': 'middle', style: 'font-size:17px;font-weight:700;fill:var(--tinta)' }, c[0], g);
      var h = hemacia(g, 17, c[0]); poe(h, c[1], 88);
      colG.push(g);
    });
    tx({ x: 16, y: 136, 'class': 'v-lab' }, 'Plasma (aglutininas)');
    function antiRot(x, y, cor, nome) { var a = anti(svg, cor, 1.3); a.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(1.3)'); tx({ x: x, y: y + 30, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:var(--tinta)' }, nome); }
    antiRot(46, 166, CB, 'anti-B'); antiRot(118, 166, CA, 'anti-A');
    tx({ x: 190, y: 172, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'nenhuma');
    var aO1 = anti(svg, CA, 1.3); aO1.setAttribute('transform', 'translate(250,166) scale(1.3)');
    var aO2 = anti(svg, CB, 1.3); aO2.setAttribute('transform', 'translate(274,166) scale(1.3)');
    tx({ x: 262, y: 196, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:var(--tinta)' }, 'anti-A e');
    tx({ x: 262, y: 211, 'text-anchor': 'middle', style: 'font-size:13px;font-weight:600;fill:var(--tinta)' }, 'anti-B');
    var regra = [];
    for (var i = 0; i < 5; i++) regra.push(tx({ x: 16, y: 252 + i * 20, 'class': 'v-sub' + (i === 4 ? ' forte' : '') }));
    /* ---------- lamina (direita) ---------- */
    var titulo = tx({ x: 476, y: 26, 'text-anchor': 'middle', 'class': 'v-rot' });
    var gota = el('ellipse', { cx: 476, cy: 150, rx: 140, ry: 102, style: 'fill:color-mix(in srgb,#e9c46a 16%,transparent);stroke:var(--linha);stroke-width:1.5' });
    var gLam = el('g', {});
    var ini = [[400, 98], [470, 82], [548, 104], [418, 166], [500, 150], [560, 186], [452, 212], [528, 228]];
    var grumo = [[420, 128], [446, 112], [452, 142], [424, 156], [520, 168], [546, 154], [548, 184], [522, 196]];
    var celA = [], celB = [], celO = [];
    ini.forEach(function () { celA.push(hemacia(gLam, 15, 'A')); celB.push(hemacia(gLam, 15, 'B')); var o = hemacia(gLam, 15, 'O'); o.style.display = 'none'; celO.push(o); });
    var ys = [];
    var yIni = [[352, 70], [602, 92], [360, 220], [598, 230], [476, 50], [476, 258], [345, 150], [610, 160]];
    var yFim = [[434, 134], [436, 120], [438, 148], [536, 178], [534, 162], [534, 190], [450, 126], [532, 172]];
    for (i = 0; i < 8; i++) { var gy = el('g', {}, gLam); anti(gy, CA, 1.2); ys.push(gy); }
    var resT = tx({ x: 476, y: 290, 'text-anchor': 'middle', 'class': 'v-fase' }), resS = tx({ x: 476, y: 316, 'text-anchor': 'middle', 'class': 'v-sub' }), resS2 = tx({ x: 476, y: 336, 'text-anchor': 'middle', 'class': 'v-sub' });
    /* ---------- transfusao (cena 3) ---------- */
    var gTr = el('g', {});
    var doad = [['O', true], ['A', true], ['B', false], ['AB', false]];
    doad.forEach(function (d, k) {
      var x = 372 + k * 70;
      var h = hemacia(gTr, 17, d[0]); poe(h, x, 128);
      tx({ x: x, y: 92, 'text-anchor': 'middle', style: 'font-size:17px;font-weight:700;fill:var(--tinta)' }, d[0], gTr);
      tx({ x: x, y: 176, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:' + (d[1] ? OK : VERM) }, d[1] ? 'serve' : 'aglutina', gTr);
    });
    tx({ x: 476, y: 60, 'text-anchor': 'middle', style: 'font-size:13px;fill:var(--lapis)' }, 'hemácias do doador', gTr);
    tx({ x: 476, y: 214, 'text-anchor': 'middle', 'class': 'v-sub' }, 'O anti-B do receptor ataca toda', gTr);
    tx({ x: 476, y: 234, 'text-anchor': 'middle', 'class': 'v-sub' }, 'hemácia que tenha antígeno B.', gTr);
    function ease(u) { return u < 0 ? 0 : u > 1 ? 1 : u * u * (3 - 2 * u); }
    function lin(a, b, u) { return a + (b - a) * u; }
    var desenha0 = function (t) {
      var cena = t < 5 ? 1 : t < 10 ? 2 : 3, tl = t - (cena - 1) * 5;
      gLam.style.display = gota.style.display = cena < 3 ? '' : 'none';
      gTr.style.display = cena === 3 ? '' : 'none';
      colG.forEach(function (g, k) {
        /* destaca so o que esta na lamina: a hemacia usada e o anticorpo do plasma */
        var cima = (cena === 1 && k === 0) || (cena === 2 && k === 1), baixo = (cena < 3 && k === 1) || (cena === 3 && k === 0);
        var H = 'color-mix(in srgb,var(--ad-c) 14%,transparent)';
        g.childNodes[0].style.fill = cima ? H : 'transparent'; g.childNodes[1].style.fill = baixo ? H : 'transparent';
      });
      var R;
      if (cena === 3) {
        titulo.textContent = 'Receptor do grupo A (plasma com anti-B)';
        resT.textContent = 'Servem: O e A';
        resS.textContent = 'hemácias sem antígeno B';
        resS2.textContent = '';
        R = ['Na transfusão, compare as', 'hemácias do DOADOR com as', 'aglutininas do RECEPTOR.', 'O anti-B do receptor', 'acha alvo nessa hemácia?'];
      } else {
        var alvo = cena === 1;
        var chega = ease((tl - .6) / 1.6), junta = alvo ? ease((tl - 2.2) / 1.6) : 0;
        titulo.textContent = 'Plasma com anti-A + hemácias ' + (alvo ? 'A' : 'B');
        for (var k = 0; k < 8; k++) {
          var p = alvo ? [lin(ini[k][0], grumo[k][0], junta), lin(ini[k][1], grumo[k][1], junta)] : [ini[k][0] + 4 * Math.sin(tl * 1.3 + k), ini[k][1] + 4 * Math.cos(tl * 1.1 + k)];
          poe(celA[k], p[0], p[1]); poe(celB[k], p[0], p[1]);
          celA[k].style.display = alvo ? '' : 'none'; celB[k].style.display = alvo ? 'none' : '';
          var yx, yy, rot;
          if (alvo) { yx = lin(yIni[k][0], yFim[k][0], chega); yy = lin(yIni[k][1], yFim[k][1], chega); rot = lin(k * 40, (k % 2 ? 90 : -90), chega); }
          else { var u = (tl * .18 + k / 8) % 1, ang = u * 2 * Math.PI; yx = 476 + 112 * Math.cos(ang + k) * (.55 + .4 * (k % 3) / 2); yy = 150 + 78 * Math.sin(ang + k) * (.55 + .4 * ((k + 1) % 3) / 2); rot = tl * 40 + k * 45; }
          poe(ys[k], yx, yy, rot);
          ys[k].style.opacity = Math.min(1, tl / .6).toFixed(2);
        }
        if (alvo) {
          resT.textContent = junta > .5 ? 'AGLUTINA' : ''; resT.style.fill = VERM;
          resS.textContent = junta > .5 ? 'o anti-A liga hemácias vizinhas' : chega > .5 ? 'o anti-A reconhece o antígeno A' : '';
          resS2.textContent = junta > .5 ? 'e forma grumos' : '';
        } else {
          resT.textContent = tl > 2.6 ? 'Não aglutina' : ''; resT.style.fill = 'var(--tinta)';
          resS.textContent = tl > 2.6 ? 'o anti-A não acha antígeno A:' : '';
          resS2.textContent = tl > 2.6 ? 'as hemácias continuam soltas' : '';
        }
        R = ['Aglutina quando a aglutinina', 'do plasma encontra o', 'aglutinogênio que ela reconhece.', 'Ninguém tem anticorpo contra', 'o próprio antígeno.'];
      }
      if (cena === 3) resT.style.fill = 'var(--tinta)';
      for (var j = 0; j < 5; j++) regra[j].textContent = R[j];
    };
    /* etapa final: so a resposta da questao aberta (qid) */
    var RESP = {"Pbb379d6": {"s": [3.6, 4.95], "t": "Plasma de Pablo + hemácias A", "a": "Resposta B", "b": "aglutinou A e não B: só tem anti-A,", "c": "logo tem antígeno B: grupo B."}, "W2402bec": {"o": 1, "s": [8.2, 9.95], "t": "Anti-A do técnico + hemácias do cliente", "a": "Resposta D: O", "b": "não aglutinou: sem antígeno A; o soro", "c": "dele aglutinou hemácias B: tem anti-B."}, "Pd6b685b": {"s": [12, 14.9], "t": "Receptor do grupo A (plasma com anti-B)", "a": "Resposta B: 40%", "b": "servem O e A: 2 doadores em 5,", "c": "2/5 = 40%."}}, R = RESP[qid];
    return function (t) {
      celO.forEach(function (o) { o.style.display = 'none'; });
      if (t < 15 || !R) { desenha0(Math.min(t, 15 - .01)); return; }
      desenha0(R.s[0] + ((t - 15) % (R.s[1] - R.s[0])));
      celO.forEach(function (o, k) { o.style.display = 'none'; });
      if (R.o) celB.forEach(function (b, k) { celO[k].setAttribute('transform', b.getAttribute('transform')); celO[k].style.display = ''; b.style.display = 'none'; });   /* o cliente e' O: hemacias sem antigeno */
      if (R.o) { var HL = 'color-mix(in srgb,var(--ad-c) 14%,transparent)'; colG[1].childNodes[0].style.fill = 'transparent'; colG[3].childNodes[0].style.fill = HL; colG[1].childNodes[1].style.fill = HL; }   /* cliente O + anti-A do tecnico */
      titulo.textContent = R.t; resT.textContent = R.a; resT.style.fill = 'var(--ad-t)'; resS.textContent = R.b; resS2.textContent = R.c;
    };
  }
};
VIS.liga('abo-aglutinacao', ['Pbb379d6', 'Pd6b685b', 'W2402bec']);
