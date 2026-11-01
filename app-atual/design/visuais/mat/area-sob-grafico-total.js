/* Total acumulado = area sob o grafico da taxa: retangulo (taxa constante), trapezio (taxa que cresce em linha reta,
   area = media das alturas x largura) e curva qualquer fatiada em trapezios. Exemplo: torneira em L/min. */
/* etapa final "Resposta": congela o desenho no quadro que decide e mostra o porque da questao aberta (qid).
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
  if (opc.base) { h = Math.max(h, vb[3] - 226); y = vb[3] - h - 4; }
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
'P37bafd0': [
'Por isso a resposta é D',
'Total emitido = área sob o gráfico de 1950 a 1990: quase um trapézio.',
'Alturas ≈ 5 e ≈ 23 bilhões de t por ano; largura 40 anos.',
'Área ≈ (5 + 23) ÷ 2 × 40 = 14 × 40 = 560 bilhões de t, entre 300 e 800.'
]
};
VIS.def['area-sob-grafico-total'] = {
  tit: 'O total acumulado é a área sob o gráfico da taxa',
  fontes: [
    'OpenStax, Calculus Volume 1, 5.4 Integration Formulas and the Net Change Theorem — https://openstax.org/books/calculus-volume-1/pages/5-4-integration-formulas-and-the-net-change-theorem',
    'Wikipedia (en), Trapezoidal rule — https://en.wikipedia.org/wiki/Trapezoidal_rule'
  ],
  tipo: 'anim', dur: 11,
  marcas: [[0, '1. Retângulo'], [3.4, '2. Trapézio'], [7.2, '3. Fatias']],
  cred: 'Animação feita para o app. Gráfico desenhado a partir das fórmulas: 4 L/min; de 2 a 6 L/min em linha reta; r(t) = 0,5 + 0,06·t² L/min.',
  nota: 'Num gráfico de taxa (L por minuto, toneladas por ano, km por hora), a área entre a curva e o eixo do tempo tem a unidade do total: (L/min) × min = L. Trapézio: área = (altura inicial + altura final) ÷ 2 × largura.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function br(v, d) { return v.toFixed(d === undefined ? 1 : d).replace('.', ','); }
    var TF = 11;
    svg.setAttribute('viewBox', '0 0 640 350');
    var AGUA = '#2b6cb0';
    /* eixos: t de 0 a 10 min, taxa de 0 a 8 L/min */
    var X0 = 64, Y0 = 182, SX = 30, SY = 19;
    function X(t) { return X0 + SX * t; } function Y(r) { return Y0 - SY * r; }
    for (var k = 1; k <= 8; k++) el('line', { x1: X0, x2: X(10), y1: Y(k), y2: Y(k), style: 'stroke:var(--linha);stroke-width:1' });
    el('path', { d: 'M' + X0 + ' ' + (Y(8) - 8) + ' V' + Y0 + ' H' + (X(10) + 10), style: 'fill:none;stroke:var(--tinta);stroke-width:1.6' });
    [0, 2, 4, 6, 8].forEach(function (r) { tx(X0 - 8, Y(r) + 5, String(r), 'font-size:14px;fill:var(--lapis);text-anchor:end'); });
    [0, 2, 4, 6, 8, 10].forEach(function (s) { tx(X(s), Y0 + 19, String(s), 'font-size:14px;fill:var(--lapis);text-anchor:middle'); });
    tx(X0 + 4, Y(8) - 12, 'taxa (L/min)', 'font-size:14px;font-weight:600;fill:var(--lapis)');
    tx(X(10) + 12, Y0 + 5, 'min', 'font-size:14px;font-weight:600;fill:var(--lapis)');
    /* areas e curvas */
    var area = el('path', { style: 'fill:color-mix(in srgb,' + AGUA + ' 26%,var(--folha));stroke:none' });
    var media = el('path', { style: 'fill:none;stroke:var(--ad-c);stroke-width:2;stroke-dasharray:6 4' });
    var corte = el('path', { style: 'fill:color-mix(in srgb,var(--ad-c) 35%,var(--folha));stroke:var(--ad-c);stroke-width:1.4' });
    var fatias = el('g', {});
    var curva = el('path', { style: 'fill:none;stroke:' + AGUA + ';stroke-width:3' });
    var cotas = el('g', {});
    var cA = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + AGUA, cotas), cB = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + AGUA, cotas), cM = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:var(--ad-t)', cotas);
    /* caixa da conta */
    el('rect', { x: 404, y: 22, width: 226, height: 168, rx: 12, style: 'fill:var(--folha2);stroke:var(--linha);stroke-width:1.4' });
    var k1 = tx(418, 50, '', 'font-size:15px;font-weight:700;fill:var(--tinta)'), k2 = tx(418, 80, '', 'font-size:15px;fill:var(--tinta)'), k3 = tx(418, 106, '', 'font-size:15px;fill:var(--tinta)'), k4 = tx(418, 132, '', 'font-size:15px;fill:var(--tinta)'), k5 = tx(418, 168, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    /* faixa de texto */
    el('line', { x1: 16, x2: 624, y1: 214, y2: 214, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(20, 240, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)')];
    for (var j = 0; j < 4; j++) P.push(tx(20, 266 + 22 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Taxa constante: o total é um retângulo', 'Uma torneira solta 4 L por minuto. Em 5 min saem 4 × 5 = 20 L.', 'No gráfico, isso é a área do retângulo de altura 4 e base 5.', 'Unidades: (L/min) × min = L. A área tem a unidade do total.'],
      ['2. Taxa que cresce em linha reta: trapézio', 'Agora a vazão sobe de 2 para 6 L/min em 5 min. A área é um trapézio.', 'O triângulo de cima, recortado, tapa o buraco: vira um retângulo', 'de altura média (2 + 6) ÷ 2 = 4. Total = 4 × 5 = 20 L.'],
      ['3. Curva qualquer: fatias em trapézios', 'Corte o tempo em fatias e troque cada pedaço por um trapézio.', 'Soma das 5 fatias ≈ 25,4 L; a área exata sob esta curva é 25 L.', 'Quanto mais fina a fatia, mais perto do valor exato.']
    ];
    function r3(s) { return 0.5 + 0.06 * s * s; }
    var _desenha = function (t) {
      var f = t < 3.4 ? 0 : t < 7.2 ? 1 : 2;
      var d = '', cv = '', u, s, xe;
      op(media, 0); op(corte, 0); op(fatias, 0); op(cotas, 1); cM.textContent = '';
      if (f === 0) {
        u = ease(t / 2.4); xe = 5 * u;
        d = 'M' + X(0) + ' ' + Y0 + ' V' + Y(4) + ' H' + X(xe) + ' V' + Y0 + ' Z';
        cv = 'M' + X(0) + ' ' + Y(4) + ' H' + X(5);
        cA.setAttribute('x', X(0) + 6); cA.setAttribute('y', Y(4) - 8); cA.textContent = '4 L/min';
        cB.textContent = '';
        k1.textContent = 'total = área'; k2.textContent = 'altura: 4 L/min'; k3.textContent = 'base: ' + br(xe) + ' min'; k4.textContent = '';
        k5.textContent = '= ' + br(4 * xe) + ' L';
      } else if (f === 1) {
        u = ease((t - 3.4) / 1.6); xe = 5 * u;
        d = 'M' + X(0) + ' ' + Y0 + ' L' + X(0) + ' ' + Y(2) + ' L' + X(xe) + ' ' + Y(2 + 0.8 * xe) + ' V' + Y0 + ' Z';
        cv = 'M' + X(0) + ' ' + Y(2) + ' L' + X(5) + ' ' + Y(6);
        cA.setAttribute('x', X(0) + 6); cA.setAttribute('y', Y(2) + 18); cA.textContent = '2';
        cB.setAttribute('x', X(5) + 6); cB.setAttribute('y', Y(6) + 4); cB.textContent = '6';
        /* recorte: o triangulo acima da media (de 2,5 a 5 min) gira e tapa o buraco abaixo da media (de 0 a 2,5 min) */
        var v = ease((t - 5.2) / 1.2);
        if (t > 5.0) {
          op(media, 1);
          media.setAttribute('d', 'M' + X(0) + ' ' + Y(4) + ' H' + X(5));
          var ang = 180 * v, cx = X(2.5), cy = Y(4);
          corte.setAttribute('d', 'M' + X(2.5) + ' ' + Y(4) + ' L' + X(5) + ' ' + Y(6) + ' L' + X(5) + ' ' + Y(4) + ' Z');
          corte.setAttribute('transform', 'rotate(' + ang.toFixed(1) + ' ' + cx + ' ' + cy + ')');
          op(corte, 1);
          cM.setAttribute('x', X(5) + 8); cM.setAttribute('y', Y(4) + 20); cM.textContent = v > .95 ? 'média 4' : '';
          if (v > 0) d = 'M' + X(0) + ' ' + Y0 + ' L' + X(0) + ' ' + Y(2) + ' L' + X(2.5) + ' ' + Y(4) + ' L' + X(5) + ' ' + Y(4) + ' V' + Y0 + ' Z';
        }
        k1.textContent = 'total = área do trapézio'; k2.textContent = '(2 + 6) ÷ 2 = 4 L/min'; k3.textContent = '4 L/min × 5 min'; k4.textContent = '';
        k5.textContent = t > 5.6 ? '= 20 L' : '';
      } else {
        u = ease((t - 7.2) / 1.8); xe = 10 * u;
        for (s = 0; s <= 10.001; s += .25) cv += (cv ? 'L' : 'M') + X(s).toFixed(1) + ' ' + Y(r3(s)).toFixed(1) + ' ';
        d = 'M' + X(0) + ' ' + Y0;
        for (s = 0; s <= xe + 1e-6; s += .25) d += ' L' + X(s).toFixed(1) + ' ' + Y(r3(s)).toFixed(1);
        d += ' L' + X(xe).toFixed(1) + ' ' + Y(r3(xe)).toFixed(1) + ' L' + X(xe).toFixed(1) + ' ' + Y0 + ' Z';
        while (fatias.firstChild) fatias.removeChild(fatias.firstChild);
        var nF = Math.min(5, Math.floor(xe / 2 + 1e-6)), soma = 0;
        for (var i = 0; i < nF; i++) {
          var a = 2 * i, b = a + 2; soma += (r3(a) + r3(b)) / 2 * 2;
          el('path', { d: 'M' + X(a) + ' ' + Y0 + ' L' + X(a) + ' ' + Y(r3(a)).toFixed(1) + ' L' + X(b) + ' ' + Y(r3(b)).toFixed(1) + ' L' + X(b) + ' ' + Y0 + ' Z', style: 'fill:none;stroke:var(--ad-c);stroke-width:1.6' }, fatias);
        }
        op(fatias, 1); cA.textContent = ''; cB.textContent = '';
        k1.textContent = 'fatias de 2 min'; k2.textContent = 'cada uma: (r₁ + r₂) ÷ 2 × 2'; k3.textContent = nF + ' de 5 fatias somadas'; k4.textContent = 'exato: 25 L';
        k5.textContent = '≈ ' + br(soma) + ' L';
      }
      area.setAttribute('d', d); curva.setAttribute('d', cv);
      var L = TXT[f]; for (var j = 0; j < 5; j++) P[j].textContent = L[j] || '';
    };
    return fimResposta(VIS.def['area-sob-grafico-total'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return 7.1; }
    });
  }
};
VIS.liga('area-sob-grafico-total', ['P37bafd0']);
