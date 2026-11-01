/* Alelos multiplos: um gene ocupa um locus; mutacoes criam A1, A2, A3 na populacao (ex.: ABO com IA, IB, i);
   numa celula diploide ha um par de homologos -> no maximo dois alelos, um em cada cromossomo. */
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
'P78dcde2': [
'Por isso a resposta é D',
'São 3 alelos na população, mas na célula diploide só 2 cromossomos têm esse lócus:',
'um alelo em cada cromossomo do par. Na mesma célula, no máximo 2 alelos.'
],
'W271c9c2': [
'Por isso a resposta é C',
'Um só gene (um lócus) com 3 versões na população, Iᴬ, Iᴮ e i, é um caso de',
'alelos múltiplos: dão 6 genótipos e 4 tipos de sangue (A, B, AB e O).'
]
};
VIS.def['alelos-multiplos-locus'] = {
  tit: 'Alelos múltiplos: vários na população, dois em cada pessoa',
  fontes: ['OpenStax, Biology 2e, 12.2 Characteristics and Traits (Multiple Alleles: vários alelos na população, mas cada indivíduo diploide tem só dois) — https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits', 'Wikipedia (en), ABO blood group system (alelos IA, IB e i de um mesmo gene no cromossomo 9) — https://en.wikipedia.org/wiki/ABO_blood_group_system', 'Wikipedia (en), Locus (genetics) — https://en.wikipedia.org/wiki/Locus_(genetics)'],
  tipo: 'anim', dur: 10.6,
  marcas: [[0, '1. Lócus'], [2.6, '2. Mutações'], [5.2, '3. População'], [7.8, '4. Célula']],
  cred: 'Animação feita para o app (esquema fora de escala; a faixa colorida marca o lócus do gene).',
  nota: 'Alelos são versões de um mesmo gene e ficam no mesmo lócus de cromossomos homólogos. A população pode ter muitos alelos de um gene (alelos múltiplos), mas numa célula diploide esse lócus está em só dois cromossomos (um par de homólogos): no máximo dois alelos, um em cada.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); o.style.display = v <= 0 ? 'none' : ''; }
    svg.setAttribute('viewBox', '0 0 640 360');
    var COR = { A1: '#4f7fc0', A2: '#d9822b', A3: '#3f8a52', IA: '#4f7fc0', IB: '#d9822b', i: '#8a8a8a' };
    var CROM = 'fill:#d9cbb4;stroke:#8d7a5c;stroke-width:1.5';
    function cromH(x, y, len, bandas, pai) {   /* cromossomo deitado; bandas = lista de cores no locus */
      var g = el('g', {}, pai);
      el('rect', { x: x, y: y, width: len, height: 24, rx: 12, style: CROM }, g);
      el('path', { d: 'M' + (x + len * .3) + ' ' + y + ' q5 8 0 24', style: 'fill:none;stroke:#8d7a5c;stroke-width:1.5' }, g);
      bandas.forEach(function (c, k) { el('rect', { x: x + len * .55 + k * 14, y: y, width: 12, height: 24, style: 'fill:' + c }, g); });
      return g;
    }
    function cromV(x, y, h, bandas, pai) {   /* cromossomo em pe */
      var g = el('g', {}, pai);
      el('rect', { x: x - 9, y: y, width: 18, height: h, rx: 9, style: CROM }, g);
      el('path', { d: 'M' + (x - 9) + ' ' + (y + h * .3) + ' q9 5 18 0', style: 'fill:none;stroke:#8d7a5c;stroke-width:1.5' }, g);
      bandas.forEach(function (c, k) { el('rect', { x: x - 9, y: y + h * .58 + k * 11, width: 18, height: 10, style: 'fill:' + c }, g); });
      return g;
    }
    /* ===== etapa 1 ===== */
    var E1 = el('g', {});
    cromH(120, 100, 400, [COR.A1], E1);
    var XL = 120 + 400 * .55 + 6;
    el('path', { d: 'M' + XL + ' 92 V58', style: 'stroke:var(--tinta);stroke-width:1.5' }, E1);
    tx(XL, 50, 'lócus: o lugar fixo do gene no cromossomo', 'font-size:14.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', E1);
    tx(XL, 152, 'alelo A1', 'font-size:15px;font-weight:700;fill:' + COR.A1 + ';text-anchor:middle', E1);
    tx(XL, 172, '(a sequência de DNA que está nesse lugar)', 'font-size:13.5px;fill:var(--lapis);text-anchor:middle', E1);
    /* ===== etapa 2 ===== */
    var E2 = el('g', {});
    el('line', { x1: XL, x2: XL, y1: 34, y2: 190, style: 'stroke:var(--lapis);stroke-width:1.5;stroke-dasharray:4 4' }, E2);
    tx(XL, 24, 'mesmo lócus', 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:middle', E2);
    var lin2 = [['A1', 46], ['A2', 104], ['A3', 162]].map(function (r, k) {
      var g = el('g', {}, E2); cromH(120, r[1], 400, [COR[r[0]]], g);
      tx(100, r[1] + 17, r[0], 'font-size:16px;font-weight:700;fill:' + COR[r[0]] + ';text-anchor:end', g);
      return g;
    });
    var mut = el('g', {}, E2);
    el('path', { d: 'M62 58 C40 70 40 104 62 116 m-9 -2 l9 2 l-3 -9', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, mut);
    el('path', { d: 'M56 54 C18 76 18 160 56 174 m-9 -1 l9 1 l-4 -8', style: 'fill:none;stroke:var(--tinta);stroke-width:1.8' }, mut);
    tx(14, 212, 'mutações no mesmo gene', 'font-size:13.5px;fill:var(--lapis)', mut);
    tx(540, 112, 'alelos =', 'font-size:14px;font-weight:700;fill:var(--tinta)', E2);
    tx(540, 130, 'versões do', 'font-size:14px;fill:var(--tinta)', E2);
    tx(540, 148, 'mesmo gene', 'font-size:14px;fill:var(--tinta)', E2);
    /* ===== etapa 3: ABO ===== */
    var E3 = el('g', {});
    tx(20, 24, 'Exemplo: sistema ABO (gene no cromossomo 9), alelos Iᴬ, Iᴮ e i', 'font-size:14.5px;font-weight:700;fill:var(--tinta)', E3);
    var PARES = [['IA', 'IA', 'IᴬIᴬ', 'A'], ['IA', 'i', 'Iᴬi', 'A'], ['IB', 'IB', 'IᴮIᴮ', 'B'], ['IB', 'i', 'Iᴮi', 'B'], ['IA', 'IB', 'IᴬIᴮ', 'AB'], ['i', 'i', 'ii', 'O']];
    var pares = PARES.map(function (p, k) {
      var g = el('g', {}, E3), cx = 66 + k * 102;
      cromV(cx - 13, 44, 86, [COR[p[0]]], g); cromV(cx + 13, 44, 86, [COR[p[1]]], g);
      tx(cx, 158, p[2], 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', g);
      tx(cx, 178, 'tipo ' + p[3], 'font-size:13.5px;fill:var(--lapis);text-anchor:middle', g);
      return g;
    });
    var abo = tx(320, 216, '3 alelos na população → 6 genótipos → 4 tipos (A, B, AB, O)', 'font-size:14.5px;font-weight:700;fill:var(--ad-t);text-anchor:middle', E3);
    /* ===== etapa 4: uma celula ===== */
    var E4 = el('g', {});
    el('circle', { cx: 140, cy: 118, r: 100, style: 'fill:color-mix(in srgb,#e8b4a8 22%,var(--folha));stroke:#b98a74;stroke-width:2' }, E4);
    el('circle', { cx: 140, cy: 118, r: 64, style: 'fill:color-mix(in srgb,#9a7ab0 14%,var(--folha));stroke:#7b5a91;stroke-width:1.8' }, E4);
    cromV(124, 70, 92, [COR.A1], E4); cromV(156, 70, 92, [COR.A3], E4);
    tx(100, 133, 'A1', 'font-size:15px;font-weight:700;fill:' + COR.A1 + ';text-anchor:end', E4);
    tx(180, 133, 'A3', 'font-size:15px;font-weight:700;fill:' + COR.A3 + ';text-anchor:start', E4);
    tx(140, 238 - 6, 'célula diploide: 1 par com esse lócus', 'font-size:13.5px;font-weight:700;fill:var(--tinta);text-anchor:middle', E4);
    var e4b = el('g', {}, E4);
    tx(270, 30, 'Não acontece:', 'font-size:14.5px;font-weight:700;fill:#b4442f', e4b);
    cromV(296, 50, 96, [COR.A1, COR.A2, COR.A3], e4b);
    el('path', { d: 'M278 72 l36 60 M314 72 l-36 60', style: 'stroke:#b4442f;stroke-width:3' }, e4b);
    tx(326, 82, '2 ou 3 alelos no mesmo', 'font-size:13.5px;fill:var(--tinta)', e4b);
    tx(326, 100, 'cromossomo: um lócus', 'font-size:13.5px;fill:var(--tinta)', e4b);
    tx(326, 118, 'guarda uma versão só', 'font-size:13.5px;fill:var(--tinta)', e4b);
    var e4c = el('g', {}, E4);
    cromV(286, 160, 60, [COR.A1], e4c); cromV(306, 160, 60, [COR.A2], e4c); cromV(326, 160, 60, [COR.A3], e4c);
    tx(346, 176, '3 alelos na célula: só com 3', 'font-size:13.5px;fill:var(--tinta)', e4c);
    tx(346, 194, 'cópias do cromossomo', 'font-size:13.5px;fill:var(--tinta)', e4c);
    tx(346, 212, '(aneuploidia, uma alteração)', 'font-size:13.5px;fill:var(--lapis)', e4c);
    /* painel */
    el('line', { x1: 12, x2: 628, y1: 240, y2: 240, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P0 = tx(16, 266, '', 'font-size:18px;font-weight:700;fill:var(--ad-t)');
    var P = [0, 1, 2].map(function (i) { return tx(16, 290 + 22 * i, '', 'font-size:14.5px;fill:var(--tinta)'); });
    function painel(L) { P0.textContent = L[0]; P.forEach(function (p, i) { p.textContent = L[i + 1] || ''; }); }
    var _desenha = function (t) {
      var f = t < 2.6 ? 0 : t < 5.2 ? 1 : t < 7.8 ? 2 : 3, t0 = [0, 2.6, 5.2, 7.8][f], u = t - t0;
      op(E1, f === 0 ? cl(u / .3) : 0); op(E2, f === 1 ? cl(u / .3) : 0); op(E3, f === 2 ? cl(u / .3) : 0); op(E4, f === 3 ? cl(u / .3) : 0);
      if (f === 1) { op(lin2[0], 1); op(lin2[1], cl((u - .5) / .3)); op(lin2[2], cl((u - .9) / .3)); op(mut, cl((u - .4) / .3)); }
      if (f === 2) { pares.forEach(function (p, k) { op(p, cl((u - .2 - k * .2) / .3)); }); op(abo, cl((u - 1.5) / .3)); }
      if (f === 3) { op(e4b, cl((u - .8) / .3)); op(e4c, cl((u - 1.4) / .3)); }
      if (f === 0) painel(['1. Um gene, um endereço: o lócus', 'Cada gene ocupa sempre o mesmo lugar no seu cromossomo.', 'A sequência de DNA que está ali é o alelo daquele cromossomo.']);
      else if (f === 1) painel(['2. Mutações criam novos alelos', 'Mudanças no DNA desse gene geram A2 e A3 a partir de A1.', 'Todos ficam no mesmo lócus: são versões do mesmo gene (alelos múltiplos).']);
      else if (f === 2) painel(['3. Na população: muitos alelos', 'Os três alelos existem espalhados entre as pessoas.', 'Cada pessoa carrega uma combinação de dois: 6 genótipos possíveis no ABO.']);
      else painel(['4. Numa célula: no máximo dois', 'Na célula diploide, esse lócus está num par de homólogos (um de cada pai).', 'Um alelo em cada cromossomo do par: 2 iguais (homozigoto) ou 2 diferentes.']);
    };
    return fimResposta(VIS.def['alelos-multiplos-locus'], svg, _desenha, 10.6, RESP, qid, {
      semEsmaecer: true, x: 8, y: 242, w: 624, h: 114,
      congela: function (q) { return q === 'W271c9c2' ? 7.75 : 10.55; }
    });
  }
};
VIS.liga('alelos-multiplos-locus', ['P78dcde2', 'W271c9c2']);
