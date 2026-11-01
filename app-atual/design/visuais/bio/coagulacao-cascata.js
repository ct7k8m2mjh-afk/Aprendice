/* Coagulacao: vaso lesado, plaquetas formam o tampao e liberam tromboplastina; com Ca2+, protrombina -> trombina;
   a trombina converte fibrinogenio (soluvel) em fibrina (fios), que prende as hemacias: o coagulo.
   Foto real de microscopia eletronica: hemacias presas na rede de fibrina. */
/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid). */
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
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
  };
}
var RESP = {
'Wc59a85e': [
'Por isso a resposta é E',
'O coágulo é a rede de fibrina: o fibrinogênio vira fibrina, que se prende à lesão',
'e retém os glóbulos. A trombina só faz a conversão; ela não forma a rede.'
],
'W69fc967': [
'Por isso a resposta é C',
'Quem inicia a coagulação são as plaquetas: aderem à lesão, formam o tampão e',
'liberam fatores da cascata. Hemácia e eritrócito (mesma célula) só ficam presas.'
]
};
VIS.def['coagulacao-cascata'] = {
  tit: 'Coagulação: das plaquetas à rede de fibrina',
  fontes: ['OpenStax, Biology 2e, 40.2 Components of the Blood (plaquetas, tromboplastina, protrombina → trombina, fibrinogênio → fibrina, coágulo) — https://openstax.org/books/biology-2e/pages/40-2-components-of-the-blood', 'OpenStax, Anatomy and Physiology 2e, 18.5 Hemostasis (tampão plaquetário, cascata, Ca²⁺, rede de fibrina) — https://openstax.org/books/anatomy-and-physiology-2e/pages/18-5-hemostasis'],
  tipo: 'anim', dur: 10.4,
  marcas: [[0, '1. Lesão'], [2.6, '2. Plaquetas'], [5.2, '3. Cascata'], [7.8, '4. Fibrina']],
  cred: 'Animação feita para o app (esquema fora de escala; a cascata real tem mais fatores). Foto: hemácias presas na rede de fibrina, microscopia eletrônica de varredura (×5000), por Fuzis, CC BY-SA 4.0, via Wikimedia Commons ("Red Blood Cells In Clot.png"), recortada.',
  nota: 'A plaqueta tapa a lesão primeiro (tampão plaquetário) e libera fatores; junto com o tecido lesado e o Ca²⁺ do plasma, eles transformam a protrombina em trombina. A trombina é uma enzima: converte o fibrinogênio, solúvel no plasma, em fibrina, que forma fios insolúveis. A rede de fibrina prende hemácias e plaquetas: é o coágulo.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    function hsh(i, s) { var x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); }
    svg.setAttribute('viewBox', '0 0 640 360');
    var HEM = '#c0392b', PLA = '#8a5a9e', FIB = '#d8b25a', PAR = '#d9a0a0', PARs = '#a35d5d';
    var defs = el('defs', {});
    var cp = el('clipPath', { id: 'coag-cp' }, defs); el('rect', { x: 0, y: 0, width: 372, height: 232 }, cp);
    var cpf = el('clipPath', { id: 'coag-cpf' }, defs); el('rect', { x: 384, y: 28, width: 248, height: 186, rx: 8 }, cpf);
    /* ===== vaso (esquerda) ===== */
    var V = el('g', { 'clip-path': 'url(#coag-cp)' });
    var GX0 = 168, GX1 = 230, YT = 30, YL = 46, YB = 150, YB2 = 166;
    el('rect', { x: 0, y: YB2, width: 372, height: 70, style: 'fill:color-mix(in srgb,#e8c9b0 45%,var(--folha))' }, V);
    for (var k = 0; k < 7; k++) el('path', { d: 'M' + (GX0 - 30 + k * 14) + ' ' + (YB2 + 4) + ' q8 14 -2 28 t4 30', style: 'fill:none;stroke:#c99a6a;stroke-width:2' }, V);
    el('rect', { x: 0, y: YL, width: 372, height: YB - YL, style: 'fill:color-mix(in srgb,#f3c9c4 40%,var(--folha))' }, V);
    el('rect', { x: 0, y: YT, width: 372, height: YL - YT, style: 'fill:' + PAR + ';stroke:' + PARs + ';stroke-width:1.5' }, V);
    el('rect', { x: 0, y: YB, width: GX0, height: YB2 - YB, style: 'fill:' + PAR + ';stroke:' + PARs + ';stroke-width:1.5' }, V);
    el('rect', { x: GX1, y: YB, width: 372 - GX1, height: YB2 - YB, style: 'fill:' + PAR + ';stroke:' + PARs + ';stroke-width:1.5' }, V);
    tx(8, 22, 'vaso sanguíneo (corte)', 'font-size:14px;font-weight:700;fill:var(--tinta)');
    var colL = tx(244, 228, 'colágeno exposto', 'font-size:13px;font-weight:600;fill:#8a5a2a');
    /* hemacias circulando */
    var hem = [];
    for (k = 0; k < 13; k++) hem.push(el('ellipse', { rx: 10, ry: 5.5, style: 'fill:' + HEM + ';stroke:#8e2a1e;stroke-width:1' }, V));
    /* hemacias que vazam (etapa 1) e as presas (etapa 4) */
    var vaz = [0, 1, 2].map(function () { return el('ellipse', { rx: 10, ry: 5.5, style: 'fill:' + HEM + ';stroke:#8e2a1e;stroke-width:1' }, V); });
    /* plaquetas */
    var PLQ = [[176, 152], [190, 158], [205, 153], [220, 158], [183, 164], [198, 166], [214, 166], [226, 150], [172, 162], [196, 146]];
    var plq = PLQ.map(function () { return el('ellipse', { rx: 6, ry: 4, style: 'fill:' + PLA + ';stroke:#5b3a6e;stroke-width:1' }, V); });
    var plqL = tx(244, 186, 'plaquetas aderidas:', 'font-size:13px;font-weight:700;fill:' + PLA);
    var plqL2 = tx(244, 202, 'tampão plaquetário', 'font-size:13px;font-weight:700;fill:' + PLA);
    var fat = [0, 1, 2, 3, 4, 5].map(function () { return el('circle', { r: 3, style: 'fill:#e0a020' }, V); });
    /* fibrina */
    var fib = [];
    for (k = 0; k < 14; k++) {
      var x1 = lerp(GX0 - 46, GX1 + 30, hsh(k, 1)), y1 = lerp(118, 146, hsh(k, 2)), x2 = lerp(GX0 - 30, GX1 + 46, hsh(k, 3)), y2 = lerp(150, 200, hsh(k, 4));
      fib.push(el('path', { d: 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' Q' + ((x1 + x2) / 2 + 18 * (hsh(k, 5) - .5)).toFixed(1) + ' ' + ((y1 + y2) / 2).toFixed(1) + ' ' + x2.toFixed(1) + ' ' + y2.toFixed(1), style: 'fill:none;stroke:' + FIB + ';stroke-width:2.2;stroke-linecap:round' }, V));
    }
    var presas = [[156, 132], [246, 136], [184, 186], [222, 190], [200, 128]].map(function (p) { var e = el('ellipse', { cx: p[0], cy: p[1], rx: 10, ry: 5.5, style: 'fill:' + HEM + ';stroke:#8e2a1e;stroke-width:1' }, V); return e; });
    var fibL = tx(244, 202, 'fibrina + hemácias', 'font-size:13.5px;font-weight:700;fill:#9a7212');
    var fibL2 = tx(244, 186, 'coágulo:', 'font-size:13.5px;font-weight:700;fill:var(--tinta)');
    /* ===== coluna direita: quem e quem no sangue (etapas 1 e 2) ===== */
    var L0 = el('g', {});
    tx(388, 22, 'Quem é quem', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', L0);
    el('ellipse', { cx: 400, cy: 52, rx: 10, ry: 5.5, style: 'fill:' + HEM + ';stroke:#8e2a1e;stroke-width:1' }, L0);
    tx(418, 50, 'hemácia (= eritrócito)', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', L0);
    tx(418, 66, 'leva O₂; não forma o coágulo', 'font-size:13px;fill:var(--tinta)', L0);
    el('ellipse', { cx: 400, cy: 102, rx: 7, ry: 4.5, style: 'fill:' + PLA + ';stroke:#5b3a6e;stroke-width:1' }, L0);
    tx(418, 100, 'plaqueta', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', L0);
    tx(418, 116, 'fragmento de célula: inicia', 'font-size:13px;fill:var(--tinta)', L0);
    tx(418, 132, 'a coagulação', 'font-size:13px;fill:var(--tinta)', L0);
    el('circle', { cx: 400, cy: 168, r: 4, style: 'fill:#9a7212' }, L0);
    tx(418, 166, 'fibrinogênio', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', L0);
    tx(418, 182, 'proteína solúvel do plasma', 'font-size:13px;fill:var(--tinta)', L0);
    tx(418, 210, 'leucócitos: defesa', 'font-size:13px;fill:var(--lapis)', L0);
    /* ===== coluna direita: cascata ===== */
    var K = el('g', {});
    tx(388, 22, 'A cascata, no plasma', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', K);
    function chip(y, l1, l2, cor) {
      var g = el('g', {}, K);
      var r = el('rect', { x: 388, y: y, width: 244, height: l2 ? 42 : 28, rx: 9, style: 'fill:color-mix(in srgb,' + cor + ' 12%,var(--folha));stroke:' + cor + ';stroke-width:1.8' }, g);
      tx(398, y + 19, l1, 'font-size:13.5px;font-weight:700;fill:var(--tinta)', g);
      if (l2) tx(398, y + 36, l2, 'font-size:13px;fill:var(--tinta)', g);
      return g;
    }
    var c1 = chip(32, 'plaquetas + tecido lesado', 'liberam tromboplastina', PLA);
    var a1 = el('g', {}, K); el('path', { d: 'M420 78 V100 m-5 -7 l5 7 l5 -7', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, a1); tx(432, 94, '+ Ca²⁺ do plasma', 'font-size:13px;font-weight:600;fill:var(--tinta)', a1);
    var c2 = chip(104, 'protrombina → trombina', '', '#b4442f');
    var a2 = el('g', {}, K); el('path', { d: 'M420 136 V158 m-5 -7 l5 7 l5 -7', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, a2); tx(432, 152, 'a trombina (enzima) age:', 'font-size:13px;font-weight:600;fill:var(--tinta)', a2);
    var c3 = chip(162, 'fibrinogênio → fibrina', 'solúvel no plasma → fios insolúveis', '#9a7212');
    /* ===== coluna direita: foto ===== */
    var F = el('g', {});
    var im = el('image', { x: 384, y: 28, width: 248, height: 186, 'clip-path': 'url(#coag-cpf)', preserveAspectRatio: 'xMidYMid slice' }, F);
    im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'vis/coagulacao-cascata-1.webp'); im.setAttribute('href', 'vis/coagulacao-cascata-1.webp');
    tx(388, 20, 'Foto real (microscópio eletrônico)', 'font-size:13.5px;font-weight:700;fill:var(--tinta)', F);
    function rot(px, py, n, bx, by, txt, cor) {
      var k = 248 / 640, a = [384 + px * k, 28 + py * k];
      var w = txt.length * 7.2 + 14;
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by > a[1] ? by : by + 22, style: 'stroke:#fff;stroke-width:4' }, F);
      el('line', { x1: a[0], y1: a[1], x2: bx + w / 2, y2: by > a[1] ? by : by + 22, style: 'stroke:' + cor + ';stroke-width:2' }, F);
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:#fff;stroke-width:4' }, F);
      el('circle', { cx: a[0], cy: a[1], r: 8, style: 'fill:none;stroke:' + cor + ';stroke-width:2.2' }, F);
      el('rect', { x: bx, y: by, width: w, height: 22, rx: 6, style: 'fill:rgba(255,255,255,.94);stroke:' + cor + ';stroke-width:1.5' }, F);
      tx(bx + 7, by + 16, txt, 'font-size:13px;font-weight:700;fill:' + cor, F);
    }
    rot(362, 170, 1, 392, 36, 'hemácia presa', '#b4442f');
    rot(216, 262, 2, 392, 186, 'fios de fibrina', '#7a5a0a');
    var fotoL = tx(388, 230, 'a rede de fibrina segura as hemácias', 'font-size:13px;fill:var(--lapis)', F);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(L) { P0.textContent = L[0]; P.forEach(function (p, i) { p.textContent = L[i + 1] || ''; }); }
    var _desenha = function (t) {
      var f = t < 2.6 ? 0 : t < 5.2 ? 1 : t < 7.8 ? 2 : 3;
      /* fluxo: mais lento quando o coagulo se forma */
      hem.forEach(function (e, i) {
        var lane = YL + 14 + (i % 4) * 24, x = ((i * 53 + t * 46) % 420) - 24;
        e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', (lane + 3 * Math.sin(t * 2 + i)).toFixed(1));
      });
      vaz.forEach(function (e, i) {
        var u = cl((t - .4 - i * .55) / 1.3), p;
        if (u < .5) p = [lerp(120 + i * 12, 198, u * 2), lerp(110, 150, u * 2)]; else p = [lerp(198, 186 + i * 16, (u - .5) * 2), lerp(150, 214, (u - .5) * 2)];
        e.setAttribute('cx', p[0].toFixed(1)); e.setAttribute('cy', p[1].toFixed(1));
        op(e, f === 0 && t > .4 + i * .55 ? 1 : 0);
      });
      op(colL, f <= 1 ? 1 : .5);
      plq.forEach(function (e, i) {
        var u = ease((t - 2.7 - i * .14) / .9), x = lerp(-20 - i * 18, PLQ[i][0], u), y = lerp(70 + (i % 3) * 22, PLQ[i][1], u);
        e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1));
        e.setAttribute('rx', u >= 1 ? 8 : 6); e.style.fill = u >= 1 ? '#6f3f86' : PLA;
        op(e, t > 2.6 ? 1 : 0);
      });
      op(plqL, f === 1 || f === 2 ? cl((t - 4.0) / .3) : 0); op(plqL2, f === 1 || f === 2 ? cl((t - 4.0) / .3) : 0);
      fat.forEach(function (c, i) {
        var w = ((t - 4.2) / 1.2 - i / 6) % 1; if (w < 0) w += 1;
        var an = -2.6 + i * .55;
        c.setAttribute('cx', (200 + Math.cos(an) * 50 * w).toFixed(1)); c.setAttribute('cy', (156 + Math.sin(an) * 40 * w).toFixed(1));
        op(c, (f === 1 && t > 4.2) || f === 2 ? Math.sin(Math.PI * w) : 0);
      });
      fib.forEach(function (p, i) { op(p, f === 3 ? cl((t - 7.9 - i * .07) / .3) : 0); });
      presas.forEach(function (e, i) { op(e, f === 3 ? cl((t - 8.6 - i * .1) / .3) : 0); });
      op(fibL, f === 3 ? cl((t - 8.4) / .3) : 0); op(fibL2, f === 3 ? cl((t - 8.4) / .3) : 0);
      op(K, f === 2 ? cl((t - 5.2) / .3) : 0); op(L0, f <= 1 ? 1 : 0);
      if (f === 2) { op(c1, cl((t - 5.3) / .3)); op(a1, cl((t - 5.9) / .3)); op(c2, cl((t - 6.2) / .3)); op(a2, cl((t - 6.8) / .3)); op(c3, cl((t - 7.1) / .3)); }
      op(F, f === 3 ? cl((t - 7.9) / .4) : 0);
      if (f === 0) painel(['1. O vaso é lesado', 'A parede rompe, o sangue começa a sair e o colágeno', 'por baixo da parede fica exposto.']);
      else if (f === 1) painel(['2. Plaquetas: o primeiro tampão', 'As plaquetas aderem ao colágeno exposto, grudam umas nas outras e tapam', 'a lesão. Elas e o tecido lesado liberam fatores (tromboplastina).']);
      else if (f === 2) painel(['3. A cascata de proteínas do plasma', 'Com o Ca²⁺, os fatores transformam protrombina em trombina. A trombina', 'é uma enzima: converte o fibrinogênio (solúvel) em fibrina (fios insolúveis).']);
      else painel(['4. A rede de fibrina: o coágulo', 'Os fios de fibrina se prendem à lesão e formam uma rede que retém hemácias', 'e plaquetas. As hemácias não constroem a rede: ficam presas nela.']);
    };
    return fimResposta(VIS.def['coagulacao-cascata'], svg, _desenha, 10.4, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W69fc967' ? 5.15 : 10.35; }
    });
  }
};
VIS.liga('coagulacao-cascata', ['Wc59a85e', 'W69fc967']);
