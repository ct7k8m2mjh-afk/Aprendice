/* Telomeros encurtam a cada divisao; telomerase (DNA polimerase com RNA molde) repoe nas celulas tumorais; inibidor devolve o limite. */
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
'P411044a': [
'Por isso a resposta é C',
'A célula cancerosa só se divide sem limite porque a telomerase repõe',
'as pontas a cada divisão. Inibida a enzima, os telômeros voltam a',
'encurtar até o limite, e a célula tumoral para de se multiplicar.'
]
};
VIS.def['telomeros-telomerase'] = {
  tit: 'Telômeros encurtam; a telomerase repõe',
  fontes: ['OpenStax, Biology 2e, 14.5 DNA Replication in Eukaryotes (Telomere replication) — https://openstax.org/books/biology-2e/pages/14-5-dna-replication-in-eukaryotes', 'Khan Academy, Telomeres and telomerase — https://www.khanacademy.org/science/biology/dna-as-the-genetic-material/dna-replication/a/telomeres-telomerase', 'Wikipedia (en), Telomerase — https://en.wikipedia.org/wiki/Telomerase'],
  tipo: 'anim', dur: 13.4,
  marcas: [[0, 'Célula normal'], [3.6, 'Limite'], [6.6, 'Célula tumoral'], [10, 'Inibidor']],
  cred: 'Animação feita para o app (esquema fora de escala; nos humanos o telômero é a sequência TTAGGG repetida centenas de vezes).',
  nota: 'A cópia do DNA não chega até o fim da ponta de uma das fitas, então o cromossomo perde um pedaço do telômero a cada divisão. A telomerase é uma DNA polimerase que usa um RNA próprio como molde e alonga essa ponta. A maioria das células do corpo quase não a expressa; muitas células tumorais a religam.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    var TEL = '#c47a12', COR = '#5b7fb4', ENZ = '#2f855a', INI = '#8a5a9e', LIM = '#b4442f';
    svg.setAttribute('viewBox', '0 0 640 350');
    var T = [0, 3.6, 6.6, 10], TF = 13.4, LMIN = 18;
    /* cenario: lista de comprimentos por divisao */
    var NORM = [70, 61, 52, 43, 34, 25, 16];
    var TUM = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40];
    var INB = [40, 31, 22, 13];
    var DT = .42;
    function estado(t) {
      var f = t < T[1] ? 0 : t < T[2] ? 1 : t < T[3] ? 2 : 3, seq, d, frac;
      if (f <= 1) { seq = NORM; d = Math.min(NORM.length - 1, Math.floor((t - .3) / DT)); if (d < 0) d = 0; }
      else if (f === 2) { seq = TUM; d = Math.min(TUM.length - 1, Math.floor((t - T[2] - .2) / .3)); if (d < 0) d = 0; }
      else { seq = INB; d = Math.min(INB.length - 1, Math.floor((t - T[3] - .4) / .55)); if (d < 0) d = 0; }
      return { f: f, seq: seq, d: d };
    }
    /* titulo do cenario */
    var cen = tx(14, 24, '', 'font-size:15px;font-weight:700;fill:var(--tinta)');
    /* cromossomo */
    el('rect', { x: 210, y: 42, width: 220, height: 26, rx: 6, style: 'fill:color-mix(in srgb,' + COR + ' 20%,var(--folha));stroke:' + COR + ';stroke-width:2' });
    tx(320, 60, 'genes', 'font-size:14px;font-weight:700;fill:#2c4a80;text-anchor:middle');
    var capE = el('rect', { y: 44, height: 22, rx: 5, style: 'fill:color-mix(in srgb,' + TEL + ' 30%,var(--folha));stroke:' + TEL + ';stroke-width:1.8' });
    var capD = el('rect', { y: 44, height: 22, rx: 5, style: 'fill:color-mix(in srgb,' + TEL + ' 30%,var(--folha));stroke:' + TEL + ';stroke-width:1.8' });
    var lblT = tx(150, 90, 'telômero', 'font-size:13.5px;font-weight:700;fill:#8a560b;text-anchor:middle');
    var lblT2 = tx(490, 90, 'telômero', 'font-size:13.5px;font-weight:700;fill:#8a560b;text-anchor:middle');
    /* telomerase na ponta direita */
    var gE = el('g', {});
    el('ellipse', { cx: 0, cy: 0, rx: 30, ry: 20, style: 'fill:color-mix(in srgb,' + ENZ + ' 22%,var(--folha));stroke:' + ENZ + ';stroke-width:2' }, gE);
    el('path', { d: 'M-20 6 H20', style: 'stroke:#8a5a9e;stroke-width:3' }, gE);
    tx(0, -26, 'telomerase', 'font-size:13.5px;font-weight:700;fill:#22633f;text-anchor:middle', gE);
    tx(36, 10, 'RNA molde', 'font-size:13px;fill:#6b4a80', gE);
    var gI = el('g', {});
    el('rect', { x: -12, y: -12, width: 24, height: 24, rx: 4, style: 'fill:' + INI }, gI);
    el('path', { d: 'M-26 -18 L26 18 M-26 18 L26 -18', style: 'stroke:' + LIM + ';stroke-width:3' }, gI);
    tx(38, 34, 'inibidor', 'font-size:13.5px;font-weight:700;fill:' + INI, gI);
    /* grafico */
    var GX = 60, GY = 200, SX = 34, SY = 1.4;
    el('path', { d: 'M' + GX + ' 96 V' + GY + ' H' + (GX + 360), style: 'fill:none;stroke:var(--tinta);stroke-width:1.5' });
    tx(GX - 6, 108, 'tamanho', 'font-size:13px;fill:var(--lapis);text-anchor:end');
    tx(GX - 6, 123, 'do', 'font-size:13px;fill:var(--lapis);text-anchor:end');
    tx(GX - 6, 138, 'telômero', 'font-size:13px;fill:var(--lapis);text-anchor:end');
    tx(GX + 360, GY - 6, 'divisões →', 'font-size:13px;fill:var(--lapis);text-anchor:end');
    el('line', { x1: GX, x2: GX + 360, y1: GY - LMIN * SY, y2: GY - LMIN * SY, style: 'stroke:' + LIM + ';stroke-width:1.5;stroke-dasharray:5 4' });
    tx(GX + 360, GY - LMIN * SY - 5, 'limite: a célula para', 'font-size:13px;font-weight:700;fill:' + LIM + ';text-anchor:end');
    var curva = el('path', { style: 'fill:none;stroke:' + TEL + ';stroke-width:3;stroke-linejoin:round' });
    var ponto = el('circle', { r: 5, style: 'fill:' + TEL });
    /* caixa de estado */
    el('rect', { x: 440, y: 104, width: 188, height: 100, rx: 12, style: 'fill:var(--folha);stroke:var(--linha);stroke-width:1.5' });
    var e1 = tx(454, 128, '', 'font-size:14.5px;font-weight:700;fill:var(--tinta)');
    var e2 = tx(454, 150, '', 'font-size:13.5px;fill:var(--tinta)');
    var e3 = tx(454, 170, '', 'font-size:13.5px;fill:var(--tinta)');
    var e4 = tx(454, 190, '', 'font-size:13.5px;fill:var(--tinta)');
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 216, y2: 216, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 240, '', 'font-size:15px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 265 + 23 * j, '', 'font-size:14.5px;fill:var(--tinta)'));
    var TXT = [
      ['1. A cada divisão, a ponta fica mais curta', 'As pontas dos cromossomos (telômeros) são repetições sem genes.', 'A replicação não copia até o fim de uma das fitas, então um pedaço', 'do telômero se perde a cada divisão: funciona como um contador.'],
      ['2. O contador chega ao limite', 'Com o telômero curto demais, a célula para de se dividir', '(senescência) ou entra em apoptose. É um freio natural:', 'nenhuma célula comum do corpo se divide para sempre.'],
      ['3. Célula tumoral: a telomerase repõe a ponta', 'A telomerase usa seu próprio RNA como molde para fazer DNA', '(DNA polimerase dependente de RNA) e alonga o telômero.', 'A maioria das células de câncer a religa: dividem sem limite.'],
      ['4. Inibindo a telomerase', 'Sem a enzima, a célula tumoral volta a perder telômero a cada', 'divisão. Em poucas rodadas chega ao limite e para de se dividir', 'ou morre: a multiplicação do câncer é freada.']
    ];
    var EST = [
      ['célula comum', 'pouca telomerase:', 'telômero encurta', 'a cada divisão'],
      ['parou de dividir', 'senescência ou', 'apoptose', ''],
      ['célula tumoral', 'telomerase ativa:', 'a ponta é refeita', 'e a divisão segue'],
      ['telomerase inibida', 'a ponta encurta', 'de novo: a célula', 'tumoral para']
    ];
    var _desenha = function (t) {
      var s = estado(t), L = s.seq[s.d];
      /* na celula tumoral, entre divisoes a ponta encurta e a telomerase refaz */
      var serr = 0;
      if (s.f === 2) { var w = ((t - T[2] - .2) / .3) % 1; if (w < 0) w = 0; serr = w < .5 ? 9 * (w / .5) : 9 * (1 - (w - .5) / .5); L = 40 - serr; }
      capE.setAttribute('x', (210 - L).toFixed(1)); capE.setAttribute('width', L.toFixed(1));
      capD.setAttribute('x', 430); capD.setAttribute('width', L.toFixed(1));
      lblT.setAttribute('x', (210 - L / 2).toFixed(1)); lblT2.setAttribute('x', (430 + L / 2).toFixed(1));
      gE.setAttribute('transform', 'translate(' + (430 + L + 34).toFixed(1) + ' 55)'); op(gE, s.f >= 2 ? 1 : 0);
      gI.setAttribute('transform', 'translate(' + (430 + L + 34).toFixed(1) + ' 55)'); op(gI, s.f === 3 ? 1 : 0);
      cen.textContent = s.f <= 1 ? 'Célula comum do corpo' : 'Célula tumoral' + (s.f === 3 ? ' + inibidor da telomerase' : '');
      /* curva */
      var d = '';
      if (s.f === 2) { var n = (t - T[2] - .2) / .3, x; if (n < 0) n = 0; for (var k = 0; k <= n * 2 && k <= 20; k++) { x = GX + 10 + k / 2 * SX; d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + (GY - (k % 2 ? 31 : 40) * SY).toFixed(1) + ' '; } }
      else for (var i = 0; i <= s.d; i++) d += (i ? 'L' : 'M') + (GX + 10 + i * SX) + ' ' + (GY - s.seq[i] * SY).toFixed(1) + ' ';
      curva.setAttribute('d', d);
      var pts = d.trim().split(/[ML]/).filter(Boolean), ult = pts[pts.length - 1].trim().split(' ');
      ponto.setAttribute('cx', ult[0]); ponto.setAttribute('cy', ult[1]);
      var fim = (s.f <= 1 && s.d === NORM.length - 1) || (s.f === 3 && s.d === INB.length - 1);
      var ei = s.f === 0 ? (fim ? 1 : 0) : s.f === 1 ? 1 : s.f === 2 ? 2 : 3;
      var E = EST[ei]; e1.textContent = E[0]; e2.textContent = E[1]; e3.textContent = E[2]; e4.textContent = E[3];
      e1.style.fill = ei === 1 || (ei === 3 && fim) ? LIM : 'var(--tinta)';
      var L2 = TXT[s.f];
      for (var j = 0; j < 4; j++) P[j].textContent = L2[j];
    };
    return fimResposta(VIS.def['telomeros-telomerase'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return TF - .01; }
    });
  }
};
VIS.liga('telomeros-telomerase', ['P411044a']);
