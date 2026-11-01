/* Ciclo da Leishmania: o flebotomineo (mosquito-palha) injeta promastigotas; o macrofago fagocita; o lisossomo se funde mas
   as enzimas nao digerem o parasita, que vira amastigota e se multiplica; novo inseto se infecta; prevencao = barrar o vetor. Lote bio 9. */
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
'Pd5d50fe': ['Por isso a resposta é E',
  'I: a Leishmania inativa as enzimas do LISOSSOMO e não é',
  'digerida dentro do macrófago.',
  'II: ela entra pela picada do mosquito-palha; repelente',
  'impede a picada e corta a transmissão.'],
'Pcd173d3': ['Por isso a resposta é B',
  'O parasita (protozoário, não vírus nem bactéria) passa',
  'de um mamífero a outro pela picada do mosquito-palha.',
  'Mosquiteiros, telas e controle do inseto evitam a picada.']
};
VIS.def['ciclo-leishmania'] = {
  tit: 'Leishmania: vive dentro da célula que deveria digeri-la',
  fontes: ['Wikipedia (en), Leishmaniasis, Life cycle e Prevention (promastigotas metacíclicas injetadas na picada, fagocitadas por macrófagos, viram amastigotas e se multiplicam; o inseto se infecta ao ingerir macrófagos infectados; mosquiteiros com inseticida, repelentes, coleiras em cães) — https://en.wikipedia.org/wiki/Leishmaniasis',
    'Wikipedia (en), Leishmania (promastigota no inseto, amastigota no macrófago; enzimas do macrófago não têm efeito; vetores Phlebotomus e Lutzomyia) — https://en.wikipedia.org/wiki/Leishmania',
    'CDC, Clinical Overview of Leishmaniasis (transmissão pela picada de flebotomíneos infectados; prevenção: evitar picadas, repelente, roupas, mosquiteiros tratados, telas) — https://www.cdc.gov/leishmaniasis/hcp/clinical-overview/index.html'],
  tipo: 'anim', dur: 14,
  marcas: [[0, '1. Picada'], [2.8, '2. Engolida'], [5.4, '3. Lisossomo'], [8.4, '4. No inseto'], [11.2, '5. Prevenção']],
  cred: 'Animação feita para o app (esquema fora de escala). No Brasil o vetor é o flebotomíneo Lutzomyia, chamado mosquito-palha ou birigui.',
  nota: 'A Leishmania é um protozoário. No inseto ela é promastigota (alongada, com flagelo livre); no mamífero vive como amastigota (arredondada, flagelo curto que não sai da célula) dentro de macrófagos.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 2.8, 5.4, 8.4, 11.2], TF = 14;
    var PAR = '#8a2a7a', MAC = '#c08a5a', LIS = '#2b6cb0', VET = '#8a6a2a';
    /* macrofago (zoom) */
    var MC = el('g', {});
    el('ellipse', { cx: 190, cy: 150, rx: 168, ry: 112, style: 'fill:color-mix(in srgb,' + MAC + ' 16%,var(--folha));stroke:' + MAC + ';stroke-width:2.4' }, MC);
    el('path', { d: 'M54 128 C50 96 92 82 108 104 C118 118 104 132 112 150 C120 172 96 196 72 182 C56 172 58 150 54 128 Z', style: 'fill:color-mix(in srgb,#7a5aa0 22%,var(--folha));stroke:#7a5aa0;stroke-width:1.8' }, MC);
    tx(82, 214, 'núcleo', 'font-size:13px;fill:#7a5aa0;text-anchor:middle', MC);
    tx(190, 32, 'Macrófago (célula de defesa)', 'font-size:14.5px;font-weight:700;fill:#9a6a3a;text-anchor:middle', MC);
    /* promastigota e amastigota */
    function promast(pai) { var g = el('g', {}, pai); el('ellipse', { cx: 0, cy: 0, rx: 12, ry: 4.5, style: 'fill:' + PAR }, g); el('path', { d: 'M-12 0 q -6 -5 -12 0 q -6 5 -12 0', style: 'fill:none;stroke:' + PAR + ';stroke-width:1.8' }, g); return g; }
    function amast(pai) { var g = el('g', {}, pai); el('ellipse', { cx: 0, cy: 0, rx: 6.5, ry: 5.5, style: 'fill:' + PAR }, g); el('circle', { cx: -1.5, cy: 0, r: 2, style: 'fill:#f2d0ea' }, g); return g; }
    /* fagossomo / fagolisossomo */
    var VX = 236, VY = 150;
    var vac = el('circle', { cx: VX, cy: VY, r: 40, style: 'fill:color-mix(in srgb,' + LIS + ' 6%,var(--folha));stroke:' + LIS + ';stroke-width:2' });
    var vacT = tx(VX, VY + 60, '', 'font-size:13.5px;font-weight:700;fill:' + LIS + ';text-anchor:middle');
    var lis = [[150, 70], [330, 190], [150, 230]].map(function (p) {
      var g = el('g', {}); el('circle', { cx: 0, cy: 0, r: 13, style: 'fill:color-mix(in srgb,' + LIS + ' 22%,var(--folha));stroke:' + LIS + ';stroke-width:1.8' }, g);
      for (var k = 0; k < 5; k++) el('circle', { cx: 6 * Math.cos(k * 1.26), cy: 6 * Math.sin(k * 1.26), r: 1.8, style: 'fill:' + LIS }, g);
      g.p = p; return g; });
    var lisT = tx(150, 98, 'lisossomo', 'font-size:13px;font-weight:700;fill:' + LIS + ';text-anchor:middle');
    var enz = []; for (var k = 0; k < 12; k++) enz.push(el('circle', { r: 2.2, style: 'fill:' + LIS }));
    var pro = promast(svg), ams = [0, 1, 2, 3].map(function () { return amast(svg); });
    var xs = el('g', {});
    tx(VX, VY - 52, 'enzimas do lisossomo não digerem', 'font-size:13.5px;font-weight:700;fill:#b4442f;text-anchor:middle;paint-order:stroke;stroke:var(--folha);stroke-width:4px', xs);
    var parT = tx(0, 0, '', 'font-size:13.5px;font-weight:700;fill:' + PAR + ';paint-order:stroke;stroke:var(--folha);stroke-width:4px');
    /* mosquito-palha (flebotomineo), esquema */
    var V = el('g', { transform: 'translate(520 92)' });
    el('path', { d: 'M-6 -4 L-46 -66 L-30 -70 Z M6 -4 L30 -72 L44 -64 Z', style: 'fill:color-mix(in srgb,' + VET + ' 14%,var(--folha));stroke:' + VET + ';stroke-width:1.4' }, V);
    [[-8, 4, -40, 40], [-2, 6, -18, 52], [4, 6, 14, 52], [8, 4, 40, 44], [-10, 2, -52, 20], [10, 2, 50, 24]].forEach(function (l) { el('path', { d: 'M' + l[0] + ' ' + l[1] + ' Q' + ((l[0] + l[2]) / 2) + ' ' + (l[3] - 30) + ' ' + l[2] + ' ' + l[3], style: 'fill:none;stroke:' + VET + ';stroke-width:1.4' }, V); });
    el('ellipse', { cx: 0, cy: 0, rx: 10, ry: 13, style: 'fill:#c9a86a;stroke:' + VET + ';stroke-width:1.6' }, V);
    el('path', { d: 'M-5 10 C-6 30 6 30 5 10 Z M-6 10 C-10 46 10 46 6 10', style: 'fill:#c9a86a;stroke:' + VET + ';stroke-width:1.6' }, V);
    el('circle', { cx: 0, cy: -18, r: 6.5, style: 'fill:#b0905a;stroke:' + VET + ';stroke-width:1.6' }, V);
    el('path', { d: 'M-2 -24 L-22 -40 M2 -24 L0 -44', style: 'fill:none;stroke:' + VET + ';stroke-width:1.6' }, V);
    tx(520, 184, 'mosquito-palha', 'font-size:14.5px;font-weight:700;fill:' + VET + ';text-anchor:middle');
    tx(520, 202, '(flebotomíneo, ~3 mm)', 'font-size:13px;fill:var(--lapis);text-anchor:middle');
    /* seta da picada e seta de volta */
    var aPic = el('g', {}); K.seta(aPic, 470, 112, 362, 140, PAR, 2.6); tx(436, 146, 'picada', 'font-size:13.5px;font-weight:700;fill:' + PAR + ';text-anchor:middle', aPic);
    var aVol = el('g', {}); K.seta(aVol, 352, 200, 470, 160, VET, 2.6);
    tx(462, 226, 'novo inseto suga sangue', 'font-size:13px;font-weight:700;fill:' + VET + ';text-anchor:middle', aVol);
    tx(462, 242, 'e ingere macrófagos infectados', 'font-size:13px;fill:' + VET + ';text-anchor:middle', aVol);
    tx(462, 258, 'no intestino dele: promastigota', 'font-size:13px;fill:' + VET + ';text-anchor:middle', aVol);
    /* prevencao */
    var PV = el('g', {});
    el('line', { x1: 404, y1: 34, x2: 404, y2: 270, style: 'stroke:#b4442f;stroke-width:4;stroke-linecap:round;stroke-dasharray:10 7' }, PV);
    el('path', { d: 'M394 116 l20 20 m0 -20 l-20 20', style: 'fill:none;stroke:#b4442f;stroke-width:4;stroke-linecap:round' }, PV);
    el('rect', { x: 416, y: 214, width: 214, height: 60, rx: 10, style: 'fill:var(--folha);stroke:#2f7a34;stroke-width:2' }, PV);
    tx(426, 236, 'repelente, mosquiteiro, telas,', 'font-size:13.5px;font-weight:700;fill:#2f7a34', PV);
    tx(426, 256, 'inseticida, coleira nos cães', 'font-size:13.5px;font-weight:700;fill:#2f7a34', PV);
    var painel = K.painel();
    function pos(o, x, y, s) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')' + (s ? ' scale(' + s + ')' : '')); }
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(aPic, e === 0 ? 1 : .3); op(aVol, e === 3 ? 1 : 0); op(PV, e === 4 ? cl((t - 11.4) / .4) : 0);
      /* promastigota: entra pela picada e e fagocitada */
      var u;
      if (e === 0) { u = ease((t - .4) / 2); pos(pro, lerp(470, 300, u), lerp(112, 120, u)); op(pro, t > .4 ? 1 : 0); }
      else if (e === 1) { u = ease((t - 2.9) / 1.8); pos(pro, lerp(300, VX, u), lerp(120, VY, u)); op(pro, 1); }
      else if (e === 2) { u = cl((t - 6.6) / 1.2); pos(pro, VX, VY, 1 - u); op(pro, 1 - u); }
      else op(pro, 0);
      /* vacuolo */
      var rv = e === 1 ? 40 * ease((t - 4) / .8) : e >= 2 ? 40 : 0;
      vac.setAttribute('r', rv.toFixed(1)); op(vac, rv > 1 ? 1 : 0);
      vacT.textContent = e === 1 ? 'fagossomo' : e >= 2 ? 'fagolisossomo' : '';
      /* lisossomos indo ate o vacuolo */
      lis.forEach(function (g, i) {
        var v = e === 2 ? ease((t - 5.5 - i * .25) / 1.1) : e > 2 ? 1 : 0;
        var x = lerp(g.p[0], VX + 40 * Math.cos(2.4 + i * 1.6), v), y = lerp(g.p[1], VY + 40 * Math.sin(2.4 + i * 1.6), v);
        pos(g, x, y, 1 - .6 * cl((v - .8) / .2)); op(g, e >= 1 ? 1 - .7 * cl((v - .85) / .15) : .45);
      });
      op(lisT, e === 1 || (e === 2 && t < 6));
      enz.forEach(function (c, i) { var a = i * .52 + t * .6, r = 18 + (i % 3) * 7; c.setAttribute('cx', (VX + r * Math.cos(a)).toFixed(1)); c.setAttribute('cy', (VY + r * Math.sin(a)).toFixed(1)); op(c, e >= 2 && t > 6.6 ? 1 : 0); });
      op(xs, e >= 2 && t > 7 ? 1 : 0);
      /* amastigotas: 1 -> 2 -> 4 */
      var n = e === 2 ? (t > 6.9 ? 1 : 0) : e >= 3 ? (t > 9.4 ? 4 : t > 8.8 ? 2 : 1) : 0;
      ams.forEach(function (a, i) { var off = n === 1 ? [[0, 0]] : n === 2 ? [[-10, 0], [10, 0]] : [[-11, -9], [11, -9], [-11, 9], [11, 9]]; if (i < n) { pos(a, VX + off[i][0], VY + off[i][1]); op(a, 1); } else op(a, 0); });
      parT.textContent = e === 0 || e === 1 ? 'promastigota' : n ? 'amastigota' + (n > 1 ? 's' : '') : '';
      var px = e === 0 ? lerp(470, 300, ease((t - .4) / 2)) - 40 : e === 1 ? lerp(300, VX, ease((t - 2.9) / 1.8)) - 40 : VX - 30;
      var py = e <= 1 ? (e === 0 ? 100 : lerp(100, VY - 18, ease((t - 2.9) / 1.8))) : VY + 82;
      parT.setAttribute('x', px.toFixed(1)); parT.setAttribute('y', py.toFixed(1)); op(parT, (e === 0 && t < .4) ? 0 : 1);
      var L;
      if (e === 0) L = ['1. A picada injeta o parasita', 'A fêmea do mosquito-palha suga sangue e injeta na pele a Leishmania', 'na forma promastigota (alongada, com flagelo). É um protozoário.'];
      else if (e === 1) L = ['2. O macrófago engole o parasita', 'Células de defesa fagocitam o invasor: ele fica preso numa bolsa', 'de membrana, o fagossomo.'];
      else if (e === 2) L = ['3. O lisossomo se funde, mas não digere', 'Lisossomos despejam enzimas digestivas no fagossomo. A Leishmania resiste:', 'ela inativa essas enzimas, vira amastigota e se multiplica ali dentro.'];
      else if (e === 3) L = ['4. O ciclo continua no inseto', 'Cheio de amastigotas, o macrófago se rompe e outras células se infectam.', 'Um mosquito-palha que pica esse mamífero se infecta e transmite adiante.'];
      else L = ['5. Prevenção: impedir a picada do vetor', 'A transmissão é pela picada do vetor. Para evitá-la: repelente,', 'mosquiteiro, telas e controle do inseto. (Não é água nem esgoto.)'];
      painel(L);
    };
    return fimResposta(VIS.def['ciclo-leishmania'], svg, _desenha, TF, RESP, qid, { y: qid === 'Pcd173d3' ? 4 : undefined, congela: function () { return 13.9; } });
  }
};
VIS.liga('ciclo-leishmania', ['Pd5d50fe', 'Pcd173d3']);
