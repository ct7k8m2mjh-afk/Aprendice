/* Rede ecologica da doenca de Lyme: Borrelia (bacteria) -> carrapato (vetor) -> humano; larvas e ninfas pegam a bacteria
   no camundongo-de-patas-brancas (reservatorio), adulto no veado; menos raposas -> mais camundongos -> mais casos. Lote bio 9. */
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
'Pe5d5b01': ['Por isso a resposta é D',
  'Os casos acompanharam a queda das raposas, não o número de',
  'veados. Isso só se explica se o carrapato que pica veados e',
  'pessoas também parasita o camundongo, onde pega a bactéria.']
};
VIS.def['doenca-de-lyme-cadeia'] = {
  tit: 'Doença de Lyme: por que menos raposas significam mais casos',
  fontes: ['Levi T. et al. (2012), Deer, predators, and the emergence of Lyme disease, PNAS 109(27) (casos ligados à queda das raposas e não à abundância de veados; pequenos mamíferos infectam 80 a 90% dos carrapatos; ninfas transmitem ao homem; veado é hospedeiro reprodutivo do adulto) — https://pmc.ncbi.nlm.nih.gov/articles/PMC3390851',
    'Ostfeld R. S. et al. (2006), Climate, deer, rodents, and acorns as determinants of variation in Lyme-disease risk, PLoS Biology 4(6): e145 — https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0040145',
    'Wikipedia (en), Lyme disease (larva, ninfa e adulto; reservatórios: camundongo-de-patas-brancas) — https://en.wikipedia.org/wiki/Lyme_disease'],
  tipo: 'anim', dur: 12.2,
  marcas: [[0, '1. Vetor'], [2.8, '2. Roedor'], [6, '3. Raposas'], [9.2, '4. Veados']],
  cred: 'Animação feita para o app (esquema; setas no sentido do efeito). Situação do nordeste dos Estados Unidos, carrapato Ixodes scapularis.',
  nota: 'O carrapato tem três fases (larva, ninfa, adulto) e cada uma faz uma refeição de sangue. Larvas e ninfas sugam sobretudo pequenos mamíferos, como o camundongo; a ninfa é a fase que mais transmite ao homem.',
  monta: function (svg, qid) {
    var K = kit(svg), el = K.el, tx = K.tx, cl = K.cl, ease = K.ease, lerp = K.lerp, op = K.op;
    svg.setAttribute('viewBox', '0 0 640 354');
    var M = [0, 2.8, 6, 9.2], TF = 12.2;
    var RAP = '#c0561e', CAM = '#7a6a5a', CAR = '#7a3a2a', HUM = '#2b6cb0', VEA = '#8a6a2a', BOL = '#5e7a2a', BOR = '#b02a6a';
    function no(x, y, w, l1, l2, cor) {
      var g = el('g', {});
      el('rect', { x: x, y: y, width: w, height: 50, rx: 10, style: 'fill:var(--folha);stroke:' + cor + ';stroke-width:2' }, g);
      tx(x + 12, y + 21, l1, 'font-size:14.5px;font-weight:700;fill:' + cor, g);
      tx(x + 12, y + 40, l2, 'font-size:13px;fill:var(--lapis)', g);
      g.x = x; g.y = y; g.w = w; return g;
    }
    var nRap = no(16, 12, 176, 'Raposa-vermelha', 'predadora', RAP);
    var nCam = no(16, 116, 214, 'Camundongo-de-patas-', 'brancas · reservatório', CAM);
    var nBol = no(16, 220, 176, 'Bolotas de carvalho', 'alimento', BOL);
    var nCar = no(306, 116, 152, 'Carrapato', 'vetor (Ixodes)', CAR);
    var nHum = no(480, 12, 146, 'Ser humano', 'doença de Lyme', HUM);
    var nVea = no(480, 220, 146, 'Veado', 'hospedeiro do adulto', VEA);
    function sinal(pai, x, y, s, cor) { el('circle', { cx: x, cy: y, r: 10, style: 'fill:var(--folha);stroke:' + cor + ';stroke-width:2' }, pai); tx(x, y + 5, s, 'font-size:15px;font-weight:700;fill:' + cor + ';text-anchor:middle', pai); }
    var aRap = el('g', {}); K.seta(aRap, 104, 64, 104, 112, RAP, 2.6); sinal(aRap, 104, 88, '−', '#b4442f'); tx(120, 93, 'come camundongos', 'font-size:13px;font-weight:600;fill:' + RAP, aRap);
    var aBol = el('g', {}); K.seta(aBol, 104, 218, 104, 170, BOL, 2.6); sinal(aBol, 104, 194, '+', '#2f7a34'); tx(120, 199, 'mais comida', 'font-size:13px;font-weight:600;fill:' + BOL, aBol);
    var aCam = el('g', {}); K.seta(aCam, 232, 141, 302, 141, CAR, 2.6);
    tx(267, 131, 'larva', 'font-size:13px;font-weight:700;fill:' + CAR + ';text-anchor:middle', aCam);
    tx(267, 160, 'suga', 'font-size:13px;fill:' + CAR + ';text-anchor:middle', aCam);
    var aHum = el('g', {}); K.seta(aHum, 420, 114, 520, 66, HUM, 2.6); tx(480, 106, 'a ninfa pica e', 'font-size:13px;font-weight:700;fill:' + HUM, aHum); tx(480, 122, 'passa a Borrelia', 'font-size:13px;fill:' + HUM, aHum);
    var aVea = el('g', {}); K.seta(aVea, 420, 168, 520, 216, VEA, 2.6); tx(482, 178, 'o adulto suga', 'font-size:13px;font-weight:700;fill:' + VEA, aVea); tx(482, 194, 'e se reproduz', 'font-size:13px;fill:' + VEA, aVea);
    /* fases do carrapato */
    var fases = el('g', {});
    [['larva', 0], ['ninfa', 1], ['adulto', 2]].forEach(function (f) {
      var x = 320 + f[1] * 46, r = 3 + f[1] * 2;
      el('ellipse', { cx: x, cy: 196, rx: r + 1, ry: r, style: 'fill:' + CAR }, fases);
      tx(x, 220, f[0], 'font-size:13px;fill:' + CAR + ';text-anchor:middle', fases);
      if (f[1] < 2) K.seta(fases, x + 10, 196, x + 34, 196, CAR, 1.6);
    });
    /* Borrelia: espiral */
    function espiral(pai) { return el('path', { d: 'M-12 0 q 2 -5 4 0 q 2 5 4 0 q 2 -5 4 0 q 2 5 4 0 q 2 -5 4 0 q 2 5 4 0', style: 'fill:none;stroke:' + BOR + ';stroke-width:2.2;stroke-linecap:round' }, pai); }
    var bor = el('g', {}); espiral(bor);
    var borT = tx(306, 100, 'Borrelia (bactéria)', 'font-size:13px;font-weight:700;font-style:italic;fill:' + BOR);
    /* marcadores de populacao */
    function seta2(no, s) { return tx(no.x + no.w - 10, no.y + 31, s > 0 ? '▲' : '▼', 'font-size:18px;font-weight:700;text-anchor:end;fill:' + (s > 0 ? '#2f7a34' : '#b4442f')); }
    var pRap = seta2(nRap, -1), pCam = seta2(nCam, 1), pCar = seta2(nCar, 1), pHum = seta2(nHum, 1);
    var pCarT = tx(nCar.x + 4, nCar.y + 70, '▲ mais carrapatos infectados', 'font-size:13px;font-weight:700;fill:#2f7a34');
    var veaQ = tx(nVea.x - 12, nVea.y + 22, 'nº de veados não', 'font-size:13px;font-weight:700;fill:' + VEA + ';text-anchor:end');
    var veaQ2 = tx(nVea.x - 12, nVea.y + 38, 'acompanhou os casos', 'font-size:13px;font-weight:700;fill:' + VEA + ';text-anchor:end');
    var painel = K.painel();
    var _desenha = function (t) {
      var e = K.etapa(t, M);
      op(nRap, e >= 2 ? 1 : .3); op(aRap, e >= 2 ? 1 : 0);
      op(nBol, e >= 2 ? (e === 2 ? 1 : .6) : .3); op(aBol, e === 2 ? cl((t - 7.6) / .4) : e > 2 ? .4 : 0);
      op(nCam, e >= 1 ? 1 : .3); op(aCam, e >= 1 ? 1 : 0);
      op(nCar, 1); op(fases, e === 1 ? 1 : e === 2 ? 0 : .35);
      op(nHum, 1); op(aHum, 1);
      op(nVea, e === 1 || e === 3 ? 1 : .35); op(aVea, e === 1 ? cl((t - 4.6) / .4) : e === 3 ? 1 : 0);
      op(veaQ, e === 3 ? 1 : 0); op(veaQ2, e === 3 ? 1 : 0);
      /* setas de populacao, uma depois da outra */
      op(pRap, e === 2 ? cl((t - 6.2) / .3) : e === 3 ? .5 : 0); op(pCam, e === 2 ? cl((t - 6.8) / .3) : e === 3 ? .5 : 0);
      op(pCar, 0); op(pCarT, e === 2 ? cl((t - 7.4) / .3) : 0);
      op(pHum, e === 2 ? cl((t - 8) / .3) : e === 3 ? .5 : 0);
      /* bacteria viajando: camundongo -> carrapato -> humano */
      var u, x, y;
      if (e === 0) { u = (t % 1.4) / 1.4; x = lerp(420, 520, u); y = lerp(114, 66, u); }
      else if (e === 1) { u = cl((t - 2.8) / 2.6); if (u < .5) { x = lerp(150, 380, u * 2); y = 141; } else { x = lerp(420, 520, u * 2 - 1); y = lerp(114, 66, u * 2 - 1); } }
      bor.setAttribute('transform', 'translate(' + (x || 0).toFixed(1) + ' ' + (y || 0).toFixed(1) + ')');
      op(bor, e <= 1 ? 1 : 0); op(borT, e <= 1 ? 1 : 0);
      var L;
      if (e === 0) L = ['1. Bactéria, vetor e hospedeiro', 'A doença é causada pela bactéria Borrelia burgdorferi. Ela chega ao ser', 'humano pela picada de um carrapato, que é o vetor.'];
      else if (e === 1) L = ['2. Onde o carrapato pega a bactéria', 'Larvas e ninfas sugam sobretudo camundongos-de-patas-brancas, o principal', 'reservatório da Borrelia. O adulto se alimenta e se reproduz no veado.'];
      else if (e === 2) L = ['3. Menos raposas → mais casos', 'Raposas comem camundongos. Com menos raposas (▼), sobram mais camundongos,', 'mais carrapatos se infectam e mais pessoas são picadas por ninfas com Borrelia.'];
      else L = ['4. E os veados?', 'O estudo de 2012 viu os casos acompanharem a queda das raposas, não o número', 'de veados: o elo decisivo é o camundongo, que o carrapato também parasita.'];
      painel(L);
    };
    return fimResposta(VIS.def['doenca-de-lyme-cadeia'], svg, _desenha, TF, RESP, qid, { congela: function () { return 5.9; } });
  }
};
VIS.liga('doenca-de-lyme-cadeia', ['Pe5d5b01']);
