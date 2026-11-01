/* Fagocitose -> fagossomo -> vacuolo digestivo (lisossomo do Golgi) -> aminoacidos marcados vao ao RER ->
   corpo residual sai por exocitose (a membrana volta a crescer) -> autofagia -> fluxo de membrana. */
function quebra(s, n) { var p = s.split(' '), L = [], a = ''; p.forEach(function (w) { if (a && (a + ' ' + w).length > n) { L.push(a); a = w; } else a = a ? a + ' ' + w : w; }); if (a) L.push(a); return L; }
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js): congela o quadro que decide a questao aberta.
   Aqui o cartao ocupa o lugar do painel de texto (opc.esconde) e o desenho fica visivel ao lado. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 3.2); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var L = []; r.slice(1).forEach(function (s) { L = L.concat(opc.quebra ? quebra(s, opc.quebra) : [s]); });
  var lh = 22, w = opc.w || 520, h = 78 + lh * (L.length - 1), x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 16, y: y + 31, style: 'font-size:17px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  L.forEach(function (s, i) { var t = el('text', { x: x + 16, y: y + 58 + lh * i, style: 'font-size:14.5px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde) opc.esconde.style.opacity = on ? 0 : 1;
  };
}
var RESP = {
  'W75f5717': ['Por isso a resposta é E', 'Pôr uma substância para fora fundindo uma bolsa à membrana, que se modifica, é a exocitose.', 'Endocitose é o contrário: entrada.'],
  'W9f0971b': ['Por isso a resposta é C', 'Na exocitose a membrana da bolsa se soma à membrana plasmática: a superfície aumenta (veja a barra).', 'Invaginar, pseudópode e perder membrana são da endocitose.'],
  'W2e5ebcb': ['Por isso a resposta é A', 'A membrana que sai como bolsa na endocitose volta na exocitose. Essa troca contínua é o fluxo de membrana.'],
  'Wf6eedb9': ['Por isso a resposta é C', 'Fagossomo + lisossomo = vacúolo digestivo.', 'O fagossomo (A) é a bolsa de antes da fusão.'],
  'W091f027': ['Por isso a resposta é E', 'A proteína do alimento é digerida; os aminoácidos marcados vão aos ribossomos do retículo e viram proteína nova ali.'],
  'P1ff66e3': ['Por isso a resposta é D', 'Autofagia: membrana do retículo envolve a organela e a bolsa se funde ao lisossomo.', 'Romper o lisossomo (A) seria autólise.']
};
VIS.def['endocitose-exocitose-digestao-intracelular'] = {
  tit: 'Da fagocitose à exocitose: o caminho da partícula e da membrana',
  fontes: ['OpenStax, Biology 2e, 5.4 Bulk Transport — https://openstax.org/books/biology-2e/pages/5-4-bulk-transport', 'OpenStax, Biology 2e, 4.4 The Endomembrane System and Proteins — https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins', 'Wikipedia (en), Phagosome — https://en.wikipedia.org/wiki/Phagosome', 'Wikipedia (en), Autophagy — https://en.wikipedia.org/wiki/Autophagy'],
  tipo: 'anim', dur: 17,
  marcas: [[0, 'Fagocitose'], [2.8, 'Vacúolo'], [5.6, 'Nutrientes'], [8.6, 'Exocitose'], [11.4, 'Autofagia'], [14.2, 'Fluxo']],
  cred: 'Animação feita para o app (esquema fora de escala; a barra exagera a variação da área da membrana).',
  nota: 'Endocitose (fagocitose, pinocitose) tira um pedaço da membrana plasmática; exocitose devolve. O lisossomo, que vem do Golgi, junta-se ao fagossomo (vacúolo digestivo) ou ao autofagossomo e digere o conteúdo.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y, s) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' + (s !== undefined ? ' scale(' + s.toFixed(3) + ')' : '')); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var MEM = '#c08a3e', LIS = '#b4442f', MARC = '#d81b60', BAC = '#5a8f3c', RE = '#4f7cb0', GOL = '#8a6bb5', MIT = '#c9772f';
    var MY = 70;
    /* citoplasma */
    el('rect', { x: 8, y: MY, width: 374, height: 268, rx: 0, style: 'fill:color-mix(in srgb,#e9d8b8 26%,var(--folha))' });
    tx(200, 24, 'meio externo', 'font-size:13px;font-weight:600;text-anchor:middle;fill:var(--lapis)');
    tx(14, 94, 'citosol', 'font-size:13px;font-weight:600;fill:var(--lapis)');
    /* nucleo + RER */
    el('circle', { cx: 336, cy: 256, r: 38, style: 'fill:color-mix(in srgb,#7d6aa8 14%,var(--folha));stroke:#7d6aa8;stroke-width:2' });
    tx(336, 261, 'núcleo', 'font-size:13px;font-weight:600;text-anchor:middle;fill:#5d4c88');
    var gRE = el('g', {}), reP = [];
    [[0, 0], [1, 14], [2, 28]].forEach(function (k) {
      var r = 52 + k[1], d = '';
      for (var a = 150; a <= 230; a += 4) { var rad = a * Math.PI / 180; d += (d ? 'L' : 'M') + (336 + r * Math.cos(rad)).toFixed(1) + ' ' + (256 + r * Math.sin(rad)).toFixed(1) + ' '; }
      reP.push(el('path', { d: d, style: 'fill:none;stroke:' + RE + ';stroke-width:6;stroke-linecap:round;opacity:.55' }, gRE));
      for (a = 152; a <= 228; a += 8) { var rr = (a * Math.PI / 180); el('circle', { cx: (336 + (r + 4.5) * Math.cos(rr)).toFixed(1), cy: (256 + (r + 4.5) * Math.sin(rr)).toFixed(1), r: 1.8, style: 'fill:#2c3e50' }, gRE); }
    });
    tx(246, 330, 'RER', 'font-size:13px;font-weight:700;fill:' + RE);
    /* Golgi */
    var gG = el('g', {});
    [0, 1, 2, 3].forEach(function (i) { el('path', { d: 'M' + (78 + i * 2) + ' ' + (262 - i * 10) + ' Q110 ' + (278 - i * 10) + ' ' + (142 - i * 2) + ' ' + (262 - i * 10), style: 'fill:none;stroke:' + GOL + ';stroke-width:5;stroke-linecap:round' }, gG); });
    tx(110, 296, 'Golgi', 'font-size:13px;font-weight:700;text-anchor:middle;fill:' + GOL);
    /* mitocondria (velha na autofagia) */
    var gMi = el('g', {});
    el('ellipse', { rx: 22, ry: 11, style: 'fill:color-mix(in srgb,' + MIT + ' 22%,var(--folha));stroke:' + MIT + ';stroke-width:1.8' }, gMi);
    el('path', { d: 'M-14 0 l4 -6 l4 12 l4 -12 l4 12 l4 -12 l4 6', style: 'fill:none;stroke:' + MIT + ';stroke-width:1.2' }, gMi);
    var mitL = tx(195, 312, 'mitocôndria velha', 'font-size:13px;font-weight:600;text-anchor:middle;fill:' + MIT);
    var auto1 = el('path', { style: 'fill:none;stroke:' + RE + ';stroke-width:2' }), auto2 = el('path', { style: 'fill:none;stroke:' + RE + ';stroke-width:2' });
    /* membrana plasmatica */
    var memb = el('path', { style: 'fill:none;stroke:' + MEM + ';stroke-width:5;stroke-linecap:round' });
    var bracos = el('path', { style: 'fill:none;stroke:' + MEM + ';stroke-width:5;stroke-linecap:round' });
    var cup = el('path', { style: 'fill:none;stroke:' + MEM + ';stroke-width:5;stroke-linecap:round' });
    /* vesicula / vacuolo */
    var gV = el('g', {});
    var vC = el('circle', { r: 28, style: 'stroke:' + MEM + ';stroke-width:4' }, gV);
    var enz = el('g', {}, gV); for (var i = 0; i < 9; i++) { var a = i * 2.4; el('circle', { cx: (16 * Math.cos(a) * ((i % 3) / 3 + .4)).toFixed(1), cy: (16 * Math.sin(a) * ((i % 3) / 3 + .4)).toFixed(1), r: 2.2, style: 'fill:' + LIS }, enz); }
    var bac = el('g', {}); el('rect', { x: -15, y: -7, width: 30, height: 14, rx: 7, style: 'fill:' + BAC }, bac);
    var deb = el('g', {}); [[-6, 3], [5, -4], [7, 6]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 3.2, style: 'fill:#7a6a4a' }, deb); });
    var vL = tx(0, 0, '', 'font-size:13.5px;font-weight:700;fill:var(--tinta)');
    /* lisossomo */
    var gL = el('g', {}); el('circle', { r: 11, style: 'fill:color-mix(in srgb,' + LIS + ' 18%,var(--folha));stroke:' + LIS + ';stroke-width:2' }, gL);
    [[-4, -3], [3, 3], [4, -4], [-3, 4]].forEach(function (p) { el('circle', { cx: p[0], cy: p[1], r: 1.8, style: 'fill:' + LIS }, gL); });
    var lL = tx(0, 0, 'lisossomo', 'font-size:13px;font-weight:700;fill:' + LIS);
    /* aminoacidos marcados */
    var AA = []; for (i = 0; i < 7; i++) AA.push(el('circle', { r: 3.6, style: 'fill:' + MARC + ';stroke:#fff;stroke-width:1' }));
    var aaL = tx(180, 120, '', 'font-size:13px;font-weight:700;fill:' + MARC);
    /* fluxo: setas */
    var gF = el('g', {});
    el('path', { d: 'M90 82 v26 m-6 -8 l6 8 l6 -8', style: 'fill:none;stroke:#b4442f;stroke-width:2.4' }, gF);
    tx(100, 104, '− membrana', 'font-size:13.5px;font-weight:800;fill:#b4442f', gF);
    el('path', { d: 'M300 108 v-26 m-6 8 l6 -8 l6 8', style: 'fill:none;stroke:#2f7a3d;stroke-width:2.4' }, gF);
    tx(290, 104, '+ membrana', 'font-size:13.5px;font-weight:800;text-anchor:end;fill:#2f7a3d', gF);
    /* medidor de area */
    tx(14, 324, 'área da', 'font-size:13px;fill:var(--lapis)'); tx(14, 339, 'membrana', 'font-size:13px;fill:var(--lapis)');
    el('rect', { x: 78, y: 322, width: 150, height: 11, rx: 3, style: 'fill:none;stroke:var(--linha);stroke-width:1.2' });
    var barA = el('rect', { x: 78, y: 322, height: 11, rx: 3, style: 'fill:' + MEM });
    var barT = tx(78, 316, '', 'font-size:13px;font-weight:700;fill:var(--tinta)');
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { t0: 0, tit: '1 · Fagocitose', s: 'A membrana emite pseudópodes que abraçam a partícula (aqui, uma bactéria). As pontas se fundem e uma bolsa se solta para dentro: o fagossomo. Um pedaço da membrana plasmática foi junto.' },
      { t0: 2.8, tit: '2 · Vacúolo digestivo', s: 'Um lisossomo, bolsa de enzimas digestivas que brota do Golgi, se funde ao fagossomo. O resultado é o vacúolo digestivo, onde a partícula é quebrada em moléculas pequenas.' },
      { t0: 5.6, tit: '3 · Os nutrientes saem', s: 'A proteína não cruza a membrana, mas seus aminoácidos sim. Eles passam ao citosol e vão aos ribossomos, muitos presos ao RER, onde viram proteína nova. Se o alimento for marcado, a marca aparece ali em minutos.' },
      { t0: 8.6, tit: '4 · Exocitose', s: 'O que não foi digerido (corpo residual) chega à membrana e se funde a ela: o conteúdo sai da célula. A membrana da bolsa passa a fazer parte da membrana plasmática, que aumenta de área.' },
      { t0: 11.4, tit: '5 · Autofagia', s: 'A célula também digere partes de si. Uma membrana, vinda principalmente do retículo endoplasmático, envolve uma organela velha (autofagossomo), que depois se funde a um lisossomo. A célula segue viva.' },
      { t0: 14.2, tit: '6 · Fluxo de membrana', s: 'Na endocitose um pedaço da membrana entra como bolsa; na exocitose a membrana de uma bolsa volta para a superfície. Essa troca contínua de perda e ganho é o fluxo de membrana.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var R = 28, PX = 90, PY = 34;
    function arco(cx, cy, r, a0, a1) {
      var p0 = [cx + r * Math.cos(a0 * Math.PI / 180), cy + r * Math.sin(a0 * Math.PI / 180)], p1 = [cx + r * Math.cos(a1 * Math.PI / 180), cy + r * Math.sin(a1 * Math.PI / 180)];
      var lg = Math.abs(a1 - a0) > 180 ? 1 : 0, sw = a1 > a0 ? 1 : 0;
      return 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + lg + ' ' + sw + ' ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1);
    }
    var _desenha = function (t) {
      var f = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.6 ? 2 : t < 11.4 ? 3 : t < 14.2 ? 4 : 5;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      var u1 = cl(t / 2.8), u2 = cl((t - 2.8) / 2.8), u3 = cl((t - 5.6) / 3), u4 = cl((t - 8.6) / 2.8), u5 = cl((t - 11.4) / 2.8);
      /* membrana com as aberturas */
      var c = ease(u1 / .5), solto = u1 > .55;
      var fus = ease((u4 - .45) / .35), w = lerp(8, 34, fus), dd = lerp(46, 0, fus), fundindo = u4 > .45 && u4 < 1;
      var d = 'M12 ' + MY;
      if (!solto) d += ' H72 M108 ' + MY;
      if (fundindo) d += ' H' + (300 - w) + ' M' + (300 + w) + ' ' + MY;
      d += ' H378'; memb.setAttribute('d', d);
      memb.style.stroke = f === 5 ? 'var(--ad-c)' : MEM;
      if (!solto) bracos.setAttribute('d', 'M72 ' + MY + ' L' + (PX - R * .42).toFixed(1) + ' ' + (PY + R * .9).toFixed(1) + ' ' + arco(PX, PY, R, 115, 115 + 155 * c).slice(1).replace(/^[^A]*/, '') + ' M108 ' + MY + ' L' + (PX + R * .42).toFixed(1) + ' ' + (PY + R * .9).toFixed(1) + ' ' + arco(PX, PY, R, 65, 65 - 155 * c).slice(1).replace(/^[^A]*/, ''));
      op(bracos, solto ? 0 : 1);
      cup.setAttribute('d', 'M' + (300 - w) + ' ' + MY + ' C' + (300 - w - 4) + ' ' + (MY + 1.4 * dd) + ' ' + (300 + w + 4) + ' ' + (MY + 1.4 * dd) + ' ' + (300 + w) + ' ' + MY);
      op(cup, fundindo ? 1 : 0);
      /* vesicula: posicao e aparencia */
      var vx, vy, vr = R, vis = 1;
      if (f === 0) { vx = PX; vy = u1 < .55 ? PY : lerp(PY, 140, ease((u1 - .55) / .45)); vis = u1 < .5 ? 0 : 1; }
      else if (f <= 2) { vx = 90; vy = 140; vr = lerp(R, 24, u3); }
      else if (f === 3) { vx = lerp(90, 300, ease(u4 / .45)); vy = lerp(140, MY + 24, ease(u4 / .45)); vr = 22; vis = u4 < .45 ? 1 : 0; }
      else { vis = 0; vx = 300; vy = 94; }
      mv(gV, vx, vy); vC.setAttribute('r', vr.toFixed(1)); op(gV, vis);
      var dig = f === 0 ? 0 : f === 1 ? ease((u2 - .5) / .15) : 1;
      vC.style.fill = 'color-mix(in srgb,' + LIS + ' ' + Math.round(4 + 12 * dig) + '%,var(--folha))';
      op(enz, f === 1 ? dig : f === 2 ? 1 - u3 * .6 : f === 3 ? .3 : 0);
      var desf = f <= 1 ? (f === 1 ? ease((u2 - .6) / .4) : 0) : 1;
      mv(bac, f === 0 ? PX : vx, f === 0 ? (u1 < .55 ? PY : vy) : vy, lerp(1, .45, desf)); op(bac, f <= 1 ? 1 - desf * .8 : 0);
      var debx = f === 3 && u4 >= .45 ? 300 : vx, deby = f === 3 && u4 >= .45 ? lerp(MY + 20, 30, ease((u4 - .5) / .4)) : vy;
      mv(deb, debx, deby); op(deb, f === 2 ? cl(u3 * 2) : f === 3 ? (u4 < .9 ? 1 : 1 - (u4 - .9) * 10) : 0);
      vL.textContent = f === 0 ? (u1 > .7 ? 'fagossomo' : '') : f === 1 ? (dig > .5 ? 'vacúolo digestivo' : 'fagossomo') : f === 2 ? 'vacúolo digestivo' : f === 3 && u4 < .45 ? 'corpo residual' : '';
      var esq = vx > 200; vL.style.textAnchor = esq ? 'end' : 'start';
      vL.setAttribute('x', (esq ? vx - vr - 8 : vx + vr + 8).toFixed(1)); vL.setAttribute('y', (vy + 5).toFixed(1));
      if (f === 0 && u1 <= .7) vL.textContent = '';
      /* lisossomo: etapa 2 (ao vacuolo) e etapa 5 (ao autofagossomo) */
      var lx, ly, lo = 0;
      if (f === 1) { var a = ease(u2 / .5); lx = lerp(150, 112, a); ly = lerp(232, 158, a); lo = u2 < .55 ? cl(u2 / .1) : 1 - cl((u2 - .55) / .1); }
      else if (f === 4) { var b = ease((u5 - .45) / .25); lx = lerp(128, 168, b); ly = lerp(205, 240, b); lo = u5 < .45 ? 0 : u5 < .72 ? 1 : 1 - cl((u5 - .72) / .08); }
      else { lx = 150; ly = 232; }
      mv(gL, lx, ly); op(gL, lo); lL.style.textAnchor = f === 4 ? 'middle' : 'start'; lL.setAttribute('x', f === 4 ? lx - 6 : lx + 15); lL.setAttribute('y', f === 4 ? ly - 17 : ly + 5); op(lL, lo);
      /* aminoacidos marcados -> RER */
      AA.forEach(function (o, i) {
        var s = cl((u3 - .08 - i * .06) / .45), dest = [262 + 8 * Math.cos(i), 220 + 13 * i];
        var x = lerp(96, dest[0], ease(s)), y = lerp(144, dest[1], ease(s)) - 40 * Math.sin(Math.PI * s);
        o.setAttribute('cx', x.toFixed(1)); o.setAttribute('cy', y.toFixed(1)); op(o, f === 2 ? cl(u3 * 6) : 0);
      });
      reP.forEach(function (p) { p.style.stroke = f === 2 && u3 > .7 ? MARC : RE; p.style.opacity = f === 2 && u3 > .7 ? .6 : .55; });
      aaL.textContent = f === 2 ? (u3 > .7 ? 'proteína nova, marcada' : 'aminoácidos marcados') : '';
      aaL.style.textAnchor = u3 > .7 ? 'end' : 'start'; aaL.setAttribute('x', u3 > .7 ? 254 : 180); aaL.setAttribute('y', u3 > .7 ? 198 : 120);
      /* autofagia */
      mv(gMi, 195, 262); var mo = f === 4 ? 1 - .7 * cl((u5 - .75) / .25) : f === 5 ? 0 : 1; op(gMi, mo);
      op(mitL, f === 4 ? 1 : 0);
      var ca = ease(u5 / .4);
      auto1.setAttribute('d', arco(195, 262, 28, 90 - 179 * ca, 90 + 179 * ca)); auto2.setAttribute('d', arco(195, 262, 33, 90 - 179 * ca, 90 + 179 * ca));
      op(auto1, f === 4 && u5 > .02 ? 1 : 0); op(auto2, f === 4 && u5 > .02 ? 1 : 0);
      mitL.textContent = f === 4 ? (u5 > .4 && u5 < .72 ? 'autofagossomo' : u5 >= .72 ? 'digestão' : 'organela velha') : '';
      /* fluxo */
      op(gF, f === 5 ? cl((t - 14.2) / .4) : 0);
      /* barra de area */
      var A = 150;
      if (t >= 2.8 * .55) A -= 22 * ease((u1 - .55) / .2);
      if (f >= 3) A += 22 * ease((u4 - .45) / .35);
      barA.setAttribute('width', A.toFixed(1));
      barT.textContent = f === 0 && u1 > .6 || f === 1 || f === 2 ? 'diminuiu (endocitose)' : f === 3 && u4 > .55 ? 'aumentou (exocitose)' : f === 5 ? 'perde e recupera: fluxo' : '';
    };
    return fimResposta(VIS.def['endocitose-exocitose-digestao-intracelular'], svg, _desenha, 17, RESP, qid, { x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'Wf6eedb9' ? 5.5 : q === 'W091f027' ? 8.5 : q === 'P1ff66e3' ? 13.25 : q === 'W2e5ebcb' ? 16.9 : 10.4; } });
  }
};
VIS.liga('endocitose-exocitose-digestao-intracelular', ['W75f5717', 'W9f0971b', 'W2e5ebcb', 'Wf6eedb9', 'W091f027', 'P1ff66e3']);
