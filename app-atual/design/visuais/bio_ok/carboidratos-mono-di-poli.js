/* Carboidratos: monossacarideo (glicose, frutose), dissacarideo (sacarose por ligacao glicosidica),
   polissacarideos de reserva (amido nas plantas, glicogenio no figado e no musculo) e estrutural (celulose). */
function quebra(s, n) { var p = s.split(' '), L = [], a = ''; p.forEach(function (w) { if (a && (a + ' ' + w).length > n) { L.push(a); a = w; } else a = a ? a + ' ' + w : w; }); if (a) L.push(a); return L; }
/* etapa final "Resposta" (padrao de bio_ok/fermentacao-x-respiracao.js): congela o quadro que decide a questao aberta.
   Aqui o cartao ocupa o lugar do painel de texto (opc.esconde) e o desenho fica visivel ao lado. */
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
  var L = []; r.slice(1).forEach(function (s) { L = L.concat(opc.quebra ? quebra(s, opc.quebra) : [s]); });
  var lh = 22, w = opc.w || 520, h = 78 + lh * (L.length - 1), x = opc.x !== undefined ? opc.x : (vb[2] - w) / 2, y = opc.y !== undefined ? opc.y : (vb[3] - h) / 2;
  var c = el('g', {});
  el('rect', { x: x, y: y, width: w, height: h, rx: 14, style: 'fill:var(--folha);stroke:var(--ad-c);stroke-width:2' }, c);
  var t0 = el('text', { x: x + 16, y: y + 31, style: 'font-size:17px;font-weight:700;fill:var(--ad-t)' }, c); t0.textContent = r[0];
  L.forEach(function (s, i) { var t = el('text', { x: x + 16, y: y + 58 + lh * i, style: 'font-size:14.5px;fill:var(--tinta)' }, c); t.textContent = s; });
  var tc = typeof opc.congela === 'function' ? opc.congela(qid) : TF - 0.001;
  return function (t) {
    var on = t >= TF;
    desenha(on ? tc : t);
    g.style.opacity = on && !opc.semEsmaecer ? .14 : 1; c.style.opacity = on ? 1 : 0;
    if (opc.esconde) opc.esconde.style.opacity = on ? 0 : 1;
  };
}
var RESP = {
  'Wf5784a9': ['Por isso a resposta é D', 'O amido é uma cadeia de centenas a milhares de glicoses: poli = muitas unidades.'],
  'W46900f2': ['Por isso a resposta é E', 'Reserva de carboidrato é polissacarídeo. No animal (músculo e fígado) é o glicogênio; o amido é a reserva das plantas.'],
  'W42286f1': ['Por isso a resposta é E', 'Açúcar comum = sacarose (di); papel = celulose (poli); solução de glicose = mono. Na ordem pedida: di, poli, mono.']
};
VIS.def['carboidratos-mono-di-poli'] = {
  tit: 'Mono, di e polissacarídeos: conte as unidades',
  fontes: ['OpenStax, Biology 2e, 3.2 Carbohydrates — https://openstax.org/books/biology-2e/pages/3-2-carbohydrates', 'Wikipedia (en), Polysaccharide — https://en.wikipedia.org/wiki/Polysaccharide'],
  tipo: 'anim', dur: 18,
  marcas: [[0, 'Mono'], [3.6, 'Di'], [7.2, 'Reserva'], [10.8, 'Celulose'], [14.4, 'Classificar']],
  cred: 'Animação feita para o app (esquema: cada hexágono é uma glicose; o pentágono é a frutose).',
  nota: 'A classificação conta as unidades: mono = 1 (glicose, frutose), di = 2 (sacarose, maltose, lactose), poli = muitas (amido, glicogênio, celulose). Amido é reserva das plantas, glicogênio é reserva dos animais (fígado e músculo) e celulose é a fibra da parede vegetal.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vis(o, b) { o.style.display = b ? '' : 'none'; }
    function mv(o, x, y) { o.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var GL = '#c9a227', FR = '#d9822b', AM = '#c9a227', GG = '#b4442f', CE = '#3f8f3a';
    var B = 'font-size:13.5px;font-weight:700;', N = 'font-size:13px;';
    function poli(n, r) { var d = ''; for (var i = 0; i < n; i++) { var a = (i / n) * 2 * Math.PI - Math.PI / 2 + (n === 6 ? Math.PI / 6 : 0); d += (i ? 'L' : 'M') + (r * Math.cos(a)).toFixed(1) + ' ' + (r * Math.sin(a)).toFixed(1) + ' '; } return d + 'Z'; }
    function hex(pai, x, y, r, cor) { var p = el('path', { d: poli(6, r), style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:' + cor + ';stroke-width:' + (r > 14 ? 2.4 : 1.6) }, pai); mv(p, x, y); return p; }
    function pen(pai, x, y, r, cor) { var p = el('path', { d: poli(5, r), style: 'fill:color-mix(in srgb,' + cor + ' 30%,var(--folha));stroke:' + cor + ';stroke-width:2.4' }, pai); mv(p, x, y); return p; }
    /* ===== 1 mono ===== */
    var g1 = el('g', {});
    hex(g1, 110, 140, 38, GL); pen(g1, 270, 140, 36, FR);
    tx(110, 146, 'glicose', B + 'text-anchor:middle;fill:#6b5410', g1); tx(270, 146, 'frutose', B + 'text-anchor:middle;fill:#7a4512', g1);
    tx(110, 206, 'C₆H₁₂O₆', N + 'text-anchor:middle;fill:var(--lapis)', g1); tx(270, 206, 'C₆H₁₂O₆', N + 'text-anchor:middle;fill:var(--lapis)', g1);
    tx(190, 262, '1 unidade = monossacarídeo', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', g1);
    tx(190, 284, 'não se quebra em açúcar menor', N + 'text-anchor:middle;fill:var(--lapis)', g1);
    /* ===== 2 di ===== */
    var g2 = el('g', {});
    var dG = el('g', {}, g2); hex(dG, 0, 0, 34, GL); tx(0, 5, 'glicose', N + 'font-weight:700;text-anchor:middle;fill:#6b5410', dG);
    var dF = el('g', {}, g2); pen(dF, 0, 0, 32, FR); tx(0, 5, 'frutose', N + 'font-weight:700;text-anchor:middle;fill:#7a4512', dF);
    var lig = el('path', { d: 'M170 120 L208 120', style: 'stroke:var(--tinta);stroke-width:3' }, g2);
    var ligL = tx(190, 104, 'O', N + 'font-weight:800;text-anchor:middle;fill:var(--tinta)', g2);
    var h2o = el('g', {}, g2); tx(0, 0, '+ H₂O', B + 'text-anchor:middle;fill:#2f6db5', h2o);
    var dL = el('g', {}, g2);
    tx(190, 206, 'sacarose = 2 unidades = dissacarídeo', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--ad-t)', dL);
    tx(190, 228, 'é o açúcar comum, da cana', N + 'text-anchor:middle;fill:var(--tinta)', dL);
    tx(190, 266, 'outros: maltose (glicose + glicose)', N + 'text-anchor:middle;fill:var(--lapis)', dL);
    tx(190, 284, 'e lactose (glicose + galactose)', N + 'text-anchor:middle;fill:var(--lapis)', dL);
    /* ===== 3 reserva ===== */
    var g3 = el('g', {});
    var am = [];
    for (var i = 0; i < 13; i++) am.push(hex(g3, 30 + i * 25, 82, 10, AM));
    for (i = 0; i < 4; i++) am.push(hex(g3, 180 + i * 25, 112, 10, AM));
    var amL = el('path', { d: 'M30 82 H330 M168 82 L180 112 H255', style: 'fill:none;stroke:#8a6d12;stroke-width:1.4' }, g3); g3.insertBefore(amL, g3.firstChild);
    tx(14, 48, 'amido: reserva das plantas', B + 'fill:#8a6d12', g3);
    tx(14, 144, 'centenas a milhares de glicoses (pouco ramificado)', N + 'fill:var(--tinta)', g3);
    var gg = [], ggL = '';
    function ramo(x, y, dx, dy, n, nivel) {
      for (var k = 0; k < n; k++) {
        var px = x + dx * k, py = y + dy * k; gg.push([px, py]);
        if (k > 0) ggL += 'M' + (x + dx * (k - 1)).toFixed(1) + ' ' + (y + dy * (k - 1)).toFixed(1) + ' L' + px.toFixed(1) + ' ' + py.toFixed(1) + ' ';
        if (nivel < 2 && k % 3 === 1) { var s = nivel === 0 ? (k % 2 ? 1 : -1) : (dy > 0 ? 1 : -1); ggL += 'M' + px.toFixed(1) + ' ' + py.toFixed(1) + ' L' + (px + 14).toFixed(1) + ' ' + (py + s * 20).toFixed(1) + ' '; ramo(px + 14, py + s * 20, 20, s * 4, 4 - nivel, nivel + 1); }
      }
    }
    ramo(40, 268, 22, 0, 12, 0);
    el('path', { d: ggL, style: 'stroke:#8a2f22;stroke-width:1.4;fill:none' }, g3);
    var ggH = gg.map(function (p) { return hex(g3, p[0], p[1], 8, GG); });
    tx(14, 182, 'glicogênio: reserva dos animais', B + 'fill:' + GG, g3);
    tx(14, 200, 'no fígado e no músculo; muito ramificado', N + 'fill:var(--tinta)', g3);
    /* ===== 4 celulose ===== */
    var g4 = el('g', {});
    for (var r = 0; r < 4; r++) { el('line', { x1: 24, x2: 356, y1: 100 + r * 34, y2: 100 + r * 34, style: 'stroke:#24631f;stroke-width:1.4' }, g4); for (i = 0; i < 14; i++) hex(g4, 30 + i * 24, 100 + r * 34, 9, CE); }
    var pH = ''; for (r = 0; r < 3; r++) for (i = 0; i < 14; i += 2) pH += 'M' + (30 + i * 24 + 6) + ' ' + (110 + r * 34) + ' v14 ';
    el('path', { d: pH, style: 'stroke:#2f6db5;stroke-width:1.6;stroke-dasharray:3 2' }, g4);
    tx(14, 60, 'celulose: cadeias retas e paralelas de glicose', B + 'fill:' + CE, g4);
    tx(14, 78, 'presas umas às outras (tracejado): fibras resistentes', N + 'fill:var(--tinta)', g4);
    tx(14, 252, 'forma a parede da célula vegetal;', B + 'fill:var(--tinta)', g4);
    tx(14, 272, 'é o material do papel e do algodão', B + 'fill:var(--tinta)', g4);
    tx(14, 300, 'também é polissacarídeo (milhares de glicoses)', N + 'fill:var(--lapis)', g4);
    /* ===== 5 tabela ===== */
    var g5 = el('g', {});
    var CX = [14, 128, 228, 304];
    ['material', 'molécula', 'unidades', 'grupo'].forEach(function (h, k) { tx(CX[k], 44, h, B + 'fill:var(--lapis)', g5); });
    el('line', { x1: 14, x2: 380, y1: 54, y2: 54, style: 'stroke:var(--linha);stroke-width:1.5' }, g5);
    var LIN = [['açúcar comum', 'sacarose', '2', 'di'], ['papel', 'celulose', 'milhares', 'poli'], ['sol. de glicose', 'glicose', '1', 'mono'], ['amido', 'amido', 'milhares', 'poli'], ['glicogênio', 'glicogênio', 'milhares', 'poli']];
    var rows = LIN.map(function (l, k) {
      var g = el('g', {}, g5), y = 84 + k * 40;
      if (k < 3) el('rect', { x: 8, y: y - 22, width: 376, height: 34, rx: 8, style: 'fill:color-mix(in srgb,var(--ad-c) 9%,var(--folha))' }, g);
      l.forEach(function (c, j) { tx(CX[j], y, c, 'font-size:14px;' + (j === 3 ? 'font-weight:800;fill:var(--ad-t)' : j === 0 ? 'font-weight:700;fill:var(--tinta)' : 'fill:var(--tinta)'), g); });
      return g;
    });
    tx(14, 300, 'a classificação só conta as unidades:', B + 'fill:var(--tinta)', g5);
    tx(14, 320, 'mono = 1, di = 2, poli = muitas', B + 'fill:var(--ad-t)', g5);
    /* painel */
    var gT = el('g', {});
    var pT = tx(400, 40, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)', gT);
    var pL = []; for (var j = 0; j < 10; j++) pL.push(tx(400, 68 + 20 * j, '', 'font-size:14px;fill:var(--tinta)', gT));
    var E = [
      { tit: '1 · Monossacarídeo', s: 'É uma unidade de açúcar, que não se quebra em açúcar menor. Glicose e frutose têm a mesma fórmula, C₆H₁₂O₆, mas formas diferentes. A glicose é o combustível principal da respiração celular.' },
      { tit: '2 · Dissacarídeo', s: 'Duas unidades se ligam (ligação glicosídica) e sai uma molécula de água. Glicose + frutose = sacarose, o açúcar comum. Na digestão a água entra de volta e separa as duas.' },
      { tit: '3 · Reserva de energia', s: 'Para guardar glicose, a célula liga centenas a milhares delas numa cadeia: um polissacarídeo. Plantas guardam amido; animais guardam glicogênio, no fígado e no músculo, que o quebra durante a contração.' },
      { tit: '4 · Celulose', s: 'A celulose também é uma cadeia de milhares de glicoses, mas reta. As cadeias se alinham e se prendem umas às outras, formando fibras: a parede da célula vegetal. O papel é feito dessas fibras.' },
      { tit: '5 · Classificar', s: 'Para classificar, descubra a molécula e conte as unidades. Cuidado com a ordem pedida no enunciado: não é a ordem decorada mono, di, poli.' }
    ];
    E.forEach(function (e) { e.L = quebra(e.s, 30); });
    var _desenha = function (t) {
      var f = t < 2.8 ? 0 : t < 5.6 ? 1 : t < 8.4 ? 2 : t < 11.2 ? 3 : 4;
      pT.textContent = E[f].tit; pL.forEach(function (l, i) { l.textContent = E[f].L[i] || ''; });
      vis(g1, f === 0); vis(g2, f === 1); vis(g3, f === 2); vis(g4, f === 3); vis(g5, f === 4);
      var u = cl((t - [0, 2.8, 5.6, 8.4, 11.2][f]) / 2.8);
      if (f === 1) {
        var a = ease(u / .45);
        mv(dG, lerp(80, 136, a), 120); mv(dF, lerp(300, 242, a), 120);
        op(lig, cl((u - .45) / .1)); op(ligL, cl((u - .45) / .1));
        mv(h2o, 190, lerp(92, 62, ease((u - .45) / .3))); op(h2o, u > .45 ? 1 - cl((u - .85) / .15) : 0);
        op(dL, cl((u - .55) / .15));
      }
      if (f === 2) {
        am.forEach(function (h, i) { op(h, cl((u * 1.6 - i * .05) / .1)); });
        ggH.forEach(function (h, i) { op(h, cl((u * 1.6 - .2 - i * .015) / .1)); });
      }
      if (f === 4) rows.forEach(function (r, k) { op(r, cl((u - k * .12) / .1)); });
    };
    /* mais tempo de leitura: cada etapa dura 3.6 s; o desenho foi feito na escala antiga e e remapeado */
    var _O = [0, 2.8, 5.6, 8.4, 11.2, 14], _N = [0.0, 3.6, 7.2, 10.8, 14.4, 18.0];
    function _map(t, A, B) { for (var i = A.length - 2; i >= 0; i--) if (t >= A[i]) return B[i] + (Math.min(t, A[i + 1]) - A[i]) * (B[i + 1] - B[i]) / (A[i + 1] - A[i]); return t; }
    var _d0 = _desenha; _desenha = function (t) { _d0(_map(t, _N, _O)); };
    function _fix(o) { var c = o.congela; if (c) o.congela = function (q) { return _map(c(q), _O, _N); }; return o; }
    return fimResposta(VIS.def['carboidratos-mono-di-poli'], svg, _desenha, 18, RESP, qid, _fix({ x: 390, y: 14, w: 244, quebra: 28, semEsmaecer: true, esconde: gT, congela: function (q) { return q === 'W42286f1' ? 13.9 : 8.3; } }));
  }
};
VIS.liga('carboidratos-mono-di-poli', ['Wf5784a9', 'W46900f2', 'W42286f1']);
