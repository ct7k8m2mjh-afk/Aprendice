/* Enzima: caminho de menor energia de ativacao (Delta G igual) + atividade x temperatura com otimo em 36 graus
   (mesmos valores do grafico da Unesp 2018, P507c646). A temperatura percorre o eixo e o caminho catalisado
   enfraquece quando a enzima comeca a desnaturar. */
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
'P507c646': [
'Por isso a resposta é D',
'A 36 °C (temperatura ótima) a enzima está íntegra: a reação',
'passa pelo caminho de Ea menor e é mais rápida que a 40 °C,',
'onde parte da enzima já desnaturou.'
]
};
VIS.def['enzima-energia-ativacao-temperatura'] = {
  tit: 'Enzima: caminho de menor energia de ativação e temperatura ótima',
  fontes: ['OpenStax, Biology 2e, 6.5 Enzymes (sítio ativo, ΔG não muda, desnaturação por calor) — https://openstax.org/books/biology-2e/pages/6-5-enzymes'],
  tipo: 'anim', dur: 12,
  marcas: [[0, 'Frio'], [2, '36 °C (ótima)'], [5.5, '40 °C'], [10, 'Calor demais']],
  cred: 'Animação feita para o app (esquema fora de escala). A espessura do caminho "com enzima" representa a fração de enzima ainda íntegra.',
  nota: 'A enzima não muda o ponto de partida nem o de chegada (ΔG igual): ela oferece um caminho com barreira menor. Acima do ótimo ela começa a desnaturar, menos moléculas passam pelo caminho baixo e a reação fica mais lenta.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    var S = { sub: 'font-size:14.5px;fill:var(--tinta)', forte: 'font-size:15px;font-weight:700;fill:var(--tinta)', lab: 'font-size:14px;font-weight:600;fill:var(--lapis)', mini: 'font-size:13px;fill:var(--lapis)' };
    var COR = '#2f8a5b', SEM = '#8c8c8c';
    svg.setAttribute('viewBox', '0 0 640 350');
    /* ---------- grafico 1: atividade x temperatura ---------- */
    var gx0 = 46, gx1 = 286, gy0 = 214, gy1 = 52;
    function TX(T) { return gx0 + (T - 20) * (gx1 - gx0) / 40; }
    function act(T) { var s = T < 36 ? 9 : 4.6, z = (T - 36) / s; return Math.exp(-z * z); }
    function AY(a) { return gy0 - (gy0 - gy1 - 20) * a; }
    tx(gx0 - 6, 34, 'Atividade da enzima', S.lab);
    el('path', { d: 'M' + gx0 + ' 40 V' + gy0 + ' H' + (gx1 + 10), style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    [36, 40].forEach(function (T) {
      el('line', { x1: TX(T), x2: TX(T), y1: AY(act(T)), y2: gy0, style: 'stroke:var(--lapis);stroke-width:1.3;stroke-dasharray:4 4' });
      tx(TX(T), gy0 + 18, T, 'font-size:13px;font-weight:700;fill:var(--tinta);text-anchor:middle');
    });
    [20, 30, 50, 60].forEach(function (T) { tx(TX(T), gy0 + 18, T, 'font-size:13px;fill:var(--lapis);text-anchor:middle'); });
    tx(gx1 + 14, gy0 + 18, '°C', S.mini);
    var dc = ''; for (var T = 20; T <= 60; T += .25) dc += (dc ? 'L' : 'M') + TX(T).toFixed(1) + ' ' + AY(act(T)).toFixed(1) + ' ';
    el('path', { d: dc, style: 'fill:none;stroke:' + COR + ';stroke-width:3' });
    var tl = el('line', { y2: gy0, style: 'stroke:var(--tinta);stroke-width:1.6' });
    var tp = el('circle', { r: 7, style: 'fill:' + COR + ';stroke:var(--folha);stroke-width:2' });
    var tT = tx(0, 0, '', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle');
    /* ---------- grafico 2: energia x caminho da reacao ---------- */
    var ex0 = 330, ex1 = 624, ey0 = 214;
    tx(ex0 - 4, 34, 'Energia', S.lab);
    el('path', { d: 'M' + ex0 + ' 40 V' + ey0 + ' H' + ex1, style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    tx(ex1, ey0 + 18, 'caminho da reação', S.mini + ';text-anchor:end');
    var yR = 140, yP = 190, yS = 58, yC = 108;   /* reagentes, produtos, topo sem enzima, topo com enzima */
    function hump(top) { return 'M' + (ex0 + 8) + ' ' + yR + ' H' + (ex0 + 84) + ' C' + (ex0 + 122) + ' ' + yR + ' ' + (ex0 + 126) + ' ' + top + ' ' + (ex0 + 160) + ' ' + top + ' C' + (ex0 + 194) + ' ' + top + ' ' + (ex0 + 204) + ' ' + yP + ' ' + (ex0 + 242) + ' ' + yP + ' H' + (ex1 - 26); }
    el('path', { d: hump(yS), style: 'fill:none;stroke:' + SEM + ';stroke-width:2.6;stroke-dasharray:7 5' });
    var cat = el('path', { d: hump(yC), style: 'fill:none;stroke:' + COR + ';stroke-linecap:round' });
    /* niveis e setas */
    el('line', { x1: ex0 + 84, x2: ex1 - 6, y1: yR, y2: yR, style: 'stroke:var(--lapis);stroke-width:1;stroke-dasharray:3 4' });
    el('line', { x1: ex0 + 24, x2: ex0 + 160, y1: yS, y2: yS, style: 'stroke:' + SEM + ';stroke-width:1;stroke-dasharray:3 4' });
    var lC = el('line', { x1: ex0 + 56, x2: ex0 + 160, y1: yC, y2: yC, style: 'stroke:' + COR + ';stroke-width:1;stroke-dasharray:3 4' });
    function seta(x, y1, y2, cor) { return el('path', { d: 'M' + x + ' ' + y1 + ' V' + y2 + ' m-5 ' + (y2 < y1 ? 8 : -8) + ' l5 ' + (y2 < y1 ? -8 : 8) + ' l5 ' + (y2 < y1 ? 8 : -8), style: 'fill:none;stroke:' + cor + ';stroke-width:2' }); }
    seta(ex0 + 28, yR, yS + 2, SEM); tx(ex0 + 34, 96, 'Ea', 'font-size:14px;font-weight:700;fill:' + SEM);
    var sC = seta(ex0 + 60, yR, yC + 2, COR), sCt = tx(ex0 + 66, 129, 'Ea', 'font-size:14px;font-weight:700;fill:' + COR);
    seta(ex1 - 14, yR, yP - 2, 'var(--tinta)'); tx(ex1 - 8, 170, 'ΔG', 'font-size:14px;font-weight:700;fill:var(--tinta)');
    tx(ex0 + 172, yS - 6, 'sem enzima', 'font-size:13.5px;font-weight:600;fill:' + SEM);
    var cT = tx(ex0 + 150, yC + 52, 'com enzima', 'font-size:13.5px;font-weight:700;text-anchor:middle;fill:' + COR);
    tx(ex0 + 10, yR + 18, 'reagentes', S.mini); tx(ex0 + 238, yP + 17, 'produtos', S.mini);
    /* ---------- enzima (icone) ---------- */
    var EX = 560, EY = 292;
    var nat = [[-34, -8], [-30, -22], [-16, -30], [-8, -30], [-6, -14], [6, -14], [8, -30], [18, -30], [32, -20], [36, 0], [28, 18], [8, 24], [-14, 22], [-30, 12]];
    var den = [[-40, -4], [-28, -18], [-20, -14], [-10, -26], [-2, -8], [4, -20], [14, -10], [24, -26], [38, -14], [30, 6], [36, 20], [6, 16], [-12, 28], [-34, 18]];
    var enz = el('path', { style: 'fill:#cfe5d6;stroke:' + COR + ';stroke-width:2;stroke-linejoin:round' });
    var sub = el('path', { d: 'M-6 -13 H6 V-26 H-6 Z', style: 'fill:#e3b04b;stroke:#a77b1f;stroke-width:1.6' });
    var eT = tx(EX, EY + 46, '', S.mini + ';text-anchor:middle');
    /* ---------- texto ---------- */
    var p1 = tx(40, 264, '', S.forte), p2 = tx(40, 286, '', S.sub), p3 = tx(40, 306, '', S.sub), p4 = tx(40, 326, '', S.sub);
    var K = [[0, 22], [2, 36], [4.5, 36], [5.5, 40], [8, 40], [10, 52], [12, 52]];
    function TdE(t) { for (var i = 1; i < K.length; i++) if (t <= K[i][0]) { var a = K[i - 1], b = K[i]; return a[1] + (b[1] - a[1]) * ease((t - a[0]) / (b[0] - a[0] || 1)); } return 52; }
    var _desenha = function (t) {
      var T = TdE(t), a = act(T), x = TX(T), y = AY(a);
      var nf = 1 / (1 + Math.exp((T - 41) / 1.5));   /* fracao de enzima integra */
      tl.setAttribute('x1', x.toFixed(1)); tl.setAttribute('x2', x.toFixed(1)); tl.setAttribute('y1', y.toFixed(1));
      tp.setAttribute('cx', x.toFixed(1)); tp.setAttribute('cy', y.toFixed(1));
      if (T < 34) { tT.setAttribute('x', (x + 12).toFixed(1)); tT.setAttribute('y', (y + 5).toFixed(1)); tT.style.textAnchor = 'start'; } else if (T > 38) { tT.setAttribute('x', Math.min(gx1 - 50, x + 10).toFixed(1)); tT.setAttribute('y', (y - 12).toFixed(1)); tT.style.textAnchor = 'start'; } else { tT.style.textAnchor = 'middle'; tT.setAttribute('x', Math.min(gx1 - 10, Math.max(gx0 + 24, x)).toFixed(1)); tT.setAttribute('y', (y - 16).toFixed(1)); }
      tT.textContent = Math.round(T) + ' °C';
      cat.style.strokeWidth = (0.6 + 3.4 * nf).toFixed(2); cat.style.opacity = (0.15 + 0.85 * nf).toFixed(2);
      sC.style.opacity = sCt.style.opacity = cT.style.opacity = lC.style.opacity = (0.2 + 0.8 * nf).toFixed(2);
      /* icone da enzima: forma interpolada entre nativa e desnaturada */
      var u = 1 - nf, d = '';
      nat.forEach(function (p, i) { var q = den[i]; d += (i ? 'L' : 'M') + (EX + p[0] + (q[0] - p[0]) * u).toFixed(1) + ' ' + (EY + p[1] + (q[1] - p[1]) * u).toFixed(1) + ' '; });
      enz.setAttribute('d', d + 'Z');
      var enc = cl((nf - .35) / .5);   /* substrato encaixado no sitio ativo quando a enzima esta integra */
      sub.setAttribute('transform', 'translate(' + (EX + 26 * (1 - enc)).toFixed(1) + ' ' + (EY - 22 * (1 - enc)).toFixed(1) + ') rotate(' + (40 * (1 - enc)).toFixed(0) + ')');
      eT.textContent = nf > .8 ? 'sítio ativo encaixa' : nf > .2 ? 'parte desnaturou' : 'desnaturada';
      var L;
      if (T < 33) L = [Math.round(T) + ' °C: abaixo do ótimo', 'A enzima está íntegra, mas as moléculas se movem devagar', 'e se encontram menos: a reação ainda é lenta.', ''];
      else if (T < 38) L = ['36 °C: temperatura ótima, velocidade máxima', 'Enzima íntegra e choques frequentes: quase toda a reação', 'passa pelo caminho com enzima, o de Ea menor.', ''];
      else if (T < 44) L = ['40 °C: já passou do pico', 'Parte das enzimas desnaturou (o sítio ativo deforma):', 'menos reações pelo caminho de Ea baixa. A barreira', 'efetiva sobe e a velocidade cai. Voltar a 36 °C acelera.'];
      else L = [Math.round(T) + ' °C: calor demais', 'Enzima desnaturada: sobra só o caminho sem enzima,', 'de Ea alta, e a reação fica muito lenta.', ''];
      p1.textContent = L[0]; p2.textContent = L[1]; p3.textContent = L[2]; p4.textContent = L[3];
    };
    return fimResposta(VIS.def['enzima-energia-ativacao-temperatura'], svg, _desenha, 12, RESP, qid, { congela: function () { return 3.5; } });
  }
};
VIS.liga('enzima-energia-ativacao-temperatura', ['P507c646']);
