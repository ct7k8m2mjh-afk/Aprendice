VIS.def['ciclo-malaria'] = {
  tit: 'Ciclo do Plasmodium: onde ele se multiplica e por que a febre vem em picos',
  tipo: 'anim', dur: 12, cred: 'Animação feita para o app (esquema fora de escala; tempos comprimidos: no P. vivax a fase do fígado leva cerca de 1 a 2 semanas e cada volta nas hemácias, 48 h).',
  fontes: ['CDC DPDx, Malaria (ciclo: esporozoítos, fígado, ciclo nas hemácias, gametócitos, ciclo sexuado no Anopheles; gametócito do P. vivax arredondado) — https://www.cdc.gov/dpdx/malaria/index.html'],
  marcas: [[0, 'Picada'], [1.4, 'Fígado'], [4.2, 'Hemácias'], [8.4, 'Gametócitos']],
  nota: 'No ser humano o parasita só se reproduz de forma assexuada (fígado e hemácias); a reprodução sexuada é no mosquito. Um fármaco que bloqueia a síntese de DNA e RNA (como um inibidor da enzima DHFR) trava justamente essas multiplicações.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(a, s, pai) { var x = el('text', a, pai); x.textContent = s || ''; return x; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var ROXO = '#5b3f8c', T_F = 1.4, T_S = 4.2, PER = 2.1, T_G = 8.4;
    /* faixas */
    el('rect', { x: 6, y: 6, width: 628, height: 76, rx: 10, style: 'fill:color-mix(in srgb,var(--ad-c) 8%,transparent);stroke:var(--linha)' });
    tx({ x: 20, y: 30, style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }, 'No mosquito Anopheles (fêmea)');
    tx({ x: 20, y: 51, style: 'font-size:14px;fill:var(--tinta)' }, 'reprodução SEXUADA: gametas se fundem');
    tx({ x: 20, y: 70, style: 'font-size:14px;fill:var(--lapis)' }, 'hospedeiro definitivo');
    el('rect', { x: 6, y: 92, width: 628, height: 252, rx: 10, style: 'fill:none;stroke:var(--linha)' });
    tx({ x: 66, y: 114, style: 'font-size:15px;font-weight:700;fill:var(--tinta)' }, 'No ser humano: só reprodução ASSEXUADA');
    /* setas entre hospedeiros */
    function seta(d) { return el('path', { d: d, style: 'fill:none;stroke:var(--lapis);stroke-width:2;stroke-linecap:round;stroke-linejoin:round' }); }
    seta('M48 84 V176 m-6 -9 l6 9 l6 -9');
    tx({ x: 58, y: 142, style: 'font-size:13.5px;fill:var(--tinta)' }, 'picada injeta');
    tx({ x: 58, y: 158, style: 'font-size:13.5px;fill:var(--tinta)' }, 'esporozoítos');
    seta('M398 186 V84 m-6 9 l6 -9 l6 9');
    tx({ x: 390, y: 150, 'text-anchor': 'end', style: 'font-size:13.5px;fill:var(--tinta)' }, 'outra picada');
    tx({ x: 390, y: 166, 'text-anchor': 'end', style: 'font-size:13.5px;fill:var(--tinta)' }, 'suga gametócitos');
    seta('M152 222 H196 m-9 -6 l9 6 l-9 6');
    /* figado */
    el('path', { d: 'M28 214 C30 186 70 178 118 184 C150 188 162 200 156 214 C150 232 116 250 84 256 C52 262 26 244 28 214Z', style: 'fill:#a8584a;stroke:#7a3a30;stroke-width:2' });
    var hep = el('circle', { cx: 92, cy: 218, style: 'fill:#e9c2b4;stroke:#7a3a30;stroke-width:1.5' });
    var hepD = []; for (var i = 0; i < 26; i++) hepD.push(el('circle', { r: 2.4, style: 'fill:' + ROXO }));
    tx({ x: 92, y: 282, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:var(--tinta)' }, 'Fígado');
    var hepT1 = tx({ x: 92, y: 300, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--tinta)' }, 'multiplicação assexuada');
    var hepT2 = tx({ x: 92, y: 317, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--lapis)' }, 'sem febre (incubação)');
    var esp = []; for (i = 0; i < 4; i++) esp.push(el('path', { d: 'M-5 0 Q0 -3 5 0', style: 'fill:none;stroke:' + ROXO + ';stroke-width:2.2;stroke-linecap:round' }));
    var merL = []; for (i = 0; i < 6; i++) merL.push(el('circle', { r: 2.6, style: 'fill:' + ROXO }));
    /* hemacias */
    var HX = [236, 292, 348], HY = 222, H = [];
    HX.forEach(function (x) {
      var o = { x: x, g: el('g', {}) };
      o.c = el('circle', { cx: x, cy: HY, r: 22, style: 'fill:#d2685a;stroke:#9b3c32;stroke-width:1.5' }, o.g);
      o.m = el('circle', { cx: x, cy: HY, r: 10, style: 'fill:#e3958a' }, o.g);
      o.anel = el('circle', { cx: x + 4, cy: HY - 3, r: 6, style: 'fill:none;stroke:' + ROXO + ';stroke-width:2' }, o.g);
      o.cres = el('circle', { cx: x, cy: HY, r: 11, style: 'fill:' + ROXO }, o.g);
      o.d = []; for (var k = 0; k < 12; k++) o.d.push(el('circle', { r: 2.6, style: 'fill:' + ROXO }));
      o.tox = []; for (k = 0; k < 6; k++) o.tox.push(el('circle', { r: 2, style: 'fill:#c9a227' }));
      H.push(o);
    });
    tx({ x: 292, y: 270, 'text-anchor': 'middle', style: 'font-size:14px;font-weight:700;fill:var(--tinta)' }, 'Hemácias');
    var hT1 = tx({ x: 292, y: 289, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--tinta)' });
    var hT2 = tx({ x: 292, y: 306, 'text-anchor': 'middle', style: 'font-size:13.5px;fill:var(--lapis)' });
    var gamT = tx({ x: 348, y: 186, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:700;fill:' + ROXO });
    var gamV = el('circle', { r: 8, style: 'fill:' + ROXO });
    /* no mosquito: fusao dos gametas */
    var fx = 520, fy = 44;
    var gF = el('circle', { r: 9, style: 'fill:#8a6bb8;stroke:' + ROXO + ';stroke-width:1.5' }), gM = el('circle', { r: 4, style: 'fill:' + ROXO });
    var ooc = el('circle', { cx: fx, cy: fy, r: 18, style: 'fill:#efe6f7;stroke:' + ROXO + ';stroke-width:1.5' });
    var oocE = []; for (i = 0; i < 7; i++) oocE.push(el('path', { d: 'M-4 0 Q0 -2.5 4 0', transform: 'translate(' + (fx - 8 + (i % 4) * 5.5) + ' ' + (fy - 6 + Math.floor(i / 4) * 10) + ') rotate(' + (i * 37 % 90 - 45) + ')', style: 'fill:none;stroke:' + ROXO + ';stroke-width:2;stroke-linecap:round' }));
    var mT = tx({ x: fx, y: 74, 'text-anchor': 'middle', style: 'font-size:13.5px;font-weight:600;fill:' + ROXO });
    /* painel */
    var px = 446;
    var fase = tx({ x: px, y: 128, style: 'font-size:19px;font-weight:700;fill:var(--tinta)' });
    var s1 = tx({ 'class': 'v-sub', x: px, y: 146 }), s2 = tx({ 'class': 'v-sub', x: px, y: 163 }), s3 = tx({ 'class': 'v-sub', x: px, y: 180 }), s4 = tx({ 'class': 'v-sub forte', x: px, y: 198, style: 'fill:var(--ad-t)' });
    var gx0 = px + 4, gx1 = 622, gy1 = 328, gy0 = 242;
    tx({ 'class': 'v-lab', x: px, y: 228 }, 'Temperatura do paciente');
    el('line', { x1: gx0, y1: gy1, x2: gx1, y2: gy1, style: 'stroke:var(--lapis);stroke-width:1.5' });
    el('line', { x1: gx0, y1: gy1, x2: gx0, y2: gy0, style: 'stroke:var(--lapis);stroke-width:1.5' });
    el('line', { x1: gx0, y1: 310, x2: gx1, y2: 310, style: 'stroke:var(--lapis);stroke-width:1;stroke-dasharray:4 4' });
    tx({ x: gx0 + 6, y: 324, style: 'font-size:13px;fill:var(--lapis)' }, '37 °C');
    tx({ x: gx1, y: 341, 'text-anchor': 'end', style: 'font-size:13px;fill:var(--lapis)' }, 'tempo');
    var febre = el('path', { style: 'fill:none;stroke:#b4442f;stroke-width:2.5;stroke-linejoin:round' });
    var fp = el('circle', { r: 4.5, style: 'fill:#b4442f' });
    var picoT = tx({ style: 'font-size:13px;font-weight:700;fill:#b4442f', 'text-anchor': 'middle' }, 'pico');
    var RUP = [T_S + .93 * PER, T_S + 1.93 * PER, T_S + 2.93 * PER];
    function temp(t) { var v = 0; RUP.forEach(function (r) { var d = t - r; v = Math.max(v, Math.exp(-d * d / (d < 0 ? .03 : .12))); }); return v; }
    function gX(t) { return gx0 + (gx1 - gx0) * t / 12; }
    function gY(v) { return 310 - 58 * v; }
    function setDots(arr, n, cx, cy, rr, spread) {
      arr.forEach(function (d, k) {
        if (k >= n) { d.style.opacity = 0; return; }
        var a = k * 2.399, r = rr * Math.sqrt((k + .5) / Math.max(n, 1)) + spread;
        d.setAttribute('cx', (cx + r * Math.cos(a)).toFixed(1)); d.setAttribute('cy', (cy + r * Math.sin(a)).toFixed(1)); d.style.opacity = 1;
      });
    }
    return function (t) {
      var nome, L;
      /* esporozoitos descendo */
      esp.forEach(function (e, k) {
        var u = cl((t - k * .12) / 1.2);
        if (t < T_F + .1 && u > 0 && u < 1) { var y = 84 + 100 * ease(u), x = 48 + 40 * ease(u) + (k - 1.5) * 5; e.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(70)'); e.style.opacity = 1; }
        else e.style.opacity = 0;
      });
      /* figado */
      var gH = ease((t - T_F) / 2.0), rompe = cl((t - 3.5) / .4);
      hep.setAttribute('r', (12 + 18 * gH).toFixed(1));
      hep.style.opacity = t < T_F ? .35 : (1 - rompe).toFixed(2);
      setDots(hepD, t < T_F ? 0 : Math.round(1 + 25 * gH), 92, 218, 9 + 14 * gH + 8 * rompe, 0);
      hepD.forEach(function (d) { if (rompe > 0) d.style.opacity = (1 - rompe).toFixed(2); });
      var hepAtivo = t >= T_F && t < 4;
      hepT1.style.fill = hepAtivo ? 'var(--ad-t)' : 'var(--tinta)'; hepT1.style.fontWeight = hepAtivo ? '700' : '400';
      /* merozoitos do figado ate as hemacias */
      merL.forEach(function (d, k) {
        var u = cl((t - 3.6 - k * .05) / .6);
        if (u > 0 && u < 1) { d.setAttribute('cx', (150 + 70 * ease(u) + (k % 3) * 3).toFixed(1)); d.setAttribute('cy', (222 + (k - 2.5) * 4 * (1 - u)).toFixed(1)); d.style.opacity = 1; } else d.style.opacity = 0;
      });
      /* hemacias */
      var r = Math.floor((t - T_S) / PER), w = (t - T_S - r * PER) / PER;   /* volta r, fracao w */
      var est = '', est2 = '';
      H.forEach(function (o, i) {
        var vis = 1, anel = 0, nD = 0, sp = 0, ruptura = 0, cres = 0, toxu = -1;
        if (t < T_S) { vis = t > 3.4 ? .55 : .3; }
        else {
          var gam = (i === 2 && r >= 2);
          if (w < .12) { anel = 0; nD = 1; sp = 22 * (1 - w / .12); vis = r === 0 ? 1 : ease(w / .12); }
          else if (w < .4) { anel = 1; }
          else if (w < .86) { nD = Math.round(2 + 10 * ease((w - .4) / .46)); }
          else { ruptura = (w - .86) / .14; nD = 12; toxu = ruptura; }
          if (gam) { anel = 0; nD = 0; ruptura = 0; toxu = -1; vis = 1; cres = ease((t - (T_S + 2 * PER) - .3) / .6); if (t > 9.5) { cres = 0; vis = 1 - cl((t - 9.5) / .4); } }
          if (r >= 1 && w < .12 && !gam) vis = ease(w / .12);
        }
        o.g.style.opacity = (vis * (1 - ruptura)).toFixed(2);
        o.anel.style.opacity = anel; o.cres.style.opacity = cres.toFixed(2);
        if (ruptura > 0) setDots(o.d, 12, o.x, HY, 10 + 26 * ruptura, 0);
        else if (nD === 1) setDots(o.d, 1, o.x - sp, HY, 0, 0);
        else setDots(o.d, nD, o.x, HY, 10, 0);
        if (ruptura > 0) o.d.forEach(function (d) { d.style.opacity = (1 - ruptura * .8).toFixed(2); });
        o.tox.forEach(function (d, k) {
          if (toxu < 0) { d.style.opacity = 0; return; }
          var a = k * 1.05 + .5, rr = 8 + 30 * toxu; d.setAttribute('cx', (o.x + rr * Math.cos(a)).toFixed(1)); d.setAttribute('cy', (HY + rr * Math.sin(a)).toFixed(1)); d.style.opacity = (1 - toxu * .6).toFixed(2);
        });
      });
      if (t >= T_S) {
        if (w < .12) { est = 'merozoítos invadem hemácias'; est2 = ''; }
        else if (w < .4) { est = 'anel (trofozoíto jovem)'; est2 = 'cresce dentro da hemácia'; }
        else if (w < .86) { est = 'esquizonte: o parasita se divide'; est2 = 'multiplicação assexuada'; }
        else { est = 'ruptura ao mesmo tempo'; est2 = 'libera merozoítos e toxinas'; }
      }
      hT1.textContent = est; hT2.textContent = est2;
      gamT.textContent = (t >= T_S + 2 * PER + .4 && t < 9.8) ? 'gametócito' : '';
      /* gametocito sobe ao mosquito */
      var ug = cl((t - 9.5) / .8);
      if (ug > 0 && ug < 1) { var yy = 214 - 150 * ease(ug); gamV.setAttribute('transform', 'translate(' + (348 + 50 * ease(cl(ug * 3))) + ' ' + yy.toFixed(1) + ')'); gamV.style.opacity = 1; } else gamV.style.opacity = 0;
      /* no mosquito */
      var uf = cl((t - 10.3) / .7), uo = cl((t - 11.0) / .5);
      var naM = t >= 10.3 || t < .3;
      gF.setAttribute('cx', fx - 22 + 22 * ease(uf)); gF.setAttribute('cy', fy); gM.setAttribute('cx', fx + 30 - 30 * ease(uf)); gM.setAttribute('cy', fy);
      gF.style.opacity = (t >= 10.3 && uo < 1) ? (1 - uo).toFixed(2) : 0; gM.style.opacity = (t >= 10.3 && uf < 1) ? 1 : 0;
      var oo = t >= 11 ? ease(uo) : t < .3 ? 1 - t / .3 : 0;
      ooc.style.opacity = (oo * .9).toFixed(2); oocE.forEach(function (e) { e.style.opacity = oo.toFixed(2); });
      mT.textContent = t >= 10.3 && t < 11 ? 'gametas se fundem: zigoto' : t >= 11 || t < .3 ? 'oocisto: forma esporozoítos' : '';
      /* febre */
      var d = ''; for (var k = 0; k <= 160; k++) { var tt = 12 * k / 160; if (tt > t) break; d += (k ? 'L' : 'M') + gX(tt).toFixed(1) + ' ' + gY(temp(tt)).toFixed(1) + ' '; }
      d += (d ? 'L' : 'M') + gX(t).toFixed(1) + ' ' + gY(temp(t)).toFixed(1);
      febre.setAttribute('d', d); fp.setAttribute('cx', gX(t).toFixed(1)); fp.setAttribute('cy', gY(temp(t)).toFixed(1));
      var ult = -1; RUP.forEach(function (rr) { if (t >= rr + .05) ult = rr; });
      if (ult > 0) { picoT.setAttribute('x', gX(ult).toFixed(1)); picoT.setAttribute('y', (gY(1) - 6).toFixed(1)); picoT.style.opacity = 1; } else picoT.style.opacity = 0;
      /* painel */
      if (t < T_F) { nome = 'Picada'; L = ['o mosquito infectado injeta', 'esporozoítos, que seguem', 'pelo sangue até o fígado']; }
      else if (t < T_S) { nome = 'Fase no fígado'; L = ['multiplicação assexuada', 'silenciosa: ainda sem febre;', 'saem merozoítos para o sangue']; }
      else if (t < T_G) { nome = 'Fase nas hemácias'; L = ['multiplicação assexuada; as', 'hemácias se rompem juntas e', 'as toxinas dão o pico de febre']; }
      else { nome = 'Gametócitos'; L = ['algumas formas viram', 'gametócitos; só no mosquito', 'viram gametas e se fundem']; }
      var PR = { Pb606c63: ['febre: as hemácias', 'rompem (4); sexuada:', 'no mosquito (5).', 'Por isso a resposta é D.'], Pd8fbc8a: ['sem síntese de DNA, trava', 'a multiplicação assexuada', 'nas hemácias.', 'Por isso a resposta é B.'], W84e1882: ['febre = hemácias rompem', 'juntas e liberam toxinas.', '', 'Por isso a resposta é D.'] }[qid];
      if (PR && t >= 10.6) { nome = 'Por isso'; L = PR; }
      fase.textContent = nome; s1.textContent = L[0]; s2.textContent = L[1]; s3.textContent = L[2]; s4.textContent = L[3] || '';
    };
  }
};
VIS.liga('ciclo-malaria', ['Pb606c63', 'Pd8fbc8a', 'W84e1882']);
