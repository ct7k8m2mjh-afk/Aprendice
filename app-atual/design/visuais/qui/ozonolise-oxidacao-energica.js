/* Quebra da dupla C=C: ozonolise (6-metil-hept-5-en-2-ona; geraniol -> propanona -> propan-2-ol)
   e oxidacao energica (2,4-dimetil-pent-1-eno -> CO2 + H2O + cetona), com o resumo pelos H de cada carbono. */
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
'P7eb084a': ['Por isso a resposta é B',
'O C5 da dupla tem 1 H: vira CHO (aldeído). O C2 já era C=O entre dois C',
'(cetona). X = CH₃–CO–CH₂–CH₂–CHO: aldeído e cetona.'],
'Pd859d1b': ['Por isso a resposta é A',
'O C da ponta, com dois CH₃ e nenhum H, vira C=O: X é a propanona.',
'Com H₂, o C=O vira CH–OH: propan-2-ol, da função álcool.'],
'Wea74e81': ['Por isso a resposta é E',
'O C1 (=CH₂, com 2 H) vai até CO₂ e H₂O. O C2 (sem H) para em cetona:',
'CH₃–CO–CH₂–CH(CH₃)–CH₃, a 4-metil-2-pentanona.']
};
VIS.def['ozonolise-oxidacao-energica'] = {
  tit: 'Quebra da dupla C=C: ozonólise e oxidação enérgica',
  fontes: ['OpenStax, Organic Chemistry (McMurry), 8.8 Oxidation of Alkenes: Cleavage to Carbonyl Compounds (O₃ e KMnO₄) — https://openstax.org/books/organic-chemistry/pages/8-8-oxidation-of-alkenes-cleavage-to-carbonyl-compounds', 'Wikipedia (en), Ozonolysis — https://en.wikipedia.org/wiki/Ozonolysis', 'Wikipedia (en), Geraniol; Acetone; Isopropyl alcohol — https://en.wikipedia.org/wiki/Geraniol'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Ozonólise'], [4.5, 'Geraniol'], [8, 'Enérgica'], [12, 'Resumo']],
  cred: 'Animação feita para o app (fórmulas condensadas; ozonólise seguida de água com zinco, que impede o aldeído de virar ácido).',
  nota: 'Os dois reagentes cortam a dupla C=C e põem =O em cada carbono dela. O que sai depende dos H de cada carbono da dupla: sem H, cetona; com 1 H, aldeído (ozonólise) ou ácido (oxidação enérgica); com 2 H, metanal (ozonólise) ou CO₂ + H₂O (oxidação enérgica).',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function lerp(a, b, u) { return a + (b - a) * u; }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    svg.setAttribute('viewBox', '0 0 640 350');
    var T1 = 4.5, T2 = 8, T3 = 12, TF = 15;
    var NOVO = '#c0392b', ALD = '#b06a1a', CET = '#2b6cb0', ACI = '#8a5a9e', OK = '#2f8a5b';
    var LG = 'stroke:var(--tinta);stroke-width:2.2;fill:none;stroke-linecap:round';
    var AT = 'font-size:17px;font-weight:700;text-anchor:middle;fill:var(--tinta)';
    function larg(s) { var n = 0; for (var i = 0; i < s.length; i++) n += '₀₁₂₃₄₅₆₇₈₉⁺'.indexOf(s[i]) >= 0 ? .55 : s[i] === ' ' ? .4 : s[i] === '(' || s[i] === ')' ? .5 : 1; return n * 10.8; }
    /* cadeia condensada: {l, s:[{l,d,b,c,g}], b (ligacao com o anterior), c}; s.g = grupo proprio (para aparecer depois) */
    function cadeia(g, x, y, toks, gap) {
      gap = gap || 18; var pos = [];
      toks.forEach(function (k, i) {
        var w = larg(k.l), gg = k.g || g;
        if (i) {
          var b = k.b === undefined ? 1 : k.b, gb = k.gb || g;
          if (b === 1) el('path', { d: 'M' + (x + 3) + ' ' + y + ' h' + (gap - 6), style: LG }, gb);
          if (b === 2) el('path', { d: 'M' + (x + 3) + ' ' + (y - 3.5) + ' h' + (gap - 6) + ' M' + (x + 3) + ' ' + (y + 3.5) + ' h' + (gap - 6), style: LG }, gb);
          x += gap;
        }
        var cx = x + w / 2;
        tx(cx, y + 6, k.l, AT.replace('var(--tinta)', k.c || 'var(--tinta)'), gg);
        (k.s || []).forEach(function (s) {
          var gs = s.g || gg;
          if (s.b === 2) el('path', { d: 'M' + (cx - 3.5) + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 30) + ' M' + (cx + 3.5) + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 30), style: LG }, gs);
          else el('path', { d: 'M' + cx + ' ' + (y + s.d * 13) + ' V' + (y + s.d * 30), style: LG }, gs);
          tx(cx, y + s.d * 42 + 6, s.l, AT.replace('var(--tinta)', s.c || 'var(--tinta)'), gs);
        });
        pos.push(cx); x += w;
      });
      pos.fim = x; return pos;
    }
    function largCad(toks, gap) { var w = 0; toks.forEach(function (k, i) { w += larg(k.l) + (i ? (gap || 18) : 0); }); return w; }
    function tag(pai, x, y, s, cor) { var w = larg(s) * .8 + 16, g = el('g', {}, pai); el('rect', { x: x - w / 2, y: y - 12, width: w, height: 24, rx: 12, style: 'fill:color-mix(in srgb,' + cor + ' 12%,var(--folha));stroke:' + cor + ';stroke-width:1.6' }, g); tx(x, y + 5, s, 'font-size:14px;font-weight:700;text-anchor:middle;fill:' + cor, g); return g; }
    /* quebra animada: pedacos E (esquerda) e D (direita), ponte = a dupla; novos =O em grupos proprios */
    function quebra(pai, y, toksE, toksD, xIni) {
      var o = { E: el('g', {}, pai), D: el('g', {}, pai), ponte: el('g', {}, pai), oE: el('g', {}, pai), oD: el('g', {}, pai) };
      var w = largCad(toksE) + 18 + largCad(toksD), x0 = xIni !== undefined ? xIni : 320 - w / 2;
      toksE[toksE.length - 1].s = (toksE[toksE.length - 1].s || []).concat([{ l: 'O', d: -1, b: 2, c: NOVO, g: o.oE }]);
      toksD[0].s = (toksD[0].s || []).concat([{ l: 'O', d: -1, b: 2, c: NOVO, g: o.oD }]);
      var pe = cadeia(o.E, x0, y, toksE); var xd = pe.fim + 18;
      el('path', { d: 'M' + (pe.fim + 3) + ' ' + (y - 3.5) + ' h12 M' + (pe.fim + 3) + ' ' + (y + 3.5) + ' h12', style: LG }, o.ponte);
      var pd = cadeia(o.D, xd, y, toksD);
      o.xE = pe[pe.length - 1]; o.xD = pd[0]; o.corte = pe.fim + 9;
      o.cut = el('path', { d: 'M' + o.corte + ' ' + (y - 40) + ' V' + (y + 40), style: 'stroke:' + NOVO + ';stroke-width:2.4;stroke-dasharray:6 4' }, pai);
      o.anda = function (u) {
        o.E.setAttribute('transform', 'translate(' + (-28 * u).toFixed(1) + ' 0)'); o.oE.setAttribute('transform', 'translate(' + (-28 * u).toFixed(1) + ' 0)');
        o.D.setAttribute('transform', 'translate(' + (28 * u).toFixed(1) + ' 0)'); o.oD.setAttribute('transform', 'translate(' + (28 * u).toFixed(1) + ' 0)');
        op(o.ponte, u < .02 ? 1 : 0); op(o.oE, cl((u - .6) / .4)); op(o.oD, cl((u - .6) / .4)); op(o.cut, u > 0 && u < 1 ? 1 : 0);
      };
      return o;
    }
    /* ===== etapa 1: ozonolise da 6-metil-hept-5-en-2-ona ===== */
    var g1 = el('g', {});
    tx(20, 24, '6-metil-hept-5-en-2-ona  +  O₃, depois H₂O e Zn', 'font-size:15px;font-weight:700;fill:var(--lapis)', g1);
    var q1 = quebra(g1, 100, [{ l: 'CH₃' }, { l: 'C', s: [{ l: 'O', d: -1, b: 2 }] }, { l: 'CH₂' }, { l: 'CH₂' }, { l: 'CH', c: ALD }], [{ l: 'C', c: CET, s: [{ l: 'CH₃', d: 1 }] }, { l: 'CH₃' }]);
    var t1a = tag(g1, q1.xE - 90, 168, 'C5: 1 H → aldeído', ALD), t1b = tag(g1, q1.xD + 90, 168, 'C6: sem H → cetona', CET);
    var n1 = el('g', {}, g1);
    tx(q1.xE - 90, 202, 'X: aldeído + cetona', 'font-size:15px;font-weight:700;text-anchor:middle;fill:var(--tinta)', n1);
    tx(q1.xD + 90, 202, 'propanona', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + CET, n1);
    /* ===== etapa 2: geraniol ===== */
    var g2 = el('g', {});
    tx(20, 24, 'geraniol: a dupla da ponta é cortada', 'font-size:15px;font-weight:700;fill:var(--lapis)', g2);
    var q2 = quebra(g2, 84, [{ l: 'HOCH₂' }, { l: 'CH' }, { l: 'C', b: 2, s: [{ l: 'CH₃', d: 1 }] }, { l: 'CH₂' }, { l: 'CH₂' }, { l: 'CH', c: ALD }], [{ l: 'C', c: CET, s: [{ l: 'CH₃', d: 1 }] }, { l: 'CH₃' }], 40);
    var t2 = tag(g2, q2.xD + 122, 128, 'X = propanona', CET);
    var red = el('g', {}, g2), y2 = 192;
    var r1 = cadeia(red, 40, y2, [{ l: 'CH₃' }, { l: 'C', c: CET, s: [{ l: 'O', d: -1, b: 2, c: CET }] }, { l: 'CH₃' }]);
    tx(r1.fim + 34, y2 + 6, '+ H₂', AT, red);
    el('path', { d: 'M' + (r1.fim + 66) + ' ' + y2 + ' h56 m-9 -6 l9 6 l-9 6', style: 'fill:none;stroke:var(--tinta);stroke-width:2' }, red);
    tx(r1.fim + 94, y2 - 12, 'redução', 'font-size:14px;font-weight:700;text-anchor:middle;fill:var(--lapis)', red);
    var r2 = cadeia(red, r1.fim + 136, y2, [{ l: 'CH₃' }, { l: 'CH', c: OK, s: [{ l: 'OH', d: -1, c: OK }] }, { l: 'CH₃' }]);
    tx(r2.fim + 14, y2 + 6, 'propan-2-ol (álcool)', 'font-size:15px;font-weight:700;fill:' + OK, red);
    /* ===== etapa 3: oxidacao energica ===== */
    var g3 = el('g', {});
    tx(20, 24, '2,4-dimetil-pent-1-eno  +  KMnO₄, H⁺, calor', 'font-size:15px;font-weight:700;fill:var(--lapis)', g3);
    var q3 = quebra(g3, 96, [{ l: 'CH₂', c: ACI }], [{ l: 'C', c: CET, s: [{ l: 'CH₃', d: 1 }] }, { l: 'CH₂' }, { l: 'CH', s: [{ l: 'CH₃', d: 1 }] }, { l: 'CH₃' }]);
    var t3a = tag(g3, q3.xE - 40, 168, 'C1: 2 H', ACI), t3b = tag(g3, q3.xD + 120, 168, 'C2: sem H → cetona', CET);
    var co2 = el('g', {}, g3);
    tx(q3.xE - 40, 202, '→ CO₂ + H₂O', 'font-size:17px;font-weight:700;text-anchor:middle;fill:' + ACI, co2);
    tx(q3.xD + 120, 202, '4-metilpentan-2-ona', 'font-size:15px;font-weight:700;text-anchor:middle;fill:' + CET, co2);
    /* ===== etapa 4: resumo ===== */
    var g4 = el('g', {});
    var X = [20, 250, 450], Y = [32, 80, 128, 176];
    tx(X[0], Y[0], 'C da dupla com…', 'font-size:15px;font-weight:700;fill:var(--lapis)', g4);
    tx(X[1], Y[0], 'ozonólise (O₃, Zn)', 'font-size:15px;font-weight:700;fill:var(--lapis)', g4);
    tx(X[2], Y[0], 'enérgica (KMnO₄)', 'font-size:15px;font-weight:700;fill:var(--lapis)', g4);
    var LIN = [['nenhum H', 'cetona', CET, 'cetona', CET], ['1 H', 'aldeído', ALD, 'ácido carboxílico', ACI], ['2 H (=CH₂)', 'metanal', ALD, 'CO₂ + H₂O', ACI]];
    var linhas = LIN.map(function (r, i) {
      var g = el('g', {}, g4), y = Y[i + 1];
      el('line', { x1: 14, x2: 626, y1: y - 26, y2: y - 26, style: 'stroke:var(--linha);stroke-width:1.2' }, g);
      tx(X[0], y, r[0], 'font-size:17px;font-weight:700;fill:var(--tinta)', g);
      tx(X[1], y, r[1], 'font-size:17px;font-weight:700;fill:' + r[2], g);
      tx(X[2], y, r[3], 'font-size:17px;font-weight:700;fill:' + r[4], g);
      return g;
    });
    /* ===== painel ===== */
    el('line', { x1: 12, x2: 628, y1: 218, y2: 218, style: 'stroke:var(--linha);stroke-width:1.5' });
    var P = [tx(14, 242, '', 'font-size:16px;font-weight:700;fill:var(--tinta)')];
    for (var j = 0; j < 3; j++) P.push(tx(14, 267 + 23 * j, '', 'font-size:15px;fill:var(--tinta)'));
    var TXT = [
      ['1. Ozonólise: a dupla C=C se parte', 'O O₃ (depois água e Zn) corta a dupla, e cada carbono dela ganha =O.', 'Carbono da dupla com 1 H vira aldeído (CHO); sem H, vira cetona.', 'O resto da cadeia não muda (o C=O do C2 já estava lá).'],
      ['2. Geraniol: a ponta (CH₃)₂C= vira propanona', 'Cortada a dupla da ponta, o carbono com dois CH₃ (sem H) vira C=O:', 'propanona (acetona), o produto X. Com H₂ (redução), o C=O vira', 'CH–OH: propan-2-ol, um álcool usado para limpar placas e circuitos.'],
      ['3. Oxidação enérgica: vai mais longe', 'KMnO₄ em ácido e a quente também corta a dupla, mas oxida mais:', 'o =CH₂ (2 H) vai até CO₂ + H₂O; um C com 1 H iria até ácido (COOH);', 'o C sem H para em cetona, porque não tem H para perder.'],
      ['4. Resumo: conte os H de cada C da dupla', 'Os dois métodos põem =O nos carbonos da dupla.', 'A diferença está no carbono que tem H: a oxidação enérgica', 'o leva até ácido ou CO₂; a ozonólise com Zn para em aldeído.']
    ];
    var _desenha = function (t) {
      var f = t < T1 ? 0 : t < T2 ? 1 : t < T3 ? 2 : 3;
      op(g1, f === 0 ? 1 : 0); op(g2, f === 1 ? 1 : 0); op(g3, f === 2 ? 1 : 0); op(g4, f === 3 ? 1 : 0);
      q1.anda(ease((t - .9) / 1.4)); op(t1a, cl((t - 2.4) / .4)); op(t1b, cl((t - 2.8) / .4)); op(n1, cl((t - 3.3) / .4));
      q2.anda(ease((t - T1 - .5) / 1.2)); op(t2, cl((t - T1 - 1.6) / .4)); op(red, cl((t - T1 - 2.2) / .5));
      q3.anda(ease((t - T2 - .6) / 1.3)); op(t3a, cl((t - T2 - 2) / .4)); op(t3b, cl((t - T2 - 2.3) / .4)); op(co2, cl((t - T2 - 2.7) / .4));
      op(q3.oE, 0);
      linhas.forEach(function (g, i) { op(g, cl((t - T3 - .2 - .6 * i) / .4)); });
      var L = TXT[f];
      for (var k = 0; k < 4; k++) P[k].textContent = L[k] || '';
    };
    return fimResposta(VIS.def['ozonolise-oxidacao-energica'], svg, _desenha, TF, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return q === 'P7eb084a' ? T1 - .01 : q === 'Pd859d1b' ? T2 - .01 : T3 - .01; }
    });
  }
};
VIS.liga('ozonolise-oxidacao-energica', ['P7eb084a', 'Pd859d1b', 'Wea74e81']);
