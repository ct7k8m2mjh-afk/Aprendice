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
'Pf6d9bd2': [
'Por isso a resposta é B',
'Com a placa − em cima e a + embaixo, o feixe se curva para a placa +.',
'Atraído pelo + e repelido pelo −: as partículas têm carga negativa.',
'Onda eletromagnética (luz) não tem carga e passaria reto: D está errada.'
]
};
VIS.def['raios-catodicos-desvio'] = {
  tit: 'Raios catódicos se curvam para a placa positiva',
  fontes: ['OpenStax, Chemistry 2e, 2.2 Evolution of Atomic Theory (Thomson e os raios catódicos) — https://openstax.org/books/chemistry-2e/pages/2-2-evolution-of-atomic-theory', 'Wikipedia (en), Cathode ray — https://en.wikipedia.org/wiki/Cathode_ray', 'Khan Academy, Discovery of the electron and nucleus — https://www.khanacademy.org/science/chemistry/electronic-structure-of-atoms/history-of-atomic-structure/a/discovery-of-the-electron-and-nucleus'],
  tipo: 'anim', dur: 13,
  marcas: [[0, 'O tubo'], [3.2, 'Campo ligado'], [6.6, 'Placas trocadas'], [9.8, 'Conclusão']],
  cred: 'Animação feita para o app (esquema fora de escala; o desvio está exagerado para ser visto).',
  nota: 'O feixe sai do cátodo (eletrodo negativo) e é sempre puxado para a placa positiva, qualquer que seja o lado em que ela esteja. Isso só acontece com partículas de carga negativa: os elétrons, identificados por J. J. Thomson em 1897.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var POS = '#b4442f', NEG = '#2b6cb0', FEI = '#1f8a70';
    svg.setAttribute('viewBox', '0 0 640 380');
    /* tubo de vidro */
    var Y0 = 120;
    el('path', { d: 'M70 70 H560 Q600 70 604 ' + Y0 + ' Q600 170 560 170 H70 Q30 170 30 ' + Y0 + ' Q30 70 70 70 Z', style: 'fill:color-mix(in srgb,#7fa7c9 10%,var(--folha));stroke:var(--lapis);stroke-width:2' });
    /* catodo e anodo */
    el('rect', { x: 52, y: Y0 - 30, width: 10, height: 60, rx: 2, style: 'fill:' + NEG });
    tx(57, 62, 'cátodo (−)', 'font-size:14px;font-weight:700;fill:' + NEG + ';text-anchor:middle');
    el('rect', { x: 150, y: Y0 - 34, width: 8, height: 28, style: 'fill:' + POS });
    el('rect', { x: 150, y: Y0 + 6, width: 8, height: 28, style: 'fill:' + POS });
    tx(154, 62, 'ânodo (+)', 'font-size:14px;font-weight:700;fill:' + POS + ';text-anchor:middle');
    el('line', { x1: 57, y1: 172, x2: 57, y2: 196, style: 'stroke:var(--lapis);stroke-width:1.5' });
    el('line', { x1: 154, y1: 172, x2: 154, y2: 196, style: 'stroke:var(--lapis);stroke-width:1.5' });
    el('path', { d: 'M57 196 H154', style: 'fill:none;stroke:var(--lapis);stroke-width:1.5' });
    tx(105, 214, 'alta tensão', 'font-size:14px;fill:var(--lapis);text-anchor:middle');
    /* placas */
    var PX0 = 260, PX1 = 400, PT = 88, PB = 152, XS = 586;
    var pT = el('rect', { x: PX0, y: PT - 8, width: PX1 - PX0, height: 8, rx: 2 });
    var pB = el('rect', { x: PX0, y: PB, width: PX1 - PX0, height: 8, rx: 2 });
    var sT = tx(PX0 - 14, PT + 2, '', 'font-size:22px;font-weight:700;text-anchor:middle');
    var sB = tx(PX0 - 14, PB + 10, '', 'font-size:22px;font-weight:700;text-anchor:middle');
    var lT = tx(330, 58, '', 'font-size:14px;font-weight:700;text-anchor:middle');
    var lB = tx(330, 190, '', 'font-size:14px;font-weight:700;text-anchor:middle');
    /* tela fluorescente */
    el('rect', { x: XS, y: 82, width: 6, height: 76, style: 'fill:color-mix(in srgb,' + FEI + ' 30%,var(--folha));stroke:' + FEI + ';stroke-width:1' });
    tx(600, 196, 'tela', 'font-size:14px;fill:var(--lapis);text-anchor:middle');
    /* linha reta de referencia */
    var ref = el('line', { x1: 158, y1: Y0, x2: XS, y2: Y0, style: 'stroke:var(--lapis);stroke-width:1.6;stroke-dasharray:6 5' });
    var refT = tx(470, Y0 - 8, 'sem carga: reto', 'font-size:14px;fill:var(--lapis)');
    var feixe = el('path', { style: 'fill:none;stroke:' + FEI + ';stroke-width:3;stroke-linecap:round' });
    var spot = el('circle', { r: 7, style: 'fill:' + FEI });
    var eles = []; for (var i = 0; i < 7; i++) eles.push(el('circle', { r: 4, style: 'fill:' + NEG }));
    var emin = []; for (i = 0; i < 7; i++) emin.push(tx(0, 0, '−', 'font-size:14px;font-weight:700;fill:var(--folha);text-anchor:middle'));
    /* trajetoria: reta ate a placa, parabola entre as placas, reta depois */
    var DMAX = 10;   /* desvio na saida das placas */
    function yAt(x, D) {
      if (x <= PX0) return Y0;
      var L = PX1 - PX0;
      if (x <= PX1) { var u = (x - PX0) / L; return Y0 + D * u * u; }
      return Y0 + D + 2 * D / L * (x - PX1);
    }
    function caminho(D) { var d = 'M62 ' + Y0; for (var x = 158; x <= XS; x += 6) d += ' L' + x + ' ' + yAt(x, D).toFixed(1); return d; }
    /* texto */
    el('line', { x1: 14, x2: 626, y1: 232, y2: 232, style: 'stroke:var(--linha);stroke-width:1.5' });
    var L0 = tx(18, 260, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)');
    var Ls = [0, 1, 2, 3].map(function (i) { return tx(18, 288 + 23 * i, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['1. O tubo de raios catódicos', 'Gás a baixa pressão e alta tensão entre os eletrodos: do cátodo (−)', 'sai um feixe que atravessa o furo do ânodo e acende a tela.', 'Sem campo entre as placas, o feixe segue reto.'],
      ['2. Liga o campo: − em cima, + embaixo', 'O feixe se curva para baixo, na direção da placa positiva', 'e para longe da negativa. Cargas opostas se atraem.', 'Quem não tem carga (luz, nêutron) seguiria a linha tracejada.'],
      ['3. Troca as placas: + em cima, − embaixo', 'Agora o feixe se curva para cima. Ele sempre vai', 'para o lado da placa +, onde quer que ela esteja.', 'Esse é o teste: o desvio acompanha o sinal da placa.'],
      ['4. Conclusão de Thomson (1897)', 'Os raios catódicos são partículas com carga negativa: os elétrons.', 'Saem do cátodo de qualquer metal, então todo átomo tem elétrons.', 'Na TV de tubo, campos desviam esse feixe para desenhar a imagem.']
    ];
    function sinal(D) { return D > 0 ? 1 : -1; }   /* D>0: placa + embaixo */
    var _desenha = function (t) {
      var f = t < 3.2 ? 0 : t < 6.6 ? 1 : t < 9.8 ? 2 : 3;
      var D;
      if (f === 0) D = 0;
      else if (f === 1) D = DMAX * ease((t - 3.4) / .9);
      else if (f === 2) D = DMAX - 2 * DMAX * ease((t - 6.8) / 1.1);
      else D = -DMAX + 2 * DMAX * ease((t - 10) / 1);
      var on = f > 0, s = f === 2 ? -1 : 1;   /* s=1: + embaixo */
      var cT = !on ? 'var(--lapis)' : s > 0 ? NEG : POS, cB = !on ? 'var(--lapis)' : s > 0 ? POS : NEG;
      pT.setAttribute('style', 'fill:' + cT); pB.setAttribute('style', 'fill:' + cB);
      sT.textContent = on ? (s > 0 ? '−' : '+') : ''; sB.textContent = on ? (s > 0 ? '+' : '−') : '';
      sT.style.fill = cT; sB.style.fill = cB;
      lT.textContent = on ? (s > 0 ? 'placa negativa' : 'placa positiva') : 'placas desligadas';
      lB.textContent = on ? (s > 0 ? 'placa positiva' : 'placa negativa') : '';
      lT.style.fill = cT; lB.style.fill = cB;
      feixe.setAttribute('d', caminho(D));
      spot.setAttribute('cx', XS - 1); spot.setAttribute('cy', yAt(XS, D).toFixed(1));
      op(ref, f === 0 ? 0 : 1); op(refT, f === 0 ? 0 : 1);
      eles.forEach(function (e, i) {
        var w = (t * 0.55 + i / eles.length) % 1, x = 62 + (XS - 62) * w, y = yAt(x, D);
        e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1));
        emin[i].setAttribute('x', x.toFixed(1)); emin[i].setAttribute('y', (y + 4.5).toFixed(1));
        op(e, 1); op(emin[i], 1);
      });
      var T = TXT[f]; L0.textContent = T[0]; Ls.forEach(function (o, i) { o.textContent = T[i + 1] || ''; });
    };
    return fimResposta(VIS.def['raios-catodicos-desvio'], svg, _desenha, 13, RESP, qid, { semEsmaecer: true, y: 238, oculta: [L0].concat(Ls), x: 8, w: 624, congela: function (q) { return 6.2; } });
  }
};
VIS.liga('raios-catodicos-desvio', ['Pf6d9bd2']);
