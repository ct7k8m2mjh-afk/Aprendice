/* Respiracao celular: onde acontece cada etapa (citosol, matriz, membrana interna) e o ATP de cada uma. */
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
'Wd411595': [
'Por isso a resposta é A',
'As enzimas da glicólise estão dissolvidas no citosol:',
'a substância agiu no hialoplasma.'
],
'Wf97a6d7': [
'Por isso a resposta é C',
'I certa (a fosforilação oxidativa é na mitocôndria) e II certa',
'(a fase aeróbia faz a maior parte do ATP). III errada: a',
'glicólise não tem fase aeróbia. Corretas: I e II.'
],
'Wc9151a1': [
'Por isso a resposta é B',
'O ciclo de Krebs é feito por enzimas dissolvidas',
'na matriz mitocondrial.'
],
'W4e3e995': [
'Por isso a resposta é C',
'I certa; II errada (a cadeia fica na membrana interna, não',
'na matriz); III errada (a fosforilação oxidativa não libera',
'CO₂); IV certa (O₂ é o aceptor final). Corretas: I e IV.'
],
'Wb18640b': [
'Por isso a resposta é C',
'A organela é a mitocôndria, e a ordem é glicólise',
'(no citosol), ciclo de Krebs e cadeia respiratória.'
]
};
VIS.def['respiracao-celular-onde-ocorre'] = {
  tit: 'Respiração celular: onde acontece cada etapa',
  fontes: ['OpenStax, Biology 2e, 7.2 Glycolysis — https://openstax.org/books/biology-2e/pages/7-2-glycolysis', 'OpenStax, Biology 2e, 7.4 Oxidative Phosphorylation — https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation', 'OpenStax, Biology 2e, 7.3 Oxidation of Pyruvate and the Citric Acid Cycle — https://openstax.org/books/biology-2e/pages/7-3-oxidation-of-pyruvate-and-the-citric-acid-cycle', 'Wikipedia (en), Cellular respiration — https://en.wikipedia.org/wiki/Cellular_respiration'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Glicólise'], [2.8, 'Acetil-CoA'], [4.6, 'Krebs'], [7.6, 'Cadeia respiratória']],
  cred: 'Animação feita para o app (esquema fora de escala; a mitocôndria aparece ampliada à direita). Rendimento pela contagem atual: cerca de 30 a 32 ATP por glicose.',
  nota: 'Endereços: glicólise no citosol (hialoplasma), sem O₂; ciclo de Krebs na matriz, onde as enzimas estão dissolvidas; cadeia respiratória e ATP sintase encaixadas na membrana interna (cristas). O O₂ só entra no fim, como aceptor final de elétrons, formando água.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    var S = { sub: 'font-size:14.5px;fill:var(--tinta)', forte: 'font-size:15px;font-weight:700;fill:var(--tinta)', lab: 'font-size:13px;font-weight:600;fill:var(--lapis)', mini: 'font-size:13px;fill:var(--lapis)' };
    var MEM = '#c47a5e', ESP = '#f4d9cb', MAT = '#fbeee5', GLI = '#c98a12', PIR = '#d26a3a', CO2 = '#777', ELE = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 350');
    /* ---------- celula (esquerda) ---------- */
    el('rect', { x: 14, y: 34, width: 222, height: 214, rx: 34, style: 'fill:color-mix(in srgb,#9fc9a8 18%,var(--folha));stroke:#6f9b78;stroke-width:2.2' });
    tx(26, 236, 'citosol (hialoplasma)', S.lab);
    el('circle', { cx: 66, cy: 178, r: 26, style: 'fill:color-mix(in srgb,#8c7ab0 22%,var(--folha));stroke:#8c7ab0;stroke-width:1.8' });
    tx(66, 183, 'núcleo', 'font-size:13px;fill:#6b5a92;text-anchor:middle');
    el('ellipse', { cx: 186, cy: 96, rx: 30, ry: 15, style: 'fill:' + MAT + ';stroke:' + MEM + ';stroke-width:2' });
    el('path', { d: 'M166 96 q4 -9 8 0 q4 9 8 0 q4 -9 8 0 q4 9 8 0', style: 'fill:none;stroke:' + MEM + ';stroke-width:1.5' });
    /* linhas de zoom */
    el('path', { d: 'M208 85 L292 46 M208 107 L292 236', style: 'stroke:var(--lapis);stroke-width:1;stroke-dasharray:4 4;fill:none' });
    /* ---------- mitocondria ampliada (direita) ---------- */
    var MX = 456, MY = 141;
    el('ellipse', { cx: MX, cy: MY, rx: 168, ry: 96, style: 'fill:' + ESP + ';stroke:' + MEM + ';stroke-width:3' });
    el('ellipse', { cx: MX, cy: MY, rx: 154, ry: 82, style: 'fill:' + MAT + ';stroke:' + MEM + ';stroke-width:3' });
    var cristas = [[346, 1], [396, -1], [516, -1], [568, -1]];
    function elipY(x, s) { var u = (x - MX) / 154; return MY + s * 82 * Math.sqrt(Math.max(0, 1 - u * u)); }
    cristas.forEach(function (c) {
      var y0 = elipY(c[0], c[1]), y1 = y0 - c[1] * 46, d = 'M' + c[0] + ' ' + (y0 + c[1] * 3) + ' L' + c[0] + ' ' + y1;
      el('path', { d: d, style: 'stroke:' + MEM + ';stroke-width:13;stroke-linecap:round' });
      el('path', { d: d, style: 'stroke:' + ESP + ';stroke-width:6;stroke-linecap:round' });
    });
    tx(300, 30, 'membrana externa', S.lab); el('path', { d: 'M360 34 L392 52', style: 'stroke:var(--lapis);stroke-width:1' });
    tx(626, 24, 'membrana interna', S.lab + ';text-anchor:end'); tx(626, 39, '(cristas)', S.lab + ';text-anchor:end');
    el('path', { d: 'M592 44 L568 100', style: 'stroke:var(--lapis);stroke-width:1' });
    tx(488, 180, 'matriz', 'font-size:14px;font-weight:700;fill:#a0583d;text-anchor:middle');
    /* ciclo de Krebs */
    var gK = el('g', { style: 'opacity:0' });
    el('circle', { cx: MX, cy: MY + 4, r: 26, style: 'fill:none;stroke:#a0583d;stroke-width:2.4;stroke-dasharray:120 44' }, gK);
    var kSeta = el('path', { d: 'M0 -6 L8 0 L0 6 Z', style: 'fill:#a0583d' }, gK);
    tx(MX, MY + 9, 'Krebs', 'font-size:13px;font-weight:700;fill:#a0583d;text-anchor:middle', gK);
    /* cadeia respiratoria: complexos na membrana interna (borda de baixo) e ATP sintase */
    var gC = el('g', { style: 'opacity:0' });
    var CX = [404, 430, 456, 482];
    CX.forEach(function (x) { var y = elipY(x, 1); el('rect', { x: x - 8, y: y - 11, width: 16, height: 22, rx: 5, style: 'fill:#6d8fc4;stroke:#3d5f94;stroke-width:1.4' }, gC); });
    var xs = 556, ys = elipY(556, 1);
    el('rect', { x: xs - 5, y: ys - 4, width: 10, height: 16, style: 'fill:#d9a43b;stroke:#9a7220;stroke-width:1.2' }, gC);
    el('circle', { cx: xs, cy: ys - 12, r: 10, style: 'fill:#e8b84f;stroke:#9a7220;stroke-width:1.4' }, gC);
    tx(626, 262, 'ATP sintase', 'font-size:13px;font-weight:700;fill:#9a7220;text-anchor:end', gC); el('path', { d: 'M586 250 L' + (xs + 4) + ' ' + (ys + 10), style: 'stroke:#9a7220;stroke-width:1' }, gC);
    var o2 = tx(300, 262, '', 'font-size:14px;font-weight:700;fill:' + ELE); var o2l = el('path', { d: 'M372 250 L398 222', style: 'stroke:' + ELE + ';stroke-width:1' });
    /* particulas */
    var gli = el('path', { style: 'fill:' + GLI + ';stroke:#8d6008;stroke-width:1.4' });
    var gliT = tx(0, 0, 'glicose', 'font-size:13px;font-weight:700;fill:#8d6008');
    var pir = [0, 1].map(function () { return el('path', { d: 'M0 -8 L8 6 L-8 6 Z', style: 'fill:' + PIR + ';stroke:#8e3f1c;stroke-width:1.2' }); });
    var pirT = tx(0, 0, '2 piruvato', 'font-size:13px;font-weight:700;fill:#8e3f1c');
    var co2 = [0, 1, 2].map(function () { return tx(0, 0, 'CO₂', 'font-size:13px;font-weight:700;fill:' + CO2); });
    var ele = [0, 1, 2].map(function () { return el('circle', { r: 5, style: 'fill:' + ELE }); });
    var atps = [0, 1, 2].map(function () { return tx(0, 0, 'ATP', 'font-size:12.5px;font-weight:700;fill:#9a7220'); });
    var semO2 = tx(30, 56, 'não usa O₂', 'font-size:13px;font-weight:700;fill:' + GLI);
    /* painel de baixo */
    var p1 = tx(14, 296, '', S.forte), p2 = tx(14, 317, '', S.sub), p3 = tx(14, 337, '', S.sub);
    tx(626, 296, 'ATP por glicose', S.lab + ';text-anchor:end');
    var cont = tx(626, 330, '', 'font-size:26px;font-weight:700;fill:#9a7220;text-anchor:end');
    function hexa(x, y, r) { var d = ''; for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i + Math.PI / 6; d += (i ? 'L' : 'M') + (x + r * Math.cos(a)).toFixed(1) + ' ' + (y + r * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; }
    function mostra(o, v) { o.style.opacity = v.toFixed(2); }
    var _desenha = function (t) {
      /* fase 1: glicolise no citosol */
      var u1 = cl(t / 2.6), split = ease((u1 - .45) / .4);
      var gx = lerp(46, 108, ease(u1 / .45)), gy = lerp(70, 118, ease(u1 / .45));
      gli.setAttribute('d', hexa(gx, gy, 12)); mostra(gli, t < 2.8 ? 1 - split : 0);
      gliT.setAttribute('x', gx - 16); gliT.setAttribute('y', gy + 28); mostra(gliT, t < 2.8 ? 1 - split : 0);
      mostra(semO2, t < 2.8 ? 1 : 0);
      /* piruvatos: separam-se, vao ate a mitocondria pequena e reaparecem na grande */
      var u2 = cl((t - 2.8) / 1.8);
      pir.forEach(function (p, i) {
        var x, y, op;
        if (t < 2.8) { x = gx + (i ? 1 : -1) * 16 * split; y = gy + 4; op = split; }
        else if (u2 < .35) { var v = ease(u2 / .35); x = lerp(108 + (i ? 16 : -16), 176, v); y = lerp(122, 96 + (i ? 6 : -6), v); op = 1 - v * .6; }
        else { var w = ease((u2 - .35) / .65); x = lerp(300, 382, w); y = MY - 6 + (i ? 14 : -14); op = 1 - cl((u2 - .8) / .2); }
        p.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); mostra(p, t < 4.6 ? op : 0);
      });
      pirT.setAttribute('x', t < 2.8 ? 80 : 366); pirT.setAttribute('y', t < 2.8 ? 148 : MY + 32);
      mostra(pirT, t < 2.8 ? split : t < 4.4 && u2 > .35 ? 1 : 0);
      /* CO2 saindo: na formacao do acetil-CoA e no Krebs */
      co2.forEach(function (c, i) {
        var t0 = i === 0 ? 3.6 : 5.2 + (i - 1) * 1.1, v = cl((t - t0) / 1.4);
        c.setAttribute('x', (MX - 30 + i * 30).toFixed(0)); c.setAttribute('y', (MY - 10 - 110 * v).toFixed(1));
        mostra(c, t > t0 && t < t0 + 1.4 ? Math.sin(Math.PI * v) : 0);
      });
      /* Krebs */
      var kOn = t >= 4.6 && t < 7.6 ? 1 : t >= 7.6 ? .35 : 0; mostra(gK, kOn);
      var ang = (t - 4.6) * 2.2, kx = MX + 26 * Math.cos(ang), ky = MY + 4 + 26 * Math.sin(ang);
      kSeta.setAttribute('transform', 'translate(' + kx.toFixed(1) + ' ' + ky.toFixed(1) + ') rotate(' + ((ang * 180 / Math.PI) + 90).toFixed(0) + ')');
      /* cadeia */
      mostra(gC, t >= 7.6 ? 1 : t > 7.2 ? (t - 7.2) / .4 : 0);
      ele.forEach(function (e, i) {
        var v = ((t - 7.6) / 1.6 - i * .33) % 1; if (v < 0) v += 1;
        var x = lerp(482, 392, v), y = elipY(x, 1) - 20;
        e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); mostra(e, t >= 7.8 && t < 11.2 ? 1 : 0);
      });
      o2.textContent = t >= 8.2 ? '½ O₂ + 2 e⁻ + 2 H⁺ → H₂O' : ''; mostra(o2l, t >= 8.2 ? 1 : 0);
      atps.forEach(function (a, i) {
        var v = ((t - 8) / 1.2 - i * .33) % 1; if (v < 0) v += 1;
        a.setAttribute('x', (xs - 26 + 6 * i).toFixed(0)); a.setAttribute('y', (ys - 24 - 50 * v).toFixed(1));
        mostra(a, t >= 8 && t < 11.4 ? Math.sin(Math.PI * v) : 0);
      });
      /* textos */
      var L, n;
      if (t < 2.8) { L = ['1. Glicólise: no citosol (hialoplasma)', 'A glicose é quebrada em 2 piruvatos. Não usa O₂ e não', 'precisa de organela. Saldo: 2 ATP (e 2 NADH).']; n = '2'; }
      else if (t < 4.6) { L = ['2. Piruvato → acetil-CoA: na matriz', 'O piruvato atravessa as duas membranas e chega à matriz;', 'ali perde um carbono, que sai como CO₂.']; n = '2'; }
      else if (t < 7.6) { L = ['3. Ciclo de Krebs: na matriz', 'Enzimas dissolvidas no líquido da matriz oxidam o acetil-CoA:', 'sai CO₂ e os elétrons vão para NADH e FADH₂. Saldo: 2 ATP.']; n = t < 5.2 ? '2' : '4'; }
      else { L = ['4. Cadeia respiratória: na membrana interna (cristas)', 'NADH e FADH₂ entregam elétrons aos complexos; o O₂ é o aceptor', 'final e vira água. A ATP sintase faz a maior parte do ATP.']; var k = cl((t - 8) / 2.6); n = k < 1 ? String(Math.round(4 + 26 * k)) : '30 a 32'; }
      p1.textContent = L[0]; p2.textContent = L[1]; p3.textContent = L[2]; cont.textContent = n;
    };
    return fimResposta(VIS.def['respiracao-celular-onde-ocorre'], svg, _desenha, 12, RESP, qid, { congela: function (q) { return q === 'Wd411595' ? 1.5 : q === 'Wc9151a1' ? 6 : q === 'Wf97a6d7' || q === 'W4e3e995' ? 9.5 : 11.99; } });
  }
};
VIS.liga('respiracao-celular-onde-ocorre', ['Wd411595', 'Wf97a6d7', 'Wc9151a1', 'W4e3e995', 'Wb18640b']);
