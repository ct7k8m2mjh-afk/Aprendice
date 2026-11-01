/* Cogumelo = corpo de frutificacao (basidiocarpo) de um basidiomiceto; o corpo do fungo e o micelio de hifas no solo, que solta
   enzimas e absorve o que foi digerido fora do corpo (digestao extracorporea, como a aranha). Fotos reais + esquemas. Lote bio 9. */
/* etapa final "Resposta": congela o desenho no quadro que decide a questao aberta (qid) e mostra o porque.
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
  var n = r.length - 1, w = opc.w || 540, h = opc.h || 66 + 23 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
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
/* utilitarios de desenho */
function kit(svg) {
  var NS = 'http://www.w3.org/2000/svg', K = {};
  K.el = function (n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; };
  K.tx = function (x, y, s, st, pai) { var t = K.el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s || ''; return t; };
  K.cl = function (u) { return u < 0 ? 0 : u > 1 ? 1 : u; };
  K.ease = function (u) { u = K.cl(u); return u * u * (3 - 2 * u); };
  K.lerp = function (a, b, u) { return a + (b - a) * u; };
  K.op = function (o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0.001 ? 'none' : ''; };
  K.seta = function (pai, x1, y1, x2, y2, cor, w, extra) {
    var a = Math.atan2(y2 - y1, x2 - x1), h = 9;
    return K.el('path', { d: 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2 + ' M' + (x2 - h * Math.cos(a - .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a - .45)).toFixed(1) + ' L' + x2 + ' ' + y2 + ' L' + (x2 - h * Math.cos(a + .45)).toFixed(1) + ' ' + (y2 - h * Math.sin(a + .45)).toFixed(1), style: 'fill:none;stroke:' + (cor || 'var(--lapis)') + ';stroke-width:' + (w || 2.2) + ';stroke-linecap:round;stroke-linejoin:round' + (extra || '') }, pai);
  };
  /* painel de texto embaixo: titulo + ate 2 linhas */
  K.painel = function (y0) {
    y0 = y0 || 282;
    K.el('line', { x1: 14, x2: 626, y1: y0, y2: y0, style: 'stroke:var(--linha);stroke-width:1.5' });
    var a = K.tx(16, y0 + 22, '', 'font-size:16.5px;font-weight:700;fill:var(--ad-t)');
    var b = K.tx(16, y0 + 43, '', 'font-size:14.5px;fill:var(--tinta)');
    var c = K.tx(16, y0 + 63, '', 'font-size:14.5px;fill:var(--tinta)');
    return function (L) { a.textContent = L[0]; b.textContent = L[1] || ''; c.textContent = L[2] || ''; };
  };
  K.etapa = function (t, M) { var i = 0; for (var k = 0; k < M.length; k++) if (t >= M[k]) i = k; return i; };
  return K;
}
var RESP = {
'Pe2519e3': ['Por isso a resposta é E',
  'O fungo solta enzimas no substrato, digere fora do corpo e',
  'absorve o resultado. A aranha faz o mesmo: injeta enzimas',
  'na presa e suga o conteúdo já digerido.'],
'W3690863': ['Por isso a resposta é D',
  'O que se come é o corpo de frutificação (chapéu e pé), não',
  'o micélio, que fica no substrato. As lamelas têm basídios',
  'que formam os esporos: o champignon é um basidiomiceto.']
};
VIS.def['fungo-micelio-digestao'] = {
  tit: 'Cogumelo: a parte de cima de um fungo que digere fora do corpo',
  fontes: ['OpenStax, Biology 2e, 24.1 Characteristics of Fungi (hifas e micélio; fungos heterótrofos que secretam enzimas e absorvem os nutrientes, digestão extracelular) — https://openstax.org/books/biology-2e/pages/24-1-characteristics-of-fungi',
    'OpenStax, Biology 2e, 24.2 Classifications of Fungi, Basidiomycota (cogumelo = basidiocarpo; lamelas com basídios que formam 4 basidiósporos; micélio dicariótico) — https://openstax.org/books/biology-2e/pages/24-2-classifications-of-fungi',
    'Wikipedia (en), Spider, Digestion (enzimas lançadas sobre a presa, que é liquefeita e sugada) — https://en.wikipedia.org/wiki/Spider'],
  tipo: 'anim', dur: 14.6,
  marcas: [[0, '1. Cogumelo'], [3, '2. Micélio'], [6, '3. Digestão'], [9, '4. A aranha'], [11.8, '5. Lamelas']],
  cred: 'Fotos: Agaricus campestris (cogumelo-do-campo, do mesmo gênero do champignon), Fröttmaninger Heide, Alemanha, por Andreas Kunze (Ak ccm), CC BY-SA 3.0, via Wikimedia Commons ("2010-08-07 Agaricus campestris.jpg" e "2010-08-07 Agaricus campestris gills.jpg"), recortadas. Esquemas feitos para o app (fora de escala).',
  nota: 'Fungos são heterótrofos por absorção: não engolem o alimento. As hifas soltam enzimas no substrato, a digestão acontece fora do corpo e só as moléculas pequenas entram.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 3, 6, 9, 11.8], TF = 14.6;
    var HIF = '#9a7a3a', ENZ = '#2b6cb0', MAR = '#b4442f';
    var PX = 14, PY = 12, PW = 340, PH = 255, k = PW / 640;
    var defs = el('defs', {}), cp = el('clipPath', { id: 'fmd-cp' }, defs); el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10 }, cp);
    function foto(src) { var im = el('image', { x: PX, y: PY, width: PW, height: PH, preserveAspectRatio: 'xMidYMid slice', 'clip-path': 'url(#fmd-cp)' }); im.setAttribute('href', src); im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src); return im; }
    function marca(pai, n, fx, fy, bx, by, t1, cor) {
      var a = [PX + fx * k, PY + fy * k], w = t1.length * 7.6 + 34;
      el('line', { x1: a[0], y1: a[1], x2: bx + 12, y2: by + 12, style: 'stroke:#fff;stroke-width:4' }, pai);
      el('line', { x1: a[0], y1: a[1], x2: bx + 12, y2: by + 12, style: 'stroke:' + cor + ';stroke-width:2' }, pai);
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:#fff;stroke-width:3.5' }, pai);
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:' + cor + ';stroke-width:2' }, pai);
      el('rect', { x: bx, y: by, width: w, height: 24, rx: 12, style: 'fill:rgba(255,255,255,.95);stroke:' + cor + ';stroke-width:1.5' }, pai);
      el('circle', { cx: bx + 12, cy: by + 12, r: 9, style: 'fill:' + cor }, pai);
      tx(bx + 12, by + 17, n, 'font-size:13px;font-weight:700;fill:#fff;text-anchor:middle', pai);
      tx(bx + 26, by + 17, t1, 'font-size:13.5px;font-weight:700;fill:#222', pai);
    }
    /* ===== foto 1: cogumelos no campo ===== */
    var F1 = el('g', {}); F1.appendChild(foto('vis/fungo-micelio-digestao-1.webp'));
    var M1 = el('g', {}, F1);
    marca(M1, '1', 116, 229, PX + 8, PY + 8, 'chapéu (píleo)', '#7a3a8a');
    marca(M1, '2', 290, 352, PX + 160, PY + 150, 'lamelas', '#7a3a8a');
    marca(M1, '3', 470, 262, PX + 190, PY + 8, 'pé (estipe)', '#7a3a8a');
    /* ===== foto 2: lamelas ===== */
    var F2 = el('g', {}); F2.appendChild(foto('vis/fungo-micelio-digestao-2.webp'));
    marca(F2, '2', 300, 300, PX + 8, PY + 8, 'lamelas: aqui nascem os esporos', '#7a3a8a');
    /* ===== direita: micelio ===== */
    var RX = 372;
    var MI = el('g', {});
    el('rect', { x: RX, y: 104, width: 254, height: 162, rx: 8, style: 'fill:color-mix(in srgb,#b08a5a 22%,var(--folha))' }, MI);
    el('path', { d: 'M486 104 C482 84 482 70 486 54 L500 54 C504 70 504 84 500 104 Z', style: 'fill:#f2ede4;stroke:#9a8a6a;stroke-width:1.6' }, MI);
    el('path', { d: 'M446 58 C452 22 534 22 540 58 Z', style: 'fill:#f6f1e8;stroke:#9a8a6a;stroke-width:1.6' }, MI);
    for (var i = 0; i < 7; i++) el('line', { x1: 452 + i * 13, y1: 58, x2: 456 + i * 12, y2: 63, style: 'stroke:#c78a7a;stroke-width:1.4' }, MI);
    var sem = 9; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    var hif = el('g', {}, MI);
    function ramo(x, y, a, n, prof) {
      if (prof > 4 || y > 258 || x < RX + 6 || x > 620) return;
      if (Math.sin(a) < .15) a = a < Math.PI / 2 && a > -Math.PI / 2 ? .25 : Math.PI - .25;
      var L = 22 + rnd() * 18, x2 = x + L * Math.cos(a), y2 = y + L * Math.sin(a);
      if (x2 < RX + 6 || x2 > 620) return;
      el('line', { x1: x.toFixed(1), y1: y.toFixed(1), x2: x2.toFixed(1), y2: Math.min(y2, 260).toFixed(1), style: 'stroke:' + HIF + ';stroke-width:1.6;stroke-linecap:round' }, hif);
      ramo(x2, y2, a + (rnd() - .5) * .9, n, prof + 1); if (rnd() < .7) ramo(x2, y2, a + (rnd() < .5 ? -1 : 1) * (.6 + rnd() * .6), n, prof + 1);
    }
    [.3, .8, 1.3, 1.8, 2.3, 2.8].forEach(function (a) { ramo(493, 106, a, 0, 0); });
    tx(RX + 8, 124, 'micélio: rede de hifas', 'font-size:13.5px;font-weight:700;fill:#5a4a2a;paint-order:stroke;stroke:#efe6d6;stroke-width:4px', MI);
    tx(RX + 8, 258, '(o corpo do fungo)', 'font-size:13px;font-weight:600;fill:#5a4a2a;paint-order:stroke;stroke:#efe6d6;stroke-width:4px', MI);
    tx(556, 36, 'corpo de', 'font-size:13px;font-weight:700;fill:#7a3a8a', MI); tx(556, 52, 'frutificação', 'font-size:13px;font-weight:700;fill:#7a3a8a', MI);
    /* ===== direita: zoom da hifa digerindo ===== */
    var ZO = el('g', {});
    el('rect', { x: RX, y: 12, width: 254, height: 254, rx: 10, style: 'fill:color-mix(in srgb,#b08a5a 14%,var(--folha));stroke:var(--linha);stroke-width:1.2' }, ZO);
    tx(RX + 10, 32, 'zoom: ponta de uma hifa', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', ZO);
    el('path', { d: 'M' + RX + ' 126 H486 A16 16 0 0 1 486 158 H' + RX + ' Z', style: 'fill:#efe3c8;stroke:' + HIF + ';stroke-width:2' }, ZO);
    tx(RX + 10, 147, 'hifa', 'font-size:13.5px;font-weight:700;fill:#5a4a2a', ZO);
    var enz = []; for (i = 0; i < 9; i++) enz.push(el('circle', { r: 3.4, style: 'fill:' + ENZ }, ZO));
    var enzT = tx(RX + 10, 114, 'enzimas saem da ponta', 'font-size:13px;font-weight:700;fill:' + ENZ, ZO);
    var cad = [[548, 84], [552, 214]].map(function (c) { return [0, 1, 2, 3, 4, 5].map(function (j) { return { el: el('circle', { r: 6, style: 'fill:#c99a3a;stroke:#8a6a1a;stroke-width:1.2' }, ZO), x: c[0] + j * 12 - 30, y: c[1] + (j % 2) * 5 }; }); });
    var cadT = tx(RX + 10, 56, 'molécula grande (proteína, celulose)', 'font-size:13px;fill:var(--tinta)', ZO);
    var absT = tx(RX + 10, 196, 'pedaços pequenos entram', 'font-size:13px;font-weight:700;fill:#2f7a34', ZO);
    var foraT = tx(RX + 10, 254, 'a digestão é FORA do fungo', 'font-size:13.5px;font-weight:700;fill:' + MAR, ZO);
    /* ===== esquerda: aranha ===== */
    var AR = el('g', {});
    el('rect', { x: PX, y: PY, width: PW, height: PH, rx: 10, style: 'fill:color-mix(in srgb,#8a8a8a 7%,var(--folha));stroke:var(--linha);stroke-width:1.2' }, AR);
    tx(PX + 12, PY + 22, 'Aranha', 'font-size:15px;font-weight:700;fill:var(--tinta)', AR);
    var SX = 110, SY = 140;
    [-1, 1].forEach(function (sg) { for (var j = 0; j < 4; j++) { var d = j - 1.5, x0 = SX + 6 + d * 4; el('path', { d: 'M' + x0 + ' ' + SY + ' L' + (x0 + d * 14).toFixed(1) + ' ' + (SY + sg * 28) + ' L' + (x0 + d * 26).toFixed(1) + ' ' + (SY + sg * 46), style: 'fill:none;stroke:#3a3a3a;stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round' }, AR); } });
    el('ellipse', { cx: SX - 26, cy: SY, rx: 24, ry: 18, style: 'fill:#4a4a4a' }, AR);
    el('ellipse', { cx: SX + 6, cy: SY, rx: 14, ry: 12, style: 'fill:#5a5a5a' }, AR);
    var presa = el('g', {}, AR);
    el('ellipse', { cx: 210, cy: SY, rx: 22, ry: 10, style: 'fill:#7a6a4a' }, presa);
    el('ellipse', { cx: 206, cy: SY - 14, rx: 14, ry: 7, transform: 'rotate(-20 206 ' + (SY - 14) + ')', style: 'fill:color-mix(in srgb,#8fb8d8 40%,var(--folha));stroke:#5f8fb0;stroke-width:1' }, presa);
    var liq = el('ellipse', { cx: 210, cy: SY, rx: 22, ry: 10, style: 'fill:#d9b44a' }, AR);
    var injT = tx(PX + 12, 210, '', 'font-size:13.5px;font-weight:700;fill:' + ENZ, AR);
    var enzA = [0, 1, 2, 3].map(function () { return el('circle', { r: 3.4, style: 'fill:' + ENZ }, AR); });
    var compT = tx(PX + 12, 236, 'injeta enzimas, digere a presa por fora', 'font-size:13px;fill:var(--tinta)', AR);
    var compT2 = tx(PX + 12, 254, 'e suga o líquido: como o fungo', 'font-size:13px;font-weight:700;fill:#2f7a34', AR);
    /* ===== direita: basidio ===== */
    var BA = el('g', {});
    el('rect', { x: RX, y: 12, width: 254, height: 254, rx: 10, style: 'fill:color-mix(in srgb,#c78a7a 10%,var(--folha));stroke:var(--linha);stroke-width:1.2' }, BA);
    tx(RX + 10, 32, 'zoom: superfície da lamela', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', BA);
    [430, 499, 568].forEach(function (x, j) {
      var b = el('g', {}, BA), alto = j === 1;
      el('path', { d: 'M' + (x - 9) + ' 236 V' + (alto ? 128 : 160) + ' C' + (x - 18) + ' ' + (alto ? 100 : 132) + ' ' + (x + 18) + ' ' + (alto ? 100 : 132) + ' ' + (x + 9) + ' ' + (alto ? 128 : 160) + ' V236', style: 'fill:#f3e6dd;stroke:#9a5a4a;stroke-width:1.8' }, b);
      if (alto) [-12, -4, 4, 12].forEach(function (dx) { el('line', { x1: x + dx * .6, y1: 106, x2: x + dx, y2: 88, style: 'stroke:#9a5a4a;stroke-width:1.4' }, b); el('ellipse', { cx: x + dx, cy: 80, rx: 4, ry: 6.5, style: 'fill:#7a4a3a' }, b); });
    });
    tx(499, 60, 'esporos (em geral 4)', 'font-size:13.5px;font-weight:700;fill:#7a4a3a;text-anchor:middle', BA);
    tx(RX + 10, 254, 'basídio → basidiomiceto', 'font-size:13.5px;font-weight:700;fill:#7a3a8a', BA);
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(F1, e <= 2 ? (e === 0 ? 1 : .55) : 0); op(M1, e === 0 ? cl((t - .3) / .4) : 0);
      op(AR, e === 3 ? cl((t - 9) / .3) : 0); op(F2, e === 4 ? cl((t - 11.8) / .3) : 0);
      op(MI, e === 1 || e === 0 ? (e === 0 ? cl((t - 1.6) / .5) * .35 : 1) : 0);
      op(ZO, e === 2 ? cl((t - 6) / .3) : e === 3 ? .55 : 0); op(BA, e === 4 ? cl((t - 11.9) / .3) : 0);
      /* enzimas saindo da hifa e quebrando as moleculas */
      var u = e === 2 ? cl((t - 6.3) / 2.4) : e === 3 ? 1 : 0;
      enz.forEach(function (c, j) { var a = -1.2 + j * .3, r = 10 + 70 * cl(u * 1.6 - j * .05); c.setAttribute('cx', (502 + r * Math.cos(a)).toFixed(1)); c.setAttribute('cy', (142 + r * Math.sin(a)).toFixed(1)); op(c, u > 0 && u < .95 ? 1 : 0); });
      cad.forEach(function (ch, ci) { ch.forEach(function (p, j) {
        var q = cl((u - .45) / .3), w = cl((u - .7) / .3), sx = p.x + (j - 2.5) * 10 * q, sy = p.y + (ci ? -1 : 1) * 0;
        p.el.setAttribute('cx', lerp(sx, 494 + (j - 2.5) * 3, w).toFixed(1)); p.el.setAttribute('cy', lerp(sy, 142 + (ci ? 6 : -6), w).toFixed(1)); op(p.el, 1 - cl((u - .96) / .04));
      }); });
      op(enzT, u > .05 ? 1 : 0); op(absT, u > .7 ? 1 : 0); op(foraT, u > .85 ? 1 : 0);
      /* aranha */
      var v = e === 3 ? cl((t - 9.2) / 2.2) : 0;
      enzA.forEach(function (c, j) { var w = cl(v * 2 - j * .15); c.setAttribute('cx', lerp(SX + 22, 196, w).toFixed(1)); c.setAttribute('cy', (SY - 4 + j * 3).toFixed(1)); op(c, v > 0 && v < .55 ? 1 : 0); });
      op(presa, 1 - cl((v - .45) / .25)); op(liq, cl((v - .45) / .25) * (1 - .6 * cl((v - .8) / .2)));
      injT.textContent = v < .45 ? '1. injeta enzimas' : v < .8 ? '2. a presa vira líquido' : '3. suga o caldo';
      var L;
      if (e === 0) L = ['1. O que se vê é o corpo de frutificação', 'Chapéu (1), lamelas (2) e pé (3) formam o cogumelo: a parte que sai do solo', 'para espalhar esporos. É também a parte que se come.'];
      else if (e === 1) L = ['2. O corpo do fungo é o micélio, no solo', 'Uma rede de filamentos finos, as hifas, se espalha pelo solo ou pela madeira.', 'O cogumelo é feito de hifas compactadas que brotam desse micélio.'];
      else if (e === 2) L = ['3. Digestão fora do corpo, depois absorção', 'As hifas lançam enzimas no substrato; elas quebram as moléculas grandes', 'do lado de fora, e só os pedaços pequenos são absorvidos pela hifa.'];
      else if (e === 3) L = ['4. A aranha usa a mesma estratégia', 'Ela injeta enzimas na presa, espera digerir e suga o líquido. Caramujo e', 'pulgão digerem dentro do corpo; grama e samambaia fazem fotossíntese.'];
      else L = ['5. Nas lamelas, os basídios: basidiomiceto', 'Cada lamela é forrada de basídios, células em clava que formam esporos (em geral 4).', 'Por isso o champignon é um basidiomiceto (ascomicetos formam esporos em ascos).'];
      painel(L);
    };
    return fimResposta(VIS.def['fungo-micelio-digestao'], svg, _desenha, TF, RESP, qid, { congela: function (q) {
      return { Pe2519e3: 11.7, W3690863: 14.5 }[q] || TF - .001; } });
  }
};
VIS.liga('fungo-micelio-digestao', ['Pe2519e3', 'W3690863']);
