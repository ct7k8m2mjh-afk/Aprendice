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
'P1a742a2': [
'Por isso a resposta é C',
'Os núcleos instáveis vão se desintegrando e sobram cada vez menos:',
'a intensidade das emissões cai sem parar. A meia-vida não muda',
'com o tempo; o isótopo é instável; não emite raios X.'
],
'P11053ba': [
'Por isso a resposta é A',
'1 000 → 125 MBq é 1/8: 3 meias-vidas em 36 dias → t½ = 12 dias.',
'Ba tem Z = 56: nêutrons = 131 − 56 = 75.'
],
'P6fdaa81': [
'Por isso a resposta é D',
'8 meses ≈ 240 dias = 4 meias-vidas de 60 dias.',
'1 g → 1/2 → 1/4 → 1/8 → 1/16 g = 0,0625 g = 6,25 × 10⁻² g.'
],
'Pc019706': [
'Por isso a resposta é E',
'De 1986 a 2016 passaram 30 anos, quase uma meia-vida (28 anos).',
'Em uma meia-vida, metade do Sr-90 se transforma em Y-90: ≈ 1/2.'
],
'Pd6cc8c0': [
'Por isso a resposta é A',
'300 → 150 → 75 MBq: a atividade cai à metade a cada 1 h.',
'Emissão α: Z 83 − 2 = 81, o tálio (A 212 − 4 = 208).'
],
'Pf7012c2': [
'Por isso a resposta é C',
'No gráfico, 740 → 370 MBq leva 80 h: essa é a meia-vida.',
'92,5 = 740 ÷ 8: são 3 meias-vidas = 240 h = 10,0 dias.'
],
'W0b6b3e5': [
'Por isso a resposta é B',
'4,0 × 10²³ → 2,0 × 10²³ → 1,0 × 10²³: caiu para 1/4,',
'são 2 meias-vidas: 2 × 3,16 = 6,32 minutos.'
],
'Wc007f1d': [
'Por isso a resposta é D',
'100 g → 50 g em 30 anos: t½ = 30 anos. Desintegrar 87,5% é',
'sobrar 12,5% = 1/8: 3 meias-vidas = 90 anos.'
],
'Wc5d94af': [
'Por isso a resposta é D',
'21 g de Po-210 = 0,1 mol. 276 dias = 2 meias-vidas: resta 1/4,',
'decaem 3/4 = 0,075 mol, e cada um solta 1 α (vira 1 He).',
'0,075 mol × 4 g/mol = 0,30 g de hélio.'
],
'Pe7d6d5f': [
'Por isso a resposta é D',
'O combustível fóssil tem milhões de anos: centenas de meias-vidas',
'do ¹⁴C (5 700 anos). Não sobra ¹⁴C, só ¹²C: queimar esse carbono',
'aumenta a proporção ¹²C/¹⁴C da atmosfera.'
]
};
VIS.def['meia-vida-decaimento'] = {
  tit: 'Meia-vida: metade a cada período',
  fontes: ['OpenStax, Chemistry 2e, 21.3 Radioactive Decay (meia-vida, datação por carbono-14) — https://openstax.org/books/chemistry-2e/pages/21-3-radioactive-decay', 'Wikipedia (en), Half-life — https://en.wikipedia.org/wiki/Half-life', 'Wikipedia (en), Caesium-137 (meia-vida de cerca de 30 anos) — https://en.wikipedia.org/wiki/Caesium-137'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Metades'], [3, 'Gráfico'], [6, 'Fração → n'], [9, 'Quem decai'], [12, 'Carbono-14']],
  cred: 'Animação feita para o app. Curva N = N₀ · (1/2)^(t/t½) calculada no código; cada quadradinho é um núcleo (o instante em que cada um decai é sorteado, só o total segue a curva).',
  nota: 'A meia-vida é fixa para cada isótopo: não depende da quantidade nem do tempo que já passou. O que cai é a quantidade de núcleos e, junto com ela, a atividade (emissões por segundo).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vg(v) { return String(v).replace('.', ','); }
    var PAI = '#b4442f', FIL = '#2b6cb0';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3, NMAX = 5;
    /* grafico */
    var X0 = 76, X1 = 384, Y0 = 196, Y1 = 34;
    function gx(n) { return X0 + (X1 - X0) * n / NMAX; }
    function gy(f) { return Y0 - (Y0 - Y1) * f; }
    function frac(n) { return Math.pow(.5, n); }
    el('path', { d: 'M' + X0 + ' ' + (Y1 - 8) + ' V' + Y0 + ' H' + (X1 + 10), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' });
    var GUIA = [];
    for (var n = 1; n <= NMAX; n++) {
      var g = el('g', {});
      el('path', { d: 'M' + X0 + ' ' + gy(frac(n)).toFixed(1) + ' H' + gx(n).toFixed(1) + ' V' + Y0, style: 'fill:none;stroke:var(--lapis);stroke-width:1;stroke-dasharray:4 4' }, g);
      GUIA.push(g);
    }
    var YL = [], XL = [];
    for (n = 0; n <= 3; n++) YL.push(tx(X0 - 8, gy(frac(n)) + 5, '', 'font-size:14px;fill:var(--tinta);text-anchor:end'));
    for (n = 0; n <= NMAX; n++) XL.push(tx(gx(n), Y0 + 18, '', 'font-size:14px;fill:var(--tinta);text-anchor:middle'));
    var xT = tx(X1 + 14, Y0 + 5, '', 'font-size:14px;fill:var(--lapis)'), yT = tx(X0 - 8, Y1 - 14, '', 'font-size:14px;font-weight:600;fill:var(--lapis)');
    var cur = el('path', { style: 'fill:none;stroke:' + PAI + ';stroke-width:3' }), filha = el('path', { style: 'fill:none;stroke:' + FIL + ';stroke-width:3;stroke-dasharray:7 5' });
    var pt = el('circle', { r: 6, style: 'fill:' + PAI + ';stroke:var(--folha);stroke-width:2' });
    var ptT = tx(0, 0, '', 'font-size:15px;font-weight:700;fill:' + PAI);
    var fT = tx(0, 0, '', 'font-size:14px;font-weight:700;fill:' + FIL);
    var tH = el('g', {}); el('path', { d: 'M' + gx(0) + ' ' + gy(.5) + ' H' + gx(1) + ' V' + Y0, style: 'fill:none;stroke:var(--ad-c);stroke-width:2.6' }, tH); tx(gx(1) + 8, gy(.5) - 8, 't½ ≈ 30 anos', 'font-size:14px;font-weight:700;fill:var(--ad-t)', tH);
    /* nucleos */
    var sem = 3; function rnd() { sem = (sem * 9301 + 49297) % 233280; return sem / 233280; }
    var NN = 64, ord = [];
    for (var k = 0; k < NN; k++) ord.push([rnd(), k]);
    ord.sort(function (a, b) { return a[0] - b[0]; });
    var rank = []; ord.forEach(function (o, i) { rank[o[1]] = i; });
    var QS = [], QX = 440, QY = 40;
    for (k = 0; k < NN; k++) QS.push(el('rect', { x: QX + (k % 8) * 22, y: QY + Math.floor(k / 8) * 20, width: 18, height: 16, rx: 3 }));
    var qT = tx(QX + 87, 216, '', 'font-size:15px;font-weight:700;fill:' + PAI + ';text-anchor:middle');
    var qH = tx(QX, 30, 'cada quadrado = 1 núcleo', 'font-size:14px;fill:var(--lapis)');
    /* caixa do carbono-14 */
    var c5 = el('g', {});
    el('rect', { x: 424, y: 34, width: 208, height: 176, rx: 10, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:1.5' }, c5);
    var T14 = 5730, IDADE = 1e6, nC = IDADE / T14, expo = Math.floor(nC * Math.log10(.5));
    [['¹⁴C: t½ ≈ ' + T14.toLocaleString('pt-BR') + ' anos', 1], ['petróleo, carvão: ', 0], ['milhões de anos', 0], ['1 000 000 ÷ ' + T14.toLocaleString('pt-BR') + ' ≈ ' + Math.round(nC), 0], ['meias-vidas → resta', 0], ['(1/2)' + String(Math.round(nC)).replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]; }) + ' ≈ 10' + String(expo).replace('-', '⁻').replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]; }), 1], ['do ¹⁴C: nada', 1]].forEach(function (l, i) {
      tx(436, 60 + 24 * i, l[0], 'font-size:15px;' + (l[1] ? 'font-weight:700;fill:var(--ad-t)' : 'fill:var(--tinta)'), c5);
    });
    /* painel */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['A cada meia-vida, sobra a metade', 'Depois de 1 meia-vida resta 1/2; de 2, 1/4; de 3, 1/8; de 4, 1/16.', 'A curva nunca chega a zero de uma vez: cai rápido no começo e depois', 'devagar. A meia-vida é sempre o mesmo intervalo.'],
      ['Ler a meia-vida num gráfico ou tabela', 'Exemplo: césio-137 (acidente de Goiânia): 100 g viram 50 g em ≈ 30 anos.', 'Ache no eixo do tempo onde a quantidade (ou a atividade) caiu', 'à metade do valor inicial: esse intervalo é a meia-vida.'],
      ['Da fração que sobrou ao número de meias-vidas', 'Restou 1/2ⁿ → passaram n meias-vidas. 12,5% = 1/8 → n = 3.', 'Cuidado: "desintegrou 87,5%" é o mesmo que "restou 12,5%".', 'Tempo = n × meia-vida (com césio-137: 3 × 30 = 90 anos).'],
      ['O que decai vira outro núcleo', 'Cada núcleo que decai vira o núcleo filho (linha tracejada) e solta', 'a partícula (uma α vira um átomo de He). Decaídos = inicial − restante.', 'A atividade é proporcional ao que resta: cai junto, pela metade.'],
      ['Carbono-14 e combustível fóssil', 'Seres vivos repõem ¹⁴C o tempo todo; depois da morte ele só decai.', 'Em milhões de anos passam centenas de meias-vidas: não sobra ¹⁴C.', 'Queimar carvão e petróleo joga na atmosfera CO₂ só com ¹²C.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D;
      var nn = i === 0 ? NMAX * cl((u - .1) / 2.6) : i === 2 ? 3 * ease((u - .3) / 1.6) : i === 3 ? NMAX * cl(u / 2.4) : i === 1 ? 4 * ease((u - .3) / 2.2) : NMAX;
      /* rotulos dos eixos */
      var CS = i === 1 || i === 2;
      YL.forEach(function (y, k) { y.textContent = i === 1 ? vg(100 / Math.pow(2, k)) + ' g' : i === 2 ? vg(100 / Math.pow(2, k)) + '%' : (k === 0 ? '1' : '1/' + Math.pow(2, k)); });
      XL.forEach(function (x, k) { x.textContent = CS ? String(30 * k) : String(k); });
      xT.textContent = CS ? 'anos' : 't½'; yT.textContent = i === 1 ? 'massa de Cs-137' : i === 2 ? 'quanto resta' : i === 3 ? 'fração' : 'fração que resta';
      GUIA.forEach(function (g, k) { op(g, k + 1 <= nn + .01 ? 1 : .15); });
      var d = '', dF = ''; for (var s = 0; s <= nn + 1e-6; s += .05) { d += (d ? 'L' : 'M') + gx(s).toFixed(1) + ' ' + gy(frac(s)).toFixed(1) + ' '; dF += (dF ? 'L' : 'M') + gx(s).toFixed(1) + ' ' + gy(1 - frac(s)).toFixed(1) + ' '; }
      cur.setAttribute('d', d); filha.setAttribute('d', dF); op(filha, i === 3 ? 1 : 0);
      pt.setAttribute('cx', gx(nn).toFixed(1)); pt.setAttribute('cy', gy(frac(nn)).toFixed(1));
      var nr = Math.round(nn * 100) / 100, inteiro = Math.abs(nr - Math.round(nr)) < .02;
      ptT.setAttribute('x', (gx(nn) + 10).toFixed(1)); ptT.setAttribute('y', (gy(frac(nn)) - 10).toFixed(1));
      ptT.textContent = i === 4 || !inteiro || Math.round(nr) === 0 ? '' : i === 1 ? vg(100 / Math.pow(2, Math.round(nr))) + ' g' : i === 2 ? 'restou 1/' + Math.pow(2, Math.round(nr)) + ' (' + vg(100 / Math.pow(2, Math.round(nr))) + '%)' : '1/' + Math.pow(2, Math.round(nr));
      fT.setAttribute('x', (gx(nn) - 6).toFixed(1)); fT.setAttribute('y', (gy(1 - frac(nn)) - 10).toFixed(1)); fT.style.textAnchor = 'end'; fT.textContent = i === 3 && nn > 1 ? 'decaídos' : '';
      /* nucleos */
      var resta = NN * frac(i === 4 ? NMAX : nn), mostrar = i !== 4;
      QS.forEach(function (q, k) { var vivo = rank[k] < Math.round(resta); q.style.fill = vivo ? PAI : 'color-mix(in srgb,' + FIL + ' 22%,var(--folha))'; q.style.stroke = vivo ? 'none' : FIL; q.style.strokeWidth = .8; op(q, mostrar ? 1 : 0); });
      qT.textContent = mostrar ? Math.round(resta) + ' de ' + NN + ' ainda instáveis' : '';
      op(c5, i === 4 ? 1 : 0); op(qH, mostrar ? 1 : 0); op(tH, (i === 1 && nn >= 1) || i === 2 ? 1 : 0);
      var Lx = TXT[i]; p0.textContent = Lx[0]; P.forEach(function (q, j) { q.textContent = Lx[j + 1] || ''; });
    };
    var CG = { 'P6fdaa81': D - .05, 'W0b6b3e5': D - .05, 'Pc019706': D - .05, 'P1a742a2': 4 * D - .05, 'P11053ba': 2 * D - .05, 'Pd6cc8c0': 2 * D - .05, 'Pf7012c2': 3 * D - .05, 'Wc007f1d': 3 * D - .05, 'Wc5d94af': 4 * D - .05, 'Pe7d6d5f': 5 * D - .05 };
    return fimResposta(VIS.def['meia-vida-decaimento'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 5 * D - .05; }
    });
  }
};
VIS.liga('meia-vida-decaimento', ['P1a742a2', 'P11053ba', 'P6fdaa81', 'Pc019706', 'Pd6cc8c0', 'Pf7012c2', 'W0b6b3e5', 'Wc007f1d', 'Wc5d94af', 'Pe7d6d5f']);
