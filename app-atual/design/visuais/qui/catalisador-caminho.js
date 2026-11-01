/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid).
   R[qid] = ['Por isso a resposta é X', 'linha', ...]. Sem entrada para o qid, o visual fica como era. */
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
  var n = r.length - 1, w = opc.w || 560, h = opc.h || 62 + 22 * n, x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  if (opc.base) { h = Math.max(h, opc.hmin || 0); y = vb[3] - h - 4; }
  if (y + h > vb[3] - 3) y = vb[3] - h - 3;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 20, y: y + 33, style: 'font-size:19px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  r.slice(1).forEach(function (s, i) { var t = el('text', { x: x + 20, y: y + 61 + 22 * i, style: 'font-size:15px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;   /* quadro congelado na etapa Resposta */
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .16 : 1; c.style.opacity = on ? 1 : 0;
    (opc.oculta || []).forEach(function (o) { o.style.visibility = on ? 'hidden' : 'visible'; });
  };
}
var RESP = {
'Wcfb2f0c': ['Por isso a resposta é B', 'O catalisador abre outro caminho, com pico mais baixo (Ea menor).', 'Reagentes e produtos ficam no mesmo nível (ΔH igual); a Ea não vai a zero', 'e o catalisador não é consumido.'],
'W2d73799': ['Por isso a resposta é D', 'Catalisadores abrem um caminho de menor energia de ativação: a reação', 'fica rápida sem precisar de temperatura e pressão altas.'],
'P7d837fb': ['Por isso a resposta é B', 'Catalisador (como a platina) aumenta a velocidade de reações específicas:', 'baixa a Ea daquela reação. Não muda o equilíbrio nem só "gases".'],
'P806ca45': ['Por isso a resposta é D', 'O H⁺ participa e é devolvido: não entra na estequiometria nem muda o ΔH', 'ou o rendimento. Ele baixa a energia de ativação: a reação fica mais rápida.'],
'Pa2c8972': ['Por isso a resposta é D', 'O Cu⁺ entra numa etapa e é devolvido na seguinte: ao final da reação', 'a quantidade (e a concentração) dele é a mesma do início.', 'Não é consumido, não é reagente limitante e não muda o ΔH.'],
'P109c1db': ['Por isso a resposta é D', 'O experimento 4 tem as mesmas condições do 3 (2,5 mol/L, 20 °C),', 'mas termina em 2 min em vez de 12: nada explica isso além', 'de um catalisador, a urease.'],
'P4a2ba30': ['Por isso a resposta é D', 'A 36 °C a enzima está na atividade máxima; a 40 °C parte dela já desnatura.', 'Com mais enzima ativa a 36 °C, a energia de ativação efetiva é menor', 'e a velocidade da reação é maior.']
};
VIS.def['catalisador-caminho'] = {
  tit: 'Catalisador: outro caminho, mais baixo',
  fontes: ['OpenStax, Chemistry 2e, 12.7 Catalysis — https://openstax.org/books/chemistry-2e/pages/12-7-catalysis', 'IUPAC Gold Book, catalyst — https://goldbook.iupac.org/terms/view/C00876', 'OpenStax, Biology 2e, 6.5 Enzymes (temperatura ótima e desnaturação) — https://openstax.org/books/biology-2e/pages/6-5-enzymes'],
  tipo: 'anim', dur: 17,
  marcas: [[0, 'Caminhos'], [4.5, 'Sai intacto'], [9, 'Experimentos'], [13, 'Enzima × T']],
  cred: 'Animação feita para o app (esquema; energias sem escala). Tempos dos experimentos de exemplo: os da questão da urease.',
  nota: 'O catalisador participa da reação por um caminho de menor energia de ativação e é regenerado no fim. Não muda reagentes, produtos, ΔH, estequiometria nem a posição do equilíbrio: só a rapidez. Enzimas são catalisadores biológicos, mais ativos na temperatura ótima.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var VM = '#b4442f', AZ = '#2b6cb0', VD = '#1f8a70', OU = '#c98a12';
    var C = 'text-anchor:middle';
    svg.setAttribute('viewBox', '0 0 640 410');
    function curvaN(N) { return function (s) { for (var i = 1; i < N.length; i++) if (s <= N[i][0]) { var u = (s - N[i - 1][0]) / (N[i][0] - N[i - 1][0]); return lerp(N[i - 1][1], N[i][1], u * u * (3 - 2 * u)); } return N[N.length - 1][1]; }; }
    /* ---------- etapa 1: dois caminhos ---------- */
    var g1 = el('g', {});
    var X0 = 70, X1 = 420, Y0 = 236, Y1 = 26;
    function gx(s) { return X0 + 20 + (X1 - X0 - 30) * s; } function gy(E) { return Y0 - (Y0 - Y1) * (E + 20) / 90; }
    var sem = curvaN([[0, 20], [.16, 20], [.5, 64], [.84, -10], [1, -10]]), com = curvaN([[0, 20], [.16, 20], [.34, 38], [.5, 26], [.66, 34], [.84, -10], [1, -10]]);
    el('path', { d: 'M' + X0 + ' ' + (Y1 - 6) + ' V' + Y0 + ' H' + (X1 + 6), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, g1);
    tx(14, 16, 'energia', 'font-size:14px;fill:var(--lapis)', g1); tx(X1, Y0 + 20, 'caminho da reação →', 'font-size:14px;fill:var(--lapis);text-anchor:end', g1);
    function path(f) { var d = ''; for (var s = 0; s <= 1.0001; s += .01) d += (d ? 'L' : 'M') + gx(s).toFixed(1) + ' ' + gy(f(s)).toFixed(1) + ' '; return d; }
    el('path', { d: path(sem), style: 'fill:none;stroke:var(--tinta);stroke-width:3' }, g1);
    var pc = el('path', { d: path(com), style: 'fill:none;stroke:' + VD + ';stroke-width:3;stroke-dasharray:8 5' }, g1);
    tx(gx(.5), gy(64) - 10, 'sem catalisador', 'font-size:14px;font-weight:700;fill:var(--tinta);' + C, g1);
    var lc = tx(gx(.5), gy(26) + 26, 'com catalisador', 'font-size:14px;font-weight:700;fill:' + VD + ';' + C, g1);
    tx(gx(.06), gy(20) + 22, 'reagentes', 'font-size:14px;font-weight:700;fill:var(--tinta)', g1); tx(gx(1), gy(-10) + 22, 'produtos', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:end', g1);
    el('line', { x1: gx(.02), x2: gx(.5), y1: gy(64), y2: gy(64), style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, g1);
    el('line', { x1: gx(.02), x2: gx(.34), y1: gy(38), y2: gy(38), style: 'stroke:' + VD + ';stroke-width:1.2;stroke-dasharray:4 4' }, g1);
    function sv(pai, x, y1, y2, cor, rot, esq) { var g = el('g', {}, pai), s = y2 < y1 ? -1 : 1; el('path', { d: 'M' + x + ' ' + y1 + ' V' + y2 + ' m-6 ' + (-s * 9) + ' l6 ' + (s * 9) + ' l6 ' + (-s * 9), style: 'fill:none;stroke:' + cor + ';stroke-width:2.6' }, g); tx(x + (esq ? -8 : 8), (y1 + y2) / 2 + 5, rot, 'font-size:15px;font-weight:700;fill:' + cor + (esq ? ';text-anchor:end' : ''), g); return g; }
    var ea1 = sv(g1, gx(.04), gy(20), gy(64) + 2, OU, 'Ea', false), ea2 = sv(g1, gx(.12), gy(20), gy(38) + 2, VD, 'Ea', false);
    el('line', { x1: gx(.16), x2: gx(.98), y1: gy(20), y2: gy(20), style: 'stroke:var(--lapis);stroke-width:1.2;stroke-dasharray:4 4' }, g1);
    var dh = sv(g1, gx(.9), gy(20), gy(-10) - 2, VM, 'ΔH', false);
    var b1 = el('circle', { r: 8, style: 'fill:var(--tinta);stroke:var(--folha);stroke-width:2' }, g1), b2 = el('circle', { r: 8, style: 'fill:' + VD + ';stroke:var(--folha);stroke-width:2' }, g1);
    var inf1 = el('g', {}, g1);
    [['mesmos reagentes', 'var(--tinta)', 400], ['mesmos produtos', 'var(--tinta)', 400], ['mesmo ΔH', VM, 700], ['pico mais baixo:', VD, 700], ['Ea menor, mais rápida', VD, 700]].forEach(function (l, i) { tx(444, 60 + i * 28, l[0], 'font-size:15px;font-weight:' + l[2] + ';fill:' + l[1], inf1); });
    /* ---------- etapa 2: ciclo do catalisador ---------- */
    var g2 = el('g', {});
    var CN = qid === 'Pa2c8972' ? 'Cu⁺' : qid === 'P806ca45' ? 'H⁺' : 'cat';
    var CXc = 170, CYc = 136, RC = 60;
    el('circle', { cx: CXc, cy: CYc, r: RC, style: 'fill:none;stroke:var(--linha);stroke-width:2;stroke-dasharray:6 6' }, g2);
    var EST = [[-90, 'catalisador livre'], [0, 'prende o reagente'], [90, 'intermediário'], [180, 'solta o produto']];
    EST.forEach(function (e) { var a = e[0] * Math.PI / 180, x = CXc + Math.cos(a) * RC, y = CYc + Math.sin(a) * RC; el('circle', { cx: x, cy: y, r: 5, style: 'fill:var(--lapis)' }, g2);
      tx(x + (e[0] === 0 ? 14 : e[0] === 180 ? -14 : 0), y + (e[0] === -90 ? -14 : e[0] === 90 ? 28 : 5), e[1], 'font-size:14px;fill:var(--tinta);' + (e[0] === 0 ? '' : e[0] === 180 ? 'text-anchor:end' : C), g2); });
    var tok = el('g', {}, g2); el('circle', { r: 17, style: 'fill:' + VD }, tok); tx(0, 5, CN, 'font-size:14px;font-weight:700;fill:#fff;' + C, tok);
    var rea = el('g', {}, g2); el('rect', { x: -12, y: -12, width: 24, height: 24, rx: 4, style: 'fill:' + OU }, rea); tx(0, 5, 'R', 'font-size:14px;font-weight:700;fill:#fff;' + C, rea);
    var pro = el('g', {}, g2); el('path', { d: 'M0 -14 L14 0 L0 14 L-14 0 Z', style: 'fill:' + AZ }, pro); tx(0, 5, 'P', 'font-size:14px;font-weight:700;fill:#fff;' + C, pro);
    var cont = tx(372, 70, '', 'font-size:16px;font-weight:700;fill:var(--tinta)', g2), cont2 = tx(372, 100, '', 'font-size:16px;font-weight:700;fill:' + VD, g2);
    var inf2 = el('g', {}, g2);
    ['entra numa etapa e sai na seguinte:', 'no fim há a mesma quantidade', 'não entra na estequiometria', 'não muda o ΔH nem o rendimento'].forEach(function (s, i) { tx(372, 146 + i * 26, s, 'font-size:15px;fill:' + (i < 2 ? VD : 'var(--tinta)') + ';font-weight:' + (i < 2 ? 700 : 400), inf2); });
    /* ---------- etapa 3: experimentos ---------- */
    var g3 = el('g', {});
    tx(14, 24, 'hidrólise da ureia: tempo para reagir', 'font-size:16px;font-weight:700;fill:var(--tinta)', g3);
    var EXP = [['2,5 mol/L · 20 °C', 12, 'var(--lapis)', 'referência (exp. 3)'], ['10 mol/L · 20 °C', 8, AZ, 'mais concentrado (exp. 1)'], ['2,5 mol/L · 60 °C', 8, VM, 'mais quente (exp. 5)'], ['2,5 mol/L · 20 °C', 2, VD, 'mesmas condições: catalisador! (exp. 4)']];
    var bars = EXP.map(function (e, i) { var y = 44 + i * 50, g = el('g', {}, g3);
      tx(14, y + 19, e[0], 'font-size:15px;font-weight:700;fill:var(--tinta)', g);
      var r = el('rect', { x: 170, y: y + 2, height: 24, rx: 4, style: 'fill:color-mix(in srgb,' + e[2] + ' 30%,var(--folha));stroke:' + e[2] + ';stroke-width:1.4' }, g);
      var tt = tx(0, y + 20, e[1] + ' min', 'font-size:15px;font-weight:700;fill:var(--tinta)', g);
      tx(170, y + 44, e[3], 'font-size:14px;fill:' + (i === 3 ? VD : 'var(--lapis)') + ';font-weight:' + (i === 3 ? 700 : 400), g);
      return { g: g, r: r, tt: tt, v: e[1] }; });
    /* ---------- etapa 4: enzima x temperatura ---------- */
    var g4 = el('g', {});
    var TX0 = 70, TX1 = 330, TY0 = 220, TY1 = 40;
    function tX(T) { return TX0 + (TX1 - TX0) * (T - 20) / 30; } function at(T) { return T <= 36 ? Math.exp(-Math.pow((T - 36) / 9, 2)) : Math.exp(-Math.pow((T - 36) / 3.5, 2)); } function tY(a) { return TY0 - (TY0 - TY1) * a; }
    el('path', { d: 'M' + TX0 + ' ' + (TY1 - 10) + ' V' + TY0 + ' H' + (TX1 + 8), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' }, g4);
    tx(14, 12, 'atividade da enzima', 'font-size:14px;fill:var(--lapis)', g4);
    [20, 30, 40, 50].forEach(function (T) { tx(tX(T), TY0 + 18, T + '', 'font-size:14px;fill:var(--lapis);' + C, g4); }); tx(TX1 + 8, TY0 + 36, '°C', 'font-size:14px;fill:var(--lapis);text-anchor:end', g4);
    var d = ''; for (var T = 20; T <= 50; T += .25) d += (d ? 'L' : 'M') + tX(T).toFixed(1) + ' ' + tY(at(T)).toFixed(1) + ' ';
    el('path', { d: d, style: 'fill:none;stroke:' + VD + ';stroke-width:3' }, g4);
    var m36 = el('g', {}, g4), m40 = el('g', {}, g4);
    el('circle', { cx: tX(36), cy: tY(at(36)), r: 7, style: 'fill:' + VD }, m36); tx(tX(36) - 10, tY(at(36)) - 6, '36 °C: máxima', 'font-size:14px;font-weight:700;fill:' + VD + ';text-anchor:end', m36);
    el('circle', { cx: tX(40), cy: tY(at(40)), r: 7, style: 'fill:' + VM }, m40); tx(tX(40) + 10, tY(at(40)) - 4, '40 °C', 'font-size:14px;font-weight:700;fill:' + VM, m40);
    tx(tX(40) + 10, tY(at(40)) + 14, 'desnatura', 'font-size:14px;fill:' + VM, m40);
    /* mini perfis */
    function mini(x0, y0, pk, cor, rot) { var g = el('g', {}, g4), f = curvaN([[0, 0], [.2, 0], [.5, pk], [.8, -14], [1, -14]]), dd = '';
      for (var s = 0; s <= 1.0001; s += .02) dd += (dd ? 'L' : 'M') + (x0 + 200 * s).toFixed(1) + ' ' + (y0 - f(s) * 1.6).toFixed(1) + ' ';
      el('path', { d: dd, style: 'fill:none;stroke:' + cor + ';stroke-width:2.6' }, g); tx(x0, y0 - pk * 1.6 - 14, rot, 'font-size:15px;font-weight:700;fill:' + cor, g);
      el('path', { d: 'M' + (x0 + 30) + ' ' + y0 + ' V' + (y0 - pk * 1.6 + 2) + ' m-5 8 l5 -8 l5 8', style: 'fill:none;stroke:' + OU + ';stroke-width:2' }, g); tx(x0 + 38, y0 - pk * .8 + 5, 'Ea', 'font-size:14px;font-weight:700;fill:' + OU, g); return g; }
    var mA = mini(410, 110, 16, VD, '36 °C: Ea menor, mais rápida'), mB = mini(410, 220, 30, VM, '40 °C: menos enzima ativa');
    /* ---------- painel ---------- */
    el('line', { x1: 14, x2: 626, y1: 272, y2: 272, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 298, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2].map(function (i) { return tx(18, 326 + 24 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. Mesma reação, outro caminho', 'O catalisador leva dos mesmos reagentes aos mesmos produtos por etapas', 'com picos mais baixos. Com a barreira menor, mais choques têm energia', 'suficiente: a reação fica mais rápida. O ΔH não muda.'],
      ['2. Ele participa, mas sai inteiro', 'O catalisador se liga ao reagente, forma um intermediário e é devolvido', 'quando o produto sai. Cada unidade é usada de novo, muitas vezes.', 'Não é consumido: ao final, a mesma quantidade (e concentração) do início.'],
      ['3. Como reconhecer o catalisador num experimento', 'Concentração maior e temperatura maior também aceleram.', 'Se um experimento tem as mesmas condições de outro e mesmo assim', 'é muito mais rápido, a diferença é o catalisador (aqui, a urease).'],
      ['4. Enzima: catalisador com temperatura ótima', 'Até a temperatura ótima, a atividade sobe; acima dela a enzima desnatura', 'e perde a forma. Na ótima há mais enzima ativa: caminho de Ea menor', 'e reação mais rápida que numa temperatura acima dela.']
    ];
    var _desenha = function (t) {
      var f = t < 4.5 ? 0 : t < 9 ? 1 : t < 13 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      if (f === 0) {
        var s1 = ease((t - .5) / 3.6), s2 = ease((t - .5) / 1.8);
        b1.setAttribute('cx', gx(s1).toFixed(1)); b1.setAttribute('cy', (gy(sem(s1)) - 9).toFixed(1));
        b2.setAttribute('cx', gx(s2).toFixed(1)); b2.setAttribute('cy', (gy(com(s2)) - 9).toFixed(1));
        op(ea1, cl((t - 1.2) / .4)); op(ea2, cl((t - 1.6) / .4)); op(dh, cl((t - 2.6) / .4));
        inf1.childNodes.forEach(function (n, i) { op(n, cl((t - 1 - i * .5) / .4)); });
      }
      if (f === 1) {
        var lt = t - 4.6, per = 1.9, k = Math.max(0, Math.floor(lt / per)), u = lt < 0 ? 0 : (lt % per) / per;
        var ang = -90 + 360 * u, a = ang * Math.PI / 180;
        tok.setAttribute('transform', 'translate(' + (CXc + Math.cos(a) * RC * .62).toFixed(1) + ' ' + (CYc + Math.sin(a) * RC * .62).toFixed(1) + ')');
        var aR = (-90 + 360 * Math.max(u, .25)) * Math.PI / 180;
        rea.setAttribute('transform', 'translate(' + (u < .25 ? CXc + RC * .45 : CXc + Math.cos(a) * RC * .62 - 16).toFixed(1) + ' ' + (u < .25 ? CYc - 40 + 40 * (u / .25) : CYc + Math.sin(a) * RC * .62 - 16).toFixed(1) + ')');
        op(rea, u < .5 ? 1 : 0);
        pro.setAttribute('transform', 'translate(' + (u < .75 ? CXc + Math.cos(a) * RC * .62 - 16 : CXc - RC * .55 + 20 * ((u - .75) / .25)).toFixed(1) + ' ' + (u < .75 ? CYc + Math.sin(a) * RC * .62 - 16 : CYc - 40 * ((u - .75) / .25)).toFixed(1) + ')');
        op(pro, u >= .5 ? 1 : 0);
        cont.textContent = 'produtos formados: ' + (k + (u > .75 ? 1 : 0));
        cont2.textContent = 'catalisador: o mesmo 1 ' + CN;
        op(inf2, cl((t - 5.6) / .5));
      }
      if (f === 2) bars.forEach(function (b, i) { var w = ease((t - 9.3 - i * .55) / .6); b.r.setAttribute('width', (b.v * 30 * w).toFixed(1)); b.tt.setAttribute('x', (178 + b.v * 30 * w).toFixed(1)); op(b.g, w > 0 ? 1 : 0); });
      if (f === 3) { op(m36, cl((t - 13.6) / .4)); op(m40, cl((t - 14.2) / .4)); op(mA, cl((t - 14.8) / .4)); op(mB, cl((t - 15.4) / .4)); }
      var T_ = TXT[f]; L0.textContent = T_[0]; Ls.forEach(function (o, i) { o.textContent = T_[i + 1] || ''; });
    };
    var FR = { Wcfb2f0c: 4.45, W2d73799: 4.45, P7d837fb: 4.45, P806ca45: 8.95, Pa2c8972: 8.95, P109c1db: 12.95, P4a2ba30: 16.95 };
    return fimResposta(VIS.def['catalisador-caminho'], svg, _desenha, 17, RESP, qid, { semEsmaecer: true, y: 278, oculta: [L0].concat(Ls), x: 8, w: 624, dt: 3.6, congela: function (q) { return FR[q] || 16.95; } });
  }
};
VIS.liga('catalisador-caminho', ['P109c1db', 'P4a2ba30', 'P7d837fb', 'P806ca45', 'Pa2c8972', 'W2d73799', 'Wcfb2f0c']);
