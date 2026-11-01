/* Fotossintese: fase fotoquimica (membrana do tilacoide) e ciclo de Calvin (estroma), rastreando os atomos de O. */
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
'P726efe3': [
'Por isso a resposta é B',
'A quebra da água (fotólise) acontece na etapa',
'fotoquímica, nas membranas do tilacoide.'
],
'P7d7b52a': [
'Por isso a resposta é B',
'Químico: a equação enxuta, com 6 H₂O. Biólogo: a de 12 H₂O,',
'que mostra que todo o O₂ liberado vem da água.'
],
'W112a894': [
'Por isso a resposta é B',
'A água fornece os H⁺ (e os elétrons) que formam o NADPH',
'e todo o O₂ liberado para a atmosfera.'
],
'W8b77253': [
'Por isso a resposta é E',
'ATP, NADPH, O₂ e fotólise são da fase clara;',
'a redução do CO₂ é do ciclo de Calvin, no estroma.'
],
'Wf6128e5': [
'Por isso a resposta é B',
'O ciclo de Calvin (a fase escura) acontece',
'no estroma do cloroplasto.'
],
'Wc35ca20': [
'Por isso a resposta é C',
'O cloroplasto faz ATP na fase clara e o gasta no',
'ciclo de Calvin para fixar CO₂ em açúcar.'
]
};
VIS.def['fotossintese-fases'] = {
  tit: 'Fotossíntese: o que acontece no tilacoide e no estroma',
  fontes: ['OpenStax, Biology 2e, 8.2 The Light-Dependent Reactions of Photosynthesis — https://openstax.org/books/biology-2e/pages/8-2-the-light-dependent-reactions-of-photosynthesis', 'OpenStax, Biology 2e, 8.3 Using Light Energy to Make Organic Molecules (ciclo de Calvin no estroma) — https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules', 'Wikipedia (en), Photosynthesis (o O₂ liberado vem da água; experimento com isótopos de Ruben e Kamen) — https://en.wikipedia.org/wiki/Photosynthesis'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Fase fotoquímica'], [4, 'Ciclo de Calvin'], [8, 'De onde vêm os átomos']],
  cred: 'Animação feita para o app (esquema fora de escala: um tilacoide em corte e o estroma ao redor). O vermelho marca o oxigênio que veio da água.',
  nota: 'A fase fotoquímica precisa de luz e quebra a água: dela saem o O₂, o ATP e o NADPH. O ciclo de Calvin, no estroma, não usa luz diretamente, mas gasta esse ATP e esse NADPH para transformar CO₂ em açúcar. Experimentos com oxigênio marcado mostram que todo o O₂ liberado vem da água.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    var S = { fase: 'font-size:22px;font-weight:700;fill:var(--tinta)', sub: 'font-size:14px;fill:var(--tinta)', forte: 'font-size:14.5px;font-weight:700;fill:var(--tinta)', lab: 'font-size:13px;font-weight:600;fill:#3f6b2e', mini: 'font-size:13px;fill:var(--lapis)' };
    var VERM = '#c0392b', AZ = '#2b6cb0', ATPc = '#9a7220', NAD = '#6a4c93', VD = '#3f7d2c';
    svg.setAttribute('viewBox', '0 0 640 298');
    /* cloroplasto */
    el('ellipse', { cx: 198, cy: 150, rx: 186, ry: 128, style: 'fill:#e9f3df;stroke:#6f9b55;stroke-width:2.2' });
    el('ellipse', { cx: 198, cy: 150, rx: 179, ry: 121, style: 'fill:none;stroke:#6f9b55;stroke-width:1.4' });
    tx(200, 264, 'estroma', S.lab + ';text-anchor:middle');
    /* tilacoide em corte */
    el('rect', { x: 30, y: 170, width: 228, height: 70, rx: 24, style: 'fill:#d3e8bf;stroke:' + VD + ';stroke-width:4' });
    tx(264, 242, 'tilacoide', S.lab);
    /* complexos na membrana */
    function cx_(x, w, h, cor, nome) { el('rect', { x: x - w / 2, y: 170 - h / 2, width: w, height: h, rx: 5, style: 'fill:' + cor + ';stroke:#2c5a1f;stroke-width:1.3' }); tx(x, 170 + h / 2 + 16, nome, 'font-size:12.5px;font-weight:700;fill:#2c5a1f;text-anchor:middle'); }
    cx_(74, 26, 24, '#5d9b45', 'FSII'); cx_(150, 26, 24, '#5d9b45', 'FSI');
    el('rect', { x: 214, y: 162, width: 12, height: 20, style: 'fill:#d9a43b;stroke:#9a7220;stroke-width:1.2' });
    el('circle', { cx: 220, cy: 152, r: 11, style: 'fill:#e8b84f;stroke:#9a7220;stroke-width:1.4' });
    tx(218, 198, 'ATP sintase', 'font-size:12.5px;font-weight:700;fill:#9a7220;text-anchor:middle');
    /* luz */
    var luz = el('g', {});
    [[46, 70], [124, 146]].forEach(function (p) {
      el('path', { d: 'M' + (p[0] - 22) + ' 56 q6 6 3 12 t3 12 t3 12 t3 12 t3 12 t3 12 l' + (p[1] - p[0] - 2) + ' 30', style: 'fill:none;stroke:#e0a800;stroke-width:2.4;stroke-linecap:round' }, luz);
    });
    tx(58, 52, 'luz', 'font-size:14px;font-weight:700;fill:#c48f00', luz);
    /* agua e O2 (O vermelho = da agua) */
    var agua = el('g', {}); var aT = tx(0, 0, '', 'font-size:14px;font-weight:700', agua);
    function poeH2O(t, n) { t.textContent = ''; var a = el('tspan', {}, t); a.textContent = n + 'H₂'; a.style.fill = 'var(--tinta)'; var b = el('tspan', {}, t); b.textContent = 'O'; b.style.fill = VERM; }
    poeH2O(aT, '2 ');
    var o2 = el('g', {}); var o2T = tx(0, 0, 'O₂', 'font-size:15px;font-weight:700;fill:' + VERM, o2);
    var hs = [0, 1, 2, 3].map(function (i) { return tx(0, 0, 'H⁺', 'font-size:12.5px;font-weight:700;fill:#6b8f2a'); });
    var ele = [0, 1].map(function () { return el('circle', { r: 5, style: 'fill:' + AZ }); });
    var nadph = el('g', {}); tx(0, 0, 'NADPH', 'font-size:13.5px;font-weight:700;fill:' + NAD, nadph);
    var atp = el('g', {}); tx(0, 0, 'ATP', 'font-size:13.5px;font-weight:700;fill:' + ATPc, atp);
    var volta = el('g', {}); tx(0, 0, 'ADP + Pi, NADP⁺', 'font-size:12.5px;fill:var(--lapis);text-anchor:end', volta);
    /* ciclo de Calvin */
    var KX = 296, KY = 112;
    var gK = el('g', {});
    el('circle', { cx: KX, cy: KY, r: 34, style: 'fill:none;stroke:' + VD + ';stroke-width:2.6;stroke-dasharray:150 64' }, gK);
    var kS = el('path', { d: 'M0 -6 L8 0 L0 6 Z', style: 'fill:' + VD }, gK);
    tx(KX, KY - 2, 'ciclo de', 'font-size:12.5px;font-weight:700;fill:' + VD + ';text-anchor:middle', gK);
    tx(KX, KY + 13, 'Calvin', 'font-size:12.5px;font-weight:700;fill:' + VD + ';text-anchor:middle', gK);
    var rub = tx(KX + 22, KY + 52, 'rubisco', 'font-size:12.5px;font-style:italic;fill:' + VD);
    var co2 = el('g', {}); var cT = tx(0, 0, '', 'font-size:15px;font-weight:700;fill:' + AZ, co2); cT.textContent = 'CO₂';
    var acu = el('g', {}); tx(0, 0, 'açúcar', 'font-size:14px;font-weight:700;fill:' + AZ, acu);
    /* painel */
    var px = 398;
    var fase = tx(px, 40, '', S.fase), onde = tx(px, 64, '', S.forte);
    var L = [0, 1, 2, 3, 4, 5].map(function (i) { return tx(px, 92 + i * 19, '', S.sub); });
    var eq = el('g', {});
    function linha(y, partes) { var t = tx(px, y, '', 'font-size:15px;font-weight:700', eq); partes.forEach(function (p) { var s = el('tspan', {}, t); s.textContent = p[0]; s.style.fill = p[1]; }); }
    var T = 'var(--tinta)';
    linha(222, [['6 C', T], ['O₂', AZ], [' + 12 H₂', T], ['O', VERM], [' →', T]]);
    linha(244, [['C₆H₁₂', T], ['O₆', AZ], [' + 6 ', T], ['O₂', VERM], [' + 6 H₂', T], ['O', AZ]]);
    tx(px, 270, 'vermelho: O da água', 'font-size:13px;font-weight:700;fill:' + VERM, eq);
    tx(px, 288, 'azul: O do CO₂', 'font-size:13px;font-weight:700;fill:' + AZ, eq);
    var _desenha = function (t) {
      var f = t < 4 ? 0 : t < 8 ? 1 : 2;
      op(luz, f === 0 ? 1 : f === 1 ? .35 : .6);
      /* agua quebrando no FSII (lado de dentro) */
      var uq = cl((t - .6) / .8);
      mv(agua, 44, 228); op(agua, f === 0 ? 1 - uq : f === 2 ? 1 : 0);
      /* O2 sobe e sai do cloroplasto */
      var uo = ease((t - 1.3) / 2.2);
      mv(o2, lerp(70, 10, uo), lerp(222, 36, uo)); op(o2, (f === 0 && t > 1.3) || f === 2 ? 1 : 0);
      if (f === 2) mv(o2, 10, 36);
      hs.forEach(function (h, i) { mv(h, 100 + i * 24 + 6 * Math.sin(t * 3 + i), 226 + 5 * Math.cos(t * 2 + i)); op(h, t > 1.2 && t < 8 ? .9 : 0); });
      /* eletrons FSII -> FSI -> NADP+ */
      ele.forEach(function (e, i) {
        var v = ((t - 1) / 1.4 - i * .5) % 1; if (v < 0) v += 1;
        var x = v < .7 ? lerp(80, 150, v / .7) : 150 + (v - .7) / .3 * 6, y = v < .7 ? 170 : lerp(170, 154, (v - .7) / .3);   /* dentro da membrana; no fim sai na face do estroma (NADP+ -> NADPH) */
        e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); op(e, t > 1 && t < 4 ? 1 : 0);
      });
      /* NADPH e ATP: formam-se no lado do estroma e vao ao ciclo */
      var ug = ease((t - 4) / 1.2);
      mv(nadph, lerp(126, 214, ug), lerp(116, 102, ug)); op(nadph, t > 2.4 && t < 6 ? cl((t - 2.4) / .4) * (1 - cl((t - 5.4) / .5)) : 0);
      mv(atp, lerp(236, 230, ug), lerp(144, 132, ug)); op(atp, t > 3 && t < 6 ? cl((t - 3) / .4) * (1 - cl((t - 5.4) / .5)) : 0);
      var uv = ease((t - 6.8) / 1.2);
      mv(volta, lerp(258, 200, uv), lerp(72, 68, uv)); op(volta, t > 6.6 && t < 8 ? Math.sin(Math.PI * cl((t - 6.6) / 1.4)) : 0);
      /* ciclo de Calvin */
      op(gK, f === 0 ? .3 : 1); op(rub, f === 0 ? .3 : 1);
      var ang = (t - 4) * 1.8, kx = KX + 34 * Math.cos(ang), ky = KY + 34 * Math.sin(ang);
      kS.setAttribute('transform', 'translate(' + kx.toFixed(1) + ' ' + ky.toFixed(1) + ') rotate(' + (ang * 180 / Math.PI + 90).toFixed(0) + ')');
      var uc = ease((t - 4.4) / 1.4);
      mv(co2, lerp(352, 318, uc), lerp(40, 82, uc)); op(co2, f === 1 ? 1 - cl((t - 5.8) / .4) : f === 2 ? 1 : 0); if (f === 2) mv(co2, 352, 40);
      var ua = ease((t - 6.2) / 1.4);
      mv(acu, lerp(266, 262, ua), lerp(176, 208, ua)); op(acu, f === 1 && t > 6.2 ? 1 : f === 2 ? 1 : 0); if (f === 2) mv(acu, 262, 208);
      /* painel */
      op(eq, f === 2 ? 1 : 0);
      var P;
      if (f === 0) P = ['Fase fotoquímica', 'nas membranas do tilacoide', ['A luz excita a clorofila dos', 'fotossistemas. Para repor', 'elétrons, o FSII quebra a água', '(fotólise): sai O₂. Elétrons e', 'H⁺ geram NADPH, e a ATP', 'sintase fabrica ATP.']];
      else if (f === 1) P = ['Ciclo de Calvin', 'no estroma (fase química)', ['A rubisco fixa o CO₂. O ATP', 'paga a energia e o NADPH', 'doa hidrogênios: o CO₂ vira', 'açúcar. Não usa luz direto,', 'mas para quando acabam o', 'ATP e o NADPH.']];
      else P = ['De onde vêm os átomos', 'experimento com O marcado', ['O O₂ liberado vem só da água;', 'o O do CO₂ vai para o açúcar', 'e para a água nova.', '', '', '']];
      fase.textContent = P[0]; onde.textContent = P[1]; L.forEach(function (x, i) { x.textContent = P[2][i]; });
    };
    return fimResposta(VIS.def['fotossintese-fases'], svg, _desenha, 12, RESP, qid, { congela: function (q) { return q === 'P726efe3' || q === 'W112a894' ? 2.8 : q === 'P7d7b52a' ? 11.99 : 6.8; } });
  }
};
VIS.liga('fotossintese-fases', ['P726efe3', 'P7d7b52a', 'W112a894', 'W8b77253', 'Wf6128e5', 'Wc35ca20']);
