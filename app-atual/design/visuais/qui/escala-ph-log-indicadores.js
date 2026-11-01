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
'P3fbdef4': [
'Por isso a resposta é B',
'Suco gástrico: pH 2 → [H⁺] = 10⁻² mol/L. Saliva: pH 7 → 10⁻⁷ mol/L.',
'Razão: 10⁻² ÷ 10⁻⁷ = 10⁵. São 5 degraus de pH, cada um vale ×10:',
'100 000 vezes mais H⁺, não 5 vezes.'
],
'Pf211e30': [
'Por isso a resposta é A',
'pH negativo existe, mas é com [H⁺] maior que 1 mol/L: muito ácido.',
'[H⁺] = 10 mol/L dá pH −1. A IA ligou pH negativo a meio básico:',
'H⁺ muito baixo dá pH ALTO (10⁻¹⁵ mol/L → pH 15). Está errada.'
],
'P064d54a': [
'Por isso a resposta é E',
'Na água pura [H⁺] = [OH⁻] em qualquer temperatura: ela é neutra.',
'Aquecer aumenta o Kw; as duas concentrações sobem juntas',
'e o pH do ponto neutro fica abaixo de 7, sem a água ficar ácida.'
],
'P41156ac': [
'Por isso a resposta é A',
'Azul de bromotimol: amarelo abaixo de 6,0 e azul acima de 7,6.',
'NaCl (pH 7) fica verde, entre as duas cores: compartimento 1.',
'HCl 0,1 mol/L (pH 1) fica amarelo: 2. NaOH 0,1 mol/L (pH 13) azul: 3.'
],
'P4ac2e23': [
'Por isso a resposta é B',
'[H⁺] = 10⁻ˣ mol/L dá pH = x: as amostras têm pH 4,0, 7,9 e 9,3.',
'O enunciado dá a viragem do vermelho de metila entre 4,8 e 6,0:',
'acima de 6,0 fica amarelo, ou seja, só as amostras 2 e 3.'
],
'P83e565d': [
'Por isso a resposta é C',
'Fenolftaleína: HInd (incolor) ⇌ H⁺ + Ind⁻ (rosa-avermelhado).',
'O OH⁻ consome o H⁺ (vira água), e o equilíbrio anda para a',
'direita para repor H⁺: forma mais Ind⁻ e a mensagem aparece.'
],
'Pfbabaa0': [
'Por isso a resposta é A',
'NaCl: ácido forte + base forte, nenhum íon hidrolisa: pH 7.',
'Acetato de amônio: Ka do ácido = Kb da base (1,8 × 10⁻⁵):',
'as duas hidrólises se cancelam e o pH fica ≈ 7. Sais 1 e 3.'
]
};
VIS.def['escala-ph-log-indicadores'] = {
  tit: 'Escala de pH: cada unidade vale 10 vezes',
  fontes: ['OpenStax, Chemistry 2e, 14.2 pH and pOH — https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh', 'OpenStax, Chemistry 2e, 14.7 Acid-Base Titrations (indicadores) — https://openstax.org/books/chemistry-2e/pages/14-7-acid-base-titrations', 'Wikipedia (en), pH indicator (faixas de viragem) — https://en.wikipedia.org/wiki/PH_indicator', 'Wikipedia (en), Self-ionization of water (pKw: 14,95 a 0 °C; 13,99 a 25 °C; 13,26 a 50 °C) — https://en.wikipedia.org/wiki/Self-ionization_of_water'],
  tipo: 'anim', dur: 15,
  marcas: [[0, 'Escala log'], [3, 'Fora de 0–14'], [6, 'Neutro e T'], [9, 'Indicadores'], [12, 'Sais']],
  cred: 'Animação feita para o app. pH calculado no código (−log[H⁺]); faixas de viragem aproximadas, que variam um pouco entre fontes; sais a 0,1 mol/L e 25 °C.',
  nota: 'pH = −log[H⁺]: subir 1 no pH é dividir o [H⁺] por 10. A régua 0–14 e o neutro em 7 valem para água a 25 °C (Kw = 1,0 × 10⁻¹⁴); o neutro é sempre [H⁺] = [OH⁻], ou seja, pH = pKw ÷ 2.',
  monta: function (svg, qid) {
    var NS = 'http://www.w3.org/2000/svg';
    function el(n, a, pai) { var x = document.createElementNS(NS, n); for (var k in a) x.setAttribute(k, a[k]); (pai || svg).appendChild(x); return x; }
    function tx(x, y, s, st, pai) { var t = el('text', { x: x, y: y, style: st || '' }, pai); t.textContent = s; return t; }
    function cl(u) { return u < 0 ? 0 : u > 1 ? 1 : u; }
    function ease(u) { u = cl(u); return u * u * (3 - 2 * u); }
    function op(o, v) { o.style.opacity = (+v).toFixed(2); }
    function vg(v) { return String(v).replace('.', ','); }
    function sup(n) { var m = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }; return String(n).split('').map(function (c) { return m[c]; }).join(''); }
    function cient(v) { var e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e); if (m >= 9.95) { m /= 10; e += 1; } return vg(m.toFixed(1)) + ' × 10' + sup(e); }
    var ACI = '#c0392b', BAS = '#2b5fb0', NEU = '#5a8f3a';
    svg.setAttribute('viewBox', '0 0 640 370');
    var D = 3;
    function X(p) { return 76 + 34 * p; }
    var RY = 84, RH = 22;
    /* regua */
    var defs = el('defs', {});
    var gr = el('linearGradient', { id: 'phg-rg', x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
    [[0, ACI, .55], [.5, '#9a9a9a', .18], [1, BAS, .55]].forEach(function (s) { el('stop', { offset: s[0], style: 'stop-color:' + s[1] + ';stop-opacity:' + s[2] }, gr); });
    tx(16, 26, 'pH = −log [H⁺]', 'font-size:18px;font-weight:700;fill:var(--tinta)');
    tx(170, 26, 'ou seja, [H⁺] = 10⁻ᵖᴴ mol/L', 'font-size:16px;fill:var(--lapis)');
    var ext = el('g', {});   /* trechos fora de 0-14 */
    el('rect', { x: X(-1), y: RY, width: 34, height: RH, style: 'fill:' + ACI + ';opacity:.75' }, ext);
    el('rect', { x: X(14), y: RY, width: 34, height: RH, style: 'fill:' + BAS + ';opacity:.75' }, ext);
    el('rect', { x: X(0), y: RY, width: X(14) - X(0), height: RH, style: 'fill:url(#phg-rg);stroke:var(--tinta);stroke-width:1.4' });
    var NUM = [];
    for (var p = -1; p <= 15; p++) {
      var dentro = p >= 0 && p <= 14;
      var tk = el('line', { x1: X(p), x2: X(p), y1: RY + RH, y2: RY + RH + 6, style: 'stroke:var(--tinta);stroke-width:1.2' }, dentro ? svg : ext);
      NUM.push(tx(X(p), RY + RH + 22, p < 0 ? '−1' : String(p), 'font-size:14px;font-weight:600;fill:var(--tinta);text-anchor:middle', dentro ? svg : ext));
    }
    tx(X(0) + 4, RY - 8, 'ácido', 'font-size:14px;font-weight:700;fill:' + ACI);
    tx(X(14) - 4, RY - 8, 'básico', 'font-size:14px;font-weight:700;fill:' + BAS + ';text-anchor:end');
    var neu = tx(X(7), RY - 8, 'neutro (25 °C)', 'font-size:14px;fill:var(--lapis);text-anchor:middle');
    var area = 140;   /* topo da area de cada etapa */
    function marcador(cor, pai) { var g = el('g', {}, pai); el('path', { d: 'M0 ' + (RY - 2) + ' l-7 -12 h14 z', style: 'fill:' + cor }, g); el('line', { x1: 0, x2: 0, y1: RY - 2, y2: RY + RH, style: 'stroke:' + cor + ';stroke-width:2.5' }, g); return g; }
    /* ===== etapa 1: degraus de 10 ===== */
    var e1 = el('g', {});
    var m2 = marcador(ACI, e1), m7 = marcador(NEU, e1);
    m2.setAttribute('transform', 'translate(' + X(2) + ' 0)'); m7.setAttribute('transform', 'translate(' + X(7) + ' 0)');
    tx(X(2), 58, '[H⁺] = 10⁻²', 'font-size:14px;font-weight:700;fill:' + ACI + ';text-anchor:middle', e1);
    tx(X(7), 58, '[H⁺] = 10⁻⁷', 'font-size:14px;font-weight:700;fill:' + NEU + ';text-anchor:middle', e1);
    var ARC = [];
    for (var k = 0; k < 5; k++) {
      var xa = X(7 - k), xb = X(6 - k), g = el('g', {}, e1);
      el('path', { d: 'M' + xa + ' 140 Q' + ((xa + xb) / 2) + ' 168 ' + xb + ' 140 m5 4 l-5 -4 l1 6', style: 'fill:none;stroke:var(--ad-c);stroke-width:2' }, g);
      tx((xa + xb) / 2, 180, '×10', 'font-size:14px;font-weight:700;fill:var(--ad-t);text-anchor:middle', g);
      ARC.push(g);
    }
    var r1 = tx(X(4.5), 210, '10 × 10 × 10 × 10 × 10 = 10⁵ = ' + (Math.pow(10, 7 - 2)).toLocaleString('pt-BR') + ' vezes mais H⁺', 'font-size:15px;font-weight:700;fill:var(--tinta);text-anchor:middle', e1);
    /* ===== etapa 2: fora de 0-14 ===== */
    var e2 = el('g', {});
    var CAS = [[10, ACI], [2, ACI], [1e-15, BAS]].map(function (c) { var ph = -Math.log10(c[0]); return { c: c[0], ph: ph, cor: c[1] }; });
    CAS.forEach(function (c, i) {
      c.g = el('g', {}, e2); var m = marcador(c.cor, c.g); m.setAttribute('transform', 'translate(' + X(c.ph).toFixed(1) + ' 0)');
      var cs = c.c >= 1 ? String(c.c) : '10⁻¹⁵';
      var phs = (Math.round(c.ph * 100) / 100).toFixed(c.ph % 1 ? 2 : 0).replace('.', ',').replace('-', '−');
      var yy = i === 0 ? 210 : 172, anc = i === 2 ? 'end' : 'start', xx = i === 2 ? X(c.ph) - 8 : X(c.ph) + 8;
      tx(xx, yy, '[H⁺] = ' + cs + ' mol/L → pH = ' + phs, 'font-size:15px;font-weight:700;fill:' + c.cor + ';text-anchor:' + anc, c.g);
      el('path', { d: 'M' + X(c.ph).toFixed(1) + ' 132 V' + (yy - 4), style: 'fill:none;stroke:' + c.cor + ';stroke-width:1.4;stroke-dasharray:3 3' }, c.g);
    });
    /* ===== etapa 3: neutro e temperatura ===== */
    var e3 = el('g', {});
    var TK = [[0, 14.95], [25, 13.99], [50, 13.26]].map(function (a) { return { T: a[0], pkw: a[1], ph: a[1] / 2 }; });
    var mN = marcador(NEU, e3);
    var nT = tx(0, 58, '', 'font-size:14px;font-weight:700;fill:' + NEU + ';text-anchor:middle', e3);
    var bar = el('g', {}, e3);
    var bH = el('rect', { x: 196, width: 36, style: 'fill:' + ACI + ';opacity:.8' }, bar), bO = el('rect', { x: 244, width: 36, style: 'fill:' + BAS + ';opacity:.8' }, bar);
    el('line', { x1: 186, x2: 290, y1: 200, y2: 200, style: 'stroke:var(--tinta);stroke-width:1.4' }, bar);
    tx(214, 216, 'H⁺', 'font-size:14px;font-weight:700;fill:' + ACI + ';text-anchor:middle', bar); tx(262, 216, 'OH⁻', 'font-size:14px;font-weight:700;fill:' + BAS + ';text-anchor:middle', bar);
    var tT = tx(310, 168, '', 'font-size:16px;font-weight:700;fill:var(--tinta)', e3), tK = tx(310, 192, '', 'font-size:15px;fill:var(--tinta)', e3), tP = tx(310, 214, '', 'font-size:15px;fill:var(--tinta)', e3);
    tx(16, 168, 'água pura', 'font-size:15px;font-weight:700;fill:var(--tinta)', e3);
    tx(16, 188, '[H⁺] = [OH⁻]', 'font-size:15px;fill:var(--tinta)', e3);
    /* ===== etapa 4: indicadores ===== */
    var e4 = el('g', {});
    var IND = [
      { n: 'vermelho de metila', a: 4.4, b: 6.2, c1: '#d0312d', c2: '#e8c21c', y: 146 },
      { n: 'azul de bromotimol', a: 6.0, b: 7.6, c1: '#e8c21c', c2: '#2a66c4', y: 172 },
      { n: 'fenolftaleína', a: 8.3, b: 10.0, c1: '#f7f3ee', c2: '#d6338a', y: 198 }
    ];
    IND.forEach(function (d, i) {
      var g = el('g', {}, e4), id = 'phg-i' + i, lg = el('linearGradient', { id: id, x1: 0, x2: 1, y1: 0, y2: 0 }, defs);
      el('stop', { offset: 0, style: 'stop-color:' + d.c1 }, lg); el('stop', { offset: 1, style: 'stop-color:' + d.c2 }, lg);
      var x0 = X(d.a - 1.6), x1 = X(d.b + 1.6);
      el('rect', { x: x0, y: d.y, width: X(d.a) - x0, height: 16, style: 'fill:' + d.c1 + ';stroke:var(--linha)' }, g);
      el('rect', { x: X(d.a), y: d.y, width: X(d.b) - X(d.a), height: 16, style: 'fill:url(#' + id + ');stroke:var(--tinta);stroke-width:1.2' }, g);
      el('rect', { x: X(d.b), y: d.y, width: x1 - X(d.b), height: 16, style: 'fill:' + d.c2 + ';stroke:var(--linha)' }, g);
      var dir = i < 2;
      tx(dir ? x1 + 8 : x0 - 8, d.y + 13, d.n + ' ' + vg(d.a.toFixed(1)) + '–' + vg(d.b.toFixed(1)), 'font-size:14px;font-weight:700;fill:var(--tinta);text-anchor:' + (dir ? 'start' : 'end'), g);
      d.g = g;
    });
    /* ===== etapa 5: sais ===== */
    var e5 = el('g', {});
    var Kw = 1e-14, Kb = 1.8e-5, Ka = 1.8e-5, C = .1;
    var phNH4Cl = -Math.log10(Math.sqrt(Kw / Kb * C)), phAc = 14 + Math.log10(Math.sqrt(Kw / Ka * C));
    var SAL = [
      { n: 'HCl', ph: -Math.log10(C), cor: ACI, y: 160 },
      { n: 'NH₄Cl', ph: phNH4Cl, cor: '#c86a2a', y: 184 },
      { n: 'NaCl e CH₃COONH₄', ph: 7, cor: NEU, y: 208 },
      { n: 'CH₃COONa', ph: phAc, cor: '#3d7fb0', y: 184 },
      { n: 'NaOH', ph: 14 + Math.log10(C), cor: BAS, y: 160 }
    ];
    SAL.forEach(function (s) {
      s.g = el('g', {}, e5);
      el('circle', { cx: X(s.ph).toFixed(1), cy: RY + RH / 2, r: 6, style: 'fill:' + s.cor + ';stroke:var(--folha);stroke-width:2' }, s.g);
      el('line', { x1: X(s.ph).toFixed(1), x2: X(s.ph).toFixed(1), y1: 132, y2: s.y - 14, style: 'stroke:' + s.cor + ';stroke-width:1.3;stroke-dasharray:3 3' }, s.g);
      var phs = Math.abs(s.ph - Math.round(s.ph)) < .01 ? String(Math.round(s.ph)) : '≈ ' + vg(s.ph.toFixed(1));
      tx(X(s.ph), s.y, s.n, 'font-size:14px;font-weight:700;fill:' + s.cor + ';text-anchor:middle', s.g);
    });
    /* ===== painel de texto ===== */
    el('line', { x1: 16, x2: 624, y1: 244, y2: 244, style: 'stroke:var(--linha);stroke-width:1.2' });
    var p0 = tx(16, 268, '', 'font-size:17px;font-weight:700;fill:var(--ad-t)'), P = [292, 316, 340, 364].map(function (y) { return tx(16, y, '', 'font-size:15px;fill:var(--tinta)'); });
    var TXT = [
      ['Escala logarítmica: cada degrau de pH vale ×10', 'pH 2 (suco gástrico): [H⁺] = 10⁻² mol/L. pH 7 (saliva): 10⁻⁷ mol/L.', 'De 7 para 2 são 5 degraus, e cada degrau multiplica o [H⁺] por 10.', 'Razão = 10⁻² ÷ 10⁻⁷ = 10⁵ (subtraia os expoentes).'],
      ['A escala não para em 0 nem em 14', '[H⁺] maior que 1 mol/L: o log é positivo e o pH fica negativo.', 'pH negativo = ácido muito concentrado, nunca básico.', '[H⁺] menor que 10⁻¹⁴ mol/L dá pH acima de 14 (muito básico).'],
      ['Neutro é [H⁺] = [OH⁻]; o 7 só vale a 25 °C', 'Kw = [H⁺]·[OH⁻] aumenta quando a água esquenta.', 'As duas concentrações sobem juntas e o pH neutro (pKw ÷ 2) desce.', 'Água pura a 50 °C tem pH ≈ 6,6 e continua neutra.'],
      ['Indicador: um ácido fraco com duas cores', 'HInd ⇌ H⁺ + Ind⁻: cada forma tem uma cor. Abaixo da faixa', 'predomina HInd; acima, Ind⁻. OH⁻ consome H⁺ e o equilíbrio vai', 'para a direita (fenolftaleína fica rosa). Dentro da faixa: cor mista.'],
      ['Sal na água: quem veio de pai fraco hidrolisa', 'NaCl (forte + forte): nada hidrolisa, pH 7. NH₄Cl: o NH₄⁺ libera H⁺,', 'pH ≈ ' + vg(phNH4Cl.toFixed(1)) + '. CH₃COONa: o acetato capta H⁺ e sobra OH⁻, pH ≈ ' + vg(phAc.toFixed(1)) + '.', 'CH₃COONH₄: Ka = Kb, as duas hidrólises se cancelam, pH ≈ 7.']
    ];
    var _desenha = function (t) {
      var i = Math.min(4, Math.floor(t / D)), u = t - i * D;
      op(e1, i === 0 ? 1 : 0); op(e2, i === 1 ? 1 : 0); op(e3, i === 2 ? 1 : 0); op(e4, i === 3 ? 1 : 0); op(e5, i === 4 ? 1 : 0);
      op(neu, i === 0 || i === 2 ? 0 : 1);
      op(ext, i === 1 ? ease(u / .5) : i === 0 ? 0 : .35);
      ARC.forEach(function (a, k) { op(a, i === 0 ? cl((u - .3 - .35 * k) / .25) : 0); });
      op(r1, i === 0 ? cl((u - 2.1) / .3) : 0);
      CAS.forEach(function (c, k) { op(c.g, cl((u - .3 - .7 * k) / .3)); });
      /* neutro: 25 -> 50 -> 0 C */
      var ph, T, pkw;
      if (u < 1) { T = 25; pkw = TK[1].pkw; } else if (u < 2) { var a = ease((u - 1) / .5); T = 25 + 25 * a; pkw = TK[1].pkw + (TK[2].pkw - TK[1].pkw) * a; } else { T = 50; pkw = TK[2].pkw; }
      ph = pkw / 2;
      mN.setAttribute('transform', 'translate(' + X(ph).toFixed(1) + ' 0)'); nT.setAttribute('x', X(ph).toFixed(1)); nT.textContent = 'neutro: pH ' + vg(ph.toFixed(2));
      var conc = Math.pow(10, -ph), hh = 24 + 26 * (Math.log10(conc) + 7.6);   /* altura em escala log */
      bH.setAttribute('y', (200 - hh).toFixed(1)); bH.setAttribute('height', hh.toFixed(1)); bO.setAttribute('y', (200 - hh).toFixed(1)); bO.setAttribute('height', hh.toFixed(1));
      tT.textContent = 'água a ' + Math.round(T) + ' °C';
      tK.textContent = 'Kw = ' + cient(Math.pow(10, -pkw)) + ' (pKw = ' + vg(pkw.toFixed(2)) + ')';
      tP.textContent = '[H⁺] = [OH⁻] = ' + cient(conc) + ' mol/L';
      IND.forEach(function (d, k) { op(d.g, i === 3 ? cl((u - .2 - .5 * k) / .3) : 0); });
      SAL.forEach(function (s, k) { op(s.g, i === 4 ? cl((u - .2 - .35 * k) / .3) : 0); });
      var L = TXT[i]; p0.textContent = L[0]; P.forEach(function (q, j) { q.textContent = L[j + 1] || ''; });
    };
    var CG = { 'P3fbdef4': D - .05, 'Pf211e30': 2 * D - .05, 'P064d54a': 3 * D - .05, 'P83e565d': 4 * D - .05, 'P4ac2e23': 4 * D - .05, 'P41156ac': 5 * D - .05, 'Pfbabaa0': 5 * D - .05 };
    return fimResposta(VIS.def['escala-ph-log-indicadores'], svg, _desenha, 5 * D, RESP, qid, {
      base: true, x: 8, w: 624, semEsmaecer: true,
      congela: function (q) { return CG[q] !== undefined ? CG[q] : 5 * D - .05; }
    });
  }
};
VIS.liga('escala-ph-log-indicadores', ['P3fbdef4', 'Pf211e30', 'P064d54a', 'P41156ac', 'P4ac2e23', 'P83e565d', 'Pfbabaa0']);
