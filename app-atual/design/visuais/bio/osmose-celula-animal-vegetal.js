/* Osmose: hemacia e celula vegetal em meio hipotonico, isotonico e hipertonico (com o volume da hemacia x tempo),
   depois o protozoario de agua doce com o vacuolo contratil funcionando e inibido. */
/* etapa final "Resposta": congela o desenho no ultimo quadro e mostra o porque da questao aberta (qid).
   R[qid] = ['Por isso a resposta é X', 'linha', ...]. Sem entrada para o qid, o visual fica como era. */
function fimResposta(def, svg, desenha, TF, R, qid, opc) {
  opc = opc || {};
  if (!def.__marcas) def.__marcas = def.marcas.slice();
  def.marcas = def.__marcas.slice();
  var r = R[qid];
  if (!r) { def.dur = TF; return desenha; }
  def.dur = TF + (opc.dt || 2.8); def.marcas.push([TF, opc.marca || 'Resposta']);
  var NS = 'http://www.w3.org/2000/svg';
  function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
  var g = el('g', {});
  Array.prototype.slice.call(svg.childNodes).forEach(function (k) { if (k !== g && k.nodeName !== 'defs') g.appendChild(k); });
  var vb = (svg.getAttribute('viewBox') || '0 0 640 350').split(/\s+/).map(Number);
  var n = r.length - 1, w = opc.w || 520, h = opc.h || 66 + 23 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 22, y: y + 36, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 22, y: y + 66 + 23 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;   /* quadro congelado na etapa Resposta */
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
  };
}
var RESP = {
'P0e6c3a7': [
'Por isso a resposta é B',
'Curva que sobe = hemácia incha = hipotônica (1);',
'reta = isotônica (2); que desce = hipertônica (3).',
'Na ordem pedida (iso, hipo, hiper): 2, 1 e 3.'
],
'Pfb3e0c8': [
'Por isso a resposta é D',
'Com o vacúolo contrátil inibido a água entra e não sai:',
'o volume sobe (curva M) e o mesmo soluto fica em',
'mais água, então a concentração cai (curva Z).'
],
'Wc52ade3': [
'Por isso a resposta é B',
'Em meio hipertônico a célula vegetal perde água e a',
'membrana se descola da parede: é a plasmólise.'
],
'W9a7787f': [
'Por isso a resposta é B',
'Solo muito salino é hipertônico para a raiz:',
'a planta normal perde água para o solo por osmose.'
],
'Wac30c5f': [
'Por isso a resposta é A',
'O sal tira água por osmose. A ameba, só com membrana,',
'desidrata e morre rápido; a parede da alface segura a',
'forma, e a folha só murcha devagar.'
],
'We58c338': [
'Por isso a resposta é C',
'Em meio hipotônico as duas células ganham água;',
'só a parede celular, rígida, impede a ruptura da vegetal.'
],
'W3a6c492': [
'Por isso a resposta é A',
'Em água doce a água entra sem parar por osmose;',
'o vacúolo contrátil elimina o excesso de água.'
]
};
VIS.def['osmose-celula-animal-vegetal'] = {
  tit: 'Osmose: a água vai para o lado com mais soluto',
  fontes: ['OpenStax, Biology 2e, 5.2 Passive Transport (osmose, tonicidade, hemácia, célula vegetal, vacúolo contrátil) — https://openstax.org/books/biology-2e/pages/5-2-passive-transport'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Hemácia e célula vegetal'], [6.5, 'Protozoário de água doce']],
  cred: 'Animação feita para o app (esquema fora de escala; pontinhos = soluto, setas azuis = água).',
  nota: 'A diferença entre as células é o que existe por fora da membrana: a hemácia e a ameba só têm membrana e podem romper (o paramécio tem só uma película flexível, sem parede); a célula vegetal tem parede de celulose, que segura a pressão quando ela fica túrgida e, quando ela perde água, fica no lugar enquanto a membrana se descola (plasmólise).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var S = { tit: 'font-size:15px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14px;fill:var(--tinta)', forte: 'font-size:14.5px;font-weight:700;fill:var(--tinta)', mini: 'font-size:13px;fill:var(--lapis)', rot: 'font-size:13px;fill:var(--tinta)' };
    var AG = '#2b7bbf', HEM = '#c0392b', PAR = '#a8894a', CIT = '#cfe6b8', VAC = '#d6e9f7', MV = '#3f7d2c';
    svg.setAttribute('viewBox', '0 0 640 360');
    /* pseudo-aleatorio fixo */
    var sem = 7; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    function seta(pai) { return el('path', { style: 'fill:none;stroke:' + AG + ';stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round' }, pai); }
    function setaD(x1, y1, x2, y2) { var a = Math.atan2(y2 - y1, x2 - x1), c = Math.cos(a), s = Math.sin(a); return 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' M' + (x2 - 7 * c + 5 * s).toFixed(1) + ' ' + (y2 - 7 * s - 5 * c).toFixed(1) + ' L' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' L' + (x2 - 7 * c - 5 * s).toFixed(1) + ' ' + (y2 - 7 * s + 5 * c).toFixed(1); }
    /* =============== cena 1 =============== */
    var c1 = el('g', {});
    var COL = [
      { cx: 107, n: 'Meio hipotônico', s: 'menos soluto fora', dots: 6, tipo: 1 },
      { cx: 320, n: 'Meio isotônico', s: 'mesma concentração', dots: 16, tipo: 0 },
      { cx: 533, n: 'Meio hipertônico', s: 'mais soluto fora', dots: 34, tipo: -1 }
    ];
    var HY = 84, VY = 178, GY0 = 284, GH = 50;
    COL.forEach(function (c, i) {
      el('rect', { x: c.cx - 102, y: 50, width: 204, height: 204, rx: 12, style: 'fill:color-mix(in srgb,' + AG + ' 6%,var(--folha));stroke:var(--linha);stroke-width:1' }, c1); el('rect', { x: c.cx - 102, y: 50, width: 204, height: 204, rx: 12, style: 'fill:none' }, c1);
      tx(c.cx, 22, c.n, S.tit + ';text-anchor:middle', c1); tx(c.cx, 40, c.s, S.mini + ';text-anchor:middle', c1);
      for (var k = 0; k < c.dots; k++) { var x = c.cx - 94 + rnd() * 188, y = 56 + rnd() * 182; if (Math.abs(x - c.cx) < 52 && Math.abs(y - HY) < 40) continue; if (Math.abs(x - c.cx) < 56 && Math.abs(y - VY) < 42) continue; el('circle', { cx: x, cy: y, r: 2.2, style: 'fill:#8a6d3b;opacity:.7' }, c1); }
      /* hemacia */
      c.hem = el('path', { style: 'fill:#e0645a;stroke:' + HEM + ';stroke-width:2' }, c1);
      c.pal = el('ellipse', { cx: c.cx, cy: HY, style: 'fill:#f2a39a' }, c1);
      c.hd = []; for (k = 0; k < 6; k++) c.hd.push([rnd() * 2 * Math.PI, .2 + .5 * rnd(), el('circle', { r: 2.2, style: 'fill:#6b2a20' }, c1)]);
      c.hT = tx(c.cx, HY + 52, '', S.rot + ';text-anchor:middle', c1);
      /* celula vegetal */
      c.par = el('rect', { style: 'fill:none;stroke:' + PAR + ';stroke-width:6' }, c1);
      c.pro = el('rect', { style: 'fill:' + CIT + ';stroke:' + MV + ';stroke-width:2' }, c1);
      c.vac = el('rect', { style: 'fill:' + VAC + ';stroke:#7aa6c7;stroke-width:1' }, c1);
      c.vT1 = tx(c.cx, VY + 52, '', S.rot + ';text-anchor:middle', c1); c.vT2 = tx(c.cx, VY + 67, '', S.rot + ';text-anchor:middle', c1);
      /* setas de agua (hemacia e vegetal) */
      c.sh = [seta(c1), seta(c1)]; c.sv = [seta(c1), seta(c1)];
      /* mini grafico: volume da hemacia x tempo */
      var gx = c.cx - 70;
      el('path', { d: 'M' + gx + ' ' + (GY0 - 4) + ' V' + (GY0 + GH) + ' H' + (gx + 150), style: 'fill:none;stroke:var(--tinta);stroke-width:1.4' }, c1);
      el('line', { x1: gx, x2: gx + 146, y1: GY0 + GH / 2, y2: GY0 + GH / 2, style: 'stroke:var(--linha);stroke-width:1;stroke-dasharray:3 4' }, c1);
      tx(gx + 150, GY0 + GH + 16, 'tempo', S.mini + ';text-anchor:end', c1);
      c.gx = gx; c.cur = el('path', { style: 'fill:none;stroke:' + HEM + ';stroke-width:3' }, c1);
      c.x = tx(0, 0, '', 'font-size:16px;font-weight:700;fill:' + HEM, c1);
    });
    tx(320, 270, 'Volume da hemácia ao longo do tempo', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', c1);
    function hemPath(cx, cy, rx, ry, cren) {
      var d = ''; for (var k = 0; k <= 72; k++) { var a = k / 72 * 2 * Math.PI, f = 1 + cren * (Math.cos(14 * a) > .3 ? 1 : 0) * Math.cos(14 * a); d += (k ? 'L' : 'M') + (cx + rx * f * Math.cos(a)).toFixed(1) + ' ' + (cy + ry * f * Math.sin(a)).toFixed(1) + ' '; }
      return d + 'Z';
    }
    /* =============== cena 2: paramecio =============== */
    var c2 = el('g', {});
    el('rect', { x: 8, y: 50, width: 324, height: 214, rx: 12, style: 'fill:color-mix(in srgb,' + AG + ' 6%,var(--folha));stroke:var(--linha);stroke-width:1' }, c2);
    tx(14, 22, 'Protozoário em água doce', S.tit, c2); tx(14, 40, 'meio hipotônico: a água entra sem parar', S.mini, c2);
    for (var k = 0; k < 5; k++) el('circle', { cx: 20 + rnd() * 300, cy: 60 + (k % 2 ? 190 : 0) + rnd() * 10, r: 2.2, style: 'fill:#8a6d3b;opacity:.7' }, c2);
    var PX = 170, PY = 158;
    var corpo = el('path', { style: 'fill:#eef3dc;stroke:#6f8a3a;stroke-width:2.2' }, c2);
    var cilios = el('path', { style: 'fill:none;stroke:#6f8a3a;stroke-width:1.2' }, c2);
    var dentro = []; for (k = 0; k < 22; k++) dentro.push([(rnd() - .5) * 1.5, (rnd() - .5) * 1.3, el('circle', { r: 2.2, style: 'fill:#8a6d3b' }, c2)]);
    var vcG = el('g', {}, c2), vc = el('circle', { style: 'fill:' + VAC + ';stroke:' + AG + ';stroke-width:2' }, vcG), canais = el('path', { style: 'fill:none;stroke:' + AG + ';stroke-width:1.6' }, vcG);
    var vcX = el('path', { style: 'fill:none;stroke:' + HEM + ';stroke-width:3;stroke-linecap:round' }, c2);
    var vcT = tx(0, 0, 'vacúolo contrátil', 'font-size:13px;font-weight:700;fill:' + AG, c2);
    var sai = seta(c2), entra = [seta(c2), seta(c2), seta(c2)];
    var p1 = tx(14, 290, '', S.forte, c2), p2 = tx(14, 310, '', S.sub, c2), p3 = tx(14, 329, '', S.sub, c2), p4 = tx(14, 348, '', S.sub, c2);
    /* graficos */
    var G = [{ y: 66, n: 'volume da célula', s: 1 }, { y: 192, n: 'concentração do citoplasma', s: -1 }];
    var gx0 = 372, gw = 240, gh = 80, TI = 8.6;
    function gxT(t) { return gx0 + gw * (t - 6.5) / 5.5; }
    G.forEach(function (g) {
      tx(gx0 - 4, g.y - 10, g.n, 'font-size:13.5px;font-weight:700;fill:var(--tinta)', c2);
      el('path', { d: 'M' + gx0 + ' ' + g.y + ' V' + (g.y + gh) + ' H' + (gx0 + gw + 6), style: 'fill:none;stroke:var(--tinta);stroke-width:1.4' }, c2);
      el('line', { x1: gxT(TI), x2: gxT(TI), y1: g.y, y2: g.y + gh, style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, c2);
      tx(gx0 + gw + 6, g.y + gh + 16, 'tempo', S.mini + ';text-anchor:end', c2);
      g.c = el('path', { style: 'fill:none;stroke:' + (g.s > 0 ? AG : '#8a6d3b') + ';stroke-width:3' }, c2);
      g.t = tx(0, 0, g.s > 0 ? 'sobe' : 'cai', 'font-size:13.5px;font-weight:700;fill:' + (g.s > 0 ? AG : '#8a6d3b'), c2);
    });
    tx(gxT(TI), G[1].y + gh + 16, 'inibidor', 'font-size:13px;font-weight:700;fill:' + HEM + ';text-anchor:middle', c2);
    function crescimento(t) { return t < TI ? 0 : 1 - Math.exp(-(t - TI) / 1.6); }
    var _desenha = function (t) {
      var cena1 = t < 6.5; op(c1, cena1 ? 1 : 0); op(c2, cena1 ? 0 : 1);
      if (cena1) {
        var s = ease((t - .5) / 4.2), fl = (t * .9) % 1, rompe = t > 4.9;
        COL.forEach(function (c) {
          /* hemacia */
          var v = c.tipo > 0 ? 1 + .32 * s : c.tipo < 0 ? 1 - .3 * s : 1, cren = c.tipo < 0 ? .1 * s : 0;
          var rx = 30 * v, ry = c.tipo > 0 ? 24 * v + 6 * s : 24 * v;   /* incha e fica mais esferica */
          c.hem.setAttribute('d', hemPath(c.cx, HY, rx, ry, cren));
          c.pal.setAttribute('rx', (13 * v * (c.tipo > 0 ? 1 - s : 1)).toFixed(1)); c.pal.setAttribute('ry', (9 * v * (c.tipo > 0 ? 1 - s : 1)).toFixed(1));
          if (c.tipo > 0 && rompe) { c.hem.style.fill = 'none'; c.hem.style.strokeDasharray = '6 7'; c.hem.style.opacity = .55; op(c.pal, 0); }
          else { c.hem.style.fill = '#e0645a'; c.hem.style.strokeDasharray = ''; c.hem.style.opacity = 1; op(c.pal, 1); }
          c.hd.forEach(function (d) { var r = c.tipo > 0 && rompe ? d[1] * 1.5 + .9 * (t - 4.9) : d[1]; d[2].setAttribute('cx', (c.cx + rx * r * Math.cos(d[0])).toFixed(1)); d[2].setAttribute('cy', (HY + ry * r * Math.sin(d[0])).toFixed(1)); });
          c.hT.textContent = t < .6 ? 'hemácia' : c.tipo > 0 ? (rompe ? 'rompeu: hemólise' : 'ganha água e incha') : c.tipo < 0 ? 'perde água: crenação' : 'entra = sai: volume igual';
          /* celula vegetal */
          var W = 92, Hh = 60, pw, phh, bul = 0;
          if (c.tipo > 0) { pw = W - 6; phh = Hh - 6; bul = 6 * s; }
          else if (c.tipo < 0) { pw = W - 6 - 40 * s; phh = Hh - 6 - 24 * s; }
          else { pw = W - 6; phh = Hh - 6; }
          c.par.setAttribute('x', (c.cx - W / 2 - bul).toFixed(1)); c.par.setAttribute('y', (VY - Hh / 2 - bul).toFixed(1)); c.par.setAttribute('width', (W + 2 * bul).toFixed(1)); c.par.setAttribute('height', (Hh + 2 * bul).toFixed(1)); c.par.setAttribute('rx', 6); c.par.style.strokeWidth = c.tipo > 0 ? 6 + 1 * s : 6;
          c.pro.setAttribute('x', (c.cx - pw / 2 - bul).toFixed(1)); c.pro.setAttribute('y', (VY - phh / 2 - bul).toFixed(1)); c.pro.setAttribute('width', (pw + 2 * bul).toFixed(1)); c.pro.setAttribute('height', (phh + 2 * bul).toFixed(1)); c.pro.setAttribute('rx', c.tipo < 0 ? 4 + 18 * s : 4);
          var vw = (pw + 2 * bul) - 22, vh = (phh + 2 * bul) - 18;
          c.vac.setAttribute('x', (c.cx - vw / 2).toFixed(1)); c.vac.setAttribute('y', (VY - vh / 2).toFixed(1)); c.vac.setAttribute('width', Math.max(4, vw).toFixed(1)); c.vac.setAttribute('height', Math.max(4, vh).toFixed(1)); c.vac.setAttribute('rx', c.tipo < 0 ? 3 + 10 * s : 3);
          var L = t < .6 ? ['célula vegetal', ''] : c.tipo > 0 ? ['túrgida: a parede', 'segura, não rompe'] : c.tipo < 0 ? ['plasmólise: a membrana', 'descola da parede'] : ['entra = sai', '(célula flácida)'];
          c.vT1.textContent = L[0]; c.vT2.textContent = L[1];
          /* setas de agua: entram no hipo, saem no hiper, ida e volta no iso */
          var ativo = t > .5 && t < 5.6 && !(c.tipo > 0 && rompe);
          [[c.sh, HY, 30 * v + 4], [c.sv, VY, c.tipo < 0 ? pw / 2 + 6 : 52]].forEach(function (q, j) {
            q[0].forEach(function (a, m) {
              var lado = m ? 1 : -1, ex = c.cx + lado * (q[2] + 26), ix = c.cx + lado * (q[2] - 6), y = q[1] + (m ? 8 : -8);
              var dentroAgua = c.tipo > 0 || (c.tipo === 0 && m === 0);
              var x1 = dentroAgua ? ex : ix, x2 = dentroAgua ? ix : ex, f = j ? (fl + .5) % 1 : fl, dx = (x2 - x1) * .25 * f;
              a.setAttribute('d', setaD(x1 + dx, y, x2 + dx, y));
              op(a, ativo ? Math.sin(Math.PI * f) * .9 + .1 : 0);
            });
          });
          /* curva do volume */
          var tt = cl((t - .5) / 5), d = '', fim = c.tipo > 0 && rompe ? cl((4.9 - .5) / 5) : tt;
          for (var k = 0; k <= 40; k++) { var u = fim * k / 40, w = ease(u * 5 / 4.2), vv = c.tipo > 0 ? .32 * w : c.tipo < 0 ? -.3 * w : 0; d += (k ? 'L' : 'M') + (c.gx + 140 * u).toFixed(1) + ' ' + (GY0 + GH / 2 - vv * 80).toFixed(1) + ' '; }
          c.cur.setAttribute('d', d);
          c.x.textContent = c.tipo > 0 && rompe ? '×' : ''; c.x.setAttribute('x', (c.gx + 140 * fim - 5).toFixed(1)); c.x.setAttribute('y', (GY0 + GH / 2 - .32 * 80 + 6).toFixed(1));
        });
      } else {
        var g = crescimento(t), esc = 1 + .26 * g, bomba = t < TI;
        var rx = 100 * esc, ry = 44 * esc;
        var d = '', dc = '';
        for (var k = 0; k <= 60; k++) { var a = k / 60 * 2 * Math.PI, f = 1 - .14 * Math.max(0, Math.sin(a)) * Math.cos(a * 2), x = PX + rx * f * Math.cos(a), y = PY + ry * Math.sin(a) * (1 + .12 * Math.cos(a)); d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' '; if (k % 2 === 0) { var nx = Math.cos(a), ny = Math.sin(a); dc += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + ' l' + (6 * nx).toFixed(1) + ' ' + (6 * ny).toFixed(1) + ' '; } }
        corpo.setAttribute('d', d + 'Z'); cilios.setAttribute('d', dc);
        dentro.forEach(function (q) { q[2].setAttribute('cx', (PX + q[0] * rx * .85).toFixed(1)); q[2].setAttribute('cy', (PY + q[1] * ry * .75).toFixed(1)); });
        /* vacuolo contratil: enche e esvazia enquanto funciona */
        var vx = PX + 58 * esc, vy = PY - 8, fase = ((t - 6.5) / 1.3) % 1, r = bomba ? (fase < .75 ? 4 + 10 * fase / .75 : 14 - 10 * (fase - .75) / .25) : 14;
        vc.setAttribute('cx', vx.toFixed(1)); vc.setAttribute('cy', vy); vc.setAttribute('r', r.toFixed(1));
        var cn = ''; for (k = 0; k < 6; k++) { var b = k / 6 * 2 * Math.PI; cn += 'M' + (vx + (r + 2) * Math.cos(b)).toFixed(1) + ' ' + (vy + (r + 2) * Math.sin(b)).toFixed(1) + ' l' + (14 * Math.cos(b)).toFixed(1) + ' ' + (14 * Math.sin(b)).toFixed(1) + ' '; }
        canais.setAttribute('d', cn); op(vcG, bomba ? 1 : .45);
        vcX.setAttribute('d', bomba ? 'M0 0' : 'M' + (vx - 9) + ' ' + (vy - 9) + ' l18 18 m0 -18 l-18 18');
        vcT.setAttribute('x', (vx - 40).toFixed(1)); vcT.setAttribute('y', (vy - ry - 16 + 8).toFixed(1));
        vcT.textContent = bomba ? 'vacúolo contrátil' : 'vacúolo contrátil parado';
        var ex = bomba && fase > .75 ? Math.sin(Math.PI * (fase - .75) / .25) : 0;
        sai.setAttribute('d', setaD(vx + 14, vy - 6, vx + 14 + 46, vy - 22)); op(sai, ex);
        entra.forEach(function (e, i) {
          var w = ((t * .9) + i * .33) % 1, ang = [2.2, 3.6, 4.6][i], ox = PX + (rx + 30) * Math.cos(ang), oy = PY + (ry + 30) * Math.sin(ang), ix = PX + (rx - 6) * Math.cos(ang), iy = PY + (ry - 6) * Math.sin(ang);
          e.setAttribute('d', setaD(lerp(ox, ix, .25 * w), lerp(oy, iy, .25 * w), lerp(ix, ox, -.25 * w), lerp(iy, oy, -.25 * w))); op(e, Math.sin(Math.PI * w) * .9 + .1);
        });
        G.forEach(function (gg) {
          var dd = ''; for (var k = 0; k <= 60; k++) { var tk = 6.5 + (t - 6.5) * k / 60, v = gg.s * .7 * crescimento(tk); dd += (k ? 'L' : 'M') + gxT(tk).toFixed(1) + ' ' + (gg.y + gh / 2 - v * gh / 2).toFixed(1) + ' '; }
          gg.c.setAttribute('d', dd);
          var vf = gg.s * .7 * g; gg.t.setAttribute('x', Math.min(gxT(t) + 6, gx0 + gw - 34).toFixed(1)); gg.t.setAttribute('y', (gg.y + gh / 2 - vf * gh / 2 + (gg.s > 0 ? -6 : -8)).toFixed(1)); op(gg.t, g > .15 ? 1 : 0);
        });
        var P = bomba ? ['Vacúolo funcionando', 'A água que entra por osmose é recolhida', 'e bombeada para fora: o volume e a', 'concentração do citoplasma ficam constantes.'] :
          ['Vacúolo inibido', 'A água continua entrando e não sai:', 'o volume sobe e o mesmo soluto fica', 'em mais água, então a concentração cai.'];
        p1.textContent = P[0]; p2.textContent = P[1]; p3.textContent = P[2]; p4.textContent = P[3];
      }
    };
    return fimResposta(VIS.def['osmose-celula-animal-vegetal'], svg, _desenha, 12, RESP, qid, { congela: function (q) { return q === 'Pfb3e0c8' ? 11.99 : q === 'W3a6c492' ? 8.0 : 6.3; } });
  }
};
VIS.liga('osmose-celula-animal-vegetal', ['P0e6c3a7', 'Pfb3e0c8', 'Wc52ade3', 'W9a7787f', 'Wac30c5f', 'We58c338', 'W3a6c492']);
